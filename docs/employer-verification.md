# Инструкция для работодателя: проверка задач Enzine

Документ описывает, как локально или по репозиторию проверить каждый выполненный task.

**Репозиторий:** https://github.com/Arikusei/enzine

---

## Подготовка (один раз)

### Требования

| Инструмент | Версия |
|------------|--------|
| Node.js | 20+ |
| npm | 10+ |
| Git | любая актуальная |
| PostgreSQL | 15+ (для task по БД) |
| psql | в PATH (для миграций/сидов) |

### Клонирование и установка

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine
npm install
```

**Windows:** `copy .env.example .env`  
**Linux/macOS:** `cp .env.example .env`

Для проверки бота в `.env` (файл в **корне** репозитория):

```env
BOT_TOKEN=<токен от @BotFather>
BOT_WEBHOOK_URL=
BOT_WEBHOOK_SECRET=
NEXT_PUBLIC_BOT_USERNAME=<username бота без @>
```

`BOT_WEBHOOK_URL` оставить **пустым** для локального long polling.

Для проверки БД:

```env
DATABASE_URL=postgresql://enzine:enzine@localhost:5432/enzine
```

### Быстрая smoke-проверка всего проекта

```bash
npm run typecheck    # TypeScript без ошибок
npm run build        # сборка shared + приложений
npm run dev:miniapp  # → http://localhost:3001
npm run dev:bot      # long polling (нужен BOT_TOKEN в .env)
```

**Mini App без установки:** если у кандидата задеплоен Vercel — открыть production URL (секции UI, Header, HeroSlider).

**Bot:** второй терминал, в Telegram `/start` и `/help`.

---

## Экспресс-приёмка для работодателя (~10 мин, без PostgreSQL)

1. Открыть https://github.com/Arikusei/enzine
2. `git clone` → `npm install` → `npm run typecheck`
3. `npm run dev:miniapp` → http://localhost:3001 — scroll, Header, HeroSlider, секции
4. DevTools → Console: клик 🔔 (modal), CTA баннера (log)
5. `.env` + `npm run dev:bot` → `/start` в Telegram
6. Документы: `docs/sprint-1-architecture.md`, `docs/employer-verification.md`
7. *(Опционально)* PostgreSQL: `npm run db:seed:verify`

---

## Task 01 — Технический каркас monorepo

**Цель:** репозиторий со структурой bot / miniapp / shared / database / docs.

### Что проверить

1. **Структура папок** в корне репозитория:

   ```
   apps/bot/
   apps/miniapp/
   packages/shared/
   database/
   docs/
   .env.example
   README.md
   ```

2. **npm workspaces** — в `package.json` есть `"workspaces": ["apps/*", "packages/*"]`.

3. **GitHub** — репозиторий публичный, ветка `main`, есть история коммитов.

### Критерии приёмки

| Проверка | Ожидание |
|----------|----------|
| `npm install` | завершается без ошибок |
| `npm run dev:bot` | процесс бота стартует |
| `npm run dev:miniapp` | Next.js на порту 3001 |
| `npm run typecheck` | exit code 0 |
| `.env.example` | единый формат env в корне |

### Команды

```bash
npm install
npm run typecheck
npm run dev:miniapp
npm run dev:bot
```

---

## Task 02 — Sprint 1 Architecture (документ)

**Цель:** архитектурное описание стека, БД, FSM, Bitrix24.

### Что проверить

Открыть файл:

```
docs/sprint-1-architecture.md
```

В документе должны быть разделы:

- Выбранный стек
- Схема папок
- Способ работы с базой
- Список таблиц
- State machine states
- Telegram flow
- Bitrix24 adapter strategy
- Локальный запуск
- Риски

### Критерии приёмки

| Проверка | Ожидание |
|----------|----------|
| Файл существует | `docs/sprint-1-architecture.md` |
| Mermaid-диаграмма FSM | есть блок `stateDiagram-v2` |
| Таблицы Sprint 1 | users, sessions, applications, bitrix_sync_queue (в документе) |
| Ссылка из README/docs | документ доступен в репозитории |

---

## Task 03 — Сезонная модель БД (миграции)

**Цель:** PostgreSQL-схема seasons / phases / nodes / user_states / crm_outbox и др.

### Что проверить

Файл миграции:

```
database/migrations/002_seasonal_model.sql
```

Таблицы (10 шт.):

- `users`, `identities`, `seasons`, `phases`, `nodes`
- `user_states`, `events`, `registrations`, `action_logs`, `crm_outbox`

### Команды

```bash
createdb enzine   # если БД ещё нет

