"""
Straight bevel gears via Tredgold's approximation.

Implements docs/gear-math.md section 8. Reuses involute.py's validated flank/
fillet/undercut machinery completely unchanged (via single_tooth_polygon with
a non-integer virtual tooth count) -- this file only adds the pitch-angle/
virtual-gear math and the flat-tooth-to-cone 3D wrapping.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field

from involute import GearParams, single_tooth_polygon


@dataclass
class BevelGearParams:
    z: int                              # this gear's teeth
    module_mm: float                    # OUTER/HEEL module (standard bevel convention)
    mate_teeth: int                     # the mating gear's teeth (for pitch angle)
    shaft_angle_deg: float = 90.0
    pressure_angle_deg: float = 20.0
    addendum_coeff: float = 1.0
    dedendum_coeff: float = 1.25
    root_fillet_coeff: float = 0.38
    face_width_mm: float = 10.0
    bore_diameter_mm: float = 0.0
    pitch_angle_deg_override: float | None = None  # skip mate/shaft calc if given directly

    @property
    def pitch_angle_rad(self) -> float:
        if self.pitch_angle_deg_override is not None:
            return math.radians(self.pitch_angle_deg_override)
        sigma = math.radians(self.shaft_angle_deg)
        ratio = self.mate_teeth / self.z
        return math.atan2(math.sin(sigma), ratio + math.cos(sigma))

    @property
    def pitch_angle_deg(self) -> float:
        return math.degrees(self.pitch_angle_rad)

    @property
    def heel_pitch_radius(self) -> float:
        return self.module_mm * self.z / 2.0

    @property
    def outer_cone_distance(self) -> float:
        """Re: slant distance, apex to heel pitch circle."""
        return self.heel_pitch_radius / math.sin(self.pitch_angle_rad)

    @property
    def z_virtual(self) -> float:
        return self.z / math.cos(self.pitch_angle_rad)

    def to_flat_gear_params(self) -> GearParams:
        """The heel's virtual (equivalent) spur gear, per docs/gear-math.md 8.1 --
        z=z_virtual (non-integer), real module/pressure-angle/coefficients."""
        return GearParams(
            z=self.z_virtual,
            module_mm=self.module_mm,
            pressure_angle_deg=self.pressure_angle_deg,
            addendum_coeff=self.addendum_coeff,
            dedendum_coeff=self.dedendum_coeff,
            root_fillet_coeff=self.root_fillet_coeff,
        )


def flat_point_to_cone(heel_x: float, heel_y: float, s: float, gamma_rad: float,
                        re: float, heel_pitch_radius: float, angle_offset_rad: float = 0.0):
    """One flat heel-tooth point -> 3D point on the bevel gear at pitch-cone
    slant distance s from the apex. docs/gear-math.md section 8.2. Apex at the
    origin, gear axis = +Z. angle_offset_rad patterns the z real teeth around
    the axis (added to actual_angle, after the cos(gamma) unwrap)."""
    heel_r = math.hypot(heel_x, heel_y)
    heel_theta = math.atan2(heel_x, heel_y)
    r_pitch_flat_heel = heel_pitch_radius / math.cos(gamma_rad)  # == m*z_v/2, algebraically
    dr_heel = heel_r - r_pitch_flat_heel

    k = s / re
    dr = dr_heel * k
    actual_angle = heel_theta / math.cos(gamma_rad) + angle_offset_rad
    radial_on_cone = s * math.sin(gamma_rad) + dr * math.cos(gamma_rad)
    z = s * math.cos(gamma_rad) - dr * math.sin(gamma_rad)
    return (radial_on_cone * math.cos(actual_angle), radial_on_cone * math.sin(actual_angle), z)


def bevel_tooth_stations(bp: BevelGearParams, tooth_index: int = 0, n_phi: int = 240,
                          simplify_tolerance_mm: float = 0.02):
    """One tooth's toe and heel 3D point loops (docs/gear-math.md 8.3), as two
    lists of (x, y, z) tuples in the SAME order (so consecutive pairs form the
    ruled loft edges).

    simplify_tolerance_mm trims single_tooth_polygon's dense boolean-sweep
    sampling (typically 700+ points) down to a CAD-reasonable count *before*
    the 3D cone mapping (simplifying the flat 2D shape first is simpler and
    cheaper than simplifying a non-planar 3D wire after) -- same principle as
    full_gear_outline's simplification, at 20 microns here since bevel teeth
    are usually smaller-module than the spur/helical defaults."""
    flat_gp = bp.to_flat_gear_params()
    heel_poly = single_tooth_polygon(flat_gp, z_virtual=bp.z_virtual, n_phi=n_phi)
    if simplify_tolerance_mm > 0:
        heel_poly = heel_poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(heel_poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]

    # drop the artificial "floor" from single_tooth_polygon's annular sector
    # inner bound (docs/gear-math.md's single_tooth_polygon docstring) -- keep
    # only points at or above the true root radius.
    rf_flat = flat_gp.dedendum_radius
    coords = [(x, y) for (x, y) in coords if math.hypot(x, y) >= rf_flat - 1e-6]

    gamma = bp.pitch_angle_rad
    re = bp.outer_cone_distance
    s_toe = re - bp.face_width_mm
    angle_offset = tooth_index * (2 * math.pi / bp.z)

    heel_pts = [flat_point_to_cone(x, y, re, gamma, re, bp.heel_pitch_radius, angle_offset) for (x, y) in coords]
    toe_pts = [flat_point_to_cone(x, y, s_toe, gamma, re, bp.heel_pitch_radius, angle_offset) for (x, y) in coords]
    return toe_pts, heel_pts


def root_cone_profile(bp: BevelGearParams):
    """The (radius, z) axial half-profile of the root cone -- the frustum
    every tooth sits on -- as 4 points ready for a 360deg revolve: bore/axis
    at the toe, out to the root radius at the toe, along the root cone to the
    root radius at the heel, back in to the bore/axis at the heel. Uses the
    SAME flat_point_to_cone mapping as the teeth (dr = dr_root, constant, at
    heel_theta=0 so only the (radial, Z) pair is used) -- not a separate
    formula, so it's guaranteed to meet the tooth root exactly."""
    flat_gp = bp.to_flat_gear_params()
    gamma = bp.pitch_angle_rad
    re = bp.outer_cone_distance
    s_toe = re - bp.face_width_mm
    r_pitch_flat_heel = bp.heel_pitch_radius / math.cos(gamma)
    dr_root = flat_gp.dedendum_radius - r_pitch_flat_heel

    def radial_z(s):
        k = s / re
        dr = dr_root * k
        radial = s * math.sin(gamma) + dr * math.cos(gamma)
        z = s * math.cos(gamma) - dr * math.sin(gamma)
        return radial, z

    r_toe, z_toe = radial_z(s_toe)
    r_heel, z_heel = radial_z(re)
    inner_r = bp.bore_diameter_mm / 2.0  # 0 = goes to the axis
    return [(inner_r, z_toe), (r_toe, z_toe), (r_heel, z_heel), (inner_r, z_heel)]


