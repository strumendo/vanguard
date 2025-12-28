// Core Game Types for VOLUTION

export type CountryId =
  | 'brazil'
  | 'usa'
  | 'china'
  | 'russia'
  | 'india'
  | 'south_africa';

export type Difficulty = 'easy' | 'normal' | 'hard' | 'ironman';

export type GameSystem = 'politics' | 'economy' | 'diplomacy' | 'military';

// Ideology Axes (-100 to +100)
export interface IdeologyPosition {
  economic: number; // -100 (interventionist) to +100 (free market)
  liberties: number; // -100 (authoritarian) to +100 (libertarian)
  identity: number; // -100 (progressive/global) to +100 (conservative/national)
  change: number; // -100 (stability) to +100 (revolutionary)
}

// Social Group
export interface SocialGroup {
  id: string;
  name: {
    pt: string;
    en: string;
    es?: string;
  };
  populationShare: number; // 0.0 to 1.0
  economicPower: number; // 0 to 100
  mobilizationCapacity: number; // 0 to 100
  organizationLevel: number; // 0 to 100
  currentOpinion: number; // -100 to +100
  ideologyPreferences: IdeologyPosition;
  keyDemands: string[];
}

// Game State
export interface GameState {
  id: string;
  userId: string;
  countryId: CountryId;
  difficulty: Difficulty;
  currentTurn: number;
  currentMonth: number; // 1-12
  currentYear: number;
  isActive: boolean;

  // Core metrics
  approval: number;
  stability: number;
  legitimacy: number;
  treasury: number;

  // System states
  politics: PoliticsState;
  economy: EconomyState;
  diplomacy: DiplomacyState;
  military: MilitaryState;

  // Social groups
  socialGroups: Record<string, SocialGroupState>;

  // Current ideology position
  ideology: IdeologyPosition;

  // Active events
  pendingEvents: string[];
  activeEffects: ActiveEffect[];

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastPlayedAt: Date;
}

export interface PoliticsState {
  approvalRating: number;
  polarizationIndex: number;
  internalTension: number;
  corruptionLevel: number;
  pressLiberty: number;
  nextElectionTurn: number;
  coalitionStability: number;
  activeReforms: string[];
}

export interface EconomyState {
  gdpBillions: number;
  gdpGrowth: number;
  inflation: number;
  unemployment: number;
  debtToGdp: number;
  reservesBillions: number;
  interestRate: number;
  tradeBalance: number;
  giniCoefficient: number;
  economicFreedomIndex: number;
}

export interface DiplomacyState {
  relations: Record<CountryId, DiplomaticRelation>;
  activeAlliances: string[];
  activeTreaties: string[];
  internationalReputation: number;
  softPower: number;
  sanctions: SanctionState[];
}

export interface DiplomaticRelation {
  opinion: number; // -100 to +100
  trust: number; // 0 to 100
  tradeDependency: number; // percentage
  ideologicalAlignment: number; // -100 to +100
  historicalTension: 'none' | 'low' | 'medium' | 'high' | 'extreme';
  activeIssues: string[];
}

export interface SanctionState {
  imposedBy: CountryId;
  type: 'trade' | 'financial' | 'arms' | 'travel' | 'full';
  severity: number;
  startTurn: number;
}

export interface MilitaryState {
  personnelThousands: number;
  budgetBillions: number;
  equipmentQuality: number;
  morale: number;
  readiness: number;
  activeOperations: string[];
  nuclearCapability: boolean;
}

export interface SocialGroupState {
  currentOpinion: number;
  mobilization: number;
  lastInteraction: number; // turn number
  grievances: string[];
  satisfiedDemands: string[];
}

export interface ActiveEffect {
  id: string;
  source: string; // event or action that caused it
  type: 'buff' | 'debuff' | 'neutral';
  target: string; // metric or system affected
  value: number;
  duration: number; // turns remaining, -1 for permanent
  startTurn: number;
}

// Events
export interface GameEvent {
  id: string;
  type:
    | 'crisis'
    | 'opportunity'
    | 'decision'
    | 'consequence'
    | 'random'
    | 'scheduled';
  title: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  imageKey?: string;
  options: EventOption[];
  requirements?: EventRequirement[];
  weight: number;
  cooldownTurns: number;
  countrySpecific?: CountryId[];
}

export interface EventOption {
  id: string;
  text: {
    pt: string;
    en: string;
  };
  effects: EventEffect[];
  requirements?: EventRequirement[];
  aiHint?: string; // hint for AI advisor
}

export interface EventEffect {
  target: string;
  operation: 'add' | 'multiply' | 'set';
  value: number;
  delay?: number; // turns until effect applies
}

export interface EventRequirement {
  type: 'metric' | 'ideology' | 'relation' | 'turn' | 'event';
  target: string;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'between';
  value: number | [number, number];
}

// Actions
export interface GameAction {
  id: string;
  type: string;
  category: GameSystem;
  name: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
  cost: ActionCost;
  effects: EventEffect[];
  requirements?: EventRequirement[];
  cooldownTurns: number;
}

export interface ActionCost {
  politicalCapital?: number;
  treasury?: number;
  approval?: number;
  internationalReputation?: number;
}

// NPC Country Decision
export interface NPCDecision {
  countryId: CountryId;
  decisionType: 'trade' | 'diplomacy' | 'military' | 'reaction';
  action: string;
  reasoning: string;
  effects: EventEffect[];
  playerRelationChange: number;
}
