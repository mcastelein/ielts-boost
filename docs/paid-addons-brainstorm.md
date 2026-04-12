# IELTSBoost — Paid Add-Ons Brainstorm

This document thinks through potential paid add-ons beyond the core free/pro tiers. None of these are implemented yet. The goal is to identify high-value features that justify one-time or recurring charges and create revenue beyond the 200 RMB/month Pro subscription.

---

## Current Monetization Structure (Reference)

- **Free tier**: 2 writing submissions/day, limited speaking
- **Pro tier**: 200 RMB/month, unlimited submissions and full access

---

## 1. Deep Analysis Report

**What it is:**
A comprehensive cross-submission report that analyzes ALL of a user's writing and speaking history to surface patterns, trends, and personalized recommendations. Unlike per-submission feedback (which evaluates one essay), this looks holistically across everything they've done.

**What it includes:**
- Cross-submission pattern analysis
  - e.g. "In 8 of your 12 Task 2 essays, you lose marks on Coherence and Cohesion because your body paragraphs don't link back to your thesis"
  - e.g. "Your Task 1 scores are consistently 0.5-1.0 bands higher than Task 2 — focus more practice on Task 2"
- Vocabulary range assessment
  - Are they reusing the same words across essays?
  - Which topic areas have weak vocabulary (environment, technology, education)?
  - Comparison to band 7+ vocabulary benchmarks
- Grammar error trends
  - Most frequent error types ranked by frequency
  - Are specific errors improving, plateauing, or getting worse?
  - Side-by-side examples from early vs. recent submissions
- Band score trajectory
  - Visual score trend over time
  - Rate of improvement calculation
  - Projected timeline to reach target band (if set)
- Personalized study plan
  - Prioritized action items ranked by estimated impact on band score
  - Specific practice recommendations (e.g. "Write 3 essays focused on cause-solution structure")
  - Weak vocabulary lists to study
  - Grammar rules to review with examples from their own writing
- Speaking pattern analysis (if they have speaking submissions)
  - Common fluency issues
  - Vocabulary repetition patterns
  - Grammar errors that carry over from writing

**Pricing:**
- 30 RMB per report for free and pro users
- Pro users get 1 free deep analysis per week
- Report is generated fresh each time (reflects latest data)

**Minimum data requirement:**
- Should require at least 5 writing submissions before a deep analysis is available, otherwise the patterns aren't meaningful
- Could show a progress bar: "3/5 submissions — 2 more to unlock Deep Analysis"

**Why users pay for this:**
- It's the difference between "here's how this essay did" and "here's what's actually holding you back"
- Feels like getting a tutor's assessment without paying tutor prices
- The more they use the platform, the more valuable this becomes — creates a flywheel

**Implementation complexity:** Medium-high. Requires aggregating all user submissions, sending a large context to the AI, and presenting a structured multi-section report. Could be expensive per generation if context is large — may need to summarize submissions before analysis.

---

## 2. Full Model Essay Generation

**What it is:**
A complete band 8-9 model essay written for the exact prompt the user practiced on, with annotations explaining WHY it scores high.

**How it differs from current rewrite:**
The current feedback already includes a "Higher-Band Rewrite Example" — but this is just one paragraph rewritten. The full model essay add-on would be:
- A complete, full-length essay (250+ words for Task 2, 150+ for Task 1)
- Annotated with margin notes explaining scoring techniques
  - e.g. "This thesis statement works because it directly addresses both parts of the question"
  - e.g. "Notice the use of a concession here — this shows Grammatical Range"
- Side-by-side comparison with the user's essay
- Highlighted differences in structure, vocabulary, and argumentation
- Key takeaways: "3 things this model essay does that yours doesn't"

**Pricing options:**
- 15-20 RMB per model essay
- Or bundled: Pro users get 3/week included
- Could be a one-click upsell right on the feedback page: "Want to see a band 8 version? Generate for 15 RMB"

