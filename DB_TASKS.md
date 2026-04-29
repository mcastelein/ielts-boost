# Content DB Migration Tasks

Migrating hard-coded question content from `lib/*.ts` into Supabase so it can be managed dynamically without code deploys.

Migration order: Speaking → Writing → Reading → Listening (simplest to most complex).

---

## Phase 1 — Speaking

- [x] `supabase/add_content_speaking_prompts.sql` — create table, indexes, RLS
- [x] `scripts/seed-content.ts` — seed script (speaking section)
- [x] Run migration in Supabase, then: `npx tsx scripts/seed-content.ts` — verify 18 rows
- [x] Update `app/speaking/page.tsx` selection UI to fetch from DB
- [x] Add `NEXT_PUBLIC_CONTENT_SOURCE=db` to `.env.local`, restart dev server, test end-to-end

## Phase 2 — Writing

- [x] `supabase/add_content_writing_prompts.sql` — create table, indexes, RLS
- [x] Add writing section to `scripts/seed-content.ts`
- [x] Run migration in Supabase, then: `npx tsx scripts/seed-content.ts` — verify 29 rows total (18 speaking + 29 writing) — note: 29 writing prompts (15 task1 + 14 task2)
- [x] Update `app/writing/page.tsx` to fetch from DB (always — no feature flag)
- [x] Test end-to-end

## Phase 3 — Reading

- [x] `supabase/add_content_reading_passages.sql` — create table, indexes, RLS
- [x] Add reading section to `scripts/seed-content.ts`
- [x] Create `lib/content-mappers.ts` with `dbRowToPassage()` mapper
- [x] Run migration in Supabase, then: `npx tsx scripts/seed-content.ts` — verify 4 reading rows
- [x] Update `app/reading/page.tsx` selection UI to fetch from DB
- [x] Update `app/api/reading/route.ts` to look up passage by slug from DB
- [x] Test end-to-end

## Phase 4 — Listening

Audio caching strategy: TTS is generated once per track and stored in Supabase Storage
(`listening-audio` public bucket). The listening page uses the cached `audio_url` directly
(CDN-served, instant).

Staleness detection: the table has two timestamps — `transcript_updated_at` (auto-set by a
Postgres trigger whenever the `transcript` column changes) and `audio_generated_at` (written by
the generate-audio script after a successful upload). `scripts/generate-audio.ts` re-processes
any row where `audio_generated_at IS NULL OR audio_generated_at < transcript_updated_at`. This
means editing a transcript and re-running the script is all that's needed to refresh the audio —
no manual cleanup required.

- [x] `supabase/add_content_listening_tracks.sql` — table with `audio_url`, `transcript_updated_at`, `audio_generated_at`, trigger, indexes, RLS
- [x] Create `listening-audio` public bucket in Supabase Storage dashboard
- [x] Add listening data + `seedListeningTracks()` to `scripts/seed-content.ts`
- [x] Add `dbRowToTrack()` to `lib/content-mappers.ts`
- [x] Run migration in Supabase, then: `npx tsx scripts/seed-content.ts` — verify 2 listening rows
- [x] Create `scripts/generate-audio.ts` — fetches stale/new tracks, generates TTS, uploads to Storage, writes `audio_url` + `audio_generated_at`
- [x] Create `listening-audio` public bucket, then: `npx tsx scripts/generate-audio.ts` — verify both rows have `audio_url` + `audio_generated_at` set
- [x] Update `app/listening/page.tsx`: uses `track.audioUrl` directly when set; falls back to TTS
- [x] Update `app/api/listening/route.ts` to look up track by slug from DB
- [x] Strip `lib/listening-tracks.ts` to types + band-score utilities only
- [ ] Test end-to-end

## Phase 5 — Submission table linkage (follow-up)

- [ ] Add `prompt_slug` column to `writing_submissions`, backfill from `prompt_topic`
- [ ] Write `prompt_slug` on new writing submissions
- [ ] Write `prompt_slug` on new speaking submissions
- [ ] Evaluate adding formal FK constraints (`REFERENCES reading_passages(id)`)
