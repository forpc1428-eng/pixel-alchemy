# ⚒️ Omni Forge

**Give this repo's link to any AI and say "install everything and build my site/app" — and it knows exactly what to do.**

Omni Forge is a universal skill pack and a working template for building **ultra-premium websites, web apps, Android APKs,
desktop software, real-time 3D scenes and animations** in one go: concept → design → colour → typography → motion → 3D →
code → APK/installers → deploy → GitHub. Every build defaults to **Ultra Level 1000** (the top of a 1–1000 quality scale).

| | |
|---|---|
| 🧠 **22 skills** | Director workflow, Ultra Levels, art direction, colour, typography, layout, motion, WebGL/3D, scroll storytelling, UI, copy, full-stack, Android APK, desktop software, video, performance, mobile, accessibility/SEO, assets, deploy, GitHub-from-anywhere, quality gate |
| 🌌 **Working template** | `site/` — cinematic portfolio with a zero-dependency WebGL2 engine and **6 real-time 3D scenes**: black hole, nebula, orb, liquid metal, aurora, terrain. PWA, offline, works from `file://` |
| 🎨 **Library** | 40 contrast-tested palettes, 30 named art directions, level definitions |
| 📱 **Android APK** | One click in GitHub Actions — even from your phone |
| 💻 **Desktop apps** | Windows `.exe`, macOS `.dmg`, Linux `.AppImage` — one click |
| 🚀 **Auto-deploy** | GitHub Pages on every push (or Vercel/Netlify) |
| 🤖 **Works with every AI** | Claude Code plugin, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Cursor, Copilot, Windsurf rules, `llms.txt`, and a one-file `MASTER_PROMPT.md` for chat AIs |

---

## 1. The one prompt (copy → paste into any AI)

> Read https://github.com/forpc1428-eng/omni-forge — start with START_HERE.md. Install all the skills and everything
> exactly as it says, then build my **[portfolio / website / app / APK / desktop app]** at Ultra Level 1000.
> My name: … · Role: … · Email: … · Projects: … · Style/colours (optional): … · Reference site (optional): …

- **Claude Code / Codex / Gemini CLI / Cursor / Windsurf / Copilot agent / Aider / Cline** → they clone, run the
  installer and build.
- **ChatGPT / Gemini / Claude.ai / Grok (chat)** → they read `MASTER_PROMPT.md` + the template and give you complete files.
  If they can't open links, upload `MASTER_PROMPT.md` to the chat.
- **Claude Code plugin**: `/plugin marketplace add forpc1428-eng/omni-forge` → `/plugin install omni-forge@omni-forge`

## 2. Use it from your phone only 📱 (no PC)

1. Open this repo in your browser → **Use this template → Create a new repository** (or **Fork**).
2. In your new repo: **Settings → Pages → Source: GitHub Actions**.
3. Open `site/config.js` → tap ✏️ → change name, email, colours, `scene` → **Commit changes**.
4. Wait ~1 minute → your site is live at `https://<your-username>.github.io/<repo>/`.
5. **APK**: **Actions → Build Android APK → Run workflow** → when it's green, open the run → **Artifacts** → download → install.
6. **Desktop apps**: **Actions → Build Desktop Apps → Run workflow** → download the `.exe` / `.dmg` / `.AppImage`.

Full git on Android (Termux), iPhone (Working Copy), Codespaces and more: [`skills/github-anywhere`](skills/github-anywhere/SKILL.md).

## 3. Use it on a PC 💻

```bash
git clone https://github.com/forpc1428-eng/omni-forge.git
cd omni-forge
./scripts/install.sh                 # installs the skills for Claude Code (Windows: .\scripts\install.ps1)
python3 scripts/serve.py             # preview → http://localhost:8080  (phone on same Wi-Fi: the printed IP)
```
Start a separate project with everything wired in: `./scripts/new-project.sh ~/projects/my-site`
(Windows: `.\scripts\install.ps1 -Project -ProjectDir C:\projects\my-site`).

Push it to GitHub: `gh repo create my-site --public --source=. --push` (more options in `skills/github-anywhere`).

## 4. Customise in one file

Everything is in [`site/config.js`](site/config.js): name, role, tagline, email, socials, **level**, **scene**, **palette**,
**typeStyle**, live **HUD** readouts, hero lines, **sections** (about, stats, work, services, process, quote, contact), SEO.

Try them live with URL switches: `?scene=blackhole|nebula|orb|liquid|aurora|terrain` · `?u=0.5` (jump to a scroll point) ·
`?m=1` (phone profile) · `?level=300`.

Palettes → [`library/palettes.json`](library/palettes.json) · Styles → [`library/styles.md`](library/styles.md) ·
Levels → [`skills/ultra-levels`](skills/ultra-levels/SKILL.md).

## 5. Ultra Levels

| Levels | Tier | Adds |
|---|---|---|
| 1–100 | Clean | semantic, responsive, palette, readable |
| 101–200 | Designed | spacing system, type scale, grid, states |
| 201–300 | Animated | reveals, easing, loader, reduced-motion |
| 301–400 | Immersive | real-time 3D, scroll-linked, fallback |
| 401–500 | App-grade | PWA, offline, install, micro-interactions |
| 501–600 | Studio | cursor, split text, marquee, counters, HUD |
| 601–700 | Cinematic | story beats, camera, dynamic res, ACES |
| 701–800 | Production | Lighthouse ≥ 95, WCAG AA, SEO, headers |
| 801–900 | Shipped | deploy, repo, CI, APK, installers |
| 901–1000 | **Ultra** | signature idea, bespoke shader, full quality gate |

## 6. What's inside

```
omni-forge/
├── START_HERE.md            ← every AI reads this first
├── MASTER_PROMPT.md         ← all skills in one file (chat AIs)
├── AGENTS.md CLAUDE.md GEMINI.md .windsurfrules .cursor/ .github/copilot-instructions.md llms.txt
├── .claude-plugin/          ← Claude Code plugin + marketplace
├── skills/  (22)            ← omni-forge, ultra-levels, art-direction, color-system, typography, layout-composition,
│                              motion-animation, webgl-3d, scroll-storytelling, ui-interaction, content-copy,
│                              web-app-stack, android-apk, desktop-software, video-animation, performance,
│                              responsive-mobile, accessibility-seo, assets-pipeline, deploy-hosting,
│                              github-anywhere, quality-gate
├── site/                    ← the working template (PWA)
│   ├── config.js            ← EDIT THIS
│   ├── index.html  css/style.css  js/engine.js  js/main.js  sw.js  manifest.webmanifest
│   └── fonts/  icons/  vercel.json  netlify.toml
├── library/                 ← palettes.json · styles.md · levels.json
├── packaging/android/       ← Capacitor → APK / AAB
├── packaging/desktop/       ← Electron → exe / dmg / AppImage
├── scripts/                 ← install.sh/.ps1 · new-project.sh · serve.py · check.py · build-master-prompt.py
└── .github/workflows/       ← pages · android-apk · desktop-app · quality
```

## 7. FAQ

**Will every AI produce the exact same result?** No instruction file can guarantee that — models differ. Omni Forge gets
as close as possible by shipping *working, tested code* plus exact recipes and a checklist, so the AI adapts a proven
engine instead of improvising. Agents that can run the site and look at screenshots (Claude Code, Codex, Cursor agent)
give the best results.

**APK says "unsafe app"?** Debug APKs aren't Play-signed; allow "install unknown apps". For Play Store, add signing secrets
(`skills/android-apk`).

**Windows says "unknown publisher"?** Unsigned installer — click *More info → Run anyway*. Signing: `skills/desktop-software`.

**Site didn't deploy?** Settings → Pages → Source must be **GitHub Actions**; check the Actions tab for errors.

**After changing files, the site looks old on my phone?** Bump `VERSION` in `site/sw.js` (offline cache).

## Credits & licence
MIT. Fonts: Bodoni Moda, Montserrat (SIL OFL 1.1). All 3D scenes are procedural. See [CREDITS.md](CREDITS.md).
