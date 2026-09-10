# GEARS GENERATOR — status: v1 complete + helical/bevel/worm/rack/internal gears + real 3D viewer

## Helical flank was 359 µm off the true helicoid between loft sections; now an exact sweep (latest)

User's note: "helical gears are a smooth transient." Taken as: the twist along
the face width should be one continuous sweep, and it read as banded. Started
by measuring whether the banding was cosmetic (shading) or geometric — it was
both, and the geometric part was the real finding:

- **The build was wrong between sections, not just band-shaded.** The helical
  solid was a `ruled=True` loft through ~1 rotated copy of the profile per 3°
  of twist — a routine 25°/16 mm gear got only 6 copies. Sectioning the built
  solid at 25/50/75% of the face and measuring against the profile rotated by
  exactly `twist·z/b`: **359 µm (14% of module) at mid-facet**, and **1.3 mm
  (53% of module)** on a 35°/40 mm gear — versus exactly 0 µm at every section
  plane. That zero is precisely why the original verification (twist measured
  at the two end faces) passed: it only ever looked at section planes. The
  error grew linearly with per-copy rotation, not quadratically like a chord's
  sagitta (which would have been ~8 µm): the loft wasn't pairing profile
  points one-to-one between rotated copies but re-aligning wires, shearing the
  surface between them. docs/gear-math.md §7.3 had explained the loft as
  "straight patches converge to the true flank" — a sound-sounding argument
  that measurement contradicted; rewritten to say so, with the numbers.
- **A smooth (`ruled=False`) loft is not the fix**, checked rather than
  assumed: 270 µm–3.4 mm by the same measure, plus a +1.4% to +2.0% *volume*
  overshoot at intermediate section counts (spline bulge), with only a narrow,
  fragile window of section counts that happened to fit.
