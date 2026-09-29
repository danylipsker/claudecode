"""Extract every sign of the Ministry sign chart (luach-tamrurim-2021.pdf) as a traced SVG.

    python build_signs.py [--pdf ../../luach-tamrurim-2021.pdf] [--out ..] [--only 101,ס-20] [--sheets DIR]

The chart is a Word document: each sign is a small embedded raster image in the first
column of a table, with the sign number printed in the second column. The script reads the
table rows from the page geometry, names every image after the number of its row, traces
it (signtrace.py) and writes <number>.svg. A row that shows several images gives
<number>_1.svg, <number>_2.svg ... (top to bottom, right to left).
"""
import argparse
import collections
import csv
import io
import json
import os
import re
import sys

import pymupdf
from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import signtrace  # noqa: E402

HEADER_MARK = "2."  # the number column is the second one; its header carries this mark

# Signs whose white is part of the board although it reaches the border of the picture with
# no outline around it (striped boards, posts): their white stays opaque.
KEEP_WHITE = {"112", "113", "148"}
# Shapes with a hollow outline (crossbucks, junctions, the cone, the posts on legs): the white
# inside their convex outline is background, not part of the sign.
HOLLOW = {"133", "134", "809", "924", "930", "931"}
# Signs drawn with a dotted line (the unlit lamp of a signal): every speck is kept.
DOTTED = {"720", "721"}


def page_rows(page):
    """Rows of the sign table: [(y0, y1, label or None, [image dict])] in page order."""
    imgs = []
    for im in page.get_images(full=True):
        for r in page.get_image_rects(im[0]):
            imgs.append(dict(xref=im[0], smask=im[1], rect=[r.x0, r.y0, r.x1, r.y1]))
    if not imgs:
        return []
    bold = []
    for b in page.get_text("dict")["blocks"]:
        if b["type"] != 0:
            continue
        for ln in b["lines"]:
            for s in ln["spans"]:
                t = s["text"].strip()
                if t and "Bold" in s["font"] and s["size"] >= 11.5:
                    bold.append((s["bbox"], t))
    head = [bb for bb, t in bold if t == HEADER_MARK and bb[1] < 120]
    if not head:
        return []
    colx = (head[0][0] + head[0][2]) / 2 - 13
    hx0, hx1 = colx - 23, colx + 24
    ys = []
    for dr in page.get_drawings():
        r = dr["rect"]
        if r.height < 1.5 and r.width > 20 and r.x0 <= colx - 5 and r.x1 >= colx + 5:
            ys.append((r.y0 + r.y1) / 2)
    ys.sort()
    lines = []
    for y in ys:
        if not lines or y - lines[-1] > 2:
            lines.append(y)
    bands = [b for b in zip(lines[:-1], lines[1:]) if b[0] > head[0][3] + 6]

    def band_of(y):
        for i, (a, b) in enumerate(bands):
            if a <= y < b:
                return i
        return None

    parts = collections.defaultdict(list)
    for bb, t in bold:
        cx = (bb[0] + bb[2]) / 2
        if not (hx0 <= cx <= hx1):
            continue
        bi = band_of((bb[1] + bb[3]) / 2)
        if bi is not None:
            parts[bi].append((bb, t))
    rows = []
    for bi, (a, b) in enumerate(bands):
        label = None
        if parts[bi]:
            # Hebrew reads right to left: the rightmost span comes first
            label = "".join(t for bb, t in sorted(parts[bi], key=lambda v: -v[0][0]))
            label = re.sub(r"\s+", "", label)
        mine = [im for im in imgs if band_of((im["rect"][1] + im["rect"][3]) / 2) == bi
                and im["rect"][0] > hx1 - 8]
        rows.append([a, b, label, mine])
    return rows


def reading_order(images):
    """Top to bottom, and right to left inside a line of images."""
    images = sorted(images, key=lambda im: (im["rect"][1] + im["rect"][3]) / 2)
    lines = []
    for im in images:
        cy = (im["rect"][1] + im["rect"][3]) / 2
        if lines and cy < lines[-1][-1]["rect"][3] - 0.35 * (im["rect"][3] - im["rect"][1]):
            lines[-1].append(im)
        else:
            lines.append([im])
    out = []
    for ln in lines:
        out.extend(sorted(ln, key=lambda im: -im["rect"][0]))
    return out


def collect(doc):
    """[(name, page, image dict)] for the whole chart."""
    signs = []
    last = None
    for pi, page in enumerate(doc):
        for a, b, label, images in page_rows(page):
            if label:
                last = label
            if not images:
                continue
            if not label:
                # a row without a number continues the sign above it
                label = last
                prev = [s for s in signs if s[0] == label]
                images = [s[2] for s in prev] + reading_order(images)
                signs = [s for s in signs if s[0] != label]
                pages = [s[1] for s in prev] + [pi + 1] * (len(images) - len(prev))
            else:
                images = reading_order(images)
                pages = [pi + 1] * len(images)
            for im, pg in zip(images, pages):
                signs.append((label, pg, im))
    named = []
    count = collections.Counter(s[0] for s in signs)
    seen = collections.Counter()
    for label, pg, im in signs:
        seen[label] += 1
        name = label if count[label] == 1 else "%s_%d" % (label, seen[label])
        named.append(dict(name=name, number=label, variant=seen[label] if count[label] > 1 else 0,
                          variants=count[label], page=pg, **im))
    return named


