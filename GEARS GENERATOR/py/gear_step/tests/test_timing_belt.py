"""
Automated checks for timing wheels (pulleys) and timing belts
(docs/gear-math.md section 20). Run with:
    python -m pytest gear_step/tests/test_timing_belt.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest
from shapely.affinity import rotate as shapely_rotate
from shapely.geometry import Polygon

from involute import rack_point_to_gear_frame
from timing_belt import (TimingWheelParams, TimingBeltParams, belt_tooth_points, pulley_groove_polygon,
                         full_pulley_polygon, belt_strip_polygon, build_pulley_solid, build_timing_belt_solid)
from meshcheck import interpenetration_volume


def _tp(**kw) -> TimingWheelParams:
    base = dict(z=20, belt_pitch_mm=5.0, face_width_mm=8.0)
    base.update(kw)
    return TimingWheelParams(**base)


def test_pitch_radius_is_the_closed_form_z_p_over_2pi():
    tp = _tp()
    assert abs(tp.pitch_radius - tp.z * tp.belt_pitch_mm / (2.0 * math.pi)) < 1e-12
    assert abs(tp.outside_radius - tp.pitch_radius) < 1e-12   # this module's stated OD == pitch-line simplification
    assert abs(tp.root_radius - (tp.outside_radius - tp._belt().tooth_height)) < 1e-12


def test_belt_tooth_narrows_root_to_tip_so_the_pulley_land_tapers_the_right_way():
    bp = TimingBeltParams(belt_pitch_mm=5.0)
    pts = belt_tooth_points(bp)
    root_w = max(u for u, v in pts if abs(v) < 1e-9) * 2.0
    tip_w = max(u for u, v in pts if abs(v - bp.tooth_height) < 1e-9) * 2.0
    assert tip_w < root_w, (root_w, tip_w)   # narrower at the tip: module docstring's taper argument


@pytest.mark.parametrize("z,pitch", [(20, 5.0), (12, 2.0), (60, 10.0)])
def test_built_pulley_is_one_valid_zfold_symmetric_polygon(z, pitch):
    tp = _tp(z=z, belt_pitch_mm=pitch)
    poly = full_pulley_polygon(tp)
    assert poly.geom_type == "Polygon" and poly.is_valid
    rotated = shapely_rotate(poly, 360.0 / z, origin=(0, 0))
    residual = poly.symmetric_difference(rotated).area
    assert residual < 1e-4 * poly.area, (z, pitch, residual, poly.area)


@pytest.mark.parametrize("z,pitch", [(20, 5.0), (12, 2.0)])
def test_belt_tooth_seats_in_every_groove_and_collides_half_a_pitch_off(z, pitch):
    """The check that matters: a belt tooth wrapped onto the pulley's own
    pitch circle by the SAME generic rolling-without-slip transform every
    involute gear in this project uses (involute.rack_point_to_gear_frame,
    called directly here, not through timing_belt.py's own pulley-building
    wrapper) -- not a stand-in shape -- seats in every groove with zero
    overlap (the built-in running clearance, and no more), and collides
    substantially half a pitch off (squarely on the land)."""
    tp = _tp(z=z, belt_pitch_mm=pitch)
    pts2d = belt_tooth_points(tp._belt(), clearance=0.0)   # the nominal (uncleared) installed tooth
    wrapped = [rack_point_to_gear_frame(0.0, u, v, tp.outside_radius) for u, v in pts2d]
    poly = Polygon(wrapped)
    assert poly.is_valid
    pts3 = [tuple(p) for p in poly.exterior.coords][:-1]
    with bd.BuildPart() as part:
        with bd.BuildSketch() as sk:
            with bd.BuildLine():
                bd.Polyline(*pts3, pts3[0])
            bd.make_face()
        bd.extrude(amount=tp.face_width_mm)
    tooth = part.part

    pulley = build_pulley_solid(tp)
    worst = 0.0
    for k in (0, 1, z // 2):
        placed = tooth.rotate(bd.Axis.Z, k * 360.0 / z)
        worst = max(worst, interpenetration_volume(pulley, placed))
    bad = interpenetration_volume(pulley, tooth.rotate(bd.Axis.Z, 0.5 * 360.0 / z))
    assert worst < 1e-6 * tooth.volume, (z, pitch, worst, tooth.volume)
    assert bad > 0.5 * tooth.volume, (z, pitch, bad, tooth.volume)


def test_belt_strip_is_one_valid_manifold_solid_of_the_right_length():
    bp = TimingBeltParams(belt_pitch_mm=5.0, n_teeth=8, belt_width_mm=8.0)
    belt = build_timing_belt_solid(bp)
    sol = belt.solids()
    assert len(sol) == 1 and sol[0].is_manifold and belt.is_valid
    bb = belt.bounding_box()
    assert abs((bb.max.X - bb.min.X) - bp.n_teeth * bp.belt_pitch_mm) < 1e-6


def test_solids_build_and_round_trip_as_step():
    from build_gear import export_timing_wheel_step, export_timing_belt_step
    tp = _tp(bore_diameter_mm=6.0)
    bp = TimingBeltParams(belt_pitch_mm=5.0, n_teeth=8, belt_width_mm=8.0)
    with tempfile.TemporaryDirectory() as d:
        p1 = Path(d) / "pulley.step"
        export_timing_wheel_step(tp, p1)
        imported = bd.import_step(str(p1))
        assert len(imported.solids()) == 1

        p2 = Path(d) / "belt.step"
        export_timing_belt_step(bp, p2)
        imported2 = bd.import_step(str(p2))
        assert len(imported2.solids()) == 1


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
