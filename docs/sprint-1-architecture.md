# Sprint 1 — Архитектура Enzine

Документ фиксирует целевую архитектуру первого спринта: Telegram Bot + Mini App, общая база, синхронизация с Bitrix24.

---

## 1. Выбранный стек

| Слой | Технология | Назначение |
|------|------------|------------|
| Monorepo | npm workspaces | Единый репозиторий, общие зависимости |
| Runtime | Node.js 20+ | Bot, будущий API-слой |
| Язык | TypeScript 5 | Типизация во всех пакетах |
| Telegram Bot | [grammY](https://grammy.dev/) | Команды, диалоги, webhook / long polling |
| Mini App | [Next.js 15](https://nextjs.org/) (App Router) | Telegram Web App UI |
| UI | React 19 | Клиентские компоненты Mini App |
| База данных | PostgreSQL 15+ | Основное хранилище |
| Миграции | SQL-файлы (`database/migrations/`) | Версионирование схемы |
| Shared | `@enzine/shared` | Типы, enums, helpers, константы env |
| CRM | Bitrix24 REST API | Лиды, контакты, сделки |
| Env | dotenv, корневой `.env` | Единый конфиг для всех приложений |

**Не входит в Sprint 1 (зарезервировано):**

- ORM (Drizzle / Prisma) — после стабилизации схемы
- Очередь сообщений (Redis / BullMQ) — при росте нагрузки на Bitrix24
- Docker Compose — Sprint 2

---

## 2. Схема папок

```
enzine/
├── apps/
│   ├── bot/                        # grammY Telegram Bot
│   │   └── src/
│   │       ├── index.ts            # точка входа
│   │       ├── config.ts           # конфиг из env
│   │       ├── load-env.ts         # загрузка корневого .env
│   │       ├── handlers/           # [S1] команды и колбэки
│   │       ├── sessions/           # [S1] state machine, контекст диалога
│   │       └── adapters/
│   │           └── bitrix/         # [S1] Bitrix24 adapter
│   │
│   └── miniapp/                    # Next.js Telegram Mini App
│       └── src/
│           └── app/                # App Router: страницы и layout
│
├── packages/
│   └── shared/
│       └── src/
│           ├── types/              # User, Application, ApiResponse
│           ├── enums/              # BotCommand, UserRole, SessionState
│           └── helpers/            # formatUserName, requireEnv, EnvKeys
│
├── database/
│   ├── migrations/                 # 001_init.sql, 002_sessions.sql, …
│   └── seeds/                      # демо-данные для локальной разработки
│
├── docs/
│   ├── architecture.md
│   ├── scenarios.md
│   └── sprint-1-architecture.md    # этот документ
│
├── .env.example
├── package.json
└── README.md
```

`[S1]` — каталоги и модули, добавляемые в рамках Sprint 1 поверх текущего каркаса.

### Зависимости между пакетами

```
apps/bot        ──► @enzine/shared
apps/miniapp    ──► @enzine/shared
apps/bot        ──► PostgreSQL (через db-layer / pg)
apps/bot        ──► Bitrix24 (через adapters/bitrix)
apps/miniapp    ──► API (NEXT_PUBLIC_API_URL, Sprint 1 — заглушка или bot webhook)
```

---

## 3. Способ работы с базой

### Принципы

1. **PostgreSQL** — единственный источник правды для пользователей, сессий и заявок.
2. **SQL-миграции** — каждое изменение схемы = новый файл `database/migrations/NNN_description.sql`.
3. **Порядок применения** — лексикографический по имени файла.
4. **Сиды** — только для локальной разработки и тестовых стендов.
5. **Доступ из кода** — тонкий слой `db/` в `apps/bot` (Sprint 1: `pg` + параметризованные запросы; без ORM).

### Жизненный цикл миграции

```bash
# 1. Создать файл миграции
database/migrations/002_sessions_and_applications.sql

# 2. Применить локально
psql $DATABASE_URL -f database/migrations/002_sessions_and_applications.sql

# 3. При необходимости — сиды
psql $DATABASE_URL -f database/seeds/001_users.sql
```

### Соглашения

| Правило | Описание |
|---------|----------|
| `id` | `BIGSERIAL PRIMARY KEY` |
| Внешние ID | `telegram_id`, `bitrix_lead_id` — отдельные поля с индексом |
| Время | `TIMESTAMPTZ`, триггер `set_updated_at()` |
| Состояния | `VARCHAR` + enum в `@enzine/shared` (не PG ENUM на Sprint 1) |
| Мягкое удаление | не используем в Sprint 1 |

### Транзакции

Операции «сохранить заявку + обновить сессию + записать sync log» выполняются в одной транзакции. Вызов Bitrix24 — **после** commit (outbox-паттерн упрощённо через таблицу `bitrix_sync_queue`).

---

## 4. Список таблиц

### Sprint 1 — текущие и планируемые

#### `users` *(реализовано: `001_init.sql`)*

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGSERIAL PK | Внутренний ID |
| `telegram_id` | BIGINT UNIQUE | ID пользователя в Telegram |
| `username` | VARCHAR(255) | @username |
| `first_name` | VARCHAR(255) | Имя |
| `last_name` | VARCHAR(255) | Фамилия |
| `role` | VARCHAR(32) | `user` \| `admin` |
| `created_at` | TIMESTAMPTZ | Дата создания |
| `updated_at` | TIMESTAMPTZ | Дата обновления |

#### `sessions` *(Sprint 1)*

Контекст диалога бота (state machine).

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGSERIAL PK | |
| `user_id` | BIGINT FK → users | |
| `state` | VARCHAR(64) | Текущее состояние FSM (см. §5) |
| `context` | JSONB | Промежуточные данные диалога |
| `expires_at` | TIMESTAMPTZ | TTL сессии |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `applications` *(Sprint 1)*

Заявка пользователя (из бота или Mini App).

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGSERIAL PK | |
| `user_id` | BIGINT FK → users | |
| `source` | VARCHAR(32) | `bot` \| `miniapp` |
| `status` | VARCHAR(32) | `draft` \| `submitted` \| `synced` \| `failed` |
| `payload` | JSONB | Поля заявки (телефон, комментарий и т.д.) |
| `bitrix_lead_id` | BIGINT NULL | ID лида в Bitrix24 после синка |
| `created_at` | TIMESTAMPTZ | |
| `updated_at` | TIMESTAMPTZ | |

#### `bitrix_sync_queue` *(Sprint 1)*

Очередь исходящих запросов в Bitrix24.

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | BIGSERIAL PK | |
| `application_id` | BIGINT FK → applications | |
| `action` | VARCHAR(64) | `create_lead` \| `update_lead` |
| `payload` | JSONB | Тело запроса к Bitrix |
| `status` | VARCHAR(32) | `pending` \| `processing` \| `done` \| `failed` |
| `attempts` | INT DEFAULT 0 | Число попыток |
| `last_error` | TEXT NULL | Последняя ошибка |
| `created_at` | TIMESTAMPTZ | |
| `processed_at` | TIMESTAMPTZ NULL | |

---

## 5. State machine states

FSM управляет диалогом в боте. Состояния хранятся в `sessions.state`, данные шагов — в `sessions.context`.

### Диаграмма состояний

```mermaid
stateDiagram-v2
    [*] --> idle

    idle --> collecting_phone : /start, новая заявка
    idle --> idle : /help

    collecting_phone --> collecting_name : phone_valid
    collecting_phone --> collecting_phone : phone_invalid

    collecting_name --> confirming : name_received

    confirming --> submitted : user_confirms
    confirming --> collecting_phone : user_edits_phone
    confirming --> idle : user_cancels

    submitted --> syncing_bitrix : application_saved
    syncing_bitrix --> done : bitrix_ok
    syncing_bitrix --> sync_failed : bitrix_error

    sync_failed --> syncing_bitrix : retry
    sync_failed --> idle : user_cancels

    done --> idle : /start

    idle --> miniapp_open : open_miniapp_button
    miniapp_open --> submitted : miniapp_submit_webhook
```

### Таблица состояний

| State | Описание | Вход | Выход |
|-------|----------|------|-------|
| `idle` | Нет активной заявки | `/start`, завершение flow | `collecting_phone`, `miniapp_open` |
| `collecting_phone` | Ожидание телефона | кнопка «Оставить заявку» | `collecting_name` |
| `collecting_name` | Ожидание имени | валидный телефон | `confirming` |
| `confirming` | Подтверждение данных | имя получено | `submitted`, `collecting_phone`, `idle` |
| `miniapp_open` | Пользователь в Mini App | Web App button | `submitted` (callback от miniapp) |
| `submitted` | Заявка сохранена в БД | подтверждение / miniapp | `syncing_bitrix` |
| `syncing_bitrix` | Отправка в Bitrix24 | запись в `applications` | `done`, `sync_failed` |
| `sync_failed` | Ошибка синка | ошибка API | `syncing_bitrix`, `idle` |
| `done` | Успешное завершение | лид создан в Bitrix | `idle` |

Enum `SessionState` — в `packages/shared/src/enums/session-state.ts`.

---

## 6. Telegram flow

### 6.1. Точки входа

| Канал | Триггер | Действие |
|-------|---------|----------|
| Команда `/start` | Текст | Регистрация/обновление `users`, приветствие, меню |
| Команда `/help` | Текст | Справка |
| Inline-кнопка «Оставить заявку» | callback | FSM → `collecting_phone` |
| Inline-кнопка «Открыть Mini App» | Web App | FSM → `miniapp_open`, открытие Next.js |
| Текстовое сообщение | message | Обработка по текущему `sessions.state` |

### 6.2. Основной сценарий (бот)

```
Пользователь                    Bot (grammY)                  PostgreSQL           Bitrix24
    |                               |                              |                    |
    |  /start                       |                              |                    |
    |------------------------------>| upsert users                 |                    |
    |                               |----------------------------->|                    |
    |  Приветствие + меню           |                              |                    |
    |<------------------------------|                              |                    |
    |                               |                              |                    |
    |  [Оставить заявку]            |                              |                    |
    |------------------------------>| state=collecting_phone       |                    |
    |                               |----------------------------->|                    |
    |  +79001234567                 |                              |                    |
    |------------------------------>| validate, state=collecting_name                   |
    |  Введите имя                  |                              |                    |
    |<------------------------------|                              |                    |
    |  Иван                         |                              |                    |
    |------------------------------>| state=confirming             |                    |
    |  Подтвердите данные           |                              |                    |
    |<------------------------------|                              |                    |
    |  [Подтвердить]                |                              |                    |
    |------------------------------>| INSERT applications          |                    |
    |                               |----------------------------->|                    |
    |                               | enqueue bitrix_sync_queue    |                    |
    |                               |----------------------------->|                    |
    |                               | POST crm.lead.add            |                    |
    |                               |------------------------------------------------->|
    |  Заявка принята ✓             |                              |                    |
    |<------------------------------| state=done                   |                    |
```

### 6.3. Сценарий через Mini App

1. Бот показывает кнопку `web_app` с URL Mini App (`https://…/miniapp`).
2. Пользователь заполняет форму в Next.js.
3. Mini App отправляет данные на API (`NEXT_PUBLIC_API_URL`) с `initData` для валидации.
4. API создаёт `applications`, ставит задачу в `bitrix_sync_queue`.
5. Бот получает уведомление (опционально: `answerWebAppQuery` или push-сообщение).

### 6.4. Режимы работы бота

| Режим | Условие | Использование |
|-------|---------|---------------|
| Long polling | `BOT_WEBHOOK_URL` пуст | Локальная разработка |
| Webhook | `BOT_WEBHOOK_URL` задан | Staging / Production |

---

## 7. Bitrix24 adapter strategy

### 7.1. Паттерн Adapter

```
apps/bot/src/adapters/bitrix/
├── types.ts           # BitrixLeadPayload, BitrixResponse
├── client.ts          # HTTP-клиент к REST webhook URL
├── adapter.ts         # BitrixAdapter implements CrmAdapter
├── mock-adapter.ts    # Заглушка для локальной разработки
└── index.ts
```

### 7.2. Интерфейс

```typescript
interface CrmAdapter {
  createLead(payload: LeadPayload): Promise<{ externalId: string }>;
  updateLead(externalId: string, payload: Partial<LeadPayload>): Promise<void>;
}
```

Bot и будущий API зависят от `CrmAdapter`, а не от Bitrix напрямую.

### 7.3. Конфигурация

| Переменная | Описание |
|------------|----------|
| `BITRIX_WEBHOOK_URL` | Входящий webhook Bitrix24 (`https://…/rest/1/xxx/`) |
| `BITRIX_MOCK` | `true` — использовать `MockAdapter` без реальных запросов |

### 7.4. Стратегия синхронизации

1. **Запись сначала в БД** — `applications.status = submitted`.
2. **Очередь** — строка в `bitrix_sync_queue` со статусом `pending`.
3. **Worker** (в процессе бота или отдельный cron) забирает `pending`, вызывает `adapter.createLead`.
4. **Успех** — `applications.bitrix_lead_id`, `status = synced`, queue `done`.
5. **Ошибка** — `attempts++`, `last_error`, queue `failed`; повтор до 3 попыток с backoff.
6. **Идемпотентность** — перед `create_lead` проверять `bitrix_lead_id IS NULL`.

### 7.5. Маппинг полей

| Enzine (`applications.payload`) | Bitrix24 (`crm.lead.add`) |
|-----------------------------------|---------------------------|
| `phone` | `PHONE[0].VALUE` |
| `firstName` | `NAME` |
| `lastName` | `LAST_NAME` |
| `comment` | `COMMENTS` |
| `telegramId` | Пользовательское поле / `SOURCE_DESCRIPTION` |
| `source` | `SOURCE_ID` |

### 7.6. Локальная разработка

- `BITRIX_MOCK=true` — `MockAdapter` возвращает фиктивный `lead_id`.
- Логи запросов в stdout для отладки маппинга.
- Реальный Bitrix — только на dev-стенде с тестовым порталом.

---

## 8. Локальный запуск

### Предварительные требования

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Токен бота от [@BotFather](https://t.me/BotFather)

### Шаги

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine

npm install

cp .env.example .env
```

Заполнить `.env`:

```env
BOT_TOKEN=<токен от BotFather>
DATABASE_URL=postgresql://enzine:enzine@localhost:5432/enzine
BITRIX_MOCK=true
NEXT_PUBLIC_API_URL=http://localhost:3000
```

База данных:

```bash
createdb enzine
psql $DATABASE_URL -f database/migrations/001_init.sql
psql $DATABASE_URL -f database/seeds/001_users.sql
# после добавления миграций Sprint 1:
# psql $DATABASE_URL -f database/migrations/002_sessions_and_applications.sql
```

Запуск сервисов (два терминала):

```bash
npm run dev:bot        # long polling
npm run dev:miniapp    # http://localhost:3001
```

### Проверка

| Проверка | Команда / действие | Ожидание |
|----------|-------------------|----------|
| Зависимости | `npm install` | без ошибок |
| TypeScript | `npm run typecheck` | без ошибок |
| Bot | `/start` в Telegram | приветствие |
| Mini App | http://localhost:3001 | страница Enzine |
| Bitrix mock | отправить заявку | `bitrix_lead_id` в логах mock |

### Mini App в Telegram

Для теста внутри Telegram нужен HTTPS-туннель (ngrok, cloudflared):

```bash
ngrok http 3001
# URL из ngrok → BotFather → Mini App URL
```

---

## 9. Риски

| # | Риск | Вероятность | Влияние | Митигация |
|---|------|-------------|---------|-----------|
| 1 | Лимиты Bitrix24 REST API (2 req/s на webhook) | Высокая | Среднее | Очередь `bitrix_sync_queue`, backoff, batch в Sprint 2 |
| 2 | Потеря состояния FSM при рестарте бота | Средняя | Высокое | Хранение сессий в PostgreSQL, не in-memory |
| 3 | Невалидный `initData` в Mini App | Средняя | Высокое | Серверная валидация HMAC-SHA256 с `BOT_TOKEN` |
| 4 | Рассинхрон Enzine ↔ Bitrix (дубли лидов) | Средняя | Высокое | Идемпотентность, `bitrix_lead_id`, проверка перед create |
| 5 | Отсутствие HTTPS для Mini App локально | Высокая | Низкое | ngrok / dev-стенд; браузер для UI-разработки |
| 6 | Рост схемы БД без ORM | Средняя | Среднее | Строгие миграции, типы в shared, code review SQL |
| 7 | Webhook vs long polling — разное поведение | Низкая | Среднее | Тестировать оба режима на staging |
| 8 | Истечение Bitrix webhook URL | Низкая | Высокое | Документировать ротацию, мониторинг 401/403 |
| 9 | Telegram блокирует бота (спам) | Низкая | Высокое | Rate limiting, осмысленные ответы, без массовых рассылок в S1 |
| 10 | Один `.env` — утечка секретов | Средняя | Высокое | `.gitignore`, отдельные секреты на prod, не коммитить `.env` |

---

## Связанные документы

- [architecture.md](architecture.md) — общая архитектура monorepo
- [scenarios.md](scenarios.md) — пошаговые сценарии
- [getting-started.md](getting-started.md) — быстрый старт
- [database/README.md](../database/README.md) — миграции и сиды
