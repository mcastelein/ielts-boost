# Coach Layer + Onboarding Diagnostic — Design Spec

**Date:** 2026-07-02
**Status:** Draft for review
**Author:** Michael + Claude

---

## 1. Overview

Two tightly-coupled features that turn IELTSBoost from a *reactive grader* ("here's your band") into a *proactive coach* ("here's what to do today, and here's how ready you are").

- **Onboarding Diagnostic** — a full mini-mock (all four sections, ~45 min, resumable and section-independent) taken by new users to establish a measured baseline band per section.
- **Coach layer** — a new default home screen showing a **readiness estimate** (predicted overall band + confidence), an **exam countdown**, and a **daily study plan** ("do these 3 things today") generated from the user's weaknesses, due flashcards, and time to exam.

The diagnostic seeds the coach; the coach is where users live day-to-day. Both are bilingual (EN / 简体中文) and match the Blueprint Lab design language.

### Why these two together
The coach is only as good as the data it has. A brand-new user has no practice history, so the coach would be empty. The diagnostic solves that cold-start by measuring a baseline in one sitting. After that, ongoing practice data refines the readiness estimate over time.

---

## 2. Goals & non-goals

**Goals**
- New users reach a personalized, populated coach home within their first session.
- Every user with an exam date sees a clear "predicted band vs. target, N days out" and a concrete daily action list.
- The daily plan is achievable (≤3 tasks), honest about confidence, and respects free-tier limits.
- Near-zero marginal AI cost: the plan's *selection* is deterministic; AI only writes short encouragement copy, cached once per day.

**Non-goals (this spec)**
- No heavy gamification (badges, points, leaderboards). A gentle streak is allowed but optional and out of scope for v1.
- No new question-authoring tooling — the diagnostic reuses existing content (AI-generated reading passages, existing prompt/track banks).
- No changes to the scoring models themselves.
- Tutor/human-review layer stays out (Phase 3).

---

## 3. Current-state facts this builds on

- **Per-section band storage** (all `numeric(3,1)`): writing `writing_feedback.overall_band`, speaking `speaking_feedback.estimated_band`, reading/listening `*_feedback.band_score`.
- **`lib/dashboard-data.ts`** already exposes `fetch{Writing,Speaking,Reading,Listening}DashboardData(userId, supabase)` → `SectionDashboardData` with `latestScore`, `avgScore`, `trend`, `trendData[]`, `latestSubScores[]`, `weaknesses[]`. The coach consumes these directly.
- **`user_settings`** already has `target_band numeric`, `exam_date date`, `self_level`, `focus text` (csv), `onboarding_completed bool`, `ui_language`, `feedback_language`. Row is created by a Supabase-side trigger on `auth.users` (see [[project_user_settings_trigger]]).
- **AI calls**: `lib/ai.ts` uses `new Anthropic()`, model `claude-sonnet-4-6`, `parseJsonFromModel<T>()`. Logging via `lib/api-logger.ts` `logApiCall({supabase,userId,callType,model,inputTokens,outputTokens,durationMs,metadata})` → `api_usage_log`; the `ApiCallType` union + `COST_RATES` map must be extended for new call types.
- **Usage limits**: `lib/usage.ts`, `FREE_DAILY_*_LIMIT = 3`, table `usage_tracking` keyed `user_id + date`.
- **Auth**: middleware `proxy.ts`, `protectedPaths = ["/dashboard","/history","/settings"]`, logged-in users at `/login` redirect to `/dashboard`. Server pages call `supabase.auth.getUser()`.
- **Onboarding today**: `app/api/onboarding/complete/route.ts` + `components/OnboardingTour.tsx` + a survey that captures `self_level`, `target_band`, `exam_date`, `focus`. The diagnostic *extends* this — the survey gathers target/date/goals; the diagnostic *measures* the baseline.
- **Translations**: `lib/translations.ts`, one object of `key: { en, zh }`, `TranslationKey` inferred.

---

## 4. Feature A — Onboarding Diagnostic

### 4.1 Shape
A full mini-mock: shortened versions of all four sections, ~45–50 minutes total. Per the design decision it is a *full* mock in content, but to defuse the sitting-length bail-out risk it is **resumable and section-independent** — the user can do it in one sitting or one section at a time, and the baseline fills in progressively.

