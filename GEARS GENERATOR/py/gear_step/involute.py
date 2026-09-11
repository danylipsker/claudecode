"""
Exact involute spur gear tooth-profile math.

Implements docs/gear-math.md. Single source of truth for the Python/OpenCASCADE
backend (build_gear.py). All angles taken/returned by the public API are in
DEGREES; radians are used only inside trig calls.

The tooth profile (flank + root fillet, including true undercut when it occurs)
is computed by literally simulating the generating rack cutter rolling on the
gear blank and taking the boolean-swept cut (see `rack_swept_cutter` and
`full_gear_polygon`) — this is the same computation a hobbing/rack-shaping
process performs, so it reproduces the true tooth form (verified against the
closed-form involute on the flank, and against the classical undercut cutoff
z_min = 2/sin(alpha)^2 on the root — see gear_step/tests/test_involute.py).
"""
from __future__ import annotations

import dataclasses
import math
from dataclasses import dataclass

from shapely.geometry import Polygon
from shapely.affinity import rotate as shapely_rotate
from shapely.ops import unary_union


# --------------------------------------------------------------------------
# Parameters
# --------------------------------------------------------------------------

@dataclass
class GearParams:
    z: int                          # number of teeth
    module_mm: float                # NORMAL module, millimeters (hob's own reference)
    pressure_angle_deg: float = 20.0  # NORMAL pressure angle
    profile_shift: float = 0.0      # x, coefficient
    addendum_coeff: float = 1.0     # ha*
    dedendum_coeff: float = 1.25    # hf*
    root_fillet_coeff: float = 0.38 # rho_f* of the generating rack
    face_width_mm: float = 10.0
    backlash_mm: float = 0.0
    bore_diameter_mm: float = 0.0
    helix_angle_deg: float = 0.0    # 0 = spur gear; see docs/gear-math.md section 7
    hand: str = "right"             # "right" or "left" -- helix hand, ignored if helix_angle_deg == 0
    is_inch_input: bool = False     # informational only; geometry is unaffected
    source_diametral_pitch: float | None = None  # informational, if is_inch_input

    @staticmethod
    def from_metric(z: int, module_mm: float, **kw) -> "GearParams":
        return GearParams(z=z, module_mm=module_mm, **kw)

    @staticmethod
    def from_inch(z: int, diametral_pitch: float, **kw) -> "GearParams":
        m = 25.4 / diametral_pitch
        return GearParams(
            z=z, module_mm=m, is_inch_input=True,
            source_diametral_pitch=diametral_pitch, **kw,
        )

    # -- normal/transverse (docs/gear-math.md section 7.1) -----------------

    @property
    def helix_angle_rad(self) -> float:
        return math.radians(self.helix_angle_deg)

    @property
    def normal_pressure_angle_rad(self) -> float:
        return math.radians(self.pressure_angle_deg)

    @property
    def transverse_module_mm(self) -> float:
        """mt = mn / cos(beta). Equals module_mm when helix_angle_deg == 0."""
        if abs(self.helix_angle_deg) < 1e-9:
            return self.module_mm
        return self.module_mm / math.cos(self.helix_angle_rad)

    @property
    def transverse_pressure_angle_rad(self) -> float:
        """alpha_t = atan(tan(alpha_n)/cos(beta)). Equals the normal pressure
        angle when helix_angle_deg == 0."""
        if abs(self.helix_angle_deg) < 1e-9:
            return self.normal_pressure_angle_rad
        return math.atan(math.tan(self.normal_pressure_angle_rad) / math.cos(self.helix_angle_rad))

    # -- derived circles (docs/gear-math.md section 2 & 7.2) ----------------
    # alpha_rad/pitch_radius are the TRANSVERSE values: every 2D profile
    # function (section 3-5) reads these, so helical support needs no changes
    # to that code at all -- it's already computing "the transverse cross
    # section", which for helix_angle_deg == 0 is exactly the spur profile.

    @property
    def alpha_rad(self) -> float:
        return self.transverse_pressure_angle_rad

    @property
    def pitch_radius(self) -> float:
        return self.transverse_module_mm * self.z / 2.0

    @property
    def base_radius(self) -> float:
        return self.pitch_radius * math.cos(self.alpha_rad)

    @property
    def addendum_radius(self) -> float:
        # tooth height uses the NORMAL module (a hob property), not transverse
        return self.pitch_radius + self.module_mm * (self.addendum_coeff + self.profile_shift)

    @property
    def dedendum_radius(self) -> float:
        return self.pitch_radius - self.module_mm * (self.dedendum_coeff - self.profile_shift)

    @property
    def circular_tooth_thickness(self) -> float:
        m, x, alpha = self.transverse_module_mm, self.profile_shift, self.alpha_rad
        return m * (math.pi / 2.0 + 2.0 * x * math.tan(alpha)) - self.backlash_mm

    @property
    def twist_total_rad(self) -> float:
        """Total profile rotation from one face to the other (docs/gear-math.md
        7.3). Zero for a spur gear (helix_angle_deg == 0)."""
        if abs(self.helix_angle_deg) < 1e-9:
            return 0.0
        magnitude = self.face_width_mm * math.tan(self.helix_angle_rad) / self.pitch_radius
        return -magnitude if self.hand == "left" else magnitude

    @property
    def rack_fillet_radius(self) -> float:
        return self.root_fillet_coeff * self.module_mm

    @property
    def rack_tip_depth(self) -> float:
        """How far the generating rack's tooth protrudes past its pitch line —
        this cuts the gear's dedendum, so it equals the gear's dedendum depth."""
        return (self.dedendum_coeff - self.profile_shift) * self.module_mm


