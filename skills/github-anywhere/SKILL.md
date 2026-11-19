---
name: github-anywhere
description: Creating GitHub repos and uploading/updating projects from anywhere — Windows/Mac/Linux PC (git, GitHub Desktop, VS Code), Android phone (browser upload, Termux, Codespaces, Acode), iPhone/iPad (browser, Working Copy, Codespaces), and by AI agents (gh CLI, Claude Code, Codex, Jules, Copilot agent). Includes tokens/SSH, templates, forks, Actions artifacts and releases. Use when the user wants to put something on GitHub, upload files, make a repo, push changes, or do any of it from mobile.
---

# GitHub from anywhere

**Golden rule:** never commit secrets (`.env`, keystores, tokens). The repo `.gitignore` already blocks common ones.

## A. Start a new project from Omni Forge (any device, 30 seconds)
On the Omni Forge repo page: **Use this template → Create a new repository** (or **Fork**). Name it, Public/Private,
Create. Then enable Pages (Settings → Pages → Source: GitHub Actions). Edit `site/config.js` in the browser
(press `.` on desktop to open github.dev, or the ✏️ pencil on mobile) → **Commit changes** → site deploys automatically.
*(If "Use this template" isn't shown, the owner must tick Settings → General → Template repository.)*

## B. From a PC (Windows / macOS / Linux)

### Git CLI
```bash
git config --global user.name "Your Name"; git config --global user.email "you@example.com"
# new repo from a folder
cd my-project && git init -b main && git add . && git commit -m "Initial commit"
gh repo create my-project --public --source=. --push        # GitHub CLI (winget install GitHub.cli / brew install gh), then: gh auth login
# or without gh: create an EMPTY repo on github.com (no README), then
git remote add origin https://github.com/<user>/my-project.git && git push -u origin main
# later updates
git add . && git commit -m "Update" && git push
```
Auth: HTTPS + Git Credential Manager (browser login, comes with Git for Windows), or SSH key:
`ssh-keygen -t ed25519 -C "you@example.com"` → add `~/.ssh/id_ed25519.pub` at GitHub → Settings → SSH keys.

### GitHub Desktop (no commands)
File → Add local repository (or New repository) → Publish repository. Then: write summary → Commit → Push origin.

### VS Code
Source Control panel → Initialize → Publish to GitHub (signs in through the browser).

## C. From an Android phone

1. **Browser only (easiest)**: github.com (desktop-site mode helps) → **+ → New repository** → create → **Add file →
   Upload files** → select files (zip contents must be extracted first; ≤ 100 files per upload, ≤ 25 MB each via browser)
   → Commit. Folders: upload from a file manager that keeps folder structure, or create files with path names
   like `site/js/main.js` via **Add file → Create new file**.
2. **Termux** (full git, best for whole projects):
   ```bash
   pkg update && pkg install git gh unzip
   termux-setup-storage                       # gives access to /sdcard (Downloads)
   cd ~ && unzip /sdcard/Download/omni-forge.zip -d omni-forge && cd omni-forge
   gh auth login                              # choose HTTPS + browser/device code
   git init -b main && git add . && git commit -m "Initial commit"
   gh repo create omni-forge --public --source=. --push
   ```
3. **GitHub Codespaces** in Chrome: repo → Code → Codespaces → Create — a full VS Code + terminal in the cloud
   (free monthly hours). Run `python -m http.server 8080` and open the forwarded port to preview.
4. **Apps**: GitHub mobile app (review, issues, edit small files, run workflows), Acode / Spck Editor (edit + git push).
5. **Get your APK/installers**: Actions tab → open the latest run → Artifacts → download (or Releases page).

## D. From iPhone / iPad
Safari github.com (upload files works the same) · **Working Copy** app (full git client, push/pull, Files integration) ·
Codespaces in Safari · GitHub app for edits and running workflows.

## E. By an AI agent
- Claude Code / Codex CLI / Gemini CLI / Aider with a terminal: use `gh` (`gh auth status` first) or `git` with the
  user's credentials. Create → commit → push → open the Actions run URL → report links.
- Cloud agents (Claude Code on the web, Codex cloud, Jules, Copilot coding agent) work on repos you connect; they push
  branches and open PRs — merge the PR to deploy.
- Agents must: never print or commit tokens, never force-push `main` without asking, write clear commit messages.

## F. Tokens (when a password is asked in the terminal)
github.com → Settings → Developer settings → **Fine-grained personal access token** → only the needed repos →
Contents: Read & write (+ Workflows: Read & write to push workflow files). Use it as the password. Expire it.

## G. Large files
Over 100 MB per file → Git LFS (`git lfs track "*.glb"`) or host media elsewhere (Releases, Cloudflare R2). Keep repos lean.
