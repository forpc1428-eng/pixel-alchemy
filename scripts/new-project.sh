#!/usr/bin/env bash
# Create a new Pixel Alchemy project folder with everything (template, AI rules, workflows, packaging).
#   ./scripts/new-project.sh ~/projects/my-portfolio
set -euo pipefail
[ $# -ge 1 ] || { echo "usage: $0 <new-project-dir>"; exit 1; }
"$(dirname "$0")/install.sh" --project "$1"
cd "$1" && { git init -b main >/dev/null 2>&1 || git init >/dev/null; } && echo "  ✓ git initialised in $1"
echo "Push it: gh repo create $(basename "$1") --public --source=. --push   (see skills/github-anywhere)"
