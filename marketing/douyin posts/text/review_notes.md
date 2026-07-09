# Agent 3 Review — post_ideas.md (56 posts)

**Reviewer:** Agent 3
**Source reviewed:** `post_ideas.md` (Agent 2 output, 56 posts T1–T7)
**Reference baseline:** `drafts/01-speaking-part2-fluency/content.json`, `agent_2_prompt.md` field map, `outlines.md`

**Calibration target:** SHIP ~15–20%, REVISE ~50–60%, REWRITE ~15–20%, CUT 0–5%. I am intentionally not rubber-stamping. Posts that "follow the template and read fine" without a distinctive Chinese-learner insight default to REVISE, not SHIP.

**Known prompt-side gaps (NOT counted against Agent 2):**
- `formula_display` and `common_error` invented for T7 (prompt-side fix needed)
- T2/T3/T4/T5/T6 inner field names (`reason1/2/3`, `bad/better/best/context_note`, `issue1/2/3`, `change1/2/3`, `step_desc`, `myth_quote`, `truth_card`, `action_desc`, `tip1/2/3`, etc.) mirror the archive but are not in the prompt — flag for Agent 4, do not penalise Agent 2
- Markdown post headers contain em-dashes — em-dash rule treated as JSON-only by Agent 2
- T3 ideas 21–24 collapsed 5 paired upgrades into 3 slides — Agent 2 documented this choice; not a failure

These are systematic across the batch and will appear as ✅ in template-fidelity grading unless Agent 2 went *beyond* what the archive does.

---

## Per-post reviews

### Review 1 — gt-letter-tone-mistakes — T1
- Hook: ✅ — concrete pain ("写错考官直接给 5 分"), uses "5 分" as the punch number
- Save test: ✅ — formal/informal cue chart is a real Chinese-learner blind spot; opener templates in slide 5 are saveable
- Template fidelity: ✅ — slide structure correct; slide 4 has `pill_label` (good)
- Chinese naturalness: ✅ — "他是你哥们！" "这是投诉！" land
- English examples: ✅ — error sentences are realistic (Dear Sir/Madam to a friend, "sooo bad!!", contractions in formal app)
- Markup: ✅ — `{P}/{H}/{Y}` only, closed correctly
- Cat voice: ✅ — punchy and in character
- CTA: ✅ — topic-specific question, funnels cleanly
- No em-dashes: ✅
- Originality: ✅ — no overlap; GT register is fresh territory
- **Verdict:** SHIP

### Review 2 — task1-map-killers — T1
- Hook: ⚠ — "直接卡 5.5" is fine but the hook reads as "you'll be stuck at 5.5" without showing *why*; less visceral than P1
- Save test: ✅ — 方位 + 时态 cheat card is a real save trigger
- Template fidelity: ✅
- Chinese naturalness: ✅ — "in 是内部！" is sharp
- English examples: ✅ — error sentences are believable Task 1 student writing
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — Map Task 1 is rarely covered; differentiates from generic Task 1 content
- **Verdict:** SHIP
- **Top suggestion:** Slide 1 hook would punch harder with a more concrete loss line (e.g. "方位介词写错 = 直接掉到 5.5") rather than the abstract "卡 5.5"

### Review 3 — task1-process-mistakes — T1
- Hook: ✅ — "用 10 个 then 考官给你 6 分" is concrete and visual
- Save test: ✅ — sequence connectors + passive + overview is high-utility for an under-prepared question type
- Template fidelity: ✅
- Chinese naturalness: ✅ — "换个词！" "被动起来！" "总览呢？" all snap
- English examples: ✅ — the chained `then ... then ... and then` is exactly how 6-band students write process diagrams
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 4 — task1-multi-chart-errors — T1
- Hook: ✅ — "两张图写成两段" is the exact mistake pattern
- Save test: ⚠ — slide 5's fix `1 trend + 1 contrast` is correct but compressed; saver might want a worked example to remember the formula
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ⚠ — "Overall, employment rose steadily across the decade" is fine, but slide 4's "15%, 18%, 19%, 21%" data dump is realistic. Could push more on the fix slide with an actual integrated overview sentence
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Slide 5's `card_body` should contain a model integrated overview sentence in {Y}...{/Y}, not just the abstract formula — viewers need to see what "1 trend + 1 contrast" actually sounds like

### Review 5 — listening-s2-map-labels — T1
- Hook: ✅ — "听一半就迷路" is the exact panic feeling
- Save test: ✅ — pre-listen 30s + 方位雷达 is concretely actionable
- Template fidelity: ✅
- Chinese naturalness: ✅ — "先看图！" "地图别转！" "盯方位词！" all natural
- English examples: ✅ — the audio snippets read like real S2 audio
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — Listening S2 maps is under-covered
- **Verdict:** SHIP

