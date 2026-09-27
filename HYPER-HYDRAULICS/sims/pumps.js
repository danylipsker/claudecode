/* HYPER-HYDRAULICS · sims/pumps.js — simulations for the branch "Pumps and Turbines" (content/pumps.js).
 *   pump-operating        a pump lifting water through a pipe with a throttle valve and a variable-speed drive:
 *                         pump and system curves, the operating point, efficiency and power; throttling against speed control
 *   pump-series-parallel  one pump, two in parallel or two in series against a system curve; unequal pumps
 *   pump-npsh             suction from a sump: level, temperature, altitude, flow and pipe size -> NPSHa against NPSHr,
 *                         the NPSH budget as a waterfall, vapour bubbles at the impeller eye, head drop
 *   pump-triangles        an impeller with its vanes and the inlet and outlet velocity triangles; Euler head with slip
 *   pump-nq               specific speed: impeller shape and typical curves from radial to axial
 *   pump-pelton           a Pelton wheel: jet speed, bucket speed ratio, torque, efficiency, spray and deflector
 *   pump-turbine-chart    the head-flow chart of turbine types with lines of equal power; drag the site, pick a speed
 *   pump-storage-day      a day of pumped storage: pumping, generating, energy stored and round trip
 * The example pump shared with the content: 1450 rpm, best point 100 m³/h at 32 m and 78 %, shut-off head 40 m,
 * H = H0 − (H0 − Hb)(Q/Qb)², shaft power P = Pb(1 + Q/Qb)/2 (so the efficiency peaks at the BEP), NPSHr = 1.2 + 0.8(Q/Qb)² m,
 * scaled by the affinity laws at other speeds.
 */
