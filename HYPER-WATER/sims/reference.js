/* HYPER-WATER · sims/reference.js — reference simulations for the writers of Hyper Water.
 *   ref-hbond-network   molecules in a box at a chosen temperature: hydrogen bonds form and break before your eyes,
 *                       with the bond count, the lifetime and the thermal energy read from kit.water
 *   ref-ice-floats      an ice cube in a liquid of your choosing, drawn with the right fraction submerged, beside the
 *                       open lattice of ice Ih and the crowded liquid
 *   ref-heat-capacity   two beakers on identical heaters: the temperature of water against another substance, with
 *                       the boiling plateau where the heat goes into steam
 * The numbers come from kit.water (water.js), the drawing from kit.wsym (watersym.js): no sim types a density or a
 * heat capacity it could ask the engine for.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;

  /* ================================================================ the network */
  Hyper.sim('ref-hbond-network', {
    title: 'The network that flickers',
    blurb: `Water molecules in a box, seen from above. A dashed line is a hydrogen bond: a hydrogen of one molecule pointing at the oxygen of another, close enough to hold. Watch any one bond — it lasts a moment, breaks, and a new one forms elsewhere.

**Try this**
- Cool the box to −20 °C: bonds last longer and the molecules settle into rings of six, the beginning of ice.
- Heat it to 90 °C: fewer bonds hold at any instant and each lasts less time — but most molecules still hold two or three. That is why water stays liquid so far.
- Tick *partial charges* to see why the hydrogens point at the oxygens, and *lone pairs* to see what they point at.
- The read-outs give the real numbers for the temperature: how many bonds a molecule holds on average, how long one lasts, and how strong a bond is against a thermal kick.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: -30, max: 100, step: 1, value: params.T != null ? params.T : 25, unit: '°C' },
        { id: 'n', label: 'Molecules', min: 8, max: 40, step: 1, value: params.n || 22 },
        { id: 'bonds', type: 'check', label: 'Show hydrogen bonds', value: true },
        { id: 'charges', type: 'check', label: 'Partial charges δ+ and δ−', value: !!params.charges },
        { id: 'lone', type: 'check', label: 'Lone pairs', value: !!params.lone },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shuffle', primary: true }] }
      ], (id) => { if (id === 'n' || id === 'shake') net = null; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['per', 'Bonds per molecule (model)'], ['now', 'Bonds on screen'], ['life', 'Bond lifetime'], ['kT', 'Bond energy ÷ thermal energy'], ['rho', 'Density at this temperature']]);
      let net = null, sc = 18, acc = 0, count = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        sc = Math.max(12, Math.min(22, Math.sqrt(Wd * Hh / V.n) / 4.2));
        if (!net || net.length !== V.n) net = S.makeNetwork(V.n, Wd - 70, Hh, sc, Math.floor(Math.random() * 1e6));
        const T = V.T;
        const step = Math.min(dt, 0.05) * (V.slow ? 0.25 : 1);
        let bonds = [];
        for (let i = 0; i < 3; i++) bonds = S.stepNetwork(net, step / 3, { T, W: Wd - 70, H: Hh, scale: sc });
        // draw
        if (V.bonds) for (const [i, j, k] of bonds) {
          const a = net[i], h = [a.x + 0.96 * sc * Math.cos(a.a + (k ? 1 : -1) * 0.9115), a.y + 0.96 * sc * Math.sin(a.a + (k ? 1 : -1) * 0.9115)];
          S.hbond(c, h[0], h[1], net[j].x, net[j].y, { alpha: 0.75 });
        }
        for (const m of net) S.molecule(c, m.x, m.y, { angle: m.a, scale: sc, charges: V.charges, lone: V.lone });
        // a thermometer at the right
        S.thermometer(c, Wd - 40, 16, Hh - 40, T, { min: -30, max: 100 });
        kit.label(c, T <= 0 ? 'below freezing: the liquid is supercooled' : T >= 100 ? 'at the boiling point' : '', 12, Hh - 12, { color: C.muted, size: 11.5 });
        // readouts, averaged over frames so they do not jitter
        acc += bonds.length; count++;
        if (count >= 12) {
          ro.set('now', (acc / count / V.n).toFixed(2) + ' per molecule (' + Math.round(acc / count) + ' bonds)');
          acc = 0; count = 0;
        }
        ro.set('per', W.hbondsPerMolecule(T).toFixed(2) + ' of 4');
        ro.set('life', (W.hbondLifetime(T) * 1e12).toFixed(2) + ' ps');
        ro.set('kT', (W.HBOND.energy / (W.R * (T + 273.15))).toFixed(1) + ' × kT');
        ro.set('rho', W.density(T).toFixed(1) + ' kg/m³');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ice floats */
  Hyper.sim('ref-ice-floats', {
    title: 'Why ice floats',
    blurb: `Left: a block of ice in a liquid, drawn with exactly the fraction submerged that the two densities demand — a floating body displaces its own weight. Right: the molecules, the open hexagonal lattice of ice Ih above and the crowded liquid below, at the same scale.

**Try this**
- Put the ice in *sea water*: it rides a little higher (89 % submerged instead of 92 %). In *saturated brine* a quarter of it shows.
- Put it in *ethanol*: it sinks. Ethanol is lighter than ice.
- Choose *heavy ice* (frozen D₂O, 1,017 kg/m³) in ordinary water: it sinks too, which is how you tell heavy water by eye.
- Count the neighbours in the lattice: every oxygen has exactly four, and the hexagonal rings leave channels wide enough for another molecule. Melt it (the button) and watch the molecules fall into the gaps.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const LIQ = [['Fresh water, 0 °C (999.8)', 999.84], ['Fresh water, 4 °C (999.97)', 999.97], ['Sea water (1,025)', 1025], ['Saturated brine (1,200)', 1200], ['Heavy water D₂O (1,105)', 1105], ['Ethanol (789)', 789], ['Olive oil (915)', 915], ['Mercury (13,534)', 13534]];
      const ICE = [['Ordinary ice Ih (916.7)', 916.7], ['Heavy ice, frozen D₂O (1,017)', 1017], ['Snow, packed (400)', 400], ['Ice with 10 % air bubbles (825)', 825]];
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'The liquid', options: LIQ, value: params.liq || 999.84 },
        { id: 'ice', type: 'select', label: 'The solid', options: ICE, value: params.ice || 916.7 },
        { id: 'size', label: 'Block size', min: 0.3, max: 1, step: 0.05, value: 0.7 },
        { type: 'buttons', items: [{ id: 'melt', label: 'Melt the lattice', primary: true }, { id: 'freeze', label: 'Freeze again' }] }
      ], (id) => { if (id === 'melt') melt = 1; if (id === 'freeze') melt = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['f', 'Fraction submerged'], ['above', 'Showing above the surface'], ['dv', 'Expansion on freezing'], ['state', 'The block']]);
      let melt = 0, phase = 0, net = null;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const rhoL = V.liq, rhoI = V.ice, f = rhoI / rhoL, sinks = f >= 1;
        phase += dt;
        /* ---- left: the beaker */
        const bx = 24, bw = Math.min(Wd * 0.42, 260), bh = Hh - 60, by = 30;
        const fill = 0.78;
        const liqCol = rhoL > 5000 ? 'rgba(170,170,180,0.6)' : rhoL < 800 ? 'rgba(240,210,120,0.45)' : rhoL === 915 ? 'rgba(200,190,80,0.5)' : 'rgba(70,150,235,0.45)';
        S.beaker(c, bx, by, bw, bh, fill, { liquid: liqCol, label: LIQ.find(l => l[1] === rhoL)[0].replace(/ \(.*/, '') });
        const surfY = by + bh - fill * bh;
        // the block: a rounded square whose submerged fraction is f (by height, since it is a prism)
        const side = V.size * Math.min(bw * 0.6, bh * 0.45);
        let top;
        if (sinks) top = by + bh - 2 - side; else top = surfY - side * (1 - f);
        const bobble = sinks ? 0 : 1.5 * Math.sin(phase * 1.3);
        const x0 = bx + bw / 2 - side / 2, y0 = top + bobble;
        c.save();
        c.fillStyle = 'rgba(210,235,255,0.9)'; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.roundRect ? c.roundRect(x0, y0, side, side, 6) : c.rect(x0, y0, side, side); c.fill(); c.stroke();
        // the submerged part, tinted by the liquid
        c.beginPath(); c.rect(x0, Math.max(y0, surfY), side, Math.max(0, y0 + side - Math.max(y0, surfY))); c.fillStyle = liqCol; c.fill();
        c.restore();
        if (!sinks) {
          kit.arrow(c, x0 + side + 14, surfY, x0 + side + 14, y0, C.warn, 1.5);
          kit.label(c, Math.round((1 - f) * 100) + ' % above', x0 + side + 20, (surfY + y0) / 2, { color: C.warn, size: 11.5, baseline: 'middle' });
          kit.arrow(c, x0 + side + 14, surfY, x0 + side + 14, y0 + side, C.accent, 1.5);
          kit.label(c, Math.round(f * 100) + ' % below', x0 + side + 20, (surfY + y0 + side) / 2, { color: C.accent, size: 11.5, baseline: 'middle' });
        } else kit.label(c, 'sinks: the solid is denser than the liquid', bx + bw / 2, by - 12, { color: C.bad, size: 12, align: 'center', weight: 650 });
        kit.label(c, 'ρ liquid ' + rhoL + ' kg/m³ · ρ solid ' + rhoI + ' kg/m³', bx, Hh - 8, { color: C.muted, size: 11 });
        /* ---- right: the lattice and the liquid */
        const rx = bx + bw + 40, rw = Wd - rx - 16, cx = rx + rw / 2;
        const a = Math.max(14, Math.min(26, rw / 11));
        kit.label(c, melt ? 'melted: about a tenth of the bonds gone, molecules in the gaps' : 'ice Ih: every molecule holds four neighbours; the rings leave channels', cx, by - 10, { color: C.muted, size: 11.5, align: 'center' });
        if (!melt) {
          S.iceLattice(c, cx, by + bh * 0.5, a, 2, { molecules: true, angle: Math.PI / 6 });
        } else {
          if (!net) {
            net = S.makeNetwork(24, rw, bh - 20, a * 0.7, 99);
            for (const m of net) { m.x += rx; m.y += by + 10; }
          }
          // a slow jiggle at 0 °C
          const bonds = S.stepNetwork(net, Math.min(dt, 0.05) * 0.5, { T: 0, W: Wd, H: Hh, scale: a * 0.7 });
          for (const m of net) { m.x = Math.max(rx + 8, Math.min(rx + rw - 8, m.x)); m.y = Math.max(by + 8, Math.min(by + bh - 8, m.y)); }
          S.network(c, net, { scale: a * 0.7, bonds });
        }
        kit.label(c, (melt ? W.density(0).toFixed(1) : W.densityIce(0).toFixed(1)) + ' kg/m³ at 0 °C', cx, by + bh + 8, { color: C.text, size: 12, align: 'center', weight: 600 });
        ro.set('f', sinks ? 'sinks (ρ solid ≥ ρ liquid)' : (100 * f).toFixed(1) + ' %');
        ro.set('above', sinks ? '—' : (100 * (1 - f)).toFixed(1) + ' %');
        ro.set('dv', '+' + (100 * (W.density(0) / W.densityIce(0) - 1)).toFixed(2) + ' % by volume (ordinary ice)');
        ro.set('state', sinks ? 'on the bottom' : 'floating');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat capacity */
  Hyper.sim('ref-heat-capacity', {
    title: 'Two beakers, one heater each',
    blurb: `Equal masses of water and of another substance on identical heaters, started together at 20 °C. The graph is temperature against time; the thermometers show it live. When water reaches 100 °C it stops warming and starts boiling away: the heat is going into steam, 2,257 kJ for every kilogram.

**Try this**
- Compare with *ethanol*: it warms nearly twice as fast — and boils at 78 °C, long before the water.
- Compare with *iron*: nine times faster. A kilogram of iron is a small block; a kilogram of water is a litre.
- Compare with *sand* or *granite*: the beach at noon.
- Raise the power or lower the mass: the slopes scale, the ratios do not. The ratio of the slopes is the ratio of the specific heats.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220, maxH: 300 });
      box.stage.appendChild(graph);
      const SUBS = [['Ethanol (2,440 J/kg·K, boils at 78 °C)', 'ethanol'], ['Olive oil (1,970)', 'oil'], ['Mercury (140)', 'mercury'], ['Iron (449)', 'iron'], ['Granite (790)', 'granite'], ['Dry sand (830)', 'sand'], ['Ice at −20 °C (2,050, then melts)', 'ice'], ['Glycerol (2,430)', 'glycerol']];
      const PROPS = { ethanol: { cp: 2440, bp: 78.4, Lv: 841e3 }, oil: { cp: 1970, bp: Infinity }, mercury: { cp: 140, bp: 357, Lv: 295e3 }, iron: { cp: 449, bp: Infinity }, granite: { cp: 790, bp: Infinity }, sand: { cp: 830, bp: Infinity }, glycerol: { cp: 2430, bp: 290, Lv: 974e3 }, ice: { cp: 2050, bp: Infinity } };
      const ctl = kit.controls(box.side, [
        { id: 'other', type: 'select', label: 'Compare water with', options: SUBS, value: params.other || 'ethanol' },
        { id: 'P', label: 'Heater power (each)', min: 200, max: 3000, step: 50, value: 1000, unit: 'W' },
        { id: 'm', label: 'Mass (each)', min: 0.2, max: 3, step: 0.1, value: 1, unit: 'kg' },
        { id: 'speed', label: 'Time speed-up', min: 1, max: 60, step: 1, value: 20, unit: '×' },
        { type: 'buttons', items: [{ id: 'go', label: 'Restart', primary: true }] }
      ], (id) => { if (id === 'go' || id === 'other' || id === 'm' || id === 'P') reset(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['Tw', 'Water'], ['To', 'The other'], ['ratio', 'Warming rate, other ÷ water'], ['steam', 'Water boiled away']]);
      const plot = kit.plot(graph, { x: { label: 'time (s)', min: 0 }, y: { label: 'temperature (°C)', min: 0, max: 110 }, legend: true }, 200);
      let t = 0, Tw = 20, To = 20, mw = 1, mo = 1, ice = 0, melted = 0, ptsW = [], ptsO = [], running = true;
      function reset() {
        t = 0; Tw = 20; mw = V.m; mo = V.m; ptsW = []; ptsO = []; running = true; melted = 0;
        To = V.other === 'ice' ? -20 : 20; ice = V.other === 'ice' ? 1 : 0;
      }
      reset();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const P = V.P, pr = PROPS[V.other];
        if (running) {
          const h = Math.min(dt, 0.05) * V.speed;
          const sub = 10;
          for (let i = 0; i < sub; i++) {
            const d = h / sub;
            // water: warm with the real cp(T), hold at the boiling point and boil off
            const bpW = 100;
            if (Tw < bpW) { Tw = Math.min(bpW, Tw + P * d / (mw * W.heatCapacity(Tw))); }
            else if (mw > 0.02) { mw = Math.max(0.02, mw - P * d / W.latentVaporisation(100)); }
            // the other: ice first melts
            if (ice && To >= 0 && melted < 1) { melted = Math.min(1, melted + P * d / (mo * W.LATENT_FUSION)); To = 0; }
            else if (To < pr.bp) { const cp = ice ? (melted >= 1 ? W.heatCapacity(Math.max(0, To)) : 2050) : pr.cp; To = Math.min(pr.bp, To + P * d / (mo * cp)); }
            else if (pr.Lv && mo > 0.02) mo = Math.max(0.02, mo - P * d / pr.Lv);
            t += d;
          }
          if (t > 2400 || (mw <= 0.02 && (mo <= 0.02 || !pr.Lv || !Number.isFinite(pr.bp)))) running = false;
          if (!ptsW.length || t - ptsW[ptsW.length - 1][0] > 2) { ptsW.push([t, Tw]); ptsO.push([t, To]); }
        }
        /* ---- the beakers */
        const bw = Math.min(110, Wd * 0.18), bh = Hh - 70, gap = Wd / 2;
        for (const [k, x, T, m, name, col] of [[0, gap / 2 - bw / 2 - 30, Tw, mw, 'water', C.accent], [1, gap + gap / 2 - bw / 2 - 30, To, mo, SUBS.find(s => s[1] === V.other)[0].replace(/ \(.*/, ''), C.warn]]) {
          const by = 20;
          const fillCol = k === 0 ? 'rgba(70,150,235,0.5)' : V.other === 'mercury' ? 'rgba(170,170,180,0.6)' : V.other === 'iron' ? 'rgba(120,120,130,0.8)' : V.other === 'ice' && melted < 1 ? 'rgba(200,230,255,0.85)' : 'rgba(240,180,90,0.5)';
          S.beaker(c, x, by, bw, bh, 0.75 * (m / V.m), { liquid: fillCol, label: name + ' · ' + m.toFixed(2) + ' kg' });
          // the heater
          c.fillStyle = T > 50 ? C.bad : C.warn; c.fillRect(x - 6, by + bh + 2, bw + 12, 5);
          // steam
          if (k === 0 && Tw >= 99.9) for (let i = 0; i < 3; i++) kit.label(c, '~', x + bw * (0.25 + 0.25 * i), by - 6 - 8 * Math.sin(t * 0.3 + i), { color: C.muted, size: 16, align: 'center' });
          if (k === 1 && To >= pr.bp - 0.1 && Number.isFinite(pr.bp)) for (let i = 0; i < 3; i++) kit.label(c, '~', x + bw * (0.25 + 0.25 * i), by - 6 - 8 * Math.sin(t * 0.3 + i), { color: C.muted, size: 16, align: 'center' });
          S.thermometer(c, x + bw + 34, by, bh, T, { min: -20, max: 120, color: col });
        }
        kit.label(c, P + ' W into each · ' + Math.round(t) + ' s', Wd / 2, Hh - 6, { color: C.muted, size: 11.5, align: 'center' });
        plot.set({ series: [{ pts: ptsW, label: 'water', color: C.accent }, { pts: ptsO, label: SUBS.find(s => s[1] === V.other)[0].replace(/ \(.*/, ''), color: C.warn }], x: { label: 'time (s)', min: 0, max: Math.max(60, t) }, y: { label: 'temperature (°C)', min: -25, max: Math.max(110, Math.min(400, To + 10)) }, hlines: [{ y: 100, label: 'water boils' }] });
        ro.set('t', Math.round(t) + ' s');
        ro.set('Tw', Tw.toFixed(1) + ' °C');
        ro.set('To', To.toFixed(1) + ' °C' + (ice && melted < 1 && To >= 0 ? ' (melting, ' + Math.round(melted * 100) + ' %)' : ''));
        ro.set('ratio', (W.heatCapacity(25) / pr.cp).toFixed(2) + ' × faster');
        ro.set('steam', ((V.m - mw) * 1000).toFixed(0) + ' g');
      }, box.stage);
      loop.start();
    }
  });
})();
