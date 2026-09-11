"""
The throated wheel of a double-enveloping worm drive, generated from the
built worm (docs/gear-math.md section 18.2) -- the worm is the hob.

Frames. The worm is built in its own frame (globoid_worm.py): axis Z,
throat at z = 0, the wheel centre C on +X at the centre distance a. The
wheel is built in ITS own frame: axis Z through its centre, the worm's
axis the line {X = a, Z = 0} along Y, so the worm's throat centre is at
(a, 0, 0) and the space this module generates is centred on +X. The map
from the worm frame (x, y, z) to the wheel frame is (a - x, z, y): a
half-turn about the axis (0, 1, 1) followed by the translation (a, 0, 0)
(place_worm). Turning the worm by theta_w about its axis turns the wheel
by theta_g = -theta_w z_w / z_g about its axis for a right-hand worm
(wheel_turn_rad) -- the relation thread_stations builds the thread with,
so the wheel generated here is conjugate to that thread.

Generation, one transverse station at a time (Z = h in the wheel frame,
a plane parallel to the worm's axis at distance h from it): the worm at
worm angle theta_w, sliced by that plane, is an exact set of polygons --
the core band (the hourglass core is a surface of revolution, its slice
is |X - a| <= sqrt(r_root(z)^2 - h^2)) and, for each thread start, one
band per turn: a station of the thread at worm-frame angle phi sits in
the pair frame at angle psi = phi + theta_w, meets the plane where its
radius is r = h / sin(psi), at X = a - h cot(psi), and there the station's
section (two straight flanks, root and tip circles about C) is a z-
interval, or two where the plane grazes the dipping tip arc. Rotated by
-theta_g about the wheel axis and unioned over theta_w (shapely), the
bands are the material the worm removes at that height. Clipped to one
pitch wedge and the wheel's throated outline, with a strip beyond the
outline so the tool cuts cleanly, each station's boundary is the same
four edges (strip top, two walls leaning in from the tooth-tip corners,
one profile spline from corner to corner) and a smooth loft through the
stations is the tooth-space tool -- face_gear.py's construction, with
polar geometry about the wheel axis instead of the face gear's planar
one. Patterned z_g times and cut from the throated blank in one N-ary
boolean.

The check that matters (tests/test_globoid_worm.py): the built worm,
placed in the wheel frame at several turn angles with the wheel turned
by the ratio, overlaps the built wheel by sliver amounts only, and turned
half a wheel pitch it collides.
"""
from __future__ import annotations

import math

import numpy as np
import build123d as bd
import shapely
from shapely.geometry import Polygon, box
from shapely.geometry.polygon import orient

from globoid_worm import GloboidWormParams, thread_section, thread_beta_range, flank_line
from face_gear import _resample, loft_solid


# ---- frames ----

def wheel_turn_rad(gp: GloboidWormParams, worm_turn_rad: float) -> float:
    """theta_g for a worm turn theta_w: the wheel's tooth space in the
    central plane moves by -sign theta_w z_w / z_g (thread_stations)."""
    sign = 1.0 if gp.hand != "left" else -1.0
    return -sign * worm_turn_rad * gp.starts / gp.wheel_teeth


def place_worm(worm, gp: GloboidWormParams, worm_turn_deg: float = 0.0):
    """The worm solid (its own frame) turned by worm_turn_deg about its own
    axis and placed in the wheel frame."""
    return (worm.rotate(bd.Axis.Z, worm_turn_deg)
                .rotate(bd.Axis((0, 0, 0), (0, 1, 1)), 180.0)
                .translate((gp.centre_distance, 0.0, 0.0)))


# ---- the worm's slice by a transverse plane of the wheel ----

