"""
Automated checks for straight bevel gears (docs/gear-math.md section 8).
Run with: python -m pytest gear_step/tests/test_bevel.py -v
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from bevel import BevelGearParams, bevel_tooth_stations, flat_point_to_cone, root_cone_profile


def test_pitch_angle_90deg_shaft_matches_simple_formula():
    """Sigma=90deg reduces to the well-known gamma = atan(z/z2)."""
    bp = BevelGearParams(z=15, module_mm=2.0, mate_teeth=30, shaft_angle_deg=90.0, face_width_mm=8.0)
    expected = math.atan(15 / 30)
    assert abs(bp.pitch_angle_rad - expected) < 1e-12


def test_equal_teeth_90deg_shaft_gives_45deg():
    bp = BevelGearParams(z=24, module_mm=2.0, mate_teeth=24, shaft_angle_deg=90.0, face_width_mm=8.0)
    assert abs(bp.pitch_angle_deg - 45.0) < 1e-9


def test_virtual_teeth_formula():
    bp = BevelGearParams(z=20, module_mm=2.5, mate_teeth=30, shaft_angle_deg=90.0, face_width_mm=8.0)
    expected_zv = bp.z / math.cos(bp.pitch_angle_rad)
    assert abs(bp.z_virtual - expected_zv) < 1e-12
    # z_v must exceed the real z (the back cone's flat gear always has more
    # "virtual" teeth than the real cone, since cos(gamma) < 1 for gamma < 90)
    assert bp.z_virtual > bp.z


def test_pitch_line_lands_exactly_on_the_pitch_cone():
    """A point with zero deviation from the pitch line must satisfy
    radial/Z == tan(gamma) at every station, not just the two ends."""
    bp = BevelGearParams(z=18, module_mm=2.0, mate_teeth=27, shaft_angle_deg=90.0, face_width_mm=6.0)
    gamma = bp.pitch_angle_rad
    re = bp.outer_cone_distance
    heel_pitch_pt = (0.0, bp.heel_pitch_radius / math.cos(gamma))
    for frac in (0.0, 0.25, 0.5, 0.75, 1.0):
        s = re - frac * bp.face_width_mm
        x, y, z = flat_point_to_cone(*heel_pitch_pt, s, gamma, re, bp.heel_pitch_radius)
        radial = math.hypot(x, y)
        assert abs(radial / z - math.tan(gamma)) < 1e-9


def test_toe_is_a_correctly_scaled_smaller_copy_of_the_heel():
    bp = BevelGearParams(z=16, module_mm=2.0, mate_teeth=24, shaft_angle_deg=90.0, face_width_mm=6.0)
    toe_pts, heel_pts = bevel_tooth_stations(bp, n_phi=120)
    re = bp.outer_cone_distance
    s_toe = re - bp.face_width_mm
    k_expected = s_toe / re

    heel_max = max(math.hypot(x, y) for x, y, z in heel_pts)
    toe_max = max(math.hypot(x, y) for x, y, z in toe_pts)
    assert 0 < toe_max < heel_max
    # loose bracket: pure radial scale (k_expected) to no scale at all (1.0)
    assert k_expected * 0.85 < toe_max / heel_max < 1.0
    assert len(toe_pts) == len(heel_pts) > 3


def test_root_cone_profile_meets_teeth_at_the_root_radius():
    """The blank's root-cone surface, at the heel, must sit at exactly the
    same radius the tooth loops' lowest (root) points sit at -- otherwise the
    tooth solids wouldn't meet the blank cleanly."""
    bp = BevelGearParams(z=20, module_mm=2.5, mate_teeth=20, shaft_angle_deg=90.0,
                          face_width_mm=8.0, bore_diameter_mm=5.0)
    profile = root_cone_profile(bp)
    # profile = [(inner_r, z_toe), (r_toe, z_toe), (r_heel, z_heel), (inner_r, z_heel)]
    _, (r_toe_blank, _), (r_heel_blank, _), _ = profile

    toe_pts, heel_pts = bevel_tooth_stations(bp, n_phi=150)
    heel_min_radius = min(math.hypot(x, y) for x, y, z in heel_pts)
    toe_min_radius = min(math.hypot(x, y) for x, y, z in toe_pts)

    assert abs(heel_min_radius - r_heel_blank) < 0.05
    assert abs(toe_min_radius - r_toe_blank) < 0.05


