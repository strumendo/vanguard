import { describe, it, expect, beforeEach } from '@jest/globals';
import { turnProcessor } from '../../src/services/turn-processor.service.js';
import type { GameWithState } from '../../src/repositories/game.repository.js';
import type { ActiveEffect } from '../../src/types/game.types.js';

describe('TurnProcessor', () => {
  describe('processActiveEffects', () => {
    it('should keep permanent effects', () => {
      const effects: ActiveEffect[] = [
        {
          id: 'permanent-1',
          source: 'test',
          type: 'buff',
          target: 'approval',
          value: 5,
          duration: -1, // Permanent
          startTurn: 1,
        },
      ];

      const result = turnProcessor.processActiveEffects(effects, 10);

      expect(result.updatedEffects).toHaveLength(1);
      expect(result.expired).toHaveLength(0);
      expect(result.updatedEffects[0].id).toBe('permanent-1');
    });

    it('should reduce duration of temporary effects', () => {
      const effects: ActiveEffect[] = [
        {
          id: 'temp-1',
          source: 'test',
          type: 'buff',
          target: 'stability',
          value: 10,
          duration: 5,
          startTurn: 1,
        },
      ];

      const result = turnProcessor.processActiveEffects(effects, 2);

      expect(result.updatedEffects).toHaveLength(1);
      expect(result.updatedEffects[0].duration).toBe(4);
      expect(result.expired).toHaveLength(0);
    });

    it('should expire effects with duration 1', () => {
      const effects: ActiveEffect[] = [
        {
          id: 'expiring-1',
          source: 'test',
          type: 'debuff',
          target: 'approval',
          value: 5,
          duration: 1,
          startTurn: 1,
        },
      ];

      const result = turnProcessor.processActiveEffects(effects, 2);

      expect(result.updatedEffects).toHaveLength(0);
      expect(result.expired).toHaveLength(1);
      expect(result.expired[0]).toBe('expiring-1');
    });

    it('should handle mixed effects correctly', () => {
      const effects: ActiveEffect[] = [
        {
          id: 'permanent',
          source: 'test',
          type: 'buff',
          target: 'approval',
          value: 5,
          duration: -1,
          startTurn: 1,
        },
        {
          id: 'expiring',
          source: 'test',
          type: 'debuff',
          target: 'stability',
          value: 3,
          duration: 1,
          startTurn: 1,
        },
        {
          id: 'continuing',
          source: 'test',
          type: 'buff',
          target: 'legitimacy',
          value: 2,
          duration: 3,
          startTurn: 1,
        },
      ];

      const result = turnProcessor.processActiveEffects(effects, 2);

      expect(result.updatedEffects).toHaveLength(2);
      expect(result.expired).toHaveLength(1);
      expect(result.expired[0]).toBe('expiring');
    });
  });

  describe('calculateEconomyChanges', () => {
    const mockGame: GameWithState = {
      id: 'test-game',
      userId: 'test-user',
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
        stability: 50,
        legitimacy: 50,
        treasury: 100000000000,
        ideology: { economic: 0, liberties: 0, identity: 0, change: 0 },
        politics: {
          approvalRating: 50,
          polarizationIndex: 30,
          internalTension: 20,
          corruptionLevel: 40,
          pressLiberty: 60,
          nextElectionTurn: 48,
          coalitionStability: 50,
          activeReforms: [],
        },
        economy: {
          gdpBillions: 2000,
          gdpGrowth: 3,
          inflation: 5,
          unemployment: 10,
          debtToGdp: 60,
          reservesBillions: 350,
          interestRate: 10,
          tradeBalance: 50,
          giniCoefficient: 0.52,
          economicFreedomIndex: 55,
        },
        diplomacy: {
          relations: {},
          activeAlliances: [],
          activeTreaties: [],
          internationalReputation: 50,
          softPower: 50,
          sanctions: [],
        },
        military: {
          personnelThousands: 360,
          budgetBillions: 30,
          equipmentQuality: 50,
          morale: 60,
          readiness: 70,
          activeOperations: [],
          nuclearCapability: false,
        },
        socialGroups: {},
        activeEffects: [],
        pendingEvents: [],
      },
    };

    it('should calculate GDP growth based on stability', () => {
      const changes = turnProcessor.calculateEconomyChanges(mockGame);

      const gdpChange = changes.find((c) => c.metric === 'economy.gdpBillions');
      expect(gdpChange).toBeDefined();
      expect(gdpChange!.delta).toBeGreaterThan(0);
    });

    it('should apply Phillips curve for inflation', () => {
      const changes = turnProcessor.calculateEconomyChanges(mockGame);

      const inflationChange = changes.find((c) => c.metric === 'economy.inflation');
      expect(inflationChange).toBeDefined();
      // With 10% unemployment (above 5% natural rate), inflation should decrease
      expect(inflationChange!.delta).toBeLessThan(0);
    });

    it('should reduce unemployment with positive growth', () => {
      const changes = turnProcessor.calculateEconomyChanges(mockGame);

      const unemploymentChange = changes.find(
        (c) => c.metric === 'economy.unemployment'
      );
      expect(unemploymentChange).toBeDefined();
      // With positive GDP growth, unemployment should decrease
      expect(unemploymentChange!.delta).toBeLessThan(0);
    });
  });

  describe('calculatePoliticsChanges', () => {
    const mockGame: GameWithState = {
      id: 'test-game',
      userId: 'test-user',
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
        approval: 30, // Low approval
        stability: 40,
        legitimacy: 50,
        treasury: 100000000000,
        ideology: { economic: 0, liberties: 0, identity: 0, change: 0 },
        politics: {
          approvalRating: 30,
          polarizationIndex: 50,
          internalTension: 60, // High tension
          corruptionLevel: 50,
          pressLiberty: 50,
          nextElectionTurn: 48,
          coalitionStability: 40,
          activeReforms: [],
        },
        economy: {
          gdpBillions: 2000,
          gdpGrowth: -1, // Negative growth
          inflation: 15, // High inflation
          unemployment: 20, // High unemployment
          debtToGdp: 80,
          reservesBillions: 200,
          interestRate: 15,
          tradeBalance: -20,
          giniCoefficient: 0.55,
          economicFreedomIndex: 45,
        },
        diplomacy: {
          relations: {},
          activeAlliances: [],
          activeTreaties: [],
          internationalReputation: 40,
          softPower: 40,
          sanctions: [],
        },
        military: {
          personnelThousands: 360,
          budgetBillions: 30,
          equipmentQuality: 50,
          morale: 50,
          readiness: 60,
          activeOperations: [],
          nuclearCapability: false,
        },
        socialGroups: {},
        activeEffects: [],
        pendingEvents: [],
      },
    };

    it('should decrease stability with high tension', () => {
      const changes = turnProcessor.calculatePoliticsChanges(mockGame);

      const stabilityChange = changes.find((c) => c.metric === 'stability');
      expect(stabilityChange).toBeDefined();
      // With low approval and high tension, stability should decrease
      expect(stabilityChange!.delta).toBeLessThan(0);
    });

    it('should decay internal tension naturally', () => {
      const changes = turnProcessor.calculatePoliticsChanges(mockGame);

      const tensionChange = changes.find(
        (c) => c.metric === 'politics.internalTension'
      );
      expect(tensionChange).toBeDefined();
      // Tension should naturally decay
      expect(tensionChange!.delta).toBeLessThan(0);
    });
  });

  describe('checkGameOverConditions', () => {
    it('should detect government collapse', () => {
      const game: GameWithState = {
        id: 'test',
        userId: 'test',
        countryId: 'brazil',
        difficulty: 'normal',
        isActive: true,
        currentTurn: 50,
        currentMonth: 2,
        currentYear: 2029,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastPlayedAt: new Date(),
        state: {
          approval: 10,
          stability: 3, // Critical!
          legitimacy: 20,
          treasury: 0,
          ideology: { economic: 0, liberties: 0, identity: 0, change: 0 },
          politics: {
            approvalRating: 10,
            polarizationIndex: 80,
            internalTension: 95,
            corruptionLevel: 70,
            pressLiberty: 20,
            nextElectionTurn: 60,
            coalitionStability: 10,
            activeReforms: [],
          },
          economy: {
            gdpBillions: 1500,
            gdpGrowth: -5,
            inflation: 50,
            unemployment: 35,
            debtToGdp: 120,
            reservesBillions: 50,
            interestRate: 25,
            tradeBalance: -50,
            giniCoefficient: 0.6,
            economicFreedomIndex: 30,
          },
          diplomacy: {
            relations: {},
            activeAlliances: [],
            activeTreaties: [],
            internationalReputation: 20,
            softPower: 20,
            sanctions: [],
          },
          military: {
            personnelThousands: 300,
            budgetBillions: 20,
            equipmentQuality: 40,
            morale: 30,
            readiness: 40,
            activeOperations: [],
            nuclearCapability: false,
          },
          socialGroups: {},
          activeEffects: [],
          pendingEvents: [],
        },
      };

      const result = turnProcessor.checkGameOverConditions(game);

      expect(result.isGameOver).toBe(true);
      expect(result.reason).toBe('Government collapse');
    });

    it('should not trigger game over for stable state', () => {
      const game: GameWithState = {
        id: 'test',
        userId: 'test',
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
          approval: 55,
          stability: 60,
          legitimacy: 65,
          treasury: 100000000000,
          ideology: { economic: 0, liberties: 0, identity: 0, change: 0 },
          politics: {
            approvalRating: 55,
            polarizationIndex: 30,
            internalTension: 25,
            corruptionLevel: 40,
            pressLiberty: 60,
            nextElectionTurn: 48,
            coalitionStability: 55,
            activeReforms: [],
          },
          economy: {
            gdpBillions: 2100,
            gdpGrowth: 2.5,
            inflation: 4,
            unemployment: 8,
            debtToGdp: 55,
            reservesBillions: 380,
            interestRate: 8,
            tradeBalance: 30,
            giniCoefficient: 0.50,
            economicFreedomIndex: 58,
          },
          diplomacy: {
            relations: {},
            activeAlliances: [],
            activeTreaties: [],
            internationalReputation: 55,
            softPower: 55,
            sanctions: [],
          },
          military: {
            personnelThousands: 360,
            budgetBillions: 32,
            equipmentQuality: 55,
            morale: 65,
            readiness: 75,
            activeOperations: [],
            nuclearCapability: false,
          },
          socialGroups: {},
          activeEffects: [],
          pendingEvents: [],
        },
      };

      const result = turnProcessor.checkGameOverConditions(game);

      expect(result.isGameOver).toBe(false);
    });
  });

  describe('applyEffectModifiers', () => {
    it('should apply buff effects to changes', () => {
      const changes = [
        {
          metric: 'approval',
          previousValue: 50,
          newValue: 52,
          delta: 2,
          reason: 'Base change',
        },
      ];

      const effects: ActiveEffect[] = [
        {
          id: 'buff-1',
          source: 'event',
          type: 'buff',
          target: 'approval',
          value: 5,
          duration: 3,
          startTurn: 1,
        },
      ];

      const result = turnProcessor.applyEffectModifiers(changes, effects);

      expect(result[0].delta).toBe(7); // 2 + 5
      expect(result[0].newValue).toBe(57); // 50 + 7
    });

    it('should apply debuff effects to changes', () => {
      const changes = [
        {
          metric: 'stability',
          previousValue: 60,
          newValue: 62,
          delta: 2,
          reason: 'Base change',
        },
      ];

      const effects: ActiveEffect[] = [
        {
          id: 'debuff-1',
          source: 'crisis',
          type: 'debuff',
          target: 'stability',
          value: 10,
          duration: 6,
          startTurn: 1,
        },
      ];

      const result = turnProcessor.applyEffectModifiers(changes, effects);

      expect(result[0].delta).toBe(-8); // 2 - 10
      expect(result[0].newValue).toBe(52); // 60 + (-8)
    });
  });
});
