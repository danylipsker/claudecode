# Linear Half Toner

Turns a picture into a **line halftone** where line width carries the tone, then converts
that width into **cut depth** through V-bit geometry — so the result can be carved on a
3-axis CNC router rather than only printed.

Open `LinearHalfToner.html`. No build step, no server, no dependencies. Every image stays in the
browser; nothing is uploaded anywhere.

```
Linear Half Tone/
├── LinearHalfToner.html   the whole app — markup, styles, engine and UI in one file
├── README.md              this file
└── sessions/              working-session summaries
```

---

## Why width means depth

A V-bit cuts a groove whose width depends only on how deep it goes. For an included
angle `A` at depth `d`:

```
w = 2 · d · tan(A / 2)          →    d = w / (2 · tan(A / 2))
```

A tapered engraving bit has a small flat tip of diameter `T`, so its narrowest possible
groove is `T` wide:

```
w = T + 2 · d · tan(A / 2)      →    d = (w − T) / (2 · tan(A / 2))
```

The app works backwards from the picture: dark pixels become wide lines, wide lines
become deep cuts. That single relationship is what makes a halftone millable.

### Depth needed for a 1 mm wide line

| Included angle | Depth for 1 mm width | Widest line at 2 mm depth |
| -------------- | -------------------- | ------------------------- |
| 30°            | 1.866 mm             | 1.072 mm                  |
| 45°            | 1.207 mm             | 1.657 mm                  |
| 60°            | 0.866 mm             | 2.309 mm                  |
| 90°            | 0.500 mm             | 4.000 mm                  |
| 120°           | 0.289 mm             | 6.928 mm                  |

Narrow angles give finer detail but need far more depth for the same width. The usable
maximum width is capped by **both** limits at once:

```
max width = min( cutter diameter , 2 · max depth · tan(A / 2) )
```

---

## Workflow

### 1 · Source

Raster (PNG, JPG, WebP, BMP, GIF) or vector (SVG). SVGs are rasterised at a resolution
you choose; files with no `width`/`height` are sized from their `viewBox`. Drag-and-drop
and clipboard paste both work.

Set the physical size of the finished carving here. Every dimension in the app is real
millimetres (or inches) on the material.

Geometry generation runs in a **Web Worker**, so the interface stays responsive. A point
budget guards the preview; raise it or switch it off entirely for full detail. If workers
are unavailable the app falls back to the main thread automatically.

### 2 · Correct

Fix the artwork **before** it becomes a halftone — anything not resolved here is thrown
away by the halftoning.

- Crop with draggable handles, free rotate, 90° steps, flips
- Greyscale conversion: luminance (Rec.709 / Rec.601), average, lightness, max, min, or a
  single R/G/B channel
- Input and output levels with a live histogram, plus auto-levels
- **Tone curve** — a draggable monotone spline drawn over the histogram. Click to add a
  point, right-click or double-click to remove one. Linear / S-curve / film presets.
- Exposure, brightness, contrast, gamma, posterise
- Median denoise, blur, unsharp mask
- **Mask painting** — paint regions to *protect* (never cut), *reduce* or *boost*.
  `[` and `]` size the brush, `Alt` erases.

### 3 · Pattern

Each of up to three tools carries its own pattern, angle and pitch.

| Pattern            | Notes                                                          |
| ------------------ | -------------------------------------------------------------- |
| Parallel lines     | The classic linear halftone                                     |
| Cross hatch        | 1–4 layered angles, each taking over as the image darkens        |
| Wavy lines         | Sine wiggle that hides the line grid in flat areas               |
| Concentric circles | Rings around a centre point                                      |
| Spiral             | One continuous unbroken toolpath                                 |
| Radial rays        | Straight lines fanning from a centre point                       |
| Contour lines      | Marching-squares iso-tone contours, like a topographic map       |
| Dot screen         | Floyd–Steinberg error diffusion; each dot is a single plunge     |
| Stipple / TSP      | Lloyd-relaxed stipple joined into one travelling-salesman tour   |

Tone is encoded as line **width** (the V-carve mode), wiggle **amplitude**, **both**, or
**dash** density. Only width modulation turns into depth.

**Tonal bands and regions.** Each tool takes its own slice of the tonal range, so a wide
roughing V-bit can handle the darks while a fine bit picks up detail. Each tool can also
be restricted to *inside* or *outside* the painted mask — that is how you get a different
pitch, angle or pattern per region. A tool scoped that way uses the mask purely to select
its region, so the protect/reduce/boost mode does not also apply to it.

**Optimisation.**

- *Simplify tolerance* — Douglas–Peucker over position **and** width together. On the
  built-in test image this collapses 27,659 points to 4,644 (83% fewer) with the cut
  length unchanged to four significant figures.
- *Optimise travel order* — greedy nearest-neighbour over segment endpoints with a spatial
  grid, entering each path at whichever end is nearer. Cuts air time by about 20% on the
  test image (398 s → 318 s).

### 4 · Tool

Cutter type (V-bit or tapered engraver), included angle, diameter, flat tip, maximum
depth, plus per-tool feeds and spindle speed. A **tool library** holds common bits and is
kept in browser storage; where storage is unavailable it falls back to the built-in
defaults without complaint.

