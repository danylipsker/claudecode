# Drawing signs and warning lights

Signs and dashboard lights are not pictures: each is a shape, colours and a
list of drawing items (`js/signs.js` header documents it all), so a transport
authority can change or add one through a content update. The drawings are
made here, one work file per batch, and merged into `signs.json` / `dash.json`.

## Work files

```
_work/signs-<batch>.json   { "glyphs": { "<name>": [parts] }, "signs": [ { "num": "…", "shape": …, "colors": …, "w": …, "draw": [ … ] } ] }
_work/dash.json            { "glyphs": { … }, "lights": [ full light objects ] }
```

A work-file sign lists only the drawing keys (`shape, colors, w, draw, lamps,
flash, horizontal, svg`); names and meanings stay in `signs.json`. The
research description of each sign (what it looks like) is its `pictogram`
field in `signs.json` — draw what it says.

## The drawing model (100-high box; rectangles are 100·w wide)

Shapes: `triangle` (warning; symbol area centre ≈ (50, 62), about 44 wide),
`triangle-down` (give way), `circle` (prohibition: red ring, symbol inside
r ≈ 34; mandatory: blue disc, thin white rim), `octagon`, `square`, `rect`
(with `"w": 1.5` etc.), `diamond`, `plate` (white supplementary plate with a
black border), `marking` (asphalt background; draw lines on it), `light`
(a signal head: `"lamps": [{ "c": "red", "on": true, "g": "arrow-up" }]`,
`"flash": [indexes]`, `"horizontal": true`), `none`.

Colours: `red blue green yellow orange brown black white grey asphalt` or
`symbol` / `field` / `border` (the sign's own), or `#hex`. Defaults per
category: warning = white field, red border, black symbol; prohibition =
white, red ring, black; mandatory = blue field, white symbol; information =
blue square; guide = green rectangle; supplementary = white plate, black.

Items:

```
{ "g": "car-side", "x": 50, "y": 62, "s": 0.5, "rot": 0, "flip": false, "c": "symbol" }   a glyph (its 100-box centred on x,y, scaled by s)
{ "t": "50", "x": 50, "y": 52, "size": 40, "c": "symbol", "wt": 700 }                  text (Hebrew is fine)
{ "bar": 1 }                                                                            the red diagonal of a prohibition
{ "d": "M20 80 L80 20", "sw": 8, "c": "symbol" }                                        a path (sw = stroke width; 0/absent = filled)
{ "line": [x1, y1, x2, y2], "sw": 3, "dash": [8, 6], "c": "white" }
{ "rect": [x, y, w, h, rx], "c": "…" }     { "circle": [cx, cy, r], "c": "…", "sw": 0 }
```

Glyphs are reusable pictograms in their own 100 × 100 box centred on (50, 50):
`[{ "d": "M…" }, { "d": "M…", "fill": "field" }, { "circle": [cx, cy, r] },
{ "rect": [x, y, w, h, rx] }, { "d": "M…", "stroke": 6 }, { "text": "P", "x": 50, "y": 52, "size": 40 }]`
— filled in the item's colour; `"fill": "field"` cuts a window in the sign's
field colour. Base glyphs are in `js/glyphs.js` (see them with
`node tools/sheet.js glyphs`). Put new glyphs in your work file's `"glyphs"`
with a **prefix for your batch** (`w-`, `p-`, …) so parallel batches do not
collide; reuse base glyphs freely.

Style: the official Israeli sign chart (לוח התמרורים). The renderer already
gives every sign the chart's colours (pure red, pure blue, green #007C00,
yellow, orange) and frames: a triangle border ≈ 11.5 % of the height, a
prohibition ring a quarter of the radius, a mandatory disc that is blue to the
edge with a thin white ring just inside, a blue panel with a thin white frame
set in from the edge, the stop octagon red–white–red. You draw the **symbol**:
match the official picture's shape, weight and size — official pictograms are
bold black silhouettes that fill the symbol area (a warning symbol spans most
of the white field; an arrow on a mandatory disc spans ≈ 80 % of the disc,
shaft ≈ 14 wide). Side views face the way the chart shows them.

Traffic lights (`light`) are drawn as the chart draws them: a white box with a
black outline, lamps outlined in black, a lit lamp filled with its colour, an
unlit one white. A white-light (tram/bus) signal and a lamp with a figure
(pedestrian, cyclist) are black discs with the shape in the light's colour;
`"face": "black" | "white" | "color"` on a lamp overrides that. Heads have the
lamp count the chart shows (usually three, with the unlit ones listed).

## See what you drew

```
node tools/sheet.js signs --file content/il/_work/signs-<batch>.json --out _sheets/<batch>.png --size 120 --cols 8
node tools/sheet.js signs --file content/il/_work/signs-<batch>.json --nums 101,102 --size 260 --out _sheets/zoom.png
node tools/sheet.js dash --file content/il/_work/dash.json --out _sheets/dash.png
```

then look at the PNG (Read the file). Signs with no drawing or an unknown
glyph get a red outline. Iterate until every sign is right. Finally:

```
node tools/validate.js --grep "sign "
```
