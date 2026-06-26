import { EnvKeys, requireEnv } from "@enzine/shared";

export const config = {
  botToken: process.env[EnvKeys.BOT_TOKEN] ?? "",
  webhookUrl: process.env[EnvKeys.BOT_WEBHOOK_URL],
  webhookSecret: process.env[EnvKeys.BOT_WEBHOOK_SECRET],
  port: Number(process.env[EnvKeys.BOT_PORT] ?? 3000),
} as const;

export function validateConfig(): void {
  requireEnv(EnvKeys.BOT_TOKEN, config.botToken);
}