| Section | Content | ~Time | Scoring |
|---|---|---|---|
| Listening | 1 section, ~10 questions | 10 min | Objective, auto-graded → band via raw→band table |
| Reading | 1 AI-generated passage, ~13 questions | 15 min | Objective, auto-graded → band |
| Writing | 1 Task 2 essay | 20 min | AI (`scoreEssay`) → overall band |
| Speaking | Part 2 long-turn (1 cue card) | 5 min | AI scoring of transcript → band |

Total ≈ 50 min ceiling; users rarely do all at once, which is fine.

### 4.2 Flow
1. After signup + existing onboarding survey (target band, exam date, focus), the user lands on the coach home in a **"diagnostic not done"** state with a prominent "Take your diagnostic" card.
2. Starting the diagnostic creates a `diagnostic_sessions` row (`status = 'in_progress'`, `current_section`).
3. The user completes sections in any order. Each finished section is scored and its band stored on the session. Objective sections grade inline; writing/speaking call the existing AI scoring functions.
4. When all four sections are done → `status = 'completed'`, compute baseline overall band (IELTS rounding, §5.2), stamp `completed_at`, write the first `readiness_history` snapshot, and generate the first daily plan.
5. Partial state persists: the coach shows "Resume diagnostic — 2 of 4 sections done" until complete.

