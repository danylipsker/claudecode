"""
Face gears: a spur pinion on an axis perpendicular to (and intersecting)
the axis of a disc gear whose teeth are cut into its face. docs/gear-math.md
section 17.

The pinion's pitch cylinder rolls on the face gear's pitch PLANE, so the
face gear has no pitch cone or cylinder of its own: its tooth changes shape
along the radius (thinner and eventually pointed toward the outer end,
undercut toward the inner end), and its tooth surface is not a formula but
the ENVELOPE of the shaper pinion's involute flanks under the generating
motion -- the shaper turning about its own axis by theta_s while the face
gear turns about its axis by theta_f = theta_s z_s / z_f (rolling without
slip at the nominal radius R_0 = m z_f / 2, where the pinion's pitch circle
speed matches the face gear's).

This module builds that envelope literally -- the union of the shaper's
positions -- but in 2D, one radial station at a time: in the face gear's
frame the shaper at generating angle phi is spun by phi about its own axis
and carried by -phi z_s/z_f about the face gear's axis, so the plane x = R
(the station) cuts its extruded outline in an affine image of the outline,
    y = R tan(psi) + y'/cos(psi),  z = z',  psi = -phi z_s/z_f,
(the shaper's transverse profile, sheared and shifted by the carry angle).
The union of a few hundred such images, clipped to one pitch of the ring,
is the exact tooth-space section at that station; the space is a smooth
loft through a dozen stations (one B-spline face per side, not one facet
per position), patterned z_f times and cut from the blank in one N-ary
boolean. Only the part of the section below the blank's top matters:
above it the tool is a strip over the space alone, which keeps every
station's boundary to three straight edges plus ONE sweep profile running
from tooth-tip corner to tooth-tip corner, so the loft pairs like with
like (a profile that included long straight runs let the arc-length
correspondence wander between features from station to station, and the
smooth loft wobbled between stations by enough to break the booleans),
and keeps the patterned tools a tooth apart from each other (tools
trimmed to touching, or nearly touching, wedges made the N-ary cut return
invalid shapes, null shapes, or take minutes). The shaper is the pinion's
own tooth form with the
face gear's dedendum as its addendum (so the pinion's tips clear the
roots), and may have a few more teeth than the pinion (shaper_teeth), the
usual way to localize the contact.

The sweep must cover every shaper position that touches the wedge: the
bottom tooth cuts until its tip rises out of the addendum plane, at
    T = acos((r_s - h_a) / (r_s + h_as)),
and the NEIGHBOURING tooth keeps cutting the inner end of the same space
(the undercut region) until one shaper pitch later -- so phi runs over
+-(T + 2 pi/z_s) plus a margin. (A sweep stopped at +-1.5 pitches, trimmed
short of the half-pitch plane, left uncut material there that the pinion's
neighbouring tooth collided with.)

Design limits (Litvin's L1 / L2, here from the rack-equivalent section --
at radius R the face gear moves past the shaper like a rack at the shaper's
r_s' = r_s R/R_0, so the shaper's involute works there at the pressure
angle cos(alpha_R) = cos(alpha) R_0/R about a pitch line z_p = r_s - r_s'
above the face): the tooth top (h_a above the face) is reached by the
involute only if h_a - z_p <= r_s' sin^2(alpha_R), i.e. for
    R >= L1 = R_0 cos^2(alpha) / (1 - h_a / r_s)         (undercut inside),
and the top land, from the rack tooth thickness at z_p,
    t_top(R) = 2 r_s' (pi/(2 z_s) - inv alpha + inv alpha_R) - 2 (h_a - z_p) tan(alpha_R),
vanishes at L2 (pointed outside). The auto ring is [L1, L2] with 10 % of
its width kept clear at each end; the derived values report both limits
and warn when a hand-set ring crosses them.

Phase: a spur gear from build_gear_solid has a tooth centred on its own +Y
and, after the rotation that lays its axis along X, its own +X points DOWN
(-Z), at the face gear; a tooth centre sits there only when z is divisible
by 4, so both shaper and pinion are first spun so that a tooth centre is
exactly at the bottom -- then the space generated at face-gear angle 0 is
the one the pinion's bottom tooth enters at phase 0.

Checks (tests/test_face_gear.py): the pinion meshes through the built face
gear with (near) zero boolean interpenetration at several rotation phases
and collides when turned half a pitch -- the envelope construction, the
kinematic ratio, the phase and the clearances all verified by the one
check that would fail if any were wrong; the measured top lands at both
ends of the ring agree with the rack-equivalent formula; the space depth is
the shaper's addendum; one manifold body of few faces; STEP round-trip.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import numpy as np
import build123d as bd
import shapely
from shapely.geometry import Polygon, box
from shapely.geometry.polygon import orient
from OCP.BRepOffsetAPI import BRepOffsetAPI_ThruSections
from OCP.TopoDS import TopoDS

from involute import GearParams, full_gear_outline


def _inv(a: float) -> float:
    return math.tan(a) - a


@dataclass
class FaceGearParams:
    z: int                              # the face gear's teeth
    pinion_teeth: int                   # the spur pinion it meshes with
    module_mm: float = 2.0
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38     # the shaper's/pinion's own tip rounding parameter (involute.py)
    shaper_teeth: int = 0               # 0 = the pinion's count; a few more teeth localize the contact
    inner_radius_mm: float = 0.0        # 0 = auto: the undercut limit L1 plus 10 % of the usable width
    outer_radius_mm: float = 0.0        # 0 = auto: the pointing limit L2 minus 10 % of the usable width
    rim_thickness_mm: float = 6.0       # disc material below the root plane
    bore_diameter_mm: float = 0.0

    @property
    def nominal_radius(self) -> float:
        """R_0 = m z / 2: where the pinion's pitch circle rolls on the face."""
        return self.module_mm * self.z / 2.0

    @property
    def z_shaper(self) -> int:
        return self.shaper_teeth if self.shaper_teeth > 0 else self.pinion_teeth

    @property
    def shaper_pitch_radius(self) -> float:
        return self.module_mm * self.z_shaper / 2.0

    @property
    def pressure_angle_rad(self) -> float:
        return math.radians(self.pressure_angle_deg)

    @property
    def addendum(self) -> float:
        """The face gear's tooth height above the pitch plane (the blank's top)."""
        return self.addendum_coeff * self.module_mm

    @property
    def dedendum(self) -> float:
        """The space depth below the pitch plane: the shaper's addendum."""
        return self.dedendum_coeff * self.module_mm

    @property
    def ratio(self) -> float:
        return self.z / self.pinion_teeth

    @property
    def pinion_pitch_radius(self) -> float:
        return self.module_mm * self.pinion_teeth / 2.0

    # ---- the rack-equivalent section (module docstring) ----

    def _section(self, radius: float):
        """(r_s', alpha_R, z_p) at radius R, or None where the shaper's
        involute cannot touch at all (R < R_0 cos alpha: the equivalent
        pitch radius is inside the base circle)."""
        r_s = self.shaper_pitch_radius
        rs_eq = r_s * radius / self.nominal_radius
        c = math.cos(self.pressure_angle_rad) * self.nominal_radius / radius
        if c >= 1.0:
            return None
        return rs_eq, math.acos(c), r_s - rs_eq

    def top_land_at(self, radius: float) -> float:
        """The tooth's top-land width (mm) at radius R by the rack-equivalent
        section; NaN where there is no involute contact."""
        sec = self._section(radius)
        if sec is None:
            return float("nan")
        rs_eq, a_r, z_p = sec
        t_pitch = 2.0 * rs_eq * (math.pi / (2.0 * self.z_shaper) - _inv(self.pressure_angle_rad) + _inv(a_r))
        return t_pitch - 2.0 * (self.addendum - z_p) * math.tan(a_r)

    @property
    def undercut_radius(self) -> float:
        """L1: inside it the shaper's non-involute fillet cuts the tooth top."""
        return (self.nominal_radius * math.cos(self.pressure_angle_rad) ** 2
                / (1.0 - self.addendum / self.shaper_pitch_radius))

    @property
    def pointing_radius(self) -> float:
        """L2: where the top land vanishes (bisection on top_land_at, which
        decreases with R)."""
        lo = max(self.nominal_radius, self.undercut_radius)
        if not (self.top_land_at(lo) > 0.0):
            return lo
        hi = lo
        for _ in range(80):
            hi *= 1.05
            if not (self.top_land_at(hi) > 0.0):
                break
        else:
            return hi
        for _ in range(60):
            mid = 0.5 * (lo + hi)
            if self.top_land_at(mid) > 0.0:
                lo = mid
            else:
                hi = mid
        return 0.5 * (lo + hi)

    @property
    def inner_radius(self) -> float:
        if self.inner_radius_mm > 0:
            return self.inner_radius_mm
        l1, l2 = self.undercut_radius, self.pointing_radius
        return l1 + 0.1 * (l2 - l1)

    @property
    def outer_radius(self) -> float:
        if self.outer_radius_mm > 0:
            return self.outer_radius_mm
        l1, l2 = self.undercut_radius, self.pointing_radius
        return l2 - 0.1 * (l2 - l1)

    def pinion_params(self) -> GearParams:
        """The real pinion: standard depth, face width covering the toothed
        ring with a module's margin either side."""
        return GearParams(z=self.pinion_teeth, module_mm=self.module_mm, pressure_angle_deg=self.pressure_angle_deg,
                          addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
                          root_fillet_coeff=self.root_fillet_coeff,
                          face_width_mm=(self.outer_radius - self.inner_radius) + 2.0 * self.module_mm)

    def shaper_params(self) -> GearParams:
        """The generating shaper: z_shaper teeth, the face gear's dedendum as
        its addendum (so the real pinion's tips clear the roots it cuts).
        Its length only matters for the 3D placement helpers (the 2D sweep
        treats it as long enough to cover the ring, as a real one is)."""
        return GearParams(z=self.z_shaper, module_mm=self.module_mm, pressure_angle_deg=self.pressure_angle_deg,
                          addendum_coeff=self.dedendum_coeff, dedendum_coeff=self.dedendum_coeff,
                          root_fillet_coeff=self.root_fillet_coeff,
                          face_width_mm=(self.outer_radius - self.inner_radius) + 4.0 * self.module_mm)


