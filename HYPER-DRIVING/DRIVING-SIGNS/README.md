# DRIVING-SIGNS

Every sign of the Ministry of Transport sign chart (`../luach-tamrurim-2021.pdf`, the 2021
edition, 93 pages) as a traced SVG file: 436 files for 391 sign numbers.

Open `index.html` to browse them (search by number or name, white / checker / dark stage).
`index.csv` lists every file with its number, chart page, Hebrew and English name, size,
colours and how it was traced.

## Names

A file is named after the sign number printed in the chart, exactly as printed:

| Chart | File |
| --- | --- |
| 101 … 935 | `101.svg` … `935.svg` |
| a number with the letter פ (the illuminated / variable version) | `127פ.svg`, `401פ.svg` … |
| the symbols ס-4 … ס-132 | `ס-4.svg` … `ס-132.svg` |
| a number that shows several pictures | `128_1.svg`, `128_2.svg` … top to bottom, right to left |

Symbols ס-1 … ס-3, ס-18, ס-19, ס-76 … ס-79, ס-94 … ס-99 and ס-121 … ס-129 have a row in
the chart but no picture (text only or reserved), so they have no file.

Each file carries the sign number and its Hebrew name in `<title>` and the English name
and the chart page in `<desc>`. The names come from `../content/il/signs.json`.

## What the files are

The chart is a Word document: the signs in it are small raster pictures (60 - 300 px
wide, most of them JPEG), not vector drawings. So the SVG files are traced. For each
picture the tracer

1. finds the flat colours of the sign and explains every pixel as one colour or a blend of
   two neighbouring ones, so an anti-aliased edge gives sub-pixel position instead of a
   fringe of a third colour;
2. drops the JPEG halos and hairline fringes between two colours;
3. makes the white around the sign transparent (white inside the sign stays white);
4. stacks the colours, largest first, each one running under the ones above it, so two
   neighbouring colours share one edge and no gap shows between them;
5. outlines every colour with smooth cubic curves; corners stay sharp.

Shapes and colours are those of the chart. Colours are the measured ones (a pure chart
red is `#f00`, the blue `#00f`, the orange `#ff7300` …), not repainted from a standard.
The size of each file (`width` / `height`, in points) is the size of the picture on the
chart page, so the signs keep their relative sizes.

## Limits

The source pictures are small, and a trace cannot show more than they hold:

- Small lettering on the direction signs (6 - 8 px high in the chart) is legible but
  rough. It is outlined, not set in a font.
- Curves follow the pixels to about a third of a pixel; at very high zoom long arcs are
  slightly uneven.
- The variable message boards 933 and 934 are photographs of lamp matrices in the chart;
  their traces are approximate.
- The lamp pictures 720 and 721 show the unlit lamp as a dotted circle of single pixels;
  the dots are kept, their spacing is uneven as in the source.
- 37 pictures keep an opaque white ground because their white is part of the board or
  the picture has no plain background (`background` column of `index.csv`).

## Rebuilding

    cd _tools
    python build_signs.py                     # all signs, into this folder
    python build_signs.py --only 302,ס-20     # some signs
    python build_signs.py --sheets <folder>   # also original-beside-trace check sheets

Needs Python 3 with `pymupdf`, `numpy`, `scipy`, `pillow` and `potracer`.

- `_tools/build_signs.py` reads the table rows of the chart, names the pictures, writes the files.
- `_tools/signtrace.py` colour separation, background, layers.
- `_tools/smoothtrace.py` outline of a mask as smooth curves.
- `_tools/sync_names.py` after a sign is renamed in `content/il/signs.json`: rewrites the
  titles, `index.csv` and `index.html` without tracing again (`--check` lists the changes).

Three short lists at the top of `build_signs.py` hold the per-sign exceptions: `KEEP_WHITE`
(boards whose white reaches the edge of the picture), `HOLLOW` (open shapes whose inner
white is background) and `DOTTED` (dotted lines).

## In the app

Hyper Driving shows these pictures: `node tools/import-sign-art.js` (from the
HYPER-DRIVING folder) reads every file here into `content/il/sign-art.json`, keyed by
the app's sign number (`ס-20.svg` → `ס20`, `128_1.svg`/`128_2.svg` → two pictures of
128), rewrites the paths on a grid of 8 units per source pixel (about 3 MB instead of
7.3 MB; outlines move by 1/16 pixel at most) and refuses a file whose title does not
carry the sign's current Hebrew name. Then `node tools/publish.js` lists it in the
manifest. Signs without a file here keep their drawing from `signs.json`.

