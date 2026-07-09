# Image Generation Prompts

These prompts are designed for ChatGPT Image Generator (image-2 / GPT Image) to reproduce the IELTSBoost Douyin slideshow style established in `marketing/douyin posts/posted/1/`. They reference the visual system in `05_visual_style.md` and the mascot in `06_mascot_spec.md`.

The structure is **two layers**:
1. A master style anchor (prepended to every slide)
2. A per-slide slot template (filled in for each of the 6 slides)

## Master style anchor — prepend to every slide prompt

```
Style: vertical 1080x1920 (9:16) Chinese-language Douyin educational poster.
Color palette: pale lavender background (#F4F1FA), deep blue-purple (#3A2E8C),
near-black headlines, marker yellow accents (#FFD93D), bright red (#E63946) for
errors, bright green (#06D6A0) for fixes. Heavy sans-serif Chinese typography
(Source Han Sans Heavy style), large enough to read at thumbnail size. Layout:
top third headline, middle third white rounded example card with soft shadow,
bottom third mascot with speech bubble. Sparse dotted pattern in upper corners,
small yellow + purple sparkles around the headline. Hand-drawn wavy yellow
underlines beneath key Chinese power words and English target words.

Mascot (must appear, identical in every slide):
- Maine Coon cat, charcoal gray with darker tabby stripes on head/back,
  cream chest and chin, long tufted fur
- Round gold-rimmed glasses, large amber-gold eyes, small pink nose
- Royal blue bandana tied at neck, white text "IELTS BOOST↑" printed on it
- Cartoon-illustrated, semi-realistic, painterly with clean black outlines
- Identical character across all slides; only pose and expression change

Composition:
- One idea per slide, large readable text, generous white space
- 80px safe margin from all edges
- Headline legible at 200px-wide thumbnail
- Speech bubble never overlaps the headline
- Mascot lower-right or lower-center, never blocking the example card
```

## Per-slide slot template

For each slide, fill the slots below and append after the master style anchor.

```
SLIDE TYPE: {hook | error | fix | cta | comparison_low | comparison_high
  | upgrade | original | annotated | improved | strategy_step | myth | truth
  | formula | example}
TOP LABEL: {none | red ❌ pill "错误①" | green ✅ pill "这样改"
  | red pill "Band 6" | green pill "Band 8" | yellow pill "⚠ 误区" | etc}
HEADLINE (Chinese, two lines max): "{headline_line_1}" / "{headline_line_2}"
HEADLINE COLOR EMPHASIS: {which words are deep purple instead of black,
  which words get a yellow marker underline}
SUB-LABEL: {none | purple "问题:" tab with "{sub_text}"}
EXAMPLE CARD: {none | white rounded card with "Example:" yellow tab and
  English text "{english_example}", with these words underlined in yellow:
  "{words}"}
EXTRA ELEMENTS: {none | three purple icon circles labeled "{ic1}/{ic2}/{ic3}"
  | feature pills with icons | CTA pill containing "IELTSBoost.AI"
  | red-bordered card | green-bordered card | annotated red marks}
MASCOT EXPRESSION: {serious pointing | confused with ? marks | disapproving
  holding red ❌ | skeptical winking thumbs up | enthusiastic thumbs up with
  sparkles | encouraging paw raised | teaching pointing at element}
SPEECH BUBBLE TEXT (Chinese, short): "{bubble_text}" or "none"
```

## Filled examples — slideshow #1 reproductions

### Slide 1 — Hook

```
SLIDE TYPE: hook
TOP LABEL: none
HEADLINE: "90%的雅思考生" / "都在这里丢分！"
HEADLINE COLOR EMPHASIS: "90%" and "丢分" in deep purple,
  yellow wavy underline under "丢分"
SUB-LABEL: small purple pill "⚠ 这3个错误正在拉低你的分数"
EXAMPLE CARD: none
EXTRA ELEMENTS: yellow + purple sparkles around "90%"
MASCOT EXPRESSION: serious pointing, index finger raised
SPEECH BUBBLE TEXT: none
```

### Slide 2 — Error ①

```
SLIDE TYPE: error
TOP LABEL: red ❌ pill "错误①"
HEADLINE: "观点不明确"
HEADLINE COLOR EMPHASIS: "不明确" in deep purple with yellow underline
SUB-LABEL: purple "问题:" tab with "考官看不出你是支持还是反对"
EXAMPLE CARD: white card, "Example:" yellow tab,
  text "Some people think it's good, others think it's bad."
  underline "Some people think" and "others think" in yellow
EXTRA ELEMENTS: none
MASCOT EXPRESSION: confused with floating "?" marks, head tilted
SPEECH BUBBLE TEXT: "你到底想表达什么？"
```

### Slide 5 — Fix

```
SLIDE TYPE: fix
TOP LABEL: green ✅ pill "这样改，立刻提分！"
HEADLINE: "立刻提分！"
HEADLINE COLOR EMPHASIS: "提分" in deep purple, yellow underline
SUB-LABEL: purple tab "结构:"
EXAMPLE CARD: three purple icon circles in a horizontal row:
  💡 "观点" / 📄 "例子" / 🔗 "连接词", each with a one-line Chinese description;
  below them a smaller white card with English example
  "The advantages far outweigh…" with key phrase underlined yellow
EXTRA ELEMENTS: yellow + purple sparkles, small star outline
MASCOT EXPRESSION: enthusiastic, strong thumbs up, sparkles around paw
SPEECH BUBBLE TEXT: "这才是 7+！"
```

### Slide 6 — CTA

```
SLIDE TYPE: cta
TOP LABEL: none
HEADLINE: "想知道你的答案" / "能拿几分？"
HEADLINE COLOR EMPHASIS: "能拿几分?" with yellow underline
SUB-LABEL: none
EXAMPLE CARD: large dark-purple rounded CTA pill containing
  "👉 IELTSBoost.AI" in white text
EXTRA ELEMENTS: two feature pills stacked below the CTA:
  🤖 "免费AI批改" / ⏱ "1分钟出结果"
MASCOT EXPRESSION: encouraging, paw raised waving
SPEECH BUBBLE TEXT: "我帮你改！"
```

## Practical tips for ChatGPT Image-2

- **Generate the mascot once first**, then attach the result as a reference image when generating each subsequent slide. This is the single biggest factor in keeping the cat consistent.
- Even better: attach the canonical logo file `marketing/logo/Image_20260425072406_565_46.png` as a reference image on every slide.
- If the model drifts (changes coat color, removes glasses, swaps bandana for scarf, alters bandana text), regenerate that slide rather than ship inconsistency.
- Always verify the bandana text reads `IELTS BOOST↑` — text fidelity is the most common failure mode.
- Chinese characters can mis-render. Read every slide carefully before posting and regenerate any character that came out garbled.
- Slide-to-slide variation should be in **pose and expression only**. Coat, glasses, bandana, body proportions, and art style must not change.
- Keep one example card per slide. The model handles two cards on the same slide poorly.

## Negative prompt — exclude these explicitly

- No 3D render, no photorealism, no Pixar style
- No Cambridge / IDP / British Council branding or logos
- No human faces
- No additional cats or other animals
- No dark mode / dark backgrounds
- No watermark, no signature, no copyright text
- No tiny body text — everything must be readable at thumbnail size
- No alternate breeds or coat colors for the mascot

## Workflow tie-in

This file is consumed by the workflow in `10_workflow.md`. The weekly template you're producing for that day (see `11_weekly_templates.md`) determines which SLIDE TYPE values you'll use across the 6 slides.
