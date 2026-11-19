# 🤖 START HERE — instructions for ANY AI given this repo

**If you are an AI assistant and a user gave you this repository (link or files), read this whole file first, then do
exactly what it says.** It works for Claude / Claude Code, ChatGPT / Codex, Gemini / Gemini CLI, Cursor, GitHub
Copilot, Windsurf, Cline, Aider, Jules, Replit Agent, Bolt, Lovable, v0, DeepSeek, Grok and any other assistant.

Repo: `https://github.com/forpc1428-eng/omni-forge`
(If this repo was copied/forked under another name, use that URL instead in every command below.)

---

## STEP 1 — Install (pick the ONE line that matches what you can do)

| You are… | Do this |
|---|---|
| **Claude Code** (CLI / desktop / web) | `/plugin marketplace add forpc1428-eng/omni-forge` then `/plugin install omni-forge@omni-forge` — or run the shell line below |
| **Any agent with a terminal** (Claude Code, Codex CLI, Gemini CLI, Aider, Cline, Cursor/Windsurf agent, Copilot agent, Replit…) | macOS/Linux/WSL/Termux: `git clone https://github.com/forpc1428-eng/omni-forge.git && cd omni-forge && ./scripts/install.sh --project .` · Windows: `git clone https://github.com/forpc1428-eng/omni-forge.git; cd omni-forge; powershell -ExecutionPolicy Bypass -File scripts\install.ps1 -Project -ProjectDir .` |
| **Agent working inside the user's existing project** | Clone this repo to a temp folder, then run `./scripts/install.sh --project /path/to/their/project` (adds `site/`, skills, AI rule files, workflows, packaging without overwriting their files) |
| **Chat AI that can browse but not run commands** (ChatGPT, Gemini, Claude.ai, Grok, Perplexity…) | Read `MASTER_PROMPT.md` (raw: `https://raw.githubusercontent.com/forpc1428-eng/omni-forge/main/MASTER_PROMPT.md`) and the template files listed in `llms.txt`. Follow them. Output COMPLETE files. |
| **Chat AI with no browsing** | Ask the user to upload `MASTER_PROMPT.md` (and `site/` files if possible). |
| **App builders** (Bolt, Lovable, v0, Replit) | Import the GitHub repo; treat `site/` as the app; follow `MASTER_PROMPT.md`. |

What gets installed:
- **22 skills** (`skills/*/SKILL.md`) — director workflow, Ultra Levels 1–1000, art direction, colour, type, layout, motion,
  WebGL/3D, scroll storytelling, UI, copy, full-stack, Android APK, desktop software, video, performance, mobile,
  accessibility/SEO, assets, deploy, GitHub-from-anywhere, quality gate.
- **`site/`** — a complete, working, tested cinematic website (zero dependencies, 6 real-time 3D scenes, PWA).
- **`library/`** — 40 contrast-tested palettes, 30 art directions, level definitions.
- **`.github/workflows/`** — auto-deploy to GitHub Pages, build Android APK, build Windows/macOS/Linux apps, quality checks.
- **`packaging/`** — Capacitor (Android) and Electron (desktop) wrappers.
- Rule files every tool reads automatically: `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursor/rules/`, `.github/copilot-instructions.md`, `.windsurfrules`.

Verify the install: `python3 scripts/check.py site` → should end with `0 failures`.
Tell the user in one line what you installed and where.

## STEP 2 — Build what the user asked

1. Read `skills/omni-forge/SKILL.md` (director workflow) and `skills/ultra-levels/SKILL.md`. Default **Level 1000**.
2. Read every other skill the job needs (all of them for a full site/app).
3. Start from `site/`. Edit **`site/config.js`** first (name, role, email, palette, scene, sections, HUD, SEO).
   Scenes: `blackhole · nebula · orb · liquid · aurora · terrain`. Palettes: `library/palettes.json`. Styles: `library/styles.md`.
4. Preview: `python3 scripts/serve.py` → `http://localhost:8080` (phone on same Wi-Fi: the printed IP).
   Debug: `?scene=orb`, `?u=0.5` (scroll point), `?m=1` (phone profile), `?level=500`.
5. If you can drive a browser, screenshot desktop 1280×760 and phone 375×812 at `?u=0, .5, 1` and fix what you see.
6. Needs a framework/backend? Follow `skills/web-app-stack`. Needs APK / .exe / video? `android-apk`, `desktop-software`, `video-animation`.

No details given by the user? Build the default: the **Event Horizon** black-hole portfolio, personalised with
clear placeholders, and ask for their name / email / projects in one short question at the end.

## STEP 3 — Ship it

- **Website**: push to GitHub → `pages.yml` deploys automatically (Settings → Pages → Source: GitHub Actions, once).
  Or Vercel/Netlify with root directory `site` and no build command (`skills/deploy-hosting`).
- **Android APK**: Actions → *Build Android APK* → Run workflow → download artifact (works from a phone).
- **Desktop apps**: Actions → *Build Desktop Apps* → Run workflow → .exe / .dmg / .AppImage artifacts.
- **Release**: push a tag `v1.0.0` → APK + installers attach to a GitHub Release automatically.
- **GitHub from phone or PC** (create repo, upload, push): `skills/github-anywhere`.

## STEP 4 — Quality gate + hand-off

Run `python3 scripts/check.py site`, go through `skills/quality-gate`, then tell the user: what you built, live/local URL,
where the APK/installers are, which files to edit, what you verified and what you could not verify.

## Rules for every AI

- Never commit secrets (`.env`, keystores, tokens). Never force-push `main` without asking.
- Ask only for the user's own facts (name, email, brand, real projects). Decide everything else confidently.
- Never output partial files with "rest unchanged" when the user can't merge code — give complete files.
- Keep licence credits (`CREDITS.md`). Don't copy other sites' names, text, logos or assets — recreate quality, not identity.
- Be honest: no instruction file makes every AI produce identical results. Stronger coding agents that can run the site
  and look at screenshots will get the best output.
