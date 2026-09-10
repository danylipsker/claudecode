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


def test_root_fillet_is_concave_and_flares_the_tooth_into_the_root_land():
    """Regression test for the inverted fillet: an earlier version placed the
    fillet circle's centre INSIDE the tooth (right for a cutting tool's
    convex tip rounding, which the construction descends from; wrong for a
    tooth root), which rounded the base corner off and curled the arc back
    under the tooth, leaving a quarter-round groove rho wide beneath every
    tooth -- the 'fillets not made right'. Checked against the textbook, not
    the construction: the centre is on the space side of the flank, both
    tangent points sit rho*tan(45deg - alpha/2) from the sharp corner (the
    tangent length for a fillet in a 90deg + alpha corner), the landing
    point is OUTBOARD of that corner, the half-profile only ever widens on
    the way down, and the corner region under the arc is solid material in
    the actual rack outline (probed with point-in-polygon on the real
    union). At module 2 the old version landed 1.09 mm inboard with air
    under the arc."""
    from shapely.geometry import Point
    for pa in (20.0, 14.5):
        rp = RackParams(z=3, module_mm=2.0, pressure_angle_deg=pa)
        alpha, hf = rp.pressure_angle_rad, rp.dedendum_height_mm
        rho = rp.root_fillet_coeff * rp.module_mm
        half_thick = rp.circular_tooth_thickness_mm / 2.0
        n_arc = 16
        right = rack_tooth_profile(rp, n_arc=n_arc)[: n_arc + 2]  # tip, p_tan, arc..., p_root
        p_tan, arc, p_root = right[1], right[2:], right[-1]
        corner = (half_thick + hf * math.tan(alpha), -hf)
        t_len = rho * math.tan(math.pi / 4 - alpha / 2)
        assert abs(p_tan[0] - (half_thick - p_tan[1] * math.tan(alpha))) < 1e-9  # on the flank
        assert abs(p_root[1] + hf) < 1e-9                                          # on the land
        assert abs(math.hypot(p_tan[0] - corner[0], p_tan[1] - corner[1]) - t_len) < 1e-9
        assert abs(p_root[0] - corner[0] - t_len) < 1e-9
        assert p_root[0] > corner[0]  # material added outboard of the sharp corner
        cu, cv = p_root[0], -hf + rho
        assert cu > half_thick - cv * math.tan(alpha)  # centre on the space side
        assert all(abs(math.hypot(u - cu, v - cv) - rho) < 1e-9 for (u, v) in arc)
        for (u0, v0), (u1, v1) in zip(right, right[1:]):
            assert u1 >= u0 - 1e-12 and v1 <= v0 + 1e-12, (pa, "must only widen going down")
        outline = Polygon(rack_outline(rp))  # z=3: middle tooth centred on u=0
        for f in (0.25, 0.5, 0.75):
            assert outline.contains(Point(corner[0] + f * t_len, -hf + 0.01 * rho)), (pa, f)
        assert not outline.contains(Point(cu, cv)), "the centre lies in the space"


def test_oversized_root_fillet_is_clamped_to_a_full_round_root():
    """A fillet coefficient the land can't hold is clamped so neighbouring
    fillets meet at the land's midpoint (landing point exactly half a pitch
    out) rather than overlapping into an invalid outline."""
    rp = RackParams(z=4, module_mm=2.0, pressure_angle_deg=20.0, root_fillet_coeff=5.0)
    tooth = rack_tooth_profile(rp, n_arc=12)
    p_root = tooth[: len(tooth) // 2][-1]
    assert abs(p_root[0] - rp.circular_pitch_mm / 2.0) < 1e-9
    assert Polygon(rack_outline(rp)).is_valid


def test_root_fillet_is_tangent_continuous_no_crease():
    """From the tip down to the root point, no direction change between
    consecutive segments may exceed the arc's own discretization step
    ((90 - alpha)/n_arc deg), and the worst one must shrink as n_arc grows
    -- a crease is resolution-independent, a smooth arc is not. (Catches
    what an earlier, briefly present monotonic clamp on u did: a
    resolution-independent 20deg crease at the flank junction.) Two
    pressure angles, since the sweep (and so the step) depends on alpha."""
    for pa in (20.0, 14.5):
        rp = RackParams(z=4, module_mm=2.0, pressure_angle_deg=pa)
        sweep_deg = 90.0 - pa
        worst_prev = None
        for n_arc in (12, 48):
            prof = rack_tooth_profile(rp, n_arc=n_arc)
            right = prof[:n_arc + 2]  # tip, p_tan, arc points..., p_root
            worst = 0.0
            for i in range(1, len(right) - 1):
                (x0, y0), (x1, y1), (x2, y2) = right[i - 1], right[i], right[i + 1]
                d = math.atan2(y2 - y1, x2 - x1) - math.atan2(y1 - y0, x1 - x0)
                d = abs((d + math.pi) % (2 * math.pi) - math.pi)
                worst = max(worst, math.degrees(d))
            assert worst <= (sweep_deg / n_arc) * 1.05 + 0.01, (pa, n_arc, worst)
            if worst_prev is not None:
                assert worst < worst_prev, (pa, worst, worst_prev)
            worst_prev = worst


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))
