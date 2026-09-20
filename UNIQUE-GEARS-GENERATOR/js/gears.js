/* gears.js — the conjugate construction.
 *
 * FRAME CONVENTION (everything downstream depends on this)
 *   O1 sits at the origin, O2 at (a, 0).  Gear 1 turns clockwise, gear 2
 *   counter-clockwise, as an external pair must:
 *       body-1 orientation  =  -phi1
 *       body-2 orientation  =  +phi2
 *   so a body-1 point p appears in the world at   w = Rot(-phi1) p,
 *   and a world point appears in body 2 at        q = Rot(-phi2) (w - A).
 *
 *   With that choice the body-1 point facing O2 at time phi1 is the one at
 *   body angle phi1 exactly — which is why the rolling ODE below can be
 *   written in terms of r1(phi1) with no bookkeeping.
 */
'use strict';

/* ── involute spur gear ───────────────────────────────────────────────
 * A genuine involute profile, built tooth by tooth, so that the workbench
 * has one shape whose correct answer we already know.
 */
function involuteProfile(v, N) {
  const z = Math.max(4, Math.round(v.z)), m = v.m, al = v.alpha / DEG, x = v.x;
  const rp = m * z / 2, rb = rp * Math.cos(al);
  const inv = (A) => Math.tan(A) - A;
  /* half tooth angle at the pitch circle: s = m(pi/2 + 2x tan a), psi = s/(2 rp) */
  const half = (Math.PI / 2 + 2 * x * Math.tan(al)) / z;
  const delta = (r) => half + inv(al) - inv(Math.acos(clamp(rb / r, -1, 1)));

  let ra = rp + m * (1 + x);
  /* If the flanks meet before the addendum circle the tooth is pointed —
     clamp the tip to where the half-thickness reaches zero. */
  if (delta(rb * 6) < 0) {
    let lo = rb * 1.0001, hi = rb * 6;
    for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (delta(mid) > 0) lo = mid; else hi = mid; }
    ra = Math.min(ra, lo);
  }
  const rf = Math.max(0.12 * rp, rp - m * (1.25 - x));
  const rLow = Math.max(rb, rf);
  const K = 24, pitch = TAU / z, pts = [];

  for (let j = 0; j < z; j++) {
    const base = j * pitch, flank = [];
    for (let k = 0; k <= K; k++) { const r = lerp(rLow, ra, k / K); flank.push([delta(r), r]); }
    const dLow = flank[0][0];
    pts.push([base - pitch / 2, rf]);
    if (rf < rb) pts.push([base - dLow, rf]);
    for (let k = 0; k <= K; k++) pts.push([base - flank[k][0], flank[k][1]]);   /* left flank, root → tip */
    for (let k = K; k >= 0; k--) pts.push([base + flank[k][0], flank[k][1]]);   /* right flank, tip → root */
    if (rf < rb) pts.push([base + dLow, rf]);
    pts.push([base + pitch / 2, rf]);
  }
  const xy = pts.map(([t, r]) => [r * Math.cos(t), r * Math.sin(t)]);
  const out = polyToPolar(xy, N, rf);
  out.meta = { rp, rb, ra, rf, alpha: v.alpha, z };
  return out;
}

/* ── the rolling law ──────────────────────────────────────────────────
 * Two centrodes touch on the line of centres and roll without slipping, so
 * their contact-point speeds match:   w1 r1 = w2 r2,  r1 + r2 = a.
 * Hence the ODE that generates everything else:
 *
 *        d phi2 / d phi1  =  r1(phi1) / (a - r1(phi1))
 */
function buildLaw(r1c, a) {
  const N = r1c.length, dt = TAU / N, cum = new Float64Array(N + 1);
  for (let i = 0; i < N; i++) {
    const f0 = r1c[i] / (a - r1c[i]);
    const f1 = r1c[(i + 1) % N] / (a - r1c[(i + 1) % N]);
    cum[i + 1] = cum[i] + 0.5 * (f0 + f1) * dt;
  }
  const total = cum[N];
  return {
    total, ratio: total / TAU,
    /* phi2 for any phi1, including several turns: the integrand is periodic. */
    phi2(p) {
      const turns = Math.floor(p / TAU), rem = p - turns * TAU;
      const xx = rem / dt, i = Math.min(Math.floor(xx), N - 1);
      return turns * total + lerp(cum[i], cum[i + 1], clamp(xx - i, 0, 1));
    },
    /* instantaneous ratio w2/w1 */
    k(p) { const r = rAt(r1c, p); return r / (a - r); }
  };
}

/**
 * Centre distance that makes the pair close up with the given ratio.
 * total(a) decreases monotonically in a, so a bisection is safe and exact
 * to machine precision in ~70 steps.
 */
