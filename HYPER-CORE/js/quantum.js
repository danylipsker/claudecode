/* HYPER-CORE · quantum.js
 *
 * Quantum behaviour, QED arrows, least action, relativity and fields for simulations (kit.qm), the tools
 * and tests. Nothing here uses the DOM. Natural units where a function says so (ħ = m = 1, c = 1, k = 1);
 * SI elsewhere, as named.
 *
 *   complex numbers {re, im}: Q.cx(re, im) Q.add Q.sub Q.mul Q.scale(z, s) Q.conj Q.abs Q.abs2 Q.arg Q.expi(θ) Q.polar(r, θ)
 *   Q.arrowSum(zs) -> { total, chain: [[x, y], …] }  the arrows laid head to tail
 *   Q.mirrorPaths({ src, det, y, x0, x1, n, lambda }) -> { pts: [{ x, L, phase, z }], total, chain }  QED's mirror: every point reflects
 *   Q.glassSimple({ n, d, lambda }) / Q.glassExact(…) -> reflection probability of a glass sheet (QED's two arrows / the full thin-film result)
 *   Q.slits({ n, d, a, lambda, L }) -> x -> relative intensity on a screen (1 at the centre)   Q.sampler(f, lo, hi, rng) -> () => x
 *   Q.rng(seed) -> () => [0, 1)   Q.gauss(rng) -> a standard normal draw
 *   Q.wave1d({ N, L, V, m, hbar, dt }) -> { x, re, im, V, step(k), prob(), norm(), mean(), setGaussian({ x0, sigma, k0 }) }  Crank–Nicolson, ψ = 0 at the ends
 *   Q.eigen1d(V, { N, L, m, hbar, count }) -> { x, E: [], psi: [[]] }   stationary states of a 1-D potential (Sturm bisection + inverse iteration)
 *   Q.barrierT({ E, V0, a, m, hbar }) -> transmission through a square barrier (exact)
 *   Q.evolve2(H, c0, t, hbar) -> [c1, c2]  a two-state system, H = [[h11, h12], [h21, h22]] Hermitian (numbers or {re, im})
 *   Q.ammonia({ E0, A, t, hbar }) -> { C1, C2, P1, P2 }  Feynman's ammonia molecule started in state 1
 *   Q.spinHalfP(θ) = cos²(θ/2)   Q.spinOneD(β) -> 3 × 3 rotation matrix of spin one (states +, 0, −)
 *   Q.lorentz(β) -> { gamma, x(x, t), t(x, t) } (c = 1)   Q.addVelocity(u, v)   Q.doppler(β)   Q.interval(t, x)
 *   Q.efield(charges [{ x, y, q }], x, y) -> { x, y }   Q.potential(charges, x, y)   Q.wireB(wires [{ x, y, I }], x, y)
 *   Q.traceField(f, x0, y0, { step, max, stop }) -> [[x, y], …]
 *   Q.action(xs, dt, L(x, v, t)) -> S   Q.stationaryPath({ x0, x1, T, n, m, dV, iters }) -> xs   (Euler–Lagrange by relaxation)
 *   Q.planck(λ, T) (W sr⁻¹ m⁻³)  Q.wien(T)  Q.hydrogenE(n) (eV)  Q.hydrogenR(n, l, r) (r in Bohr radii)  Q.hermite(n, x)  Q.oscillatorPsi(n, x)
 *   Q.deBroglie(m, v)  Q.photonE(λ)  and constants Q.h Q.hbar Q.c Q.e Q.me Q.kB Q.a0 Q.eV
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const h = 6.62607015e-34, hbarSI = h / (2 * Math.PI), c = 299792458, e = 1.602176634e-19, me = 9.1093837015e-31, kB = 1.380649e-23, a0 = 5.29177210903e-11;

  /* ---------------------------------------------------------------- complex numbers */
  const cx = (re, im) => ({ re, im: im || 0 });
  const add = (a, b) => cx(a.re + b.re, a.im + b.im), sub = (a, b) => cx(a.re - b.re, a.im - b.im);
  const mul = (a, b) => cx(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const scale = (a, s) => cx(a.re * s, a.im * s), conj = a => cx(a.re, -a.im);
  const abs2 = a => a.re * a.re + a.im * a.im, abs = a => Math.sqrt(abs2(a)), arg = a => Math.atan2(a.im, a.re);
  const expi = th => cx(Math.cos(th), Math.sin(th)), polar = (r, th) => cx(r * Math.cos(th), r * Math.sin(th));
  const C = v => typeof v === 'number' ? cx(v, 0) : v;
  function arrowSum(zs) {
    let x = 0, y = 0; const chain = [[0, 0]];
    for (const z of zs) { x += z.re; y += z.im; chain.push([x, y]); }
    return { total: cx(x, y), chain };
  }

  /* ---------------------------------------------------------------- QED: arrows for light */
  // every point of a mirror (the line y) reflects light from src to det; each path's arrow turns by 2π·L/λ
  function mirrorPaths(o) {
    const n = o.n || 200, pts = [];
    for (let i = 0; i < n; i++) {
      const x = o.x0 + (o.x1 - o.x0) * (i + 0.5) / n;
      const L = Math.hypot(x - o.src[0], o.y - o.src[1]) + Math.hypot(o.det[0] - x, o.det[1] - o.y);
      const phase = 2 * Math.PI * L / o.lambda;
      pts.push({ x, L, phase, z: scale(expi(phase), 1 / n) });
    }
    const s = arrowSum(pts.map(p => p.z));
    return { pts, total: s.total, chain: s.chain };
  }
  // QED's glass sheet: the front-surface arrow (−r) and the back-surface arrow (+r) turned by the round trip 2nd;
  // r = (n − 1)/(n + 1) is 0.2 for glass, 4 % from one surface
  function glassSimple(o) {
    const r = (o.n - 1) / (o.n + 1), d = 4 * Math.PI * o.n * o.d / o.lambda;
    return abs2(add(cx(-r, 0), polar(r, d)));
  }
  // the full thin-film result with multiple reflections (Airy), for a sheet in air at normal incidence
  function glassExact(o) {
    const r = (o.n - 1) / (o.n + 1), d = 4 * Math.PI * o.n * o.d / o.lambda, r2 = r * r;
    return 2 * r2 * (1 - Math.cos(d)) / (1 + r2 * r2 - 2 * r2 * Math.cos(d));
  }

  /* ---------------------------------------------------------------- slits and sampling */
  // n slits, centre spacing d, width a, wavelength λ, screen at distance L; Fraunhofer with the true angle
  function slits(o) {
    const n = o.n || 2, d = o.d, a = o.a || 0, lam = o.lambda, L = o.L;
    return x => {
      const s = x / Math.sqrt(x * x + L * L), b = Math.PI * a * s / lam, g = Math.PI * d * s / lam;
      const env = a > 0 && Math.abs(b) > 1e-12 ? Math.pow(Math.sin(b) / b, 2) : 1;
      const arr = n > 1 ? (Math.abs(Math.sin(g)) < 1e-12 ? 1 : Math.pow(Math.sin(n * g) / (n * Math.sin(g)), 2)) : 1;
      return env * arr;
    };
  }
  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const gauss = R => { const u = Math.max(1e-12, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  // draws from a non-negative function on [lo, hi] by rejection (its maximum found on a fine grid)
  function sampler(f, lo, hi, R) {
    let top = 0; for (let i = 0; i <= 2000; i++) top = Math.max(top, f(lo + (hi - lo) * i / 2000));
    top *= 1.02;
    return () => { for (let k = 0; k < 100000; k++) { const x = lo + (hi - lo) * R(); if (R() * top <= f(x)) return x; } return lo + (hi - lo) * R(); };
  }

  /* ---------------------------------------------------------------- the Schrödinger equation in one dimension */
  // Crank–Nicolson on N interior points of a box [0, L] (ψ = 0 at the walls): unitary, so the norm is kept
  function wave1d(o) {
    const N = o.N || 400, Lb = o.L || 1, m = o.m || 1, hb = o.hbar || 1, dx = Lb / (N + 1);
    const x = new Float64Array(N), V = new Float64Array(N), re = new Float64Array(N), im = new Float64Array(N);
    for (let j = 0; j < N; j++) { x[j] = (j + 1) * dx; V[j] = typeof o.V === 'function' ? o.V(x[j]) : (o.V ? o.V[j] || 0 : 0); }
    const w = {
      x, V, re, im, dx, dt: o.dt || 0.2 * m * dx * dx / hb,
      setGaussian(g) {
        for (let j = 0; j < N; j++) { const u = (x[j] - g.x0) / g.sigma, amp = Math.exp(-u * u / 4); re[j] = amp * Math.cos(g.k0 * x[j]); im[j] = amp * Math.sin(g.k0 * x[j]); }
        const s = Math.sqrt(w.norm()); for (let j = 0; j < N; j++) { re[j] /= s; im[j] /= s; }
        return w;
      },
      prob() { const p = new Float64Array(N); for (let j = 0; j < N; j++) p[j] = re[j] * re[j] + im[j] * im[j]; return p; },
      norm() { let s = 0; for (let j = 0; j < N; j++) s += re[j] * re[j] + im[j] * im[j]; return s * dx; },
      mean() { let s = 0, n = 0; for (let j = 0; j < N; j++) { const p = re[j] * re[j] + im[j] * im[j]; s += p * x[j]; n += p; } return s / n; },
      step(k) {
        const dt = w.dt, kin = hb * hb / (2 * m * dx * dx), f = dt / (2 * hb);
        // A = 1 + i f H, B = 1 − i f H, H tridiagonal with diagonal 2kin + V and off-diagonal −kin
        const cr = new Float64Array(N), ci = new Float64Array(N), dr = new Float64Array(N), di = new Float64Array(N);
        for (let s = 0; s < (k || 1); s++) {
          // right-hand side d = B ψ
          for (let j = 0; j < N; j++) {
            const hr = (2 * kin + V[j]) * re[j] - kin * ((j > 0 ? re[j - 1] : 0) + (j < N - 1 ? re[j + 1] : 0));
            const hi = (2 * kin + V[j]) * im[j] - kin * ((j > 0 ? im[j - 1] : 0) + (j < N - 1 ? im[j + 1] : 0));
            dr[j] = re[j] + f * hi; di[j] = im[j] - f * hr;
          }
          // Thomas algorithm for A with complex diagonal (1, f(2kin + V)) and off-diagonal (0, −f kin)
          const or = 0, oi = -f * kin;
          let br = 1, bi = f * (2 * kin + V[0]);
          let den = br * br + bi * bi;
          cr[0] = (or * br + oi * bi) / den; ci[0] = (oi * br - or * bi) / den;
          let yr = (dr[0] * br + di[0] * bi) / den, yi = (di[0] * br - dr[0] * bi) / den;
          dr[0] = yr; di[0] = yi;
          for (let j = 1; j < N; j++) {
            // denominator b_j − o·c_{j−1}
            const mr = or * cr[j - 1] - oi * ci[j - 1], mi = or * ci[j - 1] + oi * cr[j - 1];
            br = 1 - mr; bi = f * (2 * kin + V[j]) - mi; den = br * br + bi * bi;
            cr[j] = (or * br + oi * bi) / den; ci[j] = (oi * br - or * bi) / den;
            const nr = dr[j] - (or * dr[j - 1] - oi * di[j - 1]), ni = di[j] - (or * di[j - 1] + oi * dr[j - 1]);
            dr[j] = (nr * br + ni * bi) / den; di[j] = (ni * br - nr * bi) / den;
          }
          re[N - 1] = dr[N - 1]; im[N - 1] = di[N - 1];
          for (let j = N - 2; j >= 0; j--) { re[j] = dr[j] - (cr[j] * re[j + 1] - ci[j] * im[j + 1]); im[j] = di[j] - (cr[j] * im[j + 1] + ci[j] * re[j + 1]); }
        }
        return w;
      }
    };
    return w;
  }
  // stationary states: H = −(ħ²/2m) d²/dx² + V on N interior points of [0, L], the lowest `count` of them
  function eigen1d(Vf, o) {
    o = o || {};
    const N = o.N || 400, Lb = o.L || 1, m = o.m || 1, hb = o.hbar || 1, dx = Lb / (N + 1), kin = hb * hb / (2 * m * dx * dx), count = o.count || 5;
    const x = [], d = new Float64Array(N);
    for (let j = 0; j < N; j++) { x.push((j + 1) * dx); d[j] = 2 * kin + Vf(x[j]); }
    const off = -kin;
    const below = E => { let n = 0, q = d[0] - E; if (q < 0) n++; for (let j = 1; j < N; j++) { q = d[j] - E - off * off / (q === 0 ? 1e-300 : q); if (q < 0) n++; } return n; };
    let lo = Infinity, hi = -Infinity; for (let j = 0; j < N; j++) { lo = Math.min(lo, d[j] - 2 * kin); hi = Math.max(hi, d[j] + 2 * kin); }
    const E = [], psi = [];
    for (let k = 0; k < Math.min(count, N); k++) {
      let a = lo, b = hi;
      for (let it = 0; it < 200; it++) { const mid = (a + b) / 2; if (below(mid) > k) b = mid; else a = mid; }
      const ev = (a + b) / 2; E.push(ev);
      // inverse iteration: solve (T − ev − δ) v = v a few times
      let v = new Float64Array(N).fill(1); const sh = ev + 1e-10 * Math.max(1, Math.abs(ev));
      for (let it = 0; it < 4; it++) {
        const cp = new Float64Array(N), dp = new Float64Array(N);
        let b0 = d[0] - sh; cp[0] = off / b0; dp[0] = v[0] / b0;
        for (let j = 1; j < N; j++) { const den = d[j] - sh - off * cp[j - 1]; cp[j] = off / den; dp[j] = (v[j] - off * dp[j - 1]) / den; }
        const nv = new Float64Array(N); nv[N - 1] = dp[N - 1];
        for (let j = N - 2; j >= 0; j--) nv[j] = dp[j] - cp[j] * nv[j + 1];
        let s = 0; for (let j = 0; j < N; j++) s += nv[j] * nv[j]; s = Math.sqrt(s * dx);
        for (let j = 0; j < N; j++) nv[j] /= s;
        v = nv;
      }
      // a fixed sign: positive first lobe
      const j0 = v.findIndex(q => Math.abs(q) > 1e-6); if (j0 >= 0 && v[j0] < 0) for (let j = 0; j < N; j++) v[j] = -v[j];
      psi.push(Array.from(v));
    }
    return { x, E, psi, dx };
  }
  // exact transmission through a square barrier of height V0 and width a (natural or SI units, consistently)
  function barrierT(o) {
    const m = o.m || 1, hb = o.hbar || 1, E = o.E, V0 = o.V0, a = o.a;
    if (E <= 0) return 0;
    if (Math.abs(E - V0) < 1e-12 * Math.max(1, V0)) { const k = Math.sqrt(2 * m * E) / hb; return 1 / (1 + m * V0 * a * a / (2 * hb * hb)); }
    if (E < V0) { const kap = Math.sqrt(2 * m * (V0 - E)) / hb, s = Math.sinh(kap * a); return 1 / (1 + V0 * V0 * s * s / (4 * E * (V0 - E))); }
    const q = Math.sqrt(2 * m * (E - V0)) / hb, s = Math.sin(q * a); return 1 / (1 + V0 * V0 * s * s / (4 * E * (E - V0)));
  }

  /* ---------------------------------------------------------------- two-state systems and spin */
  // exact evolution of a 2 × 2 Hermitian Hamiltonian: c(t) = exp(−iHt/ħ) c(0)
  function evolve2(Hm, c0, t, hbar) {
    const hb = hbar || 1, a = C(Hm[0][0]).re, d = C(Hm[1][1]).re, b = C(Hm[0][1]);
    const mean = (a + d) / 2, half = (a - d) / 2, w = Math.sqrt(half * half + abs2(b)), th = w * t / hb;
    const ph = expi(-mean * t / hb), co = Math.cos(th), si = w > 0 ? Math.sin(th) / w : t / hb;
    // exp(−iMt/ħ) with M = [[half, b], [b*, −half]]: cos(th)·1 − i sin(th)/w · M
    const U = [[cx(co, -si * half), mul(cx(0, -si), b)], [mul(cx(0, -si), conj(b)), cx(co, si * half)]];
    const x0 = C(c0[0]), x1 = C(c0[1]);
    return [mul(ph, add(mul(U[0][0], x0), mul(U[0][1], x1))), mul(ph, add(mul(U[1][0], x0), mul(U[1][1], x1)))];
  }
  // H = [[E0, −A], [−A, E0]] started in state 1 (III-9): C1 = e^{−iE0t/ħ} cos(At/ħ), C2 = i e^{−iE0t/ħ} sin(At/ħ)
  function ammonia(o) {
    const [C1, C2] = evolve2([[o.E0 || 0, -o.A], [-o.A, o.E0 || 0]], [1, 0], o.t, o.hbar);
    return { C1, C2, P1: abs2(C1), P2: abs2(C2) };
  }
  const spinHalfP = th => Math.pow(Math.cos(th / 2), 2);
  // the spin-one rotation matrix about y by β, rows and columns in the order +, 0, −
  function spinOneD(b) {
    const cb = Math.cos(b), sb = Math.sin(b), r = Math.SQRT2;
    return [[(1 + cb) / 2, -sb / r, (1 - cb) / 2], [sb / r, cb, -sb / r], [(1 - cb) / 2, sb / r, (1 + cb) / 2]];
  }

  /* ---------------------------------------------------------------- relativity (c = 1) */
  function lorentz(beta) {
    const g = 1 / Math.sqrt(1 - beta * beta);
    return { gamma: g, x: (x, t) => g * (x - beta * t), t: (x, t) => g * (t - beta * x) };
  }
  const addVelocity = (u, v) => (u + v) / (1 + u * v);
  const doppler = b => Math.sqrt((1 + b) / (1 - b));
  const interval = (t, x) => t * t - x * x;

  /* ---------------------------------------------------------------- fields in a plane (k = 1) */
  function efield(qs, x, y) {
    let ex = 0, ey = 0;
    for (const q of qs) { const dx = x - q.x, dy = y - q.y, r2 = dx * dx + dy * dy; if (r2 < 1e-12) continue; const r3 = r2 * Math.sqrt(r2); ex += q.q * dx / r3; ey += q.q * dy / r3; }
    return { x: ex, y: ey };
  }
  function potential(qs, x, y) { let v = 0; for (const q of qs) { const r = Math.hypot(x - q.x, y - q.y); v += q.q / Math.max(r, 1e-9); } return v; }
  // long straight wires perpendicular to the plane, current I out of the page: B circles them, ∝ I/r
  function wireB(ws, x, y) {
    let bx = 0, by = 0;
    for (const w of ws) { const dx = x - w.x, dy = y - w.y, r2 = dx * dx + dy * dy; if (r2 < 1e-12) continue; bx += -w.I * dy / r2; by += w.I * dx / r2; }
    return { x: bx, y: by };
  }
  // follows the direction of a field from (x0, y0) with RK4 steps of fixed length
  function traceField(f, x0, y0, o) {
    o = o || {};
    const step = o.step || 0.01, max = o.max || 2000, dir = o.backward ? -1 : 1, pts = [[x0, y0]];
    const unit = (x, y) => { const v = f(x, y), n = Math.hypot(v.x, v.y); return n > 0 ? [dir * v.x / n, dir * v.y / n] : [0, 0]; };
    let x = x0, y = y0;
    for (let k = 0; k < max; k++) {
      const k1 = unit(x, y), k2 = unit(x + step / 2 * k1[0], y + step / 2 * k1[1]), k3 = unit(x + step / 2 * k2[0], y + step / 2 * k2[1]), k4 = unit(x + step * k3[0], y + step * k3[1]);
      x += step / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += step / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      if (!Number.isFinite(x) || !Number.isFinite(y)) break;
      pts.push([x, y]);
      if (o.stop && o.stop(x, y)) break;
    }
    return pts;
  }

  /* ---------------------------------------------------------------- least action */
  // the action of a path sampled at equal time steps dt: Σ L(midpoint, slope, t) dt
  function action(xs, dt, L) {
    let S = 0;
    for (let i = 0; i + 1 < xs.length; i++) S += L((xs[i] + xs[i + 1]) / 2, (xs[i + 1] - xs[i]) / dt, (i + 0.5) * dt) * dt;
    return S;
  }
  // the path from x0 (t = 0) to x1 (t = T) that makes S = ∫(½mv² − V) dt stationary: Newton's method on the discrete
  // Euler–Lagrange equations m(x_{i+1} − 2x_i + x_{i−1})/dt² + V′(x_i) = 0, a tridiagonal system. It finds a minimum or a
  // saddle alike (a spring over more than half a period), in a few steps; `iters` caps the Newton steps
  function stationaryPath(o) {
    const n = o.n || 60, m = o.m || 1, dt = o.T / n, xs = [], k = m / (dt * dt);
    for (let i = 0; i <= n; i++) xs.push(o.x0 + (o.x1 - o.x0) * i / n);
    const dV = o.dV || (() => 0), d2V = (x, t) => { const h = 1e-5 * Math.max(1, Math.abs(x)); return (dV(x + h, t) - dV(x - h, t)) / (2 * h); };
    const F = new Float64Array(n + 1), a = new Float64Array(n + 1), cp = new Float64Array(n + 1), dp = new Float64Array(n + 1);
    for (let it = 0; it < Math.min(o.iters || 50, 200); it++) {
      let worst = 0;
      for (let i = 1; i < n; i++) { F[i] = k * (xs[i + 1] - 2 * xs[i] + xs[i - 1]) + dV(xs[i], i * dt); a[i] = -2 * k + d2V(xs[i], i * dt); worst = Math.max(worst, Math.abs(F[i])); }
      if (worst < 1e-13 * Math.max(1, k * Math.abs(o.x1 - o.x0) + 1)) break;
      // solve J δ = −F, J tridiagonal with diagonal a_i and off-diagonal k (Thomas algorithm)
      cp[1] = k / a[1]; dp[1] = -F[1] / a[1];
      for (let i = 2; i < n; i++) { const den = a[i] - k * cp[i - 1]; cp[i] = k / den; dp[i] = (-F[i] - k * dp[i - 1]) / den; }
      let d = dp[n - 1]; if (!Number.isFinite(d)) break;
      xs[n - 1] += d;
      for (let i = n - 2; i >= 1; i--) { d = dp[i] - cp[i] * d; xs[i] += d; }
    }
    return xs;
  }

  /* ---------------------------------------------------------------- atoms, light and oscillators */
  const planck = (lam, T) => 2 * h * c * c / Math.pow(lam, 5) / (Math.exp(h * c / (lam * kB * T)) - 1);
  const wien = T => 2.897771955e-3 / T;
  const hydrogenE = n => -13.605693122994 / (n * n);
  function laguerre(k, a, x) {           // generalized Laguerre L_k^a(x) by recurrence
    if (k === 0) return 1; let L0 = 1, L1 = 1 + a - x;
    for (let j = 1; j < k; j++) { const L2 = ((2 * j + 1 + a - x) * L1 - (j + a) * L0) / (j + 1); L0 = L1; L1 = L2; }
    return L1;
  }
  const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
  // radial function R_nl(r), r in Bohr radii, normalised so that ∫ R² r² dr = 1
  function hydrogenR(n, l, r) {
    const rho = 2 * r / n, N = Math.sqrt(Math.pow(2 / n, 3) * fact(n - l - 1) / (2 * n * fact(n + l)));
    return N * Math.exp(-rho / 2) * Math.pow(rho, l) * laguerre(n - l - 1, 2 * l + 1, rho);
  }
  function hermite(n, x) { if (n === 0) return 1; let H0 = 1, H1 = 2 * x; for (let k = 1; k < n; k++) { const H2 = 2 * x * H1 - 2 * k * H0; H0 = H1; H1 = H2; } return H1; }
  // oscillator stationary states with m = ω = ħ = 1: energies n + ½
  const oscillatorPsi = (n, x) => hermite(n, x) * Math.exp(-x * x / 2) / Math.sqrt(Math.pow(2, n) * fact(n) * Math.sqrt(Math.PI));
  const deBroglie = (m, v) => h / (m * v);
  const photonE = lam => h * c / lam;

  H.qm = {
    h, hbar: hbarSI, c, e, me, kB, a0, eV: e,
    cx, add, sub, mul, scale, conj, abs, abs2, arg, expi, polar, arrowSum,
    mirrorPaths, glassSimple, glassExact, slits, sampler, rng, gauss,
    wave1d, eigen1d, barrierT, evolve2, ammonia, spinHalfP, spinOneD,
    lorentz, addVelocity, doppler, interval, efield, potential, wireB, traceField,
    action, stationaryPath, planck, wien, hydrogenE, hydrogenR, laguerre, hermite, oscillatorPsi, deBroglie, photonE
  };
})(typeof window !== 'undefined' ? window : globalThis);
