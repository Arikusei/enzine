-- Enzine: seasonal model (users, identities, seasons, phases, nodes, …)
-- PostgreSQL 15+
-- Applies after 001_init.sql (drops legacy scaffold tables)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- Legacy cleanup (scaffold from 001_init.sql)
-- ---------------------------------------------------------------------------

DROP TRIGGER IF EXISTS users_updated_at ON users;
DROP TABLE IF EXISTS users CASCADE;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------------

CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ
);

-- ---------------------------------------------------------------------------
-- identities
-- ---------------------------------------------------------------------------

CREATE TABLE identities (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider         TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  username         TEXT,
  raw_profile_json JSONB,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_user_id)
);

CREATE INDEX idx_identities_user_id ON identities (user_id);

-- ---------------------------------------------------------------------------
-- seasons
-- ---------------------------------------------------------------------------

CREATE TABLE seasons (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL,
  starts_at   TIMESTAMPTZ,
  ends_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_seasons_status ON seasons (status);

-- ---------------------------------------------------------------------------
-- phases
-- ---------------------------------------------------------------------------

CREATE TABLE phases (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id   UUID NOT NULL REFERENCES seasons (id) ON DELETE CASCADE,
  order_index INT NOT NULL,
  slug        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL,
  opens_at    TIMESTAMPTZ,
  closes_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (season_id, slug)
);

CREATE INDEX idx_phases_season_id ON phases (season_id);
CREATE INDEX idx_phases_season_order ON phases (season_id, order_index);

-- ---------------------------------------------------------------------------
-- nodes
-- ---------------------------------------------------------------------------

CREATE TABLE nodes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phase_id     UUID NOT NULL REFERENCES phases (id) ON DELETE CASCADE,
  type         TEXT NOT NULL,
  title        TEXT NOT NULL,
  body         TEXT,
  payload_json JSONB,
  order_index  INT NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_nodes_phase_id ON nodes (phase_id);
CREATE INDEX idx_nodes_phase_order ON nodes (phase_id, order_index);

-- ---------------------------------------------------------------------------
-- user_states
-- ---------------------------------------------------------------------------

CREATE TABLE user_states (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  season_id        UUID NOT NULL REFERENCES seasons (id) ON DELETE CASCADE,
  current_phase_id UUID REFERENCES phases (id) ON DELETE SET NULL,
  state            TEXT NOT NULL,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, season_id)
);

CREATE INDEX idx_user_states_season_id ON user_states (season_id);
CREATE INDEX idx_user_states_state ON user_states (state);

DROP TRIGGER IF EXISTS user_states_updated_at ON user_states;
CREATE TRIGGER user_states_updated_at
  BEFORE UPDATE ON user_states
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------

CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id   UUID NOT NULL REFERENCES seasons (id) ON DELETE CASCADE,
  phase_id    UUID REFERENCES phases (id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  location    TEXT,
  starts_at   TIMESTAMPTZ,
  capacity    INT,
  status      TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_season_id ON events (season_id);
CREATE INDEX idx_events_phase_id ON events (phase_id);
CREATE INDEX idx_events_starts_at ON events (starts_at);

-- ---------------------------------------------------------------------------
-- registrations
-- ---------------------------------------------------------------------------

CREATE TABLE registrations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  event_id      UUID NOT NULL REFERENCES events (id) ON DELETE CASCADE,
  status        TEXT NOT NULL,
  qr_token      TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  checked_in_at TIMESTAMPTZ,
  UNIQUE (user_id, event_id)
);

CREATE INDEX idx_registrations_user_id ON registrations (user_id);
CREATE INDEX idx_registrations_event_id ON registrations (event_id);
CREATE INDEX idx_registrations_status ON registrations (status);

-- ---------------------------------------------------------------------------
-- action_logs
-- ---------------------------------------------------------------------------

CREATE TABLE action_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users (id) ON DELETE SET NULL,
  season_id    UUID REFERENCES seasons (id) ON DELETE SET NULL,
  action_type  TEXT NOT NULL,
  object_type  TEXT,
  object_id    UUID,
  payload_json JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_action_logs_user_id ON action_logs (user_id);
CREATE INDEX idx_action_logs_season_id ON action_logs (season_id);
CREATE INDEX idx_action_logs_action_type ON action_logs (action_type);
CREATE INDEX idx_action_logs_created_at ON action_logs (created_at);

-- ---------------------------------------------------------------------------
-- crm_outbox (Bitrix24 and other CRM events)
-- ---------------------------------------------------------------------------

CREATE TABLE crm_outbox (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type   TEXT NOT NULL,
  payload_json JSONB NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  attempts     INT NOT NULL DEFAULT 0,
  last_error   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sent_at      TIMESTAMPTZ
);

CREATE INDEX idx_crm_outbox_status ON crm_outbox (status);
CREATE INDEX idx_crm_outbox_pending ON crm_outbox (created_at)
  WHERE status = 'pending';
