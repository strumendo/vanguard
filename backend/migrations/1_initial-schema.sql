-- Migration: Initial Schema for VOLUTION
-- Created: 2025-01-01

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(32) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    preferences JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- ============================================
-- GAMES TABLE
-- ============================================
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    country_id VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL DEFAULT 'normal',
    is_active BOOLEAN DEFAULT true,
    current_turn INTEGER DEFAULT 1,
    current_month INTEGER DEFAULT 1,
    current_year INTEGER DEFAULT 2025,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT valid_country CHECK (country_id IN ('brazil', 'usa', 'china', 'russia', 'india', 'south_africa')),
    CONSTRAINT valid_difficulty CHECK (difficulty IN ('easy', 'normal', 'hard', 'ironman')),
    CONSTRAINT valid_month CHECK (current_month >= 1 AND current_month <= 12)
);

CREATE INDEX idx_games_user_id ON games(user_id);
CREATE INDEX idx_games_active ON games(is_active) WHERE is_active = true;

-- ============================================
-- GAME STATES TABLE (Core metrics and system states)
-- ============================================
CREATE TABLE game_states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID UNIQUE NOT NULL REFERENCES games(id) ON DELETE CASCADE,

    -- Core metrics
    approval NUMERIC(5,2) DEFAULT 50.00,
    stability NUMERIC(5,2) DEFAULT 50.00,
    legitimacy NUMERIC(5,2) DEFAULT 50.00,
    treasury NUMERIC(15,2) DEFAULT 0.00,

    -- Ideology position (-100 to +100)
    ideology_economic NUMERIC(5,2) DEFAULT 0.00,
    ideology_liberties NUMERIC(5,2) DEFAULT 0.00,
    ideology_identity NUMERIC(5,2) DEFAULT 0.00,
    ideology_change NUMERIC(5,2) DEFAULT 0.00,

    -- Politics state (JSON for flexibility)
    politics_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Economy state
    economy_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Diplomacy state
    diplomacy_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Military state
    military_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Social groups state
    social_groups_state JSONB NOT NULL DEFAULT '{}'::jsonb,

    -- Active effects and pending events
    active_effects JSONB DEFAULT '[]'::jsonb,
    pending_events JSONB DEFAULT '[]'::jsonb,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_states_game_id ON game_states(game_id);

-- ============================================
-- GAME EVENTS LOG (History of events that occurred)
-- ============================================
CREATE TABLE game_events_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    event_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    turn_occurred INTEGER NOT NULL,
    option_chosen VARCHAR(100),
    effects_applied JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_events_game_id ON game_events_log(game_id);
CREATE INDEX idx_game_events_turn ON game_events_log(game_id, turn_occurred);

-- ============================================
-- GAME ACTIONS LOG (History of player actions)
-- ============================================
CREATE TABLE game_actions_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    action_type VARCHAR(100) NOT NULL,
    action_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    turn_executed INTEGER NOT NULL,
    effects_applied JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_game_actions_game_id ON game_actions_log(game_id);
CREATE INDEX idx_game_actions_turn ON game_actions_log(game_id, turn_executed);

-- ============================================
-- DIPLOMATIC RELATIONS TABLE
-- ============================================
CREATE TABLE diplomatic_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    target_country_id VARCHAR(50) NOT NULL,
    opinion NUMERIC(5,2) DEFAULT 0.00,
    trust NUMERIC(5,2) DEFAULT 50.00,
    trade_dependency NUMERIC(5,2) DEFAULT 0.00,
    ideological_alignment NUMERIC(5,2) DEFAULT 0.00,
    historical_tension VARCHAR(20) DEFAULT 'low',
    active_issues JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT unique_relation UNIQUE (game_id, target_country_id),
    CONSTRAINT valid_tension CHECK (historical_tension IN ('none', 'low', 'medium', 'high', 'extreme'))
);

CREATE INDEX idx_diplomatic_relations_game ON diplomatic_relations(game_id);

-- ============================================
-- UPDATE TIMESTAMP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_games_updated_at
    BEFORE UPDATE ON games
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_game_states_updated_at
    BEFORE UPDATE ON game_states
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_diplomatic_relations_updated_at
    BEFORE UPDATE ON diplomatic_relations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
