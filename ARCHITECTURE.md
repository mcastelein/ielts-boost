# IELTSBoost — Architecture & Tooling Overview

> Temporary reference document. Delete when no longer needed.

---

## Stack at a Glance

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS 4 (PostCSS plugin, no config file) |
| Database | Supabase — PostgreSQL, Auth, Storage |
| AI / LLM | Anthropic Claude (`claude-sonnet-4-6`) — scoring, feedback, OCR |
| Audio | OpenAI Whisper (speech-to-text) + TTS-1 Nova (audio generation) |
| Payments | Stripe (webhooks + customer portal) |
| Analytics | Vercel Analytics + Speed Insights |
| Testing | Playwright (port 3099) |
| Linting | ESLint 9 + TypeScript 5 strict mode |

---

## Repository Layout

```
ielts-boost/
├── app/                    # Next.js App Router pages + API routes
│   ├── page.tsx            # Landing page
│   ├── layout.tsx          # Root layout
│   ├── dashboard/          # User dashboard
│   ├── writing/[id]/       # Writing practice
│   ├── speaking/[id]/      # Speaking practice
│   ├── reading/[id]/       # Reading practice
│   ├── listening/[id]/     # Listening practice
│   ├── history/            # Submission history
│   ├── settings/           # User settings
│   ├── upgrade/            # Stripe upgrade flow
│   ├── admin/              # Admin dashboard (users, submissions, logs)
│   ├── auth/               # Supabase auth callbacks
│   └── api/                # API route handlers
│       ├── writing/        # Writing submission + scoring
│       ├── speaking/       # Speaking + transcribe/ + tts/
│       ├── reading/        # Reading scoring
│       ├── listening/      # Listening evaluation
│       ├── ocr/            # Image/PDF text extraction
│       ├── score/          # Shared scoring utilities
│       ├── stripe/         # Portal + webhook
│       ├── admin/          # Admin-only endpoints
│       └── onboarding/     # Onboarding completion
├── components/
│   ├── navbar.tsx, footer.tsx
│   ├── audio-recorder.tsx  # Speaking audio capture
│   ├── language-context.tsx / language-dropdown.tsx  # i18n
│   ├── OnboardingTour.tsx  # driver.js guided tour
│   ├── GuestBanner.tsx
│   ├── admin/              # Admin UI components
│   ├── dashboard/          # Score cards, charts (recharts)
│   ├── landing/            # Hero, Pricing, FAQ, ComparisonTable…
│   └── reading/            # Reading-specific components
├── lib/
│   ├── ai.ts               # Claude + OpenAI API wrapper
│   ├── supabase/           # client.ts / server.ts / admin.ts
│   ├── usage.ts            # Freemium quota enforcement
│   ├── content-mappers.ts  # DB rows → domain objects
│   ├── dashboard-data.ts   # Aggregated progress stats
│   ├── reading-scoring.ts  # Deterministic MCQ/matching scorer
│   ├── translations.ts     # EN / 中文 strings
│   ├── admin.ts, admin-audit.ts, api-logger.ts
│   └── *-prompts.ts / *-passages.ts / *-tracks.ts  # Legacy hard-coded content
├── supabase/               # SQL migration files (12 total)
├── scripts/
│   ├── seed-content.ts     # Populates DB with all skill content
│   └── generate-audio.ts   # TTS generation + Supabase Storage upload
├── e2e/                    # Playwright test suites (5 files)
├── docs/                   # SVG/PNG architecture diagrams + feature plans
└── public/                 # Static assets
```

---

## Key Architectural Patterns

### 1. Next.js App Router
All pages use the App Router (not Pages Router). Server components are used by default; client components are opted in with `"use client"`. API routes live under `app/api/` and are standard Next.js Route Handlers.

### 2. Supabase as Backend
Supabase provides:
- **PostgreSQL** — all user data, submissions, feedback, content
- **Auth** — Google login (WeChat planned); SSR-compatible via `@supabase/ssr`
- **Storage** — uploaded files (images, PDFs) and pre-generated listening audio

