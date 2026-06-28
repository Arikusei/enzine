# База данных

PostgreSQL: миграции и сиды для Enzine.

## Структура

```
database/
├── migrations/
│   ├── 001_init.sql           # legacy scaffold (заменяется в 002)
│   └── 002_seasonal_model.sql # сезонная модель (основная схема)
└── seeds/
    ├── 001_users.sql                  # legacy (не использовать после 002)
    ├── 002_seasonal_demo.sql          # ранний демо-сид
    ├── 004_test_season.sql            # TASK-04: тестовый сезон (основной)
    └── 004_test_season_verify.sql     # проверка после seed
```

## Сезонная модель

| Таблица | Назначение |
|---------|------------|
| `users` | Пользователь платформы (UUID) |
| `identities` | Привязки к провайдерам (Telegram и др.) |
| `seasons` | Сезоны |
| `phases` | Фазы внутри сезона |
| `nodes` | Контент-узлы фазы (сообщения, формы) |
| `user_states` | FSM-состояние пользователя в сезоне |
| `events` | Мероприятия |
| `registrations` | Регистрации на мероприятия + QR |
| `action_logs` | Аудит действий |
| `crm_outbox` | Исходящие события для Bitrix24 |

## Применение (локально)

```bash
# Создать БД
createdb enzine

# Миграции (по порядку)
psql $DATABASE_URL -f database/migrations/001_init.sql
psql $DATABASE_URL -f database/migrations/002_seasonal_model.sql

# Сиды
psql $DATABASE_URL -f database/seeds/004_test_season.sql

# или через npm (требует psql в PATH)
npm run db:seed
npm run db:seed:verify
```

## TASK-04: тестовый сезон

| Сущность | Значение |
|----------|----------|
| Season slug | `test-season` |
| Telegram users | `@test_user` (999001), `@test_admin` (999002) |
| Phases | `welcome` → `main` → `finish` |
| Nodes | 6 (message, form, webapp, quiz) |
| Events | «Тестовый воркшоп», «Тестовый митап» |
| CRM outbox | `bitrix24.lead.create` (pending) |

```bash
npm run db:seed
npm run db:seed:verify
```

## Проверка схемы

```bash
psql $DATABASE_URL -c "\dt"
psql $DATABASE_URL -c "\d identities"
psql $DATABASE_URL -c "\d user_states"
psql $DATABASE_URL -c "\d crm_outbox"
```

## Ключевые ограничения

- `identities` — `UNIQUE (provider, provider_user_id)`
- `user_states` — `UNIQUE (user_id, season_id)`
- `registrations` — `UNIQUE (qr_token)`
- `crm_outbox.status` — `pending` → worker → `sent` / `failed`

## Переменные окружения

`DATABASE_URL` — см. `.env.example` в корне репозитория.
