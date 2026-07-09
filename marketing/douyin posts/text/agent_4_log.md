# Agent 4 — Process Improvement Log

**My role:** Live prompt refinement. I do not generate ideas, write posts, or review them. I watch the outputs from Agents 1, 2, 3 and refine their prompts (`agent_prompts/agent_1_prompt.md`, etc.) between iterations so the next round is sharper.

## How I work

1. Wait for an output to land in this folder (`outlines.md`, `post_ideas.md`, or `review_notes.md`).
2. Read the new output plus the prompt that produced it.
3. Diagnose: what did the agent do well, where did it drift from intent, what was ambiguous in the prompt?
4. Edit the relevant `agent_prompts/agent_N_prompt.md` to close the gap. Bump the version line.
5. Log the change here with: timestamp, which prompt changed, why, what I expect to improve next round.

I refine prompts. I do not rewrite agent outputs directly.

---

## Iteration log

### Round 0 — Initial prompt draft (2026-05-17)

**Prompts authored:**
- `agent_1_prompt.md` v0.1 — outlines, 50+ ideas distributed across T1–T7
- `agent_2_prompt.md` v0.1 — full post text in markdown-wrapped JSON, per-template field schema
- `agent_3_prompt.md` v0.1 — 10-point review checklist + patterns section

**Design decisions made up front:**
- Agent 1 outputs structured outline blocks (not free-form ideas) so Agent 2 has a deterministic input shape.
- Agent 2's per-template slide-field schema is locked in `agent_2_prompt.md` so all posts of the same template have parallel JSON keys — that lets a downstream image-gen pipeline rely on field names without per-post code paths.
- Agent 3 outputs verdicts (SHIP / REVISE / REWRITE / CUT) so the next iteration has clear action items, not a vague vibe check.
- Markup tokens `{P}/{H}/{Y}` only — no invention — because the slide renderer (or human compositor) only knows those.

**Risks I'm watching for in round 1:**
- Agent 1 producing 50 ideas that are minor variants of each other (e.g. five "vocab upgrade" ideas with overlapping words). If this happens, I'll add an explicit diversity matrix to its prompt.
- Agent 2 producing English examples that are too clean (band 8 disguised as band 6). If reviewer flags this, I'll add a band-calibration sub-section to Agent 2's prompt.
- Agent 3 going easy and rubber-stamping everything. The current prompt has a "be a real critic" calibration line — if reviews still skew positive, I'll add a forced-distribution rule (e.g. "at least 15% must get CUT or REWRITE").
- Chinese naturalness drift — neither Agent 1 nor Agent 2 has a native-Mandarin-speaker check built in. If reviews flag awkward translations, I'll inject a few canonical idiomatic phrases Agent 2 must use as anchors.

---

### Round 1 → Round 2 refinements (2026-05-17)

**Round 1 results:**
- Agent 1 → 56 outlines (8 per template), distributed across T1–T7. Already noted a 105-idea prior pool (now archived at `post_ideas_archive_prior_round.md`).
- Agent 2 → 56 full posts in `post_ideas.md`. Zero skipped, zero merged. Flagged ~10 prompt-side friction items.
- Agent 3 → SHIP 42 / REVISE 14 / REWRITE 0 / CUT 0. 75% SHIP — just under the "too easy" line, with self-acknowledged leniency on T3.

**Diagnosis:**
The pipeline produced a usable batch on round 1. Most failures were prompt-side (silent field invention, no explicit achievability rule, no statistics rule, monotone hooks) rather than agent reasoning failures. The Agent 1 → Agent 2 handoff has a few structural mismatches (T3 outlines too dense, T5 step counts unbounded, T7 formula length unbounded) that I'm closing.

**Edits made:**