def tooth_at_bottom_spin_deg(z: int) -> float:
    """Spin (about its own axis, before it is laid along X) that puts a tooth
    centre of a build_gear_solid gear at its own +X -- the direction that
    points at the face gear after the axis is turned onto X."""
    pitch = 360.0 / z
    return -(90.0 % pitch)


def lay_on_x(gear, z: int, pitch_radius: float, x_start: float, extra_spin_deg: float = 0.0):
    """A gear built along Z (spanning z in [0, face_width]) placed with its
    axis along X at height pitch_radius, starting at x_start, a tooth centre
    at the bottom (plus extra_spin_deg about its own axis)."""
    return (gear.rotate(bd.Axis.Z, tooth_at_bottom_spin_deg(z) + extra_spin_deg)
                .rotate(bd.Axis.Y, 90.0)
                .translate((x_start, 0.0, pitch_radius)))


def recess_depth(fp: FaceGearParams) -> float:
    """The disc inside the ring is relieved below the space floor by a fifth
    of a module: the shaper's (and pinion's) tips pass over it with
    clearance, and the space floor -- tangent to the plane z = -h_f along
    the space centre -- never touches a blank face (booleans dislike
    tangencies)."""
    return fp.dedendum + 0.2 * fp.module_mm


def blank_solid(fp: FaceGearParams) -> bd.Part:
    """The disc: bore to the outer radius, rim below the root plane; the
    toothed ring between the inner and outer radius stands up to the
    addendum plane, the region inside it is recessed below the root plane."""
    ha, hf = fp.addendum, fp.dedendum
    r_bore = fp.bore_diameter_mm / 2.0
    z_bot = -hf - fp.rim_thickness_mm
    z_recess = -recess_depth(fp)
    pts = [(r_bore, z_bot), (fp.outer_radius, z_bot), (fp.outer_radius, ha), (fp.inner_radius, ha),
           (fp.inner_radius, z_recess), (r_bore, z_recess)]
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    return part.part