### 4.3 Skippable / low-friction
- The diagnostic is **skippable**. If skipped, the coach falls back to `self_level` as a rough baseline at **low confidence** and nudges: "Take your diagnostic for an accurate plan." `self_level` is a coarse label, so `computeReadiness` maps it to an approximate band (e.g. `beginner → 4.5`, `intermediate → 5.5`, `advanced → 6.5` — exact mapping to be confirmed against the survey's actual option values) applied uniformly across sections until real data arrives.
- Because sections are independent, a skipped diagnostic can be resumed anytime; individual sections completed later upgrade the baseline for that section.

### 4.4 Data isolation
Diagnostic answers do **not** create per-section practice submissions, so they never pollute dashboard stats or history. Everything lives in `diagnostic_sessions` (answers in `jsonb`, computed bands in typed columns). Writing/speaking scoring reuses `lib/ai.ts` functions but stores the result on the session, not in `writing_submissions` etc.

---

## 5. Feature B — Coach layer

### 5.1 Readiness estimate (recency-weighted + confidence)

For each section, gather the band values of non-draft sessions ordered by date (from `lib/dashboard-data.ts`), plus the diagnostic baseline if present.

**Recency-weighted section band**
```
weight_i = DECAY ^ rank_i         // rank 0 = most recent, DECAY = 0.7
sectionBand = Σ(weight_i · band_i) / Σ(weight_i)
```
The diagnostic baseline is treated as the *oldest* data point (lowest weight) once real practice exists, so live practice dominates over time; when it's the only data point, it *is* the section band.

**Confidence per section**
- `high` — ≥5 sessions and most recent within 14 days
- `medium` — 2–4 sessions, or ≥5 but stale (>14 days)
- `low` — ≤1 session, or diagnostic-only, or nothing (unassessed)

**Overall predicted band**
- Average the four section bands, then apply **standard IELTS rounding** to the nearest half-band: fractional part `<.25 → .0`, `.25–<.75 → .5`, `≥.75 → next whole`.
- If a section is unassessed (no sessions, no diagnostic), exclude it and flag overall confidence `low` with a nudge to assess it.
- Overall confidence = the *lowest* section confidence among assessed sections (honest: one shaky section makes the whole estimate shaky).

**Gap to target** = `target_band − predicted`. Drives plan prioritization and the headline copy ("0.5 to go").

`readiness_history` snapshots (one per day max, on plan generation) power a small readiness-over-time trend and "up 0.5 in two weeks" messaging.

### 5.2 Exam countdown
- Reads `user_settings.exam_date`. Shows "N days" using the user's local date.
- No date set → a "Set your exam date" prompt instead of a countdown.
- Date in the past → collapses to a gentle "Exam passed — set a new date?" state.
- Inside 7 days, the plan shifts toward timed/full practice and a mock test (§5.3 rule 5).

### 5.3 Daily study plan (hybrid: rules select, AI writes copy)

**Selection — deterministic (`lib/coach-plan.ts` `buildPlan`)**, priority order, capped at 3 tasks/day:
1. **Diagnostic incomplete** → the only task is "Take/resume your diagnostic" (until done).
2. **Weakest assessed section** (largest gap to target; tie-break lowest confidence) → a practice task in that section, deep-linked.
3. **Due flashcards** (from the vocab feature, once built) → "Review N due cards."
4. **Targeted mistake drill** from the top recurring weakness (`weaknesses[]` from dashboard-data).
5. **Exam ≤7 days** → replace one item with a timed full-section or full mock task.
6. **Free-tier awareness** → never plan more submissions in a section than the user's remaining daily quota (`lib/usage.ts`).

Each plan item: `{ type, section, titleKey/params, deepLink, estMinutes, rationale_en, rationale_zh, done }`.

**Copy — AI, cached (`generatePlanCopy`)**: one `claude-sonnet-4-6` call per user per day, given the structured plan + readiness + countdown, returns a short bilingual intro line and a one-line rationale per task. Cached in the `daily_plans` row so it's generated once. New `ApiCallType: "study_plan"` + `COST_RATES` entry; logged via `logApiCall`. **Deterministic fallback copy** (templated bilingual strings) is used if the AI call fails, so the plan always works with zero API dependency.

**Completion**: items can be marked done manually; practice-type items also auto-check when a matching submission is detected that day. Progress ("2 of 3 done") shown on the coach home.

### 5.4 Coach home — information architecture
New page `app/coach/page.tsx` (server component), the post-login landing page. Top → bottom:
1. **Header** — greeting + eyebrow, matching dashboard style.
2. **Readiness panel** — predicted overall band (large mono numeral + Blueprint band-ruler), confidence chip, gap-to-target chip, and the exam countdown beside it. Reuses `components/band-ruler.tsx`.
3. **Today's plan** — the ≤3 task cards with rationale, est. minutes, deep-link CTAs, and done state; progress indicator.
4. **Readiness trend** — small line chart from `readiness_history` (reuses recharts `ScoreTrendChart`).
5. **Jump to full dashboard** — link/tab to the existing score-card dashboard (kept intact for the deep per-section view).

### 5.5 Placement / routing changes
- Add `app/coach/page.tsx`; add `/coach` to `protectedPaths` in `proxy.ts`.
- Change logged-in redirect target `/login → /coach` (proxy.ts) and navbar logo `user ? "/coach" : "/"`.
- Nav: add **Coach** as the first logged-in link; keep **Dashboard** as the detailed score view.
- `components/OnboardingTour.tsx` updated to point new users toward the diagnostic card.

---

## 6. Data model (new)

All tables: `id uuid pk`, `user_id uuid` FK `auth.users`, `created_at timestamptz default now()`, **RLS enabled**, owner-only policies (`user_id = auth.uid()`), mirroring existing tables.

**`diagnostic_sessions`**
- `status text` — `in_progress | completed | abandoned`
- `current_section text` — resume pointer
- `listening_band, reading_band, writing_band, speaking_band numeric(3,1)` (nullable until each is done)
- `overall_band numeric(3,1)` (set on completion)
- `answers jsonb` — per-section raw answers/transcripts/essay text
- `started_at, completed_at timestamptz`

**`daily_plans`**
- `plan_date date` — unique with `user_id`
- `items jsonb` — array of plan items (§5.3)
- `intro_copy_en, intro_copy_zh text`
- `readiness_snapshot jsonb`
- `generated_by text` — `rules | ai` (whether AI copy succeeded)
- unique `(user_id, plan_date)`

**`readiness_history`**
- `snapshot_date date`
- `overall_band numeric(3,1)`, `listening_band, reading_band, writing_band, speaking_band numeric(3,1)`
- `confidence text` — `low | medium | high`
- unique `(user_id, snapshot_date)`

No new `user_settings` columns needed (`target_band`, `exam_date`, `self_level`, `onboarding_completed` already exist). "Diagnostic completed" is derived from the latest `diagnostic_sessions.status`.

---

## 7. API routes

- `POST /api/diagnostic/start` — create/resume an `in_progress` session.
- `POST /api/diagnostic/section` — submit one section; grade (objective inline; writing/speaking via `lib/ai.ts`); store band + answers; advance `current_section`.
- `POST /api/diagnostic/complete` — finalize: compute overall, set `completed`, write first `readiness_history` snapshot, generate first plan, set `onboarding_completed`.
- `GET /api/coach/plan` — return today's plan; if absent, run `buildPlan` + `generatePlanCopy`, persist, return. (Reads user local date.)
- `POST /api/coach/plan/item` — mark an item done.

Readiness itself is computed server-side in the coach page via new `lib/coach-readiness.ts` (`computeReadiness(userId, supabase)`), composed from `lib/dashboard-data.ts` + the latest completed diagnostic.

**New lib modules**
- `lib/coach-readiness.ts` — `computeReadiness()` → `{ sectionBands, overall, confidence, gapToTarget, unassessed[] }`.
- `lib/coach-plan.ts` — `buildPlan(readiness, context)` (deterministic) and `generatePlanCopy(plan, locale)` (AI + fallback).

---

## 8. Bilingual

All UI strings added to `lib/translations.ts` as `key: { en, zh }`. AI-generated plan copy is produced in **both** languages in a single call (store `intro_copy_en` / `intro_copy_zh` and per-item `rationale_en/zh`) so toggling UI language never triggers a re-generation. Diagnostic writing/speaking scoring uses the user's `feedback_language` as elsewhere. Chinese must read naturally, not machine-translated (per product principle).

---

## 9. Security / RLS
- All new tables RLS-enabled, owner-scoped (`user_id = auth.uid()`), matching the existing pattern.
- API routes authenticate via `supabase.auth.getUser()` and operate only on the caller's rows.
- Diagnostic AI scoring counts toward cost logging but **not** toward `usage_tracking` daily limits (a diagnostic shouldn't burn a user's free practice quota).

---

## 10. Edge cases
- **Unassessed section**: excluded from overall; overall confidence forced `low`; plan prioritizes assessing it.
- **No target band**: prompt to set one; default suggestion = current predicted + 1.0.
- **No exam date**: countdown replaced by "set your date" prompt; plan still works.
- **Exam date passed**: gentle reset prompt.
- **Free-tier limits vs. plan**: plan never exceeds remaining quota; if quota exhausted, that task becomes "review" (flashcards/mistake drill) instead of a new submission.
- **AI copy failure**: deterministic fallback copy; `generated_by = 'rules'`.
- **Timezone / "today"**: plan_date and countdown use the user's local date (client-provided date string, validated server-side), consistent with `usage_tracking`'s date handling.
- **Diagnostic abandoned mid-section**: partial bands retained; session resumable; never blocks the coach.

---

## 11. Telemetry
Reuse the existing analytics beacon (`app/api/analytics` + `components/analytics-beacon.tsx`): `diagnostic_started`, `diagnostic_section_completed`, `diagnostic_completed`, `diagnostic_skipped`, `coach_viewed`, `plan_item_completed`. These feed the admin funnel already in place.

---

## 12. Rough build phases
1. **DB migrations** — three tables + RLS; extend `ApiCallType`/`COST_RATES`.
2. **Readiness + coach skeleton** — `lib/coach-readiness.ts`, `readiness_history`, `app/coach/page.tsx` showing readiness + countdown from existing data. *Ships value before the diagnostic exists.*
3. **Daily plan (rules)** — `lib/coach-plan.ts` selection, plan UI, mark-done + auto-detect.
4. **AI plan copy** — `generatePlanCopy` + logging + fallback.
5. **Diagnostic flow** — start/section/complete routes + resumable, section-independent UI.
6. **Wire-up + routing** — diagnostic → baseline → coach; coach as home; nav + proxy.ts + onboarding tour.
7. **Bilingual strings, telemetry, polish.**

Each phase is independently shippable; phase 2 alone already improves the product.

---

## 13. Open questions
- Speaking diagnostic: text transcript only for v1, or require audio? (Depends on whether the voice-Speaking feature lands first — see the missing-features discussion.)
- Should the readiness trend also surface on the existing dashboard, or stay coach-only?
- Streak/daily-goal: in or out for v1? (Currently out; easy to add later as a coach header element.)
