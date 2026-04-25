# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current one-sentence landing page (`app/page.tsx`) with a hybrid SaaS landing page that educates Chinese IELTS learners and converts them to signups, with bilingual copy and a low-pressure mission-driven tone.

**Architecture:** Section-by-section composition. `app/page.tsx` stays a server component and renders ~11 client components from `components/landing/`. Each section component owns its own copy keys (added to `lib/translations.ts`), markup, and CTA wiring. CTAs route to `/signup`. Analytics events fire on every CTA click via a thin `lib/landing-analytics.ts` helper around Vercel Analytics' `track()`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, Vercel Analytics, Playwright (e2e).

**Spec:** `docs/superpowers/specs/2026-04-25-landing-page-redesign-design.md`.

---

## Pre-flight

- [ ] **Check `lib/translations.ts` for uncommitted changes.**

  Run: `git diff --stat lib/translations.ts`

  If there are uncommitted changes (there are 4 keys in flight as of plan-write time), either commit them or stash them before starting. Adding ~50 new keys on top of an unstable file makes diffs hard to read and risks merge headaches if the in-flight keys land elsewhere first.

- [ ] **Confirm Playwright runs locally.**

  Run: `npx playwright test e2e/pages.spec.ts --reporter=list`

  Expected: existing tests pass. If they don't, fix that first — we'll be modifying these tests, and a green baseline matters.

- [ ] **Confirm dev server runs.**

  Run: `npm run dev` and load `http://localhost:3000`. You should see the existing one-sentence landing page. Stop the server when done.

---

## File Structure

**New files (created in this plan):**

| Path | Responsibility |
| --- | --- |
| `components/landing/Hero.tsx` | Above-the-fold hero with headline, CTAs, screenshot |
| `components/landing/PersonaCards.tsx` | Three "is this for me?" persona cards |
| `components/landing/IeltsGuide.tsx` | Mini IELTS guide (what, sections, scoring) |
| `components/landing/HowItWorks.tsx` | Three-step product walkthrough |
| `components/landing/PersonalStory.tsx` | Founder's-voice story with Lina's 6.5→7.5 outcome |
| `components/landing/ComparisonTable.tsx` | IELTSBoost vs. tutor / books / ChatGPT / Chinese platforms |
| `components/landing/BilingualShowcase.tsx` | EN/中文 side-by-side feedback screenshot |
| `components/landing/Pricing.tsx` | Free vs. Pro with 1mo/3mo/6mo bundles |
| `components/landing/Faq.tsx` | Accordion of 6 FAQs |
| `components/landing/MissionStrip.tsx` | Quiet mission statement, no CTA |
| `components/landing/FinalCta.tsx` | Final CTA strip → /signup |
| `lib/landing-analytics.ts` | Wrapper around Vercel Analytics `track()` for landing CTAs |

**Modified files:**

| Path | Change |
| --- | --- |
| `app/page.tsx` | Replace existing one-sentence hero with composition of all section components |
| `lib/translations.ts` | Add ~50 new translation keys (one block per section) |
| `e2e/pages.spec.ts` | Update the landing-page test to match new copy and CTA destinations |

**Hero image (provided by user out-of-band):**

| Path | Source |
| --- | --- |
| `public/images/landing/hero-feedback-zh.png` | Real screenshot from the live app, Chinese feedback |
| `public/images/landing/bilingual-showcase.png` | Composite EN/中文 feedback screenshot (provided later) |

Each section component is independently understandable, takes no props, and is responsible for its own copy and styling. `app/page.tsx` is a thin composition file. This decomposition keeps any single file small enough to hold in context and edit reliably.

**Naming convention:** PascalCase filenames (`Hero.tsx`) match the newer style in `components/dashboard/`. Imports use `@/components/landing/Hero`.

---

## Task 1: Scaffold structure with placeholder sections

Get the new page wired end-to-end before filling in any real content. After this task, visiting `/` shows 11 colored placeholder blocks in order — proves layout, composition, and routing all work.

**Files:**
- Create: `components/landing/Hero.tsx`, `PersonaCards.tsx`, `IeltsGuide.tsx`, `HowItWorks.tsx`, `PersonalStory.tsx`, `ComparisonTable.tsx`, `BilingualShowcase.tsx`, `Pricing.tsx`, `Faq.tsx`, `MissionStrip.tsx`, `FinalCta.tsx`
- Modify: `app/page.tsx`
- Modify: `e2e/pages.spec.ts:4-9` (the `landing page has brand name and CTAs` test will fail with new copy)

- [ ] **Step 1: Create all 11 placeholder components.**

  Each one is a stub like this — replace `Hero` with the matching component name:

  ```tsx
  // components/landing/Hero.tsx
  export default function Hero() {
    return (
      <section
        id="hero"
        className="border-2 border-dashed border-gray-300 bg-blue-50 px-4 py-16"
      >
        <div className="mx-auto max-w-5xl text-center text-sm text-gray-500">
          [Hero placeholder]
        </div>
      </section>
    );
  }
  ```

  Use a different `bg-*-50` color for each section (blue, purple, green, yellow, pink, indigo, etc.) so visual ordering is obvious during scaffolding. The colors get removed in the per-section tasks.

- [ ] **Step 2: Replace `app/page.tsx` with the composition.**

  ```tsx
  import Hero from "@/components/landing/Hero";
  import PersonaCards from "@/components/landing/PersonaCards";
  import IeltsGuide from "@/components/landing/IeltsGuide";
  import HowItWorks from "@/components/landing/HowItWorks";
  import PersonalStory from "@/components/landing/PersonalStory";
  import ComparisonTable from "@/components/landing/ComparisonTable";
  import BilingualShowcase from "@/components/landing/BilingualShowcase";
  import Pricing from "@/components/landing/Pricing";
  import Faq from "@/components/landing/Faq";
  import MissionStrip from "@/components/landing/MissionStrip";
  import FinalCta from "@/components/landing/FinalCta";

  export default function Home() {
    return (
      <>
        <Hero />
        <PersonaCards />
        <IeltsGuide />
        <HowItWorks />
        <PersonalStory />
        <ComparisonTable />
        <BilingualShowcase />
        <Pricing />
        <Faq />
        <MissionStrip />
        <FinalCta />
      </>
    );
  }
  ```

  Note: `app/page.tsx` stays a server component. Each section is a client component (will gain `"use client"` and `useLanguage()` in its dedicated task), but the composition itself doesn't need to be.

