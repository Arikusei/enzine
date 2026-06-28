# Bot 24/7 без домашнего ПК

## Fly.io требует карту

Если видите:

```text
We need your payment information to continue!
```

Fly.io **не даст деплоить без привязки карты** (даже на free tier). Это не ошибка вашего проекта.

**Без карты используйте Oracle Cloud (ниже)** или временно запускайте бота на ПК.

---

## Что работает БЕЗ бота 24/7

| Функция | Нужен ли bot process |
|---------|---------------------|
| Mini App на Vercel | **Нет** — открывается по URL |
| Menu Button в Telegram | **Нет** — настраивается в BotFather |
| Команда `/start`, ответы бота | **Да** |

Mini App уже на Vercel → в BotFather задайте Menu Button на ваш Vercel URL — приложение откроется даже если бот не запущен.

---

## Рекомендуется: Oracle Cloud Always Free (VPS, $0)

Always Free ARM VM — бесплатно **навсегда** (лимиты Oracle). Карта может понадобиться **только для верификации** аккаунта (как у AWS/GCP), списания при соблюдении free tier обычно нет.

### 1. Создать VM

1. [cloud.oracle.com](https://cloud.oracle.com) → регистрация
2. **Create VM instance**
3. **Always Free eligible** — shape `VM.Standard.A1.Flex` (ARM), 1 OCPU, 6 GB RAM
4. Image: **Ubuntu 22.04**
5. Download SSH key / задайте пароль
6. **Networking** — публичный IP

### 2. Подключиться по SSH

Windows (PowerShell):

```powershell
ssh ubuntu@ВАШ_ПУБЛИЧНЫЙ_IP
```

### 3. Установить бота (long polling)

На сервере:

```bash
git clone https://github.com/Arikusei/enzine.git
cd enzine
cp .env.example .env
nano .env
```

В `.env` **только**:

```env
BOT_TOKEN=ваш_токен_от_BotFather
BOT_WEBHOOK_URL=
BOT_WEBHOOK_SECRET=
```

Webhook **не нужен** на VPS — работает long polling.

```bash
bash scripts/setup-bot-vps.sh
```

Или вручную:

```bash
npm install
npm run build -w @enzine/shared
npm run build -w @enzine/bot
sudo npm install -g pm2
pm2 start npm --name enzine-bot -- run start -w @enzine/bot
pm2 save
pm2 startup
```

### 4. Проверка

```bash
pm2 logs enzine-bot
pm2 status
```

Telegram → `/start` — бот отвечает. ПК можно выключить.

---

## Вариант с картой: Fly.io (webhook)

Если карта есть — webhook на Fly.io (см. `fly.toml`, `Dockerfile.bot`):

```bash
fly auth login
fly apps create enzine-bot-ВАШ_НИК
fly secrets set BOT_TOKEN=... BOT_WEBHOOK_SECRET=...
fly deploy
fly secrets set BOT_WEBHOOK_URL=https://ВАШ_APP.fly.dev/webhook
fly deploy
```

---

## Локально (ПК включён)

`.env`:

```env
BOT_TOKEN=...
BOT_WEBHOOK_URL=
```

```bash
npm run dev:bot
```

---

## Переменные окружения

| Переменная | Oracle (polling) | Fly (webhook) |
|------------|------------------|---------------|
| `BOT_TOKEN` | да | да |
| `BOT_WEBHOOK_URL` | **пусто** | `https://.../webhook` |
| `BOT_WEBHOOK_SECRET` | пусто | рекомендуется |

---

## Что НЕ подходит

| Платформа | Почему |
|-----------|--------|
| **Fly.io без карты** | блокировка billing |
| **Vercel** | serverless, не для long polling |
| **Render Free** | засыпает через ~15 мин |
| **ПК выключен** | polling останавливается |

---

## Архитектура (бесплатный стек)

```
Telegram Mini App  ──►  Vercel (уже есть)
Telegram /start    ──►  Oracle VM + pm2 + long polling
```

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| Fly.io payment required | используйте Oracle или ПК |
| `BOT_TOKEN is required` | `.env` в **корне** repo на сервере |
| Бот падал после reboot | `pm2 startup` + `pm2 save` |
| Oracle не даёт A1 shape | попробуйте другой регион (Frankfurt, Amsterdam) |
