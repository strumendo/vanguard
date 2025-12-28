import { pool } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import type {
  CountryId,
  Difficulty,
  GameState,
  IdeologyPosition,
  PoliticsState,
  EconomyState,
  DiplomacyState,
  MilitaryState,
  SocialGroupState,
  ActiveEffect,
  DiplomaticRelation,
} from '../types/game.types.js';

export interface Game {
  id: string;
  userId: string;
  countryId: CountryId;
  difficulty: Difficulty;
  isActive: boolean;
  currentTurn: number;
  currentMonth: number;
  currentYear: number;
  createdAt: Date;
  updatedAt: Date;
  lastPlayedAt: Date;
}

export interface GameWithState extends Game {
  state: {
    approval: number;
    stability: number;
    legitimacy: number;
    treasury: number;
    ideology: IdeologyPosition;
    politics: PoliticsState;
    economy: EconomyState;
    diplomacy: DiplomacyState;
    military: MilitaryState;
    socialGroups: Record<string, SocialGroupState>;
    activeEffects: ActiveEffect[];
    pendingEvents: string[];
  };
}

export interface CreateGameInput {
  userId: string;
  countryId: CountryId;
  difficulty: Difficulty;
  initialState: {
    approval: number;
    stability: number;
    legitimacy: number;
    treasury: number;
    ideology: IdeologyPosition;
    politics: PoliticsState;
    economy: EconomyState;
    diplomacy: DiplomacyState;
    military: MilitaryState;
    socialGroups: Record<string, SocialGroupState>;
  };
  diplomaticRelations: Array<{
    targetCountryId: CountryId;
    relation: Omit<DiplomaticRelation, 'opinion'> & { opinion: number };
  }>;
}

export const gameRepository = {
  async findById(id: string): Promise<Game | null> {
    const result = await pool.query(
      `SELECT id, user_id, country_id, difficulty, is_active,
              current_turn, current_month, current_year,
              created_at, updated_at, last_played_at
       FROM games WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return mapRowToGame(result.rows[0]);
  },

  async findByIdWithState(id: string): Promise<GameWithState | null> {
    const result = await pool.query(
      `SELECT g.id, g.user_id, g.country_id, g.difficulty, g.is_active,
              g.current_turn, g.current_month, g.current_year,
              g.created_at, g.updated_at, g.last_played_at,
              gs.approval, gs.stability, gs.legitimacy, gs.treasury,
              gs.ideology_economic, gs.ideology_liberties,
              gs.ideology_identity, gs.ideology_change,
              gs.politics_state, gs.economy_state,
              gs.diplomacy_state, gs.military_state,
              gs.social_groups_state, gs.active_effects, gs.pending_events
       FROM games g
       JOIN game_states gs ON gs.game_id = g.id
       WHERE g.id = $1`,
      [id]
    );

    if (result.rows.length === 0) return null;
    return mapRowToGameWithState(result.rows[0]);
  },

  async findByUserId(
    userId: string,
    activeOnly: boolean = true
  ): Promise<Game[]> {
    const query = activeOnly
      ? `SELECT id, user_id, country_id, difficulty, is_active,
                current_turn, current_month, current_year,
                created_at, updated_at, last_played_at
         FROM games WHERE user_id = $1 AND is_active = true
         ORDER BY last_played_at DESC`
      : `SELECT id, user_id, country_id, difficulty, is_active,
                current_turn, current_month, current_year,
                created_at, updated_at, last_played_at
         FROM games WHERE user_id = $1
         ORDER BY last_played_at DESC`;

    const result = await pool.query(query, [userId]);
    return result.rows.map(mapRowToGame);
  },

  async create(input: CreateGameInput): Promise<GameWithState> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const gameId = uuidv4();

      // Create game
      await client.query(
        `INSERT INTO games (id, user_id, country_id, difficulty)
         VALUES ($1, $2, $3, $4)`,
        [gameId, input.userId, input.countryId, input.difficulty]
      );

      // Create game state
      await client.query(
        `INSERT INTO game_states (
           game_id, approval, stability, legitimacy, treasury,
           ideology_economic, ideology_liberties, ideology_identity, ideology_change,
           politics_state, economy_state, diplomacy_state, military_state,
           social_groups_state
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          gameId,
          input.initialState.approval,
          input.initialState.stability,
          input.initialState.legitimacy,
          input.initialState.treasury,
          input.initialState.ideology.economic,
          input.initialState.ideology.liberties,
          input.initialState.ideology.identity,
          input.initialState.ideology.change,
          JSON.stringify(input.initialState.politics),
          JSON.stringify(input.initialState.economy),
          JSON.stringify(input.initialState.diplomacy),
          JSON.stringify(input.initialState.military),
          JSON.stringify(input.initialState.socialGroups),
        ]
      );

      // Create diplomatic relations
      for (const rel of input.diplomaticRelations) {
        await client.query(
          `INSERT INTO diplomatic_relations (
             game_id, target_country_id, opinion, trust,
             trade_dependency, ideological_alignment,
             historical_tension, active_issues
           ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            gameId,
            rel.targetCountryId,
            rel.relation.opinion,
            rel.relation.trust,
            rel.relation.tradeDependency,
            rel.relation.ideologicalAlignment,
            rel.relation.historicalTension,
            JSON.stringify(rel.relation.activeIssues),
          ]
        );
      }

      await client.query('COMMIT');

      // Fetch and return the created game with state
      const game = await this.findByIdWithState(gameId);
      if (!game) throw new Error('Failed to create game');
      return game;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async updateTurn(
    gameId: string,
    turn: number,
    month: number,
    year: number
  ): Promise<void> {
    await pool.query(
      `UPDATE games
       SET current_turn = $2, current_month = $3, current_year = $4,
           last_played_at = NOW()
       WHERE id = $1`,
      [gameId, turn, month, year]
    );
  },

  async updateState(
    gameId: string,
    state: Partial<{
      approval: number;
      stability: number;
      legitimacy: number;
      treasury: number;
      ideology: IdeologyPosition;
      politics: PoliticsState;
      economy: EconomyState;
      diplomacy: DiplomacyState;
      military: MilitaryState;
      socialGroups: Record<string, SocialGroupState>;
      activeEffects: ActiveEffect[];
      pendingEvents: string[];
    }>
  ): Promise<void> {
    const updates: string[] = [];
    const values: unknown[] = [gameId];
    let paramIndex = 2;

    if (state.approval !== undefined) {
      updates.push(`approval = $${paramIndex++}`);
      values.push(state.approval);
    }
    if (state.stability !== undefined) {
      updates.push(`stability = $${paramIndex++}`);
      values.push(state.stability);
    }
    if (state.legitimacy !== undefined) {
      updates.push(`legitimacy = $${paramIndex++}`);
      values.push(state.legitimacy);
    }
    if (state.treasury !== undefined) {
      updates.push(`treasury = $${paramIndex++}`);
      values.push(state.treasury);
    }
    if (state.ideology) {
      updates.push(`ideology_economic = $${paramIndex++}`);
      values.push(state.ideology.economic);
      updates.push(`ideology_liberties = $${paramIndex++}`);
      values.push(state.ideology.liberties);
      updates.push(`ideology_identity = $${paramIndex++}`);
      values.push(state.ideology.identity);
      updates.push(`ideology_change = $${paramIndex++}`);
      values.push(state.ideology.change);
    }
    if (state.politics) {
      updates.push(`politics_state = $${paramIndex++}`);
      values.push(JSON.stringify(state.politics));
    }
    if (state.economy) {
      updates.push(`economy_state = $${paramIndex++}`);
      values.push(JSON.stringify(state.economy));
    }
    if (state.diplomacy) {
      updates.push(`diplomacy_state = $${paramIndex++}`);
      values.push(JSON.stringify(state.diplomacy));
    }
    if (state.military) {
      updates.push(`military_state = $${paramIndex++}`);
      values.push(JSON.stringify(state.military));
    }
    if (state.socialGroups) {
      updates.push(`social_groups_state = $${paramIndex++}`);
      values.push(JSON.stringify(state.socialGroups));
    }
    if (state.activeEffects) {
      updates.push(`active_effects = $${paramIndex++}`);
      values.push(JSON.stringify(state.activeEffects));
    }
    if (state.pendingEvents) {
      updates.push(`pending_events = $${paramIndex++}`);
      values.push(JSON.stringify(state.pendingEvents));
    }

    if (updates.length === 0) return;

    await pool.query(
      `UPDATE game_states SET ${updates.join(', ')} WHERE game_id = $1`,
      values
    );
  },

  async deactivate(gameId: string): Promise<void> {
    await pool.query(`UPDATE games SET is_active = false WHERE id = $1`, [
      gameId,
    ]);
  },

  async delete(gameId: string): Promise<void> {
    await pool.query(`DELETE FROM games WHERE id = $1`, [gameId]);
  },

  async logEvent(
    gameId: string,
    eventId: string,
    eventType: string,
    turn: number,
    optionChosen: string | null,
    effectsApplied: unknown[]
  ): Promise<void> {
    await pool.query(
      `INSERT INTO game_events_log
       (game_id, event_id, event_type, turn_occurred, option_chosen, effects_applied)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [gameId, eventId, eventType, turn, optionChosen, JSON.stringify(effectsApplied)]
    );
  },

  async logAction(
    gameId: string,
    actionType: string,
    actionData: unknown,
    turn: number,
    effectsApplied: unknown[]
  ): Promise<void> {
    await pool.query(
      `INSERT INTO game_actions_log
       (game_id, action_type, action_data, turn_executed, effects_applied)
       VALUES ($1, $2, $3, $4, $5)`,
      [gameId, actionType, JSON.stringify(actionData), turn, JSON.stringify(effectsApplied)]
    );
  },
};

function mapRowToGame(row: Record<string, unknown>): Game {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    countryId: row.country_id as CountryId,
    difficulty: row.difficulty as Difficulty,
    isActive: row.is_active as boolean,
    currentTurn: row.current_turn as number,
    currentMonth: row.current_month as number,
    currentYear: row.current_year as number,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
    lastPlayedAt: new Date(row.last_played_at as string),
  };
}

function mapRowToGameWithState(row: Record<string, unknown>): GameWithState {
  return {
    ...mapRowToGame(row),
    state: {
      approval: Number(row.approval),
      stability: Number(row.stability),
      legitimacy: Number(row.legitimacy),
      treasury: Number(row.treasury),
      ideology: {
        economic: Number(row.ideology_economic),
        liberties: Number(row.ideology_liberties),
        identity: Number(row.ideology_identity),
        change: Number(row.ideology_change),
      },
      politics: row.politics_state as PoliticsState,
      economy: row.economy_state as EconomyState,
      diplomacy: row.diplomacy_state as DiplomacyState,
      military: row.military_state as MilitaryState,
      socialGroups: row.social_groups_state as Record<string, SocialGroupState>,
      activeEffects: (row.active_effects as ActiveEffect[]) || [],
      pendingEvents: (row.pending_events as string[]) || [],
    },
  };
}