class _ThreadSampler:
    """One thread start's slices by transverse planes of the wheel.

    A station of the thread at worm-frame angle phi sits, once the worm has
    turned by theta_w, in the axial plane at pair angle psi = phi + theta_w
    and meets the plane y = h where its radius is r = h / sin(psi). With
    the thread's radii between r_min and r_max, each turn of the thread
    crosses the plane in two windows of psi -- sin(psi) between h/r_max
    and h/r_min, one near psi = asin(h/r) and one near pi - asin(h/r) --
    that are narrow when h is small (the plane nearly contains the axis:
    0.037 h radians wide), so they are found by inverting that condition
    and sampled densely inside, with the section evaluated at those exact
    angles; a uniform sampling in phi would miss them entirely near the
    central plane (it did)."""

    def __init__(self, gp: GloboidWormParams, start_index: int, root_overlap_mm: float = 0.3):
        self.gp = gp
        self.ratio = gp.starts / gp.wheel_teeth
        self.sign = 1.0 if gp.hand != "left" else -1.0
        self.beta0 = 2.0 * math.pi * start_index / gp.wheel_teeth
        b_lo, b_hi = thread_beta_range(gp)
        self.phi_a, self.phi_b = sorted(((b_lo - self.beta0) / (self.sign * self.ratio),
                                         (b_hi - self.beta0) / (self.sign * self.ratio)))
        self.half_pitch, self.psi_t = math.pi / gp.wheel_teeth, gp.tooth_half_angle
        self.rho_tip = gp.tip_rho
        self.rho_root = gp.root_rho + root_overlap_mm
        self.a = gp.centre_distance
        # radial extent of the sections about the worm axis
        self.r_min = self.a - self.rho_root
        self.r_max = self.a - self.rho_tip * math.cos(self.half_pitch + self.psi_t + 0.3)   # generous

    def _flank(self, gamma: np.ndarray, sign: int):
        """Vectorised flank_line: (pz, pr, dz, dr) arrays."""
        al = self.gp.pressure_angle_rad
        rg = self.gp.wheel_pitch_radius
        uz, ur = np.sin(gamma), -np.cos(gamma)
        ez, er = np.cos(gamma), np.sin(gamma)
        dz = math.cos(al) * uz + sign * math.sin(al) * ez
        dr = math.cos(al) * ur + sign * math.sin(al) * er
        return rg * np.sin(gamma), self.a - rg * np.cos(gamma), dz, dr

    def _windows(self, theta_w: float, h: float):
        """The psi windows in which this thread crosses the plane y = h."""
        s_lo = abs(h) / self.r_max
        s_hi = min(1.0, abs(h) / self.r_min)
        if s_lo >= 1.0:
            return []
        a_lo, a_hi = math.asin(s_lo), math.asin(s_hi)
        base = [(a_lo, a_hi), (math.pi - a_hi, math.pi - a_lo)] if h > 0 else \
               [(math.pi + a_lo, math.pi + a_hi), (2.0 * math.pi - a_hi, 2.0 * math.pi - a_lo)]
        psi_a, psi_b = self.phi_a + theta_w, self.phi_b + theta_w
        n0 = int(math.floor(psi_a / (2.0 * math.pi))) - 1
        n1 = int(math.ceil(psi_b / (2.0 * math.pi))) + 1
        out = []
        for n in range(n0, n1 + 1):
            for lo, hi in base:
                w0, w1 = lo + 2.0 * math.pi * n, hi + 2.0 * math.pi * n
                w0, w1 = max(w0, psi_a), min(w1, psi_b)
                if w1 > w0 + 1e-12:
                    out.append((w0, w1))
        return out

    def bands(self, theta_w: float, h: float, samples: int = 40):
        """Polygons (pair frame (x, z), x toward the wheel centre) of this
        thread's slice by the plane y = h with the worm turned by theta_w."""
        polys = []
        for w0, w1 in self._windows(theta_w, h):
            psi = np.linspace(w0, w1, samples)
            s = np.sin(psi)
            r = h / s
            x = r * np.cos(psi)
            phi = psi - theta_w
            beta = self.beta0 + self.sign * phi * self.ratio
            lpz, lpr, ldz, ldr = self._flank(beta - self.half_pitch + self.psi_t, -1)
            upz, upr, udz, udr = self._flank(beta + self.half_pitch - self.psi_t, +1)
            z_low = lpz + (r - lpr) * ldz / ldr
            z_up = upz + (r - upr) * udz / udr
            d = self.a - r
            z_root = np.sqrt(np.clip(self.rho_root ** 2 - d * d, 0.0, None))
            z_tip = np.sqrt(np.clip(self.rho_tip ** 2 - d * d, 0.0, None))
            inside_tip = d < self.rho_tip
            lo = np.maximum(z_low, -z_root)
            hi = np.minimum(z_up, z_root)
            ok = hi > lo + 1e-9
            # Inside the tip circle (the plane's radial line passes closer to C
            # than the tip surface) the thread only exists where |z| >= z_tip:
            # the interval is cut into a lower horn below -z_tip and an upper
            # horn above +z_tip, either of which may be empty -- an interval
            # wholly inside (-z_tip, z_tip) is above the thread's tip and is
            # dropped. (A first version only split intervals that straddled
            # the circle and kept the ones wholly inside it: bands then ran
            # 2 mm past the tip and the tools overlapped each other.)
            for lo_, hi_, good in ((lo, np.where(inside_tip, np.minimum(hi, -z_tip), hi), ok),
                                   (np.where(inside_tip, np.maximum(lo, z_tip), lo), hi, ok & inside_tip)):
                good = good & (hi_ > lo_ + 1e-9)
                k = 0
                while k < samples:
                    if not good[k]:
                        k += 1
                        continue
                    m = k
                    while m + 1 < samples and good[m + 1]:
                        m += 1
                    if m > k:
                        polys.append(self._band(x[k:m + 1], lo_[k:m + 1], hi_[k:m + 1]))
                    k = m + 1
        return polys

    @staticmethod
    def _band(x, lo, hi):
        pts = [(float(xx), float(zz)) for xx, zz in zip(x, lo)] + [(float(xx), float(zz)) for xx, zz in zip(x[::-1], hi[::-1])]
        return Polygon(pts)


