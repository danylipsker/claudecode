# GEARS GENERATOR — status: v1 complete + helical/herringbone/screw-pair/planetary/cycloidal/cycloidal-drive/bevel/spiral-bevel/zerol/hypoid/face/sprocket/chain-link/timing-wheel/timing-belt/worm/rack/helical-rack/internal gears + real 3D viewer

## Timing belt and wheel fillets: the right senses (latest)

The user's two-line review after the hypoid landed: "check timing belts
fillets between body and teeth" and "check timing wheels fillets (they are
opposite to logic)". Both correct. `timing_belt.py`, docs/gear-math.md
§20.2.

- **What was wrong**: the fillet was an *opening* of the bare tooth
  trapezoid, which rounds all four of its convex corners -- including the
  two at the tooth base. At the base the tooth meets the belt body in a
  *concave* corner that a real fillet fills with material; rounding the
  trapezoid's base corners removes material there instead, so the tooth
  necked inward just before the body (T5: 1.92 mm wide at the base, 2.37 mm
  a fillet radius above it; GT2: 0.46 against 0.88). The pulley groove is
  that same shape plus clearance, so its mouth was *pinched* (T5: 8.89° at
  the OD against 9.27° just below) with overhanging land corners at the OD
  -- "opposite to logic" exactly.
- **The fix**: two fillets with opposite senses, each by the morphological
  operation that can only act in that sense. The tip fillet is an opening
  of the tooth *alone*, with its flanks extended well below the body line
  so the opening's rounding of the trapezoid's bottom corners happens out
  of sight inside the body. The root fillet is a closing of tooth ∪ body,
  which rounds only concave corners -- and the only concave corners there
  are the two where the flanks meet the body. `belt_tooth_profile` is the
  result above the body line within one pitch; the strip is the body plus
  one profile per pitch, and the pulley groove is that profile pushed out
  by the clearance, so the groove mouth flares with the belt's root fillet
  and the land tips come out rounded. Separate `tip_fillet_mm` /
  `root_fillet_mm` overrides; both derived rows show them.
- **Measured after**, all fifteen standards: base flared above the sharp
  root width (T5 2.85 vs 2.50), tip narrower than the sharp tip (1.39 vs
  1.75), the straight flanks exactly the trapezoid's (0.000 µm), width
  never increasing from body to tip; every groove widest at its mouth and
  monotone to the bottom (T5 10.79° at the OD → 8.73° at mid-depth).
- **Two smaller things on the way**: clipping the closed strip at v ≥ 0
  against a body line the closing returns at ±1e-17 left zero-area
  slivers (one standard invalid, another in pieces) -- snap to exactly 0,
  subtract the *identical* body box, then window; and a test that checked
  the *extent* of the added material was fooled by a zero-area appendix
  shapely's `difference` leaves along exactly coincident flanks -- the
  senses are now held by *area per zone* (added only in the root zone,
  removed only in the tip zone, nothing in between).
- **Checks**: `test_timing_belt.py` 28 → 33 (the senses per standard, the
  curvilinear roundedness as tip loss + root gain, the groove widest at its
  mouth); the earlier "rounded tooth lies inside the sharp one" claim is
  gone -- a correct root fillet lies outside it by construction. Suite
  166. Headless export + reset for wheel and belt pass; SolidWorks
  imports of both: wheel 13 s (fresh session), belt 4 s, native parts, 3D Interconnect off.

## Hypoid gears

The user sent two pictures -- a zerol bevel gear and a hypoid set -- with
"add these gear types too". Zerol was already in (the Zerol bevel card,
§16). Hypoid was the one big family left on the original wish-list; it is
in now: `hypoid.py`, docs/gear-math.md §21, the Hypoid card.

- **What a hypoid is here**: this project's spiral bevel gear, unchanged,
  driven by a pinion whose axis passes the gear's at the offset E instead
  of meeting it. Everything hypoid lives in the pinion.
- **Pitch geometry in closed form** (§21.1): with δ = ψ_g − ψ_p as the one
  unknown, the shaft angle gives `tan γ_p = cos δ / tan γ_g`, equal normal
  pitch at the mean point gives `r_p = r_g (n/N) cos ψ_g / cos ψ_p` (why
  the hypoid pinion is larger), and the offset reduces to one equation
  `E = sin δ (r_g cos γ_p + r_p cos γ_g)`, solved by bracketing. Checked
  by rebuilding the axis in 3-D: distance E to 1e-9, 90° to 1e-12, and the
  turn rate from equal tooth-normal velocities at the mean point -- a
  fourth condition, not used in the solve -- exactly N/n. E = 0 reduces to
  the spiral bevel pinion exactly. 6 mm on a 60 mm gear: pinion spiral
  35° → 46.9°, mean radius +20 %; the automotive-like 41/11 at E = 25:
  58° and +62 % -- the proportions design tables show.
- **The pinion is generated, not designed** (§21.2): no closed-form tooth
  surface is conjugate to a spiral bevel gear across an offset, so the
  pinion is the envelope of the real gear solid under the offset relative
  motion -- as the face gear is of its shaper -- with one gift from the
  geometry: planes perpendicular to the pinion axis are invariant under
  the pinion's own rotation, so per phase only the gear moves and the
  section is the static gear cut by a plane turned the other way. One
  tooth swept, sections unioned per station, one space lofted, patterned,
  N-ary cut, edges slimmed.