Three Supabase client variants exist in `lib/supabase/`:
- `client.ts` — browser (anon key)
- `server.ts` — server components / route handlers (cookie-based session)
- `admin.ts` — scripts and admin routes (service role key, bypasses RLS)

### 3. AI Pipeline
`lib/ai.ts` wraps Claude and OpenAI. The general flow for writing:
```
User input (text / image / PDF)
  → OCR if needed (Claude vision / OpenAI)
  → Editable text preview shown to user
  → User confirms → submitted to Claude for scoring
  → Structured JSON response (band scores, feedback, suggestions)
  → Stored in Supabase + rendered on feedback page
```

### 4. Content in Database (Phases 1–4 Complete)
All skill content (speaking prompts, writing prompts, reading passages, listening tracks) has been migrated from hard-coded TypeScript files into Supabase tables. The feature flag `NEXT_PUBLIC_CONTENT_SOURCE=db` switches between old and new paths. `lib/content-mappers.ts` normalises DB rows into the domain objects the UI expects.

Phase 5 (pending in `DB_TASKS.md`): add `prompt_slug` foreign keys on submission tables.

### 5. Freemium Quota
`lib/usage.ts` enforces the daily limits (2 writing / 2 speaking for free tier). Quota is checked in each API route before calling Claude. The admin settings table (`add_admin_settings.sql`) allows runtime configuration.

### 6. Bilingual Support
`components/language-context.tsx` provides a React context for EN / 中文 (Simplified Chinese). All UI strings live in `lib/translations.ts`. Feedback language (the language Claude responds in) is a separate per-submission choice from the UI language.

### 7. Admin Dashboard
`app/admin/` is a custom admin panel with:
- User management (`/admin/users/[id]/`)
- Submission viewer
- API usage monitoring
- Audit log
- Feedback inbox
- Runtime settings

Protected via Supabase RLS + server-side session checks.

---

## Database Migrations (chronological)

| File | Purpose |
|------|---------|
| `add_content_speaking_prompts.sql` | Speaking content table (Phase 1) |
| `add_content_writing_prompts.sql` | Writing content table (Phase 2) |
| `add_content_reading_passages.sql` | Reading content table (Phase 3) |
| `add_content_listening_tracks.sql` | Listening content + TTS audio cache (Phase 4) |
| `add_listening_tables.sql` | Listening submission tables |
| `add_admin_settings.sql` | Admin runtime config |
| `add_onboarding_completed.sql` | Onboarding flag per user |
| `add_prompt_text_column.sql` | Prompt text on submissions |
| `add_speaking_columns.sql` | Speaking-specific fields |
| `add_status_columns.sql` | Submission status tracking |
| `add_stripe_columns.sql` | Stripe customer/subscription IDs |
| `fix_created_at_timestamptz.sql` | Timestamp timezone fix |

Run manually via Supabase dashboard or `psql`. No automated migration runner is set up.

---

## Environment Variables

| Variable | Used for |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin/server-side DB access |
| `ANTHROPIC_API_KEY` | Claude API |
| `OPENAI_API_KEY` | Whisper transcription + TTS |
| `NEXT_PUBLIC_CONTENT_SOURCE` | `db` = use DB content, anything else = hard-coded |
| Stripe keys | Payment processing |

---

## Scripts

```bash
# Seed all skill content into Supabase
npx ts-node scripts/seed-content.ts

# Generate TTS audio for listening tracks and upload to Storage
npx ts-node scripts/generate-audio.ts
```

---

## Testing

Playwright E2E tests in `e2e/`. Run against `http://localhost:3099`.

```bash
npm run dev          # start dev server on port 3099
npx playwright test  # run all e2e suites
```

Test credentials: `apc1993+test@gmail.com` / `testtest`

Test files:
- `pages.spec.ts` — general page smoke tests
- `writing.spec.ts` — writing flow
- `speaking.spec.ts` — speaking flow
- `reading/listening` — covered in `pages.spec.ts`
- `draft-submissions.spec.ts` — submission state handling
- `landing-polish.spec.ts` — landing page UI

---

## No CI/CD
No GitHub Actions are configured. Deployments are manual (assumed Vercel via git push).