# --------------------------------------------------------------------------
# Generating transform (docs/gear-math.md section 4.1)
# --------------------------------------------------------------------------

def rack_point_to_gear_frame(phi: float, u: float, v: float, r: float) -> tuple[float, float]:
    """Rack-local point (u, v) -> gear body-fixed frame, at gear roll angle phi (rad).

    u: along the rack pitch line. v: distance below the pitch line (toward gear axis).
    r: pitch radius. Standard rigid-body rolling-without-slip kinematics; verified
    numerically in gear_step/tests/test_involute.py (reproduces the closed-form
    involute exactly, and the classical undercut cutoff)."""
    cu = u - r * phi
    cv = r - v
    cphi, sphi = math.cos(phi), math.sin(phi)
    x = cphi * cu + sphi * cv
    y = -sphi * cu + cphi * cv
    return x, y


# --------------------------------------------------------------------------
# Involute flank (closed form, docs/gear-math.md section 3) — used for fast
# preview and as the cross-check reference; the actual solid geometry comes
# from the validated rack-sweep below, which matches this to numerical noise.
# --------------------------------------------------------------------------

def involute_point(rb: float, t: float) -> tuple[float, float]:
    """Involute of the circle of radius rb, parametrized so t=0 sits on the +Y
    axis and the curve opens toward +X (gear axis at origin, tooth centered on
    +Y, angle = atan2(x, y) — the frame used throughout this module)."""
    return (
        rb * (math.sin(t) - t * math.cos(t)),
        rb * (math.cos(t) + t * math.sin(t)),
    )


def involute_t_at_radius(rb: float, radius: float) -> float:
    ratio = radius / rb
    return math.sqrt(max(ratio * ratio - 1.0, 0.0))


# --------------------------------------------------------------------------
# Generating-rack cutter tooth, and the validated boolean-sweep tooth profile
# --------------------------------------------------------------------------

