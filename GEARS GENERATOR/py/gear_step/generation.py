"""
The generation machinery shared by every family whose member is the ENVELOPE
of a real built solid moving relative to it -- the hypoid pinion (section
21), the throated worm wheel (section 22): section the static generator by
the station plane pulled back into its frame at each phase, union the
sections per station, loft one tooth space through the stations, pattern
and cut.  Every hard-won detail of that pipeline lives here once, with the
measurement that earned it (docs/gear-math.md 21.2):

  section_triangles   the cut face tessellated -- immune to edge order, with
                      a wire fallback for a face BRepMesh leaves untriangulated
  swept_station       union of the sections over the phases, clipped to the
                      station disc, one piece (crumbs dropped, more is an
                      error), tidied by a 10 um close-then-open
  space_profile       the LONGEST off-rim stretch of the boundary, never the
                      first (a spurious one-point stretch made a degenerate
                      tool once)
  smooth_profile      a 30 um Gaussian along the arc length before resampling,
                      or the generator's own facets become flank waviness
  space_wires         profile spline (uniform parameters) + rim arc per station
  space_tool          the loft of those wires
  cut_spaces          n patterned tools, one N-ary cut, sequential fallback,
                      edge curves slimmed for STEP
"""
from __future__ import annotations

import math

import build123d as bd
import numpy as np
from shapely.geometry import Point, Polygon
from shapely.ops import unary_union

from face_gear import loft_solid, slim_edge_curves, _resample


def rot_z(deg: float) -> np.ndarray:
    c, s = math.cos(math.radians(deg)), math.sin(math.radians(deg))
    return np.array([[c, -s, 0.0], [s, c, 0.0], [0.0, 0.0, 1.0]])


def section_triangles(solid: bd.Solid, plane: bd.Plane, half_size: float, tolerance: float):
    """The solid's cross-section on the plane, as triangles in the plane's
    own 2-D coordinates (the section face tessellated -- exact to
    `tolerance`, and immune to the order OpenCASCADE hands back the
    section's edges in)."""
    window = bd.Face.make_rect(2.0 * half_size, 2.0 * half_size, plane)
    try:
        cut = window.intersect(solid)
    except ValueError:      # build123d raises on some empty booleans ...
        return []
    if cut is None:         # ... and returns None on others (the tooth misses the plane)
        return []
    tris = []
    for face in cut.faces():
        try:
            verts, faces = face.tessellate(tolerance, 0.2)
        except AttributeError:
            # BRepMesh produced no triangulation (measured once in ~2000
            # sections: a sliver face where the plane just grazes a tooth
            # edge): trace its outer wire instead -- a section face is
            # planar and, for one tooth, without holes
            if face.area < 1e-6:
                continue
            wire = face.outer_wire()
            pts = [plane.to_local_coords(wire.position_at(t)) for t in np.linspace(0.0, 1.0, 64, endpoint=False)]
            loop = [(p.X, p.Y) for p in pts]
            for i in range(1, len(loop) - 1):
                tris.append((loop[0], loop[i], loop[i + 1]))
            continue
        uv = [plane.to_local_coords(v) for v in verts]
        for i, j, k in faces:
            tris.append(((uv[i].X, uv[i].Y), (uv[j].X, uv[j].Y), (uv[k].X, uv[k].Y)))
    return tris


