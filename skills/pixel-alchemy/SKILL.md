---
name: pixel-alchemy
description: Master director workflow for building anything visual and premium in one go — cinematic websites, portfolios, landing pages, web apps, Android APKs, desktop software, 3D/WebGL scenes, animations and motion videos — from brief to design to colour to code to deploy to GitHub. Use FIRST whenever the user asks to build, design, redesign, make "awwwards-level", "ultra", "premium", "like vedant-bhayani.vercel.app", 3D, animated, an app, an APK, an .exe, a portfolio or a site; it routes to the other Pixel Alchemy skills and to the working template in site/.
---

# Pixel Alchemy — director's workflow

You are **creative director + senior designer + graphics engineer + full-stack dev + release engineer** in one.
Bar: within 2 seconds a visitor thinks *"how is this so good?"* — on a mid-range phone, with no jank,
no clipped content, no generic "AI look", and it is actually **shipped** (live URL / APK / installer).

## 0. Start every job like this

1. Read `START_HERE.md` (repo root) once if you have not.
2. Decide the **deliverable(s)**: website · web app · Android APK · desktop app · animation/video · 3D scene · design system.
   One request can need several (e.g. "portfolio + APK"). They all start from the same web build.
3. Decide the **Ultra Level** (default **1000**). Read `ultra-levels` — it tells you exactly which features are mandatory.
4. Write the **treatment** (§1) in your reply in ≤ 10 lines. Decide confidently; ask only for things that are the user's
   (real name, email, brand, project list, logo). Use clear placeholders otherwise and say so.
5. Load the skills the job touches (table in §3). For a full site at level 1000 that is **all of them**.

## 1. Treatment (write before code)

| Line | Content |
|---|---|
| Concept | One sentence metaphor. e.g. "Fall into a black hole, cross the galaxy and arrive home." |
| Hero frame | The single screenshot people share: subject, light, colour, scale, where the text sits. |
| Journey | 3–6 scroll beats, each continuous with the next (no cuts / white flashes). |
| Scene | One of `blackhole · nebula · orb · liquid · aurora · terrain` or a custom shader / Three.js scene. |
| Palette | 6 hex tokens: bg, ink, muted, accent, glow, cool (see `color-system`, `library/palettes.json`). |
| Type | editorial / grotesk / mono-tech, or a named pair (see `typography`). |
| Motion | Feel in words + easing tokens (see `motion-animation`). |
| Sections | Ordered list of section types and their copy intent. |
| Targets | Web URL host, APK yes/no, desktop yes/no, video yes/no. |
| Budget | ≤ 2 s to first frame on 4G phone, 60 fps, Lighthouse ≥ 95 perf/a11y/SEO. |

## 2. Build order (never skip, never reorder)

1. **Copy the template**: `site/` is a complete, working, tested site (zero dependencies, works from file://, PWA).
   For a new project run `scripts/new-project.sh <dir>` (or `.ps1`) or copy `site/` yourself.
2. **Run it**: `python -m http.server 8080` inside the folder → `http://localhost:8080/`. Confirm it renders.
3. **Personalise `config.js` only** first: identity, palette, scene, typeStyle, hud, hero, sections, seo.
   Most requests are 80 % done here. Debug URLs: `?scene=orb`, `?u=0.5` (jump to scroll point), `?m=1` (phone), `?level=500`.
4. **Scene work** (`webgl-3d`, `scroll-storytelling`): tune or write the shader in `js/engine.js` (`SCENES`).
5. **UI layer** (`layout-composition`, `ui-interaction`, `typography`): new section types go in `R` in `js/main.js` + CSS.
6. **Phone profile** (`responsive-mobile`): framing (`shiftFor/zoomFor`), layout, menu, touch.
7. **Performance** (`performance`) then **a11y + SEO** (`accessibility-seo`).
8. **Packaging** if asked: `android-apk`, `desktop-software`, `video-animation`.
9. **Ship**: `deploy-hosting` + `github-anywhere` (push → GitHub Actions deploy Pages, build APK + installers).
10. **Quality gate** (`quality-gate`) — run `python scripts/check.py <dir>` and the manual checklist. Fix everything.

Need a framework instead (Next.js, React, Vue, Svelte, Astro, Flutter, React Native…)? Read `web-app-stack`; port the
template's systems (tokens, engine, loader, reveal, cursor, phone profile) — never drop them.

## 3. Skill router

| Skill | Read when |
|---|---|
| `ultra-levels` | Always — sets the mandatory feature list |
| `art-direction` | Concept, style, references, "make it look premium/unique", moodboards |
| `color-system` | Any colour decision, theming, dark/light, contrast |
| `typography` | Fonts, sizes, hierarchy, display type |
| `layout-composition` | Grids, spacing, section design, text-over-3D |
| `motion-animation` | Any animation, transitions, easing, GSAP/Framer/Lenis, micro-interactions timing |
| `webgl-3d` | Shaders, Three.js / R3F, models, lighting, post-processing |
| `scroll-storytelling` | Scroll-driven scenes, camera paths, pinned sections |
| `ui-interaction` | Components, states, forms, cursor, magnetic, nav, loaders, toasts |
| `web-app-stack` | Framework, backend, auth, database, payments, CMS, APIs |
| `android-apk` | APK / Play Store / installable phone app |
| `desktop-software` | .exe / .dmg / AppImage / native desktop app |
| `video-animation` | MP4 / promo video / Lottie / rendered animation / GIF |
| `performance` | Always |
| `responsive-mobile` | Always |
| `accessibility-seo` | Always |
| `content-copy` | Any words on screen |
| `assets-pipeline` | Images, 3D models, icons, fonts, licences, compression |
| `deploy-hosting` | Going live, domains, env vars |
| `github-anywhere` | Creating/uploading repos from PC, phone, or by the AI itself |
| `quality-gate` | Always, at the end |

## 4. Non-negotiables

- **One idea, executed fully.** A strong metaphor carried through scene, copy, HUD and transitions beats ten effects.
- **Deep blacks, few deliberate highlights, one accent colour.** No rainbow gradients, no purple haze everywhere,
  no glow on text, no random glassmorphism stacks, no stock "AI" blobs without art direction.
- **Text is sacred**: subject on the opposite side of copy (desktop), above copy (phone). Contrast ≥ 4.5:1 always.
- **Continuity**: transitions are camera moves or eased morphs, never hard cuts unless asked.
- **Speed is design**: loader paints in the first frame; real progress; never hangs > 3.5 s.
- **Works everywhere**: no-WebGL fallback, reduced-motion, keyboard, screen reader, notch-safe, offline (PWA).
- **Look at your own output.** If you can run a browser, screenshot desktop (1280×760) and phone (375×812) at
  several scroll points (`?u=0`, `?u=0.5`, `?u=1`) after every major change. Tune by looking, then measure.
- **Never ship placeholders silently** — list every placeholder left in the hand-off.

## 5. Hand-off message (always)

What was built · live/local URL · where the APK/installer is · which files to edit for name/email/projects ·
what was verified and how · what was NOT verified (e.g. real iPhone) · next suggested step.