function solveCenterDistance(r1c, ratio) {
  const N = r1c.length, dt = TAU / N, top = rMax(r1c);
  const total = (a) => {
    let s = 0;
    for (let i = 0; i < N; i++) {
      const f0 = r1c[i] / (a - r1c[i]), f1 = r1c[(i + 1) % N] / (a - r1c[(i + 1) % N]);
      s += 0.5 * (f0 + f1) * dt;
    }
    return s;
  };
  const target = TAU * ratio;
  let lo = top * 1.000001, hi = top * 2;
  let guard = 0;
  while (total(hi) > target && guard++ < 200) hi *= 1.7;
  for (let k = 0; k < 90; k++) { const mid = (lo + hi) / 2; if (total(mid) > target) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}

/**
 * The mate centrode, straight from the ODE.
 * The contact point sits at world (r1, 0); in body 2 that is angle pi - phi2,
 * so psi runs BACKWARDS as phi2 grows. We walk phi2 up and drop a sample each
 * time psi crosses a grid line.
 * Returns radii on an M-bin psi grid, plus the phi1 that produced each one.
 */
function mateCentrode(r1c, a, M, law) {
  const r2 = new Float64Array(M), phiOf = new Float64Array(M).fill(NaN);
  const bin = TAU / M;
  const steps = r1c.length * 3, dphi = TAU / steps;
  let phi = 0, u = 0;                       /* u = phi2 */
  let target = Math.PI - bin * Math.floor(Math.PI / bin); /* first u that lands on a grid line */
  if (target < 0) target += bin;
  let filled = 0, guard = 0;

  while (filled < M && guard++ < steps * 40) {
    const r0 = rAt(r1c, phi), r1n = rAt(r1c, phi + dphi);
    const du = 0.5 * (r0 / (a - r0) + r1n / (a - r1n)) * dphi;
    while (filled < M && target <= u + du) {
      const f = du > 1e-14 ? (target - u) / du : 0;
      const ph = phi + f * dphi;
      const j = ((Math.round(wrap(Math.PI - target) / bin) % M) + M) % M;
      if (isNaN(phiOf[j])) { r2[j] = a - rAt(r1c, ph); phiOf[j] = ph; filled++; }
      target += bin;
    }
    u += du; phi += dphi;
  }
  /* If the pair does not close, some bins were never reached. */
  const closed = filled === M;
  for (let j = 0; j < M; j++) if (isNaN(phiOf[j])) r2[j] = a - rMax(r1c);
  return { r: r2, phiOf, closed, turns: phi / TAU };
}

/* ── teeth ────────────────────────────────────────────────────────────
 * Teeth are an offset of the centrode along its own normal, spaced evenly
 * in ARC LENGTH (not in angle) so they stay the same size all the way round
 * a non-circular pitch curve.
 */
const TOOTH = {
  sine: (u) => Math.cos(TAU * u),
  square: (u) => (Math.cos(TAU * u) >= 0 ? 1 : -1),
  triangle: (u) => { const w = u < 0.5 ? u : u - 1; return 1 - 4 * Math.abs(w); },
  trapezoid: (u) => {
    const w = Math.abs(u < 0.5 ? u : u - 1), land = 0.22, A = land / 2, B = 0.5 - land / 2;
    if (w <= A) return 1;
    if (w >= B) return -1;
    return 1 - 2 * (w - A) / (B - A);
  },
  pin: (u) => {
    const w = Math.abs(u < 0.5 ? u : u - 1);
    return w <= 0.25 ? Math.sqrt(Math.max(0, 1 - (w / 0.25) ** 2))
      : -Math.sqrt(Math.max(0, 1 - ((w - 0.5) / 0.25) ** 2));
  }
};

function addTeeth(r1c, Z, height, profile, phase, N) {
  if (Z < 1 || height <= 0) return Float64Array.from(r1c);
  const n = r1c.length, dr = dPolar(r1c), { s, L } = arcLength(r1c);
  const p = L / Z, f = TOOTH[profile] || TOOTH.sine, pts = new Array(n);
  for (let i = 0; i < n; i++) {
    const th = i * TAU / n;
    let u = (s[i] / p + phase) % 1; if (u < 0) u += 1;
    const off = height * f(u), nrm = normalAt(r1c, dr, i);
    pts[i] = [r1c[i] * Math.cos(th) + off * nrm[0], r1c[i] * Math.sin(th) + off * nrm[1]];
  }
  return polyToPolar(pts, N, rMin(r1c) * 0.5);
}

/* ── the conjugate itself ─────────────────────────────────────────────
 * Sweep gear 1 through a whole meshing cycle, and at every step look at it
 * from gear 2's frame. Gear 2 may occupy any point that gear 1 NEVER visits,
 * so the mate is the pointwise minimum of gear 1's near boundary over the
 * whole sweep — the envelope of the family, and literally what a gear shaper
 * cuts. Undercut, interference and clearance all come out of it for free.
 */
function conjugate(prof1, law, a, M, span, steps) {
  const N = prof1.length, bin = TAU / M;
  const r = new Float64Array(M).fill(Infinity);
  const owner = new Int32Array(M).fill(-1);
  const px = new Float64Array(N), py = new Float64Array(N);
  const cosT = new Float64Array(N), sinT = new Float64Array(N);
  for (let i = 0; i < N; i++) { const t = i * TAU / N; cosT[i] = Math.cos(t); sinT[i] = Math.sin(t); }

  const frames = new Array(steps);
  for (let k = 0; k < steps; k++) {
    const phi1 = span * k / steps, phi2 = law.phi2(phi1);
    const c1 = Math.cos(-phi1), s1 = Math.sin(-phi1);
    const c2 = Math.cos(-phi2), s2 = Math.sin(-phi2);
    for (let i = 0; i < N; i++) {
      const rr = prof1[i], bx = rr * cosT[i], by = rr * sinT[i];
      const wx = c1 * bx - s1 * by, wy = s1 * bx + c1 * by;      /* → world   */
      const vx = wx - a, vy = wy;
      px[i] = c2 * vx - s2 * vy; py[i] = s2 * vx + c2 * vy;      /* → body 2  */
    }
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      rasterEdge(px[i], py[i], px[j], py[j], r, owner, k, bin);
    }
    frames[k] = phi1;
  }
  /* Bins gear 1 never reached are free space; cap them at the blank radius. */
  const blank = a - rMin(prof1);
  let touched = 0;
  for (let i = 0; i < M; i++) { if (isFinite(r[i])) touched++; else r[i] = blank; }

  /* `owner` keeps which sweep step cut each bin. Contact for the overlays and
     the readouts is found per instant by contactsNow(), which is far more
     precise; this is kept because it is the one record of WHERE in the cycle
     each piece of gear 2's outline was formed. */
  return { r, owner, frames, span, steps, coverage: touched / M };
}

