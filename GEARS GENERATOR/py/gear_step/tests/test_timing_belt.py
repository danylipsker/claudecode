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
from shapely.affinity import rotate as shapely_rotate, translate as shapely_translate
from shapely.geometry import Point, Polygon, box

from involute import rack_point_to_gear_frame
from timing_belt import (TIMING_BELT_STANDARDS, TimingWheelParams, TimingBeltParams, belt_tooth_points,
                         pulley_groove_polygon, full_pulley_polygon, belt_strip_polygon,
                         build_pulley_solid, build_timing_belt_solid)
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
    assert bp.tooth_tip_width < bp.tooth_root_width   # narrower at the tip: module docstring's taper argument
    tooth = Polygon(belt_tooth_points(bp))
    assert tooth.bounds[3] - tooth.bounds[1] == pytest.approx(bp.tooth_height)   # the fillet keeps the full height


# ---- standard sizes and the filleted profile (docs/gear-math.md 20.2) ----

def test_the_standard_table_names_the_expected_series_and_pitches():
    assert TIMING_BELT_STANDARDS["GT2"]["pitch_mm"] == 2.0 and TIMING_BELT_STANDARDS["GT2"]["curvilinear"]
    assert TIMING_BELT_STANDARDS["XL"]["pitch_mm"] == pytest.approx(5.08)      # 1/5 in
    assert TIMING_BELT_STANDARDS["H"]["pitch_mm"] == pytest.approx(12.7)       # 1/2 in
    assert TIMING_BELT_STANDARDS["T5"]["pitch_mm"] == 5.0 and not TIMING_BELT_STANDARDS["T5"]["curvilinear"]
    assert TIMING_BELT_STANDARDS["HTD 8M"]["pitch_mm"] == 8.0 and TIMING_BELT_STANDARDS["HTD 8M"]["curvilinear"]


@pytest.mark.parametrize("name", list(TIMING_BELT_STANDARDS))
def test_every_standard_size_builds_a_valid_symmetric_pulley_and_a_valid_belt(name):
    tp = TimingWheelParams.from_standard(name, z=20)
    assert tp.belt_pitch_mm == TIMING_BELT_STANDARDS[name]["pitch_mm"]
    poly = full_pulley_polygon(tp)
    assert poly.geom_type == "Polygon" and poly.is_valid, name
    residual = poly.symmetric_difference(shapely_rotate(poly, 360.0 / tp.z, origin=(0, 0))).area
    assert residual < 1e-4 * poly.area, (name, residual, poly.area)
    bp = TimingBeltParams.from_standard(name, n_teeth=6)
    strip = belt_strip_polygon(bp)
    assert strip.geom_type == "Polygon" and strip.is_valid, name
    # ... and it has ALL its teeth, each EXACTLY the nominal tooth. Validity
    # and length alone passed on two wrong belts (docs/gear-math.md 20.2):
    # the first strip builder's mis-ordered corners made sawtooth-shaped
    # "teeth" (a valid polygon, 3 % too much area), and six standards later
    # lost every tooth to a 3e-17 gap (a valid polygon of the right length).
    tooth = Polygon(belt_tooth_points(bp))
    backing_area = bp.n_teeth * bp.belt_pitch_mm * bp.belt_thickness
    assert strip.area == pytest.approx(backing_area + bp.n_teeth * tooth.area, rel=1e-9), name
    assert strip.bounds[3] == pytest.approx(bp.tooth_height), name
    half_len = bp.n_teeth * bp.belt_pitch_mm / 2.0
    for k in range(bp.n_teeth):
        cx = -half_len + (k + 0.5) * bp.belt_pitch_mm
        window = box(cx - bp.belt_pitch_mm / 2.0, 0.0, cx + bp.belt_pitch_mm / 2.0, bp.tooth_height + 1.0)
        cut = strip.intersection(window).buffer(0)          # buffer(0) drops the zero-area contact line
        assert cut.symmetric_difference(shapely_translate(tooth, cx, 0.0)).area < 1e-6, (name, k)


def test_curvilinear_profiles_are_more_rounded_than_trapezoidal_ones():
    gt2 = TimingBeltParams.from_standard("GT2")
    t5 = TimingBeltParams.from_standard("T5")
    assert gt2.curvilinear and not t5.curvilinear
    assert gt2.fillet_radius / gt2.tooth_height > t5.fillet_radius / t5.tooth_height
    # a rounded tooth loses more of the sharp trapezoid's corner area than a flat-sided one
    sharp_gt2 = Polygon([(gt2.tooth_root_width / 2, 0.0), (gt2.tooth_tip_width / 2, gt2.tooth_height),
                         (-gt2.tooth_tip_width / 2, gt2.tooth_height), (-gt2.tooth_root_width / 2, 0.0)])
    sharp_t5 = Polygon([(t5.tooth_root_width / 2, 0.0), (t5.tooth_tip_width / 2, t5.tooth_height),
                        (-t5.tooth_tip_width / 2, t5.tooth_height), (-t5.tooth_root_width / 2, 0.0)])
    loss_gt2 = 1.0 - Polygon(belt_tooth_points(gt2)).area / sharp_gt2.area
    loss_t5 = 1.0 - Polygon(belt_tooth_points(t5)).area / sharp_t5.area
    assert loss_gt2 > loss_t5 > 0.0, (loss_gt2, loss_t5)


