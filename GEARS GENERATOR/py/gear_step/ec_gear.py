"""
Eccentrically-cycloidal (EC) gearing -- docs/gear-math.md section 23.

The pinion has one tooth: its transverse sections are circles of radius
r_c whose centre sits e off the pinion's axis, and that eccentric
direction turns along a helix of lead p_z, so the pinion is an eccentric
cylinder twisted into a screw. The wheel's transverse profile is the
envelope of that circle under the pair's motion (the pinion turning by
theta, the wheel by -theta / z_w): the inward equidistant, at r_c, of the
epitrochoid the circle's centre traces in the wheel's frame -- the very
curve a cycloidal drive's disc is cut to (section 15), with the eccentric
as the one roller, so cycloidal_drive.py's profile and its convex-stretch
curvature check are reused as they are. The wheel is twisted by one pitch
per lead against the pinion's full turn, so every transverse section is
the conjugate pair; both members are exact twist-extrusions (section 7.3).

Pitch radii from the ratio z_w : 1 at the centre distance a:
r_1 = a / (z_w + 1) for the pinion, r_2 = a z_w / (z_w + 1) for the wheel.
The eccentric centre's path is curtate (no loops) while e < r_1; the
equidistant has no cusps while r_c is below the path's least radius of
curvature on its convex stretches. Tooth height 2 e: the wheel's tips at
a + e - r_c, its roots at a - e - r_c.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from shapely.affinity import rotate as _rotate
from shapely.geometry import Point, Polygon

from cycloidal_drive import CycloidalDriveParams, disc_profile, min_radius_of_curvature


@dataclass
class ECGearParams:
    wheel_teeth: int = 20
    centre_distance_mm: float = 50.0
    eccentricity_mm: float = 0.0            # 0 = auto: 0.6 r_1
    pinion_diameter_mm: float = 0.0         # 0 = auto: 0.8 of the largest the profile allows
    face_width_mm: float = 20.0
    lead_mm: float = 0.0                    # 0 = auto: the face width (the eccentric turns once across the face)
    hand: str = "right"
    bore_diameter_mm: float = 0.0           # the wheel's
    pinion_bore_diameter_mm: float = 0.0    # on the pinion's axis, inside the eccentric circle

    # ---- sizes ----
    @property
    def a(self) -> float:
        return self.centre_distance_mm

    @property
    def z(self) -> int:
        return int(self.wheel_teeth)

    @property
    def ratio(self) -> float:
        return float(self.z)

    @property
    def pinion_pitch_radius(self) -> float:
        return self.a / (self.z + 1)

    @property
    def wheel_pitch_radius(self) -> float:
        return self.a * self.z / (self.z + 1)

    @property
    def e(self) -> float:
        return self.eccentricity_mm if self.eccentricity_mm > 0 else 0.6 * self.pinion_pitch_radius

    @property
    def r_c(self) -> float:
        """Auto: 0.8 of max_pinion_radius, which leaves the wheel's tips a
        radius of a fifth of the path's tightest bend."""
        return 0.5 * self.pinion_diameter_mm if self.pinion_diameter_mm > 0 else 0.8 * self.max_pinion_radius

    @property
    def lead(self) -> float:
        return self.lead_mm if self.lead_mm > 0 else self.face_width_mm

    @property
    def tooth_height(self) -> float:
        return 2.0 * self.e

    @property
    def wheel_tip_radius(self) -> float:
        return self.a + self.e - self.r_c

    @property
    def wheel_root_radius(self) -> float:
        return self.a - self.e - self.r_c

    @property
    def max_eccentricity(self) -> float:
        """e must stay below the pinion's pitch radius or the centre's path loops."""
        return self.pinion_pitch_radius

    @property
    def max_pinion_radius(self) -> float:
        """The least radius of curvature of the centre's path on its convex
        stretches (the lobe tips: about (a / z + e)^2 / (e + a / z^2)): a
        larger r_c makes the equidistant cross itself (cusps). The path
        does not depend on r_c, so the drive is built with a token roller."""
        return min_radius_of_curvature(CycloidalDriveParams(lobes=self.z, pin_circle_diameter_mm=2.0 * self.a,
                                                            roller_diameter_mm=1.0, eccentricity_mm=self.e, output_pin_count=0))

    # ---- twist ----
    @property
    def hand_sign(self) -> float:
        return 1.0 if self.hand != "left" else -1.0

    @property
    def pinion_twist_rad(self) -> float:
        """The eccentric direction's turn from one face to the other."""
        return self.hand_sign * 2.0 * math.pi * self.face_width_mm / self.lead

    @property
    def wheel_twist_rad(self) -> float:
        """One wheel pitch per pinion turn, the other way."""
        return -self.pinion_twist_rad / self.z

    @property
    def helix_angle_rad(self) -> float:
        """At the pitch radii, the same for both members: tan beta = 2 pi r_1 / p_z."""
        return math.atan(2.0 * math.pi * self.pinion_pitch_radius / self.lead)

    def drive_params(self) -> CycloidalDriveParams:
        """The cycloidal drive whose disc profile is this wheel's transverse
        profile: z_w lobes, the eccentric as the roller on a pin circle of
        radius a, eccentricity e."""
        return CycloidalDriveParams(lobes=self.z, pin_circle_diameter_mm=2.0 * self.a, roller_diameter_mm=2.0 * self.r_c,
                                    eccentricity_mm=self.e, face_width_mm=self.face_width_mm, bore_diameter_mm=0.0,
                                    output_pin_count=0)

    def validate(self) -> None:
        if self.z < 3:
            raise ValueError("EC gear: the wheel needs at least 3 teeth")
        if self.e >= self.max_eccentricity:
            raise ValueError("EC gear: eccentricity %.3f mm reaches the pinion's pitch radius %.3f mm -- the eccentric "
                             "centre's path would loop; keep e below it" % (self.e, self.max_eccentricity))
        if self.r_c <= self.e:
            raise ValueError("EC gear: the pinion radius %.3f mm must exceed the eccentricity %.3f mm (the axis must lie "
                             "inside the eccentric)" % (self.r_c, self.e))
        rho = self.max_pinion_radius
        if self.r_c > rho:
            raise ValueError("EC gear: pinion radius %.3f mm exceeds the %.3f mm least radius of curvature of the eccentric "
                             "centre's path -- the wheel profile would cross itself; a smaller pinion or eccentricity" % (self.r_c, rho))
        if self.pinion_bore_diameter_mm > 0 and 0.5 * self.pinion_bore_diameter_mm >= self.r_c - self.e:
            raise ValueError("EC gear: a %.2f mm bore on the pinion's axis breaks out of the eccentric (wall %.3f mm)" %
                             (self.pinion_bore_diameter_mm, self.r_c - self.e))
        if self.bore_diameter_mm > 0 and 0.5 * self.bore_diameter_mm >= self.wheel_root_radius:
            raise ValueError("EC gear: the wheel bore reaches its root circle")
        if self.face_width_mm <= 0 or self.lead <= 0:
            raise ValueError("EC gear: face width and lead must be positive")