class MeshSectioner:
    """A generator solid as an outward-oriented triangle mesh, sectioned by
    planes in numpy: the same section as `section_triangles` -- the mesh is
    within `tolerance` of the exact surface, as the section face's
    tessellation there is -- at a few milliseconds a plane instead of the
    ~400 ms OpenCASCADE takes to intersect a plane with a 4-turn thread
    loft (measured on the globoid worm; BRepAlgoAPI_Section was 50x worse).

    The plane cuts every triangle it crosses in a segment; the segments
    are oriented with the solid on their left (tangent = plane normal x
    outward normal), chained end to start into rings by exact coordinate
    match (a crossing point is computed from the edge's two vertices in a
    canonical order, so the two faces sharing the edge produce it bit for
    bit), and rings of positive area are outer boundaries, negative ones
    holes. A ring that does not close is an error, not a guess."""

    def __init__(self, solids, tolerance: float = 0.005, angular_tolerance: float = 0.1):
        if not isinstance(solids, (list, tuple)):
            solids = [solids]
        V, T, offset = [], [], 0
        for s in solids:
            verts, tris = s.tessellate(tolerance, angular_tolerance)
            v = np.array([[p.X, p.Y, p.Z] for p in verts], dtype=float)
            V.append(v)
            T.append(np.array(tris, dtype=np.int64) + offset)
            offset += len(v)
        self.v = np.vstack(V)
        self.t = np.vstack(T)
        a, b, c = self.v[self.t[:, 0]], self.v[self.t[:, 1]], self.v[self.t[:, 2]]
        n = np.cross(b - a, c - a)
        length = np.linalg.norm(n, axis=1)
        keep = length > 1e-14
        self.t, n, length = self.t[keep], n[keep], length[keep]
        self.n = n / length[:, None]
        self.signed_volume = float(np.einsum("ij,ij->i", a[keep], np.cross(b[keep], c[keep])).sum() / 6.0)
        if self.signed_volume <= 0.0:
            raise RuntimeError("MeshSectioner: the tessellation is not outward oriented")

    def section_polygons(self, plane: bd.Plane, min_area: float = 1e-8) -> list[Polygon]:
        o = np.array(tuple(plane.origin), dtype=float)
        N = np.array(tuple(plane.z_dir), dtype=float)
        N /= np.linalg.norm(N)
        X = np.array(tuple(plane.x_dir), dtype=float)
        X -= N * (X @ N)
        X /= np.linalg.norm(X)
        Y = np.cross(N, X)
        d = (self.v - o) @ N
        above = d >= 0.0
        flags = above[self.t]
        s = flags.sum(axis=1)
        idx = np.nonzero((s == 1) | (s == 2))[0]
        if idx.size == 0:
            return []
        tri, fl = self.t[idx], flags[idx]
        ends = []                                    # the two crossing points of each triangle, in edge order
        for e0, e1 in ((0, 1), (1, 2), (2, 0)):
            m = fl[:, e0] != fl[:, e1]
            i, j = tri[:, e0], tri[:, e1]
            a, b = self.v[i], self.v[j]
            da, db = d[i], d[j]
            # canonical order of the edge's two vertices, so the neighbouring
            # face computes the identical point
            swap = (a[:, 0] > b[:, 0]) | ((a[:, 0] == b[:, 0]) & ((a[:, 1] > b[:, 1]) | ((a[:, 1] == b[:, 1]) & (a[:, 2] > b[:, 2]))))
            a2, b2 = np.where(swap[:, None], b, a), np.where(swap[:, None], a, b)
            da2, db2 = np.where(swap, db, da), np.where(swap, da, db)
            with np.errstate(divide="ignore", invalid="ignore"):     # non-crossing edges: 0/0, discarded below
                t = da2 / (da2 - db2)
                p = a2 + t[:, None] * (b2 - a2)
            p[~m] = np.nan
            ends.append(p)
        ends = np.stack(ends, axis=1)                # (m, 3 edges, 3)
        ok = ~np.isnan(ends[:, :, 0])
        assert np.all(ok.sum(axis=1) == 2)
        order = np.argsort(~ok, axis=1, kind="stable")[:, :2]
        p0 = ends[np.arange(idx.size), order[:, 0]]
        p1 = ends[np.arange(idx.size), order[:, 1]]
        # solid on the left: tangent = N x n_out
        tang = np.cross(N, self.n[idx])
        flip = np.einsum("ij,ij->i", p1 - p0, tang) < 0.0
        p0, p1 = np.where(flip[:, None], p1, p0), np.where(flip[:, None], p0, p1)
        q0 = np.stack([(p0 - o) @ X, (p0 - o) @ Y], axis=1)
        q1 = np.stack([(p1 - o) @ X, (p1 - o) @ Y], axis=1)
        nz = np.linalg.norm(q1 - q0, axis=1) > 1e-12
        q0, q1 = q0[nz], q1[nz]
        return _rings_to_polygons(_chain(q0, q1), min_area)