def core_band(gp: GloboidWormParams, h: float, n: int = 64):
    """The hourglass core's slice by the plane y = h (pair frame (x, z));
    the core is a surface of revolution, so the worm's own turn does not
    change it. Possibly two pieces (the throat is the core's waist)."""
    half = 0.5 * gp.length
    zs = np.linspace(-half, half, n + 1)
    w = np.array([math.sqrt(max(0.0, gp.root_radius_at(z) ** 2 - h * h)) for z in zs])
    polys = []
    i = 0
    while i <= n:
        if w[i] <= 1e-9:
            i += 1
            continue
        j = i
        while j + 1 <= n and w[j + 1] > 1e-9:
            j += 1
        if j > i:
            pts = [(float(w[k]), float(zs[k])) for k in range(i, j + 1)] + [(float(-w[k]), float(zs[k])) for k in range(j, i - 1, -1)]
            polys.append(Polygon(pts))
        i = j + 1
    return polys


def _to_wheel_frame(poly: Polygon, gp: GloboidWormParams, theta_g: float) -> Polygon:
    """Pair-frame slice (x toward C, z along the worm axis) -> wheel frame
    (X = a - x, Y = z), then rotated by -theta_g about the wheel axis."""
    a = gp.centre_distance
    c, s = math.cos(-theta_g), math.sin(-theta_g)
    xy = np.array(poly.exterior.coords)
    X = a - xy[:, 0]
    Y = xy[:, 1]
    return Polygon(np.column_stack([X * c - Y * s, X * s + Y * c]))


def wheel_outer_radius_at(gp: GloboidWormParams, h: float) -> float:
    """The throated wheel's outer radius at height h (about its axis): the
    tip surface is the revolve, about the wheel axis, of the circle of
    radius r_w - h_a about the worm's axis (it clears the worm's root)."""
    r = gp.pitch_radius - gp.addendum
    return gp.centre_distance - math.sqrt(max(0.0, r * r - h * h))


