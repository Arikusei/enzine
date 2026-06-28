-- TASK-04: Seed тестового сезона
-- Идемпотентный сид для локальной разработки и QA.
-- Запуск: npm run db:seed  (или psql $DATABASE_URL -f database/seeds/004_test_season.sql)

-- =============================================================================
-- Тестовые пользователи
-- =============================================================================

INSERT INTO users (id, created_at, last_seen_at)
VALUES
  ('f0040001-0000-4000-8000-000000000001', NOW(), NOW()),
  ('f0040001-0000-4000-8000-000000000002', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET last_seen_at = EXCLUDED.last_seen_at;

INSERT INTO identities (id, user_id, provider, provider_user_id, username, raw_profile_json)
VALUES
  (
    'f0040002-0000-4000-8000-000000000001',
    'f0040001-0000-4000-8000-000000000001',
    'telegram',
    '999001',
    'test_user',
    '{"first_name": "Test", "last_name": "User", "language_code": "ru"}'::jsonb
  ),
  (
    'f0040002-0000-4000-8000-000000000002',
    'f0040001-0000-4000-8000-000000000002',
    'telegram',
    '999002',
    'test_admin',
    '{"first_name": "Test", "last_name": "Admin", "language_code": "ru"}'::jsonb
  )
ON CONFLICT (provider, provider_user_id) DO UPDATE
  SET username = EXCLUDED.username,
      raw_profile_json = EXCLUDED.raw_profile_json;

-- =============================================================================
-- Сезон: test-season
-- =============================================================================

INSERT INTO seasons (id, slug, title, description, status, starts_at, ends_at)
VALUES (
  'f0040003-0000-4000-8000-000000000001',
  'test-season',
  'Тестовый сезон',
  'Сезон для локальной разработки и QA (TASK-04)',
  'active',
  TIMESTAMPTZ '2026-06-01 00:00:00+00',
  TIMESTAMPTZ '2026-09-30 23:59:59+00'
)
ON CONFLICT (slug) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      status = EXCLUDED.status,
      starts_at = EXCLUDED.starts_at,
      ends_at = EXCLUDED.ends_at;

-- =============================================================================
-- Фазы
-- =============================================================================

INSERT INTO phases (id, season_id, order_index, slug, title, description, status, opens_at, closes_at)
VALUES
  (
    'f0040004-0000-4000-8000-000000000001',
    'f0040003-0000-4000-8000-000000000001',
    1,
    'welcome',
    'Приветствие',
    'Онбординг и сбор контактов',
    'active',
    TIMESTAMPTZ '2026-06-01 00:00:00+00',
    TIMESTAMPTZ '2026-06-15 23:59:59+00'
  ),
  (
    'f0040004-0000-4000-8000-000000000002',
    'f0040003-0000-4000-8000-000000000001',
    2,
    'main',
    'Основная программа',
    'Контент, мероприятия и Mini App',
    'active',
    TIMESTAMPTZ '2026-06-16 00:00:00+00',
    TIMESTAMPTZ '2026-09-15 23:59:59+00'
  ),
  (
    'f0040004-0000-4000-8000-000000000003',
    'f0040003-0000-4000-8000-000000000001',
    3,
    'finish',
    'Завершение',
    'Итоги сезона и обратная связь',
    'draft',
    TIMESTAMPTZ '2026-09-16 00:00:00+00',
    TIMESTAMPTZ '2026-09-30 23:59:59+00'
  )
ON CONFLICT (season_id, slug) DO UPDATE
  SET order_index = EXCLUDED.order_index,
      title = EXCLUDED.title,
      description = EXCLUDED.description,
      status = EXCLUDED.status,
      opens_at = EXCLUDED.opens_at,
      closes_at = EXCLUDED.closes_at;

-- =============================================================================
-- Узлы (nodes)
-- =============================================================================

INSERT INTO nodes (id, phase_id, type, title, body, payload_json, order_index, is_active)
VALUES
  -- welcome
  (
    'f0040005-0000-4000-8000-000000000001',
    'f0040004-0000-4000-8000-000000000001',
    'message',
    'Добро пожаловать в тестовый сезон',
    'Это демо-сценарий TASK-04. Нажмите «Продолжить», чтобы заполнить контакты.',
    '{"cta": "continue", "keyboard": ["continue", "help"]}'::jsonb,
    1,
    TRUE
  ),
  (
    'f0040005-0000-4000-8000-000000000002',
    'f0040004-0000-4000-8000-000000000001',
    'form',
    'Контактные данные',
    NULL,
    '{"fields": ["phone", "email"], "required": ["phone"]}'::jsonb,
    2,
    TRUE
  ),
  -- main
  (
    'f0040005-0000-4000-8000-000000000003',
    'f0040004-0000-4000-8000-000000000002',
    'message',
    'Программа сезона',
    'Зарегистрируйтесь на мероприятия и откройте Mini App.',
    '{"cta": "open_program"}'::jsonb,
    1,
    TRUE
  ),
  (
    'f0040005-0000-4000-8000-000000000004',
    'f0040004-0000-4000-8000-000000000002',
    'webapp',
    'Mini App',
    NULL,
    '{"url": "/miniapp", "button_text": "Открыть приложение"}'::jsonb,
    2,
    TRUE
  ),
  (
    'f0040005-0000-4000-8000-000000000005',
    'f0040004-0000-4000-8000-000000000002',
    'quiz',
    'Короткий опрос',
    'Ответьте на 3 вопроса о программе.',
    '{"questions": 3, "pass_score": 2}'::jsonb,
    3,
    TRUE
  ),
  -- finish
  (
    'f0040005-0000-4000-8000-000000000006',
    'f0040004-0000-4000-8000-000000000003',
    'message',
    'Спасибо за участие',
    'Сезон завершён. Ждём вас в следующем!',
    '{"cta": "feedback"}'::jsonb,
    1,
    FALSE
  )
ON CONFLICT (id) DO UPDATE
  SET type = EXCLUDED.type,
      title = EXCLUDED.title,
      body = EXCLUDED.body,
      payload_json = EXCLUDED.payload_json,
      order_index = EXCLUDED.order_index,
      is_active = EXCLUDED.is_active;

-- =============================================================================
-- Состояния пользователей (FSM)
-- =============================================================================

INSERT INTO user_states (id, user_id, season_id, current_phase_id, state)
VALUES
  (
    'f0040006-0000-4000-8000-000000000001',
    'f0040001-0000-4000-8000-000000000001',
    'f0040003-0000-4000-8000-000000000001',
    'f0040004-0000-4000-8000-000000000001',
    'NEW_USER'
  ),
  (
    'f0040006-0000-4000-8000-000000000002',
    'f0040001-0000-4000-8000-000000000002',
    'f0040003-0000-4000-8000-000000000001',
    'f0040004-0000-4000-8000-000000000002',
    'PHASE_2_AVAILABLE'
  )
ON CONFLICT (user_id, season_id) DO UPDATE
  SET current_phase_id = EXCLUDED.current_phase_id,
      state = EXCLUDED.state,
      updated_at = NOW();

-- =============================================================================
-- Мероприятия
-- =============================================================================

INSERT INTO events (id, season_id, phase_id, title, description, location, starts_at, capacity, status)
VALUES
  (
    'f0040007-0000-4000-8000-000000000001',
    'f0040003-0000-4000-8000-000000000001',
    'f0040004-0000-4000-8000-000000000002',
    'Тестовый воркшоп',
    'Hands-on сессия для проверки registrations и QR',
    'Зал A / онлайн',
    TIMESTAMPTZ '2026-07-10 14:00:00+00',
    50,
    'published'
  ),
  (
    'f0040007-0000-4000-8000-000000000002',
    'f0040003-0000-4000-8000-000000000001',
    'f0040004-0000-4000-8000-000000000002',
    'Тестовый митап',
    'Networking и Q&A',
    'Зал B',
    TIMESTAMPTZ '2026-08-05 18:00:00+00',
    30,
    'published'
  )
ON CONFLICT (id) DO UPDATE
  SET title = EXCLUDED.title,
      description = EXCLUDED.description,
      location = EXCLUDED.location,
      starts_at = EXCLUDED.starts_at,
      capacity = EXCLUDED.capacity,
      status = EXCLUDED.status;

-- =============================================================================
-- Регистрации
-- =============================================================================

INSERT INTO registrations (id, user_id, event_id, status, qr_token, checked_in_at)
VALUES
  (
    'f0040008-0000-4000-8000-000000000001',
    'f0040001-0000-4000-8000-000000000001',
    'f0040007-0000-4000-8000-000000000001',
    'confirmed',
    'test-season-qr-workshop-001',
    NULL
  ),
  (
    'f0040008-0000-4000-8000-000000000002',
    'f0040001-0000-4000-8000-000000000002',
    'f0040007-0000-4000-8000-000000000002',
    'confirmed',
    'test-season-qr-meetup-002',
    NULL
  )
ON CONFLICT (user_id, event_id) DO UPDATE
  SET status = EXCLUDED.status,
      qr_token = EXCLUDED.qr_token;

-- =============================================================================
-- Логи действий
-- =============================================================================

INSERT INTO action_logs (id, user_id, season_id, action_type, object_type, object_id, payload_json)
VALUES
  (
    'f0040009-0000-4000-8000-000000000001',
    'f0040001-0000-4000-8000-000000000001',
    'f0040003-0000-4000-8000-000000000001',
    'SEASON_OPENED',
    'season',
    'f0040003-0000-4000-8000-000000000001',
    '{"source": "telegram", "command": "/start"}'::jsonb
  ),
  (
    'f0040009-0000-4000-8000-000000000002',
    'f0040001-0000-4000-8000-000000000001',
    'f0040003-0000-4000-8000-000000000001',
    'IRL_OPENED',
    'registration',
    'f0040008-0000-4000-8000-000000000001',
    '{"event_title": "Тестовый воркшоп"}'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CRM outbox (Bitrix24)
-- =============================================================================

INSERT INTO crm_outbox (id, event_type, payload_json, status, attempts)
VALUES (
  'f004000a-0000-4000-8000-000000000001',
  'bitrix24.lead.create',
  '{
    "season_slug": "test-season",
    "name": "Test User",
    "phone": "+7900999001",
    "source": "telegram",
    "telegram_id": "999001",
    "comments": "TASK-04 test season seed"
  }'::jsonb,
  'pending',
  0
)
ON CONFLICT (id) DO NOTHING;
