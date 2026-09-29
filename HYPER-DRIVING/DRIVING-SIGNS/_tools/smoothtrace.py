"""Outline of a bitmap mask as smooth curves.

The boundary loops of the mask come from the path finder of potrace. Corners are found
where two straight runs of the boundary meet at an angle, and pinned at the intersection
of the two runs. Between corners every loop is smoothed by local regression: each point of
the pixel boundary is replaced by the value of a low-order polynomial fitted to its
neighbours, over the widest window whose fit still stays inside the pixel staircase (half
a pixel across the edge). That straightens staircases of any slope and keeps arcs round
without shrinking them, so a frame or a stroke keeps an even thickness. The result is
fitted with cubic Beziers (Schneider's algorithm).
"""
import numpy as np
import potrace.potrace as pp

# corner search: (samples on each side, least angle in degrees, largest deviation from a line)
CORNER_SCALES = ((7, 38.0, 0.6), (4, 50.0, 0.5))
WINDOWS = (48, 34, 24, 17, 12, 9, 7, 5, 4, 3, 2, 1)


_SG = {}


def _sg(m):
    """Least-squares polynomial through 2m+1 equally spaced samples: rows give c0, c1, c2."""
    if m not in _SG:
        x = np.arange(-m, m + 1, dtype=float)
        order = 2 if m >= 3 else 1
        A = np.vander(x, order + 1, increasing=True)
        P = np.linalg.pinv(A)
        if order == 1:
            P = np.vstack([P, np.zeros(2 * m + 1)])
        _SG[m] = (P, x)
    return _SG[m]


def _line_fits(Q, k):
    """Total least squares line through every window of k consecutive points of the loop Q.

    Returns for the window starting at i: centre, direction (along the path), largest deviation.
    """
    ext = np.vstack([Q, Q[:k - 1]])
    win = np.lib.stride_tricks.sliding_window_view(ext, k, axis=0).transpose(0, 2, 1)  # n, k, 2
    c = win.mean(axis=1)
    d = win - c[:, None, :]
    sxx = (d[..., 0] ** 2).sum(axis=1)
    syy = (d[..., 1] ** 2).sum(axis=1)
    sxy = (d[..., 0] * d[..., 1]).sum(axis=1)
    ang = 0.5 * np.arctan2(2 * sxy, sxx - syy)
    u = np.stack([np.cos(ang), np.sin(ang)], axis=1)
    flip = ((win[:, -1] - win[:, 0]) * u).sum(axis=1) < 0
    u[flip] *= -1
    dev = np.abs(d[..., 0] * -u[:, None, 1] + d[..., 1] * u[:, None, 0]).max(axis=1)
    return c, u, dev


def find_corners(P, Q, scale=1):
    """Corners of a closed boundary: {index of the lattice point: pinned position}.

    P: lattice points of the loop, Q[i]: middle of the boundary edge from P[i] to P[i+1].
    """
    n = len(P)
    pins = {}
    score = np.zeros(n)
    where = np.zeros((n, 2))
    turn = np.zeros(n)  # signed angle of the corner
    for k0, amin, dmax in CORNER_SCALES:
        k = k0 * scale
        if n < 2 * k + 2:
            continue
        c, u, dev = _line_fits(Q, k)
        i = np.arange(n)
        fb = (i - k) % n       # window of the k edges that end at lattice point i
        ff = i                 # window of the k edges that start at it
        cosang = np.clip((u[fb] * u[ff]).sum(axis=1), -1, 1)
        ang = np.degrees(np.arccos(cosang))
        ok = (ang >= amin) & (ang <= 165) & (dev[fb] <= dmax * scale) & (dev[ff] <= dmax * scale)
        ok &= score == 0
        # intersection of the two lines
        ub, uf, cb, cf = u[fb], u[ff], c[fb], c[ff]
        den = ub[:, 0] * uf[:, 1] - ub[:, 1] * uf[:, 0]
        den = np.where(np.abs(den) < 1e-9, 1e-9, den)
        t = ((cf[:, 0] - cb[:, 0]) * uf[:, 1] - (cf[:, 1] - cb[:, 1]) * uf[:, 0]) / den
        X = cb + ub * t[:, None]
        ok &= np.abs(X - P).max(axis=1) <= 0.8 * scale
        side = np.sign(u[fb][:, 0] * u[ff][:, 1] - u[fb][:, 1] * u[ff][:, 0])
        turn = np.where(ok, ang * side, turn)
        score = np.where(ok, ang - 40 * (dev[fb] + dev[ff]) / scale, score)
        where = np.where(ok[:, None], X, where)
    cand = np.flatnonzero(score > 0)
    if len(cand) == 0:
        return pins
    # keep the best candidate of every run of neighbours
    r = 3 * scale
    for j in cand[np.argsort(-score[cand])]:
        if any(min((j - q) % n, (q - j) % n) <= r for q in pins):
            continue
        pins[int(j)] = where[j]
    # two shallow corners close together that turn the same way are a small arc, not a chamfer
    keys = sorted(pins)
    drop = set()
    for a, b in zip(keys, keys[1:] + keys[:1]):
        gap = (b - a) % n
        if a == b or gap > 12 * scale:
            continue
        if turn[a] * turn[b] > 0 and abs(turn[a]) < 70 and abs(turn[b]) < 70:
            drop.update((a, b))
    for j in drop:
        del pins[j]
    return pins


def _smooth_span(Q, tol, closed, wmax, scale=1, outliers=0.0):
    """Q: n x 2 boundary points, tol: n x 2 allowed move per axis. Returns smoothed points.

    Every point gets the widest window whose fit stays within the tolerance of all the
    points it covers; the width then changes by one sample at most between neighbours, so
    the smoothed line has no jumps. The ends of an open span are corners: the span is
    continued beyond them by point reflection, which fits a straight run right up to its corner.
    outliers: share of the points of a window that may lie outside the tolerance.
    """
    n = len(Q)
    if n < 3:
        return Q.copy()
    pad = min(wmax, n // 2 - 1 if closed else n - 1)
    if pad < 1:
        return Q.copy()
    if closed:
        ext = np.vstack([Q[-pad:], Q, Q[:pad]])
        text = np.vstack([tol[-pad:], tol, tol[:pad]])
    else:
        ext = np.vstack([2 * Q[0] - Q[pad:0:-1], Q, 2 * Q[-1] - Q[-2:-pad - 2:-1]])
        text = np.vstack([tol[pad:0:-1], tol, tol[-2:-pad - 2:-1]])
    idx = np.arange(n) + pad
    best = np.zeros(n, int)
    widths = sorted({w * scale for w in WINDOWS} | set(range(1, 3 * scale + 1)), reverse=True)
    for m in widths:
        if m > pad or (best > 0).all():
            continue
        P, x = _sg(m)
        rows = np.flatnonzero(best == 0)
        win = ext[idx[rows, None] + np.arange(-m, m + 1)]          # r, k, 2
        twin = text[idx[rows, None] + np.arange(-m, m + 1)]
        c = np.einsum("jk,rka->raj", P, win)                          # r, 2, 3
        fit = c[:, None, :, 0] + c[:, None, :, 1] * x[None, :, None] + c[:, None, :, 2] * (x * x)[None, :, None]
        miss = np.abs(fit - win) / (twin + 1e-9)
        if outliers > 0:
            # a noisy boundary: a few points may lie outside the band, none far outside
            far = (miss > 1).any(axis=2)
            ok = (far.mean(axis=1) <= outliers) & (miss.max(axis=(1, 2)) <= 2.5)
        else:
            ok = (miss <= 1).all(axis=(1, 2))
        best[rows[ok]] = m
    # neighbouring windows differ by one sample at most
    for _ in range(2):
        for i in range(1, n):
            if best[i] > best[i - 1] + 1:
                best[i] = best[i - 1] + 1
        if closed and best[0] > best[-1] + 1:
            best[0] = best[-1] + 1
        for i in range(n - 2, -1, -1):
            if best[i] > best[i + 1] + 1:
                best[i] = best[i + 1] + 1
        if closed and best[-1] > best[0] + 1:
            best[-1] = best[0] + 1
        if not closed:
            break
    out = Q.copy()
    for m in np.unique(best):
        if m < 1:
            continue
        P, x = _sg(int(m))
        rows = np.flatnonzero(best == m)
        win = ext[idx[rows, None] + np.arange(-m, m + 1)]
        out[rows] = np.einsum("k,rka->ra", P[0], win)
    if not closed:
        out[0], out[-1] = Q[0], Q[-1]
    return out


def _chord(pts):
    d = np.linalg.norm(np.diff(pts, axis=0), axis=1)
    u = np.concatenate([[0.0], np.cumsum(d)])
    return u / u[-1] if u[-1] > 0 else np.linspace(0, 1, len(pts))


def _bez(b, u):
    u = np.asarray(u)[:, None]
    v = 1 - u
    return v ** 3 * b[0] + 3 * v * v * u * b[1] + 3 * v * u * u * b[2] + u ** 3 * b[3]


def _gen(pts, u, t1, t2):
    p0, p3 = pts[0], pts[-1]
    v = 1 - u
    b1 = 3 * v * v * u
    b2 = 3 * v * u * u
    a1 = b1[:, None] * t1
    a2 = b2[:, None] * t2
    c00 = (a1 * a1).sum()
    c01 = (a1 * a2).sum()
    c11 = (a2 * a2).sum()
    tmp = pts - ((v ** 3 + b1)[:, None] * p0 + (b2 + u ** 3)[:, None] * p3)
    x0 = (a1 * tmp).sum()
    x1 = (a2 * tmp).sum()
    det = c00 * c11 - c01 * c01
    dist = np.linalg.norm(p3 - p0)
    if abs(det) > 1e-12:
        al = (x0 * c11 - x1 * c01) / det
        ar = (c00 * x1 - c01 * x0) / det
    else:
        al = ar = 0.0
    eps = 1e-6 * dist
    if al < eps or ar < eps or al > 0.75 * dist or ar > 0.75 * dist:
        al = ar = dist / 3.0
    return np.array([p0, p0 + t1 * al, p3 + t2 * ar, p3])


def _reparam(pts, b, u):
    d1 = 3 * (b[1:] - b[:-1])
    d2 = 2 * (d1[1:] - d1[:-1])
    uu = u[:, None]
    v = 1 - uu
    q = _bez(b, u)
    q1 = v * v * d1[0] + 2 * v * uu * d1[1] + uu * uu * d1[2]
    q2 = v * d2[0] + uu * d2[1]
    num = ((q - pts) * q1).sum(axis=1)
    den = (q1 * q1).sum(axis=1) + ((q - pts) * q2).sum(axis=1)
    step = np.where(np.abs(den) > 1e-12, num / np.where(den == 0, 1, den), 0)
    nu = np.clip(u - step, 0, 1)
    nu[0], nu[-1] = 0, 1
    return np.maximum.accumulate(nu)


def _fit(pts, t1, t2, tol, out, depth=0):
    n = len(pts)
    if n == 2:
        d = np.linalg.norm(pts[1] - pts[0]) / 3
        out.append(np.array([pts[0], pts[0] + t1 * d, pts[1] + t2 * d, pts[1]]))
        return
    u = _chord(pts)
    b = _gen(pts, u, t1, t2)
    e = ((_bez(b, u) - pts) ** 2).sum(axis=1)
    if e.max() > tol * tol and e.max() < 25 * tol * tol:
        for _ in range(4):
            u = _reparam(pts, b, u)
            b = _gen(pts, u, t1, t2)
            e = ((_bez(b, u) - pts) ** 2).sum(axis=1)
            if e.max() <= tol * tol:
                break
    if e.max() <= tol * tol or depth > 24:
        out.append(b)
        return
    s = int(np.clip(np.argmax(e), 1, n - 2))
    tc = pts[s - 1] - pts[s + 1]
    nrm = np.linalg.norm(tc)
    tc = tc / nrm if nrm > 0 else -t1
    _fit(pts[:s + 1], t1, tc, tol, out, depth + 1)
    _fit(pts[s:], -tc, t2, tol, out, depth + 1)


def _unit(v):
    n = np.linalg.norm(v)
    return v / n if n > 0 else np.array([1.0, 0.0])


def _span_to_segments(pts, tol, closed_smooth=False):
    """Cubic segments (or a straight line) through a span of smoothed points."""
    n = len(pts)
    a, b = pts[0], pts[-1]
    ab = b - a
    L = np.linalg.norm(ab)
    if not closed_smooth and L > 0:
        dist = np.abs(ab[0] * (pts[:, 1] - a[1]) - ab[1] * (pts[:, 0] - a[0])) / L
        if dist.max() <= 0.75 * tol:
            return [("L", b)]
    if closed_smooth:
        t1 = _unit(pts[1] - pts[-2])
        t2 = -t1
    else:
        k = min(3, n - 1)
        t1 = _unit(pts[k] - pts[0])
        t2 = _unit(pts[-1 - k] - pts[-1])
    out = []
    _fit(pts, t1, t2, tol, out)
    return [("C", s) for s in out]


def trace(mask, scale=1, turd=2, band=0.55, fit_tol=0.05, wmax=48, fmt=None, sx=1.0, sy=1.0, outliers=0.0):
    """Path data of a boolean mask sampled at `scale` samples per pixel.

    band: how far (in pixels) the outline may leave the boundary of the mask samples;
    fit_tol: accuracy (pixels) of the Bezier fit; wmax: widest smoothing window (pixels).
    """
    h, w = mask.shape
    bm = np.pad(mask.astype(bool), [(0, 1), (0, 1)])
    plist = pp.bm_to_pathlist(bm, turdsize=turd, turnpolicy=pp.POTRACE_TURNPOLICY_MINORITY)
    if not plist:
        return ""
    bt = band * scale
    ft = fit_tol * scale
    kx, ky = sx / scale, sy / scale
    fmt = fmt or (lambda v: ("%.2f" % v).rstrip("0").rstrip(".") or "0")

    def pt(p):
        return "%s %s" % (fmt(p[0] * kx), fmt(p[1] * ky))

    parts = []
    for path in plist:
        P = np.array([(q.x, q.y) for q in path.pt], float)
        n = len(P)
        nxt = np.roll(P, -1, axis=0)
        Q = (P + nxt) / 2
        horiz = np.abs(nxt[:, 0] - P[:, 0]) > 0.5
        tol = np.where(horiz[:, None], [0.5, bt], [bt, 0.5]).astype(float)
        # an edge of the mask that lies on the border of the image stays on it
        on_h = horiz & ((Q[:, 1] <= 0) | (Q[:, 1] >= h))
        on_v = ~horiz & ((Q[:, 0] <= 0) | (Q[:, 0] >= w))
        tol[on_h, 1] = 0
        tol[on_v, 0] = 0
        pins = find_corners(P, Q, scale)
        for j in pins:
            pins[j] = np.clip(pins[j], [0, 0], [w, h])
        if not pins:
            X = _smooth_span(Q, tol, True, wmax * scale, scale, outliers)
            X = np.clip(X, [0, 0], [w, h])
            loop = np.vstack([X, X[:1]])
            segl = _span_to_segments(loop, ft, closed_smooth=True)
            parts.append("M" + pt(loop[0]))
            for kind, s in segl:
                parts.append("C%s %s %s" % (pt(s[1]), pt(s[2]), pt(s[3])) if kind == "C" else "L" + pt(s))
            parts.append("Z")
            continue
        keys = sorted(pins)
        parts.append("M" + pt(pins[keys[0]]))
        for a_i, j0 in enumerate(keys):
            j1 = keys[(a_i + 1) % len(keys)]
            # crack midpoints between lattice point j0 and lattice point j1
            idx = np.arange(j0, j1 if j1 > j0 else j1 + n) % n
            span_q = np.vstack([pins[j0][None], Q[idx], pins[j1][None]])
            span_t = np.vstack([np.full((1, 2), 0.35 * scale), tol[idx], np.full((1, 2), 0.35 * scale)])
            X = _smooth_span(span_q, span_t, False, wmax * scale, scale, outliers)
            X = np.clip(X, [0, 0], [w, h])
            for kind, s in _span_to_segments(X, ft):
                parts.append("C%s %s %s" % (pt(s[1]), pt(s[2]), pt(s[3])) if kind == "C" else "L" + pt(s))
        parts.append("Z")
    return "".join(parts)