def wheel_station_section(gp: GloboidWormParams, h: float, samplers: list[_ThreadSampler],
                          d_theta_w_deg: float = 2.0, strip_mm: float = 1.5):
    """The tooth-space section at height h in the wheel frame: what the
    worm removes there over the generating motion, within the pitch wedge
    about +X and inside the wheel's outer circle, plus the strip beyond.
    Returns (polygon, R_outer)."""
    R = wheel_outer_radius_at(gp, h)
    half_pitch = math.pi / gp.wheel_teeth
    exposure = 0.5 * gp.wrap_angle_rad + half_pitch + 0.25
    ratio = gp.starts / gp.wheel_teeth
    n = int(math.ceil(2.0 * exposure / ratio / math.radians(d_theta_w_deg)))
    pieces = []
    core = core_band(gp, h)
    wedge_box = box(gp.wheel_pitch_radius - 2.0 * gp.dedendum - 3.0, -(R + strip_mm + 1.0) * math.sin(half_pitch) - 1.0,
                    R + strip_mm + 1.0, (R + strip_mm + 1.0) * math.sin(half_pitch) + 1.0)
    for i in range(n + 1):
        theta_w = (-exposure + 2.0 * exposure * i / n) / ratio
        theta_g = wheel_turn_rad(gp, theta_w)
        for poly in core:
            p = _to_wheel_frame(poly, gp, theta_g)
            if p.intersects(wedge_box):
                pieces.append(p.intersection(wedge_box))
        for smp in samplers:
            for poly in smp.bands(theta_w, h):
                p = _to_wheel_frame(poly, gp, theta_g)
                if p.intersects(wedge_box):
                    pieces.append(p.intersection(wedge_box))
    removed = shapely.union_all(pieces, grid_size=1e-7)
    # the pitch wedge about +X, inside the outer circle, as a polygon
    n_arc = 48
    r_in = gp.wheel_pitch_radius - gp.dedendum - 1.0
    ang = np.linspace(-half_pitch, half_pitch, n_arc + 1)
    wedge = Polygon([(r_in * math.cos(t), r_in * math.sin(t)) for t in ang] +
                    [(R * math.cos(t), R * math.sin(t)) for t in ang[::-1]])
    below = removed.intersection(wedge)
    if below.geom_type != "Polygon":
        below = max(below.geoms, key=lambda g: g.area)
    # the strip beyond the outer circle over the whole wedge (trimmed to the corners later)
    strip = Polygon([(R * math.cos(t), R * math.sin(t)) for t in ang] +
                    [((R + strip_mm) * math.cos(t), (R + strip_mm) * math.sin(t)) for t in ang[::-1]])
    section = below.union(strip)
    if section.geom_type != "Polygon":
        section = max(section.geoms, key=lambda g: g.area)
    return section, R


