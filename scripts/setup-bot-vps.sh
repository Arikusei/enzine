#!/bin/bash
# Enzine bot — установка на Ubuntu VPS (Oracle Cloud Always Free и др.)
# Запуск на сервере: bash scripts/setup-bot-vps.sh

set -euo pipefail

REPO="${ENZINE_REPO:-https://github.com/Arikusei/enzine.git}"
DIR="${ENZINE_DIR:-$HOME/enzine}"

echo "==> Node.js 20"
if ! command -v node >/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs git
fi

echo "==> Clone / update"
if [ -d "$DIR/.git" ]; then
  cd "$DIR" && git pull
else
  git clone "$REPO" "$DIR"
  cd "$DIR"
fi

echo "==> Install & build"
npm install
npm run build -w @enzine/shared
npm run build -w @enzine/bot

if [ ! -f .env ]; then
  cp .env.example .env
  echo ""
  echo "!!! Отредактируйте $DIR/.env — задайте BOT_TOKEN (без BOT_WEBHOOK_URL для polling)"
  echo "    nano $DIR/.env"
  exit 1
fi

echo "==> PM2"
if ! command -v pm2 >/dev/null; then
  sudo npm install -g pm2
fi

pm2 delete enzine-bot 2>/dev/null || true
pm2 start npm --name enzine-bot --cwd "$DIR" -- run start -w @enzine/bot
pm2 save

echo ""
echo "==> Готово. Логи: pm2 logs enzine-bot"
echo "    Автозапуск: pm2 startup  (выполните команду, которую выведет pm2)"
