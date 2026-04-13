import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3099",
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: "npx next dev --port 3099",
    port: 3099,
    timeout: 30_000,
    reuseExistingServer: false,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
