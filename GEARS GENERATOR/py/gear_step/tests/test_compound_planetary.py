"""
Automated checks for compound (stepped-planet) planetary sets, split ring
and carrier output (docs/gear-math.md section 25).
Run with: python -m pytest gear_step/tests/test_compound_planetary.py -v
"""
import math
import sys
import tempfile
from itertools import product
from math import gcd
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from compound_planetary import CompoundPlanetaryParams, build_compound_planetary_set, build_compound_planet


def _volume(shape) -> float:
    if shape is None:
        return 0.0
    if isinstance(shape, bd.ShapeList):
        return sum(_volume(s) for s in shape)
    return sum(s.volume for s in shape.solids()) if shape.solids() else 0.0


def test_set_relationships_follow_the_formulas():
    """The default split-ring set: 18 / 24-23 x3 / rings 66 and 65 at one
    module -- a 173 : 1 reducer from four gear sizes, no tooth count under
    the undercut line -- and the MathWorks carrier-output block's own
    equation on a 12 / 30-12 / 54 set."""
    cp = CompoundPlanetaryParams()
    assert (cp.z_sun, cp.z_planet_1, cp.z_planet_2, cp.n_planets, cp.split_ring) == (18, 24, 23, 3, True)
    assert cp.z_ring_1 == 66 and cp.ring_2_teeth == 65 and cp.module_2 == pytest.approx(2.0)
    assert cp.center_distance_mm == pytest.approx(42.0) and cp.center_distance_mismatch_mm == pytest.approx(0.0)
    assert cp.ratio_split_ring == pytest.approx((1 + 66 / 18) / (1 - 66 * 23 / (65 * 24)))
    assert cp.ratio_split_ring == pytest.approx(173.333, abs=0.01)
    assert cp.ratio_carrier == pytest.approx(1 + 66 / 18)          # the sun to the carrier, ring 1 held
    assert cp.assembly_ok_1 and cp.assembly_ok_2 and cp.planet_gap_mm > 0 and not cp.check()
    small = CompoundPlanetaryParams(z_sun=12, z_planet_1=18, z_planet_2=17)
    assert small.z_ring_1 == 48 and small.ring_2_teeth == 47 and small.ratio_split_ring == pytest.approx(141.0, abs=0.05)

    mw = CompoundPlanetaryParams(z_sun=12, z_planet_1=30, z_planet_2=12, split_ring=False)
    assert mw.ring_2_teeth == 54 and mw.ratio_carrier == pytest.approx(1 + 54 * 30 / (12 * 12)) == pytest.approx(12.25)
    # (1 + gRP gPS) wC = wS + gRP gPS wR with the ring held (wR = 0): wS / wC = 1 + gRP gPS
    g_rp, g_ps = 54 / 12, 30 / 12
    assert mw.ratio_carrier == pytest.approx(1 + g_rp * g_ps)
    assert mw.ratio_sun_fixed == pytest.approx(1 + 1 / (g_rp * g_ps))
    assert mw.ratio_carrier_fixed == pytest.approx(-g_rp * g_ps)
    assert mw.assembly_ok_2 and not mw.check()

    # a plain planetary is the special case z_p1 == z_p2: the classic conditions and ratios come back
    plain = CompoundPlanetaryParams(z_sun=18, z_planet_1=18, z_planet_2=18, split_ring=False)
    assert plain.ring_2_teeth == 54 and plain.assembly_ok_2 == ((18 + 54) % 3 == 0)
    assert plain.ratio_carrier == pytest.approx(1 + 54 / 18)

    # module 2 and ring 2 both free: either one closes the centre distance
    r2 = CompoundPlanetaryParams(z_ring_2=70)
    assert r2.module_2 == pytest.approx(2.0 * 42 / (70 - 23)) and r2.center_distance_mismatch_mm == pytest.approx(0.0)
    m2 = CompoundPlanetaryParams(module_2_mm=1.5)
    assert m2.ring_2_teeth == 23 + round(2.0 * 42 / 1.5) == 79 and m2.center_distance_mismatch_mm == pytest.approx(0.0)


