"""
Hyperboloidal gears -- skew-axis gears on their true pitch surfaces,
docs/gear-math.md section 24.

Two shafts at a shaft angle Sigma and a centre distance a (the common
perpendicular). The relative motion of the two gears is a screw about the
instantaneous screw axis (ISA), a fixed line skew to both shafts; each
gear's pitch surface is the ISA revolved about that gear's axis -- a
hyperboloid of one sheet with throat radius a_k and asymptotic angle
Sigma_k to the axis. The two hyperboloids touch along the whole ISA and
roll on each other across it while sliding along it. Crossed helical
gears (section 6) are these surfaces replaced by their throat cylinders,
hypoid gears (section 21) by cones; here the gears sit on the
hyperboloids themselves, with straight teeth along the generators.

PITCH GEOMETRY, in closed form. With i = z_2 / z_1 and the gears
counter-rotating about axes at Sigma:
    tan Sigma_1 = sin Sigma / (i + cos Sigma),   Sigma_2 = Sigma - Sigma_1,
    a_1 / a = (1 + i cos Sigma) / (1 + i^2 + 2 i cos Sigma).
At the throat gear k is a helical gear of helix angle Sigma_k, so the
normal module m_n is common and a_k = m_n z_k / (2 cos Sigma_k) -- the
two statements of a_1 agree (a test checks), and for Sigma = 90 deg the
throat radii are as 1 : i^2, for Sigma = 0 they are r_1 : r_2 of a
parallel pair.

GEAR 1 IS BUILT: its transverse section at the throat is the ordinary
involute gear of z_1 teeth, normal module m_n and helix angle Sigma_1
(section 4, the rack-generated outline with its fillets), and every
point of that outline moves along the straight line through it that is
tangent to its own circle and inclined at Sigma_1 to the axis -- the
generator, through that point, of the hyperboloid of that radius. A
point (r, theta) at the throat is at (r cos theta - s sin Sigma_1 sin
theta, r sin theta + s sin Sigma_1 cos theta, s cos Sigma_1) at
parameter s, linear in s, so the gear is the RULED loft between the
mapped outlines at the two faces (points paired by index): exact, one
solid, no boolean but the bore. Root and tip circles map onto their own
hyperboloids, r(z)^2 = r_0^2 + z^2 tan^2 Sigma_1.

GEAR 2 IS GENERATED from gear 1 (the hypoid pinion's and the throated
wheel's machinery, generation.py): its transverse station planes are
invariant under its own rotation, so each is pulled back through the
inverse of gear 1's placement in gear 2's rotating frame into gear 1's
static frame, gear 1 (built with its tip carried the root clearance
further out, so gear 2's roots clear gear 1's tips) is sectioned there
by MeshSectioner, one period of gear 1's turn with pitch folding is the
whole sweep, the wedge follows the space's measured centre (the teeth
lean by Sigma_2 across the face), and the z_2 spaces are cut from gear
2's tip-hyperboloid blank.

FRAMES. Gear 1's frame is the world: axis Z, throat plane z = 0. Gear
2's axis passes (a, 0, 0) with direction (0, sign sin Sigma, cos Sigma).
Gear 2 is built in its own frame (axis Z, throat z = 0, gear 1's axis on
its +X side) and placed by R_x(-sign Sigma) after a half-turn about Z,
then the translation (a, 0, 0) (place_gear2); a turn theta_1 of gear 1
goes with a turn -theta_1 / i of gear 2 about its own axis. The ISA
direction is (0, sign sin Sigma_1, cos Sigma_1) in gear 1's frame and
(0, sign sin Sigma_2, cos Sigma_2) in gear 2's -- the same construction
on both sides, which is what lets a constructed gear 2 be compared with
the generated one.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, replace

import build123d as bd
import numpy as np

from OCP.BRepOffsetAPI import BRepOffsetAPI_ThruSections

from shapely.geometry import Point, Polygon

from involute import GearParams, full_gear_outline, full_gear_polygon
from generation import MeshSectioner, sweep_stations, space_tool, cut_spaces

STATION_MARGIN_MM = 0.3


@dataclass
class HyperboloidalParams:
    z1: int = 16
    z2: int = 24
    shaft_angle_deg: float = 90.0
    normal_module_mm: float = 2.0
    pressure_angle_deg: float = 20.0
    face_width_mm: float = 0.0            # gear 1; 0 = auto: 6 m_n
    mate_face_width_mm: float = 0.0       # gear 2; 0 = auto: the contact line's reach, b_1 cos S_2 / cos S_1
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    hand: str = "right"
    bore_diameter_mm: float = 0.0
    mate_bore_diameter_mm: float = 0.0

    # ---- kinematics ----
    @property
    def ratio(self) -> float:
        return self.z2 / self.z1

    @property
    def sigma_rad(self) -> float:
        return math.radians(self.shaft_angle_deg)

    @property
    def sign(self) -> float:
        return 1.0 if self.hand != "left" else -1.0

    @property
    def sigma1_rad(self) -> float:
        i, s = self.ratio, self.sigma_rad
        return math.atan2(math.sin(s), i + math.cos(s))

    @property
    def sigma2_rad(self) -> float:
        return self.sigma_rad - self.sigma1_rad

    def sigma_k(self, member: int) -> float:
        return self.sigma1_rad if member == 1 else self.sigma2_rad

    # ---- sizes ----
    @property
    def m_n(self) -> float:
        return self.normal_module_mm

    @property
    def addendum(self) -> float:
        return self.addendum_coeff * self.m_n

    @property
    def dedendum(self) -> float:
        return self.dedendum_coeff * self.m_n

    @property
    def clearance(self) -> float:
        return self.dedendum - self.addendum

    def teeth(self, member: int) -> int:
        return self.z1 if member == 1 else self.z2

    def throat_radius(self, member: int) -> float:
        """The pitch hyperboloid's throat radius a_k = m_n z_k / (2 cos Sigma_k)."""
        return self.m_n * self.teeth(member) / (2.0 * math.cos(self.sigma_k(member)))

    @property
    def a1(self) -> float:
        return self.throat_radius(1)

    @property
    def a2(self) -> float:
        return self.throat_radius(2)

    @property
    def centre_distance(self) -> float:
        return self.a1 + self.a2

    @property
    def throat_fraction_kinematic(self) -> float:
        """a_1 / a from the screw axis alone: (1 + i cos S) / (1 + i^2 + 2 i cos S)."""
        i, c = self.ratio, math.cos(self.sigma_rad)
        return (1.0 + i * c) / (1.0 + i * i + 2.0 * i * c)

    def face_width(self, member: int) -> float:
        b1 = self.face_width_mm if self.face_width_mm > 0 else 6.0 * self.m_n
        if member == 1:
            return b1
        if self.mate_face_width_mm > 0:
            return self.mate_face_width_mm
        return b1 * math.cos(self.sigma2_rad) / math.cos(self.sigma1_rad)

    def bore(self, member: int) -> float:
        return self.bore_diameter_mm if member == 1 else self.mate_bore_diameter_mm

    def radius_at(self, member: int, r_throat: float, h: float) -> float:
        """The hyperboloid of throat radius r_throat and angle Sigma_k at height h."""
        return math.sqrt(r_throat ** 2 + (h * math.tan(self.sigma_k(member))) ** 2)

    def gear_params(self, member: int, tip_extension_mm: float = 0.0) -> GearParams:
        """The throat section: a helical gear of helix angle Sigma_k."""
        z, s = self.teeth(member), self.sigma_k(member)
        return GearParams.from_metric(z=z, module_mm=self.m_n, helix_angle_deg=math.degrees(s),
                                      pressure_angle_deg=self.pressure_angle_deg, face_width_mm=self.face_width(member),
                                      addendum_coeff=self.addendum_coeff + tip_extension_mm / self.m_n,
                                      dedendum_coeff=self.dedendum_coeff, bore_diameter_mm=0.0)

    def validate(self) -> None:
        if self.z1 < 4 or self.z2 < 4:
            raise ValueError("hyperboloidal: at least 4 teeth on each gear")
        if not (0.0 < self.shaft_angle_deg < 180.0):
            raise ValueError("hyperboloidal: the shaft angle must lie between 0 and 180 degrees")
        if self.sigma1_rad <= 0.0 or self.sigma2_rad <= 0.0:
            raise ValueError("hyperboloidal: the screw axis does not lie between the shafts")
        for k in (1, 2):
            if self.bore(k) > 0 and 0.5 * self.bore(k) >= self.throat_radius(k) - self.dedendum:
                raise ValueError("hyperboloidal: gear %d's bore reaches its root circle" % k)