- **The fix is OpenCASCADE's twist-extrude** (`Solid.extrude_linear_with_
  rotation`): **0.0 µm** on the routine gear and 0.1 µm on the steep one by
  the same check (a zero that also validates the check itself), ~10× faster
  to build (0.14 s vs 1.8–5 s), and one continuous face per profile edge
  (~290) instead of one flat strip per edge per copy (1,700–5,200) — the
  helical STEP dropped to ~1.1 MB. Hand/sign convention unchanged: the sweep
  matched the existing rotation reference to 0 µm.
- **The measurement is now a regression test** (`test_helical_flank_is_the_
  true_helicoid_between_the_end_faces`): sub-10 µm at 25/50/75% of the face,
  both hands, including the steep/wide case — the check the end-face twist
  test structurally could not make. 45 tests pass.
- **The visible smoothness is a preview-tessellation setting, now that the
  surface is genuinely curved**: the viewer flat-shades each triangle, and at
  the 0.02 mm tolerance used elsewhere the exact surface tessellates
  economically to ~1.4k triangles — each in tolerance, but the normal jumps
  read as bands. Swept a tolerance grid: 0.002 mm gives ~4–9k triangles in
  ~0.05 s; angular tolerance had no effect at all. Helical previews (and the
  worm's preview wheel, which is a helical gear) now tessellate at 0.002 mm;
  spur keeps 0.02. Before/after crops through the real app: facet patchwork
  with jagged banding → continuous shading gradients along the twist.
- Verified beyond the tests: the swept helical STEP imports into real
  SolidWorks as a single body (its curved swept faces were new to that path);
  spur, worm+wheel previews unaffected; mosaic thumbnails regenerated (the
  helical card depicted the old loft, the worm card predated its fuse).
- **Flagged, not yet done**: the worm thread (~9° per loft station) and the
  bevel tooth's two-station loft rely on the same loft operation. Bevel's
  two-station ruling is exact by proof, but the point-pairing hazard is a
  property of the loft, so both should get the same section-plane
  measurement before it's assumed absent.

## Worm's live preview now shows the matching wheel too, like every real worm-gear reference drawing

User reported the worm still didn't "look like" reference illustrations of a
worm gear (attached several -- all show the worm and its wheel together,
meshing, never the worm alone). Verified first rather than assuming a
plausible-sounding fix would be needed: the *underlying worm geometry itself*
(profile, fillet, fused solid) had already been fixed and re-verified this
session; what every reference image has that the app didn't was the **wheel**,
shown at all. `wheel_gear_params()` already computes the exact matching wheel
(reused for the existing "Matching Wheel" hint text) and `mate_teeth` was
already flowing through every worm request (for the center-distance hint) --
so the live 3D preview now builds that wheel too, positions it at the real
geometric mesh point, and shows it alongside the worm, purely in
`server.py`'s `export_mesh` handler. No C# wiring needed for the data path
(mate_teeth was already there); STEP/DXF export is untouched -- still the
worm alone, per the existing "build the wheel separately via the Helical
card" convention -- so nothing about what gets manufactured/exported changed,
only what the live preview shows.

- **Positioning is real, not schematic**: the wheel's own axis (rotated 90°
  from the worm's) is placed exactly `pitch_radius(worm) + pitch_radius(wheel)`
  from the worm's axis -- true pitch-circle tangency, the actual definition
  of "just meshing," not an eyeballed offset.
- **A real bug caught before it shipped, not after**: the wheel's own
  extrusion isn't centered on its sketch plane (confirmed by checking the
  built solid's bounding box directly: it spans local Z=[0, face_width], not
  [-face_width/2, +face_width/2]) -- naively rotating it 90° as-is put the
  wheel offset by a whole face-width to one side of the worm's own centerline
  instead of straddling it, which produced a confusing, non-meshing-looking
  render that's what actually surfaced this. Fixed by centering the wheel on
  its own axis before rotating.
- **The default camera needed its own nudge, same precedent as the rack
  card**: the shared default camera stares nearly straight down what became
  the wheel's own axis, which reads fine for a lone gear but buries a much
  smaller worm in front of a large flat-on wheel face. Iterated through
  several LookDirection values, checking the actual rendered screenshot each
  time rather than guessing once and moving on, until landing on one that
  reads as two clearly distinct, correctly-meshing parts.
- Verified: all 44 Python tests pass; `mate_teeth=0` still falls back to the
  worm alone (fewer triangles, checked directly, not just "no crash"); starts
  1/2/4 and both hands all build correctly; spur/bevel/rack/internal renders
  are pixel-identical to before (unaffected, since only worm's own code path
  changed); the worm's own STEP export still imports into real SolidWorks
  (both a warm session and a freshly-launched one).
- Separately, re-examined the rack's tooth/root-fillet shape against a
  reference illustration (a generic gear+rack icon) at the user's request --
  no changes needed. A flat 2D outline render and a composed gear+rack
  comparison (using the already-validated spur and rack outline code
  directly, no new geometry) both confirm the existing trapezoidal-tooth,
  filleted-root shape already matches the reference's general form; this
  was already established mathematically (§10, and the fillet fix earlier
  this session) rather than newly discovered here.

## Worm now a single fused solid (not a multi-body Compound); found and fixed a SolidWorks-import bug affecting 4 of 6 gear families along the way

User report: "in the worm gear generator, the fillets are the joints between
the central cylinder and the spiral tooth. those fillets are made wrong. the
fillet serves as merging geometry between the elements. just fix the fillets,
merge the elements into one solid file." Correct: `build_worm_solid` returned
an unfused `Compound` (core cylinder + one loft per thread, touching but never
topologically joined) — a real, deliberate tradeoff from earlier in the
project, made because sequential pairwise fusing (`core.fuse(t1).fuse(t2)...`)
genuinely hangs (10+ min) on spiral-vs-already-spiralled intersections.

- **The actual fix, found by testing the operation that was never actually
  tried**: a single N-ary fuse — `core.fuse(*threads)`, every thread passed to
  ONE call, not fused in sequentially — resolves all the intersections
  together and is fast (timed across starts=1..4 and two lengths: a few
  seconds, worst case ~11s for a 60mm-long worm). `build_worm_solid` now
  returns one true fused `Solid`; the thread genuinely merges into the shaft
  instead of sitting next to it. Bevel gears hit what looked like the
  identical problem and, checked directly rather than assumed, its own N-ary
  fuse really does fail differently there (empty/non-manifold results on real
  cases) — bevel's Compound stands on its own, this isn't a "the same fix
  applies everywhere" story.
- **Along the way, testing the fused worm's STEP export in real SolidWorks
  surfaced a separate, much bigger bug**: a bare `bd.Solid`/`Part` (spur,
  helical, rack, internal, and now the fused worm) exports via this OCCT
  version as an `ADVANCED_BREP_SHAPE_REPRESENTATION` STEP entity — valid
  STEP AP214, round-trips fine through build123d/OCCT itself — but
  SolidWorks' own translator rejects it outright with a generic "error code
  1". Reproduced for 4 of 6 families; bevel and the old worm were accidentally
  fine only because they already happened to export as Compounds. First fix
  attempt (`if not isinstance(shape, Compound): wrap it`) looked right and
  wasn't — build123d's own `BuildPart().part` result is ALREADY a Compound
  instance (and already `TopAbs_COMPOUND` at the raw OCCT level, confirmed via
  `.wrapped.ShapeType()`, not just the Python class) — so the check silently
  skipped the exact families that needed it. The actual fix: unconditionally
  extract every solid via `.solids()` and rebuild a fresh `Compound` from
  those raw `Solid` objects, regardless of what the input's own type claims —
  a Compound built with no `BuildPart` lineage exports via the plain
  `SHAPE_REPRESENTATION` entity SolidWorks accepts. Applied uniformly (one
  helper, `_export_step_for_solidworks`, used by all 5 `export_*_step`
  functions) rather than only to the families caught failing.
- **Verified against real SolidWorks, not just re-derived from source, for
  all 6 families**: spur, helical, bevel, rack, internal, and worm all now
  import successfully (previously: spur, rack, and internal failed; helical
  was untested but shares spur's code path). Confirmed the worm is genuinely
  one body, not just "SolidWorks didn't error": counted `MANIFOLD_SOLID_BREP`
  entities directly in the exported STEP — worm: 1 (was: core + one per
  thread start); bevel: 17 for z=16 (unaffected, still the intentional
  blank+z-teeth Compound). All 44 Python tests pass, including a rewritten
  worm test (previously asserted `1 + starts` bodies as the *correct*
  expectation — inverted to assert exactly 1 fused body, plus a volume-bound
  check that the fuse actually removed the core/thread overlap rather than
  either no-op'ing or double-counting it).

## Checked every other gear family for the same fillet bug class as rack; found and fixed it in worm too

Following up the rack fillet fix (below): checked whether spur/helical/bevel/
worm/internal share the same underlying construction, rather than assuming
"fixed one, done." They split cleanly into two groups:

- **Worm — same bug, fixed the same way.** `worm.py`'s `thread_axial_profile`
  is line-for-line the same tangent-circle fillet construction as rack.py's
  (rack.py's own docstring says as much: it's *the* template rack's fillet
  was adapted from). Same non-monotonic wobble, same fix: clamp u to
  non-increasing walking from the flank's tangent point to the root. Checked
  whether it was *visibly* causing anything first (rendered the actual solid
  at multiple angles, zoomed on the thread root) -- clean before and after,
  which makes sense: a worm thread doesn't have rack's "endmost tooth at a
  grazing camera angle" situation (the thread simply fades into the shaft at
  each end, not a repeated-and-then-abruptly-bounded element), so there was
  no camera-driven amplification to reveal it visually. Fixed anyway since
  it's a genuine, if cosmetically negligible, correctness issue independent
  of whether anything currently makes it visible.
- **Spur, helical, bevel, internal — different construction, not susceptible
  at all.** These don't use a tangent-circle polygon as the tooth boundary
  directly. They compute the fillet by literally simulating a rack cutter
  rolling across the gear blank (`rack_swept_cutter_union` in involute.py):
  the cutter tooth is swept through ~240 angular positions and the boolean
  union's envelope becomes the tooth boundary -- a genuine trochoid, not a
  single circular arc. The cutter's own static tooth shape (`rack_cutter_
  tooth_points`) has a similarly-constructed fillet arc and, in isolation,
  the same theoretical property -- but it's never used as a final boundary,
  only swept and enveloped, and that operation doesn't inherit the wobble
  (confirmed, not just reasoned: ran the same strict pairwise segment-
  crossing check used to root-cause the rack bug against an actual spur
  gear's full output polygon -- 12,756 boundary points, zero crossings).
  Bevel and internal both call `single_tooth_polygon` -- the same envelope
  machinery -- confirmed by checking their imports directly rather than
  trusting memory of "they reuse it." Left `rack_cutter_tooth_points` alone:
  changing validated, real-SolidWorks-tested code for a property that
  provably doesn't propagate to its actual output isn't a fix, it's just
  risk with no matching benefit.
- All five non-rack families rendered clean at multiple zoom levels through
  the actual WPF pipeline (not just re-derived from source) -- spur/helical/
  bevel/internal show smooth root fillets with no notch at any tooth; worm
  shows no artifact at either thread end. All 44 tests still pass.

## Rack fillet-to-backing render fixed: one real (tiny) geometry bug, one real camera bug

User report: "the rack solution teeth are awkward, the fillet that connects
the teeth to the ruler [backing bar] are drawn in a wrong way." The live 3D
preview showed a visible notch/kink right where each tooth's root fillet
meets the backing bar's flat top. Root-caused this properly rather than
guessing at a fix -- rebuilt the actual solid at the exact reported
parameters, tessellated it the same way the app does, and inspected the raw
STL triangles/edges directly (not just re-reading the source) at every
stage: 2D outline (shapely `is_valid`/`is_simple` AND a strict pairwise
segment-crossing check, not just the tolerant built-in ones -- zero
crossings), the flat cap face's triangulation (zero area overlap vs. the
polygon's true area), the full solid's mesh (zero non-manifold edges, zero
winding-direction inconsistencies -- every directed edge appears exactly
once). All clean. Systematically ruled out fillet radius, arc resolution,
tooth height, and specular material as causes by changing each one
independently through the *actual* rendering pipeline (not a proxy) and
finding the artifact unmoved by all of them -- until testing which specific
tooth showed it: only the rack's own two endmost teeth, never an interior
one. That pointed at the camera, not the geometry, and confirming it was
cheap: nudging the default camera's azimuth away from the grazing angle it
was taking relative to the rack's own length axis made the artifact vanish
at both ends, at any teeth count, with the underlying STL bytes unchanged.
Two real, if modest, fixes landed from this:
- **`rack.py`'s fillet had a genuine (tiny) non-monotonic wobble.**
  Independent of the render bug above: any circle tangent to the flank line
  and the horizontal root line necessarily sweeps through its own widest
  point before reaching the root whenever the pressure angle is nonzero --
  an inherent property of that construction, matching the standard
  ISO-basic-rack tangent-fillet definition exactly (verified against the
  textbook tangent-length formula for two lines meeting at a corner, not
  just against itself). The excess is a few percent of the fillet radius,
  invisible at any real design scale, but it makes the polygon boundary
  briefly non-monotonic. Clamped it to non-increasing as the arc walks from
  the flank down to the root -- harmless (both tangent points, and the
  fillet radius itself, are unaffected) and removes a real (if cosmetically
  negligible) imperfection regardless of the render issue. Did not, on its
  own, fix what the user saw -- confirmed by testing it in isolation.
- **The shared default 3D-viewer camera (`GearPanel.xaml`) looks along a
  diagonal that puts a *rack's* own end teeth at a genuine grazing/silhouette
  angle** -- fine for the other five families, which are all roughly
  axisymmetric and have no "own length axis" to be edge-on to. `OnRackChecked`
  (`GearPanel.xaml.cs`) now nudges the camera to a rack-specific angle via the
  same `ChangeCameraDirection` mechanism the toolbar's view buttons already
  use, rather than compromising the one shared default for every other
  family (tried that first -- fixed rack but visibly flattened bevel's view;
  reverted). Verified spur/bevel/worm/internal render pixel-identically to
  before (unaffected, since they never call `OnRackChecked`).
- Worth remembering for any future WPF 3D work: a mis-rendered silhouette
  detail that's unmoved by every *geometry* parameter but disappears when
  the *camera angle* changes is a camera/rasterization issue, not a geometry
  bug -- checking that (rendering the same, unchanged STL from several
  angles) is a fast, decisive test worth reaching for before re-deriving
  math that's already passing every independent correctness check.
- STEP/DXF exports were never affected by the render bug (they're built from
  the B-rep/2D polygon directly, not re-derived from the STL), confirmed by
  re-running `--exporttest` throughout. All 44 Python tests and rack.py's own
  5 self-tests still pass.

## C# UI wired for racks and internal gears

Closes the gap the previous pass left open (see "the C# side itself... is not
yet wired" below) — racks and internal gears now have the same UI depth as
every other family: mosaic card, family-specific parameter section, live 3D
solid preview, derived values, STEP/DXF export. No Python engine changes.

- `GearGen.Geometry`: `GearFamily` gained `Rack`/`Internal`; `GearParameters`
  gained `BackingHeightMm` (rack), `CutterTeeth`/`RimThicknessMm` (internal).
- `GearGen.PyEngine`: `BuildRequest()` grew `IsRack`/`IsInternal` branches
  (following the existing bevel/worm client-side-mm-conversion pattern, since
  neither Python dataclass has a separate inch constructor).
- `GearGen.UI`: `GearViewModel` grew `IsRack`/`IsInternal`/`IsNotInternal`
  (the last hides the bore spinner, since internal gears don't take a bore —
  they mount on the ring's own OD in practice) plus display properties for
  every new derived value. `GearPanel.xaml` grew two mosaic cards (both
  sharing the existing `GroupName="family"` group — confirmed *not* a repeat
  of the duplicate-GroupName StackOverflow bug from the bevel/worm phase,
  since every card in the mosaic has always shared one group), a RACK section
  (backing height), an INTERNAL section (rim thickness, construction cutter
  teeth with 0=auto, mating pinion teeth for center-distance info only — no
  separate "pinion mode", build the actual pinion with the Spur/Helical
  card), and two new derived-values blocks. Rack deliberately blanks the
  shared pitch/base/addendum/dedendum *diameter* fields to "-" rather than
  reusing them for tooth *height* (a rack has no radius to report, and a
  stale diameter from whatever family was selected before would mislead more
  than an honest "-"); it gets its own `AddendumHeightText`/
  `DedendumHeightText` instead. Internal gears round out the diameter grid
  with a `base_diameter_mm` that `internal_derived_values()` hadn't been
  exposing.
- `GearPanel.xaml.cs`: `OnRackChecked`/`OnInternalChecked`, matching the
  existing `OnWormChecked` one-liner pattern.
- `App.xaml.cs`: `--rack`/`--internal` flags added to the `--uismoke`
  dispatcher alongside the existing `--bevel`/`--worm`.
- Verified empirically, not just by a clean build: ran `--uismoke` with
  `--rack --exporttest` and `--internal --exporttest` and inspected the
  rendered PNGs. Rack renders as a straight toothed bar; internal (at a
  meaningful z=32, not the degenerate z=4 the smoke test's own teeth-clamp
  produces by default) renders as a proper ring with inward-pointing teeth,
  correct derived values (addendum diameter 60mm *inside* the 64mm pitch
  diameter, dedendum 69mm *outside* it — the inverted convention internal
  gears actually have), and the validity warning ("construction cutter tooth
  count should be smaller than the ring's own") correctly fires at z=4
  where the auto cutter-teeth count (8) would exceed the ring's own (4).
  Both STEP and DXF exports succeeded for both families. Re-ran the existing
  `--worm` smoke test as a regression check on the XAML region adjacent to
  the new insertion point — unaffected. All 44 Python tests still pass
  (`involute.py`/`rack.py`/`internal.py` untouched this pass).

## Racks and internal (ring) gears: added, validated end-to-end; spiral bevel documented as a plan only

Extends the Python geometry engine (`py/gear_step/`) with the two gear families
PROGRESS.md previously listed as "out of scope for now" that were most tractable
to actually finish, plus an honest writeup of the third (spiral/hypoid bevel —
see below) rather than a rushed, unvalidated attempt at it. Full technical
writeup: `docs/gear-math.md` §10 (racks), §11 (internal gears), §12 (spiral bevel
plan).

- **Racks** (`rack.py`) — the z→∞ limit of a spur gear: the involute flank
  degenerates to a straight line at exactly the pressure angle (proved via the
  involute's own radius-of-curvature formula, then cross-checked numerically
  against an independent 3-point circle fit on the actual gear code across
  z=20..1280, confirming genuine divergence). The tooth itself is a fresh
  straight-sided trapezoid (`rack_tooth_profile`), a direct adaptation of
  `worm.py`'s `thread_axial_profile` rather than a reuse of
  `rack_cutter_tooth_points` — confirmed by inspection that the latter is
  specifically a cutting-tool shape (its own "tip" reaches the *workpiece's*
  dedendum depth, not a standalone rack's own addendum), the same reasoning
  `worm.py` already used for the same fork. Full profile built as a shapely
  union of z tooth wedges plus a backing bar (mirroring `full_gear_polygon`'s
  own construction), not hand-stitched boundary points. 3D solid (extrusion +
  optional mounting holes through the backing bar) built and measured
  (`is_manifold`, single body, sane volume) across 4 parameter combinations.
- **Internal (ring) gears** (`internal.py`) — teeth cut inward into an annular
  ring, meshing with a pinion running inside it. Reuses `single_tooth_polygon`
  completely unchanged as the shaper-cutter tooth shape (same principle bevel
  gears already use it for their own non-integer-z tooth), but needed a
  genuinely new generating transform: a cutter's pitch circle rolling *inside*
  the ring's (both axes fixed, center distance = difference of radii, same
  rotation direction for both parts — a real, checkable fact about internal
  gearing, unlike any two external gears). Derived from the rolling-without-
  slip condition at the (here, spatially fixed) contact point, and validated
  the right way *before* building anything on top of it: checked that a
  cutter-material point at the contact location has zero velocity relative to
  the ring's own frame, to floating-point noise. Confirmed the generated flank
  matches the closed-form involute to <0.05°, and — the fundamental law of
  gearing — that this holds independently of which construction `cutter_teeth`
  value was used. The solid is built from an outer circular wire plus a
  genuinely separate inner toothed wire (`bd.Face(outer_wire, [inner_wire])`)
  specifically because the naive alternative (a single combined wire) is a
  documented trap for this shape: it can silently produce a bore-less disk
  whose volume looks unremarkable at a glance (within a fraction of a percent
  of the holeless figure) instead of a genuine ring with a hole. The
  regression test for this (§13.15) compares the built solid's volume against
  a plain holeless disk of the same outer dimensions and requires it to be
  meaningfully smaller, not just different — the check that would catch this
  specific failure mode if it ever recurred, not just a generic manifold check.
- **Spiral/hypoid bevel gears — not implemented.** Straight bevel's own method
  (Tredgold: unroll a flat virtual gear, wrap it onto the cone) doesn't extend,
  because a spiral tooth's curved lengthwise trace comes from real cutter-head
  kinematics (a rotating cutter, cradle angle, tilt), not a coordinate
  transform on an already-flat tooth. Rather than ship an unvalidated
  approximation, wrote up what a correct implementation actually needs
  (`docs/gear-math.md` §12): the cutter-head generation process itself, the
  additional free parameters (spiral angle, cutter radius, and for hypoid
  specifically a non-intersecting axis offset that turns the pitch surfaces
  into hyperboloids rather than cones), and — critically — what a correct
  implementation could even be validated against, which hasn't been sourced
  yet. This project already shipped one plausible-looking-but-wrong bevel
  gear implementation earlier and found out the hard way; not repeating that
  for a family with substantially less time invested and no clear validation
  target yet.
- Both new families' `server.py` commands (outline / export_step / export_dxf
  / export_mesh) are wired following the exact existing dispatch pattern, so
  the C# UI has a working protocol to connect to. (This pass was Python-only;
  the C# side was wired in the follow-up pass above.)
- Internal gears' solid-construction default tolerance is deliberately looser
  than the 2D preview default (30 microns vs. 1): left at the tight default,
  a single z=40 ring's STEP file came out at 16.6MB (a whole ring's toothed
  boundary repeats that per-point density z times, unlike an external gear's
  much shorter perimeter) — still far tighter than any real machining
  tolerance, and cut the file to 4.1MB.
- All 44 tests pass (28 original + 6 rack + 10 internal); `involute.py` itself
  was not touched by this pass.

## SolidWorks add-in: two real registration bugs found and fixed; one open question

Actually launched SolidWorks and checked whether the add-in loads (not just
"is the code present") -- it didn't, and not for a superficial reason. Found
and fixed two real bugs in `register-addin.ps1`, confirmed by reading the
actual registry state, not by trusting the script's own "Done" message:

1. **Wrong CodeBase path.** The script's default `$DllPath` pointed at
   `bin\Debug\net48\...` -- but the add-in project builds x64-only
   (`PlatformTarget=x64`, required since SolidWorks 2020+ is 64-bit-only), so
   the real build output lands at `bin\x64\Debug\net48\...`. A *stale* DLL
   happened to still exist at the wrong path (left over from before
   PlatformTarget was set), so the script's `Test-Path` check passed and it
   silently registered that old, outdated copy instead of erroring out.
   Fixed the default path; deleted the stale non-x64 `bin\Debug` folder so
   the trap can't recur.
2. **Garbled registry key names.** `Register-ComClass` (the script's helper
   function) had a `Write-Output "Registered $ProgId -> $clsid"` line for a
   human-readable progress message -- but PowerShell folds a function's
   *entire* output stream into a captured return value, not just its
   `return` statement. `$addinClsid = Register-ComClass ...` therefore
   captured a 2-element array, and string-interpolating an array into the
   `AddIns`/`AddInsStartup` key paths joined it with a space, creating a key
   literally named `"Registered GearGen.SolidWorksAddin.SwAddin -> {guid}
   {guid}"` instead of the clean `{guid}` SolidWorks actually looks for.
   This meant the add-in was never actually discoverable by SolidWorks'
   Tools > Add-Ins scan in ANY prior session, regardless of what earlier
   testing concluded -- the CLSID/COM registration (a separate code path,
   unaffected by this bug) was always correct, which is enough for direct
   COM activation to succeed, but not enough to appear in that list. Fixed
   by switching to `Write-Host` (doesn't pollute a captured return value);
   cleaned up the malformed keys.

Verified, not assumed: after both fixes, `HKCU:\Software\SolidWorks\AddIns\
{guid}` and `...\AddInsStartup\{guid}` exist with the correct name and
values, and `Activator.CreateInstance` on the add-in's ProgID succeeds
standalone (no SolidWorks involved) -- so the add-in itself is genuinely
loadable. Added a new `--swaddincheck` diagnostic flag to `GearGen.App`
(`ISldWorks.GetAddInObject`, SolidWorks' own documented way to check an
add-in's connection state) to test this against a live instance.

**Open question, not yet resolved**: even with both fixes, GEARS GENERATOR
still didn't appear in a live "Tools > Add-Ins" dialog (checked visually,
via `PrintWindow` capture -- normal screen capture doesn't work in this
environment, `PrintWindow` with `PW_RENDERFULLCONTENT` does). Leading
hypothesis: SolidWorks' *listing* scan for that dialog may read only
`HKLM:\SOFTWARE\SolidWorks\AddIns` (where the built-in add-ins that DO
show up -- FeatureWorks, MBD, Toolbox, etc. -- are in fact registered),
separate from the standard HKCU->HKCR COM-activation merge that makes
direct instantiation work. This session has no admin rights to test the
HKLM/regasm alternative and confirm. Testing was also hampered by an
unrelated environment quirk: a SolidWorks instance left running without
active COM/UI interaction repeatedly closed itself within roughly a
minute or two, for reasons not fully diagnosed (no crash logged in the
Application event log) -- every verification here used a freshly-launched,
actively-polled instance to work around that, per-check.

**Next step for whoever has admin rights on this machine**: run
`register-addin.ps1`'s elevated `RegAsm.exe /codebase /tlb` alternative
(now pointing at the correct `bin\x64\...` path) and check whether GEARS
GENERATOR then appears in Tools > Add-Ins. If it does, that confirms the
HKLM theory and the per-user path needs a different fix (or is simply not
viable on this SolidWorks version); if it still doesn't, the cause is
something else this session didn't reach.

## Spur, helical, worm: checked for the same class of bug as bevel

After the bevel fix, checked whether spur/helical/worm had anything similar
hiding behind the same kind of test gap (tests that check the math but never
build the actual solid and measure it). For each family, built several
different z/module/bore/helix/hand/starts combinations and checked: is the
built solid's every body genuinely manifold, is the body count what it should
be, and does the tooth/thread tip land exactly on the intended addendum
radius (not just close) -- plus an actual render of each, not just numbers.

Result: **no defects found** in spur, helical, or worm -- every case came back
manifold with the expected body count (1 for spur/helical; core + one per
thread start for worm, which is deliberately a Compound, not fused) and exact
addendum-radius agreement. Visual renders of all three look correct. This
isn't surprising in retrospect: spur uses a plain extrude, helical lofts
between planar rotated copies of the same profile, and worm's per-station
loft points all share one flat cutting plane -- none of them has bevel's
specific problem (a toe/heel boundary that traces a genuinely non-planar 3D
curve on the cone), which is what defeated `make_loft`'s automatic capping in
the first place.

What DID change: added permanent manifold + body-count regression tests for
all three (previously only bevel had this coverage, which is exactly the gap
that let its bugs ship unnoticed) -- `test_spur_and_helical_solids_are_manifold_single_bodies`
in `tests/test_involute.py`, `test_full_solid_bodies_are_all_manifold_with_correct_count`
in `tests/test_worm.py`. 28 tests total, all passing.

## Bevel gears: two real geometry bugs found and fixed

The user reported the bevel gear as "absolutely wrong or incomplete" -- correctly.
Rendering an actual bevel gear (not just reading the code) showed a spiky,
star/pinwheel-shaped mess instead of a gear, and measuring the solid directly
(`is_manifold`, body count, volume) turned up a second, independent defect the
visual check alone wouldn't have caught. Both were pre-existing since the bevel
gear phase, not introduced by the worm gear work that followed it -- the
existing self-tests checked analytical properties of the cone-mapping (pitch-
line straightness, toe/heel scale ratio) but never the tooth shape itself or
the built solid's manifold-ness, so neither bug tripped a test. Full technical
writeup: `docs/gear-math.md` section 8.3.

1. **Wrong tooth shape** (the visible "spiky star" bug): `single_tooth_polygon`
   (the single-tooth extraction bevel gears need, since Tredgold's virtual
   tooth count is generally non-integer -- section 8.1) capped its tooth blank
   at `1.05x` the addendum radius instead of exactly the addendum radius, a
   leftover mix-up with an unrelated margin concept used elsewhere in the same
   file. Nothing then trimmed the tip back down, so every tooth's addendum
   land sat 5% beyond the true addendum circle -- and since involute flanks
   narrow going outward, a too-large radius reads as a visibly sharper,
   more-pointed tip, which is what produced the star/pinwheel look once 20 of
   them were arrayed around a gear. Caught by rendering the actual tooth
   polygon in isolation and comparing its tip radius against
   `GearParams.addendum_radius` directly, not by further guessing from the
   whole-gear render.
2. **Non-manifold solid** (a second, independent bug, invisible in a render):
   even after fixing the tooth shape, the built solid measured `is_manifold =
   False`. Root cause: a bevel tooth's toe/heel boundary loop is a genuinely
   non-planar 3D curve (confirmed directly -- a flat `Face` constructor
   rejects it), and `make_loft(..., ruled=True)`'s automatic end-capping
   silently fails on a non-planar wire -- it still returns something with a
   plausible-looking (but actually wrong) volume, so nothing raises, but the
   shell is open at both ends. Fixed by capping both ends explicitly with a
   general filling face. That surfaced a *third*, related issue: fusing all z
   now-correct teeth onto the blank isn't reliably robust in OpenCASCADE
   either -- traced by checking volume/body-count after each step and finding
   a sequential fuse loop silently corrupt mid-loop for some gears, and even a
   single combined fuse call fails differently on others. Fixed the same way
   worm gears already fixed the identical class of problem: don't fuse: the
   solid is a `Compound` of the blank plus each individually-manifold tooth
   (same SolidWorks-sees-a-multi-body-part tradeoff as worm).

Verified, not just fixed-and-hoped: 3 new regression tests (tooth tip radius
exactness, both for a plain integer tooth count and the non-integer virtual
count bevel actually uses; full-solid manifold-ness and correct body count
across 4 different z/module/bore/shaft-angle combinations, since both bugs
were parameter-dependent -- the original code passed for SOME inputs).
Re-rendered the actual solid (now a proper tapered gear, not a star), re-ran
STEP export -> SolidWorks import end-to-end (succeeded, genuine `.sldprt`),
and regenerated the mosaic's `thumb_bevel.png` (the old one visibly showed
the same broken star shape -- almost certainly what the user actually saw).

## Worm gears: full integration

The worm (screw) is its own gear family in the mosaic, with its own parameter
set (thread starts, pitch diameter, axial module, hand, threaded length) and
its own derived-values panel (lead, lead angle, center distance, and a
"matching wheel" hint). There's deliberately no separate "worm wheel" mode:
the wheel is mathematically just an ordinary helical gear (module = worm's
axial module, helix angle = worm's lead angle, matching hand), so building
one means switching to the existing Helical card with those values — no new
geometry code needed for the wheel side at all.

Wired end-to-end and verified at every stage: `server.py`'s `outline`/
`export_step`/`export_dxf`/`export_mesh` commands all handle
`gear_type: "worm"`; the C# side has `GearFamily.Worm`, worm-specific
`GearParameters` fields, and a `PyGearEngine` request branch; the UI has the
mosaic card, conditional parameter inputs, a live 3D thread render, and the
derived-values display. Confirmed via the `--uismoke`/`--exporttest`/
`--worm` smoke test (mosaic card selects, 3D viewer shows an actual threaded
screw, derived values populate, a length-vs-lead sanity warning fires
correctly for a too-short default length) and via `--swtest` (the exported
multi-body STEP imports into SolidWorks as a genuine, usable `.sldprt`).

Two real bugs were caught and fixed in this pass — see the "Known
limitations" section below for the full writeup: a Z-offset bug in the
multi-start thread math (found via bounding-box asymmetry, not inspection),
and an uncatchable `StackOverflowException` at app startup caused by two
independent RadioButton pairs sharing one WPF `GroupName` (found by
bisecting the XAML against the smoke test, not by guessing).

## Real 3D viewer, gear-family mosaic, SolidWorks version picker

- **3D viewer**: the flat 2D cross-section preview is replaced with an actual
  interactive `HelixViewport3D` (HelixToolkit.Wpf 2.27.3 -- the 3.x series
  pulls in CommunityToolkit.Mvvm as a transitive dependency, which broke this
  project's string-interpolation compilation in an unrelated file; switched to
  the dependency-light classic 2.x series instead of chasing that down).
  Orbit (drag), pan (right-drag), zoom (wheel) come from HelixToolkit; added
  Front/Top/Right/Iso preset buttons and a Zoom-to-Fit button, defined against
  this project's Z-up axis convention (not WPF's more common Y-up). The model
  shown is the ACTUAL tessellated solid (STL, via a new `export_mesh` server
  command reusing the existing solid-builders), not implied by 2D parameters
  -- a bore or a helix twist is now visibly correct in the viewer, confirmed
  by rendering both. Runs on its own generation-tracked async fetch alongside
  (not blocking) the fast outline-based derived-values update, since a real
  solid build + tessellation is slower (~1-6s) than the flat 2D profile.
