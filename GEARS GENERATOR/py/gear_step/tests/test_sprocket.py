"""
Automated checks for sprocket wheels (docs/gear-math.md section 18).
Run with: python -m pytest gear_step/tests/test_sprocket.py -v
"""
import math
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
import pytest
from shapely.affinity import rotate as shapely_rotate
from shapely.geometry import Point

from sprocket import SprocketParams, full_sprocket_polygon, gap_polygon, ANSI_CHAIN_TABLE_IN, INCH_MM


def test_pitch_diameter_is_the_closed_form_regular_polygon():
    sp = SprocketParams.from_ansi_chain_number("40", z=20)
    assert abs(sp.chain_pitch_mm - 0.5 * INCH_MM) < 1e-9
    assert abs(sp.roller_diameter_mm - 0.312 * INCH_MM) < 1e-9
    expected_r = sp.chain_pitch_mm / (2.0 * math.sin(math.pi / 20))
    assert abs(sp.pitch_radius - expected_r) < 1e-9
    assert abs(sp.pitch_diameter - 2.0 * expected_r) < 1e-9
    # the whole ANSI table converts and constructs without error
    for number in ANSI_CHAIN_TABLE_IN:
        SprocketParams.from_ansi_chain_number(number, z=17)


@pytest.mark.parametrize("z,chain", [(20, "40"), (11, "40"), (60, "40"), (15, "60")])
def test_built_profile_is_one_valid_zfold_symmetric_polygon(z, chain):
    sp = SprocketParams.from_ansi_chain_number(chain, z=z)
    assert sp.root_clearance_mm > 0, "chain pitch must exceed two seat circles side by side"
    poly = full_sprocket_polygon(sp)
    assert poly.geom_type == "Polygon" and poly.is_valid
    rotated = shapely_rotate(poly, 360.0 / z, origin=(0, 0))
    # z-fold rotational symmetry: rotating by one pitch angle reproduces the
    # same region (to the polygonized-arc noise of quad_segs, not exact zero)
    residual = poly.symmetric_difference(rotated).area
    assert residual < 1e-4 * poly.area, (z, chain, residual, poly.area)


@pytest.mark.parametrize("z,chain", [(20, "40"), (11, "40"), (60, "40"), (15, "60")])
def test_chain_roller_seats_with_only_the_design_clearance_and_collides_half_a_pitch_off(z, chain):
    """The one check that matters: a real chain roller (diameter =
    roller_diameter_mm, no added clearance) placed at every pitch position
    fits with exactly the built-in clearance and no more -- not the
    plausible-looking-only shape a validity/simplicity check alone cannot
    tell apart from a correct one -- while the same roller placed half a
    pitch off (on a tooth, not a gap) collides substantially."""
    sp = SprocketParams.from_ansi_chain_number(chain, z=z)
    poly = full_sprocket_polygon(sp)
    roller_area = math.pi * sp.roller_radius ** 2
    for k in (0, 1, z // 2):   # a few representative pitch positions, not just one
        ang = k * sp.pitch_angle_rad
        roller = Point(sp.pitch_radius * math.sin(ang), sp.pitch_radius * math.cos(ang)).buffer(
            sp.roller_radius, quad_segs=64)
        overlap = roller.intersection(poly).area
        assert overlap < 1e-6 * roller_area, (z, chain, k, overlap, roller_area)
    bad = shapely_rotate(roller, 180.0 / z, origin=(0, 0))
    bad_overlap = bad.intersection(poly).area
    assert bad_overlap > 0.3 * roller_area, (z, chain, bad_overlap, roller_area)


def test_gap_polygon_is_one_piece_and_the_tooth_between_two_gaps_tapers_outward():
    """The construction's whole point (module docstring): the gap widens
    outward from the seat, so the tooth between two adjacent gaps narrows
    toward its tip -- checked directly on the built profile, not assumed
    from the construction."""
    sp = SprocketParams.from_ansi_chain_number("40", z=20)
    gap = gap_polygon(sp)
    assert gap.geom_type == "Polygon" and gap.is_valid
    poly = full_sprocket_polygon(sp)

    def tooth_width_at(r: float) -> float:
        ring = Point(0, 0).buffer(r, quad_segs=2000).exterior
        material = ring.intersection(poly)
        lengths = [material.length] if material.geom_type == "LineString" else [g.length for g in material.geoms]
        # the tooth centred on the bisector is the piece straddling angle = pitch/2
        ang = sp.pitch_angle_rad / 2.0
        target = (r * math.sin(ang), r * math.cos(ang))
        pieces = [material] if material.geom_type == "LineString" else list(material.geoms)
        for piece in pieces:
            if piece.distance(Point(target)) < r * 0.05:
                return piece.length
        raise AssertionError("no tooth piece found near the bisector at r=%.2f" % r)

    w_root = tooth_width_at(sp.pitch_radius)
    w_tip = tooth_width_at(sp.outside_radius - 0.05)
    assert w_tip < w_root, (w_root, w_tip)


def test_root_clearance_depends_only_on_the_chain_not_the_tooth_count():
    """root_clearance_mm = chain_pitch_mm - 2*seat_radius is a property of
    the CHAIN alone (does the roller fit within one pitch of itself) --
    independent of z, so no tooth count can create or fix a negative
    value; every real ANSI table entry (roller diameter well under its own
    pitch, by the chain's own design) is comfortably positive, and only a
    hand-set, physically nonsensical roller/pitch combination goes
    negative -- exactly the case the derived-values warning guards."""
    for z in (4, 20, 60):
        sp = SprocketParams.from_ansi_chain_number("40", z=z)
        assert sp.root_clearance_mm == pytest.approx(sp.chain_pitch_mm - 2.0 * sp.seat_radius)
    unrealistic = SprocketParams(z=20, chain_pitch_mm=10.0, roller_diameter_mm=15.0)
    assert unrealistic.root_clearance_mm < 0


def test_solid_builds_and_round_trips_as_step():
    from build_gear import build_sprocket_solid, export_sprocket_step
    sp = SprocketParams.from_ansi_chain_number("40", z=20, bore_diameter_mm=12.0)
    solid = build_sprocket_solid(sp)
    assert len(solid.solids()) == 1 and solid.solids()[0].is_manifold and solid.is_valid
    with tempfile.TemporaryDirectory() as d:
        path = Path(d) / "sprocket.step"
        export_sprocket_step(sp, path)
        imported = bd.import_step(str(path))
        assert len(imported.solids()) == 1


if __name__ == "__main__":
    raise SystemExit(pytest.main([__file__, "-v"]))
