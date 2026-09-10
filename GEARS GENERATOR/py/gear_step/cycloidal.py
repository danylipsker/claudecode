"""
Cycloidal gears -- the tooth form of clock and instrument gearing, where the
flank above the pitch circle is an EPICYCLOID and below it a HYPOCYCLOID,
both traced by one "rolling" (generating) circle rolling on the pitch
circle: outside it for the addendum, inside it for the dedendum.
docs/gear-math.md section 14.

    pitch circle   R = m z / 2
    epicycloid     p(t) = (R + r_g)(cos t, sin t) - r_g (cos k t, sin k t),   k = (R + r_g) / r_g
    hypocycloid    p(t) = (R - r_g)(cos t, sin t) + r_g (cos k't, -sin k't),  k' = (R - r_g) / r_g
    (both start at the pitch point (R, 0) at t = 0; t is the angle of the
     rolling circle's centre about the gear centre)

Two cycloidal gears are conjugate when each one's addendum was traced by
the rolling circle that traced the other's dedendum -- so a pair shares one
rolling circle radius, and the classic choice r_g = R/2 turns that gear's
hypocycloid into a straight radial line (the "radial flank" pinion of
clockwork). Unlike an involute, the profile depends on the rolling circle
AND the centre distance must be exact, which is why these gears live in
instruments rather than power transmission; what they buy is a smooth,
low-sliding mesh with very few teeth (z = 6 is normal for a clock pinion,
where an involute would be hopelessly undercut).

Checks (tests/test_cycloidal.py): the fundamental law of gearing directly
-- the normal to every profile point passes through the rolling circle's
instantaneous contact point on the pitch circle; tooth thickness, tip and
root radii; the radial-flank special case; and, decisively, a pair sharing
one rolling circle meshes with zero boolean interpenetration at the exact
centre distance while a half-pitch phase error collides.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from shapely.affinity import rotate as sh_rotate
from shapely.geometry import Polygon
from shapely.ops import unary_union


@dataclass
class CycloidalGearParams:
    z: int
    module_mm: float
    rolling_circle_diameter_mm: float = 0.0  # 0 = auto: this gear's own pitch RADIUS (r_g = R/2, radial dedendum flanks)
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    backlash_mm: float = 0.0
    face_width_mm: float = 10.0
    bore_diameter_mm: float = 0.0

    @property
    def pitch_radius(self) -> float:
        return self.module_mm * self.z / 2.0

    @property
    def rolling_radius(self) -> float:
        """r_g. Auto (0) = R/2. Clamped so the hypocycloid can still reach the
        root (r_g >= hf/2) and stays a curve (r_g < R)."""
        r = self.rolling_circle_diameter_mm / 2.0 if self.rolling_circle_diameter_mm > 0 else self.pitch_radius / 2.0
        lo = self.dedendum_coeff * self.module_mm / 2.0 + 1e-9
        hi = self.pitch_radius * 0.999
        return min(max(r, lo), hi)

    @property
    def addendum_radius(self) -> float:
        return self.pitch_radius + self.addendum_coeff * self.module_mm

    @property
    def dedendum_radius(self) -> float:
        return self.pitch_radius - self.dedendum_coeff * self.module_mm

    @property
    def circular_pitch(self) -> float:
        return math.pi * self.module_mm

    @property
    def circular_tooth_thickness(self) -> float:
        return math.pi * self.module_mm / 2.0 - self.backlash_mm

    @property
    def dedendum_is_radial(self) -> bool:
        return abs(self.rolling_radius - self.pitch_radius / 2.0) < 1e-9


def epicycloid_point(R: float, rg: float, t: float) -> tuple[float, float]:
    k = (R + rg) / rg
    return ((R + rg) * math.cos(t) - rg * math.cos(k * t), (R + rg) * math.sin(t) - rg * math.sin(k * t))


def hypocycloid_point(R: float, rg: float, t: float) -> tuple[float, float]:
    k = (R - rg) / rg
    return ((R - rg) * math.cos(t) + rg * math.cos(k * t), (R - rg) * math.sin(t) - rg * math.sin(k * t))


def contact_point(R: float, t: float) -> tuple[float, float]:
    """Where the rolling circle touches the pitch circle at parameter t --
    the instantaneous centre of the rolling motion, through which the
    profile normal at p(t) must pass (the fundamental law of gearing)."""
    return (R * math.cos(t), R * math.sin(t))


def _solve_radius(curve, R: float, rg: float, target: float, t_lo: float, t_hi: float) -> float:
    """Bisection for the t at which |curve(t)| == target, on an interval where
    the radius is monotonic (the caller's responsibility)."""
    r_lo = math.hypot(*curve(R, rg, t_lo))
    r_hi = math.hypot(*curve(R, rg, t_hi))
    if (r_lo - target) * (r_hi - target) > 0:
        return t_hi  # target not reachable on this arc: go as far as the curve goes
    for _ in range(80):
        t_mid = (t_lo + t_hi) / 2.0
        r_mid = math.hypot(*curve(R, rg, t_mid))
        if (r_mid - target) * (r_lo - target) <= 0:
            t_hi, r_hi = t_mid, r_mid
        else:
            t_lo, r_lo = t_mid, r_mid
    return (t_lo + t_hi) / 2.0


def _rot(p: tuple[float, float], a: float) -> tuple[float, float]:
    c, s = math.cos(a), math.sin(a)
    return (c * p[0] - s * p[1], s * p[0] + c * p[1])


def cycloidal_tooth_points(cp: CycloidalGearParams, n_flank: int = 40, n_arc: int = 8) -> list[tuple[float, float]]:
    """One tooth as a closed wedge, centred on +Y (the frame every outline
    in this project uses): right flank from the root up (hypocycloid, then
    epicycloid from the pitch point), tip land arc, left flank mirrored,
    root arc. A tooth whose epicycloids cross before the addendum circle is
    trimmed to the point (a pointed tooth) rather than left self-crossing."""
    R, rg = cp.pitch_radius, cp.rolling_radius
    Ra, Rf = cp.addendum_radius, cp.dedendum_radius
    half = cp.circular_tooth_thickness / 2.0 / R  # half the tooth's angle at the pitch circle

    # monotonic-radius arcs: the epicycloid rises from R to R + 2 r_g over
    # t in [0, pi r_g / R]; the hypocycloid falls from R to R - 2 r_g over
    # t in [-pi r_g / R, 0] (cusps every 2 pi r_g / R, extremum midway)
    t_tip = _solve_radius(epicycloid_point, R, rg, Ra, 0.0, math.pi * rg / R)
    t_root = _solve_radius(hypocycloid_point, R, rg, Rf, -math.pi * rg / R, 0.0)
    if abs(math.hypot(*hypocycloid_point(R, rg, t_root)) - Rf) > 1e-6:
        # the root lies beyond the hypocycloid's reach (r_g too small): the
        # flank ends where the curve does and a radial step completes it
        t_root = -math.pi * rg / R

    # right flank, built in the tooth-on-+X frame with the flank at angle -half
    right: list[tuple[float, float]] = []
    for i in range(n_flank + 1):
        t = t_root * (1.0 - i / n_flank)
        right.append(_rot(hypocycloid_point(R, rg, t), -half))
    for i in range(1, n_flank + 1):
        t = t_tip * i / n_flank
        p = _rot(epicycloid_point(R, rg, t), -half)
        if math.atan2(p[1], p[0]) >= 0.0:
            # the flanks meet before the addendum circle: pointed tooth
            t_cross = _solve_angle_zero(R, rg, -half, t_tip * (i - 1) / n_flank, t)
            right.append(_rot(epicycloid_point(R, rg, t_cross), -half))
            break
        right.append(p)

    tip_r = right[-1]
    a_tip = math.atan2(tip_r[1], tip_r[0])
    tip_radius = math.hypot(*tip_r)
    tip: list[tuple[float, float]] = []
    if a_tip < -1e-12:
        for i in range(1, n_arc):
            a = a_tip + (-2.0 * a_tip) * i / n_arc
            tip.append((tip_radius * math.cos(a), tip_radius * math.sin(a)))
    left = [(x, -y) for (x, y) in reversed(right)]
    root_r = right[0]
    a_root = math.atan2(root_r[1], root_r[0])
    root: list[tuple[float, float]] = []
    for i in range(1, n_arc):
        a = -a_root - (-2.0 * a_root) * i / n_arc
        root.append((Rf * math.cos(a), Rf * math.sin(a)))
    pts = right + tip + left + root
    # into the tooth-on-+Y frame
    return [_rot(p, math.pi / 2.0) for p in pts]


def _solve_angle_zero(R: float, rg: float, offset: float, t_lo: float, t_hi: float) -> float:
    """t at which the offset epicycloid crosses angle 0 (bisection)."""
    for _ in range(80):
        t_mid = (t_lo + t_hi) / 2.0
        p = _rot(epicycloid_point(R, rg, t_mid), offset)
        if math.atan2(p[1], p[0]) >= 0.0:
            t_hi = t_mid
        else:
            t_lo = t_mid
    return (t_lo + t_hi) / 2.0


def cycloidal_gear_polygon(cp: CycloidalGearParams, n_flank: int = 40) -> Polygon:
    """The whole gear: z tooth wedges unioned with the root disk, minus the bore."""
    tooth = Polygon(cycloidal_tooth_points(cp, n_flank=n_flank))
    pitch_deg = 360.0 / cp.z
    pieces = [sh_rotate(tooth, k * pitch_deg, origin=(0, 0)) for k in range(cp.z)]
    Rf = cp.dedendum_radius
    disk = Polygon([(Rf * math.cos(2 * math.pi * i / 360), Rf * math.sin(2 * math.pi * i / 360)) for i in range(360)])
    gear = unary_union(pieces + [disk])
    if cp.bore_diameter_mm > 0:
        rb = cp.bore_diameter_mm / 2.0
        gear = gear.difference(Polygon([(rb * math.cos(2 * math.pi * i / 200), rb * math.sin(2 * math.pi * i / 200))
                                        for i in range(200)]))
    return gear


def cycloidal_gear_outline(cp: CycloidalGearParams, simplify_tolerance_mm: float = 0.005) -> list[tuple[float, float]]:
    poly = cycloidal_gear_polygon(cp)
    if poly.geom_type == "MultiPolygon":
        poly = max(poly.geoms, key=lambda g: g.area)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords


def build_cycloidal_gear_solid(cp: CycloidalGearParams, simplify_tolerance_mm: float = 0.005) -> bd.Part:
    """Straight extrusion of the outline (cycloidal gears are spur), bore cut."""
    pts = cycloidal_gear_outline(cp, simplify_tolerance_mm)
    closed = pts + [pts[0]]
    with bd.BuildPart() as part:
        with bd.BuildSketch():
            with bd.BuildLine():
                bd.Polyline(*closed)
            bd.make_face()
        bd.extrude(amount=cp.face_width_mm)
        if cp.bore_diameter_mm > 0:
            with bd.BuildSketch(part.faces().sort_by(bd.Axis.Z)[-1]):
                bd.Circle(cp.bore_diameter_mm / 2.0)
            bd.extrude(amount=-cp.face_width_mm, mode=bd.Mode.SUBTRACT)
    return part.part


def mate_params(cp: CycloidalGearParams, z_mate: int) -> CycloidalGearParams:
    """The conjugate gear: same module and the SAME rolling circle (each
    gear's addendum traced by the circle that traced the other's dedendum)."""
    return CycloidalGearParams(z=z_mate, module_mm=cp.module_mm,
                               rolling_circle_diameter_mm=2.0 * cp.rolling_radius,
                               addendum_coeff=cp.addendum_coeff, dedendum_coeff=cp.dedendum_coeff,
                               backlash_mm=cp.backlash_mm, face_width_mm=cp.face_width_mm,
                               bore_diameter_mm=cp.bore_diameter_mm)


def build_cycloidal_pair(cp: CycloidalGearParams, z_mate: int, phase_error_deg: float = 0.0):
    """Gear and its conjugate in mesh: gear at the origin (tooth on +Y), the
    mate at (0, R + R_mate, 0) presenting a space on its -Y side (half a
    pitch of rotation when z_mate is even). phase_error_deg is for tests."""
    mp = mate_params(cp, z_mate)
    g = build_cycloidal_gear_solid(cp)
    m = build_cycloidal_gear_solid(mp)
    spin = (180.0 / z_mate if z_mate % 2 == 0 else 0.0) + phase_error_deg
    m = m.rotate(bd.Axis.Z, spin).translate((0, cp.pitch_radius + mp.pitch_radius, 0))
    return g, m
