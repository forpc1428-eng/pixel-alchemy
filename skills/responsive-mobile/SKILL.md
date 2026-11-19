---
name: responsive-mobile
description: Mobile-first responsive design for immersive sites and apps — dedicated phone profile, portrait 3D framing, touch interactions, safe areas/notches, viewport units (svh/lvh), menus and bottom sheets, tablet and foldables, testing matrix. Use always, and whenever something breaks, clips, overflows or feels wrong on phones/tablets.
---

# Responsive & mobile

## 1. Phone profile (template)
`MOBILE = ?m=1 || pointer:coarse || width < 760` → `.mobile` class, lighter shader defines, DPR 1.5, subject framed high
(`shiftFor → [0,.2]`, `zoomFor → 1.45`), no cursor/magnetic/tilt, no pointer parallax, full-screen menu sheet.

## 2. Rules
- Units: `100svh` for hero (no jump when URL bar hides), `100lvh` for the fixed canvas. Never `100vh` alone.
- `viewport-fit=cover` + `env(safe-area-inset-*)` on top bar, footer, toasts.
- Tap targets ≥ 44×44, spacing ≥ 8px. Hover-only features must have a tap equivalent.
- Body 16px min (prevents iOS zoom on inputs). Line length ~35–45ch on phones.
- No horizontal scroll ever (`overflow-x:hidden` on body + check wide elements like marquees).
- Single column grids under 900px; stats 2×2; nav → menu.
- Respect data saver (`navigator.connection.saveData`) → drop to level 300 scene or static poster.

## 3. Test matrix
360×800 (small Android) · 390×844 (iPhone) · 412×915 (large Android) · 768×1024 (tablet portrait) · 1024×768 landscape ·
1280×760 · 1920×1080. Real device over LAN: `python -m http.server 8080 --bind 0.0.0.0` → open `http://<pc-ip>:8080` on
the phone. Remote debug: Chrome `chrome://inspect` (Android), Safari Develop menu (iOS).
