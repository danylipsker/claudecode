/* HYPER-WATER · sims/the-water-cycle-and-climate.js — the simulations of the topic "The water cycle and climate".
 *   cyc-reservoirs      where the water is (drill into nested squares), the planet drawn as spheres, and the cycle as a flow network
 *   cyc-psychrometer    temperature and relative humidity -> dew point, wet bulb, the water in a room (a psychrometric chart)
 *   cyc-droplet-growth  condensation against collision against ice crystals; the Köhler curve (local models, schematic)
 *   cyc-vapour-feedback the greenhouse feedback loop of water vapour, as a series of round trips (feedback-parameter model)
 *   cyc-overturning     a tank with a warm end and a cold, salted end: a density-driven loop (two-box Stommel-type model, schematic)
 *   cyc-ice-albedo      the energy balance of a planet (or a patch of the Arctic) with an ice fraction: albedo, feedback, hysteresis
 *   cyc-tides           Earth, Moon and Sun from above: the tidal bulge, the tide at a place, spring and neap (equilibrium tide)
 *   cyc-aquifer         a cross-section of an aquifer with a pumped well: Darcy's law, the water table, recharge and depletion
 * Numbers come from kit.water (water.js) wherever it has them; the local models are labelled in each blurb.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const nf = (v, d) => Number.isFinite(v) ? v.toLocaleString('en-GB', { maximumFractionDigits: d == null ? 0 : d, minimumFractionDigits: 0 }) : '—';
  const sig = (v, n) => Number.isFinite(v) ? (v === 0 ? '0' : Number(v.toPrecision(n || 3)).toLocaleString('en-GB', { maximumFractionDigits: 12 })) : '—';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* "9 days", "3,200 years" */
  const span = (yr) => {
    if (!Number.isFinite(yr)) return '—';
    if (yr < 1 / 365) return nf(yr * 365 * 24, 0) + ' hours';
    if (yr < 0.1) return nf(yr * 365, 0) + ' days';
    if (yr < 1) return nf(yr * 12, 1) + ' months';
    if (yr < 10) return nf(yr, 1) + ' years';
    return nf(yr, 0) + ' years';
  };
  const vol = (km3) => km3 >= 1e9 ? nf(km3 / 1e9, 3) + ' billion km³' : km3 >= 1e6 ? nf(km3 / 1e6, 2) + ' million km³' : nf(km3, 0) + ' km³';
  /* the words of a caption, broken into lines no wider than maxW pixels */
  const wrapLines = (c, text, maxW, size) => {
    c.save(); c.font = '500 ' + (size || 11) + 'px system-ui, sans-serif';
    const words = String(text).split(' '), lines = []; let cur = '';
    for (const w of words) { const t = cur ? cur + ' ' + w : w; if (cur && c.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t; }
    if (cur) lines.push(cur); c.restore(); return lines;
  };
  const roundRect = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); };

  /* ================================================================ where the water is, and how it moves */
  Hyper.sim('cyc-reservoirs', {
    title: 'Where the water is, and how it moves',
    blurb: `Three ways to look at the water of the Earth, chosen with the menu.

**Where it is.** The square is all the water of the planet, drawn so that area is volume. Click a slice (or a row of the list) to *drill in*: the chosen reservoir becomes the whole square and is cut into its parts. Go from the ocean to the 1,120 km³ held in living things in five clicks, and watch the share of the planet's water fall to eight parts in a hundred million.

**On a planet.** The same water gathered into spheres and set beside the Earth, to scale. All of it is a ball about 1,380 km across; the fresh liquid water a ball of 270 km; the lakes and rivers a ball of 56 km.

**How it moves.** The cycle as a flow network: dots travel along each flux at a rate proportional to it (volumes from the USGS and Gleick). The residence time of a reservoir is its volume divided by the flow through it. Warm the planet and see what changes: more vapour in the air (about 7 % per kelvin), a smaller increase of rain (roughly 2 % per kelvin), so a molecule waits longer in the sky.

**Try this**
- Drill ocean → *Where the rest is*: all the ice, groundwater, lakes and the air together are 3.5 % of the total.
- In *On a planet* compare the Earth's ocean ball with the whole planet: the ocean is 0.023 % of the Earth's mass.
- In *How it moves* find the slowest and the fastest reservoir; their ratio is more than a million.`,
    mount(box, kit, params) {
      const W = kit.water, E = W.EARTH;
      const narrow0 = (box.stage.clientWidth || 600) < 560;
      const st = kit.stage(box.stage, narrow0 ? { aspect: 1.35, minH: 470, maxH: 620 } : { aspect: 0.62, minH: 330, maxH: 560 });
      /* ---- the tree of reservoirs (USGS / Gleick, km³) */
      const T = E.totalWater;
      const tree = {
        name: 'All the water on Earth', v: T, kids: [
          { name: 'Oceans', v: E.oceans, note: 'Salt water, mean depth 3,688 m, covering 71 % of the planet.', kids: [
            { name: 'Upper 200 m (sunlit layer)', v: E.oceanArea * 200 / 1e9, note: 'The part that exchanges heat and gas with the air in a year or two.' },
            { name: '200 m to 1,000 m', v: E.oceanArea * 800 / 1e9, note: 'The thermocline: warm water above, cold below.' },
            { name: 'Deeper than 1,000 m', v: E.oceans - E.oceanArea * 1000 / 1e9, note: 'Cold, dense water, 2–4 °C, renewed over centuries.' }] },
          { name: 'Where the rest is', v: T - E.oceans, note: 'Everything that is not the open sea: 3.5 % of the total.', kids: [
            { name: 'Ice caps, glaciers, ice sheets', v: E.icecaps, note: 'Antarctica holds about 90 % of it, Greenland most of the rest. 68.7 % of the fresh water.', kids: [
              { name: 'Antarctic ice sheet', v: 2.14e7, note: 'About 89 % of the ice in the USGS table; newer surveys put it nearer 26 million km³ and the total nearer 30 million.' },
              { name: 'Greenland ice sheet', v: 2.4e6, note: 'Enough, if melted, to raise the sea by about 7 m.' },
              { name: 'Mountain glaciers, small ice caps', v: E.icecaps - 2.14e7 - 2.4e6, note: 'A small volume that matters locally: the water towers of Asia and South America.' }] },
            { name: 'Groundwater', v: E.groundwater, note: 'Water in the pores of rock and soil: 10.5 million km³ fresh, 12.9 million km³ salty.', kids: [
              { name: 'Fresh groundwater', v: E.groundwaterFresh, note: '30.1 % of all fresh water, nearly all of it the liquid fresh water there is.' },
              { name: 'Saline groundwater', v: E.groundwater - E.groundwaterFresh, note: 'Brackish and briny water, deep and in dry basins.' }] },
            { name: 'Permafrost', v: E.permafrost, note: 'Ground ice that stays frozen for years.' },
            { name: 'Lakes, soil, air, rivers, living things', v: T - E.oceans - E.icecaps - E.groundwater - E.permafrost, note: 'Under 0.02 % of all water, and the part we see and use.', kids: [
              { name: 'Lakes (fresh and saline)', v: E.lakes, note: 'Fresh lakes hold 91,000 km³; the rest is saline lakes such as the Caspian Sea.' },
              { name: 'Soil moisture', v: E.soil, note: 'Water held in the soil, what plants draw on.' },
              { name: 'The atmosphere', v: E.atmosphere, note: 'Vapour, cloud droplets and ice: 12,900 km³ — spread over the whole planet a layer 2.5 cm deep.' },
              { name: 'Swamps and wetlands', v: E.swamps, note: 'Marshes, bogs and flooded forest.' },
              { name: 'Rivers', v: E.rivers, note: 'Only 2,120 km³ in the channels at any moment, carrying 40,000 km³ a year to the sea.' },
              { name: 'Living things', v: E.biological, note: 'The water inside every plant, animal and microbe.' }] }] }
        ]
      };
      /* ---- controls */
      const modes = [['Where it is (drill in)', 'stores'], ['On a planet (spheres)', 'spheres'], ['How it moves (the cycle)', 'flows']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'View', options: modes, value: params.mode || 'stores' },
        { id: 'warm', label: 'Warming', min: 0, max: 5, step: 0.25, value: 0, unit: 'K' },
        { id: 'speed', label: 'Flow animation speed', min: 0.25, max: 3, step: 0.25, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'up', label: 'Back up one level', primary: true }, { id: 'top', label: 'All the water' }] }
      ], (id) => {
        if (id === 'up') path.pop();
        if (id === 'top') path.length = 0;
        sync();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Reservoir'], ['b', 'Volume'], ['c', 'Share of this level'], ['d', 'Share of all water'], ['e', 'Note'], ['p1', 'The ball'], ['p2', 'Against the Earth'], ['p3', 'The oceans'], ['p4', 'Note'], ['f1', 'In the air'], ['f2', 'Evaporation'], ['f3', 'A molecule in the air'], ['f4', 'Residence times'], ['f5', 'The Sun’s work']]);
      const path = [];                                        // the chain of nodes drilled into
      const cur = () => path.length ? path[path.length - 1] : tree;
      let hits = [], sphereHit = -1;
      const sync = () => {
        const f = V.mode === 'flows';
        ctl.show('warm', f); ctl.show('speed', f); ctl.show('up', V.mode === 'stores'); ctl.show('top', V.mode === 'stores');
        for (const k of ['a', 'b', 'c', 'd', 'e']) ro.show(k, V.mode === 'stores');
        for (const k of ['p1', 'p2', 'p3', 'p4']) ro.show(k, V.mode === 'spheres');
        for (const k of ['f1', 'f2', 'f3', 'f4', 'f5']) ro.show(k, f);
      };
      sync();
      const sel = { i: -1 };
      kit.click(st, (p) => {
        if (V.mode !== 'stores') return;
        for (const h of hits) if (p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h) {
          if (h.node.kids) path.push(h.node); else sel.i = h.i;
          return;
        }
      }, (p) => V.mode === 'stores' && hits.some(h => h.node.kids && p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h));
      st.canvas.addEventListener('pointermove', (e) => {
        if (V.mode !== 'stores') { sel.i = -1; return; }
        const p = st.pos(e);
        const hh = hits.find(h => p.x >= h.x && p.x <= h.x + h.w && p.y >= h.y && p.y <= h.y + h.h);
        sel.i = hh ? hh.i : -1;
      });

      /* ---- the flow network */
      const FL = E.flux;
      const arrows = [
        { id: 'evapO', f: () => FL.oceanEvap, label: 'evaporation', col: 'warn' },
        { id: 'rainO', f: () => FL.oceanPrecip, label: 'rain on the sea', col: 'accent' },
        { id: 'evapL', f: () => FL.landEvap, label: 'evaporation + transpiration', col: 'warn' },
        { id: 'rainL', f: () => FL.landPrecip, label: 'rain and snow on land', col: 'accent' },
        { id: 'run', f: () => FL.runoff, label: 'runoff', col: 'accent' },
        { id: 'moist', f: () => FL.oceanEvap - FL.oceanPrecip, label: 'vapour carried to land', col: 'muted' }
      ];
      const parts = arrows.map(() => []);
      const acc = arrows.map(() => 0);
      const wvPerK = () => W.ccSlope(15) / W.vapourPressure(15);        // the 7 % per kelvin
      const PRECIP_PER_K = 0.02;                                         // the rise of global precipitation per kelvin (models: 1–3 % per kelvin)

      const loop = kit.loop((dt, tt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.mode === 'stores') drawStores(c, C, Wd, Hh);
        else if (V.mode === 'spheres') drawSpheres(c, C, Wd, Hh);
        else drawFlows(c, C, Wd, Hh, dt, tt);
      }, box.stage);

      /* ---- view 1: nested squares */
      function drawStores(c, C, Wd, Hh) {
        hits = [];
        const node = cur(), kids = node.kids || [];
        const narrow = Wd < 560;
        const side = narrow ? Math.max(120, Math.min(Wd - 32, Hh * 0.46)) : Math.max(120, Math.min(Hh - 74, Wd * 0.46));
        const x0 = narrow ? Math.round((Wd - side) / 2) : 16, y0 = narrow ? 34 : 48;
        // breadcrumb
        const trail = ['All the water'].concat(path.map(n => n.name));
        kit.label(c, trail.join('  ›  '), 16, 16, { size: 11.5, color: C.muted, weight: 600 });
        c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.fillRect(x0, y0, side, side); c.strokeRect(x0 + 0.5, y0 + 0.5, side, side);
        // slice and dice: strips left to right, each full height, area proportional to volume
        const tot = node.v;
        let xx = x0;
        const cols = [C.accent, C.series[1], C.series[2], C.series[3], C.series[4], C.series[5], C.series[6]];
        const sumKids = kids.reduce((s, k) => s + k.v, 0);
        const stripHits = [];
        kids.forEach((k, i) => {
          const w = side * k.v / (sumKids || 1);
          const col = cols[i % cols.length];
          c.globalAlpha = sel.i === i ? 0.95 : 0.7;
          c.fillStyle = col; c.fillRect(xx, y0, Math.max(w, 1), side);
          c.globalAlpha = 1;
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.strokeRect(xx + 0.5, y0 + 0.5, Math.max(w, 1), side);
          stripHits.push({ x: xx - (w < 6 ? (6 - w) / 2 : 0), y: y0, w: Math.max(w, 6), h: side, node: k, i });
          xx += w;
        });
        if (!kids.length) kit.label(c, 'no finer breakdown', x0 + side / 2, y0 + side / 2, { align: 'center', color: C.muted });
        // a marker of how small this square is within all the water
        const rel = node.v / T;
        const ms = 34, mx = narrow ? Math.min(Wd - ms - 12, x0 + side + 4 > Wd - ms - 8 ? Wd - ms - 8 : x0 + side + 4) : x0 + side + 18, my = narrow ? 2 : y0 + 4;
        const relTxt = rel >= 0.01 ? (rel * 100).toFixed(1) + ' % of all water' : (rel * 100).toPrecision(2) + ' % of all water';
        if (!narrow) {
          c.strokeStyle = C.axis; c.strokeRect(mx + 0.5, my + 0.5, ms, ms);
          c.fillStyle = C.accent; const dd = Math.max(1.5, ms * Math.sqrt(rel)); c.fillRect(mx + ms - dd, my + ms - dd, dd, dd);
          kit.label(c, 'this square, to scale, in the whole', mx + ms + 8, my + 10, { size: 10.5, color: C.muted });
          kit.label(c, relTxt, mx + ms + 8, my + 26, { size: 10.5, color: C.text, weight: 600 });
        } else {
          kit.label(c, 'this square: ' + relTxt, Wd - 12, 16, { size: 10.5, color: C.text, weight: 600, align: 'right' });
        }
        // the list
        const lx = narrow ? 16 : mx, ly = narrow ? y0 + side + 12 : my + ms + 14, lw = Wd - lx - 12;
        const rowH = Math.max(24, Math.min(34, (Hh - ly - 22) / Math.max(kids.length, 1)));
        const rowHits = [];
        kids.forEach((k, i) => {
          const y = ly + i * rowH;
          const share = k.v / (tot || 1);
          c.fillStyle = sel.i === i ? C.surface : 'rgba(0,0,0,0)'; roundRect(c, lx - 4, y, lw + 8, rowH - 2, 5); c.fill();
          c.fillStyle = cols[i % cols.length]; c.fillRect(lx, y + 5, 7, rowH - 12);
          kit.label(c, k.name + (k.kids ? '  ›' : ''), lx + 14, y + rowH * 0.32, { size: 11.5, weight: 600 });
          kit.label(c, vol(k.v) + ' · ' + (share >= 0.001 ? (share * 100).toFixed(share > 0.1 ? 1 : 2) : (share * 100).toPrecision(2)) + ' %', lx + 14, y + rowH * 0.72, { size: 10.5, color: C.muted });
          rowHits.push({ x: lx - 4, y, w: lw + 8, h: rowH - 2, node: k, i });
        });
        hits = rowHits.concat(stripHits);
        kit.label(c, kids.length ? 'click a slice or a row' + (kids.some(k => k.kids) ? ' with › to look inside' : '') : 'back up with the button', narrow ? 16 : x0, narrow ? Hh - 8 : y0 + side + 16, { size: 10.5, color: C.muted });
        const s = sel.i >= 0 && kids[sel.i] ? kids[sel.i] : node;
        ro.set('a', s.name);
        ro.set('b', vol(s.v));
        ro.set('c', s === node ? '100 %' : (s.v / node.v * 100 >= 0.01 ? sig(s.v / node.v * 100, 3) : (s.v / node.v * 100).toExponential(1)) + ' %');
        ro.set('d', (s.v / T * 100 >= 0.001 ? sig(s.v / T * 100, 3) : (s.v / T * 100).toExponential(1)) + ' %');
        ro.set('e', s.note || '');
      }

      /* ---- view 2: spheres to scale */
      function drawSpheres(c, C, Wd, Hh) {
        const Rearth = 6371, narrow = Wd < 560;
        const dia = (km3) => 2 * Math.cbrt(3 * km3 / (4 * Math.PI));
        const items = [
          { name: 'All the water on Earth', km3: T, col: C.accent },
          { name: 'The oceans', km3: E.oceans, col: C.series[1] },
          { name: 'Fresh water (ice included)', km3: E.fresh, col: C.series[2] },
          { name: 'Fresh liquid water (groundwater, lakes, rivers)', km3: E.groundwaterFresh + E.lakesFresh + E.rivers + E.soil + E.swamps, col: C.series[3] },
          { name: 'Lakes and rivers', km3: E.lakesFresh + E.rivers, col: C.series[4] },
          { name: 'The atmosphere’s water', km3: E.atmosphere, col: C.muted }
        ];
        const R = narrow ? Math.min(Wd * 0.28, Hh * 0.2) : Math.min(Hh * 0.4, Wd * 0.22);
        const cx = narrow ? Wd / 2 : 24 + R, cy = narrow ? 14 + R : Hh / 2 - 8;
        const k = R / Rearth;                          // px per km
        const g = c.createRadialGradient ? c.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R) : null;
        if (g) { g.addColorStop(0, C.surface); g.addColorStop(1, C.bg2); c.fillStyle = g; } else c.fillStyle = C.surface;
        c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'Earth, 12,742 km across', cx, cy + R + 14, { align: 'center', size: 11, color: C.muted });
        // the balls, side by side inside the disc, for comparison
        let xs = cx - R * 0.8;
        items.slice(0, 5).forEach((it) => {
          const d = dia(it.km3), r = d / 2 * k;
          c.globalAlpha = 0.85; c.fillStyle = it.col; c.beginPath(); c.arc(xs + r, cy, Math.max(r, 1), 0, TAU); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.stroke();
          xs += 2 * r + 3;
        });
        // the list
        const lx = narrow ? 16 : cx + R + 40, ly = narrow ? cy + R + 30 : 14, lw = Wd - lx - 12;
        const rowH = Math.min(44, (Hh - ly - 8) / items.length);
        items.forEach((it, i) => {
          const y = ly + i * rowH, d = dia(it.km3), pc = d / (2 * Rearth) * 100;
          c.fillStyle = it.col; c.beginPath(); c.arc(lx + 6, y + rowH * 0.45, 5, 0, TAU); c.fill();
          kit.label(c, it.name, lx + 20, y + rowH * 0.3, { size: 11, weight: 600 });
          kit.label(c, vol(it.km3) + ' · ball ' + nf(d, d < 100 ? 1 : 0) + ' km (' + pc.toFixed(pc > 1 ? 1 : 2) + ' % of Earth’s width)', lx + 20, y + rowH * 0.72, { size: 10, color: C.muted });
        });
        ro.set('p1', nf(dia(T), 0) + ' km across (' + vol(T) + ')');
        ro.set('p2', (dia(T) / (2 * Rearth) * 100).toFixed(1) + ' % of the Earth’s diameter');
        ro.set('p3', (W.oceanFractionOfEarth() * 100).toFixed(3) + ' % of the Earth’s mass');
        ro.set('p4', 'USGS draws the same picture (about 1,385 km). The balls are set side by side inside the disc only for comparison.');
      }

      /* ---- view 3: the cycle as a flow network */
      function drawFlows(c, C, Wd, Hh, dt, tt) {
        const warm = V.warm, vapFac = Math.exp(wvPerK() * warm), pFac = 1 + PRECIP_PER_K * warm;
        const atmV = E.atmosphere * vapFac;
        const fl = (x) => x * pFac;
        const throughput = fl(FL.oceanEvap + FL.landEvap);
        const resAtm = atmV / throughput;                         // years
        const pad = 12, atmH = Math.max(38, Hh * 0.13), baseY = Hh * 0.6, botY = Hh - 34;
        const oX = pad, oW = Wd * 0.44, lX = Wd * 0.52, lW = Wd - lX - pad;
        // atmosphere band
        c.fillStyle = C.surface; roundRect(c, pad, 6, Wd - 2 * pad, atmH, 10); c.fill();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke();
        kit.label(c, 'Atmosphere · ' + nf(atmV, 0) + ' km³', Wd / 2, 6 + atmH * 0.35, { align: 'center', size: 12, weight: 650 });
        kit.label(c, 'a molecule stays ' + span(resAtm), Wd / 2, 6 + atmH * 0.72, { align: 'center', size: 10.5, color: C.muted });
        // ocean
        c.fillStyle = 'rgba(70,150,235,0.35)'; roundRect(c, oX, baseY, oW, botY - baseY, 8); c.fill(); c.strokeStyle = C.accent; c.stroke();
        kit.label(c, 'Oceans', oX + oW / 2, baseY + 16, { align: 'center', size: 12, weight: 650 });
        kit.label(c, '1,338 million km³', oX + oW / 2, baseY + 32, { align: 'center', size: 10, color: C.muted });
        kit.label(c, 'stay ' + span(E.residence.oceans), oX + oW / 2, baseY + 47, { align: 'center', size: 10, color: C.muted });
        // land
        c.fillStyle = 'rgba(120,170,90,0.28)'; roundRect(c, lX, baseY - 16, lW, botY - baseY + 16, 8); c.fill(); c.strokeStyle = C.ok; c.stroke();
        kit.label(c, 'Land', lX + 8, baseY - 4, { size: 11.5, weight: 650, color: C.ok });
        const stores = [['Rivers', E.residence.rivers], ['Lakes', E.residence.lakes], ['Groundwater', E.residence.groundwater], ['Ice', E.residence.icecaps]];
        const gx = lX + 6, gw = (lW - 18) / 2, gh = (botY - baseY - 12) / 2 - 4;
        stores.forEach((s, i) => {
          const x = gx + (i % 2) * (gw + 6), y = baseY + 14 + Math.floor(i / 2) * (gh + 4);
          c.fillStyle = C.bg2; roundRect(c, x, y, gw, gh, 5); c.fill();
          c.strokeStyle = C.axis; c.stroke();
          kit.label(c, s[0], x + gw / 2, y + gh * 0.32, { align: 'center', size: 10, weight: 600 });
          kit.label(c, s[1] < 1 ? span(s[1]) : nf(s[1]) + ' yr', x + gw / 2, y + gh * 0.72, { align: 'center', size: 10, color: C.muted });
        });
        const top = 6 + atmH, rh = baseY - top;
        const ax = {
          evapO: [oX + oW * 0.3, baseY, oX + oW * 0.3, top],
          rainO: [oX + oW * 0.7, top, oX + oW * 0.7, baseY],
          moist: [oX + oW + 4, top + rh * 0.5, lX + 6, top + rh * 0.5],
          evapL: [lX + lW * 0.3, baseY - 16, lX + lW * 0.3, top],
          rainL: [lX + lW * 0.72, top, lX + lW * 0.72, baseY - 16],
          run: [lX, botY - 12, oX + oW, botY - 12]
        };
        const vals = { evapO: fl(FL.oceanEvap), rainO: fl(FL.oceanPrecip), evapL: fl(FL.landEvap), rainL: fl(FL.landPrecip), run: fl(FL.landPrecip - FL.landEvap), moist: fl(FL.oceanEvap - FL.oceanPrecip) };
        arrows.forEach((a, i) => {
          const [x1, y1, x2, y2] = ax[a.id], v = vals[a.id];
          const colr = C[a.col] || C.muted;
          const lw2 = clamp(Math.sqrt(v / 413000) * 6, 1, 6);
          c.globalAlpha = 0.55; kit.arrow(c, x1, y1, x2, y2, colr, lw2); c.globalAlpha = 1;
          acc[i] += dt * V.speed * (v / 413000) * 7;
          while (acc[i] >= 1) { acc[i] -= 1; if (parts[i].length < 60) parts[i].push({ t: 0, o: (Math.random() - 0.5) * 8 }); }
          const len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
          parts[i] = parts[i].filter(p => { p.t += dt * V.speed * 0.45; return p.t < 1; });
          for (const p of parts[i]) { c.fillStyle = colr; c.beginPath(); c.arc(x1 + (x2 - x1) * p.t + nx * p.o, y1 + (y2 - y1) * p.t + ny * p.o, 2.2, 0, TAU); c.fill(); }
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, horiz = Math.abs(y2 - y1) < 1;
          kit.label(c, nf(v), mx, horiz ? my - 9 : my, { size: 10.5, color: C.text, align: 'center', bg: C.bg2, weight: 600 });
        });
        kit.label(c, 'km³ per year · orange: evaporation · blue: rain, runoff', pad, Hh - 18, { size: 9.5, color: C.muted });
        kit.label(c, 'grey: vapour carried from sea to land', pad, Hh - 6, { size: 9.5, color: C.muted });
        ro.set('f1', nf(atmV, 0) + ' km³ (' + (vapFac >= 1.0005 ? '+' + ((vapFac - 1) * 100).toFixed(0) + ' % with warming' : 'today') + ')');
        ro.set('f2', nf(throughput) + ' km³/yr, ' + nf(throughput / 5.1e8 * 1e6, 0) + ' mm a year over the planet');
        ro.set('f3', span(resAtm) + ' (volume ÷ flow)');
        ro.set('f4', 'ice caps ' + nf(E.residence.icecaps) + ' yr · oceans ' + nf(E.residence.oceans) + ' · groundwater ' + nf(E.residence.groundwater) + ' · lakes ' + nf(E.residence.lakes) + ' · rivers ' + span(E.residence.rivers) + ' · air ' + span(E.residence.atmosphere));
        const sunJ = throughput * 1e9 * 1000 * W.latentVaporisation(15);       // km³ -> m³ -> kg -> J
        ro.set('f5', sig(sunJ / 1e24, 3) + ' × 10²⁴ J a year, ' + (sunJ / (240 * 5.1e14 * 3.156e7) * 100).toFixed(0) + ' % of the sunlight absorbed');
      }
      loop.start();
    }
  });

  /* ================================================================ humidity */
  Hyper.sim('cyc-psychrometer', {
    title: 'Humidity, dew point and the water in a room',
    blurb: `A psychrometric chart you can drive. The horizontal axis is the air temperature, the vertical axis the water vapour in each cubic metre of air. The thick curve is saturation: the most vapour the air can hold at that temperature (23 g/m³ at 25 °C). The dot is your air; relative humidity is the dot's height as a fraction of the curve above it.

Cool the air without adding or removing vapour and the dot slides left along the dashed line. The temperature where it meets the saturation curve is the **dew point**: any surface colder than that collects water. The **wet-bulb temperature** is what a wet thermometer reads as water evaporates from it (Stull's formula); it is lower than the air temperature by an amount that tells you how dry the air is.

**Try this**
- Set 22 °C and 50 %: the dew point is 11 °C. A glass of water at 8 °C will sweat, one at 15 °C will not.
- Hold the temperature and the dew point and raise the room's temperature: relative humidity falls, vapour content does not. This is why a heated winter house feels dry.
- Raise the temperature by 10 K at 100 % humidity: the air can hold about twice as much. That 7 % per kelvin is the Clausius–Clapeyron rule.
- Set 35 °C and 50 %: dew point 23 °C, wet bulb 27 °C. At a wet-bulb temperature near 35 °C the body can no longer cool by sweating.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Air temperature', min: -5, max: 45, step: 0.5, value: params.T != null ? params.T : 22, unit: '°C' },
        { id: 'RH', label: 'Relative humidity', min: 5, max: 100, step: 1, value: params.RH != null ? params.RH : 50, unit: '%' },
        { id: 'Ts', label: 'Surface (glass, mirror, wall)', min: -5, max: 40, step: 0.5, value: params.Ts != null ? params.Ts : 10, unit: '°C' },
        { id: 'room', label: 'Room volume', min: 10, max: 300, step: 5, value: 60, unit: 'm³' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dp', 'Dew point'], ['wb', 'Wet-bulb temperature'], ['ah', 'Vapour in each m³'], ['sat', 'Saturated would hold'], ['mix', 'Mixing ratio'], ['e', 'Vapour pressure'], ['room', 'Water vapour in the room'], ['surf', 'On the surface']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T, RH = V.RH / 100;
        const ah = W.absoluteHumidity(T, RH) * 1000, sat = W.absoluteHumidity(T, 1) * 1000;
        const dp = W.dewPoint(T, RH), wb = W.wetBulb(T, RH), mix = W.mixingRatio(T, RH) * 1000, e = RH * W.vapourPressure(T);
        // chart area
        const x0 = 52, x1 = Wd - 18, y0 = 16, y1 = Hh - 42, xmin = -5, xmax = 45, ymax = 70;
        const X = (t) => x0 + (t - xmin) / (xmax - xmin) * (x1 - x0), Y = (a) => y1 - a / ymax * (y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif';
        for (let t = 0; t <= 45; t += 5) { c.beginPath(); c.moveTo(X(t), y0); c.lineTo(X(t), y1); c.stroke(); c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(t + '', X(t), y1 + 5); }
        for (let a = 0; a <= 70; a += 10) { c.beginPath(); c.moveTo(x0, Y(a)); c.lineTo(x1, Y(a)); c.stroke(); c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(a + '', x0 - 6, Y(a)); }
        kit.label(c, 'air temperature, °C', x1, Hh - 10, { align: 'right', size: 11, color: C.muted });
        c.save(); c.translate(12, y0); c.rotate(-Math.PI / 2); c.textAlign = 'right'; c.textBaseline = 'top'; c.fillStyle = C.muted; c.fillText('water vapour, g per m³', 0, -4); c.restore();
        // fog region (above saturation) shading
        c.beginPath(); c.moveTo(X(xmin), y0);
        for (let t = xmin; t <= xmax; t += 1) c.lineTo(X(t), Y(Math.min(ymax, W.absoluteHumidity(t, 1) * 1000)));
        c.lineTo(X(xmax), y0); c.closePath(); c.fillStyle = 'rgba(150,170,200,0.16)'; c.fill();
        kit.label(c, 'above the curve: fog, cloud, dew', x0 + 8, y0 + 12, { size: 10.5, color: C.muted });
        // RH curves
        for (let r = 10; r < 100; r += 10) {
          c.beginPath(); let first = true;
          for (let t = xmin; t <= xmax; t += 1) { const a = W.absoluteHumidity(t, r / 100) * 1000; if (a > ymax) continue; const px = X(t), py = Y(a); if (first) { c.moveTo(px, py); first = false; } else c.lineTo(px, py); }
          c.strokeStyle = C.faint; c.globalAlpha = 0.6; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1;
          const tl = 45 - (r > 40 ? 0 : 0); const al = W.absoluteHumidity(tl, r / 100) * 1000;
          if (al < ymax) kit.label(c, r + '%', X(tl) - 4, Y(al) - 5, { size: 9.5, color: C.muted, align: 'right' });
        }
        // saturation curve
        c.beginPath();
        for (let t = xmin; t <= xmax; t += 0.5) { const a = Math.min(ymax, W.absoluteHumidity(t, 1) * 1000); if (t === xmin) c.moveTo(X(t), Y(a)); else c.lineTo(X(t), Y(a)); }
        c.strokeStyle = C.accent; c.lineWidth = 3; c.stroke();
        kit.label(c, 'saturation (100 %)', X(31), Y(W.absoluteHumidity(31, 1) * 1000) - 10, { size: 11, color: C.accent, weight: 650, align: 'right' });
        // dew point line
        const pxA = X(T), pyA = Y(ah);
        c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(pxA, pyA); c.lineTo(X(dp), pyA); c.lineTo(X(dp), y1); c.stroke(); c.setLineDash([]);
        kit.dot(c, X(dp), pyA, 5.5, C.warn, C.bg2);
        kit.label(c, 'dew point ' + dp.toFixed(1) + ' °C', X(dp) - 6, pyA - 12, { size: 11, color: C.warn, weight: 650, align: 'right', bg: C.bg2 });
        // wet bulb marker on the axis
        c.fillStyle = C.ok; c.beginPath(); c.moveTo(X(wb), y1); c.lineTo(X(wb) - 5, y1 + 9); c.lineTo(X(wb) + 5, y1 + 9); c.closePath(); c.fill();
        kit.label(c, 'wet bulb ' + wb.toFixed(1), X(wb), y1 + 22, { size: 10.5, color: C.ok, weight: 600, align: 'center' });
        // the dot
        kit.dot(c, pxA, pyA, 7, C.bad, C.bg2);
        kit.label(c, V.T.toFixed(1) + ' °C, ' + V.RH.toFixed(0) + ' %', pxA + 10, pyA - 4, { size: 11.5, weight: 650, bg: C.bg2 });
        // the surface line and condensation
        const sAh = W.absoluteHumidity(V.Ts, 1) * 1000;
        c.strokeStyle = V.Ts < dp ? C.accent : C.muted; c.lineWidth = 1.2; c.setLineDash([2, 3]);
        c.beginPath(); c.moveTo(X(V.Ts), y0); c.lineTo(X(V.Ts), y1); c.stroke(); c.setLineDash([]);
        kit.label(c, 'surface ' + V.Ts.toFixed(1) + ' °C', X(V.Ts) + 4, y0 + 28, { size: 10.5, color: V.Ts < dp ? C.accent : C.muted, bg: C.bg2 });
        // readouts
        const wet = V.Ts < dp;
        const gm3 = Math.max(0, ah - sAh);
        ro.set('dp', dp.toFixed(1) + ' °C');
        ro.set('wb', wb.toFixed(1) + ' °C');
        ro.set('ah', ah.toFixed(1) + ' g/m³');
        ro.set('sat', sat.toFixed(1) + ' g/m³ (' + (100 * ah / sat).toFixed(0) + ' % full)');
        ro.set('mix', mix.toFixed(1) + ' g per kg of dry air');
        ro.set('e', (e / 1000).toFixed(2) + ' kPa of the saturation ' + (W.vapourPressure(T) / 1000).toFixed(2) + ' kPa');
        ro.set('room', (ah * V.room / 1000).toFixed(2) + ' kg (litres of water) in ' + V.room + ' m³');
        ro.set('surf', wet ? 'DEW: surface is ' + (dp - V.Ts).toFixed(1) + ' K below the dew point; ' + gm3.toFixed(1) + ' g leave each m³ that cools to it' : 'dry: the surface is ' + (V.Ts - dp).toFixed(1) + ' K above the dew point');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ droplets, rain and ice crystals */
  /* local model (schematic): condensation r dr/dt = G s; collection dr/dt = E w V / (4 rho_w); the fall speed from a sphere's drag */
  function fallSpeed(r) {                         // m/s for a drop of radius r (m) in air at about 5 °C
    const rhoW = 1000, rhoA = 1.27, mu = 1.73e-5, g = 9.81;
    let V = 2 * rhoW * g * r * r / (9 * mu);      // Stokes
    if (r > 20e-6) {
      for (let i = 0; i < 60; i++) {
        const Re = Math.max(1e-9, 2 * rhoA * r * V / mu), Cd = 24 / Re * (1 + 0.15 * Math.pow(Re, 0.687));
        V = 0.5 * V + 0.5 * Math.sqrt(8 * r * rhoW * g / (3 * rhoA * Cd));
      }
    }
    return Math.min(V, 9.2);
  }

  Hyper.sim('cyc-droplet-growth', {
    title: 'From a cloud droplet to a raindrop',
    blurb: `A cloud droplet is about 10 µm across. A raindrop is about 1 mm: a million times the volume. Two routes close the gap.

**Growth in a cloud.** *Condensation* alone slows down as the droplet grows (its radius squared rises only in proportion to time), so it takes days to reach rain size. *Collision and coalescence* — big droplets falling through small ones — takes over once droplets pass about 25–50 µm across, and finishes the job in about an hour. In a cloud colder than 0 °C there is a third route, the *ice crystal*: where liquid droplets and ice coexist, the air that is just saturated for water is 10 % supersaturated for ice at −10 °C, and the crystal grows fast at the droplets' expense (the Bergeron–Findeisen process). The three circles are drawn to one scale at the time you choose, with 1 mm = 40 pixels; the number under each is its fall speed.

**The Köhler curve.** Every droplet forms on a nucleus. A small curved surface wants to evaporate (the Kelvin effect), dissolved salt wants to hold water (the Raoult effect); the sum is a curve with a peak. Droplets that cross the peak grow without limit; those that stay left of it remain haze.

This is a *schematic* model: spherical droplets, fixed liquid-water content, fixed supersaturation, no entrainment. The orders of magnitude are right; the exact times are not those of any real cloud.

**Try this**
- Condensation only: how long to reach 100 µm? And 1 mm? Then switch on collision and compare.
- Set the temperature to −10 °C and look at the ice crystal. Then to −2 °C, where the advantage is small.
- Köhler view: make the dry nucleus smaller (20 nm) and watch the critical supersaturation rise; replace salt with soot (κ = 0) and see that no peak is left.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 190, maxH: 280 });
      const graph = document.createElement('div'); graph.style.padding = '4px 8px 8px'; box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'time (s)', log: true, min: 1, max: 1e6 }, y: { label: 'diameter (µm)', log: true, min: 1, max: 10000 }, legend: true }, 230);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Growth in a cloud', 'grow'], ['The Köhler curve', 'kohler']], value: params.view || 'grow' },
        { id: 'Tc', label: 'Cloud temperature', min: -30, max: 20, step: 1, value: params.Tc != null ? params.Tc : -10, unit: '°C' },
        { id: 's', label: 'Supersaturation (water)', min: 0.05, max: 1, step: 0.01, value: 0.3, unit: '%' },
        { id: 'lwc', label: 'Liquid water in the cloud', min: 0.1, max: 3, step: 0.1, value: 1, unit: 'g/m³' },
        { id: 'tt', label: 'Time shown', min: 0, max: 100, step: 1, value: 66, fmt: v => { const t = Math.pow(10, v / 100 * 6); return t < 120 ? t.toFixed(0) + ' s' : t < 7200 ? (t / 60).toFixed(0) + ' min' : t < 172800 ? (t / 3600).toFixed(1) + ' h' : (t / 86400).toFixed(1) + ' days'; } },
        { id: 'Tk', label: 'Air temperature', min: -10, max: 30, step: 1, value: 15, unit: '°C' },
        { id: 'rd', label: 'Dry nucleus radius', min: 10, max: 500, step: 5, value: 50, unit: 'nm', log: true },
        { id: 'kap', type: 'select', label: 'Nucleus', options: [['Sea salt (κ = 1.3)', 1.28], ['Ammonium sulphate (κ = 0.6)', 0.61], ['Organic aerosol (κ = 0.1)', 0.1], ['Soot, insoluble (κ = 0)', 0]], value: 1.28 },
        { id: 'amb', label: 'Air’s supersaturation', min: 0, max: 1, step: 0.01, value: 0.3, unit: '%' }
      ], () => { recompute(); fit(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Condensation only'], ['b', 'With collisions'], ['c', 'Ice crystal'], ['d', 'Fall speeds'], ['e', 'Note']]);
      let curves = null;
      const G = (T) => {                                            // m²/s: r dr/dt = G s
        const Tk = T + 273.15, Lv = W.latentVaporisation(T), es = W.vapourPressure(T), Rv = 461.5, K = 0.0243, D = 2.2e-5 * Math.pow(Tk / 273.15, 1.94) * (101325 / 101325);
        const Fk = (Lv / (Rv * Tk) - 1) * Lv / (K * Tk), Fd = Rv * Tk / (D * es);
        return 1 / (1000 * (Fk + Fd));
      };
      function recompute() {
        const T = V.Tc, s = V.s / 100, g = G(T), lwc = V.lwc * 1e-3, r0 = 5e-6;
        const sIce = T < 0 ? Math.min(0.3, W.vapourPressure(T) / W.sublimationPressure(T) - 1) : 0;
        const A = [], B = [], I = [];
        let rA = r0, rB = r0, rI = r0, t = 1;
        while (t < 1e6) {
          const dt = t * 0.03;
          rA = Math.sqrt(rA * rA + 2 * g * s * dt);
          // condensation + collection for the second droplet
          const E = 0.8 * clamp((rB - 12e-6) / 25e-6, 0, 1);
          rB = Math.sqrt(rB * rB + 2 * g * s * dt) + E * lwc * fallSpeed(rB) / (4 * 1000) * dt;
          rB = Math.min(rB, 2.6e-3);
          rI = Math.sqrt(rI * rI + 2 * g * sIce * dt);
          t += dt;
          A.push([t, 2 * rA * 1e6]); B.push([t, 2 * rB * 1e6]); I.push([t, 2 * rI * 1e6]);
        }
        curves = { A, B, I, sIce, g };
      }
      /* the Köhler curve: S = exp(A/r) (r³ − rd³)/(r³ − rd³(1 − κ)) */
      function kohler() {
        const T = V.Tk, rd = V.rd * 1e-9, kap = V.kap;
        const A = Math.log(W.kelvinRatio(1e-6, T)) * 1e-6;
        const S = (r) => Math.exp(A / r) * (r * r * r - rd * rd * rd) / (r * r * r - rd * rd * rd * (1 - kap));
        const pts = [], kel = [], rao = [];
        let best = { s: -1, r: 0 };
        for (let i = 0; i <= 400; i++) {
          const r = Math.max(rd * 1.0001, 0.01e-6) * Math.pow(10e-6 / Math.max(rd * 1.0001, 0.01e-6), i / 400);
          const sv = (S(r) - 1) * 100;
          if (sv > best.s) best = { s: sv, r };
          if (sv > -2.5 && sv < 2) pts.push([r * 1e6, sv]);
          const kv = (Math.exp(A / r) - 1) * 100; if (kv < 2 && kv > -2.5) kel.push([r * 1e6, kv]);
          const rv = ((r * r * r - rd * rd * rd) / (r * r * r - rd * rd * rd * (1 - kap)) - 1) * 100; if (rv > -2.5) rao.push([r * 1e6, rv]);
        }
        return { pts, kel, rao, best, A };
      }
      recompute();
      const fit = () => {
        const k = V.view === 'kohler';
        ['Tc', 's', 'lwc', 'tt'].forEach(id => ctl.show(id, !k));
        ['Tk', 'rd', 'kap', 'amb'].forEach(id => ctl.show(id, k));
        ro.show('a', !k); ro.show('b', !k); ro.show('c', !k); ro.show('d', !k); ro.show('e', k);
      };
      fit();
      const draw = (c, C, Wd, Hh) => {
        const k = V.view === 'kohler';
        if (!k) {
          const t = Math.pow(10, V.tt / 100 * 6);
          const at = (arr) => { let b = arr[0]; for (const p of arr) if (p[0] <= t) b = p; return b[1]; };
          const dA = at(curves.A), dB = at(curves.B), dI = at(curves.I);
          const items = [['condensation', dA, C.accent], ['+ collisions', dB, C.series[1]], [V.Tc < 0 ? 'ice crystal' : 'no ice (> 0 °C)', V.Tc < 0 ? dI : 0, C.series[2]]];
          const pxmm = 40, baseY = Hh * 0.52;
          // a bar showing 1 mm
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(14, Hh - 16); c.lineTo(14 + pxmm, Hh - 16); c.stroke();
          kit.label(c, '1 mm', 14 + pxmm + 6, Hh - 16, { size: 11, color: C.muted });
          const colW = (Wd - 40) / 3;
          items.forEach((it, i) => {
            const cx = 20 + colW * (i + 0.5), r = Math.max(1.2, it[1] / 1000 * pxmm / 2);
            c.fillStyle = it[2]; c.globalAlpha = 0.9; c.beginPath(); c.arc(cx, baseY, Math.min(r, Hh * 0.28), 0, TAU); c.fill(); c.globalAlpha = 1;
            kit.label(c, it[0], cx, 14, { align: 'center', size: 11.5, weight: 650 });
            kit.label(c, it[1] > 0 ? (it[1] < 100 ? it[1].toFixed(0) + ' µm' : (it[1] / 1000).toFixed(2) + ' mm') + ' across' : '—', cx, Hh * 0.8, { align: 'center', size: 11.5 });
            kit.label(c, it[1] > 0 ? 'falls ' + (fallSpeed(it[1] / 2e6) >= 0.1 ? fallSpeed(it[1] / 2e6).toFixed(1) + ' m/s' : (fallSpeed(it[1] / 2e6) * 1000).toFixed(1) + ' mm/s') : '', cx, Hh * 0.8 + 16, { align: 'center', size: 11, color: C.muted });
          });
          plot.set({ series: [{ pts: curves.A, label: 'condensation only', color: C.accent }, { pts: curves.B, label: 'condensation + collisions', color: C.series[1] }].concat(V.Tc < 0 ? [{ pts: curves.I, label: 'ice crystal (sphere)', color: C.series[2] }] : []), x: { label: 'time (s)', log: true, min: 1, max: 1e6 }, y: { label: 'diameter (µm)', log: true, min: 1, max: 10000 }, vlines: [{ x: t, label: 'now' }], hlines: [{ y: 1000, label: '1 mm raindrop' }, { y: 10, label: 'cloud droplet' }], marks: [] });
          const tt2 = (arr, d) => { const f = arr.find(p => p[1] >= d); return f ? f[0] : Infinity; };
          const fmtT = (s) => !Number.isFinite(s) ? 'never in 11 days' : s < 120 ? s.toFixed(0) + ' s' : s < 7200 ? (s / 60).toFixed(0) + ' min' : s < 172800 ? (s / 3600).toFixed(1) + ' h' : (s / 86400).toFixed(1) + ' days';
          ro.set('a', 'to 100 µm: ' + fmtT(tt2(curves.A, 100)) + '; to 1 mm: ' + fmtT(tt2(curves.A, 1000)));
          ro.set('b', 'to 100 µm: ' + fmtT(tt2(curves.B, 100)) + '; to 1 mm: ' + fmtT(tt2(curves.B, 1000)));
          ro.set('c', V.Tc < 0 ? 'supersaturated by ' + (curves.sIce * 100).toFixed(0) + ' % for ice; to 1 mm as a sphere: ' + fmtT(tt2(curves.I, 1000)) : 'none (above 0 °C)');
          ro.set('d', '10 µm: ' + (fallSpeed(5e-6) * 1000).toFixed(1) + ' mm/s · 100 µm: ' + (fallSpeed(50e-6) * 100).toFixed(0) + ' cm/s · 1 mm: ' + fallSpeed(0.5e-3).toFixed(1) + ' m/s · 4 mm: ' + fallSpeed(2e-3).toFixed(1) + ' m/s');
        } else {
          const K = kohler();
          const rc = K.best.r * 1e6;
          kit.label(c, 'dry nucleus ' + V.rd + ' nm (' + ['sea salt', 'ammonium sulphate', 'organic', 'soot'][[1.28, 0.61, 0.1, 0].indexOf(V.kap)] + ')', Wd / 2, 18, { align: 'center', size: 12, weight: 650 });
          // a nucleus and the droplet at the peak, to scale with a 1 µm bar
          const pxum = Math.min(Wd * 0.2, 90);
          const cx = Wd * 0.3, cy = Hh * 0.58;
          const rcpx = Math.min(Math.max(rc * pxum, 3), Hh * 0.36);
          c.fillStyle = 'rgba(70,150,235,0.35)'; c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, rcpx, 0, TAU); c.fill(); c.stroke();
          c.fillStyle = C.muted; c.beginPath(); c.arc(cx, cy, Math.max(1.5, V.rd / 1000 * pxum), 0, TAU); c.fill();
          kit.label(c, 'droplet at the peak: ' + (rc * 2).toFixed(2) + ' µm across', cx, cy + rcpx + 16, { align: 'center', size: 11, color: C.muted });
          kit.label(c, 'nucleus: ' + (V.rd * 2) + ' nm across', cx, cy - rcpx - 12, { align: 'center', size: 11, color: C.muted });
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(Wd * 0.58, Hh - 22); c.lineTo(Wd * 0.58 + pxum, Hh - 22); c.stroke();
          kit.label(c, '1 µm (same scale)', Wd * 0.58 + pxum + 6, Hh - 22, { size: 10.5, color: C.muted });
          const act = V.amb > K.best.s;
          wrapLines(c, V.kap === 0 ? 'Insoluble: no solute effect, no stable haze.' : act ? 'Ambient supersaturation ' + V.amb.toFixed(2) + ' % is above the peak (' + K.best.s.toFixed(2) + ' %): ACTIVATED, grows into a cloud droplet.' : 'Ambient ' + V.amb.toFixed(2) + ' % is below the peak (' + K.best.s.toFixed(2) + ' %): stays as haze.', Wd * 0.4 - 12, 11.5).slice(0, 5).forEach((ln, i) => kit.label(c, ln, Wd * 0.58, Hh * 0.28 + i * 15, { size: 11.5, color: act ? C.ok : C.muted, weight: 650 }));
          plot.set({ series: [{ pts: K.kel, label: 'Kelvin: curvature only', color: C.warn, dash: [5, 4] }, { pts: K.rao, label: 'solute only (Raoult)', color: C.series[2], dash: [5, 4] }, { pts: K.pts, label: 'Köhler: both', color: C.accent }], x: { label: 'droplet radius (µm)', log: true, min: 0.01, max: 10 }, y: { label: 'saturation over the drop (% above 100)', min: -2.5, max: 2 }, hlines: [{ y: V.amb, label: 'ambient air' }], marks: V.kap > 0 ? [{ x: K.best.r * 1e6, y: K.best.s, label: 'critical ' + K.best.s.toFixed(2) + ' %' }] : [], vlines: [] });
          ro.set('e', V.kap === 0 ? 'Without solute the curve only falls: every droplet needs more than 1 % supersaturation.' : 'Critical radius ' + (rc).toFixed(2) + ' µm, critical supersaturation ' + K.best.s.toFixed(2) + ' %. The Kelvin constant A = ' + (K.A * 1e9).toFixed(2) + ' nm at ' + V.Tk + ' °C.');
        }
      };
      const loop = kit.loop(() => { const c = st.begin(), C = kit.colors(); draw(c, C, st.W, st.H); }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the greenhouse feedback of water vapour */
  Hyper.sim('cyc-vapour-feedback', {
    title: 'Water vapour: a feedback, not a forcing',
    blurb: `A change that starts the warming (the **forcing**, here a doubling of carbon dioxide, 3.9 W/m²) makes the Earth radiate more heat as it warms; that Planck response alone would limit the rise to about 1.2 K. Warmer air then holds more water vapour (7 % more per kelvin), vapour is a greenhouse gas, so the warming is amplified — and the extra warming carries more vapour: a loop. Each pass of the loop adds a smaller step; the steps add up to a finite total, as long as the loop gain stays below 1.

The bars are the temperature after each trip round the loop; the dashed line is where the series ends. The other feedbacks (lapse rate, surface albedo, clouds) are set to typical values from the IPCC's Sixth Assessment Report (Chapter 7); slide any of them. Water vapour acts as a *feedback* because it cannot be added to the air from outside: whatever the air holds beyond saturation condenses within days (the vapour's mean stay is 9 days), whereas CO₂ added to the air stays for centuries.

**Try this**
- Set the water-vapour feedback to 0: the warming drops from about 3.4 K to 1.3 K.
- Raise it to about 2.9 W/m² per K or more: the loop gain reaches 1 and the series no longer converges (a runaway; not what our atmosphere does, but what a much hotter planet such as early Venus may have done).
- Compare the *attribution* bars at the right: water vapour supplies the largest part of today's natural greenhouse effect, yet it cannot start a warming of its own.
- Make the sum of all feedbacks 0 and recover the plain "Planck" 1.2 K.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, (box.stage.clientWidth || 600) < 560 ? { aspect: 0.92, minH: 380, maxH: 560 } : { aspect: 0.6, minH: 320, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'dF', label: 'Forcing (doubling CO₂ = 3.9)', min: 0.5, max: 8, step: 0.1, value: 3.9, unit: 'W/m²' },
        { id: 'wv', label: 'Water-vapour feedback', min: 0, max: 3.4, step: 0.05, value: params.wv != null ? params.wv : 1.8, unit: 'W/m² per K' },
        { id: 'lr', label: 'Lapse-rate feedback', min: -1.2, max: 0.5, step: 0.05, value: -0.5, unit: 'W/m² per K' },
        { id: 'al', label: 'Surface-albedo feedback', min: 0, max: 1, step: 0.05, value: 0.35, unit: 'W/m² per K' },
        { id: 'cl', label: 'Cloud feedback', min: -0.5, max: 1.2, step: 0.05, value: 0.42, unit: 'W/m² per K' },
        { type: 'buttons', items: [{ id: 'again', label: 'Run the loop again', primary: true }] }
      ], (id) => { if (id === 'again') n = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Planck response only'], ['all', 'With all feedbacks'], ['gain', 'Loop gain (feedbacks ÷ Planck)'], ['x', 'Amplification'], ['vap', 'Water vapour in the air'], ['wvonly', 'Share of the warming due to vapour']]);
      const PL = 3.2;                                 // W/m² per K: the Planck feedback (about −3.2 in AR6)
      let n = 0, tAcc = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        tAcc += dt; if (tAcc > 0.55) { tAcc = 0; if (n < 14) n++; }
        const sumFb = V.wv + V.lr + V.al + V.cl, g = sumFb / PL;
        const dT0 = V.dF / PL;
        const conv = g < 1;
        const dT = conv ? dT0 / (1 - g) : Infinity;
        const gNoWv = (V.lr + V.al + V.cl) / PL, dTnoWv = gNoWv < 1 ? dT0 / (1 - gNoWv) : Infinity;
        const narrow = Wd < 560;
        // the bars: warming after each trip round the loop
        const x0 = 34, x1 = narrow ? Wd - 14 : Wd * 0.62, y0 = 36, y1 = narrow ? Hh * 0.6 : Hh - 40;
        const ymax = Math.max(1.5, Math.min(12, conv ? dT * 1.25 : dT0 * 4));
        const Y = (v) => y1 - v / ymax * (y1 - y0);
        kit.label(c, 'warming after each trip round the loop (K)', x0 - 18, 16, { size: 11.5, weight: 650 });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted; c.font = '10.5px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        const yst = ymax > 6 ? 2 : 1;
        for (let v = 0; v <= ymax; v += yst) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); c.fillText(v + '', x0 - 5, Y(v)); }
        const nb = 15, bw = (x1 - x0) / nb;
        let cum = 0;
        for (let i = 0; i < nb; i++) {
          cum = i === 0 ? dT0 : cum + dT0 * Math.pow(g, i);
          const val = Math.min(cum, ymax * 1.2);
          if (i <= n) {
            c.fillStyle = i === 0 ? C.muted : C.accent; c.globalAlpha = 0.9;
            c.fillRect(x0 + i * bw + 2, Y(val), bw - 4, y1 - Y(val)); c.globalAlpha = 1;
          }
          kit.label(c, i === 0 ? '0' : i + '', x0 + (i + 0.5) * bw, y1 + 11, { size: 9.5, color: C.muted, align: 'center' });
        }
        kit.label(c, 'trip round the loop (0 = Planck response only: ' + dT0.toFixed(1) + ' K)', (x0 + x1) / 2, y1 + 26, { size: 10.5, color: C.muted, align: 'center' });
        if (conv) {
          c.setLineDash([5, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x0, Y(dT)); c.lineTo(x1, Y(dT)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'ends at ' + dT.toFixed(1) + ' K', x1, Y(dT) - 9, { size: 11.5, color: C.warn, weight: 650, align: 'right' });
        } else kit.label(c, 'loop gain ≥ 1: no equilibrium', (x0 + x1) / 2, y0 + 20, { size: 12, color: C.bad, weight: 650, align: 'center' });
        // the attribution of today's natural greenhouse effect (Schmidt et al. 2010)
        const sh = [['water vapour', 50, C.accent], ['clouds', 25, C.series[1]], ['CO₂', 20, C.series[2]], ['other', 5, C.muted]];
        if (!narrow) {
          const bx = x1 + 34, bwid = 30, bt = 50, bh = Hh - 110;
          kit.label(c, 'Natural greenhouse effect', bx - 10, 16, { size: 11.5, weight: 650 });
          kit.label(c, 'by share (Schmidt et al. 2010)', bx - 10, 32, { size: 10, color: C.muted });
          let yy = bt + 8;
          sh.forEach(s => {
            const h = bh * s[1] / 100;
            c.fillStyle = s[2]; c.globalAlpha = 0.9; c.fillRect(bx, yy, bwid, h - 1); c.globalAlpha = 1;
            kit.label(c, s[0] + ' ' + s[1] + ' %', bx + bwid + 8, yy + Math.max(h / 2, 7), { size: 10.5 });
            yy += h;
          });
          kit.label(c, 'in the air: vapour 9 days, CO₂ centuries', bx - 10, Hh - 12, { size: 9.5, color: C.muted });
        } else {
          const by = y1 + 56, bw2 = Wd - 28;
          kit.label(c, 'Today’s natural greenhouse effect, by share (Schmidt et al. 2010)', 14, by - 10, { size: 10.5, weight: 650 });
          let xx = 14;
          sh.forEach(s => {
            const w = bw2 * s[1] / 100;
            c.fillStyle = s[2]; c.globalAlpha = 0.9; c.fillRect(xx, by, w - 1, 22); c.globalAlpha = 1;
            if (w > 40) kit.label(c, s[1] + ' %', xx + w / 2, by + 11, { size: 10.5, align: 'center', weight: 650, color: '#fff' });
            kit.label(c, s[0], xx + 1, by + 34 + (s[0] === 'other' ? 12 : 0), { size: 10 });
            xx += w;
          });
          kit.label(c, 'Vapour stays in the air about 9 days, CO₂ centuries.', 14, Hh - 10, { size: 10, color: C.muted });
        }
        const vapPct = (Math.exp(W.ccSlope(15) / W.vapourPressure(15) * (conv ? dT : 0)) - 1) * 100;
        ro.set('p', dT0.toFixed(2) + ' K (forcing ÷ ' + PL + ' W/m² per K)');
        ro.set('all', conv ? dT.toFixed(2) + ' K' : 'no equilibrium (gain ≥ 1)');
        ro.set('gain', g.toFixed(2) + (conv ? '' : ' — runaway'));
        ro.set('x', conv ? (dT / dT0).toFixed(1) + ' × the no-feedback warming' : '∞');
        ro.set('vap', conv ? '+' + vapPct.toFixed(0) + ' % at ' + dT.toFixed(1) + ' K of warming (7 % per K)' : '—');
        ro.set('wvonly', conv && Number.isFinite(dTnoWv) ? ((dT - dTnoWv) / dT * 100).toFixed(0) + ' % (' + dTnoWv.toFixed(1) + ' K without it)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the overturning circulation */
  /* two-box model (schematic, in the spirit of Stommel 1961): the flow is proportional to the density difference
     between the sinking column at the cold, salty end and the rising column at the warm end; the constant is set so that
     the default tank carries 17 Sv, the order of the Atlantic overturning measured by the RAPID array at 26.5 °N. */
  Hyper.sim('cyc-overturning', {
    title: 'A tank with a warm end and a cold, salty end',
    blurb: `A slice of ocean as a tank: the warm, salty subtropics at the left, the cold north at the right. Water at the cold end is chilled by the wind and, when sea ice forms, made saltier (the ice leaves its salt behind: *brine rejection*). Cold salty water is dense: it sinks, runs along the bottom to the warm end, rises, and returns along the surface — a loop. The dye particles move at a speed proportional to the density difference of the two columns.

The densities come from the water engine (a linear salt correction on the density of pure water); the proportionality to the flow is a *schematic* calibration, set so that the default carries 17 Sv (1 Sv = one million m³ per second; 17 Sv is about eighty Amazons).

**Try this**
- Warm the cold end from 3 °C to 8 °C: the loop slows. Warm it until its density matches the warm end's: the loop stops.
- Freshen the cold end (melt water from Greenland, extra rain): the loop slows long before the water is warm. Add 2 g/kg of fresh water and see how much of the flow goes.
- Make the cold end *fresher* than a threshold and the flow reverses: the warm, salty water is then the dense one and sinks at the left.
- Read the last row: the time the loop needs to move the whole volume of the Atlantic.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, (box.stage.clientWidth || 600) < 560 ? { aspect: 0.95, minH: 300, maxH: 460 } : { aspect: 0.52, minH: 280, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'Tw', label: 'Warm end (tropics)', min: 10, max: 30, step: 0.5, value: 25, unit: '°C' },
        { id: 'Sw', label: 'Salinity at the warm end', min: 33, max: 38, step: 0.1, value: 36, unit: 'g/kg' },
        { id: 'Tc', label: 'Cold end (North Atlantic)', min: -1.8, max: 15, step: 0.1, value: params.Tc != null ? params.Tc : 3, unit: '°C' },
        { id: 'Sc', label: 'Salinity at the cold end', min: 30, max: 37, step: 0.1, value: 35, unit: 'g/kg' },
        { id: 'fresh', label: 'Meltwater added at the cold end', min: 0, max: 5, step: 0.1, value: params.fresh != null ? params.fresh : 0, unit: 'g/kg' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rw', 'Density, warm column'], ['rc', 'Density, cold column'], ['d', 'Difference'], ['q', 'Overturning'], ['base', 'Default tank'], ['tt', 'Time to move the Atlantic']]);
      const rho = (S, T) => W.densityBrine(S, T);
      const REF = rho(35, 3) - rho(36, 25);               // the default difference, kg/m³
      const Q0 = 17;                                       // Sv at the default
      const pr = [];                                       // dye particles: position along the loop, 0..1
      for (let i = 0; i < 60; i++) pr.push({ s: i / 60, o: (Math.random() - 0.5) * 2 });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const rw = rho(V.Sw, V.Tw), rc = rho(V.Sc - V.fresh, V.Tc), d = rc - rw, q = Q0 * d / REF;
        // the tank
        const x0 = 20, x1 = Wd - 20, y0 = 58, y1 = Hh - 66, tw = x1 - x0, th = y1 - y0;
        // temperature field: warm surface at the left, cold at the right, cold deep water everywhere
        const grad = c.createLinearGradient(x0, 0, x1, 0);
        const tcol = (T) => { const f = clamp((T + 2) / 30, 0, 1); return 'rgb(' + Math.round(60 + 190 * f) + ',' + Math.round(130 + 20 * (1 - Math.abs(f - 0.5) * 2)) + ',' + Math.round(240 - 190 * f) + ')'; };
        grad.addColorStop(0, tcol(V.Tw)); grad.addColorStop(1, tcol(V.Tc));
        c.globalAlpha = 0.5; c.fillStyle = grad; c.fillRect(x0, y0, tw, th * 0.45);
        c.fillStyle = tcol(Math.min(V.Tc + 1, 4)); c.fillRect(x0, y0 + th * 0.45, tw, th * 0.55); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x0, y0, tw, th);
        kit.label(c, 'warm, salty', x0, y0 - 28, { size: 11.5, weight: 650 });
        kit.label(c, V.Tw.toFixed(1) + ' °C · ' + V.Sw.toFixed(1) + ' g/kg', x0, y0 - 13, { size: 10.5, color: C.muted });
        kit.label(c, 'cold', x1, y0 - 28, { size: 11.5, weight: 650, align: 'right' });
        kit.label(c, V.Tc.toFixed(1) + ' °C · ' + (V.Sc - V.fresh).toFixed(1) + ' g/kg', x1, y0 - 13, { size: 10.5, color: C.muted, align: 'right' });
        // sun and wind marks
        kit.label(c, 'heated', x0 + 8, y0 + 12, { size: 10.5, color: C.warn });
        kit.label(c, 'chilled', x1 - 8, y0 + 12, { size: 10.5, color: C.accent, align: 'right' });
        // the loop path: a rectangle inset in the tank, clockwise when q>0: top to the right, down at the right, back along the bottom, up at the left
        const px0 = x0 + 36, px1 = x1 - 36, py0 = y0 + 30, py1 = y1 - 30;
        const L = 2 * (px1 - px0) + 2 * (py1 - py0);
        const pos = (s) => {
          let u = ((s % 1) + 1) % 1 * L;
          const a = px1 - px0, b = py1 - py0;
          if (u < a) return [px0 + u, py0, 0];
          u -= a; if (u < b) return [px1, py0 + u, 1];
          u -= b; if (u < a) return [px1 - u, py1, 2];
          u -= a; return [px0, py1 - u, 3];
        };
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]); c.strokeRect(px0, py0, px1 - px0, py1 - py0); c.setLineDash([]);
        const v = q / Q0 * 0.07;                                    // loop fractions per second
        for (const p of pr) {
          p.s += v * dt;
          const [x, y, side] = pos(p.s);
          const ox = side % 2 === 0 ? 0 : p.o * 8, oy = side % 2 === 0 ? p.o * 8 : 0;
          c.fillStyle = q >= 0 ? C.text : C.warn; c.globalAlpha = 0.85;
          c.beginPath(); c.arc(x + ox, y + oy, 2.2, 0, TAU); c.fill(); c.globalAlpha = 1;
        }
        // arrows on the four sides
        const sgn = q >= 0 ? 1 : -1, thick = clamp(Math.abs(q) / Q0 * 4, 0.8, 8);
        if (Math.abs(q) > 0.05) {
          const ar = (x1_, y1_, x2_, y2_) => kit.arrow(c, x1_, y1_, x2_, y2_, C.accent, thick);
          ar(sgn > 0 ? (px0 + px1) / 2 - 30 : (px0 + px1) / 2 + 30, py0 + 0, sgn > 0 ? (px0 + px1) / 2 + 30 : (px0 + px1) / 2 - 30, py0);
          ar(px1, sgn > 0 ? (py0 + py1) / 2 - 20 : (py0 + py1) / 2 + 20, px1, sgn > 0 ? (py0 + py1) / 2 + 20 : (py0 + py1) / 2 - 20);
          ar(sgn > 0 ? (px0 + px1) / 2 + 30 : (px0 + px1) / 2 - 30, py1, sgn > 0 ? (px0 + px1) / 2 - 30 : (px0 + px1) / 2 + 30, py1);
          ar(px0, sgn > 0 ? (py0 + py1) / 2 + 20 : (py0 + py1) / 2 - 20, px0, sgn > 0 ? (py0 + py1) / 2 - 20 : (py0 + py1) / 2 + 20);
        }
        wrapLines(c, q > 0.05 ? 'Surface current polewards, water sinks at the cold end, deep flow returns below.' : q < -0.05 ? 'REVERSED: the warm, salty column is the denser and sinks at the left.' : 'Stalled: no density difference to drive a flow.', Wd - 24, 11).slice(0, 2).forEach((ln, i) => kit.label(c, ln, Wd / 2, Hh - 50 + i * 14, { align: 'center', size: 11, color: q < 0.05 ? C.bad : C.muted, weight: 600 }));
        // density bars
                kit.label(c, 'density kg/m³: warm ' + rw.toFixed(2) + ' · cold ' + rc.toFixed(2), Wd / 2, Hh - 12, { align: 'center', size: 10.5, color: C.muted });
        ro.set('rw', rw.toFixed(2) + ' kg/m³');
        ro.set('rc', rc.toFixed(2) + ' kg/m³');
        ro.set('d', (d >= 0 ? '+' : '') + d.toFixed(2) + ' kg/m³ (' + (d / REF * 100).toFixed(0) + ' % of the default)');
        ro.set('q', q.toFixed(1) + ' Sv' + (Math.abs(q) > 1e-6 ? ' (' + (Math.abs(q) / 0.209).toFixed(0) + ' Amazons)' : ''));
        ro.set('base', '17 Sv, the order of the measured Atlantic overturning');
        ro.set('tt', Math.abs(q) > 0.05 ? sig(3.1e17 / (Math.abs(q) * 1e6) / 3.156e7, 2) + ' years (Atlantic ≈ 3.1 × 10⁸ km³)' : 'never');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ice and albedo */
  /* A planet with a global energy balance: S0 (1 - albedo) / 4 = eps sigma T^4, where the albedo depends on the ice-covered fraction,
     itself a function of the temperature. Schematic (Budyko 1969 and Sellers 1969 in spirit), but the numbers are the Earth's. */
  Hyper.sim('cyc-ice-albedo', {
    title: 'Ice, albedo and a planet’s thermostat',
    blurb: `Two views of the same effect, chosen with the menu.

**A patch of sea.** Sunshine falls on a sea that is partly ice-covered. Snow-covered ice reflects 80–90 % of it, bare sea ice 50–70 %, open water only about 6 %. Slide the ice fraction and watch the absorbed power: the same sun puts about six times as much heat into open water as into fresh snow.

**A whole planet.** The Sun heats the planet, the planet radiates, and the albedo depends on how much of it is ice-covered; the ice cover depends on the temperature. The graph shows power absorbed (blue) and radiated (orange) as the temperature varies; where they cross the planet is in equilibrium. Where the blue curve has a *steep drop* — the ice line — there can be three crossings: a warm state, a frozen one, and an unstable one between. Slide the Sun's output down slowly and the planet stays warm until the warm state disappears — then it plunges into a snowball. Turn the Sun back up and it stays frozen far beyond the point where it fell: *hysteresis*.

The model has the Earth's real numbers (solar constant 1,361 W/m², albedo 0.30 without ice) but a crude ice line; it shows the *logic* of the ice–albedo feedback, not a climate forecast. The Arctic's September ice extent has fallen from roughly 7 million km² in the early 1980s to about 4–5 million km² in the 2010s and 2020s (NSIDC).

**Try this**
- Patch view: set snow on ice at 100 %, then 0 %: how many times more heat is absorbed?
- Planet view: lower the Sun by 1 % at a time, with a high time speed, until the planet freezes; then raise it.
- Strengthen the greenhouse (lower the emissivity) and see how far the Sun must fall before the planet freezes.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 250, maxH: 320 });
      const graph = document.createElement('div'); graph.style.padding = '4px 8px 8px'; box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'mean temperature (°C)', min: -70, max: 50 }, y: { label: 'power (W/m²)', min: 60, max: 420 }, legend: true }, 230);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['A patch of sea', 'patch'], ['A whole planet', 'planet']], value: params.view || 'patch' },
        { id: 'f', label: 'Ice cover of the patch', min: 0, max: 100, step: 1, value: 60, unit: '%' },
        { id: 'surf', type: 'select', label: 'Surface of the ice', options: [['Snow-covered ice (0.85)', 0.85], ['Bare sea ice (0.60)', 0.6], ['Melt-pond ice (0.40)', 0.4], ['Dirty, old ice (0.30)', 0.3]], value: 0.85 },
        { id: 'sun', label: 'Sunlight on the surface', min: 50, max: 400, step: 5, value: 200, unit: 'W/m²' },
        { id: 'mu', label: 'Sun’s output', min: 85, max: 115, step: 0.5, value: 100, unit: '%' },
        { id: 'eps', label: 'Planet’s emissivity (lower = more greenhouse)', min: 0.5, max: 0.8, step: 0.005, value: 0.612 },
        { id: 'ai', label: 'Albedo of an iced-over planet', min: 0.45, max: 0.8, step: 0.01, value: 0.62 },
        { id: 'speed', label: 'Time speed', min: 1, max: 200, step: 1, value: 40, unit: 'yr/s', log: true },
        { type: 'buttons', items: [{ id: 'warm', label: 'Start warm', primary: true }, { id: 'cold', label: 'Start frozen' }] }
      ], (id) => { if (id === 'warm') Tst = 288; if (id === 'cold') Tst = 235; fit(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Albedo'], ['b', 'Absorbed'], ['c', 'Reflected'], ['d', 'Open water vs ice'], ['e', 'Temperature'], ['f', 'Ice cover'], ['g', 'Equilibria']]);
      const SIG = 5.670374e-8, S0 = 1361, CAP = 5e8;           // CAP: J/(m² K), a 120 m ocean layer
      let Tst = 288;
      const alpha = (T) => { const f = clamp((283 - T) / 20, 0, 1); return 0.30 + f * (V.ai - 0.30); };
      const iceFrac = (T) => clamp((283 - T) / 20, 0, 1);
      const net = (T) => S0 * V.mu / 100 / 4 * (1 - alpha(T)) - V.eps * SIG * T * T * T * T;
      function equilibria() {
        const out = []; let prev = net(180);
        for (let T = 180.2; T <= 360; T += 0.2) {
          const g = net(T);
          if ((prev > 0) !== (g > 0)) out.push({ T: T - 0.1, stable: prev > 0 && g < 0 });
          prev = g;
        }
        return out;
      }
      const fit = () => {
        const pt = V.view === 'patch';
        ['f', 'surf', 'sun'].forEach(id => ctl.show(id, pt));
        ['mu', 'eps', 'ai', 'speed', 'warm', 'cold'].forEach(id => ctl.show(id, !pt));
        graph.style.display = pt ? 'none' : '';
        ['a', 'b', 'c', 'd'].forEach(k => ro.show(k, true));
        ['e', 'f', 'g'].forEach(k => ro.show(k, !pt));
      };
      fit();
      /* the select's change must also refit: wrap by polling the value each frame */
      let lastView = V.view;
      const loop = kit.loop((dt) => {
        if (V.view !== lastView) { lastView = V.view; fit(); }
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.view === 'patch') {
          const f = V.f / 100, ai = V.surf, aw = 0.06, I = V.sun;
          const al = f * ai + (1 - f) * aw;
          const tiles = [['open water', aw, 'rgba(40,110,200,0.85)'], ['bare sea ice', 0.6, 'rgba(210,230,245,0.9)'], ['snow on ice', 0.85, 'rgba(245,250,255,0.95)'], ['your patch', al, null]];
          const tw = (Wd - 34) / 4, ty = 56, th = Hh - 150;
          tiles.forEach((tl, i) => {
            const x = 14 + i * (tw + 4);
            if (tl[2]) { c.fillStyle = tl[2]; c.fillRect(x, ty + th * 0.4, tw - 4, th * 0.6); }
            else {
              c.fillStyle = 'rgba(40,110,200,0.85)'; c.fillRect(x, ty + th * 0.4, tw - 4, th * 0.6);
              c.fillStyle = V.surf > 0.7 ? 'rgba(245,250,255,0.95)' : 'rgba(210,230,245,0.9)';
              const nPieces = 7;
              for (let k = 0; k < nPieces; k++) { const w = (tw - 4) / nPieces; if ((k + 0.5) / nPieces <= f) c.fillRect(x + k * w, ty + th * 0.4, w + 0.5, th * 0.6); }
            }
            c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x + 0.5, ty + th * 0.4 + 0.5, tw - 5, th * 0.6);
            // incoming (down) and reflected (up) arrows
            const mx = x + (tw - 4) / 2;
            kit.arrow(c, mx - 12, ty - 4, mx - 12, ty + th * 0.4, C.warn, 3);
            const refl = tl[1];
            kit.arrow(c, mx + 12, ty + th * 0.4, mx + 12, ty + th * 0.4 - Math.max(6, th * 0.36 * refl), C.warn, Math.max(1, 3 * refl));
            wrapLines(c, tl[0], tw - 2, 10.5).forEach((ln, k, arr) => kit.label(c, ln, x + (tw - 4) / 2, ty - 16 - (arr.length - 1 - k) * 12, { align: 'center', size: 10.5, weight: 650 }));
            kit.label(c, 'albedo ' + tl[1].toFixed(2), x + (tw - 4) / 2, ty + th + 14, { align: 'center', size: 10.5 });
            kit.label(c, 'absorbs', x + (tw - 4) / 2, ty + th + 28, { align: 'center', size: 10, color: C.muted });
            kit.label(c, (I * (1 - tl[1])).toFixed(0) + ' W/m²', x + (tw - 4) / 2, ty + th + 41, { align: 'center', size: 10.5, color: C.accent, weight: 650 });
          });
          ro.set('a', al.toFixed(2));
          ro.set('b', (I * (1 - al)).toFixed(0) + ' W/m² of ' + I + ' W/m²');
          ro.set('c', (I * al).toFixed(0) + ' W/m² sent back to space');
          const melt = (I * (1 - al)) > 0 ? 917 * W.LATENT_FUSION / (I * (1 - al)) / 86400 : Infinity;
          ro.set('d', 'open water absorbs ' + (1 - aw).toFixed(2) + ' of the sunshine, snow on ice ' + (1 - 0.85).toFixed(2) + ': ' + ((1 - aw) / 0.15).toFixed(1) + ' × more');
          ro.show('e', false); ro.show('f', false); ro.show('g', false);
          c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif';
          wrapLines(c, 'Melting 1 m of ice at 0 °C with all this absorbed heat would take ' + (Number.isFinite(melt) ? melt.toFixed(0) + ' days.' : '—'), Wd - 20, 10.5).slice(0, 2).forEach((ln, i) => kit.label(c, ln, Wd / 2, Hh - 22 + i * 12, { align: 'center', size: 10.5, color: C.muted }));
        } else {
          // evolve the temperature
          const years = dt * V.speed, nsub = Math.max(1, Math.ceil(years / 0.05)), h = years / nsub * 3.156e7;
          for (let i = 0; i < nsub; i++) { Tst += net(Tst) / CAP * h; Tst = clamp(Tst, 150, 400); }
          const eq = equilibria();
          const pA = [], pE = [];
          for (let TC = -70; TC <= 50; TC += 1) { const Tk = TC + 273.15; pA.push([TC, S0 * V.mu / 100 / 4 * (1 - alpha(Tk))]); pE.push([TC, V.eps * SIG * Math.pow(Tk, 4)]); }
          plot.set({ series: [{ pts: pA, label: 'absorbed sunlight', color: C.accent }, { pts: pE, label: 'radiated heat', color: C.warn }], x: { label: 'mean temperature (°C)', min: -70, max: 50 }, y: { label: 'power (W/m²)', min: 60, max: 420 }, marks: eq.map(e => ({ x: e.T - 273.15, y: V.eps * SIG * Math.pow(e.T, 4), color: e.stable ? C.ok : C.faint, r: 4 })).concat([{ x: Tst - 273.15, y: V.eps * SIG * Math.pow(Tst, 4), label: 'planet now', color: C.bad, r: 6.5 }]) });
          // the planet drawn with its ice caps
          const R = Math.min(Hh * 0.36, Wd * 0.16), cx = Wd * 0.2, cy = Hh * 0.5, fi = iceFrac(Tst);
          c.fillStyle = 'rgba(70,150,235,0.55)'; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fill();
          c.save(); c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.clip();
          c.fillStyle = 'rgba(245,250,255,0.95)';
          // ice from both poles: a cap of height R * fi at the top and at the bottom
          c.fillRect(cx - R, cy - R, 2 * R, R * (2 * fi) / 2 + 0.01); c.fillRect(cx - R, cy + R - R * (2 * fi) / 2, 2 * R, R * (2 * fi) / 2 + 0.01);
          c.restore();
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.stroke();
          kit.label(c, (Tst - 273.15).toFixed(1) + ' °C', cx, cy + R + 16, { align: 'center', size: 12, weight: 650 });
          const stab = eq.filter(e => e.stable).map(e => (e.T - 273.15).toFixed(0) + ' °C'), uns = eq.filter(e => !e.stable).map(e => (e.T - 273.15).toFixed(0) + ' °C');
          kit.label(c, 'Sun ' + V.mu.toFixed(1) + ' % of today · emissivity ' + V.eps.toFixed(3), Wd * 0.4, 30, { size: 12 });
          kit.label(c, 'stable states: ' + (stab.join(' and ') || 'none'), Wd * 0.4, 56, { size: 12, color: C.ok, weight: 650 });
          kit.label(c, 'unstable state: ' + (uns.join(', ') || 'none'), Wd * 0.4, 78, { size: 12, color: C.muted });
          kit.label(c, Tst - 273.15 < -15 ? 'a snowball: ice reflects ' + (alpha(Tst) * 100).toFixed(0) + ' % of the sunshine' : Tst - 273.15 > 5 ? 'warm state: much of the planet is ice-free' : 'in transition', Wd * 0.4, 110, { size: 12, color: C.text, weight: 600 });
          ro.set('a', alpha(Tst).toFixed(2));
          ro.set('b', (S0 * V.mu / 100 / 4 * (1 - alpha(Tst))).toFixed(0) + ' W/m²');
          ro.set('c', (S0 * V.mu / 100 / 4 * alpha(Tst)).toFixed(0) + ' W/m² reflected');
          ro.set('d', 'a snowball reflects ' + (V.ai * 100).toFixed(0) + ' %, the ice-free planet 30 %');
          ro.set('e', (Tst - 273.15).toFixed(1) + ' °C (' + Tst.toFixed(1) + ' K)');
          ro.set('f', (fi * 100).toFixed(0) + ' % of the planet');
          ro.set('g', eq.length ? eq.map(e => (e.T - 273.15).toFixed(0) + ' °C ' + (e.stable ? '(stable)' : '(unstable)')).join(', ') : 'none');
          ['e', 'f', 'g'].forEach(k => ro.show(k, true));
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the tides */
  /* the equilibrium tide: zeta = (M/Me)(R/d)^3 R (3 cos^2 psi - 1)/2 for each body, psi the angle from the body's direction.
     No basins, no friction, no Coriolis (schematic): the open-ocean tide before resonance is added; "basin resonance" is a plain multiplier. */
  Hyper.sim('cyc-tides', {
    title: 'The Moon, the Sun and the two bulges',
    blurb: `The Earth seen from above its north pole, with the Sun far to the right. The Moon pulls the near side of the Earth harder than the middle and the middle harder than the far side; relative to the Earth's centre the water is stretched along the Earth–Moon line into **two bulges**, one facing the Moon and one facing away. The Sun does the same with a bulge 46 % as high (the same formula with the Sun's mass and distance). The planet turns under the bulges, so a place passes through two high tides a day — every 12 h 25 min, because the Moon has moved on by the time the Earth has turned once.

The graph is the tide at the marked place on the equator over a month. When Sun and Moon line up (new and full moon) the bulges add: **spring tides**. At the quarters they cross: **neap tides**. Real tides are not this: coasts, shelves and basins can amplify the open-ocean tide many times, and the *basin resonance* slider multiplies it (a factor of about 20 reproduces the Bay of Fundy). The bulges are drawn enormously exaggerated; the Moon's distance is not to scale.

**Try this**
- Play it and watch the tide gauge: two highs a day, each about 50 minutes later than yesterday's.
- Set the day to 0 (new moon), 7.4 (first quarter), 14.8 (full), 22 (last quarter) and read the range: spring 0.78 m of open-ocean tide, neap 0.29 m.
- Raise the basin resonance to 20: the spring range comes out at 15–16 m.
- Turn the exaggeration up and see why the bulge is *not* a hill of water that travels around the world: the water is stretched by the Moon's differential pull.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 420 });
      const graph = document.createElement('div'); graph.style.padding = '4px 8px 8px'; box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'day of the lunar month', min: 0, max: 30 }, y: { label: 'tide height (m)' }, legend: true }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'play', type: 'check', label: 'Run', value: true },
        { id: 'day', label: 'Day of the lunar month (0 = new moon)', min: 0, max: 29.5, step: 0.1, value: params.day != null ? params.day : 0, unit: 'd' },
        { id: 'speed', label: 'Speed', min: 0.05, max: 3, step: 0.05, value: 0.4, unit: 'days/s', log: true },
        { id: 'exag', label: 'Bulge drawn bigger by', min: 1, max: 10, step: 0.5, value: 4, unit: '× million' },
        { id: 'amp', label: 'Basin resonance (multiplier)', min: 1, max: 25, step: 1, value: params.amp || 1 }
      ], (id) => { if (id === 'day') t = ctl.values.day; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Moon'], ['am', 'Moon’s bulge'], ['as', 'Sun’s bulge'], ['ratio', 'Sun ÷ Moon'], ['spring', 'Spring range'], ['neap', 'Neap range'], ['now', 'Tide here now'], ['per', 'Time between high tides']]);
      const G = 6.674e-11, Mm = 7.342e22, Ms = 1.989e30, Me = 5.972e24, dm = 3.844e8, ds = 1.496e11, Rr = 6.371e6;
      const Am = Mm / Me * Math.pow(Rr / dm, 3) * Rr, As = Ms / Me * Math.pow(Rr / ds, 3) * Rr;       // m: height of the bulge on the axis
      const P2 = (c) => (3 * c * c - 1) / 2;
      const SYN = 29.53;
      let t = V.day;
      const tideAt = (tt, which) => {
        const phi = TAU * tt, alpha = TAU * tt / SYN;                  // observer and Moon, measured from the Sun's direction
        const m = Am * (P2(Math.cos(phi - alpha)) - 0.25), s = As * (P2(Math.cos(phi)) - 0.25);          // about the mean level at the equator
        return which === 'm' ? m : which === 's' ? s : m + s;
      };
      let cacheAmp = -1, series = null;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.play) { t += dt * V.speed; if (t > 29.5) t -= SYN; ctl.set('day', Math.max(0, t), false); }
        t = ((t % SYN) + SYN) % SYN;
        const amp = V.amp;
        if (cacheAmp !== amp || !series) {
          cacheAmp = amp; series = { tot: [], up: [], lo: [] };
          for (let d = 0; d <= 30.001; d += 0.04) {
            series.tot.push([d, tideAt(d) * amp]);
            // the envelope of the high and low waters: the two semi-diurnal waves of heights 3Am/4 and 3As/4 add with the phase 2 alpha between them
            const mean = 0, env = 0.75 * Math.sqrt(Am * Am + As * As + 2 * Am * As * Math.cos(2 * TAU * d / SYN));
            series.up.push([d, (mean + env) * amp]); series.lo.push([d, (mean - env) * amp]);
          }
        }
        const R = Math.min(Hh * 0.27, Wd * 0.13), cx = Wd * 0.36, cy = Hh * 0.5;
        const pxm = R * V.exag * 1e6 / Rr;                              // pixels per metre of tide, drawn
        // the sun
        kit.arrow(c, cx + R * 2.2, cy, Math.min(Wd - 40, cx + R * 3.6), cy, C.warn, 3);
        kit.label(c, 'to the Sun', Math.min(Wd - 20, cx + R * 3.6), cy - 14, { align: 'right', size: 11, color: C.warn });
        // the water outline
        const phi = TAU * t, alpha = TAU * t / SYN;
        c.beginPath();
        for (let i = 0; i <= 180; i++) {
          const a = i / 180 * TAU, h = Am * P2(Math.cos(a - alpha)) + As * P2(Math.cos(a));
          const r = R + pxm * h;
          const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
          if (i === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
        c.closePath(); c.fillStyle = 'rgba(70,150,235,0.45)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke();
        // the solid earth
        c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.axis; c.lineWidth = 1; c.stroke();
        // the Moon
        const mr = R * 2.1, mx = cx + mr * Math.cos(alpha), my = cy - mr * Math.sin(alpha);
        c.setLineDash([3, 4]); c.strokeStyle = C.faint; c.beginPath(); c.arc(cx, cy, mr, 0, TAU); c.stroke(); c.setLineDash([]);
        kit.dot(c, mx, my, Math.max(5, R * 0.17), C.text, C.axis);
        kit.label(c, 'Moon', mx + 10, my - 10, { size: 11 });
        kit.arrow(c, mx - (mx - cx) * 0.2, my - (my - cy) * 0.2, cx + (mx - cx) * 0.55, cy + (my - cy) * 0.55, C.muted, 1.5);
        // the observer
        const ox = cx + (R + 4) * Math.cos(phi), oy = cy - (R + 4) * Math.sin(phi);
        kit.dot(c, ox, oy, 5, C.bad, C.bg2);
        kit.label(c, 'you', ox + 8 * Math.cos(phi), oy - 8 * Math.sin(phi) - 4, { size: 11, color: C.bad, weight: 650 });
        kit.label(c, 'Earth turns anticlockwise once a day', cx, cy + R * 1.65 + 14, { align: 'center', size: 10.5, color: C.muted });
        // the phase
        const age = t, phase = age < 1.0 || age > SYN - 1 ? 'new moon' : age < 6.4 ? 'waxing crescent' : age < 8.4 ? 'first quarter' : age < 13.8 ? 'waxing gibbous' : age < 15.8 ? 'full moon' : age < 21.2 ? 'waning gibbous' : age < 23.2 ? 'last quarter' : 'waning crescent';
        const h = tideAt(t) * amp;
        // the tide graph
        plot.set({ series: [{ pts: series.tot, label: 'Moon + Sun', color: C.accent }, { pts: series.up, label: 'high-water envelope', color: C.warn, dash: [4, 4] }, { pts: series.lo, color: C.warn, dash: [4, 4] }], x: { label: 'day of the lunar month', min: 0, max: 30 }, y: { label: 'tide height (m)' }, vlines: [{ x: t, label: 'now' }], marks: [{ x: t, y: h, color: C.bad }] });
        const spring = 1.5 * (Am + As) * amp, neap = 1.5 * (Am - As) * amp;
        ro.set('ph', 'day ' + age.toFixed(1) + ' — ' + phase);
        ro.set('am', Am.toFixed(2) + ' m high, ' + (1.5 * Am).toFixed(2) + ' m from trough to crest');
        ro.set('as', As.toFixed(2) + ' m high');
        ro.set('ratio', (As / Am * 100).toFixed(0) + ' %');
        ro.set('spring', spring.toFixed(2) + ' m');
        ro.set('neap', neap.toFixed(2) + ' m');
        ro.set('now', (h >= 0 ? '+' : '') + h.toFixed(2) + ' m');
        ro.set('per', '12 h 25 min for the Moon’s tide (the Sun’s: 12 h)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rivers and groundwater */
  /* a one-dimensional unconfined aquifer between two rivers (the Dupuit-Boussinesq equation), solved implicitly on 80 cells:
       Sy dh/dt = d/dx( K h dh/dx ) + R - P(x)          Darcy's law q = -K h dh/dx per metre of width. Schematic: homogeneous, flat base. */
  Hyper.sim('cyc-aquifer', {
    title: 'An aquifer between two rivers, and a field of wells',
    blurb: `A cross-section of sand and gravel 10 km wide, resting on a flat bed of clay. Rain that soaks in (*recharge*) raises the water table into a low hill between the two rivers, and the water runs downhill through the pores to the rivers, at the speed Darcy's law gives: the **hydraulic conductivity** K times the slope of the water table. The vertical scale is exaggerated about fifty times.

The wells in the middle are switched on: they take water at a rate you choose over 1.6 km of the plain (untick *Wells on* and press the button for the natural state). At first the water table sinks around them and the rivers lose a little of their inflow; if the total pumping stays below the total recharge, the table settles at a new level. If it exceeds it, the aquifer is *mined*: the water table sinks for as long as the pumping lasts, because the water comes out of storage. The recharge of the real Ogallala Aquifer in the dry southern High Plains is a few millimetres a year; the pumping has been tens of times that.

The model is the one-dimensional Dupuit–Boussinesq equation, solved on 80 cells. It is homogeneous and has a flat base; real aquifers are neither. The numbers (K, specific yield 0.15) are those of a clean sand.

**Try this**
- Natural state: the pumping off, raise K from 1 to 50 m/day (clean gravel) and watch the water table flatten: the same recharge leaves through a gentler slope.
- Pump 300 mm/yr with a recharge of 100: how fast does the centre sink, and where does the water table stabilise? Then 600.
- Lower the recharge to 20 mm/yr (a dry region) and pump 200 mm/yr over the wells' zone: the whole pumping (320 m³/day per metre of width) exceeds the whole recharge (200), so the aquifer is being mined — read the years left.
- Compare the Darcy flux at the river bank before and after: the wells *capture* water that was going to the river.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'K', label: 'Hydraulic conductivity K', min: 0.05, max: 100, step: 0.05, value: params.K || 5, unit: 'm/day', log: true, sig: 2 },
        { id: 'R', label: 'Recharge (rain that soaks in)', min: 0, max: 400, step: 5, value: params.R != null ? params.R : 100, unit: 'mm/yr' },
        { id: 'Pm', label: 'Pumping, over the wells’ zone', min: 0, max: 1500, step: 25, value: 400, unit: 'mm/yr' },
        { id: 'pump', type: 'check', label: 'Wells on', value: params.pump !== false },
        { id: 'speed', label: 'Time speed', min: 0.5, max: 100, step: 0.5, value: 8, unit: 'yr/s', log: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Back to the natural state', primary: true }] }
      ], (id) => { if (id === 'reset') spin(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['q', 'Flux to a river (Darcy)'], ['rec', 'Recharge over the aquifer'], ['pmp', 'Pumping'], ['dc', 'Water table under the wells'], ['rate', 'Change under the wells'], ['yrs', 'Dry beneath the wells in']]);
      const N = 80, L = 10000, dx = L / N, Sy = 0.15, HB = 40, GROUND = 80;       // cells, width m, spacing m, specific yield, river stage m, ground level m
      const h = new Float64Array(N + 1).fill(HB);
      const a = new Float64Array(N + 1), b = new Float64Array(N + 1), cc = new Float64Array(N + 1), d = new Float64Array(N + 1), cp = new Float64Array(N + 1), dp = new Float64Array(N + 1);
      const inZone = (i) => { const x = i * dx; return x >= 4200 && x <= 5800; };
      let years = 0, hc0 = HB, lastRate = 0, lastHc = HB, tRate = 0;
      /* one implicit step of dtDays days; pumping in mm/yr -> m/day */
      function step(dtDays, pumping) {
        const Rm = V.R / 1000 / 365.25, Pm = pumping ? V.Pm / 1000 / 365.25 : 0, K = V.K;
        for (let i = 1; i < N; i++) {
          const hw = 0.5 * (h[i - 1] + h[i]), he = 0.5 * (h[i] + h[i + 1]);
          const aw = K * hw / (dx * dx), ae = K * he / (dx * dx);
          a[i] = -aw * dtDays / Sy; c_(i, -ae * dtDays / Sy);
          b[i] = 1 + (aw + ae) * dtDays / Sy;
          const p = (inZone(i) && h[i] > 1) ? Pm : 0;
          d[i] = h[i] + (Rm - p) * dtDays / Sy;
        }
        // boundary: fixed heads
        d[1] -= a[1] * HB; a[1] = 0; d[N - 1] -= cc[N - 1] * HB; cc[N - 1] = 0;
        // Thomas algorithm on 1..N-1
        cp[1] = cc[1] / b[1]; dp[1] = d[1] / b[1];
        for (let i = 2; i < N; i++) { const m = b[i] - a[i] * cp[i - 1]; cp[i] = cc[i] / m; dp[i] = (d[i] - a[i] * dp[i - 1]) / m; }
        h[N - 1] = dp[N - 1];
        for (let i = N - 2; i >= 1; i--) h[i] = dp[i] - cp[i] * h[i + 1];
        for (let i = 1; i < N; i++) h[i] = Math.max(0.2, Math.min(h[i], GROUND - 1));
        years += dtDays / 365.25;
      }
      function c_(i, v) { cc[i] = v; }
      function spin() {
        h.fill(HB);
        for (let i = 0; i < 200; i++) step(5000, false);
        years = 0; lastHc = h[N / 2]; tRate = 0; lastRate = 0; hc0 = h[N / 2];
      }
      spin();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        // advance
        let yrs = dt * V.speed, dtDays = 10;
        const n = Math.min(400, Math.max(1, Math.round(yrs * 365.25 / dtDays)));
        for (let i = 0; i < n; i++) step(dtDays, V.pump);
        tRate += yrs;
        if (tRate > 0.5) { lastRate = (h[N / 2] - lastHc) / tRate; lastHc = h[N / 2]; tRate = 0; }
        // geometry
        const x0 = 14, x1 = Wd - 14, yb = Hh - 34, yt = 34, vs = (yb - yt) / 100;       // 100 m of height over the panel
        const X = (x) => x0 + x / L * (x1 - x0), Y = (z) => yb - z * vs;
        // ground
        c.fillStyle = 'rgba(160,130,90,0.35)'; c.fillRect(x0, Y(GROUND), x1 - x0, yb - Y(GROUND));
        // saturated zone
        c.beginPath(); c.moveTo(X(0), yb);
        for (let i = 0; i <= N; i++) c.lineTo(X(i * dx), Y(h[i]));
        c.lineTo(X(L), yb); c.closePath(); c.fillStyle = 'rgba(70,150,235,0.5)'; c.fill();
        c.beginPath(); for (let i = 0; i <= N; i++) { if (i === 0) c.moveTo(X(i * dx), Y(h[i])); else c.lineTo(X(i * dx), Y(h[i])); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        c.fillStyle = 'rgba(100,90,80,0.7)'; c.fillRect(x0, yb, x1 - x0, 10);
        kit.label(c, 'clay (the base)', x0 + 6, yb + 22, { size: 10.5, color: C.muted });
        kit.label(c, 'river', x0 + 4, Y(HB) - 14, { size: 10.5, color: C.accent });
        kit.label(c, 'river', x1 - 4, Y(HB) - 14, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'water table', X(L * 0.28), Y(h[Math.round(N * 0.28)]) - 8, { size: 11, color: C.accent, weight: 650 });
        // rain
        for (let i = 0; i < 12; i++) kit.arrow(c, X(L * (i + 0.5) / 12), 8, X(L * (i + 0.5) / 12), 8 + 4 + V.R / 400 * 18, C.series[1], 1.5);
        kit.label(c, 'recharge ' + V.R + ' mm/yr', x0 + 6, 46, { size: 10.5, color: C.muted });
        // wells
        const xs = [4400, 4800, 5200, 5600];
        for (const w of xs) {
          c.strokeStyle = V.pump ? C.bad : C.faint; c.lineWidth = 2;
          c.beginPath(); c.moveTo(X(w), Y(GROUND) - 10); c.lineTo(X(w), Y(Math.max(2, h[Math.round(w / dx)] - 6))); c.stroke();
          if (V.pump) kit.arrow(c, X(w), Y(GROUND) - 4, X(w), Y(GROUND) - 24 - V.Pm / 1500 * 12, C.bad, 2);
        }
        // Darcy flux arrows along the table
        for (const i of [8, 20, 60, 72]) {
          const q = -V.K * (0.5 * (h[i] + h[i + 1])) * (h[i + 1] - h[i]) / dx;                // m²/day, positive to the right
          const len = clamp(Math.abs(q) / 5 * 40 + 8, 8, 60) * Math.sign(q || 1);
          const xm = X(i * dx), ym = Y(0.5 * (h[i] + h[i + 1])) + 16;
          kit.arrow(c, xm - len / 2, ym, xm + len / 2, ym, C.ok, 2.2);
        }
        const qL = -V.K * 0.5 * (h[0] + h[1]) * (h[1] - h[0]) / dx, qR = -V.K * 0.5 * (h[N - 1] + h[N]) * (h[N] - h[N - 1]) / dx;
        const rechargeTot = V.R / 1000 / 365.25 * L;                                          // m²/day per metre of width
        const pumpTot = V.pump ? V.Pm / 1000 / 365.25 * 1600 : 0;
        const hc = h[N / 2];
        ro.set('t', years.toFixed(1) + ' years');
        ro.set('q', 'left ' + (-qL).toFixed(2) + ' · right ' + qR.toFixed(2) + ' m³/day per metre of river (arrows: Darcy flux)');
        ro.set('rec', rechargeTot.toFixed(1) + ' m³/day per metre of width');
        ro.set('pmp', pumpTot.toFixed(1) + ' m³/day per metre of width (' + (rechargeTot > 0 ? (pumpTot / rechargeTot * 100).toFixed(0) + ' % of the recharge' : 'no recharge') + ')');
        ro.set('dc', hc.toFixed(1) + ' m above the base (' + (hc - hc0 >= 0 ? '+' : '') + (hc - hc0).toFixed(1) + ' m since the start)');
        ro.set('rate', (lastRate >= 0 ? '+' : '') + lastRate.toFixed(2) + ' m per year');
        ro.set('yrs', lastRate < -0.005 ? (hc / -lastRate).toFixed(0) + ' years at this rate' : lastRate > 0.005 ? 'rising' : 'steady');
      }, box.stage);
      loop.start();
    }
  });
})();
