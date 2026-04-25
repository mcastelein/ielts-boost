# Admin Panel User Visibility Additions — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surface reading/listening counts, last-seen, auth provider, days-active, per-section band trends, and recent errors in the admin panel so the operator can see who's actually using IELTSBoost.

**Architecture:** Extend two existing API routes (`/api/admin/users` and `/api/admin/users/[id]`) and the helper `getUserProfiles` to return additional fields, then update two existing client pages to render them. No new tables, no new fetches in `getUserProfiles`, no new database migrations. The `recentErrors` panel reuses the already-fetched `apiLogs` array — filtered, not re-queried.

**Tech Stack:** Next.js 16 App Router, TypeScript, Supabase JS client (server-side), Tailwind CSS v4. The codebase has no automated test runner — verification is manual against the live dev server (`npm run dev`).

**Spec reference:** `docs/superpowers/specs/2026-04-25-admin-panel-additions-design.md`

---

## File Structure

| File | Status | Responsibility |
|---|---|---|
| `lib/supabase/admin.ts` | Modify | Extend `getUserProfiles` return shape with `last_sign_in_at` and `provider`. |
| `app/api/admin/users/route.ts` | Modify | Add reading/listening counts, `daysActive7d`, `last_sign_in_at`, `provider` to each user object. |
| `app/api/admin/users/[id]/route.ts` | Modify | Add reading/listening fetches, build `scoresBySection`, derive `recentErrors`. |
| `app/admin/users/page.tsx` | Modify | Add 5 columns (Reading, Listening, Active 7d, Last seen, Provider); change default sort to `last_sign_in_at desc`; extend CSV export. |
| `app/admin/users/[id]/page.tsx` | Modify | Replace 5-card stats grid with 4×2 grid (band+arrow); add collapsible Recent Errors section. |

Each file has one clear job. Tasks below are sequenced so each commit is independently verifiable in the running app.

---

## Task 1: Extend `getUserProfiles` with `last_sign_in_at` and `provider`

**Files:**
- Modify: `lib/supabase/admin.ts`

This is the foundation — the list endpoint and drill-down endpoint both consume it.

- [ ] **Step 1: Edit `lib/supabase/admin.ts` — update return type and population**

Full file content after edit:

```ts
import { createClient } from "@supabase/supabase-js";

// Service role client for admin operations (accessing auth.users, etc.)
// Requires SUPABASE_SERVICE_ROLE_KEY in .env.local
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export type UserProfile = {
  email: string;
  name: string | null;
  last_sign_in_at: string | null;
  provider: string | null;
};

// Fetch a map of user_id -> profile for a list of user IDs
export async function getUserProfiles(
  userIds: string[]
): Promise<Record<string, UserProfile>> {
  const admin = createAdminClient();
  if (!admin || userIds.length === 0) return {};

  const profiles: Record<string, UserProfile> = {};

  // Supabase admin listUsers has pagination, fetch all
  const { data, error } = await admin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (error || !data?.users) return profiles;

  for (const user of data.users) {
    if (userIds.includes(user.id)) {
      const provider =
        (user.app_metadata?.provider as string | undefined) ??
        (user.app_metadata?.providers?.[0] as string | undefined) ??
        null;
      profiles[user.id] = {
        email: user.email ?? "N/A",
        name:
          user.user_metadata?.full_name ??
          user.user_metadata?.name ??
          null,
        last_sign_in_at: user.last_sign_in_at ?? null,
        provider,
      };
    }
  }

  return profiles;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: no errors related to `lib/supabase/admin.ts`. (The file may surface unrelated TS errors elsewhere — those are not in scope. If you see an error in `app/api/admin/users/route.ts` or the drill-down route caused by the new return shape, that's expected — it gets fixed in Tasks 2 and 4.)

- [ ] **Step 3: Commit**

```bash
git add lib/supabase/admin.ts
git commit -m "Extend getUserProfiles with last_sign_in_at and provider"
```

---

## Task 2: List endpoint — add reading, listening, daysActive7d, last_sign_in_at, provider

**Files:**
- Modify: `app/api/admin/users/route.ts`

- [ ] **Step 1: Edit the GET handler**

Replace the GET handler body (lines 7–71) with:

```ts
export async function GET() {
  const supabase = await createClient();
  const { authorized } = await requireAdmin(supabase);

  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Get all user settings with their usage data
  const { data: settings, error } = await supabase
    .from("user_settings")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = settings?.map((s) => s.user_id) ?? [];

  // Fetch all submission types in parallel — include created_at for daysActive7d
  const [
    { data: writingRows },
    { data: speakingRows },
    { data: readingRows },
    { data: listeningRows },
    { data: apiCosts },
  ] = await Promise.all([
    supabase.from("writing_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("speaking_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("reading_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("listening_submissions").select("user_id, created_at").in("user_id", userIds),
    supabase.from("api_usage_log").select("user_id, estimated_cost_usd").in("user_id", userIds),
  ]);

  // Aggregate
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const countMap: Record<
    string,
    { writing: number; speaking: number; reading: number; listening: number; totalCost: number; activeDays: Set<string> }
  > = {};
  for (const id of userIds) {
    countMap[id] = { writing: 0, speaking: 0, reading: 0, listening: 0, totalCost: 0, activeDays: new Set() };
  }

  const tally = (
    rows: { user_id: string; created_at: string }[] | null,
    key: "writing" | "speaking" | "reading" | "listening"
  ) => {
    for (const r of rows ?? []) {
      const bucket = countMap[r.user_id];
      if (!bucket) continue;
      bucket[key]++;
      if (new Date(r.created_at).getTime() >= sevenDaysAgo) {
        bucket.activeDays.add(r.created_at.slice(0, 10));
      }
    }
  };
  tally(writingRows, "writing");
  tally(speakingRows, "speaking");
  tally(readingRows, "reading");
  tally(listeningRows, "listening");

  for (const a of apiCosts ?? []) {
    if (a.user_id && countMap[a.user_id]) {
      countMap[a.user_id].totalCost += a.estimated_cost_usd ?? 0;
    }
  }

  const profiles = await getUserProfiles(userIds);

  const users = settings?.map((s) => {
    const c = countMap[s.user_id] ?? {
      writing: 0,
      speaking: 0,
      reading: 0,
      listening: 0,
      totalCost: 0,
      activeDays: new Set<string>(),
    };
    return {
      ...s,
      email: profiles[s.user_id]?.email ?? null,
      display_name: profiles[s.user_id]?.name ?? null,
      last_sign_in_at: profiles[s.user_id]?.last_sign_in_at ?? null,
      provider: profiles[s.user_id]?.provider ?? null,
      stats: {
        writing: c.writing,
        speaking: c.speaking,
        reading: c.reading,
        listening: c.listening,
        totalCost: c.totalCost,
        daysActive7d: c.activeDays.size,
      },
    };
  });

  return NextResponse.json({ users });
}
```

(The `PATCH` handler below this is unchanged.)

- [ ] **Step 2: Verify the endpoint by hand**

Run: `npm run dev` (if not already running)
In a browser, log in as admin and visit: `http://localhost:3000/api/admin/users`
Expected JSON: each user object has `last_sign_in_at`, `provider`, and `stats` includes `reading`, `listening`, and `daysActive7d`. For Lina (the most active user), `stats.daysActive7d` should be > 0 and `stats.reading` / `stats.listening` should reflect what's in the database.

Cross-check by querying the DB directly:
```bash
npx supabase db query --linked "SELECT user_id, count(*) FROM public.reading_submissions GROUP BY user_id;"
```
Counts should match `stats.reading` per user.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/users/route.ts
git commit -m "Admin users API: include reading/listening counts, days-active, last seen, provider"
```

---

## Task 3: List UI — 5 new columns, default sort flip, CSV export

**Files:**
- Modify: `app/admin/users/page.tsx`

- [ ] **Step 1: Update the `UserRecord` interface and sort key types**

In `app/admin/users/page.tsx`, change the `UserRecord` interface and the `SortKey` type at the top:

```ts
interface UserRecord {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  ui_language: string;
  feedback_language: string;
  plan_type: string;
  role: string;
  created_at: string;
  last_sign_in_at: string | null;
  provider: string | null;
  stats: {
    writing: number;
    speaking: number;
    reading: number;
    listening: number;
    totalCost: number;
    daysActive7d: number;
  };
}

type SortKey =
  | "name"
  | "role"
  | "plan"
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "active7d"
  | "lastSeen"
  | "provider"
  | "cost"
  | "joined";
type SortDir = "asc" | "desc";
```

- [ ] **Step 2: Change the default sort from `joined` to `lastSeen`**

In the same file, find:

```ts
const [sortKey, setSortKey] = useState<SortKey>("joined");
const [sortDir, setSortDir] = useState<SortDir>("desc");
```

Change to:

```ts
const [sortKey, setSortKey] = useState<SortKey>("lastSeen");
const [sortDir, setSortDir] = useState<SortDir>("desc");
```

- [ ] **Step 3: Add new sort cases**

Find the sort `switch (sortKey)` block. Add these cases (alongside the existing `writing`, `speaking`, `cost`, `joined` cases):

```ts
case "reading":
  cmp = a.stats.reading - b.stats.reading;
  break;
case "listening":
  cmp = a.stats.listening - b.stats.listening;
  break;
case "active7d":
  cmp = a.stats.daysActive7d - b.stats.daysActive7d;
  break;
case "lastSeen": {
  const av = a.last_sign_in_at ? new Date(a.last_sign_in_at).getTime() : 0;
  const bv = b.last_sign_in_at ? new Date(b.last_sign_in_at).getTime() : 0;
  cmp = av - bv;
  break;
}
case "provider":
  cmp = (a.provider ?? "").localeCompare(b.provider ?? "");
  break;
```

- [ ] **Step 4: Add a `formatRelative` helper above the component return**

Just above the `if (loading)` line, add:

```ts
const formatRelative = (iso: string | null): string => {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const providerLabel = (p: string | null): string => {
  if (!p) return "—";
  if (p === "google") return "Google";
  if (p === "email") return "Email";
  return p.charAt(0).toUpperCase() + p.slice(1);
};
```

- [ ] **Step 5: Add 5 new column headers and cells in the table**

Find the `<thead>` block. Insert the new `<SortHeader>` entries — Reading after Writing, Listening after Speaking, then Active 7d, Last seen, Provider before the existing Languages column:

```tsx
<thead>
  <tr className="border-b border-gray-200 text-left text-gray-500">
    <th className="px-4 py-3">
      <input
        type="checkbox"
        checked={paginated.length > 0 && selectedIds.size === paginated.length}
        onChange={toggleSelectAll}
        className="rounded border-gray-300"
      />
    </th>
    <SortHeader label="User" sortKeyVal="name" />
    <SortHeader label="Role" sortKeyVal="role" />
    <SortHeader label="Plan" sortKeyVal="plan" />
    <SortHeader label="Writing" sortKeyVal="writing" />
    <SortHeader label="Speaking" sortKeyVal="speaking" />
    <SortHeader label="Reading" sortKeyVal="reading" />
    <SortHeader label="Listening" sortKeyVal="listening" />
    <SortHeader label="Active 7d" sortKeyVal="active7d" />
    <SortHeader label="Last seen" sortKeyVal="lastSeen" />
    <SortHeader label="Provider" sortKeyVal="provider" />
    <SortHeader label="API Cost" sortKeyVal="cost" />
    <th className="px-4 py-3">Languages</th>
    <SortHeader label="Joined" sortKeyVal="joined" />
  </tr>
</thead>
```

Then in the corresponding `<tbody>` row mapping, find the existing cell sequence (Writing, Speaking, API Cost, Languages, Joined) and insert the new cells in matching positions. The full updated `<tr>` should look like:

```tsx
<tr key={user.id} className="border-b border-gray-50">
  <td className="px-4 py-3">
    <input
      type="checkbox"
      checked={selectedIds.has(user.user_id)}
      onChange={() => toggleSelect(user.user_id)}
      className="rounded border-gray-300"
    />
  </td>
  <td
    className="cursor-pointer px-4 py-3 hover:bg-gray-50"
    onClick={() => router.push(`/admin/users/${user.user_id}`)}
  >
    <div className="text-sm font-medium text-blue-600 hover:text-blue-800">
      {user.display_name ?? user.email ?? "Unknown"}
    </div>
    <div className="text-xs text-gray-500">
      {user.email ?? user.user_id.slice(0, 12) + "..."}
    </div>
  </td>
  <td className="px-4 py-3">
    <select
      value={user.role ?? "user"}
      onChange={(e) => updateUser(user.user_id, "role", e.target.value)}
      disabled={updating === user.user_id}
      className={`rounded border border-gray-300 px-2 py-1 text-xs ${
        (user.role ?? "user") === "admin"
          ? "bg-blue-50 font-medium text-blue-700"
          : "text-gray-700"
      }`}
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  </td>
  <td className="px-4 py-3">
    <select
      value={user.plan_type ?? "free"}
      onChange={(e) => updateUser(user.user_id, "plan_type", e.target.value)}
      disabled={updating === user.user_id}
      className={`rounded border border-gray-300 px-2 py-1 text-xs ${
        user.plan_type === "pro"
          ? "bg-green-50 font-medium text-green-700"
          : "text-gray-700"
      }`}
    >
      <option value="free">Free</option>
      <option value="pro">Pro</option>
    </select>
  </td>
  <td className="px-4 py-3 text-gray-600">{user.stats.writing}</td>
  <td className="px-4 py-3 text-gray-600">{user.stats.speaking}</td>
  <td className="px-4 py-3 text-gray-600">{user.stats.reading}</td>
  <td className="px-4 py-3 text-gray-600">{user.stats.listening}</td>
  <td className="px-4 py-3 text-gray-600">{user.stats.daysActive7d}/7</td>
  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
    {formatRelative(user.last_sign_in_at)}
  </td>
  <td className="px-4 py-3">
    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
      {providerLabel(user.provider)}
    </span>
  </td>
  <td className="px-4 py-3 text-gray-600">{formatCost(user.stats.totalCost)}</td>
  <td className="px-4 py-3 text-xs text-gray-500">
    UI: {user.ui_language} / FB: {user.feedback_language}
  </td>
  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
    {new Date(user.created_at).toLocaleDateString()}
  </td>
</tr>
```

- [ ] **Step 6: Update the CSV export to include the new fields**

In the same file, find the "Export CSV" button's `onClick` and replace its body with:

```tsx
onClick={() => {
  downloadCsv(
    "users-export.csv",
    [
      "Email",
      "Name",
      "Role",
      "Plan",
      "Writing",
      "Speaking",
      "Reading",
      "Listening",
      "Active 7d",
      "Last seen",
      "Provider",
      "API Cost",
      "UI Lang",
      "FB Lang",
      "Joined",
      "User ID",
    ],
    filtered.map((u) => [
      u.email ?? "",
      u.display_name ?? "",
      u.role ?? "user",
      u.plan_type ?? "free",
      String(u.stats.writing),
      String(u.stats.speaking),
      String(u.stats.reading),
      String(u.stats.listening),
      String(u.stats.daysActive7d),
      u.last_sign_in_at ?? "",
      u.provider ?? "",
      u.stats.totalCost.toFixed(4),
      u.ui_language,
      u.feedback_language,
      new Date(u.created_at).toISOString().split("T")[0],
      u.user_id,
    ])
  );
}}
```

And update the "Export Selected" button (further down) similarly:

```tsx
const exportSelected = () => {
  const selected = filtered.filter((u) => selectedIds.has(u.user_id));
  downloadCsv(
    "selected-users.csv",
    [
      "Email",
      "Name",
      "Role",
      "Plan",
      "Writing",
      "Speaking",
      "Reading",
      "Listening",
      "Active 7d",
      "Last seen",
      "Provider",
      "API Cost",
      "Joined",
      "User ID",
    ],
    selected.map((u) => [
      u.email ?? "",
      u.display_name ?? "",
      u.role ?? "user",
      u.plan_type ?? "free",
      String(u.stats.writing),
      String(u.stats.speaking),
      String(u.stats.reading),
      String(u.stats.listening),
      String(u.stats.daysActive7d),
      u.last_sign_in_at ?? "",
      u.provider ?? "",
      u.stats.totalCost.toFixed(4),
      new Date(u.created_at).toISOString().split("T")[0],
      u.user_id,
    ])
  );
};
```

- [ ] **Step 7: Verify in browser**

Visit `http://localhost:3000/admin/users` (logged in as admin). Confirm:
- 5 new columns appear in the order listed.
- Default sort is "Last seen" descending — Lina (most active) is at the top.
- Clicking Reading / Listening / Active 7d headers sorts as expected (the arrow indicator flips).
- The 4 backfilled email/password users show provider = "Email".
- The "—" placeholder appears in Last seen / Provider for any user with null values.
- "Export CSV" downloads a file containing the new column headers.

- [ ] **Step 8: Commit**

```bash
git add app/admin/users/page.tsx
git commit -m "Admin users page: add reading/listening/active/last-seen/provider columns and sorts"
```

---

## Task 4: Drill-down endpoint — reading/listening, scoresBySection, recentErrors

**Files:**
- Modify: `app/api/admin/users/[id]/route.ts`

- [ ] **Step 1: Add the two new parallel fetches**

In the `Promise.all` array (around line 26), add two more fetches after the existing `speakingSubs` fetch:

```ts
supabase
  .from("reading_submissions")
  .select("*, reading_feedback(*)")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(50),
supabase
  .from("listening_submissions")
  .select("*, listening_feedback(*)")
  .eq("user_id", userId)
  .order("created_at", { ascending: false })
  .limit(50),
```

And destructure them in the assignment:

```ts
const [
  { data: settings },
  { data: writingSubs },
  { data: speakingSubs },
  { data: readingSubs },
  { data: listeningSubs },
  { data: apiLogs },
  { data: usageTracking },
  profiles,
] = await Promise.all([ /* ... unchanged order with the two new fetches inserted ... */ ]);
```

(Keep the same array order: settings, writingSubs, speakingSubs, readingSubs, listeningSubs, apiLogs, usageTracking, profiles.)

- [ ] **Step 2: Build `scoresBySection` from the four submission arrays**

After the existing `mistakeCategories` block but before the `scoreTrend` block (around line 93), add:

```ts
type SectionRow = {
  created_at: string;
  band: number | null;
};

const collectScores = (
  rows: Record<string, unknown>[] | null,
  feedbackKey: string,
  bandField: string
): { latest: number | null; previous: number | null; count: number } => {
  if (!rows) return { latest: null, previous: null, count: 0 };

  const scored: SectionRow[] = rows
    .map((r) => {
      const fb = (r[feedbackKey] as Record<string, unknown>[] | undefined)?.[0];
      const raw = fb?.[bandField];
      const band = typeof raw === "number" ? raw : raw != null ? Number(raw) : null;
      return { created_at: r.created_at as string, band };
    })
    .filter((r) => r.band != null && !Number.isNaN(r.band))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return {
    latest: scored[0]?.band ?? null,
    previous: scored[1]?.band ?? null,
    count: scored.length,
  };
};

const scoresBySection = {
  writing: collectScores(writingSubs as Record<string, unknown>[] | null, "writing_feedback", "overall_band"),
  speaking: collectScores(speakingSubs as Record<string, unknown>[] | null, "speaking_feedback", "estimated_band"),
  reading: collectScores(readingSubs as Record<string, unknown>[] | null, "reading_feedback", "band_score"),
  listening: collectScores(listeningSubs as Record<string, unknown>[] | null, "listening_feedback", "band_score"),
};
```

- [ ] **Step 3: Build `recentErrors` from existing `apiLogs`**

Just after `scoresBySection`, add:

```ts
const recentErrors = (apiLogs ?? [])
  .filter((log) => {
    const meta = log.metadata as Record<string, unknown> | null | undefined;
    return meta?.success === false;
  })
  .slice(0, 20);
```

- [ ] **Step 4: Add both to the response**

In the `return NextResponse.json({ ... })` block at the bottom, add the two new fields just before the closing brace:

```ts
return NextResponse.json({
  user: { /* unchanged */ },
  writingSubmissions: writingSubs ?? [],
  speakingSubmissions: speakingSubs ?? [],
  apiUsage: { /* unchanged */ },
  sessions: { /* unchanged */ },
  usageToday: usageTracking?.[0] ?? null,
  mistakePatterns: /* unchanged */,
  scoreTrend,
  scoresBySection,
  recentErrors,
});
```

- [ ] **Step 5: Verify the endpoint**

Visit `http://localhost:3000/api/admin/users/<a-user-id>` in the browser (use Lina's id from the user list).
Expected: JSON includes `scoresBySection` with four keys (writing, speaking, reading, listening), each having `latest`, `previous`, `count`. Also includes `recentErrors` (likely a small array — the 5 known 529 errors are on a specific user from 2026-04-13, so try that user's id too).

- [ ] **Step 6: Commit**

```bash
git add app/api/admin/users/[id]/route.ts
git commit -m "Admin user-detail API: include reading/listening, scoresBySection, recentErrors"
```

---

## Task 5: Drill-down UI — 4×2 stats grid + Recent Errors section

**Files:**
- Modify: `app/admin/users/[id]/page.tsx`

- [ ] **Step 1: Extend the `UserDetail` interface**

Add the two new fields:

```ts
interface UserDetail {
  user: { /* unchanged, but add: */
    user_id: string;
    email: string | null;
    display_name: string | null;
    role: string;
    plan_type: string;
    ui_language: string;
    feedback_language: string;
    created_at: string;
    last_sign_in_at?: string | null;
  };
  writingSubmissions: WritingSub[];
  speakingSubmissions: SpeakingSub[];
  apiUsage: { /* unchanged */ };
  sessions: { /* unchanged */ };
  usageToday: { writing_count: number; speaking_count: number } | null;
  mistakePatterns: [string, number][];
  scoreTrend: { date: string; overall: number; task: number; coherence: number; lexical: number; grammar: number }[];
  scoresBySection: {
    writing: { latest: number | null; previous: number | null; count: number };
    speaking: { latest: number | null; previous: number | null; count: number };
    reading: { latest: number | null; previous: number | null; count: number };
    listening: { latest: number | null; previous: number | null; count: number };
  };
  recentErrors: ApiLog[];
}
```

(Note: `user.last_sign_in_at` isn't returned by the drill-down endpoint today — Task 4 doesn't add it because it's already on the list page. Mark optional and use a fallback in display.)

- [ ] **Step 2: Add a `SubCard` helper component above the main component**

Just above `export default function UserDetailPage`, add:

```tsx
function SubCard({
  label,
  count,
  scores,
}: {
  label: string;
  count: number;
  scores: { latest: number | null; previous: number | null; count: number };
}) {
  const { latest, previous } = scores;
  let arrow: { symbol: string; color: string } | null = null;
  if (latest != null && previous != null) {
    if (latest > previous) arrow = { symbol: "▲", color: "text-green-600" };
    else if (latest < previous) arrow = { symbol: "▼", color: "text-red-600" };
    else arrow = { symbol: "–", color: "text-gray-400" };
  }
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{count}</p>
      <p className="mt-1 text-xs text-gray-600">
        {latest != null ? (
          <>
            Band {latest.toFixed(1)}{" "}
            {arrow && <span className={arrow.color}>{arrow.symbol}</span>}
          </>
        ) : (
          <span className="text-gray-400">no scores yet</span>
        )}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Replace the existing 5-card stats grid**

Find the `<div className="grid grid-cols-2 gap-4 sm:grid-cols-5">` block in the Overview tab (around line 170). Destructure the new fields at the top of the component first:

```ts
const { user, writingSubmissions, speakingSubmissions, apiUsage, sessions, usageToday, mistakePatterns, scoreTrend, scoresBySection, recentErrors } = data;
```

Then replace the grid with two rows (4×2):

```tsx
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  <SubCard label="Writing Subs" count={writingSubmissions.length} scores={scoresBySection.writing} />
  <SubCard label="Speaking Subs" count={speakingSubmissions.length} scores={scoresBySection.speaking} />
  <SubCard label="Reading Subs" count={scoresBySection.reading.count} scores={scoresBySection.reading} />
  <SubCard label="Listening Subs" count={scoresBySection.listening.count} scores={scoresBySection.listening} />
</div>
<div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Total API Cost</p>
    <p className="text-xl font-bold text-gray-900">{fmt(apiUsage.totalCost)}</p>
  </div>
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Joined</p>
    <p className="text-sm font-bold text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
  </div>
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Last seen</p>
    <p className="text-sm font-bold text-gray-900">
      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}
    </p>
  </div>
  <div className="rounded-lg border border-gray-200 bg-white p-4">
    <p className="text-sm text-gray-500">Today&apos;s Writing</p>
    <p className="text-xl font-bold text-gray-900">{usageToday?.writing_count ?? 0}</p>
  </div>
</div>
```

(Note: reading and listening submissions aren't returned by the drill-down endpoint as full arrays — only the summary `scoresBySection.{reading,listening}.count`. We use that count for the card. If you need the full arrays later, add them to the response in a follow-up task.)

- [ ] **Step 4: Add the Recent Errors section**

Insert this block in the Overview tab, between the Practice Sessions block and the Score Trend block (after the closing `)}` of the sessions conditional):

```tsx
{recentErrors.length > 0 && (
  <details className="rounded-lg border border-red-200 bg-white">
    <summary className="cursor-pointer border-b border-red-200 px-4 py-3 font-medium text-red-700">
      Recent Errors ({recentErrors.length})
    </summary>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-gray-500">
            <th className="px-4 py-2">Time</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Error</th>
          </tr>
        </thead>
        <tbody>
          {recentErrors.map((log) => {
            const meta = (log as unknown as { metadata?: { error?: string } }).metadata;
            return (
              <tr key={log.id} className="border-b border-gray-50">
                <td className="whitespace-nowrap px-4 py-2 text-gray-600">
                  {new Date(log.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 text-gray-900">
                  {CALL_TYPE_LABELS[log.call_type] ?? log.call_type}
                </td>
                <td className="px-4 py-2 text-xs text-red-700 line-clamp-2">
                  {meta?.error ?? "(no message)"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </details>
)}
```

- [ ] **Step 5: Reload the user-detail page and verify visually**

In the browser:
- Click into Lina (or any active user) from the users list.
- Confirm the stats grid now shows 4 submission cards on top (Writing/Speaking/Reading/Listening) with band + arrow, and 4 meta cards on the bottom (Cost/Joined/Last seen/Today's Writing).
- For a user with one submission in a section, confirm the card shows "Band X.X" with no arrow.
- For a section with zero submissions, confirm "no scores yet" appears.
- Click into a user known to have errors (look for one with errored entries — the user with the 529s on 2026-04-13 is a known case). Confirm the red-bordered "Recent Errors" `<details>` appears, expandable, with the error column populated.
- Click into a user with zero errors. Confirm the Recent Errors section is fully hidden, not just empty.

- [ ] **Step 6: Commit**

```bash
git add app/admin/users/[id]/page.tsx
git commit -m "Admin user-detail page: 4x2 stats grid with band+arrow, Recent Errors section"
```

---

## Final Verification (Manual)

After all 5 tasks complete, walk through the spec's testing section:

- [ ] **Step 1: Backfilled users visible**
  Visit `/admin/users`. The 4 backfilled email/password users (tangbei417@163.com, 3289109350@qq.com, 2968042856@qq.com, 3354463268@qq.com) should appear with `Reading=0`, `Listening=0`, `Provider=Email`.

- [ ] **Step 2: Sort by Last seen**
  Verify Lina (or whoever you remember as most active) is at the top of the default-sorted list.

- [ ] **Step 3: Sort by Active 7d**
  Click the Active 7d header. Active users should float to the top.

- [ ] **Step 4: Drill-down on multi-section user**
  Click a user with submissions in 3+ sections. Verify all four submission cards render, latest band is populated, arrow direction matches the trend (compare against the existing Score Trend chart for sanity).

- [ ] **Step 5: Drill-down with errors**
  Click into a user with logged errors. Verify the Recent Errors panel appears and is expandable.

- [ ] **Step 6: Drill-down without errors**
  Click into a user without errors. Verify the Recent Errors section is hidden.

- [ ] **Step 7: CSV export**
  Click "Export CSV" — confirm the downloaded file contains the new columns (Reading, Listening, Active 7d, Last seen, Provider) with sensible values.
