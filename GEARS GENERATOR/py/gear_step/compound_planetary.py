"""
Compound (stepped-planet) planetary sets -- docs/gear-math.md section 25.

Every planet is two gears on one shaft: planet gear 1 (z_p1) meshes the sun,
planet gear 2 (z_p2), a step along the shaft, meshes the output ring. Two
arrangements share that planet:

    split ring (default)     sun - P1 - ring 1 (held)   at level 1, a plain planetary stage
                             P2 - ring 2 (output)       at level 2; the carrier just carries
                             i = w_sun / w_ring2 = (1 + z_r1/z_s) / (1 - z_r1 z_p2 / (z_r2 z_p1))
    carrier output           sun - P1                   at level 1 (no ring there)
                             P2 - ring (held)           at level 2; the carrier is the output
                             i = w_sun / w_carrier = 1 + z_r z_p1 / (z_s z_p2)

The split ring's denominator is the point of it: with z_r1 z_p2 close to
z_r2 z_p1 the output ring creeps and the ratio runs into the hundreds from
four gears -- the reducer the videos call a "split-ring compound planetary"
(MathWorks' Compound Planetary Gear block is the carrier-output arrangement,
with g_RP = z_r/z_p2 and g_PS = z_p1/z_s). Tooth counts follow from the
carrier's one centre distance, a = m (z_s + z_p1) / (2 cos beta):

    z_r1 = z_s + 2 z_p1                              ring 1 closes over P1 at module 1
    m_2 (z_r2 - z_p2) = m_1 (z_s + z_p1)             ring 2 sits at the same a; either
                                                     z_r2 (0 = z_s + z_p1 + z_p2 at m_2 = m_1)
                                                     or m_2 (0 = whatever closes a) is free
    assembly 1 (split ring)   (z_s + z_r1) / n integer
    assembly 2 (both)         (z_s z_p2 + z_r2 z_p1) / (n gcd(z_p1, z_p2)) integer
    clearance                 2 a sin(pi/n) > the larger planet gear's tip diameter

Assembly 2 is derived in the docs: n identical stepped planets, equally
spaced, need the sun's phase at planet k (through P1) and ring 2's phase
there (through P2) to differ by the one fixed step between the two gears,
which the whole-pitch freedom of each gear can only absorb in multiples of
360/lcm(z_p1, z_p2). build_compound_planetary_set finds that whole-pitch
turn by search (planet_spin_deg), so the condition is checked by
construction: no turn, no set.

Tooth form: spur, helical (the sun's hand, planet gears the opposite, each
ring the hand of the planet gear it meshes) or double helical (herringbone),
all from the existing builders; the rings are twist-extruded annuli
(build_gear.build_internal_gear_solid) -- no boolean anywhere but the hub
that joins the two planet gears and the bore through it.
"""
from __future__ import annotations

import math
from dataclasses import dataclass
from math import gcd

import build123d as bd

from involute import GearParams
from internal import InternalGearParams


def _opposite(hand: str) -> str:
    return "left" if hand == "right" else "right"


