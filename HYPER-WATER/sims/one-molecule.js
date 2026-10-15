/* HYPER-WATER · sims/one-molecule.js — the simulations of the topic "One molecule" (topic code om-).
 *   om-molecules        turn water, ammonia, methane (and the heavier hydrides) in 3-D: bond angle, lone pairs, the dipole arrow
 *   om-dipole-field     water molecules in a steady field (alignment against thermal jostling) and in an oscillating one
 *                       (a microwave oven): the lag of the dipoles behind the field is the heat
 *   om-hydride-ladder   boiling points of the hydrides of groups 14–17 against period or mass, with the straight-line
 *                       extrapolation to the first member (the trend water breaks)
 *   om-vibration-modes  the three vibrations of the water molecule, animated, and where they appear in the infrared spectrum
 *   om-colour-of-water  white light through a tube of water: the red is absorbed first (schematic spectrum, rounded
 *                       pure-water absorption coefficients)
 *   om-heavy-water      ice cubes in glasses of ordinary and heavy water, and the two density curves
 *   om-numbers          how many molecules, how big a cube: from one molecule to the oceans
 * Numbers come from kit.water (density, dipole, bond data, the siblings table); the 3-D drawing from kit.mol, the flat
 * drawing from kit.wsym. Local data and local models are marked in the code with their source or the word "schematic".
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2, D2R = Math.PI / 180;
  const DEBYE = 3.33564e-30;              // C·m
  const KB = 1.380649e-23;                // J/K
  const sci = (v, d) => {                 // 4.6 × 10²¹
    if (!(v > 0) || !Number.isFinite(v)) return '0';
    let e = Math.floor(Math.log10(v)), m = v / Math.pow(10, e);
    if (Number(m.toFixed(d == null ? 1 : d)) >= 10) { m /= 10; e += 1; }
    const sup = String(e).replace(/-/g, '⁻').replace(/\d/g, k => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+k]);
    return m.toFixed(d == null ? 1 : d) + ' × 10' + sup;
  };
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ================================================================ three molecules to turn */
  /* geometry of the hydrides (CRC Handbook, microwave and infrared spectroscopy): bond length in ångström, H–X–H angle
     in degrees; water's own numbers come from the engine. */
  const GEO = {
    H2O: { name: 'Water', tex: 'H₂O', c: 'O', n: 2, lp: 2, kind: 'bent' },
    NH3: { name: 'Ammonia', tex: 'NH₃', c: 'N', n: 3, lp: 1, kind: 'pyramid', L: 1.012, ang: 106.7 },
    CH4: { name: 'Methane', tex: 'CH₄', c: 'C', n: 4, lp: 0, kind: 'tetra', L: 1.087, ang: 109.47 },
    H2S: { name: 'Hydrogen sulfide', tex: 'H₂S', c: 'S', n: 2, lp: 2, kind: 'bent', L: 1.336, ang: 92.1 },
    H2Se: { name: 'Hydrogen selenide', tex: 'H₂Se', c: 'Se', n: 2, lp: 2, kind: 'bent', L: 1.46, ang: 91 }
  };

  function buildMolecule(id, W) {
    const g = GEO[id], L = id === 'H2O' ? W.HBOND.OH * 1e10 : g.L, ang = id === 'H2O' ? W.HBOND.angle : g.ang;
    const atoms = [{ el: g.c, x: 0, y: 0, z: 0 }], bonds = [], lone = [];
    if (g.kind === 'bent') {
      const h = ang / 2 * D2R;
      atoms.push({ el: 'H', x: L * Math.sin(h), y: -L * Math.cos(h), z: 0 }, { el: 'H', x: -L * Math.sin(h), y: -L * Math.cos(h), z: 0 });
      lone.push({ atom: 0, dir: [0, 0.6, 0.8] }, { atom: 0, dir: [0, 0.6, -0.8] });
    } else if (g.kind === 'pyramid') {
      const ca = Math.sqrt((Math.cos(ang * D2R) + 0.5) / 1.5), sa = Math.sqrt(1 - ca * ca);
      for (let k = 0; k < 3; k++) { const b = (90 + 120 * k) * D2R; atoms.push({ el: 'H', x: L * sa * Math.cos(b), y: -L * ca, z: L * sa * Math.sin(b) }); }
      lone.push({ atom: 0, dir: [0, 1, 0] });
    } else {
      const s = L / Math.sqrt(3);
      for (const [a, b, c] of [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]]) atoms.push({ el: 'H', x: a * s, y: b * s, z: c * s });
    }
    for (let i = 1; i < atoms.length; i++) bonds.push([0, i, 1]);
    return { atoms, bonds, lone, L, ang };
  }

  Hyper.sim('om-molecules', {
    title: 'Turn the molecules',
    blurb: `A molecule in three dimensions: drag to turn it, or let it spin. The blue lobes are lone pairs, the arc is the H–X–H angle, and the orange arrow is the **dipole**: it points from the middle of the hydrogens towards the heavy atom, the negative end.

**Try this**
- Start with *water*: the angle is 104.45°, the two lone pairs sit behind the oxygen, and the dipole is 1.855 D along the line that bisects the angle.
- Switch to *ammonia* (one lone pair, 106.7°) and *methane* (none, 109.47°): the angle opens as lone pairs disappear. Methane has no arrow at all — turn on *bond dipoles* to see four small ones cancel.
- Go down the column: *hydrogen sulfide* and *selenide* are bent too, but at about 92° and 91°, and far less polar.
- Tick *space-filling* to see how little room the molecule takes up compared with the distances between atoms.`,
    mount(box, kit, params) {
      const W = kit.water, M = kit.mol;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const OPT = [['Water, H₂O', 'H2O'], ['Ammonia, NH₃', 'NH3'], ['Methane, CH₄', 'CH4'], ['Hydrogen sulfide, H₂S', 'H2S'], ['Hydrogen selenide, H₂Se', 'H2Se']];
      const start = GEO[params.mol] ? params.mol : 'H2O';
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: OPT, value: start },
        { id: 'space', type: 'check', label: 'Space-filling', value: params.style === 'space' },
        { id: 'dip', type: 'check', label: 'Net dipole arrow', value: params.dipole !== false },
        { id: 'bd', type: 'check', label: 'Bond dipoles', value: !!params.bonds },
        { id: 'chg', type: 'check', label: 'Partial charges δ+ and δ−', value: !!params.charges },
        { id: 'lone', type: 'check', label: 'Lone pairs', value: params.lone !== false },
        { id: 'ang', type: 'check', label: 'Bond angle', value: params.angle !== false },
        { id: 'spin', type: 'check', label: 'Spin', value: params.spin !== false }
      ], () => { loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['shape', 'Shape'], ['angle', 'H–X–H angle'], ['bond', 'X–H bond length'], ['lp', 'Lone pairs on the central atom'], ['dip', 'Dipole moment'], ['hb', 'Hydrogen bonds it can make'], ['bp', 'Boils at']]);
      const view = M.view({ rotX: -0.45, rotY: 0.7, scale: 100 });
      M.rotator(st, view, () => loop.once());
      let cache = {};
      const get = id => cache[id] || (cache[id] = buildMolecule(id, W));
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const id = GEO[V.mol] ? V.mol : 'H2O', g = GEO[id], mol = get(id);
        const info = W.MOLECULES.find(m => m.id === id) || { dipole: 0, bp: 0, donors: 0, acceptors: 0, shape: '' };
        if (V.spin && !view.dragging) view.rotY += Math.min(dt, 0.05) * 0.55;
        const cx = st.W / 2, cy = st.H * 0.5;
        view.scale = clamp(0.27 * Math.min(st.W, st.H * 1.25) / Math.max(1.1, mol.L), 40, 190);
        M.draw(c, mol, view, { cx, cy, style: V.space ? 'space' : 'ball', labels: true, lone: V.lone && !V.space, angle: V.ang && !V.space ? [1, 0, 2] : undefined });
        const ctr = M.centre(mol);
        const P = p => M.project([p[0] - ctr[0], p[1] - ctr[1], p[2] - ctr[2]], view, { cx, cy });
        const H = mol.atoms.slice(1);
        const cH = [0, 1, 2].map(k => H.reduce((s, a) => s + [a.x, a.y, a.z][k], 0) / H.length);
        const dir = [-cH[0], -cH[1], -cH[2]], dl = Math.hypot(dir[0], dir[1], dir[2]) || 1;
        // bond dipoles: a short arrow along each bond towards the central atom
        if (V.bd) for (const a of H) {
          const t0 = P([a.x * 0.82, a.y * 0.82, a.z * 0.82]), t1 = P([a.x * 0.3, a.y * 0.3, a.z * 0.3]);
          kit.arrow(c, t0.x, t0.y, t1.x, t1.y, C.muted, 2);
        }
        // the net dipole: from the centre of the hydrogens, towards the negative end
        if (V.dip && info.dipole > 0.05) {
          const len = 0.7 * info.dipole;
          const tail = P(cH), head = P([cH[0] + dir[0] / dl * len, cH[1] + dir[1] / dl * len, cH[2] + dir[2] / dl * len]);
          kit.arrow(c, tail.x, tail.y, head.x, head.y, C.warn, 4);
          kit.label(c, '+', tail.x - 9, tail.y + 2, { color: C.warn, size: 15, weight: 700, align: 'center', baseline: 'middle' });
          kit.label(c, 'μ = ' + info.dipole.toFixed(2) + ' D', head.x + 8, head.y - 4, { color: C.warn, size: 12.5, weight: 650 });
        } else if (V.dip) {
          kit.label(c, 'no net dipole: ' + (id === 'CH4' ? 'the four bond dipoles cancel' : 'nearly non-polar'), cx, st.H - 16, { color: C.muted, size: 12.5, align: 'center' });
        }
        if (V.chg) {
          const o = P([0, 0, 0]);
          kit.label(c, 'δ−', o.x + 14, o.y - 22, { color: C.accent, size: 14, weight: 700 });
          for (const a of H) { const p = P([a.x, a.y, a.z]); kit.label(c, 'δ+', p.x + 12, p.y - 14, { color: C.bad, size: 13, weight: 700 }); }
        }
        kit.label(c, g.name + ' · ' + g.tex, 14, 20, { color: C.text, size: 14, weight: 650 });
        kit.label(c, 'drag to turn', st.W - 12, st.H - 12, { color: C.faint, size: 11, align: 'right' });
        ro.set('shape', g.kind === 'bent' ? 'bent' : g.kind === 'pyramid' ? 'trigonal pyramid' : 'tetrahedron');
        ro.set('angle', mol.ang.toFixed(id === 'H2O' ? 2 : 1) + '°');
        ro.set('bond', (mol.L * 100).toFixed(id === 'H2O' ? 2 : 1) + ' pm');
        ro.set('lp', String(g.lp));
        ro.set('dip', info.dipole > 0 ? info.dipole.toFixed(2) + ' D = ' + sci(info.dipole * DEBYE, 2) + ' C·m' : '0');
        ro.set('hb', info.donors || info.acceptors ? 'gives ' + Math.min(info.donors, 2) + (info.donors > 2 ? '+' : '') + ' · receives ' + info.acceptors : 'none');
        ro.set('bp', info.bp.toFixed(1) + ' °C');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ dipoles in a field */
  Hyper.sim('om-dipole-field', {
    title: 'Dipoles in a field',
    blurb: `Water molecules between two plates. The field pulls the hydrogen ends towards the negative plate and the oxygen ends towards the positive one, while thermal jostling turns them at random. The graph below is the dielectric loss of liquid water: where it is large, the dipoles lag behind the field and the work done on them becomes heat. (A two-dimensional picture; the fields are exaggerated in the oscillating mode so that you can see the molecules move.)

**Try this**
- *Steady field*, 1 MV/m: a strong laboratory field, and the molecules hardly notice it — the thermal jostle is hundreds of times stronger. Raise it past 1,000 MV/m: now they line up. The field that a neighbouring molecule makes at 2.8 Å is several thousand MV/m, which is why water molecules in the liquid steer one another.
- *Oscillating field* at 2.45 GHz: the molecules follow, a little late. Move to 19 GHz — the peak of the loss — and the lag is 45°. At 200 GHz they cannot follow at all and sit jittering.
- Heat the water: the dipoles turn faster, the peak of the loss moves up in frequency, and a microwave oven at 2.45 GHz couples less well to hot water than to cold.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 230, maxH: 300 });
      box.stage.appendChild(graph);
      const MU = W.HBOND.dipole * DEBYE;            // C·m
      const EINF = 5.2;                              // high-frequency permittivity of liquid water (Debye model)
      // dielectric relaxation time of liquid water: about 8.3 ps at 25 °C and about twice that at 0 °C
      // (Kaatze's measurements); an Arrhenius fit through those two values, in ps — a model, not the engine
      const tauOf = T => 8.27 * Math.exp(2480 * (1 / (T + 273.15) - 1 / 298.15));
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The field', options: [['Steady field: alignment', 'dc'], ['Oscillating field: microwave heating', 'ac']], value: params.mode === 'ac' ? 'ac' : 'dc' },
        { id: 'E', label: 'Field strength', min: 1, max: 10000, value: 100, unit: 'MV/m', log: true, sig: 2 },
        { id: 'f', label: 'Frequency', min: 0.1, max: 1000, value: 2.45, unit: 'GHz', log: true, sig: 3 },
        { id: 'T', label: 'Temperature', min: 0, max: 90, step: 1, value: 25, unit: '°C' },
        { id: 'speed', label: 'Animation speed', min: 1, max: 40, step: 1, value: 8, unit: '×' }
      ], () => { modes(); });
      const V = ctl.values;
      const modes = () => { ctl.show('E', V.mode === 'dc'); ctl.show('f', V.mode === 'ac'); ctl.show('speed', V.mode === 'ac'); };
      modes();
      const ro = kit.readout(box.side, [['x', 'Field energy ÷ thermal energy (μE / kT)'], ['al', 'Average alignment, real molecules'], ['al2', 'Alignment in this picture'], ['wt', 'ω τ (field rate × relaxation time)'], ['eps', 'Dielectric loss ε″'], ['lag', 'Phase lag of the dipoles'], ['dp', 'Microwave penetration (1/e of power)']]);
      // 7 × 4 molecules on a grid, each with its own orientation
      const NX = 7, NY = 4, rot = [];
      let seed = 7;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const gauss = () => Math.sqrt(-2 * Math.log(rnd() + 1e-12)) * Math.cos(TAU * rnd());
      for (let i = 0; i < NX * NY; i++) rot.push({ a: rnd() * TAU });
      const plot = kit.plot(graph, { x: { label: 'field frequency (GHz)', log: true, min: 0.1, max: 1000 }, y: { label: 'relative', min: 0, max: 1.05 }, legend: true }, 190);
      let t = 0;
      const TAUS = 0.35;                              // relaxation time of the picture, in simulation seconds
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const dc = V.mode === 'dc', T = V.T;
        const tau = tauOf(T) * 1e-12, epsS = W.dielectric(T), dEps = epsS - EINF;
        const kT = KB * (T + 273.15);
        // the field in the picture: steady, or oscillating with omega·tau mapped onto the picture's own clock
        const fHz = V.f * 1e9, wt = TAU * fHz * tau;
        const speed = dc ? 1 : V.speed;
        const xDC = MU * V.E * 1e6 / kT, xAC = 3;
        const wS = wt / TAUS;                          // field angular frequency in simulation seconds
        const h = Math.min(dt, 0.05) * speed;
        const sub = Math.max(1, Math.ceil(h / Math.min(0.01, 0.12 / Math.max(wS, 1))));
        const hs = h / sub, Dr = 1 / TAUS;
        for (let s = 0; s < sub; s++) {
          t += hs;
          const e = dc ? xDC : xAC * Math.cos(wS * t);
          for (const r of rot) r.a += -Dr * e * Math.sin(r.a) * hs + Math.sqrt(2 * Dr * hs) * gauss();
        }
        const eNow = dc ? 1 : Math.cos(wS * t);
        // plates
        const px0 = 18, px1 = Wd - 18, py0 = 30, py1 = Hh - 20;
        const fast = !dc && wS * speed > 45;
        const platePos = fast ? C.faint : eNow >= 0 ? C.bad : C.accent, plateNeg = fast ? C.faint : eNow >= 0 ? C.accent : C.bad;
        c.fillStyle = platePos; c.fillRect(px0 - 6, py0, 8, py1 - py0);
        c.fillStyle = plateNeg; c.fillRect(px1 - 2, py0, 8, py1 - py0);
        kit.label(c, fast ? '±' : eNow >= 0 ? '+' : '−', px0 - 2, py0 - 12, { color: platePos, size: 16, weight: 700, align: 'center' });
        kit.label(c, fast ? '∓' : eNow >= 0 ? '−' : '+', px1 + 2, py0 - 12, { color: plateNeg, size: 16, weight: 700, align: 'center' });
        // field lines
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 5]);
        for (let k = 0; k < 4; k++) { const y = py0 + (k + 0.5) * (py1 - py0) / 4; c.beginPath(); c.moveTo(px0 + 6, y); c.lineTo(px1 - 4, y); c.stroke(); }
        c.setLineDash([]);
        // molecules (the bisector — pointing to the hydrogens — turns towards the negative plate)
        const gx = (px1 - px0 - 80) / (NX - 1), gy = (py1 - py0 - 30) / (NY - 1), sc = clamp(Math.min(gx, gy) * 0.34, 9, 22);
        let sx = 0, sy = 0;
        rot.forEach((r, i) => {
          const ix = i % NX, iy = Math.floor(i / NX);
          S.molecule(c, px0 + 40 + ix * gx, py0 + 15 + iy * gy, { angle: r.a, scale: sc });
          sx += Math.cos(r.a); sy += Math.sin(r.a);
        });
        sx /= rot.length; sy /= rot.length;
        // arrows: the field, and the mean dipole of the sample
        const ax = Wd / 2, ay = Hh - 8;
        if (!fast) kit.arrow(c, ax - 90, ay, ax - 90 + 70 * (dc ? 1 : eNow), ay, C.accent, 3);
        kit.label(c, 'field', ax - 94, ay - 6, { color: C.accent, size: 11.5, align: 'right', baseline: 'bottom' });
        kit.arrow(c, ax + 20, ay, ax + 20 + 70 * sx, ay + 0, C.warn, 3);
        kit.label(c, 'average of the dipoles (horizontal part)', ax + 96, ay - 6, { color: C.warn, size: 11.5, baseline: 'bottom' });
        // readouts
        const lang = x => (x < 1e-3 ? x / 3 : 1 / Math.tanh(x) - 1 / x);
        if (dc) {
          ro.set('x', xDC.toFixed(xDC < 0.1 ? 3 : 2));
          ro.set('al', (100 * lang(xDC)).toFixed(xDC < 0.03 ? 2 : 1) + ' %');
          ro.set('al2', (100 * sx).toFixed(0) + ' %');
          ro.set('wt', '—'); ro.set('eps', '—'); ro.set('lag', '—'); ro.set('dp', '—');
        } else {
          const den = 1 + wt * wt, epsI = dEps * wt / den, epsR = EINF + dEps / den;
          const lam0 = 299792458 / fHz, dp = lam0 * Math.sqrt(epsR) / (TAU * epsI);
          ro.set('x', '—'); ro.set('al', '—'); ro.set('al2', '—');
          ro.set('wt', wt.toFixed(wt < 1 ? 3 : 2));
          ro.set('eps', epsI.toFixed(2) + ' (of at most ' + (dEps / 2).toFixed(0) + ')');
          ro.set('lag', (Math.atan(wt) / D2R).toFixed(0) + '°');
          ro.set('dp', dp >= 1 ? dp.toFixed(1) + ' m' : dp >= 0.01 ? (dp * 100).toFixed(1) + ' cm' : (dp * 1000).toFixed(1) + ' mm');
        }
        // the dielectric loss of liquid water against frequency (single Debye relaxation)
        const loss = [], heat = [];
        for (let i = 0; i <= 80; i++) {
          const f = 0.1 * Math.pow(10000, i / 80), w = TAU * f * 1e9 * tau, d = 1 + w * w;
          loss.push([f, dEps * w / d / (dEps / 2)]);
          heat.push([f, w * w / d]);
        }
        plot.set({
          series: [{ pts: loss, label: 'dielectric loss ε″ (peak = 1)', color: C.accent }, { pts: heat, label: 'heat per unit field² (plateau = 1)', color: C.bad, dash: true }],
          x: { label: 'field frequency (GHz)', log: true, min: 0.1, max: 1000 }, y: { label: 'relative', min: 0, max: 1.05 },
          vlines: [{ x: 1 / (TAU * tau) / 1e9, label: 'loss peak ' + (1 / (TAU * tau) / 1e9).toFixed(0) + ' GHz', color: C.faint }, { x: 2.45, label: '', color: C.warn }].concat(dc ? [] : [{ x: V.f, label: V.f.toFixed(V.f < 10 ? 2 : 0) + ' GHz', color: C.text }])
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the hydride ladder */
  Hyper.sim('om-hydride-ladder', {
    title: 'The hydride ladder',
    blurb: `Boiling points of the simple hydrides of the elements in one column of the periodic table, plotted against the period of the central atom (or against molar mass). Heavier molecules are stickier, so the boiling point climbs as you go down the column. The dashed line is a straight line through the heavier members, carried up to the first one.

**Try this**
- *Group 16*: sulfur, selenium and tellurium make a clean ladder, H₂S −60 °C to H₂Te −2 °C. Carry it up to oxygen and it says about −65 to −90 °C, whichever way you draw the line. Water boils at +100 °C: about 170 K higher than the trend.
- *Group 14*: methane sits a little *below* its line (the straight line is crude), and no column-14 hydride has an anomaly. That is what an ordinary column looks like.
- *Groups 15 and 17* have anomalies too: ammonia and hydrogen fluoride. They are the other two molecules that can make hydrogen bonds — but neither makes as many as water.
- Switch the x-axis to *molar mass* and the extrapolation changes by tens of degrees. The anomaly is far bigger than the uncertainty.`,
    mount(box, kit, params) {
      const W = kit.water, ch = kit.chem;
      const holder = document.createElement('div');
      holder.style.padding = '6px 10px 10px';
      box.stage.appendChild(holder);
      // boiling points at 1 atm (CRC Handbook): the light members from the engine, the rest typed here
      const bp = (id, v) => { const m = W.MOLECULES.find(x => x.id === id); return m ? m.bp : v; };
      const GROUPS = [
        { id: '14', name: 'Group 14 · CH₄, SiH₄, GeH₄, SnH₄', rows: [['CH4', 2, bp('CH4')], ['SiH4', 3, -111.9], ['GeH4', 4, -88.5], ['SnH4', 5, -52]] },
        { id: '15', name: 'Group 15 · NH₃, PH₃, AsH₃, SbH₃', rows: [['NH3', 2, bp('NH3')], ['PH3', 3, -87.7], ['AsH3', 4, -62.5], ['SbH3', 5, -17]] },
        { id: '16', name: 'Group 16 · H₂O, H₂S, H₂Se, H₂Te', rows: [['H2O', 2, bp('H2O')], ['H2S', 3, bp('H2S')], ['H2Se', 4, bp('H2Se')], ['H2Te', 5, bp('H2Te')]] },
        { id: '17', name: 'Group 17 · HF, HCl, HBr, HI', rows: [['HF', 2, bp('HF')], ['HCl', 3, -85.0], ['HBr', 4, -66.8], ['HI', 5, -35.4]] }
      ];
      const OPT = GROUPS.map(g => [g.name, g.id]).concat([['All four columns', 'all']]);
      const ctl = kit.controls(box.side, [
        { id: 'grp', type: 'select', label: 'Column of the periodic table', options: OPT, value: params.group || '16' },
        { id: 'xax', type: 'select', label: 'Horizontal axis', options: [['Period of the central atom', 'period'], ['Molar mass', 'mass']], value: params.axis || 'period' },
        { id: 'meth', type: 'select', label: 'Trend line through', options: [['the three heavier hydrides (least squares)', 'ls3'], ['the two heaviest hydrides', 'two']], value: 'ls3' }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['act', 'First member: actual'], ['pred', 'First member: the trend predicts'], ['exc', 'Excess over the trend'], ['txt', 'Figure usually quoted for water']]);
      const plot = kit.plot(holder, { x: { label: 'period' }, y: { label: 'boiling point at 1 atm (°C)', min: -190, max: 120 }, legend: true }, 340);
      const mass = f => ch.molarMass(f);
      function line(g, xs) {
        const pts = g.rows.map(r => [xs(r), r[2]]).slice(1);
        const use = V.meth === 'two' ? pts.slice(1) : pts;
        const n = use.length, mx = use.reduce((s, p) => s + p[0], 0) / n, my = use.reduce((s, p) => s + p[1], 0) / n;
        let sxx = 0, sxy = 0;
        for (const p of use) { sxx += (p[0] - mx) * (p[0] - mx); sxy += (p[0] - mx) * (p[1] - my); }
        const k = sxx > 0 ? sxy / sxx : 0;
        return x => my + k * (x - mx);
      }
      function update() {
        const C = kit.colors();
        const xs = V.xax === 'mass' ? (r => mass(r[0])) : (r => r[1]);
        const sel = V.grp === 'all' ? GROUPS : GROUPS.filter(g => g.id === V.grp);
        const series = [], marks = [];
        GROUPS.forEach((g, gi) => {
          const on = sel.includes(g), col = C.series[gi % C.series.length];
          if (!on) return;
          series.push({ pts: g.rows.map(r => [xs(r), r[2]]), label: g.name.split(' · ')[0], color: col, dots: 4 });
          const f = line(g, xs), x0 = xs(g.rows[0]), x1 = xs(g.rows[3]);
          series.push({ pts: [[x0, f(x0)], [x1, f(x1)]], color: col, dash: true, width: 1.5 });
          if (sel.length === 1) marks.push({ x: x0, y: f(x0), color: C.muted, label: 'trend ' + Math.round(f(x0)) + ' °C' }, { x: x0, y: g.rows[0][2], color: C.bad, label: 'actual ' + Math.round(g.rows[0][2]) + ' °C' });
        });
        const g0 = sel.length === 1 ? sel[0] : GROUPS[2], f0 = line(g0, xs), x00 = xs(g0.rows[0]);
        ro.set('act', g0.rows[0][2].toFixed(1) + ' °C');
        ro.set('pred', f0(x00).toFixed(0) + ' °C');
        const ex = g0.rows[0][2] - f0(x00);
        ro.set('exc', (ex >= 0 ? '+' : '−') + Math.abs(ex).toFixed(0) + ' K');
        ro.set('txt', g0.id === '16' ? W.ladderExpected + ' °C' : '—');
        plot.set({
          series, marks,
          x: V.xax === 'mass' ? { label: 'molar mass (g/mol)', min: 0, max: 140 } : { label: 'period of the central atom', min: 1.6, max: 5.4 },
          y: { label: 'boiling point at 1 atm (°C)', min: -190, max: 120 },
          hlines: [{ y: 0, label: '0 °C', color: C.faint }]
        });
      }
      update();
    }
  });

  /* ================================================================ vibrations */
  Hyper.sim('om-vibration-modes', {
    title: 'How a water molecule vibrates',
    blurb: `The three ways a water molecule can vibrate, animated (the real motion is about 10¹⁴ times faster than you see it, and the amplitude is exaggerated). Below, the infrared spectrum of water: where each vibration absorbs light, as a gas and as a liquid or ice.

**Try this**
- *Symmetric stretch*: both O–H bonds lengthen together. *Asymmetric stretch*: one lengthens while the other shortens. *Bend*: the angle opens and closes. Which is the lowest in energy?
- Switch the medium from *gas* to *liquid*: the sharp lines of the stretches merge into one broad band at lower wavenumber, and the bend moves up a little. Hydrogen bonds do both.
- Switch to *ice*: the stretch drops further, to 3,200 cm⁻¹ — the more strongly an O–H is hydrogen-bonded, the lower its frequency.
- The read-outs give the wavelength, frequency and period of the vibration, and how many times it goes round in the 1.2 ps a hydrogen bond lasts.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 360, maxH: 470 });
      const MODES = { 1: 'Symmetric stretch ν₁', 2: 'Bend ν₂', 3: 'Asymmetric stretch ν₃' };
      // band positions in cm⁻¹: the gas-phase lines (Herzberg) and the centres of the bands of the liquid and of ice Ih
      const NU = { gas: { 1: 3657, 2: 1595, 3: 3756 }, liq: { 1: 3400, 2: 1645, 3: 3400 }, ice: { 1: 3220, 2: 1650, 3: 3220 } };
      // schematic band shapes of the liquid and of ice: [centre, width σ, relative height, name]
      const BANDS = {
        liq: [[3400, 170, 1, 'O–H stretch'], [1645, 45, 0.45, 'bend'], [650, 190, 0.8, 'libration'], [190, 50, 0.4, 'H-bond stretch']],
        ice: [[3220, 130, 1, 'O–H stretch'], [1650, 60, 0.3, 'bend'], [830, 130, 0.85, 'libration'], [230, 40, 0.45, 'lattice']]
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Vibration', options: [[MODES[1], '1'], [MODES[2], '2'], [MODES[3], '3']], value: String(params.mode || 1) },
        { id: 'med', type: 'select', label: 'Water as', options: [['a gas (vapour)', 'gas'], ['a liquid (25 °C)', 'liq'], ['ice Ih', 'ice']], value: params.medium || 'gas' },
        { id: 'amp', label: 'Exaggeration', min: 0.5, max: 3, step: 0.1, value: 1.6 },
        { id: 'fs', label: 'Slow-motion speed', min: 0.2, max: 2.5, step: 0.1, value: 0.7, unit: 'Hz' },
        { id: 'arrows', type: 'check', label: 'Show the motion with arrows', value: true }
      ], () => { loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nu', 'Wavenumber'], ['lam', 'Wavelength'], ['f', 'Frequency'], ['per', 'Period'], ['E', 'Energy of one quantum'], ['hb', 'Vibrations in one hydrogen-bond lifetime']]);
      const qm = 1.008 / 15.999;           // mass ratio H : O — the oxygen recoils against the hydrogens
      const L0 = W.HBOND.OH * 1e10, h0 = W.HBOND.angle / 2 * D2R;
      function pose(mode, c, A) {
        let d1 = 0, d2 = 0, dth = 0;
        if (mode === '1') { d1 = A * c; d2 = A * c; } else if (mode === '3') { d1 = A * c; d2 = -A * c; } else dth = 1.6 * (A / L0) * c;
        const h = h0 + dth / 2;
        const l1 = L0 + d1, l2 = L0 + d2;
        let H1 = [l1 * Math.sin(h), -l1 * Math.cos(h)], H2 = [-l2 * Math.sin(h), -l2 * Math.cos(h)];
        const e1 = [L0 * Math.sin(h0), -L0 * Math.cos(h0)], e2 = [-L0 * Math.sin(h0), -L0 * Math.cos(h0)];
        const O = [-qm * ((H1[0] - e1[0]) + (H2[0] - e2[0])), -qm * ((H1[1] - e1[1]) + (H2[1] - e2[1]))];
        return { O, H1, H2 };
      }
      let phase = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        phase += Math.min(dt, 0.05) * V.fs * TAU;
        const mc = S.molColor();
        const sc = clamp(Math.min(Hh * 0.2, Wd * 0.12), 40, 95), cx = Wd * 0.5, cy = Hh * 0.2;
        const A = 0.075 * V.amp;
        const P = pose(V.mode, Math.cos(phase), A), P2 = pose(V.mode, Math.cos(phase + 0.05), A);
        const pt = p => [cx + p[0] * sc * 1.15, cy - p[1] * sc * 1.15];
        const pO = pt([P.O[0], P.O[1]]), pH1 = pt([P.O[0] + P.H1[0], P.O[1] + P.H1[1]]), pH2 = pt([P.O[0] + P.H2[0], P.O[1] + P.H2[1]]);
        c.strokeStyle = mc.bond; c.lineWidth = Math.max(3, 0.1 * sc); c.lineCap = 'round';
        c.beginPath(); c.moveTo(pO[0], pO[1]); c.lineTo(pH1[0], pH1[1]); c.moveTo(pO[0], pO[1]); c.lineTo(pH2[0], pH2[1]); c.stroke();
        for (const p of [pH1, pH2]) { c.fillStyle = mc.H; c.beginPath(); c.arc(p[0], p[1], 0.2 * sc, 0, TAU); c.fill(); c.strokeStyle = mc.Hstroke; c.lineWidth = 1; c.stroke(); }
        c.fillStyle = mc.O; c.beginPath(); c.arc(pO[0], pO[1], 0.32 * sc, 0, TAU); c.fill();
        if (V.arrows) {
          const qs = [[pH1, pt([P2.O[0] + P2.H1[0], P2.O[1] + P2.H1[1]])], [pH2, pt([P2.O[0] + P2.H2[0], P2.O[1] + P2.H2[1]])], [pO, pt([P2.O[0], P2.O[1]])]];
          qs.forEach(([a, b], i) => {
            const dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy);
            if (m < 1e-4) return;
            const len = i === 2 ? Math.min(30, m * 900) : 30;
            kit.arrow(c, a[0], a[1], a[0] + dx / m * len, a[1] + dy / m * len, C.warn, 2.5);
          });
        }
        kit.label(c, MODES[V.mode], 14, 20, { color: C.text, size: 13.5, weight: 650 });
        /* ---- the spectrum */
        const nu = NU[V.med][V.mode];
        const x0 = 46, x1 = Wd - 20, yb = Hh - 40, yt = Hh * 0.5, hh = yb - yt - 10;
        const X = n => x0 + (4000 - n) / 4000 * (x1 - x0);
        kit.label(c, V.med === 'gas' ? 'infrared absorption, gas (schematic: each line is really a comb of rotational lines)' : 'infrared absorption, ' + (V.med === 'liq' ? 'liquid' : 'ice') + ' (schematic band shapes)', x0, yt - 18, { color: C.muted, size: 11.5 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        for (let n = 0; n <= 4000; n += 1000) {
          c.beginPath(); c.moveTo(X(n), yb); c.lineTo(X(n), yb + 4); c.stroke();
          kit.label(c, String(n), X(n), yb + 7, { color: C.muted, size: 11, align: 'center', baseline: 'top' });
        }
        kit.label(c, 'wavenumber (cm⁻¹)', (x0 + x1) / 2, yb + 22, { color: C.muted, size: 11.5, align: 'center', baseline: 'top' });
        if (V.med === 'gas') {
          for (const [n, hgt, nm] of [[3756, 0.95, 'ν₃'], [3657, 0.9, 'ν₁'], [1595, 0.7, 'ν₂']]) {
            const sel = NU.gas[V.mode] === n;
            c.strokeStyle = sel ? C.warn : C.accent; c.lineWidth = sel ? 4 : 3;
            c.beginPath(); c.moveTo(X(n), yb); c.lineTo(X(n), yb - hgt * hh); c.stroke();
            kit.label(c, nm + ' ' + n, X(n) + (n === 3756 ? -6 : 6), yb - hgt * hh - 4, { color: sel ? C.warn : C.text, size: 11.5, weight: sel ? 700 : 500, align: n === 3756 ? 'right' : 'left', baseline: 'bottom' });
          }
        } else {
          const comps = BANDS[V.med];
          c.beginPath(); c.moveTo(X(4000), yb);
          for (let n = 4000; n >= 0; n -= 10) {
            let v = 0; for (const [m, s, h] of comps) v += h * Math.exp(-0.5 * ((n - m) / s) * ((n - m) / s));
            c.lineTo(X(n), yb - Math.min(1, v) * hh);
          }
          c.lineTo(X(0), yb); c.closePath();
          c.fillStyle = 'rgba(70,150,235,0.28)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.stroke();
          for (const [m, s, h, nm] of comps) kit.label(c, nm, X(m), yb - Math.min(1, h) * hh - 4, { color: C.muted, size: 11, align: 'center', baseline: 'bottom' });
        }
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(X(nu), yb); c.lineTo(X(nu), yt - 4); c.stroke(); c.setLineDash([]);
        const f = nu * 29979245800;           // Hz, from c in cm/s
        ro.set('nu', nu + ' cm⁻¹' + (V.med === 'gas' ? '' : ' (band centre)'));
        ro.set('lam', (1e4 / nu).toFixed(2) + ' µm');
        ro.set('f', (f / 1e12).toFixed(1) + ' THz');
        ro.set('per', (1e15 / f).toFixed(1) + ' fs');
        ro.set('E', (nu * 1.239842e-4).toFixed(3) + ' eV = ' + (nu * 0.0119627).toFixed(1) + ' kJ/mol');
        ro.set('hb', V.med === 'liq' ? '≈ ' + Math.round(f * W.HBOND.reorganisation) + ' (1.2 ps)' : '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the colour of water */
  /* an approximate map from wavelength (nm) to a linear RGB triple (after Bruton): schematic, good enough for hue */
  function waveRGB(l) {
    let r = 0, g = 0, b = 0;
    if (l < 440) { r = -(l - 440) / 60; b = 1; } else if (l < 490) { g = (l - 440) / 50; b = 1; } else if (l < 510) { g = 1; b = -(l - 510) / 20; }
    else if (l < 580) { r = (l - 510) / 70; g = 1; } else if (l < 645) { r = 1; g = -(l - 645) / 65; } else { r = 1; }
    const f = l < 420 ? 0.3 + 0.7 * (l - 380) / 40 : l > 700 ? 0.3 + 0.7 * (750 - l) / 50 : 1;
    return [Math.max(0, r * f), Math.max(0, g * f), Math.max(0, b * f)];
  }
  /* absorption coefficient of pure water, 1/m, rounded from published measurements of pure water (Pope and Fry 1997 and
     earlier work); in the red the values are uncertain by tens of per cent, and the bands near 606 and 760 nm are the
     fifth and fourth overtones of the O–H stretch */
  const AW = [[380, 0.012], [400, 0.006], [420, 0.0045], [450, 0.0092], [475, 0.0114], [500, 0.0204], [525, 0.0417], [550, 0.0565], [575, 0.0772], [600, 0.222], [625, 0.283], [650, 0.34], [675, 0.448], [700, 0.624], [725, 1.5], [750, 2.7]];
  function absorb(l) {
    if (l <= AW[0][0]) return AW[0][1];
    for (let i = 1; i < AW.length; i++) if (l <= AW[i][0]) {
      const t = (l - AW[i - 1][0]) / (AW[i][0] - AW[i - 1][0]);
      return Math.exp(Math.log(AW[i - 1][1]) * (1 - t) + Math.log(AW[i][1]) * t);
    }
    return AW[AW.length - 1][1];
  }
  const LAMS = []; for (let l = 380; l <= 750; l += 5) LAMS.push(l);
  const LRGB = LAMS.map(waveRGB);
  const WHITE = [0, 1, 2].map(k => LRGB.reduce((s, c) => s + c[k], 0));
  const LUMW = LAMS.map(l => Math.exp(-0.5 * ((l - 555) / 45) * ((l - 555) / 45)));
  const LUMSUM = LUMW.reduce((s, v) => s + v, 0);
  function throughWater(L) {
    const f = [0, 0, 0]; let lum = 0;
    LAMS.forEach((l, i) => {
      const T = Math.exp(-absorb(l) * L);
      for (let k = 0; k < 3; k++) f[k] += LRGB[i][k] * T;
      lum += LUMW[i] * T;
    });
    return { f: f.map((v, k) => v / WHITE[k]), lum: lum / LUMSUM };
  }
  const css = (f, bright, gain) => {
    const m = bright ? gain : 1;
    return 'rgb(' + f.map(v => Math.round(255 * Math.pow(clamp(v * m, 0, 1), 0.65))).join(',') + ')';
  };

  Hyper.sim('om-colour-of-water', {
    title: 'Why water is blue',
    blurb: `White light goes in at the left of a tube of pure water and comes out at the right. Water absorbs red light a hundred times more strongly than blue, because the overtones of the O–H stretching vibration reach into the red. A metre or two is clear; ten metres is distinctly blue; a hundred metres is a deep blue-green that has lost nearly all its red. (The spectrum is a rounded version of measured pure-water absorption; the colours are schematic.)

**Try this**
- Press the buttons for a glass, a pool, the sea at 30 m and the deep: watch the colour of the end of the tube and the bars of the transmitted spectrum.
- Slide the probe wavelength from 700 nm down to 450 nm: the 1/e depth — the distance in which the light falls to 37 % — goes from under a metre to a hundred metres.
- Untick *brighten*: the true colour, which is dark blue because most of the light has been absorbed by then.
- In the graph, the absorption rises steeply towards the red, with shoulders near 606 and 760 nm: the fifth and fourth overtones of the O–H stretch (about 3,400 cm⁻¹ each time multiplied up).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 400 });
      const holder = document.createElement('div');
      holder.style.padding = '6px 10px 10px';
      box.stage.appendChild(holder);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Path through the water', min: 0.01, max: 300, value: params.L || 5, unit: 'm', log: true, sig: 2 },
        { id: 'lam', label: 'Probe wavelength', min: 400, max: 750, step: 5, value: 650, unit: 'nm' },
        { id: 'bright', type: 'check', label: 'Brighten the colour to show its hue', value: true },
        { type: 'buttons', items: [{ id: 'p1', label: 'A glass (0.1 m)' }, { id: 'p2', label: 'A pool (2 m)' }, { id: 'p3', label: 'The sea (30 m)', primary: true }, { id: 'p4', label: 'The deep (200 m)' }] }
      ], (id) => {
        if (id === 'p1') ctl.set('L', 0.1); if (id === 'p2') ctl.set('L', 2); if (id === 'p3') ctl.set('L', 30); if (id === 'p4') ctl.set('L', 200);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Light left at the probe wavelength'], ['e', 'Depth for 37 % left (1/e) at the probe'], ['lum', 'Visible light left, all colours'], ['red', 'Red (650 nm) left'], ['blue', 'Blue (450 nm) left']]);
      const plot = kit.plot(holder, { x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'absorption (1/m)', log: true, min: 0.003, max: 5 }, legend: true }, 190);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const L = V.L, res = throughWater(L), gain = 0.92 / Math.max(res.f[0], res.f[1], res.f[2], 1e-9);
        // the tube
        const tx0 = 70, tx1 = Wd - 40, ty0 = 34, ty1 = Hh * 0.3;
        const grd = c.createLinearGradient(tx0, 0, tx1, 0);
        for (let i = 0; i <= 20; i++) { const r = throughWater(L * i / 20); grd.addColorStop(i / 20, css(r.f, V.bright, V.bright ? 0.92 / Math.max(r.f[0], r.f[1], r.f[2], 1e-9) : 1)); }
        c.fillStyle = grd; c.fillRect(tx0, ty0, tx1 - tx0, ty1 - ty0);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx0, ty0, tx1 - tx0, ty1 - ty0);
        kit.arrow(c, 14, (ty0 + ty1) / 2, tx0 - 4, (ty0 + ty1) / 2, C.warn, 3);
        kit.label(c, 'white light', 14, ty0 - 8, { color: C.muted, size: 11.5 });
        kit.label(c, '0 m', tx0, ty1 + 6, { color: C.muted, size: 11, baseline: 'top' });
        kit.label(c, (L < 1 ? L.toFixed(2) : L < 10 ? L.toFixed(1) : Math.round(L)) + ' m', tx1, ty1 + 6, { color: C.muted, size: 11, align: 'right', baseline: 'top' });
        // what comes out
        c.fillStyle = css(res.f, V.bright, gain); c.fillRect(tx1 + 6, ty0, 26, ty1 - ty0);
        c.strokeStyle = C.text; c.strokeRect(tx1 + 6, ty0, 26, ty1 - ty0);
        // the transmitted spectrum
        const sx0 = 70, sx1 = Wd - 40, sb = Hh - 30, st0 = Hh * 0.42, sh = sb - st0;
        const SX = l => sx0 + (l - 380) / 370 * (sx1 - sx0);
        kit.label(c, 'what is left of each colour after ' + (L < 10 ? L.toFixed(L < 1 ? 2 : 1) : Math.round(L)) + ' m (bar height = fraction transmitted)', sx0, st0 - 14, { color: C.muted, size: 11.5 });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(sx0, st0, sx1 - sx0, sh);
        const bw = (sx1 - sx0) / LAMS.length;
        LAMS.forEach((l, i) => {
          const T = Math.exp(-absorb(l) * L), r = LRGB[i];
          c.fillStyle = 'rgb(' + r.map(v => Math.round(255 * Math.pow(v, 0.7))).join(',') + ')';
          c.fillRect(SX(l) - bw / 2, sb - T * sh, bw + 0.5, T * sh);
        });
        for (const l of [400, 500, 600, 700]) { kit.label(c, String(l), SX(l), sb + 4, { color: C.muted, size: 11, align: 'center', baseline: 'top' }); }
        kit.label(c, 'nm', sx1, sb + 4, { color: C.muted, size: 11, align: 'right', baseline: 'top' });
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(SX(V.lam), st0 - 4); c.lineTo(SX(V.lam), sb); c.stroke(); c.setLineDash([]);
        const a = absorb(V.lam);
        ro.set('T', (100 * Math.exp(-a * L)).toFixed(Math.exp(-a * L) < 0.01 ? 3 : 1) + ' %');
        ro.set('e', (1 / a >= 10 ? Math.round(1 / a) : (1 / a).toFixed(2)) + ' m');
        ro.set('lum', (100 * res.lum).toFixed(res.lum < 0.01 ? 2 : 1) + ' %');
        ro.set('red', (100 * Math.exp(-absorb(650) * L)).toFixed(Math.exp(-absorb(650) * L) < 0.01 ? 3 : 1) + ' %');
        ro.set('blue', (100 * Math.exp(-absorb(450) * L)).toFixed(1) + ' %');
        plot.set({
          series: [{ pts: AW, label: 'pure water', color: C.accent, dots: 3 }],
          x: { label: 'wavelength (nm)', min: 380, max: 780 }, y: { label: 'absorption coefficient (1/m)', log: true, min: 0.003, max: 5 },
          marks: [{ x: V.lam, y: a, color: C.warn, label: (1 / a >= 10 ? Math.round(1 / a) : (1 / a).toFixed(1)) + ' m' }],
          vlines: [{ x: 606, label: '5ν ≈ 606', color: C.faint }, { x: 760, label: '4ν ≈ 760', color: C.faint }]
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heavy water */
  Hyper.sim('om-heavy-water', {
    title: 'Heavy water and light water',
    blurb: `Four glasses and a graph. A cube of ordinary ice floats in ordinary water, as it should. A cube of **heavy ice** (frozen D₂O) *sinks* in ordinary water. In heavy water itself, either kind of ice floats — ordinary ice a little higher out of the liquid than usual. The graph is the density of both liquids against temperature: same shape, but heavy water is 11 % denser and its maximum is at 11.2 °C instead of 3.98 °C.

**Try this**
- Move the bath temperature: the densities of the liquids change a little, but the sinking and floating do not.
- Read the density of D₂O against that of H₂O: the ratio stays near 1.107, close to the ratio of the molar masses (20.03 to 18.02 = 1.112). Heavy water is denser because each molecule is heavier — and takes almost exactly the same room.
- On the graph, the curve of D₂O is the curve of H₂O pushed 7 K to the right: deuterium makes the hydrogen bonds slightly stronger, so D₂O at 11 °C behaves like H₂O at 4 °C.
- D₂O freezes at 3.82 °C: below that the curve is supercooled.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 330 });
      const holder = document.createElement('div');
      holder.style.padding = '6px 10px 10px';
      box.stage.appendChild(holder);
      const HEAVY_ICE = 1017;                // kg/m³, ice made of D₂O at 0 °C (the figure used on the ice pages)
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature of the liquids', min: 4, max: 40, step: 0.5, value: params.T || 5, unit: '°C' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r1', 'Ordinary water'], ['r2', 'Heavy water'], ['ratio', 'Ratio D₂O ÷ H₂O'], ['mr', 'Ratio of molar masses'], ['fixed', 'Melts · boils (D₂O, H₂O)']]);
      const plot = kit.plot(holder, { x: { label: 'temperature (°C)', min: -10, max: 110 }, y: { label: 'density (kg/m³)', min: 940, max: 1120 }, legend: true }, 190);
      const h2 = [], d2 = [];
      for (let T = -10; T <= 110; T += 2) { h2.push([T, W.density(T)]); d2.push([T, W.densityD2O(T)]); }
      let phase = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        phase += dt;
        const T = V.T, rH = W.density(T), rD = W.densityD2O(T);
        const cases = [
          ['H₂O ice in H₂O', rH, W.densityIce(0), false, false], ['D₂O ice in H₂O', rH, HEAVY_ICE, false, true],
          ['H₂O ice in D₂O', rD, W.densityIce(0), true, false], ['D₂O ice in D₂O', rD, HEAVY_ICE, true, true]
        ];
        const gap = 14, bw = (Wd - 30 - 3 * gap) / 4, by = 30, bh = Hh - 66;
        cases.forEach(([label, rl, ri, heavyLiq, heavyIce], k) => {
          const x = 15 + k * (bw + gap), fill = 0.74;
          S.beaker(c, x, by, bw, bh, fill, { liquid: heavyLiq ? 'rgba(235,160,70,0.40)' : 'rgba(70,150,235,0.45)', label: heavyLiq ? 'D₂O' : 'H₂O' });
          const f = ri / rl, sinks = f >= 1, side = Math.min(bw * 0.4, bh * 0.28);
          const surf = by + bh - fill * bh;
          const top = sinks ? by + bh - 3 - side : surf - side * (1 - f);
          const y0 = top + (sinks ? 0 : 1.2 * Math.sin(phase * 1.2 + k));
          const x0 = x + bw / 2 - side / 2;
          c.save();
          c.fillStyle = heavyIce ? 'rgba(255,225,190,0.92)' : 'rgba(215,238,255,0.92)'; c.strokeStyle = C.text; c.lineWidth = 1.4;
          c.fillRect(x0, y0, side, side); c.strokeRect(x0, y0, side, side);
          c.restore();
          kit.label(c, label, x + bw / 2, by - 12, { color: C.text, size: 11.5, weight: 650, align: 'center' });
          kit.label(c, sinks ? 'sinks' : Math.round(100 * f) + ' % below', x + bw / 2, by + bh + 8, { color: sinks ? C.bad : C.muted, size: 11.5, align: 'center', baseline: 'top', weight: sinks ? 700 : 500 });
        });
        ro.set('r1', rH.toFixed(1) + ' kg/m³');
        ro.set('r2', rD.toFixed(1) + ' kg/m³');
        ro.set('ratio', (rD / rH).toFixed(4));
        ro.set('mr', (W.D2O.M / W.M).toFixed(4));
        ro.set('fixed', W.D2O.mp + ' · ' + W.D2O.bp + ' °C   vs   0 · 100 °C');
        plot.set({
          series: [{ pts: h2, label: 'H₂O', color: C.accent }, { pts: d2, label: 'D₂O', color: C.warn }],
          x: { label: 'temperature (°C)', min: -10, max: 110 }, y: { label: 'density (kg/m³)', min: 940, max: 1120 },
          marks: [{ x: W.TMAX, y: W.density(W.TMAX), color: C.accent, label: 'H₂O maximum, ' + W.TMAX + ' °C' }, { x: W.D2O.Tmax, y: W.D2O.rhoMax, color: C.warn, label: 'D₂O maximum, ' + W.D2O.Tmax + ' °C' }],
          vlines: [{ x: W.D2O.mp, label: 'D₂O freezes 3.82 °C', color: C.faint }, { x: T, label: 'now', color: C.text }]
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ water in numbers */
  Hyper.sim('om-numbers', {
    title: 'How many molecules?',
    blurb: `Choose a number of water molecules, from one to everything in the oceans. The ruler shows the edge of a cube of liquid water holding that many, among familiar sizes; below it the cube itself, drawn as molecules where the number is small.

**Try this**
- Press *A drop*: 1.7 × 10²¹ molecules, a cube 3.7 mm on a side, and **12 million molecules** along each edge.
- Press *A glass*, then *All the oceans*: the edge of the cube is a hundred times the height of Everest.
- Look at the counting time: at a billion molecules a second, one drop would take 53,000 years to count.
- Go the other way, to a thousand molecules: the cube is only ten molecules across, and nearly half of its molecules are on the surface.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 440 });
      const rho = W.density(25), per = W.M * 1e-3 / (rho * W.NA);          // m³ per molecule at 25 °C
      const NDROP = W.molecules(5e-8 * rho), NGLASS = W.molecules(2.5e-4 * rho), NBATH = W.molecules(0.15 * rho), NOCEAN = W.molecules(W.EARTH.oceanMass);
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of molecules', min: 1, max: 1e47, value: params.N || NDROP, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'q1', label: 'One' }, { id: 'q2', label: 'A drop (0.05 mL)', primary: true }, { id: 'q3', label: 'A glass' }, { id: 'q4', label: 'A bath' }, { id: 'q5', label: 'All the oceans' }] }
      ], (id) => {
        if (id === 'q1') ctl.set('N', 1); if (id === 'q2') ctl.set('N', NDROP); if (id === 'q3') ctl.set('N', NGLASS); if (id === 'q4') ctl.set('N', NBATH); if (id === 'q5') ctl.set('N', NOCEAN);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['N', 'Molecules'], ['m', 'Mass'], ['v', 'Volume'], ['edge', 'Edge of the cube'], ['across', 'Molecules along one edge'], ['glass', 'In glasses of water (250 mL)'], ['count', 'Time to count them at 10⁹ a second']]);
      const MARKS = [[2.75e-10, 'a water molecule'], [5e-9, 'a protein'], [1e-7, 'a virus'], [2e-6, 'a bacterium'], [7e-5, 'a hair'], [5e-4, 'a grain of sand'], [1e-2, 'a fingertip'], [0.2, 'a hand'], [1.7, 'a person'], [100, 'a football pitch'], [8849, 'Everest'], [1e6, '1,000 km']];
      const fmtLen = m => m < 1e-6 ? (m * 1e9 < 10 ? (m * 1e9).toFixed(2) : Math.round(m * 1e9)) + ' nm' : m < 1e-3 ? (m * 1e6).toFixed(m * 1e6 < 10 ? 2 : 0) + ' µm' : m < 1 ? (m * 1e3).toFixed(m * 1e3 < 10 ? 2 : 0) + ' mm' : m < 1000 ? m.toFixed(m < 10 ? 2 : 1) + ' m' : (m / 1000).toFixed(m < 1e4 ? 1 : 0) + ' km';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const N = Math.max(1, V.N), vol = N * per, edge = Math.cbrt(vol), across = Math.cbrt(N), mass = N * W.M * 1e-3 / W.NA;
        // the ruler: log10 of the length from 0.1 nm to 10,000 km
        const rx0 = 24, rx1 = Wd - 24, ry = Hh * 0.2, lo = -10, hi = 7.2;
        const X = m => rx0 + (Math.log10(m) - lo) / (hi - lo) * (rx1 - rx0);
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(rx0, ry); c.lineTo(rx1, ry); c.stroke();
        MARKS.forEach(([m, name], i) => {
          const up = i % 2 === 0;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(m), ry - 5); c.lineTo(X(m), ry + 5); c.stroke();
          kit.label(c, name, X(m), up ? ry - 10 : ry + 11, { color: C.muted, size: 10.5, align: i === 0 ? 'left' : i === MARKS.length - 1 ? 'right' : 'center', baseline: up ? 'bottom' : 'top' });
        });
        const px = clamp(X(edge), rx0, rx1);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(px, ry); c.lineTo(px - 7, ry - 14); c.lineTo(px + 7, ry - 14); c.closePath(); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(px, ry - 14); c.lineTo(px, ry - 38); c.stroke();
        kit.label(c, 'edge of your cube: ' + fmtLen(edge), clamp(px, 100, Wd - 100), ry - 42, { color: C.accent, size: 12.5, weight: 700, align: 'center', baseline: 'bottom' });
        // the cube itself
        const ay0 = Hh * 0.38, ah = Hh - ay0 - 12, acx = Wd / 2;
        if (N < 2) {
          S.molecule(c, acx, ay0 + ah * 0.5, { angle: -Math.PI / 2, scale: Math.min(ah / 3, 80), charges: true });
          kit.label(c, 'one molecule: 0.275 nm across, 3 × 10⁻²⁶ kg', acx, Hh - 14, { color: C.muted, size: 12, align: 'center' });
        } else if (N <= 4000) {
          const n = Math.ceil(Math.cbrt(N)), step = Math.min(ah / (n * 1.5 + 1), (Wd * 0.45) / (n * 1.5 + 1)), r = step * 0.38, off = step * 0.5;
          let k = 0;
          for (let z = 0; z < n && k < N; z++) for (let y = 0; y < n && k < N; y++) for (let x = 0; x < n && k < N; x++, k++) {
            const px2 = acx - n * step * 0.75 + x * step + z * off, py2 = ay0 + ah - 14 - y * step - z * off;
            c.fillStyle = 'rgba(70,150,235,0.78)'; c.beginPath(); c.arc(px2, py2, r, 0, TAU); c.fill();
          }
          kit.label(c, Math.round(N) + ' molecules, about ' + n + ' along each edge of the cube', acx, Hh - 8, { color: C.muted, size: 12, align: 'center', baseline: 'bottom' });
        } else {
          const s = Math.min(ah * 0.62, Wd * 0.3), ox = acx - s * 0.6, oy = ay0 + ah - 12, dd = s * 0.4;
          c.lineWidth = 1.5; c.strokeStyle = C.text; c.fillStyle = 'rgba(70,150,235,0.22)';
          c.fillRect(ox, oy - s, s, s); c.strokeRect(ox, oy - s, s, s);
          c.beginPath(); c.moveTo(ox, oy - s); c.lineTo(ox + dd, oy - s - dd * 0.8); c.lineTo(ox + s + dd, oy - s - dd * 0.8); c.lineTo(ox + s, oy - s); c.closePath(); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(ox + s, oy); c.lineTo(ox + s + dd, oy - dd * 0.8); c.lineTo(ox + s + dd, oy - s - dd * 0.8); c.lineTo(ox + s, oy - s); c.closePath(); c.fill(); c.stroke();
          c.fillStyle = 'rgba(70,150,235,0.85)';
          for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) { c.beginPath(); c.arc(ox + s * (0.14 + 0.144 * i), oy - s * (0.14 + 0.144 * j), s * 0.03, 0, TAU); c.fill(); }
          kit.label(c, '… ' + sci(across, 1) + ' molecules along each edge', acx + s * 0.55, ay0 + 8, { color: C.text, size: 12.5, weight: 650, align: 'center' });
        }
        ro.set('N', sci(N, 2));
        ro.set('m', mass < 1e-6 ? sci(mass, 1) + ' kg' : mass < 1 ? (mass * 1e3 >= 1 ? (mass * 1e3).toFixed(mass < 0.01 ? 2 : 1) + ' g' : (mass * 1e6).toFixed(1) + ' mg') : mass < 1e4 ? mass.toFixed(1) + ' kg' : sci(mass, 2) + ' kg');
        ro.set('v', vol < 1e-12 ? sci(vol * 1e27, 1) + ' nm³' : vol < 1e-6 ? (vol * 1e9).toFixed(2) + ' mm³ (µL)' : vol < 1e-3 ? (vol * 1e6).toFixed(2) + ' mL' : vol < 1e3 ? (vol * 1e3).toFixed(2) + ' L' : sci(vol, 2) + ' m³');
        ro.set('edge', fmtLen(edge));
        ro.set('across', across < 1e4 ? across.toFixed(across < 10 ? 1 : 0) : sci(across, 1));
        ro.set('glass', vol / 2.5e-4 < 100 ? (vol / 2.5e-4).toPrecision(2) : sci(vol / 2.5e-4, 1));
        const secs = N / 1e9;
        ro.set('count', secs < 60 ? secs.toPrecision(2) + ' s' : secs < 3.15576e7 ? (secs / 3.15576e7 * 365.25).toPrecision(2) + ' days' : secs / 3.15576e7 < 1e6 ? (secs / 3.15576e7).toPrecision(2) + ' years' : sci(secs / 3.15576e7, 1) + ' years (the universe is 1.4 × 10¹⁰)');
      }, box.stage);
      loop.start();
    }
  });
})();