- **What it took to make that robust, all measured**: the real gear
  tooth's reach fades over the last half-millimetre at each end, so the
  pinion is generated from the gear tooth extended 20 % past its face
  (the same surface continued -- the real tooth lies inside it to
  0.0000 mm³ -- and what a cutter does to a real pinion); an inset face
  and point-wise extrapolation of the end sections were both tried and
  dropped (the latter 0.2-1.4 mm off: arc-length correspondence slides
  along the flank, §17's index-wander lesson). The tessellated union
  carries hairline slits, holes and spikes (160° reversals at the rim
  ends, a tool OpenCASCADE called invalid at export quality): a 10 µm
  close-then-open removes them, and smoothing the profile at σ = 30 µm
  before resampling keeps the gear's own 0.02 mm facets out of the pinion
  flank (0.25 → 0.008 mm³). A profile finder that took the first off-rim
  stretch it met made a degenerate tool from a single vertex a few tenths
  of a micron inside the rim; it takes the longest now. Crumbs under
  0.1 % are dropped after clipping, anything larger is an error. A
  `tessellate` with no triangulation (once in ~2000 sections) falls back
  to the face's wire.
- **Convergence**: sweep ridges go as the phase step squared and the loft
  needs eight stations; 240 × 8 at export quality meshes at **0.0084 mm³ =
  8.5e-7 of the gear** (mis-phased 97 mm³, four orders above), 42 s; the
  60 × 5 preview at 5e-6 in 9 s.
- **Checks** (`test_hypoid.py`, 12 tests; suite 161): the closed
  form re-derived in 3-D; E = 0 → spiral bevel; monotone growth with E;
  hand mirrors the side; impossible offsets refused with the reason;
  one valid n-fold-symmetric pinion; the pair meshes below the spiral
  bevel pair's own 5e-5 bar and collides half a pitch off; at E = 0 the
  family's own pinion teeth lie inside the generated pinion where both
  exist (the whole-solid comparison first written for this mistook a
  ~7 % blank-definition difference for tooth error); STEP round trip as
  z + 2 solids.
- **UI**: Hypoid card (pinion teeth, offset, gear spiral angle, cutter
  radius, hand), PINION / OFFSET derived rows (pinion pitch angle, spiral
  angle and radius against the bevel pinion's, offset as a fraction of the
  gear diameter, which side), names like `hypoid_z30x12_m2_e6_psi35R_pa20_fw8_bore10`,
  thumbnail, `--uismoke --hypoid`. The preview and the STEP are the pair
  in mesh. Headless export + reset both pass (the fresh-state 30/20 pair exports in 54 s to a 9.7 MB STEP; the first run's "done=False" was the harness's own 30 s export wait, sized for the face gear's 25 s -- now 180 s, plus a camera settle so a heavy mesh is not photographed mid-ZoomExtents); SolidWorks import
  of the 8.4 MB no-pcurve STEP: 20 s to a 5.1 MB native 32-body part, 3D Interconnect off.
- **Stated plainly**: a mean-point pitch-cone design in the manner of
  Gleason's basic relations with the gear pitch angle at its bevel value
  (Gleason's full method iterates it slightly); blank proportions per this
  project's bevel conventions, pinion face bounded by planes perpendicular
  to its axis; none of it affects conjugacy, which generation guarantees
  for whatever blank is chosen. Pinion spiral angle capped at 75°.

## Timing belts according to standards -- and three bugs no validity check could see

The user's follow-up on the pair below: "timing wheels according to
standards", then "check the timing belts geometry, something is weird".
Both were right. `timing_belt.py`, docs/gear-math.md §20.2.

- **Standard sizes**: `TIMING_BELT_STANDARDS` -- the classic inch
  trapezoidal series (MXL, XL, L, H, XH, XXH), the ISO 5296 metric T-series
  (T2.5, T5, T10, T20), and the curvilinear series (GT2 -- the 2 mm belt in
  almost every 3D printer -- and HTD 3M/5M/8M/14M). Picked by name, the
  same way a sprocket picks its ANSI chain number: pitch and
  trapezoidal-vs-curvilinear profile set together, pitch still directly
  editable. The profile distinction is carried by a fillet radius (0.15
  tooth heights trapezoidal, 0.35 curvilinear), applied by eroding and
  re-dilating the sharp trapezoid -- chosen over hand-placed tangent arcs
  because this project has twice placed a fillet backwards by hand (rack,
  worm), and a library operation cannot be backwards. Confirmed by test:
  the rounded tooth lies inside the sharp one, loses under 10 % of its
  area, and its mid-flank/root/tip points are exactly where the sharp
  tooth's were -- the fit is unchanged.
- **Stated plainly**: the pitches are exact (they are how the sizes are
  named and sold, and they set the pitch diameter exactly); tooth height,
  widths and fillet are this module's own proportions of the pitch, chosen
  to look and fit like each series, not transcribed from a manufacturer's
  drawing -- the real GT/HTD arcs are proprietary. A part mating with a
  specific purchased belt should have its tooth dimensions set from that
  belt's datasheet.
- **The "weird" belt** was real: the committed strip spliced each tooth's
  four corners into the outline tip-first, so every tooth ran diagonally
  up to a tip corner, down a flank, then diagonally across -- sawtooth
  spikes and wedges, 3 % too much area, and a *valid* polygon (nothing
  crossed). Measured: the middle tooth had 3.75 mm² where the nominal has
  3.19, symmetric difference 3.19 -- the shapes barely overlapped. The one
  test that would have caught it, the pulley-seating check, built its tooth
  straight from `belt_tooth_points` rather than from the strip. Now a union
  of closed tooth polygons (no ordering to get wrong), and a test that cuts
  every tooth back out of the built strip and compares it to the nominal.
- **Then six of the fifteen standards silently lost every tooth**: the
  fillet operation returns the root edge at v = +2.8e-17 for XL, L and the
  four T-sizes (exactly 0.0 for the other nine), and a tooth floating
  3e-17 above the backing does not merge with it in `unary_union` -- the
  builder's "keep the largest piece" fallback then returned the bare
  backing bar, a valid polygon of exactly the right length. Root line
  snapped to exactly 0; the builder now *raises* if the union is not one
  polygon. A silent fallback that hides missing geometry is the wrong
  reflex.
- **The groove was not the tooth offset by the clearance**: widening the
  sharp trapezoid and then rounding it is not the same shape as rounding
  the nominal tooth and then offsetting it -- they differ at the corners,
  and a seated nominal GT2 tooth showed a real 0.3 % overlap at the default
  0.1 mm clearance (zero once clearance > fillet radius: the signature of a
  corner mismatch, not a margin). Now: round first, then `buffer(+c)`; a
  test pins every nominal boundary point at exactly the clearance from the
  groove boundary.
- **Neither the sprocket nor the timing wheel had a bore.** Both solids
  were built from the shapely outline's *exterior ring*, so the bore -- an
  interior ring -- never left shapely: a solid disc for any bore, plainly
  visible in both thumbnails (not read for that), passed by every
  validity/manifold/STEP round-trip test. The bore is now cut in the
  sketch, drawn as its own circle in the DXF, and both families are checked
  by asking the solid whether there is material on the axis and whether
  the volume difference to a bore-less build is exactly the bore cylinder.
- **Checks**: `test_timing_belt.py` 9 -> 28 (every standard builds a
  valid, symmetric pulley and a belt with all its teeth, each exactly the
  nominal tooth; curvilinear more rounded than trapezoidal; fillet trims
  only corners; groove = tooth + clearance; seating on T5/GT2/HTD 8M/XL;
  bore), `test_sprocket.py` 12 -> 13 (bore); suite 149. UI: a Belt
  standard combo on both cards, profile and fillet in the derived rows,
  names like `timingwheel_htd8m_z16_beltpitch8_fw10_bore8`. Headless export
  + reset for wheel and belt, sprocket export; SolidWorks imports of all
  three (wheel 12 s, belt 5 s, sprocket 5 s, all native, 3D Interconnect off).

The pattern across all of them, now written into §20.2: a shape-quality
check confirms the result is *a* solid, never that it is *the right* one;
the tests that hold are dimensional and comparative -- area equals backing
plus n × tooth, each cut-out tooth equals the nominal, no material on the
axis -- the same "ask the geometry a question with a known answer" habit
the roller-seating and pin-through-plate checks already follow.

## Timing wheels (pulleys) and timing belts

The second drive-element pair the user asked for (item 2, clarified as
"timing wheels", and item 4, "timing belts"), alongside the roller
chain/sprocket pair already committed. `timing_belt.py`,
docs/gear-math.md §20 -- two new families, Timing wheel and Timing belt.

- **A belt is not a chain**: a chain is rigid pitch-length links, so
  wrapped around a sprocket its rollers sit on a regular polygon (§18.1).
  A timing belt is one continuous, flexible, inextensible band -- wrapped
  around a pulley its pitch line lies on a **true circle**, `R = z p /
  (2 pi)`, no polygon effect at all. That single fact is also exactly the
  ordinary rolling-without-slip kinematics `involute.rack_point_to_gear_
  frame` already implements for a rack rolling on a gear (§4) -- so the
  belt's own trapezoidal tooth (wide at its root, the belt's backing,
  narrower at its tip -- the ordinary ready-made-tooth shape, just without
  an involute flank) IS the rack profile, and wrapping it onto the pulley
  is that same function evaluated once at phi=0 across the tooth's own
  four corners. **No envelope or union needed at all**, unlike every other
  generated-tooth family here: the tooth's shape is *given*, not derived,
  so a single evaluation of where its points sit when wrapped is the whole
  answer -- and it worked correctly on the first build, no iteration
  needed, confirmed by rendering.
- Because the belt tooth narrows root-to-tip, the pulley's own tooth
  (the material between two grooves) automatically widens the other way:
  an ordinary tapering tooth falls out of the construction directly,
  the opposite experience from the sprocket (§18.2), where a moving
  generator does not apply at all and a bespoke widening-gap
  construction was needed instead -- confirmation, not contradiction: a
  belt genuinely is a flexible rack (conforms smoothly to the pulley at
  every point), a chain genuinely is not (its rollers move rigidly with
  the sprocket once seated), and the right construction for each follows
  from which one actually holds.
- The belt itself needs no wrapping at all -- flat, it is literally
  `rack.py`'s own construction (a bar with a repeating tooth profile),
  just thin, with teeth on one face.
- **Checks** (`tests/test_timing_belt.py`, 9 tests; suite 129): the
  pulley's pitch radius matches `z p/(2 pi)` exactly; the belt tooth's
  own corner widths confirm the taper direction the pulley-tooth argument
  depends on; the built pulley is one valid, z-fold-symmetric solid over
  three tooth-count/pitch combinations; **a belt tooth -- wrapped by
  `rack_point_to_gear_frame` called directly, not through this module's
  own pulley-building wrapper -- seated in every groove overlaps the
  pulley by nothing beyond floating-point noise, and collides by
  essentially its whole own volume turned half a pitch onto the land**;
  the belt strip is one valid manifold solid of the requested length;
  both solids round-trip through STEP.
- **UI**: Timing wheel and Timing belt cards, their own sections (belt
  pitch; the belt also shows how many teeth to model, not a meshing
  dimension), TIMING BELT FIT / BELT derived rows, no teeth/module/
  pressure-angle fields for either (a timing belt has no bore either, and
  -- like the chain link -- every field that genuinely does not apply to
  it, bore/profile-shift/addendum-dedendum/backlash, is reset on entry),
  reset defaults, names like
  `timingwheel_z20_beltpitch5_fw8_bore6` /
  `timingbelt_beltpitch5_teeth12_w8`, thumbnails, `--uismoke
  --timingwheel` / `--timingbelt`. Verified headless (export + reset for
  both) and by SolidWorks imports (wheel: 4 s, native, from an already-running SolidWorks session, 3D Interconnect off; belt:
  4 s, native, same session, 3D Interconnect off).
- **v1 simplifications, stated in the docs**: a plain trapezoidal tooth,
  no root fillet; the belt's pitch line is assumed to coincide with the
  pulley's outside diameter rather than a standard-specific pitch-line
  differential; tooth proportions are simple, stated ratios of the belt
  pitch, not a transcribed standard table; the curvilinear HTD/GT2 profile
  (circular-arc teeth, now very common) is documented as a future
  addition, not implemented here.

This closes the second of the two drive-element pairs the user asked for
("continue with the rest of the gears missing" extended to sprocket
gears, timing wheels, one chain link, timing belts) -- 18 families now,
each with math, tests, docs, server dispatch, UI, thumbnail, SolidWorks
import and a PROGRESS entry.

## One roller-chain link

Second of the sprocket/chain pair (item 3 of the user's list: "sprocket
gear links according to standards (only one link)"). One pitch length of
roller chain -- an outer link (2 plates, 2 pins) pinned into an inner
link (2 plates, 2 bushings, 2 rollers), ten parts, built to seat in the
sprocket already committed (`chain_link.py`, docs/gear-math.md §19).

- **A real, deterministic bug a validity check could not see**:
  `_plate_solid` cut each plate's two pin holes with
  `Circle(mode=SUBTRACT).located(...)` -- but `.located()` on an
  already-built subtract-mode primitive only relocates the *returned
  object*, it does not redo the boolean there; the subtraction already
  happened at the origin the instant the circle was built. Both holes
  landed at x=0 (the second redundant with the first), leaving the hole
  a full pitch away completely solid. `is_valid`/`is_manifold` both pass
  on a plate missing one of its two holes -- it's still a single,
  perfectly good manifold solid, just the wrong one, the same lesson the
  rack root-fillet inversion taught earlier in this project. Caught only
  because an independently-built pin, placed where that hole should be,
  failed to pass through cleanly. Fixed by wrapping each circle in its
  own `with Locations(...):` block, the pattern already used elsewhere
  in this codebase (`Locations` must wrap the primitive's own
  construction, not chase it after the fact).
- **A narrower, secondary finding**: with the duplicate-hole bug still
  in place, the mesh-interference check gave a **false negative** for
  one of the two (otherwise geometrically identical) defective plates
  and correctly flagged the other -- consistent with this project's
  standing note that OCCT's booleans can silently return nothing on
  degenerate/duplicate geometry; a zero from an interference check isn't
  proof of a clean fit when the geometry feeding it is already suspect.
- **Checks** (`tests/test_chain_link.py`, 6 tests; suite 120): pin,
  bushing and roller centres are each exactly one chain pitch apart; all
  ten parts (and the ten-body assembly) are valid manifold solids; every
  rotating pair (pin/bushing, bushing/roller) and press-fit pair
  (pin/outer-plate, bushing/inner-plate) has exactly zero
  interpenetration; **the link's own roller, seated in a sprocket built
  from the same chain pitch and roller diameter, overlaps it by nothing
  beyond floating-point noise and collides by over 10% of its own
  volume turned half a pitch onto a tooth** -- the real link against the
  real wheel, both built by this project's own code, over two chain
  sizes; the assembly round-trips through STEP as ten solids.
- **UI**: Chain link card, CHAIN LINK section (the same chain-number
  combo as Sprocket -- a link and a sprocket built from the same chain
  number are meant to mesh), CHAIN / LINK DIMENSIONS derived rows, no
  teeth/module/bore fields (none apply, and every shared field that
  doesn't -- bore, profile shift, addendum/dedendum coefficients,
  backlash -- is explicitly reset on entry so a stale value from
  whatever family was open before can't leak into this one, after the
  same class of bug bit the sprocket card), reset defaults, names like
  `chainlink_chain40_pitch12.7_roller7.925`, thumbnail,
  `--uismoke --chainlink`. Verified headless (export + reset) and by a
  SolidWorks import (13 s to a 329 KB native, ten-body .sldprt from the 1.1 MB STEP, fresh SolidWorks session, 3D Interconnect off).
- **v1 simplification, stated in the docs**: stadium-shaped plates (a
  real chain plate is usually waisted/figure-8 for weight, not modelled
  here); the roller is solid, not a tube with its own bore -- only its
  outer diameter (the dimension that actually meshes) is exact; pin/plate/
  bushing sizes not fixed by the chain's own pitch and roller diameter
  follow stated, overridable ratios rather than a transcribed standard
  table.

## Sprocket wheels for roller chain

First of a new pair the user asked for -- "sprocket gears", "timing wheels",
"sprocket gear links (only one link)", "timing belts", all "according to
standards" -- two chain/belt drive systems, each a toothed wheel plus its
flexible mate. Sprockets first: a wheel for ANSI B29.1 / ISO 606 roller
chain (`sprocket.py`, docs/gear-math.md §18).

- **Two wrong tooth shapes on the way, found by measuring, not by argument**:
  first, the natural instinct (matching every other family here) was to
  generate the tooth as the envelope of the roller's own approach motion,
  the way a rack or a shaper cuts a gear tooth -- but a seated chain roller
  moves *rigidly* with the sprocket, no sliding left to sweep, and the real
  transient engagement depends on which direction the chain approaches
  from, which a sprocket's own tooth form cannot. Second, a plain circle at
  each pitch vertex (correct for seating) never tapers: scanning the built
  profile's own top land over the seat circle's whole radial reach found
  the minimum bottoms out around one roller radius regardless of where the
  outside diameter sits -- rendered, it's a disc with round notches, not a
  sprocket.
- **What works**: the gap must *widen* outward from the root -- the mirror
  of how an ordinary gear tooth narrows -- so the tooth between two gaps
  tapers to a tip. Built directly: the seat circle (roller radius +
  clearance) handles the root, blended into a wedge that widens at a fixed
  `flank_angle_deg` (20° default) out past the outside diameter. Confirmed
  by rendering at 15–45°, all of them look like a real sprocket.
- **Checks** (`tests/test_sprocket.py`, 12 tests; suite 114): pitch
  diameter matches the closed-form regular-polygon formula for every
  entry in the ANSI chain-number table (#25–#240); the built profile is
  one valid, z-fold-symmetric polygon over four tooth-count/chain
  combinations spanning z = 11 to 60; **a real chain roller -- exactly
  the chain's own diameter, no clearance added -- placed at every pitch
  position overlaps the built profile by nothing beyond floating-point
  noise**, while the same roller half a pitch off collides by more than
  30% of its own area; the tooth measured at the root is wider than at
  the tip (the taper, confirmed directly); root clearance is shown to
  depend only on the chain, not the tooth count; the solid round-trips
  through STEP.
- **UI**: Sprocket card, SPROCKET section (chain-number combo -- picking
  one sets pitch and roller diameter together from the standard table,
  both stay directly editable -- plus outside diameter, 0 = auto), CHAIN /
  ROOT-OUTSIDE-DIAMETER derived rows, reset defaults, names like
  `sprocket_z20_chain40_pitch12.7_roller7.925_odauto_fw6_bore10`,
  thumbnail, `--uismoke --sprocket`. Two real bugs caught by the smoke
  test's own file-name check, not by eye: `SelectSprocketCard` left
  `RollerDiameterMm` at whatever the previously-selected family's shared
  field held (6 mm from the cycloidal drive, not #40 chain's 7.925) --
  fixed by re-running the chain-number lookup on entry; the Sprocket
  file-name case additionally appended its own "bore" segment on top of
  the shared trailing rule every other family already relies on,
  duplicating it (`..._bore10_bore10`) -- fixed by removing the redundant
  one. Verified headless (export + reset) and by a SolidWorks import
  (21 s to a 649 KB native .sldprt from the 2.9 MB STEP, fresh SolidWorks session, 3D Interconnect off).
- **v1 simplification, stated in the docs**: a flat-plate ("type A")
  sprocket, no hub; the tooth form is derived and verified against the one
  requirement the standard's own tables exist to satisfy (a real roller
  seats without interference), not transcribed from those tables' exact
  arc radii -- a specific certified sprocket's outside diameter should be
  checked against its manufacturer's own table.

## Face gears

Next family from "the rest of the gears missing": a spur pinion driving a
disc with teeth cut into its face (`face_gear.py`, docs/gear-math.md §17).
The face gear has no pitch cylinder or cone; its tooth surface is the
envelope of the shaper pinion's involute under the generating motion
(shaper spins θ_s, face gear turns θ_s·z_s/z_f), and this build makes that
envelope literally.

- **Envelope in 2D, lofted**: in the face gear's frame the shaper at
  generating angle φ is spun by φ and carried by −φ·z_s/z_f, so a radial
  station plane `x = R` cuts its extruded outline in an affine image
  `y = R·tan ψ + y'/cos ψ` of the transverse outline; the union of 240 such
  images (shapely, milliseconds) is the exact tooth-space section at that
  station, and a smooth loft through 10 stations (ThruSections, edges paired
  by index) is the space — **6 faces per space tool, 84 for the gear**,
  against the ~16 000 faces and 61 MB STEP of the first 3D boolean-sweep
  attempt (one facet per sweep position). Above the addendum plane the
  tool is just a strip over the space, so every station is the same four
  edges with one sweep profile from tooth-tip corner to tooth-tip corner:
  a profile that included the straight runs let the arc-length
  correspondence wander between features and the loft wobbled between
  stations by enough to break the booleans.
- **Two construction errors caught by the mesh check** (pinion vs built
  gear, solid by solid): the first cutter rotated the placed shaper about
  the *global* X axis, 20 mm below its own — it swung through the blank
  and cut spaces 1.8× too wide; then a ±1.5-pitch sweep trimmed short of
  the half-pitch plane left uncut material at the inner end (3.6 mm³ a
  side, exactly where the pinion's neighbouring tooth passes): the
  neighbouring shaper tooth finishes the undercut one shaper pitch after
  the bottom tooth's exit angle `T = acos((r_s−h_a)/(r_s+h_as))`, so the
  sweep now runs ±(T + 2π/z_s + 3°).
- **Design limits, and a sane auto ring**: Litvin's L1/L2 from the
  rack-equivalent section (`cos α_R = cos α·R_0/R`, pitch line
  `z_p = r_s − r_s'`): undercut inside `L1 = R_0 cos²α/(1 − h_a/r_s)`,
  pointed beyond L2 where `t_top(R) = 2r_s'(π/2z_s − inv α + inv α_R) −
  2(h_a − z_p)tan α_R` vanishes. The old auto ring (R_0 ± 5 m) sat far
  outside both for any low ratio (z = 40/20, m = 2: L1 = 39.25, L2 = 46.20
  — 7 mm usable); the auto ring is now [L1, L2] less 10 % each end, the
  derived values show both limits and the top land at each end, and warn
  when a hand-set ring crosses a limit. **The formula was checked against
  the exact envelope**: the built gear's measured top lands at both ring
  ends agree with `t_top(R)`: 1.695 vs 1.699 mm at the inner end, 0.276 vs
  0.212 at the outer (the section formula errs on the safe side there).
- **Booleans — the tools must not touch**: trimmed to half-pitch wedges
  the 40 tools shared coincident planar faces and the N-ary cut returned
  an invalid two-solid shape; trimmed 4 µm short of the plane they left 40
  pairs of near-parallel planes and the cut returned null (parallel) or
  took 140–196 s (single-threaded). Now the strip above the blank spans
  the space alone, tools are a top land apart, each meets only the blank:
  one N-ary cut — 23–27 s until the knot-vector fix below, 3–4 s after
  it — with a sequential fallback of identical volumes. The disc inside the ring is relieved 0.2 m below the space
  floor so the floor (tangent to `z = −h_f`) never touches a blank face.
- **Knot vectors**: six faces were still a 96 MB STEP — each station's
  spline had its own chord-length knots and the loft merged twelve of them
  into ~1400-span surfaces (and OCCT's default `volume` came out 35 % low
  on them; a tessellated volume was the arbiter). Interpolating every
  station on the same uniform parameter vector (the points are equally
  spaced along the arc) gives the loft one knot vector, the
  boolean's ~750-pole intersection edges are re-approximated to 2 µm and
  the STEP is written without pcurves (`export_step(write_pcurves=False)`
  — the static set beforehand is overridden by build123d): 4.9 MB, from
  21.7 MB, 96 MB before that.
- **Checks** (`tests/test_face_gear.py`, 5 tests; suite 102):
  section formula = standard rack at R_0, closed-form L1, `t_top(L2) = 0`,
  auto ring inside the limits, sweep range; the space tool is one valid
  solid of six faces with its floor at −h_f, within its own pitch wedge; one
  valid manifold body of < 6 faces per space, removed volume per space
  within 50 % of a crude estimate and within 1 % of one tool-in-blank
  volume, top lands vs formula, STEP round-trip under 8 MB and equal in
  volume to 0.1 %; **the pinion meshes through the built gear** at four phases
  with < 10⁻⁴ of its volume overlapping (measured 0.012 mm³ of 11 800 —
  10⁻⁶) and collides by 117 mm³ turned half a pitch, with the pinion's
  own count and with a 22-tooth shaper.
- **UI**: Face gear card, FACE GEAR section (pinion teeth, shaper teeth,
  ring inner/outer radius, rim), derived rows PINION AND SHAPER / TOOTHED
  RING / RING LIMITS, reset defaults, names like
  `facegear_z40_pinion20_m2_pa20_ringautotoauto_rim6`, thumbnail,
  `--uismoke --facegear`. Live preview shows the pinion in mesh. Verified
  headless (export + reset) and by a SolidWorks import (19 s to a 1.6 MB native .sldprt from the 4.9 MB pcurve-less STEP, fresh SolidWorks session, 3D Interconnect off).

## Spiral and zerol bevel gears

The user asked for "the rest of the gears missing"; spiral bevel first,
with zerol as its zero-spiral-angle case. Docs §12 had argued against
building this without cutter-head kinematics; what is built is narrower and
says so: **the straight bevel tooth swept along the Gleason circular-arc
trace**, judged by the same pair check as every other multi-member family
(`spiral_bevel.py`, docs/gear-math.md §16).

- **Trace**: in the pitch cone's development, a circle of cutter radius
  `r_c` through the mean point, tangent there at the spiral angle `ψ_m`;
  Gleason's `sin ψ(s) = (s² − R_m² + 2 R_m r_c sin ψ_m)/(2 s r_c)` and the
  offset `φ_dev(s)` from the circle/circle intersection, `φ = ±φ_dev/sin γ`
  by hand. Every station across the face is §8's Tredgold section at that
  cone distance turned by `φ(s)`; the section uses the transverse pressure
  angle `tan α_t = tan α_n / cos ψ_m`. Zerol: `ψ_m = 0`, curved teeth
  (−8.8° toe → +7.6° heel on the test gear).
- **The loft finding that made it possible**: build123d's `make_loft`
  leaves OpenCASCADE's vertex-compatibility check ON, which re-pairs the
  vertices of *rotated* sections by proximity and shears the surface —
  this is the mechanism behind the helical gear's 359 µm (§7.3). Measured
  on those same six rotated sections: 359.4 µm with the check on, 8.6 µm
  (ruled, = the chord sagitta) and **0.0 µm (smooth)** with it off, at a
  sixth of the face count. So spiral teeth are smooth lofts driven through
  `BRepOffsetAPI_ThruSections` directly with `CheckCompatibility(False)`.
  The worm thread's loft was measured too: 18.5 µm between stations at
  9°/station — chord sagitta, not shear; that old open thread is closed.
- **Pair check, and a shared helper** (`meshcheck.py`): OpenCASCADE's
  common of two *compounds* whose members touch tangentially silently
  returns nothing — for a mis-phased straight-bevel pair it read 0 mm³
  while solid by solid the teeth overlap by 111 mm³. Every pair check now
  runs solid by solid with a bounding-box prefilter, and the straight bevel
  got the pair test it never had: 0.12 mm³ (0.001 % of the gear) in phase
  at three rotation phases, 111 mm³ mis-phased. Spiral (35°) and zerol
  pairs pass the same thresholds (< 5·10⁻⁵ of the gear in phase, > 2·10⁻³
  and 50× more mis-phased). `bevel.place_bevel_pinion` derives the
  placement (contact generatrix, even-pinion spin, ω₁ = −ω₂ z₂/z₁).
- **A pre-existing bug found by the transverse angle**: the generating
  cutter's outline self-intersected above ~23.5° pressure angle because its
  two tip fillets crossed (tip land 0.26 mm at 20°, 0.013 mm at 23°,
  negative beyond) — so the 25° preset had been feeding an invalid cutter
  to every family, and shapely's sweep union threw for the spiral bevel.
  `rack_cutter_tooth_points` now clamps the fillet to a full-round tip
  (`ρ ≤ 0.999·flank_u(tip)/tan(45°−α/2)`), and past ~32.1° (where the
  standard-depth rack tooth is pointed, `tan α ≥ π/(4 hf*)`) cuts the tooth
  off at its point instead of crashing, with a warning in every family's
  derived values. A 40° spur gear now builds and warns.
- **Checks** (`tests/test_spiral_bevel.py`, 7 tests; suite 97): trace
  by numeric differentiation equals Gleason's closed form at toe/mean/heel
  for 35°, 20°, 0°; toe/heel stations are exactly the straight-bevel
  stations turned by the trace; a 10-station tooth's loft passes through
  its stations to < 2 µm and through a 37-station build's intermediate
  stations to < 10 µm; blank + z manifold teeth, STEP round-trip; the pair
  check for spiral and zerol.
- **UI**: Spiral bevel and Zerol bevel cards over one family (split by the
  spiral angle, as Spur/Helical), a SPIRAL BEVEL section (spiral angle,
  cutter radius, hand), the BEVEL CONE section and derived rows shared with
  straight bevel plus a spiral row (mean/toe/heel angles, hand, cutter
  radius, transverse PA), reset defaults for both cards,
  `spiralbevel_z16_m2_pa20_mate20_shaft90_spiral35_RH_fw10` names,
  thumbnails, `--uismoke --spiralbevel|--zerol`. Verified headless and by a
  fresh-launch SolidWorks import (native body).

## Light 3D ground, a mid-blue gear, and "shaded with edges"

User: "do some GUI changes to the background of the display and the color
of the gears so the user can see them with ease" and "add edges to the 3d
model to emphasize the geometry."

- **Ground**: the viewport's near-black panel is now a light, slightly
  graded ground (#FAFBFC → #C9D2DE), the CAD-viewer convention; the view-
  preset chips went from white-on-translucent to dark-on-white so they
  stay legible on it.
- **Gear**: the pale #93C5FD, which shaded almost flat on the dark ground
  (every face the same tint), is now a mid steel blue (#5B8FD6) with a
  white specular — the faces shade visibly against the ground and against
  the edges drawn over them.
- **Edges** (`FeatureEdges.cs`): the STL triangle soup is welded by
  position, every shared edge is classified by the crease angle between
  its two faces, and edges over 30° (plus open or over-shared ones) become
  line segments drawn by a screen-space `LinesVisual3D` over the model.
  30° sits between tessellation and geometry: adjacent facets of a curved
  flank, fillet or bore differ by a few degrees (the tightest previewed
  curve, a 3 mm rack mounting hole at the 0.02 mm preview tolerance,
  reaches ~19°), while tooth tip corners, a rack's flank-to-land corners
  and end-face outlines are 55°+. So the tooth outlines on both faces, the
  tip/root corners along the face width, a herringbone's V apex and the
  bevel cone rims appear, and the tangent fillet-to-flank joins correctly
  do not. Computed off the UI thread from the frozen mesh after the model
  is shown, so the model never waits for its edges; the smoke logs the
  count (742 segments for a 20-tooth spur, 3,871 for a planetary set).
- The planetary preview — previously one flat blue disc from the default
  camera, all members flush and one colour — now reads as sun, planets and
  ring; the edges do what a per-body colour would have.

## "Reset <kind> to default values" button

User: "add a reset button to 'default values' for each kind of gears." One
button under the family mosaic, labelled for whichever card is selected
("Reset Helical rack to default values"), that puts every parameter back
to that kind's canonical values while keeping the unit system (a
preference, not a parameter):

- `GearParameters.CreateDefaults(family, helical, unit)` is the single
  source of those values: the class's own initialisers are the spur
  defaults and each card overrides what makes its kind sensible — the
  same values the card-selection methods jump to, plus the ones they
  leave alone (worm length 30 mm rather than the shared 10 mm stub, an
  internal ring of 40 teeth around a 20-tooth pinion, a 12/9/30 planetary
  that satisfies the assembly condition, the 10-lobe cycloidal drive with
  its 20 mm bearing seat). Spur/Helical and Rack/Helical rack are separate
  cards over one family, so `helical` picks between them.
- The view model binds to one long-lived `GearParameters`, so the reset
  copies the defaults INTO it (`CopyFrom`, reflection over the settable
  properties so a parameter added later can't be forgotten) and raises a
  blanket property-changed (empty name = "all"), then the usual
  family-changed notifications and a preview refresh.
- Verified headless: `--uismoke ... --resettest` moves the parameters off
  the defaults with the usual overrides, presses the button, and compares
  the resulting export name (which encodes every geometry parameter)
  against `CreateDefaults` for that card — run for all twelve cards.

## Cycloidal drives — hypocycloid speed reducers

Sixth and last of the first-priority additions (`cycloidal_drive.py`,
docs/gear-math.md §15): an eccentric input turns a lobed disc rolling
inside a ring of `N` fixed rollers; `N − 1` lobes, reduction `(N − 1) : 1`,
zero backlash, every roller sharing the load. Previewed and exported as
disc + rollers + output pins in mesh.

- **The profile is derived, not copied from a formula.** With the disc's
  pitch circle `(N−1)E` rolling inside the ring's `NE`, a roller centre
  traces `u(φ) = Rot(φ/(N−1))·(R − E cos φ, −E sin φ)` in the disc frame,
  and the disc is that curve offset *toward* its centre by the roller
  radius (the inner envelope of the rollers). The tangent is analytic; from
  it the cusp condition `E N = R` falls out (so `E < R/N` is the design
  limit) and a convex-side curvature guard flags rollers too big for the
  profile. Output pins fixed to the output shaft run in holes of
  `d + 2E` — the disc's orbit is exactly what the `2E` absorbs.
- **Checks** (`tests/test_cycloidal_drive.py`, 7 tests; suite 89): **the
  envelope property itself** — at eight input angles every one of the `N`
  rollers is tangent to the placed disc to < 3 µm, neither penetrating nor
  lifted off, for three `(N, R, R_r, E)` sets (a sign error anywhere in the
  kinematics, offset direction, lobe count or ratio fails this at the first
  angle); `N−1` radial maxima and lobe height `2E`; one input turn moves the
  disc back exactly one lobe; the cusp limit; output pins exactly `E` from
  their hole centres at every angle; manifold disc; the multi-body STEP
  round-trips with `1 + N + N_out` solids. The tangency test passed first
  time; the curvature guard needed one correction — it must consider convex
  stretches only, since an inward offset never self-intersects in the
  concave valleys (the default disc has 1.2 mm valleys and a perfectly
  valid 3 mm-roller profile; convex minimum 9.9 mm).
- **UI**: Cycloidal drive card; module and pressure-angle blocks hidden
  for it (it has neither), the teeth spinner relabelled "Number of lobes
  (= reduction ratio)", the bore relabelled as the eccentric bearing seat
  (defaulting to 20 mm on entry); a CYCLOIDAL DRIVE section (pin circle,
  roller diameter, eccentricity, output pin count/diameter/circle); a
  derived row with the reduction, the profile limits (max eccentricity,
  convex flank radius vs roller) and the output holes; warnings for the
  cusp limit, undercut, and output holes breaking into the bore or the
  lobes or each other; `cycdrive_lobes10_pcd60_roller6_e1.5_fw10_out6x6on30
  _bore20` names; thumbnail; `--uismoke --cycdrive`; a DXF with the disc's
  flat pattern plus the rollers for reference. Verified headless and by
  SolidWorks import of the 18-body STEP.

That closes the agreed first tier of the user's list (herringbone, helical
rack, screw pair, planetary, cycloidal gear, cycloidal reducer). Still
open from it: spiral and zerol bevel, face gears, hypoid, globoid and
double-enveloping worms, eccentrically-cycloidal and hyperboloidal gears.

## Cycloidal gears

Fifth of the requested additions: the clock/instrument tooth form
(`cycloidal.py`, docs/gear-math.md §14) — epicycloid above the pitch
circle, hypocycloid below, both traced by one rolling circle. No pressure
angle, no base circle: the rolling circle is the tooth-form parameter
(0 = automatic, this gear's pitch radius, i.e. `r_g = R/2`, which makes the
dedendum flanks straight radial lines — the classic clock pinion; clamped
to `[hf/2, R)`).

- **Construction**: the monotonic-radius arcs of both curves (`t ∈ [0,
  π r_g/R]` rising to `R + 2r_g`, `t ∈ [−π r_g/R, 0]` falling to `R − 2r_g`
  — cusps every `2π r_g/R`) are bisected for the tip and root crossings;
  right flank = hypocycloid up to the pitch point, epicycloid to the tip,
  rotated to `−s/(2R)`; mirror, tip arc, root arc; `z` wedges unioned with
  the root disk. Flanks that cross before the addendum circle are trimmed
  to a pointed tooth instead of self-crossing.
- **Checks** (`tests/test_cycloidal.py`, 11 tests; suite 82): the
  **fundamental law of gearing on the curves themselves** — the profile
  normal at every sampled point passes through the rolling circle's contact
  point on the pitch circle, four `(R, r_g)` combinations; tooth angular
  thickness `s/R` centred on +Y and thinned by exactly the backlash; tip/
  root radii; the radial-flank special case; valid polygons and manifold
  solids at z = 6/12/40; **a conjugate pair sharing one rolling circle
  meshes with (near) zero boolean interpenetration at the exact centre
  distance while a half-pitch phase error collides** (12/18, 8/24 at the
  automatic circle; 10/15 at a chosen one); STEP round-trip. All passed
  first time.
- **UI**: Cycloidal card, the pressure-angle block hidden for it (rather
  than shown and ignored), a CYCLOIDAL section with the rolling-circle
  spinner, a derived row with the rolling circle (and "radial dedendum
  flanks" when it applies), "n/a (cycloidal)" for the base circle,
  `cycloidal_z8_m3_rollauto_fw10` names, thumbnail, `--uismoke
  --cycloidal`. Verified headless and by SolidWorks import.

## Planetary (epicyclic) sets

Fourth of the requested additions: sun + n planets + ring, all in mesh,
previewed and exported together (`planetary.py`, docs/gear-math.md §11.4).
Every member is an existing gear (the ring is §11's internal gear,
generated with the planet itself as its cutter so it is exactly conjugate
to what runs in it); the set adds the relationships and a fully phased
placement:

- **Relationships**: `z_r = z_s + 2z_p`, `a = m(z_s + z_p)/2` (the same for
  ring–planet), assembly condition `(z_s + z_r)/n` integer, adjacent-planet
  clearance `2a·sin(π/n) > m(z_p + 2)`, and the three ratios (ring fixed,
  sun fixed, carrier fixed). Both the assembly and the clearance failures
  are warnings in the UI, and the Planetary card lands on a planet count
  that satisfies the assembly condition instead of on the other families'
  default mate count.
- **Phase**: the outlines' "tooth centred on +Y" frame was *measured* for
  both members first (sun: tip radius on +Y; ring: root radius on +Y, tip
  half a pitch over — i.e. the ring has a space there), not assumed. An
  odd planet meshes as-is; for an even planet the sun is turned half a
  pitch. Planet k is planet 0's configuration carried round by `Δ_k =
  360k/n`, then spun by `(Δ_k mod p_s)·z_s/z_p` to re-mesh with the real
  (un-carried) sun — and the assembly condition is exactly what makes the
  ring's own correction agree modulo a planet pitch (derived in §11.4).
- **Checks** (`tests/test_planetary.py`, 6 tests; suite 71): the formulas
  and a failing assembly case; **no interpenetration** of any planet with
  the sun or with the ring for 3 odd planets, 4 even planets and a 5→3
  fallback case, while planet 0 turned half a pitch collides with both;
  planets clear each other and sit at `a`; the multi-body STEP round-trips
  with `n + 2` solids. All passed first time, which is what the probe of
  the frames beforehand bought.
- **UI**: Planetary card, PLANETARY SET section (planet teeth, planet
  count, ring rim), derived row with the ring's tooth count/OD, the centre
  distance and all three ratios, `planetary_s12_p9x3_r30_m2_pa20_rim6_fw10`
  names, thumbnail, `--uismoke --planetary`; DXF export writes the whole
  set's section. Verified headless and by SolidWorks import of the
  five-body STEP.

## Crossed-helical (screw) gear pairs

Third of the requested additions. Two helical gears on shafts that cross
without intersecting; each member is the existing helical gear, so what
the family adds is the pair relationship and a correct meshing placement,
previewed and exported together (`crossed_helical.py`, docs/gear-math.md
§7.5):

- **Relationship**: `Σ = β1 + β2` for the same hand, common normal module and
  pressure angle, `d_i = m_n z_i / cos β_i`, `a = (d1 + d2)/2`, ratio
  `z2/z1` (independent of the helix angles, unlike a worm pair). Given gear
  1 and the shaft angle, `β2 = Σ − β1`: same hand when positive, opposite
  hand with `|β2|` when negative, a spur gear 2 at zero — all handled and
  each flagged in the warnings.
- **Placement**: the common perpendicular of the axes is Y, gear 1 on Z at
  the origin, gear 2's centre at `(0, a, 0)`; each gear centred on its
  mid-face and turned by minus half its twist so the mid-face profile is in
  the "tooth centred on +Y" frame the outline is generated in; gear 2 shows
  a *space* to the pitch point (half a pitch of rotation when z2 is even);
  then rotated about Y by `−Σ` for a right-hand gear 1 — derived from the
  two tooth traces at the pitch point having to coincide, not assumed.
- **Checks** (`tests/test_crossed_helical.py`, 7 tests; suite 65): the
  formulas against hand-computed numbers; gear 2's centre and axis; and the
  decisive one — the boolean intersection of the correctly placed pair is
  below 2·10⁻⁴ of a gear's volume while the same pair with gear 2 turned
  half a pitch collides by at least 20× more, for right- and left-hand
  pairs, 30°/60° at 90°, and an opposite-hand 45° vs Σ = 30° pair (so the
  sign derivation, the even/odd phase and the centre distance are all
  verified by a test that is known to be able to fail); the two-body STEP
  round-trips as two solids.
- **UI**: a Screw gears card, the HELIX section under "HELIX (gear 1; gear
  2's follows from the shaft angle)", a SCREW GEAR PAIR section (gear 2
  teeth, shaft angle), a derived row with gear 2's helix/hand/diameter,
  centre distance and ratio, `screwpair_z18x20_m2_pa20_helix45R_shaft90_fw10`
  names, thumbnail, the worm's 3/4 camera nudge (same reason: two mating
  parts), `--uismoke --screw`. STEP export writes both members in mesh as a
  two-body part. Verified headless and by SolidWorks import.

## Helical racks

Second of the requested additions. A helical rack is the straight rack
with its teeth inclined by the helix angle across the face — the rack a
helical pinion meshes with — so it is built as a variant of the Rack
family (a helix angle on `RackParams`, exactly as Spur/Helical share the
cylindrical family), not a new family:

- **Geometry** (docs/gear-math.md §10.4): everything is decided in the
  transverse section, a straight rack of `m_t = m_n/cos β`,
  `tan α_t = tan α_n/cos β`, with depths and fillet on the normal module —
  the same normal/transverse split as §7. The solid is that outline
  extruded *obliquely* (`Solid.extrude` along `(shear·b, 0, b)`), which is
  exact — a shear, not an approximation — then clipped back to a square-
  ended bar of length `z·p_t` by intersecting with a box (the outline is
  built with extra teeth to cover the shear; mounting holes stay square).
  Hand: a rack is a gear of infinite radius with its teeth on top, and
  §7.3's right-hand gear rotates its top tooth toward −x, so right-hand =
  `shear = −tan β`; a right-hand rack meshes with a left-hand pinion.
- **Checks** (`tests/test_rack.py`, 4 new; suite 58): sections of the built
  solid at two heights match the shifted transverse outline to 1 µm (both
  hands, one face wide enough that the shear exceeds a pitch); the bar is
  exactly `z·p_t` × `b`; the pitch-plane section's tooth parallelogram
  gives the normal thickness `π m_n/2` and transverse `π m_t/2` to 1 µm;
  flank at `α_t`; the hand sign is derived from `GearParams.twist_total_rad`
  rather than restated; manifold with holes at 20° and 35°. Straight racks
  (β = 0) are bit-for-bit the same code path as before.
- **UI**: Rack and Helical rack cards over one family (the Rack card forces
  0°, the Helical rack card jumps to 20°), the HELIX section now shows for
  racks under "HELIX (0° = straight rack)", the rack's derived panel adds
  transverse module/PA, normal pitch and normal thickness,
  `helicalrack_z8_m2_pa20_helix20R_fw10_backing5` names, thumbnail.
  Verified headless (render, derived values, STEP/DXF export, the straight
  card's name unchanged) and by SolidWorks import.

## Seventh family: double-helical (herringbone) gears

First of the user's requested additions (their list: spiral/zerol bevel,
screw gears, herringbone, helical rack, face gears, double-enveloping worm,
hypoid, planetary, cycloidal, globoid, hypocycloid reducer, eccentrically
cycloidal, hyperboloidal; agreed order: herringbone, helical rack, crossed-
helical pair, planetary set, cycloidal gear, cycloidal reducer disc first).

- **Geometry** (`build_gear.build_double_helical_solid`, docs/gear-math.md
  §7.4): two opposite-hand helical halves of one transverse profile,
  mirror-symmetric about the mid-face. Each half is the same exact
  twist-extrude the helical gear uses; the upper half starts from the
  profile pre-rotated by the per-half twist and twists back to zero, so the
  halves meet at the mid-plane in one fully-twisted profile (the V apex) and
  both end faces carry the un-rotated profile. Optional centre gap (the hob-
  runout groove a machined double-helical gear carries) filled by a root-
  diameter cylinder so the part stays one solid; `hand` is the half at z=0.
- **Checks** (`tests/test_herringbone.py`, 4 tests; suite now 54): sections
  at 20/50/80 % of each half match the exactly-rotated profile to < 10 µm and
  the section at `b − z` equals the one at `z` (both hands, with and without
  a gap); end faces and apex faces as the formulas say; one manifold body
  whose volume is Cavalieri's `A·(b−g) + π r_f² g − bore` to 0.2 %; STEP
  round-trips as one solid. server.py gets a `herringbone` gear_type (outline
  = the transverse profile, derived values + per-half twist and two input
  warnings, STEP/DXF/mesh).
- **UI**: a Herringbone card (mosaic now three columns — the set is past six
  and two columns pushed the form below the fold), the HELIX section shared
  with the cylindrical family under a family-specific header, a
  DOUBLE HELICAL section with the centre-gap spinner, "twist per half, V apex
  at mid-face" in the derived panel, `herringbone_z18_m2_pa20_helix30R_fw10`
  file names, thumbnail, `--uismoke --herringbone`. Verified headless: the
  render shows the V teeth with all derived values filled; STEP/DXF export;
  fresh-launch SolidWorks import saved a native .sldprt in 21 s.
- The UI smoke's fixed 9 s pump wasn't enough for this family (the engine's
  first request pays the Python import cost, and two curved sweeps
  tessellate slower than a spur gear): it rendered "Rebuilding 3D model..."
  with every derived value "-". The smoke now pumps until the view model
  reports idle with a model in hand (40 s cap).

## SolidWorks export: 3D Interconnect was turning every export into a linked part (and popping a template dialog)

Found while re-testing the rack in SolidWorks: every import into a freshly
launched SolidWorks (and, it turned out, into an attached one too) blocked
on a modal "New SOLIDWORKS Document" template dialog in SolidWorks' own
window. Headless that is a hang; interactively it looks like the export
stalling while a dialog waits in another app. Forcing "always use default
templates" (with a stock template if none is set) was the first guess and
measured as NOT the cause -- the exporter now logs what it found, and on
this machine the toggle was already on with a valid template. The cause is
**3D Interconnect**: with it on, SolidWorks opens a STEP by creating a new
part (that's the template prompt) and inserting the STEP as a *linked*
feature -- so every .sldprt this tool had produced referenced its own
temporary STEP file instead of owning a native body. The exporter now turns
3D Interconnect off for the duration of the import and restores it; the
next fresh-launch import completed in 21 s with no dialog and saved a
native body (477 KB for the herringbone vs 240 KB for a linked rack).
Every user-facing setting touched is restored in a finally block.

## Rack and worm root fillets were inverted (circle centre inside the tooth); rebuilt from the textbook construction

User, on the rack: "the rack tooth fillets are not made right — fix it please" —
the third report on the same fillet, after "the fillet that connects the teeth
to the ruler are drawn in a wrong way" and, on the worm, "the fillets are the
joints between the central cylinder and the spiral tooth… made wrong… the
fillet serves as a merging geometry between the elements". Each earlier time a
symptom got fixed and the cause didn't:

- **The cause: `rack_tooth_profile` (and `worm.thread_axial_profile`, its
  template) put the fillet circle's centre on the TOOTH side of the flank**
  (`u_c = u_flank − ρ/cos α`). That is the right placement for the convex
  *tip* rounding of the generating cutter in `involute.rack_cutter_tooth_
  points` — which both functions descend from — and inverted for a tooth's
  own *root*. It rounded the tooth's base corner off and then curled the arc
  back under the tooth: at module 2 the arc landed 1.09 mm *inboard* of the
  sharp flank/land corner, and a point just above the root land outboard of
  it was air — a quarter-round groove ρ = 0.76 mm wide beneath every tooth,
  and along both sides of the worm thread's junction with the core. Found by
  a point-in-polygon probe on the real outline while writing the docs
  paragraph for the construction — not by any check run before (validity,
  simplicity, segment crossings, manifoldness, "matches the hand-calculated
  points"), all of which the inverted shape passes, because it is a perfectly
  valid polygon of the wrong shape.
- **The fix is the textbook construction**: centre ρ above the land and
  ρ/cos α outboard of the flank, tangent points the perpendicular feet, arc
  sweep 90° − α. Its tangent length from the sharp corner is ρ·tan(45° − α/2)
  — the standard formula for a fillet in a 90° + α corner — and the new
  self-tests and pytest checks compare the built points against that formula,
  plus: centre on the space side, landing point outboard of the corner,
  half-profile only widening on the way down, material under the arc
  (point-in-polygon on the actual union), the circle's centre in air. ρ is
  clamped where neighbouring fillets would meet at the land's midpoint
  (full-round root) instead of overlapping. Same code in worm.py, same tests
  in test_worm.py. docs/gear-math.md §9.1 and §10.2 carry the construction
  and the history. 50 tests pass.
- **Both earlier "fixes" retracted** (their entries below are annotated, not
  rewritten). (1) The "tiny non-monotonic wobble" clamp: the arc's pass-
  through of its rightmost point was a symptom of the inverted centre, and
  clamping it produced a 20° crease. (2) The rack-only camera angle: the
  "rasterizer artifact" at the end teeth was the groove seen in silhouette —
  the grazing angle didn't create it, it made it the one place the profile
  could be read. `OnRackChecked` no longer nudges the camera and the rack
  renders clean under the shared default view. The tangent-length check done
  at the time verified the *tooth's own* acute base corner
  (90° − α → ρ·tan(45° + α/2)), i.e. it confirmed the construction against
  itself. Lesson, recorded in the memory notes too: validity, manifoldness and
  self-consistency cannot tell a valid polygon of the wrong shape from the
  right one — a fillet needs a check of *which side the material is on*,
  against an external formula.
- Rack and worm thumbnails regenerated; both families re-rendered through the
  WPF pipeline and re-imported into SolidWorks.

## Helical flank was 359 µm off the true helicoid between loft sections; now an exact sweep

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

*Annotation (2026-09-10): the "wobble" this entry fixes in worm was a symptom
of the inverted fillet circle described in the top entry, and the monotonic
clamp applied here was later removed; the finding that spur/helical/bevel/
internal use a different, sound construction stands.*

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

*Annotation (2026-09-10): both conclusions below were wrong, and are retracted
in the top entry. The notch the user saw was real geometry — the fillet circle
was on the wrong side of the flank, leaving a groove under every tooth — which
the end teeth showed in silhouette at the default camera angle. The "tiny
non-monotonic wobble" was a symptom of the same inversion, and the camera nudge
hid the evidence rather than fixing anything; both changes have been removed.
The investigation's checks (validity, crossings, manifoldness, matching
hand-calculated points) all pass on a wrong-shaped but valid polygon, which is
why they found nothing. Kept as written for the record.*

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
