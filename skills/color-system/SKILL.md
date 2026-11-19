---
name: color-system
description: Colour science and palette systems for premium UI and 3D — six-token palettes, OKLCH reasoning, dark/light themes, contrast (WCAG), colour in shaders (linear vs sRGB, tone mapping), and a library of 40 tested palettes. Use for any colour choice, theme, brand colour, gradient, dark mode, or when something "looks cheap/too saturated/muddy".
---

# Colour system

## 1. The six tokens (template contract)

| Token | Role | Rule of thumb |
|---|---|---|
| `bg` | Deepest background | Near-black with a hint of hue (L ≈ 2–6 %). Pure #000 only for OLED/space. |
| `ink` | Main text | Off-white (L ≈ 92–95 %), slightly warm or cool to match bg. Never pure #fff on pure #000 for long text. |
| `muted` | Secondary text, labels | ink at ~55 % lightness. Must still hit 4.5:1 on bg for body sizes. |
| `accent` | Links, CTAs, highlights, italic emphasis | ONE colour. High chroma, used on < 5 % of pixels. |
| `glow` | 3D hot colour (light source, disk, sun, core) | Usually the accent's hotter/warmer sibling. |
| `cool` | 3D shadow/rim/sky colour | Complementary-ish to glow (warm/cool contrast creates depth). |

Set in `config.js → palette`. Pick from `library/palettes.json` (40 palettes, each tested on the template) or design one.

## 2. Designing a palette

1. Start from the concept's **light source** (sun = amber, aurora = green/teal, neon = magenta, studio = neutral white).
2. Choose `glow` = that light; `cool` = the opposite temperature at lower chroma.
3. `accent` = glow pushed toward legibility (lighter, slightly less saturated for text).
4. `bg` = cool's hue at very low lightness; `ink` = glow's hue at very high lightness, very low chroma.
5. Check: accent on bg ≥ 4.5:1, ink on bg ≥ 12:1, muted on bg ≥ 4.5:1.
6. Think in **OKLCH**: keep lightness steps even; vary chroma, not lightness, for "more colourful".
   CSS supports `oklch()` and `color-mix(in oklab, …)` (template uses color-mix with a fallback).

## 3. Ratios (60-30-10, adapted for dark cinematic UI)

~85 % bg/scene darks · ~12 % ink/muted text · ≤ 3 % accent. If the accent appears on more than ~3 CTAs per screen, it stops
being an accent.

## 4. Colour in 3D / shaders

- Convert sRGB hex to **linear** before lighting (`pow(c, 2.2)`; the engine does it in `hexToLin`).
- Light in linear space, then **tone map** (ACES in engine) then gamma (`pow(1/2.2)`). Never clamp before tone mapping.
- Add 1–2 LSB **dithering** to kill banding in dark gradients (engine does).
- Warm key + cool fill/rim = depth. Same-hue key and fill = flat.
- Highlights desaturate toward white (real sensors): `mix(color, vec3(1), smoothstep(...))`.

## 5. Light themes

Same tokens, inverted roles: bg L ≈ 97 % (warm paper), ink L ≈ 12 %, accent darkened until 4.5:1 on paper.
Scenes still render dark inside a framed card or as a hero band — don't brighten shaders until they look washed.

## 6. Quick fixes

Looks cheap → reduce saturation of large areas, keep it on small accents. Muddy → raise contrast between bg and the
subject; remove a colour. Too "AI" → kill purple-pink gradients, pick one temperature story. Text hard to read over 3D →
panel scrim (`--panel`), never a text-shadow glow.
