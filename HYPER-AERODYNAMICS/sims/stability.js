/* HYPER-AERODYNAMICS · sims/stability.js — simulations for the Stability and Control branch.
 *   stab-axes            body axes, Euler angles, α and β on a 3-D aircraft you can turn
 *   stab-weight-balance  a weight-and-balance loader with its CG envelope and fuel burn
 *   stab-pitch           pitching-moment lines for any CG, tail and elevator; neutral point, trim, and a model pivoted at its CG in a tunnel
 *   stab-phugoid         the point-mass longitudinal equations integrated in time, against Lanchester's period
 *   stab-short-period    angle of attack and pitch rate after an elevator input; relaxed stability and pitch augmentation
 *   stab-lateral         a four-state lateral model: Dutch roll, spiral and roll modes, with dihedral and fin size
 *   stab-adverse-yaw     an aileron roll with plain, differential or Frise ailerons or spoilers, and the slip ball
 * The aircraft is a generic four-seat light aircraft (about 1100 kg, 16.2 m² of wing); its figures are typical, not those of any type.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI, G = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fx = (x, n) => (Number.isFinite(x) ? x.toFixed(n) : '—');
  const sgn = (x, n) => (Number.isFinite(x) ? (x < 0 ? '−' : '+') + Math.abs(x).toFixed(n) : '—');
  const LN2 = Math.log(2);

  function under(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  function skyFill(c, C, W, H) {
    const g = c.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, C.dark ? 'hsl(210 45% 16%)' : 'hsl(205 70% 90%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 10%)' : 'hsl(205 60% 97%)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
  }
  // an arc arrow about (cx, cy) from angle a0 to a1 (canvas angles, radians)
  function arcArrow(c, cx, cy, R, a0, a1, color, w) {
    c.save(); c.strokeStyle = c.fillStyle = color; c.lineWidth = w || 2.2;
    c.beginPath(); c.arc(cx, cy, R, a0, a1, a1 < a0); c.stroke();
    const dir = a1 > a0 ? 1 : -1, ex = cx + R * Math.cos(a1), ey = cy + R * Math.sin(a1);
    const tx = -Math.sin(a1) * dir, ty = Math.cos(a1) * dir, h = 9;
    c.beginPath(); c.moveTo(ex + tx * 2, ey + ty * 2);
    c.lineTo(ex - tx * h + ty * h * 0.5, ey - ty * h - tx * h * 0.5); c.lineTo(ex - tx * h - ty * h * 0.5, ey - ty * h + tx * h * 0.5);
    c.closePath(); c.fill(); c.restore();
  }

  /* ---------------------------------------------------------------- a light aircraft seen from its left side
     nose to the right, wing chord 52 units (leading edge at x = 52, trailing edge at 0); the point
     x = o.cg (local units) is placed at (cx, cy) and the drawing is pitched nose-up by `pitch` (rad) */
  function sideCraft(c, C, cx, cy, k, pitch, o) {
    o = o || {};
    c.save(); c.translate(cx, cy); c.rotate(-pitch); c.scale(k, k); c.translate(-(o.cg || 0), 0);
    c.lineJoin = 'round'; c.lineWidth = 1.6 / k; c.strokeStyle = C.text; c.fillStyle = C.surface;
    c.beginPath(); c.moveTo(112, 2); c.bezierCurveTo(110, -9, 80, -15, 40, -16); c.bezierCurveTo(10, -17, -40, -10, -100, -5);
    c.lineTo(-124, -4); c.lineTo(-124, 3); c.bezierCurveTo(-60, 8, 40, 14, 112, 2); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = C.bg2; c.beginPath(); c.moveTo(66, -12); c.lineTo(32, -15); c.lineTo(32, -6); c.lineTo(72, -6); c.closePath(); c.fill();
    c.fillStyle = C.surface; c.beginPath(); c.moveTo(-92, -6); c.lineTo(-114, -42); c.lineTo(-127, -42); c.lineTo(-124, -4); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = C.accent;
    c.beginPath(); c.ellipse(-108, -1, 13, 2.6, 0, 0, Math.PI * 2); c.fill();
    c.save(); c.translate(-120, -1); c.rotate(-(o.elev || 0)); c.fillRect(-11, -1.5, 11, 3); c.restore();
    c.beginPath(); c.ellipse(26, 5, 26, 3.6, 0, 0, Math.PI * 2); c.fill();
    c.strokeStyle = C.muted; c.lineWidth = 2 / k; c.beginPath(); c.moveTo(114, -20); c.lineTo(114, 22); c.stroke();
    c.restore();
  }
  function sidePt(cx, cy, k, pitch, cg, x, y) {
    const X = (x - cg) * k, Y = y * k, cs = Math.cos(pitch), sn = Math.sin(pitch);
    return [cx + X * cs + Y * sn, cy - X * sn + Y * cs];
  }

  /* ---------------------------------------------------------------- lateral model (stability axes, level flight)
     state [β, p, r, φ] (+ ψ); derivatives in the style of a four-seat light aircraft; dihedral and fin size scale them */
  const LAT = { m: 1100, S: 16.2, b: 11.0, Ixx: 1285, Izz: 2667, rho: 1.225 };
  function latModel(o) {
    const V = o.V, f = o.fin, gam = o.gam * D2R, m = LAT.m, S = LAT.S, b = LAT.b;
    const Q = 0.5 * LAT.rho * V * V, CL = m * G / (Q * S), b2V = b / (2 * V), QSb = Q * S * b;
    const c = {
      CL, Clb: -0.030 - 0.012 * f - 0.96 * gam, Cnb: -0.050 + 0.115 * f,
      Cnr: -0.010 - 0.089 * f - (o.yd ? 0.25 : 0), Clr: CL / 4 + 0.006 * f, Cnp: -CL / 8, Clp: -0.47, Cyb: -0.10 - 0.21 * f,
      Clda: o.Clda != null ? o.Clda : 0.17, Cnda: o.Cnda != null ? o.Cnda : -0.03,
      Cndr: 0.075 * f, Cydr: -0.14 * f, Cldr: -0.006 * f            // rudder: positive = nose right
    };
    const A = [
      [Q * S * c.Cyb / (m * V), 0, -1, G / V],
      [QSb * c.Clb / LAT.Ixx, QSb * c.Clp * b2V / LAT.Ixx, QSb * c.Clr * b2V / LAT.Ixx, 0],
      [QSb * c.Cnb / LAT.Izz, QSb * c.Cnp * b2V / LAT.Izz, QSb * c.Cnr * b2V / LAT.Izz, 0],
      [0, 1, 0, 0]];
    const Ba = [0, QSb * c.Clda / LAT.Ixx, QSb * c.Cnda / LAT.Izz, 0];
    const Br = [Q * S * c.Cydr / (m * V), QSb * c.Cldr / LAT.Ixx, QSb * c.Cndr / LAT.Izz, 0];
    return { A, Ba, Br, c, Q, V, QSb };
  }
  function latDeriv(M, s, da, dr) {
    const d = [0, 0, 0, 0, s[2]];
    for (let i = 0; i < 4; i++) { let v = M.Ba[i] * da + M.Br[i] * dr; for (let j = 0; j < 4; j++) v += M.A[i][j] * s[j]; d[i] = v; }
    return d;
  }
  function rk4(fn, s, h) {
    const add = (a, b, k) => a.map((v, i) => v + k * b[i]);
    const k1 = fn(s), k2 = fn(add(s, k1, h / 2)), k3 = fn(add(s, k2, h / 2)), k4 = fn(add(s, k3, h));
    return s.map((v, i) => v + h / 6 * (k1[i] + 2 * k2[i] + 2 * k3[i] + k4[i]));
  }
  /* eigenvalues of a small real matrix: characteristic polynomial (Faddeev–LeVerrier), roots by Durand–Kerner */
  function eig(A) {
    const n = A.length;
    const mul = (X, Y) => X.map((row, i) => Y[0].map((_, j) => { let s = 0; for (let k = 0; k < n; k++) s += X[i][k] * Y[k][j]; return s; }));
    const c = new Array(n + 1).fill(0); c[n] = 1;
    let M = A.map(r => r.map(() => 0));
    for (let k = 1; k <= n; k++) {
      M = mul(A, M).map((r, i) => r.map((v, j) => v + (i === j ? c[n - k + 1] : 0)));
      const AM = mul(A, M); let tr = 0; for (let i = 0; i < n; i++) tr += AM[i][i];
      c[n - k] = -tr / k;
    }
    const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
    const cd = (a, b) => { const d = b[0] * b[0] + b[1] * b[1] || 1e-300; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
    const ev = x => { let p = [1, 0]; for (let k = n - 1; k >= 0; k--) { p = cm(p, x); p[0] += c[k]; } return p; };
    let scale = 1; for (let k = 0; k < n; k++) scale = Math.max(scale, Math.pow(Math.abs(c[k]), 1 / (n - k)));
    const z = []; for (let i = 0; i < n; i++) z.push([scale * 0.9 * Math.cos(0.4 + 2 * Math.PI * i / n), scale * 0.9 * Math.sin(0.4 + 2 * Math.PI * i / n)]);
    for (let it = 0; it < 400; it++) {
      let moved = 0;
      for (let i = 0; i < n; i++) {
        let d = [1, 0];
        for (let j = 0; j < n; j++) if (j !== i) d = cm(d, [z[i][0] - z[j][0], z[i][1] - z[j][1]]);
        const w = cd(ev(z[i]), d);
        if (!Number.isFinite(w[0]) || !Number.isFinite(w[1])) continue;
        z[i] = [z[i][0] - w[0], z[i][1] - w[1]]; moved += Math.abs(w[0]) + Math.abs(w[1]);
      }
      if (moved < 1e-12 * scale) break;
    }
    return z.map(p => [p[0], Math.abs(p[1]) < 1e-7 * scale ? 0 : p[1]]);
  }
  function latModes(roots) {
    const ok = roots.every(z => Number.isFinite(z[0]) && Number.isFinite(z[1]));
    const out = { dutch: null, roll: null, spiral: null, extra: null, ok };
    if (!ok) return out;
    const osc = roots.filter(z => z[1] > 0).sort((a, b) => b[1] - a[1]);
    const real = roots.filter(z => z[1] === 0).map(z => z[0]).sort((a, b) => a - b);
    if (osc.length) out.dutch = osc[0];
    if (osc.length > 1) out.extra = osc[1];
    if (real.length) out.roll = real[0];
    if (real.length > 1) out.spiral = real[real.length - 1];
    return out;
  }
  const modeText = z => {
    if (!z) return '—';
    const wn = Math.hypot(z[0], z[1]), zeta = -z[0] / (wn || 1), T = 2 * Math.PI / z[1];
    return 'period ' + fx(T, 2) + ' s, ζ = ' + fx(zeta, 2) + (z[0] > 0 ? ' — growing' : '');
  };
  const slowText = l => (l == null ? '—' : Math.abs(l) < 2e-3 ? 'neutral (λ ≈ 0)' : l < 0 ? 'stable: halves in ' + fx(LN2 / -l, 0) + ' s' : 'unstable: doubles in ' + fx(LN2 / l, 0) + ' s');

  // plan view (nose up the screen) and rear view of the light aircraft
  function topCraft(c, C, x, y, k, psi) {
    c.save(); c.translate(x, y); c.rotate(psi); c.scale(k, k);
    c.lineJoin = 'round'; c.lineWidth = 1.5 / k; c.strokeStyle = C.text;
    c.fillStyle = C.accent; c.beginPath(); c.moveTo(-70, -2); c.lineTo(70, -2); c.lineTo(66, 14); c.lineTo(-66, 14); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-24, 48); c.lineTo(24, 48); c.lineTo(22, 58); c.lineTo(-22, 58); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = C.surface; c.beginPath(); c.moveTo(0, -46); c.bezierCurveTo(9, -40, 9, -10, 7, 10); c.lineTo(3, 60); c.lineTo(-3, 60); c.lineTo(-7, 10); c.bezierCurveTo(-9, -10, -9, -40, 0, -46); c.closePath(); c.fill(); c.stroke();
    c.restore();
  }
  function rearCraft(c, C, x, y, k, phi, gam, fin, ail) {
    c.save(); c.translate(x, y); c.rotate(phi); c.scale(k, k);
    c.lineJoin = 'round'; c.lineWidth = 1.5 / k; c.strokeStyle = C.text;
    const t = Math.tan(gam), span = 72;
    c.fillStyle = C.accent;
    c.beginPath(); c.moveTo(0, 3); c.lineTo(span, 3 - span * t); c.lineTo(span, -1 - span * t); c.lineTo(0, -1); c.lineTo(-span, -1 - span * t); c.lineTo(-span, 3 - span * t); c.closePath(); c.fill(); c.stroke();
    if (ail) {  // ailerons (or spoiler) drawn as small tabs near the tips: ail.l, ail.r in radians, positive = trailing edge down
      for (const [side, a] of [[1, ail.r], [-1, ail.l]]) {
        const ex = side * span * 0.8, ey = 1 - span * 0.8 * t;
        c.save(); c.translate(ex, ey); c.fillStyle = C.warn; c.fillRect(-9, a > 0 ? 0 : -Math.min(9, Math.abs(a) * 40), 18, Math.min(9, Math.abs(a) * 40) || 1); c.restore();
      }
      if (ail.spoiler) { const s = ail.spoiler, ex = Math.sign(s) * span * 0.45, ey = -1 - span * 0.45 * t; c.save(); c.fillStyle = C.warn; c.fillRect(ex - 7, ey - 9 * Math.min(1, Math.abs(s) * 4), 14, 9 * Math.min(1, Math.abs(s) * 4)); c.restore(); }
    }
    c.fillStyle = C.surface;
    c.beginPath(); c.moveTo(-24, -12); c.lineTo(24, -12); c.lineTo(24, -9); c.lineTo(-24, -9); c.closePath(); c.fill(); c.stroke();       // tailplane
    const fh = 22 + 14 * Math.sqrt(Math.max(0.1, fin));
    c.beginPath(); c.moveTo(-2.5, -10); c.lineTo(-1.5, -10 - fh); c.lineTo(1.5, -10 - fh); c.lineTo(2.5, -10); c.closePath(); c.fill(); c.stroke();  // fin
    c.beginPath(); c.arc(0, 0, 11, 0, Math.PI * 2); c.fill(); c.stroke();                                                               // fuselage
    c.restore();
  }

  /* ================================================================ stab-axes */
  Hyper.sim('stab-axes', {
    title: 'Axes, attitude and the relative wind',
    blurb: `A light aircraft you can turn with the three Euler angles — heading ψ, pitch θ and bank φ, applied in that order — while α and β set how the air meets it. The coloured arrows are the body axes (x out of the nose, y out of the right wing, z down through the floor); the green arrow is the flight path and the dashed one the relative wind. The ground grid lies 5 m below, with the aircraft's shadow. Drag the picture to look from another side.

**Try this**
- Set θ = 10° and α = 10° with the wings level: the nose is up but the flight path is level (γ = 0). Now make α = 4°: the aircraft climbs at 6°.
- Bank 60°, then change θ: the pitch rotation always turns about the aircraft's own y axis after the heading, so the attitude is not what "nose up" suggests.
- Add sideslip: the flight path leaves the plane of symmetry, and the track differs from the heading.
- Push θ to 90°: heading and bank now turn the aircraft about the same axis — gimbal lock.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 280 });
      const presets = { level: { psi: 0, theta: 3, phi: 0, alpha: 3, beta: 0 }, climb: { psi: 40, theta: 12, phi: 30, alpha: 6, beta: 0 }, slip: { psi: 20, theta: 2, phi: -12, alpha: 5, beta: -10 } };
      const ctl = kit.controls(box.side, [
        { id: 'psi', label: 'Heading ψ', min: -180, max: 180, step: 1, value: 30, unit: '°' },
        { id: 'theta', label: 'Pitch attitude θ', min: -90, max: 90, step: 1, value: 10, unit: '°' },
        { id: 'phi', label: 'Bank φ', min: -180, max: 180, step: 1, value: 20, unit: '°' },
        { id: 'alpha', label: 'Angle of attack α', min: -10, max: 30, step: 0.5, value: 5, unit: '°' },
        { id: 'beta', label: 'Sideslip β', min: -20, max: 20, step: 0.5, value: 0, unit: '°' },
        { id: 'show', type: 'select', label: 'Show', options: [['Axes, flight path and wind', 'all'], ['Body axes only', 'axes'], ['Aircraft only', 'none']], value: 'all' },
        { type: 'buttons', items: [{ id: 'level', label: 'Level' }, { id: 'climb', label: 'Climbing turn' }, { id: 'slip', label: 'Sideslip' }] }
      ], (id) => { const p = presets[id]; if (p) for (const k in p) ctl.set(k, p[k]); loop.once(); });
      const ro = kit.readout(box.side, [['att', 'Heading, pitch, bank'], ['uvw', 'u, v, w at 60 m/s'], ['gam', 'Flight-path angle γ'], ['diff', 'θ − α'], ['trk', 'Track of the flight path'], ['note', '']]);
      const V = ctl.values, view = { az: 125 * D2R, el: 24 * D2R };
      kit.drag(st, {
        hit: p => ({ x: p.x, y: p.y, az: view.az, el: view.el }),
        move: (t, p) => { view.az = t.az - (p.x - t.x) * 0.012; view.el = clamp(t.el + (p.y - t.y) * 0.012, -1.3, 1.45); loop.once(); }
      });
      // the aircraft in body axes (x forward, y right, z down), metres
      const dz = y => -Math.abs(y) * Math.tan(4 * D2R);
      const parts = [
        { kind: 'wing', n: [0, 0, -1], pts: [[1.2, 0], [0.95, 5.5], [-0.25, 5.5], [-0.55, 0], [-0.25, -5.5], [0.95, -5.5]].map(([x, y]) => [x, y, 0.2 + dz(y)]) },
        { kind: 'wing', n: [0, 0, -1], pts: [[-3.8, 0], [-4.0, 1.9], [-4.7, 1.9], [-4.9, 0], [-4.7, -1.9], [-4.0, -1.9]].map(([x, y]) => [x, y, -0.25]) },
        { kind: 'fin', n: [0, 1, 0], pts: [[-3.7, 0, -0.35], [-4.7, 0, -1.9], [-5.2, 0, -1.9], [-5.1, 0, -0.3]] },
        { kind: 'body', n: [0, 1, 0], pts: [[4.1, 0, 0.1], [3.2, 0, -0.45], [1.6, 0, -0.95], [-0.4, 0, -0.9], [-5.1, 0, -0.35], [-5.1, 0, -0.1], [-1.5, 0, 0.45], [2.5, 0, 0.55], [3.9, 0, 0.35]] },
        { kind: 'body', n: [0, 0, -1], pts: [[4.1, 0, 0], [3.0, 0.55, 0], [-0.5, 0.6, 0], [-5.1, 0.15, 0], [-5.1, -0.15, 0], [-0.5, -0.6, 0], [3.0, -0.55, 0]] }
      ];
      const GROUND = 5.5;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const ps = V.psi * D2R, th = V.theta * D2R, ph = V.phi * D2R, al = V.alpha * D2R, be = V.beta * D2R;
        const cps = Math.cos(ps), sps = Math.sin(ps), cth = Math.cos(th), sth = Math.sin(th), cph = Math.cos(ph), sph = Math.sin(ph);
        const R = [[cps * cth, cps * sth * sph - sps * cph, cps * sth * cph + sps * sph],
                   [sps * cth, sps * sth * sph + cps * cph, sps * sth * cph - cps * sph],
                   [-sth, cth * sph, cth * cph]];
        const toE = p => [R[0][0] * p[0] + R[0][1] * p[1] + R[0][2] * p[2], R[1][0] * p[0] + R[1][1] * p[1] + R[1][2] * p[2], R[2][0] * p[0] + R[2][1] * p[1] + R[2][2] * p[2]];
        // camera looking at the CG from azimuth az (from north, towards east) and elevation el
        const ca = Math.cos(view.az), sa = Math.sin(view.az), ce = Math.cos(view.el), se = Math.sin(view.el);
        const f = [-ce * ca, -ce * sa, se];
        let u = [f[2] * f[0], f[2] * f[1], -1 + f[2] * f[2]];
        const ul = Math.hypot(u[0], u[1], u[2]) || 1; u = u.map(v => v / ul);
        const r = [f[1] * u[2] - f[2] * u[1], f[2] * u[0] - f[0] * u[2], f[0] * u[1] - f[1] * u[0]];
        const sc = Math.min(W, H * 1.7) / 29, cx = W * 0.5, cy = H * 0.44;
        const P = (p, ox, oy, s) => {
          const d = p[0] * f[0] + p[1] * f[1] + p[2] * f[2], k = 40 / Math.max(8, 40 + d);
          return [ox + s * k * (p[0] * r[0] + p[1] * r[1] + p[2] * r[2]), oy - s * k * (p[0] * u[0] + p[1] * u[1] + p[2] * u[2]), d];
        };
        const Pm = p => P(p, cx, cy, sc);
        // ground grid and shadow
        c.save(); c.globalAlpha = 0.55; c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let g = -18; g <= 18; g += 3) {
          let a = Pm([g, -18, GROUND]), b = Pm([g, 18, GROUND]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
          a = Pm([-18, g, GROUND]); b = Pm([18, g, GROUND]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
        }
        c.globalAlpha = 0.28; c.fillStyle = C.muted;
        for (const pt of parts) {
          c.beginPath();
          pt.pts.forEach((p, i) => { const e = toE(p); const q = Pm([e[0], e[1], GROUND]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
          c.closePath(); c.fill();
        }
        c.restore();
        const nPt = Pm([18, 0, GROUND]);
        kit.label(c, 'N', nPt[0], nPt[1], { color: C.muted, size: 12, weight: 700, align: 'center' });
        // the aircraft, far parts first
        const drawn = parts.map(pt => {
          const q = pt.pts.map(p => Pm(toE(p)));
          const depth = q.reduce((s, v) => s + v[2], 0) / q.length;
          const nE = toE(pt.n), facing = nE[0] * f[0] + nE[1] * f[1] + nE[2] * f[2] < 0;
          return { pt, q, depth, facing };
        }).sort((a, b) => b.depth - a.depth);
        for (const d of drawn) {
          c.beginPath(); d.q.forEach((v, i) => (i ? c.lineTo(v[0], v[1]) : c.moveTo(v[0], v[1]))); c.closePath();
          c.save();
          if (d.pt.kind === 'wing') { c.globalAlpha = 0.88; c.fillStyle = d.facing ? C.accent : C.warn; }
          else { c.globalAlpha = 0.92; c.fillStyle = C.surface; }
          c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke(); c.restore();
        }
        const O = Pm([0, 0, 0]);
        if (V.show !== 'none') {
          const axes = [[[7, 0, 0], C.series[0], 'x (roll)'], [[0, 6.5, 0], C.series[1], 'y (pitch)'], [[0, 0, 4], C.series[2], 'z (yaw)']];
          for (const [v, col, lab] of axes) {
            const e = Pm(toE(v));
            kit.arrow(c, O[0], O[1], e[0], e[1], col, 2.4);
            kit.label(c, lab, e[0] + 6, e[1] - 8, { color: col, size: 12, weight: 700 });
          }
        }
        const vb = [Math.cos(al) * Math.cos(be), Math.sin(be), Math.sin(al) * Math.cos(be)], vE = toE(vb);
        if (V.show === 'all') {
          const e = Pm(vE.map(x => 8.5 * x));
          kit.arrow(c, O[0], O[1], e[0], e[1], C.ok, 3);
          kit.label(c, 'flight path', e[0] + 6, e[1] + 10, { color: C.ok, size: 12, weight: 700 });
          const w0 = Pm(vE.map(x => 14 * x)), w1 = Pm(vE.map(x => 10.2 * x));
          c.save(); c.setLineDash([5, 4]); kit.arrow(c, w0[0], w0[1], w1[0], w1[1], C.muted, 1.8); c.restore();
          kit.label(c, 'relative wind', w0[0], w0[1] - 10, { color: C.muted, size: 11.5, align: 'center' });
          // α in the plane of symmetry, β out of it
          const arc = (fnPt, n, lab) => {
            c.beginPath();
            for (let i = 0; i <= n; i++) { const q = Pm(toE(fnPt(i / n))); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }
            c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
            const m = Pm(toE(fnPt(0.5).map(x => x * 1.18)));
            kit.label(c, lab, m[0], m[1], { color: C.text, size: 12.5, weight: 700, align: 'center' });
          };
          if (Math.abs(V.alpha) > 0.4) arc(s => [4.2 * Math.cos(s * al), 0, 4.2 * Math.sin(s * al)], 16, 'α');
          if (Math.abs(V.beta) > 0.4) arc(s => { const a = [Math.cos(al), 0, Math.sin(al)], k1 = Math.cos(s * be), k2 = Math.sin(s * be); return [4.2 * (k1 * a[0]), 4.2 * k2, 4.2 * (k1 * a[2])]; }, 16, 'β');
        }
        // an Earth triad in the corner
        const ox = 44, oy = H - 34;
        for (const [v, lab] of [[[1, 0, 0], 'N'], [[0, 1, 0], 'E'], [[0, 0, 1], 'down']]) {
          const e = P(v, ox, oy, 24);
          kit.arrow(c, ox, oy, e[0], e[1], C.muted, 1.6);
          kit.label(c, lab, e[0] + (e[0] >= ox ? 4 : -4), e[1] - 6, { color: C.muted, size: 11, align: e[0] >= ox ? 'left' : 'right' });
        }
        kit.label(c, 'drag to turn the view', W - 10, H - 12, { color: C.faint, size: 11, align: 'right' });
        // read-outs
        const gam = Math.asin(clamp(-vE[2], -1, 1)) * R2D, trk = ((Math.atan2(vE[1], vE[0]) * R2D) + 360) % 360;
        ro.set('att', V.psi.toFixed(0) + '°, ' + V.theta.toFixed(0) + '°, ' + V.phi.toFixed(0) + '°');
        ro.set('uvw', (60 * vb[0]).toFixed(1) + ', ' + (60 * vb[1]).toFixed(1) + ', ' + (60 * vb[2]).toFixed(1) + ' m/s');
        ro.set('gam', sgn(gam, 1) + '° (' + (gam >= 0 ? 'climbing' : 'descending') + ')');
        ro.set('diff', sgn(V.theta - V.alpha, 1) + '°');
        ro.set('trk', ('00' + trk.toFixed(0)).slice(-3) + '°' + (Math.abs(V.beta) > 0.4 || Math.abs(V.phi) > 0.4 ? '' : ' (along the heading)'));
        ro.set('note', Math.abs(V.theta) >= 89 ? 'Gimbal lock: heading and bank now turn the aircraft about the same axis'
          : Math.abs(V.phi) < 0.5 && Math.abs(V.beta) < 0.5 ? 'Wings level, no sideslip: γ = θ − α exactly'
          : 'With bank or sideslip, γ is no longer θ − α');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ stab-weight-balance */
  Hyper.sim('stab-weight-balance', {
    title: 'Weight and balance',
    blurb: `Load a generic four-seat trainer and watch its centre of gravity. Each item's moment is its mass times its arm from the datum (the firewall); the CG is the total moment over the total mass. The envelope on the graph is the certified region of mass and CG; the dashed line shows where the CG goes as the fuel burns. The gauge under the aircraft shows the CG in per cent of the mean aerodynamic chord, with the neutral point where stability would vanish. (Illustrative figures, not those of any real aircraft.)

**Try this**
- Load the default and press **Fly**: the fuel sits just behind the CG, so burning it moves the CG slightly forward.
- Press **Tail-heavy loading**: two heavy rear passengers, full baggage and little fuel put the CG behind the aft limit although the mass is well under the maximum.
- Fill everything to the maximum: the aircraft is overweight — which item would you leave behind to fix both mass and balance?
- Watch the static margin shrink as the CG moves aft towards the neutral point.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = under(box);
      const def = { front: 160, rear: 80, bag: 20, fuel: 150 };
      const ctl = kit.controls(box.side, [
        { id: 'front', label: 'Pilot and front passenger', min: 0, max: 200, step: 5, value: def.front, unit: 'kg' },
        { id: 'rear', label: 'Rear passengers', min: 0, max: 200, step: 5, value: def.rear, unit: 'kg' },
        { id: 'bag', label: 'Baggage', min: 0, max: 50, step: 1, value: def.bag, unit: 'kg' },
        { id: 'fuel', label: 'Fuel', min: 0, max: 150, step: 1, value: def.fuel, unit: 'L' },
        { type: 'buttons', items: [{ id: 'fly', label: 'Fly: burn fuel to 20 L', primary: true }, { id: 'aft', label: 'Tail-heavy loading' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'fly') { flying = true; return; }
        flying = false;
        if (id === 'aft') { ctl.set('front', 70); ctl.set('rear', 200); ctl.set('bag', 50); ctl.set('fuel', 30); }
        if (id === 'reset') for (const k in def) ctl.set(k, def[k]);
        update();
      });
      const ro = kit.readout(box.side, [['m', 'Total mass'], ['cg', 'CG aft of datum'], ['mac', 'CG in per cent MAC'], ['sm', 'Static margin'], ['zf', 'CG with no fuel'], ['st', 'Status']]);
      const tbl = kit.table(box.side, [
        { label: 'Item', key: 'item', align: 'left' },
        { label: 'kg', key: 'm', fmt: v => v.toFixed(0) },
        { label: 'arm m', key: 'x', fmt: v => v.toFixed(2) },
        { label: 'kg·m', key: 'mo', fmt: v => v.toFixed(0) }]);
      const plot = kit.plot(gb, { x: { label: 'CG aft of datum (m)', min: 2.02, max: 2.52, name: 'CG' }, y: { label: 'mass (kg)', min: 700, max: 1220 }, fmtY: v => v.toFixed(0) + ' kg' }, 210);
      const V = ctl.values;
      const EMPTY = { m: 760, x: 2.20 }, ARM = { front: 2.10, rear: 3.00, bag: 3.60, fuel: 2.45 }, KGL = 0.72;
      const MTOM = 1150, LE = 1.95, MAC = 1.50, HN = 0.415, AFT = 2.40;
      const fwd = m => (m <= 900 ? 2.10 : 2.10 + (m - 900) / 250 * 0.12);
      const env = [[2.10, 700], [2.10, 900], [2.22, MTOM], [AFT, MTOM], [AFT, 700], [2.10, 700]];
      let flying = false, S = null;
      function load(fuelL) {
        const items = [
          { item: 'Empty aircraft', m: EMPTY.m, x: EMPTY.x },
          { item: 'Front seats', m: V.front, x: ARM.front },
          { item: 'Rear seats', m: V.rear, x: ARM.rear },
          { item: 'Fuel ' + fuelL.toFixed(0) + ' L', m: fuelL * KGL, x: ARM.fuel },
          { item: 'Baggage', m: V.bag, x: ARM.bag }];
        let m = 0, mo = 0;
        for (const it of items) { it.mo = it.m * it.x; m += it.m; mo += it.mo; }
        return { items, m, mo, cg: mo / m };
      }
      const inside = (m, cg) => m <= MTOM + 1e-9 && cg >= fwd(m) - 1e-9 && cg <= AFT + 1e-9;
      function update() {
        S = load(V.fuel);
        const zf = load(0), h = (S.cg - LE) / MAC;
        const tot = { item: 'Total', m: S.m, x: S.cg, mo: S.mo, _cls: 'hl' };
        tbl.set(S.items.concat([tot]));
        ro.set('m', S.m.toFixed(0) + ' kg (' + (S.m / 0.45359237).toFixed(0) + ' lb)' + (S.m > MTOM ? ' — over ' + MTOM + ' kg' : ''));
        ro.set('cg', S.cg.toFixed(3) + ' m (limits ' + fwd(Math.min(S.m, MTOM)).toFixed(2) + '–' + AFT.toFixed(2) + ' m)');
        ro.set('mac', (100 * h).toFixed(1) + ' %');
        ro.set('sm', (100 * (HN - h)).toFixed(1) + ' % MAC (neutral point at ' + (100 * HN).toFixed(1) + ' %)');
        ro.set('zf', zf.cg.toFixed(3) + ' m' + (inside(zf.m, zf.cg) ? ' — inside' : ' — outside the envelope'));
        const msg = S.m > MTOM ? 'Overweight by ' + (S.m - MTOM).toFixed(0) + ' kg'
          : S.cg < fwd(S.m) ? 'CG ahead of the forward limit' : S.cg > AFT ? 'CG behind the aft limit' : 'Inside the envelope';
        ro.set('st', msg);
        const burn = []; for (let fl = V.fuel; fl >= -1e-9; fl -= Math.max(1, V.fuel / 12)) { const s = load(Math.max(0, fl)); burn.push([s.cg, s.m]); }
        burn.push([zf.cg, zf.m]);
        const C = kit.colors();
        plot.set({ series: [
          { pts: env, label: 'certified envelope', color: C.ok, fill: false },
          { pts: burn, label: 'as the fuel burns', dash: [5, 4], color: C.muted }
        ], marks: [{ x: S.cg, y: S.m, label: 'now', color: inside(S.m, S.cg) ? C.accent : C.bad }, { x: zf.cg, y: zf.m, label: 'no fuel', color: C.muted, r: 4 }],
          hlines: [{ y: MTOM, label: 'maximum mass' }] });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        if (flying && dt > 0) {
          const nf = Math.max(20, V.fuel - 25 * dt);
          ctl.set('fuel', Math.round(nf * 10) / 10);
          if (nf <= 20) flying = false;
          update();
          return;
        }
        if (!S) S = load(V.fuel);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const pxm = W * 0.86 / 8.7, X = x => W * 0.07 + (x + 1.3) * pxm, yG = H * 0.6, Z = z => yG - (z + 0.95) * pxm;
        const ok = inside(S.m, S.cg);
        // ground, datum
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, yG); c.lineTo(W, yG); c.stroke();
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(0), Z(1.5)); c.lineTo(X(0), yG); c.stroke(); c.restore();
        kit.label(c, 'datum', X(0), Z(1.5) - 8, { color: C.muted, size: 11, align: 'center' });
        // fuselage, fin, wing, tailplane, wheels (metres: x aft of datum, z up)
        const fus = [[-1.15, 0.05], [-0.9, 0.35], [0.2, 0.55], [1.2, 1.05], [2.9, 1.05], [4.0, 0.72], [6.6, 0.47], [7.0, 0.44], [7.0, 0.16], [4.0, 0.05], [2.0, -0.35], [0.2, -0.35], [-0.9, -0.2]];
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); fus.forEach((p, i) => (i ? c.lineTo(X(p[0]), Z(p[1])) : c.moveTo(X(p[0]), Z(p[1])))); c.closePath(); c.fill(); c.stroke();
        c.beginPath(); [[5.9, 0.47], [6.7, 1.55], [7.2, 1.55], [7.1, 0.44]].forEach((p, i) => (i ? c.lineTo(X(p[0]), Z(p[1])) : c.moveTo(X(p[0]), Z(p[1])))); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.accent;
        c.beginPath(); c.ellipse(X(LE + MAC / 2), Z(-0.28), MAC / 2 * pxm, 0.09 * pxm, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.ellipse(X(6.7), Z(0.47), 0.4 * pxm, 0.05 * pxm, 0, 0, Math.PI * 2); c.fill();
        c.fillStyle = C.text;
        for (const wx of [-0.5, 2.7]) { c.beginPath(); c.arc(X(wx), yG - 0.2 * pxm, 0.2 * pxm, 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(X(-1.2), Z(-0.55)); c.lineTo(X(-1.2), Z(0.65)); c.stroke();
        // fuel in the wing
        const ff = V.fuel / 150;
        c.fillStyle = C.warn; c.globalAlpha = 0.8; c.fillRect(X(ARM.fuel) - ff * 0.5 * pxm, Z(-0.28) - 0.05 * pxm, ff * pxm, 0.1 * pxm); c.globalAlpha = 1;
        // the loads
        for (const [k, lab] of [['front', 'front'], ['rear', 'rear'], ['bag', 'bags']]) {
          const mkg = V[k], s = 5 + 20 * Math.sqrt(mkg / 200), x = X(ARM[k]), y = Z(0.35);
          c.fillStyle = C.series[1]; c.globalAlpha = mkg > 0 ? 0.85 : 0.2; c.fillRect(x - s / 2, y - s / 2, s, s); c.globalAlpha = 1;
          kit.label(c, lab + ' ' + mkg.toFixed(0) + ' kg', x, Z(1.05) - (k === 'bag' ? -18 : 12), { color: C.text, size: 11, align: 'center', weight: 600 });
        }
        kit.label(c, 'fuel ' + (V.fuel * KGL).toFixed(0) + ' kg', X(ARM.fuel), Z(-0.28) + 16, { color: C.warn, size: 11, align: 'center', weight: 600 });
        // the CG and the weight
        const gx = X(S.cg), gy = Z(0.2), col = ok ? C.ok : C.bad;
        kit.arrow(c, gx, gy, gx, gy + 0.9 * pxm, col, 3);
        c.fillStyle = C.surface; c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, 9, 0, Math.PI * 2); c.fill(); c.stroke();
        c.fillStyle = col; c.beginPath(); c.moveTo(gx, gy); c.arc(gx, gy, 9, 0, Math.PI / 2); c.closePath(); c.fill();
        c.beginPath(); c.moveTo(gx, gy); c.arc(gx, gy, 9, Math.PI, 1.5 * Math.PI); c.closePath(); c.fill();
        kit.label(c, 'CG', gx + 12, gy - 10, { color: col, size: 12, weight: 700 });
        // the %MAC gauge
        const gx0 = W * 0.08, gx1 = W * 0.92, gy1 = yG + (H - yG) * 0.5, x0m = 2.0, x1m = 2.7;
        const Gx = x => gx0 + (x - x0m) / (x1m - x0m) * (gx1 - gx0);
        c.fillStyle = C.bg2; c.fillRect(gx0, gy1 - 8, gx1 - gx0, 16);
        c.fillStyle = C.ok; c.globalAlpha = 0.3; c.fillRect(Gx(fwd(Math.min(S.m, MTOM))), gy1 - 8, Gx(AFT) - Gx(fwd(Math.min(S.m, MTOM))), 16); c.globalAlpha = 1;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx0, gy1 - 8, gx1 - gx0, 16);
        for (let pc = 5; pc <= 45; pc += 5) {
          const x = Gx(LE + pc / 100 * MAC);
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x, gy1 + 8); c.lineTo(x, gy1 + 13); c.stroke();
          if (pc % 10 === 0) kit.label(c, pc + ' %', x, gy1 + 22, { color: C.muted, size: 10.5, align: 'center' });
        }
        kit.label(c, '% MAC', gx1, gy1 + 22, { color: C.muted, size: 10.5, align: 'right' });
        const np = Gx(LE + HN * MAC);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(np, gy1 - 13); c.lineTo(np, gy1 + 13); c.stroke();
        kit.label(c, 'neutral point', np, gy1 - 20, { color: C.warn, size: 11, align: 'center', weight: 600 });
        const cgx = clamp(Gx(S.cg), gx0, gx1);
        c.fillStyle = col; c.beginPath(); c.moveTo(cgx, gy1 + 7); c.lineTo(cgx - 7, gy1 - 9); c.lineTo(cgx + 7, gy1 - 9); c.closePath(); c.fill();
        kit.label(c, 'CG ' + (100 * (S.cg - LE) / MAC).toFixed(1) + ' %', cgx, gy1 - 20, { color: col, size: 11.5, align: 'center', weight: 700 });
        kit.label(c, ok ? 'within limits' : S.m > MTOM ? 'OVERWEIGHT' : 'CG OUT OF LIMITS', W - 12, 16, { color: ok ? C.ok : C.bad, size: 13, weight: 700, align: 'right' });
        if (flying) kit.label(c, 'flying — burning fuel', 12, 16, { color: C.muted, size: 12 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ stab-pitch */
  Hyper.sim('stab-pitch', {
    title: 'Pitch stability: CG, tail and trim',
    blurb: `The pitching-moment coefficient about the CG, $C_m$, against angle of attack for a light aircraft, built from its wing, fuselage and tail. A falling line is stable; where it crosses zero the aircraft trims, and the trim angle sets the speed. The picture is the classic test of static stability: a model of the aircraft pivoted at its CG in a wind tunnel, the stream running at the trim speed. Nudge it and see whether it swings back to trim. The gauge shows the CG, the neutral point and the static margin between them.

**Try this**
- Move the CG aft step by step. The line turns flatter; at the neutral point (about 42 % MAC with the standard tail) it is level and a nudged model simply stays where it is put; beyond it the line rises, and a nudge makes the nose run away.
- Shrink the tail volume: the neutral point comes forward and the same CG becomes unstable.
- Use the elevator: the whole line moves up or down and the trim angle — and so the trim speed — changes. Trailing edge up (negative) slows the aircraft.
- Compare the tail force at forward and aft CG: the tail usually pushes down, harder when the CG is forward.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'CG position', min: 5, max: 60, step: 0.5, value: 30, unit: '% MAC' },
        { id: 'VH', label: 'Tail volume V_H', min: 0.2, max: 1.0, step: 0.01, value: 0.57 },
        { id: 'de', label: 'Elevator (trailing edge down +)', min: -15, max: 10, step: 0.5, value: 0, unit: '°' },
        { type: 'buttons', items: [{ id: 'up', label: 'Nudge nose up 5°', primary: true }, { id: 'down', label: 'Nudge nose down 5°' }, { id: 'reset', label: 'Reset to trim' }] }
      ], (id) => {
        if (id === 'up' || id === 'down') { if (!s.div) s.al += (id === 'up' ? 5 : -5) * D2R; return; }
        retrim();
      });
      const ro = kit.readout(box.side, [['np', 'Neutral point'], ['sm', 'Static margin'], ['cma', 'C_mα'], ['at', 'Trim angle of attack'], ['cl', 'Trim C_L'], ['v', 'Trim speed (1100 kg, sea level)'], ['tail', 'Tail force at trim'], ['verdict', '']]);
      const plotM = kit.plot(gb, { x: { label: 'angle of attack α (°)', min: -4, max: 18, name: 'α' }, y: { label: 'C_m about the CG', min: -0.3, max: 0.3 }, legend: true }, 190);
      const plotT = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'α (°)' } }, 130);
      const V = ctl.values;
      // wing-body lift slope a, zero-lift angle a0, wing moment Cmac, fuselage Cm0f and Cmaf, tail lift slope at,
      // downwash gradient dw, tail setting ip (trims at α = 4° with the standard tail, the CG at 30 % and the elevator neutral)
      const P = { a: 5.0, a0: -2 * D2R, Cmac: -0.07, hac: 0.25, eta: 0.9, at: 4.0, dw: 0.45, Cm0f: -0.02, Cmaf: 0.30, ip: -3.40 * D2R, tau: 0.5, StS: 3.0 / 16.2,
        m: 1100, S: 16.2, c: 1.5, Iyy: 1825, Cmq: -15, rho: 1.225, CLmax: 1.5 };
      const hnOf = VH => P.hac + P.eta * VH * (P.at / P.a) * (1 - P.dw) - P.Cmaf / P.a;
      const tailCL = (al, dl) => P.at * ((1 - P.dw) * al + P.ip + P.tau * dl);
      const Cm = (al, h, VH, dl) => P.Cmac + P.Cm0f + P.a * (al - P.a0) * (h - P.hac) + P.Cmaf * al - P.eta * VH * tailCL(al, dl);
      const CLwb = al => P.a * (al - P.a0);
      const CLtot = (al, dl) => CLwb(al) + P.StS * P.eta * tailCL(al, dl);
      const alStall = P.CLmax / P.a + P.a0;
      const s = { al: 0, q: 0, t: 0, div: false, ref: 0, trace: [] };
      let plotClock = 0;
      function state() {
        const h = V.h / 100, VH = V.VH, dl = V.de * D2R;
        const hn = hnOf(VH), cma = Cm(1, h, VH, dl) - Cm(0, h, VH, dl), c0 = Cm(0, h, VH, dl);
        const at = Math.abs(cma) > 1e-5 ? -c0 / cma : null;
        const cl = at != null ? CLtot(at, dl) : null;
        const vt = cl != null && cl > 0.05 ? Math.sqrt(2 * P.m * G / (P.rho * P.S * cl)) : null;
        return { h, VH, dl, hn, cma, c0, at, cl, vt };
      }
      function retrim() {
        const k = state();
        s.ref = k.at != null && Math.abs(k.at) < 40 * D2R ? k.at : 4 * D2R;
        s.al = s.ref; s.q = 0; s.div = false; s.trace = []; s.t = 0;
        drawPlot(k); loop.once();
      }
      function drawPlot(k) {
        const C = kit.colors(), series = [];
        for (const hh of [0.10, 0.20, 0.30, 0.40, 0.50, 0.60]) {
          const pts = []; for (let a = -4; a <= 18; a += 1) pts.push([a, Cm(a * D2R, hh, k.VH, k.dl)]);
          series.push({ pts, color: C.faint, width: 1.2, dash: [3, 4] });
        }
        const npPts = []; for (let a = -4; a <= 18; a += 1) npPts.push([a, Cm(a * D2R, k.hn, k.VH, k.dl)]);
        series.push({ pts: npPts, label: 'CG at the neutral point (' + (100 * k.hn).toFixed(0) + ' %)', color: C.warn, dash: [6, 4], width: 1.8 });
        const cur = []; for (let a = -4; a <= 18; a += 0.5) cur.push([a, Cm(a * D2R, k.h, k.VH, k.dl)]);
        series.push({ pts: cur, label: 'CG at ' + V.h.toFixed(1) + ' % (faint: 10 … 60 %)', color: C.accent, width: 2.8 });
        const marks = k.at != null && k.at * R2D > -4 && k.at * R2D < 18 ? [{ x: k.at * R2D, y: 0, label: k.cma < 0 ? 'trim (stable)' : 'trim (unstable)', color: k.cma < 0 ? C.ok : C.bad }] : [];
        plotM.set({ series, marks, hlines: [{ y: 0 }], vlines: [{ x: alStall * R2D, label: 'stall' }] });
      }
      const loop = kit.loop((dt) => {
        const k = state(), c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // the model pivots about its CG in a tunnel stream at the trim speed: I_yy α̈ = q S c̄ (C_m(α) + C_mq q c̄/2V)
        const Vd = k.vt != null ? clamp(k.vt, 30, 80) : 50;
        const KM = 0.5 * P.rho * Vd * Vd * P.S * P.c / P.Iyy;
        if (dt > 0 && !s.div) {
          const n = Math.max(1, Math.round(dt / 0.002)), hstep = dt / n;
          const fn = y => [y[1], KM * (Cm(y[0], k.h, k.VH, k.dl) + P.Cmq * y[1] * P.c / (2 * Vd))];
          let y = [s.al, s.q];
          for (let i = 0; i < n; i++) y = rk4(fn, y, hstep);
          [s.al, s.q] = y; s.t += dt;
          if (Math.abs(s.al - s.ref) > 20 * D2R || !Number.isFinite(s.al)) s.div = true;
          s.trace.push([s.t, s.al * R2D]); if (s.trace.length > 700) s.trace.shift();
        }
        plotClock += dt;
        if (plotClock > 0.1 || dt === 0) {
          plotClock = 0;
          const t0 = Math.max(0, s.t - 10);
          plotT.set({ series: [{ pts: s.trace.filter(p => p[0] >= t0), label: 'α', color: C.accent }], x: { label: 'time (s)', min: t0, max: t0 + 10, name: 't' },
            hlines: [{ y: s.ref * R2D, label: 'trim' }] });
        }
        // the scene: a model on a pivot at its CG in a wind tunnel
        skyFill(c, C, W, H);
        const kk = Math.min(W, H * 2.1) / 430, cgL = 52 - 52 * k.h, cx = W * 0.44, cy = H * 0.38, wallT = H * 0.05, wallB = H * 0.7;
        c.fillStyle = C.bg2; c.fillRect(0, 0, W, wallT); c.fillRect(0, wallB, W, 5);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, wallT); c.lineTo(W, wallT); c.moveTo(0, wallB); c.lineTo(W, wallB); c.stroke();
        for (let i = 0; i < 5; i++) {         // the tunnel stream
          const y = H * 0.11 + i * H * 0.12;
          kit.arrow(c, 14, y, 58, y, C.faint, 1.2);
        }
        c.strokeStyle = C.muted; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, wallB); c.stroke();
        c.fillStyle = C.muted; c.beginPath(); c.moveTo(cx - 12, wallB); c.lineTo(cx + 12, wallB); c.lineTo(cx, wallB - 14); c.closePath(); c.fill();
        sideCraft(c, C, cx, cy, kk, s.al, { cg: cgL, elev: k.dl });
        // forces at the current angle of attack, as fractions of the total lift
        const clw = CLwb(s.al), clt = P.StS * P.eta * tailCL(s.al, k.dl), tot = clw + clt;
        const Wpx = 58, frac = (x) => (Math.abs(tot) > 0.02 ? x / tot : 0);
        const ac = sidePt(cx, cy, kk, s.al, cgL, 39, 0), tl = sidePt(cx, cy, kk, s.al, cgL, -108, -1);
        kit.arrow(c, ac[0], ac[1], ac[0], ac[1] - Wpx * clamp(frac(clw), -2, 2), C.ok, 2.6);
        kit.arrow(c, tl[0], tl[1], tl[0], tl[1] - 5 * Wpx * clamp(frac(clt), -0.4, 0.4), C.series[1], 2.6);
        kit.label(c, 'wing lift', ac[0] + 6, ac[1] - Wpx * clamp(frac(clw), -2, 2) + 4, { color: C.ok, size: 11.5, weight: 600 });
        kit.label(c, 'tail ×5 ' + (clt < 0 ? '(down)' : '(up)'), tl[0] - 6, tl[1] - 5 * Wpx * clamp(frac(clt), -0.4, 0.4) + (clt < 0 ? 12 : -8), { color: C.series[1], size: 11.5, weight: 600, align: 'right' });
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 4.5, 0, Math.PI * 2); c.fill();
        kit.label(c, 'pivot at the CG', cx + 8, (cy + wallB) / 2, { color: C.muted, size: 11 });
        // the moment now
        const cmNow = Cm(s.al, k.h, k.VH, k.dl);
        if (Math.abs(cmNow) > 0.004 && !s.div) {
          const R = 0.55 * 130 * kk + 20;
          if (cmNow < 0) arcArrow(c, cx, cy, R, -0.55, -0.05, C.warn); else arcArrow(c, cx, cy, R, -0.05, -0.55, C.warn);
          kit.label(c, cmNow < 0 ? 'nose-down moment' : 'nose-up moment', cx + R * 0.95, cy - R * 0.62, { color: C.warn, size: 11.5, weight: 700 });
        }
        kit.label(c, 'α = ' + (s.al * R2D).toFixed(1) + '°   (stream ' + (Vd * 3600 / 1852).toFixed(0) + ' kt)', 12, wallB - 12, { color: C.text, size: 12.5, weight: 700 });
        if (s.div) kit.label(c, 'DIVERGED — the nose runs away (Reset)', W - 12, wallT + 14, { color: C.bad, size: 13, weight: 700, align: 'right' });
        else if (k.at != null && k.at > alStall) kit.label(c, 'trim is beyond the stall', W - 12, wallT + 14, { color: C.warn, size: 12.5, weight: 700, align: 'right' });
        // the MAC gauge: CG, neutral point, static margin
        const g0 = W * 0.08, g1 = W * 0.92, gy = H * 0.86, Gx = hh => g0 + clamp(hh / 0.7, 0, 1) * (g1 - g0);
        c.fillStyle = C.bg2; c.fillRect(g0, gy - 6, g1 - g0, 12); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(g0, gy - 6, g1 - g0, 12);
        for (let pc = 0; pc <= 70; pc += 10) { kit.label(c, pc + '%', Gx(pc / 100), gy + 18, { color: C.muted, size: 10, align: 'center' }); }
        const smCol = k.hn - k.h > 0.05 ? C.ok : k.hn - k.h > 0 ? C.warn : C.bad;
        c.fillStyle = smCol; c.globalAlpha = 0.35; c.fillRect(Math.min(Gx(k.h), Gx(k.hn)), gy - 6, Math.abs(Gx(k.hn) - Gx(k.h)), 12); c.globalAlpha = 1;
        c.fillStyle = C.muted; c.fillRect(Gx(P.hac) - 1, gy - 9, 2, 18);
        kit.label(c, 'wing a.c.', Gx(P.hac), gy - 16, { color: C.muted, size: 10, align: 'center' });
        c.fillStyle = C.warn; c.fillRect(Gx(k.hn) - 1.5, gy - 11, 3, 22);
        kit.label(c, 'NP', Gx(k.hn), gy - 18, { color: C.warn, size: 11, align: 'center', weight: 700 });
        c.fillStyle = C.text; c.beginPath(); c.moveTo(Gx(k.h), gy + 6); c.lineTo(Gx(k.h) - 6, gy - 8); c.lineTo(Gx(k.h) + 6, gy - 8); c.closePath(); c.fill();
        kit.label(c, 'CG', Gx(k.h), gy - 16, { color: C.text, size: 11, align: 'center', weight: 700 });
        // read-outs
        const sm = k.hn - k.h;
        ro.set('np', (100 * k.hn).toFixed(1) + ' % MAC');
        ro.set('sm', (100 * sm).toFixed(1) + ' % MAC');
        ro.set('cma', k.cma.toFixed(3) + ' per rad (' + (k.cma * D2R).toFixed(4) + ' per °)');
        ro.set('at', k.at != null ? (k.at * R2D).toFixed(1) + '°' + (k.at > alStall ? ' — beyond the stall' : '') : 'none (neutral)');
        ro.set('cl', k.cl != null ? k.cl.toFixed(2) : '—');
        ro.set('v', k.vt != null && k.at <= alStall ? (k.vt * 3600 / 1852).toFixed(0) + ' kt (' + k.vt.toFixed(1) + ' m/s)' : '—');
        const tFrac = k.at != null && k.cl != null && Math.abs(k.cl) > 0.02 ? P.StS * P.eta * tailCL(k.at, k.dl) / k.cl : null;
        ro.set('tail', tFrac != null ? (100 * tFrac).toFixed(1) + ' % of the weight ' + (tFrac < 0 ? '(pushing down)' : '(lifting)') : '—');
        ro.set('verdict', sm > 0.05 ? 'Stable' : sm > 0.005 ? 'Stable, but only just' : sm > -0.005 ? 'Neutral: no preferred angle of attack'
          : 'Unstable: a disturbance grows' + (k.at != null && k.at < 0 ? '. To trim at a positive α it would need the elevator the "wrong" way, trailing edge down' : ''));
      }, box.stage);
      retrim();
      loop.start();
    }
  });

  /* ================================================================ stab-phugoid */
  Hyper.sim('stab-phugoid', {
    title: 'The phugoid',
    blurb: `The longitudinal point-mass equations — $m\\dot V = T - D - W\\sin\\gamma$, $mV\\dot\\gamma = L - W\\cos\\gamma$ — integrated in small time steps, with the angle of attack held constant (so $C_L$ and $C_D$ are fixed) and the thrust fixed at the trim drag. Disturb the trimmed aircraft and it swaps speed for height in a slow roller-coaster. The read-outs compare the measured period with Lanchester's $T = \\pi\\sqrt2\\,V/g$ and the measured damping with $1/(\\sqrt2\\,L/D)$. The path is drawn with the height exaggerated.

**Try this**
- Tick **No drag**: the oscillation never dies, and its period matches Lanchester's almost exactly.
- Double the trim speed: the period doubles. Change the altitude: nothing changes — the period depends only on speed.
- Raise L/D from 5 to 30: the cleaner the aircraft, the weaker the damping.
- Tick **Density varies with height** at 11 000 m and 230 m/s: because the air thins as the aircraft climbs, lift falls off faster at the top of each swoop, and the period shortens by nearly a fifth.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'V0', label: 'Trim speed (true)', min: 20, max: 250, step: 1, value: 55, unit: 'm/s' },
        { id: 'alt', label: 'Altitude', min: 0, max: 11000, step: 100, value: 1000, unit: 'm' },
        { id: 'LD', label: 'Lift-to-drag ratio L/D', min: 4, max: 40, step: 0.5, value: 10 },
        { id: 'nodrag', type: 'check', label: 'No drag (Lanchester\'s ideal)', value: false },
        { id: 'rhoVar', type: 'check', label: 'Density varies with height', value: false },
        { id: 'warp', type: 'select', label: 'Time', options: [['Real time', 1], ['3× faster', 3], ['10× faster', 10]], value: 3 },
        { type: 'buttons', items: [{ id: 'fast', label: 'Speed +10 %', primary: true }, { id: 'pull', label: 'Pull up 5°' }, { id: 'restart', label: 'Restart' }] }
      ], (id) => {
        if (id === 'fast') { s.V *= 1.1; return; }
        if (id === 'pull') { s.gam += 5 * D2R; return; }
        if (id === 'warp') return;
        restart();
      });
      const ro = kit.readout(box.side, [['lan', 'Lanchester period π√2·V/g'], ['Tm', 'Measured period'], ['zp', 'Damping 1/(√2·L/D)'], ['zm', 'Measured damping'], ['lam', 'Wavelength V·T'], ['dv', 'Speed now'], ['dh', 'Height change now']]);
      const plotV = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'speed − trim (m/s)' } }, 130);
      const plotH = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'height change (m)' } }, 130);
      const V = ctl.values;
      let s = null, rho0 = 1.225, path = [], trace = [], cross = [], peaks = [], prev = null, prev2 = null, sampleT = 0, plotClock = 0, note = '';
      const Tlan = () => Math.PI * Math.SQRT2 * V.V0 / G;
      function restart() {
        rho0 = F.isa(V.alt).rho;
        s = { V: V.V0 * 1.1, gam: 0, h: V.alt, x: 0, t: 0 };
        path = [[0, V.alt]]; trace = []; cross = []; peaks = []; prev = prev2 = null; sampleT = 0; note = '';
        loop.once();
      }
      function deriv(y) {
        const Vv = Math.max(y[0], 1), gam = y[1], h = y[2];
        const sig = V.rhoVar ? F.isa(clamp(h, -1000, 20000)).rho / rho0 : 1;
        const aL = G * (Vv / V.V0) * (Vv / V.V0) * sig, aD = V.nodrag ? 0 : aL / V.LD, aT = V.nodrag ? 0 : G / V.LD;
        return [aT - aD - G * Math.sin(gam), (aL - G * Math.cos(gam)) / Vv, Vv * Math.sin(gam), Vv * Math.cos(gam)];
      }
      const loop = kit.loop((dt) => {
        const C = kit.colors(), T0 = Tlan();
        if (dt > 0 && s) {
          const span = dt * V.warp, hmax = Math.min(0.05, T0 / 400), n = Math.min(600, Math.ceil(span / hmax)), h = span / n;
          let y = [s.V, s.gam, s.h, s.x];
          for (let i = 0; i < n; i++) {
            y = rk4(deriv, y, h); s.t += h;
            const d = y[0] - V.V0;
            if (prev != null && prev < 0 && d >= 0) { const tc = s.t - h * d / ((d - prev) || 1e-9); if (!cross.length || tc - cross[cross.length - 1] > 0.3 * T0) cross.push(tc); }
            if (prev2 != null && prev > prev2 && prev >= d && prev > 0) peaks.push(prev);
            prev2 = prev; prev = d;
          }
          [s.V, s.gam, s.h, s.x] = y;
          if (!(s.V > 0.3 * V.V0) || Math.abs(s.gam) > 70 * D2R || !Number.isFinite(s.h)) { restart(); note = 'That disturbance was too large for this model — restarted'; return; }
          sampleT += span;
          if (sampleT >= T0 / 60) {
            sampleT = 0;
            trace.push([s.t, s.V - V.V0, s.h - V.alt]); path.push([s.x, s.h]);
            while (trace.length && trace[0][0] < s.t - 4 * T0) trace.shift();
            while (path.length > 2 && path[0][0] < s.x - 1.6 * V.V0 * T0) path.shift();
            if (cross.length > 8) cross.shift();
            if (peaks.length > 8) peaks.shift();
          }
        }
        if (!s) return;
        plotClock += dt;
        if (plotClock > 0.12 || dt === 0) {
          plotClock = 0;
          const t0 = Math.max(0, s.t - 4 * T0);
          plotV.set({ series: [{ pts: trace.map(p => [p[0], p[1]]), label: 'ΔV', color: C.accent }], x: { label: 'time (s)', min: t0, max: t0 + 4 * T0, name: 't' }, hlines: [{ y: 0 }] });
          plotH.set({ series: [{ pts: trace.map(p => [p[0], p[2]]), label: 'Δh', color: C.series[1] }], x: { label: 'time (s)', min: t0, max: t0 + 4 * T0, name: 't' }, hlines: [{ y: 0 }] });
        }
        // the flight path, height exaggerated
        const c = st.begin(), W = st.W, H = st.H, lam = V.V0 * T0;
        skyFill(c, C, W, H);
        const xR = s.x + 0.25 * lam, xL = s.x - 1.35 * lam, sx = (W - 40) / (xR - xL);
        let A = 2; for (const p of path) A = Math.max(A, Math.abs(p[1] - V.alt));
        const sy = (H * 0.36) / A, ex = sy / sx;
        const PX = x => 20 + (x - xL) * sx, PY = h => H * 0.52 - (h - V.alt) * sy;
        c.save(); c.setLineDash([6, 5]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(0, PY(V.alt)); c.lineTo(W, PY(V.alt)); c.stroke(); c.restore();
        kit.label(c, 'trim altitude ' + V.alt.toFixed(0) + ' m', 12, PY(V.alt) - 9, { color: C.muted, size: 11 });
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        path.forEach((p, i) => (i ? c.lineTo(PX(p[0]), PY(p[1])) : c.moveTo(PX(p[0]), PY(p[1])))); c.lineTo(PX(s.x), PY(s.h)); c.stroke();
        const ang = Math.atan(Math.tan(clamp(s.gam, -1.4, 1.4)) * ex);
        sideCraft(c, C, PX(s.x), PY(s.h), 0.16, ang, { cg: 20 });
        kit.label(c, 'height exaggerated ×' + (ex >= 10 ? ex.toFixed(0) : ex.toFixed(1)), W - 12, H - 12, { color: C.faint, size: 11, align: 'right' });
        kit.label(c, 'γ = ' + sgn(s.gam * R2D, 1) + '°', PX(s.x) + 14, PY(s.h) - 20, { color: C.text, size: 12, weight: 700 });
        // energy bars: kinetic, potential, total (specific energy relative to trim)
        const eK = (s.V * s.V - V.V0 * V.V0) / 2, eP = G * (s.h - V.alt), eMax = Math.max(1, Math.abs(eK), Math.abs(eP), 0.11 * V.V0 * V.V0);
        const bx = W - 150, by = 26, bw = 36;
        [['speed', eK, C.accent], ['height', eP, C.series[1]], ['total', eK + eP, C.text]].forEach(([lab, e, col], i) => {
          const x = bx + i * (bw + 10), hgt = 34 * clamp(e / eMax, -1, 1);
          c.fillStyle = col; c.globalAlpha = 0.75; c.fillRect(x, by + 34 - Math.max(0, hgt), bw, Math.abs(hgt)); c.globalAlpha = 1;
          c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x - 2, by + 34); c.lineTo(x + bw + 2, by + 34); c.stroke();
          kit.label(c, lab, x + bw / 2, by + 80, { color: C.muted, size: 10.5, align: 'center' });
        });
        kit.label(c, 'energy above trim', bx - 8, by + 4, { color: C.muted, size: 10.5, align: 'right' });
        if (note) kit.label(c, note, 12, 16, { color: C.warn, size: 12, weight: 600 });
        // read-outs
        ro.set('lan', T0.toFixed(1) + ' s');
        const Tm = cross.length > 1 ? (cross[cross.length - 1] - cross[0]) / (cross.length - 1) : null;
        ro.set('Tm', Tm ? Tm.toFixed(1) + ' s (' + (100 * (Tm / T0 - 1) >= 0 ? '+' : '−') + Math.abs(100 * (Tm / T0 - 1)).toFixed(1) + ' %)' : 'measuring…');
        ro.set('zp', V.nodrag ? '0 (no drag)' : (1 / (Math.SQRT2 * V.LD)).toFixed(3));
        let zm = null;
        if (peaks.length > 1) { const r = peaks[peaks.length - 2] / peaks[peaks.length - 1], dl = Math.log(r); if (Number.isFinite(dl)) zm = dl / Math.sqrt(4 * Math.PI * Math.PI + dl * dl); }
        ro.set('zm', zm != null ? zm.toFixed(3) : 'measuring…');
        ro.set('lam', lam >= 1000 ? (lam / 1000).toFixed(2) + ' km' : lam.toFixed(0) + ' m');
        ro.set('dv', s.V.toFixed(1) + ' m/s (' + sgn(s.V - V.V0, 1) + ')');
        ro.set('dh', sgn(s.h - V.alt, 1) + ' m');
      }, box.stage);
      restart();
      loop.start();
    }
  });

  /* ================================================================ stab-short-period */
  Hyper.sim('stab-short-period', {
    title: 'The short period and pitch augmentation',
    blurb: `Angle of attack α, pitch rate q and pitch attitude θ of a light aircraft after an elevator input or a gust, from the constant-speed short-period equations $\\dot\\alpha = q + (Z_\\alpha/V)\\alpha$, $\\dot q = M_\\alpha\\alpha + M_q q + M_\\delta\\delta_e$, integrated in 2 ms steps. The read-outs give the natural frequency and damping from the same equations. **Pitch augmentation** is a simple fly-by-wire law, $\\delta_e = \\delta_{pilot} + k_\\alpha\\alpha + k_q q$, whose gains make the aircraft respond like a well-behaved one whatever its static margin.

**Try this**
- Give an elevator pulse at 15 % static margin: a brisk, well-damped bob of about 1.5 s. Then fly at 120 m/s — faster and snappier — and at 10 000 m, where the thin air weakens the damping.
- Reduce the pitch damping C_mq: the overshoot grows.
- Take the static margin negative. Down to about −11 % this constant-speed model still settles (the manoeuvre point lies behind the neutral point); further aft the nose runs away — at −25 % it doubles in under half a second.
- Now tick **Pitch augmentation**: the same unstable aircraft flies as if it were stable — until the elevator runs out of travel.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Airspeed (true)', min: 30, max: 120, step: 1, value: 60, unit: 'm/s' },
        { id: 'alt', label: 'Altitude', min: 0, max: 10000, step: 100, value: 0, unit: 'm' },
        { id: 'sm', label: 'Static margin', min: -25, max: 30, step: 0.5, value: params.sm != null ? params.sm : 15, unit: '% MAC' },
        { id: 'cmq', label: 'Pitch damping C_mq (per rad)', min: -40, max: -2, step: 0.5, value: -17 },
        { id: 'input', type: 'select', label: 'Elevator input', options: [['Pulse (0.5 s)', 'pulse'], ['Step', 'step'], ['Doublet', 'doublet']], value: 'pulse' },
        { id: 'amp', label: 'Input size (trailing edge up)', min: 1, max: 6, step: 0.5, value: 3, unit: '°' },
        { id: 'aug', type: 'check', label: 'Pitch augmentation (fly-by-wire)', value: !!params.aug },
        { id: 'slow', type: 'check', label: 'Slow motion (¼ speed)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Elevator input', primary: true }, { id: 'gust', label: 'Gust: α +3°' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'go') { if (s.div) reset(); s.tin = 0; s.inputOn = true; return; }
        if (id === 'gust') { if (s.div) reset(); s.al += 3 * D2R; return; }
        if (id === 'reset' || id === 'sm' || id === 'aug' || id === 'V' || id === 'alt' || id === 'cmq') reset();
      });
      const ro = kit.readout(box.side, [['wn', 'Natural frequency ω_n'], ['z', 'Damping ratio ζ'], ['T', 'Damped period'], ['th', 'Time to half (or double)'], ['dn', 'Peak load factor change'], ['bare', 'Bare airframe'], ['v', '']]);
      const plotA = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'α (°), q (°/s), θ (°)' }, legend: true }, 150);
      const plotE = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'elevator (°), Δn (g)' }, legend: true }, 120);
      const V = ctl.values;
      const A = { m: 1100, S: 16.2, c: 1.5, Iyy: 1825, CLa: 4.8, Cmd: -1.1 };
      const s = { al: 0, q: 0, th: 0, t: 0, tin: 0, inputOn: false, div: false, tr: [], dnPeak: 0, de: 0 };
      let plotClock = 0;
      function reset() { s.al = s.q = s.th = 0; s.t = 0; s.tin = 0; s.inputOn = false; s.div = false; s.tr = []; s.dnPeak = 0; s.de = 0; loop.once(); }
      function derivs() {
        const rho = F.isa(V.alt).rho, Q = 0.5 * rho * V.V * V.V;
        const Zk = -Q * A.S * A.CLa / (A.m * V.V);
        const Ma = Q * A.S * A.c * (-A.CLa * V.sm / 100) / A.Iyy;
        const Mq = Q * A.S * A.c * V.cmq * (A.c / (2 * V.V)) / A.Iyy;
        const Md = Q * A.S * A.c * A.Cmd / A.Iyy;
        // the augmentation: place the poles where a 15 %-margin aircraft with ζ = 0.75 would have them
        const MaN = Q * A.S * A.c * (-A.CLa * 0.15) / A.Iyy, wd = Math.sqrt(Math.max(0.01, Zk * Mq - MaN)), zd = 0.75;
        const MqS = -2 * zd * wd - Zk, MaS = Zk * MqS - wd * wd;
        const kq = (MqS - Mq) / Md, ka = (MaS - Ma) / Md;
        return { Zk, Ma, Mq, Md, ka, kq };
      }
      function modes(Zk, Ma, Mq) {
        const tr = Zk + Mq, det = Zk * Mq - Ma, disc = tr * tr / 4 - det;
        if (disc < 0) { const wn = Math.sqrt(det), z = -tr / (2 * wn); return { osc: true, wn, z, Td: 2 * Math.PI / Math.sqrt(-disc), lam: tr / 2 }; }
        const l1 = tr / 2 + Math.sqrt(disc), l2 = tr / 2 - Math.sqrt(disc);
        return { osc: false, l1, l2, wn: Math.sqrt(Math.max(0, det)), z: det > 0 ? -tr / (2 * Math.sqrt(det)) : null };
      }
      const pilot = t => {
        if (!s.inputOn) return 0;
        const a = -V.amp * D2R;
        if (V.input === 'step') return a;
        if (V.input === 'pulse') return t < 0.5 ? a : 0;
        return t < 0.5 ? a : t < 1.0 ? -a : 0;
      };
      const loop = kit.loop((dt) => {
        const C = kit.colors(), d = derivs();
        const Ma = d.Ma, Mq = d.Mq;
        if (dt > 0 && !s.div) {
          const span = dt * (V.slow ? 0.25 : 1), n = Math.max(1, Math.ceil(span / 0.002)), h = span / n;
          for (let i = 0; i < n; i++) {
            const dp = pilot(s.tin);
            const deOf = y => clamp(dp + (V.aug ? d.ka * y[0] + d.kq * y[1] : 0), -25 * D2R, 25 * D2R);
            const fn = y => { const de = deOf(y); return [y[1] + d.Zk * y[0], Ma * y[0] + Mq * y[1] + d.Md * de, y[1]]; };
            const y = rk4(fn, [s.al, s.q, s.th], h);
            [s.al, s.q, s.th] = y; s.de = deOf(y); s.t += h; s.tin += h;
          }
          if (!Number.isFinite(s.al) || Math.abs(s.al) > 25 * D2R) s.div = true;
          const dn = -V.V * d.Zk * s.al / G;
          if (Math.abs(dn) > Math.abs(s.dnPeak)) s.dnPeak = dn;
          s.tr.push([s.t, s.al * R2D, s.q * R2D, s.th * R2D, s.de * R2D, dn]);
          while (s.tr.length && s.tr[0][0] < s.t - 8) s.tr.shift();
        }
        plotClock += dt;
        if (plotClock > 0.08 || dt === 0) {
          plotClock = 0;
          const t0 = Math.max(0, s.t - 8), xa = { label: 'time (s)', min: t0, max: t0 + 8, name: 't' };
          plotA.set({ x: xa, series: [
            { pts: s.tr.map(p => [p[0], p[1]]), label: 'α (°)', color: C.accent },
            { pts: s.tr.map(p => [p[0], p[2]]), label: 'q (°/s)', color: C.series[1] },
            { pts: s.tr.map(p => [p[0], p[3]]), label: 'θ (°)', color: C.series[2], dash: [5, 4] }], hlines: [{ y: 0 }] });
          plotE.set({ x: xa, series: [
            { pts: s.tr.map(p => [p[0], p[4]]), label: 'elevator δe (°)', color: C.warn },
            { pts: s.tr.map(p => [p[0], p[5]]), label: 'Δn (g)', color: C.ok }], hlines: [{ y: 0 }] });
        }
        // scene
        const c = st.begin(), W = st.W, H = st.H;
        skyFill(c, C, W, H);
        const gam = s.th - s.al, cx = W * 0.45, cy = H * 0.5, kk = Math.min(W, H * 2.2) / 420;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke();
        kit.label(c, 'horizon', 10, cy - 8, { color: C.faint, size: 10.5 });
        const clampA = a => clamp(a, -40 * D2R, 40 * D2R);
        sideCraft(c, C, cx, cy, kk, clampA(s.th), { cg: 38, elev: clamp(s.de * 2, -0.8, 0.8) });
        const L = 150 * kk;
        kit.arrow(c, cx, cy, cx + L * Math.cos(clampA(gam)), cy - L * Math.sin(clampA(gam)), C.ok, 2.4);
        kit.label(c, 'flight path', cx + L * Math.cos(clampA(gam)) + 6, cy - L * Math.sin(clampA(gam)) + 12, { color: C.ok, size: 11.5, weight: 600 });
        kit.label(c, 'α = ' + sgn(s.al * R2D, 1) + '°   q = ' + sgn(s.q * R2D, 1) + ' °/s   θ = ' + sgn(s.th * R2D, 1) + '°', 12, 16, { color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'elevator ' + sgn(s.de * R2D, 1) + '° (drawn ×2)', 12, 34, { color: C.warn, size: 11.5 });
        if (s.div) kit.label(c, 'DEPARTED — the nose ran away (Reset)', W - 12, 16, { color: C.bad, size: 13, weight: 700, align: 'right' });
        else if (V.aug) kit.label(c, 'augmented', W - 12, 16, { color: C.ok, size: 12.5, weight: 700, align: 'right' });
        // read-outs
        const eff = modes(d.Zk, V.aug ? Ma + d.Md * d.ka : Ma, V.aug ? Mq + d.Md * d.kq : Mq), bare = modes(d.Zk, Ma, Mq);
        const describe = (m) => m.osc ? (m.lam < 0 ? 'oscillates, halves in ' + fx(LN2 / -m.lam, 2) + ' s' : 'oscillation grows, doubles in ' + fx(LN2 / m.lam, 2) + ' s')
          : m.l1 > 0 ? 'diverges, doubles in ' + fx(LN2 / m.l1, 2) + ' s' : 'no overshoot; slowest time constant ' + fx(-1 / m.l1, 2) + ' s';
        ro.set('wn', eff.osc || eff.l1 <= 0 ? fx(eff.wn, 2) + ' rad/s (' + fx(eff.wn / (2 * Math.PI), 2) + ' Hz)' : '— (divergent)');
        ro.set('z', eff.z != null ? fx(eff.z, 2) : '—');
        ro.set('T', eff.osc ? fx(eff.Td, 2) + ' s' : 'no oscillation');
        ro.set('th', describe(eff));
        ro.set('dn', sgn(s.dnPeak, 2) + ' g');
        ro.set('bare', describe(bare));
        ro.set('v', V.sm < 0 && !V.aug ? (bare.osc || bare.l1 < 0 ? 'CG behind the neutral point: this constant-speed model still settles, but the full aircraft would diverge slowly through its speed'
          : LN2 / bare.l1 < 0.8 ? 'Unstable, and too fast for a pilot to catch' : 'Unstable: a pilot would have to fight it continuously')
          : V.aug ? 'The control law adds k_α = ' + fx(d.ka, 2) + ' and k_q = ' + fx(d.kq, 3) + ' s of elevator per radian' : '');
      }, box.stage);
      reset();
      loop.start();
    }
  });

  /* ================================================================ stab-lateral */
  Hyper.sim('stab-lateral', {
    title: 'Dutch roll, spiral and roll modes',
    blurb: `A four-state linear model of a light aircraft's lateral motion — sideslip β, roll rate p, yaw rate r and bank φ — integrated in 4 ms steps, with stability derivatives that change with the dihedral angle and the fin size. On the right the aircraft is seen from behind (bank) and from above (heading, with the velocity arrow showing the sideslip). The lower graph is the complex plane of the four eigenvalues; the faint dots show where they move as the dihedral goes from −6° to 12°.

**Try this**
- Press **Side gust** with the default aircraft: a Dutch roll of about 2 s period, damped in a few cycles, and a small leftover bank that the stable spiral slowly removes.
- Set the dihedral to 0° and press **Bank 15°**: the spiral root crosses into the right half-plane and the bank slowly grows (use ×4 time).
- Raise the dihedral to 12°: the spiral is very stable, but the Dutch roll has more roll and less damping.
- Shrink the fin below about 0.45×: directional stability is lost and the Dutch roll diverges. Enlarge it: better damping, weaker spiral.
- Tick **Yaw damper** — the Dutch roll almost vanishes.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = under(box);
      const ctl = kit.controls(box.side, [
        { id: 'gam', label: 'Dihedral Γ', min: -6, max: 12, step: 0.5, value: params.gam != null ? params.gam : 3, unit: '°' },
        { id: 'fin', label: 'Fin size (× standard)', min: 0.3, max: 2.5, step: 0.05, value: 1 },
        { id: 'V', label: 'Airspeed', min: 35, max: 90, step: 1, value: 55, unit: 'm/s' },
        { id: 'yd', type: 'check', label: 'Yaw damper', value: false },
        { id: 'warp', type: 'select', label: 'Time', options: [['Real time', 1], ['4× faster (for the spiral)', 4]], value: 1 },
        { type: 'buttons', items: [{ id: 'gust', label: 'Side gust (β +5°)', primary: true }, { id: 'bank', label: 'Bank 15°, hands off' }, { id: 'kick', label: 'Rudder kick' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'gust') { restartIf(); x[0] += 5 * D2R; return; }
        if (id === 'bank') { restartIf(); x[3] += 15 * D2R; return; }
        if (id === 'kick') { restartIf(); kick = 0.4; return; }
        if (id === 'reset') { reset(); return; }
        if (id === 'warp') return;
        rebuild();
      });
      const ro = kit.readout(box.side, [['clb', 'Dihedral effect C_lβ'], ['cnb', 'Directional stability C_nβ'], ['dr', 'Dutch roll'], ['sp', 'Spiral'], ['rl', 'Roll subsidence'], ['crit', 'C_lβC_nr − C_nβC_lr'], ['v', '']]);
      const plotT = kit.plot(gb, { x: { label: 'time (s)', name: 't' }, y: { label: 'angle (°)' }, legend: true }, 150);
      const plotS = kit.plot(gb, { x: { label: 'real part (1/s): ← stable | unstable →', min: -3.5, max: 1.0, name: 'Re' }, y: { label: 'imaginary (rad/s)', min: -6, max: 6 }, hoverRead: false }, 170);
      const V = ctl.values;
      let M = null, modesNow = null, x = [0, 0, 0, 0, 0], t = 0, kick = 0, tr = [], halted = '', plotClock = 0;
      function restartIf() { if (halted) reset(); }
      function reset() { x = [0, 0, 0, 0, 0]; t = 0; kick = 0; tr = []; halted = ''; loop.once(); }
      function rebuild() {
        M = latModel({ V: V.V, fin: V.fin, gam: V.gam, yd: V.yd });
        const roots = eig(M.A);
        const md = latModes(roots);
        if (md.ok) modesNow = md;
        // the locus of the roots as the dihedral varies
        const C = kit.colors(), loc = [];
        for (let g = -6; g <= 12.001; g += 0.5) for (const z of eig(latModel({ V: V.V, fin: V.fin, gam: g, yd: V.yd }).A)) if (Number.isFinite(z[0]) && Number.isFinite(z[1])) loc.push([z[0], z[1]]);
        const marks = [], c = M.c, lost = c.Cnb <= 0;
        if (modesNow) {
          if (modesNow.dutch) { marks.push({ x: modesNow.dutch[0], y: modesNow.dutch[1], label: lost ? 'yaw divergence' : 'Dutch roll', color: modesNow.dutch[0] > 0 ? C.bad : C.accent }); marks.push({ x: modesNow.dutch[0], y: -modesNow.dutch[1], color: modesNow.dutch[0] > 0 ? C.bad : C.accent }); }
          if (modesNow.extra) { marks.push({ x: modesNow.extra[0], y: modesNow.extra[1], label: 'roll–spiral', color: C.warn }); marks.push({ x: modesNow.extra[0], y: -modesNow.extra[1], color: C.warn }); }
          if (modesNow.spiral != null) marks.push({ x: modesNow.spiral, y: 0, label: 'spiral', color: modesNow.spiral > 0 ? C.bad : C.ok });
          if (modesNow.roll != null) marks.push({ x: Math.max(-3.4, modesNow.roll), y: 0, label: 'roll ' + (modesNow.roll < -3.4 ? '(' + modesNow.roll.toFixed(1) + ')' : ''), color: C.series[1] });
        }
        plotS.set({ series: [{ pts: loc, line: false, dots: 1.8, color: C.faint }], marks, vlines: [{ x: 0 }], hlines: [{ y: 0 }] });
        const maxRe = roots.reduce((mx, z) => (Number.isFinite(z[0]) ? Math.max(mx, z[0]) : mx), -Infinity);
        ro.set('clb', fx(c.Clb, 3) + ' per rad');
        ro.set('cnb', fx(c.Cnb, 3) + ' per rad');
        ro.set('dr', lost ? 'none: the aircraft diverges in yaw' + (maxRe > 0 ? ', doubling in ' + fx(LN2 / maxRe, 1) + ' s' : '')
          : modesNow && modesNow.dutch ? modeText(modesNow.dutch) : 'no oscillation');
        ro.set('sp', lost ? '— (the modes have merged)' : modesNow ? slowText(modesNow.spiral) : '—');
        ro.set('rl', modesNow && modesNow.roll != null ? 'time constant ' + fx(-1 / modesNow.roll, 3) + ' s' : '—');
        const E = c.Clb * c.Cnr - c.Cnb * c.Clr;
        ro.set('crit', (E >= 0 ? '+' : '−') + Math.abs(E).toFixed(4) + (E >= 0 ? ' (spiral stable)' : ' (spiral unstable)'));
        ro.set('v', c.Cnb <= 0 ? 'No weathercock stability: the fin is too small' : modesNow && modesNow.dutch && modesNow.dutch[0] > 0 ? 'The Dutch roll grows' : '');
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (!M) return;
        if (dt > 0 && !halted) {
          const span = dt * V.warp, n = Math.max(1, Math.ceil(span / 0.004)), h = span / n;
          for (let i = 0; i < n; i++) {
            const dr = kick > 0 ? 10 * D2R : 0;
            x = rk4(sv => latDeriv(M, sv, 0, dr), x, h);
            kick = Math.max(0, kick - h); t += h;
          }
          if (!x.every(Number.isFinite)) { halted = 'the linear model broke down — Reset'; x = [0, 0, 0, 0, 0]; }
          else if (Math.abs(x[3]) > 60 * D2R) halted = 'bank beyond 60°: the small-angle model stops here';
          else if (Math.abs(x[0]) > 30 * D2R) halted = 'sideslip beyond 30°: the model stops here';
          tr.push([t, x[0] * R2D, x[3] * R2D, x[4] * R2D]);
          const win = 12 * V.warp;
          while (tr.length && tr[0][0] < t - win) tr.shift();
        }
        plotClock += dt;
        if (plotClock > 0.1 || dt === 0) {
          plotClock = 0;
          const win = 12 * V.warp, t0 = Math.max(0, t - win);
          plotT.set({ x: { label: 'time (s)', min: t0, max: t0 + win, name: 't' }, series: [
            { pts: tr.map(p => [p[0], p[1]]), label: 'sideslip β', color: C.accent },
            { pts: tr.map(p => [p[0], p[2]]), label: 'bank φ', color: C.series[1] },
            { pts: tr.map(p => [p[0], p[3]]), label: 'heading ψ', color: C.series[2], dash: [5, 4] }], hlines: [{ y: 0 }] });
        }
        const c = st.begin(), W = st.W, H = st.H;
        skyFill(c, C, W, H);
        // from behind: bank against the horizon
        const rx = W * 0.27, ry = H * 0.55, k1 = Math.min(W * 0.4, H * 1.2) / 190;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(12, ry + 30); c.lineTo(W * 0.52, ry + 30); c.stroke();
        rearCraft(c, C, rx, ry, k1, x[3], V.gam * D2R, V.fin, null);
        kit.label(c, 'from behind', rx, 16, { color: C.muted, size: 12, align: 'center', weight: 600 });
        kit.label(c, 'bank ' + sgn(x[3] * R2D, 1) + '°', rx, H - 14, { color: C.text, size: 12, align: 'center', weight: 700 });
        // from above: heading and the velocity (track = ψ + β)
        const tx = W * 0.76, ty = H * 0.55, k2 = Math.min(W * 0.4, H * 1.1) / 180;
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(tx, ty - 80 * k2 - 10); c.lineTo(tx, ty + 80 * k2); c.stroke();
        topCraft(c, C, tx, ty, k2, x[4]);
        const vl = 95 * k2, va = x[4] + x[0];
        kit.arrow(c, tx, ty, tx + vl * Math.sin(va), ty - vl * Math.cos(va), C.ok, 2.2);
        kit.label(c, 'from above', tx, 16, { color: C.muted, size: 12, align: 'center', weight: 600 });
        kit.label(c, 'heading ' + sgn(x[4] * R2D, 1) + '°, sideslip ' + sgn(x[0] * R2D, 1) + '°', tx, H - 14, { color: C.text, size: 12, align: 'center', weight: 700 });
        if (halted) kit.label(c, halted, W / 2, 36, { color: C.warn, size: 12, align: 'center', weight: 700 });
      }, box.stage);
      rebuild();
      loop.start();
    }
  });

  /* ================================================================ stab-adverse-yaw */
  Hyper.sim('stab-adverse-yaw', {
    title: 'Adverse yaw and the slip ball',
    blurb: `A light aircraft rolls into a turn: the aileron is held for 1.2 s and then centred. The same lateral model as the Dutch-roll simulation, with the yawing moment of the ailerons set by their type and the yaw due to roll rate ($C_{n_p} \\approx -C_L/8$) growing at low speed. Watch the heading in the first second — with plain ailerons the nose swings *away* from the turn before the aircraft follows its bank round — and the slip ball, which shows the sideslip the pilot would feel. The bars show the yawing moments at work.

**Try this**
- Roll right with plain ailerons at the default 45 m/s: the heading first goes negative (left) and the ball swings out to the right.
- Switch to differential, then Frise ailerons: the wrong-way swing shrinks. Roll spoilers, which add drag on the inside of the turn, almost remove it.
- Fly at 75 m/s: the lift coefficient is smaller, so the adverse yaw from the roll rate falls; slow down to 30 m/s and it grows.
- Tick **Rudder keeps the ball centred**: the rudder cancels the adverse yaw and the turn starts cleanly.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 230 });
      const gb = under(box);
      const TYPES = { plain: { Clda: 0.17, Cnda: -0.020, name: 'plain' }, diff: { Clda: 0.16, Cnda: -0.008, name: 'differential' }, frise: { Clda: 0.16, Cnda: -0.004, name: 'Frise' }, spoiler: { Clda: 0.12, Cnda: 0.010, name: 'spoilers' } };
      const HOLD = 1.2;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Roll control', options: [['Plain ailerons', 'plain'], ['Differential ailerons', 'diff'], ['Frise ailerons', 'frise'], ['Roll spoilers', 'spoiler']], value: 'plain' },
        { id: 'da', label: 'Aileron input', min: 5, max: 20, step: 1, value: 10, unit: '°' },
        { id: 'V', label: 'Airspeed', min: 30, max: 80, step: 1, value: 45, unit: 'm/s' },
        { id: 'coord', type: 'check', label: 'Rudder keeps the ball centred', value: false },
        { type: 'buttons', items: [{ id: 'right', label: 'Roll right', primary: true }, { id: 'left', label: 'Roll left' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'right' || id === 'left') { start(id === 'right' ? 1 : -1); return; }
        if (id === 'reset') { reset(); return; }
        build();
      });
      const ro = kit.readout(box.side, [['sw', 'Wrong-way heading swing'], ['bmax', 'Largest sideslip'], ['bank', 'Bank now'], ['pk', 'Peak roll rate'], ['rud', 'Rudder now'], ['cn', 'Yaw from the aileron itself, C_nδa']]);
      const plot = kit.plot(gb, { x: { label: 'time after the input (s)', min: 0, max: 8, name: 't' }, y: { label: 'angle (°)' }, legend: true }, 160);
      const V = ctl.values;
      let M = null, x = [0, 0, 0, 0, 0], t = 0, dir = 0, run = false, tr = [], stats = null, plotClock = 0, dr = 0, da = 0;
      function build() { const ty = TYPES[V.type] || TYPES.plain; M = latModel({ V: V.V, fin: 1, gam: 3, yd: false, Clda: ty.Clda, Cnda: ty.Cnda }); loop.once(); }
      function reset() { x = [0, 0, 0, 0, 0]; t = 0; run = false; dir = 0; tr = []; stats = null; dr = da = 0; loop.once(); }
      function start(d) { build(); x = [0, 0, 0, 0, 0]; t = 0; dir = d; run = true; tr = []; stats = { sw: 0, bmax: 0, pk: 0 }; }
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (!M) return;
        if (dt > 0 && run) {
          const n = Math.max(1, Math.ceil(dt / 0.004)), h = dt / n;
          for (let i = 0; i < n; i++) {
            da = t < HOLD ? dir * V.da * D2R : 0;
            // a pilot "stepping on the ball": rudder against the aileron and roll-rate yaw, plus a sideslip correction
            const ff = -(M.c.Cnda * da + M.c.Cnp * x[1] * LAT.b / (2 * V.V)) / M.c.Cndr;
            dr = V.coord ? clamp(4.0 * x[0] + ff, -25 * D2R, 25 * D2R) : 0;
            x = rk4(sv => latDeriv(M, sv, da, dr), x, h);
            t += h;
            if (t < 2.5) stats.sw = dir > 0 ? Math.min(stats.sw, x[4]) : Math.max(stats.sw, x[4]);
            if (Math.abs(x[0]) > Math.abs(stats.bmax)) stats.bmax = x[0];
            if (Math.abs(x[1]) > Math.abs(stats.pk)) stats.pk = x[1];
          }
          if (!x.every(Number.isFinite)) { x = [0, 0, 0, 0, 0]; run = false; }
          tr.push([t, x[4] * R2D, x[3] * R2D, x[0] * R2D]);
          if (t >= 8) run = false;
          if (Math.abs(x[3]) > 60 * D2R) { run = false; stats.halt = true; }
        }
        plotClock += dt;
        if (plotClock > 0.08 || dt === 0) {
          plotClock = 0;
          plot.set({ series: [
            { pts: tr.map(p => [p[0], p[1]]), label: 'heading ψ', color: C.accent },
            { pts: tr.map(p => [p[0], p[2] / 10]), label: 'bank φ ÷ 10', color: C.series[1], dash: [5, 4] },
            { pts: tr.map(p => [p[0], p[3]]), label: 'sideslip β', color: C.warn }], hlines: [{ y: 0 }], vlines: [{ x: HOLD, label: 'aileron centred' }] });
        }
        // the scene: plan view with the heading and flight direction, a rear view, the slip ball and the yaw moments
        const c = st.begin(), W = st.W, H = st.H;
        skyFill(c, C, W, H);
        const px = W * 0.25, py = H * 0.52, kp = Math.min(W * 0.42, H * 1.2) / 180;
        c.save(); c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px, py - 85 * kp); c.lineTo(px, py + 70 * kp); c.stroke(); c.restore();
        topCraft(c, C, px, py, kp, x[4]);
        const vl = 90 * kp, va = x[4] + x[0];
        kit.arrow(c, px, py, px + vl * Math.sin(va), py - vl * Math.cos(va), C.ok, 2.2);
        kit.label(c, 'from above: nose ' + sgn(x[4] * R2D, 1) + '°', px, 16, { color: C.text, size: 12, align: 'center', weight: 700 });
        kit.label(c, 'green: direction of flight', px, H - 12, { color: C.ok, size: 11, align: 'center' });
        const ty = TYPES[V.type] || TYPES.plain;
        const rx = W * 0.62, ry = H * 0.36, kr = Math.min(W * 0.3, H) / 190;
        const ail = V.type === 'spoiler' ? { l: 0, r: 0, spoiler: da > 0 ? 0.25 : da < 0 ? -0.25 : 0 }
          : { r: -da * (V.type === 'diff' && da > 0 ? 1.3 : 1) * (V.type === 'diff' && da < 0 ? 0.7 : 1), l: da * (V.type === 'diff' && da > 0 ? 0.7 : 1) * (V.type === 'diff' && da < 0 ? 1.3 : 1) };
        rearCraft(c, C, rx, ry, kr, x[3], 3 * D2R, 1, ail);
        kit.label(c, 'from behind: bank ' + sgn(x[3] * R2D, 0) + '°', rx, 16, { color: C.text, size: 12, align: 'center', weight: 700 });
        // the slip ball: it moves opposite to the side force on the aircraft
        const ay = M.Q * 16.2 * (M.c.Cyb * x[0] + M.c.Cydr * dr) / 1100, bx = clamp(-ay / G / 0.06, -1, 1);
        const bcx = rx, bcy = H * 0.72, bw = 70;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.bg2;
        c.beginPath(); c.moveTo(bcx - bw, bcy - 10); c.quadraticCurveTo(bcx, bcy + 14, bcx + bw, bcy - 10); c.lineTo(bcx + bw, bcy + 4); c.quadraticCurveTo(bcx, bcy + 28, bcx - bw, bcy + 4); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(bcx - 9, bcy - 2); c.lineTo(bcx - 9, bcy + 18); c.moveTo(bcx + 9, bcy - 2); c.lineTo(bcx + 9, bcy + 18); c.stroke();
        const ballX = bcx + bx * (bw - 12), u = (ballX - bcx) / bw, ballY = bcy + 9 - 12 * u * u;
        kit.dot(c, ballX, ballY, 7, Math.abs(bx) < 0.12 ? C.ok : C.warn, C.text);
        kit.label(c, 'slip ball', bcx, bcy + 34, { color: C.muted, size: 11, align: 'center' });
        // yawing moments now (nose-right positive), as bars
        const Nda = M.QSb * M.c.Cnda * da, Np = M.QSb * M.c.Cnp * x[1] * 11 / (2 * V.V), Ndr = M.QSb * M.c.Cndr * dr, Nfin = M.QSb * (M.c.Cnb * x[0] + M.c.Cnr * x[2] * 11 / (2 * V.V));
        const nMax = Math.max(400, Math.abs(Nda), Math.abs(Np), Math.abs(Ndr), Math.abs(Nfin));
        const mx = W * 0.86, my0 = H * 0.2, bl = W * 0.1;
        kit.label(c, 'yawing moments', mx, my0 - 16, { color: C.muted, size: 11, align: 'center', weight: 600 });
        [['aileron', Nda, C.warn], ['roll rate', Np, C.series[1]], ['rudder', Ndr, C.accent], ['fin', Nfin, C.ok]].forEach(([lab, n, col], i) => {
          const y = my0 + i * 26, w = bl * n / nMax;
          c.fillStyle = col; c.globalAlpha = 0.8; c.fillRect(Math.min(mx, mx + w), y, Math.abs(w), 10); c.globalAlpha = 1;
          kit.label(c, lab, mx - bl - 4, y + 5, { color: C.muted, size: 10.5, align: 'right' });
        });
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(mx, my0 - 4); c.lineTo(mx, my0 + 104); c.stroke();
        kit.label(c, '← nose left   nose right →', mx, my0 + 116, { color: C.faint, size: 10, align: 'center' });
        if (!run && !tr.length) kit.label(c, 'press Roll right', W / 2, H - 12, { color: C.muted, size: 12, align: 'center' });
        if (stats && stats.halt) kit.label(c, 'bank beyond 60°: the small-angle model stops here', W / 2, H - 12, { color: C.warn, size: 12, align: 'center', weight: 700 });
        // read-outs
        ro.set('sw', stats ? (Math.abs(stats.sw) > 0.0005 ? sgn(stats.sw * R2D, 2) + '° (away from the turn)' : 'none') : '—');
        ro.set('bmax', stats ? sgn(stats.bmax * R2D, 2) + '°' : '—');
        ro.set('bank', sgn(x[3] * R2D, 1) + '°');
        ro.set('pk', stats ? fx(Math.abs(stats.pk) * R2D, 0) + ' °/s' : '—');
        ro.set('rud', sgn(dr * R2D, 1) + '°' + (V.coord ? '' : ' (feet off)'));
        ro.set('cn', fx(ty.Cnda, 3) + ' per rad (' + ty.name + ')' + (ty.Cnda < 0 ? ' — adverse' : ' — proverse'));
      }, box.stage);
      build();
      loop.start();
    }
  });
})();
