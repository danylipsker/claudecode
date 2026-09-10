"""
Automated checks for worm gears (docs/gear-math.md section 9).
Run with: python -m pytest gear_step/tests/test_worm.py -v
"""
import math
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import build123d as bd
from worm import WormParams, thread_axial_profile, worm_thread_stations, build_worm_solid


def test_lead_and_lead_angle_formulas():
    wp = WormParams(starts=2, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0)
    expected_lead = 2 * math.pi * 2.0  # starts * axial_pitch = starts * pi * m
    assert abs(wp.lead_mm - expected_lead) < 1e-9
    expected_lead_angle = math.atan2(expected_lead, math.pi * 20.0)
    assert abs(wp.lead_angle_rad - expected_lead_angle) < 1e-9


def test_thread_profile_is_closed_and_symmetric():
    wp = WormParams(starts=1, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=20.0)
    pts = thread_axial_profile(wp)
    # symmetric about u=0: for every point there's a mirror at -u, same v
    us = sorted(round(p[0], 6) for p in pts)
    assert us[0] == -us[-1]
    # spans from dedendum to addendum
    vs = [p[1] for p in pts]
    assert abs(max(vs) - wp.addendum_coeff * wp.axial_module_mm) < 1e-9
    assert abs(min(vs) - (-wp.dedendum_coeff * wp.axial_module_mm)) < 1e-9


def test_multi_start_threads_are_z_symmetric_and_not_offset():
    """Regression test for a real bug: an earlier version folded the second
    thread's phase offset into the Z/lead calculation, shifting that whole
    thread's Z-range by lead/2 for a 2-start worm (caught by comparing the
    built solid's bounding box to the requested length and finding it
    asymmetric / ~8mm off-center, not just imprecise)."""
    wp = WormParams(starts=2, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0)
    st0 = worm_thread_stations(wp, start_index=0, n_per_turn=20)
    st1 = worm_thread_stations(wp, start_index=1, n_per_turn=20)

    def z_center(stations):
        zs = [p[2] for station in stations for p in station]
        return (max(zs) + min(zs)) / 2.0

    z0, z1 = z_center(st0), z_center(st1)
    assert abs(z0) < 0.5, f"thread 0 should be centered on Z=0, got center={z0}"
    assert abs(z1) < 0.5, f"thread 1 should ALSO be centered on Z=0 (phase must not shift Z), got center={z1}"
    assert abs(z0 - z1) < 0.5


def test_full_solid_builds_fast_with_correct_bounds():
    """End-to-end: the actual fused solid builds quickly (regression test
    for a real performance bug: SEQUENTIAL pairwise fusing -- core.fuse(t1)
    .fuse(t2)... -- hung for 10+ minutes on spiral-vs-already-spiralled
    intersections; the N-ary core.fuse(*threads) that replaced it, all
    threads unioned in one call, must stay fast) and has bounds matching
    the requested dimensions."""
    wp = WormParams(starts=2, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0)
    t0 = time.time()
    solid = build_worm_solid(wp, n_per_turn=20)
    elapsed = time.time() - t0
    assert elapsed < 15.0, f"worm solid build took {elapsed:.1f}s -- regression toward the old hang?"

    bb = solid.bounding_box()
    # bb.max.X and bb.max.Y are each independently the largest coordinate
    # seen across ALL points, generally attained at DIFFERENT points for a
    # round shape -- hypot(bb.max.X, bb.max.Y) is sqrt(2)*radius, not the
    # radius (a real bug in an earlier version of this assertion, caught by
    # the failure showing 16.97 instead of the expected 12.0: exactly
    # 12*sqrt(2)). Check each axis extent against the radius directly instead.
    assert abs(bb.max.X - wp.addendum_radius_mm) < 0.1
    assert abs(bb.max.Y - wp.addendum_radius_mm) < 0.1
    # Z should be roughly centered on 0 and not wildly longer than requested
    # (some end-effect overshoot from the profile's own axial width is
    # expected and fine -- see worm.py; anything wildly larger would not be)
    z_span = bb.max.Z - bb.min.Z
    assert wp.length_mm <= z_span < wp.length_mm * 1.3
    assert abs((bb.max.Z + bb.min.Z) / 2.0) < 1.0


