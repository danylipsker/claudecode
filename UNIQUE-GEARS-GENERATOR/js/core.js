/* core.js — polar geometry primitives and the shape library.
 *
 * Everything in this app speaks one language: a closed curve is an array of
 * radii sampled at N equal angles about the rotation centre,
 *      r[i]  at  theta = i * TAU / N.
 * That representation is what makes the conjugate construction cheap, and it
 * is exactly the "r as a function of theta" that the derivation assumes.
 * The price is that every shape must be star-shaped about its own axle —
 * which is also the physical requirement for a shape to work as a gear body.
 */
'use strict';

const TAU = Math.PI * 2;
const DEG = 180 / Math.PI;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const wrap = (a) => { a %= TAU; return a < 0 ? a + TAU : a; };
/* shortest signed difference b - a, in (-pi, pi] */
const angDiff = (a, b) => { let d = (b - a) % TAU; if (d > Math.PI) d -= TAU; if (d <= -Math.PI) d += TAU; return d; };

/* ── polar array helpers ─────────────────────────────────────────────── */

/** Radius at an arbitrary angle, linearly interpolated, wrapping. */
function rAt(r, th) {
  const N = r.length;
  let x = wrap(th) / TAU * N;
  const i = Math.floor(x), f = x - i;
  return r[i % N] * (1 - f) + r[(i + 1) % N] * f;
}

function rMax(r) { let m = -Infinity; for (let i = 0; i < r.length; i++) if (r[i] > m) m = r[i]; return m; }
function rMin(r) { let m = Infinity; for (let i = 0; i < r.length; i++) if (r[i] < m) m = r[i]; return m; }

/** Cartesian point of sample i. */
function ptOf(r, i) {
  const th = i * TAU / r.length;
  return [r[i] * Math.cos(th), r[i] * Math.sin(th)];
}

/** Circular box blur, run twice so the kernel is triangular (C1 corners). */
function smoothPolar(r, amount) {
  if (amount <= 0) return r;
  const N = r.length;
  const w = Math.max(1, Math.round(amount * N / 10));
  let src = r;
  for (let pass = 0; pass < 2; pass++) {
    const out = new Float64Array(N);
    /* running sum over a window of 2w+1 */
    let sum = 0;
    for (let k = -w; k <= w; k++) sum += src[((k % N) + N) % N];
    const inv = 1 / (2 * w + 1);
    for (let i = 0; i < N; i++) {
      out[i] = sum * inv;
      sum += src[(i + w + 1) % N] - src[((i - w) % N + N) % N];
    }
    src = out;
  }
  return src;
}

/** Turn the curve by delta: the feature that was at angle 0 lands at delta. */
function rotatePolar(r, delta) {
  const N = r.length, out = new Float64Array(N);
  for (let i = 0; i < N; i++) out[i] = rAt(r, i * TAU / N - delta);
  return out;
}

/** d r / d theta by central differences (same length, wrapping). */
function dPolar(r) {
  const N = r.length, d = new Float64Array(N), h = TAU / N;
  for (let i = 0; i < N; i++) d[i] = (r[(i + 1) % N] - r[(i - 1 + N) % N]) / (2 * h);
  return d;
}

/**
 * d r / d theta over a wider stencil: the least-squares slope through
 * 2w+1 neighbouring samples. The conjugate profile comes out of a pointwise
 * minimum, so it carries a little high-frequency ripple; a central
 * difference amplifies that into visibly noisy normals, and this does not.
 */
function dPolarWide(r, w) {
  const N = r.length, h = TAU / N, d = new Float64Array(N);
  w = Math.max(1, w | 0);
  const denom = h * (w * (w + 1) * (2 * w + 1) / 3);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let k = -w; k <= w; k++) s += k * r[((i + k) % N + N) % N];
    d[i] = s / denom;
  }
  return d;
}

