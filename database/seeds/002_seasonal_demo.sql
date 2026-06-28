-- Demo seed: seasonal model
-- Run after migrations 001_init.sql + 002_seasonal_model.sql

-- Users
INSERT INTO users (id, created_at, last_seen_at)
VALUES
  ('a0000001-0000-4000-8000-000000000001', NOW(), NOW()),
  ('a0000001-0000-4000-8000-000000000002', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Identities (Telegram)
INSERT INTO identities (user_id, provider, provider_user_id, username, raw_profile_json)
VALUES
  (
    'a0000001-0000-4000-8000-000000000001',
    'telegram',
    '100001',
    'demo_user',
    '{"first_name": "Demo", "last_name": "User"}'::jsonb
  ),
  (
    'a0000001-0000-4000-8000-000000000002',
    'telegram',
    '100002',
    'demo_admin',
    '{"first_name": "Demo", "last_name": "Admin"}'::jsonb
  )
ON CONFLICT (provider, provider_user_id) DO NOTHING;

-- Season
INSERT INTO seasons (id, slug, title, description, status, starts_at, ends_at)
VALUES (
  'b0000001-0000-4000-8000-000000000001',
  'summer-2026',
  'Летний сезон 2026',
  'Демо-сезон Enzine',
  'active',
  '2026-06-01T00:00:00Z',
  '2026-08-31T23:59:59Z'
)
ON CONFLICT (slug) DO NOTHING;

-- Phases
INSERT INTO phases (id, season_id, order_index, slug, title, description, status, opens_at, closes_at)
VALUES
  (
    'c0000001-0000-4000-8000-000000000001',
    'b0000001-0000-4000-8000-000000000001',
    1,
    'registration',
    'Регистрация',
    'Сбор данных участников',
    'active',
    '2026-06-01T00:00:00Z',
    '2026-06-30T23:59:59Z'
  ),
  (
    'c0000001-0000-4000-8000-000000000002',
    'b0000001-0000-4000-8000-000000000001',
    2,
    'program',
    'Программа',
    'Основная программа сезона',
    'draft',
    '2026-07-01T00:00:00Z',
    '2026-08-31T23:59:59Z'
  )
ON CONFLICT (season_id, slug) DO NOTHING;

-- Nodes
INSERT INTO nodes (id, phase_id, type, title, body, payload_json, order_index, is_active)
VALUES
  (
    'e0000001-0000-4000-8000-000000000001',
    'c0000001-0000-4000-8000-000000000001',
    'message',
    'Добро пожаловать',
    'Заполните регистрационную форму',
    '{"cta": "start_registration"}'::jsonb,
    1,
    TRUE
  ),
  (
    'e0000001-0000-4000-8000-000000000002',
    'c0000001-0000-4000-8000-000000000001',
    'form',
    'Контактные данные',
    NULL,
    '{"fields": ["phone", "email"]}'::jsonb,
    2,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- User state
INSERT INTO user_states (user_id, season_id, current_phase_id, state)
VALUES (
  'a0000001-0000-4000-8000-000000000001',
  'b0000001-0000-4000-8000-000000000001',
  'c0000001-0000-4000-8000-000000000001',
  'idle'
)
ON CONFLICT (user_id, season_id) DO NOTHING;

-- Event
INSERT INTO events (id, season_id, phase_id, title, description, location, starts_at, capacity, status)
VALUES (
  'd0000001-0000-4000-8000-000000000001',
  'b0000001-0000-4000-8000-000000000001',
  'c0000001-0000-4000-8000-000000000002',
  'Открытие сезона',
  'Стартовое мероприятие',
  'Онлайн',
  '2026-07-01T18:00:00Z',
  100,
  'published'
)
ON CONFLICT (id) DO NOTHING;

-- Registration
INSERT INTO registrations (user_id, event_id, status, qr_token)
VALUES (
  'a0000001-0000-4000-8000-000000000001',
  'd0000001-0000-4000-8000-000000000001',
  'confirmed',
  'qr-demo-token-001'
)
ON CONFLICT (qr_token) DO NOTHING;

-- Action log
INSERT INTO action_logs (user_id, season_id, action_type, object_type, object_id, payload_json)
VALUES (
  'a0000001-0000-4000-8000-000000000001',
  'b0000001-0000-4000-8000-000000000001',
  'registration.created',
  'registration',
  NULL,
  '{"event_slug": "opening"}'::jsonb
);

-- CRM outbox (Bitrix24 lead creation)
INSERT INTO crm_outbox (event_type, payload_json, status)
VALUES (
  'bitrix24.lead.create',
  '{
    "name": "Demo User",
    "phone": "+79001234567",
    "source": "telegram",
    "telegram_id": "100001"
  }'::jsonb,
  'pending'
);
