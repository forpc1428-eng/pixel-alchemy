---
name: deploy-hosting
description: Putting builds live and keeping them live — GitHub Pages (automatic via Actions), Vercel, Netlify, Cloudflare Pages, custom domains and DNS, HTTPS, environment variables, preview deploys, and release distribution for APKs/installers. Use when the user says deploy, host, publish, go live, domain, link to share, or "upload everything".
---

# Deploy & hosting

## 1. GitHub Pages (automatic, already wired)
`.github/workflows/pages.yml` deploys `site/` on every push to `main`.
One-time: repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
URL: `https://<user>.github.io/<repo>/`. (Template uses relative paths, so sub-paths work.)

## 2. Vercel (best DX, custom domains, analytics)
vercel.com → Add New → Project → Import the GitHub repo → **Root Directory: `site`**, Framework: **Other**, no build command
→ Deploy. Every push redeploys; PRs get preview URLs. `site/vercel.json` adds cache + security headers.
CLI: `npm i -g vercel && cd site && vercel --prod`.

## 3. Netlify / Cloudflare Pages
Netlify: import repo, base directory `site`, publish `.`, no build (or drag-drop the `site` folder on app.netlify.com/drop —
works from a phone browser). Cloudflare Pages: connect repo, build output `site`, no build command.

## 4. Custom domain
Buy (Cloudflare Registrar, Namecheap, Porkbun, GoDaddy, Hostinger). In the host: add domain → follow its DNS records
(usually `A 76.76.21.21` + `CNAME www cname.vercel-dns.com` for Vercel; `CNAME <user>.github.io` for Pages). HTTPS is
automatic. Update `config.js → seo.url` and `og:image` to absolute URLs.

## 5. Distributing apps
APK + installers: push tag `v1.0.0` → workflows attach files to **GitHub Releases** → share the release link.
Optional: link "Download Android app" / "Download for Windows" buttons on the site to
`https://github.com/<user>/<repo>/releases/latest`.

## 6. After deploy
Open the live URL on phone + desktop · Lighthouse on the live URL · share preview check (opengraph.xyz) ·
Search Console + sitemap · bump `sw.js` VERSION for future content changes.