/**
 * Outward unit normal of a polar curve at sample i.
 * p(t) = (r cos t, r sin t);  p' = (r' cos t - r sin t, r' sin t + r cos t).
 * Rotating the tangent by -90 deg, (x,y) -> (y,-x), points outward.
 */
function normalAt(r, dr, i) {
  const th = i * TAU / r.length, c = Math.cos(th), s = Math.sin(th);
  const tx = dr[i] * c - r[i] * s, ty = dr[i] * s + r[i] * c;
  const L = Math.hypot(tx, ty) || 1;
  return [ty / L, -tx / L];
}

/** Outward unit normal at an arbitrary angle, interpolating r and dr/dtheta. */
function normalAtAngle(r, dr, th) {
  const rr = rAt(r, th), drr = rAt(dr, th);
  const c = Math.cos(th), s = Math.sin(th);
  const tx = drr * c - rr * s, ty = drr * s + rr * c;
  const L = Math.hypot(tx, ty) || 1;
  return [ty / L, -tx / L];
}

/** Cumulative arc length of a polar curve; returns {s: Float64Array(N+1), L}. */
function arcLength(r) {
  const N = r.length, s = new Float64Array(N + 1);
  let px = r[0], py = 0;
  for (let i = 1; i <= N; i++) {
    const th = (i % N) * TAU / N, rr = r[i % N];
    const x = rr * Math.cos(th), y = rr * Math.sin(th);
    s[i] = s[i - 1] + Math.hypot(x - px, y - py);
    px = x; py = y;
  }
  return { s, L: s[N] };
}

/* ── ray casting: closed polyline → polar samples ─────────────────────
 * Rasterises one edge onto the angular grid, keeping the NEAREST hit per
 * bin. Run over every edge of a closed curve this yields the near-side
 * boundary as seen from the origin — which is exactly the polar profile
 * for a star-shaped curve, and the safe (non-colliding) bound otherwise.
 * `owner` records which sweep step produced each minimum; that is what
 * later gives us the path of contact for free.
 */
function rasterEdge(Px, Py, Qx, Qy, out, owner, tag, bin) {
  const M = out.length;
  const a0 = Math.atan2(Py, Px);
  const d = angDiff(a0, Math.atan2(Qy, Qx));
  const ex = Qx - Px, ey = Qy - Py;
  const lo = d >= 0 ? a0 : a0 + d, hi = d >= 0 ? a0 + d : a0;
  const i0 = Math.ceil(lo / bin), i1 = Math.floor(hi / bin);
  const cross_Pe = Px * ey - Py * ex;
  for (let idx = i0; idx <= i1; idx++) {
    const psi = idx * bin;
    const den = Math.cos(psi) * ey - Math.sin(psi) * ex;
    if (Math.abs(den) < 1e-12) continue;
    const t = cross_Pe / den;
    if (t <= 0) continue;
    const m = ((idx % M) + M) % M;
    if (t < out[m]) { out[m] = t; if (owner) owner[m] = tag; }
  }
}

/** Closed polyline [[x,y],...] → polar radii on an M-bin grid. */
function polyToPolar(pts, M, fill) {
  const out = new Float64Array(M).fill(Infinity);
  const bin = TAU / M, n = pts.length;
  for (let i = 0; i < n; i++) {
    const p = pts[i], q = pts[(i + 1) % n];
    rasterEdge(p[0], p[1], q[0], q[1], out, null, 0, bin);
  }
  for (let i = 0; i < M; i++) if (!isFinite(out[i])) out[i] = fill != null ? fill : 0;
  return out;
}

/**
 * Rotational symmetry order: the largest n <= 16 for which rotating the
 * curve by TAU/n leaves it (nearly) unchanged. Used to decide which gear
 * ratios can possibly close up.
 */
