# Site Analytics — Design

**Date:** 2026-06-14
**Status:** Approved (pending implementation plans)

## Goal

First-party site analytics owned entirely in Supabase: pageviews, unique
visitors, returning visitors, traffic sources, per-page traffic, visitor flow,
and a conversion funnel that ties anonymous visitors through signup all the way
to paid (Stripe Pro). No external analytics service — works reliably for users
in China, and the data is ours.

## Non-goals (YAGNI)

- Session replay / heatmaps
- Real-time live dashboard (queries run on page load; near-real-time is fine)
- Per-event UI configuration — the event taxonomy is defined in code
- Storing raw IP addresses (we store coarse country only)
- Replacing `@vercel/analytics` immediately — it can stay mounted in parallel
  during rollout and be removed later if desired

## Architecture

Three parts:

### 1. Client beacon

A small script mounted in the root layout (`app/layout.tsx`).

- On first visit, mint an anonymous `visitor_id` (UUID v4) stored in
  **both** `localStorage` and a first-party cookie (`ib_vid`, ~2yr,
  `SameSite=Lax`). The cookie lets the server read the id on milestone events;
  localStorage is the resilient client copy.
- Maintain a `session_id` (UUID) in `sessionStorage` plus a `last_activity`
  timestamp in `localStorage`. Start a **new** `session_id` when more than
  **30 minutes** have elapsed since `last_activity`.
- On every route change, send a `pageview` event. Client CTA events
  (e.g. existing `landing_cta_click`) also route through here.
- Transport: `navigator.sendBeacon` (fire-and-forget, non-blocking, survives
  page unload). Fall back to `fetch(..., {keepalive:true})` if unavailable.
- No PII, no fingerprinting.

### 2. Ingestion route — `POST /api/analytics`

- Validates payload shape; rejects malformed bodies with 400.
- **Bot filtering:** drop events whose user agent matches a known-bot regex
  (`bot|crawler|spider|crawling|headless|preview|monitor`).
- **Enrichment (server-side):**
  - `referrer`, `path`, `user_agent` from the request/payload.
  - `country` from the edge geo header (`x-vercel-ip-country`). **No raw IP is
    stored.**
  - `user_id`: resolve the current Supabase user from the request cookies; null
    if anonymous.
- Inserts into `analytics_events` via the **service-role** client.
- Upserts `analytics_visitors` (`first_seen`/`last_seen`, and `first_*`
  attribution fields on first insert).
- **Identity stitch:** if the event is authenticated and the visitor row has a
  null `user_id`, set `analytics_visitors.user_id = <current user>`. This links
  the anonymous history to the account.
- Always returns `204` quickly; never blocks the client. Failures are logged,
  not surfaced.

### 3. Server-emitted milestone events

The four funnel milestones are written **server-side at their source of truth**
(via a shared `logAnalyticsEvent` helper using the service-role client), so they
do not depend on the client beacon firing:

| Milestone | Emitted from | `name` |
|-----------|--------------|--------|
| Landing → Signup | auth callback / signup completion | `signup` |
| Signup → First submission | `/api/score` (and speaking route) on the user's first-ever submission | `first_submission` |
| First submission → Free limit hit | the existing 429 branch in `checkWritingUsage` | `free_limit_hit` |
| Free → Pro | Stripe webhook `checkout.session.completed` | `pro_converted` |

The "Landing" top of funnel is derived from `pageview` events, not a milestone.

`first_submission` is detected by checking whether the user has any prior
`writing_submissions`/`speaking_submissions` row (or a prior `first_submission`
event) before emitting — emit once per user.

## Data model

Two new tables, prefixed `analytics_*` in the `public` schema (PostgREST exposes
`public` by default — avoids the friction of a separate Postgres schema). All
timestamps are `timestamptz` from the start (sidesteps the pending
`fix_created_at_timestamptz` migration for these tables).

### `analytics_events`