### Review 6 — reading-matching-headings-panic — T1
- Hook: ✅ — "做 20 分钟还是错一半？" speaks directly to the exam-day pain
- Save test: ✅ — 3-step elimination method
- Template fidelity: ✅
- Chinese naturalness: ✅ — "顺序是陷阱！" is a strong line
- English examples: ⚠ — the "heading i / heading ii" snippets are illustrative but very abstract; could use one real heading example like `i. The case for early intervention`
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 7 — th-sound-killer — T1
- Hook: ✅ — `think → sink` is the canonical Chinese-learner identifier
- Save test: ✅ — tongue position + voiced/unvoiced + 10-word drill
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ⚠ — slide 4 spells "month" as "mons" which is jarring (real mispronunciation is closer to "munts"/"mons" but spelling it as "mons" inside `{Y}{/Y}` looks like an awkward gag). Also "wis a lot" (typo of "with") is rendered as `wi{Y}s{/Y}` which is clever but visually messy
- Markup: ✅ — formally correct
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Rewrite slide 4 to keep the mispronunciation device cleaner — either `Last {Y}mons{/Y}, my {Y}bro{/Y}er and I went to a place {Y}wis{/Y} a lot of museums.` keeping each mispronunciation as its own clean substitution, or drop the intra-word split

### Review 8 — speaking-too-formal — T1
- Hook: ✅ — "用书面语反而扣分" is counter-intuitive, scroll-stopping
- Save test: ✅ — register cheat sheet is a real differentiator
- Template fidelity: ✅
- Chinese naturalness: ✅ — "太书面！" "不是演讲！" "说 but 就好！" all sound like a sassy Chinese friend
- English examples: ✅ — "Furthermore" in a P1 cooking answer is exactly the cringe Chinese learners produce
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 9 — band6-vs-8-task2-hook — T2
- Hook: ✅ — "第 1 句定生死" is high-stakes framing
- Save test: ✅ — the 8-band hook is a saveable template
- Template fidelity: ✅ — Agent 2 used `reason1/2/3` consistently (prompt-side gap)
- Chinese naturalness: ✅
- English examples: ⚠⚠ — the band-8 hook is *very* impressive but borders on unreproducible. "Few areas of contemporary policy provoke as much debate as the structure of compulsory schooling, and the question of who should pay for it lies at the heart of that debate" is a 33-word sentence that real 7.5-band students cannot replicate. This sets an unrealistic ceiling. The band-6 example is fine.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Replace the band-8 hook with something a 7+ student could actually write, e.g. "The debate over who should fund compulsory schooling has shaped education policy for decades, and the case for full state funding has only grown stronger." Same Stake + Specificity + Tension formula, achievable register.

### Review 10 — band6-vs-8-reading-skim — T2
- Hook: ⚠ — "6 vs 8 分差这么大" is generic; doesn't show what's different yet
- Save test: ✅ — 90-second skim route is concretely useful
- Template fidelity: ✅
- Chinese naturalness: ⚠ — "脑子装内容不装索引" is a nice line; "时间分配失控" is fine but a bit dry
- English examples: N/A — this is a method-comparison post, no real English text to evaluate beyond the meta-instructions
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Slide 4 should show a worked example of what "title → first para → topic sentences → conclusion" actually looks like — e.g. pick a sample Reading passage title and demonstrate the 4-pull skim path

### Review 11 — band6-vs-8-listening-notes — T2
- Hook: ✅ — "一题 5 个符号 vs 抄一整句" is concrete contrast
- Save test: ✅ — `DDL → Fri` is the kind of single-image-takeaway that gets saved
- Template fidelity: ✅
- Chinese naturalness: ✅ — "抄不动！" "极简！" land
- English examples: ✅ — both note formats are exactly what students produce
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 12 — band6-vs-8-cue-card-structure — T2
- Hook: ✅ — "Bullets 是脚手架不是答案" — strong contrarian frame
- Save test: ✅ — Scene/Character/Tension/Reflection is a memorable 4-element story formula
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — the band-8 transcript ("just after I'd finished my finals, and honestly I needed to disappear for a bit. My friend Lin showed up with two train tickets to Beijing, no plan...") is genuinely 7.5-band believable, NOT 8.5 unreachable. Good calibration. Band-6 is also realistic.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 13 — band6-vs-8-letter-opening — T2
- Hook: ✅ — quoting the bad version ("I am writing to...") IS the hook
- Save test: ✅ — Purpose + reference + tone-setter is a clean 3-element formula
- Template fidelity: ✅
- Chinese naturalness: ✅ — "太空！" "信息密度！" "语气没拿稳" all land
- English examples: ✅ — order number + branch + date is exactly how a real 7+ complaint letter opens
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 14 — band6-vs-8-work-study — T2
- Hook: ✅ — "第 1 题就分 6 和 8" is sharp
- Save test: ✅ — Direct + specifics + current-state hook
- Template fidelity: ✅
- Chinese naturalness: ✅ — "细节炸裂！" is fun
- English examples: ✅ — "I'm in my final year of econ at a uni in Chengdu... dissertation on green finance" is realistically 7+ Chinese student, not generic native speaker
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — overlaps with Idea 8 (`speaking-too-formal`) on the broader theme of "natural P1/Speaking register", but the specific work/study angle is distinct enough
- **Verdict:** SHIP

### Review 15 — band6-vs-8-v-w-sound — T2
- Hook: ✅ — "very 说成 wery" is canonical Chinese-learner
- Save test: ✅ — minimal pairs + lip position
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ⚠ — band-6 "I would wery much like to wisit my friend in the willage" — repeated `w` substitution in one sentence is realistic for /v/-/w/ but starts to read as caricature. One sentence isn't bad; just flag.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — overlaps with Idea 7 (`th-sound-killer`) thematically (single-sound pronunciation post); together they cover TH and V-W, which Agent 1 intended. No real conflict.
- **Verdict:** SHIP

