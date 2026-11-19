# CLAUDE.md — Pixel Alchemy

Follow [`START_HERE.md`](START_HERE.md) and [`AGENTS.md`](AGENTS.md).

The folders in `skills/` are Claude skills (`SKILL.md` + frontmatter). Install:
- Plugin: `/plugin marketplace add forpc1428-eng/pixel-alchemy` → `/plugin install pixel-alchemy@pixel-alchemy`
- Or: `./scripts/install.sh` (global `~/.claude/skills`) / `./scripts/install.sh --project .`

For any request to build/design a site, app, APK, desktop software, 3D scene or animation, invoke the **pixel-alchemy** skill
first; it routes to the other 21. Default build = `site/` at Ultra Level 1000. Check your work with screenshots and
`python3 scripts/check.py site` before saying it's done.
