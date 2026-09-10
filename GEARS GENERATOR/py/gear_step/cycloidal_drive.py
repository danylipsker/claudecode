"""
Cycloidal drive (hypocycloid speed reducer): an eccentric input turns a
lobed disc that rolls inside a ring of N fixed rollers (pins); the disc,
having N - 1 lobes, turns back by one lobe per input revolution, so the
reduction is (N - 1) : 1 -- with zero backlash and every roller sharing
the load. docs/gear-math.md section 15.

The disc profile is DERIVED here, not copied: the disc is the envelope of
the rollers as seen from the disc. With the pin ring fixed, pin centres at
radius R, the disc centre orbiting at eccentricity E (input angle phi) and
the disc turning by theta = -phi / (N - 1) (pure rolling of the disc's
pitch circle (N-1)E inside the ring's NE), one pin centre P = (R, 0) has,
in the disc's own frame,

    u(phi) = Rot(phi/(N-1)) . (R - E cos phi, -E sin phi)          phi in [0, 2 pi (N-1)]

-- a closed curve with N - 1 lobes -- and the disc profile is that curve
offset TOWARD the disc centre by the roller radius R_r (the inner envelope
of the roller circles carried along it). The tangent is analytic:
du/dphi = Rot(beta) . (J v / (N-1) + v'), beta = phi/(N-1), v = (R - E cos
phi, -E sin phi), J the quarter turn. The curve has a cusp exactly when
E N = R (worked out from du/dphi = 0), so E < R / N is the design limit,
and the offset self-intersects if the curve's radius of curvature dips
below R_r.

Output: N_out pins fixed to the output shaft (coaxial with the ring) run
in holes of diameter d_out + 2E in the disc -- the disc's orbit of radius E
is exactly what the extra 2E absorbs -- so the output turns with the
disc's rotation and not with its orbit.

Checks (tests/test_cycloidal_drive.py): the envelope property itself --
at every sampled input angle EVERY roller is tangent to the placed disc
(distance from its centre to the disc outline = R_r, neither penetrating
nor lifting off); lobe count and ratio; the cusp limit; the output pins
touching their holes at exactly E at every angle; solids and the multi-
body STEP.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

import build123d as bd
from shapely.geometry import Point, Polygon


@dataclass
class CycloidalDriveParams:
    lobes: int = 10                          # N - 1; the reduction ratio
    pin_circle_diameter_mm: float = 60.0     # 2 R, the rollers' centre circle
    roller_diameter_mm: float = 6.0          # 2 R_r
    eccentricity_mm: float = 1.5             # E
    face_width_mm: float = 10.0              # disc thickness = roller length
    bore_diameter_mm: float = 20.0           # the eccentric bearing's seat, centred on the disc
    output_pin_count: int = 0                # 0 = no output holes
    output_pin_diameter_mm: float = 6.0
    output_circle_diameter_mm: float = 30.0  # the output pins' (and holes') centre circle

    @property
    def n_pins(self) -> int:
        return self.lobes + 1

    @property
    def R(self) -> float:
        return self.pin_circle_diameter_mm / 2.0

    @property
    def R_r(self) -> float:
        return self.roller_diameter_mm / 2.0

    @property
    def E(self) -> float:
        return self.eccentricity_mm

    @property
    def ratio(self) -> float:
        return float(self.lobes)

    @property
    def max_eccentricity_mm(self) -> float:
        """E must stay below R / N or the base curve develops cusps."""
        return self.R / self.n_pins

    @property
    def output_hole_diameter_mm(self) -> float:
        return self.output_pin_diameter_mm + 2.0 * self.E

    def disc_rotation_deg(self, input_deg: float) -> float:
        """theta(phi): the disc turns against the input, one lobe per input turn."""
        return -input_deg / self.lobes

    def disc_center(self, input_deg: float) -> tuple[float, float]:
        phi = math.radians(input_deg)
        return (self.E * math.cos(phi), self.E * math.sin(phi))

    def pin_centers(self) -> list[tuple[float, float]]:
        return [(self.R * math.cos(2 * math.pi * j / self.n_pins), self.R * math.sin(2 * math.pi * j / self.n_pins))
                for j in range(self.n_pins)]

    def output_pin_centers(self, input_deg: float = 0.0) -> list[tuple[float, float]]:
        """Fixed to the output shaft, which turns with the disc's rotation."""
        th = math.radians(self.disc_rotation_deg(input_deg))
        r = self.output_circle_diameter_mm / 2.0
        return [(r * math.cos(2 * math.pi * k / self.output_pin_count + th),
                 r * math.sin(2 * math.pi * k / self.output_pin_count + th))
                for k in range(self.output_pin_count)]

    def output_hole_centers_disc_frame(self) -> list[tuple[float, float]]:
        r = self.output_circle_diameter_mm / 2.0
        return [(r * math.cos(2 * math.pi * k / self.output_pin_count), r * math.sin(2 * math.pi * k / self.output_pin_count))
                for k in range(self.output_pin_count)]


def _rot(p: tuple[float, float], a: float) -> tuple[float, float]:
    c, s = math.cos(a), math.sin(a)
    return (c * p[0] - s * p[1], s * p[0] + c * p[1])


def roller_center_curve(dp: CycloidalDriveParams, phi: float) -> tuple[float, float]:
    """u(phi): one roller's centre as seen from the disc."""
    v = (dp.R - dp.E * math.cos(phi), -dp.E * math.sin(phi))
    return _rot(v, phi / dp.lobes)


def roller_center_tangent(dp: CycloidalDriveParams, phi: float) -> tuple[float, float]:
    """du/dphi, analytic."""
    v = (dp.R - dp.E * math.cos(phi), -dp.E * math.sin(phi))
    jv = (-v[1], v[0])
    vp = (dp.E * math.sin(phi), -dp.E * math.cos(phi))
    inner = (jv[0] / dp.lobes + vp[0], jv[1] / dp.lobes + vp[1])
    return _rot(inner, phi / dp.lobes)


def disc_profile(dp: CycloidalDriveParams, n_samples: int = 2000) -> list[tuple[float, float]]:
    """The disc outline in its own frame: the roller-centre curve offset
    toward the disc centre by R_r."""
    pts = []
    total = 2 * math.pi * dp.lobes
    for i in range(n_samples):
        phi = total * i / n_samples
        u = roller_center_curve(dp, phi)
        t = roller_center_tangent(dp, phi)
        norm = math.hypot(*t)
        n = (-t[1] / norm, t[0] / norm)           # a unit normal
        if n[0] * u[0] + n[1] * u[1] < 0:         # make it point away from the disc centre (toward the roller)
            n = (-n[0], -n[1])
        pts.append((u[0] - dp.R_r * n[0], u[1] - dp.R_r * n[1]))
    return pts


def min_radius_of_curvature(dp: CycloidalDriveParams, n_samples: int = 4000) -> float:
    """Of the roller-centre curve, over its CONVEX stretches only (centre of
    curvature on the disc side): an inward offset self-intersects where a
    convex stretch is tighter than R_r, while the concave valleys between
    the lobes only get gentler when offset inward and are irrelevant --
    measured, not assumed: the default 10-lobe disc has 1.2 mm valleys and
    a perfectly valid 3 mm-roller profile. The curve runs counter-clockwise
    (it is Rot(phi/(N-1)) applied to a point that stays near (R, 0)), so
    convex means the tangent turns left: cross(t, a) > 0."""
    best = float("inf")
    total = 2 * math.pi * dp.lobes
    h = total / n_samples
    for i in range(n_samples):
        phi = total * i / n_samples
        t0 = roller_center_tangent(dp, phi - h)
        t1 = roller_center_tangent(dp, phi)
        t2 = roller_center_tangent(dp, phi + h)
        speed = math.hypot(*t1)
        acc = ((t2[0] - t0[0]) / (2 * h), (t2[1] - t0[1]) / (2 * h))
        cross = t1[0] * acc[1] - t1[1] * acc[0]
        if cross > 1e-15:
            best = min(best, speed ** 3 / cross)
    return best