function symmetryOrder(r, tol) {
  const N = r.length, mean = r.reduce((a, b) => a + b, 0) / N;
  tol = (tol || 0.004) * mean;
  for (let n = 16; n >= 2; n--) {
    let ok = true;
    for (let i = 0; i < N && ok; i++) if (Math.abs(r[i] - rAt(r, i * TAU / N + TAU / n)) > tol) ok = false;
    if (ok) return n;
  }
  return 1;
}

/** True if the curve is (numerically) a circle. */
function isRound(r) { return (rMax(r) - rMin(r)) < 1e-6 * rMax(r); }

/* ── shape library ───────────────────────────────────────────────────
 * Each entry is a polar function of theta plus its parameter metadata.
 * `sym` is the natural symmetry order (0 = rotationally free, i.e. a circle).
 */

const P = (k, label, min, max, val, step, tip) => ({ k, label, min, max, val, step: step || 0.01, tip });

const SHAPES = [
  {
    id: 'circle', name: 'Circle', group: 'Round', sym: 0,
    blurb: 'The ordinary case. Its mate is another circle and the ratio never wavers.',
    params: [P('R', 'Radius', 0.3, 1.8, 1, 0.01, 'Radius of the pitch circle')],
    f: (t, p) => p.R
  },
  {
    id: 'ellipseF', name: 'Ellipse (focus)', group: 'Round', sym: 1,
    blurb: 'Turned about a FOCUS, an ellipse rolls on an identical ellipse — the classic non-circular pair.',
    params: [
      P('A', 'Semi-major', 0.4, 1.6, 1, 0.01, 'Semi-major axis a'),
      P('e', 'Eccentricity', 0, 0.75, 0.35, 0.005, 'Flattening. 0 is a circle; the mate stays congruent at any e.')
    ],
    f: (t, p) => p.A * (1 - p.e * p.e) / (1 + p.e * Math.cos(t))
  },
  {
    id: 'ellipseC', name: 'Ellipse (centre)', group: 'Round', sym: 2,
    blurb: 'The same outline spun about its CENTRE instead. Two-fold symmetric, and a completely different mate.',
    params: [P('A', 'Semi-major', 0.4, 1.6, 1.1), P('B', 'Semi-minor', 0.25, 1.6, 0.7)],
    f: (t, p) => {
      const c = Math.cos(t), s = Math.sin(t);
      return p.A * p.B / Math.hypot(p.B * c, p.A * s);
    }
  },
  {
    id: 'square', name: 'Rounded square', group: 'Cornered', sym: 4,
    blurb: 'The headline question: what meshes with a square? Raise the exponent for sharper corners.',
    params: [P('R', 'Half-width', 0.4, 1.5, 1), P('n', 'Exponent', 2, 14, 6, 0.1, 'Superellipse exponent. 2 is a circle, large is a square.')],
    f: (t, p) => p.R / Math.pow(Math.pow(Math.abs(Math.cos(t)), p.n) + Math.pow(Math.abs(Math.sin(t)), p.n), 1 / p.n)
  },
  {
    id: 'poly', name: 'Regular polygon', group: 'Cornered', sym: 3,
    blurb: 'A true polygon: flat sides, sharp corners. Use Smoothing to give the corners a radius.',
    params: [P('R', 'Circumradius', 0.4, 1.5, 1), P('N', 'Sides', 3, 12, 5, 1, 'Number of sides — also the symmetry order')],
    f: (t, p) => {
      const N = Math.round(p.N), seg = TAU / N;
      const u = wrap(t) % seg - seg / 2;
      return p.R * Math.cos(Math.PI / N) / Math.cos(u);
    },
    symOf: (p) => Math.round(p.N)
  },
  {
    id: 'reuleaux', name: 'Reuleaux triangle', group: 'Cornered', sym: 3,
    blurb: 'A curve of constant width, built as the intersection of three discs. Constant width is not constant radius — it still needs a proper mate.',
    params: [P('W', 'Width', 0.5, 1.8, 1.2)],
    f: (t, p) => {
      const d = p.W / Math.sqrt(3), c = Math.cos(t), s = Math.sin(t);
      let best = Infinity;
      for (let k = 0; k < 3; k++) {
        const va = Math.PI / 2 + k * TAU / 3;
        const dot = d * (Math.cos(va) * c + Math.sin(va) * s);
        const disc = dot * dot - d * d + p.W * p.W;
        if (disc < 0) continue;
        best = Math.min(best, dot + Math.sqrt(disc));
      }
      return isFinite(best) ? best : d;
    }
  },
  {
    id: 'lobed', name: 'Lobed flower', group: 'Lobed', sym: 3,
    blurb: 'A sinusoid wrapped round a circle. The lobe count sets which ratios can close.',
    params: [
      P('R', 'Mean radius', 0.4, 1.5, 1),
      P('N', 'Lobes', 1, 10, 3, 1),
      P('A', 'Depth', 0, 0.55, 0.25, 0.005, 'Amplitude as a fraction of the mean radius'),
      P('q', 'Sharpness', 0.3, 3, 1, 0.05, 'Below 1 flattens the lobes, above 1 sharpens the valleys')
    ],
    f: (t, p) => {
      const c = Math.cos(Math.round(p.N) * t);
      return p.R * (1 + p.A * Math.sign(c) * Math.pow(Math.abs(c), p.q));
    },
    symOf: (p) => Math.round(p.N)
  },
  {
    id: 'egg', name: 'Egg (limaçon)', group: 'Lobed', sym: 1,
    blurb: 'A one-lobed shape. Nothing repeats within a turn, so the mate is one-lobed too and the ratio swings hard.',
    params: [P('R', 'Mean radius', 0.4, 1.4, 0.9), P('e', 'Offset', 0, 0.7, 0.4, 0.005)],
    f: (t, p) => p.R * (1 + p.e * Math.cos(t))
  },
  {
    id: 'cam', name: 'Snail cam', group: 'Lobed', sym: 1,
    blurb: 'A radius that grows linearly then drops off a cliff. A good way to watch the construction break.',
    params: [P('R', 'Base radius', 0.3, 1.2, 0.55), P('g', 'Growth', 0.05, 1.2, 0.6, 0.01)],
    f: (t, p) => p.R + p.g * wrap(t) / TAU
  },
  {
    id: 'star', name: 'Star', group: 'Lobed', sym: 5,
    blurb: 'Deep valleys between sharp points — the classic shape that looks fine and then interferes.',
    params: [
      P('R', 'Outer radius', 0.5, 1.5, 1),
      P('N', 'Points', 3, 12, 5, 1),
      P('k', 'Inner ratio', 0.3, 0.95, 0.62, 0.01)
    ],
    f: (t, p) => {
      const N = Math.round(p.N), seg = TAU / N;
      const u = Math.abs(wrap(t) % seg - seg / 2) / (seg / 2); /* 0 at tip, 1 at valley */
      return lerp(p.R, p.R * p.k, u);
    },
    symOf: (p) => Math.round(p.N)
  },
  {
    id: 'involute', name: 'Involute gear', group: 'Toothed', sym: 12,
    blurb: 'A real spur gear. Its conjugate comes out as another involute gear — that is the whole point of the involute.',
    params: [
      P('z', 'Teeth', 6, 40, 12, 1),
      P('m', 'Module', 0.06, 0.3, 0.16, 0.005, 'Tooth size: pitch radius = m·z/2'),
      P('alpha', 'Pressure angle', 12, 30, 20, 0.5, 'Degrees. The slope of the rack that cuts it.'),
      P('x', 'Profile shift', -0.5, 0.7, 0, 0.01, 'Moves the cutter out; cures undercut on small gears')
    ],
    special: 'involute',
    symOf: (p) => Math.round(p.z)
  },
  {
    id: 'formula', name: 'Your formula', group: 'Custom', sym: 1,
    blurb: 'Type any r(t). Available: sin cos tan abs sqrt exp log floor sign min max hypot pi.',
    params: [P('R', 'Scale', 0.2, 2, 1)],
    special: 'formula'
  },
  {
    id: 'drawn', name: 'Draw it', group: 'Custom', sym: 1,
    blurb: 'Sketch a closed outline by dragging round the axle. Smoothing tidies it up.',
    params: [P('R', 'Scale', 0.2, 2, 1)],
    special: 'drawn'
  }
];

