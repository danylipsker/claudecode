/* HYPER-WATER · sims/hydrogen-bonds.js — the simulations of the topic "The bond that is barely a bond".
 *   hb-donors-acceptors   count the hydrogens a molecule can give and the lone pairs it can take: why water makes a net,
 *                         ammonia and hydrogen fluoride only chains
 *   hb-tetrahedral        the four neighbours at the corners of a tetrahedron (and the twelve beyond), and the network of
 *                         bonds drawn as a diamond lattice in which bonds are present with the probability the temperature gives
 *   hb-flicker            the flickering 2-D network with one bond followed as a timeline, and the memory of a bond in picoseconds
 *   hb-cooperativity      a chain or ring of molecules: each bond is stronger for having neighbours, and each molecule more polar
 *   hb-rdf                the oxygen–oxygen radial distribution function g(r) of the liquid, beside a histogram built from the 2-D network
 *   hb-grotthuss          a proton hopping along a chain of waters, and a race with the ions that have to carry their water
 *   hb-spectrum           the O–H stretch band of vapour, liquid and ice, and what its position says about the bond
 * Numbers come from kit.water. Where a model is local (the cooperativity increments, the schematic g(r), the spectrum bands, the
 * hop timings) a comment says so and the blurb says "schematic".
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ================================================================ donors and acceptors */
  Hyper.sim('hb-donors-acceptors', {
    title: 'Counting hands: donors and acceptors',
    blurb: `Every hydrogen bond needs one hydrogen to give and one lone pair to receive it. Pick a molecule and see how many of each it has. A bond uses one of each, so a molecule cannot make more bonds than the *smaller* of its two counts — and the picture on the right shows what that does to the pattern the molecules build.

**Try this**
- *Water*: two blue arrows out, two green arrows in. Every site is used; the picture on the right is a net.
- *Ammonia* has three hydrogens but a single lone pair: two of every three hydrogens are left with nothing to bond to.
- *Hydrogen fluoride* is the mirror case, one hydrogen and three lone pairs; its bonds are strong but it can only chain.
- *Methane*: four hydrogens, no lone pair, and the hydrogens are not positive enough anyway.
- *Hydrogen sulfide* has the count of water but sulfur is too big and too weakly electronegative: the bonds are feeble and it is a gas.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const NAMES = { H2O: 'Water, H₂O', NH3: 'Ammonia, NH₃', HF: 'Hydrogen fluoride, HF', CH3OH: 'Methanol, CH₃OH', H2S: 'Hydrogen sulfide, H₂S', CH4: 'Methane, CH₄' };
      const IDS = ['H2O', 'NH3', 'HF', 'CH3OH', 'H2S', 'CH4'];
      const CENTRE = { H2O: ['O', '#e8503a'], NH3: ['N', '#4a6fe0'], HF: ['F', '#5fbf6a'], CH3OH: ['O', '#e8503a'], H2S: ['S', '#d9b93a'], CH4: ['C', '#666'] };
      const molOf = id => W.MOLECULES.find(m => m.id === id);
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: IDS.map(id => [NAMES[id], id]), value: IDS.includes(params.mol) ? params.mol : 'H2O' },
        { id: 'names', type: 'check', label: 'Label the hands', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['d', 'Hydrogens it can give'], ['a', 'Lone pairs it can receive'], ['m', 'Bonds it can make (each counted once)'], ['pat', 'The pattern'], ['bp', 'Boiling point'], ['note', 'In short']]);
      const spread = (n, centre, gap) => Array.from({ length: n }, (_, i) => centre + (i - (n - 1) / 2) * gap);
      function hand(c, C, cx, cy, ang, kind, label) {
        const ca = Math.cos(ang), sa = Math.sin(ang);
        if (kind === 'give') {
          c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(cx + 18 * ca, cy + 18 * sa); c.lineTo(cx + 48 * ca, cy + 48 * sa); c.stroke();
          kit.dot(c, cx + 54 * ca, cy + 54 * sa, 9, '#e9eef3', '#8a949e');
          kit.arrow(c, cx + 68 * ca, cy + 68 * sa, cx + 100 * ca, cy + 100 * sa, C.accent, 2);
          if (V.names) kit.label(c, label, cx + 112 * ca, cy + 112 * sa, { size: 11, color: C.accent, align: 'center', baseline: 'middle' });
        } else if (kind === 'take') {
          c.save(); c.translate(cx + 40 * ca, cy + 40 * sa); c.rotate(ang);
          c.fillStyle = 'rgba(120,170,255,0.38)'; c.strokeStyle = 'rgba(120,170,255,0.9)'; c.lineWidth = 1.2;
          c.beginPath(); c.ellipse(0, 0, 17, 10, 0, 0, TAU); c.fill(); c.stroke(); c.restore();
          kit.arrow(c, cx + 100 * ca, cy + 100 * sa, cx + 68 * ca, cy + 68 * sa, C.ok, 2);
          if (V.names) kit.label(c, label, cx + 112 * ca, cy + 112 * sa, { size: 11, color: C.ok, align: 'center', baseline: 'middle' });
        } else {                                   // an atom or group that cannot take part
          c.strokeStyle = C.faint; c.lineWidth = 3; c.beginPath(); c.moveTo(cx + 18 * ca, cy + 18 * sa); c.lineTo(cx + 48 * ca, cy + 48 * sa); c.stroke();
          kit.dot(c, cx + 56 * ca, cy + 56 * sa, label.length > 1 ? 13 : 9, C.bg2, C.faint);
          kit.label(c, label, cx + 56 * ca, cy + 56 * sa, { size: label.length > 1 ? 10 : 9, color: C.muted, align: 'center', baseline: 'middle' });
        }
      }
      function chain(c, C, x0, y0, w, m, d, a, weak) {
        const n = 5, dx = w / (n - 1), ys = [y0 - 16, y0 + 16];
        c.save(); if (weak) c.globalAlpha = 0.45;
        for (let i = 0; i < n; i++) {
          const x = x0 + i * dx, y = ys[i % 2];
          // the sites left unused
          for (let k = 0; k < d - m; k++) kit.arrow(c, x, y, x + (k ? 12 : -12), y + (i % 2 ? 26 : -26), C.faint, 1);
          for (let k = 0; k < a - m; k++) { c.fillStyle = 'rgba(120,170,255,0.25)'; c.beginPath(); c.arc(x + (k ? 14 : -14), y + (i % 2 ? 20 : -20), 6, 0, TAU); c.fill(); }
        }
        for (let i = 0; i < n - 1; i++) S.hbond(c, x0 + i * dx, ys[i % 2], x0 + (i + 1) * dx, ys[(i + 1) % 2], { color: C.accent, width: 2, alpha: 0.9 });
        for (let i = 0; i < n; i++) kit.dot(c, x0 + i * dx, ys[i % 2], 8, CENTRE[V.mol][1], C.text);
        c.restore();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const id = V.mol, M = molOf(id) || W.MOLECULES[2], d = M.donors, a = M.acceptors, m = Math.min(d, a);
        const weak = id === 'H2S';
        const cx = Wd * 0.26, cy = Hh * 0.5;
        kit.label(c, 'one molecule', cx, 20, { size: 12, color: C.muted, align: 'center' });
        // hands
        if (id === 'CH4') {
          for (const g of [-2.3, -0.85, 0.85, 2.3]) hand(c, C, cx, cy, g, 'none', 'H');
        } else {
          const up = -Math.PI / 2, down = Math.PI / 2;
          const dg = d === 1 ? [up] : spread(d, up, d === 2 ? 1.5 : 1.15);
          const ag = a === 1 ? [down] : spread(a, down, a === 2 ? 1.5 : 1.15);
          if (id === 'CH3OH') { hand(c, C, cx, cy, up + 0.75, 'give', 'gives'); hand(c, C, cx, cy, up - 0.75, 'none', 'CH₃'); }
          else dg.forEach(g => hand(c, C, cx, cy, g, 'give', 'gives'));
          ag.forEach(g => hand(c, C, cx, cy, g, 'take', 'takes'));
        }
        const cc = CENTRE[id];
        kit.dot(c, cx, cy, 20, cc[1], C.text);
        kit.label(c, cc[0], cx, cy, { size: 15, weight: 700, color: '#fff', align: 'center', baseline: 'middle' });
        kit.label(c, d + ' to give · ' + a + ' to take', cx, Hh - 16, { size: 12.5, color: C.text, align: 'center', weight: 600 });
        // the pattern they build
        const rx = Wd * 0.52, rw = Wd * 0.44, ry = Hh * 0.5;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(Wd * 0.5, 14); c.lineTo(Wd * 0.5, Hh - 14); c.stroke();
        kit.label(c, 'what many of them build', rx + rw / 2, 20, { size: 12, color: C.muted, align: 'center' });
        let pat;
        if (m === 0) {
          pat = 'none: no hydrogen bonds';
          for (let i = 0; i < 6; i++) kit.dot(c, rx + rw * (0.12 + 0.15 * i), ry + (i % 2 ? 24 : -24), 8, CENTRE[id][1], C.text);
          kit.label(c, 'the molecules ignore one another', rx + rw / 2, ry + 70, { size: 11.5, color: C.muted, align: 'center' });
        } else if (m === 1) {
          pat = 'chains, rings and pairs';
          chain(c, C, rx + 20, ry, rw - 40, m, d, a, false);
          kit.label(c, 'one bond in, one out: a chain', rx + rw / 2, ry + 70, { size: 11.5, color: C.muted, align: 'center' });
          if (d - m > 0 || a - m > 0) kit.label(c, 'grey: hydrogens and lone pairs left unused', rx + rw / 2, ry + 88, { size: 11, color: C.faint, align: 'center' });
        } else {
          pat = weak ? 'a net in principle; the bonds are too weak to hold it' : 'a three-dimensional net';
          c.save(); if (weak) c.globalAlpha = 0.4;
          S.iceLattice(c, rx + rw / 2, ry, Math.min(24, rw / 8), 2, { color: C.accent });
          c.restore();
          kit.label(c, weak ? 'S–H···S bonds are worth about 5 kJ/mol: a gas' : 'two in, two out: a net, drawn flat here', rx + rw / 2, ry + Math.min(110, Hh * 0.34), { size: 11.5, color: C.muted, align: 'center' });
        }
        ro.set('d', String(d));
        ro.set('a', String(a));
        ro.set('m', String(m) + (m ? ' (so ' + 2 * m + ' bond ends)' : ''));
        ro.set('pat', pat);
        ro.set('bp', M.bp.toFixed(1) + ' °C');
        ro.set('note', M.note);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the tetrahedral network */
  Hyper.sim('hb-tetrahedral', {
    title: 'Four neighbours at the corners of a tetrahedron',
    blurb: `Two views of the same idea. **The tetrahedron:** one molecule (large) with its four hydrogen-bonded neighbours at the corners of a tetrahedron, 2.8 Å away, 109.5° apart; the faint spheres are the twelve second neighbours at 4.57 Å, the distance that gives liquid water its second peak. **The net:** the same geometry repeated as a diamond lattice, with each bond present with the probability the temperature gives. Bonds in the biggest connected cluster are blue, bonds cut off from it orange.

**Try this**
- Turn on *second neighbours* and count them: three for each of the four first neighbours.
- In *The net*, slide the temperature to 100 °C: about 78 % of the bonds remain, and the net is still one piece. Tick *set the fraction by hand* and lower it: it falls apart near 39 %.
- A real liquid is not a perfect lattice — rings of five and seven, distorted angles — but the connectivity is the same, which is the point.
- The lattice is a picture; the lines that would be broken are not drawn.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['The tetrahedron', 'tetra'], ['The net', 'net']], value: params.mode === 'net' ? 'net' : 'tetra' },
        { id: 'spin', type: 'check', label: 'Turn it slowly', value: true },
        { id: 'view', label: 'Viewing angle', min: 0, max: 360, step: 1, value: 25, unit: '°' },
        { id: 'second', type: 'check', label: 'Second neighbours (12 at 4.57 Å)', value: false },
        { id: 'T', label: 'Temperature', min: -20, max: 100, step: 1, value: 25, unit: '°C' },
        { id: 'hand', type: 'check', label: 'Set the fraction of bonds by hand', value: false },
        { id: 'p', label: 'Bonds present', min: 0, max: 100, step: 1, value: 92, unit: '%' },
        { type: 'buttons', items: [{ id: 'reshuffle', label: 'Reshuffle the bonds', primary: true }] }
      ], (id) => { if (id === 'reshuffle') seed(); dirty = true; if (id === 'mode') showHide(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['a', 'Neighbours'], ['b', 'O–O distance'], ['c', 'Angle between two bonds'], ['d', 'Second shell'], ['e', 'Bonds per molecule (liquid at this T)'], ['f', 'Fraction of bonds present'], ['g', 'Largest cluster'], ['h', 'Molecules with no bond']]);
      /* geometry of the tetrahedron: bond directions of a diamond-type net */
      const s3 = 1 / Math.sqrt(3);
      const U = [[s3, s3, s3], [s3, -s3, -s3], [-s3, s3, -s3], [-s3, -s3, s3]];
      const D = 2.8;
      const rot = (p, ay, ax) => {
        let x = p[0], y = p[1], z = p[2], c = Math.cos(ay), s = Math.sin(ay);
        const x1 = c * x + s * z, z1 = -s * x + c * z;
        c = Math.cos(ax); s = Math.sin(ax);
        return [x1, c * y - s * z1, s * y + c * z1];
      };
      /* the diamond lattice, N × N × N cubic cells: integer coordinates in quarter-cells */
      const N = 4, sites = [], key = new Map(), bonds = [];
      const FCC = [[0, 0, 0], [0, 2, 2], [2, 0, 2], [2, 2, 0]];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) for (const f of FCC) {
        const A = [4 * i + f[0], 4 * j + f[1], 4 * k + f[2]], B = [A[0] + 1, A[1] + 1, A[2] + 1];
        for (const P of [A, B]) { key.set(P.join(','), sites.length); sites.push(P); }
      }
      const DIR = [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]];
      for (let i = 0; i < sites.length; i += 2) {
        const A = sites[i];
        for (const d of DIR) { const j = key.get([A[0] + d[0], A[1] + d[1], A[2] + d[2]].join(',')); if (j != null) bonds.push({ i, j, u: 0 }); }
      }
      function seed() { for (const b of bonds) b.u = Math.random(); }
      seed();
      let lastP = -1, dirty = true, comp = null, big = 0, alone = 0, ang = 0.6;
      function cluster(p) {
        const par = sites.map((_, i) => i);
        const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
        for (const b of bonds) { b.on = b.u < p; if (b.on) { const a = find(b.i), c = find(b.j); if (a !== c) par[a] = c; } }
        const size = new Map(), deg = new Array(sites.length).fill(0);
        for (const b of bonds) if (b.on) { deg[b.i]++; deg[b.j]++; }
        for (let i = 0; i < sites.length; i++) { const r = find(i); size.set(r, (size.get(r) || 0) + 1); }
        let best = -1, bs = 0;
        for (const [r, s] of size) if (s > bs) { bs = s; best = r; }
        comp = sites.map((_, i) => find(i) === best);
        big = bs / sites.length;
        alone = deg.filter(x => x === 0).length / sites.length;
      }
      function showHide() {
        const tet = V.mode === 'tetra';
        ctl.show('second', tet); ctl.show('T', !tet); ctl.show('hand', !tet); ctl.show('p', !tet && V.hand); ctl.show('reshuffle', !tet);
      }
      showHide();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.spin) { ang += dt * 0.35; V.view = (ang * 180 / Math.PI) % 360; ctl.set('view', V.view); } else ang = V.view * Math.PI / 180;
        const cx = Wd * 0.5, cy = Hh * 0.5, tilt = 0.45;
        const nT = W.hbondsPerMolecule(V.T), pT = V.hand ? V.p / 100 : nT / 4;
        ctl.show('p', V.mode === 'net' && V.hand);
        if (V.mode === 'tetra') {
          const sc = Math.min(Wd, Hh) * 0.44 / 4.8;
          const items = [], proj = p => { const q = rot(p, ang, tilt); return { x: cx + q[0] * sc, y: cy - q[1] * sc, z: q[2] }; };
          const O = proj([0, 0, 0]);
          U.forEach((u, i) => {
            const P = [u[0] * D, u[1] * D, u[2] * D], Q = proj(P);
            const H = i < 2 ? [u[0] * 0.96, u[1] * 0.96, u[2] * 0.96] : [u[0] * (D - 0.96), u[1] * (D - 0.96), u[2] * (D - 0.96)];
            items.push({ kind: 'bond', a: O, b: Q, z: (O.z + Q.z) / 2, H: proj(H), donor: i < 2 });
            items.push({ kind: 'O', p: Q, z: Q.z, r: 0.42 * sc * 1.6 });
            if (V.second) U.forEach((w, k) => {
              if (k === i) return;
              const R = proj([P[0] - w[0] * D, P[1] - w[1] * D, P[2] - w[2] * D]);
              items.push({ kind: 'link', a: Q, b: R, z: (Q.z + R.z) / 2 });
              items.push({ kind: 'O2', p: R, z: R.z, r: 0.42 * sc * 1.1 });
            });
          });
          items.push({ kind: 'O', p: O, z: O.z, r: 0.42 * sc * 2.1, centre: true });
          items.sort((a, b) => a.z - b.z);
          for (const it of items) {
            if (it.kind === 'link') { c.strokeStyle = C.faint; c.lineWidth = 1; c.globalAlpha = 0.55; c.beginPath(); c.moveTo(it.a.x, it.a.y); c.lineTo(it.b.x, it.b.y); c.stroke(); c.globalAlpha = 1; }
            else if (it.kind === 'bond') {
              c.strokeStyle = C.accent; c.lineWidth = 2.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(it.a.x, it.a.y); c.lineTo(it.b.x, it.b.y); c.stroke(); c.setLineDash([]);
              kit.dot(c, it.H.x, it.H.y, 0.26 * sc * 1.5, '#e9eef3', '#8a949e');
            } else if (it.kind === 'O2') kit.dot(c, it.p.x, it.p.y, it.r, 'rgba(232,80,58,0.35)', C.faint);
            else kit.dot(c, it.p.x, it.p.y, it.r, it.centre ? '#e8503a' : '#e8706a', C.text);
          }
          kit.label(c, '109.5° between any two bonds', 14, 18, { size: 12, color: C.muted });
          kit.label(c, '2.8 Å', cx + 8, cy + Hh * 0.2, { size: 12, color: C.accent });
          ro.set('a', V.second ? '4 first + 12 second' : '4 (two donated, two received)');
          ro.set('b', D.toFixed(1) + ' Å (first), ' + (D * Math.sqrt(8 / 3)).toFixed(2) + ' Å (second)');
          ro.set('c', (Math.acos(-1 / 3) * 180 / Math.PI).toFixed(2) + '°');
          ro.set('d', '12 molecules at 4.57 Å — the second peak of the liquid');
          ro.set('e', nT.toFixed(2) + ' of 4');
          ro.set('f', '—'); ro.set('g', '—'); ro.set('h', '—');
        } else {
          if (dirty || comp == null || Math.abs(pT - (lastP || -1)) > 1e-9) { cluster(pT); lastP = pT; dirty = false; }
          const cell = Math.min(Wd, Hh) * 0.125;
          const proj = P => { const q = rot([(P[0] / 4 - N / 2) * cell, (P[1] / 4 - N / 2) * cell, (P[2] / 4 - N / 2) * cell], ang, tilt); return [cx + q[0], cy - q[1]]; };
          const pts = sites.map(proj);
          c.lineWidth = 1.5;
          for (const b of bonds) {
            if (!b.on) continue;
            c.strokeStyle = comp[b.i] && comp[b.j] ? C.accent : C.warn; c.globalAlpha = 0.85;
            c.beginPath(); c.moveTo(pts[b.i][0], pts[b.i][1]); c.lineTo(pts[b.j][0], pts[b.j][1]); c.stroke();
          }
          c.globalAlpha = 1;
          for (let i = 0; i < sites.length; i++) { c.fillStyle = comp[i] ? '#e8706a' : C.warn; c.beginPath(); c.arc(pts[i][0], pts[i][1], 2.2, 0, TAU); c.fill(); }
          kit.label(c, 'a diamond-type net of ' + sites.length + ' molecules; broken bonds not drawn', 14, 18, { size: 12, color: C.muted });
          ro.set('a', '4 per molecule in the perfect net');
          ro.set('b', '—'); ro.set('c', '—'); ro.set('d', '—');
          ro.set('e', nT.toFixed(2) + ' of 4 at ' + V.T + ' °C');
          ro.set('f', (100 * pT).toFixed(0) + ' % (the net falls apart near 39 %)');
          ro.set('g', (100 * big).toFixed(0) + ' % of the molecules');
          ro.set('h', (100 * alone).toFixed(1) + ' %');
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bonds that flicker */
  /* The 2-D network is a toy: its time axis is calibrated, not simulated. The model measures how long its bonds stay on average
     (in seconds of screen time); the engine says how long a real bond lasts at this temperature (hbondLifetime); the ratio
     is the picoseconds per screen second used on the timeline. */
  Hyper.sim('hb-flicker', {
    title: 'One bond, followed through the flicker',
    blurb: `Above: molecules jostling in a box, with their hydrogen bonds dashed. The two ringed molecules are the pair being followed; the strip below is the history of the bond between them — blue while it holds, empty while it is broken. It is on, off, on, off, with new partners in between. Below that: the *memory* of a bond, the chance that a bond present at time zero is still intact later — the fast wobble of the first 300 femtoseconds, then the slow loss of the pattern over about a picosecond.

The time axis is **schematic**: the toy network is stretched so that its average bond lives as long as the measured lifetime at this temperature.

**Try this**
- Warm it up: the strip fills with more and shorter gaps, and the memory curve falls faster.
- Cool it to −20 °C: bonds hold twice as long.
- *Follow another bond* picks a new pair; some are on for most of the window, some hardly at all.
- Look at the memory curve's wiggle: the 170 fs period is the bond acting as a spring, stretching and recompressing before it lets go.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 360 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'time (ps)', min: 0, max: 3 }, y: { label: 'memory of the bond', min: -0.1, max: 1.05 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: -20, max: 90, step: 1, value: params.T != null ? params.T : 25, unit: '°C' },
        { id: 'n', label: 'Molecules', min: 20, max: 50, step: 1, value: 40 },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'follow', label: 'Follow another bond', primary: true }, { id: 'shake', label: 'Shuffle' }] }
      ], (id) => {
        if (id === 'n' || id === 'shake') { net = null; }
        if (id === 'follow') pickNext = true;
        memory();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['now', 'Bonds on screen (toy)'], ['eng', 'Bonds per molecule (measured trend)'], ['life', 'Bond lifetime'], ['rate', 'Rearrangements per bond per second'], ['osc', 'Period of the bond as a spring'], ['trk', 'The followed bond'], ['scale', 'One second on screen']]);
      let net = null, sc = 18, pickNext = true, track = null, hist = [], tsim = 0, tauScr = 0.6, born = new Map(), acc = 0, cnt = 0, nowBonds = 0, Xps = 1;
      function memory() {
        const tau = W.hbondLifetime(V.T) * 1e12, To = W.HBOND.oscillation * 1e12;
        const pts = [], pure = [];
        for (let i = 0; i <= 300; i++) {
          const t = i * 0.01;
          pure.push([t, Math.exp(-t / tau)]);
          pts.push([t, 0.32 * Math.exp(-t / 0.13) * Math.cos(TAU * t / To) + 0.68 * Math.exp(-t / tau)]);
        }
        plot.set({ series: [{ pts, label: 'memory of a bond (schematic)', color: kit.colors().accent, width: 2 }, { pts: pure, label: 'slow part alone', color: kit.colors().faint, dash: true }], vlines: [{ x: To, label: '170 fs' }, { x: tau, label: 'lifetime ' + tau.toFixed(2) + ' ps' }] });
      }
      memory();
      const key = (i, j) => (i < j ? i * 100 + j : j * 100 + i);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const nh = Hh * 0.7;
        sc = clamp(Math.sqrt(Wd * nh / V.n / 5), 12, 28);
        if (!net || net.length !== V.n) { net = S.makeNetwork(V.n, Wd, nh, sc, Math.floor(Math.random() * 1e6)); track = null; born = new Map(); hist = []; pickNext = true; }
        const step = Math.min(dt, 0.05) * (V.slow ? 0.75 : 3);       // the toy runs three times faster than the clock so that bonds visibly come and go
        let bonds = [];
        for (let i = 0; i < 6; i++) bonds = S.stepNetwork(net, step / 6, { T: V.T, W: Wd, H: nh, scale: sc });
        tsim += step / 3;
        // bookkeeping: durations of every bond, to calibrate the clock
        const now = new Set(bonds.map(b => key(b[0], b[1])));
        for (const k of now) if (!born.has(k)) born.set(k, tsim);
        for (const [k, t0] of Array.from(born)) if (!now.has(k)) { const d = tsim - t0; if (d > 0.04) tauScr = tauScr * 0.985 + d * 0.015; born.delete(k); }
        Xps = W.hbondLifetime(V.T) * 1e12 / Math.max(0.05, tauScr);
        // the followed pair
        if (pickNext && bonds.length) { const b = bonds[Math.floor(Math.random() * bonds.length)]; track = [b[0], b[1]]; hist = []; pickNext = false; }
        if (track) hist.push([tsim, now.has(key(track[0], track[1]))]);
        while (hist.length && hist[0][0] < tsim - 9) hist.shift();
        // the network
        S.network(c, net, { scale: sc, bonds });
        if (track) for (const i of track) { c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.arc(net[i].x, net[i].y, 0.95 * sc, 0, TAU); c.stroke(); }
        // the timeline
        const ty = nh + 30, th = 26, tx0 = 16, tx1 = Wd - 16;
        kit.label(c, 'the bond between the two ringed molecules, over the last ' + (9 * Xps).toFixed(1) + ' ps', tx0, ty - 12, { size: 11.5, color: C.muted });
        c.fillStyle = C.bg2; c.fillRect(tx0, ty, tx1 - tx0, th);
        c.fillStyle = C.accent;
        for (let i = 0; i < hist.length; i++) {
          if (!hist[i][1]) continue;
          const x0 = tx0 + (hist[i][0] - (tsim - 9)) / 9 * (tx1 - tx0);
          const x1 = i + 1 < hist.length ? tx0 + (hist[i + 1][0] - (tsim - 9)) / 9 * (tx1 - tx0) : tx1;
          c.fillRect(x0, ty, Math.max(1, x1 - x0), th);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(tx0, ty, tx1 - tx0, th);
        for (let k = 0; k <= 3; k++) {
          const x = tx0 + k / 3 * (tx1 - tx0);
          c.beginPath(); c.moveTo(x, ty + th); c.lineTo(x, ty + th + 4); c.stroke();
          kit.label(c, '−' + (9 * Xps * (1 - k / 3)).toFixed(1) + (k === 3 ? ' ps (now)' : ''), x, ty + th + 6, { size: 10.5, color: C.muted, align: k === 3 ? 'right' : k === 0 ? 'left' : 'center', baseline: 'top' });
        }
        // readouts
        acc += bonds.length; cnt++;
        if (cnt >= 12) { nowBonds = acc / cnt / V.n; acc = 0; cnt = 0; }
        const tau = W.hbondLifetime(V.T);
        ro.set('now', nowBonds ? nowBonds.toFixed(2) + ' per molecule (a 2-D toy)' : '…');
        ro.set('eng', W.hbondsPerMolecule(V.T).toFixed(2) + ' of 4');
        ro.set('life', (tau * 1e12).toFixed(2) + ' ps');
        ro.set('rate', (1 / tau).toExponential(1).replace('e+', ' × 10^') + ' per second');
        ro.set('osc', (W.HBOND.oscillation * 1e15).toFixed(0) + ' fs');
        ro.set('trk', track ? (hist.length && hist[hist.length - 1][1] ? 'bonded now' : 'broken now') : 'none yet');
        ro.set('scale', '≈ ' + Xps.toFixed(2) + ' ps');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ cooperativity */
  /* A local model: the dimer is worth 21 kJ/mol (De, ab initio); each flanking bond adds 9.5 % to a bond in an open chain
     (interior bond 25 kJ/mol); rings of 3, 4, 5 use approximate ab initio values per bond (22, 28.7, 30 kJ/mol). The molecular dipole
     grows by 0.27 D for each bond a molecule takes part in (1.85 D alone, about 2.9 D with four bonds, as in the liquid). */
  Hyper.sim('hb-cooperativity', {
    title: 'Each bond helps the next',
    blurb: `A short chain of water molecules, each tilted so that one of its hydrogens points at the oxygen of the next. The dashed lines are thicker the stronger the bond, and the number is its energy in kJ/mol. Under each molecule the bar is its dipole moment. A lone pair of molecules (the dimer) is bonded at about 21 kJ/mol; as the chain grows, each bond is strengthened by its neighbours — an oxygen that is already receiving one bond is more willing to give its hydrogens, and the other way round.

The increments are a **schematic** model fitted to the order of magnitude of ab initio calculations on water clusters (dimer 21 kJ/mol, long chains about 25, small rings 22–30).

**Try this**
- Step from 2 to 10 molecules: the end bonds stay weaker, the middle ones reach 25, the average climbs.
- Switch to a *ring*: nothing is at an end any more, and four or five molecules reach about 30 kJ/mol per bond.
- Read the bars: a molecule with two neighbours is about 30 % more polar than one alone, and with four bonds, as in the liquid, it is about 60 % more polar than in the gas.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'molecules in the chain', min: 2, max: 12 }, y: { label: 'mean energy per bond (kJ/mol)', min: 18, max: 32 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Molecules', min: 2, max: 10, step: 1, value: params.n || 5 },
        { id: 'shape', type: 'select', label: 'Arrangement', options: [['Open chain', 'chain'], ['Ring (3 to 5 molecules)', 'ring']], value: params.shape === 'ring' ? 'ring' : 'chain' },
        { id: 'dip', type: 'check', label: 'Show the dipole of each molecule', value: true }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['end', 'A bond at the end of the chain'], ['mid', 'A bond in the middle'], ['mean', 'Mean per bond'], ['tot', 'Total'], ['add', 'If every bond stayed at 21 kJ/mol'], ['gain', 'Cooperative gain'], ['mu', 'Mean dipole per molecule'], ['liq', 'A molecule in the liquid (3.7 bonds)']]);
      const E2 = 21, BOOST = 0.095, RING = { 3: 22, 4: 28.7, 5: 30 }, MU0 = W.HBOND.dipole, DMU = 0.27;
      function model(n, ring) {
        if (ring) { n = clamp(n, 3, 5); return { n, E: Array(n).fill(RING[n]), nb: Array(n).fill(2) }; }
        const E = [], nb = Array(n).fill(2); nb[0] = 1; nb[n - 1] = 1;
        for (let i = 0; i < n - 1; i++) E.push(E2 * (1 + BOOST * ((i > 0 ? 1 : 0) + (i < n - 2 ? 1 : 0))));
        return { n, E, nb };
      }
      const avg = a => a.reduce((s, v) => s + v, 0) / a.length;
      {
        const ch = [], rg = [];
        for (let n = 2; n <= 12; n++) ch.push([n, avg(model(n, false).E)]);
        for (let n = 3; n <= 5; n++) rg.push([n, avg(model(n, true).E)]);
        const C = kit.colors();
        plot.set({ series: [{ pts: ch, label: 'open chain', color: C.accent, width: 2, dots: 3 }, { pts: rg, label: 'ring', color: C.warn, line: false, dots: 5 }], hlines: [{ y: 21, label: 'isolated pair 21' }, { y: 25, label: 'long chain 25' }] });
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const ring = V.shape === 'ring', M = model(V.n, ring), n = M.n;
        const al = ring ? 0 : 0.5236, dx = 2.8 * Math.cos(al);
        const R = ring ? 2.8 / (2 * Math.sin(Math.PI / n)) : 0;
        const sc = ring ? Math.min(24, Hh * 0.2 / R) : Math.min(24, (Wd - 90) / (dx * (n - 1) + 2.5));
        const cx = Wd / 2, cy = ring ? Hh * 0.27 : Hh * 0.2;
        const P = [];
        for (let i = 0; i < n; i++) {
          if (ring) { const th = i / n * TAU - Math.PI / 2; P.push([cx + R * sc * Math.cos(th), cy + R * sc * Math.sin(th)]); }
          else P.push([cx + (i - (n - 1) / 2) * dx * sc, cy + (i % 2 ? 1 : -1) * 1.4 * Math.sin(al) * sc]);
        }
        const nxt = i => (i + 1 < n ? i + 1 : ring ? 0 : -1);
        const phi = i => { const j = nxt(i); return j < 0 ? (i > 0 ? Math.atan2(P[i][1] - P[i - 1][1], P[i][0] - P[i - 1][0]) : 0) : Math.atan2(P[j][1] - P[i][1], P[j][0] - P[i][0]); };
        const HALF = 104.45 / 2 * Math.PI / 180;
        for (let i = 0; i < n; i++) {
          const j = nxt(i);
          if (j >= 0 && (ring || i < n - 1)) {
            const e = M.E[i];
            const hx = P[i][0] + 0.96 * sc * Math.cos(phi(i)), hy = P[i][1] + 0.96 * sc * Math.sin(phi(i));
            S.hbond(c, hx, hy, P[j][0], P[j][1], { color: C.accent, width: 0.5 + 0.09 * e, alpha: 0.9 });
            const lx = (hx + P[j][0]) / 2 + (ring ? (P[i][0] - cx) * 0.18 : 0), ly = (hy + P[j][1]) / 2 + (ring ? (P[i][1] - cy) * 0.18 : (i % 2 ? 20 : -20));
            kit.label(c, e.toFixed(1), lx, ly, { size: 11, color: C.accent, align: 'center', baseline: 'middle', weight: 600 });
          }
        }
        for (let i = 0; i < n; i++) {
          const a = phi(i) + HALF;
          S.molecule(c, P[i][0], P[i][1], { angle: a, scale: sc });
        }
        // dipoles
        if (V.dip) {
          const by = Hh - 34, hmax = Hh * 0.2, bw = Math.min(22, (Wd - 60) / (n * 1.8));
          const gy = by - MU0 / 3.4 * hmax, ly = by - 2.9 / 3.4 * hmax;
          c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1;
          c.beginPath(); c.moveTo(20, gy); c.lineTo(Wd - 20, gy); c.moveTo(20, ly); c.lineTo(Wd - 20, ly); c.stroke(); c.setLineDash([]);
          kit.label(c, 'gas 1.85 D', 22, gy + 3, { size: 10.5, color: C.muted, baseline: 'top' });
          kit.label(c, 'liquid ≈ 2.9 D', 22, ly - 3, { size: 10.5, color: C.muted, baseline: 'bottom' });
          for (let i = 0; i < n; i++) {
            const mu = MU0 + DMU * M.nb[i], x = ring ? cx + (i - (n - 1) / 2) * Math.min(60, (Wd - 120) / n) : P[i][0];
            c.fillStyle = C.warn; c.fillRect(x - bw / 2, by - mu / 3.4 * hmax, bw, mu / 3.4 * hmax);
            kit.label(c, mu.toFixed(2), x, by + 4, { size: 10.5, color: C.text, align: 'center', baseline: 'top' });
          }
        }
        const tot = M.E.reduce((s, v) => s + v, 0), add = E2 * M.E.length;
        ro.set('end', ring ? 'no ends in a ring' : M.E[0].toFixed(1) + ' kJ/mol');
        ro.set('mid', M.E[Math.floor(M.E.length / 2)].toFixed(1) + ' kJ/mol');
        ro.set('mean', avg(M.E).toFixed(1) + ' kJ/mol');
        ro.set('tot', tot.toFixed(0) + ' kJ/mol (' + M.E.length + ' bond' + (M.E.length > 1 ? 's' : '') + ')');
        ro.set('add', add.toFixed(0) + ' kJ/mol');
        ro.set('gain', '+' + (100 * (tot / add - 1)).toFixed(0) + ' %');
        ro.set('mu', avg(M.nb.map(b => MU0 + DMU * b)).toFixed(2) + ' D');
        ro.set('liq', (MU0 + DMU * W.hbondsPerMolecule(25)).toFixed(2) + ' D');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the structure of the liquid: g(r) */
  /* The curve is a schematic g_OO(r) assembled from Gaussians to have the published features of liquid water at 25 °C: a first peak
     near 2.8 Å about 2.8 high, a first minimum near 3.4 Å just under 0.85, a second peak near 4.5 Å about 1.1, then ripples dying
     to 1; the heights fall slowly with temperature. It integrates to about 4.3 neighbours to the first minimum. The histogram is the
     2-D toy network's own pair distances, in units of its bond length scaled to 2.8 Å, divided by what random points in the same box
     would give. */
  function gOO(r, T) {
    const core = 1 / (1 + Math.exp(-(r - 2.58) / 0.055));
    const a1 = 1.85 * (1 - 0.0030 * (T - 25)), a2 = 0.14 * (1 - 0.012 * (T - 25));
    const gs = (r0, w) => Math.exp(-Math.pow((r - r0) / w, 2));
    return Math.max(0, core * (1 + a1 * gs(2.80, 0.165) - 0.20 * gs(3.45, 0.38) + a2 * gs(4.50, 0.50) - 0.07 * gs(5.7, 0.5) + 0.035 * gs(6.9, 0.5)));
  }

  Hyper.sim('hb-rdf', {
    title: 'Where the neighbours are: g(r)',
    blurb: `Pick one oxygen in liquid water and ask how much more (or less) likely than chance you are to find another oxygen at distance *r*. The answer, g(r), is the curve: nothing closer than 2.5 Å, a tall peak at **2.8 Å** (the hydrogen-bonded neighbours), a dip at 3.4 Å (the empty space between the shells), a low second hump at **4.5 Å** (the neighbours of the neighbours, placed by the tetrahedral angle), and then a rapid loss of order. By 8 Å the liquid has forgotten where you stood. The blue curve is **schematic**, built to the published shape.

Under the blue curve, in orange, is a histogram built from the toy network above it — flat discs with a pull between bonded partners. It is crude, but it shows where such a first peak comes from: pairs held at one distance by a bond. Its distances are scaled so that its bond length equals 2.8 Å.

**Try this**
- Cool the water: the first peak sharpens and grows, the second hump grows with it — more order at both ranges.
- Tick *ice Ih lines* and compare: ice has its neighbours on exactly those distances and none between.
- Read the *neighbours within the first minimum*: about 4.3, not the 12 of a liquid of close-packed spheres.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230, maxH: 310 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'distance r (Å)', min: 2, max: 8 }, y: { label: 'g(r)', min: 0, max: 3.2 }, legend: true }, 240);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: -20, max: 90, step: 1, value: params.T != null ? params.T : 25, unit: '°C' },
        { id: 'n', label: 'Molecules in the toy', min: 14, max: 40, step: 1, value: 34 },
        { id: 'over', type: 'check', label: 'Overlay the toy network’s histogram', value: true },
        { id: 'ice', type: 'check', label: 'Mark the ice Ih distances', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Restart the histogram', primary: true }] }
      ], (id) => { if (id === 'n' || id === 'reset') { net = null; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p1', 'First peak'], ['m1', 'First minimum'], ['p2', 'Second peak'], ['cn', 'Neighbours within the first minimum'], ['model', 'Toy network: frames averaged']]);
      const NB = 150, BW = 0.04, R2A = 1.556;             // bins of width 0.04 bond lengths up to 6; 1 bond length (1.8 scale units) = 2.8 Å
      let net = null, sc = 14, hist = new Float64Array(NB), ideal = new Float64Array(NB), pairs = 0, frames = 0, bw = 0, bh = 0;
      function makeIdeal(Wd, Hh, n) {
        ideal = new Float64Array(NB);
        let k = 0;
        for (let i = 0; i < 40000; i++) {
          const d = Math.hypot((Math.random() - Math.random()) * Wd, (Math.random() - Math.random()) * Hh) / sc, b = Math.floor(d / BW);
          if (b < NB) ideal[b]++; k++;
        }
        for (let b = 0; b < NB; b++) ideal[b] /= k;
      }
      function peaks(T) {
        let p1 = [0, 0], m1 = [0, 9], p2 = [0, 0];
        for (let r = 2.4; r <= 3.2; r += 0.01) { const g = gOO(r, T); if (g > p1[1]) p1 = [r, g]; }
        for (let r = p1[0]; r <= 4.0; r += 0.01) { const g = gOO(r, T); if (g < m1[1]) m1 = [r, g]; }
        for (let r = m1[0]; r <= 5.4; r += 0.01) { const g = gOO(r, T); if (g > p2[1]) p2 = [r, g]; }
        return { p1, m1, p2 };
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        sc = clamp(Math.sqrt(Wd * Hh / V.n / 5), 10, 30);       // dense enough that the toy has shells
        if (!net || net.length !== V.n || Math.abs(Wd - bw) > 1 || Math.abs(Hh - bh) > 1) {
          net = S.makeNetwork(V.n, Wd, Hh, sc, Math.floor(Math.random() * 1e6)); hist = new Float64Array(NB); pairs = 0; frames = 0; bw = Wd; bh = Hh; makeIdeal(Wd, Hh, V.n);
        }
        let bonds = [];
        for (let i = 0; i < 3; i++) bonds = S.stepNetwork(net, Math.min(dt, 0.05) / 3, { T: V.T, W: Wd, H: Hh, scale: sc });
        {
          for (let i = 0; i < net.length; i++) for (let j = i + 1; j < net.length; j++) {
            const b = Math.floor(Math.hypot(net[i].x - net[j].x, net[i].y - net[j].y) / sc / BW);
            if (b < NB) hist[b]++; pairs++;
          }
          frames++;
        }
        S.network(c, net, { scale: sc, bonds });
        kit.label(c, 'the toy network (flat, 2-D)', 10, 14, { size: 11, color: C.muted });
        // curves
        const th = [];
        for (let r = 2.0; r <= 8.001; r += 0.04) th.push([r, gOO(r, V.T)]);
        const series = [{ pts: th, label: 'g(r), schematic water at ' + V.T + ' °C', color: C.accent, width: 2.2 }];
        if (V.over && pairs > 0) {
          const mo = [];
          for (let b = 2; b < NB - 2; b++) {
            let hh = 0, ii = 0; for (let k = -1; k <= 1; k++) { hh += hist[b + k]; ii += ideal[b + k]; }
            const r = (b + 0.5) * BW * R2A;
            if (r < 2.0 || r > 8) continue;
            if (ii > 0 && hh > 0) mo.push([r, (hh / pairs) / (ii / 1)]);
          }
          series.push({ pts: mo, label: 'toy network histogram', color: C.warn, width: 1.4, dots: 1.6 });
        }
        plot.set({ series, vlines: V.ice ? [{ x: 2.76, label: 'ice 2.76' }, { x: 4.5, label: 'ice 4.5' }] : [], hlines: [{ y: 1, label: 'no structure' }] });
        const pk = peaks(V.T), rho = W.moleculesPerLitre(V.T) / 1e27;
        let nn = 0; for (let r = 0.005; r < pk.m1[0]; r += 0.01) nn += 4 * Math.PI * rho * gOO(r, V.T) * r * r * 0.01;
        ro.set('p1', pk.p1[0].toFixed(2) + ' Å, g = ' + pk.p1[1].toFixed(2));
        ro.set('m1', pk.m1[0].toFixed(2) + ' Å, g = ' + pk.m1[1].toFixed(2));
        ro.set('p2', pk.p2[0].toFixed(2) + ' Å, g = ' + pk.p2[1].toFixed(2));
        ro.set('cn', nn.toFixed(1));
        ro.set('model', String(frames));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the proton hops */
  /* Grotthuss hopping drawn as an animation. Timings are schematic but of the right order: a hop takes about 1.5 ps in all, of which
     most is the wait for the next water to turn into the right position and a few tenths of a picosecond is the transfer itself.
     Ionic mobilities are the limiting values in water at 25 °C. */
  Hyper.sim('hb-grotthuss', {
    title: 'The bucket brigade',
    blurb: `A row of water molecules joined by hydrogen bonds. An extra proton (H⁺) starts on the left, making a hydronium ion, H₃O⁺. Watch what moves. The proton in the bond to the neighbour slides across and the *neighbour* becomes the hydronium; then the next hydrogen slides across, and so on. Each hydrogen travels only about half an ångström, but the **charge** advances 2.5 Å at every hop. Behind the front the hydrogens are left pointing the wrong way; the chain has to turn them back before another proton can follow.

In between hops the proton is shared: a hydronium bonded to three waters is an **Eigen** ion, H₉O₄⁺; midway through a hop the proton is shared equally by two oxygens, the **Zundel** ion H₅O₂⁺.

Underneath, a race: in an electric field the proton arrives long before an ordinary ion of similar size, because an ion has to drag its shell of water through the liquid, and the proton only passes its charge along.

**Try this**
- Slow it to 0.1 ps per second and watch the proton shared between two oxygens in the middle of a hop.
- Choose *hydroxide* in the race: it also travels fast, by the mirror trick (a proton hops *into* the ion).
- Choose *lithium*: the smallest ion is the slowest, because it carries the largest shell of water.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.68, minH: 360 });
      const IONS = [['Sodium, Na⁺ (5.2)', 'Na'], ['Potassium, K⁺ (7.6)', 'K'], ['Lithium, Li⁺ (4.0)', 'Li'], ['Chloride, Cl⁻ (7.9)', 'Cl'], ['Hydroxide, OH⁻ (20.6)', 'OH']];
      const MU = { H: 36.2e-8, Na: 5.19e-8, K: 7.62e-8, Li: 4.01e-8, Cl: 7.91e-8, OH: 20.6e-8 };   // m²/(V·s), limiting values at 25 °C
      const NAMEOF = { Na: 'Na⁺', K: 'K⁺', Li: 'Li⁺', Cl: 'Cl⁻', OH: 'OH⁻' };
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Screen speed (picoseconds per second)', min: 0.05, max: 2, step: 0.05, value: 0.5, log: true, sig: 2 },
        { id: 'race', type: 'check', label: 'Race an ion in an electric field', value: true },
        { id: 'ion', type: 'select', label: 'The other ion', options: IONS, value: params.ion && MU[params.ion] ? params.ion : 'Na' },
        { id: 'E', label: 'Field', min: 10, max: 1000, step: 1, value: 100, log: true, sig: 3, unit: 'V/cm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Send a proton', primary: true }] }
      ], (id) => { if (id === 'go') reset(); if (id === 'ion' || id === 'E' || id === 'race') tr = 0; ctl.show('ion', V.race); ctl.show('E', V.race); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['hop', 'Hops completed'], ['t', 'Time since the proton was added'], ['state', 'The ion now'], ['mu', 'Mobility of H⁺'], ['mu2', 'Mobility of the other ion'], ['v', 'Drift speed of H⁺ in this field'], ['v2', 'Drift speed of the other ion'], ['ratio', 'H⁺ is faster by']]);
      const N = 7, HALF = 104.45 / 2 * Math.PI / 180;
      let k = 0, f = new Array(N - 1).fill(0), tpsPhase = 0, waitDur = 1.2, phase = 'wait', total = 0, doneHold = 0, tr = 0;
      const HOP = 0.3;
      function reset() { k = 0; f = new Array(N - 1).fill(0); tpsPhase = 0; waitDur = 0.9 + 0.8 * Math.random(); phase = 'wait'; total = 0; doneHold = 0; }
      reset();
      ctl.show('ion', V.race); ctl.show('E', V.race);
      const smooth = x => x * x * (3 - 2 * x);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const dtps = Math.min(dt, 0.05) * V.rate;
        if (phase !== 'done') {
          total += dtps; tpsPhase += dtps;
          if (phase === 'wait' && tpsPhase >= waitDur) { phase = 'hop'; tpsPhase = 0; }
          else if (phase === 'hop') {
            f[k] = smooth(clamp(tpsPhase / HOP, 0, 1));
            if (tpsPhase >= HOP) { f[k] = 1; k++; tpsPhase = 0; waitDur = 0.9 + 0.8 * Math.random(); phase = k >= N - 1 ? 'done' : 'wait'; }
          }
        } else { doneHold += dt; if (doneHold > 2.5) reset(); }
        // the chain
        const rowY = V.race ? Hh * 0.3 : Hh * 0.46, s = Math.min(80, (Wd - 90) / (N - 1)), sc = s / 2.5, x0 = (Wd - s * (N - 1)) / 2;
        const X = i => x0 + i * s;
        // excess charge position
        let cxp = X(k), label = 'H₃O⁺ (Eigen)';
        if (phase === 'hop') { const g = f[k]; cxp = X(k) + g * s; label = g > 0.25 && g < 0.75 ? 'H₅O₂⁺ (Zundel)' : 'H₃O⁺ (Eigen)'; }
        else if (phase === 'done') cxp = X(N - 1);
        const glow = c.createRadialGradient ? c.createRadialGradient(cxp, rowY, 2, cxp, rowY, 1.9 * sc) : null;
        if (glow && glow.addColorStop) { glow.addColorStop(0, 'rgba(255,170,60,0.55)'); glow.addColorStop(1, 'rgba(255,170,60,0)'); c.fillStyle = glow; c.beginPath(); c.arc(cxp, rowY, 1.9 * sc, 0, TAU); c.fill(); }
        kit.label(c, '+ ' + label, cxp, rowY - 3.4 * sc, { size: 12, color: C.warn, align: 'center', weight: 650 });
        // bonds then atoms
        for (let i = 0; i < N - 1; i++) {
          const bx = X(i) + (0.40 + 0.20 * f[i] + (phase === 'wait' && i === k ? 0.02 * Math.sin(total * 40) : 0)) * s;
          const near = f[i] < 0.5 ? i : i + 1, far = near === i ? i + 1 : i;
          c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 0.14 * sc); c.lineCap = 'round';
          const zun = f[i] > 0.3 && f[i] < 0.7;
          if (zun) { c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(i), rowY); c.lineTo(bx, rowY); c.moveTo(X(i + 1), rowY); c.lineTo(bx, rowY); c.stroke(); c.setLineDash([]); }
          else {
            c.beginPath(); c.moveTo(X(near), rowY); c.lineTo(bx, rowY); c.stroke();
            S.hbond(c, bx, rowY, X(far), rowY, { color: C.accent, width: 1.8, alpha: 0.85 });
          }
          kit.dot(c, bx, rowY, 0.26 * sc * 1.15, '#e9eef3', '#8a949e');
        }
        for (let i = 0; i < N; i++) {
          const offs = i === 0 ? [Math.PI / 2 + 0.95, Math.PI / 2 - 0.95] : [Math.PI / 2 + 0.95];
          c.strokeStyle = C.muted; c.lineWidth = Math.max(2, 0.14 * sc);
          for (const a of offs) {
            const hx = X(i) + 0.96 * sc * Math.cos(a), hy = rowY + 0.96 * sc * Math.sin(a);
            c.beginPath(); c.moveTo(X(i), rowY); c.lineTo(hx, hy); c.stroke();
            kit.dot(c, hx, hy, 0.26 * sc * 1.15, '#e9eef3', '#8a949e');
          }
          kit.dot(c, X(i), rowY, 0.42 * sc * 1.1, '#e8503a', C.text);
        }
        kit.label(c, 'the extra proton advances 2.5 Å per hop; each hydrogen moves about 0.5 Å', Wd / 2, rowY + 2.3 * sc, { size: 11.5, color: C.muted, align: 'center' });
        // the race
        const E = V.E * 100, vH = MU.H * E, vX = MU[V.ion] * E;
        if (V.race) {
          tr += Math.min(dt, 0.05);
          const lane = (y, name, dist, colr, shell) => {
            const l0 = 70, l1 = Wd - 30;
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(l0, y); c.lineTo(l1, y); c.stroke();
            kit.label(c, name, 10, y - 14, { size: 11.5, color: C.text, weight: 600 });
            const p = clamp(dist / 5e-3, 0, 1);
            const x = l0 + p * (l1 - l0);
            if (shell) { c.strokeStyle = 'rgba(120,170,255,0.8)'; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.arc(x, y, 13, 0, TAU); c.stroke(); c.setLineDash([]); }
            kit.dot(c, x, y, 5.5, colr, C.text);
            c.strokeStyle = C.warn; c.beginPath(); c.moveTo(l1, y - 8); c.lineTo(l1, y + 8); c.stroke();
          };
          const tReal = tr * 0.5;
          const y1 = Hh * 0.66, y2 = Hh * 0.84;
          kit.label(c, 'the race: 5 mm in a field of ' + V.E.toFixed(0) + ' V/cm (clock ' + tReal.toFixed(1) + ' s, 1 screen second = 0.5 s)', 10, Hh * 0.5, { size: 11.5, color: C.muted });
          lane(y1, 'H⁺ (hops through the water)', vH * tReal, C.warn, false);
          lane(y2, NAMEOF[V.ion] + ' (carries its water shell)', vX * tReal, C.accent, true);
          if (tReal > Math.min(5e-3 / vX, 20) + 1.5) tr = 0;
        }
        ro.set('hop', k + ' of ' + (N - 1));
        ro.set('t', total.toFixed(1) + ' ps');
        ro.set('state', phase === 'hop' ? (f[k] > 0.25 && f[k] < 0.75 ? 'Zundel, H₅O₂⁺' : 'Eigen, H₉O₄⁺') : phase === 'done' ? 'arrived at the last water' : 'Eigen, H₉O₄⁺ (waiting for a bond to turn)');
        ro.set('mu', (MU.H * 1e8).toFixed(1) + ' × 10⁻⁸ m²/(V·s)');
        ro.set('mu2', (MU[V.ion] * 1e8).toFixed(1) + ' × 10⁻⁸ m²/(V·s)');
        ro.set('v', (vH * 1e3).toFixed(2) + ' mm/s');
        ro.set('v2', (vX * 1e3).toFixed(2) + ' mm/s');
        ro.set('ratio', (MU.H / MU[V.ion]).toFixed(1) + ' ×');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ seeing the bonds: the O–H stretch band */
  /* Schematic band shapes built from Gaussians at the measured band positions: vapour lines at 3657 and 3756 cm⁻¹; ice Ih about
     3220 cm⁻¹ with shoulders; liquid a broad band near 3400 cm⁻¹ made of populations of more and less strongly bonded O–H groups whose
     weights shift with temperature. */
  Hyper.sim('hb-spectrum', {
    title: 'The O–H stretch: a ruler for the hydrogen bond',
    blurb: `The O–H bond inside a water molecule vibrates like a spring, and the infrared light it absorbs says how stiff the spring is. A free O–H in the vapour absorbs sharply near 3,700 cm⁻¹ (a wavelength of 2.7 µm). Bond the hydrogen to a neighbour and the O–H is pulled out and softened: it absorbs at a lower wavenumber, and because every molecule feels a slightly different neighbourhood the line spreads into a broad band. Ice, with the strongest, most regular bonds, lies lowest, near 3,220 cm⁻¹.

The animation shows the vibration slowed down by about a hundred trillion times. The band shapes are **schematic**, drawn at the measured positions.

**Try this**
- Compare the three phases with *overlay*: the peak walks from 3,700 down to 3,200 as the bonds tighten.
- Warm the liquid: the band moves up and the high-wavenumber shoulder grows as more O–H groups lose their partner.
- Read the *spring stiffness* line: even in ice the O–H is only about 23 % softer than a free one — the hydrogen bond is a small push on a strong bond.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 200 });
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const plot = kit.plot(graph, { x: { label: 'wavenumber (cm⁻¹)', min: 2800, max: 3900, reverse: true }, y: { label: 'absorption (scaled)', min: 0, max: 1.15 }, legend: true }, 250);
      const ctl = kit.controls(box.side, [
        { id: 'ph', type: 'select', label: 'Water as', options: [['Liquid', 'liq'], ['Ice Ih', 'ice'], ['Vapour', 'gas']], value: ['liq', 'ice', 'gas'].includes(params.ph) ? params.ph : 'liq' },
        { id: 'T', label: 'Temperature (liquid)', min: 0, max: 90, step: 1, value: 25, unit: '°C' },
        { id: 'all', type: 'check', label: 'Overlay all three phases', value: false },
        { id: 'parts', type: 'check', label: 'Show the populations that make the liquid band', value: false }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pk', 'Peak'], ['lam', 'Wavelength'], ['thz', 'Frequency'], ['per', 'Period of one vibration'], ['sh', 'Shift from the free O–H (3,657)'], ['k', 'Stiffness of the O–H spring, relative to free'], ['w', 'Width of the band']]);
      const NU0 = 3657;
      const g = (x, m, s) => Math.exp(-0.5 * Math.pow((x - m) / s, 2));
      function weights(T) { return { s: clamp(0.42 - 0.0025 * (T - 25), 0.2, 0.6), m: 0.40, f: clamp(0.18 + 0.0025 * (T - 25), 0.05, 0.4) }; }
      const comp = {
        liq: (x, T) => { const w = weights(T); return 0.0 + w.s * g(x, 3235, 125) + w.m * g(x, 3435, 110) + w.f * g(x, 3560, 95); },
        ice: x => 0.70 * g(x, 3235, 80) + 0.30 * g(x, 3150, 55) + 0.22 * g(x, 3340, 75),
        gas: x => 0.5 * g(x, 3657, 7) + 1.0 * g(x, 3756, 7)
      };
      const norm = { liq: Math.max.apply(null, Array.from({ length: 1101 }, (_, i) => comp.liq(2800 + i, 25))), ice: Math.max.apply(null, Array.from({ length: 1101 }, (_, i) => comp.ice(2800 + i))), gas: 1 };
      const curve = (ph, T) => { const pts = []; for (let x = 2800; x <= 3900; x += 4) pts.push([x, (ph === 'liq' ? comp.liq(x, T) : comp[ph](x)) / norm[ph]]); return pts; };
      let phase = 0;
      function peakNu() { if (V.ph === 'gas') return 3756; const pts = curve(V.ph, V.T); let b = pts[0]; for (const p of pts) if (p[1] > b[1]) b = p; return b[0]; }
      function draw() {
        const C = kit.colors(), T = V.T;
        const series = [];
        const names = { liq: 'liquid at ' + T + ' °C', ice: 'ice Ih', gas: 'vapour (rotational lines not drawn)' };
        const cols = { liq: C.accent, ice: C.series[2] || C.ok, gas: C.warn };
        const show = V.all ? ['gas', 'liq', 'ice'] : [V.ph];
        for (const ph of show) series.push({ pts: curve(ph, T), label: names[ph], color: cols[ph], width: ph === V.ph ? 2.4 : 1.6 });
        if (V.parts && (V.ph === 'liq' || V.all)) {
          const w = weights(T), mk = (m, s, a, lab) => { const pts = []; for (let x = 2800; x <= 3900; x += 4) pts.push([x, a * g(x, m, s) / norm.liq]); return { pts, label: lab, color: C.faint, dash: true, width: 1.2 }; };
          series.push(mk(3235, 125, w.s, 'strongly bonded O–H'), mk(3435, 110, w.m, 'intermediate'), mk(3560, 95, w.f, 'weakly bonded or free'));
        }
        plot.set({ series, vlines: [{ x: NU0, color: C.muted, label: 'free O–H 3657' }] });
        // numbers
        const pts = curve(V.ph, T);
        let best = pts[0]; for (const p of pts) if (p[1] > best[1]) best = p;
        const half = best[1] / 2, above = pts.filter(p => p[1] >= half);
        const fw = V.ph === 'gas' ? null : above[above.length - 1][0] - above[0][0];
        const nuPk = peakNu();
        ro.set('pk', nuPk.toFixed(0) + ' cm⁻¹' + (V.ph === 'gas' ? ' (and 3,657)' : ''));
        ro.set('lam', (1e4 / nuPk).toFixed(2) + ' µm');
        ro.set('thz', (nuPk * 100 * 299792458 / 1e12).toFixed(0) + ' THz');
        ro.set('per', (1e15 / (nuPk * 100 * 299792458)).toFixed(1) + ' fs');
        ro.set('sh', V.ph === 'gas' ? '0 cm⁻¹ (the 3,657 line)' : (nuPk - NU0).toFixed(0) + ' cm⁻¹');
        ro.set('k', (V.ph === 'gas' ? 100 : 100 * Math.pow(nuPk / NU0, 2)).toFixed(0) + ' %');
        ro.set('w', fw == null ? 'lines a few cm⁻¹ wide' : '≈ ' + fw.toFixed(0) + ' cm⁻¹ across');
      }
      draw();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const nuPk = peakNu();
        phase += dt * TAU * 1.2 * nuPk / NU0;                    // slowed: the free O–H would take about 0.8 s per vibration
        const u = Math.min(26, Hh / 5) * 1.6, cy = Hh * 0.5, cx = Wd * 0.3;
        const L0 = { gas: 0.957, liq: 0.98, ice: 1.0 }[V.ph];
        const hx = cx + (0.957 + (L0 - 0.957) * 3 + 0.12 * Math.sin(phase)) * u;
        const th = 104.45 * Math.PI / 180, h2x = cx + 0.957 * u * Math.cos(th), h2y = cy - 0.957 * u * Math.sin(th);
        c.strokeStyle = C.muted; c.lineWidth = 3;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(hx, cy); c.moveTo(cx, cy); c.lineTo(h2x, h2y); c.stroke();
        kit.dot(c, h2x, h2y, 0.28 * u, '#e9eef3', '#8a949e');
        kit.dot(c, hx, cy, 0.28 * u, '#e9eef3', '#8a949e');
        kit.dot(c, cx, cy, 0.45 * u, '#e8503a', C.text);
        if (V.ph !== 'gas') {
          const nx = cx + (V.ph === 'ice' ? 2.76 : 2.8) * u;
          kit.wsym.hbond(c, hx + 0.28 * u, cy, nx - 0.45 * u, cy, { color: C.accent, width: 2 });
          kit.dot(c, nx, cy, 0.45 * u, '#e8503a', C.text);
          kit.label(c, 'neighbour', nx, cy + 0.75 * u, { size: 11, color: C.muted, align: 'center' });
        } else kit.label(c, 'no neighbour', cx + 2.4 * u, cy, { size: 11, color: C.muted, align: 'center', baseline: 'middle' });
        kit.label(c, 'O–H bond: ' + (V.ph === 'gas' ? '0.957' : V.ph === 'liq' ? 'about 0.98' : 'about 1.00') + ' Å (change drawn 3× too large)', Wd * 0.55, cy - 14, { size: 11.5, color: C.text });
        kit.label(c, 'vibration slowed about 10¹⁴ times; a stiffer bond runs faster', Wd * 0.55, cy + 6, { size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });
})();
