/* HYPER-HYDRAULICS · sims/pumps-motors.js — simulations for "Hydraulic Pumps and Motors" (content/pumps-motors.js).
 *   pm-gear-pump       an external gear pump in section: tooth spaces carry oil round the casing; displacement,
 *                      flow ripple, leakage, torque; the same pump as an ISO 1219 symbol in a circuit
 *   pm-vane-pump       unbalanced (circular, eccentric, variable) and balanced (two-lobe) vane pumps: chambers filling
 *                      and emptying, displacement counted from the chambers, bearing load
 *   pm-axial-piston    a swash-plate pump: angle -> stroke -> displacement and flow; side view and valve plate, ripple
 *   pm-efficiency-map  volumetric, hydraulic-mechanical and overall efficiency over pressure and speed (Wilson-type
 *                      loss model: slip ~ Δp/μ, torque losses from viscous drag, dry friction and a constant)
 *   pm-comp-pump       fixed pump + relief valve, pressure-compensated and power-limited pumps feeding an adjustable
 *                      load restriction: circuit in ISO symbols and the p–Q characteristic with the operating point
 *   pm-lsht-motor      a multi-lobe radial piston (cam-ring) motor: displacement, speed, torque ripple, starting
 *   pm-hst             a closed-loop hydrostatic transmission driving an 8-tonne wheel loader: constant torque, constant
 *                      power, relief, power limiter, hydrostatic braking
 * Quasi-steady hydraulics throughout; the loader's speed is the only integrated state (fixed sub-steps).
 */