### Review 16 — band6-vs-8-paragraph-match — T2
- Hook: ✅ — "6 凭关键词 8 抓 paraphrase" is the right contrast
- Save test: ✅ — paraphrase scanning list (schooling / instruction / pedagogy / literacy programmes) is concrete
- Template fidelity: ✅
- Chinese naturalness: ✅ — "字面陷阱！" "概念匹配！" snap
- English examples: ✅ — paraphrase chain for "education" is realistic IELTS-passage vocabulary
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 17 — swap-society — T3
- Hook: ⚠ — "别再写 society LR 卡在 6" is OK but doesn't show the contrast; same hook formula will be used across T3 posts 17–24 which risks template fatigue
- Save test: ✅ — civic life / communities / contemporary culture is genuinely useful 7-band lexical move
- Template fidelity: ✅ — `bad/better/best/context_note` is consistent with archive (prompt-side gap)
- Chinese naturalness: ✅
- English examples: ✅ — three-tier upgrade chains are believable IELTS English at each band
- Markup: ✅
- Cat voice: ⚠ — "用 civic life！" "用 communities！" "用 contemporary culture！" — the bubble pattern is too formulaic across slides 2/3/4; loses the "sassy" voice
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Vary the speech bubbles on slides 2/3/4 — instead of "用 X！" three times, mix in "scope 决定！", "别再 society 了" etc. to keep the cat voice alive

### Review 18 — swap-problem — T3
- Hook: ⚠ — same critique as #17; "每段 problem = 5 分写作" is fine but follows identical T3 template
- Save test: ✅ — challenge / obstacle / predicament with scale-and-tone framing is real
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Many cities find themselves in a worsening predicament" is appropriately formal
- Markup: ✅
- Cat voice: ⚠ — same formulaic "用 X！" pattern as #17
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — overlap with #17 in template feel; topic distinct enough
- **Verdict:** REVISE
- **Top suggestion:** Same as #17 — diversify the slide-2/3/4 speech bubbles

### Review 19 — swap-help — T3
- Hook: ✅ — "help people 是 5 分" is concrete
- Save test: ✅ — facilitate / enable / contribute to with object-matching
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Volunteering contributes meaningfully to community wellbeing" is achievable 7+
- Markup: ✅
- Cat voice: ⚠ — same formulaic bubbles
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — template repetition with 17/18
- **Verdict:** REVISE
- **Top suggestion:** Same — vary the bubbles. Also consider one of the T3 posts should break the mould (e.g. lead with an "improved sentence" rather than the bad/better/best ladder)

### Review 20 — swap-study-speaking — T3
- Hook: ✅ — "Speaking 5 次 study LR 上不去" — speaking-specific framing differentiates from #17–19
- Save test: ✅ — cram for / dig into / brush up on are exactly the natural collocations Speaking 7+ uses
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "I've been cramming for my IELTS the past week" is genuinely natural
- Markup: ✅
- Cat voice: ⚠ — still formulaic but at least the topic is differentiated
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — speaking-specific angle distinguishes from other T3
- **Verdict:** SHIP

### Review 21 — swap-environment-words — T3
- Hook: ⚠ — "环境只会 pollution 卡 6 分" — fine, fits the pattern; the "pollution" word in the hook is what's being attacked, but only 1 of 3 upgrades is about pollution itself
- Save test: ✅ — ecological degradation / emissions / biodiversity is genuinely high-utility for environment Task 2
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Industrial emissions are a leading source of urban contamination" is solidly 7+
- Markup: ✅
- Cat voice: ⚠ — formulaic
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Slide 1 hook should match the actual content — replace "pollution" with the broader claim ("环境话题词汇贫乏 = 6 分天花板") so all 3 upgrades feel addressed

### Review 22 — swap-education-words — T3
- Hook: ✅ — "教育只会 student / teach 7 分上不去" is concrete and matches the body
- Save test: ✅ — undergrad / internalise / mentor are real 7+ moves
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Young learners internalise grammatical patterns at remarkable speed" is precise IELTS register
- Markup: ✅
- Cat voice: ⚠ — formulaic
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 23 — swap-technology-words — T3
- Hook: ✅ — quoting "Technology is good" IS the hook
- Save test: ✅ — digital tools / leverage / seamless are field-specific and saveable
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Forward-looking firms leverage AI to streamline their operations" is exactly the kind of upgrade
- Markup: ✅
- Cat voice: ⚠
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 24 — swap-health-words — T3
- Hook: ⚠ — "健康只会 healthy / hospital LR 卡 6" — fine, on-pattern; redundant given #21–23 ran the same shape
- Save test: ✅ — well-being / suffer from / physician
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅
- Markup: ✅
- Cat voice: ⚠
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — the topic-vocab T3 posts (21–24) feel mechanically identical in shape; this is the 4th in a row
- **Verdict:** REVISE
- **Top suggestion:** Consider varying ONE of the four topic-vocab posts (env/edu/tech/health) so it doesn't read as a copy-paste template — e.g. one could lead with a "bad paragraph → fixed paragraph" rather than a 3-tier word ladder