def test_bore_radius_is_zero_means_solid_to_the_axis():
    bp = BevelGearParams(z=20, module_mm=2.0, mate_teeth=20, shaft_angle_deg=90.0,
                          face_width_mm=8.0, bore_diameter_mm=0.0)
    profile = root_cone_profile(bp)
    assert profile[0][0] == 0.0 and profile[3][0] == 0.0


def test_full_solid_builds_and_has_sane_volume():
    """End-to-end: the actual build123d solid (blank + all z teeth) builds
    without error and has a volume in a sane bracket (more than the plain
    root-cone blank, since teeth add material)."""
    import build123d as bd
    from build_gear import build_bevel_gear_solid

    bp = BevelGearParams(z=12, module_mm=2.5, mate_teeth=12, shaft_angle_deg=90.0,
                          face_width_mm=6.0, bore_diameter_mm=4.0)
    solid = build_bevel_gear_solid(bp, n_phi=100, simplify_tolerance_mm=0.03)
    assert solid.volume > 0

    profile_pts = root_cone_profile(bp)
    with bd.BuildPart() as blank_part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*profile_pts, profile_pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    blank_volume = blank_part.part.volume

    assert solid.volume > blank_volume  # teeth add material on top of the blank


def test_full_solid_is_manifold_with_one_body_per_tooth_plus_blank():
    """Regression test for two real bugs, both found by measuring (volume,
    is_manifold, body count), not by eye:

    1. A single tooth's toe/heel loop is a genuinely non-planar closed 3D
       curve (points trace flank -> tip -> flank -> root at continuously
       varying angle around the cone -- confirmed directly: bd.Face(wire)
       rejects it as non-planar). bd.Solid.make_loft(..., ruled=True)'s
       automatic end-capping silently fails on a non-planar boundary wire
       -- it still returns something with a computed (wrong, too-small)
       volume, so nothing raises, but the shell is open at both ends and
       is_manifold is False. Fixed by capping both ends explicitly with
       Face.make_surface (a general filling face, not a flat one) before
       sewing into a Solid.
    2. Even with correctly-built (individually manifold) teeth, fusing all
       z of them onto the blank is not reliably robust in OpenCASCADE: a
       loop of sequential pairwise fuses can silently corrupt partway
       through for some z/module/bore combinations (confirmed by tracing
       volume after each fuse and finding it collapse to zero mid-loop),
       and even a single N-ary fuse (blank.fuse(*teeth)) -- more robust,
       but not universally so -- fails differently on other combinations
       (an empty result; a non-manifold result). Fixed by NOT fusing at
       all: the returned Compound holds the blank and each tooth as
       separate, individually-manifold bodies (the same tradeoff already
       accepted for worm gears, and for the same reason).

    Checked across several z/module/bore/shaft-angle combinations, since
    both bugs were parameter-dependent -- a single passing case would not
    have caught either one originally."""
    from build_gear import build_bevel_gear_solid

    cases = [
        dict(z=20, module_mm=4.0, mate_teeth=40, shaft_angle_deg=90.0, face_width_mm=15.0),
        dict(z=12, module_mm=2.5, mate_teeth=12, shaft_angle_deg=90.0, face_width_mm=6.0, bore_diameter_mm=4.0),
        dict(z=8, module_mm=2.0, mate_teeth=30, shaft_angle_deg=90.0, face_width_mm=5.0),
        dict(z=16, module_mm=3.0, mate_teeth=16, shaft_angle_deg=60.0, face_width_mm=8.0),
    ]
    for kwargs in cases:
        bp = BevelGearParams(**kwargs)
        solid = build_bevel_gear_solid(bp, n_phi=120, simplify_tolerance_mm=0.03)
        bodies = solid.solids()
        assert len(bodies) == bp.z + 1, (kwargs, len(bodies))
        assert all(b.is_manifold for b in bodies), kwargs
        assert solid.volume > 0


