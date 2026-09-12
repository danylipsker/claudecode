"""
Automated checks for hyperboloidal gears (docs/gear-math.md section 24).
Run with: python -m pytest gear_step/tests/test_hyperboloidal.py -v
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import numpy as np
import pytest
from shapely.geometry import Polygon
from shapely.ops import unary_union

import hyperboloidal as hy
from generation import section_triangles
from meshcheck import interpenetration_volume, tessellated_volume


def _hp(**kw) -> hy.HyperboloidalParams:
    base = dict(z1=16, z2=24, shaft_angle_deg=90.0, normal_module_mm=2.0)
    base.update(kw)
    return hy.HyperboloidalParams(**base)


# ---- the pitch geometry (24.1) ---------------------------------------------

def test_screw_axis_splits_the_shaft_angle_and_the_centre_distance_as_the_closed_form_says():
    for z1, z2, sigma in ((16, 24, 90.0), (20, 20, 90.0), (15, 45, 60.0), (12, 30, 120.0), (16, 24, 40.0)):
        hp = _hp(z1=z1, z2=z2, shaft_angle_deg=sigma)
        i, s = hp.ratio, math.radians(sigma)
        assert math.tan(hp.sigma1_rad) == pytest.approx(math.sin(s) / (i + math.cos(s)))
        assert math.tan(hp.sigma2_rad) == pytest.approx(i * math.sin(s) / (1.0 + i * math.cos(s)))
        assert hp.sigma1_rad + hp.sigma2_rad == pytest.approx(s)
        # the two statements of a_1 / a agree: the normal-module one and the screw-axis one
        assert hp.a1 / hp.centre_distance == pytest.approx(hp.throat_fraction_kinematic)
        # rolling at the throat: the surface speeds across the ISA agree, a_1 cos S_1 / a_2 cos S_2 = z_1 / z_2
        assert hp.a1 * math.cos(hp.sigma1_rad) / (hp.a2 * math.cos(hp.sigma2_rad)) == pytest.approx(z1 / z2)
    # perpendicular shafts: throat radii as 1 : i^2; parallel-ish shafts: as 1 : i
    hp = _hp(z1=15, z2=30, shaft_angle_deg=90.0)
    assert hp.a2 / hp.a1 == pytest.approx(4.0)
    hp = _hp(z1=15, z2=30, shaft_angle_deg=1e-6)
    assert hp.a2 / hp.a1 == pytest.approx(2.0, rel=1e-6)
    assert hp.sigma1_rad == pytest.approx(0.0, abs=1e-6)


def test_relative_motion_at_the_throat_is_a_screw_about_the_isa():
    """Gear 1 turns w about Z; gear 2 turns -w / i about its axis through
    (a, 0, 0) along (0, sin S, cos S). At the common throat point the
    relative velocity is along the ISA, and the two surface velocities
    agree across it (pure rolling) and differ only along it (sliding)."""
    for hand in ("right", "left"):
        hp = _hp(hand=hand)
        w1 = 1.0
        w2 = -w1 / hp.ratio
        z2 = np.array([0.0, hp.sign * math.sin(hp.sigma_rad), math.cos(hp.sigma_rad)])
        P = np.array([hp.a1, 0.0, 0.0])
        v1 = np.cross(np.array([0.0, 0.0, w1]), P)
        v2 = np.cross(w2 * z2, P - np.array([hp.centre_distance, 0.0, 0.0]))
        d = hy.isa_direction(hp)
        assert np.linalg.norm(np.cross(v2 - v1, d)) < 1e-12
        assert np.allclose(v1 - (v1 @ d) * d, v2 - (v2 @ d) * d, atol=1e-12)
        assert abs((v2 - v1) @ d) > 0.1                                   # it does slide along the line
        # the ISA seen from gear 2 is the same construction, and its throat point is gear 1's
        R, t = hy._m2(hp)
        assert np.allclose(R.T @ d, [0.0, hp.sign * math.sin(hp.sigma2_rad), math.cos(hp.sigma2_rad)])
        assert np.allclose(R @ np.array([hp.a2, 0.0, 0.0]) + t, P)
        assert np.allclose(R @ np.array([0.0, 0.0, 1.0]), z2)


def test_place_gear2_and_the_pulled_back_plane_agree_with_the_matrices():
    hp = _hp()
    R, t = hy._m2(hp)
    box = bd.Solid.make_box(1, 1, 1).moved(bd.Location((2.0, 3.0, 4.0)))          # centre (2.5, 3.5, 4.5)
    c = hy.place_gear2(box, hp, 0.0).center()
    expect = R @ np.array([2.5, 3.5, 4.5]) + t
    assert (c.X, c.Y, c.Z) == pytest.approx(tuple(expect), abs=1e-9)
    # a turn of gear 1 by t1 goes with gear 2 turned by -t1 / i about its own axis
    t1 = 20.0
    c2 = hy.place_gear2(box, hp, t1).center()
    turned = R @ (hy._rot_z(math.radians(-t1 / hp.ratio)) @ np.array([2.5, 3.5, 4.5])) + t
    assert (c2.X, c2.Y, c2.Z) == pytest.approx(tuple(turned), abs=1e-9)
    # the station plane round-trips: its local (3, 0) at gear-1 turn t1 lands on gear 2's (3, 0, h)
    h, th = 1.5, math.radians(t1)
    pl = hy.station_plane_in_gear1_frame(hp, h, th)
    p = np.array(tuple(pl.origin)) + 3.0 * np.array(tuple(pl.x_dir))
    probe = bd.Solid.make_box(0.2, 0.2, 0.2).moved(bd.Location(tuple(p - 0.1)))
    # forward: gear 1 turns by t1 (the probe is fixed to gear 1) ... seen from gear 2 turned by -t1/i and placed
    world = probe.rotate(bd.Axis.Z, t1)
    # undo gear 2's placement: translate back, R^-1, then undo gear 2's own turn
    back = world.translate((-hp.centre_distance, 0.0, 0.0)).rotate(bd.Axis.X, hp.sign * hp.shaft_angle_deg).rotate(bd.Axis.Z, 180.0)
    back = back.rotate(bd.Axis.Z, t1 / hp.ratio).center()
    assert (back.X, back.Y, back.Z) == pytest.approx((3.0, 0.0, h), abs=1e-9)


def test_refusals():
    with pytest.raises(ValueError, match="at least 4"):
        _hp(z1=3).validate()
    with pytest.raises(ValueError, match="shaft angle"):
        _hp(shaft_angle_deg=180.0).validate()
    with pytest.raises(ValueError, match="root circle"):
        _hp(bore_diameter_mm=100.0).validate()


# ---- gear 1 by construction (24.2) -----------------------------------------

def test_generator_map_carries_points_along_hyperboloid_generators():
    hp = _hp()
    s1 = hp.sigma1_rad
    for (x, y) in ((hp.a1, 0.0), (0.0, hp.a1 + 1.0), (-3.0, 4.0)):
        r = math.hypot(x, y)
        for s in (-3.0, 2.5):
            (X, Y, Z), = hy.generator_map([(x, y)], s1, 1.0, s)
            assert Z == pytest.approx(s * math.cos(s1))
            assert math.hypot(X, Y) == pytest.approx(hp.radius_at(1, r, Z))     # on the hyperboloid of its radius
            d = np.array([X - x, Y - y, Z])
            assert d @ np.array([x, y, 0.0]) == pytest.approx(0.0, abs=1e-9)      # tangent to its circle
            assert math.acos(abs(d[2]) / np.linalg.norm(d)) == pytest.approx(s1)  # inclined by Sigma_1


@pytest.fixture(scope="module")
def built():
    hp = _hp()
    return hp, hy.build_hyperboloidal_gear_solid(hp, 1), hy.build_hyperboloidal_gear_solid(hp, 2)


def test_gear1_is_one_valid_solid_on_its_hyperboloids(built):
    hp, g1, _ = built
    assert g1.is_valid and len(g1.solids()) == 1
    b = hp.face_width(1)
    bb = g1.bounding_box()
    assert (bb.min.Z, bb.max.Z) == pytest.approx((-0.5 * b, 0.5 * b), abs=1e-6)
    r_f, r_a = hp.a1 - hp.dedendum, hp.a1 + hp.addendum
    hs = np.linspace(-0.5 * b, 0.5 * b, 401)
    lo = np.trapezoid([math.pi * hp.radius_at(1, r_f, h) ** 2 for h in hs], hs)
    hi = np.trapezoid([math.pi * hp.radius_at(1, r_a, h) ** 2 for h in hs], hs)
    v = tessellated_volume(g1, 0.01)
    assert lo < v < hi
    # sections between the faces are the throat outline carried along the generators (exact ruling)
    pts = hy.throat_outline(hp, 1, 0.02)
    for f in (-0.35, 0.2):
        h = f * b
        s = h / math.cos(hp.sigma1_rad)
        expect = Polygon([(x, y) for x, y, _ in hy.generator_map(pts, hp.sigma1_rad, hp.sign, s)])
        pl = bd.Plane(origin=(0, 0, h), x_dir=(1, 0, 0), z_dir=(0, 0, 1))
        sec = unary_union([Polygon(t) for t in section_triangles(g1, pl, 60.0, 0.005)])
        assert sec.symmetric_difference(expect).area < 2e-3 * expect.area
        assert sec.hausdorff_distance(expect) < 0.03
    # the tip and root circles at the faces sit on their hyperboloids
    pl = bd.Plane(origin=(0, 0, 0.5 * b - 1e-3), x_dir=(1, 0, 0), z_dir=(0, 0, 1))
    sec = unary_union([Polygon(t) for t in section_triangles(g1, pl, 60.0, 0.005)])
    r = np.hypot(*np.array(sec.exterior.coords).T)
    assert r.max() == pytest.approx(hp.radius_at(1, r_a, 0.5 * b), abs=0.02)
    assert r.min() == pytest.approx(hp.radius_at(1, r_f, 0.5 * b), abs=0.02)


# ---- gear 2, generated (24.2) ----------------------------------------------

@pytest.fixture(scope="module")
def generated(built):
    hp, g1, g2c = built
    return hp, g1, g2c, hy.build_generated_gear2_solid(hp, n_positions=48, n_stations=7, n_profile=60)


def test_generated_gear2_is_one_valid_solid_with_z2_spaces_thinner_than_a_constructed_one(generated):
    hp, _, g2c, g2 = generated
    assert g2.is_valid and len(g2.solids()) == 1
    v, vc = tessellated_volume(g2, 0.01), tessellated_volume(g2c, 0.01)
    assert 0.95 * vc < v < vc                       # 46530 vs 47157: the generated teeth are the thinner
    pl = bd.Plane(origin=(0, 0, 0.5), x_dir=(1, 0, 0), z_dir=(0, 0, 1))
    sec = unary_union([Polygon(t) for t in section_triangles(g2, pl, 60.0, 0.01)])
    assert sec.is_valid and len(sec.interiors) == 0
    from shapely.affinity import rotate
    assert sec.symmetric_difference(rotate(sec, 360.0 / hp.z2, origin=(0, 0))).area < 1e-3 * sec.area
    r = np.hypot(*np.array(sec.exterior.coords).T)
    assert r.min() == pytest.approx(hp.radius_at(2, hp.a2 - hp.dedendum, 0.5), abs=0.05)     # the space is the dedendum deep
    assert r.max() == pytest.approx(hp.radius_at(2, hp.a2 + hp.addendum, 0.5), abs=0.02)     # and the rim the blank's


def test_pair_meshes_and_a_constructed_gear2_does_not(generated):
    hp, g1, g2c, g2 = generated
    v2 = tessellated_volume(g2, 0.01)
    for turn in (0.0, 7.0, 15.5):
        assert interpenetration_volume(g1.rotate(bd.Axis.Z, turn), hy.place_gear2(g2, hp, turn)) < 1e-6 * v2    # 1.8e-7 measured
    pitch = 360.0 / hp.z2
    assert interpenetration_volume(g1, hy.place_gear2(g2.rotate(bd.Axis.Z, 0.5 * pitch), hp, 0.0)) > 30.0        # 135 mm^3 measured
    # straight-generator teeth on BOTH members are not conjugate: the constructed gear 2 collides
    assert interpenetration_volume(g1, hy.place_gear2(g2c, hp, 0.0)) > 30.0                                     # 142 mm^3 measured


def test_pair_round_trips_through_step_as_two_solids(tmp_path):
    from build_gear import export_hyperboloidal_step
    path = tmp_path / "hyperboloidal.step"
    export_hyperboloidal_step(_hp(), path, n_positions=48, n_stations=7, n_profile=60)
    assert len(bd.import_step(str(path)).solids()) == 2


def test_server_derived_values_and_warnings():
    import server
    d, w = server.hyperboloidal_derived_values(_hp())
    hp = _hp()
    assert d["sigma1_deg"] == pytest.approx(math.degrees(hp.sigma1_rad)) and d["sigma2_deg"] == pytest.approx(math.degrees(hp.sigma2_rad))
    assert d["centre_distance_mm"] == pytest.approx(hp.centre_distance)
    assert d["throat_pitch_diameter_mm"] == pytest.approx(2.0 * hp.a1)
    assert d["mate_face_width_mm"] == pytest.approx(hp.face_width(2)) and d["ratio"] == 1.5
    assert not w
    _, w = server.hyperboloidal_derived_values(_hp(shaft_angle_deg=6.0))
    assert any("nearly a parallel-axis" in s for s in w)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