def load_image(doc, it):
    base = doc.extract_image(it["xref"])
    im = Image.open(io.BytesIO(base["image"])).convert("RGB")
    if it["smask"]:
        m = Image.open(io.BytesIO(doc.extract_image(it["smask"])["image"])).convert("L")
        if m.size != im.size:
            m = m.resize(im.size, Image.LANCZOS)
        im.putalpha(m)
    return im


def catalogue_names(path):
    if not os.path.exists(path):
        return {}
    data = json.load(open(path, encoding="utf-8"))
    return {s["num"]: s.get("name", {}) for s in data.get("signs", [])}


def render(svg, zoom, bg):
    d = pymupdf.open(stream=svg.encode("utf-8"), filetype="svg")
    pm = d[0].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=True)
    r = Image.open(io.BytesIO(pm.tobytes("png"))).convert("RGBA")
    b = Image.new("RGBA", r.size, bg)
    b.alpha_composite(r)
    return b.convert("RGB")


def contact_sheets(entries, folder, per_sheet=40, cols=5, box=112):
    os.makedirs(folder, exist_ok=True)
    bg = (168, 214, 168, 255)
    for si in range(0, len(entries), per_sheet):
        chunk = entries[si:si + per_sheet]
        rows = (len(chunk) + cols - 1) // cols
        cw, ch = 2 * box + 14, box + 22
        sheet = Image.new("RGB", (cols * cw, rows * ch), (70, 70, 70))
        dr = ImageDraw.Draw(sheet)
        for i, (it, im, svg) in enumerate(chunk):
            x0, y0 = (i % cols) * cw, (i // cols) * ch
            o = Image.new("RGBA", im.size, bg)
            o.alpha_composite(im.convert("RGBA"))
            k = min(box / o.width, box / o.height)
            size = (max(1, round(o.width * k)), max(1, round(o.height * k)))
            sheet.paste(o.convert("RGB").resize(size, Image.LANCZOS), (x0 + 2, y0 + 18))
            w_pt = it["rect"][2] - it["rect"][0]
            r = render(svg, size[0] / w_pt, bg).resize(size)
            sheet.paste(r, (x0 + box + 8, y0 + 18))
            dr.text((x0 + 3, y0 + 3), "%s  p%d  x%d" % (it["ascii"], it["page"], it["xref"]), fill=(255, 255, 255))
        sheet.save(os.path.join(folder, "sheet_%02d.png" % (si // per_sheet + 1)))


GALLERY = """<!doctype html>
<html lang="he" dir="rtl">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Driving signs</title>
<style>
  :root { --paper: #f4f4f1; --ink: #1d1d1b; --card: #ffffff; --line: #d9d9d4; --stage: #ffffff; }
  body { margin: 0; font: 15px/1.4 "Segoe UI", Arial, sans-serif; background: var(--paper); color: var(--ink); }
  header { position: sticky; top: 0; background: var(--paper); border-bottom: 1px solid var(--line);
           padding: 12px 16px; display: flex; gap: 12px; flex-wrap: wrap; align-items: center; z-index: 1; }
  h1 { font-size: 18px; margin: 0 0 0 auto; }
  input, button { font: inherit; padding: 6px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--card); color: var(--ink); }
  button[aria-pressed="true"] { background: var(--ink); color: var(--paper); }
  main { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; padding: 16px; }
  figure { margin: 0; background: var(--card); border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  figure a { display: flex; align-items: center; justify-content: center; height: 130px; padding: 10px; background: var(--stage); }
  figure img { max-width: 100%; max-height: 100%; }
  figcaption { padding: 6px 8px; border-top: 1px solid var(--line); font-size: 13px; }
  figcaption b { display: block; font-size: 15px; direction: ltr; text-align: right; unicode-bidi: plaintext; }
  body.dark { --stage: #35506b; }
  body.check { --stage: repeating-conic-gradient(#d8d8d8 0% 25%, #ffffff 0% 50%) 50% / 16px 16px; }
</style>
<header>
  <h1>לוח התמרורים - __COUNT__ קבצי SVG</h1>
  <input id="q" type="search" placeholder="חיפוש: מספר או שם" aria-label="חיפוש">
  <button data-bg="" aria-pressed="true">רקע לבן</button>
  <button data-bg="check" aria-pressed="false">שקיפות</button>
  <button data-bg="dark" aria-pressed="false">רקע כהה</button>
</header>
<main id="grid"></main>
<script>
const signs = __DATA__;
const grid = document.getElementById("grid");
function show(list) {
  grid.textContent = "";
  for (const s of list) {
    const f = document.createElement("figure");
    const a = document.createElement("a");
    a.href = encodeURIComponent(s.file);
    const img = document.createElement("img");
    img.loading = "lazy";
    img.src = encodeURIComponent(s.file);
    img.alt = s.number;
    a.append(img);
    const c = document.createElement("figcaption");
    const b = document.createElement("b");
    b.textContent = s.file.replace(/[.]svg$/, "");
    c.append(b, s.he || s.en || "");
    f.append(a, c);
    grid.append(f);
  }
}
show(signs);
document.getElementById("q").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();
  show(signs.filter(s => (s.file + " " + s.he + " " + s.en).toLowerCase().includes(q)));
});
for (const b of document.querySelectorAll("button[data-bg]")) {
  b.addEventListener("click", () => {
    document.body.className = b.dataset.bg;
    for (const o of document.querySelectorAll("button[data-bg]")) o.setAttribute("aria-pressed", o === b);
  });
}
</script>
</html>
"""


def write_gallery(index, folder):
    data = [dict(file=r["file"], number=r["number"], he=r["name_he"], en=r["name_en"]) for r in index]
    page = GALLERY.replace("__COUNT__", str(len(index))).replace("__DATA__", json.dumps(data, ensure_ascii=False))
    with open(os.path.join(folder, "index.html"), "w", encoding="utf-8", newline="\n") as f:
        f.write(page)


def ascii_name(name):
    return name.replace("ס-", "S-").replace("פ", "P")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", default=os.path.join(HERE, "..", "..", "luach-tamrurim-2021.pdf"))
    ap.add_argument("--out", default=os.path.join(HERE, ".."))
    ap.add_argument("--catalogue", default=os.path.join(HERE, "..", "..", "content", "il", "signs.json"))
    ap.add_argument("--only", default="")
    ap.add_argument("--sheets", default="")
    ap.add_argument("--keep-white", default="", help="names whose white background stays opaque")
    args = ap.parse_args()
    doc = pymupdf.open(args.pdf)
    names = catalogue_names(args.catalogue)
    signs = collect(doc)
    only = set(v for v in args.only.split(",") if v)
    keep_white = KEEP_WHITE | set(v for v in args.keep_white.split(",") if v)
    os.makedirs(args.out, exist_ok=True)
    index = []
    sheets = []
    for it in signs:
        it["ascii"] = ascii_name(it["name"])
        if only and it["name"] not in only and it["number"] not in only:
            continue
        im = load_image(doc, it)
        w_pt = it["rect"][2] - it["rect"][0]
        h_pt = it["rect"][3] - it["rect"][1]
        info = {}
        paths, w, h = signtrace.trace_image(im, keep_white=bool({it["name"], it["number"]} & keep_white), info=info,
                                            hull=it["number"] not in HOLLOW, dots=it["number"] in DOTTED,
                                            sx=w_pt / im.width, sy=h_pt / im.height)
        nm = names.get(it["number"].replace("-", ""), {})
        title = it["number"] + (" - " + nm["he"] if nm.get("he") else "")
        if it["variants"] > 1:
            title += " (%d/%d)" % (it["variant"], it["variants"])
        desc = (nm["en"] + ". " if nm.get("en") else "") + \
            "Traced from the Ministry of Transport sign chart (luach-tamrurim-2021.pdf), page %d." % it["page"]
        svg = signtrace.svg_document(paths, w_pt, h_pt, title=title, desc=desc)
        with open(os.path.join(args.out, it["name"] + ".svg"), "w", encoding="utf-8", newline="\n") as f:
            f.write(svg)
        index.append(dict(file=it["name"] + ".svg", number=it["number"], variant=it["variant"] or "",
                          page=it["page"], name_he=nm.get("he", ""), name_en=nm.get("en", ""),
                          width_pt=round(w_pt, 2), height_pt=round(h_pt, 2),
                          source_px="%dx%d" % im.size, colours=" ".join(info["colors"]),
                          background=info.get("background", "none"), traced_at="%dx" % info["scale"]))
        sheets.append((it, im, svg))
        print("%-10s p%-3d x%-4d %-9s %dx aa=%.2f bg=%-11s %s" % (
            it["ascii"], it["page"], it["xref"], "%dx%d" % im.size, info["scale"], info["aa"],
            info.get("background", "none"), " ".join(info["colors"])))
    if not only:
        with open(os.path.join(args.out, "index.csv"), "w", encoding="utf-8-sig", newline="") as f:
            wr = csv.DictWriter(f, fieldnames=list(index[0].keys()))
            wr.writeheader()
            wr.writerows(index)
        write_gallery(index, args.out)
    if args.sheets:
        contact_sheets(sheets, args.sheets)
    print("%d signs written to %s" % (len(index), os.path.abspath(args.out)))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
