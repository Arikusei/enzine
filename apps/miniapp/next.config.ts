import { config } from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../.env") });

const nextConfig: NextConfig = {
  transpilePackages: ["@enzine/shared"],
};

export default nextConfig;