**Why users pay for this:**
- Learning by comparison is extremely effective for Chinese learners (this mirrors how Chinese English education works — model essays are a big deal)
- More actionable than generic "model essays" from textbooks because it's for THEIR exact prompt
- Natural upsell from the feedback page — they just got told what's wrong, now they want to see what "right" looks like

**Implementation complexity:** Low-medium. It's essentially another AI call with a different prompt. The annotation/side-by-side UI is the harder part.

---

## 3. PDF Report Export

**What it is:**
A polished, downloadable PDF report of either:
- A single submission's feedback (nicely formatted)
- A deep analysis report
- A progress summary over a date range

**What it includes:**
- IELTSBoost branding
- Clean formatting with charts/graphs for scores
- The user's essay text
- All feedback sections nicely laid out
- Score breakdown visuals
- For progress reports: score trend charts, improvement stats

**Use cases:**
- Share with a human tutor or teacher
- Print for offline review
- Show parents/sponsors proof of preparation progress
- Keep as a personal record

**Pricing options:**
- 5-10 RMB per PDF (low friction impulse buy)
- Pro users get unlimited PDF exports
- Could be free for Pro as a perk that makes Pro feel more valuable

**Why users pay for this:**
- Chinese students often need to show progress to parents or institutions
- Tutors may want to see the AI feedback to build on it
- Physical/PDF study materials are still valued, especially for review away from the screen

**Implementation complexity:** Medium. Need a server-side PDF generation library (e.g. puppeteer, react-pdf, or a headless browser approach). Template design takes some effort to look polished.

---

## 4. Speaking Mock Interview (Full Simulation)

**What it is:**
A complete IELTS Speaking test simulation — all three parts in sequence, timed realistically, with comprehensive scoring at the end.

**How it differs from current speaking practice:**
Current speaking module lets users practice individual parts (Part 1, 2, or 3) one at a time. The mock interview would be:
- Full 11-14 minute simulated interview
- Part 1: 4-5 questions on familiar topics (4-5 min)
- Part 2: Cue card with 1 min prep + 2 min response
- Part 3: Follow-up discussion questions (4-5 min)
- Real-time flow — questions adapt based on responses
- Comprehensive post-interview report
  - Scores for each part
  - Overall estimated band
  - Fluency analysis
  - Detailed feedback per section
  - Comparison to previous mock interviews

**Pricing:**
- 40-50 RMB per mock interview
- Pro users get 2/month included
- Premium enough to justify higher price — this replaces a tutored mock interview (which costs 200-500 RMB)

**Why users pay for this:**
- Mock interviews with real tutors are expensive (200-500+ RMB)
- Exam simulation reduces test-day anxiety
- The comprehensive report after is more structured than most tutor feedback
- Can repeat as many times as they want vs. scheduling with a tutor

**Implementation complexity:** High. Requires real-time conversational AI, audio processing, state management across three parts, timing logic, and a comprehensive scoring pipeline. This is a significant feature build.

---

## 5. Weak Area Drill Packs

**What it is:**
Targeted exercise sets generated based on the user's identified weaknesses. If the deep analysis says "your biggest issue is subject-verb agreement and you overuse basic vocabulary for technology topics," this generates a focused drill pack for exactly that.

**What it includes:**
- 10-20 targeted exercises per pack
- Grammar drills with the specific patterns they get wrong
- Vocabulary exercises for their weak topic areas
- Sentence transformation exercises
- Fill-in-the-blank using band 7+ alternatives to their overused words
- Mini writing prompts focused on their weak areas
- Instant checking/scoring of drill responses

**Pricing:**
- 20-25 RMB per drill pack
- Pro users get 1/week generated automatically based on latest analysis
- Could tie to deep analysis: "Based on your report, we recommend these 3 drill packs"

**Why users pay for this:**
- Generic grammar exercises are boring and untargeted
- These are personalized to THEIR specific weaknesses
- Creates a clear path: feedback → analysis → targeted practice → improvement
- Feels like having a tutor design homework for you

