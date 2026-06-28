# Oracle Cloud — bot Enzine 24/7 с нуля

Пошаговая инструкция: от регистрации до работающего `/start` в Telegram.

**Стек:** Ubuntu VM (Always Free) + Node.js + pm2 + long polling (без webhook, без карты Fly.io).

**Время:** ~30–60 мин (регистрация Oracle может занять дольше).

---

## Шаг 0. Что должно быть готово заранее

- [ ] Telegram-бот создан в [@BotFather](https://t.me/BotFather) (`/newbot`)
- [ ] **BOT_TOKEN** сохранён в блокнот
- [ ] Username бота (например `enzine_pilot_bot`)
- [ ] Mini App на Vercel (опционально, для Menu Button)
- [ ] GitHub репо: https://github.com/Arikusei/enzine

---

## Шаг 1. Регистрация Oracle Cloud

1. Откройте https://www.oracle.com/cloud/free/
2. Нажмите **Start for free**
3. Заполните страну, email, имя
4. Подтвердите email
5. **Verify mobile number** — SMS
6. **Payment verification** — карта для верификации (Always Free не списывает при использовании только free-ресурсов)
7. Выберите **Home Region** — **важно:** VM Always Free нельзя перенести в другой регион позже  
   Рекомендуемые регионы с х хорошей доступностью ARM: **Germany Central (Frankfurt)**, **Netherlands Northwest (Amsterdam)**, **UK South (London)**

Дождитесь активации аккаунта (иногда до нескольких часов).

---

## Шаг 2. Создать виртуальную машину (VM)

1. Войдите в https://cloud.oracle.com
2. Меню ☰ → **Compute** → **Instances**
3. **Create instance**

### 2.1. Имя

- Name: `enzine-bot`

### 2.2. Placement

- Availability domain — любой
- **Fault domain** — по умолчанию

### 2.3. Image and shape

1. **Change image** → **Ubuntu 22.04** (Canonical Ubuntu)
2. **Change shape** → **Ampere** → **VM.Standard.A1.Flex**
   - OCPUs: **1**
   - Memory (GB): **6**
3. Если A1 недоступен в регионе — см. [Troubleshooting §A](#a-out-of-capacity--нет-arm-shape)

### 2.4. Networking

- Primary VNIC — Create new virtual cloud network (по умолчанию OK)
- **Assign a public IPv4 address** — **✓ включено**

### 2.5. SSH keys (важно)

**Вариант A — проще (Windows 10/11):**

1. На ПК откройте PowerShell:
   ```powershell
   ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\oracle_enzine -N '""'
   type $env:USERPROFILE\.ssh\oracle_enzine.pub
   ```
2. Скопируйте **всю строку** `ssh-ed25519 AAAA...`
3. В Oracle выберите **Paste public key** → вставьте

**Вариант B:** Generate a key pair for me — скачайте **private** key (`.key`), храните в безопасном месте.

### 2.6. Boot volume

- Оставить по умолчанию (50 GB free)

### 2.7. Create

Нажмите **Create**. Статус **Running** (зелёный) — через 1–3 мин.

### 2.8. Записать Public IP

На странице instance → **Public IP address** (например `123.45.67.89`).

---

## Шаг 3. Открыть порт SSH (если не подключается)

1. Instance → под Primary VNIC → **Subnet name** (ссылка)
2. **Default Security List** → **Add Ingress Rules**
3. Если SSH не работает, добавьте:
   - Source CIDR: `0.0.0.0/0`
   - IP Protocol: TCP
   - Destination Port: **22**
   - Description: SSH

> Bot использует **long polling** — входящие порты 3000 **не нужны** (Telegram сам исходящий).

---

## Шаг 4. Подключиться по SSH с Windows

PowerShell:

```powershell
ssh -i $env:USERPROFILE\.ssh\oracle_enzine ubuntu@ВАШ_PUBLIC_IP
```

Если использовали `.key` от Oracle:

```powershell
ssh -i C:\path\to\downloaded.key ubuntu@ВАШ_PUBLIC_IP
```

При первом подключении: `yes` → Enter.

Успех: приглашение `ubuntu@enzine-bot:~$`

---

## Шаг 5. Подготовка сервера (один блок команд)

На сервере выполните по очереди:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl
```

Установка Node.js 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # v20.x
npm -v
```

---

## Шаг 6. Скачать Enzine и настроить .env

```bash
cd ~
git clone https://github.com/Arikusei/enzine.git
cd enzine
cp .env.example .env
nano .env
```

В редакторе nano (`Ctrl+O` сохранить, `Ctrl+X` выйти):

```env
BOT_TOKEN=7123456789:AAHxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
BOT_WEBHOOK_URL=
BOT_WEBHOOK_SECRET=
NEXT_PUBLIC_BOT_USERNAME=ваш_bot_username
```

**Важно:**
- `BOT_WEBHOOK_URL` — **пустой** (long polling)
- Токен без кавычек и пробелов

---

## Шаг 7. Сборка и запуск через pm2

Автоматический скрипт:

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
```

Автозапуск после перезагрузки VM:

```bash
pm2 startup
```

Скопируйте команду, которую выведет pm2 (начинается с `sudo env PATH=...`), **вставьте и выполните**.

```bash
pm2 save
```

---

## Шаг 8. Проверка

### На сервере

```bash
pm2 status
pm2 logs enzine-bot --lines 30
```

Ожидается:

```text
Bot started (long polling)
```

### В Telegram

1. Найдите бота по @username
2. Отправьте `/start`
3. Должен прийти ответ с приветствием

### Выключите ПК

Bot на Oracle — должен продолжать отвечать.

---

## Шаг 9. Menu Button → Mini App (Vercel)

На ПК, не на сервере — в Telegram [@BotFather](https://t.me/BotFather):

1. `/mybots` → ваш бот
2. **Bot Settings** → **Menu Button** → **Configure**
3. URL: `https://ваш-проект.vercel.app`

Mini App живёт на Vercel, bot на Oracle — это нормально.

---

## Обновление бота после изменений в GitHub

На сервере:

```bash
cd ~/enzine
git pull
npm install
npm run build -w @enzine/shared
npm run build -w @enzine/bot
pm2 restart enzine-bot
pm2 logs enzine-bot
```

---

## Troubleshooting

### A. Out of capacity / нет ARM shape

Oracle часто пишет «Out of host capacity» для A1.

1. **Create instance** в другом Availability domain (тот же регион)
2. Попробуйте другой **Home Region** (новый аккаунт — только при регистрации)
3. Пробуйте в непиковые часы (ночь по EU)
4. Альтернатива shape: **VM.Standard.E2.1.Micro** (AMD, 1 GB) — хватит для бота, но медленнее

### B. SSH: Connection timed out

- Проверьте Public IP
- Security List → port 22 открыт
- Instance в статусе **Running**

### C. `BOT_TOKEN is required`

```bash
cat ~/enzine/.env | grep BOT_TOKEN
```

Файл должен быть в **корне** `~/enzine/.env`, не в `apps/bot`.

Обновите код (fix path):

```bash
cd ~/enzine && git pull
pm2 restart enzine-bot
```

### D. Бот не отвечает

```bash
pm2 logs enzine-bot
pm2 restart enzine-bot
```

Проверьте токен в BotFather (Revoke → новый токен → обновить `.env`).

### E. Два процесса бота (конфlict)

Остановите бота на ПК (`Ctrl+C` в `npm run dev:bot`).  
На сервере только один pm2 process:

```bash
pm2 delete enzine-bot
pm2 start npm --name enzine-bot --cwd ~/enzine -- run start -w @enzine/bot
pm2 save
```

### F. npm install OOM на E2.Micro (1 GB RAM)

```bash
export NODE_OPTIONS=--max-old-space-size=512
npm install
```

---

## Чек-лист «готово»

- [ ] Oracle VM **Running**
- [ ] SSH работает
- [ ] `pm2 status` → enzine-bot **online**
- [ ] Лог: `Bot started (long polling)`
- [ ] `/start` в Telegram отвечает
- [ ] ПК выключен — бот всё ещё отвечает
- [ ] Menu Button → Vercel URL (опционально)

---

## Следующий шаг (позже)

- PostgreSQL на Oracle или Neon → подключить `DATABASE_URL`
- Webhook вместо polling (не обязательно на VPS)

---

## Полезные команды

| Действие | Команда |
|----------|---------|
| Логи | `pm2 logs enzine-bot` |
| Рестарт | `pm2 restart enzine-bot` |
| Статус | `pm2 status` |
| Перезагрузка VM | Oracle Console → Reboot, pm2 поднимет бота сам (после `pm2 startup`) |