- [ ] **Step 3: Update the landing-page e2e test to a minimal sanity check.**

  In `e2e/pages.spec.ts`, replace the first test (`"landing page has brand name and CTAs"`) and the last test (`"landing page Start Writing links to /writing"`) with a single placeholder test that just confirms the page loads:

  ```ts
  test("landing page renders all sections", async ({ page }) => {
    await page.goto("/");
    // Every landing section has its id; scaffolding stage just checks they exist
    for (const id of [
      "hero", "personas", "guide", "how-it-works", "personal-story",
      "comparison", "bilingual", "pricing", "faq", "mission", "final-cta",
    ]) {
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  });
  ```

  Each placeholder needs the matching `id` — make sure section ids in your placeholders are: `hero`, `personas`, `guide`, `how-it-works`, `personal-story`, `comparison`, `bilingual`, `pricing`, `faq`, `mission`, `final-cta`.

- [ ] **Step 4: Run dev server and visually verify all 11 sections render in order.**

  Run: `npm run dev`, then load `http://localhost:3000`. You should see 11 colored blocks stacked vertically, with Navbar above and Footer below. Stop the server.

- [ ] **Step 5: Run the e2e test to confirm it passes.**

  Run: `npx playwright test e2e/pages.spec.ts -g "landing page renders" --reporter=list`

  Expected: PASS.

- [ ] **Step 6: Commit.**

  ```bash
  git add components/landing app/page.tsx e2e/pages.spec.ts
  git commit -m "Scaffold landing page sections with placeholders"
  ```

---

## Task 2: Hero section

Build the above-the-fold hero. Uses a placeholder image (a styled div with text) until the user drops in the real screenshot — that swap happens in Task 14.

**Files:**
- Modify: `components/landing/Hero.tsx`
- Modify: `lib/translations.ts` (add hero keys at end of `translations` object, before closing `}`)
- Modify: `e2e/pages.spec.ts`

- [ ] **Step 1: Add hero translation keys to `lib/translations.ts`.**

  Append these inside the `translations` object, with a `// Landing — Hero` comment:

  ```ts
    // Landing — Hero
    landing_hero_headline: {
      en: "Build the confidence to take the IELTS exam — with instant AI feedback in English or 中文.",
      zh: "以英语或中文获得即时 AI 反馈，建立参加雅思考试的信心。",
    },
    landing_hero_subhead: {
      en: "Practice all four IELTS sections — Writing, Speaking, Reading, Listening — and get scored against the official band criteria in seconds.",
      zh: "练习雅思的全部四个部分——写作、口语、阅读、听力，并在几秒钟内获得依据官方评分标准的评估。",
    },
    landing_hero_cta_primary: {
      en: "Start free — 2 essays/day, no credit card",
      zh: "免费开始——每天 2 篇作文，无需信用卡",
    },
    landing_hero_cta_secondary: {
      en: "See a sample feedback report",
      zh: "查看反馈示例",
    },
    landing_hero_image_alt: {
      en: "IELTSBoost AI feedback report showing band score and four criterion scores",
      zh: "IELTSBoost AI 反馈报告，显示总分和四项评分标准",
    },
  ```

  Note: Chinese copy here is a starting point — the user may want to refine. That's fine; the key is the structure is correct so refinements are one-line edits.

- [ ] **Step 2: Implement `Hero.tsx`.**

  ```tsx
  "use client";

  import Link from "next/link";
  import { useLanguage } from "@/lib/language-context";

  export default function Hero() {
    const { t } = useLanguage();
    return (
      <section
        id="hero"
        className="px-4 pt-16 pb-12 sm:pt-24 sm:pb-20"
      >
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {t("landing_hero_headline")}
            </h1>
            <p className="mt-5 text-base text-gray-600 sm:text-lg">
              {t("landing_hero_subhead")}
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4 lg:items-start lg:justify-start">
              <Link
                href="/signup"
                data-cta="hero-primary"
                className="w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:w-auto"
              >
                {t("landing_hero_cta_primary")}
              </Link>
              <a
                href="#bilingual"
                data-cta="hero-secondary"
                className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 sm:w-auto"
              >
                {t("landing_hero_cta_secondary")}
              </a>
            </div>
          </div>
          <div
            aria-label={t("landing_hero_image_alt")}
            className="flex aspect-[4/3] items-center justify-center rounded-xl border border-gray-200 bg-white text-sm text-gray-400 shadow-sm"
          >
            [Hero feedback screenshot — drop in public/images/landing/hero-feedback-zh.png]
          </div>
        </div>
      </section>
    );
  }
  ```

  Note the `data-cta` attributes — these get used by the analytics task later. The image is an aspect-ratio-locked placeholder div so the layout doesn't shift when the real image lands.

- [ ] **Step 3: Add a Hero-specific e2e assertion.**

  In `e2e/pages.spec.ts`, add this test alongside the scaffolding test:

  ```ts
  test("landing hero shows headline, subhead, and CTAs to /signup", async ({ page }) => {
    await page.goto("/");
    const hero = page.locator("#hero");
    await expect(hero.locator("h1")).toBeVisible();
    const primary = hero.locator('[data-cta="hero-primary"]');
    await expect(primary).toBeVisible();
    await expect(primary).toHaveAttribute("href", "/signup");
    const secondary = hero.locator('[data-cta="hero-secondary"]');
    await expect(secondary).toBeVisible();
    await expect(secondary).toHaveAttribute("href", "#bilingual");
  });
  ```

- [ ] **Step 4: Run the new test.**

  Run: `npx playwright test e2e/pages.spec.ts -g "landing hero shows" --reporter=list`

  Expected: PASS.

- [ ] **Step 5: Visually verify in the browser.**

  Run: `npm run dev`, load `/`. The hero should show the headline, subhead, two CTAs, and a placeholder image box on desktop layout. Toggle the language dropdown in the navbar — copy should switch between EN and 中文. Stop the server.

- [ ] **Step 6: Commit.**

  ```bash
  git add components/landing/Hero.tsx lib/translations.ts e2e/pages.spec.ts
  git commit -m "Build landing hero section with bilingual copy"
  ```

---

## Task 3: PersonaCards section

Three cards: first-timer, score-pusher, daily-practicer. Side-by-side on desktop, stacked on mobile.

