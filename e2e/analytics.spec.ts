import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config({ path: ".env.local", quiet: true });

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";

test.describe("Analytics ingestion", () => {
  test("valid pageview is accepted and stored", async ({ request }) => {
    const visitorId = randomUUID();
    const res = await request.post("/api/analytics", {
      headers: { "user-agent": BROWSER_UA },
      data: {
        visitorId,
        sessionId: randomUUID(),
        eventType: "pageview",
        path: "/test-page",
        referrer: "https://example.com",
      },
    });
    expect(res.status()).toBe(204);

    const { count } = await admin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("visitor_id", visitorId);
    expect(count ?? 0).toBeGreaterThan(0);

    // cleanup
    await admin.from("analytics_events").delete().eq("visitor_id", visitorId);
    await admin.from("analytics_visitors").delete().eq("visitor_id", visitorId);
  });

  test("missing visitorId returns 400", async ({ request }) => {
    const res = await request.post("/api/analytics", {
      headers: { "user-agent": BROWSER_UA },
      data: { eventType: "pageview" },
    });
    expect(res.status()).toBe(400);
  });

  test("bot user agent is dropped (204, no row written)", async ({ request }) => {
    const visitorId = randomUUID();
    const res = await request.post("/api/analytics", {
      headers: { "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" },
      data: { visitorId, eventType: "pageview", path: "/bot" },
    });
    expect(res.status()).toBe(204);

    const { count } = await admin
      .from("analytics_events")
      .select("*", { count: "exact", head: true })
      .eq("visitor_id", visitorId);
    expect(count ?? 0).toBe(0);
  });
});

test.describe("Analytics beacon", () => {
  test("a real page load fires a pageview to /api/analytics", async ({ page }) => {
    const beacon = page.waitForRequest(
      (req) => req.url().endsWith("/api/analytics") && req.method() === "POST",
      { timeout: 8000 },
    );
    await page.goto("/");
    const req = await beacon;
    const body = JSON.parse(req.postData() ?? "{}");
    expect(body.eventType).toBe("pageview");
    expect(typeof body.visitorId).toBe("string");
    expect(body.visitorId.length).toBeGreaterThan(0);

    // cleanup any row the beacon wrote for this visitor
    if (body.visitorId) {
      await admin.from("analytics_events").delete().eq("visitor_id", body.visitorId);
      await admin.from("analytics_visitors").delete().eq("visitor_id", body.visitorId);
    }
  });
});
