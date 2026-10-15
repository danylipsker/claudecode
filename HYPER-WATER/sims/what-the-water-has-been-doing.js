/* HYPER-WATER · sims/what-the-water-has-been-doing.js — the simulations of the topic "What the water has been doing".
 *   geo-river       a river profile cut by stream power: knickpoints, a cap-rock waterfall, and Hjulström's chart for the flow there
 *   geo-limestone   rain made acid by CO2 dissolving a block of limestone along its joints (a cellular model)
 *   geo-glacier     a V-shaped valley under ice becoming a U; and the land rising after the ice has gone
 *   geo-frost       freeze-thaw cycles working on a crack in a boulder
 *   geo-geyser      a geyser column heated from below: the boiling point rises with depth
 *   geo-earth       the Earth's layers and their water; flux melting above a slab; water on faults (three views)
 *   geo-origin      the D/H fingerprint: mix the candidate sources and compare with the ocean
 *   geo-time        the deep time of water: a timeline with the faint young Sun, and the rise of oxygen (two views)
 * Numbers that the engine owns (densities, boiling points, Henry's constants, D/H ratios) come from kit.water. The
 * erosion, dissolution, glacier, frost, geyser and oxygen models are small schematic models, named as such in the
 * blurbs: they show how the quantities depend on each other, not a forecast of any real river, cave or rock.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mix = (a, b, f) => a + (b - a) * f;

  /* log–log interpolation in a table of [x, y] */
  function logInterp(tab, d) {
    if (d <= tab[0][0]) return tab[0][1];
    for (let i = 1; i < tab.length; i++) {
      if (d <= tab[i][0]) {
        const x0 = tab[i - 1][0], y0 = tab[i - 1][1], x1 = tab[i][0], y1 = tab[i][1];
        const f = Math.log(d / x0) / Math.log(x1 / x0);
        return Math.exp(Math.log(y0) + f * (Math.log(y1) - Math.log(y0)));
      }
    }
    return tab[tab.length - 1][1];
  }
  /* the shape of Hjulström's 1935 diagram, redrawn approximately: grain size (mm) -> speed (cm/s) */
  const HJ_ERODE = [[0.001, 400], [0.01, 80], [0.05, 30], [0.3, 20], [1, 25], [10, 100], [100, 350], [1000, 900]];
  const HJ_FALL = [[0.001, 0.0005], [0.01, 0.05], [0.1, 1], [1, 10], [10, 70], [100, 250], [1000, 800]];
  const logSpace = (a, b, n) => { const out = []; for (let i = 0; i <= n; i++) out.push(a * Math.pow(b / a, i / n)); return out; };

  /* a small seeded random generator */
  function rng(seed) { let s = (seed >>> 0) || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ================================================================ a river cuts down */
  Hyper.sim('geo-river', {
    title: 'A river cuts down',
    blurb: `A river profile from the divide (left) to the sea (right), cut by **stream power**: the lowering of the bed is proportional to the drainage area to the half power times the slope, while the land is pushed up at a steady rate. The graph below is **Hjulström's chart** for the flow at the place you choose — the speed of the water against the size of the grains. This is a *schematic* model (one channel, one rock, a constant runoff of 1 m a year), not a model of any real river.

**Try this**
- Press *Drop the sea level*: a **knickpoint** — a step in the profile, a waterfall or a rapid — forms at the mouth and travels upstream. Read its speed in the read-outs and watch the reach below it settle into the new grade.
- Tick *a hard cap-rock band* and reset: the river cannot cut the hard layer as fast as the soft rock around it, so it keeps a steep step there, as the Niagara River does at its falls.
- Double the rainfall: more water, more stream power, a lower and gentler profile — and a faster retreat of every knickpoint.
- Slide *Look at the river* along the channel. Where the slope is steep the water is fast and can lift gravel; near the mouth only sand and silt are moved. Compare the speed with the two curves of the chart.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 240, maxH: 340 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const N = 100;                 // nodes, 1 km apart, from the divide (i = 0) to the mouth (i = N - 1)
      const ctl = kit.controls(box.side, [
        { id: 'U', label: 'Uplift of the land', min: 0.02, max: 0.5, step: 0.01, value: 0.1, unit: 'mm/yr' },
        { id: 'K', label: 'Softness of the rock', min: 0.2, max: 3, step: 0.1, value: 1 },
        { id: 'rain', label: 'Rainfall (runoff)', min: 0.3, max: 3, step: 0.1, value: 1, unit: '×' },
        { id: 'drop', label: 'Fall of the sea level', min: 50, max: 500, step: 25, value: 200, unit: 'm' },
        { id: 'cap', type: 'check', label: 'A hard cap-rock band (like Niagara)', value: !!params.cap },
        { id: 'speed', label: 'Time speed', min: 0.02, max: 1, step: 0.01, value: 0.12, unit: 'Myr/s' },
        { id: 'xs', label: 'Look at the river', min: 2, max: 98, step: 1, value: 60, unit: 'km from the divide' },
        { type: 'buttons', items: [{ id: 'fall', label: 'Drop the sea level', primary: true }, { id: 'reset', label: 'Reset to a graded river' }] }
      ], (id) => {
        if (id === 'fall') { base -= V.drop; kpPrev = null; }
        else if (id === 'reset' || id === 'cap') reset();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time since the start'], ['relief', 'Relief of the river'], ['kp', 'Knickpoint'], ['ret', 'Knickpoint retreat'], ['S', 'Slope where you look'], ['Q', 'Discharge there'], ['om', 'Stream power there'], ['v', 'Speed of the water there'], ['grain', 'Largest grain it can pick up']]);
      const z = new Float64Array(N), A = new Float64Array(N), Kl = new Float64Array(N), sq = new Float64Array(N);
      for (let i = 0; i < N; i++) { A[i] = 0.7 * Math.pow(i + 0.5, 1.67); sq[i] = Math.sqrt(A[i]); }
      let base = 0, T = 0, kpPrev = null, retreat = NaN, lastKpT = 0;
      const hard = i => V.cap && i >= 38 && i <= 43;
      const kloc = i => V.K * V.rain * (hard(i) ? 0.12 : 1);
      function reset() {
        base = 0; T = 0; kpPrev = null; retreat = NaN;
        z[N - 1] = 0;
        for (let i = N - 2; i >= 0; i--) z[i] = z[i + 1] + (V.U / (V.K * V.rain * (hard(i) ? 0.12 : 1) * sq[i])) * 1000;
      }
      reset();
      function advance(h) {
        let cmax = 0;
        for (let i = 0; i < N - 1; i++) { Kl[i] = kloc(i); cmax = Math.max(cmax, Kl[i] * sq[i]); }
        const dtmax = 0.4 / Math.max(cmax, 1e-6);
        const n = Math.min(600, Math.max(1, Math.ceil(h / dtmax))), dt = h / n;
        const dz = new Float64Array(N);
        for (let s = 0; s < n; s++) {
          for (let i = 0; i < N - 1; i++) {
            const S = (z[i] - z[i + 1]) / 1000;
            const E = S > 0 ? Kl[i] * sq[i] * S : 0;
            dz[i] = (V.U - E) * dt * 1000;
          }
          for (let i = 0; i < N - 1; i++) z[i] = Math.max(z[i + 1], z[i] + dz[i]);
          z[N - 1] = base;
        }
        T += h;
      }
      function findKnick() {
        let best = -1, br = 2.2;
        for (let i = 1; i < N - 3; i++) {
          const S = (z[i] - z[i + 1]) / 1000, Se = V.U / (kloc(i) * sq[i]);
          if (hard(i)) continue;
          const r = S / Se;
          if (r > br) { br = r; best = i; }
        }
        return best;
      }
      const hjx = logSpace(0.001, 1000, 60);
      const plot = kit.plot(graph, { x: { label: 'grain size (mm)', log: true, min: 0.001, max: 1000 }, y: { label: 'speed of the water (cm/s)', log: true, min: 0.1, max: 1000 }, legend: true }, 200);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        advance(Math.min(dt, 0.05) * V.speed);
        const ml = 46, mr = 30, mt = 18, mb = 30, pw = Wd - ml - mr, ph = Hh - mt - mb;
        let zmax = 0;
        for (let i = 0; i < N; i++) zmax = Math.max(zmax, z[i]);
        const zlo = Math.min(base, 0) - 15, zhi = Math.max(zmax * 1.08, 120);
        const X = km => ml + km / 100 * pw, Y = m => mt + (1 - (m - zlo) / (zhi - zlo)) * ph;
        // the sea at the right
        c.fillStyle = 'rgba(70,150,235,0.28)'; c.fillRect(X(100), Y(base), mr + 4, mt + ph - Y(base) + 1);
        // the land
        c.beginPath(); c.moveTo(X(0), Y(zlo));
        for (let i = 0; i < N; i++) c.lineTo(X(i + 0.5), Y(z[i]));
        c.lineTo(X(100), Y(base)); c.lineTo(X(100), Y(zlo)); c.closePath();
        c.fillStyle = C.dark ? 'rgba(170,150,120,0.42)' : 'rgba(190,165,125,0.55)'; c.fill();
        // the river
        c.beginPath();
        for (let i = 0; i < N; i++) { const x = X(i + 0.5), y = Y(z[i]); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
        c.lineTo(X(100), Y(base));
        c.strokeStyle = C.accent; c.lineWidth = 3; c.lineJoin = 'round'; c.stroke();
        if (V.cap) {
          c.beginPath(); for (let i = 38; i <= 43; i++) { const x = X(i + 0.5), y = Y(z[i]); if (i === 38) c.moveTo(x, y); else c.lineTo(x, y); }
          c.strokeStyle = C.text; c.lineWidth = 4.5; c.globalAlpha = 0.55; c.stroke(); c.globalAlpha = 1;
          kit.label(c, 'cap-rock', X(41), Y(z[40]) - 12, { color: C.muted, size: 11, align: 'center' });
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ml, mt); c.lineTo(ml, mt + ph); c.lineTo(ml + pw, mt + ph); c.stroke();
        const ys = Hyper.niceStep(zhi - zlo, 5);
        for (let m = Math.ceil(zlo / ys) * ys; m <= zhi; m += ys) { kit.label(c, Math.round(m) + '', ml - 6, Y(m), { color: C.muted, size: 10.5, align: 'right' }); }
        for (let k = 0; k <= 100; k += 20) kit.label(c, k + '', X(k), mt + ph + 12, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'km from the divide', ml + pw / 2, Hh - 5, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'height (m)', 4, mt - 6, { color: C.muted, size: 10.5 });
        kit.label(c, 'sea', X(100) + 14, Y(base) - 9, { color: C.accent, size: 11, align: 'center' });
        // the knickpoint
        const kp = findKnick();
        if (kp >= 0) {
          const x = X(kp + 0.5), y = Y(z[kp]);
          kit.arrow(c, x, y - 34, x, y - 6, C.warn, 2);
          kit.label(c, 'knickpoint', x, y - 42, { color: C.warn, size: 11.5, align: 'center', weight: 650 });
          if (kpPrev !== null && T - lastKpT > 0.04) { retreat = (kp - kpPrev) / (T - lastKpT) * -1; kpPrev = kp; lastKpT = T; }
          else if (kpPrev === null) { kpPrev = kp; lastKpT = T; }
        } else { kpPrev = null; }
        // the place you are looking at
        const il = clamp(Math.round(V.xs - 0.5), 0, N - 2);
        const xl = X(il + 0.5), yl = Y(z[il]);
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xl, yl); c.lineTo(xl, mt + ph); c.stroke(); c.setLineDash([]);
        kit.dot(c, xl, yl, 5, C.warn, C.bg2);
        // the flow there
        const S = Math.max((z[il] - z[il + 1]) / 1000, 1e-5);
        const Q = A[il] * 0.0317 * V.rain;                       // m³/s from a runoff of 1 m/yr
        const w = 4 * Math.sqrt(Q), nM = 0.035;
        const h = Math.pow(Q * nM / (w * Math.sqrt(S)), 0.6);
        const v = Math.pow(h, 2 / 3) * Math.sqrt(S) / nM * 100;   // cm/s (Manning)
        let grain = 0;
        for (const d of logSpace(0.5, 1000, 120)) if (logInterp(HJ_ERODE, d) <= v) grain = d;
        plot.set({
          series: [{ pts: hjx.map(d => [d, logInterp(HJ_ERODE, d)]), label: 'speed needed to pick a grain up', color: C.bad }, { pts: hjx.map(d => [d, logInterp(HJ_FALL, d)]), label: 'speed below which it settles', color: C.accent }],
          hlines: [{ y: clamp(v, 0.1, 1000), label: 'the river here: ' + (v < 100 ? v.toFixed(0) + ' cm/s' : (v / 100).toFixed(1) + ' m/s') }]
        });
        ro.set('t', (T).toFixed(2) + ' Myr');
        ro.set('relief', Math.round(z[0] - base) + ' m');
        ro.set('kp', kp >= 0 ? (N - 1 - kp) + ' km above the mouth' : 'none (graded)');
        ro.set('ret', Number.isFinite(retreat) && kp >= 0 ? retreat.toFixed(1) + ' km/Myr (= mm/yr)' : '—');
        ro.set('S', (S * 1000).toFixed(2) + ' m per km');
        ro.set('Q', Q < 10 ? Q.toFixed(1) + ' m³/s' : Math.round(Q) + ' m³/s');
        ro.set('om', (W.density(15) * W.g * Q * S / 1000).toFixed(2) + ' kW per metre of channel');
        ro.set('v', (v / 100).toFixed(2) + ' m/s');
        ro.set('grain', grain > 0 ? (grain < 2 ? grain.toFixed(1) + ' mm (sand)' : grain < 64 ? Math.round(grain) + ' mm (gravel)' : Math.round(grain) + ' mm (cobbles)') : 'only silt and fine sand');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ rain on limestone */
  Hyper.sim('geo-limestone', {
    title: 'Rain on a block of limestone',
    blurb: `A vertical slice of limestone, 12 m across, cut by joints and bedding planes. Rain picks up carbon dioxide from the soil and becomes a weak acid; it runs down the open joints and dissolves the calcite on their walls. Each cell loses rock in proportion to how acid the water reaching it still is — the water is strongest where it enters and weaker the further it has travelled. This is a *schematic cellular model*, not a prediction for any real cave.

**Try this**
- Run it: the joints widen first near the top, where the water is freshest, and the passages creep downward and sideways along the bedding planes. That is how a karst landscape starts.
- Raise the **CO₂ in the soil air**: soil air holds 10 to 100 times the carbon dioxide of the open air, so the water is more acid and everything is faster. Read the pH and the limestone a litre of water can carry.
- Raise the **rainfall**: more water carries its acid deeper before it is spent, so the passages reach further down.
- Press *New block* for a different pattern of joints. Read the tonnes of rock removed, and the CO₂ taken out of the air to do it.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280, maxH: 420 });
      const NX = 60, NY = 36, CELL = 0.2;       // cells; metres
      const ctl = kit.controls(box.side, [
        { id: 'co2', label: 'CO₂ in the soil air', min: 0.04, max: 5, value: params.co2 || 1, log: true, unit: '%', sig: 2 },
        { id: 'rain', label: 'Rainfall (water through the joints)', min: 0.3, max: 3, step: 0.1, value: 1, unit: '×' },
        { id: 'speed', label: 'Time speed', min: 1, max: 100, step: 1, value: 20, unit: 'kyr/s' },
        { type: 'buttons', items: [{ id: 'new', label: 'New block', primary: true }, { id: 'again', label: 'Same block again' }] }
      ], (id) => { if (id === 'new') build(Math.floor(Math.random() * 1e6)); else if (id === 'again') build(seed); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['pH', 'pH of the water at this CO₂'], ['ca', 'Limestone a litre can carry'], ['lam', 'Acid water reaches'], ['mass', 'Rock removed (per metre of depth)'], ['co2', 'CO₂ taken from the air']]);
      const m = new Float32Array(NX * NY), dist = new Int16Array(NX * NY), q = new Int32Array(NX * NY);
      let seed = params.seed || 20261015, T = 0, base0 = 0, tick = 0;
      function build(sd) {
        seed = sd; T = 0;
        const R = rng(sd);
        m.fill(1);
        const vx = [];
        for (let k = 0; k < 4; k++) vx.push(Math.floor(((k + 0.5) / 4) * NX + (R() - 0.5) * 8));
        for (const x0 of vx) { let x = x0; for (let y = 0; y < NY; y++) { if (R() < 0.18) x += R() < 0.5 ? -1 : 1; x = clamp(x, 1, NX - 2); m[y * NX + x] = 0.88; } }
        const hy = [Math.floor(NY * (0.38 + 0.1 * R())), Math.floor(NY * (0.7 + 0.1 * R()))];
        for (const y0 of hy) { let y = y0; for (let x = 0; x < NX; x++) { if (R() < 0.2) y += R() < 0.5 ? -1 : 1; y = clamp(y, 2, NY - 2); m[y * NX + x] = Math.min(m[y * NX + x], 0.9); } }
        base0 = 0; for (let i = 0; i < m.length; i++) base0 += 1 - m[i];
      }
      build(seed);
      const open = i => m[i] < 0.92;
      function step(dtK) {
        // the water: breadth-first from the open cells in the top row; dist counts cells travelled
        dist.fill(-1); let qh = 0, qt = 0;
        for (let x = 0; x < NX; x++) { if (open(x)) { dist[x] = 0; q[qt++] = x; } }
        while (qh < qt) {
          const i = q[qh++], x = i % NX, y = (i / NX) | 0, d = dist[i] + 1;
          if (x > 0 && dist[i - 1] < 0 && open(i - 1)) { dist[i - 1] = d; q[qt++] = i - 1; }
          if (x < NX - 1 && dist[i + 1] < 0 && open(i + 1)) { dist[i + 1] = d; q[qt++] = i + 1; }
          if (y < NY - 1 && dist[i + NX] < 0 && open(i + NX)) { dist[i + NX] = d; q[qt++] = i + NX; }
          if (y > 0 && dist[i - NX] < 0 && open(i - NX)) { dist[i - NX] = d; q[qt++] = i - NX; }
        }
        const lam = 10 * V.rain, cf = Math.cbrt(V.co2), k0 = 0.012 * cf;
        const dm = new Float32Array(NX * NY);
        for (let i = 0; i < NX * NY; i++) {
          if (m[i] <= 0) continue;
          const x = i % NX, y = (i / NX) | 0;
          let e = 0;
          if (dist[i] >= 0) e += Math.exp(-dist[i] / lam);
          if (x > 0 && dist[i - 1] >= 0) e += 0.5 * Math.exp(-dist[i - 1] / lam);
          if (x < NX - 1 && dist[i + 1] >= 0) e += 0.5 * Math.exp(-dist[i + 1] / lam);
          if (y > 0 && dist[i - NX] >= 0) e += 0.5 * Math.exp(-dist[i - NX] / lam);
          if (y < NY - 1 && dist[i + NX] >= 0) e += 0.5 * Math.exp(-dist[i + NX] / lam);
          dm[i] = k0 * e * dtK;
        }
        for (let i = 0; i < NX * NY; i++) if (dm[i] > 0) m[i] = Math.max(0, m[i] - dm[i]);
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        let h = Math.min(dt, 0.05) * V.speed;
        const n = Math.max(1, Math.ceil(h / 0.1)); for (let s = 0; s < n; s++) step(h / n);
        T += h;
        const top = 24, cw = Math.min((Wd - 20) / NX, (Hh - top - 16) / NY), gw = cw * NX, gx = (Wd - gw) / 2, gy = top;
        // soil
        c.fillStyle = C.dark ? 'rgba(120,90,60,0.5)' : 'rgba(140,100,60,0.4)'; c.fillRect(gx, 4, gw, top - 4);
        kit.label(c, 'soil: CO₂ ' + (V.co2 < 1 ? V.co2.toFixed(2) : V.co2.toFixed(1)) + ' % (the open air has 0.042 %)', gx + 6, 14, { color: C.text, size: 11 });
        const rock = C.dark ? [172, 160, 138] : [196, 178, 146];
        let removed = 0;
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const i = y * NX + x, mm = m[i];
          removed += 1 - mm;
          if (mm > 0.001) { c.fillStyle = 'rgba(' + rock[0] + ',' + rock[1] + ',' + rock[2] + ',' + (0.25 + 0.75 * mm).toFixed(3) + ')'; c.fillRect(gx + x * cw, gy + y * cw, cw + 0.5, cw + 0.5); }
          if (dist[i] >= 0) {
            const a = 0.28 + 0.3 * (1 - mm) + 0.12 * Math.sin(t * 3 - dist[i] * 0.45);
            c.fillStyle = 'rgba(70,150,235,' + clamp(a, 0.15, 0.7).toFixed(3) + ')'; c.fillRect(gx + x * cw, gy + y * cw, cw + 0.5, cw + 0.5);
          }
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, gw, cw * NY);
        // rain arrows
        for (let k = 0; k < 5; k++) { const xx = gx + gw * (0.1 + 0.2 * k); kit.arrow(c, xx, 1, xx, 6, C.accent, 1.2, 4); }
        kit.label(c, '12 m', gx + gw / 2, gy + cw * NY + 9, { color: C.muted, size: 10.5, align: 'center' });
        // read-outs
        const KH = W.henry('CO2', 25), x = V.co2 / 100;
        const K1 = 4.45e-7, K2 = 4.69e-11, Ksp = 3.3e-9;
        const pH = -0.5 * Math.log10(K1 * KH * x);
        const ca = Math.cbrt(KH * K1 * Ksp * x / (4 * K2));          // mol/L
        ro.set('t', (T < 1 ? (T * 1000).toFixed(0) + ' yr' : T.toFixed(1) + ' kyr'));
        ro.set('pH', pH.toFixed(2));
        ro.set('ca', (ca * 100.09 * 1000).toFixed(0) + ' mg of CaCO₃ per litre');
        ro.set('lam', (10 * V.rain * CELL).toFixed(1) + ' m along a joint before it is spent');
        const tonnes = Math.max(0, removed - base0) * CELL * CELL * 2.7;
        ro.set('mass', tonnes < 10 ? tonnes.toFixed(1) + ' t' : Math.round(tonnes) + ' t');
        ro.set('co2', (tonnes * 0.4397).toFixed(tonnes * 0.4397 < 10 ? 1 : 0) + ' t');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a glacier shapes a valley */
  Hyper.sim('geo-glacier', {
    title: 'A glacier shapes a valley',
    blurb: `**Valley under ice.** A river has cut a V-shaped valley. A glacier fills it to the level you choose, and the ice wears away the rock it touches — every point of the bed, floor and walls alike, by the same amount, by abrasion and plucking, in a direction at right angles to the surface. Wearing a V away evenly *rounds its bottom into a circle*, and the walls move outwards: the V becomes a U. Above the ice surface the rock is untouched, and the old V remains as the shoulders, with a **trimline** where the ice stopped. This is a *geometric* model of the idea, with a single erosion rate for all the ice-covered bed.

**Land rising after the ice.** Switch the mode: a continental ice sheet pushes the crust down into the mantle, the mantle flows away, and when the ice goes the land rises again with a single relaxation time — a simple model; the real mantle has layers of different viscosity.

**Try this**
- Let it run for a hundred thousand years at 4 mm a year, then press *Melt the ice*: a hanging-valley cliff at the trimline, a broad flat floor, a small stream in a trough far too big for it.
- Thicker ice reaches higher up the walls; faster erosion deepens the trough sooner. Read the shape exponent: 1 is a V, 2 a parabola, more a flat-bottomed U.
- In the rebound mode set 3,000 m of ice and 10,000 years since the melt: the land is still rising by millimetres a year, as Scandinavia is.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 360 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const NX = 121, XM = 3000;
      const xs = new Float64Array(NX), z0 = new Float64Array(NX);
      for (let i = 0; i < NX; i++) { xs[i] = -XM + i * (2 * XM) / (NX - 1); z0[i] = 0.6 * Math.sqrt(xs[i] * xs[i] + 900) - 18; }
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Valley under ice', 'valley'], ['Land rising after the ice', 'rebound']], value: params.mode || 'valley' },
        { id: 'thick', label: 'Ice surface above the valley floor', min: 200, max: 1100, step: 25, value: 650, unit: 'm' },
        { id: 'e0', label: 'Erosion by the ice', min: 0.5, max: 10, step: 0.5, value: 6, unit: 'mm/yr' },
        { id: 'speed', label: 'Time speed', min: 1, max: 40, step: 1, value: 10, unit: 'kyr/s' },
        { id: 'H', label: 'Thickness of the ice sheet', min: 500, max: 4000, step: 100, value: 2500, unit: 'm' },
        { id: 'tau', label: 'Relaxation time of the mantle', min: 1.5, max: 10, step: 0.5, value: 3.5, unit: 'kyr' },
        { id: 'since', label: 'Time since the ice went', min: 0, max: 30, step: 0.5, value: 10, unit: 'kyr' },
        { type: 'buttons', items: [{ id: 'melt', label: 'Melt the ice', primary: true }, { id: 'reset', label: 'Back to the river valley' }] }
      ], (id) => {
        if (id === 'melt') ice = false;
        else if (id === 'reset') { D = 0; ice = true; }
        else if (id === 'mode') setMode();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time under ice'], ['D', 'Rock removed from every point of the bed'], ['depth', 'Floor lower than the old river bed'], ['width', 'Width of the trough 100 m above the floor'], ['b', 'Shape exponent (V = 1, parabola = 2)'], ['vol', 'Rock removed per km of valley'],
        ['dep', 'Land pushed down by the ice'], ['rem', 'Land still to rise'], ['rate', 'Rate of rise now'], ['t95', 'Time to rise 95 % of the way']]);
      const plot = kit.plot(graph, { x: { label: 'time since the ice went (kyr)', min: 0, max: 30 }, y: { label: 'land still to rise (m)', min: 0 } }, 190);
      let D = 0, ice = true, T = 0;
      function setMode() {
        const v = V.mode === 'valley';
        ['thick', 'e0', 'speed'].forEach(k => ctl.show(k, v));
        ['H', 'tau', 'since'].forEach(k => ctl.show(k, !v));
        ctl.show('melt', v); ctl.show('reset', v);
        ['t', 'D', 'depth', 'width', 'b', 'vol'].forEach(k => ro.show(k, v));
        ['dep', 'rem', 'rate', 't95'].forEach(k => ro.show(k, !v));
        graph.style.display = v ? 'none' : '';
      }
      setMode();
      const bed = new Float64Array(NX);
      function computeBed() {
        const hs = V.thick;
        for (let i = 0; i < NX; i++) {
          let best = z0[i];
          if (D > 0 && z0[i] < hs) {
            for (let j = 0; j < NX; j++) {
              if (z0[j] >= hs) continue;
              const dx = Math.abs(xs[i] - xs[j]); if (dx >= D) continue;
              const zz = z0[j] - Math.sqrt(D * D - dx * dx);
              if (zz < best) best = zz;
            }
          }
          bed[i] = best;
        }
      }
      function valley(c, C, Wd, Hh, dt) {
        const hs = V.thick;
        if (ice) { const h = Math.min(dt, 0.05) * V.speed; D += V.e0 * h; T += h; }
        computeBed();
        const ml = 44, mr = 16, mt = 16, mb = 28, pw = Wd - ml - mr, ph = Hh - mt - mb;
        const zlo = -Math.max(120, D * 1.1) - 10, zhi = 1450;
        const X = x => ml + (x + XM) / (2 * XM) * pw, Y = z => mt + (1 - (z - zlo) / (zhi - zlo)) * ph;
        // rock
        c.beginPath(); c.moveTo(X(-XM), Y(zlo)); for (let i = 0; i < NX; i++) c.lineTo(X(xs[i]), Y(bed[i] > z0[i] ? z0[i] : bed[i])); c.lineTo(X(XM), Y(zlo)); c.closePath();
        c.fillStyle = C.dark ? 'rgba(170,150,120,0.45)' : 'rgba(190,165,125,0.6)'; c.fill();
        // ice
        if (ice) {
          c.beginPath(); let started = false;
          for (let i = 0; i < NX; i++) { if (bed[i] < hs) { const x = X(xs[i]), y = Y(bed[i]); if (!started) { c.moveTo(x, Y(hs)); started = true; } c.lineTo(x, y); } }
          for (let i = NX - 1; i >= 0; i--) if (bed[i] < hs) { c.lineTo(X(xs[i]), Y(hs)); break; }
          c.closePath(); c.fillStyle = C.dark ? 'rgba(180,215,255,0.55)' : 'rgba(205,230,255,0.85)'; c.fill();
          c.strokeStyle = C.accent; c.lineWidth = 1; c.stroke();
        } else {
          // a small stream on the floor
          let fi = 0; for (let i = 0; i < NX; i++) if (bed[i] < bed[fi]) fi = i;
          c.fillStyle = 'rgba(70,150,235,0.8)'; c.fillRect(X(xs[fi]) - 6, Y(bed[fi]) - 3, 12, 3);
          kit.label(c, 'a small stream in a trough far too big for it', X(xs[fi]), Y(bed[fi]) - 14, { color: C.muted, size: 11, align: 'center' });
        }
        // the old valley
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath();
        for (let i = 0; i < NX; i++) { const x = X(xs[i]), y = Y(z0[i]); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
        // the bed
        c.beginPath(); for (let i = 0; i < NX; i++) { const x = X(xs[i]), y = Y(Math.min(bed[i], z0[i])); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.lineJoin = 'round'; c.stroke();
        if (ice) { c.setLineDash([2, 3]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(ml, Y(hs)); c.lineTo(ml + pw, Y(hs)); c.stroke(); c.setLineDash([]); kit.label(c, 'ice surface (trimline)', ml + pw - 4, Y(hs) - 8, { color: C.warn, size: 10.5, align: 'right' }); }
        else { kit.label(c, 'trimline: the ice stopped here', ml + 6, Y(hs) - 8, { color: C.warn, size: 10.5 }); }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(ml, mt); c.lineTo(ml, mt + ph); c.lineTo(ml + pw, mt + ph); c.stroke();
        const ys = Hyper.niceStep(zhi - zlo, 5);
        for (let m = Math.ceil(zlo / ys) * ys; m <= zhi; m += ys) kit.label(c, Math.round(m) + '', ml - 6, Y(m), { color: C.muted, size: 10.5, align: 'right' });
        for (const k of [-3000, -2000, -1000, 0, 1000, 2000, 3000]) kit.label(c, (k / 1000) + '', X(k), mt + ph + 12, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, 'distance across the valley (km)', ml + pw / 2, Hh - 8, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'height above the old river bed (m)', 4, 7, { color: C.muted, size: 10.5 });
        // readouts
        let fi = 0; for (let i = 0; i < NX; i++) if (bed[i] < bed[fi]) fi = i;
        const zf = bed[fi]; let We = 0, w100 = 0;
        for (let i = 0; i < NX; i++) { if (bed[i] < hs - 1) We = Math.max(We, Math.abs(xs[i])); if (bed[i] < zf + 100) w100 = Math.max(w100, Math.abs(xs[i])); }
        const zAt = x => { const f = (x + XM) / (2 * XM) * (NX - 1), i0 = clamp(Math.floor(f), 0, NX - 2); return mix(bed[i0], bed[i0 + 1], f - i0); };
        let b = 1;
        if (We > 100) { const z1 = zAt(0.3 * We) - zf, z2 = zAt(0.9 * We) - zf; if (z1 > 0.5 && z2 > z1) b = Math.log(z2 / z1) / Math.log(3); }
        let area = 0; for (let i = 0; i < NX; i++) area += Math.max(0, z0[i] - bed[i]) * (2 * XM / (NX - 1));
        ro.set('t', T < 100 ? T.toFixed(1) + ' kyr' : Math.round(T) + ' kyr');
        ro.set('D', Math.round(D) + ' m');
        ro.set('depth', Math.round(-zf) + ' m');
        ro.set('width', (2 * w100 / 1000).toFixed(2) + ' km (the ice-covered valley is ' + (2 * We / 1000).toFixed(1) + ' km wide)');
        ro.set('b', D < 1 ? '1.0 (V)' : b.toFixed(1) + (b < 1.3 ? ' (V)' : b < 2.2 ? ' (parabola-like)' : ' (U, flat floor)'));
        ro.set('vol', (area * 1000 / 1e6).toFixed(1) + ' million m³');
      }
      function rebound(c, C, Wd, Hh) {
        const rhoI = W.densityIce(-5), rhoM = 3300;
        const d = V.H * rhoI / rhoM, u = d * Math.exp(-V.since / V.tau);
        const ml = 20, mr = 20, mt = 28, mb = 20, pw = Wd - ml - mr;
        const seaY = Hh * 0.55, sc = Math.min(0.12, (Hh * 0.28) / Math.max(d, 1));
        const mantleY = Hh - mb;
        // the continent's profile: a flat land with the load on the centre; surface height relative to the sea
        const xsN = 80;
        // sea
        c.fillStyle = 'rgba(70,150,235,0.28)'; c.fillRect(ml, seaY, pw, mantleY - seaY);
        // land
        c.beginPath(); c.moveTo(ml, mantleY);
        for (let k = 0; k <= xsN; k++) { const x = ml + pw * k / xsN, f = k / xsN, bump = Math.exp(-Math.pow((f - 0.5) / 0.22, 2)); c.lineTo(x, seaY - 14 + u * bump * sc); }
        c.lineTo(ml + pw, mantleY); c.closePath(); c.fillStyle = C.dark ? 'rgba(170,150,120,0.5)' : 'rgba(190,165,125,0.65)'; c.fill();
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath();
        for (let k = 0; k <= xsN; k++) { const x = ml + pw * k / xsN, f = k / xsN, bump = Math.exp(-Math.pow((f - 0.5) / 0.22, 2)); const y = seaY - 14 + u * bump * sc; if (k === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke();
        c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(ml, seaY - 14); c.lineTo(ml + pw, seaY - 14); c.stroke(); c.setLineDash([]);
        kit.label(c, 'where the land stood before the ice', ml + 4, seaY - 24, { color: C.muted, size: 10.5 });
        // the ice (only while the slider is at zero)
        if (V.since < 0.05) {
          const ih = V.H * sc * 0.28;
          c.beginPath(); c.moveTo(ml + pw * 0.22, seaY - 14 + d * sc * 0.9); c.quadraticCurveTo(ml + pw * 0.5, seaY - 14 + d * sc * 0.9 - ih * 2.2, ml + pw * 0.78, seaY - 14 + d * sc * 0.9); c.closePath();
          c.fillStyle = C.dark ? 'rgba(200,225,255,0.7)' : 'rgba(215,235,255,0.95)'; c.fill(); c.strokeStyle = C.accent; c.stroke();
          kit.label(c, 'ice sheet ' + Math.round(V.H) + ' m', ml + pw * 0.5, seaY - 14 + d * sc * 0.9 - ih * 0.9, { color: C.text, size: 11.5, align: 'center', weight: 650 });
        }
        kit.label(c, 'mantle (flows slowly away from under the load and back)', ml + 4, mantleY - 8, { color: C.muted, size: 10.5 });
        kit.arrow(c, ml + pw * 0.5, seaY - 14, ml + pw * 0.5, seaY - 14 + u * sc, C.warn, 2);
        kit.label(c, Math.round(u) + ' m still down', ml + pw * 0.5 + 8, seaY - 14 + u * sc * 0.5, { color: C.warn, size: 11.5 });
        // the graph
        const pts = [], ts = [];
        for (let k = 0; k <= 60; k++) { const t = 30 * k / 60; pts.push([t, d * Math.exp(-t / V.tau)]); }
        plot.set({ series: [{ pts, label: 'land still to rise', color: C.accent }], marks: [{ x: V.since, y: u, color: C.warn, label: Math.round(u) + ' m' }], x: { label: 'time since the ice went (kyr)', min: 0, max: 30 }, y: { label: 'land still to rise (m)', min: 0, max: Math.max(100, d * 1.05) } });
        ro.set('dep', Math.round(d) + ' m (ice density ÷ mantle density × thickness)');
        ro.set('rem', Math.round(u) + ' m');
        ro.set('rate', (u / V.tau).toFixed(1) + ' mm/yr');
        ro.set('t95', (3 * V.tau).toFixed(0) + ' kyr');
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.mode === 'valley') valley(c, C, Wd, Hh, dt); else rebound(c, C, Wd, Hh);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ frost in a crack */
  Hyper.sim('geo-frost', {
    title: 'Freeze and thaw in a crack',
    blurb: `A block of rock with a water-filled crack in the top, through a daily and a yearly temperature cycle. Each time the crack freezes, ice presses on its walls with a force the freezing point allows (13.5 MPa for every kelvin below zero, if the ice is completely confined); each time it thaws, the crack stays a little longer. When the crack runs through the block, it splits and the pieces fall to the talus. The crack growth per cycle is a *schematic* law: a small step that grows with the square of the ratio of the frost pressure to the strength of the rock, and only when the crack is nearly full of water.

**Try this**
- Lower the *saturation* below 92 %: the ice can expand into the empty space and nothing happens, however cold it gets. Above it, the crack is wedged.
- Compare a climate that hovers around zero (mean 0 °C, ±8 K a day) with one that stays frozen (−10 °C) or never freezes (+10 °C). Frost does the most where the temperature crosses zero most often.
- Weak rock (3 MPa, shale) goes in a few years; strong granite (25 MPa) lasts far longer.
- Read the pressure at the coldest point of each cycle against the strength of the rock.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240, maxH: 330 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'Tm', label: 'Mean temperature of the year', min: -12, max: 12, step: 0.5, value: 1.5, unit: '°C' },
        { id: 'A', label: 'Daily swing (±)', min: 2, max: 14, step: 0.5, value: 7, unit: 'K' },
        { id: 'seas', type: 'check', label: 'A yearly cycle as well (±12 K)', value: true },
        { id: 'sat', label: 'Water in the crack (saturation)', min: 50, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'sig', label: 'Tensile strength of the rock', min: 2, max: 25, step: 0.5, value: 10, unit: 'MPa' },
        { id: 'speed', label: 'Time speed', min: 1, max: 120, step: 1, value: 30, unit: 'days/s' },
        { type: 'buttons', items: [{ id: 'new', label: 'A new block', primary: true }] }
      ], (id) => { if (id === 'new') fresh(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['T', 'Temperature now'], ['cyc', 'Freeze–thaw cycles so far'], ['eff', 'Cycles that wedged the crack'], ['P', 'Frost pressure at the last minimum'], ['ratio', 'Pressure ÷ strength of the rock'], ['len', 'Depth of the crack'], ['blocks', 'Blocks split so far']]);
      const LB = 700;                 // mm, thickness of the block
      let t = 0, crack = 60, frozen = false, Tmin = 0, cycles = 0, eff = 0, blocks = 0, lastP = 0, lastRatio = 0, lastMin = 0, breakT = -1, tail = [];
      const buf = [];
      function fresh() { crack = 60; frozen = false; breakT = -1; }
      const temp = (d) => V.Tm + (V.seas ? 12 * Math.sin(TAU * (d - 100) / 365) : 0) + V.A * Math.sin(TAU * d);
      const dPdT = () => W.LATENT_FUSION / (273.15 * (1 / W.densityIce(0) - 1 / W.density(0)));     // Pa per kelvin: Clapeyron
      function advance(days) {
        const n = Math.max(1, Math.ceil(days / 0.02)), dd = days / n;
        for (let i = 0; i < n; i++) {
          t += dd; const T = temp(t);
          if (!frozen && T < -0.5) { frozen = true; Tmin = T; }
          else if (frozen) {
            Tmin = Math.min(Tmin, T);
            if (T > 0.5) {
              frozen = false; cycles++;
              const conf = clamp((V.sat / 100 - 0.917) / 0.083, 0.05, 1);
              const P = V.sat / 100 < 0.917 ? 0 : dPdT() * Math.max(0, -Tmin) * 0.15 * conf;       // a share of the thermodynamic ceiling; none if the ice can expand into air
              lastMin = Math.min(0, Tmin);
              lastP = P; lastRatio = P / (V.sig * 1e6);
              if (lastRatio > 0.3 && V.sat / 100 >= 0.917) { eff++; crack += 0.25 * lastRatio * lastRatio * (1 + 0.002 * crack); }
              if (crack >= LB && breakT < 0) { breakT = 0; blocks++; }
            }
          }
          if (Math.floor(t * 20) !== Math.floor((t - dd) * 20)) { buf.push([t, T]); if (buf.length > 400) buf.shift(); }
        }
      }
      const plot = kit.plot(graph, { x: { label: 'days' }, y: { label: 'temperature (°C)', min: -30, max: 30 } }, 170);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (breakT < 0) advance(Math.min(dt, 0.05) * V.speed); else { breakT += dt; if (breakT > 1.6) { fresh(); } }
        // the block
        const bw = Math.min(Wd * 0.5, 320), bh = bw * (LB / 1400), bx = 24, by = Hh * 0.5 - bh / 2 + 10;
        const sc = bh / LB;
        const T = temp(t);
        const slide = breakT >= 0 ? Math.min(1, breakT / 1.2) : 0;
        const rock = C.dark ? 'rgba(165,160,150,0.7)' : 'rgba(150,145,135,0.8)';
        const cx = bx + bw / 2;
        if (breakT < 0) {
          c.fillStyle = rock; c.fillRect(bx, by, bw, bh); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
          // the crack: water or ice
          const fill = clamp(V.sat / 100, 0, 1);
          c.fillStyle = C.bg2; c.fillRect(cx - 5, by, 10, crack * sc);
          c.fillStyle = frozen ? (C.dark ? 'rgba(235,245,255,0.95)' : 'rgba(250,252,255,1)') : 'rgba(70,150,235,0.85)';
          c.fillRect(cx - 4, by + crack * sc * (1 - fill), 8, crack * sc * fill);
          c.strokeStyle = C.text; c.strokeRect(cx - 5, by, 10, crack * sc);
          if (frozen) { kit.arrow(c, cx - 7, by + crack * sc * 0.5, cx - 30, by + crack * sc * 0.5, C.bad, 2.5); kit.arrow(c, cx + 7, by + crack * sc * 0.5, cx + 30, by + crack * sc * 0.5, C.bad, 2.5); kit.label(c, 'ice pushes', cx, by - 8, { color: C.bad, size: 11.5, align: 'center', weight: 650 }); }
          else kit.label(c, 'water in the crack', cx, by - 8, { color: C.accent, size: 11.5, align: 'center' });
        } else {
          for (const sgn of [-1, 1]) {
            c.save(); c.translate(sgn * slide * 18, slide * slide * 60); c.fillStyle = rock; c.strokeStyle = C.text; c.lineWidth = 1;
            const x0 = sgn < 0 ? bx : cx + 5, x1 = sgn < 0 ? cx - 5 : bx + bw;
            c.fillRect(x0, by, x1 - x0, bh); c.strokeRect(x0, by, x1 - x0, bh); c.restore();
          }
          kit.label(c, 'the block splits', cx, by - 8, { color: C.bad, size: 12, align: 'center', weight: 650 });
        }
        kit.label(c, 'crack ' + Math.round(crack) + ' mm of ' + LB + ' mm', bx, by + bh + 16, { color: C.muted, size: 11 });
        // the talus
        const tx = bx + bw + 40, ty = Hh - 20;
        const n = Math.min(blocks, 24);
        c.fillStyle = rock;
        for (let i = 0; i < n; i++) { const px = tx + (i % 8) * 16 + ((i / 8) | 0) * 8, py = ty - ((i / 8) | 0) * 12; c.beginPath(); c.moveTo(px, py); c.lineTo(px + 14, py); c.lineTo(px + 7, py - 11); c.closePath(); c.fill(); }
        kit.label(c, blocks ? 'talus: ' + blocks + ' block' + (blocks > 1 ? 's' : '') : 'talus (none yet)', tx, ty + 12, { color: C.muted, size: 11 });
        kit.label(c, 'T = ' + T.toFixed(1) + ' °C', Wd - 12, 14, { color: T < 0 ? C.accent : C.warn, size: 13, align: 'right', weight: 650 });
        // the graph
        const w0 = Math.max(0, t - 8);
        plot.set({ series: [{ pts: buf.filter(p => p[0] >= w0), label: 'air temperature', color: C.accent }], x: { label: 'days', min: w0, max: w0 + 8 }, y: { label: 'temperature (°C)', min: -30, max: 30 }, hlines: [{ y: 0, label: '0 °C' }] });
        ro.set('t', t < 365 ? Math.round(t) + ' days' : (t / 365).toFixed(1) + ' years');
        ro.set('T', (Math.abs(T) < 0.05 ? 0 : T).toFixed(1) + ' °C' + (frozen ? ' (crack frozen)' : ''));
        ro.set('cyc', cycles + (t > 365 ? ' (' + (cycles / (t / 365)).toFixed(0) + ' a year)' : ''));
        ro.set('eff', eff + (V.sat < 91.7 ? ' (now: the ice has room to expand into air)' : ''));
        ro.set('P', cycles ? (lastP / 1e6).toFixed(1) + ' MPa (a fully confined ice would give ' + (dPdT() * -lastMin / 1e6).toFixed(0) + ' MPa)' : '—');
        ro.set('ratio', cycles ? lastRatio.toFixed(2) : '—');
        ro.set('len', Math.round(crack) + ' mm');
        ro.set('blocks', blocks + '');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a geyser */
  Hyper.sim('geo-geyser', {
    title: 'A geyser column',
    blurb: `A conduit of hot water, heated from below. Water boils when its vapour pressure equals the pressure on it, and in a column of water the pressure grows with depth — about 10 kPa for every metre — so the boiling point climbs: 100 °C at the surface, 120 °C at ten metres, 135 °C at twenty-five. The chart on the right shows the temperature of the water at each depth (blue) against the local boiling point (red dashed). The water at the bottom can be far above 100 °C and still not boil. When the first cell reaches its boiling point, steam lifts the water above it; the pressure on the deeper water drops; it is now above *its* new boiling point; and the whole column flashes in a cascade. This is a *schematic* model of one idea (the jet height assumes 1 % of the superheat energy goes into lifting water), not a model of a particular geyser.

**Try this**
- Watch one cycle: the profile creeps up towards the red curve, the column goes, then refills with cooler water. The interval at the default settings is about an hour and a quarter, the same order as Old Faithful's 60 to 100 minutes.
- A deeper conduit gives a higher jet and a longer wait: more water, a higher boiling point at the bottom.
- Raise the *convection*: heat is shared up the column, the top starts to bubble in the run-up, and the waits grow longer (from about 50 to about 100 minutes along the slider).
- Move the site from sea level to Yellowstone (2,240 m, 77 kPa): the water boils at 93 °C at the surface, and everything starts lower.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 290, maxH: 430 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Depth of the water column', min: 10, max: 40, step: 1, value: 25, unit: 'm' },
        { id: 'heat', label: 'Heat from below', min: 0.3, max: 3, step: 0.1, value: 1, unit: '×' },
        { id: 'mix', label: 'Convection in the conduit', min: 0.1, max: 1, step: 0.05, value: 0.2 },
        { id: 'p0', type: 'select', label: 'Site', options: [['Sea level (101 kPa)', 101325], ['Yellowstone, 2,240 m (77 kPa)', 77000]], value: params.p0 || 101325 },
        { id: 'speed', label: 'Time speed', min: 5, max: 120, step: 5, value: 40, unit: 'min/s' },
        { type: 'buttons', items: [{ id: 'empty', label: 'Empty and restart', primary: true }] }
      ], (id) => { if (id === 'empty' || id === 'H' || id === 'p0') init(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'The geyser'], ['since', 'Since the last eruption'], ['interval', 'Interval between eruptions'], ['jet', 'Height of the last jet'], ['Tbs', 'Boiling point at the surface'], ['Tbb', 'Boiling point at the bottom'], ['pb', 'Pressure at the bottom'], ['margin', 'Closest approach to boiling']]);
      const N = 50, RHO = 998, CP = 4180, G = 9.81, ETA = 0.01, TIN = 75, TAU_TOP = 6000;
      let Tb = null, T = null, top = 0, phase = 'heat', jt = 0, jetH = 0, nEr = 0, tSim = 0, lastEr = null, interval = null, since = 0, boilFlag = 0, dz = 1, chamber = 15, spray = [];
      const wt = j => (j >= N - chamber ? 3 : 1), mass = j => RHO * dz * wt(j);
      function makeTb(p0, Hh) {
        const ps = [], ts = [], pmax = p0 + RHO * G * Hh + 20e3;
        const n = 120, p1 = Math.max(30e3, p0 - 20e3);
        for (let i = 0; i <= n; i++) { const p = p1 + (pmax - p1) * i / n; ps.push(p); ts.push(W.boilingPoint(p)); }
        return p => { if (p <= ps[0]) return ts[0]; const f = (p - ps[0]) / (ps[1] - ps[0]); const i = Math.min(ts.length - 2, Math.floor(f)); return ts[i] + (ts[i + 1] - ts[i]) * (f - i); };
      }
      const pj = (j, tp) => V.p0 + RHO * G * (j - tp + 0.5) * dz;
      function init() {
        dz = V.H / N; chamber = Math.round(N * 0.3);
        Tb = makeTb(V.p0, V.H); T = new Array(N).fill(TIN); top = 0; phase = 'heat'; jt = 0; jetH = 0; nEr = 0; tSim = 0; lastEr = null; interval = null; since = 0; boilFlag = 0; spray = [];
      }
      init();
      function heatStep(dt) {
        const q = 1.33e6 * V.heat;
        let M = 0; for (let j = N - chamber; j < N; j++) M += mass(j);
        for (let j = N - chamber; j < N; j++) T[j] += q * dt / (M * CP);
        const D = V.mix * 0.05, k = D * dt / (dz * dz);
        const dT = new Array(N).fill(0);
        for (let j = top; j < N - 1; j++) { const f = k * (T[j + 1] - T[j]); dT[j] += f / wt(j); dT[j + 1] -= f / wt(j + 1); }
        for (let j = top; j < N; j++) T[j] += dT[j];
        T[top] -= (T[top] - 20) / TAU_TOP * dt;
      }
      function trigger() { for (let j = top; j < N; j++) if (T[j] >= Tb(pj(j, top))) return j; return -1; }
      function erupt(j0) {
        let tp = j0, E = 0;
        for (let it = 0; it < 100; it++) {
          let deepest = -1;
          for (let j = tp; j < N; j++) { const s = T[j] - Tb(pj(j, tp)); if (s > 0) { E += mass(j) * CP * s; T[j] = Tb(pj(j, tp)); deepest = j; } }
          if (deepest > tp) tp = deepest; else break;
        }
        let Mej = 0; for (let j = 0; j < tp; j++) Mej += mass(j);
        top = tp;
        return { E, Mej, h: ETA * E / (Math.max(Mej, 1) * G) };
      }
      const colT = (Tc) => { const f = clamp((Tc - 50) / 95, 0, 1); const hue = 215 - 215 * f; return 'hsl(' + hue.toFixed(0) + ',75%,52%)'; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const simS = Math.min(dt, 0.05) * V.speed * 60;
        if (phase === 'jet') {
          jt += dt;
          if (jt > 3.2) { phase = 'refill'; spray = []; }
        } else {
          const n = Math.min(3000, Math.max(1, Math.round(simS)));
          for (let s = 0; s < n; s++) {
            tSim += 1; since += 1;
            if (phase === 'heat' || phase === 'refill') heatStep(1);
            if (phase === 'refill') { if (tSim % 8 === 0 && top > 0) { top--; T[top] = TIN; } if (top === 0) phase = 'heat'; }
            else if (phase === 'heat') {
              const j = trigger();
              if (j >= 0) {
                const r = erupt(j);
                if (top === 0) { boilFlag = 4; T[0] = Tb(pj(0, 0)) - 2; }
                else { phase = 'jet'; jt = 0; jetH = r.h; nEr++; if (lastEr !== null) interval = (tSim - lastEr) / 60; lastEr = tSim; since = 0; break; }
              }
            }
          }
        }
        if (boilFlag > 0) boilFlag -= dt;
        // ---- the conduit
        const ppm = Hh * 0.0105, y0 = Hh * 0.46, cx = Wd * 0.2, cw = 20;
        c.fillStyle = C.dark ? 'rgba(120,100,80,0.45)' : 'rgba(150,125,95,0.5)'; c.fillRect(8, y0, Wd * 0.4, Hh - y0 - 6);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(8, y0); c.lineTo(8 + Wd * 0.4, y0); c.stroke();
        for (let j = 0; j < N; j++) {
          const w = j >= N - chamber ? cw * 2.4 : cw, y = y0 + j * dz * ppm;
          c.fillStyle = j >= top ? colT(T[j]) : C.bg2; c.fillRect(cx - w / 2, y, w, dz * ppm + 0.6);
        }
        c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(cx - cw / 2, y0); c.lineTo(cx - cw / 2, y0 + (N - chamber) * dz * ppm); c.lineTo(cx - cw * 1.2, y0 + (N - chamber) * dz * ppm); c.lineTo(cx - cw * 1.2, y0 + V.H * ppm); c.lineTo(cx + cw * 1.2, y0 + V.H * ppm); c.lineTo(cx + cw * 1.2, y0 + (N - chamber) * dz * ppm); c.lineTo(cx + cw / 2, y0 + (N - chamber) * dz * ppm); c.lineTo(cx + cw / 2, y0); c.stroke();
        kit.label(c, 'rock', 14, y0 + 16, { color: C.muted, size: 11 });
        kit.label(c, 'hot chamber', cx, y0 + V.H * ppm + 12, { color: C.muted, size: 10.5, align: 'center' });
        // the jet
        if (phase === 'jet') {
          const f = jt / 3.2, hh = Math.min(jetH, 44) * ppm * Math.sin(Math.PI * Math.min(1, f * 1.15)) * (1 - 0.3 * f);
          for (let i = 0; i < 40; i++) {
            const a = (i / 40) * 2 - 1, lift = hh * (1 - 0.3 * a * a), px = cx + a * (6 + 18 * f) + Math.sin(i * 3.1 + jt * 9) * 2;
            c.fillStyle = 'rgba(235,245,255,' + (0.5 - 0.3 * f).toFixed(2) + ')'; c.beginPath(); c.arc(px, y0 - lift * (0.35 + 0.65 * ((i * 37) % 10) / 10), 3 + 5 * f * Math.abs(a), 0, TAU); c.fill();
          }
          c.strokeStyle = 'rgba(235,245,255,0.8)'; c.lineWidth = 6 * (1 - f * 0.5); c.beginPath(); c.moveTo(cx, y0); c.lineTo(cx, y0 - hh); c.stroke();
          kit.label(c, 'eruption: ' + jetH.toFixed(0) + ' m', cx + 40, y0 - hh * 0.7, { color: C.text, size: 12.5, weight: 650 });
        } else if (phase === 'heat' && boilFlag > 0) {
          for (let i = 0; i < 5; i++) kit.label(c, '°', cx + (i - 2) * 5, y0 - 4 - (i * 4 + (performance.now() / 80) % 12), { color: C.muted, size: 11, align: 'center' });
          kit.label(c, 'boiling quietly: the top boils first', cx + 30, y0 - 18, { color: C.warn, size: 11 });
        }
        // ---- the chart: temperature against depth
        const gx = Wd * 0.5, gw = Wd - gx - 14, gt = 26, gh = Hh - gt - 34;
        const TX = Tc => gx + (Tc - 50) / 100 * gw, ZY = z => gt + z / Math.max(V.H, 1) * gh;
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(gx, gt); c.lineTo(gx, gt + gh); c.lineTo(gx + gw, gt + gh); c.stroke();
        for (let Tc = 50; Tc <= 150; Tc += 25) { kit.label(c, Tc + '', TX(Tc), gt + gh + 12, { color: C.muted, size: 10.5, align: 'center' }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(TX(Tc), gt); c.lineTo(TX(Tc), gt + gh); c.stroke(); }
        kit.label(c, 'temperature (°C)', gx + gw / 2, Hh - 6, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'depth below the ground →', gx + 2, 12, { color: C.muted, size: 10.5 });
        c.setLineDash([5, 4]); c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath();
        const zt = top * dz; for (let i = 0; i <= 40; i++) { const z = zt + (V.H - zt) * i / 40, Tc = Tb(V.p0 + RHO * G * (z - zt)); const x = TX(clamp(Tc, 50, 150)), y = ZY(z); if (i === 0) c.moveTo(x, y); else c.lineTo(x, y); } c.stroke(); c.setLineDash([]);
        kit.label(c, 'boiling point', TX(Tb(V.p0 + RHO * G * (V.H - zt) * 0.6)) + 8, ZY(zt + (V.H - zt) * 0.6) + 2, { color: C.bad, size: 11 });
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); let first = true;
        for (let j = top; j < N; j++) { const z = (j - top + 0.5) * dz; const x = TX(clamp(T[j], 50, 150)), y = ZY(z + (top * dz)); if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y); } c.stroke();
        kit.label(c, 'water', TX(T[N - 1]) - 40, ZY(V.H) - 8, { color: C.accent, size: 11 });
        // ---- read-outs
        let margin = 99; for (let j = top; j < N; j++) margin = Math.min(margin, Tb(pj(j, top)) - T[j]);
        ro.set('state', phase === 'jet' ? 'erupting' : phase === 'refill' ? 'refilling' : boilFlag > 0 ? 'boiling quietly' : 'heating');
        ro.set('since', Math.round(since / 60) + ' min');
        ro.set('interval', interval ? interval.toFixed(0) + ' min' : '—');
        ro.set('jet', nEr ? jetH.toFixed(0) + ' m (eruption ' + nEr + ')' : '—');
        ro.set('Tbs', W.boilingPoint(V.p0).toFixed(1) + ' °C');
        ro.set('Tbb', W.boilingPoint(V.p0 + RHO * G * V.H).toFixed(1) + ' °C');
        ro.set('pb', ((V.p0 + RHO * G * V.H) / 1000).toFixed(0) + ' kPa');
        ro.set('margin', margin.toFixed(1) + ' K below boiling');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the Earth: layers, melting, faults */
  Hyper.sim('geo-earth', {
    title: 'Water inside the Earth',
    blurb: `Three views of water in the solid Earth.

**Layers.** The mantle is not dry: its minerals hold water as hydroxide (OH) inside the crystal. Set the water content of each layer and read the mass in *oceans* (1 ocean = 1.4 × 10²¹ kg). The transition zone, 410 to 660 km down, holds the most per kilogram, and it is also where the content is least certain: a single diamond inclusion of ringwoodite carried 1.5 % water by mass, but one inclusion is not an average.

**Flux melting.** Hot rock melts when its temperature passes its solidus. Dissolved water lowers the solidus by hundreds of degrees; the slab brings water down, the wedge above it melts, and the volcanoes of an arc follow. The curves are *schematic*: the dry solidus is a published fit, the wet one subtracts Katz's formula for the dissolved water, and the wedge temperature is yours.

**Faults.** The strength of a fault in brittle rock is its friction times the *effective* pressure, the weight of the rock minus the pressure of the water in its pores. Pore water that carries part of the load makes a fault weak.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 260, maxH: 380 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Layers and their water', 'inventory'], ['Flux melting above a slab', 'melting'], ['Water on faults', 'faults']], value: params.view || 'inventory' },
        { id: 'um', label: 'Upper mantle (to 410 km)', min: 10, max: 600, step: 10, value: 100, unit: 'ppm by mass' },
        { id: 'tz', label: 'Transition zone (410–660 km)', min: 0, max: 3, step: 0.05, value: 0.5, unit: '% by mass' },
        { id: 'lm', label: 'Lower mantle (660–2,900 km)', min: 0, max: 1000, step: 10, value: 100, unit: 'ppm by mass' },
        { id: 'T100', label: 'Wedge temperature at 100 km', min: 1100, max: 1500, step: 10, value: 1380, unit: '°C' },
        { id: 'X', label: 'Water dissolved in the melt', min: 0, max: 15, step: 0.5, value: 6, unit: '% by mass' },
        { id: 'mu', label: 'Friction coefficient', min: 0.2, max: 0.85, step: 0.05, value: 0.6 },
        { id: 'lam', label: 'Pore-fluid pressure ÷ rock pressure', min: 0, max: 0.95, step: 0.05, value: 0.7 },
        { type: 'buttons', items: [{ id: 'dry', label: 'A dry guess' }, { id: 'wet', label: 'The diamond’s water (1.5 %)' }] }
      ], (id) => {
        if (id === 'view') setView();
        else if (id === 'dry') { ctl.set('um', 50); ctl.set('tz', 0.05); ctl.set('lm', 20); }
        else if (id === 'wet') { ctl.set('um', 200); ctl.set('tz', 1.5); ctl.set('lm', 500); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [
        ['um', 'Upper mantle holds'], ['tz', 'Transition zone holds'], ['lm', 'Lower mantle holds'], ['all', 'The whole mantle holds'], ['frac', 'Compared with the surface oceans'],
        ['m0', 'Melting begins at'], ['m1', 'Melting stops at'], ['dT', 'The water lowers the solidus by'],
        ['f0', 'Strength at 10 km, dry'], ['f1', 'Strength at 10 km, with this pore water'], ['f2', 'Resistance of a 100 km fault'], ['f3', 'Wet fault ÷ dry fault']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)' }, y: { label: 'depth (km)', reverse: true } }, 200);
      function setView() {
        const v = V.view;
        ['um', 'tz', 'lm'].forEach(k => ctl.show(k, v === 'inventory'));
        ctl.show('dry', v === 'inventory'); ctl.show('wet', v === 'inventory');
        ['T100', 'X'].forEach(k => ctl.show(k, v === 'melting'));
        ['mu', 'lam'].forEach(k => ctl.show(k, v === 'faults'));
        ['um', 'tz', 'lm', 'all', 'frac'].forEach(k => ro.show(k, v === 'inventory'));
        ['m0', 'm1', 'dT'].forEach(k => ro.show(k, v === 'melting'));
        ['f0', 'f1', 'f2', 'f3'].forEach(k => ro.show(k, v === 'faults'));
        graph.style.display = v === 'inventory' ? 'none' : '';
        plot.set(v === 'faults' ? { x: { label: 'shear strength of the fault (MPa)', min: 0 }, y: { label: 'depth (km)', reverse: true, min: 0, max: 30 } } : { x: { label: 'temperature (°C)', min: 0, max: 2000 }, y: { label: 'depth (km)', reverse: true, min: 0, max: 250 } });
      }
      setView();
      const dryS = P => 1120.7 + 132.9 * P - 5.1 * P * P;          // °C, P in GPa (Hirschmann 2000)
      const wedgeT = (z, T100) => z <= 100 ? T100 * Math.sqrt(z / 100) : T100 + 0.5 * (z - 100);
      const dTwater = X => 43 * Math.pow(Math.max(X, 0), 0.75);       // K (Katz et al. 2003)
      // masses in kg
      const MASS = { um: 6.2e23, tz: 4.3e23, lm: 2.96e24 }, OCEAN = W.EARTH.oceanMass;
      const LAYERS = [
        { id: 'inner', name: 'inner core', r0: 0, r1: 1221, col: '#d9a441' }, { id: 'outer', name: 'outer core', r0: 1221, r1: 3480, col: '#e0813a' },
        { id: 'lm', name: 'lower mantle', r0: 3480, r1: 5711, col: '#b5533c' }, { id: 'tz', name: 'transition zone', r0: 5711, r1: 5961, col: '#7a4aa8' },
        { id: 'um', name: 'upper mantle', r0: 5961, r1: 6336, col: '#c98b52' }, { id: 'crust', name: 'crust', r0: 6336, r1: 6371, col: '#6b7a5a' }];
      function inventory(c, C, Wd, Hh) {
        const R = Math.min(Wd * 0.3, Hh * 0.44), cx = R + 18, cy = Hh / 2;
        const rr = r => r / 6371 * R;
        for (let i = LAYERS.length - 1; i >= 0; i--) {
          const L = LAYERS[i]; c.beginPath(); c.arc(cx, cy, Math.max(rr(L.r1), L.id === 'crust' ? R : 0), 0, TAU); c.fillStyle = L.col; c.globalAlpha = 0.85; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.stroke();
        }
        c.beginPath(); c.arc(cx, cy, R, 0, TAU); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        for (const [n, r] of [['lower mantle', 4600], ['outer core', 2350], ['inner core', 600]]) kit.label(c, n, cx, cy - rr(r), { color: '#fff', size: 10.5, align: 'center', weight: 600 });
        // the bars
        const bx = cx + R + 36, bw = Wd - bx - 20, rows = [['Surface oceans', 1, C.accent], ['Upper mantle', V.um * 1e-6 * MASS.um / OCEAN, '#c98b52'], ['Transition zone', V.tz * 0.01 * MASS.tz / OCEAN, '#7a4aa8'], ['Lower mantle', V.lm * 1e-6 * MASS.lm / OCEAN, '#b5533c']];
        const vmax = Math.max(3.5, ...rows.map(r => r[1])) * 1.08, by = Hh * 0.22, bh = 24;
        kit.label(c, 'water in units of the oceans (1 ocean = 1.4 × 10²¹ kg)', bx, by - 22, { color: C.muted, size: 11 });
        rows.forEach((r, i) => {
          const y = by + i * (bh + 18);
          c.fillStyle = r[2]; c.globalAlpha = 0.85; c.fillRect(bx, y, Math.max(2, r[1] / vmax * bw), bh); c.globalAlpha = 1;
          kit.label(c, r[0], bx, y - 7, { color: C.text, size: 11 });
          kit.label(c, r[1] < 10 ? r[1].toFixed(r[1] < 0.1 ? 3 : 2) : r[1].toFixed(0), bx + Math.max(2, r[1] / vmax * bw) + 6, y + bh / 2, { color: C.text, size: 11.5, weight: 650 });
        });
        const total = rows[1][1] + rows[2][1] + rows[3][1];
        ro.set('um', rows[1][1].toFixed(2) + ' oceans');
        ro.set('tz', rows[2][1].toFixed(2) + ' oceans');
        ro.set('lm', rows[3][1].toFixed(2) + ' oceans');
        ro.set('all', total.toFixed(2) + ' oceans');
        ro.set('frac', total < 1 ? Math.round(total * 100) + ' % as much' : total.toFixed(1) + ' × as much');
      }
      function melting(c, C, Wd, Hh) {
        const zs = [], dry = [], wet = [], wdg = [];
        for (let z = 0; z <= 250; z += 5) { const P = z * 0.032; zs.push(z); dry.push([dryS(P), z]); wet.push([dryS(P) - dTwater(V.X), z]); wdg.push([wedgeT(z, V.T100), z]); }
        const dT = dTwater(V.X);
        let m0 = null, m1 = null, d0 = null, d1 = null;
        for (let z = 30; z <= 250; z += 1) {
          const Tw = wedgeT(z, V.T100), P = z * 0.032;
          if (Tw >= dryS(P) - dT && V.X > 0) { if (m0 === null) m0 = z; m1 = z; }
          if (Tw >= dryS(P)) { if (d0 === null) d0 = z; d1 = z; }
        }
        plot.set({ series: [{ pts: dry, label: 'dry solidus', color: C.warn }, { pts: wet, label: 'solidus with ' + V.X + ' % water in the melt', color: C.bad }, { pts: wdg, label: 'mantle wedge', color: C.accent }], x: { label: 'temperature (°C)', min: 400, max: 1700 }, y: { label: 'depth (km)', reverse: true, min: 0, max: 250 }, hlines: [], vlines: [] });
        // the picture: a slab diving beneath an arc
        const y0 = Hh * 0.2, ppk = (Hh * 0.74) / 250, xt = Wd * 0.16, ang = Math.PI / 4;
        const sx = z => xt + z / Math.tan(ang) * ppk, sy = z => y0 + z * ppk;
        c.fillStyle = 'rgba(70,150,235,0.3)'; c.fillRect(0, y0 - 8, xt, 8);
        c.fillStyle = C.dark ? 'rgba(150,130,105,0.4)' : 'rgba(180,155,120,0.5)'; c.fillRect(0, y0, Wd, Hh - y0);
        // the wedge melt
        if (m0 !== null && V.X > 0) {
          const zc = (m0 + m1) / 2, zh = Math.max(14, m1 - m0);
          c.fillStyle = 'rgba(230,70,40,0.55)'; c.beginPath(); c.ellipse(sx(zc) + 28, sy(zc) - 14, 38, zh * ppk * 0.5 + 8, 0, 0, TAU); c.fill();
          kit.label(c, 'melt', sx(zc) + 28, sy(zc) - 14, { color: '#fff', size: 11, align: 'center', weight: 650 });
          // the path up to the volcano
          const vx = sx(Math.min(zc, 190)) + 28; c.strokeStyle = 'rgba(230,70,40,0.7)'; c.lineWidth = 2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(vx, sy(zc) - 14 - zh * ppk * 0.5 - 6); c.lineTo(vx, y0 - 22); c.stroke(); c.setLineDash([]);
          c.fillStyle = C.dark ? '#6a5a4a' : '#8a7560'; c.beginPath(); c.moveTo(vx - 26, y0); c.lineTo(vx, y0 - 30); c.lineTo(vx + 26, y0); c.closePath(); c.fill();
          for (let i = 0; i < 3; i++) { c.fillStyle = 'rgba(160,160,170,0.5)'; c.beginPath(); c.arc(vx + 4 * i, y0 - 36 - 9 * i, 5 + 2 * i, 0, TAU); c.fill(); }
        }
        // the slab
        c.strokeStyle = C.accent; c.lineWidth = 9; c.lineCap = 'round'; c.beginPath(); c.moveTo(xt, y0); c.lineTo(sx(250), sy(250)); c.stroke(); c.lineCap = 'butt';
        c.strokeStyle = 'rgba(210,235,255,0.85)'; c.lineWidth = 3; c.beginPath(); c.moveTo(xt, y0); c.lineTo(sx(250), sy(250)); c.stroke();
        for (const z of [70, 100, 130]) { kit.arrow(c, sx(z) + 4, sy(z) - 4, sx(z) + 18, sy(z) - 30, C.accent, 1.8, 6); }
        kit.label(c, 'slab of sea floor, soaked in water', sx(150) + 12, sy(150) + 16, { color: C.text, size: 11 });
        kit.label(c, 'water squeezed out of the slab', sx(100) + 40, sy(100) + 12, { color: C.accent, size: 11 });
        kit.label(c, 'trench', xt, y0 - 14, { color: C.muted, size: 10.5, align: 'center' });
        ro.set('m0', m0 !== null ? m0 + ' km' : 'does not melt');
        ro.set('m1', m1 !== null ? m1 + ' km' : '—');
        ro.set('dT', Math.round(dT) + ' K' + (d0 !== null ? ' (the dry wedge melts from ' + d0 + ' km)' : ' (the dry wedge does not melt)'));
      }
      function faults(c, C, Wd, Hh) {
        const rho = 2800, g = 9.81;
        const sFn = (mu, lam, z) => mu * (1 - lam) * rho * g * z * 1000 / 1e6;
        const pts = (mu, lam) => { const a = []; for (let z = 0; z <= 30; z += 1) a.push([sFn(mu, lam, z), z]); return a; };
        plot.set({ series: [{ pts: pts(V.mu, 0), label: 'dry rock', color: C.warn }, { pts: pts(V.mu, V.lam), label: 'pore fluid at ' + V.lam.toFixed(2) + ' of the rock pressure', color: C.accent }, { pts: pts(0.3, 0.37), label: 'serpentinite on the fault (μ = 0.3)', color: C.ok }], x: { label: 'shear strength of the fault (MPa)', min: 0 }, y: { label: 'depth (km)', reverse: true, min: 0, max: 30 } });
        // a cartoon: two plates, a fault with water in the pores
        const y0 = Hh * 0.25, xm = Wd * 0.5;
        c.fillStyle = C.dark ? 'rgba(150,130,105,0.45)' : 'rgba(180,155,120,0.55)'; c.fillRect(10, y0, Wd - 20, Hh - y0 - 10);
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(xm - Hh * 0.35, y0); c.lineTo(xm + Hh * 0.35, Hh - 12); c.stroke();
        const n = 26;
        for (let i = 0; i < n; i++) { const f = i / (n - 1), x = xm - Hh * 0.35 + f * Hh * 0.7 + (i % 2 ? 6 : -6), y = y0 + f * (Hh - 12 - y0); c.fillStyle = 'rgba(70,150,235,' + (0.2 + 0.7 * V.lam).toFixed(2) + ')'; c.beginPath(); c.arc(x, y, 2 + 3 * V.lam, 0, TAU); c.fill(); }
        kit.arrow(c, 28, y0 + 26, 28 + 60, y0 + 26, C.text, 2.2); kit.arrow(c, Wd - 28, y0 + 26, Wd - 88, y0 + 26, C.text, 2.2);
        kit.label(c, 'the plates push; the fault holds back with', xm, y0 - 22, { color: C.muted, size: 11.5, align: 'center' });
        kit.label(c, 'μ × (rock pressure − pore pressure)', xm, y0 - 6, { color: C.text, size: 12, align: 'center', weight: 650 });
        const s0 = sFn(V.mu, 0, 10), s1 = sFn(V.mu, V.lam, 10);
        const F = z0 => sFn(V.mu, V.lam, z0) * 1e6 * 1e5;       // N per metre of fault: mean strength at 25 km depth over a 100 km long fault
        ro.set('f0', s0.toFixed(0) + ' MPa');
        ro.set('f1', s1.toFixed(0) + ' MPa');
        ro.set('f2', (F(25)).toExponential(1).replace('e+', ' × 10^') + ' N per metre of trench (average depth 25 km)');
        ro.set('f3', (1 - V.lam).toFixed(2) + ' (the same friction, ' + (V.lam > 0 ? (1 / (1 - V.lam)).toFixed(1) + ' times weaker' : 'no pore pressure') + ')');
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.view === 'inventory') inventory(c, C, Wd, Hh); else if (V.view === 'melting') melting(c, C, Wd, Hh); else faults(c, C, Wd, Hh);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the D/H fingerprint of the oceans */
  Hyper.sim('geo-origin', {
    title: 'Where the ocean’s hydrogen came from',
    blurb: `Every body in the Solar System that holds water has a deuterium-to-hydrogen ratio (D/H), and the bars show them on a logarithmic scale. The ratio of the Earth's oceans is the blue line (1.56 × 10⁻⁴). Mix the candidate sources with the sliders — the amount of hydrogen each supplies — and the amber line shows the D/H of the mixture. The mixture is a plain weighted average of the sources' ratios, which is what you would get if the delivered water mixed completely. A match of the ratio is **necessary, not sufficient**: it rules sources out, it does not prove one in; the nitrogen and other isotopes must agree as well, and the ratios of the sources themselves are uncertain (comets vary by a factor of three).

**Try this**
- Press *Carbonaceous chondrites*, the classic asteroid source: close, but a little light.
- Press *Comets only*: far too heavy. Oort-cloud comets alone would give oceans with twice the deuterium they have. Even with 10 % comets mixed into the asteroids the answer still fits.
- Press *Enstatite-like (built in)*: the material that made Earth itself, as Piani and colleagues found in 2020, holds enough hydrogen for several oceans and has a ratio close to the mantle's; a small share of heavier water brings the total to the ocean's value.
- Add *nebular hydrogen* (very low D/H) and watch the mixture drop: hydrogen from the gas of the young Solar System, dissolved in a magma ocean, would make the oceans too light.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300, maxH: 440 });
      const mean = kind => { const a = W.DH.filter(d => d.kind === kind); return a.reduce((s, d) => s + d.dh, 0) / a.length; };
      const byId = id => W.DH.find(d => d.id === id).dh;
      const SRC = [
        { id: 'ec', label: 'Enstatite-like (built in)', dh: byId('ec') },
        { id: 'cc', label: 'Carbonaceous chondrites', dh: byId('cc') },
        { id: 'oort', label: 'Comets from the Oort cloud', dh: mean('oort') },
        { id: 'jfc', label: 'Jupiter-family comets', dh: mean('jfc') },
        { id: 'neb', label: 'Nebular hydrogen (gas)', dh: byId('protosolar') }];
      const ctl = kit.controls(box.side, SRC.map((s, i) => ({ id: s.id, label: s.label, min: 0, max: 100, step: 1, value: i === 0 ? 90 : i === 2 ? 10 : 0, unit: '%' })).concat([
        { type: 'buttons', items: [{ id: 'p1', label: 'Enstatite-like (built in)', primary: true }, { id: 'p2', label: 'Carbonaceous chondrites' }, { id: 'p3', label: 'Asteroids + 10 % comets' }, { id: 'p4', label: 'Comets only' }] }
      ]), (id) => {
        const set = (a) => SRC.forEach((s, i) => ctl.set(s.id, a[i]));
        if (id === 'p1') set([90, 0, 10, 0, 0]); else if (id === 'p2') set([0, 100, 0, 0, 0]); else if (id === 'p3') set([0, 90, 10, 0, 0]); else if (id === 'p4') set([0, 0, 100, 0, 0]);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mix', 'D/H of the mixture'], ['ratio', 'Compared with the oceans'], ['delta', 'δD against sea water'], ['verdict', 'Verdict']]);
      const ROWS = ['vsmow', 'protosolar', 'jupiter', 'saturn', 'moon', 'ec', 'cc', 'mars', 'hartley', 'wirtanen', 'enceladus', 'halley', 'hyakutake', 'halebopp', 'tuttle', '67p', 'venus', 'ism'].map(id => W.DH.find(d => d.id === id));
      const KC = { standard: null, giant: '#7aa6d6', planet: '#d9944a', moon: '#9aa4ad', oort: '#c05a8a', jfc: '#a05ac0', meteorite: '#7fb069', ism: '#8a7bd6' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        let tot = 0, acc = 0;
        for (const s of SRC) { tot += V[s.id]; acc += V[s.id] * s.dh; }
        const mixv = tot > 0 ? acc / tot : NaN;
        const ml = 168, mr = 14, mt = 24, mb = 26, pw = Wd - ml - mr, ph = Hh - mt - mb, rh = ph / ROWS.length;
        const lo = Math.log10(1e-5), hi = Math.log10(2e-2);
        const X = v => ml + (Math.log10(v) - lo) / (hi - lo) * pw;
        for (let e = -5; e <= -2; e++) { const x = X(Math.pow(10, e)); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, mt); c.lineTo(x, mt + ph); c.stroke(); kit.label(c, '10' + ['⁻⁵', '⁻⁴', '⁻³', '⁻²'][e + 5], x, mt + ph + 12, { color: C.muted, size: 10.5, align: 'center' }); }
        kit.label(c, 'D/H (log scale)', ml + pw / 2, Hh - 8, { color: C.muted, size: 11, align: 'center' });
        ROWS.forEach((d, i) => {
          const y = mt + i * rh;
          c.fillStyle = d.id === 'vsmow' ? C.accent : (KC[d.kind] || C.muted); c.globalAlpha = 0.85;
          c.fillRect(ml, y + rh * 0.18, X(d.dh) - ml, rh * 0.64); c.globalAlpha = 1;
          kit.label(c, d.name.replace(' (VSMOW)', '').replace('Carbonaceous chondrites (CI, CM)', 'Carbonaceous chondrites').replace('67P/Churyumov–Gerasimenko', 'Comet 67P').replace('Water in protostellar cores', 'Hot cores (star-forming)').replace('Moon (apatite in basalts)', 'Moon (apatite)'), ml - 6, y + rh / 2, { color: C.text, size: Math.min(11, rh * 0.8), align: 'right' });
        });
        const xo = X(W.VSMOW);
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(xo, mt - 6); c.lineTo(xo, mt + ph); c.stroke();
        kit.label(c, 'the oceans', xo, mt - 12, { color: C.accent, size: 11, align: 'center', weight: 650 });
        if (Number.isFinite(mixv) && mixv > 0) {
          const xm = X(mixv); c.strokeStyle = C.warn; c.lineWidth = 2.5; c.setLineDash([6, 3]); c.beginPath(); c.moveTo(xm, mt - 6); c.lineTo(xm, mt + ph); c.stroke(); c.setLineDash([]);
          kit.label(c, 'your mixture', xm + (xm > xo ? 6 : -6), mt + ph - 8, { color: C.warn, size: 11, align: xm > xo ? 'left' : 'right', weight: 650 });
        }
        const r = mixv / W.VSMOW;
        ro.set('mix', Number.isFinite(mixv) ? (mixv * 1e4).toFixed(2) + ' × 10⁻⁴' : 'no source chosen');
        ro.set('ratio', Number.isFinite(r) ? r.toFixed(2) + ' × the oceans' : '—');
        ro.set('delta', Number.isFinite(r) ? Math.round((r - 1) * 1000) + ' ‰' : '—');
        ro.set('verdict', !Number.isFinite(r) ? '—' : Math.abs(r - 1) < 0.05 ? 'fits within 5 %' : Math.abs(r - 1) < 0.15 ? 'close (within 15 %): other isotopes decide' : r < 1 ? 'too light: ruled out as the only source' : 'too heavy: ruled out as the only source');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ deep time: the Sun, the ice, the oxygen */
  Hyper.sim('geo-time', {
    title: 'The deep time of water',
    blurb: `**Timeline.** The events that tell us when there was liquid water, set against the brightness of the Sun. The young Sun was about 30 % dimmer than today's (Gough's formula for a star slowly burning its hydrogen), and a planet at Earth's distance with no greenhouse gases would have been frozen for the first two billion years. The graph shows the surface temperature you get with today's greenhouse warming (33 K) and with the extra you add for the early Earth: the problem of the **faint young Sun**.

**Oxygen.** A schematic budget of the free oxygen in the air: cyanobacteria begin to split water and release O₂; the oxygen is at first used up by iron dissolved in the sea (laying down banded iron formations) and by volcanic gases; when those are overwhelmed the level rises (the Great Oxidation Event), stays low through a long middle age, and rises again in the late Proterozoic. The curve is a *toy model with invented units*, tuned to land on the textbook story: it shows how the pieces interact, not the true size of any flux.

**Try this**
- *Timeline:* with no extra greenhouse the temperature is below freezing before about 2 billion years ago; add 20 to 30 K and the oceans stay liquid at 4 billion. Move the cursor through the events.
- *Oxygen:* start the photosynthesis earlier, and there is a long delay before the air changes, because the sea's iron takes all the oxygen first. Give the sea more iron and the delay lengthens.
- Remove the later rise in organic carbon burial and the air stays at a few per cent of today's.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 340 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Timeline and the faint young Sun', 'timeline'], ['The rise of oxygen', 'oxygen']], value: params.view || 'timeline' },
        { id: 'age', label: 'Cursor: time before today', min: 0, max: 4.6, step: 0.01, value: params.age != null ? params.age : 3.8, unit: 'Ga' },
        { id: 'play', type: 'check', label: 'Play through time', value: false },
        { id: 'alb', label: 'Albedo (reflectivity)', min: 0.1, max: 0.5, step: 0.01, value: 0.3 },
        { id: 'G0', label: 'Greenhouse warming today', min: 0, max: 60, step: 1, value: 33, unit: 'K' },
        { id: 'Gx', label: 'Extra greenhouse at 4 Ga', min: 0, max: 40, step: 1, value: 0, unit: 'K' },
        { id: 'start', label: 'Oxygenic photosynthesis begins', min: 2.5, max: 3.5, step: 0.05, value: 2.8, unit: 'Ga ago' },
        { id: 'fe', label: 'Iron dissolved in the sea (units)', min: 0.002, max: 0.1, value: 0.02, log: true, sig: 2 },
        { id: 'B', label: 'Later rise in organic carbon burial', min: 0, max: 1, step: 0.05, value: 0.6 },
        { id: 'Vs', label: 'Oxygen sinks (volcanic gases, units)', min: 0.9, max: 1.2, step: 0.01, value: 1 }
      ], (id) => { if (id === 'view') setView(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['age', 'Time before today'], ['sun', 'Brightness of the Sun'], ['teq', 'Temperature with no greenhouse'], ['ts', 'Surface temperature'], ['ev', 'Around this time'],
        ['o2', 'Oxygen at the cursor'], ['goe', 'Oxygen passes 1 % of today’s at'], ['bif', 'Iron formations form'], ['fin', 'Oxygen today']]);
      const plot = kit.plot(graph, { x: { label: 'time before today (Ga)', reverse: true }, y: { label: 'temperature (°C)' } }, 190);
      function setView() {
        const t = V.view === 'timeline';
        ['alb', 'G0', 'Gx'].forEach(k => ctl.show(k, t));
        ['start', 'fe', 'B', 'Vs'].forEach(k => ctl.show(k, !t));
        ['sun', 'teq', 'ts', 'ev'].forEach(k => ro.show(k, t));
        ['o2', 'goe', 'bif', 'fin'].forEach(k => ro.show(k, !t));
      }
      setView();
      const EV = [
        [4.567, 'Solar System forms', 'earth'], [4.5, 'Moon-forming impact', 'earth'], [4.4, 'zircons: liquid water?', 'water'], [3.8, 'Isua: pillow lavas', 'water'],
        [3.48, 'stromatolites', 'life'], [2.9, 'plate tectonics? (3.2–2.5)', 'earth'], [2.7, 'cyanobacteria?', 'life'], [2.4, 'Great Oxidation', 'life'],
        [2.3, 'Huronian ice', 'ice'], [0.72, 'Sturtian snowball', 'ice'], [0.635, 'Marinoan snowball', 'ice'], [0.54, 'animals', 'life'], [0.47, 'land plants', 'life'], [0, 'today', 'earth']];
      const EVC = { earth: null, water: 'accent', life: 'ok', ice: 'bad' };
      const lum = age => 1 / (1 + 0.4 * (1 - (4.57 - age) / 4.57));           // Gough 1981, in units of today's luminosity
      const green = age => V.G0 + V.Gx * clamp(age / 4, 0, 1.15);
      const Teq = age => W.equilibriumTemperature(lum(age), 1, V.alb) - 273.15;
      // the oxygen model
      let o2cache = null, o2key = '';
      function oxygen() {
        const key = [V.start, V.fe, V.B, V.Vs].join('|');
        if (key === o2key) return o2cache;
        const out = []; let y = 0.03, Fe = V.fe; const dt = 0.005, tc = 0.06, k = 1, Pmax = 1.4, tauP = 0.12;
        for (let t = 3.8; t >= -1e-9; t -= dt) {
          let P = 0;
          if (t <= V.start) { P = Pmax * (1 - Math.exp(-(V.start - t) / tauP)); const s = clamp((0.9 - t) / 0.5, 0, 1); P += V.B * s * s * (3 - 2 * s); }
          const net = P - V.Vs; let bif = 0;
          if (Fe > 0 && net > 0) { const take = Math.min(Fe, net * dt); Fe -= take; bif = take / dt; }
          else y += ((net - k * y) / tc) * dt;
          if (y < 0.03) y = 0.03;
          out.push({ t, x: Math.pow(y, 4), bif });
        }
        o2key = key; o2cache = out; return out;
      }
      const near = (arr, t) => { let b = arr[0]; for (const e of arr) if (Math.abs(e.t - t) < Math.abs(b.t - t)) b = e; return b; };
      let ageAnim = null;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const tmax = V.view === 'timeline' ? 4.6 : 3.8;
        if (V.play) {
          let a = V.age - dt * (tmax / 14);
          if (a <= 0) { a = tmax; }
          ctl.set('age', a);
        }
        if (V.age > tmax) ctl.set('age', tmax);
        const age = Math.min(V.age, tmax);
        const ml = 22, mr = 22, pw = Wd - ml - mr;
        const X = a => ml + (1 - a / tmax) * pw;
        if (V.view === 'timeline') {
          const ay = Hh * 0.58;
          c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(ml, ay); c.lineTo(ml + pw, ay); c.stroke();
          for (let a = 0; a <= 4; a += 1) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(a), ay - 4); c.lineTo(X(a), ay + 4); c.stroke(); kit.label(c, a + ' Ga', X(a), ay + 16, { color: C.muted, size: 10.5, align: 'center' }); }
          EV.forEach((e, i) => {
            const x = X(e[0]), lvl = i % 3, up = i % 2 === 0, yy = up ? ay - 22 - lvl * 24 : ay + 36 + lvl * 20;
            const col = e[2] === 'earth' ? C.muted : C[EVC[e[2]]];
            c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.moveTo(x, ay); c.lineTo(x, yy + (up ? 6 : -6)); c.stroke();
            kit.dot(c, x, ay, 4, col, C.bg2);
            const right = x < Wd * 0.6;
            kit.label(c, e[1], x + (right ? 4 : -4), yy, { color: C.text, size: 10.5, align: right ? 'left' : 'right' });
          });
          // the cursor
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(X(age), 10); c.lineTo(X(age), Hh - 6); c.stroke();
          kit.label(c, age.toFixed(2) + ' Ga ago', X(age) + (X(age) > Wd * 0.8 ? -6 : 6), 14, { color: C.warn, size: 11.5, align: X(age) > Wd * 0.8 ? 'right' : 'left', weight: 650 });
          // the graph
          const ts = [], te = [];
          for (let a = 4.5; a >= 0; a -= 0.1) { ts.push([a, Teq(a) + green(a)]); te.push([a, Teq(a)]); }
          plot.set({ series: [{ pts: ts, label: 'surface, with greenhouse', color: C.accent }, { pts: te, label: 'no greenhouse', color: C.warn, dash: [5, 4] }], x: { label: 'time before today (Ga)', reverse: true, min: 0, max: 4.6 }, y: { label: 'temperature (°C)', min: -60, max: 40 }, hlines: [{ y: 0, label: 'freezing' }], vlines: [{ x: age, label: '' }] });
          const near4 = EV.filter(e => Math.abs(e[0] - age) < 0.12 + 0.04 * age).map(e => e[1]);
          ro.set('age', age.toFixed(2) + ' Ga');
          ro.set('sun', Math.round(lum(age) * 100) + ' % of today');
          ro.set('teq', Teq(age).toFixed(0) + ' °C');
          ro.set('ts', (Teq(age) + green(age)).toFixed(0) + ' °C' + (Teq(age) + green(age) < 0 ? ' (below freezing)' : ''));
          ro.set('ev', near4.length ? near4.join('; ') : '—');
        } else {
          const O = oxygen();
          const pts = O.filter((e, i) => i % 3 === 0).map(e => [e.t, e.x]);
          let goe = null, bifFirst = null, bifLast = null;
          for (const e of O) { if (e.x >= 0.01 && goe === null) goe = e.t; if (e.bif > 0.001) { if (bifFirst === null) bifFirst = e.t; bifLast = e.t; } }
          plot.set({ series: [{ pts, label: 'free oxygen (share of today’s level)', color: C.accent }], x: { label: 'time before today (Ga)', reverse: true, min: 0, max: 3.8 }, y: { label: 'oxygen, 1 = today (log scale)', log: true, min: 1e-6, max: 3 }, hlines: [{ y: 0.01, label: '1 %' }, { y: 1, label: 'today' }], vlines: [{ x: V.start, label: 'photosynthesis begins' }, { x: age, label: '' }] });
          // the sediment record: iron formations in rust, other layers grey
          const sy = 40, sh = Hh - 90;
          kit.label(c, 'the sea-floor record, oldest at the left', ml, 14, { color: C.muted, size: 11 });
          const nS = 140;
          for (let i = 0; i < nS; i++) {
            const t = tmax * (1 - i / nS), e = near(O, t);
            const col = e.bif > 0.001 ? 'rgb(176,74,48)' : e.x > 0.01 ? (C.dark ? 'rgb(140,150,160)' : 'rgb(180,190,200)') : (C.dark ? 'rgb(80,95,100)' : 'rgb(130,145,150)');
            c.fillStyle = col; c.fillRect(ml + i * pw / nS, sy, pw / nS + 0.6, sh * 0.5);
          }
          // the atmosphere at the cursor
          const e0 = near(O, age), pct = 20.95 * e0.x;
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(X(age), sy - 8); c.lineTo(X(age), sy + sh * 0.5 + 8); c.stroke();
          kit.label(c, 'banded iron formations', ml + 6, sy + sh * 0.25, { color: '#fff', size: 11, weight: 650 });
          const bx = ml, by = sy + sh * 0.5 + 30, bw = pw, bh = 20;
          c.fillStyle = C.faint; c.globalAlpha = 0.35; c.fillRect(bx, by, bw, bh); c.globalAlpha = 1;
          c.fillStyle = C.accent; c.fillRect(bx, by, Math.max(1.5, bw * pct / 30), bh);
          kit.label(c, 'oxygen in the air at the cursor: ' + (pct < 0.01 ? '< 0.01' : pct < 1 ? pct.toFixed(2) : pct.toFixed(1)) + ' % (today 20.95 %)', bx, by - 9, { color: C.text, size: 11.5 });
          kit.label(c, '0', bx, by + bh + 10, { color: C.muted, size: 10.5 }); kit.label(c, '30 %', bx + bw, by + bh + 10, { color: C.muted, size: 10.5, align: 'right' });
          ro.set('age', age.toFixed(2) + ' Ga');
          ro.set('o2', pct < 0.01 ? 'under 0.01 % of the air' : pct.toFixed(pct < 1 ? 2 : 1) + ' % of the air (' + (e0.x * 100 < 1 ? (e0.x * 100).toFixed(2) : (e0.x * 100).toFixed(0)) + ' % of today’s)');
          ro.set('goe', goe !== null ? goe.toFixed(2) + ' Ga ago' : 'never');
          ro.set('bif', bifFirst !== null ? 'from ' + bifFirst.toFixed(2) + ' to ' + bifLast.toFixed(2) + ' Ga ago' : 'not at all');
          ro.set('fin', (20.95 * O[O.length - 1].x).toFixed(1) + ' % of the air');
        }
      }, box.stage);
      loop.start();
    }
  });
})();
