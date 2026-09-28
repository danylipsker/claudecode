/* HYPER-MOTORS · sims/reference.js — reference simulations for Hyper Motors authors.
 *   ref-dc-motor   a permanent-magnet DC motor on the bench: supply and PWM, a load (constant or a fan), the winding
 *                  heating up; the torque–speed line and the datasheet curves with the live operating point
 *   ref-induction  a three-phase induction motor direct on line or on a VFD with a ramp: the rotating field and the
 *                  rotor lagging behind it (slip), the torque–speed curve against a conveyor or fan load, run-up current
 */
(function () {
  'use strict';

  const PRESETS = {
    small: { name: '12 V, 15 W (wiper-motor size)', V: 12, R: 1.6, K: 0.016, I0: 0.12, J: 4e-6, Rth: 8, Cth: 40 },
    mid: { name: '24 V, 100 W', V: 24, R: 0.5, K: 0.055, I0: 0.25, J: 6e-5, Rth: 3, Cth: 180 },
    big: { name: '48 V, 400 W', V: 48, R: 0.12, K: 0.11, I0: 0.4, J: 4e-4, Rth: 1.2, Cth: 600 }
  };
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';

  Hyper.sim('ref-dc-motor', {
    title: 'A DC motor on the bench',
    blurb: `A permanent-magnet DC motor fed from a supply through a PWM chopper, turning a load. The left graph is the motor's speed against torque at the present average voltage and winding temperature, with the load's line; they cross where the motor runs. The right graph is the datasheet view: current, output power and efficiency, each as a percentage of its largest value.

**Try this**
- Raise the load step by step: the dot slides down the speed line and the current climbs in proportion to the torque. Efficiency peaks at a light load (here about a tenth of stall torque) and falls away.
- Lower the PWM duty: the line moves down parallel to itself — lower speed at the same torque and the same current.
- Choose the fan: its torque grows with the square of speed, so halving the voltage roughly halves the speed but cuts the current to about a quarter.
- Set a load of 30 %, tick *Heat the winding* and wait: the copper warms, its resistance rises 0.39 % per kelvin, the line tilts and the motor slows. Class F insulation is rated for 155 °C.
- Press *Start from rest* under a big load: the current leaps towards the stall value until the speed — and the back-EMF — build up.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const gb = document.createElement('div'); gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      let m = PRESETS.mid, V = null, w = 0, temp = 40, ang = 0, t = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Motor', options: Object.entries(PRESETS).map(([k, p]) => [p.name, k]), value: 'mid' },
        { id: 'Vs', label: 'Supply voltage', min: 0, max: 60, step: 0.5, value: 24, unit: 'V' },
        { id: 'duty', label: 'PWM duty cycle', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'loadType', type: 'select', label: 'Load', options: [['Constant torque (a hoist, a conveyor)', 'const'], ['A fan (torque ∝ speed²)', 'fan']], value: 'const' },
        { id: 'load', label: 'Load, % of stall torque (fan: at 85 % of no-load speed)', min: 0, max: 60, step: 0.5, value: 10, unit: '%' },
        { id: 'heat', type: 'check', label: 'Heat the winding (time sped up 30×)', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }, { id: 'cool', label: 'Cool down' }] }
      ], id => {
        if (id === 'preset') { m = PRESETS[V.preset]; ctl.set('Vs', m.V); temp = 40; w = 0; }
        if (id === 'start') w = 0;
        if (id === 'cool') temp = 40;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['I', 'Current'], ['T', 'Torque'], ['P', 'Output / input power'], ['eta', 'Efficiency'], ['temp', 'Winding temperature']]);
      const p1 = kit.plot(g1, { x: { label: 'torque (N·m)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'torque (N·m)', min: 0 }, y: { label: '% of the largest value', min: 0, max: 100 }, legend: true }, 190);
      const Ts0 = () => m.K * (m.V / m.R - m.I0);                  // stall torque at the rated voltage, cold
      const wRef = () => 0.85 * (m.V - m.R * m.I0) / m.K;          // the fan's torque is specified at 85 % of no-load speed
      const loadT = ww => { const T0 = V.load / 100 * Ts0(); return V.loadType === 'fan' ? T0 * Math.pow(Math.max(0, ww) / wRef(), 2) : T0; };
      const loop = kit.loop(dt => {
        t += dt;
        const R = M.copperR(m.R, temp) / M.copperR(1, 20), Veff = V.Vs * V.duty / 100;
        // the electrical side settles in milliseconds (L/R), so it is taken as steady; the shaft and the winding temperature are integrated
        const sub = 40, h = dt / sub;
        let I = 0;
        for (let k = 0; k < sub; k++) {
          I = Math.max(0, (Veff - m.K * w) / R);
          const Tm = I > m.I0 ? m.K * (I - m.I0) : 0;
          w = Math.max(0, w + h * (Tm - loadT(w)) / m.J);          // a load cannot drive the shaft backwards
          if (V.heat) temp += h * 30 * (I * I * R - (temp - 40) / m.Rth) / m.Cth;
        }
        if (!V.heat && temp > 40) temp = Math.max(40, temp - dt * 0.5);
        const T = Math.max(0, m.K * (I - m.I0)), Pout = T * w, Pin = Veff * I, eta = Pin > 0 ? Pout / Pin : 0, n = w * 60 / (2 * Math.PI);
        ro.set('n', n.toFixed(0) + ' rpm'); ro.set('I', I.toFixed(2) + ' A'); ro.set('T', T.toFixed(3) + ' N·m');
        ro.set('P', Pout.toFixed(1) + ' W / ' + Pin.toFixed(1) + ' W'); ro.set('eta', (100 * eta).toFixed(1) + ' %');
        ro.set('temp', temp.toFixed(0) + ' °C' + (temp > 155 ? ' — above class F!' : ''));
        const d = M.dc({ V: Math.max(0.01, Veff), R, K: m.K, I0: m.I0 }), Ts = Math.max(1e-6, d.stallTorque);
        if (t - lastPlot > 0.2 || lastPlot < 0) {
          lastPlot = t;
          const N = 80, sp = [], cur = [], pw = [], ef = [], lt = [];
          let pMax = 0; for (let i = 0; i <= N; i++) pMax = Math.max(pMax, d.at(Ts * i / N).Pout);
          for (let i = 0; i <= N; i++) { const Tq = Ts * i / N, o = d.at(Tq); sp.push([Tq, Math.max(0, o.n)]); cur.push([Tq, 100 * o.I / d.stallCurrent]); pw.push([Tq, pMax > 0 ? 100 * Math.max(0, o.Pout) / pMax : 0]); ef.push([Tq, 100 * o.eff]); }
          for (let i = 0; i <= 60; i++) { const ww = d.noLoadSpeed * i / 60; if (loadT(ww) <= Ts * 1.05) lt.push([loadT(ww), ww * 60 / (2 * Math.PI)]); }
          p1.set({ x: { label: 'torque (N·m)', min: 0, max: Ts }, series: [{ pts: sp, label: 'motor at ' + Veff.toFixed(1) + ' V, ' + temp.toFixed(0) + ' °C' }, { pts: lt, label: 'load', color: kit.colors().muted, dash: [5, 4] }], marks: [{ x: T, y: n, label: 'running' }] });
          p2.set({ x: { label: 'torque (N·m)', min: 0, max: Ts }, series: [{ pts: cur, label: 'current (% of stall)' }, { pts: pw, label: 'output power (% of max)' }, { pts: ef, label: 'efficiency (%)' }],
            marks: [{ x: T, y: 100 * I / d.stallCurrent }, { x: T, y: pMax > 0 ? 100 * Pout / pMax : 0 }, { x: T, y: 100 * eta }] });
        }
        // drawing: the PWM wave, the motor with its turning armature, the load, a thermometer and the current bar
        const c = st.begin(), C = kit.colors(), W0 = 640, H0 = 250, s = Math.min(st.W / W0, st.H / H0);
        c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
        c.font = '12px ' + font(); c.textAlign = 'center';
        const px = 30, py = 70, pwid = 150, per = 30;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let x = 0; x <= pwid; x++) { const y = (x % per) / per < V.duty / 100 ? py : py + 40; x ? c.lineTo(px + x, y) : c.moveTo(px + x, y); }
        c.stroke(); c.fillStyle = C.muted;
        c.fillText(V.duty + ' % of ' + V.Vs.toFixed(1) + ' V', px + pwid / 2, py - 26); c.fillText('= ' + Veff.toFixed(1) + ' V average', px + pwid / 2, py - 11);
        c.strokeStyle = C.faint; c.beginPath(); c.moveTo(px + pwid, py + 20); c.lineTo(250, py + 20); c.stroke();
        ang += w * dt / 40;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(250, 45, 150, 90); c.strokeRect(250, 45, 150, 90);
        c.fillStyle = 'hsl(0 70% 50% / .55)'; c.fillRect(252, 47, 146, 14); c.fillStyle = 'hsl(215 70% 50% / .55)'; c.fillRect(252, 119, 146, 14);
        c.fillStyle = C.text; c.fillText('N', 325, 58); c.fillText('S', 325, 130);
        c.save(); c.translate(325, 90); c.rotate(ang); c.strokeStyle = C.accent; c.lineWidth = 3; for (let k = 0; k < 3; k++) { c.rotate(Math.PI / 3); c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.stroke(); } c.restore();
        c.fillStyle = C.text; c.fillRect(400, 86, 72, 8);
        c.save(); c.translate(510, 90);
        if (V.loadType === 'fan') { c.rotate(ang); c.fillStyle = 'hsl(200 60% 55% / .75)'; for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); c.beginPath(); c.ellipse(0, -24, 8, 22, 0, 0, 6.283); c.fill(); } }
        else { c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, 32, 0, 6.283); c.fill(); c.rotate(ang); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -28); c.stroke(); }
        c.restore();
        c.fillStyle = C.muted; c.fillText(V.loadType === 'fan' ? 'fan' : 'brake: constant torque', 510, 145);
        c.fillText('armature drawn 40 × slower than it turns', 325, 152);
        const tx = 605, tt = Math.min(1, Math.max(0, (temp - 20) / 180)), y155 = 190 - 148 * 135 / 180;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx - 6, 40, 12, 150); c.fillStyle = temp > 155 ? C.bad : 'hsl(20 85% 55%)'; c.fillRect(tx - 5, 190 - 148 * tt, 10, 148 * tt);
        c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(tx - 14, y155); c.lineTo(tx + 14, y155); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.muted; c.fillText('155 °C', tx, y155 - 5); c.fillText(temp.toFixed(0) + ' °C', tx, 206);
        const fr = Math.min(1, I / Math.max(1e-6, d.stallCurrent));
        c.fillStyle = C.faint; c.fillRect(250, 185, 300, 12); c.fillStyle = fr > 0.4 ? C.bad : C.accent; c.fillRect(250, 185, 300 * fr, 12);
        c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('current ' + I.toFixed(1) + ' A of ' + d.stallCurrent.toFixed(0) + ' A stall at this voltage', 250, 214);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  // a 7.5 kW, 400 V, 50 Hz, 4-pole star-connected cage motor (typical per-phase values; deep bars give it its starting torque)
  const IM = { V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120, deepBar: 1 };
  Hyper.sim('ref-induction', {
    title: 'An induction motor on the mains or a VFD',
    blurb: `A 7.5 kW, 4-pole, 400 V cage induction motor. The three stator phases make a magnetic field (the orange arrow) that turns at the synchronous speed; the rotor bars are dragged round a little slower — the slip — because only a difference in speed induces current in them. The graph shows the motor's torque against speed with the load's torque; they meet at the operating point.

**Try this**
- Direct on line, raise the load: the speed drops only a few per cent while the torque rises — until the load passes the breakdown torque and the motor stalls.
- Press *Start from rest* direct on line: the current leaps to five or six times the running current while the motor accelerates up its curve. A fan load starts easily; a conveyor at full load takes longer.
- Switch to the VFD and press *Start from rest*: the drive ramps the frequency up, so the whole curve slides to the right with the rotor riding just behind the field — full torque at every speed and a starting current near the running current.
- On the VFD set 25 Hz: the curve keeps its shape at half the speed (V/f holds the flux). Above 50 Hz the voltage cannot rise any further, the field weakens and the torque available falls.
- Compare the fan and the conveyor at 25 Hz: the fan needs only a quarter of its full-speed torque — one reason VFDs save so much energy on fans and pumps.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = document.createElement('div'); gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const Trated = 7500 / (1450 * 2 * Math.PI / 60), J = 0.35;
      const motorAt = f => { const k = f / 50; return M.induction(Object.assign({}, IM, { f, V_LL: M.vf({ Vn: 400, fn: 50, f, boost: 20 }), X1: IM.X1 * k, X2: IM.X2 * k, Xm: IM.Xm * k })); };
      const im50 = motorAt(50);
      const ratedSlip = (() => { let lo = 1e-4, hi = im50.sMax; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im50.at(m).T < Trated) lo = m; else hi = m; } return lo; })();
      const Irated = im50.at(ratedSlip).I1;
      let V = null, w = 0, fOut = 50, t = 0, tStart = 0, runUp = null, peakI = 0, started = false, fieldAng = 0, rotorAng = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'supply', type: 'select', label: 'Supply', options: [['Mains, direct on line (400 V, 50 Hz)', 'mains'], ['Variable-frequency drive (VFD)', 'vfd']], value: 'mains' },
        { id: 'f', label: 'VFD frequency set-point', min: 5, max: 75, step: 0.5, value: 50, unit: 'Hz' },
        { id: 'ramp', label: 'VFD acceleration ramp, 0 → 50 Hz', min: 0.5, max: 20, step: 0.5, value: 5, unit: 's' },
        { id: 'loadType', type: 'select', label: 'Load', options: [['A conveyor (constant torque)', 'const'], ['A fan (torque ∝ speed²)', 'fan']], value: 'const' },
        { id: 'load', label: 'Load, % of rated torque (fan: at 1450 rpm)', min: 0, max: 200, step: 1, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'start') { w = 0; fOut = V.supply === 'vfd' ? 0.5 : 50; tStart = t; runUp = null; peakI = 0; started = true; }
        if (id === 'supply') { ctl.show('f', V.supply === 'vfd'); ctl.show('ramp', V.supply === 'vfd'); }
        lastPlot = -1;
      });
      V = ctl.values; ctl.show('f', false); ctl.show('ramp', false);
      w = (1 - ratedSlip) * im50.ws;
      const ro = kit.readout(box.side, [['ns', 'Field (synchronous) speed'], ['n', 'Rotor speed and slip'], ['T', 'Motor torque'], ['I', 'Line current'], ['pf', 'Power factor · efficiency'], ['st', 'Peak current since Start'], ['ru', 'Run-up time']]);
      const pT = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 2300 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const pI = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 2300 }, y: { label: 'line current (A)', min: 0 }, legend: true }, 200);
      const loadT = n => { const T0 = V.load / 100 * Trated; return V.loadType === 'fan' ? T0 * Math.pow(Math.max(0, n) / 1450, 2) : T0; };
      // the steady speed on the stable side of the curve (where the load line crosses it), or null when the load is too big
      const steady = im => { let lo = 1e-5, hi = im.sMax; const g = s => im.at(s).T - loadT(im.at(s).n); if (g(hi) < 0) return null; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; } return im.at(hi).n; };
      const loop = kit.loop(dt => {
        t += dt;
        const fSet = V.supply === 'mains' ? 50 : V.f;
        if (V.supply === 'mains') fOut = 50;
        else if (fOut !== fSet) { const df = 50 / V.ramp * dt; fOut = fOut < fSet ? Math.min(fSet, fOut + df) : Math.max(fSet, fOut - df); }
        const im = motorAt(Math.max(0.5, fOut)), ws = im.ws;
        const sub = 20, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const s = 1 - w / ws, Tm = s > 0 ? im.at(Math.min(1, s)).T : -im.at(Math.max(1e-6, -s)).T;   // above synchronous speed it brakes (generates)
          w = Math.max(0, w + h * (Tm - loadT(w * 60 / (2 * Math.PI))) / J);                            // a load cannot drive the shaft backwards
        }
        const s = Math.max(1e-5, 1 - w / ws), op = im.at(Math.min(1, s)), n = w * 60 / (2 * Math.PI);
        if (started) peakI = Math.max(peakI, op.I1);
        const nss = steady(motorAt(fSet));
        if (started && runUp == null && fOut === fSet && nss != null && n >= 0.98 * nss) runUp = t - tStart;
        ro.set('ns', im.ns.toFixed(0) + ' rpm = 120 f / p at ' + fOut.toFixed(1) + ' Hz');
        ro.set('n', nss == null && n < 30 ? 'stalled — the load is above the breakdown torque' : n.toFixed(0) + ' rpm, slip ' + (100 * s).toFixed(1) + ' %');
        ro.set('T', op.T.toFixed(1) + ' N·m (rated ' + Trated.toFixed(1) + ', breakdown ' + im.Tmax.toFixed(0) + ')');
        ro.set('I', op.I1.toFixed(1) + ' A (rated ' + Irated.toFixed(1) + ' A)');
        ro.set('pf', op.pf.toFixed(2) + ' · ' + (100 * Math.max(0, op.eff)).toFixed(1) + ' %');
        ro.set('st', started ? peakI.toFixed(0) + ' A = ' + (peakI / Irated).toFixed(1) + ' × rated' : 'press Start from rest');
        ro.set('ru', runUp != null ? runUp.toFixed(2) + ' s' : started ? (nss == null ? 'cannot reach speed' : (t - tStart).toFixed(1) + ' s …') : '—');
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          const curve = [], cur = [], lc = [];
          for (let i = 0; i <= 160; i++) { const r = im.at(Math.max(1e-4, 1 - i / 160)); curve.push([r.n, r.T]); cur.push([r.n, r.I1]); }
          for (let i = 0; i <= 40; i++) { const nn = 2300 * i / 40; lc.push([nn, loadT(nn)]); }
          pT.set({ series: [{ pts: curve, label: 'motor at ' + fOut.toFixed(0) + ' Hz' }, { pts: lc, label: 'load', color: kit.colors().muted, dash: [5, 4] }], marks: [{ x: n, y: op.T, label: 'now' }], vlines: [{ x: im.ns, label: 'n_s' }], hlines: [{ y: Trated, label: 'rated' }] });
          pI.set({ series: [{ pts: cur, label: 'current at ' + fOut.toFixed(0) + ' Hz' }], marks: [{ x: n, y: op.I1, label: 'now' }], hlines: [{ y: Irated, label: 'rated' }] });
        }
        // drawing: the stator coils lit by their phase currents, the field arrow and the rotor bars (both slowed 25×)
        fieldAng += ws * dt / 25; rotorAng += w * dt / 25;
        const c = st.begin(), C = kit.colors(), W0 = 640, H0 = 270, sc = Math.min(st.W / W0, st.H / H0);
        c.save(); c.translate((st.W - W0 * sc) / 2, (st.H - H0 * sc) / 2); c.scale(sc, sc);
        c.font = '12px ' + font(); c.textAlign = 'center';
        const cx = 170, cy = 130;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 112, 0, 6.283); c.stroke(); c.beginPath(); c.arc(cx, cy, 86, 0, 6.283); c.stroke();
        const cols = ['0 75% 55%', '45 90% 50%', '215 75% 55%'];
        for (let k = 0; k < 6; k++) {
          const a = k * Math.PI / 3, p = k % 3, amp = Math.cos(fieldAng - p * 2 * Math.PI / 3) * (k >= 3 ? -1 : 1);
          c.fillStyle = 'hsl(' + cols[p] + ' / ' + (0.2 + 0.7 * Math.max(0, amp)).toFixed(2) + ')'; c.beginPath(); c.arc(cx + 99 * Math.cos(a), cy + 99 * Math.sin(a), 12, 0, 6.283); c.fill();
          c.fillStyle = C.text; c.fillText(['U', 'V', 'W'][p] + (k >= 3 ? '′' : ''), cx + 99 * Math.cos(a), cy + 99 * Math.sin(a) + 4);
        }
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 70, 0, 6.283); c.fill();
        for (let k = 0; k < 16; k++) { const a = rotorAng + k * Math.PI / 8; c.fillStyle = C.muted; c.beginPath(); c.arc(cx + 60 * Math.cos(a), cy + 60 * Math.sin(a), 5, 0, 6.283); c.fill(); }
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 8, 0, 6.283); c.fill();
        kit.arrow(c, cx - 50 * Math.cos(fieldAng), cy - 50 * Math.sin(fieldAng), cx + 66 * Math.cos(fieldAng), cy + 66 * Math.sin(fieldAng), 'hsl(22 90% 55%)', 4);
        c.fillStyle = C.muted; c.fillText('field and rotor drawn 25 × slower than they turn', cx, 262);
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '14px ' + font();
        c.fillText('field: ' + im.ns.toFixed(0) + ' rpm', 330, 60); c.fillText('rotor: ' + n.toFixed(0) + ' rpm', 330, 85); c.fillText('slip: ' + (100 * s).toFixed(1) + ' %', 330, 110);
        c.fillText('supply: ' + M.vf({ Vn: 400, fn: 50, f: fOut, boost: 20 }).toFixed(0) + ' V at ' + fOut.toFixed(1) + ' Hz', 330, 140);
        c.fillStyle = C.muted; c.font = '12px ' + font();
        c.fillText(V.supply === 'mains' ? 'direct on line: full voltage at once' : fOut > 50 ? 'above 50 Hz: the voltage is at its limit, the field weakens' : fOut < fSet ? 'the drive is ramping the frequency up' : 'V/f: the flux is held constant', 330, 162);
        const fr = Math.min(1, op.I1 / (7 * Irated));
        c.fillStyle = C.faint; c.fillRect(330, 190, 280, 12); c.fillStyle = op.I1 > 2 * Irated ? C.bad : C.accent; c.fillRect(330, 190, 280 * fr, 12);
        c.fillStyle = C.muted; c.fillText('line current ' + op.I1.toFixed(1) + ' A (bar = 7 × rated)', 330, 220);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
