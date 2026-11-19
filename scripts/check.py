#!/usr/bin/env python3
"""Omni Forge automated quality gate.  Usage: python scripts/check.py [site_dir]
Checks files, references, JSON, budgets, SEO basics, placeholders, secrets, and skill frontmatter.
Exit code 1 if any FAIL. WARNs are things to fix or mention in the hand-off."""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'site'))
fails, warns, oks = [], [], []
def ok(m): oks.append(m)
def warn(m): warns.append(m)
def fail(m): fails.append(m)
def read(p):
    with open(p, encoding='utf-8', errors='replace') as f: return f.read()

# 1. required files
for f in ['index.html', 'config.js', 'css/style.css', 'js/engine.js', 'js/main.js', 'manifest.webmanifest', 'sw.js', 'icons/icon-192.png', 'icons/icon-512.png']:
    (ok if os.path.exists(os.path.join(site, f)) else fail)(f'file {f}')

idx = read(os.path.join(site, 'index.html')) if os.path.exists(os.path.join(site, 'index.html')) else ''
# 2. local references
for ref in re.findall(r'(?:src|href)="([^"#:?]+)"', idx):
    if ref.startswith(('http', '//', 'mailto')): continue
    p = os.path.join(site, ref)
    if not os.path.exists(p): fail(f'missing referenced file: {ref}')
# 3. JSON
for j in ['manifest.webmanifest', 'vercel.json']:
    p = os.path.join(site, j)
    if os.path.exists(p):
        try: json.load(open(p, encoding='utf-8')); ok(f'json {j}')
        except Exception as e: fail(f'{j} invalid JSON: {e}')
# 4. service worker cache list
sw = os.path.join(site, 'sw.js')
if os.path.exists(sw):
    s = read(sw)
    core = re.search(r'CORE\s*=\s*\[(.*?)\]', s, re.S)
    if core:
        for f in re.findall(r"'([^']+)'", core.group(1)):
            if f != './' and not os.path.exists(os.path.join(site, f)): fail(f'sw.js caches missing file: {f}')
# 5. SEO / meta
for tag, rx in [('title', r'<title>.+</title>'), ('description', r'name="description"'), ('viewport', r'name="viewport"'),
                ('og:image', r'og:image'), ('manifest', r'rel="manifest"'), ('lang', r'<html[^>]+lang=')]:
    (ok if re.search(rx, idx) else fail)(f'meta {tag}')
if 'application/ld+json' not in idx: warn('no JSON-LD structured data (required at level >= 800)')
# 6. budgets
total = 0; big = []
for dp, dn, fn in os.walk(site):
    for f in fn:
        sz = os.path.getsize(os.path.join(dp, f)); total += sz
        if sz > 500_000 and not f.endswith(('.apk', '.aab')): big.append((os.path.relpath(os.path.join(dp, f), site), sz))
(ok if total < 3_000_000 else warn)(f'site size {total/1024:.0f} KB')
for f, sz in big: warn(f'large file {f} ({sz/1024:.0f} KB) — compress (see assets-pipeline)')
# 7. placeholders
cfg = read(os.path.join(site, 'config.js')) if os.path.exists(os.path.join(site, 'config.js')) else ''
for ph in ['Your Name', 'you@example.com', 'https://example.com']:
    if ph in cfg or ph in idx: warn(f'placeholder still present: "{ph}"')
# 8. secrets
SECRET = re.compile(r'(ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|sk_live_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA |EC )?PRIVATE KEY-----)')
scan_root = ROOT if os.path.exists(os.path.join(ROOT, 'skills')) else site
for dp, dn, fn in os.walk(scan_root):
    dn[:] = [d for d in dn if d not in ('.git', 'node_modules', 'android', 'dist', 'www', 'app')]
    for f in fn:
        p = os.path.join(dp, f)
        if f in ('.env',) or f.endswith(('.jks', '.keystore', '.p12', '.pem')): fail(f'secret-like file committed: {os.path.relpath(p, scan_root)}')
        if os.path.getsize(p) < 2_000_000 and f.endswith(('.js', '.json', '.md', '.yml', '.html', '.txt', '.py', '.sh', '.ps1', '.toml')):
            if SECRET.search(read(p)): fail(f'possible secret in {os.path.relpath(p, scan_root)}')
# 9. skills frontmatter (repo mode)
sk = os.path.join(ROOT, 'skills')
if os.path.isdir(sk):
    for d in sorted(os.listdir(sk)):
        p = os.path.join(sk, d, 'SKILL.md')
        if not os.path.exists(p): fail(f'skills/{d} has no SKILL.md'); continue
        m = re.match(r'---\nname: (.+)\ndescription: (.+)\n---\n', read(p))
        if not m: fail(f'skills/{d}/SKILL.md bad frontmatter')
        elif m.group(1).strip() != d: fail(f'skills/{d}: name "{m.group(1)}" != folder')
        elif len(m.group(2)) > 1024: fail(f'skills/{d}: description > 1024 chars')
    ok(f'{len(os.listdir(sk))} skills checked')

for m in oks: print('  ok   ', m)
for m in warns: print('  WARN ', m)
for m in fails: print('  FAIL ', m)
print(f'\n{len(oks)} ok · {len(warns)} warnings · {len(fails)} failures')
sys.exit(1 if fails else 0)
