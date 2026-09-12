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
  re-aligning wires and shearing the surface in between (the mechanism was
  pinned down later, in §16: OpenCASCADE's `ThruSections` vertex-compatibility
  check, which build123d leaves on, re-pairs a rotated section's vertices by
  proximity; with it off the same six sections loft to 8.6 µm ruled and
  0.0 µm smooth);
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

### 7.5 Crossed-helical (screw) gear pairs

Two helical gears on non-parallel, non-intersecting shafts. Each member is exactly
§7's helical gear — nothing changes in the tooth — so what the pair adds is the
relationship between the two and their placement:

```
Sigma = beta1 + beta2        same hand (the usual case); Sigma = |beta1 - beta2| for opposite hands
m_n, alpha_n                 common to both members (NORMAL quantities)
d_i = m_n * z_i / cos(beta_i)        a = (d1 + d2) / 2        ratio = z2 / z1
```

The ratio does not depend on the helix angles (unlike a worm pair, §9), and the pitch
cylinders touch at a single point on the common perpendicular of the axes, so contact is
a point — the reason screw gears carry little load, and the reason the mesh is fully
fixed by the numbers above plus the tooth phase at that point. Given gear 1's `beta1`,
hand and the shaft angle, `beta2 = Sigma − beta1`: positive → same hand; negative →
gear 2 takes the opposite hand with `|beta2|`; zero → gear 2 is a spur gear.

**Placement** (`crossed_helical.build_crossed_helical_pair`). The common perpendicular
is the Y axis: gear 1 on Z centred at the origin, gear 2's centre at `(0, a, 0)`, the
pitch point `P = (0, r1, 0)`. Each gear is centred on its mid-face and turned by minus
half its twist, so its mid-face profile sits in the "tooth centred on +Y" frame the
outline is generated in (§5): gear 1 presents a tooth to P, and gear 2 must present a
space on its −Y side — automatic for odd `z2`, half a pitch of extra rotation for even.
Gear 2 is then rotated about Y by `theta = −Sigma` for a right-hand gear 1 (`+Sigma`
for left), which is derived rather than assumed: with §7.3's convention a right-hand
profile turns counter-clockwise with `z`, so gear 1's tooth trace at P runs
`(−sin β1, 0, cos β1)` and gear 2's on its −Y side runs `(sin β2, 0, cos β2)`, which the
Y rotation turns into `(sin(β2 + θ), 0, cos(β2 + θ))`; the two traces must coincide, so
`β2 + θ = −β1`. The same `θ` falls out for an opposite-hand gear 2.

Checks (`tests/test_crossed_helical.py`): the formulas against hand-computed numbers
(45/45 at 90°, 30/60 at 90°, an opposite-hand 45° vs Σ = 30°, a spur gear 2 at Σ = β1);
gear 2's centre at `(0, a, 0)` with its vertices spanning exactly `b` along the placed
axis; **no interpenetration** — the boolean intersection of the correctly placed pair
is below 2·10⁻⁴ of a gear's volume while the same pair with gear 2 turned half a pitch
shows a collision at least 20× larger, so the check is known to be able to fail; and
the two-body STEP round-trips as two solids of the right total volume.

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

### 10.4 Helical racks