(function () {
  'use strict';
  const TAU = 2 * Math.PI;
  const LPM = 60000;                                   // m³/s -> L/min
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = x => (Number.isFinite(x) ? x : 0);
  const fx = (x, d) => fin(x).toFixed(d == null ? 1 : d);
  const mod = (x, m) => ((x % m) + m) % m;

  // draw on a fixed design grid, scaled and centred on the stage
  function fit(st, c, DW, DH) {
    const k = Math.min(st.W / DW, st.H / DH), ox = (st.W - DW * k) / 2, oy = (st.H - DH * k) / 2;
    c.save(); c.translate(ox, oy); c.scale(k, k);
    return { k, ox, oy };
  }
  function graphDiv(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  function withAlpha(c, a, fn) { const g = c.globalAlpha; c.globalAlpha = g * a; fn(); c.globalAlpha = g; }
  function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  // an arc with an arrowhead at its end (angles in canvas radians; cw when a1 > a0)
  function curvedArrow(kit, c, x, y, r, a0, a1, color, w) {
    c.save(); c.setLineDash([]); c.strokeStyle = color; c.lineWidth = w || 1.8;
    c.beginPath(); c.arc(x, y, r, a0, a1, a1 < a0); c.stroke();
    const tang = a1 + (a1 > a0 ? Math.PI / 2 : -Math.PI / 2);
    kit.fsym.head(c, x + r * Math.cos(a1), y + r * Math.sin(a1), tang, 8, color);
    c.restore();
  }
  // a rectangle along a radius from r1 to r2 (canvas angle a), width w
  function radialRect(c, cx, cy, a, r1, r2, w) {
    const ux = Math.cos(a), uy = Math.sin(a), vx = -uy * w / 2, vy = ux * w / 2;
    c.beginPath();
    c.moveTo(cx + ux * r1 + vx, cy + uy * r1 + vy); c.lineTo(cx + ux * r2 + vx, cy + uy * r2 + vy);
    c.lineTo(cx + ux * r2 - vx, cy + uy * r2 - vy); c.lineTo(cx + ux * r1 - vx, cy + uy * r1 - vy); c.closePath();
  }

  /* ================================================================ EXTERNAL GEAR PUMP */
  Hyper.sim('pm-gear-pump', {
    title: 'External gear pump',
    blurb: `Two gears in a close-fitting casing. Where the teeth come **out** of mesh (bottom) the tooth spaces open and fill from the inlet (**green**); each space carries its oil round the **outside**, sealed against the casing bore, to the top, where the teeth come back **into** mesh and squeeze it out (**red**). On the right the same pump is drawn as its ISO 1219 symbol in a circuit. The graph shows the delivered flow as the shaft turns: it ripples once per tooth. The animation is slowed 40 times.

**Try this**
- Raise the speed from zero: the flow grows in proportion. The pressure has almost nothing to do with it.
- Set 250 bar at 500 rpm, then at 3000 rpm: the leakage in L/min is the same, so the volumetric efficiency is far worse at low speed.
- Change the number of teeth: on the same centre distance, more teeth are smaller teeth — a smoother flow but less displacement.
- Double the face width: displacement, flow and torque double; the ripple percentage does not change.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'shaft angle (°)', min: 0 }, y: { label: 'delivered flow (L/min)', min: 0 }, legend: true }, 150);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'rpm', label: 'Shaft speed', min: 0, max: 3000, step: 50, value: 1500, unit: 'rpm' },
        { id: 'z', label: 'Teeth per gear (same centre distance)', min: 8, max: 20, step: 1, value: 12 },
        { id: 'b', label: 'Face width b', min: 10, max: 40, step: 1, value: 20, unit: 'mm' },
        { id: 'p', label: 'Outlet pressure (gauge)', min: 0, max: 250, step: 5, value: 150, unit: 'bar' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['m', 'Module m'], ['V', 'Displacement, mean / upper'], ['Q', 'Ideal / delivered flow'], ['L', 'Leakage, η_v'], ['f', 'Pumping frequency z·n'], ['r', 'Flow ripple (peak to peak)'], ['T', 'Drive torque, power']]);
      const V = ctl.values;
      const A = 36, PA = 20 * Math.PI / 180, SC = 4.1, CX = 245, CY = 190, OPEN = 1.15;
      let th = 0, g = null, tPlot = 1;
      const ph = { a: 0, b: 0, s: 0, p: 0 };
      function geometry() {
        const z = Math.round(V.z), m = A / z, Rp = A / 2, Ra = Rp + m, Rf = Rp - 1.25 * m, Rb = Rp * Math.cos(PA);
        const b = V.b, pb = Math.PI * m * Math.cos(PA), tau = TAU / z, k2 = m * m * (z + 1);
        const prof = [];
        for (let j = 0; j < z; j++) for (const [f, r] of [[-0.5, Rf], [-0.3, Rf], [-0.2, Rp], [-0.12, Ra], [0.12, Ra], [0.2, Rp], [0.3, Rf]]) prof.push([(j + f) * tau, r]);
        return { z, m, Rp, Ra, Rf, Rb, b, pb, tau, prof,
          up: TAU * b * k2 * 1e-9, mean: TAU * b * (k2 - pb * pb / 12) * 1e-9,           // m³/rev
          rip: (pb * pb / 4) / (k2 - pb * pb / 12) };
      }
      // displaced flow (m³/s) at shaft angle a: b ω (Ra² − Rp² − f²), f = distance of the contact point from the pitch point
      const qInst = (a, w) => { const f = g.Rb * (mod(a, g.tau) - g.tau / 2); return g.b * w * (g.Ra * g.Ra - g.Rp * g.Rp - f * f) * 1e-9; };
      const zone = (psi, mir) => {
        const q = mod(mir ? Math.PI - psi : psi, TAU);
        if (q < 0.3 || q > TAU - 0.3) return 'mesh';
        if (q < OPEN) return 'in';
        if (q > TAU - OPEN) return 'out';
        return 'carry';
      };
      const loop = kit.loop((dt) => {
        if (dirty || !g) { g = geometry(); dirty = false; tPlot = 1; }
        const C = kit.colors(), n = V.rpm / 60, w = TAU * n;
        const Qid = g.mean * n, QL = Math.min(Qid, 0.0085 * V.p * (g.b / 20) / LPM), Q = Math.max(0, Qid - QL);
        const T = g.mean * V.p * 1e5 / (TAU * 0.9) + (V.rpm > 0 ? 0.4 + 0.0004 * V.rpm : 0), P = w * T;
        th = mod(th + w * dt / 40, TAU * 60);
        ro.set('m', fx(g.m, 2) + ' mm (' + g.z + ' teeth, 36 mm centres)');
        ro.set('V', fx(g.mean * 1e6, 2) + ' / ' + fx(g.up * 1e6, 2) + ' cm³/rev');
        ro.set('Q', fx(Qid * LPM) + ' / ' + fx(Q * LPM) + ' L/min');
        ro.set('L', fx(QL * LPM, 2) + ' L/min' + (Qid > 1e-9 ? ',  η_v = ' + fx(Q / Qid, 3) : ''));
        ro.set('f', fx(g.z * n, 0) + ' Hz');
        ro.set('r', fx(g.rip * 100, 1) + ' %');
        ro.set('T', fx(T, 1) + ' N·m,  ' + fx(P / 1000, 2) + ' kW');
        tPlot += dt;
        if (tPlot > 0.12) {
          tPlot = 0;
          const span = 3 * g.tau, pts = [];
          let qmax = 1;
          for (let k = 0; k <= 150; k++) { const a = span * k / 150, q = Math.max(0, qInst(a, w) - QL) * LPM; pts.push([a * 180 / Math.PI, q]); qmax = Math.max(qmax, q); }
          const X = span * 180 / Math.PI;
          plot.set({ x: { label: 'shaft angle (°), three tooth pitches', min: 0, max: X }, y: { label: 'delivered flow (L/min)', min: 0, max: qmax * 1.15 },
            series: [{ pts, label: 'instantaneous' }, { pts: [[0, Q * LPM], [X, Q * LPM]], label: 'mean', dash: [5, 4] }],
            vlines: [{ x: mod(th, span) * 180 / Math.PI }] });
        }
        // ---- drawing on a 760 × 380 grid
        const c = st.begin();
        fit(st, c, 760, 380);
        const x1 = CX - A / 2 * SC, x2 = CX + A / 2 * SC, Rh = (g.Ra + 0.5) * SC;
        const cs = Math.cos(OPEN), sn = Math.sin(OPEN), xl = x1 + Rh * cs, xr = x2 - Rh * cs;
        const pOn = V.p > 2 && V.rpm > 0;
        // casing and its cavity: two bores joined by the inlet and outlet channels
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        rrect(c, x1 - Rh - 26, CY - Rh - 24, (x2 - x1) + 2 * Rh + 52, 2 * Rh + 48, 18); c.fill(); c.stroke();
        c.beginPath();
        c.moveTo(xl, 372); c.lineTo(xl, CY + Rh * sn);
        c.arc(x1, CY, Rh, OPEN, TAU - OPEN, false);
        c.lineTo(xl, 8); c.lineTo(xr, 8); c.lineTo(xr, CY - Rh * sn);
        c.arc(x2, CY, Rh, Math.PI + OPEN, 3 * Math.PI - OPEN, false);
        c.lineTo(xr, 372); c.closePath();
        c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        withAlpha(c, 0.16, () => {
          c.fillStyle = S.col('suction'); c.fillRect(xl + 1, CY + Rh * 0.55, xr - xl - 2, 372 - CY - Rh * 0.55);
          c.fillStyle = S.col(pOn ? 'pressure' : 'idle'); c.fillRect(xl + 1, 8, xr - xl - 2, CY - Rh * 0.55 - 8);
        });
        // tooth spaces coloured by what they hold
        const gears = [{ x: x1, ang: th, mir: false }, { x: x2, ang: Math.PI + g.tau / 2 - th, mir: true }];
        for (const G of gears) for (let j = 0; j < g.z; j++) {
          const a0 = G.ang + j * g.tau, zn = zone(a0 + g.tau / 2, G.mir);
          if (zn === 'mesh') continue;
          c.beginPath(); c.arc(G.x, CY, g.Ra * SC, a0, a0 + g.tau); c.arc(G.x, CY, g.Rf * SC, a0 + g.tau, a0, true); c.closePath();
          c.fillStyle = zn === 'out' ? S.col(pOn ? 'pressure' : 'idle') : S.col('suction');
          withAlpha(c, zn === 'carry' ? 0.55 : 0.38, () => c.fill());
        }
        // the gears
        for (const G of gears) {
          c.beginPath();
          g.prof.forEach(([a, r], i) => { const X = G.x + r * SC * Math.cos(a + G.ang), Y = CY + r * SC * Math.sin(a + G.ang); if (i) c.lineTo(X, Y); else c.moveTo(X, Y); });
          c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
          c.beginPath(); c.arc(G.x, CY, 0.32 * g.Rp * SC, 0, TAU); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
          c.beginPath(); c.arc(G.x, CY, 0.16 * g.Rp * SC, 0, TAU); c.fillStyle = C.muted; c.fill();
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(G.x, CY); c.lineTo(G.x + 0.3 * g.Rp * SC * Math.cos(G.ang), CY + 0.3 * g.Rp * SC * Math.sin(G.ang)); c.stroke();
        }
        // oil parcels carried round the outside
        for (const G of gears) for (let j = 0; j < g.z; j++) {
          const a = G.ang + (j + 0.5) * g.tau;
          if (zone(a, G.mir) !== 'carry') continue;
          kit.dot(c, G.x + (g.Rf + g.Ra) / 2 * SC * Math.cos(a), CY + (g.Rf + g.Ra) / 2 * SC * Math.sin(a), 3, S.col('suction'));
        }
        curvedArrow(kit, c, x1, CY, 0.62 * g.Rp * SC, -2.4, -0.9, C.accent, 2);
        curvedArrow(kit, c, x2, CY, 0.62 * g.Rp * SC, -0.7, -2.2, C.accent, 2);
        // flow in the channels
        const adv = (key, q) => { ph[key] += dt * 4 * q * LPM; return ph[key]; };
        if (Q > 1e-9) {
          const pa = adv('a', Q), pb = adv('b', Q);
          for (const dx of [-16, 0, 16]) {
            S.flow(c, [[CX + dx, 370], [CX + dx, CY + Rh * 0.8]], pa, { color: S.col('suction') });
            S.flow(c, [[CX + dx, CY - Rh * 0.8], [CX + dx, 10]], pb, { color: S.col(pOn ? 'pressure' : 'idle') });
          }
        }
        kit.label(c, 'outlet →  to the circuit', xr + 8, 22, { color: C.text, size: 12, weight: 600 });
        kit.label(c, 'inlet ←  from the tank', xr + 8, 360, { color: C.text, size: 12, weight: 600 });
        kit.label(c, 'left gear driven by the shaft', 14, 40, { color: C.muted, size: 11 });
        kit.label(c, 'oil carried round the outside', 14, 344, { color: C.muted, size: 11 });
        kit.label(c, 'slowed 40×', 10, 372, { color: C.faint, size: 10.5 });
        // the same pump as a symbol, in a circuit
        const px = 625, py = 250;
        S.line(c, [[px, 276], [px, 292]], { state: V.rpm > 0 ? 'suction' : 'idle' });
        S.line(c, [[px, 224], [px, 118], [740, 118]], { state: pOn ? 'pressure' : 'idle' });
        S.line(c, [[680, 98], [680, 118]], { state: pOn ? 'pressure' : 'idle' });
        S.junction(c, 680, 118);
        if (Q > 1e-9) {
          S.flow(c, [[px, 292], [px, 276]], adv('s', Q), { color: S.col('suction') });
          S.flow(c, [[px, 224], [px, 118], [740, 118]], adv('p', Q), { color: S.col(pOn ? 'pressure' : 'idle') });
        }
        S.pump(c, px, py, { motor: true });
        S.tank(c, px, 302);
        S.gauge(c, 680, 77, { frac: V.p / 250, value: fx(V.p, 0) + ' bar' });
        kit.label(c, fx(Q * LPM) + ' L/min', 740, 136, { color: C.text, size: 12, weight: 700, align: 'right' });
        kit.label(c, 'ISO 1219 symbol', px, 336, { color: C.muted, size: 11, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ VANE PUMP */
  Hyper.sim('pm-vane-pump', {
    title: 'Vane pump: unbalanced and balanced',
    blurb: `A slotted rotor turns clockwise inside a cam ring; the vanes follow the ring and trap chambers between them. Chambers that grow over the inlet ports are **green**, chambers that shrink over the outlet ports **red**. The displacement is counted from the chambers themselves and compared with the formula. The graph follows the volume of one chamber through a revolution. The animation is slowed 30 times.

**Try this**
- In the unbalanced pump, slide the eccentricity to zero: the ring is centred, the chambers stop changing size and the flow stops. This is how a variable vane pump is controlled.
- Notice that the unbalanced count is 1–3 % below $2\\pi D_c e b$: with $z$ vanes each chamber spans an arc, and the exact value is $2 z b e D_c \\sin(\\pi/z)$. The formula is the many-vane limit.
- Raise the pressure: the unbalanced pump's rotor is pushed towards the inlet with a force of Δp·b·D — tens of kilonewtons.
- Switch to the balanced pump: each chamber fills and empties **twice** per turn (two humps in the graph, with flat **dwells** where the vanes seal between the ports), the ports face each other and the bearing load disappears.
- Compare 8 and 12 vanes in the unbalanced pump: more vanes, smaller ripple. (The balanced ring with dwells has no kinematic ripple at all; a real one keeps a little, from vane thickness and oil compression.)`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'rotor angle (°)', min: 0, max: 360 }, y: { label: 'volume of one chamber (cm³)', min: 0 }, legend: false }, 150);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Pump', options: [['Unbalanced (circular ring, variable)', 'unbal'], ['Balanced (two-lobe ring, fixed)', 'bal']], value: 'unbal' },
        { id: 'e', label: 'Ring eccentricity e', min: 0, max: 4.5, step: 0.1, value: 3, unit: 'mm' },
        { id: 'N', type: 'select', label: 'Number of vanes', options: [['8', 8], ['10', 10], ['12', 12]], value: 10 },
        { id: 'rpm', label: 'Shaft speed', min: 0, max: 2500, step: 50, value: 1450, unit: 'rpm' },
        { id: 'p', label: 'Outlet pressure (gauge)', min: 0, max: 200, step: 5, value: 100, unit: 'bar' }
      ], (id) => { dirty = true; if (id === 'mode') ctl.show('e', ctl.values.mode === 'unbal'); });
      const ro = kit.readout(box.side, [['V', 'Displacement: formula / counted'], ['Q', 'Ideal / delivered flow'], ['r', 'Flow ripple'], ['F', 'Load on the rotor bearings'], ['f', 'Pumping frequency'], ['T', 'Drive torque, power']]);
      const V = ctl.values;
      const B = 25, CX = 240, CY = 195, SC = 3.2;
      let th = 0, G = null, tPlot = 1, chamber = [];
      const ph = { i: 0, o: 0 };
      function geometry() {
        const bal = V.mode === 'bal', N = +V.N || 10, e = bal ? 0 : clamp(V.e, 0, 4.5);
        const r = bal ? 35.5 : 35, R = 40, R1 = 40, R2 = 36;
        // the balanced ring: sealing dwells at R1 (left, right) and R2 (top, bottom), a little longer than one vane pitch,
        // joined by cosine ramps; the unbalanced ring: a circle whose centre sits e above the rotor's
        const dw = TAU / N + 0.04, ramp = Math.PI / 2 - dw;
        const rho = bal ? (f => {
          let u = mod(f + dw / 2, Math.PI);
          if (u < dw) return R1;
          u -= dw; if (u < ramp) return R2 + (R1 - R2) * (1 + Math.cos(Math.PI * u / ramp)) / 2;
          u -= ramp; if (u < dw) return R2;
          u -= dw; return R2 + (R1 - R2) * (1 - Math.cos(Math.PI * u / ramp)) / 2;
        }) : (f => { const u = f + Math.PI / 2; return e * Math.cos(u) + Math.sqrt(R * R - e * e * Math.sin(u) * Math.sin(u)); });
        const area = (a1, a2) => { let s = 0; const K = 12; for (let k = 0; k < K; k++) { const q = rho(a1 + (a2 - a1) * (k + 0.5) / K); s += (q * q - r * r) / 2; } return s * (a2 - a1); };   // mm²
        const d = TAU / N;
        let sum = 0, mx = -Infinity, mn = Infinity;
        const K = 90;
        for (let k = 0; k < K; k++) {
          const t0 = d * k / K;
          let s = 0;
          for (let i = 0; i < N; i++) { const fa = t0 + i * d, dA = (Math.pow(rho(fa + d), 2) - Math.pow(rho(fa), 2)) / 2; if (dA < 0) s -= dA; }
          sum += s; mx = Math.max(mx, s); mn = Math.min(mn, s);
        }
        const mean = sum / K;                                                   // mm² of chamber area delivered per radian
        return { bal, N, e, r, R, R1, R2, rho, area, d, dw,
          Vg: B * mean * TAU * 1e-9,                                            // m³/rev, counted from the chambers
          Vf: bal ? TAU * B * (R1 * R1 - R2 * R2) * 1e-9 : TAU * (2 * R) * e * B * 1e-9,   // the formulas
          rip: mean > 1e-6 ? (mx - mn) / mean : 0 };
      }
      // kidney ports over the ramps; the lands between them face the dwells (balanced) or the extremes (unbalanced)
      const ports = () => {
        if (!G.bal) return { inl: [[Math.PI / 2 + 0.35, 1.5 * Math.PI - 0.35]], out: [[-Math.PI / 2 + 0.35, Math.PI / 2 - 0.35]] };
        const h = G.dw / 2 + 0.05;
        return { inl: [[1.5 * Math.PI + h, TAU - h], [Math.PI / 2 + h, Math.PI - h]], out: [[h, Math.PI / 2 - h], [Math.PI + h, 1.5 * Math.PI - h]] };
      };
      const loop = kit.loop((dt) => {
        if (dirty || !G) {
          G = geometry(); dirty = false; tPlot = 1;
          chamber = [];
          for (let k = 0; k <= 180; k++) { const a = TAU * k / 180; chamber.push([k * 2, B * G.area(a, a + G.d) / 1000]); }
        }
        const C = kit.colors(), n = V.rpm / 60, w = TAU * n;
        const Qid = G.Vg * n, QL = Math.min(Qid, 0.008 * V.p / LPM), Q = Math.max(0, Qid - QL);
        const F = G.bal ? 0 : V.p * 1e5 * (B / 1000) * (2 * G.r / 1000);
        const T = G.Vg * V.p * 1e5 / (TAU * 0.88) + (V.rpm > 0 ? 0.5 : 0);
        th = mod(th + w * dt / 30, TAU * 60);
        ro.set('V', fx(G.Vf * 1e6, 1) + ' / ' + fx(G.Vg * 1e6, 1) + ' cm³/rev');
        ro.set('Q', fx(Qid * LPM) + ' / ' + fx(Q * LPM) + ' L/min');
        ro.set('r', G.Vg > 1e-9 ? fx(G.rip * 100, 1) + ' %' : '— (no flow)');
        ro.set('F', G.bal ? 'balanced: ≈ 0' : fx(F / 1000, 1) + ' kN (Δp·b·D_r)');
        ro.set('f', fx(G.N * (G.bal ? 2 : 1) * n, 0) + ' Hz');
        ro.set('T', fx(T, 1) + ' N·m,  ' + fx(w * T / 1000, 2) + ' kW');
        tPlot += dt;
        if (tPlot > 0.12) {
          tPlot = 0;
          const vmax = Math.max(1, ...chamber.map(p => p[1]));
          plot.set({ y: { label: 'volume of one chamber (cm³)', min: 0, max: vmax * 1.15 }, series: [{ pts: chamber, label: 'chamber', fill: true }], vlines: [{ x: mod(th, TAU) * 180 / Math.PI }] });
        }
        // ---- drawing on a 760 × 390 grid
        const c = st.begin();
        fit(st, c, 760, 390);
        const pOn = V.p > 2 && V.rpm > 0, rk = (G.r + (G.bal ? (G.R1 + G.R2) / 2 : G.R)) / 2;
        // body
        c.beginPath(); c.arc(CX, CY, (G.R + 17) * SC, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // kidney ports in the side plate, behind the rotor
        const P = ports();
        c.save(); c.lineCap = 'round'; c.lineWidth = 7 * SC;
        for (const [a, b] of P.inl) withAlpha(c, 0.28, () => { c.strokeStyle = S.col('suction'); c.beginPath(); c.arc(CX, CY, rk * SC, a, b); c.stroke(); });
        for (const [a, b] of P.out) withAlpha(c, 0.28, () => { c.strokeStyle = S.col(pOn ? 'pressure' : 'idle'); c.beginPath(); c.arc(CX, CY, rk * SC, a, b); c.stroke(); });
        c.restore();
        // cam ring: between its outer circle and the vane track
        const ey = G.bal ? 0 : -G.e * SC;
        c.beginPath(); c.arc(CX, CY + ey, (G.R + 7) * SC, 0, TAU);
        for (let k = 0; k <= 180; k++) { const f = -TAU * k / 180, q = G.rho(f) * SC; if (k) c.lineTo(CX + q * Math.cos(f), CY + q * Math.sin(f)); else c.moveTo(CX + q * Math.cos(f), CY + q * Math.sin(f)); }
        c.closePath();
        withAlpha(c, 0.45, () => { c.fillStyle = C.muted; c.fill('evenodd'); });
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        // chambers
        for (let i = 0; i < G.N; i++) {
          const fa = th + i * G.d, fb = fa + G.d, dA = (Math.pow(G.rho(fb), 2) - Math.pow(G.rho(fa), 2)) / 2;
          c.beginPath(); c.arc(CX, CY, G.r * SC, fa, fb);
          for (let k = 12; k >= 0; k--) { const f = fa + (fb - fa) * k / 12, q = G.rho(f) * SC; c.lineTo(CX + q * Math.cos(f), CY + q * Math.sin(f)); }
          c.closePath();
          const col = dA < -0.5 ? S.col(pOn ? 'pressure' : 'idle') : dA > 0.5 ? S.col('suction') : C.muted;
          withAlpha(c, Math.abs(dA) > 0.5 ? 0.55 : 0.2, () => { c.fillStyle = col; c.fill(); });
        }
        // rotor and vanes
        c.beginPath(); c.arc(CX, CY, G.r * SC, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        for (let i = 0; i < G.N; i++) {
          const f = th + i * G.d;
          radialRect(c, CX, CY, f, (G.r - 10) * SC, (G.rho(f) - 0.2) * SC, 5); c.fillStyle = C.text; c.fill();
        }
        c.beginPath(); c.arc(CX, CY, 10 * SC, 0, TAU); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + 9 * SC * Math.cos(th), CY + 9 * SC * Math.sin(th)); c.stroke();
        curvedArrow(kit, c, CX, CY, 20 * SC, -2.3, -0.8, C.accent, 2);
        if (!G.bal) {
          kit.dot(c, CX, CY + ey, 3, C.warn);
          if (G.e > 0.3) { c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(CX + 14, CY); c.lineTo(CX + 14, CY + ey); c.stroke(); }
          kit.label(c, 'e = ' + fx(G.e, 1) + ' mm', CX + 18, CY + ey / 2 - 4, { color: C.warn, size: 11, weight: 700, bg: C.surface });
          if (F > 0) {
            const L = Math.min(120, 3 * F / 1000);
            kit.arrow(c, CX - 6, CY + 18, CX - 6 - L, CY + 18, C.bad, 3);
            kit.label(c, fx(F / 1000, 1) + ' kN on the bearings', CX - 6, CY + 38, { color: C.bad, size: 11, weight: 700, align: 'right', bg: C.surface });
          }
        } else kit.label(c, 'pressure forces cancel', CX, CY + 38, { color: C.ok, size: 11, weight: 700, align: 'center', bg: C.surface });
        // port labels outside the body (above the pipes of the unbalanced pump)
        const lab = (a, t, col) => kit.label(c, t, CX + (G.R + 25) * SC * Math.cos(a), CY + (G.R + 25) * SC * Math.sin(a) - (G.bal ? 0 : 14), { color: col, size: 12, weight: 700, align: 'center' });
        for (const [a, b] of P.inl) lab((a + b) / 2, 'in', S.col('suction'));
        for (const [a, b] of P.out) lab((a + b) / 2, 'out', S.col(pOn ? 'pressure' : 'idle'));
        // flow in and out (unbalanced: side ports)
        if (!G.bal) {
          const yIn = CY, xo = CX + (G.R + 17) * SC, xi = CX - (G.R + 17) * SC;
          S.line(c, [[xi - 50, yIn], [xi, yIn]], { state: V.rpm > 0 ? 'suction' : 'idle' });
          S.line(c, [[xo, yIn], [xo + 50, yIn]], { state: pOn ? 'pressure' : 'idle' });
          if (Q > 1e-9) {
            ph.i += dt * 4 * Q * LPM; ph.o += dt * 4 * Q * LPM;
            S.flow(c, [[xi - 50, yIn], [xi, yIn]], ph.i, { color: S.col('suction') });
            S.flow(c, [[xo, yIn], [xo + 50, yIn]], ph.o, { color: S.col(pOn ? 'pressure' : 'idle') });
          }
        }
        // a small explanation panel
        const tx = 500;
        kit.label(c, G.bal ? 'Balanced vane pump' : 'Unbalanced vane pump', tx, 40, { color: C.text, size: 14, weight: 700 });
        const lines = G.bal
          ? ['two-lobe ring, rotor centred', 'two inlets, two outlets, opposite', '2 strokes per chamber per turn', 'V = 2π b (R₁² − R₂²)', 'R₁ = 40 mm, R₂ = 36 mm, b = 25 mm']
          : ['circular ring, off-centre by e', 'one inlet side, one outlet side', '1 stroke per chamber per turn', 'V = 2π D_c e b', 'D_c = 80 mm, b = 25 mm'];
        lines.forEach((t, i) => kit.label(c, t, tx, 70 + 22 * i, { color: i === 3 ? C.accent : C.muted, size: 12, weight: i === 3 ? 700 : 500 }));
        kit.label(c, 'flow ' + fx(Q * LPM) + ' L/min at ' + fx(V.rpm, 0) + ' rpm', tx, 200, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'slowed 30×', 10, 380, { color: C.faint, size: 10.5 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ AXIAL PISTON PUMP */
  Hyper.sim('pm-axial-piston', {
    title: 'Swash-plate axial piston pump',
    blurb: `Left, the pump from the side: the cylinder block turns with the shaft and each piston's slipper follows the inclined **swash plate**, so the pistons stroke in and out once per turn. Right, the valve plate seen from the port end: bores over one kidney are filling (**green**), bores over the other are delivering (**red**). Nine 16 mm pistons on a 60 mm pitch circle. The graph is the delivered flow over one revolution. The animation is slowed 30 times.

**Try this**
- Bring the swash angle slowly to zero: the stroke, the displacement and the flow shrink to nothing while the shaft keeps turning.
- Take it past zero (**over centre**): the ports swap — the pump reverses its flow with the shaft turning the same way.
- Compare 8 and 9 pistons: the ripple jumps from under 2 % to about 8 %, and its frequency halves.
- Raise the pressure: the drive torque grows in proportion; the flow does not change.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'shaft angle (°)', min: 0, max: 360 }, y: { label: 'delivered flow (L/min)', min: 0 }, legend: true }, 150);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'alpha', label: 'Swash-plate angle α', min: -18, max: 18, step: 0.5, value: 15, unit: '°' },
        { id: 'rpm', label: 'Shaft speed', min: 0, max: 3000, step: 50, value: 1800, unit: 'rpm' },
        { id: 'z', type: 'select', label: 'Number of pistons', options: [['7', 7], ['8', 8], ['9', 9], ['11', 11]], value: 9 },
        { id: 'p', label: 'Delivery pressure (gauge)', min: 0, max: 350, step: 5, value: 250, unit: 'bar' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['h', 'Stroke D·tan α'], ['V', 'Displacement'], ['Q', 'Ideal flow'], ['r', 'Flow ripple'], ['f', 'Ripple frequency'], ['T', 'Drive torque (ideal), power'], ['port', 'Delivering port']]);
      const V = ctl.values;
      const d = 16, R = 30, Ap = Math.PI * d * d / 4 * 1e-6;       // mm, mm, m²
      let th = 0, tPlot = 1, curve = [], stats = { mean: 0, rip: 0 };
      const ph = { a: 0, b: 0 };
      // instantaneous flow (m³/s): pistons moving into their bores, A·ω·R·|tan α|·Σ|sin θ|
      function qInst(t, z, ta, w) {
        let s = 0;
        for (let i = 0; i < z; i++) { const sn = Math.sin(t + i * TAU / z); if (sn * ta < 0) s += Math.abs(sn); }
        return Ap * w * (R / 1000) * Math.abs(ta) * s;
      }
      const loop = kit.loop((dt) => {
        const C = kit.colors(), z = +V.z || 9, al = V.alpha * Math.PI / 180, ta = Math.tan(al);
        const n = V.rpm / 60, w = TAU * n;
        const Vg = z * Ap * (2 * R / 1000) * Math.abs(ta), Q = Vg * n;
        if (dirty) {
          dirty = false; tPlot = 1; curve = [];
          let s = 0, mx = 0, mn = Infinity;
          for (let k = 0; k <= 360; k++) { const q = qInst(k * Math.PI / 180, z, ta, w) * LPM; curve.push([k, q]); if (k < 360) { s += q; mx = Math.max(mx, q); mn = Math.min(mn, q); } }
          stats = { mean: s / 360, rip: s > 1e-12 ? (mx - mn) / (s / 360) : 0 };
        }
        th = mod(th + w * dt / 30, TAU * 60);
        const T = Vg * V.p * 1e5 / TAU, dir = V.alpha > 0.01 ? 1 : V.alpha < -0.01 ? -1 : 0;
        ro.set('h', fx(2 * R * Math.abs(ta), 1) + ' mm');
        ro.set('V', fx(Vg * 1e6, 1) + ' cm³/rev');
        ro.set('Q', fx(Q * LPM, 1) + ' L/min');
        ro.set('r', dir ? fx(stats.rip * 100, 2) + ' %' : '—');
        ro.set('f', fx((z % 2 ? 2 * z : z) * n, 0) + ' Hz' + (z % 2 ? '  (2·z·n, odd z)' : '  (z·n, even z)'));
        ro.set('T', fx(T, 1) + ' N·m,  ' + fx(w * T / 1000, 1) + ' kW');
        ro.set('port', dir > 0 ? 'B  (A is the suction port)' : dir < 0 ? 'A  (over centre: B sucks)' : 'none: zero stroke');
        tPlot += dt;
        if (tPlot > 0.12) {
          tPlot = 0;
          const top = Math.max(1, ...curve.map(p => p[1])) * 1.2;
          plot.set({ y: { label: 'delivered flow (L/min)', min: 0, max: top }, series: [{ pts: curve, label: 'instantaneous' }, { pts: [[0, stats.mean], [360, stats.mean]], label: 'mean', dash: [5, 4] }], vlines: [{ x: mod(th, TAU) * 180 / Math.PI }] });
        }
        // ---- drawing on a 760 × 370 grid
        const c = st.begin();
        fit(st, c, 760, 370);
        const s = 2.6, y0 = 185, xs = 110, H = (R + 14) * s, Lp = 45 * s, ds = d * s;
        const xb0 = xs + 25 * s, xb1 = xb0 + 75 * s, xbb = xb0 + 55 * s, hb = (R + d / 2 + 6) * s;
        const colDel = S.col(V.p > 2 && dir && V.rpm > 0 ? 'pressure' : 'idle'), colSuc = S.col(dir && V.rpm > 0 ? 'suction' : 'idle');
        // shaft
        c.fillStyle = C.muted; c.fillRect(22, y0 - 6, xb1 + 12 - 22, 12);
        kit.label(c, 'drive', 24, y0 - 16, { color: C.muted, size: 11 });
        // swash plate
        const px0 = xs - H * ta, py0 = y0 + H, px1 = xs + H * ta, py1 = y0 - H;
        c.beginPath(); c.moveTo(px0, py0); c.lineTo(px1, py1); c.lineTo(px1 - 16, py1); c.lineTo(px0 - 16, py0); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(xs, y0 - H - 12); c.lineTo(xs, y0 + H + 12); c.stroke(); c.setLineDash([]);
        kit.label(c, 'α = ' + fx(V.alpha, 1) + '°', xs - 8, y0 - H - 22, { color: C.warn, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'swash plate', xs - 8, y0 + H + 18, { color: C.muted, size: 11, align: 'center' });
        // cylinder block (seen through)
        withAlpha(c, 0.35, () => { c.fillStyle = C.surface; c.fillRect(xb0, y0 - hb, xb1 - xb0, 2 * hb); });
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(xb0, y0 - hb, xb1 - xb0, 2 * hb);
        kit.label(c, 'cylinder block (turns)', (xb0 + xb1) / 2, y0 + hb + 16, { color: C.muted, size: 11, align: 'center' });
        // pistons, back ones first
        const list = [];
        for (let i = 0; i < z; i++) { const t = th + i * TAU / z; list.push({ t, Y: R * Math.cos(t), Z: R * Math.sin(t) }); }
        list.sort((a, b) => a.Z - b.Z);
        for (const P of list) {
          const yc = y0 - P.Y * s, xf = xs + P.Y * s * ta, xe = xf + 8 + Lp, sd = Math.sin(P.t) * ta;
          const col = sd < -1e-6 ? colDel : sd > 1e-6 ? colSuc : C.muted;
          withAlpha(c, P.Z >= 0 ? 1 : 0.35, () => {
            c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(xb0, yc - ds / 2, xbb - xb0, ds);
            withAlpha(c, 0.6, () => { c.fillStyle = col; c.fillRect(xe, yc - ds / 2 + 1, xbb - xe, ds - 2); });
            c.fillStyle = C.surface; c.fillRect(xf + 8, yc - ds / 2 + 2, Lp, ds - 4);
            c.strokeStyle = C.text; c.lineWidth = 1.3; c.strokeRect(xf + 8, yc - ds / 2 + 2, Lp, ds - 4);
            c.beginPath(); c.arc(xf + 8, yc, 6, 0, TAU); c.fillStyle = C.text; c.fill();
            c.fillStyle = C.muted; c.fillRect(xf, yc - 9, 5, 18);
          });
        }
        // valve plate and port block
        c.fillStyle = C.muted; c.fillRect(xb1, y0 - hb - 4, 10, 2 * hb + 8);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.4; c.fillRect(xb1 + 10, y0 - 70, 36, 140); c.strokeRect(xb1 + 10, y0 - 70, 36, 140);
        const stA = dir < 0 ? 'pressure' : dir > 0 ? 'suction' : 'idle', stB = dir > 0 ? 'pressure' : dir < 0 ? 'suction' : 'idle';
        const pA = [[xb1 + 46, y0 - 40], [470, y0 - 40]], pB = [[xb1 + 46, y0 + 40], [470, y0 + 40]];
        S.line(c, pA, { state: V.rpm > 0 ? (stA === 'pressure' && V.p <= 2 ? 'idle' : stA) : 'idle' });
        S.line(c, pB, { state: V.rpm > 0 ? (stB === 'pressure' && V.p <= 2 ? 'idle' : stB) : 'idle' });
        if (Q > 1e-9) {
          ph.a += dt * 3 * Q * LPM * (dir < 0 ? 1 : -1); ph.b += dt * 3 * Q * LPM * (dir > 0 ? 1 : -1);
          S.flow(c, pA, ph.a, { color: S.col(stA === 'idle' ? 'idle' : stA) });
          S.flow(c, pB, ph.b, { color: S.col(stB === 'idle' ? 'idle' : stB) });
        }
        kit.label(c, 'A', 476, y0 - 40, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'B', 476, y0 + 40, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'valve plate', xb1 + 5, y0 - hb - 14, { color: C.muted, size: 11, align: 'center' });
        // the valve plate seen from the port end
        const cx = 640, cy = 175, s2 = 2.45, Rv = (R + 17) * s2;
        c.beginPath(); c.arc(cx, cy, Rv, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        const kid = (t0, t1, col) => {
          c.save(); c.lineCap = 'round'; c.lineWidth = d * s2 * 0.95; c.strokeStyle = col;
          c.beginPath();
          for (let k = 0; k <= 30; k++) { const t = t0 + (t1 - t0) * k / 30, X = cx - s2 * R * Math.sin(t), Y = cy - s2 * R * Math.cos(t); if (k) c.lineTo(X, Y); else c.moveTo(X, Y); }
          withAlpha(c, 0.3, () => c.stroke());
          c.restore();
        };
        kid(0.3, Math.PI - 0.3, S.col(stA === 'pressure' && V.p <= 2 ? 'idle' : stA));
        kid(Math.PI + 0.3, TAU - 0.3, S.col(stB === 'pressure' && V.p <= 2 ? 'idle' : stB));
        for (const P of list) {
          const X = cx - s2 * R * Math.sin(P.t), Y = cy - s2 * R * Math.cos(P.t), sd = Math.sin(P.t) * ta;
          c.beginPath(); c.arc(X, Y, d / 2 * s2, 0, TAU);
          withAlpha(c, 0.7, () => { c.fillStyle = sd < -1e-6 ? colDel : sd > 1e-6 ? colSuc : C.muted; c.fill(); });
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        }
        c.beginPath(); c.arc(cx, cy, 9 * s2, 0, TAU); c.fillStyle = C.muted; c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx - 8 * s2 * Math.sin(th), cy - 8 * s2 * Math.cos(th)); c.stroke();
        curvedArrow(kit, c, cx, cy, Rv + 10, -1.9, -2.9, C.accent, 2);
        kit.label(c, 'A', cx - Rv - 14, cy, { color: C.text, size: 13, weight: 700, align: 'center' });
        kit.label(c, 'B', cx + Rv + 14, cy, { color: C.text, size: 13, weight: 700, align: 'center' });
        kit.label(c, 'valve plate, seen from the ports', cx, cy + Rv + 22, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'V = z·(πd²/4)·D·tan α = ' + fx(Vg * 1e6, 1) + ' cm³/rev', cx, 350, { color: C.accent, size: 12, weight: 700, align: 'center' });
        kit.label(c, 'slowed 30×', 10, 362, { color: C.faint, size: 10.5 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ EFFICIENCY MAP */
  // Wilson-type loss coefficients per pump type (ISO VG 46 oil). Q_leak = Cs·(V/2π)·Δp/μ; T_loss = Cv·μ·(V/2π)·ω + Cf·(V/2π)·Δp + Tc
  const PUMPS = {
    gear: { name: 'external gear pump, 25 cm³/rev', V: 25e-6, pmax: 250, nmin: 500, nmax: 3000, Cs: 1.63e-8, Cf: 0.07, Cv: 2.03e5, Tc: 2.0 },
    vane: { name: 'balanced vane pump, 30 cm³/rev', V: 30e-6, pmax: 210, nmin: 600, nmax: 2400, Cs: 1.2e-8, Cf: 0.05, Cv: 1.59e5, Tc: 2.0 },
    piston: { name: 'axial piston pump, 45 cm³/rev', V: 45e-6, pmax: 350, nmin: 300, nmax: 3000, Cs: 4.9e-9, Cf: 0.03, Cv: 1.37e5, Tc: 2.0 }
  };
  Hyper.sim('pm-efficiency-map', {
    title: 'Pump efficiency map',
    blurb: `The overall efficiency $\\eta_t = \\eta_v\\,\\eta_{hm}$ of a pump over its whole working range, from a loss model of the classic kind: leakage in proportion to pressure over viscosity (independent of speed), and torque lost to viscous drag (growing with speed and viscosity), dry friction (growing with pressure) and a constant. Colours and contour lines show $\\eta_t$; the dot is the operating point — drag it, or use the sliders. The graph shows the three efficiencies against pressure at the chosen speed. Oil: ISO VG 46.

**Try this**
- Find the best region: medium-to-high pressure, medium speed. Then look at the corners: low pressure (friction dominates) and low speed with high pressure (leakage dominates).
- Heat the oil to 80 °C: the volumetric efficiency falls, most at low speed. Cool it to 20 °C: leakage almost vanishes but the drag torque grows, and the efficiency at low pressure collapses.
- Compare the gear, vane and piston pumps at their rated points.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'pressure (bar)', min: 0 }, y: { label: 'efficiency', min: 0.4, max: 1 }, legend: true }, 160);
      let dirty = true, tr = { k: 1, ox: 0, oy: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Pump', options: [['Axial piston, 45 cm³/rev', 'piston'], ['External gear, 25 cm³/rev', 'gear'], ['Balanced vane, 30 cm³/rev', 'vane']], value: 'piston' },
        { id: 'T', label: 'Oil temperature (ISO VG 46)', min: 20, max: 90, step: 1, value: 50, unit: '°C' },
        { id: 'p', label: 'Pressure (gauge)', min: 10, max: 350, step: 5, value: 250, unit: 'bar' },
        { id: 'rpm', label: 'Speed', min: 300, max: 3000, step: 50, value: 1500, unit: 'rpm' }
      ], (id) => { dirty = true; if (id === 'type') { const P = PUMPS[ctl.values.type]; ctl.set('p', clamp(ctl.values.p, 10, P.pmax)); ctl.set('rpm', clamp(ctl.values.rpm, P.nmin, P.nmax)); } });
      const ro = kit.readout(box.side, [['visc', 'Oil viscosity'], ['Q', 'Ideal / leakage / delivered'], ['T', 'Ideal torque + losses = drive torque'], ['P', 'Shaft power in / hydraulic out'], ['heat', 'Heat into the oil'], ['eta', 'η_v · η_hm = η_t']]);
      const V = ctl.values;
      const X0 = 70, Y0 = 18, W = 540, HH = 300, NX = 54, NY = 30;
      const LEVELS = [0.5, 0.6, 0.7, 0.8, 0.85, 0.88, 0.9, 0.92, 0.94];
      let grid = null, segs = [], P = PUMPS.piston, mu = 0.026, nu = 30e-6;
      function losses(p, rpm) {
        const dp = p * 1e5, n = rpm / 60, w = TAU * n, Vr = P.V / TAU;
        const Qth = P.V * n, QL = Math.min(Qth, P.Cs * Vr * dp / mu), Q = Qth - QL;
        const Tth = Vr * dp, Tl = P.Cv * mu * Vr * w + P.Cf * Vr * dp + P.Tc;
        const ev = Qth > 0 ? Q / Qth : 0, eh = Tth / (Tth + Tl);
        return { Qth, QL, Q, Tth, Tl, T: Tth + Tl, ev, eh, et: ev * eh, w, dp };
      }
      function rebuild() {
        P = PUMPS[V.type] || PUMPS.piston;
        nu = kit.fluid.oilViscosity(46, V.T);
        mu = nu * (880 - 0.6 * (V.T - 15));
        grid = [];
        for (let j = 0; j <= NY; j++) {
          const row = [], rpm = P.nmin + (P.nmax - P.nmin) * j / NY;
          for (let i = 0; i <= NX; i++) row.push(losses(P.pmax * (0.03 + 0.97 * i / NX), rpm).et);
          grid.push(row);
        }
        segs = LEVELS.map(L => {
          const out = [];
          for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
            const a = grid[j][i], b = grid[j][i + 1], cc = grid[j + 1][i + 1], dd = grid[j + 1][i], pts = [];
            const edge = (v1, v2, xa, ya, xb, yb) => { if ((v1 - L) * (v2 - L) < 0) { const t = (L - v1) / (v2 - v1); pts.push([xa + t * (xb - xa), ya + t * (yb - ya)]); } };
            edge(a, b, i, j, i + 1, j); edge(b, cc, i + 1, j, i + 1, j + 1); edge(cc, dd, i + 1, j + 1, i, j + 1); edge(dd, a, i, j + 1, i, j);
            if (pts.length >= 2) out.push([pts[0], pts[1]]);
            if (pts.length === 4) out.push([pts[2], pts[3]]);
          }
          return { L, segs: out };
        });
      }
      const gx = i => X0 + W * i / NX, gy = j => Y0 + HH - HH * j / NY;
      const toP = x => P.pmax * (0.03 + 0.97 * (x - X0) / W), toN = y => P.nmin + (P.nmax - P.nmin) * (Y0 + HH - y) / HH;
      const pX = p => X0 + W * ((p / P.pmax - 0.03) / 0.97), nY = rpm => Y0 + HH - HH * (rpm - P.nmin) / (P.nmax - P.nmin);
      const shade = (t, dark) => dark ? 'hsl(' + (205 - 75 * t) + ', 62%, ' + (13 + 40 * t) + '%)' : 'hsl(' + (205 - 75 * t) + ', 58%, ' + (95 - 45 * t) + '%)';
      kit.drag(st, {
        hit(p) { const q = { x: (p.x - tr.ox) / tr.k, y: (p.y - tr.oy) / tr.k }; return q.x >= X0 && q.x <= X0 + W && q.y >= Y0 && q.y <= Y0 + HH ? 'pt' : null; },
        start(t, p) { this.move(t, p); },
        move(t, p) {
          const q = { x: clamp((p.x - tr.ox) / tr.k, X0, X0 + W), y: clamp((p.y - tr.oy) / tr.k, Y0, Y0 + HH) };
          ctl.set('p', Math.round(clamp(toP(q.x), 10, P.pmax) / 5) * 5); ctl.set('rpm', Math.round(clamp(toN(q.y), P.nmin, P.nmax) / 50) * 50); dirty = true;
        },
        hover: true
      });
      let tPlot = 1;
      const loop = kit.loop((dt) => {
        if (dirty || !grid) {
          rebuild(); dirty = false; tPlot = 1;
        }
        const C = kit.colors();
        const pOp = clamp(V.p, 10, P.pmax), nOp = clamp(V.rpm, P.nmin, P.nmax), o = losses(pOp, nOp);
        ro.set('visc', fx(nu * 1e6, 1) + ' mm²/s at ' + fx(V.T, 0) + ' °C');
        ro.set('Q', fx(o.Qth * LPM) + ' / ' + fx(o.QL * LPM, 2) + ' / ' + fx(o.Q * LPM) + ' L/min');
        ro.set('T', fx(o.Tth, 1) + ' + ' + fx(o.Tl, 1) + ' = ' + fx(o.T, 1) + ' N·m');
        ro.set('P', fx(o.T * o.w / 1000, 2) + ' / ' + fx(o.Q * o.dp / 1000, 2) + ' kW');
        ro.set('heat', fx((o.T * o.w - o.Q * o.dp) / 1000, 2) + ' kW');
        ro.set('eta', fx(o.ev, 3) + ' · ' + fx(o.eh, 3) + ' = ' + fx(o.et, 3));
        tPlot += dt;
        if (tPlot > 0.2) {
          tPlot = 0;
          const a = [], b = [], t = [];
          for (let k = 0; k <= 80; k++) { const p = P.pmax * (0.03 + 0.97 * k / 80), l = losses(p, nOp); a.push([p, l.ev]); b.push([p, l.eh]); t.push([p, l.et]); }
          plot.set({ x: { label: 'pressure (bar), at ' + fx(nOp, 0) + ' rpm', min: 0, max: P.pmax }, y: { label: 'efficiency', min: 0.4, max: 1 },
            series: [{ pts: a, label: 'η_v volumetric' }, { pts: b, label: 'η_hm hydraulic-mechanical' }, { pts: t, label: 'η_t overall', width: 2.6 }], vlines: [{ x: pOp }] });
        }
        // ---- drawing on a 760 × 380 grid
        const c = st.begin();
        tr = fit(st, c, 760, 380);
        for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
          const v = (grid[j][i] + grid[j][i + 1] + grid[j + 1][i] + grid[j + 1][i + 1]) / 4;
          c.fillStyle = shade(clamp((v - 0.5) / 0.45, 0, 1), C.dark);
          c.fillRect(gx(i), gy(j + 1), W / NX + 0.6, HH / NY + 0.6);
        }
        // contours with labels
        for (const lev of segs) {
          if (!lev.segs.length) continue;
          c.strokeStyle = C.text; c.lineWidth = lev.L >= 0.85 ? 1.3 : 0.9; c.beginPath();
          let best = null, bd = Infinity;
          for (const [p1, p2] of lev.segs) {
            const xa = gx(p1[0]), ya = gy(p1[1]), xb = gx(p2[0]), yb = gy(p2[1]);
            c.moveTo(xa, ya); c.lineTo(xb, yb);
            const mx = (xa + xb) / 2, my = (ya + yb) / 2, dd = Math.abs(mx - (X0 + W * (0.25 + 0.07 * LEVELS.indexOf(lev.L)))) + 0.3 * Math.abs(my - (Y0 + HH / 2));
            if (dd < bd) { bd = dd; best = [mx, my]; }
          }
          c.stroke();
          if (best) kit.label(c, fx(lev.L, 2), best[0], best[1], { color: C.text, size: 10.5, weight: 700, align: 'center', bg: C.surface });
        }
        // frame and axes
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.2; c.strokeRect(X0, Y0, W, HH);
        for (let k = 0; k <= 5; k++) {
          const p = P.pmax * k / 5, x = pX(Math.max(p, P.pmax * 0.03));
          if (k) kit.label(c, fx(p, 0), x, Y0 + HH + 12, { color: C.muted, size: 11, align: 'center' });
        }
        for (let k = 0; k <= 4; k++) { const rpm = P.nmin + (P.nmax - P.nmin) * k / 4; kit.label(c, fx(rpm, 0), X0 - 6, nY(rpm), { color: C.muted, size: 11, align: 'right' }); }
        kit.label(c, 'pressure (bar)', X0 + W, Y0 + HH + 28, { color: C.muted, size: 11.5, align: 'right' });
        c.save(); c.translate(16, Y0 + HH / 2); c.rotate(-Math.PI / 2); kit.label(c, 'speed (rpm)', 0, 0, { color: C.muted, size: 11.5, align: 'center' }); c.restore();
        // colour key
        for (let k = 0; k < 60; k++) { c.fillStyle = shade(k / 59, C.dark); c.fillRect(640, Y0 + HH - (k + 1) * HH / 60, 18, HH / 60 + 0.6); }
        c.strokeStyle = C.muted; c.strokeRect(640, Y0, 18, HH);
        for (const v of [0.5, 0.6, 0.7, 0.8, 0.9, 0.95]) kit.label(c, fx(v, 2), 664, Y0 + HH - HH * (v - 0.5) / 0.45, { color: C.muted, size: 10.5 });
        kit.label(c, 'η_t', 649, Y0 - 2, { color: C.text, size: 12, weight: 700, align: 'center', baseline: 'bottom' });
        // operating point
        const ox = pX(pOp), oy = nY(nOp);
        kit.dot(c, ox, oy, 7, C.warn, C.text);
        kit.label(c, 'η_t = ' + fx(o.et, 3), ox + (ox > X0 + W * 0.7 ? -12 : 12), oy - 14, { color: C.text, size: 12, weight: 700, align: ox > X0 + W * 0.7 ? 'right' : 'left', bg: C.surface });
        kit.label(c, P.name + ', ' + fx(V.T, 0) + ' °C', X0 + 6, Y0 + 12, { color: C.text, size: 12, weight: 700, bg: C.surface });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ PRESSURE-COMPENSATED PUMP */
  Hyper.sim('pm-comp-pump', {
    title: 'Fixed, pressure-compensated and power-limited pumps',
    blurb: `A 40 cm³/rev pump at 1480 rpm (59 L/min) feeds a load represented by an adjustable restriction; the pressure is whatever the load needs to pass the flow. Choose how the pump is controlled. The graph is the **p–Q characteristic**: the pump's curve, the load's curve (dashed) and the operating point where they cross. Lines: **red** pressure, **blue** return, **green** suction.

**Try this**
- With the fixed pump, close the load valve to zero: the whole flow crosses the relief valve at its setting — about 20 kW of heat.
- Do the same with the pressure-compensated pump: it holds the setting but destrokes to its leakage flow, and the heat drops to about a kilowatt.
- Open the load slowly with the compensated pump: full flow until the pressure reaches the cut-off, then the vertical side of the curve.
- Compare the curves of the fixed pump (flow to the load) and the compensated pump: nearly the same shape — but in one the surplus is burned, in the other it is never pumped.
- Try the power limiter at 20 kW: at high pressure the flow follows the hyperbola p·Q = constant.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'pressure (bar)', min: 0, max: 350 }, y: { label: 'flow (L/min)', min: 0, max: 70 }, legend: true }, 190);
      const mode0 = params && ['fixed', 'comp', 'power'].includes(params.mode) ? params.mode : 'comp';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Pump control', options: [['Fixed pump + relief valve', 'fixed'], ['Pressure-compensated pump', 'comp'], ['Compensated + power limiter', 'power']], value: mode0 },
        { id: 'open', label: 'Load valve opening', min: 0, max: 100, step: 1, value: 45, unit: '%' },
        { id: 'pset', label: 'Setting (relief, or compensator)', min: 100, max: 280, step: 5, value: 200, unit: 'bar' },
        { id: 'plim', label: 'Power limit (drive power)', min: 5, max: 40, step: 1, value: 20, unit: 'kW' }
      ], (id) => { if (id === 'mode') ctl.show('plim', ctl.values.mode === 'power'); });
      ctl.show('plim', mode0 === 'power');
      const ro = kit.readout(box.side, [['p', 'Pump pressure'], ['q', 'Flow to load / over relief'], ['eps', 'Pump displacement'], ['pin', 'Motor power into the pump'], ['use', 'Power to the load'], ['heat', 'Heat: relief / pump losses'], ['st', 'State']]);
      const V = ctl.values;
      const QTH = 40 * 1480 / 1000, KL = 2.4 / 250, DROOP = 8, KV = 12, EHM = 0.92, ET = 0.88;   // L/min, L/min per bar, bar, L/min per √bar
      const ph = {};
      function model(mode, open, pset, plim) {
        const relief = mode === 'fixed' ? pset : pset + 25, pcr = relief - 10;
        const pumpQ = p => {                                                    // net pump output at pressure p (L/min)
          let q = Math.max(0, QTH - KL * p);
          if (mode !== 'fixed') q = Math.min(q, Math.max(0, QTH * (pset - p) / DROOP));
          if (mode === 'power' && p > 1) q = Math.min(q, 600 * plim * ET / p);
          return q;
        };
        const reliefQ = p => (p <= pcr ? 0 : QTH * (p - pcr) / 10);
        const loadQ = p => KV * (open / 100) * Math.sqrt(Math.max(0, p));
        let lo = 0, hi = 400;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (pumpQ(m) - reliefQ(m) - loadQ(m) > 0) lo = m; else hi = m; }
        const p = lo, qp = pumpQ(p), qr = Math.min(qp, reliefQ(p)), ql = Math.max(0, qp - qr);
        const eps = mode === 'fixed' ? 1 : clamp((qp + KL * p) / QTH, 0, 1);
        const pin = p * eps * QTH / EHM / 600 + 0.4;                            // kW, with a little drag
        return { p, qp, qr, ql, eps, pin, relief, pumpQ, reliefQ, loadQ,
          powerLimited: mode === 'power' && p > 1 && 600 * plim * ET / p < Math.min(QTH - KL * p, QTH * (pset - p) / DROOP) - 0.1 };
      }
      let tPlot = 1;
      const loop = kit.loop((dt) => {
        const C = kit.colors(), mode = V.mode, o = model(mode, V.open, V.pset, V.plim);
        const useful = o.p * o.ql / 600, relHeat = o.p * o.qr / 600, pumpLoss = Math.max(0, o.pin - o.p * o.qp / 600);
        ro.set('p', fx(o.p, 0) + ' bar');
        ro.set('q', fx(o.ql, 1) + ' / ' + fx(o.qr, 1) + ' L/min');
        ro.set('eps', mode === 'fixed' ? 'fixed (40 cm³/rev)' : fx(o.eps * 100, 0) + ' % (' + fx(o.eps * 40, 1) + ' cm³/rev)');
        ro.set('pin', fx(o.pin, 2) + ' kW');
        ro.set('use', fx(useful, 2) + ' kW');
        ro.set('heat', fx(relHeat, 2) + ' / ' + fx(pumpLoss, 2) + ' kW');
        const state = mode === 'fixed'
          ? (o.qr > 0.3 ? (o.ql < 0.3 ? 'dead-head: all the flow crosses the relief valve' : 'relief open: surplus flow burned') : 'all the pump flow goes to the load')
          : o.powerLimited ? 'power limiter: p·Q held at the limit'
            : o.ql < 0.3 ? 'dead-head: holding the setting, delivering only leakage'
              : o.eps < 0.97 ? 'compensator destroking the pump' : 'full flow, below the cut-off';
        ro.set('st', state);
        tPlot += dt;
        if (tPlot > 0.15) {
          tPlot = 0;
          const pump = [], load = [], avail = [], hyp = [];
          for (let k = 0; k <= 175; k++) {
            const p = 2 * k;
            pump.push([p, o.pumpQ(p)]);
            if (mode === 'fixed') avail.push([p, Math.max(0, o.pumpQ(p) - o.reliefQ(p))]);
            const ql = o.loadQ(p); if (ql <= 72) load.push([p, ql]);
            if (mode === 'power' && p >= 40) hyp.push([p, Math.min(72, 600 * V.plim * ET / p)]);
          }
          const series = mode === 'fixed'
            ? [{ pts: pump, label: 'pump delivers', dash: [3, 3] }, { pts: avail, label: 'left for the load (after the relief valve)', width: 2.6 }, { pts: load, label: 'load valve', dash: [7, 4] }]
            : [{ pts: pump, label: mode === 'power' ? 'pump (compensator + power limit)' : 'compensated pump', width: 2.6 }, { pts: load, label: 'load valve', dash: [7, 4] }]
              .concat(mode === 'power' ? [{ pts: hyp, label: 'p·Q = power limit', dash: [2, 3] }] : []);
          plot.set({ series, marks: [{ x: o.p, y: o.ql, label: fx(o.p, 0) + ' bar, ' + fx(o.ql, 1) + ' L/min', color: C.warn }], vlines: [{ x: V.pset, label: mode === 'fixed' ? 'relief' : 'setting' }] });
        }
        // ---- the circuit, on a 760 × 300 grid
        const c = st.begin();
        fit(st, c, 760, 300);
        const hp = o.p > 3, adv = (k, q) => { ph[k] = (ph[k] || 0) + dt * 2.2 * q; return ph[k]; };
        const header = [[150, 174], [150, 70], [600, 70]];
        S.line(c, [[150, 226], [150, 240]], { state: 'suction' });
        S.line(c, header, { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[240, 61], [240, 70]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[340, 70], [340, 121]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[340, 179], [340, 245]], { state: o.qr > 0.05 ? 'return' : 'idle' });
        S.line(c, [[560, 70], [560, 128]], { state: hp ? 'pressure' : 'idle' });
        S.line(c, [[560, 172], [560, 245]], { state: o.ql > 0.05 ? 'return' : 'idle' });
        S.junction(c, 240, 70); S.junction(c, 340, 70);
        if (o.qp > 0.05) S.flow(c, [[150, 240], [150, 226]], adv('s', o.qp), { color: S.col('suction') });
        if (o.qp > 0.05) S.flow(c, header, adv('h', o.qp), { color: S.col(hp ? 'pressure' : 'idle') });
        if (o.qr > 0.05) S.flow(c, [[340, 70], [340, 245]], adv('r', o.qr), { color: S.col('return') });
        if (o.ql > 0.05) S.flow(c, [[560, 70], [560, 245]], adv('l', o.ql), { color: S.col('return') });
        S.pump(c, 150, 200, { motor: true, variable: mode !== 'fixed' });
        S.tank(c, 150, 250); S.tank(c, 340, 255); S.tank(c, 560, 255);
        S.pressureValve(c, 340, 150, { kind: 'relief', rot: 180, open: clamp(o.qr / Math.max(o.qp, 1e-6), 0, 1) });
        S.throttle(c, 560, 150, { adjustable: true, len: 22 });
        S.gauge(c, 240, 40, { frac: o.p / 350, value: fx(o.p, 0) + ' bar' });
        // the compensator: pilot from the outlet against a spring, acting on the displacement
        if (mode !== 'fixed') {
          S.line(c, [[150, 120], [205, 120], [205, 190]], { state: 'pilot' });
          S.junction(c, 150, 120);
          S.head(c, 205, 197, Math.PI / 2, 8, S.col('pilot'));
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(166, 200); c.lineTo(214, 200); c.stroke();
          S.zigzag(c, 214, 200, 244, 200, 5, 3, C.text);
          kit.label(c, mode === 'power' ? 'compensator + power limiter' : 'compensator', 206, 222, { color: C.muted, size: 11 });
          c.fillStyle = C.accent; c.fillRect(100, 262 - 44 * o.eps, 8, 44 * o.eps); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(100, 218, 8, 44);
          kit.label(c, 'ε ' + fx(o.eps * 100, 0) + ' %', 96, 276, { color: C.muted, size: 10.5, align: 'center' });
        }
        kit.label(c, 'relief ' + fx(o.relief, 0) + ' bar', 362, 150, { color: C.muted, size: 11 });
        kit.label(c, 'load valve ' + fx(V.open, 0) + ' %', 588, 144, { color: C.text, size: 12, weight: 700 });
        kit.label(c, fx(o.ql, 1) + ' L/min', 588, 162, { color: C.muted, size: 11 });
        kit.label(c, fx(QTH, 1) + ' L/min max', 150, 290, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, state, 740, 18, { color: o.qr > 0.3 ? C.bad : C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ LSHT MOTOR */
  Hyper.sim('pm-lsht-motor', {
    title: 'Multi-lobe radial piston motor',
    blurb: `A low-speed high-torque motor. The cylinder block turns clockwise inside a fixed cam ring with several lobes; each piston presses a roller against the ring. Pistons on a **rising** flank are fed with pressure (**red**) and drive the block round; those on a falling flank are pushed back in and return their oil (**blue**). Every piston strokes once per lobe, so the displacement is $z\\,k\\,A\\,h$ — here ten 40 mm pistons with a 20 mm stroke. The motor turns at its real speed. The graph shows the torque over a revolution at the present pressure, against the load.

**Try this**
- Raise the flow: the speed follows it; the pressure does not change. Raise the load torque: the pressure follows it; the speed barely changes.
- Raise the load above what the relief setting allows (about 5.6 kN·m at 250 bar with ten pistons and six lobes): the motor stalls and the flow crosses the relief valve. Press *Stop, then restart*: starting needs a little more pressure than running, because the breakaway efficiency is lower.
- Compare 4, 6 and 8 lobes: displacement, torque per bar and the speed per litre change in proportion.
- Choose 8 pistons with 4 or 8 lobes, or 12 pistons with 6 lobes: the torque now falls to zero at some positions — a motor stopped there cannot start. Real motors pair their numbers to avoid this.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'shaft angle (°)', min: 0, max: 360 }, y: { label: 'torque (kN·m)', min: 0 }, legend: true }, 150);
      let running = false, th = 0.05, tPlot = 1;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Supply flow', min: 0, max: 120, step: 1, value: 60, unit: 'L/min' },
        { id: 'TL', label: 'Load torque', min: 0, max: 12, step: 0.1, value: 4, unit: 'kN·m' },
        { id: 'relief', label: 'Relief-valve setting', min: 100, max: 350, step: 5, value: 250, unit: 'bar' },
        { id: 'k', type: 'select', label: 'Cam lobes k', options: [['4', 4], ['6', 6], ['8', 8]], value: 6 },
        { id: 'z', type: 'select', label: 'Pistons z', options: [['8', 8], ['10', 10], ['12', 12]], value: 10 },
        { type: 'buttons', items: [{ id: 'stop', label: 'Stop, then restart' }] }
      ], (id) => { if (id === 'stop') running = false; tPlot = 1; });
      const ro = kit.readout(box.side, [['V', 'Displacement z·k·A·h'], ['n', 'Speed'], ['dp', 'Pressure difference'], ['T', 'Torque delivered'], ['P', 'Output power'], ['rip', 'Torque ripple'], ['start', 'Starting torque at the relief setting (worst / best position)'], ['st', 'State']]);
      const V = ctl.values;
      const d = 0.04, h = 0.02, A = Math.PI * d * d / 4, EHM = 0.94, EST = 0.90, CL = (1 / LPM) / 250e5;   // leakage 1 L/min at 250 bar
      const R0 = 100, HMM = 20, RR = 15, SC = 1.05, CX = 225, CY = 200;                                    // drawing, mm
      const ph = { a: 0, b: 0 };
      const loop = kit.loop((dt) => {
        const C = kit.colors(), k = +V.k || 6, z = +V.z || 10, Vg = z * k * A * h;
        const camD = f => h / 2 * k * Math.sin(k * f);                       // dR/dφ (m/rad)
        const sumPos = t => { let s = 0; for (let i = 0; i < z; i++) { const v = camD(t + i * TAU / z); if (v > 1e-9) s += v; } return s; };
        const TL = V.TL * 1000, pr = V.relief * 1e5, Qs = V.Q / LPM;
        const dpRun = TL * TAU / (Vg * EHM), spNow = sumPos(th);
        const dpStart = spNow > 1e-6 ? TL / (A * spNow * EST) : (TL > 0 ? Infinity : 0);
        if (running && (dpRun > pr || Qs <= 0)) running = false;
        else if (!running && Qs > 0 && dpStart <= pr) running = true;
        let n = 0, dp = 0, Qr = 0;
        if (running) { dp = dpRun; n = Math.max(0, Qs - CL * dp) / Vg; }
        else if (Qs > 0) { dp = pr; Qr = Qs; }
        th = mod(th + TAU * n * dt, TAU * 60);
        // torque curve over a revolution, at the working pressure
        let mn = Infinity, mx = 0, sm = 0;
        const curve = [];
        for (let a = 0; a <= 360; a += 2) { const s = sumPos(a * Math.PI / 180); if (a < 360) { mn = Math.min(mn, s); mx = Math.max(mx, s); sm += s; } curve.push([a, (dp || pr) * A * s * EHM / 1000]); }
        const meanS = sm / 180;
        const Tdel = running ? TL : 0, P = TAU * n * Tdel;
        ro.set('V', fx(Vg * 1000, 3) + ' L/rev (' + z + ' × ' + k + ' strokes)');
        ro.set('n', fx(n * 60, 1) + ' rpm');
        ro.set('dp', fx(dp / 1e5, 0) + ' bar');
        ro.set('T', fx(Tdel / 1000, 2) + ' kN·m');
        ro.set('P', fx(P / 1000, 2) + ' kW');
        ro.set('rip', meanS > 0 ? fx((mx - mn) / meanS * 100, 0) + ' %' : '—');
        ro.set('start', fx(pr * A * mn * EST / 1000, 2) + ' / ' + fx(pr * A * mx * EST / 1000, 2) + ' kN·m');
        const state = running ? 'turning' : Qs <= 0 ? 'no flow: the brake holds the load' : spNow <= 1e-6 ? 'dead point: no piston on a working flank — cannot start' : 'stalled: needs ' + fx(Math.min(dpStart, 9999e5) / 1e5, 0) + ' bar to start';
        ro.set('st', state);
        tPlot += dt;
        if (tPlot > 0.15) {
          tPlot = 0;
          const top = Math.max(1, V.TL, ...curve.map(p => p[1])) * 1.15;
          plot.set({ y: { label: 'torque (kN·m)', min: 0, max: top }, series: [{ pts: curve, label: 'motor torque at ' + fx((dp || pr) / 1e5, 0) + ' bar' }],
            hlines: [{ y: V.TL, label: 'load', color: C.warn }], vlines: [{ x: mod(th, TAU) * 180 / Math.PI }] });
        }
        // ---- drawing on a 760 × 400 grid
        const c = st.begin();
        fit(st, c, 760, 400);
        const cam = f => R0 + HMM / 2 * (1 - Math.cos(k * f));                // roller centre radius (mm)
        const hot = dp > 3e5;
        // the cam ring
        c.beginPath(); c.arc(CX, CY, 170 * SC, 0, TAU);
        for (let i = 0; i <= 360; i++) { const f = -TAU * i / 360, r = (cam(f) + RR) * SC; if (i) c.lineTo(CX + r * Math.cos(f), CY + r * Math.sin(f)); else c.moveTo(CX + r * Math.cos(f), CY + r * Math.sin(f)); }
        c.closePath();
        withAlpha(c, 0.5, () => { c.fillStyle = C.muted; c.fill('evenodd'); });
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        kit.label(c, 'cam ring, ' + k + ' lobes (fixed)', CX, CY - 170 * SC - 10, { color: C.muted, size: 11, align: 'center' });
        // the cylinder block
        c.beginPath(); c.arc(CX, CY, 85 * SC, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        const wv = Math.min(40, 0.95 * TAU * 42 / z) * SC;                    // bores touch at their inner end (not to scale)
        for (let i = 0; i < z; i++) {
          const f = th + i * TAU / z, R = cam(f), dR = camD(f), pIn = R - RR + 3, pOut = pIn - 40;
          const col = dR > 1e-4 ? S.col(hot ? 'pressure' : 'idle') : dR < -1e-4 ? S.col(running ? 'return' : 'idle') : C.muted;
          radialRect(c, CX, CY, f, 42 * SC, 85 * SC, wv); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke();
          radialRect(c, CX, CY, f, 42 * SC, pOut * SC, wv - 2); withAlpha(c, 0.7, () => { c.fillStyle = col; c.fill(); });
          radialRect(c, CX, CY, f, pOut * SC, pIn * SC, wv - 2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
          c.beginPath(); c.arc(CX + R * SC * Math.cos(f), CY + R * SC * Math.sin(f), RR * SC, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.3; c.stroke();
        }
        // distributor and shaft
        c.beginPath(); c.arc(CX, CY, 34 * SC, 0, TAU); withAlpha(c, 0.6, () => { c.fillStyle = C.muted; c.fill(); });
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); c.moveTo(CX, CY); c.lineTo(CX + 26 * SC * Math.cos(th), CY + 26 * SC * Math.sin(th)); c.stroke();
        kit.label(c, 'distributor', CX, CY + 16, { color: C.text, size: 10, align: 'center' });
        if (running) curvedArrow(kit, c, CX, CY, 150 * SC, -2.0, -1.2, C.accent, 2.4);
        // supply: a little circuit on the right
        const x0 = 520;
        S.line(c, [[x0, 250], [x0, 120], [690, 120], [690, 152]], { state: hot ? 'pressure' : 'idle' });
        S.line(c, [[690, 208], [690, 252]], { state: running ? 'return' : 'idle' });
        S.line(c, [[600, 120], [600, 175]], { state: hot ? 'pressure' : 'idle' });
        S.line(c, [[600, 233], [600, 262]], { state: Qr > 0 ? 'return' : 'idle' });
        S.junction(c, 600, 120);
        if (running && n > 0) { S.flow(c, [[x0, 250], [x0, 120], [690, 120], [690, 152]], (ph.a += dt * 2.2 * V.Q), { color: S.col('pressure') }); S.flow(c, [[690, 208], [690, 252]], (ph.b += dt * 2.2 * V.Q), { color: S.col('return') }); }
        if (Qr > 0) S.flow(c, [[x0, 250], [x0, 120], [600, 120], [600, 262]], (ph.a += dt * 2.2 * V.Q), { color: S.col('pressure') });
        S.source(c, x0, 270, { label: fx(V.Q, 0) + ' L/min' });
        S.pressureValve(c, 600, 204, { kind: 'relief', rot: 180, open: Qr > 0 ? 1 : 0 });
        S.tank(c, 600, 272); S.tank(c, 690, 262);
        const mo = S.motor(c, 690, 180, { angle: th, r: 18 });
        kit.label(c, 'relief ' + fx(V.relief, 0) + ' bar', 622, 204, { color: C.muted, size: 11 });
        kit.label(c, fx(dp / 1e5, 0) + ' bar', 530, 106, { color: C.text, size: 12, weight: 700 });
        kit.label(c, fx(n * 60, 1) + ' rpm, ' + fx(Tdel / 1000, 2) + ' kN·m', 740, 150, { color: C.text, size: 12, weight: 700, align: 'right' });
        kit.label(c, state, 740, 380, { color: running ? C.text : C.bad, size: 12, weight: 700, align: 'right' });
        void mo;
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ HYDROSTATIC TRANSMISSION */
  Hyper.sim('pm-hst', {
    title: 'Hydrostatic transmission of a wheel loader',
    blurb: `A closed-loop HST drives an 8-tonne wheel loader: a 75 kW diesel at up to 2200 rpm turns a 90 cm³/rev over-centre pump; the loop feeds a variable motor (110 down to 35 cm³/rev) on a 40:1 axle and 0.6 m wheels. A charge pump (**yellow**) makes up leakage through check valves into the low-pressure line; cross-port relief valves limit the loop to 420 bar. The high-pressure line is **red**, the low-pressure line **blue**. The graph shows the tractive force the drive can give at each speed — flat (pressure-limited) up to the corner, then the constant-power hyperbola — with the operating point and the resistance of the ground.

**Try this**
- With the motor at 110 cm³/rev, push the lever forward: speed rises with the pump displacement while the full force stays available — the constant-torque region.
- At full lever, reduce the motor displacement: the loader goes faster with less force, along the power hyperbola.
- Add 30 kN of pile resistance: the pressure climbs; the power limiter destrokes the pump so the engine does not stall. Switch the limiter off and try again.
- Drive at speed, then pull the lever back quickly: the motor pumps, the pressure appears on the other line, and the vehicle brakes hydrostatically — the pump drives the engine.
- Set a 30 % slope with the lever in neutral: the locked loop holds the loader (while the engine runs).`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'vehicle speed (km/h)', min: 0, max: 35 }, y: { label: 'tractive force (kN)', min: 0 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'ep', label: 'Drive lever: pump displacement', min: -100, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'vm', label: 'Motor displacement', min: 35, max: 110, step: 1, value: 110, unit: 'cm³/rev' },
        { id: 'ne', label: 'Engine speed', min: 1000, max: 2200, step: 50, value: 2200, unit: 'rpm' },
        { id: 'grade', label: 'Slope (+ uphill)', min: -20, max: 30, step: 1, value: 0, unit: '%' },
        { id: 'push', label: 'Pile resistance', min: 0, max: 40, step: 1, value: 0, unit: 'kN' },
        { id: 'auto', type: 'check', label: 'Automatic power limiter (anti-stall)', value: true }
      ], () => {});
      const ro = kit.readout(box.side, [['pump', 'Pump displacement'], ['q', 'Loop flow'], ['pab', 'Line A / line B'], ['mot', 'Motor speed, torque'], ['v', 'Vehicle speed'], ['F', 'Tractive force'], ['pw', 'Engine power used / available'], ['st', 'State']]);
      const V = ctl.values;
      const VP = 90e-6, VMX = 110e-6, VMN = 35e-6, I = 40, EA = 0.95, RW = 0.6, M = 8000, CRR = 0.03, DPR = 420e5, PCH = 25e5, EHP = 0.95, EHM = 0.94, G = 9.81;
      const etaV = dp => 0.98 - 0.03 * Math.min(1, Math.abs(dp) / DPR);
      const s = { v: 0, lev: 0, lim: 1, lug: 1, stalled: false, dp: 0, relief: false, Tm: 0, Qp: 0, Phyd: 0, Pin: 0, ne: 0, wang: 0, ph: {} };
      function step(dt) {
        const target = V.ep / 100, PeMax = 75e3 * V.ne / 2200;
        s.lev += clamp(target - s.lev, -dt / 1.5, dt / 1.5);                  // the pump strokes at a finite rate
        if (s.stalled && Math.abs(V.ep) < 5) { s.stalled = false; s.lug = 1; }
        const ne = s.stalled ? 0 : V.ne / 60 * s.lug;
        const ep = s.lev * (V.auto ? s.lim : 1), vm = V.vm * 1e-6;
        const Qp = ep * VP * ne, ev = etaV(s.dp) * etaV(s.dp);
        const vKin = Qp * ev / vm / I * TAU * RW;
        const sg = Math.tanh(s.v / 0.05), gr = V.grade / 100;
        const Fres = M * G * gr / Math.sqrt(1 + gr * gr) + (M * G * CRR + V.push * 1000) * sg;
        const aDes = (vKin - s.v) / 0.12;
        let F = M * aDes + Fres, Tm = F * RW / I / EA, dp = TAU * Tm / (vm * EHM), relief = false;
        if (Math.abs(dp) > DPR) { dp = Math.sign(dp) * DPR; relief = true; Tm = dp * vm * EHM / TAU; F = Tm * I * EA / RW; }
        const a = relief ? (F - Fres) / M : aDes;
        s.v = clamp(s.v + a * dt, -15, 15);
        const Phyd = dp * Qp, Pin = Phyd > 0 ? Phyd / EHP : Phyd * EHP;
        if (V.auto) { s.lug = Math.min(1, s.lug + dt * 2); s.lim = clamp(s.lim + dt * 6 * (PeMax - Pin) / PeMax, 0, 1); }
        else if (!s.stalled && ne > 0) {
          // no limiter: the engine (flat torque curve, 326 N·m) slows when the pump asks for more torque than it has;
          // the pump's torque is set by the loop pressure, so a heavy push drags the engine down until it stalls
          s.lim = 1;
          const Tp = Pin / (TAU * ne), Te = 75e3 / (TAU * 2200 / 60);
          s.lug = clamp(s.lug + dt * (Tp > Te ? -2 * (Tp - Te) / Te : 2), 0, 1);
          if (V.ne * s.lug < 700) { s.stalled = true; s.lug = 0; }
        }
        Object.assign(s, { dp, relief, Tm, F, Qp, Phyd, Pin, ne, PeMax: PeMax * (V.auto ? 1 : s.lug), ep });
        s.wang += s.v / RW * dt;
      }
      let tPlot = 1;
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 8; k++) step(dt / 8);
        const C = kit.colors(), vm = V.vm * 1e-6, kmh = s.v * 3.6;
        const nm = s.v / (TAU * RW) * I * 60;
        const Qm = Math.abs(nm / 60) * vm / etaV(s.dp);
        const Qrel = s.relief ? Math.max(0, Math.abs(s.Qp) * etaV(s.dp) - Qm) : 0;
        const pA = PCH + Math.max(0, s.dp), pB = PCH + Math.max(0, -s.dp);
        ro.set('pump', fx(s.ep * 90, 1) + ' cm³/rev (' + fx(s.ep * 100, 0) + ' %)' + (V.auto && s.lim < 0.98 ? ', power-limited' : ''));
        ro.set('q', fx(s.Qp * LPM, 1) + ' L/min' + (Qrel > 0.5 / LPM ? ', ' + fx(Qrel * LPM, 1) + ' over the relief' : ''));
        ro.set('pab', fx(pA / 1e5, 0) + ' / ' + fx(pB / 1e5, 0) + ' bar');
        ro.set('mot', fx(nm, 0) + ' rpm, ' + fx(s.Tm, 0) + ' N·m');
        ro.set('v', fx(kmh, 1) + ' km/h');
        ro.set('F', fx(s.F / 1000, 1) + ' kN');
        ro.set('pw', fx(s.Pin / 1000, 1) + ' / ' + fx(s.PeMax / 1000, 1) + ' kW');
        const state = s.stalled ? 'engine stalled — return the lever to neutral to restart'
          : s.relief ? 'relief valves open: maximum tractive force'
            : s.Phyd < -500 ? 'hydrostatic braking: the motor pumps, the pump drives the engine'
              : V.auto && s.lim < 0.98 ? 'constant power: the limiter holds the engine at full power'
                : !V.auto && s.lug < 0.98 ? 'engine overloaded: its speed is dropping'
                  : Math.abs(s.ep) < 0.02 ? 'neutral: the locked loop holds the loader'
                    : 'driving';
        ro.set('st', state);
        tPlot += dt;
        if (tPlot > 0.15) {
          tPlot = 0;
          const Pw = s.PeMax * EHP * EHM * 0.92 * EA, Fx = vmx => DPR * vmx * EHM * I * EA / (TAU * RW);
          const vmax = vmx => V.ne / 60 * VP * 0.92 / vmx / I * TAU * RW;
          // force available up to a top speed: the relief limit (fcap), then the power hyperbola
          const env = (top, fcap, N) => { const pts = []; for (let k = 0; k <= N; k++) { const v = top * k / N; pts.push([v * 3.6, Math.min(fcap, v > 0 ? Pw / v : Infinity) / 1000]); } pts.push([top * 3.6, 0]); return pts; };
          const gr = V.grade / 100, Fr = (M * G * (gr / Math.sqrt(1 + gr * gr) + CRR) + V.push * 1000) / 1000;
          const ymax = Math.max(50, Fr + 5, Math.abs(s.F) / 1000 + 5);
          plot.set({ y: { label: 'tractive force (kN)', min: 0, max: ymax },
            series: [{ pts: env(vmax(VMN), Fx(VMX), 120), label: 'whole range (motor 110 → 35 cm³/rev)', dash: [5, 4] },
              { pts: env(vmax(vm), Fx(vm), 80), label: 'at this motor displacement', width: 2.6 },
              { pts: [[0, Math.max(0, Fr)], [35, Math.max(0, Fr)]], label: 'ground resistance, forward', dash: [2, 3] }],
            marks: [{ x: Math.abs(kmh), y: Math.abs(s.F) / 1000, label: fx(Math.abs(kmh), 1) + ' km/h, ' + fx(Math.abs(s.F) / 1000, 1) + ' kN', color: C.warn }] });
        }
        // ---- the circuit on a 760 × 350 grid
        const c = st.begin();
        fit(st, c, 760, 350);
        const run = !s.stalled && s.ne > 0, fwd = s.dp >= 0;
        const stA = Math.abs(s.dp) > 5e5 ? (fwd ? 'pressure' : 'return') : 'return', stB = Math.abs(s.dp) > 5e5 ? (fwd ? 'return' : 'pressure') : 'return';
        const lineA = [[200, 140], [200, 60], [620, 60], [620, 140]], lineB = [[200, 200], [200, 290], [620, 290], [620, 200]];
        S.line(c, lineA, { state: stA }); S.line(c, lineB, { state: stB });
        // cross-port reliefs
        S.line(c, [[270, 60], [270, 146]], { state: stA }); S.line(c, [[270, 204], [270, 290]], { state: stB });
        S.line(c, [[320, 60], [320, 146]], { state: stA }); S.line(c, [[320, 204], [320, 290]], { state: stB });
        S.pressureValve(c, 270, 175, { kind: 'relief', rot: 180, open: s.relief && fwd ? 1 : 0 });
        S.pressureValve(c, 320, 175, { kind: 'relief', open: s.relief && !fwd ? 1 : 0 });
        S.junction(c, 270, 60); S.junction(c, 320, 60); S.junction(c, 270, 290); S.junction(c, 320, 290);
        // charge circuit
        const chg = run ? 'metered' : 'idle';
        S.line(c, [[395, 160], [530, 160]], { state: chg });
        S.line(c, [[470, 192], [470, 160]], { state: chg });
        S.line(c, [[470, 238], [470, 248]], { state: run ? 'suction' : 'idle' });
        S.line(c, [[430, 123], [430, 160]], { state: chg }); S.line(c, [[430, 87], [430, 60]], { state: stA });
        S.line(c, [[530, 207], [530, 160]], { state: chg }); S.line(c, [[530, 243], [530, 290]], { state: stB });
        S.line(c, [[395, 160], [395, 196]], { state: chg }); S.line(c, [[395, 254], [395, 262]], { state: run ? 'return' : 'idle' });
        S.junction(c, 430, 160); S.junction(c, 470, 160); S.junction(c, 430, 60); S.junction(c, 530, 290);
        S.pump(c, 470, 215, { r: 13 });
        S.tank(c, 470, 258); S.tank(c, 395, 272);
        S.check(c, 430, 105, { open: run && !fwd });
        S.check(c, 530, 225, { rot: 180, open: run && fwd });
        S.pressureValve(c, 395, 225, { kind: 'relief', rot: 180, open: run ? 0.4 : 0 });
        kit.label(c, 'charge pump', 470, 284, { color: C.muted, size: 10.5, align: 'center' });
        // flow round the loop: out of the pump along one line, back along the other
        const qv = Math.abs(s.Qp) * LPM, ad = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 1.2 * q; return s.ph[key]; };
        if (qv > 0.2) {
          const out = s.Qp > 0 ? lineA : lineB, back = (s.Qp > 0 ? lineB : lineA).slice().reverse();
          S.flow(c, out, ad('out', qv), { color: S.col(s.Qp > 0 ? stA : stB) });
          S.flow(c, back, ad('back', qv), { color: S.col(s.Qp > 0 ? stB : stA) });
        }
        // units
        S.pump(c, 200, 170, { variable: true, bidir: true, r: 20 });
        S.motor(c, 620, 170, { variable: true, bidir: true, r: 20 });
        // engine and shaft
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, 40, 145, 88, 50, 6); c.fill(); c.stroke();
        kit.label(c, 'engine', 84, 162, { color: C.text, size: 12, weight: 700, align: 'center' });
        kit.label(c, s.stalled ? 'stalled' : fx(s.ne * 60, 0) + ' rpm', 84, 180, { color: s.stalled ? C.bad : C.muted, size: 11, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(128, 167.5); c.lineTo(168, 167.5); c.moveTo(128, 172.5); c.lineTo(168, 172.5); c.stroke();
        // the wheel on the ground
        const wx = 705, wy = 170, wr = 38, ga = Math.atan(V.grade / 100);
        c.beginPath(); c.moveTo(652, 172.5); c.lineTo(wx, 172.5); c.moveTo(652, 167.5); c.lineTo(wx, 167.5); c.stroke();
        c.beginPath(); c.arc(wx, wy, wr, 0, TAU); c.fillStyle = C.surface; c.fill(); c.lineWidth = 5; c.strokeStyle = C.text; c.stroke();
        c.lineWidth = 1.6;
        for (let k = 0; k < 5; k++) { const a = s.wang + k * TAU / 5; c.beginPath(); c.moveTo(wx, wy); c.lineTo(wx + (wr - 4) * Math.cos(a), wy + (wr - 4) * Math.sin(a)); c.stroke(); }
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath();
        c.moveTo(wx - 60 * Math.cos(ga), wy + wr + 60 * Math.sin(ga)); c.lineTo(wx + 50 * Math.cos(ga), wy + wr - 50 * Math.sin(ga)); c.stroke();
        kit.label(c, fx(Math.abs(kmh), 1) + ' km/h' + (kmh < -0.05 ? ' (reverse)' : ''), wx, wy - wr - 12, { color: C.text, size: 12, weight: 700, align: 'center' });
        // labels
        kit.label(c, 'A  ' + fx(pA / 1e5, 0) + ' bar', 410, 46, { color: S.col(stA), size: 12, weight: 700, align: 'center' });
        kit.label(c, 'B  ' + fx(pB / 1e5, 0) + ' bar', 410, 306, { color: S.col(stB), size: 12, weight: 700, align: 'center' });
        kit.label(c, 'pump ' + fx(s.ep * 90, 0) + ' cm³/rev', 140, 222, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'motor ' + fx(V.vm, 0) + ' cm³/rev', 684, 236, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'cross-port reliefs 420 bar', 295, 318, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, state, 745, 338, { color: s.stalled || s.relief ? C.bad : C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