```sql
create table analytics_events (
  id          uuid primary key default gen_random_uuid(),
  visitor_id  uuid not null,
  user_id     uuid references auth.users(id),   -- null when anonymous
  event_type  text not null,                    -- 'pageview' | 'milestone' | 'event'
  name        text,                             -- 'signup','first_submission',
                                                 -- 'free_limit_hit','pro_converted',
                                                 -- or a CTA/event name
  path        text,
  referrer    text,
  country     text,                             -- ISO-2 from edge header, no raw IP
  user_agent  text,
  session_id  uuid,
  props       jsonb,
  created_at  timestamptz not null default now()
);
create index analytics_events_visitor_idx on analytics_events (visitor_id);
create index analytics_events_user_idx    on analytics_events (user_id);
create index analytics_events_created_idx on analytics_events (created_at);
create index analytics_events_name_idx    on analytics_events (name);
```

### `analytics_visitors`

```sql
create table analytics_visitors (
  visitor_id     uuid primary key,
  user_id        uuid references auth.users(id),  -- set at first authenticated event (the stitch)
  first_seen     timestamptz not null default now(),
  last_seen      timestamptz not null default now(),
  first_referrer text,
  first_path     text,
  country        text
);
create index analytics_visitors_user_idx on analytics_visitors (user_id);
```

### Row Level Security

- Enable RLS on both tables.
- **No client insert/select policies** — all writes go through the service-role
  client in `/api/analytics` (service role bypasses RLS), and the table is never
  exposed to the anon key.
- **Admin read policy:** allow `select` when the requesting user's
  `user_settings.role = 'admin'` (mirrors the existing admin pattern), so the
  dashboard can read via the normal authenticated client.

## Sessionization & metric definitions

- **Unique visitors (period):** `count(distinct visitor_id)` over the period.
- **Returning visitor:** a `visitor_id` whose `first_seen` predates the period.
- **Session:** client-assigned `session_id`, rotated after 30 min inactivity.
- **Pageviews:** count of `event_type = 'pageview'` rows.
- **Funnel conversion %:** each step's distinct-user (or distinct-visitor for
  the landing step) count divided by the previous step's count.

Heavy aggregations may be exposed as Postgres views or `rpc` functions to keep
dashboard queries simple; decided during Plan B.

## Dashboard — `/admin/analytics`

New "Analytics" tab added to the `adminLinks` array in `app/admin/layout.tsx`
(admin-only via the existing role check). Rendered with `recharts` (already a
dependency).

- **Summary cards:** unique visitors (today / 7d / 30d), pageviews, returning %,
  signups, Pro conversions.
- **Pageviews over time:** line chart with a range selector (7d / 30d / 90d).
- **Top pages:** table of path → views / unique visitors.
- **Traffic sources:** referrer breakdown; **country** breakdown.
- **Conversion funnel:** Landing → Signup → First submission → Free-limit hit →
  Pro, showing counts and step-to-step conversion %.

## Privacy & performance

- Anonymous first-party id only; no fingerprinting; no raw IP stored.
- Beacon is fire-and-forget via `sendBeacon`; zero impact on page render.
- Bot UA filtering at ingestion keeps the dataset clean.
- `@vercel/analytics` may remain mounted during rollout for cross-checking, then
  be removed if redundant.

## Build order (two implementation plans)

**Plan A — Collection (build first):**
schema migration + RLS, `lib/analytics.ts` (`logAnalyticsEvent` helper),
`/api/analytics` ingestion route, client beacon in the root layout, and the four
server-side milestone hooks. Shipping this starts data accumulation immediately.

**Plan B — Dashboard (build second):**
the `/admin/analytics` page, supporting views/rpc functions, recharts
visualizations, and the nav link — built once real data exists to render.

## Integration points (existing code touched)

- `app/layout.tsx` — mount the beacon component.
- `app/api/score/route.ts` (+ speaking route) — emit `first_submission`.
- `lib/usage.ts` / the 429 branch — emit `free_limit_hit`.
- `app/api/webhooks/stripe/route.ts` (`checkout.session.completed`) — emit
  `pro_converted`.
- auth callback / signup flow — emit `signup`.
- `app/admin/layout.tsx` — add the Analytics nav link (Plan B).
- `lib/landing-analytics.ts` — optionally also route CTA events through
  `/api/analytics` (keeps a single store).
