/* HYPER-PNEUMATICS · sims/reference.js — reference simulations for pneumatics authors.
 *   ref-pneu-cylinder    a double-acting cylinder, 5/2 solenoid valve, meter-out flow controls, service unit —
 *                        drawn in ISO 1219 symbols (kit.fsym) and simulated by kit.fluid.pneuCylinder:
 *                        chamber pressures from the adiabatic energy balance, valve flow by ISO 6358
 *   ref-air-consumption  what a cylinder uses in free air and what it costs, against a single leak
 */
(function () {
  'use strict';
  const BORES = { 16: 6, 20: 8, 25: 10, 32: 12, 40: 16, 50: 20, 63: 20, 80: 25, 100: 25 };

  Hyper.sim('ref-pneu-cylinder', {
    title: 'A pneumatic cylinder, stroke by stroke',
    blurb: `A double-acting cylinder driven by a 5/2 solenoid valve with spring return, through two one-way flow controls that throttle the air leaving the cylinder (meter-out). The model integrates the air in each chamber (filling and emptying through the valve by ISO 6358, compression and expansion as the piston moves) and the motion of the piston against friction and load. Lines are **blue** where air is supplied and **light blue** where it exhausts.

**Try this**
- Watch the pressures at the start of a stroke: nothing moves until the driving chamber has risen and the other has fallen far enough. That delay is part of every stroke time.
- Close the meter-out throttles: the exhausting chamber stays pressurised, the piston runs slower and steadier between two air cushions. Open them fully and it slams into the end cap.
- Double the moving mass or the load: the cylinder slows and its impact energy grows. Load ratios above about 70 % make the motion sluggish.
- Try a small valve (0.3 dm³/(s·bar)) on a 50 mm cylinder: the valve, not the pressure, sets the speed.
- Read the air per cycle, and compare it with the swept volume × 7.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const graphBox = document.createElement('div');
      graphBox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(graphBox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      graphBox.appendChild(g1); graphBox.appendChild(g2);
      let cmd = 1, auto = true;
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'ext', label: 'Extend (14)' }, { id: 'ret', label: 'Retract' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'ps', label: 'Supply pressure (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(BORES).map(b => [b + ' mm bore, ' + BORES[b] + ' mm rod', +b]), value: 32 },
        { id: 'stroke', label: 'Stroke', min: 25, max: 500, step: 5, value: 200, unit: 'mm' },
        { id: 'mass', label: 'Moving mass', min: 0.2, max: 40, step: 0.1, value: 2, unit: 'kg', log: true },
        { id: 'lr', label: 'Load against extension (load ratio)', min: 0, max: 90, step: 1, value: 20, unit: '%' },
        { id: 'cv', label: 'Valve sonic conductance C', min: 0.2, max: 5, step: 0.05, value: 1.2, unit: 'dm³/(s·bar)', log: true },
        { id: 'thr', label: 'Meter-out throttles open', min: 3, max: 100, step: 1, value: 45, unit: '%' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Real time', 1], ['Slow motion ¼', 0.25], ['Slow motion 1/10', 0.1]], value: 0.25 }
      ], (id, v) => {
        if (id === 'ext') { cmd = 1; auto = false; ctl.set('auto', false); }
        if (id === 'ret') { cmd = 0; auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = v;
        if (id === 'bore' || id === 'stroke') build();
      });
      const ro = kit.readout(box.side, [['F', 'Force at supply pressure'], ['p', 'Cap end / rod end'], ['t', 'Last stroke time'], ['v', 'Top speed / impact speed'], ['air', 'Free air per cycle'], ['swept', 'Swept volume × absolute pressure ratio']]);
      const pPos = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position (mm)', min: 0 } }, 130);
      const pPr = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0 }, legend: true }, 130);
      const V = ctl.values, patm = 1.013e5;
      let cyl, s;
      function build() {
        const x0 = cyl ? Math.min(cyl.state.x, V.stroke / 1000) : 0;
        cyl = F.pneuCylinder({ bore: V.bore / 1000, rod: BORES[V.bore] / 1000, stroke: V.stroke / 1000, psupply: V.ps * 1e5 + patm, patm });
        cyl.state.x = x0;
        s = { t: 0, hist: [], tPlot: 0, cycleAir: 0, airAt: 0, t0: 0, vmax: 0, impact: 0, last: '—', lastCmd: cmd, arrived: false, vstate: 1, wait: 0, ph: {} };
      }
      build();
      const loop = kit.loop((dt) => {
        const P = cyl.params, A1 = cyl.AA, A2 = cyl.AB;
        P.psupply = V.ps * 1e5 + patm; P.mass = V.mass; P.Cvalve = V.cv * 1e-8;
        P.CthrottleA = P.CthrottleB = Math.max(0.03, V.thr / 100) * 3e-8;
        P.load = V.lr / 100 * V.ps * 1e5 * A1; P.fc = 8 + 0.03 * V.ps * 1e5 * A1;
        const sdt = Math.min(dt, 0.05) * V.slow;
        // automatic cycling: reverse 0.25 s after arriving at an end
        const atEnd = cmd === 1 ? cyl.state.x >= P.stroke - 1e-6 : cyl.state.x <= 1e-6;
        if (auto && atEnd) { s.wait += sdt; if (s.wait > 0.25) { cmd = 1 - cmd; s.wait = 0; } } else s.wait = 0;
        if (cmd !== s.lastCmd) {
          if (cmd === 1) { if (s.airAt) s.cycleAir = cyl.airNl() - s.airAt; s.airAt = cyl.airNl(); }
          s.t0 = s.t; s.vmax = 0; s.arrived = false; s.lastCmd = cmd;
        }
        const vPrev = cyl.state.v;
        cyl.step(sdt, cmd);
        s.t += sdt;
        s.vmax = Math.max(s.vmax, Math.abs(cyl.state.v));
        if (!s.arrived && atEnd === false && (cmd === 1 ? cyl.state.x >= P.stroke - 1e-6 : cyl.state.x <= 1e-6)) { s.arrived = true; s.last = (s.t - s.t0).toFixed(3) + ' s'; s.impact = Math.abs(vPrev); }
        s.vstate += Math.max(-sdt / 0.02, Math.min(sdt / 0.02, (cmd === 1 ? 0 : 1) - s.vstate));
        const pA = cyl.state.pA - patm, pB = cyl.state.pB - patm;
        ro.set('F', (V.ps * 1e5 * A1).toFixed(0) + ' N push, ' + (V.ps * 1e5 * A2).toFixed(0) + ' N pull');
        ro.set('p', (pA / 1e5).toFixed(2) + ' / ' + (pB / 1e5).toFixed(2) + ' bar');
        ro.set('t', s.last);
        ro.set('v', s.vmax.toFixed(2) + ' / ' + s.impact.toFixed(2) + ' m/s');
        ro.set('air', s.cycleAir ? (s.cycleAir).toFixed(3) + ' L' : 'after the first full cycle');
        ro.set('swept', ((A1 + A2) * P.stroke * (V.ps * 1e5 + patm) / patm * 1000).toFixed(3) + ' L (plus dead volumes)');
        s.tPlot += dt;
        s.hist.push([s.t, cyl.state.x * 1000, pA / 1e5, pB / 1e5]);
        while (s.hist.length && s.hist[0][0] < s.t - 3) s.hist.shift();
        if (s.tPlot > 0.06) {
          s.tPlot = 0;
          const h = s.hist.filter((q, i) => i % 3 === 0);
          pPos.set({ series: [{ pts: h.map(q => [q[0], q[1]]), label: 'position' }], y: { label: 'position (mm)', min: 0, max: V.stroke } });
          pPr.set({ series: [{ pts: h.map(q => [q[0], q[2]]), label: 'cap end' }, { pts: h.map(q => [q[0], q[3]]), label: 'rod end', dash: [5, 4] }], y: { label: 'gauge pressure (bar)', min: 0, max: V.ps + 0.5 } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const exA = cmd !== 1, exB = cmd === 1;
        const stA = exA ? (pA > 0.2e5 ? 'exhaust' : 'idle') : 'air', stB = exB ? (pB > 0.2e5 ? 'exhaust' : 'idle') : 'air';
        const L = {
          supply: [[170, 360], [170, 352], [212, 352]], main: [[308, 352], [390, 352], [390, 297]], gauge: [[330, 343], [330, 352]],
          A: [[258, 111], [258, 142]], A2: [[258, 198], [258, 220], [381.5, 220], [381.5, 243]],
          B: [[522, 111], [522, 142]], B2: [[522, 198], [522, 220], [398.5, 220], [398.5, 243]]
        };
        S.line(c, L.supply, { state: 'air' }); S.line(c, L.main, { state: 'air' }); S.line(c, L.gauge, { state: 'air' }); S.junction(c, 330, 352);
        S.line(c, L.A, { state: stA }); S.line(c, L.A2, { state: stA }); S.line(c, L.B, { state: stB }); S.line(c, L.B2, { state: stB });
        // flow dots from the actual valve flows
        const qref = P.Cvalve * P.psupply;
        const fill = p2 => F.iso6358({ C: P.Cvalve, b: P.bvalve, p1: P.psupply, p2 }).qANR;
        const vent = (p1, Ct) => F.iso6358({ C: 1 / Math.sqrt(1 / (P.Cvalve * P.Cvalve) + 1 / (Ct * Ct)), b: P.bvalve, p1, p2: patm }).qANR;
        const qA = exA ? vent(cyl.state.pA, P.CthrottleA) : fill(cyl.state.pA), qB = exB ? vent(cyl.state.pB, P.CthrottleB) : fill(cyl.state.pB);
        const adv = (key, q) => { s.ph[key] = (s.ph[key] || 0) + dt * 70 * q / qref; return s.ph[key]; };
        const pathA = L.A2.slice().reverse().concat(L.A.slice().reverse()), pathB = L.B2.slice().reverse().concat(L.B.slice().reverse());
        if (qA > qref * 0.01) S.flow(c, exA ? pathA.slice().reverse() : pathA, adv('a', qA), { color: S.col(exA ? 'exhaust' : 'air') });
        if (qB > qref * 0.01) S.flow(c, exB ? pathB.slice().reverse() : pathB, adv('b', qB), { color: S.col(exB ? 'exhaust' : 'air') });
        if (qA + qB > qref * 0.01) S.flow(c, L.supply.concat(L.main), adv('s', exA ? qB : qA), { color: S.col('air') });
        S.source(c, 170, 380, { pneumatic: true });
        S.frl(c, 260, 352);
        S.gauge(c, 330, 322, { frac: V.ps / 12, value: V.ps.toFixed(1) + ' bar' });
        const v52 = S.valve(c, 390, 270, { spec: '5/2', state: s.vstate, left: 'solenoid', right: 'spring', s: 34, pneumatic: true, labels: true, exhaust: 'silencer' });
        kit.label(c, '14', v52.xl - 8, 270, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        S.flowControl(c, 258, 170, { free: 'up' }); S.flowControl(c, 522, 170, { free: 'up' });
        const red = (p) => p > 0.2e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * p / (V.ps * 1e5)) + ')' : null;
        const cy = S.cylinder(c, 250, 80, { len: 280, h: 42, rodLen: 150, pos: cyl.state.x / P.stroke, fillA: red(pA), fillB: red(pB), cushion: true });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        const mw = 26 + 6 * Math.log2(1 + V.mass);
        c.fillRect(cy.tip[0], 80 - mw / 2, mw, mw); c.strokeRect(cy.tip[0], 80 - mw / 2, mw, mw);
        kit.label(c, V.mass.toFixed(1) + ' kg', cy.tip[0] + mw / 2, 80 + mw / 2 + 12, { color: C.muted, size: 11 });
        kit.label(c, (pA / 1e5).toFixed(1) + ' bar', 300, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, (pB / 1e5).toFixed(1) + ' bar', 480, 48, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 't = ' + s.t.toFixed(2) + ' s', 740, 400, { color: C.muted, size: 11, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('ref-air-consumption', {
    title: 'What a cylinder costs to run',
    blurb: `The free air a double-acting cylinder uses — both strokes plus the tubes between valve and cylinder — and what the compressor's electricity for it costs over a year, next to a single leak of the size you choose running around the clock.

**Try this**
- Compare the swept volume with the balloon of free air it becomes: the ratio is the absolute pressure over the atmosphere, about 7 at 6 bar.
- Lower the pressure from 7 to 5 bar: every stroke uses a quarter less air.
- Lengthen the tubes: small cylinders with long tubes spend a surprising share of their air filling the tubes.
- Set the leak to 3 mm and compare its cost with the cylinder's.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const ctl = kit.controls(box.side, [
        { id: 'bore', type: 'select', label: 'Cylinder', options: Object.keys(BORES).map(b => [b + ' mm bore, ' + BORES[b] + ' mm rod', +b]), value: 32 },
        { id: 's', label: 'Stroke', min: 10, max: 1000, step: 5, value: 100, unit: 'mm', log: true },
        { id: 'p', label: 'Pressure (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'n', label: 'Cycles per minute', min: 1, max: 120, step: 1, value: 30 },
        { id: 'tl', label: 'Tube length, valve to cylinder (each)', min: 0, max: 5, step: 0.1, value: 1, unit: 'm' },
        { id: 'td', type: 'select', label: 'Tube bore', options: [['2.5 mm (4 mm tube)', 2.5], ['4 mm (6 mm tube)', 4], ['5.5 mm (8 mm tube)', 5.5], ['7.5 mm (10 mm tube)', 7.5]], value: 4 },
        { id: 'h', label: 'Hours a year', min: 500, max: 8760, step: 10, value: 4000 },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' },
        { id: 'sp', label: 'Compressor specific power', min: 5, max: 10, step: 0.1, value: 6.5, unit: 'kW per m³/min' },
        { id: 'leak', label: 'A leak of diameter', min: 0.5, max: 6, step: 0.1, value: 3, unit: 'mm' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['stroke', 'Free air: extend / retract / tubes'], ['cycle', 'Free air per cycle'], ['q', 'Average flow'], ['e', 'Energy per year'], ['cost', 'Cost per year'], ['leak', 'The leak, running all year']]);
      const V = ctl.values;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const D = V.bore / 1000, d = BORES[V.bore] / 1000, s = V.s / 1000, pa = 1.013e5, pg = V.p * 1e5, r = (pg + pa) / pa;
        const A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, Vt = Math.PI * Math.pow(V.td / 1000, 2) / 4 * V.tl;
        const ve = A1 * s * r, vr = A2 * s * r, vt = 2 * Vt * r, cycle = ve + vr + vt;
        const q = cycle * V.n / 60;                                 // m³/s of free air
        const kwh = q * 60 * V.h * 60 * V.sp / 60;                  // kW per (m³/min) × (m³/min) × hours
        // a sharp-edged hole: choked flow with Cd ≈ 0.65, as free air at 20 °C
        const Ah = Math.PI * Math.pow(V.leak / 2000, 2), mdot = 0.0404 * 0.65 * Ah * (pg + pa) / Math.sqrt(293.15), qLeak = mdot / 1.185;
        const kwhLeak = qLeak * 60 * 8760 * V.sp;
        ro.set('stroke', (ve * 1000).toFixed(3) + ' / ' + (vr * 1000).toFixed(3) + ' / ' + (vt * 1000).toFixed(3) + ' L');
        ro.set('cycle', (cycle * 1000).toFixed(3) + ' L  (swept ' + ((A1 + A2) * s * 1000).toFixed(3) + ' L × ' + r.toFixed(2) + ')');
        ro.set('q', (q * 60000).toFixed(1) + ' L/min ANR');
        ro.set('e', kwh.toFixed(0) + ' kWh');
        ro.set('cost', kit.money(kwh * V.price, 0));
        ro.set('leak', (qLeak * 60000).toFixed(0) + ' L/min, ' + kwhLeak.toFixed(0) + ' kWh, ' + kit.money(kwhLeak * V.price, 0));
        // the cylinder's swept volume and the free air it becomes, as areas to scale
        const W = st.W, H = st.H, unit = Math.min(W, H) * 0.34 / Math.sqrt(Math.max(cycle, (A1 + A2) * s) * 1000 + 1e-9);
        const rSwept = Math.sqrt(((A1 + A2) * s) * 1000) * unit, rFree = Math.sqrt(cycle * 1000) * unit;
        const cx1 = W * 0.18, cx2 = W * 0.47, cy = H * 0.5;
        c.fillStyle = C.dark ? 'rgba(79,141,255,.55)' : 'rgba(29,78,216,.35)'; c.beginPath(); c.arc(cx1, cy, Math.max(2, rSwept), 0, Math.PI * 2); c.fill();
        c.fillStyle = C.dark ? 'rgba(156,195,255,.3)' : 'rgba(107,156,224,.3)'; c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(cx2, cy, Math.max(2, rFree), 0, Math.PI * 2); c.fill(); c.stroke();
        kit.label(c, 'swept volume', cx1, cy + Math.max(rSwept, 12) + 16, { color: C.text, size: 12, weight: 700 });
        kit.label(c, ((A1 + A2) * s * 1000).toFixed(2) + ' L', cx1, cy + Math.max(rSwept, 12) + 32, { color: C.muted, size: 12 });
        kit.label(c, 'free air per cycle', cx2, cy + rFree + 16, { color: C.text, size: 12, weight: 700 });
        kit.label(c, (cycle * 1000).toFixed(2) + ' L', cx2, cy + rFree + 32, { color: C.muted, size: 12 });
        kit.arrow(c, cx1 + Math.max(rSwept, 6) + 8, cy, cx2 - rFree - 8, cy, C.muted, 1.5);
        kit.label(c, '× ' + r.toFixed(1) + (vt > 0 ? ' + tubes' : ''), (cx1 + cx2) / 2, cy - 12, { color: C.muted, size: 12 });
        // yearly cost bars: the cylinder and the leak
        const bx = W * 0.68, bw = W * 0.12, base = H * 0.85, top = H * 0.15, mx = Math.max(kwh, kwhLeak, 1);
        const bar = (x, v, col, label) => {
          const h = (base - top) * v / mx;
          c.fillStyle = col; c.fillRect(x, base - h, bw, h);
          kit.label(c, label, x + bw / 2, base + 14, { color: C.text, size: 12, weight: 700 });
          kit.label(c, kit.money(v * V.price, 0), x + bw / 2, base - h - 12, { color: C.text, size: 12 });
        };
        bar(bx, kwh, C.accent, 'cylinder'); bar(bx + bw * 1.3, kwhLeak, C.bad, V.leak.toFixed(1) + ' mm leak');
        kit.label(c, 'cost per year', bx + bw * 1.15, top - 12, { color: C.muted, size: 12 });
      }, box.stage);
      loop.once();
    }
  });
})();