/* ── where they actually touch, right now ─────────────────────────
 * The sweep above records contact only to the nearest sweep step, which is
 * fine for drawing the path of contact but too coarse for the numbers. At
 * any single instant we can do better cheaply: project gear 1 into gear 2's
 * frame once, and look for where the gap between the two boundaries closes.
 */
function silhouette(prof1, law, a, M, phi1, out) {
  const N = prof1.length, bin = TAU / M;
  const r = out || new Float64Array(M);
  r.fill(Infinity);
  const phi2 = law.phi2(phi1);
  const c1 = Math.cos(-phi1), s1 = Math.sin(-phi1);
  const c2 = Math.cos(-phi2), s2 = Math.sin(-phi2);
  let px = 0, py = 0;
  for (let i = 0; i <= N; i++) {
    const idx = i % N, t = idx * TAU / N, rr = prof1[idx];
    const bx = rr * Math.cos(t), by = rr * Math.sin(t);
    const wx = c1 * bx - s1 * by, wy = s1 * bx + c1 * by;
    const vx = wx - a, vy = wy;
    const qx = c2 * vx - s2 * vy, qy = s2 * vx + c2 * vy;
    if (i > 0) rasterEdge(px, py, qx, qy, r, null, 0, bin);
    px = qx; py = qy;
  }
  return r;
}

/** Bin indices on gear 2 that are touching gear 1 at this instant. */
function contactsNow(model, phi1) {
  const { profile1, law, a, M, r2 } = model;
  const rho = silhouette(profile1, law, a, M, phi1, model._sil || (model._sil = new Float64Array(M)));
  const gap = model._gap || (model._gap = new Float64Array(M));
  let gmin = Infinity;
  for (let i = 0; i < M; i++) {
    gap[i] = isFinite(rho[i]) ? rho[i] - r2[i] : Infinity;
    if (gap[i] < gmin) gmin = gap[i];
  }
  if (!isFinite(gmin)) return [];
  const tol = gmin + a * 1.5e-3;
  /* one representative per contiguous run of touching bins, so a flat
     contact reports as one contact rather than fifty */
  const hit = (i) => gap[((i % M) + M) % M] <= tol;
  const out = [];
  for (let i = 0; i < M; i++) {
    if (!hit(i) || hit(i - 1)) continue;          /* only run starts */
    let best = i, j = i;
    while (j < i + M && hit(j)) { if (gap[j % M] < gap[best % M]) best = j; j++; }
    out.push(((best % M) + M) % M);
    if (j >= i + M) break;                         /* the whole rim touches */
  }
  if (!out.length) {                               /* no run start: every bin qualifies */
    let best = 0;
    for (let i = 1; i < M; i++) if (gap[i] < gap[best]) best = i;
    out.push(best);
  }
  /* Sub-bin refinement. Two curves meeting tangentially have a gap that is
     locally quadratic, so a parabola through the three samples around the
     minimum puts the contact point well inside one bin — which matters,
     because the law-of-gearing residual is first-order in that position. */
  const refined = out.map((b) => {
    const gm = gap[(b - 1 + M) % M], g0 = gap[b], gp = gap[(b + 1) % M];
    let f = 0;
    if (isFinite(gm) && isFinite(gp)) {
      const den = gm - 2 * g0 + gp;
      if (Math.abs(den) > 1e-15) f = clamp(0.5 * (gm - gp) / den, -0.5, 0.5);
    }
    return { bin: b, psi: (b + f) * TAU / M, gap: g0 };
  });
  /* tightest first, so callers that want one representative contact get the
     one that is unambiguously touching rather than whichever came first */
  refined.sort((p, q) => p.gap - q.gap);
  return refined;
}

