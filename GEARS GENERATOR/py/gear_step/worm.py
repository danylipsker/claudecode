"""
Worm and worm wheel.

A worm is, geometrically, a screw: a helical thread wrapped around a
cylinder. Its axial-section thread profile is a straight-sided trapezoid --
literally a rack tooth (a worm meshing with its wheel is mathematically a
rolled-up rack meshing with a gear), so the wheel's tooth profile is exactly
what involute.py already computes for a helical gear, given the right
module/helix-angle/hand -- reused unchanged, zero new tooth-shape code, same
as bevel gears reused the flat spur/helical machinery.

The worm ITSELF is new: a straight trapezoid, defined directly here (not via
rack_cutter_tooth_points, which encodes a cutting-tool-specific sign
convention -- writing this fresh, with the worm's own natural v-sign
convention (positive = outward, toward the addendum), avoids re-deriving
which sign means what a second time), swept helically. See
docs/gear-math.md section 9.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd

from involute import GearParams


@dataclass
class WormParams:
    starts: int                     # z1, number of thread starts (1-4 typical)
    axial_module_mm: float          # m -- module measured in the axial plane
    pitch_diameter_mm: float        # d1
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0     # ha*
    dedendum_coeff: float = 1.25    # hf*
    root_fillet_coeff: float = 0.2  # small fillet at the thread root
    length_mm: float = 30.0         # threaded length along the axis
    hand: str = "right"
    bore_diameter_mm: float = 0.0   # 0 = no bore

    @property
    def pitch_radius_mm(self) -> float:
        return self.pitch_diameter_mm / 2.0

    @property
    def axial_pitch_mm(self) -> float:
        """Distance between corresponding points of adjacent threads,
        measured along the axis (== circular pitch of the equivalent rack)."""
        return math.pi * self.axial_module_mm

    @property
    def lead_mm(self) -> float:
        """Axial advance per full turn: L = z1 * axial_pitch."""
        return self.starts * self.axial_pitch_mm

    @property
    def lead_angle_rad(self) -> float:
        """tan(lambda) = lead / (pi * d1) = z1*m/d1 -- the standard formula."""
        return math.atan2(self.lead_mm, math.pi * self.pitch_diameter_mm)

    @property
    def lead_angle_deg(self) -> float:
        return math.degrees(self.lead_angle_rad)

    @property
    def addendum_radius_mm(self) -> float:
        return self.pitch_radius_mm + self.addendum_coeff * self.axial_module_mm

    @property
    def dedendum_radius_mm(self) -> float:
        return self.pitch_radius_mm - self.dedendum_coeff * self.axial_module_mm

    @property
    def pressure_angle_rad(self) -> float:
        return math.radians(self.pressure_angle_deg)

    def wheel_gear_params(self, wheel_teeth: int) -> GearParams:
        """The mating worm wheel, modeled as a cylindrical helical gear (v1
        simplification -- a true throated/globoid wheel wraps around the worm
        for full-length contact; this is a flat-faced approximation, still
        correctly meshing in module/helix-angle/hand). Standard worm-gear
        relationship: wheel module (transverse, at the gear's own reference)
        equals the worm's axial module, and the wheel's helix angle equals
        the worm's lead angle; same hand for a 90deg-shaft pair."""
        return GearParams(
            z=wheel_teeth,
            module_mm=self.axial_module_mm,
            pressure_angle_deg=self.pressure_angle_deg,
            addendum_coeff=self.addendum_coeff,
            dedendum_coeff=self.dedendum_coeff,
            root_fillet_coeff=self.root_fillet_coeff,
            helix_angle_deg=self.lead_angle_deg,
            hand=self.hand,
        )

    @property
    def center_distance_mm(self) -> float:
        """Informational: mounting center distance for a given wheel tooth
        count is pitch_radius(worm) + pitch_radius(wheel) -- computed by the
        caller once it knows wheel_teeth, via wheel_gear_params(...).pitch_radius."""
        raise NotImplementedError("call with a specific wheel_teeth -- see center_distance()")

    def center_distance(self, wheel_teeth: int) -> float:
        return self.pitch_radius_mm + self.wheel_gear_params(wheel_teeth).pitch_radius


def thread_axial_profile(wp: WormParams, n_arc: int = 12) -> list[tuple[float, float]]:
    """One thread's closed 2D cross-section in the (u, v) axial half-plane:
    u = axial position (mm, centered on the thread), v = radial offset from
    the pitch radius, POSITIVE = outward/addendum (the worm's own natural
    sign convention -- not the cutting-tool convention used elsewhere in this
    project). Straight flanks at the pressure angle, small fillets at the
    root, flat land at the tip; symmetric trapezoid, matching a standard
    straight-sided (ISO "ZA"-type) worm thread."""
    alpha = wp.pressure_angle_rad
    ha = wp.addendum_coeff * wp.axial_module_mm
    hf = wp.dedendum_coeff * wp.axial_module_mm
    half_thick = wp.axial_pitch_mm / 4.0  # half of half-pitch: symmetric thread/space
    rho = wp.root_fillet_coeff * wp.axial_module_mm

    def half_u_at(v: float) -> float:
        # half-width narrows moving outward (toward +v/addendum), widens
        # moving inward (toward -v/dedendum) -- standard trapezoid taper
        return half_thick - v * math.tan(alpha)

    # root fillet: tangent to the flank and to the root land (v = -hf)
    v_center = -hf + rho
    u_flank_at_vcenter = half_u_at(v_center)
    u_center = u_flank_at_vcenter - rho / math.cos(alpha)
    v_tan = v_center + rho * math.sin(alpha)  # flank/fillet tangent point (going outward is +v)

    p_tan = (half_u_at(v_tan), v_tan)
    p_root = (u_center, v_center - rho)  # bottom of fillet, tangent to the flat root land
    a_start = math.atan2(p_tan[1] - v_center, p_tan[0] - u_center)
    a_end = math.atan2(p_root[1] - v_center, p_root[0] - u_center)
    if a_end > a_start:
        a_end -= 2 * math.pi
    if a_start - a_end > math.pi:
        a_end += 2 * math.pi

    right_path = [(half_u_at(ha), ha)]           # tip, right side
    right_path.append(p_tan)                      # down the flank to the fillet
    for i in range(1, n_arc + 1):
        a = a_start + (a_end - a_start) * i / n_arc
        right_path.append((u_center + rho * math.cos(a), v_center + rho * math.sin(a)))
    # right_path now ends at p_root; mirror for the left side (u -> -u), reversed
    left_path = [(-x, y) for (x, y) in reversed(right_path)]
    return right_path + left_path  # tip(+u) -> fillet -> root(u=u_center) -> root(-u_center) -> fillet -> tip(-u)


def profile_point_to_worm_3d(u: float, v: float, theta: float, pitch_radius: float, lead_mm: float,
                              phase: float = 0.0):
    """One (u, v) thread-profile point -> 3D point on the worm at rotation
    angle theta (radians) around the axis. u shifts axially WITH theta by the
    lead relationship (the defining property of a helix: one full turn
    advances exactly one lead) -- docs/gear-math.md section 9.2. Axis = +Z,
    worm centered at Z=0 for theta=0.

    phase (a second thread start, offset around the axis) is applied AFTER
    the Z/lead relationship, as a pure rotation of (X, Y) only -- folding it
    into theta before computing Z, as an earlier version of this function
    did, incorrectly shifts that thread's whole Z-range by lead*phase/(2*pi)
    (a real bug, caught by checking the built solid's bounding box against
    the requested length and finding it ~8mm too long/off-center for a
    2-start worm -- exactly consistent with a start offset by half the lead
    at phase=pi)."""
    radial = pitch_radius + v
    z = u + (lead_mm / (2 * math.pi)) * theta
    x = radial * math.cos(theta)
    y = radial * math.sin(theta)
    if phase:
        c, s = math.cos(phase), math.sin(phase)
        x, y = c * x - s * y, s * x + c * y
    return (x, y, z)


def worm_thread_stations(wp: WormParams, start_index: int = 0, n_per_turn: int = 40):
    """All stations (theta, list of 3D points) needed to loft one thread
    start's full helical sweep over the worm's length -- docs/gear-math.md
    9.2/9.3. n_per_turn sections per full revolution (dense enough that
    ruled=True straight segments between stations converge to the true helix,
    same "dense sampling of an exact construction" principle used
    throughout); more turns (a longer worm relative to its lead) means more
    stations, not a fixed count, so accuracy doesn't degrade for a long worm."""
    profile = thread_axial_profile(wp)
    lead = wp.lead_mm if wp.hand != "left" else -wp.lead_mm
    total_turns = wp.length_mm / wp.lead_mm  # full revolutions needed to cover the length
    total_theta = 2 * math.pi * total_turns
    n_stations = max(4, math.ceil(total_turns * n_per_turn))

    phase = start_index * (2 * math.pi / wp.starts)
    theta0 = -total_theta / 2.0  # center the thread on the worm's own Z=0

    stations = []
    for i in range(n_stations + 1):
        theta = theta0 + (total_theta) * i / n_stations
        pts3d = [profile_point_to_worm_3d(u, v, theta, wp.pitch_radius_mm, lead, phase=phase) for (u, v) in profile]
        stations.append(pts3d)
    return stations


def build_worm_solid(wp: WormParams, n_per_turn: int = 40) -> bd.Compound:
    """The worm as a solid: a core cylinder (root diameter) plus one ruled
    loft per thread start.

    This is a Compound, not a single boolean-fused Solid -- found (by
    actually timing it, not assumed) that OpenCASCADE's boolean fuse hangs
    (10+ minutes, killed rather than left running) when unioning multiple
    spiral thread solids together or onto an already-threaded body, even
    though each individual thread's loft alone takes about a second. Fusing
    one thread onto a plain cylinder core IS fast (~4s); it's specifically
    spiral-vs-spiral (or spiral-vs-already-spiralled) near-tangent surface
    intersection that OpenCASCADE's boolean algorithm struggles with here.
    A Compound of the unfused pieces sidesteps that entirely (effectively
    instant) and is still a valid, correct STL/STEP export -- SolidWorks
    opens it as a multi-body part rather than one fused solid body. The
    tradeoff: without the fuse merging away the touching internal faces, the
    exported file is larger than a true single-body part would be (bigger at
    higher n_per_turn) -- n_per_turn's default here is deliberately lower
    than full-accuracy would use, to keep that in check."""
    core = bd.Solid.make_cylinder(
        wp.dedendum_radius_mm, wp.length_mm, bd.Plane((0, 0, -wp.length_mm / 2)))
    if wp.bore_diameter_mm > 0:
        # Cylinder-minus-cylinder is a trivial, always-fast boolean op --
        # nothing like the spiral-vs-spiral case above -- so this one IS a
        # real subtract, not folded into the Compound.
        bore = bd.Solid.make_cylinder(
            wp.bore_diameter_mm / 2.0, wp.length_mm, bd.Plane((0, 0, -wp.length_mm / 2)))
        core = core.cut(bore)

    threads = []
    for k in range(wp.starts):
        stations = worm_thread_stations(wp, start_index=k, n_per_turn=n_per_turn)
        wires = [bd.Wire.make_polygon(pts, close=True) for pts in stations]
        threads.append(bd.Solid.make_loft(wires, ruled=True))

    return bd.Compound(children=[core, *threads])
