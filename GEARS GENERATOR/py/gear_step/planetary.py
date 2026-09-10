"""
Planetary (epicyclic) gear sets: a sun, n equally spaced planets on a
carrier, and a ring (internal) gear around them -- docs/gear-math.md
section 11.4.

Every member is an existing gear (involute.GearParams for the sun and
planets, internal.InternalGearParams for the ring); what the set adds is
the relationships and a correct, fully phased placement of all of them:

    z_r = z_s + 2 z_p                    same module throughout, standard depth
    a   = m (z_s + z_p) / 2              sun-planet centre distance (= ring-planet, since r_r - r_p = a)
    assembly:  (z_s + z_r) / n  integer  equally spaced planets can all mesh
    ratios:    ring fixed, sun in, carrier out:   1 + z_r / z_s
               sun fixed, ring in, carrier out:   1 + z_s / z_r
               carrier fixed (star):              -z_r / z_s
    clearance: 2 a sin(pi/n) > planet tip diameter, or adjacent planets touch

Tooth phase (build_planetary_set): with every outline generated in the
"tooth centred on +Y" frame (the ring's cutter tooth is centred on +Y, so
the RING has a SPACE there), planet 0 on +Y meshes with the sun below it
and the ring above it. For an odd planet the tooth on its +Y side faces
the ring's space and the space on its -Y side faces the sun's tooth -- no
adjustment. For an even planet, +Y and -Y are both teeth, so the SUN is
turned half a pitch to present a space. Planet k is then the planet-0
configuration carried round by Delta_k = 360k/n, corrected for the fact
that the real sun and ring did not turn with it: turning the sun back by
-(Delta_k mod p_s) spins the planet by (Delta_k mod p_s) z_s/z_p, and the
assembly condition is exactly what makes the ring's own correction agree
with that modulo a planet pitch. tests/test_planetary.py checks all of it
the way the screw pair is checked: zero boolean intersection between every
meshing pair, and a clear collision when one planet is deliberately turned
half a pitch.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd

from involute import GearParams
from internal import InternalGearParams


@dataclass
class PlanetaryParams:
    z_sun: int
    z_planet: int
    n_planets: int = 3
    module_mm: float = 2.0
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38
    backlash_mm: float = 0.0
    face_width_mm: float = 10.0
    bore_diameter_mm: float = 0.0        # sun's bore
    planet_bore_mm: float | None = None  # planets' pin bore; None = same as the sun's
    rim_thickness_mm: float = 6.0        # ring material outside its root circle

    @property
    def z_ring(self) -> int:
        return self.z_sun + 2 * self.z_planet

    @property
    def center_distance_mm(self) -> float:
        return self.module_mm * (self.z_sun + self.z_planet) / 2.0

    @property
    def assembly_ok(self) -> bool:
        return (self.z_sun + self.z_ring) % self.n_planets == 0

    @property
    def planet_tip_diameter_mm(self) -> float:
        return self.module_mm * (self.z_planet + 2.0 * self.addendum_coeff)

    @property
    def planet_gap_mm(self) -> float:
        """Clearance between adjacent planets' tip circles (negative = they collide)."""
        if self.n_planets < 2:
            return float("inf")
        return 2.0 * self.center_distance_mm * math.sin(math.pi / self.n_planets) - self.planet_tip_diameter_mm

    @property
    def ratio_ring_fixed(self) -> float:
        return 1.0 + self.z_ring / self.z_sun

    @property
    def ratio_sun_fixed(self) -> float:
        return 1.0 + self.z_sun / self.z_ring

    @property
    def ratio_carrier_fixed(self) -> float:
        return -self.z_ring / self.z_sun

    def _common(self) -> dict:
        return dict(module_mm=self.module_mm, pressure_angle_deg=self.pressure_angle_deg,
                    addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
                    root_fillet_coeff=self.root_fillet_coeff, backlash_mm=self.backlash_mm,
                    face_width_mm=self.face_width_mm)

    def sun_params(self) -> GearParams:
        return GearParams(z=self.z_sun, bore_diameter_mm=self.bore_diameter_mm, **self._common())

    def planet_params(self) -> GearParams:
        bore = self.bore_diameter_mm if self.planet_bore_mm is None else self.planet_bore_mm
        return GearParams(z=self.z_planet, bore_diameter_mm=bore, **self._common())

    def ring_params(self) -> InternalGearParams:
        # The ring's generating cutter is the planet itself (cutter_teeth =
        # z_planet), which makes the ring exactly conjugate to what runs in it.
        return InternalGearParams(z=self.z_ring, module_mm=self.module_mm,
                                  pressure_angle_deg=self.pressure_angle_deg,
                                  addendum_coeff=self.addendum_coeff, dedendum_coeff=self.dedendum_coeff,
                                  root_fillet_coeff=self.root_fillet_coeff, cutter_teeth=self.z_planet,
                                  face_width_mm=self.face_width_mm, rim_thickness_mm=self.rim_thickness_mm,
                                  backlash_mm=self.backlash_mm)

    def planet_angle_deg(self, k: int) -> float:
        """Planet k's position angle about the sun, planet 0 on +Y."""
        return 90.0 + 360.0 * k / self.n_planets

    def planet_spin_deg(self, k: int) -> float:
        """Planet k's own extra rotation (see module docstring): the sun that
        the carried planet-0 configuration would need is turned back to the
        real one by -(Delta_k mod p_s), which spins the planet by
        (Delta_k mod p_s) z_s / z_p."""
        delta = 360.0 * k / self.n_planets
        p_s = 360.0 / self.z_sun
        return (delta % p_s) * self.z_sun / self.z_planet


def build_planetary_set(pp: PlanetaryParams, simplify_tolerance_mm: float | None = None,
                        planet0_phase_error_deg: float = 0.0) -> tuple[bd.Shape, list[bd.Shape], bd.Shape]:
    """(sun, [planet_0 .. planet_n-1], ring), all in mesh, sun on Z at the
    origin, every member spanning z in [0, face_width]. planet0_phase_error_deg
    is for tests: an extra spin of planet 0 about its own axis, so a
    deliberately wrong mesh can be shown to fail the checks the right one
    passes."""
    from build_gear import build_gear_solid, build_internal_gear_solid

    sun = build_gear_solid(pp.sun_params(), simplify_tolerance_mm)
    planet = build_gear_solid(pp.planet_params(), simplify_tolerance_mm)
    ring = build_internal_gear_solid(pp.ring_params(), simplify_tolerance_mm or 0.03)

    if pp.z_planet % 2 == 0:
        # an even planet has teeth on both +Y and -Y: give the sun a SPACE on
        # +Y to face the planet's -Y tooth (the ring already has one on +Y)
        sun = sun.rotate(bd.Axis.Z, 180.0 / pp.z_sun)

    planets = []
    for k in range(pp.n_planets):
        delta = 360.0 * k / pp.n_planets
        spin = pp.planet_spin_deg(k) + (planet0_phase_error_deg if k == 0 else 0.0)
        planets.append(planet.rotate(bd.Axis.Z, spin)
                             .translate((0, pp.center_distance_mm, 0))
                             .rotate(bd.Axis.Z, delta))
    return sun, planets, ring
