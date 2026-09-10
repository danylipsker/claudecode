"""
Automated checks for crossed-helical (screw) gear pairs (docs/gear-math.md
section 7.5). Run with: python -m pytest gear_step/tests/test_crossed_helical.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from crossed_helical import CrossedHelicalPairParams, build_crossed_helical_pair, gear2_axis_direction


def test_pair_relationships_follow_the_textbook_formulas():
    """Sigma = beta1 + beta2 (same hand), d_i = m_n z_i / cos beta_i,
    a = (d1 + d2)/2, ratio = z2/z1 -- checked against the numbers, not the
    properties that compute them."""
    pp = CrossedHelicalPairParams(z1=18, z2=24, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0)
    assert abs(pp.helix2_deg - 45.0) < 1e-12 and pp.hand2 == "right"
    d1 = 2.0 * 18 / math.cos(math.radians(45.0))
    d2 = 2.0 * 24 / math.cos(math.radians(45.0))
    assert abs(pp.pitch_diameter1_mm - d1) < 1e-9
    assert abs(pp.pitch_diameter2_mm - d2) < 1e-9
    assert abs(pp.center_distance_mm - (d1 + d2) / 2.0) < 1e-9
    assert abs(pp.ratio - 24 / 18) < 1e-12

    # unequal helix angles: 30 + 60 = 90, gear 2 much larger for the same z
    pp = CrossedHelicalPairParams(z1=20, z2=20, module_mm=1.5, helix1_deg=30.0, shaft_angle_deg=90.0)
    assert abs(pp.helix2_deg - 60.0) < 1e-12
    assert pp.pitch_diameter2_mm > pp.pitch_diameter1_mm

    # Sigma below beta1: gear 2 takes the OPPOSITE hand with beta1 - Sigma
    pp = CrossedHelicalPairParams(z1=20, z2=20, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=30.0, hand="right")
    assert abs(pp.helix2_deg - 15.0) < 1e-12 and pp.hand2 == "left"
    # Sigma == beta1: gear 2 is a spur gear
    pp = CrossedHelicalPairParams(z1=20, z2=20, module_mm=2.0, helix1_deg=30.0, shaft_angle_deg=30.0)
    assert pp.helix2_deg == 0.0


def test_gear_2_is_placed_on_the_shaft_angle_at_the_centre_distance():
    pp = CrossedHelicalPairParams(z1=18, z2=24, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0, face_width_mm=10.0)
    s1, s2 = build_crossed_helical_pair(pp)
    # centres of mass: the polyline profile's simplification leaves a gear's
    # centroid a fraction of a micron off its axis, hence 10 um not 1 nm
    c1, c2 = s1.center(), s2.center()
    assert (c1 - bd.Vector(0, 0, 0)).length < 1e-2
    assert (c2 - bd.Vector(0, pp.center_distance_mm, 0)).length < 1e-2
    # gear 2's axis: its extent along the placed axis direction is its face
    # width, and its extent along gear 1's axis is NOT (the axes cross)
    ax = bd.Vector(*gear2_axis_direction(pp))
    assert abs(abs(ax.dot(bd.Vector(0, 0, 1))) - math.cos(math.radians(90.0))) < 1e-12
    zs = [v.dot(ax) for v in (bd.Vector(vt.X, vt.Y, vt.Z) for vt in s2.vertices())]
    assert abs((max(zs) - min(zs)) - pp.face_width_mm) < 1e-6


def _volume(shape) -> float:
    """build123d's intersect may hand back a ShapeList (several pieces, or
    none at all) rather than one Shape; total up whatever came back."""
    if shape is None:
        return 0.0
    if isinstance(shape, bd.ShapeList):
        return sum(_volume(s) for s in shape)
    return sum(s.volume for s in shape.solids()) if shape.solids() else 0.0


def _interpenetration(pp: CrossedHelicalPairParams, phase_offset2_deg: float = 0.0) -> tuple[float, float]:
    s1, s2 = build_crossed_helical_pair(pp, phase_offset2_deg=phase_offset2_deg)
    return _volume(s1.intersect(s2)), min(s1.volume, s2.volume)


@pytest.mark.parametrize("kwargs", [
    dict(z1=18, z2=24, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0, hand="right"),
    dict(z1=17, z2=23, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0, hand="left"),   # odd z2, left-hand
    dict(z1=20, z2=20, module_mm=1.5, helix1_deg=30.0, shaft_angle_deg=90.0, hand="right"),  # 30 + 60
    dict(z1=20, z2=20, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=30.0, hand="right"),  # opposite hands
])
def test_correct_mesh_does_not_interpenetrate_and_a_half_pitch_error_does(kwargs):
    """The placement and tooth phase are right iff the two solids do not
    overlap: the boolean intersection of the correctly placed pair must be
    (near) zero, while the same pair with gear 2 turned half a pitch --
    tooth on tooth at the pitch point -- must show a clear collision. The
    second half proves the first isn't vacuous."""
    pp = CrossedHelicalPairParams(face_width_mm=10.0, **kwargs)
    good, ref = _interpenetration(pp)
    bad, _ = _interpenetration(pp, phase_offset2_deg=180.0 / pp.z2)
    assert good < 2e-4 * ref, (kwargs, good, ref)
    assert bad > 20.0 * max(good, 1e-9) and bad > 1e-3 * ref, (kwargs, good, bad, ref)


def test_step_export_round_trips_as_two_solids():
    from build_gear import export_crossed_helical_pair_step
    pp = CrossedHelicalPairParams(z1=18, z2=24, module_mm=2.0, helix1_deg=45.0, shaft_angle_deg=90.0,
                                  face_width_mm=10.0, bore_diameter_mm=6.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "screw_pair.step"
        export_crossed_helical_pair_step(pp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 2
        s1, s2 = build_crossed_helical_pair(pp)
        assert abs(imported.volume - (s1.volume + s2.volume)) < 1e-3


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