# ---- the straight tooth along the generator -------------------------------

def generator_map(pts, sigma_rad: float, sign: float, s: float) -> list[tuple[float, float, float]]:
    """Every throat point carried along its own generator to parameter s."""
    k = s * sign * math.sin(sigma_rad)
    z = s * math.cos(sigma_rad)
    out = []
    for x, y in pts:
        r = math.hypot(x, y)
        out.append((x - k * y / r, y + k * x / r, z))
    return out


def throat_outline(hp: HyperboloidalParams, member: int, simplify_tolerance_mm: float = 0.02,
                   tip_extension_mm: float = 0.0) -> list[tuple[float, float]]:
    return [tuple(p) for p in full_gear_outline(hp.gear_params(member, tip_extension_mm), simplify_tolerance_mm=simplify_tolerance_mm)]


def ruled_loft_between_planar_stations(a, b) -> bd.Solid:
    """The ruled solid between two closed planar polylines, vertices paired
    by index (ThruSections, compatibility checking off, in solid mode so
    OpenCASCADE caps the planar ends with plane faces -- spiral_bevel's
    loft_through_stations fills its caps as free-form surfaces because a
    bevel station is not planar, which takes minutes and gigabytes on a
    whole-gear outline of hundreds of vertices)."""
    builder = BRepOffsetAPI_ThruSections(True, True)
    builder.CheckCompatibility(False)
    for pts in (a, b):
        builder.AddWire(bd.Wire.make_polygon(pts, close=True).wrapped)
    builder.Build()
    if not builder.IsDone() or builder.Shape().IsNull():
        raise RuntimeError("hyperboloidal: the ruled loft between the faces failed")
    solid = bd.Solid(builder.Shape())
    if not solid.is_valid:
        raise RuntimeError("hyperboloidal: the ruled loft is not a valid solid")
    return solid


