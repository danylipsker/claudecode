"""
Spiral bevel gears -- and zerol bevel gears, their zero-spiral-angle case.
docs/gear-math.md section 16.

A spiral bevel gear is a bevel gear whose teeth follow a curved lengthwise
trace across the face instead of a straight line to the apex. This module
keeps everything section 8 (straight bevel, Tredgold) already validates --
the virtual-gear tooth section, the flat-to-cone mapping, the linear taper
to the apex, the root cone -- and adds the ONE thing a spiral tooth adds: the
tooth's angular position varies along the cone distance, following the
classic Gleason circular-arc trace.

Trace (in the pitch cone's development, a flat sector with polar coordinates
(s, phi_dev), phi_dev = phi * sin(gamma) for the true angle phi about the
axis): a circle of cutter radius r_c through the mean point M = (R_m, 0)
whose tangent there makes the mean spiral angle psi_m with the radial
direction, so its centre is C = M + r_c (-sin psi_m, cos psi_m). Its spiral
angle at any cone distance s is Gleason's

    sin psi(s) = (s^2 - R_m^2 + 2 R_m r_c sin psi_m) / (2 s r_c)

and the trace's angular offset from M is the circle/circle intersection

    phi_dev(s) = atan2(C_y, C_x) - acos((s^2 + |C|^2 - r_c^2) / (2 s |C|)).

A zerol gear is psi_m = 0: curved teeth with zero spiral angle at the mean
point (negative at the toe, positive at the heel).

Section: the flat virtual-gear tooth is generated with the TRANSVERSE
pressure angle tan(alpha_t) = tan(alpha_n) / cos(psi_m) (the user's angle is
the normal one, as for helical gears; the module stays the outer transverse
module, so pitch diameters are unchanged from straight bevel).

Solid: each tooth is a smooth loft through n_stations sections between toe
and heel, every section the straight-bevel station at that cone distance
turned about the axis by phi(s). The loft is driven through OpenCASCADE's
ThruSections directly with vertex-compatibility checking OFF, so the
sections' vertices pair by index: with the check on (build123d's default),
OCCT re-pairs vertices of rotated sections by proximity and shears the
surface -- measured on the helical gear as 359 um versus 8.6 um (ruled) and
0.0 um (smooth) with it off. The smooth loft also gives one face per profile
edge instead of one per edge per station.

Pair: the pinion of a spiral bevel pair has the same module, shaft angle,
face width, spiral angle and cutter radius and the OPPOSITE hand; both
members share the apex and the outer cone distance, so their traces
coincide along the common pitch-cone generatrix. tests/test_spiral_bevel.py
checks the trace against Gleason's formula, the loft between stations, and
the pair by boolean interpenetration in mesh at several rotation phases.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from OCP.BRepOffsetAPI import BRepOffsetAPI_ThruSections

from bevel import BevelGearParams, flat_point_to_cone, root_cone_profile, place_bevel_pinion
from involute import GearParams, single_tooth_polygon


@dataclass
class SpiralBevelParams(BevelGearParams):
    spiral_angle_deg: float = 35.0    # psi_m, the mean spiral angle; 0 = zerol
    cutter_radius_mm: float = 0.0     # r_c; 0 = auto: the mean cone distance
    hand: str = "right"

    @property
    def mean_cone_distance(self) -> float:
        return self.outer_cone_distance - self.face_width_mm / 2.0

    @property
    def cutter_radius(self) -> float:
        return self.cutter_radius_mm if self.cutter_radius_mm > 0 else self.mean_cone_distance

    @property
    def is_zerol(self) -> bool:
        return abs(self.spiral_angle_deg) < 1e-9

    @property
    def transverse_pressure_angle_rad(self) -> float:
        """tan(alpha_t) = tan(alpha_n) / cos(psi_m), as for a helical gear."""
        return math.atan(math.tan(math.radians(self.pressure_angle_deg)) / math.cos(math.radians(self.spiral_angle_deg)))

    def to_flat_gear_params(self) -> GearParams:
        return GearParams(
            z=self.z_virtual,
            module_mm=self.module_mm,
            pressure_angle_deg=math.degrees(self.transverse_pressure_angle_rad),
            addendum_coeff=self.addendum_coeff,
            dedendum_coeff=self.dedendum_coeff,
            root_fillet_coeff=self.root_fillet_coeff,
        )

    # -- the circular-arc trace -------------------------------------------

    def spiral_angle_at(self, s: float) -> float:
        """psi(s), radians, unsigned (Gleason)."""
        rm, rc = self.mean_cone_distance, self.cutter_radius
        psi_m = math.radians(self.spiral_angle_deg)
        val = (s * s - rm * rm + 2.0 * rm * rc * math.sin(psi_m)) / (2.0 * s * rc)
        return math.asin(max(-1.0, min(1.0, val)))

    def trace_offset_dev_rad(self, s: float) -> float:
        """Angular offset of the trace from the mean point at cone distance
        s, in the DEVELOPED plane, unsigned (positive = the sense the heel end
        moves for a positive spiral angle)."""
        rm, rc = self.mean_cone_distance, self.cutter_radius
        psi_m = math.radians(self.spiral_angle_deg)
        cx, cy = rm - rc * math.sin(psi_m), rc * math.cos(psi_m)
        d = math.hypot(cx, cy)
        theta_0 = math.atan2(cy, cx)
        val = (s * s + d * d - rc * rc) / (2.0 * s * d)
        return theta_0 - math.acos(max(-1.0, min(1.0, val)))

    def trace_offset_rad(self, s: float) -> float:
        """The same offset as a true angle about the gear axis, signed by
        hand: right-hand = the heel end of the tooth lies counter-clockwise
        (about +Z, the apex-to-back direction) of the mean point."""
        sign = 1.0 if self.hand != "left" else -1.0
        return sign * self.trace_offset_dev_rad(s) / math.sin(self.pitch_angle_rad)

    def pinion_params(self) -> "SpiralBevelParams":
        """The mating pinion: same module, shaft angle, face width, spiral
        angle and cutter radius (auto = the shared mean cone distance),
        opposite hand, the tooth counts swapped."""
        return SpiralBevelParams(
            z=self.mate_teeth, module_mm=self.module_mm, mate_teeth=self.z,
            shaft_angle_deg=self.shaft_angle_deg, pressure_angle_deg=self.pressure_angle_deg,
            addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
            root_fillet_coeff=self.root_fillet_coeff, face_width_mm=self.face_width_mm,
            bore_diameter_mm=self.mate_bore_diameter_mm, mate_bore_diameter_mm=self.bore_diameter_mm,
            pitch_angle_deg_override=(None if self.pitch_angle_deg_override is None
                                      else self.shaft_angle_deg - self.pitch_angle_deg_override),
            spiral_angle_deg=self.spiral_angle_deg,
            cutter_radius_mm=self.cutter_radius_mm, hand="left" if self.hand != "left" else "right")


def flat_tooth_coords(sp: BevelGearParams, n_phi: int = 240, simplify_tolerance_mm: float = 0.02) -> list[tuple[float, float]]:
    """The heel's flat virtual-gear tooth outline, simplified, with single_
    tooth_polygon's artificial inner floor dropped -- exactly what bevel.
    bevel_tooth_stations maps to the cone, factored out so the spiral gear
    maps the very same points."""
    flat_gp = sp.to_flat_gear_params()
    poly = single_tooth_polygon(flat_gp, z_virtual=sp.z_virtual, n_phi=n_phi)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    rf_flat = flat_gp.dedendum_radius
    return [(x, y) for (x, y) in coords if math.hypot(x, y) >= rf_flat - 1e-6]


def station_cone_distances(sp: SpiralBevelParams, n_stations: int) -> list[float]:
    re = sp.outer_cone_distance
    s_toe = re - sp.face_width_mm
    return [s_toe + (re - s_toe) * i / (n_stations - 1) for i in range(n_stations)]


def spiral_bevel_tooth_stations(sp: SpiralBevelParams, tooth_index: int = 0, n_stations: int = 10,
                                n_phi: int = 240, simplify_tolerance_mm: float = 0.02):
    """One tooth as n_stations 3D point loops from toe to heel, all in the
    same vertex order: the straight-bevel station at each cone distance,
    turned about the axis by the trace offset there."""
    coords = flat_tooth_coords(sp, n_phi, simplify_tolerance_mm)
    gamma = sp.pitch_angle_rad
    re = sp.outer_cone_distance
    base_offset = tooth_index * (2 * math.pi / sp.z)
    stations = []
    for s in station_cone_distances(sp, n_stations):
        offset = base_offset + sp.trace_offset_rad(s)
        stations.append([flat_point_to_cone(x, y, s, gamma, re, sp.heel_pitch_radius, offset) for (x, y) in coords])
    return stations


def loft_through_stations(stations: list[list[tuple[float, float, float]]], ruled: bool = False) -> bd.Solid:
    """A closed solid through closed polyline stations, vertices paired BY
    INDEX (OpenCASCADE's ThruSections with CheckCompatibility off -- see the
    module docstring for the measured reason), capped at both ends with
    filling faces because a station on a cone is not planar (bevel.py's
    _make_bevel_tooth_solid explains why plain caps silently fail)."""
    wires = [bd.Wire.make_polygon(pts, close=True) for pts in stations]
    builder = BRepOffsetAPI_ThruSections(False, ruled)  # a shell; caps below
    builder.CheckCompatibility(False)
    for w in wires:
        builder.AddWire(w.wrapped)
    builder.Build()
    if not builder.IsDone() or builder.Shape().IsNull():
        raise RuntimeError("loft through the tooth stations failed")
    side = bd.Shell(builder.Shape())  # (Shape.cast returns None for a shell in build123d 0.11)
    caps = [bd.Face.make_surface(wires[0]), bd.Face.make_surface(wires[-1])]
    return bd.Solid(bd.Shell(list(side.faces()) + caps))


def tooth_outline_pitch_to_pitch(sp: BevelGearParams, n_phi: int = 240,
                                 simplify_tolerance_mm: float = 0.02) -> list[tuple[float, float]]:
    """flat_tooth_coords from the pitch boundary at -pi/z_v to the one at
    +pi/z_v, ordered by increasing angle from +Y, the two boundary points
    exact and on the root circle (the root land). The last point is the
    next tooth's first: full_gear_station lays z of these end to end."""
    coords = flat_tooth_coords(sp, n_phi, simplify_tolerance_mm)
    flat_gp = sp.to_flat_gear_params()
    rf, half = flat_gp.dedendum_radius, math.pi / sp.z_virtual
    theta = [math.atan2(x, y) for x, y in coords]
    i0 = min(range(len(coords)), key=lambda i: theta[i])
    ring = [coords[(i0 + j) % len(coords)] for j in range(len(coords))]
    # the tooth above the root land: the land's own points sit 1e-5 mm off
    # the root circle, so the cut is a few hundredths up (the fillet foot
    # the simplification keeps is 0.04-0.07 mm up; a chord from the
    # boundary point to it stands in for the land and the fillet's toe)
    lift = min(0.01 * sp.module_mm, 0.02)
    body = [(x, y) for (x, y) in ring if math.hypot(x, y) > rf + lift]
    if math.atan2(body[0][0], body[0][1]) > math.atan2(body[-1][0], body[-1][1]):
        body.reverse()
    return [(rf * math.sin(-half), rf * math.cos(-half))] + body + [(rf * math.sin(half), rf * math.cos(half))]


