# Admin Panel: User Visibility Additions

**Date:** 2026-04-25
**Status:** Draft for review

## Goal

Make the admin panel more useful for understanding *who is actually using IELTSBoost and how*. Today the user list shows writing/speaking counts, joined date, and plan/role. Two real gaps:

1. Reading and listening submissions are tracked in DB but invisible in admin.
2. No way to tell who's still active vs. who signed up once and bounced.

We're also adding signals that became valuable after today's bug (auth provider, since email/password signups were silently broken).

## Out of scope

- New tables / migrations (all data already exists).
- Charts on the user list page (keeping list scannable).
- Export changes — CSV exports automatically gain the new fields by virtue of using the same row data.
- Refactoring the existing N+1-style count fetch (pre-existing, not blocking).

## Data sources

| Need | Source |
|---|---|
| Reading count | `public.reading_submissions.user_id` (count rows) |
| Listening count | `public.listening_submissions.user_id` (count rows) |
| Last seen | `auth.users.last_sign_in_at` (auto-tracked by Supabase) |
| Auth provider | `auth.users.raw_app_meta_data.provider` (`google`, `email`, future `wechat`) |
| Days active (7d) | Distinct dates across all 4 submission tables in last 7 days, per user |
| Latest band per section (drill-down) | `*_feedback.overall_band` / `estimated_band` / `band_score` |
| Recent errors (drill-down) | `api_usage_log` rows where success flag indicates failure |

## API changes

### `GET /api/admin/users` (list)

Add to each user object:
```ts
{
  ...existing,
  email,
  display_name,
  last_sign_in_at: string | null,   // ISO timestamp
  provider: string | null,           // "google" | "email" | etc.
  stats: {
    writing, speaking,
    reading: number,                 // NEW
    listening: number,               // NEW
    daysActive7d: number,            // NEW (0..7)
    totalCost,
  }
}
```

Implementation:
- Add 2 fetches in parallel: `reading_submissions` and `listening_submissions` selecting `user_id, created_at` for *all* users (matches existing pattern).
- For days-active: for each of the 4 submission tables, also fetch rows where `created_at >= now() - 7 days`, take the union of `(user_id, YYYY-MM-DD)` pairs, count distinct dates per user.
  - Implementation choice: do this inside the existing JS aggregation loop. We already pull all submissions; just gate them by date when computing `daysActive7d`.
- Extend `getUserProfiles` in `lib/supabase/admin.ts` to also return `last_sign_in_at` and `provider` from the `auth.users` listing it already does. No extra Supabase call needed.

### `GET /api/admin/users/[id]` (drill-down)

Add to response:
```ts
{
  ...existing,
  scoresBySection: {
    writing:   { latest: number | null, previous: number | null, count: number },
    speaking:  { latest: number | null, previous: number | null, count: number },
    reading:   { latest: number | null, previous: number | null, count: number },
    listening: { latest: number | null, previous: number | null, count: number },
  },
  recentErrors: ApiLog[],            // last 20 where metadata.success === false
}
```

Implementation:
- Two new parallel fetches: `reading_submissions(*, reading_feedback(*))` and `listening_submissions(*, listening_feedback(*))`, each `.eq("user_id", userId).order(created_at desc).limit(50)`.
- `latest` and `previous` come from sorting band scores by `created_at desc` and taking [0] and [1].
- `recentErrors` is filtered from the existing `apiLogs` fetch — no new query. Filter: `metadata?.success === false`. Each row's error message comes from `metadata.error` (string).
- The existing `writingSubmissions` and `speakingSubmissions` arrays are unchanged; the new `scoresBySection` is a separate compact summary intended for the overview panel.

## UI changes

### `/admin/users` (list)

Add 5 columns to the table, in this order after current columns:
- **Reading** (sortable, like Writing)
- **Listening** (sortable, like Speaking)
- **Active 7d** (sortable, "X/7" text format — visually distinct from raw counts)
- **Last seen** (sortable, relative time — "2h ago", "3d ago", "—" if null)
- **Provider** (sortable, small pill: G icon for Google, ✉ for email, etc.)

Default sort changes from `joined desc` to `last_sign_in_at desc` — most active users float to the top. (Easy revert if it feels wrong.)

The table is already wide; on small screens it's already horizontally scrollable, so adding 5 columns is acceptable within existing pattern.

### `/admin/users/[id]` (drill-down — overview tab only)

Two additions:

1. **Replace the 5-card stats grid** with a 4×2 grid:
   - Row 1: Writing subs / Speaking subs / Reading subs / Listening subs
   - Row 2: Total API cost / Joined / Last seen / Today's writing
   - Each submission card shows: count + latest band + trend arrow (▲ green / ▼ red / – gray)

2. **New "Recent Errors" section** (collapsible, only shown if `recentErrors.length > 0`), placed between "Practice Sessions" and "Score Trend":
   - Table: time, route/call_type, error message (truncated), HTTP code if present.

No changes to Writing/Speaking/API Usage tabs.

## Edge cases

- **`last_sign_in_at` is null** for users who never logged in after signup confirmation: show "—".
- **Provider is null/unknown:** show "—".
- **Band scores from different sections aren't directly comparable.** We don't aggregate them into one number anywhere — each section card stands alone.
- **A user with 1 submission has no `previous`:** show only latest, no arrow.
- **Days active = 0** is shown as "0/7" not blank, so it sorts correctly and is meaningful (signed up, hasn't practiced).
- **Listening/Reading band scores live in `band_score` column** (not `overall_band` like writing), so the API needs per-section field mapping.
- **`raw_app_meta_data.provider` for users created before email/password existed:** likely all "google". Anything unrecognized renders as the raw string.

## Testing

Manual verification (no automated tests in this codebase yet):
1. Backfilled users (the 4 from the bug) appear in admin list with reading=0, listening=0, sensible last_seen, provider=email.
2. Sort by Last seen — Lina (most active) should be at the top.
3. Sort by Active 7d — same ordering should mostly hold for active users.
4. Click into a user with submissions in 3+ sections — verify all four submission cards render, latest band populates, arrow direction matches intuition.
5. Click into a user known to have errored once (induce one if needed) — verify Recent Errors section appears.
6. Click into a user with zero errors — verify Recent Errors section is hidden, not just empty.
7. CSV export still works and includes new columns.

## Files to touch

- `app/api/admin/users/route.ts` — add reading/listening counts, daysActive7d, last_sign_in_at, provider to response
- `app/api/admin/users/[id]/route.ts` — add reading/listening fetches, scoresBySection, recentErrors
- `lib/supabase/admin.ts` — extend `getUserProfiles` to return last_sign_in_at and provider
- `app/admin/users/page.tsx` — add 5 columns, change default sort, update CSV export
- `app/admin/users/[id]/page.tsx` — restructure stats grid (4×2 with band+arrow), add Recent Errors section
