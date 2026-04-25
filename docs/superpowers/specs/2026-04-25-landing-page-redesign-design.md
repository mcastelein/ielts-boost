# Landing Page Redesign — Design

**Date:** 2026-04-25
**Status:** Spec — pending implementation plan
**Owner:** Michael

## Problem

The current landing page (`app/page.tsx`) is a one-sentence hero plus two buttons. Cold visitors see no value proposition, no product proof, no IELTS context, and no reason to trust IELTSBoost over a tutor or ChatGPT. Conversion is poor.

## Goal

Replace the current page with a hybrid SaaS landing page that:

- Communicates value above the fold for visitors who are ready to sign up.
- Educates visitors who don't know IELTS deeply and converts them through a guide-style scroll.
- Feels mission-driven and low-pressure, not sales-aggressive.
- Works equally well in English and Simplified Chinese.
- Reads cleanly on mobile (primary device for the Chinese audience).

## Non-goals

- Video testimonials, "as seen in" press logos. (Add later if needed.)
- Lead-magnet email funnel (Option C from brainstorm). Out of scope for this redesign.
- Pure long-form SEO article (Option B). The page should *feel* like a SaaS landing, not a blog post.
- Handwritten essay / photo upload as a featured differentiator. De-emphasized at the user's request.
- Blog teasers, integrations grid, partner logos.
- Trust strip with user count. Omitted at current low N; revisit when the user base is large enough for the number to be a real signal.

## Page structure (top to bottom)

### 1. Hero (above the fold)

- **Headline (locked):** *"Build the confidence to take the IELTS exam — with instant AI feedback in English or 中文."*
- **Subhead:** One sentence covering: practice all four IELTS sections, instant feedback, bilingual.
- **Primary CTA:** "Start free — 2 essays/day, no credit card." → `/signup`
- **Secondary CTA:** "See a sample feedback report" → scrolls to or expands the bilingual showcase (section 7) so skeptics can evaluate without signing up.
- **Visual:** Screenshot of the feedback page with **Chinese feedback** (overall band score + 4 criterion bars + a feedback snippet). Chinese-first because the primary audience is Chinese IELTS learners. File: `public/images/landing/hero-feedback-zh.png`. This single image carries most of the persuasion weight.

### 2. "Is IELTSBoost for me?" — three personas

Three small cards, side-by-side on desktop, stacked on mobile:

- *"Studying for IELTS for the first time"*
- *"Already taken it, want to push from 6.5 → 7+"*
- *"Practicing daily but no one to grade my writing"*

Each card has a one-sentence promise tailored to that persona.

### 3. Mini IELTS guide

Short and scannable. Not a wall of text. This is the "guide" half of the hybrid landing page.

- **What is IELTS?** 2–3 sentences on what the exam is and why it matters.
- **The 4 sections** — visual grid: Writing, Speaking, Reading, Listening. Each card briefly explains what's tested and one sentence on how IELTSBoost helps with that section.
- **How scoring works** — explain bands 1–9 and the 4 writing criteria (Task Achievement, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy). Demonstrating IELTS expertise here builds trust.

### 4. How it works

Three steps with screenshots:

1. **Pick your section** — Writing, Speaking, Reading, or Listening. Practice however much you want.
2. **Get instant AI feedback** — band score, scoring against the 4 IELTS criteria, specific corrections, and explanations in English or 中文.
3. **Track your progress** — your dashboard surfaces recurring mistakes and shows your improvement trend over time.

### 5. Why we built this (personal story)

A short, plainly-written section in the founder's voice. Establishes empathy with the cost-of-tutoring pain point before the comparison table makes the same case in numbers.

Suggested copy direction (final wording during implementation, both EN and 中文):

> *"I built IELTSBoost for my wife. She was studying for the IELTS exam, and we couldn't believe how expensive Chinese IELTS tutors had become — hundreds of yuan per hour for the kind of feedback an AI can now give in seconds. She used IELTSBoost to go from a 6.5 to a 7.5. I built this so anyone can have the same kind of help, without the price tag."*

Visual: optional small photo of Lina (her call) or just a clean text block. No CTA — this section earns trust, doesn't sell.

### 6. IELTSBoost vs. alternatives

Comparison table.

Rows: cost, speed of feedback, structured by IELTS criteria, Chinese explanations, tracks recurring mistakes, available 24/7.

Columns: **IELTSBoost / private tutor (Chinese market) / IELTS practice books / ChatGPT / Chinese IELTS platforms (雅思哥, 9分达人, 小站雅思)**.