def test_assembly_condition_is_exactly_what_the_spin_search_needs():
    """The closed-form condition (z_s z_p2 + z_r2 z_p1) / gcd(z_p1, z_p2)
    divisible by n must agree, set by set, with whether every planet's
    whole-pitch turn exists (planet_spin_deg) -- over a few hundred sets."""
    checked = 0
    for z_s, z_p1, z_p2, n in product((8, 11, 12, 15, 16, 20), (9, 12, 18, 20, 24), (8, 9, 12, 15, 17, 20), (2, 3, 4, 5, 6)):
        cp = CompoundPlanetaryParams(z_sun=z_s, z_planet_1=z_p1, z_planet_2=z_p2, n_planets=n)
        try:
            for k in range(n):
                cp.planet_spin_deg(k)
            found = True
        except ValueError:
            found = False
        assert found == cp.assembly_ok_2, (z_s, z_p1, z_p2, n, cp.ring_2_teeth)
        checked += 1
    assert checked >= 500


def _meshes(cp: CompoundPlanetaryParams, planet0_phase_error_deg: float = 0.0):
    sun, planets, ring_2, ring_1 = build_compound_planetary_set(cp, simplify_tolerance_mm=0.05,
                                                                planet0_phase_error_deg=planet0_phase_error_deg)
    ref = min(sun.volume, planets[0].volume)
    hits = {
        "sun": [_volume(sun.intersect(p)) for p in planets],
        "ring 2": [_volume(ring_2.intersect(p)) for p in planets],
        "ring 1": [_volume(ring_1.intersect(p)) for p in planets] if ring_1 is not None else [],
    }
    return hits, ref, (sun, planets, ring_2, ring_1)


@pytest.mark.parametrize("kwargs", [
    dict(z_sun=12, z_planet_1=18, z_planet_2=17),                                       # spur split ring (141 : 1)
    dict(z_sun=12, z_planet_1=30, z_planet_2=12, split_ring=False),                    # spur carrier output, even gear 1
    dict(z_sun=12, z_planet_1=18, z_planet_2=17, helix_angle_deg=20.0, hand="left",
         face_width_mm=6.0, face_width_2_mm=6.0),                                      # helical split ring
    dict(z_sun=15, z_planet_1=24, z_planet_2=11, helix_angle_deg=25.0, herringbone=True,
         face_width_mm=6.0, face_width_2_mm=6.0, split_ring=False),                   # herringbone carrier output
])
def test_every_planet_meshes_every_ring_and_the_sun(kwargs):
    """Correct placement iff no member overlaps another: every planet against
    the sun, against ring 2 and (split ring) against ring 1 must intersect
    in (near) nothing, while planet 0 turned half a gear-1 pitch collides
    with the sun AND with ring 2 -- so the searched whole-pitch turn of each
    carried planet, the hands of a helical or herringbone set and the rings'
    frames are all checked by a test that can fail. Each planet is one
    valid, manifold solid (two gears and the hub, fused)."""
    cp = CompoundPlanetaryParams(**kwargs)
    assert not cp.check(), cp.check()
    hits, ref, (sun, planets, ring_2, ring_1) = _meshes(cp)
    for member, values in hits.items():
        for k, v in enumerate(values):
            assert v < 2e-4 * ref, (kwargs, member, k, v, ref)
    for p in planets:
        assert len(p.solids()) == 1 and p.is_valid and p.is_manifold, kwargs
    for i in range(len(planets)):
        for j in range(i + 1, len(planets)):
            assert _volume(planets[i].intersect(planets[j])) < 1e-9
    bad, _, _ = _meshes(cp, planet0_phase_error_deg=180.0 / cp.z_planet_1)
    assert bad["sun"][0] > 1e-3 * ref and bad["sun"][0] > 20 * max(hits["sun"][0], 1e-9), (kwargs, bad["sun"][0], ref)
    assert bad["ring 2"][0] > 1e-3 * ref and bad["ring 2"][0] > 20 * max(hits["ring 2"][0], 1e-9), (kwargs, bad["ring 2"][0], ref)


