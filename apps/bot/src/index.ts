import "./load-env.js";

import { config, isWebhookMode, validateConfig } from "./config.js";
import { createBot } from "./bot.js";
import { startWebhookServer } from "./server.js";

async function main(): Promise<void> {
  validateConfig();

  const bot = createBot(config.botToken);

  if (isWebhookMode()) {
    await bot.api.setWebhook(config.webhookUrl!, {
      secret_token: config.webhookSecret,
      drop_pending_updates: true,
    });
    console.log(`Webhook registered: ${config.webhookUrl}`);
    startWebhookServer(bot);
  } else {
    await bot.api.deleteWebhook({ drop_pending_updates: true });
    bot.start();
    console.log("Bot started (long polling)");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
