"""
Automated checks for gear racks (docs/gear-math.md section 10).
Run with: python -m pytest gear_step/tests/test_rack.py -v
"""
import math
import sys
from pathlib import Path

from shapely.geometry import Polygon

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from rack import RackParams, rack_tooth_profile, rack_outline


def test_pitch_and_thickness_formulas():
    rp = RackParams(z=10, module_mm=2.0, pressure_angle_deg=20.0)
    assert abs(rp.circular_pitch_mm - math.pi * 2.0) < 1e-12
    assert abs(rp.circular_tooth_thickness_mm - math.pi * 2.0 / 2.0) < 1e-12


def test_flank_is_a_straight_line_at_exactly_the_pressure_angle():
    """The whole premise of a rack: the involute flank of an infinite-radius
    base circle degenerates to a straight line at exactly the pressure
    angle -- checked directly against the two points that define the flank,
    not assumed from the construction."""
    rp = RackParams(z=6, module_mm=3.0, pressure_angle_deg=20.0)
    tooth = rack_tooth_profile(rp, n_arc=12)
    (u0, v0), (u1, v1) = tooth[0], tooth[1]
    assert v1 < v0, "flank must run from tip (higher v) toward the root (lower v)"
    du = abs(u0 - u1)
    measured_angle = math.degrees(math.atan2(du, v0 - v1))
    assert abs(measured_angle - rp.pressure_angle_deg) < 1e-9, (measured_angle, rp.pressure_angle_deg)


def test_root_fillet_reaches_exactly_the_dedendum_depth():
    rp = RackParams(z=6, module_mm=2.5, pressure_angle_deg=20.0, root_fillet_coeff=0.3)
    tooth = rack_tooth_profile(rp, n_arc=20)
    right_half = tooth[: len(tooth) // 2]
    bottom_v = right_half[-1][1]
    assert abs(bottom_v - (-rp.dedendum_height_mm)) < 1e-9


def test_outline_is_valid_with_correct_bounds():
    rp = RackParams(z=8, module_mm=2.0, face_width_mm=10.0, backing_height_mm=6.0)
    coords = rack_outline(rp)
    poly = Polygon(coords)
    assert poly.is_valid
    minx, miny, maxx, maxy = poly.bounds
    assert abs(maxx - minx - rp.total_length_mm) < 1e-6
    assert abs(maxy - rp.addendum_height_mm) < 1e-6
    expected_miny = -(rp.dedendum_height_mm + rp.backing_height_mm)
    assert abs(miny - expected_miny) < 1e-6
    area2 = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(coords, coords[1:] + coords[:1]))
    assert area2 > 0, "outline must be CCW"


def test_curvature_diverges_toward_a_straight_line_as_z_grows():
    """A rack is the z -> infinity limit of a spur gear -- checked against
    the actual thing it's a limit OF (involute.py's own closed-form flank),
    not just against this module's own formulas. An independent numerical
    3-point circle fit on the flank's radius of curvature must diverge
    (not just increase a little) as z grows."""
    from involute import GearParams, involute_point, involute_t_at_radius

    def three_point_radius(p1, p2, p3):
        ax, ay = p1; bx, by = p2; cx, cy = p3
        d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
        if abs(d) < 1e-12:
            return float("inf")
        ux = ((ax**2 + ay**2) * (by - cy) + (bx**2 + by**2) * (cy - ay) + (cx**2 + cy**2) * (ay - by)) / d
        uy = ((ax**2 + ay**2) * (cx - bx) + (bx**2 + by**2) * (ax - cx) + (cx**2 + cy**2) * (bx - ax)) / d
        return math.hypot(ax - ux, ay - uy)

    radii = []
    for z in (20, 80, 320, 1280):
        gp = GearParams(z=z, module_mm=2.0)
        rb = gp.base_radius
        t = involute_t_at_radius(rb, gp.pitch_radius)
        eps = 0.02
        p1 = involute_point(rb, t - eps)
        p2 = involute_point(rb, t)
        p3 = involute_point(rb, t + eps)
        radii.append(three_point_radius(p1, p2, p3))

    assert radii[0] < radii[1] < radii[2] < radii[3]
    assert radii[3] / radii[0] > 50


def test_full_solid_is_manifold_across_several_parameter_combinations():
    """Same class of check the bevel gear bug (docs/gear-math.md 8.3) was
    found by: build the actual 3D solid and measure it, not just the 2D
    profile."""
    from build_gear import build_rack_solid

    cases = [
        dict(z=8, module_mm=2.0, face_width_mm=10.0),
        dict(z=12, module_mm=3.0, face_width_mm=15.0, backing_height_mm=8.0),
        dict(z=20, module_mm=1.5, face_width_mm=8.0, bore_diameter_mm=3.0),
        dict(z=6, module_mm=4.0, face_width_mm=12.0, pressure_angle_deg=14.5),
    ]
    for kwargs in cases:
        rp = RackParams(**kwargs)
        solid = build_rack_solid(rp)
        bodies = solid.solids()
        assert len(bodies) == 1, kwargs
        assert bodies[0].is_manifold, kwargs
        assert solid.volume > 0


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))
