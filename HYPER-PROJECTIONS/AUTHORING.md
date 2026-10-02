# Hyper Projections — authoring guide

This is the guide for writing a topic of Hyper Projections. Read **`HYPER-CORE/AUTHORING.md`
first** (the format of a concept, formulas, quizzes, simulations, the TeX that works, the backslash
trap); this file adds what is special here: the hand constructions, the projection engine and the
three reference pages. Then read the three reference files — `content/reference.js`,
`sims/reference.js`, `constructions/reference.js` — they set the depth, tone and layout.

Plain JavaScript, no build step, no libraries, no network at run time. **All text must be original.**

## What a page is for

Dany wants to understand each projection *deeply* and to be able to **make it by hand with ruler
and compass**. So every concept page here has, besides the usual explanation, key ideas, pitfalls,
quiz and examples:

1. **The matrix or formula.** Parallel and central projections are 4 × 4 matrices (write them with
   `bmatrix`); map and sky projections are formulas in λ, φ or in α, δ, h, A. Say what each row does.
2. **A construction** (`construction: 'id'`): the drawing made step by step with named hand tools, in
   a `constructions/<topic>.js` file. The reader plays it, prints it as a worksheet, and practises it
   on a board that checks every stroke. One construction per page is the norm; two where the page
   needs them (the isometric page has the cube and the four-centre circle).
3. **A simulation** (`sim: 'id'`) where the projection should be seen moving: the object turning
   into position, the vanishing points sliding, the globe beside its map, the sky turning. Use
   `kit.proj`, `kit.world`, `kit.sky` — never re-derive what the engine knows.
4. **Applications** (`applications: [...]`, 3–5 items): where this projection is used in practice
   and *why that one*. The validator warns when a page has none, or has neither a sim nor a
   construction.
5. **History** (`history:`) and **sources** (`sources: [...]`): who, when, and the book or standard
   where it is set out.

A concept body runs 1800–3500 characters with `###` subheadings: the idea first, then the
mathematics, then what the projection keeps and loses, then how it is drawn. British spelling.

## Files

```
HYPER-PROJECTIONS/
  content/outline.js            the branches, topics and planned concepts (do not edit)
  content/reference.js          the three reference concepts (do not edit)
  content/<topic>.js            your concepts                                   ← you write
  sims/<topic>.js               your simulations                                ← you write
  constructions/<topic>.js      your constructions                              ← you write
  AUTHORING.md                  this file
HYPER-CORE/js/projection.js     kit.proj — matrices, cameras, vanishing points, curvilinear mappings, map projections, geodesy, models
HYPER-CORE/js/celestial.js      kit.sky  — time, coordinates, Sun, Moon, planets, stars, constellations
HYPER-CORE/js/geodata.js        kit.world — coastlines, lakes, cities
HYPER-CORE/js/construct.js      the construction kit and its SVG renderer
```

Write only the files you were given (`content/<topic>.js`, `sims/<topic>.js`,
`constructions/<topic>.js` for your topic ids). Do not edit the outline, the reference files, anything
in `HYPER-CORE`, or another writer's files; the integrator wires your files into `index.html`.
Wrap each sims file and each constructions file in `(function () { 'use strict'; … })();`.

### Checks you must run (0 errors required; read the warnings)

```
node --check content/<topic>.js
node HYPER-CORE/tools/validate.js HYPER-PROJECTIONS --only content/<topic>.js,sims/<topic>.js,constructions/<topic>.js
node HYPER-CORE/tools/simtest.js HYPER-PROJECTIONS --only sims/<topic>.js
```

The validator loads every construction, builds it and renders it; a construction that throws, draws
nothing in a step, or has no text on a step is an error. To look at your pages before they are wired
in, open `http://localhost:8172/HYPER-PROJECTIONS/?extra=content/<topic>.js,sims/<topic>.js,constructions/<topic>.js#/c/<id>`
in your own browser tab (`tabs_create`, then `navigate` with that tab's id; pass the id to every call —
other writers share the browser). Check the "Draw it by hand" section plays, the simulation mounts,
and the matrices render.

