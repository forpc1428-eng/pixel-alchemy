---
name: desktop-software
description: Building real desktop software (Windows .exe/installer, macOS .dmg, Linux AppImage) from an Omni Forge web build or a new app — Electron with electron-builder via GitHub Actions, Tauri as a lightweight alternative, native menus, auto-update, code signing. Use when the user asks for software, a desktop app, an .exe, an installer, a Mac app, or "make it run on PC without a browser".
---

# Desktop software

## Route A — Electron via GitHub Actions (recommended, already wired)
Files: `packaging/desktop/` (package.json, main.js) + `.github/workflows/desktop-app.yml`.

1. Push to GitHub → **Actions → Build Desktop Apps → Run workflow** (or push tag `v1.0.0`).
2. Download artifacts: **omni-desktop-windows** (NSIS installer `.exe` + portable `.exe`), **omni-desktop-macos**
   (`.dmg`), **omni-desktop-linux** (`.AppImage`). Tags attach them to a Release.

The workflow copies `site/` → `packaging/desktop/app`, icon from `site/icons/icon-512.png`, runs electron-builder per OS.
The template works from `file://` (classic scripts, no modules, relative paths) so it runs offline inside Electron.

Customise in `packaging/desktop/package.json → build`: `appId`, `productName`, targets. Window size, frameless look,
menus: `packaging/desktop/main.js`.

Local: `cd packaging/desktop && rm -rf app && cp -r ../../site app && npm install && npm start` (dev) / `npm run dist`.

### Signing (removes "unknown publisher" warnings)
Windows: code-signing certificate (or Azure Trusted Signing) → `CSC_LINK`/`CSC_KEY_PASSWORD` secrets.
macOS: Apple Developer ID + notarization (`APPLE_ID`, `APPLE_APP_SPECIFIC_PASSWORD`, `APPLE_TEAM_ID`). Unsigned builds work
but users must right-click → Open (mac) or "More info → Run anyway" (Windows). Say this in the hand-off.

### Auto-update
`electron-updater` + GitHub Releases as the provider (`publish: github`) — then every tagged release updates users.

## Route B — Tauri 2 (tiny installers, ~5–10 MB vs ~90 MB)
`npm create tauri-app@latest`, point `frontendDist` to the site folder, `npx tauri icon site/icons/icon-512.png`, build with
`tauri-apps/tauri-action` in CI. Needs Rust toolchain. Prefer when size matters.

## Route C — PWA install on desktop
Chrome/Edge address-bar install icon — zero work, already supported by the template.

## Desktop UX checklist
- [ ] Sensible min window size (1024×640), remembers size, dark title bar on Windows (`backgroundColor` set).
- [ ] External links open in the system browser (main.js does this).
- [ ] Keyboard: Ctrl/Cmd+R reload disabled in production, F11 fullscreen, Ctrl/Cmd+Q quits.
- [ ] Icon looks right at 16px and 256px.
