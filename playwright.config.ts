import { defineConfig } from "@playwright/test";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3099;
const BASE_URL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: BASE_URL,
    headless: true,
    screenshot: "only-on-failure",
  },
  webServer: {
    command: `npx next dev --port ${PORT}`,
    port: PORT,
    timeout: 30_000,
    reuseExistingServer: true,
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
});
