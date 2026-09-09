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


def _rotate_points(pts: list[tuple[float, float]], angle_rad: float) -> list[tuple[float, float]]:
    c, s = math.cos(angle_rad), math.sin(angle_rad)
    return [(c * x - s * y, s * x + c * y) for (x, y) in pts]


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
    helical gear is a loft through N copies of the same transverse profile,
    each progressively rotated -- see docs/gear-math.md section 7.3 for why
    ruled=True and how N is chosen from the twist magnitude.

    simplify_tolerance_mm trims the boolean-sweep's dense point sampling down
    to a CAD-reasonable polyline before extrusion (involute.full_gear_outline's
    docstring). Default: 10 microns (spur) -- well under any real machining
    tolerance -- or 50 microns for a helical gear, since the loft repeats
    every point once per section and file size scales with points x
    sections; still far tighter than machining tolerance, just less
    unnecessarily dense given the multiplier."""
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
            # ~1 loft section per 3 degrees of local twist -- straight-line
            # (ruled) segments between finely-spaced rotated copies converge
            # to the true helicoid flank (docs/gear-math.md 7.3), the same
            # "dense sampling of an exact construction" principle used for
            # the root-fillet envelope.
            n_sections = max(2, min(40, math.ceil(abs(twist) / math.radians(3))))
            sections = [
                _face_at(pts, (i / n_sections) * twist, (i / n_sections) * gp.face_width_mm)
                for i in range(n_sections + 1)
            ]
            bd.loft(sections, ruled=True)

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
    one boolean-fused Solid -- the same tradeoff already made for worm gears
    (build_worm_solid), and for the same underlying reason: found by
    measuring, not assumed, that OpenCASCADE's boolean fuse is not reliable
    here. Both fuse strategies were tried and both have real failure modes,
    confirmed by testing a spread of z/module/bore/shaft-angle combinations,
    not just the one case that first surfaced the bug:
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
    The tradeoff, as with the worm: SolidWorks sees a multi-body part (one
    body per tooth plus the blank) rather than one fused solid."""
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
    bd.export_step(solid, str(path))


def export_bevel_step(bp: BevelGearParams, path: str | Path) -> None:
    solid = build_bevel_gear_solid(bp)
    bd.export_step(solid, str(path))


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
    bd.export_step(solid, str(path))


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