def sweep_half_angle_rad(fp: FaceGearParams) -> float:
    """Half the generating-angle range (module docstring): the bottom tooth's
    exit angle plus one shaper pitch, plus 3 degrees."""
    r_s = fp.shaper_pitch_radius
    c = (r_s - fp.addendum) / (r_s + fp.dedendum)
    return math.acos(max(-1.0, min(1.0, c))) + 2.0 * math.pi / fp.z_shaper + math.radians(3.0)


def station_section(fp: FaceGearParams, radius: float, outline, n_positions: int, half_width: float) -> Polygon:
    """The material the shaper sweep removes in the plane x = R of the face
    gear's frame, within |y| <= half_width and the tooth-height band: the
    union of the shaper outline's affine images over the generating angle."""
    r_s = fp.shaper_pitch_radius
    z_lo, z_hi = -fp.dedendum - 1.0, fp.addendum + 1.0
    rect = box(-half_width, z_lo, half_width, z_hi)
    spin0 = math.radians(tooth_at_bottom_spin_deg(fp.z_shaper))
    span = sweep_half_angle_rad(fp)
    px0 = np.array([p[0] for p in outline])
    py0 = np.array([p[1] for p in outline])
    pieces = []
    for i in range(n_positions + 1):
        phi = -span + 2.0 * span * i / n_positions
        a = spin0 + phi
        c, s = math.cos(a), math.sin(a)
        px = px0 * c - py0 * s          # the outline spun about its own axis
        py = px0 * s + py0 * c
        y_own, z_own = py, r_s - px     # laid along X: own +X points down
        psi = -phi * fp.z_shaper / fp.z  # carried about the face gear's axis
        y = radius * math.tan(psi) + y_own / math.cos(psi)
        piece = Polygon(np.column_stack([y, z_own])).intersection(rect)
        if not piece.is_empty:
            pieces.append(piece)
    union = shapely.union_all(pieces, grid_size=1e-7)
    # Only what lies below the blank's top matters, and only within this
    # space's own pitch wedge (the union runs 0.3 mm past it so the region
    # is right up to the wedge plane; beyond the plane is the neighbour's
    # business -- a tool that reached past it would overlap the next tool);
    # above the top the whole strip counts as removed (there is no material
    # there), which keeps the section's boundary to straight edges plus ONE
    # sweep profile running from tooth-tip corner to tooth-tip corner.
    half_pitch_width = radius * math.tan(math.pi / fp.z)
    below = union.intersection(box(-half_pitch_width, z_lo, half_pitch_width, fp.addendum))
    if below.geom_type != "Polygon":
        below = max(below.geoms, key=lambda g: g.area)
    section = below.union(box(-half_width, fp.addendum, half_width, z_hi))
    if section.geom_type != "Polygon":
        section = max(section.geoms, key=lambda g: g.area)
    return section


