import { EnvKeys, requireEnv } from "@enzine/shared";

export const config = {
  botToken: process.env[EnvKeys.BOT_TOKEN] ?? "",
  webhookUrl: process.env[EnvKeys.BOT_WEBHOOK_URL],
  webhookSecret: process.env[EnvKeys.BOT_WEBHOOK_SECRET],
  webhookPath: process.env.BOT_WEBHOOK_PATH ?? "/webhook",
  port: Number(process.env.PORT ?? process.env[EnvKeys.BOT_PORT] ?? 3000),
} as const;

export function validateConfig(): void {
  requireEnv(EnvKeys.BOT_TOKEN, config.botToken);
}

export function isWebhookMode(): boolean {
  return Boolean(config.webhookUrl);
}