const SHAPE_BY_ID = Object.fromEntries(SHAPES.map(s => [s.id, s]));

/* ── custom shape state ──────────────────────────────────────────────── */

/** Guarded compile of a user r(t) expression. Throws with a readable message. */
function compilePolar(src) {
  if (!/^[0-9a-zA-Z_+\-*/^%().,\s]*$/.test(src)) throw new Error('That expression contains a character I will not evaluate.');
  const allowed = new Set(['t', 'pi', 'tau', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'abs', 'sqrt',
    'pow', 'min', 'max', 'exp', 'log', 'floor', 'ceil', 'round', 'sign', 'hypot']);
  for (const id of src.match(/[a-zA-Z_][a-zA-Z_0-9]*/g) || []) {
    if (!allowed.has(id)) throw new Error('Unknown name "' + id + '".');
  }
  const body = 'const {sin,cos,tan,asin,acos,atan,abs,sqrt,pow,min,max,exp,log,floor,ceil,round,sign,hypot}=Math;' +
    'const pi=Math.PI, tau=Math.PI*2; return (' + src.replace(/\^/g, '**') + ');';
  let fn;
  try { fn = new Function('t', body); } catch (e) { throw new Error('I could not parse that: ' + e.message); }
  const v = fn(0.7);
  if (typeof v !== 'number' || !isFinite(v)) throw new Error('That does not evaluate to a number at t = 0.7.');
  return fn;
}

