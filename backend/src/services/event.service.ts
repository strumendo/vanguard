import { gameRepository, GameWithState } from '../repositories/game.repository.js';
import type {
  GameEvent,
  EventOption,
  EventEffect,
  EventRequirement,
  CountryId,
  ActiveEffect,
} from '../types/game.types.js';
import { GameStateError, NotFoundError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

// In-memory event registry (would be loaded from JSON files in production)
const eventRegistry = new Map<string, GameEvent>();

export interface PendingEvent {
  id: string;
  eventId: string;
  title: { pt: string; en: string };
  description: { pt: string; en: string };
  options: Array<{
    id: string;
    text: { pt: string; en: string };
    previewEffects: string[];
  }>;
  triggeredAt: number;
}

export interface EventResolution {
  eventId: string;
  optionChosen: string;
  effectsApplied: EventEffect[];
  newEffects: ActiveEffect[];
  message: string;
}

export const eventService = {
  /**
   * Register an event in the registry
   */
  registerEvent(event: GameEvent): void {
    eventRegistry.set(event.id, event);
    logger.debug(`Event registered: ${event.id}`);
  },

  /**
   * Get an event by ID
   */
  getEvent(eventId: string): GameEvent | undefined {
    return eventRegistry.get(eventId);
  },

  /**
   * Evaluate which events should trigger for a game state
   */
  evaluateTriggers(game: GameWithState): string[] {
    const triggeredEvents: string[] = [];

    for (const [eventId, event] of eventRegistry) {
      // Skip if event is country-specific and doesn't match
      if (
        event.countrySpecific &&
        !event.countrySpecific.includes(game.countryId)
      ) {
        continue;
      }

      // Skip if event is on cooldown (check event log)
      // TODO: Check cooldown from game_events_log

      // Check if all requirements are met
      if (this.checkRequirements(event.requirements, game)) {
        // Add based on weight (probability)
        if (Math.random() < event.weight) {
          triggeredEvents.push(eventId);
        }
      }
    }

    return triggeredEvents;
  },

  /**
   * Check if event requirements are met
   */
  checkRequirements(
    requirements: EventRequirement[] | undefined,
    game: GameWithState
  ): boolean {
    if (!requirements || requirements.length === 0) return true;

    return requirements.every((req) => this.checkRequirement(req, game));
  },

  /**
   * Check a single requirement
   */
  checkRequirement(req: EventRequirement, game: GameWithState): boolean {
    const value = this.getMetricValue(req.target, game);
    if (value === null) return false;

    switch (req.operator) {
      case 'gt':
        return value > (req.value as number);
      case 'lt':
        return value < (req.value as number);
      case 'eq':
        return value === (req.value as number);
      case 'gte':
        return value >= (req.value as number);
      case 'lte':
        return value <= (req.value as number);
      case 'between':
        const [min, max] = req.value as [number, number];
        return value >= min && value <= max;
      default:
        return false;
    }
  },

  /**
   * Get a metric value from game state
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
      } else if (parts.length === 3) {
        const [category, id, metric] = parts;
        if (category === 'socialGroups' && game.state.socialGroups[id]) {
          return (game.state.socialGroups[id] as Record<string, number>)[
            metric
          ] ?? null;
        }
      }
    } catch {
      return null;
    }

    return null;
  },

  /**
   * Get pending events for a game
   */
  async getPendingEvents(
    gameId: string,
    userId: string
  ): Promise<PendingEvent[]> {
    const game = await gameRepository.findByIdWithState(gameId);

    if (!game) throw new NotFoundError('Game');
    if (game.userId !== userId) throw new GameStateError('Unauthorized');

    const pendingEvents: PendingEvent[] = [];

    for (const eventId of game.state.pendingEvents) {
      const event = eventRegistry.get(eventId);
      if (!event) continue;

      pendingEvents.push({
        id: uuidv4(),
        eventId: event.id,
        title: event.title,
        description: event.description,
        options: event.options.map((opt) => ({
          id: opt.id,
          text: opt.text,
          previewEffects: this.getEffectPreviews(opt.effects),
        })),
        triggeredAt: game.currentTurn,
      });
    }

    return pendingEvents;
  },

  /**
   * Get human-readable effect previews
   */
  getEffectPreviews(effects: EventEffect[]): string[] {
    return effects.map((effect) => {
      const sign = effect.value > 0 ? '+' : '';
      const op =
        effect.operation === 'add'
          ? sign + effect.value
          : effect.operation === 'multiply'
            ? `×${effect.value}`
            : `=${effect.value}`;

      return `${effect.target}: ${op}`;
    });
  },

  /**
   * Respond to an event
   */
  async respondToEvent(
    gameId: string,
    userId: string,
    eventId: string,
    optionId: string
  ): Promise<EventResolution> {
    const game = await gameRepository.findByIdWithState(gameId);

    if (!game) throw new NotFoundError('Game');
    if (game.userId !== userId) throw new GameStateError('Unauthorized');

    // Check event is pending
    if (!game.state.pendingEvents.includes(eventId)) {
      throw new GameStateError('Event not pending');
    }

    const event = eventRegistry.get(eventId);
    if (!event) throw new NotFoundError('Event');

    const option = event.options.find((o) => o.id === optionId);
    if (!option) throw new GameStateError('Invalid option');

    // Check option requirements
    if (option.requirements && !this.checkRequirements(option.requirements, game)) {
      throw new GameStateError('Option requirements not met');
    }

    // Apply effects
    const newEffects = this.applyEffects(game, option.effects);

    // Remove from pending events
    const updatedPendingEvents = game.state.pendingEvents.filter(
      (e) => e !== eventId
    );

    // Update game state
    await gameRepository.updateState(gameId, {
      ...game.state,
      pendingEvents: updatedPendingEvents,
      activeEffects: [...game.state.activeEffects, ...newEffects],
    });

    // Log event
    await gameRepository.logEvent(
      gameId,
      eventId,
      event.type,
      game.currentTurn,
      optionId,
      option.effects
    );

    logger.info(`Event resolved: ${eventId} with option ${optionId}`);

    return {
      eventId,
      optionChosen: optionId,
      effectsApplied: option.effects,
      newEffects,
      message: `Chose: ${option.text.en}`,
    };
  },

  /**
   * Apply effects and return new active effects
   */
  applyEffects(game: GameWithState, effects: EventEffect[]): ActiveEffect[] {
    const newActiveEffects: ActiveEffect[] = [];

    for (const effect of effects) {
      if (effect.delay && effect.delay > 0) {
        // Delayed effect - add to active effects
        newActiveEffects.push({
          id: uuidv4(),
          source: 'event',
          type: effect.value > 0 ? 'buff' : 'debuff',
          target: effect.target,
          value: effect.value,
          duration: effect.delay,
          startTurn: game.currentTurn,
        });
      } else {
        // Immediate effect - apply now
        const currentValue = this.getMetricValue(effect.target, game) ?? 0;
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
            newValue = currentValue;
        }

        // Update the state (this is a simplified version - full impl would update DB)
        this.setMetricValue(effect.target, newValue, game);
      }
    }

    return newActiveEffects;
  },

  /**
   * Set a metric value in game state (in memory only)
   */
  setMetricValue(target: string, value: number, game: GameWithState): void {
    const parts = target.split('.');

    if (parts.length === 1) {
      (game.state as Record<string, number>)[parts[0]] = value;
    } else if (parts.length === 2) {
      const [category, metric] = parts;
      const categoryObj = game.state[category as keyof typeof game.state];
      if (typeof categoryObj === 'object' && categoryObj !== null) {
        (categoryObj as Record<string, number>)[metric] = value;
      }
    }
  },

  /**
   * Trigger new events for a game (called at end of turn)
   */
  async triggerEvents(gameId: string): Promise<string[]> {
    const game = await gameRepository.findByIdWithState(gameId);
    if (!game) return [];

    const newEvents = this.evaluateTriggers(game);

    if (newEvents.length > 0) {
      const updatedPendingEvents = [
        ...game.state.pendingEvents,
        ...newEvents,
      ];

      await gameRepository.updateState(gameId, {
        pendingEvents: updatedPendingEvents,
      });

      logger.info(`Events triggered for game ${gameId}: ${newEvents.join(', ')}`);
    }

    return newEvents;
  },
};

