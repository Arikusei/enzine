# Архитектура Enzine

## Обзор

Enzine — monorepo на pnpm workspaces. Три основных приложения и общий пакет типов:

```
┌─────────────┐     ┌─────────────┐
│  apps/bot   │     │ apps/miniapp│
│  (grammY)   │     │ (Vite+React)│
└──────┬──────┘     └──────┬──────┘
       │                   │
       └────────┬──────────┘
                ▼
       ┌─────────────────┐
       │ packages/shared │
       │  (типы, utils)  │
       └────────┬────────┘
                ▼
       ┌─────────────────┐
       │    database     │
       │  (PostgreSQL)   │
       └─────────────────┘
```

## Компоненты

### apps/bot

Telegram Bot на [grammY](https://grammy.dev/). Поддерживает:
- long polling (по умолчанию)
- webhook (при задании `BOT_WEBHOOK_URL`)

### apps/miniapp

Telegram Mini App на Vite + React. Использует Telegram Web App API для получения данных пользователя.

### packages/shared

Общие TypeScript-типы (`User`, `ApiResponse` и др.), используемые ботом и mini app.

### database

SQL-схема PostgreSQL. Единая точка правды для структуры данных.

## Следующие шаги

- API-слой между bot/miniapp и БД
- Аутентификация через `initData` в Mini App
- CI/CD (GitHub Actions)
- Docker Compose для локальной разработки
