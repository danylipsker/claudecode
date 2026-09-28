/* HYPER-MOTORS · sims/servos.js — simulations for the servo branch (prefix sv-).
 *   sv-loop         what makes a servo: a rotary table on a 750 W servo and a 50:1 reducer, open or closed loop, friction and a push
 *   sv-ac-envelope  an AC servo motor (field-oriented currents, encoder) and its speed–torque envelope with a move cycle on it
 *   sv-dc-step      a DC servo on a PI speed loop with a current limit: speed and current after a step, tacho ripple
 *   sv-rc-servo     an RC servo: the 1–2 ms pulse, the potentiometer loop, analogue against digital, a load on the horn
 *   sv-drive-bus    a servo drive's power stage through a machine cycle: DC bus, braking resistor, overvoltage, STO
 *   sv-command      pulse/direction, analogue ±10 V and fieldbus commands, with noise and a pulse-frequency limit
 *   sv-pid          a PID position loop on a heavy table: the P, I and D terms, a load, windup
 *   sv-tuning       a two-mass (motor–belt–load) axis: velocity-loop gain, notch filter, inertia setting, auto-tune
 *   sv-inertia      inertia ratio and gear ratio: torque against ratio, and the step response it allows
 *   sv-following    a ball-screw axis: following error, feed-forward, the deviation limit, a jam and the I²t overload
 *   sv-brake        a vertical screw axis with a holding brake: the servo-on / brake sequence, drops, power failure
 */
