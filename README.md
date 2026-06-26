# Enzine

Технический каркас для разработки Telegram Bot, Mini App, общих типов и базы данных.

## Структура

```
enzine/
├── apps/
│   ├── bot/          # Telegram Bot (grammY)
│   └── miniapp/      # Telegram Mini App (Vite + React)
├── packages/
│   └── shared/       # Общие типы и утилиты
├── database/         # SQL-схема и миграции
└── docs/             # Документация
```

## Требования

- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (опционально, для локальной БД)

## Быстрый старт

```bash
# Установка зависимостей
pnpm install

# Копирование переменных окружения
cp .env.example .env

# Запуск бота (long polling)
pnpm dev:bot

# Запуск Mini App
pnpm dev:miniapp
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `pnpm dev:bot` | Запуск Telegram Bot в режиме разработки |
| `pnpm dev:miniapp` | Запуск Mini App dev-сервера |
| `pnpm build` | Сборка всех пакетов |
| `pnpm typecheck` | Проверка типов |

## Документация

- [Архитектура](docs/architecture.md)
- [Быстрый старт](docs/getting-started.md)
- [База данных](database/README.md)

## Лицензия

MIT
