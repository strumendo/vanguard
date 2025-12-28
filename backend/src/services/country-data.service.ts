import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { CountryId, IdeologyPosition } from '../types/game.types.js';
import { logger } from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to country data files (relative to project root)
const DATA_PATH = join(__dirname, '..', '..', '..', 'docs', 'data', 'countries');

export interface CountryData {
  country: {
    id: CountryId;
    name: { pt: string; en: string; es?: string };
    flag_emoji: string;
    capital: string;
    region: string;
    difficulty: string;
    difficulty_reason: string;
    start_year: number;
    government_type: string;
    electoral_cycle_months: number;
    next_election_month: number;
  };
  economy: {
    gdp_billions_usd: number;
    gdp_per_capita_usd: number;
    gdp_growth_percent: number;
    inflation_percent: number;
    unemployment_percent: number;
    debt_to_gdp_percent: number;
    gini_coefficient: number;
    reserves_billions_usd: number;
    interest_rate_percent: number;
    trade_balance_billions_usd: number;
    economic_freedom_index: number;
    currency: {
      code: string;
      name: string;
      exchange_rate_usd: number;
    };
  };
  sectors: Record<string, {
    gdp_share_percent: number;
    employment_share_percent: number;
    [key: string]: unknown;
  }>;
  politics: {
    approval_rating: number;
    stability_index: number;
    polarization_index: number;
    legitimacy_index: number;
    internal_tension: number;
    corruption_perception_index: number;
    press_freedom_index: number;
    democracy_index: number;
    ruling_party?: string;
    coalition?: string;
  };
  social_groups: Record<string, {
    name: { pt: string; en: string };
    population_share: number;
    economic_power: number;
    mobilization_capacity: number;
    organization_level: number;
    current_opinion: number;
    ideology_preferences: {
      economic: number;
      liberties: number;
      identity: number;
      change: number;
    };
    key_demands: string[];
    [key: string]: unknown;
  }>;
  ideology_position: {
    economic: number;
    liberties: number;
    identity: number;
    change: number;
  };
  military: {
    active_personnel_thousands: number;
    reserve_personnel_thousands: number;
    military_budget_billions_usd: number;
    military_budget_percent_gdp: number;
    equipment_quality_index: number;
    morale_index: number;
    loyalty_index: number;
    nuclear_capability: boolean;
    power_projection_regional?: boolean;
    power_projection_global?: boolean;
  };
  diplomacy: {
    relations: Record<string, {
      opinion: number;
      trade_dependency_percent?: number;
      ideological_alignment?: number;
      historical_tension?: string;
      key_issues?: string[];
    }>;
    memberships: string[];
    [key: string]: unknown;
  };
  demographics: {
    population_millions: number;
    population_growth_percent: number;
    median_age: number;
    urban_percent: number;
    literacy_percent: number;
    life_expectancy: number;
    hdi: number;
  };
  unique_challenges: Array<{
    id: string;
    name: string;
    description: string;
    affected_metrics: string[];
  }>;
  unique_opportunities: Array<{
    id: string;
    name: string;
    description: string;
    potential_benefits: string[];
  }>;
}

// Cache for loaded country data
const countryDataCache = new Map<CountryId, CountryData>();

