---
name: ui-interaction
description: UI components and interaction design for premium sites and apps — navigation, menus, buttons, cards, forms, loaders, toasts, modals, cursors, magnetic effects, empty/loading/error states, and component state matrices. Use when building or polishing any interface element, forms, nav, CTA, dashboards or app screens.
---

# UI & interaction

## 1. State matrix (every interactive element)

default · hover · focus-visible · active/pressed · disabled · loading · success · error. Missing any = not done.
Focus ring: 2px accent, 4px offset. Hover changes ≥ 2 properties subtly (colour + transform), never layout.

## 2. Components in the template

| Component | Behaviour |
|---|---|
| Top bar | Brand · live HUD · nav; gains a bg gradient after scroll; nav highlights the section in view |
| Phone menu | Full-screen sheet, big serif links, burger → X, Esc closes, `aria-expanded` |
| Loader | Inline CSS in `<head>` (paints instantly), real % (fonts + shader), 3.5 s failsafe |
| Buttons | Pill, 48px tall, magnetic, primary = ink fill, hover = accent fill |
| Cards | Generated art (no images needed), tilt + light follow, tag pill, hover border accent |
| Toast | Bottom centre, spring in, auto-hide 2.2 s, `role=status` |
| Cursor | Dot with difference blend, grows on interactive; fine pointers only |
| Scroll cue | Line with dripping accent; hides on scroll, returns when idle |

## 3. Forms (contact, newsletter, checkout)

Labels always visible (no placeholder-only), `autocomplete`, correct `type`/`inputmode`, inline validation on blur,
error text below the field with `aria-describedby`, submit shows loading then success state. Static hosting options:
Formspree, Web3Forms, Netlify Forms, or a serverless function (`web-app-stack`). Honeypot field for spam.

## 4. App screens (dashboards, tools)

Left nav or bottom tab bar (phone) · one primary action per screen · skeletons instead of spinners for content ·
empty states with a sentence + action · optimistic updates · undo instead of confirm dialogs where possible ·
keyboard shortcuts for power users (`⌘K` command palette).

## 5. Copy on UI

Verbs on buttons ("Start a project", not "Submit"). Errors say what happened + how to fix. See `content-copy`.
