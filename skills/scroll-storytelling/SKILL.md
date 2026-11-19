---
name: scroll-storytelling
description: Scroll-driven storytelling and camera direction — mapping scroll to a continuous camera journey, pacing curves, beats, holds for content, pinned sections, HUD readouts tied to progress, seamless scale transitions, and jump links. Use when a site should "move as you scroll", for cinematic journeys, product reveals, scrollytelling, or when scroll feels jumpy/stop-go.
---

# Scroll storytelling

## 1. Model

`progress = scrollY / (scrollHeight − innerHeight)` (0..1) → spring → `uP`. Content is normal DOM flow (native scroll,
accessible); the scene is fixed behind and interprets `uP`. Never hijack scroll on touch devices.

## 2. Beats & pacing

Write the journey as beats with progress ranges, e.g. black hole: 0–.15 hero orbit · .15–.5 descent (disk grows,
lensing intensifies) · .5–.8 close pass · .8–1 horizon. Make big visual changes happen *between* content panels;
during a panel the camera glides slowly (holds). If the scene needs non-linear timing, remap:
```js
const PACE=[[0,0],[.1,.05],[.5,.6],[1,1]]; // [scroll, journey]
const pace=f=>{for(let i=1;i<PACE.length;i++){const[a,b]=PACE[i-1],[c,d]=PACE[i];if(f<=c)return b+(d-b)*((f-a)/(c-a));}return 1;};
```

## 3. Camera rules

- Smooth paths: interpolate positions with Catmull-Rom or analytic curves (`mix`, `sin`), never piecewise-linear corners.
- Aim stays locked on the subject during holds; the camera orbits ≤ 30° per screen of scroll.
- Scale changes (galaxy → star → planet) need ≥ 4 screens; cross-fade only via true black.
- Pointer parallax ≤ 0.1 rad, lerped.

## 4. HUD tied to scroll (signature detail)

`config.js → hud: [{label, value: p => ...}]` — three readouts that make the metaphor feel real
(Distance, Bending light, Clock rate for a black hole; Depth/Pressure/Temp for ocean; Altitude/Speed/Heading for flight).
Use tabular monospace numbers; update in the scroll handler.

## 5. Tools

Template spring (0 KB) · GSAP ScrollTrigger (`scrub: 1`, `pin: true` for pinned chapters) · CSS scroll-driven
animations (`animation-timeline: view()`) for simple reveals (Chromium + Safari 26; provide fallback).

## 6. Debug

`?u=0.42` jumps to a point; screenshot every beat on desktop + phone. Scroll the whole page slowly and fast: no
stop-go, no jumps, no white frames.
