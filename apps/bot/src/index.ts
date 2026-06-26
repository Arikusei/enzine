import { Bot } from "grammy";
import type { User } from "@enzine/shared";
import { config, validateConfig } from "./config.js";

validateConfig();

const bot = new Bot(config.botToken);

bot.command("start", async (ctx) => {
  const user: User = {
    telegramId: ctx.from?.id ?? 0,
    username: ctx.from?.username,
    firstName: ctx.from?.first_name,
    lastName: ctx.from?.last_name,
  };

  await ctx.reply(
    `Привет, ${user.firstName ?? "друг"}! 👋\n\nEnzine Bot готов к разработке.`,
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply("Доступные команды:\n/start — приветствие\n/help — справка");
});

if (config.webhookUrl) {
  await bot.api.setWebhook(config.webhookUrl, {
    secret_token: config.webhookSecret,
  });
  console.log(`Webhook set: ${config.webhookUrl}`);
} else {
  bot.start();
  console.log("Bot started (long polling)");
}
