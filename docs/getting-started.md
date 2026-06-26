# Быстрый старт

## 1. Установка

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine
npm install
```

## 2. Окружение

```bash
cp .env.example .env
```

| Переменная | Обязательна для bot | Описание |
|------------|---------------------|----------|
| `BOT_TOKEN` | да | Токен от [@BotFather](https://t.me/BotFather) |
| `NEXT_PUBLIC_API_URL` | нет | URL API для Mini App |
| `DATABASE_URL` | нет | PostgreSQL connection string |

## 3. Запуск

```bash
# Bot (требует BOT_TOKEN)
npm run dev:bot

# Mini App → http://localhost:3001
npm run dev:miniapp
```

## 4. TypeScript

```bash
npm run typecheck
```

## Ссылки

- [Архитектура](architecture.md)
- [Сценарии](scenarios.md)
