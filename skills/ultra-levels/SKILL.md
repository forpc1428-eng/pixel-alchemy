---
name: ultra-levels
description: The Ultra Forge quality scale from Level 1 to Level 1000 (ten tiers of 100) that defines exactly which design, motion, 3D, performance, accessibility, packaging and shipping features are mandatory for a build. Use whenever the user mentions a level, "ultra", "max", "1000", "super high graphics", "best possible", "basic/simple version", or when deciding how far to take a build. Default is Level 1000.
---

# Ultra Levels (1 → 1000)

Every build has a level. **Default = 1000.** A level is cumulative: Level 700 includes everything from tiers 1–7.
Inside a tier, higher numbers mean more polish passes on the same features (e.g. 650 vs 610 = more tuning iterations).
`config.js → level` (and `?level=` in the URL) switches runtime features in the template:
`<300` no WebGL (CSS gradient scene) · `≥400` PWA/offline · `≥500` magnetic buttons + card tilt · `≥600` custom cursor.

Machine-readable version: `library/levels.json`.

| Tier | Levels | Name | Mandatory additions |
|---|---|---|---|
| 1 | 1–100 | **Clean** | Semantic HTML, responsive, one font pair, 6-token palette, readable 16px+ body, working links, title/description |
| 2 | 101–200 | **Designed** | 8-pt spacing system, fluid type scale, grid, consistent radii/lines, hover/focus states, favicon, OG image |
| 3 | 201–300 | **Animated** | Reveal-on-scroll with stagger, eased transitions (no `linear`), loader, smooth anchor scrolling, reduced-motion support |
| 4 | 301–400 | **Immersive** | Real-time WebGL scene (template engine or Three.js), scroll-linked progress, pointer parallax, no-WebGL fallback |
| 5 | 401–500 | **App-grade** | PWA (manifest + service worker + icons), offline, installable, copy-to-clipboard + toasts, magnetic CTAs, card tilt |
| 6 | 501–600 | **Studio** | Custom cursor (fine pointers only), split-text hero reveal, marquee, counters, live HUD tied to scroll, section-aware nav |
| 7 | 601–700 | **Cinematic** | Story treatment with 3–6 continuous beats, camera choreography, dynamic resolution, ACES tone mapping, dithering, grain |
| 8 | 701–800 | **Production** | Lighthouse ≥ 95 (perf, a11y, best-practices, SEO), WCAG 2.2 AA, structured data, sitemap/robots, security headers, cache headers |
| 9 | 801–900 | **Shipped everywhere** | Live deploy (Pages/Vercel/Netlify), GitHub repo, CI checks, Android APK build, desktop installers build, README for the user |
| 10 | 901–1000 | **Award / Ultra** | Signature idea nobody else has, bespoke shader or model, sound design optional (muted by default), screenshot-tested at ≥ 6 scroll points on desktop + phone, every number tuned, zero console errors, full quality gate passed, promo video/GIF if asked |

## How to apply

1. Read the user's words: "simple"/"basic" → 100–300 · "nice"/"modern" → 400–600 · "premium"/"agency" → 700–800 ·
   nothing said, "best", "ultra", "1000", "like vedant-bhayani.vercel.app" → **1000**.
2. State the level in the treatment. Build every mandatory item of every tier up to it.
3. In the quality gate, tick the tier checklist. A build that misses one item of a tier is rated at the tier below.

## The 1000 polish passes (what "more levels" means inside a tier)

Polish is a loop, run until nothing improves: **look → list 10 flaws → fix → measure → repeat**.
Typical flaws found per pass: a 2px misalignment, an easing that feels cheap, a word that's vague, a colour 3 % too bright,
a frame drop at one scroll point, a tap target 40px instead of 44px, an image 80 KB too heavy. Level 1000 = you ran
passes until a pass found nothing worth fixing on both desktop and phone.