def rack_cutter_tooth_points(gp: GearParams, n_arc: int = 24) -> list[tuple[float, float]]:
    """One rack-cutter tooth in rack-local (u, v) coordinates: straight flanks
    at the pressure angle, root-fillet arcs of radius rack_fillet_radius blending
    into a flat tip land, extended comfortably above the pitch line (v<0) so the
    swept polygon is a clean closed shape. Right-to-left, ready for Polygon()."""
    alpha = gp.alpha_rad
    half_t = gp.circular_tooth_thickness / 2.0
    tip_v = gp.rack_tip_depth
    rho = gp.rack_fillet_radius
    v_top = -3.0 * gp.module_mm

    def flank_u(v: float) -> float:
        return half_t - v * math.tan(alpha)

    # The two tip fillets must fit on the cutter's tip land, which narrows
    # with the pressure angle: each takes rho*tan(45deg - alpha/2) of the
    # half-width flank_u(tip_v) (the tangent length for a fillet in the
    # tooth's 90deg + alpha tip corner). Past that they cross and the outline
    # self-intersects -- measured: at module 2, hf* 1.25, rho* 0.38 the land
    # is 0.26 mm at 20deg, 0.013 mm at 23deg and negative from ~23.5deg, so
    # the 25deg preset and any spiral bevel's transverse angle produced an
    # invalid polygon (shapely's sweep union then fails with a "side location
    # conflict", or worse, silently unions garbage). Clamp to a full-round
    # tip, exactly as rack.py clamps its root fillet.
    # (0.999: at the limit itself the two arcs end on one point and floating-
    # point noise can cross them by 1e-17 -- shapely then rejects the outline
    # -- so leave a land a thousandth of the half-width wide, ~1 um.)
    if flank_u(tip_v) <= 1e-9:
        # The flanks meet BEFORE the tip depth: at standard depth the rack
        # tooth is pointed once tan(alpha) >= pi/(4 hf*) -- 32.1deg for hf* =
        # 1.25 -- which a large helix or spiral angle reaches through the
        # transverse pressure angle (and the pressure-angle spinner allows
        # 45deg outright). Cut the tooth off at its point rather than build
        # a self-crossing outline; server.py warns that the gear's root is
        # then a sharp V. (Pointed-rack teeth are a real, if rare, thing.)
        tip_v = half_t / math.tan(alpha) - 1e-6
        rho = 0.0
    rho_max = 0.999 * flank_u(tip_v) / math.tan(math.pi / 4.0 - alpha / 2.0)
    rho = max(0.0, min(rho, rho_max))

    v_center = tip_v - rho
    u_flank_at_vcenter = half_t - v_center * math.tan(alpha)
    u_center = u_flank_at_vcenter - rho / math.cos(alpha)
    v_tan = v_center - rho * math.sin(alpha)

    p_start = (flank_u(v_tan), v_tan)
    p_bottom = (u_center, v_center + rho)
    a_start = math.atan2(p_start[1] - v_center, p_start[0] - u_center)
    a_end = math.atan2(p_bottom[1] - v_center, p_bottom[0] - u_center)
    if a_end < a_start:
        a_end += 2 * math.pi
    if a_end - a_start > math.pi:
        a_end -= 2 * math.pi

    right_path = [(flank_u(v_top), v_top), (flank_u(v_tan), v_tan)]
    for i in range(1, n_arc + 1 if rho > 1e-12 else 1):  # no arc at all for a sharp (pointed) tip
        a = a_start + (a_end - a_start) * i / n_arc
        right_path.append((u_center + rho * math.cos(a), v_center + rho * math.sin(a)))

    left_path = [(-x, y) for (x, y) in reversed(right_path)]
    return right_path + left_path


