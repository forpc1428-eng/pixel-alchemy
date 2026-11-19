---
name: quality-gate
description: Final verification for every Pixel Alchemy build — automated checks (scripts/check.py), screenshots at multiple scroll points on desktop and phone, correctness, visual quality, motion continuity, framing, accessibility, performance numbers, packaging, licences, secrets and an honest hand-off. Use at the end of every build or change and whenever asked "is it perfect / ready / check everything".
---

# Quality gate — nothing ships until every box is ticked

Run `python scripts/check.py site` (or your project folder) first; fix every FAIL and WARN you can.

## A. Correctness
- [ ] Zero console errors/warnings from your code; no shader errors (`window.__ultra.failed === false`).
- [ ] Every JSON/YAML/config parses; every local file referenced exists (check.py).
- [ ] Works from `http://localhost`, from the deployed URL, and (for APK/desktop) from `file://`.
- [ ] No placeholder left silently — list remaining ones in the hand-off.

## B. Visual (screenshots: desktop 1280×760 + phone 375×812 at `?u=0, .25, .5, .75, 1`)
- [ ] Hero works as a poster. Deep blacks, one accent, no "AI look" items (`art-direction` §4).
- [ ] Subject never behind text; nothing clipped on phone; nothing under notch/home bar.
- [ ] Alignment to grid; consistent radii, lines, icon strokes; no orphans in headings.

## C. Motion
- [ ] Scroll slowly and fast: no jumps, stop-go, white flashes. Reveals stagger; nothing animates `linear` but loops.
- [ ] Reduced-motion: everything readable, nothing loops.

## D. Accessibility & SEO
- [ ] Keyboard-only path works; focus visible; Esc closes menu.
- [ ] Contrast ≥ 4.5:1 on the brightest frame. Lighthouse mobile ≥ 95 a11y/SEO/best-practices.
- [ ] Title, description, OG image, favicon, manifest, JSON-LD (level ≥ 800).

## E. Performance (write numbers in the hand-off)
- [ ] Compile ms, dynamic-res scale at hero and heaviest beat, LCP, total bytes before reveal.
- [ ] Budgets from `performance` §1 met or the gap explained.

## F. Packaging & shipping (level ≥ 900)
- [ ] Pages/Vercel deploy green; live URL opened on phone.
- [ ] APK workflow green; APK installs and opens offline.
- [ ] Desktop workflow green on all three OS.
- [ ] Release created for tags; download links work.

## G. Licences & safety
- [ ] Credits for CC BY assets; font licences kept.
- [ ] No secrets, keystores, `.env`, personal data committed. Real name/email only with consent.

## H. Hand-off (always honest)
Built · URLs · files to edit · verified (how) · NOT verified (e.g. "no physical iPhone test", "macOS build unsigned") · next step.
