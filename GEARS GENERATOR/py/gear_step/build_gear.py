"""
Build the exact 3D spur/helical gear solid from GearParams and export it.

- STEP (.step): true B-rep solid via OpenCASCADE (build123d), exact extrusion
  (spur) or twisted loft (helical) of the validated 2D tooth profile — see
  involute.py / docs/gear-math.md, section 7 for the helical case.
- DXF (.dxf): the flat 2D tooth profile (transverse cross-section for a
  helical gear), for use in the user's own CAD/CAM.

Usage: python build_gear.py  (writes sample gears into ./out/)
"""
from __future__ import annotations

import math
from pathlib import Path

import build123d as bd
import ezdxf

from involute import GearParams, full_gear_outline
from bevel import BevelGearParams, bevel_tooth_stations, root_cone_profile
from worm import WormParams, build_worm_solid, thread_axial_profile
from rack import RackParams, rack_outline, rack_hole_centres
from internal import InternalGearParams, internal_gear_outline, internal_gear_outer_outline


def _rotate_points(pts: list[tuple[float, float]], angle_rad: float) -> list[tuple[float, float]]:
    c, s = math.cos(angle_rad), math.sin(angle_rad)
    return [(c * x - s * y, s * x + c * y) for (x, y) in pts]


def _export_step_for_solidworks(shape, path: str | Path) -> None:
    """Export to STEP in the specific shape SolidWorks' translator actually
    accepts. Found by testing real SolidWorks import, and revised once
    already after the first fix looked right but wasn't (worth recording the
    correction, not just the final answer):

    1) First measurement: a bare bd.Solid exports via OCCT 7.9 as an
       ADVANCED_BREP_SHAPE_REPRESENTATION -- valid STEP AP214, round-trips
       fine through build123d/OCCT itself -- but SolidWorks' translator
       rejects it with a generic "error code 1". Reproduced for spur, rack,
       and a freshly-fused worm alike.
    2) First fix attempt: `if not isinstance(shape, bd.Compound): wrap it`.
       Looked right, wasn't: build123d's own `BuildPart().part` result is
       ALREADY an instance of Compound (its `Part` return type subclasses
       Compound, and its underlying OCCT shape is already TopAbs_COMPOUND
       too -- confirmed via .wrapped.ShapeType(), not just the Python class),
       so the isinstance check skipped spur/rack/internal entirely and they
       kept failing. The bug wasn't "is it a Compound" at all -- it's some
       provenance/tagging OCCT's STEP writer attaches to a BuildPart-built
       shape specifically, invisible at the Python-type or raw-topology
       level.
    3) Actual fix, confirmed by testing every family, not just the one that
       prompted this: unconditionally extract every solid via `.solids()`
       and rebuild a FRESH Compound from those raw Solid objects. A Compound
       built this way -- with no BuildPart lineage at all -- exports via the
       plainer SHAPE_REPRESENTATION entity that SolidWorks accepts, whether
       the input was a bare Solid (spur, rack, a fused worm) or already a
       multi-body Compound (bevel, a multi-start worm): `.solids()` recurses
       through either correctly, and re-wrapping an already-fine multi-body
       Compound this way is a harmless no-op for SolidWorks (same body
       count, still opens as a multi-body part)."""
    bd.export_step(bd.Compound(children=list(shape.solids())), str(path))


def _face_at(pts: list[tuple[float, float]], angle_rad: float, z: float) -> bd.Face:
    rotated = _rotate_points(pts, angle_rad)
    closed = rotated + [rotated[0]]
    with bd.BuildSketch(bd.Plane.XY.offset(z)) as sk:
        with bd.BuildLine():
            bd.Polyline(*closed)
        bd.make_face()
    return sk.sketch.faces()[0]