# ---- the transverse geometry (the wheel frame, wheel turn 0) --------------

def eccentric_centre(ep: ECGearParams, theta: float) -> tuple[float, float]:
    """The eccentric's centre in the wheel's frame at pinion turn theta
    (wheel turned by -theta / z_w): (a + e cos theta, e sin theta) carried
    round by theta / z_w. At theta = 0 it is farthest from the wheel's axis,
    over a tooth tip on +X."""
    c, s = math.cos(theta / ep.z), math.sin(theta / ep.z)
    x, y = ep.a + ep.e * math.cos(theta), ep.e * math.sin(theta)
    return (c * x - s * y, s * x + c * y)


def wheel_profile_polygon(ep: ECGearParams, n_samples: int = 2000) -> Polygon:
    """The wheel's transverse profile: the drive disc's outline (the
    roller-centre curve offset inward by r_c) turned back by half a pitch
    -- the disc has its roller in a valley at angle 0, this wheel has the
    eccentric farthest away and a tip there."""
    poly = Polygon(disc_profile(ep.drive_params(), n_samples))
    if not poly.is_valid:
        poly = poly.buffer(0)
    return _rotate(poly, -180.0 / ep.z, origin=(0.0, 0.0))


def wheel_lobe_points(ep: ECGearParams, per_lobe: int = 24) -> list[list[tuple[float, float]]]:
    """The profile as z_w runs of exact equidistant points, one per lobe
    from valley bottom to valley bottom (consecutive runs share their end
    point; the last closes on the first): the solid's face is one spline
    through each run, so the twist-extrude makes one face per lobe."""
    n = per_lobe * ep.z
    raw = disc_profile(ep.drive_params(), n)
    c, s = math.cos(-math.pi / ep.z), math.sin(-math.pi / ep.z)
    pts = [(c * x - s * y, s * x + c * y) for x, y in raw]
    pts.append(pts[0])
    return [pts[k * per_lobe:(k + 1) * per_lobe + 1] for k in range(ep.z)]


