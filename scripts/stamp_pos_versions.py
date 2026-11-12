"""Stamp the POS file links with a fingerprint of each file's contents.

pos/index.html loads pos.css, firebase-config.js, components.js and app.js as e.g.
app.js?v=3f9a1c2b. When a file changes, its fingerprint changes, so tablets load the new file
on the next reload instead of reusing a saved old copy. Run before publishing a POS change:
    python3 scripts/stamp_pos_versions.py
"""
import hashlib, pathlib, re

pos = pathlib.Path(__file__).resolve().parent.parent / 'pos'
index = pos / 'index.html'
html = index.read_text(encoding='utf-8')
for name in ['pos.css', 'firebase-config.js', 'components.js', 'app.js']:
    digest = hashlib.sha256((pos / name).read_bytes()).hexdigest()[:10]
    html, n = re.subn(r'(["\'])' + re.escape(name) + r'(\?v=[^"\']*)?\1', r'\g<1>' + name + '?v=' + digest + r'\g<1>', html)
    assert n == 1, name
    print(f'{name:20} v={digest}')
index.write_text(html, encoding='utf-8')