def full_gear_station(tooth: list[tuple[float, float]], sp: BevelGearParams, s: float,
                      offset_rad: float) -> list[tuple[float, float, float]]:
    """The whole gear's outline at cone distance s -- z copies of `tooth`
    (tooth_outline_pitch_to_pitch) carried to the cone and turned by
    offset_rad -- as one closed loop: tooth k at indices [k n, (k+1) n)
    with n = len(tooth) - 1, its boundary point first."""
    gamma, re = sp.pitch_angle_rad, sp.outer_cone_distance
    pts = []
    for k in range(sp.z):
        ang = offset_rad + k * 2 * math.pi / sp.z
        pts += [flat_point_to_cone(x, y, s, gamma, re, sp.heel_pitch_radius, ang) for (x, y) in tooth[:-1]]
    return pts


def _tri(a, b, c) -> bd.Face:
    return bd.Face(bd.Wire.make_polygon([a, b, c], close=True))


def tooth_base_arc(tooth: list[tuple[float, float]], n: int = 4) -> list[tuple[float, float]]:
    """n flat points along the tooth's base between the two fillet feet
    (tooth[1] and tooth[-2] of tooth_outline_pitch_to_pitch), radius and
    angle interpolated: carried to the cone they lie on the back cone, and
    gear_end_faces bounds each tooth's end face with them."""
    (xl, yl), (xr, yr) = tooth[1], tooth[-2]
    rl, tl = math.hypot(xl, yl), math.atan2(xl, yl)
    rr, tr = math.hypot(xr, yr), math.atan2(xr, yr)
    out = []
    for j in range(1, n + 1):
        u = j / (n + 1)
        r, t = rl + (rr - rl) * u, tl + (tr - tl) * u
        out.append((r * math.sin(t), r * math.cos(t)))
    return out