psql $DATABASE_URL -f database/migrations/001_init.sql
psql $DATABASE_URL -f database/migrations/002_seasonal_model.sql

psql $DATABASE_URL -c "\dt"
```

### Критерии приёмки

| Проверка | Команда | Ожидание |
|----------|---------|----------|
| Миграции применяются | команды выше | без SQL-ошибок |
| 10 таблиц | `\dt` | все таблицы на месте |
| Unique identities | `\d identities` | `UNIQUE (provider, provider_user_id)` |
| Unique user_states | `\d user_states` | `UNIQUE (user_id, season_id)` |
| Unique qr_token | `\d registrations` | `qr_token` UNIQUE |
| FK-связи | `\d phases`, `\d nodes` | внешние ключи на seasons/phases |

---

## Task 04 — Seed тестового сезона

**Цель:** идемпотентный seed `test-season` для локальной разработки.

### Что проверить

Файлы:

```
database/seeds/004_test_season.sql
database/seeds/004_test_season_verify.sql
```

### Команды

```bash
npm run db:seed
npm run db:seed:verify
```

или:

```bash
psql $DATABASE_URL -f database/seeds/004_test_season.sql
psql $DATABASE_URL -f database/seeds/004_test_season_verify.sql
```

### Критерии приёмки

| Сущность | Ожидаемое значение |
|----------|-------------------|
| Season slug | `test-season` |
| Phases | `welcome`, `main`, `finish` |
| Telegram identities | provider `telegram`, ids `999001`, `999002` |
| Events | «Тестовый воркшоп», «Тестовый митап» |
| crm_outbox | `bitrix24.lead.create`, status `pending` |
| Повторный seed | без ошибок (идемпотентность) |

Скрипт `004_test_season_verify.sql` выводит строки по seasons, phases, nodes, user_states, events, registrations, crm_outbox.

---

## Task 05 — Shared types (синхронизация bot / miniapp)

**Цель:** общие enums и типы в `@enzine/shared`.

### Что проверить

Пакет:

```
packages/shared/src/enums/
```

Enum-ы:

- `SeasonStatus`, `PhaseStatus`, `NodeType`
- `UserState`, `ActionType`, `CrmEventType`, `ProviderType`

Импорты в коде:

```bash
# bot
grep -r "@enzine/shared" apps/bot/src

# miniapp
grep -r "@enzine/shared" apps/miniapp/src
```

### Критерии приёмки

| Проверка | Ожидание |
|----------|----------|
| `npm run typecheck` | без ошибок |
| Bot импортирует shared | `apps/bot/src/index.ts`, `services/session.ts` |
| Mini App импортирует shared | `apps/miniapp/src/app/page.tsx` |
| Статусы в одном месте | `packages/shared/src/enums/` |
| Нет разрозненных строк | UserState/ActionType через enum, не `"idle"` в TS-коде приложений |

Пример UserState:

```
NEW_USER, SEASON_OPENED, PHASE_1_AVAILABLE, … ARCHIVED
```

---

## Task 06 — Главный экран Mini App (layout)

**Цель:** scroll-layout с секциями на главной странице.

### Что проверить

Страница:

```
apps/miniapp/src/app/page.tsx
```

Компоненты:

```
apps/miniapp/src/components/shell/MiniAppShell.tsx
apps/miniapp/src/components/sections/
  Header.tsx, HeroSlider.tsx, SeasonStats.tsx,
  RewardsSection.tsx, TasksSection.tsx,
  ZineSection.tsx, IrlSection.tsx