def build_gear_solid(gp: GearParams, simplify_tolerance_mm: float | None = None) -> bd.Part:
    """Build the validated 2D outline into a solid, cut the bore if any.

    A spur gear (helix_angle_deg == 0) is a plain straight extrusion. A
    helical gear is an exact helicoidal sweep of the same transverse profile
    (OpenCASCADE's twist-extrude) -- see docs/gear-math.md section 7.3,
    including why this replaced the earlier ruled loft through rotated
    copies (measured flank error between copies, not just shading).

    simplify_tolerance_mm trims the boolean-sweep's dense point sampling down
    to a CAD-reasonable polyline before extrusion (involute.full_gear_outline's
    docstring). Default: 10 microns (spur) -- well under any real machining
    tolerance -- or 50 microns for a helical gear: the sweep turns every
    polyline edge into one continuous swept face, so a finer polyline means
    proportionally more faces in the STEP file for no gain in flank accuracy
    (the sweep itself is exact along the twist); 50 microns is still far
    tighter than any machining tolerance."""
    twist = gp.twist_total_rad
    if simplify_tolerance_mm is None:
        simplify_tolerance_mm = 0.01 if abs(twist) < 1e-9 else 0.05

    outline = full_gear_outline(gp, simplify_tolerance_mm=simplify_tolerance_mm)
    pts = [tuple(p) for p in outline]

    with bd.BuildPart() as part:
        if abs(twist) < 1e-9:
            closed = pts + [pts[0]]
            with bd.BuildSketch() as sk:
                with bd.BuildLine():
                    bd.Polyline(*closed)
                bd.make_face()
            bd.extrude(amount=gp.face_width_mm)
        else:
            # An exact helicoidal sweep: the transverse profile extruded
            # along +Z while rotating by the total twist -- OpenCASCADE's
            # own twist-extrude, so every point of the profile follows its
            # true helix, not a chord between sampled copies.
            #
            # This replaced a ruled loft through ~1 rotated copy per 3deg of
            # twist, and the reason is a measurement, not a preference: that
            # loft passes through each copy exactly (so checking twist at the
            # end faces, as the original verification did, sees nothing
            # wrong) but BETWEEN copies the surface is not the helicoid --
            # sectioning the built solid at 25/50/75% of the face width and
            # measuring against the exactly-rotated profile found 359 um
            # (14% of module) of flank error at mid-facet on a routine
            # 25deg/16mm gear and 1.3 mm (53% of module) on a 35deg/40mm
            # one, versus 0 um at every section plane. The error scaled
            # linearly with the per-copy rotation, not quadratically like a
            # chord's sagitta, i.e. the loft was not pairing profile points
            # one-to-one between rotated copies; a smooth (ruled=False) loft
            # was no better (270 um - 3.4 mm, and +2% volume overshoot at
            # some section counts). The twist-extrude measured 0.0 um on
            # both gears by the same check, is ~10x faster to build, and
            # yields one continuous face per profile edge (~290) instead of
            # one flat strip per edge per section (1700-5200). The check is
            # now a regression test (tests/test_involute.py).
            base = _face_at(pts, 0.0, 0.0)
            bd.add(bd.Solid.extrude_linear_with_rotation(
                base, (0, 0, 0), (0, 0, gp.face_width_mm), math.degrees(twist)))

        if gp.bore_diameter_mm > 0:
            with bd.BuildSketch(part.faces().sort_by(bd.Axis.Z)[-1]) as bore_sk:
                bd.Circle(gp.bore_diameter_mm / 2.0)
            bd.extrude(amount=-gp.face_width_mm, mode=bd.Mode.SUBTRACT)

    return part.part


