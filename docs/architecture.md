# Архитектура Enzine

## Обзор

Monorepo на **npm workspaces**. Три приложения и общий пакет:

```
┌─────────────┐     ┌──────────────────┐
│  apps/bot   │     │  apps/miniapp    │
│  (grammY)   │     │  (Next.js)       │
└──────┬──────┘     └────────┬─────────┘
       │                     │
       └──────────┬──────────┘
                  ▼
         ┌─────────────────┐
         │ packages/shared │
         │ types · enums   │
         │ helpers · env   │
         └────────┬────────┘
                  ▼
         ┌─────────────────┐
         │    database     │
         │ migrations/seeds│
         └─────────────────┘
```

## Компоненты

### apps/bot

Telegram Bot на [grammY](https://grammy.dev/):
- Node.js + TypeScript
- long polling (по умолчанию) или webhook
- читает `.env` из корня репозитория

### apps/miniapp

Telegram Mini App на [Next.js](https://nextjs.org/):
- App Router, React 19
- Telegram Web App API
- `transpilePackages: ["@enzine/shared"]`

### packages/shared

Единый источник для:
- **типов** — `User`, `ApiResponse`
- **enums** — `BotCommand`, `UserRole`
- **helpers** — `formatUserName`, `requireEnv`, `EnvKeys`

### database

SQL-миграции и сиды. Порядок применения — по имени файла.

## Env

Один `.env` в корне. Ключи описаны в `.env.example`. Общие константы имён — `EnvKeys` в `@enzine/shared`.

## Следующие шаги

- API-слой между приложениями и БД
- Валидация `initData` в Mini App
- CI/CD (GitHub Actions)
- Docker Compose
