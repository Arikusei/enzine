-- Demo seed data (telegram_id is fictional)
INSERT INTO users (telegram_id, username, first_name, last_name, role)
VALUES
  (100001, 'demo_user', 'Demo', 'User', 'user'),
  (100002, 'demo_admin', 'Demo', 'Admin', 'admin')
ON CONFLICT (telegram_id) DO NOTHING;