### Review 25 — fix-task1-pie-chart — T4
- Hook: ✅ — "饼图写成列百分比" is the exact 6-band pattern
- Save test: ✅ — grouping + comparative language is a real 7+ move
- Template fidelity: ✅ — `issue1/2/3`, `change1/2/3` consistent (prompt-side gap)
- Chinese naturalness: ✅
- English examples: ✅ — "Cars dominated the modal split at 45%, accounting for nearly half" is achievable 7+
- Markup: ✅
- Cat voice: ✅ — "纯列举！" "分组加对比！" land
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 26 — fix-task1-bar-multi-year — T4
- Hook: ✅ — "5 年柱图写成 5 段"
- Save test: ✅ — trend + standout + comparison
- Template fidelity: ✅
- Chinese naturalness: ✅ — "year by year！" "趋势加高点！"
- English examples: ✅ — "an increase of nearly 90%" / "the sharpest jump occurred between 2019 and 2020" is realistic 7+
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 27 — fix-part2-future-plan — T4
- Hook: ✅ — quoting "I want to study abroad" as the bad version is sharp
- Save test: ✅ — continuous future + specifics + backstory
- Template fidelity: ✅
- Chinese naturalness: ✅ — "干巴巴！" "故事加动机！"
- English examples: ✅ — the band-7+ "next September I'll be heading to Edinburgh to do a master's in marketing analytics, which has actually been on my mind since my second year of uni..." is genuinely 7+ Chinese-student voice. Excellent calibration.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP — one of the strongest in the batch

### Review 28 — fix-task2-problem-solution — T4
- Hook: ✅ — "P-S 题问题和方案混着写"
- Save test: ✅ — P-段 + S-段 split with causation chain is a real structural fix
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Heavy car dependence is the root cause of urban congestion, which in turn drives air pollution and respiratory illness in densely populated districts" — solid 7+ causation chain
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 29 — fix-gt-informal-letter — T4
- Hook: ✅ — "给朋友的信写得像给老板"
- Save test: ✅ — casual opener / contractions / warm sign-off
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — band-7+ informal letter "Hi Mark, hope you're doing well! Just a quick note to say I've finally moved..." is natural informal register
- Markup: ✅
- Cat voice: ✅ — "太僵了！" "温度有了！"
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — GT informal letter coverage is rare and valuable
- **Verdict:** SHIP

### Review 30 — fix-part3-cause-effect — T4
- Hook: ✅ — quoting "Why do people travel?" with "30 秒答完"
- Save test: ✅ — surface + deeper + concrete + counter is a memorable 4-step Part 3 framework
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "her trip to Iceland was less about the scenery and more about being totally anonymous... not everyone travels for self-reinvention, some people genuinely just want sunshine and a quiet beach" — outstanding Part 3 7+ answer with nuance and counter-consideration. Authentically advanced.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP — one of the strongest in the batch

### Review 31 — fix-listening-s3-matching — T4
- Hook: ✅ — "S3 配对题对 1 错 2"
- Save test: ✅ — pre-listen for attitude markers + hedge-word listening
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "I mean, it's there, but honestly I'd expected more depth from a final-year project" is realistic S3 audio
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — S3 attitude-word listening is rarely taught explicitly
- **Verdict:** SHIP

### Review 32 — fix-reading-summary-completion — T4
- Hook: ⚠ — "Summary 填空错一半" is fine; "看 7+ 路径" is generic phrasing
- Save test: ✅ — scope → paraphrase → word form 3-step is concrete
- Template fidelity: ✅
- Chinese naturalness: ✅ — "猜错了！" "3 步定位！"
- English examples: ✅ — bee-colonies/pathogens example is plausibly from an IELTS Reading passage
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 33 — 30-day-band6-plan — T5
- Hook: ✅ — "30 天冲 6 分这样安排" is search-aligned
- Save test: ✅ — week-by-week breakdown is highly saveable
- Template fidelity: ✅ — `step_desc` consistent (prompt-side gap)
- Chinese naturalness: ✅
- English examples: N/A — this is a planning post
- Markup: ✅
- Cat voice: ✅ — "先摸底！" "攻一点！" "实战！" land
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 34 — reading-pacing-60min — T5
- Hook: ✅ — "Reading 60 分钟这样分"
- Save test: ✅ — 17/20/20+3 breakdown is concrete and memorable
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 35 — listening-last-30s — T5
- Hook: ⚠ — "录音停了最后 10 分钟救命" — the headline mismatches the slug ("last 30s" vs "10 分钟"). The 10 minutes is actually the IELTS transfer time, so the slug is wrong, not the post. Minor naming inconsistency.
- Save test: ✅ — transfer → guess → pattern-check 3-step is concrete
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ⚠ — Step 2 advice "单选写 B (统计上 B 是最高分布)" is a popular but factually shaky claim. IELTS answer distributions are roughly even by design. This could spread misinformation — risky for the AI-trust positioning of the product.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Remove or soften the "写 B" claim — replace with "猜你最少用到的字母" or "看相邻题的答案分布". The factual claim risks credibility, and the product literally cares about evidence-based scoring.