def tooth_end_support(tooth: list[tuple[float, float]], arc: list[tuple[float, float]],
                      module_mm: float, n: int = 9) -> list[tuple[float, float]]:
    """Flat points inside the tooth's end face (the outline above the fillet
    feet and the base arc), an n x n polar grid kept 0.05 modules clear of
    the boundary. Carried to the cone they pin the filling face to the back
    cone: through the boundary alone the plate surface bulged 0.49 mm in
    the dedendum of a 16/16 m3 gear (the committed per-tooth caps, 0.18);
    a 7 x 7 grid 0.15 modules clear still let it bulge 0.12 mm just above
    the base arc."""
    from shapely.geometry import Point, Polygon
    outline = tooth[1:-1] + list(reversed(arc))
    poly = Polygon(outline).buffer(-0.05 * module_mm)
    if poly.is_empty:
        return []
    rs = [math.hypot(x, y) for x, y in outline]
    ts = [math.atan2(x, y) for x, y in outline]
    pts = []
    # the grid's rows, plus two close above the base arc, where the plate
    # bulged 0.07 mm in the strip below the first row
    levels = [min(rs) + (max(rs) - min(rs)) * (i + 0.5) / n for i in range(n)]
    levels += [min(rs) + 0.09 * module_mm, min(rs) + 0.2 * module_mm]
    for r in levels:
        for j in range(n):
            t = min(ts) + (max(ts) - min(ts)) * (j + 0.5) / n
            x, y = r * math.sin(t), r * math.cos(t)
            if poly.contains(Point(x, y)):
                pts.append((x, y))
    return pts