def build_double_helical_solid(gp: GearParams, gap_mm: float = 0.0,
                               simplify_tolerance_mm: float | None = None) -> bd.Part:
    """A double-helical (herringbone) gear: two helical halves of opposite
    hand sharing one transverse profile, mirror-symmetric about the
    mid-plane of the face so the axial thrust each half generates cancels
    -- docs/gear-math.md section 7.4.

    Each half is the same exact helicoidal sweep build_gear_solid uses (so
    the flank-accuracy argument there carries over unchanged; it is also
    re-measured by tests/test_herringbone.py the same way). The lower half
    sweeps the un-rotated profile from z=0 to z=half_fw, twisting by
    twist_half = twist_total * half_fw / face_width in gp's hand; the upper
    half starts at z = half_fw + gap_mm from the profile PRE-rotated by that
    same twist_half and sweeps back to zero twist at z = face_width. So the
    two meet (gap_mm == 0) at the mid-plane in the same rotated profile --
    the apex of the V -- and both end faces carry the un-rotated profile.
    gp.hand is the LOWER half's hand (the upper is the opposite by
    construction): a herringbone as a whole has no hand.

    gap_mm > 0 leaves a centre groove between the halves (the runout
    clearance a hobbed double-helical gear needs; a true herringbone cut in
    one piece has none), filled by a cylinder at the root diameter so the
    part stays one solid. The bore is cut through everything last."""
    if abs(gp.helix_angle_deg) < 1e-9:
        raise ValueError("a double-helical gear needs a nonzero helix angle (0deg is a spur gear)")
    if gap_mm < 0 or gap_mm >= gp.face_width_mm:
        raise ValueError("the centre gap must be >= 0 and smaller than the face width")
    if simplify_tolerance_mm is None:
        simplify_tolerance_mm = 0.05  # same reasoning as build_gear_solid's helical default

    outline = full_gear_outline(gp, simplify_tolerance_mm=simplify_tolerance_mm)
    pts = [tuple(p) for p in outline]
    half_fw = (gp.face_width_mm - gap_mm) / 2.0
    twist_half = gp.twist_total_rad * half_fw / gp.face_width_mm
    z_upper = half_fw + gap_mm

    with bd.BuildPart() as part:
        lower = _face_at(pts, 0.0, 0.0)
        bd.add(bd.Solid.extrude_linear_with_rotation(
            lower, (0, 0, 0), (0, 0, half_fw), math.degrees(twist_half)))
        upper = _face_at(pts, twist_half, z_upper)
        bd.add(bd.Solid.extrude_linear_with_rotation(
            upper, (0, 0, z_upper), (0, 0, half_fw), math.degrees(-twist_half)))
        if gap_mm > 0:
            bd.add(bd.Solid.make_cylinder(gp.dedendum_radius, gap_mm, bd.Plane((0, 0, half_fw))))
        if gp.bore_diameter_mm > 0:
            with bd.BuildSketch(part.faces().sort_by(bd.Axis.Z)[-1]) as bore_sk:
                bd.Circle(gp.bore_diameter_mm / 2.0)
            bd.extrude(amount=-gp.face_width_mm, mode=bd.Mode.SUBTRACT)

    return part.part


def _make_bevel_tooth_solid(toe: list, heel: list) -> bd.Solid:
    """One tooth as a proper closed, manifold solid.

    The toe and heel loops each trace a full tooth outline (flank, tip,
    root fillet) wrapped onto the pitch cone -- and, unlike a station of a
    helical or worm sweep (every point of which shares a single flat
    cutting plane), the points around ONE of these loops do NOT lie in a
    single plane: 'actual_angle' (bevel.py's flat_point_to_cone) varies
    continuously as you trace flank -> tip -> flank -> root, so the loop is
    a genuinely non-planar closed space curve on the cone's surface (like a
    small circle drawn on a sphere isn't a planar curve). Confirmed
    directly: bd.Face(toe_wire) raises "wires not planar".

    That matters because bd.Solid.make_loft(..., ruled=True)'s automatic
    end-capping (OpenCASCADE's BRepOffsetAPI_ThruSections with isSolid=True)
    silently fails to cap a non-planar boundary wire -- it still returns
    something with a computed volume (so nothing raises), but the shell is
    actually open at both ends, i.e. NOT a closed solid. Found this by
    checking is_manifold (False) on a single tooth in complete isolation,
    then confirming face count == vertex count exactly (no extra cap
    faces) and that bd.Face(toe_wire) rejects the wire as non-planar.

    Fix: build the ruled side surface exactly as before, then cap both
    ends explicitly with bd.Face.make_surface (a general filling face that
    accepts a non-planar boundary, unlike a plain flat Face), and sew the
    result into a proper closed Shell/Solid. The volume this produces is
    the CORRECT one -- ~50% more than the old open-shell's heuristic
    volume for the same tooth, confirming the old value wasn't trustworthy
    either, not just the manifold flag."""
    toe_wire = bd.Wire.make_polygon(toe, close=True)
    heel_wire = bd.Wire.make_polygon(heel, close=True)
    side = bd.Solid.make_loft([toe_wire, heel_wire], ruled=True)
    toe_cap = bd.Face.make_surface(toe_wire)
    heel_cap = bd.Face.make_surface(heel_wire)
    shell = bd.Shell(list(side.faces()) + [toe_cap, heel_cap])
    return bd.Solid(shell)


