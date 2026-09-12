"""
Sprocket wheels for roller chain, per ANSI B29.1 / ISO 606. docs/gear-math.md
section 18.

Pitch circle. N rollers, chain pitch p, connected by rigid pitch-length
links: fully wrapped and taut, they sit at the N vertices of a regular
N-gon of side p, so the pitch circle radius is the standard
    R = p / (2 sin(pi/N))
(unchanged whether the chain is ANSI-inch or ISO-metric).

Tooth gaps. Above everything else, a gap must SEAT a chain roller (a plain
cylinder of the chain's own diameter) with its centre exactly at the gap's
own pitch-circle vertex, without interference: that is the one requirement
every sprocket standard's tooth form exists to satisfy, and it is also the
one this module builds and verifies directly.

A first attempt tried to generate the flank as the envelope of the
roller's own approach motion -- the natural instinct, and exactly how this
project generates every OTHER family's tooth form -- but that does not
apply here: once a roller is seated it moves RIGIDLY with the sprocket, no
further relative sliding to sweep, and the transient swing-in as a roller
first engages depends on which direction the chain approaches from, which
a sprocket's own tooth form cannot depend on. A second attempt cut each
gap with a plain circle (radius = roller radius) at the vertex alone --
correct for seating, but for realistic roller/pitch ratios two adjacent
seat circles never come close to touching at any radius, so the material
between them never tapers: the result is a disc with round notches
punched in it, not a sprocket (confirmed by rendering it, not just by
argument -- the measured minimum top land, scanned over the circle's own
radial extent, bottomed out around a roller radius no matter where the
outside diameter was set).

**What actually gives a proper tapered tooth**: the material a gap removes
must WIDEN outward from the root, so the material left BETWEEN two
adjacent gaps -- the tooth -- narrows to a tip, the mirror image of how an
ordinary gear tooth's own flank narrows outward from its base. Built
directly: the seat circle handles the root (the roller nests there,
unchanged from the second attempt), blended into a wedge whose half-width
equals the seat radius where it meets the circle and grows at a fixed
flank_angle_deg per unit radius beyond it, out to the outside diameter --
verified over a>10x range of tooth counts and two different chain sizes to
seat a real chain roller with (exactly, by construction) zero overlap and
to collide substantially with the same roller placed half a pitch off.

Outside diameter is a free design choice; the auto default follows the
widely-published quick-reference approximation OD = PD + 0.8*Dr (pitch
diameter plus 0.8 chain-roller diameters), overridable directly.

Checks (tests/test_sprocket.py): the pitch diameter matches the closed-form
regular-polygon formula; the built profile is one valid, simply-connected,
z-fold-symmetric polygon; a chain roller of the sprocket's own diameter,
placed at every pitch position, does not overlap the built profile at all
(seats with exactly the design clearance -- the same "does the real mating
part actually fit" check every other family in this project runs), while
the same roller placed half a pitch off (squarely on a tooth, not a gap)
collides substantially, over several tooth counts and chain sizes.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

from shapely.affinity import rotate as shapely_rotate
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

# ANSI B29.1 standard single-strand roller chain: (pitch_in, max_roller_diameter_in).
# Standard reference dimensions (as widely published in chain manufacturer
# catalogs and Machinery's Handbook) -- check a specific manufacturer's table
# for a certified application; chain_pitch_mm/roller_diameter_mm can always
# be set directly instead of going through the chain number.
ANSI_CHAIN_TABLE_IN: dict[str, tuple[float, float]] = {
    "25": (0.250, 0.130), "35": (0.375, 0.200), "40": (0.500, 0.312),
    "41": (0.500, 0.306), "50": (0.625, 0.400), "60": (0.750, 0.469),
    "80": (1.000, 0.625), "100": (1.250, 0.750), "120": (1.500, 0.875),
    "140": (1.750, 1.000), "160": (2.000, 1.125), "180": (2.250, 1.406),
    "200": (2.500, 1.562), "240": (3.000, 1.875),
}
INCH_MM = 25.4


@dataclass
class SprocketParams:
    z: int                                  # number of teeth
    chain_pitch_mm: float                   # p
    roller_diameter_mm: float               # chain roller's own (max) diameter
    face_width_mm: float = 6.0
    outside_diameter_mm: float = 0.0        # 0 = auto: PD + 0.8 * roller diameter
    bore_diameter_mm: float = 0.0
    clearance_mm: float = 0.05              # roller-to-seat running clearance (radius, each side)
    flank_angle_deg: float = 20.0           # how fast the gap widens outward from the seat -- tooth taper

    @classmethod
    def from_ansi_chain_number(cls, number: str, z: int, **kw) -> "SprocketParams":
        pitch_in, roller_in = ANSI_CHAIN_TABLE_IN[str(number)]
        return cls(z=z, chain_pitch_mm=pitch_in * INCH_MM, roller_diameter_mm=roller_in * INCH_MM, **kw)

    @property
    def pitch_angle_rad(self) -> float:
        return 2.0 * math.pi / self.z

    @property
    def pitch_radius(self) -> float:
        """R = p / (2 sin(pi/z)): the regular z-gon a taut, fully-wrapped
        chain's roller centers sit on, side length = the chain pitch."""
        return self.chain_pitch_mm / (2.0 * math.sin(math.pi / self.z))

    @property
    def pitch_diameter(self) -> float:
        return 2.0 * self.pitch_radius

    @property
    def roller_radius(self) -> float:
        return self.roller_diameter_mm / 2.0

    @property
    def seat_radius(self) -> float:
        """The seat circle's own radius: the roller's radius plus a
        running clearance, so a real roller of exactly roller_diameter_mm
        seats with a little room, not an interference fit."""
        return self.roller_radius + self.clearance_mm

    @property
    def outside_radius(self) -> float:
        if self.outside_diameter_mm > 0:
            return self.outside_diameter_mm / 2.0
        return 0.5 * self.pitch_diameter + 0.4 * self.roller_diameter_mm  # OD = PD + 0.8 Dr

    @property
    def outside_diameter(self) -> float:
        return 2.0 * self.outside_radius

    @property
    def root_clearance_mm(self) -> float:
        """How much wider the chain pitch is than two seat circles side by
        side -- must be positive (the two circles flanking a gap must not
        already touch) for a valid tooth to exist at all; the derived
        values warn if not."""
        return self.chain_pitch_mm - 2.0 * self.seat_radius


