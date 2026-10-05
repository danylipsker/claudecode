/* HYPER-ESP32 · sims/driving-motors.js
 *
 * Simulations of the topic "Driving motors":
 *   dm-hbridge      the four switches of an H-bridge: forward, reverse, brake, coast, and the short circuit
 *   dm-duty-speed   PWM duty against speed, with the winding current ripple, the decay mode, the frequency and the dead zone
 *   dm-servo        a servo pulse every 20 ms, the angle it means, the duty steps of the LEDC and the servo's supply
 *   dm-stepper-ramp a stepper move with a trapezoidal ramp against the torque curve of the motor: where it stalls
 *   dm-commutation  a brushless motor: six-step commutation against sinusoidal (field-oriented) drive
 *   dm-quadrature   an encoder's A and B signals, counts, and two ways to turn them into speed
 *   dm-motor-pid    a DC motor with an encoder under a position or a speed loop
 *   dm-homing       a homing sequence as a state machine against a limit switch, with wiring faults
 *   dm-multi-axis   two axes stepped in proportion (a line algorithm) against two axes at one speed
 *
 * Numbers come from kit.esp (servo pulses, step rates, motion profiles, PID) and kit.motor (the stepper torque
 * curve); everything is drawn in theme colours; static pictures redraw on demand (loop.once), a running loop only
 * where something moves by itself. The motor models are small and honest; they say where they are schematic.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmt = (v, s) => Hyper.util.fmt(v, s);
  const num = (v, s, unit) => Number.isFinite(v) ? fmt(v, s || 3) + (unit ? ' ' + unit : '') : '—';
  const shade = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const tText = s => { const a = Math.abs(s); return a >= 1 ? fmt(s, 3) + ' s' : a >= 1e-3 ? fmt(s * 1e3, 3) + ' ms' : a >= 1e-6 ? fmt(s * 1e6, 3) + ' µs' : fmt(s * 1e9, 3) + ' ns'; };
  const fText = f => f >= 1e6 ? fmt(f / 1e6, 3) + ' MHz' : f >= 1e3 ? fmt(f / 1e3, 3) + ' kHz' : fmt(f, 3) + ' Hz';
  const dash = (c, x0, y0, x1, y1, color, w) => { c.save(); c.setLineDash([5, 4]); c.strokeStyle = color; c.lineWidth = w || 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  /* a framed chart area with axes drawn by the caller: returns the mapping functions */
  const frame = (c, C, x, y, w, h) => { c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w, h); c.restore(); };

  /* ================================================================ dm-hbridge */
  Hyper.sim('dm-hbridge', {
    title: 'The H-bridge: four switches',
    blurb: `A brushed motor between the two middle points of four switches, from a 6 V supply. The dots show where current flows. Click a switch (or tick the boxes) to close or open it.

**Try this**
- **Forward** and **Reverse** close one diagonal each: the speed climbs towards the no-load speed and the current falls as the back-EMF grows. At first it is the stall current.
- From full speed choose **Brake**: the two low switches join the motor terminals, the back-EMF drives a current against the motion and the motor stops in a fraction of a second. **Coast** stops it only by friction.
- Close the **high left** and **low left** switches together: a short circuit through two transistors, tens of amperes for as long as the driver survives. A real driver has protection; a bridge built from bare MOSFETs may not.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 300, maxH: 470 });
      const PRE = { forward: [1, 0, 0, 1], reverse: [0, 1, 1, 0], brake: [0, 0, 1, 1], brakeh: [1, 1, 0, 0], coast: [0, 0, 0, 0], shoot: [1, 0, 1, 0] };
      const IDS = ['hl', 'hr', 'll', 'lr'];
      const NAMES = { hl: 'High left', hr: 'High right', ll: 'Low left', lr: 'Low right' };
      const VS = 6, R = 2.4, KE = 0.009, J = 1.0125e-5, B = 3e-6, RSW = 0.1;   // 6 V, a 2.4 ohm motor, back-EMF constant, inertia, friction
      let w = 0, phase = 0, hits = [];
      const match = () => { const v = IDS.map(i => ctl.values[i] ? 1 : 0).join(''); for (const k of Object.keys(PRE)) if (PRE[k].join('') === v) return k; return 'custom'; };
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Switches', options: [['Forward', 'forward'], ['Reverse', 'reverse'], ['Brake (both low sides)', 'brake'], ['Brake (both high sides)', 'brakeh'], ['Coast (all open)', 'coast'], ['Shoot-through (never!)', 'shoot'], ['Custom (click the switches)', 'custom']], value: 'forward' },
        { id: 'hl', type: 'check', label: 'High left closed', value: true },
        { id: 'hr', type: 'check', label: 'High right closed', value: false },
        { id: 'll', type: 'check', label: 'Low left closed', value: false },
        { id: 'lr', type: 'check', label: 'Low right closed', value: true },
        { type: 'buttons', items: [{ id: 'spin', label: 'Spin it up (forward)', primary: true }, { id: 'stop', label: 'Stop the shaft' }] }
      ], (id, v) => {
        if (id === 'preset') { if (PRE[v]) IDS.forEach((k, i) => ctl.set(k, !!PRE[v][i])); }
        else if (IDS.includes(id)) ctl.set('preset', match());
        if (id === 'spin') { IDS.forEach((k, i) => ctl.set(k, !!PRE.forward[i])); ctl.set('preset', 'forward'); w = 0; }
        if (id === 'stop') w = 0;
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'The bridge'], ['i', 'Motor current'], ['n', 'Speed'], ['why', 'Because']]);
      // what the four switches do to the motor
      const analyse = () => {
        const hl = ctl.values.hl, hr = ctl.values.hr, ll = ctl.values.ll, lr = ctl.values.lr;
        if ((hl && ll) || (hr && lr)) return { k: 'shoot', name: 'SHORT CIRCUIT', why: 'A high and a low switch on the same side connect the supply to ground through two transistors only.' };
        const L = hl ? 'V' : ll ? 'G' : null, Rr = hr ? 'V' : lr ? 'G' : null;
        if (L === 'V' && Rr === 'G') return { k: 'fwd', name: 'Forward', why: 'Current flows from the supply through the high left switch, the motor and the low right switch.' };
        if (L === 'G' && Rr === 'V') return { k: 'rev', name: 'Reverse', why: 'Current flows the other way: high right, the motor, low left.' };
        if (L && Rr && L === Rr) return { k: L === 'G' ? 'brakeL' : 'brakeH', name: 'Brake', why: 'Both motor terminals are joined to the same rail, so the back-EMF drives a current through the winding that fights the rotation.' };
        return { k: 'coast', name: 'Coast', why: L || Rr ? 'Only one terminal is connected to a rail, so no current can flow through the motor: it free-wheels.' : 'Nothing is connected: the motor free-wheels and the winding current dies away through the body diodes.' };
      };
      const loop = kit.loop(dt => {
        const m = analyse(), step = Math.min(dt, 0.04), n = 8;
        let cur = 0;
        for (let i = 0; i < n; i++) {
          const h = step / n;
          let I = 0;
          if (m.k === 'fwd') I = (VS - KE * w) / R;
          else if (m.k === 'rev') I = (-VS - KE * w) / R;
          else if (m.k === 'brakeL' || m.k === 'brakeH') I = -KE * w / R;
          w += (KE * I - B * w) / J * h;
          cur = I;
        }
        if (m.k === 'shoot') cur = VS / RSW;
        phase += dt * 60;
        draw(m, cur);
        const moving = Math.abs(w) > 1 || m.k === 'fwd' || m.k === 'rev' || m.k === 'shoot';
        if (!moving) loop.stop();
      }, box.stage);
      let ang = 0;
      const draw = (m, cur) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        m = m || analyse();
        if (cur == null) cur = m.k === 'shoot' ? VS / RSW : m.k === 'fwd' ? (VS - KE * w) / R : m.k === 'rev' ? (-VS - KE * w) / R : (m.k === 'brakeL' || m.k === 'brakeH') ? -KE * w / R : 0;
        const narrow = W < 520, xl = W * (narrow ? 0.24 : 0.3), xr = W * (narrow ? 0.76 : 0.7), yt = H * 0.12, yb = H * 0.84, ym = (yt + yb) / 2, sw = narrow ? 44 : 54, sh = 30;
        const yh = (yt + ym) / 2, yl = (ym + yb) / 2, mx = W / 2, mr = narrow ? 20 : 26;
        const bad = m.k === 'shoot', hot = bad ? C.bad : C.accent;
        // the rails
        S.wire(c, [[xl - 24, yt], [xr + 24, yt]], { color: C.text2, width: 3 });
        S.wire(c, [[xl - 24, yb], [xr + 24, yb]], { color: C.text2, width: 3 });
        kit.label(c, '+6 V', xl - 30, yt, { size: 11.5, weight: 650, align: 'right' });
        kit.label(c, '0 V', xl - 30, yb, { size: 11.5, weight: 650, align: 'right' });
        // the wires, faint, and the active path
        const seg = {
          upL: [[xl, yt], [xl, yh - sh / 2]], mUL: [[xl, yh + sh / 2], [xl, ym]], mDL: [[xl, ym], [xl, yl - sh / 2]], dnL: [[xl, yl + sh / 2], [xl, yb]],
          upR: [[xr, yt], [xr, yh - sh / 2]], mUR: [[xr, yh + sh / 2], [xr, ym]], mDR: [[xr, ym], [xr, yl - sh / 2]], dnR: [[xr, yl + sh / 2], [xr, yb]],
          lm: [[xl, ym], [mx - mr, ym]], rm: [[mx + mr, ym], [xr, ym]]
        };
        for (const k of Object.keys(seg)) S.wire(c, seg[k], { color: C.faint, width: 2 });
        let path = null;
        if (m.k === 'fwd') path = [[xl, yt], [xl, ym], [xr, ym], [xr, yb]];
        else if (m.k === 'rev') path = [[xr, yt], [xr, ym], [xl, ym], [xl, yb]];
        else if (m.k === 'brakeL') path = [[xl, ym], [xl, yb], [xr, yb], [xr, ym], [xl, ym]];
        else if (m.k === 'brakeH') path = [[xl, ym], [xl, yt], [xr, yt], [xr, ym], [xl, ym]];
        else if (m.k === 'shoot') path = ctl.values.hl && ctl.values.ll ? [[xl, yt], [xl, yb]] : [[xr, yt], [xr, yb]];
        if (path && Math.abs(cur) > 0.01) {
          const brake = m.k === 'brakeL' || m.k === 'brakeH';
          const pts = brake && w < 0 ? path.slice().reverse() : path;      // a spinning motor's own current opposes its motion
          S.wire(c, pts, { color: hot, width: 3 });
          S.flow(c, pts, phase * (bad ? 2.2 : 0.6), { color: hot, r: 3, gap: 16 });
        }
        // the switches
        hits = [];
        const sws = [['hl', xl, yh], ['hr', xr, yh], ['ll', xl, yl], ['lr', xr, yl]];
        for (const [id, x, y] of sws) {
          const on = ctl.values[id];
          S.box(c, x - sw / 2, y - sh / 2, sw, sh, { label: on ? 'ON' : 'off', size: 11.5, color: on ? (bad ? C.bad : C.ok) : C.faint, active: on, r: 6 });
          kit.label(c, NAMES[id], x + (x < mx ? -sw / 2 - 8 : sw / 2 + 8), y, { size: 10.5, color: C.muted, align: x < mx ? 'right' : 'left' });
          hits.push({ id, x: x - sw / 2, y: y - sh / 2, w: sw, h: sh });
        }
        // the motor
        ang += w * 0.016 * 0.12;
        S.motor(c, mx, ym, mr, ang, { color: Math.abs(w) > 1 ? C.accent : C.faint });
        kit.label(c, 'M', mx, ym - mr - 10, { size: 11, color: C.muted, align: 'center' });
        // the verdict
        kit.label(c, m.name, W / 2, H - 14, { size: 13.5, weight: 700, color: bad ? C.bad : C.text, align: 'center' });
        if (bad) kit.label(c, num(cur, 2) + ' A', mx, yt + 24, { size: 12, weight: 700, color: C.bad, align: 'center', bg: C.bg2 });
        ro.set('state', m.name);
        ro.set('i', bad ? '≈ ' + fmt(VS / RSW, 2) + ' A (a short)' : fmt(cur, 3) + ' A');
        ro.set('n', fmt(Math.abs(w) * 60 / (2 * Math.PI), 3) + ' rpm' + (w < -1 ? ' (reverse)' : ''));
        ro.set('why', m.why);
      };
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { ctl.set(h.id, !ctl.values[h.id]); ctl.set('preset', match()); loop.start(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dm-duty-speed */
  const DS = { R: 2.4, KE: 0.009, VS: 6 };
  /* the periodic current of a winding driven at duty D and frequency f (mode 'slow': brake in the gaps, 'fast': coast through the diodes),
     with the shaft at w rad/s. -> { avg, min, max, rms, pts: [[t, i]], T } */
  function windingCurrent(f, D, L, mode, w, keep) {
    const T = 1 / f, N = 24, dt = T / N, tau = L / DS.R;
    const warm = N * Math.ceil(Math.max(4 * tau, 3 * T) / T), rec = 4 * N;
    let I = 0, sum = 0, sum2 = 0, mn = 1e9, mx = -1e9;
    const pts = [];
    for (let k = 0; k < warm + rec; k++) {
      // the exact share of this step that the switch is on, so any duty is made, not only multiples of 1/24
      const phase = (k % N) / N, fOn = D >= 1 ? 1 : D <= 0 ? 0 : clamp((D - phase) * N, 0, 1);
      if (fOn > 0) { const tOn = (DS.VS - DS.KE * w) / DS.R; I = tOn + (I - tOn) * Math.exp(-fOn * dt / tau); }
      if (fOn < 1) {
        const v = mode === 'fast' ? (I > 0 ? -DS.VS : DS.KE * w) : 0, tOff = (v - DS.KE * w) / DS.R;
        I = tOff + (I - tOff) * Math.exp(-(1 - fOn) * dt / tau);
        if (mode === 'fast' && I < 0) I = 0;
      }
      if (k >= warm) {
        sum += I; sum2 += I * I; if (I < mn) mn = I; if (I > mx) mx = I;
        if (keep) pts.push([(k - warm) * dt, I]);
      }
    }
    return { avg: sum / rec, min: mn, max: mx, rms: Math.sqrt(sum2 / rec), pts, T };
  }
  /* the shaft speed at which the average torque equals the load torque (N·m): 0 when the motor cannot start */
  function equilibrium(f, D, L, mode, TL) {
    const need = TL / DS.KE;                         // the average current that holds the load
    const wmax = DS.VS / DS.KE;
    let a = windingCurrent(f, D, L, mode, 0, false);
    if (a.avg <= need) return { w: 0, stalled: D > 0 };
    let lo = 0, hi = wmax;
    for (let i = 0; i < 12; i++) { const mid = (lo + hi) / 2; if (windingCurrent(f, D, L, mode, mid, false).avg > need) lo = mid; else hi = mid; }
    return { w: (lo + hi) / 2, stalled: false };
  }
  Hyper.sim('dm-duty-speed', {
    title: 'PWM duty, ripple and decay',
    blurb: `A 6 V motor winding (2.4 Ω and the inductance you set) driven by PWM. The top trace is the PWM command, the next the **current in the winding**; the chart shows the steady speed against duty for the two decay modes, with the load and friction you set.

**Try this**
- Lower the frequency to 1 kHz: the current ripple grows until it touches zero in every gap, and the sound readout says *audible*. At 20 kHz the ripple is a thin wobble.
- Switch between **slow decay** (brake in the gaps) and **fast decay** (coast): fast decay ripples more and gives a different speed curve, because the current is pushed back into the supply.
- Raise the **friction and load**: the curve starts later. Duty values left of the curve's start are the **dead zone**: the motor does not turn and the winding only heats.
- Make the winding inductance small and see the ripple rise at the same frequency.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'D', label: 'Duty cycle', min: 0, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'f', label: 'PWM frequency', min: 500, max: 40000, value: 20000, unit: 'Hz', log: true, sig: 3 },
        { id: 'mode', type: 'select', label: 'In the gaps', options: [['Slow decay: brake (windings joined)', 'slow'], ['Fast decay: coast (bridge open)', 'fast']], value: 'slow' },
        { id: 'L', label: 'Winding inductance', min: 0.5, max: 10, step: 0.1, value: 2, unit: 'mH' },
        { id: 'TL', label: 'Friction and load', min: 0, max: 12, step: 0.5, value: 3, unit: 'mN·m' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['vavg', 'Average voltage'], ['n', 'Speed'], ['iavg', 'Average current'], ['rip', 'Ripple, peak to peak'], ['tau', 'L/R time constant'], ['snd', 'Sound']]);
      let cache = { key: '', slow: [], fast: [] };
      const curves = (f, L, TL) => {
        const key = [Math.round(f), L, TL].join('|');
        if (cache.key === key) return cache;
        const out = { key, slow: [], fast: [] };
        for (let d = 0; d <= 100; d += 6.25) for (const m of ['slow', 'fast']) out[m].push([d, equilibrium(f, d / 100, L / 1000, m, TL / 1000).w * 60 / (2 * Math.PI)]);
        cache = out;
        return out;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, v = ctl.values;
        const D = v.D / 100, f = v.f, L = v.L / 1000, TL = v.TL / 1000, mode = v.mode;
        const eq = equilibrium(f, D, L, mode, TL), w = eq.w;
        const cw = windingCurrent(f, D, L, mode, w, true), T = 1 / f;
        const lx = 66, pw = Math.max(80, W - lx - 14);
        // the command and the current
        const y0 = 26, hw = Math.round(H * 0.1);
        kit.label(c, 'Four periods of ' + tText(T) + ' each', lx, 12, { size: 11.5, color: C.text2, weight: 600 });
        const edges = S.pwmEdges(f, D, 0, 4 * T);
        S.wave(c, lx, y0, pw, hw, edges, { t0: 0, t1: 4 * T, fill: true, color: kit.hue(205), label: 'PWM', idle: D >= 1 ? 1 : 0 });
        const y1 = y0 + hw + 18, ch = Math.round(H * 0.22);
        const lo = Math.min(0, cw.min) - 0.05, hi = Math.max(cw.max, 0.3) * 1.12;
        frame(c, C, lx, y1, pw, ch);
        const a = S.analog(c, lx, y1, pw, ch, cw.pts, { t0: 0, t1: 4 * T, min: lo, max: hi, color: kit.hue(30), label: 'current', zero: true });
        dash(c, lx, a.Y(cw.avg), lx + pw, a.Y(cw.avg), C.warn, 1.3);
        kit.label(c, 'average ' + fmt(cw.avg, 3) + ' A', lx + pw - 4, clamp(a.Y(cw.avg) - 9, y1 + 8, y1 + ch - 8), { size: 10.5, color: C.warn, align: 'right', bg: C.bg2 });
        kit.label(c, fmt(hi, 2) + ' A', lx - 8, y1 + 4, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, fmt(lo, 2) + ' A', lx - 8, y1 + ch - 2, { size: 9.5, color: C.faint, align: 'right' });
        // speed against duty
        const y2 = y1 + ch + 44, ch2 = H - y2 - 30, cv = curves(f, v.L, v.TL), maxN = 6200;
        kit.label(c, 'Steady speed against duty (at ' + fText(f) + ', ' + fmt(v.TL, 2) + ' mN·m)', lx, y2 - 14, { size: 11.5, color: C.text2, weight: 600 });
        if (ch2 > 60) {
          frame(c, C, lx, y2, pw, ch2);
          const X = d => lx + pw * d / 100, Y = n => y2 + ch2 - ch2 * clamp(n / maxN, 0, 1);
          for (const [pts, color, name] of [[cv.slow, kit.hue(150), 'slow decay'], [cv.fast, kit.hue(30), 'fast decay']]) {
            c.save(); c.strokeStyle = color; c.lineWidth = (name === 'slow decay') === (mode === 'slow') ? 2.6 : 1.4; c.globalAlpha = (name === 'slow decay') === (mode === 'slow') ? 1 : 0.6;
            c.beginPath(); pts.forEach((p, i) => { if (i) c.lineTo(X(p[0]), Y(p[1])); else c.moveTo(X(p[0]), Y(p[1])); }); c.stroke(); c.restore();
          }
          kit.label(c, 'slow decay', X(100) - 4, Y(cv.slow[cv.slow.length - 1][1]) - 8, { size: 10.5, color: kit.hue(150), align: 'right' });
          kit.label(c, 'fast decay', X(100) - 4, Y(cv.fast[cv.fast.length - 1][1]) + 12, { size: 10.5, color: kit.hue(30), align: 'right' });
          kit.dot(c, X(v.D), Y(w * 60 / (2 * Math.PI)), 5.5, eq.stalled ? C.bad : C.accent, C.text);
          for (let d = 0; d <= 100; d += 25) kit.label(c, d + ' %', X(d), y2 + ch2 + 10, { size: 9.5, color: C.faint, align: 'center' });
          kit.label(c, '0', lx - 6, y2 + ch2, { size: 9.5, color: C.faint, align: 'right' });
          kit.label(c, '6000 rpm', lx - 6, y2 + 4, { size: 9.5, color: C.faint, align: 'right' });
          if (eq.stalled) kit.label(c, 'dead zone: no rotation', X(v.D), Y(0) - 14, { size: 10.5, color: C.bad, align: 'center', bg: C.bg2 });
        }
        const heat = cw.rms * cw.rms * DS.R;
        ro.set('vavg', fmt(D * DS.VS, 3) + ' V');
        ro.set('n', eq.stalled ? '0 rpm (dead zone)' : fmt(w * 60 / (2 * Math.PI), 3) + ' rpm');
        ro.set('iavg', fmt(cw.avg, 3) + ' A  (winding heat ' + fmt(heat, 2) + ' W)');
        ro.set('rip', fmt(cw.max - cw.min, 3) + ' A');
        ro.set('tau', tText(L / DS.R));
        ro.set('snd', f < 800 ? 'a loud buzz' : f < 16000 ? 'an audible whine' : 'above most adults\' hearing');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dm-servo */
  Hyper.sim('dm-servo', {
    title: 'A servo pulse every 20 ms',
    blurb: `The ESP32 sends one pulse every 20 ms; its **width** is the command. The servo here turns 180° between 600 and 2400 µs. The horn follows at the servo's own speed, and the pulse the LEDC can really make is rounded to a whole number of duty steps.

**Try this**
- Drag the **pulse** from 1000 to 2000 µs: the horn moves a quarter of its travel for every 450 µs.
- Lower the **resolution** to 8 bits: one duty step is 78 µs, almost 8°, and the horn moves in visible jumps. At 14 bits a step is 1.2 µs.
- Command 500 or 2500 µs: that is past the servo's mechanical stop. It buzzes against the stop and draws its stall current.
- Tick **powered from the board's 3.3 V pin** and move the servo: the supply sags and the ESP32 resets. Give it its own 5 V supply.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 340, maxH: 520 });
      const MIN_US = 600, MAX_US = 2400, SPEED = 500;    // pulses for 0 and 180 degrees; degrees per second
      let horn = 90, sweepT = 0, resetT = 0, prevHorn = 90;
      const ctl = kit.controls(box.side, [
        { id: 'us', label: 'Commanded pulse', min: 500, max: 2500, step: 5, value: 1500, unit: 'µs' },
        { id: 'bits', type: 'select', label: 'LEDC resolution', options: [['8 bits', 8], ['10 bits', 10], ['12 bits', 12], ['14 bits (the S2, S3, C3 and C2 maximum)', 14]], value: 14 },
        { id: 'sweep', type: 'check', label: 'Sweep automatically', value: false },
        { id: 'bad', type: 'check', label: 'Powered from the board\'s 3.3 V pin (don\'t)', value: false }
      ], () => loop.start());
      const ro = kit.readout(box.side, [['us', 'Pulse made'], ['duty', 'Duty value'], ['ang', 'Angle commanded'], ['step', 'One duty step'], ['sup', 'Servo supply']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        if (v.sweep) { sweepT += dt; ctl.set('us', Math.round(MIN_US + (MAX_US - MIN_US) * (0.5 + 0.5 * Math.sin(sweepT * 1.4)))); }
        const steps = Math.pow(2, v.bits), duty = Math.round(v.us * 1e-6 * 50 * steps), usQ = duty / (50 * steps) * 1e6;
        const cmd = (usQ - MIN_US) / (MAX_US - MIN_US) * 180, tgt = clamp(cmd, 0, 180), atStop = cmd < -0.5 || cmd > 180.5;
        const sv = E.servo(90, { minUs: MIN_US, maxUs: MAX_US, bits: v.bits }), stepUs = sv.stepUs, stepDeg = sv.stepDeg;
        const dMax = SPEED * dt;
        prevHorn = horn; horn += clamp(tgt - horn, -dMax, dMax);
        const moving = Math.abs(horn - prevHorn) > 0.01 || atStop;
        if (v.bad && moving) resetT = 1.2;
        resetT = Math.max(0, resetT - dt);
        // the pulse train, 40 ms
        const lx = 56, pw = Math.max(80, W - lx - 14), wh = Math.round(H * 0.15);
        kit.label(c, 'The signal pin, two periods', lx, 12, { size: 11.5, color: C.text2, weight: 600 });
        const edges = [[0, 1], [usQ * 1e-6, 0], [0.02, 1], [0.02 + usQ * 1e-6, 0]];
        S.wave(c, lx, 26, pw, wh, edges, { t0: 0, t1: 0.04, color: kit.hue(205), fill: true, label: 'GPIO', idle: 0 });
        kit.label(c, '20 ms', lx + pw / 2, 26 + wh + 12, { size: 10.5, color: C.muted, align: 'center' });
        dash(c, lx + pw / 2, 26, lx + pw / 2, 26 + wh, C.faint, 1);
        kit.label(c, 'pulse ' + fmt(usQ, 4) + ' µs', lx, 26 + wh + 12, { size: 10.5, color: C.text, align: 'left', weight: 650 });
        // the servo
        const sy = 26 + wh + 74, sz = Math.min(150, W * 0.28), sx = Math.max(sz * 0.8, W * 0.2);
        S.servo(c, sx, sy, horn, { size: sz });
        kit.label(c, fmt(horn, 3) + '°', sx, sy + sz * 0.62, { size: 12.5, weight: 650, align: 'center' });
        if (atStop) kit.label(c, 'AT THE STOP: buzzing, stall current', sx, sy - sz * 0.62, { size: 11, color: C.bad, weight: 650, align: 'center', bg: C.bg2 });
        // the duty ruler: where the pulse falls among the steps
        const rx = Math.min(W - 24 - 20, sx + sz * 0.9 + 24), rw = W - rx - 16, ry = sy - 30;
        if (rw > 120) {
          kit.label(c, 'Pulse against the duty steps', rx, ry - 20, { size: 11, color: C.text2, weight: 600 });
          c.fillStyle = shade(C); c.fillRect(rx, ry, rw, 14);
          const X = u => rx + rw * (u - 500) / 2000;
          c.fillStyle = kit.hue(205, 0.45); c.fillRect(X(MIN_US), ry, X(MAX_US) - X(MIN_US), 14);
          if (stepUs * rw / 2000 >= 3) { c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); for (let u = 500; u <= 2500; u += stepUs) { const gx = Math.round(X(u)) + 0.5; c.moveTo(gx, ry); c.lineTo(gx, ry + 14); } c.stroke(); }
          c.fillStyle = C.accent; c.fillRect(X(usQ) - 1.5, ry - 5, 3, 24);
          frame(c, C, rx, ry, rw, 14);
          kit.label(c, '500', rx, ry + 28, { size: 9.5, color: C.faint, align: 'left' });
          kit.label(c, '2500 µs', rx + rw, ry + 28, { size: 9.5, color: C.faint, align: 'right' });
          kit.label(c, 'servo travel 600–2400 µs', X(1500), ry + 42, { size: 9.5, color: C.faint, align: 'center' });
          kit.label(c, stepUs >= 10 ? 'steps of ' + fmt(stepUs, 3) + ' µs, ' + fmt(stepDeg, 2) + '°' : 'fine steps: ' + fmt(stepUs, 3) + ' µs', rx, ry + 58, { size: 10.5, color: stepUs >= 30 ? C.warn : C.muted });
        }
        // the supply
        const vy = H - 40, bw = Math.min(200, W - 2 * 20);
        const sag = v.bad ? (moving ? 0.8 : 0.1) : 0;
        kit.label(c, v.bad ? '3.3 V rail: ' + fmt(3.3 - 3.3 * sag * 0.55, 3) + ' V' : 'servo has its own 5 V supply', 20, vy - 14, { size: 11, color: v.bad ? (resetT > 0 ? C.bad : C.muted) : C.ok, weight: 600 });
        c.fillStyle = shade(C); c.fillRect(20, vy, bw, 8);
        c.fillStyle = v.bad ? (resetT > 0 ? C.bad : C.warn) : C.ok; c.fillRect(20, vy, bw * (v.bad ? clamp(1 - sag * 0.55, 0.3, 1) : 1), 8);
        if (resetT > 0) kit.label(c, 'BROWNOUT: the ESP32 resets', 20 + bw + 10, vy + 4, { size: 11.5, color: C.bad, weight: 700 });
        ro.set('us', fmt(usQ, 4) + ' µs' + (Math.abs(usQ - v.us) > 0.5 ? '  (asked ' + v.us + ')' : ''));
        ro.set('duty', duty + ' of ' + steps);
        ro.set('ang', fmt(cmd, 3) + '°' + (atStop ? ' (past the stop)' : ''));
        ro.set('step', fmt(stepUs, 3) + ' µs = ' + fmt(stepDeg, 2) + '°');
        ro.set('sup', v.bad ? (resetT > 0 ? 'sagging: ESP32 resets' : 'a weak rail: will sag') : 'own 5 V, ground shared');
        if (!v.sweep && !moving && resetT <= 0) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dm-stepper-ramp */
  Hyper.sim('dm-stepper-ramp', {
    title: 'A stepper ramp against the torque curve',
    blurb: `A NEMA 17 motor (1.5 A per phase, 0.4 N·m holding torque) moving a load. The top chart is the step rate in time, the middle one the **torque the motor can give at each speed** against the torque the ramp **asks for** (the load plus what it takes to accelerate the inertia), the bottom one the position. The motor stalls where the asked torque rises above the curve, and then it stays where it is: the program does not know. A schematic model: real pull-out curves sit lower.

**Try this**
- Leave the ramp on and raise the **top step rate** and the **load torque**: the operating point on the torque chart moves right along the curve until the available torque falls under the load. At 24 V the curve reaches further than at 12 V. (A short distance never reaches the top rate: the move is a triangle.)
- Choose *No ramp*: the rotor must jump straight to speed. Above the pull-in rate it never starts. The ramp lets the same motor reach the same speed.
- Raise the **load inertia** and the acceleration: the torque the ramp needs rises with both.
- Change the microstepping: the same step rate is a slower shaft at 1/16, so more pulses a second are needed for the same rpm.`,
    mount(box, kit) {
      const E = kit.esp, M = kit.motor;
      const st = kit.stage(box.stage, { aspect: 1.0, minH: 460, maxH: 700 });
      let play = 0, tShown = 0, an = null;
      const ctl = kit.controls(box.side, [
        { id: 'dist', label: 'Distance', min: 200, max: 40000, value: 20000, unit: 'steps', log: true, sig: 3 },
        { id: 'vmax', label: 'Top step rate', min: 200, max: 80000, value: 12000, unit: 'steps/s', log: true, sig: 3 },
        { id: 'acc', label: 'Acceleration', min: 500, max: 2000000, value: 60000, unit: 'steps/s²', log: true, sig: 3 },
        { id: 'micro', type: 'select', label: 'Microstepping', options: [['full steps', 1], ['1/4', 4], ['1/16', 16]], value: 16 },
        { id: 'vs', type: 'select', label: 'Motor supply', options: [['12 V', 12], ['24 V', 24]], value: 12 },
        { id: 'tl', label: 'Load torque', min: 0, max: 300, step: 5, value: 60, unit: 'mN·m' },
        { id: 'jl', label: 'Load inertia', min: 0, max: 3000, step: 50, value: 400, unit: 'g·cm²' },
        { id: 'ramp', type: 'select', label: 'Start', options: [['With a trapezoidal ramp', 'ramp'], ['No ramp: straight to top speed', 'none']], value: 'ramp' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the move', primary: true }] }
      ], (id) => { analyse(); if (id === 'run') { play = 0; } tShown = 0; loop.start(); });
      const ro = kit.readout(box.side, [['rpm', 'Top speed'], ['len', 'Ramp length'], ['time', 'Move time'], ['need', 'Torque the ramp needs'], ['have', 'Torque at top speed'], ['res', 'Result']]);
      function analyse() {
        const v = ctl.values, N = 200 * v.micro, sp = M.stepper({ steps: 200, I: 1.5, R: 2.0, L: 0.004, Vs: v.vs, Th: 0.40 });
        const rpm = r => r / N * 60, avail = r => sp.torque(rpm(r)), J = 5.7e-6 + v.jl * 1e-7, TL = v.tl / 1000;
        const alpha = v.acc / N * 2 * Math.PI;
        const a = { N, sp, avail, rpm, J, TL, alpha, rows: [], stallT: null, T: 0, why: '' };
        if (v.ramp === 'none') {
          a.T = v.dist / v.vmax;
          const dth = 2 * Math.PI / 200, wcmd = v.vmax / N * 2 * Math.PI, margin = Math.max(0, sp.torque(0) - TL), wpi = Math.sqrt(2 * margin * dth / J);
          a.vpi = wpi / (2 * Math.PI) * N;
          const fails = wcmd > wpi || avail(v.vmax) < TL;
          if (fails) { a.stallT = 0; a.why = wcmd > wpi ? 'the rotor cannot jump to ' + fmt(v.vmax, 3) + ' steps/s: its pull-in rate is about ' + fmt(a.vpi, 2) + ' steps/s' : 'the load is more than the motor gives at that speed'; }
          for (let i = 0; i <= 120; i++) { const t = a.T * i / 120, x = v.vmax * t; a.rows.push({ t, v: i < 120 ? v.vmax : 0, x, va: fails ? 0 : (i < 120 ? v.vmax : 0), xa: fails ? 0 : x }); }
          a.need = null; a.vtop = v.vmax;
        } else {
          const pr = E.move(v.dist, v.vmax, v.acc);
          a.T = pr.tTotal; a.vtop = pr.vPeak; a.pr = pr; a.need = TL + J * alpha;
          let xs = 0, stalled = false;
          for (let i = 0; i <= 240; i++) {
            const t = pr.tTotal * i / 240, s = pr.at(t), acc = t < pr.tAcc ? 1 : (t > pr.tTotal - pr.tAcc ? -1 : 0);
            const need = Math.abs(TL + acc * J * alpha);
            if (!stalled && need > avail(s.v)) { stalled = true; a.stallT = t; a.why = 'at ' + fmt(rpm(s.v), 3) + ' rpm the motor gives ' + fmt(avail(s.v) * 1000, 3) + ' mN·m and the ramp asks for ' + fmt(need * 1000, 3) + ' mN·m'; }
            if (!stalled) xs = s.x;
            a.rows.push({ t, v: s.v, x: s.x, va: stalled ? 0 : s.v, xa: stalled ? xs : s.x });
          }
        }
        an = a;
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H;
        if (!an) analyse();
        const a = an, shownT = Math.max(a.T, 3);
        tShown = Math.min(shownT + 0.4, tShown + dt);
        const tp = Math.min(tShown, shownT) * a.T / shownT;               // the playhead, in move time
        const lx = 58, pw = Math.max(80, W - lx - 14), gap = 30, ph = Math.max(60, Math.floor((H - 3 * gap - 20) / 3));
        const vTop = Math.max(a.vtop, v.vmax) * 1.12, rpmTop = a.rpm(vTop);
        // 1: step rate against time
        let y = gap - 6;
        kit.label(c, 'Step rate against time' + (a.T < 3 ? ' (slowed down so you can watch)' : ''), lx, y - 8, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y, pw, ph);
        const Xt = t => lx + pw * clamp(t / a.T, 0, 1), Yv = r => y + ph - ph * clamp(r / vTop, 0, 1);
        const line = (key, color, wd, upto) => { c.save(); c.strokeStyle = color; c.lineWidth = wd; c.beginPath(); let first = true; for (const r of a.rows) { if (r.t > upto) break; if (first) { c.moveTo(Xt(r.t), Yv(r[key])); first = false; } else c.lineTo(Xt(r.t), Yv(r[key])); } c.stroke(); c.restore(); };
        line('v', C.faint, 1.4, a.T);
        line('va', C.accent, 2.6, tp);
        kit.label(c, fmt(vTop / 1.12, 3) + '/s', lx - 6, Yv(vTop / 1.12), { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, fmt(a.T, 3) + ' s', lx + pw, y + ph + 9, { size: 9.5, color: C.faint, align: 'right' });
        c.strokeStyle = C.warn; c.lineWidth = 1.2; c.beginPath(); c.moveTo(Xt(tp), y); c.lineTo(Xt(tp), y + ph); c.stroke();
        if (a.stallT != null) { kit.dot(c, Xt(a.stallT), Yv(a.rows.find(r => r.t >= a.stallT).v), 5, C.bad, C.text); kit.label(c, 'stall', Xt(a.stallT) + 8, Yv(a.rows.find(r => r.t >= a.stallT).v) - 8, { size: 10.5, color: C.bad, weight: 650 }); }
        // 2: torque against speed
        y += ph + gap + 6;
        kit.label(c, 'Torque against speed: given and asked', lx, y - 14, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y, pw, ph);
        const rmax = Math.max(rpmTop, 250), Tmax = 0.45, Xr = r => lx + pw * clamp(r / rmax, 0, 1), Yq = q => y + ph - ph * clamp(q / Tmax, 0, 1);
        c.save(); c.beginPath(); c.moveTo(Xr(0), Yq(0));
        for (let i = 0; i <= 80; i++) { const r = rmax * i / 80; c.lineTo(Xr(r), Yq(a.sp.torque(r))); }
        c.lineTo(Xr(rmax), Yq(0)); c.closePath(); c.fillStyle = C.dark ? 'rgba(34,179,122,.20)' : 'rgba(34,179,122,.16)'; c.fill(); c.strokeStyle = C.ok; c.lineWidth = 1.8; c.stroke(); c.restore();
        kit.label(c, 'available (' + v.vs + ' V)', Xr(rmax * 0.62), Yq(a.sp.torque(rmax * 0.62)) - 10, { size: 10.5, color: C.ok });
        const topRpm = a.rpm(a.vtop);
        if (a.need != null) {
          const bad = a.need > a.avail(a.vtop);
          c.save(); c.strokeStyle = bad ? C.bad : C.warn; c.lineWidth = 2.2; c.beginPath(); c.moveTo(Xr(0), Yq(a.need)); c.lineTo(Xr(topRpm), Yq(a.need)); c.stroke(); c.restore();
          kit.label(c, 'asked while accelerating: ' + fmt(a.need * 1000, 3) + ' mN·m', Xr(0) + 6, Yq(a.need) - 10, { size: 10.5, color: bad ? C.bad : C.warn });
        } else {
          dash(c, Xr(0), Yq(a.TL), Xr(topRpm), Yq(a.TL), C.warn, 1.6);
          kit.label(c, 'no ramp: the load is ' + fmt(a.TL * 1000, 3) + ' mN·m, and the jump needs a pull-in', Xr(0) + 6, Yq(a.TL) - 10, { size: 10.5, color: C.warn });
        }
        const cur = a.rows.reduce((b, r) => (r.t <= tp ? r : b), a.rows[0]);
        kit.dot(c, Xr(a.rpm(cur.va)), Yq(a.need != null ? a.need : a.TL), 5, a.stallT != null && tp >= a.stallT ? C.bad : C.accent, C.text);
        kit.label(c, fmt(rmax, 3) + ' rpm', lx + pw, y + ph + 9, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, fmt(Tmax * 1000, 3) + ' mN·m', lx - 6, y + 4, { size: 9.5, color: C.faint, align: 'right' });
        // 3: position
        y += ph + gap + 6;
        kit.label(c, 'Position against time: commanded (grey), rotor (blue)', lx, y - 14, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y, pw, ph);
        const Yx = s => y + ph - ph * clamp(s / v.dist, 0, 1);
        const lineX = (key, color, wd, upto) => { c.save(); c.strokeStyle = color; c.lineWidth = wd; c.beginPath(); let first = true; for (const r of a.rows) { if (r.t > upto) break; if (first) { c.moveTo(Xt(r.t), Yx(r[key])); first = false; } else c.lineTo(Xt(r.t), Yx(r[key])); } c.stroke(); c.restore(); };
        lineX('x', C.faint, 1.4, a.T); lineX('xa', C.accent, 2.6, tp);
        kit.label(c, fmt(v.dist, 4), lx - 6, y + 4, { size: 9.5, color: C.faint, align: 'right' });
        const last = a.rows[a.rows.length - 1], lost = Math.max(0, last.x - last.xa);
        if (lost > 0.5 && tp >= a.T * 0.98) kit.label(c, 'lost ' + fmt(lost, 4) + ' steps, and the program does not know', lx + pw / 2, y + ph / 2, { size: 11.5, color: C.bad, weight: 700, align: 'center', bg: C.bg2 });
        ro.set('rpm', fmt(a.rpm(a.vtop), 3) + ' rpm (' + fmt(a.vtop, 4) + ' steps/s)');
        ro.set('len', a.pr ? fmt(a.vtop * a.vtop / (2 * v.acc), 4) + ' steps' + (a.pr.triangle ? ' (never reaches top rate)' : '') : 'none');
        ro.set('time', fmt(a.T, 3) + ' s');
        ro.set('need', a.need != null ? fmt(a.need * 1000, 3) + ' mN·m' : '—');
        ro.set('have', fmt(a.avail(a.vtop) * 1000, 3) + ' mN·m');
        ro.set('res', a.stallT == null ? 'arrives' : 'stalls: ' + a.why);
        if (tShown >= shownT + 0.4) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      analyse();
      loop.start();
    }
  });

  /* ================================================================ dm-commutation */
  Hyper.sim('dm-commutation', {
    title: 'Six-step against sinusoidal drive',
    blurb: `A brushless motor seen as an electrical machine: the **rotor** (a magnet) at its electrical angle, and the **stator field** (green arrow) that the three phase currents make. Six-step drive switches the field in jumps of 60°; sinusoidal drive steers it smoothly, always 90° ahead of the rotor. Drawn slowed down: the real electrical frequency is in the read-out.

**Try this**
- In *six-step* watch the Hall signals change at every 60° and the pair of phases that conduct: one high, one low, one floating. The angle between rotor and field wanders from 60° to 120°, and the **torque ripples** about 13 %.
- Switch to *sinusoidal*: the three currents are smooth sine waves 120° apart and the torque is flat. That is field-oriented control.
- Raise the **pole pairs**: the same rpm gives a higher electrical frequency, and the control loop must keep up with it.
- Untick **Run** and drag the **rotor angle** to step through a revolution by hand.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1.0, minH: 470, maxH: 640 });
      let th = 20;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Drive', options: [['Six-step (trapezoidal)', 'six'], ['Sinusoidal (field-oriented)', 'foc']], value: params && params.mode === 'foc' ? 'foc' : 'six' },
        { id: 'rpm', label: 'Speed', min: 0, max: 6000, step: 50, value: 3000, unit: 'rpm' },
        { id: 'p', type: 'select', label: 'Pole pairs', options: [['1', 1], ['2', 2], ['4', 4], ['7 (a gimbal motor)', 7]], value: 7 },
        { id: 'run', type: 'check', label: 'Run (drawn slowed down)', value: true },
        { id: 'ang', label: 'Rotor angle', min: 0, max: 359, step: 1, value: 20, unit: '°' }
      ], (id, val) => {
        if (id === 'ang') { th = val; }
        if (id === 'run') { if (val) loop.start(); else loop.stop(); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['ang', 'Electrical angle'], ['drive', 'The phases'], ['fe', 'Electrical frequency'], ['delta', 'Angle, rotor to field'], ['rip', 'Torque ripple']]);
      const T6 = [[1, -1, 0], [1, 0, -1], [0, 1, -1], [-1, 1, 0], [-1, 0, 1], [0, -1, 1]];     // A, B, C: +1 high side, -1 low side, 0 floating
      const rad = d => d * Math.PI / 180, mod = (a, n) => ((a % n) + n) % n;
      const sector = a => Math.floor(mod(a + 30, 360) / 60);
      const phases = (mode, a) => {
        if (mode === 'six') return T6[(sector(a) + 2) % 6];
        const s = a + 90;
        return [Math.sin(rad(s)), Math.sin(rad(s - 120)), Math.sin(rad(s - 240))];
      };
      const fieldAngle = (mode, a) => mode === 'six' ? sector(a) * 60 + 90 : a + 90;
      const torque = (mode, a) => mode === 'six' ? Math.sin(rad(fieldAngle(mode, a) - a)) : 1;
      const loop = kit.loop(dt => {
        const v = ctl.values;
        if (v.run) { th = mod(th + dt * (40 + v.rpm / 6000 * 220), 360); ctl.set('ang', Math.round(th)); }
        draw();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, mode = v.mode, a = mod(th, 360);
        const narrow = W < 560;
        // the picture: rotor and field
        const r = narrow ? 44 : Math.min(84, W * 0.13), cx = narrow ? W / 2 : 24 + r + 18, cy = narrow ? r + 30 : 24 + r + 8;
        c.save(); c.beginPath(); c.arc(cx, cy, r + 12, 0, Math.PI * 2); c.strokeStyle = C.muted; c.lineWidth = 2; c.stroke(); c.restore();
        const PH = [['A', 0], ['B', 120], ['C', 240]];
        const drive = phases(mode, a);
        PH.forEach(([n, ang], i) => {
          const px = cx + Math.cos(rad(ang)) * (r + 12), py = cy - Math.sin(rad(ang)) * (r + 12), k = drive[i];
          kit.dot(c, px, py, 7, mode === 'six' ? (k > 0 ? C.warn : k < 0 ? C.accent : C.faint) : C.ok, C.text);
          kit.label(c, n, cx + Math.cos(rad(ang)) * (r + 28), cy - Math.sin(rad(ang)) * (r + 28), { size: 11, color: C.text2, align: 'center', weight: 650 });
        });
        // the rotor magnet
        c.save(); c.translate(cx, cy); c.rotate(-rad(a));
        c.fillStyle = '#d65a5a'; c.fillRect(0, -9, r * 0.8, 18); c.fillStyle = '#4f7fd6'; c.fillRect(-r * 0.8, -9, r * 0.8, 18);
        c.fillStyle = '#fff'; c.font = '700 11px system-ui'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('N', r * 0.4, 0); c.fillText('S', -r * 0.4, 0);
        c.restore();
        const fa = fieldAngle(mode, a);
        kit.arrow(c, cx, cy, cx + Math.cos(rad(fa)) * (r + 4), cy - Math.sin(rad(fa)) * (r + 4), C.ok, 3.4);
        kit.label(c, 'red/blue: rotor magnet', narrow ? 8 : 10, narrow ? 14 : cy + r + 44, { size: 10, color: C.muted });
        kit.label(c, 'green: stator field', narrow ? 8 : 10, narrow ? 30 : cy + r + 60, { size: 10, color: C.ok });
        // the plots against the electrical angle
        const lx = narrow ? 52 : cx + r + 70, top = narrow ? cy + r + 56 : 22, pw = Math.max(80, W - lx - 14), bottom = H - 22;
        const avail = bottom - top, hP = Math.round(avail * 0.4), hH = Math.round(avail * 0.2), hT = avail - hP - hH - 56;
        const X = d => lx + pw * d / 360, series = [kit.hue(8), kit.hue(140), kit.hue(220)];
        kit.label(c, 'Phase currents, one electrical revolution', lx, top - 10, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, top, pw, hP);
        PH.forEach(([n], i) => { S.analog(c, lx, top, pw, hP, d => phases(mode, d)[i], { t0: 0, t1: 360, min: -1.25, max: 1.25, color: series[i], steps: Math.round(pw / 1.5), zero: i === 0, width: 2 }); });
        PH.forEach(([n], i) => kit.label(c, n, lx - 8, top + 12 + i * 14, { size: 10.5, color: series[i], align: 'right', weight: 650 }));
        const hy = top + hP + 30;
        kit.label(c, 'Hall sensors', lx, hy - 12, { size: 11.5, color: C.text2, weight: 600 });
        const rowH = hH / 3;
        [['Ha', [[0, 1], [150, 0], [330, 1]]], ['Hb', [[0, 0], [90, 1], [270, 0]]], ['Hc', [[0, 1], [30, 0], [210, 1]]]].forEach(([n, ed], i) => { S.wave(c, lx, hy + i * rowH + 2, pw, rowH - 6, ed, { t0: 0, t1: 360, color: series[i], label: n, idle: ed[0][1] }); });
        const ty = hy + hH + 22;
        kit.label(c, 'Torque (relative)', lx, ty - 12, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, ty, pw, hT);
        S.analog(c, lx, ty, pw, hT, d => torque(mode, d), { t0: 0, t1: 360, min: 0.6, max: 1.05, color: mode === 'six' ? C.warn : C.ok, steps: Math.round(pw / 1.5), width: 2.2 });
        kit.label(c, '1.0', lx - 6, ty + hT * (0.05 / 0.45), { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '0.87', lx - 6, ty + hT * (1 - (0.866 - 0.6) / 0.45), { size: 9.5, color: C.faint, align: 'right' });
        // the cursor
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.3; c.beginPath(); c.moveTo(X(a), top); c.lineTo(X(a), ty + hT); c.stroke(); c.restore();
        kit.label(c, '0°', lx, ty + hT + 10, { size: 9.5, color: C.faint, align: 'left' });
        kit.label(c, '360°', lx + pw, ty + hT + 10, { size: 9.5, color: C.faint, align: 'right' });
        const fe = v.rpm * v.p / 60, names = ['A', 'B', 'C'], dr = names.map((n, i) => drive[i] > 0 ? n + ' high' : drive[i] < 0 ? n + ' low' : n + ' floating');
        ro.set('ang', fmt(a, 3) + '°');
        ro.set('drive', mode === 'six' ? dr.join(', ') : 'all three, as sine waves');
        ro.set('fe', fmt(fe, 4) + ' Hz  (the loop needs about ' + fmt(fe * 20 / 1000, 3) + ' kHz)');
        ro.set('delta', fmt(mod(fa - a + 180, 360) - 180, 3) + '°' + (mode === 'six' ? '  (60° to 120°)' : '  (always 90°)'));
        ro.set('rip', mode === 'six' ? '13 % peak to peak' : '0 %');
      };
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dm-quadrature */
  Hyper.sim('dm-quadrature', {
    title: 'Encoder counts into speed',
    blurb: `A geared motor turns and its encoder gives A and B edges; every edge is a count. Two ways to turn counts into speed run side by side: **count in a fixed window** and **time the gap between edges**.

**Try this**
- Set a low speed (5 to 10 rpm) with 44 counts per revolution: the window method reads 0 most of the time and jumps when a count arrives. The period method follows the speed after every edge.
- Raise the speed: the window method gets smooth, and the period method gets noisy with the discrete edges.
- Shorten the **window**: it responds faster, but one count is a bigger step in rpm. Lengthen it and the answer is finer but late.
- Turn up the **filter**: the filtered line is smooth but lags behind a changing speed. Tick *Speed wobbles* to see the lag.
- Raise the speed with 4096 counts: the edge rate passes what a MicroPython handler can follow, which the readout warns about.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 420, maxH: 660 });
      const SEQ = [[0, 0], [1, 0], [1, 1], [0, 1]], SPAN = 6;
      let t = 0, theta = 0, count = 0, A = [[-1, 0]], B = [[-1, 0]], curA = 0, curB = 0;
      let nextWin = 0.05, winCount = 0, lastWin = 0, estWin = 0, filt = 0, tLast = null, periodLast = null, estPer = 0, hist = [];
      const ctl = kit.controls(box.side, [
        { id: 'rpm', label: 'Speed of the output shaft', min: 0, max: 300, step: 1, value: 60, unit: 'rpm' },
        { id: 'wob', type: 'check', label: 'Speed wobbles (±40 %, every 3 s)', value: false },
        { id: 'cpr', type: 'select', label: 'Counts per revolution', options: [['44 (11 pulses, on the motor shaft)', 44], ['440 (1:10 gearbox)', 440], ['1320 (1:30 gearbox)', 1320], ['4096 (12-bit magnetic)', 4096]], value: 1320 },
        { id: 'win', label: 'Speed window', min: 5, max: 200, step: 5, value: 50, unit: 'ms' },
        { id: 'flt', label: 'Filter strength', min: 0, max: 0.95, step: 0.05, value: 0.5 },
        { type: 'buttons', items: [{ id: 'zero', label: 'Zero the count' }] }
      ], id => { if (id === 'zero') count = 0; });
      const ro = kit.readout(box.side, [['cnt', 'Counts in the last window'], ['res', 'One count is'], ['win', 'Window estimate'], ['per', 'Period estimate'], ['rate', 'Edges per second']]);
      const rps = tt => ctl.values.rpm / 60 * (ctl.values.wob ? 1 + 0.4 * Math.sin(2 * Math.PI * tt / 3) : 1);
      const loop = kit.loop(dt => {
        const v = ctl.values, cpr = v.cpr, win = v.win / 1000;
        if (win !== ctl._win) { ctl._win = win; nextWin = t + win; winCount = count; }
        const n = Math.max(1, Math.ceil(dt / 0.002)), h = dt / n;
        for (let i = 0; i < n; i++) {
          const s = rps(t), th0 = theta;
          theta += s * h;
          const c0 = Math.floor(th0 * cpr), c1 = Math.floor(theta * cpr);
          for (let k = c0 + 1; k <= c1; k++) {
            const tk = t + (s > 0 ? (k / cpr - th0) / s : 0);
            const [a, b] = SEQ[((k % 4) + 4) % 4];
            if (a !== curA) { A.push([tk, a]); curA = a; }
            if (b !== curB) { B.push([tk, b]); curB = b; }
            if (tLast != null) { periodLast = tk - tLast; estPer = periodLast > 0 ? 60 / (cpr * periodLast) : estPer; }
            tLast = tk; count++;
          }
          t += h;
          if (t >= nextWin) {
            const dc = count - winCount; winCount = count; lastWin = dc;
            estWin = dc / (cpr * win) * 60;
            filt += (1 - v.flt) * (estWin - filt);
            nextWin += win;
          }
        }
        // the period method decays between edges
        let per = estPer;
        if (tLast != null && periodLast != null && t - tLast > periodLast) per = Math.min(estPer, 60 / (cpr * (t - tLast)));
        if (tLast == null || t - tLast > 1.5) per = 0;
        hist.push([t, 60 * rps(t), estWin, filt, per]);
        while (hist.length > 2 && hist[0][0] < t - SPAN) hist.shift();
        while (A.length > 2 && A[1][0] < t - 3) A.shift();
        while (B.length > 2 && B[1][0] < t - 3) B.shift();
        draw(per);
      }, box.stage);
      const draw = per => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, cpr = v.cpr, win = v.win / 1000;
        const rate = Math.abs(rps(t)) * cpr;
        // the signals: about sixteen counts across the window
        const Tw = clamp(16 / Math.max(rate, 1), 0.02, 1), lh = Math.round(H * 0.2);
        const sh = e => [e[0] - (t - Tw), e[1]], eA = A.map(sh), eB = B.map(sh);
        kit.label(c, 'A and B, the last ' + tText(Tw), 10, 12, { size: 11.5, color: C.text2, weight: 600 });
        S.logic(c, 8, 22, W - 16, lh, [{ label: 'A', edges: eA, color: kit.hue(205), idle: E.proto.levelAt(eA, 0) }, { label: 'B', edges: eB, color: kit.hue(30), idle: E.proto.levelAt(eB, 0) }], { t0: 0, t1: Tw, labelW: 30, grid: 8 });
        kit.label(c, 'count ' + count + '   (' + fmt(count / cpr, 4) + ' turns)', W - 12, 12, { size: 12, weight: 700, align: 'right' });
        // the speed estimates against time
        const y = 22 + lh + 44, lx = 56, pw = Math.max(80, W - lx - 14), ch = H - y - 52;
        kit.label(c, 'Speed: the true speed and three estimates, last ' + SPAN + ' s', lx, y - 14, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y, pw, ch);
        const top = Math.max(60, v.rpm * 1.9 + 10), X = tt => lx + pw * clamp((tt - (t - SPAN)) / SPAN, 0, 1), Y = r => y + ch - ch * clamp(r / top, 0, 1);
        const path = (idx, color, wd, stair, dots) => {
          c.save(); c.strokeStyle = color; c.fillStyle = color; c.lineWidth = wd; c.beginPath();
          hist.forEach((p, i) => { if (i === 0) c.moveTo(X(p[0]), Y(p[idx])); else c.lineTo(X(p[0]), Y(p[idx])); });
          c.stroke(); c.restore();
        };
        path(1, C.text, 1.2); path(2, kit.hue(30), 1.4); path(4, kit.hue(290), 1.2); path(3, kit.hue(150), 2.6);
        kit.label(c, fmt(top, 3) + ' rpm', lx - 6, y + 4, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '0', lx - 6, y + ch, { size: 9.5, color: C.faint, align: 'right' });
        const ly = y + ch + 16;
        [['true', C.text], ['window', kit.hue(30)], ['period', kit.hue(290)], ['filtered', kit.hue(150)]].forEach(([n, col], i) => { const x = lx + i * Math.min(120, pw / 4); c.fillStyle = col; c.fillRect(x, ly - 4, 14, 3); kit.label(c, n, x + 18, ly, { size: 10, color: C.muted }); });
        const step = 60 / (cpr * win);
        ro.set('cnt', lastWin + ' in ' + v.win + ' ms');
        ro.set('res', fmt(step, 3) + ' rpm (' + fmt(step / Math.max(v.rpm, 0.01) * 100, 3) + ' % of this speed)');
        ro.set('win', fmt(estWin, 4) + ' rpm');
        ro.set('per', per > 0 ? fmt(per, 4) + ' rpm' : 'no edges yet');
        ro.set('rate', fmt(rate, 4) + (rate > 5000 ? '  (too fast for MicroPython handlers)' : ''));
      };
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dm-motor-pid */
  Hyper.sim('dm-motor-pid', {
    title: 'A DC motor under a position or speed loop',
    blurb: `A 6 V geared motor (output shaft, no-load speed 200 rpm, stiction like a real gearbox) with a 1320-count encoder, driven through a PWM output of ±100 %. The controller samples the encoder every **sample time**, so the speed it sees is quantised into counts.

**Try this**
- *Position*: step the target with *Alternate*. Raise Kp towards 1 with Kd at zero and set the target to a few hundred counts: the shaft overshoots and rings. Add Kd and it settles. Untick **Skip the dead zone** and watch it stop short of the target, where the output is below what the gearbox needs (about 14 %).
- Raise Kp until the motion oscillates all the time: the loop has become unstable. Then lengthen the **sample time** to 40 ms and see how a slow loop does the same at a lower gain.
- *Speed*: with Ki at zero the speed settles below the target and drops under load (a proportional-only offset); Ki removes it.
- Press **Push the shaft** or add **load torque**: the loop must pull the shaft back.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 640 });
      const R = 2.4, KE = 0.287, J = 1.8e-3, B = 0.002, TC = 0.10, VS = 6, CPR = 1320, TWO = 2 * Math.PI;
      let t = 0, theta = 0, w = 0, counts = 0, lastCounts = 0, acc = 0, integ = 0, u = 0, push = 0, target = 0, flipT = 0, hist = [];
      let stepInfo = null;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Loop', options: [['Position (PD)', 'position'], ['Speed (PI)', 'speed']], value: params && params.mode === 'speed' ? 'speed' : 'position' },
        { id: 'tpos', label: 'Target position', min: -1320, max: 1320, step: 10, value: 1320, unit: 'counts' },
        { id: 'tspd', label: 'Target speed', min: -200, max: 200, step: 5, value: 100, unit: 'rpm' },
        { id: 'alt', type: 'check', label: 'Alternate between 0 and the target every 3 s', value: true },
        { id: 'kp', label: 'Kp', min: 0.01, max: 1, step: 0.01, value: 0.1, unit: '% per count' },
        { id: 'kd', label: 'Kd', min: 0, max: 0.02, step: 0.0005, value: 0.002, unit: '% per count/s' },
        { id: 'kps', label: 'Kp', min: 0.02, max: 3, step: 0.02, value: 0.5, unit: '% per rpm' },
        { id: 'ki', label: 'Ki', min: 0, max: 10, step: 0.1, value: 2, unit: '% per rpm·s' },
        { id: 'ts', label: 'Sample time', min: 2, max: 50, step: 1, value: 10, unit: 'ms' },
        { id: 'skip', type: 'check', label: 'Skip the dead zone (minimum output 25 %)', value: true },
        { id: 'tl', label: 'Load torque', min: 0, max: 0.4, step: 0.02, value: 0, unit: 'N·m' },
        { type: 'buttons', items: [{ id: 'push', label: 'Push the shaft', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'push') push = 0.25;
        if (id === 'reset') { theta = 0; w = 0; counts = 0; lastCounts = 0; integ = 0; u = 0; hist = []; flipT = t; target = tgt(); stepInfo = null; }
        if (id === 'mode') { integ = 0; sync(); stepInfo = null; }
        if (id === 'tpos' || id === 'tspd' || id === 'alt') { newTarget(); }
        loop.start();
      });
      const sync = () => { const pos = ctl.values.mode === 'position'; ['tpos', 'kp', 'kd', 'skip'].forEach(i => ctl.show(i, pos)); ['tspd', 'kps', 'ki'].forEach(i => ctl.show(i, !pos)); };
      const tgtVal = () => ctl.values.mode === 'position' ? ctl.values.tpos : ctl.values.tspd;
      const tgt = () => (ctl.values.alt && Math.floor((t - flipT) / 3) % 2 === 0 ? 0 : tgtVal());
      const value = () => ctl.values.mode === 'position' ? counts : w * 60 / TWO;
      const newTarget = () => { const nt = tgt(); if (nt !== target) { stepInfo = { t0: t, from: value(), to: nt, extreme: 0, lastOut: t }; target = nt; } };
      sync();
      const ro = kit.readout(box.side, [['err', 'Error now'], ['out', 'Output'], ['os', 'Overshoot, last step'], ['set', 'Settled within 2 %']]);
      const loop = kit.loop(dt => {
        const v = ctl.values, pos = v.mode === 'position', Ts = v.ts / 1000, h = 0.0005, n = Math.max(1, Math.ceil(dt / h)), hh = dt / n;
        for (let i = 0; i < n; i++) {
          t += hh; acc += hh;
          const nt = tgt(); if (nt !== target) { stepInfo = { t0: t, from: value(), to: nt, extreme: 0, lastOut: t }; target = nt; }
          if (acc >= Ts) {                                  // the controller: one sample
            acc -= Ts;
            const dc = counts - lastCounts; lastCounts = counts;
            if (pos) {
              const e = target - counts, spd = dc / Ts;
              u = v.kp * e - v.kd * spd;
              if (Math.abs(e) <= 4) u = 0;
              else if (v.skip) u = Math.sign(u) * Math.max(Math.abs(u), 25);
            } else {
              const rpmM = dc / Ts / CPR * 60, e = target - rpmM;
              integ += e * Ts; const lim = 100 / Math.max(v.ki, 0.05); integ = clamp(integ, -lim, lim);
              u = v.kps * e + v.ki * integ;
            }
            u = clamp(u, -100, 100);
          }
          // the motor and its gearbox
          const V = u / 100 * VS, Tm = KE * (V - KE * w) / R, Tdrive = Tm - v.tl - (push > 0 ? 0.25 : 0);
          if (Math.abs(w) < 1e-3 && Math.abs(Tdrive) <= TC) w = 0;
          else { const wp = w; w += (Tdrive - B * w - TC * Math.sign(w || Tdrive)) / J * hh; if (wp !== 0 && wp * w < 0) w = 0; }
          theta += w * hh; counts = Math.floor(theta / TWO * CPR);
          push = Math.max(0, push - hh / 0.2 * 0.25);
        }
        const val = value();
        hist.push([t, target, val, u]);
        while (hist.length > 2 && hist[0][0] < t - 8) hist.shift();
        if (stepInfo) {
          const dir = Math.sign(stepInfo.to - stepInfo.from) || 1, band = Math.max(0.02 * Math.abs(stepInfo.to - stepInfo.from), pos ? 4 : 3);
          stepInfo.extreme = Math.max(stepInfo.extreme, dir * (val - stepInfo.to));
          if (Math.abs(val - stepInfo.to) > band) stepInfo.lastOut = t;
        }
        draw();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, pos = v.mode === 'position';
        const lx = 60, pw = Math.max(80, W - lx - 14), h1 = Math.round(H * 0.5), y1 = 24, y2 = y1 + h1 + 36, h2 = H - y2 - 24;
        kit.label(c, (pos ? 'Position' : 'Speed') + ': target (dashed) and shaft, last 8 s', lx, 12, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y1, pw, h1);
        const lo = pos ? Math.min(-200, ...hist.map(p => Math.min(p[1], p[2]))) : -230, hi = pos ? Math.max(1500, ...hist.map(p => Math.max(p[1], p[2]))) : 230;
        const X = tt => lx + pw * clamp((tt - (t - 8)) / 8, 0, 1), Y = q => y1 + h1 - h1 * clamp((q - lo) / (hi - lo || 1), 0, 1);
        if (lo < 0 && hi > 0) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, Y(0)); c.lineTo(lx + pw, Y(0)); c.stroke(); }
        const path = (idx, color, wd, dashed) => { c.save(); c.strokeStyle = color; c.lineWidth = wd; if (dashed) c.setLineDash([5, 4]); c.beginPath(); hist.forEach((p, i) => { if (i === 0) c.moveTo(X(p[0]), Y(p[idx])); else c.lineTo(X(p[0]), Y(p[idx])); }); c.stroke(); c.restore(); };
        path(1, C.warn, 1.5, true); path(2, C.accent, 2.4);
        kit.label(c, fmt(hi, 4) + (pos ? '' : ' rpm'), lx - 6, y1 + 4, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, fmt(lo, 4), lx - 6, y1 + h1, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, 'Output to the driver, %', lx, y2 - 12, { size: 11.5, color: C.text2, weight: 600 });
        frame(c, C, lx, y2, pw, h2);
        const Yu = q => y2 + h2 - h2 * (clamp(q, -100, 100) + 100) / 200;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, Yu(0)); c.lineTo(lx + pw, Yu(0)); c.stroke();
        c.save(); c.strokeStyle = kit.hue(30); c.lineWidth = 1.8; c.beginPath(); hist.forEach((p, i) => { if (i === 0) c.moveTo(X(p[0]), Yu(p[3])); else c.lineTo(X(p[0]), Yu(p[3])); }); c.stroke(); c.restore();
        kit.label(c, '+100', lx - 6, y2 + 4, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '−100', lx - 6, y2 + h2, { size: 9.5, color: C.faint, align: 'right' });
        const val = value(), err = target - val;
        const info = stepInfo, dir = info ? (Math.sign(info.to - info.from) || 1) : 1, span = info ? Math.abs(info.to - info.from) : 0;
        ro.set('err', fmt(err, 3) + (pos ? ' counts (' + fmt(err / CPR * 360, 3) + '°)' : ' rpm'));
        ro.set('out', fmt(u, 3) + ' %' + (Math.abs(u) >= 99.9 ? ' (clamped)' : ''));
        ro.set('os', info && span > 0 ? fmt(Math.max(0, info.extreme) / span * 100, 3) + ' %' : '—');
        ro.set('set', info && span > 0 ? (t - info.lastOut > 0.6 ? fmt(info.lastOut - info.t0, 3) + ' s' : 'still moving or ringing') : '—');
      };
      st.onResize(() => loop.once());
      newTarget();
      loop.start();
    }
  });

  /* ================================================================ dm-homing */
  Hyper.sim('dm-homing', {
    title: 'A homing sequence',
    blurb: `A stepper axis 3000 steps long with a limit switch at the left and a mechanical stop a little beyond it. The controller counts steps but does not know where the carriage is until it homes: **clear the switch if pressed, seek fast, back off, seek slowly, set zero**. The state of the sequence is lit above.

**Try this**
- Press **Home** from the middle, then from the far right: the seek takes longer but the result is the same. Compare the **home error**: it is only a few steps, and smaller with the slow approach at 250 steps/s than at 1000.
- Choose **Wire broken** with the *normally closed* wiring: the pin reads high from the start, which looks like a pressed switch. The axis tries to back off, fails, and the step limit stops it with a message.
- Switch to *normally open* wiring, break the wire and start from 3000: the pin never reads pressed, the carriage seeks the switch, and the step limit stops the search at 3100 steps, just before the mechanical stop.
- Do the same from a start near the switch, or untick **Step limit**: the carriage reaches the end stop first. A step limit only ends a search that would never finish; it does not replace a hard limit in the motor's enable or supply.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380, maxH: 540 });
      const FAST = 1250, XTRIG = 0, STOP = -200, HYS = 3, XMAX = 3000;
      const LIM = { CLEAR: 600, SEEK_FAST: 3100, BACKOFF: 600, SEEK_SLOW: 400 };
      const rand = rng(11);
      let X = 1800, P = 1234, latch = false, state = 'IDLE', budget = 0, margin = 0, acc = 0, msg = 'Press Home.', xHome = null, errSteps = null, lastK = 0;
      const ctl = kit.controls(box.side, [
        { id: 'start', label: 'Start position', min: 0, max: 3000, step: 50, value: 1800, unit: 'steps' },
        { id: 'wiring', type: 'select', label: 'Switch wiring', options: [['Normally closed: pin reads high if pressed or broken', 'nc'], ['Normally open: pin reads high if pressed', 'no']], value: 'nc' },
        { id: 'fault', type: 'select', label: 'Fault', options: [['None', 'none'], ['Wire broken', 'wire'], ['Switch jammed: never triggers', 'jam']], value: 'none' },
        { id: 'limit', type: 'check', label: 'Step limit (timeout) in every search', value: true },
        { id: 'slow', type: 'select', label: 'Slow approach speed', options: [['250 steps/s', 250], ['1000 steps/s', 1000]], value: 250 },
        { id: 'clock', type: 'select', label: 'Clock', options: [['real time', 1], ['4 times faster', 4], ['16 times faster', 16]], value: 4 },
        { type: 'buttons', items: [{ id: 'home', label: 'Home', primary: true }, { id: 'place', label: 'Put the carriage at the start' }] }
      ], id => {
        if (id === 'home') begin();
        if (id === 'place' || id === 'start') place();
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'State'], ['p', 'Position counter'], ['x', 'True position'], ['b', 'Steps in this state'], ['err', 'Home error'], ['msg', 'Message']]);
      const upd = () => { if (X <= XTRIG) latch = true; else if (X >= XTRIG + HYS) latch = false; };
      const reading = () => {
        const f = ctl.values.fault; let pressed = latch; if (f === 'jam') pressed = false;
        return ctl.values.wiring === 'nc' ? (pressed || f === 'wire') : (pressed && f !== 'wire');
      };
      const place = () => { X = ctl.values.start; P = 1234; xHome = null; errSteps = null; state = 'IDLE'; msg = 'Press Home.'; latch = false; upd(); };
      const begin = () => { state = reading() ? 'CLEAR' : 'SEEK_FAST'; budget = 0; margin = 0; xHome = null; errSteps = null; msg = state === 'CLEAR' ? 'The pin reads pressed: backing off first.' : 'Seeking the switch.'; };
      const move = d => { X += d; P += d; upd(); };
      const fault = m => { state = 'FAULT'; msg = m; };
      const crash = () => { state = 'CRASH'; msg = 'The carriage drove into the end stop. Nothing told the program to stop.'; };
      const detect = rate => { const k = Math.max(0, rate * (0.003 + (rand() - 0.5) * 0.002)), f = Math.floor(k); return f + (rand() < k - f ? 1 : 0); };
      const rate = () => (state === 'CLEAR' || state === 'SEEK_FAST' ? FAST : ctl.values.slow);
      const doStep = () => {
        const lim = ctl.values.limit;
        if (state === 'CLEAR') {
          move(1); budget++;
          if (!reading()) { state = 'SEEK_FAST'; budget = 0; msg = 'Seeking the switch.'; }
          else if (lim && budget > LIM.CLEAR) fault('Gave up after ' + LIM.CLEAR + ' steps: the pin still reads pressed. A broken wire on a normally closed switch looks like this.');
        } else if (state === 'SEEK_FAST') {
          move(-1); budget++;
          if (X <= STOP) crash();
          else if (reading()) { const k = detect(FAST); move(-k); lastK = k; if (X <= STOP) crash(); else { state = 'BACKOFF'; budget = 0; margin = 0; msg = 'Backing off until the switch releases.'; } }
          else if (lim && budget > LIM.SEEK_FAST) fault('Gave up after ' + LIM.SEEK_FAST + ' steps: the switch was never found. A broken switch or wire, or a wrong pin.');
        } else if (state === 'BACKOFF') {
          move(1); budget++;
          if (!reading()) { margin++; if (margin >= 100) { state = 'SEEK_SLOW'; budget = 0; msg = 'Approaching slowly.'; } }
          else if (lim && budget > LIM.BACKOFF) fault('Gave up after ' + LIM.BACKOFF + ' steps: the switch never released.');
        } else if (state === 'SEEK_SLOW') {
          move(-1); budget++;
          if (X <= STOP) crash();
          else if (reading()) {
            const k = detect(ctl.values.slow); move(-k);
            if (X <= STOP) crash(); else { xHome = X; errSteps = XTRIG - X; P = 0; state = 'READY'; msg = 'Home found: the counter is zero here.'; }
          } else if (lim && budget > LIM.SEEK_SLOW) fault('Gave up after ' + LIM.SEEK_SLOW + ' steps in the slow approach.');
        }
      };
      const loop = kit.loop(dt => {
        const active = ['CLEAR', 'SEEK_FAST', 'BACKOFF', 'SEEK_SLOW'];
        if (active.includes(state)) {
          acc += dt * ctl.values.clock * rate();
          let guard = 0;
          while (acc >= 1 && active.includes(state) && guard++ < 4000) { acc -= 1; doStep(); }
        }
        draw();
        if (!active.includes(state)) loop.stop();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, narrow = W < 560;
        const names = ['CLEAR', 'SEEK_FAST', 'BACKOFF', 'SEEK_SLOW', 'READY'], labels = ['clear', 'seek fast', 'back off', 'seek slow', 'ready'];
        const M = 10, bw = narrow ? (W - 2 * M - 3 * 8) / 4 : (W - 2 * M - 4 * 16) / 5, bh = 34;
        names.forEach((n, i) => {
          const row = narrow && i >= 4 ? 1 : 0, col = narrow ? (i % 4) : i, x = M + col * (bw + (narrow ? 8 : 16)), y = M + row * (bh + 8);
          const act = state === n;
          S.box(c, x, y, bw, bh, { label: labels[i], size: 11.5, active: act, color: act ? (n === 'READY' ? C.ok : C.accent) : C.faint, r: 7 });
          if (i < 4 && !(narrow && i === 3)) kit.arrow(c, x + bw + 1, y + bh / 2, x + bw + (narrow ? 7 : 15), y + bh / 2, C.faint, 1.4, 6);
        });
        const fy = M + (narrow ? 2 * (bh + 8) : bh + 12);
        const fAct = state === 'FAULT' || state === 'CRASH';
        S.box(c, M, fy, narrow ? W - 2 * M : bw * 2 + 16, 26, { label: state === 'CRASH' ? 'CRASH: no limit protected the axis' : 'fault: report and stop', size: 11, active: fAct, color: fAct ? C.bad : C.faint, dash: !fAct, r: 6, textColor: fAct ? C.bad : undefined });
        // the rail
        const lx = 30, pw = W - lx - 24, ry = fy + 26 + Math.round((H - fy - 26) * 0.34), Xs = x => lx + pw * (x + 300) / 3300;
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 3; c.beginPath(); c.moveTo(Xs(STOP), ry + 16); c.lineTo(Xs(XMAX + 40), ry + 16); c.stroke(); c.restore();
        c.fillStyle = C.dark ? '#5b6385' : '#9aa1bd'; c.fillRect(Xs(STOP) - 10, ry - 22, 10 + 2, 46);
        kit.label(c, 'stop', Xs(STOP) - 4, ry - 32, { size: 10, color: C.muted, align: 'center' });
        const pressed = latch && ctl.values.fault !== 'jam';
        S.box(c, Xs(XTRIG) - 8, ry - 20, 16, 22, { color: pressed ? C.warn : C.faint, active: pressed, r: 3 });
        kit.label(c, 'switch', Xs(XTRIG), ry + 36, { size: 10, color: C.muted, align: 'center' });
        if (xHome != null) { c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.6; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(Xs(xHome), ry - 34); c.lineTo(Xs(xHome), ry + 24); c.stroke(); c.restore(); kit.label(c, 'zero', Xs(xHome) + 4, ry - 38, { size: 10, color: C.ok, align: 'left', weight: 650 }); }
        const cw = 36;
        S.box(c, Xs(X) - cw / 2, ry - 14, cw, 28, { label: '', color: fAct ? C.bad : C.accent, active: true, r: 5 });
        kit.label(c, 'axis ' + fmt(XMAX, 4) + ' steps', lx + pw, ry + 36, { size: 10, color: C.muted, align: 'right' });
        // the pin and the budget
        const py = ry + 66, rd = reading(), act = ['CLEAR', 'SEEK_FAST', 'BACKOFF', 'SEEK_SLOW'].includes(state), lim = LIM[state];
        kit.label(c, 'Pin reads ' + (rd ? 'HIGH: "pressed"' : 'LOW: "not pressed"'), lx, py, { size: 12, weight: 650, color: rd ? C.warn : C.text2 });
        if (act && lim) {
          const bwid = Math.min(220, pw - 20), by = py + 22;
          c.fillStyle = shade(C); c.fillRect(lx, by, bwid, 8);
          c.fillStyle = budget / lim > 0.8 ? C.warn : C.accent; c.fillRect(lx, by, bwid * clamp(budget / lim, 0, 1), 8);
          kit.label(c, 'steps in this search: ' + budget + ' of ' + (ctl.values.limit ? lim : 'no limit'), lx, by + 20, { size: 10.5, color: C.muted });
        }
        ro.set('state', state === 'IDLE' ? 'waiting' : labels[names.indexOf(state)] || state.toLowerCase());
        ro.set('p', xHome == null && state !== 'READY' ? fmt(P, 5) + ' (unknown: it has not homed)' : fmt(P, 5) + ' steps');
        ro.set('x', fmt(X - (xHome != null ? xHome : 0), 5) + (xHome != null ? ' from the zero found' : ' from the switch'));
        ro.set('b', act ? budget + (ctl.values.limit && lim ? ' of ' + lim : '') : '—');
        ro.set('err', errSteps != null ? fmt(errSteps, 3) + ' steps = ' + fmt(errSteps / 400, 3) + ' mm at 400 steps/mm' : '—');
        ro.set('msg', msg);
      };
      st.onResize(() => loop.once());
      place();
      loop.once();
    }
  });

  /* ================================================================ dm-multi-axis */
  Hyper.sim('dm-multi-axis', {
    title: 'Two axes, one straight line',
    blurb: `Two stepper axes must move by Δx and Δy steps. **Coordinated** motion steps the longer axis on every tick and the shorter one only when its running total reaches a whole step: a line algorithm, in integers. The other mode gives both axes one step per tick, so the short axis arrives early and the path bends. The traces underneath are the STEP pins.

**Try this**
- Leave it *coordinated* with Δx 30 and Δy 12: the path stays within half a step of the dashed line and both axes arrive within a tick of each other. The Y pulses are spread evenly among the X pulses.
- Switch to *one step per tick*: the carriage goes diagonally first, then straight along X. The largest distance from the line is read out.
- Make Δx and Δy equal: both modes give the same result. Make one much smaller: the line algorithm shows long runs of single steps.
- Raise the **tick rate**: the dominant axis's step rate rises, and the shorter axis's rate is always lower, in proportion.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 640 });
      let tt = 0, hold = 0, plan = null;
      const ctl = kit.controls(box.side, [
        { id: 'dx', label: 'Distance in X', min: 1, max: 40, step: 1, value: 30, unit: 'steps' },
        { id: 'dy', label: 'Distance in Y', min: 1, max: 40, step: 1, value: 12, unit: 'steps' },
        { id: 'mode', type: 'select', label: 'How the axes step', options: [['Coordinated: in proportion', 'coord'], ['One step per tick each', 'same']], value: 'coord' },
        { id: 'rate', label: 'Tick rate', min: 2, max: 40, step: 1, value: 10, unit: 'ticks/s' },
        { type: 'buttons', items: [{ id: 'again', label: 'Run again', primary: true }] }
      ], () => { replan(); tt = 0; hold = 0; loop.start(); });
      const ro = kit.readout(box.side, [['dom', 'Dominant axis'], ['time', 'Move time'], ['rx', 'X step rate'], ['ry', 'Y step rate'], ['dev', 'Farthest from the line'], ['arr', 'Arrival']]);
      function replan() {
        const v = ctl.values, ax = v.dx, ay = v.dy, n = Math.max(ax, ay);
        const rows = []; let ex = Math.floor(n / 2), ey = Math.floor(n / 2), x = 0, y = 0, dev = 0, lastX = 0, lastY = 0;
        for (let i = 0; i < n; i++) {
          let sx, sy;
          if (v.mode === 'coord') { ex += ax; ey += ay; sx = ex >= n; sy = ey >= n; if (sx) ex -= n; if (sy) ey -= n; }
          else { sx = i < ax; sy = i < ay; }
          if (sx) { x++; lastX = i + 1; } if (sy) { y++; lastY = i + 1; }
          dev = Math.max(dev, Math.abs(ay * x - ax * y) / Math.hypot(ax, ay));
          rows.push({ sx, sy, x, y });
        }
        plan = { rows, n, ax, ay, dev, lastX, lastY };
      }
      replan();
      const loop = kit.loop(dt => {
        const v = ctl.values;
        if (tt >= plan.n / v.rate + 0.01) { hold += dt; if (hold > 1.6) { tt = 0; hold = 0; } } else tt += dt;
        draw();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, H = st.H, p = plan, T = p.n / v.rate;
        const tick = clamp(Math.floor(tt * v.rate), 0, p.n);
        // the plane
        const gx = 40, gy = 22, gw = W - gx - 16, gh = Math.round(H * 0.52), cs = Math.min(gw / (p.ax + 1), gh / (p.ay + 1));
        const ox = gx, oy = gy + gh;
        kit.label(c, 'The path in step space (X right, Y up)', gx, 10, { size: 11.5, color: C.text2, weight: 600 });
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i <= p.ax; i++) { c.moveTo(ox + i * cs, oy); c.lineTo(ox + i * cs, oy - p.ay * cs); }
        for (let j = 0; j <= p.ay; j++) { c.moveTo(ox, oy - j * cs); c.lineTo(ox + p.ax * cs, oy - j * cs); }
        c.stroke(); c.restore();
        dash(c, ox, oy, ox + p.ax * cs, oy - p.ay * cs, C.warn, 1.6);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 2.6; c.lineJoin = 'round'; c.beginPath(); c.moveTo(ox, oy);
        for (let i = 0; i < tick; i++) c.lineTo(ox + p.rows[i].x * cs, oy - p.rows[i].y * cs);
        c.stroke(); c.restore();
        const cur = tick > 0 ? p.rows[tick - 1] : { x: 0, y: 0 };
        kit.dot(c, ox + cur.x * cs, oy - cur.y * cs, 5.5, C.accent, C.text);
        kit.dot(c, ox + p.ax * cs, oy - p.ay * cs, 4, C.ok, C.text);
        kit.label(c, 'ideal line', ox + p.ax * cs * 0.55, oy - p.ay * cs * 0.55 - 12, { size: 10, color: C.warn, align: 'center' });
        kit.label(c, '0', ox - 8, oy, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, p.ay + '', ox - 8, oy - p.ay * cs, { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, p.ax + '', ox + p.ax * cs, oy + 10, { size: 9.5, color: C.faint, align: 'center' });
        // the STEP pins
        const ly = oy + 28, lh = H - ly - 6, per = 1 / v.rate;
        const ex = [[-per, 0]], ey = [[-per, 0]];
        p.rows.forEach((r, i) => { if (r.sx) ex.push([i * per, 1], [i * per + per * 0.5, 0]); if (r.sy) ey.push([i * per, 1], [i * per + per * 0.5, 0]); });
        S.logic(c, 8, ly, W - 16, lh, [{ label: 'X STEP', edges: ex, color: kit.hue(205), idle: 0 }, { label: 'Y STEP', edges: ey, color: kit.hue(30), idle: 0 }], { t0: 0, t1: Math.max(T, per), cursor: tt, labelW: 54, grid: 10 });
        const rx = p.ax / T, ry = p.ay / T;
        ro.set('dom', p.ax >= p.ay ? 'X (' + p.ax + ' steps, one every tick)' : 'Y (' + p.ay + ' steps, one every tick)');
        ro.set('time', fmt(T, 3) + ' s (' + p.n + ' ticks)');
        ro.set('rx', fmt(rx, 4) + ' steps/s');
        ro.set('ry', fmt(ry, 4) + ' steps/s');
        ro.set('dev', fmt(p.dev, 2) + ' steps' + (p.dev <= 0.51 ? ' (within half a step)' : ''));
        ro.set('arr', p.lastX === p.lastY ? 'both at tick ' + p.lastX : 'X at tick ' + p.lastX + ', Y at tick ' + p.lastY);
      };
      st.onResize(() => loop.once());
      loop.start();
    }
  });
})();
