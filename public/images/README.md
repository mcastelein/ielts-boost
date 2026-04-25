# Site images

Static image assets for the IELTSBoost site. Organized by purpose.

## Folders

- **`landing/`** — Images used on the public landing page (`app/page.tsx`).
  Hero screenshots, feature screenshots, comparison visuals, etc.
- **`og/`** — Open Graph and social-share preview images (Twitter, WeChat, etc.).
- **`brand/`** — Logos, brand marks, favicon source files.

## Conventions

- **Naming:** `kebab-case`, descriptive. Include the page/section in the name when not obvious.
  Examples: `hero-feedback-zh.png`, `bilingual-comparison.png`, `how-it-works-step-1.png`.
- **Format:** PNG for screenshots, SVG for logos/icons, JPG only for photos.
- **Optimization:** Source files can be uncompressed. Next.js's `<Image>` component handles AVIF/WebP conversion at request time.
- **Resolution:** Hero images should be at least 2× the display size (e.g., 2400px wide for a 1200px display) to look crisp on retina displays.

## Usage

Reference from components as `/images/<folder>/<file>`:

```tsx
import Image from "next/image";

<Image
  src="/images/landing/hero-feedback-zh.png"
  alt="Sample IELTS feedback in Chinese"
  width={1200}
  height={800}
  priority
/>
```