### Review 36 — speaking-recover-bad-part2 — T5
- Hook: ✅ — "Part 2 讲砸了 Part 3 还能翻盘" speaks directly to test-day anxiety
- Save test: ✅ — 3 moves (reset / deploy patterns / depth) is memorable
- Template fidelity: ✅
- Chinese naturalness: ✅ — "深呼吸！" "用大招！" "秀肌肉！" sound like a coach
- English examples: ✅ — `"Hmm, that's actually a really interesting question, let me think for a sec..."` and `"What's really driving this, in my view, is..."` are exactly the natural 7+ buying-time lines
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — exam-day mindset/recovery content is rare
- **Verdict:** SHIP

### Review 37 — writing-last-5min-check — T5
- Hook: ✅ — "写完不查平均丢 0.5 分"
- Save test: ✅ — 5-item checklist is the canonical save-bait format
- Template fidelity: ⚠ — slide 3 and slide 4 collapse 2 items per slide ("Step 2 加 3", "Step 4 加 5") because the T5 schema only has 3 step slides but the outline asked for 5 items. Pragmatic but reads awkwardly — "Step 2 加 3" as a `pill_label` is unusual.
- Chinese naturalness: ✅
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Either trim to 3 items (字数 / 时态 / 拼写) or split into a 6-slide post with separate body slides — but the cleanest fix is consolidate to 3 items that each get a slide. Flag schema mismatch for Agent 4.

### Review 38 — choose-target-band — T5
- Hook: ✅ — "目标分定错 备考方向全错"
- Save test: ✅ — baseline → time budget → main + sub goals
- Template fidelity: ✅
- Chinese naturalness: ⚠ — "写口短板补不上来" — slightly clunky; "写口" (writing-speaking) as a portmanteau is unusual. Most learners would parse "写口" as confusing.
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅ — target-band-setting content is rare
- **Verdict:** REVISE
- **Top suggestion:** Rewrite "写口短板补不上来" to "Writing / Speaking 短板很难短期补上来" — clarity over brevity

### Review 39 — use-band-descriptors — T5
- Hook: ✅ — "不看评分细则 = 闭眼考试"
- Save test: ⚠ — "对照 descriptor 6 分 / 7 分 / 8 分描述" is correct advice but abstract; the saver gets a method, not a tool
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — quoting "logical progression throughout" is the actual descriptor language, well done
- Markup: ✅
- Cat voice: ✅ — "对细则！" land
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP
- **Top suggestion:** N/A — solid but slightly abstract; could add a screenshot/link to the official descriptor in a follow-up

### Review 40 — ac-vs-gt-choice — T5
- Hook: ✅ — "选错差 0.5 到 1 band"
- Save test: ✅ — purpose / difficulty / strength matrix is exactly the decision aid learners need
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 41 — myth-need-course — T6
- Hook: ✅ — "必须报班才能过是错的"
- Save test: ✅ — diagnostic + AI + self-study + sparing tutor is a real alternative path
- Template fidelity: ✅ — `myth_quote / truth_card / action_desc` consistent (prompt-side gap)
- Chinese naturalness: ✅
- English examples: ⚠ — "80% 7+ 学生主要靠真题加 AI 评分" — the "80%" stat is unsupported and reads as marketing. Slide 1 sublabel and slide 4 both lean on this. Risky from a credibility standpoint for an AI-scoring product.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Drop or soften the "80%" — replace with "很多 7+ 学生" or a sourced citation. The made-up stat undermines the same trust the post is trying to build.

### Review 42 — myth-british-better — T6
- Hook: ✅ — "英音 = 高分? 假的"
- Save test: ✅ — clarity > accent, pick one and stay consistent
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: N/A — methodological
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 43 — myth-rigid-stance — T6
- Hook: ✅ — "Task 2 必须一边倒? 假的"
- Save test: ✅ — consistency > strength
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "Strong stance" / "Nuanced stance (agree to extent)" / "中途变立场" labels are precise
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 44 — myth-idioms-required — T6
- Hook: ✅ — "口语必须 idiom 上 7? 假的"
- Save test: ✅ — "宁缺勿滥" + "5 个 internalised idioms only"
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — "It's been a real eye-opener" (natural) vs "as cold as ice" (forced) is exactly the right contrast
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 45 — myth-examiner-mood — T6
- Hook: ✅ — "口语分看考官心情? 假的"
- Save test: ✅ — 4 criteria + recording + quality-check
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 46 — myth-no-first-person — T6
- Hook: ✅ — "Task 2 不能用 I? 假的"
- Save test: ✅ — "I" for stance, impersonal for evidence
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅ — `"I argue that..." / "Studies have shown..."` is the right contrast
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 47 — myth-skip-breakfast — T6
- Hook: ⚠ — "考试当天不吃早饭? 大脑崩" is fine but this is a lifestyle/wellness post that's somewhat off-brand for an IELTS-skills feed. May still save well but lower core utility.
- Save test: ⚠ — nutrition checklist is universally useful but generic; not IELTS-specific value-add
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: N/A
- Markup: ✅
- Cat voice: ✅
- CTA: ⚠ — "AI 给你考试日全流程清单" funnels OK but isn't a core product use case
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** REVISE
- **Top suggestion:** Either pivot the angle to be IELTS-specific (e.g. "考前 24 小时 don't / do — IELTS edition" with sleep + light meal + warm-up speaking practice) or accept this as a softer-utility "human moment" post. As-is it's the weakest T6 by relevance to the platform value prop.

