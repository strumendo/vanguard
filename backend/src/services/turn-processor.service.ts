import { gameRepository, GameWithState } from '../repositories/game.repository.js';
import { countryDataService } from './country-data.service.js';
import type {
  ActiveEffect,
  IdeologyPosition,
  PoliticsState,
  EconomyState,
  SocialGroupState,
} from '../types/game.types.js';
import { GameStateError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export interface TurnResult {
  turn: number;
  month: number;
  year: number;
  changes: MetricChange[];
  expiredEffects: string[];
  triggeredEvents: string[];
  warnings: string[];
}

export interface MetricChange {
  metric: string;
  previousValue: number;
  newValue: number;
  delta: number;
  reason: string;
}

export const turnProcessor = {
  /**
   * Advance the game by one turn (one month)
   */
  async advanceTurn(gameId: string, userId: string): Promise<TurnResult> {
    // Get current game state
    const game = await gameRepository.findByIdWithState(gameId);

    if (!game) {
      throw new GameStateError('Game not found');
    }

    if (game.userId !== userId) {
      throw new GameStateError('Unauthorized');
    }

    if (!game.isActive) {
      throw new GameStateError('Game is not active');
    }

    const changes: MetricChange[] = [];
    const warnings: string[] = [];
    const expiredEffects: string[] = [];
    const triggeredEvents: string[] = [];

    // 1. Process and expire active effects
    const { updatedEffects, expired } = this.processActiveEffects(
      game.state.activeEffects,
      game.currentTurn
    );
    expiredEffects.push(...expired);

    // 2. Calculate base metric changes
    const economyChanges = this.calculateEconomyChanges(game);
    const politicsChanges = this.calculatePoliticsChanges(game);
    const socialChanges = this.calculateSocialGroupChanges(game);

    changes.push(...economyChanges, ...politicsChanges, ...socialChanges);

    // 3. Apply effect modifiers
    const modifiedChanges = this.applyEffectModifiers(changes, updatedEffects);

    // 4. Calculate new state
    const newState = this.applyChanges(game.state, modifiedChanges);
    newState.activeEffects = updatedEffects;

    // 5. Check for warnings and critical states
    if (newState.stability < 20) {
      warnings.push('CRITICAL: Stability dangerously low');
    }
    if (newState.approval < 15) {
      warnings.push('CRITICAL: Approval rating critically low');
    }
    if (newState.economy.inflation > 50) {
      warnings.push('WARNING: Hyperinflation risk');
    }
    if (newState.economy.unemployment > 30) {
      warnings.push('WARNING: Mass unemployment crisis');
    }

    // 6. Advance time
    let newMonth = game.currentMonth + 1;
    let newYear = game.currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    }
    const newTurn = game.currentTurn + 1;

    // 7. Update database
    await gameRepository.updateTurn(gameId, newTurn, newMonth, newYear);
    await gameRepository.updateState(gameId, newState);

    logger.info(
      `Turn advanced: Game ${gameId} -> Turn ${newTurn} (${newMonth}/${newYear})`
    );

    return {
      turn: newTurn,
      month: newMonth,
      year: newYear,
      changes: modifiedChanges,
      expiredEffects,
      triggeredEvents,
      warnings,
    };
  },

  /**
   * Process active effects, reduce duration, remove expired
   */
  processActiveEffects(
    effects: ActiveEffect[],
    currentTurn: number
  ): { updatedEffects: ActiveEffect[]; expired: string[] } {
    const updatedEffects: ActiveEffect[] = [];
    const expired: string[] = [];

    for (const effect of effects) {
      if (effect.duration === -1) {
        // Permanent effect
        updatedEffects.push(effect);
      } else if (effect.duration > 1) {
        // Reduce duration
        updatedEffects.push({
          ...effect,
          duration: effect.duration - 1,
        });
      } else {
        // Effect expired
        expired.push(effect.id);
      }
    }

    return { updatedEffects, expired };
  },

  /**
   * Calculate economy changes for the turn
   */
  calculateEconomyChanges(game: GameWithState): MetricChange[] {
    const changes: MetricChange[] = [];
    const economy = game.state.economy;

    // GDP Growth (influenced by stability, investment, global factors)
    const stabilityFactor = (game.state.stability - 50) / 100; // -0.5 to +0.5
    const baseGrowth = economy.gdpGrowth;
    const adjustedGrowth = baseGrowth + stabilityFactor * 2;

    // GDP change
    const gdpDelta = economy.gdpBillions * (adjustedGrowth / 100 / 12); // Monthly
    changes.push({
      metric: 'economy.gdpBillions',
      previousValue: economy.gdpBillions,
      newValue: economy.gdpBillions + gdpDelta,
      delta: gdpDelta,
      reason: 'Economic growth',
    });

    // Inflation dynamics (simplified Phillips curve)
    const unemploymentGap = economy.unemployment - 5; // Natural rate assumed 5%
    const inflationChange = -unemploymentGap * 0.1; // Higher unemployment = lower inflation
    const newInflation = Math.max(
      0,
      Math.min(100, economy.inflation + inflationChange)
    );
    changes.push({
      metric: 'economy.inflation',
      previousValue: economy.inflation,
      newValue: newInflation,
      delta: inflationChange,
      reason: 'Labor market dynamics',
    });

    // Unemployment dynamics (influenced by growth)
    const unemploymentChange = -adjustedGrowth * 0.3; // Growth reduces unemployment
    const newUnemployment = Math.max(
      2,
      Math.min(50, economy.unemployment + unemploymentChange)
    );
    changes.push({
      metric: 'economy.unemployment',
      previousValue: economy.unemployment,
      newValue: newUnemployment,
      delta: unemploymentChange,
      reason: 'Economic growth effect',
    });

    // Debt dynamics (simplified)
    const budgetBalance = (economy.gdpGrowth > 2 ? -0.5 : 0.5) / 12; // Monthly
    const newDebt = Math.max(0, economy.debtToGdp + budgetBalance);
    changes.push({
      metric: 'economy.debtToGdp',
      previousValue: economy.debtToGdp,
      newValue: newDebt,
      delta: budgetBalance,
      reason: 'Fiscal dynamics',
    });

    return changes;
  },

  /**
   * Calculate politics changes for the turn
   */
  calculatePoliticsChanges(game: GameWithState): MetricChange[] {
    const changes: MetricChange[] = [];
    const politics = game.state.politics;
    const economy = game.state.economy;

    // Approval influenced by economy
    const economicSentiment =
      (economy.gdpGrowth * 2 - economy.unemployment * 0.5 - economy.inflation * 0.3) / 10;

    // Approval drift toward 50 + economic sentiment
    const approvalTarget = 50 + economicSentiment * 10;
    const approvalDelta = (approvalTarget - game.state.approval) * 0.1;
    const newApproval = Math.max(
      0,
      Math.min(100, game.state.approval + approvalDelta)
    );

    changes.push({
      metric: 'approval',
      previousValue: game.state.approval,
      newValue: newApproval,
      delta: approvalDelta,
      reason: 'Economic performance effect',
    });

    // Stability influenced by approval and tension
    const stabilityDelta =
      (game.state.approval - 50) * 0.05 - politics.internalTension * 0.02;
    const newStability = Math.max(
      0,
      Math.min(100, game.state.stability + stabilityDelta)
    );

    changes.push({
      metric: 'stability',
      previousValue: game.state.stability,
      newValue: newStability,
      delta: stabilityDelta,
      reason: 'Approval and tension dynamics',
    });

    // Internal tension decay (naturally decreases if no events)
    const tensionDecay = -1;
    const newTension = Math.max(
      0,
      Math.min(100, politics.internalTension + tensionDecay)
    );

    changes.push({
      metric: 'politics.internalTension',
      previousValue: politics.internalTension,
      newValue: newTension,
      delta: tensionDecay,
      reason: 'Natural tension decay',
    });

    return changes;
  },

  /**
   * Calculate social group opinion changes
   */
  calculateSocialGroupChanges(game: GameWithState): MetricChange[] {
    const changes: MetricChange[] = [];
    const groups = game.state.socialGroups;
    const economy = game.state.economy;

    for (const [groupId, group] of Object.entries(groups)) {
      // Opinion drift based on economic conditions
      let opinionDelta = 0;

      // General economic sentiment
      if (economy.unemployment > 20) {
        opinionDelta -= 2;
      } else if (economy.gdpGrowth > 3) {
        opinionDelta += 1;
      }

      // High inequality affects lower economic power groups more
      if (economy.giniCoefficient > 0.5 && group.currentOpinion < 50) {
        opinionDelta -= 1;
      }

      // Natural drift toward 0 (neutral)
      opinionDelta += -group.currentOpinion * 0.02;

      const newOpinion = Math.max(
        -100,
        Math.min(100, group.currentOpinion + opinionDelta)
      );

      if (Math.abs(opinionDelta) > 0.1) {
        changes.push({
          metric: `socialGroups.${groupId}.currentOpinion`,
          previousValue: group.currentOpinion,
          newValue: newOpinion,
          delta: opinionDelta,
          reason: 'Economic conditions',
        });
      }
    }

    return changes;
  },

  /**
   * Apply effect modifiers to metric changes
   */
  applyEffectModifiers(
    changes: MetricChange[],
    effects: ActiveEffect[]
  ): MetricChange[] {
    // For each change, apply any matching effect modifiers
    return changes.map((change) => {
      let modifiedDelta = change.delta;

      for (const effect of effects) {
        if (effect.target === change.metric) {
          if (effect.type === 'buff') {
            modifiedDelta += effect.value;
          } else if (effect.type === 'debuff') {
            modifiedDelta -= effect.value;
          }
        }
      }

      return {
        ...change,
        delta: modifiedDelta,
        newValue: change.previousValue + modifiedDelta,
      };
    });
  },

  /**
   * Apply calculated changes to state
   */
  applyChanges(
    state: GameWithState['state'],
    changes: MetricChange[]
  ): GameWithState['state'] {
    const newState = JSON.parse(JSON.stringify(state)) as GameWithState['state'];

    for (const change of changes) {
      const parts = change.metric.split('.');

      if (parts.length === 1) {
        // Top-level metric (approval, stability, etc.)
        (newState as Record<string, number>)[parts[0]] = Math.max(
          0,
          Math.min(100, change.newValue)
        );
      } else if (parts.length === 2) {
        // Nested metric (economy.gdpBillions, etc.)
        const [category, metric] = parts;
        const categoryObj = newState[category as keyof typeof newState];
        if (typeof categoryObj === 'object' && categoryObj !== null) {
          (categoryObj as Record<string, number>)[metric] = change.newValue;
        }
      } else if (parts.length === 3) {
        // Deep nested (socialGroups.groupId.metric)
        const [category, id, metric] = parts;
        if (category === 'socialGroups' && newState.socialGroups[id]) {
          (newState.socialGroups[id] as Record<string, number>)[metric] =
            change.newValue;
        }
      }
    }

    return newState;
  },

  /**
   * Check for game over conditions
   */
  checkGameOverConditions(game: GameWithState): {
    isGameOver: boolean;
    reason?: string;
  } {
    // Civil war / collapse
    if (game.state.stability < 5) {
      return { isGameOver: true, reason: 'Government collapse' };
    }

    // Revolution / coup
    if (
      game.state.approval < 5 &&
      game.state.politics.internalTension > 90
    ) {
      return { isGameOver: true, reason: 'Popular revolution' };
    }

    // Economic collapse
    if (
      game.state.economy.inflation > 90 &&
      game.state.economy.unemployment > 40
    ) {
      return { isGameOver: true, reason: 'Economic collapse' };
    }

    return { isGameOver: false };
  },
};
