/* HYPER-CORE · ui/water-molecule.js — Tools → Molecule lab (#/tools/molecule/<molecule|network|lattice|siblings>)
 *
 *   molecule   water, ammonia, methane and hydrogen sulfide in 3-D, turnable, with the bond angle, the dipole arrow,
 *              the lone pairs and the partial charges, and the numbers that follow from the shape
 *   network    the hydrogen-bond network at any temperature: molecules jostle, bonds form and break; the bond count
 *              and lifetime against temperature
 *   lattice    the open honeycomb of ice Ih beside the crowded liquid, with a temperature slider across the melting
 *              point and the density of each
 *   siblings   the look-alikes: boiling points of the hydrides of groups 14–17 against their period, with hydrogen
 *              bonding switched on and off, and the table of masses, dipoles and boiling points
 *
 * The physics is kit.water; molecules from kit.chem and kit.mol; drawing kit.wsym; shared helpers T.util.
 */
(function () {
  'use strict';
  const H = window.Hyper, ui = H.ui, U = H.util, esc = U.esc, K = H.kit, W = H.water, S = H.wsym;
  const T = H.waterTools = H.waterTools || {};
  const f = T.util.f;
  const TABS = [['molecule', 'The molecule in 3-D'], ['network', 'The flickering network'], ['lattice', 'Ice and liquid'], ['siblings', 'The look-alikes']];

  T.molecule = function (el, params, sub) {
    const t = T.util.subtabs(el, 'molecule', TABS, sub, 'Geometries from VSEPR with the measured bond angles; the network and the lattice are two-dimensional cartoons of a three-dimensional thing — the counts and lifetimes beside them are the real numbers.');
    ({ molecule, network, lattice, siblings })[t.tab](t.body, params);
  };
  T.molecule.tabs = TABS.map(t => t[0]);

  const label = (c, s, x, y, o) => K.label(c, s, x, y, Object.assign({ size: 11.5, color: K.colors().muted }, o));
  const degC = v => f(v, 1) + ' °C';

  /* ================================================================ 3-D */
  function molecule(el, params) {
    const L = T.util.lab(el, 'Drag to turn. Water is bent at 104.5° and lopsided in charge; methane is a symmetric tetrahedron with no net dipole; ammonia is a pyramid with one lone pair; hydrogen sulfide is bent like water but barely polar. The arrow is the dipole moment, from the positive end to the negative.', 0.6);
    const MOLS = [['Water H₂O', 'H2O'], ['Ammonia NH₃', 'NH3'], ['Methane CH₄', 'CH4'], ['Hydrogen sulfide H₂S', 'H2S'], ['Hydrogen fluoride HF', 'HF'], ['Carbon dioxide CO₂', 'CO2']];
    const ctl = K.controls(L.side, [
      { id: 'mol', type: 'select', label: 'Molecule', options: MOLS, value: params && params.mol || 'H2O' },
      { id: 'style', type: 'select', label: 'Style', options: [['Ball and stick', 'ball'], ['Space filling', 'space']], value: 'ball' },
      { id: 'lone', type: 'check', label: 'Lone pairs', value: true },
      { id: 'dip', type: 'check', label: 'Dipole arrow', value: true },
      { id: 'charges', type: 'check', label: 'Partial charges', value: true },
      { id: 'spin', type: 'check', label: 'Spin slowly', value: true }
    ], () => { mol = build(); loop.once(); });
    const V = ctl.values;
    const ro = K.readout(L.side, [['angle', 'Bond angle'], ['mass', 'Molar mass'], ['dipole', 'Dipole moment'], ['bp', 'Boils at'], ['mp', 'Melts at'], ['hb', 'Hydrogen bonds'], ['note', '']]);
    const view = K.mol.view({ rotX: -0.5, rotY: 0.6, scale: 90 });
    K.mol.rotator(L.st, view, () => loop.once());
    const CH = K.chem;
    function build() {
      const id = V.mol;
      try {
        if (id === 'H2S') { const m = CH.fromVsepr('S', ['H', 'H'], 2); return m; }
        if (id === 'HF') { const m = CH.fromVsepr('F', ['H'], 3); return m; }
        return CH.molecule(id);
      } catch (e) { return CH.molecule('H2O'); }
    }
    let mol = build();
    const CHARGE = { H2O: [-0.66, 0.33], NH3: [-0.9, 0.3], CH4: [-0.4, 0.1], H2S: [-0.3, 0.15], HF: [-0.4, 0.4], CO2: [0.6, -0.3] };
    const loop = K.loop((dt) => {
      if (V.spin) view.rotY += 0.25 * Math.min(dt, 0.05);
      const c = L.st.begin(), C = K.colors(), cx = L.st.W / 2, cy = L.st.H / 2;
      view.scale = Math.min(110, L.st.H / 3.2);
      const info = W.MOLECULES.find(m => m.id === V.mol) || {};
      // angle: between the first two ligands around atom 0 where there are two
      const lig = mol.bonds.filter(b => b[0] === 0 || b[1] === 0).map(b => b[0] === 0 ? b[1] : b[0]);
      K.mol.draw(c, mol, view, { cx, cy, centre: [0, 0, 0], style: V.style, labels: true, lone: V.lone, angle: lig.length >= 2 ? [lig[0], 0, lig[1]] : null });
      if (V.dip && info.dipole > 0) {
        // the arrow from the centre of positive charge (the hydrogens' mean) to the central atom
        const hs = lig.map(i => mol.atoms[i]);
        const mean = [0, 1, 2].map(k => hs.reduce((s, a) => s + a[['x', 'y', 'z'][k]], 0) / hs.length);
        const a0 = mol.atoms[0];
        const from = K.mol.project(mean, view, { cx, cy }), to = K.mol.project([a0.x + (a0.x - mean[0]) * 0.9, a0.y + (a0.y - mean[1]) * 0.9, a0.z + (a0.z - mean[2]) * 0.9], view, { cx, cy });
        K.arrow(c, from.x, from.y, to.x, to.y, C.warn, 3);
        label(c, 'μ = ' + info.dipole + ' D', to.x + 8, to.y - 8, { color: C.warn, weight: 650, size: 12 });
      }
      if (V.charges && CHARGE[V.mol]) {
        const q = CHARGE[V.mol];
        const p0 = K.mol.project([mol.atoms[0].x, mol.atoms[0].y, mol.atoms[0].z], view, { cx, cy });
        label(c, 'δ' + (q[0] < 0 ? '−' : '+') + ' ' + Math.abs(q[0]).toFixed(2) + ' e', p0.x + 26, p0.y - 26, { color: C.text, size: 12, weight: 650 });
        for (const i of lig) { const p = K.mol.project([mol.atoms[i].x, mol.atoms[i].y, mol.atoms[i].z], view, { cx, cy }); label(c, 'δ' + (q[1] < 0 ? '−' : '+') + ' ' + Math.abs(q[1]).toFixed(2) + ' e', p.x + 16, p.y + 16, { color: C.text, size: 11 }); }
      }
      label(c, (MOLS.find(m => m[1] === V.mol) || [''])[0] + ' — ' + (info.shape || ''), 12, 18, { color: C.text, size: 13, weight: 650 });
      ro.set('angle', lig.length >= 2 ? f(K.mol.angle(mol, lig[0], 0, lig[1]), 1) + '°' : '—');
      ro.set('mass', (info.mass || CH.molarMass(V.mol)).toFixed(2) + ' g/mol');
      ro.set('dipole', info.dipole != null ? info.dipole + ' D' + (info.dipole === 0 ? ' — the bond dipoles cancel' : '') : '—');
      ro.set('bp', info.bp != null ? degC(info.bp) : '—');
      ro.set('mp', info.mp != null ? degC(info.mp) : '—');
      ro.set('hb', info.donors != null ? info.donors + ' donor' + (info.donors === 1 ? '' : 's') + ', ' + info.acceptors + ' acceptor' + (info.acceptors === 1 ? '' : 's') + (info.id === 'H2O' ? ' — a three-dimensional net' : info.donors && info.acceptors ? ' — chains and rings' : ' — no hydrogen bonds') : '—');
      ro.set('note', info.note || '');
    }, L.stage);
    loop.start();
    L.under.innerHTML = '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ['the-bent-shape', 'polarity-and-the-dipole', 'three-siblings', 'what-a-hydrogen-bond-is', 'two-donors-two-acceptors'].map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';
  }

  /* ================================================================ the network */
  function network(el, params) {
    const L = T.util.lab(el, 'Molecules in a box, seen from above. A dashed line is a hydrogen bond. Change the temperature: cold water keeps more bonds for longer and settles into rings of six; hot water keeps fewer and shorter-lived ones, but most molecules still hold two or three — which is why it is still a liquid at 99 °C.', 0.6);
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Temperature', min: -30, max: 100, step: 1, value: params && params.T != null ? +params.T : 25, unit: '°C' },
      { id: 'n', label: 'Molecules', min: 10, max: 60, step: 1, value: 30 },
      { id: 'bonds', type: 'check', label: 'Show hydrogen bonds', value: true },
      { id: 'charges', type: 'check', label: 'Partial charges', value: false },
      { id: 'track', type: 'check', label: 'Follow one molecule', value: false },
      { type: 'buttons', items: [{ id: 'shake', label: 'Shuffle', primary: true }] }
    ], (id) => { if (id === 'n' || id === 'shake') net = null; });
    const V = ctl.values;
    const ro = K.readout(L.side, [['per', 'Bonds per molecule (model)'], ['now', 'On screen'], ['life', 'Bond lifetime'], ['ratio', 'Bond energy ÷ kT'], ['count', 'Bonds breaking per second in a glass (250 mL)']]);
    const plot = K.plot(L.under, { x: { label: 'temperature (°C)', min: -30, max: 100 }, y: { label: 'bonds per molecule', min: 2.5, max: 4.1 }, legend: true }, 200);
    const curve = [], lifeC = []; for (let t = -30; t <= 100; t += 2) { curve.push([t, W.hbondsPerMolecule(t)]); lifeC.push([t, 2.5 + Math.min(1.6, W.hbondLifetime(t) * 1e12 / 4)]); }
    let net = null, acc = 0, cnt = 0, hist = [];
    const loop = K.loop((dt) => {
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const sc = Math.max(11, Math.min(20, Math.sqrt(Wd * Hh / V.n) / 4.4));
      if (!net || net.length !== V.n) { net = S.makeNetwork(V.n, Wd - 60, Hh, sc, Math.floor(Math.random() * 1e6)); hist = []; }
      let bonds = [];
      const step = Math.min(dt, 0.05);
      for (let i = 0; i < 3; i++) bonds = S.stepNetwork(net, step / 3, { T: V.T, W: Wd - 60, H: Hh, scale: sc });
      if (V.bonds) for (const [i, j, k] of bonds) { const a = net[i]; const h = [a.x + 0.96 * sc * Math.cos(a.a + (k ? 1 : -1) * 0.9115), a.y + 0.96 * sc * Math.sin(a.a + (k ? 1 : -1) * 0.9115)]; S.hbond(c, h[0], h[1], net[j].x, net[j].y, { alpha: V.track && i !== 0 && j !== 0 ? 0.25 : 0.75, color: V.track && (i === 0 || j === 0) ? C.warn : undefined }); }
      net.forEach((m, i) => S.molecule(c, m.x, m.y, { angle: m.a, scale: sc, charges: V.charges, alpha: V.track && i !== 0 ? 0.3 : 1 }));
      if (V.track) { const m = net[0]; c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(m.x, m.y, sc * 1.3, 0, 6.283); c.stroke(); const mine = bonds.filter(b => b[0] === 0 || b[1] === 0).length; hist.push(mine); if (hist.length > 160) hist.shift(); const hx = 10, hy = Hh - 40, hw = Math.min(200, Wd * 0.4); c.fillStyle = C.surface; c.fillRect(hx, hy, hw, 34); hist.forEach((v, k) => { c.fillStyle = C.warn; c.fillRect(hx + k * hw / 160, hy + 34 - v * 8, hw / 160 + 0.5, v * 8); }); label(c, 'bonds held by the marked molecule, last frames', hx, hy - 6, { size: 10.5 }); }
      S.thermometer(c, Wd - 34, 16, Hh - 40, V.T, { min: -30, max: 100 });
      acc += bonds.length; cnt++;
      if (cnt >= 12) { ro.set('now', (acc / cnt / V.n).toFixed(2) + ' per molecule'); acc = 0; cnt = 0; }
      ro.set('per', W.hbondsPerMolecule(V.T).toFixed(2) + ' of 4');
      ro.set('life', (W.hbondLifetime(V.T) * 1e12).toFixed(2) + ' ps');
      ro.set('ratio', (W.HBOND.energy / (W.R * (V.T + 273.15))).toFixed(1));
      ro.set('count', T.util.sci(W.molecules(0.25) * W.hbondsPerMolecule(V.T) / 2 / W.hbondLifetime(V.T), 1));
    }, L.stage);
    loop.start();
    plot.set({ series: [{ pts: curve, label: 'bonds per molecule (model)' }, { pts: lifeC, label: 'lifetime (scaled: 1 ps per 0.25)', dash: true }], vlines: [{ x: V.T }] });
    ctl.onChange && ctl.onChange(() => plot.set({ vlines: [{ x: V.T }] }));
    const upd = setInterval(() => plot.set({ vlines: [{ x: V.T, label: V.T + ' °C' }] }), 500);
    ui.onLeave(() => clearInterval(upd));
  }

  /* ================================================================ ice and liquid */
  function lattice(el) {
    const L = T.util.lab(el, 'Left: the honeycomb of ice Ih seen down its hexagonal axis — every oxygen bonded to four neighbours, every ring open. Right: the liquid at the same scale, crowded into the gaps. Slide the temperature across 0 °C; the number under each is its density.', 0.5);
    const ctl = K.controls(L.side, [
      { id: 'T', label: 'Temperature', min: -40, max: 40, step: 1, value: -10, unit: '°C' },
      { id: 'mols', type: 'check', label: 'Draw the molecules (not just oxygens)', value: true },
      { id: 'd2o', type: 'check', label: 'Heavy water instead', value: false }
    ], () => { });
    const V = ctl.values;
    const ro = K.readout(L.side, [['ice', 'Ice'], ['liq', 'Liquid'], ['ratio', 'Liquid ÷ ice'], ['nn', 'Neighbours'], ['state', 'At this temperature']]);
    let net = null;
    const loop = K.loop((dt) => {
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      const half = Wd / 2, a = Math.max(14, Math.min(24, half / 11));
      const mp = V.d2o ? W.D2O.mp : 0;
      const frozen = V.T < mp;
      // left: lattice with thermal jitter growing with temperature (schematic)
      const jit = Math.max(0, (V.T + 40) / 80) * 0.18 * a;
      let seed = Math.floor(Date.now() / 120); const r = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      c.save(); c.translate(r() * jit - jit / 2, r() * jit - jit / 2);
      S.iceLattice(c, half / 2, Hh * 0.48, a, 2, { molecules: V.mols, angle: Math.PI / 6, color: frozen ? C.accent : C.faint });
      c.restore();
      label(c, frozen ? 'ice Ih: four neighbours each, open rings' : 'the lattice would melt here (shown faint)', half / 2, 16, { align: 'center', color: C.text, size: 12 });
      // right: the liquid network
      if (!net) { net = S.makeNetwork(26, half - 30, Hh - 60, a * 0.65, 42); for (const m of net) { m.x += half + 15; m.y += 30; } }
      const bonds = S.stepNetwork(net, Math.min(dt, 0.05) * 0.6, { T: Math.max(0, V.T), W: Wd, H: Hh, scale: a * 0.65 });
      for (const m of net) { m.x = Math.max(half + 10, Math.min(Wd - 10, m.x)); m.y = Math.max(24, Math.min(Hh - 30, m.y)); }
      S.network(c, net, { scale: a * 0.65, bonds });
      label(c, frozen ? 'the liquid, supercooled: it would freeze given a nucleus' : 'liquid: about 3.7 bonds each, molecules in the gaps', half + half / 2, 16, { align: 'center', color: C.text, size: 12 });
      c.strokeStyle = C.axis; c.beginPath(); c.moveTo(half, 8); c.lineTo(half, Hh - 8); c.stroke();
      const rhoI = V.d2o ? 1017 * (1 - 1.6e-4 * Math.min(0, V.T)) : W.densityIce(Math.min(0, V.T));
      const rhoL = V.d2o ? W.densityD2O(V.T) : W.density(V.T);
      label(c, f(rhoI, 1) + ' kg/m³', half / 2, Hh - 10, { align: 'center', color: C.text, weight: 650, size: 13 });
      label(c, f(rhoL, 1) + ' kg/m³', half + half / 2, Hh - 10, { align: 'center', color: C.text, weight: 650, size: 13 });
      ro.set('ice', f(rhoI, 1) + ' kg/m³' + (V.d2o ? ' (heavy ice)' : ''));
      ro.set('liq', f(rhoL, 1) + ' kg/m³' + (V.T < mp ? ' (supercooled)' : ''));
      ro.set('ratio', f(rhoL / rhoI, 3) + ' — the liquid is ' + f((rhoL / rhoI - 1) * 100, 1) + ' % denser');
      ro.set('nn', 'ice: 4 at 2.76 Å; liquid: about 4.4 within 3.3 Å, 3.7 of them bonded');
      ro.set('state', frozen ? 'below ' + degC(mp) + ': ice is the stable phase' : 'above ' + degC(mp) + ': liquid');
    }, L.stage);
    loop.start();
    L.under.innerHTML = '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + ['why-ice-floats', 'the-tetrahedral-network', 'the-structure-of-liquid-water', 'ice-ih-and-ice-ic', 'the-density-maximum'].map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.nodes.has(id) ? H.titleOf(id) : id) + '</a>').join('') + '</div>';
  }

  /* ================================================================ the look-alikes */
  const LADDER = [
    { g: 14, name: 'group 14 (CH₄ …)', pts: [['CH₄', 2, -161.5], ['SiH₄', 3, -111.9], ['GeH₄', 4, -88.5], ['SnH₄', 5, -52]], hb: null },
    { g: 15, name: 'group 15 (NH₃ …)', pts: [['NH₃', 2, -33.3], ['PH₃', 3, -87.7], ['AsH₃', 4, -62.5], ['SbH₃', 5, -17]], hb: ['NH₃', -110] },
    { g: 16, name: 'group 16 (H₂O …)', pts: [['H₂O', 2, 100], ['H₂S', 3, -60.3], ['H₂Se', 4, -41.3], ['H₂Te', 5, -2.2]], hb: ['H₂O', -80] },
    { g: 17, name: 'group 17 (HF …)', pts: [['HF', 2, 19.5], ['HCl', 3, -85.1], ['HBr', 4, -66.8], ['HI', 5, -35.4]], hb: ['HF', -95] }
  ];
  function siblings(el) {
    const L = T.util.lab(el, 'The hydrides of each group boil higher as they get heavier — except at the top, where N, O and F make hydrogen bonds. Switch the bonds off and water boils where its weight says it should, near −80 °C: a gas at every temperature on Earth. Of the three near-twins at mass 16, 17 and 18, only water makes four bonds.', 0.55);
    const ctl = K.controls(L.side, [
      { id: 'hb', type: 'check', label: 'Hydrogen bonding on', value: true },
      { id: 'groups', type: 'select', label: 'Show', options: [['All four groups', 'all'], ['Group 16 only (water\'s family)', '16'], ['The three near-twins: CH₄, NH₃, H₂O', 'twins']], value: 'all' }
    ], () => draw());
    const V = ctl.values;
    const ro = K.readout(L.side, [['w', 'Water boils at'], ['exp', 'By the trend it would boil at'], ['gap', 'The hydrogen bond adds'], ['twins', 'The twins']]);
    const plot = K.plot(L.under, { x: { label: 'period of the central atom', min: 1.5, max: 5.5 }, y: { label: 'boiling point (°C)', min: -200, max: 120 }, legend: true }, 260);
    function draw() {
      const ser = [], marks = [];
      const groups = V.groups === 'all' ? LADDER : V.groups === '16' ? LADDER.filter(g => g.g === 16) : LADDER.filter(g => g.g !== 17);
      for (const g of groups) {
        const pts = g.pts.map(p => [p[1], (!V.hb && g.hb && p[0] === g.hb[0]) ? g.hb[1] : p[2]]);
        if (V.groups === 'twins') { ser.push({ pts: pts.slice(0, 1), label: g.pts[0][0], dots: true, line: false }); continue; }
        ser.push({ pts, label: g.name, dots: true });
        for (const p of g.pts) marks.push({ x: p[1], y: (!V.hb && g.hb && p[0] === g.hb[0]) ? g.hb[1] : p[2], label: p[0] });
      }
      if (V.groups === 'twins') for (const g of groups) marks.push({ x: g.pts[0][1] + (g.g - 16) * 0.25, y: (!V.hb && g.hb) ? g.hb[1] : g.pts[0][2], label: g.pts[0][0] + ' (' + (g.g === 14 ? 16 : g.g === 15 ? 17 : 18) + ' g/mol)' });
      plot.set({ series: ser, marks, hlines: [{ y: 0, label: '0 °C' }, { y: 37, label: 'body temperature' }], x: V.groups === 'twins' ? { label: 'the three near-twins', min: 1.4, max: 2.6 } : { label: 'period of the central atom', min: 1.5, max: 5.5 } });
      ro.set('w', V.hb ? '100 °C' : 'about ' + W.ladderExpected + ' °C (hydrogen bonds off)');
      ro.set('exp', 'about ' + W.ladderExpected + ' °C, extrapolating H₂Te → H₂Se → H₂S');
      ro.set('gap', 'about 180 K to the boiling point and 100 K to the melting point');
      ro.set('twins', 'CH₄ 16 g/mol boils at −161.5 °C · NH₃ 17 at −33.3 °C · H₂O 18 at 100 °C');
      const c = L.st.begin(), C = K.colors(), Wd = L.st.W, Hh = L.st.H;
      // the three twins as molecules with their bonds counted
      const cols = [['CH4', 'methane', '0 bonds', -161.5], ['NH3', 'ammonia', '~1 bond', -33.3], ['H2O', 'water', '4 bonds', 100]];
      cols.forEach(([id, name, b, bp], k) => {
        const x = Wd * (0.17 + 0.33 * k), y = Hh * 0.4;
        const m = K.chem.molecule(id);
        const view = K.mol.view({ rotX: -0.5, rotY: 0.5 + Date.now() / 4000, scale: Math.min(45, Hh / 7) });
        K.mol.draw(c, m, view, { cx: x, cy: y, style: 'ball', labels: true, lone: true });
        label(c, name + ' · ' + (W.MOLECULES.find(mm => mm.id === id) || {}).mass + ' g/mol', x, Hh * 0.72, { align: 'center', color: C.text, size: 12.5, weight: 650 });
        label(c, b + ' per molecule', x, Hh * 0.72 + 16, { align: 'center' });
        const bpShow = V.hb || id !== 'H2O' ? bp : W.ladderExpected;
        label(c, 'boils at ' + degC(bpShow), x, Hh * 0.72 + 32, { align: 'center', color: bpShow > 20 ? C.accent : C.warn, weight: 650, size: 12.5 });
        label(c, bpShow > 20 ? 'liquid on Earth' : 'a gas on Earth', x, Hh * 0.72 + 48, { align: 'center' });
      });
    }
    const loop = K.loop(() => draw(), L.stage);
    loop.start();
  }
})();
