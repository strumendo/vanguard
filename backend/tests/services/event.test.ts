import { describe, it, expect, beforeEach } from '@jest/globals';
import { eventService } from '../../src/services/event.service.js';
import type { GameWithState } from '../../src/repositories/game.repository.js';
import type { GameEvent, EventRequirement } from '../../src/types/game.types.js';

describe('EventService', () => {
  describe('checkRequirement', () => {
    const mockGame: GameWithState = {
      id: 'test-game',
      userId: 'test-user',
      countryId: 'brazil',
      difficulty: 'normal',
      isActive: true,
      currentTurn: 10,
      currentMonth: 10,
      currentYear: 2025,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPlayedAt: new Date(),
      state: {
        approval: 45,
        stability: 55,
        legitimacy: 60,
        treasury: 100000000000,
        ideology: { economic: -10, liberties: 20, identity: -5, change: 15 },
        politics: {
          approvalRating: 45,
          polarizationIndex: 40,
          internalTension: 50,
          corruptionLevel: 45,
          pressLiberty: 55,
          nextElectionTurn: 36,
          coalitionStability: 50,
          activeReforms: [],
        },
        economy: {
          gdpBillions: 2000,
          gdpGrowth: 0.5,
          inflation: 10,
          unemployment: 12,
          debtToGdp: 70,
          reservesBillions: 300,
          interestRate: 12,
          tradeBalance: 20,
          giniCoefficient: 0.53,
          economicFreedomIndex: 52,
        },
        diplomacy: {
          relations: {},
          activeAlliances: [],
          activeTreaties: [],
          internationalReputation: 50,
          softPower: 48,
          sanctions: [],
        },
        military: {
          personnelThousands: 360,
          budgetBillions: 28,
          equipmentQuality: 50,
          morale: 55,
          readiness: 65,
          activeOperations: [],
          nuclearCapability: false,
        },
        socialGroups: {
          workers: {
            currentOpinion: 30,
            mobilization: 40,
            lastInteraction: 5,
            grievances: ['wages', 'jobs'],
            satisfiedDemands: [],
          },
        },
        activeEffects: [],
        pendingEvents: [],
      },
    };

    it('should check greater than requirement', () => {
      const req: EventRequirement = {
        type: 'metric',
        target: 'approval',
        operator: 'gt',
        value: 40,
      };

      expect(eventService.checkRequirement(req, mockGame)).toBe(true);

      const reqFail: EventRequirement = {
        type: 'metric',
        target: 'approval',
        operator: 'gt',
        value: 50,
      };

      expect(eventService.checkRequirement(reqFail, mockGame)).toBe(false);
    });

    it('should check less than requirement', () => {
      const req: EventRequirement = {
        type: 'metric',
        target: 'stability',
        operator: 'lt',
        value: 60,
      };

      expect(eventService.checkRequirement(req, mockGame)).toBe(true);

      const reqFail: EventRequirement = {
        type: 'metric',
        target: 'stability',
        operator: 'lt',
        value: 50,
      };

      expect(eventService.checkRequirement(reqFail, mockGame)).toBe(false);
    });

    it('should check between requirement', () => {
      const req: EventRequirement = {
        type: 'metric',
        target: 'legitimacy',
        operator: 'between',
        value: [50, 70],
      };

      expect(eventService.checkRequirement(req, mockGame)).toBe(true);

      const reqFail: EventRequirement = {
        type: 'metric',
        target: 'legitimacy',
        operator: 'between',
        value: [70, 90],
      };

      expect(eventService.checkRequirement(reqFail, mockGame)).toBe(false);
    });

    it('should check nested metric requirements', () => {
      const req: EventRequirement = {
        type: 'metric',
        target: 'economy.inflation',
        operator: 'gt',
        value: 8,
      };

      expect(eventService.checkRequirement(req, mockGame)).toBe(true);
    });

    it('should check deeply nested metric requirements', () => {
      const req: EventRequirement = {
        type: 'metric',
        target: 'socialGroups.workers.currentOpinion',
        operator: 'gte',
        value: 30,
      };

      expect(eventService.checkRequirement(req, mockGame)).toBe(true);
    });
  });

  describe('checkRequirements', () => {
    const mockGame: GameWithState = {
      id: 'test-game',
      userId: 'test-user',
      countryId: 'brazil',
      difficulty: 'normal',
      isActive: true,
      currentTurn: 10,
      currentMonth: 10,
      currentYear: 2025,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPlayedAt: new Date(),
      state: {
        approval: 45,
        stability: 55,
        legitimacy: 60,
        treasury: 100000000000,
        ideology: { economic: 0, liberties: 0, identity: 0, change: 0 },
        politics: {
          approvalRating: 45,
          polarizationIndex: 40,
          internalTension: 65, // High tension
          corruptionLevel: 45,
          pressLiberty: 55,
          nextElectionTurn: 36,
          coalitionStability: 50,
          activeReforms: [],
        },
        economy: {
          gdpBillions: 2000,
          gdpGrowth: 0.5,
          inflation: 10,
          unemployment: 12,
          debtToGdp: 70,
          reservesBillions: 300,
          interestRate: 12,
          tradeBalance: 20,
          giniCoefficient: 0.53,
          economicFreedomIndex: 52,
        },
        diplomacy: {
          relations: {},
          activeAlliances: [],
          activeTreaties: [],
          internationalReputation: 50,
          softPower: 48,
          sanctions: [],
        },
        military: {
          personnelThousands: 360,
          budgetBillions: 28,
          equipmentQuality: 50,
          morale: 55,
          readiness: 65,
          activeOperations: [],
          nuclearCapability: false,
        },
        socialGroups: {},
        activeEffects: [],
        pendingEvents: [],
      },
    };

    it('should return true for empty requirements', () => {
      expect(eventService.checkRequirements(undefined, mockGame)).toBe(true);
      expect(eventService.checkRequirements([], mockGame)).toBe(true);
    });

    it('should return true when all requirements met', () => {
      const requirements: EventRequirement[] = [
        { type: 'metric', target: 'politics.internalTension', operator: 'gt', value: 60 },
        { type: 'metric', target: 'approval', operator: 'lt', value: 50 },
      ];

      expect(eventService.checkRequirements(requirements, mockGame)).toBe(true);
    });

    it('should return false when any requirement fails', () => {
      const requirements: EventRequirement[] = [
        { type: 'metric', target: 'politics.internalTension', operator: 'gt', value: 60 },
        { type: 'metric', target: 'approval', operator: 'gt', value: 50 }, // Fails
      ];

      expect(eventService.checkRequirements(requirements, mockGame)).toBe(false);
    });
  });

  describe('getMetricValue', () => {
    const mockGame: GameWithState = {
      id: 'test',
      userId: 'test',
      countryId: 'brazil',
      difficulty: 'normal',
      isActive: true,
      currentTurn: 1,
      currentMonth: 1,
      currentYear: 2025,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastPlayedAt: new Date(),
      state: {
        approval: 50,
        stability: 60,
        legitimacy: 55,
        treasury: 100000000000,
        ideology: { economic: -15, liberties: 25, identity: -20, change: 10 },
        politics: {
          approvalRating: 50,
          polarizationIndex: 35,
          internalTension: 30,
          corruptionLevel: 40,
          pressLiberty: 60,
          nextElectionTurn: 48,
          coalitionStability: 55,
          activeReforms: [],
        },
        economy: {
          gdpBillions: 2100,
          gdpGrowth: 2.8,
          inflation: 4.5,
          unemployment: 8.5,
          debtToGdp: 58,
          reservesBillions: 360,
          interestRate: 9.5,
          tradeBalance: 45,
          giniCoefficient: 0.51,
          economicFreedomIndex: 56,
        },
        diplomacy: {
          relations: {},
          activeAlliances: [],
          activeTreaties: [],
          internationalReputation: 52,
          softPower: 50,
          sanctions: [],
        },
        military: {
          personnelThousands: 360,
          budgetBillions: 30,
          equipmentQuality: 52,
          morale: 62,
          readiness: 72,
          activeOperations: [],
          nuclearCapability: false,
        },
        socialGroups: {
          middle_class: {
            currentOpinion: 25,
            mobilization: 30,
            lastInteraction: 3,
            grievances: ['taxes'],
            satisfiedDemands: [],
          },
        },
        activeEffects: [],
        pendingEvents: [],
      },
    };

    it('should get top-level metrics', () => {
      expect(eventService.getMetricValue('approval', mockGame)).toBe(50);
      expect(eventService.getMetricValue('stability', mockGame)).toBe(60);
    });

    it('should get nested metrics', () => {
      expect(eventService.getMetricValue('economy.gdpGrowth', mockGame)).toBe(2.8);
      expect(eventService.getMetricValue('politics.internalTension', mockGame)).toBe(30);
    });

    it('should get social group metrics', () => {
      expect(
        eventService.getMetricValue('socialGroups.middle_class.currentOpinion', mockGame)
      ).toBe(25);
    });

    it('should return null for invalid paths', () => {
      expect(eventService.getMetricValue('invalid', mockGame)).toBeNull();
      expect(eventService.getMetricValue('economy.invalid', mockGame)).toBeNull();
    });
  });

  describe('getEffectPreviews', () => {
    it('should format add effects correctly', () => {
      const effects = [
        { target: 'approval', operation: 'add' as const, value: 10 },
        { target: 'stability', operation: 'add' as const, value: -5 },
      ];

      const previews = eventService.getEffectPreviews(effects);

      expect(previews).toContain('approval: +10');
      expect(previews).toContain('stability: -5');
    });

    it('should format multiply effects correctly', () => {
      const effects = [
        { target: 'economy.gdpGrowth', operation: 'multiply' as const, value: 1.5 },
      ];

      const previews = eventService.getEffectPreviews(effects);

      expect(previews).toContain('economy.gdpGrowth: ×1.5');
    });

    it('should format set effects correctly', () => {
      const effects = [
        { target: 'politics.internalTension', operation: 'set' as const, value: 0 },
      ];

      const previews = eventService.getEffectPreviews(effects);

      expect(previews).toContain('politics.internalTension: =0');
    });
  });

  describe('event registration', () => {
    it('should register and retrieve events', () => {
      const testEvent: GameEvent = {
        id: 'test-event-unique',
        type: 'decision',
        title: { pt: 'Teste', en: 'Test' },
        description: { pt: 'Descrição', en: 'Description' },
        options: [
          {
            id: 'option1',
            text: { pt: 'Opção 1', en: 'Option 1' },
            effects: [{ target: 'approval', operation: 'add', value: 5 }],
          },
        ],
        weight: 0.5,
        cooldownTurns: 12,
      };

      eventService.registerEvent(testEvent);

      const retrieved = eventService.getEvent('test-event-unique');
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe('test-event-unique');
      expect(retrieved?.options).toHaveLength(1);
    });
  });
});