A helical rack is the straight rack with its teeth inclined by the helix angle `β` to
the face-width direction — the rack a helical gear of normal module `m_n` meshes with.
Everything is decided in the **transverse** section (the plane of the rack's length
`u` and depth `v`, i.e. the plane of §10.2's outline), which is a straight rack of
transverse module and pressure angle

```
m_t = m_n / cos(beta)        p_t = pi * m_t        tan(alpha_t) = tan(alpha_n) / cos(beta)
```

with tooth depths and the root fillet still on the normal module (`ha = ha*·m_n`,
`hf = hf*·m_n`, `rho = rho*·m_n`) — the same normal/transverse split as §7.1–7.2. The
solid is that outline extruded *obliquely*: the layer at height `z` is the outline
shifted along `u` by `shear·z`, `shear = ∓tan β` (sign below). A shear is exact, so
the transverse section at every height is the outline to machine precision, the tooth
trace is a straight line at `β` to the `z` axis, and the tooth thickness measured
perpendicular to that trace is `s_t·cos β = π·m_n/2`. The sheared prism is clipped
back to a square-ended bar of length `z·p_t` by intersecting with a box, after
building the outline with enough extra teeth to cover the shear; mounting holes stay
square to the bar. `β = 0` reduces to §10.1–10.3 unchanged.

**Hand.** A rack is a gear of infinite radius with its teeth on top. §7.3's convention
rotates a right-hand gear's profile counter-clockwise as `z` increases, which carries
the tooth at the top of that gear toward `−x`; so a right-hand rack's teeth drift
toward `−u` with `z` (`shear = −tan β`) and a left-hand rack's toward `+u`. A
right-hand rack meshes with a **left**-hand pinion of the same `m_n`, `α_n`, `β` — the
same opposite-hands rule as two external helical gears.

Checks (`tests/test_rack.py`): sections of the built solid at two heights match the
shifted transverse outline to 1 µm (both hands, including a face wide enough that the
shear exceeds a pitch), the bar is exactly `z·p_t` long and `b` tall; the pitch-plane
section's tooth parallelogram gives the normal thickness `π·m_n/2` and the transverse
`π·m_t/2` to 1 µm; the transverse flank angle is `α_t`; the hand sign is derived from
`GearParams.twist_total_rad` rather than restated; manifold with holes at 20° and 35°.

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

### 11.4 Planetary (epicyclic) sets

A sun, `n` equally spaced planets on a carrier, and a ring around them. Every member
is an existing gear — §1–6 for the sun and planets, §11 for the ring, all of one module
and standard depth — so the set adds only relationships and placement
(`planetary.py`):

```
z_r = z_s + 2 z_p                 the ring closes over the planets
a   = m (z_s + z_p) / 2           sun-planet centre distance; ring-planet is the same, r_r - r_p = a
(z_s + z_r) / n  integer          n equally spaced planets can all mesh (assembly condition)
2 a sin(pi/n) > m (z_p + 2 ha*)   adjacent planets clear each other
ratios   ring fixed (sun in, carrier out)   1 + z_r/z_s
         sun fixed (ring in, carrier out)   1 + z_s/z_r
         carrier fixed (star gear)          -z_r/z_s
```

The ring is generated with the planet itself as the cutter (`cutter_teeth = z_p`), so
it is exactly conjugate to what runs in it.

**Phase.** Every outline is generated in the "tooth centred on +Y" frame (§5); the ring
is generated by a cutter tooth centred on +Y, so the ring has a *space* there. Planet 0
sits on +Y with the sun below it and the ring above. An odd planet has a tooth on its
+Y side (facing the ring's space) and a space on its −Y side (facing the sun's tooth)
— no adjustment. An even planet has teeth on both sides, so the *sun* is turned half a
pitch to present a space. Planet `k` is the planet-0 configuration carried round by
`Delta_k = 360k/n`; but the real sun and ring did not turn with it. Turning the carried
sun back to the real one is a rotation of `−(Delta_k mod p_s)` (any whole pitches are
invisible), which through the external mesh spins the planet by
`(Delta_k mod p_s) · z_s/z_p`; the ring's own correction, `−(Delta_k mod p_r)` through the
internal mesh, spins it by `−(Delta_k mod p_r) · z_r/z_p`, and the two agree modulo a
planet pitch exactly when `k (z_s + z_r)/n` is an integer — which is what the assembly
condition says.

Checks (`tests/test_planetary.py`): the formulas against hand-computed numbers and a
failing assembly case; **no interpenetration** of any planet with the sun or with the
ring (3 odd planets, 4 even planets, 5-planet case) while planet 0 turned half a pitch
collides with both — so every carried planet's spin, the even-planet sun shift and the
ring's frame are verified by a check that can fail; planets clear each other and sit at
`a`; the multi-body STEP round-trips with `n + 2` solids.

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
16. Every multi-member family (screw pair §7.5, planetary set §11.4, cycloidal pair
    §14) is checked by the *boolean intersection* of its members as placed: (near)
    zero for the correct placement, and a clear collision for the same members with
    one of them turned half a pitch — so each test is known to be able to fail.
17. A cycloidal gear's profile normals pass through the rolling circle's instantaneous
    contact point at every sampled parameter on both curves (§14) — the fundamental
    law of gearing checked on the curves themselves.

## 14. Cycloidal gears

The tooth form of clock and instrument gearing (`cycloidal.py`): above the pitch
circle the flank is an **epicycloid**, below it a **hypocycloid**, both traced by one
rolling (generating) circle of radius `r_g` rolling on the pitch circle — outside it
for the addendum, inside it for the dedendum. There is no pressure angle and no base
circle; the rolling circle *is* the tooth-form parameter.

```
R = m z / 2
epicycloid    p(t) = (R + r_g)(cos t, sin t) - r_g (cos k t,  sin k t),   k  = (R + r_g) / r_g
hypocycloid   p(t) = (R - r_g)(cos t, sin t) + r_g (cos k't, -sin k't),   k' = (R - r_g) / r_g
```

Both start at the pitch point `(R, 0)` at `t = 0`; `t` is the angle of the rolling
circle's centre about the gear centre, and the rolling circle touches the pitch circle
at `(R cos t, R sin t)`. The epicycloid's radius rises monotonically from `R` to
`R + 2r_g` over `t ∈ [0, π r_g/R]` and the hypocycloid's falls from `R` to `R − 2r_g`
over `t ∈ [−π r_g/R, 0]` (cusps every `2π r_g/R`), so the tip and root crossings are
found by bisection on those arcs. The right flank of a tooth of angular half-thickness
`s/(2R)` is the hypocycloid (`t ≤ 0`, inward and away from the tooth centre) joined to
the epicycloid (`t ≥ 0`, outward and toward the centre) at the pitch point rotated to
`−s/(2R)`; the left flank is its mirror; a tip land arc and a root arc close the wedge,
and `z` wedges are unioned with the root disk. Flanks that cross before the addendum
circle are trimmed to the crossing (a pointed tooth) rather than left self-crossing.

**Conjugacy.** Two cycloidal gears mesh exactly when each one's addendum was traced by
the rolling circle that traced the other's dedendum — in practice a pair shares one
`r_g` — and the centre distance is exactly `R_1 + R_2` (cycloidal gears, unlike
involute ones, are not tolerant of centre-distance error). The classic choice
`r_g = R/2` makes that gear's hypocycloid a straight radial line (the "radial flank"
clock pinion); the code's automatic value is that, and `r_g` is clamped to
`[hf/2, R)` so the hypocycloid can still reach the root and remains a curve.

