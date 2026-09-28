/* HYPER-MOTORS · sims/starting-vfd.js — starting, protecting and driving AC motors (prefix sd-)
 *   sd-dol             a DOL starter: the start/stop latching circuit, the power circuit, inrush and voltage dip, overload trip
 *   sd-star-delta      a star-delta starter: windings re-connected, timer, open or closed transition and its current spike
 *   sd-starter-compare DOL, star-delta, autotransformer, reactor and soft starter compared on one motor and load
 *   sd-soft-starter    thyristor phase control, ramps, current limit, kick start, bypass, heat, soft stop of a pump (water hammer)
 *   sd-overload        trip classes, a relay's thermal image against the winding temperature, phase loss, blocked cooling, PTC
 *   sd-vfd-inside      rectifier, DC bus, IGBT inverter and PWM; input current harmonics with and without chokes
 *   sd-vf-curve        V/f with boost, quadratic V/f, field weakening and the 87 Hz connection
 *   sd-vector          a load step at low speed: V/f, slip compensation, sensorless vector and closed-loop vector
 *   sd-vfd-ramps       commissioning: ramps, current limit, min/max frequency, stop mode, overcurrent and overvoltage trips
 *   sd-vfd-braking     stopping a heavy fan: stretched ramp, brake resistor, DC injection, regeneration, coasting
 *   sd-vfd-emc         long motor cables (reflected waves) and bearing currents from the common-mode voltage
 *   sd-pump-savings    a pump throttled, bypassed or slowed by a VFD: operating points, power and the annual energy bill
 * The motor in most sims is the 7.5 kW, 400 V, 4-pole cage motor of sims/reference.js (kit.motor.induction).
 */
