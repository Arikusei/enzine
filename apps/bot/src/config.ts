import "dotenv/config";

export const config = {
  botToken: process.env.BOT_TOKEN ?? "",
  webhookUrl: process.env.BOT_WEBHOOK_URL,
  webhookSecret: process.env.BOT_WEBHOOK_SECRET,
  port: Number(process.env.PORT ?? 3000),
} as const;

export function validateConfig(): void {
  if (!config.botToken) {
    throw new Error("BOT_TOKEN is required. Copy .env.example to .env and set your token.");
  }
}
