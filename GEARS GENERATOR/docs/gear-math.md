# Gear Math Spec — External Involute Spur & Helical Gears

This is the single source of truth. The Python/OpenCASCADE engine, the C# geometry
library, and the SolidWorks exporter must all reproduce these formulas exactly —
that's what keeps a `.step` file, a `.sldprt` file, and the WPF preview identical.

All angles in this document (and in every UI, file, and API in this project) are in
**degrees**. Convert to radians only at the point of use inside trig calls.

## 1. Inputs

| Symbol | Meaning | Metric input | Inch input |
|---|---|---|---|
| `m` | module (mm) | given directly | `m = 25.4 / DP` |
| `DP` | diametral pitch (1/in) | `DP = 25.4 / m` | given directly |
| `z` | number of teeth | integer ≥ 4 | same |
| `alpha` | pressure angle | degrees, default 20° | same |
| `x` | profile shift coefficient | default 0 | same |
| `ha*` | addendum coefficient | default 1.0 | same |
| `hf*` | dedendum coefficient | default 1.25 | same |
| `rho_f*` | root fillet coeff of the *generating rack* | default 0.38 | same |
| `b` | face width | mm | mm (converted from in on entry) |
| `backlash` | circular backlash (mm), applied as tooth-thickness reduction | default 0 | same |
| `bore` | bore diameter (mm), 0 = none | default 0 | same |

Everything downstream works in millimeters — an inch-system gear is converted to its
metric module once, at input time, and carries a flag so the UI can still label
dimensions back in inches.

## 2. Derived circles

```
r        = m * z / 2                          pitch radius
rb       = r * cos(alpha)                     base radius
ra       = r + m * (ha* + x)                  addendum (tip) radius
rf       = r - m * (hf* - x)                  dedendum (root) radius, before fillet
s        = m * (pi/2 + 2*x*tan(alpha)) - backlash   tooth thickness at pitch circle
```

`ra`, `rf` use the standard ISO-style addendum/dedendum modification by profile shift `x`.

## 3. Involute flank (closed form, exact)

Parametrize by roll angle `t` (radians), measured from the base circle:

```
X(t) = rb * (cos(t) + t*sin(t))
Y(t) = rb * (sin(t) - t*cos(t))
```

This traces the involute of the base circle starting at `t=0` (a point ON the base
circle). `t` ranges from `0` up to `t_max = sqrt((ra/rb)^2 - 1)` (where the involute
radius reaches the addendum circle).

If `rf > rb` (root circle outside base circle — common for high tooth counts), the
involute is also valid for radii between `rf` and `rb`... actually the involute
*starts* at `rb`, so for `rf > rb` there is a short involute segment between the two,
and no rack-generated fillet touches it directly (a separate small connecting fillet
of radius `rho_f* * m` is blended tangent to both the root circle and the involute
start point). If `rf <= rb` (low tooth counts, or negative shift), the involute alone
never reaches the root — the **rack-generated trochoid** (§4) fills the gap and this
is exactly where undercut appears.

## 4. Root fillet / undercut trochoid (rack-generation kinematics — exact)

This is the geometry that makes the tooth "as if it was hobbed": the gear tooth root
is the mathematical envelope of a rack-shaped cutter rolling on the pitch circle
without slipping — precisely what a hobbing or rack-shaper machine does.

### 4.1 Generating transform

Gear center at the origin, gear rotates by roll angle `phi` (radians). The rack's
pitch line is the fixed line `y = r`, tangent to the pitch circle at `(0, r)`. Rolling
without slip (gear rotating CCW by `phi`) requires the rack to translate by `-r*phi`
along its own pitch-line direction. For any point fixed in the **rack's** local frame
at `(u, v)` — `u` along the pitch line, `v` measured downward from the pitch line,
i.e. toward the gear center — its position in the gear's own (body-fixed, rotating)
frame at roll angle `phi` is:

```
X(phi, u, v) =  cos(phi)*(u - r*phi) + sin(phi)*(r - v)
Y(phi, u, v) = -sin(phi)*(u - r*phi) + cos(phi)*(r - v)
```

