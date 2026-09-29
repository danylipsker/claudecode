"""Bring the sign names of the traced files up to date with ../content/il/signs.json,
without tracing again: the <title> and <desc> of every SVG, index.csv and index.html.

    python sync_names.py            # rewrite what changed
    python sync_names.py --check    # list what would change

Run it after a sign is renamed in the app; tools/import-sign-art.js refuses files whose
title does not carry the sign's current Hebrew name.
"""
import csv
import html
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import build_signs  # noqa: E402

OUT = os.path.join(HERE, "..")


def main():
    check = "--check" in sys.argv
    names = build_signs.catalogue_names(os.path.join(HERE, "..", "..", "content", "il", "signs.json"))
    csv_path = os.path.join(OUT, "index.csv")
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
    count = {}
    for r in rows:
        count[r["number"]] = count.get(r["number"], 0) + 1
    changed = []
    for r in rows:
        nm = names.get(r["number"].replace("-", ""), {})
        he, en = nm.get("he", ""), nm.get("en", "")
        if he == r["name_he"] and en == r["name_en"]:
            continue
        changed.append("%s: %s -> %s | %s -> %s" % (r["file"], r["name_he"], he, r["name_en"], en))
        r["name_he"], r["name_en"] = he, en
        if check:
            continue
        title = r["number"] + (" - " + he if he else "")
        if count[r["number"]] > 1:
            title += " (%s/%d)" % (r["variant"], count[r["number"]])
        desc = (en + ". " if en else "") + \
            "Traced from the Ministry of Transport sign chart (luach-tamrurim-2021.pdf), page %s." % r["page"]
        p = os.path.join(OUT, r["file"])
        with open(p, encoding="utf-8") as f:
            svg = f.read()
        svg = re.sub(r"<title>[\s\S]*?</title>", lambda m: "<title>%s</title>" % html.escape(title, quote=False), svg, count=1)
        svg = re.sub(r"<desc>[\s\S]*?</desc>", lambda m: "<desc>%s</desc>" % html.escape(desc, quote=False), svg, count=1)
        with open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(svg)
    print("\n".join(changed) or "all names are current")
    if changed and not check:
        with open(csv_path, "w", encoding="utf-8-sig", newline="") as f:
            wr = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            wr.writeheader()
            wr.writerows(rows)
        build_signs.write_gallery(rows, OUT)
        print("%d file(s) renamed; index.csv and index.html rewritten" % len(changed))


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    main()