(function () {
  'use strict';

  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rpmOf = w => w * 60 / TAU;
  // a design-sized drawing area (W0 × H0) centred and scaled into the stage
  const fit = (st, c, W0, H0) => { const s = Math.min(st.W / W0, st.H / H0); c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s); c.font = '12px ' + font(); return s; };
  // one or two graphs under the stage
  const graphs = (box, n) => {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  };
  const boxAt = (c, C, x, y, w, h, title, sub, on) => {
    c.fillStyle = C.surface2; c.strokeStyle = on === false ? C.faint : C.text; c.lineWidth = 1.5;
    c.fillRect(x, y, w, h); c.strokeRect(x, y, w, h);
    c.fillStyle = on === false ? C.faint : C.text; c.textAlign = 'center';
    c.fillText(title, x + w / 2, y + h / 2 + (sub ? -3 : 4));
    if (sub) { c.fillStyle = C.muted; c.fillText(sub, x + w / 2, y + h / 2 + 12); }
  };
  // Coulomb friction with sticking: one explicit step of J dω/dt = T − Tf·sign(ω)
  const frictionStep = (w, T, Tf, J, h) => {
    if (Math.abs(w) < 1e-9) {
      if (Math.abs(T) <= Tf) return 0;
      return h * (T - Tf * Math.sign(T)) / J;
    }
    const w2 = w + h * (T - Tf * Math.sign(w)) / J;
    return Math.sign(w2) !== Math.sign(w) ? 0 : w2;
  };

  /* ================================================================ sv-loop */
  Hyper.sim('sv-loop', {
    title: 'Open loop or closed loop: a servo holds its table',
    blurb: `A 750 W servo motor turns a heavy rotary table (1.8 kg·m²) through a 50 : 1 reducer. The block diagram shows the loop; the table shows the command (dashed) and where the table really is (solid). In **open loop** the drive plays a torque pattern computed for a table without friction and never looks at the encoder. In **closed loop** it compares the encoder with the command many times a second and corrects.

**Try this**
- Closed loop, friction 0: move the target. The table swings over and stops on the mark. Now open the loop and do the same: without friction it still lands, because the plan was right.
- Raise the friction to 40 N·m and move the target in open loop: the table stops short, and the error stays. Close the loop: the drive sees the error and pushes until it is gone.
- Press *Push the table* in both modes: open loop, it stays where it was pushed; closed loop, the error jumps, the torque answers and the table returns.
- Lower the loop bandwidth to 5 Hz: the table is soft and slow; at 40 Hz it is stiff and quick. The motor torque never exceeds its peak of 7.2 N·m.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const [g1] = graphs(box, 1);
      const I = 50, eta = 0.9, Jt = 1.8, Jm = 1.3e-4, J = Jt + Jm * I * I, TmPk = 7.16, TmR = 2.39;
      const Tmax = TmPk * I * eta, wmax = TAU * 3000 / 60 / I;         // at the table: 322 N·m, 6.28 rad/s (60 rpm)
      let V = null, th = 0, w = 0, integ = 0, cmd = 0, T = 0, t = 0, push = 0, plan = null, planT = 0, planSign = 1, ang = 0, lastPlot = -1;
      const hist = [];
      const newPlan = (from, to) => {
        const d = to - from;
        planSign = Math.sign(d) || 1; planT = 0;
        plan = Math.abs(d) > 1e-6 ? M.move({ dist: Math.abs(d), vmax: wmax, acc: 0.8 * Tmax / J, dec: 0.8 * Tmax / J }) : null;
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Loop', options: [['Closed loop (servo)', 'closed'], ['Open loop (plays a torque pattern)', 'open']], value: 'closed' },
        { id: 'target', label: 'Target angle', min: -180, max: 180, step: 5, value: 90, unit: '°' },
        { id: 'fric', label: 'Friction at the table', min: 0, max: 80, step: 1, value: 20, unit: 'N·m' },
        { id: 'bw', label: 'Loop bandwidth (closed loop)', min: 5, max: 40, step: 1, value: 20, unit: 'Hz' },
        { type: 'buttons', items: [{ id: 'push', label: 'Push the table', primary: true }, { id: 'home', label: 'Target 0°' }] }
      ], (id, v) => {
        if (id === 'target') { const old = cmd; cmd = v * Math.PI / 180; newPlan(old, cmd); }
        if (id === 'home') { const old = cmd; cmd = 0; ctl.set('target', 0); newPlan(old, cmd); }
        if (id === 'push') push = 0.15;
        if (id === 'mode') { integ = 0; plan = null; }
      });
      V = ctl.values; cmd = V.target * Math.PI / 180; th = cmd;
      const ro = kit.readout(box.side, [['cmd', 'Command'], ['act', 'Table position'], ['err', 'Error'], ['tq', 'Motor torque'], ['n', 'Motor speed']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'table angle (°)' }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const sub = 40, h = dt / sub, Kv = J * TAU * V.bw, Ki = Kv * TAU * V.bw / 5, Kp = TAU * V.bw / 4;
        for (let k = 0; k < sub; k++) {
          let Tm;
          if (V.mode === 'closed') {
            const wc = clamp(Kp * (cmd - th), -wmax, wmax), ev = wc - w;
            Tm = Kv * ev + Ki * integ;
            if (Math.abs(Tm) < Tmax || Math.sign(ev) !== Math.sign(integ)) integ += ev * h;     // anti-windup
            Tm = clamp(Tm, -Tmax, Tmax);
          } else {
            Tm = 0;
            if (plan) { planT += h; if (planT < plan.tTotal) Tm = planSign * J * plan.at(planT).a; else plan = null; }
          }
          const Tp = push > 0 ? 250 : 0;
          if (push > 0) push -= h;
          w = frictionStep(w, Tm + Tp, V.fric, J, h);
          th += w * h; T = Tm;
        }
        const err = (cmd - th) * 180 / Math.PI, Tmotor = T / (I * eta);
        ro.set('cmd', (cmd * 180 / Math.PI).toFixed(1) + '°');
        ro.set('act', (th * 180 / Math.PI).toFixed(1) + '°');
        ro.set('err', err.toFixed(2) + '°' + (V.mode === 'open' && Math.abs(err) > 0.5 ? ' — nobody knows' : ''));
        ro.set('tq', Tmotor.toFixed(2) + ' N·m (' + (100 * Math.abs(Tmotor) / TmR).toFixed(0) + ' % of rated)');
        ro.set('n', rpmOf(w * I).toFixed(0) + ' rpm');
        hist.push([t, cmd * 180 / Math.PI, th * 180 / Math.PI]);
        while (hist.length && hist[0][0] < t - 6) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          p1.set({ x: { label: 'time (s)', min: Math.max(0, t - 6), max: Math.max(6, t) }, series: [{ pts: hist.map(r => [r[0], r[1]]), label: 'command', dash: [5, 4] }, { pts: hist.map(r => [r[0], r[2]]), label: 'table' }] });
        }
        // drawing
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 260);
        const closed = V.mode === 'closed';
        boxAt(c, C, 14, 40, 78, 44, 'Controller', 'command');
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(122, 62, 12, 0, TAU); c.stroke();
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('Σ', 122, 66);
        boxAt(c, C, 152, 40, 70, 44, 'Drive', closed ? 'PI loops' : 'plays a plan');
        boxAt(c, C, 244, 40, 72, 44, 'Motor', '750 W');
        boxAt(c, C, 338, 40, 50, 44, '50 : 1', 'reducer');
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(92, 62); c.lineTo(110, 62); c.moveTo(134, 62); c.lineTo(152, 62); c.moveTo(222, 62); c.lineTo(244, 62); c.moveTo(316, 62); c.lineTo(338, 62); c.moveTo(388, 62); c.lineTo(410, 62); c.stroke();
        // the feedback path, lit when the loop is closed
        c.strokeStyle = closed ? C.accent : C.faint; c.setLineDash(closed ? [] : [4, 4]); c.lineWidth = closed ? 2.5 : 1.5;
        c.beginPath(); c.moveTo(280, 84); c.lineTo(280, 120); c.lineTo(122, 120); c.lineTo(122, 74); c.stroke(); c.setLineDash([]);
        c.fillStyle = closed ? C.accent : C.faint; c.fillText(closed ? 'encoder → feedback' : 'encoder ignored', 200, 136);
        if (closed) { const ph = (t * 1.5) % 1, pts = [[280, 84], [280, 120], [122, 120], [122, 74]], L = [36, 158, 46], tot = 240; let d = ph * tot; for (let s = 0; s < 3; s++) { if (d <= L[s]) { const a = pts[s], b = pts[s + 1], u = d / L[s]; kit.dot(c, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 3.5, C.accent); break; } d -= L[s]; } }
        c.fillStyle = C.muted; c.fillText('−', 112, 84);
        // encoder disc on the motor
        ang += w * I * dt / 30;
        c.save(); c.translate(280, 100); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(0, 0, 9, 0, TAU); c.stroke();
        for (let k = 0; k < 12; k++) { const a = ang + k * TAU / 12; c.beginPath(); c.moveTo(6 * Math.cos(a), 6 * Math.sin(a)); c.lineTo(9 * Math.cos(a), 9 * Math.sin(a)); c.stroke(); }
        c.restore();
        // torque bar
        const fr = clamp(Math.abs(T) / Tmax, 0, 1);
        c.fillStyle = C.faint; c.fillRect(20, 190, 360, 12); c.fillStyle = fr > 0.95 ? C.bad : C.accent; c.fillRect(20, 190, 360 * fr, 12);
        c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('motor torque ' + Math.abs(T / (I * eta)).toFixed(2) + ' N·m of 7.2 N·m peak', 20, 218);
        c.fillText(push > 0 ? 'pushing the table with 250 N·m' : V.fric > 0 ? 'friction ' + V.fric + ' N·m opposes motion' : 'no friction', 20, 238);
        // the table, seen from above
        const cx = 520, cy = 130, R = 92;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (let k = 0; k < 12; k++) { const a = k * TAU / 12 - Math.PI / 2; c.beginPath(); c.moveTo(cx + (R - 8) * Math.cos(a), cy + (R - 8) * Math.sin(a)); c.lineTo(cx + R * Math.cos(a), cy + R * Math.sin(a)); c.stroke(); }
        const ca = cmd - Math.PI / 2, ta = th - Math.PI / 2;
        c.strokeStyle = C.accent; c.setLineDash([6, 4]); c.lineWidth = 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + (R + 12) * Math.cos(ca), cy + (R + 12) * Math.sin(ca)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, cx, cy, cx + (R - 14) * Math.cos(ta), cy + (R - 14) * Math.sin(ta), Math.abs(err) > 1 ? C.bad : C.ok, 4);
        kit.dot(c, cx, cy, 6, C.text);
        c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('dashed: command · arrow: table', cx, 250);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-ac-envelope */
  // typical 200 V class motors: rated and peak torque (N·m), rated and maximum speed, the speed where the peak line starts
  // to fall (n1) and where the voltage line would reach zero torque (n0) at 230 V mains, rotor inertia (kg·cm²), rated current (A rms)
  const ACM = {
    p100: { name: '100 W, 40 mm, low inertia', Tr: 0.318, Tp: 0.955, nr: 3000, nmax: 6000, n1: 4500, n0: 7000, Jm: 0.051, Ir: 0.9 },
    p400: { name: '400 W, 60 mm, low inertia', Tr: 1.27, Tp: 3.82, nr: 3000, nmax: 6000, n1: 4000, n0: 7000, Jm: 0.37, Ir: 2.7 },
    p750: { name: '750 W, 80 mm, low inertia', Tr: 2.39, Tp: 7.16, nr: 3000, nmax: 5000, n1: 3500, n0: 6000, Jm: 1.3, Ir: 4.8 },
    p1k: { name: '1 kW, 130 mm, medium inertia', Tr: 4.77, Tp: 14.3, nr: 2000, nmax: 3000, n1: 2200, n0: 3600, Jm: 7, Ir: 5.7 },
    p2k: { name: '2 kW, 130 mm, medium inertia', Tr: 9.55, Tp: 28.6, nr: 2000, nmax: 3000, n1: 2200, n0: 3600, Jm: 14, Ir: 11 }
  };
  const envelope = (m, Vs) => {
    const k = Vs / 230, nk = m.n1 * k, nz = m.n0 * k;
    const peak = n => n > m.nmax ? 0 : Math.max(0, Math.min(m.Tp, m.Tp * (nz - n) / Math.max(1, nz - nk)));
    const cont = n => n > m.nmax ? 0 : Math.min(peak(n), n <= m.nr ? m.Tr : m.Tr * (1 - 0.3 * (n - m.nr) / (m.nmax - m.nr)));
    return { peak, cont };
  };
  Hyper.sim('sv-ac-envelope', {
    title: 'An AC servo motor and its speed–torque envelope',
    blurb: `Inside the motor, the drive places three sinusoidal phase currents so that the stator field (orange) always leads the rotor's magnets by 90 electrical degrees — it reads the rotor angle from the encoder ring at the back. The current, and so the field, grows with the torque asked for. The graph is the motor's datasheet envelope: the **continuous** zone under the lower line, the **intermittent** zone up to about three times rated torque. The dots are a repeating move — accelerate, run, decelerate, dwell — and the RMS torque of the whole cycle.

**Try this**
- With the 400 W motor and a 2 kg·cm² load, shorten the acceleration: the acceleration and deceleration dots climb towards the peak line. When one passes it, the motor cannot follow the move.
- Lengthen the dwell: peaks stay the same, but the RMS torque falls — the motor gets time to cool.
- Choose 200 V mains: the peak line bends down earlier at high speed. Run the move at 5500 rpm and see it fail on weak mains.
- Put 60 kg·cm² on the 750 W motor, then on the 1 kW medium-inertia motor: the inertia ratio drops from 46 : 1 to under 9 : 1. Lengthen the ramp and lower the speed until the move fits each of them.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      let V = null, t = 0, rot = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(ACM).map(([k, m]) => [m.name, k]), value: 'p400' },
        { id: 'Vs', type: 'select', label: 'Mains', options: [['230 V (nominal)', 230], ['200 V (weak mains)', 200]], value: 230 },
        { id: 'n', label: 'Speed of the move', min: 100, max: 6000, step: 50, value: 3000, unit: 'rpm' },
        { id: 'ta', label: 'Acceleration (and deceleration) time', min: 10, max: 500, value: 60, unit: 'ms', log: true, sig: 2 },
        { id: 'JL', label: 'Load inertia (at the motor)', min: 0.05, max: 200, value: 2, unit: 'kg·cm²', log: true, sig: 2 },
        { id: 'TL', label: 'Friction, % of rated torque', min: 0, max: 80, step: 1, value: 10, unit: '%' },
        { id: 'dw', label: 'Dwell between moves', min: 0, max: 2, step: 0.05, value: 0.3, unit: 's' }
      ], () => { lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Rated / peak torque'], ['ratio', 'Inertia ratio'], ['pk', 'Peak torque needed'], ['rms', 'RMS torque'], ['ok', 'Verdict']]);
      const pE = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const pT = kit.plot(g2, { x: { label: 'time in the cycle (s)', min: 0 }, y: { label: 'motor torque (N·m)' }, legend: true }, 200);
      const cycle = () => {
        const m = ACM[V.motor], w = V.n * TAU / 60, ta = V.ta / 1000, tc = 0.2, td = V.dw, Tf = V.TL / 100 * m.Tr;
        const mt = M.moveTorque({ Jm: m.Jm * 1e-4, Jload: V.JL * 1e-4, ratio: 1, acc: w / ta, Tload: Tf });
        const Tacc = mt.Tpeak, Tdec = -mt.Tacc + Tf;
        const segs = [[Tacc, ta], [Tf, tc], [Tdec, ta], [0, td]];
        const tot = 2 * ta + tc + td, rms = M.rmsTorque(segs.filter(s => s[1] > 0));
        const navg = (V.n * ta + V.n * tc) / tot;
        return { m, ta, tc, td, Tf, Tacc, Tdec, segs, tot, rms, navg, ratio: mt.inertiaRatio };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const cy = cycle(), m = cy.m, env = envelope(m, V.Vs);
        const okPk = Math.abs(cy.Tacc) <= env.peak(V.n) && Math.abs(cy.Tdec) <= env.peak(V.n) && V.n <= m.nmax;
        const okRms = cy.rms <= env.cont(Math.min(cy.navg, m.nmax));
        ro.set('m', m.Tr.toFixed(2) + ' / ' + m.Tp.toFixed(2) + ' N·m, rotor ' + m.Jm + ' kg·cm²');
        ro.set('ratio', (V.JL / m.Jm).toFixed(1) + ' : 1');
        ro.set('pk', Math.abs(cy.Tacc).toFixed(2) + ' N·m (available at ' + V.n.toFixed(0) + ' rpm: ' + env.peak(V.n).toFixed(2) + ')');
        ro.set('rms', cy.rms.toFixed(2) + ' N·m (continuous: ' + env.cont(Math.min(cy.navg, m.nmax)).toFixed(2) + ')');
        ro.set('ok', V.n > m.nmax ? 'above the maximum speed' : !okPk ? 'peak torque not available — lengthen the ramp or choose a bigger motor' : !okRms ? 'RMS above continuous — it will overheat' : 'fits (' + (100 * cy.rms / m.Tr).toFixed(0) + ' % of rated RMS)');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const nTop = Math.max(m.nmax * 1.05, V.n), pk = [], co = [];
          for (let i = 0; i <= 120; i++) { const n = nTop * i / 120; pk.push([n, env.peak(n)]); co.push([n, env.cont(n)]); }
          const C = kit.colors();
          pE.set({ x: { label: 'speed (rpm)', min: 0, max: nTop }, y: { label: 'torque (N·m)', min: 0, max: Math.max(m.Tp * 1.15, Math.abs(cy.Tacc) * 1.1) },
            series: [{ pts: pk, label: 'intermittent (peak) limit', color: C.warn }, { pts: co, label: 'continuous limit', color: C.ok },
              { pts: [[0, Math.abs(cy.Tacc)], [V.n, Math.abs(cy.Tacc)]], label: 'accelerating', color: C.bad, dash: [4, 3] }],
            marks: [{ x: V.n, y: Math.abs(cy.Tacc), label: 'acc' }, { x: V.n, y: Math.abs(cy.Tdec), label: 'dec' }, { x: V.n, y: cy.Tf, label: 'run' }, { x: cy.navg, y: cy.rms, label: 'RMS' }] });
          const tp = []; let s = 0;
          for (const [T, d] of cy.segs) { if (d <= 0) continue; tp.push([s, T], [s + d, T]); s += d; }
          pT.set({ x: { label: 'time in the cycle (s)', min: 0, max: cy.tot }, series: [{ pts: tp, label: 'torque' }], hlines: [{ y: m.Tr, label: 'rated' }, { y: m.Tp, label: 'peak' }, { y: -m.Tp, label: '−peak' }, { y: cy.rms, label: 'RMS' }] });
        }
        // where in the cycle are we (played 4 × slower): speed and torque now
        const tc = (t / 4) % cy.tot, ta = cy.ta;
        let wNow, Tnow;
        if (tc < ta) { wNow = V.n * tc / ta; Tnow = cy.Tacc; } else if (tc < ta + cy.tc) { wNow = V.n; Tnow = cy.Tf; }
        else if (tc < 2 * ta + cy.tc) { wNow = V.n * (1 - (tc - ta - cy.tc) / ta); Tnow = cy.Tdec; } else { wNow = 0; Tnow = 0; }
        rot += wNow / 60 * TAU * dt / 200;                 // drawn 200 × slower than real
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 230);
        const cx = 150, cyy = 115, pp = 4, elec = pp * rot;
        // stator slots lit by the three phase currents
        const Iamp = Math.min(1, Math.abs(Tnow) / m.Tp), cols = ['0 75% 55%', '45 90% 50%', '215 75% 55%'];
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cyy, 100, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cyy, 74, 0, TAU); c.stroke();
        const qa = elec + Math.sign(Tnow || 1) * Math.PI / 2;
        for (let k = 0; k < 12; k++) {
          const a = k * TAU / 12, ph = k % 3, iph = Math.cos(pp * a - qa - ph * TAU / 3) * Iamp;
          c.fillStyle = 'hsl(' + cols[ph] + ' / ' + (0.15 + 0.8 * Math.abs(iph)).toFixed(2) + ')';
          c.beginPath(); c.arc(cx + 87 * Math.cos(a), cyy + 87 * Math.sin(a), 9, 0, TAU); c.fill();
          c.fillStyle = C.text; c.textAlign = 'center'; c.fillText(iph >= 0 ? '•' : '×', cx + 87 * Math.cos(a), cyy + 87 * Math.sin(a) + 4);
        }
        // rotor with 8 magnet poles
        for (let k = 0; k < 8; k++) {
          const a0 = rot + k * TAU / 8;
          c.fillStyle = k % 2 ? 'hsl(215 70% 50% / .7)' : 'hsl(0 70% 50% / .7)';
          c.beginPath(); c.moveTo(cx, cyy); c.arc(cx, cyy, 64, a0 + 0.05, a0 + TAU / 8 - 0.05); c.closePath(); c.fill();
        }
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cyy, 22, 0, TAU); c.fill();
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cyy, 7, 0, TAU); c.fill();
        if (Iamp > 0.01) { const fa = qa / pp; kit.arrow(c, cx, cyy, cx + (30 + 40 * Iamp) * Math.cos(fa), cyy + (30 + 40 * Iamp) * Math.sin(fa), 'hsl(22 90% 55%)', 3); }
        c.fillStyle = C.muted; c.fillText('8 poles, drawn 200 × slower', cx, 228);
        // encoder ring and the phase currents as sine waves
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '13px ' + font();
        c.fillText(m.name, 290, 30);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText('now: ' + wNow.toFixed(0) + ' rpm, ' + Tnow.toFixed(2) + ' N·m, ' + (m.Ir * Math.abs(Tnow) / m.Tr).toFixed(1) + ' A rms', 290, 50);
        c.fillText('phase currents over one electrical turn:', 290, 80);
        for (let ph = 0; ph < 3; ph++) {
          c.strokeStyle = 'hsl(' + cols[ph] + ')'; c.lineWidth = 2; c.beginPath();
          for (let x = 0; x <= 300; x += 4) { const a = x / 300 * TAU, y = 140 - 40 * Iamp * Math.cos(a - ph * TAU / 3); x ? c.lineTo(290 + x, y) : c.moveTo(290 + x, y); }
          c.stroke();
        }
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(290, 140); c.lineTo(590, 140); c.stroke();
        const xr = 290 + ((elec % TAU) + TAU) % TAU / TAU * 300;
        c.strokeStyle = C.accent; c.beginPath(); c.moveTo(xr, 95); c.lineTo(xr, 185); c.stroke();
        c.fillStyle = C.accent; c.fillText('rotor angle from the encoder', Math.min(xr + 4, 450), 200);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-dc-step */
  // brushed DC servo motors: V supply, R Ω, L H, K N·m/A, Jm kg·m², rated current A, commutator segments, tacho V/krpm
  const DCS = {
    iron: { name: 'Iron-core, 24 V, 60 W', V: 24, R: 0.9, L: 1.5e-3, K: 0.055, Jm: 1e-5, Ir: 3, seg: 13, kg: 7, fc: 1500 },
    coreless: { name: 'Coreless, 24 V, 20 W', V: 24, R: 2.0, L: 0.15e-3, K: 0.025, Jm: 1e-6, Ir: 1.1, seg: 7, kg: 3, fc: 3000 },
    legacy: { name: 'Machine-tool DC servo, 100 V, 1 kW', V: 100, R: 0.4, L: 3e-3, K: 0.45, Jm: 2.5e-3, Ir: 10.6, seg: 29, kg: 20, fc: 800 }
  };
  Hyper.sim('sv-dc-step', {
    title: 'A DC servo answers a speed step',
    blurb: `A brushed DC servo motor with a tachogenerator, on a four-quadrant amplifier: a PI speed loop (the tacho is its feedback) asks for a current, and a fast inner current loop delivers it, never beyond the current limit. The load has the same inertia as the rotor. Press *Run the step*: the graphs show the speed and the armature current after a step in the speed command, replayed slowly on the drawing.

**Try this**
- Watch the current jump to its limit and stay there while the speed climbs in a straight line — constant current, constant torque, constant acceleration $K I_{max}/J$ — then drop back to the small current the load needs.
- Raise the current limit from 1 × to 5 × rated: the ramp gets steeper and the step faster. The brushes spark harder at high current.
- Raise the speed-loop bandwidth: the approach to the target gets quicker, until it overshoots. Tick *tacho ripple*: at high bandwidth the few-per-cent ripple of the tachogenerator comes out as large current ripple.
- Compare the coreless motor: its tiny inductance lets the current jump almost instantly, and it reaches over 5000 rpm in about 15 ms. The 1 kW machine-tool motor is heavier and slower, and its larger inductance shows as a slope on the current's rise.
- Ask for 90 % of the no-load speed with the limit at 5 ×: near the top the back-EMF leaves too little voltage and the current falls off before the target is reached.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      let V = null, res = null, replay = 0, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(DCS).map(([k, m]) => [m.name, k]), value: 'iron' },
        { id: 'step', label: 'Speed step, % of no-load speed', min: 10, max: 90, step: 1, value: 60, unit: '%' },
        { id: 'ilim', label: 'Current limit, × rated current', min: 1, max: 5, step: 0.1, value: 3, unit: '×' },
        { id: 'bw', label: 'Speed-loop bandwidth', min: 10, max: 300, value: 60, unit: 'Hz', log: true, sig: 2 },
        { id: 'load', label: 'Load torque, % of rated', min: 0, max: 100, step: 1, value: 20, unit: '%' },
        { id: 'rip', type: 'check', label: 'Tacho ripple (3 % at the commutator frequency)', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the step', primary: true }] }
      ], () => { res = run(); replay = 0; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['tc', 'Time constants τe, τm'], ['acc', 'Acceleration at the limit'], ['t90', 'Time to 90 % of the step'], ['ov', 'Overshoot'], ['ipk', 'Peak current']]);
      const pW = kit.plot(g1, { x: { label: 'time (ms)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 190);
      const pI = kit.plot(g2, { x: { label: 'time (ms)', min: 0 }, y: { label: 'armature current (A)' }, legend: true }, 190);
      function run() {
        const m = DCS[V.motor], J = 2 * m.Jm, Ilim = V.ilim * m.Ir, TL = V.load / 100 * m.K * m.Ir;
        const w0 = m.V / m.K, wT = V.step / 100 * w0;
        const wc = TAU * V.bw, Kpw = J * wc / m.K, Kiw = Kpw * wc / 4;
        const wi = TAU * m.fc, Kpi = m.L * wi, Kii = m.R * wi;
        const tRamp = wT * J / (m.K * Math.max(0.1, Ilim - TL / m.K)) + 6 / wc;
        const Tw = Math.max(0.004, 2.2 * tRamp), h = Math.min(m.L / m.R / 30, 1 / wc / 60, 2e-5), N = Math.ceil(Tw / h), every = Math.max(1, Math.floor(N / 500));
        let i = TL / m.K, w = 0, th = 0, Iw = TL / m.K, Ii = m.R * i, ipk = 0, wmax = 0, t90 = null;
        const out = [];
        for (let k = 0; k <= N; k++) {
          const t = k * h;
          const wm = w * (1 + (V.rip ? 0.03 * Math.sin(m.seg * th) : 0));
          const ew = wT - wm;
          let ic = Kpw * ew + Iw;
          const sat = Math.abs(ic) >= Ilim;
          ic = clamp(ic, -Ilim, Ilim);
          if (!sat || Math.sign(ew) !== Math.sign(Iw)) Iw += Kiw * ew * h;
          const ei = ic - i;
          let u = Kpi * ei + Ii;
          const usat = Math.abs(u) >= m.V;
          u = clamp(u, -m.V, m.V);
          if (!usat || Math.sign(ei) !== Math.sign(Ii)) Ii += Kii * ei * h;
          i += h * (u - m.R * i - m.K * w) / m.L;
          w += h * (m.K * i - TL) / J;
          th += w * h;
          ipk = Math.max(ipk, Math.abs(i)); wmax = Math.max(wmax, w);
          if (t90 == null && w >= 0.9 * wT) t90 = t;
          if (k % every === 0) out.push([t * 1000, rpmOf(w), i, ic, rpmOf(wT), th]);
        }
        return { m, J, Ilim, wT, out, ipk, over: Math.max(0, wmax / wT - 1), t90, acc: (m.K * Ilim - TL) / J, Tw };
      }
      res = run();
      const loop = kit.loop(dt => {
        if (!res || !res.out.length) return;
        const m = res.m, n = res.out.length;
        replay = Math.min(1, replay + dt / 3);
        const r = res.out[Math.min(n - 1, Math.floor(replay * (n - 1)))];
        ro.set('tc', (1000 * m.L / m.R).toFixed(2) + ' ms, ' + (1000 * res.J * m.R / (m.K * m.K)).toFixed(1) + ' ms');
        ro.set('acc', (res.acc).toFixed(0) + ' rad/s² = (K·Imax − T_load)/J');
        ro.set('t90', res.t90 != null ? (1000 * res.t90).toFixed(1) + ' ms' : 'not reached');
        ro.set('ov', (100 * res.over).toFixed(1) + ' %');
        ro.set('ipk', res.ipk.toFixed(1) + ' A (limit ' + res.Ilim.toFixed(1) + ' A)');
        if (replay < 1 || !res.plotted) {
          res.plotted = true;
          const C = kit.colors();
          pW.set({ x: { label: 'time (ms)', min: 0, max: res.Tw * 1000 }, series: [{ pts: res.out.map(q => [q[0], q[4]]), label: 'command', dash: [5, 4], color: C.muted }, { pts: res.out.map(q => [q[0], q[1]]), label: 'speed' }], marks: [{ x: r[0], y: r[1] }] });
          pI.set({ x: { label: 'time (ms)', min: 0, max: res.Tw * 1000 }, series: [{ pts: res.out.map(q => [q[0], q[2]]), label: 'current' }], hlines: [{ y: res.Ilim, label: 'limit' }, { y: m.Ir, label: 'rated' }], marks: [{ x: r[0], y: r[2] }] });
        }
        // drawing: the motor with its armature, commutator and brushes, the tacho, the current bar
        ang += (r[1] / 60) * TAU * dt / 60;
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 210);
        const cx = 170, cy = 100;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(70, 30, 200, 140); c.strokeRect(70, 30, 200, 140);
        c.fillStyle = 'hsl(0 70% 50% / .55)'; c.fillRect(72, 32, 196, 16); c.fillStyle = 'hsl(215 70% 50% / .55)'; c.fillRect(72, 152, 196, 16);
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('N', cx, 44); c.fillText('S', cx, 164);
        c.save(); c.translate(cx, cy); c.rotate(ang); c.strokeStyle = C.accent; c.lineWidth = 3;
        for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 4); c.beginPath(); c.moveTo(-44, 0); c.lineTo(44, 0); c.stroke(); }
        c.restore();
        // commutator and brushes, sparking at high current
        c.fillStyle = C.muted; c.beginPath(); c.arc(300, cy, 16, 0, TAU); c.fill();
        c.save(); c.translate(300, cy); c.rotate(ang); c.strokeStyle = C.bg2; c.lineWidth = 1.5; for (let k = 0; k < 8; k++) { c.rotate(TAU / 8); c.beginPath(); c.moveTo(0, 0); c.lineTo(16, 0); c.stroke(); } c.restore();
        c.fillStyle = C.text; c.fillRect(292, cy - 30, 16, 12); c.fillRect(292, cy + 18, 16, 12);
        const spark = Math.abs(r[2]) / m.Ir;
        if (spark > 1.5) { c.fillStyle = 'hsl(48 100% 60%)'; for (let k = 0; k < Math.min(6, Math.floor(spark)); k++) { kit.dot(c, 300 + (Math.random() - 0.5) * 16, cy - 18 + Math.random() * 4, 1.8, 'hsl(48 100% 60%)'); kit.dot(c, 300 + (Math.random() - 0.5) * 16, cy + 16 + Math.random() * 4, 1.8, 'hsl(48 100% 60%)'); } }
        c.fillStyle = C.muted; c.fillText('brushes', 300, cy + 48);
        // shaft to the tachogenerator
        c.fillStyle = C.text; c.fillRect(316, cy - 3, 60, 6);
        boxAt(c, C, 376, cy - 26, 70, 52, 'tacho', (m.kg * r[1] / 1000).toFixed(1) + ' V');
        c.fillStyle = C.muted; c.textAlign = 'left';
        c.fillText(m.name, 470, 40);
        c.fillText('speed ' + r[1].toFixed(0) + ' rpm', 470, 64);
        c.fillText('current ' + r[2].toFixed(2) + ' A', 470, 84);
        c.fillText('t = ' + r[0].toFixed(1) + ' ms (replayed slowly)', 470, 104);
        const fr = clamp(Math.abs(r[2]) / res.Ilim, 0, 1);
        c.fillStyle = C.faint; c.fillRect(70, 188, 380, 10); c.fillStyle = fr > 0.98 ? C.warn : C.accent; c.fillRect(70, 188, 380 * fr, 10);
        c.fillStyle = C.muted; c.fillText('current as a share of the limit', 460, 197);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-rc-servo */
  Hyper.sim('sv-rc-servo', {
    title: 'An RC servo: pulse width in, angle out',
    blurb: `The oscilloscope shows two 20 ms frames of the command: a pulse whose **width** is the position. Below it, the servo's own reference pulse, made from its potentiometer — its width follows the horn's actual angle — and the motor drive that their difference produces. The servo is a standard size (11 kg·cm at 6 V); its horn can carry a weight.

**Try this**
- Move the pulse width between 1.0 and 2.0 ms: the horn follows, ±45° about the centre at 1.5 ms. Watch the reference pulse catch up with the command.
- Hang 6 kg·cm on the horn with the *analogue* servo: it sags several degrees, because it only pushes once per frame, for a time proportional to the error. Switch to *digital*: the sag almost disappears and the drive becomes a steady buzz.
- Tick *sweep*: the pulse swings from 1 to 2 ms faster than the servo can turn — the horn lags, limited by its speed rating.
- Push the pulse to 0.8 or 2.2 ms: the horn hits its end stop at ±57° and the motor stalls at full current. That is how servos are burnt and gears stripped.
- Drop the supply to 4.8 V: less torque and speed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const [g1] = graphs(box, 1);
      let V = null, th = 0, w = 0, t = 0, u = 0, frameT = 0, drive = 0, cur = 0, lastPlot = -1, tpNow = 1.5, udig = 0, digT = 0, wS = 0;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'tp', label: 'Pulse width', min: 0.8, max: 2.2, step: 0.01, value: 1.5, unit: 'ms' },
        { id: 'type', type: 'select', label: 'Servo type', options: [['Analogue (drives once per 20 ms frame)', 'ana'], ['Digital (drives at 333 Hz)', 'dig']], value: 'ana' },
        { id: 'load', label: 'Weight on the horn (torque)', min: -10, max: 10, step: 0.5, value: 0, unit: 'kg·cm' },
        { id: 'vs', type: 'select', label: 'Supply', options: [['6.0 V', 6], ['4.8 V', 4.8]], value: 6 },
        { id: 'sweep', type: 'check', label: 'Sweep 1 ↔ 2 ms (1.2 s period)', value: false }
      ]);
      V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Pulse · duty'], ['c', 'Commanded angle'], ['a', 'Horn angle · error'], ['i', 'Motor current'], ['s', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'angle (°)', min: -70, max: 70 }, legend: true }, 170);
      const KGCM = 0.0980665, STOP = 57, K = 90;           // 90° per ms; mechanical stops at ±57°
      const loop = kit.loop(dt => {
        t += dt;
        const six = V.vs === 6, Ts = (six ? 11 : 9) * KGCM, w0 = (60 / (six ? 0.13 : 0.16)) * Math.PI / 180, J = Ts * 0.015 / w0, Is = six ? 1.5 : 1.2;
        tpNow = V.sweep ? 1.5 + 0.5 * Math.sin(TAU * t / 1.2) : V.tp;
        const thc = K * (tpNow - 1.5);
        const sub = 60, h = dt / sub, TL = V.load * KGCM, Tfr = 0.05 * Ts;
        let Tm = 0, iAvg = 0;
        for (let k = 0; k < sub; k++) {
          const e = thc - th * 180 / Math.PI;
          if (V.type === 'ana') {
            frameT += h;
            if (frameT >= 0.02) { frameT -= 0.02; drive = Math.abs(e) < 0.45 ? 0 : Math.sign(e) * Math.min(0.02, Math.abs(e) / 6 * 0.02); }
            u = frameT < Math.abs(drive) ? Math.sign(drive) : 0;
          } else {
            digT += h;
            if (digT >= 0.003) { digT -= 0.003; udig = Math.abs(e) < 0.1 ? 0 : clamp(e / 2, -1, 1); }
            u = udig; frameT = (frameT + h) % 0.02;
          }
          Tm = clamp(Ts * (u - w / w0), -Ts, Ts);        // between pushes the bridge shorts the motor: it brakes
          const Tnet = Tm - TL;
          w = frictionStep(w, Tnet, Tfr, J, h);
          th += w * h;
          const lim = STOP * Math.PI / 180;
          if (th > lim) { th = lim; w = Math.min(0, w); } else if (th < -lim) { th = -lim; w = Math.max(0, w); }
          iAvg += (u !== 0 ? 0.15 + (Is - 0.15) * Math.abs(Tm) / Ts : 0.01) / sub;
        }
        cur += (iAvg - cur) * Math.min(1, dt * 10);
        wS += (Math.abs(w) - wS) * Math.min(1, dt * 5);
        const thd = th * 180 / Math.PI, err = thc - thd, atStop = Math.abs(thd) >= STOP - 0.01 && Math.abs(thc) > STOP;
        ro.set('p', tpNow.toFixed(2) + ' ms · ' + (tpNow * 5).toFixed(1) + ' % at 50 Hz');
        ro.set('c', thc.toFixed(1) + '°' + (Math.abs(thc) > STOP ? ' — beyond the end stop' : ''));
        ro.set('a', thd.toFixed(1) + '° · ' + err.toFixed(1) + '°');
        ro.set('i', cur.toFixed(2) + ' A (stall ' + Is.toFixed(1) + ' A)');
        ro.set('s', atStop ? 'STALLED against the end stop — heating!' : Math.abs(err) > 2 && wS < 1 ? 'sagging under the load' : wS > 0.3 ? 'moving' : 'holding');
        hist.push([t, thc, thd]); while (hist.length && hist[0][0] < t - 4) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) { lastPlot = t; p1.set({ x: { label: 'time (s)', min: Math.max(0, t - 4), max: Math.max(4, t) }, series: [{ pts: hist.map(r => [r[0], r[1]]), label: 'command', dash: [5, 4] }, { pts: hist.map(r => [r[0], r[2]]), label: 'horn' }] }); }
        // drawing: the oscilloscope and the servo
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 260);
        const sx = 20, sw = 340, ms = sw / 40;                      // 40 ms across
        c.fillStyle = C.surface; c.fillRect(sx, 10, sw, 240); kit.grid(c, sx, 10, sw, 240, ms * 5, C.grid);
        const trace = (y0, hgt, fn, col, lab) => {
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          for (let x = 0; x <= sw; x++) { const tt = x / ms, y = y0 - hgt * fn(tt); x ? c.lineTo(sx + x, y) : c.moveTo(sx + x, y); }
          c.stroke(); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText(lab, sx + 4, y0 - hgt - 6);
        };
        const tref = 1.5 + thd / K;
        trace(70, 40, tt => (tt % 20) < tpNow ? 1 : 0, C.accent, 'command pulse: ' + tpNow.toFixed(2) + ' ms every 20 ms');
        trace(140, 40, tt => (tt % 20) < tref ? 1 : 0, C.series[2], 'reference from the potentiometer: ' + tref.toFixed(2) + ' ms');
        const ft = frameT * 1000;
        trace(230, 30, tt => {
          if (V.type === 'dig') return u > 0 ? 0.5 + 0.5 * ((tt * 3) % 1 < Math.abs(udig) ? 1 : 0) : u < 0 ? -0.5 - 0.5 * ((tt * 3) % 1 < Math.abs(udig) ? 1 : 0) : 0;
          const inF = tt % 20; return inF < Math.abs(drive) * 1000 ? Math.sign(drive) * 1 : 0;
        }, C.warn, 'motor drive (' + (V.type === 'ana' ? 'one push per frame' : 'PWM at a high rate') + ')');
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(sx + (ft % 40) * ms, 12); c.lineTo(sx + (ft % 40) * ms, 248); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('0 — 40 ms', sx + sw / 2, 258);
        // the servo from above, horn at the angle
        const cx = 510, cy = 120;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(cx - 40, cy - 70, 80, 150); c.strokeRect(cx - 40, cy - 70, 80, 150);
        c.fillStyle = C.faint; c.beginPath(); c.arc(cx, cy + 40, 16, 0, TAU); c.fill();
        c.fillStyle = C.muted; c.fillText('motor', cx, cy + 44);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        for (const tp of [1.0, 1.5, 2.0]) { const a = -Math.PI / 2 + K * (tp - 1.5) * Math.PI / 180; c.beginPath(); c.moveTo(cx + 70 * Math.cos(a), cy - 40 + 70 * Math.sin(a)); c.lineTo(cx + 80 * Math.cos(a), cy - 40 + 80 * Math.sin(a)); c.stroke(); c.fillStyle = C.muted; c.fillText(tp.toFixed(1) + ' ms', cx + 94 * Math.cos(a), cy - 40 + 94 * Math.sin(a)); }
        for (const s of [-STOP, STOP]) { const a = -Math.PI / 2 + s * Math.PI / 180; c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.moveTo(cx + 58 * Math.cos(a), cy - 40 + 58 * Math.sin(a)); c.lineTo(cx + 68 * Math.cos(a), cy - 40 + 68 * Math.sin(a)); c.stroke(); }
        const a = -Math.PI / 2 + th, ac = -Math.PI / 2 + thc * Math.PI / 180;
        c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy - 40); c.lineTo(cx + 64 * Math.cos(ac), cy - 40 + 64 * Math.sin(ac)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(cx, cy - 40); c.lineTo(cx + 55 * Math.cos(a), cy - 40 + 55 * Math.sin(a)); c.stroke(); c.lineCap = 'butt';
        kit.dot(c, cx, cy - 40, 7, C.muted, C.text);
        if (Math.abs(V.load) > 0.01) {
          // the load's force at the horn tip, pushing towards smaller angles for a positive load
          const hx = cx + 55 * Math.cos(a), hy = cy - 40 + 55 * Math.sin(a), sg = Math.sign(V.load), dx = sg * Math.sin(a), dy = -sg * Math.cos(a);
          kit.arrow(c, hx, hy, hx + 34 * dx, hy + 34 * dy, C.warn, 3);
          c.fillStyle = C.warn; c.fillText(Math.abs(V.load).toFixed(1) + ' kg·cm', hx + 48 * dx, hy + 48 * dy + 4);
        }
        if (atStop) { c.fillStyle = C.bad; c.fillText('end stop — stalled', cx, cy + 100); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-drive-bus */
  Hyper.sim('sv-drive-bus', {
    title: 'Inside a servo drive: the DC bus and the braking resistor',
    blurb: `A 750 W servo drive on 230 V mains runs a machine cycle again and again: accelerate, run, decelerate, wait. The rectifier charges the DC bus capacitors (1000 µF) to about 325 V; the inverter feeds the motor from them. When the motor brakes, it pushes energy back into the bus: the voltage climbs, and above 385 V the brake chopper switches the braking resistor on. Above 410 V the drive trips on **overvoltage**. The arrows show where the power flows.

**Try this**
- With the flywheel at 5 kg·cm² and 3000 rpm, shorten the deceleration: the bus bumps up but the capacitors can take it. Raise the inertia to 15 kg·cm²: the resistor glows at every stop.
- Choose *No braking resistor* and stop the heavy flywheel quickly: the bus shoots up and the drive trips. Press *Reset alarm*.
- Switch to the vertical axis: lowering the 40 kg load at constant speed regenerates all the time, not just when stopping — watch the average resistor power against the internal resistor's 20 W rating.
- Tick *STO* while the flywheel runs: the inverter stops switching and the flywheel coasts. On the vertical axis the load falls — which is why a vertical axis needs a holding brake.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const Cb = 1000e-6, Vn = 325, Von = 385, Voff = 375, Vov = 410, Gr = 100, Pctl = 15, Jm = 1.3e-4, Kt = 0.5, Rph = 0.8, Tpk = 7.16;
      const RES = { none: null, int: { R: 100, P: 20, name: 'internal 100 Ω, 20 W' }, ext: { R: 50, P: 200, name: 'external 50 Ω, 200 W' } };
      const mass = 40, lead = 0.01, Jscrew = 1e-4, zMax = 0.5;                   // vertical axis: 40 kg on a 10 mm lead screw, 500 mm of travel
      let V = null, Vb = Vn, chop = false, trip = '', tc = 0, w = 0, z = 0.02, t = 0, lastPlot = -1, pAvg = 0, pRes = 0, pMot = 0, pMains = 0, mainsAvg = 0, eStop = 0, eAcc = 0, ang = 0, phaseName = '';
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Load', options: [['Flywheel (rotating inertia)', 'fly'], ['Vertical axis: 40 kg on a 10 mm-lead screw', 'vert']], value: 'fly' },
        { id: 'JL', label: 'Flywheel inertia', min: 1, max: 30, step: 0.5, value: 5, unit: 'kg·cm²' },
        { id: 'n', label: 'Speed', min: 500, max: 3000, step: 50, value: 3000, unit: 'rpm' },
        { id: 'td', label: 'Deceleration time', min: 0.02, max: 1, step: 0.01, value: 0.15, unit: 's' },
        { id: 'res', type: 'select', label: 'Braking resistor', options: [['Internal 100 Ω (20 W rated)', 'int'], ['External 50 Ω (200 W rated)', 'ext'], ['No braking resistor', 'none']], value: 'int' },
        { id: 'sto', type: 'check', label: 'STO: safe torque off (inverter gates removed)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset alarm', primary: true }] }
      ], id => {
        if (id === 'reset') { trip = ''; tc = 0; }
        if (id === 'load') { ctl.show('JL', V.load === 'fly'); tc = 0; w = 0; z = 0.02; trip = ''; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['vb', 'DC bus voltage'], ['pm', 'Motor power'], ['pr', 'Braking resistor: now · average'], ['e', 'Energy returned per stop (or lowering stroke)'], ['pin', 'Mains power (average)'], ['al', 'Drive status']]);
      const pV = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'DC bus (V)', min: 300, max: 420 } }, 180);
      const pP = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'power (W)' }, legend: true }, 180);
      // the cycle: accelerate 0.15 s, run 0.4 s, decelerate td, wait 0.5 s; the vertical axis goes up, waits, then down
      const TA = 0.15, TR = 0.4, TW = 0.5;
      const profile = tt => {
        const wmax = V.n * TAU / 60, td = V.td, half = TA + TR + td + TW;
        const sgn = V.load === 'vert' && tt >= half ? -1 : 1, u = V.load === 'vert' ? tt % half : tt;
        if (u < TA) return { w: sgn * wmax * u / TA, a: sgn * wmax / TA, ph: 'accelerating' };
        if (u < TA + TR) return { w: sgn * wmax, a: 0, ph: 'running' };
        if (u < TA + TR + td) return { w: sgn * wmax * (1 - (u - TA - TR) / td), a: -sgn * wmax / td, ph: 'decelerating' };
        return { w: 0, a: 0, ph: 'waiting' };
      };
      const cycleLen = () => (V.load === 'vert' ? 2 : 1) * (TA + TR + V.td + TW);
      const loop = kit.loop(dt => {
        t += dt;
        const vert = V.load === 'vert', Jeq = vert ? Jm + Jscrew + mass * Math.pow(lead / TAU, 2) : Jm + V.JL * 1e-4;
        const Tg = vert ? mass * 9.81 * lead / TAU : 0, Tf = vert ? 0.05 : 0.05;
        const off = V.sto || !!trip, res = RES[V.res];
        const sub = 60, h = dt / sub;
        let sPm = 0, sPr = 0, sMains = 0;
        for (let k = 0; k < sub; k++) {
          let T = 0;
          if (!off) {
            tc += h; if (tc >= cycleLen()) tc -= cycleLen();
            const p = profile(tc); phaseName = p.ph;
            T = Jeq * p.a + Tf * Math.sign(p.w) + Tg;
            T = clamp(T, -Tpk, Tpk);
            w = p.w;
          } else {
            // no torque: the flywheel coasts on friction, the vertical load falls
            phaseName = vert ? 'falling' : 'coasting';
            const acc = (-Tg - Tf * Math.sign(w)) / Jeq;
            w = vert ? w + h * acc : (Math.abs(w) < h * Tf / Jeq ? 0 : w - h * Tf * Math.sign(w) / Jeq);
          }
          if (vert) { z += w * lead / TAU * h; if (z < 0) { z = 0; w = Math.max(0, w); } if (z > zMax) { z = zMax; w = Math.min(0, w); } }
          ang += w * h;
          const Pmech = T * w, Pcu = off ? 0 : 3 * Math.pow(T / Kt, 2) * Rph;          // copper loss: 3 phases × I² R
          const Pm = off ? 0 : Pmech + Pcu;                                  // power the motor takes from the bus (negative: it returns power)
          const Prect = Math.max(0, Gr * (Vn - Vb));
          if (res) { if (Vb > Von) chop = true; else if (Vb < Voff) chop = false; } else chop = false;
          const Pr = chop ? Vb * Vb / res.R : 0;
          let E = 0.5 * Cb * Vb * Vb + h * (Prect - Pm - Pctl - Pr);
          Vb = Math.sqrt(Math.max(2 * E / Cb, 1));
          if (Vb > Vov && !trip) trip = 'OVERVOLTAGE — torque off';
          if (Pm < 0) eAcc += -Pm * h;
          if (phaseName === 'waiting' && eAcc > 0.5) { eStop = eAcc; eAcc = 0; }
          if (phaseName === 'accelerating') eAcc = 0;
          sPm += Pm / sub; sPr += Pr / sub; sMains += Prect / sub;
        }
        pMot = sPm; pRes = sPr; pMains = sMains;
        pAvg += (pRes - pAvg) * Math.min(1, dt / 3);
        mainsAvg += (pMains - mainsAvg) * Math.min(1, dt / 3);
        ro.set('vb', Vb.toFixed(0) + ' V (chopper ' + Von + ' V, trip ' + Vov + ' V)');
        ro.set('pm', pMot >= 0 ? pMot.toFixed(0) + ' W motoring' : (-pMot).toFixed(0) + ' W regenerating');
        ro.set('pr', res ? pRes.toFixed(0) + ' W · ' + pAvg.toFixed(0) + ' W avg (rated ' + res.P + ' W)' + (pAvg > res.P ? ' — OVERLOADED' : '') : 'none fitted');
        ro.set('e', eStop.toFixed(1) + ' J to the bus (capacitors take 21 J from 325 to 385 V)');
        ro.set('pin', mainsAvg.toFixed(0) + ' W');
        ro.set('al', trip ? trip : V.sto ? 'STO active: no torque' + (vert ? ' — the load is falling!' : '') : 'running: ' + phaseName);
        hist.push([t, Vb, pMot, pRes]); while (hist.length && hist[0][0] < t - 5) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const xa = { label: 'time (s)', min: Math.max(0, t - 5), max: Math.max(5, t) };
          pV.set({ x: xa, series: [{ pts: hist.map(r => [r[0], r[1]]), label: 'bus' }], hlines: [{ y: Vn, label: '325' }, { y: Von, label: 'chopper' }, { y: Vov, label: 'trip' }] });
          pP.set({ x: xa, series: [{ pts: hist.map(r => [r[0], r[2]]), label: 'motor (+ motoring, − braking)' }, { pts: hist.map(r => [r[0], r[3]]), label: 'resistor', color: kit.colors().bad }] });
        }
        // drawing: mains → rectifier → bus capacitor → chopper and resistor → inverter → motor → load
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 250);
        c.textAlign = 'center';
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(40, 90, 18, 0, TAU); c.stroke();
        c.beginPath(); for (let x = -12; x <= 12; x++) { const y = 90 - 8 * Math.sin(x / 12 * Math.PI); x === -12 ? c.moveTo(40 + x, y) : c.lineTo(40 + x, y); } c.stroke();
        c.fillStyle = C.muted; c.fillText('230 V', 40, 124);
        boxAt(c, C, 76, 66, 60, 48, 'rectifier', 'diodes');
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(58, 90); c.lineTo(76, 90); c.moveTo(136, 70); c.lineTo(460, 70); c.moveTo(136, 110); c.lineTo(460, 110); c.stroke();
        // the capacitor with a voltage bar
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(170, 84); c.lineTo(194, 84); c.moveTo(170, 96); c.lineTo(194, 96); c.stroke(); c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(182, 70); c.lineTo(182, 84); c.moveTo(182, 96); c.lineTo(182, 110); c.stroke();
        const bar = v => 230 - 90 * clamp((v - 300) / 120, 0, 1);
        c.fillStyle = C.faint; c.fillRect(168, 140, 28, 90); c.fillStyle = Vb > Vov ? C.bad : Vb > Von ? C.warn : C.accent; c.fillRect(168, bar(Vb), 28, 230 - bar(Vb));
        for (const [v, l] of [[Vn, '325'], [Von, '385'], [Vov, '410']]) { c.strokeStyle = C.text; c.beginPath(); c.moveTo(164, bar(v)); c.lineTo(200, bar(v)); c.stroke(); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText(l, 204, bar(v) + 4); }
        c.textAlign = 'center'; c.fillStyle = C.text; c.fillText(Vb.toFixed(0) + ' V', 182, 245);
        // chopper and resistor
        c.fillStyle = C.muted; c.fillText('brake chopper', 262, 58);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(262, 70); c.lineTo(262, 80); c.moveTo(262, 104); c.lineTo(262, 110); c.stroke();
        c.fillStyle = res ? (chop ? 'hsl(10 95% 55%)' : C.surface2) : C.bg2; c.strokeStyle = res ? C.text : C.faint; c.fillRect(252, 80, 20, 24); c.strokeRect(252, 80, 20, 24);
        c.fillStyle = C.muted; c.fillText(res ? res.name : 'no resistor', 262, 132);
        // inverter
        const offNow = V.sto || !!trip;
        c.fillStyle = C.surface2; c.strokeStyle = offNow ? C.faint : C.text; c.fillRect(330, 62, 80, 56); c.strokeRect(330, 62, 80, 56);
        for (let k = 0; k < 6; k++) kit.dot(c, 346 + (k % 3) * 24, k < 3 ? 78 : 102, 5, offNow ? C.faint : (Math.floor(t * 20 + k) % 2 ? C.ok : C.muted));
        c.fillStyle = offNow ? C.bad : C.muted; c.fillText(offNow ? 'gates off (STO)' : 'inverter', 370, 134);
        // power-flow arrows on the bus
        const pw = clamp(Math.abs(pMot) / 800, 0, 1);
        if (!offNow && Math.abs(pMot) > 5) { if (pMot > 0) kit.arrow(c, 214, 90, 318, 90, C.accent, 2 + 5 * pw); else kit.arrow(c, 318, 90, 214, 90, C.warn, 2 + 5 * pw); }
        if (pMains > 5) kit.arrow(c, 140, 90, 162, 90, C.accent, 2 + 5 * clamp(pMains / 800, 0, 1));
        // motor and load
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(410, 90); c.lineTo(440, 90); c.stroke();
        c.fillStyle = C.surface2; c.beginPath(); c.arc(462, 90, 22, 0, TAU); c.fill(); c.stroke(); c.fillStyle = C.text; c.fillText('M', 462, 94);
        if (!vert) {
          c.save(); c.translate(560, 90); c.rotate(ang / 40); const r = 20 + 30 * Math.sqrt(V.JL / 30);
          c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, r, 0, TAU); c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(r - 4, 0); c.stroke(); c.restore();
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(484, 90); c.lineTo(560, 90); c.stroke();
          c.fillStyle = C.muted; c.fillText('flywheel, drawn 40 × slower', 560, 160);
        } else {
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(560, 30); c.lineTo(560, 230); c.stroke(); c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(484, 90); c.lineTo(540, 90); c.lineTo(540, 30); c.lineTo(560, 30); c.stroke();
          const zy = 225 - 180 * z / zMax;
          c.fillStyle = offNow && Math.abs(w) > 1 ? C.bad : C.accent; c.fillRect(538, zy - 16, 44, 32); c.fillStyle = C.text; c.fillText('40 kg', 560, zy + 4);
          c.fillStyle = C.muted; c.fillText(w > 0.5 ? 'raising' : w < -0.5 ? 'lowering: regenerating' : 'at rest', 560, 245);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-command */
  Hyper.sim('sv-command', {
    title: 'Three ways to command a drive',
    blurb: `A controller commands a servo axis to move 10 revolutions forward and back, again and again. Choose how it talks to the drive. The cable in the middle shows the signal: a pulse train and a direction line, an analogue voltage, or network frames. The graph shows the true motor position minus the controller's command: during moves every interface lags a little (normal following error) — watch what is left each time the axis stands still.

**Try this**
- **Pulse/direction**, 10 000 pulses a revolution: raise the speed past 3000 rpm with the 500 kHz line driver, or past 1200 rpm with the 200 kHz open-collector output — pulses are lost and the axis stops short at the far end of every move. The controller does not know.
- Tick *noise on the cable*: stray spikes are counted as pulses, and the error creeps up move after move, silently.
- **Analogue ±10 V**: add an offset of 20 mV. At standstill the motor would creep; the controller's position loop holds it with a small standing error. Noise makes it jitter, but the position does not drift, because the controller reads the encoder.
- **Fieldbus**: setpoints every 1 ms. With noise, damaged frames are detected, counted and ignored; the drive carries on from the previous setpoint and the error stays tiny.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const [g1] = graphs(box, 1);
      let V = null, t = 0, tm = 0, lastPlot = -1, xCmd = 0, xDrv = 0, xAct = 0, vAct = 0, fracP = 0, lost = 0, extra = 0, badF = 0, frames = 0, volt = 0, fieldT = 0, spLast = 0, spPrev = 0, rng = 12345, fNow = 0;
      const hist = [];
      const rand = () => { rng = (rng * 1103515245 + 12345) % 2147483648; return rng / 2147483648; };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Interface', options: [['Pulse and direction', 'pulse'], ['Analogue ±10 V (velocity mode)', 'ana'], ['Fieldbus (cyclic position, 1 ms)', 'bus']], value: 'pulse' },
        { id: 'n', label: 'Speed of the moves', min: 200, max: 4000, step: 50, value: 1000, unit: 'rpm' },
        { id: 'N', type: 'select', label: 'Pulses per revolution', options: [['2 000', 2000], ['10 000', 10000], ['50 000', 50000]], value: 10000 },
        { id: 'out', type: 'select', label: 'Controller output', options: [['Line driver, 500 kHz', 500e3], ['Open collector, 200 kHz', 200e3]], value: 500e3 },
        { id: 'off', label: 'Analogue offset', min: -50, max: 50, step: 1, value: 0, unit: 'mV' },
        { id: 'noise', type: 'check', label: 'Noise on the cable', value: false },
        { type: 'buttons', items: [{ id: 'zero', label: 'Home again (clear the error)', primary: true }] }
      ], id => {
        if (id === 'mode') { ctl.show('N', V.mode === 'pulse'); ctl.show('out', V.mode === 'pulse'); ctl.show('off', V.mode === 'ana'); }
        if (id === 'zero' || id === 'mode') { xDrv = xAct = xCmd; vAct = 0; lost = extra = badF = 0; fracP = 0; spLast = spPrev = xCmd; hist.length = 0; }
      });
      V = ctl.values; ctl.show('off', false);
      const ro = kit.readout(box.side, [['f', 'Signal now'], ['bel', 'Controller believes · motor is'], ['err', 'Hidden error'], ['cnt', 'Counts']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'motor − command (°)' }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        const vmax = V.n / 60, mv = M.move({ dist: 10, vmax, acc: vmax / 0.1, dec: vmax / 0.1 }), per = 2 * (mv.tTotal + 0.4);
        const sub = 40, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          tm += h;
          const u = tm % per, fwd = u < mv.tTotal + 0.4, uu = fwd ? u : u - mv.tTotal - 0.4, s = mv.at(Math.min(uu, mv.tTotal));
          const xPrev = xCmd;
          xCmd = fwd ? s.x : 10 - s.x;
          const vCmd = (xCmd - xPrev) / h;                                    // rev/s
          if (V.mode === 'pulse') {
            // pulses the controller sends; the drive's input cannot count faster than the output allows
            const want = (xCmd - xPrev) * V.N + fracP, whole = Math.trunc(want);
            fracP = want - whole;
            const cap = Math.round(V.out * h), got = Math.sign(whole) * Math.min(Math.abs(whole), cap);
            lost += Math.abs(whole) - Math.abs(got);
            let noise = 0;
            if (V.noise && rand() < 3 * h) { noise = 1 + Math.floor(rand() * 6); extra += noise; }
            xDrv += (got + noise) / V.N;
            fNow = Math.abs(xCmd - xPrev) * V.N / h;
            // the drive's own position loop with feed-forward follows its count
            vAct = (got / V.N) / h + 60 * (xDrv - xAct);
            xAct += vAct * h;
          } else if (V.mode === 'ana') {
            const vc = vCmd + 30 * (xCmd - xAct);                              // the controller's loop: feed-forward + P on the encoder
            volt = clamp(vc / 50 * 10, -10, 10) + V.off / 1000 + (V.noise ? (rand() - 0.5) * 0.12 : 0);
            const vDrv = volt / 10 * 50;                                        // 10 V = 3000 rpm = 50 rev/s
            vAct += (vDrv - vAct) * Math.min(1, h / 0.003);
            xAct += vAct * h;
            fNow = volt;
          } else {
            fieldT += h;
            if (fieldT >= 0.001) {
              fieldT -= 0.001; frames++;
              if (V.noise && rand() < 0.03) badF++; else { spPrev = spLast; spLast = xCmd; }
            }
            const vff = (spLast - spPrev) / 0.001;
            vAct = vff + 150 * (spLast - xAct);
            xAct += vAct * h;
            fNow = frames;
          }
        }
        const errDeg = (xAct - xCmd) * 360;
        ro.set('f', V.mode === 'pulse' ? (fNow / 1000).toFixed(0) + ' kHz (limit ' + (V.out / 1000).toFixed(0) + ' kHz)' : V.mode === 'ana' ? volt.toFixed(3) + ' V' : '1 frame per ms, ' + frames + ' sent');
        ro.set('bel', xCmd.toFixed(3) + ' rev · ' + xAct.toFixed(3) + ' rev');
        ro.set('err', errDeg.toFixed(2) + '°');
        ro.set('cnt', V.mode === 'pulse' ? 'lost ' + lost + ', extra ' + extra + ' pulses (nobody is told)' : V.mode === 'ana' ? 'standing error from the offset ≈ ' + (V.off / 1000 / 10 * 50 / 30 * 360).toFixed(2) + '°' : badF + ' damaged frames detected and ignored');
        hist.push([t, errDeg]); while (hist.length && hist[0][0] < t - 10) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) { lastPlot = t; p1.set({ x: { label: 'time (s)', min: Math.max(0, t - 10), max: Math.max(10, t) }, series: [{ pts: hist.slice(), label: 'motor − belief' }] }); }
        // drawing
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 220);
        boxAt(c, C, 16, 70, 100, 70, 'Controller', 'x = ' + xCmd.toFixed(2) + ' rev');
        boxAt(c, C, 470, 70, 80, 70, 'Drive', V.mode === 'pulse' ? 'counts pulses' : V.mode === 'ana' ? 'speed loop' : 'follows setpoints');
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.beginPath(); c.arc(590, 105, 24, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(590, 105); c.rotate(xAct * TAU); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -20); c.stroke(); c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(550, 105); c.lineTo(566, 105); c.stroke();
        const x0 = 130, x1 = 455, W = x1 - x0;
        c.textAlign = 'left'; c.fillStyle = C.muted;
        if (V.mode === 'pulse') {
          const dens = clamp(fNow / 500e3, 0, 1), nP = Math.round(4 + 70 * dens), dirUp = vAct >= 0;
          c.fillText('PULSE', x0, 62); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
          for (let i = 0; i <= W; i++) { const ph = ((i / W) * nP + t * 8) % 1, y = fNow > 1 && ph < 0.5 ? 70 : 90; i ? c.lineTo(x0 + i, y) : c.moveTo(x0 + i, y); }
          c.stroke();
          c.fillText('DIR', x0, 118); c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(x0, dirUp ? 126 : 146); c.lineTo(x1, dirUp ? 126 : 146); c.stroke();
          if (fNow > V.out) { c.fillStyle = C.bad; c.fillText('too fast: pulses lost', x0 + 150, 118); }
        } else if (V.mode === 'ana') {
          c.fillText('±10 V', x0, 62); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x0, 105); c.lineTo(x1, 105); c.stroke();
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= W; i += 3) { const y = 105 - 3.5 * volt - (V.noise ? (rand() - 0.5) * 6 : 0); i ? c.lineTo(x0 + i, y) : c.moveTo(x0 + i, y); }
          c.stroke();
          c.fillStyle = C.muted; c.fillText('encoder A/B back to the controller', x0, 168);
          c.strokeStyle = C.series[2]; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x1, 150); c.lineTo(x0, 150); c.stroke(); c.setLineDash([]);
        } else {
          c.fillText('network', x0, 62);
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(x0, 105); c.lineTo(x1, 105); c.stroke();
          for (let k = 0; k < 8; k++) { const ph = ((t * 0.6 + k / 8) % 1), fx = x0 + ph * (W - 30), bad = V.noise && ((k * 7 + Math.floor(t * 0.6)) % 23 === 0); c.fillStyle = bad ? C.bad : C.accent; c.fillRect(fx, 96, 26, 18); }
          c.fillStyle = C.muted; c.fillText('setpoints out, actual position and status back', x0, 140);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-pid */
  Hyper.sim('sv-pid', {
    title: 'PID on a heavy table: the three terms at work',
    blurb: `A rotary table of 2 kg·m² (motor and reducer included) is positioned by a PID controller whose output is the torque, limited to ±300 N·m. The bars show the three terms and their sum; the graphs show the position and the terms over time. The gains are deliberately gentle so that you can watch — a real drive's loops are many times faster.

**Try this**
- Start with P only (Kp = 316, Ki = 0, Kd = 0) and press *Step +45°*: the table swings past the target and rings for a long time — a spring without a damper.
- Raise Kd to 35: the damping ratio reaches 0.7 and the ringing dies after one small overshoot.
- Add a load torque of 100 N·m: with P and D the table sits short of the target by T/Kp. Raise Ki to 600: the I bar grows until the error is gone.
- Press *Block the table* with Ki = 1500 and anti-windup off: while the table is held, the integral winds up; released, it overshoots far. Tick *anti-windup* and repeat.
- Tick *measurement noise* and choose D on the error: every step now gives a derivative kick, and the noise shows up amplified in the D bar.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const J = 2, b = 2, Tlim = 300, tauF = 0.01;
      let V = null, th = 0, w = 0, cmd = 0, integ = 0, dF = 0, ePrev = 0, mPrev = 0, t = 0, block = 0, lastPlot = -1, P = 0, Iterm = 0, D = 0, U = 0, peak = 0, rng = 777, stepDir = 1;
      const hist = [];
      const rand = () => { rng = (rng * 1103515245 + 12345) % 2147483648; return rng / 2147483648; };
      const ctl = kit.controls(box.side, [
        { id: 'Kp', label: 'Kp (proportional)', min: 0, max: 1500, step: 1, value: 316, unit: 'N·m/rad' },
        { id: 'Ki', label: 'Ki (integral)', min: 0, max: 3000, step: 10, value: 0, unit: 'N·m/(rad·s)' },
        { id: 'Kd', label: 'Kd (derivative)', min: 0, max: 150, step: 0.5, value: 0, unit: 'N·m·s/rad' },
        { id: 'TL', label: 'Steady load torque', min: 0, max: 200, step: 5, value: 0, unit: 'N·m' },
        { id: 'don', type: 'select', label: 'D acts on', options: [['the measurement (no kick)', 'meas'], ['the error', 'err']], value: 'meas' },
        { id: 'aw', type: 'check', label: 'Anti-windup', value: true },
        { id: 'noise', type: 'check', label: 'Measurement noise (±0.05°)', value: false },
        { type: 'buttons', items: [{ id: 'step', label: 'Step +45°', primary: true }, { id: 'back', label: 'Back to 0°' }, { id: 'block', label: 'Block the table 2 s' }] }
      ], id => {
        if (id === 'step') { cmd += Math.PI / 4; peak = 0; stepDir = 1; }
        if (id === 'back') { stepDir = cmd > 0 ? -1 : 1; cmd = 0; peak = 0; }
        if (id === 'block') block = 2;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['fz', 'Natural frequency · damping ratio'], ['e', 'Error now'], ['ov', 'Overshoot of the last step'], ['u', 'Torque: P + I + D']]);
      const pX = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'angle (°)' }, legend: true }, 180);
      const pU = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'torque (N·m)' }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const sub = 40, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const meas = th + (V.noise ? (rand() - 0.5) * 0.1 * Math.PI / 180 : 0);
          const e = cmd - meas;
          const raw = V.don === 'err' ? (e - ePrev) / h : -(meas - mPrev) / h;
          ePrev = e; mPrev = meas;
          dF += (raw - dF) * h / tauF;                                     // the derivative is always filtered
          P = V.Kp * e; D = V.Kd * dF;
          let u = P + V.Ki * integ + D;
          const sat = Math.abs(u) > Tlim;
          if (!V.aw || !sat || Math.sign(e) !== Math.sign(u)) integ += e * h;
          Iterm = V.Ki * integ;
          u = clamp(P + Iterm + D, -Tlim, Tlim); U = u;
          if (block > 0) { block -= h; w = 0; }
          else { w += h * (u - V.TL - b * w) / J; th += w * h; }
        }
        peak = stepDir > 0 ? Math.max(peak, th - cmd) : Math.max(peak, cmd - th);
        const fn = Math.sqrt(V.Kp / J) / TAU, zeta = V.Kp > 0 ? (V.Kd + b) / (2 * Math.sqrt(V.Kp * J)) : 0;
        ro.set('fz', V.Kp > 0 ? fn.toFixed(2) + ' Hz · ζ = ' + zeta.toFixed(2) : 'no spring: Kp = 0');
        ro.set('e', ((cmd - th) * 180 / Math.PI).toFixed(2) + '°' + (V.Ki === 0 && V.TL > 0 && V.Kp > 0 ? ' (P+D droop T/Kp = ' + (V.TL / V.Kp * 180 / Math.PI).toFixed(1) + '°)' : ''));
        ro.set('ov', (100 * Math.max(0, peak) / (Math.PI / 4)).toFixed(0) + ' %');
        ro.set('u', P.toFixed(0) + ' + ' + Iterm.toFixed(0) + ' + ' + D.toFixed(0) + ' = ' + U.toFixed(0) + ' N·m' + (Math.abs(U) >= Tlim - 0.01 ? ' (at the limit)' : ''));
        hist.push([t, cmd * 180 / Math.PI, th * 180 / Math.PI, clamp(P, -400, 400), clamp(Iterm, -400, 400), clamp(D, -400, 400), U]);
        while (hist.length && hist[0][0] < t - 6) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const xa = { label: 'time (s)', min: Math.max(0, t - 6), max: Math.max(6, t) }, C = kit.colors();
          pX.set({ x: xa, series: [{ pts: hist.map(r => [r[0], r[1]]), label: 'command', dash: [5, 4] }, { pts: hist.map(r => [r[0], r[2]]), label: 'table' }] });
          pU.set({ x: xa, y: { label: 'torque (N·m)', min: -400, max: 400 }, series: [{ pts: hist.map(r => [r[0], r[3]]), label: 'P', color: C.series[0] }, { pts: hist.map(r => [r[0], r[4]]), label: 'I', color: C.series[1] }, { pts: hist.map(r => [r[0], r[5]]), label: 'D', color: C.series[2] }, { pts: hist.map(r => [r[0], r[6]]), label: 'total', color: C.text }], hlines: [{ y: Tlim, label: 'limit' }, { y: -Tlim }] });
        }
        // drawing: the formula, the bars, the table
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 250);
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '14px ' + font();
        c.fillText('u = Kp·e + Ki·∫e dt + Kd·de/dt', 20, 28);
        c.font = '12px ' + font();
        const bars = [['P', P, C.series[0]], ['I', Iterm, C.series[1]], ['D', D, C.series[2]], ['total', U, C.text]], x0 = 70, y0 = 150, sc = 90 / 400;
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(40, y0); c.lineTo(360, y0); c.stroke();
        c.strokeStyle = C.bad; c.setLineDash([4, 3]); for (const s of [-1, 1]) { c.beginPath(); c.moveTo(40, y0 - s * Tlim * sc); c.lineTo(360, y0 - s * Tlim * sc); c.stroke(); } c.setLineDash([]);
        c.fillStyle = C.bad; c.fillText('±300 N·m limit', 250, y0 - Tlim * sc - 4);
        bars.forEach(([n, v, col], i) => { const x = x0 + i * 72, hgt = clamp(v, -400, 400) * sc; c.fillStyle = col; c.fillRect(x, Math.min(y0, y0 - hgt), 40, Math.abs(hgt)); c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText(n, x + 20, 246); });
        if (block > 0) { c.fillStyle = C.bad; c.textAlign = 'left'; c.fillText('table blocked: ' + block.toFixed(1) + ' s', 40, 52); }
        const cx = 510, cy = 125, R = 88;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.stroke();
        const ca = cmd - Math.PI / 2, ta = th - Math.PI / 2;
        c.strokeStyle = C.accent; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + (R + 10) * Math.cos(ca), cy + (R + 10) * Math.sin(ca)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, cx, cy, cx + (R - 12) * Math.cos(ta), cy + (R - 12) * Math.sin(ta), C.ok, 4);
        if (V.TL > 0) { c.fillStyle = C.warn; c.textAlign = 'center'; c.fillText('load ' + V.TL + ' N·m ↺', cx, cy + R + 22); }
        kit.dot(c, cx, cy, 6, C.text);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-tuning */
  // a two-mass axis: motor (1.3 kg·cm²) – compliant belt or coupling – load; a drive with a discrete PI velocity loop at 8 kHz,
  // a P position loop, a torque low-pass filter, an optional notch and a 2 kHz current loop
  const MECH = { belt: { name: 'Belt drive (800 N·m/rad at the motor)', k: 800, JL: 10e-4 }, stiff: { name: 'Stiff bellows coupling (5000 N·m/rad)', k: 5000, JL: 10e-4 }, heavy: { name: 'Belt, heavy load (30 kg·cm²)', k: 800, JL: 30e-4 } };
  const JM = 1.3e-4, TPK = 7.16;
  const tuneRun = o => twoMass(Object.assign({ Jm: JM, JL: MECH[o.mech].JL, k: MECH[o.mech].k }, o));
  // o: Jm, JL (kg·m², load at the motor), k (N·m/rad at the motor), bw (Hz, as set), Rset (inertia ratio set in the drive),
  //    tf (torque filter, Hz), notch, test ('vel' or 'pos'), Tpk (N·m)
  function twoMass(o) {
    const TPK = o.Tpk || 7.16, JM = o.Jm, m = { k: o.k, JL: o.JL };
    const Jtot = JM * (1 + o.Rset), wb = TAU * o.bw, Kv = Jtot * wb, Ki = Kv * wb / 4, Kpp = wb / 5;
    const fr = Math.sqrt(m.k * (1 / JM + 1 / m.JL)) / TAU, far = Math.sqrt(m.k / m.JL) / TAU, cdmp = 2 * 0.06 * Math.sqrt(m.k * JM * m.JL / (JM + m.JL));
    const Ts = 1 / 8000, sub = 12, h = Ts / sub, dur = o.test === 'vel' ? 0.06 : 0.15, N = Math.round(dur / Ts);
    // notch biquad at fr (Q = 1), computed for the 8 kHz sample rate
    const w0 = TAU * fr * Ts, alpha = Math.sin(w0) / 2, cw = Math.cos(w0), a0 = 1 + alpha;
    const nb = [1 / a0, -2 * cw / a0, 1 / a0], na = [-2 * cw / a0, (1 - alpha) / a0];
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
    let thm = 0, wm = 0, thl = 0, wl = 0, integ = 0, Tf = 0, Tc = 0, Tm = 0, thPrev = 0, wmeas = 0;
    const tgt = o.test === 'vel' ? 20 * TAU / 60 : 10 * Math.PI / 180, out = [];
    let over = 0, Tmax = 0, unstable = false;
    const aTf = 1 - Math.exp(-TAU * o.tf * Ts), aCur = 1 - Math.exp(-TAU * 2000 * h);
    for (let n = 0; n < N; n++) {
      wmeas = (thm - thPrev) / Ts; thPrev = thm;
      const wcmd = o.test === 'vel' ? tgt : clamp(Kpp * (tgt - thm), -300, 300);
      const ev = wcmd - wmeas;
      let u = Kv * ev + Ki * integ;
      if (Math.abs(u) < TPK || Math.sign(ev) !== Math.sign(integ)) integ += ev * Ts;
      u = clamp(u, -TPK, TPK);
      Tf += aTf * (u - Tf);
      let v = Tf;
      if (o.notch) { const y = nb[0] * v + nb[1] * x1 + nb[2] * x2 - na[0] * y1 - na[1] * y2; x2 = x1; x1 = v; y2 = y1; y1 = y; v = y; }
      Tc = clamp(v, -TPK, TPK);
      for (let s = 0; s < sub; s++) {
        Tm += aCur * (Tc - Tm);
        const tw = m.k * (thm - thl) + cdmp * (wm - wl);
        wm += h * (Tm - tw) / JM; wl += h * (tw - 0.02 * wl) / m.JL;
        thm += wm * h; thl += wl * h;
      }
      if (!Number.isFinite(wm) || Math.abs(wm) > 1e4) { unstable = true; break; }
      Tmax = Math.max(Tmax, Math.abs(Tc));
      const yl = o.test === 'vel' ? wl : thl, ym = o.test === 'vel' ? wm : thm;
      over = Math.max(over, yl / tgt - 1);
      if (n % 4 === 0) out.push([n * Ts * 1000, ym / tgt * 100, yl / tgt * 100, Tc, thm - thl]);
    }
    // ringing: how much the last fifth still swings
    const tail = out.slice(Math.floor(out.length * 0.8));
    // ringing: how far the last fifth swings about the straight line through its ends (a slow rise is not ringing)
    let ringA = 0; if (tail.length > 2) { const a = tail[0], z = tail[tail.length - 1]; for (const r of tail) { const lin = a[1] + (z[1] - a[1]) * (r[0] - a[0]) / Math.max(1e-9, z[0] - a[0]); ringA = Math.max(ringA, Math.abs(r[1] - lin)); } }
    const ring = 2 * ringA;
    let settle = null;
    for (let i = out.length - 1; i >= 0; i--) if (Math.abs(out[i][2] - 100) > 2) { settle = i < out.length - 1 ? out[i + 1][0] : null; break; }
    if (unstable || ring > 20 || Tmax >= TPK * 0.999 && ring > 5) unstable = true;
    return { out, over, ring, unstable, settle, Tmax, fr, far, realBw: o.bw * (1 + o.Rset) / (1 + m.JL / JM) };
  }
  Hyper.sim('sv-tuning', {
    title: 'Tuning a servo axis with a belt',
    blurb: `A 750 W motor (1.3 kg·cm²) drives a load of 10 kg·cm² through a belt that behaves as a torsion spring. The drive runs a PI velocity loop at 8 kHz, a position loop at a fifth of the velocity bandwidth, a torque filter and — if you switch it on — a notch filter at the resonance. Press *Run the test* to apply a small step and see the motor (solid) and the load (dashed) respond.

**Try this**
- Belt drive, velocity step: raise the bandwidth from 50 Hz upwards. The response gets quicker and overshoots more, and somewhere near 200 Hz the loop goes unstable — the axis would howl and trip.
- Tick the notch filter: now the bandwidth can go past 200 Hz before the loop breaks down (the overshoot is then for the position loop and feed-forward to handle).
- Set the inertia ratio in the drive to 1 while the real ratio is 7.7: the drive thinks the load is light, and the real bandwidth is far below the set value — the response is sluggish.
- Choose the stiff coupling: the resonance moves up to about 1 kHz. Without a notch it already sings at about 100 Hz — a lightly damped resonance plus the drive's sampling delay; with the notch it stays stable to 300 Hz. Lowering the torque filter to 500 Hz alone does not save it.
- Press *Auto-tune*: it sets the inertia ratio, the notch and the highest bandwidth that keeps the overshoot small.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2] = graphs(box, 2);
      let V = null, res = null, replay = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mech', type: 'select', label: 'Mechanics', options: Object.entries(MECH).map(([k, m]) => [m.name, k]), value: 'belt' },
        { id: 'bw', label: 'Velocity-loop bandwidth (as set)', min: 20, max: 800, value: 80, unit: 'Hz', log: true, sig: 2 },
        { id: 'Rset', label: 'Inertia ratio set in the drive', min: 0, max: 30, step: 0.1, value: 7.7, unit: '' },
        { id: 'tf', label: 'Torque-command filter', min: 100, max: 5000, value: 1500, unit: 'Hz', log: true, sig: 2 },
        { id: 'notch', type: 'check', label: 'Notch filter at the resonance', value: false },
        { id: 'test', type: 'select', label: 'Test', options: [['Velocity step (20 rpm)', 'vel'], ['Position step (10°)', 'pos']], value: 'vel' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the test', primary: true }, { id: 'auto', label: 'Auto-tune' }] }
      ], id => {
        if (id === 'auto') autoTune();
        res = tuneRun(V); replay = 0;
      });
      V = ctl.values;
      function autoTune() {
        const m = MECH[V.mech], R = m.JL / JM;
        ctl.set('Rset', +R.toFixed(1)); ctl.set('notch', true);
        let best = 20;
        for (let bw = 20; bw <= 800; bw *= 1.12) {
          const r = tuneRun(Object.assign({}, V, { bw, Rset: R, notch: true, test: 'vel' }));
          if (r.unstable || r.over > 0.25 || r.ring > 4) break;
          best = bw;
        }
        ctl.set('bw', Math.round(best * 0.7));
      }
      const ro = kit.readout(box.side, [['fr', 'Resonance · anti-resonance'], ['bw', 'Real velocity bandwidth'], ['ov', 'Overshoot (load)'], ['ts', 'Settling (±2 %)'], ['st', 'Verdict']]);
      const pR = kit.plot(g1, { x: { label: 'time (ms)', min: 0 }, y: { label: '% of the step' }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'time (ms)', min: 0 }, y: { label: 'torque command (N·m)' } }, 190);
      res = tuneRun(V);
      const loop = kit.loop(dt => {
        if (!res) return;
        replay = Math.min(1, replay + dt / 3);
        const n = res.out.length, r = res.out[Math.max(0, Math.min(n - 1, Math.floor(replay * (n - 1))))] || [0, 0, 0, 0, 0];
        ro.set('fr', res.fr.toFixed(0) + ' Hz · ' + res.far.toFixed(0) + ' Hz');
        ro.set('bw', '≈ ' + res.realBw.toFixed(0) + ' Hz (set ' + V.bw.toFixed(0) + ' Hz)');
        ro.set('ov', res.unstable ? '—' : (100 * Math.max(0, res.over)).toFixed(1) + ' %');
        ro.set('ts', res.unstable ? '—' : res.settle != null ? res.settle.toFixed(1) + ' ms' : 'not within the window');
        ro.set('st', res.unstable ? 'UNSTABLE: the axis would howl and trip' : res.ring > 4 ? 'ringing at the resonance: notch it or lower the gain' : res.over > 0.25 ? 'large overshoot' : res.realBw < 0.5 * V.bw ? 'sluggish: check the inertia setting' : 'good');
        if (!res.plotted || replay < 1) {
          res.plotted = true;
          pR.set({ series: [{ pts: res.out.map(q => [q[0], clamp(q[1], -200, 300)]), label: 'motor' }, { pts: res.out.map(q => [q[0], clamp(q[2], -200, 300)]), label: 'load', dash: [5, 3] }], hlines: [{ y: 100, label: 'target' }], marks: [{ x: r[0], y: clamp(r[2], -200, 300) }] });
          pT.set({ series: [{ pts: res.out.map(q => [q[0], q[3]]), label: 'torque' }], hlines: [{ y: TPK, label: 'peak' }, { y: -TPK }], marks: [{ x: r[0], y: r[3] }] });
        }
        // drawing: motor pulley, belt (its stretch magnified) and load pulley
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 190);
        const tw = clamp(r[4] * 2000, -40, 40), rm = 30, rl = 60, xm = 150, xl = 470, yc = 95;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.arc(xm, yc, rm, 0, TAU); c.fill(); c.stroke();
        c.beginPath(); c.arc(xl, yc, rl, 0, TAU); c.fill(); c.stroke();
        // the belt spans sag and stretch with the twist
        c.strokeStyle = Math.abs(tw) > 10 ? C.warn : C.accent; c.lineWidth = 4;
        c.beginPath(); c.moveTo(xm, yc - rm); c.quadraticCurveTo((xm + xl) / 2, yc - (rm + rl) / 2 - tw, xl, yc - rl); c.stroke();
        c.beginPath(); c.moveTo(xm, yc + rm); c.quadraticCurveTo((xm + xl) / 2, yc + (rm + rl) / 2 + tw, xl, yc + rl); c.stroke();
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('motor', xm, yc + rm + 20); c.fillText('load', xl, yc + rl + 20);
        c.fillStyle = C.muted; c.fillText('belt stretch magnified — t = ' + r[0].toFixed(1) + ' ms', (xm + xl) / 2, 184);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-inertia */
  Hyper.sim('sv-inertia', {
    title: 'Inertia ratio and gear ratio',
    blurb: `A servo motor drives a rotary load through a reduction of ratio *i*. The load must reach its speed in the given time. The first graph is the motor torque that move needs, for every reduction: it has a minimum at $i = \\sqrt{J_L/J_m}$, where the reflected load equals the rotor. The second graph is a velocity step with the drive auto-tuned for the mechanics as they are (inertia known, no notch): the highest bandwidth that stays stable with modest overshoot.

**Try this**
- Start direct (i = 1) with 60 kg·cm² on the 750 W motor: the inertia ratio is 46, the torque needed is high and the achievable bandwidth low — a soft, slow axis.
- Raise the reduction: the torque falls, the ratio falls with i², and the bandwidth rises. Past the optimum the torque rises again as the rotor must spin faster — and the motor's top speed soon runs out.
- Choose the belt instead of the stiff coupling: at high inertia ratios the load now rings on the belt and the bandwidth drops further.
- Try the 1 kW medium-inertia motor on the same load: a lower ratio without a gearbox, at the cost of a bigger motor.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2] = graphs(box, 2);
      let V = null, res = null, angL = 0, dirty = true, tt = 0;
      const MOT = { p400: ACM.p400, p750: ACM.p750, p1k: ACM.p1k, p2k: ACM.p2k };
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(MOT).map(([k, m]) => [m.name, k]), value: 'p750' },
        { id: 'JL', label: 'Load inertia (at the load)', min: 1, max: 1000, value: 60, unit: 'kg·cm²', log: true, sig: 2 },
        { id: 'i', label: 'Reduction ratio i', min: 1, max: 50, value: 1, unit: ': 1', log: true, sig: 2 },
        { id: 'nL', label: 'Load speed', min: 10, max: 1000, value: 200, unit: 'rpm', log: true, sig: 2 },
        { id: 'ta', label: 'Time to reach it', min: 20, max: 1000, value: 100, unit: 'ms', log: true, sig: 2 },
        { id: 'k', type: 'select', label: 'Connection to the load', options: [['Stiff coupling and shaft (20 000 N·m/rad)', 20000], ['Belt or long shaft (2 000 N·m/rad)', 2000]], value: 20000 }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Reflected load · inertia ratio'], ['opt', 'Optimum reduction'], ['tq', 'Motor torque needed'], ['n', 'Motor speed'], ['bw', 'Achievable velocity bandwidth'], ['v', 'Verdict']]);
      const pT = kit.plot(g1, { x: { label: 'reduction ratio i', min: 1, max: 50, log: true }, y: { label: 'motor torque needed (N·m)', min: 0 }, legend: true }, 190);
      const pS = kit.plot(g2, { x: { label: 'time (ms)', min: 0 }, y: { label: '% of a 20 rpm step' }, legend: true }, 190);
      const compute = () => {
        const m = MOT[V.motor], Jm = m.Jm * 1e-4, JL = V.JL * 1e-4, aL = V.nL * TAU / 60 / (V.ta / 1000);
        const tq = i => M.moveTorque({ Jm, Jload: JL, ratio: i, eff: 0.95, acc: aL, Tload: 0 });
        const cur = tq(V.i), iopt = Math.sqrt(JL / Jm), nM = V.nL * V.i, iMax = m.nmax / V.nL;
        const Jr = M.reflected(JL, V.i, 1), kr = V.k / (V.i * V.i), R = Jr / Jm;
        // auto-tune: the highest bandwidth (up to 300 Hz) that stays stable with no more than 25 % overshoot
        let best = null, bestBw = 5;
        for (let bw = 5; bw <= 300; bw *= 1.15) {
          const r = twoMass({ Jm, JL: Jr, k: kr, bw, Rset: R, tf: 1500, notch: false, test: 'vel', Tpk: m.Tp });
          if (r.unstable || r.over > 0.25 || r.ring > 4) break;
          best = r; bestBw = bw;
        }
        if (!best) best = twoMass({ Jm, JL: Jr, k: kr, bw: 5, Rset: R, tf: 1500, notch: false, test: 'vel', Tpk: m.Tp });
        const curve = [];
        for (let k = 0; k <= 80; k++) { const i = Math.pow(50, k / 80); curve.push([i, tq(i).Tpeak]); }
        return { m, cur, iopt, nM, iMax, Jr, R, best, bestBw, curve, tqOpt: tq(iopt).Tpeak };
      };
      const loop = kit.loop(dt => {
        tt += dt;
        if (dirty) {
          dirty = false; res = compute();
          const C = kit.colors(), m = res.m;
          const vl = [{ x: res.iopt, label: 'optimum' }]; if (res.iMax < 50) vl.push({ x: Math.max(1, res.iMax), label: 'top speed' });
          pT.set({ y: { label: 'motor torque needed (N·m)', min: 0, max: Math.max(m.Tp * 1.3, Math.min(res.cur.Tpeak, 5 * m.Tp) * 1.1) }, series: [{ pts: res.curve, label: 'torque for the move' }], hlines: [{ y: m.Tp, label: 'motor peak' }], vlines: vl, marks: [{ x: V.i, y: res.cur.Tpeak, label: 'now' }] });
          pS.set({ series: [{ pts: res.best.out.map(q => [q[0], clamp(q[1], -50, 250)]), label: 'motor' }, { pts: res.best.out.map(q => [q[0], clamp(q[2], -50, 250)]), label: 'load', dash: [5, 3], color: C.series[1] }], hlines: [{ y: 100 }] });
        }
        const m = res.m, okT = res.cur.Tpeak <= m.Tp, okN = res.nM <= m.nmax;
        ro.set('r', (res.Jr * 1e4).toFixed(2) + ' kg·cm² · ' + res.R.toFixed(1) + ' : 1');
        ro.set('opt', res.iopt.toFixed(1) + ' : 1 (needs ' + res.tqOpt.toFixed(2) + ' N·m)');
        ro.set('tq', res.cur.Tpeak.toFixed(2) + ' N·m (peak ' + m.Tp + ' N·m)');
        ro.set('n', res.nM.toFixed(0) + ' rpm (max ' + m.nmax + ')');
        ro.set('bw', '≈ ' + res.bestBw.toFixed(0) + ' Hz');
        ro.set('v', !okN ? 'motor too fast: reduce the ratio' : !okT ? 'not enough torque: add reduction or a bigger motor' : res.R > 30 ? 'works, but a soft, slow axis' : res.R > 10 ? 'workable with careful tuning' : 'good');
        // drawing: motor, pinion and gear, shaft, load disc
        angL += V.nL / 60 * TAU * dt / 20;
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 190);
        const yc = 95, rg = clamp(14 * Math.sqrt(V.i), 14, 80), rp = rg / V.i < 8 ? 8 : rg / V.i;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(30, yc - 35, 90, 70); c.strokeRect(30, yc - 35, 90, 70);
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText(m.name.split(',')[0], 75, yc + 55);
        c.fillStyle = C.text; c.fillRect(120, yc - 4, 60, 8);
        const xg = 180 + rp;
        c.save(); c.translate(xg, yc); c.rotate(angL * V.i); c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, rp, 0, TAU); c.fill(); c.strokeStyle = C.bg2; c.beginPath(); c.moveTo(0, 0); c.lineTo(rp, 0); c.stroke(); c.restore();
        const xG = xg + rp + rg;
        if (V.i > 1.01) { c.save(); c.translate(xG, yc); c.rotate(-angL); c.fillStyle = C.faint; c.beginPath(); c.arc(0, 0, rg, 0, TAU); c.fill(); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(rg, 0); c.stroke(); c.restore(); c.fillStyle = C.muted; c.fillText(V.i.toFixed(1) + ' : 1', xG, yc + rg + 16); }
        const xs = V.i > 1.01 ? xG : xg;
        c.strokeStyle = V.k < 5000 ? C.warn : C.text; c.lineWidth = V.k < 5000 ? 2 : 6; c.beginPath();
        if (V.k < 5000) { for (let x = 0; x <= 120; x += 4) { const y = yc + 4 * Math.sin(x / 6); x ? c.lineTo(xs + x, y) : c.moveTo(xs + x, y); } } else { c.moveTo(xs, yc); c.lineTo(xs + 120, yc); }
        c.stroke();
        const rL = clamp(12 * Math.pow(V.JL, 0.25), 14, 75);
        c.save(); c.translate(Math.min(600, xs + 120 + rL), yc); c.rotate(angL * (V.i > 1.01 ? -1 : 1)); c.fillStyle = C.accent; c.globalAlpha = 0.55; c.beginPath(); c.arc(0, 0, rL, 0, TAU); c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(rL, 0); c.stroke(); c.restore();
        c.fillStyle = C.muted; c.fillText('load ' + V.JL.toFixed(0) + ' kg·cm²', Math.min(600, xs + 120 + rL), yc + rL + 16);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-following */
  Hyper.sim('sv-following', {
    title: 'Following error on a ball-screw axis',
    blurb: `A 750 W servo drives a 50 kg table on a 10 mm-lead ball screw, back and forth over 200 mm. The position loop (gain $K_{pp}$) asks for a speed proportional to the error; velocity feed-forward adds the planned speed directly. The drive stops with an alarm if the error exceeds the deviation limit, or if its I²t model of the motor's heating reaches 100 %.

**Try this**
- With no feed-forward, watch the error at constant speed: it equals speed ÷ Kpp (0.3 m/s at 50 s⁻¹ is 6 mm). Double the speed and it doubles; double Kpp and it halves.
- Raise the feed-forward to 100 %: the constant-speed error vanishes; what is left comes from the acceleration phases.
- Press *Jam at 150 mm*: the table hits an obstacle; the torque saturates at three times rated, the error climbs and the drive stops on the deviation limit in a fraction of a second.
- Set the limit to 60 mm and jam it again: the error can never reach it, the controller waits for *in position* before the next move, and the motor pushes at 300 % until the I²t overload trips about 7 s later.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2] = graphs(box, 2);
      const lead = 0.01, k = TAU / lead, Meq = 3.57e-4 * k * k, Fpk = 7.16 * k * 0.9, Fr = 2.39 * k * 0.9, Ffr = 50, tauV = 1 / (TAU * 150), L = 0.2;
      let V = null, t = 0, tc = 0, x = 0, v = 0, F = 0, xc = 0, vc = 0, heat = 0, alarm = '', jam = false, emax = 0, lastPlot = -1, dirFwd = true;
      const hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Traverse speed', min: 0.05, max: 0.5, step: 0.01, value: 0.3, unit: 'm/s' },
        { id: 'a', label: 'Acceleration', min: 0.5, max: 20, value: 5, unit: 'm/s²', log: true, sig: 2 },
        { id: 'kpp', label: 'Position-loop gain Kpp', min: 10, max: 150, step: 1, value: 50, unit: '1/s' },
        { id: 'ff', label: 'Velocity feed-forward', min: 0, max: 100, step: 5, value: 0, unit: '%' },
        { id: 'lim', label: 'Deviation limit', min: 1, max: 60, step: 0.5, value: 10, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'jam', label: 'Jam at 150 mm', primary: true }, { id: 'reset', label: 'Reset alarm' }] }
      ], id => {
        if (id === 'jam') jam = true;
        if (id === 'reset') { alarm = ''; jam = false; tc = 0; xc = x; heat = Math.min(heat, 0.5); emax = 0; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['e', 'Following error now · largest'], ['p', 'Predicted at constant speed'], ['T', 'Motor torque'], ['h', 'I²t overload model'], ['s', 'Drive status']]);
      const pE = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'following error (mm)' } }, 180);
      const pF = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'torque (% of rated)' } }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        const mv = M.move({ dist: L, vmax: V.v, acc: V.a, dec: V.a }), per = 2 * (mv.tTotal + 0.3);
        const sub = 80, h = dt / sub;
        for (let s = 0; s < sub; s++) {
          if (!alarm) {
            { const u0 = tc % per, f0 = u0 < mv.tTotal + 0.3, w0 = f0 ? u0 : u0 - mv.tTotal - 0.3; if (!(w0 >= mv.tTotal && Math.abs(xc - x) > 0.0005)) tc += h; }   // the next move waits for 'in position'
            const u = tc % per, fwd = u < mv.tTotal + 0.3, uu = fwd ? u : u - mv.tTotal - 0.3, p = mv.at(Math.min(uu, mv.tTotal));
            dirFwd = fwd; xc = fwd ? p.x : L - p.x; vc = uu < mv.tTotal ? (fwd ? p.v : -p.v) : 0;
            const vref = V.ff / 100 * vc + V.kpp * (xc - x);
            F = clamp(Meq * (vref - v) / tauV + Ffr * Math.sign(vref), -Fpk, Fpk);
          } else F = 0;
          const fr = Math.abs(v) > 1e-6 ? Ffr * Math.sign(v) : clamp(F, -Ffr, Ffr);
          v += h * (F - fr) / Meq; x += v * h;
          if (jam && x >= 0.15) { x = 0.15; v = Math.min(0, v); }
          if (x < -0.01) { x = -0.01; v = Math.max(0, v); }
          heat += h / 60 * (Math.pow(F / Fr, 2) - heat);
          const e = xc - x;
          if (!alarm && Math.abs(e) > V.lim / 1000) alarm = 'EXCESS POSITION DEVIATION (' + (1000 * Math.abs(e)).toFixed(1) + ' mm)';
          if (!alarm && heat >= 1) alarm = 'OVERLOAD (I²t)';
        }
        const e = (xc - x) * 1000;
        emax = Math.max(emax, Math.abs(e));
        ro.set('e', e.toFixed(2) + ' mm · ' + emax.toFixed(2) + ' mm');
        ro.set('p', ((1 - V.ff / 100) * V.v / V.kpp * 1000).toFixed(2) + ' mm = (1 − FF)·v/Kpp');
        ro.set('T', (100 * F / Fr).toFixed(0) + ' % of rated');
        ro.set('h', (100 * heat).toFixed(0) + ' % (trips at 100 %)');
        ro.set('s', alarm ? alarm + ' — press Reset' : jam ? 'running — obstacle at 150 mm' : 'running');
        hist.push([t, e, 100 * F / Fr]); while (hist.length && hist[0][0] < t - 6) hist.shift();
        if (t - lastPlot > 0.1 || lastPlot < 0) {
          lastPlot = t;
          const xa = { label: 'time (s)', min: Math.max(0, t - 6), max: Math.max(6, t) };
          pE.set({ x: xa, series: [{ pts: hist.map(r => [r[0], clamp(r[1], -80, 80)]), label: 'error' }], hlines: [{ y: V.lim, label: 'limit' }, { y: -V.lim }] });
          pF.set({ x: xa, y: { label: 'torque (% of rated)', min: -320, max: 320 }, series: [{ pts: hist.map(r => [r[0], r[2]]), label: 'torque' }], hlines: [{ y: 300, label: 'peak' }, { y: 100, label: 'rated' }, { y: -100 }] });
        }
        // drawing: the screw, the table, the command ghost and the error
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 190);
        const X = xx => 80 + xx / L * 460;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(20, 80, 50, 50); c.strokeRect(20, 80, 50, 50);
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('M', 45, 109);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let xx = 70; xx < 600; xx += 6) { c.beginPath(); c.moveTo(xx, 98); c.lineTo(xx + 4, 112); c.stroke(); }
        if (jam) { c.fillStyle = C.bad; c.fillRect(X(0.15) + 40, 58, 8, 70); c.fillText('obstacle', X(0.15) + 44, 50); }
        c.strokeStyle = C.accent; c.setLineDash([5, 4]); c.lineWidth = 2; c.strokeRect(X(xc) - 40, 70, 80, 36); c.setLineDash([]);
        c.fillStyle = alarm ? C.bad : C.series[1]; c.globalAlpha = 0.8; c.fillRect(X(x) - 40, 70, 80, 36); c.globalAlpha = 1;
        c.fillStyle = C.text; c.fillText('50 kg', X(x), 93);
        kit.arrow(c, X(x), 150, X(xc), 150, C.warn, 2);
        c.fillStyle = C.muted; c.fillText('error ' + e.toFixed(1) + ' mm (dashed: command)', 320, 176);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sv-brake */
  Hyper.sim('sv-brake', {
    title: 'A vertical axis and its holding brake',
    blurb: `A carriage hangs on a 10 mm-lead ball screw driven by a 750 W servo motor with a 2.5 N·m holding brake. *Run a cycle* plays the drive's sequence: servo on, brake released after a delay, up 100 mm, down again, brake on, and — after the servo-off delay — torque off. The timeline on the left shows the servo torque, the brake coil, and whether the brake is really closed. Time runs at half speed.

**Try this**
- With the varistor (brake closes 30 ms after the coil is switched off) and a 50 ms servo-off delay, the carriage parks without moving.
- Switch to the diode: the brake now takes 100 ms to close, but the drive lets go after 50 ms — the carriage falls freely for 50 ms (about 3.5 mm) and slides another millimetre or so while the brake stops it — about 5 mm every time it parks. Raise the servo-off delay to 150 ms and the drop is gone.
- Press *Power failure* while the carriage is up: torque vanishes at once and the load falls until the brake closes. Compare varistor and diode.
- Raise the mass to 80 kg and tick *worn brake*: the brake can no longer hold the gravity torque, and with the power off the carriage slides down to the end stop.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1] = graphs(box, 1);
      const lead = 0.01, k = TAU / lead, Jrot = 2.5e-4, Fpk = 7.16 * k, Tb = 2.5, zTop = 0.3, g = 9.81;
      let V = null, ts = 0, z = 0.1, v = 0, servo = false, tServo = -9, coil = false, tCoil = -9, engaged = true, seq = null, zc = 0.1, vc = 0, zRef = null, lastDrop = null, lastPlot = -1, note = 'idle: brake holds the load';
      const hist = [], tl = [];
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Hanging mass', min: 5, max: 80, step: 1, value: 40, unit: 'kg' },
        { id: 'sup', type: 'select', label: 'Brake coil suppression', options: [['Varistor: closes 30 ms after switch-off', 0.03], ['Diode only: closes 100 ms after switch-off', 0.1]], value: 0.03 },
        { id: 'off', label: 'Servo-off delay after brake command', min: 0, max: 300, step: 5, value: 50, unit: 'ms' },
        { id: 'rel', label: 'Brake release delay after servo on', min: 0, max: 300, step: 5, value: 100, unit: 'ms' },
        { id: 'worn', type: 'check', label: 'Worn brake (40 % of its holding torque)', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run a cycle', primary: true }, { id: 'pf', label: 'Power failure' }] }
      ], id => {
        if (id === 'run' && !seq) {
          const mv = M.move({ dist: 0.1, vmax: 0.3, acc: 3, dec: 3 }), rel = V.rel / 1000;
          const s2 = rel + 0.06 + 0.04, s3 = s2 + mv.tTotal + 0.3, s4 = s3 + mv.tTotal + 0.2;
          seq = { t0: ts, mv, rel, s2, s3, s4, z0: z, done: false };
          servo = true; tServo = ts; zc = z; zRef = null; note = 'servo on';
        }
        if (id === 'pf') { servo = false; if (coil) { coil = false; tCoil = ts; } seq = null; zRef = z; note = 'POWER FAILURE: no torque, brake closing'; }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['tq', 'Gravity torque · brake torque'], ['a', 'Fall acceleration without torque'], ['coil', 'Brake coil'], ['st', 'State'], ['d', 'Last drop when parking']]);
      const pZ = kit.plot(g1, { x: { label: 'time (s, simulated)' }, y: { label: 'carriage height (mm)' } }, 170);
      const loop = kit.loop(dt => {
        const m = V.m, Meq = m + Jrot * k * k, Fb = (V.worn ? 0.4 : 1) * Tb * k, eng = V.sup;
        const sim = dt * 0.5, sub = 60, h = sim / sub;
        for (let s = 0; s < sub; s++) {
          ts += h;
          // the drive's sequence
          if (seq) {
            const u = ts - seq.t0;
            if (!coil && u >= seq.rel && u < seq.s4) { coil = true; tCoil = ts; note = 'brake released'; }
            if (u >= seq.s2 && u < seq.s3) { const p = seq.mv.at(u - seq.s2); zc = seq.z0 + p.x; vc = p.v; note = 'moving up'; }
            else if (u >= seq.s3 && u < seq.s4) { const p = seq.mv.at(u - seq.s3); zc = seq.z0 + 0.1 - p.x; vc = -p.v; note = 'moving down'; }
            else vc = 0;
            if (u >= seq.s4 && coil) { coil = false; tCoil = ts; zRef = z; note = 'brake on — the drive still holds'; }
            if (u >= seq.s4 + V.off / 1000 && servo) { servo = false; note = 'servo off'; }
            if (!servo && !coil) seq = null;
          }
          // the brake: released 60 ms after the coil is energised, closed a suppression-dependent time after it is switched off
          engaged = coil ? ts - tCoil < 0.06 : ts - tCoil >= eng;
          let F = 0;
          if (servo) {
            const ramp = clamp((ts - tServo) / 0.02, 0, 1), wn = TAU * 12;
            F = ramp * clamp(Meq * (wn * wn * (zc - z) + 2 * 0.9 * wn * (vc - v)) + m * g, -Fpk, Fpk);
          }
          const Fnet = F - m * g;
          if (engaged) {
            if (Math.abs(v) < 1e-4 && Math.abs(Fnet) <= Fb) v = 0;
            else { const dir = Math.abs(v) > 1e-4 ? Math.sign(v) : Math.sign(Fnet), v2 = v + h * (Fnet - 0.9 * Fb * dir) / Meq; v = Math.abs(v) > 1e-4 && Math.sign(v2) !== Math.sign(v) ? 0 : v2; }
          } else v += h * Fnet / Meq;
          z += v * h;
          if (engaged && !servo && v < -1e-3) note = 'the brake is slipping: the load slides down';
          if (z < 0) { z = 0; v = Math.max(0, v); }
          if (z > zTop) { z = zTop; v = Math.min(0, v); }
          if (zRef != null && engaged && !servo && Math.abs(v) < 1e-4) { lastDrop = (zRef - z) * 1000; zRef = null; if (!seq) note = 'parked: brake holds'; }
        }
        const Tg = m * g * lead / TAU, a = m * g / Meq;
        ro.set('tq', Tg.toFixed(2) + ' N·m · ' + (Fb / k).toFixed(2) + ' N·m' + (Tg > Fb / k ? ' — TOO WEAK' : ' (factor ' + (Fb / k / Tg).toFixed(1) + ')'));
        ro.set('a', a.toFixed(2) + ' m/s² (rotating parts act as ' + (Jrot * k * k).toFixed(0) + ' kg)');
        ro.set('coil', coil ? '24 V on, 8 W: released' : 'off: spring-applied');
        ro.set('st', note + (engaged && !servo && Math.abs(v) > 1e-3 ? ' — SLIPPING' : ''));
        ro.set('d', lastDrop == null ? '—' : lastDrop.toFixed(2) + ' mm');
        hist.push([ts, z * 1000]); while (hist.length && hist[0][0] < ts - 3) hist.shift();
        tl.push([ts, servo ? 1 : 0, coil ? 1 : 0, engaged ? 1 : 0]); while (tl.length && tl[0][0] < ts - 2.5) tl.shift();
        if (ts - lastPlot > 0.05 || lastPlot < 0) { lastPlot = ts; pZ.set({ x: { label: 'time (s, simulated)', min: Math.max(0, ts - 3), max: Math.max(3, ts) }, series: [{ pts: hist.slice(), label: 'height' }] }); }
        // drawing: the timeline and the axis
        const c = st.begin(), C = kit.colors();
        fit(st, c, 640, 270);
        const x0 = 110, x1 = 400, rows = [['servo torque', 1, C.accent], ['brake coil 24 V', 2, C.warn], ['brake closed', 3, C.bad]];
        c.textAlign = 'right';
        rows.forEach(([lab, idx, col], r) => {
          const y = 40 + r * 50;
          c.fillStyle = C.muted; c.fillText(lab, x0 - 8, y + 14);
          c.strokeStyle = C.faint; c.strokeRect(x0, y, x1 - x0, 24);
          c.fillStyle = col;
          for (let i = 1; i < tl.length; i++) if (tl[i][idx]) { const xa = x0 + (tl[i - 1][0] - (ts - 2.5)) / 2.5 * (x1 - x0), xb = x0 + (tl[i][0] - (ts - 2.5)) / 2.5 * (x1 - x0); c.fillRect(Math.max(x0, xa), y + 3, Math.max(0, xb - Math.max(x0, xa)), 18); }
        });
        c.fillStyle = C.muted; c.textAlign = 'center'; c.fillText('last 2.5 s (simulated) →', (x0 + x1) / 2, 200);
        c.textAlign = 'left'; c.fillStyle = C.text; c.fillText(note, x0, 230);
        // the axis: motor with brake on top, screw, carriage
        const ax = 520, top = 30, bot = 250, zy = bot - 20 - (bot - top - 70) * z / zTop;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(ax - 30, top, 60, 34); c.strokeRect(ax - 30, top, 60, 34);
        c.fillStyle = C.text; c.textAlign = 'center'; c.fillText('motor', ax, top + 21);
        c.fillStyle = engaged ? C.bad : C.ok; c.fillRect(ax - 34, top + 36, 68, 8);
        c.fillStyle = C.muted; c.fillText(engaged ? 'brake closed' : 'brake released', ax + 80, top + 44);
        c.strokeStyle = C.muted; c.lineWidth = 1; for (let y = top + 46; y < bot; y += 6) { c.beginPath(); c.moveTo(ax - 5, y); c.lineTo(ax + 5, y + 4); c.stroke(); }
        c.fillStyle = C.series[1]; c.globalAlpha = 0.85; c.fillRect(ax - 45, zy - 18, 90, 36); c.globalAlpha = 1;
        c.fillStyle = C.text; c.fillText(m + ' kg', ax, zy + 4);
        if (!servo && !engaged && z > 0.001) kit.arrow(c, ax + 60, zy - 10, ax + 60, zy + 20, C.bad, 3);
        c.fillStyle = C.faint; c.fillRect(ax - 60, bot, 120, 8);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