def test_planet_is_one_body_with_the_bore_through_both_gears_and_the_hub():
    cp = CompoundPlanetaryParams(z_sun=12, z_planet_1=18, z_planet_2=17, planet_bore_mm=6.0, face_width_mm=6.0, face_width_2_mm=5.0, step_gap_mm=2.0)
    planet = build_compound_planet(cp, simplify_tolerance_mm=0.05)
    assert len(planet.solids()) == 1 and planet.is_valid and planet.is_manifold
    bb = planet.bounding_box()
    assert bb.min.Z == pytest.approx(0.0, abs=1e-6) and bb.max.Z == pytest.approx(cp.planet_length_mm, abs=1e-6)
    # a probe along the axis passes clean through: the bore is there at every level
    probe = bd.Solid.make_cylinder(2.0, cp.planet_length_mm + 2.0, bd.Plane((0, 0, -1.0)))
    assert _volume(planet.intersect(probe)) < 1e-9
    # and material surrounds it at the step: the hub is there
    at_step = bd.Solid.make_cylinder(cp.hub_radius_mm - 0.2, 0.5, bd.Plane((0, 0, cp.face_width_mm + 0.75)))
    assert _volume(planet.intersect(at_step)) > 0.9 * (math.pi * (cp.hub_radius_mm - 0.2) ** 2 - math.pi * 3.0 ** 2) * 0.5


def test_step_export_round_trips_with_every_member():
    from build_gear import export_compound_planetary_step, export_compound_planetary_profile_dxf
    cp = CompoundPlanetaryParams(z_sun=12, z_planet_1=18, z_planet_2=17, face_width_mm=6.0, face_width_2_mm=6.0, bore_diameter_mm=5.0, planet_bore_mm=4.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "compound.step"
        export_compound_planetary_step(cp, path)
        assert len(bd.import_step(str(path)).solids()) == cp.n_planets + 3      # sun, planets, two rings
        export_compound_planetary_profile_dxf(cp, Path(d) / "compound.dxf")
        assert (Path(d) / "compound.dxf").stat().st_size > 1000
    one_ring = CompoundPlanetaryParams(z_sun=12, z_planet_1=18, z_planet_2=17, split_ring=False, face_width_mm=6.0, face_width_2_mm=6.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "compound.step"
        export_compound_planetary_step(one_ring, path)
        assert len(bd.import_step(str(path)).solids()) == one_ring.n_planets + 2


def test_refusals_name_the_limit():
    with pytest.raises(ValueError, match="helix angle"):
        CompoundPlanetaryParams(herringbone=True)
    # ring 2 and module 2 both pinned, inconsistent: the message says what would close the centre distance
    cp = CompoundPlanetaryParams(z_ring_2=70, module_2_mm=2.0)
    assert cp.center_distance_mismatch_mm != pytest.approx(0.0)
    msgs = cp.check()
    assert any("1.7872" in m for m in msgs), msgs          # 2 * 42 / (70 - 23)
    with pytest.raises(ValueError, match="centre distance"):
        build_compound_planetary_set(cp)
    # a pin bore that eats the hub
    big = CompoundPlanetaryParams(planet_bore_mm=42.0)          # gear 2's root circle is at r = 20.5: no hub left
    assert any("hub" in m for m in big.check())
    # a set that cannot be assembled says which condition; it still builds (the
    # card must show it), with the carried planets' gear 2 visibly into ring 2
    # (ring 2 at one module makes condition 2 read (z_s + z_p1)(z_p1 + z_p2)/gcd, which condition 1
    # already grants for an odd planet count -- four planets is where the two part company)
    bad = CompoundPlanetaryParams(z_sun=12, z_planet_1=18, z_planet_2=17, n_planets=4, face_width_mm=6.0, face_width_2_mm=6.0)
    assert bad.assembly_ok_1 and not bad.assembly_ok_2 and bad.check() and not bad.refusals()
    with pytest.raises(ValueError, match="cannot all mesh"):
        bad.planet_spin_deg(1)
    sun, planets, ring_2, _ = build_compound_planetary_set(bad, simplify_tolerance_mm=0.05)
    ref = planets[0].volume
    assert _volume(ring_2.intersect(planets[0])) < 2e-4 * ref            # planet 0 is placed by hand: fine
    assert max(_volume(ring_2.intersect(p)) for p in planets[1:]) > 1e-3 * ref   # a carried one collides
