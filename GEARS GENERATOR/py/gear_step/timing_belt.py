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
rack_point_to_gear_frame at phi=0 across the tooth's own boundary points,
and the result is the groove's own correctly-curved outline directly -- no
envelope/union needed, because the tooth's shape is GIVEN, not derived the
way an involute flank is from the rack's straight edge.

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

Standard sizes (TIMING_BELT_STANDARDS): named, purchasable pitches -- the
classic trapezoidal inch series (MXL/XL/L/H/XH/XXH), the metric trapezoidal
ISO 5296 T-series (T2.5/T5/T10/T20), and the modern curvilinear series
(GT2, the 2 mm pitch belt ubiquitous in 3D printing; HTD 3M/5M/8M/14M) --
selected the same way sprocket.py's chain-number table is: pick a name, get
a correctly-scaled pitch, still free to override any dimension directly.
The trapezoidal-vs-curvilinear distinction is real, not decorative: a
curvilinear tooth is rounded, a trapezoidal one is closer to flat-sided,
and TimingBeltParams.curvilinear sets a correspondingly larger default
fillet radius (fillet_radius, applied to a plain trapezoid by eroding then
re-dilating its corners -- shapely's own robust way to round a polygon's
corners, chosen deliberately over hand-placing tangent circles: this
project has twice gotten that by-hand placement backwards before, on the
rack and worm root fillets, and a library operation that cannot be
"backwards" removes the whole failure mode). This is a stated
approximation of the real (patented, and in any case not something this
project's author has exact figures for) curvilinear arc geometry, not a
transcribed manufacturer drawing -- see docs/gear-math.md 20 for what is
and is not standards-derived here.

The belt itself (build_timing_belt_solid) is simpler still: flat, so no
wrapping needed at all -- literally rack.py's own construction (a flat bar
with a repeating tooth profile), teeth on one face, at the same pitch.