- **Gear-family mosaic**: the plain Cylindrical/Bevel toggle is now a visual
  card gallery -- real rendered 3D thumbnails (via matplotlib Poly3DCollection
  from an actual tessellated solid, not icons) for Spur / Helical / Bevel /
  Worm, all four fully working. Clicking a card selects the family (and, for
  Spur/Helical, sets the helix angle to make that card's claim true
  immediately -- Spur forces 0°, Helical jumps to 25° if it was 0).
- **SolidWorks version picker**: exporting now shows a dialog (ComboBox,
  2020-2026) before the save-file dialog. Important honesty check done here:
  SolidWorks' API has **no** "Save As an older year's native format" option
  for parts (`swSaveAsVersion_e` has no such values -- checked directly against
  the installed interop assembly, not assumed) -- the only real way to produce
  a given year's .sldprt is to run that year's own SolidWorks. So the picker
  detects actually-installed versions (by reading SLDWORKS.exe's real file
  version and mapping SW's well-known major-version-per-year numbering,
  confirmed against this machine's two real installs: v33=2025, v34=2026) and
  launches that specific exe directly if present; if the requested year isn't
  installed, it says so plainly and uses whatever's available instead of
  silently pretending.

## v1 + helical/bevel gears

Parametric external involute spur, helical, **and straight bevel** gears (metric +
inch for spur/helical), with a WPF app you can run standalone or load as a
SolidWorks add-in. Both hosts share one UI and one geometry engine.

## Bevel gears (added after helical)

A bevel gear's teeth sit on a cone, not a cylinder. Real bevel gears (manufactured
and CAD-modeled alike) use **Tredgold's approximation**: unroll the "back cone" into
a flat virtual spur gear, reuse the flat involute machinery, then wrap that tooth
shape onto the real cone and taper it from the large end (heel) to the small end
(toe) — see `docs/gear-math.md` section 8. Pitch angle comes from the mating gear's
tooth count and the shaft angle (default 90°) — how bevel gears are actually
specified in practice — with a direct-angle override available.

