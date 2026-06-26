export const EnvKeys = {
  BOT_TOKEN: "BOT_TOKEN",
  BOT_WEBHOOK_URL: "BOT_WEBHOOK_URL",
  BOT_WEBHOOK_SECRET: "BOT_WEBHOOK_SECRET",
  BOT_PORT: "BOT_PORT",
  NEXT_PUBLIC_BOT_USERNAME: "NEXT_PUBLIC_BOT_USERNAME",
  NEXT_PUBLIC_API_URL: "NEXT_PUBLIC_API_URL",
  MINIAPP_PORT: "MINIAPP_PORT",
  DATABASE_URL: "DATABASE_URL",
  NODE_ENV: "NODE_ENV",
} as const;

export function requireEnv(key: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`${key} is required. Copy .env.example to .env in the repository root.`);
  }
  return value;
}
