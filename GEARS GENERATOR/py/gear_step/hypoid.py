"""
Hypoid gears: a spiral bevel gear driven by a pinion whose axis does NOT
meet the gear's -- it passes it at the hypoid offset E. docs/gear-math.md
section 21.

The gear is this project's own spiral bevel gear (spiral_bevel.py),
unchanged. Everything hypoid lives in the pinion:

  1. Its pitch geometry (HypoidPitchGeometry) -- pitch angle, spiral angle,
     mean radius, apex and axis -- follows from three conditions at the
     mean point M where the two pitch cones touch: the pinion axis makes the
     shaft angle (90 deg) with the gear axis; it passes the gear axis at
     distance E; and the two teeth advance at the same rate across their
     common tooth trace (equal normal pitch), which for a hypoid means the
     pinion's spiral angle exceeds the gear's and the pinion is LARGER than
     the same-ratio bevel pinion -- the whole point of a hypoid.  With the
     spiral-angle difference delta = psi_g - psi_p as the one unknown the
     three conditions close in closed form (docs 21.1):

         tan(gamma_p) = cos(delta) / tan(gamma_g)                 (shaft angle)
         r_p = r_g (n/N) cos(psi_g) / cos(psi_p)                  (normal pitch)
         E = sin(delta) [ r_g cos(gamma_p) + r_p cos(gamma_g) ]   (offset)

     the last a single equation in delta, solved by bracketing.  Checked
     independently in 3-D (tests): the resulting axis is exactly E from the
     gear axis, exactly 90 deg to it, and the turn rate the tooth-normal
     velocities at M demand comes out at exactly N/n.

  2. Its tooth surfaces are GENERATED: the pinion is the envelope of the
     real gear (the built spiral bevel solid, tooth by tooth) under the
     offset relative motion -- gear turning about its axis, pinion turning
     N/n times as fast about its own -- exactly as the face gear is the
     envelope of its shaper (face_gear.py).  A hypoid pinion is not a
     spiral bevel pinion with different numbers: no closed-form tooth
     surface is conjugate to a spiral bevel gear across an offset, which is
     why real hypoid pinions are generated too.  Sections are taken on
     planes perpendicular to the pinion axis, which the pinion's own
     rotation leaves invariant -- so per phase only the gear moves, and the
     section is the static gear cut by a plane turned the other way about
     the gear axis.  One tooth space (one gear tooth swept through its whole
     engagement) is lofted through those sections, patterned n times and
     cut from a tip-cone blank, then the pair is verified solid by solid
     the way every generated family here is: sliver contact in mesh,
     collision half a pitch off.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
import numpy as np
from scipy.optimize import brentq
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

from bevel import flat_point_to_cone
from spiral_bevel import SpiralBevelParams, build_spiral_bevel_gear_solid, flat_tooth_coords, loft_through_stations
from face_gear import loft_solid, slim_edge_curves
from generation import rot_z, section_triangles, one_piece, tidy, space_wires, cut_spaces


@dataclass
class HypoidParams:
    z: int                                # gear teeth N
    pinion_teeth: int                     # n
    module_mm: float                      # gear heel (outer) module, as bevel
    offset_mm: float = 0.0                # E, the hypoid offset (0 = an ordinary spiral bevel pair)
    spiral_angle_deg: float = 35.0        # the GEAR's mean spiral angle psi_g; the pinion's follows
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38
    face_width_mm: float = 10.0           # gear face width
    cutter_radius_mm: float = 0.0
    hand: str = "right"                   # gear hand (pinion opposite)
    bore_diameter_mm: float = 0.0         # gear bore
    pinion_bore_diameter_mm: float = 0.0
    pinion_addendum_coeff: float = 0.0    # 0 = auto: the gear's dedendum less the clearance (= addendum_coeff)

    def gear_params(self) -> SpiralBevelParams:
        return SpiralBevelParams(
            z=self.z, module_mm=self.module_mm, mate_teeth=self.pinion_teeth, shaft_angle_deg=90.0,
            pressure_angle_deg=self.pressure_angle_deg, addendum_coeff=self.addendum_coeff,
            dedendum_coeff=self.dedendum_coeff, root_fillet_coeff=self.root_fillet_coeff,
            face_width_mm=self.face_width_mm, bore_diameter_mm=self.bore_diameter_mm,
            spiral_angle_deg=self.spiral_angle_deg, cutter_radius_mm=self.cutter_radius_mm, hand=self.hand)

    @property
    def pinion_addendum_coefficient(self) -> float:
        return self.pinion_addendum_coeff if self.pinion_addendum_coeff > 0 else self.addendum_coeff

    def pitch_geometry(self) -> "HypoidPitchGeometry":
        return solve_pitch_geometry(self)


@dataclass
class HypoidPitchGeometry:
    """Everything about the pinion's pitch cone and axis, in the gear's
    frame (apex at the origin, gear axis +Z, mean point M in the +X half of
    the XZ plane -- bevel.py's conventions)."""
    gamma_g: float          # gear pitch angle, rad
    gamma_p: float          # pinion pitch angle, rad
    psi_g: float            # gear mean spiral angle, rad
    psi_p: float            # pinion mean spiral angle, rad
    delta: float            # psi_g - psi_p, rad (negative for a hypoid: the pinion's spiral angle is larger)
    A_m: float              # gear mean cone distance
    A_mp: float             # pinion mean cone distance
    r_g: float              # gear mean pitch radius
    r_p: float              # pinion mean pitch radius
    mean_module: float      # the gear's module at M
    M: np.ndarray           # mean point
    P_apex: np.ndarray      # pinion pitch-cone apex
    a_p: np.ndarray         # pinion axis direction (apex -> into the pinion body), unit
    e_x: np.ndarray         # pinion local +X (from the axis toward M), unit
    e_y: np.ndarray         # pinion local +Y = a_p x e_x
    omega_ratio: float      # pinion turn per gear turn, signed (about a_p per about +Z)
    offset_signed: float    # E with its sign about the gear frame's +Y

    @property
    def local_plane(self) -> bd.Plane:
        """The pinion's own frame as a build123d Plane: local coordinates
        (apex at the origin, axis +Z, M on +X) -> gear frame."""
        return bd.Plane(origin=tuple(self.P_apex), x_dir=tuple(self.e_x), z_dir=tuple(self.a_p))

    @property
    def pinion_axis(self) -> bd.Axis:
        return bd.Axis(tuple(self.P_apex), tuple(self.a_p))

    def z_local(self, point) -> float:
        return float(np.dot(np.asarray(point, dtype=float) - self.P_apex, self.a_p))


def solve_pitch_geometry(hp: HypoidParams) -> HypoidPitchGeometry:
    gp = hp.gear_params()
    gamma_g = gp.pitch_angle_rad
    A_o = gp.outer_cone_distance
    A_m = gp.mean_cone_distance
    r_g = A_m * math.sin(gamma_g)
    psi_g = math.radians(hp.spiral_angle_deg)
    N, n = hp.z, hp.pinion_teeth
    h = 1.0 if hp.hand != "left" else -1.0

    def parts(d):
        gamma_p = math.atan(math.cos(d) / math.tan(gamma_g))
        psi_p = psi_g - d
        r_p = r_g * (n / N) * math.cos(psi_g) / math.cos(psi_p)
        return gamma_p, psi_p, r_p

    def offset_mag(d):
        gamma_p, psi_p, r_p = parts(d)
        return abs(math.sin(d) * (r_g * math.cos(gamma_p) + r_p * math.cos(gamma_g)))

    E = hp.offset_mm
    if E < 0:
        raise ValueError("hypoid: the offset is a distance; the side follows from the gear's hand")
    if E == 0:
        d = 0.0
    else:
        # the useful branch is delta < 0 (pinion spiral angle larger than the
        # gear's); the offset grows monotonically with |delta|.  The formulas
        # keep producing pinions right up to a 90 deg spiral angle (an
        # 8-metre-radius one, at that), so the cap is a design one: pinion
        # spiral angles beyond ~75 deg are outside any hypoid practice
        # (Gleason's typical 45-60), and for a usual pair that cap lands the
        # largest offset near 0.4 gear pitch diameters, itself generous.
        d_max = -max(math.radians(75.0) - psi_g, 0.01)
        if offset_mag(d_max) < E:
            raise ValueError(f"hypoid: offset {E:.2f} mm is beyond what this pair can take "
                             f"(max about {offset_mag(d_max):.2f} mm, where the pinion spiral angle reaches 75 deg)")
        d = brentq(lambda x: offset_mag(x) - E, d_max, -1e-12)
    gamma_p, psi_p, r_p = parts(d)
    A_mp = r_p / math.sin(gamma_p)

    g_g = np.array([math.sin(gamma_g), 0.0, math.cos(gamma_g)])       # gear generator at M, apex -> M
    c_g = np.array([0.0, 1.0, 0.0])                                    # gear circumferential at M
    n_g = np.array([math.cos(gamma_g), 0.0, -math.sin(gamma_g)])      # common tangent plane's normal (out of the gear)
    g_p = math.cos(d) * g_g + h * math.sin(d) * c_g                    # pinion generator: the gear's turned by delta in the tangent plane
    a_p = math.cos(gamma_p) * g_p + math.sin(gamma_p) * n_g            # pinion axis, apex -> into the pinion
    M = A_m * g_g
    P_apex = M - A_mp * g_p
    e_x = math.sin(gamma_p) * g_p - math.cos(gamma_p) * n_g            # from the axis toward M, unit
    e_y = np.cross(a_p, e_x)
    # the pinion's turn per gear turn: equal velocity components across the
    # common tooth trace at M (along the trace they differ -- that is the
    # hypoid's lengthwise sliding)
    t = math.cos(psi_g) * g_g + h * math.sin(psi_g) * c_g
    n_t = np.cross(t, n_g)
    v_g = np.cross([0.0, 0.0, 1.0], M)
    v_p_unit = np.cross(a_p, M - P_apex)
    omega_ratio = float(np.dot(v_g, n_t) / np.dot(v_p_unit, n_t))
    offset_signed = float(h * math.sin(d) * (r_g * math.cos(gamma_p) + r_p * math.cos(gamma_g)))
    return HypoidPitchGeometry(gamma_g=gamma_g, gamma_p=gamma_p, psi_g=psi_g, psi_p=psi_p, delta=d, A_m=A_m, A_mp=A_mp,
                               r_g=r_g, r_p=r_p, mean_module=hp.module_mm * A_m / A_o, M=M, P_apex=P_apex, a_p=a_p,
                               e_x=e_x, e_y=e_y, omega_ratio=omega_ratio, offset_signed=offset_signed)


# --------------------------------------------------------------------------
# the pinion blank (local frame: apex at the origin, axis +Z)
# --------------------------------------------------------------------------

def pinion_tip_cone_angle(hp: HypoidParams, geo: HypoidPitchGeometry) -> float:
    """The pinion's tip cone opens wider than its pitch cone by the addendum
    -- proportional to cone distance, as on every bevel gear here."""
    k = hp.pinion_addendum_coefficient * geo.mean_module / geo.A_mp
    return math.atan2(math.sin(geo.gamma_p) + k * math.cos(geo.gamma_p), math.cos(geo.gamma_p) - k * math.sin(geo.gamma_p))


def pinion_face_z_range(hp: HypoidParams, geo: HypoidPitchGeometry) -> tuple[float, float]:
    """Where along its axis the pinion has teeth: between the gear's toe and
    heel pitch points as they pass the mean point.  (The real gear's reach
    fades over the last half-millimetre at each end -- its tooth ends on
    its own toe and heel -- which is why the pinion is generated from an
    EXTENDED copy of the gear tooth, extended_gear_tooth: cut for real
    right out to the tool's overshoot, no inset, no extrapolation.)"""
    gp = hp.gear_params()
    g_g = np.array([math.sin(geo.gamma_g), 0.0, math.cos(geo.gamma_g)])
    z_toe = geo.z_local((gp.outer_cone_distance - gp.face_width_mm) * g_g)
    z_heel = geo.z_local(gp.outer_cone_distance * g_g)
    return min(z_toe, z_heel), max(z_toe, z_heel)


def extended_gear_tooth(gp: SpiralBevelParams, extension: float = 0.2, n_stations: int = 14, n_phi: int = 240,
                        simplify_tolerance_mm: float = 0.02) -> bd.Solid:
    """Gear tooth 0 continued `extension` face widths past its toe and past
    its heel -- the same flank surface (the spiral bevel's station mapping
    holds at any cone distance: the profile scales with it, the trace
    offset follows the same arc), just lofted over a longer range at the
    same station spacing.  This is what generates the pinion, so the
    pinion's flanks continue as conjugate surfaces beyond where the real
    gear's tooth ends -- exactly what a cutter does to a real pinion -- and
    every station of the pinion, out to the tool's overshoot past its own
    end planes, is cut to full depth.  Tried first and dropped: insetting
    the pinion face (the gear's reach fades over ~0.6 mm at the toe and
    ~0.3 mm at the heel, measured at the pitch circle) and extrapolating
    the end sections point-wise (0.2-1.4 mm errors: arc-length
    correspondence slides along the flank between stations -- section 17's
    index-wander lesson -- so a point is not the same feature one station
    on).  The real gear, not this one, does the meshing check."""
    coords = flat_tooth_coords(gp, n_phi, simplify_tolerance_mm)
    gamma, re, F = gp.pitch_angle_rad, gp.outer_cone_distance, gp.face_width_mm
    s0, s1 = re - F * (1.0 + extension), re + F * extension
    stations = []
    for i in range(n_stations):
        s = s0 + (s1 - s0) * i / (n_stations - 1)
        off = gp.trace_offset_rad(s)
        stations.append([flat_point_to_cone(x, y, s, gamma, re, gp.heel_pitch_radius, off) for (x, y) in coords])
    return loft_through_stations(stations)


def pinion_blank_local(hp: HypoidParams, geo: HypoidPitchGeometry) -> bd.Part:
    """Tip-cone frustum between planes perpendicular to the axis (as
    bevel.py's root_cone_profile bounds its blanks), bore included."""
    z_lo, z_hi = pinion_face_z_range(hp, geo)
    tan_tip = math.tan(pinion_tip_cone_angle(hp, geo))
    r_in = hp.pinion_bore_diameter_mm / 2.0
    pts = [(r_in, z_lo), (z_lo * tan_tip, z_lo), (z_hi * tan_tip, z_hi), (r_in, z_hi)]
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    return part.part


# --------------------------------------------------------------------------
# generation: the gear swept past a plane fixed to the pinion
# --------------------------------------------------------------------------

def sweep_half_range_deg(tooth: bd.Solid, geo: HypoidPitchGeometry, z_lo: float, z_hi: float, r_max: float) -> float:
    """How far (gear degrees, either way from the mean position) gear tooth
    0 has to be swept before it is wholly clear of the pinion blank's
    bounding sphere -- found by turning its bounding box, not assumed."""
    bb = tooth.bounding_box()
    corners = np.array([[x, y, z] for x in (bb.min.X, bb.max.X) for y in (bb.min.Y, bb.max.Y) for z in (bb.min.Z, bb.max.Z)])
    centre = geo.P_apex + 0.5 * (z_lo + z_hi) * geo.a_p
    radius = math.hypot(r_max, 0.5 * (z_hi - z_lo)) + 1.0
    for deg in range(1, 180):
        clear = True
        for sign in (1.0, -1.0):
            pts = corners @ rot_z(sign * deg).T
            lo, hi = pts.min(axis=0), pts.max(axis=0)
            nearest = np.clip(centre, lo, hi)
            if np.linalg.norm(nearest - centre) <= radius:
                clear = False
        if clear:
            return float(deg + 1)
    return 90.0


def space_sections(hp: HypoidParams, geo: HypoidPitchGeometry, gear_tooth: bd.Solid, z_stations: list[float],
                   disc_radii: list[float], n_positions: int, tolerance: float = 0.005) -> list[Polygon]:
    """One pinion tooth space, station by station (planes perpendicular to
    the pinion axis at z_stations, in the pinion's own frame): the union
    over the sweep of gear tooth 0's cross-sections there, clipped to a
    disc a little outside the blank.  The plane is fixed to the pinion, so
    at gear phase t it is the static gear cut by the plane turned by -t
    about the gear axis; the section, read in that plane's own axes, is
    then turned by the pinion's own -omega_ratio*t to land in the pinion
    frame."""
    half_deg = sweep_half_range_deg(gear_tooth, geo, min(z_stations), max(z_stations), max(disc_radii))
    phases = np.linspace(-half_deg, half_deg, n_positions)
    sections = []
    for z_i, R_i in zip(z_stations, disc_radii):
        C_i = geo.P_apex + z_i * geo.a_p
        tris = []
        for t in phases:
            R = rot_z(-t)
            plane = bd.Plane(origin=tuple(R @ C_i), x_dir=tuple(R @ geo.e_x), z_dir=tuple(R @ geo.a_p))
            theta = -math.radians(geo.omega_ratio * t)
            c, s = math.cos(theta), math.sin(theta)
            for tri in section_triangles(gear_tooth, plane, R_i + 1.0, tolerance):
                tris.append(Polygon([(c * u - s * v, s * u + c * v) for u, v in tri]))
        if not tris:
            sections.append(Polygon())
            continue
        # clip to the disc FIRST: the sweep's outlying crumbs (a grazing
        # phase's sliver at r = 15 outside a 13.25 blank) are no concern
        # of the pinion's; only what is left inside the disc has to be one piece
        disc = Point(0.0, 0.0).buffer(R_i, quad_segs=720)
        sections.append(tidy(one_piece(unary_union(tris).intersection(disc), z_i, "clipped")))
    return sections


def hypoid_pinion_local(hp: HypoidParams, n_positions: int = 120, n_stations: int = 8, n_profile: int = 80,
                        n_phi: int = 240, simplify_tolerance_mm: float = 0.02, gear=None, fuse: bool = True):
    """The generated pinion in its own frame (apex at the origin, axis +Z,
    tooth space 0 centred on +X): tip-cone blank minus n patterned copies
    of the lofted space, one N-ary cut (sequential fallback), edge curves
    slimmed for STEP.  `gear` may be passed to reuse an already-built gear."""
    geo = hp.pitch_geometry()
    # fuse=False keeps the gear a compound of blank + teeth: the conjugacy checks
    # intersect it solid by solid (seconds), where one 800-face gear
    # against the pinion takes minutes per phase
    gear = gear if gear is not None else build_spiral_bevel_gear_solid(hp.gear_params(), n_stations=10, n_phi=n_phi,
                                                                       simplify_tolerance_mm=simplify_tolerance_mm, fuse=fuse)
    # the generating tooth: gear tooth 0 (centred on +X at the mean point,
    # where the pinion's space must be) continued past both ends of the
    # gear's face, so the pinion is cut for real out to the tool's overshoot
    tooth0 = extended_gear_tooth(hp.gear_params(), n_phi=n_phi, simplify_tolerance_mm=simplify_tolerance_mm)
    z_lo, z_hi = pinion_face_z_range(hp, geo)
    tan_tip = math.tan(pinion_tip_cone_angle(hp, geo))
    margin = 0.5
    z_st = [z_lo - margin + (z_hi - z_lo + 2.0 * margin) * i / (n_stations - 1) for i in range(n_stations)]
    radii = [z * tan_tip + margin for z in z_st]
    sections = space_sections(hp, geo, tooth0, z_st, radii, n_positions)
    cutter = loft_solid(space_wires(sections, radii, z_st, n_profile))
    if not cutter.is_valid:
        raise RuntimeError("hypoid: the lofted space tool is not a valid solid")
    pinion = cut_spaces(pinion_blank_local(hp, geo), cutter, hp.pinion_teeth)
    return pinion, geo, gear


def place_hypoid_pinion(pinion_local, geo: HypoidPitchGeometry, gear_turn_deg: float = 0.0, phase_error_deg: float = 0.0):
    """The pinion from its own frame into the gear's, in mesh for the gear
    turned by gear_turn_deg: spun about its own axis by omega_ratio times
    that (plus phase_error_deg, for the tests' deliberate mis-mesh)."""
    placed = pinion_local.moved(bd.Location(geo.local_plane))
    return placed.rotate(geo.pinion_axis, geo.omega_ratio * gear_turn_deg + phase_error_deg)


def build_hypoid_pair(hp: HypoidParams, gear_turn_deg: float = 0.0, phase_error_deg: float = 0.0,
                      n_positions: int = 120, n_stations: int = 8, n_profile: int = 80,
                      n_phi: int = 240, simplify_tolerance_mm: float = 0.02, fuse: bool = True):
    """(gear, pinion) in mesh, the gear turned by gear_turn_deg about +Z."""
    pinion_local, geo, gear = hypoid_pinion_local(hp, n_positions, n_stations, n_profile, n_phi, simplify_tolerance_mm, fuse=fuse)
    return gear.rotate(bd.Axis.Z, gear_turn_deg), place_hypoid_pinion(pinion_local, geo, gear_turn_deg, phase_error_deg)