def test_fillet_only_trims_the_corners_and_leaves_the_flanks_where_they_were():
    """The erode-then-dilate rounding must not move the straight parts of
    the tooth -- a fillet that shifted a flank would change the tooth's
    width, i.e. its fit in the groove. Checked at mid-height on both
    flanks and at the middle of the root and tip lines: those points of
    the sharp trapezoid must still lie ON the rounded boundary."""
    bp = TimingBeltParams.from_standard("HTD 8M")   # the most heavily rounded default
    h, wr, wt = bp.tooth_height, bp.tooth_root_width / 2, bp.tooth_tip_width / 2
    rounded = Polygon(belt_tooth_points(bp))
    sharp = Polygon([(wr, 0.0), (wt, h), (-wt, h), (-wr, 0.0)])
    assert rounded.difference(sharp).area < 1e-9                # never outside the sharp tooth
    assert 1.0 - rounded.area / sharp.area < 0.10                # and loses only the corners
    for probe in (Point((wr + wt) / 2, h / 2), Point(-(wr + wt) / 2, h / 2), Point(0.0, 0.0), Point(0.0, h)):
        assert rounded.exterior.distance(probe) < 1e-6, probe    # flank/root/tip midpoints untouched


def test_groove_is_the_nominal_tooth_offset_uniformly_by_the_clearance():
    """The fix docs/gear-math.md 20.2 records: the pulley groove is the
    NOMINAL (already-rounded) tooth pushed out by exactly the clearance
    everywhere, not a re-rounding of a wider sharp trapezoid -- the two
    disagreed at the rounded corners, and a seated nominal tooth showed a
    real, if small, overlap there."""
    tp = TimingWheelParams.from_standard("GT2", z=20, clearance_mm=0.12)
    nominal = Polygon(belt_tooth_points(tp._belt(), clearance=0.0))
    groove = Polygon(belt_tooth_points(tp._belt(), clearance=tp.clearance_mm))
    assert nominal.difference(groove).area < 1e-12               # nominal fully inside the groove
    # every point of the nominal boundary is the clearance away from the groove boundary
    ds = [groove.exterior.distance(Point(p)) for p in nominal.exterior.coords]
    assert min(ds) > 0.99 * tp.clearance_mm and max(ds) < 1.01 * tp.clearance_mm, (min(ds), max(ds))


@pytest.mark.parametrize("name,z", [("T5", 20), ("GT2", 20), ("HTD 8M", 16), ("XL", 12)])
def test_belt_tooth_seats_in_every_groove_and_collides_half_a_pitch_off(name, z):
    """The check that matters: a belt tooth wrapped onto the pulley's own
    pitch circle by the SAME generic rolling-without-slip transform every
    involute gear in this project uses (involute.rack_point_to_gear_frame,
    called directly here, not through timing_belt.py's own pulley-building
    wrapper) -- not a stand-in shape -- seats in every groove with zero
    overlap (the built-in running clearance, and no more), and collides
    substantially half a pitch off (squarely on the land). Runs on the
    filleted standard profiles, trapezoidal and curvilinear."""
    tp = TimingWheelParams.from_standard(name, z=z, face_width_mm=8.0)
    pts2d = belt_tooth_points(tp._belt(), clearance=0.0)   # the nominal (uncleared) installed tooth
    wrapped = [rack_point_to_gear_frame(0.0, u, v, tp.outside_radius) for u, v in pts2d]
    poly = Polygon(wrapped)
    assert poly.is_valid
    pts3 = [tuple(p) for p in poly.exterior.coords][:-1]
    with bd.BuildPart() as part:
        with bd.BuildSketch():
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
    assert worst < 1e-6 * tooth.volume, (name, z, worst, tooth.volume)
    assert bad > 0.5 * tooth.volume, (name, z, bad, tooth.volume)


def test_pulley_solid_actually_has_its_bore():
    """The first version built the solid from the outline's exterior ring
    only, so the bore never left shapely: a solid disc for any bore, and
    valid/manifold/STEP round-trip all passed on it. Ask the solid directly."""
    tp = TimingWheelParams.from_standard("T5", z=20, face_width_mm=8.0, bore_diameter_mm=6.0)
    pulley = build_pulley_solid(tp)
    z_mid = tp.face_width_mm / 2.0
    assert not pulley.is_inside(bd.Vector(0.0, 0.0, z_mid))                                  # nothing on the axis
    assert pulley.is_inside(bd.Vector(0.0, 0.5 * (tp.bore_diameter_mm / 2.0 + tp.root_radius), z_mid))  # rim is there
    solid_disc = build_pulley_solid(TimingWheelParams.from_standard("T5", z=20, face_width_mm=8.0))
    assert solid_disc.volume - pulley.volume == pytest.approx(math.pi * 3.0 ** 2 * 8.0, rel=1e-3)


def test_belt_strip_is_one_valid_manifold_solid_of_the_right_length():
    bp = TimingBeltParams.from_standard("HTD 5M", n_teeth=8, belt_width_mm=8.0)
    belt = build_timing_belt_solid(bp)
    sol = belt.solids()
    assert len(sol) == 1 and sol[0].is_manifold and belt.is_valid
    bb = belt.bounding_box()
    assert abs((bb.max.X - bb.min.X) - bp.n_teeth * bp.belt_pitch_mm) < 1e-6


def test_solids_build_and_round_trip_as_step():
    from build_gear import export_timing_wheel_step, export_timing_belt_step
    tp = TimingWheelParams.from_standard("GT2", z=20, bore_diameter_mm=5.0)
    bp = TimingBeltParams.from_standard("GT2", n_teeth=8, belt_width_mm=6.0)
    with tempfile.TemporaryDirectory() as d:
        p1 = Path(d) / "pulley.step"
        export_timing_wheel_step(tp, p1)
        assert len(bd.import_step(str(p1)).solids()) == 1
        p2 = Path(d) / "belt.step"
        export_timing_belt_step(bp, p2)
        assert len(bd.import_step(str(p2)).solids()) == 1


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
