# AGENTS.md — Pixel Alchemy

Read automatically by Codex, Cursor, Jules, Aider, Gemini CLI, Copilot agents, Windsurf, Cline, Zed, Replit and others.
**Full instructions: [`START_HERE.md`](START_HERE.md). Follow it.**

## Quick contract
1. Read `skills/pixel-alchemy/SKILL.md` (director) + `skills/ultra-levels/SKILL.md` first. Default level **1000**.
2. Read every skill in `skills/` the task touches (all 22 for a full build). Each is a `SKILL.md` with a `description`
   saying when to use it.
3. Build from `site/` (working template). Edit `site/config.js` first. Scenes in `site/js/engine.js`, UI in `site/js/main.js`,
   tokens in `site/css/style.css`.
4. Run: `python3 scripts/serve.py` → http://localhost:8080 · debug `?scene= ?u= ?m=1 ?level=`.
5. Verify: `python3 scripts/check.py site` (0 failures) + screenshots desktop/phone + `skills/quality-gate`.
6. Ship: GitHub Actions — `pages.yml` (site), `android-apk.yml` (APK), `desktop-app.yml` (exe/dmg/AppImage).
7. If you change any skill, run `python3 scripts/build-master-prompt.py` to regenerate `MASTER_PROMPT.md`.

## Map
| Path | What |
|---|---|
| `site/` | The product: cinematic PWA website (index.html, config.js, css/, js/engine.js, js/main.js, sw.js, icons/, fonts/) |
| `skills/` | 22 skills |
| `library/` | palettes.json (40), styles.md (30 directions), levels.json |
| `packaging/android` | Capacitor wrapper → APK/AAB |
| `packaging/desktop` | Electron wrapper → Windows/macOS/Linux |
| `scripts/` | install.sh/.ps1, new-project.sh, serve.py, check.py, build-master-prompt.py |
| `.github/workflows` | pages, android-apk, desktop-app, quality |

## Hard rules
Deep blacks, one accent, no "AI look" · text never over the 3D subject · loader in first paint · 60 fps with dynamic
resolution · reduced-motion + keyboard + no-WebGL fallback · no secrets in git · honest hand-off.
