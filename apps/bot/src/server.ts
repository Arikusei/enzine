import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { webhookCallback } from "grammy";
import type { Bot } from "grammy";
import { config } from "./config.js";

export function startWebhookServer(bot: Bot): void {
  if (!config.webhookUrl) {
    throw new Error("BOT_WEBHOOK_URL is required for webhook mode");
  }

  const handler = webhookCallback(bot, "http", {
    secretToken: config.webhookSecret,
  });

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url?.split("?")[0] ?? "";

    if (req.method === "GET" && url === "/health") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("ok");
      return;
    }

    if (req.method === "POST" && url === config.webhookPath) {
      try {
        await handler(req, res);
      } catch (error) {
        console.error("[webhook] handler error", error);
        if (!res.headersSent) {
          res.writeHead(500);
          res.end("error");
        }
      }
      return;
    }

    res.writeHead(404);
    res.end("not found");
  });

  server.listen(config.port, () => {
    console.log(`Webhook server listening on :${config.port}${config.webhookPath}`);
  });
}