(function () {
  'use strict';

  const G = 9.80665, RHO = 1000;
  const PUMP = { n0: 1450, H0: 40, Hb: 32, Qb: 100 / 3600, eb: 0.78 };
  PUMP.Pb = RHO * G * PUMP.Qb * PUMP.Hb / PUMP.eb;
  const XMAX = Math.sqrt(PUMP.H0 / (PUMP.H0 - PUMP.Hb));            // Q/Qb where the head reaches zero
  // head, shaft power, efficiency and NPSH required at flow Q (m³/s) and speed ratio r = n/n0
  const pH = (Q, r) => r * r * PUMP.H0 - (PUMP.H0 - PUMP.Hb) * (Q / PUMP.Qb) * (Q / PUMP.Qb);
  const pP = (Q, r) => r > 0 ? r * r * r * PUMP.Pb * (1 + Q / (r * PUMP.Qb)) / 2 : 0;
  const pEta = (Q, r) => { const H = pH(Q, r), P = pP(Q, r); return Q > 0 && H > 0 && P > 0 ? RHO * G * Q * H / P : 0; };
  const pNPSHr = (Q, r) => { const x = r > 0 ? Q / (r * PUMP.Qb) : 0; return r * r * (1.2 + 0.8 * x * x); };
  const M3H = Q => Q * 3600;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => Number.isFinite(v) ? v : (d || 0);
  const kWtxt = P => Math.abs(P) >= 1e6 ? (P / 1e6).toFixed(2) + ' MW' : (P / 1000).toFixed(P < 1e4 ? 2 : 1) + ' kW';

  // the operating point, where the pump head meets the system head; none if the pump cannot reach the static head
  function opPoint(F, pumpHf, sysHf, Qmax) {
    if (!(Qmax > 0) || pumpHf(0) <= sysHf(0)) return { Q: 0, H: Math.max(0, pumpHf(0)), none: true };
    const o = F.operatingPoint(pumpHf, sysHf, Qmax);
    return { Q: fin(o.Q), H: fin(o.H), none: false };
  }
  // sample a function of flow for a plot: [[m³/h, f(Q)], …]
  function sample(f, q0, q1, n, ymax) {
    const a = [];
    for (let i = 0; i <= n; i++) {
      const q = q0 + (q1 - q0) * i / n, y = f(q);
      if (Number.isFinite(y) && (ymax == null || y <= ymax)) a.push([M3H(q), y]);
    }
    return a;
  }

  /* ---------------------------------------------------------------- drawing helpers */
  // kit.label, centred unless told otherwise
  function lbl(kit, c, t, x, y, o) { kit.label(c, t, x, y, Object.assign({ align: 'center' }, o || {})); }
  function poly(c, pts) { c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); }
  const waterFill = C => C.hue(205, C.dark ? 0.3 : 0.2);
  const waterEdge = C => C.hue(205, C.dark ? 0.85 : 0.6);
  // a pipe drawn with walls and water inside
  function pipe(c, pts, C, w, dim) {
    w = w || 7;
    c.save(); c.lineJoin = 'round'; c.lineCap = 'butt';
    c.strokeStyle = dim ? C.faint : C.muted; c.lineWidth = w + 3; poly(c, pts); c.stroke();
    c.strokeStyle = C.bg; c.lineWidth = w; poly(c, pts); c.stroke();
    if (!dim) { c.strokeStyle = C.hue(205, C.dark ? 0.35 : 0.25); poly(c, pts); c.stroke(); }
    c.restore();
  }
  // an open tank or sump: walls and water up to level y
  function basin(c, x0, x1, yTop, yBot, yWater, C) {
    c.fillStyle = waterFill(C); c.fillRect(x0, yWater, x1 - x0, yBot - yWater);
    c.strokeStyle = waterEdge(C); c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, yWater); c.lineTo(x1, yWater); c.stroke();
    c.strokeStyle = C.text; c.lineWidth = 2; poly(c, [[x0, yTop], [x0, yBot], [x1, yBot], [x1, yTop]]); c.stroke();
  }
  // a centrifugal pump seen along its shaft: casing, discharge nozzle on top, impeller turning anticlockwise
  function pumpIcon(c, x, y, R, ang, C, o) {
    o = o || {};
    const col = o.color || C.text;
    c.save();
    c.fillStyle = C.surface; c.strokeStyle = col; c.lineWidth = 2;
    c.fillRect(x + 0.1 * R, y - 1.55 * R, 0.8 * R, R); c.strokeRect(x + 0.1 * R, y - 1.55 * R, 0.8 * R, R);
    c.beginPath(); c.arc(x, y, R, 0, Math.PI * 2); c.fill(); c.stroke();
    c.strokeStyle = o.vane || (o.color ? col : C.accent); c.lineWidth = 1.6;
    c.beginPath(); c.arc(x, y, 0.64 * R, 0, Math.PI * 2); c.stroke();
    for (let k = 0; k < 6; k++) {
      const a = ang + k * Math.PI / 3;
      c.beginPath();
      c.moveTo(x + 0.2 * R * Math.cos(a), y - 0.2 * R * Math.sin(a));
      c.quadraticCurveTo(x + 0.45 * R * Math.cos(a - 0.25), y - 0.45 * R * Math.sin(a - 0.25), x + 0.62 * R * Math.cos(a - 0.75), y - 0.62 * R * Math.sin(a - 0.75));
      c.stroke();
    }
    c.fillStyle = col; c.beginPath(); c.arc(x, y, 0.12 * R, 0, Math.PI * 2); c.fill();
    c.restore();
    return { in: [x - R, y], out: [x + 0.5 * R, y - 1.55 * R] };
  }
  // a throttle valve (bow-tie), shaded as it closes; open = 0..1
  function valveIcon(c, x, y, open, C) {
    const t = 1 - open;
    c.save();
    c.fillStyle = t > 0.02 ? C.hue(35, 0.2 + 0.6 * t) : C.surface;
    c.strokeStyle = C.text; c.lineWidth = 1.8;
    c.beginPath(); c.moveTo(x - 14, y - 10); c.lineTo(x + 14, y + 10); c.lineTo(x + 14, y - 10); c.lineTo(x - 14, y + 10); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - 20); c.moveTo(x - 8, y - 20); c.lineTo(x + 8, y - 20); c.stroke();
    c.restore();
  }
  // a check valve for left-to-right flow: open lets flow pass, closed shows the disc on its seat
  function checkIcon(c, x, y, open, C) {
    c.save();
    c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
    c.fillRect(x - 12, y - 9, 24, 18); c.strokeRect(x - 12, y - 9, 24, 18);
    c.beginPath(); c.moveTo(x - 6, y - 6); c.lineTo(x + 5, y); c.lineTo(x - 6, y + 6); c.closePath();
    c.fillStyle = open ? C.ok : C.bad; c.fill();
    c.strokeStyle = C.text; c.beginPath(); c.moveTo(x + 6, y - 7); c.lineTo(x + 6, y + 7); c.stroke();
    c.restore();
  }

  /* ================================================================ pump-operating */
  Hyper.sim('pump-operating', {
    title: 'Pump and system: throttle or slow down',
    blurb: `A centrifugal pump lifts water from a sump to a tank through a pipe with a throttle valve; a variable-speed drive (VFD) sets its speed. The upper graph shows the pump curve and the system curve — the pump runs where they cross. The lower graph compares the shaft power needed for each flow when the flow is set by **throttling** at full speed and by **slowing the pump** with the valve open.

**Try this**
- Press *Throttle to 70 m³/h*: the operating point slides left along the pump curve, the pump makes *more* head and the valve burns the surplus. Then press *Same flow by speed*: the same 70 m³/h for about 3 kW less.
- Set the static head to 0, a circulating loop: the two power curves split widely — the cube law at work. Raise it to 30 m and speed control saves much less.
- Slow the pump with a 20 m lift: below about 1025 rpm its shut-off head falls under the static head and the flow stops.
- Watch the BEP mark ride along the dotted parabola as the speed changes, and the efficiency fall as the operating point moves away from it.
- Raise the pipe losses: the system curve steepens and the pump runs further left.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.43, minH: 240 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 0'; box.stage.appendChild(d1);
      const d2 = document.createElement('div'); d2.style.padding = '0 10px 10px'; box.stage.appendChild(d2);
      const DEF = { valve: 100, rpm: 1450, hst: 20, hf: 12 };
      const KV = 0.5;                  // the open valve loses 0.5 m at 100 m³/h; its loss grows as 1/opening²
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'valve', label: 'Throttle valve opening', min: 5, max: 100, step: 1, value: DEF.valve, unit: '%' },
        { id: 'rpm', label: 'Pump speed (variable-speed drive)', min: 600, max: 1600, step: 5, value: DEF.rpm, unit: 'rpm' },
        { id: 'hst', label: 'Static head (lift)', min: 0, max: 35, step: 0.5, value: DEF.hst, unit: 'm' },
        { id: 'hf', label: 'Pipe losses at 100 m³/h', min: 2, max: 30, step: 0.5, value: DEF.hf, unit: 'm' },
        { type: 'buttons', items: [{ id: 'thr', label: 'Throttle to 70 m³/h' }, { id: 'spd', label: 'Same flow by speed', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'thr') {
          ctl.set('rpm', 1450);
          const Q = 70 / 3600, x = Q / PUMP.Qb, surplus = pH(Q, 1) - V.hst - V.hf * x * x;
          // the valve must burn the surplus: KV/o² × x² = surplus
          const o = surplus > KV * x * x ? Math.sqrt(KV * x * x / surplus) : 1;
          ctl.set('valve', clamp(o * 100, 5, 100));
        }
        if (id === 'spd') {
          const s = solve();
          if (s.Q > 0 && s.r2 > 0) { ctl.set('valve', 100); ctl.set('rpm', Math.round(clamp(s.r2 * PUMP.n0, 600, 1600) / 5) * 5); }
        }
        if (id === 'reset') for (const k in DEF) ctl.set(k, DEF[k]);
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Flow (share of the BEP flow)'], ['h', 'Pump head / the pipes need'], ['hv', 'Burnt in the valve'], ['eta', 'Pump efficiency'], ['p', 'Shaft power'], ['e', 'Energy per m³ pumped'], ['alt', 'Same flow by speed, valve open']]);
      const p1 = kit.plot(d1, { x: { label: 'flow Q (m³/h)', min: 0, max: 200 }, y: { label: 'head H (m)', min: 0, max: 50 }, legend: true }, 210);
      const p2 = kit.plot(d2, { x: { label: 'flow Q (m³/h)', min: 0, max: 200 }, y: { label: 'shaft power (kW)', min: 0 }, legend: true }, 170);

      function solve() {
        const r = V.rpm / PUMP.n0, o = V.valve / 100, kv = KV / (o * o);
        const sys = Q => V.hst + (V.hf + kv) * (Q / PUMP.Qb) * (Q / PUMP.Qb);
        const op = opPoint(F, Q => pH(Q, r), sys, r * XMAX * PUMP.Qb);
        const Q = op.Q, x = Q / PUMP.Qb;
        const r2 = Q > 0 ? Math.sqrt((V.hst + (V.hf + KV + PUMP.H0 - PUMP.Hb) * x * x) / PUMP.H0) : 0;
        return { r, o, kv, sys, Q, H: op.H, none: op.none, x, Hpipe: V.hst + V.hf * x * x, hv: kv * x * x,
          P: pP(Q, r), eta: pEta(Q, r), r2, P2: Q > 0 ? pP(Q, r2) : 0 };
      }
      function show(s) {
        const C = kit.colors(), share = s.r > 0 ? s.Q / (s.r * PUMP.Qb) : 0;
        ro.set('q', M3H(s.Q).toFixed(1) + ' m³/h (' + (share * 100).toFixed(0) + ' %)');
        ro.set('h', s.H.toFixed(1) + ' m / ' + s.Hpipe.toFixed(1) + ' m');
        ro.set('hv', s.hv.toFixed(1) + ' m = ' + kWtxt(s.eta > 0 ? RHO * G * s.Q * s.hv / s.eta : 0));
        ro.set('eta', (s.eta * 100).toFixed(1) + ' %');
        ro.set('p', kWtxt(s.P));
        ro.set('e', s.Q > 0 ? (s.P / s.Q / 3.6e6).toFixed(3) + ' kWh/m³' : '— (no flow)');
        ro.set('alt', s.Q > 0 ? (s.r2 * PUMP.n0).toFixed(0) + ' rpm, ' + kWtxt(s.P2) + (s.P - s.P2 > 50 ? ' (saves ' + ((s.P - s.P2) / s.P * 100).toFixed(0) + ' %)' : '') : '—');
        // the curves
        const qmaxR = s.r * XMAX * PUMP.Qb, top = 200 / 3600, series = [];
        series.push({ pts: sample(q => pH(q, s.r), 0, Math.min(qmaxR, top), 60), label: 'pump at ' + V.rpm + ' rpm', color: C.accent });
        if (Math.abs(s.r - 1) > 1e-3) series.push({ pts: sample(q => pH(q, 1), 0, Math.min(XMAX * PUMP.Qb, top), 60), label: 'pump at 1450 rpm', color: C.muted, dash: [5, 4] });
        series.push({ pts: sample(s.sys, 0, top, 80, 60), label: s.o < 0.999 ? 'system with the valve' : 'system', color: C.bad });
        if (s.o < 0.999) series.push({ pts: sample(q => V.hst + (V.hf + KV) * (q / PUMP.Qb) * (q / PUMP.Qb), 0, top, 60, 60), label: 'system, valve open', color: C.bad, dash: [5, 4] });
        series.push({ pts: sample(q => PUMP.Hb * (q / PUMP.Qb) * (q / PUMP.Qb), 0, top, 40, 60), label: 'BEP at any speed', color: C.faint, dash: [2, 4], width: 1.4 });
        const nearBep = Math.abs(M3H(s.Q) - 100 * s.r) < 12;
        p1.set({ series, marks: [{ x: 100 * s.r, y: PUMP.Hb * s.r * s.r, label: nearBep ? '' : 'BEP', color: C.ok }, { x: M3H(s.Q), y: s.H, label: s.none ? 'no flow' : 'operating point, η = ' + (s.eta * 100).toFixed(0) + ' %' }], hlines: [{ y: V.hst, label: 'static head' }] });
        // power: throttling at full speed against speed control with the valve open, over the flows the open system can take
        const qOpen = opPoint(F, q => pH(q, 1), q => V.hst + (V.hf + KV) * (q / PUMP.Qb) * (q / PUMP.Qb), XMAX * PUMP.Qb).Q;
        const thr = [], spd = [];
        for (let i = 0; i <= 50; i++) {
          const q = qOpen * i / 50, x = q / PUMP.Qb;
          thr.push([M3H(q), pP(q, 1) / 1000]);
          const rr = Math.sqrt((V.hst + (V.hf + KV + PUMP.H0 - PUMP.Hb) * x * x) / PUMP.H0);
          spd.push([M3H(q), pP(q, rr) / 1000]);
        }
        p2.set({ series: [{ pts: thr, label: 'throttling at 1450 rpm', color: C.bad }, { pts: spd, label: 'speed control, valve open', color: C.ok }], marks: [{ x: M3H(s.Q), y: s.P / 1000, label: 'now' }] });
      }

      let sol = solve(), ang = 0, ph = 0;
      const loop = kit.loop((dt) => {
        if (dirty) { sol = solve(); show(sol); dirty = false; }
        const s = sol, C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 330);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 330 * k) / 2); c.scale(k, k);
        const yLo = 250, yUp = yLo - V.hst * 170 / 35;
        basin(c, 20, 200, 222, 318, yLo, C);
        basin(c, 600, 740, yUp - 26, yUp + 44, yUp, C);
        // static head
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(200, yLo); c.lineTo(588, yLo); c.moveTo(562, yUp); c.lineTo(600, yUp); c.stroke(); c.restore();
        if (V.hst > 1) { kit.arrow(c, 578, (yLo + yUp) / 2, 578, yUp + 2, C.muted, 1.5); kit.arrow(c, 578, (yLo + yUp) / 2, 578, yLo - 2, C.muted, 1.5); }
        lbl(kit, c, 'static head ' + V.hst.toFixed(1) + ' m', 570, (yLo + yUp) / 2, { align: 'right', color: C.muted, size: 12 });
        // pipes and flow
        const suction = [[150, 290], [246, 290]], disch = [[282, 253], [282, 40], [650, 40], [650, yUp + 24]];
        pipe(c, suction, C); pipe(c, disch, C);
        ph += dt * 110 * s.Q / PUMP.Qb;
        if (s.Q > 1e-6) { S.flow(c, suction, ph, { color: S.col('suction'), r: 2.2 }); S.flow(c, disch, ph, { color: S.col('pressure'), r: 2.2 }); }
        // pump, motor and drive
        ang += dt * V.rpm / 60 * 0.3;
        pumpIcon(c, 270, 290, 24, ang, C);
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(294, 290); c.lineTo(306, 290); c.stroke();
        c.fillStyle = C.surface; c.lineWidth = 1.8; c.fillRect(306, 278, 52, 24); c.strokeRect(306, 278, 52, 24);
        lbl(kit, c, 'M', 332, 290, { size: 12, weight: 700, color: C.text });
        c.fillRect(306, 232, 52, 24); c.strokeRect(306, 232, 52, 24);
        lbl(kit, c, 'VFD', 332, 244, { size: 11, weight: 700, color: C.text });
        c.save(); c.setLineDash([3, 3]); c.beginPath(); c.moveTo(332, 256); c.lineTo(332, 278); c.stroke(); c.restore();
        lbl(kit, c, V.rpm + ' rpm', 366, 244, { align: 'left', size: 12, color: Math.abs(s.r - 1) > 1e-3 ? C.accent : C.muted, weight: 700 });
        lbl(kit, c, 'pump head ' + s.H.toFixed(1) + ' m', 292, 150, { align: 'left', size: 12, color: C.text });
        lbl(kit, c, M3H(s.Q).toFixed(0) + ' m³/h', 292, 170, { align: 'left', size: 12, color: C.muted });
        // valve
        valveIcon(c, 470, 40, s.o, C);
        lbl(kit, c, 'valve ' + V.valve.toFixed(0) + ' % open', 470, 12, { size: 11, color: C.muted });
        if (s.o < 0.999 && s.hv > 0.05) lbl(kit, c, 'burns ' + s.hv.toFixed(1) + ' m', 470, 64, { size: 12, color: s.hv > 2 ? C.warn : C.muted, weight: 700 });
        // what is going on
        const share = s.r > 0 ? s.Q / (s.r * PUMP.Qb) : 0;
        let msg, col = C.ok;
        if (s.none) { msg = 'The shut-off head is below the static head: no flow, the pump churns'; col = C.bad; }
        else if (s.o < 0.999 && s.hv > 1) { msg = 'Throttled: ' + kWtxt(RHO * G * s.Q * s.hv / Math.max(s.eta, 0.05)) + ' of shaft power burnt in the valve'; col = C.warn; }
        else if (share < 0.7) { msg = 'Left of the preferred region: recirculation, vibration, heating'; col = C.warn; }
        else if (share > 1.2) { msg = 'Right of the preferred region: high power and NPSH required'; col = C.warn; }
        else if (share < 0.85 || share > 1.15) msg = 'Inside the preferred region, 70–120 % of the BEP flow';
        else msg = 'Running near its best-efficiency point';
        lbl(kit, c, msg, 740, 322, { align: 'right', size: 12, weight: 700, color: col });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-series-parallel */
  Hyper.sim('pump-series-parallel', {
    title: 'Two pumps: parallel or series',
    blurb: `Two copies of the example pump (40 m at shut-off, 32 m at 100 m³/h) feed a tank. Choose one pump, two in parallel or two in series. The graph adds the curves — flows side by side for parallel, heads on top of each other for series — and marks where each arrangement meets the system curve: **1**, **P** and **S**.

**Try this**
- With the default system (20 m lift, 12 m of losses) compare 1 and P: the second pump adds only about 20 % more flow, and each pump runs far back on its curve.
- Lower the losses to 2 m and raise the lift to 30 m: now the parallel pair gives almost 60 % more.
- Raise the lift above 40 m: one pump cannot reach the tank at all — only the series pair delivers.
- In parallel with a 25 m lift, slow pump 2 to 75 %: its shut-off head falls below the system head, its check valve shuts and it churns, dead-headed.
- In series with little lift and pump 2 slowed, pump 2 is driven past its run-out and becomes a restriction.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 10px'; box.stage.appendChild(d1);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Arrangement', options: [['One pump', 'one'], ['Two pumps in parallel', 'par'], ['Two pumps in series', 'ser']], value: 'par' },
        { id: 'hst', label: 'Static head (lift)', min: 0, max: 70, step: 1, value: 20, unit: 'm' },
        { id: 'hf', label: 'System losses at 100 m³/h', min: 1, max: 40, step: 0.5, value: 12, unit: 'm' },
        { id: 'n2', label: 'Speed of pump 2', min: 60, max: 100, step: 1, value: 100, unit: '%' }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'Total flow and head'], ['a', 'Pump 1: flow, head, efficiency'], ['b', 'Pump 2: flow, head, efficiency'], ['p', 'Total shaft power'], ['c', 'Compared with one pump']]);
      const plot = kit.plot(d1, { x: { label: 'flow Q (m³/h)', min: 0, max: 260 }, y: { label: 'head H (m)', min: 0, max: 90 }, legend: true }, 250);
      const Qi = (H, r) => PUMP.Qb * Math.sqrt(Math.max(0, (r * r * PUMP.H0 - H) / (PUMP.H0 - PUMP.Hb)));

      function solve() {
        const r2 = V.n2 / 100;
        const sys = Q => V.hst + V.hf * (Q / PUMP.Qb) * (Q / PUMP.Qb);
        const Qsys = H => PUMP.Qb * Math.sqrt(Math.max(0, (H - V.hst) / V.hf));
        const one = opPoint(F, Q => pH(Q, 1), sys, XMAX * PUMP.Qb);
        // parallel: find the common head at which the two pumps' flows add up to what the system takes
        let par;
        const Htop = Math.max(1, r2 * r2) * PUMP.H0;
        if (Htop <= V.hst) par = { Q: 0, H: Htop, q1: 0, q2: 0, none: true };
        else {
          let lo = V.hst, hi = Htop;
          for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (Qi(m, 1) + Qi(m, r2) > Qsys(m)) lo = m; else hi = m; }
          const H = (lo + hi) / 2;
          par = { H, q1: Qi(H, 1), q2: Qi(H, r2), none: false };
          par.Q = par.q1 + par.q2;
        }
        // series: the heads add at the common flow
        const qSer = PUMP.Qb * Math.sqrt((1 + r2 * r2) * PUMP.H0 / (2 * (PUMP.H0 - PUMP.Hb)));
        const ser = opPoint(F, Q => pH(Q, 1) + pH(Q, r2), sys, qSer);
        return { r2, sys, one, par, ser, qSer, Htop };
      }
      function current(s) {
        if (V.mode === 'one') return { Q: s.one.Q, H: s.one.H, none: s.one.none, q1: s.one.Q, h1: s.one.H, q2: 0, h2: 0, on2: false };
        if (V.mode === 'par') return { Q: s.par.Q, H: s.par.H, none: s.par.none, q1: s.par.q1, h1: s.par.H, q2: s.par.q2, h2: s.par.H, on2: true };
        return { Q: s.ser.Q, H: s.ser.H, none: s.ser.none, q1: s.ser.Q, h1: pH(s.ser.Q, 1), q2: s.ser.Q, h2: pH(s.ser.Q, s.r2), on2: true };
      }
      function show(s, o) {
        const C = kit.colors();
        const P1 = pP(o.q1, 1), P2 = o.on2 ? pP(o.q2, s.r2) : 0, Pone = pP(s.one.Q, 1);
        ro.set('q', M3H(o.Q).toFixed(1) + ' m³/h at ' + o.H.toFixed(1) + ' m');
        ro.set('a', M3H(o.q1).toFixed(1) + ' m³/h, ' + o.h1.toFixed(1) + ' m, ' + (pEta(o.q1, 1) * 100).toFixed(0) + ' %');
        let b;
        if (!o.on2) b = 'standby, isolated';
        else if (V.mode === 'par' && o.q2 < 1e-7) b = 'dead-headed: check valve shut, churning';
        else if (V.mode === 'ser' && o.h2 < 0) b = M3H(o.q2).toFixed(1) + ' m³/h, ' + o.h2.toFixed(1) + ' m: a restriction';
        else b = M3H(o.q2).toFixed(1) + ' m³/h, ' + o.h2.toFixed(1) + ' m, ' + (pEta(o.q2, s.r2) * 100).toFixed(0) + ' %';
        ro.set('b', b);
        ro.set('p', kWtxt(P1 + P2));
        if (V.mode === 'one') ro.set('c', s.one.none ? 'one pump cannot reach the tank' : '—');
        else if (s.one.none) ro.set('c', o.Q > 0 ? 'one pump alone delivers nothing here' : 'no flow either way');
        else ro.set('c', 'flow ' + (o.Q >= s.one.Q ? '+' : '') + ((o.Q / s.one.Q - 1) * 100).toFixed(0) + ' %, power +' + (((P1 + P2) / Pone - 1) * 100).toFixed(0) + ' %');
        // curves
        const series = [];
        series.push({ pts: sample(q => pH(q, 1), 0, XMAX * PUMP.Qb, 50), label: 'one pump', color: C.muted, dash: [5, 4] });
        if (s.r2 < 0.999) series.push({ pts: sample(q => pH(q, s.r2), 0, s.r2 * XMAX * PUMP.Qb, 50), label: 'pump 2 alone', color: C.faint, dash: [2, 4] });
        const par = [];
        for (let i = 0; i <= 80; i++) { const H = s.Htop * i / 80, q = M3H(Qi(H, 1) + Qi(H, s.r2)); if (q <= 262) par.push([q, H]); }
        par.sort((a, b2) => a[0] - b2[0]);
        series.push({ pts: par, label: 'parallel', color: C.accent, width: V.mode === 'par' ? 3 : 1.6 });
        series.push({ pts: sample(q => pH(q, 1) + pH(q, s.r2), 0, s.qSer, 60), label: 'series', color: C.series[1], width: V.mode === 'ser' ? 3 : 1.6 });
        series.push({ pts: sample(s.sys, 0, 260 / 3600, 60, 95), label: 'system', color: C.bad });
        const marks = [];
        if (!s.one.none) marks.push({ x: M3H(s.one.Q), y: s.one.H, label: '1', color: C.muted });
        if (!s.par.none) marks.push({ x: M3H(s.par.Q), y: s.par.H, label: 'P', color: C.accent });
        if (!s.ser.none) marks.push({ x: M3H(s.ser.Q), y: s.ser.H, label: 'S', color: C.series[1] });
        if (V.mode === 'par' && !s.par.none) { marks.push({ x: M3H(s.par.q1), y: s.par.H, label: 'pump 1', color: C.text }); if (s.r2 < 0.999) marks.push({ x: M3H(s.par.q2), y: s.par.H, label: 'pump 2', color: C.text }); }
        if (V.mode === 'ser' && !s.ser.none) marks.push({ x: M3H(s.ser.Q), y: pH(s.ser.Q, 1), label: 'each pump', color: C.text });
        plot.set({ series, marks, hlines: [{ y: V.hst, label: 'static head' }] });
      }

      let sol = solve(), cur = current(sol), a1 = 0, a2 = 0;
      const ph = {};
      const adv = (key, q, dt) => { ph[key] = (ph[key] || 0) + dt * 110 * q / PUMP.Qb; return ph[key]; };
      const loop = kit.loop((dt) => {
        if (dirty) { sol = solve(); cur = current(sol); show(sol, cur); dirty = false; }
        const s = sol, o = cur, C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 250);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 250 * k) / 2); c.scale(k, k);
        basin(c, 20, 110, 100, 232, 120, C);
        basin(c, 650, 740, 30, 130, 58, C);
        lbl(kit, c, 'lift ' + V.hst + ' m', 695, 146, { size: 12, color: C.muted });
        const suc = S.col('suction'), pre = S.col('pressure');
        const run1 = o.q1 > 1e-7, run2 = o.on2 && o.q2 > 1e-7;
        a1 += dt * (o.none && V.mode !== 'par' ? 1 : 3.5); if (o.on2) a2 += dt * 3.5 * s.r2;
        if (V.mode === 'ser') {
          const lA = [[90, 200], [230, 200]], lAB = [[260, 169], [260, 140], [360, 140], [360, 200], [400, 200]], lB = [[430, 169], [430, 95], [680, 95]];
          pipe(c, lA, C); pipe(c, lAB, C); pipe(c, lB, C);
          if (o.Q > 1e-7) {
            S.flow(c, lA, adv('sa', o.Q, dt), { color: suc }); S.flow(c, lAB, adv('sab', o.Q, dt), { color: pre }); S.flow(c, lB, adv('sb', o.Q, dt), { color: pre });
          }
          pumpIcon(c, 250, 200, 20, a1, C); pumpIcon(c, 420, 200, 20, a2, C, o.h2 < 0 ? { vane: C.warn } : null);
          checkIcon(c, 560, 95, o.Q > 1e-7, C);
          lbl(kit, c, 'pump 1', 250, 234, { size: 12, color: C.text }); lbl(kit, c, 'pump 2', 420, 234, { size: 12, color: C.text });
          lbl(kit, c, 'head ' + o.h1.toFixed(1) + ' m', 310, 128, { size: 11, color: C.muted });
          lbl(kit, c, 'head ' + (o.h1 + o.h2).toFixed(1) + ' m', 480, 80, { size: 11, color: C.muted });
        } else {
          const lS = [[90, 200], [200, 200]], lA = [[200, 200], [200, 110], [280, 110]], lB = [[200, 200], [280, 200]];
          const dA = [[310, 79], [310, 60], [480, 60], [480, 95]], dB = [[310, 169], [310, 150], [480, 150], [480, 95]], dH = [[480, 95], [680, 95]];
          const on2 = V.mode === 'par';
          pipe(c, lS, C); pipe(c, lA, C); pipe(c, dA, C); pipe(c, lB, C, 7, !on2); pipe(c, dB, C, 7, !on2); pipe(c, dH, C);
          if (o.Q > 1e-7) { S.flow(c, lS, adv('s', o.Q, dt), { color: suc }); S.flow(c, dH, adv('h', o.Q, dt), { color: pre }); }
          if (run1) { S.flow(c, lA, adv('a', o.q1, dt), { color: suc }); S.flow(c, dA, adv('da', o.q1, dt), { color: pre }); }
          if (run2) { S.flow(c, lB, adv('b', o.q2, dt), { color: suc }); S.flow(c, dB, adv('db', o.q2, dt), { color: pre }); }
          c.fillStyle = C.text; c.beginPath(); c.arc(200, 200, 3.2, 0, 7); c.fill(); c.beginPath(); c.arc(480, 95, 3.2, 0, 7); c.fill();
          pumpIcon(c, 300, 110, 20, a1, C);
          pumpIcon(c, 300, 200, 20, a2, C, on2 ? (run2 ? null : { vane: C.bad }) : { color: C.faint });
          checkIcon(c, 400, 60, run1, C); checkIcon(c, 400, 150, run2, C);
          lbl(kit, c, 'pump 1: ' + M3H(o.q1).toFixed(0) + ' m³/h', 330, 124, { size: 11, color: C.muted, align: 'left' });
          lbl(kit, c, on2 ? 'pump 2: ' + M3H(o.q2).toFixed(0) + ' m³/h' : 'pump 2: standby', 330, 214, { size: 11, color: on2 && !run2 ? C.bad : C.muted, align: 'left' });
          lbl(kit, c, 'common head ' + o.H.toFixed(1) + ' m', 580, 115, { size: 11, color: C.muted });
        }
        let msg = '', col = C.muted;
        if (o.none) { msg = 'The pumps cannot reach the tank: the lift is above their shut-off head'; col = C.bad; }
        else if (V.mode === 'par' && o.q2 < 1e-7) { msg = 'Pump 2 is dead-headed: its check valve is shut and it churns'; col = C.bad; }
        else if (V.mode === 'ser' && o.h2 < 0) { msg = 'Pump 2 is past its run-out: it only resists the flow'; col = C.warn; }
        else msg = M3H(o.Q).toFixed(0) + ' m³/h delivered at ' + o.H.toFixed(1) + ' m';
        lbl(kit, c, msg, 740, 244, { align: 'right', size: 12, weight: 700, color: col });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-npsh */
  // water: vapour pressure (Antoine, Pa), density (Thiesen), viscosity (Vogel), T in °C
  const pvWater = T => 133.322 * Math.pow(10, 8.07131 - 1730.63 / (233.426 + T));
  const rhoWater = T => 1000 * (1 - (T + 288.9414) / (508929.2 * (T + 68.12963)) * (T - 3.9863) * (T - 3.9863));
  const muWater = T => 2.414e-5 * Math.pow(10, 247.8 / (T + 133.15));

  Hyper.sim('pump-npsh', {
    title: 'NPSH and cavitation at the pump inlet',
    blurb: `A pump draws water from a sump through a strainer, a foot valve and a suction pipe. Everything that decides cavitation is on the sliders: the height of the water surface relative to the pump, the water temperature (its vapour pressure), the altitude (the air pressure), the flow and the pipe size. The bars on the right add up the NPSH available term by term and compare it with the NPSH the pump requires (NPSH3) and with the higher value at which the first bubbles appear.

**Try this**
- Lower the water surface step by step: bubbles appear at the vanes well before NPSHa reaches NPSHr; below NPSHr the head collapses.
- Heat the water: at 60 °C the vapour pressure takes 2 m, at 80 °C 5 m — a suction lift becomes impossible. Raise the water above the pump (a flooded suction) to cure it.
- Move the site to 2000 m: the air pushes 2.2 m less.
- Raise the flow: NPSHr climbs while NPSHa falls with the suction losses — find the largest flow before cavitation on the graph.
- Choose DN 80, or block the strainer: the suction losses eat the margin.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 10px'; box.stage.appendChild(d1);
      const z0 = params && Number.isFinite(params.z) ? clamp(params.z, -8, 5) : -3;
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Water surface above the pump centreline', min: -8, max: 5, step: 0.1, value: z0, unit: 'm' },
        { id: 'T', label: 'Water temperature', min: 5, max: 99, step: 1, value: 20, unit: '°C' },
        { id: 'alt', label: 'Altitude of the site', min: 0, max: 4000, step: 50, value: 0, unit: 'm' },
        { id: 'Q', label: 'Flow', min: 20, max: 180, step: 1, value: 100, unit: 'm³/h' },
        { id: 'D', type: 'select', label: 'Suction pipe', options: [['DN 150', 0.15], ['DN 125', 0.125], ['DN 100', 0.1], ['DN 80', 0.08]], value: 0.125 },
        { id: 'clog', type: 'check', label: 'Strainer half blocked', value: false }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pa', 'Air pressure (absolute)'], ['pv', 'Vapour pressure; density'], ['hl', 'Suction losses (pipe velocity)'], ['a', 'NPSH available'], ['r', 'NPSH required (NPSH3)'], ['m', 'Margin (ratio)'], ['s', 'State of the pump']]);
      const plot = kit.plot(d1, { x: { label: 'flow Q (m³/h)', min: 0, max: 200 }, y: { label: 'NPSH (m)' }, legend: true }, 190);

      function budget(Q) {
        const T = V.T, rho = rhoWater(T), pv = pvWater(T), pa = F.isa(V.alt).p, D = V.D;
        const A = Math.PI * D * D / 4, v = Q / A;
        const L = 5 + Math.max(0, -V.z);                                // a run to the pump plus the drop into the sump
        const K = 2.5 * (V.clog ? 5 : 1) + 2 * 0.3 + 0.2;               // foot valve and strainer, two bends, a gate valve
        const Re = v * D * rho / muWater(T);
        const f = Re > 1 ? fin(F.friction(Re, 0.045e-3 / D)) : 0;
        const hL = (f * L / D + K) * v * v / (2 * G);
        const hatm = pa / (rho * G), hvap = pv / (rho * G);
        return { rho, pv, pa, v, hL, hatm, hvap, a: hatm - hvap + V.z - hL, pin: pa + rho * G * (V.z - hL) - 0.5 * rho * v * v };
      }
      function state(a, r) {
        const m = a - r, inc = 2.2 * r;
        const drop = m >= 0 ? 3 * Math.exp(-m / 0.4) : 3 + 60 * (1 - Math.exp(m / 0.5));
        const inten = clamp((inc - a) / (inc - 0.5 * r), 0, 1.5);
        let txt, lvl;
        if (a >= inc) { txt = 'no cavitation'; lvl = 0; }
        else if (a >= 1.3 * r) { txt = 'incipient: a few bubbles at the vanes'; lvl = 1; }
        else if (a >= r) { txt = 'developed cavitation: noise, erosion in time'; lvl = 2; }
        else if (a >= 0.6 * r) { txt = 'heavy cavitation: head falling fast'; lvl = 3; }
        else { txt = 'breakdown: the pump has lost most of its head'; lvl = 4; }
        return { m, drop: m > 2.5 ? 0 : drop, inten, txt, lvl, inc };
      }
      let B, NR, ST;                                   // the NPSH budget, NPSH required, the state of the pump
      function update() {
        const Q = V.Q / 3600;
        B = budget(Q); NR = pNPSHr(Q, 1); ST = state(B.a, NR);
        const C = kit.colors();
        ro.set('pa', (B.pa / 1000).toFixed(1) + ' kPa = ' + B.hatm.toFixed(2) + ' m');
        ro.set('pv', (B.pv / 1000).toFixed(2) + ' kPa = ' + B.hvap.toFixed(2) + ' m; ' + B.rho.toFixed(0) + ' kg/m³');
        ro.set('hl', B.hL.toFixed(2) + ' m (' + B.v.toFixed(2) + ' m/s)');
        ro.set('a', B.a.toFixed(2) + ' m');
        ro.set('r', NR.toFixed(2) + ' m; bubbles begin near ' + ST.inc.toFixed(1) + ' m');
        ro.set('m', ST.m.toFixed(2).replace('-', '−') + ' m' + (B.a > 0 ? ' (' + (B.a / NR).toFixed(2) + ')' : ''));
        ro.set('s', ST.txt + (ST.drop > 0.05 ? '; head −' + ST.drop.toFixed(1) + ' %' : ''));
        const av = [], rq = [], inc = [];
        let lim = null, prev = null;
        for (let i = 0; i <= 60; i++) {
          const q = (5 + 195 * i / 60) / 3600, b = budget(q), r = pNPSHr(q, 1);
          av.push([M3H(q), b.a]); rq.push([M3H(q), r]); inc.push([M3H(q), 2.2 * r]);
          const d = b.a - r;
          if (prev && prev[1] > 0 && d <= 0 && lim == null) lim = prev[0] + (M3H(q) - prev[0]) * prev[1] / (prev[1] - d);
          prev = [M3H(q), d];
        }
        const marks = [{ x: V.Q, y: B.a, label: '' }];
        if (lim != null) marks.push({ x: lim, y: pNPSHr(lim / 3600, 1), label: 'cavitation limit', color: C.bad });
        plot.set({ series: [{ pts: av, label: 'NPSH available', color: C.accent }, { pts: rq, label: 'NPSH required (NPSH3)', color: C.bad }, { pts: inc, label: 'first bubbles (≈ 2.2 × NPSH3)', color: C.warn, dash: [4, 4], width: 1.4 }], marks, vlines: [{ x: V.Q, label: 'duty' }] });
      }

      const bub = [], flash = [];
      let ang = 0, ph = 0, noise = 0;
      const loop = kit.loop((dt) => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 350);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 350 * k) / 2); c.scale(k, k);
        const yp = 150, sc = 19, yw = yp - V.z * sc;
        basin(c, 30, 210, 30, 330, yw, C);
        // centreline
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(30, yp); c.lineTo(470, yp); c.stroke(); c.restore();
        lbl(kit, c, 'pump centreline', 40, yp - 10, { align: 'left', size: 11, color: C.muted });
        lbl(kit, c, (V.z >= 0 ? '+' : '−') + Math.abs(V.z).toFixed(1) + ' m', 200, yw + (V.z >= 0 ? 12 : -10), { align: 'right', size: 12, weight: 700, color: V.z >= 0 ? C.ok : C.warn });
        // suction pipe with foot valve and strainer
        const suc = [[150, 312], [150, yp], [322, yp]];
        pipe(c, suc, C, 9);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(138, 312, 24, 14); c.strokeRect(138, 312, 24, 14);
        c.strokeStyle = V.clog ? C.bad : C.muted; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(141 + i * 4.5, 314); c.lineTo(141 + i * 4.5, 324); c.stroke(); }
        ph += dt * 90 * V.Q / 100;
        kit.fsym.flow(c, suc, ph, { color: kit.fsym.col('suction'), r: 2.2 });
        // discharge
        const dis = [[379, 91], [379, 40], [470, 40]];
        pipe(c, dis, C, 8);
        kit.fsym.flow(c, dis, ph, { color: kit.fsym.col('pressure'), r: 2.2 });
        lbl(kit, c, 'to the system', 468, 24, { align: 'right', size: 11, color: C.muted });
        // the pump, large, with bubbles in the eye
        const px = 360, R = 38;
        ang += dt * 2.2;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(px + 4, yp - 59, 30, 40); c.strokeRect(px + 4, yp - 59, 30, 40);
        c.beginPath(); c.arc(px, yp, R, 0, 7); c.fill(); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
          const a = ang + i * 2 * Math.PI / 7;
          c.beginPath(); c.moveTo(px + 0.3 * R * Math.cos(a), yp - 0.3 * R * Math.sin(a));
          c.quadraticCurveTo(px + 0.6 * R * Math.cos(a - 0.3), yp - 0.6 * R * Math.sin(a - 0.3), px + 0.85 * R * Math.cos(a - 0.85), yp - 0.85 * R * Math.sin(a - 0.85));
          c.stroke();
        }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.arc(px, yp, 0.3 * R, 0, 7); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8; c.fillRect(410, yp - 12, 48, 24); c.strokeRect(410, yp - 12, 48, 24);
        c.beginPath(); c.moveTo(px + R, yp); c.lineTo(410, yp); c.stroke();
        lbl(kit, c, 'M', 434, yp, { size: 12, weight: 700, color: C.text });
        // bubbles: born at the vane leading edges, swept outward, collapsing where the pressure rises
        const born = ST ? ST.inten * 70 * dt : 0, nBorn = Math.floor(born) + (Math.random() < born - Math.floor(born) ? 1 : 0);
        for (let i = 0; i < nBorn && bub.length < 160; i++) bub.push({ r: 0.28 + 0.08 * Math.random(), a: Math.random() * 2 * Math.PI, s: 1.2 + 1.8 * Math.random() });
        for (let i = bub.length - 1; i >= 0; i--) {
          const b = bub[i];
          b.r += dt * 0.45; b.a += dt * 2.2;
          if (b.r > 0.5) b.s -= dt * 9;
          if (b.s <= 0.3 || b.r > 0.85) { flash.push({ x: px + b.r * R * Math.cos(b.a), y: yp - b.r * R * Math.sin(b.a), t: 0.12 }); bub.splice(i, 1); continue; }
          c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.arc(px + b.r * R * Math.cos(b.a), yp - b.r * R * Math.sin(b.a), b.s, 0, 7); c.stroke();
        }
        for (let i = flash.length - 1; i >= 0; i--) {
          const f = flash[i]; f.t -= dt;
          if (f.t <= 0) { flash.splice(i, 1); continue; }
          c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath();
          for (let j = 0; j < 4; j++) { const a = j * Math.PI / 4; c.moveTo(f.x - 3 * Math.cos(a), f.y - 3 * Math.sin(a)); c.lineTo(f.x + 3 * Math.cos(a), f.y + 3 * Math.sin(a)); }
          c.stroke();
        }
        noise += dt;
        if (ST && ST.lvl >= 2 && Math.sin(noise * 23) > 0) lbl(kit, c, 'crackle…', px, yp + R + 16, { size: 12, weight: 700, color: C.warn });
        if (B) lbl(kit, c, 'inlet ' + (B.pin / 1000).toFixed(1) + ' kPa abs', 240, yp + 18, { size: 11, color: C.muted });
        // the NPSH budget as a waterfall
        if (B) {
          const x0 = 486, y0 = 290, s = 14, bw = 34, gap = 9, Y = h => y0 - clamp(h, -3, 17) * s;
          const bars = [
            { lab: 'air', from: 0, to: B.hatm, col: C.hue(205) },
            { lab: 'vapour', from: B.hatm, to: B.hatm - B.hvap, col: C.bad },
            { lab: 'height', from: B.hatm - B.hvap, to: B.hatm - B.hvap + V.z, col: V.z >= 0 ? C.ok : C.bad },
            { lab: 'losses', from: B.hatm - B.hvap + V.z, to: B.a, col: C.bad },
            { lab: 'NPSHa', from: 0, to: B.a, col: C.accent }
          ];
          lbl(kit, c, 'NPSH budget (m of water)', x0 + 110, 22, { size: 12, weight: 700, color: C.text });
          c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0 - 6, y0); c.lineTo(x0 + 5 * (bw + gap), y0); c.stroke();
          bars.forEach((b, i) => {
            const x = x0 + i * (bw + gap), ya = Y(b.from), yb = Y(b.to);
            c.fillStyle = b.col; c.globalAlpha = 0.75; c.fillRect(x, Math.min(ya, yb), bw, Math.max(1, Math.abs(yb - ya))); c.globalAlpha = 1;
            if (i < 4) { c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(x + bw, yb); c.lineTo(x + bw + gap, yb); c.stroke(); c.setLineDash([]); }
            lbl(kit, c, b.lab, x + bw / 2, y0 + 30, { size: 11, color: C.muted });
            const dv = b.to - b.from;
            lbl(kit, c, (i === 0 || i === 4 ? '' : dv >= 0 ? '+' : '−') + Math.abs(i === 4 ? b.to : dv).toFixed(1), x + bw / 2, Math.min(ya, yb) - 9, { size: 11, weight: 700, color: C.text });
          });
          const xe = x0 + 5 * (bw + gap);
          c.setLineDash([6, 4]); c.lineWidth = 1.6;
          c.strokeStyle = C.bad; c.beginPath(); c.moveTo(x0 - 6, Y(NR)); c.lineTo(xe, Y(NR)); c.stroke();
          c.strokeStyle = C.warn; c.beginPath(); c.moveTo(x0 - 6, Y(ST.inc)); c.lineTo(xe, Y(ST.inc)); c.stroke();
          c.setLineDash([]);
          lbl(kit, c, 'NPSHr ' + NR.toFixed(1), xe + 3, Y(NR), { align: 'left', size: 11, color: C.bad, weight: 700 });
          lbl(kit, c, 'bubbles', xe + 3, Y(ST.inc), { align: 'left', size: 11, color: C.warn });
          lbl(kit, c, ST.txt + (ST.drop > 0.05 ? ', head −' + ST.drop.toFixed(0) + ' %' : ''), x0 + 110, 340, { size: 12, weight: 700, color: ST.lvl === 0 ? C.ok : ST.lvl <= 1 ? C.warn : C.bad });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-triangles */
  Hyper.sim('pump-triangles', {
    title: 'Impeller and velocity triangles',
    blurb: `An impeller seen along its shaft, turning anticlockwise, with the velocity triangles at the outlet (the vane tips) and at the inlet (the eye), drawn to one scale. **u** is the vane speed, **w** the velocity of the liquid relative to the vane, **c = u + w** its absolute velocity; the swirl $c_u$ sets the head by Euler's equation $H = u_2 c_{u2}/g$. The graph shows the Euler head for perfect guidance, with slip, and an estimate of the real head after friction and inlet shock.

**Try this**
- Raise the flow: the radial velocity $c_{m2}$ grows, $w_2$ tilts back, the swirl and the head fall — the falling pump curve in the making.
- Swing the vane angle $\\beta_2$ from 25° through 90° (radial vanes: a flat Euler line) to 130° (forward-curved: the head *rises* with flow — unstable; used in fans, not pumps).
- Turn slip off and on, and try 3 vanes and 12: with few vanes the liquid lags behind them and the swirl, and the head, drop.
- Double the speed: every velocity doubles and the head quadruples; at double the flow the triangles keep their shape.
- Find the flow at which the inlet flow angle matches the 16° vanes: the shock loss vanishes and the real head comes closest to the Euler line.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 10px'; box.stage.appendChild(d1);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Speed', min: 500, max: 3000, step: 10, value: 1450, unit: 'rpm' },
        { id: 'D2', label: 'Impeller diameter D₂', min: 150, max: 400, step: 5, value: 250, unit: 'mm' },
        { id: 'b2', label: 'Outlet width b₂', min: 8, max: 40, step: 1, value: 20, unit: 'mm' },
        { id: 'beta', label: 'Vane outlet angle β₂ (to the tangent)', min: 15, max: 150, step: 1, value: 25, unit: '°' },
        { id: 'z', label: 'Number of vanes', min: 3, max: 12, step: 1, value: 7 },
        { id: 'Q', label: 'Flow', min: 0, max: 250, step: 1, value: 100, unit: 'm³/h' },
        { id: 'slip', type: 'check', label: 'Slip (a finite number of vanes)', value: true }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['u', 'Tip speed u₂; radial velocity c_m2'], ['cu', 'Outlet swirl c_u2 (slip factor)'], ['he', 'Euler head: ideal / with slip'], ['h', 'Estimated real head'], ['a', 'Flow angles at the outlet: α₂, β₂'], ['in', 'Inlet: u₁, c₁; flow angle (vanes at 16°)'], ['p', 'Power to the liquid ρgQH']]);
      const plot = kit.plot(d1, { x: { label: 'flow Q (m³/h)', min: 0, max: 250 }, y: { label: 'head (m)', min: 0 }, legend: true }, 190);
      const BE1 = 16 * Math.PI / 180, BLOCK = 0.92;
      function calc(Q) {
        const n = V.n / 60, D2 = V.D2 / 1000, b2 = V.b2 / 1000, D1 = 0.45 * D2, b1 = Math.min(1.6 * b2, 0.35 * D1);
        const be2 = V.beta * Math.PI / 180, cot2 = Math.cos(be2) / Math.sin(be2);
        const u2 = Math.PI * D2 * n, u1 = Math.PI * D1 * n;
        const A2 = Math.PI * D2 * b2 * BLOCK, A1 = Math.PI * D1 * b1 * BLOCK;
        const cm2 = Q / A2, cm1 = Q / A1;
        const sig = V.slip ? 1 - Math.sqrt(Math.sin(be2)) / Math.pow(V.z, 0.7) : 1;
        const cuInf = u2 - cm2 * cot2, cu = sig * u2 - cm2 * cot2;
        const HeInf = u2 * cuInf / G, He = u2 * cu / G;
        const Qsf = A1 * u1 * Math.tan(BE1);                                 // the flow that meets the 16° vanes head-on
        const HeSf = u2 * (sig * u2 - Qsf / A2 * cot2) / G;
        const hFr = 0.12 * Math.max(HeSf, 0) * (Qsf > 0 ? (Q / Qsf) * (Q / Qsf) : 0);
        const dwu = u1 - cm1 / Math.tan(BE1);
        const hSh = 0.5 * dwu * dwu / (2 * G);
        return { u2, u1, cm2, cm1, cuInf, cu, sig, HeInf, He, H: He - hFr - hSh, Qsf, be1f: Math.atan2(cm1, u1), be2f: Math.atan2(cm2, u2 - cu), a2: Math.atan2(cm2, cu) };
      }
      let K;
      function update() {
        const C = kit.colors(), Q = V.Q / 3600;
        K = calc(Q);
        const deg = a => (a * 180 / Math.PI).toFixed(1) + '°';
        ro.set('u', K.u2.toFixed(2) + ' m/s; ' + K.cm2.toFixed(2) + ' m/s');
        ro.set('cu', K.cu.toFixed(2) + ' m/s (σ = ' + K.sig.toFixed(3) + ')');
        ro.set('he', K.HeInf.toFixed(1) + ' m / ' + K.He.toFixed(1) + ' m');
        ro.set('h', K.H.toFixed(1) + ' m' + (K.He > 0.5 ? ' (' + (K.H / K.He * 100).toFixed(0) + ' % of the Euler head)' : ''));
        ro.set('a', deg(K.a2) + ', ' + deg(K.be2f));
        ro.set('in', K.u1.toFixed(2) + ' m/s, ' + K.cm1.toFixed(2) + ' m/s; ' + deg(K.be1f) + (Math.abs(K.be1f - BE1) < 0.02 ? ' — shock-free' : ''));
        ro.set('p', kWtxt(RHO * G * Q * Math.max(0, K.H)));
        const inf = [], sl = [], re = [];
        for (let i = 0; i <= 50; i++) {
          const q = 250 / 3600 * i / 50, r = calc(q);
          inf.push([M3H(q), r.HeInf]); if (V.slip) sl.push([M3H(q), r.He]); re.push([M3H(q), r.H]);
        }
        const series = [{ pts: inf.filter(p => p[1] >= 0), label: 'Euler head, perfect guidance', color: C.muted, dash: [5, 4] }];
        if (V.slip) series.push({ pts: sl.filter(p => p[1] >= 0), label: 'Euler head with slip', color: C.accent });
        series.push({ pts: re.filter(p => p[1] >= 0), label: 'estimated real head', color: C.ok });
        plot.set({ series, marks: [{ x: V.Q, y: Math.max(0, K.H), label: 'now' }], vlines: K.Qsf < 250 / 3600 ? [{ x: M3H(K.Qsf), label: 'shock-free inlet' }] : [] });
      }
      let phi0 = 0;
      const loop = kit.loop((dt) => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 380);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 380 * k) / 2); c.scale(k, k);
        // impeller: vanes whose angle to the tangent runs from 16° at the eye to β₂ at the rim
        const cx = 190, cy = 190, R2 = 150, R1 = 0.45 * R2, be2 = V.beta * Math.PI / 180;
        phi0 += dt * V.n / 60 * 0.25;
        c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R2, 0, 7); c.fill(); c.stroke();
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R1, 0, 7); c.stroke(); c.setLineDash([]);
        const prof = [], N = 30; let th = 0;
        for (let i = 0; i <= N; i++) {
          const rr = R1 + (R2 - R1) * i / N;
          if (i > 0) { const rm = rr - (R2 - R1) / N / 2, bm = BE1 + (be2 - BE1) * (rm - R1) / (R2 - R1); th += Math.cos(bm) / Math.sin(bm) * ((R2 - R1) / N) / rm; }
          prof.push([rr, th]);
        }
        c.strokeStyle = C.accent; c.lineWidth = 3.2; c.lineCap = 'round';
        for (let v = 0; v < V.z; v++) {
          const base = phi0 + v * 2 * Math.PI / V.z;
          c.beginPath();
          prof.forEach((p, i) => { const a = base - p[1], x = cx + p[0] * Math.cos(a), y = cy - p[0] * Math.sin(a); if (i) c.lineTo(x, y); else c.moveTo(x, y); });
          c.stroke();
        }
        c.lineCap = 'butt';
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 10, 0, 7); c.fill();
        // direction of rotation
        c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy, R2 + 14, -0.35, -1.0, true); c.stroke();
        kit.arrow(c, cx + (R2 + 14) * Math.cos(-0.95), cy + (R2 + 14) * Math.sin(-0.95), cx + (R2 + 14) * Math.cos(-1.05), cy + (R2 + 14) * Math.sin(-1.05), C.muted, 1.6);
        lbl(kit, c, 'ω', cx + (R2 + 30) * Math.cos(-0.7), cy + (R2 + 30) * Math.sin(-0.7), { size: 13, weight: 700, color: C.muted });
        lbl(kit, c, V.z + ' vanes, β₂ = ' + V.beta + '°' + (V.beta > 92 ? ' (forward-curved)' : V.beta >= 88 ? ' (radial)' : ' (backward-curved)'), cx, 372, { size: 12, color: C.text });
        // velocity triangles, one scale for both
        const s = Math.min(240 / Math.max(K.u2, Math.abs(K.cu), K.u1, 1e-6), 1e4);
        const tri = (ox, oy, u, cu, cm, bladeAng, title, sub) => {
          const U = [ox + s * u, oy], Cp = [ox + s * cu, oy - s * cm];
          lbl(kit, c, title, ox, oy - 118, { align: 'left', size: 12, weight: 700, color: C.text });
          lbl(kit, c, sub, ox, oy - 100, { align: 'left', size: 11, color: C.muted });
          c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.lineWidth = 1;
          c.beginPath(); c.moveTo(Cp[0], Cp[1]); c.lineTo(Cp[0], oy); c.stroke();
          c.beginPath(); c.moveTo(U[0], U[1]); c.lineTo(U[0] - 70 * Math.cos(bladeAng), U[1] - 70 * Math.sin(bladeAng)); c.strokeStyle = C.muted; c.stroke();
          c.restore();
          if (s * u > 1) kit.arrow(c, ox, oy, U[0], U[1], C.muted, 2.5);
          if (Math.hypot(Cp[0] - U[0], Cp[1] - U[1]) > 1) kit.arrow(c, U[0], U[1], Cp[0], Cp[1], C.series[1], 2.8);
          if (Math.hypot(Cp[0] - ox, Cp[1] - oy) > 1) kit.arrow(c, ox, oy, Cp[0], Cp[1], C.accent, 2.8);
          lbl(kit, c, 'u', (ox + U[0]) / 2, oy + 12, { size: 12, weight: 700, color: C.muted });
          lbl(kit, c, 'c', (ox + Cp[0]) / 2 - 8, (oy + Cp[1]) / 2 - 8, { size: 12, weight: 700, color: C.accent });
          lbl(kit, c, 'w', (U[0] + Cp[0]) / 2 + 10, (U[1] + Cp[1]) / 2 - 6, { size: 12, weight: 700, color: C.series[1] });
          lbl(kit, c, 'vane', Math.min(735, U[0] - 74 * Math.cos(bladeAng)), U[1] - 74 * Math.sin(bladeAng) - 6, { size: 10, color: C.muted });
        };
        tri(470, 175, K.u2, K.cu, K.cm2, be2, 'Outlet (vane tips)', 'c_u2 = ' + K.cu.toFixed(1) + ' m/s,  c_m2 = ' + K.cm2.toFixed(2) + ' m/s');
        tri(470, 335, K.u1, 0, K.cm1, BE1, 'Inlet (eye), no pre-swirl', 'flow meets the vanes at ' + (K.be1f * 180 / Math.PI).toFixed(1) + '° (vanes 16°)');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-nq */
  Hyper.sim('pump-nq', {
    title: 'Specific speed and the shape of an impeller',
    blurb: `Set a duty — speed, flow and head per stage — and see its specific speed $n_q = n\\sqrt{Q}/H^{3/4}$ and the impeller it calls for, from a narrow radial disc to a propeller: on the left in section (the shaft along the middle, liquid entering from the left), on the right seen along the shaft. The graph shows the typical shape of the curves for that $n_q$ as fractions of the best-point values.

**Try this**
- Start with the building pump ($n_q$ ≈ 18): a flat head curve and power rising with flow — it is started against a closed valve.
- Step through the presets to the flood-control propeller ($n_q$ ≈ 350): a steep head curve, and power highest at shut-off — it is started with the valve open.
- Double the speed of any duty: $n_q$ doubles and the impeller becomes smaller and wider — how designers shrink pumps.
- Split a large head into stages (divide the head): the specific speed per stage rises out of the inefficient range.
- Watch the best efficiency: poor at very low $n_q$ and for small flows, best around 40–60.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 10px'; box.stage.appendChild(d1);
      let dirty = true;
      const PRE = { feed: [2900, 60, 150], bld: [1450, 100, 32], mix: [980, 1500, 12], prop: [490, 15000, 4] };
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Speed', min: 300, max: 3600, step: 10, value: 1450, unit: 'rpm' },
        { id: 'Q', label: 'Flow (per impeller eye)', min: 2, max: 20000, value: 100, unit: 'm³/h', log: true, sig: 3 },
        { id: 'H', label: 'Head per stage', min: 1, max: 300, value: 32, unit: 'm', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'feed', label: 'Boiler-feed stage' }, { id: 'bld', label: 'Building pump' }, { id: 'mix', label: 'Irrigation, mixed flow' }, { id: 'prop', label: 'Flood-control propeller' }] }
      ], (id) => {
        if (PRE[id]) { ctl.set('n', PRE[id][0]); ctl.set('Q', PRE[id][1]); ctl.set('H', PRE[id][2]); }
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nq', 'Specific speed n_q'], ['t', 'Impeller type'], ['us', 'US N_s; dimensionless ω_s'], ['eta', 'Typical best efficiency'], ['h0', 'Shut-off head ÷ BEP head'], ['p0', 'Shut-off power ÷ BEP power']]);
      const plot = kit.plot(d1, { x: { label: 'flow ÷ BEP flow', min: 0, max: 1.5 }, y: { label: 'ratio to the BEP value', min: 0, max: 3.2 }, legend: true }, 190);
      let nq = 18, s = 0.2, shape = {};
      const typeOf = q => q < 10 ? 'radial, very narrow (consider more stages or a displacement pump)' : q < 25 ? 'radial, narrow' : q < 50 ? 'radial, wide' : q < 100 ? 'mixed flow (Francis-type)' : q < 160 ? 'mixed flow (diagonal)' : 'axial (propeller)';
      function update() {
        const C = kit.colors(), Q = V.Q / 3600;
        nq = V.n * Math.sqrt(Q) / Math.pow(V.H, 0.75);
        s = clamp(Math.log(nq / 10) / Math.log(30), 0, 1);
        const p = 2 - 0.5 * s * s, p0 = 0.45 + 1.65 * s * s * s, h0 = 1 + p0 / p;
        const eb = clamp(0.92 - 0.2 * Math.pow(Math.log10(nq / 50), 2) - 0.06 * Math.max(0, -Math.log10(Q)), 0.3, 0.93);
        shape = { p, p0, h0, eb };
        ro.set('nq', nq.toFixed(1));
        ro.set('t', typeOf(nq));
        ro.set('us', (51.6 * nq).toFixed(0) + '; ' + (nq / 52.9).toFixed(3));
        ro.set('eta', (eb * 100).toFixed(0) + ' %');
        ro.set('h0', h0.toFixed(2));
        ro.set('p0', p0.toFixed(2) + (p0 > 1 ? ' — start with the valve open' : ' — start against a closed valve'));
        const hh = [], pp = [], ee = [];
        for (let i = 0; i <= 60; i++) {
          const x = 1.5 * i / 60, h = Math.max(0, h0 - (h0 - 1) * Math.pow(x, p)), pw = p0 + (1 - p0) * x;
          hh.push([x, h]); pp.push([x, pw]); ee.push([x, pw > 0 ? Math.max(0, x * h / pw) : 0]);
        }
        plot.set({ series: [{ pts: hh, label: 'head H/H_b', color: C.accent }, { pts: pp.filter(q => q[1] >= 0), label: 'power P/P_b', color: C.bad }, { pts: ee, label: 'efficiency η/η_b', color: C.ok }], marks: [{ x: 0, y: h0, label: 'shut-off head' }, { x: 0, y: p0, label: 'shut-off power', color: C.bad }], vlines: [{ x: 1, label: 'BEP' }] });
      }
      let ang = 0;
      const loop = kit.loop((dt) => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 320);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 320 * k) / 2); c.scale(k, k);
        // meridional section: shroud and hub from the eye to the outlet, mirrored about the shaft
        const ay = 168, r2 = 112, rEye = 34 + 78 * Math.pow(s, 0.8), rHi = 10 + 37 * s, xIn = 70;
        const xS = 170 + 110 * s, b2 = 14 + 26 * s, xH = xS + b2 * (1 - s), rH = r2 - (r2 - 47) * s;
        const bez = (p0, p1, p2, t) => [(1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]];
        const shroud = t => bez([xIn, rEye], [xS, rEye], [xS, r2], t), hub = t => bez([xIn, rHi], [xH, rHi], [xH, rH], t);
        lbl(kit, c, 'section through the impeller', 200, 14, { size: 12, weight: 700, color: C.text });
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([8, 4]); c.beginPath(); c.moveTo(20, ay); c.lineTo(380, ay); c.stroke(); c.setLineDash([]);
        for (const sg of [1, -1]) {
          const P = pt => [pt[0], ay - sg * pt[1]];
          const blade = [];
          for (let i = 0; i <= 20; i++) blade.push(P(shroud(0.25 + 0.75 * i / 20)));
          for (let i = 20; i >= 0; i--) blade.push(P(hub(0.4 + 0.6 * i / 20)));
          c.fillStyle = C.hue(265, C.dark ? 0.35 : 0.25); poly(c, blade); c.closePath(); c.fill();
          c.strokeStyle = C.text; c.lineWidth = 2.2;
          const sp = [], hp = [];
          for (let i = 0; i <= 30; i++) { sp.push(P(shroud(i / 30))); hp.push(P(hub(i / 30))); }
          poly(c, sp); c.stroke(); poly(c, hp); c.stroke();
          // hub body back to the shaft (and its nose, as the hub grows), and the casing: a volute for radial and mixed flow, a tube for axial
          poly(c, [P([xH, rH]), P([xH + 8, rH * 0.6]), P([xH + 20, 8])]); c.stroke();
          if (s > 0.3) { const a0 = P([xIn, rHi]), a1 = P([xIn - 22 * s, rHi]), a2 = P([xIn - 22 * s, 0]); c.beginPath(); c.moveTo(a0[0], a0[1]); c.quadraticCurveTo(a1[0], a1[1], a2[0], a2[1]); c.stroke(); }
          c.strokeStyle = C.muted; c.lineWidth = 1.6;
          if (s < 0.75) { const vx = (xS + xH) / 2 + 6 * s, vr = r2 + 18 - 6 * s; c.beginPath(); c.arc(vx, ay - sg * vr, 16 - 7 * s, 0, 7); c.stroke(); }
          else { poly(c, [P([40, r2 + 4]), P([360, r2 + 4])]); c.stroke(); }
          // flow in and out
          const mid = [(xS + xH) / 2, (r2 + rH) / 2], oa = (1 - s) * Math.PI / 2;
          const q0 = P([10, (rEye + rHi) / 2]), q1 = P([xIn - 8, (rEye + rHi) / 2]);
          kit.arrow(c, q0[0], q0[1], q1[0], q1[1], kit.fsym.col('suction'), 2);
          const m0 = P(mid), m1 = P([mid[0] + 34 * Math.cos(oa), mid[1] + 34 * Math.sin(oa)]);
          kit.arrow(c, m0[0], m0[1], m1[0], m1[1], kit.fsym.col('pressure'), 2);
        }
        c.strokeStyle = C.text; c.lineWidth = 5; c.beginPath(); c.moveTo(xH + 18, ay); c.lineTo(390, ay); c.stroke();
        // seen along the shaft
        const fx = 590, fy = 168, FR = 116;
        ang += dt * 1.2;
        lbl(kit, c, 'seen along the shaft', fx, 14, { size: 12, weight: 700, color: C.text });
        c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.bg2;
        if (s < 0.7) {
          c.beginPath(); c.arc(fx, fy, FR, 0, 7); c.fill(); c.stroke();
          const re = FR * rEye / r2, z = 7;
          c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(fx, fy, re, 0, 7); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.accent; c.lineWidth = 3;
          const wrap = 1.6 - 1.2 * s;
          for (let v = 0; v < z; v++) {
            const a0 = ang + v * 2 * Math.PI / z;
            c.beginPath();
            for (let i = 0; i <= 16; i++) { const t = i / 16, rr = re * 0.9 + (FR - re * 0.9) * t, a = a0 - wrap * Math.sqrt(t); const x = fx + rr * Math.cos(a), y = fy - rr * Math.sin(a); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
            c.stroke();
          }
        } else {
          c.beginPath(); c.arc(fx, fy, FR + 4, 0, 7); c.stroke();
          const rh = FR * rH / r2, nb = 4;
          for (let v = 0; v < nb; v++) {
            const a = ang + v * 2 * Math.PI / nb, am = (rh + FR) / 2;
            c.save(); c.translate(fx + am * Math.cos(a), fy - am * Math.sin(a)); c.rotate(-a);
            c.fillStyle = C.hue(265, C.dark ? 0.45 : 0.35); c.strokeStyle = C.accent; c.lineWidth = 2;
            c.beginPath(); c.ellipse(0, 0, (FR - rh) / 2, 20 + 20 * (1 - s), 0.35, 0, 7); c.fill(); c.stroke();
            c.restore();
          }
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(fx, fy, rh, 0, 7); c.fill(); c.stroke();
        }
        lbl(kit, c, 'n_q = ' + nq.toFixed(1) + ': ' + typeOf(nq).split(' (')[0], 390, 308, { size: 13, weight: 700, color: C.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-pelton */
  Hyper.sim('pump-pelton', {
    title: 'A Pelton wheel',
    blurb: `A jet from a nozzle at the foot of the penstock strikes the buckets of a Pelton wheel, which turn it back through about 165°. Set the head and the jet, then choose how fast the buckets move compared with the jet — on a real unit the generator's load and the grid decide that. The spray shows where the water goes after the buckets; the graph shows the efficiency and the torque against the speed ratio $u/c_1$. The wheel is drawn turning far slower than it really does.

**Try this**
- Hold the wheel still ($u/c_1$ = 0): the greatest torque, but no power — the water is thrown back at almost the jet speed.
- Find the best speed ratio: near 0.5 the water drops out of the buckets with almost nothing left.
- Let it run away ($u/c_1$ → 1): the buckets outrun the jet and the torque vanishes.
- Change the head: the jet speed follows $\\sqrt{2gH}$, and with it the wheel speed at the best ratio.
- Add jets: the flow and power multiply; the efficiency and the best speed ratio do not change.
- Swing the deflector in: the jet is thrown clear at once, so the spear valve can close slowly without water hammer.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 10px'; box.stage.appendChild(d1);
      let dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Net head', min: 50, max: 1500, step: 10, value: 500, unit: 'm' },
        { id: 'd', label: 'Jet diameter', min: 40, max: 300, step: 5, value: 150, unit: 'mm' },
        { id: 'jets', label: 'Number of jets', min: 1, max: 6, step: 1, value: 1 },
        { id: 'x', label: 'Bucket speed ÷ jet speed, u/c₁', min: 0, max: 1, step: 0.01, value: 0.47 },
        { id: 'D', label: 'Pitch diameter of the wheel', min: 0.5, max: 4, step: 0.01, value: 1.74, unit: 'm' },
        { id: 'k', label: 'Bucket friction factor k', min: 0.8, max: 1, step: 0.01, value: 0.9 },
        { id: 'defl', type: 'check', label: 'Deflector in the jet', value: false }
      ], () => { dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'Jet speed c₁; flow'], ['pj', 'Power of the water ρgQH'], ['u', 'Bucket speed; wheel speed'], ['t', 'Torque on the wheel'], ['p', 'Power; efficiency of the head'], ['ex', 'Water leaving the buckets'], ['run', 'Runaway speed (no load)']]);
      const plot = kit.plot(d1, { x: { label: 'speed ratio u/c₁', min: 0, max: 1 }, y: { label: '%', min: 0, max: 100 }, legend: true }, 180);
      const CV = 0.98, PHI = 15 * Math.PI / 180;
      let M = {};
      function update() {
        const C = kit.colors();
        const c1 = CV * Math.sqrt(2 * G * V.H), A = Math.PI * Math.pow(V.d / 1000, 2) / 4, Q = V.jets * A * c1;
        const u = V.x * c1, kc = 1 + V.k * Math.cos(PHI);
        const F = V.defl ? 0 : RHO * Q * (c1 - u) * kc, P = F * u, Ph = RHO * G * Q * V.H;
        const vex = u - V.k * (c1 - u) * Math.cos(PHI);
        M = { c1, Q, u, F, P, Ph, eta: Ph > 0 ? P / Ph : 0, T: F * V.D / 2, rpm: 60 * u / (Math.PI * V.D), vex, kc };
        ro.set('c', c1.toFixed(1) + ' m/s; ' + Q.toFixed(3) + ' m³/s');
        ro.set('pj', kWtxt(Ph));
        ro.set('u', u.toFixed(1) + ' m/s; ' + M.rpm.toFixed(0) + ' rpm');
        ro.set('t', (M.T / 1000).toFixed(1) + ' kN·m');
        ro.set('p', kWtxt(P) + '; ' + (M.eta * 100).toFixed(1) + ' %');
        ro.set('ex', V.defl ? 'the jet misses the wheel' : Math.abs(vex) < 0.06 * c1 ? 'drops out almost at rest (' + vex.toFixed(1) + ' m/s)' : (vex < 0 ? 'thrown back at ' : 'thrown forward at ') + Math.abs(vex).toFixed(1) + ' m/s');
        ro.set('run', '≈ ' + (0.95 * 60 * c1 / (Math.PI * V.D)).toFixed(0) + ' rpm');
        const ef = [], tq = [];
        for (let i = 0; i <= 50; i++) { const x = i / 50; ef.push([x, 100 * 2 * x * (1 - x) * kc * CV * CV]); tq.push([x, 100 * (1 - x)]); }
        plot.set({ series: [{ pts: ef, label: 'efficiency of the head', color: C.ok }, { pts: tq, label: 'torque (share of the standstill torque)', color: C.accent, dash: [5, 4] }], marks: [{ x: V.x, y: 100 * M.eta, label: V.defl ? 'deflected' : 'now' }], vlines: [{ x: 0.5, label: 'u = c₁/2' }] });
      }
      let psi = 0, ph = 0;
      const drops = [];
      const loop = kit.loop((dt) => {
        if (dirty) { update(); dirty = false; }
        const C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 380);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 380 * k) / 2); c.scale(k, k);
        const cx = 450, cy = 160, Rp = 118, yj = cy + Rp, wj = 3 + 10 * (V.d - 40) / 260;
        // penstock and nozzle with its spear
        pipe(c, [[26, 10], [26, yj], [62, yj]], C, 16);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        poly(c, [[60, yj - 14], [150, yj - wj / 2 - 2], [150, yj + wj / 2 + 2], [60, yj + 14]]); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.muted; poly(c, [[70, yj - 4], [140 - 30 * (V.d - 40) / 260, yj], [70, yj + 4]]); c.closePath(); c.fill();
        lbl(kit, c, 'spear valve', 105, yj + 28, { size: 11, color: C.muted });
        // the jet
        ph += dt * (40 + 0.9 * M.c1);
        const jetEnd = V.defl ? 190 : cx;
        c.strokeStyle = C.hue(205, C.dark ? 0.8 : 0.6); c.lineWidth = wj; c.beginPath(); c.moveTo(150, yj); c.lineTo(jetEnd, yj); c.stroke();
        if (V.defl) {
          c.beginPath(); c.moveTo(190, yj); c.quadraticCurveTo(215, yj + 4, 235, 372); c.stroke();
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; poly(c, [[168, yj - 30], [196, yj + 8], [204, yj + 2], [176, yj - 34]]); c.closePath(); c.fill(); c.stroke();
          lbl(kit, c, 'deflector', 176, yj - 44, { size: 11, color: C.warn, weight: 700 });
        }
        kit.fsym.flow(c, [[150, yj], [jetEnd, yj]], ph, { color: C.text, r: 1.4, gap: 18 });
        // the wheel: disc and buckets, turning so that the buckets at the bottom run with the jet
        psi += dt * (V.defl ? 0 : 0.2 + 1.6 * V.x);
        c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, Rp - 14, 0, 7); c.fill(); c.stroke();
        const nb = 20;
        for (let i = 0; i < nb; i++) {
          const a = psi + i * 2 * Math.PI / nb, bx = cx + Rp * Math.cos(a), by = cy - Rp * Math.sin(a);
          // a cup: its rounded back leads (local −y is the direction of motion), its open lip faces the oncoming jet
          c.save(); c.translate(bx, by); c.rotate(-a);
          c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
          c.beginPath(); c.moveTo(-6, 6); c.lineTo(-12, 4); c.arc(0, 4, 12, Math.PI, 2 * Math.PI); c.lineTo(6, 6); c.closePath(); c.fill(); c.stroke();
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(0, 4, 7, Math.PI * 1.1, Math.PI * 1.9); c.stroke();
          c.restore();
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 16, 0, 7); c.fill();
        lbl(kit, c, V.defl ? 'coasting: no jet' : M.rpm.toFixed(0) + ' rpm', cx, cy - 32, { size: 12, weight: 700, color: V.defl ? C.warn : C.text });
        lbl(kit, c, 'D = ' + V.D.toFixed(2) + ' m', cx, cy + 32, { size: 11, color: C.muted });
        // spray from the buckets: absolute velocity along the wheel's motion, then falling
        if (!V.defl && M.Q > 0) {
          const scv = 170 / Math.max(M.c1, 1), n = Math.min(6, 1 + V.jets) * dt * 30;
          for (let i = 0; i < n; i++) if (drops.length < 240) drops.push({ x: cx - 6 + 14 * Math.random(), y: yj - 6 + 12 * Math.random(), vx: M.vex * scv + (Math.random() - 0.5) * 18, vy: -30 + 50 * Math.random(), t: 1.3 });
        }
        c.fillStyle = C.hue(205, C.dark ? 0.8 : 0.6);
        for (let i = drops.length - 1; i >= 0; i--) {
          const d = drops[i]; d.t -= dt; d.vy += 420 * dt; d.x += d.vx * dt; d.y += d.vy * dt;
          if (d.t <= 0 || d.y > 385 || d.x < -10 || d.x > 770) { drops.splice(i, 1); continue; }
          c.beginPath(); c.arc(d.x, d.y, 1.8, 0, 7); c.fill();
        }
        // velocity labels
        lbl(kit, c, 'jet c₁ = ' + M.c1.toFixed(0) + ' m/s', 280, yj - 20, { size: 12, weight: 700, color: C.accent });
        if (!V.defl) {
          kit.arrow(c, cx - 30, yj + 26, cx - 30 + 60 * V.x, yj + 26, C.text, 2);
          lbl(kit, c, 'u = ' + M.u.toFixed(0) + ' m/s', cx + 40, yj + 26, { align: 'left', size: 12, color: C.text });
          const ex = 60 * M.vex / Math.max(M.c1, 1);
          if (Math.abs(ex) > 3) kit.arrow(c, cx, yj + 50, cx + ex, yj + 50, C.warn, 2);
          lbl(kit, c, 'leaving: ' + (M.vex >= 0 ? '+' : '−') + Math.abs(M.vex).toFixed(0) + ' m/s', cx + 70, yj + 50, { align: 'left', size: 12, color: C.warn });
        }
        lbl(kit, c, V.defl ? 'jet deflected: no power' : V.jets + (V.jets > 1 ? ' jets, ' : ' jet, ') + kWtxt(M.P), 740, 20, { align: 'right', size: 13, weight: 700, color: V.defl ? C.warn : C.text });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-turbine-chart */
  const REGIONS = [
    { name: 'Pelton', hue: 25, pts: [[0.02, 60], [0.02, 1900], [12, 1900], [50, 1100], [50, 400], [8, 120], [0.8, 60]], at: [0.12, 700] },
    { name: 'Crossflow, Turgo (small hydro)', hue: 140, pts: [[0.02, 3], [0.02, 150], [0.3, 200], [3, 60], [10, 5], [10, 2], [0.5, 2]], at: [0.06, 12] },
    { name: 'Francis', hue: 215, pts: [[0.4, 60], [0.4, 700], [70, 700], [1000, 130], [1000, 30], [150, 15], [4, 15], [1, 25]], at: [30, 180] },
    { name: 'Kaplan, bulb', hue: 300, pts: [[2, 2], [2, 45], [30, 70], [200, 70], [1000, 40], [1000, 1.2], [20, 1.2]], at: [120, 5] }
  ];
  Hyper.sim('pump-turbine-chart', {
    title: 'Choosing a turbine',
    blurb: `Every hydro site is a point on this chart: the flow one unit must pass and the net head it has. The shaded regions show where each kind of turbine is usually built — approximately: they overlap and vary between makers. The sloping lines are equal power at about 90 % efficiency. Drag the point, or use a preset, and choose the generator's synchronous speed to see the specific speed and what it asks of the runner.

**Try this**
- The Alpine preset (800 m, 5 m³/s): a Pelton. Now slide along a power line to lower head and larger flow: Francis country.
- The river weir (8 m, 150 m³/s): only a Kaplan or bulb makes sense — a Francis would have to turn impossibly slowly.
- For one site, step through the speeds: faster generators are smaller and cheaper, but the specific speed climbs until the runner must change type — and cavitation limits how far that can go.
- The mountain stream (25 m, 80 L/s): a few kilowatts, for a crossflow or Turgo turbine or a small multi-jet Pelton.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const SPEEDS = [3000, 1500, 1000, 750, 600, 500, 428.6, 375, 333.3, 300, 250, 214.3, 187.5, 166.7, 150, 125, 100, 75, 62.5];
      const PRE = { alp: [5, 800, 500], dam: [500, 100, 125], weir: [150, 8, 75], micro: [0.08, 25, 1000] };
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Flow per unit', min: 0.01, max: 1000, value: 5, unit: 'm³/s', log: true, sig: 3 },
        { id: 'H', label: 'Net head', min: 1, max: 2000, value: 800, unit: 'm', log: true, sig: 3 },
        { id: 'n', type: 'select', label: 'Generator speed (50 Hz)', options: SPEEDS.map(v => [v + ' rpm (' + Math.round(3000 / v) + ' pole pairs)', v]), value: 500 },
        { type: 'buttons', items: [{ id: 'alp', label: 'Alpine scheme' }, { id: 'dam', label: 'River dam' }, { id: 'weir', label: 'River weir' }, { id: 'micro', label: 'Mountain stream' }] }
      ], (id) => {
        if (PRE[id]) { ctl.set('Q', PRE[id][0]); ctl.set('H', PRE[id][1]); ctl.set('n', PRE[id][2]); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['s', 'Site'], ['p', 'Power (η ≈ 90 %)'], ['t', 'Turbines built for such sites'], ['nq', 'Specific speed n_q; n_s (kW)'], ['v', 'At this speed the runner should be'], ['j', 'Jet speed, if a Pelton']]);
      const X0 = 70, X1 = 740, Y0 = 20, Y1 = 390, LH = Math.log10(2000);
      const xOf = Q => X0 + (Math.log10(Q) + 2) / 5 * (X1 - X0), yOf = H => Y1 - Math.log10(H) / LH * (Y1 - Y0);
      const inside = (pt, poly2) => {
        let a = false;
        for (let i = 0, j = poly2.length - 1; i < poly2.length; j = i++) {
          const xi = xOf(poly2[i][0]), yi = yOf(poly2[i][1]), xj = xOf(poly2[j][0]), yj = yOf(poly2[j][1]);
          if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) a = !a;
        }
        return a;
      };
      const verdict = nq => {
        if (nq < 2.5) return 'too slow for any runner: choose a faster speed';
        if (nq < 10) return 'a Pelton wheel with one jet';
        if (nq < 22) return 'a Pelton with ' + Math.min(6, Math.ceil(Math.pow(nq / 8, 2))) + ' jets, or a slow Francis';
        if (nq < 100) return 'a Francis runner';
        if (nq < 140) return 'a fast Francis or a Kaplan';
        if (nq < 300) return 'a Kaplan (propeller)';
        if (nq < 450) return 'a bulb turbine';
        return 'too fast for one runner: choose a slower speed';
      };
      let tf = { k: 1, ox: 0, oy: 0 };
      kit.drag(st, {
        hit: p => { const x = (p.x - tf.ox) / tf.k, y = (p.y - tf.oy) / tf.k; return x >= X0 && x <= X1 && y >= Y0 && y <= Y1 ? 'pt' : null; },
        move: (_, p) => {
          const x = clamp((p.x - tf.ox) / tf.k, X0, X1), y = clamp((p.y - tf.oy) / tf.k, Y0, Y1);
          ctl.set('Q', Number(Math.pow(10, (x - X0) / (X1 - X0) * 5 - 2).toPrecision(3)));
          ctl.set('H', Number(Math.pow(10, (Y1 - y) / (Y1 - Y0) * LH).toPrecision(3)));
        },
        hover: true
      });
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin(), k = Math.min(st.W / 760, st.H / 440);
        tf = { k, ox: (st.W - 760 * k) / 2, oy: (st.H - 440 * k) / 2 };
        c.save(); c.translate(tf.ox, tf.oy); c.scale(k, k);
        const Q = clamp(V.Q, 0.01, 1000), H = clamp(V.H, 1, 2000), P = 0.9 * RHO * G * Q * H;
        // grid
        c.lineWidth = 1;
        for (let e = -2; e <= 3; e++) for (const m of [1, 2, 5]) {
          const q = m * Math.pow(10, e); if (q > 1000) continue;
          c.strokeStyle = m === 1 ? C.grid : C.bg2; c.beginPath(); c.moveTo(xOf(q), Y0); c.lineTo(xOf(q), Y1); c.stroke();
          if (m === 1) lbl(kit, c, q >= 1 ? String(q) : q.toString(), xOf(q), Y1 + 12, { size: 11, color: C.muted });
        }
        for (let e = 0; e <= 3; e++) for (const m of [1, 2, 5]) {
          const h = m * Math.pow(10, e); if (h > 2000) continue;
          c.strokeStyle = m === 1 ? C.grid : C.bg2; c.beginPath(); c.moveTo(X0, yOf(h)); c.lineTo(X1, yOf(h)); c.stroke();
          lbl(kit, c, String(h), X0 - 6, yOf(h), { align: 'right', size: 11, color: m === 1 ? C.muted : C.faint });
        }
        lbl(kit, c, 'flow per unit Q (m³/s)', X1, Y1 + 30, { align: 'right', size: 12, color: C.text });
        lbl(kit, c, 'net head H (m)', X0 + 4, Y0 + 2, { align: 'left', size: 12, color: C.text, baseline: 'top' });
        // regions
        for (const r of REGIONS) {
          c.fillStyle = C.hue(r.hue, 0.13); c.strokeStyle = C.hue(r.hue, 0.8); c.lineWidth = 1.5;
          poly(c, r.pts.map(p => [xOf(p[0]), yOf(p[1])])); c.closePath(); c.fill(); c.stroke();
          lbl(kit, c, r.name, xOf(r.at[0]), yOf(r.at[1]), { size: 12, weight: 700, color: C.hue(r.hue) });
        }
        // lines of equal power
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const [pw, lab] of [[1e4, '10 kW'], [1e5, '100 kW'], [1e6, '1 MW'], [1e7, '10 MW'], [1e8, '100 MW'], [1e9, '1 GW']]) {
          const Hq = q => pw / (0.9 * RHO * G * q);
          const qa = Math.max(0.01, pw / (0.9 * RHO * G * 2000)), qb = Math.min(1000, pw / (0.9 * RHO * G * 1));
          if (qa >= qb) continue;
          c.beginPath(); c.moveTo(xOf(qa), yOf(Hq(qa))); c.lineTo(xOf(qb), yOf(Hq(qb))); c.stroke();
          const ql = Math.max(qa, Math.min(qb, qa * 1.6));
          lbl(kit, c, lab, xOf(ql) + 4, yOf(Hq(ql)) - 8, { align: 'left', size: 11, color: C.muted });
        }
        c.restore();
        // the site
        const px = xOf(Q), py = yOf(H);
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(px, Y1); c.lineTo(px, py); c.lineTo(X0, py); c.stroke(); c.setLineDash([]);
        kit.dot(c, px, py, 7, C.accent, C.text);
        lbl(kit, c, kWtxt(P), px + 10, py - 12, { align: 'left', size: 12, weight: 700, color: C.text, bg: C.surface });
        c.restore();
        // readouts
        const suits = REGIONS.filter(r => inside([px, py], r.pts)).map(r => r.name);
        const n = +V.n, nq = n * Math.sqrt(Q) / Math.pow(H, 0.75), ns = n * Math.sqrt(P / 1000) / Math.pow(H, 1.25);
        ro.set('s', Q.toPrecision(3) + ' m³/s at ' + H.toPrecision(3) + ' m');
        ro.set('p', kWtxt(P));
        ro.set('t', suits.length ? suits.join('; ') : 'outside the usual ranges');
        ro.set('nq', nq.toFixed(1) + '; ' + ns.toFixed(0));
        ro.set('v', verdict(nq));
        ro.set('j', (0.98 * Math.sqrt(2 * G * H)).toFixed(1) + ' m/s');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pump-storage-day */
  const SCHED = {
    night: h => (h >= 23 || h < 7) ? -1 : (h >= 7.5 && h < 9.5) || (h >= 17 && h < 21) ? 1 : 0,
    solar: h => (h >= 10 && h < 16.5) ? -1 : (h >= 6 && h < 8) || (h >= 18 && h < 21) ? 1 : 0
  };
  const F0 = { night: 0.17, solar: 0.39 };
  Hyper.sim('pump-storage-day', {
    title: 'A day of pumped storage',
    blurb: `A pumped-storage scheme through one day: an upper reservoir on a hill, a lower one in the valley and reversible pump-turbines in a cavern between them. It pumps when electricity is plentiful and generates when it is scarce. Choose the kind of day — pumping at night for the morning and evening peaks, or pumping at the sunny midday for the evening — and watch the reservoirs, the power and the energy stored. The reservoir holds 6.5 hours of full output.

**Try this**
- Let a whole day pass and compare *energy in* with *energy out*: about three-quarters comes back — the round-trip efficiency.
- Raise the tunnel friction: it is paid twice, lifting against H + h_L and generating from H − h_L.
- Halve the head: the same power needs twice the flow, and the reservoir must hold twice the water for the same energy.
- Switch to the solar day: the pumps run at midday, when solar panels produce more than the grid can use.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const d1 = document.createElement('div'); d1.style.padding = '4px 10px 0'; box.stage.appendChild(d1);
      const d2 = document.createElement('div'); d2.style.padding = '0 10px 10px'; box.stage.appendChild(d2);
      const ctl = kit.controls(box.side, [
        { id: 'sched', type: 'select', label: 'The day', options: [['Pump at night, generate at the peaks', 'night'], ['Pump at the solar midday', 'solar']], value: 'night' },
        { id: 'H', label: 'Gross head', min: 100, max: 800, step: 10, value: 500, unit: 'm' },
        { id: 'P', label: 'Rating (pumping input = generating output)', min: 200, max: 3000, step: 50, value: 1500, unit: 'MW' },
        { id: 'ep', label: 'Pumping chain efficiency (motor, pump)', min: 80, max: 95, step: 0.5, value: 89, unit: '%' },
        { id: 'et', label: 'Generating chain efficiency (turbine, generator)', min: 80, max: 96, step: 0.5, value: 90, unit: '%' },
        { id: 'loss', label: 'Tunnel friction at full flow (share of head)', min: 0, max: 6, step: 0.1, value: 2, unit: '%' },
        { id: 'rate', label: 'Hours per second', min: 0.25, max: 4, step: 0.25, value: 1, unit: 'h/s' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the day', primary: true }] }
      ], (id) => { if (id === 'restart' || id === 'sched') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['m', 'Mode'], ['q', 'Flow in the waterway'], ['h', 'Gross head now'], ['e', 'Energy stored (recoverable)'], ['io', 'Energy in / out since midnight'], ['rt', 'Round trip: expected / yesterday']]);
      const pl1 = kit.plot(d1, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'power (MW): + generating, − pumping' }, legend: true }, 160);
      const pl2 = kit.plot(d2, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'energy stored (GWh)', min: 0 } }, 130);
      const S = { t: 0, f: F0.night, Ein: 0, Eout: 0, hist: [], estH: [], tPlot: 0, last: null, mode: 0, Q: 0, ph: 0, ang: 0 };
      function restart() { S.t = 0; S.f = F0[V.sched] || 0.3; S.Ein = 0; S.Eout = 0; S.hist = []; S.estH = []; S.tPlot = 0; S.last = null; }
      restart();
      const lossF = () => V.loss / 100, Hg = f => V.H + 20 * (f - 0.5);
      const vmax = () => 6.5 * 3600 * V.P * 1e6 / (V.et / 100 * RHO * G * V.H * (1 - lossF()));
      const stored = () => V.et / 100 * RHO * G * S.f * vmax() * Hg(S.f) * (1 - lossF()) / 3.6e12;
      function step(dh) {
        const want = SCHED[V.sched](S.t), P = V.P * 1e6, H = Hg(S.f), l = lossF();
        let mode = want, Q = 0;
        if (want < 0 && S.f >= 1) mode = 2;               // full: pumping stops
        if (want > 0 && S.f <= 0.02) mode = -2;           // empty: generation stops
        if (mode === -1) { Q = V.ep / 100 * P / (RHO * G * H * (1 + l)); S.f += Q * dh * 3600 / vmax(); S.Ein += V.P * dh; }
        if (mode === 1) { Q = P / (V.et / 100 * RHO * G * H * (1 - l)); S.f -= Q * dh * 3600 / vmax(); S.Eout += V.P * dh; }
        S.f = clamp(S.f, 0, 1); S.mode = mode; S.Q = Q;
        S.t += dh;
        if (S.t >= 24) { S.last = S.Ein > 0 ? S.Eout / S.Ein : null; S.t -= 24; S.Ein = 0; S.Eout = 0; S.hist = []; S.estH = []; }
      }
      const loop = kit.loop((dt) => {
        const steps = Math.max(1, Math.ceil(dt * V.rate / 0.02)), dh = dt * V.rate / steps;
        for (let i = 0; i < steps; i++) step(dh);
        const C = kit.colors();
        S.tPlot += dt * V.rate;
        if (S.tPlot >= 0.1) {
          S.tPlot = 0;
          S.hist.push([S.t, S.mode === 1 ? V.P : S.mode === -1 ? -V.P : 0]); S.estH.push([S.t, stored()]);
          const plan = [];
          for (let i = 0; i < 96; i++) { const h = i / 4, v = SCHED[V.sched](h) * V.P; plan.push([h, v], [h + 0.25, v]); }
          pl1.set({ series: [{ pts: plan, label: 'plan', color: C.faint, dash: [4, 4], width: 1.4 }, { pts: S.hist, label: 'actual', color: C.accent }], vlines: [{ x: S.t, label: '' }], hlines: [{ y: 0 }] });
          pl2.set({ series: [{ pts: S.estH, label: 'stored', color: C.ok, fill: true }], vlines: [{ x: S.t }] });
        }
        const l = lossF(), rtExp = V.ep / 100 * V.et / 100 * (1 - l) / (1 + l);
        const hh = Math.floor(S.t), mm = Math.floor((S.t - hh) * 60);
        ro.set('t', (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm);
        ro.set('m', S.mode === 1 ? 'generating ' + V.P + ' MW' : S.mode === -1 ? 'pumping ' + V.P + ' MW' : S.mode === 2 ? 'upper reservoir full: pumping stopped' : S.mode === -2 ? 'upper reservoir empty: generation stopped' : 'standing by');
        ro.set('q', S.Q.toFixed(0) + ' m³/s');
        ro.set('h', Hg(S.f).toFixed(0) + ' m');
        ro.set('e', stored().toFixed(2) + ' GWh (' + (S.f * 100).toFixed(0) + ' % full)');
        ro.set('io', (S.Ein / 1000).toFixed(2) + ' / ' + (S.Eout / 1000).toFixed(2) + ' GWh');
        ro.set('rt', (rtExp * 100).toFixed(1) + ' % / ' + (S.last != null ? (S.last * 100).toFixed(0) + ' %' : '—'));
        // drawing
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 320);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 320 * k) / 2); c.scale(k, k);
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        poly(c, [[0, 320], [0, 92], [40, 92], [270, 92], [560, 262], [760, 262], [760, 320]]); c.closePath(); c.fill(); c.stroke();
        // reservoirs
        const yU = 118 - 48 * S.f, yL = 300 - 50 * (1 - S.f) - 4;
        c.fillStyle = C.bg; c.fillRect(50, 60, 200, 60); c.fillRect(570, 226, 170, 76);
        basin(c, 50, 250, 60, 120, yU, C);
        basin(c, 570, 740, 226, 302, yL, C);
        lbl(kit, c, 'upper reservoir', 150, 50, { size: 11, color: C.muted });
        lbl(kit, c, 'lower reservoir', 655, 216, { size: 11, color: C.muted });
        // waterway and machine hall
        const way = [[245, 115], [300, 128], [440, 262], [470, 282], [600, 282]];
        pipe(c, way, C, 8);
        const spd = S.Q / Math.max(1, V.P * 1e6 / (RHO * G * V.H));
        S.ph += dt * 120 * spd * (S.mode === 1 ? 1 : -1);
        if (Math.abs(S.mode) === 1) kit.fsym.flow(c, way, S.ph, { color: S.mode === 1 ? C.ok : C.accent, r: 2.4 });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8; c.fillRect(440, 262, 64, 38); c.strokeRect(440, 262, 64, 38);
        S.ang += dt * (Math.abs(S.mode) === 1 ? 6 * S.mode : 0);
        c.strokeStyle = S.mode === 1 ? C.ok : S.mode === -1 ? C.accent : C.muted; c.lineWidth = 2;
        c.beginPath(); c.arc(472, 281, 12, 0, 7); c.stroke();
        for (let i = 0; i < 5; i++) { const a = S.ang + i * 2 * Math.PI / 5; c.beginPath(); c.moveTo(472, 281); c.lineTo(472 + 11 * Math.cos(a), 281 + 11 * Math.sin(a)); c.stroke(); }
        lbl(kit, c, 'pump-turbine', 472, 312, { size: 11, color: C.muted });
        const mtxt = S.mode === 1 ? 'generating  ▼' : S.mode === -1 ? 'pumping  ▲' : S.mode === 2 ? 'full' : S.mode === -2 ? 'empty' : 'standing by';
        lbl(kit, c, mtxt, 360, 240, { size: 13, weight: 700, color: S.mode === 1 ? C.ok : S.mode === -1 ? C.accent : C.muted });
        // the clock: a 24-hour dial with the sun or the moon
        const kx = 680, ky = 60, day = S.t >= 6 && S.t < 18;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.surface; c.beginPath(); c.arc(kx, ky, 30, 0, 7); c.fill(); c.stroke();
        for (let i = 0; i < 24; i++) { const a = i / 24 * 2 * Math.PI - Math.PI / 2; c.beginPath(); c.moveTo(kx + 26 * Math.cos(a), ky + 26 * Math.sin(a)); c.lineTo(kx + 30 * Math.cos(a), ky + 30 * Math.sin(a)); c.stroke(); }
        const ha = S.t / 24 * 2 * Math.PI - Math.PI / 2;
        c.lineWidth = 2.5; c.beginPath(); c.moveTo(kx, ky); c.lineTo(kx + 22 * Math.cos(ha), ky + 22 * Math.sin(ha)); c.stroke();
        lbl(kit, c, '24 h', kx, ky + 42, { size: 10, color: C.muted });
        if (day) { c.fillStyle = C.warn; c.beginPath(); c.arc(620, 50, 11, 0, 7); c.fill(); c.strokeStyle = C.warn; c.lineWidth = 1.5; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; c.beginPath(); c.moveTo(620 + 14 * Math.cos(a), 50 + 14 * Math.sin(a)); c.lineTo(620 + 19 * Math.cos(a), 50 + 19 * Math.sin(a)); c.stroke(); } }
        else { c.fillStyle = C.muted; c.beginPath(); c.arc(620, 50, 11, 0, 7); c.fill(); c.fillStyle = C.bg; c.beginPath(); c.arc(625, 46, 10, 0, 7); c.fill(); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
