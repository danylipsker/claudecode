"""
Automated checks for cycloidal gears (docs/gear-math.md section 14).
Run with: python -m pytest gear_step/tests/test_cycloidal.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest
from shapely.geometry import Point, Polygon

from cycloidal import (CycloidalGearParams, epicycloid_point, hypocycloid_point, contact_point,
                       cycloidal_tooth_points, cycloidal_gear_polygon, cycloidal_gear_outline,
                       build_cycloidal_gear_solid, build_cycloidal_pair, mate_params)


def _volume(shape) -> float:
    if shape is None:
        return 0.0
    if isinstance(shape, bd.ShapeList):
        return sum(_volume(s) for s in shape)
    return sum(s.volume for s in shape.solids()) if shape.solids() else 0.0


@pytest.mark.parametrize("R,rg", [(12.0, 6.0), (18.0, 6.0), (10.0, 2.5), (30.0, 9.0)])
def test_profile_normals_pass_through_the_instantaneous_contact_point(R, rg):
    """The fundamental law of gearing, checked on the curves themselves: at
    every point of the epicycloid and hypocycloid the profile NORMAL must
    pass through the point where the rolling circle touches the pitch
    circle -- because that contact point is the instantaneous centre of the
    rolling motion that traced the curve. A sign or factor error in either
    parametrisation breaks this immediately."""
    for curve, ts in ((epicycloid_point, [0.05, 0.2, 0.5, 0.9 * math.pi * rg / R]),
                      (hypocycloid_point, [-0.05, -0.2, -0.5, -0.9 * math.pi * rg / R])):
        for t in ts:
            h = 1e-6
            p = curve(R, rg, t)
            q = curve(R, rg, t + h)
            tangent = (q[0] - p[0], q[1] - p[1])
            c = contact_point(R, t)
            to_contact = (c[0] - p[0], c[1] - p[1])
            cos_angle = ((tangent[0] * to_contact[0] + tangent[1] * to_contact[1])
                         / (math.hypot(*tangent) * math.hypot(*to_contact)))
            assert abs(cos_angle) < 1e-4, (curve.__name__, t, cos_angle)


def test_tooth_thickness_tip_and_root_radii():
    cp = CycloidalGearParams(z=12, module_mm=2.0)
    pts = cycloidal_tooth_points(cp)
    radii = [math.hypot(x, y) for x, y in pts]
    assert abs(max(radii) - cp.addendum_radius) < 1e-9
    assert abs(min(radii) - cp.dedendum_radius) < 1e-9
    # angular thickness at the pitch circle = s / R: the two flanks' pitch points
    R = cp.pitch_radius
    on_pitch = sorted(math.atan2(y, x) for x, y in pts if abs(math.hypot(x, y) - R) < 1e-6)
    assert len(on_pitch) == 2
    assert abs((on_pitch[1] - on_pitch[0]) - cp.circular_tooth_thickness / R) < 1e-9
    assert abs((on_pitch[0] + on_pitch[1]) / 2.0 - math.pi / 2.0) < 1e-9  # centred on +Y
    # backlash thins the tooth by exactly that much at the pitch circle
    cp_b = CycloidalGearParams(z=12, module_mm=2.0, backlash_mm=0.1)
    on_pitch_b = sorted(math.atan2(y, x) for x, y in cycloidal_tooth_points(cp_b) if abs(math.hypot(x, y) - R) < 1e-6)
    assert abs((on_pitch_b[1] - on_pitch_b[0]) * R - (cp.circular_tooth_thickness - 0.1)) < 1e-9


def test_auto_rolling_circle_gives_radial_dedendum_flanks():
    """r_g = R/2 makes the hypocycloid a straight line through the centre:
    the classic clock-pinion 'radial flank'. Every dedendum point of the
    right flank must then be collinear with the gear centre."""
    cp = CycloidalGearParams(z=8, module_mm=2.0)
    assert cp.dedendum_is_radial
    R = cp.pitch_radius
    pts = cycloidal_tooth_points(cp, n_flank=30)
    dedendum = [(x, y) for x, y in pts[:31]]  # right flank's hypocycloid part, root -> pitch point
    angles = [math.atan2(y, x) for x, y in dedendum]
    assert max(angles) - min(angles) < 1e-9
    assert all(math.hypot(x, y) <= R + 1e-9 for x, y in dedendum)
    # and a smaller rolling circle curves them
    cp2 = CycloidalGearParams(z=8, module_mm=2.0, rolling_circle_diameter_mm=4.0)
    assert not cp2.dedendum_is_radial
    pts2 = cycloidal_tooth_points(cp2, n_flank=30)
    angles2 = [math.atan2(y, x) for x, y in pts2[:31]]
    assert max(angles2) - min(angles2) > 1e-3


def test_whole_gear_polygon_and_solid_are_valid():
    for kwargs in (dict(z=6, module_mm=3.0), dict(z=12, module_mm=2.0, bore_diameter_mm=6.0),
                   dict(z=40, module_mm=1.0, rolling_circle_diameter_mm=8.0)):
        cp = CycloidalGearParams(**kwargs)
        poly = cycloidal_gear_polygon(cp)
        assert poly.is_valid and poly.geom_type == "Polygon", kwargs
        outline = cycloidal_gear_outline(cp)
        assert Polygon(outline).is_valid
        solid = build_cycloidal_gear_solid(cp)
        bodies = solid.solids()
        assert len(bodies) == 1 and bodies[0].is_manifold, kwargs
        # area sanity: between the root disk and the addendum disk
        assert math.pi * cp.dedendum_radius ** 2 < poly.area + (math.pi * (cp.bore_diameter_mm / 2) ** 2) < math.pi * cp.addendum_radius ** 2


@pytest.mark.parametrize("z,z_mate,rolling_d", [(12, 18, 0.0), (8, 24, 0.0), (10, 15, 5.0)])
def test_conjugate_pair_meshes_without_interpenetration_and_a_half_pitch_error_collides(z, z_mate, rolling_d):
    """Two cycloidal gears sharing one rolling circle are exactly conjugate
    at the exact centre distance: the boolean intersection of the pair in
    mesh must be (near) zero, and the same pair with the mate turned half a
    pitch must collide -- the check that proves the epicycloid/hypocycloid
    pairing (and the mate's rolling circle) is right, not just pretty."""
    cp = CycloidalGearParams(z=z, module_mm=2.0, rolling_circle_diameter_mm=rolling_d, face_width_mm=6.0)
    g, m = build_cycloidal_pair(cp, z_mate)
    ref = min(g.volume, m.volume)
    good = _volume(g.intersect(m))
    g2, m2 = build_cycloidal_pair(cp, z_mate, phase_error_deg=180.0 / z_mate)
    bad = _volume(g2.intersect(m2))
    assert good < 2e-4 * ref, (z, z_mate, good, ref)
    assert bad > 1e-3 * ref and bad > 20 * max(good, 1e-9), (z, z_mate, good, bad, ref)


def test_step_export_round_trips():
    from build_gear import export_cycloidal_step
    cp = CycloidalGearParams(z=12, module_mm=2.0, face_width_mm=6.0, bore_diameter_mm=5.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "cycloidal.step"
        export_cycloidal_step(cp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 1
        assert abs(imported.volume - build_cycloidal_gear_solid(cp).volume) < 1e-3


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
