#!/usr/bin/env python3
"""Builds MASTER_PROMPT.md — every skill in one file for chat AIs (ChatGPT, Gemini, Claude.ai, Grok, DeepSeek…).
Usage: python scripts/build-master-prompt.py         (write)
       python scripts/build-master-prompt.py --check (CI: fail if out of date)"""
import os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORDER = ['omni-forge', 'ultra-levels', 'art-direction', 'color-system', 'typography', 'layout-composition', 'motion-animation',
         'webgl-3d', 'scroll-storytelling', 'ui-interaction', 'content-copy', 'web-app-stack', 'android-apk', 'desktop-software',
         'video-animation', 'performance', 'responsive-mobile', 'accessibility-seo', 'assets-pipeline', 'deploy-hosting',
         'github-anywhere', 'quality-gate']
skills = sorted(os.listdir(os.path.join(ROOT, 'skills')), key=lambda s: ORDER.index(s) if s in ORDER else 99)
parts = ["""# OMNI FORGE — MASTER PROMPT (all skills in one file)

> Paste or upload this whole file into any AI chat, then say what you want, e.g.
> "Using Omni Forge at Level 1000, build my portfolio: name …, role …, email …, projects …".
> Repo with the working template, APK/desktop builders and installers: see README.md.

## How you (the AI) must work
1. Follow the **omni-forge** director workflow below, at **Level 1000** unless told otherwise.
2. If you can read the repo: start from `site/` (complete working template) and edit `site/config.js` first.
   If you cannot read the repo: produce complete files (index.html, css/style.css, js/engine.js, js/main.js, config.js)
   following these skills exactly — never partial snippets, never "rest stays the same".
3. Decide confidently; ask only for the user's own facts (name, email, brand, projects).
4. Finish with the quality-gate checklist and an honest hand-off.

"""]
for s in skills:
    body = open(os.path.join(ROOT, 'skills', s, 'SKILL.md'), encoding='utf-8').read()
    m = re.match(r'---\nname: (.+)\ndescription: (.+)\n---\n', body)
    desc = m.group(2) if m else ''
    body = body[m.end():] if m else body
    lines, fence = [], False
    for ln in body.split('\n'):
        if ln.startswith('```'): fence = not fence
        if not fence and re.match(r'^#{1,4} ', ln): ln = '##' + ln
        lines.append(ln)
    parts.append(f'\n\n---\n\n<!-- skill: {s} -->\n## SKILL · {s}\n*When:* {desc}\n' + '\n'.join(lines))
out = ''.join(parts).rstrip() + '\n'
path = os.path.join(ROOT, 'MASTER_PROMPT.md')
if '--check' in sys.argv:
    cur = open(path, encoding='utf-8').read() if os.path.exists(path) else ''
    if cur != out: print('MASTER_PROMPT.md is out of date — run: python scripts/build-master-prompt.py'); sys.exit(1)
    print('MASTER_PROMPT.md up to date'); sys.exit(0)
open(path, 'w', encoding='utf-8').write(out)
print(f'wrote MASTER_PROMPT.md ({len(out)//1024} KB, {len(skills)} skills)')
