"""
Automated version of docs/gear-math.md section 7's cross-checks.
Run with: python -m pytest gear_step/tests/test_involute.py -v
"""
import math
import sys
from pathlib import Path

from shapely.geometry import Polygon

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from involute import (
    GearParams, involute_point, involute_t_at_radius,
    rack_swept_cutter_union, full_gear_polygon, full_gear_outline,
    single_tooth_polygon,
)


def _single_gap_boundary(gp: GearParams) -> list[tuple[float, float]]:
    """Blank disk with just ONE gap cut (centered on +Y) — the same shape
    validated visually against the closed-form involute during development.
    Isolating one gap avoids any ambiguity about which tooth/gap a boundary
    point near angle 0 belongs to."""
    ra = gp.addendum_radius
    blank = Polygon([
        (ra * math.sin(2 * math.pi * i / 720), ra * math.cos(2 * math.pi * i / 720))
        for i in range(720)
    ])
    one_gap = rack_swept_cutter_union(gp, n_phi=300, phi_margin=1.3)
    remaining = blank.difference(one_gap)
    return list(remaining.exterior.coords)


def test_undercut_cutoff_matches_classical_formula():
    alpha = math.radians(20)
    z_min = 2 / math.sin(alpha) ** 2
    assert 16.9 < z_min < 17.2  # classical result: 17 teeth at 20 deg, x=0


def test_rack_sweep_matches_closed_form_involute_on_the_flank():
    """The right-hand wall of a single rack-cut gap must have the same SHAPE
    as the closed-form involute of the base circle (radius vs. arc angle),
    for radii between the base and addendum circles (well above any undercut
    region). The rack-cut flank's absolute angular position also depends on
    tooth thickness (a rigid rotation offset), so we fit that one offset from
    a single reference radius and require every other radius to then agree
    tightly -- that isolates "is this curve an involute" from "exactly where
    is the tooth centered"."""
    gp = GearParams.from_metric(z=20, module_mm=2.0)
    rb = gp.base_radius
    ra = gp.addendum_radius
    coords = [p for p in _single_gap_boundary(gp) if p[0] > 0]

    def boundary_angle_at_radius(radius, search_tol=0.1):
        candidates = [p for p in coords if abs(math.hypot(*p) - radius) < search_tol]
        assert candidates, f"no boundary points found near radius {radius}"
        p = min(candidates, key=lambda q: abs(math.hypot(*q) - radius))
        return math.atan2(p[0], p[1])

    ref_radius = rb + 0.15 * (ra - rb)
    t_ref = involute_t_at_radius(rb, ref_radius)
    ix_ref, iy_ref = involute_point(rb, t_ref)
    offset = boundary_angle_at_radius(ref_radius) - math.atan2(ix_ref, iy_ref)

    for frac in (0.15, 0.5, 0.85):
        radius = rb + frac * (ra - rb)
        t = involute_t_at_radius(rb, radius)
        ix, iy = involute_point(rb, t)
        involute_angle = math.atan2(ix, iy) + offset
        boundary_angle = boundary_angle_at_radius(radius)
        err_deg = math.degrees(abs(involute_angle - boundary_angle))
        assert err_deg < 0.05, f"radius={radius}: involute_angle={math.degrees(involute_angle):.4f}deg boundary_angle={math.degrees(boundary_angle):.4f}deg err={err_deg:.4f}deg"


def test_no_undercut_for_z20_alpha20():
    """z=20 at 20deg, x=0 is comfortably above the z_min~=17 cutoff: the right
    wall of a gap must not pinch inward (non-monotonic in x vs radius) near
    the base circle."""
    gp = GearParams.from_metric(z=20, module_mm=2.0)
    rb = gp.base_radius
    coords = [p for p in _single_gap_boundary(gp) if p[0] > 0]
    near_base = sorted(
        (p for p in coords if rb * 0.97 < math.hypot(*p) < rb * 1.15),
        key=lambda p: math.hypot(*p),
    )
    assert len(near_base) > 3
    xs = [p[0] for p in near_base]
    assert xs == sorted(xs), "flank should not pinch inward near the base circle (no undercut expected)"


def test_undercut_present_for_z8_alpha20():
    """z=8 at 20deg, x=0 is well below the z_min~=17 cutoff: classic undercut,
    the gap wall must visibly pinch inward below the base circle."""
    gp = GearParams.from_metric(z=8, module_mm=2.0)
    rb = gp.base_radius
    coords = [p for p in _single_gap_boundary(gp) if p[0] > 0.05]
    pts = sorted(coords, key=lambda p: math.hypot(*p))
    xs = [p[0] for p in pts]
    assert xs != sorted(xs), "expected a non-monotonic (pinched/undercut) flank for z=8"