def gear_end_faces(station: list[tuple[float, float, float]], z: int,
                   arcs: list[list[tuple[float, float, float]]],
                   support: list[list[tuple[float, float, float]]] | None = None) -> list[bd.Face]:
    """The end face of the one-solid gear at a full_gear_station: a planar
    z-gon through the pitch-boundary points (on the root cone at this cone
    distance, all at one z); per tooth a fan of planar triangles from its
    first boundary point over the root land strip -- fillet foot, the base
    arc (tooth_base_arc carried to the cone), fillet foot, next boundary
    point -- and a filling face for the tooth's end proper, bounded by the
    outline and that arc, every boundary point of it on the back cone, so
    the face is the back cone to a few microns. (A fan of planar triangles
    from the outline's centroid was tried first: the centroid of points on
    a cone lies inside it, and the tooth ends came out dished 0.2 mm.)"""
    n = len(station) // z
    faces = [bd.Face(bd.Wire.make_polygon([station[k * n] for k in range(z)], close=True))]
    for k in range(z):
        i0 = k * n
        b0, b1 = station[i0], station[(i0 + n) % len(station)]
        upper = station[i0 + 1: i0 + n]                       # fillet foot to fillet foot, on the back cone
        ring = [upper[0]] + list(arcs[k]) + [upper[-1]]
        faces += [_tri(b0, ring[j], ring[j + 1]) for j in range(len(ring) - 1)] + [_tri(b0, upper[-1], b1)]
        pins = [bd.Vector(*q) for q in support[k]] if support else None
        faces.append(bd.Face.make_surface(bd.Wire.make_polygon(upper + list(reversed(arcs[k])), close=True), surface_points=pins))
    return faces


def one_solid_from_stations(stations: list[list[tuple[float, float, float]]], z: int,
                            end_arcs: tuple[list, list], ruled: bool = False,
                            end_support: tuple[list, list] | None = None) -> bd.Solid:
    """The gear as one solid: OpenCASCADE's ThruSections through the full
    outline stations (vertices paired by index, CheckCompatibility off, as
    loft_through_stations) and gear_end_faces at both ends (end_arcs: the
    teeth's base arcs at the first and the last station), sewn into a
    shell. No boolean anywhere -- see docs 8.4 for the years of them."""
    wires = [bd.Wire.make_polygon(pts, close=True) for pts in stations]
    builder = BRepOffsetAPI_ThruSections(False, ruled)
    builder.CheckCompatibility(False)
    for w in wires:
        builder.AddWire(w.wrapped)
    builder.Build()
    if not builder.IsDone() or builder.Shape().IsNull():
        raise RuntimeError("loft through the gear's stations failed")
    side = bd.Shell(builder.Shape())
    sup = end_support or (None, None)
    caps = gear_end_faces(stations[0], z, end_arcs[0], sup[0]) + gear_end_faces(stations[-1], z, end_arcs[1], sup[1])
    return bd.Solid(bd.Shell(list(side.faces()) + caps))


def gear_base_arcs(tooth: list[tuple[float, float]], sp: BevelGearParams, s: float, offset_rad: float):
    """(arcs, support): tooth_base_arc and tooth_end_support for every
    tooth, carried to cone distance s as full_gear_station does."""
    gamma, re = sp.pitch_angle_rad, sp.outer_cone_distance
    arc = tooth_base_arc(tooth)
    pins = tooth_end_support(tooth, arc, sp.module_mm)

    def carry(flat, k):
        return [flat_point_to_cone(x, y, s, gamma, re, sp.heel_pitch_radius, offset_rad + k * 2 * math.pi / sp.z) for (x, y) in flat]
    return [carry(arc, k) for k in range(sp.z)], [carry(pins, k) for k in range(sp.z)]