def _resample(points, n: int):
    pts = np.array(points, dtype=float)
    seg = np.hypot(np.diff(pts[:, 0]), np.diff(pts[:, 1]))
    keep = np.concatenate([[True], seg > 1e-12])
    pts = pts[keep]
    seg = np.hypot(np.diff(pts[:, 0]), np.diff(pts[:, 1]))
    cum = np.concatenate([[0.0], np.cumsum(seg)])
    targets = np.linspace(0.0, cum[-1], n)
    return np.interp(targets, cum, pts[:, 0]), np.interp(targets, cum, pts[:, 1])


def station_wire(fp: FaceGearParams, radius: float, section: Polygon, half_width: float, n_profile: int) -> bd.Wire:
    """The section's boundary as four edges -- the rectangle's top, its right
    wall, the swept profile (one spline through n_profile points by arc
    length), its left wall -- the same four in the same order at every
    station, so the loft pairs them by index."""
    z_hi, ha = fp.addendum + 1.0, fp.addendum
    eps = 1e-6
    ring = list(orient(section, sign=-1.0).exterior.coords)[:-1]   # clockwise: top edge left to right first
    n = len(ring)
    i_tl = min(range(n), key=lambda i: (ring[i][0] + half_width) ** 2 + (ring[i][1] - z_hi) ** 2)
    ring = ring[i_tl:] + ring[:i_tl]
    i = 0
    while i + 1 < n and ring[i + 1][1] > z_hi - eps:      # the top edge
        i += 1
    i_tr = i
    while i + 1 < n and ring[i + 1][0] > half_width - eps:  # the right wall, down to z = h_a
        i += 1
    i_wr = i
    while i + 1 < n and abs(ring[i + 1][1] - ha) < eps:     # along z = h_a to the right tooth-tip corner
        i += 1
    i_cr = i
    j = n - 1
    while j - 1 > i_cr and ring[j - 1][0] < -half_width + eps:   # the left wall (upwards, so backwards)
        j -= 1
    i_wl = j
    while j - 1 > i_cr and abs(ring[j - 1][1] - ha) < eps:       # along z = h_a to the left corner
        j -= 1
    i_cl = j
    if i_cl - i_cr < 3:
        raise RuntimeError("face gear station: no tooth space found below the addendum plane")
    v = lambda y, z: bd.Vector(radius, y, z)
    # A pointed tooth (beyond L2) or an undercut-through one (far inside
    # L1) has no top land: the corners then sit on the wedge planes, where
    # this tool and its neighbour touch face to face -- the N-ary cut may
    # balk at that, and build_face_gear_solid falls back to cutting the
    # tools one at a time. (The auto ring keeps every station inside
    # L1..L2; only a hand-set ring past a limit gets here.)
    y_r, y_l = ring[i_cr][0], ring[i_cl][0]
    ys, zs = _resample(ring[i_cr:i_cl + 1], n_profile)
    profile = [v(y_r, ha)] + [v(y, z) for y, z in zip(ys[1:-1], zs[1:-1])] + [v(y_l, ha)]
    # Above the blank's top the tool only has to reach clear of it: a strip
    # over the space itself, its walls leaning inward from the tooth-tip
    # corners, so neighbouring tools stay a tooth's top land apart (they
    # meet at most along the crest line of a pointed tooth) and the N-ary
    # cut never has to intersect two tools with each other. (A full-wedge
    # strip left 40 pairs of parallel planar faces 4 microns apart, and the
    # general fuse returned null or took minutes on those.)
    lean = min(0.3, 0.3 * (y_r - y_l))
    if y_r - y_l < 0.05:            # a pointed station: keep the strip from vanishing
        mid = 0.5 * (y_r + y_l)
        y_r, y_l, lean = mid + 0.025, mid - 0.025, 0.0
        profile[0], profile[-1] = v(y_r, ha), v(y_l, ha)
    top_r, top_l = v(y_r - lean, z_hi), v(y_l + lean, z_hi)
    # The profile points are equally spaced along the arc, so a UNIFORM
    # parameter vector is a natural interpolation parametrisation -- and
    # the same one at every station, which is what matters: the loft has
    # to merge the sections' knot vectors, and with chord-length
    # parametrisation each station got its own (a ~1400-span surface per
    # face and a 96 MB STEP file for one gear).
    params = list(np.linspace(0.0, 1.0, len(profile)))
    edges = [bd.Edge.make_line(top_l, top_r), bd.Edge.make_line(top_r, profile[0]),
             bd.Edge.make_spline(profile, parameters=params), bd.Edge.make_line(profile[-1], top_l)]
    return bd.Wire(edges)


