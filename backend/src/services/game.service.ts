import {
  gameRepository,
  Game,
  GameWithState,
} from '../repositories/game.repository.js';
import { countryDataService } from './country-data.service.js';
import type { CountryId, Difficulty } from '../types/game.types.js';
import {
  NotFoundError,
  AuthorizationError,
  GameStateError,
} from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface CreateGameInput {
  userId: string;
  countryId: CountryId;
  difficulty: Difficulty;
}

export interface GameSummary {
  id: string;
  countryId: CountryId;
  countryName: string;
  flagEmoji: string;
  difficulty: Difficulty;
  currentTurn: number;
  currentDate: string;
  approval: number;
  lastPlayedAt: Date;
}

export const gameService = {
  /**
   * Create a new game for a user
   */
  async createGame(input: CreateGameInput): Promise<GameWithState> {
    // Validate country exists
    const availableCountries = countryDataService.getAvailableCountries();
    if (!availableCountries.includes(input.countryId)) {
      throw new GameStateError(`Invalid country: ${input.countryId}`);
    }

    // Get initial state from country data
    const initialState = countryDataService.toInitialGameState(input.countryId);

    // Get diplomatic relations
    const diplomaticRelations = countryDataService.getDiplomaticRelations(
      input.countryId
    );

    // Apply difficulty modifiers
    const modifiedState = this.applyDifficultyModifiers(
      initialState,
      input.difficulty
    );

    // Create game in database
    const game = await gameRepository.create({
      userId: input.userId,
      countryId: input.countryId,
      difficulty: input.difficulty,
      initialState: modifiedState,
      diplomaticRelations,
    });

    logger.info(
      `Game created: ${game.id} for user ${input.userId} as ${input.countryId}`
    );

    return game;
  },

  /**
   * Apply difficulty modifiers to initial state
   */
  applyDifficultyModifiers(
    state: ReturnType<typeof countryDataService.toInitialGameState>,
    difficulty: Difficulty
  ) {
    const modifiers = {
      easy: {
        approval: 10,
        stability: 10,
        treasury: 1.2,
        eventFrequency: 0.7,
      },
      normal: {
        approval: 0,
        stability: 0,
        treasury: 1.0,
        eventFrequency: 1.0,
      },
      hard: {
        approval: -10,
        stability: -5,
        treasury: 0.8,
        eventFrequency: 1.3,
      },
      ironman: {
        approval: -15,
        stability: -10,
        treasury: 0.6,
        eventFrequency: 1.5,
      },
    };

    const mod = modifiers[difficulty];

    return {
      ...state,
      approval: Math.max(0, Math.min(100, state.approval + mod.approval)),
      stability: Math.max(0, Math.min(100, state.stability + mod.stability)),
      treasury: state.treasury * mod.treasury,
    };
  },

  /**
   * Get a game by ID (with ownership check)
   */
  async getGame(gameId: string, userId: string): Promise<GameWithState> {
    const game = await gameRepository.findByIdWithState(gameId);

    if (!game) {
      throw new NotFoundError('Game');
    }

    if (game.userId !== userId) {
      throw new AuthorizationError('You do not own this game');
    }

    return game;
  },

  /**
   * Get all games for a user
   */
  async getUserGames(userId: string): Promise<GameSummary[]> {
    const games = await gameRepository.findByUserId(userId);

    return games.map((game) => {
      const countryData = countryDataService.getCountrySummary(game.countryId);
      return {
        id: game.id,
        countryId: game.countryId,
        countryName: countryData.name.en,
        flagEmoji: countryData.flagEmoji,
        difficulty: game.difficulty,
        currentTurn: game.currentTurn,
        currentDate: `${this.getMonthName(game.currentMonth)} ${game.currentYear}`,
        approval: countryData.highlights.approval, // This should come from game state
        lastPlayedAt: game.lastPlayedAt,
      };
    });
  },

  /**
   * Delete a game
   */
  async deleteGame(gameId: string, userId: string): Promise<void> {
    const game = await gameRepository.findById(gameId);

    if (!game) {
      throw new NotFoundError('Game');
    }

    if (game.userId !== userId) {
      throw new AuthorizationError('You do not own this game');
    }

    await gameRepository.delete(gameId);
    logger.info(`Game deleted: ${gameId}`);
  },

  /**
   * Deactivate a game (soft delete)
   */
  async deactivateGame(gameId: string, userId: string): Promise<void> {
    const game = await gameRepository.findById(gameId);

    if (!game) {
      throw new NotFoundError('Game');
    }

    if (game.userId !== userId) {
      throw new AuthorizationError('You do not own this game');
    }

    await gameRepository.deactivate(gameId);
    logger.info(`Game deactivated: ${gameId}`);
  },

  /**
   * Get available countries for game creation
   */
  getAvailableCountries() {
    return countryDataService.getAllCountriesSummary();
  },

  /**
   * Helper to get month name
   */
  getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1] || 'January';
  },
};
