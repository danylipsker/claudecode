"""
Crossed-helical (screw) gear pairs: two helical gears on non-parallel,
non-intersecting shafts -- docs/gear-math.md section 7.5.

Each member is an ordinary helical gear (involute.GearParams, built by
build_gear.build_gear_solid -- nothing new in the tooth geometry). What a
PAIR adds is the relationship between the two members and their placement:

    shaft angle   Sigma = beta1 + beta2        same hand (the usual case)
                  Sigma = |beta1 - beta2|      opposite hands
    common NORMAL module m_n and normal pressure angle alpha_n
    pitch diameters d_i = m_n * z_i / cos(beta_i)
    centre distance a = (d1 + d2) / 2
    ratio = z2 / z1 (independent of the helix angles, unlike a worm pair)

Contact is a single point, where the two pitch cylinders touch on the
common perpendicular of the axes -- which is why screw gears carry little
load, and also why the mesh is fully determined by the numbers above plus
the tooth phase at that point. build_crossed_helical_pair sets that phase,
and tests/test_crossed_helical.py checks it by measuring the boolean
intersection of the two positioned solids: (near) zero for the correct
placement, and a clear collision for the same pair mis-phased by half a
pitch -- so the check is known to be able to fail.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd

from involute import GearParams


@dataclass
class CrossedHelicalPairParams:
    z1: int
    z2: int
    module_mm: float                     # NORMAL module, common to both members
    helix1_deg: float = 45.0             # gear 1's helix angle
    shaft_angle_deg: float = 90.0        # Sigma, the angle between the two axes
    hand: str = "right"                  # gear 1's hand; gear 2's follows from Sigma (helix2_signed_deg)
    pressure_angle_deg: float = 20.0     # NORMAL pressure angle
    profile_shift: float = 0.0
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38
    backlash_mm: float = 0.0
    face_width_mm: float = 10.0          # gear 1
    face_width2_mm: float | None = None  # gear 2; None = same as gear 1
    bore_diameter_mm: float = 0.0        # gear 1
    bore_diameter2_mm: float | None = None

    # -- the relationship ---------------------------------------------------

    @property
    def helix2_signed_deg(self) -> float:
        """beta2. Positive: gear 2 has the SAME hand as gear 1 (Sigma = beta1
        + beta2). Negative: Sigma < beta1, so gear 2 must take the opposite
        hand with |beta2| (Sigma = beta1 - |beta2|). Zero: gear 2 is a spur
        gear (Sigma = beta1). All three are legitimate crossed pairs."""
        return self.shaft_angle_deg - self.helix1_deg

    @property
    def helix2_deg(self) -> float:
        return abs(self.helix2_signed_deg)

    @property
    def hand2(self) -> str:
        if self.helix2_signed_deg >= -1e-9:
            return self.hand
        return "left" if self.hand == "right" else "right"

    def _common(self) -> dict:
        return dict(
            module_mm=self.module_mm,
            pressure_angle_deg=self.pressure_angle_deg,
            profile_shift=self.profile_shift,
            addendum_coeff=self.addendum_coeff,
            dedendum_coeff=self.dedendum_coeff,
            root_fillet_coeff=self.root_fillet_coeff,
            backlash_mm=self.backlash_mm,
        )

    def gear1_params(self) -> GearParams:
        return GearParams(z=self.z1, helix_angle_deg=self.helix1_deg, hand=self.hand,
                          face_width_mm=self.face_width_mm, bore_diameter_mm=self.bore_diameter_mm,
                          **self._common())

    def gear2_params(self) -> GearParams:
        fw = self.face_width_mm if self.face_width2_mm is None else self.face_width2_mm
        bore = self.bore_diameter_mm if self.bore_diameter2_mm is None else self.bore_diameter2_mm
        return GearParams(z=self.z2, helix_angle_deg=self.helix2_deg, hand=self.hand2,
                          face_width_mm=fw, bore_diameter_mm=bore, **self._common())

    @property
    def pitch_diameter1_mm(self) -> float:
        return 2.0 * self.gear1_params().pitch_radius

    @property
    def pitch_diameter2_mm(self) -> float:
        return 2.0 * self.gear2_params().pitch_radius

    @property
    def center_distance_mm(self) -> float:
        """a = r1 + r2 -- the pitch cylinders touch at one point on the
        common perpendicular of the two axes."""
        return (self.pitch_diameter1_mm + self.pitch_diameter2_mm) / 2.0

    @property
    def ratio(self) -> float:
        return self.z2 / self.z1


def build_crossed_helical_pair(pp: CrossedHelicalPairParams, simplify_tolerance_mm: float | None = None,
                               phase_offset2_deg: float = 0.0) -> tuple[bd.Shape, bd.Shape]:
    """Both members as solids, gear 1 on the Z axis centred on the origin and
    gear 2 positioned in mesh with it. Returns (gear1, gear2).

    Placement (docs/gear-math.md 7.5). The common perpendicular of the two
    axes is taken as the Y axis, so the pitch point is P = (0, r1, 0) and
    gear 2's centre is (0, a, 0). Each gear is centred on its mid-face and
    rotated by minus half its twist, so that at the mid-face -- the plane
    of P -- its profile sits in the "tooth centred on +Y" frame the outline
    is generated in (involute.full_gear_polygon). Gear 1 therefore presents
    a TOOTH to P; gear 2 must present a SPACE there (its -Y side), which an
    odd z2 does by itself and an even z2 needs half a pitch of rotation for.
    Gear 2 is then rotated about Y by -Sigma for a right-hand gear 1 (+Sigma
    for left): derived from the two tooth traces at P -- gear 1's runs
    (-sin beta1, 0, cos beta1) for a right-hand gear (involute.py's twist
    convention: a right-hand profile rotates counter-clockwise with z, which
    carries the tooth at +Y toward -X), gear 2's on its -Y side runs
    (+sin beta2, 0, cos beta2) before the Y rotation and (sin(beta2 +
    theta), 0, cos(beta2 + theta)) after it, and the two must coincide:
    beta2 + theta = -beta1, theta = -Sigma. The same theta falls out for an
    opposite-hand gear 2 (Sigma = beta1 - |beta2|).

    phase_offset2_deg is for tests only: an extra rotation of gear 2 about
    its own axis, so a deliberately wrong mesh can be built and shown to
    fail the interpenetration check that the correct one passes."""
    from build_gear import build_gear_solid

    g1 = pp.gear1_params()
    g2 = pp.gear2_params()
    s1 = build_gear_solid(g1, simplify_tolerance_mm)  # spans z in [0, face_width] -- centre it
    s2 = build_gear_solid(g2, simplify_tolerance_mm)

    s1 = (s1.translate((0, 0, -g1.face_width_mm / 2.0))
            .rotate(bd.Axis.Z, -math.degrees(g1.twist_total_rad) / 2.0))

    phase2 = -math.degrees(g2.twist_total_rad) / 2.0 + phase_offset2_deg
    if pp.z2 % 2 == 0:
        phase2 += 180.0 / pp.z2  # a SPACE, not a tooth, on the -Y side facing gear 1
    theta = -pp.shaft_angle_deg if pp.hand == "right" else pp.shaft_angle_deg
    s2 = (s2.translate((0, 0, -g2.face_width_mm / 2.0))
            .rotate(bd.Axis.Z, phase2)
            .rotate(bd.Axis.Y, theta)
            .translate((0, pp.center_distance_mm, 0)))
    return s1, s2


def gear2_axis_direction(pp: CrossedHelicalPairParams) -> tuple[float, float, float]:
    """Unit direction of gear 2's axis after placement: Z rotated about Y by
    theta (see build_crossed_helical_pair) -> (sin theta, 0, cos theta)."""
    theta = math.radians(-pp.shaft_angle_deg if pp.hand == "right" else pp.shaft_angle_deg)
    return (math.sin(theta), 0.0, math.cos(theta))