def build_hyperboloidal_gear_solid(hp: HyperboloidalParams, member: int = 1, simplify_tolerance_mm: float = 0.02,
                                   tip_extension_mm: float = 0.0, face_extension_mm: float = 0.0) -> bd.Solid:
    """Gear `member` by construction: the ruled loft between the throat
    outline carried to the two faces along the generators; bored."""
    hp.validate()
    pts = throat_outline(hp, member, simplify_tolerance_mm, tip_extension_mm)
    sig = hp.sigma_k(member)
    half = 0.5 * hp.face_width(member) + face_extension_mm
    s_max = half / math.cos(sig)
    solid = ruled_loft_between_planar_stations(generator_map(pts, sig, hp.sign, -s_max), generator_map(pts, sig, hp.sign, s_max))
    bore = hp.bore(member)
    if bore > 0:
        solid = solid.cut(bd.Solid.make_cylinder(0.5 * bore, 2.0 * half + 2.0).moved(bd.Location((0.0, 0.0, -half - 1.0))))
    return solid


def blank_solid(hp: HyperboloidalParams, member: int) -> bd.Part:
    """The tip hyperboloid between the faces (a spline through the
    hyperbola, revolved), bored."""
    b = hp.face_width(member)
    r_a = hp.throat_radius(member) + hp.addendum
    hs = np.linspace(-0.5 * b, 0.5 * b, 25)
    r_in = 0.5 * hp.bore(member)
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Line((r_in, -0.5 * b), (hp.radius_at(member, r_a, -0.5 * b), -0.5 * b))
                bd.Spline(*[(hp.radius_at(member, r_a, h), h) for h in hs])
                bd.Line((hp.radius_at(member, r_a, 0.5 * b), 0.5 * b), (r_in, 0.5 * b))
                bd.Line((r_in, 0.5 * b), (r_in, -0.5 * b))
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    return part.part


# ---- frames ---------------------------------------------------------------

def place_gear2(solid, hp: HyperboloidalParams, gear1_turn_deg: float = 0.0):
    """Gear 2 (its own frame) turned by -theta_1 / i about its own axis and
    set on its axis: a half-turn about Z, R_x(-sign Sigma), then (a, 0, 0)."""
    return (solid.rotate(bd.Axis.Z, -gear1_turn_deg / hp.ratio)
                 .rotate(bd.Axis.Z, 180.0)
                 .rotate(bd.Axis.X, -hp.sign * hp.shaft_angle_deg)
                 .translate((hp.centre_distance, 0.0, 0.0)))


def _rot_x(a: float) -> np.ndarray:
    c, s = math.cos(a), math.sin(a)
    return np.array([[1.0, 0.0, 0.0], [0.0, c, -s], [0.0, s, c]])


def _rot_z(a: float) -> np.ndarray:
    c, s = math.cos(a), math.sin(a)
    return np.array([[c, -s, 0.0], [s, c, 0.0], [0.0, 0.0, 1.0]])


