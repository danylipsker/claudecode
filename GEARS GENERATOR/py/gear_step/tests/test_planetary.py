"""
Automated checks for planetary (epicyclic) gear sets (docs/gear-math.md
section 11.4). Run with: python -m pytest gear_step/tests/test_planetary.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest

from planetary import PlanetaryParams, build_planetary_set


def _volume(shape) -> float:
    if shape is None:
        return 0.0
    if isinstance(shape, bd.ShapeList):
        return sum(_volume(s) for s in shape)
    return sum(s.volume for s in shape.solids()) if shape.solids() else 0.0


def test_set_relationships_follow_the_textbook_formulas():
    pp = PlanetaryParams(z_sun=12, z_planet=9, n_planets=3, module_mm=2.0)
    assert pp.z_ring == 30
    assert abs(pp.center_distance_mm - 2.0 * (12 + 9) / 2.0) < 1e-12
    assert pp.assembly_ok                       # (12 + 30) / 3 = 14
    assert abs(pp.ratio_ring_fixed - (1 + 30 / 12)) < 1e-12
    assert abs(pp.ratio_sun_fixed - (1 + 12 / 30)) < 1e-12
    assert abs(pp.ratio_carrier_fixed - (-30 / 12)) < 1e-12
    assert pp.planet_gap_mm > 0
    # (12 + 30) / 4 is not an integer: four equally spaced planets cannot all mesh
    assert not PlanetaryParams(z_sun=12, z_planet=9, n_planets=4).assembly_ok
    # ring-planet centre distance equals sun-planet: r_r - r_p = (z_s + 2z_p - z_p) m/2 = a
    assert abs(pp.module_mm * (pp.z_ring - pp.z_planet) / 2.0 - pp.center_distance_mm) < 1e-12
    # planets that would touch each other are reported as such
    assert PlanetaryParams(z_sun=8, z_planet=30, n_planets=6, module_mm=1.0).planet_gap_mm < 0


def _meshes(pp: PlanetaryParams, planet0_phase_error_deg: float = 0.0):
    sun, planets, ring = build_planetary_set(pp, planet0_phase_error_deg=planet0_phase_error_deg)
    ref = min(sun.volume, planets[0].volume)
    sun_hits = [_volume(sun.intersect(p)) for p in planets]
    ring_hits = [_volume(ring.intersect(p)) for p in planets]
    return sun_hits, ring_hits, ref, (sun, planets, ring)


@pytest.mark.parametrize("kwargs", [
    dict(z_sun=12, z_planet=9, n_planets=3, module_mm=2.0),             # odd planet, 3 planets
    dict(z_sun=16, z_planet=8, n_planets=4, module_mm=1.5),             # even planet, 4 planets
    dict(z_sun=13, z_planet=11, n_planets=5, module_mm=1.0),            # (13+35)/5 -- not integer? 48/5 no -> use n=3
])
def test_every_planet_meshes_with_both_the_sun_and_the_ring(kwargs):
    """Correct placement iff no member overlaps another: the boolean
    intersection of every planet with the sun and with the ring must be
    (near) zero, while turning planet 0 half a pitch must collide with BOTH
    -- so the phase of every planet (including the carried ones whose spin
    depends on the assembly condition) is verified by a check that can fail."""
    pp = PlanetaryParams(face_width_mm=8.0, **kwargs)
    if not pp.assembly_ok:
        pp = PlanetaryParams(face_width_mm=8.0, **dict(kwargs, n_planets=3))
        assert pp.assembly_ok, kwargs
    sun_hits, ring_hits, ref, _ = _meshes(pp)
    for k, (s, r) in enumerate(zip(sun_hits, ring_hits)):
        assert s < 2e-4 * ref, (kwargs, k, "sun", s, ref)
        assert r < 2e-4 * ref, (kwargs, k, "ring", r, ref)
    bad_sun, bad_ring, _, _ = _meshes(pp, planet0_phase_error_deg=180.0 / pp.z_planet)
    assert bad_sun[0] > 1e-3 * ref and bad_sun[0] > 20 * max(sun_hits[0], 1e-9), (kwargs, bad_sun[0], ref)
    assert bad_ring[0] > 1e-3 * ref and bad_ring[0] > 20 * max(ring_hits[0], 1e-9), (kwargs, bad_ring[0], ref)


def test_planets_do_not_touch_each_other_and_sit_at_the_centre_distance():
    pp = PlanetaryParams(z_sun=12, z_planet=9, n_planets=3, module_mm=2.0, face_width_mm=8.0)
    sun, planets, ring = build_planetary_set(pp)
    for k, p in enumerate(planets):
        c = p.center()
        ang = math.radians(pp.planet_angle_deg(k))
        expected = bd.Vector(pp.center_distance_mm * math.cos(ang), pp.center_distance_mm * math.sin(ang), pp.face_width_mm / 2)
        assert (c - expected).length < 1e-2, (k, c, expected)
    for i in range(len(planets)):
        for j in range(i + 1, len(planets)):
            assert _volume(planets[i].intersect(planets[j])) < 1e-9


def test_step_export_round_trips_with_every_member():
    from build_gear import export_planetary_step
    pp = PlanetaryParams(z_sun=12, z_planet=9, n_planets=3, module_mm=2.0, face_width_mm=8.0, bore_diameter_mm=5.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "planetary.step"
        export_planetary_step(pp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 2 + pp.n_planets


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
