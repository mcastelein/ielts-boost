# Content DB Migration Tasks

Migrating hard-coded question content from `lib/*.ts` into Supabase so it can be managed dynamically without code deploys.

Migration order: Speaking → Writing → Reading → Listening (simplest to most complex).

---

## Phase 1 — Speaking

- [x] `supabase/add_content_speaking_prompts.sql` — create table, indexes, RLS
- [x] `scripts/seed-content.ts` — seed script (speaking section)
- [ ] Run migration in Supabase, then: `npx tsx scripts/seed-content.ts` — verify 18 rows
- [x] Update `app/speaking/page.tsx` selection UI to fetch from DB
- [ ] Add `NEXT_PUBLIC_CONTENT_SOURCE=db` to `.env.local`, restart dev server, test end-to-end

## Phase 2 — Writing

- [ ] `supabase/add_content_writing_prompts.sql` — create table, indexes, RLS
- [ ] Add writing section to `scripts/seed-content.ts`
- [ ] Run seed, verify 25 rows in Supabase
- [ ] Update `app/writing/page.tsx` selection UI to fetch from DB
- [ ] Flip `CONTENT_SOURCE=db` for writing, test end-to-end

## Phase 3 — Reading

- [ ] `supabase/add_content_reading_passages.sql` — create table, indexes, RLS
- [ ] Add reading section to `scripts/seed-content.ts`
- [ ] Create `lib/content-mappers.ts` with `dbRowToPassage()` mapper
- [ ] Run seed, verify 4 rows in Supabase
- [ ] Update `app/reading/page.tsx` selection UI to fetch from DB
- [ ] Update `app/api/reading/route.ts` to look up passage by slug from DB
- [ ] Flip `CONTENT_SOURCE=db` for reading, test end-to-end

## Phase 4 — Listening

- [ ] `supabase/add_content_listening_tracks.sql` — create table, indexes, RLS
- [ ] Add listening section to `scripts/seed-content.ts`
- [ ] Add `dbRowToTrack()` to `lib/content-mappers.ts`
- [ ] Run seed, verify 2 rows in Supabase
- [ ] Update `app/listening/page.tsx` selection UI to fetch from DB
- [ ] Update `app/api/listening/route.ts` to look up track by slug from DB
- [ ] Flip `CONTENT_SOURCE=db` for listening, test end-to-end

## Phase 5 — Submission table linkage (follow-up)

- [ ] Add `prompt_slug` column to `writing_submissions`, backfill from `prompt_topic`
- [ ] Write `prompt_slug` on new writing submissions
- [ ] Write `prompt_slug` on new speaking submissions
- [ ] Evaluate adding formal FK constraints (`REFERENCES reading_passages(id)`)
