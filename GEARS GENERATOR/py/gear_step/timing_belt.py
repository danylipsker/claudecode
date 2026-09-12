"""
Timing wheels (toothed pulleys) and timing belts -- the second drive-element
pair the user asked for, alongside sprocket.py/chain_link.py's roller chain
and sprocket. docs/gear-math.md section 20.

Unlike a chain (rigid pitch-length links, so its wrapped shape is a regular
polygon -- sprocket.py section 18.1), a timing belt is one continuous,
flexible, inextensible band: wrapped around a pulley its pitch LINE lies
exactly on a true circle, no polygon effect, radius
    R = z * p / (2 pi)
(z teeth, belt pitch p) -- ordinary rolling-without-slip, exactly the
kinematics `involute.rack_point_to_gear_frame` already implements for a
rack rolling on a gear (docs/gear-math.md section 4). That is the whole
construction here: the belt's own tooth cross-section (a trapezoid, wide
at its root -- the belt's backing -- narrow at its tip, the same
wide-base-narrow-tip shape as an ordinary gear tooth, just without an
involute flank) IS the rack profile; wrap it onto the pulley by evaluating
rack_point_to_gear_frame at phi=0 across the tooth's own (u, v) points (its
few corners), and the result is the groove's own correctly-curved outline
directly -- no envelope/union needed, because the tooth's shape is GIVEN,
not derived the way an involute flank is from the rack's straight edge.

Because the belt tooth narrows from root (wide, at the pulley's outside
diameter -- the belt's backing rests there, this module's stated
simplification: the pitch line coincides with the pulley OD) to tip
(narrow, toward the pulley's axis), the material a groove leaves BETWEEN
two adjacent grooves -- the pulley's own tooth -- automatically widens
going the other way (toward the pulley's own body) and narrows toward the
OD: an ordinary tapering tooth, ordinary rack-and-pinion kinematics
producing it directly, unlike the sprocket (section 18.2) where a moving
generator does not apply at all and a bespoke widening-gap construction
was needed instead.

The belt itself (build_timing_belt_solid) is simpler still: flat, so no
wrapping needed at all -- literally rack.py's own construction (a flat bar
with a repeating tooth profile), teeth on one face, at the same pitch.

Checks (tests/test_timing_belt.py): the pulley's pitch radius matches the
closed-form z*p/(2*pi); the built pulley is one valid, z-fold-symmetric
solid; **a belt tooth (built by this module's own belt-solid function, not
a stand-in shape) seated at every pitch position around the pulley
overlaps it by only a sliver, and collides substantially half a pitch
off** -- the same "does the real mating part actually fit" check every
family in this project runs.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from shapely.affinity import rotate as shapely_rotate
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

from involute import rack_point_to_gear_frame


@dataclass
class TimingBeltParams:
    belt_pitch_mm: float
    tooth_height_mm: float = 0.0        # 0 = auto: 0.3 * pitch
    tooth_root_width_mm: float = 0.0    # 0 = auto: 0.5 * pitch (at the belt's backing)
    tooth_tip_width_mm: float = 0.0     # 0 = auto: 0.35 * pitch (narrower, at the tooth's tip)
    belt_thickness_mm: float = 0.0      # 0 = auto: 0.4 * pitch (backing behind the teeth)
    belt_width_mm: float = 10.0
    n_teeth: int = 12                   # how many teeth the modelled belt segment has

    @property
    def tooth_height(self) -> float:
        return self.tooth_height_mm if self.tooth_height_mm > 0 else 0.3 * self.belt_pitch_mm

    @property
    def tooth_root_width(self) -> float:
        return self.tooth_root_width_mm if self.tooth_root_width_mm > 0 else 0.5 * self.belt_pitch_mm

    @property
    def tooth_tip_width(self) -> float:
        return self.tooth_tip_width_mm if self.tooth_tip_width_mm > 0 else 0.35 * self.belt_pitch_mm

    @property
    def belt_thickness(self) -> float:
        return self.belt_thickness_mm if self.belt_thickness_mm > 0 else 0.4 * self.belt_pitch_mm


@dataclass
class TimingWheelParams:
    z: int
    belt_pitch_mm: float
    tooth_height_mm: float = 0.0
    tooth_root_width_mm: float = 0.0
    tooth_tip_width_mm: float = 0.0
    clearance_mm: float = 0.1           # groove enlarged this much, each side, for a running fit
    face_width_mm: float = 10.0
    bore_diameter_mm: float = 0.0

    def _belt(self) -> TimingBeltParams:
        return TimingBeltParams(belt_pitch_mm=self.belt_pitch_mm, tooth_height_mm=self.tooth_height_mm,
                                tooth_root_width_mm=self.tooth_root_width_mm, tooth_tip_width_mm=self.tooth_tip_width_mm)

    @property
    def pitch_radius(self) -> float:
        """R = z p / (2 pi): the belt's own pitch LINE, an inextensible
        loop of z*p total length, wrapped on a true circle -- no polygon
        effect (module docstring)."""
        return self.z * self.belt_pitch_mm / (2.0 * math.pi)

    @property
    def pitch_diameter(self) -> float:
        return 2.0 * self.pitch_radius

    @property
    def outside_radius(self) -> float:
        """This module's stated simplification: the belt's backing rests
        directly on the pulley's own outside diameter, i.e. the pitch line
        coincides with the OD."""
        return self.pitch_radius

    @property
    def root_radius(self) -> float:
        return self.outside_radius - self._belt().tooth_height


def belt_tooth_points(bp: TimingBeltParams, clearance: float = 0.0) -> list[tuple[float, float]]:
    """One tooth's (u, v) corners in the rack/belt's own flat frame -- v=0
    at the root (the belt's backing surface), v=+tooth_height at the tip
    (rack_point_to_gear_frame's convention: v grows TOWARD the gear axis,
    i.e. deeper into the pulley); a plain trapezoid, no root fillet (a
    stated v1 simplification). clearance widens both widths symmetrically,
    for the pulley groove's running fit."""
    hw_root = bp.tooth_root_width / 2.0 + clearance
    hw_tip = bp.tooth_tip_width / 2.0 + clearance
    h = bp.tooth_height
    return [(hw_root, 0.0), (hw_tip, h), (-hw_tip, h), (-hw_root, 0.0)]


def pulley_groove_polygon(tp: TimingWheelParams) -> Polygon:
    """One groove, wrapped onto the pulley: each of the tooth's own four
    corners (u, v), evaluated at phi=0 (rack_point_to_gear_frame), traces
    the tooth's correctly-curved outline directly -- no sweep/union, since
    the shape is given, not derived (module docstring)."""
    r = tp.outside_radius
    pts = belt_tooth_points(tp._belt(), clearance=tp.clearance_mm)
    return Polygon([rack_point_to_gear_frame(0.0, u, v, r) for u, v in pts])


def full_pulley_polygon(tp: TimingWheelParams) -> Polygon:
    one_groove = pulley_groove_polygon(tp)
    blank = Point(0.0, 0.0).buffer(tp.outside_radius, quad_segs=max(360, 8 * tp.z))
    pitch_deg = 360.0 / tp.z
    all_grooves = unary_union([shapely_rotate(one_groove, k * pitch_deg, origin=(0, 0)) for k in range(tp.z)])
    disc = blank.difference(all_grooves)
    if tp.bore_diameter_mm > 0:
        disc = disc.difference(Point(0.0, 0.0).buffer(tp.bore_diameter_mm / 2.0, quad_segs=200))
    return disc


def full_pulley_outline(tp: TimingWheelParams, simplify_tolerance_mm: float = 0.01) -> list[tuple[float, float]]:
    poly = full_pulley_polygon(tp)
    if poly.geom_type == "MultiPolygon":
        poly = max(poly.geoms, key=lambda g: g.area)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords


def belt_strip_polygon(bp: TimingBeltParams) -> Polygon:
    """The flat belt's own cross-section (in its length/height plane):
    n_teeth teeth at pitch bp.belt_pitch_mm, pointing to -v (this module's
    convention: root at v=0, tip at v=+tooth_height, so the tooth material
    below v=0 removed here is drawn as the solid CONTAINS v in
    [-belt_thickness, tooth_height], teeth pointing toward +v -- flip
    below), backing of belt_thickness_mm behind them."""
    n, p = bp.n_teeth, bp.belt_pitch_mm
    half_len = n * p / 2.0
    pts = [(-half_len, -bp.belt_thickness), (half_len, -bp.belt_thickness)]
    tooth = belt_tooth_points(bp)   # (u, v), u in [-root/2, root/2], v in [0, h]
    right_side = [(u, v) for u, v in tooth if u >= 0][::-1]      # tip -> root, on the +u side
    left_side = [(u, v) for u, v in tooth if u <= 0]             # root -> tip, on the -u side
    top = [(half_len, 0.0)]
    for k in range(n - 1, -1, -1):
        cx = -half_len + (k + 0.5) * p
        top += [(cx + u, v) for u, v in right_side] + [(cx + u, v) for u, v in left_side]
    top += [(-half_len, 0.0)]
    return Polygon(pts + top)


def build_pulley_solid(tp: TimingWheelParams) -> bd.Part:
    pts = [tuple(p) for p in full_pulley_outline(tp)]
    with bd.BuildPart() as part:
        with bd.BuildSketch() as sk:
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.extrude(amount=tp.face_width_mm)
    return part.part


def build_timing_belt_solid(bp: TimingBeltParams) -> bd.Part:
    poly = belt_strip_polygon(bp)
    poly = poly.simplify(0.001, preserve_topology=True)
    pts = [tuple(p) for p in poly.exterior.coords][:-1]
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ) as sk:
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.extrude(amount=bp.belt_width_mm)
    return part.part


def place_belt_tooth(tooth_solid, tp: TimingWheelParams, k: float = 0.0):
    """tooth_solid: one tooth of build_timing_belt_solid's own shape (a
    single-tooth version, see tests) -- placed seated in groove k around
    the pulley, for the cross-check every family in this project runs."""
    ang_deg = k * 360.0 / tp.z
    return tooth_solid.rotate(bd.Axis.Z, ang_deg)