def _chain(q0: np.ndarray, q1: np.ndarray) -> list[np.ndarray]:
    """Oriented segments q0 -> q1 chained into closed rings."""
    from collections import defaultdict
    key = lambda p: (round(float(p[0]), 9), round(float(p[1]), 9))
    starts = defaultdict(list)
    for i in range(len(q0)):
        starts[key(q0[i])].append(i)
    used = np.zeros(len(q0), dtype=bool)
    rings = []
    for s in range(len(q0)):
        if used[s]:
            continue
        ring = [q0[s]]
        used[s] = True
        cur = s
        k_home = key(q0[s])
        for _ in range(len(q0)):
            k = key(q1[cur])
            if k == k_home:
                break
            nxt = next((j for j in starts.get(k, ()) if not used[j]), None)
            if nxt is None:
                free = np.nonzero(~used)[0]
                if free.size:
                    dist = np.linalg.norm(q0[free] - q1[cur], axis=1)
                    j = int(np.argmin(dist))
                    if dist[j] < 1e-6:
                        nxt = int(free[j])
                if nxt is None:
                    if np.linalg.norm(q1[cur] - q0[s]) < 1e-6:
                        break
                    raise RuntimeError("MeshSectioner: a section ring does not close (gap %.3g mm)" %
                                       (float(np.min(np.linalg.norm(q0[free] - q1[cur], axis=1))) if free.size else float("nan")))
            ring.append(q0[nxt])
            used[nxt] = True
            cur = nxt
        else:
            raise RuntimeError("MeshSectioner: a section ring does not close")
        rings.append(np.array(ring))
    return rings


def _rings_to_polygons(rings: list[np.ndarray], min_area: float) -> list[Polygon]:
    outers, holes = [], []
    for r in rings:
        if len(r) < 3:
            continue
        x, y = r[:, 0], r[:, 1]
        area = 0.5 * float(np.dot(x, np.roll(y, -1)) - np.dot(y, np.roll(x, -1)))
        if abs(area) < min_area:
            continue
        (outers if area > 0 else holes).append((abs(area), r))
    outers.sort(key=lambda t: t[0])
    shells = [Polygon(r) for _, r in outers]
    inner = [[] for _ in shells]
    for _, h in holes:
        pt = Point(float(h[0, 0]), float(h[0, 1]))
        for k, shell in enumerate(shells):           # smallest containing outer
            if shell.contains(pt):
                inner[k].append(h)
                break
    polys = []
    for shell, hs in zip(shells, inner):
        poly = Polygon(shell.exterior.coords, [h for h in hs]) if hs else shell
        if not poly.is_valid:
            poly = poly.buffer(0.0)
        polys.append(poly)
    return polys


def one_piece(geom, z: float, what: str) -> Polygon:
    """The union of a sampled sweep is connected except for crumbs: at the
    phases where the plane only grazes the tooth's edge the section is a
    sliver that may not touch its neighbours (measured: a 0.004 mm^2 crumb
    beside a 12 mm^2 space, 40 positions).  The true envelope of the
    continuous motion is connected, so crumbs below 0.1 % of the main piece
    (and below 0.001 mm^2) are dropped -- and anything bigger is an error,
    not something to paper over with "keep the largest" (timing_belt.py
    20.2 records what that reflex cost)."""
    if geom.geom_type == "Polygon":
        return geom
    if geom.is_empty:
        return Polygon()
    pieces = sorted((g for g in geom.geoms if g.geom_type == "Polygon"), key=lambda g: g.area, reverse=True)
    if not pieces:
        return Polygon()
    main, stray = pieces[0], sum(g.area for g in pieces[1:])
    if stray > max(1e-3, 1e-3 * main.area):
        raise ValueError(f"hypoid: the {what} section at z={z:.2f} is in {len(pieces)} pieces "
                         f"(areas {[round(g.area, 4) for g in pieces]}) -- raise n_positions")
    return main


def tidy(section: Polygon, eps: float = 0.01) -> Polygon:
    """A 10-micron morphological close-then-open of the swept section, and
    its exterior ring only.  The union of thousands of tessellation
    triangles is a sound region with hairline blemishes: slits and holes
    where triangles from different phases nearly coincide, and spikes
    where one grazes the rim.  Measured at export quality: near-reversals
    of 160 deg in the profile at the rim ends, up to five holes per
    station, and a lofted tool OpenCASCADE calls invalid; after this, 30-
    80 deg at most, no holes, a valid tool.  Closing fills concave features
    smaller than eps and opening removes convex ones; the flanks (curvature
    radius millimetres) and the root fillet (tenths of a millimetre) are
    both far above eps and pass through unchanged, to O(eps^2/rho).  A hole
    in the space would be an island of pinion material inside its own
    tooth space -- impossible -- so the exterior ring is the space."""
    if section.is_empty:
        return section
    tidy = section.buffer(eps, join_style=1).buffer(-2.0 * eps, join_style=1).buffer(eps, join_style=1)
    if tidy.geom_type != "Polygon":
        tidy = max((g for g in tidy.geoms if g.geom_type == "Polygon"), key=lambda g: g.area)
    return Polygon(tidy.exterior)


def space_profile(section: Polygon, R: float):
    """Split a clipped station section into its generated profile (inside
    the disc, from one rim crossing to the other) and the two rim
    crossings; the rest of its boundary is the disc's own arc, in the air."""
    if section.is_empty or section.geom_type != "Polygon":
        raise ValueError("hypoid: a station section is empty or in pieces -- the gear does not reach this station")
    coords = list(section.exterior.coords)[:-1]
    on_rim = [math.hypot(x, y) >= R - 1e-4 for x, y in coords]
    if all(on_rim) or not any(on_rim):
        raise ValueError("hypoid: a station section does not cross the blank rim")
    n = len(coords)
    # Every off-rim stretch of the boundary, each with its two bounding rim
    # points; the profile is the LONGEST one.  The first version took the
    # first stretch it met, and a single tessellation vertex a few tenths
    # of a micron inside the rim circle made a spurious one-point "stretch"
    # -- a 4-point, 0-degree profile that the loft dutifully swept into a
    # tool the boolean then choked on (measured at 360 sweep positions).
    runs = []
    for start in (i for i in range(n) if on_rim[i] and not on_rim[(i + 1) % n]):
        run = [coords[start]]
        i = (start + 1) % n
        while not on_rim[i]:
            run.append(coords[i])
            i = (i + 1) % n
        run.append(coords[i])
        runs.append(run)
    lengths = [sum(math.dist(a, b) for a, b in zip(r[:-1], r[1:])) for r in runs]
    best = runs[lengths.index(max(lengths))]
    if len(best) < 4 or max(lengths) < 0.2:
        raise ValueError(f"hypoid: the station section's generated profile is degenerate "
                         f"({len(best)} points, {max(lengths):.3f} mm) -- the gear barely reaches this station")
    return best


def smooth_profile(run, sigma_mm: float = 0.03, step_mm: float = 0.005):
    """The generated profile with its facet noise taken out: densified to
    step_mm by arc length and Gaussian-filtered with sigma_mm along it.
    The gear's own tooth flanks are lofts through polygon stations,
    faceted at the 0.02-0.03 mm level, and the swept union inherits
    micro-corners at that scale; a spline INTERPOLATED through 80 samples
    of such a boundary carries that noise into the pinion's flank as
    waviness of the same size (measured: 0.25 mm^3 of in-phase overlap
    from the export-quality gear against 0.003 from a smoother one).  A
    30-micron filter is three orders of magnitude below any flank
    curvature radius (it moves a 5 mm arc by sigma^2/2rho = 0.1 micron)
    and two above the facets.  The ends are held ('nearest' padding) and
    re-snapped to the rim by the caller."""
    from scipy.ndimage import gaussian_filter1d
    pts = np.array(run, dtype=float)
    seg = np.hypot(np.diff(pts[:, 0]), np.diff(pts[:, 1]))
    cum = np.concatenate([[0.0], np.cumsum(seg)])
    n = max(int(cum[-1] / step_mm), 16)
    t = np.linspace(0.0, cum[-1], n)
    dense = np.c_[np.interp(t, cum, pts[:, 0]), np.interp(t, cum, pts[:, 1])]
    s = sigma_mm / (cum[-1] / (n - 1))
    smooth = gaussian_filter1d(dense, sigma=s, axis=0, mode="nearest")
    smooth[0], smooth[-1] = dense[0], dense[-1]
    return [tuple(p) for p in smooth]


def space_wires(sections: list[Polygon], disc_radii: list[float], z_stations: list[float], n_profile: int) -> list[bd.Wire]:
    """Each station as two edges in the same order -- the generated profile
    (one spline, n_profile points by arc length, uniform parameters, as the
    face gear's station_wire explains) and the rim arc closing it outside
    the blank -- so the loft pairs them by index."""
    wires = []
    for section, R, z in zip(sections, disc_radii, z_stations):
        run = smooth_profile(space_profile(section, R))
        xs, ys = _resample(run, n_profile)
        a, b = (xs[0], ys[0]), (xs[-1], ys[-1])
        # both ends exactly on the rim circle, so the arc meets the spline
        ra, rb = math.atan2(a[1], a[0]), math.atan2(b[1], b[0])
        a = (R * math.cos(ra), R * math.sin(ra))
        b = (R * math.cos(rb), R * math.sin(rb))
        pts = [bd.Vector(a[0], a[1], z)] + [bd.Vector(x, y, z) for x, y in zip(xs[1:-1], ys[1:-1])] + [bd.Vector(b[0], b[1], z)]
        params = list(np.linspace(0.0, 1.0, len(pts)))
        # the rim arc from b back to a through the middle angle, the short way
        dm = (ra - rb + math.pi) % (2 * math.pi) - math.pi
        rm = rb + 0.5 * dm
        mid = bd.Vector(R * math.cos(rm), R * math.sin(rm), z)
        edges = [bd.Edge.make_spline(pts, parameters=params), bd.Edge.make_three_point_arc(pts[-1], mid, pts[0])]
        wires.append(bd.Wire(edges))
    return wires


def swept_station(solid, planes: list[bd.Plane], R: float, half_size: float, z: float,
                  tolerance: float = 0.005, fold_pitch_rad: float | None = None, fold_copies: int = 0,
                  wedge_half_angle_rad: float | None = None, rim_band_mm: float = 1.0,
                  max_rim_fraction: float = 0.97) -> Polygon:
    """One station of the generated member: the union over the phases of
    the generator's cross-sections (each plane the station plane pulled
    back into the generator's frame at that phase, its axes the member's
    own so the local coordinates are the member's), clipped to the disc of
    radius R about the station's axis point, made one piece and tidied.
    `solid` is an OpenCASCADE shape (sectioned exactly, then tessellated)
    or a MeshSectioner (tessellated once, sectioned in numpy)."""
    if isinstance(solid, MeshSectioner):
        tris = [poly for plane in planes for poly in solid.section_polygons(plane)]
    else:
        tris = [Polygon(tri) for plane in planes for tri in section_triangles(solid, plane, half_size, tolerance)]
    if not tris:
        return Polygon()
    swept = unary_union(tris)
    if fold_pitch_rad and fold_copies > 0:
        # A hob spanning several pitches of the member (a worm's 4-turn
        # thread) cuts several identical spaces per plane; each neighbour's
        # partial region, turned back by k pitches, is the target space at
        # another phase -- extra sweep samples at no sectioning cost.
        from shapely.affinity import rotate as _rotate
        swept = unary_union([_rotate(swept, math.degrees(k * fold_pitch_rad), origin=(0, 0))
                             for k in range(-fold_copies, fold_copies + 1)])
    disc = Point(0.0, 0.0).buffer(R, quad_segs=720)
    if wedge_half_angle_rad:
        # ... and the target is what lies within its own pitch wedge, whose
        # sides pass through the centres of the two adjacent teeth -- never
        # touched by the sweep -- so the clip removes only the neighbours.
        # The teeth are helical, so at this station the space's centre is
        # not at angle 0 but where the sweep puts it: the wedge is centred
        # on the space's own mid-angle over the outermost rim_band_mm (a
        # tooth land can be a few tenths of a degree, the helical shift a
        # degree -- a wedge fixed at 0 cut into the neighbour). A space
        # wider than max_rim_fraction of the pitch at the rim means the
        # teeth have run pointed: refused, with the reason.
        inside = swept.intersection(disc)
        pieces = [g for g in getattr(inside, "geoms", [inside]) if not g.is_empty]
        if not pieces:
            return Polygon()
        central = min(pieces, key=lambda g: abs(math.atan2(g.centroid.y, g.centroid.x)))
        xs, ys = np.array(central.exterior.coords).T
        band = np.arctan2(ys, xs)[np.hypot(xs, ys) > R - rim_band_mm]
        if band.size == 0:
            raise ValueError("generation: the swept space at z=%.2f does not reach the rim" % z)
        width = float(band.max() - band.min())
        if width > max_rim_fraction * 2.0 * wedge_half_angle_rad:
            raise ValueError("generation: at z=%.2f the space spans %.1f%% of the pitch at the rim -- the teeth have run "
                             "pointed there (a narrower face, or a smaller outside diameter)" % (z, 100.0 * width / (2.0 * wedge_half_angle_rad)))
        centre = 0.5 * float(band.max() + band.min())
        w, rr = wedge_half_angle_rad, 4.0 * R
        arc = [(rr * math.cos(a), rr * math.sin(a)) for a in np.linspace(centre - w, centre + w, 16)]
        swept = swept.intersection(Polygon([(0.0, 0.0)] + arc))
    return tidy(one_piece(swept.intersection(disc), z, "clipped"))


def space_tool(sections: list[Polygon], disc_radii: list[float], z_stations: list[float], n_profile: int = 80) -> bd.Solid:
    tool = loft_solid(space_wires(sections, disc_radii, z_stations, n_profile))
    if not tool.is_valid:
        raise RuntimeError("generation: the lofted space tool is not a valid solid")
    return tool


def cut_spaces(blank, tool: bd.Solid, n: int, axis: bd.Axis = bd.Axis.Z):
    """The blank minus n copies of the tool patterned about the axis: one
    N-ary cut, the same tools one after another should that come back as
    anything but one valid solid; edge curves slimmed for STEP."""
    tools = [tool.rotate(axis, k * 360.0 / n) for k in range(n)]
    result = None
    try:
        result = blank.cut(*tools)
        if not (len(result.solids()) == 1 and result.is_valid):
            result = None
    except ValueError:
        result = None
    if result is None:
        result = blank
        for t in tools:
            result = result.cut(t)
    slim_edge_curves(result)
    return result
