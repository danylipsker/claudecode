/* HYPER-CORE · fluid.js
 *
 * Fluid mechanics for engineers — aerodynamics, hydraulics and pneumatics — for simulations
 * (kit.fluid), the tools and tests. Nothing here uses the DOM. SI units throughout (m, s, kg,
 * Pa, K, m³/s); angles in radians unless a name says deg.
 *
 *   F.isa(h)                                  standard atmosphere -> { T, p, rho, a, mu, nu }
 *   F.isentropic(M, g)  F.machFromArea(AR, g, supersonic)  F.normalShock(M, g)
 *   F.obliqueShock(M, theta, g)  F.prandtlMeyer(M, g)  F.machFromNu(nu, g)
 *   F.naca4(m, p, t, n) -> [[x, y], …] (closed, clockwise from the trailing edge)
 *   F.panel(points, alpha) -> { cl, cm, cp: [{ x, y, cp, upper }], velAt(x, y) -> [u, v], gamma }   (Hess–Smith, V∞ = 1, chord 1)
 *   F.thinAirfoil(m, p) -> { alpha0, cmc4 }   F.liftingLine({ AR, taper, alpha, alpha0, twist, a0, N })
 *   F.flatPlate(Re) -> { cfLam, cfTurb }  F.blasiusDelta(x, Re_x)
 *   F.friction(Re, relRough) (Darcy)  F.swameeJain(Re, rr)  F.headLoss({ f, L, D, V })
 *   F.operatingPoint(pumpH(Q), systemH(Q), Qmax)  F.affinity({ Q, H, P }, n1, n2, D1, D2)
 *   F.normalDepth({ Q, b, n, S, z })  F.criticalDepth({ Q, b, z })  F.hydraulicJump(y1, Fr1)
 *   F.waveSpeed({ K, rho, D, e, E })  F.orifice(Cd, A, dp, rho)  F.oilViscosity(VG | { v40, v100 }, T°C) (m²/s)
 *   F.iso6358({ C, b, p1, p2, T1 }) -> { mdot, qANR }   F.dewPoint(T°C, RH)  F.pressureDewPoint(T°C, RH, p1, p2)
 *   F.compressorWork(p1, p2, V1, n)  F.pneuCylinder({...}) -> a stepping model of a cylinder, its valve and air
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const g0 = 9.80665, Rair = 287.058;
  const bisect = (f, lo, hi, it) => { let flo = f(lo); for (let k = 0; k < (it || 200); k++) { const m = (lo + hi) / 2, fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };

  /* ---------------------------------------------------------------- the atmosphere */
  const sutherland = T => 1.458e-6 * Math.pow(T, 1.5) / (T + 110.4);
  // ICAO/ISA standard atmosphere (US Standard Atmosphere 1976 above 47 km) to 84.85 km geopotential altitude, m;
  // each layer: base height, base temperature, lapse rate (K/m), base pressure
  const LAYERS = [[0, 288.15, -0.0065, 101325], [11000, 216.65, 0, 22632.06], [20000, 216.65, 0.001, 5474.889], [32000, 228.65, 0.0028, 868.0187],
    [47000, 270.65, 0, 110.9063], [51000, 270.65, -0.0028, 66.93887], [71000, 214.65, -0.002, 3.956420], [84852, 186.946, 0, 0.3733836]];
  function isa(h) {
    h = Math.min(h, 84852);
    let k = LAYERS.length - 1;
    while (k > 0 && h < LAYERS[k][0]) k--;
    const [hb, Tb, L, pb] = LAYERS[k], T = Tb + L * (h - hb);
    const p = L === 0 ? pb * Math.exp(-g0 * (h - hb) / (Rair * Tb)) : pb * Math.pow(T / Tb, -g0 / (L * Rair));
    const rho = p / (Rair * T), mu = sutherland(T);
    return { T, p, rho, a: Math.sqrt(1.4 * Rair * T), mu, nu: mu / rho, h };
  }

  /* ---------------------------------------------------------------- gas dynamics */
  function isentropic(M, g) {
    g = g || 1.4;
    const t = 1 + (g - 1) / 2 * M * M;
    return { T0T: t, p0p: Math.pow(t, g / (g - 1)), rho0rho: Math.pow(t, 1 / (g - 1)),
      AAstar: M > 0 ? 1 / M * Math.pow(2 / (g + 1) * t, (g + 1) / (2 * (g - 1))) : Infinity, mu: M >= 1 ? Math.asin(1 / M) : NaN };
  }
  const machFromArea = (AR, g, sup) => AR < 1 ? NaN : sup ? bisect(M => isentropic(M, g).AAstar - AR, 1, 60) : bisect(M => isentropic(M, g).AAstar - AR, 1e-6, 1);
  function normalShock(M1, g) {
    g = g || 1.4;
    const m2 = M1 * M1;
    const M2 = Math.sqrt((1 + (g - 1) / 2 * m2) / (g * m2 - (g - 1) / 2));
    const pr = 1 + 2 * g / (g + 1) * (m2 - 1), rr = (g + 1) * m2 / ((g - 1) * m2 + 2);
    const p0r = Math.pow(rr, g / (g - 1)) * Math.pow((g + 1) / (2 * g * m2 - (g - 1)), 1 / (g - 1));
    return { M2, p2p1: pr, rho2rho1: rr, T2T1: pr / rr, p02p01: p0r };
  }
  // θ from β (the θ–β–M relation)
  const thetaOf = (M, beta, g) => Math.atan(2 / Math.tan(beta) * (M * M * Math.sin(beta) ** 2 - 1) / (M * M * (g + Math.cos(2 * beta)) + 2));
  function obliqueShock(M1, theta, g) {
    g = g || 1.4;
    const mu = Math.asin(1 / M1);
    // the largest deflection this Mach number can turn with an attached shock
    let bmax = mu, tmax = 0;
    for (let k = 1; k < 2000; k++) { const b = mu + (Math.PI / 2 - mu) * k / 2000, t = thetaOf(M1, b, g); if (t > tmax) { tmax = t; bmax = b; } }
    if (theta > tmax) return { detached: true, thetaMax: tmax };
    // no deflection: the weak "shock" is a Mach wave (nothing changes); the strong one is a normal shock
    if (!(theta > 1e-9)) {
      const n = normalShock(M1, g);
      return { beta: mu, M2: M1, p2p1: 1, T2T1: 1, rho2rho1: 1, p02p01: 1, thetaMax: tmax, detached: false,
        strong: { beta: Math.PI / 2, M2: n.M2, p2p1: n.p2p1, T2T1: n.T2T1, rho2rho1: n.rho2rho1, p02p01: n.p02p01 } };
    }
    const weak = bisect(b => thetaOf(M1, b, g) - theta, mu + 1e-9, bmax);
    const strong = bisect(b => thetaOf(M1, b, g) - theta, bmax, Math.PI / 2 - 1e-9);
    const out = beta => { const n = normalShock(M1 * Math.sin(beta), g); return { beta, M2: n.M2 / Math.sin(beta - theta), p2p1: n.p2p1, T2T1: n.T2T1, rho2rho1: n.rho2rho1, p02p01: n.p02p01 }; };
    return Object.assign(out(weak), { strong: out(strong), thetaMax: tmax, detached: false });
  }
  const prandtlMeyer = (M, g) => { g = g || 1.4; if (M <= 1) return 0; const k = Math.sqrt((g + 1) / (g - 1)); return k * Math.atan(Math.sqrt((M * M - 1) / (k * k))) - Math.atan(Math.sqrt(M * M - 1)); };
  const machFromNu = (nu, g) => bisect(M => prandtlMeyer(M, g) - nu, 1, 100);

  /* ---------------------------------------------------------------- airfoils */
  // NACA 4-digit: m (max camber, fraction of chord), p (its position), t (thickness); cosine spacing
  function nacaCamber(m, p, x) {
    if (!m || !p) return [0, 0];
    return x < p ? [m / (p * p) * (2 * p * x - x * x), 2 * m / (p * p) * (p - x)] : [m / ((1 - p) ** 2) * (1 - 2 * p + 2 * p * x - x * x), 2 * m / ((1 - p) ** 2) * (p - x)];
  }
  function naca4(m, p, t, n) {
    n = n || 60;
    const up = [], lo = [];
    for (let i = 0; i <= n; i++) {
      const x = 0.5 * (1 - Math.cos(Math.PI * i / n));
      const yt = 5 * t * (0.2969 * Math.sqrt(x) - 0.126 * x - 0.3516 * x * x + 0.2843 * x ** 3 - 0.1036 * x ** 4);   // closed trailing edge
      const [yc, dy] = nacaCamber(m, p, x), th = Math.atan(dy);
      up.push([x - yt * Math.sin(th), yc + yt * Math.cos(th)]);
      lo.push([x + yt * Math.sin(th), yc - yt * Math.cos(th)]);
    }
    // clockwise: trailing edge → lower surface → leading edge → upper surface → trailing edge
    return lo.slice().reverse().concat(up.slice(1));
  }
  // Hess–Smith panel method: constant sources per panel plus one vortex strength, Kutta condition at the trailing edge
  function panel(pts, alpha) {
    const N = pts.length - 1;
    const th = [], len = [], cx = [], cy = [];
    for (let j = 0; j < N; j++) {
      const dx = pts[j + 1][0] - pts[j][0], dy = pts[j + 1][1] - pts[j][1];
      th.push(Math.atan2(dy, dx)); len.push(Math.hypot(dx, dy));
      cx.push((pts[j][0] + pts[j + 1][0]) / 2); cy.push((pts[j][1] + pts[j + 1][1]) / 2);
    }
    const infl = (px, py, j, self) => {
      // velocity at (px, py) from panel j: unit source and unit vortex, in the panel's own axes
      let L, beta;
      if (self) { L = 0; beta = Math.PI; }
      else {
        const x1 = pts[j][0] - px, y1 = pts[j][1] - py, x2 = pts[j + 1][0] - px, y2 = pts[j + 1][1] - py;
        L = Math.log(Math.hypot(x2, y2) / Math.hypot(x1, y1));
        beta = Math.atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2);
      }
      return { su: -L / (2 * Math.PI), sv: beta / (2 * Math.PI), vu: beta / (2 * Math.PI), vv: L / (2 * Math.PI) };
    };
    const A = Array.from({ length: N + 1 }, () => new Float64Array(N + 1)), rhs = new Float64Array(N + 1);
    const At = Array.from({ length: N }, () => new Float64Array(N + 1));
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const f = infl(cx[i], cy[i], j, i === j), d = th[i] - th[j], c = Math.cos(d), s = Math.sin(d);
        // normal and tangential components at panel i of panel j's local velocity (u along j, v normal to j)
        A[i][j] = -f.su * s + f.sv * c;                   // source → normal
        A[i][N] += -f.vu * s + f.vv * c;                  // vortex → normal
        At[i][j] = f.su * c + f.sv * s;                   // source → tangential
        At[i][N] += f.vu * c + f.vv * s;                  // vortex → tangential
      }
      rhs[i] = -Math.sin(alpha - th[i]);
    }
    // Kutta: equal and opposite tangential velocity on the first and last panels
    for (let j = 0; j <= N; j++) A[N][j] = At[0][j] + At[N - 1][j];
    rhs[N] = -(Math.cos(alpha - th[0]) + Math.cos(alpha - th[N - 1]));
    const x = solve(A, rhs);
    const cp = [];
    for (let i = 0; i < N; i++) {
      let vt = Math.cos(alpha - th[i]);
      for (let j = 0; j <= N; j++) vt += At[i][j] * x[j];
      cp.push({ x: cx[i], y: cy[i], cp: 1 - vt * vt, vt, upper: i >= N / 2 });
    }
    const gamma = x[N], perim = len.reduce((a, b) => a + b, 0);
    const chord = Math.max(...pts.map(p => p[0])) - Math.min(...pts.map(p => p[0]));
    // moment about the quarter chord from the pressure distribution (nose-up positive)
    let cm = 0;
    for (let i = 0; i < N; i++) {
      const nx = -Math.sin(th[i]), ny = Math.cos(th[i]);          // outward normal
      const fx = -cp[i].cp * nx * len[i], fy = -cp[i].cp * ny * len[i];
      cm += (cx[i] - 0.25) * fy - cy[i] * fx;
    }
    const velAt = (px, py) => {
      let u = Math.cos(alpha), v = Math.sin(alpha);
      for (let j = 0; j < N; j++) {
        const f = infl(px, py, j, false), c = Math.cos(th[j]), s = Math.sin(th[j]);
        const lu = f.su * x[j] + f.vu * gamma, lv = f.sv * x[j] + f.vv * gamma;
        u += lu * c - lv * s; v += lu * s + lv * c;
      }
      return [u, v];
    };
    return { cl: 2 * gamma * perim / chord, cm: -cm / (chord * chord), cp, velAt, gamma, sources: x.slice(0, N) };
  }
  function solve(A, b) {
    const n = b.length, M = A.map((r, i) => Array.from(r).concat([b[i]]));
    for (let c = 0; c < n; c++) {
      let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      [M[c], M[p]] = [M[p], M[c]];
      for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
    }
    const x = new Array(n).fill(0);
    for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
    return x;
  }
  // thin-airfoil theory for a NACA mean line: zero-lift angle and quarter-chord moment
  function thinAirfoil(m, p) {
    let a0 = 0, A1 = 0, A2 = 0;
    const n = 4000;
    for (let k = 0; k < n; k++) {
      const t = (k + 0.5) * Math.PI / n, x = 0.5 * (1 - Math.cos(t)), dz = nacaCamber(m, p, x)[1];
      a0 += dz * (Math.cos(t) - 1); A1 += dz * Math.cos(t); A2 += dz * Math.cos(2 * t);
    }
    a0 *= -1 / n; A1 *= 2 / n; A2 *= 2 / n;
    return { alpha0: a0, cmc4: Math.PI / 4 * (A2 - A1), clAt: a => 2 * Math.PI * (a - a0) };
  }
  // Prandtl's lifting line (Glauert's method), symmetric wing with linear taper and twist
  function liftingLine(o) {
    const N = o.N || 20, AR = o.AR, lam = o.taper != null ? o.taper : 1, a0 = o.a0 || 2 * Math.PI;
    const b = 1, S = b * b / AR, cr = 2 * S / (b * (1 + lam));
    const chordAt = th => cr * (1 - (1 - lam) * Math.abs(Math.cos(th)));
    const ns = Array.from({ length: N }, (_, k) => 2 * k + 1);
    const A = [], rhs = [];
    for (let k = 0; k < N; k++) {
      const th = (k + 1) * Math.PI / (2 * N + 1), c = chordAt(th);
      const alphaG = o.alpha + (o.twist || 0) * Math.abs(Math.cos(th)) - (o.alpha0 || 0);   // twist grows to the tip
      A.push(ns.map(n => Math.sin(n * th) * (4 * b / (a0 * c) + n / Math.sin(th))));
      rhs.push(alphaG);
    }
    const An = solve(A, rhs);
    const CL = Math.PI * AR * An[0];
    let sum = 0;
    for (let k = 0; k < N; k++) sum += ns[k] * An[k] * An[k];
    const CDi = Math.PI * AR * sum;                                  // also right at zero net lift (twisted wings)
    const dist = Array.from({ length: 41 }, (_, i) => {
      const y = Math.max(-0.4995, Math.min(0.4995, -0.5 + i / 40)), th = Math.acos(-2 * y);   // just inside the tips (a pointed tip has no chord)
      let s = 0; for (let k = 0; k < N; k++) s += An[k] * Math.sin(ns[k] * th);
      return { y, gamma: 2 * b * s, cl: 4 * b * s / chordAt(th) };
    });
    return { CL, CDi, e: CDi > 1e-15 ? CL * CL / (Math.PI * AR * CDi) : 1, dist };
  }

  /* ---------------------------------------------------------------- boundary layers */
  const flatPlate = Re => ({ cfLam: 1.328 / Math.sqrt(Re), cfTurb: 0.455 / Math.pow(Math.log10(Re), 2.58), cfTurbPow: 0.074 / Math.pow(Re, 0.2) });
  const blasiusDelta = (x, Rex) => 5.0 * x / Math.sqrt(Rex);          // 99 % thickness of a laminar layer
  const turbDelta = (x, Rex) => 0.37 * x / Math.pow(Rex, 0.2);

  /* ---------------------------------------------------------------- pipes */
  const swameeJain = (Re, rr) => 0.25 / Math.pow(Math.log10(rr / 3.7 + 5.74 / Math.pow(Re, 0.9)), 2);
  function colebrook(Re, rr) {
    let f = swameeJain(Re, rr);
    for (let k = 0; k < 50; k++) f = 1 / Math.pow(-2 * Math.log10(rr / 3.7 + 2.51 / (Re * Math.sqrt(f))), 2);
    return f;
  }
  // Darcy friction factor: laminar below 2300, Colebrook above 4000, blended in between
  function friction(Re, rr) {
    if (Re <= 0) return NaN;
    if (Re < 2300) return 64 / Re;
    if (Re > 4000) return colebrook(Re, rr || 0);
    const w = (Re - 2300) / 1700;
    return (1 - w) * 64 / 2300 + w * colebrook(4000, rr || 0);
  }
  const headLoss = o => o.f * o.L / o.D * o.V * o.V / (2 * g0);
  // where the pump curve meets the system curve; { Q: 0, noFlow: true } when the pump cannot overcome the static head
  const operatingPoint = (pumpH, sysH, Qmax) => {
    if (pumpH(0) <= sysH(0)) return { Q: 0, H: sysH(0), noFlow: true };
    const Q = bisect(q => pumpH(q) - sysH(q), 0, Qmax); return { Q, H: pumpH(Q) };
  };
  function affinity(o, n1, n2, D1, D2) {
    const rn = n2 / n1, rd = (D2 || 1) / (D1 || 1);
    return { Q: o.Q * rn * rd ** 3, H: o.H * rn * rn * rd * rd, P: o.P != null ? o.P * rn ** 3 * rd ** 5 : undefined };
  }

  /* ---------------------------------------------------------------- open channels (rectangular b, or trapezoidal with side slope z) */
  const section = (y, b, z) => { z = z || 0; const A = (b + z * y) * y, P = b + 2 * y * Math.sqrt(1 + z * z), T = b + 2 * z * y; return { A, P, R: A / P, T }; };
  const manningQ = (y, o) => { const s = section(y, o.b, o.z); return 1 / o.n * s.A * Math.pow(s.R, 2 / 3) * Math.sqrt(o.S); };
  // depth brackets widen until they hold the answer (NaN if no depth up to 10 km carries the flow)
  const normalDepth = o => { let hi = 1; while (manningQ(hi, o) < o.Q && hi < 1e4) hi *= 2; return manningQ(hi, o) < o.Q ? NaN : bisect(y => manningQ(y, o) - o.Q, 1e-9, hi); };
  const froudeAt = (y, o) => { const s = section(y, o.b, o.z); return o.Q * o.Q * s.T / (g0 * s.A ** 3) - 1; };
  const criticalDepth = o => { let hi = 1; while (froudeAt(hi, o) > 0 && hi < 1e4) hi *= 2; return froudeAt(hi, o) > 0 ? NaN : bisect(y => froudeAt(y, o), hi, 1e-9); };
  const froude = (V, D) => V / Math.sqrt(g0 * D);
  const hydraulicJump = (y1, Fr1) => { const y2 = y1 / 2 * (Math.sqrt(1 + 8 * Fr1 * Fr1) - 1); return { y2, loss: (y2 - y1) ** 3 / (4 * y1 * y2) }; };
  const weirRect = (Cd, b, Hh) => Cd * 2 / 3 * Math.sqrt(2 * g0) * b * Math.pow(Hh, 1.5);
  const weirV = (Cd, thetaDeg, Hh) => Cd * 8 / 15 * Math.sqrt(2 * g0) * Math.tan(thetaDeg * Math.PI / 360) * Math.pow(Hh, 2.5);

  /* ---------------------------------------------------------------- transients, orifices, oils */
  // pressure-wave speed in a liquid-filled pipe (Korteweg): K fluid bulk modulus, E wall modulus, e wall thickness
  const waveSpeed = o => Math.sqrt(o.K / o.rho / (1 + o.K * o.D / (o.E * o.e)));
  const joukowsky = (rho, a, dv) => rho * a * dv;
  const orifice = (Cd, A, dp, rho) => Cd * A * Math.sqrt(2 * Math.abs(dp) / rho) * Math.sign(dp);
  // mineral oil viscosity against temperature (ASTM D341 / Walther), from ISO VG (viscosity index ≈ 100) or two points; m²/s
  const VG = { 10: 2.62, 15: 3.41, 22: 4.3, 32: 5.43, 46: 6.83, 68: 8.8, 100: 11.4, 150: 14.8, 220: 19.0 };
  function oilViscosity(grade, TC) {
    const v40 = typeof grade === 'object' ? grade.v40 : grade, v100 = typeof grade === 'object' ? grade.v100 : VG[grade] || 0.13 * grade + 1.3;
    const W = v => Math.log10(Math.log10(v + 0.7)), T1 = Math.log10(313.15), T2 = Math.log10(373.15);
    const B = (W(v40) - W(v100)) / (T2 - T1), A = W(v40) + B * T1;
    const w = A - B * Math.log10(TC + 273.15);
    return (Math.pow(10, Math.pow(10, w)) - 0.7) * 1e-6;
  }

  /* ---------------------------------------------------------------- compressed air */
  const RHO_ANR = 1.185, T_ANR = 293.15, P_ANR = 100000;          // ISO 8778 standard reference atmosphere
  // ISO 6358: sonic conductance C (m³/(s·Pa)) and critical pressure ratio b; pressures absolute (Pa)
  function iso6358(o) {
    const r = o.p2 / o.p1, T1 = o.T1 || T_ANR;
    if (o.p1 <= o.p2) return { mdot: 0, qANR: 0, choked: false };
    const phi = r <= o.b ? 1 : Math.sqrt(Math.max(0, 1 - ((r - o.b) / (1 - o.b)) ** 2));
    const mdot = o.C * o.p1 * RHO_ANR * Math.sqrt(T_ANR / T1) * phi;
    return { mdot, qANR: mdot / RHO_ANR, choked: r <= o.b };
  }
  // dew point by the Magnus formula (°C, RH 0–1)
  const magnus = TC => 611.2 * Math.exp(17.62 * TC / (243.12 + TC));          // saturation vapour pressure, Pa
  const dewFromVapour = e => { const g = Math.log(e / 611.2); return 243.12 * g / (17.62 - g); };
  const dewPoint = (TC, RH) => dewFromVapour(RH * magnus(TC));
  // after compressing air from p1 to p2 (absolute) and cooling back to TC: the pressure dew point, and whether water condenses
  function pressureDewPoint(TC, RH, p1, p2) {
    const e2 = RH * magnus(TC) * p2 / p1;
    return { pdp: dewFromVapour(e2), condenses: e2 > magnus(TC) };
  }
  // compression work for a volume V1 of air at p1 up to p2: n = 1 isothermal, n = 1.4 adiabatic (J)
  const compressorWork = (p1, p2, V1, n) => (!n || Math.abs(n - 1) < 1e-9) ? p1 * V1 * Math.log(p2 / p1) : n / (n - 1) * p1 * V1 * (Math.pow(p2 / p1, (n - 1) / n) - 1);

  // a double-acting cylinder driven by a 5/2 valve, with meter-out throttles; the air in each chamber
  // follows the adiabatic energy balance and the valve flows follow ISO 6358
  function pneuCylinder(o) {
    const P = Object.assign({ bore: 0.032, rod: 0.012, stroke: 0.2, mass: 2, load: 0, psupply: 6e5 + 1.013e5, patm: 1.013e5,
      Cvalve: 1.2e-8, bvalve: 0.3, CthrottleA: 1.2e-8, CthrottleB: 1.2e-8, dead: 5e-6, fc: 20, fv: 50, T: 293.15, gamma: 1.4 }, o || {});
    const AA = Math.PI * P.bore * P.bore / 4, AB = AA - Math.PI * P.rod * P.rod / 4;
    const s = { x: 0, v: 0, pA: P.patm, pB: P.psupply, t: 0, air: 0, cmd: 0 };
    const restr = (Cv, Ct) => 1 / Math.sqrt(1 / (Cv * Cv) + 1 / (Ct * Ct));   // valve and throttle in series (sonic conductances)
    const R = 287.058;
    function step(dt, cmd) {
      s.cmd = cmd;
      const sub = Math.max(1, Math.ceil(dt / 2e-5)), h = dt / sub;
      for (let k = 0; k < sub; k++) {
        const VA = P.dead + AA * s.x, VB = P.dead + AB * (P.stroke - s.x);
        // command 1: supply to A, B to exhaust through its throttle; 0: the reverse
        let mA, mB;
        if (cmd) {
          mA = iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2: s.pA, T1: P.T }).mdot;
          mB = -iso6358({ C: restr(P.Cvalve, P.CthrottleB), b: P.bvalve, p1: s.pB, p2: P.patm, T1: P.T }).mdot;
        } else {
          mB = iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2: s.pB, T1: P.T }).mdot;
          mA = -iso6358({ C: restr(P.Cvalve, P.CthrottleA), b: P.bvalve, p1: s.pA, p2: P.patm, T1: P.T }).mdot;
        }
        if (mA > 0) s.air += mA * h; if (mB > 0) s.air += mB * h;
        // forces: pressures, load (opposing extension), friction
        const Fp = s.pA * AA - s.pB * AB - P.patm * (AA - AB) - P.load;
        let a;
        if (Math.abs(s.v) < 1e-4 && Math.abs(Fp) <= P.fc) { a = 0; s.v = 0; }
        else a = (Fp - Math.sign(s.v || Fp) * P.fc - P.fv * s.v) / P.mass;
        s.v += a * h; s.x += s.v * h;
        if (s.x <= 0) { s.x = 0; if (s.v < 0) s.v = 0; }
        if (s.x >= P.stroke) { s.x = P.stroke; if (s.v > 0) s.v = 0; }
        // chamber pressure: adiabatic filling and emptying, plus the work of the moving piston
        const g = P.gamma;
        s.pA += h * (g * R * P.T * mA - g * s.pA * AA * s.v) / VA;
        s.pB += h * (g * R * P.T * mB + g * s.pB * AB * s.v) / VB;
        s.pA = Math.max(1000, s.pA); s.pB = Math.max(1000, s.pB);
        s.t += h;
      }
      return s;
    }
    return { state: s, step, AA, AB, params: P, airNl: () => s.air / RHO_ANR * 1000 };
  }

  H.fluid = {
    g0, Rair, isa, sutherland, isentropic, machFromArea, normalShock, obliqueShock, prandtlMeyer, machFromNu,
    nacaCamber, naca4, panel, thinAirfoil, liftingLine, solve,
    flatPlate, blasiusDelta, turbDelta, swameeJain, colebrook, friction, headLoss, operatingPoint, affinity,
    section, manningQ, normalDepth, criticalDepth, froude, hydraulicJump, weirRect, weirV,
    waveSpeed, joukowsky, orifice, oilViscosity, VG,
    RHO_ANR, T_ANR, P_ANR, iso6358, magnus, dewPoint, pressureDewPoint, compressorWork, pneuCylinder
  };
})(typeof window !== 'undefined' ? window : globalThis);