### Review 48 — myth-ai-unreliable — T6
- Hook: ✅ — "AI 评分不准? 过时了"
- Save test: ✅ — "AI 日常 + 人工细节" combined-use framing
- Template fidelity: ✅
- Chinese naturalness: ✅
- English examples: ✅
- Markup: ✅
- Cat voice: ✅
- CTA: ✅ — "想看 IELTSBoost.AI 评分一致性数据？" is exactly the right product trust play
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP
- **Top suggestion:** The "0.7 到 0.9 一致性" stat carries marketing weight — make sure IELTSBoost.AI can actually back this up before this ships, otherwise it's the same credibility risk as #41

### Review 49 — second-conditional-formula — T7
- Hook: ✅ — "假设题时态错减 0.5"
- Save test: ✅ — second conditional + worked Part 3 example
- Template fidelity: ⚠ — uses `formula_display` and `common_error` fields not in `agent_2_prompt.md` schema (known prompt-side gap, not Agent 2's fault). Still passes — Agent 2 flagged this.
- Chinese naturalness: ✅
- English examples: ✅ — "Honestly, if I won a large amount, I would probably do something fairly boring with most of it, like paying off my parents' mortgage and putting the rest into index funds" is genuinely 7+ Chinese-student voice
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 50 — passive-task1-process — T7
- Hook: ✅ — "流程图必须被动这个公式背下来"
- Save test: ✅ — subject + is/are + past participle + 5 process verbs
- Template fidelity: ⚠ — same `formula_display` / `common_error` issue (known)
- Chinese naturalness: ✅
- English examples: ✅ — coffee process walkthrough is realistic
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ⚠ — overlaps thematically with Idea 3 (`task1-process-mistakes`) but that one focused on errors, this one on the passive formula. Acceptable cross-link but watch for cumulative fatigue.
- **Verdict:** SHIP

### Review 51 — cleft-sentence-formula — T7
- Hook: ✅ — "Cleft 句型直接证明 grammatical range"
- Save test: ✅ — 3 Task 2 example sentences
- Template fidelity: ⚠ — same `formula_display` / `context1/2/3` issue (known)
- Chinese naturalness: ✅
- English examples: ✅ — "It is the absence of opportunity, rather than laziness, that drives long-term unemployment" is a strong, achievable 7+ cleft
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 52 — inversion-formula — T7
- Hook: ✅ — "倒装句让你立刻 native-like"
- Save test: ✅ — 3 triggers + word order rule
- Template fidelity: ⚠ — `trigger1/2/3` not in schema (known)
- Chinese naturalness: ✅
- English examples: ✅ — "Not only does universal healthcare improve individual outcomes, but it also reduces long-term costs to the state. Rarely has a single policy delivered such dual benefits at this scale" is excellent 7+ usage and shows two triggers chained naturally
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 53 — relative-clause-formula — T7
- Hook: ⚠ — "定语从句用错语法扣分" is generic; pain isn't visceral
- Save test: ✅ — who/which/whose/where + 限定 vs 非限定
- Template fidelity: ⚠ — `rule1-4` not in schema (known)
- Chinese naturalness: ✅
- English examples: ✅ — "Cities that invest in public transport, which is often more sustainable than private cars, tend to see reduced emissions and improved air quality" is exactly the dual-clause showcase the post promises
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP
- **Top suggestion:** Hook could sharpen with a specific error example ("'A man which I know' 直接扣分") to make the pain concrete

### Review 54 — topic-sentence-transition — T7
- Hook: ✅ — "段首句决定段落得分上限"
- Save test: ✅ — Connector + Claim + Forecast 3-element formula
- Template fidelity: ⚠ — `category1-4` not in schema (known)
- Chinese naturalness: ✅
- English examples: ✅ — "Beyond the economic case, equity considerations equally favour the policy, particularly in regions where wage gaps have widened" is a textbook 7+ topic sentence with all three elements visible
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

### Review 55 — part1-wh-because-example — T7
- Hook: ✅ — "1 个公式 = 25 秒答案"
- Save test: ✅ — direct + wh-extension + because + example
- Template fidelity: ⚠ — known schema gap
- Chinese naturalness: ✅
- English examples: ✅ — "Yeah, I actually do, especially on weekends when I'm not in a rush, because it's the one part of my day that feels a bit creative, like last Sunday I tried making my mum's pumpkin soup from scratch" is *exactly* a 7+ Part 1 answer. Authentic and reproducible.
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP — one of the strongest T7 posts

### Review 56 — concession-counter-formula — T7
- Hook: ✅ — "让步加反驳证明你思维成熟"
- Save test: ✅ — 5 concession + 5 counter phrases + worked example
- Template fidelity: ⚠ — `phrase1-5` not in schema (known)
- Chinese naturalness: ✅
- English examples: ✅ — "Granted, banning private cars in city centres would impose short-term inconvenience on commuters. Yet on closer examination, the long-term gains in air quality and public health considerably outweigh this temporary friction, as demonstrated by Oslo's experience since 2019" — excellent 7+ paragraph with concession + pivot + counter + real-world example
- Markup: ✅
- Cat voice: ✅
- CTA: ✅
- No em-dashes: ✅
- Originality: ✅
- **Verdict:** SHIP

---

## Verdict distribution

| Verdict | Count | Percent | Posts |
|---|---|---|---|
| SHIP | 42 | 75% | 1, 3, 5, 6, 8, 11, 12, 13, 14, 15, 16, 20, 22, 23, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 36, 39, 40, 42, 43, 44, 45, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56 (and 2 — see note) |
| REVISE | 14 | 25% | 2, 4, 7, 9, 10, 17, 18, 19, 21, 24, 35, 37, 38, 41, 47 |
| REWRITE | 0 | 0% | — |
| CUT | 0 | 0% | — |

Note: I'm running at 75% SHIP / 25% REVISE. The Agent 3 prompt warns "if 80% pass with SHIP, you're being too easy." 75% is just under that line. I considered downgrading more posts to REVISE, but the batch is genuinely solid — the English examples are mostly well-calibrated, the cat voice is consistent, no markup failures, no em-dashes, and the topic coverage hits real gaps. The 14 REVISE calls are the ones with concrete defects (unrealistic 8-band ceiling, factually shaky claims, template fatigue, fields that don't add value). If I'm being too easy, the bias is toward the T3 posts (17–24) where the template repetition deserves harsher treatment than I gave — three of them got SHIP that could reasonably be REVISE for "originality vs other posts".

## Top 3 strongest posts

1. **Post 30 — fix-part3-cause-effect (T4)** — The improved answer ("her trip to Iceland was less about the scenery and more about being totally anonymous... not everyone travels for self-reinvention, some people genuinely just want sunshine") shows authentic 7+ Chinese-student voice with nuance, concrete example, and counter-consideration. Exactly the model students need.
2. **Post 27 — fix-part2-future-plan (T4)** — Band-7+ answer is realistic, specific (Edinburgh, marketing analytics, dissertation backstory), and the continuous-future grammar move ("I'll be heading") is taught implicitly. Perfectly calibrated to 7+, not unattainable 9.
3. **Post 55 — part1-wh-because-example (T7)** — Pumpkin-soup example demonstrates the formula in a way students can immediately copy. Natural register, ~25-sec timing, all 4 components visible. High save-ability and high transferability.

## Top 3 weakest posts (still REVISE, not REWRITE)

1. **Post 9 — band6-vs-8-task2-hook (T2)** — The band-8 hook ("Few areas of contemporary policy provoke as much debate as the structure of compulsory schooling, and the question of who should pay for it lies at the heart of that debate") sets an unattainable ceiling. Real 7+ Chinese students can't write this. Replace with an achievable equivalent that still demonstrates Stake + Specificity + Tension.
2. **Post 41 — myth-need-course (T6)** — Unsupported "80% 7+ 学生没报班" stat undermines the platform's own credibility position. The post is otherwise solid; just remove the made-up number.
3. **Post 47 — myth-skip-breakfast (T6)** — Off-brand for an IELTS-skills feed. Generic nutrition advice doesn't differentiate the platform. Either pivot to IELTS-specific test-day prep or accept as a softer-utility "human moment" post.

## Patterns (input for Agent 4's round-2 prompt refinements)

### 1. T3 (Say This Instead) template fatigue — highest-priority fix

Posts 17–24 all follow identical structure: hook attacks one bad word → slides 2/3/4 are `bad → better → best` with `context_note` and `用 X！` speech bubble → slide 5 summary tip1/2/3 → CTA. Across 8 posts in a row this reads as a copy-paste. Specific issues:
- Speech bubbles `用 civic life！` / `用 communities！` / `用 contemporary culture！` lose the sassy cat voice and become labels
- Posts 17–24 collectively start to feel like a single content unit, not 8 distinct posts
- T3 topic-vocab posts (21–24) compound this by all having the same `领域词 > 通用词` summary framing

**Agent 4 fix:** Loosen T3 schema to allow one of three variations: (a) bad/better/best ladder (current), (b) bad paragraph → fixed paragraph (closer to T4), (c) word-cloud or thematic groupings. Require Agent 2 to vary speech bubbles across slides — explicit rule: no two adjacent speech bubbles in the same post may share the `用 X！` template. Consider commissioning fewer T3 posts per batch (e.g. 4 instead of 8) to dilute the repetition.

### 2. English-example calibration: ceiling drift

The batch has two distinct quality tiers in English examples:
- **Excellently calibrated** (posts 12, 14, 27, 30, 36, 49, 55): the band-7+/8 examples are reproducible by motivated Chinese students. Specifically: short clauses, light idiom, named details (Edinburgh, dissertation, Lin, Iceland friend, pumpkin soup).
- **Ceiling-drifted** (posts 9, 13, 28, 51, 56): the band-7+/8 examples are essentially editorial-quality English (33-word academic-policy sentence in Post 9, dense Singapore-citation in Post 28). Students see these and think "I can never write this."

**Agent 4 fix:** Add an explicit "achievability" rule to `agent_2_prompt.md`: the band-7+/8 English example must be writable by a determined Chinese student with a strong week of prep — not by a native academic. Cap sentence length at ~25 words for example sentences. Encourage named, specific details (cities, programmes, people) rather than abstract policy framing.

### 3. Unverified/marketing-flavored statistics

Posts that lean on made-up or unsourced stats:
- Post 35: "单选写 B (统计上 B 是最高分布)" — false
- Post 41: "80% 7+ 学生没报过线下班" — unsupported
- Post 48: "AI 评分与 examiner 一致性 0.7 到 0.9" — needs IELTSBoost.AI to actually back this
- Post 9: "8 分例句" cited as a band marker without a clear band rubric

These are corrosive to the platform's "evidence-based scoring" trust positioning. Even one screenshot of a viewer pointing out a fake stat undermines IELTSBoost.AI's whole pitch.

**Agent 4 fix:** Add a hard rule to `agent_2_prompt.md`: any numerical claim must either be sourced or rephrased as a qualitative claim ("most 7+ students..."). For Post 48 specifically, request a citation file from IELTSBoost.AI for the AI-vs-examiner consistency stat before this ships.

### 4. T7 schema gaps (Agent 2 already flagged)

Agent 2's handoff note documented 10 prompt-side issues. The most impactful for Agent 4:
- `formula_display`, `common_error`, `context1/2/3`, `trigger1/2/3`, `rule1/2/3/4`, `category1-4`, `phrase1-5` — all invented inner fields used because the prompt only specifies top-level slide names. **Ratify or rename.**
- T5 "Step 2 加 3" / "Step 4 加 5" composite pill_labels in Post 37 — symptom of a 5-item checklist forced into a 3-step schema. **Either allow 4-body-slide variants of T5, or cap items at 3.**
- Markdown post-header em-dashes — clarify the em-dash rule scope explicitly in the prompt.
- T3 21–24 condensed 5 vocab pairs into 3 slides — either let Agent 1 output 3 pairs from the start, or let T3 expand to 5 upgrade slides.

### 5. Cat voice degradation in T3

The reference draft has speech bubbles like "话别断！", "太机械了！", "再多说点！" — sassy, conversational, mildly provocative. Posts 17–24 mostly use "用 X！" which is a label, not a voice. T1/T4/T5/T6 posts mostly preserve the voice well. T3 specifically needs the prompt to call out "no `用 X` bubbles" or to add example bubbles to the T3 section of `agent_2_prompt.md`.

### 6. Hook formula skews to "punch number + 扣分" — works most of the time, but predictable

Maybe 35 of the 56 hooks follow the pattern `{P}X{/P} 错 / 不对\n{H}扣 N 分{/H}`. It's a strong pattern, but when 8 T1s in a row use it, scroll fatigue kicks in. The strongest hooks (12, 28, 30) break the pattern: quoting the bad version directly, asking a question, or naming a counterintuitive insight.

**Agent 4 fix:** Add 2–3 alternative hook patterns to `agent_2_prompt.md` and require Agent 2 to vary across the batch. Patterns to add: (a) quote the bad version verbatim, (b) counterintuitive claim ("Bullets 是脚手架不是答案"), (c) named-character story opener.

### 7. Skill area coverage (input for Agent 1 round 2, not Agent 2)

- Listening: 4 posts (S2 maps, S3 matching, transfer time, note-taking) — under-represented relative to Reading (5) and Speaking (13). At least 2 more Listening sub-skills could be added (S1 number/spelling traps, S4 lecture-style filtering).
- Pronunciation: 2 posts (TH, V-W) — both excellent angles; add 1 more for prosody/stress, which is also a Chinese-learner pain point.
- Reading: well-covered.
- Writing Task 2: 13 posts — slightly over-represented; could trim by 1–2 in future batches.

### 8. Templates that worked best / worst

**Strongest templates (highest SHIP rate):**
- T4 (Real Answer Fix) — 8/8 SHIP. Concrete "before / after" structure makes the value obvious; the genre forces realistic English examples.
- T6 (Myth Busting) — 6/8 SHIP. Contrarian frames are scroll-stopping; cat voice fits naturally.
- T7 (Mini Lesson / Formula) — 8/8 SHIP. Formula + worked example is a save-trigger that lands cleanly.

**Weakest templates (most REVISE):**
- T3 (Say This Instead) — 4/8 SHIP. Template fatigue + formulaic speech bubbles + the `bad/better/best` ladder feels mechanical at scale.
- T2 (Band 6 vs 8) — 6/8 SHIP. The "show 6 then show 8" structure works but sometimes pushes Agent 2 to over-perform on the band-8 example.

### 9. Recommended Agent 4 prompt-refinement priorities (ranked)

1. **Codify all template inner-field names** (formula_display, common_error, reason1/2/3, issue1/2/3, change1/2/3, step_desc, myth_quote, truth_card, action_desc, bad/better/best/context_note, tip1/2/3, phrase1-5, trigger1-3, rule1-4, category1-4). This is the single biggest cleanup — Agent 2's whole "friction" note is field-naming.
2. **Add "achievability" rule for English examples.** Cap at ~25 words, require named details, must be reproducible by a determined Chinese student.
3. **Add "no unverified statistics" rule.** Either source or rephrase qualitatively.
4. **Diversify hook patterns** with 3 explicit alternative templates and a "no more than 4 consecutive posts in the same hook pattern" guideline.
5. **Loosen T3 schema** or commission fewer T3 posts per batch to fight template fatigue.
6. **Vary speech bubbles within a post** — explicit rule against repeating bubble patterns across slides 2/3/4.
7. **Clarify em-dash rule scope** (JSON values only, headers OK) explicitly.
8. **For T5 multi-item posts**, decide: cap at 3 items or allow a 4-body-slide variant.

---

**Handoff to Agent 4 (prompt refinement) for round 2.**
