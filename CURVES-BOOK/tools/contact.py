"""Curves Workshop · tools/contact.py

Rasterises the SVG files in svg/ (PyMuPDF) and lays them out on contact sheets for a quick
visual review, 12 per sheet, written to _review/sheet-NN.png (gitignored).

    python tools/contact.py               every figure
    python tools/contact.py conics        the figures whose id is in that section (per data/manifest.js)
    python tools/contact.py fig-048a fig-048b
"""
import os
import re
import sys

import pymupdf
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
SVG = os.path.join(ROOT, 'svg')
OUT = os.path.join(ROOT, '_review')


def sections():
    src = open(os.path.join(ROOT, 'data', 'manifest.js'), encoding='utf-8').read()
    out = {}
    for m in re.finditer(r"id: '([^']+)'.*?figs: \[(\d+), (\d+)\]", src):
        out[m.group(1)] = (int(m.group(2)), int(m.group(3)))
    return out


def main(argv):
    ids = sorted(f[:-4] for f in os.listdir(SVG) if f.endswith('.svg'))
    if argv:
        secs = sections()
        want = []
        for a in argv:
            if a in secs:
                lo, hi = secs[a]
                want += [i for i in ids if lo <= int(re.sub(r'\D', '', i)[:3]) <= hi]
            else:
                want.append(a)
        ids = [i for i in ids if i in want]
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):
        if f.startswith('sheet-'):
            os.remove(os.path.join(OUT, f))
    W, H, cols, rows = 380, 300, 4, 3
    sheet_no = 0
    for s in range(0, len(ids), cols * rows):
        batch = ids[s:s + cols * rows]
        sheet = Image.new('RGB', (cols * (W + 8), rows * (H + 26)), (235, 232, 224))
        d = ImageDraw.Draw(sheet)
        for i, fid in enumerate(batch):
            x, y = (i % cols) * (W + 8), (i // cols) * (H + 26)
            try:
                doc = pymupdf.open(os.path.join(SVG, fid + '.svg'))
                page = doc[0]
                zoom = min(W / page.rect.width, H / page.rect.height)
                pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
                im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
                sheet.paste(im, (x + (W - im.width) // 2, y + 22 + (H - im.height) // 2))
            except Exception as e:  # noqa: BLE001
                d.text((x + 4, y + 40), 'render failed: ' + str(e)[:60], fill=(180, 0, 0))
            d.text((x + 4, y + 4), fid, fill=(0, 0, 0))
        sheet_no += 1
        sheet.save(os.path.join(OUT, 'sheet-%02d.png' % sheet_no))
    print('%d figures on %d sheets in %s' % (len(ids), sheet_no, os.path.abspath(OUT)))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
