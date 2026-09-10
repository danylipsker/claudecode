"""
Automated checks for double-helical (herringbone) gears (docs/gear-math.md
section 7.4). Run with: python -m pytest gear_step/tests/test_herringbone.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest
from shapely.affinity import rotate as sh_rotate
from shapely.geometry import Point, Polygon

from involute import GearParams, full_gear_outline
from build_gear import build_double_helical_solid, export_double_helical_step


def _worst_section_distance(solid, z: float, exact: Polygon) -> float:
    """Cut the solid at height z and measure how far its outline strays from
    the exact polygon -- the same check test_involute.py uses to prove the
    helical sweep is the true helicoid between the end faces."""
    section = solid.intersect(bd.Plane((0, 0, z)))
    worst = 0.0
    for edge in section.edges():
        for t in (0.0, 0.25, 0.5, 0.75, 1.0):
            v = edge.position_at(t)
            worst = max(worst, exact.exterior.distance(Point(v.X, v.Y)))
    return worst


def test_each_half_is_the_true_helicoid_and_the_halves_mirror_about_the_mid_plane():
    """At any height z in the lower half the section must be the profile
    rotated by exactly twist_half * z/half_fw, and the section at the
    mirror height face_width - z must be the SAME polygon (opposite hand
    by construction: the twist runs back down to zero at the far face).
    Both end faces carry the un-rotated profile. Sub-10 um, bore-free
    cases, both hands, with and without a centre gap."""
    cases = [
        (dict(z=18, module_mm=2.5, face_width_mm=20.0, helix_angle_deg=30.0, hand="right"), 0.0),
        (dict(z=24, module_mm=2.0, face_width_mm=24.0, helix_angle_deg=25.0, hand="left"), 4.0),
    ]
    for kwargs, gap in cases:
        gp = GearParams(**kwargs)
        solid = build_double_helical_solid(gp, gap_mm=gap)
        base = Polygon([tuple(p) for p in full_gear_outline(gp, simplify_tolerance_mm=0.05)])
        fw = gp.face_width_mm
        half = (fw - gap) / 2.0
        twist_half = gp.twist_total_rad * half / fw
        for zfrac in (0.2, 0.5, 0.8):
            z_lo = zfrac * half
            exact = sh_rotate(base, math.degrees(twist_half * zfrac), origin=(0, 0))
            assert _worst_section_distance(solid, z_lo, exact) < 0.010, (kwargs, gap, zfrac, "lower")
            assert _worst_section_distance(solid, fw - z_lo, exact) < 0.010, (kwargs, gap, zfrac, "upper")
        assert _worst_section_distance(solid, 1e-3, base) < 0.010, (kwargs, gap, "bottom face")
        assert _worst_section_distance(solid, fw - 1e-3, base) < 0.010, (kwargs, gap, "top face")
        # the apex: just below and just above the mid-plane (or the gap) the
        # two halves must present the same, fully twisted profile
        apex = sh_rotate(base, math.degrees(twist_half), origin=(0, 0))
        assert _worst_section_distance(solid, half - 1e-3, apex) < 0.010
        assert _worst_section_distance(solid, half + gap + 1e-3, apex) < 0.010


def test_is_one_manifold_body_with_the_expected_volume():
    """Two sweeps plus (optionally) a gap cylinder must fuse into ONE solid,
    and Cavalieri fixes its volume exactly: a twist-extrude's sections are
    all congruent, so volume = profile area x swept length, plus the gap
    cylinder, minus the bore."""
    for gap in (0.0, 3.0):
        gp = GearParams(z=20, module_mm=2.0, face_width_mm=16.0, helix_angle_deg=30.0, bore_diameter_mm=6.0)
        solid = build_double_helical_solid(gp, gap_mm=gap)
        bodies = solid.solids()
        assert len(bodies) == 1, gap
        assert bodies[0].is_manifold, gap
        area = Polygon([tuple(p) for p in full_gear_outline(gp, simplify_tolerance_mm=0.05)]).area
        expected = (area * (gp.face_width_mm - gap)
                    + math.pi * gp.dedendum_radius ** 2 * gap
                    - math.pi * (gp.bore_diameter_mm / 2.0) ** 2 * gp.face_width_mm)
        assert abs(solid.volume - expected) / expected < 0.002, (gap, solid.volume, expected)


def test_step_export_round_trips_as_one_solid():
    gp = GearParams(z=16, module_mm=3.0, face_width_mm=18.0, helix_angle_deg=30.0, bore_diameter_mm=8.0)
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "herringbone.step"
        export_double_helical_step(gp, 2.0, path)
        assert path.exists() and path.stat().st_size > 10_000
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 1
        assert abs(imported.volume - build_double_helical_solid(gp, gap_mm=2.0).volume) < 1e-3


def test_rejects_a_spur_helix_and_an_oversized_gap():
    with pytest.raises(ValueError):
        build_double_helical_solid(GearParams(z=20, module_mm=2.0, helix_angle_deg=0.0))
    with pytest.raises(ValueError):
        build_double_helical_solid(GearParams(z=20, module_mm=2.0, face_width_mm=10.0, helix_angle_deg=20.0), gap_mm=10.0)


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