**Files:**
- Modify: `components/landing/PersonaCards.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add persona translation keys.**

  ```ts
    // Landing — Personas
    landing_personas_title: {
      en: "Is IELTSBoost for me?",
      zh: "IELTSBoost 适合我吗？",
    },
    landing_personas_first_time_title: {
      en: "Studying for IELTS for the first time",
      zh: "第一次备考雅思",
    },
    landing_personas_first_time_body: {
      en: "Get a fast read on where you stand and what to focus on first.",
      zh: "快速了解自己的水平，知道该先专注哪里。",
    },
    landing_personas_push_score_title: {
      en: "Already taken it, want to push from 6.5 → 7+",
      zh: "已经考过，想从 6.5 提升到 7+",
    },
    landing_personas_push_score_body: {
      en: "Identify the recurring mistakes that are quietly capping your band score.",
      zh: "找出那些悄悄拉低你分数的反复出现的错误。",
    },
    landing_personas_daily_title: {
      en: "Practicing daily but no one to grade your writing",
      zh: "每天练习，却没人帮你批改",
    },
    landing_personas_daily_body: {
      en: "Submit any essay and get feedback in seconds — at any hour.",
      zh: "随时提交作文，秒级获得反馈——任何时间都可以。",
    },
  ```

- [ ] **Step 2: Implement `PersonaCards.tsx`.**

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  const personas: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
    { titleKey: "landing_personas_first_time_title", bodyKey: "landing_personas_first_time_body" },
    { titleKey: "landing_personas_push_score_title", bodyKey: "landing_personas_push_score_body" },
    { titleKey: "landing_personas_daily_title", bodyKey: "landing_personas_daily_body" },
  ];

  export default function PersonaCards() {
    const { t } = useLanguage();
    return (
      <section id="personas" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_personas_title")}
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {personas.map((p) => (
              <div
                key={p.titleKey}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900">{t(p.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-600">{t(p.bodyKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Visually verify.**

  Run dev server, load `/`, scroll to personas section. Three cards visible side-by-side on desktop, stacked on mobile (resize the window narrow to test). Toggle language — both sides switch. Stop the server.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/PersonaCards.tsx lib/translations.ts
  git commit -m "Build landing personas section"
  ```

---

## Task 4: IeltsGuide section

Three sub-blocks: What is IELTS / The 4 sections / How scoring works.

**Files:**
- Modify: `components/landing/IeltsGuide.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add guide translation keys.**

  ```ts
    // Landing — IELTS Guide
    landing_guide_title: { en: "A quick IELTS primer", zh: "雅思简明指南" },
    landing_guide_what_title: { en: "What is IELTS?", zh: "什么是雅思？" },
    landing_guide_what_body: {
      en: "The International English Language Testing System is the world's most widely accepted English-proficiency exam — required by universities, employers, and immigration programs in the UK, Australia, Canada, New Zealand, and most of Europe.",
      zh: "雅思（IELTS）是全球最受认可的英语水平考试，被英国、澳大利亚、加拿大、新西兰及欧洲大部分国家的大学、雇主和移民项目所采用。",
    },
    landing_guide_sections_title: { en: "The four sections", zh: "四个考试部分" },
    landing_guide_section_writing: { en: "Writing", zh: "写作" },
    landing_guide_section_writing_body: {
      en: "Two tasks: a 150-word report (Task 1) and a 250-word essay (Task 2). Graded on Task Achievement, Coherence, Lexical Resource, and Grammar.",
      zh: "两个任务：150 词报告（任务一）和 250 词议论文（任务二）。评分维度为完成情况、连贯性、词汇资源和语法。",
    },
    landing_guide_section_speaking: { en: "Speaking", zh: "口语" },
    landing_guide_section_speaking_body: {
      en: "Three parts: introduction, a long turn on a familiar topic, and a follow-up discussion. Around 11–14 minutes total.",
      zh: "三个部分：自我介绍、就熟悉话题的长回答、以及深入讨论。总时长约 11-14 分钟。",
    },
    landing_guide_section_reading: { en: "Reading", zh: "阅读" },
    landing_guide_section_reading_body: {
      en: "Three passages, 40 questions, 60 minutes. Tests skimming, scanning, and detail comprehension.",
      zh: "三篇文章，40 道题，60 分钟。考查略读、扫读和细节理解能力。",
    },
    landing_guide_section_listening: { en: "Listening", zh: "听力" },
    landing_guide_section_listening_body: {
      en: "Four recordings, 40 questions, ~30 minutes plus 10 minutes to transfer answers.",
      zh: "四段录音，40 道题，约 30 分钟，加 10 分钟誊写答案。",
    },
    landing_guide_scoring_title: { en: "How scoring works", zh: "评分机制" },
    landing_guide_scoring_body: {
      en: "Each section is scored on a band scale from 1 (non-user) to 9 (expert). Your overall band is the average of the four section scores, rounded to the nearest 0.5. Most universities require a 6.5 or 7.0 overall, with no section below 6.0.",
      zh: "每部分按 1（不会使用）至 9（专家级）的等级评分。总分是四部分分数的平均值，四舍五入到最接近的 0.5。大多数大学要求总分 6.5 或 7.0，且各单项不低于 6.0。",
    },
    landing_guide_criteria_title: { en: "The four writing criteria", zh: "写作四项评分标准" },
    landing_guide_criteria_ta: { en: "Task Achievement", zh: "任务完成情况" },
    landing_guide_criteria_cc: { en: "Coherence and Cohesion", zh: "连贯与衔接" },
    landing_guide_criteria_lr: { en: "Lexical Resource", zh: "词汇资源" },
    landing_guide_criteria_gra: { en: "Grammatical Range and Accuracy", zh: "语法多样性与准确性" },
  ```

- [ ] **Step 2: Implement `IeltsGuide.tsx`.**

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  const sections: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
    { titleKey: "landing_guide_section_writing", bodyKey: "landing_guide_section_writing_body" },
    { titleKey: "landing_guide_section_speaking", bodyKey: "landing_guide_section_speaking_body" },
    { titleKey: "landing_guide_section_reading", bodyKey: "landing_guide_section_reading_body" },
    { titleKey: "landing_guide_section_listening", bodyKey: "landing_guide_section_listening_body" },
  ];

  const criteria: TranslationKey[] = [
    "landing_guide_criteria_ta",
    "landing_guide_criteria_cc",
    "landing_guide_criteria_lr",
    "landing_guide_criteria_gra",
  ];

  export default function IeltsGuide() {
    const { t } = useLanguage();
    return (
      <section id="guide" className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_guide_title")}
          </h2>

          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{t("landing_guide_what_title")}</h3>
            <p className="mt-2 text-sm text-gray-600">{t("landing_guide_what_body")}</p>
          </div>

          <h3 className="mt-12 text-lg font-semibold text-gray-900">
            {t("landing_guide_sections_title")}
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {sections.map((s) => (
              <div key={s.titleKey} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h4 className="text-base font-semibold text-gray-900">{t(s.titleKey)}</h4>
                <p className="mt-2 text-sm text-gray-600">{t(s.bodyKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">{t("landing_guide_scoring_title")}</h3>
            <p className="mt-2 text-sm text-gray-600">{t("landing_guide_scoring_body")}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("landing_guide_criteria_title")}
              </p>
              <ul className="mt-2 grid gap-2 text-sm text-gray-700 sm:grid-cols-2">
                {criteria.map((k) => (
                  <li key={k} className="rounded-lg bg-gray-50 px-3 py-2">{t(k)}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Visually verify in EN and 中文.** Section 3 is mostly text — make sure Chinese line breaks look natural and nothing overflows.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/IeltsGuide.tsx lib/translations.ts
  git commit -m "Build landing IELTS guide section"
  ```

