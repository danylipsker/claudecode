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
The solid is built (`build_gear.py`) by lofting **`ruled=True`** through `N`
copies of the same validated transverse profile, the k-th copy rotated by
`k/N * twist_total` and placed at `z = k/N * b`. `ruled=True` connects each
consecutive pair with a straight-line (ruled) surface patch -- and a helicoid
*is* a ruled surface, so straight patches between finely-spaced rotated copies
converge to the true helical flank, the same "dense sampling of an exact
kinematic construction" principle used for the root-fillet envelope in section
4.3. `N` is chosen from the twist magnitude (more twist -> more sections),
not fixed, so accuracy doesn't degrade for a large helix angle or wide face.

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
heel, the same "straight patches between stations, dense enough to be exact" principle
used for the helical twist (section 7.3), except here it's exactly two stations
(toe, heel) rather than many, since there's no curvature to approximate away.

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
  non-manifold one — on other combinations). The fix follows the same precedent
  worm gears already established for the identical class of problem (section
  9.3): don't fuse at all. The solid is a `Compound` of the blank plus each
  individually-built, individually-manifold tooth. The tradeoff is the same as
  worm's: SolidWorks sees a multi-body part, not one fused solid.

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
it's already the rack-equivalent shape itself).

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

The solid is a core cylinder (at the dedendum/root radius, bored if requested) plus
one ruled loft per thread start, built from many stations around the helical sweep
(§9.2) — dense enough per turn that the `ruled=True` straight segments between
stations converge to the true helix, the same "dense sampling of an exact
construction" principle sections 4 and 7 use. **Found by measuring, not assumed**:
the loft solids are combined as a `Compound`, *not* a boolean-fused `Solid` —
OpenCASCADE's boolean fuse hangs indefinitely (10+ minutes, killed rather than left
running) when unioning multiple spiral thread solids together, even though each
individual thread's own loft takes about a second; isolated by timing each stage
separately rather than guessing which step was slow. A `Compound` of the unfused
pieces sidesteps the hang entirely (effectively instant) and is still a fully valid
STL/STEP export — SolidWorks opens it as a multi-body part rather than one fused
solid, a documented, deliberate tradeoff (§ PROGRESS.md "Known limitations").

## 10. Cross-checks every implementation must pass

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
