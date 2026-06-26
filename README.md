# Enzine

Технический каркас для разработки Telegram Bot, Mini App, общих типов и базы данных.

## Структура

```
enzine/
├── apps/
│   ├── bot/          # grammY Telegram Bot (Node.js + TypeScript)
│   └── miniapp/      # Telegram Mini App (Next.js)
├── packages/
│   └── shared/       # Общие типы, enums, helpers
├── database/
│   ├── migrations/   # SQL-миграции
│   └── seeds/        # Начальные данные
└── docs/             # Архитектурные заметки и сценарии
```

## Требования

- Node.js 20+
- npm 10+
- PostgreSQL 15+ (опционально)

## Быстрый старт

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine

npm install

cp .env.example .env
# Заполните BOT_TOKEN от @BotFather

npm run dev:bot       # Telegram Bot (long polling)
npm run dev:miniapp   # Mini App на http://localhost:3001
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm install` | Установка зависимостей и сборка `@enzine/shared` |
| `npm run dev:bot` | Запуск bot process |
| `npm run dev:miniapp` | Запуск Next.js Mini App |
| `npm run build` | Сборка всех пакетов |
| `npm run typecheck` | Проверка TypeScript |

## Переменные окружения

Единый файл `.env` в корне репозитория. Шаблон — `.env.example`.

Bot и Mini App читают переменные из корневого `.env`.

## Документация

- [Архитектура](docs/architecture.md)
- [Сценарии](docs/scenarios.md)
- [Быстрый старт](docs/getting-started.md)
- [База данных](database/README.md)

## Лицензия

MIT