---

## Task 5: HowItWorks section

Three numbered steps with placeholder image slots.

**Files:**
- Modify: `components/landing/HowItWorks.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add HowItWorks translation keys.**

  ```ts
    // Landing — How it works
    landing_how_title: { en: "How it works", zh: "如何使用" },
    landing_how_step1_title: { en: "Pick your section", zh: "选择练习部分" },
    landing_how_step1_body: {
      en: "Writing, Speaking, Reading, or Listening. Practice as much as you want.",
      zh: "写作、口语、阅读或听力——想练多少就练多少。",
    },
    landing_how_step2_title: { en: "Get instant AI feedback", zh: "获得即时 AI 反馈" },
    landing_how_step2_body: {
      en: "Band score, evaluation against the four IELTS criteria, specific corrections, and explanations in English or 中文.",
      zh: "总分、四项评分标准的评估、具体修改建议，以及英文或中文的详细解释。",
    },
    landing_how_step3_title: { en: "Track your progress", zh: "追踪你的进步" },
    landing_how_step3_body: {
      en: "Your dashboard surfaces recurring mistakes and shows your improvement trend over time.",
      zh: "仪表盘会显示反复出现的错误，以及你随时间推移的进步趋势。",
    },
    landing_how_cta: { en: "Try it free", zh: "免费试用" },
  ```

- [ ] **Step 2: Implement `HowItWorks.tsx`.**

  ```tsx
  "use client";

  import Link from "next/link";
  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  const steps: { titleKey: TranslationKey; bodyKey: TranslationKey }[] = [
    { titleKey: "landing_how_step1_title", bodyKey: "landing_how_step1_body" },
    { titleKey: "landing_how_step2_title", bodyKey: "landing_how_step2_body" },
    { titleKey: "landing_how_step3_title", bodyKey: "landing_how_step3_body" },
  ];

  export default function HowItWorks() {
    const { t } = useLanguage();
    return (
      <section id="how-it-works" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_how_title")}
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.titleKey} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{t(s.titleKey)}</h3>
                <p className="mt-2 text-sm text-gray-600">{t(s.bodyKey)}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex justify-center">
            <Link
              href="/signup"
              data-cta="how-it-works"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              {t("landing_how_cta")}
            </Link>
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Visually verify.** Numbered cards in order, CTA below them.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/HowItWorks.tsx lib/translations.ts
  git commit -m "Build landing how-it-works section"
  ```

---

## Task 6: PersonalStory section

Founder's voice. Lina's 6.5 → 7.5 outcome called out specifically. No CTA.

**Files:**
- Modify: `components/landing/PersonalStory.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add PersonalStory translation keys.**

  ```ts
    // Landing — Personal story
    landing_story_eyebrow: { en: "Why we built this", zh: "我们为什么做这个" },
    landing_story_body: {
      en: "I built IELTSBoost for my wife. She was studying for the IELTS exam, and we couldn't believe how expensive Chinese IELTS tutors had become — hundreds of yuan per hour for the kind of feedback an AI can now give in seconds. She used IELTSBoost to go from a 6.5 to a 7.5. I built this so anyone can have the same kind of help, without the price tag.",
      zh: "我为我妻子做了 IELTSBoost。她当时正在准备雅思考试，而中国雅思辅导的价格让我们难以置信——每小时几百块人民币，而 AI 现在几秒钟就能给出同样质量的反馈。她用 IELTSBoost 把分数从 6.5 提到了 7.5。我希望任何人都能获得同样的帮助——没有那高昂的价格。",
    },
    landing_story_signature: { en: "— Michael", zh: "— Michael" },
  ```

- [ ] **Step 2: Implement `PersonalStory.tsx`.**

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";

  export default function PersonalStory() {
    const { t } = useLanguage();
    return (
      <section id="personal-story" className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {t("landing_story_eyebrow")}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-gray-800 sm:text-xl">
            {t("landing_story_body")}
          </p>
          <p className="mt-6 text-sm font-medium text-gray-500">
            {t("landing_story_signature")}
          </p>
        </div>
      </section>
    );
  }
  ```

  Note: photo of Lina is an open question (per spec). Skipping for now — Lina's call. If she wants one, add an `<Image>` above the eyebrow text in a small circle.

- [ ] **Step 3: Visually verify.** Reads as a short personal note. The 6.5 → 7.5 number should stand out naturally just from being a specific number in the prose; no need to bold it.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/PersonalStory.tsx lib/translations.ts
  git commit -m "Build landing personal story section"
  ```

---

## Task 7: ComparisonTable section

5-column comparison: IELTSBoost, private tutor, books, ChatGPT, Chinese IELTS platforms. 6 rows.

**Files:**
- Modify: `components/landing/ComparisonTable.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add comparison translation keys.**

  ```ts
    // Landing — Comparison
    landing_compare_title: { en: "How does IELTSBoost compare?", zh: "IELTSBoost 与其他选择对比" },
    landing_compare_col_us: { en: "IELTSBoost", zh: "IELTSBoost" },
    landing_compare_col_tutor: { en: "Private tutor", zh: "私教" },
    landing_compare_col_books: { en: "Practice books", zh: "练习书" },
    landing_compare_col_chatgpt: { en: "ChatGPT", zh: "ChatGPT" },
    landing_compare_col_zh_platforms: { en: "Chinese platforms", zh: "中国平台" },
    landing_compare_row_cost: { en: "Cost", zh: "费用" },
    landing_compare_row_speed: { en: "Speed of feedback", zh: "反馈速度" },
    landing_compare_row_criteria: { en: "Scored against IELTS criteria", zh: "按雅思评分标准评估" },
    landing_compare_row_chinese: { en: "Natural Chinese explanations", zh: "自然的中文讲解" },
    landing_compare_row_tracks: { en: "Tracks recurring mistakes", zh: "追踪反复出现的错误" },
    landing_compare_row_24_7: { en: "Available 24/7", zh: "全天 24 小时可用" },
    landing_compare_yes: { en: "Yes", zh: "是" },
    landing_compare_no: { en: "No", zh: "否" },
    landing_compare_partial: { en: "Partial", zh: "部分" },
    landing_compare_cost_us: { en: "Free or ¥200/mo", zh: "免费或 ¥200/月" },
    landing_compare_cost_tutor: { en: "¥200–600/hr", zh: "¥200–600/小时" },
    landing_compare_cost_books: { en: "¥30–100", zh: "¥30–100" },
    landing_compare_cost_chatgpt: { en: "Free or $20/mo", zh: "免费或 $20/月" },
    landing_compare_cost_zh_platforms: { en: "Mostly subscription", zh: "多为订阅制" },
    landing_compare_speed_us: { en: "Seconds", zh: "数秒" },
    landing_compare_speed_tutor: { en: "Days", zh: "数天" },
    landing_compare_speed_books: { en: "N/A — no feedback", zh: "无——书本不提供反馈" },
    landing_compare_speed_chatgpt: { en: "Seconds", zh: "数秒" },
    landing_compare_speed_zh_platforms: { en: "Varies — sample answers, not your essay", zh: "因平台而异，多为参考答案而非批改你的文章" },
  ```

- [ ] **Step 2: Implement `ComparisonTable.tsx`.**

  Use a `<table>` with semantic markup. On mobile, the table scrolls horizontally inside its container.

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  type Cell = TranslationKey | "yes" | "no" | "partial";

  const columns: TranslationKey[] = [
    "landing_compare_col_us",
    "landing_compare_col_tutor",
    "landing_compare_col_books",
    "landing_compare_col_chatgpt",
    "landing_compare_col_zh_platforms",
  ];

  const rows: { labelKey: TranslationKey; cells: Cell[] }[] = [
    {
      labelKey: "landing_compare_row_cost",
      cells: [
        "landing_compare_cost_us",
        "landing_compare_cost_tutor",
        "landing_compare_cost_books",
        "landing_compare_cost_chatgpt",
        "landing_compare_cost_zh_platforms",
      ],
    },
    {
      labelKey: "landing_compare_row_speed",
      cells: [
        "landing_compare_speed_us",
        "landing_compare_speed_tutor",
        "landing_compare_speed_books",
        "landing_compare_speed_chatgpt",
        "landing_compare_speed_zh_platforms",
      ],
    },
    { labelKey: "landing_compare_row_criteria", cells: ["yes", "yes", "partial", "no", "partial"] },
    { labelKey: "landing_compare_row_chinese", cells: ["yes", "yes", "no", "partial", "yes"] },
    { labelKey: "landing_compare_row_tracks", cells: ["yes", "partial", "no", "no", "partial"] },
    { labelKey: "landing_compare_row_24_7", cells: ["yes", "no", "yes", "yes", "yes"] },
  ];

  export default function ComparisonTable() {
    const { t } = useLanguage();

    function renderCell(c: Cell, isUs: boolean) {
      if (c === "yes") {
        return <span className={isUs ? "font-semibold text-green-700" : "text-green-600"}>{t("landing_compare_yes")}</span>;
      }
      if (c === "no") return <span className="text-gray-400">{t("landing_compare_no")}</span>;
      if (c === "partial") return <span className="text-gray-500">{t("landing_compare_partial")}</span>;
      return <span className={isUs ? "font-semibold text-gray-900" : "text-gray-600"}>{t(c)}</span>;
    }

    return (
      <section id="comparison" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_compare_title")}
          </h2>
          <div className="mt-10 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium text-gray-500"></th>
                  {columns.map((c, i) => (
                    <th
                      key={c}
                      scope="col"
                      className={`px-4 py-3 font-semibold ${i === 0 ? "text-blue-700" : "text-gray-700"}`}
                    >
                      {t(c)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.labelKey} className="border-b border-gray-100 last:border-b-0">
                    <th scope="row" className="px-4 py-3 font-medium text-gray-700">
                      {t(r.labelKey)}
                    </th>
                    {r.cells.map((c, i) => (
                      <td key={i} className={`px-4 py-3 ${i === 0 ? "bg-blue-50/50" : ""}`}>
                        {renderCell(c, i === 0)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Visually verify.** On desktop the full table is visible. On mobile (resize narrow), the table should scroll horizontally inside its container. The IELTSBoost column should be visually highlighted (blue tint).

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/ComparisonTable.tsx lib/translations.ts
  git commit -m "Build landing comparison table"
  ```

---

## Task 8: BilingualShowcase section

Side-by-side EN/中文 feedback screenshot. Until the user provides the real composite image, use a placeholder with two stacked boxes.

**Files:**
- Modify: `components/landing/BilingualShowcase.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add showcase translation keys.**

  ```ts
    // Landing — Bilingual showcase
    landing_bilingual_title: { en: "Same feedback, in either language", zh: "同样的反馈，两种语言" },
    landing_bilingual_subtitle: {
      en: "Switch between English and 中文 with one click. Chinese explanations are written naturally for Chinese learners — not machine-translated.",
      zh: "一键切换英文与中文。中文讲解为中国学习者自然撰写，并非机器翻译。",
    },
    landing_bilingual_image_alt: {
      en: "Side-by-side IELTSBoost feedback in English and Chinese",
      zh: "IELTSBoost 反馈的中英文对照截图",
    },
    landing_bilingual_label_en: { en: "English", zh: "英文" },
    landing_bilingual_label_zh: { en: "中文", zh: "中文" },
  ```

- [ ] **Step 2: Implement `BilingualShowcase.tsx` with placeholder image structure.**

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";

  export default function BilingualShowcase() {
    const { t } = useLanguage();
    return (
      <section id="bilingual" className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_bilingual_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-600">
            {t("landing_bilingual_subtitle")}
          </p>
          <div
            aria-label={t("landing_bilingual_image_alt")}
            className="mt-10 grid gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2"
          >
            <div className="flex aspect-[4/5] flex-col rounded-lg border border-gray-200 bg-gray-50">
              <div className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("landing_bilingual_label_en")}
              </div>
              <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                [English feedback screenshot]
              </div>
            </div>
            <div className="flex aspect-[4/5] flex-col rounded-lg border border-gray-200 bg-gray-50">
              <div className="border-b border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("landing_bilingual_label_zh")}
              </div>
              <div className="flex flex-1 items-center justify-center text-sm text-gray-400">
                [中文 feedback screenshot]
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  ```

  When the user provides a single composite image (`bilingual-showcase.png`) instead of two separate ones, replace the two-column grid with a single `<Image>`. That swap is part of Task 14.

- [ ] **Step 3: Visually verify.** Two side-by-side boxes on desktop, stacked on mobile. The hero's secondary CTA (`#bilingual` anchor) should scroll to this section.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/BilingualShowcase.tsx lib/translations.ts
  git commit -m "Build landing bilingual showcase section"
  ```

---

## Task 9: Pricing section

Free vs. Pro layout. Pro shows three bundles: ¥200/1mo, ¥500/3mo, ¥900/6mo. Free is visually prominent.

**Files:**
- Modify: `components/landing/Pricing.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add pricing translation keys.**

  ```ts
    // Landing — Pricing
    landing_pricing_title: { en: "Pricing", zh: "价格" },
    landing_pricing_subtitle: {
      en: "Free is genuinely useful. Pro is for power users — no pressure either way.",
      zh: "免费版本就足够好用。Pro 是给高频用户准备的——没有压力。",
    },
    landing_pricing_free_title: { en: "Free", zh: "免费版" },
    landing_pricing_free_price: { en: "¥0", zh: "¥0" },
    landing_pricing_free_tagline: { en: "No credit card needed", zh: "无需信用卡" },
    landing_pricing_free_feature_1: { en: "Practice every section", zh: "练习全部部分" },
    landing_pricing_free_feature_2: { en: "Full AI feedback on each submission", zh: "每次提交均有完整 AI 反馈" },
    landing_pricing_free_feature_3: { en: "Track your progress on the dashboard", zh: "在仪表盘上追踪进步" },
    landing_pricing_free_feature_4: { en: "2 writing submissions per day", zh: "每天 2 篇写作提交" },
    landing_pricing_free_cta: { en: "Get started free", zh: "免费开始" },
    landing_pricing_pro_title: { en: "Pro", zh: "Pro 版" },
    landing_pricing_pro_tagline: { en: "Unlimited practice, every section", zh: "无限练习，全部部分" },
    landing_pricing_pro_feature_1: { en: "Unlimited writing submissions", zh: "无限写作提交" },
    landing_pricing_pro_feature_2: { en: "Unlimited speaking practice", zh: "无限口语练习" },
    landing_pricing_pro_feature_3: { en: "Priority on new features", zh: "新功能优先体验" },
    landing_pricing_bundle_1mo: { en: "¥200 / month", zh: "¥200 / 月" },
    landing_pricing_bundle_3mo: { en: "¥500 / 3 months", zh: "¥500 / 3 个月" },
    landing_pricing_bundle_6mo: { en: "¥900 / 6 months", zh: "¥900 / 6 个月" },
    landing_pricing_bundle_3mo_save: { en: "Save 17%", zh: "节省 17%" },
    landing_pricing_bundle_6mo_save: { en: "Save 25%", zh: "节省 25%" },
    landing_pricing_pro_cta: { en: "Choose a plan", zh: "选择方案" },
  ```

- [ ] **Step 2: Implement `Pricing.tsx`.**

  ```tsx
  "use client";

  import Link from "next/link";
  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  const freeFeatures: TranslationKey[] = [
    "landing_pricing_free_feature_1",
    "landing_pricing_free_feature_2",
    "landing_pricing_free_feature_3",
    "landing_pricing_free_feature_4",
  ];

  const proFeatures: TranslationKey[] = [
    "landing_pricing_pro_feature_1",
    "landing_pricing_pro_feature_2",
    "landing_pricing_pro_feature_3",
  ];

  export default function Pricing() {
    const { t } = useLanguage();
    return (
      <section id="pricing" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_pricing_title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-base text-gray-600">
            {t("landing_pricing_subtitle")}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {/* Free card — visually prominent */}
            <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900">{t("landing_pricing_free_title")}</h3>
              <p className="mt-1 text-sm text-gray-500">{t("landing_pricing_free_tagline")}</p>
              <p className="mt-4 text-4xl font-bold text-gray-900">{t("landing_pricing_free_price")}</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {freeFeatures.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                data-cta="pricing-free"
                className="mt-8 block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                {t("landing_pricing_free_cta")}
              </Link>
            </div>

            {/* Pro card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">{t("landing_pricing_pro_title")}</h3>
              <p className="mt-1 text-sm text-gray-500">{t("landing_pricing_pro_tagline")}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_1mo")}</span>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_3mo")}</span>
                  <span className="text-xs font-semibold text-green-700">{t("landing_pricing_bundle_3mo_save")}</span>
                </div>
                <div className="flex items-baseline justify-between rounded-lg bg-gray-50 px-4 py-3">
                  <span className="text-base font-medium text-gray-900">{t("landing_pricing_bundle_6mo")}</span>
                  <span className="text-xs font-semibold text-green-700">{t("landing_pricing_bundle_6mo_save")}</span>
                </div>
              </div>

              <ul className="mt-6 space-y-3 text-sm text-gray-700">
                {proFeatures.map((k) => (
                  <li key={k} className="flex gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>{t(k)}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/upgrade"
                data-cta="pricing-pro"
                className="mt-8 block w-full rounded-lg border border-gray-300 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                {t("landing_pricing_pro_cta")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
  ```

  Pro CTA goes to `/upgrade` (existing route per `e2e/pages.spec.ts`). Free CTA goes to `/signup`.

- [ ] **Step 3: Visually verify.** Free card visually heavier than Pro (thicker border, larger shadow). Three bundle rows visible in Pro card with savings badges on 3mo and 6mo.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/Pricing.tsx lib/translations.ts
  git commit -m "Build landing pricing section with bundle options"
  ```

---

## Task 10: FAQ section

Six accordion-style questions. Local component state only — no global state needed.

**Files:**
- Modify: `components/landing/Faq.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add FAQ translation keys.**

  ```ts
    // Landing — FAQ
    landing_faq_title: { en: "Frequently asked questions", zh: "常见问题" },
    landing_faq_q1: { en: "Is the AI scoring accurate?", zh: "AI 评分准确吗？" },
    landing_faq_a1: {
      en: "We use the official IELTS band descriptors as the scoring rubric and calibrate against published example essays. Like any AI grader, scores are an estimate — but they're consistent enough to track real improvement over time.",
      zh: "我们使用官方雅思评分描述作为评分标准，并根据公开的样本作文进行校准。和任何 AI 评分一样，分数是估计值——但足够一致，能够真实反映你随时间的进步。",
    },
    landing_faq_q2: { en: "Can I use this from China?", zh: "我在中国能用吗？" },
    landing_faq_a2: {
      en: "Yes. IELTSBoost works without a VPN. The site is hosted in a way that's reliably accessible from mainland China.",
      zh: "可以。IELTSBoost 无需 VPN 即可使用，部署方式确保中国大陆可以稳定访问。",
    },
    landing_faq_q3: { en: "Do you cover all four sections?", zh: "四个部分都覆盖吗？" },
    landing_faq_a3: {
      en: "Yes — Writing, Speaking, Reading, and Listening are all available today.",
      zh: "是的——写作、口语、阅读和听力都已上线。",
    },
    landing_faq_q4: { en: "Can I cancel Pro anytime?", zh: "Pro 版可以随时取消吗？" },
    landing_faq_a4: {
      en: "Yes. Pro is structured as a one-time purchase that adds days to your account, not an auto-renewing subscription. Nothing renews unless you choose to.",
      zh: "可以。Pro 版采用一次性购买的方式延长账户使用期，不是自动续费订阅。除非你主动选择，否则不会续费。",
    },
    landing_faq_q5: { en: "How does the bilingual feedback work?", zh: "中英文反馈是怎么实现的？" },
    landing_faq_a5: {
      en: "You can independently set the UI language and the feedback language. Many learners prefer Chinese explanations even while studying English — both are first-class.",
      zh: "你可以分别设置界面语言和反馈语言。许多学习者在学习英文的同时偏好中文讲解——两者都是同等重要的体验。",
    },
    landing_faq_q6: { en: "Is my data private?", zh: "我的数据是隐私的吗？" },
    landing_faq_a6: {
      en: "Your essays and submissions are visible only to you. We don't share or sell your content. See our privacy policy for details.",
      zh: "你的作文和提交内容只有你自己可以查看。我们不会分享或出售你的内容。详情见隐私政策。",
    },
  ```

- [ ] **Step 2: Implement `Faq.tsx` with accordion behavior.**

  ```tsx
  "use client";

  import { useState } from "react";
  import { useLanguage } from "@/lib/language-context";
  import type { TranslationKey } from "@/lib/translations";

  const items: { qKey: TranslationKey; aKey: TranslationKey }[] = [
    { qKey: "landing_faq_q1", aKey: "landing_faq_a1" },
    { qKey: "landing_faq_q2", aKey: "landing_faq_a2" },
    { qKey: "landing_faq_q3", aKey: "landing_faq_a3" },
    { qKey: "landing_faq_q4", aKey: "landing_faq_a4" },
    { qKey: "landing_faq_q5", aKey: "landing_faq_a5" },
    { qKey: "landing_faq_q6", aKey: "landing_faq_a6" },
  ];

  export default function Faq() {
    const { t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
      <section id="faq" className="bg-gray-50 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            {t("landing_faq_title")}
          </h2>
          <div className="mt-10 space-y-3">
            {items.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={item.qKey} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="text-base font-medium text-gray-900">{t(item.qKey)}</span>
                    <span className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>▼</span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-600">
                      {t(item.aKey)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Visually verify.** Click each question to expand/collapse. Only one open at a time. Caret rotates when open.

- [ ] **Step 4: Commit.**

  ```bash
  git add components/landing/Faq.tsx lib/translations.ts
  git commit -m "Build landing FAQ section"
  ```

---

## Task 11: MissionStrip + FinalCta sections

Two short sections — combined into one task because both are tiny.

**Files:**
- Modify: `components/landing/MissionStrip.tsx`
- Modify: `components/landing/FinalCta.tsx`
- Modify: `lib/translations.ts`

- [ ] **Step 1: Add translation keys for both sections.**

  ```ts
    // Landing — Mission strip
    landing_mission_body: {
      en: "We built IELTSBoost to help every learner build the confidence to take the IELTS exam — whether you upgrade or not.",
      zh: "我们做 IELTSBoost，是为了帮助每一位学习者建立参加雅思考试的信心——无论你是否升级 Pro。",
    },

    // Landing — Final CTA
    landing_final_cta_headline: {
      en: "Ready to see your current band?",
      zh: "准备好看看你目前的雅思分数了吗？",
    },
    landing_final_cta_button: { en: "Start practicing free", zh: "免费开始练习" },
  ```

- [ ] **Step 2: Implement `MissionStrip.tsx`.**

  ```tsx
  "use client";

  import { useLanguage } from "@/lib/language-context";

  export default function MissionStrip() {
    const { t } = useLanguage();
    return (
      <section id="mission" className="px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-lg leading-relaxed text-gray-700 sm:text-xl">
            {t("landing_mission_body")}
          </p>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 3: Implement `FinalCta.tsx`.**

  ```tsx
  "use client";

  import Link from "next/link";
  import { useLanguage } from "@/lib/language-context";

  export default function FinalCta() {
    const { t } = useLanguage();
    return (
      <section id="final-cta" className="bg-blue-600 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            {t("landing_final_cta_headline")}
          </h2>
          <Link
            href="/signup"
            data-cta="final"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
          >
            {t("landing_final_cta_button")}
          </Link>
        </div>
      </section>
    );
  }
  ```

- [ ] **Step 4: Visually verify.** Mission strip is quiet/no-CTA. Final CTA is a prominent blue band.

- [ ] **Step 5: Commit.**

  ```bash
  git add components/landing/MissionStrip.tsx components/landing/FinalCta.tsx lib/translations.ts
  git commit -m "Build landing mission strip and final CTA"
  ```

---

## Task 12: Wire conversion analytics

Add Vercel Analytics events to every CTA so we can measure which section converts.

**Files:**
- Create: `lib/landing-analytics.ts`
- Modify: `components/landing/Hero.tsx`, `HowItWorks.tsx`, `Pricing.tsx`, `FinalCta.tsx`

- [ ] **Step 1: Create `lib/landing-analytics.ts`.**

  ```ts
  import { track } from "@vercel/analytics";

  export type LandingCta =
    | "hero-primary"
    | "hero-secondary"
    | "how-it-works"
    | "pricing-free"
    | "pricing-pro"
    | "final";

  export function trackLandingCta(cta: LandingCta) {
    track("landing_cta_click", { cta });
  }
  ```

- [ ] **Step 2: Wire `Hero.tsx` CTAs.**

  Add the import and `onClick` handlers. The links keep their `href`s (so middle-click and right-click "open in new tab" still work) — `onClick` just fires the event before navigation.

  ```tsx
  // Add to imports
  import { trackLandingCta } from "@/lib/landing-analytics";

  // On the primary <Link>:
  onClick={() => trackLandingCta("hero-primary")}

  // On the secondary <a>:
  onClick={() => trackLandingCta("hero-secondary")}
  ```

- [ ] **Step 3: Wire `HowItWorks.tsx` CTA.**

  ```tsx
  import { trackLandingCta } from "@/lib/landing-analytics";

  // On the <Link>:
  onClick={() => trackLandingCta("how-it-works")}
  ```

- [ ] **Step 4: Wire `Pricing.tsx` CTAs.**

  ```tsx
  import { trackLandingCta } from "@/lib/landing-analytics";

  // On the Free <Link>:
  onClick={() => trackLandingCta("pricing-free")}

  // On the Pro <Link>:
  onClick={() => trackLandingCta("pricing-pro")}
  ```

- [ ] **Step 5: Wire `FinalCta.tsx`.**

  ```tsx
  import { trackLandingCta } from "@/lib/landing-analytics";

  // On the <Link>:
  onClick={() => trackLandingCta("final")}
  ```

- [ ] **Step 6: Verify in browser dev tools.**

  Run dev server. Open DevTools → Network tab → filter by `va.vercel-scripts` (or look for analytics POSTs). Click each CTA on the page (Hero primary, Hero secondary, How it works, Pricing Free, Pricing Pro, Final CTA — 6 in total). Each click should trigger one analytics event before navigation. Stop the server.

- [ ] **Step 7: Commit.**

  ```bash
  git add lib/landing-analytics.ts components/landing/Hero.tsx components/landing/HowItWorks.tsx components/landing/Pricing.tsx components/landing/FinalCta.tsx
  git commit -m "Add Vercel Analytics tracking to landing CTAs"
  ```

---

## Task 13: Polish pass — mobile, accessibility, performance

Sweep across the whole page. Fix anything that doesn't pass the bar.

**Files:** Any landing component as needed. No specific file targets.

- [ ] **Step 1: Mobile review.**

  Run dev server. Open DevTools → Toggle device toolbar → iPhone SE (375px width). Scroll the entire page top to bottom. Look for:
  - Horizontal scroll anywhere (the only allowed horizontal scroll is *inside* the comparison table container, not the page itself)
  - Text that overflows or wraps badly in 中文
  - CTAs that are too small to tap (target: minimum 44×44px)
  - Image placeholders that don't maintain aspect ratio

  Fix any issues found.

- [ ] **Step 2: Accessibility audit.**

  In the same DevTools session, run Lighthouse → Accessibility (mobile). Target: 95+. Common fixes:
  - Add missing `alt` text to any real images
  - Ensure heading hierarchy: one `<h1>` (the hero), `<h2>` for each section title, `<h3>` for sub-titles
  - Add `aria-label` to icon-only buttons (the FAQ caret might need attention)
  - Verify contrast ratios on light-gray text against white backgrounds

  Fix any issues found.

- [ ] **Step 3: Performance check.**

  Run Lighthouse → Performance (mobile). Target LCP < 2.5s. The hero placeholder (currently a `<div>`) won't be the LCP element yet — but verify the page weight is reasonable (< 200KB JS, < 100KB CSS).

  When the real hero image lands in Task 14, it will become the LCP element — ensure it uses `<Image>` with `priority` set.

- [ ] **Step 4: Bilingual review.**

  Toggle to 中文 in the navbar dropdown. Scroll the entire page top to bottom and read every section in Chinese. Look for:
  - Awkward translations that don't sound native
  - Strings that are too long for their container
  - Mixed-language displays (a string that's still in English when the toggle is set to Chinese)

  Note any copy changes needed — these can be applied directly to `lib/translations.ts`.

- [ ] **Step 5: Confirm e2e tests still pass end-to-end.**

  Run: `npx playwright test e2e/pages.spec.ts --reporter=list`

  Expected: all tests in the file pass.

- [ ] **Step 6: Commit any fixes.**

  ```bash
  git add -A
  git commit -m "Polish landing page — mobile, a11y, and bilingual fixes"
  ```

  Skip the commit if no changes were needed.

---

## Task 14: Drop in real hero and bilingual showcase images

This task only runs after the user provides the screenshot files at:
- `public/images/landing/hero-feedback-zh.png`
- `public/images/landing/bilingual-showcase.png` (or two separate `bilingual-en.png` + `bilingual-zh.png` files)

**Files:**
- Modify: `components/landing/Hero.tsx`
- Modify: `components/landing/BilingualShowcase.tsx`

- [ ] **Step 1: Replace hero image placeholder with `<Image>`.**

  In `components/landing/Hero.tsx`, replace the placeholder div:

  ```tsx
  // Add to imports
  import Image from "next/image";

  // Replace the placeholder div with:
  <Image
    src="/images/landing/hero-feedback-zh.png"
    alt={t("landing_hero_image_alt")}
    width={1200}
    height={900}
    priority
    className="rounded-xl border border-gray-200 shadow-sm"
  />
  ```

  Adjust `width`/`height` to match the actual screenshot dimensions (keeps the aspect ratio correct).

- [ ] **Step 2: Replace bilingual showcase with the real image(s).**

  If the user provides a single composite image:

  ```tsx
  import Image from "next/image";

  // Replace the two-box grid with:
  <Image
    src="/images/landing/bilingual-showcase.png"
    alt={t("landing_bilingual_image_alt")}
    width={1600}
    height={1000}
    className="mt-10 rounded-xl border border-gray-200 shadow-sm"
  />
  ```

  If two separate files, slot one `<Image>` into each of the two existing boxes (replacing the `[English feedback screenshot]` / `[中文 feedback screenshot]` placeholder text).

- [ ] **Step 3: Verify in browser.**

  Run dev server. Confirm both images load and look sharp on retina (zoom to 200% — they shouldn't blur). Check mobile too.

- [ ] **Step 4: Re-run Lighthouse for LCP.**

  Confirm hero LCP is now < 2.5s. If it's slow, check that the image file isn't massive (> 500KB) — if it is, run it through an optimizer.

- [ ] **Step 5: Commit.**

  ```bash
  git add public/images/landing components/landing/Hero.tsx components/landing/BilingualShowcase.tsx
  git commit -m "Add real hero and bilingual showcase screenshots"
  ```

---

## Self-Review (do this after all tasks above are written, before handing off to execution)

**1. Spec coverage check.** Each spec section maps to a task:

| Spec section | Implementing task |
| --- | --- |
| 1. Hero | Task 2 (+ image swap in Task 14) |
| 2. PersonaCards | Task 3 |
| 3. IeltsGuide | Task 4 |
| 4. HowItWorks | Task 5 |
| 5. PersonalStory | Task 6 |
| 6. ComparisonTable | Task 7 |
| 7. BilingualShowcase | Task 8 (+ image swap in Task 14) |
| 8. Pricing | Task 9 |
| 9. FAQ | Task 10 |
| 10. MissionStrip | Task 11 |
| 11. FinalCta | Task 11 |
| 12. Footer | No-op (already in `app/layout.tsx`) |
| Cross-cutting: bilingual | Each task adds keys to `lib/translations.ts` |
| Cross-cutting: mobile | Tailwind responsive classes throughout + Task 13 review |
| Cross-cutting: a11y | Semantic markup throughout + Task 13 audit |
| Cross-cutting: analytics | Task 12 |
| Cross-cutting: hero LCP | Task 14 (`priority` on `<Image>`) |
| Auth gating | Task 1 onwards: all CTAs route to `/signup` (or `/upgrade` for Pro) |

No spec gaps.

**2. Type consistency.** Translation keys used in components match keys defined in `lib/translations.ts` for that task. CTA names in `data-cta` attributes match the `LandingCta` union in `lib/landing-analytics.ts`. Section `id`s used by the e2e test in Task 1 match the `id`s applied to each section.

**3. No placeholders.** Every step has runnable code or a concrete command. The two image-swap steps in Task 14 explicitly depend on user-provided files, which is called out.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-04-25-landing-page-redesign.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