**Implementation complexity:** Medium. AI generates exercises based on user weakness data. Needs an exercise UI with answer checking. The personalization logic needs the mistake tracking data to be solid.

---

## 6. Tutor Review Request (Human Layer)

**What it is:**
Users can flag a specific submission for human tutor review. A real tutor (starting with Lina) reviews the AI feedback, adds personal notes, and optionally records a short audio/video explanation.

**How it works:**
- User clicks "Request Tutor Review" on any submission
- Submission enters a review queue
- Tutor reviews the essay + AI feedback
- Tutor adds comments, corrections, or a voice note
- User gets notified when review is ready

**Pricing:**
- 50-80 RMB per review (Task 2)
- 30-50 RMB per review (Task 1, shorter)
- Speaking review: 60-80 RMB
- Tutor gets a cut (e.g. 70%), platform keeps 30%

**Why users pay for this:**
- AI feedback is good but some learners want human validation
- Tutor can catch nuance AI misses
- Personal encouragement and motivation from a real person
- Bridge between pure AI tool and full tutoring — much cheaper than booking a full session

**Implementation complexity:** Medium. Needs a tutor dashboard, review queue, notification system, and payment processing. Lina could start doing this manually with a simple admin interface before building the full system.

---

## 7. Target Score Coaching Plan

**What it is:**
A structured, multi-week study plan generated based on the user's current level and target band score. Updated weekly based on actual performance.

**What it includes:**
- Weekly practice schedule (which task types, how many essays, which speaking parts)
- Daily focus areas
- Milestone checkpoints
- Adaptive — adjusts based on how they're actually performing
- Countdown to exam date
- "Readiness score" — estimated probability of hitting target band

**Pricing:**
- 100-150 RMB one-time (generates plan for their exam timeline)
- Or included with Pro
- Re-generation after significant progress: 50 RMB

**Why users pay for this:**
- Most IELTS learners don't know HOW to practice effectively
- Removes decision fatigue — "just follow the plan"
- The adaptive element means it stays relevant as they improve
- Exam countdown creates urgency and structure

**Implementation complexity:** Medium. The AI plan generation is straightforward. The adaptive/tracking logic and UI to display a multi-week plan with progress is the heavier lift.

---

## Pricing Summary

| Add-On | Price | Pro Included? |
|--------|-------|---------------|
| Deep Analysis Report | 30 RMB | 1/week free |
| Full Model Essay | 15-20 RMB | 3/week free |
| PDF Report Export | 5-10 RMB | Unlimited |
| Speaking Mock Interview | 40-50 RMB | 2/month free |
| Weak Area Drill Pack | 20-25 RMB | 1/week free |
| Tutor Review (human) | 30-80 RMB | Not included |
| Coaching Plan | 100-150 RMB | Included |

## Implementation Priority (Suggested)

1. **Deep Analysis Report** — highest value, reinforces platform stickiness, moderate build
2. **Full Model Essay** — easy to build, natural upsell from existing feedback flow
3. **PDF Report Export** — relatively simple, makes Pro feel premium
4. **Target Score Coaching Plan** — strong retention driver, moderate build
5. **Weak Area Drill Packs** — great but depends on solid mistake tracking data first
6. **Speaking Mock Interview** — highest complexity, save for later
7. **Tutor Review** — save for when Lina is ready to start reviewing

## Revenue Potential Notes

- A user preparing for IELTS over 2-3 months on Pro (200 RMB/mo) = 400-600 RMB base
- Add 2-3 deep analyses, a few model essays, a mock interview = easily 150-250 RMB extra
- Total per-user revenue potential: 550-850 RMB over a prep cycle
- vs. a tutor charging 200-500 RMB per HOUR — IELTSBoost is dramatically cheaper
- The value prop writes itself for price-conscious Chinese learners