## Ids

Use the ids in the outline's `plan` lists. Map-projection pages whose id matches a projection in the
engine (`gnomonic-projection`, `mercator-projection`, `mollweide-projection`, `robinson-projection`,
`winkel-tripel`, `goode-homolosine`, `van-der-grinten` …) are linked automatically from the Map lab;
the engine's ids are in `kit.proj.maps.list()` — `id`, `name`, `group`, `props`, `who`, `year`, `note`,
`params`. Links to other disciplines: `math:matrices`, `math:trigonometry`, `physics:refraction` …
(check they exist in the catalogs; the validator warns).

## Constructions

```js
Hyper.construction({
  id: 'two-point-box',                       // lowercase-with-dashes, unique in the app
  title: 'A box in two-point perspective by the measuring-point method',
  tags: ['perspective', 'measuring points'],  // optional
  note: 'Anything the reader should know: what is approximate, what the book does differently.',  // optional, Markdown
  build(k) {
    const g = k.g;                           // plane geometry helpers (below)
    const HL = 0, GL = -120;                 // coordinates: y upwards, any units; the figure spans ~300–600 units
    k.given('The horizon line HL and the ground line GL, the vanishing points V1, V2 and the measuring points M1, M2.', () => { ... });
    k.step('straightedge', 'From A draw lines to V1 and V2: the two base edges recede.', () => { ... });
    k.step('dividers', 'Lay off the true width w and depth d along GL from A.', () => { ... });
    k.step('pencil', 'Line in the box.', () => { ... });
  }
});
```

**Steps and tools.** Every shape is drawn inside a step; the first is normally `given`. Name the
tool honestly: it is what the learner picks up.

| tool | use it for |
|---|---|
| `given` | the data: the views you start from, the station point, the globe's radius, the latitude, a given length (draw it as a ticked segment so the dividers can carry it) |
| `straightedge` | a line through two known points |
| `tee` | a horizontal across the sheet (T-square); with the set square against it, a vertical |
| `square` | a perpendicular or a parallel through a point; a 30°, 45° or 60° line |
| `compass` | a circle or an arc about a known centre, radius taken from the drawing |
| `dividers` | carry a length; step off equal parts along a line or a circle |
| `ruler` | lay off a stated length (a table value, a scale) |
| `protractor` | lay off a stated angle |
| `pencil` | the result: line in the figure, trace the curve through the points found |
| `fold` | a crease: rabatting a plane, unfolding a development |
| `thread` | a stretched thread or sight line (Dürer's devices) |
| `note` | an explanation drawn on the figure: labels, arrows, shading, the true curve dashed for comparison |

Step texts are instructions to the person drawing, one or two sentences, *what* and *why*. Plain
text (no TeX): write `V_1`, `P'`, `30°`, `φ`. The practice board asks the learner to reproduce the
points, lines, circles, arcs and curves drawn in `straightedge`, `tee`, `square`, `compass`,
`dividers`, `ruler`, `protractor`, `pencil` and `thread` steps, in order; shapes with `cls:'aux'` or
`cls:'axis'` are not checked. Put the real construction in those steps and the decoration (angle
marks, hatching, comparison curves) in `note` steps or with `cls:'aux'`.

**The kit (`k`).** Points are `{x, y}`; `k.pt(x, y)` makes one without drawing it.

| call | draws |
|---|---|
| `k.point(P, 'P', 'ne')` | a dot and its label at the compass direction n ne e se s sw w nw; options as a third object `{at, open:true, r, dist, lo:{upright:true, size:0.8}}` |
| `k.P(x, y, 'P', 'ne')`, `k.dot(P, {open:true})` | make-and-draw; a dot without a label |
| `k.label(P, 'text', 'ne', {dist, size, upright:true, fill})` | a label beside a point; `P_1`, `V^2`, `\bar{A}` give sub/superscripts and an overbar (a sub/superscript of more than one character needs braces: `V_{up}`); Greek letters typed as they are |
| `k.text(x, y, 'text', {anchor:'middle', size, upright:true, rotate:30, bg:true})` | text at a place (`bg` gives a white halo over lines) |
| `k.seg(A, B, o)`, `k.line(A, B, o)`, `k.ray(A, B, o)`, `k.arrow(A, B)` | a segment; the whole line cut by the frame; a half line; a segment with a head |
| `k.poly([A, B, C], {close:true, fill:'#fff'})`, `k.rect(x0, y0, x1, y1, o)` | a polyline or polygon (a filled one hides what is behind) |
| `k.circle(C, r, {hatch:'out', arrow:angle, label:'a'})`, `k.arc(C, r, a0, a1, {cw:true, arrow:true})`, `k.arc3(C, P, Q, o)`, `k.arcThrough(P, M, Q, o)` | circle; arc from angle a0 to a1 counter-clockwise (radians); arc about C from P to Q; the arc from P to Q through M (three points) |
| `k.ellipse(C, a, b, {rotate})`, `k.curve(f, [t0, t1], {n, arrow:t})`, `k.fn(f, [x0, x1])`, `k.polar(f, [θ0, θ1])`, `k.smooth(pts)` | curves; `f = t => [x, y]` (`null` for a gap); also an array of points |
| `k.axes(O, {x:[-120, 160], y:[-100, 140], xl:'x', yl:'y'})`, `k.grid(x0, y0, x1, y1, step)` | axes; graph paper (`cls:'aux'`) |
| `k.angle(V, A, B, {label:'θ', r, n, arrow, cw:true})` (the mark sweeps counter-clockwise from VA to VB; `cw` sweeps it clockwise, as a bearing), `k.right(V, A, B)`, `k.dim(A, B, 'a', {side:'right', dist, ticks:true})`, `k.dim(A, B, '40', {line:true, dist})` (a drawing-office dimension: extension lines, dimension line with arrowheads, the figure above), `k.hatch(pts, {angle, gap, fill, outline})`, `k.head(P, dir)`, `k.tick(P, dir)` | marks |
| `k.point(P, 'P', 'ne', {upright:true, size:0.8})` | the fourth argument is the label's options (the same as `lo` in the third) |
| `k.tick(P, dir)` | `dir` is the direction of the line the tick sits on; the tick is drawn across it (perpendicular) |

The board's targets are the points, lines, segments, rays, circles, arcs, curves and the edges of
polygons drawn in tool steps; `k.hatch`, labels and marks are never targets.
| `k.project(M, pts3, {scale:100, origin:{x, y}})` | 3-D points `[x, y, z]` through a 4 × 4 matrix (kit.proj) to paper points `{x, y}` |
| `k.wire(M, model, {scale, origin, hidden:'dash'\|'none'\|'show', cls})` | a wireframe model (`k.proj.models.cube(1)` …) under a projection, hidden edges dashed |
| `k.frame(x0, y0, x1, y1)`, `k.pad(0.1)`, `k.fontScale(1.1)` | fix the drawing area; the margin; the label size |

Options common to lines and curves: `cls` — `'given'` (black), `'cons'` (thinner, grey: construction
lines), `'aux'` (lighter, not checked), `'curve'`/`'result'` (heavier, blue), `'thick'` (the lined-in
result), `'red'`, `'green'`; `dash:true`, `dotted:true`, `width`, `stroke`, `fill`, `opacity`,
`nobounds:true` (do not stretch the frame).

**Geometry helpers (`k.g`)** — use them, never guess a point: `add sub mul dot cross len dist unit
perp rot(v, θ) rotAbout(P, C, θ) mid lerp(A, B, t) polar(C, r, θ) along(A, B, d) angleOf(v)
angle(A, V, B) dir(θ) lineLine(A, B, C, D) segSeg lineCircle(A, B, C, r) circleCircle(C1, r1, C2, r2)
foot(P, A, B) reflect(P, A, B) tangentPoints(P, C, r) circumcenter centroid parallelThrough(P, A, B)
perpThrough(P, A, B) inversion(P, C, k²) ellipseOfCircle(C, r, u, v) deg rad`. And `k.proj` is the
whole projection engine: `k.proj.mat4`, `k.proj.isometric()`, `k.proj.perspective(d)`,
`k.proj.vanishing(M, dir)`, `k.proj.maps.project(id, lon, lat, opts)`, `k.proj.geo.greatCircle(a, b)`
… so a construction of a map graticule or of a perspective can place every point exactly where the
formula puts it and then show the hand method that reaches the same point.

**Drawing like a drawing office.** Given data black, construction lines thin grey, the result heavy
(`'thick'` for lined-in edges, `'curve'` for a traced curve). Label every point the text names.
Hidden edges dashed. Where the hand method is an approximation (the four-centre ellipse), say so in
`note` and draw the true curve dashed with `cls:'aux'` in a `note` step. Pick units so the figure
spans about 300–600 units; the renderer scales it.

## Simulations

Everything in `HYPER-CORE/AUTHORING.md` applies (`kit.stage`, `kit.controls`, `kit.readout`,
`kit.loop`, `kit.drag`, theme colours only). The three reference sims show the three kinds of
picture this app draws:

- **An object under a projection** — `kit.proj`: `M4 = kit.proj.mat4`; `M = M4.mul(P.ortho(),
  P.axonometric(α, β))`; `pts = model.pts.map(p => M4.point(M, p))`; hidden lines with
  `P.edgesWithVisibility(M, model)`; `P.axonAxes(M)` for the foreshortening; `P.boxVanishing(M)`,
  `P.vanishingLine(M, [0, 1, 0])` for perspective; `P.perspective(d)`, `P.lookAt`, `P.perspectiveGL`;
  `P.fisheye(model, dir, f)`, `P.cylindricalPersp(dir, f)`, `P.equirectDir(dir)` for curvilinear
  pictures; models `P.models.cube box house lbracket stairs pyramid cylinder tetra grid`.
- **The globe and a map** — `kit.proj.maps`: `project(id, lon, lat, o)`, `invert`,
  `graticule(id, o, 30, 30)`, `path(id, line, o)` (a polyline of [lon, lat] broken where the map
  tears), `outline(id, o)`, `extent(id, o)`, `tissot(id, lon, lat, o, r)` + `ellipsePts(t)`, `list()`;
  options `{lon0, lat0, lat1, lat2, rotLat, rotGamma, P, A, B}`; coastlines `kit.world.lines()`,
  cities `kit.world.cities`, `kit.world.city('Tokyo')`; geodesy `kit.proj.geo.distance bearing
  greatCircle rhumbLine rhumbDistance rhumbBearing destination midpoint antipode`.
- **The sky** — `kit.sky`: `jd(date)`, `jdUT(y, m, d, h)`, `gmst`, `lst(jd, lon)`, `eqToHor(ra, dec,
  lst, lat)` → `{alt, az}`, `horToEq`, `eclToEq`, `eqToGal`, `sun(jd)`, `moon(jd)`, `planet(name, jd)`,
  `altAz(name, jd, lat, lon)`, `sunEvents(jd0, lat, lon)`, `sunPath`, `analemma`, `stars` (654, with
  `ra`, `dec`, `mag`, `name`, `con`), `constellations` (88, `lines` as pairs of star indices),
  `deepSky`, `eclipticLine(jd)`, `galacticEquator()`, `enu(alt, az)`, `cameraFrame(az, alt)`,
  `toCamera(frame, v)`. Angles in degrees, RA in degrees.

## Formulas

Matrices are not calculators; the formulas of a page are the scalar relations a reader would
compute: a foreshortening factor, the position of a vanishing point ($x_v = d\,\cot\theta$), the
Mercator ordinate, the scale factor at a latitude, the altitude of a star. Angles get `q: 'angle',
unit: '°'` with `min`/`max`; lengths `q: 'length'`; pure ratios no `q`. Three or four per page where
they teach; none where the page is history or practice.

## Tone

Explain as to an intelligent friend who draws: the idea, then the numbers, then the hand. Where a
projection has a story (Brunelleschi's mirror, Mercator's secret, Ptolemy's two methods, the
astrolabe's brass), tell it in `history`, briefly and accurately. No quotations longer than a few
words; everything in your own words.
