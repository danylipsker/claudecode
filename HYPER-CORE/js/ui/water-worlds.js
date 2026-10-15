/* HYPER-CORE · ui/water-worlds.js — Tools → Water worlds (#/tools/worlds/<inventory|deuterium|earth|zone>)
 *
 *   inventory  how much water each world holds, on a logarithmic bar chart: Earth's oceans beside Europa, Ganymede,
 *              Titan, Enceladus, Mars, the Moon, a comet and the quasar reservoir, with the ocean share where known
 *   deuterium  the deuterium clock: D/H of the oceans, the planets, the giants, comets of both families, meteorites
 *              and interstellar water on one logarithmic scale, with the band that matches Earth
 *   earth      Earth's water: where it is (nested bars), the cycle's fluxes and residence times, and what the heat
 *              capacity of the ocean means next to the atmosphere
 *   zone       the habitable zone and the snow line for a star of any luminosity, with the planets placed, and the
 *              equilibrium temperature of a world at a chosen distance
 *
 * The physics and data are kit.water (water.js); shared helpers T.util (watertools.js).
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, W = H.water, S = H.wsym;
  const T = H.waterTools = H.waterTools || {};
  const f = T.util.f, sci = T.util.sci;
  const TABS = [['inventory', 'Water on other worlds'], ['deuterium', 'The deuterium clock'], ['earth', 'Earth\'s water'], ['zone', 'Habitable zone and snow line']];

  T.worlds = function (el, params, sub) {
    const t = T.util.subtabs(el, 'worlds', TABS, sub, 'Inventories of other worlds are estimates from their mass, density and gravity fields (Galileo, Cassini, Dawn, New Horizons) and can be wrong by a factor of two; D/H values are the published measurements with their sources; Earth\'s inventory follows the USGS.');
    ({ inventory, deuterium, earth, zone })[t.tab](t.body, params);
  };
  T.worlds.tabs = TABS.map(t => t[0]);

  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: K.colors().muted }, o));
  const more = ids => '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ids.map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';

  /* ================================================================ inventory */
  function inventory(el) {
    const L = T.util.lab(el, 'Each bar is the water a world holds, as ice and liquid, on a logarithmic scale — every step to the right is ten times more. Earth\'s oceans are not the largest in the Solar System: three of Jupiter\'s and Saturn\'s moons hold more, under their ice. Click a bar.', 0.62, { minH: 360 });
    const ctl = K.controls(L.side, [
      { id: 'what', type: 'select', label: 'Show', options: [['All water (ice and liquid)', 'all'], ['Liquid oceans only (where known)', 'ocean']], value: 'all' },
      { id: 'unit', type: 'select', label: 'In', options: [['km³', 'km3'], ['Earth oceans', 'eo'], ['kilograms', 'kg']], value: 'km3' },
      { id: 'quasar', type: 'check', label: 'Include the quasar reservoir', value: false }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['w', 'World'], ['v', 'Water'], ['o', 'Liquid ocean'], ['d', 'Ocean depth'], ['n', 'Note'], ['src', 'Source']]);
    let sel = 'earth';
    const rows = () => W.WORLDS.filter(w => V.quasar || w.id !== 'quasar').filter(w => V.what === 'all' || Number.isFinite(w.ocean));
    const val = w => V.what === 'all' ? w.km3 : w.ocean;
    const conv = v => V.unit === 'km3' ? v : V.unit === 'eo' ? v / W.EARTH.oceans : v * 1e12;
    const unitName = () => V.unit === 'km3' ? 'km³' : V.unit === 'eo' ? 'Earth oceans' : 'kg';
    K.click(L.st, p => { const g = geom(); const a = rows(); const i = Math.floor((p.y - g.y0) / ((g.y1 - g.y0) / a.length)); if (a[i]) { sel = a[i].id; draw(); } }, p => true);
    const geom = () => ({ x0: 150, y0: 14, x1: L.st.W - 20, y1: L.st.H - 30 });
    function draw() {
      const c = L.st.begin(), C = K.colors(), g = geom(), a = rows();
      const lmin = -0.5, lmax = Math.log10(Math.max(...a.map(w => conv(val(w))))) + 0.3;
      const bh = (g.y1 - g.y0) / a.length;
      const toX = v => g.x0 + (Math.log10(Math.max(1e-3, v)) - lmin) / (lmax - lmin) * (g.x1 - g.x0);
      for (let e = Math.ceil(lmin); e <= lmax; e++) { const x = toX(Math.pow(10, e)); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke(); label(c, '10' + String(e).replace(/-/g, '⁻').replace(/\d/g, ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]), x, g.y1 + 6, { align: 'center', baseline: 'top', size: 10 }); }
      label(c, unitName() + ' (log scale)', g.x1, g.y1 + 18, { align: 'right', baseline: 'top', size: 10.5 });
      a.forEach((w, i) => {
        const y = g.y0 + i * bh, v = conv(val(w));
        const on = w.id === sel;
        c.fillStyle = on ? C.accent : w.id === 'earth' ? K.hue(150) : Number.isFinite(w.ocean) ? K.hue(212, 0.7) : C.muted;
        c.fillRect(g.x0, y + 3, Math.max(2, toX(v) - g.x0), bh - 6);
        if (V.what === 'all' && Number.isFinite(w.ocean)) { c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(g.x0, y + 3, Math.max(2, toX(conv(w.ocean)) - g.x0), bh - 6); }
        label(c, w.name, g.x0 - 6, y + bh / 2, { align: 'right', baseline: 'middle', color: on ? C.text : C.muted, size: bh > 22 ? 11.5 : 10, weight: on ? 650 : 400 });
        label(c, V.unit === 'eo' ? f(v, v < 1 ? 3 : 1) : sci(v, 1), toX(v) + 5, y + bh / 2, { baseline: 'middle', size: 10.5, color: C.text });
      });
      if (V.what === 'all') label(c, 'lighter part of a bar: the liquid ocean', g.x0, g.y0 - 2, { size: 10.5, baseline: 'bottom' });
      const w = W.WORLDS.find(x => x.id === sel) || W.WORLDS[0];
      ro.set('w', w.name);
      ro.set('v', sci(w.km3, 2) + ' km³ = ' + f(w.km3 / W.EARTH.oceans, w.km3 / W.EARTH.oceans < 0.01 ? 6 : 2) + ' Earth oceans');
      ro.set('o', Number.isFinite(w.ocean) ? sci(w.ocean, 2) + ' km³ (' + f(w.ocean / W.EARTH.oceans, 2) + ' Earth oceans)' : 'none known, or not liquid');
      ro.set('d', Number.isFinite(w.depth) ? 'about ' + w.depth + ' km' : '—');
      ro.set('n', w.note);
      ro.set('src', w.src);
    }
    L.st.onResize(draw);
    draw();
    L.under.innerHTML = more(['the-largest-reservoir', 'europa', 'enceladus', 'titan', 'ganymede-and-callisto', 'how-much-water-earth-has', 'the-moon-and-mars']);
  }

  /* ================================================================ deuterium */
  function deuterium(el) {
    const L = T.util.lab(el, 'One hydrogen in 6,400 in the sea is deuterium. Water made in the cold of interstellar space carries more; the Sun\'s raw gas carries far less. Each body\'s D/H is a fingerprint of where its water was made — and the bodies that match Earth are the ones that could have brought the oceans.', 0.62, { minH: 360 });
    const KINDS = [['standard', 'Earth\'s oceans'], ['giant', 'protosolar gas and the giant planets'], ['planet', 'rocky planets'], ['moon', 'moons'], ['oort', 'Oort-cloud comets'], ['jfc', 'Jupiter-family comets'], ['meteorite', 'meteorites'], ['ism', 'interstellar water']];
    const ctl = K.controls(L.side, [
      { id: 'scale', type: 'select', label: 'Scale', options: [['D/H, logarithmic', 'log'], ['Relative to Earth (×VSMOW)', 'rel'], ['δD in ‰', 'delta']], value: 'log' },
      { id: 'band', type: 'check', label: 'Shade the Earth-like band (±25 %)', value: true }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['b', 'Body'], ['dh', 'D/H'], ['rel', 'Relative to Earth'], ['dd', 'δD'], ['src', 'Measured by']]);
    let sel = '67p';
    const geom = () => ({ x0: 170, y0: 14, x1: L.st.W - 16, y1: L.st.H - 30 });
    K.click(L.st, p => { const g = geom(); const i = Math.floor((p.y - g.y0) / ((g.y1 - g.y0) / W.DH.length)); if (W.DH[i]) { sel = W.DH[i].id; draw(); } }, p => true);
    const kindHue = k => ({ standard: 150, giant: 40, planet: 20, moon: 280, oort: 212, jfc: 190, meteorite: 90, ism: 330 })[k] || 0;
    function draw() {
      const c = L.st.begin(), C = K.colors(), g = geom();
      const a = W.DH, bh = (g.y1 - g.y0) / a.length;
      const xf = V.scale === 'log' ? d => Math.log10(d) : V.scale === 'rel' ? d => d / W.VSMOW : d => (d / W.VSMOW - 1) * 1000;
      const xs = a.map(d => xf(d.dh));
      const xmin = V.scale === 'log' ? -5.1 : V.scale === 'rel' ? 0 : -1000, xmax = V.scale === 'log' ? -1.6 : V.scale === 'rel' ? 22 : 20000;
      const toX = v => g.x0 + (Math.max(xmin, Math.min(xmax, v)) - xmin) / (xmax - xmin) * (g.x1 - g.x0);
      if (V.band) { c.fillStyle = K.hue(150, 0.18); c.fillRect(toX(xf(W.VSMOW * 0.75)), g.y0, toX(xf(W.VSMOW * 1.25)) - toX(xf(W.VSMOW * 0.75)), g.y1 - g.y0); }
      const ticks = V.scale === 'log' ? [-5, -4, -3, -2] : V.scale === 'rel' ? [0, 1, 2, 3, 5, 10, 20] : [-1000, 0, 1000, 5000, 10000, 20000];
      for (const tv of ticks) { const x = toX(tv); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke(); label(c, V.scale === 'log' ? '10' + String(tv).replace(/-/g, '⁻').replace(/\d/g, ch => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+ch]) : V.scale === 'rel' ? tv + '×' : tv + ' ‰', x, g.y1 + 6, { align: 'center', baseline: 'top', size: 10 }); }
      const xe = toX(xf(W.VSMOW)); c.strokeStyle = K.hue(150); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(xe, g.y0); c.lineTo(xe, g.y1); c.stroke(); c.setLineDash([]);
      a.forEach((d, i) => {
        const y = g.y0 + i * bh + bh / 2, x = toX(xs[i]), on = d.id === sel;
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(x, y); c.stroke();
        K.dot(c, x, y, on ? 7 : 5, K.hue(kindHue(d.kind)), on ? C.text : null);
        label(c, d.name, g.x0 - 6, y, { align: 'right', baseline: 'middle', color: on ? C.text : C.muted, size: bh > 20 ? 11 : 9.5, weight: on ? 650 : 400 });
        if (d.dh > xmax && V.scale !== 'log') label(c, '→', x + 8, y, { baseline: 'middle', color: C.warn });
      });
      // legend
      let lx = g.x0; KINDS.forEach(([k, n]) => { K.dot(c, lx + 5, g.y0 - 4, 4, K.hue(kindHue(k))); label(c, n, lx + 12, g.y0 - 4, { baseline: 'middle', size: 9.5 }); lx += 12 + n.length * 5.3 + 10; });
      const d = a.find(x => x.id === sel) || a[0];
      ro.set('b', d.name);
      ro.set('dh', sci(d.dh, 2));
      ro.set('rel', f(d.dh / W.VSMOW, 2) + '× the oceans' + (Math.abs(d.dh / W.VSMOW - 1) < 0.25 ? ' — Earth-like' : d.dh > W.VSMOW ? ' — heavier: made colder, or lost hydrogen' : ' — lighter: the Sun\'s raw gas'));
      ro.set('dd', ((d.dh / W.VSMOW - 1) * 1000 >= 0 ? '+' : '−') + f(Math.abs((d.dh / W.VSMOW - 1) * 1000), 0) + ' ‰');
      ro.set('src', d.src);
    }
    L.st.onResize(draw);
    draw();
    L.under.innerHTML = more(['the-deuterium-clock', 'water-older-than-the-sun', 'comets-asteroids-and-earths-water', 'earth-may-always-have-been-wet', 'venus-lost-its-ocean', 'isotopes-and-heavy-water']);
  }

  /* ================================================================ Earth's water */
  function earth(el) {
    const L = T.util.lab(el, 'All the water of the Earth, where it is, and how it moves. The oceans hold 96.5 %; of the 2.5 % that is fresh, two-thirds is ice and most of the rest is underground. A molecule spends nine days in the air, a few thousand years in the sea.', 0.62, { minH: 360 });
    const E = W.EARTH;
    const ctl = K.controls(L.side, [
      { id: 'view', type: 'select', label: 'Show', options: [['Where the water is', 'where'], ['The cycle: fluxes and residence times', 'cycle'], ['Ocean against atmosphere (heat)', 'heat']], value: 'where' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['a', 'All water'], ['b', 'Fresh water'], ['c', 'In the air right now'], ['d', 'As a sphere'], ['e', 'Share of the Earth\'s mass']]);
    ro.set('a', sci(E.totalWater, 3) + ' km³');
    ro.set('b', sci(E.fresh, 2) + ' km³ (' + f(E.fresh / E.totalWater * 100, 1) + ' %), ' + f(E.icecaps / E.fresh * 100, 1) + ' % of it ice');
    ro.set('c', sci(E.atmosphere, 2) + ' km³ — ' + f(E.atmosphere / (E.flux.oceanEvap + E.flux.landEvap) * 365, 0) + ' days\' worth of rain');
    ro.set('d', f(Math.cbrt(E.totalWater * 3 / (4 * Math.PI)) * 2, 0) + ' km across — a tenth of the Earth\'s diameter');
    ro.set('e', f(W.oceanFractionOfEarth() * 100, 3) + ' %');
    function draw() {
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      if (V.view === 'where') {
        // nested bars: all → fresh → surface fresh
        const rowsA = [['Oceans and seas', E.oceans], ['Ice caps and glaciers', E.icecaps], ['Groundwater', E.groundwater], ['Lakes, soil, air, rivers, life', E.lakes + E.soil + E.atmosphere + E.rivers + E.biological + E.swamps + E.permafrost]];
        const rowsB = [['Ice caps and glaciers', E.icecaps], ['Fresh groundwater', E.groundwaterFresh], ['Permafrost', E.permafrost], ['Fresh lakes', E.lakesFresh], ['Soil moisture', E.soil], ['Atmosphere', E.atmosphere], ['Swamps', E.swamps], ['Rivers', E.rivers], ['Living things', E.biological]];
        const bar = (x, y, w, h, rows, total, title) => {
          label(c, title, x, y - 6, { color: C.text, size: 12, weight: 650 });
          let cx = x;
          rows.forEach(([n, v], i) => { const ww = v / total * w; c.fillStyle = K.hue(200 + i * 25, 0.85); c.fillRect(cx, y, Math.max(1, ww), h); if (ww > 60) label(c, n + ' ' + f(v / total * 100, 1) + ' %', cx + 6, y + h / 2, { baseline: 'middle', color: '#fff', size: 11 }); cx += ww; });
          c.strokeStyle = C.axis; c.strokeRect(x, y, w, h);
        };
        bar(20, 30, Wd - 40, 46, rowsA, E.totalWater, 'all water, ' + sci(E.totalWater, 2) + ' km³');
        bar(20, 120, Wd - 40, 46, rowsB, rowsB.reduce((s, r) => s + r[1], 0), 'fresh water only, ' + sci(E.fresh, 2) + ' km³ (the thin slice at the right above)');
        c.strokeStyle = C.muted; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(20 + (E.oceans / E.totalWater) * (Wd - 40), 76); c.lineTo(20, 120); c.moveTo(Wd - 20, 76); c.lineTo(Wd - 20, 120); c.stroke(); c.setLineDash([]);
        let y = 190;
        rowsB.forEach(([n, v]) => { label(c, n, 24, y, { color: C.text, size: 11.5 }); label(c, sci(v, 2) + ' km³', 230, y, { size: 11.5 }); label(c, f(v / E.fresh * 100, v / E.fresh < 0.001 ? 3 : 1) + ' % of fresh', 340, y, { size: 11.5 }); y += 16; if (y > Hh - 10) return; });
      } else if (V.view === 'cycle') {
        const F = E.flux;
        const seaX = Wd * 0.3, landX = Wd * 0.72, gy = Hh * 0.62;
        c.fillStyle = 'rgba(70,150,235,0.4)'; c.fillRect(0, gy, Wd * 0.52, Hh - gy);
        c.fillStyle = K.hue(95, 0.5); c.fillRect(Wd * 0.52, gy - 30, Wd * 0.48, Hh - gy + 30);
        const arrowUp = (x, dy, txt, col) => { K.arrow(c, x, gy - 10, x, gy - 10 - dy, col, 2.5); label(c, txt, x + 6, gy - 10 - dy / 2, { baseline: 'middle', size: 11, color: C.text }); };
        const arrowDown = (x, dy, txt, col) => { K.arrow(c, x, gy - 10 - dy, x, gy - 10, col, 2.5); label(c, txt, x + 6, gy - 10 - dy / 2, { baseline: 'middle', size: 11, color: C.text }); };
        arrowUp(seaX - 50, Hh * 0.4, 'evaporation ' + sci(F.oceanEvap, 2) + ' km³/yr', C.warn);
        arrowDown(seaX + 50, Hh * 0.3, 'rain on the sea ' + sci(F.oceanPrecip, 2), C.accent);
        arrowUp(landX - 50, Hh * 0.25, 'evaporation and transpiration ' + sci(F.landEvap, 2), C.warn);
        arrowDown(landX + 50, Hh * 0.4, 'rain and snow on land ' + sci(F.landPrecip, 2), C.accent);
        K.arrow(c, Wd * 0.8, gy + 20, Wd * 0.45, gy + 20, C.accent, 2.5);
        label(c, 'rivers and groundwater to the sea ' + sci(F.runoff, 2) + ' km³/yr', Wd * 0.6, gy + 36, { align: 'center', size: 11, color: C.text });
        K.arrow(c, seaX + 10, 26, landX - 60, 26, C.muted, 2);
        label(c, 'vapour carried over land ' + sci(F.oceanEvap - F.oceanPrecip, 2) + ' km³/yr', (seaX + landX) / 2 - 20, 14, { align: 'center', size: 11, color: C.text });
        label(c, 'ocean', seaX, gy + 70, { align: 'center', color: '#fff', size: 14, weight: 650 });
        label(c, 'land', landX, gy + 70, { align: 'center', color: '#fff', size: 14, weight: 650 });
        let y = Hh - 100;
        const R = E.residence;
        for (const [n, v] of [['in the air', R.atmosphere], ['in rivers', R.rivers], ['in soil', R.soil], ['in lakes', R.lakes], ['in groundwater', R.groundwater], ['in the ocean', R.oceans], ['in ice caps', R.icecaps]]) { label(c, 'a molecule stays ' + n + ' about ' + (v < 1 ? f(v * 365, 0) + ' days' : f(v, 0) + ' years'), 12, y, { size: 10.5, color: C.text }); y += 13; }
      } else {
        // heat: a column of sea beside a column of air, scaled by heat capacity
        const hSea = W.oceanLayerEqualToAtmosphere();
        const colW = Wd * 0.18, baseY = Hh - 40;
        const airH = Hh * 0.75;
        c.fillStyle = 'rgba(180,200,230,0.35)'; c.fillRect(Wd * 0.25 - colW / 2, baseY - airH, colW, airH);
        label(c, 'the whole atmosphere', Wd * 0.25, baseY - airH - 10, { align: 'center', color: C.text, size: 12, weight: 650 });
        label(c, '5.15 × 10¹⁸ kg × 1,005 J/(kg·K)', Wd * 0.25, baseY + 14, { align: 'center', size: 11 });
        label(c, '= 5.2 × 10²¹ J/K', Wd * 0.25, baseY + 28, { align: 'center', size: 11, color: C.text });
        const seaH = Hh * 0.08;
        c.fillStyle = 'rgba(70,150,235,0.6)'; c.fillRect(Wd * 0.65 - colW / 2, baseY - seaH, colW, seaH);
        label(c, 'the top ' + f(hSea, 1) + ' m of the ocean', Wd * 0.65, baseY - seaH - 10, { align: 'center', color: C.text, size: 12, weight: 650 });
        label(c, 'same heat capacity', Wd * 0.65, baseY - seaH - 24, { align: 'center', size: 11 });
        label(c, 'the whole ocean, 3,700 m deep, holds ' + f(E.oceanMass * E.cpSeawater / (E.atmosphereMass * E.cpAir), 0) + '× the atmosphere\'s heat', Wd * 0.5, 20, { align: 'center', color: C.text, size: 12 });
        label(c, 'it has taken up about 90 % of the energy the Earth has gained since 1970', Wd * 0.5, 38, { align: 'center', size: 11 });
      }
    }
    L.st.onResize(draw);
    draw();
    L.under.innerHTML = more(['how-much-water-earth-has', 'the-water-cycle', 'oceans-as-a-heat-reservoir', 'specific-heat-of-water', 'rivers-and-groundwater']);
  }

  /* ================================================================ habitable zone */
  function zone(el) {
    const L = T.util.lab(el, 'Liquid water on a surface needs the right distance from the right star. The green band is the habitable zone; the dotted line the snow line, beyond which ice survived in the young disk and the giant planets and comets were built. Turn the star\'s luminosity up or down and watch both move — as the square root.', 0.55);
    const ctl = K.controls(L.side, [
      { id: 'L', label: 'Star luminosity', min: 0.001, max: 100, step: 0.001, value: 1, unit: 'L☉', log: true },
      { id: 'star', type: 'select', label: 'Or a star', options: [['— pick —', ''], ['Proxima Centauri (0.0017)', '0.0017'], ['TRAPPIST-1 (0.00055)', '0.00055'], ['Gliese 581 (0.013)', '0.013'], ['The Sun, young (0.7)', '0.7'], ['The Sun today (1)', '1'], ['The Sun in 5 Gyr (2)', '2'], ['Sirius A (25)', '25']], value: '' },
      { id: 'd', label: 'A world at', min: 0.01, max: 50, step: 0.01, value: 1, unit: 'AU', log: true },
      { id: 'alb', label: 'Its albedo', min: 0, max: 0.9, step: 0.05, value: 0.3 },
      { id: 'gh', label: 'Greenhouse warming', min: 0, max: 500, step: 5, value: 33, unit: 'K' }
    ], (id, v) => { if (id === 'star' && v) ctl.set('L', +v); draw(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['hz', 'Habitable zone'], ['snow', 'Snow line'], ['teq', 'Equilibrium temperature of the world'], ['ts', 'Its surface, with the greenhouse'], ['state', 'Water there']]);
    const PL = [['Mercury', 0.39], ['Venus', 0.72], ['Earth', 1], ['Mars', 1.52], ['Ceres', 2.77], ['Jupiter', 5.2], ['Saturn', 9.5], ['Uranus', 19.2], ['Neptune', 30.1]];
    function draw() {
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const hz = W.habitableZone(V.L), sn = W.snowLine(V.L);
      const g = { x0: 40, x1: Wd - 20, y: Hh * 0.55 };
      const dmin = 0.01, dmax = 50;
      const toX = d => g.x0 + (Math.log10(d) - Math.log10(dmin)) / (Math.log10(dmax) - Math.log10(dmin)) * (g.x1 - g.x0);
      // the star
      const sr = 8 + 10 * Math.log10(1 + V.L * 10);
      c.fillStyle = V.L < 0.05 ? '#e0603a' : V.L < 0.5 ? '#f0a040' : V.L < 5 ? '#f8e060' : '#cfe8ff'; c.beginPath(); c.arc(g.x0 - 10, g.y, Math.min(sr, 30), 0, 6.283); c.fill();
      c.fillStyle = K.hue(150, 0.3); c.fillRect(toX(hz.inner), g.y - 40, toX(hz.outer) - toX(hz.inner), 80);
      label(c, 'habitable zone', (toX(hz.inner) + toX(hz.outer)) / 2, g.y - 48, { align: 'center', color: K.hue(150), weight: 650 });
      c.strokeStyle = C.accent; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(toX(sn), g.y - 60); c.lineTo(toX(sn), g.y + 60); c.stroke(); c.setLineDash([]);
      label(c, 'snow line ' + f(sn, 2) + ' AU', toX(sn) + 4, g.y - 56, { color: C.accent });
      c.strokeStyle = C.axis; c.beginPath(); c.moveTo(g.x0, g.y); c.lineTo(g.x1, g.y); c.stroke();
      for (const d of [0.01, 0.1, 1, 10]) { label(c, d + ' AU', toX(d), g.y + 66, { align: 'center' }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(toX(d), g.y + 60); c.lineTo(toX(d), g.y + 50); c.stroke(); }
      PL.forEach(([n, d], i) => { K.dot(c, toX(d), g.y, 4, C.muted); label(c, n, toX(d), g.y + 12 + (i % 2) * 12, { align: 'center', size: 10 }); });
      K.dot(c, toX(V.d), g.y, 7, C.warn, '#fff');
      label(c, 'your world', toX(V.d), g.y - 14, { align: 'center', color: C.warn, weight: 650 });
      const teq = W.equilibriumTemperature(V.L, V.d, V.alb), ts = teq + V.gh;
      ro.set('hz', f(hz.inner, 3) + ' – ' + f(hz.outer, 3) + ' AU (conservative, Kopparapu 2013 scaled)');
      ro.set('snow', f(sn, 3) + ' AU');
      ro.set('teq', f(teq, 0) + ' K = ' + f(teq - 273.15, 0) + ' °C (no atmosphere)');
      ro.set('ts', f(ts, 0) + ' K = ' + f(ts - 273.15, 0) + ' °C');
      ro.set('state', ts < 273 ? 'frozen' : ts > 373 ? 'boils away (or a runaway greenhouse)' : 'liquid on the surface');
      label(c, 'luminosity ' + V.L + ' L☉ · a world at ' + V.d + ' AU with albedo ' + V.alb + ': ' + f(ts - 273.15, 0) + ' °C', Wd / 2, 18, { align: 'center', color: C.text, size: 12.5 });
    }
    L.st.onResize(draw);
    draw();
    L.under.innerHTML = more(['the-habitable-zone', 'the-snow-line', 'venus-lost-its-ocean', 'water-worlds-around-other-stars', 'tidal-heating']);
  }
})();
