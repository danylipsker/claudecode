/* HYPER-CORE · ui/fluidtools.js
 *
 * The Tools pages of Hyper Aerodynamics, Hyper Hydraulics and Hyper Pneumatics.
 *
 *   #/tools/airfoil                      the airfoil lab: any NACA four-digit section by the panel method —
 *                                        pressure distribution, lift curve, critical Mach, coordinates for CAD
 *   #/tools/flight/<atmosphere|airspeed|isentropic|normal|oblique|wing>
 *   #/tools/hydro/<pipe|pump|channel|hammer>
 *   #/tools/fpower/<cylinder|pump|motor|orifice|accumulator|oil>
 *   #/tools/pneu/<cylinder|valve|air|leak|vacuum|receiver>
 *   #/tools/iso                          the ISO 1219 symbol chart, drawn by fluidsym.js
 *
 * The physics is HYPER-CORE/js/fluid.js (tested by tools/test-fluid.js); every input takes any unit of
 * its quantity and is converted to SI on the way in.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, F = () => H.fluid, S = () => H.fsym;
  const D2R = Math.PI / 180, G0 = 9.80665, PATM = 101325;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const inU = (x, q, u, d) => Number.isFinite(x) ? U.fmt(H.units.fromSI(x, q, u), d || 4) + ' ' + u : '—';

  /* ---------------------------------------------------------------- form, layout, plots */
  // fields: [id, label, value, kind, extra]; kind 'q' (extra = [quantity, unit]: value read in SI),
  // 'n' (a plain number, extra = unit label), 'sel' (extra = [[value, text], …]), 'check', 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
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
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (d[3] === 'q') x = H.units.toSI(x, d[4][0], el.querySelector('[data-u="' + id + '"]').value);
        v[id] = x;
      });
      return v;
    };
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
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, opts || {});
    ui.onLeave(() => p.destroy());
    return p;
  }
  // a plain canvas that redraws itself with draw(ctx, w, h) on demand and on resize
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    return { cv, paint };
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  function download(name, text, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: type || 'text/plain' }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';

  /* ================================================================ AERODYNAMICS */
  // Kármán–Tsien compressibility correction and the sonic pressure coefficient
  const karmanTsien = (cp0, M) => { const b = Math.sqrt(1 - M * M); return cp0 / (b + M * M / (1 + b) * cp0 / 2); };
  const cpStar = (M, g) => { g = g || 1.4; return 2 / (g * M * M) * (Math.pow((2 + (g - 1) * M * M) / (g + 1), g / (g - 1)) - 1); };
  function criticalMach(cpmin) {
    if (!(cpmin < 0)) return NaN;
    let lo = 0.05, hi = 0.999;
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (karmanTsien(cpmin, m) < cpStar(m)) hi = m; else lo = m; }
    return (lo + hi) / 2;
  }

  function airfoil(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Any NACA four-digit airfoil — camber, its position and thickness — solved by a panel method (constant sources and a vortex, with the Kutta condition). The flow is inviscid: lift and moment before the stall are close to wind-tunnel values, but drag and the stall itself are not modelled.' + link('panel-methods', 'Panel methods') + link('naca-airfoils', 'NACA airfoils') + '</p>' +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="afshape"></div><div class="afplots" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px"></div><div class="mextra"></div></div></div>';
    const L = { form: ui.$('.mform', el), stats: ui.$('.mstats', el), shape: ui.$('.afshape', el), plots: ui.$('.afplots', el), extra: ui.$('.mextra', el) };
    let cur = null;
    const shape = canvasIn(L.shape, 190, (c, w, h) => {
      if (!cur) return;
      const C = ui.colors(), s = Math.min(w * 0.86, h * 5), x0 = (w - s) / 2, y0 = h / 2;
      const P = (x, y) => [x0 + x * s, y0 - y * s];
      c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(...P(0, 0)); c.lineTo(...P(1, 0)); c.stroke(); c.setLineDash([]);
      // Cp arrows on the surface
      cur.sol.cp.forEach((q, i) => {
        if (i % 2) return;
        const p1 = cur.pts[i], p2 = cur.pts[i + 1], tx = p2[0] - p1[0], ty = p2[1] - p1[1], l = Math.hypot(tx, ty) || 1;
        const nx = -ty / l, ny = tx / l, m = Math.min(1.8, Math.abs(q.cp)) * 22, [x, y] = P(q.x, q.y), ox = x + nx * m, oy = y - ny * m;
        c.strokeStyle = q.cp < 0 ? 'hsl(8 80% 60% / .65)' : 'hsl(215 80% 62% / .65)'; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(ox, oy); c.stroke();
      });
      c.beginPath(); cur.pts.forEach((q, i) => { const [x, y] = P(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
      c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
      c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([5, 3]); c.beginPath();
      for (let i = 0; i <= 60; i++) { const x = i / 60, [xx, yy] = P(x, F().nacaCamber(cur.m, cur.p, x)[0]); i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
      c.stroke(); c.setLineDash([]);
      c.fillStyle = C.muted; c.font = '12px system-ui, sans-serif';
      c.fillText(cur.name + '  ·  camber line dashed  ·  red: suction, blue: pressure (α = ' + cur.alphaDeg + '°)', 8, 16);
    });
    const pCp = plotIn(L.plots, { x: { label: 'x / c', min: 0, max: 1 }, y: { label: '−Cp' }, legend: true }, 230);
    const pCl = plotIn(L.plots, { x: { label: 'angle of attack (°)' }, y: { label: 'lift coefficient c_l' }, legend: true }, 230);
    const read = form(L.form, [
      ['m', 'Maximum camber', 2, 'n', '% chord'], ['p', 'Camber position', 40, 'n', '% chord'], ['t', 'Thickness', 12, 'n', '% chord'],
      ['a', 'Angle of attack', 4, 'n', '°'], ['np', 'Panels', 80, 'sel', [[40, '40'], [80, '80'], [140, '140 (finer)']]],
      ['s1', 'For CAD', 0, 'sep'], ['chord', 'Chord', 100, 'n', 'mm']
    ], v => calc(v));
    L.extra.innerHTML = '<div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn" data-dl="dat">Download coordinates (.dat, Selig format)</button><button class="btn" data-dl="xyz">Download for CAD (X Y Z in mm, .txt)</button></div>' +
      '<p class="small faint" style="margin-top:6px">The .txt file suits “Curve Through XYZ Points” in SOLIDWORKS and similar commands; the .dat file suits XFOIL and most airfoil tools. The trailing edge is closed.</p>';
    L.extra.addEventListener('click', e => {
      const b = e.target.closest('[data-dl]'); if (!b || !cur) return;
      const sel = cur.ptsFine.slice().reverse();            // upper trailing edge → leading edge → lower trailing edge
      if (b.dataset.dl === 'dat') download(cur.code + '.dat', cur.name + '\n' + sel.map(q => ' ' + q[0].toFixed(6) + '  ' + q[1].toFixed(6)).join('\n') + '\n');
      else download(cur.code + '-' + cur.chord + 'mm.txt', sel.map(q => (q[0] * cur.chord).toFixed(4) + '\t' + (q[1] * cur.chord).toFixed(4) + '\t0').join('\r\n') + '\r\n');
    });
    function calc(v) {
      const m = Math.max(0, Math.min(9.5, v.m)) / 100, p = Math.max(10, Math.min(90, v.p)) / 100, t = Math.max(1, Math.min(40, v.t)) / 100;
      if (![m, p, t, v.a].every(Number.isFinite)) return;
      const n = +v.np / 2, pts = F().naca4(m, p, t, n), a = v.a * D2R, sol = F().panel(pts, a);
      const code = (Math.round(v.m) === v.m && Math.round(v.p / 10) * 10 === v.p) ? String(v.m) + String(v.p / 10) + String(Math.round(v.t)).padStart(2, '0') : '';
      const name = code ? 'NACA ' + code : 'NACA-type ' + v.m + ' % camber at ' + v.p + ' %, ' + v.t + ' % thick';
      cur = { pts, sol, m, p, t, name, code: code ? 'naca' + code : 'naca-custom', alphaDeg: v.a, chord: v.chord, ptsFine: F().naca4(m, p, t, 100) };
      const ta = F().thinAirfoil(m, p), cpmin = Math.min(...sol.cp.map(c => c.cp)), Mc = criticalMach(cpmin);
      // the lift curve from the panel method, against thin-airfoil theory
      const curve = [], thin = [];
      for (let al = -8; al <= 16; al += 2) { curve.push([al, F().panel(pts, al * D2R).cl]); thin.push([al, ta.clAt(al * D2R)]); }
      const slope = (curve[curve.length - 1][1] - curve[0][1]) / (24 * D2R);
      L.stats.innerHTML = stat('Lift coefficient c_l', n3(sol.cl, 4), 'panel method, inviscid', 'big') + stat('Thin-airfoil c_l', n3(ta.clAt(a), 4), '2π(α − α₀)') +
        stat('Zero-lift angle α₀', n3(ta.alpha0 / D2R, 3) + '°', 'thin-airfoil theory') + stat('Lift slope', n3(slope, 4) + ' /rad', n3(slope * D2R, 3) + ' per degree (2π = 6.283)') +
        stat('Moment about c/4', n3(sol.cm, 3), 'thin-airfoil: ' + n3(ta.cmc4, 3)) + stat('Lowest Cp', n3(cpmin, 3), 'the suction peak') +
        stat('Critical Mach number', Number.isFinite(Mc) ? n3(Mc, 3) : '—', 'Kármán–Tsien: where the suction peak first reaches sonic speed');
      const up = sol.cp.filter(c => c.upper).map(c => [c.x, -c.cp]).sort((q, r) => q[0] - r[0]), lo = sol.cp.filter(c => !c.upper).map(c => [c.x, -c.cp]).sort((q, r) => q[0] - r[0]);
      pCp.set({ series: [{ pts: up, label: 'upper' }, { pts: lo, label: 'lower', dash: [5, 4] }], hlines: [{ y: 0 }] });
      pCl.set({ series: [{ pts: curve, label: 'panel method', dots: 3 }, { pts: thin, label: 'thin-airfoil theory', dash: [5, 4] }], marks: [{ x: v.a, y: sol.cl, label: 'α' }], hlines: [{ y: 0 }] });
      shape.paint();
    }
    calc(read());
  }

  const FLIGHT = [['atmosphere', 'Standard atmosphere'], ['airspeed', 'Airspeeds'], ['isentropic', 'Isentropic flow'], ['normal', 'Normal shock'], ['oblique', 'Oblique shock'], ['wing', 'Finite wing']];
  function flight(el, params, sub) {
    const T = subtabs(el, 'flight', FLIGHT, sub, 'For learning: flight planning and operation use the aircraft\'s approved data and official meteorological information.');
    ({ atmosphere: fAtmos, airspeed: fAirspeed, isentropic: fIsen, normal: fNormal, oblique: fOblique, wing: fWing })[T.tab](T.body);
  }
  const isaT = (h, dT) => { const a = F().isa(h); const T = a.T + dT, rho = a.p / (F().Rair * T), mu = F().sutherland(T); return { T, p: a.p, rho, a: Math.sqrt(1.4 * F().Rair * T), mu, nu: mu / rho, Tisa: a.T }; };
  const densityAltitude = rho => { let lo = -2000, hi = 47000; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (F().isa(m).rho > rho) lo = m; else hi = m; } return (lo + hi) / 2; };
  function fAtmos(el) {
    const L = layout(el, 'The International Standard Atmosphere to 47 km (ICAO, ISO 2533), with a temperature deviation for hot and cold days. Pressure follows the standard; density and the speed of sound follow the actual temperature.' + link('isa') + link('density-altitude'));
    const pl = plotIn(L.plot, { x: { label: 'value relative to sea level' }, y: { label: 'altitude (km)', min: 0 }, legend: true }, 280);
    const read = form(L.form, [['h', 'Altitude', 3000, 'q', ['length', 'm']], ['dT', 'Temperature deviation from ISA', 0, 'q', ['dtemp', 'K']]], v => calc(v));
    function calc(v) {
      if (!Number.isFinite(v.h) || v.h < -2000 || v.h > 47000) { L.stats.innerHTML = '<p class="muted">Altitude from −2 km to 47 km.</p>'; return; }
      const s = isaT(v.h, v.dT || 0), s0 = F().isa(0);
      L.stats.innerHTML = stat('Temperature', inU(s.T, 'temperature', '°C', 4), inU(s.T, 'temperature', 'K', 5) + (v.dT ? ' (ISA ' + inU(s.Tisa, 'temperature', '°C', 4) + ')' : ''), 'big') +
        stat('Pressure', inU(s.p, 'pressure', 'hPa', 5), inU(s.p, 'pressure', 'inHg', 4) + ' · δ = ' + n3(s.p / s0.p)) +
        stat('Density', n3(s.rho, 4) + ' kg/m³', 'σ = ρ/ρ₀ = ' + n3(s.rho / s0.rho)) + stat('Speed of sound', inU(s.a, 'speed', 'm/s', 4), inU(s.a, 'speed', 'kt', 4)) +
        stat('Dynamic viscosity', n3(s.mu * 1e6, 4) + ' µPa·s', 'Sutherland') + stat('Kinematic viscosity', n3(s.nu * 1e6, 4) + ' mm²/s', '') +
        stat('Density altitude', inU(densityAltitude(s.rho), 'length', 'm', 4), inU(densityAltitude(s.rho), 'length', 'ft', 4) + ': the ISA height with this density');
      const T = [], P = [], R = [];
      for (let h = 0; h <= 47000; h += 500) { const q = isaT(h, v.dT || 0); T.push([q.T / 288.15, h / 1000]); P.push([q.p / PATM, h / 1000]); R.push([q.rho / 1.225, h / 1000]); }
      pl.set({ series: [{ pts: T, label: 'temperature T/T₀' }, { pts: P, label: 'pressure p/p₀' }, { pts: R, label: 'density ρ/ρ₀' }], hlines: [{ y: v.h / 1000, label: 'here' }, { y: 11, label: 'tropopause' }] });
    }
    calc(read());
  }
  function fAirspeed(el) {
    const L = layout(el, 'From the calibrated airspeed a pitot-static system measures, to the Mach number, true and equivalent airspeed at any height — with the full compressible (subsonic) relations, not Bernoulli\'s low-speed form.' + link('airspeeds') + link('pitot-tube'));
    const read = form(L.form, [['cas', 'Calibrated airspeed (CAS)', 250, 'q', ['speed', 'kt']], ['h', 'Pressure altitude', 10000, 'q', ['length', 'ft']], ['dT', 'Temperature deviation from ISA', 0, 'q', ['dtemp', 'K']]], v => calc(v));
    function calc(v) {
      const s0 = F().isa(0), s = isaT(v.h, v.dT || 0), a0 = s0.a;
      const qc = s0.p * (Math.pow(1 + 0.2 * Math.pow(v.cas / a0, 2), 3.5) - 1);          // impact pressure from CAS
      const M = Math.sqrt(5 * (Math.pow(qc / s.p + 1, 2 / 7) - 1)), tas = M * s.a, eas = tas * Math.sqrt(s.rho / s0.rho);
      if (!Number.isFinite(M)) return;
      L.stats.innerHTML = stat('True airspeed (TAS)', inU(tas, 'speed', 'kt', 4), inU(tas, 'speed', 'km/h', 4), 'big') + stat('Mach number', n3(M, 4), M >= 1 ? 'supersonic: these subsonic relations no longer hold' : M > 0.3 ? 'compressibility matters' : 'nearly incompressible', M >= 1 ? 'bad' : '') +
        stat('Equivalent airspeed (EAS)', inU(eas, 'speed', 'kt', 4), 'the speed at sea level with the same dynamic pressure') + stat('Impact pressure q_c', inU(qc, 'pressure', 'hPa', 4), 'what the pitot tube feels') +
        stat('Dynamic pressure ½ρV²', inU(0.5 * s.rho * tas * tas, 'pressure', 'hPa', 4), 'less than q_c at high Mach') + stat('Outside air', inU(s.T, 'temperature', '°C', 3) + ', ' + n3(s.rho, 4) + ' kg/m³', 'static pressure ' + inU(s.p, 'pressure', 'hPa', 5));
    }
    calc(read());
  }
  function fIsen(el) {
    const L = layout(el, 'Isentropic flow of a perfect gas: the stagnation ratios and the area ratio at a Mach number, or the two Mach numbers for an area ratio.' + link('isentropic-flow') + link('nozzles'));
    const pl = plotIn(L.plot, { x: { label: 'Mach number', min: 0, max: 4 }, y: { label: 'ratio', min: 0, max: 5 }, legend: true }, 260);
    const read = form(L.form, [['M', 'Mach number', 2, 'n'], ['g', 'Ratio of specific heats γ', 1.4, 'n'], ['AR', 'Or: area ratio A/A*', 2, 'n']], v => calc(v));
    function calc(v) {
      const r = F().isentropic(v.M, v.g), sub = F().machFromArea(v.AR, v.g, false), sup = F().machFromArea(v.AR, v.g, true);
      L.stats.innerHTML = stat('T₀/T', n3(r.T0T, 5), '', 'big') + stat('p₀/p', n3(r.p0p, 5), 'p/p₀ = ' + n3(1 / r.p0p, 5)) + stat('ρ₀/ρ', n3(r.rho0rho, 5)) + stat('A/A*', n3(r.AAstar, 5)) +
        stat('Mach angle μ', v.M >= 1 ? n3(r.mu / D2R, 4) + '°' : '—', 'asin(1/M)') + stat('A/A* = ' + n3(v.AR, 4) + ' gives', Number.isFinite(sub) ? 'M ' + n3(sub, 4) + ' or ' + n3(sup, 4) : '—', 'subsonic or supersonic');
      const a = [], b = [], c = [];
      for (let M = 0.05; M <= 4; M += 0.05) { const q = F().isentropic(M, v.g); a.push([M, 1 / q.p0p]); b.push([M, 1 / q.T0T]); c.push([M, q.AAstar]); }
      pl.set({ series: [{ pts: a, label: 'p/p₀' }, { pts: b, label: 'T/T₀' }, { pts: c, label: 'A/A*' }], vlines: [{ x: v.M }] });
    }
    calc(read());
  }
  function fNormal(el) {
    const L = layout(el, 'A normal shock in a perfect gas: everything behind it from the Mach number in front. Total temperature is unchanged; total pressure — and so the ability to do work — is lost.' + link('normal-shock'));
    const pl = plotIn(L.plot, { x: { label: 'upstream Mach number M₁', min: 1, max: 5 }, y: { label: 'ratio', min: 0 }, legend: true }, 260);
    const read = form(L.form, [['M', 'Upstream Mach number M₁', 2, 'n'], ['g', 'γ', 1.4, 'n']], v => calc(v));
    function calc(v) {
      if (!(v.M > 1)) { L.stats.innerHTML = '<p class="muted">A normal shock needs a supersonic upstream flow: M₁ > 1.</p>'; return; }
      const r = F().normalShock(v.M, v.g), g = v.g;
      const pitot = Math.pow((g + 1) * (g + 1) * v.M * v.M / (4 * g * v.M * v.M - 2 * (g - 1)), g / (g - 1)) * (1 - g + 2 * g * v.M * v.M) / (g + 1);   // Rayleigh: p₀₂/p₁
      L.stats.innerHTML = stat('Downstream Mach M₂', n3(r.M2, 5), '', 'big') + stat('p₂/p₁', n3(r.p2p1, 5)) + stat('T₂/T₁', n3(r.T2T1, 5)) + stat('ρ₂/ρ₁', n3(r.rho2rho1, 5)) +
        stat('Total-pressure ratio p₀₂/p₀₁', n3(r.p02p01, 5), n3((1 - r.p02p01) * 100, 3) + ' % lost', r.p02p01 < 0.7 ? 'bad' : '') + stat('Pitot reading p₀₂/p₁', n3(pitot, 5), 'Rayleigh pitot formula');
      const a = [], b = [], c = [];
      for (let M = 1.01; M <= 5; M += 0.04) { const q = F().normalShock(M, g); a.push([M, q.M2]); b.push([M, q.p02p01]); c.push([M, q.rho2rho1]); }
      pl.set({ series: [{ pts: a, label: 'M₂' }, { pts: b, label: 'p₀₂/p₀₁' }, { pts: c, label: 'ρ₂/ρ₁' }], vlines: [{ x: v.M }] });
    }
    calc(read());
  }
  function fOblique(el) {
    const L = layout(el, 'An oblique shock from a wedge or a turn of the flow by θ: the weak and strong solutions of the θ–β–M relation, and the largest turn before the shock detaches.' + link('oblique-shock'));
    const pl = plotIn(L.plot, { x: { label: 'wave angle β (°)', min: 0, max: 90 }, y: { label: 'deflection θ (°)', min: 0, max: 46 }, legend: true }, 280);
    const read = form(L.form, [['M', 'Upstream Mach number', 2.5, 'n'], ['th', 'Flow deflection θ', 12, 'n', '°'], ['g', 'γ', 1.4, 'n']], v => calc(v));
    function calc(v) {
      if (!(v.M > 1)) return;
      const r = F().obliqueShock(v.M, v.th * D2R, v.g);
      if (r.detached) L.stats.innerHTML = stat('Detached shock', 'θ > θ_max', 'the largest deflection at M ' + n3(v.M, 3) + ' is ' + n3(r.thetaMax / D2R, 4) + '°: a curved bow shock stands ahead of the body', 'bad');
      else L.stats.innerHTML = stat('Wave angle β (weak)', n3(r.beta / D2R, 4) + '°', 'strong solution ' + n3(r.strong.beta / D2R, 4) + '°', 'big') + stat('Downstream Mach M₂', n3(r.M2, 4), 'strong: ' + n3(r.strong.M2, 4)) +
        stat('p₂/p₁', n3(r.p2p1, 4), 'strong: ' + n3(r.strong.p2p1, 4)) + stat('T₂/T₁', n3(r.T2T1, 4)) + stat('p₀₂/p₀₁', n3(r.p02p01, 5)) + stat('θ_max at this Mach', n3(r.thetaMax / D2R, 4) + '°');
      const series = [];
      for (const M of [1.5, 2, 3, 5, v.M]) {
        const pts = [];
        for (let b = Math.asin(1 / M) + 1e-4; b < Math.PI / 2; b += 0.01) { const t = Math.atan(2 / Math.tan(b) * (M * M * Math.sin(b) ** 2 - 1) / (M * M * (v.g + Math.cos(2 * b)) + 2)); pts.push([b / D2R, Math.max(0, t / D2R)]); }
        series.push({ pts, label: 'M ' + U.fmt(M, 3), width: M === v.M ? 2.6 : 1.2, dash: M === v.M ? null : [4, 3] });
      }
      pl.set({ series, hlines: [{ y: v.th, label: 'θ' }], marks: r.detached ? [] : [{ x: r.beta / D2R, y: v.th, label: 'weak' }, { x: r.strong.beta / D2R, y: v.th, label: 'strong' }] });
    }
    calc(read());
  }
  function fWing(el) {
    const L = layout(el, 'Prandtl\'s lifting-line theory (Glauert\'s method) for a straight, tapered, twisted wing: the lift, the induced drag and how close the spanwise loading is to the elliptic ideal.' + link('lifting-line') + link('induced-drag'));
    const pl = plotIn(L.plot, { x: { label: 'spanwise position 2y/b', min: -1, max: 1 }, y: { label: 'local lift coefficient c_l', min: 0 }, legend: true }, 260);
    const read = form(L.form, [['AR', 'Aspect ratio', 8, 'n'], ['taper', 'Taper ratio (tip/root chord)', 0.45, 'n'], ['a', 'Angle of attack (root)', 5, 'n', '°'],
      ['tw', 'Twist at the tip (negative = washout)', 0, 'n', '°'], ['a0', 'Zero-lift angle of the section', -2, 'n', '°']], v => calc(v));
    function calc(v) {
      if (!(v.AR > 0.5) || !(v.taper >= 0)) return;
      const r = F().liftingLine({ AR: v.AR, taper: v.taper, alpha: v.a * D2R, alpha0: v.a0 * D2R, twist: v.tw * D2R, N: 24 });
      const slope = 2 * Math.PI / (1 + 2 / (v.AR * r.e));
      L.stats.innerHTML = stat('Wing lift coefficient C_L', n3(r.CL, 4), '', 'big') + stat('Induced drag C_D,i', n3(r.CDi, 4), 'C_L²/(π AR e)') + stat('Span efficiency e', n3(r.e, 4), r.e > 0.98 ? 'nearly elliptic' : '') +
        stat('Lift slope', n3(slope * D2R, 4) + ' per degree', 'a₀ = 2π per radian for the section') + stat('Induced drag as a share of lift', n3(r.CDi / r.CL * 100, 3) + ' %', 'D_i/L = C_L/(π AR e)');
      const ell = r.dist.map(d => [d.y * 2, r.CL * (4 / Math.PI) * Math.sqrt(Math.max(0, 1 - 4 * d.y * d.y)) / (1 - (1 - v.taper) * Math.abs(2 * d.y)) * (1 + v.taper) / 2]);
      pl.set({ series: [{ pts: r.dist.map(d => [d.y * 2, d.cl]), label: 'this wing' }, { pts: ell, label: 'elliptic loading on this planform', dash: [5, 4] }] });
    }
    calc(read());
  }

  /* ================================================================ HYDRAULICS: water */
  const HYDRO = [['pipe', 'Pipe friction'], ['pump', 'Pump & system'], ['channel', 'Open channel'], ['hammer', 'Water hammer']];
  function hydro(el, params, sub) {
    const T = subtabs(el, 'hydro', HYDRO, sub, 'Engineering estimates for learning; design to the applicable codes and the manufacturers\' data.');
    ({ pipe: hPipe, pump: hPump, channel: hChannel, hammer: hHammer })[T.tab](T.body);
  }
  const FLUIDS = [['w20', 'Water, 20 °C'], ['w60', 'Water, 60 °C'], ['w5', 'Water, 5 °C'], ['oil', 'Hydraulic oil ISO VG 46 at the temperature below'], ['air', 'Air, 20 °C, 1 bar']];
  function fluidProps(key, TC) {
    if (key === 'w60') return { rho: 983, nu: 0.474e-6 };
    if (key === 'w5') return { rho: 1000, nu: 1.52e-6 };
    if (key === 'oil') return { rho: 870, nu: F().oilViscosity(46, TC) };
    if (key === 'air') return { rho: 1.19, nu: 15.1e-6 };
    return { rho: 998, nu: 1.004e-6 };
  }
  const ROUGH = [['0.0015', 'Drawn tubing, PVC, glass (0.0015 mm)'], ['0.045', 'Commercial steel (0.045 mm)'], ['0.15', 'Galvanised steel (0.15 mm)'], ['0.26', 'Cast iron (0.26 mm)'], ['1', 'Old or rough concrete (1 mm)'], ['3', 'Very rough concrete, riveted steel (3 mm)']];
  function hPipe(el) {
    const L = layout(el, 'Darcy–Weisbach with the Colebrook friction factor (laminar 64/Re below Re 2300), plus minor losses as a sum of K values.' + link('darcy-weisbach') + link('friction-factor') + link('minor-losses'));
    const pl = plotIn(L.plot, { x: { label: 'Reynolds number', log: true, min: 500, max: 1e8 }, y: { label: 'friction factor f', log: true, min: 0.008, max: 0.1 }, legend: true }, 280);
    const read = form(L.form, [['Q', 'Flow', 10, 'q', ['flowrate', 'L/s']], ['D', 'Inner diameter', 100, 'q', ['length', 'mm']], ['L', 'Length', 200, 'q', ['length', 'm']],
      ['eps', 'Wall roughness', '0.045', 'sel', ROUGH], ['K', 'Sum of minor-loss coefficients ΣK', 3, 'n'], ['fl', 'Fluid', 'w20', 'sel', FLUIDS], ['T', 'Oil temperature', 50, 'n', '°C']], v => calc(v));
    function calc(v) {
      const fp = fluidProps(v.fl, v.T), A = Math.PI * v.D * v.D / 4, V = v.Q / A, Re = V * v.D / fp.nu, rr = (+v.eps / 1000) / v.D;
      const f = F().friction(Re, rr), hf = F().headLoss({ f, L: v.L, D: v.D, V }), hm = v.K * V * V / (2 * G0), dp = fp.rho * G0 * (hf + hm);
      const regime = Re < 2300 ? 'laminar' : Re < 4000 ? 'transitional' : 'turbulent';
      L.stats.innerHTML = stat('Mean velocity', inU(V, 'speed', 'm/s', 4), '', 'big') + stat('Reynolds number', n3(Re, 4), regime) + stat('Friction factor f', n3(f, 4), 'relative roughness ε/D = ' + n3(rr, 3)) +
        stat('Friction head loss', inU(hf, 'length', 'm', 4), n3(hf / v.L * 100, 3) + ' m per 100 m') + stat('Minor losses', inU(hm, 'length', 'm', 4), 'ΣK × V²/2g') +
        stat('Total pressure drop', inU(dp, 'pressure', 'bar', 4), inU(dp, 'pressure', 'kPa', 4), 'big') + stat('Power lost', inU(dp * v.Q, 'power', 'kW', 4), 'Δp × Q');
      const curves = [];
      for (const r of [0, 1e-4, 1e-3, 5e-3, 0.02, 0.05]) { const pts = []; for (let e = 3.4; e <= 8; e += 0.05) { const R = Math.pow(10, e); pts.push([R, F().colebrook(R, r)]); } curves.push({ pts, label: 'ε/D = ' + r, dash: [4, 3], width: 1 }); }
      const lam = []; for (let e = 2.7; e <= 3.5; e += 0.05) { const R = Math.pow(10, e); lam.push([R, 64 / R]); }
      pl.set({ series: [{ pts: lam, label: 'laminar 64/Re', width: 1.5 }].concat(curves), marks: [{ x: Re, y: f, label: 'this pipe' }] });
    }
    calc(read());
  }
  function hPump(el) {
    const L = layout(el, 'A centrifugal pump described by its shut-off head and its flow at zero head, meeting a system of static head plus friction that grows with the square of the flow. The speed slider applies the affinity laws.' + link('operating-point') + link('affinity-laws'));
    const pl = plotIn(L.plot, { x: { label: 'flow (m³/h)', min: 0 }, y: { label: 'head (m)', min: 0 }, legend: true }, 290);
    const read = form(L.form, [['H0', 'Shut-off head at 100 % speed', 40, 'q', ['length', 'm']], ['Qmax', 'Flow at zero head', 120, 'q', ['flowrate', 'm³/h']], ['eta', 'Best efficiency', 78, 'n', '%'],
      ['Hs', 'System static head', 15, 'q', ['length', 'm']], ['Hf', 'System friction head at 60 m³/h', 12, 'q', ['length', 'm']], ['n', 'Pump speed', 100, 'n', '% of rated'], ['rho', 'Liquid density', 998, 'q', ['density', 'kg/m³']]], v => calc(v));
    function calc(v) {
      const r = v.n / 100, H0 = v.H0 * r * r, Qm = v.Qmax * r, kS = v.Hf / Math.pow(60 / 3600, 2);
      const pumpH = q => H0 * (1 - Math.pow(q / Qm, 2)), sysH = q => v.Hs + kS * q * q;
      const Qbep = 0.6 * Qm, eta = q => Math.max(0.05, v.eta / 100 * (1 - Math.pow((q - Qbep) / Qbep, 2)));
      if (sysH(0) >= pumpH(0)) { L.stats.innerHTML = stat('No flow', 'static head ≥ shut-off head', 'the pump cannot lift the liquid this high at this speed', 'bad'); pl.set({ series: [] }); return; }
      const op = F().operatingPoint(pumpH, sysH, Qm), P = v.rho * G0 * op.Q * op.H / eta(op.Q);
      L.stats.innerHTML = stat('Flow', inU(op.Q, 'flowrate', 'm³/h', 4), inU(op.Q, 'flowrate', 'L/s', 4), 'big') + stat('Head', inU(op.H, 'length', 'm', 4), inU(v.rho * G0 * op.H, 'pressure', 'bar', 3)) +
        stat('Efficiency', n3(eta(op.Q) * 100, 3) + ' %', op.Q < 0.8 * Qbep ? 'left of best efficiency' : op.Q > 1.2 * Qbep ? 'right of best efficiency' : 'near best efficiency') +
        stat('Shaft power', inU(P, 'power', 'kW', 4), 'ρgQH/η') + stat('Hydraulic power', inU(v.rho * G0 * op.Q * op.H, 'power', 'kW', 4)) + stat('Energy per m³', n3(P / op.Q / 3.6e6 * 1000, 4) + ' Wh/m³');
      const pc = [], sc = [], ec = [], rated = [];
      for (let i = 0; i <= 60; i++) { const q = v.Qmax * 1.05 * i / 60; if (q <= Qm) pc.push([q * 3600, pumpH(q)]); sc.push([q * 3600, sysH(q)]); if (q <= Qm) ec.push([q * 3600, eta(q) * 100 * H0 / 100]); rated.push([q * 3600, Math.max(0, v.H0 * (1 - Math.pow(q / v.Qmax, 2)))]); }
      pl.set({ series: [{ pts: pc, label: 'pump at ' + v.n + ' %', width: 2.4 }, { pts: sc, label: 'system' }, { pts: ec, label: 'efficiency (scaled)', dash: [3, 3] }].concat(r !== 1 ? [{ pts: rated, label: 'pump at 100 %', dash: [6, 4], width: 1 }] : []),
        marks: [{ x: op.Q * 3600, y: op.H, label: 'operating point' }] });
    }
    calc(read());
  }
  function hChannel(el) {
    const L = layout(el, 'Uniform flow in a rectangular or trapezoidal channel by Manning\'s equation, the critical depth, the Froude number and the specific-energy curve.' + link('manning-equation') + link('specific-energy'));
    const pl = plotIn(L.plot, { x: { label: 'specific energy E (m)', min: 0 }, y: { label: 'depth y (m)', min: 0 }, legend: true }, 280);
    const read = form(L.form, [['Q', 'Flow', 5, 'q', ['flowrate', 'm³/s']], ['b', 'Bottom width', 3, 'q', ['length', 'm']], ['z', 'Side slope (horizontal per vertical; 0 = rectangular)', 1.5, 'n'],
      ['n', 'Manning n', 0.025, 'n', 's/m^⅓'], ['S', 'Bed slope', 0.001, 'n', 'm/m']], v => calc(v));
    function calc(v) {
      const o = { Q: v.Q, b: v.b, z: v.z, n: v.n, S: v.S };
      const yn = F().normalDepth(o), yc = F().criticalDepth(o), sec = F().section(yn, v.b, v.z), V = v.Q / sec.A, Fr = F().froude(V, sec.A / sec.T);
      L.stats.innerHTML = stat('Normal depth', inU(yn, 'length', 'm', 4), '', 'big') + stat('Critical depth', inU(yc, 'length', 'm', 4), yn > yc ? 'normal > critical: a mild slope' : 'normal < critical: a steep slope') +
        stat('Velocity', inU(V, 'speed', 'm/s', 4)) + stat('Froude number', n3(Fr, 3), Fr < 1 ? 'subcritical (tranquil)' : 'supercritical (rapid)', Fr > 1 ? 'bad' : 'good') +
        stat('Hydraulic radius', inU(sec.R, 'length', 'm', 4)) + stat('Top width', inU(sec.T, 'length', 'm', 4));
      const E = [];
      for (let i = 1; i <= 80; i++) { const y = yc * (0.25 + i * 0.05); const s = F().section(y, v.b, v.z); E.push([y + v.Q * v.Q / (2 * G0 * s.A * s.A), y]); }
      const En = yn + v.Q * v.Q / (2 * G0 * sec.A * sec.A);
      pl.set({ series: [{ pts: E, label: 'specific energy' }, { pts: [[0, 0], [E[E.length - 1][1], E[E.length - 1][1]]], label: 'E = y', dash: [4, 3], width: 1 }], hlines: [{ y: yc, label: 'critical' }], marks: [{ x: En, y: yn, label: 'normal flow' }] });
    }
    calc(read());
  }
  const PIPEMAT = [['200e9', 'Steel (E 200 GPa)'], ['100e9', 'Ductile / cast iron (E 100–170 GPa)'], ['70e9', 'Aluminium (E 70 GPa)'], ['3e9', 'PVC (E 3 GPa)'], ['0.9e9', 'Polyethylene (E 0.9 GPa)']];
  function hHammer(el) {
    const L = layout(el, 'The pressure surge when flow is stopped: the wave speed in the pipe, the Joukowsky rise for a closure faster than the pipe period 2L/a, and Michaud\'s estimate for slower closures.' + link('water-hammer') + link('joukowsky-surge'));
    const pl = plotIn(L.plot, { x: { label: 'closure time (s)', min: 0 }, y: { label: 'pressure rise (bar)', min: 0 }, legend: true }, 260);
    const read = form(L.form, [['D', 'Pipe inner diameter', 200, 'q', ['length', 'mm']], ['e', 'Wall thickness', 6, 'q', ['length', 'mm']], ['E', 'Pipe material', '200e9', 'sel', PIPEMAT],
      ['K', 'Bulk modulus of the liquid', 2.2, 'q', ['stress', 'GPa']], ['rho', 'Density', 1000, 'q', ['density', 'kg/m³']], ['L', 'Pipe length', 800, 'q', ['length', 'm']],
      ['dv', 'Velocity stopped', 1.5, 'q', ['speed', 'm/s']], ['tc', 'Valve closure time', 0.5, 'q', ['time', 's']]], v => calc(v));
    function calc(v) {
      const a = F().waveSpeed({ K: v.K, rho: v.rho, D: v.D, e: v.e, E: +v.E }), T2 = 2 * v.L / a, dpJ = F().joukowsky(v.rho, a, v.dv);
      const dp = v.tc <= T2 ? dpJ : 2 * v.rho * v.L * v.dv / v.tc;
      L.stats.innerHTML = stat('Wave speed a', inU(a, 'speed', 'm/s', 4), 'rigid pipe: ' + inU(Math.sqrt(v.K / v.rho), 'speed', 'm/s', 4)) + stat('Pipe period 2L/a', inU(T2, 'time', 's', 3)) +
        stat('Joukowsky surge ρaΔv', inU(dpJ, 'pressure', 'bar', 4), 'an instantaneous closure', 'bad') + stat('Surge for this closure', inU(dp, 'pressure', 'bar', 4), v.tc <= T2 ? 'closure faster than 2L/a: the full Joukowsky rise' : 'slow closure: Michaud 2ρLΔv/t_c', 'big') +
        stat('As head', inU(dp / (v.rho * G0), 'length', 'm', 4));
      const pts = []; for (let i = 1; i <= 80; i++) { const t = T2 * 6 * i / 80; pts.push([t, (t <= T2 ? dpJ : 2 * v.rho * v.L * v.dv / t) / 1e5]); }
      pl.set({ series: [{ pts, label: 'surge against closure time' }], vlines: [{ x: T2, label: '2L/a' }], marks: [{ x: v.tc, y: dp / 1e5, label: 'this valve' }] });
    }
    calc(read());
  }

  /* ================================================================ HYDRAULICS: fluid power */
  const FPOWER = [['cylinder', 'Cylinder'], ['pump', 'Pump'], ['motor', 'Motor'], ['orifice', 'Orifice'], ['accumulator', 'Accumulator'], ['oil', 'Oil viscosity']];
  function fpower(el, params, sub) {
    const T = subtabs(el, 'fpower', FPOWER, sub, 'Theoretical values with the efficiencies you enter; real components follow their manufacturers\' data. Stored energy: release pressure and support loads before any work on a system.');
    ({ cylinder: pCyl, pump: pPump, motor: pMotor, orifice: pOrifice, accumulator: pAcc, oil: pOil })[T.tab](T.body);
  }
  const MOUNT = [['2', 'Pinned both ends (Euler case 2, L_k = L)'], ['1', 'Fixed, free end (case 1, L_k = 2L)'], ['0.7', 'Fixed, pinned (case 3, L_k = 0.7L)'], ['0.5', 'Fixed both ends (case 4, L_k = 0.5L)']];
  function pCyl(el) {
    const L = layout(el, 'A double-acting cylinder: areas, forces and speeds both ways, the flow that returns, the regenerative option — and a buckling check of the rod as an Euler column.' + link('hydraulic-cylinder') + link('rod-buckling'));
    const read = form(L.form, [['D', 'Bore', 63, 'q', ['length', 'mm']], ['d', 'Rod', 36, 'q', ['length', 'mm']], ['p', 'Pressure (gauge)', 160, 'q', ['pressure', 'bar']], ['Q', 'Pump flow', 22, 'q', ['flowrate', 'L/min']],
      ['s', 'Stroke', 400, 'q', ['length', 'mm']], ['eta', 'Mechanical efficiency', 95, 'n', '%'], ['s1', 'Buckling', 0, 'sep'], ['Lb', 'Buckling length (fully extended)', 900, 'q', ['length', 'mm']], ['mt', 'Mounting', '2', 'sel', MOUNT], ['sf', 'Safety factor', 3.5, 'n']], v => calc(v));
    function calc(v) {
      const A1 = Math.PI * v.D * v.D / 4, Ar = Math.PI * v.d * v.d / 4, A2 = A1 - Ar, e = v.eta / 100;
      if (!(A2 > 0)) { L.stats.innerHTML = '<p class="muted">The rod must be thinner than the bore.</p>'; return; }
      const Lk = +v.mt === 2 ? v.Lb : +v.mt * v.Lb, I = Math.PI * Math.pow(v.d, 4) / 64, Fk = Math.PI * Math.PI * 210e9 * I / (Lk * Lk), Fmax = v.p * A1 * e;
      L.stats.innerHTML = stat('Push (extend)', inU(v.p * A1 * e, 'force', 'kN', 4), 'on A₁ = ' + inU(A1, 'area', 'cm²', 4), 'big') + stat('Pull (retract)', inU(v.p * A2 * e, 'force', 'kN', 4), 'on A₂ = ' + inU(A2, 'area', 'cm²', 4)) +
        stat('Extend speed', inU(v.Q / A1, 'speed', 'mm/s', 4), 'stroke time ' + n3(v.s / (v.Q / A1), 3) + ' s') + stat('Retract speed', inU(v.Q / A2, 'speed', 'mm/s', 4), 'stroke time ' + n3(v.s / (v.Q / A2), 3) + ' s') +
        stat('Area ratio φ', n3(A1 / A2, 4), 'returning from the cap end: ' + inU(v.Q * A1 / A2, 'flowrate', 'L/min', 4)) + stat('Regenerative extend', inU(v.Q / Ar, 'speed', 'mm/s', 4), 'with force ' + inU(v.p * Ar * e, 'force', 'kN', 4)) +
        stat('Hydraulic power', inU(v.p * v.Q, 'power', 'kW', 4)) +
        stat('Euler buckling load', inU(Fk, 'force', 'kN', 4), 'steel rod, L_k = ' + inU(Lk, 'length', 'mm', 4) + '; allowed ' + inU(Fk / v.sf, 'force', 'kN', 4), Fmax > Fk / v.sf ? 'bad' : 'good');
    }
    calc(read());
  }
  function pPump(el) {
    const L = layout(el, 'A positive-displacement pump: the flow it delivers at a speed, the torque and power it needs at a pressure, and the heat its losses make.' + link('displacement-flow') + link('pump-efficiencies'));
    const read = form(L.form, [['Vg', 'Displacement', 16, 'q', ['displacement', 'cm³/rev']], ['n', 'Speed', 1450, 'q', ['frequency', 'rpm']], ['p', 'Pressure rise', 160, 'q', ['pressure', 'bar']],
      ['ev', 'Volumetric efficiency', 95, 'n', '%'], ['ehm', 'Hydraulic-mechanical efficiency', 90, 'n', '%']], v => calc(v));
    function calc(v) {
      const Q = v.Vg * v.n * v.ev / 100, T = v.Vg * v.p / (2 * Math.PI * v.ehm / 100), Pin = T * 2 * Math.PI * v.n, Ph = v.p * Q;
      L.stats.innerHTML = stat('Flow delivered', inU(Q, 'flowrate', 'L/min', 4), 'theoretical ' + inU(v.Vg * v.n, 'flowrate', 'L/min', 4), 'big') + stat('Drive torque', inU(T, 'torque', 'N·m', 4)) +
        stat('Input power', inU(Pin, 'power', 'kW', 4), 'overall efficiency ' + n3(Ph / Pin * 100, 3) + ' %') + stat('Hydraulic power', inU(Ph, 'power', 'kW', 4)) + stat('Heat from the pump', inU(Pin - Ph, 'power', 'kW', 4));
    }
    calc(read());
  }
  function pMotor(el) {
    const L = layout(el, 'A hydraulic motor: the speed a flow gives it, the torque a pressure difference gives it, and its output power.' + link('motor-torque-speed'));
    const read = form(L.form, [['Vg', 'Displacement', 50, 'q', ['displacement', 'cm³/rev']], ['Q', 'Flow', 60, 'q', ['flowrate', 'L/min']], ['dp', 'Pressure difference', 200, 'q', ['pressure', 'bar']],
      ['ev', 'Volumetric efficiency', 95, 'n', '%'], ['ehm', 'Hydraulic-mechanical efficiency', 92, 'n', '%']], v => calc(v));
    function calc(v) {
      const n = v.Q * v.ev / 100 / v.Vg, T = v.Vg * v.dp * v.ehm / 100 / (2 * Math.PI), P = T * 2 * Math.PI * n;
      L.stats.innerHTML = stat('Speed', inU(n, 'frequency', 'rpm', 4), '', 'big') + stat('Torque', inU(T, 'torque', 'N·m', 4), 'theoretical ' + inU(v.Vg * v.dp / (2 * Math.PI), 'torque', 'N·m', 4)) +
        stat('Output power', inU(P, 'power', 'kW', 4)) + stat('Input power p·Q', inU(v.dp * v.Q, 'power', 'kW', 4), 'overall efficiency ' + n3(P / (v.dp * v.Q) * 100, 3) + ' %');
    }
    calc(read());
  }
  function pOrifice(el) {
    const L = layout(el, 'Flow through a sharp-edged orifice, Q = C_d A √(2Δp/ρ): the law behind every throttle, valve land and nozzle.' + link('orifice-equation'));
    const pl = plotIn(L.plot, { x: { label: 'pressure drop (bar)', min: 0 }, y: { label: 'flow (L/min)', min: 0 } }, 240);
    const read = form(L.form, [['d', 'Orifice diameter', 2, 'q', ['length', 'mm']], ['dp', 'Pressure drop', 20, 'q', ['pressure', 'bar']], ['cd', 'Discharge coefficient C_d', 0.62, 'n'],
      ['rho', 'Density', 870, 'q', ['density', 'kg/m³']], ['Qt', 'For a target flow of', 10, 'q', ['flowrate', 'L/min']]], v => calc(v));
    function calc(v) {
      const A = Math.PI * v.d * v.d / 4, Q = F().orifice(v.cd, A, v.dp, v.rho), dNeed = Math.sqrt(4 / Math.PI * v.Qt / (v.cd * Math.sqrt(2 * v.dp / v.rho)));
      L.stats.innerHTML = stat('Flow', inU(Q, 'flowrate', 'L/min', 4), 'jet speed ' + inU(Math.sqrt(2 * v.dp / v.rho), 'speed', 'm/s', 4), 'big') + stat('Heat made', inU(Q * v.dp, 'power', 'kW', 4), 'all of Δp·Q') +
        stat('Diameter for the target flow', inU(dNeed, 'length', 'mm', 4), 'at the same pressure drop');
      const pts = []; for (let i = 0; i <= 50; i++) { const d = v.dp * 2 * i / 50; pts.push([d / 1e5, F().orifice(v.cd, A, d, v.rho) * 60000]); }
      pl.set({ series: [{ pts, label: 'Q ∝ √Δp' }], marks: [{ x: v.dp / 1e5, y: Q * 60000, label: 'here' }] });
    }
    calc(read());
  }
  function pAcc(el) {
    const L = layout(el, 'Sizing a gas-charged accumulator from the oil volume it must deliver between two pressures: isothermal for slow cycles, adiabatic (n = 1.4) for discharges of a few seconds. Pressures here are absolute.' + link('accumulator-sizing'));
    const pl = plotIn(L.plot, { x: { label: 'gas volume (L)', min: 0 }, y: { label: 'pressure (bar, absolute)', min: 0 }, legend: true }, 260);
    const read = form(L.form, [['dV', 'Oil volume to deliver', 2, 'q', ['volume', 'L']], ['p2', 'Maximum pressure (absolute)', 200, 'q', ['pressure', 'bar']], ['p1', 'Minimum pressure (absolute)', 120, 'q', ['pressure', 'bar']],
      ['p0', 'Pre-charge (absolute; ≈ 0.9 × minimum)', 108, 'q', ['pressure', 'bar']]], v => calc(v));
    function calc(v) {
      if (!(v.p0 < v.p1 && v.p1 < v.p2)) { L.stats.innerHTML = '<p class="muted">Needs pre-charge < minimum < maximum pressure.</p>'; return; }
      const size = n => v.dV / (Math.pow(v.p0 / v.p1, 1 / n) - Math.pow(v.p0 / v.p2, 1 / n));
      const Vi = size(1), Va = size(1.4);
      L.stats.innerHTML = stat('Size, isothermal', inU(Vi, 'volume', 'L', 4), 'slow charge and discharge', 'big') + stat('Size, adiabatic', inU(Va, 'volume', 'L', 4), 'fast discharge (n = 1.4)', 'big') +
        stat('Pressure ratio p₂/p₁', n3(v.p2 / v.p1, 3), 'bladder types usually ≤ 4');
      const iso = [], adi = [];
      for (let i = 0; i <= 60; i++) { const p = v.p0 + (v.p2 - v.p0) * i / 60; iso.push([Vi * v.p0 / p * 1000, p / 1e5]); adi.push([Va * Math.pow(v.p0 / p, 1 / 1.4) * 1000, p / 1e5]); }
      pl.set({ series: [{ pts: iso, label: 'isothermal accumulator' }, { pts: adi, label: 'adiabatic accumulator', dash: [5, 4] }], hlines: [{ y: v.p1 / 1e5, label: 'p₁' }, { y: v.p2 / 1e5, label: 'p₂' }] });
    }
    calc(read());
  }
  function pOil(el) {
    const L = layout(el, 'Viscosity of mineral hydraulic oils against temperature (ASTM D341 / Walther), from the ISO VG grade — the viscosity at 40 °C in mm²/s — for oils of viscosity index about 100.' + link('viscosity-temperature') + link('hydraulic-oils'));
    const pl = plotIn(L.plot, { x: { label: 'temperature (°C)', min: -20, max: 110 }, y: { label: 'kinematic viscosity (mm²/s)', log: true, min: 3, max: 3000 }, legend: true }, 300);
    const read = form(L.form, [['vg', 'ISO VG grade', '46', 'sel', ['15', '22', '32', '46', '68', '100', '150'].map(g => [g, 'ISO VG ' + g])], ['T', 'Temperature', 50, 'n', '°C'],
      ['lo', 'Pump window: lowest', 16, 'n', 'mm²/s'], ['hi', 'Pump window: highest', 36, 'n', 'mm²/s']], v => calc(v));
    function calc(v) {
      const g = +v.vg, nu = F().oilViscosity(g, v.T);
      const Tat = target => { let lo = -40, hi = 150; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (F().oilViscosity(g, m) * 1e6 > target) lo = m; else hi = m; } return (lo + hi) / 2; };
      L.stats.innerHTML = stat('Kinematic viscosity', n3(nu * 1e6, 4) + ' mm²/s', 'cSt', 'big') + stat('Dynamic viscosity', n3(nu * 870 * 1000, 4) + ' mPa·s', 'at 870 kg/m³') +
        stat('Temperature window', n3(Tat(v.hi), 3) + ' – ' + n3(Tat(v.lo), 3) + ' °C', 'where this oil stays between ' + v.lo + ' and ' + v.hi + ' mm²/s');
      const series = ['22', '32', '46', '68', '100'].map(k => { const pts = []; for (let T = -20; T <= 110; T += 2) pts.push([T, F().oilViscosity(+k, T) * 1e6]); return { pts, label: 'VG ' + k, width: k === v.vg ? 2.6 : 1.1, dash: k === v.vg ? null : [4, 3] }; });
      pl.set({ series, hlines: [{ y: v.lo, label: 'window' }, { y: v.hi }], marks: [{ x: v.T, y: nu * 1e6, label: 'here' }] });
    }
    calc(read());
  }

  /* ================================================================ PNEUMATICS */
  const PNEU = [['cylinder', 'Cylinder & air'], ['valve', 'Valve flow'], ['air', 'Water in the air'], ['leak', 'Leaks'], ['vacuum', 'Vacuum cups'], ['receiver', 'Receiver']];
  function pneu(el, params, sub) {
    const T = subtabs(el, 'pneu', PNEU, sub, 'For learning and first estimates. Pressures called gauge are above the atmosphere; absolute ones count from vacuum. Never point compressed air at a person.');
    ({ cylinder: nCyl, valve: nValve, air: nAir, leak: nLeak, vacuum: nVac, receiver: nRec })[T.tab](T.body);
  }
  const BORES = [[16, 6], [20, 8], [25, 10], [32, 12], [40, 16], [50, 20], [63, 20], [80, 25], [100, 25], [125, 32]];
  function nCyl(el) {
    const L = layout(el, 'A double-acting cylinder: its forces at the supply pressure, the free air it uses per cycle (both strokes and the tubes) and per minute, and what that costs.' + link('air-consumption') + link('cylinder-force'));
    const read = form(L.form, [['bore', 'Cylinder', '32', 'sel', BORES.map(([b, r]) => [String(b), b + ' mm bore, ' + r + ' mm rod'])], ['s', 'Stroke', 100, 'q', ['length', 'mm']], ['p', 'Supply pressure (gauge)', 6, 'q', ['pressure', 'bar']],
      ['n', 'Cycles per minute', 30, 'n'], ['lr', 'Load ratio', 70, 'n', '%'], ['tl', 'Tube length valve–cylinder (each)', 1, 'q', ['length', 'm']], ['td', 'Tube bore', 4, 'q', ['length', 'mm']],
      ['s1', 'Cost', 0, 'sep'], ['h', 'Hours per year', 4000, 'n', 'h'], ['price', 'Electricity price', 0.15, 'n', H.units.currency + '/kWh'], ['sp', 'Compressor specific power', 6.5, 'n', 'kW per m³/min']], v => calc(v));
    function calc(v) {
      const [b, r] = BORES.find(x => String(x[0]) === v.bore), D = b / 1000, d = r / 1000, A1 = Math.PI * D * D / 4, A2 = A1 - Math.PI * d * d / 4, k = (v.p + PATM) / PATM;
      const Vt = Math.PI * v.td * v.td / 4 * v.tl, cyc = (A1 + A2) * v.s * k + 2 * Vt * k, q = cyc * v.n / 60, kwh = q * 60 * v.sp * v.h;
      L.stats.innerHTML = stat('Push / pull', inU(v.p * A1, 'force', 'N', 4) + ' / ' + inU(v.p * A2, 'force', 'N', 4), 'usable load at ' + v.lr + ' %: ' + inU(v.p * A1 * v.lr / 100, 'force', 'N', 4), 'big') +
        stat('Free air per cycle', inU(cyc, 'volume', 'L', 4), 'of which tubes ' + inU(2 * Vt * k, 'volume', 'L', 3)) + stat('Average flow', inU(q, 'airflow', 'L/min ANR', 4), inU(q, 'airflow', 'SCFM', 3)) +
        stat('Energy per year', n3(kwh, 4) + ' kWh') + stat('Cost per year', U.money(kwh * v.price, 0), 'at the prices entered', 'big');
    }
    calc(read());
  }
  function nValve(el) {
    const L = layout(el, 'Flow through a valve by ISO 6358: sonic conductance C and critical pressure ratio b. Below p₂/p₁ = b the flow is choked and depends only on the upstream pressure. Rough equivalents: C ≈ 4 Cv (dm³/(s·bar)), Kv ≈ 0.865 Cv.' + link('sonic-conductance') + link('flow-coefficients'));
    const pl = plotIn(L.plot, { x: { label: 'downstream pressure p₂ (bar gauge)', min: 0 }, y: { label: 'flow (L/min ANR)', min: 0 } }, 250);
    const read = form(L.form, [['C', 'Sonic conductance C', 1.2, 'q', ['flowcond', 'dm³/(s·bar)']], ['b', 'Critical pressure ratio b', 0.3, 'n'], ['p1', 'Upstream pressure (gauge)', 6, 'q', ['pressure', 'bar']],
      ['p2', 'Downstream pressure (gauge)', 5, 'q', ['pressure', 'bar']], ['T', 'Upstream temperature', 20, 'n', '°C']], v => calc(v));
    function calc(v) {
      const p1 = v.p1 + PATM, p2 = v.p2 + PATM, T1 = v.T + 273.15, r = F().iso6358({ C: v.C, b: v.b, p1, p2, T1 });
      const Cv = v.C / 1e-8 / 4;
      L.stats.innerHTML = stat('Flow', inU(r.qANR, 'airflow', 'L/min ANR', 4), inU(r.qANR, 'airflow', 'SCFM', 3), 'big') + stat('Pressure ratio p₂/p₁', n3(p2 / p1, 3), r.choked ? 'choked: sonic at the throat' : 'subsonic') +
        stat('Mass flow', inU(r.mdot, 'massflow', 'g/s', 4)) + stat('Nominal flow Q_n', inU(F().iso6358({ C: v.C, b: v.b, p1: 7e5 + 1325, p2: 6e5 + 1325 }).qANR, 'airflow', 'L/min ANR', 4), '6 bar in, 1 bar drop') +
        stat('Roughly', 'Cv ≈ ' + n3(Cv, 3) + ', Kv ≈ ' + n3(Cv * 0.865, 3), 'approximate conversions');
      const pts = []; for (let i = 0; i <= 60; i++) { const q = p1 * i / 60; pts.push([(q - PATM) / 1e5, F().iso6358({ C: v.C, b: v.b, p1, p2: Math.max(q, 1), T1 }).qANR * 60000]); }
      pl.set({ series: [{ pts: pts.filter(q => q[0] >= -1), label: 'flow against downstream pressure' }], vlines: [{ x: (v.b * p1 - PATM) / 1e5, label: 'p₂ = b·p₁' }], marks: [{ x: v.p2 / 1e5, y: r.qANR * 60000, label: 'here' }] });
    }
    calc(read());
  }
  function nAir(el) {
    const L = layout(el, 'Where the water in compressed air comes from: the vapour in the air drawn in is squeezed into a smaller volume and condenses when the air cools back down. The pressure dew point is the temperature at which the compressed air starts to condense.' + link('pressure-dew-point') + link('condensate'));
    const read = form(L.form, [['T', 'Intake air temperature', 25, 'n', '°C'], ['RH', 'Intake relative humidity', 60, 'n', '%'], ['p', 'Line pressure (gauge)', 7, 'q', ['pressure', 'bar']],
      ['Tc', 'Air cooled after compression to', 35, 'n', '°C'], ['fad', 'Compressor free air delivery', 10, 'q', ['airflow', 'm³/min ANR']], ['h', 'Running hours per day', 16, 'n', 'h']], v => calc(v));
    function calc(v) {
      const Rv = 461.5, rh = v.RH / 100, p1 = PATM, p2 = v.p + PATM;
      const win = rh * F().magnus(v.T) / (Rv * (v.T + 273.15));                         // kg water per m³ of intake air
      const vol = p1 / p2 * (v.Tc + 273.15) / (v.T + 273.15);                            // that m³ after compression and cooling
      const cap = F().magnus(v.Tc) / (Rv * (v.Tc + 273.15)) * vol;                        // water it can still hold
      const cond = Math.max(0, win - cap), pdp = F().pressureDewPoint(v.T, rh, p1, p2).pdp;
      L.stats.innerHTML = stat('Atmospheric dew point', n3(F().dewPoint(v.T, rh), 3) + ' °C', 'of the intake air') + stat('Pressure dew point after compression', n3(pdp, 3) + ' °C', pdp > v.Tc ? 'above the cooled temperature: water condenses' : 'below it: the air stays dry', pdp > v.Tc ? 'bad' : 'good') +
        stat('Water in the intake air', n3(win * 1000, 3) + ' g/m³') + stat('Condensed after cooling', n3(cond * 1000, 3) + ' g per m³ of free air', '', 'big') +
        stat('Condensate per day', n3(cond * v.fad * 3600 * v.h, 4) + ' L', 'for the compressor entered (free air delivery × hours)', 'big');
    }
    calc(read());
  }
  function nLeak(el) {
    const L = layout(el, 'A leak is a small orifice running all the time. The flow through a sharp hole is choked at workshop pressures, so it grows in proportion to the absolute pressure and the hole\'s area.' + link('air-leaks') + link('leak-management'));
    const read = form(L.form, [['d', 'Hole diameter', 3, 'q', ['length', 'mm']], ['nh', 'Number of such leaks', 1, 'n'], ['p', 'Line pressure (gauge)', 6, 'q', ['pressure', 'bar']],
      ['h', 'Hours pressurised per year', 8760, 'n', 'h'], ['price', 'Electricity price', 0.15, 'n', H.units.currency + '/kWh'], ['sp', 'Compressor specific power', 6.5, 'n', 'kW per m³/min']], v => calc(v));
    function calc(v) {
      const A = Math.PI * v.d * v.d / 4, md = 0.0404 * 0.65 * A * (v.p + PATM) / Math.sqrt(293.15), q = md / 1.185 * v.nh, kw = q * 60 * v.sp;
      L.stats.innerHTML = stat('Air lost', inU(q, 'airflow', 'L/min ANR', 4), inU(q, 'airflow', 'SCFM', 3), 'big') + stat('Compressor power it takes', n3(kw, 3) + ' kW') +
        stat('Energy per year', n3(kw * v.h, 4) + ' kWh') + stat('Cost per year', U.money(kw * v.h * v.price, 0), '', 'big');
    }
    calc(read());
  }
  function nVac(el) {
    const L = layout(el, 'A suction cup is pressed on by the atmosphere: its force is the pressure difference times the cup\'s area. Lifting horizontally the cups carry the weight and the acceleration; holding a vertical face they rely on friction.' + link('holding-force') + link('suction-cups'));
    const read = form(L.form, [['dc', 'Cup diameter', 40, 'q', ['length', 'mm']], ['n', 'Number of cups', 4, 'n'], ['vac', 'Vacuum (below atmosphere)', 60, 'q', ['pressure', 'kPa']],
      ['case', 'Load case', 'h', 'sel', [['h', 'Horizontal part, lifted vertically'], ['v', 'Vertical face, held by friction']]], ['mu', 'Friction coefficient (vertical case)', 0.5, 'n'],
      ['a', 'Acceleration of the handling system', 5, 'q', ['accel', 'm/s²']], ['sf', 'Safety factor', 2, 'n']], v => calc(v));
    function calc(v) {
      const A = Math.PI * v.dc * v.dc / 4, Fc = v.vac * A, Ft = Fc * v.n;
      const m = v.case === 'h' ? Ft / (v.sf * (G0 + v.a)) : v.mu * Ft / (v.sf * (G0 + v.a));
      L.stats.innerHTML = stat('Force per cup', inU(Fc, 'force', 'N', 4), 'theoretical, a perfect seal') + stat('All cups', inU(Ft, 'force', 'N', 4)) +
        stat('Largest mass to handle', inU(m, 'mass', 'kg', 4), 'with the safety factor and acceleration', 'big') + stat('Vacuum as a share of the atmosphere', n3(v.vac / PATM * 100, 3) + ' %', 'no cup can exceed about 10 N/cm²');
    }
    calc(read());
  }
  function nRec(el) {
    const L = layout(el, 'Two ways a receiver gets its size: to supply a peak demand above the compressor\'s output for a time, within an allowed pressure fall; and to keep a load/unload compressor from switching too often.' + link('receiver-sizing') + link('receivers'));
    const read = form(L.form, [['qc', 'Compressor free air delivery', 5, 'q', ['airflow', 'm³/min ANR']], ['qp', 'Peak demand', 8, 'q', ['airflow', 'm³/min ANR']], ['t', 'Length of the peak', 30, 'q', ['time', 's']],
      ['pmax', 'Upper pressure (gauge)', 8, 'q', ['pressure', 'bar']], ['pmin', 'Lowest acceptable (gauge)', 6.5, 'q', ['pressure', 'bar']], ['z', 'Most load cycles per hour', 30, 'n']], v => calc(v));
    function calc(v) {
      const dp = v.pmax - v.pmin;
      if (!(dp > 0)) { L.stats.innerHTML = '<p class="muted">The upper pressure must be above the lowest.</p>'; return; }
      const Vpeak = Math.max(0, v.qp - v.qc) * v.t * PATM / dp, Vcyc = v.qc * 3600 * PATM / (4 * v.z * dp);
      L.stats.innerHTML = stat('For the peak', inU(Vpeak, 'volume', 'L', 4), 'V = (Q_peak − Q_comp)·t·p_atm/Δp') + stat('For cycling', inU(Vcyc, 'volume', 'L', 4), 'V = Q_comp·p_atm/(4·z·Δp): the worst case is demand = half the output') +
        stat('Receiver needed', inU(Math.max(Vpeak, Vcyc), 'volume', 'L', 4), 'the larger of the two; choose the next standard size', 'big');
    }
    calc(read());
  }

  /* ================================================================ ISO 1219 CHART */
  const ISO = [
    ['Directional valves', [
      ['4/2 valve, solenoid, spring return', c => S().valve(c, 105, 55, { spec: '4/2', left: 'solenoid', right: 'spring', labels: true }), 'Four ports, two positions. The box at the ports is the one working now.', 'both'],
      ['4/3 closed centre', c => S().valve(c, 110, 55, { spec: '4/3 closed', left: 'spring+solenoid', right: 'spring+solenoid', labels: true }), 'All ports blocked in the centre: the actuator is held, the pump must go over the relief valve.', 'hyd'],
      ['4/3 tandem centre', c => S().valve(c, 110, 55, { spec: '4/3 tandem', left: 'spring+lever', right: 'spring', labels: true }), 'P to T in the centre: the pump unloads at low pressure while the actuator is held.', 'hyd'],
      ['4/3 float centre', c => S().valve(c, 110, 55, { spec: '4/3 float', left: 'spring+solenoid', right: 'spring+solenoid', labels: true }), 'A and B to tank: the actuator floats freely.', 'hyd'],
      ['4/3 open centre', c => S().valve(c, 110, 55, { spec: '4/3 open', left: 'spring+solenoid', right: 'spring+solenoid', labels: true }), 'All ports joined in the centre.', 'hyd'],
      ['2/2 normally closed', c => S().valve(c, 105, 55, { spec: '2/2 NC', left: 'solenoid', right: 'spring', labels: true }), 'On/off: closed until operated.', 'both'],
      ['3/2 normally closed, push button', c => S().valve(c, 105, 55, { spec: '3/2 NC', left: 'pushbutton', right: 'spring', labels: true, pneumatic: true, exhaust: true }), 'Supply 1 to output 2 when pressed; 2 vents to 3 at rest.', 'pneu'],
      ['5/2 valve, solenoid pilot, spring return', c => S().valve(c, 105, 55, { spec: '5/2', left: 'solenoid+pilot', right: 'spring', labels: true, pneumatic: true, exhaust: 'silencer' }), 'The standard valve for a double-acting cylinder: 1→2 at rest, 1→4 when signal 14 is on.', 'pneu'],
      ['5/2 impulse valve (memory), pilot both sides', c => S().valve(c, 105, 55, { spec: '5/2', left: 'pilot', right: 'pilot', labels: true, pneumatic: true, exhaust: true }), 'Stays where the last signal left it: a pneumatic memory.', 'pneu'],
      ['5/3 closed centre', c => S().valve(c, 110, 55, { spec: '5/3 closed', left: 'spring+solenoid', right: 'spring+solenoid', labels: true, pneumatic: true, exhaust: true }), 'Stops and holds a cylinder in mid-stroke (air is springy: it drifts with leaks).', 'pneu'],
      ['5/3 exhausted centre', c => S().valve(c, 110, 55, { spec: '5/3 exhaust', left: 'spring+solenoid', right: 'spring+solenoid', labels: true, pneumatic: true, exhaust: true }), 'Both cylinder ports vented in the centre: the rod can be moved by hand.', 'pneu']]],
    ['Operators', [
      ['Solenoid', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'solenoid', s: 26 }), 'Electromagnet.', 'both'], ['Proportional solenoid', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'prop', s: 26 }), 'Force proportional to current.', 'both'],
      ['Lever', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'lever', s: 26 }), 'By hand.', 'both'], ['Push button', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'pushbutton', s: 26 }), 'By hand, returns by spring.', 'both'],
      ['Roller', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'roller', s: 26 }), 'By a cam or the moving part: a limit valve.', 'both'], ['Pilot', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'pilot', s: 26 }), 'By pressure (filled triangle: hydraulic; hollow: pneumatic).', 'both'],
      ['Detent', c => S().valve(c, 110, 55, { spec: '2/2 NC', left: 'detent+lever', s: 26 }), 'Holds a position.', 'both'], ['Spring', c => S().valve(c, 110, 55, { spec: '2/2 NC', right: 'spring', s: 26 }), 'Returns the valve.', 'both']]],
    ['Pumps, motors and actuators', [
      ['Fixed pump with electric motor', c => S().pump(c, 125, 60, { motor: true }), 'One direction of flow; the triangle points out.', 'hyd'], ['Variable pump', c => S().pump(c, 110, 60, { variable: true }), 'The arrow: adjustable displacement.', 'hyd'],
      ['Hydraulic motor, two directions', c => S().motor(c, 100, 60, { bidir: true }), 'Triangles point in: energy enters from the fluid.', 'hyd'], ['Compressor', c => S().compressor(c, 110, 60, {}), 'Hollow triangle: a gas.', 'pneu'],
      ['Air motor', c => S().motor(c, 100, 60, { pneumatic: true }), '', 'pneu'], ['Double-acting cylinder', c => S().cylinder(c, 40, 55, { len: 110, h: 30, pos: 0.4 }), 'Two ports: pushed both ways.', 'both'],
      ['Single-acting, spring return', c => S().cylinder(c, 40, 55, { len: 110, h: 30, pos: 0.2, single: 'retract' }), 'One port; the spring returns it.', 'both'], ['Through rod, cushioned', c => S().cylinder(c, 70, 55, { len: 90, h: 30, pos: 0.5, through: true, rodLen: 40, cushion: true }), 'Equal areas both sides; cushions at the ends.', 'both']]],
    ['Pressure and flow valves', [
      ['Pressure-relief valve', c => S().pressureValve(c, 90, 60, { kind: 'relief' }), 'Normally closed; opens when inlet pressure beats the spring.', 'hyd'], ['Pressure-reducing valve', c => S().pressureValve(c, 90, 60, { kind: 'reducing' }), 'Normally open; closes as outlet pressure rises.', 'both'],
      ['Sequence valve', c => S().pressureValve(c, 90, 60, { kind: 'sequence' }), 'Opens the next circuit at a pressure; external drain.', 'hyd'], ['Regulator (relieving)', c => S().pressureValve(c, 90, 60, { kind: 'regulator' }), 'Keeps an outlet pressure and vents any excess.', 'pneu'],
      ['Check valve', c => S().check(c, 110, 60, {}), 'Free flow upwards, blocked downwards.', 'both'], ['Pilot-operated check', c => S().check(c, 110, 60, { pilot: true, spring: true }), 'A pilot signal can open it against the flow.', 'hyd'],
      ['Throttle, adjustable', c => S().throttle(c, 110, 60, { adjustable: true }), 'Flow depends on pressure drop.', 'both'], ['One-way flow control', c => S().flowControl(c, 100, 60, {}), 'Throttled one way, free the other: meter-in or meter-out.', 'both'],
      ['Shuttle valve (OR)', c => S().shuttle(c, 110, 62, { side: -1 }), 'Either input gives an output.', 'pneu'], ['Two-pressure valve (AND)', c => S().andValve(c, 110, 62, {}), 'Both inputs are needed.', 'pneu'], ['Quick-exhaust valve', c => S().quickExhaust(c, 110, 55, {}), 'Vents a cylinder at its port.', 'pneu']]],
    ['Energy storage, conditioning and measuring', [
      ['Accumulator (gas loaded)', c => S().accumulator(c, 110, 55, {}), 'Stores oil under gas pressure.', 'hyd'], ['Tank', c => S().tank(c, 110, 70, {}), 'Open to the atmosphere.', 'hyd'],
      ['Filter', c => S().filter(c, 110, 60, {}), '', 'both'], ['Cooler', c => S().cooler(c, 110, 60, {}), 'Arrows: heat out.', 'hyd'], ['Pressure gauge', c => S().gauge(c, 110, 55, {}), '', 'both'],
      ['Pressure source', c => S().source(c, 110, 65, { pneumatic: true }), 'Dot: compressed-air supply.', 'pneu'], ['Service unit (FRL)', c => S().frl(c, 110, 62, {}), 'Filter, regulator with gauge, lubricator.', 'pneu'],
      ['Exhaust and silencer', c => { S().exhaust(c, 80, 45, {}); S().exhaust(c, 140, 45, { silencer: true }); }, 'Plain exhaust; with a silencer.', 'pneu'], ['Vacuum ejector and cup', c => { S().ejector(c, 90, 50, {}); S().cup(c, 170, 50, {}); }, 'Compressed air in, vacuum out.', 'pneu']]],
    ['Lines', [
      ['Working, pilot and drain lines', c => { S().line(c, [[20, 30], [200, 30]], {}); S().line(c, [[20, 60], [200, 60]], { kind: 'pilot' }); S().line(c, [[20, 90], [200, 90]], { kind: 'drain' }); }, 'Solid; long dashes; short dashes.', 'both'],
      ['Connected and crossing', c => { S().line(c, [[30, 60], [190, 60]], {}); S().line(c, [[80, 20], [80, 100]], {}); S().junction(c, 80, 60); S().line(c, [[140, 20], [140, 100]], {}); }, 'A dot joins lines; without it they cross.', 'both'],
      ['Colours for what a line carries', c => { ['pressure', 'return', 'pilot', 'metered', 'suction', 'air', 'exhaust'].forEach((k, i) => { S().line(c, [[20, 16 + i * 14], [110, 16 + i * 14]], { state: k }); S().text(c, k, 120, 16 + i * 14, { align: 'left', size: 11 }); }); }, 'The training colours used in the simulations.', 'both']]]
  ];
  function iso(el) {
    const disc = H.discipline ? H.discipline.id : '';
    let show = disc === 'pneumatics' ? 'pneu' : disc === 'hydraulics' ? 'hyd' : 'both';
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">The graphic symbols of ISO 1219-1 for hydraulic and pneumatic circuits, drawn by the same code as the simulations. Click a valve to switch it and watch which paths open.' + link('iso-1219') + link('iso-1219-pneu') + '</p>' +
      '<div class="toolbar"><div class="subtabs isosel">' + [['both', 'All'], ['hyd', 'Hydraulic'], ['pneu', 'Pneumatic']].map(([k, t]) => '<a href="javascript:void 0" data-s="' + k + '" class="' + (k === show ? 'on' : '') + '">' + t + '</a>').join('') + '</div></div><div class="isobody"></div>';
    const body = ui.$('.isobody', el);
    const draw = () => {
      body.innerHTML = ISO.map(([g, items], gi) => {
        const cards = items.map((it, i) => [it, i]).filter(([it]) => show === 'both' || it[3] === 'both' || it[3] === show);
        if (!cards.length) return '';
        return '<h3 class="h3" style="margin:18px 0 8px">' + esc(g) + '</h3><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px">' +
          cards.map(([it, i]) => '<div class="boxy isocard" data-g="' + gi + '" data-i="' + i + '" style="padding:8px;cursor:' + (gi === 0 ? 'pointer' : 'default') + '"><canvas style="display:block;width:220px;height:120px;margin:0 auto"></canvas>' +
            '<div style="font-weight:650;font-size:13.5px;margin-top:4px">' + esc(it[0]) + '</div><div class="small muted">' + esc(it[2]) + '</div></div>').join('') + '</div>';
      }).join('');
      body.querySelectorAll('.isocard').forEach(card => paint(card));
    };
    // draw a card's symbol; a valve card may carry a state (the box at the ports) chosen by clicking
    const paint = card => {
      const cv = card.querySelector('canvas'), dpr = window.devicePixelRatio || 1;
      cv.width = 220 * dpr; cv.height = 120 * dpr;
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, 220, 120);
      const it = ISO[+card.dataset.g][1][+card.dataset.i], orig = H.fsym.valve;
      if (card._st != null) H.fsym.valve = (ctx, x, y, o) => orig(ctx, x, y, Object.assign({}, o, { state: card._st }));
      try { it[1](c); } catch (e) { /* a symbol that fails to draw leaves its card blank */ } finally { H.fsym.valve = orig; }
    };
    body.addEventListener('click', e => {
      const card = e.target.closest('.isocard'); if (!card || card.dataset.g !== '0') return;
      const n = /5\/3|4\/3/.test(ISO[0][1][+card.dataset.i][0]) ? 3 : 2;
      card._st = ((card._st == null ? 1 : card._st) + 1) % n;                  // the normal (spring) box is 1
      paint(card);
    });
    el.querySelector('.isosel').addEventListener('click', e => { const a = e.target.closest('[data-s]'); if (!a) return; show = a.dataset.s; el.querySelectorAll('.isosel a').forEach(x => x.classList.toggle('on', x === a)); draw(); });
    draw();
  }

  H.fluidTools = { airfoil, flight, hydro, fpower, pneu, iso, criticalMach, cpStar, karmanTsien };
})();