Checks (tests/test_timing_belt.py): the pulley's pitch radius matches the
closed-form z*p/(2*pi); the built pulley is one valid, z-fold-symmetric
solid, sharp or filleted; every standard table entry builds; **a belt
tooth, wrapped by rack_point_to_gear_frame called directly (not through
this module's own wrapper), seated at every pitch position around the
pulley overlaps it by only floating-point noise, and collides
substantially half a pitch off** -- the same "does the real mating part
actually fit" check every family in this project runs, now including the
filleted profile.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from shapely.affinity import rotate as shapely_rotate
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

from involute import rack_point_to_gear_frame

# Named standard pitches. Trapezoidal entries (curvilinear=False) are the
# classic inch series (MXL/XL/L/H/XH/XXH) and the metric ISO 5296 T-series;
# curvilinear entries (GT2, HTD) are the modern rounded-tooth series --
# GT2 at 2 mm pitch is the belt used in almost every 3D printer and small
# robot. Pitches themselves are exact (they are how each size is named and
# sold); tooth height/width/fillet are this module's own reasonable,
# stated-as-such proportions of the pitch, not transcribed from a
# manufacturer's drawing (docs/gear-math.md 20).
TIMING_BELT_STANDARDS: dict[str, dict] = {
    "MXL": dict(pitch_mm=2.032, curvilinear=False),
    "XL": dict(pitch_mm=5.08, curvilinear=False),
    "L": dict(pitch_mm=9.525, curvilinear=False),
    "H": dict(pitch_mm=12.7, curvilinear=False),
    "XH": dict(pitch_mm=22.225, curvilinear=False),
    "XXH": dict(pitch_mm=31.75, curvilinear=False),
    "T2.5": dict(pitch_mm=2.5, curvilinear=False),
    "T5": dict(pitch_mm=5.0, curvilinear=False),
    "T10": dict(pitch_mm=10.0, curvilinear=False),
    "T20": dict(pitch_mm=20.0, curvilinear=False),
    "GT2": dict(pitch_mm=2.0, curvilinear=True),
    "HTD 3M": dict(pitch_mm=3.0, curvilinear=True),
    "HTD 5M": dict(pitch_mm=5.0, curvilinear=True),
    "HTD 8M": dict(pitch_mm=8.0, curvilinear=True),
    "HTD 14M": dict(pitch_mm=14.0, curvilinear=True),
}


@dataclass
class TimingBeltParams:
    belt_pitch_mm: float
    belt_type: str = ""                 # a TIMING_BELT_STANDARDS key, informational
    curvilinear: bool = False           # sets a larger auto fillet_radius
    tooth_height_mm: float = 0.0        # 0 = auto: 0.3 * pitch
    tooth_root_width_mm: float = 0.0    # 0 = auto: 0.5 * pitch (at the belt's backing)
    tooth_tip_width_mm: float = 0.0     # 0 = auto: 0.35 * pitch (narrower, at the tooth's tip)
    fillet_radius_mm: float = 0.0       # 0 = auto: see fillet_radius
    belt_thickness_mm: float = 0.0      # 0 = auto: 0.4 * pitch (backing behind the teeth)
    belt_width_mm: float = 10.0
    n_teeth: int = 12                   # how many teeth the modelled belt segment has

    @classmethod
    def from_standard(cls, name: str, **kw) -> "TimingBeltParams":
        entry = TIMING_BELT_STANDARDS[name]
        return cls(belt_pitch_mm=entry["pitch_mm"], belt_type=name, curvilinear=entry["curvilinear"], **kw)

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
    def fillet_radius(self) -> float:
        """0.15 tooth heights for a trapezoidal profile (a modest root/tip
        break, matching how T-/L-/H-series teeth actually look -- mostly
        flat-sided); 0.35 for curvilinear (a visibly rounded tooth, the
        real distinguishing look of GT2/HTD) -- see the module docstring
        for why this is an approximation, not exact patented geometry."""
        if self.fillet_radius_mm > 0:
            return self.fillet_radius_mm
        return (0.35 if self.curvilinear else 0.15) * self.tooth_height

    @property
    def belt_thickness(self) -> float:
        return self.belt_thickness_mm if self.belt_thickness_mm > 0 else 0.4 * self.belt_pitch_mm


@dataclass
class TimingWheelParams:
    z: int
    belt_pitch_mm: float
    belt_type: str = ""
    curvilinear: bool = False
    tooth_height_mm: float = 0.0
    tooth_root_width_mm: float = 0.0
    tooth_tip_width_mm: float = 0.0
    fillet_radius_mm: float = 0.0
    clearance_mm: float = 0.1           # groove enlarged this much, each side, for a running fit
    face_width_mm: float = 10.0
    bore_diameter_mm: float = 0.0

    @classmethod
    def from_standard(cls, name: str, z: int, **kw) -> "TimingWheelParams":
        entry = TIMING_BELT_STANDARDS[name]
        return cls(z=z, belt_pitch_mm=entry["pitch_mm"], belt_type=name, curvilinear=entry["curvilinear"], **kw)

    def _belt(self) -> TimingBeltParams:
        return TimingBeltParams(belt_pitch_mm=self.belt_pitch_mm, belt_type=self.belt_type, curvilinear=self.curvilinear,
                                tooth_height_mm=self.tooth_height_mm, tooth_root_width_mm=self.tooth_root_width_mm,
                                tooth_tip_width_mm=self.tooth_tip_width_mm, fillet_radius_mm=self.fillet_radius_mm)

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
    """One tooth's boundary in the rack/belt's own flat frame -- v=0 at the
    root (the belt's backing surface), v=+tooth_height at the tip
    (rack_point_to_gear_frame's convention: v grows TOWARD the gear axis,
    i.e. deeper into the pulley). The sharp trapezoid's 4 corners, rounded
    by fillet_radius if positive (module docstring: erode then re-dilate,
    not hand-placed tangent circles); clearance is then a further, PLAIN
    outward offset of that already-rounded shape (buffer(+clearance)), not
    a re-derivation from wider sharp corners -- so the pulley groove
    (clearance > 0) is exactly the nominal tooth (clearance = 0) pushed
    out uniformly, and the two can never disagree at the rounded corners
    the way "widen the sharp trapezoid, then round the wider one" did (a
    real, if small, mismatch this construction had until measured: seating
    a nominal tooth showed a ~0.3% overlap at a clearance smaller than the
    fillet radius, zero once the fix below was applied)."""
    hw_root = bp.tooth_root_width / 2.0
    hw_tip = bp.tooth_tip_width / 2.0
    h = bp.tooth_height
    sharp = [(hw_root, 0.0), (hw_tip, h), (-hw_tip, h), (-hw_root, 0.0)]
    rho = bp.fillet_radius
    shape = Polygon(sharp)
    if rho > 1e-9:
        rounded = shape.buffer(-rho, join_style=1, quad_segs=12).buffer(rho, join_style=1, quad_segs=12)
        if rounded.geom_type == "Polygon" and rounded.is_valid and not rounded.is_empty:
            shape = rounded   # else: fillet too large for this tooth's own proportions -- degrade to sharp
    if clearance > 1e-9:
        shape = shape.buffer(clearance, join_style=1, quad_segs=12)
        if shape.geom_type != "Polygon" or not shape.is_valid:
            raise ValueError(f"timing belt: clearance {clearance} produced an invalid tooth outline")
    # Snap the root line to exactly v = 0. buffer(-r).buffer(+r) hands the
    # root edge back at v = +3e-17 for some pitches, and a tooth whose root
    # floats 3e-17 ABOVE the backing's top edge does not merge with it in
    # unary_union: six of the fifteen standard sizes silently lost every
    # tooth that way while the other nine (root at exactly 0.0) were fine
    # -- docs/gear-math.md 20.2.
    return [(u, 0.0 if abs(v) < 1e-9 else v) for u, v in list(shape.exterior.coords)[:-1]]


def pulley_groove_polygon(tp: TimingWheelParams) -> Polygon:
    """One groove, wrapped onto the pulley: each of the tooth's own
    boundary points, evaluated at phi=0 (rack_point_to_gear_frame), traces
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
    n_teeth teeth at pitch bp.belt_pitch_mm, pointing to +v (root at v=0,
    tip at v=+tooth_height), backing of belt_thickness_mm behind them.

    Built as a union (backing rectangle + one tooth polygon per position),
    not by splicing each tooth's boundary points into one long outline by
    hand: a filleted tooth's point ORDER (from Polygon.buffer, which
    starts wherever it starts and winds whichever way it winds) has no
    reason to match the sharp trapezoid's own (root, tip, tip, root)
    order, so an index-based left/right split silently produced a
    self-intersecting outline for any nonzero fillet -- caught by
    rendering it, not by validity alone (a self-intersecting polygon
    still LOOKS like a boundary in a quick print of its point count).
    Union sidesteps the ordering question entirely: each tooth is its own
    already-closed, already-correct polygon, and shapely worries about
    how they combine with the backing.

    If the union does NOT come back as one polygon, that is an error, not
    something to paper over: the first version of this function fell back
    to "keep the largest piece", which quietly returned the bare backing
    bar -- a perfectly valid polygon of exactly the right length, and no
    teeth -- for six of the fifteen standards (belt_tooth_points)."""
    n, p = bp.n_teeth, bp.belt_pitch_mm
    half_len = n * p / 2.0
    backing = Polygon([(-half_len, -bp.belt_thickness), (half_len, -bp.belt_thickness),
                       (half_len, 0.0), (-half_len, 0.0)])
    tooth = Polygon(belt_tooth_points(bp))
    teeth = [_translate_poly(tooth, -half_len + (k + 0.5) * p, 0.0) for k in range(n)]
    poly = unary_union([backing] + teeth)
    if poly.geom_type != "Polygon":
        raise ValueError(f"timing belt: the {n} teeth did not all merge with the backing (got {poly.geom_type})")
    return poly


def _translate_poly(poly: Polygon, dx: float, dy: float) -> Polygon:
    return Polygon([(x + dx, y + dy) for x, y in poly.exterior.coords])


def build_pulley_solid(tp: TimingWheelParams) -> bd.Part:
    """full_pulley_outline is the EXTERIOR ring only (the 2-D view draws one
    polyline), so the bore -- an interior ring of full_pulley_polygon -- must
    be cut here explicitly. It was not, in the first version: the pulley
    (and the sprocket, same construction) came out as a solid disc no matter
    what bore was asked for, and every validity/manifold/STEP check passed on
    it -- caught only by asking whether there is material on the axis."""
    pts = [tuple(p) for p in full_pulley_outline(tp)]
    with bd.BuildPart() as part:
        with bd.BuildSketch():
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
            if tp.bore_diameter_mm > 0:
                bd.Circle(tp.bore_diameter_mm / 2.0, mode=bd.Mode.SUBTRACT)   # centred on the axis: no Locations needed
        bd.extrude(amount=tp.face_width_mm)
    return part.part


def build_timing_belt_solid(bp: TimingBeltParams) -> bd.Part:
    poly = belt_strip_polygon(bp)   # one polygon, or it raises
    poly = poly.simplify(0.001, preserve_topology=True)
    pts = [tuple(p) for p in poly.exterior.coords][:-1]
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ) as sk:
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.extrude(amount=bp.belt_width_mm)
    return part.part
