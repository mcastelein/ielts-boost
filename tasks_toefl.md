# TOEFLBoost — Task List

> Clone IELTSBoost into `../toefl-boost` and adapt everything for the TOEFL iBT exam.
> TOEFL uses a 0–30 scoring scale, different task types, and different scoring criteria.

---

## Phase 0 — Project Setup

- [ ] Copy entire IELTSBoost codebase into `../toefl-boost`
- [ ] Update `package.json` — name to `toefl-boost`
- [ ] Create new Supabase project for TOEFLBoost (or decide on shared vs separate)
- [ ] Update `.env.local` with new Supabase keys
- [ ] Update `next.config.ts` if needed
- [ ] Verify `npm install` and `npm run dev` works on the copy
- [ ] Initialize fresh git repo in toefl-boost

---

## Phase 1 — Branding & UI Text

### Layout & Metadata
- [ ] `app/layout.tsx` — title from "IELTSBoost" → "TOEFLBoost", description updated for TOEFL
- [ ] `app/page.tsx` — landing page: "IELTS" → "TOEFL", update tagline and CTA text
- [ ] `components/navbar.tsx` — brand name, any IELTS references in nav links
- [ ] `components/footer.tsx` — brand references

### Translations (`lib/translations.ts`)
- [ ] Global find-replace: "IELTS" → "TOEFL", "雅思" → "托福"
- [ ] `nav_guide` — "IELTS Guide" → "TOEFL Guide" / "雅思指南" → "托福指南"
- [ ] `login_tagline` — update for TOEFL
- [ ] All writing-related labels: update "band" → "score" terminology
- [ ] All speaking-related labels: update band references → TOEFL score references
- [ ] Dashboard labels: "Latest Band" → "Latest Score", etc.
- [ ] History labels: update any band references
- [ ] Upgrade page text: update IELTS references
- [ ] Guide page: completely rewrite for TOEFL
- [ ] Feedback page text

### Static Pages
- [ ] `app/guide/page.tsx` — rewrite entirely for TOEFL exam structure
- [ ] `app/upgrade/page.tsx` — update product description
- [ ] `app/upgrade/success/page.tsx` — update text
- [ ] `app/welcome-to-pro/page.tsx` — update text
- [ ] `app/privacy/page.tsx` — update product name
- [ ] `app/terms/page.tsx` — update product name
- [ ] `app/refund/page.tsx` — update product name
- [ ] `app/feedback/page.tsx` — update product name

---

## Phase 2 — Scoring System Overhaul (0–9 bands → 0–30 scores)

### Core difference: TOEFL scores
- Writing: 0–30 total (scored 0–5 per task by rubric, scaled to 0–30)
- Speaking: 0–30 total (scored 0–4 per task by rubric, scaled to 0–30)
- TOEFL Writing criteria: Development, Organization, Language Use
- TOEFL Speaking criteria: Delivery, Language Use, Topic Development

### AI Scoring (`lib/ai.ts`)
- [ ] Rewrite `SCORING_PROMPT_EN` for TOEFL Writing rubric
  - Score 0–5 per task (not 0–9 band)
  - Criteria: Development, Organization, Language Use (not Task Achievement, Coherence, Lexical, Grammar)
  - Different expectations for Integrated vs Independent tasks
- [ ] Rewrite `SCORING_PROMPT_ZH` — same changes in Chinese
- [ ] Update JSON return structure:
  - `overall_band` → `overall_score` (0–5 raw, 0–30 scaled)
  - `task_score` → `development_score`
  - `coherence_score` → `organization_score`
  - `lexical_score` + `grammar_score` → `language_use_score`
  - Add `scaled_score` field (0–30)
- [ ] Update `scoreEssay()` function signature and return type
- [ ] Update user content message: "IELTS Writing Task 1/2" → "TOEFL Integrated/Independent/Academic Discussion"

### Speaking API (`app/api/speaking/route.ts`)
- [ ] Rewrite `SPEAKING_SYSTEM_PROMPT_EN` for TOEFL Speaking rubric
  - Score 0–4 per task (not 0–9)
  - Criteria: Delivery, Language Use, Topic Development
  - 4 task types (not 3 parts)
- [ ] Rewrite `SPEAKING_SYSTEM_PROMPT_ZH`
- [ ] Update JSON structure:
  - `estimated_band` → `task_score` (0–4)
  - `fluency_score` → `delivery_score`
  - `lexical_score` + `grammar_score` → `language_use_score`
  - `pronunciation_score` → keep but reframe for TOEFL
  - Add `topic_development_score`
  - Add `scaled_score` (0–30)
