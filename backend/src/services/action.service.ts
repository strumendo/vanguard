import { gameRepository, GameWithState } from '../repositories/game.repository.js';
import type {
  GameAction,
  EventEffect,
  ActiveEffect,
  GameSystem,
} from '../types/game.types.js';
import { GameStateError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// Action registry
const actionRegistry = new Map<string, GameAction>();

export interface ActionResult {
  actionId: string;
  success: boolean;
  effectsApplied: EventEffect[];
  newEffects: ActiveEffect[];
  costs: Record<string, number>;
  message: string;
}

export const actionService = {
  /**
   * Register an action
   */
  registerAction(action: GameAction): void {
    actionRegistry.set(action.id, action);
    logger.debug(`Action registered: ${action.id}`);
  },

  /**
   * Get available actions for a game
   */
  async getAvailableActions(
    gameId: string,
    userId: string,
    category?: GameSystem
  ): Promise<GameAction[]> {
    const game = await gameRepository.findByIdWithState(gameId);
    if (!game) throw new NotFoundError('Game');
    if (game.userId !== userId) throw new GameStateError('Unauthorized');

    const actions: GameAction[] = [];

    for (const [, action] of actionRegistry) {
      // Filter by category if specified
      if (category && action.category !== category) continue;

      // Check if action requirements are met
      if (this.checkActionRequirements(action, game)) {
        actions.push(action);
      }
    }

    return actions;
  },

  /**
   * Check if action requirements are met
   */
  checkActionRequirements(action: GameAction, game: GameWithState): boolean {
    if (!action.requirements) return true;

    for (const req of action.requirements) {
      const value = this.getMetricValue(req.target, game);
      if (value === null) return false;

      switch (req.operator) {
        case 'gt':
          if (!(value > (req.value as number))) return false;
          break;
        case 'lt':
          if (!(value < (req.value as number))) return false;
          break;
        case 'gte':
          if (!(value >= (req.value as number))) return false;
          break;
        case 'lte':
          if (!(value <= (req.value as number))) return false;
          break;
        case 'eq':
          if (value !== req.value) return false;
          break;
      }
    }

    return true;
  },

  /**
   * Get metric value from game state
   */
  getMetricValue(target: string, game: GameWithState): number | null {
    const parts = target.split('.');

    try {
      if (parts.length === 1) {
        return (game.state as Record<string, number>)[parts[0]] ?? null;
      } else if (parts.length === 2) {
        const [category, metric] = parts;
        const categoryObj = game.state[category as keyof typeof game.state];
        if (typeof categoryObj === 'object' && categoryObj !== null) {
          return (categoryObj as Record<string, number>)[metric] ?? null;
        }
      }
    } catch {
      return null;
    }

    return null;
  },

  /**
   * Execute an action
   */
  async executeAction(
    gameId: string,
    userId: string,
    actionId: string
  ): Promise<ActionResult> {
    const game = await gameRepository.findByIdWithState(gameId);
    if (!game) throw new NotFoundError('Game');
    if (game.userId !== userId) throw new GameStateError('Unauthorized');

    const action = actionRegistry.get(actionId);
    if (!action) throw new NotFoundError('Action');

    // Check requirements
    if (!this.checkActionRequirements(action, game)) {
      throw new GameStateError('Action requirements not met');
    }

    // Check and apply costs
    const costs = this.calculateCosts(action, game);
    if (!this.canAffordCosts(costs, game)) {
      throw new GameStateError('Cannot afford action costs');
    }

    // Apply costs
    await this.applyCosts(gameId, costs, game);

    // Apply effects
    const { immediateEffects, delayedEffects } = this.applyEffects(
      action.effects,
      game
    );

    // Update game state with new effects
    const updatedEffects = [...game.state.activeEffects, ...delayedEffects];

    await gameRepository.updateState(gameId, {
      activeEffects: updatedEffects,
    });

    // Log action
    await gameRepository.logAction(
      gameId,
      actionId,
      { costs },
      game.currentTurn,
      action.effects
    );

    logger.info(`Action executed: ${actionId} in game ${gameId}`);

    return {
      actionId,
      success: true,
      effectsApplied: immediateEffects,
      newEffects: delayedEffects,
      costs,
      message: `Executed: ${action.name.en}`,
    };
  },

  /**
   * Calculate action costs
   */
  calculateCosts(
    action: GameAction,
    _game: GameWithState
  ): Record<string, number> {
    const costs: Record<string, number> = {};

    if (action.cost.politicalCapital) {
      costs.politicalCapital = action.cost.politicalCapital;
    }
    if (action.cost.treasury) {
      costs.treasury = action.cost.treasury;
    }
    if (action.cost.approval) {
      costs.approval = action.cost.approval;
    }
    if (action.cost.internationalReputation) {
      costs.internationalReputation = action.cost.internationalReputation;
    }

    return costs;
  },

  /**
   * Check if player can afford costs
   */
  canAffordCosts(costs: Record<string, number>, game: GameWithState): boolean {
    if (costs.treasury && game.state.treasury < costs.treasury) {
      return false;
    }
    if (costs.approval && game.state.approval < costs.approval) {
      return false;
    }
    // Add more checks as needed
    return true;
  },

  /**
   * Apply costs to game state
   */
  async applyCosts(
    gameId: string,
    costs: Record<string, number>,
    game: GameWithState
  ): Promise<void> {
    const updates: Partial<typeof game.state> = {};

    if (costs.treasury) {
      updates.treasury = game.state.treasury - costs.treasury;
    }
    if (costs.approval) {
      updates.approval = Math.max(0, game.state.approval - costs.approval);
    }

    if (Object.keys(updates).length > 0) {
      await gameRepository.updateState(gameId, updates);
    }
  },

  /**
   * Apply effects and separate immediate from delayed
   */
  applyEffects(
    effects: EventEffect[],
    game: GameWithState
  ): { immediateEffects: EventEffect[]; delayedEffects: ActiveEffect[] } {
    const immediateEffects: EventEffect[] = [];
    const delayedEffects: ActiveEffect[] = [];

    for (const effect of effects) {
      if (effect.delay && effect.delay > 0) {
        delayedEffects.push({
          id: uuidv4(),
          source: 'action',
          type: effect.value > 0 ? 'buff' : 'debuff',
          target: effect.target,
          value: effect.value,
          duration: effect.delay,
          startTurn: game.currentTurn,
        });
      } else {
        immediateEffects.push(effect);
        // Apply immediate effect
        this.applyImmediateEffect(effect, game);
      }
    }

    return { immediateEffects, delayedEffects };
  },

  /**
   * Apply immediate effect to game state
   */
  applyImmediateEffect(effect: EventEffect, game: GameWithState): void {
    const parts = effect.target.split('.');
    let currentValue = this.getMetricValue(effect.target, game) ?? 0;
    let newValue: number;

    switch (effect.operation) {
      case 'add':
        newValue = currentValue + effect.value;
        break;
      case 'multiply':
        newValue = currentValue * effect.value;
        break;
      case 'set':
        newValue = effect.value;
        break;
      default:
        return;
    }

    // Update in game state object
    if (parts.length === 1) {
      (game.state as Record<string, number>)[parts[0]] = Math.max(
        0,
        Math.min(100, newValue)
      );
    } else if (parts.length === 2) {
      const [category, metric] = parts;
      const categoryObj = game.state[category as keyof typeof game.state];
      if (typeof categoryObj === 'object' && categoryObj !== null) {
        (categoryObj as Record<string, number>)[metric] = newValue;
      }
    }
  },
};

// Register sample actions
const sampleActions: GameAction[] = [
  // Economic Actions
  {
    id: 'raise_taxes',
    type: 'fiscal_policy',
    category: 'economy',
    name: { pt: 'Aumentar Impostos', en: 'Raise Taxes' },
    description: {
      pt: 'Aumentar a carga tributária para aumentar a arrecadação',
      en: 'Increase tax burden to raise government revenue',
    },
    cost: { politicalCapital: 20, approval: 5 },
    effects: [
      { target: 'economy.debtToGdp', operation: 'add', value: -3 },
      { target: 'economy.gdpGrowth', operation: 'add', value: -0.5 },
      { target: 'approval', operation: 'add', value: -8 },
    ],
    cooldownTurns: 6,
  },
  {
    id: 'lower_taxes',
    type: 'fiscal_policy',
    category: 'economy',
    name: { pt: 'Reduzir Impostos', en: 'Lower Taxes' },
    description: {
      pt: 'Reduzir impostos para estimular a economia',
      en: 'Reduce taxes to stimulate the economy',
    },
    cost: { politicalCapital: 15 },
    effects: [
      { target: 'economy.gdpGrowth', operation: 'add', value: 0.8 },
      { target: 'economy.debtToGdp', operation: 'add', value: 4 },
      { target: 'approval', operation: 'add', value: 5 },
    ],
    cooldownTurns: 6,
  },
  {
    id: 'raise_interest_rate',
    type: 'monetary_policy',
    category: 'economy',
    name: { pt: 'Aumentar Taxa de Juros', en: 'Raise Interest Rate' },
    description: {
      pt: 'Aumentar juros para combater a inflação',
      en: 'Raise interest rates to combat inflation',
    },
    cost: { politicalCapital: 10 },
    effects: [
      { target: 'economy.inflation', operation: 'add', value: -2, delay: 3 },
      { target: 'economy.gdpGrowth', operation: 'add', value: -0.3 },
      { target: 'economy.unemployment', operation: 'add', value: 0.5, delay: 2 },
    ],
    cooldownTurns: 3,
  },
  {
    id: 'lower_interest_rate',
    type: 'monetary_policy',
    category: 'economy',
    name: { pt: 'Reduzir Taxa de Juros', en: 'Lower Interest Rate' },
    description: {
      pt: 'Reduzir juros para estimular crescimento',
      en: 'Lower interest rates to stimulate growth',
    },
    cost: { politicalCapital: 10 },
    effects: [
      { target: 'economy.gdpGrowth', operation: 'add', value: 0.5, delay: 2 },
      { target: 'economy.inflation', operation: 'add', value: 1.5, delay: 3 },
    ],
    requirements: [
      { type: 'metric', target: 'economy.inflation', operator: 'lt', value: 15 },
    ],
    cooldownTurns: 3,
  },
  {
    id: 'austerity_package',
    type: 'fiscal_policy',
    category: 'economy',
    name: { pt: 'Pacote de Austeridade', en: 'Austerity Package' },
    description: {
      pt: 'Cortes profundos nos gastos públicos',
      en: 'Deep cuts in public spending',
    },
    cost: { politicalCapital: 40, approval: 10 },
    effects: [
      { target: 'economy.debtToGdp', operation: 'add', value: -8 },
      { target: 'economy.gdpGrowth', operation: 'add', value: -1.5 },
      { target: 'economy.unemployment', operation: 'add', value: 3 },
      { target: 'approval', operation: 'add', value: -15 },
      { target: 'politics.internalTension', operation: 'add', value: 15 },
    ],
    cooldownTurns: 12,
  },
  {
    id: 'stimulus_package',
    type: 'fiscal_policy',
    category: 'economy',
    name: { pt: 'Pacote de Estímulo', en: 'Stimulus Package' },
    description: {
      pt: 'Aumentar gastos públicos para estimular a economia',
      en: 'Increase public spending to stimulate the economy',
    },
    cost: { treasury: 50000000000, politicalCapital: 25 },
    effects: [
      { target: 'economy.gdpGrowth', operation: 'add', value: 1.5 },
      { target: 'economy.unemployment', operation: 'add', value: -2, delay: 2 },
      { target: 'economy.debtToGdp', operation: 'add', value: 5 },
      { target: 'approval', operation: 'add', value: 8 },
    ],
    cooldownTurns: 12,
  },

  // Political Actions
  {
    id: 'public_speech',
    type: 'communication',
    category: 'politics',
    name: { pt: 'Discurso Público', en: 'Public Speech' },
    description: {
      pt: 'Fazer um discurso para a nação',
      en: 'Address the nation with a speech',
    },
    cost: { politicalCapital: 5 },
    effects: [
      { target: 'approval', operation: 'add', value: 3 },
      { target: 'legitimacy', operation: 'add', value: 2 },
    ],
    cooldownTurns: 2,
  },
  {
    id: 'cabinet_reshuffle',
    type: 'executive',
    category: 'politics',
    name: { pt: 'Reforma Ministerial', en: 'Cabinet Reshuffle' },
    description: {
      pt: 'Reorganizar o gabinete para melhorar a governança',
      en: 'Reorganize the cabinet to improve governance',
    },
    cost: { politicalCapital: 30 },
    effects: [
      { target: 'stability', operation: 'add', value: -5 },
      { target: 'politics.coalitionStability', operation: 'add', value: 10, delay: 2 },
      { target: 'politics.corruptionLevel', operation: 'add', value: -5, delay: 3 },
    ],
    cooldownTurns: 12,
  },
  {
    id: 'anti_corruption_campaign',
    type: 'reform',
    category: 'politics',
    name: { pt: 'Campanha Anticorrupção', en: 'Anti-Corruption Campaign' },
    description: {
      pt: 'Lançar uma campanha para combater a corrupção',
      en: 'Launch a campaign to fight corruption',
    },
    cost: { politicalCapital: 35 },
    effects: [
      { target: 'politics.corruptionLevel', operation: 'add', value: -10, delay: 6 },
      { target: 'legitimacy', operation: 'add', value: 8 },
      { target: 'politics.internalTension', operation: 'add', value: 10 },
    ],
    cooldownTurns: 24,
  },
  {
    id: 'emergency_decree',
    type: 'executive',
    category: 'politics',
    name: { pt: 'Decreto de Emergência', en: 'Emergency Decree' },
    description: {
      pt: 'Emitir um decreto para lidar com crise urgente',
      en: 'Issue a decree to handle urgent crisis',
    },
    cost: { politicalCapital: 20, approval: 3 },
    effects: [
      { target: 'stability', operation: 'add', value: 10 },
      { target: 'politics.internalTension', operation: 'add', value: -15 },
      { target: 'legitimacy', operation: 'add', value: -5 },
    ],
    requirements: [
      { type: 'metric', target: 'politics.internalTension', operator: 'gt', value: 50 },
    ],
    cooldownTurns: 6,
  },

  // Diplomatic Actions
  {
    id: 'diplomatic_mission',
    type: 'diplomacy',
    category: 'diplomacy',
    name: { pt: 'Missão Diplomática', en: 'Diplomatic Mission' },
    description: {
      pt: 'Enviar delegação para melhorar relações',
      en: 'Send delegation to improve relations',
    },
    cost: { treasury: 1000000000, politicalCapital: 10 },
    effects: [
      { target: 'diplomacy.internationalReputation', operation: 'add', value: 5 },
      { target: 'diplomacy.softPower', operation: 'add', value: 3 },
    ],
    cooldownTurns: 4,
  },

  // Military Actions
  {
    id: 'military_parade',
    type: 'display',
    category: 'military',
    name: { pt: 'Parada Militar', en: 'Military Parade' },
    description: {
      pt: 'Organizar parada para demonstrar força',
      en: 'Organize parade to demonstrate strength',
    },
    cost: { treasury: 500000000, politicalCapital: 5 },
    effects: [
      { target: 'military.morale', operation: 'add', value: 5 },
      { target: 'approval', operation: 'add', value: 3 },
      { target: 'stability', operation: 'add', value: 2 },
    ],
    cooldownTurns: 12,
  },
  {
    id: 'increase_military_budget',
    type: 'budget',
    category: 'military',
    name: { pt: 'Aumentar Orçamento Militar', en: 'Increase Military Budget' },
    description: {
      pt: 'Aumentar investimentos nas forças armadas',
      en: 'Increase investment in armed forces',
    },
    cost: { treasury: 5000000000 },
    effects: [
      { target: 'military.equipmentQuality', operation: 'add', value: 3, delay: 6 },
      { target: 'military.morale', operation: 'add', value: 5 },
      { target: 'military.readiness', operation: 'add', value: 5, delay: 3 },
      { target: 'economy.debtToGdp', operation: 'add', value: 2 },
    ],
    cooldownTurns: 6,
  },
];

// Register sample actions
sampleActions.forEach((action) => actionService.registerAction(action));
