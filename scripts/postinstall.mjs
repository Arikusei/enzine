import { execSync } from "node:child_process";

// Vercel/CI builds shared explicitly in buildCommand — skip here to avoid tsc during install
if (process.env.VERCEL === "1" || process.env.CI === "true") {
  process.exit(0);
}

execSync("npm run build -w @enzine/shared", { stdio: "inherit" });