This section pre-empts the two real "why not just…" questions for this audience: "why not just use ChatGPT?" (no calibrated band scores, no mistake tracking over time, no natural Chinese explanations of Chinese-learner pitfalls) and "why not 雅思哥/9分达人?" (those are study libraries, not feedback engines — IELTSBoost grades *your* writing, not someone else's sample answer).

### 7. Bilingual showcase

Side-by-side screenshot: same feedback report, English on the left, 中文 on the right. Visual proof that the Chinese feedback is actually good, not machine-translated mush.

Files: `public/images/landing/bilingual-showcase.png` (single composite image preferred for layout simplicity, or two files if we want to do the side-by-side in CSS).

### 8. Pricing

Two-card layout: Free vs. Pro.

- **Free** card is visually prominent. Copy emphasizes that it's genuinely useful on its own — "Free forever, no credit card needed. Practice every section, get full AI feedback, track your progress." Bold the "no pressure to upgrade" framing.
- **Pro** card lists the upgrades (unlimited submissions, etc.) with bundle pricing displayed as three sub-options:
  - ¥200 / 1 month
  - ¥500 / 3 months *(17% off — most flexible)*
  - ¥900 / 6 months *(25% off — best value)*

Tone: Pro is *an option for power users*, not a paywall on a crippled free tier. The bundles are framed as ways to save, not as urgency-driven upsells.

### 9. FAQ

~6 questions, accordion style:

- Is the AI scoring accurate?
- Can I use this from China? (yes, no VPN needed)
- Will you add the other sections? (already there)
- Can I cancel anytime?
- How does the bilingual feedback work?
- Is my data private?

### 10. Mission strip

A small, quiet section just before the final CTA. One or two sentences in larger type, no buttons:

> *"We built IELTSBoost to help every learner build the confidence to take the IELTS exam — whether you upgrade or not."*

This is where the mission tone lands explicitly. Distinct from the pricing pitch above and the CTA below.

### 11. Final CTA strip

Big band — *"Ready to see your current band? Start practicing free."* Single primary button → `/signup`.

### 12. Footer

Existing footer (ML Ventures branding, links). No changes.

## Cross-cutting design requirements

- **Mobile-first.** Every section must read well in a single column. Most Chinese users will be on phones.
- **Bilingual.** All copy goes through `lib/translations.ts` and respects the existing UI language toggle. No untranslated strings.
- **CTA cadence.** Visible CTAs after sections 1 (hero), 4 (how it works), 8 (pricing), and 11 (final strip) — visitors convert at different scroll depths. Section 10 (mission strip) intentionally has no CTA.
- **Hero image performance.** The hero feedback screenshot is the LCP element. Use Next.js `<Image>` with appropriate `priority` and sizes; serve modern formats (AVIF/WebP).
- **Conversion tracking.** Add Vercel Analytics events for each CTA click (hero primary, hero secondary, how-it-works CTA, pricing card clicks for Free vs. each Pro bundle, final CTA) so we can measure which section converts.
- **Accessibility.** Semantic landmarks (`<header>`, `<main>`, `<section>`), heading hierarchy, alt text on every image, focus states on every CTA.
- **Reuse existing components** — pull from `components/` where possible (`LanguageDropdown`, button styles, etc.) rather than building parallel UI.

## Component breakdown

Each numbered section above maps to one component file under `components/landing/` (or similar — exact location decided in the plan). Suggested files:

- `Hero.tsx`
- `PersonaCards.tsx`
- `IeltsGuide.tsx`
- `HowItWorks.tsx`
- `PersonalStory.tsx`
- `ComparisonTable.tsx`
- `BilingualShowcase.tsx`
- `Pricing.tsx`
- `Faq.tsx`
- `MissionStrip.tsx`
- `FinalCta.tsx`

Each is independently understandable and testable. `app/page.tsx` becomes a short composition file that renders these in order.

## Translation work

Adding ~11 sections of new copy will roughly double the size of `lib/translations.ts`. Both EN and 中文 strings must be written by hand — no machine translation. Chinese copy should sound natural to a Chinese IELTS learner, matching the existing translation tone.

## Success criteria

The redesign is successful if:

- Cold visitors arriving from social media or referrals can answer "what is this and is it for me?" within 10 seconds of scrolling.
- Visitors who scroll the full page understand what IELTS is, how it's scored, and how IELTSBoost helps — without needing to sign up first.
- The page reads naturally in both English and 中文, mobile and desktop.
- Tracked CTA conversion rate is measurably higher than the current page (baseline established before launch).
- The page tone feels mission-driven, not sales-aggressive — a returning visitor would describe IELTSBoost as "helpful" rather than "trying to sell me something."

## Auth gating of `/writing` and other practice pages

The current landing page has a "Start Writing Practice" link that goes directly to `/writing` without authentication. **In this redesign, all CTAs route to `/signup` instead** — we don't want unauthenticated users incurring API costs.

There is a related, more nuanced UX question the user raised:

> "Maybe they can start the practice, but can't get feedback until they sign up — and if they leave the page to sign up, their draft should be saved so they can come back to it."

That's a good idea but it's a **product-flow change to the writing module**, not a landing-page change. It involves: allowing access to the practice form without auth, gating the submit/feedback button behind auth, and persisting drafts (likely `localStorage`) across the signup redirect. **Captured here as related work — flagged for a separate spec.** The landing page redesign does not depend on it; CTAs simply go to `/signup` until that work happens.

## Related work (separate specs to consider after this one)

- **Writing-module preview mode + draft persistence.** Let unauthenticated visitors fill in the practice form, gate the feedback button behind signup, save drafts in `localStorage` so they survive the signup redirect.
- **Phone auth via Twilio.** Already deferred — see memory `project_phone_auth.md`.

## Open questions for the implementation plan

- Confirm `components/landing/` against existing project structure (probably fine, but the plan should verify there's no naming clash).
- Personal story section: include a small photo of Lina, or text-only? (Lina's call.)
- Mission strip copy: the example sentence above is a placeholder. Final wording chosen during implementation, in both EN and 中文.
- Conversion tracking: confirm Vercel Analytics custom event API vs. adding a thin wrapper.
