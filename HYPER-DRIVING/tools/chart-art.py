#!/usr/bin/env python3
"""Hyper Driving · tools/chart-art.py — the official picture of every sign,
taken from the Ministry's sign chart (לוח התמרורים, the PDF booklet) into
content/il/signs-art.json.

    python3 tools/chart-art.py luach-tamrurim-2021.pdf
    python3 tools/chart-art.py luach-tamrurim-2021.pdf --sheets _sheets/art   # contact sheets to look at
    python3 tools/chart-art.py <pdf> --out content/il/signs-art.json --colors 128

Needs: pip install pymupdf pillow numpy scipy

How it works. The booklet is a table: picture | number | meaning | where it
stands. Each picture is an embedded image; the number stands in its own
column. Rows are read from the table's rule lines, so a sign whose row shows
several pictures (both forms of 128, the four arrows of 813, a sign with and
without its plate) keeps them all: the first is the sign's picture, the rest
are its other forms. A picture that the document crops is rendered from the
page instead of taken raw. The white paper around a sign is made transparent
(so the app can show it on any background), the pixels along that edge lose
their white share, near-white paper inside a frame becomes white, and the
result is palette-reduced PNG (signs are flat colours) as a data URL.

The appendix's symbols (ס-4 …) are numbered "ס4" like signs.json. Numbers
with a פ (the fluorescent, black-backed form) keep it: "127פ".
"""
import argparse, base64, io, json, os, re, sys

import numpy as np
import pymupdf
from PIL import Image, ImageDraw, ImageFont
from scipy import ndimage

ap = argparse.ArgumentParser()
ap.add_argument('pdf')
ap.add_argument('--out', default=os.path.join(os.path.dirname(__file__), '..', 'content', 'il', 'signs-art.json'))
ap.add_argument('--sheets', help='folder for contact sheets (PNG) of what was taken')
ap.add_argument('--colors', type=int, default=128, help='palette size of each picture (0 = full colour)')
ap.add_argument('--png-dir', help='also write every picture as a PNG file here')
args = ap.parse_args()

doc = pymupdf.open(args.pdf)
NUMCOL = (262, 312)      # x-range of the number column (page points)
PAPER = 200              # min(r, g, b) at or above this is paper, for the flood fill
WHITE = 232              # opaque near-white inside a sign becomes pure white
FIRST_PAGE, LAST_PAGE = 7, 91          # the tables: signs 101–935, then the symbol appendix
APPENDIX_FROM = 78
# rows whose first picture is not the sign itself (the chart shows the sign
# with its plate first): index of the picture to use as the sign's own
PRIMARY = {'128': 1, '129': 1}
# signs the app lists as a variant of another: their picture is that sign's
# n-th form in the chart (the chart shows both under the one number)
VARIANTS = {'607פ': ('607', 1), '933פ': ('933', 1), '934פ': ('934', 1)}


def hlines(page):
    out = []
    for dr in page.get_drawings():
        for it in dr['items']:
            if it[0] == 'l' and abs(it[1].y - it[2].y) < 0.5:
                out.append((it[1].y, min(it[1].x, it[2].x), max(it[1].x, it[2].x)))
            elif it[0] == 're' and it[1].height < 1.5:
                out.append(((it[1].y0 + it[1].y1) / 2, it[1].x0, it[1].x1))
    return out


def uniq(ys):
    m = []
    for y in sorted(ys):
        if not m or y - m[-1] > 2: m.append(y)
    return m


