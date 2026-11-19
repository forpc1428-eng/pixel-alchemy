---
name: web-app-stack
description: Choosing and wiring the full technical stack for websites and web apps — static vs framework (Next.js, Astro, Vite+React/Vue/Svelte), backend and database (Supabase, Firebase, Postgres), auth, payments (Stripe/Razorpay), CMS, forms, email, analytics, environment variables and secrets. Use when the request needs more than a static site — login, database, dashboard, e-commerce, blog/CMS, APIs — or names a framework.
---

# Web & app stack

## 1. Decide (smallest thing that works)

| Need | Choose |
|---|---|
| Portfolio, landing, event, product page | **Template `site/`** (static, 0 deps). Fastest + best scores. |
| Blog / docs / many content pages | **Astro** (islands; keep engine as a client island) |
| App with auth, DB, dashboards | **Next.js (App Router)** or **Vite + React** + **Supabase** |
| Vue/Svelte preference | Nuxt / SvelteKit — same rules |
| Realtime/chat/multiplayer | Supabase Realtime or Firebase; Liveblocks for collaboration |
| E-commerce | Shopify (headless) or Stripe Checkout / **Razorpay** (India) |
| Native-feel phone app | Same web app → Capacitor APK (`android-apk`); React Native/Expo only if heavy native APIs |

## 2. Porting the template into a framework

Keep: tokens (`style.css :root`), `engine.js` (call `OmniEngine.create` in a `useEffect`/`onMount`, destroy on unmount),
loader in the root layout `<head>`, reveal observer, cursor/magnetic as a client component, phone profile logic.
`config.js` → a typed `site.config.ts`.

Next.js: put engine in `app/components/Scene.tsx` with `'use client'`; canvas `position:fixed`; fonts via `next/font/local`.

## 3. Backend recipes

- **Supabase**: `npm i @supabase/supabase-js`; env `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`; turn on
  Row Level Security on every table; auth via email magic link / Google / GitHub.
- **Forms without backend**: Formspree/Web3Forms `action=` URL, or Netlify Forms (`data-netlify="true"`).
- **Email**: Resend / Brevo from a serverless function. Never call email APIs from the browser with secret keys.
- **Payments**: Stripe Checkout / Razorpay Checkout — create the order server-side, verify webhook signature.
- **Analytics**: Vercel Analytics, Plausible, Umami (privacy-friendly), or GA4 with consent banner.

## 4. Secrets

`.env.local` (gitignored) locally; host dashboard env vars in production; GitHub Actions → repo **Settings → Secrets**.
Only `NEXT_PUBLIC_*`/`VITE_*` reach the browser — never put secret keys there. Never commit `.env`.

## 5. Project hygiene

TypeScript for apps · ESLint + Prettier · `npm run build` must pass in CI · README with run/deploy steps · `.gitignore`
(node_modules, .env*, dist, .next, android/build).
