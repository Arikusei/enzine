import { config } from "dotenv";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(fileURLToPath(import.meta.url), "../../..");

config({ path: resolve(rootDir, ".env") });
