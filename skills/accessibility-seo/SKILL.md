---
name: accessibility-seo
description: Accessibility (WCAG 2.2 AA) and SEO for visual-heavy sites and apps — semantic structure, keyboard, focus, screen readers, contrast, reduced motion, meta/OG tags, structured data (JSON-LD), sitemap/robots, performance-as-SEO, and AI/LLM discoverability (llms.txt). Use always before shipping, and when asked about Google ranking, sharing previews, or accessibility.
---

# Accessibility & SEO

## 1. Accessibility (AA minimum)
- Landmarks: one `header`, `main`, `footer`, `nav[aria-label]`. One `h1`, logical `h2/h3`.
- Canvas is decorative → `aria-hidden="true"`. Hero h1 split into spans gets `aria-label` with the real text (template does).
- Keyboard: every action reachable, visible focus, Esc closes menus, no traps. Skip link if nav is long.
- Contrast: 4.5:1 body, 3:1 large text/UI. Check over the brightest scene frame, not the darkest.
- `prefers-reduced-motion`: no loops/parallax, instant reveals, slow shader time (template does all).
- Live regions for loader/toasts (`role=status`). Buttons are `<button>`, links are `<a href>`.
- Images: meaningful `alt`; decorative `alt=""`.

## 2. SEO
- `title` ≤ 60 chars "Name — Role", `meta description` ≤ 155 chars, canonical URL, `lang`.
- OG/Twitter: `og:title`, `og:description`, `og:image` 1200×630 (absolute URL in production), `twitter:card`.
- JSON-LD: `Person` (portfolio) or `Organization` + `WebSite`; `Product` for product pages:
```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Your Name","jobTitle":"Creative Developer","url":"https://example.com","sameAs":["https://github.com/you"]}</script>
```
- `robots.txt` + `sitemap.xml` at the root; submit to Google Search Console.
- Real text in HTML (template renders sections from config in JS — for content-heavy SEO sites, pre-render: Astro/Next SSG,
  or paste the generated HTML into `index.html`).
- Speed is ranking: pass Core Web Vitals (`performance`).
- AI discoverability: add `/llms.txt` summarising the site and linking key pages.

## 3. Checks
Lighthouse (mobile) ≥ 95 in Accessibility, Best Practices, SEO · axe DevTools 0 serious issues · keyboard-only run-through ·
VoiceOver/TalkBack quick pass on hero, nav, contact.
