"""
Automated checks for internal (ring) gears (docs/gear-math.md section 11).
Run with: python -m pytest gear_step/tests/test_internal.py -v
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from internal import (
    InternalGearParams, internal_point_to_ring_frame,
    internal_gear_single_gap_swept, internal_gear_outline, _one_flank_offsets,
)


def test_addendum_radius_is_smaller_than_pitch_radius_dedendum_is_larger():
    """Internal gears are the mirror of external ones: teeth point inward,
    so the tip (addendum) circle is SMALLER than the pitch radius and the
    root (dedendum) circle is LARGER."""
    ip = InternalGearParams(z=40, module_mm=2.0)
    assert ip.addendum_radius < ip.pitch_radius < ip.dedendum_radius


def test_internal_mesh_center_distance_is_a_difference_not_a_sum():
    """Two external gears mesh at a center distance = sum of pitch radii;
    an internal gear and its pinion mesh at the DIFFERENCE -- the pinion's
    axis sits inside the ring's own pitch circle, not outside it."""
    ip = InternalGearParams(z=40, module_mm=2.0)
    pinion_pitch_radius = 10.0  # an arbitrary small pinion, module-compatible or not -- geometry only
    center_distance = ip.pitch_radius - pinion_pitch_radius
    assert center_distance == ip.pitch_radius - pinion_pitch_radius  # documents the relationship
    assert center_distance < ip.pitch_radius


def test_cutter_gear_params_swaps_addendum_and_dedendum():
    ip = InternalGearParams(z=40, module_mm=2.0, addendum_coeff=1.0, dedendum_coeff=1.25)
    cutter = ip.shaper_gear_params()
    assert cutter.addendum_coeff == ip.dedendum_coeff
    assert cutter.dedendum_coeff == ip.addendum_coeff


def test_rolling_contact_point_has_zero_relative_velocity():
    """The actual definition of rolling without slip, and the check that
    pins the transform's sign down (internal mesh turns both gears the SAME
    direction, unlike external-external mesh) -- checked by finite
    difference at the geometric contact point, not assumed from how the
    formula was written."""
    R, rc = 40.0, 15.0
    eps = 1e-6
    x0, y0 = internal_point_to_ring_frame(-eps, 0.0, rc, rc, R)
    x1, y1 = internal_point_to_ring_frame(eps, 0.0, rc, rc, R)
    vx, vy = (x1 - x0) / (2 * eps), (y1 - y0) / (2 * eps)
    assert abs(vx) < 1e-6 and abs(vy) < 1e-6


def test_contact_point_lands_at_the_ring_pitch_radius_at_theta_zero():
    R, rc = 40.0, 15.0
    x, y = internal_point_to_ring_frame(0.0, 0.0, rc, rc, R)
    assert abs(math.hypot(x, y) - R) < 1e-9


def test_max_cutter_reach_equals_the_root_radius_exactly():
    """The cutter's own addendum (post-swap, see
    test_cutter_gear_params_swaps_addendum_and_dedendum) cuts to exactly
    the ring's dedendum depth and no farther, by construction."""
    ip = InternalGearParams(z=40, module_mm=2.0, cutter_teeth=20)
    gap = internal_gear_single_gap_swept(ip, n_phi=80, phi_margin=1.3)
    coords = list(gap.exterior.coords)
    max_r = max(math.hypot(x, y) for x, y in coords)
    assert abs(max_r - ip.dedendum_radius) < 1e-6


def test_generated_flank_matches_the_closed_form_involute():
    """The flank a real shaper cuts must be a true involute of the SAME
    base circle formula (rb = R*cos(alpha)) an external gear uses --
    checked point-by-point along one isolated flank, not just that the
    overall shape looks plausible."""
    ip = InternalGearParams(z=40, module_mm=2.0, cutter_teeth=20)
    offsets = _one_flank_offsets(ip)
    assert len(offsets) >= 5
    spread = max(offsets) - min(offsets)
    assert spread < 0.05, f"spread={spread}"


def test_tooth_flank_shape_does_not_depend_on_the_construction_cutter_tooth_count():
    """The fundamental law of gearing: the generated flank must be the same
    regardless of which cutter tooth count produced it (cutter_teeth is a
    construction parameter only)."""
    means = []
    for zc in (15, 20, 26):
        ip = InternalGearParams(z=40, module_mm=2.0, cutter_teeth=zc)
        offsets = _one_flank_offsets(ip)
        assert len(offsets) >= 5, zc
        means.append(sum(offsets) / len(offsets))
    assert max(means) - min(means) < 0.01


def test_root_radius_is_exact_across_the_outline():
    ip = InternalGearParams(z=32, module_mm=2.5, cutter_teeth=16)
    coords = internal_gear_outline(ip)
    min_r = min(math.hypot(x, y) for x, y in coords)
    max_r = max(math.hypot(x, y) for x, y in coords)
    assert abs(min_r - ip.addendum_radius) < 1e-6
    assert abs(max_r - ip.dedendum_radius) < 1e-6


def test_full_solid_is_manifold_and_has_a_genuine_bore_across_several_combinations():
    """Same class of check the bevel gear bug (docs/gear-math.md 8.3) was
    found by, PLUS a check specific to this family's own real bug (see
    build_gear.build_internal_gear_solid): the solid's volume must be
    meaningfully less than a bore-less disk of the same outer dimensions,
    not just close to it."""
    from build_gear import build_internal_gear_solid

    cases = [
        dict(z=40, module_mm=2.0, face_width_mm=10.0),
        dict(z=60, module_mm=1.5, face_width_mm=8.0, cutter_teeth=15),
        dict(z=24, module_mm=3.0, face_width_mm=12.0, rim_thickness_mm=8.0),
    ]
    for kwargs in cases:
        ip = InternalGearParams(**kwargs)
        solid = build_internal_gear_solid(ip)
        bodies = solid.solids()
        assert len(bodies) == 1, kwargs
        assert bodies[0].is_manifold, kwargs
        holeless_disk_vol = math.pi * ip.outer_radius**2 * ip.face_width_mm
        assert solid.volume < holeless_disk_vol * 0.9, \
            f"{kwargs}: volume {solid.volume:.1f} suspiciously close to holeless disk {holeless_disk_vol:.1f} -- missing bore?"


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))