Reused, unchanged: the same flank/fillet/undercut construction as spur/helical
(`single_tooth_polygon`, generalized to accept the virtual gear's — generally
non-integer — tooth count). New: the cone-wrapping math, cross-checked two
independent ways before trusting it (not just derived once) — see 8.2's derivation —
and confirmed **algebraically exact** (not approximate) that the tooth surface
between toe and heel is a ruled surface, so the solid needs only 2 loft stations
rather than helical's many. Validated end to end: self-tests (pitch line lands
exactly on the pitch cone at every station; toe is a correctly-scaled copy of the
heel), a full 3D render (visibly tapering teeth on a conical body), derived values
(pitch/outside/root diameter) matching the standard AGMA formula (`Do = D +
2·cos(γ)·ha`) to the decimal, and — same bar as spur/helical — a real SolidWorks
import producing a genuine 133KB `.sldprt`.

One real bug caught in this pass: an early version of the "derived values" display
computed heel addendum/dedendum diameter from the *virtual* gear's radius instead of
the real physical heel radius (~50% too large) — caught by sanity-checking against a
hand computation before shipping, not found by luck.

## Helical gears

## Helical gears (added after v1)

A helical gear is a spur gear's cross-section (in the plane perpendicular to the
axis) twisted along the face width — see `docs/gear-math.md` section 7. The user
enters **normal** module/pressure-angle (the hob's own reference, standard industry
convention); the transverse (cross-sectional) values used for all the existing,
already-validated 2D profile code are derived automatically
(`GearParams.transverse_module_mm` / `.transverse_pressure_angle_rad`). This meant
**zero changes** to the validated flank/fillet/undercut code — it was already
computing "the transverse cross-section", which is exactly what a spur gear's cross
section *is* when the helix angle is zero. Confirmed as an exact regression test
(`test_zero_helix_angle_matches_spur_exactly`).

