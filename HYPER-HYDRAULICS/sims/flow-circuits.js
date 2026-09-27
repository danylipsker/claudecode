/* HYPER-HYDRAULICS · sims/flow-circuits.js — flow control and basic circuits (ids fc-*):
 *   fc-orifice      flow through a sharp-edged orifice or a long passage: Δp, diameter, C_d, oil temperature,
 *                   the jet, the vena contracta, the pressure along the pipe, cavitation; Q–Δp curves at three temperatures
 *   fc-metering     meter-in, meter-out and bleed-off side by side, each running a 63/36 cylinder from its own
 *                   22 L/min pump: speed, pressures, heat, a resisting or overrunning load; speed–load curves
 *   fc-compensated  a plain throttle and a pressure-compensated flow control (2-way or 3-way) feeding two
 *                   cylinders against a load that changes along the stroke; pressure ladders and speed profiles
 *   fc-regen        a cylinder with a regeneration valve: normal, regenerative, or automatic changeover
 *   fc-sequence     clamp then drill with two sequence valves and checks; a jammed-clamp fault
 * All circuits are quasi-steady, in the pattern of sims/reference.js: the pump flow divides between the open
 * paths so that the pressures balance; orifices obey Q = C_d A √(2Δp/ρ); relief valves take the surplus.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared physics */
  const RHO = 870;                                 // ISO VG 46 mineral oil near 40 °C, kg/m³
  const PCAV = -0.9e5;                             // gauge pressure at which a chamber cavitates (voids), Pa
  const FR = 800;                                  // seal friction of a 63 mm cylinder, N
  const QREF = 3.67e-4;                            // 22 L/min
  const KV = 6e5 / (QREF * QREF);                  // each directional-valve path drops 6 bar at 22 L/min
  const dpv = q => KV * q * q;
  const qOrif = (cda, dp) => dp > 0 && cda > 0 ? cda * Math.sqrt(2 * dp / RHO) : 0;
  const dpOrif = (cda, q) => cda > 0 ? RHO / 2 * (q / cda) * (q / cda) : 1e12;
  // relief valve: cracks 10 bar below its setting, passes the full pump flow at the setting
  const reliefQ = (p, Qp, pSet) => { const pc = pSet - 10e5; return p <= pc || Qp <= 0 ? 0 : Qp * Math.min(1.5, (p - pc) / (pSet - pc)); };
  // root of an increasing function on [lo, hi]
  function bisect(f, lo, hi, n) {
    let flo = f(lo);
    for (let k = 0; k < (n || 60); k++) { const m = (lo + hi) / 2, fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; }
    return (lo + hi) / 2;
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const bar = p => (p / 1e5).toFixed(0) + ' bar';
  const lpm = q => (q * 60000).toFixed(1) + ' L/min';
  const kw = w => (w / 1000).toFixed(2) + ' kW';
  const mms = v => (v * 1000).toFixed(0) + ' mm/s';
  // chamber fill: red for pressure, green-grey for a cavitating (voiding) chamber
  function fillP(C, p) {
    if (p < -0.5e5) return C.dark ? 'rgba(61,214,140,.18)' : 'rgba(18,146,90,.14)';
    return p > 15e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.5, 0.1 + p / 400e5).toFixed(3) + ')' : null;
  }
  // draw on a fixed design grid W × H, scaled and centred on the stage
  function design(st, W, H) {
    const c = st.begin(), k = Math.min(st.W / W, st.H / H);
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return c;
  }
  function graphDiv(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  // flow-dot phases: advance a named phase by a speed proportional to the flow
  function phaser() { const ph = {}; return (key, q, dt) => (ph[key] = (ph[key] || 0) + dt * 90 * q / QREF); }

  // the example cylinder (63/36 × 400) and pump (16 cm³/rev, 1450 rpm, 95 %)
  function cylinder(D, d, stroke) { const A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4; return { D, d, A1, A2, Ar: A1 - A2, phi: A1 / A2, stroke }; }
  const CYL = cylinder(0.063, 0.036, 0.4);
  const QPUMP = 16e-6 * 1450 / 60 * 0.95;

  /* Extension of a cylinder whose speed is controlled by a throttle of C_d·A = cda placed
   *   'in'    in the line into the cap end (meter-in, one-way valve, free return),
   *   'out'   in the line out of the rod end (meter-out),
   *   'bleed' in a branch from the cap-end line to tank (bleed-off),
   *   'none'  nowhere.
   * F is the load force opposing extension (negative when the load pulls the rod out). */
  function extendSolve(type, cda, F, pSet, Qp, cy) {
    const A1 = cy.A1, A2 = cy.A2;
    const outLoss = q2 => dpv(q2) + (type === 'out' ? dpOrif(cda, q2) : 0);
    const inLoss = q1 => dpv(q1) + (type === 'in' ? dpOrif(cda, q1) : 0);
    const state = q1 => {
      const pB = outLoss(q1 * A2 / A1), pA = (F + FR + pB * A2) / A1;
      let Qb = 0, p;
      if (type === 'bleed') { Qb = qOrif(cda, pA); p = pA + dpv(q1 + Qb); } else p = pA + inLoss(q1);
      return { pA, pB, Qb, p, Qr: reliefQ(p, Qp, pSet) };
    };
    const g = q1 => { const s = state(q1); return q1 + s.Qb + s.Qr - Qp; };
    if (Qp <= 0) return { v: 0, Q1: 0, Q2: 0, p: 0, pA: Math.max(0, F / A1), pB: 0, Qb: 0, Qr: 0, cav: false, stall: false };
    if (g(0) >= 0) return stallExt(type, cda, pSet, Qp);
    const q1 = g(Qp) <= 0 ? Qp : bisect(g, 0, Qp, 50);
    const s = state(q1);
    if (s.pA >= PCAV) return { v: q1 / A1, Q1: q1, Q2: q1 * A2 / A1, p: s.p, pA: s.pA, pB: s.pB, Qb: s.Qb, Qr: s.Qr, cav: false, stall: false };
    // the load pulls faster than the oil arrives: the cap end cavitates and only the outlet restriction holds the load
    const pB = (PCAV * A1 - F - FR) / A2;
    const q2 = pB > 0 ? bisect(q => outLoss(q) - pB, 0, 0.02, 60) : 0;
    const v = q2 / A2;
    let q1s, p;
    if (type === 'bleed') { q1s = Qp; p = PCAV + dpv(Qp); }
    else { const gg = q => q + reliefQ(PCAV + inLoss(q), Qp, pSet) - Qp; q1s = gg(Qp) <= 0 ? Qp : bisect(gg, 0, Qp, 50); p = PCAV + inLoss(q1s); }
    q1s = Math.min(q1s, v * A1);
    p = Math.max(p, 0);
    return { v, Q1: q1s, Q2: q2, p, pA: PCAV, pB, Qb: 0, Qr: reliefQ(p, Qp, pSet), cav: true, stall: false };
  }
  // the valve is shifted to extend but nothing enters the cylinder (end of stroke, or a stall)
  function stallExt(type, cda, pSet, Qp) {
    if (type === 'bleed') {
      const pA = bisect(x => qOrif(cda, x) + reliefQ(x + dpv(qOrif(cda, x)), Qp, pSet) - Qp, 0, pSet + 6e5, 50);
      const Qb = qOrif(cda, pA), p = pA + dpv(Qb);
      return { v: 0, Q1: 0, Q2: 0, p, pA, pB: 0, Qb, Qr: reliefQ(p, Qp, pSet), cav: false, stall: true };
    }
    return { v: 0, Q1: 0, Q2: 0, p: Qp > 0 ? pSet : 0, pA: Qp > 0 ? pSet : 0, pB: 0, Qb: 0, Qr: Qp, cav: false, stall: true };
  }
  /* Retraction: the pump feeds the rod end (through the check of a meter-out valve), the cap end returns
   * (through the check of a meter-in valve). Fr is the load force opposing extension during the return. */
  function retractSolve(type, Fr, pSet, Qp, cy) {
    const A1 = cy.A1, A2 = cy.A2;
    const state = q2 => {
      const pA = dpv(q2 * A1 / A2) + (type === 'in' ? 0.5e5 : 0);
      const pB = (pA * A1 - Fr + FR) / A2;
      const p = pB + dpv(q2) + (type === 'out' ? 0.5e5 : 0);
      return { pA, pB, p, Qr: reliefQ(p, Qp, pSet) };
    };
    const g = q2 => q2 + state(q2).Qr - Qp;
    if (Qp <= 0 || g(0) >= 0) return { v: 0, Q1: 0, Q2: 0, p: Qp > 0 ? pSet : 0, pA: 0, pB: Qp > 0 ? pSet : 0, Qb: 0, Qr: Qp, cav: false, stall: true };
    const q2 = g(Qp) <= 0 ? Qp : bisect(g, 0, Qp, 50);
    const s = state(q2);
    return { v: -q2 / A2, Q1: q2 * A1 / A2, Q2: q2, p: s.p, pA: s.pA, pB: s.pB, Qb: 0, Qr: s.Qr, cav: false, stall: false };
  }
  // the throttle setting (C_d·A) that gives extension speed vt against a load F
  function matchCdA(type, vt, F, pSet, Qp, cy) {
    let lo = Math.log(1e-9), hi = Math.log(4e-5);
    const rising = type !== 'bleed';
    for (let k = 0; k < 44; k++) {
      const m = (lo + hi) / 2, v = extendSolve(type, Math.exp(m), F, pSet, Qp, cy).v;
      if ((v < vt) === rising) lo = m; else hi = m;
    }
    return Math.exp((lo + hi) / 2);
  }

  /* ================================================================ fc-orifice */
  Hyper.sim('fc-orifice', {
    title: 'Flow through an orifice',
    blurb: `Oil flows from left to right through a restriction: a **sharp-edged orifice** in a thin plate, or a **long narrow passage** (50 diameters long). The dots are oil (red upstream, blue downstream); the line under the pipe is the pressure along it. The graph shows flow against pressure drop at the present temperature and at 0 °C and 80 °C. The drawing is schematic; the numbers are for ISO VG 46 oil in a 10 mm bore.

**Try this**
- Raise Δp from 25 to 100 bar: the flow only doubles — it grows with √Δp. The jet speed at 100 bar is over 150 m/s.
- With the sharp-edged orifice, sweep the temperature from −10 to 100 °C: the flow barely changes. Switch to the long passage and do it again: the flow follows the viscosity.
- Make the orifice small (0.5 mm), the oil cold and Δp small: the Reynolds number falls below 100 and even the sharp edge starts to behave like a laminar restrictor — the effective C_d drops.
- Watch the pressure line: through the orifice it drops at once and dips at the vena contracta; along the long passage it falls steadily, eaten by friction.
- Lower the downstream pressure p₂ to zero with a large Δp: the cavitation number falls and bubbles appear in the jet — the hiss of a throttling valve.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'pressure drop Δp (bar)', min: 0, max: 300 }, y: { label: 'flow (L/min)', min: 0 }, legend: true }, 170);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Restriction', options: [['Sharp-edged orifice (thin plate)', 'orifice'], ['Long narrow passage, L = 50 d', 'long']], value: 'orifice' },
        { id: 'dp', label: 'Pressure drop Δp', min: 1, max: 300, value: 50, unit: 'bar', log: true, sig: 3 },
        { id: 'd', label: 'Diameter d', min: 0.5, max: 4, step: 0.05, value: 2, unit: 'mm' },
        { id: 'cd', label: 'C_d of the sharp edge (high Re)', min: 0.55, max: 0.85, step: 0.01, value: 0.61 },
        { id: 'T', label: 'Oil temperature (ISO VG 46)', min: -10, max: 100, step: 1, value: 40, unit: '°C' },
        { id: 'p2', label: 'Downstream pressure p₂ (gauge)', min: 0, max: 100, step: 1, value: 10, unit: 'bar' }
      ], (id) => { dirty = true; if (id === 'type') ctl.show('cd', ctl.values.type === 'orifice'); });
      const ro = kit.readout(box.side, [['Q', 'Flow'], ['v', 'Mean speed in the opening / ideal jet'], ['Re', 'Reynolds number in the opening'], ['cd', 'Effective C_d = Q / (A√(2Δp/ρ))'], ['nu', 'Oil viscosity (kinematic)'], ['P', 'Heat Δp·Q / oil warms by'], ['sig', 'Cavitation number σ']]);
      const V = ctl.values;
      const PIPE = 10e-3, PV = 0.1e5;               // drawn pipe bore (m) and oil vapour/air-release pressure (Pa, absolute)
      function model(type, dp, d, cdInf, TC) {
        const nu = F.oilViscosity(46, TC), rho = RHO * (1 - 6.5e-4 * (TC - 40)), mu = nu * rho, A = Math.PI * d * d / 4;
        let Q, f = 0;
        if (type === 'orifice') {
          // creeping flow through a hole in a thin plate (Sampson, Δp = 24μQ/d³) in series with the inertial jet
          const a = 24 * mu / (d * d * d), b = rho / (2 * cdInf * cdInf * A * A);
          Q = (-a + Math.sqrt(a * a + 4 * b * dp)) / (2 * b);
        } else {
          // pipe friction along L = 50 d (laminar 64/Re, Colebrook when turbulent) plus entry and exit losses
          const K = 1.5, L = 50 * d;
          const dpQ = q => { const v = q / A, Re = rho * v * d / mu; return (F.friction(Re, 0) * L / d + K) * rho * v * v / 2; };
          Q = bisect(q => dpQ(q) - dp, 1e-15, A * Math.sqrt(2 * dp / (K * rho)), 60);
          const v = Q / A; f = F.friction(rho * v * d / mu, 0);
        }
        const vm = Q / A;
        return { Q, A, nu, mu, rho, vm, Re: rho * vm * d / mu, cdEff: Q / (A * Math.sqrt(2 * dp / rho)), vj: Math.sqrt(2 * dp / rho), f };
      }
      function curves() {
        const d = V.d / 1000, series = [];
        for (const [TC, lab, dash] of [[V.T, 'at ' + V.T.toFixed(0) + ' °C', null], [0, 'at 0 °C', [5, 4]], [80, 'at 80 °C', [2, 3]]]) {
          const pts = [];
          for (let i = 1; i <= 60; i++) { const dp = 300 * i / 60; pts.push([dp, model(V.type, dp * 1e5, d, V.cd, TC).Q * 60000]); }
          pts.unshift([0, 0]);
          series.push({ pts, label: lab, dash: dash || undefined });
        }
        return series;
      }
      // dots of oil, each on its own streamline (e from −1 to 1 across the stream)
      const parts = [];
      for (let i = 0; i < 120; i++) parts.push({ x: 30 + 700 * ((0.5 + i * 0.7548777) % 1), e: -0.94 + 1.88 * ((0.5 + i * 0.5698403) % 1), j: i * 2.39996 });
      let series = [], m = null, time = 0;
      const smooth = t => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
      const lerp = (a, b, t) => a + (b - a) * t;
      const loop = kit.loop((dt) => {
        time += dt;
        const d = V.d / 1000, dp = V.dp * 1e5, p2 = V.p2 * 1e5, p1 = p2 + dp;
        if (dirty) { m = model(V.type, dp, d, V.cd, V.T); series = curves(); dirty = false;
          plot.set({ series, marks: [{ x: V.dp, y: m.Q * 60000, label: (m.Q * 60000).toFixed(1) + ' L/min' }] }); }
        const C = kit.colors(), orifice = V.type === 'orifice';
        const sigma = (p2 + 1.013e5 - PV) / dp, cav = sigma < 0.15;
        ro.set('Q', lpm(m.Q));
        ro.set('v', m.vm.toFixed(1) + ' m/s / ' + m.vj.toFixed(0) + ' m/s');
        ro.set('Re', m.Re < 10 ? m.Re.toFixed(1) : m.Re.toFixed(0));
        ro.set('cd', m.cdEff.toFixed(3) + (orifice ? '' : ' (friction factor ' + m.f.toFixed(3) + ')'));
        ro.set('nu', m.nu * 1e6 < 100 ? (m.nu * 1e6).toFixed(1) + ' mm²/s' : (m.nu * 1e6).toFixed(0) + ' mm²/s');
        ro.set('P', kw(dp * m.Q) + ' / ' + (dp / (m.rho * 1900)).toFixed(1) + ' °C');
        ro.set('sig', sigma.toFixed(2) + (cav ? '  — cavitation likely' : ''));
        // ---- drawing on a 760 × 320 grid
        const c = design(st, 760, 320);
        const yc = 128, R = 62, x0 = 30, x1 = 730, xp = 300, xa = 220, xb = 420;
        const rh = 8 + 12 * V.d;                       // drawn hole radius (schematic)
        const cc = clamp(V.cd / 0.97, 0.5, 0.95), rvc = rh * Math.sqrt(cc), xvc = xp + 0.7 * rh + 6, xm = (orifice ? xvc : xb) + 5 * R;
        const half = x => {
          if (orifice) {
            if (x < xp - 2 * R) return R;
            if (x < xp) return lerp(R, rh, smooth((x - xp + 2 * R) / (2 * R)));
            if (x < xvc) return lerp(rh, rvc, smooth((x - xp) / (xvc - xp)));
            if (x < xm) return lerp(rvc, R, smooth((x - xvc) / (xm - xvc)));
            return R;
          }
          if (x < xa - 1.4 * R) return R;
          if (x < xa) return lerp(R, rh, smooth((x - xa + 1.4 * R) / (1.4 * R)));
          if (x <= xb) return rh;
          if (x < xm) return lerp(rh, R, smooth((x - xb) / (xm - xb)));
          return R;
        };
        const cut = orifice ? xp : xb;
        // oil: tinted by pressure
        c.globalAlpha = C.dark ? 0.16 : 0.1;
        c.fillStyle = S.col('pressure'); c.fillRect(x0, yc - R, (orifice ? xp : xa) - x0, 2 * R);
        c.fillStyle = S.col('return'); c.fillRect(cut, yc - R, x1 - cut, 2 * R);
        c.globalAlpha = 1;
        // particles
        const U0 = 14 + 24 * Math.log10(1 + m.Q * 60000), turbulent = m.Re > 2300;
        for (const p of parts) {
          const w = half(p.x);
          let u = U0 * Math.min(16, Math.pow(R / w, 1.3));
          if (!orifice && p.x >= xa && p.x <= xb) u *= turbulent ? 1.15 * (1 - Math.pow(Math.abs(p.e), 7)) + 0.05 : 1.5 * (1 - p.e * p.e) + 0.05;
          p.x += u * dt;
          if (p.x > x1) { p.x = x0 + (p.x - x1) % 20; }
          const mix = p.x > (orifice ? xvc : xb) && p.x < xm ? Math.sin(Math.PI * (p.x - (orifice ? xvc : xb)) / (xm - (orifice ? xvc : xb))) : 0;
          const y = yc + p.e * half(p.x) + mix * 7 * Math.sin(p.j + time * 9 + p.x * 0.05);
          kit.dot(c, p.x, clamp(y, yc - R + 2, yc + R - 2), 2.2, p.x < cut ? S.col('pressure') : S.col('return'));
        }
        // bubbles where the jet's shear layer cavitates
        if (cav) {
          c.strokeStyle = C.text; c.lineWidth = 1;
          const x2 = orifice ? xvc : xb, n = Math.min(40, Math.round(2 / Math.max(sigma, 0.05)));
          for (let i = 0; i < n; i++) {
            const t = ((i * 0.618 + time * 1.7) % 1), bx = x2 + t * 2.2 * R, side = i % 2 ? 1 : -1;
            const by = yc + side * (half(bx) * 0.85 + 3 * Math.sin(i * 7.1 + time * 11));
            c.beginPath(); c.arc(bx, by, 1.4 + 2.2 * (1 - t), 0, Math.PI * 2); c.stroke();
          }
        }
        // pipe walls with hatching
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x0, yc - R); c.lineTo(x1, yc - R); c.moveTo(x0, yc + R); c.lineTo(x1, yc + R); c.stroke();
        c.lineWidth = 1; c.strokeStyle = C.muted; c.beginPath();
        for (let x = x0 + 4; x < x1; x += 12) { c.moveTo(x, yc - R - 1); c.lineTo(x + 7, yc - R - 8); c.moveTo(x, yc + R + 1); c.lineTo(x + 7, yc + R + 8); }
        c.stroke();
        // the restriction
        c.fillStyle = C.muted; c.strokeStyle = C.text; c.lineWidth = 1.5;
        if (orifice) {
          for (const sg of [-1, 1]) {
            c.beginPath(); c.moveTo(xp - 3, yc + sg * R); c.lineTo(xp - 3, yc + sg * rh); c.lineTo(xp + 1, yc + sg * rh); c.lineTo(xp + 5, yc + sg * (rh + 4)); c.lineTo(xp + 5, yc + sg * R); c.closePath(); c.fill(); c.stroke();
          }
          c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(xvc, yc - rvc - 8); c.lineTo(xvc, yc + rvc + 8); c.stroke(); c.setLineDash([]);
          kit.label(c, 'vena contracta', xvc + 4, yc + R + 18, { color: C.muted, size: 11, align: 'left' });
          kit.label(c, 'jet', xvc + 1.2 * R, yc - R + 12, { color: C.muted, size: 11 });
        } else {
          for (const sg of [-1, 1]) { c.fillRect(xa, Math.min(yc + sg * R, yc + sg * rh), xb - xa, Math.abs(R - rh)); c.strokeRect(xa, Math.min(yc + sg * R, yc + sg * rh), xb - xa, Math.abs(R - rh)); }
          kit.label(c, 'L = 50 d = ' + (50 * V.d).toFixed(0) + ' mm', (xa + xb) / 2, yc + R + 18, { color: C.muted, size: 11, align: 'center' });
          kit.label(c, m.Re < 2300 ? 'laminar: parabolic profile' : 'turbulent', (xa + xb) / 2, yc - R - 16, { color: C.muted, size: 11, align: 'center' });
        }
        kit.label(c, 'd = ' + V.d.toFixed(2) + ' mm', (orifice ? xp : xa) - 8, yc, { color: C.text, size: 12, weight: 700, align: 'right', bg: C.dark ? 'rgba(16,20,42,.75)' : 'rgba(255,255,255,.8)' });
        // gauges
        S.line(c, [[110, 44], [110, yc - R]], { state: 'pressure' });
        S.gauge(c, 110, 23, { frac: p1 / 400e5, value: 'p₁ = ' + bar(p1) });
        S.line(c, [[640, 44], [640, yc - R]], { state: 'return' });
        S.gauge(c, 640, 23, { frac: p2 / 400e5, value: 'p₂ = ' + bar(p2) });
        // pressure along the pipe (schematic in x, true in p)
        const gy0 = 300, gh = 82, pTop = Math.max(p1, 1e5), Y = p => gy0 - gh * clamp(p, -1.2e5, pTop) / pTop;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x1, Y(0)); c.stroke();
        kit.label(c, '0 bar (gauge)', x0, Y(0) + 10, { color: C.faint, size: 10, align: 'left' });
        const prof = [];
        if (orifice) {
          const a = cc * Math.pow(V.d / 1000 / PIPE, 2), pvc = p1 - dp / Math.max(0.2, 1 - 2 * a * (1 - a));
          for (let x = x0; x <= x1; x += 4) {
            let p;
            if (x < xp - 0.6 * R) p = p1;
            else if (x < xvc) p = lerp(p1, pvc, smooth((x - xp + 0.6 * R) / (xvc - xp + 0.6 * R)));
            else if (x < xm) p = lerp(pvc, p2, smooth((x - xvc) / (xm - xvc)));
            else p = p2;
            prof.push([x, Y(p)]);
          }
          if (pvc < 0) kit.label(c, 'below atmospheric at the vena contracta', xvc + 8, Y(pvc) + 10, { color: C.bad, size: 10.5, align: 'left' });
        } else {
          const qd = m.rho * m.vm * m.vm / 2, pin = p1 - 1.5 * qd;
          for (let x = x0; x <= x1; x += 4) {
            let p;
            if (x < xa - 0.8 * R) p = p1;
            else if (x < xa) p = lerp(p1, pin, smooth((x - xa + 0.8 * R) / (0.8 * R)));
            else if (x <= xb) p = lerp(pin, p2, (x - xa) / (xb - xa));
            else p = p2;
            prof.push([x, Y(p)]);
          }
        }
        S.line(c, prof, { color: S.col('pressure'), width: 2 });
        kit.label(c, 'pressure along the pipe', x0, gy0 - gh - 8, { color: C.muted, size: 11, align: 'left' });
        if (cav) kit.label(c, 'cavitation: vapour and air bubbles in the jet', x1, yc + R + 18, { color: C.bad, size: 11.5, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fc-metering */
  const MTYPES = ['in', 'out', 'bleed'], MTITLES = ['Meter-in', 'Meter-out', 'Bleed-off'];
  // one panel of the comparison: a 63/36 cylinder, a 4/3 valve, a pump with relief valve and gauge, and the throttle
  function drawMeterPanel(c, kit, ox, type, s, r, o) {
    const S = kit.fsym, C = kit.colors(), X = x => ox + x;
    const ext = s.box === 0, ret = s.box === 2, moving = Math.abs(r.v) > 1e-6;
    const hp = r.p > 3e5;
    // line states
    let aSupply = ext ? (hp ? 'pressure' : 'idle') : ret && moving ? 'return' : 'idle';
    let aCyl = aSupply, bCyl, bValve;
    if (ext) { bCyl = moving ? (type === 'out' ? 'metered' : 'return') : 'idle'; bValve = moving ? 'return' : 'idle'; }
    else if (ret) { bCyl = bValve = hp ? 'pressure' : 'idle'; }
    else { bCyl = bValve = 'idle'; }
    if (ext && type === 'in' && moving) aCyl = 'metered';
    if (r.cav) { aCyl = 'suction'; if (type !== 'in') aSupply = 'suction'; }
    const paths = {
      header: [[X(70), 354], [X(70), 320], [X(128), 320]],
      pline: [[X(128), 320], [X(150.8), 320], [X(150.8), 274]],
      gauge: [[X(36), 311], [X(36), 320], [X(70), 320]],
      relief: [[X(128), 320], [X(128), 343]],
      reliefOut: [[X(128), 401], [X(128), 402]],
      tline: [[X(162), 274], [X(162), 402]]
    };
    if (type === 'in') { paths.a1 = [[X(28), 95], [X(28), 112]]; paths.a2 = [[X(28), 168], [X(28), 196], [X(150.8), 196], [X(150.8), 226]]; }
    else paths.a2 = [[X(28), 95], [X(28), 196], [X(150.8), 196], [X(150.8), 226]];
    if (type === 'out') { paths.b1 = [[X(162), 95], [X(162), 112]]; paths.b2 = [[X(162), 168], [X(162), 226]]; }
    else paths.b2 = [[X(162), 95], [X(162), 226]];
    if (type === 'bleed') { paths.bl1 = [[X(28), 120], [X(70), 120], [X(70), 124]]; paths.bl2 = [[X(70), 156], [X(70), 162]]; }
    S.line(c, paths.header, { state: hp ? 'pressure' : 'idle' });
    S.line(c, paths.pline, { state: hp ? 'pressure' : 'idle' });
    S.line(c, paths.gauge, { state: hp ? 'pressure' : 'idle' });
    S.line(c, paths.relief, { state: hp ? 'pressure' : 'idle' });
    S.line(c, paths.reliefOut, { state: r.Qr > 1e-7 ? 'return' : 'idle' });
    S.line(c, paths.tline, { state: moving || r.Qb > 1e-7 ? 'return' : 'idle' });
    S.line(c, paths.a2, { state: aSupply });
    if (paths.a1) S.line(c, paths.a1, { state: aCyl });
    S.line(c, paths.b2, { state: type === 'out' ? bValve : bCyl });
    if (paths.b1) S.line(c, paths.b1, { state: bCyl });
    if (paths.bl1) { S.line(c, paths.bl1, { state: r.Qb > 1e-7 ? 'pressure' : 'idle' }); S.line(c, paths.bl2, { state: r.Qb > 1e-7 ? 'return' : 'idle' }); S.junction(c, X(28), 120); }
    S.junction(c, X(70), 320); S.junction(c, X(128), 320);
    // flow dots
    const f = o.adv, dt = o.dt;
    if (o.Qp > 0) S.flow(c, paths.header, f(ox + 'h', o.Qp, dt), { color: S.col('pressure') });
    if (r.Q1 + r.Qb > 1e-7 && s.box !== 1) S.flow(c, paths.pline, f(ox + 'p', ext ? r.Q1 + r.Qb : r.Q2, dt), { color: S.col('pressure') });
    if (r.Qr > 1e-7) S.flow(c, paths.relief.concat(paths.reliefOut), f(ox + 'r', r.Qr, dt), { color: S.col('pressure') });
    if (ext && moving) {
      S.flow(c, paths.a2.slice().reverse(), f(ox + 'a2', r.Q1 + r.Qb, dt), { color: S.col(aSupply === 'suction' ? 'suction' : 'pressure') });
      if (paths.a1) S.flow(c, paths.a1.slice().reverse(), f(ox + 'a1', r.Q1, dt), { color: S.col(r.cav ? 'suction' : 'metered') });
      if (paths.b1) S.flow(c, paths.b1, f(ox + 'b1', r.Q2, dt), { color: S.col('metered') });
      S.flow(c, paths.b2.concat(paths.tline), f(ox + 'b2', r.Q2, dt), { color: S.col('return') });
    }
    if (r.Qb > 1e-7) S.flow(c, paths.bl1, f(ox + 'bl1', r.Qb, dt), { color: S.col('pressure') });
    if (r.Qb > 1e-7) S.flow(c, paths.bl2, f(ox + 'bl2', r.Qb, dt), { color: S.col('return') });
    if (ret && moving) {
      S.flow(c, paths.b2.slice().reverse(), f(ox + 'b2', r.Q2, dt), { color: S.col('pressure') });
      if (paths.b1) S.flow(c, paths.b1.slice().reverse(), f(ox + 'b1', r.Q2, dt), { color: S.col('pressure') });
      if (paths.a1) S.flow(c, paths.a1, f(ox + 'a1', r.Q1, dt), { color: S.col('return') });
      S.flow(c, paths.a2.concat(paths.tline), f(ox + 'a2', r.Q1, dt), { color: S.col('return') });
    }
    // symbols
    S.pump(c, X(70), 380, { motor: true });
    S.tank(c, X(70), 416); S.tank(c, X(128), 412); S.tank(c, X(162), 412);
    S.pressureValve(c, X(128), 372, { kind: 'relief', rot: 180, open: Math.min(1, r.Qr / Math.max(o.Qp, 1e-9)) });
    S.gauge(c, X(36), 290, { frac: r.p / 400e5, value: bar(r.p) });
    const v4 = S.valve(c, X(156.4), 250, { spec: '4/3 closed', state: s.vs, left: 'spring+solenoid', right: 'spring+solenoid', s: 28, labels: true });
    kit.label(c, 'Y1', v4.xl - 6, 250, { color: ext ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
    kit.label(c, 'Y2', v4.xr + 6, 250, { color: ret ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
    if (type === 'in') S.flowControl(c, X(28), 140, { free: 'down', compensated: !!o.compensated });
    if (type === 'out') S.flowControl(c, X(162), 140, { free: 'up' });
    if (type === 'bleed') { S.throttle(c, X(70), 140, { adjustable: true }); S.tank(c, X(70), 172); }
    const cy = S.cylinder(c, X(20), 70, { len: 150, h: 30, pos: s.x / o.cy.stroke, rodLen: 72, fillA: fillP(C, r.pA), fillB: fillP(C, r.pB) });
    // the load
    c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
    c.fillRect(cy.tip[0], 53, 30, 34); c.strokeRect(cy.tip[0], 53, 30, 34);
    const len = 10 + 0.8 * o.F;
    if (o.F > 0) {
      if (o.over) kit.arrow(c, cy.tip[0] + 32, 70, cy.tip[0] + 34 + len, 70, C.warn, 2.5);
      else kit.arrow(c, cy.tip[0] + 36 + len, 70, cy.tip[0] + 33, 70, C.warn, 2.5);
    }
    kit.label(c, o.F.toFixed(0) + ' kN', cy.tip[0] + 15, 45, { color: C.text, size: 11, weight: 700, align: 'center' });
    // titles and the state of this circuit
    kit.label(c, o.title || MTITLES[MTYPES.indexOf(type)], X(160), 14, { color: C.text, size: 14, weight: 700, align: 'center' });
    kit.label(c, (moving ? mms(Math.abs(r.v)) + (r.v > 0 ? ' out' : ' in') : 'stopped') + ' · heat ' + kw(o.heat), X(160), 31, { color: C.muted, size: 11.5, align: 'center' });
    let msg = '', bad = false;
    if (r.cav) { msg = 'runs away: the cap end cavitates'; bad = true; }
    else if (ext && moving && r.pB > 1.25 * o.pSet) { msg = 'rod end ' + bar(r.pB) + ': intensified above the relief setting'; bad = true; }
    else if (!moving && s.box !== 1 && r.stall && s.x > 1e-4 && s.x < o.cy.stroke - 1e-4) { msg = 'stalled: the load needs more than the relief setting'; bad = true; }
    else if (!moving && s.box !== 1) msg = 'end of stroke: pump flow ' + (type === 'bleed' ? 'bleeds and relieves' : 'over the relief valve');
    if (msg) kit.label(c, msg, X(160), 443, { color: bad ? C.bad : C.muted, size: 11, weight: 700, align: 'center' });
  }

  Hyper.sim('fc-metering', {
    title: 'Meter-in, meter-out and bleed-off',
    blurb: `Three copies of the same machine — a 22 L/min pump, a relief valve, a 4/3 valve and a 63/36 cylinder — each with its speed set by a throttle in a different place: in the line **into** the cylinder, in the line **out** of it, or in a **bleed** branch to tank. The throttles are set so that all three run at the same speed against the load you choose; then change the load and watch them part company. Line colours: **red** pressure, **yellow** metered flow, **blue** return, **green** a line under vacuum. The graph shows the steady extension speed of each circuit against the load (negative = a load that pulls the rod out).

**Try this**
- Raise the load from 20 to 40 kN: all three slow down, bleed-off the most — its throttle passes more oil to tank as the pressure rises.
- Compare the heat: meter-in and meter-out run the pump at the relief setting; bleed-off runs it at the load pressure.
- Switch the load to *overrunning*: meter-in and bleed-off run away, their cap ends cavitating; meter-out holds the speed — at the price of a rod-end pressure far above the relief setting (p₂ = p₁φ + F/A₂).
- With an overrunning load, raise the relief setting: the rod-end pressure of the meter-out circuit climbs with it.
- Set a new speed with the slider, or press the button to re-match all three at the present load.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'load on the rod (kN):  − pulls the rod out (overrunning)   + resists', min: -45, max: 45 }, y: { label: 'extension speed (mm/s)', min: 0 }, legend: true }, 170);
      let dirty = true, rematch = true;
      const ctl = kit.controls(box.side, [
        { id: 'F', label: 'Load on the rod', min: 0, max: 45, step: 1, value: params.F != null ? params.F : 20, unit: 'kN' },
        { id: 'load', type: 'select', label: 'The load', options: [['Resists the motion (pushes back)', 'res'], ['Overruns (pulls the rod out)', 'over']], value: params.load === 'over' ? 'over' : 'res' },
        { id: 'v0', label: 'Speed the throttles are set for', min: 20, max: 100, step: 1, value: 60, unit: 'mm/s' },
        { id: 'relief', label: 'Relief-valve setting', min: 80, max: 250, step: 5, value: 160, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'match', label: 'Re-match the throttles at this load', primary: true }] }
      ], (id) => { dirty = true; if (id === 'v0' || id === 'relief' || id === 'match') rematch = true; if (id === 'match') Fd = ctl.values.F * 1000; });
      const ro = kit.readout(box.side, [['set', 'Throttles set for'], ['v', 'Rod speed  in / out / bleed'], ['p', 'Pump pressure'], ['pa', 'Cap end'], ['pb', 'Rod end'], ['h', 'Heat into the oil'], ['eta', 'Efficiency (useful ÷ pump)']]);
      const V = ctl.values;
      let Fd = (params.load === 'over' ? 20 : V.F) * 1000;          // the (resisting) load the throttles are matched at
      const cda = [0, 0, 0];
      const circ = MTYPES.map(() => ({ x: 0.02, dir: 1, wait: 0, vs: 1, box: 1 }));
      const res = MTYPES.map(() => ({ v: 0, Q1: 0, Q2: 0, p: 0, pA: 0, pB: 0, Qb: 0, Qr: 0, cav: false, stall: false }));
      const heat = [0, 0, 0], eff = [0, 0, 0];
      const adv = phaser();
      function stepOne(k, dt) {
        const s = circ[k], type = MTYPES[k], pSet = V.relief * 1e5, F = V.F * 1000, over = V.load === 'over';
        if (s.dir === 1 && s.x >= CYL.stroke - 1e-6) { s.wait += dt; if (s.wait > 0.7) { s.dir = -1; s.wait = 0; } }
        else if (s.dir === -1 && s.x <= 1e-6) { s.wait += dt; if (s.wait > 0.7) { s.dir = 1; s.wait = 0; } }
        const target = s.dir === 1 ? 0 : 2;
        s.vs += clamp(target - s.vs, -dt / 0.08, dt / 0.08);
        s.box = Math.round(s.vs);
        const Fext = over ? -F : F, Fret = over ? -F : 0;
        let r;
        if (s.box === 0) r = s.x < CYL.stroke - 1e-6 ? extendSolve(type, cda[k], Fext, pSet, QPUMP, CYL) : stallExt(type, cda[k], pSet, QPUMP);
        else if (s.box === 2) r = s.x > 1e-6 ? retractSolve(type, Fret, pSet, QPUMP, CYL) : { v: 0, Q1: 0, Q2: 0, p: pSet, pA: 0, pB: pSet, Qb: 0, Qr: QPUMP, cav: false, stall: true };
        else r = { v: 0, Q1: 0, Q2: 0, p: pSet, pA: 0, pB: over && s.x > 0 ? Math.max(0, (F - FR) / CYL.A2) : 0, Qb: 0, Qr: QPUMP, cav: false, stall: false };
        s.x = clamp(s.x + r.v * dt, 0, CYL.stroke);
        const Fopp = s.box === 2 ? Fret : Fext, Pload = Fopp * r.v, Pin = Math.max(0, r.p) * QPUMP;
        heat[k] = Math.max(0, Pin - Pload); eff[k] = Pin > 0 && Pload > 0 ? Pload / Pin : 0;
        res[k] = r;
      }
      function curves() {
        const pSet = V.relief * 1e5, ymax = Math.max(150, 2.4 * V.v0), series = [];
        const marks = [], x0 = (V.load === 'over' ? -1 : 1) * V.F;
        MTYPES.forEach((type, k) => {
          const pts = [];
          for (let i = 0; i <= 60; i++) { const Fk = -45 + 1.5 * i; pts.push([Fk, Math.min(ymax, extendSolve(type, cda[k], Fk * 1000, pSet, QPUMP, CYL).v * 1000)]); }
          series.push({ pts, label: MTITLES[k] });
          marks.push({ x: x0, y: Math.min(ymax, extendSolve(type, cda[k], x0 * 1000, pSet, QPUMP, CYL).v * 1000) });
        });
        plot.set({ series, marks, y: { label: 'extension speed (mm/s) — capped at ' + ymax.toFixed(0), min: 0, max: ymax }, vlines: [{ x: 0, label: '' }], hlines: [{ y: V.v0, label: 'set speed' }] });
      }
      const loop = kit.loop((dt) => {
        if (rematch) { MTYPES.forEach((type, k) => { cda[k] = matchCdA(type, V.v0 / 1000, Fd, V.relief * 1e5, QPUMP, CYL); }); rematch = false; dirty = true; }
        if (dirty) { curves(); dirty = false; }
        for (let n = 0; n < 4; n++) for (let k = 0; k < 3; k++) stepOne(k, dt / 4);
        const j3 = f => res.map(f).join(' / ');
        ro.set('set', V.v0.toFixed(0) + ' mm/s at ' + (Fd / 1000).toFixed(0) + ' kN resisting');
        ro.set('v', j3(r => (r.v * 1000).toFixed(0)) + ' mm/s');
        ro.set('p', j3(r => (r.p / 1e5).toFixed(0)) + ' bar');
        ro.set('pa', j3(r => r.cav ? 'void' : (r.pA / 1e5).toFixed(0)) + ' bar');
        ro.set('pb', j3(r => (r.pB / 1e5).toFixed(0)) + ' bar');
        ro.set('h', heat.map(h => (h / 1000).toFixed(1)).join(' / ') + ' kW');
        ro.set('eta', eff.map(e => (e * 100).toFixed(0)).join(' / ') + ' %');
        const c = design(st, 960, 452), C = kit.colors();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 5]);
        c.beginPath(); c.moveTo(320, 6); c.lineTo(320, 446); c.moveTo(640, 6); c.lineTo(640, 446); c.stroke(); c.setLineDash([]);
        MTYPES.forEach((type, k) => drawMeterPanel(c, kit, 320 * k, type, circ[k], res[k], { adv, dt, Qp: QPUMP, cy: CYL, F: V.F, over: V.load === 'over', heat: heat[k], pSet: V.relief * 1e5 }));
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ fc-compensated */
  /* Meter-in through a 2-way pressure-compensated flow control: the compensator throttles whatever the metering
   * orifice does not need, holding the orifice's drop at dpc (with a few per cent of droop as its spring relaxes). */
  function compExtend(cdaO, dpc0, F, pSet, Qp, cy) {
    const A1 = cy.A1, A2 = cy.A2, cdaC = 0.65 * 30e-6;               // the compensator wide open: about 30 mm²
    const cdaOpen = 1 / Math.sqrt(1 / (cdaO * cdaO) + 1 / (cdaC * cdaC));
    const pAof = q => (F + FR + dpv(q * A2 / A1) * A2) / A1;
    let dpc = dpc0, out = null;
    for (let pass = 0; pass < 2; pass++) {
      const qset = qOrif(cdaO, dpc);
      const valveDp = q => q < qset ? dpOrif(cdaOpen, q) : dpOrif(cdaOpen, qset) + 2.5e10 * (q / qset - 1);
      const need = q => pAof(q) + dpv(q) + valveDp(q);
      const g = q => q + reliefQ(need(q), Qp, pSet) - Qp;
      if (Qp <= 0 || g(0) >= 0) return Object.assign(stallExt('in', cdaO, pSet, Qp), { dpO: 0, dpComp: 0 });
      const q1 = g(Qp) <= 0 ? Qp : bisect(g, 0, Qp, 60);
      const pA = pAof(q1), p = need(q1), dpO = Math.min(dpOrif(cdaO, q1), p - pA - dpv(q1));
      const dpComp = Math.max(0, p - pA - dpv(q1) - dpO);
      out = { v: q1 / A1, Q1: q1, Q2: q1 * A2 / A1, p, pA, pB: dpv(q1 * A2 / A1), Qb: 0, Qr: reliefQ(p, Qp, pSet), cav: false, stall: false, dpO, dpComp };
      dpc = dpc0 * (1 - 0.04 * clamp(dpComp / 200e5, 0, 1));
    }
    return out;
  }
  // a pressure ladder: how the pump pressure is shared between the load, the valve, the orifice and the compensator
  function ladder(c, kit, x, yb, parts, pSet, title) {
    const C = kit.colors(), k = 300 / 250e5;                          // 300 px for 250 bar
    kit.label(c, title, x + 25, yb - 318, { color: C.muted, size: 11, align: 'center' });
    let y = yb;
    for (const [val, col, lab] of parts) {
      const h = Math.max(0, val) * k;
      if (h > 0.2) { c.fillStyle = col; c.fillRect(x, y - h, 50, h); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x, y - h, 50, h); }
      if (h > 9) kit.label(c, lab + ' ' + (val / 1e5).toFixed(0), x + 55, y - h / 2, { color: C.text, size: 10, align: 'left' });
      y -= h;
    }
    c.strokeStyle = C.bad; c.lineWidth = 1.2; c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(x - 6, yb - pSet * k); c.lineTo(x + 60, yb - pSet * k); c.stroke(); c.setLineDash([]);
    kit.label(c, 'relief', x - 8, yb - pSet * k, { color: C.bad, size: 10, align: 'right' });
    c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x - 6, yb); c.lineTo(x + 60, yb); c.stroke();
    kit.label(c, '0 bar', x - 8, yb, { color: C.faint, size: 10, align: 'right' });
  }

  Hyper.sim('fc-compensated', {
    title: 'Plain throttle or compensated flow control',
    blurb: `Two identical meter-in circuits run side by side: on the left a **plain throttle**, on the right a **pressure-compensated** (2-way) flow control. Both are set to the same speed with no load; then the load changes along the stroke. The bars show where each pump's pressure goes: to the load, to the directional valve, across the metering orifice and — on the right — across the compensator. The graph plots speed against position during the last extension of each cylinder.

**Try this**
- Watch the light–heavy–light cut: the plain throttle slows by half in the heavy part; the compensated valve barely notices.
- Look at the yellow bar: across the plain throttle it shrinks as the load grows; across the compensated orifice it stays at the compensator setting, and the orange compensator bar absorbs the rest.
- Raise the load until the cylinder needs nearly the relief setting: the compensator runs out of pressure to throttle and the compensated valve slows too.
- Compare the heat: the 2-way valve wastes as much as the plain throttle. The last read-out shows what a 3-way (bypass) valve would make, running the pump only a few bar above the load.
- Change the compensator spring: a stiffer spring holds a larger drop, so the same opening passes more flow.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.47, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'position along the stroke (mm)', min: 0, max: 400 }, y: { label: 'extension speed (mm/s)', min: 0 }, legend: true }, 160);
      let rematch = true;
      const ctl = kit.controls(box.side, [
        { id: 'profile', type: 'select', label: 'Load along the stroke', options: [['Light – heavy – light (a cut)', 'cut'], ['Rising steadily (a spring)', 'spring'], ['Constant', 'const']], value: 'cut' },
        { id: 'F', label: 'Largest load', min: 0, max: 45, step: 1, value: 35, unit: 'kN' },
        { id: 'vset', label: 'Speed set, with no load', min: 20, max: 100, step: 1, value: 50, unit: 'mm/s' },
        { id: 'dpc', label: 'Compensator setting Δp_c', min: 4, max: 12, step: 0.5, value: 7, unit: 'bar' },
        { id: 'relief', label: 'Relief-valve setting', min: 100, max: 250, step: 5, value: 160, unit: 'bar' }
      ], (id) => { if (id === 'vset' || id === 'relief') rematch = true; });
      const ro = kit.readout(box.side, [['F', 'Load now  plain / compensated'], ['v', 'Speed'], ['dpo', 'Drop across the orifice'], ['dpc', 'Drop across the compensator'], ['p', 'Pump pressure'], ['h', 'Heat  plain / 2-way / 3-way would be']]);
      const V = ctl.values;
      let cdaT = 1e-6, cdaO = 1e-6;
      const circ = [0, 1].map(() => ({ x: 0.01, dir: 1, wait: 0, vs: 1, box: 1, trace: [], last: [] }));
      const res = [0, 1].map(() => ({ v: 0, Q1: 0, Q2: 0, p: 0, pA: 0, pB: 0, Qb: 0, Qr: 0, cav: false, stall: false, dpO: 0, dpComp: 0 }));
      const heat = [0, 0], loadNow = [0, 0];
      let heat3 = 0, tPlot = 0;
      const adv = phaser();
      const loadAt = x => { const u = x / CYL.stroke, F = V.F * 1000; return V.profile === 'spring' ? F * u : V.profile === 'cut' ? (u > 0.3 && u < 0.7 ? F : 0.1 * F) : F; };
      function stepOne(k, dt) {
        const s = circ[k], pSet = V.relief * 1e5;
        if (s.dir === 1 && s.x >= CYL.stroke - 1e-6) { s.wait += dt; if (s.wait > 0.6) { s.dir = -1; s.wait = 0; s.last = s.trace; s.trace = []; } }
        else if (s.dir === -1 && s.x <= 1e-6) { s.wait += dt; if (s.wait > 0.6) { s.dir = 1; s.wait = 0; } }
        s.vs += clamp((s.dir === 1 ? 0 : 2) - s.vs, -dt / 0.08, dt / 0.08);
        s.box = Math.round(s.vs);
        const F = s.box === 0 ? loadAt(s.x) : 0;
        let r;
        if (s.box === 0 && s.x < CYL.stroke - 1e-6) {
          if (k === 0) { r = extendSolve('in', cdaT, F, pSet, QPUMP, CYL); r.dpO = r.p - r.pA - dpv(r.Q1); r.dpComp = 0; }
          else r = compExtend(cdaO, V.dpc * 1e5, F, pSet, QPUMP, CYL);
        } else if (s.box === 0) r = Object.assign(stallExt('in', 0, pSet, QPUMP), { dpO: 0, dpComp: 0 });
        else if (s.box === 2) r = Object.assign(s.x > 1e-6 ? retractSolve('in', 0, pSet, QPUMP, CYL) : { v: 0, Q1: 0, Q2: 0, p: pSet, pA: 0, pB: pSet, Qb: 0, Qr: QPUMP, cav: false, stall: true }, { dpO: 0, dpComp: 0 });
        else r = { v: 0, Q1: 0, Q2: 0, p: pSet, pA: 0, pB: 0, Qb: 0, Qr: QPUMP, cav: false, stall: false, dpO: 0, dpComp: 0 };
        s.x = clamp(s.x + r.v * dt, 0, CYL.stroke);
        if (s.box === 0 && r.v > 0 && (!s.trace.length || s.x * 1000 - s.trace[s.trace.length - 1][0] > 3)) s.trace.push([s.x * 1000, r.v * 1000]);
        heat[k] = Math.max(0, r.p * QPUMP - F * r.v);
        loadNow[k] = F;
        if (k === 1) heat3 = s.box === 0 && r.v > 0 ? Math.max(0, (r.pA + dpv(r.Q1) + V.dpc * 1e5) * QPUMP - F * r.v) : heat[1];
        res[k] = r;
      }
      const loop = kit.loop((dt) => {
        if (rematch) {
          cdaT = matchCdA('in', V.vset / 1000, 0, V.relief * 1e5, QPUMP, CYL);
          cdaO = V.vset / 1000 * CYL.A1 / Math.sqrt(2 * 7e5 / RHO);   // metering opening sized at the nominal 7 bar
          rematch = false;
        }
        for (let n = 0; n < 4; n++) { stepOne(0, dt / 4); stepOne(1, dt / 4); }
        const two = f => res.map(f).join(' / ');
        ro.set('F', loadNow.map(F => (F / 1000).toFixed(1)).join(' / ') + ' kN');
        ro.set('v', two(r => (r.v * 1000).toFixed(0)) + ' mm/s');
        ro.set('dpo', two(r => (r.dpO / 1e5).toFixed(1)) + ' bar');
        ro.set('dpc', (res[1].dpComp / 1e5).toFixed(1) + ' bar');
        ro.set('p', two(r => (r.p / 1e5).toFixed(0)) + ' bar');
        ro.set('h', heat.map(h => (h / 1000).toFixed(2)).join(' / ') + ' / ' + (heat3 / 1000).toFixed(2) + ' kW');
        tPlot += dt;
        if (tPlot > 0.2) {
          tPlot = 0;
          const pick = s => s.trace.length > 3 ? s.trace : s.last;
          plot.set({ series: [{ pts: pick(circ[0]), label: 'plain throttle' }, { pts: pick(circ[1]), label: 'compensated' }], hlines: [{ y: V.vset, label: 'set' }] });
        }
        // ---- drawing: two panels on a 960 × 452 grid
        const c = design(st, 960, 452), C = kit.colors();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(480, 6); c.lineTo(480, 446); c.stroke(); c.setLineDash([]);
        const cols = { load: C.dark ? 'rgba(123,140,255,.55)' : 'rgba(71,87,230,.45)', valve: C.dark ? 'rgba(149,156,189,.45)' : 'rgba(91,97,128,.35)', orifice: kit.fsym.col('metered'), comp: kit.fsym.col('pilot'), relief: C.dark ? 'rgba(255,92,92,.35)' : 'rgba(214,40,40,.3)' };
        [0, 1].forEach(k => {
          const r = res[k], ox = 480 * k;
          drawMeterPanel(c, kit, ox, 'in', circ[k], r, { adv, dt, Qp: QPUMP, cy: CYL, F: loadNow[k] / 1000, over: false, heat: heat[k], pSet: V.relief * 1e5, title: k ? 'Pressure-compensated flow control' : 'Plain throttle', compensated: k === 1 });
          const parts = circ[k].box === 0 && r.v > 0 ? [[r.pA, cols.load, 'load'], [dpv(r.Q1), cols.valve, 'valve'], [r.dpO, cols.orifice, k ? 'orifice' : 'throttle'], [r.dpComp, cols.comp, 'compensator']]
            : [[r.p, cols.relief, circ[k].box === 2 ? 'returning' : 'over relief']];
          ladder(c, kit, ox + 338, 400, parts, V.relief * 1e5, 'where the pump pressure goes (bar)');
        });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ fc-regen */
  const KC = 0.3e5 / (QREF * QREF);                 // cap-end port and hose: 0.3 bar at 22 L/min
  const KR = 0.6e5 / (QREF * QREF);                 // regeneration path through the 3/2 valve: 0.6 bar at 22 L/min
  // extension, normal or regenerative; F opposes extension
  function regenExtend(regen, F, pSet, Qp, cy) {
    const A1 = cy.A1, A2 = cy.A2, Ar = cy.Ar;
    const st = q => {
      if (regen) {
        const qc = q * A1 / Ar, qr = q * A2 / Ar;
        const pJ = (F + FR + KC * qc * qc * A1 + KR * qr * qr * A2) / Ar;
        return { p: pJ + dpv(q), pA: pJ - KC * qc * qc, pB: pJ + KR * qr * qr, v: q / Ar, qc, qr };
      }
      const q2 = q * A2 / A1, pB = dpv(q2) + 0.3 * KR * q2 * q2, pA = (F + FR + pB * A2) / A1;
      return { p: pA + KC * q * q + dpv(q), pA, pB, v: q / A1, qc: q, qr: q2 };
    };
    const g = q => q + reliefQ(st(q).p, Qp, pSet) - Qp;
    if (Qp <= 0 || g(0) >= 0) return { v: 0, q: 0, qc: 0, qr: 0, p: Qp > 0 ? pSet : 0, pA: Qp > 0 ? pSet : 0, pB: regen && Qp > 0 ? pSet : 0, Qr: Qp, stall: true };
    const q = g(Qp) <= 0 ? Qp : bisect(g, 0, Qp, 50), s = st(q);
    return { v: s.v, q, qc: s.qc, qr: s.qr, p: s.p, pA: s.pA, pB: s.pB, Qr: reliefQ(s.p, Qp, pSet), stall: false };
  }

  Hyper.sim('fc-regen', {
    title: 'A regenerative circuit',
    blurb: `A 4/3 valve drives a 63 mm cylinder from a 22 L/min pump. A small 3/2 valve (Y3) in the rod-end line chooses where the rod-end oil goes while the rod extends: to the 4/3 valve and the tank (**normal**), or back into the cap-end line (**regenerative**). In the last quarter of the stroke the rod meets the work and the load jumps. Lines: **red** pressure, **blue** return; the dots move with the flow.

**Try this**
- Compare normal and regenerative extension: regeneration is faster — the pump only has to fill the rod's volume — but its force is only p × rod area, so it stalls when the work begins.
- Choose *automatic*: the rod approaches regeneratively, the pressure rises at the work, the pressure switch drops Y3 and the cylinder presses with the full piston area — fast approach, full force.
- Choose the 45 mm rod (a 2:1 cylinder): the regenerative extension and the retraction run at the same speed.
- Choose the 28 mm rod: very fast regeneration, very little force — and look at the flow through the cap-end port, five times the pump's.
- Watch both chambers turn red during regeneration: they are at nearly the same pressure.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'rod speed (mm/s), + out, − in' }, legend: false }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Extension', options: [['Automatic: regenerative, then normal at the work', 'auto'], ['Always regenerative', 'regen'], ['Always normal', 'normal']], value: 'auto' },
        { id: 'rod', type: 'select', label: 'Rod (bore 63 mm)', options: [['36 mm (φ = 1.49)', 0.036], ['45 mm (φ = 2.04, about 2:1)', 0.045], ['28 mm (φ = 1.25)', 0.028]], value: 0.036 },
        { id: 'Fa', label: 'Load during the approach', min: 0, max: 15, step: 0.5, value: 2, unit: 'kN' },
        { id: 'Fw', label: 'Load at the work (last 25 %)', min: 0, max: 60, step: 1, value: 35, unit: 'kN' },
        { id: 'relief', label: 'Relief-valve setting', min: 80, max: 250, step: 5, value: 160, unit: 'bar' }
      ], () => {});
      const ro = kit.readout(box.side, [['mode', 'Now'], ['v', 'Rod speed'], ['F', 'Force available at the relief setting'], ['p', 'Pump pressure'], ['pab', 'Cap end / rod end'], ['q', 'Flow: pump / cap port / rod end'], ['t', 'Last cycle (out and back)']]);
      const V = ctl.values;
      const REGEN32 = { top: [['A', 0.5]], bottom: [['P', 0.25], ['R', 0.75]], boxes: [['A>P', 'R|'], ['A-R', 'P|']], normal: 1 };
      const s = { x: 0.01, dir: 1, wait: 0, vs: 1, rv: 1, regen: true, t: 0, tCycle: 0, lastCycle: 0, hist: [], tPlot: 0 };
      let o = { v: 0, q: 0, qc: 0, qr: 0, p: 0, pA: 0, pB: 0, Qr: 0 }, cy = cylinder(0.063, V.rod, 0.4);
      const adv = phaser();
      function step(dt) {
        cy = cylinder(0.063, +V.rod, 0.4);
        const pSet = V.relief * 1e5, work = s.x >= 0.75 * cy.stroke;
        if (s.dir === 1 && s.x >= cy.stroke - 1e-6) { s.wait += dt; if (s.wait > 0.7) { s.dir = -1; s.wait = 0; } }
        else if (s.dir === -1 && s.x <= 1e-6) { s.wait += dt; if (s.wait > 0.5) { s.dir = 1; s.wait = 0; s.lastCycle = s.tCycle; s.tCycle = 0; s.regen = V.mode !== 'normal'; } }
        if (V.mode === 'normal') s.regen = false; else if (V.mode === 'regen') s.regen = true;
        s.vs += clamp((s.dir === 1 ? 0 : 2) - s.vs, -dt / 0.08, dt / 0.08);
        const box4 = Math.round(s.vs), wantRegen = box4 === 0 && s.regen;
        s.rv += clamp((wantRegen ? 0 : 1) - s.rv, -dt / 0.06, dt / 0.06);
        const regenNow = Math.round(s.rv) === 0;
        const F = V.Fa * 1000 + (work ? V.Fw * 1000 : 0);
        if (box4 === 0 && s.x < cy.stroke - 1e-6) o = regenExtend(regenNow, F, pSet, QPUMP, cy);
        else if (box4 === 0) o = { v: 0, q: 0, qc: 0, qr: 0, p: pSet, pA: pSet, pB: regenNow ? pSet : 0, Qr: QPUMP, stall: true };
        else if (box4 === 2) { const r = s.x > 1e-6 ? retractSolve('none', 0, pSet, QPUMP, cy) : { v: 0, Q1: 0, Q2: 0, p: pSet, pA: 0, pB: pSet, Qr: QPUMP }; o = { v: r.v, q: r.Q2, qc: r.Q1, qr: r.Q2, p: r.p, pA: r.pA, pB: r.pB, Qr: r.Qr, stall: false }; }
        else o = { v: 0, q: 0, qc: 0, qr: 0, p: pSet, pA: 0, pB: 0, Qr: QPUMP, stall: false };
        // the pressure switch: in automatic, a stalled regeneration hands over to normal extension
        if (V.mode === 'auto' && box4 === 0 && regenNow && o.p > 0.92 * pSet && s.x < cy.stroke - 1e-6) s.regen = false;
        s.x = clamp(s.x + o.v * dt, 0, cy.stroke);
        s.t += dt; s.tCycle += dt;
        o.box4 = box4; o.regenNow = regenNow; o.F = F; o.work = work;
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const C = kit.colors(), pSet = V.relief * 1e5, moving = Math.abs(o.v) > 1e-6, ext = o.box4 === 0, ret = o.box4 === 2;
        ro.set('mode', ret ? 'retracting (normal)' : ext ? (o.regenNow ? 'extending, regenerative (Y3 on)' : 'extending, normal') : 'switching');
        ro.set('v', (Math.abs(o.v) * 1000).toFixed(0) + ' mm/s ' + (o.v > 1e-6 ? 'out' : o.v < -1e-6 ? 'in' : '(stopped)'));
        ro.set('F', (pSet * cy.Ar / 1000).toFixed(1) + ' kN regenerative, ' + (pSet * cy.A1 / 1000).toFixed(1) + ' kN normal');
        ro.set('p', bar(o.p) + (o.Qr > 1e-6 && o.p > pSet - 10e5 ? '  (relief open)' : ''));
        ro.set('pab', bar(o.pA) + ' / ' + bar(o.pB));
        ro.set('q', lpm(QPUMP) + ' / ' + lpm(o.qc) + ' / ' + lpm(o.qr));
        ro.set('t', s.lastCycle > 0 ? s.lastCycle.toFixed(1) + ' s' : '—');
        s.tPlot += dt;
        if (s.tPlot > 0.1) { s.tPlot = 0; s.hist.push([s.t, o.v * 1000]); if (s.hist.length > 160) s.hist.shift(); plot.set({ series: [{ pts: s.hist.slice(), label: 'speed' }], hlines: [{ y: 0 }] }); }
        // ---- drawing on a 760 × 440 grid
        const c = design(st, 760, 440), hp = o.p > 5e5;
        const regenFlow = ext && moving && o.regenNow, normExt = ext && moving && !o.regenNow;
        const P = {
          suction: [[200, 356], [200, 370]], header: [[200, 304], [200, 292], [403.2, 292], [403.2, 277]],
          gauge: [[250, 283], [250, 292]], relief: [[290, 292], [290, 311]], reliefOut: [[290, 369], [290, 370]],
          tank: [[416.8, 277], [416.8, 370]],
          aCap: [[308, 110], [308, 150], [403.2, 150], [403.2, 198]], aValve: [[403.2, 198], [403.2, 223]],
          bRod: [[492, 110], [492, 124], [560, 124], [560, 140]],
          bValve: [[567.5, 190], [567.5, 214], [416.8, 214], [416.8, 223]],
          regen: [[552.5, 190], [552.5, 198], [403.2, 198]]
        };
        const aState = ext ? (hp ? 'pressure' : 'idle') : ret && moving ? 'return' : 'idle';
        S.line(c, P.suction, { state: 'suction' });
        for (const k of ['header', 'gauge', 'relief']) S.line(c, P[k], { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.reliefOut, { state: o.Qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.tank, { state: normExt || (ret && moving) ? 'return' : 'idle' });
        S.line(c, P.aCap, { state: aState }); S.line(c, P.aValve, { state: aState });
        S.line(c, P.bRod, { state: regenFlow || (ext && o.regenNow && hp) ? 'pressure' : normExt ? 'return' : ret && hp ? 'pressure' : 'idle' });
        S.line(c, P.bValve, { state: normExt ? 'return' : ret && hp ? 'pressure' : 'idle' });
        S.line(c, P.regen, { state: ext && o.regenNow && hp ? 'pressure' : 'idle' });
        S.junction(c, 250, 292); S.junction(c, 290, 292); S.junction(c, 403.2, 198);
        const col = S.col;
        S.flow(c, P.header, adv('he', QPUMP, dt), { color: col('pressure') });
        if (o.Qr > 1e-7) S.flow(c, P.relief.concat(P.reliefOut), adv('re', o.Qr, dt), { color: col('pressure') });
        if (ext && moving) {
          S.flow(c, P.aValve.slice().reverse(), adv('av', o.q, dt), { color: col('pressure') });
          S.flow(c, P.aCap.slice().reverse(), adv('ac', o.qc, dt), { color: col('pressure') });
          if (o.regenNow) { S.flow(c, P.bRod, adv('br', o.qr, dt), { color: col('pressure') }); S.flow(c, P.regen, adv('rg', o.qr, dt), { color: col('pressure') }); }
          else { S.flow(c, P.bRod, adv('br', o.qr, dt), { color: col('return') }); S.flow(c, P.bValve.concat([[416.8, 277], [416.8, 370]]), adv('bv', o.qr, dt), { color: col('return') }); }
        }
        if (ret && moving) {
          S.flow(c, P.bValve.slice().reverse(), adv('bv', o.qr, dt), { color: col('pressure') });
          S.flow(c, P.bRod.slice().reverse(), adv('br', o.qr, dt), { color: col('pressure') });
          S.flow(c, P.aCap.concat(P.aValve).concat([[403.2, 277], [416.8, 277], [416.8, 370]]), adv('ac', o.qc, dt), { color: col('return') });
        }
        S.pump(c, 200, 330, { motor: true });
        S.tank(c, 200, 380); S.tank(c, 290, 380); S.tank(c, 416.8, 380);
        S.pressureValve(c, 290, 340, { kind: 'relief', rot: 180, open: Math.min(1, o.Qr / QPUMP) });
        S.gauge(c, 250, 262, { frac: o.p / 400e5, value: bar(o.p) });
        const v4 = S.valve(c, 410, 250, { spec: '4/3 closed', state: s.vs, left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'Y1', v4.xl - 10, 250, { color: ext ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 10, 250, { color: ret ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        const v3 = S.valve(c, 560, 165, { spec: REGEN32, state: s.rv, left: 'solenoid', right: 'spring', s: 30 });
        kit.label(c, 'Y3', v3.xl - 8, 165, { color: o.regenNow && ext ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'regeneration valve', 560, 128 - 14, { color: C.muted, size: 11, align: 'center' });
        if (V.mode === 'auto') kit.label(c, 'pressure switch: Y3 off above ' + (0.92 * V.relief).toFixed(0) + ' bar', 740, 250, { color: C.muted, size: 11, align: 'right' });
        const cyl = S.cylinder(c, 300, 80, { len: 200, h: 40, pos: s.x / cy.stroke, fillA: fillP(C, o.pA), fillB: fillP(C, o.pB) });
        // the work: a fixed stop the load block meets at 75 % of the stroke
        const tipAt = u => 300 + 4 + u * (200 - 15) + 7 + 190;
        const xw = tipAt(0.75) + 40;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cyl.tip[0], 58, 40, 44); c.strokeRect(cyl.tip[0], 58, 40, 44);
        c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(xw, 50); c.lineTo(xw, 112); c.stroke(); c.setLineDash([]);
        kit.label(c, 'work', xw + 4, 44, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, (o.F / 1000).toFixed(1) + ' kN', cyl.tip[0] + 20, 46, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'A₁ = ' + (cy.A1 * 1e4).toFixed(1) + ' cm²   rod ' + (cy.Ar * 1e4).toFixed(1) + ' cm²   A₂ = ' + (cy.A2 * 1e4).toFixed(1) + ' cm²', 300, 22, { color: C.muted, size: 11, align: 'left' });
        let msg = '';
        if (ext && !moving && s.x < cy.stroke - 1e-6 && o.regenNow) msg = 'regeneration stalled: p × rod area is not enough for the work';
        else if (ext && !moving && s.x < cy.stroke - 1e-6) msg = 'stalled: the load needs more than the relief setting';
        else if (ext && moving) msg = o.regenNow ? 'regenerative: rod-end oil joins the pump flow' : 'normal extension: full piston area';
        if (msg) kit.label(c, msg, 740, 420, { color: !moving ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ fc-sequence */
  Hyper.sim('fc-sequence', {
    title: 'Clamp, then drill',
    blurb: `A drilling fixture with two cylinders on one 4/3 valve (tandem centre) and a 12 L/min pump. On the extend stroke the clamp C1 is fed directly and the drill feed C2 through **sequence valve SV1**; on the return the drill is fed directly and the clamp through **SV2**. Each sequence valve has a check valve beside it for the returning oil, and a drain (short dashes). On the right, the machine itself. The graph shows the pump pressure with the two sequence settings.

**Try this**
- Follow one cycle: the clamp advances at low pressure; it meets the part; the pressure climbs to SV1's setting; the drill advances and drills while the clamp holds at least p_seq × A₁. On the return the drill withdraws first, then the pressure rises to SV2's setting and the clamp lets go.
- Lower SV1 below the pressure the clamp needs to move (raise "force to move the clamp"): the drill starts while the clamp is still travelling.
- Tick *Clamp jams halfway*: the jammed clamp raises the pressure just as a clamped part would, and the drill starts on an unclamped part. Pressure sequencing cannot tell the difference.
- Raise SV1 above the relief setting: the drill never starts.
- Raise the drilling thrust above what SV1's setting provides: the system pressure follows the drill, and the clamp force rises with it.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'pump pressure (bar)', min: 0 }, legend: false }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'pseq1', label: 'SV1: the drill may start at', min: 10, max: 150, step: 1, value: 50, unit: 'bar' },
        { id: 'pseq2', label: 'SV2: the clamp may release at', min: 10, max: 150, step: 1, value: 30, unit: 'bar' },
        { id: 'Fc', label: 'Force to move the clamp', min: 0, max: 8, step: 0.1, value: 2, unit: 'kN' },
        { id: 'Fd', label: 'Drilling thrust', min: 0, max: 25, step: 0.5, value: 12, unit: 'kN' },
        { id: 'relief', label: 'Relief-valve setting', min: 60, max: 200, step: 5, value: 100, unit: 'bar' },
        { id: 'jam', type: 'check', label: 'Clamp jams halfway (a burr)', value: false }
      ], () => {});
      const ro = kit.readout(box.side, [['step', 'Step'], ['p', 'Pump pressure'], ['fc', 'Clamping force on the part'], ['q', 'Flow to clamp / drill / relief'], ['h', 'Heat in the sequence valve'], ['x', 'Clamp / drill position']]);
      const V = ctl.values;
      const C1 = cylinder(0.04, 0.022, 0.1), C2 = cylinder(0.063, 0.036, 0.1);
      const QP = 12 / 60000, CONTACT1 = 0.085, JAM = 0.05, CONTACT2 = 0.07;
      const KOV = 20 / 60000 / 8e5, CDASV = 0.65 * 20e-6;         // sequence valve: 20 L/min at 8 bar above its setting; 20 mm² wide open
      const s = { x1: 0, x2: 0, phase: 'ext', tPhase: 0, vs: 1, t: 0, hist: [], tPlot: 0, hole: 0, warned: '', fault: '' };
      let o = { p: 0, pA: 0, pB: 0, q1: 0, q2: 0, qr: 0, p2: 0, clampF: 0, heat: 0, step: '' };
      // inverse of an increasing "pressure needed at flow q": the flow a pressure p drives (0 if p is not enough)
      const flowAt = (need, p) => p <= need(0) ? 0 : bisect(q => need(q) - p, 0, 0.004, 32);
      function extend(pSet) {
        const stop1 = V.jam ? JAM : CONTACT1, c1moves = s.x1 < stop1 - 1e-6, c2moves = s.x2 < C2.stroke - 1e-6;
        const F2 = FR + (s.x2 >= CONTACT2 ? V.Fd * 1000 : 0), pseq = V.pseq1 * 1e5;
        const need1 = q => (V.Fc * 1000 + (0.5e5 + dpv(q * C1.A2 / C1.A1)) * C1.A2) / C1.A1;
        const need2 = q => (F2 + dpv(q * C2.A2 / C2.A1) * C2.A2) / C2.A1 + dpOrif(CDASV, q);
        const q1of = pA => c1moves ? flowAt(need1, pA) : 0;
        const q2of = pA => c2moves && pA > pseq ? Math.min(KOV * (pA - pseq), flowAt(need2, pA)) : 0;
        const f = pA => { const a = q1of(pA), b = q2of(pA); return a + b + reliefQ(pA + dpv(a + b), QP, pSet) - QP; };
        const pA = bisect(f, 0, pSet + 6e5, 40), q1 = q1of(pA), q2 = q2of(pA), p = pA + dpv(q1 + q2);
        const p2 = q2 > 0 ? (F2 + dpv(q2 * C2.A2 / C2.A1) * C2.A2) / C2.A1 : !c2moves ? pA : 0;
        return { p, pA, pB: 0, q1, q2, qr: reliefQ(p, QP, pSet), p2, clampF: !c1moves && !V.jam ? pA * C1.A1 : 0, heat: q2 * Math.max(0, pA - p2), v1: q1 / C1.A1, v2: q2 / C2.A1 };
      }
      function retract(pSet) {
        const pseq = V.pseq2 * 1e5, c1moves = s.x1 > 1e-6, c2moves = s.x2 > 1e-6;
        const need2 = q => (FR + (0.5e5 + dpv(q * C2.A1 / C2.A2)) * C2.A1) / C2.A2;
        const need1 = q => (500 + dpv(q * C1.A1 / C1.A2) * C1.A1) / C1.A2 + dpOrif(CDASV, q);
        const q2of = pB => c2moves ? flowAt(need2, pB) : 0;
        const q1of = pB => c1moves && pB > pseq ? Math.min(KOV * (pB - pseq), flowAt(need1, pB)) : 0;
        const f = pB => { const a = q1of(pB), b = q2of(pB); return a + b + reliefQ(pB + dpv(a + b), QP, pSet) - QP; };
        const pB = bisect(f, 0, pSet + 6e5, 40), q1 = q1of(pB), q2 = q2of(pB), p = pB + dpv(q1 + q2);
        return { p, pA: 0, pB, q1, q2, qr: reliefQ(p, QP, pSet), p2: 0, clampF: 0, heat: q1 * Math.max(0, pB - need1(q1) + dpOrif(CDASV, q1)), v1: -q1 / C1.A2, v2: -q2 / C2.A2 };
      }
      function step(dt) {
        const pSet = V.relief * 1e5;
        s.tPhase += dt; s.t += dt;
        const target = s.phase === 'ext' || s.phase === 'dwell' ? 0 : s.phase === 'ret' ? 2 : 1;
        s.vs += clamp(target - s.vs, -dt / 0.08, dt / 0.08);
        const bx = Math.round(s.vs);
        if (bx === 0) o = extend(pSet); else if (bx === 2) o = retract(pSet);
        else o = { p: 3e5 * Math.pow(QP / QREF, 2) + 1e5, pA: 0, pB: 0, q1: 0, q2: 0, qr: 0, p2: 0, clampF: 0, heat: 0, v1: 0, v2: 0 };
        s.x1 = clamp(s.x1 + o.v1 * dt, 0, C1.stroke); s.x2 = clamp(s.x2 + o.v2 * dt, 0, C2.stroke);
        if (o.v1 > 0) s.x1 = Math.min(s.x1, V.jam ? JAM : CONTACT1);          // the clamp stops at the part (or at the burr)
        if (s.x2 > CONTACT2) s.hole = Math.max(s.hole, s.x2 - CONTACT2);
        const stop1 = V.jam ? JAM : CONTACT1;
        if (bx === 0 && o.q2 > 0 && s.x1 < stop1 - 1e-6) s.warned = 'the drill started before the clamp arrived';
        if (bx === 0 && s.x2 > CONTACT2 && V.jam) s.warned = 'drilling an unclamped part!';
        // the cycle
        if (s.phase === 'ext' && s.x2 >= C2.stroke - 1e-6) { s.phase = 'dwell'; s.tPhase = 0; }
        else if (s.phase === 'ext' && s.tPhase > 6) { s.phase = 'ret'; s.tPhase = 0; s.fault = 'the drill never started: SV1 above the relief'; }
        else if (s.phase === 'dwell' && s.tPhase > 0.6) { s.phase = 'ret'; s.tPhase = 0; }
        else if (s.phase === 'ret' && s.x1 <= 1e-6 && s.x2 <= 1e-6) { s.phase = 'change'; s.tPhase = 0; }
        else if (s.phase === 'ret' && s.tPhase > 6) { s.phase = 'change'; s.tPhase = 0; s.fault = 'the clamp stayed shut: SV2 above the relief'; }
        else if (s.phase === 'change' && s.tPhase > 1.2) { s.phase = 'ext'; s.tPhase = 0; s.hole = 0; s.warned = ''; s.x1 = 0; s.fault = ''; }
        o.bx = bx;
      }
      function stepText() {
        const stop1 = V.jam ? JAM : CONTACT1;
        if (s.phase === 'change') return 'part change — pump unloaded through the tandem centre';
        if (o.bx === 1) return 'valve shifting';
        if (s.phase === 'dwell') return 'drill at depth: pump flow over the relief valve';
        if (s.phase === 'ext') {
          if (o.q1 > 0 && o.q2 > 0) return 'clamp and drill both moving!';
          if (o.q1 > 0) return '1 · the clamp advances';
          if (o.q2 > 0) return s.x2 < CONTACT2 ? '3 · SV1 open: the drill advances' : '4 · drilling';
          return s.x1 >= stop1 - 1e-6 ? '2 · clamp stopped: pressure rising towards SV1' : 'waiting';
        }
        if (o.q2 > 0) return '5 · the drill retracts first';
        if (o.q1 > 0) return '7 · SV2 open: the clamp releases';
        return s.x2 <= 1e-6 ? '6 · drill home: pressure rising towards SV2' : 'waiting';
      }
      const adv = phaser();
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const C = kit.colors(), pSet = V.relief * 1e5, ext = o.bx === 0, ret = o.bx === 2;
        ro.set('step', stepText());
        ro.set('p', bar(o.p));
        ro.set('fc', o.clampF > 0 ? (o.clampF / 1000).toFixed(2) + ' kN' : ext && s.x1 < (V.jam ? JAM : CONTACT1) - 1e-6 ? '0 (not at the part)' : V.jam && ext ? '0 — jammed, not touching the part' : '0');
        ro.set('q', (o.q1 * 60000).toFixed(1) + ' / ' + (o.q2 * 60000).toFixed(1) + ' / ' + (o.qr * 60000).toFixed(1) + ' L/min');
        ro.set('h', kw(o.heat));
        ro.set('x', (s.x1 * 1000).toFixed(0) + ' / ' + (s.x2 * 1000).toFixed(0) + ' mm');
        s.tPlot += dt;
        if (s.tPlot > 0.08) { s.tPlot = 0; s.hist.push([s.t, o.p / 1e5]); if (s.hist.length > 200) s.hist.shift();
          plot.set({ series: [{ pts: s.hist.slice(), label: 'pump pressure' }], hlines: [{ y: V.pseq1, label: 'SV1' }, { y: V.pseq2, label: 'SV2' }, { y: V.relief, label: 'relief' }] }); }
        // ---- drawing on a 900 × 500 grid: the circuit on the left, the machine on the right
        const c = design(st, 900, 500), col = S.col, hp = o.p > 5e5;
        const extFlow1 = ext && o.q1 > 0, extFlow2 = ext && o.q2 > 0, retFlow1 = ret && o.q1 > 0, retFlow2 = ret && o.q2 > 0;
        const P = {
          aMan: [[38, 80], [38, 330], [513.2, 330], [513.2, 343]],
          c2cap: [[308, 80], [308, 251]], cv1top: [[308, 240], [258, 240], [258, 262]], sv1in: [[308, 309], [308, 330]], cv1bot: [[258, 298], [258, 330]],
          sv1drain: [[335, 251], [335, 240], [362, 240], [362, 246]],
          bMan: [[122, 215], [526.8, 215], [526.8, 343]], c2rod: [[442, 80], [442, 215]],
          c1rod: [[172, 80], [172, 131]], cv2top: [[172, 112], [122, 112], [122, 142]], sv2in: [[172, 189], [172, 215]], cv2bot: [[122, 178], [122, 215]],
          sv2drain: [[199, 131], [199, 118], [228, 118], [228, 124]],
          header: [[380, 419], [380, 410], [513.2, 410], [513.2, 397]], gauge: [[345, 399], [345, 410], [380, 410]],
          relief: [[455, 410], [455, 411]], reliefOut: [[455, 469], [455, 469]], tline: [[526.8, 397], [526.8, 470]]
        };
        const aSt = ext ? (hp ? 'pressure' : 'idle') : ret && (retFlow1 || retFlow2) ? 'return' : 'idle';
        const bSt = ret ? (hp ? 'pressure' : 'idle') : ext && (extFlow1 || extFlow2) ? 'return' : 'idle';
        S.line(c, P.aMan, { state: aSt });
        S.line(c, P.sv1in, { state: aSt }); S.line(c, P.cv1bot, { state: ext ? aSt : retFlow2 ? 'return' : 'idle' });
        const c2capSt = ext ? (o.q2 > 0 || s.x2 >= C2.stroke - 1e-6 ? 'pressure' : 'idle') : retFlow2 ? 'return' : 'idle';
        S.line(c, P.c2cap, { state: c2capSt }); S.line(c, P.cv1top, { state: c2capSt });
        S.line(c, P.bMan, { state: bSt }); S.line(c, P.c2rod, { state: ext ? (extFlow2 ? 'return' : 'idle') : bSt });
        S.line(c, P.sv2in, { state: bSt }); S.line(c, P.cv2bot, { state: ret ? bSt : extFlow1 ? 'return' : 'idle' });
        const c1rodSt = ret ? (o.q1 > 0 ? 'pressure' : 'idle') : extFlow1 ? 'return' : 'idle';
        S.line(c, P.c1rod, { state: c1rodSt }); S.line(c, P.cv2top, { state: c1rodSt });
        S.line(c, P.sv1drain, { kind: 'drain', state: 'idle' }); S.line(c, P.sv2drain, { kind: 'drain', state: 'idle' });
        S.line(c, P.header, { state: hp ? 'pressure' : 'idle' }); S.line(c, P.gauge, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.relief, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.tline, { state: o.q1 + o.q2 > 0 || o.bx === 1 ? 'return' : 'idle' });
        for (const [x, y] of [[308, 240], [258, 330], [308, 330], [172, 112], [172, 215], [442, 215], [380, 410], [455, 410]]) S.junction(c, x, y);
        // flow dots
        S.flow(c, P.header, adv('he', QP, dt), { color: col('pressure') });
        if (o.qr > 1e-7) S.flow(c, [[455, 410], [455, 469]], adv('re', o.qr, dt), { color: col('pressure') });
        if (o.bx === 1) S.flow(c, P.tline, adv('tl', QP, dt), { color: col('return') });
        if (ext) {
          if (o.q1 + o.q2 > 0) S.flow(c, [[513.2, 343], [513.2, 330], [308, 330]], adv('am', o.q1 + o.q2, dt), { color: col('pressure') });
          if (o.q1 > 0) { S.flow(c, [[308, 330], [38, 330], [38, 80]], adv('a1', o.q1, dt), { color: col('pressure') }); S.flow(c, P.c1rod.concat([[172, 112], [122, 112], [122, 215], [526.8, 215], [526.8, 343]]), adv('r1', o.q1 * C1.A2 / C1.A1, dt), { color: col('return') }); }
          if (o.q2 > 0) { S.flow(c, [[308, 330], [308, 80]], adv('a2', o.q2, dt), { color: col('pressure') }); S.flow(c, P.c2rod.concat([[526.8, 215], [526.8, 343]]), adv('r2', o.q2 * C2.A2 / C2.A1, dt), { color: col('return') }); }
          if (o.q1 + o.q2 > 0) S.flow(c, P.tline, adv('tl', o.q1 * C1.A2 / C1.A1 + o.q2 * C2.A2 / C2.A1, dt), { color: col('return') });
        }
        if (ret) {
          if (o.q1 + o.q2 > 0) S.flow(c, [[526.8, 343], [526.8, 215], [442, 215]], adv('bm', o.q1 + o.q2, dt), { color: col('pressure') });
          if (o.q2 > 0) { S.flow(c, [[442, 215], [442, 80]], adv('b2', o.q2, dt), { color: col('pressure') }); S.flow(c, [[308, 80], [308, 240], [258, 240], [258, 330], [513.2, 330], [513.2, 343]], adv('c2', o.q2 * C2.A1 / C2.A2, dt), { color: col('return') }); }
          if (o.q1 > 0) { S.flow(c, [[442, 215], [172, 215], [172, 80]], adv('b1', o.q1, dt), { color: col('pressure') }); S.flow(c, [[38, 80], [38, 330], [513.2, 330], [513.2, 343]], adv('c1', o.q1 * C1.A1 / C1.A2, dt), { color: col('return') }); }
          if (o.q1 + o.q2 > 0) S.flow(c, P.tline, adv('tl', o.q1 * C1.A1 / C1.A2 + o.q2 * C2.A1 / C2.A2, dt), { color: col('return') });
        }
        // symbols
        S.pressureValve(c, 308, 280, { kind: 'sequence', open: Math.min(1, o.bx === 0 ? o.q2 / (KOV * 8e5) : 0) });
        S.check(c, 258, 280, { rot: 180, open: retFlow2 });
        S.pressureValve(c, 172, 160, { kind: 'sequence', open: Math.min(1, o.bx === 2 ? o.q1 / (KOV * 8e5) : 0) });
        S.check(c, 122, 160, { rot: 180, open: extFlow1 });
        S.tank(c, 362, 256); S.tank(c, 228, 134);
        kit.label(c, 'SV1  ' + V.pseq1.toFixed(0) + ' bar', 347, 292, { color: C.text, size: 11, weight: 700, align: 'left' });
        kit.label(c, 'SV2  ' + V.pseq2.toFixed(0) + ' bar', 211, 170, { color: C.text, size: 11, weight: 700, align: 'left' });
        kit.label(c, 'CV1', 244, 280, { color: C.muted, size: 10.5, align: 'right' });
        kit.label(c, 'CV2', 108, 160, { color: C.muted, size: 10.5, align: 'right' });
        S.pump(c, 380, 445, { motor: true });
        S.tank(c, 380, 481); S.tank(c, 455, 479); S.tank(c, 526.8, 480);
        S.pressureValve(c, 455, 440, { kind: 'relief', rot: 180, open: Math.min(1, o.qr / QP) });
        S.gauge(c, 345, 378, { frac: o.p / 250e5, value: bar(o.p) });
        const v4 = S.valve(c, 520, 370, { spec: '4/3 tandem', state: s.vs, left: 'spring+solenoid', right: 'spring+solenoid', s: 34, labels: true });
        kit.label(c, 'Y1', v4.xl - 8, 370, { color: ext ? C.bad : C.muted, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 8, 370, { color: ret ? C.bad : C.muted, size: 12, weight: 700, align: 'left' });
        const fill1A = fillP(C, ext ? (s.x1 < (V.jam ? JAM : CONTACT1) - 1e-6 ? o.pA * 0.3 : o.pA) : 0), fill2A = fillP(C, ext ? o.p2 : 0);
        S.cylinder(c, 30, 55, { len: 150, h: 30, pos: s.x1 / C1.stroke, rodLen: 60, fillA: fill1A, fillB: fillP(C, ret && o.q1 > 0 ? o.pB : 0) });
        S.cylinder(c, 300, 55, { len: 150, h: 30, pos: s.x2 / C2.stroke, rodLen: 60, fillA: fill2A, fillB: fillP(C, ret && o.q2 > 0 ? o.pB : 0) });
        kit.label(c, 'C1  clamp 40/22', 105, 30, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'C2  drill feed 63/36', 375, 30, { color: C.text, size: 12, weight: 700, align: 'center' });
        // ---- the machine
        const mx = 640;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(mx - 20, 10); c.lineTo(mx - 20, 490); c.stroke(); c.setLineDash([]);
        kit.label(c, 'the machine', 760, 18, { color: C.muted, size: 12, weight: 700, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(mx - 10, 300); c.lineTo(880, 300); c.stroke();
        c.lineWidth = 1; c.strokeStyle = C.muted; c.beginPath(); for (let x = mx - 6; x < 878; x += 10) { c.moveTo(x, 302); c.lineTo(x - 6, 310); } c.stroke();
        // part, fixed jaw, hole
        const shake = V.jam && ext && o.q2 > 0 && s.x2 > CONTACT2 ? 2.5 * Math.sin(s.t * 47) : 0;   // an unclamped part rattles
        c.fillStyle = C.dark ? '#5d6a8c' : '#b9c2d8'; c.fillRect(740 + shake, 250, 80, 50); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(740 + shake, 250, 80, 50);
        const holeD = Math.min(50, s.hole / (C2.stroke - CONTACT2) * 34);
        if (holeD > 0.5) { c.fillStyle = C.bg2; c.fillRect(776 + shake, 250, 8, holeD); }
        c.fillStyle = C.surface; c.fillRect(820, 228, 16, 72); c.strokeRect(820, 228, 16, 72);
        c.strokeStyle = C.muted; c.beginPath(); for (let y = 232; y < 298; y += 8) { c.moveTo(822, y + 6); c.lineTo(834, y); } c.stroke();
        // clamp
        const face = 700 + 40 * s.x1 / CONTACT1;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(mx - 8, 262, 58, 26); c.strokeRect(mx - 8, 262, 58, 26);
        c.fillRect(690, 272, face - 10 - 690, 6); c.strokeRect(690, 272, face - 10 - 690, 6);
        c.fillStyle = o.clampF > 0 ? col('pressure') : C.surface; c.fillRect(face - 10, 256, 10, 40); c.strokeRect(face - 10, 256, 10, 40);
        if (o.clampF > 0) { kit.arrow(c, face - 34, 240, face - 4, 240, C.warn, 2.5); kit.label(c, (o.clampF / 1000).toFixed(1) + ' kN', face - 38, 240, { color: C.text, size: 11, weight: 700, align: 'right' }); }
        if (V.jam) { kit.label(c, 'burr', mx + 72, 320, { color: C.bad, size: 11, align: 'left' }); c.fillStyle = C.bad; c.beginPath(); c.moveTo(mx + 60 + 40 * JAM / CONTACT1 - 2, 296); c.lineTo(mx + 66 + 40 * JAM / CONTACT1, 284); c.lineTo(mx + 70 + 40 * JAM / CONTACT1, 296); c.closePath(); c.fill(); }
        // drill
        const tipY = 120 + 114 * s.x2 / C2.stroke;
        c.fillStyle = C.surface; c.fillRect(768, 40, 24, 70); c.strokeRect(768, 40, 24, 70);
        c.fillRect(777, 110, 6, tipY - 110); c.strokeRect(777, 110, 6, tipY - 110);
        c.fillRect(770, tipY, 20, 18); c.strokeRect(770, tipY, 20, 18);
        kit.label(c, 'M', 780, tipY + 9, { color: C.text, size: 10, weight: 700, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(780, tipY + 18); c.lineTo(780, tipY + 50); c.stroke();
        c.lineWidth = 1; c.strokeStyle = C.bg2; const turn = (s.t * 40) % 8;
        c.beginPath(); for (let y = tipY + 20 + turn; y < tipY + 48; y += 8) { c.moveTo(778, y); c.lineTo(782, y + 4); } c.stroke();
        const warn = s.fault || s.warned;
        if (warn) kit.label(c, warn, 760, 350, { color: C.bad, size: 11.5, weight: 700, align: 'center' });
        kit.label(c, stepText(), 760, 460, { color: C.muted, size: 11.5, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fc-prop */
  const PVALVES = {
    prop: { name: 'proportional, no spool feedback', ov: 0.18, comp: false, hyst: 0.05, fb: 8, QN: 40 / 60000, dpN: 10e5 },
    lvdt: { name: 'proportional with LVDT', ov: 0.18, comp: true, hyst: 0.004, fb: 50, QN: 40 / 60000, dpN: 10e5 },
    servo: { name: 'servo valve', ov: 0, comp: false, hyst: 0.004, fb: 150, QN: 40 / 60000, dpN: 70e5 }
  };
  Hyper.sim('fc-prop', {
    title: 'Proportional and servo valves: deadband, hysteresis, response',
    blurb: `A four-way spool in section: the pressure groove P in the middle, tank grooves at the ends, the actuator ports A and B on top. An electrical command moves the spool; its lands uncover the ports. The upper graph plots flow against command (the valve's characteristic, traced as it runs), the lower one command and flow against time. Proportional valves are rated at 10 bar across the valve, the servo valve at 70 bar.

**Try this**
- With the slow sine and the plain proportional valve, look at the characteristic: a flat step around zero (the deadband from the spool's overlap) and a loop (hysteresis, a few per cent).
- Switch to the valve with an LVDT: the electronics jump the deadband and the loop almost closes.
- Choose the fast 5 Hz sine: the plain proportional valve cannot keep up — the flow lags and shrinks. The servo valve, with its zero-lapped spool and 150 Hz bandwidth, follows almost perfectly.
- Choose steps and add an amplifier ramp: the flow rises gently instead of jumping — a load would accelerate smoothly.
- Double the pressure drop: at the same command the flow rises by √2 — the valve sets an opening, not a flow.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.33, minH: 200 });
      const g = graphDiv(box);
      const pChar = kit.plot(g, { x: { label: 'command (%)', min: -100, max: 100 }, y: { label: 'flow (L/min), + P→A, − P→B' }, legend: true }, 170);
      const pTime = kit.plot(g, { x: { label: 'time (s)' }, y: { label: '% of full', min: -100, max: 100 }, legend: true }, 140);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Valve', options: [['Proportional, no spool feedback', 'prop'], ['Proportional with LVDT and on-board electronics', 'lvdt'], ['Servo valve (two-stage, feedback wire)', 'servo']], value: PVALVES[params.type] ? params.type : 'prop' },
        { id: 'mode', type: 'select', label: 'Command', options: [['Slow sine (0.2 Hz)', 'slow'], ['Fast sine (5 Hz)', 'fast'], ['Steps of ±60 %', 'steps'], ['Manual (slider)', 'manual']], value: ['slow', 'fast', 'steps', 'manual'].includes(params.mode) ? params.mode : 'slow' },
        { id: 'u', label: 'Manual command', min: -100, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'ramp', label: 'Amplifier ramp (0 → 100 %)', min: 0, max: 2, step: 0.05, value: 0, unit: 's' },
        { id: 'dp', label: 'Pressure drop across the valve', min: 5, max: 140, step: 1, value: 20, unit: 'bar' }
      ], (id) => { if (id === 'type' || id === 'mode' || id === 'dp') { trace.length = 0; hist.length = 0; } });
      const ro = kit.readout(box.side, [['u', 'Command'], ['o', 'Spool opening beyond the overlap'], ['q', 'Flow'], ['full', 'Flow at full command, this Δp'], ['spec', 'Deadband / hysteresis / bandwidth']]);
      const V = ctl.values, trace = [], hist = [];
      const s = { t: 0, ur: 0, yl: 0, y: 0, tPlot: 0 };
      let q = 0, uCmd = 0;
      function command(t) {
        if (V.mode === 'slow') return 0.9 * Math.sin(2 * Math.PI * 0.2 * t);
        if (V.mode === 'fast') return 0.6 * Math.sin(2 * Math.PI * 5 * t);
        if (V.mode === 'steps') { const k = Math.floor(t / 1.2) % 4; return [0, 0.6, 0, -0.6][k]; }
        return V.u / 100;
      }
      const loop = kit.loop((dt) => {
        const P = PVALVES[V.type] || PVALVES.prop, n = 40, h = dt / n, tau = 1 / (2 * Math.PI * P.fb);
        for (let k = 0; k < n; k++) {
          s.t += h;
          uCmd = command(s.t);
          s.ur = V.ramp > 0 ? s.ur + clamp(uCmd - s.ur, -h / V.ramp, h / V.ramp) : uCmd;
          // the amplifier's deadband compensation jumps the overlap
          let uc = s.ur;
          if (P.comp) { const a = Math.abs(uc), e = 0.01; uc = Math.sign(uc) * (a < e ? a / e * (P.ov + e * (1 - P.ov)) : P.ov + (1 - P.ov) * a); }
          s.yl += (uc - s.yl) * (1 - Math.exp(-h / tau));                 // solenoid, pilot and spool: a first-order lag
          if (s.yl > s.y + P.hyst / 2) s.y = s.yl - P.hyst / 2;           // friction: the spool sticks within ±hyst/2
          else if (s.yl < s.y - P.hyst / 2) s.y = s.yl + P.hyst / 2;
        }
        const open = Math.sign(s.y) * Math.max(0, Math.abs(s.y) - P.ov) / (1 - P.ov);
        const qFull = P.QN * Math.sqrt(V.dp * 1e5 / P.dpN);
        q = qFull * open;
        s.tPlot += dt;
        if (s.tPlot > 0.02) {
          s.tPlot = 0;
          trace.push([s.ur * 100, q * 60000]); if (trace.length > 400) trace.shift();
          hist.push([s.t, s.ur * 100, open * 100]); if (hist.length > 240) hist.shift();
          const ideal = [[-100, -qFull * 60000], [100, qFull * 60000]];
          pChar.set({ series: [{ pts: ideal, label: 'ideal (no deadband, no hysteresis)', dash: [5, 4] }, { pts: trace.slice(), label: P.name }], y: { label: 'flow (L/min), + P→A, − P→B', min: -qFull * 60000 * 1.1, max: qFull * 60000 * 1.1 }, marks: [{ x: s.ur * 100, y: q * 60000 }] });
          pTime.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'command' }, { pts: hist.map(p => [p[0], p[2]]), label: 'flow' }] });
        }
        ro.set('u', (s.ur * 100).toFixed(0) + ' %');
        ro.set('o', (open * 100).toFixed(1) + ' %');
        ro.set('q', lpm(Math.abs(q)) + (q > 1e-7 ? ' P→A' : q < -1e-7 ? ' P→B' : ''));
        ro.set('full', lpm(qFull));
        ro.set('spec', (P.comp ? '≈ 0 (compensated)' : (P.ov * 100).toFixed(0) + ' %') + ' / ' + (P.hyst * 100).toFixed(1) + ' % / ' + P.fb + ' Hz');
        // ---- drawing on a 760 × 250 grid: the spool in its sleeve
        const c = design(st, 760, 250), C = kit.colors(), S = kit.fsym;
        const yb0 = 100, yb1 = 150, SP = 30, dx = -s.y * SP, pw = 36, ovp = P.ov * SP, lw = pw + 2 * ovp;
        const xA = 300, xB = 460, xT1 = 200, xP = 380, xT2 = 560;
        // sleeve body
        c.fillStyle = C.surface; c.fillRect(110, 64, 540, 122); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(110, 64, 540, 122);
        // the chambers: tank at the ends, pressure between the lands
        const lA0 = xA - lw / 2 + dx, lA1 = xA + lw / 2 + dx, lB0 = xB - lw / 2 + dx, lB1 = xB + lw / 2 + dx;
        c.globalAlpha = C.dark ? 0.35 : 0.25;
        c.fillStyle = S.col('return'); c.fillRect(130, yb0, lA0 - 130, yb1 - yb0); c.fillRect(lB1, yb0, 630 - lB1, yb1 - yb0);
        c.fillStyle = S.col('pressure'); c.fillRect(lA1, yb0, lB0 - lA1, yb1 - yb0);
        c.globalAlpha = 1;
        // ports: channels through the sleeve
        const portSt = (x, top) => {
          if (!top) return x === xP ? 'pressure' : 'return';
          const toA = x === xA;
          if (Math.abs(q) < 1e-7) return 'idle';
          return (q > 0) === toA ? 'pressure' : 'return';
        };
        for (const [x, top, lab] of [[xA, true, 'A'], [xB, true, 'B'], [xT1, false, 'T'], [xP, false, 'P'], [xT2, false, 'T']]) {
          const y0 = top ? 30 : yb1, y1 = top ? yb0 : 220;
          c.fillStyle = C.bg2; c.fillRect(x - pw / 2, y0, pw, y1 - y0);
          c.globalAlpha = C.dark ? 0.35 : 0.25; c.fillStyle = S.col(portSt(x, top)); c.fillRect(x - pw / 2, y0, pw, y1 - y0); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - pw / 2, y0); c.lineTo(x - pw / 2, y1); c.moveTo(x + pw / 2, y0); c.lineTo(x + pw / 2, y1); c.stroke();
          kit.label(c, lab, x, top ? 20 : 234, { color: C.text, size: 13, weight: 700, align: 'center' });
        }
        // the spool: stem and lands
        c.fillStyle = C.dark ? '#8a93b8' : '#9aa3bf'; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.fillRect(130 + dx, 118, 500, 14); c.strokeRect(130 + dx, 118, 500, 14);
        for (const [a, b] of [[130 + dx, 162 + dx], [lA0, lA1], [lB0, lB1], [598 + dx, 630 + dx]]) { c.fillRect(a, yb0 + 1, b - a, yb1 - yb0 - 2); c.strokeRect(a, yb0 + 1, b - a, yb1 - yb0 - 2); }
        // flow through the openings
        const w = Math.min(8, 1 + 7 * Math.abs(q) / (P.QN * 2));
        if (q > 1e-7) { kit.arrow(c, lA1 + 12, 125, xA + 6, 74, S.col('pressure'), w); kit.arrow(c, xB + 6, 74, lB1 + 14, 138, S.col('return'), w); }
        if (q < -1e-7) { kit.arrow(c, lB0 - 12, 125, xB - 6, 74, S.col('pressure'), w); kit.arrow(c, xA - 6, 74, lA0 - 14, 138, S.col('return'), w); }
        // actuators at the ends
        const drive = V.type === 'servo' ? 'torque motor' : 'solenoid';
        for (const [x0, side, on] of [[40, 'a', s.y > 0.01], [660, 'b', s.y < -0.01]]) {
          c.fillStyle = on ? (C.dark ? 'rgba(255,92,92,.25)' : 'rgba(214,40,40,.18)') : C.surface; c.fillRect(x0, 90, 60, 70); c.strokeStyle = C.text; c.strokeRect(x0, 90, 60, 70);
          c.beginPath(); c.moveTo(x0, 160); c.lineTo(x0 + 60, 90); c.stroke();
          kit.label(c, side, x0 + 30, 176, { color: C.muted, size: 11, align: 'center' });
        }
        kit.label(c, drive + ' · command ' + (s.ur * 100).toFixed(0) + ' %', 380, 244 - 2, { color: C.muted, size: 11, align: 'center' });
        if (P.ov > 0) kit.label(c, 'overlap ' + (P.ov * 100).toFixed(0) + ' % of the stroke', 650, 40, { color: C.muted, size: 11, align: 'right' });
        else kit.label(c, 'zero lap', 650, 40, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fc-sync */
  Hyper.sim('fc-sync', {
    title: 'Two cylinders, one platform',
    blurb: `A platform rests on two cylinders, 2 m apart, pinned so that it can tilt. The load can sit anywhere along it. Choose how the oil is shared: a plain **tee**, a **gear flow divider** (two gear motors on one shaft), two cylinders **in series** (the first one's annulus feeds the second), or **guide columns** that force the platform to stay level. The platform lifts, waits, lowers under its own weight and waits again; the graph follows the two cylinder positions.

**Try this**
- With the tee, move the load towards one end: the lightly loaded cylinder rises all the way first, then the other follows. The platform tilts through the whole stroke.
- Switch to the flow divider: both rise together, within its 2 % error. Watch the section pressures when the leading cylinder reaches the top — the divider intensifies until a section relief valve opens.
- In series, the first cylinder's pressure carries both loads. Tick *Worn piston seal*: oil leaks into the middle chamber and the second cylinder creeps ahead — untick *Resynchronise* and the error grows from cycle to cycle.
- Try the catalogue pair (100/56 feeding an 80 mm cylinder): the second runs 7 % fast and hits its end first.
- Guide columns keep it level whatever the load — and carry the unbalance.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 }, legend: true }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Sharing the oil', options: [['A tee', 'tee'], ['Gear flow divider (±2 %)', 'div'], ['In series, matched areas', 'series'], ['In series, catalogue pair 100/56 + 80', 'mis'], ['Guide columns (mechanical)', 'guide']], value: 'tee' },
        { id: 'W', label: 'Load', min: 0, max: 60, step: 1, value: 30, unit: 'kN' },
        { id: 'a', label: 'Load position (0 = left, 1 = right)', min: 0, max: 1, step: 0.01, value: 0.3 },
        { id: 'resync', type: 'check', label: 'Resynchronise at the ends of stroke', value: true },
        { id: 'worn', type: 'check', label: 'Worn piston seal (series)', value: false }
      ], (id) => { if (id === 'mode') reset(); });
      const ro = kit.readout(box.side, [['x', 'Left / right position'], ['d', 'Difference (tilt)'], ['p', 'Pump pressure'], ['pc', 'Left / right cap pressure'], ['note', 'Note']]);
      const V = ctl.values;
      const SPAN = 2, STROKE = 0.3, QP = 40 / 60000, PSET = 160e5, PSEC = 200e5, WP = 10e3;
      const KH = 3e5 / Math.pow(20 / 60000, 2), KLOW = 40e5 / Math.pow(30 / 60000, 2), EPS = 0.02;
      const area = D => Math.PI * D * D / 4;
      const s = { xL: 0, xR: 0, dV: 0, phase: 'lift', tPhase: 0, vs: 1, t: 0, hist: [], tPlot: 0, note: '', still: 0 };
      let o = { p: 0, pL: 0, pR: 0, vL: 0, vR: 0 };
      function reset() { s.xL = 0; s.xR = 0; s.dV = 0; s.phase = 'lift'; s.tPhase = 0; s.hist.length = 0; }
      function geo() {
        if (V.mode === 'series' || V.mode === 'mis') {
          const A1L = area(0.1), A2L = A1L - area(0.056), A1R = V.mode === 'series' ? A2L : area(0.08);
          return { A1L, A2L, A1R, DL: 0.1, DR: Math.sqrt(4 * A1R / Math.PI), series: true };
        }
        return { A1L: area(0.1), A2L: 0, A1R: area(0.1), DL: 0.1, DR: 0.1, series: false };
      }
      function step(dt) {
        const G = geo(), FL = WP / 2 + V.W * 1000 * (1 - V.a), FR = WP / 2 + V.W * 1000 * V.a;
        const pl = FL / G.A1L, pr = FR / G.A1R, kl = (V.worn ? 1.5 : 0.1) / 60000 / 100e5;   // leakage across the first piston
        s.tPhase += dt; s.t += dt;
        const target = s.phase === 'lift' ? 0 : s.phase === 'lower' ? 2 : 1;
        s.vs += clamp(target - s.vs, -dt / 0.1, dt / 0.1);
        const bx = Math.round(s.vs), topL = s.xL >= STROKE - 1e-6, topR = s.xR >= STROKE - 1e-6, botL = s.xL <= 1e-6, botR = s.xR <= 1e-6;
        let vL = 0, vR = 0, p = 0, pL = pl, pR = pr, note = '';
        if (bx === 0) {
          if (V.mode === 'tee') {
            const qi = (pt, pc, top) => top ? 0 : Math.sqrt(Math.max(0, pt - pc) / KH);
            const f = pt => { const q = qi(pt, pl, topL) + qi(pt, pr, topR); return q + reliefQ(pt + dpv(q), QP, PSET) - QP; };
            const pt = bisect(f, 0, PSET + 6e5, 50), qL = qi(pt, pl, topL), qR = qi(pt, pr, topR);
            vL = qL / G.A1L; vR = qR / G.A1R; p = pt + dpv(qL + qR);
            if (Math.abs(pl - pr) > 3e5 && (qL === 0 || qR === 0) && !(topL && topR)) note = 'all the oil goes to the side that needs less pressure';
          } else if (V.mode === 'div') {
            const share = [(1 + EPS) / 2, (1 - EPS) / 2];
            const pin = qd => { const q = [qd * share[0], qd * share[1]], po = [topL ? PSEC : pl + KH * q[0] * q[0], topR ? PSEC : pr + KH * q[1] * q[1]]; return po[0] * share[0] + po[1] * share[1]; };
            if (topL && topR) { p = PSET; }
            else {
              const f = qd => qd + reliefQ(pin(qd) + dpv(qd), QP, PSET) - QP;
              const qd = f(0) >= 0 ? 0 : f(QP) <= 0 ? QP : bisect(f, 0, QP, 50);
              vL = topL ? 0 : qd * share[0] / G.A1L; vR = topR ? 0 : qd * share[1] / G.A1R; p = pin(qd) + dpv(qd);
              if (topL) pL = PSEC; if (topR) pR = PSEC;
              if (topL !== topR && qd > 0) note = 'one section blocked: intensified to its relief (' + bar(PSEC) + ') while the other finishes';
            }
          } else if (G.series) {
            const f = q => { const pc = pl + (pr * G.A2L) / G.A1L; return q + reliefQ(pc + KH * q * q + dpv(q), QP, PSET) - QP; };
            const pcap = pl + pr * G.A2L / G.A1L;               // p₁ = (F₁ + p_mid A₂)/A₁ with p_mid = F₂/A₁,₂
            if (!topL && !topR) {
              const q = f(QP) <= 0 ? QP : bisect(f, 0, QP, 50), leak = kl * Math.max(0, pcap - pr);
              vL = Math.max(0, q - leak) / G.A1L; s.dV += leak * dt; p = pcap + KH * q * q + dpv(q); pL = pcap;
            } else if (topR && !topL) {
              if (V.resync) { const q = QP; vL = q / G.A1L; p = pl + KH * q * q + dpv(q); pL = pl; note = 'right at its end: the resync valve vents the middle chamber'; }
              else { p = PSET; pL = PSET; note = 'stuck: the right cylinder is at its end and the trapped oil stops the left'; }
            } else if (topL && !topR) {
              if (V.resync) { s.dV += QP * dt; p = pr + dpv(QP); pL = PSET; note = 'left at its end: the resync valve feeds the middle chamber'; }
              else { p = PSET; pL = PSET; note = 'the right cylinder lags and cannot catch up'; }
            } else p = PSET;
          } else {
            const A = G.A1L + G.A1R, pp = (FL + FR) / A;
            if (!(topL && topR)) { const f = q => q + reliefQ(pp + KH * q * q + dpv(q), QP, PSET) - QP; const q = f(QP) <= 0 ? QP : bisect(f, 0, QP, 50); vL = vR = q / A; p = pp + KH * q * q + dpv(q); } else p = PSET;
            pL = pR = pp; note = 'the guides carry ' + (Math.abs(FL - FR) / 2000).toFixed(1) + ' kN of unbalance';
          }
        } else if (bx === 2) {
          if (V.mode === 'tee') {
            const qi = (pc, pcap, bot) => bot ? 0 : Math.sqrt(Math.max(0, pcap - pc) / KH);
            const g = pc => Math.sqrt(pc / KLOW) - qi(pc, pl, botL) - qi(pc, pr, botR);
            const pc = bisect(g, 0, Math.max(pl, pr), 50);
            vL = -qi(pc, pl, botL) / G.A1L; vR = -qi(pc, pr, botR) / G.A1R;
            if (!botL && !botR && Math.abs(vL - vR) > 0.002) note = 'lowering: the heavier side goes down first';
          } else if (V.mode === 'div') {
            const share = [(1 + EPS) / 2, (1 - EPS) / 2];
            const g = qd => [pl, pr].reduce((acc, pc, i) => acc + (pc - KH * Math.pow(qd * share[i], 2)) * share[i], 0) - KLOW * qd * qd;
            const qd = bisect(x => -g(x), 0, 0.01, 50);
            vL = botL ? 0 : -qd * share[0] / G.A1L; vR = botR ? 0 : -qd * share[1] / G.A1R;
          } else if (G.series) {
            const pcap = pl + pr * G.A2L / G.A1L;
            if (!botL && !botR) { const q = Math.sqrt(pcap / KLOW), leak = kl * Math.max(0, pcap - pr); vL = -(q + leak) / G.A1L; s.dV += leak * dt; }
            else if (botR && !botL) { vL = V.resync ? -Math.sqrt(pl / KLOW) / G.A1L : 0; if (!V.resync) note = 'the right cylinder is down; the left is held up by the trapped oil'; }
            else if (botL && !botR) {
              if (V.resync) { s.dV = Math.max(0, s.dV - Math.sqrt(pr / KLOW) * dt); note = 'left down: the resync valve lets the right one settle'; }
              else note = 'the right cylinder stays up: the error is kept for the next stroke';
            }
          } else {
            const A = G.A1L + G.A1R, pp = (FL + FR) / A;
            if (!(botL && botR)) vL = vR = -Math.sqrt(pp / KLOW) / A;
          }
          p = 3e5;
        } else p = 3e5;
        const xrPrev = s.xR;
        s.xL = clamp(s.xL + vL * dt, 0, STROKE);
        if (G.series) {
          if (bx === 2 && V.resync && botR && !botL) s.dV = -G.A2L * s.xL;       // make-up keeps the right one on its stop
          if (bx === 0 && V.resync && topR && !topL) s.dV = G.A1R * STROKE - G.A2L * s.xL;
          const xr = (G.A2L * s.xL + s.dV) / G.A1R;
          s.xR = clamp(xr, 0, STROKE);
          vR = vL;
        } else s.xR = clamp(s.xR + vR * dt, 0, STROKE);
        // the cycle: lift, hold, lower, hold (a stroke that has stopped moving counts as finished)
        s.still = Math.abs(vL) + Math.abs(s.xR - xrPrev) / Math.max(dt, 1e-9) < 1e-5 ? s.still + dt : 0;
        const up = s.xL >= STROKE - 1e-6 && s.xR >= STROKE - 1e-6, down = s.xL <= 1e-6 && s.xR <= 1e-6;
        if (s.phase === 'lift' && (up || s.tPhase > 12 || (s.still > 1.2 && s.tPhase > 1.5))) { s.phase = 'holdUp'; s.tPhase = 0; }
        else if (s.phase === 'holdUp' && s.tPhase > 1) { s.phase = 'lower'; s.tPhase = 0; }
        else if (s.phase === 'lower' && (down || s.tPhase > 12 || (s.still > 1.2 && s.tPhase > 1.5))) { s.phase = 'holdDown'; s.tPhase = 0; }
        else if (s.phase === 'holdDown' && s.tPhase > 1) { s.phase = 'lift'; s.tPhase = 0; }
        o = { p, pL, pR, vL, vR, bx, note, G };
      }
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 4; k++) step(dt / 4);
        const C = kit.colors(), G = o.G, dx = (s.xR - s.xL) * 1000;
        ro.set('x', (s.xL * 1000).toFixed(0) + ' / ' + (s.xR * 1000).toFixed(0) + ' mm');
        ro.set('d', dx.toFixed(0) + ' mm  (' + (Math.atan2(s.xR - s.xL, SPAN) * 180 / Math.PI).toFixed(2) + '°)');
        ro.set('p', bar(o.p));
        ro.set('pc', bar(o.pL) + ' / ' + bar(o.pR) + (G.series ? '  (middle chamber ' + bar(o.pR) + ')' : ''));
        ro.set('note', o.note || (o.bx === 0 ? 'lifting' : o.bx === 2 ? 'lowering' : 'holding'));
        s.tPlot += dt;
        if (s.tPlot > 0.1) { s.tPlot = 0; s.hist.push([s.t, s.xL * 1000, s.xR * 1000]); if (s.hist.length > 260) s.hist.shift();
          plot.set({ series: [{ pts: s.hist.map(h => [h[0], h[1]]), label: 'left' }, { pts: s.hist.map(h => [h[0], h[2]]), label: 'right', dash: [5, 4] }], y: { label: 'position (mm)', min: 0, max: 320 } }); }
        // ---- drawing on a 760 × 480 grid
        const c = design(st, 760, 480), col = S.col;
        const hL = 40, hR = Math.round(40 * G.DR / 0.1), xl = 180, xr = 580, yc = 340;
        const lifting = o.bx === 0 && (o.vL > 0 || o.vR > 0), lowering = o.bx === 2 && (o.vL < 0 || o.vR < 0);
        const lineSt = lifting ? 'pressure' : lowering ? 'return' : o.p > 20e5 ? 'pressure' : 'idle';
        const fill = p => fillP(C, p);
        const cl = S.cylinder(c, xl, yc, { len: 140, h: hL, rot: 270, rodLen: 140, pos: s.xL / STROKE, fillA: fill(o.pL), fillB: G.series ? fill(o.pR) : null });
        const cr = S.cylinder(c, xr, yc, { len: 140, h: hR, rot: 270, rodLen: 140, pos: s.xR / STROKE, fillA: fill(o.pR) });
        // rod ends that carry no oil breathe to the tank
        for (const [cy2, on] of [[cl, !G.series], [cr, true]]) if (on) { S.line(c, [cy2.B, [cy2.B[0] + 16, cy2.B[1]], [cy2.B[0] + 16, cy2.B[1] + 8]], { kind: 'drain', state: 'idle' }); S.tank(c, cy2.B[0] + 16, cy2.B[1] + 18, { w: 18 }); }
        // platform and load
        const yL = cl.tip[1], yR = cr.tip[1], ang = Math.atan2(yR - yL, xr - xl);
        c.save(); c.translate(xl, yL); c.rotate(ang);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(-60, -10, (xr - xl) + 120, 10); c.strokeRect(-60, -10, (xr - xl) + 120, 10);
        const lx = V.a * (xr - xl), lw = 30 + V.W * 0.8;
        if (V.W > 0) { c.fillStyle = C.dark ? '#5d6a8c' : '#b9c2d8'; c.fillRect(lx - lw / 2, -10 - 34, lw, 34); c.strokeRect(lx - lw / 2, -10 - 34, lw, 34); }
        c.restore();
        kit.label(c, V.W.toFixed(0) + ' kN', xl + V.a * (xr - xl), (yL + (yR - yL) * V.a) - 70, { color: C.text, size: 12, weight: 700, align: 'center' });
        if (V.mode === 'guide') {
          c.strokeStyle = C.muted; c.lineWidth = 6;
          c.beginPath(); c.moveTo(xl - 70, 40); c.lineTo(xl - 70, yc + 10); c.moveTo(xr + 70, 40); c.lineTo(xr + 70, yc + 10); c.stroke();
          kit.label(c, 'guide', xl - 70, 30, { color: C.muted, size: 11, align: 'center' });
          kit.label(c, 'guide', xr + 70, 30, { color: C.muted, size: 11, align: 'center' });
        }
        const tiltMm = Math.abs(s.xR - s.xL) * 1000;
        if (tiltMm > 20) kit.label(c, 'platform tilted by ' + tiltMm.toFixed(0) + ' mm', 380, 22, { color: C.bad, size: 13, weight: 700, align: 'center' });
        kit.label(c, 'Ø ' + (G.DL * 1000).toFixed(0) + (G.series ? '/56' : ''), xl - 30, yc - 20, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'Ø ' + (G.DR * 1000).toFixed(1).replace('.0', ''), xr - 26, yc - 20, { color: C.muted, size: 11, align: 'right' });
        // the circuit below
        const aL = cl.A, aR = cr.A, vx = 380;
        const spec = { top: [['A', 0.5]], bottom: [['P', 0.3], ['T', 0.7]], boxes: [['P>A', 'T|'], ['A|', 'P>T'], ['A>T', 'P|']], normal: 1 };
        const vv = S.valve(c, vx, 420, { spec, state: s.vs, left: 'spring+solenoid', right: 'spring+solenoid', s: 30 });
        kit.label(c, 'lift', vv.xl - 6, 420, { color: o.bx === 0 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'lower', vv.xr + 6, 420, { color: o.bx === 2 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        S.line(c, [[vv.P[0], vv.P[1]], [vv.P[0], 450], [330, 450]], { state: o.p > 5e5 ? 'pressure' : 'idle' });
        S.source(c, 330, 470);
        kit.label(c, 'pump 40 L/min · relief 160 bar', 314, 470, { color: C.muted, size: 11, align: 'right' });
        S.tank(c, vv.T[0], vv.T[1] + 10);
        const adv = phaseOf;
        if (V.mode === 'div') {
          const pin = [[vx, 395], [vx, 390], [350, 390], [350, 383]], pin2 = [[vx, 390], [410, 390], [410, 383]];
          const oL = [[350, 361], [350, 352], [aL[0], 352], [aL[0], aL[1]]], oR = [[410, 361], [410, 352], [aR[0], 352], [aR[0], aR[1]]];
          for (const p of [pin, pin2, oL, oR]) S.line(c, p, { state: lineSt });
          S.junction(c, vx, 390);
          for (const x of [350, 410]) { c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(x, 372, 11, 0, Math.PI * 2); c.stroke(); }
          c.beginPath(); c.moveTo(361, 370); c.lineTo(399, 370); c.moveTo(361, 374); c.lineTo(399, 374); c.stroke();
          kit.label(c, 'gear flow divider', 440, 372, { color: C.muted, size: 11, align: 'left' });
          if (Math.abs(o.vL) > 1e-6) S.flow(c, oL, adv('dl', Math.abs(o.vL) * G.A1L, dt, o.vL < 0), { color: col(lineSt) });
          if (Math.abs(o.vR) > 1e-6) S.flow(c, oR, adv('dr', Math.abs(o.vR) * G.A1R, dt, o.vR < 0), { color: col(lineSt) });
        } else if (G.series) {
          const pA = [[vx, 395], [vx, 372], [aL[0], 372], [aL[0], aL[1]]], mid = [[cl.B[0], cl.B[1]], [300, cl.B[1]], [300, 356], [aR[0], 356], [aR[0], aR[1]]];
          S.line(c, pA, { state: lineSt }); S.line(c, mid, { state: o.pR > 5e5 ? 'metered' : 'idle' });
          kit.label(c, 'middle chamber: left annulus → right cap', 306, 250, { color: C.muted, size: 11, align: 'left' });
          if (Math.abs(o.vL) > 1e-6) { S.flow(c, pA.slice().reverse(), adv('sa', Math.abs(o.vL) * G.A1L, dt, o.vL < 0), { color: col(lineSt) }); S.flow(c, mid, adv('sm', Math.abs(o.vL) * G.A2L, dt, o.vL < 0), { color: col('metered') }); }
        } else {
          const pA = [[vx, 395], [vx, 372]], lL = [[vx, 372], [aL[0], 372], [aL[0], aL[1]]], lR = [[vx, 372], [aR[0], 372], [aR[0], aR[1]]];
          for (const p of [pA, lL, lR]) S.line(c, p, { state: lineSt });
          S.junction(c, vx, 372);
          if (Math.abs(o.vL) > 1e-6) S.flow(c, lL, adv('tl', Math.abs(o.vL) * G.A1L, dt, o.vL < 0), { color: col(lineSt) });
          if (Math.abs(o.vR) > 1e-6) S.flow(c, lR, adv('tr', Math.abs(o.vR) * G.A1R, dt, o.vR < 0), { color: col(lineSt) });
        }
        c.restore();
      }, box.stage);
      // flow-dot phases that run towards the cylinders when lifting and back when lowering
      const phases = {};
      function phaseOf(key, q, dt, back) { phases[key] = (phases[key] || 0) + (back ? -1 : 1) * dt * 90 * q / QREF; return phases[key]; }
      loop.start();
    }
  });
})();
