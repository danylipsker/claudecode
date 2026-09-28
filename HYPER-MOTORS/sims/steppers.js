/* HYPER-MOTORS · sims/steppers.js — stepper motors and their drivers.
 *   st-principle    one step at a time: a two-pole rotor and a hybrid's teeth unrolled, the phase currents, the static torque curve
 *   st-types        a can-stack PM, a variable-reluctance and a hybrid stepper fed the same pulses; detent torque with the power off
 *   st-frames       NEMA frames 8 to 34 drawn to scale, with typical torques, currents, inductances and inertias
 *   st-wiring       4-, 6- and 8-lead motors: unipolar, bipolar series and parallel, a multimeter on the leads, the curves
 *   st-microstep    full, half and microstepping: the current vector, phase currents, incremental torque and friction
 *   st-torque-speed pull-out and pull-in curves against supply voltage, current and load inertia, with the operating point
 *   st-resonance    a rotor stepped through its natural frequency: ringing, resonance, lost steps, damping
 *   st-chopper      one phase of a chopper driver: the H-bridge, slow, fast and mixed decay, current, supply current
 *   st-dip          a 2-phase driver with DIP switches you can flip: current, idle reduction, microsteps
 *   st-stepdir      step, direction and enable: opto inputs at 5, 12 and 24 V, pulse width, set-up time, missed pulses
 *   st-closed-loop  open-loop and closed-loop steppers under a load that grows: lost steps, current, heat
 *   st-sizing       sizing a stepper for a screw axis: the move, the torques, the margin and the inertia ratio
 * The torque–speed model (pullOut) is written here, a voltage-limited phasor model with the rotor's inertia; kit.motor.stepper
 * (since corrected along the same lines) gives similar curves.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const plotRow = (box, n) => {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  };
  // draw in a fixed design space W0 × H0, scaled to the stage
  const frame = (st, W0, H0) => {
    const c = st.begin(), s = Math.min(st.W / W0, st.H / H0);
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return { c, s, toDesign: p => ({ x: (p.x - (st.W - W0 * s) / 2) / s, y: (p.y - (st.H - H0 * s) / 2) / s }) };
  };
  const NCOL = 'hsl(0 72% 55%)', SCOL = 'hsl(215 72% 55%)';
  const polCol = (v, a) => v > 0 ? 'hsl(215 72% 55% / ' + a + ')' : 'hsl(0 72% 55% / ' + a + ')';   // + = south face (pulls a north pole)

  // typical two-phase 1.8° hybrids: rated current per phase (two phases on), resistance and inductance per phase,
  // holding torque at rated current, rotor inertia (kg·m²)
  const MOTORS = {
    n17: { name: 'NEMA 17, 48 mm long (0.42 N·m, 1.7 A)', short: 'NEMA 17', I: 1.7, R: 1.5, L: 2.8e-3, Th: 0.42, J: 5.7e-6 },
    n23: { name: 'NEMA 23, 56 mm long (1.26 N·m, 2.8 A)', short: 'NEMA 23', I: 2.8, R: 0.9, L: 2.5e-3, Th: 1.26, J: 3.0e-5 },
    n34: { name: 'NEMA 34, 80 mm long (4.5 N·m, 4.2 A)', short: 'NEMA 34', I: 4.2, R: 0.6, L: 4.5e-3, Th: 4.5, J: 1.4e-4 }
  };
  /* Pull-out torque (N·m) at n rpm of a two-phase hybrid on a sine-microstepping chopper driver.
     Per phase: V = E + I (R + jX), E = Kp ω with Kp = Th/(√2 I) (holding torque is measured with two phases on),
     X = N_r ω L; the driver's current amplitude is √2 · I · k and the phase voltage amplitude at most Vs. The rotor
     settles at the current angle ψ (to its EMF) that gives the most torque Kp·I·cos ψ — at speed a leading current
     lowers the voltage needed. An upper bound: iron loss, detent torque and resonance dips are left out. */
  function pullOut(m, Vs, n, k, Nr) {
    Nr = Nr || 50; k = k == null ? 1 : k;
    const w = Math.max(0, n) * TAU / 60, Kp = m.Th / (Math.SQRT2 * m.I), Iset = Math.SQRT2 * m.I * k;
    const E = Kp * w, X = Nr * w * m.L, Z = Math.max(1e-9, Math.hypot(m.R, X)), phi = Math.atan2(X, m.R);
    let best = 0, Ib = 0;
    for (let j = 0; j <= 60; j++) {
      const psi = Math.PI / 2 * j / 60, a = Math.cos(psi + phi), sn = Math.sin(psi + phi);
      const disc = Vs * Vs - E * E * sn * sn;
      if (disc < 0) continue;
      let I = (-E * a + Math.sqrt(disc)) / Z;
      if (!(I > 0)) continue;
      I = Math.min(I, Iset);
      const T = Kp * I * Math.cos(psi);
      if (T > best) { best = T; Ib = I; }
    }
    return { T: best, I: Ib, Iset, frac: Iset > 0 ? Ib / Iset : 0 };
  }
  // the start–stop (pull-in) limit, estimated: starting without a ramp, the rotor must reach the step speed within about
  // one full step, so J ω² / (2 Δθ) of the torque goes into acceleration (Δθ = one full step)
  const pullIn = (m, Vs, n, k, Jload, Nr) => {
    Nr = Nr || 50;
    const w = Math.max(0, n) * TAU / 60, dth = Math.PI / (2 * Nr);
    return Math.max(0, pullOut(m, Vs, n, k, Nr).T - (m.J + (Jload || 0)) * w * w / (2 * dth));
  };

  /* ================================================================ st-principle */
  Hyper.sim('st-principle', {
    title: 'How a stepper steps',
    blurb: `Left: a two-phase stepper with the simplest rotor, a two-pole magnet, so each full step turns it 90°. Pole faces are coloured by their polarity (blue south, red north); the orange arrow is the field the phase currents make; the rotor's red north end is pulled towards it. Right: inside a real hybrid, unrolled and magnified — each step moves the rotor teeth a quarter of a tooth pitch, 1.8°. The graphs show the phase currents step by step and the static torque curve: the restoring torque against the rotor's lag behind the field.

**Try this**
- Press *Step +* a few times in each mode and read the A and B currents: wave drive energises one phase at a time, full step two, half step alternates.
- Add a load of 50 %: the rotor sits behind the field (a third of a step on the hybrid) — the operating point climbs the sine curve.
- In wave drive raise the load to 80 %: the rotor slips and keeps losing steps, because one phase gives only 71 % of the holding torque. Switch to full step: it holds again.
- Run at 6 steps/s with no load and watch the rotor overshoot and ring after every step — the seed of resonance.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      let V = null, k = 0, thC = 0, thR = 0, wR = 0, acc = 0, hist = [], lastPlot = -1, t = 0;
      const modeAngle = (mode, kk) => mode === 'wave' ? kk * Math.PI / 2 : mode === 'full' ? Math.PI / 4 + kk * Math.PI / 2 : kk * Math.PI / 4;
      const modeAmp = (mode, kk) => mode === 'wave' ? 1 : mode === 'full' ? Math.SQRT2 : (((kk % 2) + 2) % 2 ? Math.SQRT2 : 1);
      const currents = () => { const a = modeAngle(V.mode, k), A = modeAmp(V.mode, k); return { iA: Math.round(A * Math.cos(a) * 1000) / 1000, iB: Math.round(A * Math.sin(a) * 1000) / 1000, amp: A, a }; };
      const stepDeg = () => V.mode === 'half' ? 0.9 : 1.8;
      const record = () => { const c = currents(); hist.push([k, c.iA, c.iB]); if (hist.length > 24) hist.shift(); lastPlot = -1; };
      const doStep = d => { k += d; thC = modeAngle(V.mode, k); record(); };
      const reset = () => { k = 0; thC = modeAngle(V.mode, 0); thR = thC; wR = 0; hist = []; record(); };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Step mode', options: [['Wave drive (one phase on)', 'wave'], ['Full step (two phases on)', 'full'], ['Half step', 'half']], value: 'full' },
        { id: 'run', type: 'check', label: 'Run continuously', value: false },
        { id: 'rate', label: 'Step rate', min: 0.5, max: 8, step: 0.5, value: 2, unit: 'steps/s' },
        { id: 'load', label: 'Load torque, % of holding torque', min: 0, max: 120, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'fwd', label: 'Step +', primary: true }, { id: 'back', label: 'Step −' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'fwd') doStep(1);
        if (id === 'back') doStep(-1);
        if (id === 'reset' || id === 'mode') reset();
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Steps commanded'], ['ab', 'Phase currents A, B'], ['th', 'Holding torque in this state'], ['lag', 'Rotor lag behind the field'], ['hy', 'Same steps on a 1.8° hybrid'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'step number' }, y: { label: 'phase current (× rated)', min: -1.6, max: 1.6 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'rotor lag behind the field (full steps)', min: -2, max: 2 }, y: { label: 'torque (% of holding)', min: -110, max: 110 }, legend: true }, 170);
      reset();
      const loop = kit.loop(dt => {
        t += dt;
        if (V.run) { acc += dt * V.rate; while (acc >= 1) { acc -= 1; doStep(1); } } else acc = 0;
        const cur = currents(), Tmax = cur.amp / Math.SQRT2, TL = V.load / 100;
        // the rotor (visual time scale): J θ'' = Tmax sin(θc − θr) − T_load − c θ'; the load is a weight pulling backwards
        const K = 250, cdamp = 5.5, sub = 20, h = dt / sub;
        for (let i = 0; i < sub; i++) {
          const T = Tmax * Math.sin(thC - thR) - TL;
          wR += h * (K * T - cdamp * wR);
          thR += h * wR;
        }
        const lag = thC - thR, lagSteps = lag / (Math.PI / 2), lost = Math.round((lag - Math.asin(clamp(TL / Math.max(1e-9, Tmax), -1, 1))) / TAU) * 4;
        const slipping = TL > Tmax;
        ro.set('k', k + (V.mode === 'half' ? ' half steps' : ' steps'));
        ro.set('ab', cur.iA.toFixed(2) + ', ' + cur.iB.toFixed(2) + ' × rated');
        ro.set('th', (100 * Tmax).toFixed(0) + ' % of the two-phase holding torque');
        ro.set('lag', (lag * 180 / Math.PI).toFixed(0) + '° electrical = ' + (lag * 180 / Math.PI / 50).toFixed(2) + '° on a hybrid');
        ro.set('hy', (k * stepDeg()).toFixed(1) + '° commanded');
        ro.set('st', slipping ? 'slipping — the load exceeds the torque' : lost > 0 ? 'lost ' + lost + ' full steps' : 'holding');
        if (lastPlot < 0 || t - lastPlot > 0.3) {
          lastPlot = t;
          const pa = [], pb = [];
          hist.forEach((hh, i) => { const x0 = hh[0], x1 = i + 1 < hist.length ? hist[i + 1][0] : hh[0] + 1; pa.push([x0, hh[1]], [x1, hh[1]]); pb.push([x0, hh[2]], [x1, hh[2]]); });
          p1.set({ series: [{ pts: pa, label: 'phase A' }, { pts: pb, label: 'phase B' }] });
          const tc = [];
          for (let i = 0; i <= 80; i++) { const x = -2 + 4 * i / 80; tc.push([x, 100 * Tmax * Math.sin(x * Math.PI / 2)]); }
          const ls = clamp(lagSteps - 4 * Math.round(lagSteps / 4), -2, 2);
          p2.set({ series: [{ pts: tc, label: 'motor torque, this state' }, { pts: [[-2, 100 * TL], [2, 100 * TL]], label: 'load', color: kit.colors().muted, dash: [5, 4] }], marks: [{ x: ls, y: 100 * Tmax * Math.sin(ls * Math.PI / 2), label: 'rotor' }] });
        }
        // ---- drawing
        const { c } = frame(st, 720, 300), C = kit.colors();
        const cx = 160, cy = 150;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.arc(cx, cy, 128, 0, TAU); c.arc(cx, cy, 104, 0, TAU, true); c.fill(); c.stroke();
        const poles = [[0, 'A', cur.iA], [Math.PI, 'A′', -cur.iA], [Math.PI / 2, 'B', cur.iB], [3 * Math.PI / 2, 'B′', -cur.iB]];
        for (const [ang, name, v] of poles) {
          c.save(); c.translate(cx, cy); c.rotate(ang);
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.fillRect(-16, -106, 32, 34); c.strokeRect(-16, -106, 32, 34);
          c.fillStyle = Math.abs(v) > 0.01 ? polCol(v, 0.85) : C.faint; c.fillRect(-20, -76, 40, 8);
          c.strokeStyle = Math.abs(v) > 0.01 ? C.warn : C.muted; c.lineWidth = 2;
          for (let j = 0; j < 4; j++) { c.beginPath(); c.moveTo(-19, -100 + j * 7); c.lineTo(19, -97 + j * 7); c.stroke(); }
          c.restore();
          c.fillStyle = C.text; c.font = 'bold 13px ' + font();
          c.fillText(name, cx + 142 * Math.sin(ang), cy - 142 * Math.cos(ang) + 5);
        }
        c.font = '12px ' + font();
        // rotor: red north half towards θr
        c.save(); c.translate(cx, cy); c.rotate(thR);
        c.fillStyle = NCOL; c.beginPath(); c.arc(0, 0, 58, -Math.PI, 0); c.fill();
        c.fillStyle = SCOL; c.beginPath(); c.arc(0, 0, 58, 0, Math.PI); c.fill();
        c.fillStyle = '#fff'; c.font = 'bold 14px ' + font(); c.fillText('N', 0, -30); c.fillText('S', 0, 42);
        c.restore();
        const fl = 40 * cur.amp;
        kit.arrow(c, cx, cy, cx + fl * Math.sin(thC), cy - fl * Math.cos(thC), 'hsl(28 95% 55%)', 4);
        c.fillStyle = C.muted; c.font = '12px ' + font();
        c.fillText('simple motor: 90° a full step', cx, 294);
        // the hybrid's teeth, unrolled
        const P = 21, X0 = 348, yS = 70, yR = 104, s = (thR / TAU) * P;
        c.textAlign = 'left'; c.fillStyle = C.text; c.fillText('Inside a hybrid (unrolled, magnified): teeth line up under the active pole', X0 - 6, 22);
        const act = [cur.iA > 0.01, cur.iB > 0.01, cur.iA < -0.01, cur.iB < -0.01], names = ['A', 'B', 'A′', 'B′'];
        for (let j = 0; j < 4; j++) {
          const px = X0 + j * 4.25 * P;
          c.fillStyle = act[j] ? 'hsl(28 95% 55% / .35)' : C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.fillRect(px - 4, yS - 34, 3 * P - 2, 26); c.strokeRect(px - 4, yS - 34, 3 * P - 2, 26);
          for (let tt = 0; tt < 3; tt++) { c.fillStyle = act[j] ? 'hsl(28 95% 55%)' : C.muted; c.fillRect(px + tt * P, yS - 8, P / 2, 12); }
          c.fillStyle = C.text; c.textAlign = 'center'; c.fillText(names[j], px + 1.4 * P, yS - 17);
        }
        c.save(); c.beginPath(); c.rect(X0 - 10, yR - 20, 16 * P + 20, 60); c.clip();
        c.fillStyle = C.faint; c.fillRect(X0 - 10, yR, 16 * P + 20, 22);
        for (let i = -2; i < 20; i++) { const x = X0 + s + i * P - 0; c.fillStyle = NCOL; c.fillRect(x, yR - 12, P / 2, 12); }
        c.restore();
        c.fillStyle = C.muted; c.textAlign = 'center';
        c.fillText('rotor teeth (pitch 7.2°) move ¼ tooth = 1.8° per full step', X0 + 8 * P, yR + 40);
        // phase current bars
        const bx = X0 + 20, by = 190;
        c.textAlign = 'left'; c.fillStyle = C.text; c.fillText('Phase currents (rated = 1)', bx - 20, by - 18);
        [['A', cur.iA], ['B', cur.iB]].forEach(([nm, v], i) => {
          const y = by + i * 34;
          c.fillStyle = C.faint; c.fillRect(bx + 20, y, 240, 14);
          c.fillStyle = v >= 0 ? C.accent : C.warn; const w0 = bx + 140, wv = 100 * v;
          c.fillRect(Math.min(w0, w0 + wv), y, Math.abs(wv), 14);
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(w0, y - 3); c.lineTo(w0, y + 17); c.stroke();
          c.fillStyle = C.text; c.fillText(nm, bx, y + 12); c.fillText((v >= 0 ? '+' : '') + v.toFixed(2), bx + 268, y + 12);
        });
        c.fillStyle = slipping ? C.bad : C.muted;
        c.fillText(slipping ? 'load above the torque this state can give: the rotor slips' : 'load ' + V.load.toFixed(0) + ' % — rotor ' + (lag * 180 / Math.PI).toFixed(0) + '° electrical behind', bx - 20, 272);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-types */
  Hyper.sim('st-types', {
    title: 'Three kinds of stepper, the same pulses',
    blurb: `Three steppers receive the same step pulses. The **permanent-magnet can-stack** has a 24-pole ring magnet and claw poles from two cups (drawn in one ring; really they sit one behind the other): 7.5° a step. The **variable-reluctance** motor has a plain iron rotor with 4 teeth and 6 stator poles (three phases): 30° a step here (real VR motors have more teeth, typically 15°). The **hybrid** has 50 rotor teeth under 8 toothed stator poles: 1.8° a step — watch which poles' teeth line up with the red rotor teeth.

**Try this**
- Step a few times and compare the angles: the same four pulses turn the PM motor 30°, the VR motor 120° and the hybrid only 7.2°.
- Switch the power off and press *Nudge the rotors*: the PM and hybrid rotors snap into their nearest detent notch; the VR rotor stays wherever it was pushed — it has no magnet.
- Power on again: all three pull back to the energised position.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      let V = null, k = 0, acc = 0;
      const rot = [0, 0, 0];           // actual rotor angles (deg): PM, VR, hybrid
      const stepA = [7.5, 30, 1.8];
      const ctl = kit.controls(box.side, [
        { id: 'run', type: 'check', label: 'Run continuously', value: true },
        { id: 'rate', label: 'Step rate', min: 0.5, max: 6, step: 0.5, value: 1.5, unit: 'steps/s' },
        { id: 'power', type: 'check', label: 'Power on (windings energised)', value: true },
        { type: 'buttons', items: [{ id: 'step', label: 'Step', primary: true }, { id: 'nudge', label: 'Nudge the rotors' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'step' && V.power) k++;
        if (id === 'nudge') for (let i = 0; i < 3; i++) rot[i] += (i === 1 ? 17 : i === 0 ? 5 : 1.1) * (Math.random() < 0.5 ? -1 : 1);
        if (id === 'reset') { k = 0; rot.fill(0); }
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Steps'], ['pm', 'Can-stack PM (7.5°)'], ['vr', 'Variable reluctance (30°)'], ['hy', 'Hybrid (1.8°)'], ['det', 'Detent torque (power off)']]);
      const loop = kit.loop(dt => {
        if (V.run && V.power) { acc += dt * V.rate; while (acc >= 1) { acc -= 1; k++; } } else acc = 0;
        for (let i = 0; i < 3; i++) {
          let target;
          if (V.power) target = k * stepA[i];
          else if (i === 1) target = rot[i];                                       // VR: no magnet, no detent
          else { const d = i === 0 ? 7.5 : 1.8; target = Math.round(rot[i] / d) * d; }  // PM and hybrid snap to a notch
          rot[i] += (target - rot[i]) * Math.min(1, dt * 9);
        }
        ro.set('k', String(k));
        ro.set('pm', rot[0].toFixed(1) + '° — 48 steps/rev'); ro.set('vr', rot[1].toFixed(1) + '° — 12 steps/rev'); ro.set('hy', rot[2].toFixed(1) + '° — 200 steps/rev');
        ro.set('det', V.power ? 'energised: all hold' : 'PM and hybrid hold in a notch; VR spins free');
        const { c } = frame(st, 720, 300), C = kit.colors();
        const col = [120, 360, 600], cy = 140;
        const phaseOn = V.power;
        // --- PM can-stack: 24-pole ring magnet, claws of cup A at 15j°, cup B at 15j + 7.5°
        {
          const cx = col[0], ph = ((k % 4) + 4) % 4, cupA = ph % 2 === 0, sgn = ph < 2 ? 1 : -1;
          for (let j = 0; j < 48; j++) {
            const a = (j * 7.5 - 90) * Math.PI / 180, isA = j % 2 === 0, idx = Math.floor(j / 2);
            const on = phaseOn && (isA === cupA), pol = (idx % 2 === 0 ? 1 : -1) * sgn;
            c.fillStyle = on ? polCol(pol, 0.85) : C.faint;
            c.beginPath(); c.moveTo(cx + 96 * Math.cos(a - 0.05), cy + 96 * Math.sin(a - 0.05)); c.lineTo(cx + 96 * Math.cos(a + 0.05), cy + 96 * Math.sin(a + 0.05)); c.lineTo(cx + 78 * Math.cos(a), cy + 78 * Math.sin(a)); c.closePath(); c.fill();
          }
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, 98, 0, TAU); c.stroke();
          for (let i = 0; i < 24; i++) {
            const a0 = ((rot[0] + i * 15 - 7.5) - 90) * Math.PI / 180, a1 = a0 + 15 * Math.PI / 180;
            c.fillStyle = i % 2 === 0 ? NCOL : SCOL; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, 74, a0, a1); c.closePath(); c.fill();
          }
          c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, 40, 0, TAU); c.fill();
        }
        // --- VR: 6 stator poles (A at 0/180, B at 60/240, C at 120/300), 4 rotor teeth
        {
          const cx = col[1], phIdx = ((-k % 3) + 3) % 3;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.surface2;
          c.beginPath(); c.arc(cx, cy, 104, 0, TAU); c.arc(cx, cy, 90, 0, TAU, true); c.fill(); c.stroke();
          for (let p = 0; p < 6; p++) {
            const a = p * 60, on = phaseOn && (p % 3 === phIdx);
            c.save(); c.translate(cx, cy); c.rotate(a * Math.PI / 180);
            c.fillStyle = on ? 'hsl(28 95% 55% / .8)' : C.faint; c.fillRect(-11, -91, 22, 30);
            c.restore();
            c.fillStyle = C.text; c.font = '11px ' + font(); c.fillText('ABC'[p % 3], cx + 116 * Math.sin(a * Math.PI / 180), cy - 116 * Math.cos(a * Math.PI / 180) + 4);
          }
          c.save(); c.translate(cx, cy); c.rotate(rot[1] * Math.PI / 180); c.fillStyle = C.muted;
          for (let i = 0; i < 4; i++) { c.save(); c.rotate(i * Math.PI / 2); c.fillRect(-12, -58, 24, 58); c.restore(); }
          c.beginPath(); c.arc(0, 0, 32, 0, TAU); c.fill();
          c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -54); c.stroke();
          c.restore();
        }
        // --- hybrid: 8 stator poles with 5 teeth each (pitch 7.2°), 50 rotor teeth (front cup, north)
        {
          const cx = col[2], ph = ((k % 4) + 4) % 4, aOn = ph % 2 === 0, sgn = ph < 2 ? 1 : -1;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillStyle = C.surface2;
          c.beginPath(); c.arc(cx, cy, 108, 0, TAU); c.arc(cx, cy, 94, 0, TAU, true); c.fill(); c.stroke();
          for (let p = 0; p < 8; p++) {
            const a = p * 45, isA = p % 2 === 0, on = phaseOn && isA === aOn;
            const pol = ((isA ? p / 2 : (p - 1) / 2) % 2 === 0 ? 1 : -1) * sgn;
            c.save(); c.translate(cx, cy); c.rotate(a * Math.PI / 180);
            c.fillStyle = on ? polCol(pol, 0.8) : C.faint; c.fillRect(-10, -95, 20, 26);
            c.restore();
            for (let tt = -2; tt <= 2; tt++) {
              const ta = (a + tt * 7.2 - 90) * Math.PI / 180;
              c.fillStyle = on ? polCol(pol, 0.95) : C.muted;
              c.beginPath(); c.moveTo(cx + 69 * Math.cos(ta - 0.03), cy + 69 * Math.sin(ta - 0.03)); c.lineTo(cx + 69 * Math.cos(ta + 0.03), cy + 69 * Math.sin(ta + 0.03));
              c.lineTo(cx + 64 * Math.cos(ta + 0.03), cy + 64 * Math.sin(ta + 0.03)); c.lineTo(cx + 64 * Math.cos(ta - 0.03), cy + 64 * Math.sin(ta - 0.03)); c.closePath(); c.fill();
            }
          }
          c.fillStyle = C.faint; c.beginPath(); c.arc(cx, cy, 57, 0, TAU); c.fill();
          for (let i = 0; i < 50; i++) {
            const ta = (rot[2] + i * 7.2 - 90) * Math.PI / 180;
            c.fillStyle = NCOL; c.beginPath(); c.moveTo(cx + 57 * Math.cos(ta - 0.035), cy + 57 * Math.sin(ta - 0.035)); c.lineTo(cx + 57 * Math.cos(ta + 0.035), cy + 57 * Math.sin(ta + 0.035));
            c.lineTo(cx + 63 * Math.cos(ta + 0.03), cy + 63 * Math.sin(ta + 0.03)); c.lineTo(cx + 63 * Math.cos(ta - 0.03), cy + 63 * Math.sin(ta - 0.03)); c.closePath(); c.fill();
          }
          c.save(); c.translate(cx, cy); c.rotate(rot[2] * Math.PI / 180); c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -50); c.stroke(); c.restore();
        }
        c.font = '13px ' + font(); c.fillStyle = C.text;
        ['Permanent-magnet can-stack', 'Variable reluctance', 'Hybrid'].forEach((s, i) => c.fillText(s, col[i], 268));
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        ['7.5° a step · detent', '30° a step · no detent', '1.8° a step · detent'].forEach((s, i) => c.fillText(s, col[i], 286));
        if (!V.power) { c.fillStyle = C.warn; c.fillText('power off: pulses are ignored', 360, 18); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-frames */
  // typical hybrid frames: flange, hole spacing and holes, pilot, shaft (mm); [body length mm, holding torque N·m] per stack;
  // current, inductance, rotor inertia (g·cm², shortest to longest stack) and mass — ranges across makers
  const FRAMES = [
    { n: 8, flange: 20.3, holes: 16, hole: 'M2 threads', hd: 2, pilot: 15, shaft: 4, lens: [[30, 0.018], [38, 0.025], [42, 0.03]], I: '0.4–0.8 A', L: '1–5 mH', J: [2, 5], mass: '0.05–0.1 kg' },
    { n: 11, flange: 28, holes: 23, hole: 'M2.5 threads', hd: 2.5, pilot: 22, shaft: 5, lens: [[32, 0.045], [45, 0.08], [51, 0.12]], I: '0.5–1.2 A', L: '1.5–6 mH', J: [9, 20], mass: '0.1–0.2 kg' },
    { n: 14, flange: 35, holes: 26, hole: 'M3 threads', hd: 3, pilot: 22, shaft: 5, lens: [[28, 0.12], [34, 0.2], [52, 0.4]], I: '0.4–1.5 A', L: '2–10 mH', J: [10, 40], mass: '0.15–0.35 kg' },
    { n: 17, flange: 42.3, holes: 31, hole: 'M3 threads', hd: 3, pilot: 22, shaft: 5, lens: [[34, 0.28], [40, 0.42], [48, 0.55], [60, 0.65]], I: '0.4–2.5 A (often 1.5–2 A)', L: '1.5–10 mH', J: [35, 120], mass: '0.2–0.5 kg' },
    { n: 23, flange: 56.4, holes: 47.14, hole: 'Ø 5.1 mm through', hd: 5.1, pilot: 38.1, shaft: 6.35, lens: [[41, 0.55], [56, 1.26], [76, 1.9], [112, 3.0]], I: '1–5.6 A (often 2.8–4.2 A)', L: '1–6 mH', J: [120, 800], mass: '0.4–1.6 kg' },
    { n: 34, flange: 86, holes: 69.6, hole: 'Ø 5.5–6.5 mm through', hd: 6, pilot: 73, shaft: 12.7, lens: [[65, 3.0], [80, 4.5], [98, 6.5], [118, 8.5], [156, 12]], I: '3–7 A (often 4–6 A)', L: '2–10 mH', J: [900, 4000], mass: '1.5–5.5 kg' }
  ];
  Hyper.sim('st-frames', {
    title: 'NEMA frames to scale',
    blurb: `Hybrid stepper frames from NEMA 8 to NEMA 34, drawn to the same scale: the mounting face (flange, bolt pattern, pilot and shaft) and the body seen from the side. The numbers are **typical** of catalogues across makers — the frame fixes the mounting, while the length and winding set the torque, current and inductance. The graph shows holding torque against body length for every frame.

**Try this**
- Step through the frames: each NEMA number is roughly the flange in tenths of an inch — NEMA 23 ≈ 2.3 in ≈ 58 mm.
- Tick *Show all faces* to see how the frames nest; a NEMA 34 has about 4 times the flange area of a NEMA 17.
- Slide the stack length on a NEMA 23: the holding torque rises from about 0.55 to 3 N·m with length, and the rotor inertia with it.
- Compare the torque per kilogram of a long NEMA 17 and a short NEMA 23: a bigger diameter is usually the better way to more torque.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = plotRow(box, 1);
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'fr', type: 'select', label: 'Frame', options: FRAMES.map((f, i) => ['NEMA ' + f.n + ' (' + Math.round(f.flange) + ' mm flange)', i]), value: 4 },
        { id: 'len', label: 'Stack length (short → long)', min: 0, max: 100, step: 1, value: 33, unit: '%' },
        { id: 'all', type: 'check', label: 'Show all faces', value: false }
      ], () => { drawPlot(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['fl', 'Flange · pilot · shaft'], ['ho', 'Mounting holes'], ['le', 'Body length'], ['th', 'Holding torque (typical)'], ['cu', 'Current per phase'], ['in', 'Inductance'], ['j', 'Rotor inertia'], ['m', 'Mass']]);
      const p1 = kit.plot(g1, { x: { label: 'body length (mm)', min: 20, max: 160 }, y: { label: 'holding torque (N·m)', log: true, min: 0.01, max: 20 }, legend: true }, 190);
      const pick = () => {
        const f = FRAMES[V.fr] || FRAMES[4], u = V.len / 100, pos = u * (f.lens.length - 1), i0 = Math.min(f.lens.length - 2, Math.floor(pos)), w = pos - i0;
        const len = f.lens[i0][0] + w * (f.lens[i0 + 1][0] - f.lens[i0][0]), T = f.lens[i0][1] + w * (f.lens[i0 + 1][1] - f.lens[i0][1]);
        return { f, len, T, J: f.J[0] + u * (f.J[1] - f.J[0]) };
      };
      function drawPlot() {
        const s = pick();
        p1.set({ series: FRAMES.map(f => ({ pts: f.lens.map(p => [p[0], p[1]]), label: 'NEMA ' + f.n, dots: 3 })), marks: [{ x: s.len, y: s.T, label: 'NEMA ' + s.f.n }] });
      }
      drawPlot();
      const loop = kit.loop(() => {
        const s = pick(), f = s.f;
        ro.set('fl', f.flange + ' mm · Ø ' + f.pilot + ' mm · Ø ' + f.shaft + ' mm');
        ro.set('ho', '4 × ' + f.hole + ', ' + f.holes + ' mm apart');
        ro.set('le', s.len.toFixed(0) + ' mm');
        ro.set('th', s.T.toFixed(s.T < 0.1 ? 3 : 2) + ' N·m (' + (s.T / 0.00706155).toFixed(0) + ' oz·in)');
        ro.set('cu', f.I); ro.set('in', f.L);
        ro.set('j', s.J.toFixed(0) + ' g·cm²'); ro.set('m', f.mass);
        const { c } = frame(st, 720, 300), C = kit.colors(), k = 2.15, cx = 125, cy = 150;
        const face = (ff, strong) => {
          const a = ff.flange * k, hs = ff.holes * k / 2;
          c.strokeStyle = strong ? C.text : C.faint; c.lineWidth = strong ? 2 : 1;
          c.fillStyle = strong ? C.surface2 : 'transparent';
          c.beginPath(); c.roundRect ? c.roundRect(cx - a / 2, cy - a / 2, a, a, a * 0.08) : c.rect(cx - a / 2, cy - a / 2, a, a);
          if (strong) c.fill(); c.stroke();
          if (!strong) { c.fillStyle = C.muted; c.fillText(String(ff.n), cx + a / 2 - 8, cy - a / 2 + 12); return; }
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, ff.pilot * k / 2, 0, TAU); c.stroke();
          for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { c.fillStyle = C.bg2; c.strokeStyle = C.text; c.beginPath(); c.arc(cx + sx * hs, cy + sy * hs, Math.max(1.5, ff.hd * k / 2), 0, TAU); c.fill(); c.stroke(); }
          c.fillStyle = C.accent; c.beginPath(); c.arc(cx, cy, ff.shaft * k / 2, 0, TAU); c.fill();
          c.strokeStyle = C.warn; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(cx - hs, cy + hs + 10); c.lineTo(cx + hs, cy + hs + 10); c.stroke(); c.setLineDash([]);
        };
        if (V.all) FRAMES.forEach(ff => { if (ff !== f) face(ff, false); });
        face(f, true);
        c.fillStyle = C.text; c.font = 'bold 13px ' + font(); c.fillText('NEMA ' + f.n + ' face', cx, 20);
        c.font = '12px ' + font(); c.fillStyle = C.muted; c.fillText('flange ' + f.flange + ' mm, holes ' + f.holes + ' mm apart', cx, 290);
        // side view: flange plate, body, shaft, rear cap
        const x0 = 270, a = f.flange * k, L = s.len * k, sh = f.shaft * k, sl = Math.max(18, f.shaft * 4.5 * k * 0.6);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(x0 + sl, cy - a / 2, 6, a); c.strokeRect(x0 + sl, cy - a / 2, 6, a);
        c.fillStyle = C.faint; c.fillRect(x0 + sl + 6, cy - a / 2 + 2, L - 12, a - 4); c.strokeRect(x0 + sl + 6, cy - a / 2 + 2, L - 12, a - 4);
        for (let x = x0 + sl + 14; x < x0 + sl + L - 12; x += 7) { c.strokeStyle = C.muted; c.lineWidth = 0.6; c.beginPath(); c.moveTo(x, cy - a / 2 + 4); c.lineTo(x, cy + a / 2 - 4); c.stroke(); }
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.fillRect(x0 + sl + L - 6, cy - a / 2, 6, a); c.strokeRect(x0 + sl + L - 6, cy - a / 2, 6, a);
        c.fillStyle = C.accent; c.fillRect(x0, cy - sh / 2, sl, sh);
        c.fillStyle = C.muted; c.fillRect(x0 + sl + L, cy + a / 4, 14, 6);
        c.fillStyle = C.text; c.font = 'bold 13px ' + font(); c.fillText('side view, ' + s.len.toFixed(0) + ' mm body', x0 + sl + L / 2, 20);
        // scale bar (50 mm)
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, 272); c.lineTo(x0 + 50 * k, 272); c.moveTo(x0, 266); c.lineTo(x0, 278); c.moveTo(x0 + 50 * k, 266); c.lineTo(x0 + 50 * k, 278); c.stroke();
        c.font = '12px ' + font(); c.fillStyle = C.muted; c.fillText('50 mm', x0 + 25 * k, 292);
        c.textAlign = 'left'; c.fillStyle = C.text;
        c.fillText('≈ ' + s.T.toFixed(s.T < 0.1 ? 3 : 2) + ' N·m holding', Math.min(600, x0 + sl + L + 24), cy - 8);
        c.fillStyle = C.muted; c.fillText('rotor ≈ ' + s.J.toFixed(0) + ' g·cm²', Math.min(600, x0 + sl + L + 24), cy + 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-wiring */
  // an 8-lead NEMA 23 hybrid: per coil 0.9 Ω, 1.2 mH, 2.0 A unipolar; coupling between the two coils of a phase 0.95
  const COIL = { R: 0.9, L: 1.2e-3, Iu: 2.0, k: 0.95, Tb: 1.26, J: 3.0e-5 };
  const WIRINGS = {
    b4: { name: '4 leads — bipolar', leads: ['A+', 'A−', 'B+', 'B−'], seg: [['A+', 'A−', 'A', 2]], to: { 'A+': 'A+', 'A−': 'A−', 'B+': 'B+', 'B−': 'B−' }, conn: 'series' },
    u6: { name: '6 leads — unipolar', leads: ['A+', 'A tap', 'A−', 'B+', 'B tap', 'B−'], seg: [['A+', 'A tap', 'A', 1], ['A tap', 'A−', 'A', 1]], to: { 'A+': 'A', 'A tap': '+V', 'A−': 'A′', 'B+': 'B', 'B tap': '+V', 'B−': 'B′' }, conn: 'unipolar' },
    s6: { name: '6 leads — bipolar series (whole coil)', leads: ['A+', 'A tap', 'A−', 'B+', 'B tap', 'B−'], seg: [['A+', 'A tap', 'A', 1], ['A tap', 'A−', 'A', 1]], to: { 'A+': 'A+', 'A−': 'A−', 'B+': 'B+', 'B−': 'B−' }, conn: 'series' },
    h6: { name: '6 leads — bipolar half coil', leads: ['A+', 'A tap', 'A−', 'B+', 'B tap', 'B−'], seg: [['A+', 'A tap', 'A', 1], ['A tap', 'A−', 'A', 1]], to: { 'A+': 'A+', 'A tap': 'A−', 'B+': 'B+', 'B tap': 'B−' }, conn: 'half' },
    u8: { name: '8 leads — unipolar', leads: ['A1+', 'A1−', 'A2+', 'A2−', 'B1+', 'B1−', 'B2+', 'B2−'], seg: [['A1+', 'A1−', 'A', 1], ['A2+', 'A2−', 'A', 1]], to: { 'A1+': 'A', 'A1−': '+V', 'A2+': '+V', 'A2−': 'A′', 'B1+': 'B', 'B1−': '+V', 'B2+': '+V', 'B2−': 'B′' }, conn: 'unipolar' },
    s8: { name: '8 leads — bipolar series', leads: ['A1+', 'A1−', 'A2+', 'A2−', 'B1+', 'B1−', 'B2+', 'B2−'], seg: [['A1+', 'A1−', 'A', 1], ['A2+', 'A2−', 'A', 1]], to: { 'A1+': 'A+', 'A2−': 'A−', 'B1+': 'B+', 'B2−': 'B−' }, links: [['A1−', 'A2+'], ['B1−', 'B2+']], conn: 'series' },
    p8: { name: '8 leads — bipolar parallel', leads: ['A1+', 'A1−', 'A2+', 'A2−', 'B1+', 'B1−', 'B2+', 'B2−'], seg: [['A1+', 'A1−', 'A', 1], ['A2+', 'A2−', 'A', 1]], to: { 'A1+': 'A+', 'A2+': 'A+', 'A1−': 'A−', 'A2−': 'A−', 'B1+': 'B+', 'B2+': 'B+', 'B1−': 'B−', 'B2−': 'B−' }, conn: 'parallel' }
  };
  // B segments mirror the A ones
  for (const w of Object.values(WIRINGS)) w.seg = w.seg.concat(w.seg.map(([a, b, , r]) => [a.replace('A', 'B'), b.replace('A', 'B'), 'B', r]));
  const CONNS = {
    unipolar: { label: 'unipolar', R: COIL.R, L: COIL.L, I: COIL.Iu, Th: COIL.Tb / Math.SQRT2 },
    half: { label: 'bipolar half coil', R: COIL.R, L: COIL.L, I: COIL.Iu, Th: COIL.Tb / Math.SQRT2 },
    series: { label: 'bipolar series', R: 2 * COIL.R, L: 2 * COIL.L * (1 + COIL.k), I: COIL.Iu / Math.SQRT2, Th: COIL.Tb },
    parallel: { label: 'bipolar parallel', R: COIL.R / 2, L: COIL.L * (1 + COIL.k) / 2, I: COIL.Iu * Math.SQRT2, Th: COIL.Tb }
  };
  const LEADCOL = ['#1d1d1d', 'hsl(130 60% 40%)', 'hsl(0 75% 50%)', 'hsl(215 75% 55%)', 'hsl(50 90% 50%)', '#e8e8e8', 'hsl(28 90% 55%)', 'hsl(25 45% 35%)'];
  Hyper.sim('st-wiring', {
    title: 'Wiring 4-, 6- and 8-lead steppers',
    blurb: `The same kind of motor brought out in three ways, and every way of connecting it to a driver. Coils glow with their current; dots show the current flowing in the leads; links are drawn where leads are joined and caps where they are insulated. The graph compares the pull-out torque of the connections this motor allows, on the supply voltage you choose (lead colours here are only an example — they vary between makers).

**Try this**
- Compare *8 leads — bipolar series* and *parallel*: the same holding torque, but parallel needs twice the current and keeps its torque to about twice the speed.
- Unipolar gives about 71 % of the bipolar holding torque: only half of each winding works at a time.
- Tick *Multimeter* and click two lead ends: the meter reads the coil resistance, twice it across a whole 6-lead coil, or *open* between phases. Find the centre taps.
- With the meter on an 8-lead motor tick *Turn the shaft*: probe the free ends of two coils whose other ends are clipped together. Same phase, aiding: about double. Same phase, opposed: almost zero. Different phases: about 1.4 times.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const [g1] = plotRow(box, 1);
      let V = null, th = 0, flow = 0, probes = [], xf = { s: 1, ox: 0, oy: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'w', type: 'select', label: 'Motor and connection', options: Object.entries(WIRINGS).map(([k, w]) => [w.name, k]), value: 'p8' },
        { id: 'Vs', label: 'Driver supply voltage', min: 12, max: 80, step: 1, value: 48, unit: 'V' },
        { id: 'meter', type: 'check', label: 'Multimeter (motor disconnected): click two leads', value: false },
        { id: 'spin', type: 'check', label: 'Turn the shaft (60 rpm) — meter reads AC volts', value: false },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear probes' }] }
      ], id => { if (id === 'clear' || id === 'w') probes = []; drawPlot(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'Connection'], ['r', 'Phase resistance'], ['l', 'Phase inductance'], ['i', 'Set the driver to'], ['t', 'Holding torque'], ['p', 'Copper loss at standstill'], ['m', 'Meter']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 2000 }, y: { label: 'pull-out torque (N·m)', min: 0 }, legend: true }, 190);
      const W = () => WIRINGS[V.w] || WIRINGS.p8;
      function drawPlot() {
        const w = W(), lead = w.leads.length, sets = lead === 4 ? ['series'] : lead === 6 ? ['unipolar', 'series', 'half'] : ['unipolar', 'series', 'parallel'];
        const series = sets.map(cn => {
          const m = CONNS[cn], pts = [];
          // unipolar: each half-coil sees the whole supply; treat it as a bipolar half coil of the same current
          for (let i = 0; i <= 50; i++) { const n = 2000 * i / 50; pts.push([n, pullOut(m, V.Vs, n).T]); }
          return { pts, label: m.label, dash: cn === w.conn ? null : [5, 4] };
        });
        p1.set({ series });
      }
      drawPlot();
      // lead geometry (design coordinates)
      const leadY = (i, n) => 46 + i * (220 / Math.max(1, n - 1));
      const LX = 300;
      const termY = { 'A+': 70, 'A−': 115, 'B+': 175, 'B−': 220, '+V': 50, 'A': 95, 'A′': 135, 'B': 185, 'B′': 225 };
      kit.click(st, p => {
        if (!V.meter) return;
        const q = { x: (p.x - xf.ox) / xf.s, y: (p.y - xf.oy) / xf.s }, w = W();
        let hit = -1;
        w.leads.forEach((nm, i) => { if (Math.hypot(q.x - LX, q.y - leadY(i, w.leads.length)) < 14) hit = i; });
        if (hit < 0) return;
        probes.push(hit); if (probes.length > 2) probes = [hit];
        loop.once();
      }, p => V.meter);
      // the meter: resistance along a coil chain, or the EMF of two coils joined at their other ends
      const chainPath = (w, a, b) => {
        const seen = new Set([a]), q = [[a, 0, 0]];
        while (q.length) {
          const [n, r, e] = q.shift();
          if (n === b) return { r, e };
          for (const [x, y, , rr] of w.seg) {   // V(x) − V(y) = rr coil EMFs (the phase is the same along a chain)
            if (x === n && !seen.has(y)) { seen.add(y); q.push([y, r + rr * COIL.R, e + rr]); }
            if (y === n && !seen.has(x)) { seen.add(x); q.push([x, r + rr * COIL.R, e - rr]); }
          }
        }
        return null;
      };
      const Ecoil = (COIL.Tb / (Math.SQRT2 * CONNS.series.I)) / 2 * TAU;   // one coil's EMF amplitude at 1 rev/s
      const meterText = () => {
        const w = W();
        if (!V.meter) return '—';
        if (probes.length < 2) return 'click ' + (probes.length ? 'the second' : 'a') + ' lead end';
        const a = w.leads[probes[0]], b = w.leads[probes[1]];
        if (a === b) return 'the same lead';
        const ph = nm => nm[0];
        const path = chainPath(w, a, b);
        if (path) return V.spin ? (Ecoil * Math.abs(path.e) / Math.SQRT2).toFixed(2) + ' V AC (' + a + ' to ' + b + ')' : path.r.toFixed(1) + ' Ω (' + a + ' to ' + b + ')';
        if (!V.spin) return 'open circuit (' + a + ' to ' + b + ')';
        if (w.leads.length !== 8) return 'open circuit — different phases';
        // 8 leads: the other ends of the two coils are clipped together
        const sA = a.endsWith('+') ? 1 : -1, sB = b.endsWith('+') ? 1 : -1, phA = ph(a) === 'A' ? 0 : Math.PI / 2, phB = ph(b) === 'A' ? 0 : Math.PI / 2;
        const re = sA * Math.cos(phA) - sB * Math.cos(phB), im = sA * Math.sin(phA) - sB * Math.sin(phB);
        const amp = Ecoil * Math.hypot(re, im);
        return (amp / Math.SQRT2).toFixed(2) + ' V AC with the other ends clipped — ' + (amp < 0.2 * Ecoil ? 'same phase, opposed' : amp > 1.8 * Ecoil ? 'same phase, aiding' : 'different phases');
      };
      const loop = kit.loop(dt => {
        const w = W(), m = CONNS[w.conn], n = w.leads.length;
        th += dt * 2.2; flow += dt;
        const iA = Math.cos(th), iB = Math.sin(th);
        ro.set('c', m.label);
        ro.set('r', m.R.toFixed(2) + ' Ω'); ro.set('l', (m.L * 1000).toFixed(2) + ' mH');
        ro.set('i', m.I.toFixed(2) + ' A per phase');
        ro.set('t', m.Th.toFixed(2) + ' N·m' + (w.conn === 'unipolar' || w.conn === 'half' ? ' (≈ 71 % of bipolar)' : ''));
        ro.set('p', (2 * m.I * m.I * m.R * (w.conn === 'unipolar' ? 1 : 1)).toFixed(1) + ' W');
        ro.set('m', meterText());
        const f = frame(st, 720, 300), c = f.c, C = kit.colors();
        const sc = Math.min(st.W / 720, st.H / 300); xf = { s: sc, ox: (st.W - 720 * sc) / 2, oy: (st.H - 300 * sc) / 2 };
        // motor body and coils
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.roundRect ? c.roundRect(24, 26, 200, 250, 16) : c.rect(24, 26, 200, 250); c.fill(); c.stroke();
        c.fillStyle = C.muted; c.fillText('motor (' + n + ' leads)', 124, 292);
        const coilOf = nm => nm[0];
        const segCurrent = s => {
          const phI = s[2] === 'A' ? iA : iB;
          if (V.meter) return 0;
          if (w.conn === 'unipolar') { const first = w.seg.filter(x => x[2] === s[2]).indexOf(s) === 0; return first ? Math.max(0, phI) : Math.max(0, -phI); }
          if (w.conn === 'half') return w.seg.filter(x => x[2] === s[2]).indexOf(s) === 0 ? phI : 0;
          return phI;
        };
        // coil positions: each segment drawn as loops at a fixed place, joined to its leads
        const segY = s => { const i1 = w.leads.indexOf(s[0]), i2 = w.leads.indexOf(s[1]); return (leadY(i1, n) + leadY(i2, n)) / 2; };
        for (const s of w.seg) {
          const y = segY(s), I = Math.abs(segCurrent(s)), y1 = leadY(w.leads.indexOf(s[0]), n), y2 = leadY(w.leads.indexOf(s[1]), n);
          c.strokeStyle = I > 0.05 ? 'hsl(28 95% ' + (45 + 15 * I) + '%)' : C.muted; c.lineWidth = 2.2;
          c.beginPath(); for (let j = 0; j <= 40; j++) { const u = j / 40, yy = y1 + (y2 - y1) * u, xx = 90 + 16 * Math.sin(u * TAU * 3.5); j ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke();
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(106, y1); c.lineTo(LX, y1); c.moveTo(106, y2); c.lineTo(LX, y2); c.stroke();
          c.fillStyle = C.text; c.fillText(s[2] === 'A' ? 'A' : 'B', 60, y + 4);
        }
        // lead ends
        w.leads.forEach((nm, i) => {
          const y = leadY(i, n), sel = probes.includes(i);
          c.fillStyle = LEADCOL[i % 8]; c.strokeStyle = sel ? C.warn : C.text; c.lineWidth = sel ? 3 : 1;
          c.beginPath(); c.arc(LX, y, 7, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.text; c.textAlign = 'left'; c.fillText((i + 1) + '  ' + nm, LX - 70, y - 6); c.textAlign = 'center';
        });
        if (!V.meter) {
          // driver terminal block
          const bip = w.conn !== 'unipolar', terms = bip ? ['A+', 'A−', 'B+', 'B−'] : ['+V', 'A', 'A′', 'B', 'B′'];
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(560, 30, 130, 220); c.strokeRect(560, 30, 130, 220);
          c.fillStyle = C.text; c.font = 'bold 12px ' + font(); c.fillText(bip ? 'bipolar driver' : 'unipolar driver', 625, 268); c.font = '12px ' + font();
          terms.forEach(t => { const y = termY[t]; c.fillStyle = C.bg2; c.strokeStyle = C.text; c.lineWidth = 1; c.fillRect(552, y - 7, 16, 14); c.strokeRect(552, y - 7, 16, 14); c.fillStyle = C.text; c.textAlign = 'left'; c.fillText(t, 576, y + 4); c.textAlign = 'center'; });
          const termCurrent = t => t === '+V' ? Math.abs(iA) + Math.abs(iB) : t[0] === 'A' ? (t.includes('′') ? Math.max(0, -iA) : bip ? iA : Math.max(0, iA)) : (t.includes('′') ? Math.max(0, -iB) : bip ? iB : Math.max(0, iB));
          let slot = 0;
          w.leads.forEach((nm, i) => {
            const t = w.to[nm], y = leadY(i, n);
            if (!t) {
              const linked = (w.links || []).some(l => l.includes(nm));
              if (!linked) { c.fillStyle = C.warn; c.fillRect(LX + 10, y - 5, 16, 10); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('insulated', LX + 30, y + 4); c.textAlign = 'center'; }
              return;
            }
            const xm = 360 + 18 * (slot++), yt = termY[t], pts = [[LX + 7, y], [xm, y], [xm, yt], [552, yt]];
            c.strokeStyle = LEADCOL[i % 8]; c.lineWidth = 2.5; c.beginPath(); pts.forEach((p, j) => j ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
            // current dots (the sign sets the direction; a lead into a "−" terminal carries the return)
            let I = termCurrent(t) * (t.includes('−') ? -1 : 1);
            if (w.conn === 'parallel') I /= 2;
            const segL = [], tot = pts.slice(1).reduce((s0, p, j) => { const d = Math.hypot(p[0] - pts[j][0], p[1] - pts[j][1]); segL.push(d); return s0 + d; }, 0);
            const off = ((flow * 60 * I) % 16 + 16) % 16;
            if (Math.abs(I) > 0.03) for (let d = off; d < tot; d += 16) {
              let r = d, j = 0; while (j < segL.length - 1 && r > segL[j]) { r -= segL[j]; j++; }
              const u = segL[j] > 0 ? r / segL[j] : 0, x = pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, yy = pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u;
              c.fillStyle = C.warn; c.beginPath(); c.arc(x, yy, 2.4, 0, TAU); c.fill();
            }
          });
          for (const [a, b] of (w.links || [])) {
            const y1 = leadY(w.leads.indexOf(a), n), y2 = leadY(w.leads.indexOf(b), n);
            c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(LX + 7, y1); c.bezierCurveTo(LX + 34, y1, LX + 34, y2, LX + 7, y2); c.stroke();
            c.fillStyle = C.accent; c.textAlign = 'left'; c.fillText('link', LX + 30, (y1 + y2) / 2 + 4); c.textAlign = 'center';
          }
        } else {
          // the multimeter
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(520, 60, 170, 120); c.strokeRect(520, 60, 170, 120);
          c.fillStyle = C.bg2; c.fillRect(534, 74, 142, 40);
          const txt = meterText(), val = txt.split(' (')[0].split(' with')[0];
          c.fillStyle = C.ok; c.font = 'bold 17px ' + font(); c.fillText(val.length > 16 ? val.slice(0, 16) : val, 605, 100);
          c.font = '12px ' + font(); c.fillStyle = C.muted; c.fillText(V.spin ? 'V AC' : 'Ω', 605, 132);
          c.fillText('red probe: ' + (probes[0] != null ? (probes[0] + 1) : '—') + '   black: ' + (probes[1] != null ? (probes[1] + 1) : '—'), 605, 160);
          probes.forEach((pi, j) => { const y = leadY(pi, n); c.strokeStyle = j ? C.text : C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(LX + 8, y); c.quadraticCurveTo(460, y, 520 + 40 + 90 * j, 180); c.stroke(); });
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-microstep */
  Hyper.sim('st-microstep', {
    title: 'Full, half and microstepping',
    blurb: `Left: the current vector $(i_A, i_B)$ of the two phases — the field points along it — with every position the driver uses in this mode (dots) and the rotor's direction (the green line). Middle: the phase currents step by step. The graph below compares the commanded position with where the rotor really is when there is friction. The motor is a NEMA 23 with 1.26 N·m holding torque.

**Try this**
- Full step: the tip jumps between the corners of a square. Half step, uncompensated: an octagon whose corners are further out than its edges — the torque ripples between 71 % and 100 %. Compensated half step and microstepping: the tip stays on a circle.
- Set 1/16 and a friction of 30 %: only 9.8 % of the holding torque is behind each microstep, so the rotor sticks for a few microsteps and then jumps (static friction is higher than sliding friction) — watch the staircase in the position graph and the counter of pulses that did not move it. At 1/4 every microstep moves it.
- Set the peak current to the rated current: the circle shrinks to 71 % — the drive runs cooler but the torque falls to 71 %.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const Th = 1.26;
      let V = null, k = 0, acc = 0, thR = 0, t = 0, hist = [], stuck = 0, lastPlot = -1;
      const u = () => V.mode === 'full' ? 1 : V.mode === 'half' || V.mode === 'halfc' ? 2 : +V.mode;
      const state = kk => {
        if (V.mode === 'full') return { a: Math.PI / 4 + kk * Math.PI / 2, A: Math.SQRT2 };
        if (V.mode === 'half') return { a: kk * Math.PI / 4, A: (((kk % 2) + 2) % 2) ? Math.SQRT2 : 1 };
        if (V.mode === 'halfc') return { a: kk * Math.PI / 4, A: Math.SQRT2 };
        return { a: kk * Math.PI / 2 / u(), A: V.peak === 'rated' ? 1 : Math.SQRT2 };
      };
      const cmdAngle = () => state(k).a;
      const reset = () => { k = 0; thR = cmdAngle(); hist = []; stuck = 0; t = 0; lastPlot = -1; };
      const pulse = () => {
        const before = thR; k++;
        settle(true);
        if (Math.abs(thR - before) < 1e-4) stuck++;
      };
      // quasi-static rotor with stick–slip friction: it breaks free only when the torque exceeds the static friction,
      // then slides until the torque falls to the (lower) sliding friction, 60 % of the static value
      function settle() {
        const s = state(k), Tm = s.A / Math.SQRT2, Ts = V.fric / 100, d = s.a - thR, T = Tm * Math.sin(d);
        if (Math.abs(T) > Ts) thR = s.a - Math.sign(d) * Math.asin(Math.min(1, 0.6 * Ts / Math.max(1e-9, Tm)));
      }
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Step mode', options: [['Full step (two phases on)', 'full'], ['Half step, uncompensated', 'half'], ['Half step, compensated', 'halfc'], ['1/4 microstep', '4'], ['1/8 microstep', '8'], ['1/16 microstep', '16'], ['1/32 microstep', '32'], ['1/256 microstep', '256']], value: '16' },
        { id: 'peak', type: 'select', label: 'Microstep peak current', options: [['1.41 × rated (same heating as full step)', 'boost'], ['= rated (cooler, 71 % torque)', 'rated']], value: 'boost' },
        { id: 'run', type: 'check', label: 'Run', value: true },
        { id: 'rate', label: 'Speed (slow motion)', min: 0.1, max: 4, step: 0.1, value: 0.6, unit: 'full steps/s' },
        { id: 'fric', label: 'Friction, % of holding torque', min: 0, max: 40, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'one', label: 'One pulse', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => { if (id === 'one') pulse(); if (id === 'reset' || id === 'mode' || id === 'peak') reset(); lastPlot = -1; });
      V = ctl.values;
      reset();
      const ro = kit.readout(box.side, [['spr', 'Steps per revolution'], ['f6', 'Pulse rate for 600 rpm'], ['dT', 'Torque behind one step'], ['rip', 'Torque over a cycle'], ['lag', 'Rotor lag'], ['st', 'Pulses that did not move the rotor']]);
      const p1 = kit.plot(g1, { x: { label: 'pulse number' }, y: { label: 'phase current (× rated)', min: -1.6, max: 1.6 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'pulse number' }, y: { label: 'position (full steps)' }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        if (V.run) { acc += dt * V.rate * (V.mode === 'full' ? 1 : u()); let guard = 0; while (acc >= 1 && guard++ < 200) { acc -= 1; pulse(); } } else acc = 0;
        settle();
        const s = state(k), uu = u(), Tm = s.A / Math.SQRT2;
        hist.push([k, s.A * Math.cos(s.a), s.A * Math.sin(s.a), (s.a - state(0).a) / (Math.PI / 2), (thR - state(0).a) / (Math.PI / 2)]);
        if (hist.length > 400) hist.shift();
        const spr = V.mode === 'full' ? 200 : 200 * uu, dT = V.mode === 'full' ? Th : V.mode === 'half' ? Th * Math.sin(Math.PI / 4) / Math.SQRT2 : Th * Tm * Math.sin(Math.PI / 2 / uu);
        ro.set('spr', String(spr));
        ro.set('f6', (10 * spr / 1000).toFixed(spr >= 1000 ? 0 : 1) + ' kHz');
        ro.set('dT', dT.toFixed(3) + ' N·m (' + (100 * dT / Th).toFixed(1) + ' % of holding)');
        ro.set('rip', V.mode === 'half' ? 'ripples 71–100 %' : (100 * Tm).toFixed(0) + ' %, even');
        const lag = s.a - thR;
        ro.set('lag', (lag / (Math.PI / 2)).toFixed(3) + ' full steps (' + (lag * 180 / Math.PI / 50).toFixed(3) + '°)');
        ro.set('st', String(stuck));
        if (lastPlot < 0 || t - lastPlot > 0.25) {
          lastPlot = t;
          const pa = [], pb = [], pc = [], pr = [], seen = new Map();
          for (const h of hist) seen.set(h[0], h);
          const hs = [...seen.values()].slice(-Math.min(64, 8 * uu + 16));
          hs.forEach((h, i) => { const x1 = i + 1 < hs.length ? hs[i + 1][0] : h[0] + 1; pa.push([h[0], h[1]], [x1, h[1]]); pb.push([h[0], h[2]], [x1, h[2]]); pc.push([h[0], h[3]], [x1, h[3]]); pr.push([h[0], h[4]], [x1, h[4]]); });
          p1.set({ series: [{ pts: pa, label: 'i_A' }, { pts: pb, label: 'i_B' }] });
          p2.set({ series: [{ pts: pc, label: 'commanded' }, { pts: pr, label: 'rotor' }] });
        }
        // drawing
        const { c } = frame(st, 720, 300), C = kit.colors();
        const cx = 150, cy = 150, R = 78;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx - 125, cy); c.lineTo(cx + 125, cy); c.moveTo(cx, cy - 125); c.lineTo(cx, cy + 125); c.stroke();
        c.setLineDash([4, 4]); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, R * Math.SQRT2, 0, TAU); c.stroke(); c.setLineDash([]);
        c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('i_A', cx + 112, cy - 6); c.fillText('i_B', cx + 6, cy + 124);
        c.fillText('1 × rated', cx + R * 0.72, cy - R * 0.72 - 4);
        c.textAlign = 'center';
        const n = V.mode === 'full' ? 4 : V.mode.startsWith('half') ? 8 : Math.min(4 * uu, 256);
        for (let j = 0; j < n; j++) { const sj = state(j * Math.max(1, (4 * uu) / n) | 0); c.fillStyle = C.muted; c.beginPath(); c.arc(cx + R * sj.A * Math.cos(sj.a), cy + R * sj.A * Math.sin(sj.a), n > 64 ? 1.2 : 2.6, 0, TAU); c.fill(); }
        kit.arrow(c, cx, cy, cx + R * s.A * Math.cos(s.a), cy + R * s.A * Math.sin(s.a), 'hsl(28 95% 55%)', 3.5);
        c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 110 * Math.cos(thR), cy + 110 * Math.sin(thR)); c.stroke();
        c.fillStyle = C.text; c.fillText('current vector (orange) and rotor (green)', cx, 18);
        // phase current bars and the incremental-torque bar
        const bx = 330;
        c.textAlign = 'left'; c.fillStyle = C.text; c.fillText('Phase currents now', bx, 40);
        [['A', s.A * Math.cos(s.a)], ['B', s.A * Math.sin(s.a)]].forEach(([nm, v], i) => {
          const y = 56 + i * 28, x0 = bx + 150;
          c.fillStyle = C.faint; c.fillRect(bx + 30, y, 240, 14); c.fillStyle = v >= 0 ? C.accent : C.warn;
          c.fillRect(Math.min(x0, x0 + 80 * v), y, Math.abs(80 * v), 14);
          c.fillStyle = C.text; c.fillText(nm, bx, y + 12); c.fillText(v.toFixed(2), bx + 280, y + 12);
        });
        c.fillText('Torque behind one step vs friction (% of holding)', bx, 150);
        const tb = 100 * dT / Th, fb = V.fric;
        c.fillStyle = C.faint; c.fillRect(bx, 162, 320, 16); c.fillRect(bx, 188, 320, 16);
        c.fillStyle = tb > fb ? C.ok : C.bad; c.fillRect(bx, 162, 3.2 * Math.min(100, tb), 16);
        c.fillStyle = C.muted; c.fillRect(bx, 188, 3.2 * fb, 16);
        c.fillStyle = C.text; c.fillText('one step: ' + tb.toFixed(1) + ' %', bx + 6, 175); c.fillText('friction: ' + fb.toFixed(0) + ' %', bx + 6, 201);
        c.fillStyle = tb > fb ? C.muted : tb > 0.4 * fb ? C.warn : C.bad;
        c.fillText(tb > fb ? 'every step moves the rotor (lagging a little)' : tb > 0.4 * fb ? 'from rest one step cannot move it; once sliding it follows' : 'stick–slip: the rotor sticks for several steps, then jumps', bx, 230);
        c.fillStyle = C.muted; c.fillText('resolution ' + spr + ' steps/rev; accuracy still about ±5 % of a full step', bx, 256);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-torque-speed */
  Hyper.sim('st-torque-speed', {
    title: 'Pull-out and pull-in torque',
    blurb: `A hybrid stepper on a sine-microstepping chopper driver. The upper curve is the **pull-out** torque — what the motor can run at once it has been ramped up to speed; the lower curve is the estimated **pull-in** (start–stop) torque with your load inertia — what it can start against instantly. The dashed line is the load; the dotted one is the load with a 40 % safety margin. The second graph is the mechanical power along the pull-out curve. (The model is an upper bound: real curves sag a little lower at speed and have resonance dips.)

**Try this**
- On the NEMA 23, move the supply from 48 V down to 24 V: the torque now falls at about half the speed; the holding torque does not change.
- On 48 V, set 900 rpm and a load of 50 %, then press *Start instantly*: it stalls — the point is above the pull-in curve. Press *Ramp up*: it gets there and runs. On 24 V the same point is above even the pull-out curve.
- Add load inertia (5 × the rotor): the pull-in curve collapses, the pull-out curve does not.
- Lower the driver current to 50 %: less torque everywhere, but the curve stays flat to a higher speed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1, g2] = plotRow(box, 2);
      let V = null, m = MOTORS.n23, state = 'stopped', nNow = 0, ang = 0, msg = 'press Start or Ramp up', lastPlot = -1, t = 0, corner = 0;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(MOTORS).map(([k, x]) => [x.name, k]), value: 'n23' },
        { id: 'Vs', label: 'Driver supply voltage', min: 12, max: 80, step: 1, value: 48, unit: 'V' },
        { id: 'cur', label: 'Driver current, % of rated (peak 1.41 × rated)', min: 30, max: 100, step: 5, value: 100, unit: '%' },
        { id: 'load', label: 'Load torque, % of holding torque', min: 0, max: 110, step: 1, value: 40, unit: '%' },
        { id: 'jr', label: 'Load inertia, × rotor inertia', min: 0, max: 10, step: 0.5, value: 1 },
        { id: 'n', label: 'Target speed', min: 30, max: 3000, step: 10, value: 900, unit: 'rpm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Start instantly' }, { id: 'ramp', label: 'Ramp up', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => {
        if (id === 'motor') { m = MOTORS[V.motor] || MOTORS.n23; state = 'stopped'; nNow = 0; msg = 'press Start or Ramp up'; }
        if (id === 'go') {
          const TL = V.load / 100 * m.Th, ok = TL <= pullIn(m, V.Vs, V.n, V.cur / 100, V.jr * m.J);
          if (ok) { state = 'running'; nNow = V.n; msg = 'started without a ramp: below the pull-in curve'; } else { state = 'stalled'; nNow = 0; msg = 'could not start: the point is above the pull-in curve'; }
        }
        if (id === 'ramp') { state = 'ramping'; msg = 'accelerating along a ramp'; }
        if (id === 'stop') { state = 'stopped'; nNow = 0; msg = 'stopped'; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['po', 'Pull-out torque at the target'], ['pi', 'Pull-in torque at the target'], ['mg', 'Margin over the load'], ['cn', 'Torque holds to about'], ['sr', 'Pulse rate (full step · 1/16)'], ['pw', 'Mechanical power at the target'], ['st', 'Motor']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 3000 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 3000 }, y: { label: 'mechanical power (W)', min: 0 }, legend: true }, 200);
      const loop = kit.loop(dt => {
        t += dt;
        const k = V.cur / 100, TL = V.load / 100 * m.Th, Jt = m.J * (1 + V.jr);
        if (state === 'ramping') {
          // accelerate with 70 % of the torque left over the load, limited to a sensible 3000 rpm/s
          const spare = pullOut(m, V.Vs, nNow, k).T - TL;
          if (spare <= 0) { state = 'stalled'; msg = 'stalled during the ramp at ' + nNow.toFixed(0) + ' rpm: the load is above the pull-out curve'; nNow = 0; }
          else {
            const acc = Math.min(3000, 0.7 * spare / Jt * 60 / TAU);
            nNow = Math.min(V.n, nNow + acc * dt);
            if (nNow >= V.n) { state = 'running'; msg = 'running: ramped into the slew region'; }
          }
        }
        if (state === 'running') {
          if (Math.abs(nNow - V.n) > 1) { state = 'ramping'; msg = 'changing speed along a ramp'; nNow = Math.min(nNow, V.n); }
          if (TL > pullOut(m, V.Vs, nNow, k).T) { state = 'stalled'; msg = 'stalled: the load exceeds the pull-out torque at ' + nNow.toFixed(0) + ' rpm — position lost'; nNow = 0; }
        }
        ang += nNow / 60 * TAU * dt / 12;
        const po = pullOut(m, V.Vs, V.n, k).T, pin = pullIn(m, V.Vs, V.n, k, V.jr * m.J);
        ro.set('po', po.toFixed(2) + ' N·m (' + (100 * po / m.Th).toFixed(0) + ' % of holding)');
        ro.set('pi', pin.toFixed(2) + ' N·m');
        ro.set('mg', TL > 0 ? (po / TL).toFixed(2) + ' × the load' + (po / TL < 1.3 ? ' — too little' : '') : 'no load');
        ro.set('cn', corner.toFixed(0) + ' rpm at ' + V.Vs.toFixed(0) + ' V');
        ro.set('sr', (V.n / 60 * 200).toFixed(0) + ' Hz · ' + (V.n / 60 * 3200 / 1000).toFixed(1) + ' kHz');
        ro.set('pw', (po * V.n * TAU / 60).toFixed(0) + ' W available, ' + (TL * V.n * TAU / 60).toFixed(0) + ' W to the load');
        ro.set('st', state === 'running' ? 'running at ' + nNow.toFixed(0) + ' rpm' : state === 'ramping' ? 'ramping, ' + nNow.toFixed(0) + ' rpm' : state);
        if (lastPlot < 0 || t - lastPlot > 0.25) {
          lastPlot = t;
          corner = 0; for (let n = 0; n <= 4000; n += 20) { if (pullOut(m, V.Vs, n, k).T >= 0.97 * m.Th * k) corner = n; else break; }
          const P = [], I = [], H = [], PW = [], PH = [];
          for (let i = 0; i <= 90; i++) {
            const n = 3000 * i / 90, a = pullOut(m, V.Vs, n, k).T, b = pullOut(m, V.Vs / 2, n, k).T;
            P.push([n, a]); I.push([n, pullIn(m, V.Vs, n, k, V.jr * m.J)]); H.push([n, b]); PW.push([n, a * n * TAU / 60]); PH.push([n, b * n * TAU / 60]);
          }
          const C = kit.colors();
          p1.set({ y: { label: 'torque (N·m)', min: 0, max: m.Th * 1.15 }, series: [{ pts: P, label: 'pull-out, ' + V.Vs + ' V' }, { pts: I, label: 'pull-in with the load inertia' }, { pts: H, label: 'pull-out, ' + (V.Vs / 2).toFixed(0) + ' V', dash: [3, 3] }, { pts: [[0, TL], [3000, TL]], label: 'load', color: C.muted, dash: [6, 4] }, { pts: [[0, 1.4 * TL], [3000, 1.4 * TL]], label: 'load + 40 %', color: C.faint, dash: [2, 3] }], marks: [{ x: V.n, y: TL, label: 'target' }] });
          p2.set({ series: [{ pts: PW, label: V.Vs + ' V' }, { pts: PH, label: (V.Vs / 2).toFixed(0) + ' V', dash: [3, 3] }], marks: [{ x: V.n, y: po * V.n * TAU / 60 }] });
        }
        // drawing: the motor turning its load disc (slowed 12×), and a status panel
        const { c } = frame(st, 720, 250), C = kit.colors();
        const run = state === 'running' || state === 'ramping';
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(40, 70, 120, 110); c.strokeRect(40, 70, 120, 110);
        c.fillStyle = C.faint; for (let x = 52; x < 150; x += 8) c.fillRect(x, 74, 3, 102);
        c.fillStyle = C.text; c.fillRect(160, 118, 60, 14);
        const rd = 34 + 6 * Math.sqrt(V.jr);
        c.save(); c.translate(250, 125); c.rotate(ang);
        c.fillStyle = C.muted; c.beginPath(); c.arc(0, 0, rd, 0, TAU); c.fill();
        c.strokeStyle = C.bg2; c.lineWidth = 4; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -rd + 4); c.stroke();
        c.restore();
        c.fillStyle = C.muted; c.fillText(m.short + ', load ' + V.load + ' % · inertia ' + V.jr + ' × rotor', 170, 228);
        c.textAlign = 'left'; c.font = '15px ' + font();
        c.fillStyle = state === 'stalled' ? C.bad : run ? C.ok : C.text;
        c.fillText(state === 'stalled' ? 'STALLED' : run ? (state === 'ramping' ? 'RAMPING' : 'RUNNING') + ' ' + nNow.toFixed(0) + ' rpm' : 'STOPPED', 360, 70);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        const words = msg.split(' '); let line = '', y = 96;
        for (const wd of words) { if ((line + wd).length > 48) { c.fillText(line, 360, y); y += 17; line = ''; } line += wd + ' '; }
        c.fillText(line, 360, y);
        const zone = TL <= pin ? 'start–stop region: can start instantly' : TL <= po ? 'slew region: reachable only with a ramp' : 'above the pull-out curve: cannot run here';
        c.fillStyle = TL <= pin ? C.ok : TL <= po ? C.warn : C.bad; c.fillText('target point: ' + zone, 360, 176);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-resonance */
  Hyper.sim('st-resonance', {
    title: 'Ringing, resonance and lost steps',
    blurb: `A NEMA 23 rotor (1.26 N·m, 300 g·cm²) held by its magnetic spring and stepped at the rate you choose — the real dynamics, $J\\ddot\\theta = T_H\\sin N_r(\\theta_c - \\theta) - b\\dot\\theta$, integrated in 20 µs steps. The dial shows the error between the rotor and the command in electrical degrees (360° = one tooth = 7.2°; beyond ±180° the rotor slips and steps are lost). The first graph is that error over the last 60 ms; the second, after *Sweep*, is the largest error against the step rate — the resonance curve.

**Try this**
- Full step at 40 steps/s: each step overshoots and rings out — a damped oscillation at the natural frequency.
- Raise the rate towards the natural frequency (shown in the read-out): the ringing never dies, the error grows and steps can be lost. Press *Sweep* to see the peaks at f_n and near f_n/2.
- Switch to 1/16 microstepping at the same rate: the kicks are tiny and the motion is smooth.
- Raise the damping (a driver's anti-resonance or a viscous damper does this) or add load inertia and sweep again: the peak shrinks or moves down.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const [g1, g2] = plotRow(box, 2);
      const m = MOTORS.n23, Nr = 50, dts = 2e-5;
      let V = null, sim = null, trace = [], sweep = null, lastPlot = -1, t = 0;
      const micro = () => V.mode === 'full' ? 1 : V.mode === 'half' ? 2 : +V.mode;
      const params = () => {
        const J = m.J * (1 + V.jr), k = Nr * m.Th;
        return { J, b: 2 * V.zeta * Math.sqrt(k * J), Tf: 0.01 * m.Th };
      };
      // one simulation state: rotor angle θ (mechanical), speed w, command index; the command angle in electrical radians
      const newSim = () => ({ th: 0, w: 0, idx: 0, tNext: 0, time: 0, peak: 0 });
      const cmdE = (s, u) => V.mode === 'full' ? Math.PI / 4 + s.idx * Math.PI / 2 : s.idx * Math.PI / 2 / u;
      const ampAt = (s) => V.mode === 'half' ? ((s.idx % 2) ? 1 : 1 / Math.SQRT2) : 1;
      const offset0 = () => V.mode === 'full' ? Math.PI / 4 : 0;
      function advance(s, T, rate, P) {
        const u = micro(), dtStep = 1 / (rate * u), wcm = rate * Math.PI / (2 * Nr);
        for (let tt = 0; tt < T; tt += dts) {
          s.time += dts;
          while (s.time >= s.tNext) { s.idx++; s.tNext += dtStep; }
          const e = cmdE(s, u) - offset0() - Nr * s.th;
          const Tm = m.Th * ampAt(s) * Math.sin(e) - P.b * (s.w - wcm) - P.Tf * Math.tanh(s.w / 0.5);   // damping acts on the swing about the field
          s.w += dts * Tm / P.J; s.th += dts * s.w;
        }
      }
      const err = s => cmdE(s, micro()) - offset0() - Nr * s.th;
      const reset = () => { sim = newSim(); sim.th = 0; trace = []; };
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Step rate (full steps per second)', min: 20, max: 1000, value: 40, log: true, sig: 3, unit: 'steps/s' },
        { id: 'mode', type: 'select', label: 'Step mode', options: [['Full step', 'full'], ['Half step', 'half'], ['1/4 microstep', '4'], ['1/16 microstep', '16']], value: 'full' },
        { id: 'zeta', label: 'Damping ratio', min: 0.01, max: 0.5, value: 0.03, log: true, sig: 2 },
        { id: 'jr', label: 'Load inertia, × rotor', min: 0, max: 5, step: 0.5, value: 0 },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep 20–1000 steps/s', primary: true }, { id: 'reset', label: 'Restart' }] }
      ], id => {
        if (id === 'reset' || id === 'mode' || id === 'jr' || id === 'zeta') reset();
        if (id === 'sweep') doSweep();
        lastPlot = -1;
      });
      V = ctl.values;
      function doSweep() {
        const P = params(), pts = [];
        for (let i = 0; i <= 30; i++) {
          const rate = 20 * Math.pow(50, i / 30), s = newSim();
          advance(s, 0.12, rate, P);
          let pk = 0, slipped = false;
          for (let j = 0; j < 30; j++) { advance(s, 0.01, rate, P); const e = Math.abs(err(s)); pk = Math.max(pk, e); if (e > Math.PI) { slipped = true; break; } }
          pts.push([rate, slipped ? 200 : pk * 180 / Math.PI]);
        }
        sweep = pts;
      }
      reset();
      const fnHz = () => Math.sqrt(Nr * m.Th / params().J) / TAU;
      const ro = kit.readout(box.side, [['fn', 'Natural frequency'], ['sp', 'Step rate · speed'], ['pk', 'Largest error (last 60 ms)'], ['lost', 'Steps lost'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'time (ms)', min: -60, max: 0 }, y: { label: 'error (electrical °)', min: -200, max: 200 } }, 170);
      const p2 = kit.plot(g2, { x: { label: 'full-step rate (steps/s)', log: true, min: 20, max: 1000 }, y: { label: 'largest error (electrical °)', min: 0, max: 210 }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        const P = params();
        // integrate in 0.25 ms slices, keeping a 60 ms trace of the error
        const slices = Math.max(1, Math.round(dt / 2.5e-4));
        for (let i = 0; i < slices; i++) { advance(sim, 2.5e-4, V.rate, P); trace.push([sim.time, err(sim)]); }
        while (trace.length > 240) trace.shift();
        const e = err(sim), base = TAU * Math.round(e / TAU), lost = 4 * Math.round(e / TAU), pk = trace.reduce((a, p) => Math.max(a, Math.abs(p[1] - base)), 0);
        ro.set('fn', fnHz().toFixed(0) + ' Hz = ' + (fnHz() / 200 * 60).toFixed(0) + ' rpm in full step');
        ro.set('sp', V.rate.toFixed(0) + ' steps/s · ' + (V.rate / 200 * 60).toFixed(0) + ' rpm');
        ro.set('pk', (pk * 180 / Math.PI).toFixed(0) + '° electrical = ' + (pk * 180 / Math.PI / Nr).toFixed(2) + '°');
        ro.set('lost', String(Math.max(0, lost)));
        const kick = Math.PI / 2 / micro();   // the jump of the command at each step
        ro.set('st', lost > 0 ? 'slipping — steps lost' : pk > 1.4 * kick ? 'ringing hard (near resonance)' : pk > 0.6 * kick ? 'ringing after each step' : 'smooth');
        if (lastPlot < 0 || t - lastPlot > 0.1) {
          lastPlot = t;
          const t0 = sim.time;
          p1.set({ series: [{ pts: trace.map(p => [(p[0] - t0) * 1000, clamp((p[1] - base) * 180 / Math.PI, -200, 200)]), label: 'error' }], hlines: [{ y: 180, label: 'slip' }, { y: -180 }] });
          const fn = fnHz();
          p2.set({ series: sweep ? [{ pts: sweep, label: 'sweep (200 = steps lost)', dots: 2.5 }] : [], vlines: [{ x: clamp(fn, 20, 1000), label: 'f_n' }, { x: clamp(fn / 2, 20, 1000), label: 'f_n/2' }], marks: [{ x: V.rate, y: clamp(pk * 180 / Math.PI, 0, 205), label: 'now' }] });
        }
        // drawing: the error dial and the rotor pointer, magnified
        const { c } = frame(st, 720, 240), C = kit.colors();
        const cx = 140, cy = 120, R = 90;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        c.fillStyle = 'hsl(0 70% 50% / .15)'; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, R, Math.PI / 2 - 0.02, Math.PI / 2 + 0.02); c.fill();
        for (let a = 0; a < 360; a += 30) { const r = a * Math.PI / 180; c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(cx + (R - 8) * Math.sin(r), cy - (R - 8) * Math.cos(r)); c.lineTo(cx + R * Math.sin(r), cy - R * Math.cos(r)); c.stroke(); }
        kit.arrow(c, cx, cy, cx, cy - R + 12, 'hsl(28 95% 55%)', 3);
        const er = -(e - base);
        kit.arrow(c, cx, cy, cx + (R - 18) * Math.sin(er), cy - (R - 18) * Math.cos(er), C.ok, 3);
        c.fillStyle = C.text; c.fillText('rotor (green) vs field (orange)', cx, 228);
        c.fillStyle = C.muted; c.fillText('electrical degrees: 360° = 7.2°', cx, 16);
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '14px ' + font();
        c.fillText('natural frequency ' + fnHz().toFixed(0) + ' Hz', 290, 50);
        c.fillText('stepping at ' + V.rate.toFixed(0) + ' full steps/s (' + (V.rate / fnHz()).toFixed(2) + ' × f_n)', 290, 76);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText(V.mode === 'full' ? 'full step: a 90° electrical kick every step' : V.mode === 'half' ? 'half step: 45° kicks, alternating torque' : '1/' + micro() + ' microstep: kicks of ' + (90 / micro()).toFixed(1) + '° electrical', 290, 102);
        c.fillText('damping ratio ' + V.zeta.toFixed(2) + (V.zeta < 0.06 ? ' (a bare motor: very little)' : V.zeta < 0.2 ? ' (some: friction, a damper)' : ' (strong: driver anti-resonance, viscous damper)'), 290, 124);
        c.fillStyle = lost > 0 ? C.bad : C.ok; c.font = '14px ' + font();
        c.fillText(lost > 0 ? 'lost ' + lost + ' full steps — the machine no longer knows where it is' : 'in step', 290, 160);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-chopper */
  Hyper.sim('st-chopper', {
    title: 'Inside a chopper driver: one phase',
    blurb: `Phase A of a NEMA 23 (0.9 Ω, 1.26 N·m) on a chopper driver with a fixed off-time. The H-bridge switches the whole supply across the winding until the current reaches its target, then lets it decay for the off-time: in **slow decay** the winding is shorted through the two lower transistors; in **fast decay** the bridge reverses and pushes the current back into the supply; **mixed** does a little fast decay, then slow. Lit transistors are on; the dots are the current. The target is a 1/16-microstep sine; the motor's back-EMF grows with speed. Time is slowed down so the switching can be seen.

**Try this**
- At standstill (0 rpm), slow decay: the current sits on its target with a ripple of a few tens of milliamps, and the supply current is a fraction of the phase current.
- Fast decay at standstill: the ripple is more than ten times larger — more loss and noise.
- Set 600 rpm, slow decay, and the *steps* time scale: on the falling half of the sine the current cannot come down fast enough and the wave is distorted. Switch to mixed or fast: it follows.
- Lower the supply to 24 V at 900 rpm: the current no longer reaches its peak — the torque falls because the voltage runs out, not the current setting.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 230 });
      const [g1, g2] = plotRow(box, 2);
      const R = 0.9, Kp = 1.26 / (Math.SQRT2 * 2.8), Nr = 50, dts = 2.5e-7;
      let V = null, i = 0, time = 0, mode = 'on', offT = 0, sgn = 1, trace = [], lastPlot = -1, t = 0, flowPh = 0;
      let accQ = 0, accT = 0, accP = 0, ons = 0, chopF = 0, iMax = 0, winStart = 0, lastState = 'on', stat = { supA: 0, cu: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'Vs', label: 'Supply voltage', min: 12, max: 80, step: 1, value: 48, unit: 'V' },
        { id: 'I', label: 'Set peak current', min: 0.5, max: 5, step: 0.1, value: 3.9, unit: 'A' },
        { id: 'L', label: 'Winding inductance', min: 1, max: 10, step: 0.1, value: 2.5, unit: 'mH' },
        { id: 'decay', type: 'select', label: 'Decay mode', options: [['Slow decay', 'slow'], ['Mixed decay (30 % fast)', 'mixed'], ['Fast decay', 'fast']], value: 'slow' },
        { id: 'n', label: 'Motor speed', min: 0, max: 1500, step: 10, value: 0, unit: 'rpm' },
        { id: 'toff', label: 'Off-time', min: 5, max: 50, step: 1, value: 20, unit: 'µs' },
        { id: 'scale', type: 'select', label: 'Time scale', options: [['Switching (0.4 ms window)', 'sw'], ['Steps (8 ms window)', 'st']], value: 'sw' }
      ], () => { trace = []; lastPlot = -1; iMax = 0; winStart = time; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['i', 'Phase current · target'], ['pk', 'Highest current reached'], ['f', 'Chopping frequency'], ['s', 'Supply current (both phases)'], ['p', 'From the supply · copper loss'], ['st', 'Bridge state']]);
      const p1 = kit.plot(g1, { x: { label: 'time (ms)' }, y: { label: 'phase A current (A)' }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'time (ms)' }, y: { label: 'voltage across the winding (V)' } }, 170);
      const target = tt => {
        const w = V.n * TAU / 60, th = Nr * w * tt, q = Math.floor(th / (Math.PI / 32)) * (Math.PI / 32);   // 1/16 microsteps
        return V.I * Math.cos(q);
      };
      const loop = kit.loop(dt => {
        t += dt;
        const L = V.L * 1e-3, toff = V.toff * 1e-6, Vs = V.Vs, w = V.n * TAU / 60;
        const span = V.scale === 'sw' ? 4e-4 : 8e-3, simT = V.scale === 'sw' ? dt / 1000 * 0.8 : dt / 60;
        const nsub = Math.max(1, Math.round(simT / dts)), every = V.scale === 'sw' ? 1 : Math.max(1, Math.round(nsub / 60));
        let v = 0, state = lastState;
        for (let k = 0; k < nsub; k++) {
          time += dts;
          const ir = target(time), e = Kp * w * Math.cos(Nr * w * time - 0.4);
          const s = ir !== 0 ? Math.sign(ir) : (i >= 0 ? 1 : -1), x = s * i, X = Math.abs(ir);
          if (mode === 'on') { if (x >= X) { mode = 'off'; offT = toff; } }
          else { offT -= dts; if (offT <= 0) { if (x < X) { mode = 'on'; ons++; } else offT = toff; } }
          if (mode === 'on') { v = s * Vs; state = s > 0 ? 'drive+' : 'drive−'; sgn = s; }
          else {
            const fastNow = V.decay === 'fast' || (V.decay === 'mixed' && offT > 0.7 * toff);
            if (fastNow && Math.abs(i) > 1e-3) { v = -Math.sign(i) * Vs; state = 'fast'; } else { v = 0; state = 'slow'; }
          }
          const iNew = i + dts * (v - R * i - e) / L;
          i = (state === 'fast' && Math.sign(iNew) !== Math.sign(i)) ? 0 : iNew;          // diodes stop the current at zero
          const isup = Vs > 0 ? v * i / Vs : 0;
          accQ += isup * dts; accP += i * i * R * dts; accT += dts;
          iMax = Math.max(iMax, Math.abs(i));
          if (k % every === 0) trace.push([time, i, ir, v]);
        }
        lastState = state;
        while (trace.length && trace[0][0] < time - span) trace.shift();
        if (accT > 2e-3) { chopF = ons / accT; stat = { supA: 2 * accQ / accT, cu: 2 * accP / accT }; accQ = accP = accT = 0; ons = 0; }
        if (time - winStart > Math.max(span, V.n > 0 ? 60 / (V.n * 50) : 0.002)) { stat.pk = iMax; iMax = 0; winStart = time; }
        ro.set('i', i.toFixed(2) + ' A · ' + target(time).toFixed(2) + ' A');
        ro.set('pk', (stat.pk || 0).toFixed(2) + ' A of ' + V.I.toFixed(2) + ' A set' + ((stat.pk || 0) < 0.93 * V.I ? ' — the voltage runs out' : ''));
        ro.set('f', (chopF / 1000).toFixed(1) + ' kHz');
        ro.set('s', stat.supA.toFixed(2) + ' A average');
        ro.set('p', (stat.supA * Vs).toFixed(1) + ' W · ' + stat.cu.toFixed(1) + ' W');
        ro.set('st', { 'drive+': 'driving: Q1 and Q4 on', 'drive−': 'driving: Q2 and Q3 on', slow: 'slow decay: Q3 and Q4 on', fast: 'fast decay: current back to the supply' }[state]);
        if (lastPlot < 0 || t - lastPlot > 0.12) {
          lastPlot = t;
          const t0 = time;
          p1.set({ x: { label: 'time (ms)', min: -span * 1000, max: 0 }, series: [{ pts: trace.map(p => [(p[0] - t0) * 1000, p[1]]), label: 'current' }, { pts: trace.map(p => [(p[0] - t0) * 1000, p[2]]), label: 'target', dash: [4, 3] }] });
          p2.set({ x: { label: 'time (ms)', min: -span * 1000, max: 0 }, y: { label: 'voltage across the winding (V)', min: -Vs * 1.1, max: Vs * 1.1 }, series: [{ pts: trace.map(p => [(p[0] - t0) * 1000, p[3]]), label: 'bridge voltage' }] });
        }
        // drawing: the H-bridge
        const { c } = frame(st, 720, 260), C = kit.colors();
        flowPh += dt * 40 * Math.min(4, Math.abs(i));
        const on = { Q1: state === 'drive+' || (state === 'fast' && i < 0), Q4: state === 'drive+' || state === 'slow' || (state === 'fast' && i < 0), Q2: state === 'drive−' || (state === 'fast' && i > 0), Q3: state === 'drive−' || state === 'slow' || (state === 'fast' && i > 0) };
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(80, 40); c.lineTo(360, 40); c.moveTo(120, 40); c.lineTo(120, 225); c.moveTo(320, 40); c.lineTo(320, 225); c.moveTo(120, 225); c.lineTo(320, 225); c.moveTo(220, 225); c.lineTo(220, 250); c.stroke();
        c.fillStyle = C.text; c.textAlign = 'left'; c.fillText('+' + Vs + ' V', 20, 44); c.textAlign = 'center';
        c.fillText('0 V', 250, 256);
        for (const [nm, x, y] of [['Q1', 120, 90], ['Q2', 320, 90], ['Q3', 120, 185], ['Q4', 320, 185]]) {
          c.fillStyle = on[nm] ? C.accent : C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.fillRect(x - 16, y - 18, 32, 36); c.strokeRect(x - 16, y - 18, 32, 36);
          c.fillStyle = on[nm] ? '#fff' : C.muted; c.fillText(nm, x, y + 4);
        }
        c.fillStyle = C.bg2; c.fillRect(150, 128, 140, 24);
        c.strokeStyle = 'hsl(28 95% 55%)'; c.lineWidth = 2.5; c.beginPath();
        for (let j = 0; j <= 60; j++) { const x = 150 + 140 * j / 60, y = 140 - 9 * Math.abs(Math.sin(j / 60 * Math.PI * 5)); j ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        c.fillStyle = C.muted; c.fillText('winding: ' + V.L.toFixed(1) + ' mH, 0.9 Ω', 220, 170);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.fillRect(212, 228, 16, 16); c.strokeRect(212, 228, 16, 16);
        c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('R_s (sense)', 232, 241); c.textAlign = 'center';
        // the current path
        const d = i >= 0 ? 1 : -1;
        let path = null;
        if (state === 'drive+' || state === 'drive−') path = state === 'drive+' ? [[120, 40], [120, 140], [320, 140], [320, 225], [220, 225], [220, 250]] : [[320, 40], [320, 140], [120, 140], [120, 225], [220, 225], [220, 250]];
        else if (state === 'slow') path = d > 0 ? [[120, 140], [320, 140], [320, 225], [120, 225], [120, 140]] : [[320, 140], [120, 140], [120, 225], [320, 225], [320, 140]];
        else path = d > 0 ? [[220, 250], [220, 225], [120, 225], [120, 140], [320, 140], [320, 40]] : [[220, 250], [220, 225], [320, 225], [320, 140], [120, 140], [120, 40]];
        if (Math.abs(i) > 0.02) {
          const segs = []; let tot = 0;
          for (let j = 1; j < path.length; j++) { const l = Math.hypot(path[j][0] - path[j - 1][0], path[j][1] - path[j - 1][1]); segs.push(l); tot += l; }
          for (let s0 = flowPh % 18; s0 < tot; s0 += 18) {
            let r = s0, j = 0; while (j < segs.length - 1 && r > segs[j]) { r -= segs[j]; j++; }
            const u = segs[j] > 0 ? r / segs[j] : 0;
            c.fillStyle = state === 'fast' ? C.bad : C.warn; c.beginPath(); c.arc(path[j][0] + (path[j + 1][0] - path[j][0]) * u, path[j][1] + (path[j + 1][1] - path[j][1]) * u, 3, 0, TAU); c.fill();
          }
        }
        c.textAlign = 'left'; c.font = '14px ' + font(); c.fillStyle = C.text;
        c.fillText({ 'drive+': 'DRIVE: supply across the winding', 'drive−': 'DRIVE (reverse)', slow: 'SLOW DECAY: winding shorted', fast: 'FAST DECAY: current returned to supply' }[state], 390, 50);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText('current ' + i.toFixed(2) + ' A, target ' + target(time).toFixed(2) + ' A', 390, 76);
        c.fillText('back-EMF amplitude ' + (Kp * w).toFixed(1) + ' V at ' + V.n + ' rpm', 390, 98);
        c.fillText('supply ' + stat.supA.toFixed(2) + ' A average for both phases,', 390, 128);
        c.fillText('while each phase carries up to ' + V.I.toFixed(1) + ' A', 390, 146);
        c.fillText(V.scale === 'sw' ? 'time slowed about 1200 ×' : 'time slowed 60 ×', 390, 176);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-dip */
  const DIP_CUR = [1.0, 1.5, 2.0, 2.5, 2.9, 3.3, 3.8, 4.2];
  const DIP_MIC = [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 1000, 2000, 4000, 5000, 8000, 10000, 20000, 25000];
  const DIP_MOT = { n17: Object.assign({ Rth: 5.8 }, MOTORS.n17), n23: Object.assign({ Rth: 3.5 }, MOTORS.n23), n34: Object.assign({ Rth: 2.4 }, MOTORS.n34) };
  Hyper.sim('st-dip', {
    title: 'Set a driver\'s DIP switches',
    blurb: `A typical 2-phase stepper driver (generic — every real driver has its own table, printed on its side). **Click the switches** to flip them: SW1–SW3 set the current, SW4 the current at standstill (OFF = half), SW5–SW8 the steps per revolution. The tables light up the selected rows; the read-outs give the torque, the steady motor temperature and the speed your pulse rate makes.

**Try this**
- With the NEMA 23 (2.8 A rated), find the row whose RMS is just below 2.8 A. Then try 4.2 A peak: the motor runs hotter than its rating.
- Untick *Pulses running*: after half a second the driver drops to half current — the holding torque halves and the heat falls to a quarter. Flip SW4 ON to hold full current.
- Set 25 600 steps/rev and 150 kHz: only 351 rpm. At 51 200 steps/rev the same pulse rate gives half that; above 200 kHz this driver's input gives up.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const sw = [true, false, false, false, true, false, true, false];   // ON = true; default: 3.8 A peak, reduced idle, 4000 steps/rev
      let V = null, idle = 0, ang = 0, xf = { s: 1, ox: 0, oy: 0 }, temp = 25;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(DIP_MOT).map(([k, x]) => [x.name, k]), value: 'n23' },
        { id: 'f', label: 'Pulse rate from the controller', min: 1, max: 250, step: 1, value: 40, unit: 'kHz' },
        { id: 'run', type: 'check', label: 'Pulses running', value: true },
        { type: 'buttons', items: [{ id: 'def', label: 'Factory default (all ON)' }] }
      ], id => { if (id === 'def') sw.fill(true); if (id === 'motor') temp = 25; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['cur', 'Current (peak / RMS)'], ['vs', 'Against the motor rating'], ['id', 'At standstill'], ['spr', 'Steps per revolution'], ['n', 'Speed at this pulse rate'], ['tq', 'Holding torque now'], ['tc', 'Motor case, steady (25 °C air)']]);
      const code = (a, b) => { let v = 0; for (let k = a; k <= b; k++) if (!sw[k]) v += 1 << (k - a); return v; };
      kit.click(st, p => {
        const q = { x: (p.x - xf.ox) / xf.s, y: (p.y - xf.oy) / xf.s };
        for (let k = 0; k < 8; k++) if (Math.abs(q.x - (58 + k * 30)) < 12 && q.y > 70 && q.y < 128) { sw[k] = !sw[k]; loop.once(); }
      }, p => { const q = { x: (p.x - xf.ox) / xf.s, y: (p.y - xf.oy) / xf.s }; return q.x > 44 && q.x < 282 && q.y > 70 && q.y < 128; });
      const loop = kit.loop(dt => {
        const m = DIP_MOT[V.motor] || DIP_MOT.n23;
        const ci = code(0, 2), mi = code(4, 7), Ipk = DIP_CUR[ci], Irms = Ipk / Math.SQRT2, spr = DIP_MIC[mi];
        idle = V.run ? 0 : idle + dt;
        const reduced = !sw[3] && idle > 0.5, I = Ipk * (reduced ? 0.5 : 1);
        const over = V.f > 200, fEff = over ? 0 : V.f * 1000, n = V.run ? fEff / spr * 60 : 0;
        const heat = I * I * m.R, Tss = 25 + heat * m.Rth;
        temp += (Tss - temp) * Math.min(1, dt * 0.8);
        const tq = m.Th * Math.min(1.15, I / (Math.SQRT2 * m.I));
        const po = n > 0 ? pullOut(m, 48, n, Math.min(1.15, Ipk / (Math.SQRT2 * m.I))).T : tq;
        ang += n / 60 * TAU * dt / 10;
        ro.set('cur', Ipk.toFixed(1) + ' A / ' + Irms.toFixed(2) + ' A' + (reduced ? ' (now halved)' : ''));
        ro.set('vs', 'rated ' + m.I.toFixed(1) + ' A: ' + (Irms > 1.08 * m.I ? 'RMS above the rating — runs hot' : Irms < 0.6 * m.I ? 'well below — cool but weak' : Irms <= m.I ? 'RMS at or just below the rating — good' : 'slightly above the rating'));
        ro.set('id', sw[3] ? 'full current (SW4 ON)' : 'half current after 0.5 s (SW4 OFF)');
        ro.set('spr', spr + ' (' + (spr / 200) + ' microsteps per step)');
        ro.set('n', over ? 'input above 200 kHz — pulses lost' : n.toFixed(0) + ' rpm' + (n > 0 && po < 0.3 * m.Th ? ' — little torque left at 48 V' : ''));
        ro.set('tq', tq.toFixed(2) + ' N·m (' + (100 * tq / m.Th).toFixed(0) + ' % of rated holding)');
        ro.set('tc', Tss.toFixed(0) + ' °C' + (Tss > 90 ? ' — too hot: lower the current' : ''));
        // drawing
        const f = frame(st, 760, 340), c = f.c, C = kit.colors();
        const sc = Math.min(st.W / 760, st.H / 340); xf = { s: sc, ox: (st.W - 760 * sc) / 2, oy: (st.H - 340 * sc) / 2 };
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(20, 20, 290, 300); c.strokeRect(20, 20, 290, 300);
        c.fillStyle = C.text; c.font = 'bold 13px ' + font(); c.fillText('2-phase stepper driver (generic)', 165, 42); c.font = '12px ' + font();
        c.fillStyle = 'hsl(0 75% 55%)'; c.fillRect(40, 64, 236, 70);
        for (let k = 0; k < 8; k++) {
          const x = 58 + k * 30;
          c.fillStyle = C.bg2; c.fillRect(x - 9, 74, 18, 48);
          c.fillStyle = '#f2f2f2'; c.fillRect(x - 8, sw[k] ? 76 : 100, 16, 20);
          c.fillStyle = '#fff'; c.fillText(String(k + 1), x, 130);
        }
        c.fillStyle = '#fff'; c.textAlign = 'left'; c.fillText('ON', 42, 72); c.textAlign = 'center';
        c.fillStyle = C.muted; c.fillText('current', 88, 152); c.fillText('idle', 148, 152); c.fillText('microsteps', 223, 152);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(46, 142); c.lineTo(130, 142); c.moveTo(138, 142); c.lineTo(158, 142); c.moveTo(168, 142); c.lineTo(278, 142); c.stroke();
        // terminals and LEDs
        const terms = ['PUL+', 'PUL−', 'DIR+', 'DIR−', 'ENA+', 'ENA−', 'ALM+', 'ALM−', 'A+', 'A−', 'B+', 'B−', '+V', 'GND'];
        terms.forEach((tn, j) => { const x = 36 + (j % 7) * 38, y = 188 + Math.floor(j / 7) * 44; c.fillStyle = C.bg2; c.strokeStyle = C.text; c.fillRect(x - 10, y, 20, 18); c.strokeRect(x - 10, y, 20, 18); c.fillStyle = C.text; c.fillText(tn, x + 1, y + 32); });
        kit.dot(c, 48, 300, 6, C.ok); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('PWR', 60, 304);
        kit.dot(c, 118, 300, 6, Tss > 110 ? C.bad : C.faint); c.fillText('ALM', 130, 304);
        // motor
        c.save(); c.translate(250, 300); c.rotate(ang); c.fillStyle = C.muted; c.fillRect(-14, -14, 28, 28); c.strokeStyle = C.bg2; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(0, -12); c.stroke(); c.restore();
        // tables
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = 'bold 12px ' + font();
        c.fillText('SW1 SW2 SW3   peak   RMS', 340, 36); c.font = '12px ' + font();
        DIP_CUR.forEach((a, r) => {
          const y = 54 + r * 17, hit = r === ci;
          if (hit) { c.fillStyle = 'hsl(28 95% 55% / .3)'; c.fillRect(334, y - 12, 196, 16); }
          c.fillStyle = hit ? C.text : C.muted;
          c.fillText([0, 1, 2].map(b => (r >> b) & 1 ? 'OFF' : 'ON ').join('  ') + '   ' + a.toFixed(1) + ' A  ' + (a / Math.SQRT2).toFixed(2) + ' A', 340, y);
        });
        c.fillStyle = C.text; c.font = 'bold 12px ' + font(); c.fillText('SW5–SW8 → steps/rev', 550, 36); c.font = '12px ' + font();
        DIP_MIC.forEach((s, r) => {
          const col = r < 8 ? 0 : 1, y = 54 + (r % 8) * 17, x = 550 + col * 104, hit = r === mi;
          if (hit) { c.fillStyle = 'hsl(28 95% 55% / .3)'; c.fillRect(x - 6, y - 12, 100, 16); }
          c.fillStyle = hit ? C.text : C.muted;
          c.fillText([0, 1, 2, 3].map(b => (r >> b) & 1 ? '1' : '0').join('') + '  ' + s, x, y);
        });
        c.fillStyle = C.muted; c.fillText('(1 = OFF, 0 = ON, SW5 first)', 550, 200);
        c.fillStyle = C.text; c.fillText('SW4: ' + (sw[3] ? 'ON — full current at standstill' : 'OFF — half current 0.5 s after the last pulse'), 340, 230);
        c.fillStyle = reduced ? C.warn : C.muted; c.fillText(reduced ? 'idle: current halved, holding torque halved, heat ÷ 4' : V.run ? 'pulses running at ' + V.f + ' kHz' : 'pulses stopped — waiting ' + Math.max(0, 0.5 - idle).toFixed(1) + ' s', 340, 252);
        c.fillStyle = Tss > 90 ? C.bad : C.muted; c.fillText('motor case ≈ ' + temp.toFixed(0) + ' °C (steady ' + Tss.toFixed(0) + ' °C)', 340, 274);
        c.fillStyle = C.muted; c.fillText('Follow your driver\'s own table: layouts and values differ between makers.', 340, 300);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-stepdir */
  // a generic opto input: 270 Ω inside, LED 1.2 V, specified for 7–16 mA; pulses ≥ 2.5 µs high and low, ≤ 200 kHz;
  // DIR must be set up ≥ 5 µs before the active (rising) edge. A differential input: ≥ 0.5 µs, ≤ 2 MHz, set-up ≥ 1 µs.
  Hyper.sim('st-stepdir', {
    title: 'Step, direction and enable on the wire',
    blurb: `A controller output drives a stepper driver's opto-isolated inputs (a generic input: 270 Ω inside, specified for 7–16 mA, pulses at least 2.5 µs high and low, up to 200 kHz, DIR set up at least 5 µs before the rising edge). The controller moves an axis 2000 pulses forward and 2000 back, over and over. Left: the input circuit and its LED current. Right: the timing diagram around a reversal — red marks break the driver's timing. The counters compare the pulses sent with the steps the driver really made.

**Try this**
- 24 V signals with no resistor: 84 mA — the LED is overdriven. Add 2 kΩ: about 10 mA, in range.
- 5 V signals with 2 kΩ: under 2 mA — the driver misses every pulse.
- Set the DIR set-up time to 2 µs: the DIR optocoupler switches off more slowly than on, so the first step after each change back to forward goes the wrong way — the error grows by 2 steps with every back-and-forth move. At 0 µs both reversals go wrong and the errors cancel out, which hides the fault.
- Push the pulse rate past 200 kHz, or shorten the pulses below 2.5 µs: pulses are lost. Tick *Differential line driver* and they come through.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      let V = null, sent = 0, done = 0, cmdPos = 0, drvPos = 0, dirF = 1, inMove = 0, acc = 0, skip = 0, reversals = 0;
      const ctl = kit.controls(box.side, [
        { id: 'vs', type: 'select', label: 'Signal voltage', options: [['5 V', 5], ['12 V', 12], ['24 V', 24]], value: 24 },
        { id: 'rx', type: 'select', label: 'External series resistor', options: [['none', 0], ['470 Ω', 470], ['1 kΩ', 1000], ['2 kΩ', 2000], ['2.2 kΩ', 2200], ['4.7 kΩ', 4700]], value: 2000 },
        { id: 'diff', type: 'check', label: 'Differential line driver (RS-422 style)', value: false },
        { id: 'f', label: 'Pulse rate', min: 1, max: 1000, value: 40, log: true, sig: 3, unit: 'kHz' },
        { id: 'w', label: 'Pulse width (high time)', min: 0.3, max: 20, value: 5, log: true, sig: 2, unit: 'µs' },
        { id: 'su', label: 'DIR set-up before the first pulse', min: 0, max: 20, step: 0.5, value: 10, unit: 'µs' },
        { id: 'ena', type: 'check', label: 'ENA opto energised (disables this driver)', value: false },
        { type: 'buttons', items: [{ id: 'zero', label: 'Reset counters', primary: true }] }
      ], id => { if (id === 'zero') { sent = done = cmdPos = drvPos = 0; inMove = 0; dirF = 1; reversals = 0; } });
      V = ctl.values;
      const ro = kit.readout(box.side, [['i', 'LED current'], ['tm', 'Pulse high / low time'], ['ok', 'Pulses accepted'], ['pos', 'Commanded · driver position'], ['err', 'Position error'], ['sp', 'Speed at 1600 steps/rev'], ['st', 'Input state']]);
      const input = () => {
        if (V.diff) return { I: 10, tmin: 0.5, fmax: 2000, su: 1, suOn: 1, ok: true, txt: 'differential input: clean' };
        const I = Math.max(0, (V.vs - 1.2) / (270 + V.rx) * 1000);
        const tmin = I >= 7 ? 2.5 : I >= 4 ? 2.5 * Math.pow(7 / I, 2) : Infinity;
        return { I, tmin, fmax: 200, su: 5, suOn: 1.5, ok: I >= 4 && I <= 25, txt: I > 25 ? 'LED overdriven — it will fail' : I > 16 ? 'above the specified range' : I >= 7 ? 'in range (7–16 mA)' : I >= 4 ? 'weak: the opto switches slowly' : 'too little: pulses not seen' };
      };
      const loop = kit.loop(dt => {
        const inp = input(), per = 1000 / V.f, hi = Math.min(V.w, per * 0.95), lo = per - hi;
        const pulseOk = !V.ena && inp.I >= 4 && inp.I <= 60 && hi >= inp.tmin && lo >= inp.tmin;
        const frac = Math.min(1, inp.fmax / V.f);
        // pulses in this frame (real time, capped), back-and-forth moves of 2000 pulses
        let n = Math.min(20000, Math.round(V.f * 1000 * dt + acc)); acc = V.f * 1000 * dt + acc - n; if (acc < 0) acc = 0;
        while (n-- > 0) {
          if (inMove >= 2000) { inMove = 0; dirF = -dirF; reversals++; }
          const first = inMove === 0 && reversals > 0;
          sent++; cmdPos += dirF; inMove++;
          skip += 1 - frac;
          if (!pulseOk || skip >= 1) { if (skip >= 1) skip -= 1; continue; }
          done++;
          // DIR not yet seen: this step goes the old way. The opto turns off (back to forward) more slowly than it turns on
          drvPos += first && V.su < (dirF > 0 ? inp.su : inp.suOn) ? -dirF : dirF;
        }
        const err = cmdPos - drvPos;
        ro.set('i', inp.I.toFixed(1) + ' mA — ' + inp.txt);
        ro.set('tm', hi.toFixed(2) + ' µs / ' + lo.toFixed(2) + ' µs (needs ≥ ' + (isFinite(inp.tmin) ? inp.tmin.toFixed(1) : '—') + ' µs)');
        ro.set('ok', sent ? (100 * done / sent).toFixed(1) + ' % of ' + sent : '—');
        ro.set('pos', cmdPos + ' · ' + drvPos);
        ro.set('err', err + ' steps' + (err !== 0 ? ' (' + (err / 1600 * 5).toFixed(3) + ' mm on a 5 mm screw)' : ''));
        ro.set('sp', (V.f * 1000 / 1600 * 60).toFixed(0) + ' rpm');
        ro.set('st', V.ena ? 'disabled by ENA: the motor is free' : !pulseOk ? 'pulses rejected' : frac < 1 ? 'above the input\'s maximum rate: pulses lost' : V.su < inp.su ? 'DIR set-up too short: wrong steps at reversals' : 'all good');
        // drawing
        const { c } = frame(st, 760, 320), C = kit.colors();
        // the input circuit
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = 'bold 12px ' + font(); c.fillText(V.diff ? 'Line driver → driver input' : 'Controller output → opto input', 20, 22); c.font = '12px ' + font();
        c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(40, 60); c.lineTo(250, 60); c.lineTo(250, 110); c.moveTo(250, 150); c.lineTo(250, 190); c.lineTo(40, 190); c.stroke();
        c.fillStyle = C.surface2; c.fillRect(20, 50, 44, 150); c.strokeRect(20, 50, 44, 150); c.fillStyle = C.text; c.textAlign = 'center'; c.fillText(V.diff ? 'A/A̅' : V.vs + ' V', 42, 130);
        if (!V.diff && V.rx > 0) { c.fillStyle = C.surface2; c.fillRect(100, 52, 50, 16); c.strokeRect(100, 52, 50, 16); c.fillStyle = C.text; c.fillText(V.rx >= 1000 ? (V.rx / 1000) + ' kΩ' : V.rx + ' Ω', 125, 46); }
        c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.strokeRect(190, 36, 150, 176); c.setLineDash([]);
        c.fillStyle = C.muted; c.fillText('driver', 265, 228);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.fillRect(200, 52, 34, 16); c.strokeRect(200, 52, 34, 16); c.fillStyle = C.muted; c.fillText('270 Ω', 217, 46);
        const lit = !V.ena && inp.I >= 4 ? Math.min(1, inp.I / 12) : 0;
        c.fillStyle = inp.I > 25 ? C.bad : 'hsl(0 90% ' + (30 + 30 * lit) + '% / ' + (0.3 + 0.7 * lit) + ')';
        c.beginPath(); c.moveTo(236, 110); c.lineTo(264, 110); c.lineTo(250, 138); c.closePath(); c.fill(); c.strokeStyle = C.text; c.stroke();
        c.beginPath(); c.moveTo(236, 140); c.lineTo(264, 140); c.stroke();
        if (lit > 0) { kit.arrow(c, 270, 118, 292, 108, 'hsl(0 90% 60%)', 1.5); kit.arrow(c, 270, 130, 292, 120, 'hsl(0 90% 60%)', 1.5); }
        c.fillStyle = C.faint; c.fillRect(296, 104, 30, 30); c.fillStyle = C.muted; c.fillText('photo-', 311, 150); c.fillText('transistor', 311, 164);
        c.fillStyle = C.muted; c.fillText('PUL+', 175, 64); c.fillText('PUL−', 175, 186);
        // LED current gauge
        const gx = 20, gy = 250, gw = 320;
        c.fillStyle = C.faint; c.fillRect(gx, gy, gw, 14);
        c.fillStyle = 'hsl(140 60% 45% / .35)'; c.fillRect(gx + gw * 7 / 30, gy, gw * 9 / 30, 14);
        c.fillStyle = inp.I > 16 || inp.I < 7 ? C.bad : C.ok; c.fillRect(gx, gy + 4, gw * Math.min(1, inp.I / 30), 6);
        c.textAlign = 'left'; c.fillStyle = C.text; c.fillText('LED current ' + inp.I.toFixed(1) + ' mA (green band 7–16 mA; scale 0–30 mA)', gx, gy + 32);
        // the timing diagram around a reversal
        const X0 = 400, X1 = 740, periods = 6, span = periods * per, tx = tt => X0 + (X1 - X0) * tt / span;
        const rows = [['PUL', 70], ['DIR', 130], ['ENA', 190]];
        c.font = 'bold 12px ' + font(); c.fillStyle = C.text; c.fillText('Timing around a reversal (' + span.toFixed(span < 10 ? 1 : 0) + ' µs shown)', X0, 22); c.font = '12px ' + font();
        rows.forEach(([nm, y]) => { c.fillStyle = C.muted; c.fillText(nm, X0 - 34, y + 4); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X0, y + 16); c.lineTo(X1, y + 16); c.stroke(); });
        const tRev = 3 * per;                          // the first pulse of the new direction rises here
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        let y0 = 86; c.moveTo(X0, y0);
        for (let k = 0; k < periods; k++) { const a = tx(k * per + per - hi), b = tx(k * per + per); c.lineTo(a, y0); c.lineTo(a, 56); c.lineTo(b, 56); c.lineTo(b, y0); }
        c.lineTo(X1, y0); c.stroke();
        const tDir = tRev - hi - Math.max(0, V.su);
        const yD1 = 146, yD0 = 116;
        c.strokeStyle = C.warn; c.beginPath(); c.moveTo(X0, yD1); c.lineTo(tx(Math.max(0, tDir)), yD1); c.lineTo(tx(Math.max(0, tDir)), yD0); c.lineTo(X1, yD0); c.stroke();
        c.strokeStyle = V.ena ? C.bad : C.ok; c.beginPath(); c.moveTo(X0, V.ena ? 176 : 206); c.lineTo(X1, V.ena ? 176 : 206); c.stroke();
        // marks: set-up time and pulse width
        const edge = tx(tRev - hi);
        c.strokeStyle = V.su < inp.su ? C.bad : C.muted; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(tx(Math.max(0, tDir)), 100); c.lineTo(tx(Math.max(0, tDir)), 160); c.moveTo(edge, 44); c.lineTo(edge, 160); c.stroke(); c.setLineDash([]);
        c.fillStyle = V.su < inp.su ? C.bad : C.muted; c.textAlign = 'center';
        c.fillText('set-up ' + V.su.toFixed(1) + ' µs' + (V.su < inp.su ? ' < ' + inp.su + ' µs!' : ''), Math.max(X0 + 60, Math.min(X1 - 60, (tx(Math.max(0, tDir)) + edge) / 2)), 108);
        c.fillStyle = hi < inp.tmin ? C.bad : C.muted;
        c.fillText('high ' + hi.toFixed(2) + ' µs' + (hi < inp.tmin ? ' — too short' : ''), (tx(4 * per - hi) + tx(4 * per)) / 2 + 20, 48);
        c.fillStyle = C.muted; c.textAlign = 'left';
        c.fillText('forward pulses', X0 + 4, 240); c.textAlign = 'right'; c.fillText('reverse pulses', X1, 240); c.textAlign = 'left';
        c.fillStyle = err ? C.bad : C.ok; c.font = '14px ' + font();
        c.fillText(err ? 'position error ' + err + ' steps after ' + reversals + ' reversals' : 'driver in step with the controller', X0, 280);
        c.font = '12px ' + font();
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-closed-loop */
  Hyper.sim('st-closed-loop', {
    title: 'Open loop against closed loop',
    blurb: `Two identical NEMA 23 steppers (1.26 N·m) follow the same command against the same friction load. **Left, open loop:** full current all the time, the current vector placed where the command says. **Right, closed loop:** an encoder measures the rotor, and the driver places the current 90° electrical ahead of it and sizes it for the torque needed (a PI position loop with speed feedback), alarming if the error passes 50 full steps (a quarter of a turn). The faint pointer is where the command says the rotor should be. The graphs show the position error and the current of both.

**Try this**
- Load 30 %: both follow. The open-loop motor burns full current and warms up; the closed-loop one uses about a third of it and stays cool.
- Press *Hit the load* (a 20 ms jam of 130 % of holding torque): the open-loop motor slips whole teeth — 4 full steps each — and at speed it stalls; the closed-loop motor is stopped for a moment, then catches up.
- Raise the load to 110 % and the speed: the closed-loop driver cannot make torque the motor does not have — the error grows and it alarms, stopping instead of carrying on in the wrong place.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const m = MOTORS.n23, Nr = 50, J = 2 * m.J, dts = 2e-5, P0 = 2 * m.I * m.I * m.R, b = 2 * 0.1 * Math.sqrt(Nr * m.Th * J);
      const wc0 = TAU * 50, Kp = J * wc0 * wc0, Kd = 2 * 0.7 * J * wc0, Ki = Kp * wc0 / 8, LIMIT = 50 * Math.PI / (2 * Nr);   // error limit: 50 full steps, a quarter of a turn
      let V = null, thc = 0, wc = 0, hit = 0, jamShow = 0, t = 0, lastPlot = -1, hist = [];
      const mk = () => ({ th: 0, w: 0, integ: 0, u: 1, temp: 25, alarm: false, stalled: false });
      let A = mk(), B = mk();
      const reset = () => { thc = 0; wc = 0; A = mk(); B = mk(); hist = []; hit = 0; };
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Commanded speed', min: 0, max: 900, step: 10, value: 300, unit: 'rpm' },
        { id: 'load', label: 'Friction load, % of holding torque', min: 0, max: 130, step: 1, value: 30, unit: '%' },
        { type: 'buttons', items: [{ id: 'hit', label: 'Hit the load', primary: true }, { id: 'reset', label: 'Reset both' }] }
      ], id => { if (id === 'hit') { hit = 0.02; jamShow = 0.6; } if (id === 'reset') reset(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['ea', 'Open loop: error · lost steps'], ['ia', 'Open loop: current · heat'], ['eb', 'Closed loop: error'], ['ib', 'Closed loop: current · heat'], ['tm', 'Motor case (sped up)']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'position error (full steps)' }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'current (% of full)', min: 0, max: 110 }, legend: true }, 170);
      const loop = kit.loop(dt => {
        t += dt;
        const wTarget = V.n * TAU / 60, nNow = Math.abs(wc) * 60 / TAU, Tav = pullOut(m, 48, nNow).T;
        const n = Math.max(1, Math.round(dt / dts));
        let uSum = 0;
        for (let k = 0; k < n; k++) {
          wc += clamp(wTarget - wc, -2000 * TAU / 60 * dts, 2000 * TAU / 60 * dts); thc += wc * dts;
          if (hit > 0) hit -= dts;
          const TL = V.load / 100 * m.Th, Thit = hit > 0 ? 1.3 * m.Th : 0;
          const drag = w => TL * Math.tanh(w / 0.3) + Thit;           // friction opposes the motion; the jam pushes back
          // open loop: full current where the command is
          const Ta = Tav * Math.sin(Nr * (thc - A.th)) - b * (A.w - wc);          // damping of the swing about the field
          let Ra = Ta - drag(A.w);
          if (Math.abs(A.w) < 1e-3 && Math.abs(Ta) <= TL && Thit === 0) { Ra = 0; A.w = 0; }
          A.w += dts * Ra / J; A.th += dts * A.w;
          // closed loop: PI position + speed feedback, current 90° ahead of the rotor, sized by the demand
          if (!B.alarm) {
            const e = thc - B.th;
            B.integ = clamp(B.integ + e * dts, -Tav / Ki, Tav / Ki);
            const Td = clamp(Kp * e + Ki * B.integ + Kd * (wc - B.w), -Tav, Tav);
            B.u = Tav > 0 ? Math.abs(Td) / Tav : 0;
            let Rb = Td - b * (B.w - wc) - drag(B.w);
            if (Math.abs(B.w) < 1e-3 && Math.abs(Td) <= TL && Thit === 0) { Rb = 0; B.w = 0; }
            B.w += dts * Rb / J; B.th += dts * B.w;
            if (Math.abs(e) > LIMIT) B.alarm = true;
          } else {
            B.u = 0;
            const Rb = -drag(B.w) - 1e-4 * B.w;
            B.w = Math.abs(B.w) < 1e-3 && Thit === 0 ? 0 : B.w + dts * Rb / J; B.th += dts * B.w;
          }
          uSum += B.u;
        }
        const uB = uSum / n, PA = P0, PB = P0 * uB * uB;
        A.temp += (25 + PA * 3.5 - A.temp) * Math.min(1, dt / 8); B.temp += (25 + PB * 3.5 - B.temp) * Math.min(1, dt / 8);
        const eA = Nr * (thc - A.th), eB = Nr * (thc - B.th), lostA = Math.max(0, 4 * Math.round(eA / TAU));
        hist.push([t, eA / (Math.PI / 2), eB / (Math.PI / 2), 100, 100 * uB]);
        while (hist.length && hist[0][0] < t - 4) hist.shift();
        ro.set('ea', (eA / (Math.PI / 2)).toFixed(2) + ' full steps · ' + lostA + ' lost');
        ro.set('ia', '100 % · ' + PA.toFixed(1) + ' W');
        ro.set('eb', B.alarm ? 'ALARM — error limit exceeded, driver stopped' : (eB / (Math.PI / 2)).toFixed(2) + ' full steps');
        ro.set('ib', (100 * uB).toFixed(0) + ' % · ' + PB.toFixed(1) + ' W');
        ro.set('tm', 'open ' + A.temp.toFixed(0) + ' °C · closed ' + B.temp.toFixed(0) + ' °C');
        if (lastPlot < 0 || t - lastPlot > 0.15) {
          lastPlot = t;
          p1.set({ series: [{ pts: hist.map(h => [h[0], clamp(h[1], -60, 60)]), label: 'open loop' }, { pts: hist.map(h => [h[0], clamp(h[2], -60, 60)]), label: 'closed loop' }] });
          p2.set({ series: [{ pts: hist.map(h => [h[0], h[3]]), label: 'open loop' }, { pts: hist.map(h => [h[0], h[4]]), label: 'closed loop' }] });
        }
        // drawing: two motors side by side
        const { c } = frame(st, 720, 280), C = kit.colors();
        [[A, 180, 'Open loop', eA], [B, 540, 'Closed loop (encoder)', eB]].forEach(([S, cx, name, e]) => {
          const cy = 120, R = 70, vis = 1 / 12;   // shaft angles drawn 12× slower than they turn
          c.fillStyle = C.text; c.font = 'bold 13px ' + font(); c.fillText(name, cx, 22); c.font = '12px ' + font();
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R + 12, 0, TAU); c.fill(); c.stroke();
          const ac = thc * vis, ar = S.th * vis;
          c.strokeStyle = C.faint; c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.sin(ac), cy - R * Math.cos(ac)); c.stroke();
          c.fillStyle = C.muted; c.beginPath(); c.arc(cx, cy, R - 10, 0, TAU); c.fill();
          c.strokeStyle = S === B && S.alarm ? C.bad : C.accent; c.lineWidth = 4; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + (R - 4) * Math.sin(ar), cy - (R - 4) * Math.cos(ar)); c.stroke();
          if (S === B) { c.strokeStyle = C.warn; c.lineWidth = 1; for (let j = 0; j < 24; j++) { const a = ar * 3 + j * TAU / 24; c.beginPath(); c.moveTo(cx + (R + 4) * Math.cos(a), cy + (R + 4) * Math.sin(a)); c.lineTo(cx + (R + 10) * Math.cos(a), cy + (R + 10) * Math.sin(a)); c.stroke(); } }
          const u = S === A ? 1 : uB, temp = S.temp;
          c.fillStyle = C.faint; c.fillRect(cx - 110, 212, 220, 10); c.fillStyle = C.accent; c.fillRect(cx - 110, 212, 220 * Math.min(1, u), 10);
          c.fillStyle = C.faint; c.fillRect(cx - 110, 238, 220, 10); c.fillStyle = temp > 80 ? C.bad : C.warn; c.fillRect(cx - 110, 238, 220 * clamp((temp - 20) / 80, 0, 1), 10);
          c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('current ' + (100 * u).toFixed(0) + ' %', cx - 110, 208); c.fillText('case ' + temp.toFixed(0) + ' °C', cx - 110, 234); c.textAlign = 'center';
          const lost = S === A ? lostA : 0, bad = S === A ? lost > 0 : S.alarm;
          c.fillStyle = bad ? C.bad : C.ok; c.font = '13px ' + font();
          c.fillText(S === A ? (lost > 0 ? lost + ' steps lost — position unknown' : 'in step') : (S.alarm ? 'ALARM: position error — stopped' : 'following: ' + (e / (Math.PI / 2)).toFixed(2) + ' steps behind'), cx, 272);
          c.font = '12px ' + font();
        });
        c.fillStyle = C.muted; c.fillText('faint pointer: command · shafts drawn 12× slower', 360, 120);
        jamShow -= dt; if (jamShow > 0) { c.fillStyle = C.bad; c.fillText('JAM!', 360, 150); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ st-sizing */
  Hyper.sim('st-sizing', {
    title: 'Size a stepper for a screw axis',
    blurb: `A carriage on a 16 mm × 500 mm ball screw (90 % efficient) with a little guide friction and nut drag (0.05 N·m at the motor). The sim works through the sizing method: speed at the motor, load torque, reflected inertia, acceleration torque — and puts the torque needed at the end of the ramp on the motor's pull-out curve at your supply voltage. The dashed curve is two-thirds of pull-out: points below it have a 1.5× margin.

**Try this**
- The default (20 kg, 10 mm lead, 150 mm/s in 50 ms) on a NEMA 17: the torque nearly fits, but the inertia ratio is 14. Choose the NEMA 23 on 48 V: ratio under 3, margin over 4.
- Ask for 400 mm/s: 2400 rpm at the motor — the stepper's torque has faded. Try a 20 mm lead: half the rpm, but four times the reflected inertia of the carriage.
- Make the axis vertical: gravity adds a steady torque, and the verdict reminds you of the brake.
- Drop the supply from 48 V to 24 V and watch the margin shrink at speed.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const [g1, g2] = plotRow(box, 2);
      let V = null, t = 0, lastKey = '', res = null, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'motor', type: 'select', label: 'Motor', options: Object.entries(MOTORS).map(([k, x]) => [x.name, k]), value: 'n17' },
        { id: 'Vs', type: 'select', label: 'Driver supply', options: [['24 V', 24], ['36 V', 36], ['48 V', 48], ['70 V', 70]], value: 24 },
        { id: 'mass', label: 'Moving mass', min: 1, max: 100, value: 20, log: true, sig: 2, unit: 'kg' },
        { id: 'lead', type: 'select', label: 'Screw lead', options: [['2 mm', 2], ['5 mm', 5], ['10 mm', 10], ['20 mm', 20]], value: 10 },
        { id: 'v', label: 'Top speed of the carriage', min: 10, max: 600, step: 5, value: 150, unit: 'mm/s' },
        { id: 'ta', label: 'Acceleration time', min: 20, max: 500, step: 5, value: 50, unit: 'ms' },
        { id: 'dist', label: 'Move length', min: 20, max: 450, step: 5, value: 200, unit: 'mm' },
        { id: 'orient', type: 'select', label: 'Axis', options: [['Horizontal', 'h'], ['Vertical (lifting)', 'v']], value: 'h' }
      ], () => { lastKey = ''; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Motor speed · pulse rate (1/8)'], ['tl', 'Load torque'], ['j', 'Load inertia · ratio to rotor'], ['ta', 'Acceleration torque'], ['req', 'Needed at the end of the ramp'], ['av', 'Pull-out torque there'], ['sf', 'Margin (safety factor)'], ['mv', 'Move time']]);
      const p1 = kit.plot(g1, { x: { label: 'motor speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const p2 = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'motor torque needed (N·m)' }, legend: true }, 200);
      const compute = () => {
        const m = MOTORS[V.motor] || MOTORS.n17, p = V.lead / 1000, eta = 0.9, g = 9.81, mu = 0.01;
        const F = V.orient === 'v' ? V.mass * g : mu * V.mass * g;
        const TL = F * p / (TAU * eta) + 0.05;
        const Jscrew = Math.PI * 7850 * 0.5 * Math.pow(0.016, 4) / 32, Jcar = V.mass * Math.pow(p / TAU, 2), JL = Jcar + Jscrew + 5e-6;
        const w = (V.v / 1000) / p * TAU, n = w * 60 / TAU, Ta = (m.J + JL) * w / (V.ta / 1000), Treq = TL + Ta;
        const Tpo = pullOut(m, V.Vs, n).T, SF = Treq > 0 ? Tpo / Treq : 99, ratio = JL / m.J;
        const mv = kit.motor.move({ dist: V.dist / 1000, vmax: V.v / 1000, acc: (V.v / 1000) / (V.ta / 1000) });
        return { m, p, F, TL, Jcar, Jscrew, JL, w, n, Ta, Treq, Tpo, SF, ratio, mv, hold: 0.5 * m.Th };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const key = JSON.stringify(V);
        if (key !== lastKey) {
          lastKey = key; res = compute();
          const r = res, nMax = Math.max(1500, r.n * 1.3), P = [], P2 = [];
          for (let i = 0; i <= 80; i++) { const n = nMax * i / 80, T = pullOut(r.m, V.Vs, n).T; P.push([n, T]); P2.push([n, T / 1.5]); }
          const C = kit.colors();
          p1.set({ x: { label: 'motor speed (rpm)', min: 0, max: nMax }, y: { label: 'torque (N·m)', min: 0, max: Math.max(r.m.Th, r.Treq) * 1.15 }, series: [{ pts: P, label: 'pull-out, ' + V.Vs + ' V' }, { pts: P2, label: 'with 1.5× margin', dash: [5, 4] }],
            marks: [{ x: r.n, y: r.Treq, label: 'end of ramp', color: r.SF >= 1.5 ? C.ok : r.SF >= 1.15 ? C.warn : C.bad }, { x: r.n, y: r.TL, label: 'cruise' }] });
          const mv = r.mv, a = r.Ta, T = [];   // the same acceleration whether or not the top speed is reached
          const t1 = mv.tAcc, t2 = t1 + mv.tConst, t3 = mv.tTotal;
          T.push([0, r.TL + a], [t1, r.TL + a], [t1, r.TL], [t2, r.TL], [t2, r.TL - a], [t3, r.TL - a], [t3, V.orient === 'v' ? r.TL - 0.05 : 0]);
          p2.set({ x: { label: 'time (s)', min: 0, max: t3 * 1.1 }, series: [{ pts: T, label: 'torque at the motor' }], hlines: [{ y: r.Tpo, label: 'pull-out at top speed' }, { y: 0 }] });
        }
        const r = res;
        ro.set('n', r.n.toFixed(0) + ' rpm · ' + (r.n / 60 * 1600 / 1000).toFixed(1) + ' kHz');
        ro.set('tl', r.TL.toFixed(3) + ' N·m' + (V.orient === 'v' ? ' (mostly gravity)' : ''));
        ro.set('j', (r.JL * 1e4).toFixed(2) + ' kg·cm² · ' + r.ratio.toFixed(1) + ' : 1');
        ro.set('ta', r.Ta.toFixed(3) + ' N·m');
        ro.set('req', r.Treq.toFixed(3) + ' N·m at ' + r.n.toFixed(0) + ' rpm');
        ro.set('av', r.Tpo.toFixed(3) + ' N·m (' + r.m.short + ', ' + V.Vs + ' V)');
        ro.set('sf', r.SF.toFixed(2) + (r.SF >= 1.5 ? ' — good' : r.SF >= 1.15 ? ' — thin' : ' — too little'));
        ro.set('mv', r.mv.tTotal.toFixed(3) + ' s' + (r.mv.triangle ? ' (triangular: top speed not reached)' : ''));
        // drawing: the axis with the carriage following the move profile, and the verdict
        const { c } = frame(st, 720, 240), C = kit.colors();
        const T = r.mv.tTotal, cyc = 2 * T + 0.6, tc = t % cyc, fwd = tc < T + 0.3, tt = fwd ? Math.min(tc, T) : Math.min(tc - T - 0.3, T);
        const x = r.mv.at(Math.max(0, tt)).x, pos = fwd ? x : V.dist / 1000 - x, vNow = r.mv.at(Math.max(0, tt)).v * (fwd ? 1 : -1);
        ang += vNow / r.p * TAU * dt / 8;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(20, 70, 70, 60); c.strokeRect(20, 70, 70, 60);
        c.fillStyle = C.text; c.fillText(r.m.short, 55, 150);
        c.fillStyle = C.muted; c.fillRect(90, 92, 22, 16);
        const sx0 = 112, sx1 = 440;
        c.fillStyle = C.faint; c.fillRect(sx0, 94, sx1 - sx0, 12);
        c.strokeStyle = C.muted; c.lineWidth = 1.2;
        const pitch = 6 + V.lead * 0.8;
        for (let xx = sx0 + ((ang * pitch / TAU) % pitch + pitch) % pitch; xx < sx1; xx += pitch) { c.beginPath(); c.moveTo(xx, 94); c.lineTo(xx + pitch * 0.5, 106); c.stroke(); }
        const cx = sx0 + 20 + (sx1 - sx0 - 80) * pos / Math.max(0.001, V.dist / 1000) * Math.min(1, V.dist / 450);
        c.fillStyle = C.accent; c.fillRect(cx, 72, 60, 56);
        c.fillStyle = '#fff'; c.fillText(V.mass.toFixed(V.mass < 10 ? 1 : 0) + ' kg', cx + 30, 104);
        if (V.orient === 'v') { kit.arrow(c, cx + 30, 132, cx + 30, 172, C.bad, 2.5); c.fillStyle = C.bad; c.fillText('gravity (axis vertical)', cx + 30, 188); }
        c.fillStyle = C.muted; c.fillText('lead ' + V.lead + ' mm · ' + V.v + ' mm/s · ' + V.dist + ' mm move', 276, 60);
        // verdict
        const probs = [];
        if (r.SF < 1.15) probs.push('not enough torque at top speed'); else if (r.SF < 1.5) probs.push('thin torque margin');
        if (r.ratio > 10) probs.push('inertia ratio ' + r.ratio.toFixed(0) + ' : 1 (keep under 10)');
        if (r.n > 1500) probs.push('above 1500 rpm: consider a servo or a longer lead');
        if (r.n / 60 * 1600 > 200000) probs.push('pulse rate above 200 kHz at 1/8');
        const ok = !probs.length;
        c.textAlign = 'left'; c.font = 'bold 15px ' + font(); c.fillStyle = ok ? C.ok : r.SF < 1.15 ? C.bad : C.warn;
        c.fillText(ok ? 'SUITABLE' : r.SF < 1.15 ? 'TOO SMALL' : 'CHECK', 480, 60);
        c.font = '12px ' + font(); c.fillStyle = C.text;
        (ok ? ['margin ' + r.SF.toFixed(1) + '×, inertia ratio ' + r.ratio.toFixed(1) + ' : 1', 'speed ' + r.n.toFixed(0) + ' rpm at the motor'] : probs).forEach((s, i) => c.fillText('• ' + s, 480, 84 + 18 * i));
        if (V.orient === 'v') { c.fillStyle = r.hold > 1.2 * (r.TL - 0.05) ? C.muted : C.bad; c.fillText('at rest, idle-reduced holding ' + r.hold.toFixed(2) + ' N·m vs gravity ' + (r.TL - 0.05).toFixed(2) + ' N·m', 480, 170); c.fillStyle = C.bad; c.fillText('power-off: the load falls — fit a brake', 480, 188); }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
