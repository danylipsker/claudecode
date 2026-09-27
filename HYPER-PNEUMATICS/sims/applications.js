/* HYPER-PNEUMATICS · sims/applications.js — Applications
 *   app-truck-brake   a truck's service brake and spring brake: compressor, reservoir, treadle and parking valves,
 *                     a piggy-back brake chamber (F = p·A, F = Fs − p·A) and an S-cam drum brake; lose the air and the
 *                     spring applies the brake
 *   app-train-brake   a train's automatic air brake: the brake-pipe reduction travels down the train and each car's
 *                     triple valve applies, laps and releases (p_c = (Va/Vc)·Δp)
 *   app-tyre          tyre pressure, load and temperature: contact patch ≈ F/p, flattening, Gay-Lussac in absolute terms
 *   app-air-tools     a workshop's air tools: average and peak demand, compressor, receiver and what the air costs
 *   app-conveying     a dilute-phase conveying line: pickup velocity, saltation, blockage and pressure drop
 *   app-soft-finger   a soft pneumatic gripper: two chambered fingers bending, touching and squeezing a soft object
 * Air volumes are isothermal and valve flows follow ISO 6358 (kit.fluid.iso6358); dynamics use fixed sub-steps.
 */
(function () {
  'use strict';
  const PATM = 1.013e5, RT = 287.058 * 293.15, RHO_ANR = 1.185, G = 9.81;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = (v, d) => (Number.isFinite(v) ? v : (d || 0));
  const psi = pa => pa / 6894.76;

  // ISO 6358 mass flow (kg/s) from pa to pb (absolute Pa) through a sonic conductance in dm³/(s·bar); negative when reversed
  function mflow(F, Cdm, pa, pb, b) {
    if (!(Cdm > 0)) return 0;
    const C = Cdm * 1e-8, bb = b == null ? 0.3 : b;
    return pa >= pb ? F.iso6358({ C, b: bb, p1: pa, p2: pb }).mdot : -F.iso6358({ C, b: bb, p1: pb, p2: pa }).mdot;
  }
  // mass moved in one step from a volume at pa (Va) to one at pb (Vb; Infinity for the atmosphere),
  // capped so that one step can never overshoot equal pressures
  function moved(F, Cdm, pa, Va, pb, Vb, dt) {
    const m = mflow(F, Cdm, pa, pb) * dt;
    const Veq = Vb === Infinity ? Va : Va * Vb / (Va + Vb);
    const cap = Math.abs(pa - pb) * Veq / RT;
    return Math.sign(m) * Math.min(Math.abs(m), cap);
  }
  // an air receiver in the manner of ISO 1219: a horizontal vessel with rounded ends
  function receiver(c, C, x, y, w, h, fill) {
    const r = h / 2;
    c.beginPath();
    c.moveTo(x - w / 2 + r, y - r); c.lineTo(x + w / 2 - r, y - r);
    c.arc(x + w / 2 - r, y, r, -Math.PI / 2, Math.PI / 2);
    c.lineTo(x - w / 2 + r, y + r);
    c.arc(x - w / 2 + r, y, r, Math.PI / 2, 3 * Math.PI / 2);
    c.closePath();
    if (fill) { c.fillStyle = fill; c.fill(); }
    c.strokeStyle = C.text; c.lineWidth = 1.8; c.setLineDash([]); c.stroke();
  }
  // the blue of compressed air, deeper with pressure (null when nearly empty)
  const airTint = (C, pg, pmax) => pg > 0.12e5 ? (C.dark ? 'rgba(79,141,255,' : 'rgba(29,78,216,') + Math.min(0.5, 0.08 + 0.42 * pg / pmax).toFixed(3) + ')' : null;
  const S_air = C => C.dark ? 'rgba(79,141,255,.55)' : 'rgba(29,78,216,.4)';
  const lamp = (kit, c, C, x, y, on, col, text) => {
    kit.dot(c, x, y, 6.5, on ? col : C.bg2, on ? col : C.faint);
    kit.label(c, text, x + 11, y, { size: 11, color: on ? C.text : C.muted, weight: on ? 700 : 500 });
  };

  /* ------------------------------------------------------------------ truck service and spring brake */
  const CHAMBER = { 16: 103, 20: 129, 24: 155, 30: 194 };        // effective area, cm²
  const TREADLE = { top: [['A', 0.3]], bottom: [['P', 0.3], ['R', 0.7]], boxes: [['P>A', 'R|'], ['P|', 'A|', 'R|'], ['A>R', 'P|']], normal: 2 };

  Hyper.sim('app-truck-brake', {
    title: 'Truck air brakes: service brake and spring brake',
    blurb: `One drive-axle brake of a truck. An engine-driven compressor with a governor (cut-out 8.5 bar, cut-in 7.2 bar) charges a 40 L reservoir. The **treadle valve** is a graduating valve: it fills the service chamber until the chamber pressure matches the pedal travel, then laps (its middle box), and exhausts when the pedal is let up. The **parking valve** feeds the **spring chamber** behind it, where air holds a strong spring back. The pushrod turns the S-cam through a 150 mm slack adjuster and spreads the shoes against the drum. Air volumes are isothermal, valve flows follow ISO 6358, and a hole of *d* mm is taken as a sonic conductance of about 0.13 *d*² dm³/(s·bar).

**Try this**
- Press the pedal to 50 %: the chamber fills in a few tenths of a second (through a relay valve at the axle, which the drawing leaves out) and the valve laps. Check the service force against p·A.
- Switch the engine off and fan the pedal up and down: every release exhausts a chamberful of air, and the reservoir falls.
- Pull the parking knob: the spring chamber exhausts and the spring applies the brake with no air at all.
- Burst the supply line: as the reservoir empties, the spring brake starts to drag below Fs/A and then applies fully, and the knob pops out near 2.8 bar. Try to push it in again.
- With the brake parked, press the pedal: a real truck has an anti-compounding valve so that service and spring forces never add and overload the brake; the model takes the larger of the two.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gdiv = document.createElement('div');
      gdiv.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gdiv);
      const VRES = 0.040, SC = 35, SMAX = 62, ARM = 0.15, FRET = 400;   // m³; free stroke to the shoes and full stroke, mm; slack adjuster, m; return spring, N
      const s = { park: false, burst: false, loaded: false, msg: '', t: 0, x: 0, xk: 0, vs: 2, vp: 0, hist: [], tPlot: 1, ph: {}, q: {} };
      let pRes = 8e5 + PATM, pSvc = PATM, pSpr = 8e5 + PATM;
      const ctl = kit.controls(box.side, [
        { id: 'pedal', label: 'Brake pedal travel', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'drive', label: 'Knob in (drive)' }, { id: 'park', label: 'Pull knob (park)' }] },
        { type: 'buttons', items: [{ id: 'burst', label: 'Burst the supply line' }, { id: 'fix', label: 'Repair' }] },
        { id: 'leak', label: 'Leak from the reservoir, hole of', min: 0, max: 3, step: 0.1, value: 0, unit: 'mm' },
        { id: 'engine', type: 'check', label: 'Engine running (compressor)', value: true },
        { id: 'type', type: 'select', label: 'Chamber size', options: [['Type 16 (103 cm²)', 16], ['Type 20 (129 cm²)', 20], ['Type 24 (155 cm²)', 24], ['Type 30 (194 cm²)', 30]], value: 30 },
        { id: 'fs', label: 'Spring force at the applied position', min: 5, max: 14, step: 0.1, value: 9, unit: 'kN' }
      ], (id) => {
        if (id === 'drive') {
          if (pRes - PATM < 2.8e5) s.msg = 'Too little air: the knob will not stay in below about 2.8 bar.';
          else { s.park = false; s.msg = ''; }
        }
        if (id === 'park') { s.park = true; s.msg = ''; }
        if (id === 'burst') s.burst = true;
        if (id === 'fix') { s.burst = false; ctl.set('leak', 0); s.msg = ''; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['res', 'Reservoir (gauge)'], ['svc', 'Service chamber: F = p·A'], ['spr', 'Spring chamber: F = Fs − p·A'], ['rel', 'Spring fully held off above Fs/A'], ['rod', 'Pushrod force, stroke'], ['cam', 'Torque on the S-cam'], ['state', 'State']]);
      const plot = kit.plot(gdiv, { x: { label: 'time (s)' }, y: { label: 'gauge pressure (bar)', min: 0, max: 10 }, legend: true }, 140);
      const V = ctl.values;
      const area = () => CHAMBER[V.type] * 1e-4;

      function step(h) {
        const A = area(), Vc = A * 0.065 + 3e-4;
        // compressor and governor
        const gRes = pRes - PATM;
        if (gRes >= 8.5e5) s.loaded = false; else if (gRes <= 7.2e5) s.loaded = true;
        const mComp = V.engine && s.loaded ? 450 / 60000 * RHO_ANR : 0;
        pRes += mComp * h * RT / VRES;
        // leaks: a burst line is an 8 mm hole
        const d = s.burst ? 8 : V.leak;
        const mLeak = d > 0 ? moved(F, 0.13 * d * d, pRes, VRES, PATM, Infinity, h) : 0;
        pRes -= mLeak * RT / VRES;
        // treadle valve: the delivered pressure follows the pedal (full travel = 8.5 bar)
        const err = V.pedal / 100 * 8.5e5 - (pSvc - PATM);
        let mIn = 0, mOut = 0;
        // (the relay valve at the axle fills the chamber, the quick-release valve dumps it)
        if (err > 0.02e5) mIn = moved(F, 2.5 * clamp(err / 0.12e5, 0, 1), pRes, VRES, pSvc, Vc, h);
        else if (err < -0.02e5) mOut = moved(F, 3 * clamp(-err / 0.12e5, 0, 1), pSvc, Vc, PATM, Infinity, h);
        pRes -= mIn * RT / VRES; pSvc += (mIn - mOut) * RT / Vc;
        // parking valve: drive connects the spring chamber with the reservoir, park exhausts it
        if (!s.park && pRes - PATM < 2.8e5) { s.park = true; s.msg = 'The parking knob popped out at low pressure: the springs hold the brake on.'; }
        let mP = 0, mPx = 0;
        if (!s.park) mP = moved(F, 0.8, pRes, VRES, pSpr, Vc, h);
        else mPx = moved(F, 1.5, pSpr, Vc, PATM, Infinity, h);
        pRes -= mP * RT / VRES; pSpr += (mP - mPx) * RT / Vc;
        pRes = Math.max(PATM, pRes); pSvc = Math.max(PATM, pSvc); pSpr = Math.max(PATM, pSpr);
        // forces and the pushrod
        const Fsvc = Math.max(0, (pSvc - PATM) * A - FRET), Fspr = Math.max(0, V.fs * 1000 - (pSpr - PATM) * A), Frod = Math.max(Fsvc, Fspr);
        const xt = Frod > 0 ? Math.min(SMAX, SC + 22 * Frod / 15000) : 0;
        s.x += clamp(xt - s.x, -250 * h, 250 * h);
        s.xk += clamp((Fspr > 0 ? s.x : 0) - s.xk, -250 * h, 250 * h);
        s.vs += clamp((mIn > 0 ? 0 : mOut > 0 ? 2 : 1) - s.vs, -h / 0.04, h / 0.04);
        s.vp += clamp((s.park ? 1 : 0) - s.vp, -h / 0.06, h / 0.06);
        s.q = { comp: mComp, leak: mLeak, svc: mIn - mOut, spr: mP - mPx };
        s.t += h;
      }

      const loop = kit.loop((dt) => {
        const n = Math.ceil(dt / 0.002);
        for (let i = 0; i < n; i++) step(dt / n);
        const A = area(), C = kit.colors();
        const gRes = pRes - PATM, gSvc = pSvc - PATM, gSpr = pSpr - PATM;
        const Fsvc = Math.max(0, gSvc * A - FRET), FsprNet = V.fs * 1000 - gSpr * A, Fspr = Math.max(0, FsprNet), Frod = Math.max(Fsvc, Fspr);
        const bar = p => (p / 1e5).toFixed(2) + ' bar';
        ro.set('res', bar(gRes) + ' (' + psi(gRes).toFixed(0) + ' psi)' + (s.loaded && V.engine ? ', charging' : ''));
        ro.set('svc', bar(gSvc) + ' → ' + (Fsvc / 1000).toFixed(2) + ' kN');
        ro.set('spr', bar(gSpr) + ' → ' + (FsprNet > 0 ? (FsprNet / 1000).toFixed(2) + ' kN applied' : 'released (' + (FsprNet / 1000).toFixed(1).replace('-', '−') + ' kN)'));
        ro.set('rel', (V.fs * 1000 / A / 1e5).toFixed(2) + ' bar');
        ro.set('rod', (Frod / 1000).toFixed(2) + ' kN, ' + s.x.toFixed(0) + ' mm');
        ro.set('cam', (Frod * ARM).toFixed(0) + ' N·m');
        const state = s.msg || (Fspr > 50 ? (s.park ? 'Parked: spring brake applied' : 'Spring brake applied by loss of air (fail-safe)') : Fsvc > 0 ? 'Service brake applied' : 'Brakes released');
        ro.set('state', state);
        // history and plot
        s.tPlot += dt;
        if (s.tPlot > 0.1) {
          s.tPlot = 0;
          s.hist.push([s.t, gRes / 1e5, gSvc / 1e5, gSpr / 1e5]);
          while (s.hist.length && s.hist[0][0] < s.t - 30) s.hist.shift();
          plot.set({ series: [{ pts: s.hist.map(q => [q[0], q[1]]), label: 'reservoir' }, { pts: s.hist.map(q => [q[0], q[2]]), label: 'service chamber' }, { pts: s.hist.map(q => [q[0], q[3]]), label: 'spring chamber', dash: [5, 4] }], x: { label: 'time (s)', min: Math.max(0, s.t - 30), max: Math.max(30, s.t) }, hlines: [{ y: 5.5, label: 'low-air warning' }] });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        // forces panel
        kit.label(c, 'Force on the pushrod', 20, 24, { weight: 700, size: 13 });
        const rows = [['service  p·A', Fsvc, S.col('air')], ['spring  Fs − p·A', FsprNet, C.warn], ['pushrod', Frod, C.bad]];
        rows.forEach((r, i) => {
          const y = 52 + i * 28, bx = 128, bw = 170;
          kit.label(c, r[0], 20, y, { size: 11.5, color: C.muted });
          c.fillStyle = C.surface; c.fillRect(bx, y - 8, bw, 16);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx, y - 8, bw, 16);
          if (r[1] > 0) { c.fillStyle = r[2]; c.fillRect(bx, y - 8, bw * Math.min(1, r[1] / 18000), 16); }
          kit.label(c, r[1] > 0 ? (r[1] / 1000).toFixed(1) + ' kN' : i === 1 ? 'held off by air' : '0', bx + bw + 6, y, { size: 11, color: C.text });
        });
        lamp(kit, c, C, 26, 148, gRes < 5.5e5, C.bad, 'LOW AIR');
        lamp(kit, c, C, 116, 148, Fspr > 50, C.warn, 'SPRING BRAKE');
        lamp(kit, c, C, 236, 148, Fsvc > 0, C.bad, 'STOP LAMPS');
        kit.label(c, state, 20, 180, { size: 12, weight: 700, color: Fspr > 50 ? C.warn : C.text });
        kit.label(c, 't = ' + s.t.toFixed(1) + ' s', 20, 204, { size: 11, color: C.muted });
        // lines, coloured by what they carry
        const main = [[240, 330], [275, 330], [275, 395], [539.8, 395], [539.8, 253]];
        const toPark = [[464.8, 395], [464.8, 353]];
        const svc = [[539.8, 207], [539.8, 185], [530, 185], [530, 160]];
        const spr = [[464.8, 307], [464.8, 290], [440, 290], [440, 178], [507, 178], [507, 160]];
        const svcState = gSvc > 0.1e5 ? (s.q.svc < -1e-6 ? 'exhaust' : 'air') : 'idle';
        const sprState = gSpr > 0.1e5 ? (s.q.spr < -1e-6 ? 'exhaust' : 'air') : 'idle';
        const resState = gRes > 0.1e5 ? 'air' : 'idle';
        S.line(c, [[72, 330], [82, 330]], { state: 'air' }); S.line(c, [[118, 330], [140, 330]], { state: resState });
        S.line(c, main, { state: resState }); S.line(c, toPark, { state: resState }); S.junction(c, 464.8, 395);
        S.line(c, [[190, 301], [190, 311]], { state: resState });
        S.line(c, svc, { state: svcState }); S.line(c, spr, { state: sprState });
        // flow dots
        const adv = (key, m, ref) => { s.ph[key] = (s.ph[key] || 0) + dt * 60 * Math.min(3, Math.abs(m) / ref); return s.ph[key]; };
        if (s.q.comp > 0) S.flow(c, [[72, 330], [140, 330]], adv('c', s.q.comp, 0.009), { color: S.col('air') });
        if (Math.abs(s.q.svc) > 1e-5) {
          if (s.q.svc > 0) S.flow(c, main.concat(svc), adv('s', s.q.svc, 0.01), { color: S.col('air') });
          else S.flow(c, svc.slice().reverse().concat([[550.2, 253], [550.2, 266]]), adv('s', s.q.svc, 0.01), { color: S.col('exhaust') });
        }
        if (Math.abs(s.q.spr) > 1e-5) {
          if (s.q.spr > 0) S.flow(c, main.slice(0, 3).concat([[464.8, 395]], toPark.slice(1), spr), adv('p', s.q.spr, 0.01), { color: S.col('air') });
          else S.flow(c, spr.slice().reverse().concat(s.park ? [[475.2, 353], [475.2, 366]] : [[464.8, 353], [464.8, 395], [275, 395], [275, 330], [240, 330]]), adv('p', s.q.spr, 0.01), { color: S.col(s.park ? 'exhaust' : 'air') });
        }
        const d = s.burst ? 8 : V.leak;
        if (d > 0) {
          S.line(c, [[175, 349], [175, 360]], { state: resState }); S.exhaust(c, 175, 360);
          if (s.q.leak > 1e-6) S.flow(c, [[175, 345], [175, 372]], adv('l', s.q.leak, 0.01), { color: S.col('exhaust') });
          kit.label(c, s.burst ? 'burst line' : 'leak ' + d.toFixed(1) + ' mm', 186, 368, { size: 11, color: C.bad, weight: 700 });
        }
        // compressor, check valve, reservoir, gauge
        S.compressor(c, 46, 330, { rot: 90, motor: true });
        kit.label(c, V.engine ? (s.loaded ? 'loaded' : 'unloaded') : 'engine off', 46, 370, { size: 10.5, color: C.muted, align: 'center' });
        S.check(c, 100, 330, { rot: 90, open: s.q.comp > 0 });
        receiver(c, C, 190, 330, 100, 38, airTint(C, gRes, 9e5));
        kit.label(c, 'reservoir 40 L', 190, 330, { size: 11, color: C.text, align: 'center', weight: 600 });
        S.gauge(c, 190, 280, { frac: gRes / 12e5, value: (gRes / 1e5).toFixed(1) + ' bar' });
        // the two valves
        S.valve(c, 545, 230, { spec: TREADLE, state: s.vs, left: 'lever', right: 'spring', s: 26, pneumatic: true, labels: true, exhaust: true });
        kit.label(c, 'treadle valve', 556, 283, { size: 10.5, color: C.muted });
        kit.label(c, V.pedal.toFixed(0) + ' %', 545, 188 + 0, { size: 10.5, color: V.pedal > 0 ? C.bad : C.muted, align: 'left', weight: 700 });
        S.valve(c, 470, 330, { spec: '3/2 NC', state: s.vp, left: 'pushbutton', right: 'spring', s: 26, pneumatic: true, labels: true, exhaust: true });
        kit.label(c, 'parking valve', 412, 330, { size: 10.5, color: C.muted, align: 'right' });
        // the piggy-back chamber: spring brake behind, service chamber in front
        const pk = 0.35 + 0.65 * s.xk / 65;
        S.cylinder(c, 400, 120, { len: 115, h: 60, pos: pk, single: 'extend', rodLen: 80, fillB: airTint(C, gSpr, 9e5) });
        S.cylinder(c, 522, 120, { len: 80, h: 60, pos: s.x / 65, single: 'retract', rodLen: 157, fillA: airTint(C, gSvc, 9e5) });
        kit.label(c, 'spring brake', 457, 62, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (gSpr / 1e5).toFixed(1) + ' bar', 457, 78, { size: 12, weight: 700, align: 'center' });
        kit.label(c, 'service', 562, 62, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (gSvc / 1e5).toFixed(1) + ' bar', 562, 78, { size: 12, weight: 700, align: 'center' });
        // slack adjuster, S-cam and drum
        const th = s.x / 130, cx = 690, cy = 250, tipX = cx + 130 * Math.sin(th), tipY = cy - 130 * Math.cos(th);
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(690 + s.x, 120); c.lineTo(tipX, tipY); c.stroke();
        c.lineWidth = 7; c.lineCap = 'round'; c.strokeStyle = C.muted; c.beginPath(); c.moveTo(cx, cy); c.lineTo(tipX, tipY); c.stroke(); c.lineCap = 'butt';
        kit.dot(c, tipX, tipY, 3.5, C.text);
        kit.label(c, 'stroke ' + s.x.toFixed(0) + ' mm', 700, 100, { size: 11, color: C.muted });
        const dc = [690, 305], R = 62, contact = clamp(s.x / SC, 0, 1), gap = 5 * (1 - contact);
        c.lineWidth = 5; c.strokeStyle = C.muted; c.beginPath(); c.arc(dc[0], dc[1], R, 0, Math.PI * 2); c.stroke();
        const lining = Frod > 0 && contact >= 1 ? C.bad : C.warn;
        for (const side of [-1, 1]) {
          const a0 = side > 0 ? -Math.PI / 2 + 0.3 : Math.PI / 2 + 0.3, a1 = side > 0 ? Math.PI / 2 - 0.3 : 3 * Math.PI / 2 - 0.3;
          c.lineWidth = 5; c.strokeStyle = lining; c.beginPath(); c.arc(dc[0], dc[1], R - 5 - gap, a0, a1); c.stroke();
          c.lineWidth = 3; c.strokeStyle = C.text; c.beginPath(); c.arc(dc[0], dc[1], R - 10 - gap, a0, a1); c.stroke();
        }
        c.save(); c.translate(cx, cy); c.rotate(th);
        c.fillStyle = C.text; c.fillRect(-11, -3, 22, 6); c.restore();
        kit.dot(c, cx, cy, 3, C.bg2, C.text);
        kit.dot(c, dc[0], dc[1] + R - 12, 4, C.bg2, C.text);
        kit.label(c, 'S-cam, shoes and drum', 690, 385, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (Frod * ARM / 1000).toFixed(2) + ' kN·m on the cam', 690, 403, { size: 11, color: Frod > 0 ? C.text : C.muted, align: 'center', weight: 600 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------ train brake pipe and triple valves */
  Hyper.sim('app-train-brake', {
    title: 'A train\'s automatic air brake, wagon by wagon',
    blurb: `A brake pipe charged to 5 bar runs the length of the train. On every wagon a **triple valve** (distributor) compares the pipe with the wagon's auxiliary reservoir: when the pipe falls below the reservoir it sends reservoir air to the brake cylinder until the reservoir has fallen to the pipe pressure, then **laps**; when the pipe rises above the reservoir it exhausts the cylinder and recharges the reservoir. The driver's reduction travels down the pipe at the signal speed and spreads out a little as it goes, so the rear wagons brake later. Wagon colour shows brake-cylinder pressure; the graphs show the pressures along the train now and the cylinder pressures of the first, middle and last wagons against time. This is the classic triple valve with direct release; UIC distributors can also release in steps.

**Try this**
- Set a 0.5 bar reduction and watch it travel to the last wagon: each cylinder settles at (Va/Vc)·Δp = 1.25 bar and the valves lap.
- Take the reduction to 1.43 bar, then to 1.6 bar: beyond full service the reservoir and cylinder have equalised at 3.57 bar and nothing more happens.
- Make the train 100 wagons long and press Emergency: read how long the last wagon waits, and compare P and G settings.
- Part the train: the pipe vents from the break in both directions and both halves brake — the fail-safe that made the Westinghouse brake compulsory.
- Release after a full application in the G setting: recharging a long train takes a minute.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gbox = document.createElement('div');
      gbox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gbox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gbox.appendChild(g1); gbox.appendChild(g2);
      const P0 = 5.0, LOCO = 20, CAR = 15;
      const TAU = { P: { ap: 1.6, rel: 7, ch: 6 }, G: { ap: 11, rel: 22, ch: 15 } };
      const s = { t: 0, pl: P0, emerg: false, brk: null, tCmd: -100, sel: 0, tPlot: 1, hist: [], ph: 0 };
      const ht = [0], hv = [P0];
      let cars = [];
      const ctl = kit.controls(box.side, [
        { id: 'red', label: 'Driver\'s brake valve: pipe reduction', min: 0, max: 1.6, step: 0.05, value: 0, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'rel', label: 'Release', primary: true }, { id: 'emerg', label: 'Emergency' }] },
        { type: 'buttons', items: [{ id: 'part', label: 'Train parts' }, { id: 'couple', label: 'Couple up again' }] },
        { id: 'n', label: 'Number of wagons (15 m each)', min: 5, max: 100, step: 1, value: 40 },
        { id: 'c', label: 'Speed of the brake signal', min: 150, max: 300, step: 5, value: 250, unit: 'm/s' },
        { id: 'mode', type: 'select', label: 'Distributor setting', options: [['P, passenger: applies in about 4 s', 'P'], ['G, goods: applies in about 25 s', 'G']], value: 'P' },
        { id: 'ratio', label: 'Auxiliary reservoir ÷ brake cylinder volume', min: 1.5, max: 3.5, step: 0.1, value: 2.5 },
        { id: 'sel', type: 'select', label: 'Wagon shown in detail (or click one)', options: [['First', 0], ['Middle', 0.5], ['Last', 1]], value: 1 }
      ], (id, v) => {
        if (id === 'red') { s.emerg = false; s.tCmd = s.t; }
        if (id === 'rel') { s.emerg = false; ctl.set('red', 0); s.tCmd = s.t; }
        if (id === 'emerg') { s.emerg = true; s.tCmd = s.t; }
        if (id === 'part' && !s.brk) { const i = Math.floor(cars.length / 2); s.brk = { i, t: s.t, p: cars[i].p }; }
        if (id === 'couple') s.brk = null;
        if (id === 'n') build();
        if (id === 'sel') s.sel = Math.round(v * (cars.length - 1));
      });
      const ro = kit.readout(box.side, [['pipe', 'Brake pipe: first / last wagon'], ['cyl', 'Cylinder: first / last wagon'], ['pc', 'Boyle: p_c = (Va/Vc)·Δp'], ['full', 'Full service: Δp = p₀/(1 + Va/Vc)'], ['delay', 'Signal reaches the last wagon after'], ['n', 'Wagons braking'], ['state', 'State']]);
      const pAlong = kit.plot(g1, { x: { label: 'distance from the locomotive (m)', min: 0 }, y: { label: 'gauge pressure (bar)', min: 0, max: 5.5 }, legend: true }, 150);
      const pTime = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'brake cylinder (bar)', min: 0, max: 4 }, legend: true }, 150);
      const V = ctl.values;
      function build() {
        const N = Math.round(V.n);
        cars = [];
        for (let i = 0; i < N; i++) cars.push({ i, x: LOCO + CAR * i + CAR / 2, p: s.pl, a: P0, cy: 0, mode: 0 });
        s.sel = Math.round(V.sel * (N - 1));
        if (s.brk && s.brk.i >= N) s.brk = null;
      }
      build();
      // the locomotive-end pipe pressure a while ago (binary search in the recorded history)
      function look(t) {
        if (t <= ht[0]) return hv[0];
        let lo = 0, hi = ht.length - 1;
        if (t >= ht[hi]) return hv[hi];
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ht[m] <= t) lo = m; else hi = m; }
        const f = (t - ht[lo]) / Math.max(1e-9, ht[hi] - ht[lo]);
        return hv[lo] + (hv[hi] - hv[lo]) * f;
      }
      function step(h) {
        const T = TAU[V.mode] || TAU.P, r = V.ratio;
        s.t += h;
        const target = s.emerg ? 0 : P0 - V.red;
        s.pl += (target - s.pl) * Math.min(1, h / (s.emerg ? 0.3 : target < s.pl ? 1.5 : 2.5));
        ht.push(s.t); hv.push(s.pl);
        while (ht.length > 2 && ht[1] < s.t - 15) { ht.shift(); hv.shift(); }
        const xb = s.brk ? LOCO + CAR * s.brk.i : 0;
        for (const car of cars) {
          let pt = look(s.t - car.x / V.c);
          if (s.brk) {
            const tau = s.t - s.brk.t - Math.abs(car.x - xb) / V.c;
            if (tau >= 0) pt = Math.min(pt, s.brk.p * Math.exp(-tau / 0.4));
          }
          car.p += (pt - car.p) * Math.min(1, h / (0.15 + car.x / 2000));
          const d = car.a - car.p;
          if (d > 0.005) {
            // apply: reservoir air to the cylinder until the reservoir has fallen to the pipe (lap) or the two equalise
            let q = (car.a - car.cy) * Math.min(1, h / T.ap);
            q = Math.max(0, Math.min(q, d * r, (car.a - car.cy) / (1 + 1 / r)));
            car.cy += q; car.a -= q / r; car.mode = q > 1e-5 ? 1 : 3;
          } else if (d < -0.03) {
            // release: the cylinder exhausts and the reservoir recharges from the pipe
            car.cy -= car.cy * Math.min(1, h / T.rel);
            car.a += (car.p - car.a) * Math.min(1, h / T.ch);
            car.mode = 0;
          } else car.mode = car.cy > 0.05 ? 2 : 0;
        }
      }
      const toDesign = p => { const k = Math.min(st.W / 760, st.H / 420); return { x: (p.x - (st.W - 760 * k) / 2) / k, y: (p.y - (st.H - 420 * k) / 2) / k }; };
      const strip = () => { const N = cars.length, gap = s.brk ? 8 : 0; return { x0: 66, wc: (678 - gap) / N, gap }; };
      const carX = (i, g) => g.x0 + i * g.wc + (s.brk && i >= s.brk.i ? g.gap : 0);
      kit.click(st, p => {
        const q = toDesign(p), g = strip();
        if (q.y < 36 || q.y > 100) return;
        for (let i = 0; i < cars.length; i++) if (q.x >= carX(i, g) && q.x < carX(i, g) + g.wc) { s.sel = i; loop.once(); }
      }, p => { const q = toDesign(p); return q.y > 36 && q.y < 100 && q.x > 66 && q.x < 752; });

      const loop = kit.loop((dt) => {
        const n = Math.ceil(dt / 0.01);
        for (let i = 0; i < n; i++) step(dt / n);
        const C = kit.colors(), N = cars.length, r = V.ratio, first = cars[0], last = cars[N - 1];
        const sel = cars[clamp(s.sel, 0, N - 1)], Ltrain = CAR * N;
        const eq = P0 * r / (1 + r), dpFull = P0 / (1 + r), dp = s.emerg || s.brk ? P0 : V.red;
        ro.set('pipe', first.p.toFixed(2) + ' / ' + last.p.toFixed(2) + ' bar');
        ro.set('cyl', first.cy.toFixed(2) + ' / ' + last.cy.toFixed(2) + ' bar');
        ro.set('pc', dp > 0 ? (dp < dpFull ? r.toFixed(1) + ' × ' + dp.toFixed(2) + ' = ' + (r * dp).toFixed(2) + ' bar' : 'equalised at ' + eq.toFixed(2) + ' bar (full service)') : 'no reduction');
        ro.set('full', dpFull.toFixed(2) + ' bar → ' + eq.toFixed(2) + ' bar');
        ro.set('delay', (last.x / V.c).toFixed(1) + ' s (' + last.x.toFixed(0) + ' m at ' + V.c.toFixed(0) + ' m/s)');
        const nb = cars.filter(q => q.cy > 0.3).length;
        ro.set('n', nb + ' of ' + N);
        const releasing = cars.some(q => q.cy > 0.1);
        const state = s.brk ? 'Train parted: the pipe vents from the break and both halves brake' : s.emerg ? 'Emergency: pipe vented; brakes equalise at ' + eq.toFixed(2) + ' bar' : V.red > 0 ? 'Service application, reduction ' + V.red.toFixed(2) + ' bar' : releasing ? 'Releasing and recharging' : 'Pipe charged to 5.0 bar, brakes released';
        ro.set('state', state);
        s.tPlot += dt;
        if (s.tPlot > 0.12) {
          s.tPlot = 0;
          const mid = cars[Math.floor(N / 2)];
          s.hist.push([s.t, first.cy, mid.cy, last.cy]);
          while (s.hist.length && s.hist[0][0] < s.t - 60) s.hist.shift();
          pAlong.set({ series: [{ pts: cars.map(q => [q.x, q.p]), label: 'brake pipe' }, { pts: cars.map(q => [q.x, q.a]), label: 'auxiliary reservoir', dash: [5, 4] }, { pts: cars.map(q => [q.x, q.cy]), label: 'brake cylinder' }], x: { label: 'distance from the locomotive (m)', min: 0, max: LOCO + Ltrain } });
          pTime.set({ series: [{ pts: s.hist.map(q => [q[0], q[1]]), label: 'first' }, { pts: s.hist.map(q => [q[0], q[2]]), label: 'middle', dash: [6, 3] }, { pts: s.hist.map(q => [q[0], q[3]]), label: 'last', dash: [2, 3] }], x: { label: 'time (s)', min: Math.max(0, s.t - 60), max: Math.max(60, s.t) } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const g = strip();
        // the locomotive
        c.fillStyle = C.muted; c.fillRect(14, 46, 46, 38);
        kit.label(c, 'loco', 37, 65, { size: 11, weight: 700, color: C.bg2, align: 'center' });
        kit.label(c, 'driver\'s valve ' + s.pl.toFixed(2) + ' bar', 14, 30, { size: 11, color: C.text, weight: 600 });
        // wagons coloured by brake-cylinder pressure, the pipe beneath coloured by its pressure
        for (let i = 0; i < N; i++) {
          const q = cars[i], x = carX(i, g), w = Math.max(1, g.wc - (g.wc > 4 ? 1.5 : 0.5));
          c.fillStyle = C.surface; c.fillRect(x, 50, w, 32);
          c.globalAlpha = clamp(q.cy / 3.6, 0, 1); c.fillStyle = C.bad; c.fillRect(x, 50, w, 32); c.globalAlpha = 1;
          c.strokeStyle = i === s.sel ? C.accent : C.faint; c.lineWidth = i === s.sel ? 2.2 : 0.8; c.strokeRect(x, 50, w, 32);
          c.globalAlpha = 0.2 + 0.8 * clamp(q.p / P0, 0, 1); c.fillStyle = S.col('air'); c.fillRect(x, 88, g.wc, 4); c.globalAlpha = 1;
          if (g.wc > 7) { kit.dot(c, x + w * 0.22, 84, Math.min(3, g.wc * 0.12), C.text); kit.dot(c, x + w * 0.78, 84, Math.min(3, g.wc * 0.12), C.text); }
        }
        kit.label(c, LOCO + ' m', 66, 106, { size: 10.5, color: C.muted });
        kit.label(c, (LOCO + Ltrain).toFixed(0) + ' m', 744, 106, { size: 10.5, color: C.muted, align: 'right' });
        // the signal fronts travelling along the pipe
        const front = (x, dir) => { const px = g.x0 + (x - LOCO) / Ltrain * (678 - g.gap); c.fillStyle = C.warn; c.beginPath(); c.moveTo(px, 94); c.lineTo(px - 5 * dir, 100); c.lineTo(px - 5 * dir, 88); c.closePath(); c.fill(); };
        const fx = V.c * (s.t - s.tCmd);
        if (fx > LOCO && fx < LOCO + Ltrain) front(fx, 1);
        if (s.brk) {
          const xb = LOCO + CAR * s.brk.i, dx = V.c * (s.t - s.brk.t);
          if (xb + dx < LOCO + Ltrain) front(xb + dx, 1);
          if (xb - dx > LOCO) front(xb - dx, -1);
          kit.label(c, 'parted', g.x0 + s.brk.i * g.wc + g.gap / 2, 40, { size: 10.5, color: C.bad, weight: 700, align: 'center' });
        }
        kit.label(c, 'wagon colour: brake-cylinder pressure · blue strip: brake pipe · orange marks: the brake signal', 66, 124, { size: 10.5, color: C.muted });
        // ---- the chosen wagon's equipment
        kit.label(c, 'Wagon ' + (sel.i + 1) + ' of ' + N + ', ' + sel.x.toFixed(0) + ' m from the driver\'s brake valve', 470, 160, { size: 12, weight: 700 });
        kit.label(c, 'the signal needs ' + (sel.x / V.c).toFixed(2) + ' s to get here', 470, 180, { size: 11, color: C.muted });
        const mode = sel.mode === 1 ? 'APPLY: reservoir → cylinder' : sel.mode === 3 ? 'EQUALISED: full service' : sel.mode === 2 ? 'LAP: holding the brake' : 'RELEASE & CHARGE';
        const pipeSt = sel.p > 0.2 ? 'air' : 'idle', cylSt = sel.cy > 0.1 ? (sel.mode === 0 ? 'exhaust' : 'air') : 'idle';
        S.line(c, [[30, 395], [740, 395]], { state: pipeSt });
        S.line(c, [[170, 395], [170, 328]], { state: pipeSt }); S.junction(c, 170, 395);
        S.line(c, [[170, 220], [170, 272]], { state: sel.a > 0.2 ? 'air' : 'idle' });
        const cylLine = [[235, 300], [280, 300], [280, 345], [338, 345], [338, 315]];
        S.line(c, cylLine, { state: cylSt });
        S.line(c, [[120, 328], [120, 338]], { state: sel.mode === 0 && sel.cy > 0.05 ? 'exhaust' : 'idle' }); S.exhaust(c, 120, 338);
        s.ph += dt * 40;
        if (sel.mode === 1) S.flow(c, [[170, 222], [170, 300], [235, 300]].concat(cylLine.slice(1)), s.ph, { color: S.col('air') });
        if (sel.mode === 0 && sel.cy > 0.05) S.flow(c, cylLine.slice().reverse().concat([[120, 300], [120, 350]]), s.ph, { color: S.col('exhaust') });
        if (sel.mode === 0 && sel.p - sel.a > 0.03) S.flow(c, [[170, 395], [170, 222]], s.ph, { color: S.col('air') });
        receiver(c, C, 170, 200, 150, 40, airTint(C, sel.a * 1e5, 6e5));
        kit.label(c, 'auxiliary reservoir', 170, 200, { size: 11, align: 'center', weight: 600 });
        kit.label(c, sel.a.toFixed(2) + ' bar', 252, 200, { size: 12, weight: 700 });
        c.fillStyle = C.surface; c.fillRect(105, 272, 130, 56); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(105, 272, 130, 56);
        kit.label(c, 'triple valve', 170, 288, { size: 11.5, weight: 700, align: 'center' });
        kit.label(c, 'pipe vs reservoir', 170, 308, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, mode, 105, 358, { size: 11.5, weight: 700, color: sel.mode === 0 ? C.ok : sel.mode === 2 ? C.warn : C.bad });
        kit.label(c, 'brake pipe ' + sel.p.toFixed(2) + ' bar', 190, 382, { size: 11, color: C.text });
        const cpos = clamp(sel.cy / 0.4, 0, 1);
        const cy = S.cylinder(c, 330, 280, { len: 130, h: 50, pos: cpos, single: 'retract', rodLen: 115, fillA: airTint(C, sel.cy * 1e5, 4e5) });
        kit.label(c, 'brake cylinder', 395, 232, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, sel.cy.toFixed(2) + ' bar', 395, 248, { size: 12, weight: 700, align: 'center' });
        c.fillStyle = sel.cy > 0.3 ? C.bad : C.warn; c.fillRect(cy.tip[0], 258, 14, 44);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(640, 280, 55, 0, Math.PI * 2); c.stroke();
        c.lineWidth = 1.5; c.beginPath(); c.arc(640, 280, 12, 0, Math.PI * 2); c.stroke();
        c.lineWidth = 3; c.beginPath(); c.moveTo(560, 337); c.lineTo(740, 337); c.stroke();
        kit.label(c, 'block on the wheel', 640, 356, { size: 11, color: C.muted, align: 'center' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------ tyre: load, pressure and temperature */
  // R outer radius, sw section width, H section height (m); F typical load (kN), p typical cold pressure (bar gauge)
  const TYRES = [
    { name: 'Car, 205/55 R16', R: 0.316, sw: 0.205, H: 0.113, F: 4.5, p: 2.3 },
    { name: 'Van, 215/65 R16C', R: 0.343, sw: 0.215, H: 0.140, F: 8, p: 4.0 },
    { name: 'Truck drive axle, 315/80 R22.5', R: 0.538, sw: 0.315, H: 0.252, F: 28, p: 8.5 },
    { name: 'Road bicycle, 700×25C', R: 0.336, sw: 0.025, H: 0.025, F: 0.5, p: 6.0 },
    { name: 'Airliner main wheel, 46×17R20', R: 0.584, sw: 0.432, H: 0.330, F: 250, p: 14 }
  ];

  Hyper.sim('app-tyre', {
    title: 'Tyre pressure, load and temperature',
    blurb: `The air carries the load: the tyre flattens until its contact patch is large enough that the inflation pressure holds the wheel up, **A ≈ F/p** (gauge pressure; the carcass carries a little too). The deflection is estimated from the patch by an empirical footprint rule used for aircraft tyres, A ≈ 2.3 δ √(w D), with w the section width and D the outside diameter. The air inside is a nearly fixed volume, so its **absolute** pressure follows its absolute temperature (Gay-Lussac): the bars on the right stack the atmosphere under the gauge pressure, cold and now. The patch drawn with a dashed line is the tyre's normal patch at its typical load and pressure.

**Try this**
- Car tyre at 2.3 bar and 20 °C: warm the air to 60 °C (a motorway run) and to −10 °C (a cold morning). The gauge reading moves about 0.1 bar per 10 °C, and the absolute pressure scales exactly with the kelvins.
- Let the pressure down to 1.5 bar at the same load: the patch grows by half and the tyre flexes far more with every turn.
- Double the load and find the pressure that brings the deflection back to normal: it roughly doubles too.
- Compare the bicycle (a patch the size of a thumb print at 6 bar) with the airliner wheel (a patch the size of a doormat at 14 bar).
- Set the tyre at 20 °C in a warm garage and drive off on a −10 °C morning: this is why pressures are checked cold, outdoors.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gbox = document.createElement('div');
      gbox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gbox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gbox.appendChild(g1); gbox.appendChild(g2);
      const PA = 1.013;                                    // bar
      const s = { Tair: 20, tPlot: 1 };
      const ctl = kit.controls(box.side, [
        { id: 'tyre', type: 'select', label: 'Tyre', options: TYRES.map((t, i) => [t.name, i]), value: 0 },
        { id: 'F', label: 'Load on the tyre', min: 0.1, max: 300, value: 4.5, unit: 'kN', log: true, sig: 3 },
        { id: 'p1', label: 'Pressure set cold (gauge)', min: 0.3, max: 16, value: 2.3, unit: 'bar', log: true, sig: 3 },
        { id: 'T1', label: 'Temperature when it was set', min: -20, max: 40, step: 1, value: 20, unit: '°C' },
        { id: 'T2', label: 'Temperature of the air in the tyre now', min: -30, max: 100, step: 1, value: 20, unit: '°C' },
        { type: 'buttons', items: [{ id: 'cold', label: 'Cold morning, −10 °C' }, { id: 'hot', label: 'Motorway run, 60 °C' }, { id: 'mild', label: '20 °C' }] }
      ], (id, v) => {
        if (id === 'tyre') { const t = TYRES[v] || TYRES[0]; ctl.set('F', t.F); ctl.set('p1', t.p); }
        if (id === 'cold') ctl.set('T2', -10);
        if (id === 'hot') ctl.set('T2', 60);
        if (id === 'mild') ctl.set('T2', 20);
      });
      const ro = kit.readout(box.side, [['abs', 'Absolute: set / now'], ['p2', 'Gauge now: p₂ = (p₁ + p_atm)·T₂/T₁ − p_atm'], ['rate', 'Change per 10 °C'], ['A', 'Contact patch A ≈ F/p'], ['wl', 'Patch width × length'], ['d', 'Deflection (A ≈ 2.3 δ √(wD))'], ['rec', 'Cold pressure for normal deflection'], ['state', 'State']]);
      const pT = kit.plot(g1, { x: { label: 'air temperature (°C)', min: -40, max: 100 }, y: { label: 'gauge pressure (bar)', min: 0 } }, 150);
      const pA = kit.plot(g2, { x: { label: 'gauge pressure (bar)', min: 0 }, y: { label: 'contact patch (cm²)', min: 0 } }, 150);
      const V = ctl.values;
      const loop = kit.loop((dt) => {
        const n = Math.ceil(dt / 0.02);
        for (let i = 0; i < n; i++) s.Tair += (V.T2 - s.Tair) * Math.min(1, (dt / n) / 0.8);
        const C = kit.colors(), ty = TYRES[V.tyre] || TYRES[0];
        const T1 = V.T1 + 273.15, T2 = s.Tair + 273.15, pAbs1 = V.p1 + PA, pAbs2 = pAbs1 * T2 / T1, p2 = Math.max(0.01, pAbs2 - PA);
        const Fn = V.F * 1000, A = Fn / (p2 * 1e5), wc = 0.8 * ty.sw, l = A / wc, D = 2 * ty.R;
        const def = A / (2.3 * Math.sqrt(ty.sw * D));
        const A0 = ty.F * 1000 / (ty.p * 1e5), l0 = A0 / wc, def0 = A0 / (2.3 * Math.sqrt(ty.sw * D));
        const ratio = def / def0;
        ro.set('abs', pAbs1.toFixed(3) + ' bar at ' + T1.toFixed(0) + ' K / ' + pAbs2.toFixed(3) + ' bar at ' + T2.toFixed(0) + ' K');
        ro.set('p2', p2.toFixed(2) + ' bar (' + psi(p2 * 1e5).toFixed(1) + ' psi)');
        ro.set('rate', '+' + (pAbs1 * 10 / T1).toFixed(3) + ' bar');
        ro.set('A', (A * 1e4).toFixed(A * 1e4 < 20 ? 1 : 0) + ' cm² (normal ' + (A0 * 1e4).toFixed(A0 * 1e4 < 20 ? 1 : 0) + ' cm²)');
        ro.set('wl', (wc * 100).toFixed(1) + ' × ' + (l * 100).toFixed(1) + ' cm');
        ro.set('d', (def * 1000).toFixed(1) + ' mm, ' + (def / ty.H * 100).toFixed(0) + ' % of the section height');
        const pRec = ty.p * V.F / ty.F;
        ro.set('rec', 'about ' + pRec.toFixed(2) + ' bar (' + ty.p.toFixed(1) + ' bar × ' + (V.F / ty.F).toFixed(2) + ')');
        const state = def / ty.H > 0.4 ? 'Grossly under-inflated: the tyre is running nearly flat' : ratio > 1.25 ? 'Under-inflated for this load: ' + ((ratio - 1) * 100).toFixed(0) + ' % more deflection, more flexing and heat' : ratio < 0.75 ? 'Over-inflated for this load: small patch, harsh ride' : 'About right for this load';
        ro.set('state', state);
        s.tPlot += dt;
        if (s.tPlot > 0.15) {
          s.tPlot = 0;
          const line = [];
          for (let T = -40; T <= 100; T += 5) line.push([T, pAbs1 * (T + 273.15) / T1 - PA]);
          pT.set({ series: [{ pts: line, label: 'p₂ for this setting' }], marks: [{ x: V.T1, y: V.p1, label: 'set' }, { x: s.Tair, y: p2, label: 'now' }], y: { label: 'gauge pressure (bar)', min: 0, max: Math.max(1, pAbs1 * 373.15 / T1 - PA) * 1.05 } });
          const hyp = [], pmax = Math.max(2 * ty.p, p2 * 1.3);
          for (let i = 1; i <= 60; i++) { const pp = pmax * i / 60; if (Fn / (pp * 1e5) * 1e4 < 6 * A0 * 1e4) hyp.push([pp, Fn / (pp * 1e5) * 1e4]); }
          pA.set({ series: [{ pts: hyp, label: 'A = F/p at this load' }], marks: [{ x: p2, y: A * 1e4, label: 'now' }, { x: ty.p, y: A0 * 1e4, label: 'normal' }], x: { label: 'gauge pressure (bar)', min: 0, max: pmax }, y: { label: 'contact patch (cm²)', min: 0, max: Math.max(A, A0) * 1e4 * 2.2 } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        // side view: the tyre flattened on the road by δ (to scale)
        const cx = 170, cyw = 185, Rp = 125, sc = Rp / ty.R, Hp = ty.H * sc, dpx = Math.min(def * sc, 0.8 * Hp);
        const road = cyw + Rp - dpx, half = Math.sqrt(Math.max(0, Rp * Rp - (Rp - dpx) * (Rp - dpx)));
        c.save(); c.beginPath(); c.rect(0, 0, 760, road); c.clip();
        c.beginPath(); c.arc(cx, cyw, Rp, 0, Math.PI * 2); c.arc(cx, cyw, Rp - Hp, 0, Math.PI * 2, true);
        c.fillStyle = airTint(C, p2 * 1e5, ty.p * 1.6e5) || C.surface; c.fill();
        c.strokeStyle = C.muted; c.lineWidth = 6; c.beginPath(); c.arc(cx, cyw, Rp - 3, 0, Math.PI * 2); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(cx, cyw, Rp, 0, Math.PI * 2); c.stroke();
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.arc(cx, cyw, Rp - Hp, 0, Math.PI * 2); c.stroke();
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cyw, Math.max(4, Rp - Hp - 4), 0, Math.PI * 2); c.fill(); c.stroke();
        for (let i = 0; i < 5; i++) { const a = i * 2 * Math.PI / 5 - Math.PI / 2; c.beginPath(); c.moveTo(cx + 10 * Math.cos(a), cyw + 10 * Math.sin(a)); c.lineTo(cx + (Rp - Hp - 8) * Math.cos(a), cyw + (Rp - Hp - 8) * Math.sin(a)); c.lineWidth = 3; c.strokeStyle = C.muted; c.stroke(); }
        kit.dot(c, cx, cyw, 9, C.bg2, C.text);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(20, road); c.lineTo(320, road); c.stroke();
        c.lineWidth = 1; c.strokeStyle = C.faint;
        for (let x = 24; x < 320; x += 12) { c.beginPath(); c.moveTo(x, road); c.lineTo(x - 8, road + 8); c.stroke(); }
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - half, road); c.lineTo(cx + half, road); c.stroke();
        for (let i = -2; i <= 2; i++) kit.arrow(c, cx + i * half * 0.4, road + 16, cx + i * half * 0.4, road + 3, C.accent, 1.5, 6);
        kit.arrow(c, cx, 26, cx, cyw - 12, C.bad, 3);
        kit.label(c, 'F = ' + kit.fmt(V.F, 3) + ' kN', cx + 8, 34, { size: 12, weight: 700, color: C.bad });
        kit.label(c, 'δ = ' + (def * 1000).toFixed(def < 0.005 ? 1 : 0) + ' mm', cx + half + 10, road - 12, { size: 11.5, weight: 700 });
        kit.label(c, 'p·A holds F', cx, road + 28, { size: 11, color: C.accent, align: 'center' });
        kit.label(c, ty.name, 20, 350, { size: 11.5, weight: 700 });
        // the patch from above, to scale, with the normal patch dashed
        const px0 = 440, py0 = 150, sp = Math.min(150 / Math.max(l, l0, 1e-6), 170 / wc);
        kit.label(c, 'contact patch, from above', px0, 40, { size: 11.5, weight: 700, align: 'center' });
        const rr = (w, h, dash, fill) => {
          c.beginPath(); if (c.roundRect) c.roundRect(px0 - w / 2, py0 - h / 2, w, h, Math.min(w, h) * 0.25); else c.rect(px0 - w / 2, py0 - h / 2, w, h);
          if (fill) { c.fillStyle = fill; c.fill(); }
          c.setLineDash(dash || []); c.strokeStyle = dash ? C.muted : C.text; c.lineWidth = 1.5; c.stroke(); c.setLineDash([]);
        };
        rr(wc * sp, l * sp, null, C.dark ? 'rgba(224,160,48,.35)' : 'rgba(224,160,48,.3)');
        rr(wc * sp, l0 * sp, [5, 4]);
        kit.label(c, (A * 1e4).toFixed(A * 1e4 < 20 ? 1 : 0) + ' cm²', px0, py0, { size: 13, weight: 700, align: 'center' });
        kit.label(c, (wc * 100).toFixed(1) + ' cm wide', px0, py0 + Math.max(l, l0) * sp / 2 + 14, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, (l * 100).toFixed(1) + ' cm long', px0 + wc * sp / 2 + 8, py0, { size: 11, color: C.muted });
        kit.label(c, '↑ rolling direction', px0, py0 + Math.max(l, l0) * sp / 2 + 30, { size: 10.5, color: C.faint, align: 'center' });
        // absolute pressure: the atmosphere under the gauge pressure, cold and now
        const base = 300, top = 70, mx = Math.max(pAbs1, pAbs2);
        const stack = (x, pabs, pg, lab, TK) => {
          const hA = (base - top) * PA / mx, hG = (base - top) * Math.max(0, pg) / mx;
          c.fillStyle = C.faint; c.fillRect(x, base - hA, 44, hA);
          c.fillStyle = S_air(C); c.fillRect(x, base - hA - hG, 44, hG);
          c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(x, base - hA - hG, 44, hA + hG);
          kit.label(c, pabs.toFixed(2), x + 22, base - hA - hG - 20, { size: 11.5, weight: 700, align: 'center' });
          kit.label(c, 'bar abs', x + 22, base - hA - hG - 7, { size: 10, color: C.muted, align: 'center' });
          kit.label(c, lab, x + 22, base + 13, { size: 11, weight: 700, align: 'center' });
          kit.label(c, TK.toFixed(0) + ' K', x + 22, base + 28, { size: 10.5, color: C.muted, align: 'center' });
        };
        stack(575, pAbs1, V.p1, 'set', T1);
        stack(640, pAbs2, p2, 'now', T2);
        kit.label(c, 'grey: atmosphere 1.013 bar', 575, 336, { size: 10, color: C.muted });
        kit.label(c, 'blue: gauge pressure', 575, 350, { size: 10, color: C.muted });
        // thermometer
        const tx = 725, tTop = 60, tBot = 290, frac = clamp((s.Tair + 40) / 140, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx - 5, tTop, 10, tBot - tTop);
        c.fillStyle = s.Tair > 40 ? C.bad : C.accent; c.fillRect(tx - 3, tBot - (tBot - tTop) * frac, 6, (tBot - tTop) * frac);
        kit.dot(c, tx, tBot + 10, 10, s.Tair > 40 ? C.bad : C.accent, C.text);
        for (const T of [-40, 0, 50, 100]) { const y = tBot - (tBot - tTop) * (T + 40) / 140; c.beginPath(); c.moveTo(tx + 5, y); c.lineTo(tx + 10, y); c.stroke(); kit.label(c, T < 0 ? '−' + (-T) : String(T), tx + 13, y, { size: 9.5, color: C.muted }); }
        kit.label(c, s.Tair.toFixed(0) + ' °C', tx, 42, { size: 12, weight: 700, align: 'center' });
        kit.label(c, state, 20, 376, { size: 12, weight: 700, color: ratio > 1.25 || def / ty.H > 0.4 ? C.bad : ratio < 0.75 ? C.warn : C.ok });
        kit.label(c, 'gauge now ' + p2.toFixed(2) + ' bar = ' + pAbs1.toFixed(3) + ' × ' + T2.toFixed(1) + '/' + T1.toFixed(1) + ' − 1.013', 20, 400, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------ air tools: demand, compressor and cost */
  // q free air while running at 6.3 bar (L/min ANR), P shaft power (kW), on typical length of one run (s), n and u the default workshop
  const TOOLS = [
    { name: 'Drill, 10 mm', q: 400, P: 0.35, on: 15, n: 0, u: 20 },
    { name: 'Die grinder, 6 mm collet', q: 450, P: 0.35, on: 20, n: 1, u: 30 },
    { name: 'Angle grinder, 125 mm', q: 1100, P: 0.95, on: 30, n: 0, u: 25 },
    { name: 'Impact wrench, 1/2 in', q: 500, P: 0.45, on: 3, n: 2, u: 20 },
    { name: 'Orbital sander, 150 mm', q: 400, P: 0.25, on: 60, n: 1, u: 40 },
    { name: 'Framing nailer, 30 nails/min', q: 60, P: 0.05, on: 10, n: 0, u: 30 },
    { name: 'Blow gun', q: 250, P: 0, on: 5, n: 1, u: 10 }
  ];
  const MOTORS = [1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160];

  Hyper.sim('app-air-tools', {
    title: 'Air tools: what they use and what it costs',
    blurb: `A workshop's air tools, rated at 6.3 bar (90 psi) at the inlet. Pick a tool to edit its number, its duty cycle (the share of the time it really runs) and, if you know it, its own rating. The calculator adds **N·Q·u** for every kind of tool, adds a reserve for leaks and growth, picks the next standard compressor motor, and prices the electricity; the overall efficiency compares the tools' shaft power with the compressor's electricity. Underneath, a simulation switches every tool on and off at random with its duty cycle and typical run length (an impact wrench runs for seconds, a sander for a minute) and follows the receiver pressure with a load/unload compressor (cut-in 7 bar, cut-out 8 bar). A tool's free-air flow falls in proportion to its absolute inlet pressure when the pressure sags.

**Try this**
- The default workshop is the concept's example: 520 L/min average, 650 L/min with 25 % reserve, about 4.2 kW — a 5.5 kW compressor.
- Press "Everything at once": the peak is four times the average, and the receiver carries it for a while. Make the receiver 50 L and try again.
- Add an angle grinder running 60 % of the time: a single continuous tool of 1100 L/min now outweighs all the others.
- Compare the yearly cost of the air with the same work done by electric tools; the overall efficiency is around 10 %.
- Set the duty cycles to 100 %: sizing for everything running at once is what oversizes compressors.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gbox = document.createElement('div');
      gbox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gbox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gbox.appendChild(g1); gbox.appendChild(g2);
      const tools = TOOLS.map(t => Object.assign({}, t));
      let seed = 12345;
      const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
      const s = { t: 0, p: 7.5, loaded: false, units: [], hist: [], tPlot: 1, ph: 0, simT: 0, loadT: 0, lowT: 0, q: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'tool', type: 'select', label: 'Tool to edit', options: tools.map((t, i) => [t.name, i]), value: 3 },
        { id: 'n', label: 'Number of these tools', min: 0, max: 10, step: 1, value: tools[3].n },
        { id: 'u', label: 'Duty cycle (share of the time running)', min: 0, max: 100, step: 1, value: tools[3].u, unit: '%' },
        { id: 'q', label: 'Its free air while running, at 6.3 bar', min: 20, max: 2000, step: 10, value: tools[3].q, unit: 'L/min' },
        { id: 'res', label: 'Reserve for leaks and growth', min: 0, max: 100, step: 1, value: 25, unit: '%' },
        { id: 'sp', label: 'Compressor specific power', min: 5, max: 10, step: 0.1, value: 6.5, unit: 'kW per m³/min' },
        { id: 'hours', label: 'Hours a year', min: 250, max: 6000, step: 50, value: 2000, unit: 'h' },
        { id: 'price', label: 'Electricity price per kWh', min: 0.03, max: 0.5, step: 0.01, value: 0.15, unit: '¤' },
        { id: 'vr', label: 'Receiver volume', min: 50, max: 2000, value: 270, unit: 'L', log: true, sig: 2 },
        { id: 'speed', type: 'select', label: 'Simulation speed', options: [['Real time', 1], ['10 × faster', 10], ['60 × faster', 60]], value: 10 },
        { type: 'buttons', items: [{ id: 'all', label: 'Everything at once' }] }
      ], (id, v) => {
        const t = tools[V.tool] || tools[0];
        if (id === 'tool') { ctl.set('n', t.n); ctl.set('u', t.u); ctl.set('q', t.q); }
        if (id === 'n') { t.n = Math.round(v); build(); }
        if (id === 'u') t.u = v;
        if (id === 'q') t.q = v;
        if (id === 'all') for (const un of s.units) un.on = true;
        table.set(rows());
      });
      const ro = kit.readout(box.side, [['avg', 'Average demand Σ N·Q·u'], ['need', 'With reserve, Q_c = Σ N·Q·u·(1 + r)'], ['comp', 'Compressor'], ['peak', 'Peak, everything at once'], ['big', 'Largest single tool'], ['eff', 'Overall efficiency, socket to spindle'], ['e', 'Electricity a year'], ['cost', 'Cost a year: air / electric tools'], ['sim', 'Simulated: receiver, loaded, below 6.3 bar']]);
      const table = kit.table(box.side, [{ label: 'Tool', key: 'name', align: 'left' }, { label: 'No.', key: 'n' }, { label: 'L/min', key: 'q' }, { label: 'Duty', key: r => r.u.toFixed(0) + ' %' }, { label: 'Average', key: r => (r.n * r.q * r.u / 100).toFixed(0) }]);
      const rows = () => tools.map(t => ({ name: t.name, n: t.n, q: Math.round(t.q), u: t.u, _cls: t === tools[V.tool] ? 'hl' : '' }));
      const pQ = kit.plot(g1, { x: { label: 'time (s)' }, y: { label: 'free air (L/min)', min: 0 }, legend: true }, 150);
      const pP = kit.plot(g2, { x: { label: 'time (s)' }, y: { label: 'receiver (bar gauge)', min: 4, max: 8.5 } }, 150);
      const V = ctl.values;
      function build() {
        const old = s.units;
        s.units = [];
        tools.forEach((t, j) => { for (let i = 0; i < t.n; i++) { const o = old.find(u => u.j === j && u.i === i); s.units.push({ j, i, on: o ? o.on : false }); } });
      }
      build();
      table.set(rows());
      function sums() {
        let avg = 0, peak = 0, shaft = 0, big = 0, bigName = '—';
        for (const t of tools) {
          avg += t.n * t.q * t.u / 100; peak += t.n * t.q; shaft += t.n * t.P * t.u / 100;
          if (t.n > 0 && t.q > big) { big = t.q; bigName = t.name; }
        }
        const need = avg * (1 + V.res / 100), kw = need / 1000 * V.sp;
        const motor = MOTORS.find(m => m >= kw) || MOTORS[MOTORS.length - 1], fad = motor / V.sp * 1000;
        return { avg, peak, shaft, big, bigName, need, kw, motor, fad };
      }
      function step(h, fad) {
        s.t += h;
        const pAbs = s.p + PATM / 1e5, pRated = 6.3 + PATM / 1e5;
        let q = 0;
        for (const un of s.units) {
          const t = tools[un.j], u = t.u / 100;
          if (u >= 0.999) un.on = true;
          else if (u <= 0.001) un.on = false;
          else if (un.on) { if (rnd() < h / t.on) un.on = false; }
          else if (rnd() < h / (t.on * (1 - u) / u)) un.on = true;
          if (un.on) q += t.q * Math.min(1.1, pAbs / pRated);
        }
        if (s.p >= 8.0) s.loaded = false; else if (s.p <= 7.0) s.loaded = true;
        const qin = s.loaded ? fad : 0;
        s.p = Math.max(0, s.p + (qin - q) / 60 * h * 1.0 / V.vr);   // free air at 1 bar (ANR, 100 kPa) into V litres
        s.q = q; s.simT += h; if (s.loaded) s.loadT += h; if (q > 0 && s.p < 6.3) s.lowT += h;
      }
      const loop = kit.loop((dt) => {
        const R = sums(), simdt = dt * V.speed, n = Math.ceil(simdt / 0.05);
        for (let i = 0; i < n; i++) step(simdt / n, R.fad);
        const C = kit.colors();
        const kWavg = R.avg / 1000 * V.sp, kwh = kWavg * V.hours, kwhEl = R.shaft / 0.7 * V.hours;
        ro.set('avg', R.avg.toFixed(0) + ' L/min (' + (R.avg / 28.317).toFixed(1) + ' SCFM)');
        ro.set('need', R.need.toFixed(0) + ' L/min, ' + R.kw.toFixed(1) + ' kW');
        ro.set('comp', R.motor + ' kW motor, about ' + R.fad.toFixed(0) + ' L/min');
        ro.set('peak', R.peak.toFixed(0) + ' L/min (' + (R.avg > 0 ? (R.peak / R.avg).toFixed(1) : '—') + ' × the average)');
        ro.set('big', R.big > 0 ? R.big.toFixed(0) + ' L/min, ' + R.bigName + (R.big <= R.fad ? ' — covered' : ' — MORE than the compressor') : 'no tools');
        ro.set('eff', kWavg > 0 && R.shaft > 0 ? (R.shaft / kWavg * 100).toFixed(1) + ' % (' + R.shaft.toFixed(2) + ' kW out of ' + kWavg.toFixed(2) + ' kW)' : '—');
        ro.set('e', kwh.toFixed(0) + ' kWh (' + kWavg.toFixed(2) + ' kW average)');
        ro.set('cost', kit.money(kwh * V.price, 0) + ' / ' + kit.money(kwhEl * V.price, 0));
        ro.set('sim', s.p.toFixed(2) + ' bar, ' + (s.simT > 0 ? (s.loadT / s.simT * 100).toFixed(0) : '0') + ' %, ' + (s.simT > 0 ? (s.lowT / s.simT * 100).toFixed(1) : '0') + ' %');
        s.tPlot += dt;
        if (s.tPlot > 0.1) {
          s.tPlot = 0;
          s.hist.push([s.t, s.q, s.loaded ? R.fad : 0, s.p]);
          const win = 30 * V.speed;
          while (s.hist.length && s.hist[0][0] < s.t - win) s.hist.shift();
          pQ.set({ series: [{ pts: s.hist.map(q => [q[0], q[1]]), label: 'tools now' }, { pts: s.hist.map(q => [q[0], q[2]]), label: 'compressor', dash: [5, 4] }], hlines: [{ y: R.avg, label: 'average' }], x: { label: 'time (s)', min: Math.max(0, s.t - win), max: Math.max(win, s.t) }, y: { label: 'free air (L/min)', min: 0, max: Math.max(R.peak, R.fad, 100) * 1.05 } });
          pP.set({ series: [{ pts: s.hist.map(q => [q[0], q[3]]), label: 'receiver' }], hlines: [{ y: 6.3, label: 'tool rating 6.3 bar' }, { y: 7, label: 'cut-in' }, { y: 8, label: 'cut-out' }], x: { label: 'time (s)', min: Math.max(0, s.t - win), max: Math.max(win, s.t) }, y: { label: 'receiver (bar gauge)', min: Math.min(4, Math.floor(s.p)), max: 8.5 } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        kit.label(c, 'tools (lit while running)', 16, 18, { size: 11.5, weight: 700 });
        kit.label(c, 'all at once / average, L/min', 350, 18, { size: 10.5, color: C.muted });
        const rowMax = Math.max(1, ...tools.map(t => t.n * t.q));
        tools.forEach((t, j) => {
          const y = 42 + j * 38, sel = j === V.tool;
          kit.label(c, t.name, 16, y, { size: 11.5, weight: sel ? 700 : 500, color: t.n ? C.text : C.muted });
          kit.label(c, t.n + ' × ' + Math.round(t.q) + ' L/min, ' + t.u.toFixed(0) + ' %', 16, y + 14, { size: 10.5, color: sel ? C.accent : C.muted });
          s.units.filter(u => u.j === j).forEach((u, i) => kit.dot(c, 206 + i * 14, y + 6, 5, u.on ? C.series[j % 7] : C.bg2, u.on ? C.series[j % 7] : C.faint));
          const bw = 120;
          c.fillStyle = C.surface; c.fillRect(350, y - 2, bw, 16);
          c.globalAlpha = 0.35; c.fillStyle = C.series[j % 7]; c.fillRect(350, y - 2, bw * t.n * t.q / rowMax, 16); c.globalAlpha = 1;
          c.fillStyle = C.series[j % 7]; c.fillRect(350, y - 2, bw * t.n * t.q * t.u / 100 / rowMax, 16);
          kit.label(c, (t.n * t.q * t.u / 100).toFixed(0), 476, y + 6, { size: 10.5, color: C.text });
        });
        // demand against the compressor
        const bars = [['average', R.avg, C.accent], ['+ reserve', R.need, C.accent], ['compressor', R.fad, C.ok], ['peak', R.peak, C.bad]];
        const top = 46, base = 270, mx = Math.max(R.peak, R.fad, 100);
        bars.forEach((b, i) => {
          const x = 540 + i * 54, hh = (base - top) * b[1] / mx;
          c.globalAlpha = i === 1 ? 0.55 : 1; c.fillStyle = b[2]; c.fillRect(x, base - hh, 38, hh); c.globalAlpha = 1;
          kit.label(c, b[1].toFixed(0), x + 19, base - hh - 9, { size: 10.5, weight: 700, align: 'center' });
          kit.label(c, b[0], x + 19, base + 12, { size: 10, color: C.muted, align: 'center' });
        });
        const yNow = base - (base - top) * Math.min(mx, s.q) / mx;
        c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(534, yNow); c.lineTo(752, yNow); c.stroke(); c.setLineDash([]);
        kit.label(c, 'now ' + s.q.toFixed(0), 752, yNow - 8, { size: 10, color: C.warn, align: 'right' });
        kit.label(c, 'free air, L/min', 540, 26, { size: 10.5, color: C.muted });
        // compressor, receiver and the line to the tools
        const low = s.p < 6.3, st8 = s.p > 0.3 ? 'air' : 'idle';
        S.line(c, [[76, 372], [86, 372]], { state: 'air' }); S.line(c, [[122, 372], [140, 372]], { state: st8 });
        S.line(c, [[260, 372], [740, 372]], { state: st8 }); S.line(c, [[200, 343], [200, 354]], { state: st8 });
        s.ph += dt * 40 * Math.min(3, s.q / 500);
        if (s.q > 0) S.flow(c, [[260, 372], [740, 372]], s.ph, { color: S.col('air') });
        if (s.loaded) S.flow(c, [[76, 372], [140, 372]], s.t * 40, { color: S.col('air') });
        S.compressor(c, 50, 372, { rot: 90, motor: true });
        S.check(c, 104, 372, { rot: 90, open: s.loaded });
        receiver(c, C, 200, 372, 120, 36, airTint(C, s.p * 1e5, 9e5));
        kit.label(c, V.vr.toFixed(0) + ' L', 200, 372, { size: 11, weight: 700, align: 'center' });
        S.gauge(c, 200, 322, { frac: s.p / 12, value: s.p.toFixed(2) + ' bar' });
        kit.label(c, R.motor + ' kW, ' + R.fad.toFixed(0) + ' L/min, ' + (s.loaded ? 'loaded' : 'unloaded'), 20, 405, { size: 10.5, color: C.muted });
        kit.label(c, 'to the tools: ' + s.q.toFixed(0) + ' L/min', 740, 356, { size: 11, weight: 700, align: 'right' });
        if (low) kit.label(c, 'below 6.3 bar: the tools lose power', 740, 392, { size: 11, weight: 700, color: C.bad, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------ dilute-phase pneumatic conveying */
  // v80: saltation velocity in an 80 mm pipe at a loading ratio of 10 (m/s); K: solids friction relative to the air's; r: drawn particle size (px)
  const MATERIALS = [
    { name: 'Flour', v80: 10, K: 0.3, r: 1.3 },
    { name: 'Cement', v80: 10.5, K: 0.35, r: 1.3 },
    { name: 'Granulated sugar', v80: 12.5, K: 0.45, r: 2 },
    { name: 'Plastic pellets, 3 mm', v80: 14, K: 0.5, r: 3 },
    { name: 'Wheat', v80: 14.5, K: 0.5, r: 2.8 },
    { name: 'Coarse sand', v80: 17.5, K: 0.7, r: 2 }
  ];

  Hyper.sim('app-conveying', {
    title: 'A dilute-phase conveying line',
    blurb: `A blower feeds air into a horizontal line; a rotary valve drops the product in at the pickup, and the air carries it to a filter receiver. Set the air velocity at the pickup: the blower's free-air flow follows from it and the pressure there. The **saltation velocity** grows with the square root of the bore (a Froude scaling, as in Rizk's correlation) and a little with the loading ratio; its level for each material is fitted to typical practice. Below it the particles drop out, a layer builds into dunes and a plug, and the line **blocks**. The pressure drop adds the air's friction (Darcy, with the friction factor from kit.fluid), the product's friction (K·φ times the air's) and the acceleration of the product at the pickup; the air expands as its pressure falls, so it is slowest at the pickup. Particle motion is drawn in slow motion.

**Try this**
- Pellets at 20 m/s: suspended, with a margin. Lower the velocity slowly and watch the particles sink to the bottom as you pass 1.2 × the saltation velocity, then settle into dunes below it.
- Let it block, then open the air up again: a settled layer is picked up again, but a plug is not — vent and purge it.
- At a fixed velocity, raise the feed: the loading ratio, the saltation velocity and the pressure drop all rise.
- Read the state diagram under the stage: the pressure drop has its minimum close to saltation — the most economical point is also the edge of blocking.
- Compare flour with coarse sand, and an 80 mm with a 150 mm pipe at the same velocity.`,
    mount(box, kit) {
      const F = kit.fluid, S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gdiv = document.createElement('div');
      gdiv.style.cssText = 'padding:4px 10px 10px';
      box.stage.appendChild(gdiv);
      const PMAX = 1.0e5, X0 = 100, X1 = 684, YC = 190, RP = 28, SPAWN = 190;   // blower relief; the drawn pipe
      let seed = 777;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      const s = { b: 0, blocked: false, parts: [], acc: 0, t: 0, ph: 0, rot: 0, key: '' };
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: MATERIALS.map((m, i) => [m.name, i]), value: 3 },
        { id: 'v', label: 'Air velocity at the pickup', min: 5, max: 35, step: 0.5, value: 20, unit: 'm/s' },
        { id: 'ms', label: 'Product feed', min: 0.5, max: 20, step: 0.1, value: 5, unit: 't/h' },
        { id: 'D', type: 'select', label: 'Pipe bore', options: [['50 mm', 50], ['65 mm', 65], ['80 mm', 80], ['100 mm', 100], ['125 mm', 125], ['150 mm', 150]], value: 80 },
        { id: 'L', label: 'Line length (bends as equivalent length)', min: 10, max: 300, step: 5, value: 100, unit: 'm' },
        { type: 'buttons', items: [{ id: 'purge', label: 'Vent and purge the line' }] }
      ], (id) => { if (id === 'purge') { s.blocked = false; s.b = 0; } });
      const ro = kit.readout(box.side, [['Q', 'Free air from the blower'], ['phi', 'Solids loading ratio φ = ṁs/ṁa'], ['vs', 'Saltation velocity (keep 1.2 × above)'], ['p', 'Pressure at the pickup (gauge)'], ['vo', 'Air velocity: pickup → outlet'], ['dp', 'Pressure drop: air / product / acceleration'], ['pw', 'Blower power (adiabatic, 60 %)'], ['state', 'State']]);
      const plot = kit.plot(gdiv, { x: { label: 'air velocity at the pickup (m/s)', min: 5, max: 35 }, y: { label: 'pressure drop over the line (bar)', min: 0 }, legend: true }, 150);
      const V = ctl.values;
      const salt = (m, D, phi) => m.v80 * Math.sqrt(D / 0.08) * Math.pow(Math.max(phi, 0.5) / 10, 0.15);
      // steady line: the pickup pressure is the sum of the drops to the outlet (at atmosphere); it sets the air density there
      function solve(v, msKg) {
        const m = MATERIALS[V.mat] || MATERIALS[0], D = V.D / 1000, A = Math.PI * D * D / 4;
        let p = 0.2e5, r = null;
        for (let it = 0; it < 40; it++) {
          const rhoP = (p + PATM) / RT, ma = rhoP * v * A, phi = msKg / Math.max(1e-9, ma);
          const rhoM = (p / 2 + PATM) / RT, vm = ma / (rhoM * A);
          const f = F.friction(Math.max(1, rhoM * vm * D / 1.8e-5), 4.6e-5 / D);
          const dpA = f * V.L / D * rhoM * vm * vm / 2;
          const vs = salt(m, D, phi), settle = v < vs ? 1 + 4 * (vs - v) / vs : 1;
          const dpS = m.K * phi * dpA * settle, dpAcc = msKg * 0.8 * v / A;
          p = 0.5 * p + 0.5 * (dpA + dpS + dpAcc);
          r = { p, ma, phi, dpA, dpS, dpAcc, vs, A, rhoP, m, vOut: ma / (PATM / RT * A) };
        }
        return r;
      }
      function curves() {
        const msKg = V.ms / 3.6, ser = [[0, 'air only'], [msKg, 'this feed'], [2 * msKg, 'twice the feed']];
        const out = ser.map(([mk, label], i) => {
          const pts = [];
          for (let v = 5; v <= 35.01; v += 0.5) { const r = solve(v, mk); if (r.p < 2.5e5) pts.push([v, r.p / 1e5]); }
          return { pts, label, dash: i === 0 ? [5, 4] : i === 2 ? [2, 3] : undefined };
        });
        const r = solve(V.v, msKg);
        plot.set({ series: out, marks: [{ x: V.v, y: r.p / 1e5, label: 'now' }], vlines: [{ x: r.vs, label: 'saltation' }], hlines: [{ y: PMAX / 1e5, label: 'blower relief' }] });
      }
      const loop = kit.loop((dt) => {
        const key = [V.mat, V.v, V.ms, V.D, V.L].join('|');
        if (key !== s.key) { s.key = key; curves(); }
        const C = kit.colors(), msKg = V.ms / 3.6, r = solve(V.v, msKg), m = r.m;
        const over = r.p > PMAX;
        // the layer on the bottom of the pipe grows below saltation (or when the blower cannot give the pressure) and is picked up again above it
        const n = Math.ceil(dt / 0.01);
        for (let i = 0; i < n; i++) {
          const h = dt / n;
          if (s.blocked) continue;
          if (V.v < r.vs) s.b += h * 0.25 * (r.vs - V.v) / r.vs * (1 + r.phi / 10);
          else s.b -= h * 0.3 * (V.v - r.vs) / r.vs;
          if (over) s.b += h * 0.3;
          s.b = clamp(s.b, 0, 1);
          if (s.b >= 1) s.blocked = true;
        }
        const pg = s.blocked ? PMAX : Math.min(r.p, PMAX);
        const Qanr = s.blocked ? 0 : r.ma / RHO_ANR;
        const pw = s.blocked ? 0 : F.compressorWork(PATM, r.p + PATM, Qanr * 1e5 / PATM, 1.4) / 0.6;
        ro.set('Q', (Qanr * 60).toFixed(2) + ' m³/min ANR' + (s.blocked ? ' (blocked: the blower blows off)' : ''));
        ro.set('phi', r.phi.toFixed(1) + (r.phi <= 15 ? ' (dilute phase)' : ' (too dense for dilute phase)'));
        ro.set('vs', r.vs.toFixed(1) + ' m/s; aim above ' + (1.2 * r.vs).toFixed(1) + ' m/s');
        ro.set('p', (pg / 1e5).toFixed(3) + ' bar' + (over && !s.blocked ? ' needed ' + (r.p / 1e5).toFixed(2) + ' — over the blower\'s 1 bar' : ''));
        ro.set('vo', s.blocked ? 'no flow' : V.v.toFixed(1) + ' → ' + r.vOut.toFixed(1) + ' m/s');
        ro.set('dp', (r.dpA / 1e5).toFixed(3) + ' / ' + (r.dpS / 1e5).toFixed(3) + ' / ' + (r.dpAcc / 1e5).toFixed(3) + ' bar');
        ro.set('pw', (pw / 1000).toFixed(1) + ' kW');
        const margin = V.v / r.vs;
        const state = s.blocked ? 'BLOCKED: a plug fills the pipe — vent and purge' : over ? 'The line needs more than the blower can give: it is choking up' : margin < 1 ? 'Below saltation: the product settles into dunes (' + (s.b * 100).toFixed(0) + ' % towards a plug)' : margin < 1.2 ? 'Strand flow: the product runs along the bottom, little margin' : 'Suspended: ' + ((margin - 1) * 100).toFixed(0) + ' % above saltation';
        ro.set('state', state);
        // ---- particles (slow motion): suspended above saltation, sinking below it
        const uAt = x => { const f = clamp((x - X0) / (X1 - X0), 0, 1), px = pg * (1 - f); return s.blocked ? 0 : r.ma / ((px + PATM) / RT * r.A); };
        const layerAt = x => {
          if (s.blocked) return (x < SPAWN + 170 ? 1 : 0.35) * (0.9 + 0.1 * Math.sin(x / 9));
          const f = clamp((x - X0) / (X1 - X0), 0, 1);
          return s.b * 0.85 * Math.max(0, 1 - 0.8 * f) * (0.75 + 0.25 * Math.sin(x / 23 + 1));
        };
        if (!s.blocked) {
          s.acc += dt * V.ms * 6;
          while (s.acc >= 1 && s.parts.length < 400) { s.acc -= 1; s.parts.push({ x: SPAWN + (rnd() - 0.5) * 10, y: 0.1 + 0.2 * rnd() }); }
          s.acc = Math.min(s.acc, 5);
        }
        const keep = [];
        for (const q of s.parts) {
          const u = uAt(q.x), bottom = 1 - layerAt(q.x);
          if (!s.blocked) {
            q.x += 0.8 * u * 6 * dt;
            const mean = 0.5 + 0.5 * Math.min(1, Math.pow(r.vs / Math.max(u, 0.1), 2));
            q.y += (mean - q.y) * Math.min(1, dt * 2.5) + (rnd() - 0.5) * 0.9 * Math.sqrt(dt) * Math.min(1, u / r.vs);
          } else q.y += dt * 0.3;
          q.y = clamp(q.y, 0.06, bottom - 0.03);
          if (q.x > X1 - 2) continue;                                  // delivered into the receiver
          if (!s.blocked && u < r.vs && q.y >= bottom - 0.035 && rnd() < dt * 3) continue;   // settled into the layer
          keep.push(q);
        }
        s.parts = keep;
        s.t += dt; if (!s.blocked) s.rot += dt * V.ms * 0.4;
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        // blower and air line
        S.line(c, [[76, YC], [X0, YC]], { state: s.blocked ? 'idle' : 'air' });
        S.compressor(c, 50, YC, { rot: 90, motor: true });
        kit.label(c, 'blower', 50, YC + 34, { size: 10.5, color: C.muted, align: 'center' });
        if (s.blocked) { S.exhaust(c, 50, YC + 40, { silencer: true }); kit.label(c, 'relief blowing off', 50, YC + 70, { size: 10.5, color: C.bad, align: 'center', weight: 700 }); }
        // the pipe, air tinted by its pressure, and the settled layer
        c.fillStyle = C.surface; c.fillRect(X0, YC - RP, X1 - X0, 2 * RP);
        for (let x = X0; x < X1; x += 12) { const f = (x - X0) / (X1 - X0), t = airTint(C, pg * (1 - f) + 0.13e5, 1.2e5); if (t) { c.fillStyle = t; c.fillRect(x, YC - RP, 12, 2 * RP); } }
        c.fillStyle = C.dark ? 'rgba(224,160,48,.75)' : 'rgba(176,120,20,.7)';
        c.beginPath(); c.moveTo(X0, YC + RP);
        for (let x = X0; x <= X1; x += 4) c.lineTo(x, YC + RP - 2 * RP * layerAt(x));
        c.lineTo(X1, YC + RP); c.closePath(); c.fill();
        c.fillStyle = C.warn;
        for (const q of s.parts) { c.beginPath(); c.arc(q.x, YC - RP + 2 * RP * q.y, m.r, 0, Math.PI * 2); c.fill(); }
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        c.beginPath(); c.moveTo(X0, YC - RP); c.lineTo(X1, YC - RP); c.moveTo(X0, YC + RP); c.lineTo(X1, YC + RP); c.stroke();
        // hopper and rotary valve at the pickup
        c.fillStyle = C.dark ? 'rgba(224,160,48,.35)' : 'rgba(224,160,48,.3)';
        c.beginPath(); c.moveTo(160, 64); c.lineTo(220, 64); c.lineTo(200, 108); c.lineTo(180, 108); c.closePath(); c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        c.beginPath(); c.arc(SPAWN, 126, 17, 0, Math.PI * 2); c.stroke();
        for (let i = 0; i < 6; i++) { const a = s.rot + i * Math.PI / 3; c.beginPath(); c.moveTo(SPAWN, 126); c.lineTo(SPAWN + 16 * Math.cos(a), 126 + 16 * Math.sin(a)); c.lineWidth = 1.4; c.stroke(); }
        c.lineWidth = 1.8; c.beginPath(); c.moveTo(SPAWN - 6, 143); c.lineTo(SPAWN - 6, YC - RP); c.moveTo(SPAWN + 6, 143); c.lineTo(SPAWN + 6, YC - RP); c.stroke();
        kit.label(c, 'rotary valve, ' + V.ms.toFixed(1) + ' t/h', 232, 126, { size: 11, color: C.muted });
        S.line(c, [[130, 152], [130, YC - RP]], { state: 'air' });
        S.gauge(c, 130, 131, { frac: pg / 1.2e5, value: (pg / 1e5).toFixed(2) + ' bar' });
        // filter receiver
        c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(X1, 120); c.lineTo(744, 120); c.lineTo(744, 230); c.lineTo(722, 262); c.lineTo(706, 262); c.lineTo(X1, 230); c.closePath(); c.stroke();
        c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X1 + 6, 140); c.lineTo(738, 140); c.stroke(); c.setLineDash([]);
        kit.arrow(c, 714, 116, 714, 88, S.col('exhaust'), 2);
        kit.label(c, 'air out via filter', 714, 78, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'receiver', 714, 276, { size: 10.5, color: C.muted, align: 'center' });
        // velocities along the line
        kit.label(c, 'pickup ' + (s.blocked ? 0 : V.v).toFixed(1) + ' m/s', X0 + 110, YC + RP + 16, { size: 11, weight: 700 });
        kit.label(c, 'outlet ' + (s.blocked ? 0 : r.vOut).toFixed(1) + ' m/s', X1 - 6, YC + RP + 16, { size: 11, weight: 700, align: 'right' });
        kit.label(c, 'saltation ' + r.vs.toFixed(1) + ' m/s', X0 + 110, YC + RP + 32, { size: 11, color: margin < 1 ? C.bad : margin < 1.2 ? C.warn : C.muted });
        // pressure and velocity along the line
        const gx = 40, gw = 330, gy = 300, gh = 90;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        kit.label(c, 'along the line: pressure (blue) and air velocity (orange)', gx, gy - 12, { size: 10.5, color: C.muted });
        const vmaxG = Math.max(35, r.vOut * 1.1);
        c.strokeStyle = S.col('air'); c.lineWidth = 2; c.beginPath(); c.moveTo(gx, gy + gh - gh * pg / 1.2e5); c.lineTo(gx + gw, gy + gh); c.stroke();
        c.strokeStyle = C.warn; c.beginPath();
        for (let i = 0; i <= 20; i++) { const x = X0 + (X1 - X0) * i / 20, u = uAt(x); const yy = gy + gh - gh * u / vmaxG; if (i) c.lineTo(gx + gw * i / 20, yy); else c.moveTo(gx, yy); }
        c.stroke();
        const ys = gy + gh - gh * r.vs / vmaxG;
        c.setLineDash([4, 3]); c.strokeStyle = C.bad; c.beginPath(); c.moveTo(gx, ys); c.lineTo(gx + gw, ys); c.stroke(); c.setLineDash([]);
        kit.label(c, 'saltation', gx + gw + 4, ys, { size: 10, color: C.bad });
        kit.label(c, '0 m', gx, gy + gh + 11, { size: 10, color: C.muted });
        kit.label(c, V.L.toFixed(0) + ' m', gx + gw, gy + gh + 11, { size: 10, color: C.muted, align: 'right' });
        // the pressure drop, split
        const bx = 440, bw = 300, tot = Math.max(1, r.dpA + r.dpS + r.dpAcc);
        kit.label(c, 'pressure drop ' + ((r.dpA + r.dpS + r.dpAcc) / 1e5).toFixed(3) + ' bar', bx, 300, { size: 11.5, weight: 700 });
        let xx = bx;
        [[r.dpA, S.col('air'), 'air'], [r.dpS, C.warn, 'product'], [r.dpAcc, C.bad, 'acceleration']].forEach(([v, col, lab]) => {
          const w = bw * v / tot; c.fillStyle = col; c.fillRect(xx, 312, w, 18);
          if (w > 44) kit.label(c, lab, xx + w / 2, 340, { size: 10, color: C.muted, align: 'center' });
          xx += w;
        });
        kit.label(c, state, bx, 372, { size: 12, weight: 700, color: s.blocked ? C.bad : margin < 1 ? C.bad : margin < 1.2 ? C.warn : C.ok });
        kit.label(c, 'φ = ' + r.phi.toFixed(1) + ', free air ' + (Qanr * 60).toFixed(2) + ' m³/min', bx, 394, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ------------------------------------------------------------------ soft pneumatic finger and gripper */
  // m mass (kg), r radius (mm), mu friction against silicone (assumed), k stiffness (N/m) for the squeeze drawn
  const OBJECTS = [
    { name: 'Nothing (free fingers)', m: 0, r: 0, mu: 0, k: 1, col: 'muted' },
    { name: 'Strawberry, 25 g, 30 mm', m: 0.025, r: 15, mu: 0.6, k: 400, col: 'bad' },
    { name: 'Egg, 60 g, 45 mm', m: 0.06, r: 22.5, mu: 0.4, k: 50000, col: 'muted' },
    { name: 'Tomato, 100 g, 60 mm', m: 0.1, r: 30, mu: 0.6, k: 1500, col: 'bad' },
    { name: 'Foam ball, 10 g, 60 mm', m: 0.01, r: 30, mu: 0.8, k: 150, col: 'warn' }
  ];

  Hyper.sim('app-soft-finger', {
    title: 'A soft gripper: bending, touching, holding',
    blurb: `Two moulded silicone fingers, each with a row of air chambers on its outer side and a **strain-limiting layer** on the side facing the object. Inflating the chambers stretches the outer side, so the finger curls towards the limited side. The linear model gives a constant curvature, θ = (L/h)·(p/E); with "stiffening" on, the chambered layer's effective stiffness rises with strain as E·(1 + (ε/0.4)²), so the bend grows more slowly than the pressure. Once a finger touches the object it stops bending, and the extra pressure becomes grip: **F = (p − p_contact)·A_w·y/L**, with chamber end walls of A_w = 3 cm² at y = 0.8 h from the limiting layer. The gripper holds when the friction of both fingers, 2·μ·F, is more than m·(g + a) while it lifts. A regulator (with a relief valve) feeds the fingers from the 6 bar line through a 3/2 valve.

**Try this**
- Nothing in the gripper: raise the pressure from 0 to 1 bar and compare the bend with the linear model in the graph. What pressure gives a right angle?
- The strawberry: the fingers touch at about 0.3 bar; at 0.6 bar each presses with under a newton. Lift it with 10 m/s² and read the safety factor.
- Lower the pressure until the strawberry slips while lifting, though it would still hang at rest.
- Try the egg (slippery and heavy) and the foam ball (it squashes).
- Make the finger longer or softer (lower E): it wraps further for the same pressure, but its tip force for a given pressure falls with 1/L.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const gbox = document.createElement('div');
      gbox.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:1fr 1fr;gap:8px';
      box.stage.appendChild(gbox);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      gbox.appendChild(g1); gbox.appendChild(g2);
      const AW = 3e-4, ES = 0.4, ZMAX = 40, PX = 235, PY = 78;          // chamber end-wall area (m²), stiffening strain, lift (px), palm
      const s = { pc: 0, valve: true, z: 0, vz: 0, up: false, carried: false, oy: 0, ovy: 0, msg: '', key: '', tPlot: 1, ph: 0 };
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Regulator setting (chamber pressure)', min: 0, max: 1, step: 0.01, value: 0.6, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'grip', label: 'Grip', primary: true }, { id: 'open', label: 'Open' }] },
        { type: 'buttons', items: [{ id: 'lift', label: 'Lift' }, { id: 'down', label: 'Put down' }] },
        { id: 'obj', type: 'select', label: 'Object', options: OBJECTS.map((o, i) => [o.name, i]), value: 1 },
        { id: 'gap', label: 'Finger spacing (base to base)', min: 40, max: 160, step: 1, value: 80, unit: 'mm' },
        { id: 'a', label: 'Lifting acceleration', min: 0, max: 20, step: 0.5, value: 10, unit: 'm/s²' },
        { id: 'L', label: 'Finger length L', min: 50, max: 150, step: 1, value: 80, unit: 'mm' },
        { id: 'h', label: 'Limiting layer to chamber walls, h', min: 5, max: 20, step: 0.5, value: 10, unit: 'mm' },
        { id: 'E', label: 'Effective stiffness E (fitted)', min: 0.1, max: 1, step: 0.01, value: 0.4, unit: 'MPa' },
        { id: 'stiff', type: 'check', label: 'Rubber stiffens at large strain', value: true }
      ], (id, v) => {
        if (id === 'grip') s.valve = true;
        if (id === 'open') s.valve = false;
        if (id === 'lift') s.up = true;
        if (id === 'down') s.up = false;
        if (id === 'obj') { const o = OBJECTS[v] || OBJECTS[0]; if (o.r) ctl.set('gap', Math.round(2 * o.r + 2 * V.h + 30)); s.carried = false; s.oy = 0; s.ovy = 0; }
      });
      const ro = kit.readout(box.side, [['th', 'Bend, free: linear / model'], ['k', 'Curvature κ = θ/L'], ['pc', 'Chamber pressure / touches at'], ['F', 'Tip force per finger'], ['hold', 'Friction 2μF / needed m(g + a)'], ['state', 'State']]);
      const pTh = kit.plot(g1, { x: { label: 'chamber pressure (bar gauge)', min: 0, max: 1 }, y: { label: 'bend angle (°)', min: 0 }, legend: true }, 150);
      const pF = kit.plot(g2, { x: { label: 'chamber pressure (bar gauge)', min: 0, max: 1 }, y: { label: 'tip force per finger (N)', min: 0 } }, 150);
      const V = ctl.values;
      // strain of the chambered layer for a pressure (bar): p/E = ε(1 + (ε/ES)²), solved by Newton
      const strain = pb => {
        const x = Math.abs(pb) * 0.1 / V.E;
        if (!V.stiff) return Math.sign(pb) * x;
        let e = x;
        for (let i = 0; i < 30; i++) { const f = e * (1 + e * e / (ES * ES)) - x, d = 1 + 3 * e * e / (ES * ES); e = Math.max(0, e - f / d); }
        return Math.sign(pb) * e;
      };
      const pressFor = eps => V.E * eps * (V.stiff ? 1 + eps * eps / (ES * ES) : 1) * 10;     // bar
      // the finger's centre line (mm, palm at y = 0), bending towards +x for side = +1
      const arc = (theta, x0, side, n) => {
        const L = V.L, kap = theta / L, pts = [];
        for (let i = 0; i <= n; i++) {
          const sL = L * i / n, ph = kap * sL;
          pts.push(Math.abs(kap) < 1e-6 ? [x0, sL, ph] : [x0 + side * (1 - Math.cos(ph)) / kap, Math.sin(ph) / kap, ph]);
        }
        return pts;
      };
      const objY = o => V.L + 5 - o.r;
      // the smallest bend at which the left finger's limiting layer (with 1.5 mm of skin) touches the object (null: never, up to maxTheta)
      function contactTheta(o, maxTheta) {
        if (!o.r) return null;
        const reach = o.r + 1.5, oy = objY(o);
        const dmin = th => Math.min(...arc(th, -V.gap / 2, 1, 24).map(q => Math.hypot(q[0], q[1] - oy)));
        if (dmin(0) <= reach) return 0;
        for (let th = 0.01; th <= maxTheta + 1e-9; th += 0.01) if (dmin(th) <= reach) return th;
        return null;
      }
      const loop = kit.loop((dt) => {
        const o = OBJECTS[V.obj] || OBJECTS[0], n = Math.ceil(dt / 0.005);
        const thetaMax = strain(1) * V.L / V.h;
        const key = [V.obj, V.gap, V.L, V.h, V.E, V.stiff].join('|');
        if (key !== s.key) { s.key = key; s.thC = contactTheta(o, Math.max(thetaMax, 0.01)); s.tPlot = 1; }
        const thC = s.thC, pC = thC == null ? null : pressFor(thC * V.h / V.L);
        // chamber pressure through the valve: filling and exhausting take a few tenths of a second
        for (let i = 0; i < n; i++) { const h = dt / n; s.pc += ((s.valve ? V.p : 0) - s.pc) * Math.min(1, h / 0.25); }
        const thFree = strain(s.pc) * V.L / V.h, thLin = s.pc * 0.1 / V.E * V.L / V.h;
        const present = o.r > 0 && (s.carried || s.oy >= s.z - 1);        // the object is still between the fingers
        const touching = present && thC != null && thFree >= thC;
        const theta = touching ? thC : thFree;
        const Fn = touching ? Math.max(0, s.pc - pC) * 1e5 * AW * 0.8 * V.h / V.L : 0;
        // lifting: the gripper accelerates up; the object comes along only while friction holds it
        const accel = s.up && s.z < ZMAX ? V.a : 0;
        const fric = 2 * o.mu * Fn, need = o.m * (G + accel);
        const holds = o.r > 0 && touching && fric >= need && Fn > 0;
        for (let i = 0; i < n; i++) {
          const h = dt / n;
          if (s.up) { s.vz = Math.min(90, s.vz + (40 + 12 * V.a) * h); s.z = Math.min(ZMAX, s.z + s.vz * h); if (s.z >= ZMAX) s.vz = 0; }
          else { s.vz = 0; s.z = Math.max(0, s.z - 60 * h); }
        }
        if (present && s.z > 0.5 && holds) s.carried = true;
        if (s.carried && !holds) { s.carried = false; s.msg = s.up ? 'It slipped out while lifting' : ''; }
        if (s.carried) { s.oy = s.z; s.ovy = 0; }
        else { for (let i = 0; i < n; i++) { const h = dt / n; if (s.oy > 0) { s.ovy += 600 * h; s.oy = Math.max(0, s.oy - s.ovy * h); } else s.ovy = 0; } }
        if (!s.up && s.z < 0.5) s.msg = '';
        const deg = x => x * 180 / Math.PI;
        ro.set('th', deg(thLin).toFixed(0) + '° / ' + deg(thFree).toFixed(0) + '°');
        ro.set('k', (theta / V.L * 1000).toFixed(1) + ' /m' + (Math.abs(theta) > 1e-3 ? ' (radius ' + (V.L / theta).toFixed(0) + ' mm)' : ' (straight)'));
        ro.set('pc', s.pc.toFixed(2) + ' bar / ' + (pC == null ? (o.r ? 'not within 1 bar' : '—') : pC.toFixed(2) + ' bar'));
        ro.set('F', Fn.toFixed(2) + ' N');
        const needLift = o.m * (G + V.a);
        ro.set('hold', o.r ? fric.toFixed(2) + ' N / ' + needLift.toFixed(2) + ' N' : '—');
        const state = !o.r ? 'Free fingers: bend ' + deg(theta).toFixed(0) + '°' : s.msg ? s.msg : !touching ? 'Not touching yet' + (pC != null ? ': it needs ' + pC.toFixed(2) + ' bar' : '') : Fn <= 0 ? 'Touching, no grip yet' : fric >= needLift ? 'Holds while lifting, safety factor ' + (fric / needLift).toFixed(1) : fric >= o.m * G ? 'Holds at rest, but slips if lifted at ' + V.a.toFixed(1) + ' m/s²' : 'Would slip even at rest';
        ro.set('state', state);
        s.tPlot += dt;
        if (s.tPlot > 0.2) {
          s.tPlot = 0;
          const lin = [], mod = [], fp = [];
          for (let i = 0; i <= 50; i++) {
            const pb = i / 50, tf = strain(pb) * V.L / V.h;
            lin.push([pb, deg(pb * 0.1 / V.E * V.L / V.h)]);
            mod.push([pb, deg(thC != null ? Math.min(tf, thC) : tf)]);
            fp.push([pb, thC != null && pb > pC ? (pb - pC) * 1e5 * AW * 0.8 * V.h / V.L : 0]);
          }
          const hl = thC != null ? [{ y: deg(thC), label: 'touches' }] : [];
          pTh.set({ series: [{ pts: lin, label: 'linear model', dash: [5, 4] }, { pts: mod, label: V.stiff ? 'with stiffening' : 'model' }], marks: [{ x: s.pc, y: deg(theta), label: 'now' }], hlines: hl, y: { label: 'bend angle (°)', min: 0, max: Math.max(30, lin[50][1] * 1.05) } });
          const needF = o.r && o.mu ? o.m * (G + V.a) / (2 * o.mu) : 0;
          pF.set({ series: [{ pts: fp, label: 'tip force' }], marks: [{ x: s.pc, y: Fn, label: 'now' }], hlines: needF ? [{ y: needF, label: 'needed to lift at ' + V.a.toFixed(1) + ' m/s²' }] : [], y: { label: 'tip force per finger (N)', min: 0, max: Math.max(0.5, fp[50][1] * 1.1, needF * 1.3) } });
        }
        // ---- drawing on a 760 × 420 design grid
        const c = st.begin(), C = kit.colors(), k = Math.min(st.W / 760, st.H / 420);
        c.save(); c.translate((st.W - 760 * k) / 2, (st.H - 420 * k) / 2); c.scale(k, k);
        const sc = Math.min(2.4, 240 / (V.L + 12)), py = PY - s.z, tableY = PY + (V.L + 5) * sc;
        // table
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(30, tableY); c.lineTo(440, tableY); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; for (let x = 34; x < 440; x += 12) { c.beginPath(); c.moveTo(x, tableY); c.lineTo(x - 8, tableY + 8); c.stroke(); }
        // the object, squeezed a little by the grip
        if (o.r) {
          const sq = Math.min(0.3 * o.r, Fn / o.k * 1000), ox = PX, oyc = PY + objY(o) * sc - s.oy;
          c.fillStyle = C[o.col] || C.muted; c.globalAlpha = 0.8;
          c.beginPath(); c.ellipse(ox, oyc + sq * sc * 0.4, Math.max(2, (o.r - sq) * sc), (o.r + sq * 0.4) * sc, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        }
        // palm and the air line
        const palmW = V.gap * sc + 2 * V.h * sc + 24;
        c.fillStyle = C.surface; c.fillRect(PX - palmW / 2, py - 16, palmW, 16); c.strokeStyle = C.text; c.lineWidth = 1.8; c.strokeRect(PX - palmW / 2, py - 16, palmW, 16);
        // the fingers: a band with chambers on the outer side and the limiting layer on the inner side
        const air = airTint(C, s.pc * 1e5, 1e5) || C.surface;
        for (const side of [1, -1]) {
          // the arc is the limiting layer (inner side); the chambered body lies outside it, h thick, bulging with pressure
          const pts = arc(theta, side * -V.gap / 2, side, 40), t = V.h * sc, inner = [], outer = [];
          pts.forEach((q, i) => {
            const nx = side * Math.cos(q[2]), ny = -Math.sin(q[2]), X = PX + q[0] * sc, Y = py + q[1] * sc;
            const bump = i > 0 && i < 40 ? (2 + 5 * Math.max(0, s.pc)) * Math.abs(Math.sin(Math.PI * 7 * i / 40)) : 0;
            inner.push([X, Y]); outer.push([X - nx * (t + bump), Y - ny * (t + bump)]);
          });
          c.beginPath(); inner.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); outer.slice().reverse().forEach(q => c.lineTo(q[0], q[1])); c.closePath();
          c.fillStyle = air; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
          c.strokeStyle = C.warn; c.lineWidth = 3.5; c.beginPath(); inner.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
          if (Fn > 0 && o.r) {
            const oyc = PY + objY(o) * sc - s.oy;
            let best = inner[0], bd = 1e9;
            for (const q of inner) { const d = Math.hypot(q[0] - PX, q[1] - oyc); if (d < bd) { bd = d; best = q; } }
            const L2 = 10 + 18 * Math.min(1.5, Fn), ux = (PX - best[0]) / Math.max(1, bd), uy = (oyc - best[1]) / Math.max(1, bd);
            kit.arrow(c, best[0] - ux * L2, best[1] - uy * L2, best[0], best[1], C.bad, 2.2);
          }
        }
        kit.label(c, 'θ = ' + deg(theta).toFixed(0) + '°', PX + palmW / 2 + 8, py - 8, { size: 12, weight: 700 });
        if (Fn > 0) kit.label(c, 'F = ' + Fn.toFixed(2) + ' N', PX + palmW / 2 + 8, py + 10, { size: 11.5, weight: 700, color: C.bad });
        kit.label(c, 'orange: strain-limiting layer', 30, 404, { size: 10.5, color: C.muted });
        kit.label(c, state, 30, tableY + 26 > 390 ? 386 : tableY + 26, { size: 12, weight: 700, color: holds ? C.ok : touching || !o.r ? C.text : C.muted });
        // the supply: regulator with relief valve, gauge, 3/2 valve
        const stFill = s.pc > 0.02 ? (s.valve ? 'air' : 'exhaust') : 'idle';
        S.line(c, [[560, 365], [560, 359]], { state: 'air' });
        S.line(c, [[560, 301], [560, 275], [634.4, 275], [634.4, 254]], { state: 'air' });
        S.line(c, [[560, 275], [515, 275], [515, 265]], { state: 'air' }); S.junction(c, 560, 275);
        S.junction(c, 600, 275);
        S.line(c, [[634.4, 206], [634.4, 24], [PX, 24], [PX, py - 16]], { state: stFill });
        S.line(c, [[634.4, 121], [660, 121]], { state: stFill }); S.junction(c, 634.4, 121);
        S.gauge(c, 660, 100, { frac: s.pc / 1.2, value: s.pc.toFixed(2) + ' bar in the fingers' });
        s.ph += dt * 60;
        if (Math.abs((s.valve ? V.p : 0) - s.pc) > 0.01) S.flow(c, s.valve ? [[560, 301], [560, 275], [634.4, 275], [634.4, 24], [PX, 24], [PX, py - 16]] : [[PX, py - 16], [PX, 24], [634.4, 24], [634.4, 206], [645.6, 254], [645.6, 266]], s.ph, { color: S.col(s.valve ? 'air' : 'exhaust') });
        S.source(c, 560, 385, { pneumatic: true });
        kit.label(c, '6 bar line', 576, 392, { size: 10.5, color: C.muted });
        S.pressureValve(c, 560, 330, { kind: 'regulator', open: 1 });
        kit.label(c, 'regulator', 604, 345, { size: 10.5, color: C.muted });
        S.pressureValve(c, 515, 236, { kind: 'relief', open: 0 });
        S.exhaust(c, 515, 207, { rot: 180 });
        kit.label(c, 'relief 1 bar', 470, 236, { size: 10.5, color: C.muted, align: 'right' });
        S.gauge(c, 600, 254, { frac: V.p / 1.2, value: '' });
        kit.label(c, V.p.toFixed(2) + ' bar', 586, 236, { size: 10.5, color: C.text, align: 'right' });
        S.valve(c, 640, 230, { spec: '3/2 NC', state: s.valve ? 0 : 1, left: 'solenoid', right: 'spring', s: 28, pneumatic: true, labels: true, exhaust: true });
        kit.label(c, s.valve ? 'grip' : 'open', 700, 206, { size: 11, weight: 700, color: s.valve ? C.accent : C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
