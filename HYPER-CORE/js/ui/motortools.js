/* HYPER-CORE · ui/motortools.js
 *
 * The Tools pages of Hyper Motors.
 *
 *   #/tools/motorlab/<dc|induction|stepper|hydraulic|air>   a motor's characteristic from its data, with your load on it
 *   #/tools/sizing/<axis|conveyor|hoist|pumpfan|cable|choose>  sizing a motor for a job, cables, and a selection guide
 *   #/tools/wiring/<threephase|singlephase|starters|stepper|sensors>  interactive wiring diagrams
 *   #/tools/drives/<pwm|stepdir|vfd|softstart|homing>        drive signals, settings and sequences
 *
 * The models are HYPER-CORE/js/motors.js (kit.motor, tested by tools/test-motors.js). Typical values, for learning:
 * a real motor's datasheet, nameplate and the drive's manual govern.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, M = () => H.motor;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const f0 = x => Number.isFinite(x) ? Math.round(x).toLocaleString('en-GB') : '—';
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const font = () => getComputedStyle(document.body).fontFamily;
  const TAU = 2 * Math.PI;

  /* ---------------------------------------------------------------- form, layout, plots */
  // fields: [id, label, value, kind, extra]; kind 'q' (extra = [quantity, unit]: value in the quantity's base unit),
  // 'n' (a plain number, extra = unit label), 'range' (extra = [min, max, step]), 'sel', 'check', 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      if (kind === 'range') return '<label class="mfield"><span>' + esc(label) + ' <b class="rv" data-rv="' + id + '"></b></span><input type="range" data-f="' + id + '" min="' + extra[0] + '" max="' + extra[1] + '" step="' + extra[2] + '" value="' + value + '"></label>';
      const q = kind === 'q' ? H.units.Q[extra[0]] : null;
      const unit = q ? '<select class="munit" data-u="' + id + '">' + q.units.map(u => '<option' + (u[0] === extra[1] ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (extra ? '<i>' + esc(extra) + '</i>' : '');
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + unit + '</span></label>';
    }).join('');
    const defs = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, d = defs[id];
        if (d[3] === 'sel') { v[id] = inp.value; return; }
        if (d[3] === 'check') { v[id] = inp.checked; return; }
        if (d[3] === 'range') { v[id] = +inp.value; const rv = el.querySelector('[data-rv="' + id + '"]'); if (rv) rv.textContent = inp.value + (d[5] || ''); return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (d[3] === 'q') x = H.units.toSI(x, d[4][0], el.querySelector('[data-u="' + id + '"]').value);
        v[id] = x;
      });
      return v;
    };
    // set a field's displayed value (in the unit shown for 'q' fields: pass the value in that unit)
    read.set = (id, val) => { const inp = el.querySelector('[data-f="' + id + '"]'); if (!inp) return; if (inp.type === 'checkbox') inp.checked = !!val; else inp.value = String(val); };
    el.querySelectorAll('[data-u]').forEach(sel => {
      let prev = sel.value;
      sel.addEventListener('change', () => {
        const id = sel.dataset.u, q = defs[id][4][0], inp = el.querySelector('[data-f="' + id + '"]');
        const x = parseFloat(U.cleanNum(inp.value));
        if (Number.isFinite(x)) inp.value = String(Number(H.units.convert(x, q, prev, sel.value).toPrecision(5)));
        prev = sel.value;
        onChange(read());
      });
    });
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', e => { if (!e.target.dataset.u) onChange(read()); });
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), extra: ui.$('.mextra', el) };
  }
  function plotIn(el, opts, h) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px'; box.style.marginBottom = '10px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, Object.assign({ legend: true }, opts || {}));
    ui.onLeave(() => p.destroy());
    return p;
  }
  // a canvas that redraws itself with draw(ctx, w, h) on demand and on resize; animate(fn) runs fn(dt) each frame while the page is shown
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px'; box.style.marginBottom = '10px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px;touch-action:none';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    const onTheme = () => paint(); document.addEventListener('hyper:theme', onTheme); ui.onLeave(() => document.removeEventListener('hyper:theme', onTheme));
    let raf = 0, alive = true, last = 0;
    const animate = fn => {
      const tick = now => { if (!alive) return; const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; if (!document.hidden) { fn(dt); paint(); } raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    };
    ui.onLeave(() => { alive = false; cancelAnimationFrame(raf); });
    cv.addEventListener('pointerdown', e => { const r = cv.getBoundingClientRect(); if (api.onClick) { api.onClick(e.clientX - r.left, e.clientY - r.top); paint(); } });
    const api = { cv, paint, animate, get w() { return cv.clientWidth || 600; }, h, onClick: null };
    return api;
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';
  const note = (el, html) => { const d = document.createElement('div'); d.className = 'boxy small'; d.style.marginBottom = '10px'; d.innerHTML = html; el.appendChild(d); return d; };
  const warnBox = msg => '<div class="callout co-warn" style="margin:8px 0"><div class="co-h">Take care</div>' + msg + '</div>';
  const NOTE = 'Typical values from simple models, for learning and first estimates: the motor\'s datasheet and nameplate and the drive\'s manual govern. Mains wiring is work for a qualified electrician.';
  // a standard size at or above x from a list
  const nextUp = (x, list) => list.find(v => v >= x * 0.999) || list[list.length - 1];
  const IEC_KW = [0.09, 0.12, 0.18, 0.25, 0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315];

  // a typical three-phase cage motor of power P (kW) as an equivalent circuit, scaled from a 7.5 kW 400 V design:
  // impedances ∝ V²/P, with relatively more resistance and less magnetising reactance in small motors
  function cageMotor(P, V, f, poles, fRun, boost) {
    const z = Math.pow(V / 400, 2) * 7.5 / P, r = Math.pow(7.5 / P, 0.25), xm = Math.pow(P / 7.5, 0.2), k = (fRun || f) / f;
    return M().induction({ V_LL: fRun && fRun !== f ? M().vf({ Vn: V, fn: f, f: fRun, boost: boost == null ? 0.05 * V : boost }) : V, f: fRun || f, poles,
      R1: 0.7 * z * r, X1: 1.1 * z * k, R2: 0.55 * z * r, X2: 1.6 * z * k, Xm: 45 * z * xm * k, Pfw: 120 * P / 7.5 * k, deepBar: 1 });
  }
  // the slip at which a motor gives power P (W) on the stable side of its curve
  function slipAtPower(im, P) { let lo = 1e-5, hi = im.sMax; if (im.at(hi).Pmech < P) return null; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).Pmech < P) lo = m; else hi = m; } return hi; }
  function slipAtTorque(im, T) { let lo = 1e-5, hi = im.sMax; if (im.at(hi).T < T) return null; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).T < T) lo = m; else hi = m; } return hi; }

  /* ================================================================ MOTOR LAB */
  const LAB = [['dc', 'DC motor'], ['induction', 'Induction motor'], ['stepper', 'Stepper'], ['hydraulic', 'Hydraulic motor'], ['air', 'Air motor']];
  function motorlab(el, params, sub) {
    const T = subtabs(el, 'motorlab', LAB, sub, NOTE);
    ({ dc: labDC, induction: labIM, stepper: labStep, hydraulic: labHyd, air: labAir })[T.tab](T.body);
  }

  function labDC(el) {
    const L = layout(el, 'A permanent-magnet DC motor from four numbers on its datasheet — voltage, terminal resistance, motor constant and no-load current — with your load on it. The speed falls in a straight line as the torque rises; efficiency peaks at a light load.' + link('dc-torque-speed') + link('pmdc-motor') + link('pwm-speed-control'));
    const read = form(L.form, [['V', 'Supply voltage', 24, 'q', ['voltage', 'V']], ['R', 'Terminal resistance', 0.5, 'q', ['resistance', 'Ω']],
      ['K', 'Motor constant (torque or back-EMF)', 0.055, 'q', ['kemf', 'V·s/rad']], ['I0', 'No-load current', 0.25, 'q', ['current', 'A']],
      ['sep1', 'Your load', null, 'sep'], ['T', 'Load torque at the motor shaft', 0.25, 'q', ['torque', 'N·m']], ['duty', 'PWM duty cycle', 100, 'range', [0, 100, 1], '%'], ['temp', 'Winding temperature', 20, 'range', [20, 155, 5], ' °C']], calc);
    const p1 = plotIn(L.plot, { x: { label: 'torque (N·m)', min: 0 }, y: { label: 'speed (rpm)', min: 0 } }, 220);
    const p2 = plotIn(L.plot, { x: { label: 'torque (N·m)', min: 0 }, y: { label: '% of the largest value', min: 0, max: 100 } }, 200);
    function calc(v) {
      if (!(v.V > 0 && v.R > 0 && v.K > 0 && v.I0 >= 0)) { L.stats.innerHTML = '<p class="muted">Positive voltage, resistance and motor constant.</p>'; return; }
      const R = M().copperR(v.R, v.temp), Ve = v.V * v.duty / 100, d = M().dc({ V: Math.max(1e-6, Ve), R, K: v.K, I0: v.I0 }), cold = M().dc({ V: v.V, R: v.R, K: v.K, I0: v.I0 });
      const op = d.at(v.T), over = v.T >= d.stallTorque;
      const Kv = 60 / (TAU * v.K);
      L.stats.innerHTML = (over ? warnBox('The load torque is above the stall torque at this voltage: the motor cannot turn it and draws the full stall current of ' + f1(d.stallCurrent) + ' A.') : '') +
        stat('Operating point', over ? 'stalled' : f0(op.n) + ' rpm', over ? '' : f1(op.I, 2) + ' A, ' + f1(op.Pout) + ' W out, ' + f1(100 * op.eff) + ' % efficient', 'big') +
        stat('No-load speed', f0(d.noLoadRpm) + ' rpm', 'K_v = ' + f0(Kv) + ' rpm/V') + stat('Stall torque and current', n3(d.stallTorque, 3) + ' N·m', f1(d.stallCurrent) + ' A — limit it in the driver') +
        stat('Maximum power (a peak, not a rating)', f1(d.maxPower.P) + ' W', 'at half stall torque; efficiency below 50 %') +
        stat('Best efficiency', f1(100 * d.maxEff) + ' %', 'at ' + f1(d.effPeakCurrent, 2) + ' A') + stat('Heat in the winding at your load', over ? f0(d.stallCurrent * d.stallCurrent * R) + ' W' : f1(op.I * op.I * R) + ' W', 'I²R; R = ' + n3(R, 3) + ' Ω at ' + v.temp + ' °C') +
        stat('Torque constant', n3(v.K, 3) + ' N·m/A', 'equal to the back-EMF constant in SI units') + stat('At the nominal voltage, cold', f0(cold.noLoadRpm) + ' rpm', 'stall ' + n3(cold.stallTorque, 3) + ' N·m');
      const N = 100, sp = [], cur = [], ef = [], pw = [];
      const Ts = Math.max(1e-9, cold.stallTorque);
      const Icold = cold.stallCurrent, Pmx = Math.max(1e-9, cold.maxPower.P);
      for (let i = 0; i <= N; i++) { const t = Ts * i / N, on = t <= d.stallTorque, o = d.at(Math.min(t, d.stallTorque)); sp.push([t, on ? Math.max(0, o.n) : 0]); pw.push([t, on ? 100 * Math.max(0, o.Pout) / Pmx : 0]); cur.push([t, 100 * (on ? o.I : d.stallCurrent) / Icold]); ef.push([t, on ? 100 * o.eff : 0]); }
      p1.set({ x: { label: 'torque (N·m)', min: 0, max: Ts }, series: [{ pts: sp, label: 'speed at ' + f1(Ve) + ' V, ' + v.temp + ' °C' }], marks: over ? [] : [{ x: v.T, y: op.n, label: 'your load' }], vlines: [{ x: v.T, label: 'load' }] });
      p2.set({ x: { label: 'torque (N·m)', min: 0, max: Ts }, series: [{ pts: cur, label: 'current, % of cold stall' }, { pts: pw, label: 'output power, % of max' }, { pts: ef, label: 'efficiency, %' }], marks: over ? [] : [{ x: v.T, y: 100 * op.I / Icold }, { x: v.T, y: 100 * Math.max(0, op.Pout) / Pmx }, { x: v.T, y: 100 * op.eff }] });
    }
    calc(read());
  }

  function labIM(el) {
    const L = layout(el, 'A typical three-phase cage induction motor of any size, as a per-phase equivalent circuit scaled from real designs, on the mains or a VFD. Enter the nameplate power and your load: see the speed, current, power factor and efficiency, the starting current and the torque curve.' + link('torque-slip-curve') + link('equivalent-circuit') + link('slip-and-speed') + link('v-over-f-control'));
    const read = form(L.form, [['P', 'Rated power', 7.5, 'q', ['power', 'kW']], ['V', 'Rated line voltage', 400, 'q', ['voltage', 'V']], ['f', 'Rated frequency', '50', 'sel', [['50', '50 Hz'], ['60', '60 Hz']]],
      ['poles', 'Poles', '4', 'sel', [['2', '2 poles'], ['4', '4 poles'], ['6', '6 poles'], ['8', '8 poles']]],
      ['sep1', 'Supply and load', null, 'sep'], ['fr', 'Supply frequency (VFD; = rated on the mains)', 50, 'q', ['frequency', 'Hz']],
      ['load', 'Load, % of rated torque', 100, 'range', [0, 200, 1], ' %'], ['type', 'Load type', 'const', 'sel', [['const', 'constant torque (conveyor, hoist)'], ['fan', 'quadratic (fan, centrifugal pump)']]]], calc);
    const p1 = plotIn(L.plot, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 } }, 230);
    const p2 = plotIn(L.plot, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'line current (A)', min: 0 } }, 190);
    function calc(v) {
      const f = +v.f, poles = +v.poles;
      if (!(v.P > 0 && v.V > 0 && v.fr > 0)) { L.stats.innerHTML = '<p class="muted">Positive power, voltage and frequency.</p>'; return; }
      const kW = v.P / 1000, rated = cageMotor(kW, v.V, f, poles), sR = slipAtPower(rated, v.P), rp = rated.at(sR), Tn = rp.Pmech / ((1 - sR) * rated.ws);
      const im = cageMotor(kW, v.V, f, poles, v.fr), nsR = rated.ns;
      const Tl = n => v.load / 100 * Tn * (v.type === 'fan' ? Math.pow(Math.max(0, n) / rp.n, 2) : 1);
      let lo = 1e-5, hi = im.sMax, ok = im.at(hi).T >= Tl(im.at(hi).n);
      if (ok) for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (im.at(m).T < Tl(im.at(m).n)) lo = m; else hi = m; }
      const op = im.at(hi), Iop = op.I1;
      const Pin = op.Pin;
      L.stats.innerHTML = (!ok ? warnBox('The load is above the breakdown torque at this frequency: the motor stalls, draws its locked-rotor current and trips its overload.') : '') +
        stat('Running at', ok ? f0(op.n) + ' rpm' : 'stalled', ok ? 'slip ' + f1(100 * hi, 2) + ' %, field at ' + f0(im.ns) + ' rpm' : '', 'big') +
        stat('Line current', ok ? f1(Iop) + ' A' : f0(im.start.I1) + ' A', 'rated ' + f1(rp.I1) + ' A at ' + f0(rp.n) + ' rpm') +
        stat('Power factor · efficiency', ok ? f1(op.pf, 2) + ' · ' + f1(100 * op.eff) + ' %' : '—', 'rated ' + f1(rp.pf, 2) + ' · ' + f1(100 * rp.eff) + ' %  (' + M().ieClass(kW, 100 * rp.eff) + ' level)') +
        stat('Shaft power · input', ok ? f1(op.Pmech / 1000, 2) + ' kW · ' + f1(Pin / 1000, 2) + ' kW' : '—', ok ? 'apparent power ' + f1(Math.sqrt(3) * im.Vph * Math.sqrt(3) * Iop / 1000, 2) + ' kVA' : '') +
        stat('Rated torque', n3(Tn, 3) + ' N·m', 'breakdown ' + f1(rated.Tmax / Tn, 2) + ' × rated') +
        stat('Starting (locked rotor) at this supply', f0(im.start.I1) + ' A', f1(im.start.I1 / rp.I1) + ' × rated current, ' + f1(im.start.T / Tn, 2) + ' × rated torque') +
        stat('Synchronous speed', f0(nsR) + ' rpm', '120 f / p at the rated ' + f + ' Hz');
      const curve = [], cur = [], lc = [];
      const nMax = Math.max(im.ns, nsR) * 1.08;
      for (let i = 0; i <= 200; i++) { const s = Math.max(1e-4, 1 - i / 200), r = im.at(s); curve.push([r.n, r.T]); cur.push([r.n, r.I1]); }
      const rc = []; for (let i = 0; i <= 200; i++) { const r = rated.at(Math.max(1e-4, 1 - i / 200)); rc.push([r.n, r.T]); }
      for (let i = 0; i <= 50; i++) { const n = nMax * i / 50; lc.push([n, Tl(n)]); }
      const C = ui.colors();
      p1.set({ x: { label: 'speed (rpm)', min: 0, max: nMax }, series: [{ pts: curve, label: 'motor at ' + f1(v.fr) + ' Hz' }].concat(Math.abs(v.fr - f) > 0.01 ? [{ pts: rc, label: 'on the mains (' + f + ' Hz)', color: C.faint, dash: [3, 3] }] : []).concat([{ pts: lc, label: 'load', color: C.muted, dash: [6, 4] }]),
        marks: ok ? [{ x: op.n, y: op.T, label: 'operating point' }] : [], hlines: [{ y: Tn, label: 'rated torque' }] });
      p2.set({ x: { label: 'speed (rpm)', min: 0, max: nMax }, series: [{ pts: cur, label: 'current at ' + f1(v.fr) + ' Hz' }], marks: ok ? [{ x: op.n, y: Iop }] : [], hlines: [{ y: rp.I1, label: 'rated current' }] });
    }
    calc(read());
  }

  const STEPPERS = { n17: ['NEMA 17 (42 mm), 1.8°', 1.7, 1.5, 2.8e-3, 0.45], n23: ['NEMA 23 (57 mm), 1.8°', 2.8, 0.9, 2.5e-3, 1.26], n34: ['NEMA 34 (86 mm), 1.8°', 5.0, 0.6, 4.5e-3, 4.5] };
  function labStep(el) {
    const L = layout(el, 'A hybrid stepper\'s torque falls with speed because the driver cannot push the current into the winding\'s inductance fast enough. A higher supply voltage keeps the torque up to a higher speed. The curve is an upper bound; real pull-out curves sit below it, and resonance can cut it further.' + link('stepper-torque-speed') + link('stepper-drivers') + link('stepper-sizing'));
    const read = form(L.form, [['preset', 'Motor', 'n23', 'sel', Object.entries(STEPPERS).map(([k, p]) => [k, p[0]])],
      ['I', 'Rated phase current', 2.8, 'q', ['current', 'A']], ['R', 'Phase resistance', 0.9, 'q', ['resistance', 'Ω']], ['Lh', 'Phase inductance', 2.5, 'q', ['inductance', 'mH']], ['Th', 'Holding torque', 1.26, 'q', ['torque', 'N·m']],
      ['sep1', 'Driver and load', null, 'sep'], ['Vs', 'Driver supply voltage', 36, 'q', ['voltage', 'V']], ['micro', 'Microsteps per full step', '16', 'sel', [['1', 'full step'], ['2', '1/2'], ['4', '1/4'], ['8', '1/8'], ['16', '1/16'], ['32', '1/32']]],
      ['Tl', 'Load torque', 0.4, 'q', ['torque', 'N·m']], ['sf', 'Safety margin on torque', 50, 'range', [0, 100, 5], ' %']], v => {
      if (v.preset !== last) { const p = STEPPERS[v.preset]; last = v.preset; read.set('I', p[1]); read.set('R', p[2]); read.set('Lh', p[3] * 1e3); read.set('Th', p[4]); v = read(); }
      calc(v);
    });
    let last = 'n23';
    const pl = plotIn(L.plot, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'torque (N·m)', min: 0 } }, 250);
    function calc(v) {
      if (!(v.I > 0 && v.R > 0 && v.Lh > 0 && v.Th > 0 && v.Vs > 0)) { L.stats.innerHTML = '<p class="muted">Positive motor data and supply voltage.</p>'; return; }
      const m = M().stepper({ steps: 200, I: v.I, R: v.R, L: v.Lh, Vs: v.Vs, Th: v.Th }), m2 = M().stepper({ steps: 200, I: v.I, R: v.R, L: v.Lh, Vs: v.Vs * 2, Th: v.Th }), mh = M().stepper({ steps: 200, I: v.I, R: v.R, L: v.Lh, Vs: v.Vs / 2, Th: v.Th });
      const need = v.Tl * (1 + v.sf / 100);
      let nMax = 0; for (let n = 1; n <= 6000; n += 5) if (m.torque(n) >= need) nMax = n;
      const micro = +v.micro, rateAt = n => m.stepRate(n, micro);
      const maxV = 32 * Math.sqrt(v.Lh * 1e3);
      L.stats.innerHTML = stat('Fastest speed for your load (with margin)', need >= v.Th ? 'none' : f0(nMax) + ' rpm', 'needs ' + n3(need, 3) + ' N·m', 'big') +
        stat('Corner speed', f0(m.cornerRpm) + ' rpm', 'where the torque starts to fall') + stat('Step rate at that speed', f0(rateAt(nMax)) + ' steps/s', '1/' + micro + ' microstepping: ' + (200 * micro) + ' steps per revolution') +
        stat('Rated power drawn by one phase at standstill', f1(v.I * v.I * v.R) + ' W', 'both phases: ' + f1(2 * v.I * v.I * v.R) + ' W as heat — standstill current reduction halves it or better') +
        stat('A rule of thumb for the supply', 'up to ≈ ' + f0(maxV) + ' V', '32 √L(mH) — higher voltage, faster; check the driver\'s and the motor\'s rating') +
        stat('Holding torque per ampere', n3(v.Th / v.I, 3) + ' N·m/A', '');
      const a = [], b = [], c = [];
      const top = Math.max(1500, Math.min(6000, m2.cornerRpm * 6));
      for (let i = 0; i <= 150; i++) { const n = 1 + top * i / 150; a.push([n, m.torque(n)]); b.push([n, m2.torque(n)]); c.push([n, mh.torque(n)]); }
      pl.set({ x: { label: 'speed (rpm)', min: 0, max: top }, series: [{ pts: c, label: f0(v.Vs / 2) + ' V', dash: [3, 3] }, { pts: a, label: f0(v.Vs) + ' V' }, { pts: b, label: f0(v.Vs * 2) + ' V', dash: [6, 4] }], hlines: [{ y: need, label: 'load + margin' }, { y: v.Tl, label: 'load' }], marks: need < v.Th && nMax ? [{ x: nMax, y: need, label: 'limit' }] : [] });
    }
    calc(read());
  }

  function labHyd(el) {
    const L = layout(el, 'A hydraulic motor turns flow into speed and pressure into torque: n = Q η_v / V_g and T = V_g Δp η_hm / 2π. Size the motor from the torque and speed your load needs, then the pump and the electric motor that drives it — and see how much heat the losses leave in the oil.' + link('hydraulic-motor-principle') + link('hydraulic-motor-sizing') + link('hydraulic-power-unit'));
    const read = form(L.form, [['Vg', 'Motor displacement', 100, 'q', ['displacement', 'cm³/rev']], ['dp', 'Pressure difference across the motor', 180, 'q', ['pressure', 'bar']], ['Q', 'Flow to the motor', 60, 'q', ['flowrate', 'L/min']],
      ['etaV', 'Volumetric efficiency', 95, 'range', [70, 99, 1], ' %'], ['etaHM', 'Hydromechanical efficiency', 90, 'range', [70, 98, 1], ' %'],
      ['sep1', 'Pump and electric motor', null, 'sep'], ['pp', 'Pump outlet pressure (motor Δp + line and valve losses)', 200, 'q', ['pressure', 'bar']], ['etaP', 'Pump overall efficiency', 85, 'range', [60, 95, 1], ' %'], ['nE', 'Electric motor speed', 1450, 'q', ['angvel', 'rpm']]], calc);
    const pl = plotIn(L.plot, { x: { label: 'pressure difference (bar)', min: 0 }, y: { label: 'torque (N·m)', min: 0 } }, 220);
    function calc(v) {
      const Vg = v.Vg * 1e6, dp = v.dp / 1e5, Q = v.Q * 60000, pp = v.pp / 1e5, nE = v.nE * 60 / TAU;
      if (!(Vg > 0 && dp >= 0 && Q > 0 && pp > 0)) { L.stats.innerHTML = '<p class="muted">Positive displacement, flow and pressures.</p>'; return; }
      const r = M().hydMotor({ Vg, dp, Q, etaV: v.etaV / 100, etaHM: v.etaHM / 100 });
      const Phyd = pp * 1e5 * Q / 60000, Pe = Phyd / (v.etaP / 100), heat = Pe - r.Pout, VgP = Q * 1000 / (nE * 0.95);
      L.stats.innerHTML = stat('Motor torque', f0(r.T) + ' N·m', f1(r.T * 0.7376) + ' lbf·ft', 'big') + stat('Motor speed', f0(r.n) + ' rpm', f1(r.n / 60, 2) + ' rev/s') +
        stat('Motor output power', f1(r.Pout / 1000, 2) + ' kW', 'overall efficiency ' + f1(100 * r.eta) + ' %') +
        stat('Pump hydraulic power', f1(Phyd / 1000, 2) + ' kW', 'Q·p = ' + f1(Q) + ' L/min × ' + f0(pp) + ' bar / 600') +
        stat('Electric motor needed', f1(Pe / 1000, 2) + ' kW', 'next standard size ' + nextUp(Pe / 1000, IEC_KW) + ' kW') +
        stat('Pump displacement at ' + f0(nE) + ' rpm', f1(VgP) + ' cm³/rev', 'with 95 % volumetric efficiency') +
        stat('Heat into the oil', f1(heat / 1000, 2) + ' kW', f0(100 * heat / Pe) + ' % of the input — the cooler and reservoir must remove it');
      const pts = [], pts2 = [];
      for (let i = 0; i <= 50; i++) { const p = 350 * i / 50; pts.push([p, M().hydMotor({ Vg, dp: p, Q, etaV: v.etaV / 100, etaHM: v.etaHM / 100 }).T]); pts2.push([p, M().hydMotor({ Vg: Vg * 2, dp: p, Q, etaV: v.etaV / 100, etaHM: v.etaHM / 100 }).T]); }
      pl.set({ series: [{ pts, label: f0(Vg) + ' cm³/rev' }, { pts: pts2, label: f0(2 * Vg) + ' cm³/rev (half the speed)', dash: [5, 4] }], marks: [{ x: dp, y: r.T, label: 'yours' }] });
    }
    calc(read());
  }

  function labAir(el) {
    const L = layout(el, 'An air motor\'s torque falls in a straight line from stall to its free speed, so its power is a parabola peaking at half the free speed. Throttling or lowering the pressure moves the whole curve down. It can stall under load without harm — and its air consumption is the real running cost.' + link('air-motor-principle') + link('vane-air-motors') + link('air-motor-control'));
    const read = form(L.form, [['P', 'Maximum power (at 6.3 bar)', 0.8, 'q', ['power', 'kW']], ['n0', 'Free speed', 9000, 'q', ['angvel', 'rpm']], ['q', 'Air consumption at maximum power', 16, 'q', ['flowrate', 'L/s']],
      ['p', 'Supply pressure (gauge)', 6.3, 'q', ['pressure', 'bar']], ['n', 'Running speed', 4500, 'q', ['angvel', 'rpm']], ['cost', 'Cost of compressed air', 0.025, 'n', '¤ per m³ (free air)'], ['hours', 'Running hours per year', 1000, 'n', 'h']], calc);
    const pl = plotIn(L.plot, { x: { label: 'speed (rpm)', min: 0 }, y: { label: 'power (W) · torque (N·cm)', min: 0 } }, 240);
    function calc(v) {
      const p = v.p / 1e5, n0 = v.n0 * 60 / TAU, n = v.n * 60 / TAU, P = v.P;
      if (!(P > 0 && n0 > 0 && p > 0)) { L.stats.innerHTML = '<p class="muted">Positive power, free speed and pressure.</p>'; return; }
      // pressure scales power roughly with (p + 1)/(7.3) × p/6.3 and free speed mildly — a first estimate
      const k = p / 6.3, Pm = P * k * Math.pow(k, 0.4), n0p = n0 * Math.pow(k, 0.3);
      const r = M().airMotor({ Pmax: Pm, n0: n0p, n: Math.min(n, n0p) });
      const qNow = v.q * 1000 * ((p + 1.013) / 7.313) * (0.35 + 0.65 * Math.min(1, n / n0p));
      const m3y = qNow / 1000 * 3600 * v.hours, Pc = qNow * 60 / 1000 * 6.5;   // about 6.5 kW of compressor per m³/min of free air at 7 bar
      L.stats.innerHTML = stat('Power at your speed', f0(r.P) + ' W', f1(100 * r.P / Pm) + ' % of the maximum ' + f0(Pm) + ' W', 'big') + stat('Torque at your speed', n3(r.T, 3) + ' N·m', 'stall torque ' + n3(r.Tstall, 3) + ' N·m (starting torque is lower, about 75 % of it)') +
        stat('Air consumption (estimate)', f1(qNow) + ' L/s', 'free air; ' + f0(qNow * 60) + ' L/min') + stat('Air per year', f0(m3y) + ' m³', U.money(m3y * v.cost, 0) + ' per year at your price') +
        stat('Compressor power behind it', f1(Pc) + ' kW', 'about 6–7 kW of compressor per 1000 L/min: the motor returns ' + f0(100 * r.P / (Pc * 1000)) + ' % of it as shaft power');
      const P1 = [], T1 = [];
      for (let i = 0; i <= 100; i++) { const s = n0p * i / 100 * 60 / TAU, o = M().airMotor({ Pmax: Pm, n0: n0p, n: n0p * i / 100 }); P1.push([s, o.P]); T1.push([s, o.T * 100]); }
      pl.set({ series: [{ pts: P1, label: 'power (W)' }, { pts: T1, label: 'torque (N·cm)', dash: [5, 4] }], marks: [{ x: Math.min(n, n0p) * 60 / TAU, y: r.P, label: 'yours' }] });
    }
    calc(read());
  }

  /* ================================================================ SIZING */
  const SIZING = [['axis', 'Linear axis'], ['conveyor', 'Conveyor'], ['hoist', 'Hoist'], ['pumpfan', 'Pump or fan'], ['cable', 'Cable'], ['choose', 'Which motor?']];
  function sizing(el, params, sub) {
    const T = subtabs(el, 'sizing', SIZING, sub, NOTE + ' Add service factors for shocks, frequent starts and hot or high places.');
    ({ axis: szAxis, conveyor: szConveyor, hoist: szHoist, pumpfan: szPump, cable: szCable, choose: szChoose })[T.tab](T.body);
  }

  function szAxis(el) {
    const L = layout(el, 'A point-to-point move of a mass on a ball screw, a belt or a rack: the motion profile, the torque to accelerate the load and the motor\'s own rotor, friction and gravity, the peak and RMS torque over a cycle, the top speed and the inertia ratio — the numbers a stepper or servo must meet.' + link('motion-profiles') + link('inertia-reflected') + link('rms-torque-sizing') + link('motor-selection-method'));
    const read = form(L.form, [['drive', 'Drive', 'screw', 'sel', [['screw', 'ball screw'], ['belt', 'toothed belt'], ['rack', 'rack and pinion']]],
      ['lead', 'Screw lead', 10, 'q', ['length', 'mm']], ['sdia', 'Screw diameter', 16, 'q', ['length', 'mm']], ['slen', 'Screw length', 800, 'q', ['length', 'mm']], ['d', 'Pulley or pinion pitch diameter', 40, 'q', ['length', 'mm']],
      ['m', 'Moving mass (load + carriage)', 30, 'q', ['mass', 'kg']], ['vert', 'Axis', 'h', 'sel', [['h', 'horizontal'], ['v', 'vertical (lifting)']]], ['mu', 'Friction coefficient of the guides', 0.01, 'n', ''],
      ['F', 'Process force (cutting, pressing)', 0, 'q', ['force', 'N']], ['eta', 'Mechanical efficiency', 90, 'range', [50, 98, 1], ' %'], ['i', 'Gear ratio motor : drive (1 = direct)', 1, 'n', ''],
      ['sep1', 'The move', null, 'sep'], ['dist', 'Distance', 300, 'q', ['length', 'mm']], ['v', 'Top speed', 0.5, 'q', ['speed', 'm/s']], ['a', 'Acceleration (= deceleration)', 5, 'q', ['accel', 'm/s²']], ['dwell', 'Dwell after the move', 0.5, 'q', ['time', 's']],
      ['Jm', 'Motor rotor inertia', 1.2, 'q', ['inertia', 'kg·cm²']]], calc);
    const pl = plotIn(L.plot, { x: { label: 'time (s)', min: 0 }, y: { label: 'torque (N·m) · speed (rpm / 1000)' } }, 240);
    function calc(v) {
      const g = 9.81, i = v.i > 0 ? v.i : 1, eta = v.eta / 100;
      if (!(v.m > 0 && v.dist > 0 && v.v > 0 && v.a > 0 && v.Jm >= 0)) { L.stats.innerHTML = '<p class="muted">Positive mass, distance, speed and acceleration.</p>'; return; }
      let k, Jdrive = 0;   // k: metres of travel per radian of the driving shaft
      if (v.drive === 'screw') {
        if (!(v.lead > 0)) { L.stats.innerHTML = '<p class="muted">A positive lead.</p>'; return; }
        k = v.lead / TAU;
        Jdrive = Math.PI * 7850 * (v.slen > 0 ? v.slen : 0.8) * Math.pow(v.sdia > 0 ? v.sdia : 0.016, 4) / 32;   // a steel screw
      } else { if (!(v.d > 0)) { L.stats.innerHTML = '<p class="muted">A positive diameter.</p>'; return; } k = v.d / 2; Jdrive = v.drive === 'belt' ? 2 * 0.5 * 0.3 * Math.pow(v.d / 2, 2) : 0.5 * 0.2 * Math.pow(v.d / 2, 2); }
      const Jload = v.m * k * k + Jdrive, Jr = Jload / (i * i * eta), Jm = v.Jm;
      const Fg = v.vert === 'v' ? v.m * g : v.mu * v.m * g, Fr = Fg + v.F;   // running force
      const Tl = Fr * k / (i * eta), mv = M().move({ dist: v.dist, vmax: v.v, acc: v.a }), am = v.a / k * i;   // motor angular acceleration
      const Tacc = (Jm + Jr) * am, Tpk = Tacc + Tl, Tdec = -Tacc + Tl, Thold = v.vert === 'v' ? v.m * g * k / i * eta : 0;   // holding: efficiency helps
      const Trms = M().rmsTorque([[Tpk, mv.tAcc], [Tl, mv.tConst], [Tdec, mv.tDec], [Thold, v.dwell]]);
      const nMax = mv.vPeak / k * i * 60 / TAU, ratio = Jr / Math.max(1e-12, Jm);
      L.stats.innerHTML = stat('Peak torque at the motor', n3(Tpk, 3) + ' N·m', 'accelerating ' + n3(Tacc, 3) + ' + load ' + n3(Tl, 3), 'big') + stat('RMS torque over the cycle', n3(Trms, 3) + ' N·m', 'must stay below the motor\'s rated (continuous) torque') +
        stat('Top motor speed', f0(nMax) + ' rpm', mv.triangle ? 'a triangular move: top speed not reached' : 'cruising ' + f1(mv.tConst, 3) + ' s') +
        stat('Move time', f1(mv.tTotal, 3) + ' s', 'cycle with dwell ' + f1(mv.tTotal + v.dwell, 3) + ' s') +
        stat('Inertia ratio load : rotor', f1(ratio) + ' : 1', ratio > 10 ? 'high — expect overshoot and slow settling; gear down or pick a larger rotor' : ratio > 5 ? 'acceptable for most servos with tuning' : 'good for fast, stiff tuning') +
        stat('Load inertia at the motor', n3(Jr * 1e4, 3) + ' kg·cm²', 'mass ' + n3(v.m * k * k / (i * i) * 1e4, 3) + ' + ' + (v.drive === 'screw' ? 'screw ' : 'pulleys ') + n3(Jdrive / (i * i) * 1e4, 3) + ' kg·cm²') +
        (v.vert === 'v' ? stat('Holding torque at standstill', n3(Thold, 3) + ' N·m', 'a vertical axis needs a holding brake for power failures') : '') +
        stat('Suggested motor', 'rated ≥ ' + n3(Trms * 1.25, 3) + ' N·m, peak ≥ ' + n3(Tpk * 1.25, 3) + ' N·m', 'at ' + f0(nMax) + ' rpm, with a 25 % margin; a stepper needs its pull-out torque at that speed above ' + n3(Tpk * 1.5, 3) + ' N·m');
      const tq = [], sp = [], tc = mv.tTotal + v.dwell;
      for (let j = 0; j <= 300; j++) { const t = tc * j / 300, s = mv.at(t), T = t < mv.tAcc ? Tpk : t < mv.tAcc + mv.tConst ? Tl : t < mv.tTotal ? Tdec : Thold; tq.push([t, T]); sp.push([t, s.v / k * i * 60 / TAU / 1000]); }
      pl.set({ series: [{ pts: tq, label: 'torque (N·m)' }, { pts: sp, label: 'speed (1000 rpm)', dash: [5, 4] }], hlines: [{ y: Trms, label: 'RMS' }] });
    }
    calc(read());
  }

  function szConveyor(el) {
    const L = layout(el, 'A belt or roller conveyor: the force to keep the load moving (rolling resistance and the incline), the extra force to accelerate it, the drum speed and torque, the gearbox ratio and the motor size.' + link('motors-conveyors-hoists') + link('load-torque-types') + link('gearboxes'));
    const read = form(L.form, [['m', 'Mass on the conveyor (load + belt)', 500, 'q', ['mass', 'kg']], ['v', 'Belt speed', 0.5, 'q', ['speed', 'm/s']], ['ang', 'Incline', 0, 'q', ['angle', '°']],
      ['mu', 'Resistance coefficient (0.02–0.04 rollers; 0.3–0.5 belt sliding on a bed)', 0.03, 'n', ''], ['D', 'Drive drum diameter', 200, 'q', ['length', 'mm']], ['ta', 'Acceleration time', 2, 'q', ['time', 's']],
      ['eta', 'Gearbox and drive efficiency', 90, 'range', [50, 98, 1], ' %'], ['nm', 'Motor speed (4-pole: about 1450)', 1450, 'q', ['angvel', 'rpm']], ['sf', 'Service factor', 1.2, 'n', '']], calc);
    function calc(v) {
      const g = 9.81, th = v.ang, eta = v.eta / 100;
      if (!(v.m > 0 && v.v > 0 && v.D > 0 && v.nm > 0)) { L.stats.innerHTML = '<p class="muted">Positive mass, speed, drum and motor speed.</p>'; return; }
      const Fr = v.m * g * (v.mu * Math.cos(th) + Math.sin(th)), Fa = v.m * v.v / Math.max(0.05, v.ta);
      const nD = v.v / (v.D / 2) * 60 / TAU, ratio = v.nm / (v.v / (v.D / 2));   // v.nm is in rad/s
      const Prun = Fr * v.v / eta, Pacc = (Fr + Fa) * v.v / eta, Tdrum = (Fr + Fa) * v.D / 2, Tm = Pacc / (v.nm);
      const kW = nextUp(Math.max(Prun * v.sf, Pacc / 1.6) / 1000, IEC_KW);
      L.stats.innerHTML = stat('Motor size', kW + ' kW', 'running ' + f1(Prun / 1000, 2) + ' kW × service factor ' + v.sf + '; the start needs ' + f1(Pacc / 1000, 2) + ' kW (a motor gives 1.6–2× rated briefly)', 'big') +
        stat('Running force', f0(Fr) + ' N', th > 0 ? 'of which lifting ' + f0(v.m * g * Math.sin(th)) + ' N' : 'rolling resistance') + stat('Drum speed · torque', f1(nD) + ' rpm · ' + f0(Tdrum) + ' N·m', 'torque while accelerating') +
        stat('Gear ratio', f1(ratio) + ' : 1', 'from ' + f0(v.nm * 60 / TAU) + ' rpm; a VFD can trim the speed instead of changing gears') + stat('Motor torque while starting', n3(Tm, 3) + ' N·m', '') +
        (th > 0 ? stat('On an incline', 'needs a backstop or brake', 'so the loaded belt cannot run back when stopped') : '');
    }
    calc(read());
  }

  function szHoist(el) {
    const L = layout(el, 'Lifting a load on a rope drum: the power, the torque at the drum and the motor, the holding brake, and the energy returned when the load is lowered — which a VFD must dissipate in a braking resistor or feed back.' + link('motors-conveyors-hoists') + link('motor-brakes') + link('vfd-braking'));
    const read = form(L.form, [['m', 'Load (including hook and rope)', 1000, 'q', ['mass', 'kg']], ['v', 'Lifting speed', 8, 'q', ['speed', 'm/min']], ['D', 'Drum diameter', 250, 'q', ['length', 'mm']],
      ['ta', 'Acceleration time', 1, 'q', ['time', 's']], ['eta', 'Efficiency (gearbox, drum, rope)', 80, 'range', [50, 95, 1], ' %'], ['nm', 'Motor speed', 1450, 'q', ['angvel', 'rpm']], ['h', 'Height lowered per cycle', 5, 'q', ['length', 'm']]], calc);
    function calc(v) {
      const g = 9.81, eta = v.eta / 100;
      if (!(v.m > 0 && v.v > 0 && v.D > 0 && v.nm > 0)) { L.stats.innerHTML = '<p class="muted">Positive load, speed, drum and motor speed.</p>'; return; }
      const F = v.m * g, Plift = F * v.v / eta, Pacc = (F + v.m * v.v / Math.max(0.05, v.ta)) * v.v / eta;
      const ratio = v.nm / (v.v / (v.D / 2)), Tm = F * v.D / 2 / (ratio * eta), Tbrake = 1.75 * F * v.D / 2 / ratio;   // v.nm is in rad/s
      const E = v.m * g * v.h * eta;
      L.stats.innerHTML = stat('Motor size', nextUp(Pacc / 1.5 / 1000 > Plift / 1000 ? Pacc / 1.5 / 1000 : Plift / 1000, IEC_KW) + ' kW', 'lifting needs ' + f1(Plift / 1000, 2) + ' kW; accelerating ' + f1(Pacc / 1000, 2) + ' kW for ' + f1(v.ta) + ' s', 'big') +
        stat('Rope force · drum torque', f0(F) + ' N · ' + f0(F * v.D / 2) + ' N·m', 'single fall; reeving divides the force and multiplies the rope speed') +
        stat('Gear ratio', f1(ratio) + ' : 1', 'motor torque ' + n3(Tm, 3) + ' N·m while lifting') +
        stat('Holding brake at the motor', '≥ ' + n3(Tbrake, 3) + ' N·m', 'typically 1.5–2 × the load torque; spring-applied, released by power (fails safe)') +
        stat('Energy returned when lowering ' + f1(v.h) + ' m', f1(E / 1000, 2) + ' kJ', 'at ' + f1(v.m * g * v.v * eta / 1000, 2) + ' kW — a VFD needs a braking resistor or a regenerative unit') +
        '<div class="small muted" style="grid-column:1/-1">' + warnBox('Lifting equipment is regulated: design, testing and inspection follow the machinery and lifting standards of your country. Never stand under a suspended load.') + '</div>';
    }
    calc(read());
  }

  function szPump(el) {
    const L = layout(el, 'A centrifugal pump or fan: its shaft power from flow and pressure, the motor size, and what it costs to run at part flow — throttling a valve or damper against running slower on a VFD. The affinity laws make the difference: power falls with the cube of speed.' + link('motors-pumps-fans') + link('vfd-energy-saving'));
    const read = form(L.form, [['kind', 'Machine', 'pump', 'sel', [['pump', 'water pump'], ['fan', 'fan']]], ['Q', 'Flow at full duty', 50, 'q', ['flowrate', 'm³/h']], ['p', 'Pressure rise (pump: head × ρg)', 3, 'q', ['pressure', 'bar']],
      ['eta', 'Pump or fan efficiency', 70, 'range', [30, 90, 1], ' %'], ['etaM', 'Motor efficiency', 92, 'range', [70, 97, 1], ' %'], ['stat', 'Static part of the pressure (lift or back-pressure)', 20, 'range', [0, 90, 5], ' %'],
      ['sep1', 'Running pattern', null, 'sep'], ['x', 'Average flow, % of full', 70, 'range', [30, 100, 5], ' %'], ['hours', 'Hours per year', 6000, 'n', 'h'], ['price', 'Electricity price', 0.2, 'n', '¤ per kWh']], calc);
    const pl = plotIn(L.plot, { x: { label: 'flow, % of full', min: 0, max: 100 }, y: { label: 'electrical input, % of full', min: 0, max: 110 } }, 230);
    function calc(v) {
      if (!(v.Q > 0 && v.p > 0)) { L.stats.innerHTML = '<p class="muted">Positive flow and pressure.</p>'; return; }
      const Ph = v.Q * v.p, Pshaft = Ph / (v.eta / 100), Pel = Pshaft / (v.etaM / 100), kW = nextUp(Pshaft * 1.1 / 1000, IEC_KW), s = v.stat / 100;
      // throttling: the machine rides up its curve; input falls only a little (a typical centrifugal characteristic)
      // on a VFD the machine meets the system curve Δp = s + (1 − s)x² at flow x: power ∝ x·Δp, the efficiency sagging a little with static pressure
      const thr = x => 0.45 + 0.55 * x, vfd = x => x * (s + (1 - s) * x * x) / (1 - 0.3 * s * (1 - x)) + 0.02;
      const x = v.x / 100, eT = Pel * thr(x) * v.hours / 1000, eV = Pel * vfd(x) / 0.97 * v.hours / 1000;
      L.stats.innerHTML = stat('Motor size', kW + ' kW', 'shaft power ' + f1(Pshaft / 1000, 2) + ' kW + 10 %', 'big') + stat('Hydraulic (air) power', f1(Ph / 1000, 2) + ' kW', 'Q × Δp') +
        stat('Energy per year — throttled', f0(eT) + ' kWh', U.money(eT * v.price, 0)) + stat('Energy per year — VFD', f0(eV) + ' kWh', U.money(eV * v.price, 0) + ' (drive losses included)') +
        stat('Saving with a VFD', f0(Math.max(0, eT - eV)) + ' kWh/yr', U.money(Math.max(0, eT - eV) * v.price, 0) + ' per year; with ' + v.stat + ' % static pressure') +
        stat('Affinity laws', 'Q ∝ n, Δp ∝ n², P ∝ n³', 'half the speed: an eighth of the power (with no static pressure)');
      const a = [], b = [];
      for (let i = 20; i <= 100; i++) { a.push([i, 100 * thr(i / 100)]); b.push([i, 100 * vfd(i / 100) / 0.97]); }
      pl.set({ series: [{ pts: a, label: 'throttle valve or damper' }, { pts: b, label: 'VFD speed control' }], vlines: [{ x: v.x, label: 'your average' }] });
    }
    calc(read());
  }

  const MM2 = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240];
  function szCable(el) {
    const L = layout(el, 'The voltage lost along a motor cable: at full load it should stay within about 3–5 % (local rules set the limit), and when a motor starts direct on line its current — and the dip — is five to eight times larger. Cable size is also set by current capacity and protection, which this tool does not check.' + link('dol-starting') + link('nameplate-reading'));
    const read = form(L.form, [['I', 'Motor full-load current', 15, 'q', ['current', 'A']], ['V', 'Supply voltage (line)', 400, 'q', ['voltage', 'V']], ['ph', 'Supply', '3', 'sel', [['3', 'three-phase'], ['1', 'single-phase']]],
      ['L', 'Cable length (one way)', 50, 'q', ['length', 'm']], ['A', 'Conductor cross-section', '2.5', 'sel', MM2.map(a => [String(a), a + ' mm²'])], ['mat', 'Conductor', 'cu', 'sel', [['cu', 'copper'], ['al', 'aluminium']]],
      ['pf', 'Power factor at full load', 0.85, 'n', ''], ['ks', 'Starting current (DOL), × full load', 6, 'n', '']], calc);
    function calc(v) {
      const A = +v.A, rho = v.mat === 'al' ? 0.0282 : 0.0175, ph = +v.ph;
      if (!(v.I > 0 && v.V > 0 && v.L > 0)) { L.stats.innerHTML = '<p class="muted">Positive current, voltage and length.</p>'; return; }
      const dv = M().cableDrop({ I: v.I, L: v.L, A, pf: v.pf, rho, phases: ph }), dvs = M().cableDrop({ I: v.I * v.ks, L: v.L, A, pf: 0.35, rho, phases: ph });
      const pct = 100 * dv / v.V, pcs = 100 * dvs / v.V, need = lim => MM2.find(a => 100 * M().cableDrop({ I: v.I, L: v.L, A: a, pf: v.pf, rho, phases: ph }) / v.V <= lim);
      const loss = (ph === 3 ? 3 : 2) * v.I * v.I * rho * v.L / A;
      L.stats.innerHTML = stat('Voltage drop at full load', f1(dv) + ' V', f1(pct, 2) + ' % of ' + f0(v.V) + ' V', 'big' + (pct > 5 ? ' bad' : '')) +
        stat('Dip while starting', f1(dvs) + ' V', f1(pcs) + ' % — a large dip can stall the start and flicker lights') +
        stat('Smallest section for ≤ 3 %', need(3) ? need(3) + ' mm²' : '> 240 mm²', '≤ 5 %: ' + (need(5) ? need(5) + ' mm²' : '> 240 mm²')) +
        stat('Power lost in the cable', f0(loss) + ' W', 'heat along the run, paid for every hour it runs') +
        '<div style="grid-column:1/-1">' + (pct > 5 ? warnBox('More than 5 % drop: the motor runs hotter and gives less torque — use a larger section or a shorter run.') : '') + '</div>';
    }
    calc(read());
  }

  // the selection guide: each family scored against the answers, with the reasons shown
  const FAM = [
    ['im', 'Three-phase induction motor, direct on line', 'squirrel-cage'], ['vfd', 'Induction motor on a VFD', 'vfd-principle'], ['sp', 'Single-phase capacitor motor', 'capacitor-start-run'],
    ['dc', 'Brushed permanent-magnet DC motor', 'pmdc-motor'], ['bldc', 'Brushless DC / PM synchronous motor with a driver', 'bldc-motor'], ['step', 'Stepper motor and driver', 'stepper-principle'],
    ['servo', 'AC servo motor and servo drive', 'ac-servo-motors'], ['hyd', 'Hydraulic motor', 'hydraulic-motor-principle'], ['air', 'Air motor', 'air-motor-principle'], ['lin', 'Linear motor or direct drive', 'linear-motors']
  ];
  const Q_TASK = [['fixed', 'Run at one speed'], ['var', 'Run at adjustable speeds'], ['pos', 'Position accurately'], ['torque', 'Very high torque at low speed'], ['lift', 'Lift or hold loads'], ['fast', 'Very fast, dynamic moves']];
  const Q_SUP = [['ac3', 'Three-phase mains'], ['ac1', 'Single-phase mains'], ['dc', 'DC: battery or low-voltage supply'], ['air', 'Compressed air'], ['hyd', 'Hydraulic power (existing)']];
  const Q_POW = [['xs', 'Under 100 W'], ['s', '100 W – 2 kW'], ['m', '2 – 50 kW'], ['l', 'Over 50 kW']];
  const Q_ENV = [['clean', 'Clean and dry'], ['wet', 'Wet, dusty or washed down'], ['ex', 'Explosive atmosphere'], ['hot', 'Very hot, cold or remote']];
  function szChoose(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Answer four questions; every motor family is scored against them, with the reasons. A first orientation — then open the family\'s page and size it with the other tools.' + link('motor-comparison') + link('positioning-vs-speed') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"></div></div>';
    const out = ui.$('.mout', el);
    const read = form(ui.$('.mform', el), [['task', 'What must it do?', 'var', 'sel', Q_TASK], ['sup', 'What power is available?', 'ac3', 'sel', Q_SUP], ['pow', 'How much power?', 's', 'sel', Q_POW], ['env', 'Where does it work?', 'clean', 'sel', Q_ENV]], calc);
    function calc(v) {
      const S = {}, why = {};
      FAM.forEach(f => { S[f[0]] = 0; why[f[0]] = []; });
      const add = (id, pts, r) => { S[id] += pts; if (r) why[id].push((pts > 0 ? '+ ' : pts < 0 ? '− ' : '') + r); };
      // the task
      ({ fixed: () => { add('im', 3, 'simplest and cheapest for one speed'); add('sp', 2, 'one speed from single-phase'); add('vfd', 1, 'a VFD is not needed for one speed, but gives a soft start'); add('air', 1); add('hyd', 1); },
        var: () => { add('vfd', 3, 'wide speed range, energy saving'); add('bldc', 3, 'efficient, compact, precise speed'); add('dc', 2, 'speed by voltage or PWM — simple'); add('servo', 2, 'speed and position both'); add('air', 2, 'speed by pressure or throttling'); add('hyd', 2, 'speed by flow'); add('step', 1, 'fine at low speeds'); add('im', -2, 'direct on line gives one speed only'); add('sp', -2, 'single-phase motors are hard to control'); },
        pos: () => { add('servo', 3, 'closed loop: accurate, fast, no lost steps'); add('step', 3, 'open-loop positioning at low cost'); add('lin', 2, 'no backlash, highest accuracy'); add('bldc', 1, 'with an encoder and a positioning drive'); add('vfd', 0, 'possible with an encoder, but coarse'); add('air', -2, 'air is compressible: poor positioning'); add('im', -3); add('sp', -3); },
        torque: () => { add('hyd', 3, 'the highest torque per size and weight'); add('servo', 1, 'with a gearbox'); add('vfd', 2, 'full torque at low speed with vector control and a gearbox'); add('step', 1, 'high torque at low speed, small sizes'); add('lin', 1, 'direct-drive torque motors'); add('air', 1, 'stalls without harm'); },
        lift: () => { add('vfd', 2, 'controlled speed with a holding brake'); add('hyd', 3, 'counterbalance valves hold the load'); add('servo', 2, 'with a holding brake'); add('im', 1, 'with a brake motor, one speed'); add('air', 1, 'hoists in hazardous areas'); add('step', -1, 'a lost step drops position — use closed loop and a brake'); },
        fast: () => { add('servo', 3, 'high peak torque, low inertia, tuned loops'); add('lin', 3, 'the fastest axes'); add('bldc', 2); add('step', 0, 'torque falls at speed'); add('hyd', 1, 'servo-valves are very dynamic but complex'); add('im', -2); add('sp', -3); } })[v.task]();
      // the supply
      const needs = { im: ['ac3'], vfd: ['ac3', 'ac1'], sp: ['ac1'], dc: ['dc', 'ac1', 'ac3'], bldc: ['dc', 'ac1', 'ac3'], step: ['dc', 'ac1', 'ac3'], servo: ['ac1', 'ac3'], hyd: ['hyd', 'ac3'], air: ['air'], lin: ['ac1', 'ac3'] };
      FAM.forEach(([id]) => { if (!needs[id].includes(v.sup)) add(id, -4, 'needs ' + needs[id].map(s => Q_SUP.find(q => q[0] === s)[1].toLowerCase()).join(' or ')); });
      if (v.sup === 'ac1') add('vfd', 0, 'single-phase-input VFDs drive three-phase motors up to about 2–3 kW');
      if (v.sup === 'dc') { add('dc', 2, 'runs straight from the battery'); add('bldc', 2, 'efficient from a battery'); }
      if (v.sup === 'air') add('air', 3, 'uses the air you have'); if (v.sup === 'hyd') add('hyd', 3, 'uses the hydraulic power you have');
      // the power
      const pw = { xs: { dc: 2, bldc: 2, step: 2, servo: 1, sp: 0, im: -1, vfd: -1, hyd: -3, air: 0, lin: 1 }, s: { im: 1, vfd: 1, sp: 1, dc: 1, bldc: 1, step: 1, servo: 2, hyd: 0, air: 1, lin: 1 },
        m: { im: 2, vfd: 2, sp: -3, dc: -1, bldc: 0, step: -4, servo: 1, hyd: 2, air: 0, lin: 0 }, l: { im: 2, vfd: 3, sp: -5, dc: -3, bldc: -1, step: -5, servo: -2, hyd: 2, air: -3, lin: -2 } }[v.pow];
      FAM.forEach(([id]) => add(id, pw[id], pw[id] <= -3 ? 'rarely made in this size' : ''));
      // the environment
      ({ clean: () => {}, wet: () => { add('im', 1, 'IP55–IP66 enclosures are standard'); add('air', 1, 'insensitive to water and dust'); add('hyd', 1, 'sealed and robust'); add('dc', -2, 'brushes and commutator suffer from dust and moisture'); add('step', -1, 'choose sealed IP65 versions'); },
        ex: () => { add('air', 3, 'no electricity at the motor'); add('hyd', 2, 'the power unit can stand outside the zone'); add('im', 1, 'certified flameproof (Ex) motors exist'); add('vfd', 0, 'Ex motors on VFDs need matching certification'); add('dc', -4, 'sparking brushes'); add('step', -2); add('bldc', -2); add('lin', -3); },
        hot: () => { add('air', 2, 'cools itself as the air expands'); add('hyd', 1); add('im', 1, 'simple, robust, class H insulation available'); add('bldc', -1, 'electronics and magnets limit the temperature'); } })[v.env]();
      const ranked = FAM.map(f => ({ f, s: S[f[0]] })).sort((a, b) => b.s - a.s);
      out.innerHTML = '<div class="boxy">' + ranked.map((r, k) => {
        const good = r.s >= 4, poor = r.s < 1;
        return '<div style="padding:8px 0;border-top:' + (k ? '1px dashed var(--border)' : 'none') + ';opacity:' + (poor ? 0.55 : 1) + '"><div style="display:flex;gap:10px;align-items:baseline"><b style="font:700 18px var(--font-display);min-width:34px;color:' + (good ? 'var(--ok)' : poor ? 'var(--muted)' : 'var(--accent)') + '">' + r.s + '</b><b>' +
          (H.nodes.has(r.f[2]) ? '<a href="#/c/' + r.f[2] + '">' + esc(r.f[1]) + '</a>' : esc(r.f[1])) + '</b></div>' +
          (why[r.f[0]].length ? '<div class="small muted" style="margin-left:44px">' + why[r.f[0]].filter(Boolean).map(esc).join(' · ') + '</div>' : '') + '</div>';
      }).join('') + '</div>';
    }
    calc(read());
  }

  /* ================================================================ WIRING */
  const WIRING = [['threephase', 'Three-phase terminal box'], ['singlephase', 'Single-phase motors'], ['starters', 'Starter control circuits'], ['stepper', 'Stepper leads'], ['sensors', 'Sensors and switches']];
  function wiring(el, params, sub) {
    const T = subtabs(el, 'wiring', WIRING, sub, 'Diagrams for understanding. The motor\'s own terminal-box diagram and nameplate, the device manuals and your local wiring rules govern; mains wiring is for qualified electricians, with the supply isolated, locked off and proven dead.');
    ({ threephase: wThree, singlephase: wSingle, starters: wStarters, stepper: wStepper, sensors: wSensors })[T.tab](T.body);
  }
  // drawing helpers in a virtual frame of W0 × H0, scaled to the canvas
  function frame(c, w, h, W0, H0) { const s = Math.min(w / W0, h / H0); c.translate((w - W0 * s) / 2, (h - H0 * s) / 2); c.scale(s, s); c.lineCap = 'round'; c.lineJoin = 'round'; c.font = '13px ' + font(); return s; }
  const col = on => on ? ui.colors().accent : ui.colors().muted;
  function seg(c, pts, on, w) { c.strokeStyle = col(on); c.lineWidth = w || (on ? 2.6 : 1.6); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
  function txt(c, s, x, y, o) { o = o || {}; c.fillStyle = o.color || ui.colors().text; c.font = (o.bold ? '600 ' : '') + (o.size || 13) + 'px ' + font(); c.textAlign = o.align || 'center'; c.textBaseline = 'middle'; c.fillText(s, x, y); }
  function dot(c, x, y, on) { c.fillStyle = col(on); c.beginPath(); c.arc(x, y, 3.2, 0, TAU); c.fill(); }
  function term(c, x, y, label, on) { const C = ui.colors(); c.fillStyle = C.surface2; c.strokeStyle = col(on); c.lineWidth = 2; c.beginPath(); c.arc(x, y, 13, 0, TAU); c.fill(); c.stroke(); txt(c, label, x, y, { size: 12, bold: true }); }
  // a contact drawn along a vertical wire from (x, y) to (x, y + 36): NO or NC, closed or open
  function contact(c, x, y, nc, closed, on, label) {
    seg(c, [[x, y], [x, y + 10]], on); seg(c, [[x, y + 26], [x, y + 36]], on && closed);
    c.strokeStyle = col(on && closed); c.lineWidth = 2.2; c.beginPath(); c.moveTo(x - 7, y + 10); c.lineTo(x + 7, y + 10); c.moveTo(x - 7, y + 26); c.lineTo(x + 7, y + 26); c.stroke();
    c.beginPath(); if (closed) { c.moveTo(x, y + 10); c.lineTo(x, y + 26); } else { c.moveTo(x, y + 10); c.lineTo(x + 11, y + 23); } c.stroke();
    if (nc) { c.strokeStyle = ui.colors().muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 10, y + 12); c.lineTo(x + 10, y + 24); c.stroke(); }
    if (label) txt(c, label, x - 14, y + 18, { size: 11.5, align: 'right', color: ui.colors().muted });
  }
  function coil(c, x, y, label, on) { const C = ui.colors(); c.fillStyle = on ? C.hue(150, 0.35) : C.surface2; c.strokeStyle = col(on); c.lineWidth = 2; c.fillRect(x - 16, y, 32, 22); c.strokeRect(x - 16, y, 32, 22); txt(c, label, x, y + 11, { size: 12, bold: true }); }
  function winding(c, x1, y1, x2, y2, on, label) {
    const n = 5, dx = (x2 - x1) / n, dy = (y2 - y1) / n, L = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / L * 7, ny = (x2 - x1) / L * 7;
    c.strokeStyle = col(on); c.lineWidth = 2.2; c.beginPath(); c.moveTo(x1, y1);
    for (let k = 0; k < n; k++) { const ax = x1 + dx * k, ay = y1 + dy * k; c.bezierCurveTo(ax + nx, ay + ny, ax + dx + nx, ay + dy + ny, ax + dx, ay + dy); }
    c.stroke(); if (label) txt(c, label, (x1 + x2) / 2 + nx * 2.4, (y1 + y2) / 2 + ny * 2.4, { size: 11.5, color: ui.colors().muted });
  }
  function rotor(c, x, y, r, ang, on, dir) {
    const C = ui.colors(); c.strokeStyle = C.text; c.lineWidth = 2; c.fillStyle = C.surface2; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill(); c.stroke();
    c.save(); c.translate(x, y); c.rotate(ang); c.strokeStyle = on ? C.accent : C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(0, 0); c.lineTo(r - 4, 0); c.stroke(); c.restore();
    if (on) { c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, r + 8, dir > 0 ? -2.2 : -0.9, dir > 0 ? -0.9 : -2.2, dir < 0); c.stroke();
      const a = dir > 0 ? -0.9 : -2.2, ex = x + (r + 8) * Math.cos(a), ey = y + (r + 8) * Math.sin(a); c.fillStyle = C.accent; c.beginPath(); c.arc(ex, ey, 3.5, 0, TAU); c.fill(); }
  }

  function wThree(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">The six terminals of a three-phase motor, laid out as in most terminal boxes (IEC 60034-8 marking): the winding ends U2 V2 W2 sit above the starts U1 V1 W1, so three straight links make a delta and one bar across the top makes a star. The nameplate gives two voltages — the lower for delta, the higher for star.' + link('star-delta-connection') + link('dual-voltage-motors') + link('reversing-three-phase') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['plate', 'Nameplate voltage', '230/400', 'sel', [['230/400', '230/400 V Δ/Y'], ['400/690', '400/690 V Δ/Y']]], ['sup', 'Supply (line voltage)', '400', 'sel', [['230', '230 V three-phase'], ['400', '400 V'], ['690', '690 V']]],
      ['con', 'Links', 'star', 'sel', [['star', 'star (Y): one bar across U2 V2 W2'], ['delta', 'delta (Δ): U1–W2, V1–U2, W1–V2']]], ['swap', 'Swap L1 and L2 (reverse)', false, 'check']], v => { V = v; update(); });
    let V = read(), ang = 0;
    const stats = ui.$('.mstats', el);
    const cv = canvasIn(ui.$('.mcv', el), 360, (c, w, h) => {
      frame(c, w, h, 720, 360);
      const star = V.con === 'star', on = verdict().ok !== false;
      // supply
      const L = V.swap ? ['L2', 'L1', 'L3'] : ['L1', 'L2', 'L3'];
      // the supply cables come in from below to U1 V1 W1
      [0, 1, 2].forEach(k => { const x = 120 + 110 * k; txt(c, L[k], x, 342, { bold: true }); seg(c, [[x, 328], [x, 275]], true); });
      txt(c, 'terminal box', 236, 110, { size: 12, color: ui.colors().muted });
      c.strokeStyle = ui.colors().border; c.lineWidth = 1.5; c.strokeRect(80, 122, 312, 176);
      // links first, then the terminals over them
      const C = ui.colors(); c.strokeStyle = C.hue(40, 1); c.lineWidth = 7; c.globalAlpha = 0.85;
      if (star) { c.beginPath(); c.moveTo(107, 170); c.lineTo(353, 170); c.stroke(); }
      else [0, 1, 2].forEach(k => { c.beginPath(); c.moveTo(120 + 110 * k, 170); c.lineTo(120 + 110 * k, 262); c.stroke(); });
      c.globalAlpha = 1;
      const top = ['W2', 'U2', 'V2'], bot = ['U1', 'V1', 'W1'];
      [0, 1, 2].forEach(k => { term(c, 120 + 110 * k, 170, top[k], true); term(c, 120 + 110 * k, 262, bot[k], true); });
      txt(c, star ? 'star link across the winding ends' : 'delta links: each start joined to another winding’s end', 236, 142, { size: 12, color: C.hue(40, 1) });
      // the windings inside the motor, drawn as a star or a delta
      const cx = 540, cy = 180;
      if (star) { const P = [[cx, cy - 90], [cx - 80, cy + 50], [cx + 80, cy + 50]]; ['U', 'V', 'W'].forEach((n, k) => winding(c, P[k][0], P[k][1], cx, cy, on, n)); dot(c, cx, cy, on); txt(c, 'star point', cx + 34, cy - 2, { size: 11.5, color: C.muted }); }
      else { const P = [[cx, cy - 90], [cx - 90, cy + 60], [cx + 90, cy + 60]]; winding(c, P[0][0], P[0][1], P[1][0], P[1][1], on, 'U'); winding(c, P[1][0], P[1][1], P[2][0], P[2][1], on, 'V'); winding(c, P[2][0], P[2][1], P[0][0], P[0][1], on, 'W'); }
      txt(c, 'windings (each rated ' + V.plate.split('/')[0] + ' V)', cx, 320, { size: 12, color: C.muted });
      rotor(c, 660, 60, 26, ang, on, V.swap ? -1 : 1);
      txt(c, V.swap ? 'anticlockwise' : 'clockwise', 660, 108, { size: 11.5, color: C.muted });
      txt(c, 'viewed on the shaft end', 660, 124, { size: 11, color: C.muted });
    });
    function verdict() {
      const Vw = +V.plate.split('/')[0], Vs = +V.sup, star = V.con === 'star', across = star ? Vs / Math.sqrt(3) : Vs, r = across / Vw;
      if (r > 1.1) return { ok: false, across, r, msg: 'Each winding gets ' + f0(across) + ' V but is built for ' + Vw + ' V: the magnetising current soars and the motor burns out within minutes. Use ' + (star ? 'a different motor' : 'star') + '.' };
      if (r < 0.9) return { ok: null, across, r, msg: 'Each winding gets only ' + f0(across) + ' V of its ' + Vw + ' V: the motor gives about ' + f0(100 * r * r) + ' % of its torque and overheats under full load. (This is what a star–delta starter does on purpose for the first seconds.) Use ' + (star ? 'delta' : 'a different motor') + '.' };
      return { ok: true, across, r, msg: 'Correct: each winding gets ' + f0(across) + ' V, its rated voltage.' };
    }
    function update() {
      const d = verdict();
      stats.innerHTML = '<div class="boxy" style="margin-bottom:10px">' + (d.ok === true ? '<b style="color:var(--ok)">✓ </b>' : '<b style="color:var(--bad)">✕ </b>') + esc(d.msg) +
        '<div class="small muted mt">Line current in delta is √3 × the winding current; in star they are equal. Swapping any two supply lines reverses the rotation — the only change needed.</div></div>';
      cv.paint();
    }
    update();
    cv.animate(dt => { if (verdict().ok !== false) ang += (V.swap ? -1 : 1) * dt * 3; });
  }

  const SP_TYPES = [['split', 'Split-phase (resistance start)'], ['cs', 'Capacitor start'], ['csr', 'Capacitor start, capacitor run'], ['psc', 'Permanent split capacitor (PSC)'], ['shaded', 'Shaded pole'], ['stein', 'Three-phase motor on one phase (Steinmetz)']];
  function wSingle(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A single phase gives a pulsating field, not a rotating one, so these motors add a second (auxiliary) winding whose current is shifted in time — by resistance, by a capacitor, or by a shading ring. Press Start and watch the centrifugal switch open at about 75 % of speed.' + link('single-phase-problem') + link('capacitor-start-motor') + link('psc-motor') + link('capacitor-sizing') + link('steinmetz-connection') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['type', 'Motor', 'cs', 'sel', SP_TYPES], ['rev', 'Reverse (swap the auxiliary winding\'s leads)', false, 'check'], ['P', 'Motor power (for the capacitor)', 0.75, 'q', ['power', 'kW']], ['V', 'Supply', 230, 'q', ['voltage', 'V']]], v => { V = v; update(); });
    let V = read(), ang = 0, speed = 0, running = false;
    const stats = ui.$('.mstats', el);
    const btn = document.createElement('div'); btn.className = 'row'; btn.style.margin = '0 0 10px'; btn.innerHTML = '<button class="btn sm pri" data-a="go">Start</button><button class="btn sm" data-a="stop">Stop</button>';
    el.insertBefore(btn, ui.$('.mcv', el));
    btn.querySelector('[data-a=go]').onclick = () => { running = true; }; btn.querySelector('[data-a=stop]').onclick = () => { running = false; };
    const cv = canvasIn(ui.$('.mcv', el), 340, (c, w, h) => {
      frame(c, w, h, 720, 340);
      const C = ui.colors(), t = V.type, sw = speed < 0.75, on = running;
      txt(c, 'L', 40, 40, { bold: true }); txt(c, 'N', 40, 300, { bold: true });
      seg(c, [[60, 40], [640, 40]], on); seg(c, [[60, 300], [640, 300]], on);
      if (t === 'stein') {
        // a delta-connected motor: two corners on L and N, the third through a capacitor
        const A = [260, 90], B = [200, 250], Cc = [380, 250];
        winding(c, A[0], A[1], B[0], B[1], on, ''); winding(c, B[0], B[1], Cc[0], Cc[1], on, ''); winding(c, Cc[0], Cc[1], A[0], A[1], on, '');
        seg(c, [[260, 40], A], on); seg(c, [[200, 300], B], on);
        seg(c, [Cc, [460, 250], [460, 160]], on); capSym(c, 460, 140, on, 'C run');
        if (V.rev) seg(c, [[460, 120], [460, 100], [520, 100], [520, 300]], on); else seg(c, [[460, 120], [460, 40]], on);
        txt(c, V.rev ? 'C to N: reversed' : 'C to L', 530, 90, { size: 11.5, align: 'left', color: C.muted });
        txt(c, 'a delta-connected 230 V motor: two corners on the supply, the third through C', 330, 322, { size: 11.5, color: C.muted });
      } else if (t === 'shaded') {
        winding(c, 240, 60, 240, 280, on, 'main winding'); seg(c, [[240, 40], [240, 60]], on); seg(c, [[240, 280], [240, 300]], on);
        c.strokeStyle = C.hue(28, 1); c.lineWidth = 4; c.strokeRect(300, 120, 50, 36); txt(c, 'shading ring', 325, 176, { size: 11.5, color: C.muted });
        txt(c, 'no auxiliary winding: a copper ring on part of each pole delays its flux', 330, 322, { size: 11.5, color: C.muted });
      } else {
        winding(c, 200, 60, 200, 280, on, 'main'); seg(c, [[200, 40], [200, 60]], on); seg(c, [[200, 280], [200, 300]], on);
        const ax = 380;
        // auxiliary branch: winding, capacitor(s), switch; reversing crosses the winding's two leads
        const auxOn = on && (t === 'psc' || t === 'csr' || sw);
        if (V.rev) { seg(c, [[ax, 40], [ax, 48], [ax + 18, 62], [ax + 18, 150], [ax, 170]], auxOn); seg(c, [[ax, 190], [ax, 182], [ax - 18, 168], [ax - 18, 80], [ax, 70]], auxOn); }
        else { seg(c, [[ax, 40], [ax, 70]], auxOn); seg(c, [[ax, 170], [ax, 190]], auxOn); }
        winding(c, ax, 70, ax, 170, auxOn, 'auxiliary');
        if (t === 'split') { resSym(c, ax, 190, auxOn); contactH(c, ax, 236, !sw, on); seg(c, [[ax, 272], [ax, 300]], auxOn); txt(c, 'centrifugal switch', ax + 60, 254, { size: 11.5, color: C.muted, align: 'left' }); }
        if (t === 'cs') { capSym(c, ax, 206, auxOn, 'C start'); contactH(c, ax, 236, !sw, on); seg(c, [[ax, 272], [ax, 300]], auxOn); txt(c, 'centrifugal switch', ax + 60, 254, { size: 11.5, color: C.muted, align: 'left' }); }
        if (t === 'psc') { capSym(c, ax, 206, on, 'C run'); seg(c, [[ax, 226], [ax, 300]], on); }
        if (t === 'csr') {
          seg(c, [[ax, 190], [ax - 50, 190], [ax - 50, 196]], on); seg(c, [[ax, 190], [ax + 50, 190], [ax + 50, 196]], on && sw);
          capSym(c, ax - 50, 212, on, 'C run'); seg(c, [[ax - 50, 232], [ax - 50, 290], [ax, 290], [ax, 300]], on);
          capSym(c, ax + 50, 212, on && sw, 'C start'); contactH(c, ax + 50, 232, !sw, on); seg(c, [[ax + 50, 268], [ax + 50, 290], [ax, 290]], on && sw);
        }
        if (V.rev) txt(c, 'auxiliary leads swapped', ax + 70, 110, { size: 11.5, color: C.hue(28, 1), align: 'left' });
      }
      rotor(c, 620, 170, 34, ang, on && speed > 0.05, V.rev ? -1 : 1);
      txt(c, f0(speed * 100) + ' % speed', 620, 225, { size: 12, color: C.muted });
    });
    function capSym(c, x, y, on, label) { seg(c, [[x, y - 20], [x, y - 4]], on); seg(c, [[x, y + 4], [x, y + 20]], on); c.strokeStyle = col(on); c.lineWidth = 2.6; c.beginPath(); c.moveTo(x - 12, y - 4); c.lineTo(x + 12, y - 4); c.moveTo(x - 12, y + 4); c.lineTo(x + 12, y + 4); c.stroke(); if (label) txt(c, label, x + 18, y, { size: 11.5, align: 'left', color: ui.colors().muted }); }
    function resSym(c, x, y, on) { c.strokeStyle = col(on); c.lineWidth = 2; c.strokeRect(x - 7, y, 14, 36); seg(c, [[x, y + 36], [x, y + 46]], on); txt(c, 'high-R winding', x + 14, y + 18, { size: 11, align: 'left', color: ui.colors().muted }); }
    function contactH(c, x, y, closed, on) { contact(c, x, y, false, closed, on && closed, ''); }
    function update() {
      const t = V.type, C = M().steinmetzC({ P: V.P, V: V.V, f: 50 }) * 1e6;
      const info = {
        split: 'A thin, high-resistance auxiliary winding shifts its current by 20–30°: modest starting torque (100–175 % of rated) and high starting current. Small fans, washing machines, bench grinders. The centrifugal switch must open, or the auxiliary winding burns.',
        cs: 'An electrolytic start capacitor (typically 100–400 µF per kW, rated for short duty) shifts the auxiliary current by nearly 90°: high starting torque (200–400 %) for compressors, pumps and belt drives. It is switched out at about 75 % speed; a switch that sticks closed destroys the capacitor.',
        csr: 'A start capacitor for torque, plus a smaller film run capacitor (about 20–40 µF per kW, continuously rated) left in circuit for a better power factor, efficiency and quieter running. The best single-phase motor for heavier loads.',
        psc: 'One film run capacitor stays in circuit (about 20–40 µF per kW at 230 V): quiet and efficient, low starting torque (30–150 %). Fans, blowers and air-conditioning motors; easy to reverse and to speed-control by voltage.',
        shaded: 'Very simple and cheap, efficiency only 10–30 %, low starting torque; a few watts to about 100 W. Small fans, pumps and displays. Reversed only by turning the stator round.',
        stein: 'A three-phase delta motor (230 V windings) on a 230 V single phase with a run capacitor of about ' + f0(C) + ' µF for ' + n3(V.P / 1000, 3) + ' kW (≈ 70 µF per kW, the rule of thumb for full load — a partly loaded motor balances with less, about 50 µF per kW). It gives only about 60–70 % of its rated power and poor starting torque (add a start capacitor for hard starts). Moving the capacitor to the other supply line reverses it.'
      }[t];
      const capTxt = t === 'cs' || t === 'csr' || t === 'psc' ? '<div class="small muted mt">For ' + n3(V.P / 1000, 3) + ' kW: start capacitor about ' + f0(V.P / 1000 * 100) + '–' + f0(V.P / 1000 * 400) + ' µF (electrolytic, motor-start rated), run capacitor about ' + f0(V.P / 1000 * 20) + '–' + f0(V.P / 1000 * 40) + ' µF, 400–450 V AC film. The motor\'s own label governs.</div>' : '';
      stats.innerHTML = '<div class="boxy" style="margin-bottom:10px">' + esc(info) + capTxt + '</div>' + warnBox('Capacitors can hold a dangerous charge after switch-off: discharge them through a resistor before touching the terminals.');
      cv.paint();
    }
    update();
    cv.animate(dt => {
      const target = running ? (V.type === 'stein' ? 0.95 : 0.96) : 0;
      speed += (target - speed) * Math.min(1, dt * (running ? 1.2 : 0.6)); if (speed < 0.002) speed = 0;
      ang += (V.rev ? -1 : 1) * speed * dt * 14;
    });
  }

  function wStarters(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">The control circuit of a starter, drawn as a ladder: the coil of contactor K1 is fed through the overload contact, the Stop button (normally closed) and the Start button (normally open) — and K1\'s own auxiliary contact latches it on. Press the buttons; trip the overload; lose the supply.' + link('dol-starting') + link('star-delta-starting') + link('motor-protection') + link('emergency-stop') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['kind', 'Starter', 'dol', 'sel', [['dol', 'direct on line (DOL)'], ['sd', 'star–delta']]], ['tset', 'Star–delta timer', 6, 'range', [2, 15, 1], ' s']], v => { V = v; reset(); });
    let V = read(), K1 = false, K2 = false, K3 = false, KT = 0, olTrip = false, supply = true, startHeld = 0, stopHeld = 0, ang = 0, speed = 0;
    const stats = ui.$('.mstats', el);
    const bar = document.createElement('div'); bar.className = 'row'; bar.style.margin = '0 0 10px';
    bar.innerHTML = '<button class="btn sm pri" data-a="start">Start (press)</button><button class="btn sm" data-a="stop">Stop (press)</button><button class="btn sm" data-a="trip">Trip the overload</button><button class="btn sm" data-a="reset">Reset the overload</button><button class="btn sm" data-a="supply">Supply off / on</button>';
    el.insertBefore(bar, ui.$('.mcv', el));
    bar.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (!a) return; if (a === 'start') startHeld = 0.4; if (a === 'stop') stopHeld = 0.4; if (a === 'trip') olTrip = true; if (a === 'reset') olTrip = false; if (a === 'supply') supply = !supply; };
    function reset() { K1 = K2 = K3 = false; KT = 0; speed = 0; }
    function logic(dt) {
      const pre = supply && !olTrip && stopHeld <= 0;       // through the overload contact and the Stop button
      const seal = pre && (startHeld > 0 || K1);             // Start or the latch
      if (V.kind === 'dol') { K1 = seal; K2 = K3 = false; }
      else {
        K1 = seal;
        if (K1) { KT += dt; K2 = KT < V.tset && !K3; K3 = KT >= V.tset + 0.05 && !K2; }   // the timer changes over with a short open gap
        else { KT = 0; K2 = K3 = false; }
      }
      startHeld = Math.max(0, startHeld - dt); stopHeld = Math.max(0, stopHeld - dt);
    }
    const cv = canvasIn(ui.$('.mcv', el), 380, (c, w, h) => {
      frame(c, w, h, 760, 380);
      const C = ui.colors(), sd = V.kind === 'sd', pre = supply && !olTrip;
      txt(c, 'L (control supply, via fuse)', 90, 18, { size: 12, color: C.muted }); txt(c, 'N', 90, 362, { size: 12, color: C.muted });
      seg(c, [[40, 30], [40, 350]], supply, 3); seg(c, [[40, 30], [420, 30]], supply); seg(c, [[40, 350], [420, 350]], supply);
      // rung 1: overload NC, Stop NC, Start NO ∥ K1, coil K1
      const x = 150;
      seg(c, [[x, 30], [x, 44]], supply); contact(c, x, 44, true, !olTrip, supply, 'F2 overload 95–96');
      contact(c, x, 80, true, stopHeld <= 0, pre, 'S1 Stop');
      const a = pre && stopHeld <= 0;
      seg(c, [[x, 116], [x, 124]], a); seg(c, [[x - 40, 124], [x + 40, 124]], a);
      contact(c, x - 40, 124, false, startHeld > 0, a, 'S2 Start'); contact(c, x + 40, 124, false, K1, a, ''); txt(c, 'K1 13–14', x + 54, 142, { size: 11.5, align: 'left', color: C.muted });
      seg(c, [[x - 40, 160], [x - 40, 168], [x + 40, 168], [x + 40, 160]], K1); seg(c, [[x, 168], [x, 250]], K1);
      coil(c, x, 250, 'K1', K1); seg(c, [[x, 272], [x, 350]], K1 || supply);
      if (sd) {
        // star contactor K2 through K3's NC interlock, delta K3 through K2's NC; the timer KT
        const x2 = 280, x3 = 370;
        seg(c, [[x, 200], [x3, 200]], K1); txt(c, 'KT ' + (K1 ? f1(Math.min(KT, V.tset)) + ' / ' + V.tset + ' s' : '—'), x2 - 50, 188, { size: 11.5, color: C.muted });
        seg(c, [[x2, 200], [x2, 206]], K1); contact(c, x2, 206, true, KT < V.tset, K1, 'KT'); contact(c, x2, 242, true, !K3, K1 && KT < V.tset, 'K3'); coil(c, x2, 290, 'K2 Y', K2); seg(c, [[x2, 278], [x2, 290]], K2); seg(c, [[x2, 312], [x2, 350]], supply);
        seg(c, [[x3, 200], [x3, 206]], K1); contact(c, x3, 206, false, KT >= V.tset, K1, ''); contact(c, x3, 242, true, !K2, K1 && KT >= V.tset, ''); coil(c, x3, 290, 'K3 Δ', K3); seg(c, [[x3, 278], [x3, 290]], K3); seg(c, [[x3, 312], [x3, 350]], supply);
      }
      // power circuit on the right: L1 L2 L3, K1, overload, motor
      const px = 520;
      [0, 1, 2].forEach(k => { const xx = px + 36 * k; txt(c, 'L' + (k + 1), xx, 18, { size: 12, bold: true }); seg(c, [[xx, 30], [xx, 80]], supply); contact(c, xx, 80, false, K1, supply, k === 0 ? 'K1' : ''); c.strokeStyle = col(K1 && supply); c.lineWidth = 2; c.strokeRect(xx - 8, 130, 16, 26); seg(c, [[xx, 116], [xx, 130]], K1 && supply); seg(c, [[xx, 156], [xx, 200]], K1 && supply); });
      txt(c, 'F2', px - 26, 143, { size: 11.5, color: C.muted });
      const run = K1 && supply && (!sd || K2 || K3);
      c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(px + 36, 250, 44, 0, TAU); c.stroke(); txt(c, 'M 3~', px + 36, 250, { bold: true });
      [0, 1, 2].forEach(k => seg(c, [[px + 36 * k, 200], [px + 36 * k, 212]], run));
      if (sd) txt(c, K2 ? 'running in star (⅓ current and torque)' : K3 ? 'running in delta' : K1 ? 'change-over' : '', px + 36, 316, { size: 12, color: C.accent });
      rotor(c, 700, 250, 26, ang, speed > 0.05, 1); txt(c, f0(100 * speed) + ' %', 700, 294, { size: 12, color: C.muted });
    });
    function update() {
      const st = !supply ? 'Supply lost: K1 drops out and stays off when the power returns — no unexpected restart (the reason for the latch rather than a toggle switch).' : olTrip ? 'The overload has tripped: its NC contact 95–96 opened the coil circuit. Find the cause, let the motor cool, reset.' : K1 ? 'K1 is latched on through its own auxiliary contact 13–14: releasing Start changes nothing; Stop breaks the circuit.' : 'K1 is off. Press Start: the coil is energised and the contact 13–14 latches it.';
      stats.innerHTML = '<div class="boxy" style="margin-bottom:10px">' + esc(st) + (V.kind === 'sd' ? '<div class="small muted mt">Star–delta: K1 and K2 start the motor in star at ⅓ of the direct-on-line current and torque; after the timer K2 opens, and K3 closes for delta. K2 and K3 are interlocked by each other\'s NC contacts so they can never close together (a short circuit).</div>' : '') + '</div>';
    }
    let lastState = '';
    cv.animate(dt => {
      logic(dt);
      const run = K1 && supply && (V.kind === 'dol' || K2 || K3), target = run ? (V.kind === 'sd' && K2 ? 0.9 : 0.98) : 0;
      speed += (target - speed) * Math.min(1, dt * (run ? 0.9 : 0.5)); if (speed < 0.002) speed = 0; ang += speed * dt * 12;
      const s = [K1, K2, K3, olTrip, supply, V.kind].join();
      if (s !== lastState) { lastState = s; update(); }
    });
    update();
  }

  const LEADS = [['4', '4 wires (bipolar)'], ['6', '6 wires (centre-tapped)'], ['8', '8 wires (four half-coils)']];
  function wStepper(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A hybrid stepper has two phases, A and B. Four-wire motors are bipolar only; six-wire motors have a centre tap on each phase; eight-wire motors bring out all four half-coils. How you connect them changes the current, the inductance — and the torque curve. Find the pairs with an ohmmeter: the two leads of one coil show a few ohms, leads of different phases show nothing. Lead colours differ between makers: follow the datasheet.' + link('bipolar-unipolar') + link('stepper-drivers') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['leads', 'Motor leads', '8', 'sel', LEADS], ['conn', 'Connection', 'par', 'sel', [['ser', 'bipolar series (whole coil)'], ['par', 'bipolar parallel (8 wires)'], ['half', 'bipolar half-coil (6 wires: centre tap and one end)'], ['uni', 'unipolar (6 or 8 wires)']]],
      ['Iu', 'Unipolar (per half-coil) rated current', 2, 'q', ['current', 'A']], ['Rh', 'Resistance of one half-coil', 1.2, 'q', ['resistance', 'Ω']], ['Lh', 'Inductance of one half-coil', 2, 'q', ['inductance', 'mH']]], v => { V = v; update(); });
    let V = read();
    const stats = ui.$('.mstats', el);
    const cv = canvasIn(ui.$('.mcv', el), 300, (c, w, h) => {
      frame(c, w, h, 720, 300);
      const C = ui.colors(), n = +V.leads, conn = valid() ? V.conn : 'ser';
      const drawPhase = (x0, name) => {
        // two half-coils in a vertical line; their ends and taps
        winding(c, x0, 50, x0, 130, true, ''); winding(c, x0, 150, x0, 230, true, '');
        seg(c, [[x0, 130], [x0, 150]], n !== 8 || conn === 'ser', 2);
        txt(c, name + ' phase', x0, 26, { bold: true });
        const lab = (y, s) => { dot(c, x0, y, true); txt(c, s, x0 - 16, y, { size: 12, align: 'right' }); };
        lab(50, name + '1'); lab(230, name + '2'); if (n === 6) lab(140, name + ' tap'); if (n === 8) { lab(130, name + '1′'); lab(150, name + '2′'); }
        // the driver connection
        const dx = x0 + 160;
        txt(c, 'driver ' + name + '+ / ' + name + '−', dx, 26, { size: 12, color: C.muted });
        if (conn === 'uni') { seg(c, [[x0, 50], [dx, 50]], true); seg(c, [[x0, 230], [dx, 230]], true); seg(c, [[x0, 140], [dx - 30, 140]], true); txt(c, '+V (common)', dx - 26, 140, { size: 11.5, align: 'left', color: C.accent }); txt(c, 'switch ' + name + '1', dx + 6, 50, { size: 11.5, align: 'left' }); txt(c, 'switch ' + name + '2', dx + 6, 230, { size: 11.5, align: 'left' }); }
        else if (conn === 'half') { seg(c, [[x0, 50], [dx, 50]], true); seg(c, [[x0, 140], [x0 + 60, 140], [x0 + 60, 230], [dx, 230]], true); txt(c, name + '+', dx + 8, 50, { size: 12, align: 'left' }); txt(c, name + '−', dx + 8, 230, { size: 12, align: 'left' }); txt(c, name + '2 unused', x0 + 12, 256, { size: 11, align: 'left', color: C.muted }); }
        else if (conn === 'par') { seg(c, [[x0, 50], [x0 + 40, 50], [x0 + 40, 150], [x0, 150]], true); seg(c, [[x0, 130], [x0 + 80, 130], [x0 + 80, 230], [x0, 230]], true); seg(c, [[x0 + 40, 50], [dx, 50]], true); seg(c, [[x0 + 80, 230], [dx, 230]], true); txt(c, name + '+', dx + 8, 50, { size: 12, align: 'left' }); txt(c, name + '−', dx + 8, 230, { size: 12, align: 'left' }); }
        else { seg(c, [[x0, 50], [dx, 50]], true); seg(c, [[x0, 230], [dx, 230]], true); txt(c, name + '+', dx + 8, 50, { size: 12, align: 'left' }); txt(c, name + '−', dx + 8, 230, { size: 12, align: 'left' }); if (n === 8) txt(c, name + '1′ joined to ' + name + '2′', x0 + 14, 140, { size: 11, align: 'left', color: C.muted }); }
      };
      drawPhase(90, 'A'); drawPhase(440, 'B');
      if (!valid()) txt(c, 'This connection needs ' + (V.conn === 'par' ? 'an 8-wire' : 'a 6- or 8-wire') + ' motor — showing series instead', 360, 285, { size: 12, color: C.bad });
    });
    function valid() { const n = +V.leads; return !((V.conn === 'par' && n !== 8) || ((V.conn === 'uni' || V.conn === 'half') && n === 4)); }
    function update() {
      const conn = valid() ? V.conn : 'ser', I = V.Iu, R = V.Rh, L = V.Lh;
      const tab = { uni: [I, R, L, 1, 'Simple drivers with only low-side switches; only half of each coil works at a time — the least torque at low speed, but a low inductance.'],
        half: [I, R, L, 1, 'The same torque as unipolar at low speed, on a bipolar driver; a good choice for speed.'],
        ser: [I / Math.SQRT2, 2 * R, 4 * L, Math.SQRT2, 'The whole coil, at 0.707 × the unipolar current: about 40 % more torque at low speed than unipolar, but four times the inductance — the torque falls away early. For slow, strong axes.'],
        par: [I * Math.SQRT2, R / 2, L, Math.SQRT2, 'Both halves in parallel, at 1.41 × the unipolar current: the same low-speed torque as series with a quarter of its inductance — the best at speed, but it needs a driver with twice the current.'] }[conn];
      stats.innerHTML = '<div class="boxy" style="margin-bottom:10px"><table class="ftable"><tbody><tr><td>Set the driver current to</td><td class="num"><b>' + n3(tab[0], 3) + ' A</b> per phase</td></tr><tr><td>Phase resistance · inductance</td><td class="num">' + n3(tab[1], 3) + ' Ω · ' + n3(tab[2] * 1e3, 3) + ' mH</td></tr><tr><td>Holding torque compared with unipolar</td><td class="num">× ' + f1(tab[3], 2) + '</td></tr><tr><td>Heat in the motor at standstill</td><td class="num">' + f1(2 * tab[0] * tab[0] * tab[1] * (conn === 'uni' ? 1 : 1)) + ' W</td></tr></tbody></table><p class="small muted mt">' + esc(tab[4]) + '</p></div>' +
        (!valid() ? '' : '') + '<p class="small faint">Swapping the two leads of one phase (A+ with A−) reverses the direction. Never connect or disconnect a stepper while the driver is powered — the inductive spike can destroy the driver.</p>';
      cv.paint();
    }
    update();
  }

  function wSensors(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">How position sensors connect to a controller. Three-wire proximity sensors switch either the +24 V (PNP, "sourcing") or the 0 V (NPN, "sinking") to the input — the input must match. Limit switches for safety are wired normally closed, so a broken wire looks like an open switch and stops the machine. Encoders give two square waves 90° apart; which one leads gives the direction.' + link('proximity-sensors') + link('limit-switches') + link('incremental-encoders') + link('homing-routines') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['what', 'Show', 'prox', 'sel', [['prox', 'a 3-wire proximity sensor on a PLC input'], ['limit', 'a limit switch: NO or NC'], ['enc', 'an incremental encoder: A, B and Z']]],
      ['type', 'Sensor output', 'pnp', 'sel', [['pnp', 'PNP (sourcing: switches +24 V)'], ['npn', 'NPN (sinking: switches 0 V)']]], ['inp', 'PLC input', 'sink', 'sel', [['sink', 'sinking input (common to 0 V) — for PNP'], ['source', 'sourcing input (common to +24 V) — for NPN']]],
      ['nc', 'Limit switch contact', 'nc', 'sel', [['nc', 'normally closed (fail-safe)'], ['no', 'normally open']]], ['dir', 'Encoder direction', 'cw', 'sel', [['cw', 'forward'], ['ccw', 'reverse']]]], v => { V = v; update(); });
    let V = read(), target = false, broken = false, t = 0, pos = 0;
    const stats = ui.$('.mstats', el);
    const bar = document.createElement('div'); bar.className = 'row'; bar.style.margin = '0 0 10px';
    bar.innerHTML = '<button class="btn sm pri" data-a="t">Target / actuator: in / out</button><button class="btn sm" data-a="b">Break / repair the wire</button>';
    el.insertBefore(bar, ui.$('.mcv', el));
    bar.onclick = e => { const a = e.target.dataset && e.target.dataset.a; if (a === 't') target = !target; if (a === 'b') broken = !broken; update(); };
    const cv = canvasIn(ui.$('.mcv', el), 320, (c, w, h) => {
      frame(c, w, h, 720, 320);
      const C = ui.colors();
      if (V.what === 'enc') {
        const dir = V.dir === 'cw' ? 1 : -1, ppr = 8, y0 = [70, 150, 230], name = ['A', 'B', 'Z'];
        name.forEach((n, k) => {
          txt(c, n, 40, y0[k], { bold: true });
          c.strokeStyle = [C.accent, C.hue(28, 1), C.hue(150, 1)][k]; c.lineWidth = 2.2; c.beginPath();
          for (let x = 0; x <= 600; x++) {
            const ph = (pos + x / 600 * 2) * ppr * dir, phase = ph * TAU + (k === 1 ? -Math.PI / 2 : 0);
            const hi = k === 2 ? (((pos + x / 600 * 2) % 1 + 1) % 1) < 0.5 / ppr : Math.sin(phase) >= 0;
            const y = y0[k] + (hi ? -22 : 22); x ? c.lineTo(80 + x, y) : c.moveTo(80 + x, y);
          }
          c.stroke();
        });
        txt(c, V.dir === 'cw' ? 'A leads B by 90°: counting up' : 'B leads A by 90°: counting down', 380, 292, { size: 12.5, color: C.muted });
        return;
      }
      // the 24 V supply rails and the PLC input
      txt(c, '+24 V', 40, 40, { bold: true, size: 12 }); txt(c, '0 V', 40, 280, { bold: true, size: 12 });
      seg(c, [[70, 40], [680, 40]], true); seg(c, [[70, 280], [680, 280]], true);
      const inOn = inputOn();
      // PLC input box
      c.fillStyle = C.surface2; c.strokeStyle = C.text; c.lineWidth = 2; c.fillRect(520, 110, 150, 100); c.strokeRect(520, 110, 150, 100);
      txt(c, 'PLC input I0.0', 595, 128, { size: 12, bold: true });
      c.fillStyle = inOn ? C.ok : C.faint; c.beginPath(); c.arc(595, 165, 12, 0, TAU); c.fill(); txt(c, inOn ? 'ON' : 'off', 595, 194, { size: 12 });
      if (V.what === 'prox') {
        const sink = V.inp === 'sink';
        // common of the input
        seg(c, [[640, 210], [640, sink ? 280 : 40]], true); txt(c, 'common → ' + (sink ? '0 V' : '+24 V'), 648, 236, { size: 11, align: 'left', color: C.muted });
        // the sensor body
        c.fillStyle = C.surface2; c.strokeStyle = C.text; c.fillRect(170, 120, 140, 80); c.strokeRect(170, 120, 140, 80);
        txt(c, V.type.toUpperCase() + ' sensor', 240, 140, { size: 12, bold: true }); c.fillStyle = target ? C.warn : C.faint; c.beginPath(); c.arc(290, 186, 6, 0, TAU); c.fill();
        seg(c, [[200, 120], [200, 40]], true); txt(c, 'brown +', 206, 80, { size: 11, align: 'left', color: C.muted });
        seg(c, [[220, 200], [220, 280]], true); txt(c, 'blue 0 V', 226, 250, { size: 11, align: 'left', color: C.muted });
        const out = target && !broken, drives = out;   // the output transistor is on
        seg(c, [[310, 160], [440, 160]], drives && !broken); if (broken) { txt(c, '✕ broken', 370, 146, { size: 12, color: C.bad }); seg(c, [[440, 160], [520, 160]], false); } else seg(c, [[440, 160], [520, 160]], drives);
        txt(c, 'black: output', 360, 176, { size: 11, color: C.muted });
        c.fillStyle = C.hue(40, 1); c.fillRect(120, target ? 145 : 100, 30, 30); txt(c, 'target', 135, target ? 190 : 90, { size: 11, color: C.muted });
      } else {
        const nc = V.nc === 'nc', closed = nc ? !target : target, flows = closed && !broken;
        seg(c, [[300, 40], [300, 100]], true); contact(c, 300, 100, nc, closed, true, 'limit switch');
        seg(c, [[300, 136], [300, 160]], flows); seg(c, [[300, 160], [broken ? 400 : 520, 160]], flows);
        if (broken) txt(c, '✕ broken wire', 440, 146, { size: 12, color: C.bad });
        seg(c, [[640, 210], [640, 280]], true);
        c.fillStyle = C.hue(40, 1); c.fillRect(340, target ? 104 : 70, 60, 16); txt(c, target ? 'actuated' : 'not actuated', 370, target ? 134 : 60, { size: 11, color: C.muted });
      }
    });
    function inputOn() {
      if (V.what === 'prox') { const match = (V.type === 'pnp') === (V.inp === 'sink'); return match && target && !broken; }
      if (V.what === 'limit') { const closed = V.nc === 'nc' ? !target : target; return closed && !broken; }
      return false;
    }
    function update() {
      let msg = '';
      if (V.what === 'prox') {
        const match = (V.type === 'pnp') === (V.inp === 'sink');
        msg = !match ? 'Mismatch: a ' + V.type.toUpperCase() + ' output needs a ' + (V.type === 'pnp' ? 'sinking' : 'sourcing') + ' input. As wired, the input never sees a current — the sensor LED lights, the PLC sees nothing.'
          : broken ? 'A broken output wire looks exactly like "no target": a normally-open sensor cannot tell a fault from an empty station. Where it matters, use two sensors or a sensor with a diagnostic output.'
          : 'Matched: target present → the output transistor conducts → current flows through the input → ON. Typical sensing distances: 1–15 mm for inductive sensors (more for flush-mounted larger ones on steel; less on aluminium).';
      } else if (V.what === 'limit') {
        msg = V.nc === 'nc' ? (broken ? 'Normally closed and the wire broke: the input goes OFF — exactly as if the limit were reached. The machine stops: the fault is safe.' : 'Normally closed: the input is ON while all is well and goes OFF at the limit. A broken wire also gives OFF, so the machine stops — fail-safe. Safety switches also have positive-opening contacts that are forced apart mechanically.')
          : (broken ? 'Normally open and the wire broke: the input stays OFF — the controller can never see the limit, and the axis drives into the end stop. This is why safety limits are never wired NO.' : 'Normally open: the input goes ON at the limit. Fine for homing and counting, not for safety — a broken wire is invisible.');
      } else msg = 'Quadrature: A and B are 90° apart, so the controller counts every edge of both — 4 counts per line (a 1000-line encoder gives 4000 counts per turn). Z pulses once per turn for homing. Line-driver (RS-422) outputs send each signal with its inverse for long, noisy cable runs.';
      stats.innerHTML = '<div class="boxy" style="margin-bottom:10px">' + esc(msg) + '</div>';
      cv.paint();
    }
    update();
    cv.animate(dt => { t += dt; if (V.what === 'enc') pos += dt * 0.15; });
  }

  /* ================================================================ DRIVES */
  const DRIVES = [['pwm', 'PWM and current ripple'], ['stepdir', 'Step, direction and DIP switches'], ['vfd', 'VFD ramps and V/f'], ['softstart', 'Starting methods compared'], ['homing', 'Homing an axis']];
  function drives(el, params, sub) {
    const T = subtabs(el, 'drives', DRIVES, sub, NOTE);
    ({ pwm: dPwm, stepdir: dStepDir, vfd: dVfd, softstart: dSoft, homing: dHoming })[T.tab](T.body);
  }

  function dPwm(el) {
    const L = layout(el, 'A PWM driver switches the full supply on and off thousands of times a second; the winding\'s inductance smooths the current, which ripples around its average. The average voltage is the duty cycle times the supply. Lower the frequency or the inductance and the ripple grows — and below about 18 kHz you hear it.' + link('pwm-speed-control') + link('h-bridge') + link('dc-motor-drivers'));
    const read = form(L.form, [['V', 'Supply voltage', 24, 'q', ['voltage', 'V']], ['D', 'Duty cycle', 50, 'range', [0, 100, 1], ' %'], ['f', 'PWM frequency', 20, 'q', ['frequency', 'kHz']],
      ['L', 'Winding inductance', 0.5, 'q', ['inductance', 'mH']], ['R', 'Winding resistance', 0.5, 'q', ['resistance', 'Ω']], ['E', 'Back-EMF (the motor\'s speed × K)', 8, 'q', ['voltage', 'V']],
      ['decay', 'Off-time path', 'slow', 'sel', [['slow', 'slow decay: the bridge shorts the winding'], ['fast', 'fast decay: the supply is reversed across it']]]], calc);
    const pl = plotIn(L.plot, { x: { label: 'time (µs)', min: 0 }, y: { label: 'voltage (V) · current (A)' } }, 250);
    function calc(v) {
      if (!(v.V > 0 && v.f > 0 && v.L > 0 && v.R > 0)) { L.stats.innerHTML = '<p class="muted">Positive supply, frequency, inductance and resistance.</p>'; return; }
      const D = v.D / 100, T = 1 / v.f, n = 200, dt = T / n, off = v.decay === 'fast' ? -v.V : 0;
      let i = 0; const pts = [], vv = [];
      const step = (u) => { i += dt * (u - v.E - v.R * i) / v.L; if (i < 0) i = 0; };   // the diode stops the current reversing
      for (let k = 0; k < 400 * n; k++) { const ph = (k % n) / n; step(ph < D ? v.V : off); }   // settle
      let sum = 0, mn = Infinity, mx = -Infinity;
      for (let k = 0; k < 3 * n; k++) { const ph = (k % n) / n, u = ph < D ? v.V : (i > 0 ? off : v.E); step(ph < D ? v.V : off); pts.push([k * dt * 1e6, i]); vv.push([k * dt * 1e6, u]); if (k >= 2 * n) { sum += i; mn = Math.min(mn, i); mx = Math.max(mx, i); } }
      const Iavg = sum / n, rip = mx - mn, audible = v.f < 18000;
      L.stats.innerHTML = stat('Average voltage', f1(D * v.V, 2) + ' V', 'D × V = ' + f0(v.D) + ' % × ' + f1(v.V) + ' V', 'big') + stat('Average current', f1(Iavg, 3) + ' A', mn <= 1e-6 ? 'discontinuous: the current falls to zero each cycle' : 'continuous') +
        stat('Ripple, peak to peak', f1(rip, 3) + ' A', f0(Iavg > 0 ? 100 * rip / Iavg : 0) + ' % of the average; the worst case V/(4Lf) = ' + n3(M().pwmRipple({ V: v.V, D: 0.5, L: v.L, f: v.f }), 3) + ' A at 50 %') +
        stat('Frequency', f1(v.f / 1000, 1) + ' kHz', audible ? 'audible: expect a whine from the winding' : 'above hearing; switching losses grow with frequency') +
        stat('Electrical time constant L/R', n3(v.L / v.R * 1e3, 3) + ' ms', 'the ripple is small when the PWM period ' + n3(T * 1e3, 3) + ' ms is much shorter');
      pl.set({ series: [{ pts: vv, label: 'voltage across the winding (V)' }, { pts: pts, label: 'current (A)' }] });
    }
    calc(read());
  }

  // a typical 2-phase stepper driver's switches (generic): SW1–SW3 current, SW4 idle current, SW5–SW8 microsteps
  const DIP_I = [[1.0, 0.7], [1.46, 1.04], [1.91, 1.36], [2.37, 1.69], [2.84, 2.03], [3.31, 2.36], [3.76, 2.69], [4.2, 3.0]];   // peak, RMS
  const DIP_MS = [400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 1000, 2000, 4000, 5000, 8000, 10000, 20000, 25000];
  function dStepDir(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A stepper driver takes three signals: STEP (one pulse per microstep), DIR (the direction, set before the pulses) and ENABLE. Its DIP switches set the current and the microsteps. Click the switches. <b>The table is a typical one, not any maker\'s</b> — your driver\'s label and manual govern.' + link('dip-switch-settings') + link('step-dir-signals') + link('step-modes') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div><div class="mtab"></div>';
    const read = form(ui.$('.mform', el), [['rpm', 'Motor speed', 300, 'q', ['angvel', 'rpm']], ['lead', 'Travel per motor revolution (screw lead, belt pitch × teeth)', 5, 'q', ['length', 'mm']], ['dir', 'Direction', 'cw', 'sel', [['cw', 'forward (DIR high)'], ['ccw', 'reverse (DIR low)']]], ['Im', 'Motor rated current (per phase)', 2.8, 'q', ['current', 'A']]], v => { V = v; update(); });
    let V = read(), sw = [0, 1, 1, 0, 0, 0, 1, 1], t = 0;   // SW1..SW8, 1 = ON
    const stats = ui.$('.mstats', el), tab = ui.$('.mtab', el);
    const iIdx = () => (sw[0] ? 0 : 1) + (sw[1] ? 0 : 2) + (sw[2] ? 0 : 4), mIdx = () => (sw[4] ? 0 : 1) + (sw[5] ? 0 : 2) + (sw[6] ? 0 : 4) + (sw[7] ? 0 : 8);
    const cv = canvasIn(ui.$('.mcv', el), 300, (c, w, h) => {
      frame(c, w, h, 720, 300);
      const C = ui.colors();
      // the DIP switch block
      c.fillStyle = 'hsl(0 70% 42%)'; c.fillRect(40, 20, 330, 90);
      for (let k = 0; k < 8; k++) {
        const x = 58 + k * 39;
        c.fillStyle = '#eee'; c.fillRect(x, 34, 24, 56); c.fillStyle = '#333'; c.fillRect(x + 3, sw[k] ? 37 : 63, 18, 24);
        txt(c, String(k + 1), x + 12, 100, { size: 11, color: '#fff' });
      }
      txt(c, 'ON ↑', 392, 40, { size: 12, align: 'left' }); txt(c, 'current', 118, 12, { size: 11, color: C.muted }); txt(c, 'idle', 196, 12, { size: 11, color: C.muted }); txt(c, 'microsteps', 294, 12, { size: 11, color: C.muted });
      // the signals
      const ms = DIP_MS[mIdx()], f = V.rpm / TAU * ms, y0 = [150, 205, 260], names = ['STEP', 'DIR', 'ENA'];
      names.forEach((n, k) => txt(c, n, 60, y0[k], { bold: true, size: 12 }));
      const shown = Math.max(1, Math.min(40, Math.round(f * 0.002)));   // pulses in the 2 ms window drawn (capped for legibility)
      c.lineWidth = 2; c.strokeStyle = C.accent; c.beginPath();
      for (let x = 0; x <= 560; x++) { const ph = ((x / 560 * shown + t * 3) % 1), hi = ph < 0.5; const y = y0[0] + (hi ? -14 : 14); x ? c.lineTo(110 + x, y) : c.moveTo(110 + x, y); }
      c.stroke();
      seg(c, [[110, y0[1] + (V.dir === 'cw' ? -14 : 14)], [670, y0[1] + (V.dir === 'cw' ? -14 : 14)]], true);
      seg(c, [[110, y0[2] + 14], [670, y0[2] + 14]], false);
      txt(c, f > 0 ? f0(f) + ' pulses/s' + (shown >= 40 ? ' (drawn slower)' : '') : '', 670, y0[0] - 26, { size: 11.5, align: 'right', color: C.muted });
      txt(c, 'ENABLE: motor energised (active-low on many drivers)', 670, y0[2] - 24, { size: 11, align: 'right', color: C.muted });
    });
    cv.onClick = (x, y) => {
      const s = Math.min(cv.w / 720, cv.h / 300), ox = (cv.w - 720 * s) / 2, oy = (cv.h - 300 * s) / 2, X = (x - ox) / s, Y = (y - oy) / s;
      if (Y < 30 || Y > 95) return;
      const k = Math.floor((X - 55) / 39); if (k >= 0 && k < 8) { sw[k] = sw[k] ? 0 : 1; update(); }
    };
    function update() {
      const rpm = V.rpm * 60 / TAU, I = DIP_I[iIdx()], ms = DIP_MS[mIdx()], f = rpm / 60 * ms, res = V.lead / ms;
      const tooHigh = I[1] > V.Im * 1.05;
      stats.innerHTML = stat('Pulse frequency needed', f0(f) + ' Hz', f > 200000 ? 'above many controllers\' and drivers\' limits (often 100–500 kHz): use fewer microsteps' : 'at ' + f0(rpm) + ' rpm', 'big' + (f > 200000 ? ' bad' : '')) +
        stat('Microsteps per revolution', f0(ms), 'SW5–SW8; ' + f1(360 / ms, 4) + '° per pulse') + stat('Travel per pulse', n3(res * 1e6, 3) + ' µm', 'resolution, not accuracy: real microsteps are uneven, especially under load') +
        stat('Output current', I[0] + ' A peak / ' + I[1] + ' A RMS', (tooHigh ? 'above the motor\'s ' + n3(V.Im, 3) + ' A — it will overheat' : 'motor rated ' + n3(V.Im, 3) + ' A')) +
        stat('Idle current (SW4)', sw[3] ? 'full current at standstill' : 'halved after about 0.5 s at rest', sw[3] ? 'more holding torque, more heat' : 'less heat, about half the holding torque');
      const hi = iIdx(), hm = mIdx();
      tab.innerHTML = '<div class="cols2" style="margin:0"><div class="boxy"><h3>Current: SW1–SW3</h3><table class="ftable"><thead><tr><th>SW1 SW2 SW3</th><th>Peak</th><th>RMS</th></tr></thead><tbody>' + DIP_I.map((r, k) => '<tr' + (k === hi ? ' class="hl"' : '') + '><td>' + [k & 1, k & 2, k & 4].map(b => b ? 'off' : 'ON').join(' ') + '</td><td class="num">' + r[0] + ' A</td><td class="num">' + r[1] + ' A</td></tr>').join('') + '</tbody></table></div>' +
        '<div class="boxy"><h3>Microsteps: SW5–SW8</h3><table class="ftable"><thead><tr><th>SW5 SW6 SW7 SW8</th><th>Pulses/rev</th></tr></thead><tbody>' + DIP_MS.map((r, k) => '<tr' + (k === hm ? ' class="hl"' : '') + '><td>' + [k & 1, k & 2, k & 4, k & 8].map(b => b ? 'off' : 'ON').join(' ') + '</td><td class="num">' + r + '</td></tr>').join('') + '</tbody></table></div></div>' +
        '<p class="small faint mt">Typical timing: STEP pulses at least 2.5 µs wide; DIR set at least 5 µs before the next pulse; ENABLE a few ms before the first. Inputs are opto-isolated, usually for 5 V — 24 V signals need the driver\'s 24 V inputs or series resistors. Change the switches only with the power off: most drivers read them at power-up.</p>';
      cv.paint();
    }
    update();
    cv.animate(dt => { t += dt; });
  }

  function dVfd(el) {
    const L = layout(el, 'A VFD ramps the frequency up and down at the rates you set, keeping V/f constant below the base frequency (with a boost at low speed for the stator resistance) and holding the voltage at its maximum above it — field weakening. Too short a ramp trips the drive on overcurrent while accelerating, or on overvoltage while braking a large inertia.' + link('vfd-principle') + link('v-over-f-control') + link('vfd-parameters') + link('vfd-braking'));
    const read = form(L.form, [['Vn', 'Motor rated voltage', 400, 'q', ['voltage', 'V']], ['fn', 'Base (rated) frequency', 50, 'q', ['frequency', 'Hz']], ['boost', 'Voltage boost at 0 Hz', 3, 'range', [0, 10, 0.5], ' %'],
      ['fmax', 'Maximum frequency', 70, 'q', ['frequency', 'Hz']], ['fset', 'Set-point', 45, 'q', ['frequency', 'Hz']], ['tacc', 'Acceleration time (0 → base frequency)', 5, 'q', ['time', 's']], ['tdec', 'Deceleration time (base → 0)', 5, 'q', ['time', 's']],
      ['sep1', 'Motor and load', null, 'sep'], ['P', 'Motor power', 7.5, 'q', ['power', 'kW']], ['poles', 'Poles', '4', 'sel', [['2', '2'], ['4', '4'], ['6', '6']]], ['J', 'Total inertia (motor + load at the motor)', 0.5, 'q', ['inertia', 'kg·m²']]], calc);
    const p1 = plotIn(L.plot, { x: { label: 'frequency (Hz)', min: 0 }, y: { label: 'output voltage (V)', min: 0 } }, 200);
    const p2 = plotIn(L.plot, { x: { label: 'time (s)', min: 0 }, y: { label: 'frequency (Hz)', min: 0 } }, 200);
    function calc(v) {
      if (!(v.Vn > 0 && v.fn > 0 && v.fmax > 0 && v.tacc > 0 && v.tdec > 0 && v.P > 0 && v.J >= 0)) { L.stats.innerHTML = '<p class="muted">Positive values.</p>'; return; }
      const fs = Math.min(v.fset, v.fmax), poles = +v.poles, ns = 120 * fs / poles, w = ns * TAU / 60;
      const Tn = v.P / (120 * v.fn / poles * 0.97 * TAU / 60), alpha = (120 * v.fn / poles * TAU / 60) / v.tacc, Tacc = v.J * alpha, Tdec = v.J * (120 * v.fn / poles * TAU / 60) / v.tdec;
      const E = M().brakeEnergy({ J: v.J, n1: ns, n2: 0 }), Pbr = E / (v.tdec * fs / v.fn);
      L.stats.innerHTML = stat('Time to reach ' + f1(fs) + ' Hz', f1(v.tacc * fs / v.fn, 2) + ' s', 'motor ' + f0(ns) + ' rpm (synchronous)', 'big') +
        stat('Torque to accelerate the inertia', f1(Tacc) + ' N·m', f0(100 * Tacc / Tn) + ' % of rated ' + f1(Tn) + ' N·m' + (Tacc > 1.5 * Tn ? ' — too fast: overcurrent trip; lengthen the ramp' : '')) +
        stat('Braking torque while decelerating', f1(Tdec) + ' N·m', f0(100 * Tdec / Tn) + ' % of rated' + (Tdec > 0.2 * Tn ? ' — needs a braking resistor (the DC bus absorbs only ~10–20 %)' : '')) +
        stat('Energy returned when stopping', f1(E / 1000, 2) + ' kJ', 'average ' + f0(Pbr) + ' W during the ramp — size the braking resistor for this and for how often you stop') +
        stat('Voltage at ' + f1(fs) + ' Hz', f0(M().vf({ Vn: v.Vn, fn: v.fn, f: fs, boost: v.boost / 100 * v.Vn })) + ' V', fs > v.fn ? 'above base frequency: constant voltage, torque falls as ' + f0(100 * v.fn / fs) + ' %' : 'V/f = ' + f1(v.Vn / v.fn, 2) + ' V/Hz');
      const vf = []; for (let i = 0; i <= 100; i++) { const f = v.fmax * i / 100; vf.push([f, M().vf({ Vn: v.Vn, fn: v.fn, f, boost: v.boost / 100 * v.Vn })]); }
      p1.set({ series: [{ pts: vf, label: 'V/f with boost' }], vlines: [{ x: v.fn, label: 'base' }], marks: [{ x: fs, y: M().vf({ Vn: v.Vn, fn: v.fn, f: fs, boost: v.boost / 100 * v.Vn }), label: 'set' }] });
      const ta = v.tacc * fs / v.fn, hold = Math.max(2, ta), td = v.tdec * fs / v.fn, ramp = [[0, 0], [ta, fs], [ta + hold, fs], [ta + hold + td, 0], [ta + hold + td + 1, 0]];
      p2.set({ series: [{ pts: ramp, label: 'output frequency' }] });
    }
    calc(read());
  }

  function dSoft(el) {
    const L = layout(el, 'One motor and one load started four ways: direct on line, star–delta, a soft starter with a current limit, and a VFD. Watch the current — what the supply and the fuses see — and the time to reach speed. The simulation integrates the motor\'s torque against the load and the inertia.' + link('dol-starting') + link('star-delta-starting') + link('soft-starters') + link('vfd-principle'));
    const read = form(L.form, [['P', 'Motor power (400 V, 4 poles)', 11, 'q', ['power', 'kW']], ['load', 'Load, % of rated torque', 80, 'range', [0, 120, 5], ' %'], ['type', 'Load', 'fan', 'sel', [['fan', 'fan or centrifugal pump (∝ speed²)'], ['const', 'conveyor (constant)']]],
      ['Jr', 'Load inertia, × the motor\'s own', 5, 'range', [0, 40, 1], ' ×'], ['tsd', 'Star–delta change-over after', 6, 'q', ['time', 's']], ['ilim', 'Soft starter current limit, × rated', 3.5, 'range', [2, 5, 0.5], ' ×'], ['tvfd', 'VFD ramp to 50 Hz', 5, 'q', ['time', 's']]], calc);
    const p1 = plotIn(L.plot, { x: { label: 'time (s)', min: 0 }, y: { label: 'line current, × rated', min: 0 } }, 240);
    const p2 = plotIn(L.plot, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (rpm)', min: 0 } }, 200);
    function calc(v) {
      if (!(v.P > 0)) { L.stats.innerHTML = '<p class="muted">A positive power.</p>'; return; }
      const kW = v.P / 1000, im = cageMotor(kW, 400, 50, 4), sR = slipAtPower(im, v.P), rp = im.at(sR), Tn = rp.Pmech / ((1 - sR) * im.ws), In = rp.I1;
      const Jm = 0.0045 * Math.pow(kW, 1.25) + 0.002, J = Jm * (1 + v.Jr), ws = im.ws;
      const Tl = w => v.load / 100 * Tn * (v.type === 'fan' ? Math.pow(w / ((1 - sR) * ws), 2) : 1);
      const run = mode => {
        let w = 0, t = 0; const dt = 0.002, cur = [], sp = []; let done = null, peak = 0;
        while (t < 30) {
          let T, I;
          if (mode === 'vfd') {
            const f = Math.max(0.5, Math.min(50, 50 * t / v.tvfd)), m = cageMotor(kW, 400, 50, 4, f, 20), s = Math.max(1e-4, 1 - w / m.ws), o = m.at(Math.min(1, s)); T = o.T; I = o.I1 * Math.min(1, 0.4 + 0.6 * f / 50);   // supply-side current falls with the output power
          } else {
            const s = Math.max(1e-4, 1 - w / ws), o = im.at(s);
            let k = 1, lineMul = 1;
            if (mode === 'sd' && t < v.tsd) { k = 1 / Math.sqrt(3); lineMul = 1 / Math.sqrt(3); }   // star: winding at V/√3, line current I/3
            if (mode === 'soft') { k = Math.min(1, 0.35 + 0.65 * t / 10, (v.ilim * In) / o.I1); }
            T = k * k * o.T; I = o.I1 * k * lineMul;
          }
          w = Math.max(0, w + dt * (T - Tl(w)) / J);
          peak = Math.max(peak, I);
          if (done == null && w >= 0.97 * (1 - sR) * ws * (v.type === 'fan' ? 1 : 0.995)) done = t;
          if (Math.round(t / dt) % 10 === 0) { cur.push([t, I / In]); sp.push([t, w * 60 / TAU]); }
          if (done != null && t > done + 2) break;
          t += dt;
        }
        return { cur, sp, done, peak };
      };
      const R = { dol: run('dol'), sd: run('sd'), soft: run('soft'), vfd: run('vfd') }, names = { dol: 'direct on line', sd: 'star–delta', soft: 'soft starter', vfd: 'VFD' };
      L.stats.innerHTML = Object.keys(R).map(k => stat(names[k], R[k].done != null ? f1(R[k].done, 1) + ' s to speed' : 'does not reach speed', 'peak ' + f1(R[k].peak / In, 1) + ' × rated (' + f0(R[k].peak) + ' A)', k === 'dol' ? 'big' : '')).join('') +
        stat('Motor', f1(kW, 1) + ' kW, ' + f1(In) + ' A rated', 'rated torque ' + f1(Tn) + ' N·m; inertia ' + n3(J, 3) + ' kg·m² in all');
      p1.set({ series: Object.keys(R).map(k => ({ pts: R[k].cur, label: names[k] })) });
      p2.set({ series: Object.keys(R).map(k => ({ pts: R[k].sp, label: names[k] })) });
    }
    calc(read());
  }

  function dHoming(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">A controller does not know where an axis is at power-up (unless its encoder is absolute). Homing finds a fixed reference: move fast towards the home switch, stop, back off slowly until the switch releases, and — for the best repeatability — carry on to the encoder\'s next index pulse. The error of a switch caught at speed is the speed times the input delay.' + link('homing-routines') + link('limit-switches') + link('incremental-encoders') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div></div></div><div class="mcv"></div>';
    const read = form(ui.$('.mform', el), [['vf', 'Search speed', 50, 'q', ['speed', 'mm/s']], ['vs', 'Slow (latch) speed', 2, 'q', ['speed', 'mm/s']], ['delay', 'Input and scan delay', 2, 'q', ['time', 'ms']],
      ['index', 'Finish on the encoder index pulse', true, 'check'], ['lead', 'Travel per motor turn (one index pulse per turn)', 5, 'q', ['length', 'mm']], ['x0', 'Start position', 180, 'q', ['length', 'mm']]], v => { V = v; restart(); });
    let V = read(), x, st, msgs, tt;
    const stats = ui.$('.mstats', el);
    const bar = document.createElement('div'); bar.className = 'row'; bar.style.margin = '0 0 10px'; bar.innerHTML = '<button class="btn sm pri" data-a="go">Home</button>';
    el.insertBefore(bar, ui.$('.mcv', el)); bar.querySelector('button').onclick = () => { restart(); st = 'fast'; };
    const SW = 20;   // the switch is made for x < 20 mm
    function restart() { x = Math.max(SW + 5, Math.min(200, (V.x0 || 0.18) * 1000)); st = 'idle'; msgs = []; tt = 0; update(); }
    const cv = canvasIn(ui.$('.mcv', el), 220, (c, w, h) => {
      frame(c, w, h, 720, 220);
      const C = ui.colors(), X = mm => 60 + mm * 3;
      c.fillStyle = C.faint; c.fillRect(X(-10), 120, X(210) - X(-10), 12);
      for (let m = 0; m <= 200; m += 10) { c.fillStyle = C.muted; c.fillRect(X(m), 132, 1, m % 50 ? 5 : 9); if (m % 50 === 0) txt(c, m + '', X(m), 152, { size: 11, color: C.muted }); }
      c.fillStyle = C.hue(0, 0.25); c.fillRect(X(-10), 96, X(SW) - X(-10), 24); txt(c, 'home switch made', X(5), 86, { size: 11.5, color: C.bad });
      if (V.index) { const lead = V.lead * 1000; for (let m = lead * Math.ceil(-10 / lead); m <= 200; m += lead) { c.fillStyle = C.hue(150, 1); c.fillRect(X(m) - 1, 136, 2, 10); } txt(c, 'index pulses', X(160), 170, { size: 11, color: C.hue(150, 1) }); }
      c.fillStyle = C.accent; c.fillRect(X(x) - 16, 92, 32, 28); txt(c, st === 'done' ? 'home' : '', X(x), 80, { size: 12, bold: true, color: C.ok });
      txt(c, 'x = ' + f1(x, 2) + ' mm — ' + ({ idle: 'press Home', fast: 'searching fast', stop: 'switch seen: stopping', back: 'backing off slowly', index: 'waiting for the index pulse', done: 'homed' })[st], 360, 200, { size: 12.5 });
    });
    function update() {
      const vf = V.vf * 1000, vs = V.vs * 1000, dl = V.delay;
      const eFast = vf * dl, eSlow = vs * dl;
      stats.innerHTML = stat('Error if homed at search speed', '± ' + n3(eFast * 1000, 3) + ' µm', f1(vf) + ' mm/s × ' + f1(dl * 1000, 1) + ' ms, plus the switch\'s own scatter', eFast > 0.05e-3 * 1000 ? 'bad' : '') +
        stat('Error when latched at the slow speed', '± ' + n3(eSlow * 1000, 3) + ' µm', 'why homing backs off and approaches slowly') +
        stat('With the index pulse', V.index ? 'about ± 1 encoder count' : 'not used', 'the switch only chooses which index pulse; the pulse itself is the reference');
      cv.paint();
    }
    restart();
    cv.animate(dt => {
      const vf = V.vf * 1000, vs = V.vs * 1000, lead = V.lead * 1000, sub = 20, h = dt / sub;
      for (let k = 0; k < sub; k++) {
        if (st === 'fast') { x -= vf * h; if (x < SW) { tt += h; if (tt >= V.delay) { st = 'stop'; tt = 0; } } }
        else if (st === 'stop') { x -= vf * 0.5 * h; tt += h; if (tt > 0.08) st = 'back'; }
        else if (st === 'back') { x += vs * h; if (x >= SW) st = V.index ? 'index' : 'done'; }
        else if (st === 'index') { const before = Math.floor(x / lead); x += vs * h; if (Math.floor(x / lead) > before) { x = Math.floor(x / lead) * lead; st = 'done'; } }
      }
    });
  }

  H.motorTools = { motorlab, sizing, wiring, drives };
})();
