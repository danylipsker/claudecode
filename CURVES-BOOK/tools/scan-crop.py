"""Curves Workshop · tools/scan-crop.py

Cut a piece of a scanned page of the book at a readable size, to look at a figure closely.

    python tools/scan-crop.py 10 0.55 0.95                 page 10, from 55% to 95% of the height, full width
    python tools/scan-crop.py 10 0.55 0.95 0.1 0.8         ... and from 10% to 80% of the width
    python tools/scan-crop.py 10 0.55 0.95 --out my.jpg    choose the output file

The pages are scan/pNNN.jpg (NNN = the page number printed in the book). The crop is
written to scan/crops/pNNN-<top>-<bottom>.jpg unless --out is given, and its path printed.
"""
import os
import sys
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
SCAN = os.path.join(HERE, '..', 'scan')


def main(argv):
    out = None
    if '--out' in argv:
        i = argv.index('--out')
        out = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
    if len(argv) < 3:
        print(__doc__)
        return 2
    page = int(argv[0])
    top, bottom = float(argv[1]), float(argv[2])
    left = float(argv[3]) if len(argv) > 3 else 0.05
    right = float(argv[4]) if len(argv) > 4 else 0.97
    src = os.path.join(SCAN, 'p%03d.jpg' % page)
    if not os.path.exists(src):
        print('no such page: ' + src)
        return 1
    im = Image.open(src)
    w, h = im.size
    box = (int(w * left), int(h * top), int(w * right), int(h * bottom))
    crop = im.crop(box)
    # enlarge small crops so the lettering is readable
    if crop.width < 1200:
        f = 1200 / crop.width
        crop = crop.resize((int(crop.width * f), int(crop.height * f)), Image.LANCZOS)
    if out is None:
        os.makedirs(os.path.join(SCAN, 'crops'), exist_ok=True)
        out = os.path.join(SCAN, 'crops', 'p%03d-%02d-%02d.jpg' % (page, round(top * 100), round(bottom * 100)))
    crop.save(out, quality=88)
    print(os.path.abspath(out))
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
