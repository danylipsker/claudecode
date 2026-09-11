"""
Automated checks for face gears (docs/gear-math.md section 17).
Run with: python -m pytest gear_step/tests/test_face_gear.py -v
"""
import math
import sys
import tempfile
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from build_gear import build_gear_solid
from face_gear import (FaceGearParams, build_face_gear_solid, blank_solid, space_cutter, place_pinion,
                       face_gear_turn_deg, tooth_at_bottom_spin_deg, sweep_half_angle_rad)
from meshcheck import interpenetration_volume, tessellated_volume


def _fp(**kw) -> FaceGearParams:
    base = dict(z=40, pinion_teeth=20, module_mm=2.0, rim_thickness_mm=4.0)
    base.update(kw)
    return FaceGearParams(**base)


def test_parameters_limits_and_the_bottom_tooth_spin():
    fp = _fp()
    assert abs(fp.nominal_radius - 40.0) < 1e-12
    assert fp.z_shaper == 20 and _fp(shaper_teeth=22).z_shaper == 22
    assert abs(fp.ratio - 2.0) < 1e-12
    # the rack-equivalent section: at R_0 it IS the standard rack (top land
    # pi m/2 - 2 m tan(alpha) = 0.843 m), the undercut limit is the closed
    # form, the pointing limit is where the top land vanishes, and the top
    # land falls monotonically with the radius
    a = math.radians(20.0)
    assert abs(fp.top_land_at(40.0) - (math.pi * 2.0 / 2.0 - 2 * 2.0 * math.tan(a))) < 1e-9
    l1, l2 = fp.undercut_radius, fp.pointing_radius
    assert abs(l1 - 40.0 * math.cos(a) ** 2 / (1.0 - 2.0 / 20.0)) < 1e-9
    assert abs(fp.top_land_at(l2)) < 1e-9 and l1 < 40.0 < l2
    lands = [fp.top_land_at(r) for r in (l1, 40.0, 42.0, 44.0, l2)]
    assert all(x > y for x, y in zip(lands, lands[1:]))
    assert math.isnan(fp.top_land_at(30.0))          # inside R_0 cos(alpha): no involute contact at all
    # the auto ring keeps 10 % of the usable width clear at each end
    assert abs(fp.inner_radius - (l1 + 0.1 * (l2 - l1))) < 1e-12
    assert abs(fp.outer_radius - (l2 - 0.1 * (l2 - l1))) < 1e-12
    assert _fp(inner_radius_mm=41.0).inner_radius == 41.0
    # the sweep reaches past the bottom tooth's exit angle by a shaper pitch
    exit_deg = math.degrees(math.acos((20.0 - 2.0) / (20.0 + 2.5)))
    assert abs(math.degrees(sweep_half_angle_rad(fp)) - (exit_deg + 18.0 + 3.0)) < 1e-9
    # a tooth centre lands on the gear's own +X (the bottom, once laid on X)
    # exactly when z is divisible by 4; otherwise the spin brings one there
    assert tooth_at_bottom_spin_deg(20) == 0.0
    assert abs(tooth_at_bottom_spin_deg(22) + 90.0 % (360.0 / 22)) < 1e-12
    assert abs(tooth_at_bottom_spin_deg(21) + 90.0 % (360.0 / 21)) < 1e-12


def test_space_tool_is_one_valid_solid_of_few_faces_cut_to_the_shaper_addendum_within_the_ring():
    """The generated space's floor is where the shaper's tip passes -- its
    addendum, i.e. the face gear's dedendum below the pitch plane -- the
    tool overshoots the addendum plane, spans the ring plus 0.3 mm either
    side (its flat ends in the air over the relieved disc and beyond the
    rim), never reaches past its own pitch wedge (so patterned copies
    cannot overlap), and is ONE valid solid of six faces (the whole point
    of lofting the swept sections instead of cutting position by
    position)."""
    fp = _fp()
    t0 = time.time()
    tool = space_cutter(fp)
    dt = time.time() - t0
    assert tool.is_valid and len(tool.solids()) == 1
    assert len(tool.faces()) == 6, len(tool.faces())
    bb = tool.bounding_box(optimal=True)
    assert abs(bb.min.Z + fp.dedendum) < 0.05, bb.min.Z          # floor at -hf
    assert bb.max.Z > fp.addendum                                 # overshoots the addendum plane (clean cut)
    assert abs(bb.min.X - (fp.inner_radius - 0.3)) < 1e-6 and abs(bb.max.X - (fp.outer_radius + 0.3)) < 1e-6
    assert bb.max.Y <= (fp.outer_radius + 0.3) * math.tan(math.pi / fp.z) + 1e-6   # within its own pitch wedge
    print(f"space tool built in {dt:.1f}s with {len(tool.faces())} faces")