(function () {
  'use strict';

  const TAU = 2 * Math.PI, SQ3 = Math.sqrt(3);
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // the reference 7.5 kW, 400 V, 50 Hz, 4-pole cage motor (star-equivalent per-phase values), as in sims/reference.js
  const IM = { V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120, deepBar: 1 };
  const TN = 7500 / (1450 * TAU / 60);       // rated torque, 49.4 N·m
  const VPH = 400 / SQ3, WS = TAU * 25;      // phase voltage; synchronous speed at 50 Hz (rad/s)
  const rpmOf = w => w * 60 / TAU, radOf = n => n * TAU / 60;
  let REF = null;
  // the reference motor at 50 Hz and its rated point (slip and current at rated torque)
  function ref(M) {
    if (REF) return REF;
    const im = M.induction(IM);
    let lo = 1e-4, hi = im.sMax;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).T < TN) lo = m; else hi = m; }
    REF = { im, sN: lo, IN: im.at(lo).I1, ILR: im.start.I1, TLR: im.start.T };
    return REF;
  }
  // the motor at 50 Hz and a given speed (rad/s): torque and current on 400 V, and its impedance per phase
  function at50(R, w) {
    const s = clamp(1 - w / WS, 1e-4, 1), o = R.im.at(s), Z = VPH / Math.max(1e-6, o.I1), ph = Math.acos(clamp(o.pf, -1, 1));
    return { s, T: o.T, I: o.I1, zr: Z * Math.cos(ph), zx: Z * Math.sin(ph) };
  }
  // a row of plots under the canvas
  function graphs(box, n) {
    const gb = document.createElement('div');
    gb.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:8px;padding:4px 10px 10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // a rolling history [[t, v], …] of the last `span` seconds
  function push(arr, t, v, span) { arr.push([t, v]); let k = 0; while (k < arr.length && arr[k][0] < t - span) k++; if (k) arr.splice(0, k); }
  // canvas helpers
  function ln(c, x1, y1, x2, y2, col, w) { c.strokeStyle = col; c.lineWidth = w || 2; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function txt(c, s, x, y, col, size, align) { c.fillStyle = col; c.font = (size || 12) + 'px ' + font(); c.textAlign = align || 'center'; c.fillText(s, x, y); }
  // a contact between x1 and x2 on a horizontal wire: blade from a pivot, closed or open; NC contacts carry a stop; pushbuttons an actuator
  function contact(c, x1, x2, y, closed, colIn, colOut, label, o) {
    o = o || {};
    const a = x1 + 9, b = x2 - 9;
    ln(c, x1, y, a, y, colIn); ln(c, b, y, x2, y, colOut);
    c.fillStyle = colIn; c.beginPath(); c.arc(a, y, 2.5, 0, TAU); c.fill();
    c.fillStyle = colOut; c.beginPath(); c.arc(b, y, 2.5, 0, TAU); c.fill();
    const by = closed ? y : y - 13;
    ln(c, a, y, b + (o.nc ? 2 : 0), by, colIn, 2.2);
    if (o.nc) ln(c, b, y, b, y - 7, colOut, 1.5);
    if (o.push) {
      const mx = (a + b) / 2, my = (y + by) / 2;
      c.setLineDash([3, 3]); ln(c, mx, my - 2, mx, y - 26, colIn, 1.2); c.setLineDash([]);
      ln(c, mx - 7, y - 26, mx + 7, y - 26, colIn, 2); ln(c, mx - 7, y - 26, mx - 7, y - 22, colIn, 2); ln(c, mx + 7, y - 26, mx + 7, y - 22, colIn, 2);
    }
    if (label) txt(c, label, (x1 + x2) / 2, y + 17, o.labelCol || colOut, 11);
  }
  function lamp(c, x, y, on, glow, col) {
    if (on) { c.fillStyle = glow; c.globalAlpha = 0.55; c.beginPath(); c.arc(x, y, 14, 0, TAU); c.fill(); c.globalAlpha = 1; }
    c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 9, 0, TAU); c.stroke();
    ln(c, x - 6, y - 6, x + 6, y + 6, col, 1.5); ln(c, x - 6, y + 6, x + 6, y - 6, col, 1.5);
  }
  // heat colour from 0 (cool) to 1 (hot)
  const heat = u => 'hsl(' + (210 - 210 * clamp(u, 0, 1)).toFixed(0) + ' 80% 52%)';

  /* ================================================================ sd-dol */
  Hyper.sim('sd-dol', {
    title: 'A direct-on-line starter',
    blurb: `The classic DOL starter. On the left the control circuit: control fuse F2, Stop button S0 (NC), Start button S1 (NO) with the contactor's own auxiliary contact K1 13–14 across it, the overload relay's NC contact 95–96 and the contactor coil K1; below, the *running* lamp (K1 23–24) and the *tripped* lamp (F1 97–98). Live wiring is drawn in the accent colour. On the right the power circuit: supply transformer, busbar, fuses, the contactor's main contacts, the overload relay's heaters and the motor. Below: line current and voltages against time.

**Try this**
- Press *Start*: the coil pulls in, 13–14 seals it in, and the current leaps to its locked-rotor value — five to six times rated for this motor model — until the motor is near full speed. Note the dip on the busbar and the deeper dip at the motor terminals.
- Choose the 110 kW motor on the 160 kVA transformer with a 200 m cable: the dip becomes severe and the run-up slows, because the torque falls with the square of the voltage.
- Press *Power cut* while running: the contactor drops out and, when the power returns, the motor stays off. That is no-volt release.
- Press *Jam the load*: the motor stalls, draws its locked-rotor current, the overload relay's heaters glow and after some seconds 95–96 opens. Reset only works once the relay has cooled.
- Compare the pump (a start well under a second) with the heavy fan (several seconds at full starting current).`,
    mount(box, kit) {
      const M = kit.motor, S = kit.schem, R = ref(M);
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1, g2] = graphs(box, 2);
      const AREA = { 7.5: 4, 22: 16, 55: 50, 110: 120 };
      const TRAFO = { t160: [160, 0.04], t400: [400, 0.04], t630: [630, 0.06], t1600: [1600, 0.06] };
      const LOADS = {
        pump: { J: 0.1, T: n => (0.08 + 0.8 * Math.pow(n / 1450, 2)) * TN, name: 'centrifugal pump' },
        fan: { J: 3.5, T: n => (0.05 + 0.85 * Math.pow(n / 1450, 2)) * TN, name: 'fan with a heavy wheel' },
        conv: { J: 0.4, T: n => (n < 5 ? 0.9 : 0.7) * TN, name: 'loaded conveyor' }
      };
      let V = null, w = 0, t = 0, K1 = false, supply = true, cutUntil = -1, startUntil = -1, stopUntil = -1, tripped = false, th = 0, jam = false;
      let peakI = 0, minVb = 1, minVm = 1, tStart = -1, runUp = null, ang = 0, flowPh = 0, lastPlot = -1, note = '';
      let I = 0, Vb = 1, Vm = 1, Tm = 0;
      const hI = [], hVb = [], hVm = [];
      const ctl = kit.controls(box.side, [
        { id: 'P', type: 'select', label: 'Motor (400 V, 4-pole)', options: [['7.5 kW', 7.5], ['22 kW', 22], ['55 kW', 55], ['110 kW', 110]], value: 22 },
        { id: 'tr', type: 'select', label: 'Supply transformer', options: [['160 kVA, u_k = 4 %', 't160'], ['400 kVA, u_k = 4 %', 't400'], ['630 kVA, u_k = 6 %', 't630'], ['1600 kVA, u_k = 6 %', 't1600']], value: 't400' },
        { id: 'L', label: 'Cable length to the motor', min: 5, max: 200, step: 5, value: 50, unit: 'm' },
        { id: 'load', type: 'select', label: 'Load', options: [['Centrifugal pump (light)', 'pump'], ['Fan with a heavy wheel', 'fan'], ['Loaded conveyor (constant torque)', 'conv']], value: 'fan' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start (S1)', primary: true }, { id: 'stop', label: 'Stop (S0)' }] },
        { type: 'buttons', items: [{ id: 'jam', label: 'Jam / free the load' }, { id: 'cut', label: 'Power cut' }, { id: 'reset', label: 'Reset overload' }] }
      ], id => {
        if (id === 'start') startUntil = t + 0.4;
        if (id === 'stop') stopUntil = t + 0.4;
        if (id === 'jam') jam = !jam;
        if (id === 'cut') { supply = false; cutUntil = t + 1.5; }
        if (id === 'reset') { if (tripped && th < 1) { tripped = false; note = ''; } else if (tripped) note = 'relay still hot — wait for it to cool'; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Speed'], ['I', 'Line current'], ['vb', 'Busbar voltage'], ['vm', 'Motor terminal voltage'], ['pk', 'Since Start: peak current, deepest dips'], ['ru', 'Run-up time'], ['ol', 'Overload relay (class 10)'], ['st', 'State']]);
      const pI = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'line current (A)', min: 0 }, legend: true }, 180);
      const pV = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'voltage (% of 400 V)', min: 60, max: 102 }, legend: true }, 180);
      kit.click(st, p => {
        const s = Math.min(st.W / 760, st.H / 300), x = (p.x - (st.W - 760 * s) / 2) / s, y = (p.y - (st.H - 300 * s) / 2) / s;
        if (y > 30 && y < 80 && x > 150 && x < 210) startUntil = t + 0.4;
        if (y > 30 && y < 80 && x > 88 && x < 142) stopUntil = t + 0.4;
      }, p => { const s = Math.min(st.W / 760, st.H / 300), x = (p.x - (st.W - 760 * s) / 2) / s, y = (p.y - (st.H - 300 * s) / 2) / s; return y > 30 && y < 80 && x > 88 && x < 210; });

      const loop = kit.loop(dt => {
        t += dt;
        if (cutUntil > 0 && t >= cutUntil) { supply = true; cutUntil = -1; }
        const startDown = t < startUntil, stopDown = t < stopUntil;
        const wasOn = K1;
        K1 = supply && !stopDown && !tripped && (startDown || K1);        // the latching rung
        if (K1 && !wasOn) { tStart = t; peakI = 0; minVb = 1; minVm = 1; runUp = null; }
        const sc = V.P / 7.5, ld = LOADS[V.load], J = ld.J * sc, IN = R.IN * sc;
        const [kva, uk] = TRAFO[V.tr], zt = uk * 400 * 400 / (kva * 1000), A = AREA[V.P];
        const tr = 0.2 * zt, tx = 0.98 * zt, cr = 0.0175 * V.L / A, cx = 0.08e-3 * V.L;
        const sub = 20, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          if (K1) {
            const o = at50(R, w), zr = o.zr / sc, zx = o.zx / sc;
            const tot = Math.hypot(zr + cr + tr, zx + cx + tx);
            I = VPH / tot; Vm = I * Math.hypot(zr, zx) / VPH; Vb = I * Math.hypot(zr + cr, zx + cx) / VPH;
            Tm = sc * o.T * Vm * Vm;
          } else { I = 0; Tm = 0; Vb = supply ? 1 : 0; Vm = 0; }
          const TL = jam ? 3.5 * TN * sc : ld.T(rpmOf(w)) * sc;
          w = clamp(w + h * (Tm - TL) / J, 0, WS);                         // a load cannot drive the shaft backwards
          const x = I / IN;
          th = Math.max(0, th + h * (x * x - th) / 310);                   // class 10 thermal image: 8 s at 7.2 × from cold
          if (th >= 1.3225 && !tripped) { tripped = true; K1 = false; }
        }
        if (K1) {
          peakI = Math.max(peakI, I); minVb = Math.min(minVb, Vb); minVm = Math.min(minVm, Vm);
          if (runUp == null && t - tStart > 0.05 && I < 1.5 * IN) runUp = t - tStart;
        }
        const n = rpmOf(w);
        push(hI, t, I, 20); push(hVb, t, 100 * Vb, 20); push(hVm, t, 100 * (K1 ? Vm : Vb), 20);
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('I', I.toFixed(0) + ' A = ' + (I / IN).toFixed(1) + ' × rated (' + IN.toFixed(0) + ' A)');
        ro.set('vb', (400 * Vb).toFixed(0) + ' V (' + (100 * (Vb - 1)).toFixed(1) + ' %)');
        ro.set('vm', K1 ? (400 * Vm).toFixed(0) + ' V (' + (100 * (Vm - 1)).toFixed(1) + ' %)' : 'motor off');
        ro.set('pk', tStart >= 0 ? peakI.toFixed(0) + ' A; busbar −' + (100 * (1 - minVb)).toFixed(1) + ' %, motor −' + (100 * (1 - minVm)).toFixed(1) + ' %' : 'press Start');
        ro.set('ru', runUp != null ? runUp.toFixed(2) + ' s' : K1 ? (jam ? 'stalled' : (t - tStart).toFixed(1) + ' s …') : '—');
        ro.set('ol', tripped ? 'TRIPPED — 95–96 open' + (note ? ', ' + note : '') : 'thermal image ' + (100 * th / 1.3225).toFixed(0) + ' % of trip');
        ro.set('st', !supply ? 'power cut — contactor dropped out' : K1 ? (jam ? 'running into a jam' : 'running') : tripped ? 'stopped by the overload relay' : 'stopped (press Start)');
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          pI.set({ x: { label: 'time (s)', min: t - 20, max: t }, series: [{ pts: hI.slice(), label: 'line current' }], hlines: [{ y: IN, label: 'rated' }] });
          pV.set({ x: { label: 'time (s)', min: t - 20, max: t }, series: [{ pts: hVb.slice(), label: 'busbar' }, { pts: hVm.slice(), label: 'motor terminals', dash: [5, 3] }] });
        }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), sc2 = Math.min(st.W / 760, st.H / 300);
        c.save(); c.translate((st.W - 760 * sc2) / 2, (st.H - 300 * sc2) / 2); c.scale(sc2, sc2);
        const live = C.accent, dead = C.muted, col = on => on ? live : dead;
        // control circuit
        txt(c, 'Control circuit (230 V AC)', 190, 16, C.text, 13);
        ln(c, 30, 40, 30, 250, col(supply), 3); ln(c, 350, 40, 350, 250, C.text, 3);
        txt(c, 'L', 30, 34, C.text, 12); txt(c, 'N', 350, 34, C.text, 12);
        const aLive = supply && !stopDown, bLive = aLive && (startDown || K1), cLive = bLive && !tripped;
        ln(c, 30, 70, 48, 70, col(supply)); c.strokeStyle = col(supply); c.lineWidth = 1.5; c.strokeRect(48, 64, 30, 12); ln(c, 48, 70, 78, 70, col(supply), 1);
        txt(c, 'F2', 63, 90, C.muted, 11);
        ln(c, 78, 70, 88, 70, col(supply));
        contact(c, 88, 142, 70, !stopDown, col(supply), col(aLive), 'S0 stop', { nc: true, push: true });
        ln(c, 142, 70, 155, 70, col(aLive));
        contact(c, 155, 205, 70, startDown, col(aLive), col(bLive), 'S1 start', { push: true });
        ln(c, 155, 70, 155, 118, col(aLive)); ln(c, 205, 118, 205, 70, col(bLive));
        contact(c, 155, 205, 118, K1, col(aLive), col(bLive), 'K1 13–14');
        ln(c, 205, 70, 222, 70, col(bLive));
        contact(c, 222, 268, 70, !tripped, col(bLive), col(cLive), 'F1 95–96', { nc: true });
        ln(c, 268, 70, 285, 70, col(cLive));
        c.fillStyle = K1 ? 'hsl(215 80% 55% / .35)' : C.surface; c.fillRect(285, 60, 30, 20); c.strokeStyle = col(cLive); c.lineWidth = 2; c.strokeRect(285, 60, 30, 20);
        txt(c, 'K1', 300, 95, C.text, 11); txt(c, 'A1', 280, 56, C.muted, 9); txt(c, 'A2', 322, 56, C.muted, 9);
        ln(c, 315, 70, 350, 70, C.text);
        // lamps
        ln(c, 30, 170, 60, 170, col(supply)); contact(c, 60, 110, 170, K1, col(supply), col(supply && K1), 'K1 23–24');
        ln(c, 110, 170, 290, 170, col(supply && K1)); lamp(c, 300, 170, supply && K1, '#35d07f', C.text); ln(c, 309, 170, 350, 170, C.text);
        txt(c, 'H1 running', 300, 195, C.muted, 11);
        ln(c, 30, 230, 60, 230, col(supply)); contact(c, 60, 110, 230, tripped, col(supply), col(supply && tripped), 'F1 97–98');
        ln(c, 110, 230, 290, 230, col(supply && tripped)); lamp(c, 300, 230, supply && tripped, '#ff5050', C.text); ln(c, 309, 230, 350, 230, C.text);
        txt(c, 'H2 tripped', 300, 255, C.muted, 11);
        // power circuit
        txt(c, 'Power circuit (400 V)', 590, 16, C.text, 13);
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(452, 40, 11, 0, TAU); c.stroke(); c.beginPath(); c.arc(466, 40, 11, 0, TAU); c.stroke();
        txt(c, kva + ' kVA', 459, 66, C.muted, 11);
        ln(c, 477, 40, 700, 40, supply ? C.text : C.faint, 3);
        txt(c, 'busbar ' + (400 * Vb).toFixed(0) + ' V', 700, 32, Vb < 0.95 ? C.bad : C.muted, 11, 'right');
        const xs = [560, 595, 630];
        for (let k = 0; k < 3; k++) {
          const x = xs[k], lv = supply;
          ln(c, x, 40, x, 72, col(lv)); c.strokeStyle = col(lv); c.lineWidth = 1.5; c.strokeRect(x - 5, 72, 10, 22); ln(c, x, 94, x, 112, col(lv));
          // main contact
          ln(c, x, 112, x, 116, col(lv)); ln(c, x, 116, K1 ? x : x - 11, 140, col(lv), 2.4); ln(c, x, 140, x, 160, col(lv && K1));
          c.fillStyle = heat(th / 1.3225); c.fillRect(x - 6, 160, 12, 22); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x - 6, 160, 12, 22);
          ln(c, x, 182, x, 232, col(lv && K1));
          ln(c, x, 232, 595 + (k - 1) * 12, 246, col(lv && K1));
        }
        c.setLineDash([4, 3]); ln(c, 548, 128, 642, 128, C.muted, 1); c.setLineDash([]);
        txt(c, 'fuses', 660, 88, C.muted, 11, 'left'); txt(c, 'K1 main contacts', 650, 132, C.muted, 11, 'left');
        txt(c, 'F1 heaters', 650, 176, C.muted, 11, 'left'); txt(c, V.L + ' m, ' + AREA[V.P] + ' mm²', 650, 212, C.muted, 11, 'left');
        if (K1) { flowPh += dt * 6 * I / Math.max(1, R.IN * V.P / 7.5); for (const x of xs) S.flow(c, [[x, 44], [x, 232]], flowPh, { color: C.warn }); }
        // motor
        ang += w * dt / 20;
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(595, 268, 24, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        txt(c, 'M', 595, 266, C.text, 13); txt(c, '3~', 595, 280, C.text, 10);
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(595, 268, 30, ang, ang + 1.2); c.stroke();
        txt(c, V.P + ' kW · ' + LOADS[V.load].name + (jam ? ' — JAMMED' : ''), 628, 290, jam ? C.bad : C.muted, 11, 'left');
        // current bar
        const IN2 = R.IN * V.P / 7.5, fr = clamp(I / (7 * IN2), 0, 1);
        c.fillStyle = C.faint; c.fillRect(400, 230, 12, -150); c.fillStyle = I > 2 * IN2 ? C.bad : C.accent; c.fillRect(400, 230, 12, -150 * fr);
        txt(c, 'I', 406, 244, C.muted, 11); txt(c, '7×', 406, 74, C.muted, 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- loads shared by the starting sims (7.5 kW scale) */
  const START_LOADS = {
    fan: { name: 'fan (torque ∝ speed²)', J: 1.5, T: (n, L) => (0.05 + L * Math.pow(n / 1450, 2)) * TN },
    pump: { name: 'centrifugal pump', J: 0.15, T: (n, L) => ((n < 5 ? 0.15 : 0.03) + L * Math.pow(n / 1450, 2)) * TN },
    conv: { name: 'conveyor (constant torque)', J: 0.4, T: (n, L) => (n < 5 ? 1.15 : 1) * L * TN }
  };
  // the transient line current when a spinning motor is reconnected in delta: the supply meets the motor's own
  // (decaying, slipping, 30°-shifted) voltage; the difference drives about I_LR × |1 − a e^{jδ}|
  function transitionSpike(R, w, gap, closed) {
    const a = closed ? 1 / SQ3 : (1 / SQ3) * (w / WS) * Math.exp(-gap / 0.3);
    const d = -Math.PI / 6 - (closed ? 0 : TAU * 50 * (1 - w / WS) * gap);
    return R.ILR * Math.hypot(1 - a * Math.cos(d), a * Math.sin(d)) * (closed ? 0.5 : 1);
  }

  /* ================================================================ sd-star-delta */
  Hyper.sim('sd-star-delta', {
    title: 'A star-delta starter',
    blurb: `A 7.5 kW, 400 V Δ motor started in star. KM1 feeds U1, V1, W1; KM3 joins U2, V2, W2 into a star point; after the timer, KM3 opens and KM2 closes the delta (U1–W2, V1–U2, W1–V2). The windings are drawn in the shape they are connected in, lit by the current they carry. The left graph is the line current against time, the right one the motor's torque–speed curves in delta and in star (a third of it) with the load.

**Try this**
- Press *Start* with the fan: in star the current is a third of the DOL value; the motor runs up to near full speed and the switch to delta costs a short spike.
- Shorten the timer to 1 s: the motor switches while still slow and the current is almost the DOL current — nothing saved.
- Choose the conveyor at 90 % load: the star curve cannot carry it, the motor hangs at low speed, and the delta switch is a DOL start in disguise.
- Compare the open and the closed transition: in the open one the motor is disconnected for 50 ms, its field slips out of step with the supply, and the reconnection spike is larger. (The spike is an estimate from that phase difference.)`,
    mount(box, kit) {
      const M = kit.motor, R = ref(M);
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const [g1, g2] = graphs(box, 2);
      let V = null, w = 0, t = 0, stage = 'off', tStage = 0, tStart = 0, spike = 0, tSw = -1, peakY = 0, peakTr = 0, runUp = null, ang = 0, lastPlot = -1, I = 0, T = 0, wSw = 0;
      const hI = [];
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Load', options: [['Fan (torque ∝ speed²)', 'fan'], ['Conveyor (constant torque)', 'conv']], value: 'fan' },
        { id: 'L', label: 'Load torque, % of rated (fan: at full speed)', min: 10, max: 110, step: 1, value: 90, unit: '%' },
        { id: 'timer', label: 'Star time (timer)', min: 0.5, max: 15, step: 0.5, value: 4, unit: 's' },
        { id: 'trans', type: 'select', label: 'Transition', options: [['Open (50 ms gap)', 'open'], ['Closed (transition resistors)', 'closed']], value: 'open' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => {
        if (id === 'start') { stage = 'star'; tStage = t; tStart = t; w = 0; peakY = 0; peakTr = 0; runUp = null; tSw = -1; hI.length = 0; }
        if (id === 'stop') stage = 'off';
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['stg', 'Stage'], ['n', 'Speed'], ['I', 'Line current'], ['y', 'Star stage: peak current, torque at start'], ['tr', 'Transition: speed, current spike'], ['ss', 'Where the star curve meets the load'], ['ru', 'Run-up (to 1.5 × rated current in delta)']]);
      const pI = kit.plot(g1, { x: { label: 'time since Start (s)', min: 0 }, y: { label: 'line current (A)', min: 0 }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 190);
      const ld = () => START_LOADS[V.load], TL = n => ld().T(n, V.L / 100);
      // the speed where the star curve can no longer accelerate the load
      const starStall = () => { for (let i = 0; i <= 300; i++) { const ww = WS * i / 300; if (at50(R, ww).T / 3 < TL(rpmOf(ww))) return rpmOf(ww); } return 1500; };
      const loop = kit.loop(dt => {
        t += dt;
        const J = ld().J, sub = 20, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const ts = t - tStage;
          if (stage === 'star' && ts >= V.timer) { stage = 'gap'; tStage = t; wSw = w; }
          if (stage === 'gap' && t - tStage >= 0.05) { stage = 'delta'; tStage = t; tSw = t; spike = transitionSpike(R, w, 0.05, V.trans === 'closed'); peakTr = 0; }
          const o = at50(R, w);
          if (stage === 'star') { I = o.I / 3; T = o.T / 3; }
          else if (stage === 'gap') { if (V.trans === 'closed') { I = o.I / 3 * 1.1; T = o.T / 4; } else { I = 0; T = 0; } }
          else if (stage === 'delta') { const e = spike * Math.exp(-(t - tSw) / 0.03); I = Math.hypot(o.I, e); T = o.T; }
          else { I = 0; T = 0; }
          w = clamp(w + h * (T - TL(rpmOf(w))) / J, 0, WS);
        }
        if (stage === 'star') peakY = Math.max(peakY, I);
        if (stage === 'delta') { peakTr = Math.max(peakTr, I); if (runUp == null && I < 1.5 * R.IN && t - tSw > 0.1) runUp = t - tStart; }
        if (stage !== 'off') push(hI, t - tStart, I, 1e9);
        const n = rpmOf(w), ss = starStall();
        ro.set('stg', stage === 'off' ? 'off' : stage === 'star' ? 'STAR (KM1 + KM3), ' + Math.max(0, V.timer - (t - tStage)).toFixed(1) + ' s left' : stage === 'gap' ? (V.trans === 'open' ? 'open transition: disconnected' : 'closed transition: resistors (KM4)') : 'DELTA (KM1 + KM2)');
        ro.set('n', n.toFixed(0) + ' rpm');
        ro.set('I', I.toFixed(1) + ' A = ' + (I / R.IN).toFixed(1) + ' × rated; DOL would draw ' + at50(R, w).I.toFixed(0) + ' A');
        ro.set('y', peakY.toFixed(1) + ' A, ' + (R.TLR / 3).toFixed(0) + ' N·m (DOL ' + R.ILR.toFixed(0) + ' A, ' + R.TLR.toFixed(0) + ' N·m)');
        ro.set('tr', tSw >= 0 ? rpmOf(wSw).toFixed(0) + ' rpm, peak ' + peakTr.toFixed(0) + ' A = ' + (peakTr / R.IN).toFixed(1) + ' × rated' : '—');
        ro.set('ss', ss >= 1499 ? 'it accelerates all the way' : 'at about ' + ss.toFixed(0) + ' rpm (' + (100 * ss / 1500).toFixed(0) + ' % of synchronous)');
        ro.set('ru', runUp != null ? runUp.toFixed(1) + ' s' : '—');
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          const cd = [], cy = [], cl = [];
          for (let i = 0; i <= 150; i++) { const ww = WS * i / 150, o = at50(R, ww), nn = rpmOf(ww); cd.push([nn, o.T]); cy.push([nn, o.T / 3]); cl.push([nn, TL(nn)]); }
          pT.set({ series: [{ pts: cd, label: 'delta (DOL)' }, { pts: cy, label: 'star (÷ 3)' }, { pts: cl, label: 'load', color: kit.colors().muted, dash: [5, 4] }], marks: stage === 'off' ? [] : [{ x: n, y: T, label: 'now' }] });
          const tmax = Math.max(8, V.timer + 4, hI.length ? hI[hI.length - 1][0] : 0);
          pI.set({ x: { label: 'time since Start (s)', min: 0, max: tmax }, series: [{ pts: hI.slice(), label: 'line current' }], hlines: [{ y: R.ILR, label: 'DOL start' }, { y: R.IN, label: 'rated' }] });
        }
        // ---- drawing: the windings in their present connection
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 270);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 270 * s) / 2); c.scale(s, s);
        const star = stage === 'star' || stage === 'off' || (stage === 'gap' && false), delta = stage === 'delta';
        const cx = 170, cy = 145, Iw = delta ? I / SQ3 : I, glow = clamp(Iw / 40, 0, 1);
        const coilCol = 'hsl(22 90% ' + (40 + 25 * glow).toFixed(0) + '% / ' + (0.3 + 0.7 * glow).toFixed(2) + ')';
        const angs = [-Math.PI / 2, Math.PI / 6, 5 * Math.PI / 6], names = ['U', 'V', 'W'];
        const coil = (x1, y1, x2, y2, lab1, lab2) => {
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, a = Math.atan2(y2 - y1, x2 - x1);
          ln(c, x1, y1, x2, y2, C.text, 2);
          c.save(); c.translate(mx, my); c.rotate(a); c.fillStyle = coilCol; c.fillRect(-22, -8, 44, 16); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(-22, -8, 44, 16); c.restore();
          txt(c, lab1, x1 + (x1 - mx) * 0.12, y1 + (y1 - my) * 0.12 + 4, C.muted, 10); txt(c, lab2, x2 + (x2 - mx) * 0.12, y2 + (y2 - my) * 0.12 + 4, C.muted, 10);
        };
        if (!delta) {
          for (let k = 0; k < 3; k++) {
            const ox = cx + 95 * Math.cos(angs[k]), oy = cy + 95 * Math.sin(angs[k]), ix = cx + (stage === 'gap' ? 22 : 6) * Math.cos(angs[k]), iy = cy + (stage === 'gap' ? 22 : 6) * Math.sin(angs[k]);
            coil(ox, oy, ix, iy, names[k] + '1', names[k] + '2');
          }
          if (stage !== 'gap') { c.fillStyle = C.text; c.beginPath(); c.arc(cx, cy, 4, 0, TAU); c.fill(); txt(c, 'star point (KM3)', cx + 60, cy + 80, C.muted, 11); }
        } else {
          const P = angs.map(a => [cx + 95 * Math.cos(a), cy + 95 * Math.sin(a)]);
          coil(P[0][0], P[0][1], P[1][0], P[1][1], 'U1', 'U2');
          coil(P[1][0], P[1][1], P[2][0], P[2][1], 'V1', 'V2');
          coil(P[2][0], P[2][1], P[0][0], P[0][1], 'W1', 'W2');
        }
        for (let k = 0; k < 3; k++) {
          const ox = cx + 95 * Math.cos(angs[k]), oy = cy + 95 * Math.sin(angs[k]);
          const lx = cx + 125 * Math.cos(angs[k]), ly = cy + 125 * Math.sin(angs[k]);
          ln(c, lx, ly, ox, oy, stage === 'off' || (stage === 'gap' && V.trans === 'open') ? C.faint : C.accent, 2.5);
          txt(c, 'L' + (k + 1), lx + 12 * Math.cos(angs[k]), ly + 12 * Math.sin(angs[k]) + 4, C.text, 12);
        }
        // contactors and timer
        const box3 = (x, y, lab, on, sub2) => { c.fillStyle = on ? 'hsl(215 80% 55% / .35)' : C.surface; c.fillRect(x, y, 90, 30); c.strokeStyle = on ? C.accent : C.muted; c.lineWidth = 2; c.strokeRect(x, y, 90, 30); txt(c, lab, x + 45, y + 14, C.text, 12); txt(c, sub2, x + 45, y + 26, C.muted, 10); };
        const on1 = stage !== 'off';
        box3(360, 30, 'KM1 main', on1, '0.58 × I_n'); box3(360, 72, 'KM3 star', stage === 'star', '0.33 × I_n');
        box3(360, 114, 'KM2 delta', stage === 'delta', '0.58 × I_n'); box3(360, 156, 'KM4 + resistors', stage === 'gap' && V.trans === 'closed', 'closed transition');
        const tf = stage === 'star' ? clamp((t - tStage) / V.timer, 0, 1) : stage === 'off' ? 0 : 1;
        c.fillStyle = C.faint; c.fillRect(360, 204, 90, 10); c.fillStyle = C.warn; c.fillRect(360, 204, 90 * tf, 10);
        txt(c, 'timer ' + V.timer.toFixed(1) + ' s', 405, 230, C.muted, 11);
        // rotor
        ang += w * dt / 25;
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(590, 110, 48, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        for (let k = 0; k < 8; k++) { const a = ang + k * TAU / 8; c.fillStyle = C.muted; c.beginPath(); c.arc(590 + 36 * Math.cos(a), 110 + 36 * Math.sin(a), 5, 0, TAU); c.fill(); }
        txt(c, rpmOf(w).toFixed(0) + ' rpm', 590, 182, C.text, 13); txt(c, 'rotor drawn 25 × slower', 590, 198, C.muted, 10);
        const fr = clamp(I / (R.ILR * 1.3), 0, 1);
        c.fillStyle = C.faint; c.fillRect(520, 222, 150, 10); c.fillStyle = I > 2 * R.IN ? C.bad : C.accent; c.fillRect(520, 222, 150 * fr, 10);
        txt(c, 'line current ' + I.toFixed(0) + ' A', 595, 248, C.muted, 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-starter-compare */
  // one run-up with a given starting method; returns the path and a summary. Methods: dol, yd, auto (k), reactor (k), soft (current limit)
  function runUp(R, method, opt, load, L) {
    const ld = START_LOADS[load], TL = n => ld.T(n, L), J = ld.J, dt = 0.002, IN = R.IN;
    const z0 = at50(R, 0), Z0 = Math.hypot(z0.zr, z0.zx);
    const Xr = method === 'reactor' ? Math.max(0, Math.sqrt(Z0 * Z0 / (opt * opt) - z0.zr * z0.zr) - z0.zx) : 0;
    // torque and line current of the method's first stage at speed w
    const stage1 = w => {
      const o = at50(R, w);
      if (method === 'dol') return { I: o.I, T: o.T };
      if (method === 'yd') return { I: o.I / 3, T: o.T / 3 };
      if (method === 'auto') return { I: opt * opt * o.I, T: opt * opt * o.T };
      if (method === 'reactor') { const Ir = VPH / Math.hypot(o.zr, o.zx + Xr), v = Ir * Math.hypot(o.zr, o.zx) / VPH; return { I: Ir, T: v * v * o.T }; }
      const f = Math.min(1, opt * IN / o.I); return { I: f * o.I, T: f * f * o.T, full: f >= 1 };
    };
    // where the first stage stops accelerating
    let wEnd = WS; for (let i = 0; i <= 300; i++) { const ww = WS * i / 300 * 0.999; if (stage1(ww).T < TL(rpmOf(ww))) { wEnd = ww; break; } }
    const path = [], t0 = [];
    let w = 0, t = 0, second = method === 'dol', swAt = -1, peak = 0, stall = false, idle = 0, spikeI = 0, tSw = 0;
    while (t < 60) {
      let I, T;
      if (!second) {
        const o = stage1(w); I = o.I; T = o.T;
        if ((method === 'soft' && o.full && w > 0.85 * WS) || (method !== 'soft' && w >= 0.95 * wEnd) || idle > 1.5) { second = true; swAt = w; tSw = t; if (method === 'yd') spikeI = transitionSpike(R, w, 0.05, false); }
      }
      if (second) { const o = at50(R, w); I = spikeI ? Math.hypot(o.I, spikeI * Math.exp(-(t - tSw) / 0.03)) : o.I; T = o.T; }
      const acc = (T - TL(rpmOf(w))) / J;
      const w2 = clamp(w + dt * acc, 0, WS);
      idle = w2 - w < 1e-5 ? idle + dt : 0;
      w = w2; t += dt; peak = Math.max(peak, I);
      path.push([t, w, I, T]);
      if (second && I < 1.5 * IN && t - tSw > 0.1) break;
      if (second && idle > 3) { stall = true; break; }
    }
    const s0 = stage1(0);
    return { path, peak, I0: s0.I, T0: s0.T, time: t, stall, swAt, wEnd };
  }

  Hyper.sim('sd-starter-compare', {
    title: 'Five ways to start a motor',
    blurb: `The same 7.5 kW, 400 V motor and load started five ways: direct on line, star-delta, an autotransformer, a series reactor and a soft starter with a current limit. The graphs show the line current and the motor torque against speed for the chosen method (solid) and for DOL (dashed), with the load; the table ranks all five for the present load. The picture replays the run-up in real time.

**Try this**
- Compare the autotransformer on its 65 % tap with the reactor at 65 %: the same starting torque (0.65² = 42 % of DOL), but the reactor's line current is 1.5 times higher. Watch the reactor's current curve rise towards the DOL curve as the motor speeds up — its voltage recovers by itself.
- Choose the conveyor at 80 % load: star-delta and the low autotransformer tap cannot start it (they "stall" and switch at low speed), while the 80 % tap and a soft starter at 4–5 × can.
- Lower the soft starter's current limit until the conveyor will not break away: torque falls with the square of the current.
- With the fan every method starts; the star-delta transition spike is the price of its low starting current.`,
    mount(box, kit) {
      const M = kit.motor, R = ref(M);
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      const tb = document.createElement('div'); tb.style.cssText = 'padding:0 10px 10px'; box.stage.appendChild(tb);
      const table = kit.table(tb, [{ label: 'Method', key: 'm', align: 'left' }, { label: 'Line current at start', key: 'i0' }, { label: 'Peak line current', key: 'pk' }, { label: 'Starting torque', key: 't0' }, { label: 'Full voltage from', key: 'sw' }, { label: 'Run-up', key: 'ru' }], {});
      let V = null, res = null, all = null, t = 0, ang = 0, dirty = true;
      const NAMES = { dol: 'Direct on line', yd: 'Star-delta', auto: 'Autotransformer', reactor: 'Series reactor', soft: 'Soft starter' };
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Starting method', options: Object.entries(NAMES).map(([k, v]) => [v, k]), value: 'auto' },
        { id: 'tap', type: 'select', label: 'Autotransformer tap', options: [['50 %', 0.5], ['65 %', 0.65], ['80 %', 0.8]], value: 0.65 },
        { id: 'kr', label: 'Reactor: motor voltage at standstill', min: 40, max: 90, step: 1, value: 65, unit: '%' },
        { id: 'lim', label: 'Soft starter current limit', min: 1.5, max: 5, step: 0.1, value: 3.5, unit: '× I_n' },
        { id: 'load', type: 'select', label: 'Load', options: [['Fan (torque ∝ speed²)', 'fan'], ['Centrifugal pump', 'pump'], ['Conveyor (constant torque)', 'conv']], value: 'fan' },
        { id: 'L', label: 'Load torque, % of rated (fan and pump: at full speed)', min: 10, max: 110, step: 1, value: 80, unit: '%' }
      ], () => { dirty = true; });
      V = ctl.values;
      const show = () => { ctl.show('tap', V.m === 'auto'); ctl.show('kr', V.m === 'reactor'); ctl.show('lim', V.m === 'soft'); };
      show();
      const ro = kit.readout(box.side, [['i', 'Line current at start'], ['tq', 'Starting torque'], ['pk', 'Peak line current'], ['ru', 'Run-up time']]);
      const pI = kit.plot(g1, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'line current (A)', min: 0 }, legend: true }, 190);
      const pT = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 1500 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 190);
      const opt = m => m === 'auto' ? V.tap : m === 'reactor' ? V.kr / 100 : m === 'soft' ? V.lim : 0;
      const fmtRun = r => r.stall ? 'stalls at ' + rpmOf(r.path[r.path.length - 1][1]).toFixed(0) + ' rpm' : r.time.toFixed(2) + ' s';
      const recompute = () => {
        show();
        const L = V.L / 100;
        res = runUp(R, V.m, opt(V.m), V.load, L);
        const dol = runUp(R, 'dol', 0, V.load, L);
        all = Object.keys(NAMES).map(k => { const r = k === V.m ? res : k === 'dol' ? dol : runUp(R, k, opt(k), V.load, L); return { m: NAMES[k] + (k === 'auto' ? ' ' + Math.round(100 * opt(k)) + ' %' : k === 'reactor' ? ' ' + Math.round(100 * opt(k)) + ' %' : k === 'soft' ? ' ' + opt(k).toFixed(1) + ' ×' : ''), i0: (r.I0 / R.IN).toFixed(1) + ' × I_n', pk: (r.peak / R.IN).toFixed(1) + ' × I_n', t0: (r.T0 / TN).toFixed(2) + ' × T_n', sw: r.swAt >= 0 ? rpmOf(r.swAt).toFixed(0) + ' rpm' : '—', ru: fmtRun(r) }; });
        table.set(all);
        const ptsI = res.path.filter((p, i) => i % 5 === 0 || i === res.path.length - 1).map(p => [rpmOf(p[1]), p[2]]);
        const ptsT = res.path.filter((p, i) => i % 5 === 0 || i === res.path.length - 1).map(p => [rpmOf(p[1]), p[3]]);
        const dI = [], dT = [], lT = [];
        for (let i = 0; i <= 120; i++) { const ww = WS * i / 120, o = at50(R, ww), nn = rpmOf(ww); dI.push([nn, o.I]); dT.push([nn, o.T]); lT.push([nn, START_LOADS[V.load].T(nn, L)]); }
        pI.set({ series: [{ pts: ptsI, label: NAMES[V.m] }, { pts: dI, label: 'DOL', dash: [5, 4] }], hlines: [{ y: R.IN, label: 'rated' }] });
        pT.set({ series: [{ pts: ptsT, label: NAMES[V.m] }, { pts: dT, label: 'DOL', dash: [5, 4] }, { pts: lT, label: 'load', color: kit.colors().muted, dash: [2, 3] }] });
        ro.set('i', res.I0.toFixed(1) + ' A = ' + (res.I0 / R.IN).toFixed(1) + ' × rated (DOL ' + (R.ILR / R.IN).toFixed(1) + ' ×)');
        ro.set('tq', res.T0.toFixed(1) + ' N·m = ' + (res.T0 / TN).toFixed(2) + ' × rated');
        ro.set('pk', res.peak.toFixed(0) + ' A = ' + (res.peak / R.IN).toFixed(1) + ' × rated');
        ro.set('ru', fmtRun(res));
        t = 0; dirty = false;
      };
      const loop = kit.loop(dt => {
        if (dirty) recompute();
        if (!res || !res.path.length) return;
        const T = res.path[res.path.length - 1][0];
        t += dt; if (t > T + 1.5) t = 0;
        const idx = clamp(Math.floor(Math.min(t, T) / T * (res.path.length - 1)), 0, res.path.length - 1), p = res.path[idx];
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 210);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 210 * s) / 2); c.scale(s, s);
        // supply → starter → motor
        txt(c, 'supply', 50, 30, C.text, 12);
        for (let k = 0; k < 3; k++) ln(c, 20, 60 + 20 * k, 190, 60 + 20 * k, C.accent, 2);
        c.fillStyle = C.surface; c.fillRect(190, 45, 170, 90); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(190, 45, 170, 90);
        const lab = { dol: ['contactor', 'full voltage at once'], yd: ['star → delta', 'windings at 1/√3 of the voltage'], auto: ['autotransformer', 'motor on the ' + Math.round(100 * V.tap) + ' % tap'], reactor: ['series reactor', Math.round(V.kr) + ' % at standstill, rising'], soft: ['thyristors', 'current held at ' + V.lim.toFixed(1) + ' × I_n'] }[V.m];
        txt(c, lab[0], 275, 80, C.text, 13); txt(c, lab[1], 275, 100, C.muted, 11);
        const done = t >= T;
        txt(c, done ? 'bypassed / full voltage' : 'starting…', 275, 122, done ? C.ok : C.warn, 11);
        for (let k = 0; k < 3; k++) ln(c, 360, 60 + 20 * k, 450, 60 + 20 * k, C.accent, 2);
        ang += p[1] * dt / 25;
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(500, 80, 46, 0, TAU); c.fill(); c.strokeStyle = C.text; c.stroke();
        for (let k = 0; k < 8; k++) { const a = ang + k * TAU / 8; c.fillStyle = C.muted; c.beginPath(); c.arc(500 + 34 * Math.cos(a), 80 + 34 * Math.sin(a), 5, 0, TAU); c.fill(); }
        txt(c, rpmOf(p[1]).toFixed(0) + ' rpm', 500, 145, C.text, 13);
        // line current bar (scale: the DOL starting current) and a sparkline of current against time with the replay cursor
        const fr = clamp(p[2] / (R.ILR * 1.2), 0, 1);
        c.fillStyle = C.faint; c.fillRect(20, 140, 150, 10); c.fillStyle = p[2] > 3 * R.IN ? C.bad : C.accent; c.fillRect(20, 140, 150 * fr, 10);
        txt(c, 'line current ' + p[2].toFixed(0) + ' A', 95, 168, C.muted, 11);
        const gx = 570, gy = 30, gw = 120, gh = 110, imax = Math.max(res.peak, R.ILR);
        c.strokeStyle = C.grid || C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
        res.path.forEach((q, i) => { if (i % 4) return; const x = gx + gw * q[0] / T, y = gy + gh - gh * q[2] / imax; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
        ln(c, gx + gw * Math.min(t, T) / T, gy, gx + gw * Math.min(t, T) / T, gy + gh, C.warn, 1);
        txt(c, 'current vs time, ' + T.toFixed(1) + ' s', gx + gw / 2, gy + gh + 16, C.muted, 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-soft-starter */
  // one phase of an AC voltage controller feeding an R-L load of angle phi, fired at alpha after the voltage zero:
  // conduction until the current returns to zero (the extinction angle beta); rms of the chopped voltage (per unit)
  function acController(alpha, phi) {
    if (alpha <= phi) return { beta: alpha + Math.PI, v: 1 };
    const tp = Math.tan(Math.max(0.02, phi)), s0 = Math.sin(alpha - phi);
    let beta = alpha + Math.PI;
    for (let k = 1; k <= 400; k++) { const th = alpha + Math.PI * k / 400; if (Math.sin(th - phi) - s0 * Math.exp(-(th - alpha) / tp) <= 0) { beta = th; break; } }
    const F = th => th / 2 - Math.sin(2 * th) / 4;
    return { beta, v: Math.sqrt(Math.max(0, (F(beta) - F(alpha)) / Math.PI)) };
  }
  function firingFor(vf, phi) {
    if (vf >= 0.999) return phi;
    let lo = phi, hi = Math.PI;
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (acController(m, phi).v > vf) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  Hyper.sim('sd-soft-starter', {
    title: 'Inside a soft starter',
    blurb: `A soft starter on the 7.5 kW motor driving a pump that lifts water 20 m through a 100 m pipe with a swing check valve (it closes about 0.3 s after the flow reverses). Each phase has two thyristors back to back; the waveform window shows one phase as if it were alone: the supply (dashed), the chopped motor voltage and the lagging current, fired at the angle α after each voltage zero. When the motor is up to speed the bypass contactor closes and the thyristors cool. The pump's check valve and a pressure gauge sit on the right.

**Try this**
- *Start* on a voltage ramp from 40 % over 8 s: α sweeps from late to early, the current rises smoothly, and the bypass closes at full voltage.
- Switch to *current limit* at 3.5 ×: the current stays flat while the motor accelerates, then falls. Lower it to 2 ×: the pump barely breaks away (torque ∝ current²).
- Choose the loaded conveyor and a 2.5 × limit: the motor does not start — reduced voltage cannot give it the torque — until the starter gives up and trips.
- *Stop* with a soft-stop time of 0 (coasting): the pump stops in a fraction of a second, the water column reverses and slams the check valve — a spike of several bar. Then set a 10 s and a 20 s soft stop and compare: the flow tapers off and the spike shrinks.
- Watch the heat-sink temperature: thyristors make about 3 W per ampere, so the bypass matters.`,
    mount(box, kit) {
      const M = kit.motor, R = ref(M), F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const [g1, g2, g3] = graphs(box, 3);
      // pump 60 m³/h at 30 m (shut-off 38 m) into 20 m of static head through a 100 m, DN100 pipe
      const Qd = 60 / 3600, Hd = 30, H0 = 38, kp = (H0 - Hd) / (Qd * Qd), Hs = 20, kf = (Hd - Hs) / (Qd * Qd), Lp = 100, A = Math.PI * 0.05 * 0.05, g = 9.81, aw = 1000;
      const Td = 1000 * g * Qd * Hd / 0.75 / radOf(1450);
      let V = null, t = 0, w = 0, wStop = 0, Q = 0, state = 'off', t0 = 0, vf = 0, bypass = false, Ths = 35, I = 0, Tm = 0, Pthy = 0, valveOpen = false, closing = 0, pTr = 0, tTr = -1, peakP = 0, fault = '', ang = 0, flowPh = 0, lastPlot = -1, alpha = 0, phi = 0.5;
      const hI = [], hN = [], hP = [];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Starting mode', options: [['Voltage ramp', 'ramp'], ['Current limit', 'limit']], value: 'ramp' },
        { id: 'v0', label: 'Initial voltage', min: 20, max: 80, step: 1, value: 40, unit: '%' },
        { id: 'tr', label: 'Ramp time', min: 1, max: 30, step: 0.5, value: 8, unit: 's' },
        { id: 'lim', label: 'Current limit', min: 1.5, max: 5, step: 0.1, value: 3.5, unit: '× I_n' },
        { id: 'kick', type: 'check', label: 'Kick start (80 % for 0.4 s)', value: false },
        { id: 'ts', label: 'Soft stop (pump control) time, 0 = coast', min: 0, max: 30, step: 0.5, value: 0, unit: 's' },
        { id: 'load', type: 'select', label: 'Load', options: [['Pump with check valve', 'pump'], ['Loaded conveyor (75 % torque)', 'conv']], value: 'pump' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], id => {
        if (id === 'start' && (state === 'off')) { state = 'start'; t0 = t; fault = ''; hI.length = hN.length = hP.length = 0; peakP = 0; }
        if (id === 'stop' && (state === 'run' || state === 'start')) { if (V.ts > 0) { state = 'stop'; t0 = t; bypass = false; wStop = w; } else { state = 'off'; bypass = false; } peakP = 0; }
        if (id === 'mode') show();
        lastPlot = -1;
      });
      V = ctl.values;
      function show() { ctl.show('v0', V.mode === 'ramp'); ctl.show('tr', V.mode === 'ramp'); ctl.show('lim', V.mode === 'limit'); }
      show();
      const ro = kit.readout(box.side, [['st', 'State'], ['v', 'Motor voltage, firing angle α'], ['i', 'Line current'], ['n', 'Speed, torque'], ['h', 'Thyristor losses, heat sink'], ['q', 'Flow, pressure at the valve'], ['pk', 'Peak pressure since Stop']]);
      const pI = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'current (× rated)', min: 0 } }, 160);
      const pN = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'speed (rpm)', min: 0, max: 1550 } }, 160);
      const pP = kit.plot(g3, { x: { label: 'time (s)' }, y: { label: 'pressure at the valve (bar)', min: 0 } }, 160);
      const loadT = (n, q) => {
        if (V.load === 'conv') return (n < 5 ? 0.85 : 0.75) * TN;
        const r = n / 1450, qq = r > 0.05 ? clamp(q / (Qd * r), 0, 1.4) : 0;
        return Td * r * r * (0.45 + 0.55 * qq) + (n < 5 ? 0.05 * TN : 0);
      };
      const loop = kit.loop(dt => {
        t += dt;
        const sub = 25, h = dt / sub;
        for (let k = 0; k < sub; k++) {
          const o = at50(R, w), ts = t - t0;
          if (state === 'start') {
            let v = V.mode === 'ramp' ? V.v0 / 100 + (1 - V.v0 / 100) * ts / V.tr : Math.min(1, V.lim * R.IN / o.I);
            if (V.kick && ts < 0.4) v = Math.max(v, 0.8);
            vf = clamp(v, 0, 1);
            if (vf >= 0.999 && w > 0.9 * WS) { state = 'run'; bypass = true; }
            if (ts > 30) { state = 'off'; fault = 'start took too long — tripped'; }
          } else if (state === 'run') vf = 1;
          else if (state === 'stop') {
            // pump control: the voltage is set each moment for the torque that brings the speed down along a torque-like ramp,
            // speed ∝ √(1 − t/T_stop), so the flow tapers off (a plain voltage ramp holds the speed up, then collapses near breakdown)
            const wt = wStop * Math.sqrt(Math.max(0, 1 - ts / Math.max(0.1, V.ts))), treq = loadT(rpmOf(w), Q) + 0.15 * 20 * (wt - w);
            vf = Math.sqrt(clamp(treq / Math.max(1, o.T), 0, 1));
            if (ts >= V.ts) state = 'off';
          }
          else vf = 0;
          I = vf * o.I; Tm = vf * vf * o.T;
          const n = rpmOf(w);
          w = clamp(w + h * (Tm - loadT(n, Q)) / 0.15, 0, WS);
          // the water column: accelerated by pump head minus static head and friction; the check valve stops reverse flow after a delay
          if (V.load === 'pump') {
            const r = rpmOf(w) / 1450, Hp = H0 * r * r - kp * Math.max(0, Q) * Q;
            if (!valveOpen && Hp > Hs + 0.05) { valveOpen = true; closing = 0; }
            if (valveOpen) {
              Q += h * g * A / Lp * (Hp - Hs - kf * Q * Math.abs(Q));
              if (Q < 0) { closing += h; if (closing > 0.3) { pTr = F.joukowsky(1000, aw, Math.abs(Q) / A); tTr = t; Q = 0; valveOpen = false; } }
            } else Q = 0;
          } else Q = 0;
          Pthy = (state === 'start' || state === 'stop') && !bypass ? 3 * (0.9 * 1.0 * I + 0.004 * I * I) : 0;
          Ths += h * (Pthy - (Ths - 35) / 0.6) / 600;
        }
        const o = at50(R, w); phi = Math.atan2(o.zx, o.zr);
        alpha = vf > 0 ? firingFor(vf, phi) : Math.PI;
        const n = rpmOf(w), tt = t - tTr;
        const pTrNow = tTr >= 0 && tt < 8 ? pTr * Math.exp(-tt / 1.5) * Math.cos(TAU * tt / (4 * Lp / aw)) : 0;
        const pv = V.load === 'pump' ? (1000 * g * (Hs + kf * Q * Q) + pTrNow) / 1e5 : 0;
        peakP = Math.max(peakP, pv);
        push(hI, t, I / R.IN, 30); push(hN, t, n, 30); push(hP, t, pv, 30);
        ro.set('st', fault ? fault : state === 'off' ? 'off' : state === 'start' ? 'starting (thyristors)' : state === 'run' ? 'running — bypass closed' : 'soft stop');
        ro.set('v', vf > 0 ? (100 * vf).toFixed(0) + ' %, α = ' + (alpha * 180 / Math.PI).toFixed(0) + '° (motor angle φ = ' + (phi * 180 / Math.PI).toFixed(0) + '°)' : '0');
        ro.set('i', I.toFixed(1) + ' A = ' + (I / R.IN).toFixed(2) + ' × rated');
        ro.set('n', n.toFixed(0) + ' rpm, ' + Tm.toFixed(1) + ' N·m (' + (Tm / TN).toFixed(2) + ' × rated)');
        ro.set('h', Pthy.toFixed(0) + ' W, ' + Ths.toFixed(1) + ' °C');
        ro.set('q', V.load === 'pump' ? (Q * 3600).toFixed(1) + ' m³/h, ' + pv.toFixed(2) + ' bar' : '—');
        ro.set('pk', V.load === 'pump' ? peakP.toFixed(2) + ' bar (static ' + (1000 * g * Hs / 1e5).toFixed(2) + ' bar)' : '—');
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          const xr = { min: t - 30, max: t, label: 'time (s)' };
          pI.set({ x: xr, series: [{ pts: hI.slice(), label: 'current' }], hlines: [{ y: 1, label: 'rated' }] });
          pN.set({ x: xr, series: [{ pts: hN.slice(), label: 'speed' }] });
          pP.set({ x: xr, series: [{ pts: hP.slice(), label: 'pressure' }] });
        }
        // ---- drawing
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 760, st.H / 300);
        c.save(); c.translate((st.W - 760 * s) / 2, (st.H - 300 * s) / 2); c.scale(s, s);
        const cond = (state === 'start' || state === 'stop') && !bypass && vf > 0;
        txt(c, 'Soft starter', 150, 16, C.text, 13);
        for (let k = 0; k < 3; k++) {
          const x = 70 + 80 * k;
          txt(c, 'L' + (k + 1), x, 34, C.text, 12);
          ln(c, x, 40, x, 70, C.accent);
          // two thyristors back to back
          const col = cond ? C.warn : C.muted;
          c.strokeStyle = col; c.lineWidth = 2;
          c.beginPath(); c.moveTo(x - 20, 80); c.lineTo(x - 8, 80); c.lineTo(x - 14, 94); c.closePath(); c.stroke(); ln(c, x - 21, 95, x - 7, 95, col);
          c.beginPath(); c.moveTo(x + 8, 110); c.lineTo(x + 20, 110); c.lineTo(x + 14, 96); c.closePath(); c.stroke(); ln(c, x + 7, 95, x + 21, 95, col);
          ln(c, x, 70, x - 14, 70, C.accent); ln(c, x - 14, 70, x - 14, 80, C.accent); ln(c, x, 70, x + 14, 70, C.accent); ln(c, x + 14, 70, x + 14, 96, C.accent);
          ln(c, x - 14, 95, x - 14, 122, col); ln(c, x + 14, 110, x + 14, 122, col); ln(c, x - 14, 122, x + 14, 122, col); ln(c, x, 122, x, 150, state === 'off' ? C.muted : C.accent);
          // bypass contact across the pair
          ln(c, x - 34, 60, x - 34, 70, C.text, 1.5); ln(c, x, 60, x - 34, 60, C.text, 1.5); ln(c, x - 34, 70, bypass ? x - 34 : x - 44, 128, C.text, 2); ln(c, x - 34, 128, x - 34, 136, C.text, 1.5); ln(c, x - 34, 136, x, 136, C.text, 1.5);
        }
        txt(c, bypass ? 'bypass closed' : cond ? 'thyristors firing' : 'off', 150, 170, bypass ? C.ok : cond ? C.warn : C.muted, 12);
        c.fillStyle = heat((Ths - 35) / 40); c.fillRect(40, 182, 220, 12); txt(c, 'heat sink ' + Ths.toFixed(1) + ' °C, ' + Pthy.toFixed(0) + ' W', 150, 212, C.muted, 11);
        // motor
        ang += w * dt / 25;
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(150, 255, 26, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.arc(150, 255, 32, ang, ang + 1.2); c.stroke();
        txt(c, 'M 3~', 150, 259, C.text, 11);
        // one phase: supply, chopped voltage and lagging current
        const wx = 320, wy = 40, ww = 220, wh = 150, mid = wy + wh / 2;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(wx, wy, ww, wh); ln(c, wx, mid, wx + ww, mid, C.faint, 1);
        txt(c, 'one phase, one cycle (R-L model)', wx + ww / 2, wy - 8, C.muted, 11);
        c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath();
        for (let i = 0; i <= 200; i++) { const th = TAU * i / 200, x = wx + ww * i / 200, y = mid - 0.42 * wh * Math.sin(th); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.setLineDash([]);
        const ac = vf > 0 ? acController(alpha, phi) : null;
        const onAt = th => { const u = th % Math.PI; return ac && (bypass || (u >= alpha - 1e-9 && u <= ac.beta) || (ac.beta > Math.PI && u <= ac.beta - Math.PI)); };
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 400; i++) { const th = TAU * i / 400, x = wx + ww * i / 400, y = mid - 0.42 * wh * (onAt(th) ? Math.sin(th) : 0); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        if (ac) {
          const tp = Math.tan(Math.max(0.02, phi)), a0 = bypass ? phi : alpha;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 400; i++) {
            const th = TAU * i / 400, u = th % Math.PI, sg = th < Math.PI ? 1 : -1;
            let iv = 0;
            if (bypass || !(alpha > phi)) iv = Math.sin(th - phi);
            else { const d = u >= alpha ? u - alpha : (u + Math.PI - alpha <= ac.beta - alpha ? u + Math.PI - alpha : -1); const sgn = u >= alpha ? sg : -sg; if (d >= 0 && d <= ac.beta - alpha) iv = sgn * (Math.sin(alpha + d - phi) - Math.sin(alpha - phi) * Math.exp(-d / tp)); }
            void a0;
            const x = wx + ww * i / 400, y = mid - 0.3 * wh * iv; i ? c.lineTo(x, y) : c.moveTo(x, y);
          }
          c.stroke();
          if (!bypass && alpha > phi) { const xa = wx + ww * alpha / TAU; ln(c, xa, wy + 4, xa, wy + wh - 4, C.bad, 1); txt(c, 'α', xa + 7, wy + 14, C.bad, 12); }
        }
        txt(c, 'supply', wx + 30, wy + wh + 16, C.muted, 10); txt(c, 'motor voltage', wx + 105, wy + wh + 16, C.accent, 10); txt(c, 'current', wx + 185, wy + wh + 16, C.warn, 10);
        // pump, pipe, check valve and gauge
        if (V.load === 'pump') {
          c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(600, 250, 20, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          c.save(); c.translate(600, 250); c.rotate(ang); for (let k = 0; k < 4; k++) { c.rotate(Math.PI / 2); ln(c, 0, 0, 0, -15, C.accent, 2); } c.restore();
          txt(c, 'pump', 600, 285, C.muted, 11);
          const pipe = [[620, 250], [660, 250], [660, 60], [735, 60]];
          c.strokeStyle = C.muted; c.lineWidth = 8; c.beginPath(); pipe.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
          flowPh += dt * 40 * Q / Qd;
          kit.schem.flow(c, pipe, flowPh, { color: 'hsl(205 80% 55%)' });
          c.fillStyle = 'hsl(205 70% 50% / .35)'; c.fillRect(705, 30, 45, 30); txt(c, 'tank +20 m', 727, 24, C.muted, 10);
          // check valve with its flap
          c.fillStyle = C.bg2 || C.surface; c.beginPath(); c.arc(660, 200, 12, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
          const fl = valveOpen ? 1.0 : 0;
          ln(c, 652, 208, 652 + 16 * Math.cos(-Math.PI / 2 + fl), 208 + 16 * Math.sin(-Math.PI / 2 + fl) - 8, C.text, 2);
          txt(c, 'check valve', 700, 204, C.muted, 10, 'left');
          if (tTr >= 0 && t - tTr < 1.2) txt(c, 'SLAM!', 690, 185, C.bad, 14, 'left');
          // gauge
          const gx = 700, gy = 120, gr = 22, u = clamp(pv / 8, 0, 1), a = Math.PI * (0.75 + 1.5 * u);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, gr, 0, TAU); c.stroke();
          ln(c, gx, gy, gx + (gr - 4) * Math.cos(a), gy + (gr - 4) * Math.sin(a), pv > 4 ? C.bad : C.accent, 2);
          txt(c, pv.toFixed(1) + ' bar', gx, gy + 38, C.text, 11);
          ln(c, 660, 120, gx - gr, gy, C.muted, 1.5);
        } else {
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(600, 240, 18, 0, TAU); c.stroke(); c.beginPath(); c.arc(730, 240, 18, 0, TAU); c.stroke();
          ln(c, 600, 222, 730, 222, C.text); ln(c, 600, 258, 730, 258, C.text);
          for (let k = 0; k < 4; k++) { const x = 610 + ((ang * 18 + k * 32) % 128); c.fillStyle = C.warn; c.fillRect(x, 208, 18, 14); }
          txt(c, 'loaded conveyor', 665, 285, C.muted, 11);
        }
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-overload */
  Hyper.sim('sd-overload', {
    title: 'Overload relay against the winding',
    blurb: `A 7.5 kW motor (rated 14.6 A, 7.2 × at start) with its protection. The relay keeps a thermal image of the motor — heating with the square of the current, cooling slowly — and trips when it reaches its threshold. The motor itself is modelled as a copper winding coupled to an iron frame, cooled by its shaft fan. Left graph: time to trip against current for the chosen trip class (from cold and from warm), the motor's own limit (the time for its winding to reach 155 °C from rated temperature), your start and the present point. Right graph: winding temperature and the relay's image over time.

**Try this**
- *Start* with a 5 s run-up on class 10: the start point sits safely below the curve. Lengthen the run-up to 15 s: it crosses the class 10 curve — the relay trips during the start. Class 20 cures it.
- Run at 100 %, then at 130 %: the relay trips in a few minutes (use the ×60 time) before the winding passes 155 °C. Now set the relay to 120 % of the nameplate current: at 130 % load it never trips, the winding climbs towards 160 °C and only the thermistors save it (untick them to watch it pass 155 °C).
- *Jam* the running motor: locked-rotor current, the winding climbs a few kelvin per second, and the relay trips within seconds — sooner when the motor was already warm.
- *Lose a phase* at full load: two lines carry √3 times the current. The electronic relay trips in about 3 s; the bimetal takes longer.
- *Block the cooling*: the current stays normal, the relay sees nothing — only the PTC thermistors trip.
- *Short circuit*: only the motor-protective breaker's magnetic trip (or the fuses) can clear it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const [g1, g2] = graphs(box, 2);
      const FLC = 14.6, XLR = 7.2, K2 = 1.3225, TAMB = 40;
      const CLS = { c10a: [6, '10A'], c10: [8, '10'], c20: [16, '20'], c30: [24, '30'] };
      const tauOf = () => CLS[V.cls][0] / Math.log(51.84 / (51.84 - K2));
      // two-body motor: winding (C 3100 J/K, 0.12 K/W to the frame), frame (21 000 J/K, 0.0714 K/W to the air when the fan turns)
      const CW = 3100, RWF = 0.12, CF = 21000, RFA = 0.0714;
      const ptcR = T => { const d = T - 145, pts = [[-40, 100], [-20, 100], [-5, 400], [5, 2000], [15, 10000], [40, 20000]]; for (let i = 1; i < pts.length; i++) if (d <= pts[i][0]) { const u = (d - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]); return Math.exp(Math.log(pts[i - 1][1]) + clamp(u, 0, 1) * (Math.log(pts[i][1]) - Math.log(pts[i - 1][1]))); } return 20000; };
      let V = null, t = 0, running = false, tRun = 0, jam = false, pl = false, blocked = false, sc = false, trip = '', th = 0, Tw = TAMB, Tf = TAMB, plT = 0, ptcTrip = false, lastPlot = -1, ang = 0, I = 0, lines = [0, 0, 0], mag = false;
      const hW = [], hR = [];
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Protection', options: [['Thermal (bimetal) overload relay + fuses', 'bimetal'], ['Electronic overload relay + fuses', 'elec'], ['Motor-protective circuit breaker', 'mpcb']], value: 'bimetal' },
        { id: 'cls', type: 'select', label: 'Trip class', options: [['10A', 'c10a'], ['10', 'c10'], ['20', 'c20'], ['30', 'c30']], value: 'c10' },
        { id: 'set', label: 'Setting, % of the nameplate current', min: 80, max: 125, step: 1, value: 100, unit: '%' },
        { id: 'load', label: 'Load while running', min: 0, max: 150, step: 1, value: 100, unit: '%' },
        { id: 'ru', label: 'Run-up time at start', min: 1, max: 30, step: 0.5, value: 5, unit: 's' },
        { id: 'ptc', type: 'check', label: 'PTC thermistors with a thermistor relay', value: true },
        { id: 'spd', type: 'select', label: 'Time runs', options: [['1 × (real time)', 1], ['10 × faster', 10], ['60 × faster', 60]], value: 1 },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'reset', label: 'Reset' }] },
        { type: 'buttons', items: [{ id: 'jam', label: 'Jam' }, { id: 'pl', label: 'Lose a phase' }, { id: 'blk', label: 'Block cooling' }, { id: 'sc', label: 'Short circuit' }] }
      ], id => {
        if (id === 'start' && !trip && !running) { running = true; tRun = t; hW.length = hR.length = 0; }
        if (id === 'stop') running = false;
        if (id === 'jam') jam = !jam;
        if (id === 'pl') pl = !pl;
        if (id === 'blk') blocked = !blocked;
        if (id === 'sc') { sc = true; }
        if (id === 'reset') {
          if (trip === 'PTC' && ptcR(Tw) * 3 > 1650) return;
          if ((trip === 'overload' || trip === 'phase loss') && th > 1) return;
          trip = ''; ptcTrip = false; sc = false; mag = false;
        }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['i', 'Line currents L1 · L2 · L3'], ['x', 'Current / setting'], ['im', 'Relay image; time to trip'], ['tw', 'Winding · frame temperature'], ['ptc', 'PTC chain resistance'], ['st', 'State']]);
      const pC = kit.plot(g1, { x: { label: 'current (× setting)', min: 1, max: 20, log: true }, y: { label: 'time (s)', min: 0.5, max: 20000, log: true }, legend: true }, 200);
      const pT = kit.plot(g2, { x: { label: 'time (min)' }, y: { label: '°C  ·  relay image (% of trip)', min: 0, max: 200 }, legend: true }, 200);
      // the motor's own limit: time for the winding to reach 155 °C from its rated temperature at a steady overload x
      const motorLimit = (() => {
        const out = [];
        for (let i = 0; i <= 40; i++) {
          const x = Math.exp(Math.log(1.26) + (Math.log(20) - Math.log(1.26)) * i / 40);
          let tw = 120, tf = 90, tt = 0; const hh = 0.05;
          while (tw < 155 && tt < 20000) { const pcu = 250 * x * x; tw += hh * (pcu - (tw - tf) / RWF) / CW; tf += hh * ((tw - tf) / RWF + 200 * x * x + 250 - (tf - TAMB) / RFA) / CF; tt += hh; if (tt > 200) break; }
          if (tt < 200 || tw >= 155) out.push([x, tt]);
        }
        return out;
      })();
      const loop = kit.loop(dt => {
        const spd = +V.spd, simDt = dt * spd, nsub = Math.max(1, Math.ceil(simDt / 0.02)), h = simDt / nsub, tau = tauOf(), setA = FLC * V.set / 100;
        for (let k = 0; k < nsub; k++) {
          t += h;
          const on = running && !trip;
          if (sc && on) { if (V.dev === 'mpcb') { trip = 'magnetic'; mag = true; } else trip = 'fuses'; running = false; }
          const starting = on && t - tRun < V.ru, locked = on && (jam || (pl && starting));
          let x = 0;                                             // current per unit of FLC in the loaded lines
          if (on) x = locked ? XLR * (pl ? 0.87 : 1) : starting ? XLR : Math.max(0.35, V.load / 100) * (pl ? SQ3 : 1);
          I = x * FLC;
          lines = on ? (pl ? [I, I, 0] : [I, I, I]) : [0, 0, 0];
          // losses: stator copper to the winding; rotor copper, iron and friction to the frame (phase loss doubles the copper losses)
          // with a phase lost only two windings carry the (√3 × larger) line current: x² × 2/3 per unit, twice the balanced loss
          const f2 = pl ? 2 / 3 : 1;
          const pcu = on ? 250 * x * x * f2 : 0;
          const prot = on ? 200 * x * x * f2 : 0, pfe = on ? 250 : 0;
          const rfa = RFA * (blocked ? 2.5 : 1) * (on && !locked ? 1 : 2);
          Tw += h * (pcu - (Tw - Tf) / RWF) / CW;
          Tf += h * ((Tw - Tf) / RWF + prot + pfe - (Tf - TAMB) / rfa) / CF;
          // relay: thermal image of the most loaded pole
          // a phase-loss-sensitive (differential) bimetal relay shifts its trip point when one pole is idle: modelled as 1.2 × the current
          const xr = lines.reduce((a, b) => Math.max(a, b), 0) / setA * (pl && on && V.dev !== 'elec' ? 1.2 : 1);
          th = Math.max(0, th + h * (xr * xr - th) / tau);
          const lossDetect = pl && on;
          if (lossDetect && V.dev === 'elec') plT += h; else plT = 0;
          if (on) {
            if (plT > 3) trip = 'phase loss';
            else if (th >= K2) trip = 'overload';
          }
          const rc = 3 * ptcR(Tw);
          if (V.ptc && rc > 3000 && on) { trip = 'PTC'; ptcTrip = true; }
          if (trip) running = false;
        }
        const on = running && !trip, x = I / (FLC * V.set / 100), rc = 3 * ptcR(Tw);
        const tt = x * x > K2 ? tauOf() * Math.log(Math.max(1e-9, (x * x - th) / (x * x - K2))) : Infinity;
        push(hW, t / 60, Tw, 1e9); push(hR, t / 60, 100 * th / K2, 1e9);
        if (hW.length > 3000) { hW.splice(0, 1000); hR.splice(0, 1000); }
        ro.set('i', lines.map(v => v.toFixed(1)).join(' · ') + ' A');
        ro.set('x', on ? x.toFixed(2) + ' × (' + (FLC * V.set / 100).toFixed(1) + ' A setting)' : '—');
        ro.set('im', (100 * th / K2).toFixed(0) + ' % of trip; ' + (on ? (tt === Infinity ? 'will not trip' : (tt < 0 ? 0 : tt).toFixed(tt < 20 ? 1 : 0) + ' s at this current') : '—'));
        ro.set('tw', Tw.toFixed(0) + ' °C · ' + Tf.toFixed(0) + ' °C' + (Tw > 155 ? ' — above class F!' : ''));
        ro.set('ptc', V.ptc ? rc.toFixed(0) + ' Ω (trips above ≈ 3000 Ω)' : 'not fitted');
        ro.set('st', trip === 'magnetic' ? 'short circuit cleared by the magnetic trip in milliseconds' : trip === 'fuses' ? 'short circuit — the fuses blew (an overload relay cannot clear it)' : trip ? 'TRIPPED by ' + (trip === 'PTC' ? 'the PTC thermistor relay' : trip === 'phase loss' ? 'the phase-loss function' : 'the overload relay') + ' — press Reset once cool' : on ? (t - tRun < V.ru ? 'starting' : jam ? 'JAMMED' : 'running') + (pl ? ', phase lost' : '') + (blocked ? ', cooling blocked' : '') : 'stopped');
        if (t - lastPlot > 0.3 * spd || lastPlot < 0) {
          lastPlot = t;
          const cold = [], hot = [];
          for (let i = 0; i <= 60; i++) { const xx = Math.exp(Math.log(1.16) + (Math.log(20) - Math.log(1.16)) * i / 60), a = xx * xx; cold.push([xx, tauOf() * Math.log(a / (a - K2))]); if (a > K2) hot.push([xx, Math.max(0.5, tauOf() * Math.log((a - 1) / (a - K2)))]); }
          const marks = [{ x: XLR / (V.set / 100), y: V.ru, label: 'your start' }];
          if (on && x > 1.16 && tt !== Infinity) marks.push({ x: Math.min(20, x), y: clamp(tt, 0.5, 20000), label: 'now' });
          pC.set({ series: [{ pts: cold, label: 'class ' + CLS[V.cls][1] + ', cold' }, { pts: hot, label: 'from warm', dash: [5, 3] }, { pts: motorLimit.map(p => [p[0] / (V.set / 100), Math.max(0.5, p[1])]).filter(p => p[0] >= 1 && p[0] <= 20), label: 'motor limit (155 °C)', color: kit.colors().bad }], marks, vlines: V.dev === 'mpcb' ? [{ x: 14 / (V.set / 100), label: 'magnetic' }] : [] });
          const tmin = hW.length ? hW[0][0] : 0, tmax = Math.max(tmin + 1, t / 60);
          pT.set({ x: { label: 'time (min)', min: tmin, max: tmax }, series: [{ pts: hW.slice(), label: 'winding °C' }, { pts: hR.slice(), label: 'relay image %' }], hlines: [{ y: 155, label: 'class F' }, { y: 100, label: 'trip' }] });
        }
        // ---- drawing: the motor cut open, its fan, three line currents, the relay and the thermistor relay
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 250);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 250 * s) / 2); c.scale(s, s);
        ang += (on && !jam && !(pl && t - tRun < V.ru) ? 1 : 0) * dt * 3;
        const u = (Tw - 40) / 120;
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(150, 125, 90, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        for (let k = 0; k < 24; k++) { const a = k * TAU / 24; c.fillStyle = heat(u); c.beginPath(); c.arc(150 + 72 * Math.cos(a), 125 + 72 * Math.sin(a), 7, 0, TAU); c.fill(); }
        c.fillStyle = C.muted; c.beginPath(); c.arc(150, 125, 55, 0, TAU); c.fill();
        c.strokeStyle = C.bg2 || C.surface; c.lineWidth = 3; c.beginPath(); c.moveTo(150, 125); c.lineTo(150 + 50 * Math.cos(ang), 125 + 50 * Math.sin(ang)); c.stroke();
        txt(c, 'winding ' + Tw.toFixed(0) + ' °C', 150, 235, Tw > 155 ? C.bad : C.text, 12);
        // fan
        c.save(); c.translate(290, 125);
        for (let k = 0; k < 6; k++) { const a = ang * 2 + k * TAU / 6; c.fillStyle = 'hsl(200 60% 55% / .7)'; c.beginPath(); c.ellipse(20 * Math.cos(a), 20 * Math.sin(a), 16, 6, a, 0, TAU); c.fill(); }
        c.restore();
        if (blocked) { ln(c, 262, 97, 318, 153, C.bad, 4); ln(c, 318, 97, 262, 153, C.bad, 4); }
        txt(c, blocked ? 'cooling blocked' : 'shaft fan', 290, 170, blocked ? C.bad : C.muted, 11);
        // line currents
        for (let k = 0; k < 3; k++) {
          const y = 40 + 26 * k, fr = clamp(lines[k] / (XLR * FLC), 0, 1);
          txt(c, 'L' + (k + 1), 370, y + 9, C.text, 11);
          c.fillStyle = C.faint; c.fillRect(385, y, 130, 12); c.fillStyle = lines[k] > 1.2 * FLC ? C.bad : C.accent; c.fillRect(385, y, 130 * fr, 12);
          txt(c, lines[k].toFixed(1) + ' A', 520, y + 10, C.muted, 10, 'left');
        }
        // relay: three bimetal strips bending with the image
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(370, 130, 150, 80);
        txt(c, V.dev === 'mpcb' ? 'MPCB (thermal + magnetic)' : V.dev === 'elec' ? 'electronic relay' : 'bimetal relay', 445, 125, C.muted, 11);
        for (let k = 0; k < 3; k++) {
          const x0 = 395 + 45 * k, bend = clamp(th / K2, 0, 1.2) * 14 * (lines[k] > 0 || !on ? 1 : 0.5);
          c.strokeStyle = heat(th / K2); c.lineWidth = 4; c.beginPath(); c.moveTo(x0, 200); c.quadraticCurveTo(x0 + bend * 0.3, 170, x0 + bend, 142); c.stroke();
        }
        txt(c, trip === 'overload' || trip === 'phase loss' || trip === 'magnetic' ? 'TRIPPED' : '95–96 closed', 445, 228, trip ? C.bad : C.ok, 12);
        // thermistor relay
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(560, 130, 120, 80);
        txt(c, 'PTC relay', 620, 125, C.muted, 11);
        kit.dot(c, 620, 160, 9, !V.ptc ? C.faint : ptcTrip ? C.bad : C.ok);
        txt(c, V.ptc ? rc.toFixed(0) + ' Ω' : 'not fitted', 620, 195, C.text, 12);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ---------------------------------------------------------------- drive helpers */
  // the reference motor at frequency f and line voltage V (reactances scale with f); conn: 'star' (as built) or 'delta87'
  // (a 230/400 V motor in delta: star-equivalent impedances divided by 3)
  function motorAt(M, f, V, conn) {
    const k = f / 50, d = conn === 'delta87' ? 3 : 1;
    return M.induction(Object.assign({}, IM, { f, V_LL: V, R1: IM.R1 / d, R2: IM.R2 / d, X1: IM.X1 * k / d, X2: IM.X2 * k / d, Xm: IM.Xm * k / d, Pfw: IM.Pfw * k }));
  }
  // the slip at which the motor meets a load torque TL(n) on the stable side; null when the load exceeds the breakdown torque
  function opSlip(im, TL) {
    const g = s => im.at(s).T - TL(im.at(s).n);
    if (g(im.sMax) < 0) return null;
    let lo = 1e-6, hi = im.sMax;
    for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (g(m) < 0) lo = m; else hi = m; }
    return hi;
  }
  // air-gap voltage (per phase) of the equivalent circuit at slip s: E = V − I₁ Z₁ (complex arithmetic)
  function airGapE(im, p, s) {
    const R2 = p.R2 * (1 + (p.deepBar || 0) * p.f / 50 * s), a = R2 / s, b = p.X2, xm = p.Xm;
    // Zp = jXm (a + jb) / (a + j(b + Xm))
    const nr = -xm * b, ni = xm * a, dr = a, di = b + xm, dd = dr * dr + di * di;
    const zr = (nr * dr + ni * di) / dd, zi = (ni * dr - nr * di) / dd;
    const Zr = p.R1 + zr, Zi = p.X1 + zi, Z2 = Zr * Zr + Zi * Zi;
    return im.Vph * Math.hypot(zr, zi) / Math.sqrt(Z2);
  }

  /* ================================================================ sd-vfd-inside */
  Hyper.sim('sd-vfd-inside', {
    title: 'Inside a variable-frequency drive',
    blurb: `A 7.5 kW drive on 400 V feeding the 7.5 kW motor. Left to right: the mains, an optional line reactor, the six-diode rectifier, the DC link (with an optional DC choke), the three IGBT half-bridges and the motor. The IGBTs light up as they switch — played back so that one output cycle lasts four seconds; the window on the right zooms in on the sine–triangle comparison that decides them. The graphs: the PWM line voltage with its fundamental, the motor current with its ripple, and the current the rectifier draws from one mains phase.

**Try this**
- Lower the output frequency: the voltage fundamental shrinks with it (V/f) and the pulses get narrower; the current stays sinusoidal because the motor's inductance smooths it.
- Lower the switching frequency to 1–2 kHz and watch the current ripple grow (and imagine the motor whistling at that pitch); at 16 kHz it almost vanishes — at the price of more switching losses in the drive.
- Choose plain sine–triangle modulation at 50 Hz: it cannot reach 400 V from a 540 V bus (only about 330 V), so the motor is under-fluxed; the space-vector (third-harmonic) method reaches about 382 V.
- Look at the mains current without a choke: two sharp pulses per half-cycle, a THD near 100 %. Add a 3 % line reactor or a DC choke and the pulses widen and the harmonics roughly halve.
- Compare the drive's input current with the motor current at 20 Hz and full torque: the mains supplies only the real power.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 220 });
      const [g1, g2, g3] = graphs(box, 3);
      let V = null, res = null, dirty = true, tp = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Output frequency', min: 5, max: 75, step: 0.5, value: 50, unit: 'Hz' },
        { id: 'fc', label: 'Switching (carrier) frequency', min: 1, max: 16, step: 1, value: 4, unit: 'kHz' },
        { id: 'load', label: 'Load torque, % of rated (constant torque)', min: 0, max: 150, step: 1, value: 100, unit: '%' },
        { id: 'mod', type: 'select', label: 'Modulation', options: [['Space vector (third harmonic added)', 'svm'], ['Plain sine–triangle', 'spwm']], value: 'svm' },
        { id: 'choke', type: 'select', label: 'Input choke', options: [['None', 'none'], ['3 % AC line reactor', 'ac'], ['DC-link choke', 'dc']], value: 'none' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['vo', 'Output: fundamental line voltage, modulation'], ['io', 'Motor current, power factor'], ['rp', 'Current ripple (peak to peak)'], ['dc', 'DC bus: average, ripple'], ['ii', 'Mains current (rms), THD'], ['h57', '5th · 7th · 11th harmonic'], ['pf', 'Input power, true power factor'], ['ls', 'Drive losses (≈ 2.5 %)']]);
      const pV = kit.plot(g1, { x: { label: 'time (ms)', min: 0 }, y: { label: 'line voltage U–V (V)' }, legend: true }, 170);
      const pA = kit.plot(g2, { x: { label: 'time (ms)', min: 0 }, y: { label: 'motor current, phase U (A)' }, legend: true }, 170);
      const pM = kit.plot(g3, { x: { label: 'time (ms)', min: 0, max: 20 }, y: { label: 'mains current, L1 (A)' }, legend: true }, 170);
      const tri = x => { const u = x - Math.floor(x); return u < 0.5 ? 4 * u - 1 : 3 - 4 * u; };   // −1 … 1 triangle, period 1
      const refs = (m, th, svm) => [0, 1, 2].map(k => { const a = th - k * TAU / 3; return m * Math.sin(a) + (svm ? m / 6 * Math.sin(3 * a) : 0); });
      // the rectifier, solved as a circuit: three phases with their source inductance (plus a 3 % reactor), six diodes,
      // an optional DC choke, the DC-link capacitor and the inverter as a load taking the input power
      function rectifier(Pin, choke) {
        const c = new kit.Circuit(), Vp = 400 * Math.SQRT2 / SQ3, Lp = 0.15e-3 + (choke === 'ac' ? 1.47e-3 : 0), ph = ['a', 'b', 'c'];
        ph.forEach((n, k) => c.V(n, 'gnd', t => Vp * Math.sin(TAU * 50 * t - k * TAU / 3)));
        const Lph = ph.map(n => c.L(n, n + '1', Lp, 0));
        ph.forEach(n => { c.D(n + '1', 'p'); c.D('m', n + '1'); });
        if (choke === 'dc') c.L('p', 'p2', 2.5e-3, 0); else c.R('p', 'p2', 1e-3);
        c.C('p2', 'm', 1.0e-3, 560); c.R('p2', 'gnd', 1e6); c.R('m', 'gnd', 1e6);
        c.R('p2', 'm', 540 * 540 / Math.max(100, Pin));
        c.reset();
        const h = 1e-5, N = 2000, cyc = [], vd = [];
        for (let n = 0; n < 7 * N; n++) { c.step(h); if (n >= 6 * N) { cyc.push([(n - 6 * N) * h * 1000, Lph[0].i]); vd.push(c.v('p2') - c.v('m')); } }
        // Fourier coefficients of the last cycle
        const harm = h2 => { let a = 0, b = 0; cyc.forEach((p, k) => { const th = TAU * h2 * k / cyc.length; a += p[1] * Math.cos(th); b += p[1] * Math.sin(th); }); return Math.hypot(a, b) * 2 / cyc.length / Math.SQRT2; };
        const H = []; for (let k = 1; k <= 25; k++) H[k] = harm(k);
        const rms = Math.sqrt(cyc.reduce((a, p) => a + p[1] * p[1], 0) / cyc.length);
        let thd = 0; for (let k = 2; k <= 25; k++) thd += H[k] * H[k];
        let vmax = -Infinity, vmin = Infinity, vs = 0; for (const v of vd) { vmax = Math.max(vmax, v); vmin = Math.min(vmin, v); vs += v; }
        return { cyc, H, rms, thd: Math.sqrt(thd) / Math.max(1e-9, H[1]), vdc: vs / vd.length, ripple: vmax - vmin };
      }
      function compute() {
        const f = V.f, fc = V.fc * 1000, svm = V.mod === 'svm', mmax = svm ? 2 / SQ3 : 1;
        let vdc = 540, mot = null, rect = null;
        for (let it = 0; it < 2; it++) {
          const Vdem = M.vf({ Vn: 400, fn: 50, f, boost: 16 }), Vmax = vdc * mmax * SQ3 / (2 * Math.SQRT2);
          const Vll = Math.min(Vdem, Vmax), im = motorAt(M, f, Vll, 'star'), TL = V.load / 100 * TN;
          const s = opSlip(im, () => TL), o = im.at(s == null ? im.sMax : s);
          mot = { Vll, Vdem, limited: Vdem > Vmax + 0.5, o, stall: s == null, n: o.n, m: Vll * Math.SQRT2 / SQ3 / (vdc / 2) };
          const Pin = Math.max(50, o.Pin / 0.975);
          rect = rectifier(Pin, V.choke); vdc = rect.vdc;
        }
        // PWM over one output period, and the current ripple it drives through the leakage inductance
        const T = 1 / f, Ls = (IM.X1 + IM.X2) / (TAU * 50), dt = 1 / (fc * 48), N = Math.min(200000, Math.ceil(T / dt)), m = mot.m;
        const I1 = mot.o.I1, phi = Math.acos(clamp(mot.o.pf, -1, 1));
        const vab = [], ia = [], iaF = [], vF = [];
        let rip = 0, prev = null, sum = 0; const ripA = new Float64Array(N);
        for (let k = 0; k < N; k++) {
          const t = k * T / N, th = TAU * f * t, c = tri(fc * t), r = refs(m, th, svm), S = r.map(x => x > c ? 1 : 0);
          const v = vdc * (S[0] - S[1]);
          if (prev == null || v !== prev) { if (prev != null) vab.push([t * 1000, prev]); vab.push([t * 1000, v]); prev = v; }
          const vaN = vdc * (S[0] - (S[0] + S[1] + S[2]) / 3), vaF = vdc / 2 * m * Math.sin(th);
          rip += (vaN - vaF) / Ls * (T / N); ripA[k] = rip; sum += rip;
        }
        vab.push([T * 1000, prev]);
        // keep only the carrier ripple: subtract the average over one carrier period (48 samples) around each sample, which
        // removes the slow wander that the sampled comparison leaves at the output frequency and its low harmonics
        { const cs = new Float64Array(N + 1); for (let k = 0; k < N; k++) cs[k + 1] = cs[k] + ripA[k];
          const out = new Float64Array(N); for (let k = 0; k < N; k++) { const a0 = Math.max(0, k - 24), b0 = Math.min(N, a0 + 48), a2 = Math.max(0, b0 - 48); out[k] = ripA[k] - (cs[b0] - cs[a2]) / (b0 - a2); }
          sum = 0; for (let k = 0; k < N; k++) { ripA[k] = out[k]; sum += out[k]; } }
        const mean = sum / N, step = Math.max(1, Math.floor(N / 2500));
        let rmin = Infinity, rmax = -Infinity;
        for (let k = 0; k < N; k++) { const r = ripA[k] - mean; if (k % step === 0) { const t = k * T / N, th = TAU * f * t, i0 = Math.SQRT2 * I1 * Math.sin(th - phi); ia.push([t * 1000, i0 + r]); iaF.push([t * 1000, i0]); } }
        // ripple peak to peak around the fundamental, over a window where it is largest (near the current zero)
        for (let k = 0; k < N; k++) { const r = ripA[k] - mean; rmin = Math.min(rmin, r); rmax = Math.max(rmax, r); }
        for (let k = 0; k <= 200; k++) { const t = k * T / 200; vF.push([t * 1000, Math.SQRT2 * mot.Vll * Math.sin(TAU * f * t + Math.PI / 6)]); }
        res = { mot, rect, vab, ia, iaF, vF, ripple: rmax - rmin, vdc, T, fc, svm, m };
        const P = mot.o.Pin / 0.975, lam = P / (SQ3 * 400 * rect.rms);
        ro.set('vo', mot.Vll.toFixed(0) + ' V at ' + f.toFixed(1) + ' Hz, m = ' + m.toFixed(2) + (mot.limited ? ' — voltage limit reached (wanted ' + mot.Vdem.toFixed(0) + ' V)' : ''));
        ro.set('io', mot.stall ? 'the load exceeds the breakdown torque' : mot.o.I1.toFixed(1) + ' A, ' + mot.o.pf.toFixed(2) + ', ' + mot.n.toFixed(0) + ' rpm');
        ro.set('rp', res.ripple.toFixed(2) + ' A at ' + V.fc + ' kHz');
        ro.set('dc', rect.vdc.toFixed(0) + ' V, ' + rect.ripple.toFixed(1) + ' V (300 Hz)');
        ro.set('ii', rect.rms.toFixed(1) + ' A, THD ' + (100 * rect.thd).toFixed(0) + ' %');
        ro.set('h57', [5, 7, 11].map(k => (100 * rect.H[k] / rect.H[1]).toFixed(0) + ' %').join(' · '));
        ro.set('pf', (P / 1000).toFixed(2) + ' kW, λ = ' + clamp(lam, 0, 1).toFixed(2));
        ro.set('ls', (0.025 * P).toFixed(0) + ' W of heat');
        pV.set({ x: { label: 'time (ms)', min: 0, max: T * 1000 }, series: [{ pts: vab, label: 'PWM' }, { pts: vF, label: 'fundamental', dash: [5, 3] }] });
        pA.set({ x: { label: 'time (ms)', min: 0, max: T * 1000 }, series: [{ pts: ia, label: 'with ripple' }, { pts: iaF, label: 'fundamental', dash: [5, 3] }] });
        pM.set({ series: [{ pts: rect.cyc.filter((p, k) => k % 4 === 0), label: 'mains current' }] });
        dirty = false;
      }
      const loop = kit.loop(dt => {
        if (dirty) compute();
        if (!res) return;
        tp += dt;
        const th = TAU * ((tp % 4) / 4), tReal = th / (TAU * V.f), c0 = tri(res.fc * tReal), r = refs(res.m, th, res.svm), S = r.map(x => x > c0 ? 1 : 0);
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 760, st.H / 250);
        c.save(); c.translate((st.W - 760 * s) / 2, (st.H - 250 * s) / 2); c.scale(s, s);
        const yP = 40, yN = 205;
        // mains and reactor
        for (let k = 0; k < 3; k++) { const y = 95 + 25 * k; txt(c, 'L' + (k + 1), 18, y + 4, C.text, 11); ln(c, 30, y, 95, y, C.accent); if (V.choke === 'ac') { c.strokeStyle = C.text; c.lineWidth = 1.5; for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(52 + 8 * j, y, 4, Math.PI, 0); c.stroke(); } } }
        if (V.choke === 'ac') txt(c, '3 % reactor', 60, 82, C.muted, 10);
        // diode bridge (lit when that diode conducts at the slowed mains angle)
        const mainsIdx = res.rect.cyc.length ? Math.floor(((th / TAU) % 1) * res.rect.cyc.length) : 0, cyc = res.rect.cyc;
        const Vp = 400 * Math.SQRT2 / SQ3, thm = TAU * mainsIdx / Math.max(1, cyc.length), pv = [Math.sin(thm), Math.sin(thm - TAU / 3), Math.sin(thm + TAU / 3)].map(v => v * Vp);
        const iNow = cyc.length ? Math.abs(cyc[mainsIdx][1]) : 0, kmax = pv.indexOf(Math.max(...pv)), kmin = pv.indexOf(Math.min(...pv));
        ln(c, 110, yP, 250, yP, C.bad, 2.5); ln(c, 110, yN, 250, yN, C.accent, 2.5);
        for (let k = 0; k < 3; k++) {
          const x = 115 + 30 * k, y = 95 + 25 * k;
          ln(c, 95, y, x, y, C.accent, 1.5); ln(c, x, yP, x, yN, C.muted, 1.5);
          const up = iNow > 0.5 && k === kmax, dn = iNow > 0.5 && k === kmin;
          const diode = (yy, on) => { c.fillStyle = on ? C.warn : C.surface; c.strokeStyle = on ? C.warn : C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x - 7, yy + 6); c.lineTo(x + 7, yy + 6); c.lineTo(x, yy - 6); c.closePath(); c.fill(); c.stroke(); ln(c, x - 7, yy - 6, x + 7, yy - 6, on ? C.warn : C.text, 1.5); };
          diode(65, up); diode(180, dn);
        }
        txt(c, 'rectifier', 145, 228, C.muted, 11);
        if (V.choke === 'dc') { c.strokeStyle = C.text; c.lineWidth = 1.5; for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(190 + 8 * j, yP, 4, Math.PI, 0); c.stroke(); } txt(c, 'DC choke', 198, yP - 10, C.muted, 10); }
        // DC link
        ln(c, 250, yP, 460, yP, C.bad, 2.5); ln(c, 250, yN, 460, yN, C.accent, 2.5);
        ln(c, 262, yP, 262, 112, C.text, 1.5); ln(c, 250, 112, 274, 112, C.text, 2.5); ln(c, 250, 122, 274, 122, C.text, 2.5); ln(c, 262, 122, 262, yN, C.text, 1.5);
        txt(c, res.vdc.toFixed(0) + ' V', 262, 145, C.text, 12); txt(c, 'DC link', 262, 160, C.muted, 10);
        txt(c, '+', 245, yP - 6, C.bad, 12); txt(c, '−', 245, yN + 14, C.accent, 12);
        // inverter legs
        for (let k = 0; k < 3; k++) {
          const x = 320 + 55 * k, top = S[k] === 1, mid = 122;
          ln(c, x, yP, x, mid, C.text, 1.5); ln(c, x, mid, x, yN, C.text, 1.5);
          const igbt = (y, on) => { c.fillStyle = on ? 'hsl(215 85% 55% / .8)' : C.surface; c.fillRect(x - 13, y - 14, 26, 28); c.strokeStyle = on ? C.accent : C.muted; c.lineWidth = 1.5; c.strokeRect(x - 13, y - 14, 26, 28); txt(c, on ? 'ON' : 'off', x, y + 4, on ? '#fff' : C.muted, 9); };
          igbt(78, top); igbt(166, !top);
          ln(c, x, mid, 520, mid + (k - 1) * 14, top ? C.bad : C.accent, 2);
          txt(c, ['U', 'V', 'W'][k], x + 20, mid - 4, C.muted, 10);
        }
        txt(c, 'IGBT inverter', 375, 228, C.muted, 11);
        // motor with the rotating field
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(548, 122, 30, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        kit.arrow(c, 548 - 18 * Math.cos(th), 122 - 18 * Math.sin(th), 548 + 24 * Math.cos(th), 122 + 24 * Math.sin(th), 'hsl(22 90% 55%)', 3);
        txt(c, 'M', 548, 170, C.text, 12);
        // zoom: sine references against the triangle carrier, ±1.5 carrier periods around now
        const zx = 600, zy = 20, zw = 150, zh = 110, span = 3 / res.fc;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(zx, zy, zw, zh);
        const X = tt => zx + zw * (tt - (tReal - span / 2)) / span, Y = v => zy + zh / 2 - v * zh * 0.42;
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath();
        for (let i = 0; i <= 120; i++) { const tt = tReal - span / 2 + span * i / 120; i ? c.lineTo(X(tt), Y(tri(res.fc * tt))) : c.moveTo(X(tt), Y(tri(res.fc * tt))); } c.stroke();
        const cols = [C.bad, C.warn, C.accent];
        for (let k = 0; k < 3; k++) { c.strokeStyle = cols[k]; c.lineWidth = 1.8; c.beginPath(); for (let i = 0; i <= 40; i++) { const tt = tReal - span / 2 + span * i / 40, rr = refs(res.m, TAU * V.f * tt, res.svm)[k]; i ? c.lineTo(X(tt), Y(rr)) : c.moveTo(X(tt), Y(rr)); } c.stroke(); }
        ln(c, X(tReal), zy, X(tReal), zy + zh, C.text, 1);
        txt(c, 'references vs carrier (zoom)', zx + zw / 2, zy - 6, C.muted, 10);
        for (let k = 0; k < 3; k++) {
          const y0 = 150 + 20 * k;
          c.strokeStyle = cols[k]; c.lineWidth = 1.5; c.beginPath();
          for (let i = 0; i <= 120; i++) { const tt = tReal - span / 2 + span * i / 120, on = refs(res.m, TAU * V.f * tt, res.svm)[k] > tri(res.fc * tt); const yy = y0 - (on ? 10 : 0); i ? c.lineTo(X(tt), yy) : c.moveTo(X(tt), yy); }
          c.stroke(); txt(c, ['U', 'V', 'W'][k], zx - 8, y0 - 2, cols[k], 10);
        }
        txt(c, 'gate signals (top IGBT on when high)', zx + zw / 2, 222, C.muted, 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-vf-curve */
  Hyper.sim('sd-vf-curve', {
    title: 'V/f control: flux, boost and field weakening',
    blurb: `The 7.5 kW motor on a drive in V/f mode. The left graph is the drive's voltage against frequency — the V/f line, its boost and the voltage limit — with the present point; the right one the motor's torque–speed curve at the output frequency (with faint curves at 10, 25, 50, 75 and 100 Hz), the load and the operating point. The picture shows the rotating field with a length proportional to the air-gap flux.

**Try this**
- Sweep the frequency from 50 Hz down to 10 Hz with the default boost: the curve slides left keeping its shape, the flux gauge stays near 100 %.
- At 3–5 Hz set the boost to 0: the flux collapses, the breakdown torque falls below the load and the motor stalls. Raise the boost until it runs again — then keep raising it at no load and watch the magnetising current climb (overexcitation).
- Go above 50 Hz: the voltage is at its limit, the flux falls as 1/f and the breakdown torque as 1/f². At 100 Hz, can the motor still carry rated torque?
- Choose the quadratic V/f pattern with the fan load: less flux and current at part speed. Then try it with the constant-torque load at 20 Hz.
- Choose the 87 Hz connection: the motor, now in delta, keeps full flux up to 87 Hz and gives rated torque at 1.73 times the speed — while drawing 1.73 times the current.
- Tick slip compensation and load the motor: the drive raises the frequency so the speed stays near its set value.`,
    mount(box, kit) {
      const M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2] = graphs(box, 2);
      let V = null, dirty = true, cur = null, ang = 0;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Frequency set-point', min: 1, max: 100, step: 0.5, value: 50, unit: 'Hz' },
        { id: 'boost', label: 'Boost at 0 Hz, % of 400 V', min: 0, max: 10, step: 0.5, value: 4, unit: '%' },
        { id: 'pat', type: 'select', label: 'V/f pattern', options: [['Linear (constant torque)', 'lin'], ['Quadratic (fans and pumps)', 'quad']], value: 'lin' },
        { id: 'conn', type: 'select', label: 'Motor connection', options: [['400 V star, base 50 Hz', 'star'], ['230 V delta, base 87 Hz (the 87 Hz trick)', 'delta87']], value: 'star' },
        { id: 'loadType', type: 'select', label: 'Load', options: [['Constant torque (conveyor)', 'const'], ['Fan (torque ∝ speed²)', 'fan']], value: 'const' },
        { id: 'load', label: 'Load, % of rated torque (fan: at 1450 rpm)', min: 0, max: 150, step: 1, value: 80, unit: '%' },
        { id: 'sc', type: 'check', label: 'Slip compensation', value: false }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['v', 'Output voltage and frequency'], ['n', 'Speed: field, rotor, slip'], ['fl', 'Air-gap flux (100 % = rated)'], ['i', 'Current (magnetising at no load)'], ['tk', 'Breakdown torque'], ['p', 'Shaft power'], ['rg', 'Region']]);
      const pV = kit.plot(g1, { x: { label: 'frequency (Hz)', min: 0, max: 100 }, y: { label: 'output voltage (V)', min: 0, max: 450 }, legend: true }, 200);
      const pT = kit.plot(g2, { x: { label: 'speed (rpm)', min: 0, max: 3200 }, y: { label: 'torque (N·m)', min: 0 }, legend: true }, 200);
      const fn = () => V.conn === 'delta87' ? 50 * 400 / 230 : 50;
      const volt = f => { const b = V.boost / 100 * 400, u = Math.min(1, f / fn()); return Math.min(400, b + (400 - b) * (V.pat === 'quad' ? u * u : u)); };
      const TL = n => { const T0 = V.load / 100 * TN; return V.loadType === 'fan' ? T0 * Math.pow(Math.max(0, n) / 1450, 2) : T0; };
      const eRated = (() => { const im = motorAt(M, 50, 400, 'star'); const s = opSlip(im, () => TN) || 0.03; return airGapE(im, Object.assign({}, IM), s) / 50; })();
      function compute() {
        let f = V.f, im = null, s = null;
        for (let it = 0; it < (V.sc ? 4 : 1); it++) {
          im = motorAt(M, f, volt(f), V.conn); s = opSlip(im, TL);
          if (V.sc) { const T = s == null ? 1.5 * TN : im.at(s).T; f = V.f + 0.0317 * 50 * T / TN; }
        }
        const d = V.conn === 'delta87' ? 3 : 1, k = f / 50;
        const p = Object.assign({}, IM, { f, R1: IM.R1 / d, R2: IM.R2 / d, X1: IM.X1 * k / d, X2: IM.X2 * k / d, Xm: IM.Xm * k / d });
        const sOp = s == null ? im.sMax : s, o = im.at(sOp), E = airGapE(im, p, sOp) * (d === 3 ? SQ3 : 1);
        const flux = E / f / eRated, I0 = im.at(1e-4).I1;
        cur = { f, im, s, o, flux, I0, Vout: volt(f) };
        const IN = R0().IN * (d === 3 ? SQ3 : 1);
        ro.set('v', cur.Vout.toFixed(0) + ' V at ' + f.toFixed(2) + ' Hz (' + (cur.Vout / f).toFixed(1) + ' V/Hz)');
        ro.set('n', im.ns.toFixed(0) + ' rpm, ' + (s == null ? 'stalled' : o.n.toFixed(0) + ' rpm, ' + (im.ns - o.n).toFixed(0) + ' rpm'));
        ro.set('fl', (100 * flux).toFixed(0) + ' %');
        ro.set('i', (s == null ? '—' : o.I1.toFixed(1) + ' A (' + (100 * o.I1 / IN).toFixed(0) + ' % of rated ' + IN.toFixed(1) + ' A)') + '; ' + I0.toFixed(1) + ' A');
        ro.set('tk', im.Tmax.toFixed(0) + ' N·m = ' + (im.Tmax / TN).toFixed(2) + ' × rated');
        ro.set('p', s == null ? '—' : (Math.max(0, o.T * radOf(o.n)) / 1000).toFixed(2) + ' kW');
        ro.set('rg', f < 5 ? 'low frequency: the boost decides the flux' : f <= fn() + 0.1 ? 'constant flux (V ∝ f)' : 'field weakening: voltage at its limit, flux ∝ 1/f');
        const line = [], ideal = [];
        for (let i = 0; i <= 100; i++) { line.push([i, volt(i)]); ideal.push([i, Math.min(400, 400 * i / fn())]); }
        pV.set({ series: [{ pts: line, label: 'V/f with boost' }, { pts: ideal, label: 'constant flux, no boost', dash: [4, 4] }], marks: [{ x: f, y: cur.Vout, label: 'now' }], hlines: [{ y: 400, label: 'limit' }] });
        const fam = [10, 25, 50, 75, 100].map(ff => { const m2 = motorAt(M, ff, volt(ff), V.conn), pts = []; for (let i = 1; i <= 80; i++) { const r = m2.at(i / 80); pts.push([r.n, r.T]); } return { pts, color: kit.colors().faint }; });
        const main = []; for (let i = 1; i <= 160; i++) { const r = im.at(Math.pow(i / 160, 1.5)); main.push([r.n, r.T]); }
        const lc = []; for (let i = 0; i <= 40; i++) { const nn = 3200 * i / 40; lc.push([nn, TL(nn)]); }
        pT.set({ series: fam.map((q, i) => i === 0 ? { pts: q.pts, color: q.color, label: '10–100 Hz' } : { pts: q.pts, color: q.color }).concat([{ pts: main, label: 'at ' + f.toFixed(1) + ' Hz' }, { pts: lc, label: 'load', color: kit.colors().muted, dash: [5, 4] }]), marks: s == null ? [] : [{ x: o.n, y: o.T, label: 'now' }], hlines: [{ y: TN, label: 'rated' }] });
        dirty = false;
      }
      const R0 = () => ref(M);
      const loop = kit.loop(dt => {
        if (dirty) compute();
        if (!cur) return;
        ang += TAU * cur.f * dt / 25;
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 210);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 210 * s) / 2); c.scale(s, s);
        const cx = 110, cy = 105;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, 85, 0, TAU); c.stroke(); c.beginPath(); c.arc(cx, cy, 60, 0, TAU); c.stroke();
        const L = 55 * clamp(cur.flux, 0, 1.6);
        kit.arrow(c, cx - L * 0.7 * Math.cos(ang), cy - L * 0.7 * Math.sin(ang), cx + L * Math.cos(ang), cy + L * Math.sin(ang), 'hsl(22 90% 55%)', 4);
        txt(c, 'field (drawn 25 × slower)', cx, 205, C.muted, 10);
        const bar = (x, y, label, frac, val, bad) => { txt(c, label, x, y - 6, C.muted, 11, 'left'); c.fillStyle = C.faint; c.fillRect(x, y, 200, 12); c.fillStyle = bad ? C.bad : C.accent; c.fillRect(x, y, 200 * clamp(frac, 0, 1), 12); txt(c, val, x + 206, y + 10, C.text, 11, 'left'); };
        bar(240, 30, 'air-gap flux', cur.flux / 1.5, (100 * cur.flux).toFixed(0) + ' %', cur.flux > 1.15 || cur.flux < 0.6);
        bar(240, 72, 'voltage (of 400 V)', cur.Vout / 400, cur.Vout.toFixed(0) + ' V', false);
        bar(240, 114, 'breakdown torque (of 3 × rated)', cur.im.Tmax / (3 * TN), (cur.im.Tmax / TN).toFixed(2) + ' ×', cur.im.Tmax < 1.3 * TN);
        const IN = ref(M).IN * (V.conn === 'delta87' ? SQ3 : 1), Ia = cur.s == null ? 0 : cur.o.I1;
        bar(240, 156, 'current (of 2 × rated)', Ia / (2 * IN), cur.s == null ? 'stalled' : Ia.toFixed(1) + ' A', Ia > 1.1 * IN || cur.s == null);
        txt(c, V.conn === 'delta87' ? 'Δ 230 V motor on 400 V: base 87 Hz' : 'Y 400 V motor: base 50 Hz', 600, 40, C.text, 12);
        txt(c, cur.f.toFixed(1) + ' Hz', 600, 80, C.accent, 22);
        txt(c, (cur.Vout / cur.f).toFixed(1) + ' V/Hz', 600, 108, C.muted, 13);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-vector */
  Hyper.sim('sd-vector', {
    title: 'A load step at low speed: V/f against vector control',
    blurb: `The 7.5 kW motor runs slowly on a drive; press *Load step* to throw a load on it. In **V/f** the drive only sets a frequency: the motor slows by its slip (or stalls, if the load is beyond its low-frequency breakdown torque). **Slip compensation** raises the frequency as the load rises, slowly. **Sensorless vector** control estimates the flux from a motor model and runs a speed loop that commands torque directly: it pulls the speed back in a fraction of a second, but its estimate fades near zero frequency. **Closed-loop vector** knows the rotor position from an encoder and holds speed almost exactly, even at standstill. The diagram shows the stator current split into its flux part I_d and torque part I_q.

**Try this**
- At 150 rpm (5 Hz), apply a 100 % load step in each mode and compare the speed dip, the recovery and the steady error.
- Raise the step to 150 % in V/f: the motor stalls and the weight pulls it backwards. Vector control delivers it — up to its current limit of 160 %.
- Set the speed to 0 rpm and apply the load — the step is a hanging weight, as on a hoist: V/f and sensorless vector let it creep down; closed-loop vector holds the shaft still (a real hoist also needs a brake).
- Watch the current diagram: in vector control I_d stays constant and only I_q follows the load; in V/f both change on their own.`,
    mount(box, kit) {
      const M = kit.motor, R = ref(M);
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 200 });
      const [g1, g2] = graphs(box, 2);
      const J = 0.12, I0 = R.im.at(1e-4).I1, IQN = Math.sqrt(Math.max(1, R.IN * R.IN - I0 * I0)), SLIPHZ = R.sN * 50;
      let V = null, t = 0, w = 0, loadOn = false, braked = false, fsc = 0, integ = 0, Tm = 0, tStep = -1, dip = 0, rec = null, lastPlot = -1, ang = 0, Id = I0, Iq = 0, Iabs = 0;
      const hS = [], hR = [], hT = [], hL = [];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Control mode', options: [['V/f (with 4 % boost)', 'vf'], ['V/f + slip compensation', 'vfsc'], ['Sensorless vector', 'slv'], ['Closed-loop vector (encoder)', 'clv']], value: 'vf' },
        { id: 'nset', label: 'Speed set-point', min: 0, max: 1500, step: 5, value: 150, unit: 'rpm' },
        { id: 'step', label: 'Load step', min: 0, max: 150, step: 5, value: 100, unit: '% of rated' },
        { type: 'buttons', items: [{ id: 'load', label: 'Load step on / off', primary: true }, { id: 'reset', label: 'Restart' }] }
      ], id => {
        if (id === 'load') { loadOn = !loadOn; tStep = t; dip = 0; rec = null; if (!loadOn) braked = false; }
        if (id === 'reset' || id === 'mode') { w = radOf(V.nset) * 0.97; integ = 0; fsc = 0; loadOn = false; braked = false; tStep = -1; Tm = 0.05 * TN; }
        lastPlot = -1;
      });
      V = ctl.values;
      w = radOf(V.nset);
      const ro = kit.readout(box.side, [['n', 'Speed: set, actual, error'], ['f', 'Stator frequency'], ['T', 'Motor torque, load'], ['I', 'Current: I_d (flux) · I_q (torque) · total'], ['d', 'After the step: largest dip, recovery']]);
      const pS = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'speed (rpm)' }, legend: true }, 180);
      const pT = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'torque (N·m)' }, legend: true }, 180);
      const loop = kit.loop(dt => {
        t += dt;
        // the step is a hanging weight (active: it can drive the shaft backwards); 5 % friction is passive
        const Tw = (loadOn ? V.step / 100 : 0) * TN, Tf = 0.05 * TN, TLtot = Tw + Tf, nset = V.nset, wset = radOf(nset);
        const sub = 40, h = dt / sub;
        let fstat = 0, im = null;
        if (V.mode === 'vf' || V.mode === 'vfsc') {
          const fset = nset / 30 + (V.mode === 'vfsc' ? fsc : 0), f = Math.max(0.2, fset);
          im = motorAt(M, f, M.vf({ Vn: 400, fn: 50, f, boost: 16 }), 'star'); fstat = f;
        }
        for (let k = 0; k < sub; k++) {
          if (im) {
            const s = 1 - w / im.ws;
            Tm = s >= 0 ? im.at(Math.min(1, Math.max(1e-6, s))).T : -im.at(Math.min(1, -s)).T;
            if (V.mode === 'vfsc') fsc += h * (SLIPHZ * clamp(Tm / TN, -1.5, 1.5) - fsc) / 0.4;
          } else {
            // speed loop commanding torque; sensorless: estimate off by a tenth of the slip and a weaker loop, torque fading below ~1 Hz
            const slv = V.mode === 'slv', wc = TAU * (slv ? 8 : 25);
            const wEst = w + (slv ? 0.1 * radOf(SLIPHZ * 30) * Tm / TN : 0);
            const e = wset - wEst, Kp = J * wc, Ki = Kp * wc / 4;
            fstat = w * 2 / TAU + (Tm / TN) * SLIPHZ;
            const lim = 1.6 * TN * (slv ? clamp((Math.abs(fstat) + 0.1) / 1.0, 0.25, 1) : 1);
            let Tc = Kp * e + Ki * integ;
            if (Math.abs(Tc) < lim || Tc * e < 0) integ += e * h;
            Tc = clamp(Tc, -lim, lim);
            Tm += h * (Tc - Tm) / (slv ? 0.006 : 0.002);
          }
          if (braked) { w = 0; Tm = 0; continue; }
          const drive = Tm - Tw;                                  // motor against the weight; friction opposes the motion
          if (Math.abs(w) < 1e-3 && Math.abs(drive) <= Tf) w = 0;
          else w += h * (drive - Tf * Math.sign(Math.abs(w) < 1e-3 ? drive : w)) / J;
        }
        // a drive whose motor is dragged backwards by the weight trips (stall), and the hoist brake sets
        if (!braked && rpmOf(w) < -100) { braked = true; w = 0; Tm = 0; }
        const n = rpmOf(w);
        if (tStep >= 0 && loadOn) { dip = Math.max(dip, nset - n); if (rec == null && t - tStep > 0.05 && Math.abs(n - nset) < 15) rec = t - tStep; }
        // the current and its parts
        if (im) { const s = clamp(1 - w / im.ws, 1e-6, 1), o = im.at(s), ph = Math.acos(clamp(o.pf, -1, 1)); Iabs = o.I1; Id = o.I1 * Math.sin(ph); Iq = o.I1 * Math.cos(ph); }
        else { Id = I0; Iq = IQN * Tm / TN; Iabs = Math.hypot(Id, Iq); }
        push(hS, t, n, 8); push(hR, t, nset, 8); push(hT, t, Tm, 8); push(hL, t, TLtot, 8);
        ro.set('n', nset.toFixed(0) + ' · ' + n.toFixed(0) + ' · ' + (n - nset).toFixed(1) + ' rpm');
        ro.set('f', fstat.toFixed(2) + ' Hz');
        ro.set('T', Tm.toFixed(1) + ' N·m, ' + TLtot.toFixed(1) + ' N·m');
        ro.set('I', Id.toFixed(1) + ' · ' + Iq.toFixed(1) + ' · ' + Iabs.toFixed(1) + ' A');
        ro.set('d', braked ? 'STALLED — the drive tripped and the brake set (press Load step off, or Restart)' : tStep < 0 ? 'press Load step' : dip.toFixed(0) + ' rpm, ' + (rec != null ? rec.toFixed(2) + ' s' : n < 1 && nset > 0 ? 'stalled' : 'not within 15 rpm yet'));
        if (t - lastPlot > 0.08 || lastPlot < 0) {
          lastPlot = t;
          const xr = { label: 'time (s)', min: t - 8, max: t };
          pS.set({ x: xr, series: [{ pts: hR.slice(), label: 'set-point', dash: [5, 3] }, { pts: hS.slice(), label: 'actual' }] });
          pT.set({ x: xr, series: [{ pts: hT.slice(), label: 'motor' }, { pts: hL.slice(), label: 'load', dash: [5, 3] }] });
        }
        // ---- drawing: the current vector split into I_d and I_q; the shaft and its speed
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 220);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 220 * s) / 2); c.scale(s, s);
        const ox = 70, oy = 180, sc = 5.5;
        ln(c, ox, oy, ox + 170, oy, C.muted, 1); ln(c, ox, oy, ox, oy - 160, C.muted, 1);
        txt(c, 'd (flux axis)', ox + 170, oy + 16, C.muted, 11, 'right'); txt(c, 'q (torque axis)', ox + 4, oy - 166, C.muted, 11, 'left');
        kit.arrow(c, ox, oy, ox + Id * sc, oy, 'hsl(215 80% 55%)', 3);
        kit.arrow(c, ox + Id * sc, oy, ox + Id * sc, oy - Iq * sc, 'hsl(28 90% 55%)', 3);
        kit.arrow(c, ox, oy, ox + Id * sc, oy - Iq * sc, C.text, 2);
        txt(c, 'I_d ' + Id.toFixed(1) + ' A', ox + Id * sc / 2, oy + 16, 'hsl(215 80% 55%)', 11);
        txt(c, 'I_q ' + Iq.toFixed(1) + ' A', ox + Id * sc + 8, oy - Iq * sc / 2, 'hsl(28 90% 55%)', 11, 'left');
        txt(c, im ? 'V/f: the current splits by itself' : 'vector: I_d held, I_q commanded', 180, 20, C.text, 12);
        // shaft dial
        ang += w * dt / 10;
        const dx = 520, dy = 110;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(dx, dy, 70, 0, TAU); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 5; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + 60 * Math.cos(ang), dy + 60 * Math.sin(ang)); c.stroke();
        kit.dot(c, dx, dy, 6, C.text);
        txt(c, n.toFixed(0) + ' rpm', dx, dy + 95, Math.abs(n - nset) > 15 ? C.warn : C.ok, 16);
        txt(c, 'shaft drawn 10 × slower', dx, dy + 112, C.muted, 10);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-vfd-ramps */
  Hyper.sim('sd-vfd-ramps', {
    title: 'Commissioning a drive: ramps, limits and trips',
    blurb: `An 11 kW motor (rated 21 A, 71.7 N·m) on a heavy-duty drive, with the essential parameters in the side panel and on the keypad display. The drive ramps its frequency towards the set-point; the motor must supply the torque the ramp and the load demand, and the current follows that torque. Decelerating, the motor generates and the energy lifts the DC bus. There is no brake resistor here.

**Try this**
- With the heavy fan (6 kg·m²) press *Run* with a 10 s ramp: the current hits its limit and the drive stretches the ramp (stall prevention). Untick stall prevention: the drive trips on overcurrent. A ramp of about 20 s just fits.
- *Stop* with a 10 s deceleration and overvoltage control off: the DC bus climbs to its trip level (OV). Tick overvoltage control: the drive eases the deceleration whenever the bus passes 760 V, and the stop simply takes longer. Or choose *coast* and let the fan run down on its own.
- Set a minimum frequency of 25 Hz and move the set-point to 10 Hz: the drive will not go below 25 Hz — as a pump drive should.
- Try the conveyor and the pump: their small inertia allows much shorter acceleration ramps — but a 3 s deceleration of the conveyor still lifts the bus to its trip.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2, g3] = graphs(box, 3);
      const TN11 = 11000 / radOf(1465), IN11 = 21, ID11 = 7.4, IQN11 = Math.sqrt(IN11 * IN11 - ID11 * ID11), CDC = 1.5e-3, JM = 0.06;
      const LOADS = { fan: { J: 6, T: n => 2 + 60 * Math.pow(n / 1465, 2), name: 'fan, 6 kg·m²' }, conv: { J: 1.2, T: n => 50, name: 'conveyor, 1.2 kg·m²' }, pump: { J: 0.3, T: n => 55 * Math.pow(n / 1465, 2), name: 'pump, 0.3 kg·m²' } };
      let V = null, t = 0, w = 0, fref = 0, state = 'stop', fault = '', vdc = 540, th = 0, Tm = 0, I = 0, held = '', lastPlot = -1, ang = 0;
      const hF = [], hN = [], hI = [], hV = [];
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Machine', options: [['Heavy fan (6 kg·m²)', 'fan'], ['Conveyor (1.2 kg·m², 70 % torque)', 'conv'], ['Pump (0.3 kg·m²)', 'pump']], value: 'fan' },
        { id: 'set', label: 'Speed set-point', min: 0, max: 75, step: 0.5, value: 50, unit: 'Hz' },
        { id: 'acc', label: 'P: acceleration time (0 → max frequency)', min: 1, max: 60, step: 0.5, value: 10, unit: 's' },
        { id: 'dec', label: 'P: deceleration time (max → 0)', min: 1, max: 60, step: 0.5, value: 10, unit: 's' },
        { id: 'ilim', label: 'P: current limit', min: 100, max: 200, step: 5, value: 150, unit: '%' },
        { id: 'fmin', label: 'P: minimum frequency', min: 0, max: 30, step: 0.5, value: 0, unit: 'Hz' },
        { id: 'fmax', label: 'P: maximum frequency', min: 30, max: 75, step: 0.5, value: 50, unit: 'Hz' },
        { id: 'stop', type: 'select', label: 'P: stop mode', options: [['Ramp to stop', 'ramp'], ['Coast (inverter off)', 'coast']], value: 'ramp' },
        { id: 'stall', type: 'check', label: 'P: stall prevention (stretch the ramp at the current limit)', value: true },
        { id: 'ovc', type: 'check', label: 'P: overvoltage control (ease the deceleration above 760 V)', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run', primary: true }, { id: 'stopb', label: 'Stop' }, { id: 'reset', label: 'Reset fault' }] }
      ], id => {
        if (id === 'run' && !fault) state = 'run';
        if (id === 'stopb' && state === 'run') state = V.stop === 'coast' ? 'coast' : 'decel';
        if (id === 'reset' && fault && vdc < 780 && th < 1) { fault = ''; state = 'stop'; fref = 0; }
        lastPlot = -1;
      });
      V = ctl.values;
      const ro = kit.readout(box.side, [['st', 'Drive'], ['f', 'Output frequency · motor speed'], ['i', 'Motor current'], ['v', 'DC bus'], ['h', 'Ramp']]);
      const pF = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'frequency (Hz)', min: 0 }, legend: true }, 160);
      const pI = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'current (% of rated)', min: 0 } }, 160);
      const pV = kit.plot(g3, { x: { label: 'time (s)' }, y: { label: 'DC bus (V)', min: 500, max: 860 } }, 160);
      const loop = kit.loop(dt => {
        t += dt;
        const ld = LOADS[V.load], J = JM + ld.J, sub = 20, h = dt / sub;
        const Tlim = TN11 * Math.sqrt(Math.max(0, Math.pow(V.ilim / 100 * IN11, 2) - ID11 * ID11)) / IQN11;
        held = '';
        for (let k = 0; k < sub; k++) {
          const n = rpmOf(w), TL = ld.T(n) * (n < 1 && V.load === 'conv' ? 1.15 : 1);
          const on = (state === 'run' || state === 'decel') && !fault;
          let target = state === 'run' ? clamp(V.set, V.fmin, V.fmax) : 0;
          const up = V.fmax / V.acc, dn = V.fmax / V.dec;
          let df = target > fref ? Math.min(up * h, target - fref) : -Math.min(dn * h, fref - target);
          const wref = Math.PI * fref, need = J * (df / h) * Math.PI + TL + J * 20 * (wref - w);
          if (on) {
            // stall prevention: the ramp slows to the acceleration the current limit allows (or the drive trips)
            const spare = (sgn) => (sgn * Tlim - TL - J * 20 * (wref - w)) * h / (J * Math.PI);
            if (need > Tlim && df > 0) { if (V.stall) { df = clamp(spare(1), 0, df); held = 'ramp stretched by the current limit'; } else if (need > 2.0 * TN11) { fault = 'OC — overcurrent'; } }
            if (need < -Tlim && df < 0) { df = clamp(spare(-1), df, 0); held = 'ramp stretched by the current limit'; }
            // overvoltage control: the deceleration is eased as the bus approaches 780 V
            if (V.ovc && vdc > 760 && df < 0) { df *= clamp((780 - vdc) / 20, 0, 1); held = 'ramp stretched by overvoltage control'; }
            fref = clamp(fref + df, 0, 80);
            Tm = clamp(J * (df / h) * Math.PI + TL + J * 20 * (Math.PI * fref - w), -Tlim, Tlim);
            if (fault) Tm = 0;
          } else Tm = 0;
          if (state === 'coast' || fault) fref = rpmOf(w) / 30;
          w = Math.max(0, w + h * (Tm - TL * (w > 0.01 || Tm > TL ? 1 : 0)) / J);
          if (w <= 0 && Tm <= TL) w = 0;
          I = on && !fault ? Math.hypot(ID11, IQN11 * Tm / TN11) : 0;
          // DC bus: the motor's power plus its and the drive's losses; the rectifier holds it up at 540 V but cannot take power back
          const Pout = (on && !fault ? Tm * w + 400 * (0.3 + 0.7 * Math.pow(I / IN11, 2)) + 150 : 0) + 30;   // + the control electronics
          if (Pout < 0 || vdc > 540.5) vdc = Math.max(540, vdc - h * Pout / (CDC * vdc));
          if (vdc > 820 && !fault) fault = 'OV — DC bus overvoltage';
          th = Math.max(0, th + h * (Math.pow(I / IN11, 2) - th) / 300);
          if (th > 1.3225 && !fault) fault = 'OL — motor overload';
          if (fault) { state = 'coast'; }
          if (state === 'decel' && fref <= 0.01 && w < 0.5) { state = 'stop'; fref = 0; }
          if (state === 'coast' && w < 0.05) { state = 'stop'; fref = 0; }
        }
        const n = rpmOf(w);
        push(hF, t, fref, 60); push(hN, t, n / 30, 60); push(hI, t, 100 * I / IN11, 60); push(hV, t, vdc, 60);
        ro.set('st', fault ? 'FAULT ' + fault : state === 'run' ? 'RUN' : state === 'decel' ? 'decelerating' : state === 'coast' ? 'coasting (inverter off)' : 'stopped');
        ro.set('f', fref.toFixed(1) + ' Hz · ' + n.toFixed(0) + ' rpm');
        ro.set('i', I.toFixed(1) + ' A = ' + (100 * I / IN11).toFixed(0) + ' % (limit ' + V.ilim + ' %)');
        ro.set('v', vdc.toFixed(0) + ' V' + (vdc > 760 ? ' — braking energy!' : ''));
        ro.set('h', held || '—');
        if (t - lastPlot > 0.12 || lastPlot < 0) {
          lastPlot = t;
          const xr = { label: 'time (s)', min: t - 60, max: t };
          pF.set({ x: xr, series: [{ pts: hF.slice(), label: 'drive frequency' }, { pts: hN.slice(), label: 'motor speed (as Hz)', dash: [5, 3] }] });
          pI.set({ x: xr, series: [{ pts: hI.slice(), label: 'current' }], hlines: [{ y: V.ilim, label: 'limit' }] });
          pV.set({ x: xr, series: [{ pts: hV.slice(), label: 'DC bus' }], hlines: [{ y: 820, label: 'OV trip' }, { y: 760, label: 'OV control' }] });
        }
        // ---- drawing: a drive keypad with its display, and the machine
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 210);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 210 * s) / 2); c.scale(s, s);
        c.fillStyle = C.surface2 || C.surface; c.fillRect(20, 10, 330, 190); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(20, 10, 330, 190);
        c.fillStyle = 'hsl(160 35% 18%)'; c.fillRect(35, 22, 300, 120);
        const lcd = (s2, y, col) => txt(c, s2, 45, y, col || 'hsl(140 80% 70%)', 12, 'left');
        if (fault && Math.floor(t * 2) % 2 === 0) lcd('*** ' + fault + ' ***', 42, 'hsl(0 90% 70%)');
        else lcd((state === 'run' ? 'RUN ' : state === 'stop' ? 'STOP' : state === 'decel' ? 'DEC ' : 'COAST') + '  F ' + fref.toFixed(1) + ' Hz   I ' + I.toFixed(1) + ' A', 42);
        lcd('DC bus ' + vdc.toFixed(0) + ' V   n ' + n.toFixed(0) + ' rpm', 60);
        lcd('P1.02 Motor current   21.0 A', 82, 'hsl(140 50% 60%)');
        lcd('P2.01 Accel ' + V.acc.toFixed(1) + ' s   Decel ' + V.dec.toFixed(1) + ' s', 98, 'hsl(140 50% 60%)');
        lcd('P2.05 Min ' + V.fmin.toFixed(1) + ' Hz   Max ' + V.fmax.toFixed(1) + ' Hz', 114, 'hsl(140 50% 60%)');
        lcd('P3.01 I-limit ' + V.ilim + ' %   Stop ' + V.stop, 130, 'hsl(140 50% 60%)');
        ['RUN', 'STOP', '▲', '▼', 'ENT'].forEach((k, i) => { c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(40 + 60 * i, 155, 48, 28); txt(c, k, 64 + 60 * i, 174, C.text, 11); });
        ang += w * dt / 8;
        const mx = 520, my = 105;
        if (V.load === 'fan') { c.save(); c.translate(mx, my); c.rotate(ang); for (let k = 0; k < 6; k++) { c.rotate(TAU / 6); c.fillStyle = 'hsl(200 60% 55% / .75)'; c.beginPath(); c.ellipse(0, -42, 13, 38, 0, 0, TAU); c.fill(); } c.restore(); }
        else if (V.load === 'pump') { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx, my, 45, 0, TAU); c.stroke(); c.save(); c.translate(mx, my); c.rotate(ang); for (let k = 0; k < 5; k++) { c.rotate(TAU / 5); ln(c, 0, 0, 0, -38, C.accent, 3); } c.restore(); }
        else { c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(mx - 90, my, 22, 0, TAU); c.stroke(); c.beginPath(); c.arc(mx + 90, my, 22, 0, TAU); c.stroke(); ln(c, mx - 90, my - 22, mx + 90, my - 22, C.text); ln(c, mx - 90, my + 22, mx + 90, my + 22, C.text); for (let k = 0; k < 5; k++) { const x = mx - 90 + ((ang * 22 + k * 40) % 180); c.fillStyle = C.warn; c.fillRect(x, my - 38, 20, 16); } }
        kit.dot(c, mx, my, 5, C.text);
        txt(c, LOADS[V.load].name + ' — ' + n.toFixed(0) + ' rpm', mx, 200, C.muted, 11);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-vfd-braking */
  Hyper.sim('sd-vfd-braking', {
    title: 'Stopping a heavy fan',
    blurb: `An 11 kW, 1465 rpm motor on a drive turns a fan of 6 kg·m² — about 70 kJ of kinetic energy. Press *Stop from full speed* and choose how the drive gets rid of it. The picture shows where the power goes: into the DC bus, a brake resistor, the mains, the rotor, the air and the losses. Graphs: speed, power and DC bus voltage since the stop (the previous run dashed).

**Try this**
- *Overvoltage control only* with a 10 s ramp: the bus rises to about 760 V and the drive stretches the stop — the losses can absorb only a small fraction of the power.
- *Brake resistor* at 39 Ω: the chopper switches it in above 760 V, the fan stops in 10 s and the resistor heats up. Raise the resistance to 150 Ω: it cannot take the peak power (V²/R) and the drive trips on overvoltage.
- *DC injection from full speed*: almost nothing happens at first — the braking torque is tiny at high speed — then it grips near standstill. Compare *ramp, then DC below 5 Hz*, the way drives use it.
- *Regenerative front end*: the same 10 s stop, with the energy returned to the mains.
- Untick the fan's own drag to see a pure flywheel: coasting then takes minutes.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2, g3] = graphs(box, 3);
      const TN11 = 11000 / radOf(1465), IN11 = 21, ID11 = 7.4, IQN11 = Math.sqrt(IN11 * IN11 - ID11 * ID11), J = 6.06, CDC = 1.5e-3, WN = radOf(1465);
      // 11 kW rotor and magnetising branch scaled from the reference motor, for the DC-injection torque (a current-fed machine)
      const kz = 7.5 / 11, R2 = IM.R2 * kz, X2 = IM.X2 * kz, XM = IM.Xm * kz;
      const dcTorque = (w, Idc) => { const u = Math.max(1e-4, w / WS), r = R2 * (1 + u) / u, I = 0.816 * Idc; return 3 * I * I * XM * XM * r / (r * r + (X2 + XM) * (X2 + XM)) / WS; };
      let V = null, t = 0, w = WN, state = 'run', t0 = 0, vdc = 540, Tr = 30, chop = false, fault = '', wref = WN, dcOn = false, lastPlot = -1, ang = 0;
      let E = { res: 0, grid: 0, rotor: 0, loss: 0, air: 0 }, Pn = { shaft: 0, res: 0, grid: 0, rotor: 0 }, tStop = null, peakP = 0, peakV = 540;
      let hW = [], hP = [], hR = [], hV = [], prev = [];
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Braking method', options: [['Ramp with overvoltage control only', 'ovc'], ['Ramp with brake chopper and resistor', 'res'], ['DC injection from full speed', 'dc'], ['Ramp, then DC injection below 5 Hz', 'dcend'], ['Regenerative front end', 'afe'], ['Coast (inverter off)', 'coast']], value: 'res' },
        { id: 'dec', label: 'Deceleration time wanted', min: 2, max: 60, step: 1, value: 10, unit: 's' },
        { id: 'R', label: 'Brake resistor (drive minimum 20 Ω)', min: 20, max: 200, step: 1, value: 39, unit: 'Ω' },
        { id: 'idc', label: 'DC injection current', min: 50, max: 150, step: 5, value: 100, unit: '% of rated' },
        { id: 'drag', type: 'check', label: 'Fan\'s own air drag', value: true },
        { type: 'buttons', items: [{ id: 'stop', label: 'Stop from full speed', primary: true }, { id: 'run', label: 'Run up again' }] }
      ], id => {
        if (id === 'stop') { if (hW.length) prev = hW.slice(); w = WN; wref = WN; state = 'stop'; t0 = t; fault = ''; vdc = 540; dcOn = false; tStop = null; peakP = 0; peakV = 540; E = { res: 0, grid: 0, rotor: 0, loss: 0, air: 0 }; hW = []; hP = []; hR = []; hV = []; }
        if (id === 'run') { w = WN; wref = WN; state = 'run'; fault = ''; vdc = 540; }
        if (id === 'm') show();
        lastPlot = -1;
      });
      V = ctl.values;
      function show() { ctl.show('R', V.m === 'res'); ctl.show('idc', V.m === 'dc' || V.m === 'dcend'); ctl.show('dec', V.m !== 'dc' && V.m !== 'coast'); }
      show();
      const ro = kit.readout(box.side, [['e', 'Kinetic energy at full speed'], ['n', 'Speed, time since Stop'], ['p', 'Braking power now, peak'], ['v', 'DC bus now, peak'], ['r', 'Resistor: V²/R at 760 V, temperature'], ['go', 'Energy so far: resistor · mains · rotor · losses · air'], ['st', 'State']]);
      const pW = kit.plot(g1, { x: { label: 'time since Stop (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0, max: 1550 }, legend: true }, 160);
      const pP = kit.plot(g2, { x: { label: 'time since Stop (s)', min: 0 }, y: { label: 'power (kW)', min: 0 }, legend: true }, 160);
      const pV = kit.plot(g3, { x: { label: 'time since Stop (s)', min: 0 }, y: { label: 'DC bus (V)', min: 500, max: 860 } }, 160);
      const drag = ww => V.drag ? 2 + 60 * Math.pow(Math.max(0, ww) / WN, 2) : 2;
      const loop = kit.loop(dt => {
        t += dt;
        const sub = 40, h = dt / sub, m = V.m;
        for (let k = 0; k < sub; k++) {
          const Td = w > 1e-3 ? drag(w) : 0;
          let Tm = 0, Pshaft = 0, Pres = 0, Pgrid = 0, Prot = 0, Ploss = 0;
          if (state === 'run') { Tm = drag(w); wref = WN; }
          else if (state === 'stop' && !fault) {
            const ramp = (m === 'ovc' || m === 'res' || m === 'afe' || (m === 'dcend' && !dcOn));
            if (ramp) {
              let dw = -WN / V.dec * h;
              if ((m === 'ovc' || m === 'dcend') && vdc > 760) dw *= clamp((780 - vdc) / 20, 0, 1);
              wref = Math.max(0, wref + dw);
              const Tlim = 1.5 * TN11;
              Tm = clamp(J * dw / h + Td + J * 20 * (wref - w), -Tlim, Tlim);
              if (m === 'dcend' && wref <= radOf(150)) dcOn = true;
            }
            if (m === 'dc' || dcOn) { const Tb = dcTorque(w, V.idc / 100 * IN11); Tm = -Tb; Prot = Tb * w; }
          }
          const I = state === 'stop' && !fault && m !== 'coast' && !(m === 'dc' || dcOn) ? Math.hypot(ID11, IQN11 * Tm / TN11) : 0;
          if (state !== 'stop' || m === 'coast' || fault) Tm = state === 'run' ? Tm : 0;
          // power flows (the shaft power is negative while the motor brakes)
          Pshaft = Tm * w;
          if (state === 'stop' && !fault && m !== 'coast' && !(m === 'dc' || dcOn)) {
            Ploss = 400 * (0.3 + 0.7 * Math.pow(I / IN11, 2)) + 150;
            const Pbus = -Pshaft - Ploss;                          // what reaches the DC bus from the motor
            if (m === 'afe') { Pgrid = Math.max(0, Pbus) * 0.97; }
            else {
              if (m === 'res') { if (vdc > 760) chop = true; if (vdc < 740) chop = false; Pres = chop ? vdc * vdc / V.R : 0; } else chop = false;
              const net = Pbus - Pres;
              if (net > 0 || vdc > 540.5) vdc = Math.max(540, vdc + h * net / (CDC * vdc));
              if (vdc > 820) fault = 'OV trip — the drive let the fan coast';
            }
          } else { chop = false; if (vdc > 540) vdc = Math.max(540, vdc - h * 30 / (CDC * vdc)); }
          if (m === 'dc' || dcOn) Ploss = 0;
          w = Math.max(0, w + h * (Tm - Td) / J);
          Tr += h * (Pres - (Tr - 30) / 0.25) / 600;       // a resistor of about 1 kW continuous: 600 J/K, 0.25 K/W
          if (state === 'stop') { E.res += Pres * h; E.grid += Pgrid * h; E.rotor += Prot * h; E.loss += Ploss * h; E.air += Td * w * h; }
          Pn = { shaft: -Pshaft, res: Pres, grid: Pgrid, rotor: Prot };
          peakV = Math.max(peakV, vdc);
        }
        if (state === 'stop') { peakP = Math.max(peakP, Pn.shaft); if (tStop == null && w < radOf(5)) tStop = t - t0; if (dcOn && w < 0.01) dcOn = false; }
        const n = rpmOf(w), ts = state === 'stop' ? t - t0 : 0;
        if (state === 'stop' && ts < 400) { hW.push([ts, n]); hP.push([ts, Math.max(0, Pn.shaft) / 1000]); hR.push([ts, (Pn.res + Pn.grid) / 1000]); hV.push([ts, vdc]); }
        const Ek = 0.5 * J * WN * WN;
        ro.set('e', (Ek / 1000).toFixed(1) + ' kJ (½ J ω²)');
        ro.set('n', n.toFixed(0) + ' rpm, ' + (state === 'stop' ? ts.toFixed(1) + ' s' + (tStop != null ? ' (stopped in ' + tStop.toFixed(1) + ' s)' : '') : 'running'));
        ro.set('p', (Math.max(0, Pn.shaft) / 1000).toFixed(1) + ' kW, ' + (peakP / 1000).toFixed(1) + ' kW');
        ro.set('v', vdc.toFixed(0) + ' V, ' + peakV.toFixed(0) + ' V');
        ro.set('r', (760 * 760 / V.R / 1000).toFixed(1) + ' kW, ' + Tr.toFixed(0) + ' °C');
        ro.set('go', [E.res, E.grid, E.rotor, E.loss, E.air].map(x => (x / 1000).toFixed(1)).join(' · ') + ' kJ');
        ro.set('st', fault ? fault : state === 'run' ? 'running at 1465 rpm' : tStop != null ? 'stopped' : dcOn || V.m === 'dc' ? 'DC injection' : V.m === 'coast' ? 'coasting' : 'decelerating');
        if (t - lastPlot > 0.15 || lastPlot < 0) {
          lastPlot = t;
          const xmax = Math.max(10, ts + 1, prev.length ? prev[prev.length - 1][0] : 0);
          pW.set({ x: { label: 'time since Stop (s)', min: 0, max: Math.min(400, xmax) }, series: [{ pts: hW.slice(), label: 'this stop' }].concat(prev.length ? [{ pts: prev, label: 'previous', dash: [5, 3], color: kit.colors().muted }] : []) });
          pP.set({ x: { label: 'time since Stop (s)', min: 0, max: Math.min(400, xmax) }, series: [{ pts: hP.slice(), label: 'braking power at the shaft' }, { pts: hR.slice(), label: 'into resistor / mains' }] });
          pV.set({ x: { label: 'time since Stop (s)', min: 0, max: Math.min(400, xmax) }, series: [{ pts: hV.slice(), label: 'DC bus' }], hlines: [{ y: 760, label: 'chopper / OV control' }, { y: 820, label: 'OV trip' }] });
        }
        // ---- drawing: where the energy goes
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 210);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 210 * s) / 2); c.scale(s, s);
        ang += w * dt / 8;
        c.save(); c.translate(70, 105); c.rotate(ang); for (let k = 0; k < 6; k++) { c.rotate(TAU / 6); c.fillStyle = 'hsl(200 60% 55% / .75)'; c.beginPath(); c.ellipse(0, -36, 11, 32, 0, 0, TAU); c.fill(); } c.restore();
        txt(c, 'fan 6 kg·m²', 70, 195, C.muted, 11);
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(190, 105, 28, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke(); txt(c, 'M', 190, 110, C.text, 13);
        const flow = (x1, y1, x2, y2, P, col) => { if (P > 50) kit.arrow(c, x1, y1, x2, y2, col, clamp(2 + P / 1500, 2, 10)); };
        flow(118, 105, 160, 105, Pn.shaft, C.warn);
        // drive with its DC bus gauge
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(260, 45, 120, 120); txt(c, 'drive', 320, 40, C.muted, 11);
        const u = clamp((vdc - 500) / 350, 0, 1);
        c.fillStyle = C.faint; c.fillRect(300, 60, 40, 90); c.fillStyle = vdc > 800 ? C.bad : vdc > 700 ? C.warn : C.accent; c.fillRect(300, 150 - 90 * u, 40, 90 * u);
        txt(c, vdc.toFixed(0) + ' V', 320, 180, C.text, 12);
        flow(220, 105, 258, 105, Pn.shaft - Pn.rotor, C.warn);
        // resistor
        const hotU = clamp((Tr - 30) / 300, 0, 1);
        c.fillStyle = V.m === 'res' ? 'hsl(10 90% ' + (30 + 30 * hotU).toFixed(0) + '% / ' + (0.2 + 0.8 * hotU).toFixed(2) + ')' : C.faint; c.fillRect(450, 30, 90, 30); c.strokeStyle = C.text; c.strokeRect(450, 30, 90, 30);
        txt(c, 'resistor ' + (V.m === 'res' ? Tr.toFixed(0) + ' °C' : '—'), 495, 76, C.muted, 11);
        flow(382, 70, 448, 48, Pn.res, C.bad);
        if (chop && V.m === 'res') txt(c, 'chopper ON', 410, 28, C.bad, 11);
        // mains
        ln(c, 450, 150, 540, 150, C.text, 3); txt(c, 'mains', 495, 172, C.muted, 11);
        flow(382, 135, 448, 150, Pn.grid, C.ok);
        // rotor heat (DC injection)
        if (Pn.rotor > 50) { c.fillStyle = 'hsl(10 90% 55% / ' + clamp(Pn.rotor / 5000, 0.2, 0.9).toFixed(2) + ')'; c.beginPath(); c.arc(190, 105, 18, 0, TAU); c.fill(); txt(c, 'rotor heating', 190, 155, C.bad, 11); }
        txt(c, fault ? 'OV TRIP' : '', 320, 20, C.bad, 13);
        txt(c, 'energy: ' + [['resistor', E.res], ['mains', E.grid], ['rotor', E.rotor], ['air', E.air]].map(([k2, v2]) => k2 + ' ' + (v2 / 1000).toFixed(0) + ' kJ').join(' · '), 600, 205, C.muted, 10, 'right');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-vfd-emc */
  Hyper.sim('sd-vfd-emc', {
    title: 'Long motor cables and bearing currents',
    blurb: `Two effects of the drive's fast edges. **Top:** a 540 V pulse leaves the drive, travels down the motor cable at about 170 m/µs, reflects at the motor's high surge impedance and comes back; the left graph shows the voltage at the motor terminals, the right one its peak against cable length, with the insulation limit you set. **Bottom:** the drive's three outputs never sum to zero, so their common point jumps in steps of a third of the bus; a few per cent of that couples onto the shaft, and when it exceeds what the bearing's grease film can hold, it sparks through the balls (the switching states are played back slowly).

**Try this**
- Lengthen the cable from 5 m to 50 m: the peak climbs towards twice the bus as the cable passes its critical length (v·t_r/2). Slower edges (a longer rise time) push the critical length out.
- Add an output reactor, a dv/dt filter or a sine filter and watch the peak fall.
- Choose the large motor: its lower surge impedance reflects a little less.
- In the bearing, count the sparks: two per carrier period at 4 kHz is thousands a second. A shaft grounding ring bleeds the voltage away; ceramic (hybrid) bearings do not conduct; a common-mode filter lowers the steps. (The coupling ratio and the film's breakdown voltage here are illustrative.)`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210 });
      const [g1, g2] = graphs(box, 2);
      const VDC = 540, VEL = 170, ZC = 80;
      const MOTORS = { small: ['1.5 kW', 4000], mid: ['15 kW', 1500], big: ['150 kW', 400] };
      let V = null, dirty = true, res = null, t = 0, stIdx = 0, stT = 0, sparks = 0, sparkT = -1, ang = 0;
      const SEQ = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 1, 0], [1, 0, 0]];
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Motor cable length', min: 1, max: 300, step: 1, value: 50, unit: 'm' },
        { id: 'tr', label: 'Rise time of the drive\'s edges', min: 0.05, max: 1, step: 0.05, value: 0.1, unit: 'µs' },
        { id: 'mot', type: 'select', label: 'Motor', options: Object.entries(MOTORS).map(([k, v]) => [v[0] + ' (surge impedance ' + v[1] + ' Ω)', k]), value: 'mid' },
        { id: 'flt', type: 'select', label: 'Output filter', options: [['None', 'none'], ['Output reactor', 'reactor'], ['dv/dt filter', 'dvdt'], ['Sine filter', 'sine']], value: 'none' },
        { id: 'lim', label: 'Motor insulation limit (set yours)', min: 1000, max: 2000, step: 50, value: 1300, unit: 'V' },
        { id: 'fix', type: 'select', label: 'Bearing protection', options: [['None', 'none'], ['Shaft grounding ring', 'ring'], ['Hybrid (ceramic-ball) bearings', 'hybrid'], ['Common-mode filter on the drive', 'cm']], value: 'none' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['lc', 'Critical length v·t_r/2'], ['g', 'Reflection coefficient Γ'], ['pk', 'Peak at the motor'], ['dv', 'Edge at the motor (dv/dt)'], ['sh', 'Shaft voltage peaks'], ['sp', 'Discharges through the bearing']]);
      const pT = kit.plot(g1, { x: { label: 'time (µs)', min: 0 }, y: { label: 'voltage at the motor (V)', min: 0 }, legend: true }, 180);
      const pL = kit.plot(g2, { x: { label: 'cable length (m)', min: 0, max: 300 }, y: { label: 'peak at the motor (V)', min: 0, max: 1300 }, legend: true }, 180);
      // the pulse at the motor terminals by the lattice (bounce) method: drive end Γ_s = −1, motor end Γ, losses d per pass
      // filters slow the edge (and the RC-damped dv/dt filter also matches the cable better); the settled voltage is always the bus
      const filt = () => ({ none: [V.tr, 1], reactor: [Math.max(V.tr, 0.8), 1], dvdt: [Math.max(V.tr, VDC / 500), 0.6], sine: [Math.max(V.tr, 60), 0.2] })[V.flt];
      const wave = (L, tEnd, n) => {
        const [tr, gm] = filt(), G = gm * (MOTORS[V.mot][1] - ZC) / (MOTORS[V.mot][1] + ZC), T = L / VEL, ramp = x => clamp(x / tr, 0, 1), pts = [], d = 0.97;
        let peak = 0;
        // lattice sum: each round trip multiplies by −Γ·d² (drive end Γ_s = −1, cable losses d per pass); normalised so it settles at V_dc
        const norm = (1 + G * d * d) / ((1 + G) * d);
        for (let i = 0; i <= n; i++) {
          const tt = tEnd * i / n; let v = 0, a = (1 + G) * d * norm;
          for (let k = 0; k < 400; k++) { const t0 = (2 * k + 1) * T; if (t0 > tt) break; v += a * ramp(tt - t0); a *= -G * d * d; }
          v *= VDC; peak = Math.max(peak, v); pts.push([tt, v]);
        }
        return { pts, peak, G, T, tr };
      };
      const compute = () => {
        const [tr] = filt(), T = V.L / VEL, tEnd = Math.max(8, 14 * T + 2 * tr, tr * 3), wv = wave(V.L, tEnd, 800);
        const pk = []; for (let i = 0; i <= 60; i++) { const L = Math.max(1, 300 * i / 60), T2 = L / VEL; pk.push([L, wave(L, Math.max(4, 10 * T2 + 2 * tr), 300).peak]); }
        res = { wv, pk, tr, lc: VEL * tr / 2 };
        pT.set({ x: { label: 'time (µs)', min: 0, max: tEnd }, series: [{ pts: wv.pts, label: 'at the motor' }, { pts: [[0, 0], [tr, VDC], [tEnd, VDC]], label: 'leaving the drive', dash: [5, 3] }], hlines: [{ y: V.lim, label: 'insulation limit' }] });
        pL.set({ series: [{ pts: pk, label: 'peak' }], marks: [{ x: V.L, y: wv.peak, label: 'yours' }], hlines: [{ y: V.lim, label: 'limit' }], vlines: [{ x: res.lc, label: 'l_c' }] });
        ro.set('lc', res.lc.toFixed(1) + ' m (at ' + tr.toFixed(2) + ' µs)');
        ro.set('g', wv.G.toFixed(3));
        ro.set('pk', wv.peak.toFixed(0) + ' V = ' + (wv.peak / VDC).toFixed(2) + ' × the bus' + (wv.peak > V.lim ? ' — above your limit!' : ''));
        ro.set('dv', (VDC / tr / 1000).toFixed(2) + ' kV/µs');
        dirty = false;
      };
      const loop = kit.loop(dt => {
        if (dirty) compute();
        t += dt; stT += dt;
        const bvr = V.fix === 'cm' ? 0.025 : 0.05, vcm = VDC * (SEQ[stIdx].reduce((a, b) => a + b, 0) / 3 - 0.5);
        const vsh = V.fix === 'ring' ? clamp(bvr * vcm, -1.5, 1.5) : bvr * vcm, conducts = V.fix !== 'hybrid';
        if (stT > 0.45) { stT = 0; stIdx = (stIdx + 1) % SEQ.length; const v2 = VDC * (SEQ[stIdx].reduce((a, b) => a + b, 0) / 3 - 0.5), vs2 = V.fix === 'ring' ? clamp(bvr * v2, -1.5, 1.5) : bvr * v2; if (conducts && Math.abs(vs2) > 10) { sparks++; sparkT = t; } }
        const perSec = V.fix === 'ring' || V.fix === 'hybrid' || bvr * VDC / 2 <= 10 ? 0 : 2 * 4000;
        ro.set('sh', '±' + (V.fix === 'ring' ? 1.5 : bvr * VDC / 2).toFixed(1) + ' V (film breaks down at about 10 V here)');
        ro.set('sp', perSec ? 'about ' + perSec + ' per second at 4 kHz switching' : 'none');
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 240);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 240 * s) / 2); c.scale(s, s);
        // top: drive, cable (length drawn to scale up to 300 m), motor, and a wavefront bouncing along it
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(20, 20, 60, 50); txt(c, 'drive', 50, 50, C.text, 12);
        const cl = 80 + 480 * clamp(V.L / 300, 0.02, 1);
        ln(c, 80, 45, cl, 45, C.muted, 5); txt(c, V.L + ' m of cable', (80 + cl) / 2, 35, C.muted, 11);
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(cl + 28, 45, 26, 0, TAU); c.fill(); c.strokeStyle = C.text; c.stroke(); txt(c, 'M', cl + 28, 50, C.text, 13);
        const cyc = (t * 0.6) % 2, x = cyc < 1 ? 80 + (cl - 80) * cyc : cl - (cl - 80) * (cyc - 1);
        c.fillStyle = cyc < 1 ? C.warn : C.bad; c.beginPath(); c.arc(x, 45, 7, 0, TAU); c.fill();
        txt(c, cyc < 1 ? 'pulse travelling to the motor' : 'reflection travelling back', (80 + cl) / 2, 72, cyc < 1 ? C.warn : C.bad, 11);
        txt(c, 'peak at motor ' + res.wv.peak.toFixed(0) + ' V', cl + 28, 88, res.wv.peak > V.lim ? C.bad : C.text, 12);
        // bottom: switching state, common-mode voltage, shaft and bearing
        const by = 115;
        txt(c, 'switching state ' + SEQ[stIdx].join(''), 90, by + 10, C.text, 12);
        txt(c, 'common-mode voltage ' + (vcm > 0 ? '+' : '') + vcm.toFixed(0) + ' V', 90, by + 30, C.muted, 11);
        for (let k = 0; k < SEQ.length; k++) { const v2 = VDC * (SEQ[k].reduce((a, b) => a + b, 0) / 3 - 0.5); c.fillStyle = k === stIdx ? C.accent : C.faint; c.fillRect(20 + 24 * k, by + 70 - v2 / 8, 20, v2 / 8 || 1); }
        ln(c, 18, by + 70, 170, by + 70, C.muted, 1);
        // motor section with shaft and bearing
        const mx = 360, my = by + 60;
        c.fillStyle = C.surface2 || C.surface; c.fillRect(mx - 80, my - 50, 160, 100); c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(mx - 80, my - 50, 160, 100);
        c.fillStyle = C.muted; c.fillRect(mx - 55, my - 28, 110, 56);
        ln(c, mx - 140, my, mx + 150, my, C.text, 8);
        const bx = mx + 110;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(bx - 12, my - 30, 24, 60);
        ang += dt * 4;
        for (let k = 0; k < 2; k++) { const yy = my + (k ? 18 : -18); kit.dot(c, bx, yy, 6, V.fix === 'hybrid' ? 'hsl(0 0% 85%)' : C.text); }
        if (sparkT >= 0 && t - sparkT < 0.25 && conducts && V.fix !== 'ring') { for (let k = 0; k < 6; k++) { const a = TAU * k / 6 + t * 30; ln(c, bx, my - 18, bx + 12 * Math.cos(a), my - 18 + 12 * Math.sin(a), 'hsl(50 100% 55%)', 2); } txt(c, 'spark!', bx + 30, my - 30, C.bad, 12, 'left'); }
        if (V.fix === 'ring') { c.strokeStyle = C.ok; c.lineWidth = 3; c.beginPath(); c.arc(mx - 120, my, 12, 0, TAU); c.stroke(); txt(c, 'grounding ring', mx - 120, my + 30, C.ok, 10); }
        txt(c, 'shaft ' + (vsh > 0 ? '+' : '') + vsh.toFixed(1) + ' V', mx, my + 70, Math.abs(vsh) > 10 ? C.bad : C.text, 12);
        txt(c, 'bearing: ' + (V.fix === 'hybrid' ? 'ceramic balls, no path' : sparks + ' sparks shown'), bx + 20, my + 45, C.muted, 10, 'left');
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sd-pump-savings */
  Hyper.sim('sd-pump-savings', {
    title: 'Throttle or slow down? A pump on a drive',
    blurb: `A centrifugal pump designed for 250 m³/h at 32 m (80 % efficient, shut-off head 40 m) on a 30 kW motor. The demand is lower than the design flow; the pump can be throttled by a valve at full speed, bypass the surplus back to its suction, or be slowed by a VFD. Left graph: pump curves and the system curve with the operating point. Right graph: electrical input power against flow for the three methods, at the present static head. Below: what it costs in a year.

**Try this**
- At 70 % flow with no static head, compare the throttle and the drive: the drive takes about a third of the full power, the throttle more than four fifths. (Electrical input includes the motor's efficiency, about 93 %, and the drive's 3 %.)
- Raise the static head to 50 % and then 80 %: the drive's advantage shrinks, because the pump must still reach the static head; at low flows it runs far from its best efficiency.
- The bypass keeps the pump at full flow and full power whatever the demand.
- Set the demand to 100 %: now the drive loses a little (its own 3 % losses).
- Change the hours and the price of energy to see the yearly saving.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1, g2] = graphs(box, 2);
      const Qd = 250, Hd = 32, H0 = 40, kp = (H0 - Hd) / (Qd * Qd), EM = 0.8, rho = 1000, g = 9.81;
      let V = null, dirty = true, cur = null, ang = 0, fl = 0;
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Flow control', options: [['Throttle valve (full speed)', 'thr'], ['Variable-frequency drive', 'vfd'], ['Bypass back to suction (full speed)', 'byp']], value: 'vfd' },
        { id: 'q', label: 'Flow demand, % of design (250 m³/h)', min: 30, max: 100, step: 1, value: 70, unit: '%' },
        { id: 'hs', label: 'Static head, % of design head', min: 0, max: 90, step: 1, value: 0, unit: '%' },
        { id: 'hrs', label: 'Running hours per year', min: 1000, max: 8760, step: 100, value: 6000, unit: 'h' },
        { id: 'price', label: 'Energy price, ¤ per kWh', min: 0.05, max: 0.4, step: 0.01, value: 0.15, unit: '' }
      ], () => { dirty = true; });
      V = ctl.values;
      const ro = kit.readout(box.side, [['op', 'Flow and head'], ['sp', 'Pump speed'], ['ef', 'Pump efficiency'], ['pw', 'Shaft power · electrical input'], ['vl', 'Head burnt in the valve'], ['yr', 'Energy and cost per year'], ['sv', 'Saving against throttling']]);
      const pH = kit.plot(g1, { x: { label: 'flow (m³/h)', min: 0, max: 300 }, y: { label: 'head (m)', min: 0, max: 45 }, legend: true }, 200);
      const pP = kit.plot(g2, { x: { label: 'flow (% of design)', min: 30, max: 100 }, y: { label: 'electrical input (kW)', min: 0 }, legend: true }, 200);
      const eta = (Q, r) => { const q = Q / (Qd * Math.max(0.05, r)); return Math.max(0.05, EM * (2 * q - q * q)); };
      const etaM = x => 0.935 - 0.08 * Math.pow(Math.max(0, 0.5 - x), 2) * 4;   // an IE3 30 kW motor: flat above half load, falling below
      const pumpH = (Q, r) => H0 * r * r - kp * Q * Q;
      const sysH = Q => { const Hs = V.hs / 100 * Hd; return Hs + (Hd - Hs) * Math.pow(Q / Qd, 2); };
      const shaftP = (Q, H, e) => rho * g * Q / 3600 * H / e;
      const point = (m, Q) => {
        if (m === 'thr') { const H = pumpH(Q, 1), e = eta(Q, 1), P = shaftP(Q, H, e); return { r: 1, H, e, P, Pel: P / etaM(P / 30000), valve: H - sysH(Q) }; }
        if (m === 'byp') { const H = Hd, e = eta(Qd, 1), P = shaftP(Qd, H, e); return { r: 1, H, e, P, Pel: P / etaM(P / 30000), valve: 0 }; }
        const H = sysH(Q), r = Math.sqrt((H + kp * Q * Q) / H0), e = eta(Q, r), P = shaftP(Q, H, e);
        return { r, H, e, P, Pel: P / etaM(P / 30000) / 0.97, valve: 0 };
      };
      const compute = () => {
        const Q = V.q / 100 * Qd, p = point(V.m, Q), thr = point('thr', Q);
        cur = { Q, p, thr };
        const E = p.Pel / 1000 * V.hrs, Et = thr.Pel / 1000 * V.hrs;
        ro.set('op', Q.toFixed(0) + ' m³/h at ' + (V.m === 'byp' ? sysH(Q).toFixed(1) + ' m (pump: ' + Qd + ' m³/h at ' + Hd + ' m)' : p.H.toFixed(1) + ' m'));
        ro.set('sp', (1480 * p.r).toFixed(0) + ' rpm (' + (100 * p.r).toFixed(0) + ' %)');
        ro.set('ef', (100 * p.e).toFixed(0) + ' %');
        ro.set('pw', (p.P / 1000).toFixed(1) + ' kW · ' + (p.Pel / 1000).toFixed(1) + ' kW');
        ro.set('vl', V.m === 'thr' ? p.valve.toFixed(1) + ' m' : V.m === 'byp' ? 'the surplus flow is recirculated' : 'none — no valve losses');
        ro.set('yr', Math.round(E).toLocaleString('en-US') + ' kWh, ' + kit.money(E * V.price));
        ro.set('sv', V.m === 'thr' ? '—' : ((thr.Pel - p.Pel) / 1000).toFixed(1) + ' kW, ' + Math.round(Et - E).toLocaleString('en-US') + ' kWh, ' + kit.money((Et - E) * V.price) + ' a year');
        const full = [], atR = [], sys = [];
        for (let i = 0; i <= 60; i++) { const q = 300 * i / 60; full.push([q, Math.max(0, pumpH(q, 1))]); if (V.m === 'vfd') atR.push([q, Math.max(0, pumpH(q, p.r))]); sys.push([q, sysH(q)]); }
        const series = [{ pts: full, label: 'pump at full speed' }, { pts: sys, label: 'system', dash: [5, 3] }];
        if (V.m === 'vfd') series.splice(1, 0, { pts: atR, label: 'pump at ' + (100 * p.r).toFixed(0) + ' % speed' });
        const marks = [{ x: Q, y: V.m === 'byp' ? sysH(Q) : p.H, label: 'process' }];
        if (V.m === 'thr') marks.push({ x: Q, y: sysH(Q), label: 'after the valve' });
        if (V.m === 'byp') marks.push({ x: Qd, y: Hd, label: 'pump' });
        pH.set({ series, marks });
        const cv = { thr: [], vfd: [], byp: [] };
        for (let i = 30; i <= 100; i += 2) for (const m of ['thr', 'vfd', 'byp']) cv[m].push([i, point(m, i / 100 * Qd).Pel / 1000]);
        pP.set({ series: [{ pts: cv.thr, label: 'throttle' }, { pts: cv.vfd, label: 'VFD' }, { pts: cv.byp, label: 'bypass', dash: [5, 3] }], marks: [{ x: V.q, y: p.Pel / 1000, label: 'now' }] });
        dirty = false;
      };
      const loop = kit.loop(dt => {
        if (dirty) compute();
        if (!cur) return;
        const p = cur.p;
        ang += dt * 8 * p.r; fl += dt * 60 * cur.Q / Qd;
        const c = st.begin(), C = kit.colors(), s = Math.min(st.W / 700, st.H / 210);
        c.save(); c.translate((st.W - 700 * s) / 2, (st.H - 210 * s) / 2); c.scale(s, s);
        // tank, pump, pipe, valve, bypass
        c.fillStyle = 'hsl(205 70% 50% / .3)'; c.fillRect(20, 120, 60, 60); c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(20, 120, 60, 60); txt(c, 'suction tank', 50, 198, C.muted, 10);
        c.strokeStyle = C.muted; c.lineWidth = 8; c.beginPath(); c.moveTo(80, 160); c.lineTo(150, 160); c.stroke();
        c.fillStyle = C.surface2 || C.surface; c.beginPath(); c.arc(175, 150, 25, 0, TAU); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        c.save(); c.translate(175, 150); c.rotate(ang); for (let k = 0; k < 5; k++) { c.rotate(TAU / 5); ln(c, 0, 0, 0, -20, C.accent, 3); } c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(160, 60, 30, 40); txt(c, V.m === 'vfd' ? 'VFD' : 'DOL', 175, 84, V.m === 'vfd' ? C.accent : C.muted, 11);
        ln(c, 175, 100, 175, 125, C.text, 3);
        const pipe = [[200, 150], [300, 150], [300, 60], [640, 60]];
        c.strokeStyle = C.muted; c.lineWidth = 8; c.beginPath(); pipe.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
        kit.schem.flow(c, pipe, fl, { color: 'hsl(205 80% 55%)' });
        // throttle valve
        const vx = 420, closed = V.m === 'thr' ? clamp(p.valve / 30, 0, 0.9) : 0;
        c.fillStyle = C.bg2 || C.surface; c.beginPath(); c.moveTo(vx - 16, 44); c.lineTo(vx + 16, 76); c.lineTo(vx + 16, 44); c.lineTo(vx - 16, 76); c.closePath(); c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        ln(c, vx, 60, vx + 14 * Math.cos(Math.PI / 2 * closed), 60 - 14 * Math.sin(Math.PI / 2 * closed), C.bad, 3);
        txt(c, V.m === 'thr' ? 'valve burns ' + p.valve.toFixed(1) + ' m' : 'valve open', vx, 100, V.m === 'thr' ? C.bad : C.muted, 11);
        if (V.m === 'byp') { c.strokeStyle = 'hsl(205 60% 55% / .7)'; c.lineWidth = 5; c.beginPath(); c.moveTo(300, 120); c.lineTo(250, 120); c.lineTo(250, 190); c.lineTo(50, 190); c.lineTo(50, 180); c.stroke(); txt(c, 'bypass: ' + (Qd - cur.Q).toFixed(0) + ' m³/h back', 180, 205, C.muted, 10); }
        txt(c, 'to the process ' + cur.Q.toFixed(0) + ' m³/h', 560, 50, C.text, 11);
        // power meter
        const u = clamp(p.Pel / 35000, 0, 1), a = Math.PI * (1 + u);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(600, 170, 40, Math.PI, 0); c.stroke();
        ln(c, 600, 170, 600 + 34 * Math.cos(a), 170 + 34 * Math.sin(a), u > 0.7 ? C.bad : C.accent, 3);
        txt(c, (p.Pel / 1000).toFixed(1) + ' kW', 600, 195, C.text, 13);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

})();
