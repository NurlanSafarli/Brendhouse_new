import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/admin",
  use: {
    baseURL: "http://127.0.0.1:3002",
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
      args: ["--no-sandbox"],
    },
  },
  projects: [
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
  ],
  webServer: {
    command: "npm run dev:admin",
    url: "http://127.0.0.1:3002",
    reuseExistingServer: false,
  },
  reporter: "list",
});
