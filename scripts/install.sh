#!/usr/bin/env bash
# Omni Forge installer — macOS / Linux / Git Bash / WSL / Termux
#   ./scripts/install.sh                 Claude Code skills, global  (~/.claude/skills)
#   ./scripts/install.sh --project [DIR] Make DIR (default: current dir) Omni-Forge-ready for EVERY AI tool:
#                                        .claude/skills + AGENTS.md + CLAUDE.md + GEMINI.md + .cursor/rules +
#                                        .github/copilot-instructions.md + .windsurfrules + omni-forge/ (skills, library, template)
#   ./scripts/install.sh --codex         also copy skills to ~/.codex/skills
#   ./scripts/install.sh --dir PATH      copy skills to any folder your AI tool reads
#   ./scripts/install.sh --template DIR  copy the website template (site/) into DIR
set -euo pipefail
HERE="$(cd "$(dirname "$0")/.." && pwd)"
GLOBAL=1; PROJECT=""; CODEX=0; EXTRA=""; TEMPLATE=""
while [ $# -gt 0 ]; do
  case "$1" in
    --project) GLOBAL=0
      if [ $# -gt 1 ] && [[ "$2" != --* ]]; then PROJECT="$2"; shift; else PROJECT="$(pwd)"; fi ;;
    --codex) CODEX=1 ;;
    --dir) EXTRA="$2"; shift ;;
    --template) TEMPLATE="$2"; shift ;;
    -h|--help) sed -n 2,10p "$0"; exit 0 ;;
  esac; shift
done
copy_skills() { mkdir -p "$1"; for s in "$HERE"/skills/*/; do rm -rf "$1/$(basename "$s")"; cp -R "$s" "$1/"; done; echo "  ✓ $(ls "$HERE/skills" | wc -l | tr -d ' ') skills → $1"; }

echo "Omni Forge installer"
if [ "$GLOBAL" = 1 ]; then copy_skills "$HOME/.claude/skills"; fi
if [ "$CODEX" = 1 ]; then copy_skills "$HOME/.codex/skills"; fi
if [ -n "$EXTRA" ]; then copy_skills "$EXTRA"; fi
if [ -n "$PROJECT" ]; then
  mkdir -p "$PROJECT"; cd "$PROJECT"
  copy_skills "$PROJECT/.claude/skills"
  mkdir -p omni-forge && cp -R "$HERE/skills" "$HERE/library" omni-forge/ && cp "$HERE/MASTER_PROMPT.md" "$HERE/START_HERE.md" omni-forge/
  [ -d site ] || cp -R "$HERE/site" site
  for f in AGENTS.md CLAUDE.md GEMINI.md .windsurfrules; do [ -e "$f" ] || cp "$HERE/$f" "$f"; done
  mkdir -p .cursor/rules .github/workflows scripts packaging
  cp "$HERE/.cursor/rules/omni-forge.mdc" .cursor/rules/
  [ -e .github/copilot-instructions.md ] || cp "$HERE/.github/copilot-instructions.md" .github/
  for w in "$HERE"/.github/workflows/*.yml; do [ -e ".github/workflows/$(basename "$w")" ] || cp "$w" .github/workflows/; done
  cp -n "$HERE"/scripts/* scripts/ 2>/dev/null || true
  [ -d packaging/android ] || cp -R "$HERE/packaging/." packaging/
  [ -e .gitignore ] || cp "$HERE/.gitignore" .gitignore
  echo "  ✓ project ready: $PROJECT (site/, AI rule files, workflows, packaging)"
fi
if [ -n "$TEMPLATE" ]; then mkdir -p "$TEMPLATE"; cp -R "$HERE/site/." "$TEMPLATE/"; echo "  ✓ template → $TEMPLATE"; fi
echo "Done. Next: edit site/config.js, then: cd site && python3 -m http.server 8080  →  http://localhost:8080"
echo "Chat AIs without file access: upload MASTER_PROMPT.md"