def _top_land_measured(gear, fp: FaceGearParams, radius: float) -> float:
    """The top land of the tooth centred at half a pitch, measured between
    the two corners its planar top face has on the cylinder r = radius."""
    half_pitch = math.pi / fp.z
    for f in gear.faces():
        c = f.center()
        if abs(c.Z - fp.addendum) > 1e-6 or abs(f.normal_at().Z - 1.0) > 1e-6:
            continue
        if abs(math.atan2(c.Y, c.X) - half_pitch) > 0.5 * half_pitch:
            continue
        corners = [v for v in f.vertices() if abs(math.hypot(v.X, v.Y) - radius) < 1e-3]
        assert len(corners) == 2, [(v.X, v.Y) for v in corners]
        angles = sorted(math.atan2(v.Y, v.X) for v in corners)
        return 2.0 * radius * math.sin(0.5 * (angles[1] - angles[0]))
    raise AssertionError("no top-land face found on the first tooth")


def test_face_gear_is_one_manifold_body_whose_top_lands_match_the_section_formula_and_round_trips_as_step():
    from build_gear import export_face_gear_step
    fp = _fp(bore_diameter_mm=12.0)
    t0 = time.time()
    g = build_face_gear_solid(fp)
    dt = time.time() - t0
    bodies = g.solids()
    assert len(bodies) == 1 and bodies[0].is_manifold and g.is_valid
    assert len(g.faces()) < 6 * fp.z, len(g.faces())      # a few faces per space, not one per sweep position
    blank = blank_solid(fp)
    # volumes from the tessellation: OpenCASCADE's default volume was 10-35 %
    # low on these lofted faces (meshcheck.tessellated_volume says why)
    removed = tessellated_volume(blank) - tessellated_volume(bodies[0])
    per_space = removed / fp.z
    # each space removes roughly a tooth-space's worth: a rectangle of
    # (pitch/2) x full depth x ring width is the crude upper-ish estimate
    pitch_len = math.pi * fp.module_mm
    crude = pitch_len / 2.0 * (fp.addendum + fp.dedendum) * (fp.outer_radius - fp.inner_radius)
    assert 0.5 * crude < per_space < 1.5 * crude, (per_space, crude)
    # and, exactly, what one space tool takes out of the blank (the boolean
    # volumes of tool-in-blank and blank-minus-tools agreed to the last digit)
    tool_in_blank = space_cutter(fp).intersect(blank)
    if isinstance(tool_in_blank, bd.ShapeList):
        tool_in_blank = bd.Compound(children=list(tool_in_blank))
    assert abs(per_space - tessellated_volume(tool_in_blank)) < 0.01 * per_space, (per_space, tessellated_volume(tool_in_blank))
    # the rack-equivalent formula behind L1/L2 against the exact envelope:
    # the top land the boolean model actually has at both ends of the ring
    for radius in (fp.inner_radius, fp.outer_radius):
        measured, predicted = _top_land_measured(g, fp, radius), fp.top_land_at(radius)
        print(f"top land at r={radius:.2f}: measured {measured:.3f}, formula {predicted:.3f}")
        assert abs(measured - predicted) < 0.1 * fp.module_mm, (radius, measured, predicted)
    assert _top_land_measured(g, fp, fp.inner_radius) > _top_land_measured(g, fp, fp.outer_radius)
    print(f"face gear z=40 built in {dt:.1f}s, {len(g.faces())} faces")
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "face_gear.step"
        export_face_gear_step(fp, path)
        # 40 lofted faces of 82 x 12 poles plus slimmed edges, no pcurves:
        # a few MB (it was 96 MB before the sections shared a knot vector,
        # 21.7 MB before the edge diet and the pcurve switch)
        assert path.stat().st_size < 8_000_000, path.stat().st_size
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 1 and imported.is_valid
        assert abs(tessellated_volume(imported) - tessellated_volume(bodies[0])) < 0.001 * tessellated_volume(bodies[0])


@pytest.mark.parametrize("shaper_teeth", [0, 22])
def test_pinion_meshes_through_the_face_gear_and_a_half_pitch_error_collides(shaper_teeth):
    """The one check that fails if the envelope, the kinematic ratio, the
    tooth phase or the clearances are wrong: the real pinion placed in mesh
    at four rotation phases (the face gear turned by delta z_p/z for each
    pinion turn of delta) overlaps the built face gear by no more than
    sliver contact (the two outlines' 0.02 mm polyline tolerance), and
    turned half a pitch it collides. With a shaper of two more teeth than
    the pinion the space is slightly wider (localized contact), so the
    pinion still clears."""
    fp = _fp(shaper_teeth=shaper_teeth)
    gear = build_face_gear_solid(fp)
    pinion = build_gear_solid(fp.pinion_params(), simplify_tolerance_mm=0.02)
    ref = pinion.volume
    worst = 0.0
    for turn in (0.0, 4.5, 9.0, 13.5):   # a quarter of the pinion pitch each, over most of a pitch
        g = gear.rotate(bd.Axis.Z, face_gear_turn_deg(fp, turn))
        p = place_pinion(pinion, fp, pinion_turn_deg=turn)
        worst = max(worst, interpenetration_volume(g, p))
    bad = interpenetration_volume(gear, place_pinion(pinion, fp, phase_error_deg=180.0 / fp.pinion_teeth))
    print(f"shaper {fp.z_shaper}: worst in-phase overlap {worst:.4f} mm^3 of {ref:.0f}, mis-phased {bad:.1f}")
    assert worst < 1e-4 * ref, (shaper_teeth, worst, ref)
    assert bad > 5e-3 * ref and bad > 50 * max(worst, 1e-9), (shaper_teeth, worst, bad, ref)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
