"""
Automated checks for hypoid gears (docs/gear-math.md section 21).
Run with: python -m pytest gear_step/tests/test_hypoid.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import numpy as np
import pytest

from hypoid import HypoidParams, hypoid_pinion_local, place_hypoid_pinion, pinion_blank_local
from meshcheck import interpenetration_volume, total_volume


def _hp(**kw) -> HypoidParams:
    base = dict(z=30, pinion_teeth=12, module_mm=2.0, face_width_mm=8.0, offset_mm=6.0, spiral_angle_deg=35.0)
    base.update(kw)
    return HypoidParams(**base)


# ---- pitch geometry (21.1) ------------------------------------------------

def test_zero_offset_is_exactly_the_spiral_bevel_pinion():
    hp = _hp(offset_mm=0.0)
    geo = hp.pitch_geometry()
    pin = hp.gear_params().pinion_params()
    assert geo.delta == 0.0 and geo.psi_p == geo.psi_g
    assert geo.gamma_p == pytest.approx(pin.pitch_angle_rad, abs=1e-12)
    assert geo.A_mp == pytest.approx(pin.mean_cone_distance, abs=1e-9)
    assert geo.r_p == pytest.approx(pin.mean_cone_distance * math.sin(pin.pitch_angle_rad), abs=1e-9)
    # and the pinion sits exactly where bevel.place_bevel_pinion puts it: axis (sin 90, 0, cos 90), apex at the origin
    assert np.allclose(geo.a_p, [1.0, 0.0, 0.0], atol=1e-12) and np.allclose(geo.P_apex, 0.0, atol=1e-9)


@pytest.mark.parametrize("E", [3.0, 6.0, 9.0])
def test_offset_axis_is_exactly_e_from_the_gear_axis_and_at_the_shaft_angle(E):
    """The three closed-form conditions, re-derived in 3-D from the axis
    line the module actually reports, not from its own formulas."""
    geo = _hp(offset_mm=E).pitch_geometry()
    z = np.array([0.0, 0.0, 1.0])
    distance = abs(np.dot(geo.P_apex, np.cross(geo.a_p, z))) / np.linalg.norm(np.cross(geo.a_p, z))
    assert distance == pytest.approx(E, abs=1e-9)
    assert abs(np.dot(geo.a_p, z)) < 1e-12                          # 90 degree shaft angle
    assert np.linalg.norm(geo.a_p) == pytest.approx(1.0, abs=1e-12)
    # M lies on both pitch cones: at A_m from the gear apex on the gear cone, at A_mp from the pinion apex at gamma_p to a_p
    assert np.linalg.norm(geo.M) == pytest.approx(geo.A_m, abs=1e-9)
    v = geo.M - geo.P_apex
    assert np.linalg.norm(v) == pytest.approx(geo.A_mp, abs=1e-9)
    assert math.acos(np.dot(v, geo.a_p) / np.linalg.norm(v)) == pytest.approx(geo.gamma_p, abs=1e-9)


def test_turn_rate_from_the_tooth_normal_velocities_is_the_tooth_ratio():
    """omega_ratio is computed from equal velocity components across the
    common tooth trace at M -- an independent condition -- and must come
    out at exactly N/n if the pitch geometry is right."""
    for E in (0.0, 6.0, 12.0):
        geo = _hp(offset_mm=E).pitch_geometry()
        assert abs(geo.omega_ratio) == pytest.approx(30.0 / 12.0, abs=1e-9), E


def test_offset_makes_the_pinion_larger_and_its_spiral_angle_bigger():
    """The point of a hypoid: for the same ratio the pinion is bigger and
    more steeply spiralled than the bevel pinion, monotonically in E."""
    prev = _hp(offset_mm=0.0).pitch_geometry()
    for E in (2.0, 4.0, 6.0, 8.0):
        geo = _hp(offset_mm=E).pitch_geometry()
        assert geo.psi_p > prev.psi_p and geo.r_p > prev.r_p, E
        assert geo.psi_p > geo.psi_g
        prev = geo
    assert math.degrees(prev.psi_p - prev.psi_g) == pytest.approx(15.5, abs=1.5)   # ~ the classic 10-15 deg for E ~ 0.13 D


def test_an_impossible_offset_is_refused_with_a_reason():
    with pytest.raises(ValueError, match="beyond what this pair can take"):
        _hp(offset_mm=200.0).pitch_geometry()
    with pytest.raises(ValueError):
        _hp(offset_mm=-1.0).pitch_geometry()


def test_hand_mirrors_the_offset_side():
    right = _hp(hand="right").pitch_geometry()
    left = _hp(hand="left").pitch_geometry()
    assert right.offset_signed == pytest.approx(-left.offset_signed, abs=1e-12)
    assert right.psi_p == pytest.approx(left.psi_p) and right.r_p == pytest.approx(left.r_p)
    assert np.allclose(right.a_p * [1, -1, 1], left.a_p) and np.allclose(right.P_apex * [1, -1, 1], left.P_apex)


# ---- the generated pinion (21.2) ------------------------------------------

# the gear (meshing partner) and the generating tooth are built at the same
# n_phi / simplify settings by hypoid_pinion_local itself, so what the
# pinion is cut by and what it is checked against are the same surface
COARSE = dict(n_phi=120, simplify_tolerance_mm=0.03, fuse=False)     # the gear as blank + teeth: solid-by-solid checks, fast


def test_generated_pinion_is_one_valid_solid_with_n_spaces_cut_from_its_blank():
    hp = _hp()
    pinion, geo, gear = hypoid_pinion_local(hp, n_positions=60, n_stations=5, n_profile=60, **COARSE)
    assert len(pinion.solids()) == 1 and pinion.is_valid
    blank = pinion_blank_local(hp, geo)
    removed = 1.0 - pinion.volume / blank.volume
    assert 0.15 < removed < 0.35, removed          # n spaces about two modules deep out of a small blank
    # every one of the n spaces is there: the pinion is n-fold symmetric about its axis
    turned = pinion.rotate(bd.Axis.Z, 360.0 / hp.pinion_teeth)
    assert interpenetration_volume(pinion, turned) == pytest.approx(pinion.volume, rel=2e-3)


def test_pair_meshes_without_interpenetration_and_a_half_pitch_error_collides():
    """The conjugacy check every generated family here passes, solid by
    solid (meshcheck): the pinion generated from the offset relative motion,
    placed on its offset axis and turned N/n times the gear's turn, overlaps
    the gear by no more than sliver contact at three phases, and collides by
    orders of magnitude more turned half a pitch off.  Held to the spiral
    bevel pair's own bar (5e-5 of the gear); measured 3.4e-7 at these
    settings (docs 21.2 has the convergence table)."""
    hp = _hp()
    pinion, geo, gear = hypoid_pinion_local(hp, n_positions=240, n_stations=8, n_profile=80, **COARSE)
    ref = total_volume(gear)
    worst = max(interpenetration_volume(gear.rotate(bd.Axis.Z, turn), place_hypoid_pinion(pinion, geo, turn))
                for turn in (0.0, 4.0, 8.0))
    bad = interpenetration_volume(gear, place_hypoid_pinion(pinion, geo, 0.0, 180.0 / hp.pinion_teeth))
    assert worst < 5e-5 * ref, (worst, ref)
    assert bad > 2e-3 * ref and bad > 50 * max(worst, 1e-9), (worst, bad, ref)


def test_zero_offset_generates_the_spiral_bevel_pinion():
    """With E = 0 the generation must reproduce the spiral bevel family's
    own pinion (built by a completely different construction: Tredgold
    stations lofted along the trace).  Compared where both are fully
    defined: the family pinion's teeth end on the toe and heel spheres and
    its blank body on other planes than this blank's -- definitional
    differences, ~7 % of the volume, that a whole-solid comparison mistook
    for tooth error -- so the comparison is restricted to a slab along the
    axis from the toe sphere's on-axis point (s_toe) to where the heel
    sphere meets the tip cone (s_heel cos gamma_tip): every point of either
    pinion in that slab lies inside both spheres and inside both blanks.
    (A shell between the two spheres was the first clip tried; OpenCASCADE
    returned a null boolean for every lofted tooth against it.)  Inside the
    slab the two pinions' symmetric difference is a few percent at most,
    and the generated one meshes with the gear."""
    import math as _m
    from hypoid import pinion_tip_cone_angle
    hp = _hp(offset_mm=0.0)
    pinion, geo, gear = hypoid_pinion_local(hp, n_positions=240, n_stations=8, n_profile=80, **COARSE)
    from spiral_bevel import build_spiral_bevel_pair
    _, sb_pinion = build_spiral_bevel_pair(hp.gear_params(), n_stations=8, n_phi=120, simplify_tolerance_mm=0.03, fuse=False)
    placed = place_hypoid_pinion(pinion, geo, 0.0)
    gp = hp.gear_params()
    x0 = gp.outer_cone_distance - gp.face_width_mm + 0.1                         # the pinion axis is +X at E = 0
    x1 = gp.outer_cone_distance * _m.cos(pinion_tip_cone_angle(hp, geo)) - 0.1
    assert x1 - x0 > 0.5 * gp.face_width_mm
    slab = bd.Solid.make_box(x1 - x0, 80.0, 80.0).moved(bd.Location((x0, -40.0, -40.0)))
    ours = placed.intersect(slab)
    v_ours = total_volume(ours)
    v_family = interpenetration_volume(sb_pinion, slab)                          # blank body and teeth, solid by solid
    common = interpenetration_volume(ours, sb_pinion)
    sym_diff = v_ours + v_family - 2.0 * common
    assert v_ours > 0.3 * pinion.volume
    assert sym_diff < 0.03 * v_ours, (sym_diff, v_ours, v_family, common)
    assert interpenetration_volume(gear, placed) < 5e-5 * total_volume(gear)


def test_pair_round_trips_as_step():
    from build_gear import export_hypoid_step
    hp = _hp(bore_diameter_mm=10.0, pinion_bore_diameter_mm=5.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "hypoid.step"
        export_hypoid_step(hp, path, n_positions=60, n_stations=5, n_profile=60, n_phi=120, simplify_tolerance_mm=0.03)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 2               # the gear (one fused solid since docs 8.4) and the pinion


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
