import { test, expect, Page } from "@playwright/test";

const SUPABASE_URL = "https://zqclmhebguciincdtunw.supabase.co";
const PROJECT_REF = "zqclmhebguciincdtunw";

const FAKE_ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" +
  ".eyJzdWIiOiJ0ZXN0LWFkbWluLWlkIiwiZW1haWwiOiJ0ZXN0QGFkbWluLmNvbSIsImV4cCI6OTk5OTk5OTk5OSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIn0" +
  ".dGVzdA";

const MOCK_USER = {
  id: "test-admin-id",
  email: "test@admin.com",
  role: "authenticated",
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00.000Z",
  user_metadata: {},
  app_metadata: { provider: "email", providers: ["email"] },
};

const SESSION_OBJ = {
  access_token: FAKE_ACCESS_TOKEN,
  refresh_token: "fake-refresh-token",
  expires_at: 9999999999,
  expires_in: 9999999999,
  token_type: "bearer",
  user: MOCK_USER,
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3000",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
};

const EMPTY_STATS = {
  users: { total: 0, newToday: 0, newThisWeek: 0, activeThisWeek: 0, plans: { free: 0, pro: 0 } },
  submissions: {
    writing: { today: 0, week: 0, month: 0 },
    speaking: { today: 0, week: 0, month: 0 },
    reading: { today: 0, week: 0, month: 0 },
    listening: { today: 0, week: 0, month: 0 },
  },
  costs: { today: 0, week: 0, month: 0, avgSessionCost: 0, sessionsThisMonth: 0 },
  topUsersByCost: [],
  topUsersByActivity: [],
  averageBands: { writing: null, speaking: null, reading: null, listening: null },
  systemHealth: [],
  recentErrors: [],
  engagementByDay: [],
};

async function setupAdminMocks(page: Page) {
  await page.context().addCookies([
    {
      name: `sb-${PROJECT_REF}-auth-token`,
      value: JSON.stringify(SESSION_OBJ),
      domain: "localhost",
      path: "/",
    },
  ]);

  // Supabase auth endpoint — must return CORS headers or browser rejects
  await page.route(`${SUPABASE_URL}/auth/v1/**`, (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: CORS_HEADERS });
    }
    return route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      body: JSON.stringify(MOCK_USER),
    });
  });

  // Supabase REST — user_settings role check (single() expects object, not array)
  await page.route(`${SUPABASE_URL}/rest/v1/**`, (route) => {
    if (route.request().method() === "OPTIONS") {
      return route.fulfill({ status: 204, headers: CORS_HEADERS });
    }
    return route.fulfill({
      status: 200,
      headers: { "Content-Type": "application/vnd.pgrst.object+json", ...CORS_HEADERS },
      body: JSON.stringify({ role: "admin", plan_type: "pro" }),
    });
  });

  // Admin API routes
  await page.route("/api/admin/**", (route) => {
    const url = route.request().url();
    if (url.includes("/api/admin/settings")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          budgets: { daily: null, monthly: null },
          current: { today: 0, month: 0 },
          alerts: { dailyExceeded: false, monthlyExceeded: false, dailyWarning: false, monthlyWarning: false },
        }),
      });
    }
    if (url.includes("/api/admin/stats")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(EMPTY_STATS),
      });
    }
    if (url.includes("/api/admin/users")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ users: [] }),
      });
    }
    if (url.includes("/api/admin/api-usage")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          logs: [],
          summary: { totalCalls: 0, totalCost: 0, byType: {}, byUser: {}, byDay: {} },
          profiles: {},
        }),
      });
    }
    if (url.includes("/api/admin/feedback")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ feedback: [], total: 0 }),
      });
    }
    if (url.includes("/api/admin/audit-log")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ logs: [], total: 0 }),
      });
    }
    if (url.includes("/api/admin/submissions")) {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ submissions: [], total: 0, page: 1, perPage: 20 }),
      });
    }
    return route.continue();
  });
}

const ADMIN_PAGES = [
  { path: "/admin", label: "Dashboard" },
  { path: "/admin/users", label: "Users" },
  { path: "/admin/submissions", label: "Submissions" },
  { path: "/admin/api-usage", label: "API Usage" },
  { path: "/admin/feedback", label: "Feedback" },
  { path: "/admin/audit-log", label: "Audit Log" },
  { path: "/admin/settings", label: "Settings" },
];

test.describe("Admin layout consistency", () => {
  test.beforeEach(async ({ page }) => {
    await setupAdminMocks(page);
  });

  for (const { path, label } of ADMIN_PAGES) {
    test(`${label} tab: admin nav stays at consistent x-position as data loads`, async ({ page }) => {
      await page.goto(path);

      // Auth passes → admin nav renders
      const adminHeading = page.getByRole("link", { name: "IELTSBoost" }).first();
      await expect(adminHeading).toBeVisible({ timeout: 10000 });

      // Measure position while page data may still be loading
      const earlyBox = await adminHeading.boundingBox();
      expect(earlyBox).not.toBeNull();

      // Wait for all data fetches to settle
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(200);

      // Measure again after data loaded
      const lateBox = await adminHeading.boundingBox();
      expect(lateBox).not.toBeNull();

      expect(Math.abs(lateBox!.x - earlyBox!.x)).toBeLessThanOrEqual(1);
    });
  }

  test("admin nav x-position is the same across all tabs after data loads", async ({ page }) => {
    const positions: { label: string; x: number }[] = [];

    for (const { path, label } of ADMIN_PAGES) {
      await page.goto(path);
      const heading = page.getByRole("link", { name: "IELTSBoost" }).first();
      await expect(heading).toBeVisible({ timeout: 10000 });
      await page.waitForLoadState("networkidle");
      await page.waitForTimeout(200);
      const box = await heading.boundingBox();
      expect(box).not.toBeNull();
      positions.push({ label, x: box!.x });
    }

    // All tabs should have the admin heading at the same x (within 1px)
    const first = positions[0].x;
    for (const { label, x } of positions) {
      expect(Math.abs(x - first)).toBeLessThanOrEqual(1);
    }
  });

  test("all admin tab links are visible on every page", async ({ page }) => {
    for (const { path } of ADMIN_PAGES) {
      await page.goto(path);
      await expect(
        page.getByRole("link", { name: "IELTSBoost" }).first()
      ).toBeVisible({ timeout: 10000 });

      for (const { label } of ADMIN_PAGES) {
        await expect(page.getByRole("link", { name: label, exact: true })).toBeVisible();
      }
    }
  });
});
