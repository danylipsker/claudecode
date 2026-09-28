/* Tests of HYPER-CORE/js/quantum.js (kit.qm) against exact results. Run: node HYPER-CORE/tools/test-quantum.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), Q = H.qm;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), m + ' (got ' + a + ', want ' + b + ')');

// complex numbers
near(Q.expi(Math.PI).re, -1, 1e-12, 'e^{iπ} = −1');
near(Q.abs(Q.mul(Q.cx(3, 4), Q.cx(0, 1))), 5, 1e-12, '|i(3 + 4i)| = 5');
near(Q.arg(Q.mul(Q.polar(1, 0.3), Q.polar(1, 0.4))), 0.7, 1e-12, 'multiplying arrows adds angles');
near(Q.arrowSum([Q.cx(1, 0), Q.cx(0, 1), Q.cx(-1, 0)]).total.im, 1, 1e-12, 'arrows add head to tail');

// QED: glass
near(Q.glassSimple({ n: 1.5, d: 0, lambda: 500e-9 }), 0, 1e-12, 'a vanishingly thin sheet reflects nothing');
near(Q.glassSimple({ n: 1.5, d: 500e-9 / (4 * 1.5), lambda: 500e-9 }), 0.16, 1e-9, 'QED glass: 16 % at a quarter wave');
near(Q.glassExact({ n: 1.5, d: 500e-9 / (4 * 1.5), lambda: 500e-9 }), 4 * 0.04 / Math.pow(1.04, 2), 1e-9, 'thin film: 4r²/(1 + r²)² at a quarter wave');
near(Q.glassSimple({ n: 1.5, d: 1e-6, lambda: 500e-9 }), Q.glassSimple({ n: 1.5, d: 1e-6 + 500e-9 / 3, lambda: 500e-9 }), 1e-9, 'QED glass repeats every λ/2n of thickness');

// QED: the mirror — the middle of the mirror does the work
{
  const o = { src: [-1, 1], det: [1, 1], y: 0, lambda: 0.002, n: 20000 };
  const whole = Q.mirrorPaths(Object.assign({ x0: -3, x1: 3 }, o)), mid = Q.mirrorPaths(Object.assign({ x0: -0.3, x1: 0.3, n: 2000 }, o));
  const zw = Q.scale(whole.total, 6), zm = Q.scale(mid.total, 0.6);        // undo the 1/n weights: amplitude per unit length
  ok(Math.abs(Q.abs(zw) - Q.abs(zm)) < 0.2 * Q.abs(zw), 'mirror: the central 10 % gives nearly the whole amplitude');
  const ends = Q.mirrorPaths(Object.assign({ x0: 1.5, x1: 3, n: 5000 }, o));
  ok(Q.abs(Q.scale(ends.total, 1.5)) < 0.2 * Q.abs(zw), 'mirror: the far end nearly cancels itself');
}

// slits
{
  const d = 1e-4, lam = 5e-7, Ls = 1, f = Q.slits({ n: 2, d, a: 0, lambda: lam, L: Ls });
  const xMax = Ls * Math.tan(Math.asin(lam / d)), xMin = Ls * Math.tan(Math.asin(lam / (2 * d)));
  near(f(0), 1, 1e-12, 'two slits: central maximum');
  near(f(xMax), 1, 1e-6, 'two slits: first maximum at d sin θ = λ');
  ok(f(xMin) < 1e-10, 'two slits: first zero at d sin θ = λ/2');
  const g = Q.slits({ n: 1, d, a: 2e-5, lambda: lam, L: Ls });
  ok(g(Ls * Math.tan(Math.asin(lam / 2e-5))) < 1e-10, 'one slit: first zero at a sin θ = λ');
  const R = Q.rng(3), s = Q.sampler(f, -0.02, 0.02, R); let m = 0; for (let i = 0; i < 4000; i++) m += s();
  ok(Math.abs(m / 4000) < 1e-3, 'sampling the pattern: symmetric about the centre');
}

// Schrödinger: norm, spreading of a free packet, a stationary state
{
  const w = Q.wave1d({ N: 2000, L: 40, dt: 0.004 }).setGaussian({ x0: 20, sigma: 1, k0: 0 });
  w.step(1000);                                                            // t = 4
  near(w.norm(), 1, 1e-8, 'Crank–Nicolson keeps the norm');
  const p = w.prob(), mu = w.mean(); let v = 0, s = 0; for (let j = 0; j < p.length; j++) { v += p[j] * (w.x[j] - mu) ** 2; s += p[j]; }
  near(Math.sqrt(v / s), Math.sqrt(5), 0.01, 'free packet: σ(t) = σ₀√(1 + (ħt/2mσ₀²)²)');
  const m = Q.wave1d({ N: 1000, L: 60, dt: 0.01 }).setGaussian({ x0: 20, sigma: 2, k0: 1.5 }); m.step(500);
  near(m.mean(), 20 + 1.5 * 5, 0.01, 'a packet moves at the group velocity ħk/m');
}
{
  const b = Q.eigen1d(() => 0, { N: 1000, L: 1, count: 3 });
  for (let n = 1; n <= 3; n++) near(b.E[n - 1], n * n * Math.PI * Math.PI / 2, 2e-4, 'box: Eₙ = n²π²ħ²/2mL², n = ' + n);
  const o = Q.eigen1d(x => 0.5 * (x - 10) ** 2, { N: 2000, L: 20, count: 4 });
  for (let n = 0; n < 4; n++) near(o.E[n], n + 0.5, 1e-3, 'oscillator: Eₙ = (n + ½)ħω, n = ' + n);
  let s = 0; for (const q of o.psi[2]) s += q * q * o.dx; near(s, 1, 1e-9, 'stationary states are normalised');
  let dot = 0; for (let j = 0; j < o.psi[0].length; j++) dot += o.psi[0][j] * o.psi[1][j] * o.dx; ok(Math.abs(dot) < 1e-6, 'stationary states are orthogonal');
}
{
  const T = Q.barrierT({ E: 1, V0: 5, a: 3 }), kap = Math.sqrt(2 * 4);
  near(T, 16 * 1 * 4 / 25 * Math.exp(-2 * kap * 3), 0.02, 'thick barrier: T ≈ 16E(V₀ − E)/V₀² e^{−2κa}');
  near(Q.barrierT({ E: 5 * (1 - 1e-7), V0: 5, a: 1 }), Q.barrierT({ E: 5 * (1 + 1e-7), V0: 5, a: 1 }), 1e-5, 'T is continuous through E = V₀');
  near(Q.barrierT({ E: 5 + Math.PI ** 2 / 2, V0: 5, a: 1 }), 1, 1e-9, 'resonant transmission when qa = π');
}

// two-state systems and spin
{
  const a = Q.ammonia({ E0: 3, A: 0.7, t: 1.3 });
  near(a.P2, Math.sin(0.7 * 1.3) ** 2, 1e-12, 'ammonia: P₂ = sin²(At/ħ)');
  near(a.P1 + a.P2, 1, 1e-12, 'two-state evolution is unitary');
  near(Q.arg(Q.mul(a.C2, Q.conj(a.C1))), Math.PI / 2, 1e-12, 'ammonia: C₂ is i times C₁ up to size');
  const c = Q.evolve2([[1, Q.cx(0.3, 0.4)], [Q.cx(0.3, -0.4), -2]], [Q.cx(0.6, 0), Q.cx(0, 0.8)], 2.2);
  near(Q.abs2(c[0]) + Q.abs2(c[1]), 1, 1e-12, 'a general Hermitian H keeps the probability');
  near(Q.spinHalfP(Math.PI / 2), 0.5, 1e-12, 'spin ½: half get through a filter at 90°');
  const D = Q.spinOneD(0.83); let err = 0;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += D[i][k] * D[j][k]; err = Math.max(err, Math.abs(s - (i === j ? 1 : 0))); }
  ok(err < 1e-12, 'spin one: the rotation matrix is orthogonal');
  near(Q.spinOneD(Math.PI)[2][0], 1, 1e-12, 'spin one: turned over, + becomes −');
}

// relativity
{
  const b = Q.lorentz(0.6); near(b.gamma, 1.25, 1e-12, 'γ(0.6c) = 1.25');
  near(Q.interval(b.t(3, 7), b.x(3, 7)), Q.interval(7, 3), 1e-12, 'the interval is invariant');
  near(Q.addVelocity(0.9, 0.9), 1.8 / 1.81, 1e-12, 'velocities add to less than c');
  near(Q.doppler(0.6), 2, 1e-12, 'Doppler factor at 0.6c is 2');
}

// fields
{
  near(Q.efield([{ x: 0, y: 0, q: 1 }], 2, 0).x, 0.25, 1e-12, 'Coulomb field ∝ 1/r²');
  near(Q.potential([{ x: 0, y: 0, q: 2 }], 0, 4), 0.5, 1e-12, 'potential ∝ q/r');
  const B = Q.wireB([{ x: 0, y: 0, I: 3 }], 0, 1.5); near(Math.hypot(B.x, B.y), 2, 1e-12, 'wire field ∝ I/r'); ok(B.x < 0, 'wire field circles counter-clockwise for current out of the page');
  const qs = [{ x: -1, y: 0, q: 1 }, { x: 1, y: 0, q: -1 }];
  const line = Q.traceField((x, y) => Q.efield(qs, x, y), -1 + 0.05 * Math.cos(0.7), 0.05 * Math.sin(0.7), { step: 0.01, max: 5000, stop: (x, y) => Math.hypot(x - 1, y) < 0.05 });
  const end = line[line.length - 1]; ok(Math.hypot(end[0] - 1, end[1]) < 0.06, 'a dipole field line runs from + to −');
}

// least action
{
  const free = Q.stationaryPath({ x0: 0, x1: 4, T: 2, n: 40 });
  ok(free.every((x, i) => Math.abs(x - 4 * i / 40) < 1e-9), 'free particle: the stationary path is a straight line');
  const g = 9.8, T = 2, n = 60, p = Q.stationaryPath({ x0: 0, x1: 0, T, n, dV: () => g, iters: 20000 });
  near(p[n / 2], g * T * T / 8, 1e-3, 'uniform gravity: the path is Newton\'s parabola');
  const fine = Q.stationaryPath({ x0: 0, x1: 0, T, n: 96, dV: () => g });
  near(fine[48], g * T * T / 8, 1e-9, 'uniform gravity: exact at any resolution with the default steps');
  // a spring (ω = 1) over T = 4 > π: the true path is a saddle of the action, x(t) = x₁ sin t / sin T
  const sp = Q.stationaryPath({ x0: 0, x1: 1, T: 4, n: 400, dV: x => x });
  let err = 0; sp.forEach((x, i) => { const t = 4 * i / 400; err = Math.max(err, Math.abs(x - Math.sin(t) / Math.sin(4))); });
  ok(err < 1e-3, 'spring beyond half a period: the stationary path is a saddle and is still found (max error ' + err.toExponential(1) + ')');
  const pend = Q.stationaryPath({ x0: 0, x1: 0.5, T: 1.5, n: 300, dV: x => Math.sin(x) });
  let res = 0; for (let i = 1; i < 300; i++) { const h = 1.5 / 300; res = Math.max(res, Math.abs((pend[i + 1] - 2 * pend[i] + pend[i - 1]) / (h * h) + Math.sin(pend[i]))); }
  ok(res < 1e-8, 'a pendulum (non-linear): the discrete Euler–Lagrange equations are satisfied');
  const Lg = (x, v) => 0.5 * v * v - g * x, dt = T / n;
  const S0 = Q.action(p, dt, Lg), bent = p.map((x, i) => x + 0.3 * Math.sin(Math.PI * i / n));
  ok(Q.action(bent, dt, Lg) > S0, 'a bent path has more action (a minimum for short times)');
}

// light, atoms, oscillators
{
  const T = 5800, lw = Q.wien(T); let best = 0, bl = 0;
  for (let l = 200e-9; l < 1200e-9; l += 0.1e-9) { const b = Q.planck(l, T); if (b > best) { best = b; bl = l; } }
  near(bl, lw, 1e-3, 'Planck peak at Wien\'s λmax');
  near(Q.hydrogenE(2), -3.4014, 1e-4, 'hydrogen: E₂ = −13.6/4 eV');
  near(Q.hydrogenR(1, 0, 0), 2, 1e-12, 'hydrogen: R₁₀(0) = 2 a₀^{−3/2}');
  for (const [n, l] of [[1, 0], [2, 0], [2, 1], [3, 2], [4, 1]]) { let s = 0; for (let r = 0.0005; r < 80; r += 0.001) s += Math.pow(Q.hydrogenR(n, l, r) * r, 2) * 0.001; near(s, 1, 2e-3, 'hydrogen R_' + n + l + ' normalised'); }
  let s = 0; for (let x = -10; x < 10; x += 0.001) s += Q.oscillatorPsi(3, x) ** 2 * 0.001; near(s, 1, 1e-6, 'oscillator ψ₃ normalised');
  near(Q.deBroglie(Q.me, 1e6), 7.27e-10, 1e-3, 'electron at 10⁶ m/s: λ ≈ 0.727 nm');
  near(Q.photonE(500e-9) / Q.eV, 2.48, 1e-3, 'a 500 nm photon carries 2.48 eV');
}

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
