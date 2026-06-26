# Быстрый старт

## 1. Клонирование и установка

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine
pnpm install
```

## 2. Настройка окружения

```bash
cp .env.example .env
```

Заполните `BOT_TOKEN` — токен от [@BotFather](https://t.me/BotFather).

## 3. Запуск бота

```bash
pnpm dev:bot
```

Откройте бота в Telegram и отправьте `/start`.

## 4. Запуск Mini App

```bash
pnpm dev:miniapp
```

Для тестирования в Telegram настройте Mini App URL в BotFather (требуется HTTPS; для локальной разработки используйте ngrok или аналог).

## 5. База данных (опционально)

```bash
# Создайте БД и примените схему
createdb enzine
psql $DATABASE_URL -f database/schema.sql
```

## Полезные ссылки

- [grammY документация](https://grammy.dev/)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)
- [Архитектура](architecture.md)
