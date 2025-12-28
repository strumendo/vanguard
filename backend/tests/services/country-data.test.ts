import { describe, it, expect } from '@jest/globals';
import { countryDataService } from '../../src/services/country-data.service.js';
import type { CountryId } from '../../src/types/game.types.js';

describe('CountryDataService', () => {
  describe('getAvailableCountries', () => {
    it('should return all 6 playable countries', () => {
      const countries = countryDataService.getAvailableCountries();

      expect(countries).toHaveLength(6);
      expect(countries).toContain('brazil');
      expect(countries).toContain('usa');
      expect(countries).toContain('china');
      expect(countries).toContain('russia');
      expect(countries).toContain('india');
      expect(countries).toContain('south_africa');
    });
  });

  describe('loadCountryData', () => {
    it('should load Brazil data successfully', () => {
      const data = countryDataService.loadCountryData('brazil');

      expect(data).toBeDefined();
      expect(data.country.id).toBe('brazil');
      expect(data.country.name.en).toBe('Brazil');
      expect(data.economy).toBeDefined();
      expect(data.politics).toBeDefined();
      expect(data.social_groups).toBeDefined();
    });

    it('should load USA data successfully', () => {
      const data = countryDataService.loadCountryData('usa');

      expect(data).toBeDefined();
      expect(data.country.id).toBe('usa');
      expect(data.country.name.en).toContain('United States');
    });

    it('should load China data successfully', () => {
      const data = countryDataService.loadCountryData('china');

      expect(data).toBeDefined();
      expect(data.country.id).toBe('china');
    });

    it('should cache loaded data', () => {
      // First load
      const data1 = countryDataService.loadCountryData('brazil');
      // Second load should be from cache
      const data2 = countryDataService.loadCountryData('brazil');

      expect(data1).toBe(data2); // Same reference
    });

    it('should have valid economic data for all countries', () => {
      const countries = countryDataService.getAvailableCountries();

      for (const countryId of countries) {
        const data = countryDataService.loadCountryData(countryId);

        expect(data.economy.gdp_billions_usd).toBeGreaterThan(0);
        expect(data.economy.gdp_per_capita_usd).toBeGreaterThan(0);
        expect(data.economy.unemployment_percent).toBeGreaterThanOrEqual(0);
        expect(data.economy.inflation_percent).toBeDefined();
      }
    });

    it('should have valid political data for all countries', () => {
      const countries = countryDataService.getAvailableCountries();

      for (const countryId of countries) {
        const data = countryDataService.loadCountryData(countryId);

        expect(data.politics.approval_rating).toBeGreaterThanOrEqual(0);
        expect(data.politics.approval_rating).toBeLessThanOrEqual(100);
        expect(data.politics.stability_index).toBeGreaterThanOrEqual(0);
        expect(data.politics.stability_index).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('getCountrySummary', () => {
    it('should return summary for Brazil', () => {
      const summary = countryDataService.getCountrySummary('brazil');

      expect(summary.id).toBe('brazil');
      expect(summary.name.en).toBe('Brazil');
      expect(summary.flagEmoji).toBe('🇧🇷');
      expect(summary.difficulty).toBeDefined();
      expect(summary.highlights.gdpBillions).toBeGreaterThan(0);
      expect(summary.highlights.population).toBeGreaterThan(0);
    });

    it('should return summary for all countries', () => {
      const countries = countryDataService.getAvailableCountries();

      for (const countryId of countries) {
        const summary = countryDataService.getCountrySummary(countryId);

        expect(summary.id).toBe(countryId);
        expect(summary.name.en).toBeDefined();
        expect(summary.flagEmoji).toBeDefined();
        expect(summary.difficulty).toBeDefined();
      }
    });
  });

  describe('getAllCountriesSummary', () => {
    it('should return summaries for all 6 countries', () => {
      const summaries = countryDataService.getAllCountriesSummary();

      expect(summaries).toHaveLength(6);

      const ids = summaries.map((s) => s.id);
      expect(ids).toContain('brazil');
      expect(ids).toContain('usa');
      expect(ids).toContain('china');
      expect(ids).toContain('russia');
      expect(ids).toContain('india');
      expect(ids).toContain('south_africa');
    });
  });

  describe('toInitialGameState', () => {
    it('should convert Brazil data to game state', () => {
      const state = countryDataService.toInitialGameState('brazil');

      expect(state.approval).toBeGreaterThanOrEqual(0);
      expect(state.approval).toBeLessThanOrEqual(100);
      expect(state.stability).toBeGreaterThanOrEqual(0);
      expect(state.stability).toBeLessThanOrEqual(100);
      expect(state.legitimacy).toBeDefined();
      expect(state.treasury).toBeGreaterThan(0);

      expect(state.ideology).toBeDefined();
      expect(state.ideology.economic).toBeDefined();
      expect(state.ideology.liberties).toBeDefined();

      expect(state.politics).toBeDefined();
      expect(state.economy).toBeDefined();
      expect(state.diplomacy).toBeDefined();
      expect(state.military).toBeDefined();
      expect(state.socialGroups).toBeDefined();
    });

    it('should convert social groups correctly', () => {
      const state = countryDataService.toInitialGameState('brazil');

      expect(Object.keys(state.socialGroups).length).toBeGreaterThan(0);

      for (const [groupId, group] of Object.entries(state.socialGroups)) {
        expect(group.currentOpinion).toBeDefined();
        expect(group.mobilization).toBeDefined();
        expect(group.lastInteraction).toBe(0);
        expect(group.grievances).toBeDefined();
        expect(Array.isArray(group.grievances)).toBe(true);
        expect(group.satisfiedDemands).toEqual([]);
      }
    });

    it('should work for all countries', () => {
      const countries = countryDataService.getAvailableCountries();

      for (const countryId of countries) {
        const state = countryDataService.toInitialGameState(countryId);

        expect(state.approval).toBeDefined();
        expect(state.economy).toBeDefined();
        expect(state.military).toBeDefined();
      }
    });
  });

  describe('getDiplomaticRelations', () => {
    it('should return relations for Brazil with other playable countries', () => {
      const relations = countryDataService.getDiplomaticRelations('brazil');

      expect(relations.length).toBe(5); // 6 countries - 1 (self)

      const targetCountries = relations.map((r) => r.targetCountryId);
      expect(targetCountries).not.toContain('brazil');
      expect(targetCountries).toContain('usa');
      expect(targetCountries).toContain('china');
    });

    it('should have valid relation data', () => {
      const relations = countryDataService.getDiplomaticRelations('brazil');

      for (const rel of relations) {
        expect(rel.relation.opinion).toBeDefined();
        expect(rel.relation.trust).toBeGreaterThanOrEqual(0);
        expect(rel.relation.trust).toBeLessThanOrEqual(100);
        expect(rel.relation.historicalTension).toMatch(
          /^(none|low|medium|high|extreme)$/
        );
      }
    });
  });

  describe('parseHistoricalTension', () => {
    it('should parse valid tensions', () => {
      expect(countryDataService.parseHistoricalTension('low')).toBe('low');
      expect(countryDataService.parseHistoricalTension('high')).toBe('high');
      expect(countryDataService.parseHistoricalTension('MEDIUM')).toBe('medium');
    });

    it('should default to low for invalid tensions', () => {
      expect(countryDataService.parseHistoricalTension(undefined)).toBe('low');
      expect(countryDataService.parseHistoricalTension('invalid')).toBe('low');
    });
  });
});
