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
import numpy as np
import pytest
from shapely.affinity import rotate as shapely_rotate, translate as shapely_translate
from shapely.geometry import LineString, Point, Polygon, box

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


def _sharp(bp):
    h, wr, wt = bp.tooth_height, bp.tooth_root_width / 2, bp.tooth_tip_width / 2
    return Polygon([(wr, 0.0), (wt, h), (-wt, h), (-wr, 0.0)])


def _width(poly, v):
    return poly.intersection(LineString([(-50.0, v), (50.0, v)])).length


@pytest.mark.parametrize("name", ["T5", "GT2", "HTD 8M", "XL"])
def test_fillets_have_the_right_sense_tip_removes_root_adds(name):
    """The user's catch ("opposite to logic"): the first profile opened the
    bare trapezoid, rounding its BASE corners too, so the tooth necked
    inward just before the body.  The right senses: the tip fillet is
    convex and removes material (the tooth narrows at the very tip), the
    root fillet is concave and ADDS material (the tooth flares into the
    body); between the two fillet zones the flanks are exactly the sharp
    trapezoid's."""
    bp = TimingBeltParams.from_standard(name)
    h, r_tip, r_root = bp.tooth_height, bp.tip_fillet, bp.root_fillet
    prof, sharp = Polygon(belt_tooth_points(bp)), _sharp(bp)
    # material the fillets ADD lies only in the root zone; material they REMOVE only in the tip zone
    # (by AREA per zone: where the two flanks coincide exactly, shapely's difference keeps a
    # zero-area appendix along them, which fooled a bounds check -- the flanks measure 0.000 um off)
    added, removed = prof.difference(sharp), sharp.difference(prof)
    root_zone, tip_zone = box(-50, -1, 50, r_root + 0.02), box(-50, h - r_tip - 0.02, 50, h + 1)
    assert added.intersection(root_zone).area > 1e-4 and added.difference(root_zone).area < 1e-9, name
    assert removed.intersection(tip_zone).area > 1e-4 and removed.difference(tip_zone).area < 1e-9, name
    # widths: flared at the base, narrower at the tip, the sharp trapezoid's in between
    assert _width(prof, 1e-6) > bp.tooth_root_width and _width(prof, h - 1e-6) < bp.tooth_tip_width
    for v in np.linspace(r_root + 0.02, h - r_tip - 0.02, 5):
        assert abs(_width(prof, v) - _width(sharp, v)) < 1e-6, (name, v)
    # and the base never necks: the width is non-increasing from the body to the tip
    ws = [_width(prof, v) for v in np.linspace(1e-6, h - 1e-6, 40)]
    assert all(b <= a + 1e-9 for a, b in zip(ws, ws[1:])), name


def test_curvilinear_profiles_are_more_rounded_than_trapezoidal_ones():
    gt2, t5 = TimingBeltParams.from_standard("GT2"), TimingBeltParams.from_standard("T5")
    assert gt2.curvilinear and not t5.curvilinear
    assert gt2.tip_fillet / gt2.tooth_height > t5.tip_fillet / t5.tooth_height
    # a rounded tooth loses more of the sharp trapezoid at the tip and gains more at the root
    def tip_loss_and_root_gain(bp):
        prof, sharp, h = Polygon(belt_tooth_points(bp)), _sharp(bp), bp.tooth_height
        upper, lower = box(-50, h / 2, 50, h + 1), box(-50, -1, 50, h / 2)
        loss = 1.0 - prof.intersection(upper).area / sharp.intersection(upper).area
        gain = prof.intersection(lower).area / sharp.intersection(lower).area - 1.0
        return loss, gain
    loss_gt2, gain_gt2 = tip_loss_and_root_gain(gt2)
    loss_t5, gain_t5 = tip_loss_and_root_gain(t5)
    assert loss_gt2 > loss_t5 > 0.0 and gain_gt2 > gain_t5 > 0.0, (loss_gt2, loss_t5, gain_gt2, gain_t5)


@pytest.mark.parametrize("name", ["T5", "GT2"])
def test_pulley_groove_is_widest_at_its_mouth_and_the_land_tips_are_rounded(name):
    """The wheel's side of the same catch: with the belt's root flare in the
    groove shape, the groove must be widest at the OD and narrow
    monotonically toward its bottom -- so the land between two grooves has
    rounded tips, not overhanging corners (the first version measured a
    mouth 0.4 degrees narrower than the groove just below it)."""
    tp = TimingWheelParams.from_standard(name, z=20)
    poly, R, h = full_pulley_polygon(tp), tp.outside_radius, tp._belt().tooth_height
    def groove_deg(r):
        ring = Point(0, 0).buffer(r, quad_segs=1440).exterior
        gaps = ring.difference(poly)
        pieces = list(gaps.geoms) if hasattr(gaps, "geoms") else [gaps]
        top = min(pieces, key=lambda g: abs(math.atan2(g.centroid.y, g.centroid.x) - math.pi / 2))   # groove 0 is centred on +Y
        return math.degrees(top.length / r)
    depths = [1e-4, 0.05, 0.1, 0.2, 0.3, 0.5 * h, 0.8 * h]
    ws = [groove_deg(R - d) for d in depths]
    assert all(b <= a + 1e-6 for a, b in zip(ws, ws[1:])), (name, list(zip(depths, ws)))
    assert ws[0] > ws[3] + 0.05                                  # a real flare at the mouth, not just monotone



if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