def test_tooth_thickness_at_pitch_circle():
    gp = GearParams.from_metric(z=24, module_mm=3.0)
    r = gp.pitch_radius
    pitch_ang_deg = 360.0 / gp.z
    # Use the unsimplified outline so the pitch-radius crossing is found by
    # exact linear interpolation between consecutive (densely sampled) points,
    # not affected by which points Douglas-Peucker simplification happened to
    # keep.
    coords = full_gear_outline(gp, simplify_tolerance_mm=0)
    right_flank = [
        p for p in coords
        if p[0] > 0 and 0 < math.degrees(math.atan2(p[0], p[1])) < pitch_ang_deg / 2
    ]
    right_flank.sort(key=lambda p: math.hypot(*p))
    radii = [math.hypot(*p) for p in right_flank]
    assert radii[0] < r < radii[-1], "pitch circle not spanned by tooth 0's right flank"
    # linear interpolation across the bracketing segment
    i = next(k for k in range(len(radii) - 1) if radii[k] <= r <= radii[k + 1])
    (x0, y0), (x1, y1) = right_flank[i], right_flank[i + 1]
    r0, r1 = radii[i], radii[i + 1]
    frac = (r - r0) / (r1 - r0) if r1 != r0 else 0.0
    x_at_pitch = x0 + frac * (x1 - x0)
    measured_thickness = 2 * x_at_pitch
    assert abs(measured_thickness - gp.circular_tooth_thickness) < 0.02


def test_metric_and_inch_inputs_agree():
    gp_metric = GearParams.from_metric(z=20, module_mm=2.0)
    gp_inch = GearParams.from_inch(z=20, diametral_pitch=25.4 / 2.0)
    assert abs(gp_metric.module_mm - gp_inch.module_mm) < 1e-9
    assert gp_metric.pitch_radius == gp_inch.pitch_radius
    assert gp_metric.addendum_radius == gp_inch.addendum_radius
    assert gp_metric.dedendum_radius == gp_inch.dedendum_radius


def test_full_gear_polygon_is_valid_and_has_z_teeth_worth_of_area():
    """Sanity check on the actual production path: valid simple polygon, area
    plausible for the given tooth count (roughly pi*(ra^2+rf^2)/2, a loose
    bound since exact tooth shape varies)."""
    gp = GearParams.from_metric(z=20, module_mm=2.0)
    poly = full_gear_polygon(gp, n_phi=200)
    assert poly.geom_type == "Polygon"
    assert poly.is_valid
    ra, rf = gp.addendum_radius, gp.dedendum_radius
    lower_bound = math.pi * rf * rf * 0.9
    upper_bound = math.pi * ra * ra
    assert lower_bound < poly.area < upper_bound


def test_spur_and_helical_solids_are_manifold_single_bodies():
    """Same class of check the bevel gear bug (docs/gear-math.md 8.3) was
    found by, applied here so a similar defect in spur/helical wouldn't
    likewise hide behind polygon-level tests that never build or measure the
    actual 3D solid. Checked across several z/module/bore/helix/hand
    combinations, since the bevel bugs were parameter-dependent -- a single
    passing case wouldn't have been convincing."""
    from build_gear import build_gear_solid

    cases = [
        dict(z=20, module_mm=2.0, face_width_mm=10.0),
        dict(z=12, module_mm=3.0, face_width_mm=8.0, bore_diameter_mm=6.0),
        dict(z=8, module_mm=1.5, face_width_mm=5.0),  # small, undercut-prone
        dict(z=18, module_mm=2.5, face_width_mm=16.0, bore_diameter_mm=8.0,
             helix_angle_deg=25.0, hand="right"),
        dict(z=20, module_mm=2.0, face_width_mm=20.0, helix_angle_deg=35.0, hand="left"),
    ]
    for kwargs in cases:
        gp = GearParams(**kwargs)
        solid = build_gear_solid(gp)
        bodies = solid.solids()
        assert len(bodies) == 1, kwargs
        assert bodies[0].is_manifold, kwargs
        assert solid.volume > 0


