---
name: motion-animation
description: Motion design and web animation engineering — easing and duration tokens, choreography and stagger, page/section transitions, scroll-linked animation, micro-interactions, springs, GSAP/ScrollTrigger, Framer Motion, Lenis, CSS/WAAPI, and reduced-motion. Use for any animation, transition, "make it smooth/alive/premium", hover effects, loaders, or jank in motion.
---

# Motion & animation

## 1. Tokens (template `:root`)

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entrances, reveals (expo-out feel) — default |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | Moves between two states, loops |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Toasts, small pops (tiny overshoot) |
| `--dur-1` | .25s | Hover colour, small UI |
| `--dur-2` | .6s | Buttons, menus, cards |
| `--dur-3` | 1.1s | Reveals, hero text |

Never `linear` except marquees/rotations. Never > 1.2 s for UI. Exits are ~30 % faster than entrances.

## 2. Choreography rules

- **One thing leads.** Hero title first, then kicker/lede, then nav. Stagger 30–45 ms per char, 80 ms per block.
- **Distance is small**: reveal from 24–32px, not 100px. Scale from .96, not .5.
- **Mask, don't fade, display type** (line `overflow:hidden` + translateY 105 %).
- **Follow-through**: pointer-driven things lerp (parallax `dt*3`, cursor CSS transition) — never 1:1 snapping.
- **Springs for scroll-linked 3D**: critically damped (engine: `k=22`, damping `2√k`) — silky, no wobble.
- **Respect `prefers-reduced-motion`**: disable loops, parallax, cursor; reveal instantly; slow time in shaders.

## 3. Libraries — when to reach for them

| Need | Use |
|---|---|
| Reveals, hovers, marquee, loader (most sites) | CSS + IntersectionObserver (template, 0 KB) |
| Complex timelines, pinning, scrub | **GSAP + ScrollTrigger** (free incl. plugins since 2025) |
| React component motion, layout/shared transitions | **Motion** (`motion/react`, ex Framer Motion) |
| Smooth wheel scrolling | **Lenis** (keep native scrollbar + a11y; never hijack on touch) |
| Page transitions in MPA | View Transitions API (`@view-transition { navigation: auto; }`) |
| Designer-made vector animation | Lottie / dotLottie |
| Rendered video | see `video-animation` (Remotion) |

GSAP pattern: `gsap.timeline({scrollTrigger:{trigger:'#work', start:'top 70%', end:'bottom 30%', scrub:1}})`.
Lenis + GSAP: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000))`.

## 4. Micro-interactions catalogue (all in template)

Magnetic buttons (25–35 % of pointer offset) · card 3D tilt (±8°) + light follow (`--mx/--my`) · cursor that grows over
links (mix-blend difference) · underline that draws from left · counters with ease-out-quart · toast springs up ·
menu icon morphs to X · scroll progress bar · idle scroll cue that reappears after 2.6 s.

## 5. Performance of motion

Animate only `transform` and `opacity` (and `filter` sparingly). `will-change` only during animation.
One rAF loop for everything pointer/scroll-driven. Passive listeners. Test at 4× CPU throttle.