def loft_solid(wires: list[bd.Wire], ruled: bool = False) -> bd.Solid:
    """A solid through planar station wires, edges paired by index
    (OpenCASCADE's ThruSections with CheckCompatibility off, as
    spiral_bevel.loft_through_stations)."""
    builder = BRepOffsetAPI_ThruSections(True, ruled)
    builder.CheckCompatibility(False)
    for w in wires:
        builder.AddWire(w.wrapped)
    builder.Build()
    if not builder.IsDone() or builder.Shape().IsNull():
        raise RuntimeError("face gear: the loft through the station sections failed")
    return bd.Solid(TopoDS.Solid_s(builder.Shape()))


def space_cutter(fp: FaceGearParams, n_positions: int = 240, n_stations: int = 10,
                 simplify_tolerance_mm: float = 0.02, n_profile: int = 80, ruled: bool = False):
    """The material one tooth space removes from the blank: the loft of the
    swept sections through n_stations planes from 0.3 mm inside the ring to
    0.3 mm outside it (its flat ends are in the air either side of the
    ring: over the relieved disc, and beyond the rim -- the rim's cylinder
    bows in by at most 0.2 mm over the tool's width, so 0.3 mm clears it,
    and staying that close keeps the auto ring's stations inside L1..L2).
    Six faces.

    ruled=True gives the piecewise-ruled loft instead of the smooth one:
    the same geometry to within microns (measured: pinion overlap 0.009 vs
    0.012 mm^3) at five times the face count, kept for diagnosis."""
    if fp.outer_radius <= fp.inner_radius + 0.05 * fp.module_mm:
        raise ValueError(f"face gear: no usable ring between the inner radius {fp.inner_radius:.2f} and the outer "
                         f"radius {fp.outer_radius:.2f} mm (undercut limit L1 = {fp.undercut_radius:.2f}, "
                         f"pointing limit L2 = {fp.pointing_radius:.2f})")
    outline = full_gear_outline(fp.shaper_params(), simplify_tolerance_mm=simplify_tolerance_mm)
    half_pitch = math.pi / fp.z
    r0, r1 = fp.inner_radius - 0.3, fp.outer_radius + 0.3
    wires = []
    for k in range(n_stations):
        radius = r0 + (r1 - r0) * k / (n_stations - 1)
        half_width = radius * math.tan(half_pitch) + 0.3   # the sweep is unioned a little past the tooth centrelines
        section = station_section(fp, radius, outline, n_positions, half_width)
        wires.append(station_wire(fp, radius, section, half_width, n_profile))
    tool = loft_solid(wires, ruled)
    if not tool.is_valid:
        raise RuntimeError("face gear: the lofted space tool is not a valid solid")
    return tool


