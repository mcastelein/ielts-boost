# Site Analytics — Collection (Plan A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up first-party analytics collection — schema, ingestion beacon, and server-emitted funnel milestones — so visitor and conversion data starts accumulating in Supabase.

**Architecture:** A client beacon mints an anonymous `visitor_id` and posts pageview/event beacons to `POST /api/analytics`, which filters bots, enriches with country (edge header, no raw IP), resolves the logged-in user, and writes to `analytics_events` + `analytics_visitors` via the service-role key. Four funnel milestones (`signup`, `first_submission`, `free_limit_hit`, `pro_converted`) are emitted server-side at their source of truth via a shared, dedup-once helper.

**Tech Stack:** Next.js 16 (App Router), Supabase (Postgres + RLS), `@supabase/supabase-js` service-role client, Playwright (`@playwright/test`) for API/integration tests, `dotenv` for test env.

**Reference spec:** `docs/superpowers/specs/2026-06-14-site-analytics-design.md`

**Conventions observed in this codebase:**
- Migrations are plain `.sql` files in `supabase/`, run manually in Supabase Studio. RLS admin policy pattern: `EXISTS (SELECT 1 FROM user_settings WHERE user_id = auth.uid() AND role = 'admin')` (see `supabase/add_admin_settings.sql`).
- Server logging helpers live in `lib/` and are fire-and-forget with internal `try/catch` (see `lib/api-logger.ts`).
- Service-role client: `createAdminClient()` from `lib/supabase/admin.ts` (returns `null` if env missing).
- Tests are Playwright specs in `e2e/`, using the `request` fixture against the dev server (`baseURL` http://localhost:3099). Run with `npx playwright test`.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `supabase/add_analytics_tables.sql` (create) | `analytics_events`, `analytics_visitors`, indexes, `record_visitor()` upsert function, RLS policies |
| `lib/analytics.ts` (create) | Server helpers: `logAnalyticsEvent`, `logMilestoneOnce`, `isBot`, types |
| `app/api/analytics/route.ts` (create) | Ingestion endpoint: validate, bot-filter, enrich, resolve user, write |
| `lib/analytics-client.ts` (create) | Client: visitor/session id management, `sendAnalytics`, `trackEvent` |
| `components/analytics-beacon.tsx` (create) | Client component: fires a pageview on each route change |
| `app/layout.tsx` (modify) | Mount `<AnalyticsBeacon />` |
| `app/auth/callback/route.ts` (modify) | Emit `signup` milestone |
| `app/api/score/route.ts` (modify) | Emit `first_submission` and `free_limit_hit` milestones |
| `app/api/webhooks/stripe/route.ts` (modify) | Emit `pro_converted` milestone |
| `e2e/analytics.spec.ts` (create) | Tests for ingestion route + bot filtering |

---

## Task 1: Database schema & RLS

**Files:**
- Create: `supabase/add_analytics_tables.sql`

- [ ] **Step 1: Write the migration SQL**

Create `supabase/add_analytics_tables.sql`:

```sql
-- Site analytics: raw event stream + per-visitor rollup.
-- All timestamps are timestamptz from the start.

CREATE TABLE IF NOT EXISTS analytics_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id  uuid NOT NULL,
  user_id     uuid REFERENCES auth.users(id),
  event_type  text NOT NULL,            -- 'pageview' | 'milestone' | 'event'
  name        text,
  path        text,
  referrer    text,
  country     text,                     -- ISO-2 from edge header; no raw IP
  user_agent  text,
  session_id  uuid,
  props       jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS analytics_events_visitor_idx ON analytics_events (visitor_id);
CREATE INDEX IF NOT EXISTS analytics_events_user_idx    ON analytics_events (user_id);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events (created_at);
CREATE INDEX IF NOT EXISTS analytics_events_name_idx    ON analytics_events (name);

CREATE TABLE IF NOT EXISTS analytics_visitors (
  visitor_id     uuid PRIMARY KEY,
  user_id        uuid REFERENCES auth.users(id),  -- set on first authenticated event (the stitch)
  first_seen     timestamptz NOT NULL DEFAULT now(),
  last_seen      timestamptz NOT NULL DEFAULT now(),
  first_referrer text,
  first_path     text,
  country        text
);
CREATE INDEX IF NOT EXISTS analytics_visitors_user_idx ON analytics_visitors (user_id);

-- Upsert a visitor: insert on first sight (capturing attribution), otherwise
-- bump last_seen and stitch user_id once it becomes known (coalesce keeps the
-- first non-null user_id). SECURITY DEFINER so the service role can call it.
CREATE OR REPLACE FUNCTION record_visitor(
  p_visitor_id uuid,
  p_user_id    uuid,
  p_referrer   text,
  p_path       text,
  p_country    text
) RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO analytics_visitors (visitor_id, user_id, first_referrer, first_path, country)
  VALUES (p_visitor_id, p_user_id, p_referrer, p_path, p_country)
  ON CONFLICT (visitor_id) DO UPDATE
    SET last_seen = now(),
        user_id   = COALESCE(analytics_visitors.user_id, EXCLUDED.user_id);
$$;

-- RLS: all writes go through the service-role client (bypasses RLS). The anon
-- key is never granted insert/select. Admins can read for the dashboard.
ALTER TABLE analytics_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read analytics_events"
  ON analytics_events FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_settings WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admins can read analytics_visitors"
  ON analytics_visitors FOR SELECT
  USING (EXISTS (SELECT 1 FROM user_settings WHERE user_id = auth.uid() AND role = 'admin'));
```

- [ ] **Step 2: Apply the migration in Supabase Studio**

Open the Supabase project SQL editor, paste the contents of `supabase/add_analytics_tables.sql`, and run it. (This matches the existing manual-migration workflow for this project.)

- [ ] **Step 3: Verify the tables and function exist**

Run this in the Supabase SQL editor:

```sql
SELECT to_regclass('public.analytics_events')   AS events,
       to_regclass('public.analytics_visitors') AS visitors,
       proname AS fn
FROM pg_proc WHERE proname = 'record_visitor';
```

Expected: `events` = `analytics_events`, `visitors` = `analytics_visitors`, `fn` = `record_visitor` (one row).

- [ ] **Step 4: Commit**

```bash
git add supabase/add_analytics_tables.sql
git commit -m "feat(analytics): add analytics_events/visitors tables + RLS"
```

---

## Task 2: Server analytics helpers (`lib/analytics.ts`)

**Files:**
- Create: `lib/analytics.ts`

These helpers are exercised end-to-end by the Playwright tests in Task 3 (ingestion route) and by the milestone hooks in Task 5. No standalone unit test — the repo's only runner is Playwright against the running server.

- [ ] **Step 1: Write `lib/analytics.ts`**

```ts
import { createAdminClient } from "@/lib/supabase/admin";

export type AnalyticsEventType = "pageview" | "milestone" | "event";

export interface AnalyticsEventInput {
  visitorId: string;
  userId?: string | null;
  eventType: AnalyticsEventType;
  name?: string | null;
  path?: string | null;
  referrer?: string | null;
  country?: string | null;
  userAgent?: string | null;
  sessionId?: string | null;
  props?: Record<string, unknown> | null;
}

// Heuristic bot filter applied at ingestion.
export const BOT_UA_REGEX =
  /bot|crawler|spider|crawling|headless|preview|monitor|slurp|curl|wget|python-requests/i;

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false;
  return BOT_UA_REGEX.test(userAgent);
}

// Insert one raw event and update the visitor rollup. Fire-and-forget:
// never throws to the caller.
export async function logAnalyticsEvent(input: AnalyticsEventInput): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  try {
    await admin.from("analytics_events").insert({
      visitor_id: input.visitorId,
      user_id: input.userId ?? null,
      event_type: input.eventType,
      name: input.name ?? null,
      path: input.path ?? null,
      referrer: input.referrer ?? null,
      country: input.country ?? null,
      user_agent: input.userAgent ?? null,
      session_id: input.sessionId ?? null,
      props: input.props ?? null,
    });

    await admin.rpc("record_visitor", {
      p_visitor_id: input.visitorId,
      p_user_id: input.userId ?? null,
      p_referrer: input.referrer ?? null,
      p_path: input.path ?? null,
      p_country: input.country ?? null,
    });
  } catch (error) {
    console.error("Failed to log analytics event:", error);
  }
}

// Emit a funnel milestone exactly once per user. Safe to call on every
// signup/submission/conversion — the dedup check makes repeats no-ops.
export async function logMilestoneOnce(
  userId: string,
  name: string,
  props?: Record<string, unknown>
): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  try {
    const { data: existing } = await admin
      .from("analytics_events")
      .select("id")
      .eq("user_id", userId)
      .eq("name", name)
      .limit(1)
      .maybeSingle();
    if (existing) return;

    // Reuse the visitor_id already stitched to this user, so the milestone
    // sits on the same visitor timeline. Fall back to userId (also a uuid)
    // if no visitor row exists yet — visitor_id is NOT NULL.
    const { data: visitor } = await admin
      .from("analytics_visitors")
      .select("visitor_id")
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();

    await admin.from("analytics_events").insert({
      visitor_id: visitor?.visitor_id ?? userId,
      user_id: userId,
      event_type: "milestone",
      name,
      props: props ?? null,
    });
  } catch (error) {
    console.error(`Failed to log milestone "${name}":`, error);
  }
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors introduced by `lib/analytics.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/analytics.ts
git commit -m "feat(analytics): add logAnalyticsEvent + logMilestoneOnce helpers"
```

---

## Task 3: Ingestion route (`/api/analytics`) — TDD

**Files:**
- Create: `app/api/analytics/route.ts`
- Test: `e2e/analytics.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `e2e/analytics.spec.ts`:

```ts
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test e2e/analytics.spec.ts`
Expected: FAIL — the route does not exist yet, so the valid-pageview POST returns 404 (not 204).

- [ ] **Step 3: Write the ingestion route**

Create `app/api/analytics/route.ts`:

```ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logAnalyticsEvent, isBot, type AnalyticsEventType } from "@/lib/analytics";

const VALID_TYPES: AnalyticsEventType[] = ["pageview", "milestone", "event"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const visitorId = typeof body.visitorId === "string" ? body.visitorId : null;
  const eventType = body.eventType as AnalyticsEventType;
  if (!visitorId || !VALID_TYPES.includes(eventType)) {
    return NextResponse.json(
      { error: "missing or invalid visitorId/eventType" },
      { status: 400 },
    );
  }

  // Drop bot traffic before doing any work.
  const userAgent = request.headers.get("user-agent");
  if (isBot(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const country = request.headers.get("x-vercel-ip-country");

  // Resolve the logged-in user from the session cookie, if any.
  let userId: string | null = null;
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userId = data.user?.id ?? null;
  } catch {
    // anonymous visitor
  }

  await logAnalyticsEvent({
    visitorId,
    userId,
    eventType,
    name: typeof body.name === "string" ? body.name : null,
    path: typeof body.path === "string" ? body.path : null,
    referrer: typeof body.referrer === "string" ? body.referrer : null,
    country,
    userAgent,
    sessionId: typeof body.sessionId === "string" ? body.sessionId : null,
    props: (body.props as Record<string, unknown>) ?? null,
  });

  return new NextResponse(null, { status: 204 });
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test e2e/analytics.spec.ts`
Expected: PASS — all three tests green.

- [ ] **Step 5: Commit**

```bash
git add app/api/analytics/route.ts e2e/analytics.spec.ts
git commit -m "feat(analytics): add /api/analytics ingestion route with bot filtering"
```

---

## Task 4: Client beacon

**Files:**
- Create: `lib/analytics-client.ts`
- Create: `components/analytics-beacon.tsx`
- Modify: `app/layout.tsx`
- Test: `e2e/analytics.spec.ts` (add a browser-driven case)

- [ ] **Step 1: Write the client helper**

Create `lib/analytics-client.ts`:

```ts
const VISITOR_KEY = "ib_vid";
const SESSION_KEY = "ib_sid";
const LAST_ACTIVITY_KEY = "ib_last_activity";
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
    // First-party cookie so the server can read the id on milestone events.
    document.cookie = `${VISITOR_KEY}=${id}; path=/; max-age=63072000; SameSite=Lax`;
  }
  return id;
}

function getSessionId(): string {
  const now = Date.now();
  const last = Number(localStorage.getItem(LAST_ACTIVITY_KEY) ?? 0);
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid || now - last > SESSION_TIMEOUT_MS) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  localStorage.setItem(LAST_ACTIVITY_KEY, String(now));
  return sid;
}

interface SendInput {
  eventType: "pageview" | "event";
  name?: string;
  path?: string;
  props?: Record<string, unknown>;
}

export function sendAnalytics(input: SendInput): void {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      visitorId: getVisitorId(),
      sessionId: getSessionId(),
      eventType: input.eventType,
      name: input.name ?? null,
      path: input.path ?? window.location.pathname,
      referrer: document.referrer || null,
      props: input.props ?? null,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", payload);
    } else {
      void fetch("/api/analytics", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    // Analytics must never break the page.
  }
}

export function trackEvent(name: string, props?: Record<string, unknown>): void {
  sendAnalytics({ eventType: "event", name, props });
}
```

- [ ] **Step 2: Write the beacon component**

Create `components/analytics-beacon.tsx`:

```tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { sendAnalytics } from "@/lib/analytics-client";

// Fires one pageview per route change. Renders nothing.
export default function AnalyticsBeacon() {
  const pathname = usePathname();
  useEffect(() => {
    sendAnalytics({ eventType: "pageview", path: pathname });
  }, [pathname]);
  return null;
}
```

- [ ] **Step 3: Mount it in the root layout**

In `app/layout.tsx`, add the import alongside the existing analytics imports:

```ts
import AnalyticsBeacon from "@/components/analytics-beacon";
```

Then add `<AnalyticsBeacon />` immediately after `<SpeedInsights />` in the body:

```tsx
        <Analytics />
        <SpeedInsights />
        <AnalyticsBeacon />
      </body>
```

- [ ] **Step 4: Add a browser-driven test**

Append to `e2e/analytics.spec.ts`:

```ts
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test e2e/analytics.spec.ts`
Expected: PASS — the home page load triggers a `pageview` POST with a non-empty `visitorId`.

- [ ] **Step 6: Commit**

```bash
git add lib/analytics-client.ts components/analytics-beacon.tsx app/layout.tsx e2e/analytics.spec.ts
git commit -m "feat(analytics): client beacon fires pageviews on route change"
```

---

## Task 5: Server-emitted funnel milestones

**Files:**
- Modify: `app/auth/callback/route.ts` (signup)
- Modify: `app/api/score/route.ts` (first_submission, free_limit_hit)
- Modify: `app/api/webhooks/stripe/route.ts` (pro_converted)

Each call uses `logMilestoneOnce`, which dedups per user, so repeated triggers are safe no-ops.

### 5a: `signup`

- [ ] **Step 1: Edit `app/auth/callback/route.ts`**

Add the import at the top:

```ts
import { logMilestoneOnce } from "@/lib/analytics";
```

Inside the `if (!error)` branch, resolve the user and emit before redirecting. Replace:

```ts
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
```

with:

```ts
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) void logMilestoneOnce(user.id, "signup");
      return NextResponse.redirect(`${origin}${next}`);
    }
```

Note: the callback fires on every OAuth login and on email-confirmation, but `logMilestoneOnce` records `signup` only the first time per user, so logins after signup are no-ops.

### 5b: `first_submission` and `free_limit_hit`

- [ ] **Step 2: Edit `app/api/score/route.ts`**

Add the import at the top:

```ts
import { logMilestoneOnce } from "@/lib/analytics";
```

In the usage-limit block, emit `free_limit_hit` before returning the 429. Change:

```ts
      const usage = await checkWritingUsage(supabase, user.id);
      if (!usage.allowed) {
        return NextResponse.json(
```

to:

```ts
      const usage = await checkWritingUsage(supabase, user.id);
      if (!usage.allowed) {
        void logMilestoneOnce(user.id, "free_limit_hit");
        return NextResponse.json(
```

Then emit `first_submission` after a successful score. Find the success return:

```ts
    return NextResponse.json({ ...feedback, submission_id: submissionId });
```

and change it to:

```ts
    if (user) void logMilestoneOnce(user.id, "first_submission");
    return NextResponse.json({ ...feedback, submission_id: submissionId });
```

### 5c: `pro_converted`

- [ ] **Step 3: Edit `app/api/webhooks/stripe/route.ts`**

Add the import at the top:

```ts
import { logMilestoneOnce } from "@/lib/analytics";
```

In the `checkout.session.completed` case, after the `user_settings` update that sets `plan_type: "pro"` and the existing `console.log("User upgraded to pro:", userId);`, add:

```ts
      void logMilestoneOnce(userId, "pro_converted");
```

(Use the same `userId` variable the case already derives from `client_reference_id`.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Verify `free_limit_hit` end-to-end (the one milestone reachable without OAuth/Stripe)**

This requires an authenticated user over the free daily limit. If you have a free-tier test account whose `usage_tracking.writing_count` for today is already at the limit (or temporarily set `FREE_DAILY_WRITING_LIMIT` to `0` in `lib/usage.ts`), submit an essay through the UI while logged in, then run in the Supabase SQL editor:

```sql
SELECT name, count(*) FROM analytics_events
WHERE name IN ('signup','first_submission','free_limit_hit','pro_converted')
GROUP BY name;
```

Expected: a `free_limit_hit` row exists for the test user. Revert any temporary limit change before committing. `signup`, `first_submission`, and `pro_converted` are verified by code review here and observed in production once real users flow through (they need OAuth/first-essay/Stripe respectively, which aren't reproducible in a local unit test).

- [ ] **Step 6: Commit**

```bash
git add app/auth/callback/route.ts app/api/score/route.ts app/api/webhooks/stripe/route.ts
git commit -m "feat(analytics): emit signup/first_submission/free_limit_hit/pro_converted milestones"
```

---

## Task 6: Full regression run

- [ ] **Step 1: Run the analytics test suite**

Run: `npx playwright test e2e/analytics.spec.ts`
Expected: all tests PASS.

- [ ] **Step 2: Run the full e2e suite to confirm no regressions**

Run: `npx playwright test`
Expected: no new failures versus the pre-change baseline. (Pre-existing AI-dependent tests in `e2e/writing.spec.ts` may be slow; that's unrelated to this change.)

- [ ] **Step 3: Confirm data is landing**

After exercising the site locally (load a few pages while logged out, then log in), run in the Supabase SQL editor:

```sql
SELECT event_type, count(*) FROM analytics_events GROUP BY event_type;
SELECT count(*) AS visitors, count(user_id) AS stitched FROM analytics_visitors;
```

Expected: `pageview` rows present; at least one `analytics_visitors` row; `stitched` increments after you log in (the visitor row's `user_id` gets set).

---

## Self-review notes

- **Spec coverage:** anonymous first-party id (Task 4) ✓; beacon→API ingestion (Tasks 3–4) ✓; bot filtering + country-not-IP enrichment (Task 3) ✓; two tables + `record_visitor` stitch + RLS (Task 1) ✓; all four milestones at their source of truth (Task 5) ✓. Dashboard is intentionally out of scope — it's Plan B.
- **Type consistency:** `logAnalyticsEvent` / `logMilestoneOnce` / `isBot` / `AnalyticsEventType` defined in Task 2 are used with matching signatures in Tasks 3 and 5. Payload field names (`visitorId`, `sessionId`, `eventType`, `name`, `path`, `referrer`, `props`) match between the client (Task 4), the route parser (Task 3), and the test (Task 3).
- **No placeholders:** every code step contains complete code; verification steps give exact SQL/commands and expected results.
