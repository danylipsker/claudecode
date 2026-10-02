# Hyper Projections

How the three-dimensional world is drawn on a flat sheet — the fifteenth Hyper app, on the same engine
as the others (`../HYPER-CORE`). The orthographic, axonometric and oblique views of the drawing office;
linear perspective with one, two and three vanishing points; the curvilinear perspectives with four,
five and six, the fisheye and panoramic mappings; some forty map projections of the globe from Ptolemy
and Mercator to Robinson and Equal Earth, with the polyhedral nets and the history of mapping; and the
projections that chart the sky — coordinates, planisphere, astrolabe, star charts, sun-path diagrams,
sundials, the planetarium dome. A last branch collects the uses: drawing offices, architecture,
photography, cinema, street art, the graphics pipeline, game cameras, photogrammetry, navigation,
aviation, GPS, radar, X-rays and CT, planetary maps, crystallography, weather maps.

Every concept page gives the **matrix or formula** (written out in TeX with the convention y up,
viewer along −z), a **hand construction** — the drawing made step by step with named tools (T-square,
set square, straightedge, compass, dividers, scale, protractor, pencil, fold, thread), played with an
animated stroke per step, printable as a worksheet, and practised on a **board** that snaps to
intersections and checks every stroke — a **simulation**, formula calculators that solve for any
variable, worked examples, a quiz, where the projection is used and why, its history and sources.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-PROJECTIONS/>. No installation, no network.

## What is in it

**205 concepts** in 7 branches and 25 topics, with **600 formula calculators**, **154 simulations**
(used 204 times), **234 hand constructions** (used 237 times), **1004 quiz questions** and **362 worked
examples** — all original text.

| Branch | Concepts | Topics |
|---|---:|---|
| Projection: The Idea | 24 | what a projection is · the mathematics (homogeneous coordinates, the 4 × 4 matrix, the camera, points at infinity, the cross-ratio) · descriptive geometry (Monge, true lengths, auxiliary views, developments, shadows) |
| Parallel Projections | 23 | multiview drawing (first and third angle, sections, conventions) · axonometric (isometric, dimetric, trimetric, the four-centre circle, Pohlke) · oblique (cavalier, cabinet, planometric, East Asian parallel perspective, isometric games) |
| Linear Perspective | 31 | the elements · one, two and three points · constructions and effects (plan-and-elevation, Alberti's floor, measuring points, shadows, reflections, anamorphosis, forced and reverse perspective) · how perspective was found (Brunelleschi, Alberti, Dürer, the camera obscura) |
| Curvilinear and Spherical Perspective | 18 | four, five and six points, panoramas, Barre–Flocon, Escher · lenses, spheres and domes (fisheye laws, equirectangular, cube maps, dome masters, mirror anamorphosis, little planets) |
| Mapping the Sphere | 56 | what a map can keep (Tissot, conformal, equal-area, equidistant, aspects, great circles and rhumb lines) · azimuthal · cylindrical · conic · pseudocylindrical and compromise · polyhedral maps and the history of mapping |
| The Sky | 25 | the celestial sphere and its coordinates · sky maps and instruments (planisphere, astrolabe, star charts, sun-path diagrams, analemma, sundials, armillary, planetarium) · charting the sky through history |
| Projections at Work | 28 | drawing and building · art and photography · computing and vision · navigation, science and medicine |

### The labs (Tools)

- **Projection lab** — the picture and its projectors in space for every parallel and central projection
  (drag to turn and tilt; the matrix underneath), the six views on a sheet in first and third angle with
  the projection symbol, and a matrix workbench that multiplies a stack of transformations.
- **Perspective lab** — one-, two- and three-point perspective with live vanishing points and the horizon
  (presets for bird's-eye and worm's-eye), curvilinear pictures (4-, 5-, 6-point, cylindrical, fisheye laws,
  equirectangular) with the six axis directions marked, and the plan-and-elevation construction step by step.
- **Map lab** — about 45 projections with graticule, coastlines, Tissot's indicatrices, great circle and
  rhumb line between two cities with their lengths, the aspect controls (transverse, oblique, standard
  parallels, the satellite's height), the scale factors under the pointer, and the globe beside the map;
  a gallery of every projection.
- **Sky lab** — the sky from any place and time (654 stars, the 88 constellation figures, the Sun, Moon
  and planets, the ecliptic, equator and Milky Way) as a camera view, an all-sky fisheye, a stereographic
  map, a planisphere and an all-sky chart, with rise, set and noon; the sun-path diagram (stereographic,
  equidistant or cylindrical) with hour lines and the analemma.
- **Constructions** — the gallery of every hand construction, filterable by tool and branch.

### Files

```
content/outline.js             branches, topics, planned concepts
content/<topic>.js             the concepts of one topic (25 files + reference.js)
sims/<topic>.js                the simulations (kit.proj, kit.sky, kit.world)
constructions/<topic>.js       the hand constructions (the kit in HYPER-CORE/js/construct.js)
catalog.js                     generated titles for the sibling apps
AUTHORING.md                   how a page, a simulation and a construction are written
```

The engine modules behind this app are `HYPER-CORE/js/projection.js` (matrices, perspective, curvilinear
mappings, the sphere, the map projections and their distortion), `celestial.js` (time, sky coordinates,
Sun, Moon, planets, stars), `geodata.js` (coastlines and cities) and `construct.js` (the construction kit),
with `ui/construct.js` (the step player, the practice board, the gallery) and `ui/projtools.js` (the labs).
Tests: `node HYPER-CORE/tools/test-projection.js`, `node HYPER-CORE/tools/test-celestial.js`,
`node HYPER-CORE/tools/validate.js HYPER-PROJECTIONS --final`, `node HYPER-CORE/tools/simtest.js HYPER-PROJECTIONS`.

> The coastlines are a coarse hand-drawn outline of the continents (good enough to recognise the world
> under a projection, not to navigate by); star positions are rounded to about 0.1° and the Sun, Moon and
> planets come from simple orbital models good to a fraction of a degree. Times in the sky lab are the
> place's standard time, without summer time.
