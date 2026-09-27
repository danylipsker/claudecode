/* HYPER-AERODYNAMICS · sims/propulsion.js — simulations for the Propulsion branch.
 *   prop-actuator-disc  the actuator disc of momentum theory: the stream tube, the speed and the
 *                       pressure along the axis, induced velocity and ideal power (standard atmosphere)
 *   prop-efficiency     the same thrust from a lot of air slowly or a little air fast: propulsive
 *                       efficiency, the size of the stream tube and the power left in the wake
 *   prop-map            a propeller by blade-element momentum theory: the velocity triangle at 0.75 R
 *                       and the map (η against J for every blade angle), fixed pitch or constant speed
 *   prop-brayton        a turbojet, or without its compressor a ramjet, station by station: the gas path,
 *                       the T–s diagram and the specific thrust against flight Mach number
 *   prop-turbofan       a two-stream turbofan cycle at any bypass ratio: jets, fan size, fuel and efficiencies
 *   prop-rocket         staging with the rocket equation: Δv stage by stage, and a launch to watch it
 *   prop-electric       batteries against kerosene: the range of the same aircraft with each
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, G0 = 9.80665, KT = 1852 / 3600;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pick = (params, k, def) => (params && params[k] != null ? params[k] : def);
  const graphDiv = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 8px'; box.stage.appendChild(d); return d; };
  const powerTxt = (P, fmt) => Math.abs(P) >= 1e6 ? fmt(P / 1e6, 3) + ' MW' : Math.abs(P) >= 1e3 ? fmt(P / 1e3, 3) + ' kW' : fmt(P, 3) + ' W';
  const forceTxt = (F, fmt) => Math.abs(F) >= 1e6 ? fmt(F / 1e6, 3) + ' MN' : Math.abs(F) >= 1e3 ? fmt(F / 1e3, 3) + ' kN' : fmt(F, 3) + ' N';

  /* ================================================================ a gas-turbine cycle
     One-dimensional, per kilogram of core air, with cold-air (cp 1004.5, γ 1.4) and hot-gas
     (cp 1150, γ 1.33) properties, kerosene of 43 MJ/kg, polytropic efficiencies of 0.90 and the
     usual pressure losses (intake, combustor, nozzles); nozzles expand fully to ambient pressure.
     Stations: 0 free stream, 2 fan/compressor face, 13 fan exit, 3 compressor exit, 4 turbine entry,
     5 turbine exit, 7 afterburner exit, 9 core jet, 19 bypass jet. */
  const CPC = 1004.5, GC = 1.4, CPH = 1150, GH = 1.33, QR = 43e6;
  const RC = CPC * (GC - 1) / GC, RH = CPH * (GH - 1) / GH, KC = (GC - 1) / GC, KH = (GH - 1) / GH;
  function cycle(F, o) {
    const air = F.isa(o.h), T0 = air.T, p0 = air.p, V0 = o.M * air.a, id = !!o.ideal, ep = id ? 1 : 0.9;
    const pid = id ? 1 : (o.M <= 1 ? 0.98 : 0.98 * (1 - 0.075 * Math.pow(o.M - 1, 1.35)));   // intake pressure recovery
    const pib = id ? 1 : 0.95, pin = id ? 1 : 0.985, etab = id ? 1 : 0.99, etam = id ? 1 : 0.99;
    const tr = 1 + (GC - 1) / 2 * o.M * o.M;
    const r = { ok: false, why: '', T0, p0, V0, a0: air.a, rho: air.rho, M: o.M, tr };
    r.Tt0 = T0 * tr; r.pt0 = p0 * Math.pow(tr, 1 / KC);
    r.Tt2 = r.Tt0; r.pt2 = r.pt0 * pid;
    const bpr = Math.max(0, o.bpr || 0), fpr = bpr > 0 ? clamp(o.fpr || 1, 1, o.opr) : 1;
    r.bpr = bpr; r.fpr = fpr; r.opr = o.opr;
    r.Tt13 = r.Tt2 * Math.pow(fpr, KC / ep); r.pt13 = r.pt2 * fpr;
    r.Tt3 = r.Tt2 * Math.pow(o.opr, KC / ep); r.pt3 = r.pt2 * o.opr;
    r.Tt4 = o.tt4; r.pt4 = r.pt3 * pib;
    if (r.Tt3 > o.tt4 - 40) { r.why = 'hot'; return r; }
    const f = (CPH * o.tt4 - CPC * r.Tt3) / (etab * QR - CPH * o.tt4);
    const work = CPC * ((r.Tt3 - r.Tt2) + bpr * (r.Tt13 - r.Tt2));
    r.Tt5 = o.tt4 - work / (etam * (1 + f) * CPH);
    if (r.Tt5 < 0.35 * o.tt4) { r.why = 'turbine'; return r; }
    r.pt5 = r.pt4 * Math.pow(r.Tt5 / o.tt4, 1 / (KH * ep));
    let fab = 0; r.Tt7 = r.Tt5; r.pt7 = r.pt5;
    if (o.ab && o.ab > r.Tt5 + 10) { fab = (1 + f) * CPH * (o.ab - r.Tt5) / ((id ? 1 : 0.95) * QR - CPH * o.ab); r.Tt7 = o.ab; r.pt7 = r.pt5 * (id ? 1 : 0.95); }
    r.f = f + fab; r.fcore = f; r.fab = fab;
    r.pt9 = r.pt7 * pin;
    const pt19 = r.pt13 * pin;
    if (r.pt9 <= p0 * 1.0005) { r.why = 'core'; return r; }
    r.V9 = Math.sqrt(2 * CPH * r.Tt7 * (1 - Math.pow(p0 / r.pt9, KH)));
    r.T9 = r.Tt7 - r.V9 * r.V9 / (2 * CPH);
    r.V19 = bpr > 0 && pt19 > p0 ? Math.sqrt(2 * CPC * r.Tt13 * (1 - Math.pow(p0 / pt19, KC))) : 0;
    r.Fc = (1 + r.f) * r.V9 - V0 + bpr * (r.V19 - V0);          // thrust per kg/s of core air
    if (!(r.Fc > 0)) { r.why = 'drag'; return r; }
    r.Fs = r.Fc / (1 + bpr);                                      // per kg/s of all the air
    r.fanShare = bpr * (r.V19 - V0) / r.Fc;
    const ke = 0.5 * ((1 + r.f) * r.V9 * r.V9 + bpr * r.V19 * r.V19 - (1 + bpr) * V0 * V0);
    r.sfc = r.f / r.Fc;                                           // kg/(N·s)
    r.ct = G0 * r.sfc;                                            // 1/s; × 3600 gives lb/(lbf·h)
    r.etaTh = ke / (r.f * QR);
    r.etaP = V0 > 0 ? r.Fc * V0 / ke : 0;
    r.etaO = r.Fc * V0 / (r.f * QR);
    r.ok = true;
    return r;
  }
  // the fan pressure ratio that burns the least fuel for the thrust
  function bestFan(F, o) {
    if (!(o.bpr > 0)) return cycle(F, Object.assign({}, o, { fpr: 1 }));
    let best = null;
    for (let fpr = 1.04; fpr <= Math.min(6, o.opr); fpr *= 1.015) {
      const r = cycle(F, Object.assign({}, o, { fpr }));
      if (r.ok && (!best || r.sfc < best.sfc)) best = r;
    }
    return best || cycle(F, Object.assign({}, o, { fpr: 1.5 }));
  }
  const tsfcTxt = (r, fmt) => fmt(r.ct * 3600, 3) + ' lb/(lbf·h)  ·  ' + fmt(r.sfc * 1e6, 3) + ' g/(kN·s)';

  /* ================================================================ a propeller by blade-element momentum theory
     Radius 1, diameter 2, one revolution per second, air density 1: the advance ratio is J = V/2 and
     every speed scales with nD/2. Constant geometric pitch set by the blade angle at 0.75 R; a
     cambered section (lift slope 0.92·2π, zero-lift angle −2.5°, c_l,max 1.4 with a soft stall,
     profile drag rising with c_l and past 12°); Prandtl's tip loss; solved for the inflow angle φ. */
  const PN = 20, PRH = 0.18, CLMAX = 1.4;
  const STALL_DEG = CLMAX / (2 * Math.PI * 0.92) / D2R - 2.5;             // where the section's c_l reaches c_l,max (≈ 11.4°)
  const pChord = r => 0.175 * (1 - 0.55 * Math.pow((r - 0.35) / 0.65, 2)) * (r < 0.35 ? 0.75 + 0.25 * (r - PRH) / (0.35 - PRH) : 1);
  function airfoilSection(al) {
    let cl = 2 * Math.PI * 0.92 * (al + 2.5 * D2R);
    if (cl > CLMAX) cl = CLMAX - 0.35 * Math.min(1, (cl - CLMAX) / 0.6);
    if (cl < -0.8) cl = -0.8;
    const ad = Math.abs(al) / D2R;
    return { cl, cd: 0.012 + 0.016 * (cl - 0.25) * (cl - 0.25) + (ad > 12 ? 0.02 * (ad - 12) : 0) };
  }
  function bladeStation(r, th, Vx, B) {
    const Vy = 2 * Math.PI * r, sig = B * pChord(r) / (2 * Math.PI * r);
    const parts = phi => {
      const s = Math.sin(phi), c = Math.cos(phi), se = airfoilSection(th - phi);
      const cn = se.cl * c - se.cd * s, ct = se.cl * s + se.cd * c;
      const Fl = Math.max(0.02, 2 / Math.PI * Math.acos(Math.min(1, Math.exp(-B / 2 * (1 - r) / (r * Math.max(1e-6, s))))));
      return { s, c, cl: se.cl, cd: se.cd, cn, ct, k: sig * cn / (4 * Fl * s * s), kp: sig * ct / (4 * Fl * s * c) };
    };
    // momentum and blade element agree when sin φ (1 − k) = (Vx/Vy) cos φ (1 + k')
    const resid = phi => { const q = parts(phi); return q.s * (1 - q.k) - Vx / Vy * q.c * (1 + q.kp); };
    let a = 1e-3, fa = resid(a), phi = Math.max(0.02, Math.atan2(Vx, Vy));
    for (let i = 1; i <= 36; i++) {
      let b = 1e-3 + (Math.PI / 2 - 2e-3) * i / 36, fb = resid(b);
      if (Number.isFinite(fa) && Number.isFinite(fb) && (fa < 0) !== (fb < 0)) {
        for (let it = 0; it < 36; it++) { const m = (a + b) / 2, fm = resid(m); if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m; }
        phi = (a + b) / 2; break;
      }
      a = b; fa = fb;
    }
    const q = parts(phi), Wt = Vy / (1 + q.kp), W = Wt / q.c, cc = pChord(r);
    return { phi, al: th - phi, cl: q.cl, cd: q.cd, W, Wa: W * q.s, Wt, dT: 0.5 * W * W * B * cc * q.cn, dQ: 0.5 * W * W * B * cc * q.ct * r };
  }
  const pitchOf = betaDeg => 2 * Math.PI * 0.75 * Math.tan(betaDeg * D2R);
  function propeller(J, betaDeg, B) {
    const Vx = 2 * J, p = pitchOf(betaDeg), dr = (1 - PRH) / PN;
    let T = 0, Q = 0;
    for (let i = 0; i < PN; i++) {
      const r = PRH + (1 - PRH) * (i + 0.5) / PN, s = bladeStation(r, Math.atan(p / (2 * Math.PI * r)), Vx, B);
      T += s.dT * dr; Q += s.dQ * dr;
    }
    const CT = T / 16, CP = 2 * Math.PI * Q / 32;                 // n = 1, D = 2, ρ = 1
    return { CT, CP, eta: CT > 0 && CP > 0 ? J * CT / CP : 0 };
  }

  /* ================================================================ 1. the actuator disc */
  Hyper.sim('prop-actuator-disc', {
    title: 'The actuator disc',
    blurb: `Momentum theory replaces a propeller or rotor by a thin disc that adds a pressure jump $\\Delta p = T/A$ to the air passing through it. The air speeds up *before* it reaches the disc — half the increase happens ahead of it — so the stream tube narrows. The speed, pressure and power all follow from thrust, disc area, flight speed and air density ($\\rho$ from the standard atmosphere).

**Try this**
- Start with the propeller in cruise: the induced velocity is small compared with the flight speed, and the ideal efficiency is over 90 %.
- Switch to the static propeller and the hovering helicopter: with no flight speed, all the power goes into the wake. Compare their *power loading* (newtons per kilowatt).
- Double the diameter of the helicopter rotor at the same thrust: the ideal power falls by $\\sqrt{2}$ — big, lightly loaded discs are efficient.
- Climb to 5000 m in hover: thinner air needs about 30 % more induced velocity and power.
- Watch the pressure plot: suction ahead of the disc, a jump across it, and a pressure above ambient that decays behind it.`,
    mount(box, kit, params) {
      const F = kit.fluid, fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const g1 = graphDiv(box), g2 = graphDiv(box);
      const presets = { prop: { T: 1500, D: 1.9, V: 60, h: 2000 }, static: { T: 3000, D: 1.9, V: 0, h: 0 }, heli: { T: 10790, D: 10.06, V: 0, h: 0 }, quad: { T: 2.94, D: 0.254, V: 0, h: 0 } };
      const pre = pick(params, 'preset', 'prop'), P0 = presets[pre] || presets.prop;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Example', options: [['Light-aircraft propeller, cruise', 'prop'], ['The same propeller, static', 'static'], ['Light helicopter (1100 kg), hover', 'heli'], ['Quadcopter rotor (1.2 kg drone), hover', 'quad'], ['Your own', 'own']], value: presets[pre] ? pre : 'prop' },
        { id: 'T', label: 'Thrust T', min: 1, max: 30000, value: P0.T, unit: 'N', log: true, sig: 3 },
        { id: 'D', label: 'Disc diameter D', min: 0.1, max: 15, value: P0.D, unit: 'm', log: true, sig: 3 },
        { id: 'V', label: 'Flight speed V', min: 0, max: 120, step: 1, value: P0.V, unit: 'm/s' },
        { id: 'h', label: 'Altitude', min: 0, max: 5000, step: 100, value: P0.h, unit: 'm' }
      ], (id, v) => {
        if (id === 'preset') { const p = presets[v]; if (p) for (const k of ['T', 'D', 'V', 'h']) ctl.set(k, p[k]); }
        else ctl.set('preset', 'own');
        solve();
      });
      const ro = kit.readout(box.side, [['rho', 'Air density ρ'], ['v', 'Induced velocity at the disc, v'], ['Vd', 'Speed through the disc, V + v'], ['Vw', 'Far-wake speed, V + 2v'],
        ['m', 'Mass flow through the disc'], ['dp', 'Disc loading T/A = pressure jump Δp'], ['P', 'Ideal power T(V + v)'], ['Pu', 'Useful power T·V'], ['eta', 'Ideal efficiency V/(V + v)'], ['pl', 'Power loading T/P']]);
      const plotU = kit.plot(g1, { x: { label: 'distance along the axis, x / R', min: -3, max: 5, name: 'x/R' }, y: { label: 'air speed (m/s)', min: 0, name: 'u' } }, 140);
      const plotP = kit.plot(g2, { x: { label: 'distance along the axis, x / R', min: -3, max: 5, name: 'x/R' }, y: { label: 'p − p∞ (Pa)', name: 'Δp' } }, 140);
      const V = ctl.values;
      let S = null;
      const uAt = xi => V.V + S.v * (1 + xi / Math.sqrt(xi * xi + 1));         // axial speed (vortex-cylinder model of the disc)
      const pAt = (xi, u, after) => 0.5 * S.rho * ((after ? S.Vw * S.Vw : V.V * V.V) - u * u);
      function solve() {
        const air = F.isa(V.h), rho = air.rho, R = V.D / 2, A = Math.PI * R * R;
        const v = -V.V / 2 + Math.sqrt(V.V * V.V / 4 + V.T / (2 * rho * A));
        S = { rho, R, A, v, Vw: V.V + 2 * v, mdot: rho * A * (V.V + v), P: V.T * (V.V + v), Pu: V.T * V.V, dp: V.T / A };
        ro.set('rho', rho.toFixed(3) + ' kg/m³');
        ro.set('v', fmt(v) + ' m/s');
        ro.set('Vd', fmt(V.V + v) + ' m/s');
        ro.set('Vw', fmt(S.Vw) + ' m/s');
        ro.set('m', fmt(S.mdot) + ' kg/s');
        ro.set('dp', fmt(S.dp) + ' Pa');
        ro.set('P', powerTxt(S.P, fmt) + ' (' + fmt(S.P / 745.7) + ' hp)');
        ro.set('Pu', V.V > 0 ? powerTxt(S.Pu, fmt) : '0 — nothing is moving');
        ro.set('eta', V.V > 0 ? (100 * V.V / (V.V + v)).toFixed(1) + ' %' : '0 % (judge a hover by power loading)');
        ro.set('pl', fmt(V.T / (S.P / 1000)) + ' N per kW');
        const us = [], ps = [];
        for (let i = 0; i <= 60; i++) { const xi = -3 + 3 * i / 60, u = uAt(xi); us.push([xi, u]); ps.push([xi, pAt(xi, u, false)]); }
        for (let i = 0; i <= 100; i++) { const xi = 5 * i / 100, u = uAt(xi); us.push([xi, u]); ps.push([xi, pAt(xi, u, true)]); }
        plotU.set({ series: [{ pts: us, label: 'speed on the axis' }], hlines: [{ y: V.V, label: 'flight speed V' }, { y: S.Vw, label: 'far wake V + 2v' }], vlines: [{ x: 0, label: 'disc' }] });
        plotP.set({ series: [{ pts: ps, label: 'pressure on the axis', color: kit.colors().series[1] }], hlines: [{ y: 0 }], vlines: [{ x: 0, label: 'Δp = ' + fmt(S.dp) + ' Pa' }] });
        loop.once();
      }
      const parts = [];
      for (let i = 0; i < 220; i++) parts.push({ xi: -3 + 8 * Math.random(), e: 2 * Math.random() - 1 });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const Rp = Math.min(st.W / 8.8, st.H * 0.25), xd = (st.W - 8 * Rp) / 2 + 3 * Rp, yc = st.H / 2 + 10;
        const X = xi => xd + xi * Rp, rMax = (st.H / 2 - 12) / Rp;
        const rAt = xi => Math.min(rMax, Math.sqrt((V.V + S.v) / Math.max(1e-9, uAt(xi))));   // stream-tube radius / R
        // the stream tube
        c.beginPath();
        for (let i = 0; i <= 160; i++) { const xi = -3 + 8 * i / 160, y = yc - rAt(xi) * Rp; i ? c.lineTo(X(xi), y) : c.moveTo(X(xi), y); }
        for (let i = 160; i >= 0; i--) { const xi = -3 + 8 * i / 160; c.lineTo(X(xi), yc + rAt(xi) * Rp); }
        c.closePath(); c.fillStyle = C.hue(200, 0.1); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.stroke();
        c.setLineDash([4, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(X(-3), yc); c.lineTo(X(5), yc); c.stroke(); c.setLineDash([]);
        // particles inside the tube, coloured from flight speed (blue) to far-wake speed (red)
        const umax = Math.max(1e-6, S.Vw);
        for (const q of parts) {
          const u = uAt(q.xi);
          q.xi += u / umax * 150 / Rp * dt;
          if (q.xi > 5) { q.xi = -3 + 0.05 * Math.random(); q.e = 2 * Math.random() - 1; }
          const f = (u - V.V) / Math.max(1e-9, S.Vw - V.V);
          c.fillStyle = C.hue(215 - 207 * clamp(f, 0, 1), 0.85);
          const y = yc + q.e * rAt(q.xi) * Rp * 0.95;
          c.fillRect(X(q.xi) - 1.5, y - 1.5, 3, 3);
        }
        // the disc
        c.fillStyle = C.warn; c.fillRect(X(0) - 3, yc - Rp, 6, 2 * Rp);
        kit.label(c, 'disc Ø ' + fmt(V.D) + ' m', X(0), yc - Rp - 10, { align: 'center', color: C.text, size: 12, weight: 700, bg: C.surface });
        kit.label(c, 'Δp = ' + fmt(S.dp) + ' Pa', X(0), yc + Rp + 12, { align: 'center', color: C.warn, size: 12, weight: 700 });
        kit.label(c, 'far upstream  V = ' + fmt(V.V) + ' m/s', X(-2.9), 14, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'at the disc  V + v = ' + fmt(V.V + S.v) + ' m/s', X(0), 32, { align: 'center', color: C.text, size: 12 });
        kit.label(c, 'far wake  V + 2v = ' + fmt(S.Vw) + ' m/s', X(4.9), 14, { align: 'right', color: C.bad, size: 12, weight: 700 });
        if (V.V > 0) for (let i = 0; i < 4; i++) { const y = yc - rMax * Rp * 0.8 + i * rMax * Rp * 0.53; kit.arrow(c, 6, y, 34, y, C.faint, 1.2); }
        else kit.label(c, 'hover / static: the air is drawn in from all round', X(-2.9), st.H - 12, { align: 'left', color: C.muted, size: 11.5 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ 2. propulsive efficiency */
  Hyper.sim('prop-efficiency', {
    title: 'Lots of air slowly, or a little air fast',
    blurb: `Every propulsor gives the thrust $T = \\dot m\\,(V_e - V_0)$. The same thrust can come from a large mass flow speeded up a little or a small one speeded up a lot — but the kinetic energy left behind in the wake, $\\tfrac12\\dot m (V_e - V_0)^2$, is very different. The stream tube is drawn to scale for the chosen thrust; the bar on top splits the power put into the jet into the useful part $T V_0$ and the part wasted in the wake.

**Try this**
- Step through propeller, high-bypass fan, low-bypass fan and turbojet at 240 m/s and 25 kN: watch the stream tube shrink and the wasted power grow.
- Push the ratio towards 1: efficiency approaches 100 %, but the mass flow — and the size of the propulsor — grows without limit.
- Keep the turbojet ratio and raise the flight speed to 600 m/s (Mach 2): a fast aircraft can afford a fast jet.
- Double the thrust at a fixed ratio: the mass flow doubles, the tube diameter grows by √2.`,
    mount(box, kit, params) {
      const F = kit.fluid, fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const g1 = graphDiv(box), g2 = graphDiv(box);
      const types = [['Propeller (Ve/V₀ ≈ 1.1)', 1.1], ['High-bypass turbofan (≈ 1.4)', 1.4], ['Low-bypass turbofan (≈ 2)', 2], ['Turbojet (≈ 2.8)', 2.8], ['Your own ratio', 0]];
      const r0 = clamp(pick(params, 'ratio', 1.4), 1.02, 6);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Propulsor', options: types, value: types.some(t => t[1] === r0) ? r0 : 0 },
        { id: 'r', label: 'Jet speed ÷ flight speed, Ve/V₀', min: 1.02, max: 6, step: 0.01, value: r0 },
        { id: 'V0', label: 'Flight speed V₀', min: 20, max: 700, step: 5, value: pick(params, 'V0', 240), unit: 'm/s' },
        { id: 'T', label: 'Thrust T', min: 1, max: 300, value: pick(params, 'T', 25), unit: 'kN', log: true, sig: 3 },
        { id: 'h', label: 'Altitude', min: 0, max: 15000, step: 250, value: pick(params, 'h', 11000), unit: 'm' }
      ], (id, v) => {
        if (id === 'type') { if (v > 0) ctl.set('r', v); }
        else if (id === 'r') ctl.set('type', types.some(t => t[1] === v) ? v : 0);
        solve();
      });
      const ro = kit.readout(box.side, [['Ve', 'Jet speed Ve'], ['md', 'Air mass flow ṁ = T/(Ve − V₀)'], ['cap', 'Capture stream tube Ø'], ['disc', 'Disc Ø (momentum theory)'],
        ['eta', 'Propulsive efficiency 2/(1 + Ve/V₀)'], ['Pu', 'Useful power T·V₀'], ['Pw', 'Left in the wake ½ṁ(Ve − V₀)²'], ['Pj', 'Power put into the jet']]);
      const plotE = kit.plot(g1, { x: { label: 'jet speed ÷ flight speed, Ve/V₀', min: 1, max: 6, name: 'Ve/V₀' }, y: { label: 'propulsive efficiency', min: 0, max: 1, name: 'η' } }, 150);
      const plotP = kit.plot(g2, { x: { label: 'jet speed ÷ flight speed, Ve/V₀', min: 1, max: 6, name: 'Ve/V₀' }, y: { label: 'power into the jet (MW)', min: 0, name: 'P' } }, 140);
      const V = ctl.values;
      let S = null;
      function solve() {
        const air = F.isa(V.h), rho = air.rho, V0 = V.V0, Ve = V.r * V0, T = V.T * 1000;
        const mdot = T / (Ve - V0), Pu = T * V0, Pw = 0.5 * mdot * (Ve - V0) * (Ve - V0);
        const A0 = mdot / (rho * V0), Ad = mdot / (rho * (V0 + Ve) / 2);
        const Aref = T / (1.1 * V0 - V0) / (rho * V0);                 // the capture area a propeller (ratio 1.1) would need: the drawing's scale
        S = { rho, V0, Ve, mdot, Pu, Pw, eta: 2 / (1 + V.r), r0: Math.sqrt(A0 / Math.PI), rd: Math.sqrt(Ad / Math.PI), rref: Math.sqrt(Aref / Math.PI) };
        ro.set('Ve', fmt(Ve) + ' m/s');
        ro.set('md', fmt(mdot) + ' kg/s');
        ro.set('cap', fmt(2 * S.r0) + ' m');
        ro.set('disc', fmt(2 * S.rd) + ' m');
        ro.set('eta', (100 * S.eta).toFixed(1) + ' %');
        ro.set('Pu', powerTxt(Pu, fmt));
        ro.set('Pw', powerTxt(Pw, fmt));
        ro.set('Pj', powerTxt(Pu + Pw, fmt));
        const ep = [], pp = [];
        for (let i = 0; i <= 250; i++) { const x = 1 + 5 * i / 250; ep.push([x, 2 / (1 + x)]); pp.push([x, T * V0 * (1 + x) / 2 / 1e6]); }
        plotE.set({ series: [{ pts: ep, label: 'η = 2/(1 + Ve/V₀)' }], marks: [{ x: V.r, y: S.eta, label: (100 * S.eta).toFixed(0) + ' %' }],
          vlines: [{ x: 1.1, label: 'prop' }, { x: 1.4, label: 'fan' }, { x: 2, label: 'low bypass' }, { x: 2.8, label: 'turbojet' }] });
        plotP.set({ series: [{ pts: pp, label: 'power into the jet', color: kit.colors().series[1] }], marks: [{ x: V.r, y: (Pu + Pw) / 1e6, label: fmt((Pu + Pw) / 1e6) + ' MW' }],
          hlines: [{ y: Pu / 1e6, label: 'useful power T·V₀ = ' + fmt(Pu / 1e6) + ' MW' }] });
        loop.once();
      }
      const parts = [];
      for (let i = 0; i < 200; i++) parts.push({ x: Math.random(), e: 2 * Math.random() - 1 });
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const top = 46, yc = top + (st.H - top) / 2, half = (st.H - top) / 2 - 8;
        const pxm = half * 0.95 / S.rref;                                      // pixels per metre: a propeller's tube fills the height
        const Rd = Math.max(2, S.rd * pxm), xd = st.W * 0.44;
        const uAt = xi => S.V0 + (S.Ve - S.V0) / 2 * (1 + xi / Math.sqrt(xi * xi + 1));
        const rAt = x => { const u = uAt((x - xd) / Rd); return Math.min(half, S.rd * Math.sqrt((S.V0 + S.Ve) / 2 / u) * pxm); };
        // power bar
        const bw = st.W - 24, fu = S.Pu / (S.Pu + S.Pw);
        c.fillStyle = C.ok; c.fillRect(12, 8, bw * fu, 12);
        c.fillStyle = C.bad; c.fillRect(12 + bw * fu, 8, bw * (1 - fu), 12);
        kit.label(c, 'useful T·V₀ ' + (100 * fu).toFixed(0) + ' %', 14, 32, { align: 'left', color: C.ok, size: 12, weight: 700 });
        kit.label(c, 'left in the wake ' + (100 * (1 - fu)).toFixed(0) + ' %', st.W - 14, 32, { align: 'right', color: C.bad, size: 12, weight: 700 });
        // the stream tube
        c.save(); c.beginPath(); c.rect(0, top, st.W, st.H - top); c.clip();
        c.beginPath();
        for (let x = 0; x <= st.W; x += 4) { const y = yc - rAt(x); x ? c.lineTo(x, y) : c.moveTo(x, y); }
        for (let x = Math.floor(st.W / 4) * 4; x >= 0; x -= 4) c.lineTo(x, yc + rAt(x));
        c.closePath(); c.fillStyle = C.hue(200, 0.1); c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke();
        for (const q of parts) {
          const X = q.x * st.W, u = uAt((X - xd) / Rd);
          q.x += u / S.Ve * 170 / st.W * dt;
          if (q.x > 1) { q.x = 0.02 * Math.random(); q.e = 2 * Math.random() - 1; }
          const f = (u - S.V0) / Math.max(1e-9, S.Ve - S.V0);
          c.fillStyle = C.hue(215 - 207 * clamp(f, 0, 1), 0.85);
          c.fillRect(X - 1.4, yc + q.e * rAt(X) * 0.95 - 1.4, 2.8, 2.8);
        }
        c.restore();
        c.fillStyle = C.warn; c.fillRect(xd - 3, yc - Rd, 6, 2 * Rd);
        kit.label(c, 'propulsor Ø ' + fmt(2 * S.rd) + ' m', xd, clamp(yc - Rd - 12, top + 8, st.H - 8), { align: 'center', color: C.text, size: 12, weight: 700, bg: C.surface });
        kit.label(c, 'V₀ = ' + fmt(S.V0) + ' m/s', 10, st.H - 12, { align: 'left', color: C.muted, size: 12 });
        kit.label(c, 'Ve = ' + fmt(S.Ve) + ' m/s', st.W - 10, st.H - 12, { align: 'right', color: C.bad, size: 12, weight: 700 });
        // a scale bar
        const nice = Hyper.niceStep(st.W * 0.18 / pxm, 1), L = nice * pxm;
        c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(st.W - 14 - L, top + 10); c.lineTo(st.W - 14, top + 10); c.moveTo(st.W - 14 - L, top + 5); c.lineTo(st.W - 14 - L, top + 15); c.moveTo(st.W - 14, top + 5); c.lineTo(st.W - 14, top + 15); c.stroke();
        kit.label(c, fmt(nice) + ' m', st.W - 14 - L / 2, top + 22, { align: 'center', color: C.text, size: 11.5 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ 3. the propeller map */
  Hyper.sim('prop-map', {
    title: 'A propeller: velocity triangle and map',
    blurb: `A propeller computed by blade-element momentum theory: each slice of blade is a small wing meeting the air at the resultant of the flight speed and its own rotation, and the momentum it gives the air must match the force on it. Above: the section at 75 % of the radius, with the blade angle $\\beta$, the inflow angle $\\varphi$ and the angle of attack $\\alpha = \\beta - \\varphi$. Below: the map — efficiency against advance ratio $J = V/(nD)$ for every blade angle — and the thrust and power coefficients.

**Try this**
- Fixed pitch, β = 22°: sweep the airspeed from 0 to 180 kt. The efficiency climbs from zero, peaks above 0.8 and collapses where the blade meets the air nearly edge-on and makes no thrust.
- At 0 kt with a coarse β = 35° the blade is stalled — α far past the stall — and the thrust is poor although the engine works hard: why a fixed "cruise" propeller gives a weak takeoff.
- Switch to **constant speed** and hold the power: as you speed up, the governor coarsens the blades and the operating point rides along the peaks of the curves.
- Try the turboprop: six blades, 3.9 m, about 1000 rpm and 1600 kW at 270 kt. Its tips run close to the speed of sound — the reason turboprops stop at around 300 knots.
- The model's peak efficiencies are a few per cent better than real propellers, which also lose to the hub, the spinner and compressibility at the tips.`,
    mount(box, kit, params) {
      const F = kit.fluid, fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 230 });
      const g1 = graphDiv(box), g2 = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Propeller', options: [['Fixed pitch: you set the blade angle', 'fixed'], ['Constant speed: the governor sets it', 'cs']], value: pick(params, 'mode', 'fixed') },
        { id: 'B', type: 'select', label: 'Blades', options: [['2', 2], ['3', 3], ['4', 4], ['6', 6]], value: pick(params, 'B', 2) },
        { id: 'beta', label: 'Blade angle at 0.75 R, β', min: 10, max: 60, step: 0.5, value: pick(params, 'beta', 22), unit: '°' },
        { id: 'P', label: 'Engine power (held by the governor)', min: 20, max: 3000, value: pick(params, 'P', 110), unit: 'kW', log: true, sig: 3 },
        { id: 'V', label: 'True airspeed', min: 0, max: 320, step: 1, value: pick(params, 'V', 110), unit: 'kt' },
        { id: 'rpm', label: 'Propeller speed', min: 800, max: 3000, step: 10, value: pick(params, 'rpm', 2400), unit: 'rpm' },
        { id: 'D', label: 'Diameter', min: 1.5, max: 4.5, step: 0.05, value: pick(params, 'D', 1.9), unit: 'm' },
        { id: 'h', label: 'Altitude', min: 0, max: 8000, step: 100, value: pick(params, 'h', 1500), unit: 'm' }
      ], id => { if (id === 'B') buildMap(); solve(); });
      const ro = kit.readout(box.side, [['J', 'Advance ratio J = V/(nD)'], ['beta', 'Blade angle β (0.75 R)'], ['al', 'Angle of attack α (0.75 R)'], ['ct', 'Thrust coefficient C_T'], ['cp', 'Power coefficient C_P'],
        ['eta', 'Efficiency η = J·C_T/C_P'], ['T', 'Thrust'], ['P', 'Shaft power absorbed'], ['tip', 'Helical tip Mach number'], ['note', '']]);
      const plotM = kit.plot(g1, { x: { label: 'advance ratio J = V/(nD)', min: 0, max: 3.6, name: 'J' }, y: { label: 'efficiency η', min: 0, max: 1, name: 'η' } }, 170);
      const plotC = kit.plot(g2, { x: { label: 'advance ratio J', min: 0, max: 3.6, name: 'J' }, y: { label: 'C_T and C_P', name: 'C' } }, 130);
      const V = ctl.values;
      let map = [], S = null, spin = 0;
      const BETAS = [10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
      function buildMap() {
        map = BETAS.map(b => { const pts = []; for (let J = 0; J <= 3.6001; J += 0.05) { const r = propeller(J, b, V.B); pts.push([J, r.CT > 0 ? r.eta : NaN]); } return { b, pts }; });
      }
      function solve() {
        ctl.show('beta', V.mode !== 'cs'); ctl.show('P', V.mode === 'cs');
        const air = F.isa(V.h), n = V.rpm / 60, Vms = V.V * KT, J = Vms / (n * V.D), dens = air.rho * n * n * n * Math.pow(V.D, 5);
        let beta = V.beta, note = '';
        if (V.mode === 'cs') {                                       // the governor: the blade angle that absorbs the power at this rpm
          const need = V.P * 1000 / dens, cpAt = b => propeller(J, b, V.B).CP;
          let lo = 10, flo = cpAt(lo) - need, found = false;
          if (flo > 0) { beta = 10; note = 'Fine-pitch stop: the engine cannot hold this rpm'; }
          else {
            for (let b = 12.5; b <= 60.001; b += 2.5) {
              const fb = cpAt(b) - need;
              if (fb >= 0) { let a = lo, c2 = b; for (let it = 0; it < 18; it++) { const m = (a + c2) / 2; if (cpAt(m) - need < 0) a = m; else c2 = m; } beta = (a + c2) / 2; found = true; break; }
              lo = b;
            }
            if (!found) { beta = 60; note = 'Coarse-pitch stop: too much power for this rpm — it would overspeed'; }
          }
        }
        const r = propeller(J, beta, V.B), sec = bladeStation(0.75, beta * D2R, 2 * J, V.B);
        const T = r.CT * air.rho * n * n * Math.pow(V.D, 4), P = r.CP * dens;
        const tip = Math.hypot(Math.PI * n * V.D, Vms) / air.a;
        S = { J, beta, r, sec, T, P, tip, n };
        if (!note) note = sec.al / D2R > STALL_DEG ? 'The section at 0.75 R is stalled' : r.CT <= 0 ? 'No thrust: the blades are windmilling' : tip > 0.9 ? 'Tips near the speed of sound: noise and losses' : '';
        ro.set('J', J.toFixed(3));
        ro.set('beta', beta.toFixed(1) + '°' + (V.mode === 'cs' ? ' (set by the governor)' : ''));
        ro.set('al', (sec.al / D2R).toFixed(1) + '°');
        ro.set('ct', r.CT.toFixed(4));
        ro.set('cp', r.CP.toFixed(4));
        ro.set('eta', r.eta > 0 ? (100 * r.eta).toFixed(1) + ' %' : J === 0 ? '0 (static: no work is done on the aircraft)' : '0');
        ro.set('T', forceTxt(T, fmt));
        ro.set('P', P >= 0 ? powerTxt(P, fmt) + ' (' + fmt(P / 745.7) + ' hp)' : 'the air drives the propeller (' + powerTxt(-P, fmt) + ')');
        ro.set('tip', tip.toFixed(2));
        ro.set('note', note);
        const C = kit.colors();
        const series = map.map(m => ({ pts: m.pts, color: C.faint, width: 1.2, label: '' }));
        const cur = { pts: [], color: C.accent, width: 2.8, label: 'β = ' + beta.toFixed(1) + '°' };
        for (let Jx = 0; Jx <= 3.6001; Jx += 0.05) { const q = propeller(Jx, beta, V.B); cur.pts.push([Jx, q.CT > 0 ? q.eta : NaN]); }
        series.push(cur);
        const peaks = map.filter((m, i) => i % 2 === 0).map(m => { let bp = [0, 0]; for (const p of m.pts) if (p[1] > bp[1]) bp = p; return { x: bp[0], y: bp[1], label: m.b + '°', color: C.faint, r: 2.5 }; });
        plotM.set({ series, marks: peaks.concat([{ x: J, y: Math.max(0, r.eta), label: (100 * Math.max(0, r.eta)).toFixed(0) + ' %' }]) });
        const ctp = [], cpp = [];
        for (let Jx = 0; Jx <= 3.6001; Jx += 0.05) { const q = propeller(Jx, beta, V.B); ctp.push([Jx, q.CT]); cpp.push([Jx, q.CP]); }
        plotC.set({ series: [{ pts: ctp, label: 'C_T' }, { pts: cpp, label: 'C_P', dash: [6, 4] }], hlines: [{ y: 0 }], vlines: [{ x: J, label: 'now' }] });
        loop.once();
      }
      const foil = F.naca4(0.04, 0.4, 0.1, 30);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const sec = S.sec, b = S.beta * D2R, cx = st.W * 0.6, cy = st.H * 0.56;
        const Lc = Math.min(st.W * 0.2, st.H * 0.42);
        // plane of rotation and flight direction
        c.setLineDash([5, 5]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(st.W * 0.28, cy); c.lineTo(st.W - 10, cy); c.stroke(); c.setLineDash([]);
        kit.label(c, 'plane of rotation', st.W - 12, cy + 12, { align: 'right', color: C.muted, size: 11.5 });
        kit.arrow(c, st.W * 0.3, cy + 40, st.W * 0.3, cy - 40, C.muted, 1.5);
        kit.label(c, 'flight', st.W * 0.3 + 6, cy - 34, { align: 'left', color: C.muted, size: 11.5 });
        kit.arrow(c, cx + Lc * 0.55, cy + Lc * 0.62, cx + Lc * 1.1, cy + Lc * 0.62, C.muted, 1.5);
        kit.label(c, 'blade moves', cx + Lc * 0.55, cy + Lc * 0.62 + 13, { align: 'left', color: C.muted, size: 11.5 });
        // the section, leading edge to the right, suction side forward (up)
        const LE = [cx + 0.5 * Lc * Math.cos(b), cy - 0.5 * Lc * Math.sin(b)];
        const toC = (x, y) => [LE[0] - x * Lc * Math.cos(b) - y * Lc * Math.sin(b), LE[1] + x * Lc * Math.sin(b) - y * Lc * Math.cos(b)];
        c.beginPath(); foil.forEach((p, i) => { const q = toC(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); }); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
        // chord line extended to show β
        c.setLineDash([3, 4]); c.strokeStyle = C.text2; c.beginPath(); c.moveTo(...toC(-0.35, 0)); c.lineTo(...toC(1.1, 0)); c.stroke(); c.setLineDash([]);
        // the velocity triangle: the air arrives from ahead and from the side the blade moves towards
        const ex = LE[0] + Lc * 0.05, ey = LE[1] - Lc * 0.02;
        const k = Math.min(st.W * 0.3 / 9, st.H * 0.8 / 9, (st.W - 16 - ex) / Math.max(1e-6, sec.Wt), (ey - 14) / Math.max(1e-6, sec.Wa));   // px per normalised speed unit
        const Wt = sec.Wt * k, Wa = sec.Wa * k;
        const tail = [ex + Wt, ey - Wa];
        c.setLineDash([4, 4]);
        kit.arrow(c, tail[0], tail[1], ex, tail[1], C.hue(200), 1.4);
        kit.arrow(c, ex, tail[1], ex, ey, C.hue(140), 1.4);
        c.setLineDash([]);
        kit.arrow(c, tail[0], tail[1], ex, ey, C.accent, 2.4);
        kit.label(c, 'Ωr', (tail[0] + ex) / 2, tail[1] - 9, { align: 'center', color: C.hue(200), size: 12, weight: 700 });
        kit.label(c, 'V + induced', ex - 6, (tail[1] + ey) / 2, { align: 'right', color: C.hue(140), size: 12, weight: 700 });
        kit.label(c, 'relative wind W', (tail[0] + ex) / 2 + 8, (tail[1] + ey) / 2 + 12, { align: 'left', color: C.accent, size: 12, weight: 700 });
        // forces on the section: lift ⟂ W, drag along W, and their thrust part
        const wl = Math.hypot(sec.Wt, sec.Wa) || 1, ux = -sec.Wt / wl, uy = sec.Wa / wl;   // direction the air moves (canvas: +y down)
        const q2 = Math.min(2.2, (sec.W * sec.W) / 30), fl = sec.cl * q2 * st.H * 0.22, fd = sec.cd * q2 * st.H * 0.22;
        const Lx = -uy, Ly = ux;                                              // lift ⟂ W, towards the forward (suction) side for c_l > 0
        kit.arrow(c, cx, cy, cx + Lx * fl, cy + Ly * fl, fl >= 0 ? C.ok : C.bad, 2.4);
        kit.arrow(c, cx, cy, cx + ux * fd * 5, cy + uy * fd * 5, C.bad, 2);
        const thrust = -Ly * fl - uy * fd, tx = cx - 0.5 * Lc * Math.cos(b) - 34;   // upward (forward) component, px, drawn left of the trailing edge
        kit.arrow(c, tx, cy, tx, cy - thrust, C.warn, 3);
        kit.label(c, 'lift', cx + Lx * fl + 6, cy + Ly * fl - 6, { align: 'left', color: C.ok, size: 12, weight: 700 });
        kit.label(c, 'drag ×5', cx + ux * fd * 5 - 6, cy + uy * fd * 5 + 10, { align: 'right', color: C.bad, size: 11.5 });
        kit.label(c, thrust >= 0 ? 'thrust' : 'negative thrust', tx - 6, cy - thrust - (thrust >= 0 ? 8 : -12), { align: 'right', color: C.warn, size: 12, weight: 700 });
        // angles
        kit.label(c, 'β = ' + S.beta.toFixed(1) + '°  blade angle', 12, 16, { align: 'left', color: C.text, size: 12.5, weight: 700 });
        kit.label(c, 'φ = ' + (sec.phi / D2R).toFixed(1) + '°  inflow angle', 12, 34, { align: 'left', color: C.accent, size: 12.5, weight: 700 });
        const al = sec.al / D2R;
        kit.label(c, 'α = β − φ = ' + al.toFixed(1) + '°' + (al > STALL_DEG ? '  stalled' : al < -2.5 ? '  negative lift' : ''), 12, 52, { align: 'left', color: al > STALL_DEG || al < -2.5 ? C.bad : C.ok, size: 12.5, weight: 700 });
        kit.label(c, 'section at 0.75 R', 12, 70, { align: 'left', color: C.muted, size: 11.5 });
        // a small propeller seen from ahead, turning (slowed down)
        spin += dt * S.n * 0.04 * Math.PI * 2;
        const px = 46, py = st.H - 46, pr = 32;
        c.strokeStyle = C.text2; c.lineWidth = 1; c.beginPath(); c.arc(px, py, pr, 0, Math.PI * 2); c.stroke();
        for (let i = 0; i < V.B; i++) {
          const a = spin + i * 2 * Math.PI / V.B;
          c.save(); c.translate(px, py); c.rotate(a); c.fillStyle = C.text;
          c.beginPath(); c.ellipse(pr * 0.5, 0, pr * 0.5, 4, 0, 0, Math.PI * 2); c.fill(); c.restore();
        }
        kit.dot(c, px, py, 5, C.accent);
        kit.label(c, fmt(V.rpm) + ' rpm', px + pr + 8, py, { align: 'left', color: C.muted, size: 11.5 });
      }, box.stage);
      buildMap();
      solve();
      loop.start();
    }
  });

  /* ================================================================ 4. the turbojet and the ramjet */
  function tsPath(r) {
    // entropy relative to the ambient air along the engine: [[s, T], ...] and the station marks
    const pts = [], marks = [];
    const add = (s, T, lab) => { pts.push([s, T]); if (lab) marks.push({ x: s, y: T, label: lab }); };
    add(0, r.T0, '0');
    let s2 = CPC * Math.log(r.Tt2 / r.T0) - RC * Math.log(r.pt2 / r.p0);
    for (let i = 1; i <= 6; i++) { const f = i / 6; add(s2 * f, r.T0 + (r.Tt2 - r.T0) * f, i === 6 ? '2' : ''); }
    const n3 = r.opr > 1.01 ? 14 : 0;
    let s = s2;
    for (let i = 1; i <= n3; i++) {
      const p = r.pt2 * Math.pow(r.opr, i / n3), T = r.Tt2 * Math.pow(r.Tt3 / r.Tt2, i / n3);
      s = s2 + CPC * Math.log(T / r.Tt2) - RC * Math.log(p / r.pt2);
      add(s, T, i === n3 ? '3' : '');
    }
    const s3 = s;
    for (let i = 1; i <= 14; i++) {
      const f = i / 14, T = r.Tt3 + (r.Tt4 - r.Tt3) * f, p = r.pt3 + (r.pt4 - r.pt3) * f;
      s = s3 + CPH * Math.log(T / r.Tt3) - RH * Math.log(p / r.pt3);
      add(s, T, i === 14 ? '4' : '');
    }
    const s4 = s;
    if (r.Tt5 < r.Tt4 - 1) for (let i = 1; i <= 10; i++) {
      const f = i / 10, T = r.Tt4 * Math.pow(r.Tt5 / r.Tt4, f), p = r.pt4 * Math.pow(r.pt5 / r.pt4, f);
      s = s4 + CPH * Math.log(T / r.Tt4) - RH * Math.log(p / r.pt4);
      add(s, T, i === 10 ? '5' : '');
    }
    const s5 = s;
    if (r.Tt7 > r.Tt5 + 1) for (let i = 1; i <= 10; i++) {
      const f = i / 10, T = r.Tt5 + (r.Tt7 - r.Tt5) * f, p = r.pt5 + (r.pt7 - r.pt5) * f;
      s = s5 + CPH * Math.log(T / r.Tt5) - RH * Math.log(p / r.pt5);
      add(s, T, i === 10 ? '7' : '');
    }
    const s7 = s;
    for (let i = 1; i <= 10; i++) {
      const f = i / 10, p = r.pt9 * Math.pow(r.p0 / r.pt9, f), T = r.Tt7 * Math.pow(p / r.pt9, KH);
      s = s7 + CPH * Math.log(T / r.Tt7) - RH * Math.log(p / r.pt7);
      add(s, T, i === 10 ? '9' : '');
    }
    return { pts, marks, close: [[s, r.T9], [0, r.T0]] };
  }
  Hyper.sim('prop-brayton', {
    title: 'Turbojet and ramjet: the Brayton cycle',
    blurb: `A turbojet cycle computed station by station (0 free stream, 2 compressor face, 3 compressor exit, 4 turbine entry, 5 turbine exit, 9 jet), with realistic losses or ideal components. The gas path is coloured by temperature; below are its T–s diagram and the thrust each kilogram of air gives at every flight Mach number. Set the compressor pressure ratio to 1 and it becomes a **ramjet**: no compressor, no turbine, only the ram compression of the intake.

**Try this**
- Raise the pressure ratio from 4 to 30 at a fixed turbine temperature: thermal efficiency rises, as the ideal Brayton formula $1 - r^{-(\\gamma-1)/\\gamma}$ says.
- Raise the turbine entry temperature: more thrust from each kilogram of air — the engine gets smaller for the same thrust.
- Set the pressure ratio to 1 (ramjet) and bring the Mach number to 0: no thrust at all. Speed it up to Mach 3: the intake alone compresses the air about 37 times.
- Take the turbojet to Mach 3.5 with a pressure ratio of 25: the compressor exit becomes hotter than the turbine can stand — one reason fast aircraft use low pressure ratios or ramjets.
- Light the afterburner at Mach 0.9 and at Mach 2: thrust jumps, fuel consumption jumps more.`,
    mount(box, kit, params) {
      const F = kit.fluid, fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 210 });
      const g1 = graphDiv(box), g2 = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Flight Mach number', min: 0, max: 4, step: 0.05, value: pick(params, 'M', 0.8) },
        { id: 'h', label: 'Altitude', min: 0, max: 20000, step: 250, value: pick(params, 'h', 11000), unit: 'm' },
        { id: 'opr', label: 'Compressor pressure ratio (1 = ramjet)', min: 1, max: 40, step: 0.5, value: pick(params, 'opr', 12) },
        { id: 'tt4', label: 'Turbine entry temperature T₄', min: 1000, max: 2200, step: 10, value: pick(params, 'tt4', 1400), unit: 'K' },
        { id: 'md', label: 'Air mass flow', min: 5, max: 250, value: pick(params, 'md', 50), unit: 'kg/s', log: true, sig: 3 },
        { id: 'ab', type: 'check', label: 'Afterburner (reheat to 2000 K)', value: false },
        { id: 'ideal', type: 'check', label: 'Ideal components (no losses)', value: false }
      ], () => solve());
      const ro = kit.readout(box.side, [['ram', 'Ram pressure ratio (intake, ideal)'], ['pr', 'Overall pressure ratio'], ['T3', 'Compressor exit temperature'], ['far', 'Fuel–air ratio'], ['V', 'Jet speed / flight speed'],
        ['Fs', 'Specific thrust'], ['T', 'Thrust'], ['sfc', 'TSFC'], ['eth', 'Thermal efficiency (ideal Brayton)'], ['ep', 'Propulsive efficiency'], ['eo', 'Overall efficiency'], ['msg', '']]);
      const plotTS = kit.plot(g1, { x: { label: 'entropy s − s₀ (J/(kg·K))', name: 's' }, y: { label: 'temperature (K)', min: 0, name: 'T' } }, 170);
      const plotF = kit.plot(g2, { x: { label: 'flight Mach number', min: 0, max: 4, name: 'M' }, y: { label: 'thrust per kg/s of air (N·s/kg)', min: 0, name: 'F/ṁ' } }, 140);
      const V = ctl.values;
      let R = null, flow = 0;
      const opts = M => ({ M, h: V.h, bpr: 0, opr: V.opr, tt4: V.tt4, ab: V.ab ? 2000 : 0, ideal: V.ideal });
      function solve() {
        const r = cycle(F, opts(V.M));
        R = r;
        const ram = Math.pow(r.tr, 1 / KC), overall = ram * V.opr;
        ro.set('ram', ram.toFixed(2));
        ro.set('pr', overall.toFixed(1) + (V.opr <= 1.001 ? ' (ram only: a ramjet)' : ''));
        ro.set('T3', fmt(r.Tt3) + ' K (' + fmt(r.Tt3 - 273.15) + ' °C)');
        const why = { hot: 'The compressor delivers air hotter than the turbine limit: no room to burn fuel', turbine: 'The turbine cannot drive this compressor at this temperature', core: 'No thrust: the jet pressure is not above ambient — a ramjet needs speed', drag: 'No net thrust: the jet is slower than the incoming air' }[r.why] || '';
        if (r.ok) {
          ro.set('far', r.f.toFixed(4) + (r.fab > 0 ? ' (' + r.fab.toFixed(4) + ' in the afterburner)' : ''));
          ro.set('V', fmt(r.V9) + ' / ' + fmt(r.V0) + ' m/s');
          ro.set('Fs', fmt(r.Fs) + ' N per kg/s');
          ro.set('T', forceTxt(r.Fs * V.md, fmt));
          ro.set('sfc', tsfcTxt(r, fmt));
          ro.set('eth', (100 * r.etaTh).toFixed(1) + ' %  (' + (100 * (1 - Math.pow(overall, -KC))).toFixed(1) + ' %)');
          ro.set('ep', (100 * r.etaP).toFixed(1) + ' %');
          ro.set('eo', (100 * r.etaO).toFixed(1) + ' %');
          ro.set('msg', V.ab ? 'Afterburning: much more thrust, much more fuel per newton' : V.opr <= 1.001 ? 'Ramjet: all the compression comes from the intake' : '');
        } else {
          for (const k of ['far', 'V', 'Fs', 'T', 'sfc', 'eth', 'ep', 'eo']) ro.set(k, '—');
          ro.set('msg', why);
        }
        if (r.ok) {
          const tp = tsPath(r);
          plotTS.set({ series: [{ pts: tp.pts, label: 'the engine' }, { pts: tp.close, label: 'cooling in the atmosphere', dash: [5, 4], color: kit.colors().faint }], marks: tp.marks });
        } else plotTS.set({ series: [], marks: [] });
        const fs = [];
        for (let i = 0; i <= 80; i++) { const M = 4 * i / 80, q = cycle(F, opts(M)); fs.push([M, q.ok ? q.Fs : NaN]); }
        plotF.set({ series: [{ pts: fs, label: 'specific thrust' }], marks: r.ok ? [{ x: V.M, y: r.Fs, label: fmt(r.Fs) + ' N·s/kg' }] : [] });
        loop.once();
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), r = R;
        if (!r) return;
        const ram = V.opr <= 1.001, yc = st.H / 2 + 6, Re = st.H * 0.3;
        const xs = { a: st.W * 0.06, b: st.W * 0.2, c: st.W * 0.4, d: st.W * 0.53, e: st.W * 0.64, f: st.W * 0.8 };
        const Tcol = T => C.hue(225 - 225 * clamp((T - 200) / 1900, 0, 1), 0.75);
        const T9 = r.ok ? r.T9 : r.T0, Tt5 = r.Tt5 || r.Tt4, Tt7 = r.Tt7 || Tt5;
        const grad = c.createLinearGradient(xs.a, 0, st.W, 0);
        const stop = (x, T) => grad.addColorStop(clamp((x - xs.a) / (st.W - xs.a), 0, 1), Tcol(T));
        stop(xs.a, r.T0); stop(xs.b, r.Tt2); stop(xs.c, r.Tt3); stop(xs.d, r.ok || r.why !== 'hot' ? r.Tt4 : r.Tt3);
        stop(xs.e, ram ? r.Tt4 : Tt5); stop(xs.f, Tt7); stop(st.W, T9);
        // outer casing and gas path (half-height hh(x) of the flow channel)
        const hh = x => x < xs.b ? Re * 0.85 : x < xs.c ? Re * (0.85 - 0.35 * (ram ? 0 : (x - xs.b) / (xs.c - xs.b))) : x < xs.e ? Re * (ram ? 0.85 : 0.5) : x < xs.f ? Re * (ram ? 0.85 - 0.25 * (x - xs.e) / (xs.f - xs.e) : 0.5 + 0.12 * (x - xs.e) / (xs.f - xs.e)) : Re * (ram ? 0.6 : 0.62) * (1 + 0.15 * (x - xs.f) / (st.W - xs.f));
        c.beginPath();
        for (let x = xs.a; x <= st.W; x += 4) c.lineTo(x, yc - hh(x));
        for (let x = Math.floor(st.W / 4) * 4; x >= xs.a; x -= 4) c.lineTo(x, yc + hh(x));
        c.closePath(); c.fillStyle = grad; c.fill();
        // casing
        c.strokeStyle = C.text; c.lineWidth = 2;
        for (const sgn of [-1, 1]) { c.beginPath(); for (let x = xs.a; x <= xs.f; x += 4) { const y = yc + sgn * (hh(x) + 3); x === xs.a ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); }
        // inner parts: spike (ramjet) or shaft, compressor and turbine blades
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4;
        if (ram) {
          c.beginPath(); c.moveTo(xs.a - 20, yc); c.lineTo(xs.b, yc - Re * 0.35); c.lineTo(xs.c, yc - Re * 0.2); c.lineTo(xs.c, yc + Re * 0.2); c.lineTo(xs.b, yc + Re * 0.35); c.closePath(); c.fill(); c.stroke();
          for (let i = 0; i < 3; i++) { const x = xs.d + i * 8; c.beginPath(); c.moveTo(x, yc - Re * 0.5); c.lineTo(x + 6, yc - Re * 0.42); c.moveTo(x, yc + Re * 0.5); c.lineTo(x + 6, yc + Re * 0.42); c.stroke(); }
          kit.label(c, 'flame holders', xs.d, yc - Re - 10, { align: 'left', color: C.muted, size: 11.5 });
        } else {
          c.fillRect(xs.b, yc - 4, xs.e - xs.b, 8); c.strokeRect(xs.b, yc - 4, xs.e - xs.b, 8);
          c.beginPath(); c.moveTo(xs.a + 10, yc); c.quadraticCurveTo(xs.a + 20, yc - Re * 0.3, xs.b, yc - Re * 0.3); c.lineTo(xs.b, yc + Re * 0.3); c.quadraticCurveTo(xs.a + 20, yc + Re * 0.3, xs.a + 10, yc); c.fill(); c.stroke();
          const nC = Math.max(2, Math.min(14, Math.round(Math.log(V.opr) / Math.log(1.3))));
          for (let i = 0; i < nC; i++) { const x = xs.b + (xs.c - xs.b) * (i + 0.5) / nC, h = hh(x); c.beginPath(); c.moveTo(x, yc - h); c.lineTo(x, yc - 6); c.moveTo(x, yc + 6); c.lineTo(x, yc + h); c.stroke(); }
          for (let i = 0; i < 3; i++) { const x = xs.d + (xs.e - xs.d) * (i + 0.5) / 3 + 4, h = hh(x); c.beginPath(); c.moveTo(x, yc - h); c.lineTo(x, yc - 6); c.moveTo(x, yc + 6); c.lineTo(x, yc + h); c.stroke(); }
          kit.label(c, 'compressor', (xs.b + xs.c) / 2, yc - Re - 10, { align: 'center', color: C.muted, size: 11.5 });
          kit.label(c, 'turbine', (xs.d + xs.e) / 2 + 4, yc - Re - 10, { align: 'center', color: C.muted, size: 11.5 });
        }
        kit.label(c, 'combustor', (xs.c + xs.d) / 2, yc + Re + 12, { align: 'center', color: C.muted, size: 11.5 });
        if (V.ab) kit.label(c, 'afterburner', (xs.e + xs.f) / 2, yc + Re + 12, { align: 'center', color: C.warn, size: 11.5, weight: 700 });
        // station numbers and temperatures
        const lab = (x, n, T) => { kit.label(c, n, x, 12, { align: 'center', color: C.text, size: 12, weight: 700 }); kit.label(c, fmt(T, 3) + ' K', x, 27, { align: 'center', color: C.muted, size: 11 }); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x, 34); c.lineTo(x, yc - hh(x) - 4); c.stroke(); };
        lab(xs.a, '0', r.T0); lab(xs.b, '2', r.Tt2);
        if (!ram) lab(xs.c, '3', r.Tt3);
        if (r.why !== 'hot') { lab(xs.d, '4', r.Tt4); if (!ram) lab(xs.e, '5', Tt5); }
        if (r.ok) lab(st.W - 30, '9', r.T9);
        // moving gas: dots that speed up through the nozzle
        if (r.ok) {
          flow = (flow + dt * 60) % 40;
          c.fillStyle = C.text2;
          for (let x = xs.a + flow; x < st.W; x += 40) {
            const k = x > xs.f ? 1 + 2 * (x - xs.f) / (st.W - xs.f) : 1;
            for (const e of [-0.5, 0, 0.5]) c.fillRect(x + (k - 1) * flow, yc + e * hh(x) - 1, 2.5, 2.5);
          }
          kit.label(c, 'jet ' + fmt(r.V9) + ' m/s', st.W - 8, yc + hh(st.W - 8) + 14, { align: 'right', color: C.bad, size: 12, weight: 700 });
        } else kit.label(c, 'no thrust', st.W - 10, yc, { align: 'right', color: C.bad, size: 13, weight: 700, bg: C.surface });
        kit.label(c, 'M ' + V.M.toFixed(2) + ' →', 6, yc + Re + 12, { align: 'left', color: C.muted, size: 11.5 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ 5. the turbofan and its bypass ratio */
  Hyper.sim('prop-turbofan', {
    title: 'Turbofan: choose the bypass ratio',
    blurb: `A two-stream turbofan: the core is a turbojet whose turbine also drives a fan, and the fan pushes the bypass air round the core. For each bypass ratio the fan pressure ratio is chosen to burn the least fuel at the flight condition shown (or set it yourself). The engine is drawn to size for the thrust you ask for; below, fuel consumption and the three efficiencies across all bypass ratios.

**Try this**
- Go from bypass ratio 0 (a turbojet) to 5 (a CFM56-class engine) to 10 (GE9X class): the fuel per newton of thrust falls by about 40 %, while the fan grows.
- Watch the efficiencies: the thermal efficiency of the core barely changes; nearly all the gain is **propulsive** — slower, larger jets.
- Switch to takeoff: the specific thrust is higher and the fuel consumption per newton much lower, because the aircraft is hardly moving.
- Untick the automatic fan pressure ratio and raise it at bypass ratio 10: the core cannot drive such a fan, and the core jet dies.
- Raise the overall pressure ratio and turbine temperature: the core gets better, and more bypass becomes worthwhile.`,
    mount(box, kit, params) {
      const F = kit.fluid, fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const g1 = graphDiv(box), g2 = graphDiv(box);
      const FL = { cruise: { M: 0.8, h: 11000, T: 25 }, to: { M: 0.25, h: 0, T: 120 } };
      const ctl = kit.controls(box.side, [
        { id: 'bpr', label: 'Bypass ratio', min: 0, max: 15, step: 0.1, value: pick(params, 'bpr', 5.5) },
        { id: 'opr', label: 'Overall pressure ratio', min: 10, max: 60, step: 1, value: pick(params, 'opr', 35) },
        { id: 'tt4', label: 'Turbine entry temperature', min: 1200, max: 1900, step: 10, value: pick(params, 'tt4', 1500), unit: 'K' },
        { id: 'fl', type: 'select', label: 'Flight condition', options: [['Cruise: Mach 0.80 at 11 000 m', 'cruise'], ['Takeoff: Mach 0.25 at sea level', 'to']], value: pick(params, 'fl', 'cruise') },
        { id: 'T', label: 'Thrust per engine', min: 5, max: 400, value: FL[pick(params, 'fl', 'cruise')] ? FL[pick(params, 'fl', 'cruise')].T : 25, unit: 'kN', log: true, sig: 3 },
        { id: 'auto', type: 'check', label: 'Fan pressure ratio for the least fuel', value: true },
        { id: 'fpr', label: 'Fan pressure ratio', min: 1.1, max: 4, step: 0.02, value: 1.7 }
      ], id => { if (id === 'fl' && FL[V.fl]) ctl.set('T', FL[V.fl].T); solve(); });
      const ro = kit.readout(box.side, [['fpr', 'Fan pressure ratio'], ['V', 'Jets: bypass V₁₉ / core V₉'], ['Fs', 'Specific thrust'], ['share', 'Thrust from the bypass stream'], ['ct', 'TSFC'],
        ['air', 'Air mass flow, total (core)'], ['fuel', 'Fuel flow'], ['D', 'Fan diameter (about)'], ['eth', 'Thermal efficiency'], ['ep', 'Propulsive efficiency'], ['eo', 'Overall efficiency'], ['msg', '']]);
      const plotS = kit.plot(g1, { x: { label: 'bypass ratio', min: 0, max: 15, name: 'BPR' }, y: { label: 'TSFC, lb/(lbf·h)', min: 0, name: 'TSFC' } }, 150);
      const plotE = kit.plot(g2, { x: { label: 'bypass ratio', min: 0, max: 15, name: 'BPR' }, y: { label: 'efficiency', min: 0, max: 1, name: 'η' } }, 150);
      const V = ctl.values;
      let R = null, flow = 0, Dfan = 1, Dcore = 0.5;
      const opts = (bpr, fl) => Object.assign({ bpr, opr: V.opr, tt4: V.tt4, fpr: V.fpr }, FL[fl || V.fl] || FL.cruise);
      const best = bpr => bestFan(F, opts(bpr));
      const run = bpr => V.auto ? best(bpr) : cycle(F, opts(bpr));
      function solve() {
        ctl.show('fpr', !V.auto);
        const r = run(V.bpr);
        R = r;
        if (r.ok) {
          const mdot = V.T * 1000 / r.Fs, mc = mdot / (1 + V.bpr), mf = r.f * mc;
          const Mx = 0.6, mfp = Math.sqrt(GC / 287.05) * Mx * Math.pow(1 + 0.2 * Mx * Mx, -3);   // mass flow per unit area at the fan face (axial Mach 0.6)
          Dfan = Math.sqrt(4 * mdot * Math.sqrt(r.Tt2) / (r.pt2 * mfp * 0.91) / Math.PI);
          Dcore = Dfan * Math.sqrt(1 / (1 + V.bpr));
          ro.set('fpr', V.bpr > 0 ? r.fpr.toFixed(2) + (V.auto ? ' (least fuel here)' : '') : '— (no fan: a turbojet)');
          ro.set('V', (V.bpr > 0 ? fmt(r.V19) : '—') + ' / ' + fmt(r.V9) + ' m/s  (flight ' + fmt(r.V0) + ')');
          ro.set('Fs', fmt(r.Fs) + ' N per kg/s');
          ro.set('share', (100 * r.fanShare).toFixed(0) + ' %');
          ro.set('ct', tsfcTxt(r, fmt));
          ro.set('air', fmt(mdot) + ' kg/s (' + fmt(mc) + ')');
          ro.set('fuel', fmt(mf * 3600) + ' kg/h');
          ro.set('D', fmt(Dfan) + ' m');
          ro.set('eth', (100 * r.etaTh).toFixed(1) + ' %');
          ro.set('ep', (100 * r.etaP).toFixed(1) + ' %');
          ro.set('eo', (100 * r.etaO).toFixed(1) + ' %');
          ro.set('msg', r.V19 > 0 && r.V9 < r.V19 * 0.8 ? 'The core jet is slower than the fan jet: the fan asks too much of the turbine' : '');
        } else {
          for (const k of ['V', 'Fs', 'share', 'ct', 'air', 'fuel', 'D', 'eth', 'ep', 'eo']) ro.set(k, '—');
          ro.set('fpr', V.auto ? '—' : V.fpr.toFixed(2));
          ro.set('msg', r.why === 'turbine' || r.why === 'core' ? 'The turbine cannot drive this fan: lower the fan pressure ratio or the bypass ratio' : r.why === 'hot' ? 'Compressor exit hotter than the turbine limit' : 'No net thrust');
        }
        const sb = [], sm = [], eT = [], eP = [], eO = [];
        for (let i = 0; i <= 60; i++) {
          const b = 15 * i / 60, q = best(b);
          sb.push([b, q.ok ? q.ct * 3600 : NaN]); eT.push([b, q.ok ? q.etaTh : NaN]); eP.push([b, q.ok ? q.etaP : NaN]); eO.push([b, q.ok ? q.etaO : NaN]);
          if (!V.auto) { const m = cycle(F, opts(b)); sm.push([b, m.ok ? m.ct * 3600 : NaN]); }
        }
        const series = [{ pts: sb, label: 'best fan pressure ratio' }];
        if (!V.auto) series.push({ pts: sm, label: 'fan pressure ratio ' + V.fpr.toFixed(2), dash: [6, 4] });
        plotS.set({ series, marks: r.ok ? [{ x: V.bpr, y: r.ct * 3600, label: (r.ct * 3600).toFixed(2) }] : [] });
        plotE.set({ series: [{ pts: eT, label: 'thermal' }, { pts: eP, label: 'propulsive' }, { pts: eO, label: 'overall = thermal × propulsive' }], vlines: [{ x: V.bpr, label: 'now' }] });
        loop.once();
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), r = R;
        if (!r) return;
        const yc = st.H / 2 + 4, pxm = Math.min(st.H * 0.82 / Math.max(3.4, Dfan), st.W * 0.3 / Math.max(2, Dfan));
        const Rf = Dfan / 2 * pxm, Rc = Math.max(Rf * 0.22, Dcore / 2 * pxm * 1.1), x0 = st.W * 0.14;
        const fan = V.bpr > 0.05, Ln = fan ? Math.max(Rf * 1.4, 60) : 0, xc = x0 + Math.max(Ln + 30, Rf * 1.2 + 80), Rcn = Rc * 0.7;
        // core cowl
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(x0 + Rf * 0.3, yc - Rc); c.lineTo(xc - 30, yc - Rc); c.lineTo(xc, yc - Rcn); c.lineTo(xc, yc + Rcn); c.lineTo(xc - 30, yc + Rc); c.lineTo(x0 + Rf * 0.3, yc + Rc); c.closePath(); c.fill(); c.stroke();
        // jets: bypass (cool) and core (hot), dots moving at speeds in proportion
        flow += dt;
        const vmax = Math.max(r.V9 || 1, r.V19 || 1, 1), jetLen = st.W - xc;
        if (r.ok) {
          c.fillStyle = C.hue(8, 0.25); c.fillRect(xc, yc - Rcn, jetLen, 2 * Rcn);
          if (fan && r.V19 > 0) { c.fillStyle = C.hue(205, 0.18); c.fillRect(x0 + Ln, yc - Rf * 0.92, st.W - x0 - Ln, Rf * 0.92 - Rc * 0.95); c.fillRect(x0 + Ln, yc + Rc * 0.95, st.W - x0 - Ln, Rf * 0.92 - Rc * 0.95); }
          const dots = (x1, v, y1, y2, col) => { const sp = v / vmax * 160, gap = 34, ph = (flow * sp) % gap; c.fillStyle = col; for (let x = x1 + ph; x < st.W; x += gap) for (let k = 0; k < 3; k++) c.fillRect(x - 1.5, y1 + (y2 - y1) * (k + 0.5) / 3 - 1.5, 3, 3); };
          dots(xc, r.V9, yc - Rcn, yc + Rcn, C.hue(8));
          if (fan && r.V19 > 0) { dots(x0 + Ln, r.V19, yc - Rf * 0.92, yc - Rc * 0.95, C.hue(205)); dots(x0 + Ln, r.V19, yc + Rc * 0.95, yc + Rf * 0.92, C.hue(205)); }
        }
        // nacelle and fan
        if (fan) {
          c.strokeStyle = C.text; c.lineWidth = 2.2; c.fillStyle = C.surface2 || C.surface;
          for (const sgn of [-1, 1]) {
            c.beginPath(); c.moveTo(x0, yc + sgn * Rf * 1.02); c.quadraticCurveTo(x0 + Ln * 0.5, yc + sgn * Rf * 1.12, x0 + Ln, yc + sgn * Rf * 0.94);
            c.lineTo(x0 + Ln, yc + sgn * Rf * 0.98); c.quadraticCurveTo(x0 + Ln * 0.5, yc + sgn * Rf * 1.2, x0 - 4, yc + sgn * Rf * 1.06); c.closePath(); c.fill(); c.stroke();
          }
          c.strokeStyle = C.accent; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x0 + Rf * 0.25, yc - Rf * 0.98); c.lineTo(x0 + Rf * 0.25, yc + Rf * 0.98); c.stroke();
        } else {
          c.strokeStyle = C.accent; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x0 + Rf * 0.3, yc - Rc); c.lineTo(x0 + Rf * 0.3, yc + Rc); c.stroke();
        }
        c.fillStyle = C.text2; c.beginPath(); c.moveTo(x0 + Rf * 0.25 - Math.max(12, Rc * 0.5), yc); c.quadraticCurveTo(x0 + Rf * 0.25 - 4, yc - Math.max(8, Rc * 0.35), x0 + Rf * 0.25 + 4, yc - Math.max(8, Rc * 0.35)); c.lineTo(x0 + Rf * 0.25 + 4, yc + Math.max(8, Rc * 0.35)); c.quadraticCurveTo(x0 + Rf * 0.25 - 4, yc + Math.max(8, Rc * 0.35), x0 + Rf * 0.25 - Math.max(12, Rc * 0.5), yc); c.fill();
        // labels
        kit.label(c, (fan ? 'fan Ø ' : 'intake Ø ') + fmt(Dfan) + ' m', x0 - 8, yc - Rf - 12, { align: 'left', color: C.text, size: 12, weight: 700, bg: C.surface });
        kit.label(c, 'bypass ratio ' + V.bpr.toFixed(1), 10, st.H - 12, { align: 'left', color: C.muted, size: 12 });
        if (r.ok) {
          kit.label(c, 'core jet ' + fmt(r.V9) + ' m/s', st.W - 8, yc, { align: 'right', color: C.bad, size: 12, weight: 700, bg: C.surface });
          if (fan && r.V19 > 0) kit.label(c, 'bypass jet ' + fmt(r.V19) + ' m/s', st.W - 8, yc - (Rf * 0.92 + Rc) / 2, { align: 'right', color: C.hue(205), size: 12, weight: 700, bg: C.surface });
          kit.label(c, 'air arrives at ' + fmt(r.V0) + ' m/s', 10, st.H - 30, { align: 'left', color: C.muted, size: 12 });
        } else kit.label(c, 'this engine cannot run', st.W - 10, yc, { align: 'right', color: C.bad, size: 13, weight: 700, bg: C.surface });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ 6. rockets and staging */
  Hyper.sim('prop-rocket', {
    title: 'Staging and the rocket equation',
    blurb: `Each stage adds $\\Delta v = I_{sp}\\, g_0 \\ln(m_0/m_1)$ — its exhaust velocity times the logarithm of how much lighter it gets. Here the stages are split so that each has the same ratio of upper stack to its own lift-off mass (the best split when the stages are alike), with the structure a fixed fraction ε of each stage. About 9.4 km/s of ideal $\\Delta v$ reaches low Earth orbit: 7.8 km/s of orbital speed plus roughly 1.5 km/s lost to gravity and drag. Press **Launch** to fly it (the speed shown is the ideal one, without those losses).

**Try this**
- One stage, 300 s, ε = 7 %: even with a tiny payload it falls short of orbit. Add a second stage with the same total mass and it gets there.
- Compare kerosene (Isp ≈ 300–350 s) with hydrogen (≈ 450 s) upper stages: how much more payload reaches 9.4 km/s?
- Make the structure heavier (ε = 12 %) and watch the single-stage figure collapse — staging throws dead weight away.
- Double the lift-off mass at the same payload: the Δv grows only slowly, through the logarithm.`,
    mount(box, kit, params) {
      const fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const g1 = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Stages', options: [['1', 1], ['2', 2], ['3', 3]], value: pick(params, 'N', 2) },
        { id: 'm0', label: 'Lift-off mass', min: 20, max: 3000, value: pick(params, 'm0', 550), unit: 't', log: true, sig: 3 },
        { id: 'pay', label: 'Payload', min: 0.1, max: 150, value: pick(params, 'pay', 15), unit: 't', log: true, sig: 3 },
        { id: 'isp1', label: 'First-stage Isp (average)', min: 200, max: 460, step: 1, value: pick(params, 'isp1', 300), unit: 's' },
        { id: 'isp2', label: 'Upper-stage Isp (vacuum)', min: 200, max: 465, step: 1, value: pick(params, 'isp2', 345), unit: 's' },
        { id: 'eps', label: 'Structure ÷ stage mass, ε', min: 3, max: 20, step: 0.5, value: pick(params, 'eps', 7), unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => { if (id === 'go') { t = 0; flying = true; } else if (id === 'reset') { t = 0; flying = false; } else { t = 0; flying = false; solve(); } loop.once(); });
      const ro = kit.readout(box.side, [['s1', 'Stage 1: Δv (mass ratio)'], ['s2', 'Stage 2: Δv (mass ratio)'], ['s3', 'Stage 3: Δv (mass ratio)'], ['dv', 'Total ideal Δv'], ['pf', 'Payload ÷ lift-off mass'], ['one', 'Same propellant in a single stage'], ['verdict', '']]);
      const plot = kit.plot(g1, { x: { label: 'time after lift-off (s)', min: 0, name: 't' }, y: { label: 'ideal speed (km/s)', min: 0, name: 'v' } }, 160);
      const V = ctl.values;
      let S = null, t = 0, flying = false;
      function solve() {
        const N = V.N, m0 = V.m0, pay = Math.min(V.pay, 0.9 * m0), lam = pay / m0, eps = V.eps / 100;
        const stages = [];
        let tt = 0, v = 0;
        for (let k = 0; k < N; k++) {
          const mTop = m0 * Math.pow(lam, k / N), mNext = m0 * Math.pow(lam, (k + 1) / N), sm = mTop - mNext;
          const prop = (1 - eps) * sm, m1 = mTop - prop, isp = k === 0 ? V.isp1 : V.isp2, dv = isp * G0 * Math.log(mTop / m1);
          const tw = k === 0 ? 1.35 : 0.8, mdot = tw * mTop / isp, burn = prop / mdot;
          stages.push({ mTop, m1, prop, dry: eps * sm, isp, dv, mdot, t0: tt, t1: tt + burn, v0: v, mass: sm });
          v += dv; tt += burn + (k < N - 1 ? 6 : 0);
        }
        const single = V.isp1 * G0 * Math.log(m0 / (pay + eps * (m0 - pay)));
        S = { stages, total: v, tEnd: tt, single, pay, m0 };
        for (let k = 0; k < 3; k++) {
          const s = stages[k];
          ro.set('s' + (k + 1), s ? fmt(s.dv / 1000) + ' km/s (' + (s.mTop / s.m1).toFixed(2) + ')' : '—');
        }
        ro.set('dv', fmt(v / 1000) + ' km/s');
        ro.set('pf', (100 * pay / m0).toFixed(2) + ' %' + (V.pay > 0.9 * m0 ? ' (payload capped at 90 %)' : ''));
        ro.set('one', fmt(single / 1000) + ' km/s');
        ro.set('verdict', v >= 9400 ? 'Reaches low Earth orbit (about 9.4 km/s needed)' : v >= 7800 ? 'Orbital speed on paper, but not after gravity and drag losses' : 'Falls short of orbit: ' + fmt((9400 - v) / 1000) + ' km/s missing');
        const pts = [];
        for (const s of stages) {
          for (let i = 0; i <= 40; i++) { const tau = (s.t1 - s.t0) * i / 40; pts.push([s.t0 + tau, (s.v0 + s.isp * G0 * Math.log(s.mTop / (s.mTop - s.mdot * tau))) / 1000]); }
          if (s.t1 < tt) pts.push([s.t1 + 6, (s.v0 + s.dv) / 1000]);
        }
        const C = kit.colors();
        plot.set({ x: { label: 'time after lift-off (s)', min: 0, max: Math.max(10, tt), name: 't' }, series: [{ pts, label: 'ideal speed (no gravity or drag)' }],
          hlines: [{ y: 7.8, label: 'orbital speed 7.8 km/s' }, { y: 9.4, label: 'Δv to orbit ≈ 9.4 km/s', color: C.ok }], vlines: stages.slice(0, -1).map((s, k) => ({ x: s.t1, label: 'staging ' + (k + 1) })) });
      }
      const speedAt = time => {
        for (const s of S.stages) { if (time <= s.t1) return time < s.t0 ? s.v0 : s.v0 + s.isp * G0 * Math.log(s.mTop / (s.mTop - s.mdot * (time - s.t0))); }
        return S.total;
      };
      const stars = [];
      for (let i = 0; i < 60; i++) stars.push([Math.random(), Math.random()]);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        if (flying) { t += dt * S.tEnd / 9; if (t >= S.tEnd) { t = S.tEnd; flying = false; } }
        const v = speedAt(t), frac = clamp(v / 9400, 0, 1);
        // sky: darkening as the rocket speeds up (and climbs)
        const g = c.createLinearGradient(0, 0, 0, st.H);
        g.addColorStop(0, C.dark ? 'hsl(225 40% ' + (14 - 10 * frac) + '%)' : 'hsl(205 ' + (70 - 50 * frac) + '% ' + (86 - 70 * frac) + '%)');
        g.addColorStop(1, C.dark ? 'hsl(215 35% ' + (18 - 12 * frac) + '%)' : 'hsl(205 60% ' + (95 - 70 * frac) + '%)');
        c.fillStyle = g; c.fillRect(0, 0, st.W * 0.7, st.H);
        c.fillStyle = C.dark || frac > 0.5 ? 'rgba(255,255,255,' + (0.2 + 0.6 * frac) + ')' : 'rgba(255,255,255,0)';
        for (const s of stars) { const y = ((s[1] * st.H + t * 2) % st.H); c.fillRect(s[0] * st.W * 0.7, y, 1.6, 1.6); }
        // the stack: stages sized by mass, the payload fairing on top
        const cx = st.W * 0.33, w = Math.min(46, st.W * 0.07), hTot = st.H * 0.72, active = S.stages.findIndex(s => t <= s.t1);
        const cur = active < 0 ? S.stages.length : active;
        const hs = S.stages.map(s => Math.pow(s.mass, 0.85)), hsum = hs.reduce((a, b) => a + b, 0);
        const hp = Math.max(Math.pow(S.pay, 0.85) * 0.8, 0.12 * hsum), sum = hsum + hp;   // the fairing drawn at least big enough to see
        const unit = hTot / sum;
        let y = st.H * 0.86;
        const bob = flying ? Math.sin(t * 7) * 0.8 : 0;
        for (let k = 0; k < S.stages.length; k++) {
          const h = hs[k] * unit;
          let sy = y - h, sxo = 0, alpha = 1;
          if (k < cur) { const since = t - S.stages[k].t1; sy += since * 3 + 30; sxo = -since * 0.8 - 6; alpha = clamp(1 - since / 60, 0, 1); }
          if (alpha > 0) {
            c.globalAlpha = alpha;
            c.fillStyle = C.surface; c.strokeStyle = C.series[k % C.series.length]; c.lineWidth = 2;
            c.fillRect(cx - w / 2 + sxo, sy + bob, w, h); c.strokeRect(cx - w / 2 + sxo, sy + bob, w, h);
            const left = k < cur ? 0 : k === cur ? clamp(1 - (t - S.stages[k].t0) / (S.stages[k].t1 - S.stages[k].t0), 0, 1) : 1;
            c.fillStyle = C.series[k % C.series.length]; c.globalAlpha = alpha * 0.35; c.fillRect(cx - w / 2 + sxo + 3, sy + bob + 3 + (h - 6) * (1 - left), w - 6, (h - 6) * left); c.globalAlpha = alpha;
            kit.label(c, 'stage ' + (k + 1), cx + w / 2 + 6 + sxo, sy + h / 2 + bob, { align: 'left', color: C.text, size: 11.5 });
            c.globalAlpha = 1;
          }
          if (k === cur && flying && t >= S.stages[k].t0) {                 // the flame under the burning stage
            const fl = 18 + 14 * Math.random() + (k === 0 ? 20 : 8);
            c.fillStyle = C.hue(35, 0.9); c.beginPath(); c.moveTo(cx - w * 0.3, y + bob); c.lineTo(cx, y + fl + bob); c.lineTo(cx + w * 0.3, y + bob); c.closePath(); c.fill();
          }
          y -= h;
        }
        const ph = hp * unit;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.beginPath(); c.moveTo(cx - w / 2, y + bob); c.lineTo(cx - w / 2, y - ph * 0.4 + bob); c.quadraticCurveTo(cx - w / 2, y - ph + bob, cx, y - ph - 6 + bob); c.quadraticCurveTo(cx + w / 2, y - ph + bob, cx + w / 2, y - ph * 0.4 + bob); c.lineTo(cx + w / 2, y + bob); c.closePath(); c.fill(); c.stroke();
        kit.label(c, 'payload ' + fmt(S.pay) + ' t', cx + w / 2 + 6, y - ph * 0.5 + bob, { align: 'left', color: C.text, size: 11.5, weight: 700 });
        kit.label(c, 't = ' + t.toFixed(0) + ' s   v = ' + fmt(v / 1000) + ' km/s', 10, 16, { align: 'left', color: C.text, size: 12.5, weight: 700, bg: C.surface });
        // the Δv budget
        const bx = st.W * 0.78, bw = Math.min(46, st.W * 0.08), by0 = st.H - 22, bh = st.H - 50, top = Math.max(11, S.total / 1000 + 0.5);
        const Y = kv => by0 - kv / top * bh;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, Y(top), bw, by0 - Y(top));
        let acc = 0;
        S.stages.forEach((s, k) => { c.fillStyle = C.series[k % C.series.length]; c.fillRect(bx + 1, Y(acc + s.dv / 1000), bw - 2, (s.dv / 1000) / top * bh); acc += s.dv / 1000; });
        for (const [kv, lab, col] of [[7.8, 'orbit 7.8', C.muted], [9.4, 'to orbit 9.4', C.ok]]) {
          c.strokeStyle = col; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx - 8, Y(kv)); c.lineTo(bx + bw + 8, Y(kv)); c.stroke(); c.setLineDash([]);
          kit.label(c, lab, bx + bw + 10, Y(kv), { align: 'left', color: col, size: 11 });
        }
        kit.arrow(c, bx - 26, Y(v / 1000), bx - 4, Y(v / 1000), C.accent, 2);
        kit.label(c, 'Δv ' + fmt(S.total / 1000) + ' km/s', bx + bw / 2, by0 + 12, { align: 'center', color: C.text, size: 12, weight: 700 });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ 7. batteries against kerosene */
  Hyper.sim('prop-electric', {
    title: 'Battery or kerosene: range',
    blurb: `The same aircraft flown on a battery and on fuel. In steady cruise the thrust equals the drag $D = mg/(L/D)$, so the range is the usable energy divided by the drag. With a battery that is $R = \\eta_e\\, e_b\\, m_b / D$; with fuel the aircraft gets lighter as it burns, and the Breguet equation adds a logarithm: $R = \\eta_o\\, (Q_R/g)\\,(L/D)\\,\\ln\\frac{1}{1 - m_f/m}$. The two aircraft set off together below.

**Try this**
- At 200 Wh/kg and a quarter of the mass as energy store, compare the ranges: more than twenty to one.
- Raise the battery to 500 Wh/kg — beyond today's packs — and see how far it closes the gap.
- Raise the energy fraction to 50 %: the fuel aircraft gains more than proportionally (it sheds weight), the battery aircraft only proportionally.
- Change the mass: the ranges do not change — range depends on fractions, efficiencies and L/D, not on size.`,
    mount(box, kit, params) {
      const fmt = (v, s) => kit.fmt(v, s || 3);
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const g1 = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Take-off mass', min: 300, max: 20000, value: pick(params, 'm', 1200), unit: 'kg', log: true, sig: 3 },
        { id: 'LD', label: 'Lift-to-drag ratio L/D', min: 6, max: 25, step: 0.5, value: pick(params, 'LD', 13) },
        { id: 'frac', label: 'Battery or fuel ÷ take-off mass', min: 5, max: 50, step: 1, value: pick(params, 'frac', 25), unit: '%' },
        { id: 'eb', label: 'Battery pack specific energy', min: 100, max: 1000, step: 10, value: pick(params, 'eb', 200), unit: 'Wh/kg' },
        { id: 'ee', label: 'Battery-to-thrust efficiency ηe', min: 50, max: 90, step: 1, value: 75, unit: '%' },
        { id: 'ef', label: 'Fuel-to-thrust efficiency ηo', min: 15, max: 40, step: 1, value: 25, unit: '%' },
        { id: 'V', label: 'Cruise speed', min: 60, max: 350, step: 5, value: 120, unit: 'kt' }
      ], () => { t = 0; solve(); });
      const ro = kit.readout(box.side, [['D', 'Drag in cruise D = mg/(L/D)'], ['P', 'Thrust power D·V'], ['Eb', 'Energy on board: battery / fuel'], ['Re', 'Range on the battery'], ['Rf', 'Range on fuel (Breguet)'], ['ratio', 'Fuel range ÷ battery range'], ['te', 'Endurance: battery / fuel']]);
      const plot = kit.plot(g1, { x: { label: 'battery or fuel ÷ take-off mass (%)', min: 0, max: 60, name: 'fraction' }, y: { label: 'range (km)', log: true, min: 1, max: 100000, name: 'R' } }, 170);
      const V = ctl.values;
      let S = null, t = 0;
      const QRF = 43e6;
      function solve() {
        const m = V.m, D = m * G0 / V.LD, v = V.V * KT, fr = V.frac / 100, eb = V.eb * 3600;
        const Re = V.ee / 100 * eb * fr * m / D;
        const Rf = V.ef / 100 * QRF / G0 * V.LD * Math.log(1 / (1 - fr));
        S = { Re, Rf, v, m, fr };
        ro.set('D', forceTxt(D, fmt));
        ro.set('P', powerTxt(D * v, fmt));
        ro.set('Eb', fmt(fr * m * V.eb / 1000) + ' kWh / ' + fmt(fr * m * QRF / 3.6e6) + ' kWh');
        ro.set('Re', fmt(Re / 1000) + ' km');
        ro.set('Rf', fmt(Rf / 1000) + ' km');
        ro.set('ratio', fmt(Rf / Re) + ' ×');
        ro.set('te', fmt(Re / v / 3600) + ' h / ' + fmt(Rf / v / 3600) + ' h');
        const e1 = [], e2 = [], f1 = [];
        for (let i = 1; i <= 60; i++) {
          const x = i / 100;
          e1.push([i, V.ee / 100 * eb * V.LD * x / G0 / 1000]);
          e2.push([i, V.ee / 100 * eb * 2 * V.LD * x / G0 / 1000]);
          f1.push([i, V.ef / 100 * QRF / G0 * V.LD * Math.log(1 / (1 - x)) / 1000]);
        }
        const C = kit.colors();
        plot.set({ series: [{ pts: f1, label: 'kerosene (Breguet)', color: C.series[1] }, { pts: e1, label: 'battery, ' + V.eb + ' Wh/kg', color: C.accent }, { pts: e2, label: 'battery, ' + 2 * V.eb + ' Wh/kg', color: C.accent, dash: [6, 4] }],
          marks: [{ x: V.frac, y: Rf / 1000, color: C.series[1] }, { x: V.frac, y: Re / 1000, color: C.accent }] });
      }
      const plane = (c, x, y, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(x + 14, y); c.lineTo(x - 10, y - 3); c.lineTo(x - 14, y - 9); c.lineTo(x - 16, y - 9); c.lineTo(x - 14, y); c.lineTo(x - 16, y + 3); c.lineTo(x - 10, y + 3); c.closePath(); c.fill(); c.fillRect(x - 3, y - 10, 5, 20); };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const Rmax = Math.max(S.Re, S.Rf), x0 = 70, x1 = st.W - 20, X = d => x0 + (x1 - x0) * d / (Rmax * 1.02);
        t += dt;
        const cycleT = 11, d = Rmax * clamp(t / 9, 0, 1);
        if (t > cycleT) t = 0;
        const lanes = [
          { name: 'battery', R: S.Re, y: st.H * 0.34, col: C.accent, massAt: () => S.m },
          { name: 'kerosene', R: S.Rf, y: st.H * 0.74, col: C.series[1], massAt: dd => S.m * Math.pow(1 - S.fr, clamp(dd / S.Rf, 0, 1)) }   // Breguet: m = m₀ e^(−R/K)
        ];
        // distance ticks
        const step = Hyper.niceStep(Rmax / 1000, 5) * 1000;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 0; k * step <= Rmax * 1.02; k++) { const x = X(k * step); c.beginPath(); c.moveTo(x, 18); c.lineTo(x, st.H - 18); c.stroke(); kit.label(c, fmt(k * step / 1000) + ' km', x, st.H - 8, { align: 'center', color: C.muted, size: 11 }); }
        for (const L of lanes) {
          const dd = Math.min(d, L.R), x = X(dd), left = clamp(1 - dd / L.R, 0, 1);
          c.strokeStyle = L.col; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, L.y); c.lineTo(X(L.R), L.y); c.stroke();
          c.fillStyle = L.col; c.fillRect(X(L.R) - 1.5, L.y - 8, 3, 16);
          plane(c, x, L.y - 14, L.col);
          kit.label(c, L.name, 8, L.y - 12, { align: 'left', color: L.col, size: 12.5, weight: 700 });
          // energy gauge
          c.strokeStyle = C.text2; c.lineWidth = 1; c.strokeRect(8, L.y - 2, 54, 9);
          c.fillStyle = left > 0.15 ? C.ok : C.bad; c.fillRect(9, L.y - 1, 52 * left, 7);
          kit.label(c, 'mass ' + fmt(L.massAt(dd), 4) + ' kg', 8, L.y + 18, { align: 'left', color: C.muted, size: 11 });
          if (dd >= L.R && d > 0) kit.label(c, (L.name === 'battery' ? 'battery empty at ' : 'tanks dry at ') + fmt(L.R / 1000) + ' km', clamp(X(L.R) + 8, 80, st.W - 150), L.y + 18, { align: 'left', color: L.col, size: 12, weight: 700 });
        }
      }, box.stage);
      solve();
      loop.start();
    }
  });
})();