def test_full_solid_is_a_single_fused_manifold_body():
    """Same class of check the bevel gear bug (docs/gear-math.md 8.3) was
    found by. build_worm_solid now boolean-fuses the core and every thread
    into ONE body (core.fuse(*threads), an N-ary union -- see its own
    docstring for why an earlier Compound-of-unfused-pieces version was a
    workaround for the wrong operation, not a real constraint): the thread
    must actually merge into the shaft rather than sit next to it as a
    separate touching body, so the check here is exactly the OPPOSITE of
    what it used to assert -- exactly one manifold solid, not core+starts
    separate ones -- across a few different start counts and with/without
    a bore."""
    cases = [
        dict(starts=1, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0),
        dict(starts=2, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=30.0, bore_diameter_mm=6.0),
        dict(starts=4, axial_module_mm=1.5, pitch_diameter_mm=16.0, length_mm=25.0, hand="left"),
    ]
    for kwargs in cases:
        wp = WormParams(**kwargs)
        solid = build_worm_solid(wp, n_per_turn=30)
        bodies = solid.solids()
        assert len(bodies) == 1, kwargs  # core + every thread fused into ONE body
        assert all(b.is_manifold for b in bodies), kwargs
        assert solid.volume > 0
        # The fused volume must land strictly between core_vol (a no-op fuse
        # that silently dropped every thread) and core_vol + sum(thread_vol)
        # (the naive, non-overlapping sum -- true fused volume is always
        # less, since the thread genuinely overlaps the core at its root, so
        # equalling the naive sum would mean the fuse didn't actually merge
        # anything). Catches a fuse that no-ops OR one that double-counts.
        core = bd.Solid.make_cylinder(
            wp.dedendum_radius_mm, wp.length_mm, bd.Plane((0, 0, -wp.length_mm / 2)))
        if wp.bore_diameter_mm > 0:
            core = core.cut(bd.Solid.make_cylinder(
                wp.bore_diameter_mm / 2.0, wp.length_mm, bd.Plane((0, 0, -wp.length_mm / 2))))
        thread_vol_sum = 0.0
        for k in range(kwargs["starts"]):
            stations = worm_thread_stations(wp, start_index=k, n_per_turn=30)
            wires = [bd.Wire.make_polygon(pts, close=True) for pts in stations]
            thread_vol_sum += bd.Solid.make_loft(wires, ruled=True).volume
        assert core.volume < solid.volume < core.volume + thread_vol_sum, kwargs


def test_thread_root_fillet_is_concave_and_flares_the_thread_into_the_core():
    """Regression test for the inverted fillet, shared with rack.py (this
    profile is rack_tooth_profile's template): an earlier version placed the
    fillet circle's centre INSIDE the thread, which rounded the thread's own
    base corner off and curled the arc back under it -- a quarter-round
    groove rho wide along both sides of the thread's junction with the core,
    where the user expected 'a merging geometry between the elements'.
    Checked against the textbook, not the construction: centre on the space
    side of the flank, both tangent points rho*tan(45deg - alpha/2) from the
    sharp corner (the tangent length for a 90deg + alpha corner), landing
    point OUTBOARD of that corner, half-profile only ever widening on the
    way down, and the corner region under the arc solid material in the
    profile polygon."""
    from shapely.geometry import Point, Polygon
    wp = WormParams(starts=1, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=20.0)
    alpha = wp.pressure_angle_rad
    hf = wp.dedendum_coeff * wp.axial_module_mm
    rho = wp.root_fillet_coeff * wp.axial_module_mm
    half_thick = wp.axial_pitch_mm / 4.0
    n_arc = 16
    prof = thread_axial_profile(wp, n_arc=n_arc)
    right = prof[: n_arc + 2]  # tip, p_tan, arc..., p_root
    p_tan, arc, p_root = right[1], right[2:], right[-1]
    corner = (half_thick + hf * math.tan(alpha), -hf)
    t_len = rho * math.tan(math.pi / 4 - alpha / 2)
    assert abs(p_tan[0] - (half_thick - p_tan[1] * math.tan(alpha))) < 1e-9  # on the flank
    assert abs(p_root[1] + hf) < 1e-9                                          # on the land
    assert abs(math.hypot(p_tan[0] - corner[0], p_tan[1] - corner[1]) - t_len) < 1e-9
    assert abs(p_root[0] - corner[0] - t_len) < 1e-9
    assert p_root[0] > corner[0]
    cu, cv = p_root[0], -hf + rho
    assert cu > half_thick - cv * math.tan(alpha)  # centre on the space side
    assert all(abs(math.hypot(u - cu, v - cv) - rho) < 1e-9 for (u, v) in arc)
    for (u0, v0), (u1, v1) in zip(right, right[1:]):
        assert u1 >= u0 - 1e-12 and v1 <= v0 + 1e-12, "must only widen going down"
    poly = Polygon(prof)
    assert poly.is_valid
    for f in (0.25, 0.5, 0.75):
        assert poly.contains(Point(corner[0] + f * t_len, -hf + 0.01 * rho)), f
    assert not poly.contains(Point(cu, cv))


def test_thread_root_fillet_is_tangent_continuous_no_crease():
    """From the tip down to the root point, no direction change between
    consecutive segments may exceed the arc's own discretization step
    ((90 - alpha)/n_arc deg), and the worst one must shrink as n_arc grows
    -- a crease is resolution-independent, a smooth arc is not."""
    wp = WormParams(starts=1, axial_module_mm=2.0, pitch_diameter_mm=20.0, length_mm=20.0)
    sweep_deg = 90.0 - wp.pressure_angle_deg
    worst_prev = None
    for n_arc in (12, 48):
        prof = thread_axial_profile(wp, n_arc=n_arc)
        right = prof[:n_arc + 2]  # tip, p_tan, arc points..., p_root
        worst = 0.0
        for i in range(1, len(right) - 1):
            (x0, y0), (x1, y1), (x2, y2) = right[i - 1], right[i], right[i + 1]
            d = math.atan2(y2 - y1, x2 - x1) - math.atan2(y1 - y0, x1 - x0)
            d = abs((d + math.pi) % (2 * math.pi) - math.pi)
            worst = max(worst, math.degrees(d))
        assert worst <= (sweep_deg / n_arc) * 1.05 + 0.01, (n_arc, worst)
        if worst_prev is not None:
            assert worst < worst_prev, (worst, worst_prev)
        worst_prev = worst


if __name__ == "__main__":
    import pytest
    raise SystemExit(pytest.main([__file__, "-v"]))
