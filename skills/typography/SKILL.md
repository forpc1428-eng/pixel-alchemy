---
name: typography
description: Typography for premium web, app and motion work — font pairing, fluid type scales, display type, hierarchy, line length, kinetic/split text, font loading and licensing. Use for any font choice, heading design, "make the text look better/premium", hero titles, or readability issues.
---

# Typography

## 1. Three systems in the template (`config.js → typeStyle`)

| Style | Display | Body | Mood |
|---|---|---|---|
| `editorial` | Bodoni Moda (high-contrast serif) | Montserrat | luxury, cinematic, magazine |
| `grotesk` | Montserrat 500, tight tracking | Montserrat | modern, product, Swiss |
| `mono-tech` | System monospace, uppercase | Monospace | terminal, HUD, dev tools |

Other proven pairs (all free, Google Fonts / Fontshare — self-host WOFF2):
Fraunces + Inter · Playfair Display + Manrope · Instrument Serif + Inter Tight · Cormorant + Work Sans ·
Space Grotesk + Space Mono · Clash Display + Satoshi · General Sans + JetBrains Mono · Syne + DM Sans ·
PP-style neo-grotesks → use Inter Tight / Geist as free alternatives.

## 2. Scale & rhythm

- Fluid sizes with `clamp(min, base + vw, max)` — see `--t-*` tokens in `css/style.css`.
- Ratio 1.25 (UI) → 1.333 (editorial). Hero display may jump 3–5× the h2.
- Display: line-height .85–.95, tracking −0.03 to −0.05em. Body: 1.55–1.7, tracking 0.
- Labels/kickers: 11–12px, uppercase, tracking .2–.32em, `muted` colour.
- Measure: 45–75 characters (`max-width: 52ch`). Never full-width paragraphs.
- Numbers: `font-variant-numeric: tabular-nums` for HUDs, counters, prices.

## 3. Hierarchy recipe for any section

kicker (label) → h2 (display, one italic accent word via `*word*`) → body (≤ 3 sentences) → action.
Only ONE italic accent per heading. Accent colour on that word only.

## 4. Kinetic type

- Hero split into characters, each masked (`overflow:hidden` line) and translated from 105 % with 30–45 ms stagger,
  1.1 s `--ease-out` (template does this).
- Marquee of keywords between sections (≥ 30 s per loop; slower = more premium).
- Never animate body text letter-by-letter. Never typewriter effects on paragraphs.

## 5. Loading & licences

Self-host WOFF2 subsets (latin), `font-display: swap`, `<link rel=preload>` the 1–2 fonts used above the fold.
Keep total fonts ≤ 3 files / ≤ 150 KB. Check licence (OFL is fine to bundle; keep its notice). Never hotlink paid fonts.
