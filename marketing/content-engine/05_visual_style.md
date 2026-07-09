# Visual Style

The visual system below is what makes a slideshow recognisable as IELTSBoost. All seven weekly templates (`11_weekly_templates.md`) share this system; only content changes.

## Format

- 9:16 vertical, 1080x1920 px
- Mobile-first, designed for Douyin and Xiaohongshu carousels

## Color palette

| Role | Color | Hex (approx) | Usage |
|---|---|---|---|
| Brand primary | Deep blue-purple | `#3A2E8C` | Headlines, key Chinese characters, CTA pill |
| Brand secondary | Royal blue | `#2D3FCB` | Bandana, accent fills |
| Background | Pale lavender / off-white | `#F4F1FA` | Slide backdrop |
| Headline ink | Near-black | `#1A1A1A` | Primary headline contrast |
| Highlight | Marker yellow | `#FFD93D` | Underlines, "Example:" tab, sparkles |
| Error red | Bright red | `#E63946` | ❌ pill, error labels |
| Fix green | Bright green | `#06D6A0` | ✅ pill, fix labels |
| Body neutral | Cool gray | `#6B7280` | Sub-headlines, secondary text |

## Typography

**Chinese headlines**
- Heavy sans-serif (Source Han Sans Heavy / Noto Sans CJK Black equivalent)
- Two-tone within one headline: most characters near-black, key power words in deep purple
- Sized very large (≈110–140 px) so the slide reads well as a thumbnail

**English example text**
- Clean sans-serif (Inter / SF Pro feel)
- Lives inside the white "Example:" card
- Key target words underlined with yellow marker stroke

**Sub-labels (问题: / Example:)**
- Small rounded pill or tab
- White text on colored background

## Layout grid

```
┌─────────────────────────┐
│  [pill label]           │  ← top: ❌ 错误① / ✅ 这样改 / etc
│  HEADLINE LINE 1        │
│  HEADLINE LINE 2        │  ← largest visual weight
│                         │
│  [问题: short prompt]   │  ← optional sub-label tab
│  ┌───────────────────┐  │
│  │ Example: …        │  │  ← white card with shadow
│  │ English text with │  │
│  │ yellow underlines │  │
│  └───────────────────┘  │
│                         │
│  ┌──────┐               │
│  │speech│      🐱       │  ← mascot lower-right
│  │bubble│   (mascot)    │
│  └──────┘               │
└─────────────────────────┘
```

Rough thirds: top = headline, middle = content card, bottom = mascot + speech bubble.

## Brand accent elements

**Yellow marker underline**
- Hand-drawn wavy stroke under key Chinese phrases (e.g. 丢分, 不明确)
- Also under English target words inside the example box
- ~6–10 px thick, slight variance for an organic, hand-drawn feel

**Sparkles / stars**
- Small four-point sparkles (✦) and short motion lines around the headline or the cat's gesture
- Color: yellow + deep purple, mixed
- Used sparingly to draw the eye to the title or the mascot

**Dotted background pattern**
- Sparse dot grid in pale purple, concentrated in the upper corners
- Always subtle — never competes with the foreground

**Curved decorative shapes**
- Soft purple semi-circles or quarter-circles in the lower corners
- Always behind the mascot, never on top

## Pill / label system

- **Error pill:** red filled circle with white ❌, followed by red text — `❌ 错误①` `❌ 错误②` `❌ 错误③`
- **Fix pill:** green filled circle with white ✅, followed by green text — `✅ 这样改`
- **Sub-prompt tab:** small purple/blue tab with white text — `问题:`
- **Example tab:** small yellow tab with dark text `Example:` attached to the top-left of the white card
- **CTA pill:** large dark-purple rounded rectangle with white text — `👉 IELTSBoost.AI`
- **Feature pill:** white rounded rectangle with a small purple icon circle on the left and short Chinese text (e.g. 🤖 免费AI批改 / ⏱ 1分钟出结果)

## Card styling

- White rounded rectangle, ~24 px corner radius
- Soft drop shadow (low opacity, blurred)
- Optional 1–2 px purple border on speech bubbles

## Composition rules

- One idea per slide
- Headline must be readable at thumbnail size (~200 px wide)
- Mascot is always present, always wearing the bandana
- Speech bubble never overlaps the headline
- Maintain ~80 px safe margin from each edge
- Background must stay light — never dark mode

## Avoid

- Stock-photo aesthetics
- Tiny text or paragraphs of body copy
- More than one example card per slide
- More than three colors in a single text block
- Replacing the cat mid-carousel
- Generic infographic icon packs (use the brand-specific shapes shown in slideshow #1)
- Cambridge / IDP / British Council branding
