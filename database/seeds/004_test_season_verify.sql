-- Проверка TASK-04 seed: тестовый сезон test-season
-- Запуск: psql $DATABASE_URL -f database/seeds/004_test_season_verify.sql

\echo '=== seasons ==='
SELECT slug, title, status FROM seasons WHERE slug = 'test-season';

\echo '=== phases ==='
SELECT p.slug, p.order_index, p.status
FROM phases p
JOIN seasons s ON s.id = p.season_id
WHERE s.slug = 'test-season'
ORDER BY p.order_index;

\echo '=== nodes count ==='
SELECT p.slug AS phase, COUNT(n.id) AS nodes
FROM phases p
JOIN seasons s ON s.id = p.season_id
LEFT JOIN nodes n ON n.phase_id = p.id
WHERE s.slug = 'test-season'
GROUP BY p.slug, p.order_index
ORDER BY p.order_index;

\echo '=== user_states ==='
SELECT u.id AS user_id, i.username, us.state, ph.slug AS phase
FROM user_states us
JOIN users u ON u.id = us.user_id
JOIN seasons s ON s.id = us.season_id
LEFT JOIN identities i ON i.user_id = u.id AND i.provider = 'telegram'
LEFT JOIN phases ph ON ph.id = us.current_phase_id
WHERE s.slug = 'test-season';

\echo '=== events ==='
SELECT e.title, e.status, e.capacity
FROM events e
JOIN seasons s ON s.id = e.season_id
WHERE s.slug = 'test-season';

\echo '=== registrations ==='
SELECT i.username, e.title, r.status, r.qr_token
FROM registrations r
JOIN users u ON u.id = r.user_id
JOIN events e ON e.id = r.event_id
JOIN seasons s ON s.id = e.season_id
LEFT JOIN identities i ON i.user_id = u.id AND i.provider = 'telegram'
WHERE s.slug = 'test-season';

\echo '=== crm_outbox pending ==='
SELECT event_type, status, payload_json->>'season_slug' AS season
FROM crm_outbox
WHERE payload_json->>'season_slug' = 'test-season';