def rack_swept_cutter_union(gp: GearParams, n_phi: int = 240, phi_margin: float = 0.7) -> "Polygon | object":
    """The generating rack's ONE tooth, swept across the phi range that carves a
    single tooth gap, unioned into one polygon: the exact material-removal shape
    for one gap. See docs/gear-math.md section 4.

    phi_margin is in units of one pitch angle. The default (0.7) is wide enough
    to fully carve this one gap's fillet/undercut while staying inside this
    gap's own angular territory (adjacent tooth centers are exactly one
    pitch_ang apart), so patterning z copies (full_gear_polygon) doesn't have
    neighboring sweeps double-cut into each other. Isolating and inspecting a
    single gap all the way to the addendum circle (as in the test suite) needs
    a wider margin, e.g. 1.3, since there's no neighbor to rely on."""
    pts = rack_cutter_tooth_points(gp)
    r = gp.pitch_radius
    pitch_ang = 2 * math.pi / gp.z
    phi_lo, phi_hi = -phi_margin * pitch_ang, phi_margin * pitch_ang

    polys = []
    for i in range(n_phi + 1):
        phi = phi_lo + (phi_hi - phi_lo) * i / n_phi
        coords = [rack_point_to_gear_frame(phi, u, v, r) for (u, v) in pts]
        polys.append(Polygon(coords))
    try:
        return unary_union(polys)
    except Exception as exc:  # shapely.errors.GEOSException: "side location conflict"
        # GEOS's exact-arithmetic overlay can still hit a topology conflict
        # when two swept positions' edges land (near-)coincident -- first seen
        # for a virtual tooth count of 80.8 at a 23.96deg transverse pressure
        # angle (a spiral bevel's section), never for the integer-z spur
        # gears. Snap-rounding to a 1 nm grid makes the overlay robust at no
        # geometric cost; done only on failure so every previously-working
        # case computes exactly as before.
        if "GEOS" not in type(exc).__name__ and "Topology" not in str(exc):
            raise
        import shapely  # shapely >= 2: union_all takes grid_size; shapely.ops.unary_union does not
        return shapely.union_all(polys, grid_size=1e-9)


def full_gear_polygon(gp: GearParams, n_phi: int = 240, blank_segments: int = 720):
    """The complete external-gear cross-section as a shapely polygon: an
    addendum-circle blank with all z tooth gaps cut by the (rotationally
    patterned) validated rack-sweep, minus an optional central bore."""
    ra = gp.addendum_radius
    blank = Polygon([
        (ra * math.sin(2 * math.pi * i / blank_segments), ra * math.cos(2 * math.pi * i / blank_segments))
        for i in range(blank_segments)
    ])

    # rack_swept_cutter_union cuts a GAP centered on +Y (angle 0); offset by
    # half a pitch so a TOOTH (not a gap) ends up centered on +Y, matching the
    # "tooth centered on +Y" frame convention used throughout this module.
    one_gap = rack_swept_cutter_union(gp, n_phi=n_phi)
    pitch_deg = 360.0 / gp.z
    all_gaps = unary_union([
        shapely_rotate(one_gap, k * pitch_deg + pitch_deg / 2.0, origin=(0, 0))
        for k in range(gp.z)
    ])

    gear = blank.difference(all_gaps)

    if gp.bore_diameter_mm > 0:
        bore_r = gp.bore_diameter_mm / 2.0
        bore = Polygon([
            (bore_r * math.sin(2 * math.pi * i / 200), bore_r * math.cos(2 * math.pi * i / 200))
            for i in range(200)
        ])
        gear = gear.difference(bore)

    return gear


