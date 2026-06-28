import { Bot } from "grammy";
import {
  BotCommand,
  SeasonStatus,
  UserState,
  formatUserName,
  type User,
} from "@enzine/shared";
import {
  buildStartActionLogs,
  createTelegramIdentity,
  logAction,
  resolveStateAfterStart,
} from "./services/session.js";

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  bot.command(BotCommand.Start, async (ctx) => {
    const user: User = {
      telegramId: ctx.from?.id ?? 0,
      username: ctx.from?.username,
      firstName: ctx.from?.first_name,
      lastName: ctx.from?.last_name,
    };

    const identity = createTelegramIdentity(user.telegramId, user.username, {
      first_name: user.firstName,
      last_name: user.lastName,
    });

    const nextState = resolveStateAfterStart(UserState.NewUser);
    const actions = buildStartActionLogs();

    for (const action of actions) {
      logAction({ ...action, payloadJson: { provider: identity.provider } });
    }

    await ctx.reply(
      [
        `Привет, ${formatUserName(user)}! 👋`,
        "",
        `Сезон: ${SeasonStatus.Active}`,
        `Состояние: ${nextState}`,
        "",
        "Enzine Bot готов к разработке.",
      ].join("\n"),
    );
  });

  bot.command(BotCommand.Help, async (ctx) => {
    await ctx.reply("Доступные команды:\n/start — приветствие\n/help — справка");
  });

  return bot;
}