```

Mock-данные:

```
apps/miniapp/src/data/mock/home.ts
apps/miniapp/src/types/home.ts
```

### Команды

```bash
npm run dev:miniapp
```

Открыть http://localhost:3001

### Критерии приёмки

| Проверка | Ожидание |
|----------|----------|
| Страница открывается | HTTP 200, без crash |
| Все секции на одном scroll | вертикальный скролл, 7 блоков |
| Секции — отдельные компоненты | папка `components/sections/` |
| Данные из mock | `getHomePageData()` в `data/mock/home.ts` |
| Mobile-first | max-width ~430px, карточки |
| Готовность к API | типы `HomePageData`, функция `getHomePageData()` |

---

## Task 07 — Header (верхняя панель)

**Цель:** sticky header с аватаром, брендом, уведомлениями, профилем.

### Что проверить

```
apps/miniapp/src/components/sections/Header.tsx
apps/miniapp/src/components/ui/NotificationsModal.tsx
apps/miniapp/public/mock/avatar.svg
```

### Команды

```bash
npm run dev:miniapp
```

Открыть DevTools → Console.

### Критерии приёмки

| Элемент | Где смотреть |
|---------|--------------|
| Аватар | слева, mock `/mock/avatar.svg` |
| Enzine / город | «Enzine / Томск» по центру-слева |
| Иконки Enzine + Telegram | SVG слева от текста |
| Уведомления | колокольчик справа, badge с числом |
| Профиль | иконка справа |
| Sticky | header остаётся сверху при скролле |
| Клик 🔔 | modal «Уведомления» + `console.log` |
| Клик профиль | `console.log('[Header] profile/settings stub')` |
| Малый экран | элементы не ломают layout (375px) |

Mock user:

```json
{ "name": "Илья", "avatarUrl": "/mock/avatar.svg", "city": "Томск" }
```

---

## Task 08 — HeroSlider (крупный баннер)

**Цель:** главный слайдер сезона с CTA и пагинацией.

### Что проверить

```
apps/miniapp/src/components/sections/HeroSlider.tsx
apps/miniapp/src/types/home.ts   → HeroSlide
apps/miniapp/src/data/mock/home.ts → heroSlides (5 шт.)
```

### Команды

```bash
npm run dev:miniapp
```

DevTools → Console.

### Критерии приёмки

| Проверка | Ожидание |
|----------|----------|
| ≥ 2 слайда | 5 в mock |
| Первый слайд сразу | «Фаза открыта» / label «Сейчас» |
| CTA-кнопка | «Продолжить», «Открыть» и т.д. |
| Пагинация | точки под баннером |
| Клик CTA | `console.log('[HeroSlider] CTA', …)` |
| Свайп | touch left/right переключает слайд |
| Клик по краям | prev/next зоны баннера |
| Тип данных | `HeroSlide` с `backgroundType`, `targetType`, `label`, `ctaText` |
| Контент Enzine | phase / drop / irl / zine / urgent access |

Пример первого слайда:

```
title: "Фаза открыта"
label: "Сейчас"
ctaText: "Продолжить"
targetType: "phase"
```

---

## Сводная таблица task → файлы

| Task | Ключевые файлы | Команда проверки |
|------|----------------|------------------|
| 01 Каркас | `package.json`, `apps/`, `packages/` | `npm install && npm run typecheck` |
| 02 Архитектура | `docs/sprint-1-architecture.md` | открыть файл |
| 03 Миграции | `database/migrations/002_*.sql` | `psql … -f migrations/002…` |
| 04 Seed | `database/seeds/004_test_season.sql` | `npm run db:seed:verify` |
| 05 Shared | `packages/shared/src/enums/` | `npm run typecheck` |
| 06 Layout | `apps/miniapp/src/app/page.tsx` | `npm run dev:miniapp` |
| 07 Header | `components/sections/Header.tsx` | браузер + console |
| 08 HeroSlider | `components/sections/HeroSlider.tsx` | браузер + swipe/CTA |

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| `BOT_TOKEN is required` | `.env` в **корне** repo; Windows: `copy .env.example .env` |
| `cp` не найден (Windows) | `copy .env.example .env` |
| `psql: command not found` | установить PostgreSQL client |
| Порт 3001 занят | остановить другой процесс или сменить порт в `apps/miniapp/package.json` |
| Mini App пустой экран | проверить console в DevTools, перезапустить `npm run dev:miniapp` |
| `@enzine/shared` not found | выполнить `npm install` (postinstall собирает shared) |

---

## Чек-лист для быстрой приёмки (5 минут)

- [ ] `git clone` + `npm install` — OK
- [ ] `npm run typecheck` — OK
- [ ] `npm run dev:miniapp` → все секции видны
- [ ] Header sticky, modal уведомлений открывается
- [ ] HeroSlider: CTA, dots, свайп
- [ ] `docs/sprint-1-architecture.md` — на месте
- [ ] `npm run db:seed:verify` — данные test-season (если есть PostgreSQL)

---

## Контакты и ссылки

- **Repo:** https://github.com/Arikusei/enzine
- **Документация:** `README.md`, `docs/`, `database/README.md`
