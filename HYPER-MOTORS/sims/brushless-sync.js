/* HYPER-MOTORS · sims/brushless-sync.js — brushless and synchronous motors.
 *   bl-bldc-lab     a BLDC motor on the bench: six-step bridge, stator field stepping 60°, torque–speed line, waveforms
 *   bl-hall         Hall sensors and the commutation table: codes, switches, wiring faults and what the rotor does
 *   bl-sensorless   sensorless start-up: align, open-loop ramp, switch-over; the floating phase crossing the neutral
 *   bl-foc          field-oriented control: phase currents, the α–β vector, the d–q frame, angle errors, six-step
 *   bl-runner       inrunner and outrunner on a propeller: battery, Kv, current, thrust, heating
 *   bl-esc          an ESC on the bench: throttle pulse, MOSFET conduction and switching losses, BEC, cooling
 *   bl-pancake      radial against axial flux in the same can: torque, inertia, axial pull
 *   bl-sync         a wound-field synchronous motor: load angle, V-curves, phasors, hunting and pole slip
 *   bl-pmsm         PMSM current and voltage limits in the id–iq plane; SPM against IPM; field weakening
 *   bl-reluctance   a 6/4 switched reluctance motor: inductance, current pulses, torque; a synchronous reluctance rotor
 *   bl-hysteresis   a hysteresis motor: the ring's lagging magnetisation, the B–H loop, flat torque to synchronism
 *   bl-line-start   a line-start PM motor run up on the mains: cage, magnet braking, pulsating torque, pull-in
 * Models are written here (kit.motor has no BLDC, synchronous or reluctance models); DC-side quantities follow
 * V = R I + Ke ω, T = Ke (I − I0) as in kit.motor.dc.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const wrap = a => ((a % TAU) + TAU) % TAU;
  const rpmOf = w => w * 60 / TAU;
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
    const c = st.begin(), s = Math.max(1e-3, Math.min(st.W / W0, st.H / H0));
    c.save(); c.translate((st.W - W0 * s) / 2, (st.H - H0 * s) / 2); c.scale(s, s);
    c.font = '12px ' + font(); c.textAlign = 'center'; c.textBaseline = 'alphabetic';
    return c;
  };
  const PH = ['0 75% 55%', '40 92% 48%', '215 75% 55%'];                    // phase colours A, B, C
  const phc = (k, a) => 'hsl(' + PH[k] + (a != null ? ' / ' + (+a).toFixed(2) : '') + ')';
  const NCOL = 'hsl(0 72% 55%)', SCOL = 'hsl(215 72% 55%)', FIELD = 'hsl(22 90% 55%)';
  const xy = (cx, cy, r, a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)];  // a maths angle (anticlockwise) on the canvas
  const txt = (c, s, x, y, col, align, size) => { c.fillStyle = col; c.textAlign = align || 'center'; if (size) c.font = size + 'px ' + font(); c.fillText(s, x, y); if (size) c.font = '12px ' + font(); };

  /* ---------------------------------------------------------------- six-step commutation
     θ is the electrical angle with the phase-A back-EMF ∝ sin θ. Sector k covers θ = 30° + 60°k … 90° + 60°k;
     in it phase PAIRS[k][0] is switched to + and PAIRS[k][1] to −. Hall A is high in sectors 0–2, B in 2–4, C in 4, 5, 0,
     which gives the codes 101 100 110 010 011 001 of the table on the page. The rotor's north pole points at θ − 180°
     (in a 2-pole drawing whose phase axes are A 0°, B 120°, C 240°), so the current vector leads it by 60–120°. */
  const PAIRS = [[0, 1], [0, 2], [1, 2], [1, 0], [2, 0], [2, 1]];
  const LET = ['A', 'B', 'C'];
  const sectorOf = th => Math.floor(wrap(th - 30 * D2R) / (60 * D2R)) % 6;
  const hallOf = k => [k <= 2 ? 1 : 0, k >= 2 && k <= 4 ? 1 : 0, k >= 4 || k === 0 ? 1 : 0];
  const CODE2SEC = {};
  for (let k = 0; k < 6; k++) CODE2SEC[hallOf(k).join('')] = k;
  // trapezoidal back-EMF shape, flat for 120°: phase x uses trap(θ − 120° x)
  const trap = a => { const x = wrap(a) / D2R; if (x < 30) return x / 30; if (x < 150) return 1; if (x < 210) return (180 - x) / 30; if (x < 330) return -1; return (x - 360) / 30; };
  const pairCurrents = (pair, I) => { const i = [0, 0, 0]; if (pair) { i[pair[0]] = I; i[pair[1]] = -I; } return i; };

  // a 2-pole BLDC motor: 6 teeth (A, C′, B, A′, C, B′), coils lit by their current, the rotor magnet, the stator field
  function drawMotor(c, C, cx, cy, R, thN, cur, o) {
    o = o || {};
    const TP = [0, 2, 1, 0, 2, 1], TS = [1, -1, 1, -1, 1, -1];
    c.save();
    c.lineWidth = R * 0.16; c.strokeStyle = C.border2 || C.faint;
    c.beginPath(); c.arc(cx, cy, R * 0.92, 0, TAU); c.stroke();
    c.lineWidth = 1.5; c.strokeStyle = C.text;
    c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
    for (let k = 0; k < 6; k++) {
      const a = k * Math.PI / 3, p = TP[k], v = TS[k] * (cur[p] || 0);
      c.save(); c.translate(cx, cy); c.rotate(-a);
      c.fillStyle = C.border2 || C.faint; c.fillRect(R * 0.5, -R * 0.1, R * 0.36, R * 0.2);
      c.fillStyle = phc(p, 0.12 + 0.8 * Math.min(1, Math.abs(v)));
      c.fillRect(R * 0.58, -R * 0.2, R * 0.24, R * 0.4);
      c.strokeStyle = phc(p); c.lineWidth = 1.5; c.strokeRect(R * 0.58, -R * 0.2, R * 0.24, R * 0.4);
      c.restore();
      const [lx, ly] = xy(cx, cy, R * 0.7, a);
      txt(c, LET[p] + (TS[k] < 0 ? '′' : ''), lx, ly + 4, C.text, 'center');
      if (Math.abs(v) > 0.05) { const [px, py] = xy(cx, cy, R * 0.47, a); txt(c, v > 0 ? 'N' : 'S', px, py + 4, v > 0 ? NCOL : SCOL, 'center', 11); }
    }
    // rotor: north half red, south half blue
    const r = R * 0.4;
    c.fillStyle = NCOL; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, -thN - Math.PI / 2, -thN + Math.PI / 2); c.closePath(); c.fill();
    c.fillStyle = SCOL; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, -thN + Math.PI / 2, -thN + 3 * Math.PI / 2); c.closePath(); c.fill();
    const [nx, ny] = xy(cx, cy, r * 0.6, thN), [sx, sy] = xy(cx, cy, r * 0.6, thN + Math.PI);
    txt(c, 'N', nx, ny + 4, '#fff', 'center'); txt(c, 'S', sx, sy + 4, '#fff', 'center');
    c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill();
    // the stator current (MMF) vector
    let fx = 0, fy = 0;
    for (let p = 0; p < 3; p++) { fx += (cur[p] || 0) * Math.cos(p * TAU / 3); fy += (cur[p] || 0) * Math.sin(p * TAU / 3); }
    const fm = Math.hypot(fx, fy);
    if (fm > 0.02 && o.field !== false) { const L = R * 0.62 * Math.min(1.2, fm / 1.5), a = Math.atan2(fy, fx), [ex, ey] = xy(cx, cy, L, a); kitArrow(c, cx, cy, ex, ey, FIELD, 3.5); }
    c.restore();
    return fm > 0.02 ? Math.atan2(fy, fx) : null;
  }
  function kitArrow(c, x1, y1, x2, y2, col, wd) {
    const a = Math.atan2(y2 - y1, x2 - x1), len = Math.hypot(x2 - x1, y2 - y1), hl = Math.min(len, 5 + wd * 2.5);
    if (len < 1) return;
    c.save(); c.strokeStyle = c.fillStyle = col; c.lineWidth = wd; c.lineCap = 'round';
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2 - Math.cos(a) * hl * 0.8, y2 - Math.sin(a) * hl * 0.8); c.stroke();
    c.beginPath(); c.moveTo(x2, y2); c.lineTo(x2 - hl * Math.cos(a - 0.42), y2 - hl * Math.sin(a - 0.42)); c.lineTo(x2 - hl * Math.cos(a + 0.42), y2 - hl * Math.sin(a + 0.42)); c.closePath(); c.fill();
    c.restore();
  }

  // a three-phase bridge: rails, three legs, the switches that are on lit in their phase colour
  function drawBridge(c, C, x, y, w, h, pair, chop, rev) {
    c.save();
    c.lineWidth = 1.5; c.strokeStyle = C.text;
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.moveTo(x, y + h); c.lineTo(x + w, y + h); c.stroke();
    txt(c, '+', x - 8, y + 4, C.bad, 'center', 14); txt(c, '−', x - 8, y + h + 4, C.accent, 'center', 14);
    for (let k = 0; k < 3; k++) {
      const lx = x + w * (0.18 + 0.32 * k), hiOn = pair && pair[0] === k, loOn = pair && pair[1] === k;
      c.strokeStyle = C.text; c.beginPath(); c.moveTo(lx, y); c.lineTo(lx, y + h); c.stroke();
      const sw = (yy, on, lbl) => {
        c.fillStyle = on ? phc(k, lbl === 'H' ? 0.35 + 0.6 * chop : 0.95) : C.surface; c.fillRect(lx - 14, yy - 11, 28, 22);
        c.strokeStyle = on ? phc(k) : C.muted; c.lineWidth = on ? 2.5 : 1.2; c.strokeRect(lx - 14, yy - 11, 28, 22);
        txt(c, LET[k] + (lbl === 'H' ? '↑' : '↓'), lx, yy + 4, on ? C.text : C.muted, 'center', 11);
      };
      sw(y + h * 0.27, hiOn, 'H'); sw(y + h * 0.73, loOn, 'L');
      c.fillStyle = C.text; c.beginPath(); c.arc(lx, y + h / 2, 3, 0, TAU); c.fill();
      c.strokeStyle = phc(k); c.lineWidth = 2; c.beginPath(); c.moveTo(lx, y + h / 2); c.lineTo(lx + 16, y + h / 2); c.stroke();
      txt(c, LET[k], lx + 22, y + h / 2 + 4, phc(k), 'center');
    }
    c.restore();
  }

  /* ================================================================ bl-bldc-lab */
  const BL = {
    ind: { name: '24 V industrial, 8 poles, 100 W', V: 24, R: 0.6, Ke: 0.065, I0: 0.3, J: 1.5e-4, pp: 4, Ilim: 15, Tr: 0.32, load: 'const' },
    drone: { name: '4S drone outrunner, 14 poles, 920 rpm/V', V: 14.8, R: 0.1, Ke: 60 / (TAU * 920), I0: 0.5, J: 4e-5, pp: 7, Ilim: 40, Tr: 0.2, load: 'prop', wr: 11000 * TAU / 60 },
    hub: { name: '48 V e-bike hub motor, 46 poles', V: 48, R: 0.25, Ke: 1.146, I0: 1.0, J: 1.0, pp: 23, Ilim: 20, Tr: 15, load: 'const' }
  };
  Hyper.sim('bl-bldc-lab', {
    title: 'A brushless motor on the bench',
    blurb: `A BLDC motor driven in six steps from a DC supply through a three-phase bridge with PWM. Left: the motor drawn with two poles (so electrical and mechanical angles match) — the coils of the two conducting phases light up, the orange arrow is the stator field, and the rotor magnet chases it. Middle: the bridge, with the one high-side and one low-side switch that are on. The graphs show the torque–speed line with the load, and one electrical revolution of the back-EMF and phase currents at the present operating point.

**Try this**
- Raise the load: the speed falls along a straight line and the current rises in proportion to the torque — exactly like a brushed DC motor.
- Lower the PWM duty: the line moves down parallel to itself; the current for a given torque stays the same.
- Choose the drone motor and its propeller: the load grows with the square of speed; halve the duty and the current falls to about a quarter.
- Choose the hub motor and press *Start from rest* at full load: the driver's current limit, not the winding resistance, sets the starting torque (a flat top on the line).
- Read the electrical frequency: 46 poles at 350 rpm switch as fast as 8 poles at 2000 rpm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = plotRow(box, 2);
      let m = BL.ind, V = null, w = 0, thv = 0, t = 0, lastPlot = -1;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Motor', options: Object.entries(BL).map(([k, p]) => [p.name, k]), value: 'ind' },
        { id: 'Vs', label: 'Supply voltage', min: 0, max: 60, step: 0.5, value: 24, unit: 'V' },
        { id: 'duty', label: 'PWM duty', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'load', label: 'Load, % of rated torque (propeller: at rated speed)', min: 0, max: 200, step: 1, value: 100, unit: '%' },
        { id: 'lim', label: 'Driver current limit, % of its maximum', min: 10, max: 100, step: 1, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from rest', primary: true }] }
      ], id => {
        if (id === 'preset') { m = BL[V.preset]; ctl.set('Vs', m.V); w = 0; }
        if (id === 'start') w = 0;
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['fe', 'Electrical frequency · commutations'], ['I', 'Motor current · supply current'], ['T', 'Shaft torque'], ['P', 'Output / input power'], ['eta', 'Efficiency'], ['k', 'Kt · Kv']]);
      const p1 = kit.plot(g1, { x: { label: 'torque (N·m)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'electrical angle (°)', min: 0, max: 720 }, y: { label: 'volts (EMF) · amperes (currents)' }, legend: true }, 190);
      const ilim = () => m.Ilim * V.lim / 100;
      const loadT = ww => { const T0 = V.load / 100 * m.Tr; return m.load === 'prop' ? T0 * Math.pow(Math.max(0, ww) / m.wr, 2) : T0; };
      const current = (Vavg, ww) => clamp((Vavg - m.Ke * ww) / m.R, -ilim(), ilim());
      const loop = kit.loop(dt => {
        t += dt;
        const Vavg = V.Vs * V.duty / 100, sub = 40, h = dt / sub;
        let I = 0;
        for (let k = 0; k < sub; k++) {
          I = current(Vavg, w);
          const Tm = m.Ke * I - (w > 1e-6 ? m.Ke * m.I0 : 0);
          w = Math.max(0, w + h * (Tm - loadT(w)) / m.J);   // a load cannot drive the shaft backwards
        }
        const T = Math.max(0, m.Ke * (I - (w > 1e-6 ? m.I0 : 0))), n = rpmOf(w), fe = m.pp * w / TAU;
        const Pout = T * w, Pm = Vavg * I, Isup = V.duty / 100 * I, eta = Pm > 1e-6 && Pout > 0 ? Pout / Pm : 0;
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('fe', fe.toFixed(0) + ' Hz · ' + (6 * fe).toFixed(0) + ' /s');
        ro.set('I', I.toFixed(2) + ' A · ' + Isup.toFixed(2) + ' A' + (Math.abs(I) >= ilim() - 1e-6 ? ' (current limit)' : ''));
        ro.set('T', T.toFixed(3) + ' N·m (rated ' + m.Tr + ')');
        ro.set('P', Pout.toFixed(1) + ' W / ' + Math.max(0, Pm).toFixed(1) + ' W');
        ro.set('eta', (100 * eta).toFixed(1) + ' %');
        ro.set('k', m.Ke.toFixed(4) + ' N·m/A · ' + (60 / (TAU * m.Ke)).toFixed(0) + ' rpm/V');
        if (t - lastPlot > 0.25 || lastPlot < 0) {
          lastPlot = t;
          const w0 = Math.max(1e-3, Vavg / m.Ke), line = [], lt = [];
          for (let i = 0; i <= 80; i++) { const ww = w0 * i / 80, Ii = current(Vavg, ww); line.push([Math.max(0, m.Ke * (Ii - m.I0)), rpmOf(ww)]); }
          for (let i = 0; i <= 40; i++) { const ww = w0 * 1.05 * i / 40; lt.push([loadT(ww), rpmOf(ww)]); }
          const Tmax = Math.max(m.Tr * 1.2, m.Ke * (ilim() - m.I0));
          p1.set({ x: { label: 'torque (N·m)', min: 0, max: Tmax * 1.05 }, series: [{ pts: line, label: 'motor at ' + Vavg.toFixed(1) + ' V average' }, { pts: lt.filter(p => p[0] <= Tmax * 1.05), label: m.load === 'prop' ? 'propeller' : 'load', color: kit.colors().muted, dash: [5, 4] }], marks: [{ x: T, y: n, label: 'running' }] });
          const ea = [], ia = [], ib = [], ic = [];
          for (let d = 0; d <= 720; d += 2) {
            const th = d * D2R, pair = PAIRS[sectorOf(th)], cu = pairCurrents(pair, Math.max(0, I));
            ea.push([d, m.Ke / 2 * w * trap(th)]); ia.push([d, cu[0]]); ib.push([d, cu[1]]); ic.push([d, cu[2]]);
          }
          p2.set({ series: [{ pts: ea, label: 'back-EMF, phase A (V)', color: kit.colors().muted, dash: [4, 3] }, { pts: ia, label: 'i A', color: phc(0) }, { pts: ib, label: 'i B', color: phc(1) }, { pts: ic, label: 'i C', color: phc(2) }] });
        }
        // drawing (the rotor turns slowly enough to follow)
        const we = m.pp * w, slow = Math.max(1, we / (TAU * 0.45));
        thv = wrap(thv + we * dt / slow);
        const sec = sectorOf(thv), pair = I > 1e-3 ? PAIRS[sec] : null;
        const c = frame(st, 660, 260), C = kit.colors();
        const Inorm = m.Ilim > 0 ? clamp(Math.abs(I) / (0.6 * m.Ilim), 0.15, 1) : 0;
        drawMotor(c, C, 130, 128, 108, thv - Math.PI, pairCurrents(pair, Inorm));
        txt(c, slow > 1.01 ? 'drawn ' + slow.toFixed(0) + '× slower, as 2 poles' : 'drawn as 2 poles', 130, 252, C.muted, 'center');
        drawBridge(c, C, 290, 50, 170, 150, pair, V.duty / 100);
        txt(c, 'bridge: ' + (pair ? LET[pair[0]] + '+ ' + LET[pair[1]] + '−, ' + LET[3 - pair[0] - pair[1]] + ' floats' : 'all off'), 375, 228, C.text, 'center');
        txt(c, 'PWM ' + V.duty.toFixed(0) + ' % of ' + V.Vs.toFixed(1) + ' V', 375, 30, C.muted, 'center');
        c.textAlign = 'left'; c.fillStyle = C.text; c.font = '13px ' + font();
        c.fillText('sector ' + sec + ' · Hall ' + hallOf(sec).join(''), 500, 70);
        c.fillText(n.toFixed(0) + ' rpm', 500, 96);
        c.fillText((m.pp * 2) + ' poles → ' + fe.toFixed(0) + ' Hz', 500, 122);
        c.font = '12px ' + font(); c.fillStyle = C.muted;
        c.fillText('the field steps 60° at a time;', 500, 150); c.fillText('the rotor pole stays 60–120°', 500, 166); c.fillText('behind it', 500, 182);
        const fr = Math.min(1, Math.abs(I) / Math.max(1e-6, m.Ilim));
        c.fillStyle = C.faint; c.fillRect(500, 200, 140, 10); c.fillStyle = fr > 0.7 ? C.bad : C.accent; c.fillRect(500, 200, 140 * fr, 10);
        c.fillStyle = C.muted; c.fillText('current ' + I.toFixed(1) + ' A of ' + m.Ilim + ' A', 500, 226);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-hall */
  Hyper.sim('bl-hall', {
    title: 'Hall sensors and the commutation table',
    blurb: `The 24 V, 8-pole motor of the previous page, run slowly on a current-limited Hall-sensored driver and shown in slow motion. The three Hall sensors (small squares in the bore) read the rotor's poles; their three signals scroll on the strip chart; the code picks a row of the table, and that row turns on one high-side and one low-side switch. The graph below is the shaft torque: flat tops with dips at each step.

**Try this**
- Watch one electrical revolution: the codes run 101, 100, 110, 010, 011, 001 and the stator field (orange) steps 60° each time, always ahead of the rotor.
- Set *Direction* to reverse: the same codes now turn on the opposite switches and the rotor turns the other way.
- *Swap Hall A and B* (or *motor leads B and C*): several rows now point the field the wrong way — the motor lurches, shudders or crawls backwards, then stalls at full current.
- *Hall C dead*: code 000 appears, the driver switches off in that sector and the motor stops there: a Hall fault.
- *Sensors 30° late*: unloaded it still runs; load it (0.15 N·m, 8 V) and it is far weaker for the same current, and in reverse it may not start at all.
- Raise the speed (supply voltage) and choose real time: the steps come too fast to see — 24 per revolution.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1] = plotRow(box, 1);
      const m = { Ke: 0.065, R: 0.6, pp: 4, J: 1.5e-4, b: 2e-5 };
      let V = null, thm = 0, w = 0, t = 0, vt = 0, hist = [], tq = [], lastPlot = -1, Tavg = 0, lastInfo = { code: '101', sec: 0, pair: PAIRS[0], I: 0, T: 0, bad: false };
      const ctl = kit.controls(box.side, [
        { id: 'wiring', type: 'select', label: 'Wiring', options: [['Correct', 'ok'], ['Hall A and B swapped', 'swapAB'], ['Hall C dead (stuck low)', 'dead'], ['Sensors 30° late (misaligned)', 'shift'], ['Motor leads B and C swapped', 'phases']], value: 'ok' },
        { id: 'dir', type: 'select', label: 'Direction', options: [['Forward', 1], ['Reverse', -1]], value: 1 },
        { id: 'Vs', label: 'Supply voltage (sets the top speed)', min: 1, max: 24, step: 0.5, value: 4, unit: 'V' },
        { id: 'Ilim', label: 'Current limit', min: 0.5, max: 8, step: 0.1, value: 3, unit: 'A' },
        { id: 'TL', label: 'Load (friction) torque', min: 0, max: 0.4, step: 0.005, value: 0.05, unit: 'N·m' },
        { id: 'slow', type: 'select', label: 'Time', options: [['Slow motion, 1/100', 0.01], ['Slow motion, 1/20', 0.05], ['Real time', 1]], value: 0.01 },
        { type: 'buttons', items: [{ id: 'stop', label: 'Stop the rotor', primary: true }] }
      ], id => { if (id === 'stop') { w = 0; } lastPlot = -1; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['code', 'Hall code read · sector'], ['sw', 'Switches on'], ['I', 'Phase current'], ['T', 'Average torque'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'time (ms)' }, y: { label: 'shaft torque (N·m)' }, legend: false }, 150);
      const step = hs => {
        const the = m.pp * thm;
        const thRead = the - (V.wiring === 'shift' ? 30 * D2R : 0);
        let hall = hallOf(sectorOf(thRead));
        if (V.wiring === 'swapAB') hall = [hall[1], hall[0], hall[2]];
        if (V.wiring === 'dead') hall = [hall[0], hall[1], 0];
        const code = hall.join(''), sec = CODE2SEC[code];
        let pair = sec == null ? null : PAIRS[sec].slice();
        if (pair && +V.dir < 0) pair = [pair[1], pair[0]];
        const map = V.wiring === 'phases' ? [0, 2, 1] : [0, 1, 2];
        const f = [trap(the), trap(the - TAU / 3), trap(the - 2 * TAU / 3)];
        let I = 0, T = 0;
        if (pair) {
          const ph = map[pair[0]], pl = map[pair[1]], epair = m.Ke / 2 * w * (f[ph] - f[pl]);
          I = clamp((V.Vs - epair) / m.R, 0, V.Ilim);
          T = m.Ke / 2 * I * (f[ph] - f[pl]);
        }
        const TL = V.TL, net = T - m.b * w;
        if (Math.abs(w) < 1e-3 && Math.abs(net) <= TL) w = 0;
        else w += hs * (net - TL * Math.sign(Math.abs(w) > 1e-3 ? w : net)) / m.J;
        thm += hs * w;
        lastInfo = { code, sec, pair, I, T, bad: sec == null, cur: pair ? pairCurrents([map[pair[0]], map[pair[1]]], 1) : [0, 0, 0] };
        return T;
      };
      const loop = kit.loop(dt => {
        t += dt;
        const ts = dt * V.slow, we = Math.abs(m.pp * w) + 30;
        const n = Math.min(4000, Math.max(4, Math.ceil(we * ts / 0.03))), hs = ts / n;
        let Tsum = 0;
        for (let k = 0; k < n; k++) { const T = step(hs); Tsum += T; vt += hs; if (k % Math.max(1, Math.floor(n / 6)) === 0) { tq.push([vt * 1000, T]); } }
        while (tq.length > 400) tq.shift();
        const Tm = Tsum / n;
        Tavg += (Tm - Tavg) * Math.min(1, dt * 1.5);
        const th = m.pp * thm, hl = hallOf(sectorOf(th - (V.wiring === 'shift' ? 30 * D2R : 0)));
        hist.push(hl); while (hist.length > 220) hist.shift();
        const L = lastInfo, rp = rpmOf(w);
        ro.set('n', rp.toFixed(0) + ' rpm' + (rp * +V.dir < -1 ? ' (backwards!)' : ''));
        ro.set('code', L.code + ' · ' + (L.bad ? 'invalid → driver off' : 'row ' + (L.sec + 1)));
        ro.set('sw', L.pair ? LET[L.pair[0]] + ' high, ' + LET[L.pair[1]] + ' low' : 'none');
        ro.set('I', L.I.toFixed(2) + ' A (limit ' + V.Ilim.toFixed(1) + ' A)');
        ro.set('T', Tavg.toFixed(3) + ' N·m (ideal ' + (m.Ke * V.Ilim).toFixed(3) + ' at the limit)');
        ro.set('st', Math.abs(rp) < 2 && L.I > 0.9 * V.Ilim ? 'stalled at full current — check the wiring' : rp < -2 && +V.dir > 0 ? 'running backwards' : L.bad ? 'Hall fault in this sector' : 'running');
        if (t - lastPlot > 0.2 || lastPlot < 0) { lastPlot = t; p1.set({ series: [{ pts: tq.slice(), label: 'torque' }] }); }
        // drawing
        const c = frame(st, 660, 270), C = kit.colors();
        const cur = L.cur.map(v => v * clamp(L.I / Math.max(0.5, V.Ilim), 0.2, 1));
        drawMotor(c, C, 118, 130, 104, th - Math.PI, cur);
        const sh = V.wiring === 'shift' ? 30 * D2R : 0;
        [-60, 60, 180].forEach((a, k) => {
          const on = hl[k], [hx, hy] = xy(118, 130, 104 * 0.47, a * D2R + sh);
          c.fillStyle = on ? phc(k) : C.surface; c.strokeStyle = phc(k); c.lineWidth = 1.5;
          c.fillRect(hx - 7, hy - 7, 14, 14); c.strokeRect(hx - 7, hy - 7, 14, 14);
          const [lx, ly] = xy(118, 130, 104 * 0.47 - 16, a * D2R + sh); txt(c, 'H' + LET[k], lx, ly + 4, C.text, 'center', 10);
        });
        txt(c, 'slow motion × ' + (1 / V.slow).toFixed(0) + ', drawn as 2 poles', 118, 262, C.muted, 'center');
        // strip chart of the three Hall signals
        const sx = 250, sw = 200;
        for (let k = 0; k < 3; k++) {
          const y0 = 30 + k * 28;
          txt(c, 'H' + LET[k], sx - 14, y0 + 4, phc(k), 'center');
          c.strokeStyle = phc(k); c.lineWidth = 2; c.beginPath();
          hist.forEach((hh, i) => { const x = sx + sw * i / 220, y = y0 + (hh[k] ? -9 : 9); i ? c.lineTo(x, y) : c.moveTo(x, y); });
          c.stroke();
        }
        txt(c, 'Hall signals (true sensor outputs)', sx + sw / 2, 14, C.muted, 'center');
        // the table
        const tx = 250, ty = 128, rh = 19;
        c.font = '12px ' + font();
        txt(c, 'code', tx + 26, ty, C.muted); txt(c, 'high', tx + 90, ty, C.muted); txt(c, 'low', tx + 140, ty, C.muted); txt(c, 'floats', tx + 188, ty, C.muted);
        for (let k = 0; k < 6; k++) {
          const y = ty + 6 + k * rh, pr = +V.dir < 0 ? [PAIRS[k][1], PAIRS[k][0]] : PAIRS[k];
          if (!L.bad && L.sec === k) { c.fillStyle = C.accent; c.globalAlpha = 0.25; c.fillRect(tx, y, 212, rh - 2); c.globalAlpha = 1; }
          txt(c, hallOf(k).join(' '), tx + 26, y + 13, C.text); txt(c, LET[pr[0]], tx + 90, y + 13, phc(pr[0])); txt(c, LET[pr[1]], tx + 140, y + 13, phc(pr[1])); txt(c, LET[3 - pr[0] - pr[1]], tx + 188, y + 13, C.muted);
        }
        if (L.bad) txt(c, 'code ' + L.code + ' is not in the table: all switches off', tx + 106, ty + 6 + 6 * rh + 12, C.bad);
        drawBridge(c, C, 490, 55, 150, 150, L.pair, 1);
        txt(c, V.wiring === 'phases' ? 'legs B and C go to motor phases C and B' : 'leg A → phase A, B → B, C → C', 565, 232, V.wiring === 'phases' ? C.bad : C.muted, 'center');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-sensorless */
  Hyper.sim('bl-sensorless', {
    title: 'Starting blind: a sensorless drive',
    blurb: `A small 24 V pump or fan motor (8 poles, 0.02 V·s/rad) on a sensorless six-step drive. *Start* runs the usual sequence: **align** (a fixed phase pair pulls the rotor to a known position), **ramp** (the drive steps the field at a rising rate with a fixed current, like a stepper, not knowing where the rotor is), and **switch-over** to closed loop, where commutation follows the back-EMF. The graph compares the commanded speed with the rotor's; the scope (right) shows phase C's terminal voltage in closed loop: flat when switched, sloping through the neutral when floating — that crossing, 30° before the next step, is the position signal.

**Try this**
- Start with the defaults: watch the rotor twitch into line, follow the ramp a little behind the field, and switch over.
- Raise the inertia to 30× (a big fan wheel): the ramp is now too steep, the rotor falls behind, **desyncs**, and the drive retries. Lower the ramp until it starts.
- Raise the friction (a sticky seal) above what the start current gives: it never gets going.
- Lower the switch-over speed to 150 rpm: the back-EMF is too small to read (under 0.5 V) and the switch-over fails.
- Press *Start* several times: the alignment twitch can go backwards — a reason not to use sensorless drives where reverse motion is dangerous.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1] = plotRow(box, 1);
      const m = { Ke: 0.02, R: 0.5, pp: 4, Jr: 5e-6, Vs: 24, Ilim: 10, b: 1e-5, kFan: 0.12 / (942 * 942), Emin: 0.5 };
      let tHold = 0, V = null, thm = 0, w = 0, state = 'idle', tState = 0, thc = 0, wc = 0, retries = 0, D = 0, I = 0, T = 0, t = 0, thv = 0, hist = [], lastPlot = -1, msg = 'press Start', seed = 1;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const ctl = kit.controls(box.side, [
        { id: 'ramp', label: 'Ramp acceleration', min: 200, max: 30000, value: 3000, unit: 'rpm/s', log: true, sig: 2 },
        { id: 'Is', label: 'Start current', min: 0.5, max: 6, step: 0.1, value: 3, unit: 'A' },
        { id: 'Tf', label: 'Friction torque (seal, bearings)', min: 0, max: 0.08, step: 0.001, value: 0.012, unit: 'N·m' },
        { id: 'Jx', label: 'Inertia, × rotor (fan or pump wheel)', min: 1, max: 40, value: 4, log: true, sig: 2 },
        { id: 'nsw', label: 'Switch-over speed', min: 100, max: 3000, step: 10, value: 800, unit: 'rpm' },
        { id: 'thr', label: 'Throttle after switch-over', min: 10, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'slow', type: 'check', label: 'Slow motion (1/10)', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => {
        if (id === 'start') { retries = 0; begin(); hist = []; t = 0; }
        if (id === 'stop') { state = 'idle'; msg = 'stopped'; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'State'], ['nc', 'Commanded speed'], ['n', 'Rotor speed'], ['lag', 'Rotor behind the stepped field'], ['E', 'Back-EMF (line-to-line)'], ['I', 'Current'], ['tmax', 'Fastest ramp possible']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0 }, legend: true }, 160);
      function begin() { state = 'align'; tState = 0; I = 0; D = 0; msg = 'aligning'; thc = 0; wc = 0; w = 0; thm = (rnd() * TAU) / m.pp; }
      const J = () => m.Jr * V.Jx;
      const loadT = ww => Math.sign(ww) * (V.Tf + m.kFan * ww * ww) + m.b * ww;
      const alignAngle = -30 * D2R;   // pair A→B: the current vector points at −30°
      const stepPhys = hs => {
        const phi = m.pp * thm;
        let gamma = null;
        if (state === 'align') { gamma = alignAngle; I = V.Is; }
        else if (state === 'ramp') { const sec = sectorOf(thc + Math.PI); gamma = (-30 + 60 * sec) * D2R; I = V.Is; }
        else if (state === 'closed') {
          const sec = sectorOf(phi + Math.PI); gamma = (-30 + 60 * sec) * D2R;
          D = Math.min(V.thr / 100, D + hs * 0.6);
          I = clamp((D * m.Vs - m.Ke * w) / m.R, 0, m.Ilim);
        } else I = 0;
        T = gamma == null ? 0 : m.Ke * I * Math.sin(gamma - phi);
        const net = T - loadT(w);
        if (Math.abs(w) < 1e-3 && Math.abs(T) <= V.Tf) w = 0; else w += hs * net / J();
        thm += hs * w;
        tState += hs;
        if (state === 'align' && tState > 0.4) { state = 'ramp'; tState = 0; tHold = 0; thc = m.pp * thm - 20 * D2R; wc = 0; msg = 'open-loop ramp'; }
        else if (state === 'ramp') {
          const wcMax = V.nsw * TAU / 60 * m.pp;
          wc = Math.min(wcMax, wc + hs * V.ramp * TAU / 60 * m.pp); thc += hs * wc;
          const lag = thc + Math.PI / 2 - m.pp * thm;   // average field angle minus rotor angle
          if (lag > 220 * D2R || lag < -120 * D2R) fail('desynchronised: the rotor fell behind the ramp');
          else if (wc >= wcMax - 1e-9) {
            tHold += hs;
            if (m.Ke * Math.abs(w) >= m.Emin && m.Ke * wc / m.pp >= m.Emin && lag > 0 && lag < 170 * D2R && tHold > 0.05) { state = 'closed'; tState = 0; D = clamp((m.Ke * w + m.R * V.Is * 0.5) / m.Vs, 0, 1); msg = 'closed loop on the back-EMF'; }
            else if (tHold > 0.5) fail(m.Ke * Math.abs(w) < m.Emin ? 'switch-over failed: back-EMF under ' + m.Emin + ' V' : 'switch-over failed: rotor not following');
          }
        } else if (state === 'fault' && tState > 1) { if (retries < 3) { retries++; begin(); msg = 'retry ' + retries + ': aligning'; } else { state = 'idle'; msg = 'gave up after 3 retries'; } }
      };
      function fail(why) { state = 'fault'; tState = 0; I = 0; msg = why; }
      const loop = kit.loop(dt => {
        const ts = dt * (V.slow ? 0.1 : 1), n = Math.max(10, Math.ceil(ts / 2e-4)), hs = ts / n;
        for (let k = 0; k < n; k++) stepPhys(hs);
        t += ts;
        const nr = rpmOf(w), ncmd = state === 'ramp' ? rpmOf(wc / m.pp) : state === 'closed' ? nr : 0;
        if (state !== 'idle' || hist.length) { hist.push([t, Math.max(0, ncmd), nr]); while (hist.length > 600) hist.shift(); }
        const lag = state === 'ramp' ? (thc + Math.PI / 2 - m.pp * thm) / D2R : null;
        ro.set('st', msg);
        ro.set('nc', state === 'ramp' ? ncmd.toFixed(0) + ' rpm (ramping)' : state === 'closed' ? 'closed loop' : '—');
        ro.set('n', nr.toFixed(0) + ' rpm');
        ro.set('lag', lag == null ? '—' : lag.toFixed(0) + '° electrical' + (lag > 170 ? ' — slipping!' : lag < 60 ? ' (light load)' : ''));
        ro.set('E', (m.Ke * Math.abs(w)).toFixed(2) + ' V' + (m.Ke * Math.abs(w) < m.Emin ? ' (too small to read)' : ''));
        ro.set('I', I.toFixed(2) + ' A');
        const amax = (m.Ke * V.Is * 0.955 - V.Tf) / J();
        ro.set('tmax', amax > 0 ? (amax * 60 / TAU).toFixed(0) + ' rpm/s (upper bound)' : 'none: friction exceeds the start torque');
        if (lastPlot < 0 || t - lastPlot > 0.1 || V.slow && t - lastPlot > 0.02) {
          lastPlot = t;
          p1.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'commanded (ramp)', dash: [5, 4] }, { pts: hist.map(h => [h[0], h[2]]), label: 'rotor' }] });
        }
        // drawing
        const c = frame(st, 660, 250), C = kit.colors();
        const phi = m.pp * thm, we = Math.abs(m.pp * w), slow = Math.max(1, we * (V.slow ? 0.1 : 1) / (TAU * 0.5));
        thv = slow > 1.01 ? wrap(thv + m.pp * w * dt * (V.slow ? 0.1 : 1) / slow) : phi;
        let pair = null;
        if (state === 'align') pair = PAIRS[0];
        else if (state === 'ramp') pair = PAIRS[sectorOf(thc + Math.PI)];
        else if (state === 'closed') pair = PAIRS[sectorOf(thv + Math.PI)];
        drawMotor(c, C, 110, 118, 98, thv, pairCurrents(pair, clamp(I / 4, 0.25, 1)));
        txt(c, slow > 1.01 ? 'drawn ' + slow.toFixed(0) + '× slower, as 2 poles' : 'drawn as 2 poles', 110, 240, C.muted);
        // the sequence
        const steps = [['align', 'ALIGN'], ['ramp', 'RAMP'], ['closed', 'CLOSED LOOP']];
        steps.forEach((s, i) => {
          const x = 240 + i * 92, on = state === s[0];
          c.fillStyle = on ? C.accent : C.surface; c.fillRect(x, 16, 84, 24); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x, 16, 84, 24);
          txt(c, s[1], x + 42, 32, on ? '#fff' : C.muted, 'center', 11);
        });
        txt(c, state === 'fault' ? '✗ ' + msg : msg, 378, 60, state === 'fault' ? C.bad : C.text, 'center');
        // the scope: phase C terminal voltage over one electrical revolution at the present speed
        const sx = 240, sy = 80, sw = 400, sh = 140, Dv = state === 'closed' ? D : 0.5;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(sx, sy, sw, sh);
        const Vtop = m.Vs, yv = v => sy + sh - 8 - (sh - 16) * clamp(v / Vtop, 0, 1);
        const ncut = Dv * m.Vs / 2;
        c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(sx, yv(ncut)); c.lineTo(sx + sw, yv(ncut)); c.stroke(); c.setLineDash([]);
        txt(c, 'neutral', sx + sw - 4, yv(ncut) - 4, C.muted, 'right', 10);
        const vc = th => { const pr = PAIRS[sectorOf(th)]; if (pr[0] === 2) return Dv * m.Vs; if (pr[1] === 2) return 0; return clamp(ncut + m.Ke / 2 * Math.abs(w) * trap(th - 2 * TAU / 3), 0, m.Vs); };
        c.strokeStyle = phc(2); c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 360; i += 2) { const x = sx + sw * i / 360, y = yv(vc(i * D2R)); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        // zero crossings of the floating phase and the commutations 30° later
        [60, 240].forEach(z => {
          const x = sx + sw * z / 360, x2 = sx + sw * (z + 30) / 360;
          c.fillStyle = C.ok; c.beginPath(); c.arc(x, yv(ncut), 4, 0, TAU); c.fill();
          c.strokeStyle = C.bad; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x2, sy + 4); c.lineTo(x2, sy + sh - 4); c.stroke(); c.setLineDash([]);
        });
        txt(c, '● zero crossing   ┊ commutation 30° later', sx + 6, sy + 14, C.muted, 'left', 10);
        if (state === 'closed') { const cx = sx + sw * wrap(thv + Math.PI) / TAU; c.strokeStyle = C.text; c.beginPath(); c.moveTo(cx, sy); c.lineTo(cx, sy + sh); c.stroke(); }
        txt(c, state === 'closed' ? 'phase C terminal: switched high, floating, switched low (one electrical revolution)' : 'the floating-phase signal (readable once the back-EMF exceeds ' + m.Emin + ' V)', sx + sw / 2, sy + sh + 16, C.muted, 'center', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-foc */
  Hyper.sim('bl-foc', {
    title: 'Field-oriented control: the view from the rotor',
    blurb: `A surface-magnet motor (8 poles, ψ = 10.8 mWb, 48 V bus) held at a set speed by a dynamometer while an FOC drive regulates its current. Left: the fixed α–β plane — the three phase axes a, b, c with their currents as coloured bars, the rotor's magnet axis (d, red) turning, and the current vector (orange) turning with it. Right: the same vector seen from the rotor, in the d–q frame — standing still. The graphs show the three phase currents and the torque over two electrical revolutions.

**Try this**
- Set $i_q$ = 10 A, $i_d$ = 0: three clean sine waves in the stator become one steady arrow on the q-axis, and the torque is flat.
- Add an *encoder angle error* of 30°, then 60° and 90°: the drive puts the current in the wrong place — the q part shrinks as the cosine and the torque with it; beyond 90° it pushes backwards.
- Switch to *six-step*: the vector now jumps 60° at a time, the currents become blocks and the torque ripples by about 13 %.
- Raise the speed to 6000 rpm and beyond: the back-EMF uses up the 27.7 V available and the current collapses. Make $i_d$ negative (field weakening): the voltage needed falls and the current returns.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const m = { pp: 4, psi: 0.0108, L: 0.4e-3, R: 0.3, Vdc: 48 };
      const Vmax = m.Vdc / Math.sqrt(3);
      let V = null, th = 0, lastPlot = -1, t = 0, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Drive', options: [['Field-oriented control (sine currents)', 'foc'], ['Six-step (Hall blocks)', 'six']], value: 'foc' },
        { id: 'n', label: 'Speed (held by a dynamometer)', min: 0, max: 9000, step: 50, value: 600, unit: 'rpm' },
        { id: 'iq', label: 'q-axis current command', min: 0, max: 15, step: 0.1, value: 10, unit: 'A' },
        { id: 'id', label: 'd-axis current command', min: -15, max: 0, step: 0.1, value: 0, unit: 'A' },
        { id: 'eps', label: 'Encoder angle error (electrical)', min: -120, max: 120, step: 1, value: 0, unit: '°' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Phase current amplitude'], ['dq', 'Real id · iq'], ['T', 'Torque (mean · ripple)'], ['v', 'Voltage needed · available'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'electrical angle (°)', min: 0, max: 720 }, y: { label: 'phase current (A)' }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'electrical angle (°)', min: 0, max: 720 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 170);
      const volts = (id, iq, we) => Math.hypot(m.R * id - we * m.L * iq, m.R * iq + we * (m.L * id + m.psi));
      // the current actually flowing, in the real d–q frame, at rotor angle θ (and whether the voltage limit bites)
      function state(theta) {
        const we = m.pp * V.n * TAU / 60, eps = V.eps * D2R;
        let I, beta;
        if (V.mode === 'six') {
          const sec = sectorOf(theta + eps + Math.PI), gam = (-30 + 60 * sec) * D2R;   // the block vector the drive picks from its angle estimate
          I = Math.hypot(V.iq, V.id) / 0.955; beta = gam - theta;                          // vector angle relative to the true d-axis
        } else { I = Math.hypot(V.iq, V.id); beta = Math.atan2(V.iq, V.id) + eps; }
        let id = I * Math.cos(beta), iq = I * Math.sin(beta), k = 1, sat = false;
        if (volts(id, iq, we) > Vmax) {
          sat = true;
          if (volts(0, 0, we) > Vmax) k = 0;
          else { let lo = 0, hi = 1; for (let j = 0; j < 40; j++) { const mid = (lo + hi) / 2; if (volts(id * mid, iq * mid, we) > Vmax) hi = mid; else lo = mid; } k = lo; }
        }
        id *= k; iq *= k;
        return { id, iq, T: 1.5 * m.pp * m.psi * iq, sat, k, v: volts(id, iq, we), E: we * m.psi };
      }
      const loop = kit.loop(dt => {
        t += dt;
        const we = m.pp * V.n * TAU / 60, slow = Math.max(1, we / (TAU * 0.35));
        th = wrap(th + we * dt / slow);
        const s = state(th);
        // phase currents from the vector (amplitude-invariant): i_a = |i| cos(angle), …
        const ang = th + Math.atan2(s.iq, s.id), Im = Math.hypot(s.id, s.iq);
        const ia = Im * Math.cos(ang), ib = Im * Math.cos(ang - TAU / 3), ic = Im * Math.cos(ang + TAU / 3);
        if (dirty || t - lastPlot > 0.5) {
          dirty = false; lastPlot = t;
          const A = [], B = [], Cc = [], TT = [], T0 = [];
          let tmin = 1e9, tmax = -1e9, tsum = 0, cnt = 0;
          for (let d = 0; d <= 720; d += 3) {
            const tt = d * D2R, q = state(tt), a2 = tt + Math.atan2(q.iq, q.id), im = Math.hypot(q.id, q.iq);
            if (V.mode === 'six') { const sec = sectorOf(tt + V.eps * D2R + Math.PI), cu = pairCurrents(PAIRS[sec], q.k * Math.hypot(V.iq, V.id) / 0.955 / 1.1547); A.push([d, cu[0]]); B.push([d, cu[1]]); Cc.push([d, cu[2]]); }
            else { A.push([d, im * Math.cos(a2)]); B.push([d, im * Math.cos(a2 - TAU / 3)]); Cc.push([d, im * Math.cos(a2 + TAU / 3)]); }
            TT.push([d, q.T]); T0.push([d, 1.5 * m.pp * m.psi * V.iq]);
            tmin = Math.min(tmin, q.T); tmax = Math.max(tmax, q.T); tsum += q.T; cnt++;
          }
          const tm = tsum / Math.max(1, cnt);
          p1.set({ series: [{ pts: A, label: 'i a', color: phc(0) }, { pts: B, label: 'i b', color: phc(1) }, { pts: Cc, label: 'i c', color: phc(2) }] });
          p2.set({ y: { label: 'torque (N·m)', min: Math.min(0, tmin * 1.1) }, series: [{ pts: TT, label: 'torque' }, { pts: T0, label: 'commanded', dash: [5, 4], color: kit.colors().muted }] });
          ro.set('T', tm.toFixed(3) + ' N·m · ' + (Math.abs(tm) > 1e-6 ? (100 * (tmax - tmin) / Math.abs(tmax)).toFixed(1) + ' %' : '—'));
        }
        ro.set('ph', Im.toFixed(2) + ' A peak (' + (Im / Math.SQRT2).toFixed(2) + ' A rms)');
        ro.set('dq', s.id.toFixed(2) + ' A · ' + s.iq.toFixed(2) + ' A');
        ro.set('v', s.v.toFixed(1) + ' V · ' + Vmax.toFixed(1) + ' V peak per phase');
        ro.set('st', s.k === 0 && s.sat ? 'back-EMF (' + s.E.toFixed(1) + ' V) above the bus limit: no control' : s.sat ? 'voltage limit: only ' + (100 * s.k).toFixed(0) + ' % of the current gets in' : Math.abs(V.eps) > 0.5 ? 'angle error: ' + (100 * Math.cos(V.eps * D2R)).toFixed(0) + ' % of the current makes torque' : 'tracking');
        // drawing
        const c = frame(st, 660, 280), C = kit.colors();
        const cx = 150, cy = 140, R = 110, sc = R / 16;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        [0, 1, 2].forEach(k => {
          const a = k * TAU / 3, [x1, y1] = xy(cx, cy, R, a), [x0, y0] = xy(cx, cy, R, a + Math.PI);
          c.strokeStyle = phc(k, 0.5); c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
          txt(c, LET[k].toLowerCase(), x1 + 10 * Math.cos(a), y1 - 10 * Math.sin(a) + 4, phc(k));
          const val = [ia, ib, ic][k], [bx, by] = xy(cx, cy, val * sc, a);
          c.strokeStyle = phc(k); c.lineWidth = 6; c.beginPath(); c.moveTo(cx, cy); c.lineTo(bx, by); c.stroke();
        });
        // rotor magnet, d and q axes
        c.fillStyle = NCOL; c.globalAlpha = 0.25; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, 38, -th - Math.PI / 2, -th + Math.PI / 2); c.fill();
        c.fillStyle = SCOL; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, 38, -th + Math.PI / 2, -th + 3 * Math.PI / 2); c.fill(); c.globalAlpha = 1;
        const [dx, dy] = xy(cx, cy, R * 0.95, th), [qx, qy] = xy(cx, cy, R * 0.95, th + Math.PI / 2);
        kitArrow(c, cx, cy, dx, dy, NCOL, 2); txt(c, 'd', dx + 8, dy, NCOL);
        c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(qx, qy); c.stroke(); c.setLineDash([]); txt(c, 'q', qx + 8, qy, C.muted);
        const [vx, vy] = xy(cx, cy, Im * sc, ang); kitArrow(c, cx, cy, vx, vy, FIELD, 4);
        txt(c, 'stator frame (α–β): everything turns', cx, 272, C.muted);
        // rotor frame
        const ox = 470, oy = 150, S2 = 7;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(ox - 130, oy); c.lineTo(ox + 130, oy); c.moveTo(ox, oy + 30); c.lineTo(ox, oy - 125); c.stroke();
        txt(c, 'd (magnet)', ox + 120, oy + 16, NCOL, 'right'); txt(c, 'q', ox + 10, oy - 115, C.text, 'left');
        for (let a = -15; a <= 15; a += 5) { c.fillStyle = C.muted; c.fillRect(ox + a * S2 - 0.5, oy - 3, 1, 6); }
        const ex = ox + s.id * S2, ey = oy - s.iq * S2;
        c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex, oy); c.moveTo(ex, ey); c.lineTo(ox, ey); c.stroke(); c.setLineDash([]);
        if (V.mode === 'foc' && (Math.abs(V.eps) > 0.5 || s.sat)) { c.setLineDash([5, 4]); kitArrow(c, ox, oy, ox + V.id * S2, oy - V.iq * S2, C.muted, 2); c.setLineDash([]); txt(c, 'commanded', ox + V.id * S2 - 6, oy - V.iq * S2 - 8, C.muted, 'right', 10); }
        kitArrow(c, ox, oy, ex, ey, FIELD, 4);
        txt(c, 'i_d = ' + s.id.toFixed(1) + ' A', ox - 120, oy + 50, C.text, 'left'); txt(c, 'i_q = ' + s.iq.toFixed(1) + ' A → T = ' + s.T.toFixed(3) + ' N·m', ox - 120, oy + 68, C.text, 'left');
        txt(c, 'rotor frame (d–q): the vector stands still' + (V.mode === 'six' ? ' — except in six-step' : ''), ox, 272, C.muted);
        if (slow > 1.01) txt(c, 'drawn ' + slow.toFixed(0) + '× slower', cx, 16, C.muted);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-runner */
  // motors of one size class (≈ 50 mm outrunner) wound for different Kv, and a geared inrunner; I0 stands for iron and friction loss
  const RUN = {
    out: { name: 'Outrunner 12N14P, 380 rpm/V, 0.08 Ω (50 mm class)', type: 'out', Kv: 380, R: 0.08, I0: 0.7, pp: 7, gear: 1, eg: 1, Rth: 1.2, Cth: 150 },
    inr: { name: 'Inrunner 4-pole, 2200 rpm/V, 0.0075 Ω, 5.8:1 gearbox', type: 'in', Kv: 2200, R: 0.0075, I0: 2.0, pp: 2, gear: 5.8, eg: 0.95, Rth: 2.0, Cth: 120 },
    hiKv: { name: 'Outrunner, same size wound for 760 rpm/V', type: 'out', Kv: 760, R: 0.02, I0: 1.4, pp: 7, gear: 1, eg: 1, Rth: 1.2, Cth: 150 },
    loKv: { name: 'Outrunner, same size wound for 190 rpm/V', type: 'out', Kv: 190, R: 0.32, I0: 0.35, pp: 7, gear: 1, eg: 1, Rth: 1.2, Cth: 150 }
  };
  const PROPS = { p10: { name: '10 × 4.5 in', D: 0.254, CP: 0.042, CT: 0.10 }, p12: { name: '12 × 4.5 in', D: 0.3048, CP: 0.045, CT: 0.105 }, p14: { name: '14 × 5 in', D: 0.3556, CP: 0.048, CT: 0.11 } };
  Hyper.sim('bl-runner', {
    title: 'Inrunner or outrunner on a propeller',
    blurb: `A lithium battery, an ESC and a brushless motor turning a propeller, solved for the steady state at each throttle. The propeller's torque grows with the square of its speed ($Q = C_P\\rho n^2 D^5/2\\pi$) and its thrust likewise ($F = C_T\\rho n^2 D^4$); the motor follows $V = RI + K_e\\omega$; the battery sags with its internal resistance. The winding warms with its copper and iron losses (time sped up 20×). Left graph: motor and propeller torque against speed at this throttle; right graph: current and thrust over the whole throttle range.

**Try this**
- The 380 rpm/V outrunner on 6S with the 12-inch propeller: about 8000 rpm, 17 A and nearly 2 kg of thrust at full throttle.
- Choose the geared inrunner: the same propeller at a similar speed — the motor spins at 40 000+ rpm, the gearbox takes its share and the iron losses grow.
- Choose the 760 rpm/V winding (half the turns) on 6S: it tries to spin the propeller twice as fast — eight times the power — and slams into the ESC's current limit (an ESC without one would burn). On 3S the same motor runs exactly like the 380 rpm/V one on 6S, at twice the current.
- The 190 rpm/V winding on 6S: it cannot reach the speed — plenty of torque per ampere but too little thrust.
- Watch the battery voltage sag under load and the thrust per watt fall as the throttle rises.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const [g1, g2] = plotRow(box, 2);
      const rho = 1.2;
      let V = null, m = RUN[params && RUN[params.preset] ? params.preset : 'out'], temp = 25, ang = 0, t = 0, lastPlot = -1, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Motor', options: Object.entries(RUN).map(([k, p]) => [p.name, k]), value: params && RUN[params.preset] ? params.preset : 'out' },
        { id: 'prop', type: 'select', label: 'Propeller', options: Object.entries(PROPS).map(([k, p]) => [p.name, k]), value: 'p12' },
        { id: 'cells', type: 'select', label: 'Battery', options: [['3 cells (3S, 11.1 V)', 3], ['4 cells (4S, 14.8 V)', 4], ['6 cells (6S, 22.2 V)', 6]], value: 6 },
        { id: 'vc', label: 'Cell voltage (charge state)', min: 3.4, max: 4.2, step: 0.05, value: 3.8, unit: 'V' },
        { id: 'thr', label: 'Throttle', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'ilim', type: 'select', label: 'ESC rating', options: [['30 A', 30], ['40 A', 40], ['60 A', 60]], value: 40 },
        { type: 'buttons', items: [{ id: 'cool', label: 'Cool the motor' }] }
      ], id => { if (id === 'preset') { m = RUN[V.preset]; } if (id === 'cool') temp = 25; dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Motor · propeller speed'], ['I', 'Motor · battery current'], ['Vb', 'Battery under load'], ['P', 'Battery power · shaft power'], ['eta', 'Motor efficiency'], ['F', 'Thrust · thrust per watt'], ['L', 'Copper + iron loss'], ['Tw', 'Winding temperature']]);
      const p1 = kit.plot(g1, { x: { label: 'motor speed (rpm)', min: 0 }, y: { label: 'torque at the motor (N·m)', min: 0 }, legend: true }, 180);
      const p2 = kit.plot(g2, { x: { label: 'throttle (%)', min: 0, max: 100 }, y: { label: 'current (A) · thrust (N)', min: 0 }, legend: true }, 180);
      const Ke = () => 60 / (TAU * m.Kv);
      const propQ = (w, pr) => { const n = w / (TAU * m.gear); return pr.CP * rho * n * n * Math.pow(pr.D, 5) / TAU; };   // at the propeller
      const motT = (w, pr) => propQ(w, pr) / (m.gear * m.eg);
      function solve(D) {
        const pr = PROPS[V.prop], Voc = V.cells * V.vc, Ri = V.cells * 0.004, ke = Ke(), Ilim = +V.ilim;
        if (D <= 0.001) return { w: 0, I: 0, Ib: 0, Vb: Voc, lim: false };
        const cur = w => motT(w, pr) / ke + m.I0;
        const g = w => { const I = cur(w); return D * (Voc - Ri * D * I) - ke * w - m.R * I; };
        let lo = 0, hi = D * Voc / ke;
        for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
        let w = lo, I = cur(w), lim = false;
        if (I > Ilim) { lim = true; I = Ilim; const Tm = ke * (Ilim - m.I0); w = Math.sqrt(Math.max(0, Tm * m.gear * m.eg * TAU / (pr.CP * rho * Math.pow(pr.D, 5)))) * TAU * m.gear; }
        const Deff = lim ? clamp((ke * w + m.R * I) / Math.max(1e-6, Voc - Ri * D * I), 0, 1) : D;
        const Ib = Deff * I;
        return { w, I, Ib, Vb: Voc - Ri * Ib, lim };
      }
      const loop = kit.loop(dt => {
        t += dt;
        const pr = PROPS[V.prop], s = solve(V.thr / 100), ke = Ke();
        const wp = s.w / m.gear, n = wp / TAU, F = pr.CT * rho * n * n * Math.pow(pr.D, 4);
        const Pshaft = propQ(s.w, pr) * wp, Pcu = s.I * s.I * m.R, Pfe = ke * s.w * m.I0;
        const Pin = s.Vb * s.Ib, Pmotor = ke * (s.I - m.I0) * s.w, etaM = Pin > 1e-6 ? Pmotor / Pin : 0;
        const sub = 10, h = dt * 20 / sub;
        for (let k = 0; k < sub; k++) temp += h * (Pcu + Pfe - (temp - 25) / m.Rth) / m.Cth;
        ro.set('n', rpmOf(s.w).toFixed(0) + ' · ' + rpmOf(wp).toFixed(0) + ' rpm');
        ro.set('I', s.I.toFixed(1) + ' A · ' + s.Ib.toFixed(1) + ' A' + (s.lim ? ' (ESC limit!)' : ''));
        ro.set('Vb', s.Vb.toFixed(2) + ' V (' + (s.Vb / V.cells).toFixed(2) + ' V per cell)');
        ro.set('P', Pin.toFixed(0) + ' W · ' + Pshaft.toFixed(0) + ' W');
        ro.set('eta', (100 * clamp(etaM, 0, 1)).toFixed(1) + ' %' + (m.gear > 1 ? ', gearbox ' + (100 * m.eg).toFixed(0) + ' %' : ''));
        ro.set('F', (F / 9.81 * 1000).toFixed(0) + ' gf · ' + (Pin > 1 ? (F / 9.81 * 1000 / Pin).toFixed(1) : '—') + ' g/W');
        ro.set('L', (Pcu + Pfe).toFixed(1) + ' W (' + Pcu.toFixed(1) + ' + ' + Pfe.toFixed(1) + ')');
        ro.set('Tw', temp.toFixed(0) + ' °C' + (temp > 120 ? ' — too hot for the magnets and insulation!' : ''));
        if (dirty || t - lastPlot > 0.6) {
          dirty = false; lastPlot = t;
          const Voc = V.cells * V.vc, D = V.thr / 100, w0 = Math.max(1, D * Voc / ke), line = [], prop = [];
          for (let i = 0; i <= 60; i++) { const w = w0 * i / 60, I = Math.min(+V.ilim, Math.max(0, (D * Voc - ke * w) / m.R)); line.push([rpmOf(w), Math.max(0, ke * (I - m.I0))]); prop.push([rpmOf(w), motT(w, pr)]); }
          const tmax = Math.max(0.05, ke * (+V.ilim - m.I0) * 1.1);
          const cI = [], cF = [];
          for (let i = 0; i <= 25; i++) { const q = solve(i / 25), nn = q.w / m.gear / TAU; cI.push([i * 4, q.I]); cF.push([i * 4, pr.CT * rho * nn * nn * Math.pow(pr.D, 4)]); }
          p1.set({ x: { label: 'motor speed (rpm)', min: 0, max: rpmOf(w0) * 1.02 }, y: { label: 'torque at the motor (N·m)', min: 0, max: Math.min(tmax, Math.max(0.05, motT(w0, pr) * 1.1)) }, series: [{ pts: line, label: 'motor at ' + V.thr + ' % (ESC limit flat top)' }, { pts: prop, label: 'propeller (reflected)', dash: [5, 4], color: kit.colors().muted }], marks: [{ x: rpmOf(s.w), y: ke * (s.I - m.I0), label: 'runs here' }] });
          p2.set({ series: [{ pts: cI, label: 'motor current (A)' }, { pts: cF, label: 'thrust (N)' }], hlines: [{ y: +V.ilim, label: 'ESC ' + V.ilim + ' A' }], vlines: [{ x: V.thr, label: 'now' }] });
        }
        // drawing
        const c = frame(st, 660, 250), C = kit.colors();
        ang = wrap(ang + wp * dt / 40);
        const mang = wrap(ang * m.gear);
        const drawIn = (x, y, on) => {
          c.globalAlpha = on ? 1 : 0.35;
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 58, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.border2 || C.faint; c.beginPath(); c.arc(x, y, 50, 0, TAU); c.fill();
          c.fillStyle = C.surface2; c.beginPath(); c.arc(x, y, 27, 0, TAU); c.fill();
          for (let k = 0; k < 4; k++) { c.fillStyle = k % 2 ? SCOL : NCOL; c.beginPath(); c.moveTo(x, y); c.arc(x, y, 24, -mang + k * Math.PI / 2, -mang + (k + 1) * Math.PI / 2); c.fill(); }
          c.fillStyle = C.text; c.beginPath(); c.arc(x, y, 5, 0, TAU); c.fill();
          txt(c, 'inrunner', x, y + 76, on ? C.text : C.muted); txt(c, 'gap at small radius, geared', x, y + 91, C.muted, 'center', 10);
          c.globalAlpha = 1;
        };
        const drawOut = (x, y, on) => {
          c.globalAlpha = on ? 1 : 0.35;
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 58, 0, TAU); c.fill(); c.stroke();
          for (let k = 0; k < 14; k++) { c.fillStyle = k % 2 ? SCOL : NCOL; c.beginPath(); c.arc(x, y, 55, -mang + k * TAU / 14, -mang + (k + 0.9) * TAU / 14); c.arc(x, y, 47, -mang + (k + 0.9) * TAU / 14, -mang + k * TAU / 14, true); c.closePath(); c.fill(); }
          c.fillStyle = C.border2 || C.faint;
          for (let k = 0; k < 12; k++) { c.save(); c.translate(x, y); c.rotate(k * TAU / 12); c.fillRect(8, -4, 36, 8); c.fillRect(38, -9, 6, 18); c.restore(); }
          c.fillStyle = C.text; c.beginPath(); c.arc(x, y, 6, 0, TAU); c.fill();
          txt(c, 'outrunner (12N14P)', x, y + 76, on ? C.text : C.muted); txt(c, 'magnets in the bell, direct drive', x, y + 91, C.muted, 'center', 10);
          c.globalAlpha = 1;
        };
        drawIn(80, 100, m.type === 'in'); drawOut(225, 100, m.type === 'out');
        // the propeller, seen from above, and the thrust
        const px = 420, py = 110, pr2 = 110 * pr.D / 0.3556;
        c.save(); c.translate(px, py); c.rotate(-ang);
        c.fillStyle = 'hsl(200 50% 55% / .8)';
        for (let k = 0; k < 2; k++) { c.rotate(Math.PI); c.beginPath(); c.ellipse(pr2 / 2, 0, pr2 / 2, 7, 0, 0, TAU); c.fill(); }
        c.restore();
        c.fillStyle = C.text; c.beginPath(); c.arc(px, py, 8, 0, TAU); c.fill();
        txt(c, pr.name + ' propeller' + (m.gear > 1 ? ', through ' + m.gear + ':1' : ', direct'), px, 238, C.muted);
        // bars: current against the ESC rating, temperature
        const bx = 555, bw = 18;
        const bar = (x, frac, col, lab, val) => { c.fillStyle = C.faint; c.fillRect(x, 30, bw, 170); c.fillStyle = col; c.fillRect(x, 30 + 170 * (1 - clamp(frac, 0, 1)), bw, 170 * clamp(frac, 0, 1)); txt(c, lab, x + bw / 2, 218, C.muted, 'center', 10); txt(c, val, x + bw / 2, 22, C.text, 'center', 11); };
        bar(bx, s.I / (+V.ilim), s.lim ? C.bad : C.accent, 'current', s.I.toFixed(0) + ' A');
        bar(bx + 55, (temp - 20) / 130, temp > 120 ? C.bad : 'hsl(20 85% 55%)', 'winding', temp.toFixed(0) + ' °C');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-esc */
  // steady state of battery → ESC → motor → propeller (as in bl-runner) at duty D
  function propSolve(m, pr, Voc, Ri, D, Ilim) {
    const rho = 1.2, ke = 60 / (TAU * m.Kv);
    if (D <= 0.001) return { w: 0, I: 0, Ib: 0, Vb: Voc, lim: false, D: 0 };
    const motT = w => { const n = w / (TAU * m.gear); return pr.CP * rho * n * n * Math.pow(pr.D, 5) / TAU / (m.gear * m.eg); };
    const cur = w => motT(w) / ke + m.I0;
    const g = w => { const I = cur(w); return D * (Voc - Ri * D * I) - ke * w - m.R * I; };
    let lo = 0, hi = D * Voc / ke;
    for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; }
    let w = lo, I = cur(w), lim = false, Deff = D;
    if (I > Ilim) { lim = true; I = Ilim; const Tm = ke * (Ilim - m.I0); w = Math.sqrt(Math.max(0, Tm * m.gear * m.eg * TAU / (pr.CP * rho * Math.pow(pr.D, 5)))) * TAU * m.gear; Deff = clamp((ke * w + m.R * I) / Math.max(1e-6, Voc - Ri * D * I), 0, 1); }
    const Ib = Deff * I;
    return { w, I, Ib, Vb: Voc - Ri * Ib, lim, D: Deff };
  }
  Hyper.sim('bl-esc', {
    title: 'Where an ESC\'s watts go',
    blurb: `An ESC driving the 380 rpm/V outrunner with a 14-inch propeller. The RC pulse (left) sets the throttle: 1000 µs is stop, 2000 µs full. The MOSFETs are coloured by their temperature; the heat comes from conduction ($2I^2R_{DS(on)}$, and $R_{DS(on)}$ rises as they warm), from switching ($\\tfrac12 V I t_{sw} f_{PWM}$ while chopping), from the logic and from the BEC. The first graph is the ESC temperature over time (sped up 10×), the second the losses across the throttle range.

**Try this**
- Full throttle in propeller wash: about 30 A and a few watts of loss — the ESC stays warm, not hot.
- Put it in a *closed box*: the same watts now make it 3–5 times hotter; it reaches the over-temperature limit and cuts back the throttle.
- Choose MOSFETs with 4 mΩ instead of 1.5 mΩ: conduction loss nearly triples, and grows further as they heat.
- At half throttle raise the PWM frequency from 8 to 48 kHz: the switching loss grows sixfold. At full throttle there is no chopping, so no switching loss.
- Load the BEC with 2 A and switch it to *linear* on 6 cells: it becomes the hottest part of the ESC.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const [g1, g2] = plotRow(box, 2);
      const m = RUN.out, pr = PROPS.p14, Tamb = 30, Cth = 12, tsw = 50e-9, tdead = 0.5e-6, Rboard = 1e-3;
      let V = null, T = Tamb, t = 0, ang = 0, lastPlot = -1, dirty = true, hist = [], derate = false;
      const ctl = kit.controls(box.side, [
        { id: 'tp', label: 'Throttle pulse', min: 900, max: 2100, step: 5, value: 2000, unit: 'µs' },
        { id: 'cells', type: 'select', label: 'Battery', options: [['3S (11.1 V)', 3], ['4S (14.8 V)', 4], ['6S (22.2 V)', 6]], value: 6 },
        { id: 'rds', label: 'MOSFET on-resistance per switch position (25 °C)', min: 0.5, max: 6, step: 0.1, value: 1.5, unit: 'mΩ' },
        { id: 'f', label: 'PWM frequency', min: 8, max: 48, step: 1, value: 24, unit: 'kHz' },
        { id: 'cool', type: 'select', label: 'Cooling', options: [['Propeller wash (≈ 6 K/W)', 6], ['Still air (≈ 18 K/W)', 18], ['Closed box (≈ 30 K/W)', 30]], value: 6 },
        { id: 'bec', type: 'select', label: 'BEC', options: [['Switching, 85 %', 'sw'], ['Linear', 'lin']], value: 'sw' },
        { id: 'ibec', label: 'BEC load at 5 V', min: 0, max: 3, step: 0.1, value: 0.5, unit: 'A' },
        { type: 'buttons', items: [{ id: 'cool0', label: 'Cool down' }] }
      ], id => { if (id === 'cool0') { T = Tamb; hist = []; derate = false; } dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['D', 'Throttle (duty)'], ['I', 'Motor · battery current'], ['pc', 'Conduction loss'], ['ps', 'Switching loss'], ['pb', 'BEC · logic loss'], ['pt', 'Total · ESC efficiency'], ['T', 'MOSFET temperature'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s, ×10)', min: 0 }, y: { label: 'ESC temperature (°C)', min: 20 }, legend: false }, 170);
      const p2 = kit.plot(g2, { x: { label: 'throttle (%)', min: 0, max: 100 }, y: { label: 'loss (W)', min: 0 }, legend: true }, 170);
      const losses = (D, Tj) => {
        const s = propSolve(m, pr, V.cells * 3.8, V.cells * 0.004, D, 60);
        const rds = V.rds * 1e-3 * (1 + 0.005 * (Tj - 25));
        const pc = 2 * s.I * s.I * rds, ps = s.D > 0.001 && s.D < 0.99 ? 0.5 * s.Vb * s.I * tsw * V.f * 1000 : 0;
        const pd = s.D > 0.001 && s.D < 0.99 ? 0.7 * s.I * 2 * tdead * V.f * 1000 : 0, pw = s.I * s.I * Rboard;   // body diodes in the dead time; copper, joints, capacitor
        const pb = V.bec === 'lin' ? Math.max(0, s.Vb - 5) * V.ibec : 5 * V.ibec * (1 / 0.85 - 1), pl = 0.3;
        return { s, pc, ps: ps + pd, pw, pb, pl, tot: pc + ps + pd + pw + pb + pl };
      };
      const loop = kit.loop(dt => {
        t += dt;
        let D = V.tp < 1050 ? 0 : clamp((V.tp - 1000) / 1000, 0, 1);
        if (T > 110) derate = true; else if (T < 95) derate = false;
        if (derate) D = Math.min(D, 0.5);
        const L = losses(D, T), s = L.s, Rth = +V.cool;
        const sub = 10, h = dt * 10 / sub;
        for (let k = 0; k < sub; k++) T += h * (L.tot - (T - Tamb) / Rth) / Cth;
        hist.push([t * 10, T]); while (hist.length > 900) hist.shift();
        const Pin = s.Vb * s.Ib + L.pb + L.pl + 5 * V.ibec, eff = Pin > 1 ? (Pin - L.tot - 5 * V.ibec) / (Pin - 5 * V.ibec) : 0;
        ro.set('D', (100 * D).toFixed(0) + ' % (pulse ' + V.tp.toFixed(0) + ' µs)' + (derate ? ' — cut back!' : ''));
        ro.set('I', s.I.toFixed(1) + ' A · ' + s.Ib.toFixed(1) + ' A');
        ro.set('pc', L.pc.toFixed(2) + ' W');
        ro.set('ps', L.ps.toFixed(2) + ' W' + (L.ps === 0 && D > 0.98 ? ' (full on: no chopping)' : ' (incl. dead-time diodes)'));
        ro.set('pb', L.pb.toFixed(2) + ' W · ' + L.pl.toFixed(1) + ' W');
        ro.set('pt', L.tot.toFixed(1) + ' W · ' + (100 * clamp(eff, 0, 1)).toFixed(1) + ' %');
        ro.set('T', T.toFixed(0) + ' °C (steady ' + (Tamb + L.tot * Rth).toFixed(0) + ' °C)');
        ro.set('st', L.pb > 5 ? 'the linear BEC is burning ' + L.pb.toFixed(0) + ' W — use a switching BEC' : derate ? 'over-temperature: throttle limited to 50 %' : T > 95 ? 'hot' : 'OK');
        if (dirty || t - lastPlot > 0.3) {
          dirty = false; lastPlot = t;
          const a = [], b = [], cc = [];
          for (let i = 0; i <= 25; i++) { const q = losses(i / 25, T); a.push([i * 4, q.pc]); b.push([i * 4, q.ps]); cc.push([i * 4, q.tot]); }
          p1.set({ series: [{ pts: hist.slice(), label: 'temperature' }], hlines: [{ y: 110, label: 'cut-back 110 °C' }] });
          p2.set({ series: [{ pts: a, label: 'conduction' }, { pts: b, label: 'switching' }, { pts: cc, label: 'total (with BEC, logic)' }], vlines: [{ x: 100 * D, label: 'now' }] });
        }
        // drawing
        const c = frame(st, 660, 240), C = kit.colors();
        // the RC pulse: one 20 ms frame, pulse drawn 10× wider for visibility
        const sx = 20, sy = 60, sw = 170;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, sy + 50);
        const pw = sw * clamp(V.tp / 2500, 0, 1) * 0.9;
        c.lineTo(sx + 10, sy + 50); c.lineTo(sx + 10, sy); c.lineTo(sx + 10 + pw, sy); c.lineTo(sx + 10 + pw, sy + 50); c.lineTo(sx + sw, sy + 50); c.stroke();
        c.setLineDash([3, 3]); c.strokeStyle = C.muted; c.lineWidth = 1;
        [1000, 2000].forEach(v => { const x = sx + 10 + sw * v / 2500 * 0.9; c.beginPath(); c.moveTo(x, sy - 8); c.lineTo(x, sy + 58); c.stroke(); txt(c, v + ' µs', x, sy + 72, C.muted, 'center', 10); });
        c.setLineDash([]);
        txt(c, 'RC pulse ' + V.tp.toFixed(0) + ' µs, every 20 ms', sx + sw / 2, sy - 18, C.text);
        txt(c, '→ throttle ' + (100 * D).toFixed(0) + ' %', sx + sw / 2, sy + 100, C.text);
        // the ESC board
        const ex = 220, ey = 40, ew = 220, eh = 150;
        c.fillStyle = 'hsl(150 35% 30% / .5)'; c.fillRect(ex, ey, ew, eh); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(ex, ey, ew, eh);
        const hue = 220 - 220 * clamp((T - 25) / 100, 0, 1);
        for (let k = 0; k < 6; k++) { const x = ex + 20 + (k % 3) * 64, y = ey + 20 + Math.floor(k / 3) * 58; c.fillStyle = 'hsl(' + hue.toFixed(0) + ' 80% 50%)'; c.fillRect(x, y, 44, 34); c.strokeStyle = C.text; c.strokeRect(x, y, 44, 34); txt(c, LET[k % 3] + (k < 3 ? '↑' : '↓'), x + 22, y + 22, '#fff', 'center', 11); }
        c.fillStyle = C.surface2; c.fillRect(ex + 20, ey + 128, 60, 16); txt(c, 'MCU', ex + 50, ey + 140, C.text, 'center', 10);
        const bh = 220 - 220 * clamp(L.pb / 6, 0, 1);
        c.fillStyle = 'hsl(' + bh.toFixed(0) + ' 70% 45%)'; c.fillRect(ex + 95, ey + 128, 50, 16); txt(c, 'BEC', ex + 120, ey + 140, '#fff', 'center', 10);
        c.fillStyle = C.muted; c.beginPath(); c.arc(ex + ew - 30, ey + eh - 20, 12, 0, TAU); c.fill(); txt(c, 'C', ex + ew - 30, ey + eh - 16, '#fff', 'center', 10);
        txt(c, T.toFixed(0) + ' °C, ' + L.tot.toFixed(1) + ' W', ex + ew / 2, ey + eh + 22, T > 95 ? C.bad : C.text);
        // motor and propeller
        ang = wrap(ang + s.w * dt / 40);
        const mx = 540, my = 110;
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.beginPath(); c.arc(mx, my, 26, 0, TAU); c.fill(); c.stroke();
        c.save(); c.translate(mx, my); c.rotate(-ang); c.fillStyle = 'hsl(200 50% 55% / .8)';
        for (let k = 0; k < 2; k++) { c.rotate(Math.PI); c.beginPath(); c.ellipse(55, 0, 55, 7, 0, 0, TAU); c.fill(); }
        c.restore();
        txt(c, rpmOf(s.w).toFixed(0) + ' rpm, ' + s.I.toFixed(1) + ' A', mx, 205, C.text);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-pancake */
  Hyper.sim('bl-pancake', {
    title: 'Radial or axial flux in the same can',
    blurb: `Two motors made to fit the same cylindrical can, both working at the same air-gap shear stress. **Radial:** a rotor of radius 0.325 D inside a stator; the end windings take about 7.5 % of D from the length, and $T = 2\\pi r^2 L\\sigma$. **Axial:** discs with an active ring from $R_o = 0.46\\,D$ down to $R_o/\\sqrt3$; each module (one stator between two rotors, or one rotor and one stator) needs a slice of length, and $T = \\tfrac{2\\pi}{3}\\sigma(R_o^3 - R_i^3)$ per gap. The graphs show both torques against length and against diameter. Proportions are typical, not a design.

**Try this**
- The default 200 × 60 mm can: the axial motor gives more than twice the torque.
- Make the can longer: the radial torque grows with the length, the single axial module does not — beyond a length of roughly half the diameter the radial motor wins.
- Tick *Stack several axial modules*: multi-disc machines win back the length, at the price of more discs, bearings and parts — which is why they are built only where torque density is worth it.
- Double the diameter: the radial torque grows by less than 4× (the end windings grow too), the axial by about 8×.
- Choose single-sided: half the gaps, half the torque — and a large magnetic pull on the bearings (kilonewtons) that the double-sided design cancels.
- Compare the rotor inertias: magnet discs of large diameter are not light.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const [g1, g2] = plotRow(box, 2);
      let V = null, ang = 0, lastPlot = -1, t = 0, dirty = true;
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Can diameter', min: 60, max: 400, step: 5, value: 200, unit: 'mm' },
        { id: 'L', label: 'Can length', min: 20, max: 400, step: 5, value: 60, unit: 'mm' },
        { id: 'sig', label: 'Air-gap shear stress', min: 5, max: 40, step: 1, value: 20, unit: 'kPa' },
        { id: 'sides', type: 'select', label: 'Axial-flux build', options: [['Double-sided (2 gaps per module)', 2], ['Single-sided (1 gap per module)', 1]], value: 2 },
        { id: 'stack', type: 'check', label: 'Stack several axial modules along the shaft', value: false }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['tr', 'Radial motor torque'], ['ta', 'Axial motor torque'], ['ratio', 'Axial ÷ radial'], ['dens', 'Torque per litre of can: radial · axial'], ['J', 'Rotor inertia: radial · axial'], ['F', 'Axial magnetic pull']]);
      const p1 = kit.plot(g1, { x: { label: 'can length (mm)', min: 0, max: 400 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'can diameter (mm)', min: 60, max: 400 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 170);
      const rho = 7500, mu0 = 4e-7 * Math.PI;
      const calc = (Dmm, Lmm, sig, ng) => {
        const D = Dmm / 1000, L = Lmm / 1000, s = sig * 1000;
        const r = 0.325 * D, La = Math.max(0, L - 0.075 * D), Tr = TAU * r * r * La * s, Jr = 0.5 * rho * Math.PI * Math.pow(r, 4) * La;
        const Ro = 0.46 * D, Ri = Ro / Math.sqrt(3), Lu = ng === 2 ? 0.012 + 0.1 * D : 0.008 + 0.06 * D, units = V.stack ? Math.floor(L / Lu + 1e-9) : Math.min(1, Math.floor(L / Lu + 1e-9));
        const Tu = TAU / 3 * s * (Math.pow(Ro, 3) - Math.pow(Ri, 3)) * ng, Ta = units * Tu;
        const Ja = units * (ng === 2 ? 2 : 1) * 0.5 * rho * Math.PI * Math.pow(Ro, 4) * 0.03 * D;   // magnet discs on steel, 0.03 D thick
        const A = Math.PI * (Ro * Ro - Ri * Ri), F = 0.7 * 0.7 * A / (2 * mu0);
        return { Tr, Ta, units, Jr, Ja, F, La, Ro, Ri, Lu, r, vol: Math.PI * D * D / 4 * L * 1000 };
      };
      const loop = kit.loop(dt => {
        t += dt;
        const ng = +V.sides, q = calc(V.D, V.L, V.sig, ng);
        ro.set('tr', q.Tr.toFixed(1) + ' N·m (active length ' + (q.La * 1000).toFixed(0) + ' mm)');
        ro.set('ta', q.units ? q.Ta.toFixed(1) + ' N·m (' + q.units + ' module' + (q.units > 1 ? 's' : '') + ')' : 'too short for one module (' + (q.Lu * 1000).toFixed(0) + ' mm needed)');
        ro.set('ratio', q.Tr > 1e-6 ? (q.Ta / q.Tr).toFixed(2) : q.Ta > 0 ? 'radial gives nothing' : '—');
        ro.set('dens', (q.Tr / q.vol).toFixed(1) + ' · ' + (q.Ta / q.vol).toFixed(1) + ' N·m/L');
        ro.set('J', (q.Jr * 1e4).toFixed(1) + ' · ' + (q.Ja * 1e4).toFixed(1) + ' kg·cm²');
        ro.set('F', ng === 1 && q.units ? (q.F / 1000).toFixed(1) + ' kN per module on the bearings (at 0.7 T average)' : 'cancelled (double-sided, rotor centred)');
        if (dirty || t - lastPlot > 1) {
          dirty = false; lastPlot = t;
          const a = [], b = [], c2 = [], d2 = [];
          for (let L = 10; L <= 400; L += 5) { const z = calc(V.D, L, V.sig, ng); a.push([L, z.Tr]); b.push([L, z.Ta]); }
          for (let D = 60; D <= 400; D += 5) { const z = calc(D, V.L, V.sig, ng); c2.push([D, z.Tr]); d2.push([D, z.Ta]); }
          p1.set({ series: [{ pts: a, label: 'radial' }, { pts: b, label: 'axial' }], vlines: [{ x: V.L, label: 'this can' }] });
          p2.set({ series: [{ pts: c2, label: 'radial' }, { pts: d2, label: 'axial' }], vlines: [{ x: V.D, label: 'this can' }] });
        }
        // drawing: both motors in section, to the same scale
        ang = wrap(ang + dt * 1.2);
        const c = frame(st, 660, 260), C = kit.colors();
        const sc = Math.min(200 / 400, 200 / Math.max(V.D, 60), 250 / Math.max(V.L, 20)), Dp = V.D * sc, Lp = V.L * sc;
        const cy = 125, rx = 170, ax = 490;
        const can = (x) => { c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x - Lp / 2, cy - Dp / 2, Lp, Dp); c.setLineDash([6, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x - Lp / 2 - 20, cy); c.lineTo(x + Lp / 2 + 20, cy); c.stroke(); c.setLineDash([]); };
        // radial
        can(rx);
        const La = q.La * 1000 * sc, rp = q.r * 1000 * sc;
        c.fillStyle = C.border2 || C.faint; c.fillRect(rx - La / 2, cy - Dp / 2 + 3, La, Dp / 2 - rp - 5); c.fillRect(rx - La / 2, cy + rp + 2, La, Dp / 2 - rp - 5);
        c.fillStyle = 'hsl(30 80% 50% / .6)'; const ew = Math.max(1, (Lp - La) / 2 - 2);
        [[rx - La / 2 - ew, cy - Dp / 2 + 6], [rx + La / 2, cy - Dp / 2 + 6], [rx - La / 2 - ew, cy + rp + 4], [rx + La / 2, cy + rp + 4]].forEach(([x, y]) => { if (ew > 1) c.fillRect(x, y, ew, Dp / 2 - rp - 10); });
        for (let k = 0; k < 6; k++) { const ph = (k / 6 + ang / TAU) % 1, y = cy - rp + 2 * rp * ph; c.fillStyle = Math.floor(k) % 2 ? NCOL : SCOL; c.fillRect(rx - La / 2, y - 2, La, 4); }
        c.strokeStyle = C.text; c.strokeRect(rx - La / 2, cy - rp, La, 2 * rp);
        for (let k = -1; k <= 1; k += 2) kitArrow(c, rx + k * La * 0.25, cy - rp - 3, rx + k * La * 0.25, cy - rp - Math.min(18, Dp / 2 - rp - 4), FIELD, 2);
        txt(c, 'radial flux', rx, 18, C.text); txt(c, q.Tr.toFixed(1) + ' N·m', rx, 250, C.text);
        // axial
        can(ax);
        const Ro = q.Ro * 1000 * sc, Ri = q.Ri * 1000 * sc, Lu = q.Lu * 1000 * sc;
        for (let u = 0; u < q.units; u++) {
          const x0 = ax - Lp / 2 + u * Lu + 2, disc = Lu * (ng === 2 ? 0.18 : 0.3), stat = Lu * (ng === 2 ? 0.4 : 0.45);
          const parts = ng === 2 ? [['r', x0 + Lu * 0.05, disc], ['s', x0 + Lu * 0.05 + disc + Lu * 0.04, stat], ['r', x0 + Lu * 0.05 + disc + stat + Lu * 0.08, disc]] : [['r', x0 + Lu * 0.08, disc], ['s', x0 + Lu * 0.08 + disc + Lu * 0.05, stat]];
          parts.forEach(([k, x, wdt]) => {
            if (k === 's') { c.fillStyle = C.border2 || C.faint; c.fillRect(x, cy - Ro, wdt, Ro - Ri); c.fillRect(x, cy + Ri, wdt, Ro - Ri); c.fillStyle = 'hsl(30 80% 50% / .6)'; c.fillRect(x + wdt * 0.2, cy - Ro + 2, wdt * 0.6, Ro - Ri - 4); c.fillRect(x + wdt * 0.2, cy + Ri + 2, wdt * 0.6, Ro - Ri - 4); }
            else { const ph = Math.floor(ang / TAU * 8) % 2; c.fillStyle = C.muted; c.fillRect(x, cy - Ro, wdt * 0.5, 2 * Ro); c.fillStyle = ph ? NCOL : SCOL; c.fillRect(x + wdt * 0.5, cy - Ro, wdt * 0.5, Ro - Ri); c.fillStyle = ph ? SCOL : NCOL; c.fillRect(x + wdt * 0.5, cy + Ri, wdt * 0.5, Ro - Ri); }
          });
          const yf = cy - (Ro + Ri) / 2, xm = x0 + Lu * 0.45;
          kitArrow(c, xm - Lu * 0.25, yf, xm + Lu * 0.25, yf, FIELD, 2);
        }
        txt(c, 'axial flux (' + (ng === 2 ? 'double' : 'single') + '-sided)', ax, 18, C.text); txt(c, q.units ? q.Ta.toFixed(1) + ' N·m' : 'too short', ax, 250, C.text);
        txt(c, 'orange arrows: the flux crossing the gap', 330, 238, C.muted, 'center', 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-sync */
  Hyper.sim('bl-sync', {
    title: 'A synchronous motor: load angle and V-curves',
    blurb: `A 2 MW, 6.6 kV, 20-pole synchronous motor (300 rpm) driving a compressor, drawn with two poles. The stator's rotating field (orange) turns at synchronous speed; the rotor's DC-excited poles (N at the top of the arrow) follow it, lagging by the **load angle** δ. The phasor diagram shows the phase voltage V, the excitation voltage E (set by the field current) lagging by δ, the drop $jX_sI$ that closes the triangle, and the current I. The graphs are the V-curves (stator current against field current) and power against load angle.

**Try this**
- Raise the load: δ grows along the sine; at 90° is pull-out (twice the rating here).
- At full load move the field current: the current falls to a minimum at unity power factor and rises on both sides — lagging when under-excited, leading when over-excited. That is the V-curve.
- Weaken the field to 60 % at full load: the pull-out power drops below the load and the motor **slips poles** — the rotor falls back a full pole pitch again and again, with violent power swings; protection would trip.
- Tick *pulsating load* (a reciprocating compressor): the rotor swings about its mean angle — hunting — damped by the damper cage.
- Unload the motor and over-excite it: it draws almost no power and supplies reactive power — a synchronous condenser.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const Vp = 6600 / Math.sqrt(3), Xs = 20, Prat = 2e6, K = Math.PI * 50 / 1.5, cd = 4;
      let V = null, del = 0.52, dd = 0, t = 0, psi = 0, lastPlot = -1, dirty = true, slips = 0, lastWrap = 0;
      const ctl = kit.controls(box.side, [
        { id: 'load', label: 'Load, % of 2 MW', min: 0, max: 250, step: 1, value: 100, unit: '%' },
        { id: 'fld', label: 'Field current, % of the no-load unity-pf value', min: 30, max: 250, step: 1, value: 184, unit: '%' },
        { id: 'puls', type: 'check', label: 'Pulsating load (reciprocating compressor)', value: false },
        { type: 'buttons', items: [{ id: 'resync', label: 'Resynchronise', primary: true }] }
      ], id => { if (id === 'resync') { const Pm = 3 * Vp * Vp * V.fld / 100 / Xs, s = V.load / 100 * Prat / Pm; del = s < 1 ? Math.asin(s) : Math.PI / 2; dd = 0; slips = 0; } dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Load angle δ'], ['P', 'Power'], ['Q', 'Reactive power · power factor'], ['I', 'Stator current'], ['E', 'Excitation voltage E (per phase)'], ['pm', 'Pull-out power'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'field current (% of no-load unity pf)', min: 30, max: 250 }, y: { label: 'stator current (A)', min: 0 }, legend: true }, 180);
      const p2 = kit.plot(g2, { x: { label: 'load angle δ (°)', min: 0, max: 180 }, y: { label: 'power (MW)', min: 0 }, legend: true }, 180);
      const phasors = (E, d) => { const ire = E * Math.sin(d) / Xs, iim = (E * Math.cos(d) - Vp) / Xs; return { ire, iim, I: Math.hypot(ire, iim), P: 3 * Vp * ire, Q: 3 * Vp * iim }; };
      const loop = kit.loop(dt => {
        t += dt;
        const E = Vp * V.fld / 100, Pmax = 3 * Vp * E / Xs;
        let PL = V.load / 100 * Prat;
        const n = 50, h = dt / n;
        for (let k = 0; k < n; k++) {
          const tt = t - dt + k * h, pl = V.puls ? PL * (1 + 0.25 * Math.sin(TAU * 1.8 * tt)) : PL;
          const acc = K * (pl - Pmax * Math.sin(del)) / Prat - cd * dd;
          dd += h * acc; del += h * dd;
        }
        if (del > Math.PI * (2 * lastWrap + 1)) { slips++; lastWrap++; }
        const ph = phasors(E, del), slipping = dd > 0.5 || del > Math.PI;
        const pf = ph.I > 1e-6 ? ph.ire / ph.I : 1;
        ro.set('d', (Math.abs(del) < 1e-3 ? 0 : del / D2R % 360).toFixed(1) + '° electrical');
        ro.set('P', (ph.P / 1e6).toFixed(2) + ' MW');
        ro.set('Q', (ph.Q / 1e6).toFixed(2) + ' Mvar ' + (ph.Q > 1e3 ? 'supplied' : ph.Q < -1e3 ? 'drawn' : '') + ' · pf ' + Math.abs(pf).toFixed(2) + (ph.Q > 1e3 ? ' leading' : ph.Q < -1e3 ? ' lagging' : ''));
        ro.set('I', ph.I.toFixed(0) + ' A');
        ro.set('E', (E / 1000).toFixed(2) + ' kV (V = ' + (Vp / 1000).toFixed(2) + ' kV)');
        ro.set('pm', (Pmax / 1e6).toFixed(2) + ' MW = ' + (100 * Pmax / Prat).toFixed(0) + ' % of rating');
        ro.set('st', slipping ? 'pole slipping (' + slips + ' so far) — protection would trip; lower the load or raise the field, then Resynchronise' : V.puls ? 'in step, hunting about the mean angle' : 'in step at 300 rpm');
        if (dirty || t - lastPlot > 0.5) {
          dirty = false; lastPlot = t;
          const curves = [0, 50, 100].map(l => {
            const pts = [];
            for (let f = 30; f <= 250; f += 2) { const Ee = Vp * f / 100, pm = 3 * Vp * Ee / Xs, s = l / 100 * Prat / pm; if (s <= 1) pts.push([f, phasors(Ee, Math.asin(s)).I]); }
            return { pts, label: l + ' % load' };
          });
          const sine = [];
          for (let d = 0; d <= 180; d += 3) sine.push([d, Pmax * Math.sin(d * D2R) / 1e6]);
          p1.set({ series: curves, marks: slipping ? [] : [{ x: V.fld, y: ph.I, label: 'now' }] });
          p2.set({ y: { label: 'power (MW)', min: 0, max: Math.max(Pmax, PL) / 1e6 * 1.15 }, series: [{ pts: sine, label: 'P = 3VE sin δ / Xs' }], hlines: [{ y: PL / 1e6, label: 'load' }], marks: slipping ? [] : [{ x: (del / D2R) % 360, y: ph.P / 1e6, label: 'δ' }] });
        }
        // drawing
        psi = wrap(psi + TAU * 0.2 * dt);
        const c = frame(st, 660, 270), C = kit.colors();
        const cx = 120, cy = 135, R = 100, rotA = psi - del;
        c.lineWidth = R * 0.14; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.93, 0, TAU); c.stroke();
        c.lineWidth = 1.5; c.strokeStyle = C.text; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
        // salient-pole rotor with its field winding
        c.save(); c.translate(cx, cy); c.rotate(-rotA);
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(-18, -22); c.lineTo(18, -22); c.lineTo(18, 22); c.lineTo(-18, 22); c.closePath(); c.fill(); c.stroke();
        [1, -1].forEach(sg => { c.fillStyle = sg > 0 ? NCOL : SCOL; c.beginPath(); c.moveTo(sg * 20, -34); c.arc(0, 0, R * 0.78, sg > 0 ? -0.45 : Math.PI - 0.45, sg > 0 ? 0.45 : Math.PI + 0.45); c.lineTo(sg * 20, 34); c.closePath(); c.fill(); c.fillStyle = 'hsl(30 80% 50% / .75)'; c.fillRect(sg > 0 ? 22 : -46, -28, 24, 56); });
        c.restore();
        const [nx, ny] = xy(cx, cy, R * 0.72, rotA); kitArrow(c, cx, cy, nx, ny, C.text, 2); txt(c, 'rotor', nx + 12 * Math.cos(rotA), ny - 12 * Math.sin(rotA) + 4, C.text, 'center', 10);
        const [fx, fy] = xy(cx, cy, R * 0.9, psi); kitArrow(c, cx, cy, fx, fy, FIELD, 3.5);
        if (!slipping) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * 0.5, -psi, -rotA); c.stroke(); const [lx, ly] = xy(cx, cy, R * 0.5 + 12, psi - del / 2); txt(c, 'δ', lx, ly + 4, C.accent, 'center', 14); }
        txt(c, 'field and rotor drawn slowly (300 rpm real)', cx, 262, C.muted, 'center', 10);
        // phasor diagram
        const ox = 330, oy = 150, s = 180 / Math.max(Vp, E, 1);
        const Vx = ox + Vp * s, Ex = ox + E * s * Math.cos(del), Ey = oy + E * s * Math.sin(del);
        kitArrow(c, ox, oy, Vx, oy, C.text, 2.5); txt(c, 'V', Vx + 10, oy + 4, C.text);
        kitArrow(c, ox, oy, Ex, Ey, NCOL, 2.5); txt(c, 'E', Ex + 8, Ey + 12, NCOL);
        c.setLineDash([5, 3]); kitArrow(c, Ex, Ey, Vx, oy, C.muted, 1.8); c.setLineDash([]); txt(c, 'jXsI', (Ex + Vx) / 2 + 22, (Ey + oy) / 2, C.muted, 'center', 11);
        const is = 120 / 450, Ix = ox + ph.ire * is * Math.min(1, 450 / Math.max(1, ph.I)) * 1, Iy = oy - ph.iim * is * Math.min(1, 450 / Math.max(1, ph.I));
        kitArrow(c, ox, oy, Ix, Iy, FIELD, 2.5); txt(c, 'I', Ix + 8, Iy - 4, FIELD);
        txt(c, ph.Q > 1e3 ? 'I leads V: over-excited, supplying vars' : ph.Q < -1e3 ? 'I lags V: under-excited, drawing vars' : 'I in phase with V: unity power factor', ox + 150, 262, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-pmsm */
  const PMSM = { spm: { name: 'Surface magnets (SPM): Ld = Lq = 0.7 mH', Ld: 0.7e-3, Lq: 0.7e-3 }, ipm: { name: 'Interior magnets (IPM): Ld = 0.4, Lq = 1.0 mH', Ld: 0.4e-3, Lq: 1.0e-3 } };
  Hyper.sim('bl-pmsm', {
    title: 'PMSM limits: the current circle and the voltage ellipse',
    blurb: `A traction-size PMSM (8 poles, ψ = 80 mWb, 150 A peak) on a drive with a variable DC bus. On the right is the $i_d$–$i_q$ plane: the drive may not exceed its current (the **circle**), and at speed $\\omega_e$ the motor's voltage $\\sqrt{(L_d i_d + \\psi)^2 + (L_q i_q)^2}\\,\\omega_e$ must stay within $V_{dc}/\\sqrt3$ (the **ellipse**, which shrinks as the speed rises, centred at $-\\psi/L_d$). The motor can only work where they overlap; the grey curves are constant torque. The graphs show the most torque and power available at each speed for both rotor types.

**Try this**
- At 1000 rpm the ellipse is huge: the best point sits on the circle — on the q-axis for SPM, and 20–40° towards negative $i_d$ for IPM (maximum torque per ampere, using the reluctance torque).
- Raise the speed: past the base speed the ellipse cuts into the circle and the best point slides round it towards negative $i_d$ — field weakening. Torque falls, power stays roughly level.
- Compare SPM and IPM: at low speed the IPM gives about a third more torque from the same 150 A (reluctance torque); at 10 000 rpm it still keeps more power.
- Lower the bus to 250 V: everything happens at lower speed.
- *Manual* mode: put the current on the q-axis at high speed — outside the ellipse the drive cannot push that current in.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const [g1, g2] = plotRow(box, 2);
      const pp = 4, psi = 0.08, R = 0.02, Imax = 150;
      let V = null, ang = 0, dirty = true, env = null;
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Rotor', options: Object.entries(PMSM).map(([k, p]) => [p.name, k]), value: 'ipm' },
        { id: 'n', label: 'Speed', min: 0, max: 12000, step: 50, value: 3000, unit: 'rpm' },
        { id: 'Vdc', label: 'DC bus voltage', min: 200, max: 600, step: 10, value: 350, unit: 'V' },
        { id: 'mode', type: 'select', label: 'Current', options: [['Best: most torque within the limits', 'best'], ['Manual', 'man']], value: 'best' },
        { id: 'Ipct', label: 'Manual: current, % of 150 A', min: 0, max: 100, step: 1, value: 80, unit: '%' },
        { id: 'beta', label: 'Manual: angle from the q-axis towards −d', min: -20, max: 90, step: 1, value: 0, unit: '°' }
      ], id => { if (id === 'mode') { ctl.show('Ipct', V.mode === 'man'); ctl.show('beta', V.mode === 'man'); } dirty = true; });
      V = ctl.values; ctl.show('Ipct', false); ctl.show('beta', false);
      const ro = kit.readout(box.side, [['dq', 'id · iq'], ['I', 'Current'], ['T', 'Torque'], ['P', 'Mechanical power'], ['v', 'Voltage needed · available (peak phase)'], ['E', 'No-load back-EMF'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 12000 }, y: { label: 'most torque (N·m)', min: 0 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 12000 }, y: { label: 'most power (kW)', min: 0 }, legend: true }, 170);
      const volt = (mt, id, iq, we) => Math.hypot(R * id - we * mt.Lq * iq, R * iq + we * (mt.Ld * id + psi));
      const torque = (mt, id, iq) => 1.5 * pp * (psi * iq + (mt.Ld - mt.Lq) * id * iq);
      function best(mt, we, Vmax, nI, nB) {
        let b = { T: 0, id: 0, iq: 0, ok: false };
        for (let i = 1; i <= nI; i++) {
          const I = Imax * i / nI;
          for (let j = 0; j <= nB; j++) {
            const be = 90 * D2R * j / nB, id = -I * Math.sin(be), iq = I * Math.cos(be);
            if (volt(mt, id, iq, we) > Vmax) continue;
            const T = torque(mt, id, iq);
            if (T > b.T + 1e-9) b = { T, id, iq, ok: true };
          }
        }
        return b;
      }
      const loop = kit.loop(dt => {
        const mt = PMSM[V.type], we = pp * V.n * TAU / 60, Vmax = V.Vdc / Math.sqrt(3);
        let op;
        if (V.mode === 'best') op = best(mt, we, Vmax, 40, 90);
        else { const I = Imax * V.Ipct / 100, be = V.beta * D2R, id = -I * Math.sin(be), iq = I * Math.cos(be); op = { id, iq, T: torque(mt, id, iq), ok: volt(mt, id, iq, we) <= Vmax }; }
        const vneed = volt(mt, op.id, op.iq, we), P = op.T * V.n * TAU / 60;
        if (dirty) {
          dirty = false;
          env = {};
          for (const k of ['spm', 'ipm']) { const tq = [], pw = []; for (let n = 0; n <= 12000; n += 250) { const b = best(PMSM[k], pp * n * TAU / 60, Vmax, 25, 45); tq.push([n, b.T]); pw.push([n, b.T * n * TAU / 60 / 1000]); } env[k] = { tq, pw }; }
          p1.set({ series: [{ pts: env.spm.tq, label: 'SPM' }, { pts: env.ipm.tq, label: 'IPM' }], vlines: [{ x: V.n, label: 'now' }], marks: [{ x: V.n, y: op.ok ? op.T : 0 }] });
          p2.set({ series: [{ pts: env.spm.pw, label: 'SPM' }, { pts: env.ipm.pw, label: 'IPM' }], vlines: [{ x: V.n, label: 'now' }], marks: [{ x: V.n, y: op.ok ? P / 1000 : 0 }] });
        }
        ro.set('dq', op.id.toFixed(0) + ' A · ' + op.iq.toFixed(0) + ' A');
        ro.set('I', Math.hypot(op.id, op.iq).toFixed(0) + ' A peak (limit ' + Imax + ' A)');
        ro.set('T', op.T.toFixed(1) + ' N·m' + (op.ok ? '' : ' — cannot be reached'));
        ro.set('P', op.ok ? (P / 1000).toFixed(1) + ' kW' : '—');
        ro.set('v', vneed.toFixed(0) + ' V · ' + Vmax.toFixed(0) + ' V');
        ro.set('E', (psi * we).toFixed(0) + ' V' + (psi * we > Vmax ? ' — above the bus limit: field weakening is mandatory' : ''));
        ro.set('st', !op.ok ? 'outside the voltage ellipse: the drive cannot push this current in' : Math.abs(op.id) > 1 ? (psi * we > 0.9 * Vmax ? 'field weakening (negative id)' : 'MTPA: negative id adds reluctance torque') : 'on the q-axis');
        // drawing: the rotor
        ang = wrap(ang + Math.min(V.n, 3000) / 3000 * dt * 1.5);
        const c = frame(st, 660, 280), C = kit.colors();
        const cx = 110, cy = 140, Rr = 90;
        c.fillStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, Rr, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        for (let k = 0; k < 8; k++) {
          const a = ang + k * TAU / 8, col = k % 2 ? SCOL : NCOL;
          c.save(); c.translate(cx, cy); c.rotate(-a);
          c.fillStyle = col;
          if (V.type === 'spm') { c.beginPath(); c.arc(0, 0, Rr, -0.33, 0.33); c.arc(0, 0, Rr - 11, 0.33, -0.33, true); c.closePath(); c.fill(); }
          else { [-1, 1].forEach(sg => { c.save(); c.translate(Rr * 0.66, sg * 13); c.rotate(sg * 0.55); c.fillRect(-16, -3.5, 32, 7); c.restore(); }); }
          c.restore();
        }
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 10, 0, TAU); c.fill();
        txt(c, V.type === 'spm' ? 'magnets on the surface' : 'magnets buried in V shapes', cx, 250, C.text); txt(c, 'rotor, 8 poles (drawn slowly)', cx, 266, C.muted, 'center', 10);
        // the id–iq plane
        const ox = 505, oy = 245, sc = 0.72;   // px per A
        const X = id => ox + id * sc, Y = iq => oy - iq * sc;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(X(-250), oy); c.lineTo(X(60), oy); c.moveTo(ox, Y(0)); c.lineTo(ox, Y(215)); c.stroke();
        txt(c, 'i_d (A)', X(40), oy + 16, C.muted, 'center', 10); txt(c, 'i_q (A)', ox + 26, Y(205), C.muted, 'center', 10);
        for (let a = -250; a <= 50; a += 50) { c.fillStyle = C.muted; c.fillRect(X(a) - 0.5, oy - 3, 1, 6); if (a) txt(c, String(a), X(a), oy + 14, C.muted, 'center', 9); }
        // constant-torque curves
        const Tl = [50, 100, 150, 200];
        c.strokeStyle = C.faint; c.lineWidth = 1;
        Tl.forEach(T0 => {
          c.beginPath(); let started = false;
          for (let id = -250; id <= 50; id += 2) { const den = 1.5 * pp * (psi + (mt.Ld - mt.Lq) * id); if (den <= 0) continue; const iq = T0 / den; if (iq > 215) { started = false; continue; } started ? c.lineTo(X(id), Y(iq)) : c.moveTo(X(id), Y(iq)); started = true; }
          c.stroke();
          const idl = -240, den = 1.5 * pp * (psi + (mt.Ld - mt.Lq) * idl); if (den > 0 && T0 / den < 210) txt(c, T0 + ' N·m', X(idl), Y(T0 / den) - 4, C.muted, 'left', 9);
        });
        // current limit circle
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(ox, oy, Imax * sc, Math.PI, 1.5 * Math.PI); c.stroke();
        txt(c, 'current limit', X(-Imax * 0.72), Y(Imax * 0.72) - 8, C.accent, 'right', 10);
        // voltage ellipse (resistance neglected)
        if (we > 1) {
          const a = Vmax / (we * mt.Ld), b = Vmax / (we * mt.Lq), c0 = -psi / mt.Ld;
          c.save(); c.beginPath(); c.rect(X(-250), Y(215), 310 * sc, 215 * sc); c.clip();
          c.fillStyle = 'hsl(150 60% 45% / .12)'; c.strokeStyle = C.ok; c.lineWidth = 2;
          c.beginPath(); c.ellipse(X(c0), oy, Math.max(0.1, a * sc), Math.max(0.1, b * sc), 0, 0, TAU); c.fill(); c.stroke();
          c.restore();
          if (a * sc > 4) txt(c, 'voltage limit at ' + V.n + ' rpm', X(Math.max(-245, c0)), Y(Math.min(200, b * 0.9)) , C.ok, 'center', 10);
          c.fillStyle = C.ok; if (c0 > -250) { c.beginPath(); c.arc(X(c0), oy, 3, 0, TAU); c.fill(); txt(c, '−ψ/L_d', X(c0), oy - 8, C.ok, 'center', 9); }
        }
        c.fillStyle = op.ok ? FIELD : C.bad; c.beginPath(); c.arc(X(op.id), Y(op.iq), 6, 0, TAU); c.fill();
        kitArrow(c, ox, oy, X(op.id), Y(op.iq), op.ok ? FIELD : C.bad, 2);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-reluctance */
  Hyper.sim('bl-reluctance', {
    title: 'Reluctance motors: switched and synchronous',
    blurb: `**Switched reluctance (6/4):** three phases on six salient stator poles, four plain steel rotor teeth. A phase is switched on shortly before a rotor pair approaches its poles and off before they line up; its inductance rises as the teeth approach, and the torque is $\\tfrac12 i^2\\,dL/d\\theta$. The model solves each phase's current through its changing inductance with an asymmetric half-bridge ($+V_{dc}$ on, chopping at the current limit, $-V_{dc}$ to switch off), at a speed held by a dynamometer. The graphs show one rotor pole pitch: phase A's inductance and current, and the torque of each phase and their sum.
**Synchronous reluctance:** a 4-pole rotor with flux barriers in a sine-wave field; torque $\\tfrac34 p_p (L_d - L_q) I^2 \\sin 2\\beta$ and a power factor limited by the saliency.

**Try this**
- SRM at 600 rpm: the current is chopped flat at the limit; the three phases' torques overlap into a rippling total.
- Delay the switch-off past alignment (negative angle): current flows while the inductance falls and each phase brakes — the average torque drops; turn on late as well and the total dips below zero.
- Raise the speed to 6000 rpm: the back-EMF term $i\\,\\omega\\,dL/d\\theta$ stops the current reaching the limit; advance the turn-on to 45° to get it in before the teeth meet.
- Switch to synchronous reluctance and sweep β: the torque peaks at 45°, while the power factor is best at a larger angle — never above about 0.75 for a saliency of 7.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const S = { Lmax: 0.040, Lmin: 0.008, R: 1.0, Vdc: 300 }, Y = { pp: 2, Ld: 0.085, Lq: 0.012 };
      let V = null, ang = 0, dirty = true, wave = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Motor', options: [['Switched reluctance, 6/4', 'srm'], ['Synchronous reluctance, 4-pole', 'syn']], value: 'srm' },
        { id: 'n', label: 'Speed (held by a dynamometer)', min: 50, max: 6000, step: 10, value: 600, unit: 'rpm' },
        { id: 'Iref', label: 'Current limit (chopping)', min: 2, max: 20, step: 0.5, value: 10, unit: 'A' },
        { id: 'on', label: 'Turn on, degrees before alignment', min: 15, max: 45, step: 0.5, value: 35, unit: '°' },
        { id: 'off', label: 'Turn off, degrees before alignment', min: -15, max: 20, step: 0.5, value: 6, unit: '°' },
        { id: 'I', label: 'Phase current (peak)', min: 0, max: 30, step: 0.5, value: 21, unit: 'A' },
        { id: 'beta', label: 'Current angle from the d-axis', min: 0, max: 90, step: 1, value: 45, unit: '°' }
      ], () => { dirty = true; showMode(); });
      V = ctl.values;
      function showMode() { const s = V.mode === 'srm'; ['n', 'Iref', 'on', 'off'].forEach(k => ctl.show(k, s)); ['I', 'beta'].forEach(k => ctl.show(k, !s)); }
      showMode();
      const ro = kit.readout(box.side, [['T', 'Average torque'], ['r', 'Ripple · power factor'], ['P', 'Power'], ['x', 'Detail'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'rotor angle (°)' }, y: { label: '' }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'rotor angle (°)' }, y: { label: 'torque (N·m)' }, legend: true }, 170);
      // SRM: signed angle a (°) from phase alignment, in (−45, 45]; inductance and its slope (H/rad)
      const aOf = x => ((x + 45) % 90 + 90) % 90 - 45;
      const Lof = a => S.Lmin + (S.Lmax - S.Lmin) * clamp((31 - Math.abs(a)) / 30, 0, 1);
      const dLof = a => { const u = Math.abs(a); if (u <= 1 || u >= 31) return 0; return -(S.Lmax - S.Lmin) / (30 * D2R) * Math.sign(a); };
      function srmWave() {
        const w = V.n * TAU / 60, step = 0.05, N = Math.round(90 / step), iA = new Float64Array(N + 1);
        let i = 0;
        for (let pass = 0; pass < 3; pass++) {
          for (let k = 0; k <= N; k++) {
            const a = -45 + k * step, on = a >= -V.on && a <= -V.off, L = Lof(a), dL = dLof(a);
            if (pass === 2) iA[k] = i;
            let v = on ? S.Vdc : (i > 0 ? -S.Vdc : 0);
            let di = (v - S.R * i - i * w * dL) / (w * L) * step * D2R;
            i = i + di;
            if (on && i > V.Iref) i = V.Iref;
            if (i < 0) i = 0;
          }
        }
        const Lp = [], Ip = [], TA = [], TB = [], TC = [], Tt = [];
        let sum = 0, tmin = 1e9, tmax = -1e9, cnt = 0, ipk = 0, tAmin = 0;
        const at = a => iA[Math.round((aOf(a) + 45) / step)];
        for (let k = 0; k <= N; k += 20) {
          const a = -45 + k * step, tA = 0.5 * at(a) * at(a) * dLof(aOf(a)), aB = aOf(a - 30), aC = aOf(a + 30);   // B lines up 30° after A, C 60° after
          const tB = 0.5 * at(a - 30) * at(a - 30) * dLof(aB), tC = 0.5 * at(a + 30) * at(a + 30) * dLof(aC), tt = tA + tB + tC;
          Lp.push([a + 45, 1000 * Lof(a)]); Ip.push([a + 45, iA[k]]); TA.push([a + 45, tA]); TB.push([a + 45, tB]); TC.push([a + 45, tC]); Tt.push([a + 45, tt]);
          sum += tt; cnt++; tAmin = Math.min(tAmin, tA); tmin = Math.min(tmin, tt); tmax = Math.max(tmax, tt); ipk = Math.max(ipk, iA[k]);
        }
        return { at, Lp, Ip, TA, TB, TC, Tt, avg: sum / cnt, tmin, tmax, ipk, w, tAmin };
      }
      const loop = kit.loop(dt => {
        const c = frame(st, 660, 270), C = kit.colors();
        if (V.mode === 'srm') {
          if (dirty || !wave) {
            dirty = false; wave = srmWave();
            p1.set({ y: { label: 'phase A: inductance (mH) · current (A)', min: 0 }, series: [{ pts: wave.Lp, label: 'L (mH)', color: kit.colors().muted, dash: [5, 4] }, { pts: wave.Ip, label: 'i (A)', color: phc(0) }], vlines: [{ x: 45, label: 'aligned' }], marks: [] });
            p2.set({ y: { label: 'torque (N·m)' }, series: [{ pts: wave.TA, label: 'A', color: phc(0) }, { pts: wave.TB, label: 'B', color: phc(1) }, { pts: wave.TC, label: 'C', color: phc(2) }, { pts: wave.Tt, label: 'total', color: kit.colors().text }], vlines: [], marks: [] });
            ro.set('T', wave.avg.toFixed(2) + ' N·m');
            ro.set('r', 'ripple ' + (Math.abs(wave.avg) > 1e-3 ? (100 * (wave.tmax - wave.tmin) / Math.abs(wave.avg)).toFixed(0) + ' %' : '—'));
            ro.set('P', (wave.avg * wave.w).toFixed(0) + ' W at ' + V.n + ' rpm');
            ro.set('x', 'peak current ' + wave.ipk.toFixed(1) + ' A; stroke 30°, ' + (12 * V.n / 60).toFixed(0) + ' strokes/s');
            ro.set('st', wave.tAmin < -0.02 ? 'braking: each phase still carries current after alignment' + (wave.tmin < 0 ? ', and the total dips below zero' : '') : wave.ipk < 0.95 * V.Iref ? 'the current cannot reach the limit at this speed — advance the turn-on' : 'chopping at the current limit');
          }
          ang = wrap(ang + Math.min(1, V.n / 600) * dt * 0.6);
          const cx = 150, cy = 135, R = 110, rotDeg = ang / D2R;
          c.lineWidth = R * 0.12; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.94, 0, TAU); c.stroke();
          for (let k = 0; k < 6; k++) {
            const pa = k * 60, ph = [0, 2, 1][k % 3];
            // pole k: A at 0°/180°, C at 60°/240°, B at 120°/300°: going forward the rotor lines up with A, B, C in turn, 30° apart
            const aRel = aOf(rotDeg - pa), iv = wave.at(aRel);
            c.save(); c.translate(cx, cy); c.rotate(-pa * D2R);
            c.fillStyle = C.border2 || C.faint; c.fillRect(R * 0.55, -R * 0.13, R * 0.35, R * 0.26);
            c.fillStyle = phc(ph, 0.12 + 0.8 * clamp(iv / Math.max(1, V.Iref), 0, 1)); c.fillRect(R * 0.62, -R * 0.2, R * 0.22, R * 0.4);
            c.strokeStyle = phc(ph); c.lineWidth = 1.5; c.strokeRect(R * 0.62, -R * 0.2, R * 0.22, R * 0.4);
            c.restore();
            const [lx, ly] = xy(cx, cy, R * 1.08, pa * D2R); txt(c, LET[ph], lx, ly + 4, phc(ph), 'center', 11);
          }
          c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 1.5;
          c.beginPath();
          for (let k = 0; k < 4; k++) {
            const a0 = ang + k * Math.PI / 2;
            const p = (a, r) => xy(cx, cy, r, a);
            const pts = [p(a0 - 0.28, R * 0.3), p(a0 - 0.28, R * 0.53), p(a0 + 0.28, R * 0.53), p(a0 + 0.28, R * 0.3)];
            pts.forEach((q, j) => (k === 0 && j === 0 ? c.moveTo(q[0], q[1]) : c.lineTo(q[0], q[1])));
            const [ex, ey] = p(a0 + Math.PI / 4, R * 0.3); c.lineTo(ex, ey);
          }
          c.closePath(); c.fill(); c.stroke();
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 5, 0, TAU); c.fill();
          txt(c, 'plain steel rotor, 4 teeth; the lit coils carry current', cx, 262, C.muted, 'center', 10);
          // the converter for one phase
          const bx = 360, by = 50;
          txt(c, 'asymmetric half-bridge (one per phase)', bx + 130, by - 18, C.text);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 260, by); c.moveTo(bx, by + 160); c.lineTo(bx + 260, by + 160); c.stroke();
          txt(c, '+' + S.Vdc + ' V', bx - 4, by + 4, C.bad, 'right'); txt(c, '0 V', bx - 4, by + 164, C.accent, 'right');
          const phase0 = wave.at(aOf(rotDeg)), onNow = aOf(rotDeg) >= -V.on && aOf(rotDeg) <= -V.off;
          const box2 = (x, y, lbl, on) => { c.fillStyle = on ? phc(0, 0.8) : C.surface; c.fillRect(x - 22, y - 12, 44, 24); c.strokeStyle = on ? phc(0) : C.muted; c.strokeRect(x - 22, y - 12, 44, 24); txt(c, lbl, x, y + 4, on ? C.text : C.muted, 'center', 10); };
          c.strokeStyle = C.text; c.beginPath(); c.moveTo(bx + 60, by); c.lineTo(bx + 60, by + 160); c.moveTo(bx + 200, by); c.lineTo(bx + 200, by + 160); c.stroke();
          box2(bx + 60, by + 40, 'switch', onNow); box2(bx + 200, by + 120, 'switch', onNow);
          box2(bx + 200, by + 40, 'diode', !onNow && phase0 > 0.01); box2(bx + 60, by + 120, 'diode', !onNow && phase0 > 0.01);
          c.fillStyle = phc(0, 0.2 + 0.7 * clamp(phase0 / Math.max(1, V.Iref), 0, 1)); c.fillRect(bx + 95, by + 68, 70, 24); c.strokeStyle = phc(0); c.strokeRect(bx + 95, by + 68, 70, 24);
          txt(c, 'coil A: ' + phase0.toFixed(1) + ' A', bx + 130, by + 84, C.text, 'center', 11);
          c.beginPath(); c.moveTo(bx + 60, by + 80); c.lineTo(bx + 95, by + 80); c.moveTo(bx + 165, by + 80); c.lineTo(bx + 200, by + 80); c.stroke();
          txt(c, onNow ? 'on: +V across the coil (chopping at the limit)' : phase0 > 0.01 ? 'off: −V through the diodes, current falling' : 'idle', bx + 130, by + 190, C.muted, 'center', 11);
          txt(c, 'rotor drawn slowly', bx + 130, by + 208, C.muted, 'center', 10);
        } else {
          const I = V.I, be = V.beta * D2R, id = I * Math.cos(be), iq = I * Math.sin(be);
          const T = 1.5 * Y.pp * (Y.Ld - Y.Lq) * id * iq, we = Y.pp * 1500 * TAU / 60;
          const vd = -we * Y.Lq * iq, vq = we * Y.Ld * id, vm = Math.hypot(vd, vq), pf = vm > 1e-9 && I > 1e-9 ? (vd * id + vq * iq) / (vm * I) : 0;
          if (dirty) {
            dirty = false;
            const tq = [], pfs = [];
            for (let d = 0; d <= 90; d += 1) { const b = d * D2R, a1 = I * Math.cos(b), a2 = I * Math.sin(b), v1 = -we * Y.Lq * a2, v2 = we * Y.Ld * a1, m2 = Math.hypot(v1, v2); tq.push([d, 1.5 * Y.pp * (Y.Ld - Y.Lq) * a1 * a2]); pfs.push([d, m2 > 1e-9 && I > 0 ? (v1 * a1 + v2 * a2) / (m2 * I) : 0]); }
            p1.set({ x: { label: 'current angle β from the d-axis (°)', min: 0, max: 90 }, y: { label: 'power factor', min: 0, max: 1 }, series: [{ pts: pfs, label: 'power factor' }], vlines: [{ x: V.beta, label: 'β' }], marks: [{ x: V.beta, y: pf }] });
            p2.set({ x: { label: 'current angle β from the d-axis (°)', min: 0, max: 90 }, y: { label: 'torque (N·m)', min: 0 }, series: [{ pts: tq, label: 'torque at ' + I + ' A' }], vlines: [{ x: V.beta, label: 'β' }], marks: [{ x: V.beta, y: T }] });
          }
          ro.set('T', T.toFixed(1) + ' N·m');
          ro.set('r', 'pf ' + pf.toFixed(2) + ' (resistance neglected)');
          ro.set('P', (T * 1500 * TAU / 60 / 1000).toFixed(2) + ' kW at 1500 rpm');
          ro.set('x', 'saliency Ld/Lq = ' + (Y.Ld / Y.Lq).toFixed(1) + '; best pf ' + ((Y.Ld / Y.Lq - 1) / (Y.Ld / Y.Lq + 1)).toFixed(2));
          ro.set('st', Math.abs(V.beta - 45) < 1 ? 'most torque per ampere (unsaturated)' : V.beta > 45 ? 'beyond 45°: less torque, better power factor' : 'below 45°: less torque, mostly magnetising');
          ang = wrap(ang + dt * 0.5);
          const cx = 150, cy = 135, R = 105;
          c.lineWidth = R * 0.12; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.95, 0, TAU); c.stroke();
          c.fillStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.82, 0, TAU); c.fill();
          // flux barriers: arcs across each q-axis
          c.save(); c.beginPath(); c.arc(cx, cy, R * 0.8, 0, TAU); c.clip();
          c.strokeStyle = C.bg2 || '#fff'; c.lineWidth = 5;
          for (let k = 0; k < 4; k++) { const qa = ang + Math.PI / 4 + k * Math.PI / 2; for (let j = 1; j <= 3; j++) { const [bxq, byq] = xy(cx, cy, R * 0.82 + j * 6, qa); c.beginPath(); c.arc(bxq, byq, R * (0.18 + 0.12 * j), -qa + Math.PI - 0.75, -qa + Math.PI + 0.75); c.stroke(); } }
          c.restore();
          c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
          const [dx, dy] = xy(cx, cy, R * 0.9, ang); kitArrow(c, cx, cy, dx, dy, NCOL, 2); txt(c, 'd (easy)', dx + 14, dy, NCOL, 'left', 10);
          const [ix, iy] = xy(cx, cy, R * 0.95 * clamp(I / 30, 0.2, 1), ang + be); kitArrow(c, cx, cy, ix, iy, FIELD, 3.5);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 30, -ang - be, -ang); c.stroke();
          txt(c, 'β', xy(cx, cy, 42, ang + be / 2)[0], xy(cx, cy, 42, ang + be / 2)[1] + 4, C.accent, 'center', 13);
          txt(c, 'rotor with flux barriers; orange: stator current vector', cx, 262, C.muted, 'center', 10);
          txt(c, 'T = ¾ p (Ld − Lq) I² sin 2β', 470, 90, C.text, 'center', 14);
          txt(c, T.toFixed(1) + ' N·m at ' + I + ' A, β = ' + V.beta + '°', 470, 120, C.text);
          txt(c, 'no magnets, no rotor current: a cool rotor', 470, 160, C.muted); txt(c, 'but the stator must magnetise it:', 470, 178, C.muted); txt(c, 'power factor ' + pf.toFixed(2), 470, 196, pf < 0.6 ? C.bad : C.text);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-hysteresis */
  Hyper.sim('bl-hysteresis', {
    title: 'The hysteresis motor: a lagging magnet',
    blurb: `A small 4-pole, 50 Hz hysteresis motor (drawn with two poles): a ring of semi-hard steel (9 cm³) in a rotating field. Each piece of the ring is magnetised by the field (orange) but, because of hysteresis, its magnetisation lags by the angle γ — so the ring's poles (the red and blue pattern) always trail the field by γ while the rotor slips. The B–H plot follows one marked piece of the ring round its loop — drawn as an ideal ellipse whose area is the loop energy $W_h$. The torque $T = p_p V_r W_h / 2\\pi$ does not depend on the slip.

**Try this**
- Press *Start*: the rotor accelerates with a constant torque (a straight speed ramp), the marked piece runs round its loop more and more slowly, and at synchronism it stops on the loop — the ring has become a permanent magnet, locked at whatever angle it arrived.
- Make the loop fatter (a larger $W_h$): more lag, more torque, and more heat in the ring while it slips.
- Choose the heavy flywheel: the run-up is slow but just as smooth — and all the slip energy heats the ring.
- At synchronism raise the load above 100 % of $T_h$: the locked magnet holds up to $T_h/\\sin\\gamma$, then pulls out, and with a load above $T_h$ the rotor slows down and stops.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const pp = 2, f = 50, ws = TAU * f / pp, Vr = 9.05e-6, Bm = 1.0, Hm = 15000, b = 2e-7;
      let V = null, w = 0, locked = false, t = 0, psiF = 0, thR = 0, E = 0, hist = [], lastPlot = -1, dirty = true, running = false;
      const ctl = kit.controls(box.side, [
        { id: 'Wh', label: 'Loop area Wh', min: 8, max: 40, step: 1, value: 20, unit: 'kJ/m³' },
        { id: 'load', label: 'Load torque, % of the hysteresis torque', min: 0, max: 150, step: 1, value: 20, unit: '%' },
        { id: 'J', type: 'select', label: 'Inertia', options: [['Rotor alone (1 × 10⁻⁵ kg·m²)', 1e-5], ['Rotor + gyro wheel (5 × 10⁻⁴)', 5e-4], ['Rotor + heavy flywheel (3 × 10⁻³)', 3e-3]], value: 5e-4 },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Switch off' }] }
      ], id => {
        if (id === 'start') { running = true; w = 0; locked = false; E = 0; hist = []; t = 0; }
        if (id === 'stop') { running = false; locked = false; }
        dirty = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Hysteresis torque · lag γ'], ['po', 'Pull-out when synchronous'], ['n', 'Speed · slip'], ['P', 'Heat in the ring now'], ['E', 'Heat since start'], ['st', 'State']]);
      const p1 = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1600 }, y: { label: 'torque (mN·m)', min: 0 }, legend: true }, 170);
      const p2 = kit.plot(g2, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0, max: 1600 }, legend: false }, 170);
      const loop = kit.loop(dt => {
        const Wh = V.Wh * 1000, Th = pp * Vr * Wh / TAU, sg = clamp(Wh / (Math.PI * Bm * Hm), 0, 0.99), gam = Math.asin(sg), Tpo = Th / sg, TL = V.load / 100 * Th, J = +V.J;
        const n = 40, h = dt / n;
        for (let k = 0; k < n; k++) {
          if (!running) { w = Math.max(0, w - h * (TL + b * w + 1e-4) / J); locked = false; continue; }
          if (locked) { if (TL > Tpo) locked = false; else { w = ws; continue; } }
          const s = 1 - w / ws, T = s > 0 ? Th : -Th;
          const wn = w <= 1e-6 && T <= TL ? 0 : w + h * (T - TL - b * w) / J;   // the load cannot drive the rotor backwards
          E += h * Th * Math.abs(s) * ws;
          if (w < ws && wn >= ws && TL <= Tpo) { w = ws; locked = true; } else w = Math.max(0, wn);
        }
        t += dt;
        if (running || hist.length) { hist.push([t, rpmOf(w)]); while (hist.length > 1200) hist.shift(); }
        const s = 1 - w / ws, Pr = running && !locked ? Th * Math.abs(s) * ws : 0;
        ro.set('T', (Th * 1000).toFixed(1) + ' mN·m · γ = ' + (gam / D2R).toFixed(0) + '°');
        ro.set('po', (Tpo * 1000).toFixed(1) + ' mN·m (= T/sin γ)');
        ro.set('n', rpmOf(w).toFixed(0) + ' rpm · ' + (100 * s).toFixed(1) + ' %');
        ro.set('P', Pr.toFixed(2) + ' W');
        ro.set('E', E.toFixed(1) + ' J (kinetic energy now ' + (0.5 * J * w * w).toFixed(1) + ' J)');
        ro.set('st', !running ? 'off' : locked ? 'synchronous: the ring is a magnet, locked to the field' : TL > Th ? (w < 1 ? 'stalled: the load exceeds the hysteresis torque' : 'pulled out: slowing down under a load above the hysteresis torque') : 'accelerating with constant torque');
        if (dirty || t - lastPlot > 0.25) {
          dirty = false; lastPlot = t;
          const hy = [[0, Th * 1000], [1500, Th * 1000], [1500, Tpo * 1000]], im = [];
          for (let i = 0; i <= 60; i++) { const sl = Math.max(1e-4, 1 - i / 60), Tb = 2.2 * Th, sb = 0.25; im.push([1500 * (1 - sl), 1000 * 2 * Tb / (sl / sb + sb / sl)]); }
          p1.set({ series: [{ pts: hy, label: 'hysteresis motor' }, { pts: im, label: 'induction motor, for comparison', dash: [5, 4], color: kit.colors().muted }], hlines: [{ y: TL * 1000, label: 'load' }], marks: [{ x: rpmOf(w), y: (locked ? TL : running ? Th : 0) * 1000 }] });
          p2.set({ series: [{ pts: hist.slice(), label: 'speed' }], hlines: [{ y: 1500, label: 'synchronous' }] });
        }
        // drawing (visual time: the field turns once in 4 s)
        const c = frame(st, 660, 270), C = kit.colors(), vis = TAU * 0.25;
        psiF = wrap(psiF + (running ? vis : 0) * dt);
        thR = wrap(thR + vis * (w / ws) * dt);
        const cx = 140, cy = 135, R = 110;
        c.lineWidth = R * 0.14; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.93, 0, TAU); c.stroke();
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, R * 0.5, 0, TAU); c.fill();
        const N = 36;
        for (let k = 0; k < N; k++) {
          const ph = k * TAU / N, a = thR + ph, Bv = Math.cos(psiF - a - gam);
          c.fillStyle = (Bv >= 0 ? 'hsl(0 72% 55% / ' : 'hsl(215 72% 55% / ') + (0.15 + 0.8 * Math.abs(Bv)).toFixed(2) + ')';
          c.beginPath(); c.arc(cx, cy, R * 0.78, -a - Math.PI / N, -a + Math.PI / N); c.arc(cx, cy, R * 0.58, -a + Math.PI / N, -a - Math.PI / N, true); c.closePath(); c.fill();
        }
        const [mx, my] = xy(cx, cy, R * 0.68, thR);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 7, 0, TAU); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
        if (running) {
          const [fx, fy] = xy(cx, cy, R * 0.98, psiF); kitArrow(c, cx, cy, fx, fy, FIELD, 3.5);
          const [px, py] = xy(cx, cy, R * 0.72, psiF - gam); c.setLineDash([4, 3]); kitArrow(c, cx, cy, px, py, NCOL, 2); c.setLineDash([]);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, R * 0.35, -psiF, -psiF + gam); c.stroke();
          const [gx, gy] = xy(cx, cy, R * 0.35 + 12, psiF - gam / 2); txt(c, 'γ', gx, gy + 4, C.accent, 'center', 13);
        }
        txt(c, 'field (orange) and ring magnetisation (red N, blue S), drawn slowly', cx, 264, C.muted, 'center', 10);
        // the B–H loop of the marked piece
        const bx = 470, by = 135, sx = 120 / Hm, sy = 95 / Bm;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 140, by); c.lineTo(bx + 140, by); c.moveTo(bx, by - 110); c.lineTo(bx, by + 110); c.stroke();
        txt(c, 'H', bx + 134, by - 6, C.muted); txt(c, 'B', bx + 10, by - 102, C.muted);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 120; i++) { const p = i / 120 * TAU, x = bx + Hm * Math.cos(p) * sx, y = by - Bm * Math.cos(p - gam) * sy; i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        const pm = psiF - thR;
        c.fillStyle = FIELD; c.beginPath(); c.arc(bx + Hm * Math.cos(pm) * sx, by - Bm * Math.cos(pm - gam) * sy, 6, 0, TAU); c.fill();
        txt(c, 'loop area = ' + V.Wh + ' kJ/m³ per cycle', bx, by + 128, C.text, 'center', 11);
        txt(c, locked ? 'synchronous: the point stands still' : running ? 'the marked piece goes round at the slip frequency' : '', bx, 20, C.muted, 'center', 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bl-line-start */
  Hyper.sim('bl-line-start', {
    title: 'A line-start PM motor pulls into step',
    blurb: `A 7.5 kW, 4-pole line-start PM motor switched straight onto 400 V, 50 Hz (a teaching model with typical proportions). While it slips, three torques act: the **cage** torque of an induction motor, the **magnet braking** torque (strongest at low speed) and a **pulsating** torque $T_{po}\\sin\\delta$ as the magnets slide past the field — δ being the angle between field and rotor, which turns at the slip frequency. Near synchronous speed the pulsation slows down and, if the load and inertia allow, pulls the rotor into step. Left graph: speed against time; right graph: the average torques against speed.

**Try this**
- Press *Start* with a fan of 5 × the motor's inertia: the speed rises with a growl (the wobble on the curve), then snaps to 1500 rpm and stays there — no slip.
- Raise the inertia to 15 × or more: the rotor reaches the top of the cage curve but cannot gain the last few per cent within one swing — it fails to synchronise and keeps slipping, with large pulsations.
- Switch to a constant-torque load of 90 % with 10 × inertia: it fails where the fan (whose torque is small until the end of the run-up) still pulls in.
- Look at the cage and magnet losses: every start turns roughly the kinetic energy of the rotor and load into rotor heat.
- With the fan load, read the power: at exactly 1500 rpm the fan takes about 11 % more than at an induction motor's 1450 rpm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const [g1, g2] = plotRow(box, 2);
      const pp = 2, ws = TAU * 50 / pp, Tr = 7500 / ws, Tb = 2.4 * Tr, sb = 0.4, Tm0 = 0.3 * Tr, Tpo = 1.6 * Tr, Jm = 0.03;
      let V = null, w = 0, del = 0, t = 0, running = false, tStart = 0, syncT = null, tNear = 0, heat = 0, hist = [], lastPlot = -1, dirty = true, fieldVis = 0;
      const ctl = kit.controls(box.side, [
        { id: 'loadType', type: 'select', label: 'Load', options: [['Fan (torque ∝ speed²)', 'fan'], ['Constant torque (conveyor, pump with static head)', 'const']], value: 'fan' },
        { id: 'load', label: 'Load at 1500 rpm, % of rated torque', min: 0, max: 120, step: 1, value: 90, unit: '%' },
        { id: 'Jx', label: 'Load inertia, × the motor rotor\'s', min: 0, max: 40, step: 0.5, value: 5 },
        { id: 'slow', type: 'check', label: 'Slow motion (1/5)', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Switch off' }] }
      ], id => {
        if (id === 'start') { running = true; w = 0; del = 0; t = 0; tStart = 0; syncT = null; tNear = 0; heat = 0; hist = []; }
        if (id === 'stop') running = false;
        dirty = true;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed · slip'], ['T', 'Cage · magnet brake · pulsating torque'], ['st', 'State'], ['ru', 'Time to synchronise'], ['H', 'Rotor heat this start · kinetic energy'], ['fan', 'Load power']]);
      const p1 = kit.plot(g1, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0, max: 1650 }, legend: false }, 180);
      const p2 = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'average torque (N·m)' }, legend: true }, 180);
      const loadT = ww => { const T0 = V.load / 100 * Tr; return V.loadType === 'fan' ? T0 * Math.pow(Math.max(0, ww) / ws, 2) : T0; };
      const cage = s => Math.abs(s) < 1e-9 ? 0 : 2 * Tb / (s / sb + sb / s);
      const brake = ww => { const x = Math.max(0, ww) / ws / 0.08, s = 1 - ww / ws; return -Tm0 * 2 * x / (1 + x * x) * clamp(s / 0.1, 0, 1); };
      const loop = kit.loop(dt => {
        const J = Jm * (1 + V.Jx), ts = dt * (V.slow ? 0.2 : 1);
        let Tc = 0, Tbk = 0, Ts = 0;
        if (running) {
          const n = Math.max(1, Math.ceil(ts / 1e-4)), h = ts / n;
          for (let k = 0; k < n; k++) {
            const s = 1 - w / ws;
            Tc = cage(s); Tbk = brake(w); Ts = Tpo * Math.sin(del);
            const Tm = Tc + Tbk + Ts, TL = loadT(w);
            w = w <= 1e-6 && Tm <= TL ? 0 : Math.max(0, w + h * (Tm - TL) / J);
            del += h * pp * (ws - w);
            heat += h * Math.abs(Tc * s * ws) + h * Math.abs(Tbk * w);
          }
          t += ts;
          if (Math.abs(ws - w) < 0.002 * ws) tNear += ts; else tNear = 0;
          if (syncT == null && tNear > 0.3) syncT = t - 0.3;
          if (syncT != null && Math.abs(ws - w) > 0.02 * ws) syncT = null;
          hist.push([t, rpmOf(w)]); while (hist.length > 1500) hist.shift();
        } else { w = Math.max(0, w - ts * (loadT(w) + 2) / J); t += ts; if (w > 0) { hist.push([t, rpmOf(w)]); while (hist.length > 1500) hist.shift(); } }
        const s = 1 - w / ws, KE = 0.5 * J * w * w;
        ro.set('n', rpmOf(w).toFixed(0) + ' rpm · ' + (100 * s).toFixed(2) + ' %');
        ro.set('T', Tc.toFixed(0) + ' · ' + Tbk.toFixed(0) + ' · ' + Ts.toFixed(0) + ' N·m');
        ro.set('st', !running ? 'off' : syncT != null ? 'synchronous at 1500 rpm: no slip, no cage current' : t > 8 ? 'failed to synchronise: slipping with large pulsations and heating — reduce the load or inertia' : 'running up on the cage');
        ro.set('ru', syncT != null ? syncT.toFixed(2) + ' s' : running ? (t > 8 ? 'never' : t.toFixed(1) + ' s …') : '—');
        ro.set('H', (heat / 1000).toFixed(1) + ' kJ · ' + (KE / 1000).toFixed(1) + ' kJ');
        const PL = loadT(w) * w;
        ro.set('fan', (PL / 1000).toFixed(2) + ' kW' + (V.loadType === 'fan' && syncT != null ? ' (at 1450 rpm it would be ' + (PL / 1000 / Math.pow(1500 / 1450, 3)).toFixed(2) + ' kW)' : ''));
        if (dirty || t - lastPlot > 0.15) {
          dirty = false; lastPlot = t;
          const cg = [], bk = [], sum = [], ld = [];
          for (let i = 0; i <= 150; i++) { const ww = ws * i / 150, sl = 1 - ww / ws; cg.push([rpmOf(ww), cage(sl)]); bk.push([rpmOf(ww), brake(ww)]); sum.push([rpmOf(ww), cage(sl) + brake(ww)]); ld.push([rpmOf(ww), loadT(ww)]); }
          p1.set({ series: [{ pts: hist.slice(), label: 'speed' }], hlines: [{ y: 1500, label: 'synchronous' }] });
          p2.set({ series: [{ pts: cg, label: 'cage' }, { pts: bk, label: 'magnet braking' }, { pts: sum, label: 'net average', color: kit.colors().text }, { pts: ld, label: 'load', dash: [5, 4], color: kit.colors().muted }], marks: running ? [{ x: rpmOf(w), y: loadT(w) }] : [] });
        }
        // drawing: the field and the rotor's magnet axis (the angle between them is δ)
        const c = frame(st, 660, 260), C = kit.colors();
        fieldVis = wrap(fieldVis + (running ? TAU * 0.3 : 0) * dt);
        const cx = 140, cy = 130, R = 110, rotA = fieldVis - del;
        c.lineWidth = R * 0.13; c.strokeStyle = C.border2 || C.faint; c.beginPath(); c.arc(cx, cy, R * 0.93, 0, TAU); c.stroke();
        c.fillStyle = C.surface2; c.beginPath(); c.arc(cx, cy, R * 0.8, 0, TAU); c.fill();
        for (let k = 0; k < 28; k++) { const [bx2, by2] = xy(cx, cy, R * 0.72, rotA + k * TAU / 28); c.fillStyle = 'hsl(30 60% 55%)'; c.beginPath(); c.arc(bx2, by2, 4, 0, TAU); c.fill(); }
        [0, 1].forEach(k => {
          c.save(); c.translate(cx, cy); c.rotate(-(rotA + k * Math.PI));
          c.fillStyle = k ? SCOL : NCOL;
          [-1, 1].forEach(sg => { c.save(); c.translate(R * 0.4, sg * 16); c.rotate(sg * 0.6); c.fillRect(-22, -4, 44, 8); c.restore(); });
          c.restore();
        });
        c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 6, 0, TAU); c.fill();
        if (running) { const [fx, fy] = xy(cx, cy, R * 0.98, fieldVis); kitArrow(c, cx, cy, fx, fy, FIELD, 3.5); }
        const [rx, ry] = xy(cx, cy, R * 0.6, rotA); kitArrow(c, cx, cy, rx, ry, C.text, 2);
        txt(c, 'cage bars (copper) and buried magnets; drawn as 2 poles', cx, 256, C.muted, 'center', 10);
        // a torque bar chart
        const bx = 330, bw = 44, by = 130, sc = 90 / (2.5 * Tr);
        const bars = [['cage', Tc, 'hsl(30 70% 50%)'], ['magnet brake', Tbk, SCOL], ['pulsating', Ts, NCOL], ['load', -loadT(w), C.muted]];
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(bx - 10, by); c.lineTo(bx + 4 * (bw + 26), by); c.stroke();
        bars.forEach(([lab, v, col], i) => { const x = bx + i * (bw + 26), hgt = clamp(v * sc, -100, 100); c.fillStyle = col; c.fillRect(x, hgt >= 0 ? by - hgt : by, bw, Math.abs(hgt)); txt(c, lab, x + bw / 2, by + 118, C.muted, 'center', 10); txt(c, v.toFixed(0), x + bw / 2, hgt >= 0 ? by - hgt - 5 : by - hgt + 14, C.text, 'center', 11); });
        txt(c, 'torques on the rotor now (N·m)', bx + 140, 20, C.text);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