**Work origin** — X zero at left/centre/right, Y zero at bottom/centre/top, and Z zero at
either the material top or the machine bed (with a stock-thickness field). An optional
**air pass** traces the bounding box at safe Z and pauses, so you can confirm placement
before anything is cut.

**Machine motion** feeds the run-time estimate: acceleration, junction deviation and the
controller block-rate ceiling. The estimate runs a trapezoidal profile using the GRBL
junction-velocity model with forward and backward passes, then reports whether feed rate
or block rate is the limiting factor. On a controller managing only 20 blocks/s the
unsimplified path takes 1489 s and the simplified one 692 s — the same cut, less than half
the time.

### 5 · Export

Views for checking the work: Original, Corrected, Mask, Halftone, Depth, and **Carve** — a
shaded relief rasterised from the actual cut depths, with adjustable light direction and
material colour, so merged lines and over-deep areas show up before you cut.

---

## Export formats

### SVG — the recommended route

Closed variable-width outlines, written so **1 user unit = 1 mm** with a matching
`width="…mm"`. Each tool goes to its own labelled group.

Import into VCarve, Aspire, Carveco or Fusion and apply a **V-carve / engrave** toolpath.
The CAM works out depth from the shape width by itself — exactly how V-carved text is
handled — which means the depth model is the CAM's, not this app's.

### DXF

- **R12 `POLYLINE`** — safest for older CAM
- **R2000 `LWPOLYLINE`** — lighter files, true lightweight polylines

Content can be closed outlines, centre lines carrying per-vertex start/end width (group
codes 40/41), or plain zero-width centre lines. Each tool gets its own layer. DXF is Y-up,
so Y is mirrored on export.

### G-code

Dialects for **GRBL**, **Mach3/Mach4**, **LinuxCNC** and **Marlin**, differing in program
end (`M30` vs `M2`), `%` wrapping, comment character, `G17` and tool-change syntax.

- **Arc fitting** — optional `G2`/`G3` output. Arcs are fitted only where the depth also
  varies linearly across the span, so the helical interpolation stays true to the tone. On
  a concentric pattern this cut the program from 10,451 to 6,546 lines.
- **Laser mode** — holds Z constant and drives the `S` word from line width instead, using
  `M4` dynamic power where the dialect supports it.
- **Tiling** — splits work larger than the bed into tiles with a configurable overlap,
  rebases each tile's coordinates to its own corner, and cuts shallow registration crosses
  in the overlap for aligning by eye.
- **Per-tool files** — each tool written as its own program with its own feeds and RPM.
- Multi-pass step-down, nearest-end path entry, mm (`G21`) or inch (`G20`).

**Assumptions:** 3-axis, no tool length compensation. Z zero is wherever you set it on the
Tool step.

> **Dry-run above the workpiece before you cut.** The G-code path skips CAM entirely, so
> nothing else is checking the numbers.

### Images

Corrected PNG, halftone preview PNG, and carve simulation PNG.

---

## Settings that matter most

- **Line pitch** — sets tonal resolution *and* cutting time more than anything else.
- **Maximum width vs pitch** — keep max width at or below the pitch, or neighbouring lines
  merge into solid pockets. The app warns when you cross it.
- **Cut threshold** — lines thinner than this are dropped, giving clean white highlights.
- **Tone curve** — bends the tone-to-width relationship. Below 1 widens the mid-tones.
- **Simplify tolerance** — the single biggest lever on file size and block count.

---

## Keyboard

| Key                             | Action                             |
| ------------------------------- | ---------------------------------- |
| `1`–`5`                         | Jump to a step                     |
| `O`                             | Open a file                        |
| `E`                             | Go to export                       |
| `F`                             | Fit to window                      |
| `V`                             | Cycle view mode                    |
| `B`                             | Hold to compare against snapshot B |
| `Ctrl`+`S`                      | Save project                       |
| `Ctrl`+`Z` / `Ctrl`+`Shift`+`Z` | Undo / redo                        |
| `[` `]`                         | Brush size                         |
| `Alt`+drag                      | Erase mask                         |
| `Space`+drag, middle-drag       | Pan                                |
| Wheel                           | Zoom at cursor                     |
| `Ctrl`+`V`                      | Paste an image                     |

**Save result** in the top bar writes a `.lhtproj.json` **project** — the picture, the
painted mask and all 159 settings together — so you can stop mid-job and pick up exactly
where you left off. Vector sources are kept as SVG rather than rasterised, so a restored
project can still be re-rasterised at any resolution. Drop the file back on the window to
restore it.

**Save preset** in the sidebar writes settings only (`.lht.json`), for reusing a look
across different pictures. `Load` accepts either kind.

Undo history holds 60 steps and shares mask snapshots between entries so memory stays
bounded.

---

## Implementation notes

Plain ES2020 and Canvas 2D — no framework, no libraries. The geometry engine is a DOM-free
block evaluated into both the main thread and a blob-URL Web Worker from the same source,
so there is one implementation rather than two.

Corrections run on a Float32 tone buffer capped at 1500 px on the long side; blur is three
box passes, denoise is an iterated 3×3 median, and the tone curve is a Fritsch–Carlson
monotone spline baked to a 256-entry LUT. Halftone geometry is generated in millimetres
and sampled bilinearly from that buffer, so output resolution is independent of image
resolution.
