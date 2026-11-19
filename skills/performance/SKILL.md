---
name: performance
description: Instant-load and 60 fps performance engineering for heavy visual sites and apps — budgets, critical path, inline loader, font and asset loading, shader compile time, dynamic resolution, caching headers, service workers, Core Web Vitals and how to measure them. Use always on builds, and whenever something is slow, janky, heavy, or Lighthouse scores are low.
---

# Performance

## 1. Budgets (level ≥ 700)

| Metric | Desktop | Phone (4G, mid-range) |
|---|---|---|
| First paint (loader) | < 300 ms | < 600 ms |
| Hero ready / LCP | < 1.5 s | < 2.5 s |
| Bytes before reveal | ≤ 1.5 MB | ≤ 400 KB |
| Frame time | ≤ 16.7 ms | ≤ 22 ms |
| CLS / INP | < 0.05 / < 200 ms | same |
| Shader compile | < 1 s (Windows Chrome worst) | < 1.5 s |

Template baseline: ~120 KB of text + 3 fonts (~90 KB) + icons; shader compile ~10–40 ms.

## 2. Critical path
Inline loader CSS in `<head>` → preload 1–2 fonts → CSS → `defer`-equivalent scripts at end of body. No render-blocking
third parties. Images: AVIF/WebP, `width/height` set, `loading="lazy"` below the fold, `fetchpriority="high"` for the LCP image.

## 3. GPU
Dynamic resolution (engine) · DPR cap 1.5–1.75 · bounded loops with early exit · phone `#define`s lower ·
pause on `visibilitychange` · no per-frame allocations · one rAF loop. Three.js: dispose geometries/textures, instancing,
KTX2 textures, `AdaptiveDpr`.

## 4. Caching
Immutable long cache for fonts/hashed assets; short + stale-while-revalidate for JS/CSS; `no-cache` for `sw.js`
(see `site/vercel.json`, `site/netlify.toml`). Service worker: cache-first assets, network-first HTML. **Bump `VERSION` in
sw.js on every deploy** that changes files.

## 5. Measure
Chrome DevTools Performance (4× CPU, Fast 4G) · Lighthouse (mobile) · `window.__omni.scale` (dynamic res level) and
`__omni.compileMs` · WebPageTest for real devices · `python scripts/check.py site` for size budgets.