# ---------- 1. which picture belongs to which number ----------
rows, notes = [], []
for pno in range(FIRST_PAGE - 1, LAST_PAGE):
    page = doc[pno]; pnum = pno + 1; appendix = pnum >= APPENDIX_FROM
    L = hlines(page)
    outer = uniq([y for (y, x0, x1) in L if x0 <= 60])                                   # rules across the whole table
    subs = uniq([y for (y, x0, x1) in L if x0 <= NUMCOL[0] + 5 and x1 >= NUMCOL[1] - 12])  # rules across the number column
    if len(outer) < 2: continue
    if subs and subs[-1] > outer[-1] + 8: outer.append(subs[-1])   # a table that ends without a full rule
    words = page.get_text('words')
    col = [(w[4], (w[1] + w[3]) / 2) for w in words if w[0] >= NUMCOL[0] and w[2] <= NUMCOL[1] and w[3] < 560]
    imgs = [(im['xref'], im['bbox']) for im in page.get_image_info(xrefs=True)]
    yc = lambda b: (b[1] + b[3]) / 2
    for oi in range(len(outer) - 1):
        oy0, oy1 = outer[oi], outer[oi + 1]
        if oy1 - oy0 < 8: continue
        bands = [y for y in subs if oy0 - 1 <= y <= oy1 + 1]
        if not bands or bands[0] > oy0 + 1: bands = [oy0] + bands
        if bands[-1] < oy1 - 1: bands.append(oy1)
        entries = []
        for i in range(len(bands) - 1):
            y0, y1 = bands[i], bands[i + 1]
            if y1 - y0 < 8: continue
            cw = [t for (t, y) in col if y0 <= y <= y1]
            digits = [t for t in cw if re.fullmatch(r'\d{1,3}', t)]
            if len(digits) > 1: notes.append(f'p{pnum}: several numbers {digits} in one row')
            num = (('ס' if appendix else '') + digits[0] + ('פ' if 'פ' in cw else '')) if digits else None
            entries.append([num, y0, y1, []])
        for x, b in [(x, b) for x, b in imgs if oy0 - 1 <= yc(b) <= oy1 + 1]:
            home = next((e for e in entries if e[1] - 1 <= yc(b) <= e[2] + 1), None)
            if home is None or home[0] is None:      # a second picture under the number's own row
                cands = [e for e in entries if e[0]]
                if not cands: notes.append(f'p{pnum}: picture at y={b[1]:.0f} has no number'); continue
                home = min(cands, key=lambda e: min(abs(yc(b) - e[1]), abs(yc(b) - e[2])) + (0 if e[1] < yc(b) else 5))
            home[3].append((x, b))
        for num, y0, y1, ims in entries:
            if not num or not ims: continue
            ims.sort(key=lambda t: (round(t[1][1] / 6), -t[1][0]))     # top to bottom, then right to left
            k = PRIMARY.get(num, 0)
            if k: ims = [ims[k]] + ims[:k] + ims[k + 1:]
            rows.append({'num': num, 'page': pnum, 'imgs': [{'xref': x, 'bbox': list(b)} for x, b in ims]})
nums = [r['num'] for r in rows]
assert len(nums) == len(set(nums)), 'a number was read twice: ' + str([n for n in nums if nums.count(n) > 1])


# ---------- 2. the picture itself ----------
def extract(pnum, xref, bbox):
    pix = pymupdf.Pixmap(doc, xref)
    if pix.n - pix.alpha >= 4: pix = pymupdf.Pixmap(pymupdf.csRGB, pix)
    sm = doc.xref_get_key(xref, 'SMask')
    if sm[0] == 'xref':
        if pix.alpha: pix = pymupdf.Pixmap(pix, 0)
        pix = pymupdf.Pixmap(pix, pymupdf.Pixmap(doc, int(sm[1].split()[0])))
    ar_img = pix.width / pix.height; ar_box = (bbox[2] - bbox[0]) / (bbox[3] - bbox[1])
    if abs(ar_img / ar_box - 1) > 0.02:     # cropped in the document: take what the page shows, at the picture's own scale
        scale = pix.width / (bbox[2] - bbox[0])
        pix = doc[pnum - 1].get_pixmap(clip=pymupdf.Rect(*bbox), matrix=pymupdf.Matrix(scale, scale), alpha=False)
        notes.append(f'p{pnum}: picture {xref} is cropped in the booklet; rendered from the page')
    return Image.open(io.BytesIO(pix.tobytes('png'))).convert('RGBA')


# ---------- 3. paper → transparent, soft edge, trim ----------
def clean(img):
    a = np.array(img).astype(np.int16)
    rgb, al = a[..., :3], a[..., 3]
    minc = rgb.min(axis=2)
    paper = (minc >= PAPER) | (al < 128)
    lab, n = ndimage.label(paper)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))); border.discard(0)
    bg = np.isin(lab, list(border)) if border else np.zeros_like(paper)
    lab2, n2 = ndimage.label(~bg)                       # specks floating in the paper go too
    if n2 > 1:
        sizes = ndimage.sum(~bg, lab2, range(1, n2 + 1))
        keep = np.zeros(n2 + 1, bool); keep[1:] = sizes >= max(30, 0.002 * bg.size)
        bg = bg | ~keep[lab2]
    out = a.copy()
    out[..., 3] = np.where(bg, 0, al)
    ring = ndimage.binary_dilation(bg, iterations=1) & ~bg   # the pixels along the edge: take the white out of them
    alpha = (255 - minc[ring].clip(0, 255)).clip(0, 255)
    c = out[ring][:, :3]
    out[ring, :3] = ((c - (255 - alpha)[:, None]) * 255 / np.maximum(alpha, 1)[:, None]).clip(0, 255).astype(np.int16)
    out[ring, 3] = np.minimum(out[ring, 3], alpha)
    white = ~bg & ~ring & (minc >= WHITE)                    # off-white paper inside a frame
    out[white, :3] = 255
    im = Image.fromarray(out.clip(0, 255).astype(np.uint8), 'RGBA')
    bb = im.getbbox()
    if bb:
        im = im.crop((max(0, bb[0] - 1), max(0, bb[1] - 1), min(im.width, bb[2] + 1), min(im.height, bb[3] + 1)))
    return im


