# Сценарии

## 1. Локальная разработка бота

1. Скопировать `.env.example` → `.env`
2. Задать `BOT_TOKEN`
3. `npm run dev:bot`
4. Открыть бота в Telegram, отправить `/start`

**Ожидание:** бот отвечает приветствием с именем пользователя.

## 2. Локальная разработка Mini App

1. `npm run dev:miniapp`
2. Открыть http://localhost:3001 в браузере (без Telegram — базовый UI)
3. Для теста в Telegram: настроить Mini App URL в BotFather (нужен HTTPS, например ngrok)

**Ожидание:** страница «Enzine», в Telegram — приветствие с `initData`.

## 3. Общие типы между bot и miniapp

1. Добавить тип/enum/helper в `packages/shared`
2. `npm run build -w @enzine/shared` (или `npm install` — shared собирается в postinstall)
3. Импортировать из `@enzine/shared` в bot и miniapp

**Ожидание:** TypeScript без дублирования типов.

## 4. Миграции и сиды

```bash
psql $DATABASE_URL -f database/migrations/001_init.sql
psql $DATABASE_URL -f database/seeds/001_users.sql
```

**Ожидание:** таблица `users` и демо-записи.

## 5. Webhook-режим бота

1. Задать `BOT_WEBHOOK_URL` и `BOT_WEBHOOK_SECRET` в `.env`
2. Запустить HTTP-сервер для webhook (расширение каркаса)
3. `npm run dev:bot`

**Ожидание:** бот регистрирует webhook вместо long polling.