def slim_edge_curves(shape, tolerance_mm: float = 0.002, max_poles: int = 40) -> int:
    """Re-approximate, in place, every B-spline edge curve with more than
    max_poles poles (the boolean's intersection curves come out with ~750
    poles each) to a degree-3 curve within tolerance_mm, widening the edge
    tolerance to cover it; the faces' surfaces are untouched. Returns the
    number of edges slimmed. Measured on the z = 40 gear: 82 edges, 59 500
    poles down to 9 900, still one valid solid, the pinion mesh check
    unchanged (0.010 mm^3), the STEP round-trip identical in volume."""
    from OCP.BRep import BRep_Builder, BRep_Tool
    from OCP.GeomConvert import GeomConvert_ApproxCurve
    from OCP.GeomAbs import GeomAbs_C1
    builder = BRep_Builder()
    done = 0
    for edge in shape.edges():
        curve = BRep_Tool.Curve_s(edge.wrapped, 0.0, 1.0)
        if curve is None or curve.DynamicType().Name() != "Geom_BSplineCurve" or curve.NbPoles() <= max_poles:
            continue
        approx = GeomConvert_ApproxCurve(curve, tolerance_mm, GeomAbs_C1, 100, 3)
        if not (approx.IsDone() and approx.HasResult()):
            continue
        builder.UpdateEdge(edge.wrapped, approx.Curve(), max(BRep_Tool.Tolerance_s(edge.wrapped), 1.5 * tolerance_mm))
        done += 1
    return done


def build_face_gear_solid(fp: FaceGearParams, n_positions: int = 240, n_stations: int = 10,
                          simplify_tolerance_mm: float = 0.02, n_profile: int = 80):
    """The blank cut by z patterned copies of the generated space in one
    N-ary boolean (the tools never touch each other -- station_wire says
    how); should that ever come back as anything but one valid solid, the
    same tools are cut one after another instead."""
    cutter = space_cutter(fp, n_positions, n_stations, simplify_tolerance_mm, n_profile)
    pitch_deg = 360.0 / fp.z
    tools = [cutter.rotate(bd.Axis.Z, k * pitch_deg) for k in range(fp.z)]
    blank = blank_solid(fp)
    try:
        gear = blank.cut(*tools)
        if len(gear.solids()) == 1 and gear.is_valid:
            return gear
    except ValueError:      # build123d raises on a null boolean result
        pass
    gear = blank
    for tool in tools:
        gear = gear.cut(tool)
    return gear


def place_pinion(pinion, fp: FaceGearParams, pinion_turn_deg: float = 0.0, phase_error_deg: float = 0.0):
    """The real pinion in mesh, its axis along X at its pitch radius above
    the face; turning it by delta about its axis goes with the face gear
    turning by delta z_p / z about Z (rolling without slip at R_0)."""
    return lay_on_x(pinion, fp.pinion_teeth, fp.pinion_pitch_radius, fp.inner_radius - fp.module_mm,
                    extra_spin_deg=pinion_turn_deg + phase_error_deg)


def face_gear_turn_deg(fp: FaceGearParams, pinion_turn_deg: float) -> float:
    return pinion_turn_deg * fp.pinion_teeth / fp.z
