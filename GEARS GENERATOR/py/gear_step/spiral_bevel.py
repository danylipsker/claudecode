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
            bore_diameter_mm=0.0, spiral_angle_deg=self.spiral_angle_deg,
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


def build_spiral_bevel_gear_solid(sp: SpiralBevelParams, n_stations: int = 10, n_phi: int = 240,
                                  simplify_tolerance_mm: float = 0.02) -> bd.Compound:
    """Root-cone blank plus z lofted teeth, as a Compound (the same blank/
    tooth arrangement as build_gear.build_bevel_gear_solid, for the same
    boolean-fuse reasons documented there)."""
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
    return bd.Compound(children=[blank, *teeth])


def build_spiral_bevel_pair(sp: SpiralBevelParams, gear_turn_deg: float = 0.0, phase_error_deg: float = 0.0,
                            n_stations: int = 10, n_phi: int = 240, simplify_tolerance_mm: float = 0.02):
    """(gear, pinion) in mesh: the gear on Z turned by gear_turn_deg, the
    pinion placed by bevel.place_bevel_pinion (shared with straight bevel --
    the placement is the same; only the teeth differ)."""
    gear = build_spiral_bevel_gear_solid(sp, n_stations, n_phi, simplify_tolerance_mm).rotate(bd.Axis.Z, gear_turn_deg)
    pinion = build_spiral_bevel_gear_solid(sp.pinion_params(), n_stations, n_phi, simplify_tolerance_mm)
    return gear, place_bevel_pinion(pinion, sp.z, sp.mate_teeth, sp.shaft_angle_deg, gear_turn_deg, phase_error_deg)