def _m2(hp: HyperboloidalParams) -> tuple[np.ndarray, np.ndarray]:
    """place_gear2's rotation and translation (gear 2 frame -> world)."""
    return _rot_x(-hp.sign * hp.sigma_rad) @ _rot_z(math.pi), np.array([hp.centre_distance, 0.0, 0.0])


def isa_direction(hp: HyperboloidalParams) -> np.ndarray:
    """The screw axis's direction in gear 1's frame."""
    s1 = hp.sigma1_rad
    return np.array([0.0, hp.sign * math.sin(s1), math.cos(s1)])


def station_plane_in_gear1_frame(hp: HyperboloidalParams, h: float, gear1_turn_rad: float) -> bd.Plane:
    """Gear 2's station plane Z = h at gear-1 turn theta_1, in gear 1's
    static frame, its axes gear 2's carried through the same map: gear 1
    sits in gear 2's rotating frame at T = R_Z(-theta_2) M2^-1 R_Z(theta_1)
    with theta_2 = -theta_1 / i; the plane is pulled back by T^-1 =
    R_Z(-theta_1) M2 R_Z(theta_2)."""
    theta2 = -gear1_turn_rad / hp.ratio
    R, t = _m2(hp)
    lin = _rot_z(-gear1_turn_rad) @ R @ _rot_z(theta2)
    origin = _rot_z(-gear1_turn_rad) @ (R @ (_rot_z(theta2) @ np.array([0.0, 0.0, h])) + t)
    return bd.Plane(origin=tuple(origin), x_dir=tuple(lin @ np.array([1.0, 0.0, 0.0])), z_dir=tuple(lin @ np.array([0.0, 0.0, 1.0])))


# ---- gear 2, generated ----------------------------------------------------

CUTTER_ROOT_OVERLAP_MM = 1.0
CUTTER_FACE_EXTENSION_MM = 0.0


def cutter_tooth_outlines(hp: HyperboloidalParams, simplify_tolerance_mm: float = 0.02) -> list[list[tuple[float, float]]]:
    """Gear 1's z_1 teeth, each on its own: the throat outline with the tips
    carried the clearance further out, clipped to the tooth's pitch wedge
    (0.96 of a pitch, so neighbours never touch) and to the annulus from
    CUTTER_ROOT_OVERLAP_MM below the root circle. Teeth alone, as the
    globoid hob is threads alone: the whole gear's root land, 0.2 mm above
    the root circle where gear 2's clip disc ends, is nearly all material
    and swept gear 2's rim band into one ring (679 % of the pitch)."""
    gp = hp.gear_params(1, tip_extension_mm=hp.clearance)
    gear = full_gear_polygon(gp)
    if not gear.is_valid:
        gear = gear.buffer(0)
    r_f = gp.dedendum_radius
    r_in = r_f - CUTTER_ROOT_OVERLAP_MM
    # Below r_keep -- the clearance above the root circle, where gear 2's tip
    # surface passes and beyond which gear 1's material never enters gear
    # 2's blank -- the real fillets are replaced by a sector of the tooth's
    # width at r_keep: the fillets flare to nearly the whole pitch just above
    # the root circle, and that flare, swept, ran the neighbouring spaces'
    # regions together in the margin beyond gear 2's tip (98 % of the pitch
    # at the clip disc, 85 % at the tip itself).
    r_keep = r_f + 0.9 * hp.clearance
    ring = Point(0, 0).buffer(r_keep + 0.01, quad_segs=1440).difference(Point(0, 0).buffer(r_keep - 0.01, quad_segs=1440))
    outside = Point(0, 0).buffer(gp.addendum_radius + 2.0, quad_segs=720).difference(Point(0, 0).buffer(r_keep, quad_segs=1440))
    pitch = 2.0 * math.pi / hp.z1
    teeth = []
    for k in range(hp.z1):
        c = math.pi / 2.0 + k * pitch                      # full_gear_polygon centres tooth 0 on +Y
        rr = 4.0 * gp.addendum_radius
        wedge = Polygon([(0.0, 0.0)] + [(rr * math.cos(a), rr * math.sin(a)) for a in np.linspace(c - 0.48 * pitch, c + 0.48 * pitch, 12)])
        upper = gear.intersection(wedge).intersection(outside)
        foot = gear.intersection(wedge).intersection(ring)
        fx, fy = np.array(foot.convex_hull.exterior.coords).T
        ang = np.unwrap(np.arctan2(fy, fx) - c) + c
        lo, hi = float(ang.min()), float(ang.max())
        sector = Polygon([(r_in * math.cos(a), r_in * math.sin(a)) for a in np.linspace(lo, hi, 8)] +
                         [((r_keep + 0.05) * math.cos(a), (r_keep + 0.05) * math.sin(a)) for a in np.linspace(hi, lo, 8)])
        tooth = upper.union(sector)
        if tooth.geom_type != "Polygon":
            raise RuntimeError("hyperboloidal: tooth %d of the cutter came out in pieces" % k)
        if simplify_tolerance_mm > 0:
            tooth = tooth.simplify(simplify_tolerance_mm, preserve_topology=True)
        pts = list(tooth.exterior.coords)
        if pts and pts[0] == pts[-1]:
            pts = pts[:-1]
        teeth.append([tuple(p) for p in pts])
    return teeth


