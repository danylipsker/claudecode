/* HYPER-ESP32 · sims/control-and-automation.js
 *
 * Simulations of the topic "Control and automation":
 *   ca-loop        the same heated box twice, open loop and closed loop, with a door and a weak heater as disturbances
 *   ca-hysteresis  on-off control of a heater: the band, sensor noise and delay, minimum times (params: { room: true } for a room)
 *   ca-pid         a PID loop on a heated block with dead time: gains, setpoint steps, windup, noise, a kick
 *   ca-tuning      a step test drawn with its tangent, the Ziegler-Nichols gains computed from it, and the closed-loop result
 *   ca-jitter      the same loop run with a steady and with an uneven sample time, with an assumed or a measured dt
 *   ca-filter      a moving average, an exponential filter and a median on a noisy ramp, a step and spikes
 *   ca-tpc         time-proportioning: window, duty and thermal time constant against ripple and relay life
 *   ca-robot       a line-following robot with five sensors and a PD loop on a track
 *   ca-balance     a balancing robot: tilt, filter, gains, loop rate and a push
 *   ca-fault       a heater loop with faults injected (sensor open, shorted, loose, program hung, brownout) and safeguards
 *
 * Every plant is a small physical model (first-order lags, dead time, a pendulum, a differential drive) integrated with
 * fixed sub-steps; the controllers are the ones of the pages' programs. Everything is drawn in theme colours; static
 * pictures redraw on demand (loop.once), a running loop only where something moves by itself.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmt = (v, s) => Hyper.util.fmt(v, s);
  const shade = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const num = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 1 : d);
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const gauss = r => { let u = 0; while (u === 0) u = r(); const v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const niceStep = (span, n) => { const raw = Math.max(1e-9, span) / Math.max(1, n), p = Math.pow(10, Math.floor(Math.log10(raw))), f = raw / p; return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p; };
  const tick = v => { const a = Math.abs(v); return a >= 100 ? String(Math.round(v)) : String(Math.round(v * 100) / 100); };
  const dashed = (c, x0, y0, x1, y1, color, w) => { c.save(); c.setLineDash([5, 4]); c.strokeStyle = color; c.lineWidth = w || 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };

  /* a strip chart. o: { t0, t1, min, max, title, bands: [{ lo, hi, color }], hlines: [{ v, color, label }],
     series: [{ pts: [[t, v], …], color, width, dash, step, fill }] }; leaves room for the tick labels on its left */
  function chart(kit, c, C, x, y, w, h, o) {
    const lo = o.min, hi = o.max, span = Math.max(1e-9, o.t1 - o.t0);
    const X = t => x + w * clamp((t - o.t0) / span, 0, 1), Y = v => y + h - h * clamp((v - lo) / Math.max(1e-9, hi - lo), 0, 1);
    c.fillStyle = shade(C); c.fillRect(x, y, w, h);
    for (const b of o.bands || []) { c.fillStyle = b.color; const y1 = Y(b.hi), y2 = Y(b.lo); c.fillRect(x, y1, w, Math.max(1, y2 - y1)); }
    const step = o.step || niceStep(hi - lo, Math.max(2, Math.floor(h / 34)));
    c.lineWidth = 1;
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) {
      const yy = Math.round(Y(v)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, yy); c.lineTo(x + w, yy); c.stroke();
      kit.label(c, tick(v), x - 5, yy, { size: 10, color: C.muted, align: 'right' });
    }
    if (o.xstep) for (let tt = Math.ceil(o.t0 / o.xstep - 1e-9) * o.xstep; tt <= o.t1 + 1e-9; tt += o.xstep) {
      const xx = Math.round(X(tt)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(xx, y); c.lineTo(xx, y + h); c.stroke();
      kit.label(c, o.xfmt ? o.xfmt(tt) : tick(tt), xx, y + h + 10, { size: 10, color: C.muted, align: 'center' });
    }
    c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
    for (const hl of o.hlines || []) dashed(c, x, Y(hl.v), x + w, Y(hl.v), hl.color || C.text2, 1.4);
    for (const s of o.series || []) {
      const p = s.pts; if (!p || p.length < 2) continue;
      c.strokeStyle = s.color; c.lineWidth = s.width || 2; c.setLineDash(s.dash || []); c.lineJoin = 'round'; c.beginPath();
      c.moveTo(X(p[0][0]), Y(p[0][1]));
      for (let i = 1; i < p.length; i++) { if (s.step) c.lineTo(X(p[i][0]), Y(p[i - 1][1])); c.lineTo(X(p[i][0]), Y(p[i][1])); }
      if (s.fill) { c.stroke(); c.setLineDash([]); c.lineTo(X(p[p.length - 1][0]), Y(lo)); c.lineTo(X(p[0][0]), Y(lo)); c.closePath(); c.fillStyle = s.fill; c.fill(); }
      else c.stroke();
      c.setLineDash([]);
    }
    c.restore();
    c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w, h);
    if (o.title) kit.label(c, o.title, x + 7, y + 10, { size: 10.5, color: C.muted });
    for (const hl of o.hlines || []) if (hl.label) kit.label(c, hl.label, x + w - 6, clamp(Y(hl.v) - 9, y + 8, y + h - 8), { size: 10, color: hl.color || C.text2, align: 'right' });
    return { X, Y };
  }
  /* a one-line (or wrapped) legend of coloured line samples; -> the height used */
  const legendW = label => 26 + String(label).length * 5.9 + 14;
  /* the extra height a legend needs when it wraps (17 px per extra row), from the labels alone */
  function legendExtra(labels, x, maxX) {
    let cx = x, rows = 1;
    for (const l of labels) { const w = legendW(l); if (cx + w > maxX && cx > x) { cx = x; rows++; } cx += w; }
    return 17 * (rows - 1);
  }
  function legend(kit, c, C, x, y, maxX, items) {
    let cx = x, cy = y;
    for (const it of items) {
      const w = legendW(it.label);
      if (cx + w > maxX && cx > x) { cx = x; cy += 17; }
      c.strokeStyle = it.color; c.lineWidth = it.width || 2.2; c.setLineDash(it.dash || []); c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + 18, cy); c.stroke(); c.setLineDash([]);
      kit.label(c, it.label, cx + 23, cy, { size: 10.5, color: C.text2 });
      cx += w;
    }
    return cy - y + 17;
  }
  /* a PID step like the one in the pages' programs: conditional integration, derivative on the measurement */
  function makePid() {
    let integ = 0, prev = null;
    return {
      step(o, sp, pv, dt) {
        const err = sp - pv, p = o.kp * err, d = prev == null || dt <= 0 ? 0 : -o.kd * (pv - prev) / dt;
        prev = pv;
        let out = p + integ + d, u = out;
        if (out > o.max) { u = o.max; if (!o.aw) integ += o.ki * err * dt; }
        else if (out < o.min) { u = o.min; if (!o.aw) integ += o.ki * err * dt; }
        else integ += o.ki * err * dt;
        return { out: u, raw: out, p, i: integ, d, err };
      },
      preset(i, pv) { integ = i; prev = pv; },
      get integ() { return integ; }
    };
  }

  /* ================================================================ ca-loop */
  Hyper.sim('ca-loop', {
    title: 'The same box, open loop and closed loop',
    blurb: `Two identical heated boxes get the same setpoint. The **open-loop** box is given the power that is exactly right for a healthy heater in a room at 20 °C and never looks at the result. The **closed-loop** box measures its temperature and corrects the power (a PI controller).

**Try this**
- Leave everything alone: both reach the setpoint. Open loop is fine when the process is known.
- Tick **door open**: more heat leaks out. The open-loop box settles lower; the closed-loop box raises its power and keeps the setpoint.
- Tick **heater 20 % weaker**, then lower the **room temperature**: open loop is wrong each time, closed loop is right each time.
- Watch the power curves: the closed loop *works* to get the temperature back, the open loop does nothing.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.84, minH: 360, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'sp', label: 'Setpoint', min: 30, max: 70, step: 1, value: 50, unit: '°C' },
        { id: 'amb', label: 'Room temperature', min: 0, max: 35, step: 1, value: 20, unit: '°C' },
        { id: 'door', type: 'check', label: 'Door open (heat leaks out faster)', value: false },
        { id: 'weak', type: 'check', label: 'Heater 20 % weaker', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset') restart(); loop.once(); });
      const ro = kit.readout(box.side, [['open', 'Open loop: temperature'], ['closed', 'Closed loop: temperature'], ['pow', 'Power (open · closed)'], ['err', 'Error (open · closed)']]);
      const K0 = 60, TAU0 = 30, H = 0.1, WIN = 240, SPEED = 6, KP = 0.06, KI = 0.004, NOMINAL = 20;
      let t = 0, acc = 0, To = 20, Tc = 20, integ = 0, uo = 0, uc = 0, hist = [], lastRec = 0;
      function restart() { t = 0; acc = 0; To = Tc = ctl.values.amb; integ = 0; hist = []; lastRec = -1; uo = 0; uc = 0; }
      const plant = (T, u, v) => { let gain = K0 * (v.weak ? 0.8 : 1), tau = TAU0; if (v.door) { gain *= 0.65; tau *= 0.65; } return T + H / tau * (gain * u - (T - v.amb)); };
      function advance() {
        const v = ctl.values;
        uo = clamp((v.sp - NOMINAL) / K0, 0, 1);                        // the best open-loop guess: right for a healthy heater at 20 °C
        To = plant(To, uo, v);
        const err = v.sp - Tc, raw = KP * err + integ;
        uc = clamp(raw, 0, 1);
        if (!((raw > 1 && err > 0) || (raw < 0 && err < 0))) integ += KI * err * H;
        Tc = plant(Tc, uc, v);
        t += H;
        if (t - lastRec >= 0.5) { lastRec = t; hist.push([t, To, Tc, uo * 100, uc * 100]); }
        while (hist.length > 2 && hist[0][0] < t - WIN - 2) hist.shift();
      }
      const loop = kit.loop(dt => {
        acc += dt * SPEED;
        while (acc >= H) { advance(); acc -= H; }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        const gap = 10, bw = (W - 2 * 10 - gap) / 2;
        S.box(c, 10, 6, bw, 40, { label: 'Open loop', sub: 'power fixed at ' + Math.round(uo * 100) + ' %', color: kit.hue(30), size: 12.5 });
        S.box(c, 10 + bw + gap, 6, bw, 40, { label: 'Closed loop', sub: 'measures, then corrects', color: C.accent, size: 12.5, active: true });
        const ex = legendExtra(['open loop', 'closed loop', 'setpoint'], M, W - 10), y1 = 62, h1 = Math.round((st.H - 62 - 66 - ex) * 0.64), y2 = y1 + h1 + 20, h2 = st.H - y2 - 36 - ex;
        const t1 = Math.max(t, WIN), t0 = t1 - WIN;
        const oc = kit.hue(30), cc = C.accent;
        chart(kit, c, C, M, y1, cw, h1, { t0, t1, min: 0, max: 80, step: 20, title: 'temperature (°C) · last 4 min, shown 6× faster', hlines: [{ v: v.sp, color: C.text2 }],
          series: [{ pts: hist.map(p => [p[0], p[1]]), color: oc, width: 2.2 }, { pts: hist.map(p => [p[0], p[2]]), color: cc, width: 2.2 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0, t1, min: 0, max: 100, step: 50, title: 'heater power (%)',
          series: [{ pts: hist.map(p => [p[0], p[3]]), color: oc, width: 2.2 }, { pts: hist.map(p => [p[0], p[4]]), color: cc, width: 2.2 }] });
        legend(kit, c, C, M, st.H - 18 - ex, W - 10, [{ label: 'open loop', color: oc }, { label: 'closed loop', color: cc }, { label: 'setpoint', color: C.text2, dash: [5, 4], width: 1.4 }]);
        ro.set('open', num(To) + ' °C'); ro.set('closed', num(Tc) + ' °C');
        ro.set('pow', Math.round(uo * 100) + ' % · ' + Math.round(uc * 100) + ' %');
        ro.set('err', num(v.sp - To) + ' · ' + num(v.sp - Tc) + ' °C');
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });

  /* ================================================================ ca-hysteresis */
  const HYS = {
    box: { name: 'a heated box', tau: 30, K: 60, win: 240, speed: 6, h: 0.05, rec: 0.2, ymargin: 12, caption: 'last 4 min, 6× faster', unit: 's',
      sp: [30, 60, 45, 1], band: [0, 10, 4, 0.1], noise: [0, 2, 0.3, 0.05], lag: [0, 10, 3, 0.5], minT: [0, 30, 0, 1], minUnit: 's', minScale: 1, ambLabel: 'Room temperature', amb: [0, 30, 20, 1] },
    room: { name: 'a room', tau: 14400, K: 40, win: 28800, speed: 700, h: 5, rec: 30, ymargin: 3.5, caption: 'last 8 h, 700× faster', unit: 'min',
      sp: [15, 25, 21, 0.5], band: [0, 3, 0.6, 0.1], noise: [0, 0.5, 0.1, 0.05], lag: [0, 300, 60, 5], minT: [0, 10, 3, 0.5], minUnit: 'min', minScale: 60, ambLabel: 'Outside temperature', amb: [-10, 15, 5, 1] }
  };
  Hyper.sim('ca-hysteresis', {
    title: 'On-off control and its gap',
    blurb: `The heater is fully on or fully off. It switches **on** when the *reading* falls below the lower edge of the band and **off** above the upper edge; between the two it keeps its state. The shaded band is the hysteresis, the grey line is what the sensor reports (with noise and delay) and the blue line is the real temperature.

**Try this**
- Set the **band to 0** with some noise: the heater chatters at every wobble of the reading, the switch-ons per hour explode.
- Open the band to 4: few switchings, a wide swing. Compare the swing with the band when the **sensor delay** is large: the real temperature overshoots both edges.
- Set a **minimum on and off time**: the switch is protected, and the swing grows.
- Lower the outside or room temperature and see the duty and the cycle rate change.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const cfg = params && params.room ? HYS.room : HYS.box;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 340, maxH: 580 });
      const rnd = rng(5);
      const ctl = kit.controls(box.side, [
        { id: 'sp', label: 'Setpoint', min: cfg.sp[0], max: cfg.sp[1], step: cfg.sp[3], value: cfg.sp[2], unit: '°C' },
        { id: 'band', label: 'Hysteresis band (total)', min: cfg.band[0], max: cfg.band[1], step: cfg.band[3], value: cfg.band[2], unit: '°C' },
        { id: 'noise', label: 'Sensor noise', min: cfg.noise[0], max: cfg.noise[1], step: cfg.noise[3], value: cfg.noise[2], unit: '°C' },
        { id: 'lag', label: 'Sensor delay (time constant)', min: cfg.lag[0], max: cfg.lag[1], step: cfg.lag[3], value: cfg.lag[2], unit: 's' },
        { id: 'minT', label: 'Minimum on and off time', min: cfg.minT[0], max: cfg.minT[1], step: cfg.minT[3], value: cfg.minT[2], unit: cfg.minUnit },
        { id: 'amb', label: cfg.ambLabel, min: cfg.amb[0], max: cfg.amb[1], step: cfg.amb[3], value: cfg.amb[2], unit: '°C' },
        { id: 'door', type: 'check', label: params && params.room ? 'A window is open (more heat loss)' : 'Door open (more heat loss)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset') restart(); });
      const ro = kit.readout(box.side, [['swing', 'Swing of the real temperature'], ['rate', 'Switch-ons per hour'], ['avg', 'Average temperature'], ['duty', 'Heater on']]);
      let t, acc, T, Sd, heating, lastChange, ons, hist, edges, lastRec;
      function restart() { const v = ctl.values; t = 0; acc = 0; T = Sd = v.sp; heating = false; lastChange = -1e9; ons = []; hist = []; edges = [[0, 0]]; lastRec = -1e9; }
      function advance() {
        const v = ctl.values, h = cfg.h, f = v.door ? 0.6 : 1, tau = cfg.tau * f, K = cfg.K * f;
        Sd += (v.lag <= h ? 1 : h / v.lag) * (T - Sd);
        const reading = Sd + v.noise * gauss(rnd), minT = v.minT * cfg.minScale;
        if (!heating && reading < v.sp - v.band / 2 && t - lastChange >= minT) { heating = true; lastChange = t; ons.push(t); edges.push([t, 0], [t, 1]); }
        else if (heating && reading > v.sp + v.band / 2 && t - lastChange >= minT) { heating = false; lastChange = t; edges.push([t, 1], [t, 0]); }
        T += h / tau * (K * (heating ? 1 : 0) - (T - v.amb));
        t += h;
        if (t - lastRec >= cfg.rec) { lastRec = t; hist.push([t, T, reading, heating ? 1 : 0]); }
        const old = t - cfg.win - 2;
        while (hist.length > 2 && hist[0][0] < old) hist.shift();
        while (edges.length > 4 && edges[2][0] < old) edges.shift();
        while (ons.length && ons[0] < old) ons.shift();
      }
      const loop = kit.loop(dt => {
        acc += dt * cfg.speed;
        let n = 0;
        while (acc >= cfg.h && n++ < 4000) { advance(); acc -= cfg.h; }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        const ex = legendExtra(['real temperature', 'what the sensor reports', 'setpoint', 'hysteresis band'], M, W - 10), y1 = 14, h1 = Math.round((st.H - 14 - 70 - ex) * 0.74), y2 = y1 + h1 + 22, h2 = st.H - y2 - 34 - ex;
        const t1 = Math.max(t, cfg.win), t0 = t1 - cfg.win;
        const lo = v.sp - cfg.ymargin - v.band / 2, hi = v.sp + cfg.ymargin + v.band / 2;
        chart(kit, c, C, M, y1, cw, h1, { t0, t1, min: lo, max: hi, title: 'temperature (°C) · ' + cfg.caption,
          bands: [{ lo: v.sp - v.band / 2, hi: v.sp + v.band / 2, color: kit.hue(150, C.dark ? 0.22 : 0.2) }], hlines: [{ v: v.sp, color: C.text2 }],
          series: [{ pts: hist.map(p => [p[0], p[2]]), color: C.muted, width: 1.1 }, { pts: hist.map(p => [p[0], p[1]]), color: C.accent, width: 2.4 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0, t1, min: -0.15, max: 1.15, step: 1, title: 'heater (on = 1)',
          series: [{ pts: edges.concat([[t, heating ? 1 : 0]]), color: kit.hue(30), width: 1.8, fill: kit.hue(30, 0.25) }] });
        legend(kit, c, C, M, st.H - 18 - ex, W - 10, [{ label: 'real temperature', color: C.accent }, { label: 'what the sensor reports', color: C.muted, width: 1.2 }, { label: 'setpoint', color: C.text2, dash: [5, 4], width: 1.4 }, { label: 'hysteresis band', color: kit.hue(150, 0.5), width: 7 }]);
        // the numbers
        const recent = hist.filter(p => p[0] >= t - cfg.win * 0.6);
        let mn = 1e9, mx = -1e9, sum = 0, on = 0;
        for (const p of recent) { mn = Math.min(mn, p[1]); mx = Math.max(mx, p[1]); sum += p[1]; on += p[3]; }
        const have = recent.length > 5 && t > cfg.win * 0.25;
        const span = Math.min(t, cfg.win);
        ro.set('swing', have ? num(mx - mn, 2) + ' °C' : 'measuring …');
        ro.set('avg', have ? num(sum / recent.length, 2) + ' °C' : '…');
        ro.set('duty', have ? Math.round(100 * on / recent.length) + ' % of the time' : '…');
        const perHour = span > 0 ? ons.length / (span / 3600) : 0;
        ro.set('rate', span > cfg.win * 0.1 ? Math.round(perHour) + ' an hour' : 'measuring …');
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });

  /* ================================================================ ca-pid */
  Hyper.sim('ca-pid', {
    title: 'A PID loop on a heated block',
    blurb: `A heated block with a time constant of 30 s and 6 s of dead time (the sensor sits a little way from the heater). The controller runs every 0.25 s; the setpoint steps up and down by itself. The lower chart shows the output and, dashed, the **integral term**, which is what winds up.

**Try this**
- Start with **Ki = 0 and Kd = 0**: the block never quite reaches the setpoint. That is the offset of P control. Raise Ki until it goes.
- Raise Kp and Ki until the temperature overshoots. Then switch **anti-windup** off and make the step large: the integral runs far past the 100 % limit and the overshoot grows.
- Add **Kd** with noise on: the output jitters. Tick **filter the measurement** and it calms down.
- Press **Open the door** for a disturbance and watch how fast each setting recovers.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.92, minH: 380, maxH: 640 });
      const rnd = rng(9);
      const ctl = kit.controls(box.side, [
        { id: 'kp', label: 'Kp (% per °C)', min: 0, max: 30, step: 0.1, value: 6 },
        { id: 'ki', label: 'Ki (% per °C·s)', min: 0, max: 2, step: 0.01, value: 0.2 },
        { id: 'kd', label: 'Kd (% · s per °C)', min: 0, max: 150, step: 1, value: 0 },
        { id: 'hi', label: 'High setpoint', min: 40, max: 95, step: 1, value: 80, unit: '°C' },
        { id: 'auto', type: 'check', label: 'Step the setpoint by itself', value: true },
        { id: 'aw', type: 'check', label: 'Anti-windup: stop integrating at the limits', value: true },
        { id: 'noise', label: 'Sensor noise', min: 0, max: 1.5, step: 0.05, value: 0.2, unit: '°C' },
        { id: 'filt', type: 'check', label: 'Filter the measurement (EMA, α = 0.2)', value: false },
        { type: 'buttons', items: [{ id: 'kick', label: 'Open the door for 20 s', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => { if (id === 'reset') restart(); if (id === 'kick') door = 20; });
      const ro = kit.readout(box.side, [['out', 'Output'], ['p', 'P term'], ['i', 'I term'], ['d', 'D term'], ['os', 'Overshoot of the last up-step'], ['ts', 'Settling time (±2 %)']]);
      const K = 0.8, TAU = 30, DEAD = 6, AMB = 20, LOW = 30, H = 0.25, SPEED = 8, WIN = 240, ND = Math.round(DEAD / H);
      let t, acc, T, queue, pid, fpv, hist, door, sp, stepAt, stepFrom, stepTo, peak, lastOut, last;
      function restart() {
        t = 0; acc = 0; T = LOW; queue = []; for (let i = 0; i < ND; i++) queue.push((LOW - AMB) / K);
        pid = makePid(); pid.preset((LOW - AMB) / K, LOW); fpv = LOW; hist = []; door = 0; sp = LOW; stepAt = -1; stepFrom = LOW; stepTo = LOW; peak = LOW; lastOut = 0; last = { out: 12.5, p: 0, i: 12.5, d: 0 };
      }
      function advance() {
        const v = ctl.values;
        const target = v.auto ? ((t % 220) < 20 ? LOW : (t % 220) < 130 ? v.hi : LOW) : v.hi;
        if (target !== sp) { if (target > sp) { stepAt = t; stepFrom = sp; stepTo = target; peak = T; lastOut = t; } sp = target; }
        const pv = T + v.noise * gauss(rnd);
        fpv = v.filt ? fpv + 0.2 * (pv - fpv) : pv;
        const r = pid.step({ kp: v.kp, ki: v.ki, kd: v.kd, min: 0, max: 100, aw: v.aw }, sp, fpv, H);
        last = r;
        queue.push(r.out); const ud = queue.shift();
        const f = door > 0 ? 0.6 : 1;
        T += H / (TAU * f) * (K * f * ud - (T - AMB));
        if (door > 0) door -= H;
        t += H;
        if (stepAt >= 0 && sp === stepTo) { peak = Math.max(peak, T); if (Math.abs(T - stepTo) > 0.02 * (stepTo - stepFrom)) lastOut = t; }
        hist.push([t, T, sp, r.out, r.i, fpv]);
        while (hist.length > 2 && hist[0][0] < t - WIN - 2) hist.shift();
      }
      const loop = kit.loop(dt => {
        acc += dt * SPEED;
        let n = 0;
        while (acc >= H && n++ < 200) { advance(); acc -= H; }
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        const ex = legendExtra(['temperature', 'setpoint', 'what the controller reads', 'output', 'integral term'], M, W - 10), y1 = 12, h1 = Math.round((st.H - 12 - 70 - ex) * 0.6), y2 = y1 + h1 + 20, h2 = st.H - y2 - 36 - ex;
        const t1 = Math.max(t, WIN), t0 = t1 - WIN;
        chart(kit, c, C, M, y1, cw, h1, { t0, t1, min: 10, max: 110, step: 20, title: 'temperature (°C) · last 4 min, shown 8× faster',
          hlines: [{ v: 100, color: C.faint }],
          series: [{ pts: hist.map(p => [p[0], p[2]]), color: C.text2, width: 1.5, dash: [5, 4], step: true }, { pts: hist.map(p => [p[0], p[5]]), color: C.muted, width: 1 }, { pts: hist.map(p => [p[0], p[1]]), color: C.accent, width: 2.4 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0, t1, min: -50, max: 150, step: 50, title: 'controller output (%), limits 0 and 100',
          hlines: [{ v: 100, color: C.faint }, { v: 0, color: C.faint }],
          series: [{ pts: hist.map(p => [p[0], p[4]]), color: kit.hue(30), width: 1.6, dash: [5, 4] }, { pts: hist.map(p => [p[0], p[3]]), color: C.accent, width: 2 }] });
        legend(kit, c, C, M, st.H - 18 - ex, W - 10, [{ label: 'temperature', color: C.accent }, { label: 'setpoint', color: C.text2, dash: [5, 4], width: 1.5 }, { label: 'what the controller reads', color: C.muted, width: 1 }, { label: 'output', color: C.accent }, { label: 'integral term', color: kit.hue(30), dash: [5, 4], width: 1.6 }]);
        ro.set('out', num(last.out) + ' %'); ro.set('p', num(last.p) + ' %'); ro.set('i', num(last.i) + ' %'); ro.set('d', num(last.d) + ' %');
        const stepSize = stepTo - stepFrom;
        if (stepAt >= 0 && stepSize > 0 && t - stepAt > 4) {
          ro.set('os', num(Math.max(0, (peak - stepTo) / stepSize * 100), 0) + ' %');
          const settled = t - lastOut > 6;
          ro.set('ts', num(lastOut - stepAt, 0) + ' s' + (settled ? '' : ' (still moving)'));
        } else { ro.set('os', 'waiting for a step up'); ro.set('ts', 'waiting for a step up'); }
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });

  /* ================================================================ ca-tuning */
  // plants: K gain (unit per %), t1 and t2 lags (s), L dead time (s), amb rest value, stepSp the closed-loop step, unit of the measurement
  const TUNE = {
    block: { name: 'Heated block (slow)', K: 0.8, t1: 40, t2: 2, L: 6, amb: 20, stepSp: 10, unit: '°C', pv: 'temperature' },
    tank: { name: 'Water tank (very slow, long delay)', K: 0.5, t1: 150, t2: 4, L: 25, amb: 15, stepSp: 8, unit: '°C', pv: 'temperature' },
    motor: { name: 'Motor speed (fast)', K: 30, t1: 0.5, t2: 0.03, L: 0.06, amb: 0, stepSp: 600, unit: 'rpm', pv: 'speed' }
  };
  /* one run of a plant of two lags and a dead time: open loop (a step of the output) or closed loop (PID). -> samples [t, measured, true, output, setpoint] */
  function runPlant(P, o) {
    const n = Math.round(o.tEnd / o.h), nd = Math.max(0, Math.round(P.L / o.h)), q = [], r = rng(21), pid = makePid(), out = [];
    let x1 = 0, x2 = 0;
    for (let k = 0; k < n; k++) {
      const t = k * o.h, yTrue = P.amb + x2, y = yTrue + o.noise * gauss(r), sp = o.mode === 'open' ? P.amb : (t >= o.tStep ? o.sp : P.amb);
      let u;
      if (o.mode === 'open') u = t >= o.tStep ? o.stepU : 0;
      else u = pid.step({ kp: o.kp, ki: o.ki, kd: o.kd, min: 0, max: o.limit ? 100 : 1e9, aw: true }, sp, y, o.h).out;
      q.push(u); const ud = q.length > nd ? q.shift() : 0;
      x1 += o.h / P.t1 * (P.K * ud - x1); x2 += o.h / P.t2 * (x1 - x2);
      out.push([t, y, yTrue, u, sp]);
    }
    return out;
  }
  /* the tangent construction on a noise-free step response: gain, dead time and time constant */
  function identify(out, P, stepU, tStep) {
    const y0 = out[0][2], final = y0 + P.K * stepU;
    let best = 0, bi = 1;
    for (let i = 2; i < out.length - 2; i++) { const s = (out[i + 2][2] - out[i - 2][2]) / (out[i + 2][0] - out[i - 2][0]); if (s > best) { best = s; bi = i; } }
    const tp = out[bi][0], yp = out[bi][2];
    const t0 = tp - (yp - y0) / Math.max(1e-12, best), t1 = tp + (final - yp) / Math.max(1e-12, best);
    return { K: (final - y0) / stepU, L: Math.max(1e-6, t0 - tStep), T: Math.max(1e-6, t1 - t0), y0, final, tStart: t0, tEnd: t1 };
  }
  Hyper.sim('ca-tuning', {
    title: 'Tuning from a step test',
    blurb: `**Step test** mode applies a step to the output of a plant that is at rest and records what happens. The construction is the one you would draw on a printed curve: the tangent at the steepest point meets the starting level after the **dead time L** and the final level after a further **time constant T**; the **gain K** is the rise divided by the step. The three numbers give the Ziegler–Nichols PID gains. **Closed loop** mode then runs those gains on the same plant.

**Try this**
- Read K, L and T from the step test and compare with the tangent. Raise the **noise** and see that the construction is still found from the smooth curve underneath.
- Switch to *closed loop* with a softening of 1: the Ziegler–Nichols gains. Untick **limit the output** to see the overshoot such a rule is known for; with the limit on, the clamp hides part of it.
- Raise **soften** to 2 or 3: Kp falls and the integral time grows, the overshoot goes down and the loop gets slower.
- Change the plant: the same rules work on a fast motor and on a slow tank, because they only use K, L and T.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 380, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'plant', type: 'select', label: 'Plant', options: Object.keys(TUNE).map(k => [TUNE[k].name, k]), value: 'block' },
        { id: 'mode', type: 'select', label: 'What to show', options: [['Step test (open loop)', 'open'], ['Closed loop with the computed gains', 'closed']], value: 'open' },
        { id: 'step', label: 'Size of the step in the output', min: 10, max: 80, step: 1, value: 50, unit: '%' },
        { id: 'noise', label: 'Sensor noise (% of the rise)', min: 0, max: 5, step: 0.1, value: 0.5, unit: '%' },
        { id: 'soft', label: 'Soften the gains (divide Kp, multiply Ti)', min: 1, max: 4, step: 0.1, value: 1, unit: '×' },
        { id: 'limit', type: 'check', label: 'Limit the output to 0 – 100 %', value: true }
      ], () => { update(); });
      const ro = kit.readout(box.side, [['K', 'Process gain K'], ['L', 'Dead time L'], ['T', 'Time constant T'], ['kp', 'Kp (% per unit)'], ['ti', 'Ti · Td'], ['ov', 'Overshoot of the step'], ['ts', 'Settling time (±2 %)']]);
      let data = null;
      function update() {
        const v = ctl.values, P = TUNE[v.plant], isOpen = v.mode === 'open';
        ctl.show('step', isOpen); ctl.show('soft', !isOpen); ctl.show('limit', !isOpen);
        ro.show('ov', !isOpen); ro.show('ts', !isOpen);
        // the noise-free test, for the identification
        const tEndT = (P.t1 + P.t2 + P.L) * 6, h = (P.t1 + P.t2 + P.L) / 500, tStep = tEndT * 0.06;
        const clean = runPlant(P, { mode: 'open', stepU: v.step, tStep, tEnd: tEndT, h, noise: 0 });
        const id = identify(clean, P, v.step, tStep);
        const Kz = 1.2 * id.T / (id.K * id.L), Tiz = 2 * id.L, Tdz = 0.5 * id.L;
        const kp = Kz / v.soft, Ti = Tiz * v.soft, Td = Tdz;
        const noise = v.noise / 100 * P.K * v.step;
        let out, spSize = P.stepSp, info = {};
        if (isOpen) out = runPlant(P, { mode: 'open', stepU: v.step, tStep, tEnd: tEndT, h, noise });
        else {
          const tEnd = (id.L + id.T) * 7, hh = (id.L + id.T) / 500;
          out = runPlant(P, { mode: 'closed', sp: P.amb + spSize, tStep: tEnd * 0.06, tEnd, h: hh, noise: v.noise / 100 * spSize, kp, ki: kp / Ti, kd: kp * Td, limit: v.limit });
          const target = P.amb + spSize, ts0 = tEnd * 0.06;
          let pk = -1e9, ts = 0;
          for (const p of out) if (p[0] >= ts0) { pk = Math.max(pk, p[2]); if (Math.abs(p[2] - target) > 0.02 * spSize) ts = p[0] - ts0; }
          info = { ov: Math.max(0, (pk - target) / spSize * 100), ts, tStep: ts0 };
        }
        data = { P, id, out, isOpen, tStep: isOpen ? tStep : info.tStep, kp, Ti, Td, info, spSize, v };
        ro.set('K', fmt(id.K, 3) + ' ' + P.unit + ' per %');
        ro.set('L', fmt(id.L, 3) + ' s'); ro.set('T', fmt(id.T, 3) + ' s');
        ro.set('kp', fmt(kp, 3) + ' % per ' + P.unit);
        ro.set('ti', fmt(Ti, 3) + ' s · ' + fmt(Td, 3) + ' s');
        if (!isOpen) { ro.set('ov', fmt(info.ov, 2) + ' %'); ro.set('ts', fmt(info.ts, 3) + ' s'); }
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!data) return;
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 40 : 50, cw = W - M - 12, d = data, P = d.P;
        const t1 = d.out[d.out.length - 1][0];
        const ex = legendExtra(['true response', 'what the sensor reports', 'tangent at the steepest point', 'output step'], M, W - 10), y1 = 12, h1 = Math.round((st.H - 12 - 76 - ex) * 0.62), y2 = y1 + h1 + 26, h2 = st.H - y2 - 56 - ex;
        let lo = 1e9, hi = -1e9;
        for (const p of d.out) { lo = Math.min(lo, p[1], p[4]); hi = Math.max(hi, p[1], p[4]); }
        const pad = (hi - lo) * 0.08 + 1e-9; lo -= pad; hi += pad;
        const xs = niceStep(t1, 6);
        const ser = [];
        if (!d.isOpen) ser.push({ pts: d.out.map(p => [p[0], p[4]]), color: C.text2, width: 1.5, dash: [5, 4], step: true });
        ser.push({ pts: d.out.map(p => [p[0], p[1]]), color: C.muted, width: 1 }, { pts: d.out.map(p => [p[0], p[2]]), color: C.accent, width: 2.3 });
        const ch = chart(kit, c, C, M, y1, cw, h1, { t0: 0, t1, min: lo, max: hi, xstep: xs, xfmt: v => tick(v), title: P.pv + ' (' + P.unit + ') · ' + (d.isOpen ? 'open-loop step test' : 'closed loop, Ziegler–Nichols gains'), series: ser });
        chart(kit, c, C, M, y2, cw, h2, { t0: 0, t1, min: -10, max: d.isOpen ? Math.max(100, d.v.step * 1.4) : 130, step: 50, xstep: xs, xfmt: v => tick(v), title: 'output (%) · time in seconds', series: [{ pts: d.out.map(p => [p[0], p[3]]), color: kit.hue(30), width: 2, step: true }] });
        if (d.isOpen) {
          const id = d.id, tA = d.tStep + id.L, tB = tA + id.T;
          c.save(); c.beginPath(); c.rect(M, y1, cw, h1); c.clip();
          dashed(c, ch.X(d.tStep), ch.Y(id.y0), ch.X(t1), ch.Y(id.y0), C.faint, 1.2);
          dashed(c, ch.X(d.tStep), ch.Y(id.final), ch.X(t1), ch.Y(id.final), C.faint, 1.2);
          c.strokeStyle = C.warn; c.lineWidth = 1.8; c.beginPath(); c.moveTo(ch.X(tA), ch.Y(id.y0)); c.lineTo(ch.X(tB), ch.Y(id.final)); c.stroke();
          dashed(c, ch.X(tA), ch.Y(lo), ch.X(tA), ch.Y(id.y0), C.warn, 1.2);
          dashed(c, ch.X(tB), ch.Y(lo), ch.X(tB), ch.Y(id.final), C.warn, 1.2);
          c.restore();
          kit.label(c, 'L', (ch.X(d.tStep) + ch.X(tA)) / 2, ch.Y(id.y0) - 10, { size: 11, color: C.warn, align: 'center', weight: 700 });
          kit.label(c, 'T', (ch.X(tA) + ch.X(tB)) / 2, ch.Y(id.final) + 12, { size: 11, color: C.warn, align: 'center', weight: 700 });
          legend(kit, c, C, M, st.H - 18 - ex, W - 10, [{ label: 'true response', color: C.accent }, { label: 'what the sensor reports', color: C.muted, width: 1 }, { label: 'tangent at the steepest point', color: C.warn, width: 1.8 }, { label: 'output step', color: kit.hue(30) }]);
        } else legend(kit, c, C, M, st.H - 18 - ex, W - 10, [{ label: 'measurement', color: C.accent }, { label: 'what the sensor reports', color: C.muted, width: 1 }, { label: 'setpoint', color: C.text2, dash: [5, 4], width: 1.5 }, { label: 'output', color: kit.hue(30) }]);
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ ca-jitter */
  Hyper.sim('ca-jitter', {
    title: 'The same loop on a steady and an uneven rhythm',
    blurb: `A speed loop (a first-order process with a time constant of 0.5 s, PI with a little D) is asked for a step. The controller samples every **Ts**; with **jitter** a pass is sometimes late by up to that many times Ts (it printed a line, waited for the network). The bottom chart shows the real interval between passes.

**Try this**
- With no jitter, raise **Ts** from 20 ms to 200 ms and then 500 ms: the loop gets slower, then overshoots and finally oscillates, with exactly the same gains.
- Set a **jitter** of 200 % and let the controller use the **assumed** dt: the integral builds too slowly and the response drags. Switch to the **measured** dt: it recovers.
- Add noise and **Kd**, with jitter and the assumed dt: the output spikes, because a change over a long interval is divided by a short one.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 400, maxH: 660 });
      const ctl = kit.controls(box.side, [
        { id: 'ts', label: 'Sample time Ts', min: 5, max: 500, value: 20, log: true, sig: 2, unit: 'ms' },
        { id: 'jit', label: 'Jitter (late by up to … × Ts)', min: 0, max: 3, step: 0.05, value: 0, unit: '× Ts' },
        { id: 'dtm', type: 'select', label: 'The controller uses', options: [['the measured dt', 'real'], ['the assumed dt (= Ts)', 'assumed']], value: 'real' },
        { id: 'kd', label: 'Kd', min: 0, max: 0.15, step: 0.005, value: 0.03 },
        { id: 'noise', label: 'Sensor noise', min: 0, max: 3, step: 0.1, value: 0.5, unit: '%' }
      ], () => update());
      const ro = kit.readout(box.side, [['n', 'Passes in 6 s'], ['iv', 'Interval: shortest · longest'], ['os', 'Overshoot'], ['err', 'Mean error after the step'], ['rough', 'Output roughness (std)']]);
      const TAU = 0.5, DEAD = 0.03, KP = 1.2, KI = 3, T_END = 6, TS_STEP = 0.5, SETPOINT = 50;
      let data = null;
      function update() {
        const v = ctl.values, Ts = v.ts / 1000, h = 0.001, r = rng(7), nd = Math.round(DEAD / h), q = [];
        let y = 0, u = 0, integ = 0, prevY = 0, nextT = 0, lastT = 0, havePrev = false;
        const ys = [], us = [], ticks = [];
        for (let k = 0; k < T_END / h; k++) {
          const t = k * h;
          if (t >= nextT) {
            const real = havePrev ? t - lastT : Ts; lastT = t; havePrev = true; ticks.push([t, real]);
            const dt = v.dtm === 'real' ? real : Ts, sp = t < TS_STEP ? 0 : SETPOINT, pv = y + v.noise * (r() - 0.5) * 2;
            const err = sp - pv, d = -v.kd * (pv - prevY) / dt; prevY = pv;
            const c = KP * err + integ + d;
            if (c > 100) u = 100; else if (c < 0) u = 0; else { u = c; integ += KI * err * dt; }
            nextT = t + Ts + v.jit * Ts * r();
          }
          q.push(u); const ud = q.length > nd ? q.shift() : 0;
          y += h / TAU * (ud - y);
          if (k % 5 === 0) { ys.push([t, y]); us.push([t, u]); }
        }
        let pk = 0, ea = 0, en = 0;
        for (const p of ys) if (p[0] >= TS_STEP) { pk = Math.max(pk, p[1]); if (p[0] >= TS_STEP + 1) { ea += Math.abs(SETPOINT - p[1]); en++; } }
        const tail = us.filter(p => p[0] > 3).map(p => p[1]), mean = tail.reduce((s, x) => s + x, 0) / Math.max(1, tail.length);
        const rough = Math.sqrt(tail.reduce((s, x) => s + (x - mean) * (x - mean), 0) / Math.max(1, tail.length));
        const ivs = ticks.slice(1).map(p => p[1]);
        data = { ys, us, ticks, ivs };
        ro.set('n', String(ticks.length));
        ro.set('iv', ivs.length ? fmt(Math.min(...ivs) * 1000, 3) + ' · ' + fmt(Math.max(...ivs) * 1000, 3) + ' ms' : '—');
        ro.set('os', fmt(Math.max(0, (pk - SETPOINT) / SETPOINT * 100), 2) + ' %');
        ro.set('err', fmt(en ? ea / en / SETPOINT * 100 : 0, 2) + ' % of the step');
        ro.set('rough', fmt(rough, 2) + ' %');
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!data) return;
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        const ex = legendExtra(['speed', 'setpoint', 'output'], M, W - 10), y1 = 12, h1 = Math.round((st.H - 12 - 100 - ex) * 0.42), y2 = y1 + h1 + 24, h2 = Math.round((st.H - 12 - 100 - ex) * 0.3), y3 = y2 + h2 + 24, h3 = st.H - y3 - 52 - ex;
        chart(kit, c, C, M, y1, cw, h1, { t0: 0, t1: T_END, min: -10, max: 110, step: 50, xstep: 1, xfmt: v => tick(v), title: 'speed (% of full scale)',
          series: [{ pts: [[0, 0], [TS_STEP, 0], [TS_STEP, SETPOINT], [T_END, SETPOINT]], color: C.text2, width: 1.5, dash: [5, 4] }, { pts: data.ys, color: C.accent, width: 2.3 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0: 0, t1: T_END, min: -10, max: 110, step: 50, xstep: 1, xfmt: v => tick(v), title: 'controller output (%)', series: [{ pts: data.us, color: kit.hue(30), width: 1.8 }] });
        // the sample instants as stems whose height is the real interval
        const ivMax = Math.max(0.001, ...data.ivs) * 1.15, t3 = (t, k) => M + cw * t / T_END;
        c.fillStyle = shade(C); c.fillRect(M, y3, cw, h3);
        c.strokeStyle = C.accent; c.lineWidth = 1;
        const every = Math.max(1, Math.floor(data.ticks.length / 400));
        c.beginPath();
        data.ticks.forEach((p, i) => { if (i % every || i === 0) return; const x = Math.round(t3(p[0])) + 0.5; c.moveTo(x, y3 + h3); c.lineTo(x, y3 + h3 - h3 * clamp(p[1] / ivMax, 0, 1)); });
        c.stroke();
        c.strokeStyle = C.axis; c.strokeRect(M + 0.5, y3 + 0.5, cw, h3);
        kit.label(c, 'interval between passes, 0 – ' + fmt(ivMax * 1000, 3) + ' ms (each stem is one pass)', M + 7, y3 + 10, { size: 10.5, color: C.muted });
        legend(kit, c, C, M, st.H - 16 - ex, W - 10, [{ label: 'speed', color: C.accent }, { label: 'setpoint', color: C.text2, dash: [5, 4], width: 1.5 }, { label: 'output', color: kit.hue(30) }]);
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ ca-filter */
  Hyper.sim('ca-filter', {
    title: 'Filters on a noisy signal',
    blurb: `A true signal (dashed) plus noise and the odd spike (grey) goes through a filter (blue) sampled every 10 ms. The read-outs compare the error with the true signal, and how long the filter takes to follow a real step.

**Try this**
- Choose the **exponential** filter and lower α: the noise falls, and the **lag** grows. That trade is the whole subject.
- Add **spikes** and compare the **moving average** (it smears each spike over N samples) with the **median** (it removes it).
- Switch to the **step** signal and compare the edge after a median (sharp) and an average (rounded).
- Tick **show the derivative**: the raw signal's rate of change is mostly noise; the filtered one is usable.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.88, minH: 380, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'sig', type: 'select', label: 'True signal', options: [['A slow ramp', 'ramp'], ['A step', 'step'], ['A slow wave', 'wave']], value: 'step' },
        { id: 'noise', label: 'Noise', min: 0, max: 0.3, step: 0.01, value: 0.08 },
        { id: 'spikes', label: 'Spikes (share of the samples)', min: 0, max: 10, step: 0.5, value: 2, unit: '%' },
        { id: 'kind', type: 'select', label: 'Filter', options: [['None', 'none'], ['Moving average', 'avg'], ['Exponential (EMA)', 'ema'], ['Median', 'med'], ['Median, then exponential', 'both']], value: 'ema' },
        { id: 'n', label: 'Average of N samples', min: 1, max: 40, step: 1, value: 10 },
        { id: 'alpha', label: 'EMA factor α', min: 0.01, max: 1, value: 0.1, log: true, sig: 2 },
        { id: 'm', label: 'Median of … samples', min: 1, max: 15, step: 2, value: 5 },
        { id: 'deriv', type: 'check', label: 'Show the derivative (rate of change)', value: false },
        { type: 'buttons', items: [{ id: 'new', label: 'New noise', primary: true }] }
      ], id => { if (id === 'new') seed++; update(); });
      const ro = kit.readout(box.side, [['rms0', 'Noise before the filter (rms)'], ['rms1', 'Error after the filter (rms)'], ['lag', 'Lag: time to follow 63 % of a step'], ['der', 'Derivative noise (rms per second)']]);
      const N = 400, DT = 0.01;
      let seed = 3, data = null;
      const truth = (kind, i) => kind === 'ramp' ? 0.15 + 0.7 * i / (N - 1) : kind === 'step' ? (i < 120 ? 0.2 : 0.8) : 0.5 + 0.3 * Math.sin(2 * Math.PI * i / 200);
      const makeFilter = v => {
        const alpha = v.alpha, mk = {
          none: () => x => x, avg: () => E.movingAverage(Math.round(v.n)), ema: () => E.ema(alpha), med: () => E.median(Math.round(v.m)),
          both: () => { const a = E.median(Math.round(v.m)), b = E.ema(alpha); return x => b(a(x)); }
        };
        return mk[v.kind]();
      };
      function update() {
        const v = ctl.values, r = rng(seed * 17 + 1);
        ctl.show('n', v.kind === 'avg'); ctl.show('alpha', v.kind === 'ema' || v.kind === 'both'); ctl.show('m', v.kind === 'med' || v.kind === 'both');
        const f = makeFilter(v), raw = [], filt = [], tr = [];
        for (let i = 0; i < N; i++) {
          const t = truth(v.sig, i);
          let x = t + v.noise * gauss(r);
          if (r() < v.spikes / 100) x += (r() < 0.5 ? -1 : 1) * (0.5 + 0.5 * r());
          tr.push(t); raw.push(x); filt.push(f(x));
        }
        // the lag: a clean step through a fresh filter, the time to reach 63 %
        const g = makeFilter(v); let lag = null;
        for (let i = 0; i < 200; i++) { const y = g(i < 20 ? 0 : 1); if (lag == null && i >= 20 && y >= 0.632) lag = (i - 20) * DT; }
        const rms = (a, b) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) * (x - b[i]), 0) / a.length);
        const d = a => a.map((x, i) => i ? (x - a[i - 1]) / DT : 0);
        const drms = a => Math.sqrt(d(a).slice(1).reduce((s, x) => s + x * x, 0) / (a.length - 1));
        data = { raw, filt, tr, v };
        ro.set('rms0', fmt(rms(raw, tr), 3));
        ro.set('rms1', fmt(rms(filt, tr), 3));
        ro.set('lag', lag == null ? 'longer than 2 s' : fmt(lag * 1000, 3) + ' ms');
        ro.set('der', fmt(drms(raw), 3) + ' raw · ' + fmt(drms(filt), 3) + ' filtered');
        ro.show('der', v.deriv);
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!data) return;
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10, v = data.v, tEnd = N * DT;
        const ex = legendExtra(['what the sensor gives', 'the true signal', 'filtered'], M, W - 10), two = v.deriv, y1 = 12, h1 = two ? Math.round((st.H - 12 - 90 - ex) * 0.55) : st.H - 12 - 62 - ex;
        const pts = a => a.map((x, i) => [i * DT, x]);
        chart(kit, c, C, M, y1, cw, h1, { t0: 0, t1: tEnd, min: -0.5, max: 1.5, step: 0.5, xstep: 0.5, xfmt: x => tick(x), title: 'signal · time in seconds',
          series: [{ pts: pts(data.raw), color: C.muted, width: 1 }, { pts: pts(data.tr), color: C.text2, width: 1.5, dash: [5, 4] }, { pts: pts(data.filt), color: C.accent, width: 2.4 }] });
        if (two) {
          const y2 = y1 + h1 + 24, h2 = st.H - y2 - 44 - ex, d = a => a.map((x, i) => [i * DT, i ? (x - a[i - 1]) / DT : 0]);
          chart(kit, c, C, M, y2, cw, h2, { t0: 0, t1: tEnd, min: -60, max: 60, step: 30, xstep: 0.5, xfmt: x => tick(x), title: 'rate of change (units per second)',
            series: [{ pts: d(data.raw), color: C.muted, width: 1 }, { pts: d(data.filt), color: C.accent, width: 2 }] });
        }
        legend(kit, c, C, M, st.H - 16 - ex, W - 10, [{ label: 'what the sensor gives', color: C.muted, width: 1 }, { label: 'the true signal', color: C.text2, dash: [5, 4], width: 1.5 }, { label: 'filtered', color: C.accent }]);
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ ca-tpc */
  Hyper.sim('ca-tpc', {
    title: 'Time-proportioning: window, ripple and relay life',
    blurb: `A heater with a thermal time constant is switched fully on for **duty × window** and off for the rest of every window. The top chart is the temperature rise in the steady state; the bottom one is the switch. The vertical scale of the top chart is stretched around the average so that the ripple is visible.

**Try this**
- Lengthen the **window** towards the time constant: the ripple grows. Shorten it: the ripple shrinks and the **switch-ons per day** go up.
- Choose the **mechanical relay** and read its life at 100 000 operations: a 10 s window wears it out in days.
- Set the duty to 50 %: the ripple is largest. At 0 and 100 % it vanishes.
- Choose the **solid-state relay** on 50 Hz mains: the duty comes in steps of whole cycles, and there is no contact wear.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 340, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'duty', label: 'Duty (power wanted)', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'win', label: 'Window', min: 0.5, max: 120, value: 10, log: true, sig: 2, unit: 's' },
        { id: 'tau', label: 'Thermal time constant of the load', min: 5, max: 300, value: 60, log: true, sig: 2, unit: 's' },
        { id: 'K', label: 'Rise at full power', min: 10, max: 100, step: 1, value: 60, unit: 'K' },
        { id: 'sw', type: 'select', label: 'The switch', options: [['Mechanical relay', 'relay'], ['Zero-cross solid-state relay, 50 Hz mains', 'ssr'], ['MOSFET (low voltage)', 'fet']], value: 'relay' },
        { id: 'rate', label: 'Relay rating (operations at your load)', min: 10000, max: 1000000, value: 100000, log: true, sig: 2, fmt: v => fmt(v, 2) }
      ], () => update());
      const ro = kit.readout(box.side, [['rip', 'Ripple (peak to peak)'], ['form', 'Ripple by the formula'], ['avg', 'Average rise'], ['ops', 'Switch-ons per day'], ['life', 'Relay life'], ['res', 'Smallest duty step']]);
      let data = null;
      function update() {
        const v = ctl.values, W = v.win, d = v.duty / 100, tau = v.tau, K = v.K;
        let ton = d * W;
        if (v.sw === 'ssr') ton = Math.round(ton / 0.02) * 0.02;          // whole mains cycles of 20 ms
        ton = clamp(ton, 0, W);
        const toff = W - ton, a = Math.exp(-ton / tau), b = Math.exp(-toff / tau);
        const lo = ton >= W ? K : ton <= 0 ? 0 : K * b * (1 - a) / (1 - a * b), hi = ton >= W ? K : ton <= 0 ? 0 : K * (1 - a) + a * lo;
        const dEff = ton / W, avg = K * dEff;
        const pts = [], edges = [[0, 0]]; let x = lo;
        for (let k = 0; k < 6; k++) {
          const t0 = k * W;
          if (ton > 0) { edges.push([t0, 0], [t0, 1], [t0 + ton, 1], [t0 + ton, 0]); for (let j = 0; j <= 24; j++) { const s = ton * j / 24; pts.push([t0 + s, K + (x - K) * Math.exp(-s / tau)]); } x = K + (x - K) * a; }
          else pts.push([t0, x]);
          if (toff > 0) { for (let j = 0; j <= 24; j++) { const s = toff * j / 24; pts.push([t0 + ton + s, x * Math.exp(-s / tau)]); } x = x * b; }
        }
        data = { pts, edges, lo, hi, avg, W, v, ton };
        const form = W < tau ? K * d * (1 - d) * W / tau : null;
        ro.set('rip', fmt(hi - lo, 3) + ' K');
        ro.set('form', form == null ? 'only valid for a window below the time constant' : fmt(form, 3) + ' K');
        ro.set('avg', fmt(avg, 3) + ' K  (' + Math.round(dEff * 100) + ' % duty)');
        const switching = v.duty > 0 && v.duty < 100;
        const ops = switching ? 86400 / W : 0;
        ro.set('ops', ops ? fmt(ops, 4) : 'none: the load stays at one level');
        ro.set('life', v.sw !== 'relay' ? 'no contact wear' : ops ? fmt(v.rate * W / 86400, 3) + ' days' : 'no wear');
        ro.set('res', v.sw === 'ssr' ? fmt(Math.min(100, 0.02 / W * 100), 2) + ' % (one mains cycle)' : 'fine');
        ctl.show('rate', v.sw === 'relay');
        loop.once();
      }
      const loop = kit.loop(() => {
        if (!data) return;
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 40 : 50, cw = W - M - 10, d = data, t1 = d.W * 6;
        const ex = legendExtra(['temperature rise', 'average', 'switch'], M, W - 10), y1 = 12, h1 = Math.round((st.H - 12 - 76 - ex) * 0.7), y2 = y1 + h1 + 24, h2 = st.H - y2 - 36 - ex;
        const half = Math.max((d.hi - d.lo) * 1.6, 0.5), mid = (d.hi + d.lo) / 2;
        const xs = d.W;
        chart(kit, c, C, M, y1, cw, h1, { t0: 0, t1, min: mid - half, max: mid + half, xstep: xs, xfmt: v => tick(v), title: 'temperature rise (K), steady state · time in seconds',
          hlines: [{ v: d.avg, color: C.text2 }], series: [{ pts: d.pts, color: C.accent, width: 2.3 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0: 0, t1, min: -0.15, max: 1.15, step: 1, title: 'switch (on = 1)', series: [{ pts: d.edges.concat([[t1, 0]]), color: kit.hue(30), width: 1.8, fill: kit.hue(30, 0.25) }] });
        legend(kit, c, C, M, st.H - 16 - ex, W - 10, [{ label: 'temperature rise', color: C.accent }, { label: 'average', color: C.text2, dash: [5, 4], width: 1.4 }, { label: 'switch', color: kit.hue(30) }]);
      }, box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });


  /* ================================================================ ca-robot */
  const TRACK_N = 600;
  function trackPoints(kind) {
    const pts = [];
    for (let i = 0; i < TRACK_N; i++) {
      const a = i / TRACK_N * 2 * Math.PI;
      let x, y;
      if (kind === 'oval') { x = 480 * Math.cos(a); y = 270 * Math.sin(a); }
      else if (kind === 'square') { const c = Math.cos(a), s = Math.sin(a), r = 1 / Math.pow(Math.pow(Math.abs(c), 4) + Math.pow(Math.abs(s), 4), 0.25); x = 460 * r * c; y = 280 * r * s; }
      else { const r = 300 * (1 + 0.27 * Math.cos(3 * a)); x = r * Math.cos(a) * 1.3; y = r * Math.sin(a); }
      pts.push([x, y]);
    }
    let ex = 0, ey = 0;
    for (const p of pts) { ex = Math.max(ex, Math.abs(p[0])); ey = Math.max(ey, Math.abs(p[1])); }
    return { pts, ex: ex + 40, ey: ey + 40 };
  }
  Hyper.sim('ca-robot', {
    title: 'A line-following robot',
    blurb: `A differential-drive robot (wheel base 90 mm) with five sensors 50 mm ahead of the axle. Every 5 ms their weighted average gives the **error** (−2 to +2; ±3 means the line is lost) and a PD law turns it into a speed difference between the wheels. The strip underneath is the error over the last few seconds.

**Try this**
- Set **Kd to 0** with a moderate Kp: the robot zig-zags across the line. Raise Kd and it runs smoothly.
- Raise the **base speed** to 1 m/s: the robot flies off at the corners, and no gain fixes all of it. Speed is limited by the loop and the sensors.
- Make **Kp** very small: the robot cannot follow the curves, and loses the line.
- Choose the *flower* track for sharper curves, or the *square* for corners.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 380, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'kp', label: 'Kp (m/s per unit of error)', min: 0, max: 3, step: 0.05, value: 0.6 },
        { id: 'kd', label: 'Kd (m/s per unit per second)', min: 0, max: 0.1, step: 0.002, value: 0.01 },
        { id: 'base', label: 'Base speed', min: 0.2, max: 1.5, step: 0.05, value: 0.5, unit: 'm/s' },
        { id: 'track', type: 'select', label: 'Track', options: [['Oval', 'oval'], ['Rounded square', 'square'], ['Flower (sharp curves)', 'flower']], value: 'oval' },
        { id: 'speed', type: 'select', label: 'Playback speed', options: [['normal', 1], ['3 times faster', 3]], value: 1 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Back to the start', primary: true }] }
      ], id => { if (id === 'track') { trk = trackPoints(ctl.values.track); restart(true); } if (id === 'reset') restart(false); });
      const ro = kit.readout(box.side, [['lap', 'Last lap'], ['best', 'Best lap'], ['lost', 'Times the line was lost'], ['dist', 'Mean distance from the line'], ['wob', 'Error sign changes per second'], ['vel', 'Speed · turning rate']]);
      const B = 90, DIST = 50, LAT = [28, 14, 0, -14, -28], HALF = 9, TM = 0.08, DT = 0.005;
      let trk = trackPoints('oval'), x, y, th, vl, vr, lastErr, lostT, buf, t, tAcc, errs, trail, losses, lapStart, cum, lastA, lapTime, bestLap, dSum, dN, seen, vNow, wNow, flash;
      function restart(full) {
        const p = trk.pts; x = p[0][0]; y = p[0][1]; th = Math.atan2(p[1][1] - p[0][1], p[1][0] - p[0][0]);
        vl = vr = 0; lastErr = 0; lostT = 0; buf = []; trail = []; seen = [0, 0, 0, 0, 0]; vNow = 0; wNow = 0; flash = 0;
        cum = 0; lastA = Math.atan2(y, x); lapStart = t || 0;
        if (full || t == null) { t = 0; tAcc = 0; errs = []; losses = 0; lapTime = null; bestLap = null; dSum = 0; dN = 0; lapStart = 0; }
      }
      const nearest = (px, py) => { let m = 1e18; const p = trk.pts; for (let i = 0; i < p.length; i++) { const d = (p[i][0] - px) * (p[i][0] - px) + (p[i][1] - py) * (p[i][1] - py); if (d < m) m = d; } return Math.sqrt(m); };
      function advance() {
        const v = ctl.values, c = Math.cos(th), s = Math.sin(th);
        let n = 0, sum = 0;
        for (let i = 0; i < 5; i++) {
          const on = nearest(x + DIST * c - LAT[i] * s, y + DIST * s + LAT[i] * c) < HALF;
          seen[i] = on ? 1 : 0;
          if (on) { n++; sum += i - 2; }
        }
        let err;
        if (n) { err = sum / n; lostT = 0; } else { err = lastErr > 0 ? 3 : -3; lostT += DT; }
        buf.push(err); const e = buf.length > 3 ? buf.shift() : err;           // 15 ms between the sensors and the motors
        const steer = v.kp * e + v.kd * (e - lastErr) / DT;
        lastErr = e;
        vl += DT / TM * (v.base + steer - vl); vr += DT / TM * (v.base - steer - vr);
        vNow = (vr + vl) / 2; wNow = (vr - vl) / (B / 1000);
        th += wNow * DT; x += vNow * 1000 * Math.cos(th) * DT; y += vNow * 1000 * Math.sin(th) * DT;
        t += DT;
        errs.push([t, e]); while (errs.length > 1 && errs[0][0] < t - 6) errs.shift();
        if (Math.round(t / DT) % 3 === 0) { trail.push([x, y]); if (trail.length > 500) trail.shift(); }
        if (Math.round(t / DT) % 10 === 0) { dSum += nearest(x, y); dN++; }
        const a = Math.atan2(y, x); let da = a - lastA; if (da > Math.PI) da -= 2 * Math.PI; if (da < -Math.PI) da += 2 * Math.PI;
        lastA = a; cum += da;
        if (cum >= 2 * Math.PI) { cum -= 2 * Math.PI; lapTime = t - lapStart; lapStart = t; if (bestLap == null || lapTime < bestLap) bestLap = lapTime; }
        if (lostT > 0.35) { losses++; flash = 1.2; restart(false); }
      }
      const loop = kit.loop(dt => {
        let steps = Math.min(400, Math.round(dt * ctl.values.speed / DT));
        if (dt === 0) steps = 0;
        while (steps-- > 0) advance();
        if (flash > 0) flash -= dt;
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10;
        const ex = legendExtra(['error: positive when the line is to the right', 'path of the robot'], 44, W - 10), hTrack = Math.round((st.H - 100 - ex) * 0.74), pw = W - 2 * M;
        const sc = Math.min(pw / (2 * trk.ex), hTrack / (2 * trk.ey)), ox = W / 2, oy = 8 + hTrack / 2;
        const P = (wx, wy) => [ox + wx * sc, oy - wy * sc];
        c.fillStyle = shade(C); c.fillRect(M, 8, pw, hTrack);
        // the line
        c.strokeStyle = C.dark ? 'rgba(235,235,245,.85)' : 'rgba(20,20,30,.85)'; c.lineWidth = Math.max(3, 2 * HALF * sc); c.lineJoin = 'round'; c.beginPath();
        trk.pts.forEach((p, i) => { const q = P(p[0], p[1]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); });
        c.closePath(); c.stroke();
        // the trail
        if (trail.length > 2) { c.strokeStyle = kit.hue(30, 0.8); c.lineWidth = 1.5; c.beginPath(); trail.forEach((p, i) => { const q = P(p[0], p[1]); if (i) c.lineTo(q[0], q[1]); else c.moveTo(q[0], q[1]); }); c.stroke(); }
        // the robot
        const q = P(x, y);
        c.save(); c.translate(q[0], q[1]); c.rotate(-th);
        const k = sc;
        c.fillStyle = C.dark ? '#555a70' : '#9aa0b8'; c.strokeStyle = C.axis; c.lineWidth = 1;
        c.fillRect(-45 * k, -(B / 2 + 6) * k, 90 * k, (B + 12) * k); c.strokeRect(-45 * k, -(B / 2 + 6) * k, 90 * k, (B + 12) * k);
        c.fillStyle = C.text; c.fillRect(-12 * k, -(B / 2 + 9) * k, 24 * k, 9 * k); c.fillRect(-12 * k, (B / 2) * k, 24 * k, 9 * k);
        for (let i = 0; i < 5; i++) { c.fillStyle = seen[i] ? C.ok : C.faint; c.beginPath(); c.arc(DIST * k, -LAT[i] * k, Math.max(2.2, 4 * k), 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 0); c.lineTo(34 * k, 0); c.stroke();
        c.restore();
        if (flash > 0) kit.label(c, 'lost the line: back to the start', W / 2, 24, { size: 12.5, color: C.bad, align: 'center', weight: 700, bg: C.dark ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.8)' });
        // the error strip
        const y2 = 8 + hTrack + 22, h2 = st.H - y2 - 36 - ex, mx = M + 34, cw = W - mx - M;
        chart(kit, c, C, mx, y2, cw, h2, { t0: Math.max(t, 6) - 6, t1: Math.max(t, 6), min: -3.4, max: 3.4, step: 1, title: 'error (sensor units) · the last 6 s', hlines: [{ v: 0, color: C.faint }], series: [{ pts: errs, color: C.accent, width: 1.8 }] });
        legend(kit, c, C, mx, st.H - 16 - ex, W - M, [{ label: 'error: positive when the line is to the right', color: C.accent, width: 1.8 }, { label: 'path of the robot', color: kit.hue(30, 0.8), width: 1.5 }]);
        // numbers
        let sc2 = 0; for (let i = 1; i < errs.length; i++) if (errs[i][1] * errs[i - 1][1] < 0) sc2++;
        const span = errs.length ? Math.max(0.5, errs[errs.length - 1][0] - errs[0][0]) : 1;
        ro.set('lap', lapTime == null ? 'not yet' : fmt(lapTime, 3) + ' s');
        ro.set('best', bestLap == null ? 'not yet' : fmt(bestLap, 3) + ' s');
        ro.set('lost', String(losses));
        ro.set('dist', dN ? fmt(dSum / dN, 2) + ' mm' : '…');
        ro.set('wob', fmt(sc2 / span, 2) + ' per second');
        ro.set('vel', fmt(vNow, 2) + ' m/s · ' + fmt(wNow, 2) + ' rad/s');
      }, box.stage);
      st.onResize(() => loop.once());
      restart(true);
      loop.start();
    }
  });

  /* ================================================================ ca-balance */
  Hyper.sim('ca-balance', {
    title: 'A balancing robot',
    blurb: `A robot on two wheels, modelled as an inverted pendulum (centre of mass 6 cm above the axle, so the tilt doubles in about 55 ms). A gyroscope and an accelerometer feed a filter; the wheel acceleration is **Kp × tilt + Kd × gyro rate**. The solid blue line is the real tilt, the dashed one what the robot *thinks* its tilt is.

**Try this**
- Set **Kd to 0**: it falls at once. Lower Kp to 0.3: not enough push. Raise Kp past 1.4: it shakes itself over.
- Lower the **loop rate** from 200 Hz towards 20 Hz: the robot gets wobblier and then falls, with the same gains.
- Choose **gyro only**: the estimate drifts away (the zero offset), and the robot ends up leaning. Choose **accelerometer only**: the estimate is noisy and the wheels twitch.
- Press **Push** to see how it recovers. Untick the **speed loop** and the robot slowly runs away.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.96, minH: 420, maxH: 680 });
      const rnd = rng(3);
      const ctl = kit.controls(box.side, [
        { id: 'kp', label: 'Kp (m/s² per degree)', min: 0.1, max: 1.6, step: 0.01, value: 0.8 },
        { id: 'kd', label: 'Kd (m/s² per degree/s)', min: 0, max: 0.12, step: 0.002, value: 0.04 },
        { id: 'rate', label: 'Loop rate', min: 10, max: 500, value: 200, log: true, sig: 2, unit: 'Hz' },
        { id: 'filter', type: 'select', label: 'Tilt estimate', options: [['Complementary filter', 'comp'], ['Gyro only (integrated)', 'gyro'], ['Accelerometer only', 'acc']], value: 'comp' },
        { id: 'tau', label: 'Filter time constant', min: 0.05, max: 2, value: 0.4, log: true, sig: 2, unit: 's' },
        { id: 'bias', label: 'Gyro zero offset (not corrected)', min: 0, max: 4, step: 0.1, value: 2, unit: '°/s' },
        { id: 'hold', type: 'check', label: 'Speed loop: keep the robot from running away', value: true },
        { id: 'slow', type: 'check', label: 'Slow motion (a quarter speed)', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Push it', primary: true }, { id: 'reset', label: 'Stand it up again' }] }
      ], id => { if (id === 'push' && !fell) w += 0.5 * (rnd() < 0.5 ? -1 : 1); if (id === 'reset') restart(); });
      const ro = kit.readout(box.side, [['tilt', 'Tilt (real)'], ['est', 'Tilt (estimated)'], ['cmd', 'Wheel acceleration asked'], ['vel', 'Wheel speed'], ['state', 'State'], ['dbl', 'The tilt doubles in']]);
      const G = 9.81, L = 0.06, TM = 0.04, AMAX = 10, VMAX = 2.5, KAP = 0.3, H = 0.001, WIN = 8, KV = 3;
      let th, w, a, est, x, v, t, tNext, cmd, fell, hist, rec;
      function restart() { th = 0.03; w = 0; a = 0; est = 0; x = 0; v = 0; t = 0; tNext = 0; cmd = 0; fell = null; hist = []; rec = 0; }
      function advance() {
        const q = ctl.values, Ts = 1 / q.rate;
        if (t >= tNext) {
          tNext += Ts;
          const gm = w + q.bias * Math.PI / 180 + 0.01 * gauss(rnd), am = th - KAP * a / G + 0.05 * gauss(rnd);
          if (q.filter === 'gyro') est += gm * Ts; else if (q.filter === 'acc') est = am; else { const al = q.tau / (q.tau + Ts); est = al * (est + gm * Ts) + (1 - al) * am; }
          const target = q.hold ? -KV * v * Math.PI / 180 : 0;
          cmd = q.kp * 57.2958 * (est - target) + q.kd * 57.2958 * gm;
          if (Math.abs(est) > 0.7) cmd = 0;
          cmd = clamp(cmd, -AMAX, AMAX);
        }
        a += H / TM * (cmd - a);
        let ae = a; if (Math.abs(v) > VMAX && Math.sign(a) === Math.sign(v)) ae = 0;
        w += (G * Math.sin(th) - ae * Math.cos(th)) / L * H; th += w * H; v += ae * H; x += v * H;
        t += H;
        if (Math.abs(th) > 0.8 && fell == null) fell = t;
        if (t >= rec) { rec += 0.01; hist.push([t, th * 57.2958, est * 57.2958, cmd, v]); }
        while (hist.length > 2 && hist[0][0] < t - WIN - 1) hist.shift();
      }
      const loop = kit.loop(dt => {
        if (fell == null) { let n = Math.round(dt * (ctl.values.slow ? 0.25 : 1) / H); while (n-- > 0 && fell == null) advance(); }
        const c = st.begin(), C = kit.colors(), W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        // the robot, side view
        const ex = legendExtra(['real tilt', 'estimated tilt', 'acceleration'], M, W - 10);
        const dh = Math.round((st.H - 90 - ex) * 0.38), gy = 8 + dh - 14, scl = (dh - 30) / 0.2, wr = 0.035;
        c.fillStyle = shade(C); c.fillRect(M, 8, cw, dh);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(M, gy); c.lineTo(M + cw, gy); c.stroke();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let m = Math.floor((x - 0.6) / 0.05); m < Math.ceil((x + 0.6) / 0.05); m++) { const px = M + cw / 2 + (m * 0.05 - x) * scl; if (px > M && px < M + cw) { c.beginPath(); c.moveTo(px, gy); c.lineTo(px, gy + 7); c.stroke(); } }
        const ax = M + cw / 2, ay = gy - wr * scl;
        c.strokeStyle = C.text2; c.lineWidth = 2.5; c.beginPath(); c.arc(ax, ay, wr * scl, 0, Math.PI * 2); c.stroke();
        const spin = x / wr; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + Math.cos(spin) * wr * scl, ay + Math.sin(spin) * wr * scl); c.stroke();
        c.save(); c.translate(ax, ay); c.rotate(th);
        c.fillStyle = fell != null ? C.bad : C.accent; c.globalAlpha = 0.85; c.fillRect(-0.02 * scl, -0.13 * scl, 0.04 * scl, 0.13 * scl); c.globalAlpha = 1;
        c.fillStyle = C.text; c.beginPath(); c.arc(0, -L * scl, 4, 0, Math.PI * 2); c.fill();
        c.restore();
        c.save(); c.translate(ax, ay); c.rotate(est); dashed(c, 0, 0, 0, -0.17 * scl, C.warn, 1.8); c.restore();
        kit.label(c, 'upright = straight up · dashed: the tilt the robot believes', M + 8, 20, { size: 10.5, color: C.muted });
        if (fell != null) kit.label(c, 'FELL OVER after ' + fmt(fell, 3) + ' s', M + cw / 2, 8 + dh / 2 - 30, { size: 15, color: C.bad, align: 'center', weight: 700 });
        // charts
        const y1 = 8 + dh + 22, h1 = Math.round((st.H - y1 - 70 - ex) * 0.58), y2 = y1 + h1 + 20, h2 = st.H - y2 - 34 - ex;
        const t1 = Math.max(t, WIN), t0 = t1 - WIN;
        chart(kit, c, C, M, y1, cw, h1, { t0, t1, min: -30, max: 30, step: 15, title: 'tilt (degrees) · the last 8 s',
          series: [{ pts: hist.map(p => [p[0], p[2]]), color: C.warn, width: 1.6, dash: [5, 4] }, { pts: hist.map(p => [p[0], p[1]]), color: C.accent, width: 2.2 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0, t1, min: -12, max: 12, step: 6, title: 'wheel acceleration asked (m/s²)', hlines: [{ v: 0, color: C.faint }], series: [{ pts: hist.map(p => [p[0], p[3]]), color: kit.hue(30), width: 1.6, step: true }] });
        legend(kit, c, C, M, st.H - 16 - ex, W - 10, [{ label: 'real tilt', color: C.accent }, { label: 'estimated tilt', color: C.warn, dash: [5, 4], width: 1.6 }, { label: 'acceleration', color: kit.hue(30), width: 1.6 }]);
        const last = hist.length ? hist[hist.length - 1] : [0, 0, 0, 0, 0];
        ro.set('tilt', num(th * 57.2958) + ' °'); ro.set('est', num(est * 57.2958) + ' °'); ro.set('cmd', num(last[3]) + ' m/s²'); ro.set('vel', num(v, 2) + ' m/s');
        ro.set('state', fell != null ? 'fell after ' + fmt(fell, 3) + ' s' : 'balancing for ' + fmt(t, 3) + ' s');
        ro.set('dbl', fmt(Math.LN2 / Math.sqrt(G / L) * 1000, 2) + ' ms (r = ' + fmt(Math.sqrt(G / L), 3) + ' per second)');
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });

  /* ================================================================ ca-fault */
  Hyper.sim('ca-fault', {
    title: 'A heater with faults, and what each safeguard saves',
    blurb: `A small heater held at 50 °C by a thermostat. Break something, and watch the **real** temperature (blue) against what the controller **believes** (grey). Each safeguard is a checkbox: tick them one at a time and break the same thing again.

**Try this**
- With nothing ticked, press **Unplug the sensor**: an open thermistor reads very cold, so the heater stays on and the box heats towards 120 °C. A *shorted* sensor reads hot and fails safe.
- Tick **software checks**: the unplugged sensor is caught at once. Now press **Sensor falls off the heater**: it reads the room air, which looks fine; only the runaway check, after 25 s, notices.
- Tick the **watchdog** and press **Hang the program** (it hangs the next time the heater is on): the chip resets and recovers. Without it the heater stays on.
- Press **Brownout reset**: during the reset the output pin floats. A **pull-down** keeps the heater off. The **thermal fuse** saves you from everything the program misses.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.98, minH: 430, maxH: 700 });
      const rnd = rng(13);
      const ctl = kit.controls(box.side, [
        { id: 'swc', type: 'check', label: 'Software checks: sensor range and run-away', value: false },
        { id: 'wdg', type: 'check', label: 'Watchdog (5 s), fed from the control loop', value: false },
        { id: 'pd', type: 'check', label: 'Pull-down on the heater switch', value: false },
        { id: 'fuse', type: 'check', label: 'Thermal fuse (opens at 90 °C), independent', value: false },
        { type: 'buttons', items: [{ id: 'open', label: 'Unplug the sensor', primary: true }, { id: 'short', label: 'Short the sensor' }] },
        { type: 'buttons', items: [{ id: 'loose', label: 'Sensor falls off the heater' }, { id: 'hang', label: 'Hang the program' }] },
        { type: 'buttons', items: [{ id: 'brown', label: 'Brownout reset' }, { id: 'fix', label: 'Repair everything' }] }
      ], id => {
        if (id === 'open' || id === 'short' || id === 'loose') sensor = id;
        if (id === 'hang') hangArmed = true;
        if (id === 'brown' && state === 'running') { state = 'reset'; resetLeft = 6; note = 'brownout reset'; }
        if (id === 'fix') { sensor = 'ok'; hangArmed = false; if (state !== 'running') { state = 'running'; } fuseBlown = false; fault = null; heating = false; note = 'none'; hiMax = T; }
      });
      const ro = kit.readout(box.side, [['T', 'Real temperature'], ['read', 'What the controller reads'], ['out', 'Heater'], ['act', 'What acted'], ['hi', 'Highest temperature so far'], ['verdict', 'Verdict']]);
      const K = 100, TAU = 40, AMB = 20, SP = 50, H = 0.25, SPEED = 4, WIN = 240, RUNAWAY = 25;
      let t, acc, T, sensor, state, resetLeft, hungFor, frozen, heating, fault, hangArmed, fuseBlown, hist, edges, onSince, onRead, note, hiMax, lastOut;
      function restart() { t = 0; acc = 0; T = AMB; sensor = 'ok'; state = 'running'; resetLeft = 0; hungFor = 0; frozen = false; heating = false; fault = null; hangArmed = false; fuseBlown = false; hist = []; edges = [[0, 0]]; onSince = 0; onRead = 0; note = 'none'; hiMax = AMB; lastOut = false; }
      const readingOf = () => sensor === 'open' ? -40 : sensor === 'short' ? 150 : sensor === 'loose' ? AMB + 0.03 * (T - AMB) : T + 0.15 * gauss(rnd);
      function advance() {
        const q = ctl.values, reading = readingOf();
        let out;
        if (state === 'reset') {
          out = !q.pd;                                                       // a floating gate can leave the heater on
          resetLeft -= H;
          if (resetLeft <= 0) { state = 'running'; heating = false; fault = null; hungFor = 0; }
        } else if (state === 'hung') {
          out = frozen; hungFor += H;
          if (q.wdg && hungFor >= 5) { state = 'reset'; resetLeft = 6; note = 'watchdog reset'; }
        } else {
          if (q.swc && !fault) {
            if (reading < 0 || reading > 100) { fault = 'sensor out of range'; note = 'software check: sensor out of range'; }
            else if (reading > 70) { fault = 'over-temperature'; note = 'software check: over 70 °C'; }
            else if (heating && t - onSince >= RUNAWAY && reading < onRead + 2) { fault = 'run-away'; note = 'software check: run-away'; }
          }
          if (fault) heating = false;
          else {
            if (!heating && reading < SP - 1) { heating = true; onSince = t; onRead = reading; }
            else if (heating && reading > SP + 1) heating = false;
          }
          if (hangArmed && heating) { state = 'hung'; frozen = true; hangArmed = false; hungFor = 0; }
          out = heating;
        }
        if (q.fuse && !fuseBlown && T >= 90) { fuseBlown = true; note = 'thermal fuse blown at 90 °C'; }
        const u = !fuseBlown && out ? 1 : 0;
        T += H / TAU * (K * u - (T - AMB));
        t += H;
        if (out !== lastOut) { edges.push([t, lastOut ? 1 : 0], [t, out ? 1 : 0]); lastOut = out; }
        hiMax = Math.max(hiMax, T);
        hist.push([t, T, reading, u]);
        const old = t - WIN - 2;
        while (hist.length > 2 && hist[0][0] < old) hist.shift();
        while (edges.length > 4 && edges[2][0] < old) edges.shift();
      }
      const loop = kit.loop(dt => {
        acc += dt * SPEED;
        let n = 0;
        while (acc >= H && n++ < 100) { advance(); acc -= H; }
        const c = st.begin(), C = kit.colors(), q = ctl.values, W = st.W, M = W < 520 ? 36 : 44, cw = W - M - 10;
        const reading = readingOf(), outNow = lastOut && !fuseBlown;
        // the chain: sensor, program, switch, fuse, heater
        const nb = 5, gap = 6, bw = (W - 2 * 10 - gap * (nb - 1)) / nb, bh = 52, by = 8;
        const ok = C.ok, bad = C.bad, warn = C.warn;
        const items = [
          { label: 'Sensor', sub: sensor === 'ok' ? num(reading, 0) + ' °C' : sensor === 'open' ? 'open' : sensor === 'short' ? 'shorted' : 'loose', color: sensor === 'ok' ? ok : bad },
          { label: 'Program', sub: state === 'reset' ? 'RESET' : state === 'hung' ? 'HUNG' : fault ? 'fault' : 'running', color: state === 'running' && !fault ? ok : state === 'running' ? warn : bad },
          { label: 'Switch', sub: state === 'reset' ? (q.pd ? 'held off' : 'floats on') : lastOut ? 'on' : 'off', color: lastOut ? warn : ok },
          { label: 'Fuse', sub: !q.fuse ? 'none' : fuseBlown ? 'BLOWN' : 'intact', color: !q.fuse ? C.faint : fuseBlown ? bad : ok },
          { label: 'Heater', sub: outNow ? 'on' : 'off', color: outNow ? warn : C.faint }
        ];
        items.forEach((it, i) => S.box(c, 10 + i * (bw + gap), by, bw, bh, { label: it.label, sub: it.sub, color: it.color, active: true, size: W < 520 ? 10.5 : 12.5 }));
        const ex = legendExtra(['real temperature', 'what the controller believes', 'switch'], M, W - 10), y1 = by + bh + 22, h1 = Math.round((st.H - y1 - 70 - ex) * 0.72), y2 = y1 + h1 + 18, h2 = st.H - y2 - 34 - ex;
        const t1 = Math.max(t, WIN), t0 = t1 - WIN;
        chart(kit, c, C, M, y1, cw, h1, { t0, t1, min: -50, max: 160, step: 50, title: 'temperature (°C) · last 4 min, shown 4× faster',
          hlines: [{ v: 90, color: warn, label: 'fuse 90 °C' }, { v: 120, color: bad, label: 'fire risk' }],
          series: [{ pts: hist.map(p => [p[0], p[2]]), color: C.muted, width: 1.4 }, { pts: hist.map(p => [p[0], p[1]]), color: C.accent, width: 2.4 }] });
        chart(kit, c, C, M, y2, cw, h2, { t0, t1, min: -0.15, max: 1.15, step: 1, title: 'switch output (on = 1)', series: [{ pts: edges.concat([[t, lastOut ? 1 : 0]]), color: kit.hue(30), width: 1.8, fill: kit.hue(30, 0.25) }] });
        legend(kit, c, C, M, st.H - 16 - ex, W - 10, [{ label: 'real temperature', color: C.accent }, { label: 'what the controller believes', color: C.muted, width: 1.4 }, { label: 'switch', color: kit.hue(30) }]);
        ro.set('T', num(T) + ' °C'); ro.set('read', num(reading) + ' °C' + (sensor === 'ok' ? '' : ' (wrong)'));
        ro.set('out', outNow ? 'ON' : 'off' + (fuseBlown ? ' (fuse blown)' : ''));
        ro.set('act', note);
        ro.set('hi', num(hiMax) + ' °C');
        ro.set('verdict', hiMax >= 100 ? 'Dangerous: it reached ' + num(hiMax, 0) + ' °C' : hiMax >= 75 ? 'Too hot: ' + num(hiMax, 0) + ' °C' : 'Safe so far');
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
      loop.start();
    }
  });


})();