This is a plain rigid-body kinematic result (rotation by `-phi` composed with the
rack's translation) — it has no free parameters to get wrong, and it self-verifies:
holding a point on the rack's straight flank (angle `alpha` to the `v` axis) fixed and
sweeping `phi` reproduces the closed-form involute of §3 exactly (checked numerically
in `py/gear_step/involute.py::_selftest_flank_matches_involute`).

### 4.2 The generating (cutting) rack's tooth form

The rack that *cuts* the gear has, in its own frame, a tooth protruding into the
gear blank by the gear's dedendum minus shift, with the rack-tooth *tip* corners
rounded by radius `rho = rho_f* * m`:

```
tip_depth   = (hf* - x) * m          # how far the rack tooth extends past the pitch line
half_thick  = s / 2                  # rack tooth half-thickness at the pitch line
```

Rack tooth points (right-hand side, `u >= 0`), pitch line at `v=0`, tip at `v = tip_depth`:
- straight flank from `v=0` (at `u = half_thick`) down toward the tip, at angle
  `alpha` from vertical: `u(v) = half_thick - v*tan(alpha)`
- a fillet arc of radius `rho`, tangent to that flank and tangent to the tip land
  (`v = tip_depth`), rounding the corner
- flat tip land at `v = tip_depth`

### 4.3 Envelope — validated boolean sweep (`involute.py`'s actual method)

An early attempt at this envelope used a "minimum radius per angular bin" numeric
heuristic over a wide, unbounded sample grid. It was **wrong** — verified wrong, not
just suspected: cross-checked against the closed-form involute and found to disagree
by whole millimeters, traced to the heuristic sampling regions that don't correspond
to any physical cutter position. It has been replaced by a method that is exact by
construction and was validated by literally overlaying its output on the closed-form
involute (matching to < 0.05° of angle at multiple radii — see
`gear_step/tests/test_involute.py`):

1. Build the generating rack's **one tooth** as an actual bounded 2D polygon
   (`rack_cutter_tooth_points`): straight flanks at the pressure angle, the root
   fillet arc, flat tip land, extended a bit above the pitch line so the polygon is
   a clean closed shape.
2. Sweep it: transform that polygon through §4.1 at many closely spaced `phi` values
   spanning the angular range needed to fully carve one tooth gap, and take the
   **union** of all those transformed copies (`rack_swept_cutter_union`) — this is
   the literal swept volume the cutter removes while generating one gap.
3. Subtract that swept union from a solid blank disk of radius `ra` (the addendum
   circle) — what's left is the exact gear cross-section for that one gap.
4. Pattern: rotate-copy the one-gap swept union `z` times (`360/z` degrees apart,
   offset by half a pitch so a *tooth*, not a gap, ends up centered on the reference
   axis), union them, and subtract the lot from the blank once
   (`full_gear_polygon`) — cheaper than re-running the sweep per tooth, and correct
   because the geometry is rotationally symmetric.

This reproduces true undercut automatically whenever the tooth count is low enough
to trigger it — the classical cutoff (`x=0`) is `z_min = 2 / sin(alpha)^2` (17 teeth
at 20°), reproduced as a numerical check in the test file, not assumed — and needs
no separate closed-form involute/trochoid stitching logic at all: one method produces
the whole tooth, flank and fillet together, correct by construction because it's the
same computation real hobbing/rack-shaping performs.

## 5. Full tooth / full gear outline

One tooth-space outline: right flank (root → tip, involute + fillet stitched at their
numeric intersection), tip arc (constant radius `ra` across the tooth's angular
thickness), left flank (mirror of the right flank), root arc over to the next tooth's
right flank start (constant radius `rf`, or the fillet curve if it doesn't fully reach
`rf`). Pattern this `z` times by rotating `360/z` degrees.

## 6. Solid

Extrude the closed 2D wire by face width `b` (straight prism when the helix angle is
zero; a twisted/lofted extrusion otherwise — section 7.3). Cut a central bore of
diameter `bore` if nonzero.

## 7. Helical gears

A helical gear is, geometrically, an external spur gear's cross-section (in the
plane perpendicular to the axis, the **transverse plane**) swept along the axis
while continuously rotating -- a twisted extrusion. Nothing about section 1-7
changes; helical support is entirely: (a) which module/pressure-angle number
feeds those formulas, and (b) how the resulting 2D profile becomes a solid.

### 7.1 Normal vs. transverse

Gear hobs/cutters are specified by their **normal** module `mn` and **normal**
pressure angle `alpha_n` -- that's what the user enters as `module_mm` and
`pressure_angle_deg` (unchanged meaning). Cutting a helical gear tilts that
same cutter relative to the gear axis by the helix angle `beta`, and the
cross-section seen in the transverse plane (perpendicular to the axis) is
"stretched" by that tilt:

```
mt        = mn / cos(beta)                         transverse module
alpha_t   = atan( tan(alpha_n) / cos(beta) )        transverse pressure angle
```

For `beta = 0` (a plain spur gear) these reduce to `mt = mn`, `alpha_t =
alpha_n` exactly -- so every existing formula, unchanged, already handles the
spur case as the `beta=0` special case of the helical one.

### 7.2 Which formulas use which module

The **pitch circle** (and therefore tooth count/spacing around it) and the
**base circle** and **tooth thickness** are transverse-plane quantities --
they use `mt` / `alpha_t`:

```
r   = mt * z / 2
rb  = r * cos(alpha_t)
s   = mt * (pi/2 + 2*x*tan(alpha_t)) - backlash
```

**Tooth height** (addendum, dedendum) and the **generating rack/hob's own
geometry** (its fillet radius, its cutting depth) are properties of the
cutting tool itself, unaffected by the transverse "stretch" -- they keep using
the **normal** module `mn` directly, exactly as in the spur formulas (section
2-4), unchanged:

```
ra = r + mn*(ha* + x)
rf = r - mn*(hf* - x)
rack fillet radius = rho_f* * mn
rack tip depth      = (hf* - x) * mn
```

Given this, `involute.py`'s `GearParams.alpha_rad` and `.pitch_radius`
properties are redefined to mean "the transverse values used for all 2D
profile construction" (reducing to the plain normal/spur values when
`helix_angle_deg == 0`), while `.module_mm` keeps meaning normal module
everywhere it's used directly (addendum/dedendum/fillet/tip-depth). Every
function in section 3-5 (`involute_point`, `rack_cutter_tooth_points`,
`rack_swept_cutter_union`, `full_gear_polygon`) is **unchanged code** -- it
automatically produces the correct transverse cross-section just by reading
these redefined properties. This is also why `helix_angle_deg=0` is checked as
an exact regression test against the pre-helical spur behavior.

### 7.3 The twist (making it a solid, not just a cross-section)

Total rotation of the profile from one face to the other, over face width `b`:

```
twist_total = b * tan(beta) / r        (radians, r = transverse pitch radius)
```