def test_single_tooth_polygon_tip_lands_exactly_on_the_addendum_circle():
    """Regression test: single_tooth_polygon's blank used to be sized
    ra*1.05 (a leftover mix-up with the UNRELATED rack_swept_cutter_union
    phi_margin concept) instead of exactly ra like full_gear_polygon's own
    blank -- since nothing then trimmed the tip back down, every tooth's
    addendum land was capped by that oversized blank edge instead of the
    true addendum circle, 5% too tall (and, since involute flanks narrow
    going outward, visibly more pointed than the correct flat tip). Caught
    by comparing this function's tip radius directly against
    GearParams.addendum_radius -- bevel gears (the only current caller)
    only ever exercise this indirectly through a cone-wrapped tooth, where
    the error was much harder to spot by eye."""
    gp = GearParams(z=20, module_mm=4.0, pressure_angle_deg=20.0)
    tooth = single_tooth_polygon(gp, z_virtual=20, n_phi=240)
    tip_radius = max(math.hypot(x, y) for x, y in tooth.exterior.coords)
    assert abs(tip_radius - gp.addendum_radius) < 1e-6

    # also check the non-integer z_virtual case bevel gears actually use
    # (z/cos(gamma) is generally not a whole number -- docs/gear-math.md
    # section 8.1) -- addendum_radius must be computed the same way
    gp_v = GearParams(z=20, module_mm=4.0, pressure_angle_deg=20.0)
    z_virtual = 22.360679774997898  # 20/cos(26.565deg), a real bevel case
    import dataclasses
    expected_ra = dataclasses.replace(gp_v, z=z_virtual).addendum_radius
    tooth_v = single_tooth_polygon(gp_v, z_virtual=z_virtual, n_phi=240)
    tip_radius_v = max(math.hypot(x, y) for x, y in tooth_v.exterior.coords)
    assert abs(tip_radius_v - expected_ra) < 1e-6


def test_zero_helix_angle_matches_spur_exactly():
    """A helical gear with helix_angle_deg=0 must be numerically identical to
    the plain spur gear (docs/gear-math.md section 7.1's beta=0 reduction)."""
    spur = GearParams.from_metric(z=20, module_mm=2.0)
    helical_zero = GearParams.from_metric(z=20, module_mm=2.0, helix_angle_deg=0.0)
    assert spur.pitch_radius == helical_zero.pitch_radius
    assert spur.base_radius == helical_zero.base_radius
    assert spur.circular_tooth_thickness == helical_zero.circular_tooth_thickness
    assert spur.addendum_radius == helical_zero.addendum_radius
    assert spur.dedendum_radius == helical_zero.dedendum_radius
    assert helical_zero.twist_total_rad == 0.0


def test_transverse_module_and_pressure_angle():
    """Cross-check the normal/transverse conversion (docs/gear-math.md 7.1)
    against independently computed values for a known helix angle."""
    gp = GearParams.from_metric(z=20, module_mm=2.0, pressure_angle_deg=20.0, helix_angle_deg=15.0)
    beta = math.radians(15.0)
    expected_mt = 2.0 / math.cos(beta)
    expected_alpha_t = math.atan(math.tan(math.radians(20.0)) / math.cos(beta))
    assert abs(gp.transverse_module_mm - expected_mt) < 1e-12
    assert abs(gp.transverse_pressure_angle_rad - expected_alpha_t) < 1e-12
    # transverse module widens the pitch circle vs. a same-z spur gear
    spur_equivalent = GearParams.from_metric(z=20, module_mm=2.0)
    assert gp.pitch_radius > spur_equivalent.pitch_radius
    # tooth height (normal-module-based) is UNCHANGED by helix angle
    assert abs((gp.addendum_radius - gp.pitch_radius) - (spur_equivalent.addendum_radius - spur_equivalent.pitch_radius)) < 1e-9


def test_helical_transverse_profile_is_a_valid_involute_gear():
    """The helical gear's transverse cross-section (what full_gear_polygon
    computes -- see docs/gear-math.md 7.2) must itself pass the same sanity
    checks as a spur gear: valid polygon, no crash, right area ballpark."""
    gp = GearParams.from_metric(z=20, module_mm=2.0, helix_angle_deg=20.0, hand="right")
    poly = full_gear_polygon(gp, n_phi=150)
    assert poly.geom_type == "Polygon"
    assert poly.is_valid
    ra, rf = gp.addendum_radius, gp.dedendum_radius
    assert math.pi * rf * rf * 0.9 < poly.area < math.pi * ra * ra


def test_twist_total_sign_and_hand():
    gp_right = GearParams.from_metric(z=20, module_mm=2.0, helix_angle_deg=20.0,
                                       face_width_mm=15.0, hand="right")
    gp_left = GearParams.from_metric(z=20, module_mm=2.0, helix_angle_deg=20.0,
                                      face_width_mm=15.0, hand="left")
    assert gp_right.twist_total_rad > 0
    assert gp_left.twist_total_rad < 0
    assert abs(gp_right.twist_total_rad) == abs(gp_left.twist_total_rad)
    # known formula, computed independently
    expected = 15.0 * math.tan(math.radians(20.0)) / gp_right.pitch_radius
    assert abs(gp_right.twist_total_rad - expected) < 1e-12


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))