**`agent_2_prompt.md` v0.1 → v0.2** — substantial rewrite:
- **Codified all template inner-field names** in concrete JSON blocks. Closes the biggest friction item: Agent 2 had invented ~15 field names because the v0.1 prompt only listed top-level slide names. Pinned: `reason1/2/3`, `issue1/2/3`, `change1/2/3`, `step_desc`, `pill_label`, `myth_quote`, `truth_card`, `action_desc`, `bad/better/best/context_note`, `tip1/2/3`, `formula_display`, `common_error`, `card_body`, `headline`, `sublabel`, `icon1/2/3_label`, `speech_bubble`. Now Agent 3 has something deterministic to validate against.
- **Added the achievability rule.** Band-7+/8 English examples must be writable by a determined Chinese student with a strong week of prep. ~25-word cap. Named details over abstract policy framing. Anchored with concrete bad/good contrast (Iceland anecdote vs editorial-policy sentence).
- **Added the no-unverified-statistics rule.** Either source or rephrase qualitatively. Listed three round-1 offenders as bans.
- **Added hook diversification** with 4 alternative patterns and a "max 4 consecutive posts in same hook shape" rule.
- **Clarified em-dash scope** — JSON string values only; markdown post headers OK.
- **Set speech-bubble cap at 8 chars** and explicitly called out the `用 X！` label-not-voice failure mode for T3.
- **Capped T5 at 3 steps** and banned composite `pill_label` like `"Step 2 加 3"`.
- **Capped T7 formula at 4 components.**
- **Locked `slide6_cta`** as a universal CTA with only `headline` variable.

**`agent_1_prompt.md` v0.1 → v0.2** — light additions:
- Skill area distribution targets adjusted: more Listening (+2), more Pronunciation (+1, prosody/stress), slightly fewer Writing T2.
- **Hard caps that propagate to Agent 2's schema:** T3 ≤ 3 vocab pairs per post, T5 ≤ 3 strategy steps, T7 formula ≤ 4 components. If a topic needs more, split into two posts.
- Hook diversification echoed at outline level — Agent 1 signals the hook style in the **Hook angle** line so Agent 2 has variation to draw from.
- Statistics caveat — don't lock Agent 2 into numbers it can't defend.

**`agent_3_prompt.md` v0.1 → v0.2** — calibration anchors:
- Replaced soft "if 80% SHIP you're too easy" with explicit target distribution (SHIP 60–75%, REVISE 20–30%, REWRITE/CUT ≥ 1–2 if deserved).
- Added three auto-REVISE anchors from round 1: T3 batch monotony, made-up stats, editorial-academic English.

**What I expect to improve in round 2:**
- Field-name consistency: should hit 100% template fidelity. No more `slideN.foo` invention.
- Achievability: band-7+/8 examples should all be reproducible. Posts 9, 28, 51, 56 type ceiling-drift should disappear.
- Statistics: no fake numbers. Posts 35, 41, 48 type issues should disappear.
- T3 monotony: speech-bubble variation rule + counting only 3 pairs upfront should break the rhythm.
- Hook variation: at least 25–40% of hooks in alternative patterns (vs ~5/56 in round 1).

**Risks of these edits:**
- The Agent 2 prompt grew significantly (most of the new content is reference schemas, which are inherently long). If the new length causes Agent 2 to skim, I'll restructure into a separate `schemas.md` file in round 3.
- Hard caps on T3/T5/T7 may push some inherently denser topics into split posts. That's fine — better two clean posts than one overstuffed one — but watch for Agent 1 awkwardly splitting topics that read better together.
- The Agent 3 forced distribution could push false REVISEs to hit the quota. If round 2 starts flagging genuinely strong posts just to make numbers, relax to a softer target.

---

## Refinement criteria (decision rules for myself)

- **Tighten prompt** when an agent produces output that's technically correct but misses intent.
- **Add example** when an agent produces structurally wrong output (wrong field names, wrong format).
- **Add constraint** when an agent overproduces in one dimension at the cost of another (e.g. lots of T1 ideas, no T6).
- **Add anti-pattern list** when the same mistake repeats across iterations.
- **Leave alone** when the issue is the agent's reasoning, not the prompt — instead, flag it to Michael for a manual nudge.

A prompt that grew by 50% between rounds and didn't fix the underlying issue is over-engineered. Roll back and try a different framing.