@dataclass
class CompoundPlanetaryParams:
    z_sun: int = 18                 # the defaults: 18 / 24-23 x3 / rings 66 and 65 -- 173 : 1, every gear above the
    z_planet_1: int = 24            # undercut line, both assembly conditions met (meshes the sun and, split ring, ring 1)
    z_planet_2: int = 23            # meshes ring 2, the output ring
    n_planets: int = 3
    split_ring: bool = True         # False: carrier output, one ring
    z_ring_2: int = 0               # 0 = z_sun + z_planet_1 + z_planet_2 (module 2 = module 1)
    module_mm: float = 2.0          # normal module of mesh 1 (sun, planet gear 1, ring 1)
    module_2_mm: float = 0.0        # normal module of mesh 2; 0 = whatever closes the centre distance
    pressure_angle_deg: float = 20.0
    helix_angle_deg: float = 0.0    # 0 = spur
    herringbone: bool = False       # double helical (needs a helix angle)
    hand: str = "right"             # the sun's hand
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38
    backlash_mm: float = 0.0
    face_width_mm: float = 10.0     # mesh 1
    face_width_2_mm: float = 10.0   # mesh 2
    step_gap_mm: float = 3.0        # between the two planet gears, bridged by the hub
    bore_diameter_mm: float = 0.0   # sun
    planet_bore_mm: float = 0.0     # the planets' pin bore, through both gears and the hub
    rim_thickness_mm: float = 6.0   # both rings

    def __post_init__(self):
        if self.herringbone and abs(self.helix_angle_deg) < 1e-9:
            raise ValueError("a double-helical (herringbone) set needs a helix angle; 0 degrees is a spur set")
        if self.step_gap_mm < 0.5:
            raise ValueError("the step between the planet gears must be at least 0.5 mm (the hub that joins them lives there)")
        if self.n_planets < 1:
            raise ValueError("at least one planet")

    # ---- tooth counts, modules, distances --------------------------------
    @property
    def cos_beta(self) -> float:
        return math.cos(math.radians(self.helix_angle_deg))

    @property
    def z_ring_1(self) -> int:
        """Ring 1 closes over planet gear 1 at module 1 (split ring only)."""
        return self.z_sun + 2 * self.z_planet_1

    @property
    def center_distance_mm(self) -> float:
        """The carrier's centre distance: sun to planet, and every ring to its planet gear."""
        return self.module_mm * (self.z_sun + self.z_planet_1) / (2.0 * self.cos_beta)

    @property
    def ring_2_teeth(self) -> int:
        if self.z_ring_2 > 0:
            return self.z_ring_2
        if self.module_2_mm > 0:
            # the count that puts ring 2 nearest the carrier's centre distance at the asked module
            return self.z_planet_2 + int(round(self.module_mm * (self.z_sun + self.z_planet_1) / self.module_2_mm))
        return self.z_sun + self.z_planet_1 + self.z_planet_2

    @property
    def module_2(self) -> float:
        """Mesh 2's normal module. Given both a ring-2 count and a module, the
        module stands (and center_distance_mismatch_mm says how far ring 2
        then sits from the carrier); otherwise it is whatever closes a."""
        if self.z_ring_2 > 0 and self.module_2_mm > 0:
            return self.module_2_mm
        return self.module_mm * (self.z_sun + self.z_planet_1) / (self.ring_2_teeth - self.z_planet_2)

    @property
    def center_distance_2_mm(self) -> float:
        return self.module_2 * (self.ring_2_teeth - self.z_planet_2) / (2.0 * self.cos_beta)

    @property
    def center_distance_mismatch_mm(self) -> float:
        return self.center_distance_2_mm - self.center_distance_mm

    @property
    def module_2_that_closes(self) -> float:
        return self.module_mm * (self.z_sun + self.z_planet_1) / (self.ring_2_teeth - self.z_planet_2)

    @property
    def ring_2_teeth_that_close(self) -> float:
        return self.z_planet_2 + self.module_mm * (self.z_sun + self.z_planet_1) / self.module_2

    # ---- assembly and clearance ------------------------------------------
    @property
    def assembly_ok_1(self) -> bool:
        """Level 1 (split ring): the plain planetary condition."""
        return (not self.split_ring) or (self.z_sun + self.z_ring_1) % self.n_planets == 0

    @property
    def assembly_ok_2(self) -> bool:
        """Sun through P1 and ring 2 through P2, one fixed step between them."""
        g = gcd(self.z_planet_1, self.z_planet_2)
        return ((self.z_sun * self.z_planet_2 + self.ring_2_teeth * self.z_planet_1) // g) % self.n_planets == 0

    @property
    def assembly_ok(self) -> bool:
        return self.assembly_ok_1 and self.assembly_ok_2

    @property
    def planet_1_tip_diameter_mm(self) -> float:
        return 2.0 * self.planet_1_params().addendum_radius

    @property
    def planet_2_tip_diameter_mm(self) -> float:
        return 2.0 * self.planet_2_params().addendum_radius

    @property
    def planet_gap_mm(self) -> float:
        """Clearance between adjacent planets' tip circles, the larger gear counting (negative = they collide)."""
        if self.n_planets < 2:
            return float("inf")
        tips = max(self.planet_1_tip_diameter_mm, self.planet_2_tip_diameter_mm)
        return 2.0 * self.center_distance_mm * math.sin(math.pi / self.n_planets) - tips

    @property
    def hub_radius_mm(self) -> float:
        """The cylinder that joins the two planet gears across the step:
        inside both root circles by a quarter module, so it never fills a
        tooth space."""
        margin = max(0.3, 0.25 * min(self.module_mm, self.module_2))
        return min(self.planet_1_params().dedendum_radius, self.planet_2_params().dedendum_radius) - margin

    @property
    def planet_length_mm(self) -> float:
        return self.face_width_mm + self.step_gap_mm + self.face_width_2_mm

    @property
    def level_2_z0_mm(self) -> float:
        """Where mesh 2 starts along the axis (mesh 1 spans 0 .. face_width)."""
        return self.face_width_mm + self.step_gap_mm

    # ---- ratios ------------------------------------------------------------
    @property
    def ratio_carrier(self) -> float:
        """Sun in, carrier out, ring (split ring: ring 1; else the one ring) held: 1 + z_r z_p1 / (z_s z_p2)
        for the carrier-output set; with ring 1 held it is the plain 1 + z_r1/z_s."""
        if self.split_ring:
            return 1.0 + self.z_ring_1 / self.z_sun
        return 1.0 + self.ring_2_teeth * self.z_planet_1 / (self.z_sun * self.z_planet_2)

    @property
    def ratio_split_ring(self) -> float:
        """Split ring: sun in, ring 2 out, ring 1 held. Negative = the output turns against the sun."""
        return (1.0 + self.z_ring_1 / self.z_sun) / (1.0 - self.z_ring_1 * self.z_planet_2 / (self.ring_2_teeth * self.z_planet_1))

    @property
    def ratio_split_ring_reverse(self) -> float:
        """Split ring: sun in, ring 1 out, ring 2 held."""
        k = self.z_planet_1 * self.ring_2_teeth / (self.z_sun * self.z_planet_2)
        return (1.0 + k) / (1.0 - self.z_planet_1 * self.ring_2_teeth / (self.z_ring_1 * self.z_planet_2))

    @property
    def ratio_main(self) -> float:
        """The ratio the set is built for: sun in, ring 2 out (split ring) or carrier out."""
        return self.ratio_split_ring if self.split_ring else self.ratio_carrier

    @property
    def ratio_sun_fixed(self) -> float:
        """Carrier output only: ring in, carrier out, sun held."""
        return 1.0 + self.z_sun * self.z_planet_2 / (self.ring_2_teeth * self.z_planet_1)

    @property
    def ratio_carrier_fixed(self) -> float:
        """Carrier output only: sun in, ring out, carrier held (star): reversing."""
        return -self.ring_2_teeth * self.z_planet_1 / (self.z_sun * self.z_planet_2)

    # ---- the members -------------------------------------------------------
    def _common(self, module: float, face_width: float, hand: str) -> dict:
        return dict(module_mm=module, pressure_angle_deg=self.pressure_angle_deg,
                    addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
                    root_fillet_coeff=self.root_fillet_coeff, backlash_mm=self.backlash_mm,
                    face_width_mm=face_width, helix_angle_deg=self.helix_angle_deg, hand=hand)

    def sun_params(self) -> GearParams:
        return GearParams(z=self.z_sun, bore_diameter_mm=self.bore_diameter_mm,
                          **self._common(self.module_mm, self.face_width_mm, self.hand))

    def planet_1_params(self) -> GearParams:
        return GearParams(z=self.z_planet_1, **self._common(self.module_mm, self.face_width_mm, _opposite(self.hand)))

    def planet_2_params(self) -> GearParams:
        return GearParams(z=self.z_planet_2, **self._common(self.module_2, self.face_width_2_mm, _opposite(self.hand)))

    def _ring(self, z: int, module: float, cutter: int, face_width: float) -> InternalGearParams:
        # cut by its own planet gear, so it is exactly conjugate to what runs in it; an
        # internal mesh shares the hand of its pinion
        return InternalGearParams(z=z, module_mm=module, pressure_angle_deg=self.pressure_angle_deg,
                                  addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
                                  root_fillet_coeff=self.root_fillet_coeff, cutter_teeth=cutter,
                                  face_width_mm=face_width, rim_thickness_mm=self.rim_thickness_mm,
                                  backlash_mm=self.backlash_mm, helix_angle_deg=self.helix_angle_deg,
                                  hand=_opposite(self.hand))

    def ring_1_params(self) -> InternalGearParams:
        return self._ring(self.z_ring_1, self.module_mm, self.z_planet_1, self.face_width_mm)

    def ring_2_params(self) -> InternalGearParams:
        return self._ring(self.ring_2_teeth, self.module_2, self.z_planet_2, self.face_width_2_mm)

    # ---- placement -----------------------------------------------------------
    def planet_angle_deg(self, k: int) -> float:
        """Planet k's position about the sun, planet 0 on +Y."""
        return 90.0 + 360.0 * k / self.n_planets

    def planet_spin_deg(self, k: int, strict: bool = True) -> float:
        """Planet k's own turn about its axis. Carried round from planet 0 by
        Delta_k, the sun that would mesh is Delta_k mod p_s ahead of the real
        one: turning it back spins planet gear 1 by (Delta_k mod p_s) z_s/z_p1
        (planetary.py); ring 2's own correction, -(Delta_k mod p_r2) through
        the internal mesh, would spin planet gear 2 by -(Delta_k mod p_r2)
        z_r2/z_p2. The two gears share one shaft, so the difference must be
        made up by whole pitches of gear 1 (invisible to the sun) that come
        out as whole pitches of gear 2 (invisible to ring 2): the search below.
        No such turn exists exactly when assembly_ok_2 is False; then strict
        raises, and the build (strict=False) takes the sun's turn alone, so
        the set still shows -- with gear 2 visibly into ring 2 on the carried
        planets, the honest picture of a set that does not assemble."""
        delta = 360.0 * k / self.n_planets
        p_s, p_r2 = 360.0 / self.z_sun, 360.0 / self.ring_2_teeth
        p_1, p_2 = 360.0 / self.z_planet_1, 360.0 / self.z_planet_2
        need_1 = (delta % p_s) * self.z_sun / self.z_planet_1
        need_2 = -(delta % p_r2) * self.ring_2_teeth / self.z_planet_2
        for b in range(self.z_planet_1):
            total = need_1 + b * p_1
            r = (total - need_2) % p_2
            if min(r, p_2 - r) < 1e-6:
                return total
        if not strict:
            return need_1
        raise ValueError(
            f"{self.n_planets} equally spaced stepped planets cannot all mesh: planet {k} would need its "
            f"gear 1 and gear 2 keyed differently from planet 0. (z_sun z_p2 + z_ring2 z_p1) / gcd(z_p1, z_p2) = "
            f"{(self.z_sun * self.z_planet_2 + self.ring_2_teeth * self.z_planet_1) // gcd(self.z_planet_1, self.z_planet_2)} "
            f"must divide by {self.n_planets}; change a tooth count or the planet count.")

    def refusals(self) -> list[str]:
        """What the build refuses outright: geometry that cannot be right
        (ring 2 off the carrier's centre distance, a pin bore through the
        hub). Assembly failures are not here: they build, and show."""
        return [m for m in self.check() if "centre distance" in m or "hub" in m]

    def check(self) -> list[str]:
        """Everything wrong with the set, as messages (empty = a set that
        builds and assembles): the refusals plus the two assembly conditions."""
        problems = []
        if abs(self.center_distance_mismatch_mm) > 1e-6:
            problems.append(
                f"ring 2 does not sit at the carrier's centre distance: {self.center_distance_2_mm:.4f} mm against "
                f"{self.center_distance_mm:.4f} mm. At {self.ring_2_teeth} teeth its module must be {self.module_2_that_closes:.4f} mm, "
                f"or at module {self.module_2:.4f} mm it needs {self.ring_2_teeth_that_close:.2f} teeth (set one of them to 0 = auto).")
        if not self.assembly_ok_1:
            problems.append(f"{self.n_planets} equally spaced planets cannot all mesh the sun and ring 1: (z_sun + z_ring1) = "
                            f"{self.z_sun + self.z_ring_1} is not divisible by {self.n_planets}.")
        if not self.assembly_ok_2:
            g = gcd(self.z_planet_1, self.z_planet_2)
            problems.append(f"{self.n_planets} equally spaced stepped planets cannot all mesh ring 2: "
                            f"(z_sun z_p2 + z_ring2 z_p1) / gcd(z_p1, z_p2) = "
                            f"{(self.z_sun * self.z_planet_2 + self.ring_2_teeth * self.z_planet_1) // g} is not divisible by {self.n_planets}.")
        if self.hub_radius_mm <= self.planet_bore_mm / 2.0 + 0.5:
            problems.append(f"the planet pin bore ({self.planet_bore_mm} mm) leaves no hub between the two planet gears "
                            f"(hub radius {self.hub_radius_mm:.2f} mm): a smaller bore, or bigger planet gears.")
        return problems


def build_compound_planet(cp: CompoundPlanetaryParams, simplify_tolerance_mm: float | None = None) -> bd.Shape:
    """One stepped planet, on its own axis at the origin: gear 1 from z = 0
    to face_width, gear 2 from level_2_z0 to the planet's length, both in
    the tooth-centred-on-+Y frame, joined by the hub cylinder (which reaches
    a millimetre into each gear, so the fuse meets both end faces
    transversally), the pin bore cut through everything last."""
    from build_gear import build_gear_solid, build_double_helical_solid
    ext = (lambda gp: build_double_helical_solid(gp, 0.0, simplify_tolerance_mm)) if cp.herringbone \
        else (lambda gp: build_gear_solid(gp, simplify_tolerance_mm))
    g1 = ext(cp.planet_1_params())
    g2 = ext(cp.planet_2_params()).translate((0, 0, cp.level_2_z0_mm))
    reach = min(1.0, 0.25 * cp.face_width_mm, 0.25 * cp.face_width_2_mm)
    hub = bd.Solid.make_cylinder(cp.hub_radius_mm, cp.step_gap_mm + 2.0 * reach,
                                 bd.Plane((0, 0, cp.face_width_mm - reach)))
    planet = g1.fuse(g2, hub)
    bodies = planet.solids()
    if len(bodies) != 1:
        raise RuntimeError(f"the stepped planet came out as {len(bodies)} solids, not one")
    planet = bodies[0]
    if cp.planet_bore_mm > 0:
        bore = bd.Solid.make_cylinder(cp.planet_bore_mm / 2.0, cp.planet_length_mm + 2.0, bd.Plane((0, 0, -1.0)))
        planet = planet.cut(bore).solids()[0]
    return planet


def build_compound_planetary_set(cp: CompoundPlanetaryParams, simplify_tolerance_mm: float | None = None,
                                 planet0_phase_error_deg: float = 0.0):
    """(sun, [planet_0 .. planet_n-1], ring_2, ring_1 or None), all in mesh:
    the sun on Z at the origin spanning z in [0, face_width], ring 1 (split
    ring) beside it, the planets' gear 2 and ring 2 from level_2_z0 up.
    planet0_phase_error_deg is for tests: an extra spin of planet 0, so a
    wrong mesh can be shown to fail what the right one passes."""
    from build_gear import build_gear_solid, build_double_helical_solid, build_internal_gear_solid, \
        build_double_helical_internal_solid
    problems = cp.refusals()
    if problems:
        raise ValueError("compound planetary set: " + " ".join(problems))
    ext = (lambda gp: build_double_helical_solid(gp, 0.0, simplify_tolerance_mm)) if cp.herringbone \
        else (lambda gp: build_gear_solid(gp, simplify_tolerance_mm))
    ring_tol = simplify_tolerance_mm or 0.03
    ring = (lambda ip: build_double_helical_internal_solid(ip, ring_tol)) if cp.herringbone \
        else (lambda ip: build_internal_gear_solid(ip, ring_tol))

    sun = ext(cp.sun_params())
    if cp.z_planet_1 % 2 == 0:
        # an even planet gear 1 has teeth on both +Y and -Y: give the sun a SPACE
        # on +Y to face the planet's -Y tooth (planetary.py)
        sun = sun.rotate(bd.Axis.Z, 180.0 / cp.z_sun)
    planet = build_compound_planet(cp, simplify_tolerance_mm)
    ring_2 = ring(cp.ring_2_params()).translate((0, 0, cp.level_2_z0_mm))
    ring_1 = ring(cp.ring_1_params()) if cp.split_ring else None

    planets = []
    for k in range(cp.n_planets):
        delta = 360.0 * k / cp.n_planets
        spin = cp.planet_spin_deg(k, strict=False) + (planet0_phase_error_deg if k == 0 else 0.0)
        planets.append(planet.rotate(bd.Axis.Z, spin)
                             .translate((0, cp.center_distance_mm, 0))
                             .rotate(bd.Axis.Z, delta))
    return sun, planets, ring_2, ring_1


def labelled_compound_planetary(cp: CompoundPlanetaryParams, simplify_tolerance_mm: float | None = None) -> bd.Compound:
    """The set as one Compound of labelled solids, ring 1 last when present."""
    sun, planets, ring_2, ring_1 = build_compound_planetary_set(cp, simplify_tolerance_mm)
    sun.label = f"sun z{cp.z_sun}"
    for k, p in enumerate(planets):
        p.label = f"planet {k + 1} z{cp.z_planet_1}/z{cp.z_planet_2}"
    ring_2.label = f"ring 2 z{cp.ring_2_teeth} ({'output' if cp.split_ring else 'held'})"
    members = [sun, *planets, ring_2]
    if ring_1 is not None:
        ring_1.label = f"ring 1 z{cp.z_ring_1} (held)"
        members.append(ring_1)
    return bd.Compound(children=members)