def wheel_station_wire(gp: GloboidWormParams, h: float, section: Polygon, R: float, n_profile: int = 80,
                       strip_mm: float = 1.5) -> bd.Wire:
    """Four edges at height h: the strip's outer arc-chord, two walls
    leaning inward from the tooth-tip corners (the points where the space
    meets the outer circle), and the profile spline from corner to corner
    (down one flank, across the root, up the other)."""
    eps = 1e-6
    ring = list(orient(section, sign=1.0).exterior.coords)[:-1]     # counter-clockwise
    n = len(ring)
    rad = [math.hypot(x, y) for x, y in ring]
    on_circle = [abs(r - R) < 1e-5 for r in rad]
    # the corners: the two ends of the run of boundary points on the outer circle that
    # borders the space (the strip's outer arc is at R + strip, the walls are radial lines
    # at +-half_pitch -- the run on r = R between the walls' feet, on the space side)
    # find a boundary index inside the space (radius < R - eps) and walk both ways to the circle
    inside = [i for i in range(n) if rad[i] < R - 1e-4]
    if not inside:
        raise RuntimeError("throated wheel station: no tooth space below the outer circle")
    # walk from an inside point in both directions until the boundary reaches r = R
    i0 = inside[len(inside) // 2]
    j = i0
    while not on_circle[j % n]:
        j -= 1
    k = i0
    while not on_circle[k % n]:
        k += 1
    j %= n; k %= n
    profile_idx = [(j + t) % n for t in range((k - j) % n + 1)]
    prof = [ring[t] for t in profile_idx]
    ys, zs = _resample(prof, n_profile)
    corner_a, corner_b = (ys[0], zs[0]), (ys[-1], zs[-1])
    v = lambda x, y: bd.Vector(x, y, h)
    profile = [v(x, y) for x, y in zip(ys, zs)]
    ang_a, ang_b = math.atan2(corner_a[1], corner_a[0]), math.atan2(corner_b[1], corner_b[0])
    lean = 0.3 * abs(ang_b - ang_a)
    lean = min(lean, math.radians(1.0))
    top_a = v((R + strip_mm) * math.cos(ang_a + math.copysign(lean, ang_b - ang_a)), (R + strip_mm) * math.sin(ang_a + math.copysign(lean, ang_b - ang_a)))
    top_b = v((R + strip_mm) * math.cos(ang_b - math.copysign(lean, ang_b - ang_a)), (R + strip_mm) * math.sin(ang_b - math.copysign(lean, ang_b - ang_a)))
    params = list(np.linspace(0.0, 1.0, len(profile)))
    edges = [bd.Edge.make_line(top_b, top_a), bd.Edge.make_line(top_a, profile[0]),
             bd.Edge.make_spline(profile, parameters=params), bd.Edge.make_line(profile[-1], top_b)]
    return bd.Wire(edges)


def wheel_blank_solid(gp: GloboidWormParams) -> bd.Part:
    """The throated blank: revolve about Z of the outline whose outer edge
    follows wheel_outer_radius_at between the two faces, bored if asked."""
    b = gp.wheel_face_width
    n = 32
    hs = [-0.5 * b + b * i / n for i in range(n + 1)]
    outer = [(wheel_outer_radius_at(gp, h), h) for h in hs]
    r_in = gp.wheel_bore_diameter_mm / 2.0
    pts = [(r_in, -0.5 * b)] + outer + [(r_in, 0.5 * b)]
    with bd.BuildPart() as part:
        with bd.BuildSketch(bd.Plane.XZ):
            with bd.BuildLine():
                bd.Polyline(*pts, pts[0])
            bd.make_face()
        bd.revolve(axis=bd.Axis.Z, revolution_arc=360)
    return part.part


def space_cutter(gp: GloboidWormParams, n_stations: int = 9, d_theta_w_deg: float = 2.0, n_profile: int = 80):
    """One tooth space of the wheel: the loft through n_stations transverse
    stations from 0.3 mm outside one face to 0.3 mm outside the other."""
    samplers = [_ThreadSampler(gp, k) for k in range(gp.starts)]
    b = gp.wheel_face_width
    wires = []
    for i in range(n_stations):
        h = -0.5 * b - 0.3 + (b + 0.6) * i / (n_stations - 1)
        if abs(h) < 1e-6:
            h = 1e-3
        section, R = wheel_station_section(gp, h, samplers, d_theta_w_deg)
        wires.append(wheel_station_wire(gp, h, section, R, n_profile))
    tool = loft_solid(wires)
    if not tool.is_valid:
        raise RuntimeError("throated wheel: the lofted space tool is not a valid solid")
    return tool


def build_throated_wheel_solid(gp: GloboidWormParams, n_stations: int = 9, d_theta_w_deg: float = 2.0,
                               n_profile: int = 80):
    """The blank cut by z_g patterned copies of the generated space (one
    N-ary boolean; sequential fallback)."""
    tool = space_cutter(gp, n_stations, d_theta_w_deg, n_profile)
    pitch_deg = 360.0 / gp.wheel_teeth
    tools = [tool.rotate(bd.Axis.Z, k * pitch_deg) for k in range(gp.wheel_teeth)]
    blank = wheel_blank_solid(gp)
    try:
        wheel = blank.cut(*tools)
        if len(wheel.solids()) == 1 and wheel.is_valid:
            return wheel
    except ValueError:
        pass
    wheel = blank
    for t in tools:
        wheel = wheel.cut(t)
    return wheel