- [ ] Update user content: "IELTS Speaking Part" → "TOEFL Speaking Task"

### Score API (`app/api/score/route.ts`)
- [ ] Update field names in database insert to match new schema
- [ ] Update feedback field mapping

---

## Phase 3 — Writing Module Adaptation

### TOEFL Writing has 3 task types (not 2):
1. **Integrated Task** — read a passage, listen to a lecture, write a response (150–225 words)
2. **Independent Task** — opinion essay (300+ words) — being phased out
3. **Academic Discussion** — read a professor's question + student responses, contribute (100+ words) — NEW format

### Writing Prompts (`lib/writing-prompts.ts`)
- [ ] Replace all IELTS prompts with TOEFL prompts
- [ ] Change `taskType: "task1" | "task2"` → `taskType: "integrated" | "independent" | "academic_discussion"`
- [ ] Integrated Task prompts: include reading passage + lecture summary
- [ ] Independent Task prompts: opinion-based essay questions
- [ ] Academic Discussion prompts: professor question + 2 student responses + user prompt
- [ ] Update `WritingPrompt` interface for TOEFL structure
- [ ] Update `USED_PROMPTS_KEY` from `ieltsboost_used_prompts` → `toeflboost_used_prompts`
- [ ] Write 10-15 prompts per task type

### Writing Page (`app/writing/page.tsx`)
- [ ] Update task type selector: Task 1/Task 2 → Integrated/Independent/Academic Discussion
- [ ] For Integrated Task: show reading passage above writing area
- [ ] For Academic Discussion: show professor question + student responses above writing area
- [ ] Update word count guidance (150–225 for integrated, 300+ for independent, 100+ for academic discussion)
- [ ] Update any "band" references in UI

### Writing Detail (`app/writing/[id]/writing-detail-client.tsx`)
- [ ] Update score display from band (0–9) to TOEFL scale (0–5 raw + 0–30 scaled)
- [ ] Update criteria labels
- [ ] Update score visualization

### Writing Feedback Display
- [ ] Update all components showing band scores → TOEFL scores
- [ ] Update criteria names in feedback display

---

## Phase 4 — Speaking Module Adaptation

### TOEFL Speaking has 4 tasks (not 3 parts):
1. **Task 1 (Independent)** — personal preference/opinion (45 sec)
2. **Task 2 (Integrated: Campus)** — read + listen + speak (60 sec)
3. **Task 3 (Integrated: Academic)** — read + listen + speak (60 sec)
4. **Task 4 (Integrated: Academic Lecture)** — listen + speak (60 sec)

### Speaking Prompts (`lib/speaking-prompts.ts`)
- [ ] Replace all IELTS prompts with TOEFL prompts
- [ ] Change `part: 1 | 2 | 3` → `task: 1 | 2 | 3 | 4`
- [ ] Task 1: opinion/preference questions
- [ ] Task 2: campus situation (reading + conversation summary)
- [ ] Task 3: academic concept (reading + lecture summary)
- [ ] Task 4: academic lecture summary
- [ ] Update `SpeakingPrompt` interface
- [ ] Update `USED_SPEAKING_KEY` from `ieltsboost_used_speaking` → `toeflboost_used_speaking`
- [ ] Write 8-10 prompts per task type

### Speaking Page (`app/speaking/page.tsx`)
- [ ] Update task selector: Part 1/2/3 → Task 1/2/3/4
- [ ] For integrated tasks: show reading passage and/or listening summary
- [ ] Update timer: 45 sec for Task 1, 60 sec for Tasks 2-4
- [ ] Update response time expectations

### Speaking Detail (`app/speaking/[id]/speaking-detail-client.tsx`)
- [ ] Update score display (0–4 per task, 0–30 scaled)
- [ ] Update criteria labels (Delivery, Language Use, Topic Development)
- [ ] Update score visualization

---

## Phase 5 — Database Schema Changes

### Writing tables
- [ ] `writing_feedback`: rename columns
  - `overall_band` → `overall_score`
  - `task_score` → `development_score`
  - `coherence_score` → `organization_score`
  - `lexical_score` → `language_use_score`
  - Remove `grammar_score` (merged into language_use)
  - Add `scaled_score` (0–30)
- [ ] `writing_submissions`: update `task_type` allowed values