def gap_polygon(sp: SprocketParams) -> Polygon:
    """One gap: the seat circle (root, centred on the pitch circle, +Y
    axis -- this module's convention, matching involute.py's own
    "tooth/gap centred on +Y") blended into a wedge that widens outward at
    flank_angle_deg, out past the outside diameter (so the blank's own
    outer circle, not this wedge, cleanly bounds the tip)."""
    r = sp.pitch_radius
    rho = sp.seat_radius
    beta = math.radians(sp.flank_angle_deg)
    seat = Point(0.0, r).buffer(rho, quad_segs=64)
    y0, y1 = r, sp.outside_radius + 1.0
    hw0, hw1 = rho, rho + (y1 - r) * math.tan(beta)
    wedge = Polygon([(-hw0, y0), (-hw1, y1), (hw1, y1), (hw0, y0)])
    return unary_union([seat, wedge])


def full_sprocket_polygon(sp: SprocketParams):
    """The complete sprocket cross-section: an outside-diameter blank with
    all z gaps cut by the (rotationally patterned) gap wedge, minus a
    central bore."""
    one_gap = gap_polygon(sp)
    blank = Point(0.0, 0.0).buffer(sp.outside_radius, quad_segs=max(360, 8 * sp.z))
    pitch_deg = 360.0 / sp.z
    all_gaps = unary_union([shapely_rotate(one_gap, k * pitch_deg, origin=(0, 0)) for k in range(sp.z)])
    disc = blank.difference(all_gaps)
    if sp.bore_diameter_mm > 0:
        disc = disc.difference(Point(0.0, 0.0).buffer(sp.bore_diameter_mm / 2.0, quad_segs=200))
    return disc


def full_sprocket_outline(sp: SprocketParams, simplify_tolerance_mm: float = 0.01) -> list[tuple[float, float]]:
    """The outer boundary of full_sprocket_polygon, Douglas-Peucker
    simplified (involute.full_gear_outline's docstring: the dense-enough
    circular arcs are exact but denser than any STEP export needs; default
    10 microns is far tighter than any real machining tolerance, and cuts
    the point count by ~3.8x versus 1 micron -- 731 vs 2764 for a 20-tooth
    #40 sprocket)."""
    poly = full_sprocket_polygon(sp)
    if poly.geom_type == "MultiPolygon":
        poly = max(poly.geoms, key=lambda g: g.area)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords
