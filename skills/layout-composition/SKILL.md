---
name: layout-composition
description: Layout, grid, spacing and composition for premium websites and apps, especially text over real-time 3D — section patterns, 12-column grids, 8-pt spacing, framing subjects, panels/scrims, visual rhythm across a long scroll. Use when designing sections or pages, placing text over a scene, fixing "cluttered/empty/unbalanced" layouts, or adding new section types.
---

# Layout & composition

## 1. Foundations

- **Spacing**: 8-pt scale (`--s1`…`--s8` = .5 → 10 rem). Section padding = `--s8` desktop, `--s6` phone.
- **Gutter**: `clamp(1.25rem, 4vw, 4rem)`. Max content width 1180–1500px.
- **Grid**: 12 columns desktop, 4 phone. Text blocks span 5–6 cols; media 6–12.
- **Radii**: one radius (`--radius:18px`) + one inner radius (radius − 4). Lines: 1px at 14 % ink.

## 2. Text over 3D (the hardest part)

- Desktop: shift the subject away from the text (`uShift` in engine, `shiftFor()` in main.js; +0.28 = subject right).
- Phone: subject high and smaller (`[0, .2]`, zoom 1.45), text in the lower half.
- Content sections sit in **panels**: 55–65 % bg + 16px backdrop blur + 1px line. Never text directly on bright 3D.
- Dim the scene when content scrolls in (`engine.setDim(1)` → 62 % brightness).
- Alternate panel sides (template does left/right automatically) so the scene "breathes" between them.

## 3. Section patterns (template `type`s and what they're for)

| Type | Pattern | Use |
|---|---|---|
| `about` | Kicker + display h2 + short body, side panel | Who/what, 2–3 sentences |
| `stats` | 4 big numbers with labels, counting up | Proof |
| `work` | 2-col cards with generated art, tilt on hover | Projects/products |
| `services` | Marquee + 3-col bordered grid | Offer |
| `process` | Numbered rows: number / title / description | How you work |
| `quote` | Centered display quote | Breathing room / principle |
| `contact` | Big email link, primary CTA, copy button, socials | Conversion |

Add new types in `R` (main.js) + CSS: e.g. `pricing` (3 cards, middle highlighted), `faq` (`<details>`), `logos`
(marquee of client marks), `team`, `timeline`, `gallery` (masonry), `testimonial` (carousel), `cta-band`.

## 4. Rhythm across a long page

Dense → airy → dense. After 2 content panels, give one full-screen moment to the scene (quote, marquee, or empty
space with the HUD changing). Hero ≈ 100svh; total page 6–9 screens for a portfolio.

## 5. Checks

- [ ] Squint test: one clear focal point per screen.
- [ ] Every edge aligns to the grid or the gutter.
- [ ] No text over the subject at any scroll point (screenshot `?u=0, .25, .5, .75, 1`).
- [ ] Tap targets ≥ 44px; nothing under notch/home bar (`env(safe-area-inset-*)`).
