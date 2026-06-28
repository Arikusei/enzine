# Bot 24/7 без домашнего ПК

Бот в облаке работает в **webhook-режиме**: Telegram шлёт updates на HTTPS URL, сервер всегда слушает порт.

Локально (разработка) — **long polling** (`BOT_WEBHOOK_URL` пустой).

---

## Рекомендуемый вариант: Fly.io (бесплатный tier)

Нужны: аккаунт [fly.io](https://fly.io), карта (для верификации, списаний нет на free tier в рамках лимита).

### 1. Установить flyctl

Windows (PowerShell):

```powershell
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"
```

### 2. Логин и создание приложения

```bash
cd enzine
fly auth login
fly apps create enzine-bot-ВАШ_НИК
```

Отредактируйте `fly.toml` — поле `app` = имя из предыдущей команды.

### 3. Секреты

Сгенерируйте секрет webhook (любая длинная строка):

```bash
fly secrets set BOT_TOKEN=7123456789:AAHxxxxxxxx BOT_WEBHOOK_SECRET=случайная_строка_32_символа
```

### 4. URL webhook

После первого деплоя URL будет `https://ИМЯ_ПРИЛОЖЕНИЯ.fly.dev`.

```bash
fly secrets set BOT_WEBHOOK_URL=https://enzine-bot-ВАШ_НИК.fly.dev/webhook
```

### 5. Деплой

```bash
fly deploy
```

### 6. Проверка

```bash
fly logs
curl https://enzine-bot-ВАШ_НИК.fly.dev/health
```

В Telegram → `/start` — бот должен ответить.

---

## Переменные окружения (production)

| Переменная | Пример | Обязательна |
|------------|--------|-------------|
| `BOT_TOKEN` | от BotFather | да |
| `BOT_WEBHOOK_URL` | `https://app.fly.dev/webhook` | да (облако) |
| `BOT_WEBHOOK_SECRET` | случайная строка | рекомендуется |
| `BOT_WEBHOOK_PATH` | `/webhook` | нет (default) |
| `PORT` | `3000` | Fly выставляет сам |

---

## Локальная разработка (ПК)

`.env` в корне репозитория:

```env
BOT_TOKEN=...
BOT_WEBHOOK_URL=
BOT_WEBHOOK_SECRET=
```

```bash
npm run dev:bot
```

→ `Bot started (long polling)`

---

## Альтернатива: Oracle Cloud Always Free (VPS)

Подходит и для long polling без webhook.

1. [cloud.oracle.com](https://cloud.oracle.com) → Create VM (Always Free, Ubuntu).
2. SSH на сервер:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git
git clone https://github.com/Arikusei/enzine.git
cd enzine
npm install
nano .env   # только BOT_TOKEN, без WEBHOOK_URL
npm run build -w @enzine/shared
npm run build -w @enzine/bot
sudo npm install -g pm2
pm2 start npm --name enzine-bot -- run start -w @enzine/bot
pm2 save
pm2 startup
```

Бесплатно 24/7, но настройка сложнее Fly.io.

---

## Что НЕ подходит для бота 24/7

| Платформа | Почему |
|-----------|--------|
| Vercel | serverless, нет постоянного процесса / long polling |
| Render Free | засыпает через 15 мин |
| Домашний ПК выключен | бот offline |

Mini App — на **Vercel**. Bot — на **Fly.io** или **Oracle VM**.

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Бот не отвечает после деплоя | `fly logs`, проверить `BOT_WEBHOOK_URL` и `/health` |
| 401 / webhook error | неверный `BOT_TOKEN` |
| Два инстанса polling | в production задайте `BOT_WEBHOOK_URL`, локально webhook URL уберите |
| `BOT_TOKEN is required` | секрет не задан: `fly secrets set BOT_TOKEN=...` |

---

## Архитектура

```
Telegram ──HTTPS POST──► Fly.io (webhook /webhook)
                              │
                              └── grammY bot handlers

Telegram ◄── Mini App ──► Vercel (Next.js)
```
