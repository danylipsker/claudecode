/* HYPER-PNEUMATICS · sims/air-physics.js — simulations for the branch "Air and Gas Physics"
 *   air-gas-piston        a litre of air in a cylinder: drag, lock or float the piston, choose the heat exchange;
 *                         p–V path against the isotherm and the adiabat, temperature, work and heat
 *   air-gauges            gauge and absolute gauges on a receiver and a suction cup, a barometer, altitude and weather
 *   air-compression-heat  one stroke of a piston compressor: polytropic compression, clearance re-expansion,
 *                         indicator diagram, delivery temperature and work (kit.fluid.compressorWork)
 *   air-dewpoint-chart    the saturation curve (Magnus) and a sample of air through compressor, aftercooler,
 *                         dryer and pipes: pressure dew point and condensate (kit.fluid.magnus)
 *   air-orifice-flow      flow through a restriction as the downstream pressure falls, until it chokes
 *                         (kit.fluid.iso6358), against an ideal nozzle and the small-drop formula
 *   air-mixture           air as its molecules: Dalton's partial pressures, water vapour against saturation
 *   air-energy-chain      100 kWh of electricity followed to the useful work of a cylinder
 */
(function () {
  'use strict';
  const PATM = 101325, RAIR = 287.058, GAM = 1.4, RW = 461.5;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const smooth = f => f <= 0 ? 0 : f >= 1 ? 1 : f * f * (3 - 2 * f);
  // air coloured by its absolute temperature: blue when cold, red when hot
  const tempFill = (kit, T, a) => kit.hue(Math.round(215 - 215 * clamp((T - 250) / 450, 0, 1)), a == null ? 0.45 : a);
  // fit a W × H design grid into the stage, centred
  const frame = (st, W, H) => { const k = Math.min(st.W / W, st.H / H); return { k, ox: (st.W - W * k) / 2, oy: (st.H - H * k) / 2 }; };
  const toDesign = (f, p) => ({ x: (p.x - f.ox) / f.k, y: (p.y - f.oy) / f.k });
  // dew point (°C) of a vapour partial pressure (Pa), inverse Magnus
  const dewOf = e => { const g = Math.log(Math.max(e, 1e-6) / 611.2); return 243.12 * g / (17.62 - g); };
  // isentropic nozzle: the flow function and the choked constant
  const RSTAR = Math.pow(2 / (GAM + 1), GAM / (GAM - 1));
  const svf = r => Math.sqrt(Math.max(0, Math.pow(r, 2 / GAM) - Math.pow(r, (GAM + 1) / GAM)));
  const SVMAX = svf(RSTAR);
  const CST = Math.sqrt(GAM / RAIR) * Math.pow(2 / (GAM + 1), (GAM + 1) / (2 * (GAM - 1)));   // 0.0404
  const KI = Math.sqrt(2 / RAIR) / CST;                  // small-drop formula relative to the choked flow: KI·√(1 − r)
  const seeded = seed => { let q = seed; return () => (q = (q * 16807) % 2147483647) / 2147483647; };

  /* ================================================================ gas laws in a cylinder */
  Hyper.sim('air-gas-piston', {
    title: 'Gas laws in a cylinder',
    blurb: `A litre of air shut in a cylinder at 1.013 bar and 20 °C. Drag the piston's handle (or use the buttons), lock the piston, or let it float under a load, and choose how easily heat passes through the cylinder walls. The dots are molecules, faster when the air is hotter; the colour shows its temperature. Below, the path of the air on the pressure–volume diagram, with the isotherm at the wall temperature and the adiabat through the present state.

**Try this**
- *Isothermal*, drag the piston in slowly: the path follows the isotherm and $pV$ stays constant — Boyle's law. At an eighth of the volume the pressure is eight times higher.
- *Adiabatic*, squeeze to ⅛ quickly: the pressure reaches 18.6 bar instead of 8.1 and the air heats to about 400 °C. Pull back to 1 L and it returns to 20 °C — nothing was lost.
- *Real cylinder*, squeeze quickly and wait: the pressure overshoots, then sags as the heat leaks into the walls — the heat a compressor throws away in its aftercooler.
- Lock the piston and raise the wall temperature: the pressure follows the absolute temperature (Gay-Lussac). Let the piston float under a load and do the same: now the volume follows it (Charles).
- Compare the work done on the air with the heat given to the walls: in a slow compression they are equal, and their difference is always the change in internal energy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 220 });
      const gd = document.createElement('div');
      gd.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gd);
      const plot = kit.plot(gd, { x: { label: 'volume (L)', min: 0, max: 1.25 }, y: { label: 'absolute pressure (bar)', min: 0, max: 12 }, legend: true }, 200);
      const CV = RAIR / (GAM - 1), V0 = 1e-3, T0 = 293.15, MASS = PATM * V0 / (RAIR * T0);
      const VMIN = 0.1e-3, VMAX = 1.2e-3, TAU = 3;
      const X0 = 40, LEN = 470, PT = 18, ROD = 150, CY = 150, HH = 64;
      const NICE = [2, 3, 5, 8, 10, 12, 15, 20, 25, 30, 40];
      let s, fr = frame(st, 760, 300);
      const rnd = seeded(12345);
      function reset() {
        s = { V: V0, T: T0, Vt: V0, W: 0, Q: 0, trace: [[1, PATM / 1e5]], tt: 0, tp: 1, auto: null, parts: [] };
        for (let i = 0; i < 70; i++) {
          const a = rnd() * Math.PI * 2;
          s.parts.push({ x: 3 + rnd() * (LEN * V0 / VMAX - 6), y: 4 + rnd() * (2 * HH - 8), vx: Math.cos(a), vy: Math.sin(a), sp: 0.6 + 0.8 * rnd() });
        }
      }
      reset();
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The piston', options: [['Moved by you: drag the handle', 0], ['Locked: constant volume', 1], ['Floating under a load: constant pressure', 2]], value: 0 },
        { id: 'heat', type: 'select', label: 'Heat through the cylinder walls', options: [['Real cylinder: heat leaks out in seconds', 'real'], ['Isothermal: heat flows freely', 'iso'], ['Adiabatic: perfectly insulated', 'adi']], value: 'real' },
        { id: 'Tw', label: 'Wall and room temperature', min: -20, max: 200, step: 1, value: 20, unit: '°C' },
        { id: 'pl', label: 'Load on the floating piston (absolute)', min: 0.5, max: 10, step: 0.1, value: 1, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'fast', label: 'Squeeze to ⅛ in 0.2 s', primary: true }, { id: 'slow', label: 'Squeeze to ⅛ in 20 s' }, { id: 'back', label: 'Pull back to 1 L' }, { id: 'again', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'fast' || id === 'slow' || id === 'back') {
          if (ctl.values.mode !== 0) { ctl.set('mode', 0); ctl.show('pl', false); }
          s.auto = { from: s.V, to: id === 'back' ? V0 : V0 / 8, dur: id === 'slow' ? 20 : id === 'fast' ? 0.2 : 0.5, t: 0 };
        }
        if (id === 'again') reset();
        if (id === 'mode') { s.Vt = s.V; s.auto = null; ctl.show('pl', v === 2); }
      });
      ctl.show('pl', false);
      const ro = kit.readout(box.side, [['V', 'Volume'], ['p', 'Pressure: absolute / gauge'], ['T', 'Air temperature'], ['pv', 'pV now ÷ pV at the start (= T/T₀)'], ['W', 'Work done on the air / heat given to the walls'], ['U', 'Change in internal energy']]);

      kit.drag(st, {
        hit: p => { const d = toDesign(fr, p), xh = X0 + LEN * s.V / VMAX + PT + ROD; return Math.abs(d.x - xh) < 40 && Math.abs(d.y - CY) < 60 ? 'handle' : null; },
        start: () => { if (ctl.values.mode !== 0) { ctl.set('mode', 0); ctl.show('pl', false); } s.auto = null; },
        move: (k, p) => { const d = toDesign(fr, p); s.Vt = clamp((d.x - PT - ROD - X0) / LEN * VMAX, VMIN, VMAX); },
        hover: true
      });

      // one small time step: the piston moves, the air changes temperature adiabatically, then exchanges heat
      function sub(h) {
        const P = ctl.values, Tw = P.Tw + 273.15;
        if (s.auto) {
          s.auto.t += h;
          s.Vt = s.auto.from + (s.auto.to - s.auto.from) * smooth(s.auto.t / s.auto.dur);
          if (s.auto.t >= s.auto.dur) s.auto = null;
        }
        let target = P.mode === 1 ? s.V : P.mode === 2 ? MASS * RAIR * s.T / (P.pl * 1e5) : s.Vt;
        target = clamp(target, VMIN, VMAX);
        const Vn = s.V + (target - s.V) * Math.min(1, (P.mode === 2 ? 25 : 60) * h);
        const p = MASS * RAIR * s.T / s.V;
        let Tn = s.T * Math.pow(s.V / Vn, GAM - 1);
        const pn = MASS * RAIR * Tn / Vn;
        s.W -= (p + pn) / 2 * (Vn - s.V);
        const Ta = Tn;
        if (P.heat === 'iso') Tn = Tw;
        else if (P.heat === 'real') Tn = Tw + (Tn - Tw) * Math.exp(-h / TAU);
        s.Q += MASS * CV * (Ta - Tn);
        s.V = Vn; s.T = clamp(Tn, 20, 3000);
      }

      function drawPlot(p, Tw) {
        let pm = p / 1e5;
        for (const q of s.trace) pm = Math.max(pm, q[1]);
        const ymax = NICE.find(v => v >= pm * 1.15) || 40;
        const iso = [], adi = [];
        for (let i = 0; i <= 60; i++) {
          const Vl = 0.1 + 1.1 * i / 60, Vm = Vl / 1000;
          const pI = MASS * RAIR * Tw / Vm / 1e5;
          if (pI <= ymax) iso.push([Vl, pI]);
          const pA = p * Math.pow(s.V / Vm, GAM) / 1e5;
          if (pA <= ymax) adi.push([Vl, pA]);
        }
        plot.set({
          series: [{ pts: s.trace.slice(), label: 'path of the air' }, { pts: iso, label: 'isotherm at the wall temperature', dash: [6, 4] }, { pts: adi, label: 'adiabat through the present state', dash: [2, 4] }],
          marks: [{ x: s.V * 1000, y: p / 1e5 }], y: { label: 'absolute pressure (bar)', min: 0, max: ymax }
        });
      }

      function draw(dt, p, Tw) {
        const c = st.begin(), C = kit.colors(), P = ctl.values;
        fr = frame(st, 760, 300);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const w = LEN * s.V / VMAX, xf = X0 + w, top = CY - HH, bot = CY + HH;
        c.fillStyle = tempFill(kit, s.T, 0.5); c.fillRect(X0, top, w, 2 * HH);
        // the molecules: speed grows with √T
        const sp = 90 * Math.sqrt(s.T / 293.15);
        c.fillStyle = C.text;
        for (const q of s.parts) {
          q.x += q.vx * q.sp * sp * dt; q.y += q.vy * q.sp * sp * dt;
          if (q.x < 3) { q.x = 3; q.vx = Math.abs(q.vx); }
          if (q.x > w - 3) { q.x = Math.max(3, w - 3); q.vx = -Math.abs(q.vx); }
          if (q.y < 3) { q.y = 3; q.vy = Math.abs(q.vy); }
          if (q.y > 2 * HH - 3) { q.y = 2 * HH - 3; q.vy = -Math.abs(q.vy); }
          c.beginPath(); c.arc(X0 + q.x, top + q.y, 2.2, 0, Math.PI * 2); c.fill();
        }
        // barrel and head
        const xe = X0 + LEN + PT + 30;
        c.strokeStyle = C.text; c.lineWidth = 3; c.lineJoin = 'round';
        c.beginPath(); c.moveTo(xe, top); c.lineTo(X0, top); c.lineTo(X0, bot); c.lineTo(xe, bot); c.stroke();
        if (P.heat === 'adi') {
          // insulation
          c.strokeStyle = C.muted; c.lineWidth = 1;
          for (let x = X0 - 10; x < xe; x += 10) {
            c.beginPath(); c.moveTo(x, top - 12); c.lineTo(x + 10, top - 2); c.stroke();
            c.beginPath(); c.moveTo(x, bot + 2); c.lineTo(x + 10, bot + 12); c.stroke();
          }
          kit.label(c, 'insulated: no heat passes', X0 + 8, bot + 24, { color: C.muted, size: 12 });
        } else {
          const dT = s.T - Tw;
          if (Math.abs(dT) > 2) {
            const col = dT > 0 ? C.bad : C.accent, wd = clamp(1 + Math.abs(dT) / 40, 1, 4);
            for (let i = 0; i < 4; i++) {
              const x = X0 + w * (i + 0.5) / 4;
              if (dT > 0) { kit.arrow(c, x, top - 4, x, top - 26, col, wd); kit.arrow(c, x, bot + 4, x, bot + 26, col, wd); }
              else { kit.arrow(c, x, top - 26, x, top - 4, col, wd); kit.arrow(c, x, bot + 26, x, bot + 4, col, wd); }
            }
            kit.label(c, dT > 0 ? 'heat flows out to the walls' : 'heat flows in from the walls', X0 + 8, bot + 38, { color: col, size: 12 });
          } else kit.label(c, 'walls at ' + P.Tw.toFixed(0) + ' °C', X0 + 8, bot + 24, { color: C.muted, size: 12 });
        }
        // piston, rod and handle
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(xf, top + 2, PT, 2 * HH - 4); c.strokeRect(xf, top + 2, PT, 2 * HH - 4);
        const xh = xf + PT + ROD;
        c.fillRect(xf + PT, CY - 5, ROD, 10); c.strokeRect(xf + PT, CY - 5, ROD, 10);
        kit.dot(c, xh, CY, 14, P.mode === 0 ? C.accent : C.muted, C.text);
        if (P.mode === 1) {
          c.fillStyle = C.bad; c.fillRect(xh - 44, CY - 26, 8, 52);
          kit.label(c, 'locked', xh - 40, CY - 36, { align: 'center', color: C.bad, size: 12, weight: 700 });
        }
        if (P.mode === 2) {
          kit.arrow(c, xh + 72, CY, xh + 16, CY, C.warn, 3);
          kit.label(c, 'load ' + P.pl.toFixed(1) + ' bar abs', xh + 40, CY - 24, { align: 'center', color: C.warn, size: 12, weight: 700 });
        }
        kit.label(c, (p / 1e5).toFixed(2) + ' bar absolute  ·  ' + ((p - PATM) / 1e5).toFixed(2) + ' bar gauge', X0, 30, { size: 15, weight: 700 });
        kit.label(c, 'air at ' + (s.T - 273.15).toFixed(0) + ' °C in ' + (s.V * 1000).toFixed(3) + ' L', X0, 54, { color: C.muted, size: 12.5 });
        // temperature scale
        const bx = 60, bw = 460, by = 262;
        for (let i = 0; i < 46; i++) { c.fillStyle = tempFill(kit, 250 + 450 * i / 46, 0.85); c.fillRect(bx + bw * i / 46, by, bw / 46 + 0.6, 9); }
        for (const t of [-20, 0, 100, 200, 300, 400]) {
          const x = bx + bw * (t + 273.15 - 250) / 450;
          kit.label(c, t + ' °C', x, by + 20, { align: 'center', size: 10.5, color: C.muted });
        }
        const xT = bx + bw * clamp((s.T - 250) / 450, 0, 1);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(xT, by - 1); c.lineTo(xT - 6, by - 10); c.lineTo(xT + 6, by - 10); c.closePath(); c.fill();
        c.restore();
      }

      const loop = kit.loop((dt) => {
        const n = Math.max(1, Math.ceil(dt / 0.002)), h = dt / n;
        for (let i = 0; i < n; i++) sub(h);
        const P = ctl.values, p = MASS * RAIR * s.T / s.V, Tw = P.Tw + 273.15;
        s.tt += dt;
        if (s.tt > 0.03) {
          s.tt = 0;
          const last = s.trace[s.trace.length - 1], q = [s.V * 1000, p / 1e5];
          if (!last || Math.abs(last[0] - q[0]) > 1e-4 || Math.abs(last[1] - q[1]) > 1e-3) { s.trace.push(q); if (s.trace.length > 700) s.trace.shift(); }
        }
        s.tp += dt;
        if (s.tp > 0.08) { s.tp = 0; drawPlot(p, Tw); }
        ro.set('V', (s.V * 1000).toFixed(3) + ' L');
        ro.set('p', (p / 1e5).toFixed(2) + ' bar / ' + ((p - PATM) / 1e5).toFixed(2) + ' bar');
        ro.set('T', (s.T - 273.15).toFixed(1) + ' °C');
        ro.set('pv', (p * s.V / (PATM * V0)).toFixed(3));
        ro.set('W', s.W.toFixed(1) + ' J / ' + s.Q.toFixed(1) + ' J');
        ro.set('U', (MASS * CV * (s.T - T0)).toFixed(1) + ' J');
        draw(dt, p, Tw);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gauge and absolute pressure */
  Hyper.sim('air-gauges', {
    title: 'Gauge and absolute pressure',
    blurb: `Two pressures measured two ways. A receiver of compressed air and a suction cup on an ejector each carry a gauge that reads from the atmosphere (red needle) and one that reads from a perfect vacuum (blue needle); the barometer on the left shows the atmosphere itself, which falls as you climb and moves with the weather.

**Try this**
- Drive up to 3000 m and back. The absolute gauge of the sealed receiver does not move — the same air is inside — but its ordinary gauge climbs by 0.3 bar, because its zero, the atmosphere, has dropped.
- Tick *fed by a regulator*: now the gauge pressure stays put and the absolute pressure falls with altitude — less air in every stroke up the mountain.
- Watch the suction cup: the ejector removes the same share of the atmosphere, but there is less atmosphere to push, so the cup holds less the higher you go.
- Move the weather from a deep low (960 mbar) to a strong high (1050 mbar): every gauge reading shifts; the absolute readings of the sealed receiver do not.
- Switch the units to psi: gauge and absolute become psig and psia, 14.7 apart at sea level.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.53, minH: 270 });
      let trip = -1;
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Altitude', min: 0, max: 8848, step: 10, value: 0, unit: 'm' },
        { id: 'wx', label: 'Weather: sea-level pressure', min: 960, max: 1050, step: 1, value: 1013, unit: 'mbar' },
        { id: 'pf', label: 'Receiver filled at sea level to (gauge)', min: 0, max: 9, step: 0.1, value: 6, unit: 'bar' },
        { id: 'reg', type: 'check', label: 'Receiver fed by a regulator instead of sealed', value: false },
        { id: 'vac', label: 'Ejector removes this share of the atmosphere', min: 0, max: 95, step: 1, value: 85, unit: '%' },
        { id: 'u', type: 'select', label: 'Units', options: [['bar', 'bar'], ['psi', 'psi'], ['kPa', 'kPa']], value: 'bar' },
        { type: 'buttons', items: [{ id: 'drive', label: 'Drive up to 3000 m and back', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id) => { if (id === 'drive') trip = 0; if (id === 'stop') trip = -1; });
      const ro = kit.readout(box.side, [['atm', 'Atmosphere (absolute)'], ['rg', 'Receiver: gauge / absolute'], ['air', 'Air in the receiver per litre of its volume'], ['vg', 'Suction cup: gauge / absolute'], ['F', 'Most a Ø 50 mm cup can hold']]);
      const V = ctl.values, ACUP = Math.PI * 0.025 * 0.025;
      const UNITS = {
        bar: { f: 1e5, g: [-1, 10, 1], a: [0, 11, 1], vg: [-1, 0, 0.2], va: [0, 1.2, 0.2], b: [0.3, 1.1, 0.1], d: 2, gs: ' bar g', as: ' bar abs' },
        psi: { f: 6894.757, g: [-15, 150, 15], a: [0, 165, 15], vg: [-15, 0, 3], va: [0, 18, 3], b: [4, 16, 2], d: 1, gs: ' psig', as: ' psia' },
        kPa: { f: 1000, g: [-100, 1000, 100], a: [0, 1100, 100], vg: [-100, 0, 20], va: [0, 120, 20], b: [30, 110, 10], d: 0, gs: ' kPa g', as: ' kPa abs' }
      };
      const disp = { b: PATM, rg: 6e5, ra: 6e5 + PATM, vg: -0.85 * PATM, va: 0.15 * PATM };
      const fmtTick = (q, step) => (step < 1 ? q.toFixed(1) : String(Math.round(q))).replace('-', '−');
      function dial(c, C, x, y, r, rng, u, valPa, title, col) {
        const lo = rng[0], hi = rng[1], step = rng[2], v = valPa / u.f;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); c.stroke();
        const ang = q => (135 + 270 * (q - lo) / (hi - lo)) * Math.PI / 180;
        const nt = Math.round((hi - lo) / step);
        // long tick labels (psi, kPa) on every other tick, so they do not collide
        const every = nt > 6 && Math.max(fmtTick(lo, step).length, fmtTick(hi, step).length) >= 3 ? 2 : 1;
        c.strokeStyle = C.muted; c.lineWidth = 1.2;
        for (let i = 0; i <= nt; i++) {
          const q = lo + i * step, a = ang(q);
          c.beginPath(); c.moveTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); c.lineTo(x + Math.cos(a) * r * 0.93, y + Math.sin(a) * r * 0.93); c.stroke();
          if (i % every === 0) kit.label(c, fmtTick(q, step), x + Math.cos(a) * r * 0.63, y + Math.sin(a) * r * 0.63, { align: 'center', size: 9, color: C.muted });
        }
        const a = ang(clamp(v, lo - (hi - lo) * 0.03, hi + (hi - lo) * 0.03));
        c.strokeStyle = col; c.lineWidth = 2.6; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * 0.84, y + Math.sin(a) * r * 0.84); c.stroke();
        kit.dot(c, x, y, 3.5, col);
        kit.label(c, title, x, y + r + 13, { align: 'center', size: 11.5, weight: 700 });
        kit.label(c, v.toFixed(u.d) + (title === 'gauge' ? u.gs : u.as), x, y + r + 28, { align: 'center', size: 11.5, color: col });
      }
      const loop = kit.loop((dt) => {
        if (trip >= 0) {
          trip += dt;
          const f = trip < 6 ? smooth(trip / 6) : smooth((12 - trip) / 6);
          ctl.set('h', Math.round(3000 * f));
          if (trip >= 12) { trip = -1; ctl.set('h', 0); }
        }
        const u = UNITS[V.u] || UNITS.bar;
        const patm = V.wx * 100 * Math.pow(1 - 2.25577e-5 * clamp(V.h, 0, 11000), 5.25588);
        const pRa = V.reg ? V.pf * 1e5 + patm : V.pf * 1e5 + PATM;
        const pCa = patm * (1 - V.vac / 100);
        const tgt = { b: patm, rg: pRa - patm, ra: pRa, vg: pCa - patm, va: pCa };
        const kk = dt ? Math.min(1, dt * 5) : 1;
        for (const key in tgt) disp[key] += (tgt[key] - disp[key]) * kk;
        const fp = (pa, extra) => (pa / u.f).toFixed(u.d + (extra || 0));
        ro.set('atm', fp(patm, 1) + (V.u === 'bar' ? ' bar' : V.u === 'psi' ? ' psia' : ' kPa') + '  (' + (patm / 100).toFixed(0) + ' mbar)');
        ro.set('rg', fp(pRa - patm) + u.gs + ' / ' + fp(pRa) + u.as);
        ro.set('air', (pRa / 1e5).toFixed(2) + ' L of free air (ANR, 20 °C)');
        ro.set('vg', fp(pCa - patm) + u.gs + ' / ' + fp(pCa) + u.as);
        ro.set('F', ((patm - pCa) * ACUP).toFixed(0) + ' N (' + ((patm - pCa) * ACUP / 9.80665).toFixed(1) + ' kg)');

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 400);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        // barometer and mountain
        dial(c, C, 80, 72, 50, u.b, u, disp.b, 'barometer', C.accent);
        c.fillStyle = kit.hue(130, 0.22); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(8, 385); c.lineTo(95, 175); c.lineTo(182, 385); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = kit.hue(210, 0.12); c.beginPath(); c.moveTo(80, 211); c.lineTo(95, 175); c.lineTo(110, 211); c.closePath(); c.fill();
        const hf = clamp(V.h / 8848, 0, 1), mx = 8 + 87 * hf, my = 385 - 210 * hf;
        kit.dot(c, mx, my, 6, C.warn, C.text);
        kit.label(c, V.h.toFixed(0) + ' m', mx + 10, my - 10, { size: 12, weight: 700 });
        kit.label(c, (patm / 100).toFixed(0) + ' mbar', mx + 10, my + 6, { size: 11, color: C.muted });
        // receiver with its two gauges
        const aR = 0.08 + 0.3 * clamp(pRa / 11e5, 0, 1);
        c.fillStyle = kit.hue(215, aR); c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); if (c.roundRect) c.roundRect(215, 292, 240, 70, 34); else c.rect(215, 292, 240, 70); c.fill(); c.stroke();
        kit.label(c, V.reg ? 'receiver, fed by a regulator' : 'receiver, sealed', 335, 327, { align: 'center', size: 12, weight: 700 });
        c.strokeStyle = C.text; c.lineWidth = 2;
        for (const x of [280, 390]) { c.beginPath(); c.moveTo(x, 292); c.lineTo(x, 250); c.stroke(); }
        if (V.reg) { kit.arrow(c, 188, 327, 213, 327, C.text, 2); kit.label(c, 'regulated', 188, 312, { size: 10.5, color: C.muted, align: 'center' }); }
        dial(c, C, 280, 160, 52, u.g, u, disp.rg, 'gauge', C.bad);
        dial(c, C, 390, 160, 52, u.a, u, disp.ra, 'absolute', C.accent);
        // suction cup on an ejector
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(560, 250); c.lineTo(560, 272); c.lineTo(690, 272); c.lineTo(690, 250); c.moveTo(625, 272); c.lineTo(625, 300); c.stroke();
        c.fillStyle = kit.hue(215, 0.08 + 0.3 * clamp(pCa / PATM, 0, 1)); c.strokeStyle = C.text;
        c.beginPath(); c.moveTo(612, 300); c.lineTo(638, 300); c.lineTo(660, 332); c.lineTo(590, 332); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.surface; c.fillRect(565, 333, 120, 12); c.strokeRect(565, 333, 120, 12);
        for (const x of [585, 625, 665]) kit.arrow(c, x, 385, x, 350, C.accent, 1.8);
        kit.label(c, 'the atmosphere pushes: ' + ((patm - pCa) * ACUP).toFixed(0) + ' N', 625, 393, { align: 'center', size: 11, color: C.accent });
        kit.label(c, 'cup Ø 50 mm', 700, 318, { size: 11, color: C.muted });
        dial(c, C, 560, 160, 52, u.vg, u, disp.vg, 'gauge', C.bad);
        dial(c, C, 690, 160, 52, u.va, u, disp.va, 'absolute', C.accent);
        kit.label(c, 'Receiver', 335, 18, { align: 'center', size: 13, weight: 700 });
        kit.label(c, 'Suction cup', 625, 18, { align: 'center', size: 13, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat of compression */
  Hyper.sim('air-compression-heat', {
    title: 'Heat of compression: one compressor stroke',
    blurb: `A single-acting piston compressor with a swept volume of 1 litre, turned slowly so you can follow a cycle. On the down-stroke the air left in the clearance volume re-expands, then the intake valve lets fresh air in; on the up-stroke both valves are shut while the piston compresses the air, and the delivery valve opens when its pressure reaches the line pressure. The colour shows the air temperature, the bars on the right compare temperatures, and the indicator diagram below is the cycle on pressure–volume axes: its area is the work per stroke.

**Try this**
- Set n = 1.4 (no cooling at all): at 7 bar gauge the air leaves at about 256 °C. At n = 1 (perfect cooling) it leaves at the intake temperature — and the work per stroke falls by more than a quarter.
- Raise the delivery pressure and watch the delivery temperature and the energy per cubic metre of free air climb. Compare with the two-stage figures in the readout.
- Increase the clearance: the trapped air must re-expand before fresh air can enter, so each stroke delivers less air — though the work per litre delivered hardly changes.
- A bicycle pump is the same machine without a crank: its air also heats to well over 100 °C, but there is so little of it that the barrel only gets warm.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 240 });
      const gd = document.createElement('div');
      gd.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gd);
      const plot = kit.plot(gd, { x: { label: 'volume in the cylinder (L)', min: 0 }, y: { label: 'absolute pressure (bar)', min: 0 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'pg', label: 'Delivery pressure (gauge)', min: 1, max: 12, step: 0.5, value: 7, unit: 'bar' },
        { id: 'T1', label: 'Intake air temperature', min: -10, max: 45, step: 1, value: 20, unit: '°C' },
        { id: 'n', label: 'Polytropic exponent n (1 isothermal, 1.4 adiabatic)', min: 1, max: 1.4, step: 0.01, value: 1.35 },
        { id: 'cl', label: 'Clearance volume (share of the swept volume)', min: 0, max: 15, step: 0.5, value: 5, unit: '%' },
        { id: 'rpm', type: 'select', label: 'Crank speed', options: [['Slow motion: 6 rpm', 6], ['15 rpm', 15], ['40 rpm', 40]], value: 15 }
      ], () => { tPlot = 1; });
      const ro = kit.readout(box.side, [['now', 'Now'], ['pt', 'Now: pressure / temperature'], ['td', 'Delivery temperature: this n / adiabatic'], ['fa', 'Free air per stroke / volumetric efficiency'], ['w', 'Work per stroke: this n / isothermal / adiabatic'], ['e', 'Energy per m³ of free air (ideal machine)'], ['two', 'Two stages, cooled between: temperature / energy']]);
      const V = ctl.values, CX = 190, CYC = 262, RC = 44, LC = 130, TDC = CYC - RC - LC - 18;
      let th = Math.PI * 0.6, tPlot = 1;
      const pinY = a => CYC - (RC * Math.cos(a) + Math.sqrt(LC * LC - RC * RC * Math.sin(a) * Math.sin(a)));
      const dispOf = a => ((RC + LC) - (RC * Math.cos(a) + Math.sqrt(LC * LC - RC * RC * Math.sin(a) * Math.sin(a)))) / (2 * RC);
      function model() {
        const p1 = PATM, p2 = V.pg * 1e5 + PATM, T1 = V.T1 + 273.15, n = V.n, k = (n - 1) / n, Vs = 1e-3, Vc = V.cl / 100 * Vs;
        const Vb = Vc + Vs, Td = T1 * Math.pow(p2 / p1, k), Tad = T1 * Math.pow(p2 / p1, (GAM - 1) / GAM);
        const Vre = Vc * Math.pow(p2 / p1, 1 / n), Vd = Vb * Math.pow(p1 / p2, 1 / n);
        const Vin = Math.max(0, Vb - Vre);
        const pb = Vre < Vb ? p1 : p2 * Math.pow(Vc / Vb, n), Tb = Vre < Vb ? T1 : Td * Math.pow(pb / p2, k);
        const W = Vin > 0 ? F.compressorWork(p1, p2, Vin, n) : 0, Wiso = Vin > 0 ? F.compressorWork(p1, p2, Vin, 1) : 0, Wad = Vin > 0 ? F.compressorWork(p1, p2, Vin, GAM) : 0;
        const rs = Math.sqrt(p2 / p1), T2s = T1 * Math.pow(rs, k), e2 = 2 * F.compressorWork(p1, p1 * rs, 1, n) / 3.6e6;
        const state = a => {
          const Vv = Vc + dispOf(a) * Vs;
          let p, T, ph;
          if (a < Math.PI) {
            if (Vv < Vre) { p = p2 * Math.pow(Vc / Vv, n); T = Td * Math.pow(p / p2, k); ph = 'the clearance air re-expands'; }
            else { p = p1; T = T1; ph = 'intake: fresh air drawn in'; }
          } else if (Vv > Vd) { p = Math.min(p2, pb * Math.pow(Vb / Vv, n)); T = Tb * Math.pow(p / pb, k); ph = 'compression: both valves shut'; }
          else { p = p2; T = Td; ph = 'delivery: air pushed into the line'; }
          return { V: Vv, p, T, ph };
        };
        return { p1, p2, T1, Td, Tad, Vs, Vc, Vb, Vin, W, Wiso, Wad, T2s, e2, state };
      }
      const loop = kit.loop((dt) => {
        th = (th + 2 * Math.PI * V.rpm / 60 * dt) % (2 * Math.PI);
        const m = model(), s = m.state(th);
        // the indicator diagram
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const cyc = [];
          for (let i = 0; i <= 180; i++) { const q = m.state(2 * Math.PI * i / 180 - 1e-9 * (i === 180 ? 1 : 0)); cyc.push([q.V * 1000, q.p / 1e5]); }
          const iso = [], adi = [];
          if (m.Vin > 0) for (let i = 0; i <= 40; i++) {
            const p = m.p1 + (m.p2 - m.p1) * i / 40;
            iso.push([m.Vb * m.p1 / p * 1000, p / 1e5]);
            adi.push([m.Vb * Math.pow(m.p1 / p, 1 / GAM) * 1000, p / 1e5]);
          }
          plot.set({
            series: [{ pts: cyc, label: 'this compressor, n = ' + V.n.toFixed(2) }, { pts: iso, label: 'isothermal compression', dash: [6, 4] }, { pts: adi, label: 'adiabatic compression', dash: [2, 4] }],
            marks: [{ x: s.V * 1000, y: s.p / 1e5 }], x: { label: 'volume in the cylinder (L)', min: 0, max: 1.2 }, y: { label: 'absolute pressure (bar)', min: 0, max: Math.ceil(m.p2 / 1e5 * 1.1) }
          });
        }
        ro.set('now', s.ph);
        ro.set('pt', (s.p / 1e5).toFixed(2) + ' bar abs / ' + (s.T - 273.15).toFixed(0) + ' °C');
        ro.set('td', (m.Td - 273.15).toFixed(0) + ' °C / ' + (m.Tad - 273.15).toFixed(0) + ' °C');
        if (m.Vin > 0) {
          ro.set('fa', (m.Vin * 1000).toFixed(3) + ' L at intake conditions / ' + (m.Vin / m.Vs * 100).toFixed(0) + ' %');
          ro.set('w', m.W.toFixed(0) + ' J / ' + m.Wiso.toFixed(0) + ' J / ' + m.Wad.toFixed(0) + ' J');
          ro.set('e', (m.W / m.Vin / 3.6e6).toFixed(4) + ' kWh/m³ (isothermal ' + (m.Wiso / m.Vin / 3.6e6).toFixed(4) + ')');
        } else {
          ro.set('fa', 'none: the clearance air never falls to intake pressure');
          ro.set('w', '—'); ro.set('e', '—');
        }
        ro.set('two', (m.T2s - 273.15).toFixed(0) + ' °C / ' + m.e2.toFixed(4) + ' kWh/m³');

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 330);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const pinYnow = pinY(th), ptop = pinYnow - 18, headY = TDC - V.cl / 100 * 2 * RC - 1, x0 = CX - 60, x1 = CX + 60;
        // air in the cylinder
        c.fillStyle = tempFill(kit, s.T, 0.6); c.fillRect(x0, headY, 120, ptop - headY);
        // barrel and valve block
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(x0, TDC + 2 * RC + 42); c.lineTo(x0, headY); c.lineTo(x1, headY); c.lineTo(x1, TDC + 2 * RC + 42); c.stroke();
        c.lineWidth = 2; c.strokeRect(x0, headY - 22, 120, 22);
        const intake = s.ph.startsWith('intake'), deliv = s.ph.startsWith('delivery');
        // intake and delivery pipes with their valves
        c.fillStyle = kit.hue(215, 0.18); c.fillRect(40, headY - 16, x0 + 25 - 40, 10);
        c.fillStyle = tempFill(kit, m.Td, 0.55); c.fillRect(x1 - 25, headY - 16, 330 - (x1 - 25), 10);
        c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.strokeRect(40, headY - 16, x0 + 25 - 40, 10); c.strokeRect(x1 - 25, headY - 16, 330 - (x1 - 25), 10);
        const flap = (x, open) => { c.strokeStyle = open ? C.ok : C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 12, headY); c.lineTo(x - 12 + 24 * Math.cos(open ? 0.7 : 0), headY + 24 * Math.sin(open ? 0.7 : 0)); c.stroke(); };
        flap(x0 + 30, intake); flap(x1 - 18, deliv);
        if (intake) kit.arrow(c, 50, headY - 32, 110, headY - 32, C.accent, 2.5);
        if (deliv) kit.arrow(c, 250, headY - 32, 320, headY - 32, C.bad, 2.5);
        kit.label(c, 'intake ' + (m.p1 / 1e5).toFixed(2) + ' bar', 40, headY - 44, { size: 11, color: C.muted });
        kit.label(c, 'to the receiver ' + (m.p2 / 1e5).toFixed(2) + ' bar abs', 330, headY - 44, { size: 11, color: C.muted, align: 'right' });
        // piston, connecting rod, crank
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2;
        c.fillRect(x0 + 3, ptop, 114, 30); c.strokeRect(x0 + 3, ptop, 114, 30);
        const cpx = CX + RC * Math.sin(th), cpy = CYC - RC * Math.cos(th);
        c.beginPath(); c.arc(CX, CYC, RC + 8, 0, Math.PI * 2); c.stroke();
        c.lineWidth = 6; c.strokeStyle = C.muted; c.beginPath(); c.moveTo(CX, pinYnow); c.lineTo(cpx, cpy); c.stroke();
        c.lineWidth = 4; c.strokeStyle = C.text; c.beginPath(); c.moveTo(CX, CYC); c.lineTo(cpx, cpy); c.stroke();
        kit.dot(c, CX, pinYnow, 4, C.text); kit.dot(c, cpx, cpy, 4, C.text); kit.dot(c, CX, CYC, 5, C.text);
        kit.label(c, (s.p / 1e5).toFixed(2) + ' bar · ' + (s.T - 273.15).toFixed(0) + ' °C', CX, headY + 16, { align: 'center', size: 12.5, weight: 700 });
        // temperature bars
        const rows = [['intake', m.T1], ['in the cylinder now', s.T], ['delivered, n = ' + V.n.toFixed(2), m.Td], ['delivered, adiabatic', m.Tad], ['two stages, cooled between', m.T2s]];
        kit.label(c, 'Air temperature', 380, 26, { size: 13, weight: 700 });
        rows.forEach((r, i) => {
          const y = 62 + i * 46, t = r[1] - 273.15, w = 190 * clamp((t + 20) / 320, 0.01, 1);
          kit.label(c, r[0], 380, y, { size: 11.5, color: C.muted });
          c.fillStyle = tempFill(kit, r[1], 0.85); c.fillRect(380, y + 9, w, 14);
          kit.label(c, t.toFixed(0) + ' °C', 380 + w + 8, y + 16, { size: 12, weight: 700 });
        });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ water in compressed air */
  Hyper.sim('air-dewpoint-chart', {
    title: 'Water in compressed air',
    blurb: `The saturation curve of water vapour (Magnus formula) on a logarithmic scale of vapour partial pressure against temperature: above the curve water cannot stay as vapour. The dot follows a sample of air through a compressed-air system — **0** taken in from the room; **1** compressed, its vapour pressure multiplied by the pressure ratio, and hot; **2** cooled in the aftercooler, running along the curve once it reaches its pressure dew point and dropping water; **3** through the dryer; **4** at the machine, back at room temperature. The bars on the right collect the water.

**Try this**
- With 20 °C, 65 % and 7 bar the pressure dew point after compression is 49 °C, so the aftercooler at 30 °C condenses most of the water. Read the litres per hour.
- Make it a humid summer day (30 °C, 80 %) and watch the separator fill.
- Switch off the dryer: the air leaves the aftercooler saturated at 30 °C and cools to 20 °C in the pipes — water condenses where nobody drains it.
- Choose the desiccant dryer and compare the pressure and atmospheric dew points in the readout.
- Raise the pressure: more water drops out in the aftercooler, and the air leaving it carries fewer grams per cubic metre of free air.`,
    mount(box, kit) {
      const F = kit.fluid, ps = F.magnus;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 't0', label: 'Room (intake) temperature', min: -10, max: 45, step: 1, value: 20, unit: '°C' },
        { id: 'rh', label: 'Relative humidity of the intake air', min: 5, max: 100, step: 1, value: 65, unit: '%' },
        { id: 'pg', label: 'Working pressure (gauge)', min: 1, max: 13, step: 0.5, value: 7, unit: 'bar' },
        { id: 'tac', label: 'Aftercooler outlet temperature', min: 5, max: 50, step: 1, value: 30, unit: '°C' },
        { id: 'dry', type: 'select', label: 'Dryer', options: [['Refrigerated: PDP +3 °C', 'ref'], ['Desiccant: PDP −40 °C', 'des'], ['None', 'none']], value: 'ref' },
        { id: 'fad', label: 'Compressor free air delivery', min: 1, max: 50, step: 0.5, value: 10, unit: 'm³/min' },
        { type: 'buttons', items: [{ id: 'run', label: 'Send the air through again', primary: true }] }
      ], (id) => { if (id === 'run') { s.m = 0; s.hold = 0; } });
      const ro = kit.readout(box.side, [['in', 'Intake: dew point · water'], ['pdp', 'Pressure dew point after compression'], ['ac', 'Separated after the aftercooler'], ['dr', 'Removed by the dryer'], ['pp', 'Condensing in the pipes'], ['out', 'At the machine: pressure / atmospheric dew point'], ['rh', 'Relative humidity at the machine']]);
      const V = ctl.values, s = { m: 0, hold: 0, spawn: 0, drops: [] };
      const TMIN = -45, TMAX = 100, LMIN = -1, LMAX = 3.3, XL = 70, XR = 560, YT = 20, YB = 350;
      const X = t => XL + (t - TMIN) / (TMAX - TMIN) * (XR - XL);
      const Y = pw => YB - (Math.log10(Math.max(pw / 100, 1e-3)) - LMIN) / (LMAX - LMIN) * (YB - YT);
      // cool (or warm) at constant vapour pressure; on reaching the dew point, follow the curve down
      function move(tFrom, pw, tTo, path) {
        if (tTo >= tFrom) { path.push([tTo, pw, 0]); return pw; }
        const td = dewOf(pw);
        if (td <= tTo) { path.push([tTo, pw, 0]); return pw; }
        if (td < tFrom) path.push([td, pw, 0]);
        const ta = Math.min(td, tFrom);
        for (let k = 1; k <= 24; k++) { const t = ta + (tTo - ta) * k / 24; path.push([t, ps(t), 1]); }
        return ps(tTo);
      }
      function compute() {
        const r = (V.pg * 1e5 + PATM) / PATM, pw0 = V.rh / 100 * ps(V.t0);
        const pdp = dewOf(pw0 * r), tdis = Math.min(TMAX, Math.max(90, pdp + 5));
        const pw1 = Math.min(pw0 * r, ps(tdis));
        const path = [[V.t0, pw0, 0], [tdis, pw1, 0]], idx = [0, 1];
        const pw2 = move(tdis, pw1, V.tac, path); idx.push(path.length - 1);
        let pw3 = pw2, t3 = V.tac;
        if (V.dry === 'ref') { pw3 = move(V.tac, pw2, 3, path); t3 = 3; }
        else if (V.dry === 'des') { pw3 = Math.min(pw2, ps(-40)); path.push([V.tac, pw3, 2]); }
        idx.push(path.length - 1);
        const pw4 = move(t3, pw3, V.t0, path); idx.push(path.length - 1);
        const g = dpw => dpw / r / (RW * (V.t0 + 273.15)) * 1000;          // g per m³ of free air at intake conditions
        return { r, pw0, pdp, tdis, pw1, pw2, pw3, pw4, path, idx, wc: g(pw0 * r - pw1), wa: g(pw1 - pw2), wd: g(pw2 - pw3), wp: g(pw3 - pw4) };
      }
      const loop = kit.loop((dt) => {
        const m = compute(), perH = gm => gm * V.fad * 60 / 1000;      // g/m³ → kg/h (about L/h)
        ro.set('in', dewOf(m.pw0).toFixed(1) + ' °C · ' + (m.pw0 / (RW * (V.t0 + 273.15)) * 1000).toFixed(1) + ' g/m³');
        ro.set('pdp', m.pdp.toFixed(1) + ' °C at ' + (m.r * PATM / 1e5).toFixed(2) + ' bar abs' + (m.wc > 0 ? ' (some condenses in the compressor)' : ''));
        ro.set('ac', (m.wa + m.wc).toFixed(1) + ' g/m³ · ' + perH(m.wa + m.wc).toFixed(1) + ' L/h');
        ro.set('dr', V.dry === 'none' ? 'no dryer' : m.wd.toFixed(1) + ' g/m³ · ' + perH(m.wd).toFixed(1) + ' L/h');
        ro.set('pp', m.wp > 0.005 ? m.wp.toFixed(2) + ' g/m³ · ' + perH(m.wp).toFixed(2) + ' L/h — undrained!' : 'none');
        ro.set('out', dewOf(m.pw4).toFixed(1) + ' °C / ' + dewOf(m.pw4 / m.r).toFixed(1) + ' °C');
        ro.set('rh', (m.pw4 / ps(V.t0) * 100).toFixed(0) + ' %');

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 390);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        // region above the saturation curve
        c.fillStyle = kit.hue(205, 0.12);
        c.beginPath(); c.moveTo(XL, YT);
        for (let t = TMIN; t <= TMAX; t += 1) c.lineTo(X(t), Math.max(YT, Y(ps(t))));
        c.lineTo(XR, YT); c.closePath(); c.fill();
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let t = -40; t <= 100; t += 20) { c.beginPath(); c.moveTo(X(t), YT); c.lineTo(X(t), YB); c.stroke(); kit.label(c, (t < 0 ? '−' + (-t) : String(t)), X(t), YB + 13, { align: 'center', size: 10.5, color: C.muted }); }
        for (const d of [0.1, 1, 10, 100, 1000]) { const y = Y(d * 100); c.beginPath(); c.moveTo(XL, y); c.lineTo(XR, y); c.stroke(); kit.label(c, String(d), XL - 6, y, { align: 'right', size: 10.5, color: C.muted }); }
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1.2; c.strokeRect(XL, YT, XR - XL, YB - YT);
        kit.label(c, 'temperature (°C)', XR, YB + 30, { align: 'right', size: 11.5, color: C.muted });
        c.save(); c.translate(18, YB); c.rotate(-Math.PI / 2); kit.label(c, 'water vapour partial pressure (hPa)', 0, 0, { size: 11.5, color: C.muted }); c.restore();
        // 50 % line and the saturation curve
        c.strokeStyle = C.faint || C.muted; c.setLineDash([4, 4]); c.lineWidth = 1; c.beginPath();
        for (let t = TMIN; t <= TMAX; t += 2) { const y = Y(0.5 * ps(t)); t === TMIN ? c.moveTo(X(t), y) : c.lineTo(X(t), y); }
        c.stroke(); c.setLineDash([]);
        kit.label(c, '50 %', X(-30), Y(0.5 * ps(-30)) + 10, { size: 10, color: C.muted });
        c.strokeStyle = kit.hue(205, 1); c.lineWidth = 2.5; c.beginPath();
        for (let t = TMIN; t <= TMAX; t += 1) { const y = Y(ps(t)); t === TMIN ? c.moveTo(X(t), y) : c.lineTo(X(t), y); }
        c.stroke();
        kit.label(c, 'saturation: 100 %', X(58), Y(ps(58)) + 14, { size: 11, color: kit.hue(205, 1), weight: 700 });
        kit.label(c, 'above the curve, water condenses', X(-42), Y(3e4), { size: 11, color: C.muted });
        // the path
        const pts = m.path.map(q => [X(q[0]), Y(q[1]), q[2]]);
        const cum = [0];
        for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
        for (let i = 1; i < pts.length; i++) {
          c.strokeStyle = pts[i][2] === 1 ? kit.hue(205, 1) : pts[i][2] === 2 ? C.ok : C.text;
          c.lineWidth = pts[i][2] ? 3.5 : 2; c.setLineDash(pts[i][2] === 2 ? [5, 4] : []);
          c.beginPath(); c.moveTo(pts[i - 1][0], pts[i - 1][1]); c.lineTo(pts[i][0], pts[i][1]); c.stroke();
        }
        c.setLineDash([]);
        m.idx.forEach((i, k) => {
          if (k > 0 && i === m.idx[k - 1]) return;
          const q = pts[i];
          kit.dot(c, q[0], q[1], 9, C.surface, C.text);
          kit.label(c, String(k), q[0], q[1] + 0.5, { align: 'center', size: 11, weight: 700 });
        });
        kit.label(c, 'PDP ' + m.pdp.toFixed(0) + ' °C', X(Math.min(m.pdp, TMAX - 8)) + 4, Y(m.pw1) - 14, { size: 11, color: C.muted });
        // the travelling sample and its drops
        const total = cum[cum.length - 1];
        if (s.m >= total) { s.hold += dt; if (s.hold > 1.5) { s.m = 0; s.hold = 0; } } else s.m = Math.min(total, s.m + 110 * dt);
        let i = 1;
        while (i < cum.length - 1 && cum[i] < s.m) i++;
        const f = cum[i] > cum[i - 1] ? (s.m - cum[i - 1]) / (cum[i] - cum[i - 1]) : 1;
        const px = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * clamp(f, 0, 1), py = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * clamp(f, 0, 1);
        if (pts[i][2] && s.m < total) { s.spawn += dt * 16; while (s.spawn >= 1 && s.drops.length < 160) { s.spawn -= 1; s.drops.push({ x: px + (Math.random() - 0.5) * 8, y: py, v: 0, k: pts[i][2] }); } }
        for (const d of s.drops) { d.v += 500 * dt; d.y += d.v * dt; }
        s.drops = s.drops.filter(d => d.y < YB - 3);
        for (const d of s.drops) kit.dot(c, d.x, d.y, 2.6, d.k === 2 ? C.ok : kit.hue(205, 0.9));
        kit.dot(c, px, py, 6, C.warn, C.text);
        // water collected
        const vals = [['separator', perH(m.wa + m.wc), kit.hue(205, 0.75)], ['dryer', perH(m.wd), C.ok], ['pipes', perH(m.wp), C.bad]];
        const vmax = Math.max(5, ...vals.map(v => v[1])) * 1.1;
        kit.label(c, 'Water collected', 665, 26, { align: 'center', size: 13, weight: 700 });
        vals.forEach((v, k) => {
          const x = 600 + k * 50, hgt = 230 * v[1] / vmax;
          c.fillStyle = v[2]; c.fillRect(x, 300 - hgt, 36, hgt);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x, 70, 36, 230);
          kit.label(c, v[1].toFixed(v[1] < 10 ? 1 : 0), x + 18, 300 - hgt - 10, { align: 'center', size: 11.5, weight: 700 });
          kit.label(c, v[0], x + 18, 314, { align: 'center', size: 10.5, color: k === 2 && v[1] > 0.005 ? C.bad : C.muted });
        });
        kit.label(c, 'L/h at ' + V.fad.toFixed(1) + ' m³/min', 665, 50, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, (perH(m.wa + m.wc + m.wd + m.wp) * 24).toFixed(0) + ' L a day', 665, 338, { align: 'center', size: 12, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ flow through a restriction */
  Hyper.sim('air-orifice-flow', {
    title: 'Flow through a restriction, until it chokes',
    blurb: `Air flows from a vessel at p₁ through a restriction into a vessel at p₂. The flow is computed by ISO 6358 from the restriction's sonic conductance C and critical pressure ratio b, and compared on the graph with an ideal nozzle of the same C (b = 0.528) and with the small-drop formula borrowed from liquids.

**Try this**
- Press *Sweep p₂ down*: the flow rises steeply at first, then flattens, and stops rising once p₂/p₁ falls below b — the flow is choked, and in the throat the air moves at the speed of sound.
- With the flow choked, lower p₂ further, even into vacuum: nothing changes. Now raise p₁ instead: the choked flow grows in proportion to the absolute upstream pressure.
- Follow the small-drop formula: good for the first few per cent of drop, far too high by the time the flow chokes.
- Set b to 0.528 to make the restriction an ideal nozzle, then lower it to 0.2, like a valve with long internal passages: the flow chokes later and its curve is flatter.
- Heat the upstream air: the same restriction passes a little less (the flow falls as 1/√T).`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.33, minH: 200 });
      const gd = document.createElement('div');
      gd.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gd);
      const plot = kit.plot(gd, { x: { label: 'downstream pressure p₂ (bar absolute)', min: 0 }, y: { label: 'flow (L/min ANR)', min: 0 }, legend: true }, 210);
      let sweep = -1, tPlot = 1;
      const ctl = kit.controls(box.side, [
        { id: 'p1', label: 'Upstream pressure p₁ (gauge)', min: 0.5, max: 10, step: 0.1, value: 6, unit: 'bar' },
        { id: 'p2', label: 'Downstream pressure p₂ (gauge)', min: -0.95, max: 10, step: 0.05, value: 5, unit: 'bar' },
        { id: 'C', label: 'Sonic conductance C', min: 0.1, max: 5, value: 1.2, unit: 'dm³/(s·bar)', log: true, sig: 2 },
        { id: 'b', label: 'Critical pressure ratio b', min: 0.1, max: 0.528, step: 0.002, value: 0.3 },
        { id: 'T1', label: 'Upstream temperature', min: -10, max: 80, step: 1, value: 20, unit: '°C' },
        { type: 'buttons', items: [{ id: 'sweep', label: 'Sweep p₂ down', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id) => {
        if (id === 'sweep') { sweep = 0; sw0 = Math.min(V.p2, V.p1); }
        if (id === 'stop') sweep = -1;
        tPlot = 1;
      });
      let sw0 = 6;
      const ro = kit.readout(box.side, [['r', 'Pressure ratio p₂/p₁ (absolute)'], ['q', 'Flow (ISO 6358)'], ['st', 'State'], ['qc', 'Choked flow at this p₁'], ['sh', 'Share of the choked flow'], ['v', 'Ideal nozzle: throat Mach number and speed'], ['S', 'Effective area (≈ 5 C)']]);
      const V = ctl.values, rnd = seeded(777);
      const parts = Array.from({ length: 70 }, () => ({ x: 232 + rnd() * 296, u: (rnd() * 2 - 1) * 0.85 }));
      const loop = kit.loop((dt) => {
        if (sweep >= 0) {
          sweep += dt;
          ctl.set('p2', +(sw0 - (sw0 + 0.95) * smooth(sweep / 8)).toFixed(3));
          if (sweep >= 8) sweep = -1;
          tPlot = 1;
        }
        const T1 = V.T1 + 273.15, p1 = V.p1 * 1e5 + PATM, p2 = Math.min(Math.max(V.p2 * 1e5 + PATM, 0.03 * PATM), p1), Cs = V.C * 1e-8;
        const r = p2 / p1, q = F.iso6358({ C: Cs, b: V.b, p1, p2, T1 }).qANR, qc = F.iso6358({ C: Cs, b: V.b, p1, p2: 0, T1 }).qANR;
        const choked = r <= V.b, share = qc > 0 ? q / qc : 0;
        const M = r <= RSTAR ? 1 : Math.sqrt(Math.max(0, 5 * (Math.pow(1 / r, (GAM - 1) / GAM) - 1)));
        const vt = M * Math.sqrt(GAM * RAIR * T1 / (1 + 0.2 * M * M));
        ro.set('r', r.toFixed(3) + (r >= 0.9995 ? ' — no pressure difference, no flow' : ''));
        ro.set('q', (q * 60000).toFixed(1) + ' L/min ANR = ' + (q * F.RHO_ANR * 1000).toFixed(2) + ' g/s');
        ro.set('st', r >= 0.9995 ? 'no flow' : choked ? 'choked: p₂/p₁ ≤ b, p₂ no longer matters' : 'subsonic: the flow still depends on p₂');
        ro.set('qc', (qc * 60000).toFixed(1) + ' L/min ANR');
        ro.set('sh', (share * 100).toFixed(1) + ' %');
        ro.set('v', 'Mach ' + M.toFixed(2) + ', ' + vt.toFixed(0) + ' m/s' + (M >= 1 ? ' (sonic)' : ''));
        const Smm = V.C / 0.1992;
        ro.set('S', Smm.toFixed(2) + ' mm², an ideal nozzle of Ø ' + Math.sqrt(4 * Smm / Math.PI).toFixed(2) + ' mm');

        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          const iso = [], noz = [], inc = [], ymax = qc * 60000 * 1.3;
          for (let i = 0; i <= 100; i++) {
            const pb = p1 * i / 100, rr = pb / p1;
            iso.push([pb / 1e5, F.iso6358({ C: Cs, b: V.b, p1, p2: pb, T1 }).qANR * 60000]);
            noz.push([pb / 1e5, qc * 60000 * (rr <= RSTAR ? 1 : svf(rr) / SVMAX)]);
            const qi = qc * 60000 * KI * Math.sqrt(Math.max(0, 1 - rr));
            if (qi <= ymax) inc.push([pb / 1e5, qi]);
          }
          plot.set({
            series: [{ pts: iso, label: 'this restriction (ISO 6358)' }, { pts: noz, label: 'ideal nozzle, same C', dash: [6, 4] }, { pts: inc, label: 'small-drop formula', dash: [2, 4] }],
            vlines: [{ x: V.b * p1 / 1e5, label: 'b·p₁' }], hlines: [{ y: qc * 60000, label: 'choked flow' }],
            marks: [{ x: p2 / 1e5, y: q * 60000 }],
            x: { label: 'downstream pressure p₂ (bar absolute)', min: 0, max: p1 / 1e5 }, y: { label: 'flow (L/min ANR)', min: 0, max: ymax }
          });
        }

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 250);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const ht = clamp(4 + 5 * Math.sqrt(V.C), 5, 17);
        const hw = x => x < 330 ? 20 : x < 380 ? 20 - (20 - ht) * smooth((x - 330) / 50) : x < 388 ? ht : 20;
        // vessels
        const vessel = (x, p, label) => {
          c.fillStyle = kit.hue(215, 0.06 + 0.34 * clamp(p / 11e5, 0, 1)); c.strokeStyle = C.text; c.lineWidth = 2.2;
          c.beginPath(); if (c.roundRect) c.roundRect(x, 30, 210, 190, 16); else c.rect(x, 30, 210, 190); c.fill(); c.stroke();
          kit.label(c, label, x + 105, 60, { align: 'center', size: 13, weight: 700 });
          kit.label(c, (p / 1e5).toFixed(2) + ' bar abs', x + 105, 86, { align: 'center', size: 14, weight: 700 });
          kit.label(c, ((p - PATM) / 1e5).toFixed(2) + ' bar gauge', x + 105, 106, { align: 'center', size: 12, color: C.muted });
        };
        vessel(20, p1, 'upstream p₁'); vessel(530, p2, 'downstream p₂');
        // the passage and its restriction
        const top = [], bot = [];
        for (let x = 230; x <= 530; x += 2) { top.push([x, 125 - hw(x)]); bot.push([x, 125 + hw(x)]); }
        c.fillStyle = kit.hue(215, 0.12);
        c.beginPath(); top.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); bot.slice().reverse().forEach(q => c.lineTo(q[0], q[1])); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        for (const line of [top, bot]) { c.beginPath(); line.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); }
        // air moving through: faster where the passage is narrow
        const base = 12 + 150 * q / Math.max(1e-12, Cs * (10e5 + PATM));
        c.fillStyle = S.col('air');
        for (const pp of parts) {
          pp.x += base * 20 / hw(pp.x) * dt * (pp.x > 388 && pp.x < 470 && choked ? 1.4 : 1);
          if (pp.x > 528) { pp.x = 232 + (pp.x - 528) % 30; pp.u = (rnd() * 2 - 1) * 0.85; }
          if (q > 0) { c.beginPath(); c.arc(pp.x, 125 + pp.u * hw(pp.x), 2.3, 0, Math.PI * 2); c.fill(); }
        }
        if (choked) {
          c.strokeStyle = C.warn; c.lineWidth = 1.5;
          for (let k = 0; k < 3; k++) {
            const x = 396 + k * 26, hh = ht * (1 - k * 0.2);
            c.beginPath(); c.moveTo(x, 125); c.lineTo(x + 12, 125 - hh); c.lineTo(x + 24, 125); c.lineTo(x + 12, 125 + hh); c.closePath(); c.stroke();
          }
        }
        kit.label(c, choked ? 'choked: sonic in the throat' : q > 0 ? 'subsonic' : 'no flow', 384, 170, { align: 'center', size: 12.5, weight: 700, color: choked ? C.warn : C.text });
        kit.label(c, (q * 60000).toFixed(0) + ' L/min ANR', 384, 192, { align: 'center', size: 12.5 });
        kit.label(c, 'p₂/p₁ = ' + r.toFixed(3) + '   b = ' + V.b.toFixed(3), 384, 212, { align: 'center', size: 11.5, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ air as a mixture */
  Hyper.sim('air-mixture', {
    title: 'Air as a mixture: partial pressures',
    blurb: `A box of air drawn as its molecules — nitrogen, oxygen, argon and water vapour in their true proportions, about 400 of them. Squeeze it with the piston at constant temperature and every partial pressure rises in proportion (Dalton's law). The bars show the partial pressures: the dry gases in bar, the water vapour in hPa against its ceiling, the saturation pressure at the box temperature.

**Try this**
- Squeeze from 1 to 8 bar: nitrogen goes from 0.77 to 6.2 bar, oxygen from 0.21 to 1.7 bar — every share stays the same.
- Watch the water vapour bar: it rises with the others until it reaches the saturation line, then stops. From there on every squeeze turns vapour into droplets on the floor.
- Lower the temperature: the ceiling drops and water condenses at a lower pressure. Raise the humidity: it condenses sooner.
- Let the box expand again: the droplets evaporate, because the vapour is below saturation once more.
- Look at the speeds: light water molecules move fastest and heavy argon slowest — at one temperature every kind has the same average kinetic energy.`,
    mount(box, kit) {
      const F = kit.fluid, ps = F.magnus;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Squeeze to (absolute pressure)', min: 1, max: 10, step: 0.1, value: 1, unit: 'bar' },
        { id: 'T', label: 'Temperature of the box', min: -10, max: 60, step: 1, value: 20, unit: '°C' },
        { id: 'rh', label: 'Relative humidity of the air let in', min: 0, max: 100, step: 1, value: 65, unit: '%' },
        { type: 'buttons', items: [{ id: 'sq', label: 'Squeeze to 8 bar', primary: true }, { id: 'back', label: 'Back to 1 bar' }] }
      ], (id) => { if (id === 'sq') ctl.set('p', 8); if (id === 'back') ctl.set('p', 1); });
      const ro = kit.readout(box.side, [['p', 'Total pressure: absolute / gauge'], ['dry', 'Nitrogen / oxygen / argon'], ['w', 'Water vapour: partial / saturation'], ['rh', 'Relative humidity in the box'], ['dp', 'Dew point in the box'], ['c', 'Condensed, per m³ of air let in']]);
      const V = ctl.values, rnd = seeded(4242);
      const KINDS = [{ n: 'N₂', M: 28.0, frac: 0.781, hue: 220, r: 2.3 }, { n: 'O₂', M: 32.0, frac: 0.2095, hue: 0, r: 2.3 }, { n: 'Ar', M: 39.9, frac: 0.0095, hue: 285, r: 2.6 }, { n: 'H₂O', M: 18.0, frac: 0, hue: 185, r: 3 }];
      const NDRY = 390, NWMAX = 110, X0 = 30, Y0 = 40, BH = 230, W0 = 380;
      const counts = [0, 0, 0]; counts[2] = Math.round(KINDS[2].frac * NDRY); counts[1] = Math.round(KINDS[1].frac * NDRY); counts[0] = NDRY - counts[1] - counts[2];
      const parts = [];
      const add = k => { const a = rnd() * Math.PI * 2; parts.push({ k, x: rnd() * (W0 - 8) + 4, y: rnd() * (BH - 8) + 4, vx: Math.cos(a), vy: Math.sin(a), sp: 0.5 + rnd() }); };
      for (let k = 0; k < 3; k++) for (let i = 0; i < counts[k]; i++) add(k);
      for (let i = 0; i < NWMAX; i++) add(3);
      let pc = V.p;
      const loop = kit.loop((dt) => {
        pc += (V.p - pc) * (dt ? Math.min(1, dt * 3) : 1);
        const T = V.T + 273.15, psat = ps(V.T), yw0 = clamp(V.rh / 100 * psat / 1e5, 0, 0.5);
        const nW0 = Math.min(NWMAX, Math.round(yw0 / (1 - yw0) * NDRY));
        const pNo = yw0 * pc * 1e5, pw = Math.min(pNo, psat), yw = pw / (pc * 1e5);
        const nWg = Math.min(nW0, Math.round(yw / (1 - yw) * NDRY)), nC = nW0 - nWg;
        const pdry = pc * 1e5 - pw;
        const cond = Math.max(0, yw0 * 1e5 - pw / pc) / (RW * T) * 1000;
        ro.set('p', pc.toFixed(2) + ' bar / ' + (pc - PATM / 1e5).toFixed(2) + ' bar');
        ro.set('dry', (KINDS[0].frac * pdry / 1e5).toFixed(3) + ' / ' + (KINDS[1].frac * pdry / 1e5).toFixed(3) + ' / ' + (KINDS[2].frac * pdry / 1e5).toFixed(4) + ' bar');
        ro.set('w', (pw / 100).toFixed(1) + ' hPa / ' + (psat / 100).toFixed(1) + ' hPa');
        ro.set('rh', (pw / psat * 100).toFixed(0) + ' %' + (pNo > psat ? ' (saturated)' : ''));
        ro.set('dp', pw > 0 ? dewOf(pw).toFixed(1) + ' °C' : 'no water vapour');
        ro.set('c', cond.toFixed(2) + ' g (' + nC + ' of ' + nW0 + ' water molecules drawn as droplets)');

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 320);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const w = W0 / clamp(pc, 1, 10);
        c.fillStyle = kit.hue(215, 0.05 + 0.03 * pc); c.fillRect(X0, Y0, w, BH);
        // molecules
        let wi = 0, di = 0;
        for (const q of parts) {
          let show = true;
          if (q.k === 3) { show = wi < nW0; const drop = wi < nC; wi++; if (show && drop) { const perRow = Math.max(1, Math.floor((w - 8) / 8)); kit.dot(c, X0 + 6 + (di % perRow) * 8, Y0 + BH - 5 - Math.floor(di / perRow) * 7, 3.2, kit.hue(200, 0.95)); di++; continue; } }
          if (!show) continue;
          const K = KINDS[q.k], sp = 55 * Math.sqrt(T / 293.15 * 29 / K.M) * q.sp;
          q.x += q.vx * sp * dt; q.y += q.vy * sp * dt;
          if (q.x < 3) { q.x = 3; q.vx = Math.abs(q.vx); }
          if (q.x > w - 3) { q.x = Math.max(3, w - 3 - (q.x - w) % 5); q.vx = -Math.abs(q.vx); }
          if (q.y < 3) { q.y = 3; q.vy = Math.abs(q.vy); }
          if (q.y > BH - 3) { q.y = BH - 3; q.vy = -Math.abs(q.vy); }
          kit.dot(c, X0 + q.x, Y0 + q.y, K.r, kit.hue(K.hue, 0.9), q.k === 3 ? C.text : null);
        }
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(X0 + W0 + 20, Y0); c.lineTo(X0, Y0); c.lineTo(X0, Y0 + BH); c.lineTo(X0 + W0 + 20, Y0 + BH); c.stroke();
        c.fillStyle = C.surface; c.lineWidth = 2; c.fillRect(X0 + w, Y0 + 2, 14, BH - 4); c.strokeRect(X0 + w, Y0 + 2, 14, BH - 4);
        c.fillRect(X0 + w + 14, Y0 + BH / 2 - 5, 420 - w, 10); c.strokeRect(X0 + w + 14, Y0 + BH / 2 - 5, 420 - w, 10);
        kit.label(c, pc.toFixed(2) + ' bar absolute at ' + V.T.toFixed(0) + ' °C', X0, 22, { size: 14, weight: 700 });
        KINDS.forEach((K, k) => { kit.dot(c, X0 + 8 + k * 90, 294, K.r + 1, kit.hue(K.hue, 0.9), k === 3 ? C.text : null); kit.label(c, K.n, X0 + 16 + k * 90, 294, { size: 12 }); });
        kit.dot(c, X0 + 8 + 4 * 90, 294, 3.2, kit.hue(200, 0.95)); kit.label(c, 'droplet', X0 + 16 + 4 * 90, 294, { size: 12 });
        // bars: dry gases (bar) and water vapour (hPa)
        const BB = 260, BT = 70, bh = BB - BT;
        kit.label(c, 'Partial pressures', 470, 26, { size: 13, weight: 700 });
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let v = 0; v <= 8; v += 2) { const y = BB - bh * v / 8; c.beginPath(); c.moveTo(478, y); c.lineTo(640, y); c.stroke(); kit.label(c, String(v), 472, y, { align: 'right', size: 10, color: C.muted }); }
        kit.label(c, 'bar', 472, BT - 14, { align: 'right', size: 10, color: C.muted });
        for (let k = 0; k < 3; k++) {
          const v = KINDS[k].frac * pdry / 1e5, x = 492 + k * 50, hh = bh * clamp(v / 8, 0, 1.05);
          c.fillStyle = kit.hue(KINDS[k].hue, 0.75); c.fillRect(x, BB - hh, 34, hh);
          kit.label(c, v < 0.1 ? v.toFixed(3) : v.toFixed(2), x + 17, BB - hh - 9, { align: 'center', size: 11, weight: 700 });
          kit.label(c, KINDS[k].n, x + 17, BB + 13, { align: 'center', size: 12 });
        }
        const wmax = Math.max(psat * 1.3, pNo * 1.08, 1) / 100, xw = 680;
        const yOf = hPa => BB - bh * clamp(hPa / wmax, 0, 1.05);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(xw, BT, 40, bh);
        if (pNo > pw * 1.001) { c.setLineDash([4, 3]); c.strokeStyle = kit.hue(185, 1); c.strokeRect(xw + 2, yOf(pNo / 100), 36, BB - yOf(pNo / 100)); c.setLineDash([]); }
        c.fillStyle = kit.hue(185, 0.75); c.fillRect(xw + 2, yOf(pw / 100), 36, BB - yOf(pw / 100));
        c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([6, 3]);
        c.beginPath(); c.moveTo(xw - 8, yOf(psat / 100)); c.lineTo(xw + 48, yOf(psat / 100)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'saturation', xw + 20, yOf(psat / 100) - 10, { align: 'center', size: 10.5, color: C.bad });
        kit.label(c, (pw / 100).toFixed(1) + ' hPa', xw + 20, BB + 13, { align: 'center', size: 11, weight: 700 });
        kit.label(c, 'H₂O', xw + 20, BB + 28, { align: 'center', size: 12 });
        if (pNo > pw * 1.001) kit.label(c, 'without condensing: ' + (pNo / 100).toFixed(0) + ' hPa', 752, BT - 12, { align: 'right', size: 10, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ where the energy goes */
  Hyper.sim('air-energy-chain', {
    title: 'Where the energy goes',
    blurb: `Follow 100 kWh of electricity from the compressor's motor to the useful work a cylinder does on its load. Each step is thermodynamics from these pages: the delivered air is worth at most its isothermal work of compression (its exergy); leaks lose some of it; pressure drops lower its worth; a cylinder that exhausts its air without letting it expand wastes the rest of the expansion work; and spare force ends up as heat in friction and cushions. The compressor's specific power is given at 7 bar gauge and scaled with the pressure it must reach.

**Try this**
- With the defaults, only about a tenth of the electricity reaches the load. Which single step loses the most?
- Halve the leaks, then halve the pressure drop in the network: count the kilowatt-hours saved.
- Lower the working pressure from 6 to 4 bar: the cylinder must be bigger for the same force, but less is thrown away at every exhaust.
- Choose a very efficient compressor (5 kW per m³/min): the first loss shrinks, the losses after it stay.
- Turn on heat recovery: most of the electricity can come back as warm air or hot water.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'pu', label: 'Working pressure at the machine (gauge)', min: 2, max: 10, step: 0.5, value: 6, unit: 'bar' },
        { id: 'dp', label: 'Pressure drop, compressor to machine', min: 0, max: 2, step: 0.1, value: 0.7, unit: 'bar' },
        { id: 'leak', label: 'Share of the air lost to leaks', min: 0, max: 50, step: 1, value: 25, unit: '%' },
        { id: 'sp', label: 'Compressor specific power at 7 bar gauge', min: 5, max: 10, step: 0.1, value: 6.5, unit: 'kW per m³/min' },
        { id: 'lr', label: 'Load ratio (load force ÷ cylinder force)', min: 20, max: 100, step: 1, value: 70, unit: '%' },
        { id: 'hr', label: 'Compressor heat recovered', min: 0, max: 90, step: 1, value: 0, unit: '%' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['eta', 'End-to-end efficiency'], ['kwh', 'Electricity per kWh of useful work'], ['cost', 'Cost per kWh of useful work'], ['e', 'Electricity per m³ of free air'], ['min', 'Least possible (isothermal) per m³'], ['heat', 'Heat recovered per 100 kWh']]);
      const V = ctl.values, p0 = PATM, L7 = Math.log((7e5 + PATM) / PATM);
      const loop = kit.loop(() => {
        const pu = V.pu * 1e5, pc = pu + V.dp * 1e5, Lc = Math.log((pc + p0) / p0), Lu = Math.log((pu + p0) / p0);
        const eEl = V.sp * 60e3 * Lc / L7;                               // J of electricity per m³ of free air
        const xC = 100 * p0 * Lc / eEl;                                  // exergy of the delivered air, per 100 kWh
        const xL = xC * (1 - V.leak / 100), xU = xL * Lu / Lc;
        const wC = xU * pu / ((pu + p0) * Lu), useful = wC * V.lr / 100;
        const steps = [['Electricity', 100, 0], ['Compressor heat', 100, xC], ['Leaks', xC, xL], ['Pressure drop', xL, xU], ['Exhaust, not expanded', xU, wC], ['Spare force', wC, useful], ['Useful work', useful, 0]];
        ro.set('eta', useful.toFixed(1) + ' %');
        ro.set('kwh', useful > 0 ? (100 / useful).toFixed(1) + ' kWh' : '—');
        ro.set('cost', useful > 0 ? kit.money(V.price * 100 / useful, 2) : '—');
        ro.set('e', (eEl / 3.6e6).toFixed(3) + ' kWh/m³ at ' + (pc / 1e5).toFixed(1) + ' bar at the compressor');
        ro.set('min', (p0 * Lc / 3.6e6).toFixed(3) + ' kWh/m³');
        ro.set('heat', (V.hr).toFixed(0) + ' kWh');

        const c = st.begin(), C = kit.colors(), fr = frame(st, 760, 360);
        c.save(); c.translate(fr.ox, fr.oy); c.scale(fr.k, fr.k);
        const B = 300, Tp = 40, Y = v => B - (B - Tp) * v / 100, W = 62, G = 22, x0 = 40;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let v = 0; v <= 100; v += 20) { c.beginPath(); c.moveTo(x0 - 6, Y(v)); c.lineTo(740, Y(v)); c.stroke(); kit.label(c, String(v), x0 - 10, Y(v), { align: 'right', size: 10, color: C.muted }); }
        steps.forEach((sp, i) => {
          const x = x0 + i * (W + G), a = sp[1], b = sp[2];
          const first = i === 0, last = i === steps.length - 1;
          const col = first ? C.accent : last ? C.ok : i % 2 ? C.bad : C.warn;
          const yt = Y(Math.max(a, b)), yb = first || last ? B : Y(Math.min(a, b));
          c.fillStyle = col; c.globalAlpha = first || last ? 0.85 : 0.7; c.fillRect(x, yt, W, Math.max(1, yb - yt)); c.globalAlpha = 1;
          const val = first || last ? a : a - b;
          kit.label(c, val.toFixed(1), x + W / 2, yt - 10, { align: 'center', size: 12, weight: 700 });
          const words = sp[0].split(' ');
          const l1 = words.length > 2 ? words.slice(0, 1).join(' ') : words[0], l2 = words.length > 2 ? words.slice(1).join(' ') : words.slice(1).join(' ');
          kit.label(c, l1, x + W / 2, B + 14, { align: 'center', size: 10.5, color: C.text });
          if (l2) kit.label(c, l2, x + W / 2, B + 28, { align: 'center', size: 10.5, color: C.text });
          if (!last) {
            const lvl = first ? a : b;
            c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x + W, Y(lvl)); c.lineTo(x + W + G, Y(lvl)); c.stroke(); c.setLineDash([]);
          }
        });
        // recovered heat, beside the chain
        const xh = x0 + steps.length * (W + G) - 6;
        if (V.hr > 0) {
          c.fillStyle = C.ok; c.globalAlpha = 0.3; c.fillRect(xh, Y(V.hr), W - 10, B - Y(V.hr)); c.globalAlpha = 1;
          c.strokeStyle = C.ok; c.lineWidth = 1.5; c.strokeRect(xh, Y(V.hr), W - 10, B - Y(V.hr));
          kit.label(c, V.hr.toFixed(0), xh + (W - 10) / 2, Y(V.hr) - 10, { align: 'center', size: 12, weight: 700, color: C.ok });
        }
        kit.label(c, 'reused', xh + (W - 10) / 2, B + 14, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'as heat', xh + (W - 10) / 2, B + 28, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'kWh, out of 100 kWh of electricity', x0 - 30, 16, { size: 12, color: C.muted });
        c.restore();
      }, box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
