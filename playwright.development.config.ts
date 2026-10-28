import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/development",
  use: {
    baseURL: "http://127.0.0.1:3001",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command:
      "ENABLE_UNVERIFIED_CATALOG=true npm run dev -w @brendhouse/storefront -- --port 3001",
    url: "http://127.0.0.1:3001",
    reuseExistingServer: false,
    timeout: 120000,
  },
  reporter: "list",
});
