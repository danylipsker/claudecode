/* HYPER-CORE · ui/water-phase.js — Tools → Phase lab (#/tools/phase/<diagram|density|vapour|ices>)
 *
 *   diagram   the complete pressure–temperature map of water: vapour, liquid, supercritical fluid and the ices, from
 *             1 Pa to 100 GPa and 100 to 800 K, with the IAPWS sublimation, boiling and melting curves, the triple and
 *             critical points, a draggable state point that reads the phase and the properties, and presets from a
 *             kitchen to the floor of Europa's ocean
 *   density   the density of water, ice and heavy water against temperature, the maximum at 3.98 °C, the expansion
 *             coefficient, and a lake column that shows why 4 °C water sinks
 *   vapour    the vapour-pressure curve over water and over ice, the boiling point against altitude and pressure, and
 *             what a pressure cooker and a mountain do to it
 *   ices      the catalogue of the ices: every crystalline and amorphous phase with its year, density, pressure and
 *             structure, as a table and as a bar chart of densities
 *
 * The physics is kit.water (water.js); the drawing kit.wsym; shared helpers T.util (watertools.js).
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, W = H.water, S = H.wsym;
  const T = H.waterTools = H.waterTools || {};
  const f = T.util.f;
  const TABS = [['diagram', 'The phase diagram'], ['density', 'Density and the 4 °C maximum'], ['vapour', 'Vapour pressure and boiling'], ['ices', 'The catalogue of ices']];

  T.phase = function (el, params, sub) {
    const t = T.util.subtabs(el, 'phase', TABS, sub, 'Curves from the IAPWS formulations (sublimation 2011, melting 2011, vapour pressure Wagner–Pruß); the boundaries between the solid ices are drawn from published phase diagrams and are approximate. Densities from Kell (1975).');
    ({ diagram, density, vapour, ices })[t.tab](t.body, params);
  };
  T.phase.tabs = TABS.map(t => t[0]);

  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: K.colors().muted }, o));
  const degC = v => f(v, 1) + ' °C';
  const pFmt = p => p >= 1e9 ? f(p / 1e9, 2) + ' GPa' : p >= 1e6 ? f(p / 1e6, 2) + ' MPa' : p >= 1e3 ? f(p / 1e3, 2) + ' kPa' : f(p, 1) + ' Pa';
  const PHASE_HUE = { 'vapour': [0, 0.08], 'liquid': [212, 0.35], 'supercritical': [280, 0.3], 'ice Ih': [195, 0.45], 'ice XI': [195, 0.65], 'ice II': [160, 0.4], 'ice III': [140, 0.4], 'ice IX': [140, 0.6], 'ice V': [100, 0.4], 'ice XIII': [100, 0.6], 'ice VI': [60, 0.4], 'ice XV': [60, 0.6], 'ice XIX': [50, 0.75], 'ice VII': [30, 0.45], 'ice VIII': [30, 0.65], 'ice X': [0, 0.5] };

  /* ================================================================ the diagram */
  function diagram(el, params) {
    const L = T.util.lab(el, 'Every point on this map is a temperature and a pressure, and the colour says what water is there. Drag the dot, or pick a place. Pressure runs over eleven powers of ten, from the vacuum of space to the inside of a diamond anvil.', 0.62, { minH: 360, maxH: 640 });
    const PRESETS = [['— pick a place —', ''], ['Your kitchen (25 °C, 1 atm)', '298.15,101325'], ['A freezer (−18 °C)', '255.15,101325'], ['A pressure cooker (2 atm)', '393.2,202650'], ['The summit of Everest (337 hPa)', '271,33700'], ['A cloud at 10 km (−50 °C, 260 hPa)', '223,26000'], ['The surface of Mars (−60 °C, 610 Pa)', '213,610'], ['Interstellar space (10 K, 10⁻¹³ Pa → 1 Pa here)', '10,1'], ['The Mariana Trench floor (2 °C, 1,100 bar)', '275.15,1.1e8'], ['A black-smoker vent (400 °C, 300 bar)', '673,3e7'], ['A power-station boiler (600 °C, 250 bar)', '873,2.5e7'], ['The floor of Europa\'s ocean (~1.5 kbar)', '270,1.5e8'], ['Deep in Ganymede (1.5 GPa, 250 K)', '250,1.5e9'], ['A diamond anvil (3 GPa, room temperature)', '298,3e9'], ['Inside a diamond: ice VII (24 GPa)', '298,2.4e10'], ['Inside an icy super-Earth (60 GPa, 600 K)', '600,6e10']];
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Temperature', min: 100, max: 800, step: 0.5, value: params && params.T ? +params.T : 298.15, unit: 'K' },
      { id: 'logp', label: 'Pressure, log₁₀(Pa)', min: 0, max: 11, step: 0.02, value: params && params.p ? Math.log10(+params.p) : Math.log10(101325) },
      { id: 'preset', type: 'select', label: 'A place', options: PRESETS, value: '' },
      { id: 'labels', type: 'check', label: 'Name every phase', value: true },
      { id: 'solid', type: 'check', label: 'Show the solid–solid boundaries', value: true },
      { id: 'lines', type: 'check', label: 'Everyday pressures (1 atm) and 0 / 100 °C', value: true }
    ], (id, v) => { if (id === 'preset' && v) { const [t, p] = v.split(',').map(Number); ctl.set('T', t); ctl.set('logp', Math.log10(Math.max(1, p))); } draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['state', 'Water here is'], ['TC', 'Temperature'], ['p', 'Pressure'], ['rho', 'Density'], ['melt', 'Melts / freezes at this pressure'], ['boil', 'Boils at this pressure'], ['note', '']]);
    L.under.innerHTML = '<p class="small muted" style="margin:10px 0 0">The negative slope of the ice Ih melting line (down to −22 °C at 209 MPa) is the signature of a solid lighter than its liquid; past it, the denser ices III, V, VI and VII melt at ever higher temperatures — ice VII above 100 °C. The hydrogen-ordered ices (XI, IX, XIII, XV, XIX, VIII) appear only when cold. Vapour and liquid stop being different above the critical point at 647 K and 22.1 MPa.</p>' +
      '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ['the-phase-diagram', 'why-ice-floats', 'the-triple-point-standard', 'supercritical-water', 'high-pressure-ices', 'hydrogen-ordered-ices', 'boiling-at-altitude'].map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';
    const TMIN = 100, TMAX = 800, LPMIN = 0, LPMAX = 11;
    let raster = null, rasterKey = '';
    const geom = () => { const Wd = L.st.W, Hh = L.st.H; return { x0: 54, y0: 16, x1: Wd - 16, y1: Hh - 36 }; };
    const toX = (g, Tk) => g.x0 + (Tk - TMIN) / (TMAX - TMIN) * (g.x1 - g.x0);
    const toY = (g, lp) => g.y1 - (lp - LPMIN) / (LPMAX - LPMIN) * (g.y1 - g.y0);
    const fromXY = (g, x, y) => ({ T: TMIN + (x - g.x0) / (g.x1 - g.x0) * (TMAX - TMIN), lp: LPMIN + (g.y1 - y) / (g.y1 - g.y0) * (LPMAX - LPMIN) });
    function buildRaster(g, dark) {
      const nx = 200, ny = 140, cv = document.createElement('canvas'); cv.width = nx; cv.height = ny;
      const cx = cv.getContext('2d');
      if (!cx || !cx.createImageData) return null;
      const img = cx.createImageData(nx, ny);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const Tk = TMIN + (i + 0.5) / nx * (TMAX - TMIN), lp = LPMAX - (j + 0.5) / ny * (LPMAX - LPMIN);
        const ph = W.phaseAt(Tk, Math.pow(10, lp));
        const hs = PHASE_HUE[ph] || [0, 0];
        const light = dark ? 0.28 + 0.18 * hs[1] : 0.92 - 0.25 * hs[1];
        const [r, gg, b] = hsl(hs[0], hs[1] ? 0.55 : 0, light);
        const k = (j * nx + i) * 4; img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
      }
      cx.putImageData(img, 0, 0);
      return cv;
    }
    function hsl(h, s, l) {
      const a = s * Math.min(l, 1 - l), fn = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
      return [Math.round(255 * fn(0)), Math.round(255 * fn(8)), Math.round(255 * fn(4))];
    }
    const curve = (c, pts, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w || 2; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
    K.drag(L.st, {
      hover: true,
      hit: p => 'pt',
      move: (what, p) => { const g = geom(); const s = fromXY(g, p.x, p.y); ctl.set('T', Math.max(TMIN, Math.min(TMAX, Math.round(s.T * 2) / 2))); ctl.set('logp', Math.max(LPMIN, Math.min(LPMAX, Math.round(s.lp * 50) / 50))); draw(); }
    });
    function draw() {
      const c = L.st.begin(), C = K.colors(), g = geom();
      const Tk = V.T, p = Math.pow(10, V.logp);
      const key = L.st.W + 'x' + L.st.H + (C.dark ? 'd' : 'l');
      if (rasterKey !== key) { raster = buildRaster(g, !!C.dark); rasterKey = key; }
      if (raster) { c.imageSmoothingEnabled = false; c.drawImage(raster, g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0); c.imageSmoothingEnabled = true; }
      // axes
      c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(g.x0 + 0.5, g.y0 + 0.5, g.x1 - g.x0, g.y1 - g.y0);
      for (let lp = 0; lp <= 11; lp++) { const y = toY(g, lp); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke(); label(c, lp === 0 ? '1 Pa' : lp === 3 ? '1 kPa' : lp === 6 ? '1 MPa' : lp === 9 ? '1 GPa' : '10' + String(lp).replace(/\d/g, ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]), g.x0 - 6, y, { align: 'right', baseline: 'middle', size: 10.5 }); }
      for (let Tt = 100; Tt <= 800; Tt += 100) { const x = toX(g, Tt); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke(); label(c, Tt + ' K', x, g.y1 + 6, { align: 'center', baseline: 'top', size: 10.5 }); label(c, degC(Tt - 273.15).replace('.0', ''), x, g.y1 + 19, { align: 'center', baseline: 'top', size: 10 }); }
      label(c, 'pressure', g.x0 - 46, g.y0 + 2, { size: 10.5 });
      // the curves
      const sub = []; for (let t = TMIN; t <= W.TRIPLE.T; t += 2) { const pp = W.sublimationPressure(t - 273.15); if (pp >= 1) sub.push([toX(g, t), toY(g, Math.log10(pp))]); }
      const vap = []; for (let t = W.TRIPLE.T; t <= W.CRITICAL.T; t += 2) vap.push([toX(g, t), toY(g, Math.log10(W.vapourPressure(t - 273.15)))]);
      curve(c, sub, C.text, 2); curve(c, vap, C.text, 2);
      for (const id of ['Ih', 'III', 'V', 'VI', 'VII']) { const m = W.MELT[id], pts = []; const hi = id === 'VII' ? TMAX : m.Thi; for (let t = m.Tlo; t <= hi; t += (hi - m.Tlo) / 60) pts.push([toX(g, t), toY(g, Math.log10(m.f(t)))]); curve(c, pts, C.text, 2); }
      if (V.solid) for (const b of W.ICE_BOUNDARIES) curve(c, b.pts.map(([t, mpa]) => [toX(g, t), toY(g, Math.log10(Math.max(1, mpa * 1e6)))]), C.text, 1, [4, 3]);
      // the critical isobar/isotherm dotted beyond the critical point
      curve(c, [[toX(g, W.CRITICAL.T), toY(g, Math.log10(W.CRITICAL.p))], [toX(g, W.CRITICAL.T), g.y0]], C.muted, 1, [2, 4]);
      curve(c, [[toX(g, W.CRITICAL.T), toY(g, Math.log10(W.CRITICAL.p))], [g.x1, toY(g, Math.log10(W.CRITICAL.p))]], C.muted, 1, [2, 4]);
      if (V.lines) {
        curve(c, [[g.x0, toY(g, Math.log10(101325))], [g.x1, toY(g, Math.log10(101325))]], C.warn, 1, [6, 4]);
        label(c, '1 atm', g.x1 - 4, toY(g, Math.log10(101325)) - 4, { align: 'right', color: C.warn, size: 10.5 });
        for (const [t, s] of [[273.15, '0 °C'], [373.15, '100 °C']]) { curve(c, [[toX(g, t), g.y0], [toX(g, t), g.y1]], C.warn, 1, [6, 4]); label(c, s, toX(g, t) + 3, g.y0 + 4, { color: C.warn, size: 10.5, baseline: 'top' }); }
      }
      // points
      K.dot(c, toX(g, W.TRIPLE.T), toY(g, Math.log10(W.TRIPLE.p)), 4, C.text);
      label(c, 'triple point', toX(g, W.TRIPLE.T) + 6, toY(g, Math.log10(W.TRIPLE.p)) + 12, { color: C.text, size: 10.5 });
      K.dot(c, toX(g, W.CRITICAL.T), toY(g, Math.log10(W.CRITICAL.p)), 4, C.text);
      label(c, 'critical point', toX(g, W.CRITICAL.T) + 6, toY(g, Math.log10(W.CRITICAL.p)) - 8, { color: C.text, size: 10.5 });
      if (V.labels) {
        const LAB = [['vapour', 450, 2.5], ['liquid', 400, 7.4], ['supercritical fluid', 730, 8.2], ['ice Ih', 190, 5.5], ['XI', 60 + 100, 3.2], ['II', 185, 8.45], ['III', 247, 8.33], ['V', 262, 8.65], ['VI', 300, 9.1], ['XV', 115, 9.05], ['VII', 420, 9.9], ['VIII', 180, 9.95], ['X', 400, 10.75], ['XIX', 90, 9.25]];
        for (const [s, t, lp] of LAB) label(c, s, toX(g, t), toY(g, lp), { align: 'center', baseline: 'middle', color: C.text, size: s.length > 4 ? 12 : 11, weight: 650 });
      }
      // the state point
      const x = toX(g, Tk), y = toY(g, V.logp), ph = W.phaseAt(Tk, p);
      c.save(); c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(g.x0, y); c.lineTo(x, y); c.moveTo(x, y); c.lineTo(x, g.y1); c.stroke(); c.restore();
      K.dot(c, x, y, 7, C.bad, '#fff');
      ro.set('state', ph);
      ro.set('TC', f(Tk, 1) + ' K = ' + degC(Tk - 273.15));
      ro.set('p', pFmt(p) + ' = ' + f(p / 101325, p > 1e5 ? 1 : 4) + ' atm');
      const Tc = Tk - 273.15;
      ro.set('rho', ph === 'liquid' && Tc <= 150 && Tc >= -40 ? f(W.density(Tc), 1) + ' kg/m³ (at 1 atm; a little more under pressure)' : ph === 'ice Ih' ? f(W.densityIce(Math.min(0, Tc)), 1) + ' kg/m³' : ph === 'vapour' ? T.util.sci(p * 0.018015 / (8.314 * Tk), 2) + ' kg/m³ (ideal gas)' : ph.startsWith('ice') ? (W.ICES.find(i => 'ice ' + i.id === ph) || {}).rho * 1000 + ' kg/m³ (typical)' : '322 kg/m³ at the critical point; varies strongly');
      const m = W.meltingPoint(p);
      ro.set('melt', p < W.TRIPLE.p ? 'no liquid at this pressure: ice sublimes' : f(m.T, 2) + ' K = ' + degC(m.T - 273.15) + ' (ice ' + m.ice + ')');
      ro.set('boil', p > W.CRITICAL.p ? 'none: above the critical pressure there is no boiling' : degC(W.boilingPoint(p)) + (p < W.TRIPLE.p ? ' (sublimation)' : ''));
      ro.set('note', ph === 'supercritical' ? 'Neither liquid nor gas: it fills its vessel like a gas and dissolves like a liquid.' : ph === 'ice VII' ? 'An ice stable above the boiling point of water at sea level — found inside diamonds.' : ph === 'ice X' ? 'The hydrogens sit midway between the oxygens: there are no molecules any more.' : ph === 'ice XI' || ph === 'ice XV' || ph === 'ice XIX' || ph === 'ice VIII' || ph === 'ice IX' || ph === 'ice XIII' ? 'A hydrogen-ordered ice: the protons have settled into one arrangement.' : ph === 'vapour' && Tk < W.TRIPLE.T ? 'Below the triple point ice turns to vapour without melting — freeze-drying, and the surface of Mars.' : '');
    }
    L.st.onResize(() => { rasterKey = ''; draw(); });
    T.util.onTheme(() => { rasterKey = ''; draw(); });
    draw();
  }

  /* ================================================================ density */
  function density(el) {
    const L = T.util.lab(el, 'Water is densest at 3.98 °C. Cooler than that it expands; ice is 9 % lighter still. Heavy water does the same but at 11.2 °C. The column on the right is a lake: the densest water sinks, so the bottom of a winter lake sits at 4 °C under a lid of ice.', 0.55);
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Temperature', min: -30, max: 100, step: 0.1, value: 4, unit: '°C' },
      { id: 'what', type: 'select', label: 'Plot', options: [['Density', 'rho'], ['Expansion coefficient', 'alpha'], ['Volume of 1 kg', 'vol']], value: 'rho' },
      { id: 'd2o', type: 'check', label: 'Heavy water D₂O too', value: true },
      { id: 'ice', type: 'check', label: 'Ice Ih', value: true },
      { id: 'zoom', type: 'check', label: 'Zoom on −10 … 20 °C', value: false }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['rho', 'Density of water'], ['al', 'Expansion coefficient'], ['ice', 'Ice at 0 °C'], ['d2o', 'Heavy water'], ['max', 'Maximum']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)' }, y: { label: 'density (kg/m³)' }, legend: true }, 240);
    function draw() {
      const Tc = V.T;
      const lo = V.zoom ? -10 : -30, hi = V.zoom ? 20 : 100;
      const ser = [], marks = [];
      const yfn = V.what === 'rho' ? t => W.density(t) : V.what === 'alpha' ? t => W.expansion(t) * 1e6 : t => 1000 / W.density(t);
      const pts = []; for (let t = lo; t <= hi; t += 0.25) pts.push([t, yfn(t)]);
      ser.push({ pts, label: 'water' });
      if (V.d2o && V.what !== 'alpha') { const p2 = []; for (let t = Math.max(lo, 4); t <= hi; t += 0.25) p2.push([t, V.what === 'rho' ? W.densityD2O(t) : 1000 / W.densityD2O(t)]); ser.push({ pts: p2, label: 'heavy water D₂O' }); }
      if (V.ice && V.what !== 'alpha') { const p3 = []; for (let t = lo; t <= 0; t += 0.5) p3.push([t, V.what === 'rho' ? W.densityIce(t) : 1000 / W.densityIce(t)]); ser.push({ pts: p3, label: 'ice Ih', dash: true }); }
      marks.push({ x: Tc, y: yfn(Tc), label: V.what === 'rho' ? f(W.density(Tc), 2) + ' kg/m³' : V.what === 'alpha' ? f(W.expansion(Tc) * 1e6, 0) + ' ppm/K' : f(1000 / W.density(Tc), 4) + ' L' });
      const yo = V.what === 'rho' ? { label: 'density (kg/m³)', min: V.zoom ? 995 : (V.ice ? 900 : 950), max: V.zoom ? (V.d2o ? 1107 : 1001) : (V.d2o ? 1110 : 1001) } : V.what === 'alpha' ? { label: 'volumetric expansion (ppm/K)' } : { label: 'volume of 1 kg (L)' };
      plot.set({ series: ser, marks, x: { label: 'temperature (°C)', min: lo, max: hi }, y: yo, vlines: [{ x: W.TMAX, label: '3.98 °C' }].concat(V.d2o && V.what !== 'alpha' ? [{ x: W.D2O.Tmax, label: '11.2 °C' }] : []), hlines: V.what === 'alpha' ? [{ y: 0, label: 'no expansion' }] : [] });
      ro.set('rho', f(W.density(Tc), 3) + ' kg/m³ at ' + degC(Tc) + (Tc < 0 ? ' (supercooled)' : ''));
      ro.set('al', f(W.expansion(Tc) * 1e6, 1) + ' ppm/K' + (W.expansion(Tc) < 0 ? ' — shrinks when warmed' : ''));
      ro.set('ice', f(W.densityIce(0), 1) + ' kg/m³: ' + f((W.density(0) / W.densityIce(0) - 1) * 100, 2) + ' % more room than the water');
      ro.set('d2o', f(W.densityD2O(Math.max(4, Tc)), 1) + ' kg/m³ — heavy ice (1,017) sinks in ordinary water');
      ro.set('max', f(W.RHO_MAX, 3) + ' kg/m³ at ' + W.TMAX + ' °C');
      // the stage: a lake column with the temperature profile, and the molecules' spacing
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const lx = Wd * 0.08, ly = Hh * 0.1, lw = Wd * 0.36, lh = Hh * 0.8;
      // winter profile: 0 at the top, 4 at the bottom, if T <= 4; otherwise summer: warm top, 4 bottom
      const top = Tc, bottom = Tc <= 4 ? Math.min(4, Math.max(Tc, 4)) : 4;
      const n = 24;
      for (let i = 0; i < n; i++) {
        const fr = i / (n - 1);
        const t = Tc <= 4 ? Math.max(Tc, 0) + (4 - Math.max(Tc, 0)) * Math.pow(fr, 0.7) : 4 + (Tc - 4) * Math.pow(1 - fr, 2.5);
        const rho = W.density(t);
        const shade = Math.min(1, Math.max(0, (rho - 990) / 10));
        c.fillStyle = 'rgba(' + Math.round(60 + 120 * (1 - shade)) + ',' + Math.round(140 + 60 * (1 - shade)) + ',' + Math.round(200 + 35 * (1 - shade)) + ',0.85)';
        c.fillRect(lx, ly + lh * i / n, lw, lh / n + 1);
        if (i % 4 === 0) label(c, degC(t), lx + lw + 6, ly + lh * (i + 0.5) / n, { baseline: 'middle', size: 10.5 });
      }
      if (Tc <= 0) { c.fillStyle = 'rgba(225,240,255,0.95)'; c.fillRect(lx, ly, lw, lh * 0.08); label(c, 'ice', lx + lw / 2, ly + lh * 0.04, { align: 'center', baseline: 'middle', color: '#246', size: 11, weight: 650 }); }
      c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(lx, ly, lw, lh);
      label(c, Tc <= 4 ? 'a lake in winter: the densest water, 4 °C, is at the bottom' : 'a lake in summer: warm, light water floats on 4 °C', lx, ly - 6, { color: C.text, size: 11.5 });
      // molecules: spacing scaled by the cube root of the volume, exaggerated ×30
      const mx = Wd * 0.62, my = Hh * 0.12, mw = Wd * 0.33, mh = Hh * 0.76;
      c.fillStyle = C.surface; c.fillRect(mx, my, mw, mh); c.strokeStyle = C.axis; c.strokeRect(mx, my, mw, mh);
      const ex = 1 + 30 * (1000 / W.density(Tc) - 1000 / W.RHO_MAX);
      const sp = Math.max(18, Math.min(mw / 5, 28)) * ex;
      let seed = 11; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      c.save(); c.beginPath(); c.rect(mx, my, mw, mh); c.clip();
      for (let yy = my + sp / 2; yy < my + mh; yy += sp) for (let xx = mx + sp / 2; xx < mx + mw; xx += sp) S.molecule(c, xx + (r() - 0.5) * sp * 0.35, yy + (r() - 0.5) * sp * 0.35, { angle: r() * 6.28, scale: 8 });
      c.restore();
      label(c, 'spacing exaggerated 30×', mx + mw / 2, my + mh + 14, { align: 'center' });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ================================================================ vapour */
  function vapour(el) {
    const L = T.util.lab(el, 'Above any water there is vapour, at a pressure that climbs steeply with temperature — doubling about every 10 K near room temperature. Where that pressure reaches the pressure on the water, it boils. Over ice the vapour pressure is lower than over supercooled water at the same temperature, which is why ice grows at the expense of cloud droplets.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Temperature', min: -40, max: 374, step: 0.5, value: 20, unit: '°C' },
      { id: 'h', label: 'Altitude', min: -400, max: 9000, step: 10, value: 0, unit: 'm' },
      { id: 'extra', label: 'Extra pressure (a cooker or a lid)', min: 0, max: 2, step: 0.05, value: 0, unit: 'bar' },
      { id: 'log', type: 'check', label: 'Logarithmic pressure axis', value: true },
      { id: 'range', type: 'select', label: 'Range', options: [['−40 … 120 °C', 'low'], ['Up to the critical point', 'all']], value: 'low' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['pv', 'Vapour pressure at T'], ['pi', 'Over ice (if frozen)'], ['pa', 'Pressure on the water'], ['bp', 'Boiling point there'], ['slope', 'Clausius–Clapeyron slope'], ['L', 'Latent heat at T']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)' }, y: { label: 'pressure (kPa)' }, legend: true }, 240);
    function draw() {
      const Tc = V.T, pa = T.util.pAlt(V.h) + V.extra * 1e5;
      const hi = V.range === 'all' ? 373.9 : 120, lo = -40;
      const pts = [], pice = [];
      for (let t = lo; t <= hi; t += (hi - lo) / 300) pts.push([t, W.vapourPressure(t) / 1e3]);
      for (let t = lo; t <= 0; t += 0.5) pice.push([t, W.sublimationPressure(t) / 1e3]);
      const bp = W.boilingPoint(pa);
      plot.set({ series: [{ pts, label: 'over liquid water' }, { pts: pice, label: 'over ice', dash: true }], x: { label: 'temperature (°C)', min: lo, max: hi }, y: { label: 'pressure (kPa)', log: !!V.log, min: V.log ? 0.01 : 0, max: V.range === 'all' ? 25000 : (V.log ? 300 : 250) }, hlines: [{ y: pa / 1e3, label: 'pressure on the water, ' + f(pa / 1e3, 1) + ' kPa' }], marks: [{ x: Tc, y: W.vapourPressure(Tc) / 1e3, label: f(W.vapourPressure(Tc) / 1e3, 2) + ' kPa' }, { x: bp, y: pa / 1e3, label: 'boils at ' + degC(bp) }] });
      ro.set('pv', f(W.vapourPressure(Tc) / 1e3, Tc < 10 ? 3 : 2) + ' kPa');
      ro.set('pi', Tc <= 0.01 ? f(W.sublimationPressure(Tc) / 1e3, 3) + ' kPa (' + f(100 * (1 - W.sublimationPressure(Tc) / W.vapourPressure(Tc)), 1) + ' % below the supercooled liquid)' : 'no ice above 0 °C');
      ro.set('pa', f(pa / 1e3, 1) + ' kPa' + (V.h ? ' at ' + V.h + ' m' : '') + (V.extra ? ' with +' + V.extra + ' bar' : ''));
      ro.set('bp', degC(bp));
      ro.set('slope', f(W.ccSlope(Tc) / 1e3, Tc < 10 ? 4 : 2) + ' kPa/K — ' + f(100 * W.ccSlope(Tc) / W.vapourPressure(Tc), 1) + ' % per kelvin');
      ro.set('L', f(W.latentVaporisation(Tc) / 1e3, 0) + ' kJ/kg');
      // stage: a pot under a sky, with vapour molecules leaving at a rate ∝ vapour pressure
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const px = Wd * 0.3, py = Hh * 0.3, pw = Wd * 0.4, ph = Hh * 0.55;
      S.beaker(c, px, py, pw, ph, 0.6, { label: degC(Tc) + ' water, ' + f(pa / 1e3, 0) + ' kPa above it' });
      const rate = Math.min(40, 2 + 38 * Math.log10(1 + W.vapourPressure(Tc) / 500));
      let seed = 5; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      for (let i = 0; i < rate; i++) S.molecule(c, px + 10 + r() * (pw - 20), py - 8 - r() * (py - 16), { angle: r() * 6.28, scale: 6, alpha: 0.7 });
      if (Tc >= bp - 0.05) { for (let i = 0; i < 12; i++) S.drop(c, px + 12 + r() * (pw - 24), py + ph * 0.4 + r() * ph * 0.55, 3 + r() * 5, { color: 'rgba(255,255,255,0.8)', highlight: '#fff' }); label(c, 'boiling', px + pw / 2, py + ph * 0.5, { align: 'center', color: C.bad, weight: 650, size: 14 }); }
      label(c, 'vapour: ' + f(W.vapourPressure(Tc) / 1e3, 2) + ' kPa', px + pw / 2, 16, { align: 'center', color: C.text, size: 12 });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ================================================================ ices */
  function ices(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Twenty crystalline ices and four glasses, by the order in which they were named. "Ordered" means the hydrogens have settled into one arrangement (a cold, slowly reached state of a parent ice); the parent keeps them disordered as the ice rules allow.</p><div class="icebar"></div><div class="icetab"></div>' +
      '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ['ice-ih-and-ice-ic', 'the-ice-rules', 'high-pressure-ices', 'hydrogen-ordered-ices', 'amorphous-ices', 'clathrate-hydrates', 'superionic-ice'].map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';
    const bar = ui.$('.icebar', el), tab = ui.$('.icetab', el);
    const ctl = K.controls(bar, [
      { id: 'kind', type: 'select', label: 'Show', options: [['All', 'all'], ['Crystalline, hydrogen-disordered', 'dis'], ['Crystalline, hydrogen-ordered', 'ord'], ['Amorphous (glasses)', 'am']], value: 'all' },
      { id: 'sort', type: 'select', label: 'Order by', options: [['Name', 'name'], ['Year', 'year'], ['Density', 'rho']], value: 'name' }
    ], () => draw());
    const V = ctl.values;
    const cvBox = document.createElement('div'); cvBox.style.margin = '10px 0';
    bar.appendChild(cvBox);
    const st = K.stage(cvBox, { aspect: 0.32, minH: 180, maxH: 260 });
    function list() {
      let a = W.ICES.filter(i => V.kind === 'all' || (V.kind === 'am' ? i.structure === 'glass' : V.kind === 'ord' ? i.ordered && i.structure !== 'glass' : !i.ordered && i.structure !== 'glass'));
      if (V.sort === 'year') a = a.slice().sort((x, y) => (x.year === '—' ? 0 : x.year) - (y.year === '—' ? 0 : y.year));
      if (V.sort === 'rho') a = a.slice().sort((x, y) => x.rho - y.rho);
      return a;
    }
    function draw() {
      const a = list();
      tab.innerHTML = T.util.table(['Ice', 'Named', 'Density (g/cm³)', 'Where it is stable', 'Structure', 'Hydrogens', 'Notes'], a.map(i => ({ cells: ['<b>' + esc(i.name) + '</b>', String(i.year), i.rho, esc(i.p), esc(i.structure), i.structure === 'glass' ? '—' : i.ordered ? 'ordered' : 'disordered', esc(i.note)], hl: i.id === 'Ih' })), { maxHeight: 520 });
      const c = st.begin(), C = K.colors(), Wd = st.W, Hh = st.H;
      const n = a.length, g = { x0: 40, y0: 14, x1: Wd - 10, y1: Hh - 28 };
      const bw = (g.x1 - g.x0) / n;
      const ymax = 3.2;
      for (const yv of [1, 2, 3]) { const y = g.y1 - yv / ymax * (g.y1 - g.y0); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke(); label(c, yv + ' g/cm³', g.x0 - 4, y, { align: 'right', baseline: 'middle', size: 10 }); }
      const yw = g.y1 - 1 / ymax * (g.y1 - g.y0); c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(g.x0, yw); c.lineTo(g.x1, yw); c.stroke(); c.setLineDash([]);
      label(c, 'liquid water', g.x1 - 2, yw - 7, { align: 'right', color: C.warn, size: 10 });
      a.forEach((i, k) => {
        const h = Math.min(i.rho, ymax) / ymax * (g.y1 - g.y0);
        c.fillStyle = i.structure === 'glass' ? C.muted : i.ordered ? K.hue(280) : i.rho < 1 ? K.hue(195) : K.hue(40);
        c.fillRect(g.x0 + k * bw + 2, g.y1 - h, bw - 4, h);
        label(c, i.id, g.x0 + (k + 0.5) * bw, g.y1 + 4, { align: 'center', baseline: 'top', size: bw > 26 ? 10.5 : 8.5, color: C.text });
      });
      label(c, 'density of each ice (ice X and XVIII shown capped at 3.2)', g.x0, 2, { size: 10.5, baseline: 'top' });
    }
    st.onResize(draw);
    draw();
  }
})();