The 3D solid is a loft (`ruled=True`) through N copies of that transverse profile,
each progressively rotated — N chosen from the twist magnitude (~1 section per 3° of
twist), not fixed, so a large helix angle or wide face doesn't lose accuracy. Verified
by measuring the actual rotation between the built solid's top and bottom faces and
confirming it matches the predicted twist angle exactly (14.697° both ways). Also
re-verified against a live SolidWorks instance: a helical STEP (loft-based, more
complex topology than the spur case's plain prism) imports and saves as a real
728KB `.sldprt` without issue.

New UI: a HELIX section (helix angle spinner, right/left-hand toggle, both hidden
behind "0° = spur gear" framing) plus three new derived-value readouts (transverse
module, lead, total twist) that only appear once a helix angle is set.

## What's built, and validated (not just written)

### Geometry engine (Python, `py/gear_step/`)
- `involute.py` — tooth profile (flank + true root fillet/undercut) computed by
  simulating the generating rack cutter rolling on the gear blank and taking
  the boolean-swept cut (`shapely`) — the same computation real hobbing
  performs. See `docs/gear-math.md` for the full derivation and the two real
  bugs found and fixed while validating it (a wrong hand-derived trochoid
  formula, and a 101MB STEP file from over-tessellated output).
- `tests/test_involute.py` — 7 automated checks, all passing: matches the
  closed-form involute to <0.05° of angle, correct undercut/no-undercut
  behavior at the classical z_min≈17 cutoff, correct tooth thickness,
  metric/inch agreement.
- `build_gear.py` — builds the 3D solid (build123d/OpenCASCADE) and exports
  **STEP** and **DXF** (flat profile, for the user's own CAD/CAM).
- `server.py` — a persistent process the C# app talks to over stdin/stdout
  JSON, so parameter tweaks don't pay Python startup cost every time.

### C# / WPF (`src/`)
- `GearGen.Geometry` — the parameter model, unit conversion, quick undercut
  warnings (mirrors the Python side for fast local feedback).
- `GearGen.PyEngine` — owns and talks to the persistent Python process.
- `GearGen.UI` — **the actual UI**: `GearPanel` (spinners for every parameter,
  unit toggle, live 2D preview, derived-values panel, undercut warnings,
  export buttons) + `GearViewModel` (debounced live preview, MVVM). This one
  control is shared by both hosts below.
- `GearGen.App` — the standalone WPF app (`GearsGenerator.exe`). "Export to
  SolidWorks" drives SolidWorks via COM automation (attach to a running
  instance, or launch one), imports the generated STEP, and saves a real
  `.sldprt`.
- `GearGen.SolidWorksAddin` — the same `GearPanel` docked in a SolidWorks Task
  Pane. "Create Part in SolidWorks" builds directly into the live session
  (no launch/attach needed — it *is* the session).

### End-to-end verification actually performed this session
Screen capture doesn't work in this environment, so the UI was verified by
rendering the live WPF window via `RenderTargetBitmap` (not a screenshot tool)
— see `ui-shots/` for the captures. Confirmed:
- Live preview renders the correct gear shape (matches the validated Python
  geometry) and rescales correctly for any tooth count.
- The undercut warning banner appears correctly for z=8 (below the ~17-tooth
  cutoff) and the preview visibly shows the pinched/undercut root.
- STEP and DXF export both work through the actual UI code path (not just the
  Python layer directly).
- **SolidWorks automation was run against a real, live SolidWorks instance on
  this machine** and produced a genuine 590KB `.sldprt` file. Getting there
  surfaced three real bugs, each found by actually running it, not by
  inspection: SolidWorks' COM objects require an STA thread (plain `Task.Run`
  is MTA and fails); C#'s `dynamic` keyword fails outright against `ISldWorks`
  (a DLR limitation with how SolidWorks exposes IDispatch type info); even
  `Type.InvokeMember` late-binding hit a type-mismatch on `SaveAs`'s
  `ExportData` parameter. The fix that actually worked: reference the real
  `SolidWorks.Interop.*` assemblies and call the strongly-typed interfaces
  directly (both `GearGen.App` and `GearGen.SolidWorksAddin` do this).
