"""
Automated checks for spiral (and zerol) bevel gears (docs/gear-math.md
section 16). Run with: python -m pytest gear_step/tests/test_spiral_bevel.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from bevel import BevelGearParams, bevel_tooth_stations
from meshcheck import interpenetration_volume, total_volume
from spiral_bevel import (SpiralBevelParams, spiral_bevel_tooth_stations, loft_through_stations,
                          build_spiral_bevel_gear_solid, build_spiral_bevel_pair, station_cone_distances)


def _gear(**kw) -> SpiralBevelParams:
    base = dict(z=30, module_mm=2.0, mate_teeth=12, shaft_angle_deg=90.0, face_width_mm=8.0, spiral_angle_deg=35.0)
    base.update(kw)
    return SpiralBevelParams(**base)


def test_trace_matches_gleasons_spiral_angle_formula():
    """The circular-arc trace's spiral angle at any cone distance, measured
    as tan(psi) = s * d(phi_dev)/ds by numeric differentiation of the
    constructed offset, must equal Gleason's closed form
    sin(psi) = (s^2 - Rm^2 + 2 Rm rc sin psi_m) / (2 s rc) -- at the toe,
    the mean point (where it must be psi_m itself) and the heel; a zerol
    gear's trace is negative at the toe, zero at the mean, positive at the
    heel; and the hand only flips the sign of the true-angle offset."""
    for psi_m in (35.0, 20.0, 0.0):
        sp = _gear(spiral_angle_deg=psi_m)
        h = 1e-5
        for s in station_cone_distances(sp, 5):
            dphi = (sp.trace_offset_dev_rad(s + h) - sp.trace_offset_dev_rad(s - h)) / (2 * h)
            assert abs(math.atan(s * dphi) - sp.spiral_angle_at(s)) < 1e-6, (psi_m, s)
        assert abs(math.degrees(sp.spiral_angle_at(sp.mean_cone_distance)) - psi_m) < 1e-9
        assert abs(sp.trace_offset_rad(sp.mean_cone_distance)) < 1e-12
    zer = _gear(spiral_angle_deg=0.0)
    toe, mean, heel = station_cone_distances(zer, 3)
    assert zer.is_zerol and zer.spiral_angle_at(toe) < 0 < zer.spiral_angle_at(heel)
    left = _gear(hand="left")
    right = _gear(hand="right")
    assert abs(left.trace_offset_rad(heel) + right.trace_offset_rad(heel)) < 1e-12 and right.trace_offset_rad(heel) > 0


def test_pinion_shares_the_apex_and_mirrors_the_hand():
    sp = _gear()
    pin = sp.pinion_params()
    assert pin.z == 12 and pin.mate_teeth == 30 and pin.hand == "left"
    assert abs(pin.outer_cone_distance - sp.outer_cone_distance) < 1e-9   # same apex, same Re
    assert abs(pin.mean_cone_distance - sp.mean_cone_distance) < 1e-9
    assert abs(pin.cutter_radius - sp.cutter_radius) < 1e-9
    assert abs(pin.pitch_angle_deg + sp.pitch_angle_deg - 90.0) < 1e-9


def test_stations_are_the_straight_bevel_stations_turned_by_the_trace():
    """Nothing new in the section: at the toe and the heel a spiral station
    must be exactly the straight-bevel station (generated with the same
    transverse pressure angle) rotated about the axis by the trace offset."""
    sp = _gear()
    straight = BevelGearParams(z=sp.z, module_mm=sp.module_mm, mate_teeth=sp.mate_teeth,
                               shaft_angle_deg=sp.shaft_angle_deg,
                               pressure_angle_deg=math.degrees(sp.transverse_pressure_angle_rad),
                               face_width_mm=sp.face_width_mm)
    toe_s, heel_s = bevel_tooth_stations(straight, n_phi=240, simplify_tolerance_mm=0.02)
    stations = spiral_bevel_tooth_stations(sp, n_stations=10, n_phi=240, simplify_tolerance_mm=0.02)
    toe_d, heel_d = station_cone_distances(sp, 2)
    for straight_pts, spiral_pts, s in ((toe_s, stations[0], toe_d), (heel_s, stations[-1], heel_d)):
        a = sp.trace_offset_rad(s)
        c, sn = math.cos(a), math.sin(a)
        assert len(straight_pts) == len(spiral_pts)
        worst = max(math.dist((c * x - sn * y, sn * x + c * y, z), q) for (x, y, z), q in zip(straight_pts, spiral_pts))
        assert worst < 1e-9, (s, worst)


def test_tooth_loft_passes_through_its_stations_and_is_accurate_between_them():
    """The loft hazard, measured: with OpenCASCADE's vertex-compatibility
    check on, a loft through rotated sections re-pairs vertices by proximity
    and shears the surface (359 um on the helical gear); this builder turns
    it off. So every station of a 10-station tooth must lie on the built
    surface, and the intermediate stations of a 37-station build of the same
    tooth -- points the 10-station loft never saw -- must lie on it too."""
    sp = _gear()
    coarse = spiral_bevel_tooth_stations(sp, n_stations=10)
    tooth = loft_through_stations(coarse)
    assert tooth.is_valid and tooth.is_manifold and tooth.volume > 0
    worst_on = max(tooth.distance_to(bd.Vertex(*p)) for st in coarse[::3] for p in st[::5])
    fine = spiral_bevel_tooth_stations(sp, n_stations=37)
    worst_between = max(tooth.distance_to(bd.Vertex(*p)) for i in (2, 6, 18, 30) for p in fine[i][::5])
    assert worst_on < 0.002, worst_on
    assert worst_between < 0.010, worst_between


def test_full_gear_is_a_blank_plus_z_manifold_teeth_and_round_trips_as_step():
    from build_gear import export_spiral_bevel_step
    for kwargs in (dict(), dict(spiral_angle_deg=0.0, bore_diameter_mm=8.0), dict(z=13, mate_teeth=20, hand="left")):
        sp = _gear(**kwargs)
        g = build_spiral_bevel_gear_solid(sp, n_stations=6)
        bodies = g.solids()
        assert len(bodies) == sp.z + 1, kwargs
        assert all(b.is_manifold for b in bodies), kwargs
    sp = _gear(z=16, mate_teeth=16)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "spiral_bevel.step"
        export_spiral_bevel_step(sp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == sp.z + 1


@pytest.mark.parametrize("psi_m", [35.0, 0.0])
def test_pair_meshes_without_interpenetration_and_a_half_pitch_error_collides(psi_m):
    """The conjugacy check, solid by solid (meshcheck): a gear and its
    pinion -- same module, shaft angle, face width, spiral angle and cutter
    radius, opposite hands -- in mesh at three rotation phases must overlap
    by no more than sliver contact, and the same pair with the pinion
    turned half a pitch must collide by two orders of magnitude more. The
    straight bevel pair measures 0.12 mm^3 (0.001 % of the gear) in phase
    and 111 mm^3 mis-phased with this very check; spiral and zerol are held
    to the same standard."""
    sp = _gear(spiral_angle_deg=psi_m)
    ref = None
    worst = 0.0
    for turn in (0.0, 4.0, 8.0):
        gear, pinion = build_spiral_bevel_pair(sp, gear_turn_deg=turn, n_stations=8, n_phi=120, simplify_tolerance_mm=0.03)
        ref = ref or total_volume(gear)
        worst = max(worst, interpenetration_volume(gear, pinion))
    gear, pinion = build_spiral_bevel_pair(sp, phase_error_deg=180.0 / sp.mate_teeth, n_stations=8, n_phi=120, simplify_tolerance_mm=0.03)
    bad = interpenetration_volume(gear, pinion)
    assert worst < 5e-5 * ref, (psi_m, worst, ref)
    assert bad > 2e-3 * ref and bad > 50 * max(worst, 1e-9), (psi_m, worst, bad, ref)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
