"""
Automated checks for cycloidal drives / hypocycloid speed reducers
(docs/gear-math.md section 15).
Run with: python -m pytest gear_step/tests/test_cycloidal_drive.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest
from shapely.affinity import rotate as sh_rotate, translate as sh_translate
from shapely.geometry import Point, Polygon

from cycloidal_drive import (CycloidalDriveParams, disc_profile, disc_polygon, min_radius_of_curvature,
                             build_disc_solid, build_drive_assembly)


@pytest.mark.parametrize("kwargs", [
    dict(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5),
    dict(lobes=7, pin_circle_diameter_mm=50.0, roller_diameter_mm=8.0, eccentricity_mm=2.0),
    dict(lobes=19, pin_circle_diameter_mm=100.0, roller_diameter_mm=5.0, eccentricity_mm=1.2),
])
def test_every_roller_is_tangent_to_the_disc_at_every_input_angle(kwargs):
    """The envelope property that defines the disc: with the disc placed at
    input angle phi (centre E(cos phi, sin phi), turned by -phi/(N-1)),
    every one of the N fixed rollers must be exactly tangent to it -- the
    distance from the roller centre to the disc outline equals R_r, so no
    roller penetrates the disc and none has lifted off. A wrong sign in the
    kinematics, the offset direction, the lobe count or the ratio fails this
    at the first angle."""
    dp = CycloidalDriveParams(**kwargs)
    outline = Polygon(disc_profile(dp, n_samples=6000))
    worst = 0.0
    for input_deg in [0.0, 7.0, 45.0, 90.0, 137.0, 180.0, 260.0, 333.0]:
        placed = sh_translate(sh_rotate(outline, dp.disc_rotation_deg(input_deg), origin=(0, 0)),
                              *dp.disc_center(input_deg))
        for (px, py) in dp.pin_centers():
            d = placed.exterior.distance(Point(px, py))
            assert not placed.contains(Point(px, py)), (kwargs, input_deg, "roller centre inside the disc")
            worst = max(worst, abs(d - dp.R_r))
    assert worst < 3e-3, (kwargs, worst)


def test_lobe_count_and_ratio():
    dp = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5)
    pts = disc_profile(dp, n_samples=4000)
    radii = [math.hypot(x, y) for x, y in pts]
    n = len(radii)
    maxima = sum(1 for i in range(n) if radii[i] > radii[i - 1] and radii[i] >= radii[(i + 1) % n])
    assert maxima == dp.lobes
    assert dp.n_pins == 11
    assert dp.ratio == 10.0
    # one full input turn moves the disc back by exactly one lobe pitch
    assert abs(dp.disc_rotation_deg(360.0) + 360.0 / dp.lobes) < 1e-12
    # lobe height is 2E: outermost minus innermost radius of the profile
    assert abs((max(radii) - min(radii)) - 2 * dp.E) < 2e-3


def test_cusp_limit_and_curvature_guard():
    dp = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5)
    assert dp.E < dp.max_eccentricity_mm
    assert min_radius_of_curvature(dp) > dp.R_r          # offset profile stays simple
    assert Polygon(disc_profile(dp)).is_valid
    # right at the cusp limit the base curve has a cusp: the convex-side
    # curvature radius collapses (to ~0.08 mm at the guard's 4000-sample
    # resolution, versus 9.9 mm for the valid disc above)
    cusped = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0,
                                  eccentricity_mm=dp.max_eccentricity_mm)
    assert min_radius_of_curvature(cusped) < 0.2
    assert min_radius_of_curvature(cusped) < 0.05 * min_radius_of_curvature(dp)


def test_output_pins_touch_their_holes_at_exactly_the_eccentricity():
    """The output pins are fixed to a shaft coaxial with the ring and turn
    with the disc's rotation; their holes in the disc are d + 2E wide, so
    at every input angle each pin sits inside its hole with its centre
    exactly E from the hole centre (touching, never binding)."""
    dp = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5,
                              output_pin_count=6, output_pin_diameter_mm=6.0, output_circle_diameter_mm=30.0)
    for input_deg in [0.0, 30.0, 100.0, 215.0, 300.0]:
        th = math.radians(dp.disc_rotation_deg(input_deg))
        cx, cy = dp.disc_center(input_deg)
        holes = [(cx + h[0] * math.cos(th) - h[1] * math.sin(th), cy + h[0] * math.sin(th) + h[1] * math.cos(th))
                 for h in dp.output_hole_centers_disc_frame()]
        for pin, hole in zip(dp.output_pin_centers(input_deg), holes):
            assert abs(math.hypot(pin[0] - hole[0], pin[1] - hole[1]) - dp.E) < 1e-9


def test_disc_solid_is_manifold_and_step_round_trips_with_every_body():
    from build_gear import export_cycloidal_drive_step
    dp = CycloidalDriveParams(lobes=10, pin_circle_diameter_mm=60.0, roller_diameter_mm=6.0, eccentricity_mm=1.5,
                              face_width_mm=8.0, bore_diameter_mm=20.0,
                              output_pin_count=6, output_pin_diameter_mm=6.0, output_circle_diameter_mm=30.0)
    disc = build_disc_solid(dp)
    assert len(disc.solids()) == 1 and disc.solids()[0].is_manifold
    poly = disc_polygon(dp)
    assert poly.is_valid
    assert abs(disc.volume - poly.area * dp.face_width_mm) / disc.volume < 0.01
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "drive.step"
        export_cycloidal_drive_step(dp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 1 + dp.n_pins + dp.output_pin_count


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