### Speaking tables
- [ ] `speaking_feedback`: rename columns
  - `estimated_band` → `task_score`
  - `fluency_score` → `delivery_score`
  - `lexical_score` → `language_use_score`
  - `grammar_score` → `topic_development_score`
  - `pronunciation_score` — remove or keep as secondary
  - Add `scaled_score` (0–30)
- [ ] `speaking_submissions`: `part` → `task_number`

### Migrations
- [ ] Write fresh Supabase migrations for TOEFLBoost schema
- [ ] Update `DATABASE_SCHEMA.md` for TOEFL

---

## Phase 6 — Dashboard Adaptation

### Dashboard Data (`lib/dashboard-data.ts`)
- [ ] Update all "band" references → "score"
- [ ] Update score range logic (0–9 → 0–5 raw or 0–30 scaled)
- [ ] Update criteria names in analytics queries

### Dashboard Components
- [ ] `components/dashboard/DashboardClient.tsx` — update labels and score ranges
- [ ] `components/dashboard/ScoreCard.tsx` — update for 0–30 scale
- [ ] `components/dashboard/ScoreTrendChart.tsx` — update Y-axis range
- [ ] `components/dashboard/SubScoreBarChart.tsx` — update criteria names and ranges
- [ ] `components/dashboard/WritingDetail.tsx` — update criteria labels
- [ ] `components/dashboard/SpeakingDetail.tsx` — update criteria labels
- [ ] `components/dashboard/Encouragement.tsx` — update any IELTS-specific encouragement text
- [ ] `components/TaskChart.tsx` — update if IELTS-specific

---

## Phase 7 — History & Detail Pages

- [ ] `app/history/history-client.tsx` — update band display → score display
- [ ] `app/history/page.tsx` — update any IELTS references
- [ ] Writing detail page — score labels and ranges
- [ ] Speaking detail page — score labels and ranges

---

## Phase 8 — Admin Panel

- [ ] `app/admin/` — update all IELTS references to TOEFL
- [ ] Admin submissions view — update score column labels
- [ ] Admin users view — update any band references
- [ ] Admin stats — update for TOEFL scoring

---

## Phase 9 — Stripe & Payments

- [ ] Create new Stripe product for TOEFLBoost
- [ ] Update payment link / price ID in environment variables
- [ ] Update upgrade page pricing copy
- [ ] Decide: same or different pricing as IELTSBoost (200 RMB/month?)

---

## Phase 10 — Documentation & Config

- [ ] Write new `CLAUDE.md` for TOEFLBoost project
- [ ] Update `README.md`
- [ ] Update `AI_PROMPTS.md` with TOEFL prompts
- [ ] Update `DATABASE_SCHEMA.md`
- [ ] Update `BUILD_PLAN.md`
- [ ] Update `APP_FLOW.md`
- [ ] Remove IELTSBoost task files (tasks_writing.md, tasks_speaking.md, etc.)

---

## Phase 11 — Testing & Polish

- [ ] Test writing flow — all 3 task types
- [ ] Test speaking flow — all 4 task types
- [ ] Test OCR/image upload still works
- [ ] Test bilingual support (EN/ZH) — all TOEFL terminology correct
- [ ] Test dashboard with TOEFL scores
- [ ] Test history page
- [ ] Test auth flow
- [ ] Test usage limits
- [ ] Test Stripe upgrade flow
- [ ] Mobile responsiveness check

---

## Key IELTS → TOEFL Differences Summary

| Aspect | IELTS | TOEFL iBT |
|---|---|---|
| **Score scale** | 0–9 bands (0.5 increments) | 0–30 per section |
| **Writing tasks** | Task 1 (report) + Task 2 (essay) | Integrated + Independent + Academic Discussion |
| **Writing criteria** | Task Achievement, Coherence & Cohesion, Lexical Resource, Grammar | Development, Organization, Language Use |
| **Writing raw score** | 0–9 | 0–5 (scaled to 0–30) |
| **Speaking parts** | Part 1 (intro), Part 2 (long turn), Part 3 (discussion) | Task 1 (independent) + Tasks 2-4 (integrated) |
| **Speaking criteria** | Fluency & Coherence, Lexical Resource, Grammar, Pronunciation | Delivery, Language Use, Topic Development |
| **Speaking raw score** | 0–9 | 0–4 (scaled to 0–30) |
| **Speaking format** | Conversation with examiner | Record responses to prompts |
| **Brand name** | IELTSBoost | TOEFLBoost |
| **Chinese name** | 雅思 | 托福 |
| **Primary color** | Blue (#2563eb) | TBD (suggest orange/red to differentiate?) |
