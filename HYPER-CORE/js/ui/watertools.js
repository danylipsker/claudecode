/* HYPER-CORE · ui/watertools.js
 *
 * The Tools pages of Hyper Water: this file holds the shared helpers of the labs, the Water calculators and the
 * Water dictionary; each lab lives in its own file (ui/water-<name>.js) and adds itself to Hyper.waterTools:
 *
 *   #/tools/phase        the phase diagram of water and its ices, density, vapour pressure, the ices    (water-phase.js)
 *   #/tools/molecule     the molecule in 3-D, the flickering network, ice and liquid, the look-alikes    (water-molecule.js)
 *   #/tools/anomalies    every property against temperature, with where water misbehaves                (water-anomalies.js)
 *   #/tools/worlds       water on other worlds, the deuterium clock, Earth's water, the habitable zone   (water-worlds.js)
 *   #/tools/watercalc    calculators: boiling on a mountain, dew, oxygen in a pond, salt, capillaries, heat, molecules (this file)
 *   #/tools/dictionary   every term the pages define, A to Z                                             (this file)
 *
 * The physics is HYPER-CORE/js/water.js (kit.water); the drawing is watersym.js (kit.wsym).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, K = H.kit;
  const T = H.waterTools = H.waterTools || {};
  const W = H.water, S = H.wsym;

  /* ---------------------------------------------------------------- shared by the labs: T.util */
  T.util = {
    subtabs(el, base, TABS, sub, note) {
      const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
      el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' + (note ? '<p class="small faint mt">' + note + '</p>' : '');
      return { tab, body: ui.$('.mbody', el) };
    },
    lab(el, intro, aspect, opts) {
      el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="pjlab"><div class="pjside"></div><div><div class="pjstage"></div><div class="pjunder"></div></div></div>';
      const stageEl = ui.$('.pjstage', el);
      const st = K.stage(stageEl, Object.assign({ aspect: aspect || 0.6, minH: 300, maxH: 720 }, opts || {}));
      return { side: ui.$('.pjside', el), stage: stageEl, under: ui.$('.pjunder', el), st };
    },
    box: (title, html) => '<div class="boxy" style="margin-top:10px"><h3>' + title + '</h3>' + html + '</div>',
    link: (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '',
    more(ids) { const a = ids.filter(id => H.nodes.has(id)); return a.length ? '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + a.map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.titleOf(id)) + '</a>').join('') + '</div>' : ''; },
    table(head, rows, opts) {
      return '<div class="tablewrap" style="' + (opts && opts.maxHeight ? 'max-height:' + opts.maxHeight + 'px;overflow:auto' : '') + '"><table class="optable"><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr' + (r.hl ? ' class="hl"' : '') + '>' + (r.cells || r).map(c => '<td' + (typeof c === 'number' ? ' class="num"' : '') + '>' + (typeof c === 'number' ? U.fmt(c, 4) : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    },
    f: (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—',
    sci: (x, d) => { if (!Number.isFinite(x)) return '—'; const e = Math.floor(Math.log10(Math.abs(x))); const m = x / Math.pow(10, e); return m.toFixed(d == null ? 2 : d) + ' × 10' + String(e).replace(/-/g, '⁻').replace(/\d/g, ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]); },
    onTheme(fn) { document.addEventListener('hyper:theme', fn); ui.onLeave(() => document.removeEventListener('hyper:theme', fn)); },
    /* the standard atmosphere: pressure (Pa) at an altitude (m), to 11 km, and the inverse */
    pAlt: h => 101325 * Math.pow(Math.max(0, 1 - 2.25577e-5 * Math.min(h, 11000)), 5.25588),
    altP: p => (1 - Math.pow(p / 101325, 1 / 5.25588)) / 2.25577e-5
  };
  const f = T.util.f;

  /* ---------------------------------------------------------------- the dictionary */
  T.dictionary = function (el) {
    const all = H.allTerms();
    const name = (H.discipline && H.discipline.title) || 'this app';
    if (!all.length) { el.innerHTML = '<p class="muted">No terms are defined yet.</p>'; return; }
    const letterOf = t => { const m = /[a-z0-9]/i.exec(t.term.normalize('NFD')); const c = m ? m[0].toUpperCase() : '#'; return /[0-9]/.test(c) ? '#' : c; };
    const LETTERS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const branches = H.branches.map(b => [b.id, b.title]);
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every term the pages of ' + esc(name) + ' define — ' + all.length + ' of them — with the page that explains it. Other names and abbreviations are listed under their letters too (D/H, VSMOW, LDA …). The search box at the top of the app finds the same terms.</p>' +
      '<div class="toolbar"><input type="search" class="inp dq" placeholder="Find a term: hydrogen bond, Grotthuss, dew point, clathrate, D/H …" style="flex:1;min-width:240px">' +
      '<select class="inp db"><option value="">All branches</option>' + branches.map(([id, t]) => '<option value="' + id + '">' + esc(t) + '</option>').join('') + '</select></div>' +
      '<nav class="dict-letters"></nav><div class="dlist"></div>';
    const q = ui.$('.dq', el), bsel = ui.$('.db', el), nav = ui.$('.dict-letters', el), list = ui.$('.dlist', el);
    const entries = all.map(t => Object.assign({ key: t.term }, t));
    for (const t of all) for (const a of t.also) if (/^[A-Za-z0-9][A-Za-z0-9/#′'.₀-₉-]{0,9}$/.test(a) && a.toLowerCase() !== t.term.toLowerCase()) entries.push(Object.assign({}, t, { key: a, ref: t.term }));
    const sortKey = s => s.normalize('NFD').toLowerCase().replace(/^[^a-z0-9]+/, '');
    entries.sort((a, b) => sortKey(a.key).localeCompare(sortKey(b.key)));
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const card = t => '<div class="dict-e" style="--h:' + t.hue + '"><b>' + H.inline(t.key) + '</b>' +
      (t.ref ? '<span class="aka">= ' + H.inline(t.ref) + '</span>' : t.also.length ? '<span class="aka">' + t.also.map(a => H.inline(a)).join(' · ') + '</span>' : '') +
      '<p>' + H.inline(t.def) + '</p><a href="#/c/' + t.id + '">' + H.icon('right', 12) + ' ' + esc(t.title) + '</a></div>';
    const draw = () => {
      const s = norm(q.value.trim()), b = bsel.value;
      const hits = entries.filter(t => (!b || t.branch === b) && (!s || norm(t.key).includes(s) || (!t.ref && (norm(t.also.join(' ')).includes(s) || (s.length > 2 && norm(t.def).includes(s))))));
      if (s) hits.sort((a, b2) => (norm(b2.key).startsWith(s) ? 1 : 0) - (norm(a.key).startsWith(s) ? 1 : 0));
      const present = new Set(hits.map(t => letterOf({ term: t.key })));
      nav.innerHTML = LETTERS.map(L => '<a href="#L' + L + '" class="' + (present.has(L) ? '' : 'off') + '" data-l="' + L + '">' + L + '</a>').join('');
      let html = '', last = null;
      for (const t of hits) {
        const L = letterOf({ term: t.key });
        if (!s && L !== last) { html += '<h3 id="dict-' + L + '" style="margin:16px 0 6px;font-size:17px">' + L + '</h3>'; last = L; }
        html += card(t);
      }
      list.innerHTML = '<div class="dict-list" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:8px">' + (html || '<p class="muted">Nothing found.</p>') + '</div>';
      nav.querySelectorAll('a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); const h = document.getElementById('dict-' + a.dataset.l); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
    };
    q.addEventListener('input', draw); bsel.addEventListener('change', draw);
    draw();
  };

  /* ---------------------------------------------------------------- the calculators */
  const CTABS = [['boiling', 'Boiling and altitude'], ['dew', 'Dew and humidity'], ['oxygen', 'Oxygen in water'], ['salt', 'Salt and antifreeze'], ['capillary', 'Drops and capillaries'], ['heat', 'Heating and boiling off'], ['molecules', 'Counting molecules']];
  T.watercalc = function (el, params, sub) {
    const t = T.util.subtabs(el, 'watercalc', CTABS, sub, 'The numbers come from the IAPWS formulations and standard data (Kell 1975, Sander 2015, the standard atmosphere). They describe pure water or a simple solution; real tap water, sea water and air differ a little.');
    ({ boiling, dew, oxygen, salt, capillary, heat, molecules })[t.tab](t.body);
  };
  T.watercalc.tabs = CTABS.map(t => t[0]);

  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: K.colors().muted }, o));
  const degC = v => f(v, 1) + ' °C';

  /* ---- boiling: altitude or pressure → boiling point; the pressure cooker */
  function boiling(el) {
    const L = T.util.lab(el, 'Water boils when its vapour pressure reaches the pressure on it. Go up a mountain and it boils cooler; seal it in a pressure cooker and it boils hotter. Drag the altitude or set the pressure, and read the boiling point from the vapour-pressure curve.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'mode', type: 'select', label: 'Set by', options: [['Altitude (standard atmosphere)', 'alt'], ['Pressure directly', 'p']], value: 'alt' },
      { id: 'h', label: 'Altitude', min: -400, max: 9000, step: 10, value: 0, unit: 'm' },
      { id: 'p', label: 'Pressure (absolute)', min: 1, max: 2500, step: 1, value: 1013, unit: 'hPa', log: true },
      { id: 'place', type: 'select', label: 'Or pick a place', options: [['— choose —', ''], ['Dead Sea shore (−430 m)', '-430'], ['Sea level', '0'], ['Jerusalem (750 m)', '750'], ['Denver (1,600 m)', '1600'], ['Mexico City (2,240 m)', '2240'], ['La Paz (3,640 m)', '3640'], ['Everest base camp (5,360 m)', '5360'], ['Everest summit (8,849 m)', '8849']], value: '' },
      { id: 'cooker', type: 'select', label: 'Or a pressure cooker', options: [['— none —', ''], ['Low setting, +0.5 bar', '0.5'], ['Standard, +1.0 bar (15 psi)', '1.0'], ['Autoclave, +1.1 bar (121 °C)', '1.1'], ['Car radiator cap, +1.0 bar with 50 % glycol', 'glycol']], value: '' }
    ], (id, v) => {
      if (id === 'place' && v !== '') { ctl.set('mode', 'alt'); ctl.set('h', +v); ctl.set('cooker', ''); }
      if (id === 'cooker' && v !== '') { ctl.set('mode', 'p'); ctl.set('p', Math.round((101325 + (v === 'glycol' ? 1.0 : +v) * 1e5) / 100)); ctl.set('place', ''); }
      draw();
    });
    const V = ctl.values;
    const ro = K.readout(L.side, [['pa', 'Pressure'], ['bp', 'Boiling point'], ['pv', 'Vapour pressure at 20 °C'], ['egg', 'Time to cook something that takes 10 min at sea level'], ['note', '']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)', min: 0, max: 140 }, y: { label: 'vapour pressure (kPa)', min: 0, max: 400 }, legend: true }, 220);
    const curve = []; for (let Tc = 0; Tc <= 140; Tc += 1) curve.push([Tc, W.vapourPressure(Tc) / 1e3]);
    function draw() {
      const p = V.mode === 'alt' ? T.util.pAlt(V.h) : V.p * 100;
      const bp = W.boilingPoint(p) + (V.cooker === 'glycol' ? 10 : 0);
      ctl.show('h', V.mode === 'alt'); ctl.show('p', V.mode === 'p');
      ro.set('pa', f(p / 1e3, 1) + ' kPa = ' + f(p / 101325, 3) + ' atm' + (V.mode === 'alt' ? ' at ' + V.h + ' m' : ''));
      ro.set('bp', degC(bp) + (V.cooker === 'glycol' ? ' (with 50 % glycol)' : ''));
      ro.set('pv', f(W.vapourPressure(20) / 1e3, 2) + ' kPa — water evaporates at any temperature');
      // cooking: an Arrhenius rule of thumb, rate doubles per 10 K
      const rate = Math.pow(2, (bp - 100) / 10);
      ro.set('egg', f(10 / rate, 1) + ' min (rate ×' + f(rate, 2) + ', doubling per 10 °C)');
      ro.set('note', bp < 90 ? 'Tea tastes weak and pasta stays hard up here: the water is simply not hot enough.' : bp > 105 ? 'Hotter than boiling at sea level — food cooks faster, and the lid must hold the pressure.' : 'Near enough sea level.');
      plot.set({ series: [{ pts: curve, label: 'vapour pressure of water' }], marks: [{ x: bp, y: p / 1e3, label: 'boils at ' + degC(bp) }], hlines: [{ y: p / 1e3, label: 'pressure on the water' }] });
      // the stage: a thermometer in a pot and a gauge
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const px = Wd * 0.3, py = Hh * 0.22, pw = Math.min(180, Wd * 0.3), ph = Hh * 0.55;
      S.beaker(c, px, py, pw, ph, 0.7, { label: 'boiling at ' + degC(bp) });
      for (let i = 0; i < 6; i++) { const yy = py + ph - 8 - ((Date.now() / 25 + i * 37) % (ph * 0.6)); S.drop(c, px + 20 + (i * 23) % (pw - 40), yy, 4, { color: 'rgba(255,255,255,0.7)' }); }
      S.thermometer(c, px + pw + 40, py, ph, bp, { min: 0, max: 140 });
      // a gauge
      const gx = Wd * 0.78, gy = Hh * 0.45, gr = Math.min(60, Hh * 0.25);
      c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, gr, 0, Math.PI * 2); c.stroke();
      const ang = Math.PI * 0.75 + Math.PI * 1.5 * Math.min(1, p / 2.5e5);
      K.arrow(c, gx, gy, gx + gr * 0.85 * Math.cos(ang), gy + gr * 0.85 * Math.sin(ang), C.warn, 2.5);
      c.restore();
      label(c, f(p / 1e3, 0) + ' kPa', gx, gy + gr + 16, { align: 'center', color: C.text, weight: 650, size: 13 });
      label(c, V.mode === 'alt' ? V.h + ' m above sea level' : 'absolute pressure', gx, gy + gr + 32, { align: 'center' });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- dew: temperature and humidity → dew point, wet bulb, water in the air */
  function dew(el) {
    const L = T.util.lab(el, 'Air at a given temperature can hold only so much vapour. Cool it until the vapour it holds is the most it can hold and water condenses: that is the dew point. The wet-bulb temperature is how cold evaporation can make a wet surface — the limit of sweat.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Air temperature', min: -20, max: 50, step: 0.5, value: 25, unit: '°C' },
      { id: 'RH', label: 'Relative humidity', min: 1, max: 100, step: 1, value: 50, unit: '%' },
      { id: 'room', label: 'Room volume', min: 5, max: 500, step: 5, value: 50, unit: 'm³' },
      { id: 'cold', label: 'A cold surface (window, bottle)', min: -10, max: 40, step: 0.5, value: 8, unit: '°C' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['td', 'Dew point'], ['tw', 'Wet-bulb temperature'], ['ah', 'Water in the air'], ['room', 'Water in the room'], ['win', 'The cold surface'], ['feel', 'Comfort']]);
    const plot = K.plot(L.under, { x: { label: 'air temperature (°C)', min: -20, max: 50 }, y: { label: 'water vapour (g/m³)', min: 0, max: 85 }, legend: true }, 220);
    const sat = []; for (let Tc = -20; Tc <= 50; Tc += 1) sat.push([Tc, W.absoluteHumidity(Tc, 1) * 1e3]);
    function draw() {
      const Tc = V.T, rh = V.RH / 100;
      const td = W.dewPoint(Tc, rh), tw = W.wetBulb(Tc, rh), ah = W.absoluteHumidity(Tc, rh) * 1e3;
      ro.set('td', degC(td) + (td < 0 ? ' (frost point)' : ''));
      ro.set('tw', degC(tw) + (tw >= 31 ? ' — dangerous: the body can no longer shed heat' : tw >= 26 ? ' — hard work is risky' : ''));
      ro.set('ah', f(ah, 1) + ' g/m³ of ' + f(W.absoluteHumidity(Tc, 1) * 1e3, 1) + ' possible');
      ro.set('room', f(ah * V.room / 1000, 2) + ' L of water as vapour in ' + V.room + ' m³');
      ro.set('win', V.cold <= td ? 'fogs up: ' + f((ah - W.absoluteHumidity(V.cold, 1) * 1e3) * V.room / 1000, 2) + ' L would condense if all the air cooled to it' : 'stays dry (warmer than the dew point by ' + f(V.cold - td, 1) + ' K)');
      ro.set('feel', td >= 21 ? 'oppressive' : td >= 18 ? 'muggy' : td >= 13 ? 'comfortable' : td >= 5 ? 'dry' : 'very dry: static, chapped lips');
      const cool = []; for (let x = td; x <= Tc; x += 0.5) cool.push([x, ah]);
      plot.set({ series: [{ pts: sat, label: 'saturation' }, { pts: cool, label: 'cooling this air', dash: true }], marks: [{ x: Tc, y: ah, label: 'now' }, { x: td, y: ah, label: 'dew point ' + degC(td) }] });
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // a window pane with drops when fogged
      const wx = Wd * 0.1, wy = Hh * 0.12, ww = Wd * 0.45, wh = Hh * 0.72;
      c.fillStyle = V.cold <= td ? 'rgba(160,200,235,0.35)' : 'rgba(160,200,235,0.12)'; c.fillRect(wx, wy, ww, wh);
      c.strokeStyle = C.text; c.lineWidth = 3; c.strokeRect(wx, wy, ww, wh);
      c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.moveTo(wx, wy + wh / 2); c.lineTo(wx + ww, wy + wh / 2); c.stroke();
      if (V.cold <= td) { let seed = 7; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647; const n = Math.min(200, Math.round((td - V.cold) * 12 + 20)); for (let i = 0; i < n; i++) S.drop(c, wx + 6 + r() * (ww - 12), wy + 6 + r() * (wh - 12), 2 + r() * 4); }
      label(c, 'surface at ' + degC(V.cold) + (V.cold <= td ? ' — below the dew point' : ' — above the dew point'), wx + ww / 2, wy + wh + 16, { align: 'center', color: C.text });
      // the two thermometers
      S.thermometer(c, Wd * 0.7, wy, wh, Tc, { min: -20, max: 50, label: 'air ' });
      S.thermometer(c, Wd * 0.85, wy, wh, tw, { min: -20, max: 50, label: 'wet bulb ' });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- oxygen: dissolved gases */
  function oxygen(el) {
    const L = T.util.lab(el, 'Air pushes its gases into water in proportion to their partial pressures (Henry\'s law), and warm water holds less. A pond in August has a third less oxygen than in March; the sea loses oxygen as it warms; a fizzy drink goes flat when it is warm.', 0.5);
    const GASES = [['Oxygen (from air)', 'O2'], ['Nitrogen (from air)', 'N2'], ['Carbon dioxide (from air, 420 ppm)', 'CO2'], ['Carbon dioxide (fizzy drink at 3 atm)', 'CO2x'], ['Argon (from air)', 'Ar'], ['Helium (pure, 1 atm)', 'He'], ['Hydrogen (pure, 1 atm)', 'H2'], ['Methane (pure, 1 atm)', 'CH4']];
    const PART = { O2: 0.20946, N2: 0.78084, CO2: 420e-6, CO2x: 3, Ar: 0.00934, He: 1, H2: 1, CH4: 1 };
    const MASS = { O2: 32, N2: 28, CO2: 44, Ar: 40, He: 4, H2: 2, CH4: 16 };
    const ctl = K.controls(L.side, [
      { id: 'gas', type: 'select', label: 'Gas', options: GASES, value: 'O2' },
      { id: 'T', label: 'Water temperature', min: 0, max: 60, step: 0.5, value: 20, unit: '°C' },
      { id: 'S', label: 'Salinity', min: 0, max: 40, step: 1, value: 0, unit: 'g/kg' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['kh', 'Henry constant'], ['c', 'Dissolved'], ['do', 'Oxygen, as a pond would see it'], ['fish', 'Fish']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)', min: 0, max: 60 }, y: { label: 'dissolved (mg/L)', min: 0 }, legend: true }, 220);
    function conc(gas, Tc, S) { const g = gas === 'CO2x' ? 'CO2' : gas; return W.henry(g, Tc) * PART[gas] * MASS[g] * 1e3 * (1 - 0.0051 * S); }
    function draw() {
      const g = V.gas === 'CO2x' ? 'CO2' : V.gas, Tc = V.T;
      const cc = conc(V.gas, Tc, V.S);
      ro.set('kh', T.util.sci(W.henry(g, Tc), 2) + ' mol/(L·atm) at ' + degC(Tc));
      ro.set('c', f(cc, cc < 1 ? 3 : 1) + ' mg/L = ' + f(cc / MASS[g], 3) + ' mmol/L');
      const d = W.dissolvedOxygen(Tc, V.S);
      ro.set('do', f(d, 1) + ' mg/L (' + f(d / W.dissolvedOxygen(0, V.S) * 100, 0) + ' % of the 0 °C value)');
      ro.set('fish', d > 8 ? 'trout and salmon are happy' : d > 5 ? 'most fish fine; trout stressed' : d > 3 ? 'carp survive, trout die' : 'fish kill');
      const pts = [], pts2 = []; for (let x = 0; x <= 60; x += 1) { pts.push([x, conc(V.gas, x, V.S)]); pts2.push([x, W.dissolvedOxygen(x, 0)]); }
      plot.set({ series: [{ pts, label: GASES.find(gg => gg[1] === V.gas)[0] }, { pts: pts2, label: 'oxygen in fresh water', dash: true }], marks: [{ x: Tc, y: cc, label: f(cc, 1) + ' mg/L' }] });
      // the stage: a pond with as many fish as the oxygen allows, bubbles
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      c.fillStyle = 'rgba(70,150,235,0.35)'; c.fillRect(0, Hh * 0.3, Wd, Hh * 0.7);
      S.waves(c, 0, Hh * 0.3, Wd, 3, Date.now() / 600, { n: 6 });
      const nFish = Math.max(0, Math.min(12, Math.round(d / 1.2)));
      for (let i = 0; i < nFish; i++) {
        const fx = (i * 97 % Wd) * 0.9 + 20, fy = Hh * 0.45 + (i * 53 % (Hh * 0.45));
        c.fillStyle = C.warn; c.beginPath(); c.ellipse(fx, fy, 14, 6, 0, 0, Math.PI * 2); c.fill();
        c.beginPath(); c.moveTo(fx - 12, fy); c.lineTo(fx - 22, fy - 6); c.lineTo(fx - 22, fy + 6); c.closePath(); c.fill();
      }
      label(c, 'oxygen ' + f(d, 1) + ' mg/L at ' + degC(Tc) + (V.S ? ', salinity ' + V.S + ' g/kg' : ''), 12, 18, { color: C.text, size: 13, weight: 650 });
      label(c, nFish ? nFish + ' fish per unit of pond, by the oxygen' : 'no fish: too little oxygen', 12, Hh - 12);
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- salt: colligative properties */
  function salt(el) {
    const L = T.util.lab(el, 'Dissolve anything in water and it freezes lower, boils higher and pulls water through membranes harder — in proportion to how many particles are dissolved, whatever they are. Road salt, antifreeze, sea water and blood plasma are the same arithmetic.', 0.5);
    const SOL = [['Table salt NaCl (2 ions)', 'NaCl'], ['Calcium chloride CaCl₂ (3 ions)', 'CaCl2'], ['Sugar (sucrose, 1 particle)', 'sucrose'], ['Ethylene glycol (antifreeze)', 'glycol'], ['Ethanol', 'ethanol'], ['Sea water (as NaCl equivalent)', 'sea']];
    const DATA = { NaCl: { M: 58.44, i: 2 }, CaCl2: { M: 110.98, i: 3 }, sucrose: { M: 342.3, i: 1 }, glycol: { M: 62.07, i: 1 }, ethanol: { M: 46.07, i: 1 }, sea: { M: 58.44, i: 2 } };
    const ctl = K.controls(L.side, [
      { id: 'sol', type: 'select', label: 'Solute', options: SOL, value: 'NaCl' },
      { id: 'g', label: 'Grams per kg of water', min: 0, max: 600, step: 1, value: 35, unit: 'g/kg' },
      { id: 'T', label: 'Temperature (for osmotic pressure)', min: 0, max: 40, step: 1, value: 25, unit: '°C' }
    ], (id, v) => { if (id === 'sol' && v === 'sea') ctl.set('g', 35); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['m', 'Molality'], ['fp', 'Freezes at'], ['bp', 'Boils at'], ['pi', 'Osmotic pressure'], ['note', '']]);
    const plot = K.plot(L.under, { x: { label: 'grams of solute per kg of water', min: 0, max: 600 }, y: { label: 'freezing point (°C)', max: 5 }, legend: true }, 220);
    function draw() {
      const d = DATA[V.sol], m = V.g / d.M;
      const fp = -W.freezingDepression(m, d.i), bp = 100 + W.boilingElevation(m, d.i);
      const pi = W.osmoticPressure(m * (1 / (1 + V.g / 1000)) /* mol/L approx */, d.i, V.T + 273.15);
      ro.set('m', f(m, 3) + ' mol/kg × ' + d.i + ' particle' + (d.i > 1 ? 's' : '') + ' = ' + f(m * d.i, 3) + ' osmol/kg');
      ro.set('fp', degC(fp) + (V.sol === 'NaCl' && V.g > 233 ? ' — beyond the eutectic (−21.1 °C at 23.3 %): salt crystallises instead' : ''));
      ro.set('bp', degC(bp));
      ro.set('pi', f(pi / 1e5, 2) + ' bar — the pressure reverse osmosis must beat');
      ro.set('note', V.sol === 'sea' ? 'Sea water: 35 g/kg, freezes at about −1.9 °C, osmotic pressure about 27 bar.' : V.sol === 'glycol' ? 'A 50/50 mix by volume (about 1,100 g/kg) is off this scale and freezes near −37 °C; the formula is linear only when dilute.' : m * d.i > 2 ? 'Above about 2 osmol/kg the linear formula overestimates; real solutions deviate.' : '');
      const pts = []; for (let g = 0; g <= 600; g += 5) pts.push([g, -W.freezingDepression(g / d.M, d.i)]);
      plot.set({ series: [{ pts, label: 'freezing point' }], marks: [{ x: V.g, y: fp, label: degC(fp) }], hlines: [{ y: 0, label: 'pure water' }] });
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // a beaker of solution beside a thermometer and the ice line
      S.beaker(c, Wd * 0.15, Hh * 0.12, Math.min(160, Wd * 0.28), Hh * 0.7, 0.7, { label: SOL.find(s => s[1] === V.sol)[0].replace(/ \(.*/, '') + ', ' + V.g + ' g/kg', liquid: 'rgba(90,160,235,' + (0.25 + Math.min(0.5, V.g / 600)) + ')' });
      S.thermometer(c, Wd * 0.55, Hh * 0.12, Hh * 0.7, fp, { min: -40, max: 10, label: 'freezes at ' });
      S.thermometer(c, Wd * 0.8, Hh * 0.12, Hh * 0.7, bp, { min: 95, max: 115, label: 'boils at ' });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- capillary: drops, bubbles, tubes */
  function capillary(el) {
    const L = T.util.lab(el, 'The surface of water is under tension, 73 mN/m: it squeezes a drop (Laplace), lifts water up a narrow tube (Jurin), and holds up a water strider. Everything here scales with one length, 2.7 mm — the capillary length, below which surface tension beats gravity.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'r', label: 'Tube bore (radius)', min: 0.005, max: 5, step: 0.005, value: 0.5, unit: 'mm', log: true },
      { id: 'theta', label: 'Contact angle', min: 0, max: 150, step: 1, value: 0, unit: '°' },
      { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 20, unit: '°C' },
      { id: 'rd', label: 'Drop radius', min: 0.001, max: 5, step: 0.001, value: 1, unit: 'mm', log: true }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['sig', 'Surface tension'], ['h', 'Capillary rise'], ['lc', 'Capillary length'], ['dp', 'Pressure inside the drop'], ['bub', 'Inside a soap bubble of that size'], ['strider', 'A water strider\'s leg (1 mm of contact)']]);
    const plot = K.plot(L.under, { x: { label: 'tube radius (mm)', min: 0.005, max: 5, log: true }, y: { label: 'rise (mm)', min: 0.1, log: true }, legend: true }, 220);
    function draw() {
      const sig = W.surfaceTension(V.T), rho = W.density(V.T);
      const h = W.jurin(V.r * 1e-3, V.theta, sig, rho);
      ro.set('sig', f(sig * 1e3, 1) + ' mN/m at ' + degC(V.T));
      ro.set('h', (h >= 0 ? '+' : '−') + (Math.abs(h) >= 1 ? f(Math.abs(h), 2) + ' m' : f(Math.abs(h) * 1e3, 1) + ' mm') + (h < 0 ? ' (depressed: the liquid does not wet)' : ''));
      ro.set('lc', f(W.capillaryLength(V.T) * 1e3, 2) + ' mm');
      ro.set('dp', f(W.laplace(V.rd * 1e-3, sig), 0) + ' Pa above the outside');
      ro.set('bub', f(W.laplaceBubble(V.rd * 1e-3, 0.025), 0) + ' Pa (soap film at 25 mN/m, two surfaces)');
      ro.set('strider', 'supports up to ' + f(2 * sig * 1e-3 / W.g * 1e6, 0) + ' mg per mm of leg');
      const pts = []; for (let r = 0.005; r <= 5; r *= 1.15) pts.push([r, Math.max(1e-3, W.jurin(r * 1e-3, 0, sig, rho) * 1e3)]);
      plot.set({ series: [{ pts, label: 'rise for perfect wetting' }], marks: [{ x: V.r, y: Math.max(1e-3, Math.abs(h) * 1e3), label: f(Math.abs(h) * 1e3, 1) + ' mm' }] });
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // a trough with three tubes of different bores, the chosen one highlighted
      const ty = Hh * 0.75, lvl = ty - Hh * 0.12;
      c.fillStyle = 'rgba(70,150,235,0.4)'; c.fillRect(Wd * 0.05, lvl, Wd * 0.6, ty - lvl);
      c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(Wd * 0.05, Hh * 0.3, Wd * 0.6, ty - Hh * 0.3);
      const bores = [2, 0.5, 0.1];
      const scaleH = Hh * 0.5 / Math.max(0.03, W.jurin(0.1e-3, 0, sig, rho));
      bores.forEach((b, i) => {
        const x = Wd * (0.15 + 0.2 * i), w = 6 + b * 8;
        const hh = Math.min(lvl - Hh * 0.08, Math.max(-Hh * 0.1, W.jurin(b * 1e-3, V.theta, sig, rho) * scaleH));
        c.fillStyle = 'rgba(70,150,235,0.6)'; c.fillRect(x - w / 2, lvl - hh, w, hh + (ty - lvl));
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(x - w / 2, Hh * 0.08, w, ty - Hh * 0.08);
        label(c, 'r = ' + b + ' mm', x, ty + 14, { align: 'center' });
      });
      label(c, 'rise ∝ 1/r', Wd * 0.35, Hh * 0.05, { align: 'center', color: C.text });
      // the drop
      const dr = Math.min(Hh * 0.25, 12 + 30 * Math.log10(1 + V.rd * 10));
      S.drop(c, Wd * 0.82, Hh * 0.45, dr);
      label(c, 'drop r = ' + V.rd + ' mm', Wd * 0.82, Hh * 0.45 + dr + 16, { align: 'center' });
      label(c, '+' + f(W.laplace(V.rd * 1e-3, sig), 0) + ' Pa inside', Wd * 0.82, Hh * 0.45 + dr + 32, { align: 'center', color: C.text });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- heat: energy to warm, melt and boil */
  function heat(el) {
    const L = T.util.lab(el, 'From ice to steam: the heat to warm water, to melt ice (334 kJ/kg) and to boil it away (2,257 kJ/kg), and how long a heater takes. The plateaus are where the energy goes into breaking hydrogen bonds instead of raising the temperature.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'm', label: 'Mass of water', min: 0.1, max: 20, step: 0.1, value: 1.5, unit: 'kg' },
      { id: 'T1', label: 'From', min: -40, max: 150, step: 1, value: 20, unit: '°C' },
      { id: 'T2', label: 'To', min: -40, max: 150, step: 1, value: 100, unit: '°C' },
      { id: 'P', label: 'Heater (or cooler) power', min: 50, max: 10000, step: 50, value: 2000, unit: 'W' },
      { id: 'boil', label: 'Then boil away', min: 0, max: 100, step: 1, value: 0, unit: '%' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['Q', 'Heat'], ['t', 'Time at this power'], ['bo', 'Boiling off'], ['cost', 'Electricity (at 1 kWh = 1 unit)'], ['cmp', 'The same heat would warm']]);
    const plot = K.plot(L.under, { x: { label: 'heat added (kJ)', min: 0 }, y: { label: 'temperature (°C)', min: -40, max: 150 }, legend: true }, 220);
    function draw() {
      const Q = W.heatToWarm(V.m, V.T1, V.T2);
      const Qb = V.T2 >= 100 ? V.m * V.boil / 100 * 2257e3 : 0;
      ro.set('Q', f(Math.abs(Q) / 1e3, 0) + ' kJ' + (Q < 0 ? ' removed' : '') + (Qb ? ' + ' + f(Qb / 1e3, 0) + ' kJ to boil off ' + V.boil + ' %' : ''));
      const t = (Math.abs(Q) + Qb) / V.P;
      ro.set('t', t < 120 ? f(t, 0) + ' s' : t < 7200 ? f(t / 60, 1) + ' min' : f(t / 3600, 2) + ' h');
      ro.set('bo', V.T2 >= 100 ? 'at 100 °C each kilogram needs 2,257 kJ more to become steam' : 'not boiling (set "To" to 100 °C or more)');
      ro.set('cost', f((Math.abs(Q) + Qb) / 3.6e6, 3) + ' kWh');
      ro.set('cmp', f((Math.abs(Q) + Qb) / (449 * 10), 0) + ' K a 1 kg block of iron, or ' + f((Math.abs(Q) + Qb) / (1005 * 1.2 * 50), 1) + ' K the air of a 50 m³ room');
      // the heating curve from -40 to 150 at this mass, with the chosen span marked
      const pts = []; let q = 0; let Tc = -40;
      const push = () => pts.push([q / 1e3, Tc]);
      push();
      for (; Tc < 0; Tc += 2) { q += V.m * 2050 * 2; push(); }
      Tc = 0; push(); q += V.m * W.LATENT_FUSION; push();
      for (; Tc < 100; Tc += 2) { q += V.m * W.heatCapacity(Tc) * 2; push(); }
      Tc = 100; push(); q += V.m * 2257e3; push();
      for (; Tc < 150; Tc += 2) { q += V.m * 2010 * 2; push(); }
      const qa = W.heatToWarm(V.m, -40, Math.min(V.T1, V.T2)) / 1e3, qb = W.heatToWarm(V.m, -40, Math.max(V.T1, V.T2)) / 1e3;
      plot.set({ series: [{ pts, label: V.m + ' kg: ice → water → steam' }], vlines: [{ x: qa, label: degC(Math.min(V.T1, V.T2)) }, { x: qb, label: degC(Math.max(V.T1, V.T2)) }], x: { label: 'heat added (kJ)', min: 0, max: pts[pts.length - 1][0] } });
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // three states: ice block, beaker, steam, with the heat arrows
      const y = Hh * 0.2, hh = Hh * 0.55;
      c.fillStyle = 'rgba(210,235,255,0.9)'; c.strokeStyle = C.text; c.lineWidth = 1.5;
      c.fillRect(Wd * 0.08, y + hh * 0.3, Wd * 0.16, hh * 0.6); c.strokeRect(Wd * 0.08, y + hh * 0.3, Wd * 0.16, hh * 0.6);
      label(c, 'ice', Wd * 0.16, y + hh + 16, { align: 'center', color: C.text });
      S.beaker(c, Wd * 0.4, y, Wd * 0.18, hh, 0.7, { label: 'water' });
      for (let i = 0; i < 4; i++) label(c, '~', Wd * (0.76 + 0.05 * i), y + hh * 0.5 - 10 * Math.sin(Date.now() / 300 + i), { size: 22, color: C.muted, align: 'center' });
      label(c, 'steam', Wd * 0.84, y + hh + 16, { align: 'center', color: C.text });
      K.arrow(c, Wd * 0.26, y + hh * 0.6, Wd * 0.38, y + hh * 0.6, C.warn, 2);
      label(c, f(V.m * W.LATENT_FUSION / 1e3, 0) + ' kJ to melt', Wd * 0.32, y + hh * 0.6 - 10, { align: 'center', color: C.warn });
      K.arrow(c, Wd * 0.6, y + hh * 0.6, Wd * 0.72, y + hh * 0.6, C.bad, 2);
      label(c, f(V.m * 2257e3 / 1e3, 0) + ' kJ to boil', Wd * 0.66, y + hh * 0.6 - 10, { align: 'center', color: C.bad });
      label(c, f(V.m * 4184 * 100 / 1e3, 0) + ' kJ to warm 0 → 100 °C', Wd * 0.49, y - 8, { align: 'center', color: C.text });
    }
    L.st.onResize(draw);
    draw();
  }

  /* ---- molecules: how many */
  function molecules(el) {
    const L = T.util.lab(el, 'A drop of water holds more molecules than there are stars in the observable universe. Count them, and see what the numbers mean: how fast they move, how far apart they sit, how many are ions at any instant.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'V', label: 'Volume of water', min: 1e-6, max: 1e6, step: 1e-6, value: 0.25, unit: 'L', log: true },
      { id: 'thing', type: 'select', label: 'Or pick', options: [['— choose —', ''], ['A drop (0.05 mL)', '5e-5'], ['A teaspoon (5 mL)', '5e-3'], ['A glass (250 mL)', '0.25'], ['A bath (150 L)', '150'], ['A person (42 L)', '42'], ['An Olympic pool (2,500 m³)', '2.5e6']], value: '' },
      { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 25, unit: '°C' }
    ], (id, v) => { if (id === 'thing' && v !== '') ctl.set('V', +v); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['n', 'Molecules'], ['mol', 'Moles'], ['ions', 'Of which H₃O⁺ (and as many OH⁻)'], ['spacing', 'Average spacing'], ['speed', 'Mean speed, as vapour'], ['bonds', 'Hydrogen bonds breaking per second']]);
    function draw() {
      const m = V.V * 1e-3 * W.density(V.T);
      const n = W.molecules(m);
      ro.set('n', T.util.sci(n, 2) + ' (' + (n > 1e23 ? 'more than the stars in the observable universe, about 10²³' : n > 1e22 ? 'a tenth of the stars in the observable universe' : 'about ' + T.util.sci(n / 1e11, 1) + ' Milky Ways of stars') + ')');
      ro.set('mol', f(m * 1e3 / W.M, 3) + ' mol (' + f(m * 1e3, 1) + ' g)');
      ro.set('ions', T.util.sci(n * W.ionFraction(V.T), 2) + ' — ' + T.util.sci(W.ionFraction(V.T), 1) + ' of them');
      ro.set('spacing', f(Math.cbrt(1 / (W.moleculesPerLitre(V.T) * 1e3)) * 1e10, 2) + ' Å centre to centre');
      ro.set('speed', f(W.meanSpeed(V.T), 0) + ' m/s');
      ro.set('bonds', T.util.sci(n * W.hbondsPerMolecule(V.T) / 2 / W.hbondLifetime(V.T), 1) + ' per second');
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // a drop, then a magnifier full of molecules
      S.drop(c, Wd * 0.22, Hh * 0.5, Math.min(Hh * 0.3, 70));
      c.save(); c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(Wd * 0.3, Hh * 0.35); c.lineTo(Wd * 0.5, Hh * 0.1); c.moveTo(Wd * 0.3, Hh * 0.65); c.lineTo(Wd * 0.5, Hh * 0.9); c.stroke(); c.restore();
      c.save(); c.beginPath(); c.rect(Wd * 0.5, Hh * 0.1, Wd * 0.45, Hh * 0.8); c.clip();
      c.fillStyle = C.surface; c.fillRect(Wd * 0.5, Hh * 0.1, Wd * 0.45, Hh * 0.8);
      let seed = 3; const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const sc = Math.max(9, Math.min(14, Hh / 28));
      for (let i = 0; i < 60; i++) S.molecule(c, Wd * 0.5 + r() * Wd * 0.45, Hh * 0.1 + r() * Hh * 0.8, { angle: r() * 6.28, scale: sc });
      c.restore();
      c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(Wd * 0.5, Hh * 0.1, Wd * 0.45, Hh * 0.8);
      label(c, 'about 3 nm across: 60 of the ' + T.util.sci(n, 1), Wd * 0.725, Hh * 0.95, { align: 'center', color: C.text });
      label(c, V.V >= 1 ? f(V.V, 2) + ' L' : f(V.V * 1e3, 2) + ' mL', Wd * 0.22, Hh * 0.5 + Math.min(Hh * 0.3, 70) + 16, { align: 'center', color: C.text, weight: 650, size: 13 });
    }
    L.st.onResize(draw);
    draw();
  }
})();
