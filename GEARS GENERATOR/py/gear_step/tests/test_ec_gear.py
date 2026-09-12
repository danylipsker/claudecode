"""
Automated checks for eccentrically-cycloidal (EC) gearing
(docs/gear-math.md section 23).
Run with: python -m pytest gear_step/tests/test_ec_gear.py -v
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import numpy as np
import pytest
from shapely.affinity import rotate
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

import ec_gear as ec
from generation import section_triangles
from meshcheck import interpenetration_volume, tessellated_volume


def _ep(**kw) -> ec.ECGearParams:
    base = dict(wheel_teeth=30, centre_distance_mm=60.0, face_width_mm=20.0)
    base.update(kw)
    return ec.ECGearParams(**base)


# ---- the transverse geometry (23.1) ----------------------------------------

def test_pitch_radii_ratio_and_the_auto_sizes():
    ep = _ep()
    assert ep.pinion_pitch_radius == pytest.approx(60.0 / 31.0)
    assert ep.wheel_pitch_radius == pytest.approx(60.0 * 30.0 / 31.0)
    assert ep.pinion_pitch_radius + ep.wheel_pitch_radius == pytest.approx(ep.a)
    assert ep.ratio == 30.0
    assert ep.e == pytest.approx(0.6 * ep.pinion_pitch_radius)
    assert ep.r_c == pytest.approx(0.8 * ep.max_pinion_radius)
    # the tightest bend of the eccentric centre's path is at the lobe tips: (a/z + e)^2 / (e + a/z^2)
    rho_tip = (ep.a / ep.z + ep.e) ** 2 / (ep.e + ep.a / ep.z ** 2)
    assert ep.max_pinion_radius == pytest.approx(rho_tip, rel=0.1)
    assert ep.lead == ep.face_width_mm
    assert ep.tooth_height == pytest.approx(2.0 * ep.e)
    assert math.degrees(ep.pinion_twist_rad) == pytest.approx(360.0)
    assert math.degrees(ep.wheel_twist_rad) == pytest.approx(-12.0)
    assert _ep(hand="left").pinion_twist_rad == pytest.approx(-ep.pinion_twist_rad)
    assert math.tan(ep.helix_angle_rad) == pytest.approx(2.0 * math.pi * ep.pinion_pitch_radius / ep.lead)


def test_eccentric_centre_path_is_the_epitrochoid_of_the_pitch_circles():
    """A circle of radius r_1 rolling on one of radius r_2 with a tracing
    point e off its centre: the same curve as eccentric_centre."""
    ep = _ep()
    r1, r2 = ep.pinion_pitch_radius, ep.wheel_pitch_radius
    for th in np.linspace(0.0, 4.0 * math.pi, 25):
        t = th / ep.z                     # the rolling circle's centre angle
        x = (r1 + r2) * math.cos(t) + ep.e * math.cos(t + th)
        y = (r1 + r2) * math.sin(t) + ep.e * math.sin(t + th)
        assert ec.eccentric_centre(ep, th) == pytest.approx((x, y), abs=1e-9)


def test_wheel_profile_is_the_envelope_of_the_eccentric():
    ep = _ep()
    poly = ec.wheel_profile_polygon(ep, 8000)
    assert poly.is_valid
    xs, ys = np.array(poly.exterior.coords).T
    r = np.hypot(xs, ys)
    assert r.max() == pytest.approx(ep.wheel_tip_radius, abs=1e-6)
    assert r.min() == pytest.approx(ep.wheel_root_radius, abs=1e-6)
    assert abs(math.degrees(math.atan2(ys[np.argmax(r)], xs[np.argmax(r)]))) % (360.0 / ep.z) == pytest.approx(0.0, abs=0.05)
    assert poly.symmetric_difference(rotate(poly, 360.0 / ep.z, origin=(0, 0))).area < 1e-4 * poly.area
    for th in np.linspace(0.0, 2.0 * math.pi, 37):
        c = Point(ec.eccentric_centre(ep, th))
        assert poly.exterior.distance(c) == pytest.approx(ep.r_c, abs=2e-3)       # tangent ...
        assert c.buffer(ep.r_c - 2e-3, quad_segs=256).intersection(poly).area < 1e-9   # ... and never inside
    # the lobe runs the solid is built from are the same curve
    runs = ec.wheel_lobe_points(ep, 24)
    assert len(runs) == ep.z and all(len(run) == 25 for run in runs)
    assert all(runs[k][-1] == runs[k + 1][0] for k in range(ep.z - 1)) and runs[-1][-1] == runs[0][0]
    assert max(poly.exterior.distance(Point(p)) for run in runs for p in run) < 2e-3


def test_refusals_name_the_limit():
    with pytest.raises(ValueError, match="loop"):
        _ep(eccentricity_mm=2.0).validate()                     # r_1 = 1.935
    with pytest.raises(ValueError, match="radius of curvature"):
        _ep(pinion_diameter_mm=16.0).validate()                 # rho_min = 7.55
    with pytest.raises(ValueError, match="inside the eccentric"):
        _ep(pinion_diameter_mm=2.0).validate()                  # r_c = 1 < e
    with pytest.raises(ValueError, match="breaks out"):
        _ep(pinion_bore_diameter_mm=10.0).validate()            # wall r_c - e = 4.9
    with pytest.raises(ValueError, match="root circle"):
        _ep(bore_diameter_mm=110.0).validate()


# ---- the solids (23.2) -----------------------------------------------------

@pytest.fixture(scope="module")
def pair():
    ep = _ep()
    return ep, ec.build_ec_pinion_solid(ep), ec.build_ec_wheel_solid(ep)


def test_solids_are_exact_twisted_extrusions(pair):
    ep, pin, wheel = pair
    assert pin.is_valid and len(pin.solids()) == 1
    assert pin.volume == pytest.approx(math.pi * ep.r_c ** 2 * ep.face_width_mm, rel=1e-6)   # a twist keeps the volume
    assert wheel.is_valid and len(wheel.solids()) == 1
    assert len(wheel.faces()) == ep.z + 2                                                    # one face per lobe
    poly = ec.wheel_profile_polygon(ep, 8000)
    assert tessellated_volume(wheel, 0.01) == pytest.approx(poly.area * ep.face_width_mm, rel=2e-3)
    # sections between the faces are the profile turned by the twist so far -- and the
    # pinion's eccentric turned by its own, the other way and z_w times as much
    for f in (0.25, 0.5, 0.75):
        pl = bd.Plane(origin=(0, 0, f * ep.face_width_mm), x_dir=(1, 0, 0), z_dir=(0, 0, 1))
        sec = unary_union([Polygon(t) for t in section_triangles(wheel, pl, 80.0, 0.005)])
        expect = rotate(poly, math.degrees(ep.wheel_twist_rad) * f, origin=(0, 0))
        assert sec.hausdorff_distance(expect) < 0.05
        assert sec.symmetric_difference(expect).area < 1e-3 * poly.area
        c = unary_union([Polygon(t) for t in section_triangles(pin, pl, 30.0, 0.005)]).centroid
        ang = ep.pinion_twist_rad * f
        assert (c.x, c.y) == pytest.approx((ep.e * math.cos(ang), ep.e * math.sin(ang)), abs=1e-3)


def test_bores_remove_exactly_their_cylinders():
    ep = _ep(bore_diameter_mm=40.0, pinion_bore_diameter_mm=6.0)
    pin, wheel = ec.build_ec_pinion_solid(ep), ec.build_ec_wheel_solid(ep)
    assert pin.volume == pytest.approx(math.pi * (ep.r_c ** 2 - 9.0) * ep.face_width_mm, rel=1e-6)
    plain = ec.build_ec_wheel_solid(_ep())
    assert tessellated_volume(plain, 0.01) - tessellated_volume(wheel, 0.01) == pytest.approx(math.pi * 400.0 * ep.face_width_mm, rel=2e-3)
    # nothing on either axis (build123d hands back None for an empty intersection)
    from meshcheck import volume_of
    for solid in (pin, wheel):
        probe = bd.Solid.make_cylinder(0.5, ep.face_width_mm + 2.0).moved(bd.Location((0, 0, -1.0)))
        assert volume_of(solid.intersect(probe)) == pytest.approx(0.0, abs=1e-9)


def test_pair_meshes_in_phase_and_collides_when_mis_phased(pair):
    ep, pin, wheel = pair
    for turn in (0.0, 50.0, 137.0, 250.0):
        p = ec.place_pinion(pin, ep, turn)
        w = wheel.rotate(bd.Axis.Z, ec.wheel_turn_deg(ep, turn))
        assert interpenetration_volume(p, w) < 1e-6 * wheel.volume       # 1.1e-7 measured
    w = wheel.rotate(bd.Axis.Z, 180.0 / ep.z)
    assert interpenetration_volume(ec.place_pinion(pin, ep, 0.0), w) > 10.0    # 57 mm^3 measured


def test_pair_round_trips_through_step_as_two_solids(tmp_path):
    from build_gear import export_ec_step
    path = tmp_path / "ec.step"
    export_ec_step(_ep(), path)
    assert len(bd.import_step(str(path)).solids()) == 2


def test_server_derived_values_and_warnings():
    import server
    d, w = server.ec_gear_derived_values(_ep())
    assert d["ratio"] == 30.0 and d["centre_distance_mm"] == 60.0
    assert d["eccentricity_mm"] == pytest.approx(0.6 * 60.0 / 31.0)
    assert d["wheel_tip_diameter_mm"] == pytest.approx(2.0 * _ep().wheel_tip_radius)
    assert d["pinion_twist_deg"] == pytest.approx(360.0) and d["wheel_twist_deg"] == pytest.approx(-12.0)
    assert not w
    _, w = server.ec_gear_derived_values(_ep(face_width_mm=8.0, lead_mm=20.0))
    assert any("less than a turn" in s for s in w)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