/* ── kinematic readout at one instant ─────────────────────────────── */

/** world point of a body-2 polar sample */
function body2ToWorld(rad, psi, phi2, a) {
  const x = rad * Math.cos(psi), y = rad * Math.sin(psi);
  const c = Math.cos(phi2), s = Math.sin(phi2);
  return [c * x - s * y + a, s * x + c * y];
}
/** world point of a body-1 polar sample */
function body1ToWorld(rad, th, phi1) {
  const x = rad * Math.cos(th), y = rad * Math.sin(th);
  const c = Math.cos(-phi1), s = Math.sin(-phi1);
  return [c * x - s * y, s * x + c * y];
}

/**
 * Everything the overlays and the readout panel need, for one phi1.
 * `model` is the object assembled by rebuild() in studio.js.
 */
function probe(model, phi1) {
  const { law, a, r2, centrode1, conj, M } = model;
  const phi2 = law.phi2(phi1), k = law.k(phi1);
  const rp1 = rAt(centrode1, phi1);            /* pitch radius of gear 1 now  */
  const P = [rp1, 0];                          /* the pitch point             */
  const out = { phi1, phi2, k, rp1, rp2: a - rp1, P, contacts: [] };

  const bins = contactsNow(model, phi1);
  const dr2 = model.dr2 || (model.dr2 = dPolarWide(r2, 3));

  for (const ct of bins) {
    const m = ct.bin, psi = ct.psi;
    const C = body2ToWorld(rAt(r2, psi), psi, phi2, a);
    const nb = normalAtAngle(r2, dr2, psi);
    const c = Math.cos(phi2), s = Math.sin(phi2);
    const n = [c * nb[0] - s * nb[1], s * nb[0] + c * nb[1]];   /* common normal, world */
    /* sliding velocity, with w1 = -1 (gear 1 turns clockwise) and w2 = +k */
    const vs = [(1 + k) * C[1], -(1 + k) * C[0] + k * a];
    /* law of gearing: how far the normal line misses the pitch point */
    const miss = Math.abs(n[0] * (P[1] - C[1]) - n[1] * (P[0] - C[0]));
    /* With clearance the gap test alone already finds only real contacts.
       With clearance dialled to zero, tooth tips genuinely do graze the roots
       they cut; this is the backstop that keeps a wildly non-conjugate touch
       out of the load-carrying numbers. */
    const live = miss < a * 0.05;
    out.contacts.push({ bin: m, C, n, vs, slide: Math.hypot(vs[0], vs[1]), miss, live });
  }
  out.live = out.contacts.filter(c => c.live);
  /* pressure angle, measured at the tightest live contact against the pitch tangent */
  if (out.live.length) {
    const dc = model.dc1 || (model.dc1 = dPolarWide(centrode1, 3));
    const i = Math.round(wrap(phi1) / TAU * centrode1.length) % centrode1.length;
    const nb = normalAt(centrode1, dc, i);
    const tB = [-nb[1], nb[0]];
    const cc = Math.cos(-phi1), ss = Math.sin(-phi1);
    const t = [cc * tB[0] - ss * tB[1], ss * tB[0] + cc * tB[1]];
    /* live[0] is the tightest load-carrying contact — the stable single number */
    const c0 = out.live[0];
    out.pressure = Math.acos(clamp(Math.abs(c0.n[0] * t[0] + c0.n[1] * t[1]), 0, 1)) * DEG;
    out.miss = c0.miss;
    out.slide = Math.max(...out.live.map(c => c.slide));
  }
  return out;
}

/* ── ratio helpers ────────────────────────────────────────────────── */

/** Nearest simple fraction to x, with denominator <= maxD. */
function nearestRatio(x, maxD) {
  let best = { n: 1, d: 1, err: Infinity };
  for (let d = 1; d <= (maxD || 12); d++) {
    const n = Math.round(x * d);
    if (n < 1) continue;
    const err = Math.abs(n / d - x);
    if (err < best.err - 1e-12) best = { n, d, err };
  }
  return best;
}