def wheel_outline(ep: ECGearParams, simplify_tolerance_mm: float = 0.005, n_samples: int = 8000) -> list[tuple[float, float]]:
    """The profile as a polyline for the 2-D views and DXF (8000 samples:
    the chords sit within 1 um of the curve; 2000 left 15 um in the
    valleys, where the inward offset stretches the sampling)."""
    poly = wheel_profile_polygon(ep, n_samples)
    if poly.geom_type == "MultiPolygon":
        raise ValueError("EC gear: the wheel profile came out in pieces")
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords


def pinion_outline(ep: ECGearParams, n: int = 256) -> list[tuple[float, float]]:
    """The eccentric circle, for the 2-D views (the solid uses the exact circle)."""
    return [(ep.e + ep.r_c * math.cos(2 * math.pi * i / n), ep.r_c * math.sin(2 * math.pi * i / n)) for i in range(n)]


# ---- solids ---------------------------------------------------------------

def _twisted(face: bd.Face, height: float, twist_rad: float) -> bd.Solid:
    """The exact helicoidal sweep of a transverse face (section 7.3)."""
    if abs(twist_rad) < 1e-12:
        return bd.Solid.extrude(face, (0.0, 0.0, height))
    return bd.Solid.extrude_linear_with_rotation(face, (0.0, 0.0, 0.0), (0.0, 0.0, height), math.degrees(twist_rad))


def _bore(solid, diameter: float, height: float):
    if diameter <= 0:
        return solid
    return solid.cut(bd.Solid.make_cylinder(0.5 * diameter, height + 2.0).moved(bd.Location((0.0, 0.0, -1.0))))


def build_ec_pinion_solid(ep: ECGearParams) -> bd.Solid:
    """The eccentric screw: the circle of radius r_c centred at (e, 0),
    swept along +Z while turning by the pinion twist; bored on its axis."""
    ep.validate()
    with bd.BuildSketch() as sk:
        with bd.Locations((ep.e, 0.0)):
            bd.Circle(ep.r_c)
    return _bore(_twisted(sk.sketch.faces()[0], ep.face_width_mm, ep.pinion_twist_rad), ep.pinion_bore_diameter_mm, ep.face_width_mm)


def build_ec_wheel_solid(ep: ECGearParams, per_lobe: int = 24) -> bd.Solid:
    """The wheel: its transverse profile (one spline per lobe through
    exact equidistant points) swept along +Z while turning by the wheel
    twist (one pitch per lead, against the pinion); bored."""
    ep.validate()
    with bd.BuildSketch() as sk:
        with bd.BuildLine():
            for run in wheel_lobe_points(ep, per_lobe):
                bd.Spline(*run)
        bd.make_face()
    return _bore(_twisted(sk.sketch.faces()[0], ep.face_width_mm, ep.wheel_twist_rad), ep.bore_diameter_mm, ep.face_width_mm)


def wheel_turn_deg(ep: ECGearParams, pinion_turn_deg: float) -> float:
    """The wheel turns against the pinion, one tooth per pinion turn."""
    return -pinion_turn_deg / ep.z


def place_pinion(pinion, ep: ECGearParams, pinion_turn_deg: float = 0.0):
    """The pinion (its own frame, axis Z) turned about its axis and set at
    the centre distance on +X of the wheel's frame."""
    return pinion.rotate(bd.Axis.Z, pinion_turn_deg).translate((ep.a, 0.0, 0.0))


def build_ec_pair(ep: ECGearParams, pinion_turn_deg: float = 0.0, phase_error_deg: float = 0.0, per_lobe: int = 24):
    """(pinion, wheel) in the wheel frame, in mesh for the pinion turned by
    pinion_turn_deg (plus phase_error_deg on the wheel for a deliberate mis-mesh)."""
    pinion = place_pinion(build_ec_pinion_solid(ep), ep, pinion_turn_deg)
    wheel = build_ec_wheel_solid(ep, per_lobe).rotate(bd.Axis.Z, wheel_turn_deg(ep, pinion_turn_deg) + phase_error_deg)
    return pinion, wheel
