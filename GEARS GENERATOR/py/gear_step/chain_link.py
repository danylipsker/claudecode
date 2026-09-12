"""
One pitch length of roller chain -- an inner link pinned into an outer
link, the repeating unit a sprocket (sprocket.py) drives. docs/gear-math.md
section 19.

A real roller chain link is five part TYPES, ten parts per pitch:

    outer link:  2 outer plates, 2 pins (press-fit into the outer plates,
                 free to rotate inside the bushings)
    inner link:  2 inner plates, 2 bushings (press-fit into the inner
                 plates, the pins turn inside them), 2 rollers (free to
                 rotate around the bushings -- what actually touches the
                 sprocket tooth)

built here as ten actual solids, correctly sized and positioned, not a
single simplified block: the pin-to-pin spacing is exactly the chain
pitch (the same pitch a matching Sprocket is built from) and the rollers
are exactly the chain's own roller diameter, both dimensions verified
directly against a built sprocket, the same "does the real mating part
actually fit" check every family in this project runs -- here, for once,
literally the real mating part, not a stand-in circle.

Plate shape: a stadium (two equal-radius circular lobes around the pin/
bushing holes, joined by straight tangent sides) -- a real chain plate is
usually waisted narrower in the middle to save weight (a distinctive
figure-8 silhouette); this is a stated v1 simplification, still correctly
holed and pitched.

Sizes not fixed by the chain standard's pitch/roller table (pin diameter,
plate thickness, bushing/lobe proportions) follow simple, documented
ratios of the pitch and roller diameter that hold roughly across common
chain sizes, overridable directly -- the same "reference default,
freely overridable" pattern as every other family's non-table-driven
dimensions.

Checks (tests/test_chain_link.py): the two pin (and bushing, and roller)
centres are exactly chain_pitch_mm apart; every rotating pair (pin in
bushing, bushing in roller) clears with the stated clearance, touching
neither, and press-fit pairs (pin in outer plate, bushing in inner plate)
match exactly; ten solids, all valid and manifold; **the roller seats in
a matching Sprocket's tooth gap with only sliver overlap, and collides
turned half a pitch onto a tooth instead** -- the real link against the
real wheel, both built by this project's own code, not a roller-diameter
stand-in on either side.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd


@dataclass
class ChainLinkParams:
    chain_pitch_mm: float
    roller_diameter_mm: float
    pin_diameter_mm: float = 0.0          # 0 = auto: 0.5 * roller diameter
    plate_thickness_mm: float = 0.0       # 0 = auto: 0.15 * chain pitch
    inner_width_mm: float = 0.0           # 0 = auto: roller diameter + running clearance (the roller's own axial span)
    bushing_outer_diameter_mm: float = 0.0  # 0 = auto: 0.85 * roller diameter (must clear inside the roller)
    running_clearance_mm: float = 0.1     # radial, each rotating pair; also the outer/inner plate face gap
    press_fit_allowance_mm: float = 0.0   # 0 = a exact (non-interference) nominal fit for the two press-fit pairs

    @classmethod
    def from_sprocket_params(cls, sp, **kw) -> "ChainLinkParams":
        """A link sized to seat in a specific sprocket.SprocketParams."""
        return cls(chain_pitch_mm=sp.chain_pitch_mm, roller_diameter_mm=sp.roller_diameter_mm, **kw)

    @property
    def pin_diameter(self) -> float:
        return self.pin_diameter_mm if self.pin_diameter_mm > 0 else 0.5 * self.roller_diameter_mm

    @property
    def plate_thickness(self) -> float:
        return self.plate_thickness_mm if self.plate_thickness_mm > 0 else 0.15 * self.chain_pitch_mm

    @property
    def inner_width(self) -> float:
        return self.inner_width_mm if self.inner_width_mm > 0 else self.roller_diameter_mm + 2.0 * self.running_clearance_mm

    @property
    def bushing_outer_diameter(self) -> float:
        return self.bushing_outer_diameter_mm if self.bushing_outer_diameter_mm > 0 else 0.85 * self.roller_diameter_mm

    @property
    def bushing_inner_diameter(self) -> float:
        """The pin turns inside the bushing: a running clearance."""
        return self.pin_diameter + 2.0 * self.running_clearance_mm

    @property
    def lobe_diameter(self) -> float:
        """A plate's own two round ends: as much material around its hole
        as the plate itself is thick, all the way round."""
        return self.pin_diameter + 2.0 * self.plate_thickness

    @property
    def outer_lobe_diameter(self) -> float:
        return self.pin_diameter + 2.0 * self.plate_thickness

    @property
    def inner_lobe_diameter(self) -> float:
        return self.bushing_outer_diameter + 2.0 * self.plate_thickness

    @property
    def total_width(self) -> float:
        """Outer face to outer face, along the pin axis (Z)."""
        return self.inner_width + 2.0 * self.plate_thickness + 2.0 * self.running_clearance_mm


def _stadium_polygon(hole_diameter: float, pitch: float) -> list[tuple[float, float]]:
    """A plate's own outline: two circles of radius = hole_diameter/2 +
    the same wall thickness the diameter already encodes (lobe_diameter
    computed by the caller), centres pitch apart on the X axis, joined by
    straight tangent lines (equal radii -- the tangent is just offset by
    the radius, no construction needed beyond that)."""
    r = hole_diameter / 2.0
    n = 32
    pts = []
    for i in range(n + 1):   # right lobe, far side around to near side
        a = -math.pi / 2.0 + math.pi * i / n
        pts.append((pitch + r * math.cos(a), r * math.sin(a)))
    for i in range(n + 1):   # left lobe, continuing the same turn
        a = math.pi / 2.0 + math.pi * i / n
        pts.append((r * math.cos(a), r * math.sin(a)))
    return pts


def _plate_solid(lobe_diameter: float, hole_diameter: float, pitch: float, thickness: float) -> bd.Part:
    outline = _stadium_polygon(lobe_diameter, pitch)
    with bd.BuildPart() as part:
        with bd.BuildSketch() as sk:
            with bd.BuildLine():
                bd.Polyline(*outline, outline[0])
            bd.make_face()
            # Locations must wrap the primitive's OWN construction -- a
            # Circle(mode=SUBTRACT) applies its boolean the instant it's
            # built, at the origin; a later .located(...) call only
            # relocates the returned object, it does not redo the
            # subtraction there. The bug this was: both circles landed at
            # x=0 (the second one redundant with the first), leaving x=pitch
            # solid -- not caught by is_valid/manifold checks (a fully solid
            # plate is perfectly valid), only by a pin actually failing to
            # pass through it.
            with bd.Locations((0.0, 0.0, 0.0), (pitch, 0.0, 0.0)):
                bd.Circle(hole_diameter / 2.0, mode=bd.Mode.SUBTRACT)
        bd.extrude(amount=thickness)
    return part.part


def _tube_solid(outer_diameter: float, inner_diameter: float, length: float) -> bd.Part:
    with bd.BuildPart() as part:
        with bd.BuildSketch():
            bd.Circle(outer_diameter / 2.0)
            if inner_diameter > 0:
                bd.Circle(inner_diameter / 2.0, mode=bd.Mode.SUBTRACT)
        bd.extrude(amount=length)
    return part.part


def build_chain_link_parts(cp: ChainLinkParams) -> dict[str, bd.Part]:
    """Every one of the ten parts, positioned in the assembly: X = along
    the chain (the two pin centres at x=0 and x=chain_pitch_mm), Z = the
    pin axis (0 at the assembly's own mid-width, matching the pitch
    circle's own Z=0 mid-face convention elsewhere in this project)."""
    hw = cp.total_width / 2.0
    z_outer_far = hw - cp.plate_thickness         # outer plate spans [z_outer_far, hw] (and mirrored)
    z_inner_far = cp.inner_width / 2.0 + cp.plate_thickness  # inner plate spans [inner_width/2, z_inner_far]

    # _plate_solid sketches on the default XY plane and extrudes along its
    # own +Z by `thickness` -- already thickness-along-Z, exactly what
    # stacking plates along the assembly's Z (the pin axis) needs, so a
    # plain Z translate positions each one with no reorientation.
    outer_plate_a = _plate_solid(cp.outer_lobe_diameter, cp.pin_diameter, cp.chain_pitch_mm, cp.plate_thickness) \
        .translate((0.0, 0.0, hw))
    outer_plate_b = _plate_solid(cp.outer_lobe_diameter, cp.pin_diameter, cp.chain_pitch_mm, cp.plate_thickness) \
        .translate((0.0, 0.0, -z_outer_far))
    inner_plate_a = _plate_solid(cp.inner_lobe_diameter, cp.bushing_outer_diameter, cp.chain_pitch_mm, cp.plate_thickness) \
        .translate((0.0, 0.0, cp.inner_width / 2.0))
    inner_plate_b = _plate_solid(cp.inner_lobe_diameter, cp.bushing_outer_diameter, cp.chain_pitch_mm, cp.plate_thickness) \
        .translate((0.0, 0.0, -z_inner_far))

    def at_pin(x: float, solid: bd.Part) -> bd.Part:
        return solid.translate((x, 0.0, -hw))

    pins = [at_pin(x, _tube_solid(cp.pin_diameter, 0.0, cp.total_width)) for x in (0.0, cp.chain_pitch_mm)]
    bushings = [at_pin(x, _tube_solid(cp.bushing_outer_diameter, cp.bushing_inner_diameter, cp.inner_width)
                        .translate((0.0, 0.0, hw - cp.inner_width / 2.0)))
                for x in (0.0, cp.chain_pitch_mm)]
    rollers = [at_pin(x, _tube_solid(cp.roller_diameter_mm, cp.bushing_outer_diameter + 2.0 * cp.running_clearance_mm,
                                     cp.inner_width).translate((0.0, 0.0, hw - cp.inner_width / 2.0)))
               for x in (0.0, cp.chain_pitch_mm)]

    return {
        "outer_plate_a": outer_plate_a, "outer_plate_b": outer_plate_b,
        "inner_plate_a": inner_plate_a, "inner_plate_b": inner_plate_b,
        "pin_0": pins[0], "pin_1": pins[1],
        "bushing_0": bushings[0], "bushing_1": bushings[1],
        "roller_0": rollers[0], "roller_1": rollers[1],
    }


def build_chain_link_assembly(cp: ChainLinkParams) -> bd.Compound:
    parts = build_chain_link_parts(cp)
    return bd.Compound(children=list(parts.values()))
