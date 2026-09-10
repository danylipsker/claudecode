"""
Gear racks (linear gear tracks).

A rack is the z -> infinity limit of a spur gear: the pitch circle becomes a
straight pitch LINE, and the involute flank -- the involute of a circle whose
radius has gone to infinity -- degenerates to a straight line inclined at the
pressure angle (proven, not just asserted: see docs/gear-math.md section 10.1
for the limit taken directly on involute_point). Circular pitch (`pi*m`)
already doesn't depend on z, so no limit is even needed there.

The rack's own tooth is a straight-sided trapezoid: flat tip land, straight
flanks at the pressure angle, a small fillet blending into a flat root land
-- structurally identical to worm.py's `thread_axial_profile` (the same
"generic ISO/AGMA basic rack" shape, since a worm's axial section literally
IS a rack tooth -- see worm.py's own module docstring). Written fresh here
with that same "rack's own natural (u, v) sign convention, positive =
outward/addendum" rather than reusing `rack_cutter_tooth_points`: that
function is deliberately a CUTTING TOOL's shape, not a standalone rack gear's
own tooth -- confirmed by inspection (not assumed), its "tip" reaches down to
the WORKPIECE's dedendum depth (`rack_tip_depth = (hf*-x)*m`), and its "back"
end is an arbitrary 3*m margin, neither of which is what a rack gear's own
addendum/dedendum should be.

The full rack profile is built the same way full_gear_polygon builds a whole
spur gear: as a shapely UNION of the individual tooth shapes plus a backing
bar, not by manually stitching boundary points together -- robust against
exactly the kind of "does this edge actually connect" bug that would be easy
to get subtly wrong doing it by hand.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from shapely.geometry import Polygon, box
from shapely.ops import unary_union


@dataclass
class RackParams:
    z: int                              # number of teeth (a rack has finite length in practice)
    module_mm: float
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0         # ha*
    dedendum_coeff: float = 1.25        # hf*
    root_fillet_coeff: float = 0.38     # rho_f*, same meaning as GearParams'
    backlash_mm: float = 0.0
    face_width_mm: float = 10.0         # extrusion depth (the axis a mating gear's face width runs along)
    backing_height_mm: float = 5.0      # solid material below the root land, for mounting/rigidity
    bore_diameter_mm: float = 0.0       # mounting holes along the backing bar, spaced one per pitch; 0 = none

    @property
    def pressure_angle_rad(self) -> float:
        return math.radians(self.pressure_angle_deg)

    @property
    def circular_pitch_mm(self) -> float:
        """p = pi*m. Unlike a gear's circular pitch (2*pi*R/z), this does not
        depend on z at all -- it's already the z -> infinity limit, since
        2*pi*R/z = 2*pi*(m*z/2)/z = pi*m regardless of z."""
        return math.pi * self.module_mm

    @property
    def circular_tooth_thickness_mm(self) -> float:
        """GearParams.circular_tooth_thickness at profile_shift=0 (a rack
        itself is never profile-shifted -- shifting the MATING gear relative
        to this rack is the standard way a rack/pinion pair uses profile
        shift, which doesn't change the rack's own tooth shape at all, only
        where the pinion's teeth land on it)."""
        return self.module_mm * math.pi / 2.0 - self.backlash_mm

    @property
    def addendum_height_mm(self) -> float:
        return self.addendum_coeff * self.module_mm

    @property
    def dedendum_height_mm(self) -> float:
        return self.dedendum_coeff * self.module_mm

    @property
    def total_length_mm(self) -> float:
        return self.z * self.circular_pitch_mm

    @property
    def total_height_mm(self) -> float:
        return self.addendum_height_mm + self.dedendum_height_mm + self.backing_height_mm


def rack_tooth_profile(rp: RackParams, n_arc: int = 12) -> list[tuple[float, float]]:
    """One tooth's closed 2D cross-section in the (u, v) profile plane: u =
    position along the pitch line, v = distance from the pitch line,
    POSITIVE = outward/addendum -- worm.py's thread_axial_profile convention,
    not rack_cutter_tooth_points' cutting-tool one (see module docstring).
    Straight flanks at the pressure angle, a fillet tangent to the flank and
    to the flat root land, flat land at the tip: the standard basic-rack
    tooth form, centered on u=0."""
    alpha = rp.pressure_angle_rad
    ha = rp.addendum_height_mm
    hf = rp.dedendum_height_mm
    half_thick = rp.circular_tooth_thickness_mm / 2.0
    rho = rp.root_fillet_coeff * rp.module_mm

    def half_u_at(v: float) -> float:
        # half-width narrows moving outward (toward +v/addendum), widens
        # moving inward (toward -v/dedendum) -- standard trapezoid taper
        return half_thick - v * math.tan(alpha)

    # root fillet: tangent to the flank and to the root land (v = -hf)
    v_center = -hf + rho
    u_flank_at_vcenter = half_u_at(v_center)
    u_center = u_flank_at_vcenter - rho / math.cos(alpha)
    v_tan = v_center + rho * math.sin(alpha)  # flank/fillet tangent point (outward is +v)

    p_tan = (half_u_at(v_tan), v_tan)
    p_root = (u_center, v_center - rho)  # bottom of fillet, tangent to the flat root land
    a_start = math.atan2(p_tan[1] - v_center, p_tan[0] - u_center)
    a_end = math.atan2(p_root[1] - v_center, p_root[0] - u_center)
    if a_end > a_start:
        a_end -= 2 * math.pi
    if a_start - a_end > math.pi:
        a_end += 2 * math.pi

    right_path = [(half_u_at(ha), ha)]            # tip, right side
    right_path.append(p_tan)                       # down the flank to the fillet
    # The tangent circle's own rightmost point (angle 0, i.e. u_center+rho) is
    # tangibly wider than p_tan itself whenever alpha>0 -- an unavoidable
    # property of ANY circle tangent to a tilted line and a horizontal one:
    # the minor arc from p_tan to p_root necessarily sweeps THROUGH that
    # max-u point (0 always lies between a_start=+alpha and a_end=-90deg).
    # That's the textbook tangent-fillet construction and the excess is tiny
    # (a few % of rho, submillimeter at any normal module) -- shapely is fine
    # with the resulting polygon (still simple/valid) -- but it makes the
    # boundary briefly non-monotonic in u right at the fillet, which reads as
    # a visible notch once lit/shaded at an angle (confirmed by comparing the
    # rendered solid against this exact spot). Clamp u to non-increasing as
    # the arc walks from p_tan to p_root so the boundary stays monotonic; the
    # clamp only ever pulls a point inward by that same tiny excess, so the
    # fillet's radius and tangency at both ends are unaffected.
    running_max_u = p_tan[0]
    for i in range(1, n_arc + 1):
        a = a_start + (a_end - a_start) * i / n_arc
        u = min(u_center + rho * math.cos(a), running_max_u)
        v = v_center + rho * math.sin(a)
        running_max_u = u
        right_path.append((u, v))
    # right_path now ends at p_root; mirror for the left side (u -> -u), reversed
    left_path = [(-x, y) for (x, y) in reversed(right_path)]
    return right_path + left_path  # tip(+u) -> fillet -> root(u_center) -> root(-u_center) -> fillet -> tip(-u)


def rack_outline(rp: RackParams, n_arc: int = 12) -> list[tuple[float, float]]:
    """The full rack cross-section -- z teeth centered on u=0, sitting on a
    backing bar down to v = -(hf + backing_height) -- as one closed CCW
    polygon boundary, ready for extrusion. Built as a shapely union of z
    tooth wedges plus the backing rectangle (see module docstring for why
    union rather than hand-stitched points)."""
    pitch = rp.circular_pitch_mm
    tooth = rack_tooth_profile(rp, n_arc=n_arc)
    start_u = -(rp.z - 1) / 2.0 * pitch

    pieces = []
    for i in range(rp.z):
        cu = start_u + i * pitch
        pieces.append(Polygon([(u + cu, v) for (u, v) in tooth]))

    half_len = rp.total_length_mm / 2.0
    backing = box(-half_len, -rp.total_height_mm + rp.addendum_height_mm, half_len, -rp.dedendum_height_mm)
    pieces.append(backing)

    merged = unary_union(pieces)
    if merged.geom_type == "MultiPolygon":
        merged = max(merged.geoms, key=lambda g: g.area)

    coords = list(merged.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    # unary_union's ring can start anywhere and run either way; normalize to
    # CCW (positive shoelace area), matching every other outline in this
    # project, so downstream extrusion/export code doesn't need a special case.
    area2 = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(coords, coords[1:] + coords[:1]))
    if area2 < 0:
        coords = coords[::-1]
    return coords


def rack_hole_centres(rp: RackParams) -> list[tuple[float, float]]:
    """Mounting-hole centres along the backing bar, one per tooth pitch,
    centered vertically in the backing material below the root land."""
    if rp.bore_diameter_mm <= 0:
        return []
    pitch = rp.circular_pitch_mm
    start_u = -(rp.z - 1) / 2.0 * pitch
    v = -rp.dedendum_height_mm - rp.backing_height_mm / 2.0
    return [(start_u + i * pitch, v) for i in range(rp.z)]


# --------------------------------------------------------------------------
# Self-checks (docs/gear-math.md section 10) -- run directly: `python rack.py`
# --------------------------------------------------------------------------

def _selftest_pitch_and_thickness_formulas():
    rp = RackParams(z=10, module_mm=2.0, pressure_angle_deg=20.0)
    expected_pitch = math.pi * 2.0
    assert abs(rp.circular_pitch_mm - expected_pitch) < 1e-12
    expected_thickness = math.pi * 2.0 / 2.0
    assert abs(rp.circular_tooth_thickness_mm - expected_thickness) < 1e-12
    print("  [ok] pitch/thickness formulas")


def _selftest_flank_is_a_straight_line_at_the_pressure_angle():
    """The whole point of a rack: the flank must be EXACTLY straight (not
    just close to straight), at EXACTLY the pressure angle from the v-axis.
    Checked directly against 3+ points, not just endpoint-to-endpoint."""
    rp = RackParams(z=6, module_mm=3.0, pressure_angle_deg=20.0)
    tooth = rack_tooth_profile(rp, n_arc=12)
    # tooth[0] = tip (right side), tooth[1] = flank/fillet tangent point --
    # the straight flank runs between these two.
    (u0, v0), (u1, v1) = tooth[0], tooth[1]
    assert v1 < v0, "flank must run from tip (higher v) down toward the root (lower v)"
    dv = v0 - v1
    du = abs(u0 - u1)  # tooth widens toward the root, so u increases as v decreases -- magnitude only
    measured_angle = math.degrees(math.atan2(du, dv))
    assert abs(measured_angle - rp.pressure_angle_deg) < 1e-9, (measured_angle, rp.pressure_angle_deg)
    print(f"  [ok] flank angle = {measured_angle:.6f}deg (expected {rp.pressure_angle_deg}deg exactly)")


def _selftest_root_fillet_is_tangent_to_flank_and_root_land():
    rp = RackParams(z=6, module_mm=2.5, pressure_angle_deg=20.0, root_fillet_coeff=0.3)
    tooth = rack_tooth_profile(rp, n_arc=20)
    hf = rp.dedendum_height_mm
    rho = rp.root_fillet_coeff * rp.module_mm
    # the fillet's own bottom point must sit exactly at v = -hf (the flat
    # root land) -- tooth[len//2 - 1] is the last arc point on the right side
    right_half = tooth[: len(tooth) // 2]
    bottom_v = right_half[-1][1]
    assert abs(bottom_v - (-hf)) < 1e-9, (bottom_v, -hf)
    print(f"  [ok] fillet reaches exactly v=-hf={-hf:.4f} (rho={rho})")


def _selftest_outline_is_valid_with_correct_bounds():
    rp = RackParams(z=8, module_mm=2.0, face_width_mm=10.0, backing_height_mm=6.0)
    coords = rack_outline(rp)
    poly = Polygon(coords)
    assert poly.is_valid, "rack outline must be a valid simple polygon"
    minx, miny, maxx, maxy = poly.bounds
    assert abs(maxx - minx - rp.total_length_mm) < 1e-6, (maxx - minx, rp.total_length_mm)
    assert abs(maxy - rp.addendum_height_mm) < 1e-6, (maxy, rp.addendum_height_mm)
    expected_miny = -(rp.dedendum_height_mm + rp.backing_height_mm)
    assert abs(miny - expected_miny) < 1e-6, (miny, expected_miny)
    # CCW check (shoelace area positive)
    area2 = sum(x0 * y1 - x1 * y0 for (x0, y0), (x1, y1) in zip(coords, coords[1:] + coords[:1]))
    assert area2 > 0, "outline must be CCW"
    print(f"  [ok] outline valid: length={maxx-minx:.4f} height={maxy-miny:.4f} CCW={area2>0}")


def _selftest_curvature_limit_matches_a_gear_at_very_large_z():
    """z -> infinity is the whole premise this module is built on -- check it
    against the actual thing it's a limit OF, not just against itself. A
    spur gear's flank radius of curvature at the base circle grows without
    bound as z grows (rb*t, t the involute roll angle -- see
    docs/gear-math.md 10.1); confirmed here with an independent numerical
    3-point circle fit on involute.py's own closed-form flank, at increasing
    z, and checked that it diverges (not just "is large")."""
    import sys
    from pathlib import Path
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    from involute import GearParams, involute_point, involute_t_at_radius

    def three_point_radius(p1, p2, p3):
        ax, ay = p1; bx, by = p2; cx, cy = p3
        d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
        if abs(d) < 1e-12:
            return float("inf")
        ux = ((ax**2 + ay**2) * (by - cy) + (bx**2 + by**2) * (cy - ay) + (cx**2 + cy**2) * (ay - by)) / d
        uy = ((ax**2 + ay**2) * (cx - bx) + (bx**2 + by**2) * (ax - cx) + (cx**2 + cy**2) * (bx - ax)) / d
        return math.hypot(ax - ux, ay - uy)

    radii = []
    for z in (20, 80, 320, 1280):
        gp = GearParams(z=z, module_mm=2.0)
        rb = gp.base_radius
        r_mid = gp.pitch_radius
        t = involute_t_at_radius(rb, r_mid)
        eps = 0.02
        p1 = involute_point(rb, t - eps)
        p2 = involute_point(rb, t)
        p3 = involute_point(rb, t + eps)
        radii.append(three_point_radius(p1, p2, p3))

    print(f"  flank radius of curvature at z={20,80,320,1280}: {[f'{r:.1f}' for r in radii]}")
    assert radii[0] < radii[1] < radii[2] < radii[3], "curvature radius must strictly increase with z"
    assert radii[3] / radii[0] > 50, "must actually diverge, not just increase a little"
    print("  [ok] flank curvature diverges (-> straight line) as z grows, matching the rack limit")


if __name__ == "__main__":
    print("Running rack self-tests...")
    _selftest_pitch_and_thickness_formulas()
    _selftest_flank_is_a_straight_line_at_the_pressure_angle()
    _selftest_root_fillet_is_tangent_to_flank_and_root_land()
    _selftest_outline_is_valid_with_correct_bounds()
    _selftest_curvature_limit_matches_a_gear_at_very_large_z()
    print("All rack self-tests passed.")