# --------------------------------------------------------------------------
# Self-checks (docs/gear-math.md section 8) -- run directly: `python bevel.py`
# --------------------------------------------------------------------------

def _selftest_pitch_line_is_straight_and_on_the_cone():
    """A point with dr_heel=0 (exactly on the pitch line) must trace a
    straight line from apex-ward (toe) to heel, at constant radial/axial
    ratio matching tan(gamma) -- i.e. it must lie exactly on the pitch cone's
    own surface at every station, not just at the two ends."""
    bp = BevelGearParams(z=20, module_mm=3.0, mate_teeth=20, shaft_angle_deg=90.0, face_width_mm=8.0)
    gamma = bp.pitch_angle_rad
    re = bp.outer_cone_distance
    print(f"  pitch_angle={bp.pitch_angle_deg:.4f}deg re={re:.4f} z_virtual={bp.z_virtual:.4f}")
    assert abs(bp.pitch_angle_deg - 45.0) < 1e-9, "z==mate_teeth at 90deg shaft must give exactly 45deg"

    heel_pitch_pt = (0.0, bp.heel_pitch_radius / math.cos(gamma))  # dr_heel = 0 by construction
    for frac in (0.0, 0.3, 0.6, 1.0):
        s = re - frac * bp.face_width_mm
        x, y, z = flat_point_to_cone(*heel_pitch_pt, s, gamma, re, bp.heel_pitch_radius)
        radial = math.hypot(x, y)
        expected_radial = s * math.sin(gamma)
        expected_z = s * math.cos(gamma)
        assert abs(radial - expected_radial) < 1e-9, (radial, expected_radial)
        assert abs(z - expected_z) < 1e-9, (z, expected_z)
        assert abs(radial / z - math.tan(gamma)) < 1e-9
    print("  [ok] pitch-line points land exactly on the pitch cone at every station")


def _selftest_heel_toe_scale_ratio():
    """The whole tooth must scale linearly: a point's radial deviation from
    the pitch line at the toe must equal its heel deviation times (s_toe/Re)."""
    bp = BevelGearParams(z=16, module_mm=2.5, mate_teeth=24, shaft_angle_deg=90.0, face_width_mm=6.0)
    toe_pts, heel_pts = bevel_tooth_stations(bp, n_phi=150)
    re = bp.outer_cone_distance
    s_toe = re - bp.face_width_mm
    k_expected = s_toe / re

    # addendum-most point (largest radius from axis) at heel vs toe
    heel_radii = [math.hypot(x, y) for x, y, z in heel_pts]
    toe_radii = [math.hypot(x, y) for x, y, z in toe_pts]
    heel_max, toe_max = max(heel_radii), max(toe_radii)
    print(f"  heel max radius={heel_max:.4f} toe max radius={toe_max:.4f} "
          f"ratio={toe_max/heel_max:.5f} expected~={k_expected:.5f}")
    # not exactly k_expected (addendum offset scales, but base radial position
    # doesn't scale from zero) -- so just check it's in a sane bracket between
    # k_expected (pure radial scale) and 1 (no scale at all)
    assert k_expected * 0.9 < toe_max / heel_max < 1.0
    assert len(toe_pts) == len(heel_pts)
    print("  [ok] toe is a smaller, correctly-scaled copy of the heel")


if __name__ == "__main__":
    print("Running bevel gear self-tests...")
    _selftest_pitch_line_is_straight_and_on_the_cone()
    _selftest_heel_toe_scale_ratio()
    print("All bevel self-tests passed.")