def build_bevel_gear_solid(bp: BevelGearParams, n_phi: int = 240,
                            simplify_tolerance_mm: float = 0.02) -> bd.Compound:
    """Build a straight bevel gear solid: a root-cone blank (revolve) plus all
    z teeth, each an exact ruled loft between its toe and heel 3D point loops
    -- see docs/gear-math.md section 8. A bore, if any, is already built into
    the blank's revolve profile (root_cone_profile), not a separate cut.

    This is a Compound of the blank + z separately-built tooth solids, NOT
    one boolean-fused Solid -- a tradeoff worm gears (build_worm_solid) also
    made for a while, for what looked like the same reason, but turned out
    NOT to be the same reason on closer inspection: worm's fuse hang was
    specifically sequential pairwise fusing, and a single N-ary fuse
    (core.fuse(*threads)) turned out to be fast and reliable there, so it now
    returns one true fused Solid. That fix does NOT apply here -- bevel's own
    N-ary fuse was tried too (case 2 below) and genuinely fails differently
    on real cases, not just slowly. Found by measuring, not assumed, that
    OpenCASCADE's boolean fuse is not reliable here specifically. Both fuse
    strategies were tried and both have real failure modes, confirmed by
    testing a spread of z/module/bore/shaft-angle combinations, not just the
    one case that first surfaced the bug:
      1. A loop of z sequential pairwise fuses (solid = solid.fuse(tooth))
         fuses cleanly for the first several teeth on some gears (e.g. z=12,
         small module, bored), then a later fuse against the now-more-
         complex accumulated body silently collapses to a degenerate
         zero-volume result -- every remaining tooth then just becomes its
         own disconnected fragment (traced step-by-step by printing volume
         and solid count after each fuse and finding the exact tooth where
         it broke).
      2. A single N-ary fuse (blank.fuse(*teeth), one call) avoids that
         particular failure and IS reliable for several cases -- but fails
         differently on others (an empty zero-solid result for the same
         z=12 bored case at a different point count; a non-manifold result
         for a shallow-angle small pinion, z=8 mating a 30-tooth gear).
    A Compound of the individually-built pieces sidesteps OpenCASCADE's
    boolean algorithm entirely for the blank/tooth join, and was confirmed
    manifold, with exactly z+1 bodies (none dropped, none merged) and a
    sane total volume, across every case that broke one or both fuse
    strategies above -- and is faster besides (no boolean work at all).
    The tradeoff: SolidWorks sees a multi-body part (one body per tooth
    plus the blank) rather than one fused solid -- unlike the worm, which
    no longer has this tradeoff (see build_worm_solid's own docstring)."""
    profile_pts = root_cone_profile(bp)
    with bd.BuildPart() as blank_part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*profile_pts, profile_pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    blank = blank_part.part

    teeth = []
    for k in range(bp.z):
        toe, heel = bevel_tooth_stations(bp, tooth_index=k, n_phi=n_phi,
                                          simplify_tolerance_mm=simplify_tolerance_mm)
        teeth.append(_make_bevel_tooth_solid(toe, heel))

    return bd.Compound(children=[blank, *teeth])


def export_step(gp: GearParams, path: str | Path) -> None:
    solid = build_gear_solid(gp)
    _export_step_for_solidworks(solid, path)


def export_double_helical_step(gp: GearParams, gap_mm: float, path: str | Path) -> None:
    _export_step_for_solidworks(build_double_helical_solid(gp, gap_mm=gap_mm), path)


def export_bevel_step(bp: BevelGearParams, path: str | Path) -> None:
    solid = build_bevel_gear_solid(bp)
    _export_step_for_solidworks(solid, path)