def disc_polygon(dp: CycloidalDriveParams, n_samples: int = 2000) -> Polygon:
    poly = Polygon(disc_profile(dp, n_samples))
    if not poly.is_valid:
        poly = poly.buffer(0)
    if dp.bore_diameter_mm > 0:
        poly = poly.difference(Point(0, 0).buffer(dp.bore_diameter_mm / 2.0, 128))
    if dp.output_pin_count > 0:
        for c in dp.output_hole_centers_disc_frame():
            poly = poly.difference(Point(*c).buffer(dp.output_hole_diameter_mm / 2.0, 96))
    return poly


def disc_outline(dp: CycloidalDriveParams, simplify_tolerance_mm: float = 0.005) -> list[tuple[float, float]]:
    poly = Polygon(disc_profile(dp))
    if not poly.is_valid:
        poly = poly.buffer(0)
    if poly.geom_type == "MultiPolygon":
        poly = max(poly.geoms, key=lambda g: g.area)
    if simplify_tolerance_mm > 0:
        poly = poly.simplify(simplify_tolerance_mm, preserve_topology=True)
    coords = list(poly.exterior.coords)
    if coords and coords[0] == coords[-1]:
        coords = coords[:-1]
    return coords


def build_disc_solid(dp: CycloidalDriveParams, simplify_tolerance_mm: float = 0.005) -> bd.Part:
    """The lobed disc in its own frame (centre at the origin): outline
    extruded, bore and output holes cut."""
    pts = disc_outline(dp, simplify_tolerance_mm)
    closed = pts + [pts[0]]
    with bd.BuildPart() as part:
        with bd.BuildSketch():
            with bd.BuildLine():
                bd.Polyline(*closed)
            bd.make_face()
        bd.extrude(amount=dp.face_width_mm)
        holes = []
        if dp.bore_diameter_mm > 0:
            holes.append(((0.0, 0.0), dp.bore_diameter_mm / 2.0))
        if dp.output_pin_count > 0:
            holes += [(c, dp.output_hole_diameter_mm / 2.0) for c in dp.output_hole_centers_disc_frame()]
        for (cx, cy), r in holes:
            with bd.BuildSketch(bd.Plane.XY.offset(dp.face_width_mm)):
                with bd.Locations((cx, cy)):
                    bd.Circle(r)
            bd.extrude(amount=-dp.face_width_mm, mode=bd.Mode.SUBTRACT)
    return part.part


def build_drive_assembly(dp: CycloidalDriveParams, input_deg: float = 0.0, simplify_tolerance_mm: float = 0.005):
    """(disc placed in the fixed frame at the given input angle, [rollers],
    [output pins]) -- the disc orbits at E and turns by theta(phi); the
    rollers are fixed; the output pins turn with the disc's rotation."""
    disc = build_disc_solid(dp, simplify_tolerance_mm)
    cx, cy = dp.disc_center(input_deg)
    disc = disc.rotate(bd.Axis.Z, dp.disc_rotation_deg(input_deg)).translate((cx, cy, 0))
    rollers = [bd.Solid.make_cylinder(dp.R_r, dp.face_width_mm, bd.Plane((px, py, 0)))
               for (px, py) in dp.pin_centers()]
    out_pins = [bd.Solid.make_cylinder(dp.output_pin_diameter_mm / 2.0, dp.face_width_mm, bd.Plane((px, py, 0)))
                for (px, py) in dp.output_pin_centers(input_deg)] if dp.output_pin_count > 0 else []
    return disc, rollers, out_pins