signed by hand (right-hand positive, left-hand negative, by convention here).
The solid is built (`build_gear.py`) as an **exact helicoidal sweep**: the
validated transverse profile extruded along the axis by `b` while rotating by
`twist_total` (OpenCASCADE's twist-extrude, `extrude_linear_with_rotation`),
so every profile point follows its true helix.

**This replaced a ruled loft, and the replacement is a measurement, not a
preference -- recorded here because the original reasoning sounded right and
wasn't.** The earlier build lofted `ruled=True` through `N` copies of the
profile (one per ~3° of twist), the k-th rotated by `k/N * twist_total` at
`z = k/N * b`, on the argument that a helicoid *is* a ruled surface, so
straight patches between finely-spaced rotated copies converge to the true
flank. The verification at the time checked the twist at the two END faces
(and found it exact) -- which every such loft satisfies by construction, since
it passes through each copy. Sectioning the built solid *between* copies, at
25/50/75% of the face width, and measuring against the profile rotated by
exactly `twist_total * z/b` found:

- ruled loft, routine gear (25° helix, 16 mm face, m=2.5): **359 µm** of
  flank error at mid-facet (14% of module), exactly 0 µm at each copy;
- ruled loft, steep/wide gear (35°, 40 mm): **1.3 mm** (53% of module);
- the error grew *linearly* with the per-copy rotation, not quadratically as
  a chord's sagitta would (which would have been ~8 µm) -- i.e. the loft was
  not pairing profile points one-to-one between rotated copies, but
  re-aligning wires and shearing the surface in between;
- a smooth (`ruled=False`) loft was no better: 270 µm - 3.4 mm, and at
  intermediate section counts a +1.4% to +2.0% *volume* overshoot (spline
  bulge between sections), while very few sections happened to fit and many
  tessellated coarsely -- a fragile window, not a fix;
- the twist-extrude: **0.0 µm** on the routine gear, 0.1 µm on the steep one,
  by the same check (which also validates the check itself); ~10x faster to
  build (0.14 s vs 1.8-5 s); and one continuous face per profile edge
  (~290) instead of one flat strip per edge per copy (1,700-5,200), which
  also shrinks the STEP file.

That section-plane check is now a regression test
(`tests/test_involute.py`, `test_helical_flank_is_the_true_helicoid_between_
the_end_faces`): sub-10 µm at 25/50/75% of the face, both hands, including
the steep/wide case -- the measurement the end-face twist check could not
make.

One consequence for the live 3D preview only (STEP carries the exact B-rep):
the flank is now genuinely curved and the viewer flat-shades each triangle,
so how smooth the twist *looks* is purely tessellation density. At the
0.02 mm chordal tolerance used elsewhere the exact surface tessellates
economically to ~1.4k triangles -- each within tolerance, but the normal
jumps between them read as bands; 0.002 mm gives ~4-9k triangles in ~0.05 s.
Angular tolerance turned out to have no effect on this surface at all.
Helical gears (and the worm's preview wheel, which is one) use 0.002 mm for
the preview mesh; spur keeps 0.02 (flat faces tessellate exactly).

The "dense straight patches converge" principle is still what the worm thread
(§9.2-9.3, ~9° per station) and the bevel tooth's two-station loft (§8.3)
rely on. The point-pairing hazard found here is a property of the loft
operation, so it applies to those too in principle; it has **not yet been
measured** there and should be, by the same section-plane method, before
being assumed absent.

### 7.4 Double-helical (herringbone) gears

A double-helical gear is two helical gears of opposite hand on one blank, sharing one
transverse profile and mirror-symmetric about the mid-plane of the face, so the axial
thrust of one half cancels the other's. Everything in 7.1–7.3 applies to each half
unchanged — same normal/transverse module and pressure angle, same lead, same exact
helicoidal sweep. With total face width `b`, centre gap `g` (0 for a true herringbone;
> 0 for the hob-runout groove a machined double-helical gear carries) and
`b_half = (b − g)/2`:

```
twist_half   = b_half * tan(beta) / r                    (7.3's formula over half the face)
rotation(z)  = twist_half * z / b_half                    0 <= z <= b_half
rotation(z)  = twist_half * (b - z) / b_half              b - b_half <= z <= b
             (the gap b_half < z < b - b_half is a plain cylinder at the root radius)
```

`build_gear.build_double_helical_solid` builds the lower half as 7.3's twist-extrude
from the un-rotated profile, and the upper half as the same twist-extrude started from
the profile *pre-rotated* by `twist_half` and twisting by `−twist_half` — so the two
meet at the mid-plane (or face the gap from either side) in the same fully-twisted
profile, the apex of the V, and both end faces carry the un-rotated profile. `hand` is
the hand of the half at `z = 0`; the other half is the opposite hand by construction,
and the gear as a whole has none. The bore is cut through the fused result.

Checks (`tests/test_herringbone.py`): sections at 20/50/80 % of each half match the
exactly-rotated profile to < 10 µm, and the section at `b − z` equals the one at `z`
(mirror symmetry; both hands; with and without a gap); both end faces and both apex
faces are what the formulas say; the result is one manifold solid whose volume is
Cavalieri's `A·(b − g) + π·r_f²·g − bore` to 0.2 % (a twist-extrude's sections are all
congruent, so its volume is exactly area × length); the STEP round-trips as one solid.

## 8. Straight bevel gears (Tredgold's approximation)

A bevel gear's teeth sit on a **cone**, not a cylinder: two gears on intersecting
shafts (angle `Sigma`, almost always 90°) mesh via matching **pitch cones** that
share a common apex. True bevel-tooth geometry is a *spherical* involute — hard to
work with directly, and not actually how real straight bevel gears are made or
modeled. **Every practical bevel gear (manufactured or CAD-modeled) uses Tredgold's
approximation** instead: unroll the "back cone" (the cone tangent to the sphere at
the pitch circle, perpendicular to the pitch cone) into a flat **virtual spur gear**,
use the already-validated flat involute machinery (sections 1-5) to get its tooth
shape, then wrap that shape onto the real cone and taper it linearly from the large
end (**heel**) to the apex-ward end (**toe**).

### 8.1 Pitch angle and the virtual gear

Given this gear's teeth `z`, its mate's teeth `z2`, and the shaft angle `Sigma`:

```
gamma = atan( sin(Sigma) / (z2/z1 + cos(Sigma)) )     pitch angle (half-angle of the pitch cone)
```

(`Sigma=90°` reduces to the well-known `gamma = atan(z/z2)`.) `module_mm` here means
the **outer/heel** module (the standard bevel-gear convention — cutters and
inspection are referenced to the large end). Derived:

```
R       = m * z / 2                    heel pitch radius (same formula as section 2)
Re      = R / sin(gamma)               outer cone distance: slant distance, apex to heel pitch circle
z_v     = z / cos(gamma)               virtual (equivalent spur) tooth count -- generally NOT an integer
```

The **heel's tooth shape** is exactly `single_tooth_polygon` (section 5's machinery,
generalized to accept `z_v` since it's non-integer) computed with `z = z_v` and the
real `module_mm`, `pressure_angle_deg`, coefficients — i.e. **zero new tooth-shape
code**: the whole validated flank/fillet/undercut construction is reused verbatim,
exactly as it was for helical gears. This is also why `gamma -> 90°` (`z_v -> infinity`)
is the correct degenerate case (an infinite virtual spur gear — a flat "crown" bevel
gear) and needs to stay out of the supported range (`gamma` clamped away from 90°).

### 8.2 Wrapping the flat tooth onto the cone, and tapering it

Set the pitch cone's apex at the origin, axis = +Z. For a point in the heel's flat
tooth shape at (heel_x, heel_y) — radius `heel_r = hypot(heel_x, heel_y)`, angle
`heel_theta = atan2(heel_x, heel_y)` in this module's usual convention — define its
deviation from the heel pitch circle: `dr_heel = heel_r - R/cos(gamma)` (note
`m*z_v/2 = R/cos(gamma)` exactly — the flat/virtual pitch radius **is** the heel back
cone's slant distance, algebraically, not by assumption).

At **pitch-cone slant distance `s` from the apex** (`s=Re` at the heel, smaller
toward the toe), the 3D point is:

```
k              = s / Re                                    linear taper factor
dr             = dr_heel * k                                deviation scales with the cone
actual_angle   = heel_theta / cos(gamma)                    same at every station (see below)
radial_on_cone = s*sin(gamma) + dr*cos(gamma)                offset perpendicular to the pitch line
Z              = s*cos(gamma) - dr*sin(gamma)
X = radial_on_cone * cos(actual_angle),  Y = radial_on_cone * sin(actual_angle)
```

`actual_angle` not depending on `s` says the tooth does not twist as it tapers (unlike
the helical case) — only its size and radial/axial position change. Checked, not
assumed: for a **fixed** point identity (`dr_heel`, `heel_theta`), every term above is
linear in `s`, so the true 3D path from toe to heel is an exact straight line — i.e.
Tredgold's approximation makes the tooth surface a **ruled surface** between toe and
heel -- exactly two stations (toe, heel), since there's no curvature to approximate
away. (Section 7.3's helical case used to lean on the same "dense straight patches
converge" idea and turned out, by measurement, not to: OpenCASCADE's loft does not
pair profile points one-to-one between stations. That hazard belongs to the loft
operation, not to the two-station proof above, but it has not yet been measured for
the bevel tooth either -- see the end of 7.3.)

`actual_angle = heel_theta / cos(gamma)` is cross-checked two independent ways, not
just derived once: (a) at `gamma=90°` (crown/flat limit) the formula for the
*perpendicular offset direction*, `(cos(gamma), -sin(gamma))` in (radial, axial)
components, reduces to a pure axial `(0,-1)` — correct, since a flat crown gear's
addendum direction is purely axial; (b) integrating one full real revolution
(`actual_angle` sweeping `2*pi`) needs `heel_theta` (and therefore the flat/virtual
gear's own angular sweep) to cover `2*pi*cos(gamma)` — using exactly `z_v` teeth over
that fraction of the virtual gear's own full `2*pi` gives `z_v * cos(gamma) = z`
teeth, matching the real tooth count exactly and independently confirming the
`z_v = z/cos(gamma)` formula from section 8.1 rather than merely restating it.

### 8.3 Building the solid

`b` = face width (along the slant, heel toward toe): toe station `s = Re - b`. For
**each** of `z` real teeth (pattern by adding `k*360/z` to `actual_angle`, `k=0..z-1`,
real integer `z` this time — the virtual `z_v` was only for the flat tooth *shape*),
build the toe and heel 3D point loops (section 8.2) and loft `ruled=True` between
them — exact, per 8.2's straight-line result, so (unlike the helical case) two
stations suffice; more are used near the root fillet only if a future revision needs
extra robustness there. The root-cone blank (a revolve of `root_cone_profile`) is a
plain cylinder along the axis where bored, as for spur/helical.

Two things about that "exact" tooth loft turned out to matter in practice, both
found by measuring (`is_manifold`, body count, volume), not by eye:

- **A tooth's toe/heel loop is not a planar curve.** `actual_angle` (8.2) varies
  continuously as you trace flank -> tip -> flank -> root, so the loop is a genuine
  non-planar closed curve on the cone's surface — confirmed directly (a plain flat
  `Face` constructor rejects the wire as non-planar). `make_loft(..., ruled=True)`'s
  automatic end-capping silently fails on a non-planar boundary wire: it still
  returns *something* with a computed volume, so nothing raises, but the shell is
  actually open at both ends (`is_manifold` is False, and the reported volume for
  the open shell is wrong — about 33% low for a typical tooth, compared to the
  correctly-capped value). Fixed by capping both ends explicitly with a general
  filling face (one that accepts a non-planar boundary, unlike a flat one) and
  sewing the result into a proper closed solid.
- **Fusing z correctly-built teeth onto the blank is still not reliably robust.**
  Even with every individual tooth solid now genuinely manifold, OpenCASCADE's
  boolean fuse is not trustworthy for combining all of them into one body: a loop
  of sequential pairwise fuses can silently corrupt partway through for some
  z/module/bore combinations (traced by checking volume and body count after each
  fuse and finding it collapse mid-loop, after which every remaining tooth just
  becomes its own disconnected fragment); a single N-ary fuse is more robust but
  not universally so either (confirmed failing differently — an empty result, or a
  non-manifold one — on other combinations). Worm gears hit what looked like the
  identical class of problem (section 9.3) and, for a while, took the same fix
  here: don't fuse at all, return a `Compound`. Worm's later turned out to be a
  narrower problem than it looked — a single N-ary fuse (all threads unioned
  onto the core in one call, not fused in sequentially) was fast and reliable
  there, so worm now returns one true fused `Solid` — but that fix does NOT
  apply here: bevel's own N-ary fuse (the "more robust but not universally so"
  attempt above) was tried and genuinely fails differently on real cases, not
  just slowly. The solid stays a `Compound` of the blank plus each
  individually-built, individually-manifold tooth. The tradeoff: SolidWorks
  sees a multi-body part, not one fused solid (worm no longer has this
  tradeoff — see section 9.3).

A tooth's own on-axis (tangentially centered) addendum point, at the heel, must
land at exactly `R + ha*cos(gamma)` — the standard AGMA outside-diameter formula —
not beyond it. An earlier version of the underlying single-tooth construction
(`involute.single_tooth_polygon`, reused unchanged from section 5's machinery)
capped the tooth blank 5% oversized rather than exactly at the addendum radius,
so nothing trimmed the tip back down to the true circle; every tooth's addendum
land sat wherever that oversized blank edge happened to be instead, and — since
involute flanks narrow going outward — looked visibly more pointed than the
correct flat tip. Caught by comparing the tip radius directly against
`GearParams.addendum_radius`, not by eye (the effect is far easier to miss once
the tooth is wrapped onto a cone than it is on a flat profile).

## 9. Worm gears

A worm is, geometrically, a **screw**: a helical thread wrapped around a cylinder.
Unlike helical/bevel gears, a worm's tooth shape is not derived from the flat spur
machinery in sections 1-5 at all — its axial-section thread profile is a plain
**straight-sided trapezoid**, defined directly (§9.1). What *does* reuse existing,
already-validated code is the worm's mate: a worm/wheel pair is mathematically a
**rolled-up rack and gear pair**, so the wheel is exactly an ordinary helical gear
(§7) with the right module/helix-angle/hand — zero new tooth-shape code needed for
the wheel side, the same "reuse the validated flat machinery" principle bevel gears
used (§8).

### 9.1 Thread axial profile

In the `(u, v)` axial half-plane (`u` = axial position, `v` = radial offset from the
pitch radius, **positive = outward/addendum** — the worm's own natural sign
convention, not the cutting-tool convention `rack_cutter_tooth_points` uses
elsewhere in this project):

```
axial_pitch = pi * m                    distance between adjacent threads, along the axis
half_thick(v) = axial_pitch/4 - v*tan(alpha)   half-width of the trapezoid at height v
ha = ha* * m,  hf = hf* * m              addendum / dedendum, same coefficients as sections 1-5
```

A symmetric trapezoid: flat land at the tip (`v = +ha`), straight flanks at the
pressure angle `alpha` down to a small fillet (radius `rho = rho* * m`) tangent to
both the flank and the flat root land (`v = -hf`) — the fillet's tangent points and
arc are constructed the same "tangent circle between two known lines" way section
4's trochoid fillet is, just against straight flanks instead of a rolling curve
(a worm thread isn't generated by a hobbing rack the way sections 1-5's gears are —
it's already the rack-equivalent shape itself). The fillet's construction — centre on
the thread-*space* side of the flank, tangent length `rho·tan(45° − α/2)` from the
sharp corner, `rho` clamped so neighbouring fillets can't overlap on the land — is
exactly §10.2's, and the code is kept identical to `rack_tooth_profile`'s. It shared
that function's inverted-centre bug (see §10.2's history note), which on a worm was a
groove along both sides of the thread's junction with the core — the "fillet as a
merging geometry between the elements" that wasn't merging anything.

### 9.2 Sweeping the profile into a helix

`lead` = axial advance per full turn = `starts * axial_pitch` (`starts` = `z1`,
number of thread starts). The defining property of a helix: one full turn (`theta`
advancing `2*pi`) advances the axial position by exactly one lead. For a profile
point `(u, v)`, at rotation angle `theta` around the (Z) axis:

```
radial = pitch_radius + v
z = u + (lead / (2*pi)) * theta
x = radial * cos(theta),  y = radial * sin(theta)
```

A second (or third...) thread start is the same helix, offset by `phase = k * 2*pi
/ starts` around the axis. **Checked, not assumed, where phase belongs**: applying
it as a pure rotation of the already-computed `(x, y)`, *after* `z` is derived from
`theta` alone, is the only placement that keeps every thread start centered on the
same Z-range. An earlier version folded `phase` into `theta` before computing `z`
instead — algebraically tempting, since `theta` also drives the rotation — but that
makes `z` depend on `phase` too, shifting each additional thread's whole axial
span by `lead * phase / (2*pi)` (half the lead, for thread 2 of a 2-start worm).
Caught by checking the built solid's bounding box against the requested length and
finding it asymmetric — a `test_worm.py` regression test now checks this directly
(all threads' Z-extents agree).

`lead_angle`, the angle between the thread and a plane perpendicular to the axis:

```
tan(lambda) = lead / (pi * d1)         d1 = worm's own pitch diameter (specified
                                        directly -- unlike a normal gear, it is
                                        NOT derived from module * teeth)
```

### 9.3 The mating wheel, and the solid

The mating worm wheel is `wheel_gear_params()`: an ordinary helical `GearParams`
with `module = axial_module`, `helix_angle = lead_angle`, same `hand` — built with
the exact same code as any other helical gear (§7), not a separate "worm wheel"
code path. (v1 simplification: a flat-faced helical gear, not a true
throated/globoid wheel wrapped around the worm for full-length contact — still
correctly meshing in module/helix-angle/hand.) Center distance for a given wheel
tooth count is simply `pitch_radius(worm) + pitch_radius(wheel)`.

The solid is a core cylinder (at the dedendum/root radius, bored if requested)
boolean-fused with one ruled loft per thread start, built from many stations
around the helical sweep (§9.2) — dense enough per turn that the `ruled=True`
straight segments between stations converge to the true helix, the same "dense
sampling of an exact construction" principle sections 4 and 7 use — so the
thread actually merges into the shaft as one continuous body, the join a real
machined/printed part would have, not a separate piece that merely touches it.

**Found by measuring, not assumed, and revised once already** (worth recording
the correction, not just the current answer): an earlier version returned a
`Compound` of the unfused core + thread solids, reporting that OpenCASCADE's
boolean fuse hangs indefinitely (10+ minutes, killed rather than left running)
when unioning multiple spiral thread solids together. That measurement was
real but the diagnosis was incomplete — it only tested SEQUENTIAL pairwise
fusing (`core.fuse(thread1).fuse(thread2)...`), which genuinely does hang:
fusing a second thread onto an ALREADY-spiral-shaped result is the slow
"spiral-vs-already-spiralled" case. A single N-ary fuse — `core.fuse(*threads)`,
every thread passed to ONE call — resolves all the intersections together and
is fast (timed across starts=1..4 and two lengths: consistently a few seconds,
worst case ~11s for a 60mm-long worm), so the Compound workaround is gone and
`build_worm_solid` now returns one true fused `Solid`. (Bevel gears hit what
looked like the identical problem — §8.3 — but there the N-ary fuse genuinely
does fail on real cases, not just slowly; that's a narrower, unrelated
failure mode and bevel's own Compound tradeoff stands on its own.)

## 10. Racks

A rack is a gear whose pitch radius has gone to infinity: the pitch circle becomes
a straight pitch **line**, and — this is the whole reason a rack is useful, not just
a curiosity — the involute of a circle whose radius has gone to infinity degenerates
to a **straight line** inclined at the pressure angle. This isn't an approximation
taken *because* a rack is simple; it's the exact reason involute gears can be cut by
a straight-flanked hob or rack cutter at all (`rack_cutter_tooth_points`, used
throughout sections 1-9, already *is* this fact in action — it just wasn't, until
now, exposed as a gear family in its own right).

### 10.1 The flank is exactly straight — proved, not assumed

Take `involute_point(rb, t) = rb*(sin(t) - t*cos(t), cos(t) + t*sin(t))` and the
radius of curvature of that curve at parameter `t` is `rb*t` (a standard result for
the involute — arc length from `t=0` is `rb*t²/2`, and the curve's radius of
curvature is arc-length-derivative-related to exactly `rb*t`). Holding the point's
*height above the pitch line* fixed (physically, the fillet-to-tip band a real tooth
uses) while `z → ∞`: `rb = m*z*cos(alpha)/2` grows without bound, so **the radius of
curvature at that fixed relative height grows without bound too** — the flank
literally straightens out in the limit. Section 10's own cross-check (§13.11) does
this numerically: an independent 3-point circle fit on `involute.py`'s own
closed-form flank, at increasing `z`, confirms the fitted radius diverges (not just
"gets large") as `z` grows.

### 10.2 The tooth itself

Circular pitch `p = pi*m` and tooth thickness `s = pi*m/2 - backlash` — *unchanged*
from a gear's own formulas (§1, §2), because both are already independent of `z`:
`p = 2*pi*R/z = 2*pi*(m*z/2)/z = pi*m` for *any* `z`, so no limit is even needed
there, unlike the flank. Addendum `ha = ha**m` above the pitch line, dedendum
`hf = hf**m` below it, and a root fillet tangent to both the flank and the flat root
land — the same "tangent circle between two known lines" construction section 9.1's
worm thread uses, since a rack tooth and a worm thread's axial section are the exact
same shape (`rack.py`'s `rack_tooth_profile` is a direct adaptation of
`worm.thread_axial_profile`, just parametrized by the rack's own circular tooth
thickness instead of a quarter axial pitch).

The fillet is a circle of radius `rho = rho* · m` tangent to both the flank and the
root land, **with its centre on the tooth-space side of the flank** — which side is
the whole fillet. In the `(u, v)` frame (`v` positive outward, tooth half-width
`half_u(v) = s/2 − v·tan α`):

```
v_c    = -hf + rho                               centre: rho above the land
u_c    = half_u(v_c) + rho / cos(alpha)          ... and a perpendicular rho outboard of the flank
p_root = (u_c, -hf)                              foot on the land
p_tan  = (u_c - rho*cos(alpha), v_c - rho*sin(alpha))   foot on the flank (angle alpha - 180deg on the circle)
arc    = p_tan -> p_root, counter-clockwise, sweep 90deg - alpha
```

The sharp corner it replaces is `(half_u(−hf), −hf)`, a distance `rho·tan(45° − α/2)`
from each tangent point — the textbook tangent length for a fillet in a corner of
interior angle `90° + α`. The self-tests and the pytest suite compare the *built
points* against that formula (and check: centre on the space side, landing point
outboard of the corner, half-profile only ever widening on the way down, solid
material under the arc by point-in-polygon on the real union, the centre itself in
air) rather than against the construction's own variables. The arc is concave as
seen from the space, so the tooth flares into the land. `rho` is clamped to
`(p/2 − s/2 − hf·tan α)·cos α / (1 − sin α)`, where neighbouring fillets would meet
at the land's midpoint (a full-round root), instead of letting them overlap.

*History, because the mistake is easy to make again:* until 2026-09-10 the centre was
on the **tooth** side (`u_c = half_u(v_c) − rho/cos α`, flank tangent point at angle
`+α`). That is the correct placement for the convex *tip* rounding of the generating
cutter in §4.2 (the radius is on the tool; its sweep then generates a gear's concave
root fillet), and this code descends from that function — for a tooth's own root it is
inverted. It rounded the tooth's base corner off and then curled the arc back under
the tooth, so the outline landed `rho·tan(45° + α/2)` *inboard* of the sharp corner
(1.09 mm at module 2) with a quarter-round groove of air beneath every tooth. Every
check that had been run passed on it — validity, simplicity, segment crossings,
manifoldness, "matches the hand-calculated points" — because it is a perfectly valid
polygon of the wrong shape; only a material probe (is the point just above the land,
outboard of the arc's landing point, inside the outline?) told the two apart. Two
symptom-level "fixes" (a monotonic clamp on `u`, then a rack-only camera angle to hide
the groove's silhouette at the end teeth) were retracted with the real fix.

This tooth is **not** the same shape as `rack_cutter_tooth_points` (section 4's
generating rack *cutter*) produces, despite both being straight-flanked racks —
confirmed by inspection, not assumed: the cutter's own "tip" reaches down to the
*workpiece's dedendum* depth (`rack_tip_depth = (hf*-x)*m`, so the tool can carve a
properly deep root), and its far "back" edge is an arbitrary 3-module margin, well
past where a real rack tooth's own addendum would end. A standalone rack gear needs
its *own* addendum/dedendum, not the cutting tool's — the same reasoning
`worm.py`'s own docstring already gives for why it writes its thread profile fresh
rather than reusing that function.

### 10.3 The solid, and mounting holes

`z` copies of the tooth (`rack_tooth_profile`, shifted by one circular pitch each)
plus a backing bar, combined the same way `full_gear_polygon` builds a whole spur
gear cross-section: as a shapely **union** of the individual pieces, not by manually
stitching boundary points edge-to-edge — robust against exactly the kind of
"does this segment actually connect to the next one" bug hand-stitching risks.
Extruded along `face_width_mm` (the same axis a mating gear's own face width runs
along); through-holes for mounting bolts, one per tooth pitch through the backing
bar, are a straight extrude-and-subtract, the same construction a normal gear's bore
uses.

## 11. Internal (ring) gears

An internal gear has its teeth cut into an annular ring, pointing **inward**, and
meshes with an external pinion running *inside* it — a real, checkable consequence
of this: the ring and the pinion inside it turn the **same direction** (unlike any
two external gears, which always turn opposite ways). The involute flank math is
identical to an external gear's own (same base circle `rb = R*cos(alpha)`), reusing
`single_tooth_polygon` completely unchanged as the *cutter's* tooth shape (exactly
like bevel gears reuse it for their own non-integer-z tooth, §8.1) — what's
genuinely new is the **generating kinematics**.

### 11.1 Shaping kinematics: a cutter's pitch circle rolling inside the ring's

Real internal gears are *shaped*, not hobbed — a rack (infinite radius) can't reach
inside a ring, so an external pinion-shaped cutter is used instead, its pitch circle
rolling without slip along the **inside** of the workpiece's own pitch circle.
Unlike rack generation (§4, where the rack translates), both axes are **fixed** in
space here: center distance `d = R - rc` (an internal mesh subtracts radii; an
external mesh, §7 and any two ordinary gears, adds them), and because `rc < R` the
geometric contact point between the two pitch circles is itself a fixed point in
space, not one that travels as the parts turn.

Rolling without slip at that fixed contact point requires matching arc length,
`rc*theta_c = R*theta_w`, with `theta_c` and `theta_w` carrying the **same sign** —
the same-rotation-direction fact above, falling directly out of the kinematics
rather than assumed independently of it. For a cutter-local point `(px, py)`
(cutter axis fixed at `(0, d)` in the fixed frame, cutter itself rotated by
`theta_c` about that axis) mapped into the ring's own rotating frame (ring axis at
the origin, rotated by `theta_w`):

```
theta_c = (R/rc) * theta_w
(sx, sy) = rotate((px,py), theta_c) + (0, d)          cutter-local -> fixed frame
(rx, ry) = rotate((sx,sy), -theta_w)                  fixed frame -> ring's own frame
```

**Checked directly, not assumed from the construction**: rolling without slip means
a cutter-material point instantaneously *at* the contact location must have exactly
**zero velocity relative to the ring's own frame** — the literal definition of
rolling contact, and the check that actually pins the sign of `theta_c` down (get it
backwards and this same construction would put the two gears turning opposite ways,
which is wrong for an internal mesh but would still *look* plausible without this
specific check). Confirmed by finite difference before anything else in this section
was built on top of the transform, not after: `(x(theta_w=+eps) - x(theta_w=-eps)) /
2*eps -> 0` as `eps -> 0`, to floating-point noise.

### 11.2 The cutter's own addendum/dedendum are swapped

The shaper cutter's tooth uses this ring's own module and pressure angle, but with
addendum and dedendum coefficients **swapped**: the cutter's tip (its own addendum)
is what reaches the ring's *deepest* cut — the dedendum, the farther-out root circle
— and the cutter's own root (dedendum) is what stops short at the ring's addendum
(tooth tip, the nearer-in circle). The same "cutter tip cuts the workpiece's
dedendum" relationship section 4's rack cutter already has
(`rack_tip_depth` uses `hf*`, not `ha*`), just for a gear-shaped cutter instead of a
rack-shaped one.

**The fundamental law of gearing** — the generated flank shape must not depend on
which cutter tooth count did the generating, since `cutter_teeth` is a construction
parameter only, not a property of the finished ring — is checked directly: the same
ring generated with three different `cutter_teeth` values must match the
closed-form involute to the same tight tolerance in every case (§13.14), not merely
each individually "look about right."

### 11.3 The solid

An annulus from `addendum_radius` (tooth-tip circle, the bore-ward boundary) out to
an outer rim, with `z` tooth gaps cut by the cutter sweep patterned around — the
same `blank.difference(all_gaps)` structure `full_gear_polygon` uses for an external
gear, just with an annulus instead of a plain disk for the blank. Built from a plain
outer circular wire plus a *genuinely separate* inner toothed wire
(`bd.Face(outer_wire, [inner_wire])`) — checked, this time by measuring rather than
looking at a render at a scale where it wouldn't have been obvious: an earlier
version of this recipe silently produced a **solid disk with no bore at all**, its
volume within 0.1% of the holeless figure. The fix, and the regression test
(§13.15), both compare the built solid's volume against a plain holeless disk of the
same outer dimensions and require it to be *meaningfully* smaller, not just
different.

## 12. Spiral and hypoid bevel gears — not implemented; this is the plan

Deliberately **not built**, on the judgment that a version worth trusting needs more
than this pass had time for — and that writing that down honestly is worth more than
shipping something plausible-looking that turns out wrong, which is exactly what
happened once already with straight bevel gears earlier in this project (two real
geometry bugs, found only by actually rendering the solid and measuring it — see
PROGRESS.md). This section is the reasoning and the math, kept for whoever picks it
up next.

### 12.1 Why straight bevel's approach doesn't extend

Section 8's Tredgold approximation works by unrolling the back cone into a **flat**
virtual spur gear, wrapping that flat tooth shape onto the real cone, and tapering
linearly heel-to-toe — a pure coordinate transform on an already-flat, already-valid
involute tooth. It's exact enough to be the real industry method for **straight**
bevel gears specifically because a straight bevel tooth's own generator (an imaginary
crown/flat gear) doesn't itself need any curvature along the face width — the tooth
lies in radial planes through the cone apex.

A spiral bevel tooth does not: its whole purpose is a curved (commonly circular-arc,
in the classic Gleason system) lengthwise tooth trace, which changes the contact
pattern and lets teeth engage gradually instead of across their whole length at
once (quieter, more load capacity — why spiral bevel is the real-world default over
straight bevel outside of low-speed/low-cost applications). That curvature is not a
coordinate transform on a flat tooth; it comes from the actual **kinematics of the
cutting machine** — a rotating circular cutter head, itself offset and tilted
(cradle angle), generating the tooth as a *real* three-dimensional motion, not
foldable back onto a 2D construction the way straight bevel's cone-unwrap is.

### 12.2 What a correct implementation would actually need

1. **Cutter-head kinematics**: a circular cutter (face-mill or face-hob) of a
   chosen radius, generating the tooth surface as the envelope of its cutting edges
   swept through the cradle's rotation — this is a genuine 3D generation process
   (structurally closer to section 11's shaper-cutter envelope than to section 8's
   flat-tooth wrap), not a formula applied to an already-known flat shape.
2. **Two more free parameters than straight bevel has**: spiral angle (the
   mean tooth-trace angle, analogous to a helical gear's helix angle but varying
   along the face rather than constant) and cutter radius (or, in the hypoid case, an
   offset between the two axes — hypoid gears' axes don't even intersect, unlike
   every other family in this project, which breaks several assumptions sections
   1-11 all share about a common apex or a pair of coplanar axes).
3. **A real validation target**: sections 1-11 each had an independent
   closed-form or classical result to check the generated geometry against
   (the closed-form involute, the classical undercut cutoff, the AGMA outside-
   diameter formula, a from-scratch rolling-contact velocity check). Spiral
   bevel's equivalent would be checking the generated tooth against the
   published Gleason summary-of-cut equations for a chosen cutter radius and
   spiral angle — necessary before trusting a generated tooth shape at all,
   and not yet sourced.
4. **Hypoid's axis offset specifically** changes the pitch surfaces from cones to
   hyperboloids of revolution — a further, separate generalization beyond spiral
   bevel with intersecting axes, and not needed at all if only spiral (intersecting-
   axis) bevel gears are actually wanted.

Given the size of 1-3 alone, a first real attempt should almost certainly target
plain spiral bevel (intersecting axes) only, and treat hypoid as a distinct,
later extension once spiral bevel's own cutter-head kinematics are implemented and
validated against a known cut.

## 13. Cross-checks every implementation must pass

1. `z=20, m=2, alpha=20°, x=0` produces **no** undercut (root fillet stays a smooth
   tangent curve above `rb`).
2. `z=8, m=2, alpha=20°, x=0` **does** show undercut (root radius dips inside `rb`,
   flank pinches in below the base circle) — matches `z_min = 17` at 20°/`x=0`.
3. Tooth thickness at the pitch circle, measured on the generated profile, matches
   `s` from §2 to within numerical tolerance.
4. Metric and inch inputs that resolve to the same `m` produce byte-identical
   geometry (inch path is a pure unit conversion at the boundary, nothing else).
5. A worm's `lead_angle` formula (§9.2) matches the standard `tan(lambda) =
   z1*m/d1` identity (substituting `lead = z1*pi*m`) to numerical tolerance.
6. A multi-start worm's built solid has every thread's Z-extent equal to (and
   centered on) the requested length — the regression test for the phase/lead bug
   described in §9.2.
7. A worm's full solid build (all thread starts) completes quickly (seconds, not
   minutes) and its bounding box's radial and axial extents match the requested
   addendum radius and length — the regression test for the boolean-fuse hang
   described in §9.3.
8. `single_tooth_polygon`'s tooth tip lands at exactly `GearParams.addendum_radius`
   (both for an integer and a non-integer virtual tooth count) — the regression
   test for the oversized-blank bug described in §8.3.
9. A bevel gear's built solid has exactly `z+1` bodies (the blank plus one per
   tooth, none dropped or merged) and every body is individually manifold, across
   several different z/module/bore/shaft-angle combinations — the regression test
   for the loft-capping and fuse-robustness bugs described in §8.3.
10. A rack's flank angle, measured directly on the generated tooth, matches the
    pressure angle exactly (§10.1) — not approximately, since it's constructed as
    a literal straight line, not sampled from a curve.
11. An independent numerical 3-point circle fit on `involute.py`'s own closed-form
    flank shows the radius of curvature strictly increasing, and diverging (more
    than 50x over a 64x increase in `z`), confirming the rack limit (§10.1) against
    the gear formula it's a limit of, not just against the rack module's own math.
12. A rack's built solid is manifold with exactly one body across several
    z/module/backing/bore combinations (the same class of check §8.3's bugs were
    found by, applied to the family that hadn't had it yet).
13. An internal gear's rolling-contact transform (§11.1) gives a contact-point
    velocity, relative to the ring's own frame, of zero to floating-point noise —
    the check that pins the transform's sign, found before anything else in that
    module was built on top of it.
14. An internal gear's generated flank matches the closed-form involute of its own
    base circle to <0.05° over many sampled points on one isolated flank, **and**
    that match holds independently of which construction `cutter_teeth` value
    produced it (the fundamental law of gearing, §11.2) — checked by generating
    the same ring three different ways and confirming they agree with each other,
    not just that each individually looks right.
15. An internal gear's built solid is manifold with exactly one body, and its
    volume is meaningfully less (not just "less") than a bore-less disk of the same
    outer dimensions — the regression test for the silent-missing-bore bug
    described in §11.3.