def cutter_sectioner(hp: HyperboloidalParams, simplify_tolerance_mm: float = 0.02, mesh_tolerance: float = 0.005) -> MeshSectioner:
    """Gear 1's teeth as the hob (cutter_tooth_outlines), each carried along
    the generators CUTTER_FACE_EXTENSION_MM past both faces (gear 2's
    margin station beyond its face maps onto gear 1 beyond gear 1's face,
    and a cutter ending there sliced that station's sweep into pieces),
    tessellated once."""
    sig = hp.sigma1_rad
    s_max = (0.5 * hp.face_width(1) + CUTTER_FACE_EXTENSION_MM) / math.cos(sig)
    solids = [ruled_loft_between_planar_stations(generator_map(pts, sig, hp.sign, -s_max), generator_map(pts, sig, hp.sign, s_max))
              for pts in cutter_tooth_outlines(hp, simplify_tolerance_mm)]
    return MeshSectioner(solids, mesh_tolerance)


def gear1_turns_rad(hp: HyperboloidalParams, n_positions: int) -> np.ndarray:
    """One period of gear 1, 2 pi / z_1, end excluded (pitch folding does the rest)."""
    period = 2.0 * math.pi / hp.z1
    return -0.5 * period + period * np.arange(n_positions) / n_positions


def gear2_stations(hp: HyperboloidalParams, n_stations: int):
    b, margin = hp.face_width(2), STATION_MARGIN_MM
    z_st = [-0.5 * b - margin + (b + 2.0 * margin) * k / (n_stations - 1) for k in range(n_stations)]
    r_a = hp.a2 + hp.addendum
    return z_st, [hp.radius_at(2, r_a, h) + margin for h in z_st]


def gear2_space_sections(hp: HyperboloidalParams, cutter, z_stations, disc_radii, n_positions: int, fold_copies: int = 3):
    turns = gear1_turns_rad(hp, n_positions)
    pitch = 2.0 * math.pi / hp.z2
    return sweep_stations(cutter, lambda h, t: station_plane_in_gear1_frame(hp, h, t), list(z_stations), list(disc_radii), turns,
                          pitch, fold_copies, 0.5 * pitch)


def build_generated_gear2_solid(hp: HyperboloidalParams, n_positions: int = 96, n_stations: int = 13, n_profile: int = 80,
                                cutter=None, simplify_tolerance_mm: float = 0.02):
    """Gear 2 in its own frame: its tip-hyperboloid blank minus z_2 copies
    of the one space gear 1 sweeps."""
    hp.validate()
    cutter = cutter if cutter is not None else cutter_sectioner(hp, simplify_tolerance_mm)
    z_st, radii = gear2_stations(hp, n_stations)
    sections = gear2_space_sections(hp, cutter, z_st, radii, n_positions)
    tool = space_tool(sections, radii, z_st, n_profile)
    return cut_spaces(blank_solid(hp, 2), tool, hp.z2)


def build_hyperboloidal_pair(hp: HyperboloidalParams, gear1_turn_deg: float = 0.0, phase_error_deg: float = 0.0,
                             n_positions: int = 96, n_stations: int = 13, n_profile: int = 80, simplify_tolerance_mm: float = 0.02):
    """(gear 1, gear 2) in gear 1's frame, in mesh for gear 1 turned by
    gear1_turn_deg (plus phase_error_deg on gear 2 for a deliberate mis-mesh)."""
    gear1 = build_hyperboloidal_gear_solid(hp, 1, simplify_tolerance_mm).rotate(bd.Axis.Z, gear1_turn_deg)
    gear2 = build_generated_gear2_solid(hp, n_positions, n_stations, n_profile, simplify_tolerance_mm=simplify_tolerance_mm)
    return gear1, place_gear2(gear2.rotate(bd.Axis.Z, phase_error_deg), hp, gear1_turn_deg)