- The add-in's COM registration was verified by actually instantiating
  `GearGen.SolidWorksAddin.SwAddin` via its ProgID in a fresh process, not
  just by writing registry keys and hoping.

## How to run it

- **Standalone**: `src/GearGen.App/bin/Debug/net48/GearsGenerator.exe`
- **SolidWorks add-in**: build `GearGen.SolidWorksAddin`, run
  `register-addin.ps1` (per-user registration, no admin needed), restart
  SolidWorks — it's pre-enabled in Tools > Add-Ins and opens as a Task Pane.

## Known limitations / natural next steps

- Tooth flanks export as dense (but tightly toleranced, 10-micron) polylines,
  not true spline curves — files work correctly but aren't maximally compact
  or "native-smooth". A future pass could fit B-splines through the profile.
- The `.sldprt` produced is an **imported** solid (via STEP), not a
  parametric SolidWorks feature tree (sketch → extrude → pattern). This was a
  deliberate tradeoff: driving SolidWorks to build its own feature tree via
  COM would mean re-deriving the whole rack-sweep geometry a third time in a
  third language, with all the same risk of subtle error already hit twice —
  importing the same validated STEP is far more reliable. The part is fully
  correct and usable, just not re-editable via SolidWorks' own sketch/feature
  history.
- External spur, helical, straight bevel, and worm gears, plus racks and
  internal (ring) gears -- the last two Python-only so far, not yet wired
  into the C# UI (see the top section). Spiral/hypoid bevel is out of scope
  for now -- attempted and deliberately not implemented; see
  docs/gear-math.md section 12 for the full reasoning and what a correct
  implementation would actually need.
