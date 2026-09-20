# Unique Gears — conjugate shape workbench

Pick any shape, and this works out the gear that meshes with it.

Open `index.html`. Everything runs in the page — no build step, no network, no
dependencies. From the repository root you can also serve it:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/UNIQUE-GEARS-GENERATOR/>.

## The three tabs

**Workbench** — choose a shape for gear 1 (circle, ellipse about its focus or
its centre, rounded square, regular polygon, Reuleaux triangle, lobed flower,
egg, snail cam, star, a real involute gear, your own `r(t)` formula, or a
freehand sketch), say how many lobes its mate should have, and the app returns
the mate, the centre distance that makes the pair close, both pitch curves, the
path of contact and a running check of the law of gearing. **Roll** mode treats
the outline as the pitch curve; **Mesh** mode puts teeth on it and generates the
true conjugate profile, teeth and all.

**Learn** — ten chapters, each with a live figure computed by the same engine:
the problem, rolling, closure, the pitch point, envelopes, the construction,
sliding, teeth, failure modes, and why the involute won.

**Labs** — the envelope condition as an actual pair of partial derivatives;
rack generation and where undercut comes from; and the inverse problem, where
you draw the gear ratio you want and get the pitch curves that deliver it.

## Getting the shapes out

Everything leaves the app in **millimetres**; the dialog's *1 unit = N mm* box
sets the scale, and the summary panel shows the real diameters before you commit.

| Format | What you get |
|---|---|
| **SVG** | Flat outlines, one path per curve, sized in mm. |
| **DXF** | R2000, `$INSUNITS` = mm, each curve on its own named layer, closed `LWPOLYLINE`s and a true `CIRCLE` for the bore. |
| **STEP** | AP214 solids, extruded to the thickness you set, with an optional bore. |
| **SOLIDWORKS** | A PowerShell script that saves real `.sldprt` parts and a `.sldasm` assembly. |
| **JSON / PNG** | Every number, and a snapshot of the canvas. |

### The STEP solids

Each body is **three faces** — two planar caps and one `SURFACE_OF_LINEAR_EXTRUSION`
over a single closed `B_SPLINE_CURVE_WITH_KNOTS` — or four with a bore. Writing a
planar face per profile segment would mean thousands of faces and megabytes; this
way a 360-point two-gear pair is about 140 kB and the walls are real curved
geometry you can select, fillet and offset.

The wall curve is a uniform cubic B-spline **interpolating** the profile points
(the control points come from a cyclic tridiagonal solve, so the curve passes
through every sample rather than being smoothed toward them). Untick *Smooth wall*
to get degree 1 instead, which is the exact polygon.

### A faceted wall is the default, on purpose

The wall can be written two ways, and the choice is not cosmetic:

* **Polyline (default).** The wall curve is degree 1, so the solid is the exact
  prism over the sampled polygon. At the default 480 points the chord error on a
  130 mm gear is about **2 microns** — below any machining tolerance.
* **Curved.** Degree 3, interpolating the same points, so the wall is genuinely
  smooth and CAD can select and fillet it as one face.

Measured against SOLIDWORKS 2020: a **curved** wall on a toothed gear arrives as
loose *surfaces* that will not knit into a solid at 180 or 360 points, and knits
at 720 — the interpolating cubic overshoots in the sharp tooth roots. A polyline
wall knitted at every count tried (360, 480, 512, 720). So the dialog defaults to
polyline, and ticking *curved* raises the point count to 720.

### Why SOLIDWORKS needs a script

`.sldprt` and `.sldasm` are **proprietary binary formats** (OLE structured storage,
no published specification). Nothing but SOLIDWORKS can write them, so no web page
can either. Instead the app writes a self-contained PowerShell script with both
STEP bodies embedded in it. Run it and it starts SOLIDWORKS, imports each body,
saves a part, and builds an assembly with the two parts a centre distance apart,
already in mesh.

The COM details follow what the sibling **GEARS GENERATOR** project measured
against live SOLIDWORKS on this machine, rather than what the documentation
implies:

* SOLIDWORKS automation is **STA**. Windows PowerShell already is; PowerShell 7
  is not, so the script re-launches itself with `-STA`.
* Late binding — all PowerShell can do — fails on `IModelDocExtension::SaveAs`'s
  `ExportData` argument, so the script prefers `SaveAs4`/`SaveAs3`/`SaveAs2`,
  which have no such parameter, and falls through the list until a file
  actually appears on disk.
* Importing a STEP with **3D Interconnect on** creates a *linked* feature and
  pops a document-template dialog; off, the classic translator brings in a
  native body. That toggle, the default-templates toggle and
  "import multiple bodies as parts" are all set for the import and put back
  afterwards.

Three more things the live run turned up, none of them in the documentation:

* `LoadFile4` **returns before the translator has built the body**. Saving
  straight away writes an empty part, so the script waits for a body to appear.
* `GetBodies2` must be asked for **all** bodies, not visible ones: immediately
  after an import the body exists but is not yet flagged visible.
* `AddComponent5` positions a component by its **bounding-box centre**, which
  drops it by half its thickness and misses the centre distance by microns. The
  component transforms are therefore set outright afterwards.

The two components are placed and fixed at the correct centre distance. No mates
are added — selecting faces for mates by automation is fragile, and a fixed
layout is what you want to build from anyway.

## How it works

Two stages, and the second depends on the first.

**1. Rolling.** Treat gear 1's outline as a *centrode*: a curve that rolls on
its mate without slipping. Rolling contact happens on the line of centres, and
the contact-point speeds match, so `ω₁r₁ = ω₂r₂` with `r₁ + r₂ = a`. That gives
the differential equation that generates everything else:

```
dφ₂/dφ₁ = r₁(φ₁) / (a − r₁(φ₁))
```

Integrating it over one turn of gear 1 gives gear 2's total rotation `Θ(a)`. The
mate only closes up when `Θ` is a whole number of turns, so the centre distance
is *determined* by the ratio, not chosen — and since `Θ` decreases monotonically
in `a`, a bisection finds it exactly. If gear 1 has *n*-fold symmetry the only
ratios that can close are `n/m`, and the mate comes out *m*-fold symmetric.

**2. The envelope.** Seen from gear 2, gear 1 traces a family of positions. Gear
2 is everything gear 1 never reaches, so it is the envelope of that family —
formally where `∂q/∂s × ∂q/∂φ₁ = 0`. Rather than solve that symbolically, the
app sweeps gear 1 through a full cycle and keeps, for each direction out of gear
2's axle, the nearest gear-1 boundary it ever saw. That pointwise minimum *is*
the envelope, and it is also exactly what a gear shaper does to a blank, so
undercut, clearance and interference fall out of the arithmetic instead of
needing special cases.

Teeth are an offset of the pitch curve along its own normal, spaced evenly in
**arc length** so they stay the same size around a non-circular gear. Gear 2's
teeth are never designed — they emerge from the sweep, already the right shape
and the right count (`Z₂ = Z₁ / ratio`, which has to be a whole number).

Because the envelope leaves no root clearance, the sweep uses a **cutter**: gear
1 with its tips extended by the clearance, ramped in from the pitch line so the
working flanks are untouched. That is the same trick a real hob uses, and it is
why the *Clearance* slider exists.

## Checks it passes

These are the numbers the app produces, not claims about it:

| Case | Expected | Reported |
|---|---|---|
| 12 × 18 involute pair, 20° | ratio 2:3, contact ratio ≈ 1.5, pressure angle 20° | 0.666667, 1.54, median 19.9° |
| Involute path of contact | a straight line through the pitch point | straight, at 20° to the pitch tangent |
| Rack-cut gear, z = 8 / 12 / 24 | undercut below `2(1−x)/sin²α` = 17.1 | 14.7% / 5.3% / none |
| z = 12 with profile shift x = 0.5 | limit drops to 8.5, undercut cured | clean |
| Rolling centrodes | zero sliding at contact | 0.000 |
| Law of gearing on a conjugate mate | normal through the pitch point | ~2–5 × 10⁻³ × a (grid-limited) |
| STEP solids, 7 pairs read back by OpenCascade | one valid watertight solid per gear | valid, watertight, 3–4 faces |
| …their volume | profile area × thickness | within 0.05% |
| DXF read back by ezdxf | mm units, named layers, closed polylines | as written, gear 2 exactly at the centre distance |
| Generated PowerShell | parses, and the embedded STEP survives the here-string | clean parse; payloads extract byte-intact |
| The script run against SOLIDWORKS 2020 | two `.sldprt` and one `.sldasm` | exit 0; one solid body each, named from the STEP |
| those parts, measured by SOLIDWORKS | the volume OpenCascade read from the same STEP | 190,247.9 vs 190,252 mm³ (0.002%) |
| their thickness | exactly as exported | 10.00 mm |
| the assembly | two components, both fixed, a centre distance apart | 0.000 and 111.116 mm, both fixed |

The law-of-gearing residual is limited by the angular sample grid, not by the
construction; it falls as the sample count rises.

## Files

| File | What it holds |
|---|---|
| `js/core.js` | Polar-curve primitives, ray casting, the shape library, the guarded formula compiler |
| `js/gears.js` | Involute profiles, the rolling law, closure solving, teeth, the conjugate sweep, contact detection |
| `js/view.js` | 2D camera, drawing primitives, the small line plot |
| `js/studio.js` | The workbench: model assembly, rendering, overlays, controls |
| `js/learn.js` | The figure framework and the ten chapters |
| `js/lab.js` | The three sandboxes |
| `js/step.js` | The AP214 STEP writer: cubic interpolation, de Boor, the three-face prism |
| `js/swscript.js` | The SOLIDWORKS PowerShell generator |
| `js/export.js` | The export dialog, SVG, DXF, JSON, PNG |

Every closed curve in the app is the same thing: an array of radii sampled at
equal angles about the rotation centre. That is what makes the conjugate sweep
cheap, and it is also the physical requirement for a shape to work as a gear
body — a shape that is not star-shaped about its own axle has an overhang it
can never present to a mate.

## Checking the exports yourself

`tools/` holds the harness used above. It runs the app's own engine under Node
and reads the results back with a real CAD kernel:

```bash
node tools/make-pair-step.js     # real conjugate pairs -> STEP, DXF, SVG, PS1
python tools/check-step.py tools/out-pairs
```

To take it all the way, run the `pair.ps1` that lands in the same folder: it
reports a body count per part and fails loudly rather than saving an empty one.

`check-step.py` takes volume from a **triangulation**, not from `BRepGProp`'s
analytic integrator: on a surface of linear extrusion over a several-hundred-knot
spline that integrator is wildly unreliable (measured: 8465 and 16408 for the
same body whose true volume is 10125). The mesh route also proves the shell is
closed and outward-facing, which is what a CAD import actually cares about.

## Credit

The approach follows the one popularised by **Morphocular** in
[“What Gear Shape Meshes With a Square?”](https://www.youtube.com/watch?v=eG-z-791_ak)
(April 2024): rolling centrodes first, then conjugate profiles as an envelope.
The underlying theory is classical — Euler on the involute, and Willis' law of
gearing from 1841. The code, the figures and the wording here are this app's own.