export const countryDataService = {
  /**
   * Load country data from JSON file
   */
  loadCountryData(countryId: CountryId): CountryData {
    // Check cache first
    if (countryDataCache.has(countryId)) {
      return countryDataCache.get(countryId)!;
    }

    const filePath = join(DATA_PATH, `${countryId}.json`);

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(fileContent) as CountryData;
      countryDataCache.set(countryId, data);
      logger.info(`Loaded country data for ${countryId}`);
      return data;
    } catch (error) {
      logger.error(`Failed to load country data for ${countryId}:`, error);
      throw new Error(`Country data not found for ${countryId}`);
    }
  },

  /**
   * Get all available countries
   */
  getAvailableCountries(): CountryId[] {
    return ['brazil', 'usa', 'china', 'russia', 'india', 'south_africa'];
  },

  /**
   * Get country summary for selection screen
   */
  getCountrySummary(countryId: CountryId): {
    id: CountryId;
    name: { pt: string; en: string };
    flagEmoji: string;
    difficulty: string;
    difficultyReason: string;
    region: string;
    highlights: {
      gdpBillions: number;
      population: number;
      approval: number;
    };
  } {
    const data = this.loadCountryData(countryId);
    return {
      id: countryId,
      name: data.country.name,
      flagEmoji: data.country.flag_emoji,
      difficulty: data.country.difficulty,
      difficultyReason: data.country.difficulty_reason,
      region: data.country.region,
      highlights: {
        gdpBillions: data.economy.gdp_billions_usd,
        population: data.demographics.population_millions,
        approval: data.politics.approval_rating,
      },
    };
  },

  /**
   * Get all countries summary
   */
  getAllCountriesSummary() {
    return this.getAvailableCountries().map((id) => this.getCountrySummary(id));
  },

  /**
   * Convert country data to initial game state format
   */
  toInitialGameState(countryId: CountryId) {
    const data = this.loadCountryData(countryId);

    return {
      approval: data.politics.approval_rating,
      stability: data.politics.stability_index,
      legitimacy: data.politics.legitimacy_index,
      treasury: data.economy.reserves_billions_usd * 1_000_000_000, // Convert to raw value

      ideology: {
        economic: data.ideology_position.economic,
        liberties: data.ideology_position.liberties,
        identity: data.ideology_position.identity,
        change: data.ideology_position.change,
      } as IdeologyPosition,

      politics: {
        approvalRating: data.politics.approval_rating,
        polarizationIndex: data.politics.polarization_index,
        internalTension: data.politics.internal_tension,
        corruptionLevel: 100 - data.politics.corruption_perception_index, // Invert CPI
        pressLiberty: data.politics.press_freedom_index,
        nextElectionTurn: data.country.next_election_month,
        coalitionStability: data.politics.stability_index,
        activeReforms: [],
      },

      economy: {
        gdpBillions: data.economy.gdp_billions_usd,
        gdpGrowth: data.economy.gdp_growth_percent,
        inflation: data.economy.inflation_percent,
        unemployment: data.economy.unemployment_percent,
        debtToGdp: data.economy.debt_to_gdp_percent,
        reservesBillions: data.economy.reserves_billions_usd,
        interestRate: data.economy.interest_rate_percent,
        tradeBalance: data.economy.trade_balance_billions_usd,
        giniCoefficient: data.economy.gini_coefficient,
        economicFreedomIndex: data.economy.economic_freedom_index,
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
        personnelThousands: data.military.active_personnel_thousands,
        budgetBillions: data.military.military_budget_billions_usd,
        equipmentQuality: data.military.equipment_quality_index,
        morale: data.military.morale_index,
        readiness: 70,
        activeOperations: [],
        nuclearCapability: data.military.nuclear_capability,
      },

      socialGroups: this.convertSocialGroups(data.social_groups),
    };
  },

  /**
   * Convert social groups from JSON format to game state format
   */
  convertSocialGroups(
    groups: CountryData['social_groups']
  ): Record<string, {
    currentOpinion: number;
    mobilization: number;
    lastInteraction: number;
    grievances: string[];
    satisfiedDemands: string[];
  }> {
    const result: Record<string, {
      currentOpinion: number;
      mobilization: number;
      lastInteraction: number;
      grievances: string[];
      satisfiedDemands: string[];
    }> = {};

    for (const [groupId, group] of Object.entries(groups)) {
      result[groupId] = {
        currentOpinion: group.current_opinion,
        mobilization: group.mobilization_capacity * 0.3, // Start at 30% of max
        lastInteraction: 0,
        grievances: group.key_demands,
        satisfiedDemands: [],
      };
    }

    return result;
  },

  /**
   * Get diplomatic relations for a country
   */
  getDiplomaticRelations(countryId: CountryId) {
    const data = this.loadCountryData(countryId);
    const relations: Array<{
      targetCountryId: CountryId;
      relation: {
        opinion: number;
        trust: number;
        tradeDependency: number;
        ideologicalAlignment: number;
        historicalTension: 'none' | 'low' | 'medium' | 'high' | 'extreme';
        activeIssues: string[];
      };
    }> = [];

    // Get relations with other playable countries
    const playableCountries = this.getAvailableCountries().filter(
      (c) => c !== countryId
    );

    for (const targetId of playableCountries) {
      // Try to find relation in data, or create default
      const relKey = this.findRelationKey(data.diplomacy.relations, targetId);
      const relData = relKey ? data.diplomacy.relations[relKey] : null;

      relations.push({
        targetCountryId: targetId,
        relation: {
          opinion: relData?.opinion ?? 0,
          trust: 50,
          tradeDependency: relData?.trade_dependency_percent ?? 5,
          ideologicalAlignment: relData?.ideological_alignment ?? 0,
          historicalTension: this.parseHistoricalTension(
            relData?.historical_tension
          ),
          activeIssues: relData?.key_issues ?? [],
        },
      });
    }

    return relations;
  },

  /**
   * Find relation key in diplomacy data (handles different naming conventions)
   */
  findRelationKey(
    relations: Record<string, unknown>,
    countryId: CountryId
  ): string | null {
    const possibleKeys = [
      countryId,
      countryId.toUpperCase(),
      countryId.replace('_', ' '),
    ];

    for (const key of Object.keys(relations)) {
      if (
        possibleKeys.includes(key.toLowerCase()) ||
        possibleKeys.includes(key.toLowerCase().replace(' ', '_'))
      ) {
        return key;
      }
    }

    return null;
  },

  /**
   * Parse historical tension string to valid enum value
   */
  parseHistoricalTension(
    tension?: string
  ): 'none' | 'low' | 'medium' | 'high' | 'extreme' {
    const validTensions = ['none', 'low', 'medium', 'high', 'extreme'];
    if (tension && validTensions.includes(tension.toLowerCase())) {
      return tension.toLowerCase() as 'none' | 'low' | 'medium' | 'high' | 'extreme';
    }
    return 'low';
  },
};