def export_bevel_heel_profile_dxf(bp: BevelGearParams, path: str | Path) -> None:
    """Flat 2D tooth profile at the heel (large end) -- the Tredgold virtual
    spur gear's single-tooth shape (docs/gear-math.md 8.1), for reference /
    verification (e.g. against a gear tooth vernier at the outer diameter).
    Not a flat pattern for the whole gear -- a bevel gear's surface can't be
    unrolled flat (that's the entire reason Tredgold's approximation exists)."""
    from involute import single_tooth_polygon
    flat_gp = bp.to_flat_gear_params()
    tooth = single_tooth_polygon(flat_gp, z_virtual=bp.z_virtual)
    tooth = tooth.simplify(0.01, preserve_topology=True)
    coords = list(tooth.exterior.coords)
    rf_flat = flat_gp.dedendum_radius
    coords = [(x, y) for (x, y) in coords if (x * x + y * y) ** 0.5 >= rf_flat - 1e-6]

    doc = ezdxf.new(dxfversion="R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    pts = list(coords)
    pts.append(pts[0])
    msp.add_lwpolyline(pts, format="xy", dxfattribs={"closed": False})
    doc.saveas(str(path))


def export_worm_step(wp: WormParams, path: str | Path, n_per_turn: int = 40) -> None:
    solid = build_worm_solid(wp, n_per_turn=n_per_turn)
    _export_step_for_solidworks(solid, path)


def export_worm_profile_dxf(wp: WormParams, path: str | Path) -> None:
    """Flat 2D axial thread profile (one thread, trapezoid) -- this IS a true
    flat pattern (unlike bevel's heel-only reference): a worm thread's axial
    section is genuinely flat/constant along its own generating line, so this
    is directly useful for verifying against a thread gauge or for cutting
    reference."""
    pts = thread_axial_profile(wp)
    doc = ezdxf.new(dxfversion="R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    closed = list(pts) + [pts[0]]
    msp.add_lwpolyline(closed, format="xy", dxfattribs={"closed": True})
    doc.saveas(str(path))


def build_rack_solid(rp: RackParams) -> bd.Part:
    """A rack: the validated 2D cross-section (rack.rack_outline -- see
    docs/gear-math.md section 10) extruded along face_width_mm (the axis the
    mating gear's own face width runs along, same convention as a spur
    gear's own extrusion), with mounting holes cut through the backing bar
    if bore_diameter_mm > 0 -- one per tooth pitch, through the full
    thickness (same direction as the extrusion, not through the profile)."""
    pts = rack_outline(rp)
    closed = pts + [pts[0]]
    with bd.BuildPart() as part:
        with bd.BuildSketch() as sk:
            with bd.BuildLine():
                bd.Polyline(*closed)
            bd.make_face()
        bd.extrude(amount=rp.face_width_mm)

        holes = rack_hole_centres(rp)
        if holes:
            with bd.BuildSketch(part.faces().sort_by(bd.Axis.Z)[-1]) as hole_sk:
                with bd.Locations(*holes):
                    bd.Circle(rp.bore_diameter_mm / 2.0)
            bd.extrude(amount=-rp.face_width_mm, mode=bd.Mode.SUBTRACT)

    return part.part


def export_rack_step(rp: RackParams, path: str | Path) -> None:
    solid = build_rack_solid(rp)
    _export_step_for_solidworks(solid, path)


def export_rack_profile_dxf(rp: RackParams, path: str | Path) -> None:
    """Flat 2D rack cross-section -- a true flat pattern (the rack profile is
    constant along its own length), for the user's own CAD/CAM."""
    pts = rack_outline(rp)
    doc = ezdxf.new(dxfversion="R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    closed = list(pts) + [pts[0]]
    msp.add_lwpolyline(closed, format="xy", dxfattribs={"closed": True})
    doc.saveas(str(path))


def build_internal_gear_solid(ip: InternalGearParams, simplify_tolerance_mm: float = 0.03) -> bd.Part:
    """An internal (ring) gear: the validated annulus-with-inward-teeth
    cross-section (internal.py -- see docs/gear-math.md section 11)
    extruded along face_width_mm. Built from an outer circular wire plus a
    genuinely separate INNER toothed wire (a real hole, not a solid disk)
    via bd.Face(outer_wire, [inner_wire]) -- confirmed by checking the
    volume against a bore-less disk of the same outer dimensions and
    finding it meaningfully smaller (an earlier version of this recipe
    silently produced a solid disk with NO bore at all, its volume within
    0.1% of the holeless figure -- caught by measuring, not by eyeballing a
    render at a scale where the missing bore wasn't obvious).

    simplify_tolerance_mm loosens internal_gear_outline's own tight default
    (1 micron, meant for on-screen 2D preview) before extrusion -- a whole
    ring's inner boundary repeats that density z times, so left at the tight
    default a single z=40 ring's STEP file came out at 16.6MB (vs ~1MB for
    a comparable external gear); 30 microns is still far tighter than any
    real machining tolerance and cut that by an order of magnitude."""
    outer_pts = internal_gear_outer_outline(ip)
    inner_pts = internal_gear_outline(ip, simplify_tolerance_mm=simplify_tolerance_mm)

    outer_wire = bd.Wire.make_polygon([(*p, 0) for p in outer_pts], close=True)
    inner_wire = bd.Wire.make_polygon([(*p, 0) for p in inner_pts], close=True)
    face = bd.Face(outer_wire, [inner_wire])

    with bd.BuildPart() as part:
        with bd.BuildSketch() as sk:
            bd.add(face)
        bd.extrude(amount=ip.face_width_mm)

    return part.part


def export_internal_gear_step(ip: InternalGearParams, path: str | Path) -> None:
    solid = build_internal_gear_solid(ip)
    _export_step_for_solidworks(solid, path)


def export_internal_gear_profile_dxf(ip: InternalGearParams, path: str | Path) -> None:
    """Flat 2D cross-section (outer circle + inner toothed bore) for the
    user's own CAD/CAM -- both boundaries in one file, as two closed
    polylines."""
    outer_pts = internal_gear_outer_outline(ip)
    inner_pts = internal_gear_outline(ip)
    doc = ezdxf.new(dxfversion="R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    msp.add_lwpolyline(list(outer_pts) + [outer_pts[0]], format="xy", dxfattribs={"closed": True})
    msp.add_lwpolyline(list(inner_pts) + [inner_pts[0]], format="xy", dxfattribs={"closed": True})
    doc.saveas(str(path))


def export_dxf_profile(gp: GearParams, path: str | Path) -> None:
    """Flat 2D tooth profile (the full gear outline) as a DXF the user can
    load into their own CAD/CAM system — polyline in the XY plane, mm."""
    outline = full_gear_outline(gp)
    doc = ezdxf.new(dxfversion="R2010")
    doc.units = ezdxf.units.MM
    msp = doc.modelspace()
    pts = [tuple(p) for p in outline]
    pts.append(pts[0])
    msp.add_lwpolyline(pts, format="xy", dxfattribs={"closed": True})
    doc.saveas(str(path))


if __name__ == "__main__":
    out = Path(__file__).parent / "out"
    out.mkdir(exist_ok=True)

    samples = [
        ("spur_m2_z20_a20", GearParams.from_metric(z=20, module_mm=2.0, face_width_mm=12.0, bore_diameter_mm=8.0)),
        ("spur_m2_z8_a20_undercut", GearParams.from_metric(z=8, module_mm=2.0, face_width_mm=10.0, bore_diameter_mm=5.0)),
        ("spur_dp10_z24_inch", GearParams.from_inch(z=24, diametral_pitch=10.0, face_width_mm=10.0, bore_diameter_mm=6.0)),
        ("helical_m2_z20_a20_h20_right", GearParams.from_metric(
            z=20, module_mm=2.0, face_width_mm=15.0, bore_diameter_mm=8.0,
            helix_angle_deg=20.0, hand="right")),
        ("helical_m2_z20_a20_h20_left", GearParams.from_metric(
            z=20, module_mm=2.0, face_width_mm=15.0, bore_diameter_mm=8.0,
            helix_angle_deg=20.0, hand="left")),
    ]

    for name, gp in samples:
        step_path = out / f"{name}.step"
        dxf_path = out / f"{name}.dxf"
        print(f"building {name}: z={gp.z} m={gp.module_mm:.4f}mm alpha={gp.pressure_angle_deg}deg ...")
        export_step(gp, step_path)
        export_dxf_profile(gp, dxf_path)
        print(f"  wrote {step_path.name}, {dxf_path.name}")

    bevel_samples = [
        ("bevel_m3_z20_mate20_90deg", BevelGearParams(
            z=20, module_mm=3.0, mate_teeth=20, shaft_angle_deg=90.0,
            face_width_mm=10.0, bore_diameter_mm=8.0)),
    ]
    for name, bp in bevel_samples:
        step_path = out / f"{name}.step"
        dxf_path = out / f"{name}_heel_profile.dxf"
        print(f"building {name}: z={bp.z} m={bp.module_mm}mm pitch_angle={bp.pitch_angle_deg:.2f}deg ...")
        export_bevel_step(bp, step_path)
        export_bevel_heel_profile_dxf(bp, dxf_path)
        print(f"  wrote {step_path.name}, {dxf_path.name}")

    print("done.")