/* Sketched outline, kept as radii on a coarse grid and interpolated. */
const Drawn = {
  n: 96,
  r: null,
  reset(v) { this.r = new Float64Array(this.n).fill(v == null ? 0.9 : v); },
  /** Paint a radius at angle th with a soft brush, as if dragging a pen. */
  paint(th, rad, brush) {
    if (!this.r) this.reset();
    const n = this.n, c = wrap(th) / TAU * n, w = Math.max(1, (brush || 0.12) * n);
    for (let k = -Math.ceil(w); k <= Math.ceil(w); k++) {
      const i = ((Math.round(c) + k) % n + n) % n;
      const fall = Math.max(0, 1 - Math.abs(k) / w);
      this.r[i] = lerp(this.r[i], rad, fall * fall * (3 - 2 * fall));
    }
  },
  at(t) { return rAt(this.r || (this.reset(), this.r), t); }
};
Drawn.reset();

/**
 * Build the polar sample array for a shape definition + parameter values.
 * Applies the global smoothing and guards against non-positive radii.
 */
function buildShape(def, vals, N, smooth, extra) {
  let r;
  if (def.special === 'involute') {
    r = involuteProfile(vals, N);
  } else if (def.special === 'formula') {
    const fn = (extra && extra.formula) || (() => 1);
    r = new Float64Array(N);
    for (let i = 0; i < N; i++) r[i] = vals.R * fn(i * TAU / N);
  } else if (def.special === 'drawn') {
    r = new Float64Array(N);
    for (let i = 0; i < N; i++) r[i] = vals.R * Drawn.at(i * TAU / N);
  } else {
    r = new Float64Array(N);
    for (let i = 0; i < N; i++) r[i] = def.f(i * TAU / N, vals);
  }
  /* Nothing downstream survives a zero or negative radius. */
  let bad = false;
  for (let i = 0; i < N; i++) if (!(r[i] > 1e-4)) { r[i] = 1e-4; bad = true; }
  if (smooth > 0 && def.special !== 'involute') r = smoothPolar(r, smooth);
  return { r, degenerate: bad };
}