- **Worm gears: fully wired end-to-end** -- mosaic card, parameter UI, live
  3D preview, STEP/DXF export, and SolidWorks import all working. The 3D
  solid build was completely blocked at first, then fixed:
  1. *Performance*: boolean-fusing multiple spiral thread solids together (or
     onto an already-threaded body) hangs OpenCASCADE indefinitely (10+ min,
     killed) even though each thread's own loft takes about a second --
     narrowed down by timing each stage separately, not guessed. Fusing one
     thread onto a plain cylinder core alone IS fast (~4s); it's specifically
     spiral-vs-spiral near-tangent surface intersection that the boolean
     algorithm chokes on. Fixed by using a `Compound` of the unfused core +
     thread solids instead of a true boolean union -- effectively instant,
     still a valid STL/STEP export, at the cost of SolidWorks seeing it as a
     multi-body part rather than one fused solid, and a larger file than a
     true single body would produce (mitigated with a lower default
     `n_per_turn` than full circular accuracy would otherwise use). Confirmed
     the multi-body approach still imports into SolidWorks as a usable
     `.sldprt` via the same `--swtest` path used for the other families.
     **Superseded (see the top "latest" section of this file)**: the
     Compound-vs-fuse conclusion here was narrower than it looked -- a
     single N-ary fuse (`core.fuse(*threads)`, all threads in one call) is
     actually fast and reliable; the hang was specifically SEQUENTIAL
     pairwise fusing. `build_worm_solid` now returns one true fused `Solid`.
  2. *Correctness*: a real bug in the multi-start (`starts` > 1) case --
     the second thread's angular phase offset was folded into the same
     calculation that derives Z from the lead, so instead of just rotating
     that thread around the axis, it also shifted its entire Z-range by
     `lead/2` for a 2-start worm. Caught by checking the built solid's
     bounding box against the requested length and finding it asymmetric,
     not by inspection. Fixed by applying the phase as a pure post-hoc
     rotation of (X, Y) only, after Z is already computed from theta alone.
  Both fixes are covered by regression tests (`test_worm.py`) that build the
  actual solid and check timing + bounding-box symmetry, not just formulas.
  3. *App-wiring gotcha*: once the mosaic's Worm card and its own
     right/left-hand toggle were added to `GearPanel.xaml`, the whole app
     started crashing with an uncatchable `StackOverflowException` on
     startup -- even with the Worm card never selected. Cause: the new
     worm hand-toggle `RadioButton` pair reused `GroupName="hand"`, already
     used by the (still-present-but-collapsed) helical hand toggle. WPF
     enforces mutual exclusivity across *all* same-named RadioButtons in
     scope, and two independently OneWay-bound pairs sharing one group name
     (both initially "true" for `IsRightHand`) drove WPF's own
     Checked/Unchecked group-sync logic into unbounded synchronous
     recursion. Found by bisecting `GearPanel.xaml` section-by-section
     against the `--uismoke` smoke test (which reproduced the crash in
     under a second, making each bisection step cheap) rather than
     guessing from a stack-less crash. Fixed by giving the worm toggle its
     own `GroupName="wormhand"` -- the underlying `IsRightHand`/
     `IsLeftHand` model properties still keep the two toggles in sync
     regardless of visual group name, since only one pair is ever visible
     at a time.
  There's no separate "worm wheel" mode: the worm (screw) is its own gear
  family, and its mate is just an ordinary helical gear built with the
  Helical card, using the module/lead-angle/hand the Worm card's derived
  values panel shows under "MATCHING WHEEL".
- Bevel gears use Tredgold's approximation (the industry-standard method
  every real straight bevel gear is actually manufactured and modeled with —
  not a shortcut taken for this app). The tooth surface is an exact ruled
  surface under that approximation (proven algebraically, not assumed — see
  docs/gear-math.md 8.2), so unlike helical the loft needs only 2 stations
  (toe, heel), not many.
- Bevel gears currently have no inch (diametral pitch) input path server-side
  — the C# UI still converts correctly regardless of the unit toggle (client-
  side mm conversion), but py/gear_step/bevel.py's BevelGearParams has no
  from_inch() the way involute.py's GearParams does. Low-risk, easy follow-up
  if wanted.
- The add-in is registered per-user (HKCU) since this session has no admin
  rights; `register-addin.ps1`'s header comment shows the one-line elevated
  `regasm` command for a machine-wide install instead, if wanted.