def bore_cut(solid: bd.Solid, sp: BevelGearParams) -> bd.Solid:
    """The bore, cut through the two end faces (the one boolean that is
    trivial: a cylinder through two planes). Refused when it would reach
    the root land's z-gon at the toe, where the rim is thinnest."""
    if sp.bore_diameter_mm <= 0.0:
        return solid
    (_, z_toe), (r_root_toe, _), _, (_, z_heel) = root_cone_profile(sp)
    inradius = r_root_toe * math.cos(math.pi / sp.z)
    r = sp.bore_diameter_mm / 2.0
    if r >= inradius - 0.05:
        raise ValueError("bore diameter %.2f mm reaches the root cone at the toe (root land %.2f mm across there)"
                         % (sp.bore_diameter_mm, 2.0 * inradius))
    cyl = bd.Solid.make_cylinder(r, (z_heel - z_toe) + 2.0, bd.Plane.XY.offset(z_toe - 1.0))
    out = solid.cut(cyl)
    bodies = out.solids()
    if len(bodies) != 1:
        raise RuntimeError("the bore cut left %d solids" % len(bodies))
    return bodies[0]


def build_spiral_bevel_gear_solid(sp: SpiralBevelParams, n_stations: int = 10, n_phi: int = 240,
                                  simplify_tolerance_mm: float = 0.02, fuse: bool = True):
    """One solid (fuse=True, the default, labelled "solid"): the full gear
    outline -- z teeth and their root lands -- lofted through n_stations,
    turned by the trace offset at each, capped with gear_end_faces, the
    bore cut (docs/gear-math.md 8.4). Or, fuse=False, the older Compound
    of the root-cone blank and z separate tooth lofts (labelled
    "compound"), which the conjugacy tests intersect solid by solid
    (meshcheck) in seconds where one 1000-face gear takes minutes."""
    if fuse:
        tooth = tooth_outline_pitch_to_pitch(sp, n_phi, simplify_tolerance_mm)
        distances = station_cone_distances(sp, n_stations)
        stations = [full_gear_station(tooth, sp, s, sp.trace_offset_rad(s)) for s in distances]
        ends = [gear_base_arcs(tooth, sp, s, sp.trace_offset_rad(s)) for s in (distances[0], distances[-1])]
        solid = bore_cut(one_solid_from_stations(stations, sp.z, (ends[0][0], ends[1][0]), end_support=(ends[0][1], ends[1][1])), sp)
        solid.label = "solid"
        return solid
    profile_pts = root_cone_profile(sp)
    with bd.BuildPart() as blank_part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*profile_pts, profile_pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    blank = blank_part.part

    coords = flat_tooth_coords(sp, n_phi, simplify_tolerance_mm)
    gamma, re = sp.pitch_angle_rad, sp.outer_cone_distance
    distances = station_cone_distances(sp, n_stations)
    trace = [sp.trace_offset_rad(s) for s in distances]
    teeth = []
    for k in range(sp.z):
        base = k * 2 * math.pi / sp.z
        stations = [[flat_point_to_cone(x, y, s, gamma, re, sp.heel_pitch_radius, base + off) for (x, y) in coords]
                    for s, off in zip(distances, trace)]
        teeth.append(loft_through_stations(stations))
    comp = bd.Compound(children=[blank, *teeth])
    comp.label = "compound"
    return comp


def build_spiral_bevel_pair(sp: SpiralBevelParams, gear_turn_deg: float = 0.0, phase_error_deg: float = 0.0,
                            n_stations: int = 10, n_phi: int = 240, simplify_tolerance_mm: float = 0.02, fuse: bool = True):
    """(gear, pinion) in mesh: the gear on Z turned by gear_turn_deg, the
    pinion placed by bevel.place_bevel_pinion (shared with straight bevel --
    the placement is the same; only the teeth differ)."""
    gear = build_spiral_bevel_gear_solid(sp, n_stations, n_phi, simplify_tolerance_mm, fuse).rotate(bd.Axis.Z, gear_turn_deg)
    pinion = build_spiral_bevel_gear_solid(sp.pinion_params(), n_stations, n_phi, simplify_tolerance_mm, fuse)
    return gear, place_bevel_pinion(pinion, sp.z, sp.mate_teeth, sp.shaft_angle_deg, gear_turn_deg, phase_error_deg)
