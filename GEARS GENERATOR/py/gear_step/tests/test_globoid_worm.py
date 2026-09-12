"""
Automated checks for the double-enveloping (globoid) worm and its throated
wheel (docs/gear-math.md section 22).
Run with: python -m pytest gear_step/tests/test_globoid_worm.py -v
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import numpy as np
import pytest
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union

from globoid_worm import GloboidWormParams, build_globoid_worm_solid, thread_section, thread_solids
from throated_wheel import (HOB_ROOT_OVERLAP_MM, place_worm, wheel_turn_rad, wheel_outer_radius_at, wheel_rim_radius,
                            wheel_blank_radius_at, wheel_throat_half_height, wheel_blank_solid, station_plane_in_worm_frame,
                            hob_threads, build_throated_wheel_solid)
from generation import MeshSectioner, section_triangles
from meshcheck import interpenetration_volume


def _gp(**kw) -> GloboidWormParams:
    base = dict(starts=1, wheel_teeth=30, axial_module_mm=2.0, pitch_diameter_mm=24.0)
    base.update(kw)
    return GloboidWormParams(**base)


# ---- the worm (22.1) --------------------------------------------------------

def test_hourglass_pitch_surface_is_the_wheel_pitch_circle_revolved_about_the_worm_axis():
    gp = _gp()
    a, r_g = gp.centre_distance, gp.wheel_pitch_radius
    assert a == pytest.approx(12.0 + 30.0)
    assert gp.pitch_radius_at(0.0) == pytest.approx(gp.pitch_radius)                    # the throat
    for z in (3.0, 8.0, 12.0):
        assert gp.pitch_radius_at(z) == pytest.approx(a - math.sqrt(r_g ** 2 - z ** 2))  # wider away from it
        assert gp.pitch_radius_at(z) > gp.pitch_radius
    assert gp.tip_radius_at(0.0) == pytest.approx(gp.pitch_radius + gp.addendum)
    assert gp.root_radius_at(0.0) == pytest.approx(gp.pitch_radius - gp.dedendum)


def test_wrap_length_and_lead_angle():
    gp = _gp()
    assert math.degrees(gp.wrap_angle_rad) == pytest.approx(4.0 * 360.0 / 30.0)            # 4 pitches of 12 deg
    assert gp.length == pytest.approx(2.0 * gp.wheel_pitch_radius * math.sin(0.5 * gp.wrap_angle_rad))
    assert math.degrees(gp.lead_angle_rad) == pytest.approx(math.degrees(math.atan2(1 * 2.0, 24.0)))
    assert gp.ratio == 30.0


def test_throat_section_is_the_za_trapezoid_of_a_cylindrical_worm():
    """At the throat (the central plane, wheel angle 0) the thread section is
    the standard straight-sided trapezoid: thickness pi m / 2 at the pitch
    radius, flanks at the pressure angle, addendum and dedendum as coefficients."""
    gp = _gp()
    sec = Polygon([(z, r) for (z, r) in thread_section(gp, 0.0, n_arc=24)])
    assert sec.is_valid
    r_p, a, r_g = gp.pitch_radius, gp.centre_distance, gp.wheel_pitch_radius
    # the thickness at the pitch circle is an arc about the wheel centre C = (0, a):
    # pi m / 2 along it (a chord at constant worm radius r_p sits 0.04 mm lower at its
    # ends, where the 20 deg flanks are already 1 % further apart)
    arc = LineString([(r_g * math.sin(g), a - r_g * math.cos(g)) for g in np.radians(np.linspace(-10.0, 10.0, 2001))])
    assert sec.intersection(arc).length == pytest.approx(math.pi * gp.module / 2.0, rel=2e-3)
    thick_at = lambda r: sec.intersection(LineString([(-50.0, r), (50.0, r)])).length
    # each flank is at alpha to the radial line from C through its pitch point, and that
    # line is half a tooth angle (pi / 2 z_g = 3 deg) off the worm's radial direction: the
    # thread's straight flanks are 23 deg to it here, not a ZA worm's 20 (docs 22.1)
    d = 0.5
    lean = gp.pressure_angle_rad + math.pi / gp.wheel_teeth - gp.tooth_half_angle
    assert (thick_at(r_p - d) - thick_at(r_p + d)) == pytest.approx(4.0 * d * math.tan(lean), rel=2e-3)
    assert sec.bounds[3] == pytest.approx(r_p + gp.addendum, rel=1e-3)                    # tip at the addendum


def test_worm_turn_moves_the_wheel_by_the_ratio_and_the_hand_flips_it():
    gp = _gp()
    assert math.degrees(wheel_turn_rad(gp, 2.0 * math.pi)) == pytest.approx(-360.0 / 30.0)  # one turn = one pitch, right hand
    assert wheel_turn_rad(_gp(hand="left"), 1.0) == pytest.approx(-wheel_turn_rad(gp, 1.0))
    assert wheel_turn_rad(_gp(starts=2), 1.0) == pytest.approx(2.0 * wheel_turn_rad(gp, 1.0))


def test_worm_solid_is_one_valid_hourglass_of_sensible_volume():
    gp = _gp()
    worm = build_globoid_worm_solid(gp)
    assert len(worm.solids()) == 1 and worm.is_valid
    zs = np.linspace(-gp.length / 2, gp.length / 2, 200)
    root_vol = sum(math.pi * gp.root_radius_at(z) ** 2 * (gp.length / 200) for z in zs)
    tip_vol = sum(math.pi * gp.tip_radius_at(z) ** 2 * (gp.length / 200) for z in zs)
    assert root_vol < worm.volume < tip_vol
    threads = thread_solids(gp)
    assert len(threads) == gp.starts and all(t.is_valid for t in threads)


# ---- the frames and the hob (22.2) -----------------------------------------

def test_place_worm_maps_the_worm_frame_onto_the_wheel_frame_as_documented():
    """(x, y, z) -> (a - x, z, y): the worm's axis lands on the line {X = a,
    Z = 0} along Y in the wheel frame, and the station plane pulled back
    into the worm frame round-trips a point exactly."""
    gp = _gp()
    a = gp.centre_distance
    box = bd.Solid.make_box(2, 2, 2).moved(bd.Location((2.0, -3.0, 4.0)))    # centre (3, -2, 5)
    c = place_worm(box, gp, 0.0).center()
    assert (c.X, c.Y, c.Z) == pytest.approx((a - 3.0, 5.0, -2.0), abs=1e-9)
    h, t = 2.0, 0.5
    pl = station_plane_in_worm_frame(gp, h, t)
    p_v = np.array(tuple(pl.origin)) + 3.0 * np.array(tuple(pl.x_dir))                 # the plane's local (3, 0)
    probe = bd.Solid.make_box(0.2, 0.2, 0.2).moved(bd.Location(tuple(p_v - 0.1)))
    q = place_worm(probe.rotate(bd.Axis.Z, math.degrees(t)), gp, 0.0).rotate(bd.Axis.Z, -math.degrees(wheel_turn_rad(gp, t))).center()
    assert (q.X, q.Y, q.Z) == pytest.approx((3.0, 0.0, h), abs=1e-9)


def test_hob_is_the_worm_thread_with_the_clearance_at_the_tip_and_the_overlap_at_the_root():
    gp = _gp()
    a = gp.centre_distance
    c = gp.dedendum - gp.addendum
    worm_pts = thread_section(gp, 0.3, n_arc=24)
    hob_pts = thread_section(gp, 0.3, n_arc=24, tip_extension_mm=c, root_overlap_mm=HOB_ROOT_OVERLAP_MM)
    worm_sec, hob_sec = Polygon(worm_pts), Polygon(hob_pts)
    assert worm_sec.difference(hob_sec).area < 1e-9        # the hob contains the thread (corners on its flanks)
    rho = lambda pts: [math.hypot(z, a - r) for (z, r) in pts]
    assert min(rho(worm_pts)) == pytest.approx(gp.tip_rho, abs=1e-6)
    assert min(rho(hob_pts)) == pytest.approx(gp.tip_rho - c, abs=1e-6)
    assert max(rho(hob_pts)) == pytest.approx(gp.root_rho + HOB_ROOT_OVERLAP_MM, abs=1e-6)
    # the flanks are the same lines: the worm section's four corners lie on the hob's boundary
    for i in (0, 24, 25, 49):
        assert hob_sec.boundary.distance(Point(worm_pts[i])) < 1e-6


def test_mesh_sectioner_agrees_with_analytic_sections_and_keeps_holes():
    box = bd.Solid.make_box(10, 20, 30).moved(bd.Location((-5.0, -10.0, -15.0)))
    ms = MeshSectioner(box, 0.005)
    assert ms.signed_volume == pytest.approx(6000.0)
    flat = unary_union(ms.section_polygons(bd.Plane(origin=(0, 0, 7.0), x_dir=(1, 0, 0), z_dir=(0, 0, 1))))
    assert flat.area == pytest.approx(200.0, rel=1e-9)
    th = math.radians(30.0)     # tilted about X through the centre: a 10 x (20 / cos) rectangle
    tilted = unary_union(ms.section_polygons(bd.Plane(origin=(0, 0, 0), x_dir=(1, 0, 0), z_dir=(0, math.sin(th), math.cos(th)))))
    assert tilted.area == pytest.approx(200.0 / math.cos(th), rel=1e-9)
    assert tilted.exterior.is_ccw
    tube = bd.Solid.make_cylinder(10.0, 8.0).cut(bd.Solid.make_cylinder(4.0, 8.0))
    polys = MeshSectioner(tube, 0.005).section_polygons(bd.Plane(origin=(0, 0, 2.0), x_dir=(1, 0, 0), z_dir=(0, 0, 1)))
    assert len(polys) == 1 and len(polys[0].interiors) == 1
    assert polys[0].area == pytest.approx(math.pi * (100.0 - 16.0), rel=2e-3)
    # the same section from OpenCASCADE, to the tessellation tolerance
    hob = hob_threads(_gp())[0]
    pl = station_plane_in_worm_frame(_gp(), 3.0, 0.7)
    exact = unary_union([Polygon(t) for t in section_triangles(hob, pl, 36.0, 0.005)])
    mesh = unary_union(MeshSectioner(hob, 0.005).section_polygons(pl)).intersection(Point(0, 0).buffer(36.0, quad_segs=360))
    assert mesh.area == pytest.approx(exact.area, rel=5e-3)
    assert exact.hausdorff_distance(mesh) < 0.05


# ---- the blank and the wheel (22.2) ----------------------------------------

def test_blank_is_the_throat_torus_inside_the_outside_cylinder():
    gp = _gp()
    a, r_w, b = gp.centre_distance, gp.pitch_radius - gp.addendum, gp.wheel_face_width
    assert wheel_outer_radius_at(gp, 0.0) == pytest.approx(a - r_w)                                   # 32: the wheel's addendum circle
    assert wheel_rim_radius(gp) == pytest.approx(gp.wheel_pitch_radius + gp.addendum + 0.5 * gp.module)   # DIN 3975 d_e2 = d_a2 + m
    h_t = wheel_throat_half_height(gp)
    assert wheel_outer_radius_at(gp, h_t) == pytest.approx(wheel_rim_radius(gp))
    assert 0.0 < h_t < 0.5 * b
    assert wheel_blank_radius_at(gp, 0.5 * b) == pytest.approx(wheel_rim_radius(gp))
    assert b == pytest.approx(1.2 * (gp.pitch_radius - gp.dedendum))                                  # 74 deg of envelopment
    assert _gp(wheel_face_width_mm=40.0).wheel_face_width == pytest.approx(gp.wheel_face_width_limit)
    blank = wheel_blank_solid(gp)
    assert blank.is_valid and len(blank.solids()) == 1
    hs = np.linspace(-0.5 * b, 0.5 * b, 4001)
    assert blank.volume == pytest.approx(np.trapezoid([math.pi * wheel_blank_radius_at(gp, h) ** 2 for h in hs], hs), rel=1e-3)
    bored = wheel_blank_solid(_gp(wheel_bore_diameter_mm=10.0))
    assert bored.volume == pytest.approx(blank.volume - math.pi * 25.0 * b, rel=1e-3)


@pytest.fixture(scope="module")
def coarse_pair():
    gp = _gp()
    wheel = build_throated_wheel_solid(gp, n_positions=48, n_stations=5, n_profile=60)
    return gp, wheel, build_globoid_worm_solid(gp)


def test_wheel_is_one_valid_solid_with_z_g_identical_spaces(coarse_pair):
    gp, wheel, _ = coarse_pair
    assert len(wheel.solids()) == 1 and wheel.is_valid
    blank_v = wheel_blank_solid(gp).volume
    assert 0.80 * blank_v < wheel.volume < 0.90 * blank_v            # 0.853 measured
    pl = bd.Plane(origin=(0, 0, 1.0), x_dir=(1, 0, 0), z_dir=(0, 0, 1))
    sec = unary_union([Polygon(t) for t in section_triangles(wheel, pl, 40.0, 0.01)])
    assert sec.is_valid and len(sec.interiors) == 0
    from shapely.affinity import rotate
    turned = rotate(sec, 360.0 / gp.wheel_teeth, origin=(0, 0))
    assert sec.symmetric_difference(turned).area < 1e-3 * sec.area
    # the space is the wheel's dedendum deep at the throat and the rim is the blank's
    r = np.hypot(*np.array(sec.exterior.coords).T)
    assert r.min() == pytest.approx(gp.wheel_pitch_radius - gp.dedendum, abs=0.05)
    assert r.max() == pytest.approx(wheel_blank_radius_at(gp, 1.0), abs=0.02)


def test_pair_meshes_in_phase_and_collides_when_mis_phased(coarse_pair):
    gp, wheel, worm = coarse_pair
    for turn in (0.0, 137.0, 250.0):
        w = place_worm(worm, gp, turn)
        g = wheel.rotate(bd.Axis.Z, math.degrees(wheel_turn_rad(gp, math.radians(turn))))
        assert interpenetration_volume(w, g) < 1e-6 * wheel.volume    # 2e-8 measured
    g = wheel.rotate(bd.Axis.Z, 180.0 / gp.wheel_teeth)
    assert interpenetration_volume(place_worm(worm, gp, 0.0), g) > 100.0   # 448 mm^3 measured


def test_pair_round_trips_through_step_as_two_solids(tmp_path):
    from build_gear import export_globoid_worm_step
    path = tmp_path / "globoid.step"
    export_globoid_worm_step(_gp(), path, n_positions=48, n_stations=5, n_profile=60)
    imported = bd.import_step(str(path))
    assert len(imported.solids()) == 2


def test_server_derived_values_and_warnings():
    import server
    d, w = server.globoid_worm_derived_values(_gp())
    assert d["wheel_outside_diameter_mm"] == pytest.approx(66.0)
    assert d["wheel_throat_outer_diameter_mm"] == pytest.approx(64.0)
    assert d["centre_distance_mm"] == pytest.approx(42.0) and d["ratio"] == 30.0
    assert d["module_mm"] == 2.0 and d["diametral_pitch"] == pytest.approx(12.7)
    assert not w
    _, w = server.globoid_worm_derived_values(_gp(wheel_teeth=16))
    assert any("16-tooth" in s for s in w)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