Checks (`tests/test_cycloidal.py`): the **fundamental law of gearing on the curves
themselves** — at every sampled point of both curves the profile normal passes through
the rolling circle's contact point on the pitch circle (a sign or factor error in
either parametrisation fails this at once), for four `(R, r_g)` combinations; tooth
angular thickness `s/R` at the pitch circle, centred on +Y, thinned by exactly the
backlash; tip and root radii; the radial-flank special case (dedendum points collinear
with the centre at `r_g = R/2`, curved otherwise); valid polygons and manifold solids
for z = 6/12/40; **a conjugate pair sharing one rolling circle meshes with (near)
zero boolean interpenetration at the exact centre distance while a half-pitch phase
error collides** (12/18 and 8/24 at the automatic circle, 10/15 at a chosen one); the
STEP round-trips.

## 15. Cycloidal drives (hypocycloid speed reducers)

An eccentric input turns a lobed disc that rolls inside a ring of `N` fixed rollers
(pins); the disc has `N − 1` lobes and turns back by one lobe per input revolution, so
the reduction is `(N − 1) : 1`, with zero backlash and every roller sharing the load.
`cycloidal_drive.py`.

**The profile is derived, not copied.** The disc's pitch circle, radius `(N − 1)E`,
rolls inside the ring's, radius `NE` (centre distance `E`, the eccentricity), so when
the input carries the disc centre round by `φ` the disc turns by `θ = −φ/(N − 1)`. A
roller centre `P = (R, 0)` on the fixed ring then traces, in the disc's own frame,

```
u(phi) = Rot(phi/(N-1)) . (R - E cos phi, -E sin phi)        phi in [0, 2 pi (N-1)]
```

— a closed curve with `N − 1` lobes — and the disc profile is that curve offset
*toward* the disc centre by the roller radius `R_r`: the inner envelope of the roller
circles carried along it. The tangent is analytic, `du/dφ = Rot(β)·(J v/(N−1) + v')`
with `β = φ/(N−1)`, `v = (R − E cos φ, −E sin φ)` and `J` the quarter turn; setting it
to zero gives the cusp condition `E N = R`, so `E < R/N` is the design limit, and the
offset profile self-intersects wherever the curve's radius of curvature falls below
`R_r` (both are reported). Output: `N_out` pins fixed to the output shaft, coaxial
with the ring and turning with the disc's *rotation*, run in holes of diameter
`d_out + 2E` — the disc's orbit is exactly what the extra `2E` absorbs.

Checks (`tests/test_cycloidal_drive.py`): **the envelope property itself** — at eight
input angles, every one of the `N` rollers is tangent to the placed disc (its centre is
`R_r` from the outline to < 3 µm, neither penetrating nor lifted off), for three
`(N, R, R_r, E)` sets; a wrong sign anywhere in the kinematics, the offset direction,
the lobe count or the ratio fails this at the first angle. Also: `N − 1` radial maxima
and lobe height `2E`; one input turn moves the disc back exactly one lobe; the cusp
limit (curvature radius → 0 at `E = R/N`); output pins sitting exactly `E` from their
hole centres at every angle; a manifold disc whose volume matches its section; the
multi-body STEP round-trips with `1 + N + N_out` solids.

## 16. Spiral and zerol bevel gears

Section 12 argued against building spiral bevel gears without cutter-head kinematics.
What is built here is narrower than that and is stated as such: **the straight bevel
tooth of §8, swept along the classic Gleason circular-arc trace** — every station across
the face is the Tredgold section at that cone distance, turned about the axis by the
trace's offset there. It is the construction most parametric CAD generators use, and
its coherence is checked the way every pair in this project is checked, by boolean
interpenetration of a gear with its pinion in mesh (below); it does not reproduce the
lengthwise crowning a real Gleason cut carries for localized contact.

**Trace.** In the pitch cone's development — a flat sector with polar coordinates
`(s, φ_dev)`, `φ_dev = φ·sin γ` for the true angle `φ` about the axis — the trace is a
circle of cutter radius `r_c` through the mean point `M = (R_m, 0)` whose tangent there
makes the mean spiral angle `ψ_m` with the radial direction, centre
`C = M + r_c(−sin ψ_m, cos ψ_m)`:

```
sin psi(s) = (s^2 - R_m^2 + 2 R_m r_c sin psi_m) / (2 s r_c)          Gleason's spiral angle at cone distance s
phi_dev(s) = atan2(C_y, C_x) - acos((s^2 + |C|^2 - r_c^2) / (2 s |C|))   the trace's offset from M
phi(s)     = ± phi_dev(s) / sin gamma                                   right-hand: the heel end counter-clockwise of M
```

`r_c = 0` means the mean cone distance (a common choice). A **zerol** gear is `ψ_m = 0`:
curved teeth, negative spiral angle at the toe, zero at the mean point, positive at the
heel. The section uses the transverse pressure angle `tan α_t = tan α_n / cos ψ_m` (the
user's angle is the normal one, as for helical gears); the module stays the outer
transverse module so pitch diameters are those of §8.

**Solid.** Each tooth is a smooth loft through `n` stations from toe to heel, driven
through OpenCASCADE's `ThruSections` directly with vertex-compatibility checking **off**,
so the stations' vertices pair by index. This matters: with the check on (build123d's
default) OCCT re-pairs the vertices of rotated sections by proximity and shears the
surface — measured on the helical gear as 359 µm, against 8.6 µm for a ruled and 0.0 µm
for a smooth loft with it off (the mechanism behind §7.3's finding). The smooth loft
also gives one face per profile edge rather than one per edge per station. Blank and
teeth stay separate bodies, for §8.3's fuse reasons.

**Pair.** The pinion has the same module, shaft angle, face width, spiral angle and
cutter radius and the opposite hand; both members share the apex and the outer cone
distance, so their traces coincide along the common pitch-cone generatrix. Placement
(`bevel.place_bevel_pinion`, shared with straight bevel): the pinion's axis is
`(sin Σ, 0, cos Σ)`; its own `−X` generatrix is the contact one, so it must show a space
there (half a pitch of spin for an even pinion); from rolling without slip along the
generatrix, `ω_pinion = −ω_gear·z_gear/z_pinion` about its own axis.

Checks (`tests/test_spiral_bevel.py`): the constructed trace's spiral angle by numeric
differentiation equals Gleason's closed form at toe, mean and heel (35°, 20°, 0°); toe
and heel stations are exactly §8's stations turned by the trace; a 10-station tooth's
loft passes through its stations to < 2 µm and through the *intermediate* stations of a
37-station build — points it never saw — to < 10 µm; blank + z manifold teeth, STEP
round-trip; and the pair check, solid by solid (`meshcheck.py` — as compounds the boolean
silently returns nothing for touching members): a 30/12 pair at 90° in mesh at three
rotation phases overlaps by less than 5·10⁻⁵ of the gear's volume while the pinion
turned half a pitch collides by more than 2·10⁻³ and 50× more — for 35° spiral, for
zerol, and (added with this work) for the straight bevel, which measures 0.12 mm³
(0.001 %) in phase and 111 mm³ mis-phased.

A side finding fixed on the way: the generating cutter's outline (§4.2) self-intersected
above ~23.5° pressure angle because its two tip fillets crossed (the tip land is 0.26 mm
at 20°, 0.013 mm at 23°, negative beyond) — so the 25° preset had been feeding an
invalid cutter to every family. `rack_cutter_tooth_points` now clamps the fillet to a
full-round tip, `ρ ≤ 0.999·flank_u(tip)/tan(45° − α/2)`, exactly as §10.2 clamps the
rack's root fillet.

## 17. Face gears

A spur pinion on an axis perpendicular to, and intersecting, the axis of a disc whose
teeth are cut into its face. The pinion's pitch cylinder rolls on the face gear's pitch
**plane**, so the face gear has no pitch cone or cylinder of its own: its tooth changes
shape along the radius — thinner and eventually pointed toward the outer end, undercut
toward the inner end — and its tooth surface is not a formula but the **envelope of the
shaper pinion's involute flanks** under the generating motion, the shaper turning by
`θ_s` about its own axis while the face gear turns by `θ_f = θ_s·z_s/z_f` (rolling
without slip at the nominal radius `R_0 = m·z_f/2`, where the pinion's pitch-circle speed
matches the face gear's: `ω_s r_s = ω_f R_0`).

### 17.1 The envelope, one radial station at a time

`face_gear.py` builds that envelope literally — the union of the shaper's positions, §4.3's
method — but in 2D, section by section, and lofts the sections. In the face gear's frame
the shaper at generating angle `φ` is spun by `φ` about its own axis and *carried* by
`ψ = −φ·z_s/z_f` about the face gear's axis, so the plane `x = R` (a radial station of
the ring) cuts its extruded outline in an **affine image of the transverse outline**:

```
y = R·tan ψ + y'/cos ψ,   z = z'          (y', z': the spun outline, laid along X)
```

— sheared and shifted by the carry angle, nothing more (the shaper is a cylinder along its
axis, and the station plane meets that axis obliquely). The union of a few hundred such
images, clipped to one pitch of the ring and the tooth-height band, is the *exact*
tooth-space section at that station, for a few milliseconds of shapely. Only the part
below the blank's top matters: above `z = h_a` the tool is just a strip over the space
itself (its walls leaning inward from the tooth-tip corners), which keeps every station's
boundary to the same four edges — that strip's top and two walls and **one sweep profile
from tooth-tip corner to tooth-tip corner** — so a loft through ten stations pairs them
by index (§16's ThruSections with compatibility checking off) into one B-spline face per
side of the space instead of one facet per sweep position: a six-face tool. It is
patterned `z_f` times and cut from the blank in one N-ary boolean — a revolve whose disc
inside the ring is relieved a fifth of a module below the space floor, so the floor
(tangent to the plane `z = −h_f` along the space centre) never touches a blank face; the
tool's flat ends, 0.3 mm inside and outside the ring, are in the air over that relief and
beyond the rim (the rim's cylinder bows in by at most 0.2 mm across the tool's width), and
below the blank's top each section is clipped to its own pitch wedge, so no tool can
reach a neighbour. The shaper is the pinion's own tooth form with the face gear's dedendum
as its addendum (so the pinion's tips clear the roots) and may have a few more teeth than
the pinion — the usual way to localize contact.

**Sweep range.** The bottom shaper tooth cuts until its tip rises out of the addendum
plane, at `T = acos((r_s − h_a)/(r_s + h_as))`, and the *neighbouring* tooth goes on
cutting the inner end of the same space — the undercut region — until one shaper pitch
later, so `φ` runs over `±(T + 2π/z_s)` plus a margin. A first version swept ±1.5 shaper
pitches and trimmed the cutter short of the half-pitch plane; the uncut material it left
at the inner end was found by the mesh check below (the pinion's neighbouring tooth
collided with it, 3.6 mm³ a side) — the kind of construction error only a
solid-against-solid test catches.

### 17.2 Design limits: undercut inside L1, pointed beyond L2

Litvin's limiting radii, here from the **rack-equivalent section**: at radius `R` the face
gear moves past the shaper like a rack at the shaper's equivalent pitch radius
`r_s' = r_s·R/R_0`, so the shaper's involute (base radius `r_s cos α`) works there at

```
cos α_R = cos α · R_0/R,   pitch line at z_p = r_s − r_s'   (above the face for R < R_0)
```

The tooth top, `h_a` above the face, is reached by the involute only while it lies within
the involute's reach from the pitch point, `h_a − z_p ≤ r_s' sin²α_R`; solving,

```
L1 = R_0 cos²α / (1 − h_a/r_s)
```

— inside it the shaper's non-involute fillet cuts the tooth tops (undercut). The top land
follows from the rack tooth thickness at the pitch line (the shaper's *space* width at
`r_s'`, i.e. its pitch there minus its tooth thickness) minus the two flanks' rise:

```
t_top(R) = 2 r_s' (π/(2 z_s) − inv α + inv α_R) − 2 (h_a − z_p) tan α_R
```

and `L2` is its zero (bisection; it falls monotonically). At `R_0` this is exactly the
standard rack's `πm/2 − 2m tan α = 0.843 m`. For the test's z = 40 / 20-tooth pinion,
m = 2: L1 = 39.25, L2 = 46.20 — a usable ring only 7 mm wide at ratio 2, which is why
face gears want high ratios. The **auto ring** is `[L1, L2]` with 10 % of the usable width
kept clear at each end; a hand-set ring is accepted as given, and the derived values
report both limits, the top land at each end of the ring, and warn when the ring crosses
a limit (the generated geometry then shows the undercut or the knife edge itself).

**Phase.** A spur gear from `build_gear_solid` has a tooth centred on its own +Y; after
the rotation that lays its axis along X its own +X points *down*, at the face gear, and a
tooth centre sits there only when `z` is divisible by 4 — so both shaper and pinion are
first spun so that a tooth centre is exactly at the bottom. The space generated at
face-gear angle 0 is then the one the pinion's bottom tooth enters at phase 0, and a
pinion turn of `δ` goes with a face-gear turn of `δ·z_p/z_f`.

### 17.3 Checks

`tests/test_face_gear.py`: the section formula is the standard rack at `R_0`, L1 is the
closed form, `t_top(L2) = 0`, the auto ring sits inside the limits and the sweep reaches
a shaper pitch past the exit angle; the space tool is one valid solid of a handful of
faces whose floor is at the shaper's addendum below the pitch plane and which stays
within the ring's margin; the built gear is one valid manifold body of a few faces per
space whose removed volume per space is within 50 % of a crude tooth-space estimate,
**whose measured top lands at both ends of the ring agree with `t_top(R)`** (the
rack-equivalent model checked against the exact envelope), and which round-trips as a
STEP file of a few megabytes at most; and **the pinion meshes through the built face
gear** — placed at four rotation phases a quarter of a pinion pitch apart it overlaps the
gear by less than 10⁻⁴ of its own volume (measured 0.012 mm³ of 11 800: 10⁻⁶, the
same as the ruled loft's 0.009), while turned half a pitch it collides by more than
5·10⁻³ and 50× more (measured 117 mm³) — both with the pinion's own tooth count as
shaper and with a 22-tooth shaper for a 20-tooth pinion. That one check fails if the
envelope, the kinematic ratio, the phase, the sweep range or the clearances are wrong,
and it did, twice, on the way here: the first cutter rotated the placed shaper about the
*global* X axis, 20 mm below its own, swinging it through the blank (spaces 1.8× too
wide); the second swept too little and trimmed too much (§17.1).

**Booleans, and why the tools must not touch.** Two earlier shapes of the same tool
broke the N-ary cut. Trimmed to exact half-pitch wedges, the 40 copies shared coincident
planar faces and the cut came back as an invalid two-solid shape; trimmed 0.005° short
of the plane (4 µm at the ring) they stopped sharing faces but left 40 pairs of parallel
planes 4 µm apart, and the general-fuse engine then returned a null shape in parallel
mode and took 140–196 s single-threaded. With the strip above the blank spanning the
space alone, neighbouring tools are a tooth's top land apart everywhere (touching at most
along the crest line of a pointed tooth, outside L2) and each tool only ever meets the
blank: one N-ary cut (23–27 s for z = 40 before the knot-vector fix below, 3–4 s after it), and cutting the same tools one after
another gives the same volumes to the last digit (the fallback if the N-ary result is
ever not one valid solid). The loft wobble noted above was found the same way — a
profile that included the long straight runs of a wedge-wide section let the
arc-length correspondence wander between features from station to station, and the
booleans on that surface disagreed with each other about the volume they removed. The
first attempt of all, a 3D boolean sweep of 40 shaper positions, had one facet per
position: ~16 000 faces and a 61 MB STEP file, against 6 faces per tool now.

**Knot vectors.** Six faces can still be enormous: interpolating each station's 120
profile points with the default chord-length parametrisation gave every station its own
knot vector, and the loft, which must express all twelve sections on one knot vector,
merged them into a ~1400-span surface per face — a 96 MB STEP file for one gear, and a
default `volume` that was 35 % low (the tessellated volume, the arbiter, was right).
The profile points are equally spaced along the arc, so every station is interpolated on
the same uniform parameter vector; the sections then share one knot vector, the loft
carries only the profile's own spans (an 82 × 12 control net for 80 profile points and
ten stations), and the N-ary cut drops from 23 s to 4 s. Two more measures in `export_face_gear_step` finish the job: the boolean's intersection edges come out with ~750 poles each and are re-approximated to 2 µm (`slim_edge_curves`, edge tolerance widened to match, surfaces untouched), and the file is written without pcurves (build123d's `export_step(write_pcurves=False)`; setting OpenCASCADE's static beforehand is overridden by that call) — 4.9 MB for the z = 40 gear, 48 000 control points, from 21.7 MB. A caution for future probes: OpenCASCADE's default
volume of a B-spline solid is only as good as its parametrisation (10 % low even on the
compact surfaces) — judge such a solid by its tessellation (`meshcheck.tessellated_volume`:
`export_stl` and the divergence theorem, 0.2 % of the exact boolean volumes here) — and
`VolumeProperties` with an explicit tolerance can crawl for minutes on a bad surface.

## 18. Sprocket wheels for roller chain

A sprocket carries no involute or other analytic flank of its own. Its one real
job is to seat a chain roller — a plain cylinder of the chain's own diameter — at
each pitch position without interference, and to hold the chain's straight, taut
free span from sliding as it enters and leaves the wrap. `sprocket.py`, per
ANSI B29.1 / ISO 606.

### 18.1 The pitch circle

*N* rollers, chain pitch *p*, connected by rigid pitch-length links: fully
wrapped and taut, they sit at the *N* vertices of a regular *N*-gon of side *p*,
so the pitch circle radius is the standard

```
R = p / (2 sin(pi/N))
```

unchanged whether the chain is ANSI-inch or ISO-metric. `SprocketParams.from_ansi_chain_number`
carries the standard single-strand chain-number table (#25 through #240: pitch
and maximum roller diameter, in inches, converted to mm) as reference defaults;
`chain_pitch_mm` / `roller_diameter_mm` can always be set directly instead.

### 18.2 Two wrong tooth shapes, and why

**First attempt — envelope of the roller's approach motion.** Every other
family in this project generates its tooth form as the envelope of a moving
generating element (the rack, the shaper, the Hindley worm's own straight
edge), verified by direct contact simulation, so the natural first move here
was the same: model the incoming roller as riding a straight line rolling
without slip against the pitch circle (exactly `involute.rack_point_to_gear_frame`,
with a roller disc — no offset, no profile — standing in for the rack's own
tooth cross-section) and sweep it through the roll angle. This does not apply
to a sprocket: once a roller is seated it moves **rigidly** with the sprocket,
with no further sliding to sweep, so there is no continuous generating motion
between engagements the way a hobbing or shaping cutter has one throughout. The
transient swing-in as a roller first engages is a real, separate effect (chain
"polygon action"), but it depends on which direction the chain approaches
from — and a sprocket's own tooth form cannot depend on that. That is exactly
why the real standard's tooth form is a fixed, direction-independent
construction (a seating arc plus a separately specified topping arc), not a
literal envelope.

**Second attempt — a plain circle at each vertex.** Correct for seating (a
roller of radius `roller_radius` nests in a circle of that radius, by
construction), but for realistic roller/pitch ratios two adjacent seat circles
never come close to touching at *any* radius — confirmed by scanning the
built profile's own top land over the seat circle's full radial extent and
finding its minimum bottoms out around one roller radius no matter where the
outside diameter is placed, not by argument. The result, rendered, is a plain
disc with round notches punched in it: every roller seats correctly, but there
is no tapering tooth between them, because nothing in the construction ever
narrows the remaining material as radius grows.

### 18.3 What works: a gap that widens outward

The fix is the mirror image of an ordinary gear tooth: material a gap removes
must **widen** outward from the root, so the material left between two
adjacent gaps — the tooth — narrows to a tip, just as an ordinary tooth's own
flank narrows outward from its base. `gap_polygon` builds this directly: the
seat circle (radius `seat_radius` = roller radius + a running clearance,
`clearance_mm`) handles the root exactly as before, blended (shapely union)
into a wedge whose half-width equals the seat radius where it meets the
circle and grows at a fixed rate — `flank_angle_deg`, the tooth's taper — out
past the outside diameter, so the blank's own outer circle, not the wedge,
cleanly bounds the tip. Patterned `z` times and subtracted from an
outside-diameter blank (`full_sprocket_polygon`), this produces a clean,
correctly-tapered sprocket profile at every flank angle tried (15–45°); 20°
is the default.

Outside diameter is a free design choice — nothing here pulls it to one
specific value the way an addendum coefficient does for an involute gear —
and the auto default follows the widely-published quick-reference
approximation `OD = PD + 0.8 * D_roller`, overridable directly.

### 18.4 Checks

`tests/test_sprocket.py`: the pitch diameter matches the closed-form
regular-polygon formula, for every table entry; the built profile is one
valid, simply-connected polygon whose rotation by one pitch angle reproduces
itself (z-fold symmetry) over four different tooth-count/chain combinations
spanning an order of magnitude in *z* (11 to 60) and two chain sizes; **a
real chain roller — diameter exactly `roller_diameter_mm`, no clearance
added — placed at every pitch position overlaps the built profile by
nothing beyond floating-point noise** (it seats with exactly the design
clearance and no more, the same "does the real mating part actually fit"
check every other family in this project runs), while the same roller
placed half a pitch off (squarely on a tooth) collides by more than 30% of
its own area; the tooth measured at the root is wider than the same tooth
measured near the tip, directly confirming the taper the construction is
built to produce; `root_clearance_mm` (chain pitch less two seat radii) is
shown to depend only on the chain, not the tooth count, and goes negative
only for a hand-set, physically nonsensical roller/pitch combination; the
solid is one valid manifold body that round-trips through STEP.

**v1 simplification, stated plainly**: this is a flat-plate (ANSI "type A")
sprocket — a toothed disc of `face_width_mm` with a central bore, no hub —
not a hubbed type B/C casting. The tooth form itself is derived, not
transcribed from the standard's own numeric tooth tables, and is checked
against the one requirement those tables exist to satisfy (a real chain
roller seats without interference and a mis-timed one collides), not
against the tables' exact arc radii; a specific certified/purchased
sprocket's outside diameter should be checked against its manufacturer's
own table (`outside_diameter_mm` overrides the auto value directly).

## 19. One roller-chain link

The repeating unit a sprocket (section 18) drives: an outer link (two plates,
two pins) pinned into an inner link (two plates, two bushings, two rollers)
-- ten parts per pitch length. `chain_link.py`.

### 19.1 The five part types, and the two things that make them a chain

The pin is a press fit in the outer plates and turns freely inside the
bushing; the bushing is a press fit in the inner plates and the roller turns
freely around it -- these two rotating pairs are what let a wrapped chain
articulate at every pitch as it goes around a sprocket, and they are the two
things this module actually builds and checks, not just asserts: a running
clearance (`running_clearance_mm`, default 0.1 mm radius) on both, and an
exact (zero-clearance, non-interference) nominal fit on the two press-fit
pairs.

Sizes not fixed by the chain's own two numbers (pitch, roller diameter) --
pin diameter, plate thickness, bushing diameter -- follow simple, stated
ratios of those two (pin = 0.5 x roller diameter, plate = 0.15 x pitch,
bushing = 0.85 x roller diameter), the same "reference default, freely
overridable" pattern as every other family's non-table-driven dimensions;
`ChainLinkParams.from_sprocket_params` builds a link sized to seat in a
*specific* `sprocket.SprocketParams` instance directly, pitch and roller
diameter shared exactly.

Plate shape: a stadium -- two equal-radius circular lobes around the pin (or
bushing) holes, joined by straight tangent sides (trivial for equal radii:
the tangent lines are just offset by the radius, no construction needed). A
real chain plate is usually waisted narrower in the middle to save weight (a
distinctive figure-8 silhouette); this is a stated v1 simplification, still
correctly holed and pitched. The roller is modelled solid (not as a tube
around the bushing with its own running clearance) -- the dimension that
matters for meshing, its outer diameter, is exact; its own bore is not
modelled.

### 19.2 A real, deterministic bug a validity check could not see

`_plate_solid` cuts two holes per plate -- `bd.Circle(r, mode=Mode.SUBTRACT)`
at each pin position -- by calling `.located(...)` on the already-built
Circle object to move it before subtracting. That does not work: a
`Circle(mode=SUBTRACT)` inside a `BuildSketch` context applies its boolean
the instant it is built, at the origin (wherever the *current* location
context puts it) -- `.located(...)` afterward only returns a relocated copy
of the object, it does not redo the subtraction there. Both holes landed at
the same position (the second exactly on top of the first, redundant), and
the position `chain_pitch_mm` away was left completely solid.

This is exactly the kind of bug the project's own validity/manifoldness
checks cannot see: a plate that is missing one of its two holes is still a
single, perfectly valid, perfectly manifold solid -- `is_valid` and
`is_manifold` both pass on the *wrong* shape, the same lesson the rack root
fillet inversion taught earlier in this project (a validity check confirms
the polygon is *a* polygon, never that it is the *right* one). It surfaced
here only because a pin, built independently and placed at exactly that
position, failed to pass through cleanly -- direct, physical interference
checking again catching what a shape-quality check cannot. The fix: wrap
each `Circle(...)` in its own `with Locations(...):` block, the pattern
this project already uses everywhere else a sketch primitive needs
placing away from the origin (`Locations` must wrap the primitive's own
construction, not chase it afterward).

A second, narrower thing this bug exposed: with the duplicate hole in
place, `meshcheck.interpenetration_volume(pin_at_x, one_of_the_two_
otherwise-identical plates)` returned a **false negative** (zero) for one
specific pairing while correctly reporting the real collision for the
other -- both plates had the identical defect, confirmed by direct
`is_inside` probes, yet only one pairing's boolean intersection came back
non-empty. Consistent with this project's standing note that OCCT's
booleans can silently return nothing on tangential/degenerate/duplicate
geometry (docs/gear-math.md's loft section, `meshcheck.py`'s own
docstring) -- worth remembering that an interpenetration check reporting
zero is not, by itself, proof of a clean fit when the geometry feeding it
is suspect.

### 19.3 Checks

`tests/test_chain_link.py`: the two pin centres, the two bushing centres and
the two roller centres are each exactly `chain_pitch_mm` apart; all ten
parts are valid manifold solids and the ten-body assembly is one valid
compound; every rotating pair (pin/bushing, bushing/roller) and every
press-fit pair (pin/outer-plate, bushing/inner-plate) has exactly zero
interpenetration; **the link's own roller, seated in a Sprocket built from
the same chain_pitch_mm/roller_diameter_mm, overlaps it by nothing beyond
floating-point noise at several pitch positions and collides by more than
10% of its own volume turned half a pitch onto a tooth** -- the real link
against the real wheel, both built by this project's own code, over two
different chain sizes; the assembly round-trips through STEP as ten solids.
