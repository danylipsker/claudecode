/* HYPER-BIOLOGY · sims/plants.js — simulations for Plant Biology (content/plants.js).
 *   plant-transpiration  a tree between soil and air: water potential from −0.1 MPa to −100 MPa, stomata, wind, light and
 *                        humidity set the flow; too much tension embolises the xylem (vulnerability curve, runaway cavitation)
 *   plant-stomata        a stoma seen from above: blue light, CO₂ and ABA move K⁺ into or out of the guard cells, turgor opens
 *                        the pore; conductance, photosynthesis (CO₂ supply vs demand), transpiration and water-use efficiency
 *   plant-phloem         Münch pressure flow between a source leaf and a sink: loading, osmosis, turgor, Poiseuille flow in
 *                        sieve tubes, unloading (Michaelis–Menten); girdling
 *   plant-phototropism   the coleoptile experiments of the Darwins, Boysen-Jensen and Went: auxin from the tip, lateral
 *                        redistribution under blue light, differential growth and bending
 *   plant-photoperiod    night length, night breaks and red/far-red flashes with phytochrome: short-day, long-day and
 *                        day-neutral plants flower or not
 *   plant-germination    a Petri dish of seeds: the hydrothermal-time model with temperature, water potential, oxygen, light
 *                        (phytochrome) and cold stratification, per species; imbibition and radicle emergence
 *   plant-nutrients      a plant grown with more or less N, P, K, Mg and Fe at a given soil pH: deficiency symptoms on old
 *                        or young leaves, Liebig's barrel, mycorrhizae and nodules, growth against a fully fed control
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, f) => a + (b - a) * f;
  const RT = Tc => 8.314 * (Tc + 273.15);                                   // J/mol
  const esat = Tc => 0.6108 * Math.exp(17.27 * Tc / (Tc + 237.3));          // saturation vapour pressure, kPa (Tetens)
  const VW = 18.05e-6;                                                      // molar volume of water, m³/mol
  const psiAir = (Tc, rh) => RT(Tc) / VW * Math.log(Math.max(1e-4, rh)) / 1e6;   // MPa
  // a smooth window: ≈1 between lo and hi, 0.5 at each edge, width w
  const windowFn = (x, lo, hi, w) => 1 / (1 + Math.exp(-(x - lo) / w)) / (1 + Math.exp((x - hi) / w));
  // standard normal numbers from a seeded uniform source (Box–Muller)
  function normals(R) { return () => Math.sqrt(-2 * Math.log(Math.max(1e-12, R()))) * Math.cos(2 * Math.PI * R()); }
  function plotBox(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }

  /* ================================================================ transpiration tree */
  Hyper.sim('plant-transpiration', {
    title: 'A transpiring tree',
    blurb: `Water flows from the soil, up the xylem and out through the stomata into the air, always towards lower water potential. Evaporation sets the pull: the transpiration rate is the leaf's conductance (stomata plus the still air around the leaf) times the vapour pressure deficit, and the water potential of the top leaves falls below the soil's by the weight of the water column (0.0098 MPa per metre) and by the flow divided by the conductance of the path. The ladder on the right shows the tension, −ψ, on a logarithmic scale, from moist soil to the outside air. If the tension in the xylem grows too large, air is pulled into vessels — cavitation — and they stop conducting; the graph is the vulnerability curve of the wood (half of it lost at −2.5 MPa). Responses are speeded up.

**Try this**
- Compare the steps on the ladder: the drop from leaf to air (tens of MPa) dwarfs all the others. Raise the humidity to 99 % and the air comes close to the leaf.
- Turn the wind up, the humidity down and the temperature up: transpiration rises, and so does the tension in the leaves.
- Untick *Stomata close as the leaves dry* and dry the soil to −1.8 MPa: embolism feeds on itself — each lost vessel raises the resistance, which raises the tension — until the tree fails. Press *Grow new wood*, tick ABA again and repeat: the stomata close first and the tree loses only about a third of its xylem, at the cost of photosynthesis.
- With moist soil, raise the tree from 30 m to 116 m: gravity alone takes more than 1.1 MPa, and the top leaves stay safe only by keeping their stomata two-thirds shut (without ABA the tree fails) — the reason the tallest trees stop at about 115–130 m.
- Turn the light off: the stomata close and the flow almost stops, as at night.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'RH', label: 'Relative humidity of the air', min: 10, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'T', label: 'Air temperature', min: 5, max: 40, step: 0.5, value: 25, unit: '°C' },
        { id: 'wind', label: 'Wind speed', min: 0.1, max: 10, value: 1, unit: 'm/s', log: true, sig: 2 },
        { id: 'light', label: 'Sunlight (photons for photosynthesis)', min: 0, max: 2000, step: 50, value: 1500, unit: 'µmol/(m²·s)' },
        { id: 'stom', label: 'Largest stomatal opening', min: 0, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'soil', label: 'Soil water potential', min: -3, max: -0.01, step: 0.01, value: -0.1, unit: 'MPa' },
        { id: 'h', label: 'Tree height', min: 1, max: 120, step: 1, value: 30, unit: 'm' },
        { id: 'aba', type: 'check', label: 'Stomata close as the leaves dry (ABA)', value: true },
        { type: 'buttons', items: [{ id: 'water', label: 'Water the soil', primary: true }, { id: 'wood', label: 'Grow new wood' }] }
      ], (id) => {
        if (id === 'water') ctl.set('soil', -0.05);
        if (id === 'wood') { plc = 0; bubbles = []; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Transpiration'], ['tree', 'Water use of a tree with 200 m² of leaves'], ['gs', 'Stomatal conductance'],
        ['vpd', 'Vapour pressure deficit'], ['psi', 'ψ soil / top of stem / leaf'], ['air', 'ψ of the air'], ['plc', 'Xylem lost to embolism'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'water potential in the xylem (MPa)', min: -5, max: 0 }, y: { label: 'conductivity lost (%)', min: 0, max: 100 } }, 170);
      const P50 = -2.5, SLOPE = 3, NV = 7;
      const vuln = psi => 1 / (1 + Math.exp(SLOPE * (psi - P50)));
      const curve = Array.from({ length: 101 }, (_, i) => { const p = -5 + i * 0.05; return [p, 100 * vuln(p)]; });
      const R = kit.bio.rng(11);
      const order = [3, 1, 5, 0, 6, 2, 4];                  // the order in which the drawn vessels embolise
      let psiL = -0.6, gs = 0.3, plc = vuln(-0.6), E = 0, phase = 0, bubbles = [], acc = 0, vap = [];
      let st1 = {};
      function model(hs) {
        const tl = V.T + 2.5 * V.light / 2000;                                // leaves warm in the sun
        const vpd = Math.max(0, esat(tl) - V.RH / 100 * esat(V.T));
        const gbl = 0.147 * Math.sqrt(V.wind / 0.05);                         // boundary layer, mol m⁻² s⁻¹ (5-cm leaf)
        const fpsi = V.aba ? 1 / (1 + Math.pow(Math.max(0, psiL / -1.6), 6)) : 1;
        const fwilt = 1 / (1 + Math.pow(Math.max(0, psiL / -3), 8));        // guard cells go slack when the leaf wilts
        const gsT = 0.005 + 0.45 * V.stom / 100 * V.light / (V.light + 150) * fpsi * fwilt;
        gs += (gsT - gs) * Math.min(1, hs / 0.5);
        const g = 1 / (1 / gs + 1 / gbl);
        E = 1000 * g * vpd / 101.3;                                            // mmol m⁻² s⁻¹
        const Rroot = 0.05, Rleaf = 0.05, Rstem = 0.002 * V.h / Math.max(0.02, 1 - plc);
        const psiRoot = V.soil - E * Rroot;
        const target = psiRoot - 0.0098 * V.h - E * (Rstem + Rleaf);
        psiL += (target - psiL) * Math.min(1, hs / 0.8);
        const psiTop = psiL + E * Rleaf;
        const want = vuln(psiTop);
        if (want > plc) {                                                      // new embolisms (irreversible here)
          acc += (want - plc) * 40; plc = want;
          while (acc >= 1) { acc -= 1; bubbles.push({ v: R(), y: R(), age: 0 }); }
        }
        st1 = { vpd, gbl, psiRoot, psiTop, tl };
      }
      const loop = kit.loop((dt) => {
        const sub = Math.max(1, Math.ceil(dt / 0.02));
        for (let i = 0; i < sub; i++) model(dt / sub);
        phase += dt * Math.min(3, E / 3);
        const pa = psiAir(V.T, V.RH / 100);
        // read-outs
        ro.set('E', E.toFixed(2) + ' mmol/(m²·s)');
        ro.set('tree', (E * 200 * 3600 * 0.018 / 1000).toFixed(1) + ' L/h');
        ro.set('gs', gs.toFixed(3) + ' mol/(m²·s)');
        ro.set('vpd', st1.vpd.toFixed(2) + ' kPa (leaf at ' + st1.tl.toFixed(1) + ' °C)');
        ro.set('psi', V.soil.toFixed(2) + ' / ' + st1.psiTop.toFixed(2) + ' / ' + psiL.toFixed(2) + ' MPa');
        ro.set('air', pa.toFixed(1) + ' MPa');
        ro.set('plc', (100 * plc).toFixed(0) + ' %');
        const msg = plc > 0.5 ? 'Hydraulic failure: most of the xylem is full of air.'
          : st1.psiTop < -2 && plc > 0.2 ? 'Cavitation: the tension is pulling air into the vessels.'
          : V.light < 20 ? 'Night: the stomata are shut and the flow almost stops.'
          : gs < 0.05 ? 'Stomata nearly closed: water is saved, but CO₂ cannot get in.'
          : psiL < -1.8 ? 'The leaves are losing turgor.' : 'Water flows freely from soil to air.';
        ro.set('msg', msg);
        plot.set({ series: [{ pts: curve, label: 'vulnerability curve' }], marks: [{ x: clamp(st1.psiTop, -5, 0), y: 100 * plc, label: 'this tree' }], vlines: [{ x: P50, label: 'ψ50' }] });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const narrow = W < 560, sceneW = W * (narrow ? 0.42 : 0.58), gY = H * 0.8;
        // sky and sun
        c.fillStyle = kit.hue(205, dark ? 0.10 : 0.10); c.fillRect(0, 0, sceneW, gY);
        const sunR = 8 + 16 * V.light / 2000;
        if (V.light > 0) { c.fillStyle = 'hsl(48 95% 58% / ' + (0.25 + 0.75 * V.light / 2000).toFixed(2) + ')'; c.beginPath(); c.arc(34, 34, sunR, 0, kit.TAU); c.fill(); }
        // soil
        const wet = clamp((V.soil + 3) / 3, 0, 1);
        c.fillStyle = 'hsl(30 40% ' + (dark ? lerp(34, 20, wet) : lerp(62, 38, wet)).toFixed(0) + '%)';
        c.fillRect(0, gY, sceneW, H - gY);
        // tree geometry
        const treeH = (gY - 30) * (0.4 + 0.6 * V.h / 120), cx = sceneW * 0.5, top = gY - treeH;
        const crownR = Math.max(28, treeH * 0.24), crownY = top + crownR, trunkTop = crownY + crownR * 0.3;
        const tw = 16 + 12 * V.h / 120;
        // roots
        c.strokeStyle = dark ? 'hsl(30 30% 55%)' : 'hsl(30 35% 30%)'; c.lineWidth = 2;
        for (let k = -3; k <= 3; k++) { c.beginPath(); c.moveTo(cx + k * 3, gY); c.quadraticCurveTo(cx + k * 18, gY + 18, cx + k * 34, gY + 30 + Math.abs(k) * 4); c.stroke(); }
        // trunk with its vessels
        c.fillStyle = dark ? 'hsl(28 30% 38%)' : 'hsl(28 35% 45%)';
        c.fillRect(cx - tw / 2, trunkTop, tw, gY - trunkTop);
        const nEmb = Math.round(plc * NV);
        for (let v = 0; v < NV; v++) {
          const x = cx - tw / 2 + (v + 0.5) * tw / NV, emb = order.indexOf(v) < nEmb;
          c.strokeStyle = emb ? C.faint : 'hsl(205 85% 62%)'; c.lineWidth = 1.6;
          c.setLineDash(emb ? [3, 3] : []);
          c.beginPath(); c.moveTo(x, gY); c.lineTo(x, trunkTop); c.stroke();
          c.setLineDash([]);
          if (!emb && E > 0.02) {                                              // water moving up
            c.fillStyle = 'hsl(205 90% 70%)';
            for (let k = 0; k < 6; k++) { const f = ((k / 6 + phase * 0.5 + v * 0.13) % 1); c.fillRect(x - 1, gY - f * (gY - trunkTop) - 1, 2, 3); }
          }
        }
        // bubbles: new embolisms flash for a moment
        for (const b of bubbles) b.age += dt;
        bubbles = bubbles.filter(b => b.age < 1.2);
        for (const b of bubbles) {
          const x = cx - tw / 2 + (Math.floor(b.v * NV) + 0.5) * tw / NV, y = gY - b.y * (gY - trunkTop);
          c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, 3 + 10 * b.age, 0, kit.TAU); c.stroke();
        }
        // crown: green when hydrated, olive and drooping when dry
        const wilt = clamp((-psiL - 1.5) / 1.5, 0, 1);
        const leafCol = 'hsl(' + (125 - 65 * wilt).toFixed(0) + ' ' + (55 - 20 * wilt).toFixed(0) + '% ' + (dark ? 42 : 38) + '%)';
        c.fillStyle = leafCol;
        const blobs = [[0, 0, 1], [-0.62, 0.25, 0.7], [0.62, 0.25, 0.7], [-0.35, -0.45, 0.72], [0.35, -0.45, 0.72], [0, 0.45, 0.75]];
        for (const [bx, by, br] of blobs) { c.beginPath(); c.arc(cx + bx * crownR, crownY + by * crownR + wilt * 6, br * crownR * 0.72, 0, kit.TAU); c.fill(); }
        // water vapour leaving the leaves, blown by the wind
        const nv = Math.round(clamp(E, 0, 12) * 1.5);
        while (vap.length < nv) vap.push({ a: R() * kit.TAU, d: R() * 40, s: 0.6 + R() });
        if (vap.length > nv) vap.length = nv;
        c.fillStyle = 'hsl(205 80% 60% / 0.7)';
        for (const p of vap) {
          p.d += dt * 25 * p.s;
          if (p.d > 60) { p.d = 0; p.a = R() * kit.TAU; }
          const x = cx + Math.cos(p.a) * (crownR + p.d * 0.3) + p.d * V.wind * 0.6, y = crownY + Math.sin(p.a) * crownR * 0.9 - p.d * 0.3;
          if (x < sceneW - 4) { c.beginPath(); c.arc(x, y, 2.2, 0, kit.TAU); c.fill(); }
        }
        // height ruler
        c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(14, gY); c.lineTo(14, top); c.moveTo(9, top); c.lineTo(19, top); c.stroke();
        kit.label(c, V.h.toFixed(0) + ' m', 20, top + 10, { size: 11.5, color: C.muted });
        kit.label(c, 'soil ψ = ' + V.soil.toFixed(2) + ' MPa', 8, H - 10, { size: 11.5, color: C.text, align: 'left' });

        // ---------------------------------------------------------------- the water-potential ladder
        const x0 = sceneW + (narrow ? 34 : 50), x1 = W - 12, yb = H - 34, yt = 30;
        const lt = [-2, Math.log10(300)];
        const Y = tension => yb - (Math.log10(Math.max(0.01, tension)) - lt[0]) / (lt[1] - lt[0]) * (yb - yt);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yt); c.lineTo(x0, yb); c.stroke();
        for (const tv of [0.01, 0.1, 1, 10, 100]) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x0, Y(tv)); c.lineTo(x1, Y(tv)); c.stroke();
          kit.label(c, String(tv), x0 - 5, Y(tv), { size: 10.5, color: C.muted, align: 'right' });
        }
        kit.label(c, 'tension −ψ (MPa, log scale)', x0 - 40, 12, { size: 11, color: C.muted, align: 'left' });
        c.strokeStyle = C.bad; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x0, Y(-P50)); c.lineTo(x1, Y(-P50)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'ψ50 of the wood', x1, Y(-P50) - 8, { size: 10, color: C.bad, align: 'right' });
        const pts = [['soil', V.soil], ['root', st1.psiRoot], ['stem', st1.psiTop], ['leaf', psiL], ['air', pa]];
        const xs = pts.map((_, i) => x0 + 14 + i * (x1 - x0 - 24) / (pts.length - 1));
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        pts.forEach((p, i) => { const y = Y(-p[1]); i ? c.lineTo(xs[i], y) : c.moveTo(xs[i], y); }); c.stroke();
        pts.forEach((p, i) => {
          const y = Y(-p[1]);
          kit.dot(c, xs[i], y, 4.5, i === 4 ? 'hsl(205 80% 55%)' : C.accent);
          kit.label(c, p[0], xs[i], yb + 14, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, p[1].toFixed(p[1] < -9.95 ? 0 : narrow ? 1 : 2), xs[i], y + (i % 2 ? 14 : -12), { size: 10.5, align: 'center', color: C.text });
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ stomata */
  Hyper.sim('plant-stomata', {
    title: 'A stoma opens and closes',
    blurb: `A stoma seen from above: two guard cells around a pore. Blue light switches on proton pumps in the guard cells, potassium ions flood in (with chloride and malate), the osmotic potential falls, water follows and the swollen guard cells bow apart. Light used in photosynthesis helps too, by lowering the CO₂ inside the leaf; high CO₂ and the drought hormone abscisic acid (ABA) drive potassium out and close the pore. The pore's width sets the conductance for both gases — CO₂ in and water vapour out — so the same aperture decides how much the leaf photosynthesises and how much water it loses. Time runs in minutes.

**Try this**
- Turn the light off: potassium leaks out, turgor falls and the pore closes over tens of minutes; photosynthesis stops and the CO₂ inside the leaf rises above the air's (respiration).
- With the light on, untick *Blue light*: the stomata open only part way — red light acts only indirectly, through photosynthesis.
- Raise the CO₂ in the air to 1000 ppm: the stomata partly close, yet photosynthesis stays high and the water-use efficiency (CO₂ fixed per water lost) improves — one reason crops lose less water in a high-CO₂ world.
- Add 100 nM of ABA, the signal of a drying root: the stomata close within minutes even in bright light.
- Lower the leaf water potential: the guard cells lose turgor directly and the pore narrows even with plenty of potassium.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'light', label: 'Light (photons for photosynthesis)', min: 0, max: 2000, step: 10, value: 800, unit: 'µmol/(m²·s)' },
        { id: 'blue', type: 'check', label: 'Blue light in the spectrum', value: true },
        { id: 'co2', label: 'CO₂ in the air', min: 100, max: 1000, step: 10, value: 420, unit: 'ppm' },
        { id: 'aba', label: 'ABA reaching the guard cells', min: 0, max: 500, step: 5, value: 0, unit: 'nM' },
        { id: 'psi', label: 'Leaf water potential', min: -2, max: -0.2, step: 0.05, value: -0.5, unit: 'MPa' },
        { id: 'RH', label: 'Relative humidity of the air', min: 20, max: 95, step: 1, value: 50, unit: '%' },
        { id: 'speed', label: 'Minutes per second', min: 1, max: 30, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'dark', label: 'Light off / on', primary: true }, { id: 'reset', label: 'Clear the graph' }] }
      ], (id) => {
        if (id === 'dark') { if (V.light > 0) { lastLight = V.light; ctl.set('light', 0); } else ctl.set('light', lastLight || 800); }
        if (id === 'reset') { hist = []; tmin = 0; }
      });
      const V = ctl.values;
      let lastLight = 800;
      const ro = kit.readout(box.side, [['K', 'K⁺ in the guard cells'], ['os', 'Osmotic potential / turgor'], ['ap', 'Pore width'], ['gs', 'Stomatal conductance'],
        ['ci', 'CO₂ inside the leaf'], ['A', 'Photosynthesis'], ['E', 'Transpiration'], ['wue', 'Water-use efficiency']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0 }, y: { label: 'value', min: 0 }, legend: true }, 170);
      const R = kit.bio.rng(5), TC = 25, KMIN = 50, KMAX = 600, AMAX_UM = 12, GB = 1.5;
      const ions = Array.from({ length: 60 }, () => ({ a: 0.18 + 0.64 * R(), f: 0.2 + 0.6 * R() }));
      const chl = Array.from({ length: 7 }, () => ({ a: 0.2 + 0.6 * R(), f: 0.3 + 0.4 * R() }));
      let K = 120, Ci = 420, tmin = 0, hist = [], acc = 0, parts = [], sv = {};
      function gsOf(aUm) {                                     // pore diffusion with an end correction, 100 pores per mm²
        const a = Math.max(0, aUm) * 1e-6, Lp = 20e-6, depth = 15e-6, n = 1.0e8, D = 2.5e-5;
        const area = Math.PI / 4 * a * Lp, r = Math.sqrt(area / Math.PI);
        return D * n * area / (depth + Math.PI * r / 2) * 101325 / RT(TC) + 0.005;    // mol m⁻² s⁻¹ (+ cuticle)
      }
      function assim(gs) {                                     // supply = demand, solved for Ci by bisection
        const I = V.light, Amax = 40 * I / (I + 300), Kc = 300, Rd = 1.2, gc = 1 / (1.6 / gs + 1.37 / GB), Ca = V.co2;
        const demand = ci => Amax * ci / (ci + Kc) - Rd;
        let lo = 0, hi = Ca + Rd / Math.max(gc, 1e-4) + 5;
        for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (gc * (Ca - m) - demand(m) > 0) lo = m; else hi = m; }
        const ci = (lo + hi) / 2;
        return { ci, A: demand(ci) };
      }
      function state() {
        const osm = 150 + 2 * K;                              // mOsm/L: K⁺ with its counter-ions, plus other solutes
        const psS = -RT(TC) * osm / 1e6, P = Math.max(0, V.psi - psS);
        const ap = AMAX_UM * clamp((P - 0.6) / 2.0, 0, 1);
        const gs = gsOf(ap), ph = assim(gs);
        const vpd = esat(TC) * (1 - V.RH / 100), gw = 1 / (1 / gs + 1 / GB);
        return { psS, P, ap, gs, ci: ph.ci, A: ph.A, E: 1000 * gw * vpd / 101.3 };
      }
      function step(h) {                                       // h in minutes
        const I = V.light;
        const drive = (V.blue ? 0.6 * I / (I + 40) : 0) + 0.4 * I / (I + 400);
        const fCi = 2 / (1 + Math.pow(Ci / 400, 3)), fAba = 1 / (1 + V.aba / 30);
        const kin = 0.06 * drive * fCi * fAba, kout = 0.015 * (1 + V.aba / 25);
        K += h * (kin * (KMAX - K) - kout * (K - KMIN));
        K = clamp(K, KMIN * 0.9, KMAX);
        sv = state(); Ci = sv.ci;
      }
      sv = state();
      const loop = kit.loop((dt) => {
        const simDt = dt * V.speed, sub = Math.max(1, Math.ceil(simDt / 0.05));
        for (let i = 0; i < sub; i++) step(simDt / sub);
        tmin += simDt;
        acc += dt;
        if (acc > 0.1 || !hist.length) { acc = 0; hist.push([tmin, sv.ap, Math.max(0, sv.A)]); while (hist.length && hist[0][0] < tmin - 240) hist.shift(); }
        ro.set('K', K.toFixed(0) + ' mM');
        ro.set('os', sv.psS.toFixed(2) + ' / ' + sv.P.toFixed(2) + ' MPa');
        ro.set('ap', sv.ap.toFixed(1) + ' µm');
        ro.set('gs', sv.gs.toFixed(3) + ' mol/(m²·s)');
        ro.set('ci', sv.ci.toFixed(0) + ' ppm (air ' + V.co2 + ')');
        ro.set('A', sv.A.toFixed(1) + ' µmol CO₂/(m²·s)');
        ro.set('E', sv.E.toFixed(2) + ' mmol H₂O/(m²·s)');
        ro.set('wue', sv.A > 0.05 && sv.E > 0.01 ? (sv.A / sv.E).toFixed(2) + ' µmol CO₂ per mmol H₂O' : '—');
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'pore width (µm)' }, { pts: hist.map(p => [p[0], p[2]]), label: 'photosynthesis (µmol m⁻² s⁻¹)' }],
          x: { label: 'time (min)', min: Math.max(0, tmin - 240), max: Math.max(30, tmin) } });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const cx = W * 0.36, cy = H * 0.5, s = Math.min(W * 0.62, H) / 62;            // pixels per micrometre
        // pavement cells of the epidermis
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let gy = -1; gy < H / 46 + 1; gy++) for (let gx = -1; gx < W * 0.72 / 60 + 1; gx++) {
          const x = gx * 60 + (gy % 2) * 30, y = gy * 46;
          c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + 20, y - 8, x + 40, y + 8, x + 60, y); c.lineTo(x + 60, y + 46); c.stroke();
        }
        // the stoma
        const hl = 13 * s, ry = Math.max(0.3, sv.ap / 2 * s), gw = (8 + 1.5 * sv.P / 3) * s, rxo = ry + gw, ryo = hl + 7 * s;
        const Kf = (K - KMIN) / (KMAX - KMIN);
        c.fillStyle = 'hsl(135 ' + (35 + 35 * Kf).toFixed(0) + '% ' + (dark ? 36 + 8 * Kf : 58 - 12 * Kf).toFixed(0) + '%)';
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        for (const side of [-1, 1]) {
          c.beginPath();
          c.ellipse(cx, cy, rxo, ryo, 0, -Math.PI / 2, Math.PI / 2, side < 0);
          c.ellipse(cx, cy, ry, hl, 0, Math.PI / 2, -Math.PI / 2, side > 0);
          c.closePath(); c.fill(); c.stroke();
        }
        c.fillStyle = dark ? '#05070a' : 'hsl(210 20% 18%)';
        c.beginPath(); c.ellipse(cx, cy, ry, hl, 0, 0, kit.TAU); c.fill();
        // chloroplasts and K⁺ ions inside the guard cells
        const inCell = (side, p) => { const ang = Math.PI / 2 + p.a * Math.PI, rr = lerp(ry, rxo, p.f), ryy = lerp(hl, ryo, p.f); return [cx + side * Math.abs(Math.cos(ang)) * rr, cy + Math.sin(ang) * ryy]; };
        c.fillStyle = 'hsl(120 55% 30%)';
        for (const side of [-1, 1]) for (const p of chl) { const [x, y] = inCell(side, p); c.beginPath(); c.arc(x, y, 2.6, 0, kit.TAU); c.fill(); }
        const nIon = Math.round(K / 10);
        c.fillStyle = 'hsl(275 70% 62%)';
        for (const side of [-1, 1]) for (let i = 0; i < Math.min(ions.length, nIon); i++) { const [x, y] = inCell(side, ions[i]); c.fillRect(x - 1.5, y - 1.5, 3, 3); }
        // CO₂ coming in, water vapour going out (rates follow A and E)
        const want = Math.round(clamp(sv.A, 0, 40) / 2) + Math.round(clamp(sv.E, 0, 12) * 1.5);
        while (parts.length < want) parts.push({ co2: parts.filter(p => p.co2).length < Math.round(clamp(sv.A, 0, 40) / 2), a: R() * kit.TAU, d: R() });
        if (parts.length > want) parts.length = want;
        for (const p of parts) {
          p.d += dt * 0.5;
          if (p.d > 1) { p.d = 0; p.a = R() * kit.TAU; }
          const rad = (p.co2 ? 1 - p.d : p.d) * 90 + 6, x = cx + Math.cos(p.a) * rad * (0.4 + 0.6 * p.d) * (p.co2 ? 1 : 1), y = cy + Math.sin(p.a) * rad;
          if (p.co2) { c.fillStyle = C.muted; c.beginPath(); c.arc(x, y, 2.4, 0, kit.TAU); c.fill(); }
          else { c.fillStyle = 'hsl(205 85% 60% / 0.8)'; c.beginPath(); c.arc(x, y, 2.2, 0, kit.TAU); c.fill(); }
        }
        // scale bar and legend
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(12, H - 14); c.lineTo(12 + 10 * s, H - 14); c.stroke();
        kit.label(c, '10 µm', 12 + 5 * s, H - 26, { size: 11, align: 'center', color: C.muted });
        [['K⁺', 'hsl(275 70% 62%)'], ['CO₂ in', C.muted], ['H₂O out', 'hsl(205 85% 60%)']].forEach(([txt, col], i) => {
          c.fillStyle = col; c.fillRect(12 + i * 70, 10, 7, 7);
          kit.label(c, txt, 23 + i * 70, 14, { size: 11, color: C.muted });
        });
        // gauges
        const gx0 = W * 0.72, gw2 = (W - gx0 - 12) / 3, gy0 = 34, gh = H - 70;
        const gauges = [['K⁺', K, KMAX, 'mM', 'hsl(275 70% 60%)'], ['turgor', sv.P, 3.5, 'MPa', C.accent], ['pore', sv.ap, AMAX_UM, 'µm', C.ok]];
        gauges.forEach((g, i) => {
          const x = gx0 + i * gw2 + gw2 * 0.25, w = gw2 * 0.5, f = clamp(g[1] / g[2], 0, 1);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x, gy0, w, gh);
          c.fillStyle = g[4]; c.fillRect(x, gy0 + gh * (1 - f), w, gh * f);
          kit.label(c, g[0], x + w / 2, gy0 - 14, { size: 11, align: 'center', color: C.muted });
          kit.label(c, (g[1] < 10 ? g[1].toFixed(1) : g[1].toFixed(0)) + ' ' + g[3], x + w / 2, gy0 + gh + 14, { size: 10.5, align: 'center' });
        });
        if (V.light === 0) kit.label(c, 'darkness', cx, H - 14, { size: 12, align: 'center', color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ phloem pressure flow */
  Hyper.sim('plant-phloem', {
    title: 'Pressure flow in the phloem',
    blurb: `Münch's model, running. Companion cells in the source leaf load sucrose into a sieve tube; its osmotic potential falls, water enters from the xylem beside it, and the turgor rises: P = ψ(xylem) + [sucrose]RT. At the sink, sucrose is unloaded (at a rate that saturates, like an enzyme) and the turgor stays low. The pressure difference pushes the sap along the tube by Poiseuille flow, v = r²ΔP/(8ηLf), with the sieve plates doubling the resistance and the viscosity rising with the sugar. The water returns in the xylem. The dots show the sugar; their density is its concentration.

**Try this**
- Watch the start: sugar builds up at the source until the pressure difference drives a flow that carries away as much as is loaded — a steady state at a speed of about a metre an hour.
- Make the path ten times longer: the speed falls, the source fills up and its pressure rises to compensate. Tall trees face exactly this problem.
- Halve the sieve-tube radius: each tube's resistance to flow rises sixteen-fold (r⁴); the source fills with sugar to push harder, and less sugar arrives.
- Tick *Girdle the stem*: the flow stops, sugar piles up in the source until loading stalls, and the sink starves — Malpighi's experiment.
- Make the xylem water potential very negative (drought): the source must hold more sugar to keep its turgor, and the whole system slows.
- Turn the loading to zero (night, or shade): the flow dies away as the sink drains the tube.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'load', label: 'Sugar loading at the source (photosynthesis)', min: 0, max: 2, step: 0.05, value: 1, unit: '×' },
        { id: 'sink', label: 'Sink strength (unloading capacity)', min: 0.1, max: 3, step: 0.05, value: 1, unit: '×' },
        { id: 'L', label: 'Path length, source to sink', min: 0.5, max: 50, value: 5, unit: 'm', log: true, sig: 2 },
        { id: 'r', label: 'Sieve-tube radius', min: 4, max: 25, step: 0.5, value: 10, unit: 'µm' },
        { id: 'psix', label: 'Xylem water potential at the source', min: -2, max: -0.1, step: 0.05, value: -0.5, unit: 'MPa' },
        { id: 'girdle', type: 'check', label: 'Girdle the stem (cut the phloem)', value: false },
        { id: 'speed', label: 'Hours per second', min: 0.05, max: 2, step: 0.05, value: 0.5 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'reset') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'Sucrose: source / sink'], ['P', 'Turgor: source / sink'], ['dp', 'Pressure difference'], ['v', 'Speed of the sap'],
        ['del', 'Sugar delivered by one sieve tube'], ['tt', 'Transit time, source to sink'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'sucrose (mM)', min: 0 }, legend: true }, 170);
      const TC = 20, KL = 0.75, CMAX = 1500, UMAX = 0.6, KMU = 100, LC = 0.5, F = 2, MSUC = 342.3;
      const R = B.rng(3), slots = Array.from({ length: 90 }, () => ({ y: R(), thr: R() }));
      let cs, ck, t, v, hist, acc, phase, P = {};
      function reset() { cs = 300; ck = 100; t = 0; v = 0; hist = []; acc = 0; phase = 0; compute(); }
      function compute() {
        const rt = RT(TC);
        // turgor = ψ(xylem) − ψs; besides sucrose the sap holds ~150 mOsm of K⁺, amino acids and other solutes
        const Ps = Math.max(0, V.psix * 1e6 + rt * (cs + 150)), Pk = Math.max(0, 0.5 * V.psix * 1e6 + rt * (ck + 150));
        const eta = 1e-3 * Math.exp((cs + ck) / 2000), r = V.r * 1e-6;
        v = V.girdle ? 0 : r * r * (Ps - Pk) / (8 * eta * V.L * F);
        P = { Ps, Pk, eta };
      }
      function step(h) {                                        // h in seconds
        compute();
        const load = V.load * KL * Math.max(0, 1 - cs / CMAX), unload = V.sink * B.mm(Math.max(0, ck), UMAX, KMU);
        const flux = (v >= 0 ? v * cs : v * ck) / LC;           // mM/s carried from the source compartment to the sink's
        cs = Math.max(0, cs + h * (load - flux)); ck = Math.max(0, ck + h * (flux - unload));
      }
      reset();
      const loop = kit.loop((dt) => {
        const simDt = dt * V.speed * 3600, sub = Math.max(1, Math.ceil(simDt / 2));
        for (let i = 0; i < sub; i++) step(simDt / sub);
        compute();
        t += simDt / 3600;
        acc += dt;
        if (acc > 0.1 || !hist.length) { acc = 0; hist.push([t, cs, ck]); while (hist.length && hist[0][0] < t - 24) hist.shift(); }
        const vmh = v * 3600, area = Math.PI * Math.pow(V.r * 1e-6, 2);
        ro.set('c', cs.toFixed(0) + ' / ' + ck.toFixed(0) + ' mM');
        ro.set('P', (P.Ps / 1e6).toFixed(2) + ' / ' + (P.Pk / 1e6).toFixed(2) + ' MPa');
        ro.set('dp', ((P.Ps - P.Pk) / 1e6).toFixed(2) + ' MPa (' + ((P.Ps - P.Pk) / 1e6 / V.L).toFixed(3) + ' MPa/m)');
        ro.set('v', vmh.toFixed(2) + ' m/h (' + (v * 1000).toFixed(3) + ' mm/s)');
        ro.set('del', (Math.abs(v) * area * (v >= 0 ? cs : ck) * 3600 * MSUC * 1e6).toFixed(1) + ' µg of sucrose per hour');
        ro.set('tt', Math.abs(vmh) > 1e-3 ? (V.L / Math.abs(vmh)).toFixed(1) + ' h' : '—');
        ro.set('msg', V.girdle ? 'Girdled: sugar piles up above the cut and the sink starves.'
          : cs > 0.93 * CMAX ? 'The source is full: loading has slowed down.'
          : V.load === 0 && ck < 20 ? 'No loading: the flow has died away.'
          : P.Pk <= 0 ? 'The sink has lost its turgor.' : 'Sap flows from high pressure to low.');
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'source' }, { pts: hist.map(p => [p[0], p[2]]), label: 'sink' }],
          x: { label: 'time (h)', min: Math.max(0, t - 24), max: Math.max(4, t) } });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const xs = W * 0.2, xe = W * 0.8, yP = H * 0.42, th = 12 + V.r * 1.4, yX = H * 0.72, tx = 18, xm = (xs + xe) / 2;
        const vis = Math.sign(v) * 0.09 * Math.log10(1 + Math.abs(vmh) * 4);
        phase = (phase + vis * dt + 10) % 1;
        // source leaf with sunlight
        c.fillStyle = 'hsl(125 50% ' + (dark ? 38 : 42) + '%)';
        c.beginPath(); c.ellipse(W * 0.1, yP, W * 0.075, H * 0.2, -0.3, 0, kit.TAU); c.fill();
        c.strokeStyle = 'hsl(48 95% 55% / ' + (0.2 + 0.4 * V.load / 2).toFixed(2) + ')'; c.lineWidth = 2;
        for (let k = 0; k < Math.round(V.load * 3); k++) { c.beginPath(); c.moveTo(W * 0.04 + k * 14, 8); c.lineTo(W * 0.07 + k * 14, yP - H * 0.18); c.stroke(); }
        kit.label(c, 'source leaf', W * 0.1, yP + H * 0.26, { size: 11.5, align: 'center', color: C.muted });
        // sink (a fruit or root)
        const sinkR = Math.min(W * 0.07, H * 0.16) * (0.8 + 0.2 * clamp(V.sink / 3, 0, 1));
        c.fillStyle = 'hsl(18 75% ' + (dark ? 48 : 55) + '%)';
        c.beginPath(); c.arc(W * 0.9, yP + 10, sinkR, 0, kit.TAU); c.fill();
        kit.label(c, 'sink (fruit, root)', W * 0.9, yP + sinkR + 26, { size: 11.5, align: 'center', color: C.muted });
        // xylem vessel and phloem sieve tube
        c.fillStyle = kit.hue(205, 0.14); c.fillRect(xs, yX - tx / 2, xe - xs, tx);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(xs, yX - tx / 2, xe - xs, tx);
        c.fillStyle = kit.hue(40, 0.12); c.fillRect(xs, yP - th / 2, xe - xs, th);
        c.strokeRect(xs, yP - th / 2, xe - xs, th);
        c.strokeStyle = C.muted; c.lineWidth = 2;                                    // sieve plates with pores
        for (let x = xs + 45; x < xe - 10; x += 45) { c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x, yP - th / 2); c.lineTo(x, yP + th / 2); c.stroke(); c.setLineDash([]); }
        kit.label(c, 'phloem sieve tube', xm, yP + th / 2 + 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'xylem', xm, yX + tx / 2 + 11, { size: 11, color: C.muted, align: 'center' });
        // sugar: dot density follows the concentration along the tube
        c.fillStyle = 'hsl(28 90% 55%)';
        for (let i = 0; i < slots.length; i++) {
          const f = (i / slots.length + phase) % 1, x = xs + f * (xe - xs);
          let conc = V.girdle ? (f < 0.5 ? cs : ck) : lerp(cs, ck, f);
          if (V.girdle && Math.abs(x - xm) < 10) continue;
          if (slots[i].thr < conc / 1200) { c.beginPath(); c.arc(x, yP - th / 2 + 4 + slots[i].y * (th - 8), 2.4, 0, kit.TAU); c.fill(); }
        }
        // water: in at the source, out at the sink, back through the xylem
        c.fillStyle = 'hsl(205 85% 62%)';
        for (let k = 0; k < 14; k++) { const f = ((k / 14 - phase) % 1 + 1) % 1; c.fillRect(xs + f * (xe - xs) - 2, yX - 2, 4, 4); }
        const wcol = 'hsl(205 85% 55%)', wW = 1.5 + 4 * clamp(Math.abs(vmh) / 2, 0, 1);
        if (Math.abs(v) > 1e-7) {
          kit.arrow(c, xs + 22, yX - tx / 2 - 2, xs + 22, yP + th / 2 + 2, wcol, wW);
          kit.arrow(c, xe - 22, yP + th / 2 + 2, xe - 22, yX - tx / 2 - 2, wcol, wW);
          kit.label(c, 'water in (osmosis)', xs + 30, (yP + yX) / 2, { size: 10.5, color: wcol });
          kit.label(c, 'water out', xe - 30, (yP + yX) / 2, { size: 10.5, color: wcol, align: 'right' });
        }
        // the cut
        if (V.girdle) { c.fillStyle = C.bg2; c.fillRect(xm - 8, yP - th / 2 - 3, 16, th + 6); }
        // pressure gauges
        const gauge = (x, p, lab) => {
          const y = yP - th / 2 - 42, r = 16, a = Math.PI * (0.75 + 1.5 * clamp(p / 4e6, 0, 1));
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.arc(x, y, r, Math.PI * 0.75, Math.PI * 2.25); c.stroke();
          kit.arrow(c, x, y, x + Math.cos(a) * (r - 3), y + Math.sin(a) * (r - 3), C.accent, 2);
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x, y + r); c.lineTo(x, yP - th / 2); c.stroke();
          kit.label(c, lab + ' ' + (p / 1e6).toFixed(2) + ' MPa', x, y - r - 9, { size: 11, align: 'center' });
        };
        gauge(xs + 30, P.Ps, 'P'); gauge(xe - 30, P.Pk, 'P');
        kit.label(c, 'loading (H⁺–sucrose, ATP)', xs + 4, yP + th / 2 + 12, { size: 10.5, color: C.muted });
        kit.label(c, 'unloading', xe - 4, yP + th / 2 + 12, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, V.girdle ? 'girdled: no flow' : 'flow ' + vmh.toFixed(2) + ' m/h ' + (v >= 0 ? '→' : '←'), xm, yP - th / 2 - 12, { size: 11.5, align: 'center', color: V.girdle ? C.bad : C.accent, weight: 600 });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ phototropism experiments */
  const TROPISM_SETS = [
    { name: 'Darwin and son (1880)', dark: false, seedlings: [
      { label: 'intact' }, { label: 'tip cut off', tip: false }, { label: 'opaque cap on the tip', cap: 'opaque' },
      { label: 'clear cap on the tip', cap: 'clear' }, { label: 'opaque sleeve below the tip', cap: 'sleeve' }] },
    { name: 'Boysen-Jensen (1913)', dark: false, seedlings: [
      { label: 'intact' }, { label: 'tip cut off', tip: false }, { label: 'tip put back on gelatin', block: 'gelatin' }, { label: 'tip put back on mica', block: 'mica' }] },
    { name: 'Went (1928), in darkness', dark: true, seedlings: [
      { label: 'plain agar on the left', tip: false, agar: 'plain', agarSide: -1 }, { label: 'auxin agar, centred', tip: false, agar: 'auxin', agarSide: 0 },
      { label: 'auxin agar on the left', tip: false, agar: 'auxin', agarSide: -1 }, { label: 'auxin agar on the right', tip: false, agar: 'auxin', agarSide: 1 },
      { label: 'intact, in darkness' }] }
  ];
  function wrap(text, n) {
    const words = text.split(' '), lines = [''];
    for (const w of words) { const cur = lines[lines.length - 1]; if (cur && (cur + ' ' + w).length > n) lines.push(w); else lines[lines.length - 1] = cur ? cur + ' ' + w : w; }
    return lines;
  }

  Hyper.sim('plant-phototropism', {
    title: 'The coleoptile experiments',
    blurb: `Grass seedlings (oat coleoptiles) in the classic experiments that discovered auxin. The tip makes auxin, which moves down to the growing zone below at about a centimetre an hour. Blue light from one side, sensed in the tip, shifts auxin towards the shaded side (orange shading shows the auxin in each half); the shaded half then grows faster and the coleoptile bends towards the light. In Went's set the tips have been cut off and replaced by agar blocks that collected auxin from tips, and everything is in darkness. The model: growth rate on each side = 0.01 + 0.25·a/(a + 1) per hour, where a is the auxin level of that half; bending rate = difference in growth rates × zone length / width.

**Try this**
- In the Darwins' set, predict each seedling before pressing *Start again*: which ones bend? Only those whose tip can see the light *and* is still attached.
- Switch the light to the other side mid-way: the intact coleoptiles straighten and bend back.
- Boysen-Jensen: the signal crosses gelatin but not mica — it is a chemical that diffuses.
- Went: the block placed on one side makes the coleoptile bend *away* from it, in darkness, by 10–20° in a couple of hours. Halve or double the auxin in the blocks: at low doses the angle is nearly proportional to the dose — Went's measuring instrument, the Avena curvature test — and at high doses it levels off.
- Turn the light right down: even a dim light gives a clear bend, because the response saturates at low intensity.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'exp', type: 'select', label: 'Experiment', options: TROPISM_SETS.map((s, i) => [s.name, i]), value: 0 },
        { id: 'I', label: 'Blue light from one side', min: 0, max: 50, step: 0.5, value: 10, unit: 'µmol/(m²·s)' },
        { id: 'side', type: 'select', label: 'Light comes', options: [['from the left', -1], ['from the right', 1]], value: -1 },
        { id: 'agar', label: 'Auxin in Went\'s agar blocks (one tip = 1)', min: 0, max: 2, step: 0.05, value: 1 },
        { id: 'speed', label: 'Hours per second', min: 0.05, max: 1, step: 0.05, value: 0.3 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'exp' || id === 'restart') restart();
        if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time since the start'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'bending (°, + to the right)' }, legend: true }, 170);
      const LZ = 10, WD = 1.5, TAU = 0.4;                          // growing zone (mm), width (mm), transport lag (h)
      let set, plants, t, running = true, hist;
      function restart() {
        set = TROPISM_SETS[V.exp] || TROPISM_SETS[0];
        plants = set.seedlings.map(s => { const tip = s.tip !== false; return { s, aL: tip ? 1 : 0.4, aR: tip ? 1 : 0.4, th: 0, len: 0 }; });
        t = 0; hist = plants.map(() => [[0, 0]]);
      }
      function target(s) {
        const dark = set.dark || V.I <= 0, tip = s.tip !== false;
        if (tip) {
          const supply = s.block === 'mica' ? 0 : s.block === 'gelatin' ? 0.85 : 1;
          let left = 0.5;
          if (!dark && s.cap !== 'opaque') left = 0.5 + 0.18 * V.I / (V.I + 3) * V.side;   // auxin moves away from the light
          return [2 * supply * left, 2 * supply * (1 - left)];
        }
        if (s.agar === 'auxin') {                             // the block empties as its auxin moves down (τ ≈ 2 h)
          const a = V.agar * Math.exp(-t / 2);
          if (!s.agarSide) return [0.11 * a, 0.11 * a];
          return s.agarSide < 0 ? [0.2 * a, 0.02 * a] : [0.02 * a, 0.2 * a];
        }
        return [0, 0];
      }
      const eps = a => 0.01 + 0.25 * a / (a + 1);
      function step(h) {
        for (const p of plants) {
          const [tL, tR] = target(p.s);
          p.aL += (tL - p.aL) * h / TAU; p.aR += (tR - p.aR) * h / TAU;
          const eL = eps(p.aL), eR = eps(p.aR);
          p.th = clamp(p.th + (eL - eR) * (LZ + p.len) / WD * h, -1.4, 1.4);
          p.len += (eL + eR) / 2 * LZ * h * 0.5;
        }
      }
      restart();
      const loop = kit.loop((dt) => {
        if (running && t < 8) {
          const simDt = dt * V.speed, sub = Math.max(1, Math.ceil(simDt / 0.01));
          for (let i = 0; i < sub; i++) step(simDt / sub);
          t += simDt;
          plants.forEach((p, i) => { const hh = hist[i]; if (t - hh[hh.length - 1][0] > 0.02) hh.push([t, p.th * 180 / Math.PI]); });
        }
        ro.set('t', t.toFixed(2) + ' h' + (t >= 8 ? ' (end)' : ''));
        ro.set('msg', t < 1 ? 'Auxin takes about half an hour to reach the growing zone.' : set.dark ? 'In darkness, only an uneven supply of auxin can bend a coleoptile.' : 'Bending needs a tip that can see the light and a path for auxin to travel down.');
        plot.set({ series: plants.map((p, i) => ({ pts: hist[i], label: (i + 1) + '. ' + p.s.label })), x: { label: 'time (h)', min: 0, max: Math.max(2, Math.min(8, t)) } });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const n = plants.length, slot = W / n, k = Math.min(slot / 9, (H - 110) / 30), yBase = H - 64;
        if (set.dark || V.I <= 0) { c.fillStyle = dark ? 'rgba(0,0,0,0.35)' : 'rgba(20,30,50,0.12)'; c.fillRect(0, 0, W, H); kit.label(c, set.dark ? 'in darkness' : 'light off', W / 2, 14, { size: 12, align: 'center', color: C.muted }); }
        else {                                                        // light rays from one side
          const a = clamp(0.25 + V.I / 50, 0, 0.9), from = V.side < 0 ? 0 : W;
          for (let r = 0; r < 5; r++) kit.arrow(c, from, 30 + r * 16, from - V.side * 60, 30 + r * 16, 'hsl(225 90% 60% / ' + a.toFixed(2) + ')', 2);
          kit.label(c, 'blue light', V.side < 0 ? 8 : W - 8, 18, { size: 11, color: 'hsl(225 80% 60%)', align: V.side < 0 ? 'left' : 'right' });
        }
        c.fillStyle = dark ? 'hsl(30 30% 28%)' : 'hsl(30 35% 60%)'; c.fillRect(0, yBase, W, 6);
        plants.forEach((p, i) => {
          const x0 = slot * (i + 0.5), s = p.s, tip = s.tip !== false;
          const Ls = 9 * k, Lz = (LZ + p.len) * k, Lt = 2.5 * k, w = WD * 2 * k * 0.9, blockH = (s.block ? 1.6 : 0) * k;
          // centreline: straight base, uniformly curved zone, straight top
          const pts = [];
          let x = x0, y = yBase, phi = 0;
          const N = 24, push = () => pts.push([x, y, phi]);
          push();
          for (let j = 1; j <= 4; j++) { y -= Ls / 4; push(); }
          for (let j = 1; j <= N; j++) { phi = p.th * j / N; x += Math.sin(phi) * Lz / N; y -= Math.cos(phi) * Lz / N; push(); }
          const zoneEnd = pts.length - 1;
          const topLen = (tip ? Lt + blockH : 0.6 * k);
          for (let j = 1; j <= 4; j++) { x += Math.sin(phi) * topLen / 4; y -= Math.cos(phi) * topLen / 4; push(); }
          const edge = (q, sgn) => [q[0] - sgn * Math.cos(q[2]) * w / 2, q[1] - sgn * Math.sin(q[2]) * w / 2];
          // body
          c.fillStyle = dark ? 'hsl(75 35% 45%)' : 'hsl(75 45% 72%)'; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); pts.forEach((q, j) => { const e = edge(q, 1); j ? c.lineTo(e[0], e[1]) : c.moveTo(e[0], e[1]); });
          for (let j = pts.length - 1; j >= 0; j--) { const e = edge(pts[j], -1); c.lineTo(e[0], e[1]); }
          c.closePath(); c.fill(); c.stroke();
          // auxin in each half of the growing zone
          for (const [sgn, a] of [[1, p.aL], [-1, p.aR]]) {
            c.fillStyle = 'hsl(28 95% 55% / ' + clamp(a * 0.4, 0, 0.8).toFixed(2) + ')';
            c.beginPath();
            for (let j = 4; j <= zoneEnd; j++) { const e = edge(pts[j], sgn); j > 4 ? c.lineTo(e[0], e[1]) : c.moveTo(e[0], e[1]); }
            for (let j = zoneEnd; j >= 4; j--) c.lineTo(pts[j][0], pts[j][1]);
            c.closePath(); c.fill();
          }
          const top = pts[pts.length - 1], ph = top[2];
          const ux = Math.sin(ph), uy = -Math.cos(ph), nx = Math.cos(ph), ny = Math.sin(ph);
          if (tip) c.fillStyle = dark ? 'hsl(75 35% 45%)' : 'hsl(75 45% 72%)', c.beginPath(), c.arc(top[0], top[1], w / 2, ph + Math.PI, ph + 2 * Math.PI), c.fill(), c.stroke();
          // blocks between stump and tip
          if (s.block) {
            const b0 = pts[zoneEnd], bx = b0[0] + ux * blockH / 2, by = b0[1] + uy * blockH / 2;
            c.save(); c.translate(bx, by); c.rotate(ph);
            c.fillStyle = s.block === 'mica' ? C.text : 'hsl(200 60% 75% / 0.8)';
            const bh = s.block === 'mica' ? Math.max(1.5, 0.3 * k) : blockH;
            c.fillRect(-w * 0.75, -bh / 2, w * 1.5, bh); c.restore();
          }
          // Went's agar block on the flat stump
          if (s.agar) {
            const bw = s.agarSide ? w * 0.55 : w * 0.9, off = s.agarSide ? s.agarSide * w * 0.24 : 0, bh = 1.8 * k;
            c.save(); c.translate(top[0], top[1]); c.rotate(ph);
            c.fillStyle = s.agar === 'auxin' ? 'hsl(28 95% 55% / ' + clamp(0.3 + 0.35 * V.agar, 0.3, 1).toFixed(2) + ')' : (dark ? 'hsl(0 0% 70% / 0.6)' : 'hsl(0 0% 80%)');
            c.fillRect(off - bw / 2, -bh, bw, bh); c.strokeStyle = C.text; c.lineWidth = 1; c.strokeRect(off - bw / 2, -bh, bw, bh); c.restore();
          }
          // caps and sleeve
          if (s.cap === 'opaque' || s.cap === 'clear') {
            const b = pts[zoneEnd];
            c.beginPath();
            c.moveTo(b[0] - nx * (w / 2 + 2), b[1] - ny * (w / 2 + 2));
            c.lineTo(top[0] - nx * (w / 2 + 2) + ux * (w / 2 + 2), top[1] - ny * (w / 2 + 2) + uy * (w / 2 + 2));
            c.lineTo(top[0] + nx * (w / 2 + 2) + ux * (w / 2 + 2), top[1] + ny * (w / 2 + 2) + uy * (w / 2 + 2));
            c.lineTo(b[0] + nx * (w / 2 + 2), b[1] + ny * (w / 2 + 2));
            c.closePath();
            if (s.cap === 'opaque') { c.fillStyle = C.text; c.fill(); } else { c.fillStyle = 'hsl(200 60% 80% / 0.25)'; c.fill(); c.strokeStyle = C.muted; c.stroke(); }
          }
          if (s.cap === 'sleeve') {
            c.fillStyle = C.text; c.beginPath();
            for (let j = 4; j <= zoneEnd; j++) { const e = edge(pts[j], 1.25); j > 4 ? c.lineTo(e[0], e[1]) : c.moveTo(e[0], e[1]); }
            for (let j = zoneEnd; j >= 4; j--) { const e = edge(pts[j], -1.25); c.lineTo(e[0], e[1]); }
            c.closePath(); c.fill();
          }
          // labels
          const deg = p.th * 180 / Math.PI, ad = Math.abs(deg);
          const how = [ad < 1 ? 'straight' : 'bent ' + ad.toFixed(0) + '°'];
          if (ad >= 1) {
            if (s.agar && s.agarSide) how.push(Math.sign(deg) === -s.agarSide ? 'away from the block' : 'towards the block');
            else if (!set.dark && V.I > 0) how.push(Math.sign(deg) === V.side ? 'towards the light' : 'away from the light');
            else how.push(deg > 0 ? 'to the right' : 'to the left');
          }
          const lines = wrap((i + 1) + '. ' + s.label, Math.max(10, Math.floor(slot / 6.6)));
          lines.forEach((l, j) => kit.label(c, l, x0, yBase + 16 + j * 13, { size: 11, align: 'center', color: C.text }));
          how.forEach((l, j) => kit.label(c, l, x0, yBase + 16 + (lines.length + j) * 13, { size: 10.5, align: 'center', color: ad >= 1 ? C.accent : C.muted }));
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ photoperiodism */
  const PHOTO_SPECIES = [
    { name: 'Cocklebur (short-day, critical night 8.5 h)', type: 'SD', crit: 8.5, need: 1, hue: 95 },
    { name: 'Chrysanthemum (short-day, critical night 10.5 h)', type: 'SD', crit: 10.5, need: 5, hue: 48 },
    { name: 'Henbane (long-day, critical night 13 h)', type: 'LD', crit: 13, need: 3, hue: 55 },
    { name: 'Spinach (long-day, critical night 10 h)', type: 'LD', crit: 10, need: 3, hue: 110 },
    { name: 'Tomato (day-neutral)', type: 'DN', crit: 0, need: 12, hue: 52 }
  ];
  const NIGHT_BREAKS = [
    ['red', [[0, 'R']]], ['red, then far-red', [[0, 'R'], [0.08, 'FR']]], ['red, far-red, red', [[0, 'R'], [0.08, 'FR'], [0.17, 'R']]],
    ['red, far-red, red, far-red', [[0, 'R'], [0.08, 'FR'], [0.17, 'R'], [0.25, 'FR']]], ['far-red', [[0, 'FR']]], ['red, then far-red an hour later', [[0, 'R'], [1, 'FR']]]
  ];

  Hyper.sim('plant-photoperiod', {
    title: 'Night length, night breaks and phytochrome',
    blurb: `A plant grows under a daily cycle of light and darkness. Its leaves time each uninterrupted dark period. A short-day plant counts a night as inductive when the darkness lasts longer than its critical night; a long-day plant when it is shorter; a day-neutral plant flowers with age whatever the nights. After enough inductive nights the leaves send florigen to the shoot tip and flower buds appear. A night break can be given as flashes of red (R) or far-red (FR) light, five minutes apart. Phytochrome (graph) is about 60 % Pfr in daylight and falls in darkness; a red flash raises it to 85 %, far-red drops it to 3 %. In this model the dark timer is reset when Pfr stays above 40 % for half an hour after a flash — so far-red given soon after red cancels the break, but not an hour later.

**Try this**
- Cocklebur with 14-hour days: the 10-hour night is longer than its critical 8.5 h, and one such night is enough to make it flower. Then give 16-hour days (8-hour nights): no flowers.
- With long nights, add a red night break in the middle: the cocklebur never flowers, although the total darkness is the same. Switch to henbane (long-day) with the same schedule: now it flowers.
- Try the flash sequences: red, far-red, red, far-red… — the last flash decides, the signature of phytochrome.
- Choose *red, then far-red an hour later*: too late — the red has already acted (escape from photoreversibility).
- Set a 14-hour day and compare cocklebur (short-day) with henbane (long-day): both flower. The names describe the direction of the response, not the length of day.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Plant', options: PHOTO_SPECIES.map((s, i) => [s.name, i]), value: 0 },
        { id: 'day', label: 'Day length', min: 4, max: 20, step: 0.25, value: 14, unit: 'h' },
        { id: 'nb', type: 'check', label: 'Night break (flashes in the night)', value: false },
        { id: 'at', label: 'Flashes given … hours after dusk', min: 0.5, max: 12, step: 0.25, value: 5, unit: 'h' },
        { id: 'seq', type: 'select', label: 'Flash sequence', options: NIGHT_BREAKS.map((s, i) => [s[0], i]), value: 0 },
        { id: 'speed', label: 'Days per second', min: 0.1, max: 3, step: 0.1, value: 0.6 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], (id) => { if (id !== 'speed') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['night', 'Night length'], ['dark', 'Longest uninterrupted dark, last night'], ['crit', 'Critical night of this plant'],
        ['pfr', 'Pfr now'], ['ind', 'Inductive nights / needed'], ['state', 'State']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)' }, y: { label: 'Pfr (% of phytochrome)', min: 0, max: 100 } }, 150);
      let sp, t, phi, light, darkStart, pending, longest, nights, count, flowerDay, hist, acc, lastLongest;
      function events() {                                     // flash times, as hours after dawn
        if (!V.nb) return [];
        const night = 24 - V.day, seq = NIGHT_BREAKS[V.seq] ? NIGHT_BREAKS[V.seq][1] : NIGHT_BREAKS[0][1];
        const at = Math.min(V.at, Math.max(0.1, night - seq[seq.length - 1][0] - 0.2));
        return seq.map(([dt, kind]) => [V.day + at + dt, kind]);
      }
      function restart() {
        sp = PHOTO_SPECIES[V.sp] || PHOTO_SPECIES[0];
        t = 0; phi = 0.6; light = true; darkStart = 0; pending = null; longest = 0; nights = []; count = 0; flowerDay = null; hist = []; acc = 0; lastLongest = null;
      }
      function step(h) {
        const tod0 = t % 24; t += h; const tod = t % 24, wrapped = tod < tod0;
        const isLight = tod < V.day;
        if (light && !isLight) { darkStart = t - (tod - V.day); longest = 0; pending = null; }          // dusk
        if (!light && isLight) {                                                                     // dawn: judge the night
          const dawn = t - tod;
          longest = Math.max(longest, dawn - darkStart);
          const ind = sp.type === 'SD' ? longest >= sp.crit : sp.type === 'LD' ? longest < sp.crit : true;
          nights.push({ longest, ind }); if (nights.length > 60) nights.shift();
          if (ind) count++;
          if (count >= sp.need && flowerDay == null) flowerDay = t / 24;
          lastLongest = longest;
        }
        light = isLight;
        // flashes in this step
        for (const [et, kind] of events()) {
          const hit = wrapped ? (et > tod0 || et <= tod) : (et > tod0 && et <= tod);
          if (!hit || isLight) continue;
          phi = kind === 'R' ? 0.85 : 0.03;
          if (kind === 'R') pending = { tRed: t - ((tod - et + 24) % 24), high: 0 };
        }
        if (isLight) phi += (0.6 - phi) * Math.min(1, h / 0.05);
        else {
          phi += (0.02 - phi) * Math.min(1, h / 1.5);
          if (pending) {
            if (phi > 0.4) { pending.high += h; if (pending.high >= 0.5) { longest = Math.max(longest, pending.tRed - darkStart); darkStart = pending.tRed; pending = null; } }
            else { const last = events().reduce((m, e) => Math.max(m, e[0]), 0); if (tod > last + 0.01) pending = null; }
          }
        }
      }
      restart();
      const loop = kit.loop((dt) => {
        const simDt = dt * V.speed * 24, sub = Math.max(1, Math.ceil(simDt / 0.02));
        if (t < 24 * 60) for (let i = 0; i < sub; i++) step(simDt / sub);
        acc += simDt;
        if (acc > 0.1 || !hist.length) { acc = 0; hist.push([t, 100 * phi]); while (hist.length && hist[0][0] < t - 48) hist.shift(); }
        const day = t / 24, night = 24 - V.day, tod = t % 24, ev = events();
        const fstate = flowerDay == null ? 'vegetative' : day - flowerDay < 2 ? 'induced: florigen on its way to the shoot tip' : day - flowerDay < 5 ? 'flower buds forming' : 'flowering';
        ro.set('night', night.toFixed(2) + ' h');
        ro.set('dark', lastLongest == null ? '—' : lastLongest.toFixed(2) + ' h');
        ro.set('crit', sp.type === 'DN' ? 'none (day-neutral)' : sp.crit + ' h (' + (sp.type === 'SD' ? 'flowers if the dark is longer' : 'flowers if the dark is shorter') + ')');
        ro.set('pfr', (100 * phi).toFixed(0) + ' %');
        ro.set('ind', count + ' / ' + sp.need);
        ro.set('state', fstate + ' — day ' + Math.floor(day));
        plot.set({ series: [{ pts: hist, label: 'Pfr' }], hlines: [{ y: 40, label: 'reset threshold' }], x: { label: 'time (h)', min: Math.max(0, t - 48), max: Math.max(48, t) } });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        // the 24-hour bar
        const bx = 16, bw = W - 32, by = 28, bh = 16, X = h => bx + h / 24 * bw;
        c.fillStyle = 'hsl(48 95% 60%)'; c.fillRect(bx, by, X(V.day) - bx, bh);
        c.fillStyle = dark ? 'hsl(230 40% 18%)' : 'hsl(230 40% 25%)'; c.fillRect(X(V.day), by, bx + bw - X(V.day), bh);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        for (let hh = 0; hh <= 24; hh += 6) kit.label(c, hh + ' h', X(hh), by - 9, { size: 10, align: 'center', color: C.muted });
        for (const [et, kind] of ev) { c.fillStyle = kind === 'R' ? 'hsl(0 90% 55%)' : 'hsl(345 60% 30%)'; c.beginPath(); c.moveTo(X(et), by + bh); c.lineTo(X(et) - 5, by + bh + 9); c.lineTo(X(et) + 5, by + bh + 9); c.fill(); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(X(tod), by - 3); c.lineTo(X(tod), by + bh + 3); c.stroke();
        kit.label(c, 'day ' + V.day + ' h', bx + 4, by + bh / 2, { size: 10.5, color: '#222' });
        kit.label(c, 'night ' + night + ' h', bx + bw - 4, by + bh / 2, { size: 10.5, color: '#eee', align: 'right' });
        // the dark timer
        const ty = by + 44, tw = bw * 0.55, TX = h => bx + clamp(h / 16, 0, 1) * tw;
        const running = !light ? t - darkStart : 0;
        const good = sp.type === 'SD' ? running >= sp.crit : sp.type === 'LD' ? running < sp.crit : true;
        c.fillStyle = C.bg; c.fillRect(bx, ty, tw, 12); c.strokeStyle = C.axis; c.strokeRect(bx, ty, tw, 12);
        c.fillStyle = good ? C.ok : C.warn; c.fillRect(bx, ty, TX(running) - bx, 12);
        if (sp.type !== 'DN') { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(TX(sp.crit), ty - 4); c.lineTo(TX(sp.crit), ty + 16); c.stroke(); kit.label(c, 'critical', TX(sp.crit), ty + 24, { size: 10, align: 'center', color: C.bad }); }
        kit.label(c, 'uninterrupted darkness tonight: ' + running.toFixed(1) + ' h', bx + tw + 8, ty + 6, { size: 11, color: C.text });
        // the log of nights
        const ly = ty + 52, n = Math.min(nights.length, 20);
        kit.label(c, 'last nights (green = inductive):', bx, ly - 10, { size: 10.5, color: C.muted });
        for (let i = 0; i < n; i++) { const e = nights[nights.length - n + i]; c.fillStyle = e.ind ? C.ok : C.faint; c.fillRect(bx + i * 15, ly, 12, 12); }
        // the phytochrome switch: Pr ⇄ Pfr, circle areas in proportion
        const py = (ly + 20 + H) / 2 + 6, pxr = W * 0.08, pxf = W * 0.32, rmax = Math.min(34, (H - ly - 60) / 2);
        if (rmax > 8) {
          kit.dot(c, pxr, py, Math.max(2, rmax * Math.sqrt(1 - phi)), 'hsl(0 75% 55% / 0.35)', C.muted);
          kit.dot(c, pxf, py, Math.max(2, rmax * Math.sqrt(phi)), 'hsl(345 60% 35% / 0.45)', C.muted);
          kit.label(c, 'Pr', pxr, py, { size: 12, align: 'center', weight: 600 });
          kit.label(c, 'Pfr (active)', pxf, py, { size: 12, align: 'center', weight: 600 });
          kit.arrow(c, pxr + rmax * 0.6, py - rmax * 0.55, pxf - rmax * 0.6, py - rmax * 0.55, 'hsl(0 85% 55%)', 2);
          kit.arrow(c, pxf - rmax * 0.6, py + rmax * 0.55, pxr + rmax * 0.6, py + rmax * 0.55, 'hsl(345 60% 40%)', 2);
          kit.label(c, 'red (660 nm)', (pxr + pxf) / 2, py - rmax * 0.55 - 10, { size: 10.5, align: 'center', color: C.muted });
          kit.label(c, 'far-red (730 nm), darkness', (pxr + pxf) / 2, py + rmax * 0.55 + 11, { size: 10.5, align: 'center', color: C.muted });
        }
        // the plant
        const gx = W * 0.62, gy = H - 16, days = t / 24;
        c.fillStyle = dark ? 'hsl(30 30% 28%)' : 'hsl(30 35% 55%)'; c.fillRect(gx - 60, gy, 120, 8);
        const induced = flowerDay != null, since = induced ? days - flowerDay : 0;
        const rosette = sp.type === 'LD' && (!induced || since < 1);
        const maxH = gy - (ly + 30);
        const stemH = rosette ? 6 : Math.min(maxH, (sp.type === 'LD' ? 20 + 30 * since : 20 + 5 * days));
        c.strokeStyle = 'hsl(120 45% 35%)'; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy - stemH); c.stroke();
        c.fillStyle = 'hsl(120 50% ' + (dark ? 40 : 38) + '%)';
        const nLeaves = rosette ? 8 : Math.max(2, Math.min(10, Math.floor(stemH / 16)));
        for (let i = 0; i < nLeaves; i++) {
          if (rosette) { const a = i / nLeaves * Math.PI; c.beginPath(); c.ellipse(gx + Math.cos(a) * 20 * (i % 2 ? 1 : -1), gy - 6 - Math.sin(a) * 4, 22, 7, (i % 2 ? 1 : -1) * 0.25, 0, kit.TAU); c.fill(); }
          else { const y = gy - (i + 0.5) / nLeaves * stemH * 0.9, sd = i % 2 ? 1 : -1; c.beginPath(); c.ellipse(gx + sd * 16, y, 15, 6, sd * -0.4, 0, kit.TAU); c.fill(); }
        }
        if (induced && since >= 2) {                           // buds, then open flowers at the top
          const open = since >= 5, nf = sp.type === 'LD' ? 5 : 3;
          for (let i = 0; i < nf; i++) {
            const fx = gx + (i - (nf - 1) / 2) * 11, fy = gy - stemH - 6 - (sp.type === 'LD' ? -i * 9 : Math.abs(i - 1) * -4);
            if (open) {
              c.fillStyle = 'hsl(' + sp.hue + ' 85% 60%)';
              for (let k = 0; k < 6; k++) { const a = k / 6 * kit.TAU; c.beginPath(); c.arc(fx + Math.cos(a) * 5, fy + Math.sin(a) * 5, 3.5, 0, kit.TAU); c.fill(); }
              kit.dot(c, fx, fy, 2.5, 'hsl(35 80% 40%)');
            } else kit.dot(c, fx, fy, 3.5, 'hsl(' + sp.hue + ' 45% 45%)');
          }
        }
        kit.label(c, sp.type === 'SD' ? 'short-day plant' : sp.type === 'LD' ? 'long-day plant' : 'day-neutral plant', gx + 66, gy - 2, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ germination */
  const SEED_SPECIES = [
    { name: 'Garden pea', Tb: 3, To: 22, Tc: 35, psib: -1.0, sd: 0.25, theta: 60, KO2: 3, light: false, dorm: false, hue: 85, sat: 45, L: 55, rx: 1, ry: 1 },
    { name: 'Maize', Tb: 9, To: 31, Tc: 44, psib: -1.2, sd: 0.3, theta: 60, KO2: 3, light: false, dorm: false, hue: 45, sat: 85, L: 55, rx: 0.9, ry: 1.1, shoot: true },
    { name: 'Lettuce (\'Grand Rapids\', needs light)', Tb: 3, To: 20, Tc: 30, psib: -0.9, sd: 0.25, theta: 25, KO2: 2, light: true, dorm: false, hue: 35, sat: 20, L: 45, rx: 0.3, ry: 0.75 },
    { name: 'Rice', Tb: 11, To: 32, Tc: 42, psib: -0.8, sd: 0.25, theta: 40, KO2: 0.3, anaerobic: true, light: false, dorm: false, hue: 45, sat: 40, L: 72, rx: 0.4, ry: 0.95, shoot: true },
    { name: 'Apple (dormant until chilled)', Tb: 1, To: 12, Tc: 25, psib: -1.0, sd: 0.25, theta: 150, KO2: 3, light: false, dorm: true, hue: 25, sat: 55, L: 30, rx: 0.5, ry: 0.85 }
  ];
  const SEED_LIGHTS = [['darkness', 0.15], ['white light', 0.6], ['a red flash, then darkness', 0.85], ['a far-red flash, then darkness', 0.03], ['red, then far-red', 0.031], ['shade under leaves (far-red rich)', 0.22]];

  Hyper.sim('plant-germination', {
    title: 'A germination experiment',
    blurb: `Sixty seeds on wet filter paper. Each seed first imbibes water (it swells), then waits through a lag phase, and germinates when its radicle breaks through the coat. The timing follows the hydrothermal-time model used by seed scientists: a seed progresses at a rate proportional to (ψ − ψb)(T − Tb) below the optimum temperature, falling to zero at the maximum, and slowed by a lack of oxygen. Each seed has its own base water potential ψb (normally distributed in the lot), which is why germination spreads out in an S-shaped curve. Lettuce seeds also need enough active phytochrome (Pfr) — each seed has its own threshold — and apple seeds stay dormant until they have had enough weeks of moist cold. Changing a condition sows a fresh dish; the last runs stay on the graph for comparison.

**Try this**
- Peas at 20 °C, then at 8 °C: the same S-curve, stretched in time — thermal time. Below 3 °C nothing happens.
- Maize at 8 °C: nothing — below its base temperature of about 9 °C, the reason maize is sown late in spring. Then try 40 °C and 45 °C.
- Lower the water potential of the paper to −0.5 and −1.0 MPa (as a drying soil would): germination slows, and at −1.0 MPa only the seeds with a low base water potential make it.
- Lettuce in darkness, then in white light, then with a red flash, a far-red flash, and red followed by far-red. Under leaf shade most seeds wait for a gap in the canopy.
- Cut the oxygen to zero: peas and maize cannot germinate; rice still sends up its coleoptile by fermentation, but no root.
- Apple seeds without cold stratification: none germinate. Give them 60, then 90 days.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const gb = plotBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Seeds', options: SEED_SPECIES.map((s, i) => [s.name, i]), value: 0 },
        { id: 'T', label: 'Temperature', min: 0, max: 45, step: 0.5, value: 20, unit: '°C' },
        { id: 'water', type: 'check', label: 'Water supplied', value: true },
        { id: 'psi', label: 'Water potential of the paper (0 = pure water)', min: -2, max: 0, step: 0.05, value: 0, unit: 'MPa' },
        { id: 'O2', label: 'Oxygen in the air', min: 0, max: 21, step: 0.5, value: 21, unit: '%' },
        { id: 'light', type: 'select', label: 'Light', options: SEED_LIGHTS.map((s, i) => [s[0], i]), value: 0 },
        { id: 'strat', label: 'Moist cold (stratification) before sowing', min: 0, max: 120, step: 5, value: 0, unit: 'days' },
        { id: 'speed', label: 'Days per second', min: 0.1, max: 4, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'sow', label: 'Sow again', primary: true }, { id: 'clear', label: 'Clear old curves' }] }
      ], (id) => {
        if (id === 'clear') { old = []; return; }
        if (id !== 'speed') sow();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Days since sowing'], ['g', 'Germinated'], ['t50', 'Time to 50 %'], ['w', 'Water taken up (of dry mass)'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'days after sowing', min: 0 }, y: { label: 'germinated (%)', min: 0, max: 100 }, legend: true }, 170);
      const N = 60, TMAX = 40;
      let sp, seeds, t, curve, old = [], t50, tag;
      function sow() {
        if (curve && curve.length > 5 && t > 1) { old.push({ pts: curve, label: tag }); if (old.length > 3) old.shift(); }
        sp = SEED_SPECIES[V.sp] || SEED_SPECIES[0];
        const R = B.rng(101 + V.sp), Z = normals(B.rng(7 + V.sp));
        seeds = [];
        const cols = 10, rows = 6;
        for (let i = 0; i < N; i++) {
          const gx = (i % cols + 0.5) / cols * 2 - 1, gy = (Math.floor(i / cols) + 0.5) / rows * 2 - 1;
          seeds.push({ x: gx * 0.78 + (R() - 0.5) * 0.08, y: gy * 0.62 + (R() - 0.5) * 0.08, rot: R() * 6.283, psib: sp.psib + sp.sd * Z(), req: 0.05 + 0.5 * R(), chill: 30 + 60 * R(), p: 0, w: 0, g: null });
        }
        t = 0; curve = [[0, 0]]; t50 = null;
        const lt = SEED_LIGHTS[V.light] ? SEED_LIGHTS[V.light][0] : '';
        tag = sp.name.split(' (')[0] + ', ' + V.T + ' °C, ' + (V.water ? V.psi + ' MPa' : 'dry') + (V.O2 < 21 ? ', O₂ ' + V.O2 + ' %' : '') + (sp.light ? ', ' + lt : '') + (sp.dorm ? ', ' + V.strat + ' d cold' : '');
      }
      const pfr = () => (SEED_LIGHTS[V.light] || SEED_LIGHTS[0])[1];
      function rate(s) {                                      // progress per day
        if (!V.water) return 0;
        const T = V.T;
        if (T <= sp.Tb || T >= sp.Tc) return 0;
        const teff = T <= sp.To ? T - sp.Tb : (sp.To - sp.Tb) * (sp.Tc - T) / (sp.Tc - sp.To);
        const dpsi = V.psi - s.psib;
        if (dpsi <= 0) return 0;
        let fo = (V.O2 / (V.O2 + sp.KO2)) / (21 / (21 + sp.KO2));
        if (sp.anaerobic) fo = Math.max(0.7, fo);
        return dpsi * teff / sp.theta * fo;
      }
      function step(h) {                                     // h in days
        const weq = V.water ? Math.exp(V.psi / 1.5) : 0;
        for (const s of seeds) {
          s.w += (weq - s.w) * (1 - Math.exp(-h * 6));
          if (s.g != null) continue;
          let r = rate(s);
          const blocked = (sp.light && pfr() < s.req) || (sp.dorm && V.strat < s.chill) || (!sp.anaerobic && V.O2 <= 0);
          s.p += r * h;
          if (blocked) s.p = Math.min(s.p, 0.5);             // imbibed, but waiting in the lag phase
          if (s.p >= 1) s.g = t + h;
        }
        t += h;
      }
      function limit() {
        if (!V.water) return 'Dry seeds cannot imbibe: they stay as they are, for years.';
        if (V.T <= sp.Tb) return 'Too cold: below the base temperature (' + sp.Tb + ' °C).';
        if (V.T >= sp.Tc) return 'Too hot: above the maximum (' + sp.Tc + ' °C).';
        if (sp.dorm && V.strat < 30) return 'Dormant: apple seeds need about 60–90 days of moist cold first.';
        if (V.O2 <= 0 && !sp.anaerobic) return 'No oxygen: the embryos cannot respire.';
        if (sp.anaerobic && V.O2 < 1) return 'Rice without oxygen: the coleoptile grows by fermentation; the root waits.';
        if (sp.light && pfr() < 0.3) return 'Too little active phytochrome: most seeds wait for light.';
        if (V.psi <= sp.psib) return 'Too dry: below the base water potential of most seeds.';
        if (V.T > sp.To) return 'Above the optimum: germination slows as it gets hotter.';
        return 'Conditions allow germination.';
      }
      sow();
      const loop = kit.loop((dt) => {
        if (t < TMAX) {
          const simDt = dt * V.speed, sub = Math.max(1, Math.ceil(simDt / 0.02));
          for (let i = 0; i < sub; i++) step(simDt / sub);
          const ng = seeds.filter(s => s.g != null).length;
          if (t - curve[curve.length - 1][0] > 0.05) curve.push([t, 100 * ng / N]);
          if (t50 == null && ng >= N / 2) t50 = t;
        }
        const ng = seeds.filter(s => s.g != null).length;
        ro.set('day', t.toFixed(1) + (t >= TMAX ? ' (end)' : ''));
        ro.set('g', ng + ' of ' + N + ' (' + (100 * ng / N).toFixed(0) + ' %)');
        ro.set('t50', t50 == null ? 'not yet' : t50.toFixed(1) + ' days');
        ro.set('w', (100 * seeds.reduce((a, s) => a + s.w, 0) / N).toFixed(0) + ' %');
        ro.set('msg', limit());
        plot.set({ series: old.map(o => ({ pts: o.pts, label: o.label, dash: [5, 4] })).concat([{ pts: curve, label: tag }]), x: { label: 'days after sowing', min: 0, max: Math.max(5, Math.min(TMAX, Math.ceil(t + 0.5))) } });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const cx = W * 0.5, cy = H * 0.5, Rd = Math.min(W * 0.46, H * 0.46), pxmm = Rd / 45;
        c.fillStyle = V.water ? (dark ? 'hsl(200 20% 26%)' : 'hsl(200 30% 90%)') : (dark ? 'hsl(40 15% 26%)' : 'hsl(40 30% 88%)');
        c.beginPath(); c.arc(cx, cy, Rd, 0, kit.TAU); c.fill();
        c.strokeStyle = C.axis; c.lineWidth = 2; c.stroke();
        const anox = V.O2 < 1;
        for (const s of seeds) {
          const x = cx + s.x * Rd, y = cy + s.y * Rd, sw = 1 + 0.35 * clamp(s.w, 0, 1.2), sz = Rd * 0.045 * sw;
          // radicle (and coleoptile) after germination
          if (s.g != null) {
            const age = t - s.g, len = Math.min(16, age * 4) * pxmm;
            const ux = Math.cos(s.rot), uy = Math.sin(s.rot);
            if (!(sp.anaerobic && anox)) {
              c.strokeStyle = dark ? 'hsl(45 40% 85%)' : 'hsl(45 30% 97%)'; c.lineWidth = Math.max(1.5, sz * 0.35);
              c.beginPath(); c.moveTo(x + ux * sz, y + uy * sz); c.quadraticCurveTo(x + ux * (sz + len * 0.6) - uy * len * 0.3, y + uy * (sz + len * 0.6) + ux * len * 0.3, x + ux * (sz + len), y + uy * (sz + len)); c.stroke();
              c.strokeStyle = C.muted; c.lineWidth = 0.8; c.stroke();
            }
            if (sp.shoot && age > 0.8) {
              const sl = Math.min(10, (age - 0.8) * 3) * pxmm;
              c.strokeStyle = 'hsl(110 55% 42%)'; c.lineWidth = Math.max(1.5, sz * 0.3);
              c.beginPath(); c.moveTo(x - ux * sz, y - uy * sz); c.lineTo(x - ux * (sz + sl), y - uy * (sz + sl)); c.stroke();
            }
          }
          c.fillStyle = 'hsl(' + sp.hue + ' ' + sp.sat + '% ' + (sp.L + (dark ? 0 : 0)) + '%)';
          c.strokeStyle = C.text; c.lineWidth = 0.8;
          c.beginPath(); c.ellipse(x, y, Math.max(0.5, sz * sp.rx), Math.max(0.5, sz * sp.ry), s.rot + Math.PI / 2, 0, kit.TAU); c.fill(); c.stroke();
        }
        // the light the dish is in
        const tint = [dark ? 'rgba(0,0,0,0.45)' : 'rgba(10,15,30,0.35)', null, 'rgba(230,30,30,0.13)', 'rgba(110,0,20,0.28)', 'rgba(110,0,20,0.28)', 'rgba(20,120,40,0.16)'][V.light] || null;
        if (tint) { c.fillStyle = tint; c.beginPath(); c.arc(cx, cy, Rd, 0, kit.TAU); c.fill(); }
        kit.label(c, (SEED_LIGHTS[V.light] || SEED_LIGHTS[0])[0] + ' · ' + V.T + ' °C · ' + (V.water ? 'ψ ' + V.psi + ' MPa' : 'dry') + ' · O₂ ' + V.O2 + ' %', 10, 14, { size: 11, color: C.muted });
        kit.label(c, 'dish 90 mm', W - 10, H - 12, { size: 10.5, color: C.muted, align: 'right' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ mineral nutrition */
  const NUTRIENTS = [
    { id: 'N', lo: 4.5, hi: 8.8, w: 0.35, mobile: true, sym: 'old leaves turn evenly yellow' },
    { id: 'P', lo: 5.2, hi: 8.0, w: 0.35, mobile: true, sym: 'old leaves dark green to purplish' },
    { id: 'K', lo: 4.5, hi: 10, w: 0.35, mobile: true, sym: 'old leaves scorched at the margins' },
    { id: 'Mg', lo: 5.0, hi: 9.5, w: 0.35, mobile: true, sym: 'old leaves yellow between green veins' },
    { id: 'Fe', lo: 2.0, hi: 7.4, w: 0.3, mobile: false, sym: 'young leaves yellow between green veins' }
  ];

  Hyper.sim('plant-nutrients', {
    title: 'Feeding a plant',
    blurb: `A plant grows for six weeks with the supply of five nutrients set by the sliders (100 % = ample). How much of each the roots can actually get depends on the soil pH: phosphate is locked up in acid and in alkaline soils, iron becomes insoluble above about pH 7.5, and below pH 5 aluminium ions poison the roots. Uptake saturates, like an enzyme, and growth is set by the scarcest nutrient — Liebig's law of the minimum, drawn as a barrel that holds water only up to its shortest stave. Deficiency symptoms appear on the old leaves for mobile nutrients (N, P, K, Mg), which the plant moves to its young leaves, and on the young leaves for immobile iron. The dashed curve is a fully fed plant sown at the same time. Changing a setting sows again.

**Try this**
- Halve the nitrogen: the old leaves yellow first and growth slows. Then halve only the iron: now the youngest leaves go pale between green veins.
- Raise the pH to 8: iron and phosphate become the short staves even at full supply — lime-induced chlorosis. Lower it to 4.5: aluminium toxicity takes over.
- Add more of a nutrient that is not limiting: nothing improves. Only raising the shortest stave helps.
- Starve the plant of phosphate, then add mycorrhizal fungi: they fetch phosphate from beyond the roots' reach (at a small cost in sugar).
- Set nitrogen to zero and tick the legume nodules: bacteria fix nitrogen from the air.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 290 });
      const gb = plotBox(box);
      const defs = NUTRIENTS.map(n => ({ id: n.id, label: n.id + ' supply', min: 0, max: 150, step: 5, value: 100, unit: '%' }));
      const ctl = kit.controls(box.side, defs.concat([
        { id: 'pH', label: 'Soil pH', min: 4, max: 9, step: 0.1, value: 6.5 },
        { id: 'myco', type: 'check', label: 'Mycorrhizal fungi on the roots', value: false },
        { id: 'legume', type: 'check', label: 'Legume with nitrogen-fixing nodules', value: false },
        { id: 'speed', label: 'Days per second', min: 0.5, max: 10, step: 0.5, value: 3 },
        { type: 'buttons', items: [{ id: 'sow', label: 'Sow again', primary: true }] }
      ]), (id) => { if (id !== 'speed') sow(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Day'], ['lim', 'Limiting'], ['av', 'Available at this pH (N P K Mg Fe)'], ['mass', 'Dry mass: this plant / fully fed'], ['sym', 'Symptoms']]);
      const plot = kit.plot(gb, { x: { label: 'days after sowing', min: 0, max: 42 }, y: { label: 'dry mass (g)', min: 0 }, legend: true }, 160);
      const TMAX = 42, RGR = 0.22, BMAX = 60, B0 = 0.05;
      let t, Bm, Bc, leaves, leafAcc, hist;
      function sow() { t = 0; Bm = B0; Bc = B0; leaves = [0, 0]; leafAcc = 0; hist = [[0, B0, B0]]; }
      function status() {
        const s = {}, av = {};
        for (const n of NUTRIENTS) {
          let a = V[n.id] / 100 * windowFn(V.pH, n.lo, n.hi, n.w);
          if (V.myco && n.id === 'P') a *= 2.2;
          if (V.myco && n.id === 'N') a *= 1.1;
          if (V.legume && n.id === 'N') a += 0.9 * windowFn(V.pH, 5.3, 8.5, 0.35);
          av[n.id] = a;
          s[n.id] = Math.min(1, 1.25 * a / (a + 0.25));
        }
        s.Al = 1 / (1 + Math.exp((4.9 - V.pH) / 0.2));
        let lim = 'N', f = 2;
        for (const k of Object.keys(s)) if (s[k] < f) { f = s[k]; lim = k; }
        const cost = (V.myco ? 0.95 : 1) * (V.legume ? 0.93 : 1);
        return { s, av, f, lim, cost };
      }
      function step(h, S) {
        Bm += h * RGR * S.f * S.cost * Bm * (1 - Bm / BMAX);
        Bc += h * RGR * Bc * (1 - Bc / BMAX);
        leafAcc += h * 0.33 * (0.3 + 0.7 * S.f);              // a new leaf every 3 days when well fed
        if (leafAcc >= 1) { leafAcc -= 1; leaves.push(t); }
        t += h;
      }
      sow();
      const loop = kit.loop((dt) => {
        const S = status();
        if (t < TMAX) {
          const simDt = dt * V.speed, sub = Math.max(1, Math.ceil(simDt / 0.05));
          for (let i = 0; i < sub; i++) step(simDt / sub, S);
          if (t - hist[hist.length - 1][0] > 0.2) hist.push([t, Bm, Bc]);
        }
        const names = { N: 'nitrogen', P: 'phosphate', K: 'potassium', Mg: 'magnesium', Fe: 'iron', Al: 'aluminium toxicity (acid soil)' };
        ro.set('day', t.toFixed(0) + (t >= TMAX ? ' (end)' : ''));
        ro.set('lim', S.f > 0.97 ? 'nothing — all nutrients ample' : names[S.lim] + ' (' + (100 * S.f).toFixed(0) + ' % of full growth rate)');
        ro.set('av', NUTRIENTS.map(n => (100 * S.av[n.id]).toFixed(0)).join(' · ') + ' %');
        ro.set('mass', Bm.toFixed(2) + ' g / ' + Bc.toFixed(2) + ' g');
        const worst = NUTRIENTS.filter(n => S.s[n.id] < 0.85).sort((a, b) => S.s[a.id] - S.s[b.id])[0];
        ro.set('sym', S.s.Al < 0.85 ? 'stunted, stubby roots; whole plant small' : worst ? worst.sym : 'none — healthy green leaves');
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[2]]), label: 'fully fed', dash: [5, 4] }, { pts: hist.map(p => [p[0], p[1]]), label: 'this plant' }] });

        // ---------------------------------------------------------------- drawing
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, dark = C.dark;
        const gx = W * 0.3, gy = H * 0.72;
        c.fillStyle = dark ? 'hsl(30 30% 24%)' : 'hsl(30 35% 58%)'; c.fillRect(0, gy, W * 0.62, H - gy);
        // roots, hyphae and nodules
        const rootL = (18 + 60 * Math.cbrt(Bm / BMAX)) * (0.3 + 0.7 * S.s.Al);
        c.strokeStyle = dark ? 'hsl(40 30% 70%)' : 'hsl(40 30% 92%)'; c.lineWidth = 1.5;
        const rootTips = [];
        for (let k = -3; k <= 3; k++) { const ex = gx + k * rootL * 0.35, ey = gy + rootL * (0.6 + 0.08 * (3 - Math.abs(k))); c.beginPath(); c.moveTo(gx, gy); c.quadraticCurveTo(gx + k * 6, gy + rootL * 0.4, ex, ey); c.stroke(); rootTips.push([ex, ey]); }
        if (V.myco) {
          c.strokeStyle = C.muted; c.lineWidth = 0.7;
          rootTips.forEach(([x, y], i) => { for (let j = 0; j < 4; j++) { const a = (i * 4 + j) * 1.7; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * 26, y + Math.abs(Math.sin(a)) * 16); c.stroke(); } });
        }
        if (V.legume) rootTips.forEach(([x, y]) => { kit.dot(c, (gx + x) / 2, (gy + y) / 2, 3.2, 'hsl(345 70% 65%)'); });
        // shoot
        const Hs = (24 + 170 * Math.cbrt(Bm / BMAX)) * Math.min(1, (gy - 20) / 200);
        c.strokeStyle = 'hsl(115 40% 35%)'; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx, gy - Hs); c.stroke();
        const n = leaves.length, dev = clamp(t / 10, 0, 1);
        for (let i = 0; i < n; i++) {
          const r = n > 1 ? i / (n - 1) : 1, y = gy - (i + 0.8) / (n + 0.5) * Hs, sd = i % 2 ? 1 : -1;
          const size = (0.55 + 0.45 * clamp((t - leaves[i]) / 6, 0, 1)) * (10 + 16 * Math.cbrt(Bm / BMAX)) * (0.7 + 0.3 * S.f);
          // the worst symptom on this leaf
          let best = null, sev = 0;
          for (const nu of NUTRIENTS) {
            const def = 1 - S.s[nu.id], pos = nu.mobile ? clamp(1.4 - 1.6 * r, 0, 1) : clamp(1.6 * r - 0.2, 0, 1), sv = def * pos * dev;
            if (sv > sev) { sev = sv; best = nu.id; }
          }
          if (sev < 0.1) best = null;
          const k = clamp(sev * 1.6, 0, 1);
          let hue = 120, sat = 50, L = dark ? 40 : 36, veins = false, margin = 0;
          if (best === 'N') { hue = lerp(120, 55, k); L += 25 * k; }
          else if (best === 'P') { hue = lerp(120, 290, k); L -= 6 * k; sat = 45; }
          else if (best === 'K') margin = k;
          else if (best === 'Mg') { hue = lerp(120, 55, k); L += 22 * k; veins = true; }
          else if (best === 'Fe') { hue = lerp(120, 58, k); L += 35 * k; sat = 50 + 20 * k; veins = true; }
          const lx = gx + sd * size, ang = sd * -0.35;
          c.fillStyle = 'hsl(' + hue.toFixed(0) + ' ' + sat.toFixed(0) + '% ' + clamp(L, 15, 85).toFixed(0) + '%)';
          c.beginPath(); c.ellipse(lx, y, Math.max(1, size), Math.max(1, size * 0.42), ang, 0, kit.TAU); c.fill();
          if (margin > 0) { c.strokeStyle = 'hsl(25 60% 30%)'; c.lineWidth = 1 + 3 * margin; c.stroke(); }
          c.strokeStyle = veins ? 'hsl(120 55% 32%)' : 'hsl(120 40% 28% / 0.6)'; c.lineWidth = veins ? 1.8 : 0.8;
          c.beginPath(); c.moveTo(gx, y); c.lineTo(lx + sd * size * 0.9 * Math.cos(ang), y + size * 0.9 * Math.sin(ang) * sd); c.stroke();
          if (veins) for (let v = -2; v <= 2; v++) { if (!v) continue; const px = lx + sd * v * size * 0.3 * Math.cos(ang), py = y + sd * v * size * 0.3 * Math.sin(ang); c.beginPath(); c.moveTo(px, py); c.lineTo(px - Math.sin(ang) * size * 0.3, py + Math.cos(ang) * size * 0.3); c.moveTo(px, py); c.lineTo(px + Math.sin(ang) * size * 0.3, py - Math.cos(ang) * size * 0.3); c.stroke(); }
        }
        kit.label(c, 'pH ' + V.pH.toFixed(1), 10, H - 12, { size: 11, color: C.text });
        // Liebig's barrel: staves are the sufficiencies (%), the water stops at the shortest
        const staves = NUTRIENTS.map(nu => [nu.id, S.s[nu.id]]).concat([['Al', S.s.Al]]);
        const bx0 = W * 0.66, bw = (W - bx0 - 14) / staves.length, bb = H - 34, bt = 34, bh = bb - bt;
        staves.forEach(([id, v], i) => {
          const x = bx0 + i * bw, isMin = S.f < 0.97 && id === S.lim;
          c.fillStyle = isMin ? C.bad : (dark ? 'hsl(30 35% 45%)' : 'hsl(30 40% 55%)');
          c.fillRect(x + 3, bb - bh * v, bw - 6, bh * v);
          kit.label(c, id === 'Al' ? 'pH' : id, x + bw / 2, bb + 12, { size: 11, align: 'center', color: C.text });
          kit.label(c, (100 * v).toFixed(0), x + bw / 2, bb - bh * v - 9, { size: 10, align: 'center', color: C.muted });
        });
        c.fillStyle = 'hsl(205 85% 58% / 0.45)'; c.fillRect(bx0, bb - bh * S.f, bw * staves.length, bh * S.f);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx0, bt); c.lineTo(bx0, bb); c.lineTo(bx0 + bw * staves.length, bb); c.lineTo(bx0 + bw * staves.length, bt); c.stroke();
        kit.label(c, 'growth is held to the shortest stave', bx0, bt - 14, { size: 10.5, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

})();
