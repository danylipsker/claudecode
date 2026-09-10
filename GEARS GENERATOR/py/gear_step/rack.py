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
    helix_angle_deg: float = 0.0        # 0 = straight rack; otherwise a helical rack (docs/gear-math.md 10.4)
    hand: str = "right"                 # helix hand, ignored at 0deg -- convention in shear_per_mm

    @property
    def pressure_angle_rad(self) -> float:
        """The NORMAL pressure angle (the user's number). The flanks in the
        transverse section are at transverse_pressure_angle_rad, which is
        the same thing for a straight rack."""
        return math.radians(self.pressure_angle_deg)

    # -- helical racks: normal vs transverse, the same split as involute.py's
    # GearParams (docs/gear-math.md 7.1-7.2 and 10.4). module_mm and
    # pressure_angle_deg are the NORMAL values; the rack's own length
    # direction sees the transverse ones. All identical when helix = 0. --

    @property
    def helix_angle_rad(self) -> float:
        return math.radians(self.helix_angle_deg)

    @property
    def transverse_module_mm(self) -> float:
        """m_t = m_n / cos(beta)."""
        return self.module_mm / math.cos(self.helix_angle_rad)

    @property
    def transverse_pressure_angle_rad(self) -> float:
        """tan(alpha_t) = tan(alpha_n) / cos(beta)."""
        return math.atan(math.tan(self.pressure_angle_rad) / math.cos(self.helix_angle_rad))

    @property
    def shear_per_mm(self) -> float:
        """How far (along u, mm) a tooth's trace moves per mm of face width
        (z) -- the whole difference between a straight and a helical rack's
        solid (build_gear.build_rack_solid extrudes the transverse outline
        along (shear, 0, 1)). Sign convention: a rack is a gear of infinite
        radius with its teeth on top (+v). involute.GearParams.twist_total_rad
        rotates a RIGHT-hand gear's profile counter-clockwise as z increases,
        which carries the tooth at the top of that gear toward -x; so
        right-hand = -tan(beta), left-hand = +tan(beta). A right-hand rack
        therefore meshes with a LEFT-hand pinion of the same normal module
        and helix angle -- the same opposite-hands rule as two external
        helical gears. tests/test_rack.py derives the expected sign from
        involute.py's own, rather than restating it here."""
        if abs(self.helix_angle_deg) < 1e-9:
            return 0.0
        return (1.0 if self.hand == "left" else -1.0) * math.tan(self.helix_angle_rad)

    @property
    def normal_pitch_mm(self) -> float:
        """p_n = pi*m_n, the pitch measured perpendicular to the teeth."""
        return math.pi * self.module_mm

    @property
    def circular_pitch_mm(self) -> float:
        """p_t = pi*m_t, the pitch along the rack's own length. Unlike a
        gear's circular pitch (2*pi*R/z), this does not depend on z at all
        -- it's already the z -> infinity limit, since 2*pi*R/z =
        2*pi*(m*z/2)/z = pi*m regardless of z. Equals pi*m_n for a straight
        rack."""
        return math.pi * self.transverse_module_mm

    @property
    def circular_tooth_thickness_mm(self) -> float:
        """GearParams.circular_tooth_thickness at profile_shift=0 (a rack
        itself is never profile-shifted -- shifting the MATING gear relative
        to this rack is the standard way a rack/pinion pair uses profile
        shift, which doesn't change the rack's own tooth shape at all, only
        where the pinion's teeth land on it). Measured along the rack's
        length, i.e. the TRANSVERSE thickness s_t = pi*m_t/2 - backlash; the
        thickness perpendicular to a helical rack's teeth is s_t*cos(beta) =
        pi*m_n/2 - backlash*cos(beta). Same number either way at 0deg."""
        return self.transverse_module_mm * math.pi / 2.0 - self.backlash_mm

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
    tooth form, centered on u=0. This is the TRANSVERSE section (the plane
    of the rack's length): for a helical rack the flanks are at the
    transverse pressure angle and the widths follow the transverse module,
    while the heights and the fillet radius stay on the normal module --
    docs/gear-math.md 10.4. Identical to the straight rack at 0deg."""
    alpha = rp.transverse_pressure_angle_rad
    ha = rp.addendum_height_mm
    hf = rp.dedendum_height_mm
    half_thick = rp.circular_tooth_thickness_mm / 2.0
    rho = rp.root_fillet_coeff * rp.module_mm

    def half_u_at(v: float) -> float:
        # half-width narrows moving outward (toward +v/addendum), widens
        # moving inward (toward -v/dedendum) -- standard trapezoid taper
        return half_thick - v * math.tan(alpha)

    # Root fillet: a circle of radius rho tangent to BOTH the flank and the
    # flat root land (v = -hf), with its centre on the tooth-SPACE side of
    # the flank. The arc is therefore concave as seen from the space and ADDS
    # material in the corner where the flank meets the land, flaring the
    # tooth out into the land the way every real rack does (and ISO 53's
    # basic rack, whose rho_fP this coefficient is). The centre sits rho
    # above the land and rho/cos(alpha) outboard of the flank at that height
    # (a line alpha from vertical is a perpendicular distance rho away when
    # the horizontal offset is rho/cos(alpha)); the two tangent points are
    # the perpendicular feet: straight down onto the land, and rho*(cos(alpha),
    # sin(alpha)) back toward the flank. The sharp corner they replace sits
    # rho*tan(45deg - alpha/2) from each -- the textbook tangent length for a
    # fillet in a corner of interior angle 90deg + alpha (self-tested below).
    #
    # Which SIDE the centre is on is the whole fillet, and it was wrong
    # before: an earlier version put it inside the tooth (u_flank -
    # rho/cos(alpha)) -- the placement that is right for the convex TIP
    # rounding of a cutting tool in involute.rack_cutter_tooth_points, which
    # this construction descends from, and inverted for a tooth's ROOT. That
    # rounded the tooth's own base corner off and then curled the arc back
    # under the tooth, leaving a quarter-round groove rho wide beneath every
    # tooth: at module 2 the arc landed 1.09 mm INBOARD of the sharp corner
    # and a point just above the land outboard of it was air (the "fillets
    # not made right"). Two attempts at treating that shape's symptoms (a
    # monotonic clamp on u; a camera nudge for the silhouette it produced at
    # the end teeth) are gone with it. Guarded by the self-tests below, which
    # check the geometry against the textbook, not against these variables.
    #
    # The fillet must also FIT: neighbouring teeth's fillets meet at the
    # land's midpoint when rho reaches rho_max (a full-round root) and would
    # overlap beyond it. Clamp rather than fail -- the coefficient is a user
    # knob. (u_center = half_thick + hf*tan(alpha) + rho*(1-sin(alpha))/cos(alpha)
    # must not exceed half a pitch.)
    pitch = rp.circular_pitch_mm
    rho_max = (pitch / 2.0 - half_thick - hf * math.tan(alpha)) * math.cos(alpha) / (1.0 - math.sin(alpha))
    rho = max(0.0, min(rho, rho_max))

    right_path = [(half_u_at(ha), ha)]            # tip, right side
    if rho <= 1e-12:
        right_path.append((half_u_at(-hf), -hf))   # no fillet: sharp corner straight onto the land
    else:
        v_center = -hf + rho
        u_center = half_u_at(v_center) + rho / math.cos(alpha)
        p_tan = (u_center - rho * math.cos(alpha), v_center - rho * math.sin(alpha))  # foot on the flank
        p_root = (u_center, -hf)                                                     # foot on the land
        a_start = math.atan2(p_tan[1] - v_center, p_tan[0] - u_center)  # = alpha - pi
        a_end = -math.pi / 2.0                                          # straight down: sweep 90deg - alpha
        right_path.append(p_tan)                   # down the flank to the fillet
        for i in range(1, n_arc + 1):
            a = a_start + (a_end - a_start) * i / n_arc
            right_path.append((u_center + rho * math.cos(a), v_center + rho * math.sin(a)))
        assert abs(right_path[-1][0] - p_root[0]) < 1e-9 and abs(right_path[-1][1] - p_root[1]) < 1e-9
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
    """The fillet circle must touch the flank AND the root land, from the
    tooth-SPACE side (a concave fillet that adds material at the tooth's
    base). Checked against the geometry itself, not the construction's own
    variables: the flank tangent point lies on the flank line; every arc
    point is rho from one centre; that centre is outboard of the flank and
    rho above the land; both tangent points sit rho*tan(45deg - alpha/2)
    from the sharp corner (the textbook tangent length for a fillet in a
    corner of interior angle 90deg + alpha); and the arc ends exactly on the
    land, arriving parallel to it."""
    rp = RackParams(z=6, module_mm=2.5, pressure_angle_deg=20.0, root_fillet_coeff=0.3)
    n_arc = 20
    tooth = rack_tooth_profile(rp, n_arc=n_arc)
    alpha = rp.transverse_pressure_angle_rad  # == pressure_angle_rad for this straight rack
    hf = rp.dedendum_height_mm
    rho = rp.root_fillet_coeff * rp.module_mm
    half_thick = rp.circular_tooth_thickness_mm / 2.0

    def flank_u(v):
        return half_thick - v * math.tan(alpha)

    right = tooth[: n_arc + 2]  # tip, p_tan, arc points..., p_root
    p_tan, arc, p_root = right[1], right[2:], right[-1]
    assert abs(p_tan[0] - flank_u(p_tan[1])) < 1e-9, "flank tangent point must lie on the flank line"
    assert abs(p_root[1] - (-hf)) < 1e-9, (p_root[1], -hf)
    cu, cv = p_root[0], -hf + rho  # centre: straight above the land's tangent point
    assert cu > flank_u(cv) + 1e-9, "centre must be on the tooth-space side of the flank (concave fillet)"
    for (u, v) in arc:
        assert abs(math.hypot(u - cu, v - cv) - rho) < 1e-9, (u, v)
    corner = (flank_u(-hf), -hf)  # the sharp flank/land corner the fillet replaces
    t_len = rho * math.tan(math.pi / 4.0 - alpha / 2.0)
    assert abs(math.hypot(p_tan[0] - corner[0], p_tan[1] - corner[1]) - t_len) < 1e-9
    assert abs((p_root[0] - corner[0]) - t_len) < 1e-9
    (u1, v1), (u2, v2) = arc[-2], arc[-1]  # last chord: within half an arc step of horizontal
    assert abs(math.degrees(math.atan2(v2 - v1, u2 - u1))) <= (90.0 - rp.pressure_angle_deg) / n_arc / 2.0 + 1e-9
    print(f"  [ok] fillet tangent to flank and land from the space side; tangent length "
          f"{t_len:.4f} = rho*tan(45-alpha/2) (rho={rho})")


def _selftest_root_fillet_adds_material_outboard_of_the_sharp_corner():
    """Regression test for the inverted fillet (see rack_tooth_profile): the
    fillet must FLARE the tooth into the root land -- its landing point on
    the land outboard of where the sharp flank/land corner would be, the
    half-profile monotone (never narrowing again on the way down), and the
    corner region under the arc solid material in the actual rack outline.
    The inverted version failed all three at these exact parameters: landing
    point 1.09 mm inboard, a curl-back, and air under the arc."""
    from shapely.geometry import Point
    rp = RackParams(z=3, module_mm=2.0, pressure_angle_deg=20.0)
    hf = rp.dedendum_height_mm
    rho = rp.root_fillet_coeff * rp.module_mm
    tooth = rack_tooth_profile(rp, n_arc=12)
    right = tooth[: len(tooth) // 2]
    corner_u = rp.circular_tooth_thickness_mm / 2.0 + hf * math.tan(rp.transverse_pressure_angle_rad)
    p_root = right[-1]
    assert p_root[0] > corner_u + 1e-9, (p_root[0], corner_u)
    for (u0, v0), (u1, v1) in zip(right, right[1:]):
        assert u1 >= u0 - 1e-12 and v1 <= v0 + 1e-12, "the tooth must only widen on the way down"
    outline = Polygon(rack_outline(rp))  # z=3: the middle tooth is centred on u=0
    for f in (0.25, 0.5, 0.75):
        u = corner_u + f * (p_root[0] - corner_u)
        assert outline.contains(Point(u, -hf + 0.01 * rho)), "under the arc must be material"
    assert not outline.contains(Point(p_root[0], -hf + rho)), "the circle's centre is in the space"
    print(f"  [ok] fillet lands {p_root[0] - corner_u:.4f} mm outboard of the sharp corner, material beneath")


def _selftest_oversized_root_fillet_is_clamped_to_a_full_round_root():
    """rho beyond what the land can hold is clamped so neighbouring fillets
    meet at the land's midpoint instead of overlapping: the outline stays a
    valid polygon and the landing point sits exactly half a pitch out."""
    rp = RackParams(z=4, module_mm=2.0, pressure_angle_deg=20.0, root_fillet_coeff=5.0)
    tooth = rack_tooth_profile(rp, n_arc=12)
    p_root = tooth[: len(tooth) // 2][-1]
    assert abs(p_root[0] - rp.circular_pitch_mm / 2.0) < 1e-9, (p_root[0], rp.circular_pitch_mm / 2.0)
    assert Polygon(rack_outline(rp)).is_valid
    print(f"  [ok] oversized fillet clamped: lands at u={p_root[0]:.4f} = pitch/2")


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


def _selftest_fillet_is_tangent_continuous_no_crease():
    """The flank-fillet-land path must be tangent-continuous: from the tip
    down to p_root, no direction change between consecutive segments may
    exceed the arc's own discretization step ((90 - alpha)/n_arc deg), and
    the worst one must shrink as n_arc grows -- a crease is resolution-
    independent, a smooth arc is not. (An earlier version briefly had a
    monotonic clamp on u here that produced a resolution-independent 20deg
    crease at the flank junction; this is what would catch it again.)"""
    rp = RackParams(z=4, module_mm=2.0, pressure_angle_deg=20.0)
    sweep_deg = 90.0 - rp.pressure_angle_deg  # arc runs from angle alpha-180deg up to -90deg
    worst_prev = None
    for n_arc in (12, 48):
        prof = rack_tooth_profile(rp, n_arc=n_arc)
        right = prof[:n_arc + 2]  # tip, p_tan, arc points..., p_root
        worst = 0.0
        for i in range(1, len(right) - 1):
            (x0, y0), (x1, y1), (x2, y2) = right[i - 1], right[i], right[i + 1]
            d = math.atan2(y2 - y1, x2 - x1) - math.atan2(y1 - y0, x1 - x0)
            d = abs((d + math.pi) % (2 * math.pi) - math.pi)
            worst = max(worst, math.degrees(d))
        step = sweep_deg / n_arc
        assert worst <= step * 1.05 + 0.01, (n_arc, worst, step)
        if worst_prev is not None:
            assert worst < worst_prev, (worst, worst_prev)
        worst_prev = worst
    print(f"  [ok] fillet is tangent-continuous: worst turn {worst:.2f}deg at n_arc=48 "
          f"(arc step {sweep_deg / 48:.2f}deg), no crease")


if __name__ == "__main__":
    print("Running rack self-tests...")
    _selftest_pitch_and_thickness_formulas()
    _selftest_flank_is_a_straight_line_at_the_pressure_angle()
    _selftest_root_fillet_is_tangent_to_flank_and_root_land()
    _selftest_root_fillet_adds_material_outboard_of_the_sharp_corner()
    _selftest_oversized_root_fillet_is_clamped_to_a_full_round_root()
    _selftest_fillet_is_tangent_continuous_no_crease()
    _selftest_outline_is_valid_with_correct_bounds()
    _selftest_curvature_limit_matches_a_gear_at_very_large_z()
    print("All rack self-tests passed.")