// Register some sample events
const sampleEvents: GameEvent[] = [
  {
    id: 'economic_crisis_warning',
    type: 'crisis',
    title: {
      pt: 'Alerta de Crise Econômica',
      en: 'Economic Crisis Warning',
    },
    description: {
      pt: 'Indicadores econômicos mostram sinais preocupantes. Analistas alertam para risco de recessão.',
      en: 'Economic indicators show worrying signs. Analysts warn of recession risk.',
    },
    options: [
      {
        id: 'austerity',
        text: {
          pt: 'Implementar medidas de austeridade',
          en: 'Implement austerity measures',
        },
        effects: [
          { target: 'economy.debtToGdp', operation: 'add', value: -5 },
          { target: 'approval', operation: 'add', value: -10 },
          { target: 'economy.unemployment', operation: 'add', value: 2 },
        ],
      },
      {
        id: 'stimulus',
        text: {
          pt: 'Aumentar gastos públicos para estimular a economia',
          en: 'Increase public spending to stimulate the economy',
        },
        effects: [
          { target: 'economy.gdpGrowth', operation: 'add', value: 1 },
          { target: 'economy.debtToGdp', operation: 'add', value: 5 },
          { target: 'approval', operation: 'add', value: 5 },
        ],
      },
      {
        id: 'wait',
        text: {
          pt: 'Aguardar e monitorar a situação',
          en: 'Wait and monitor the situation',
        },
        effects: [
          { target: 'stability', operation: 'add', value: -3 },
        ],
      },
    ],
    requirements: [
      { type: 'metric', target: 'economy.gdpGrowth', operator: 'lt', value: 1 },
      { type: 'metric', target: 'economy.inflation', operator: 'gt', value: 8 },
    ],
    weight: 0.3,
    cooldownTurns: 12,
  },
  {
    id: 'social_unrest',
    type: 'crisis',
    title: {
      pt: 'Protestos nas Ruas',
      en: 'Street Protests',
    },
    description: {
      pt: 'Milhares de pessoas tomam as ruas em protesto contra o governo. A tensão está aumentando.',
      en: 'Thousands take to the streets protesting against the government. Tension is rising.',
    },
    options: [
      {
        id: 'dialogue',
        text: {
          pt: 'Abrir diálogo com os manifestantes',
          en: 'Open dialogue with protesters',
        },
        effects: [
          { target: 'politics.internalTension', operation: 'add', value: -15 },
          { target: 'approval', operation: 'add', value: 5 },
          { target: 'legitimacy', operation: 'add', value: 5 },
        ],
      },
      {
        id: 'disperse',
        text: {
          pt: 'Usar a polícia para dispersar os protestos',
          en: 'Use police to disperse the protests',
        },
        effects: [
          { target: 'politics.internalTension', operation: 'add', value: 10 },
          { target: 'stability', operation: 'add', value: 5 },
          { target: 'approval', operation: 'add', value: -15 },
          { target: 'legitimacy', operation: 'add', value: -10 },
        ],
      },
      {
        id: 'concessions',
        text: {
          pt: 'Fazer concessões às demandas populares',
          en: 'Make concessions to popular demands',
        },
        effects: [
          { target: 'politics.internalTension', operation: 'add', value: -25 },
          { target: 'approval', operation: 'add', value: 15 },
          { target: 'economy.debtToGdp', operation: 'add', value: 3 },
        ],
      },
    ],
    requirements: [
      { type: 'metric', target: 'politics.internalTension', operator: 'gt', value: 60 },
    ],
    weight: 0.5,
    cooldownTurns: 6,
  },
  {
    id: 'foreign_investment',
    type: 'opportunity',
    title: {
      pt: 'Interesse de Investidores Estrangeiros',
      en: 'Foreign Investor Interest',
    },
    description: {
      pt: 'Um grande fundo de investimento internacional demonstra interesse em investir no país.',
      en: 'A major international investment fund shows interest in investing in the country.',
    },
    options: [
      {
        id: 'accept',
        text: {
          pt: 'Aceitar os investimentos com incentivos fiscais',
          en: 'Accept investments with tax incentives',
        },
        effects: [
          { target: 'economy.gdpGrowth', operation: 'add', value: 0.5 },
          { target: 'economy.unemployment', operation: 'add', value: -2 },
          { target: 'economy.reserves_billions', operation: 'add', value: 5 },
        ],
      },
      {
        id: 'negotiate',
        text: {
          pt: 'Negociar condições mais favoráveis ao país',
          en: 'Negotiate more favorable conditions for the country',
        },
        effects: [
          { target: 'economy.gdpGrowth', operation: 'add', value: 0.3 },
          { target: 'legitimacy', operation: 'add', value: 5 },
        ],
      },
      {
        id: 'reject',
        text: {
          pt: 'Rejeitar para proteger a economia nacional',
          en: 'Reject to protect the national economy',
        },
        effects: [
          { target: 'approval', operation: 'add', value: 5 },
          { target: 'economy.gdpGrowth', operation: 'add', value: -0.2 },
        ],
      },
    ],
    requirements: [
      { type: 'metric', target: 'stability', operator: 'gt', value: 40 },
      { type: 'metric', target: 'economy.economicFreedomIndex', operator: 'gt', value: 50 },
    ],
    weight: 0.2,
    cooldownTurns: 18,
  },
];

// Register sample events
sampleEvents.forEach((event) => eventService.registerEvent(event));