def single_tooth_polygon(gp: GearParams, z_virtual: float, n_phi: int = 240) -> "Polygon":
    """One tooth's silhouette (right flank + root fillet, tip arc, mirrored
    left flank), isolated as its own closed polygon, centered on +Y -- using
    z_virtual (which may be non-integer) for the pitch/angular geometry
    instead of gp.z. This is what bevel gears need (Tredgold's approximation
    computes a "virtual" equivalent spur gear whose tooth count z/cos(beta)
    is generally not a whole number -- see docs/gear-math.md section 8), so
    full_gear_polygon's whole-gear patterning (which needs an integer z to
    loop over) doesn't apply; this isolates just the one tooth shape that
    patterning would otherwise produce.

    Method: cut two adjacent gaps (bounding one tooth between them) from a
    blank disk, same as full_gear_polygon, then intersect with a generous pie
    slice to separate that one tooth from the rest of the disk (which
    full_gear_polygon never needs to do, since it keeps the whole thing)."""
    gp_v = dataclasses.replace(gp, z=z_virtual)
    ra = gp_v.addendum_radius
    blank_segments = 720
    # Radius is EXACTLY ra, matching full_gear_polygon's own blank (no margin)
    # -- a real gear blank is turned to the true addendum diameter before
    # hobbing, and ra already accounts for profile shift (see
    # GearParams.addendum_radius). An earlier version of this function used
    # ra*1.05 here, confusing this blank-radius margin with the UNRELATED
    # phi_margin used by rack_swept_cutter_union's angular sweep -- that 5%
    # oversize left the tip capped by the blank's own (wrong, too-large)
    # edge instead of the true addendum circle, producing a visibly
    # overtall, sharp/pointed tooth tip instead of the correct flat
    # addendum land. Caught by comparing this function's output directly
    # against full_gear_polygon's construction and finding the tip
    # landed at exactly ra*1.05, not ra.
    blank = Polygon([
        (ra * math.sin(2 * math.pi * i / blank_segments), ra * math.cos(2 * math.pi * i / blank_segments))
        for i in range(blank_segments)
    ])

    # default (0.7) margin, not the wider isolated-single-gap margin: this
    # cuts TWO adjacent real gaps, and the wider margin was confirmed (during
    # spur/helical development) to make neighboring gap sweeps double-cut
    # into each other's territory near the root -- same fix as
    # full_gear_polygon's default.
    one_gap = rack_swept_cutter_union(gp_v, n_phi=n_phi)
    pitch_deg = 360.0 / z_virtual
    # shapely.affinity.rotate is standard-CCW-positive, which *decreases* this
    # module's atan2(x, y) angle convention (confirmed by rendering: a
    # "-pitch_deg" shapely rotation landed the copy on the +x side, the
    # opposite of intended) -- so +pitch_deg here is what lands the copy at
    # this module's "-pitch_deg" position.
    two_gaps = unary_union([one_gap, shapely_rotate(one_gap, pitch_deg, origin=(0, 0))])
    disk_minus_two_gaps = blank.difference(two_gaps)

    # isolate the one tooth peninsula (centered at -pitch_deg/2, between the
    # two cuts) with a generous ANNULAR sector, then recenter it on +Y.
    # (An inner radius, not a pie slice down to the center, matters: cutting
    # all the way to r=0 leaves the sector's own straight edges as part of
    # the result's boundary well below the root -- confirmed by rendering it
    # and seeing exactly that artifact before adding the inner bound.)
    half_sector_deg = pitch_deg * 0.5
    center_deg = -pitch_deg / 2.0
    inner_r = gp_v.dedendum_radius * 0.9
    outer_r = ra * 1.1
    n_arc = 48
    outer_arc = []
    inner_arc = []
    for k in range(n_arc + 1):
        a = math.radians(center_deg - half_sector_deg + (2 * half_sector_deg) * k / n_arc)
        outer_arc.append((outer_r * math.sin(a), outer_r * math.cos(a)))
        inner_arc.append((inner_r * math.sin(a), inner_r * math.cos(a)))
    sector = Polygon(outer_arc + list(reversed(inner_arc)))

    tooth = disk_minus_two_gaps.intersection(sector)
    tooth = shapely_rotate(tooth, -pitch_deg / 2.0, origin=(0, 0))  # see sign note above
    if tooth.geom_type == "MultiPolygon":
        tooth = max(tooth.geoms, key=lambda g: g.area)
    return tooth


def full_gear_outline(gp: GearParams, simplify_tolerance_mm: float = 0.001) -> list[tuple[float, float]]:
    """The outer boundary of full_gear_polygon as an ordered list of (x, y) mm
    points (the largest-area polygon's exterior ring — handles the rare case
    the boolean op returns a MultiPolygon).

    The dense phi/arc sampling used to build the validated boolean-swept shape
    (docs/gear-math.md section 4.3) produces on the order of 1000+ points per
    tooth -- geometrically correct, but a wildly over-tessellated polyline that
    bloats a STEP export to tens of megabytes for a single small gear. Douglas-
    Peucker simplification (shapely's simplify) removes the redundant near-
    collinear points while staying within simplify_tolerance_mm of the original,
    validated boundary -- default 1 micron, far tighter than any real machining
    tolerance, so this does not trade away the "accurate as if machined"
    requirement, only the pointless over-tessellation."""
    poly = full_gear_polygon(gp)
    if poly.geom_type == "MultiPolygon":
        poly = max(poly.geoms, key=lambda g: g.area)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords
