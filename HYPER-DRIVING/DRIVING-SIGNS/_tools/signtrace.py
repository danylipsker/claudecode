"""Trace a small raster road sign into a flat-colour SVG.

Pipeline (per image)
  1. palette    - colours of the flat areas, plus the extreme colours of thin features
  2. unmixing   - every pixel is explained as one palette colour or a blend of two that
                  are present nearby, so anti-aliased edges carry sub-pixel coverage and
                  never turn into a fringe of a third colour
  3. background - white around the sign becomes transparent (find_background has the rules)
  4. layers    - colours are stacked largest first; each layer also runs under the layers
                  above it, so neighbouring colours share one traced boundary (no gaps)
  5. tracing    - each layer mask is cut from the (upsampled) coverage and outlined with
                  smooth curves (smoothtrace.py)
"""
import numpy as np
from PIL import Image, ImageDraw
from scipy.spatial import ConvexHull, QhullError
from scipy import ndimage as ndi
import smoothtrace

# All colour arithmetic runs in a luma/chroma space (Y, c*Cb, c*Cr): a blend of two colours
# stays on the straight segment between them, while JPEG chroma noise weighs less.
CHROMA = 0.6
_M = np.array([[0.299, 0.587, 0.114],
               [-0.1687 * CHROMA, -0.3313 * CHROMA, 0.5 * CHROMA],
               [0.5 * CHROMA, -0.4187 * CHROMA, -0.0813 * CHROMA]])
_MI = np.linalg.inv(_M)

T_FLAT = 9.0       # max channel difference to the 4 neighbours for a "flat" pixel
D_MERGE = 17.0     # distance under which two flat colours are one palette colour
T_CORE = 21.0      # distance under which a pixel counts as a pure palette colour
T_EXPL = 25.0      # residual under which a blend explains a pixel
T_RES = 30.0       # residual above which a pixel calls for a new palette colour
AA_SCALE = 3       # upsampling of anti-aliased artwork before tracing
AA_MIN = 0.45      # aa_score from which the artwork counts as anti-aliased
R_NEAR = 2         # radius (px) in which a colour must be present to take part in a blend


def _mdist(a, b):
    """Distance used to decide that two colours are the same paint: chroma counts less,
    because JPEG ringing beside dark strokes shifts it on otherwise flat areas."""
    d = a - b
    return float(np.sqrt(d[0] ** 2 + (0.45 * d[1]) ** 2 + (0.45 * d[2]) ** 2))


def to_t(rgb):
    return rgb @ _M.T


def to_rgb(t):
    return np.clip(t @ _MI.T, 0, 255)


def _flat_mask(rgb):
    h, w, _ = rgb.shape
    d = np.zeros((h, w))
    for ax in (0, 1):
        df = np.abs(np.diff(rgb, axis=ax)).max(axis=2)
        pad = [(0, 0), (0, 0)]
        pad[ax] = (0, 1)
        a = np.pad(df, pad)
        pad[ax] = (1, 0)
        b = np.pad(df, pad)
        d = np.maximum(d, np.maximum(a, b))
    return d < T_FLAT


def _cluster(pix, min_count):
    """Greedy clustering of colours: most populated bins first."""
    if len(pix) == 0:
        return []
    q = ((pix + 128) // 6).astype(np.int32)
    key = q[:, 0] * 4096 + q[:, 1] * 64 + q[:, 2]
    uk, inv, cnt = np.unique(key, return_inverse=True, return_counts=True)
    sums = np.zeros((len(uk), 3))
    np.add.at(sums, inv, pix)
    means = sums / cnt[:, None]
    order = np.argsort(-cnt)
    cl = []  # [sum, count]
    for i in order:
        m = means[i]
        best, bd = None, 1e9
        for j, (s, c) in enumerate(cl):
            dd = _mdist(s / c, m)
            if dd < bd:
                best, bd = j, dd
        if best is not None and bd < D_MERGE:
            cl[best][0] += sums[i]
            cl[best][1] += cnt[i]
        else:
            cl.append([sums[i].copy(), int(cnt[i])])
    return [(s / c, c) for s, c in cl if c >= min_count]


def _pairs(K):
    return [(a, b) for a in range(K) for b in range(a + 1, K)]


def _residuals(pix, pal):
    """Distance of every pixel to every palette colour and to every two-colour blend."""
    K = len(pal)
    d1 = np.linalg.norm(pix[:, None, :] - pal[None, :, :], axis=2)  # N,K
    prs = _pairs(K)
    if not prs:
        return d1, prs, np.zeros((len(pix), 0)), np.zeros((len(pix), 0))
    r2 = np.empty((len(pix), len(prs)))
    t2 = np.empty((len(pix), len(prs)))
    for i, (a, b) in enumerate(prs):
        ab = pal[b] - pal[a]
        t = np.clip(((pix - pal[a]) @ ab) / (ab @ ab), 0, 1)
        r2[:, i] = np.linalg.norm(pix - (pal[a] + t[:, None] * ab), axis=1)
        t2[:, i] = t
    return d1, prs, r2, t2


def find_palette(rgb, valid):
    h, w, _ = rgb.shape
    n = int(valid.sum())
    flat = _flat_mask(rgb) & valid
    cl = _cluster(rgb[flat], max(4, int(0.0006 * n)))
    if not cl:
        cl = _cluster(rgb[valid], 1)[:1]
    pal = np.array([c for c, _ in cl])
    pix = rgb[valid]
    for _ in range(8):  # extreme colours of features too thin to have a flat area
        d1, prs, r2, _t = _residuals(pix, pal)
        e = d1.min(axis=1)
        if r2.shape[1]:
            e = np.minimum(e, r2.min(axis=1))
        bad = e > T_RES
        if bad.sum() < 3:
            break
        c0 = pix[np.argmax(e)]
        near = bad & (np.linalg.norm(pix - c0, axis=1) < T_EXPL)
        if near.sum() < 3:
            # isolated outlier: drop it from the residual and look again
            pix = pix[~near]
            continue
        pal = np.vstack([pal, np.median(pix[near], axis=0)])
    # final colour of each entry: median of its pure pixels
    d1 = np.linalg.norm(rgb[valid][:, None, :] - pal[None], axis=2)
    lab = d1.argmin(axis=1)
    out = []
    for k in range(len(pal)):
        m = (lab == k) & (d1[:, k] < T_CORE)
        out.append(np.median(rgb[valid][m], axis=0) if m.sum() >= 3 else pal[k])
    pal = np.array(out)
    # merge duplicates created by the refinement
    keep = []
    for k in range(len(pal)):
        if all(_mdist(pal[k], pal[j]) >= D_MERGE * 0.8 for j in keep):
            keep.append(k)
    return pal[keep]


def unmix(rgb, valid, pal):
    """Per pixel coverage of every palette colour (h, w, K), rows sum to 1."""
    h, w, _ = rgb.shape
    K = len(pal)
    alpha = np.zeros((h, w, K))
    if K == 1:
        alpha[..., 0] = 1
        return alpha
    pix = rgb.reshape(-1, 3)
    d1, prs, r2, t2 = _residuals(pix, pal)
    k1 = d1.argmin(axis=1)
    dmin = d1.min(axis=1)
    close = (d1 < T_CORE).reshape(h, w, K) & valid[..., None]
    near = np.zeros((h, w, K), bool)
    st = ndi.generate_binary_structure(2, 2)
    for k in range(K):
        thick = ndi.binary_opening(close[..., k], structure=np.ones((2, 2)))
        near[..., k] = ndi.binary_dilation(thick, structure=st, iterations=R_NEAR)
    near = near.reshape(-1, K)
    N = len(pix)
    idx = np.arange(N)
    # 1. pure colour with a solid area of that colour nearby
    pure = (dmin < T_CORE) & near[idx, k1]
    # 2. blend of two colours that are both present nearby
    ok = np.stack([near[:, a] & near[:, b] for a, b in prs], axis=1)
    r2c = np.where(ok, r2, 1e9)
    p_loc = r2c.argmin(axis=1)
    loc_ok = r2c[idx, p_loc] < T_EXPL
    # 3. anything else: best of all colours and blends (thin features)
    p_any = r2.argmin(axis=1)
    single_better = dmin <= r2[idx, p_any] + 6.0
    a = alpha.reshape(-1, K)
    sel_pure = pure
    sel_loc = ~pure & loc_ok
    sel_single = ~pure & ~loc_ok & single_better
    sel_any = ~pure & ~loc_ok & ~single_better
    a[idx[sel_pure], k1[sel_pure]] = 1
    a[idx[sel_single], k1[sel_single]] = 1
    pa = np.array([p[0] for p in prs])
    pb = np.array([p[1] for p in prs])
    for sel, pi in ((sel_loc, p_loc), (sel_any, p_any)):
        i = idx[sel]
        t = t2[i, pi[sel]]
        np.add.at(a, (i, pa[pi[sel]]), 1 - t)
        np.add.at(a, (i, pb[pi[sel]]), t)
    return a.reshape(h, w, K)


S_HALO = 0.62      # absolute dark coverage under which an outline between two colours is a halo


def drop_halos(rgb, valid, pal, alpha, log=None):
    """Remove thin, weak fringes that sit between two contrasting colours.

    The chart artwork carries hairline dark outlines, sharpening halos and JPEG ringing
    along colour edges. A thin run of colour D between colours A and B is dropped when its
    coverage is weak; its pixels are then shared between A and B. Thin lines with the same
    colour on both sides (strokes, dashes, outlines on white) are left alone.
    """
    h, w, K = alpha.shape
    if K < 3:
        return alpha
    st8 = np.ones((3, 3), bool)
    for _pass in range(2):
        hard = alpha.argmax(axis=2)
        solid = alpha.max(axis=2) > 0.6
        changed = False
        for k in range(K):
            ak = alpha[..., k]
            region = (ak > 0.08) & valid
            if not region.any():
                continue
            core = ndi.binary_opening(ak > 0.75, structure=np.ones((3, 3)))
            thin = region & ~ndi.binary_dilation(core, structure=st8, iterations=2)
            lab, n = ndi.label(thin, structure=st8)
            if n == 0:
                continue
            objs = ndi.find_objects(lab)
            for ci in range(1, n + 1):
                sl = objs[ci - 1]
                y0, y1 = max(sl[0].start - 2, 0), min(sl[0].stop + 2, h)
                x0, x1 = max(sl[1].start - 2, 0), min(sl[1].stop + 2, w)
                C = lab[y0:y1, x0:x1] == ci
                ring = (ndi.binary_dilation(C, structure=st8, iterations=2) & ~region[y0:y1, x0:x1]
                        & solid[y0:y1, x0:x1] & valid[y0:y1, x0:x1])
                rl = hard[y0:y1, x0:x1][ring]
                rl = rl[rl != k]
                if len(rl) < 2:
                    continue
                cnt = np.bincount(rl, minlength=K).astype(float)
                top = np.argsort(-cnt)[:2]
                A, B = int(top[0]), int(top[1])
                if cnt[B] < 0.2 * cnt.sum() or cnt[B] < 2:
                    continue
                if np.linalg.norm(pal[A] - pal[B]) < 50:
                    continue
                M = np.stack([pal[A], pal[B]], axis=1)  # 3x2
                sol, *_ = np.linalg.lstsq(M, pal[k], rcond=None)
                sol = np.clip(sol, 0, None)
                if sol.sum() > 1:
                    sol = sol / sol.sum()
                res = np.linalg.norm(M @ sol - pal[k])
                kap = 1 - sol.sum()
                vals = ak[y0:y1, x0:x1][C]
                vals = vals[vals > 0.25]
                s = float(np.percentile(vals, 75)) if len(vals) else 0.0
                if res <= T_EXPL:
                    # a darkened blend of its neighbours: what counts is the dark coverage
                    s *= kap if kap > 0.15 else 0.0
                if log is not None:
                    log.append((k, A, B, int(C.sum()), round(float(kap), 2), round(s, 2)))
                if s >= S_HALO:
                    continue
                # share the pixels of the fringe between A and B
                Cd = ndi.binary_dilation(C, structure=st8) & (ak[y0:y1, x0:x1] > 0) & ~core[y0:y1, x0:x1]
                pix = rgb[y0:y1, x0:x1][Cd]
                ab = pal[B] - pal[A]
                t = np.clip(((pix - pal[A]) @ ab) / (ab @ ab), 0, 1)
                sub = alpha[y0:y1, x0:x1]
                moved = sub[Cd][:, k]
                rows = sub[Cd]
                rows[:, k] = 0
                rows[:, A] += moved * (1 - t)
                rows[:, B] += moved * t
                sub[Cd] = rows
                changed = True
        if not changed:
            break
    return alpha


def _is_white(c):
    return c.min() >= 238


def _hull_mask(comp):
    """Filled convex hull of a boolean shape."""
    ys, xs = np.nonzero(comp)
    h, w = comp.shape
    if len(xs) < 3:
        return comp.copy()
    # corners of the pixels, so that the hull covers them whole
    pts = np.unique(np.concatenate([np.stack([xs + dx, ys + dy], axis=1)
                                    for dx in (0, 1) for dy in (0, 1)]), axis=0)
    try:
        hull = ConvexHull(pts)
    except QhullError:
        return comp.copy()
    poly = [tuple(v) for v in pts[hull.vertices].astype(float)]
    im = Image.new("L", (w * 2, h * 2), 0)
    ImageDraw.Draw(im).polygon([(x * 2 - 0.5, y * 2 - 0.5) for x, y in poly], fill=255)
    return np.asarray(im.resize((w, h), Image.BOX)) >= 128


def find_background(hard, pal, valid, keep_white=False, info=None, alpha=None, hull=True):
    """Pixels of the transparent background: outside the image alpha, or white reaching the border.

    White is only made transparent when what remains is a clean silhouette: a few solid
    shapes. Stripes, lamps or fragments of a hairline outline standing free on the white
    mean the white belongs to the sign, and then it stays opaque over the whole image.
    """
    h, w = hard.shape
    bg = ~valid
    whites = [k for k in range(len(pal)) if _is_white(pal[k])]
    if info is not None:
        info["background"] = "white" if whites else "none"
    if not whites or keep_white:
        return bg
    wm = np.isin(hard, whites) & valid
    # a picture of a road has no background: white that reaches its border is a marking
    border = np.concatenate([wm[0], wm[-1], wm[1:-1, 0], wm[1:-1, -1]])
    inside = np.concatenate([valid[0], valid[-1], valid[1:-1, 0], valid[1:-1, -1]])
    if inside.any() and border.sum() < 0.5 * inside.sum():
        return bg
    # a faint hairline is still a border of the sign: the flood runs through clean white only
    pure = wm if alpha is None else wm & (alpha[..., whites].sum(axis=2) >= 0.85)
    # flood from the border through white wider than 2 px, so a hairline gap in a
    # sign's border cannot leak the background into the sign
    er = ndi.binary_erosion(pure | ~valid, structure=np.ones((3, 3)), border_value=1)
    lab, _ = ndi.label(er, structure=np.ones((3, 3)))
    edge = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    edge = edge[edge > 0]
    reach = np.isin(lab, edge)
    if not reach.any():
        return bg
    grown = ndi.binary_dilation(reach, structure=np.ones((3, 3)), iterations=2, mask=wm | ~valid)
    # a margin too thin for the flood, between the border of the image and the sign
    rim = np.zeros((h, w), bool)
    rim[0, :] = rim[-1, :] = rim[:, 0] = rim[:, -1] = True
    band = ndi.binary_dilation(rim, structure=np.ones((3, 3)), iterations=2)
    grown |= ndi.binary_dilation(rim & wm, structure=np.ones((3, 3)), iterations=2, mask=wm & band)
    cand = bg | (grown & wm)
    sil = ~cand
    lab, n = ndi.label(sil, structure=np.ones((3, 3)))
    if n == 0:
        return bg
    sizes = ndi.sum(sil, lab, index=np.arange(1, n + 1))
    # crumbs of off-white inside the background are background
    nonwhite = ndi.sum(sil & ~wm, lab, index=np.arange(1, n + 1))
    crumbs = np.flatnonzero((sizes < 8) & (nonwhite == 0)) + 1
    if len(crumbs):
        cand |= np.isin(lab, crumbs)
        sil = ~cand
        lab, n = ndi.label(sil, structure=np.ones((3, 3)))
        if n == 0:
            return bg
        sizes = ndi.sum(sil, lab, index=np.arange(1, n + 1))
    if hull:
        # white inside the outline of a shape belongs to it, even where it reaches the
        # border of the picture: the stop line of a road, the stripes of a board
        inside = np.zeros((h, w), bool)
        for i in range(n):
            if sizes[i] >= 0.06 * h * w:
                inside |= _hull_mask(lab == i + 1)
        take = cand & wm & inside
        if take.any():
            cand &= ~take
            sil = ~cand
            lab, n = ndi.label(sil, structure=np.ones((3, 3)))
            sizes = ndi.sum(sil, lab, index=np.arange(1, n + 1))
    specks = int((sizes < 8).sum())
    big = [i + 1 for i in range(n) if sizes[i] >= 8]
    core = ndi.binary_erosion(sil, structure=np.ones((3, 3)), iterations=2)
    solid = all(sizes[i - 1] >= 0.06 * h * w and core[lab == i].any() for i in big)
    hair = sil & ~ndi.binary_opening(sil, structure=np.ones((3, 3)))
    ok = bool(big) and len(big) <= 4 and specks <= 2 and solid and hair.sum() < max(20, 0.003 * h * w)
    if info is not None:
        info["background"] = "transparent" if ok else "white"
    if not ok:
        return bg
    # the off-white fringe of an edge, left between the background and the shape, is background
    rest = wm & ~cand
    thin = rest & ~ndi.binary_opening(rest, structure=np.ones((3, 3)))
    if thin.any():
        lab, n = ndi.label(thin, structure=np.ones((3, 3)))
        touch = np.unique(lab[ndi.binary_dilation(cand, structure=np.ones((3, 3))) & thin])
        cand = cand | np.isin(lab, touch[touch > 0])
    return cand


def _snap(c):
    c = np.round(c).astype(int)
    if c.min() >= 243:
        c[:] = 255
    if c.max() <= 12:
        c[:] = 0
    c = np.where(c >= 250, 255, c)
    c = np.where(c <= 5, 0, c)
    return tuple(int(v) for v in c)


def _hex(c):
    r, g, b = c
    s = "#%02x%02x%02x" % (r, g, b)
    if s[1] == s[2] and s[3] == s[4] and s[5] == s[6]:
        s = "#" + s[1] + s[3] + s[5]
    return s


def _fmt(v):
    s = "%.2f" % v
    s = s.rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


def _upsample(a, S, sharpen, blur=0.0):
    if S == 1:
        # hard-edged artwork: no resampling; the unsharp mask only lifts thin, faint strokes
        if sharpen > 0:
            ap = np.pad(a, 3, mode="edge")
            ap = ap + sharpen * (ap - ndi.gaussian_filter(ap, 0.9))
            return ap[3:-3, 3:-3]
        return a
    h, w = a.shape
    pad = 2
    ap = np.pad(a, pad, mode="edge")
    im = Image.fromarray(ap.astype(np.float32), mode="F")
    up = np.asarray(im.resize((ap.shape[1] * S, ap.shape[0] * S), Image.BICUBIC), dtype=np.float64)
    if blur > 0:
        up = ndi.gaussian_filter(up, blur * S)
    if sharpen > 0:
        bl = ndi.gaussian_filter(up, 0.9 * S)
        up = up + sharpen * (up - bl)
    return up[pad * S:(pad + h) * S, pad * S:(pad + w) * S]


BAND_HARD = 0.55   # px the outline may leave the pixel boundary: hard-edged artwork
BAND_SOFT = 0.35   # the same for anti-aliased artwork
P_MIN = 0.3        # peak coverage from which a faint stroke is drawn
P_LOW = 0.15       # once a stroke is drawn, it runs on while its coverage stays above this
S_KEEP = 0.26      # a faint stroke is drawn when this much coverage is common along it


def _cut(p, floor):
    p = np.clip(p, floor, 1.0)
    return np.minimum(0.5, p * np.exp(-0.69 * p * p))


def _threshold(up, S, dots=False):
    """Mask of a coverage field.

    A solid shape is cut at half coverage. A stroke that never reaches full coverage
    (thinner than a pixel) is cut nearer to its own peak, which keeps it about as heavy as
    it looks in the raster. Such a stroke is drawn whole or not at all: one that is
    strong over most of its length runs through its weak spots, one that only shows here
    and there is dropped instead of leaving crumbs. dots: the drawing has a dotted line,
    every speck is kept.
    """
    r = max(1, int(round(1.5 * S)))
    p = ndi.maximum_filter(up, size=2 * r + 1)
    mask = up > _cut(p, P_MIN)
    faint = (up > 0.8 * P_LOW) & (p < 0.75)
    if faint.any():
        lab, n = ndi.label(faint, structure=np.ones((3, 3)))
        low = up > _cut(p, P_LOW)
        kept = np.zeros(up.shape, bool)
        for ci, sl in enumerate(ndi.find_objects(lab), 1):
            comp = lab[sl] == ci
            vals = up[sl][comp]
            sub = mask[sl]
            if dots:
                keep = vals.max() >= 0.2
            else:
                keep = np.percentile(vals, 85) >= S_KEEP and comp.sum() >= 2.5 * S * S
            if keep:
                sub[comp] = low[sl][comp]
                kept[sl] |= comp & sub
            else:
                sub[comp] = False
        if S > 1 and kept.any():
            # a hairline one sample wide breaks into pieces when it is outlined
            mask |= ndi.binary_dilation(kept, structure=np.ones((2, 2)))
    return mask


def aa_score(alpha):
    """Share of the diagonal-edge pixels that carry partial coverage (anti-aliased artwork).

    Only pixels whose colour changes both horizontally and vertically are looked at: on a
    hard-edged image these staircase corners are pure, on an anti-aliased one they are blends.
    """
    top = alpha.max(axis=2)
    hard = alpha.argmax(axis=2)
    dh = np.zeros(hard.shape, bool)
    dv = np.zeros(hard.shape, bool)
    dh[:, 1:] |= hard[:, 1:] != hard[:, :-1]
    dh[:, :-1] |= hard[:, 1:] != hard[:, :-1]
    dv[1:, :] |= hard[1:, :] != hard[:-1, :]
    dv[:-1, :] |= hard[1:, :] != hard[:-1, :]
    diag = dh & dv
    if diag.sum() < 8:
        return 0.0
    return float(((top < 0.85) & diag).sum() / diag.sum())


def trace_image(im, keep_white=False, S=None, sharpen=0.8, blur=0.7, info=None, sx=1.0, sy=1.0, hull=True,
                dots=False):
    """PIL image -> ([(fill, path data)], width px, height px); sx, sy scale the coordinates."""
    im = im.convert("RGBA")
    arr = np.asarray(im).astype(np.float64)
    rgb = to_t(arr[..., :3])
    valid = arr[..., 3] >= 128
    h, w = valid.shape
    pal = find_palette(rgb, valid)
    pal_rgb = to_rgb(pal)
    alpha = unmix(rgb, valid, pal)
    alpha[~valid] = 0
    hlog = []
    alpha = drop_halos(rgb, valid, pal, alpha, hlog)
    hard = alpha.argmax(axis=2)
    score = aa_score(alpha)
    if S is None:
        S = AA_SCALE if score >= AA_MIN or dots else 1
    bg = find_background(hard, pal_rgb, valid, keep_white, info, alpha, hull)
    K = len(pal)
    # split every colour's coverage between "background" and "sign" by the nearer of the two
    alpha_bg = np.zeros((h, w))
    whites = [k for k in range(K) if _is_white(pal_rgb[k])]
    if bg.any():
        d_bg = ndi.distance_transform_edt(~bg)
        for k in whites:
            solid = (hard == k) & ~bg & valid
            d_in = ndi.distance_transform_edt(~solid) if solid.any() else np.full((h, w), 1e9)
            take = d_bg <= d_in
            alpha_bg += np.where(take, alpha[..., k], 0)
            alpha[..., k] = np.where(take, 0, alpha[..., k])
        alpha_bg[~valid] = 1
    # stack order: largest area first
    area = np.array([alpha[..., k].sum() for k in range(K)])
    order = [int(k) for k in np.argsort(-area) if area[k] >= 0.75]
    # soft union masks, bottom to top
    soft = []
    rest = 1.0 - alpha_bg
    acc = np.zeros((h, w))
    for k in order:
        soft.append(rest - acc)
        acc = acc + alpha[..., k]
    U = [_upsample(s, S, sharpen, blur) for s in soft]
    H = [_threshold(u, S, dots) for u in U]
    for i in range(len(H) - 2, -1, -1):
        # a faint stroke made of the colours above this one is theirs to draw or to drop
        theirs = (U[i] < 0.5) & (U[i] - U[i + 1] < 0.5 * U[i])
        H[i] = (H[i] & ~theirs) | H[i + 1]
    eps = max(1.0, 0.75 * S)
    # hard-edged artwork is known to half a pixel, anti-aliased artwork much better
    band = BAND_HARD if S == 1 else BAND_SOFT
    turd = 0 if dots else 1 if S == 1 else int(round(1.1 * S * S))
    paths = []
    for i, k in enumerate(order):
        M = H[i]
        if i + 1 < len(H) and H[i + 1].any():
            d_out = ndi.distance_transform_edt(M)  # distance to the outside of this layer
            M = M & ~(H[i + 1] & (d_out <= eps))
            own = H[i] & ~H[i + 1]
            if not own.any():
                continue
        d = smoothtrace.trace(M, scale=S, turd=turd, band=band, fmt=_fmt, sx=sx, sy=sy,
                              outliers=0.0 if S == 1 else 0.15)
        if d:
            paths.append((_hex(_snap(pal_rgb[k])), d))
    if info is not None:
        info.update(dict(colors=list(dict.fromkeys(p[0] for p in paths)), aa=round(score, 3), scale=S,
                         w=w, h=h, halos=len(hlog)))
    return paths, w, h


def svg_document(paths, w, h, title=None, desc=None):
    """w, h: size of the drawing in the units of the path coordinates."""
    out = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %s %s" width="%s" height="%s">'
           % (_fmt(w), _fmt(h), _fmt(w), _fmt(h))]
    if title:
        out.append("<title>%s</title>" % _esc(title))
    if desc:
        out.append("<desc>%s</desc>" % _esc(desc))
    for fill, d in paths:
        out.append('<path fill="%s" fill-rule="evenodd" d="%s"/>' % (fill, d))
    out.append("</svg>")
    return "\n".join(out) + "\n"


def _esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