def test_tooth_addendum_tip_matches_agma_outside_diameter_formula():
    """Regression test for the ra*1.05 blank-oversize bug (see
    test_involute.py's single_tooth_polygon test for the root cause) at
    the bevel level: the heel's on-axis (tangentially centered) addendum
    point must land at exactly R + ha*cos(gamma) -- the standard AGMA
    outside-diameter formula for a straight bevel gear -- not 5% beyond
    it."""
    bp = BevelGearParams(z=20, module_mm=4.0, mate_teeth=40, shaft_angle_deg=90.0, face_width_mm=15.0)
    gamma = bp.pitch_angle_rad
    ha = 1.0 * bp.module_mm  # default addendum_coeff
    expected = bp.heel_pitch_radius + ha * math.cos(gamma)

    heel_pitch_pt = (0.0, bp.heel_pitch_radius / math.cos(gamma))
    re = bp.outer_cone_distance
    # the on-axis addendum point: same heel_x=0 as the pitch point, offset
    # outward by ha in the flat frame before wrapping onto the cone
    x, y, z = flat_point_to_cone(0.0, bp.heel_pitch_radius / math.cos(gamma) + ha,
                                  re, gamma, re, bp.heel_pitch_radius)
    actual = math.hypot(x, y)
    assert abs(actual - expected) < 1e-9


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))


def test_pair_meshes_without_interpenetration_and_a_half_pitch_error_collides():
    """The conjugacy check every multi-member family gets, applied to the
    straight bevel pair for the first time: a 30-tooth gear and its 12-tooth
    pinion (same module, 90deg shafts, same face width) placed by
    bevel.place_bevel_pinion must overlap by no more than sliver contact at
    three rotation phases (measured 0.12 mm^3, 0.001 % of the gear -- the
    Tredgold approximation is conjugate to that level) and collide two
    orders of magnitude more with the pinion turned half a pitch (111 mm^3).
    Done solid by solid: as compounds the boolean returns nothing for BOTH
    placements (see meshcheck.py), which is how an earlier probe read
    'no interpenetration' for a mis-phased pair."""
    from meshcheck import interpenetration_volume, total_volume
    from bevel import place_bevel_pinion
    from build_gear import build_bevel_gear_solid
    z1, z2 = 12, 30
    gear = build_bevel_gear_solid(BevelGearParams(z=z2, module_mm=2.0, mate_teeth=z1, shaft_angle_deg=90.0, face_width_mm=8.0),
                                  n_phi=120, simplify_tolerance_mm=0.03)
    pinion = build_bevel_gear_solid(BevelGearParams(z=z1, module_mm=2.0, mate_teeth=z2, shaft_angle_deg=90.0, face_width_mm=8.0),
                                    n_phi=120, simplify_tolerance_mm=0.03)
    ref = total_volume(gear)
    import build123d as bd
    worst = 0.0
    for turn in (0.0, 4.0, 8.0):
        g = gear.rotate(bd.Axis.Z, turn)
        p = place_bevel_pinion(pinion, z2, z1, 90.0, gear_turn_deg=turn)
        worst = max(worst, interpenetration_volume(g, p))
    bad = interpenetration_volume(gear, place_bevel_pinion(pinion, z2, z1, 90.0, phase_error_deg=180.0 / z1))
    assert worst < 5e-5 * ref, (worst, ref)
    assert bad > 2e-3 * ref and bad > 50 * max(worst, 1e-9), (worst, bad, ref)