def encode(im):
    if args.colors: im = im.quantize(colors=args.colors, method=Image.Quantize.FASTOCTREE)
    b = io.BytesIO(); im.save(b, 'PNG', optimize=True)
    return 'data:image/png;base64,' + base64.b64encode(b.getvalue()).decode('ascii')


art, pngs = {}, {}
for r in rows:
    forms = []
    for k, im in enumerate(r['imgs']):
        img = clean(extract(r['page'], im['xref'], im['bbox']))
        forms.append({'w': img.width, 'h': img.height, 'src': encode(img)})
        pngs[r['num'] + ('' if k == 0 else f'~{k}')] = img
    art[r['num']] = dict(forms[0], **({'alt': forms[1:]} if len(forms) > 1 else {}))
for var, (base, k) in VARIANTS.items():
    alts = art.get(base, {}).get('alt', [])
    if len(alts) < k: notes.append(f'{var}: the chart shows no {k + 1}. form of {base}'); continue
    art[var] = alts[k - 1]
    art[base]['alt'] = alts[:k - 1] + alts[k:]
    if not art[base]['alt']: del art[base]['alt']
    pngs[var] = pngs.pop(f'{base}~{k}')
    for j in range(k + 1, len(alts) + 1): pngs[f'{base}~{j - 1}'] = pngs.pop(f'{base}~{j}')

out = {
    'source': {
        'he': 'לוח התמרורים (לות״ם), ספטמבר 2020 — ק״ת התש״ף עמ׳ 2560, מס׳ 8735 מיום 02.09.2020',
        'en': 'The sign chart (Luach Tamrurim), September 2020 — Kovetz HaTakanot 5780 p. 2560, no. 8735 of 2 September 2020'
    },
    'note': 'Each sign\'s official picture, as a data URL, with its pixel size; "alt" holds the other forms the chart shows for it. Made by tools/chart-art.py; a sign that is missing here is drawn from its "draw" items in signs.json.',
    'art': art
}
os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
with open(args.out, 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print('\n'.join(notes))
print(f'{len(art)} signs, {sum(1 + len(a.get("alt", [])) for a in art.values())} pictures → {args.out} ({os.path.getsize(args.out) / 1e6:.2f} MB)')

if args.png_dir:
    os.makedirs(args.png_dir, exist_ok=True)
    for name, img in pngs.items(): img.save(os.path.join(args.png_dir, name + '.png'), optimize=True)

if args.sheets:
    os.makedirs(args.sheets, exist_ok=True)
    font = ImageFont.load_default(size=13)
    def sheet(names, path, H=96, cols=9, CW=170):
        cells = []
        for n in names:
            for k in range(1 + len(art[n].get('alt', []))):
                key = n + ('' if k == 0 else f'~{k}')
                im = pngs[key]; s = min(H / im.height, (CW - 12) / im.width)
                cells.append((key, im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)))
        CH = H + 26; nrows = (len(cells) + cols - 1) // cols
        S = Image.new('RGBA', (cols * CW, max(1, nrows) * CH), (72, 76, 84, 255)); d = ImageDraw.Draw(S)
        for i, (label, im) in enumerate(cells):
            x, y = (i % cols) * CW, (i // cols) * CH
            S.paste(im, (x + (CW - im.width) // 2, y + 4 + (H - im.height) // 2), im)
            d.text((x + 6, y + H + 8), label.replace('ס', 'S').replace('פ', 'F'), fill=(255, 255, 255, 255), font=font)
        S.save(path)
    groups = {}
    for n in art: groups.setdefault('S' if n.startswith('ס') else n[0] + '00', []).append(n)
    for g, names in groups.items():
        if len(names) > 36:
            h = (len(names) + 1) // 2
            sheet(names[:h], os.path.join(args.sheets, g + 'a.png')); sheet(names[h:], os.path.join(args.sheets, g + 'b.png'))
        else: sheet(names, os.path.join(args.sheets, g + '.png'))
    print('sheets in', args.sheets)
