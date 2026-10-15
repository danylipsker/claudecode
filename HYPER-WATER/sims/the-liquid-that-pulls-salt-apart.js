/* HYPER-WATER · sims/the-liquid-that-pulls-salt-apart.js — simulations of the topic "The liquid that pulls salt apart".
 *   sol-dissolving-crystal   a slice of an NaCl crystal in a liquid of your choosing: water molecules orient (oxygen to Na⁺, hydrogen to Cl⁻),
 *                            ions are peeled from the corners at a rate set by the permittivity; the pair energy against RT
 *   sol-like-dissolves       a beaker of water and a solute from a list: miscible, partly soluble or a separate layer; the alcohol series
 *   sol-hydrophobic          a water network with oil drops: bonds lost at the surface, area and free energy as drops merge
 *   sol-fizzy-bottle         a bottle of dissolved gas: Henry's law, pressure in the sealed bottle, opening it
 *   sol-colligative          a solute in water: freezing and boiling points from the vapour-pressure curves of kit.water
 *   sol-osmosis-utube        a U-tube with a membrane: head, osmotic pressure, applied pressure and reverse osmosis
 *   sol-seawater             what is in sea water, its density, and a salt pan evaporating it
 *   sol-conductivity-ph      conductivity and pH of pure and salty water against temperature
 *   sol-hard-water           a kettle: hardness, scale per boil, scale over the year, soap lost
 * Numbers that kit.water supplies (permittivity, Henry constants, vapour pressures, Kw, densities, osmotic pressure) are read from it; models that are not in the
 * engine (the peeling rate, the osmosis time course, the pan sequence, the bubble stream) are marked "schematic" in the blurb and in a comment.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const rnd = (a, b) => a + Math.random() * (b - a);
  const randn = () => { let u = 0; for (let i = 0; i < 6; i++) u += Math.random(); return (u - 3) / Math.sqrt(0.5); };   // about N(0,1)
  const KE = 8.9875517923e9, QE = 1.602176634e-19, NAV = 6.02214076e23;
  const fmt = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');
  const sig = (v, n) => (Number.isFinite(v) ? Number(v.toPrecision(n)).toString() : '—');
  const logistic = (x) => 1 / (1 + Math.exp(-x));

  /* ================================================================ 1. a crystal pulled apart by water */
  Hyper.sim('sol-dissolving-crystal', {
    title: 'A crystal pulled apart by water',
    blurb: `A slice through a corner of a sodium chloride crystal (violet Na⁺, green Cl⁻, drawn to scale: 2.82 Å between neighbours) in a liquid. Where an ion is exposed, solvent molecules swing their **oxygen** end towards Na⁺ and a **hydrogen** towards Cl⁻. The strip at the top is the attraction between two neighbouring ions *in this liquid*, in units of the thermal energy $RT$: the smaller it is, the sooner a thermal kick frees an ion. (Schematic: the peeling rate is $600\\,e^{-(n+1)E/RT}$ per second of simulated time, with $n$ neighbours left and $E$ the pair energy; the hydration shells are drawn, not computed.)

**Try this**
- In *water* corner ions leave one by one and the crystal is peeled; each free ion wears a shell of six molecules.
- Pick *ethanol* or *acetone*: the pair attraction is 8–10 $RT$ and nothing leaves. In *hexane* and *vacuum* it is 100–200 $RT$.
- Drag the permittivity slider yourself: dissolving switches on abruptly between about 60 and 80.
- Tick the charges to see why the molecules are oriented as they are.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym, C = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330, maxH: 470 });
      const epsOf = id => id === 'vacuum' ? 1 : id === 'water' ? W.dielectric(25) : ((W.LIQUIDS.find(l => l.id === id) || { eps: 1 }).eps);
      const LIQ = [['Water', 'water'], ['Methanol', 'methanol'], ['Ethanol', 'ethanol'], ['Acetone', 'acetone'], ['Hexane (no dipole)', 'hexane'], ['Vacuum', 'vacuum']];
      const SOLUB = { water: '36 g per 100 g', methanol: '1.4 g per 100 g', ethanol: '0.06 g per 100 g', acetone: 'practically none', hexane: 'none', vacuum: '—' };
      const liq0 = LIQ.some(l => l[1] === params.liquid) ? params.liquid : 'water';
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'The liquid', options: LIQ, value: liq0 },
        { id: 'eps', label: 'Relative permittivity ε', min: 1, max: 100, value: epsOf(liq0), log: true, sig: 3 },
        { id: 'speed', label: 'Time speed-up', min: 0.5, max: 10, step: 0.5, value: 3, unit: '×' },
        { id: 'charges', type: 'check', label: 'Show charges on the solvent molecules', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'New crystal', primary: true }, { id: 'stir', label: 'Stir' }] }
      ], (id, v) => {
        if (id === 'liq') ctl.set('eps', epsOf(v), false);
        if (id === 'reset') build();
        if (id === 'stir') for (const b of bulk) { b.vx += rnd(-120, 120); b.vy += rnd(-120, 120); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['free', 'Ions in solution'], ['pair', 'Attraction of two neighbouring ions'], ['rt', 'In units of RT (25 °C)'], ['sol', 'Measured NaCl solubility in this liquid']]);
      const EVAC = NAV * KE * QE * QE / 2.82e-10 / 1000;      // kJ/mol, two unit charges 2.82 Å apart in vacuum
      const DIRS = [[1, 0], [-1, 0], [0, -1], [0, 1]];
      const cols = 7, rows = 5;
      let a = 30, k = 10.6, ox = 0, oy = 0, grid = [], ions = [], bulk = [], rect = { x0: 0, x1: 0, y0: 0 };
      const colNa = C.el('Na').color, colCl = C.el('Cl').color;
      function build() {
        const Wd = st.W, Hh = st.H;
        a = clamp(Wd / 17, 22, 40); k = a / 2.82;
        const rCl = 1.81 * k;
        ox = 34 + rCl; oy = Hh - 26 - rCl - (rows - 1) * a;
        ions = []; grid = [];
        for (let i = 0; i < cols; i++) {
          grid[i] = [];
          for (let j = 0; j < rows; j++) {
            const ion = { i, j, z: (i + j) % 2 ? -1 : 1, x: ox + i * a, y: oy + j * a, free: false, vx: 0, vy: 0, ph: Math.random() * TAU };
            grid[i][j] = ion; ions.push(ion);
          }
        }
        rect = { x0: ox - a * 0.5 - 6, x1: ox + (cols - 1) * a + a * 0.5 + 6, y0: oy - a * 0.5 - 6 };
        bulk = [];
        const nB = clamp(Math.round(Wd * Hh / 7000), 24, 70);
        let guard = 0;
        while (bulk.length < nB && guard++ < 2000) {
          const x = rnd(24, Wd - 24), y = rnd(52, Hh - 24);
          if (x > rect.x0 - 12 && x < rect.x1 + 12 && y > rect.y0 - 12) continue;
          bulk.push({ x, y, a: rnd(0, TAU), vx: 0, vy: 0, va: rnd(-1, 1) });
        }
      }
      build();
      st.onResize(build);
      function exposed(ion) {
        const out = [];
        for (const [dx, dy] of DIRS) {
          const ii = ion.i + dx, jj = ion.j + dy;
          if (jj >= rows) continue;                                   // the floor: the crystal goes on below
          const nb = ii >= 0 && ii < cols && jj >= 0 ? grid[ii][jj] : null;
          if (!nb) out.push([dx, dy]);
        }
        return out;
      }
      function push(p, r, damp) {                                     // keep a particle out of the crystal block
        if (p.x > rect.x0 - r && p.x < rect.x1 + r && p.y > rect.y0 - r) {
          const dl = p.x - (rect.x0 - r), dr = (rect.x1 + r) - p.x, du = p.y - (rect.y0 - r);
          const m = Math.min(dl, dr, du);
          if (m === du) { p.y = rect.y0 - r; if (p.vy > 0) p.vy = -p.vy * damp; }
          else if (m === dl) { p.x = rect.x0 - r; if (p.vx > 0) p.vx = -p.vx * damp; }
          else { p.x = rect.x1 + r; if (p.vx < 0) p.vx = -p.vx * damp; }
        }
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), CL = kit.colors(), Wd = st.W, Hh = st.H;
        const eps = Math.max(1, V.eps), speed = V.speed, polar = eps > 10;
        const Epair = EVAC / eps, e = Epair * 1000 / (W.R * 298.15);
        const h = Math.min(dt, 0.05) * speed;
        /* peel the crystal */
        for (const ion of ions) {
          if (ion.free) continue;
          const ex = exposed(ion);
          if (!ex.length) continue;
          const rate = 600 * Math.exp(-(5 - ex.length) * e);                // (n + 1) with n = 4 − exposed sides
          if (Math.random() < 1 - Math.exp(-rate * h)) {
            ion.free = true; grid[ion.i][ion.j] = null;
            let sx = 0, sy = 0; for (const d of ex) { sx += d[0]; sy += d[1]; }
            ion.vx = sx * 40; ion.vy = sy * 40;
          }
        }
        /* free ions and the bulk solvent: Langevin walks */
        const g = Math.exp(-2 * h), sg = Math.sqrt(1 - g * g);
        for (const f of ions) if (f.free) {
          f.vx = f.vx * g + 40 * sg * randn(); f.vy = f.vy * g + 40 * sg * randn();
          f.x += f.vx * h; f.y += f.vy * h;
          if (f.x < 24) { f.x = 24; f.vx = Math.abs(f.vx); } if (f.x > Wd - 24) { f.x = Wd - 24; f.vx = -Math.abs(f.vx); }
          if (f.y < 56) { f.y = 56; f.vy = Math.abs(f.vy); } if (f.y > Hh - 24) { f.y = Hh - 24; f.vy = -Math.abs(f.vy); }
          push(f, 2.2 * k, 0.5);
        }
        for (const b of bulk) {
          b.vx = b.vx * g + 28 * sg * randn(); b.vy = b.vy * g + 28 * sg * randn(); b.a += b.va * h; b.va = b.va * g + 1.5 * sg * randn();
          b.x += b.vx * h; b.y += b.vy * h;
          if (b.x < 16) { b.x = 16; b.vx = Math.abs(b.vx); } if (b.x > Wd - 16) { b.x = Wd - 16; b.vx = -Math.abs(b.vx); }
          if (b.y < 52) { b.y = 52; b.vy = Math.abs(b.vy); } if (b.y > Hh - 16) { b.y = Hh - 16; b.vy = -Math.abs(b.vy); }
          push(b, 1.4 * k, 1);
        }
        /* drawing */
        const liq = V.liq;
        const molecule = (x, y, ang, alpha) => {
          if (!polar) { if (liq !== 'vacuum') { c.save(); c.globalAlpha = alpha * 0.45; c.fillStyle = CL.muted; c.beginPath(); c.arc(x, y, 1.1 * k, 0, TAU); c.fill(); c.restore(); } return; }
          if (liq === 'water') { S.molecule(c, x, y, { angle: ang, scale: k, charges: V.charges, alpha }); return; }
          c.save(); c.globalAlpha = alpha;                              // a generic polar molecule: red negative end at (x, y), pale positive end along ang
          const px = x + 1.5 * k * Math.cos(ang), py = y + 1.5 * k * Math.sin(ang);
          c.strokeStyle = CL.muted; c.lineWidth = Math.max(1, 0.2 * k); c.beginPath(); c.moveTo(x, y); c.lineTo(px, py); c.stroke();
          c.fillStyle = '#e8503a'; c.beginPath(); c.arc(x, y, 0.55 * k, 0, TAU); c.fill();
          c.fillStyle = '#e9eef3'; c.beginPath(); c.arc(px, py, 0.4 * k, 0, TAU); c.fill();
          c.restore();
        };
        for (const b of bulk) molecule(b.x, b.y, b.a, 0.5);
        const shellR = z => (z > 0 ? 2.4 : 3.1) * k;
        if (polar) {
          for (const ion of ions) {
            if (ion.free) {
              const n = 6, r = shellR(ion.z);
              for (let m = 0; m < n; m++) {
                const phi = ion.ph + m * TAU / n + 0.25 * Math.sin(t * 3 + m * 1.7) + 0.2 * t;
                const x = ion.x + r * Math.cos(phi), y = ion.y + r * Math.sin(phi);
                molecule(x, y, ion.z > 0 ? phi : phi + Math.PI, 0.95);
              }
            } else {
              for (const [dx, dy] of exposed(ion)) {
                const psi = Math.atan2(dy, dx) + 0.12 * Math.sin(t * 4 + ion.ph);
                molecule(ion.x + shellR(ion.z) * Math.cos(psi), ion.y + shellR(ion.z) * Math.sin(psi), ion.z > 0 ? psi : psi + Math.PI, 0.95);
              }
            }
          }
        }
        let nfree = 0;
        for (const ion of ions) {
          if (ion.free) nfree++;
          const r = (ion.z > 0 ? 1.02 : 1.81) * k;
          c.save(); c.globalAlpha = 0.92; c.fillStyle = ion.z > 0 ? colNa : colCl; c.strokeStyle = CL.text; c.lineWidth = 1;
          c.beginPath(); c.arc(ion.x, ion.y, r, 0, TAU); c.fill(); c.stroke(); c.restore();
          kit.label(c, ion.z > 0 ? '+' : '−', ion.x, ion.y, { size: Math.max(10, r * 1.1), color: '#111', align: 'center', baseline: 'middle', weight: 700 });
        }
        /* the gauge of the pair attraction */
        const gx = 14, gy = 14, gw = Wd - 28;
        kit.label(c, 'attraction of two neighbouring ions in this liquid: ' + sig(Epair, 3) + ' kJ/mol = ' + sig(e, 3) + ' RT', gx, gy, { size: 12, color: CL.text, weight: 600 });
        const f = clamp(Math.log10(Math.max(e, 1)) / 2.4, 0, 1);
        c.fillStyle = CL.grid; c.fillRect(gx, gy + 12, gw, 9);
        c.fillStyle = e < 4 ? CL.ok : e < 12 ? CL.warn : CL.bad; c.fillRect(gx, gy + 12, gw * f, 9);
        for (const v of [1, 3, 10, 30, 100]) { const x = gx + gw * Math.log10(v) / 2.4; c.fillStyle = CL.faint; c.fillRect(x, gy + 10, 1, 13); kit.label(c, v + ' RT', x + 3, gy + 33, { size: 10, color: CL.muted }); }
        ro.set('free', nfree + ' of ' + ions.length + (nfree ? ' (' + Math.round(100 * nfree / ions.length) + ' %)' : ''));
        ro.set('pair', sig(Epair, 3) + ' kJ/mol');
        ro.set('rt', sig(e, 3) + ' RT  (vacuum: ' + sig(EVAC / (W.R * 298.15) * 1000, 3) + ')');
        ro.set('sol', SOLUB[liq] || '—');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. like dissolves like */
  /* Solutes: solubility in g per 100 g of water at 20–25 °C (CRC; "inf" = miscible), density g/cm³, octanol–water log P where known, the
   * number of carbons in a chain (for the drawing and the alcohol series) and a drawing kind. */
  const SOLUTES = [
    { id: 'methanol', name: 'Methanol', S: Infinity, rho: 0.792, logP: -0.77, c: 1, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'ethanol', name: 'Ethanol', S: Infinity, rho: 0.789, logP: -0.31, c: 2, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'propanol', name: '1-Propanol', S: Infinity, rho: 0.803, logP: 0.25, c: 3, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'butanol', name: '1-Butanol', S: 7.4, rho: 0.81, logP: 0.88, c: 4, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'pentanol', name: '1-Pentanol', S: 2.2, rho: 0.814, logP: 1.51, c: 5, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'hexanol', name: '1-Hexanol', S: 0.58, rho: 0.814, logP: 2.03, c: 6, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'heptanol', name: '1-Heptanol', S: 0.17, rho: 0.822, logP: 2.62, c: 7, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'octanol', name: '1-Octanol', S: 0.054, rho: 0.827, logP: 3.0, c: 8, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'decanol', name: '1-Decanol', S: 0.004, rho: 0.83, logP: 4.57, c: 10, head: 'OH', sites: 'one OH', kind: 'chain', liquid: true },
    { id: 'glycerol', name: 'Glycerol', S: Infinity, rho: 1.261, logP: -1.76, c: 3, sites: 'three OH', kind: 'glycerol', liquid: true },
    { id: 'acetone', name: 'Acetone', S: Infinity, rho: 0.784, logP: -0.24, c: 3, head: 'O', mid: true, sites: 'one C=O (accepts)', kind: 'chain', liquid: true },
    { id: 'ether', name: 'Diethyl ether', S: 6.9, rho: 0.713, logP: 0.89, c: 4, head: 'O', mid: true, sites: 'one O (accepts)', kind: 'chain', liquid: true },
    { id: 'sucrose', name: 'Sucrose (sugar)', S: 200, rho: 1.587, logP: -3.7, sites: 'eight OH', kind: 'sugar', liquid: false },
    { id: 'salt', name: 'Table salt', S: 36, rho: 2.165, logP: null, sites: 'ions: hydration shells', kind: 'salt', liquid: false },
    { id: 'benzene', name: 'Benzene', S: 0.18, rho: 0.877, logP: 2.13, sites: 'none', kind: 'ring', liquid: true },
    { id: 'hexane', name: 'Hexane', S: 0.001, rho: 0.655, logP: 3.9, c: 6, sites: 'none', kind: 'chain', liquid: true },
    { id: 'oil', name: 'Olive oil', S: 0.0001, rho: 0.915, logP: null, sites: 'three ester groups, three long chains', kind: 'oil', liquid: true },
    { id: 'wax', name: 'Paraffin wax', S: 0.00001, rho: 0.9, logP: null, c: 22, sites: 'none', kind: 'chain', liquid: false },
    { id: 'iodine', name: 'Iodine', S: 0.03, rho: 4.93, logP: null, sites: 'none', kind: 'iodine', liquid: false }
  ];

  Hyper.sim('sol-like-dissolves', {
    title: 'What dissolves in water',
    blurb: `Pour a measured amount of a substance into 100 g of water and stir. If it can hydrogen-bond or hydrate as well as water bonds to itself, it **dissolves** (the dots spread through the water); if not, it **separates** into a layer on top (lighter than water) or at the bottom (heavier). The sketch shows the molecule, with its polar groups in red; the graph shows how the solubility of the straight-chain alcohols falls as the oily tail grows — a factor of about 3.3 per CH₂, which is 3 kJ/mol.

**Try this**
- Compare *ethanol*, *1-butanol* and *1-octanol*: the same OH group, three different carbon tails.
- Add 50 g of *sugar*: it all dissolves; add the same of *table salt*: only 36 g does, and the rest settles.
- *Olive oil*, *hexane* and *wax* never mix; *glycerol*, which has three OH groups on three carbons, mixes in any ratio.
- The line on the graph is Traube's rule with 3.0 kJ/mol per CH₂ from 1-butanol; the dots are measurements.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 340 });
      box.stage.appendChild(graph);
      const first = SOLUTES.some(s => s.id === params.solute) ? params.solute : 'ethanol';
      const ctl = kit.controls(box.side, [
        { id: 'sol', type: 'select', label: 'The substance', options: SOLUTES.map(s => [s.name, s.id]), value: first },
        { id: 'amt', label: 'Amount added to 100 g of water', min: 0.5, max: 100, value: 20, log: true, unit: 'g', sig: 2 },
        { type: 'buttons', items: [{ id: 'stir', label: 'Add and stir', primary: true }] }
      ], (id) => { if (id === 'stir' || id === 'sol') restart(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Solubility in water'], ['verdict', 'With this amount'], ['layer', 'The undissolved part'], ['sites', 'What it can offer water'], ['logP', 'log P (octanol/water)']]);
      const plot = kit.plot(graph, { x: { label: 'carbons in the alcohol', min: 3, max: 11 }, y: { label: 'solubility, g per 100 g water', log: true, min: 0.002, max: 20 }, legend: true }, 210);
      const N = 90;
      let parts = [], t0 = 0;
      const cur = () => SOLUTES.find(s => s.id === V.sol) || SOLUTES[0];
      function restart() {
        const s = cur(), amt = V.amt;
        const dissolvedFrac = Number.isFinite(s.S) ? clamp(s.S / amt, 0, 1) : 1;
        parts = [];
        for (let i = 0; i < N; i++) parts.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, dis: i < Math.round(dissolvedFrac * N) });
        t0 = 0;
      }
      restart();
      const curve = [];
      for (let n = 4; n <= 10; n++) curve.push([n, 7.4 * Math.exp(-(n - 4) * 3000 / (W.R * 298.15))]);
      const data = SOLUTES.filter(s => s.head === 'OH' && Number.isFinite(s.S) && s.c >= 4).map(s => [s.c, s.S]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = cur(), amt = V.amt;
        t0 += Math.min(dt, 0.05);
        const dissolvedMass = Number.isFinite(s.S) ? Math.min(amt, s.S) : amt;
        const restMass = amt - dissolvedMass;
        /* the beaker */
        const bw = Math.min(Wd * 0.4, 250), bh = Hh - 46, bx = 24, by = 18;
        const fill = 0.72;
        const surf = by + bh * (1 - fill);
        const liqCol = 'rgba(70,150,235,0.35)';
        kit.wsym.beaker(c, bx, by, bw, bh, fill, { liquid: liqCol, label: '100 g of water' });
        // the layer of undissolved material
        const vol = restMass / s.rho;                                   // cm³ of undissolved liquid or solid
        const layerH = clamp(vol / 100 * bh * fill * 0.9, 0, bh * 0.55);
        const lighter = s.rho < 1;
        const layerCol = s.id === 'oil' ? 'rgba(220,190,60,0.8)' : s.id === 'iodine' ? 'rgba(90,40,120,0.9)' : s.kind === 'salt' || s.kind === 'sugar' ? 'rgba(235,235,240,0.9)' : s.id === 'wax' ? 'rgba(240,235,215,0.9)' : 'rgba(230,200,120,0.55)';
        if (restMass > 0.001) {
          const settle = clamp(t0 / 2.5, 0, 1);
          const ly = lighter ? surf - layerH * settle + 2 : by + bh - 3 - layerH * settle;
          c.fillStyle = layerCol; c.fillRect(bx + 3, ly, bw - 6, Math.max(2, layerH * settle));
        }
        // the dots
        for (const p of parts) {
          p.vx += randn() * 0.02 - (p.dis ? 0 : 0); p.vy += randn() * 0.02; p.vx *= 0.9; p.vy *= 0.9;
          p.x += p.vx * 0.05; p.y += p.vy * 0.05;
          if (!p.dis && restMass > 0.001) {                             // separating material drifts to its layer
            const target = lighter ? 0.02 : 0.98, pull = clamp(t0 / 2.5, 0, 1) * 0.02;
            p.y += (target - p.y) * pull * 3;
          }
          p.x = clamp(p.x, 0.03, 0.97); p.y = clamp(p.y, 0.02, 0.98);
          const x = bx + 4 + p.x * (bw - 8), y = surf + 4 + p.y * (by + bh - surf - 8);
          if (y < surf - layerH * 0.0 - 2 && p.dis) continue;
          c.fillStyle = p.dis ? 'rgba(240,140,60,0.85)' : layerCol; c.beginPath(); c.arc(x, y, 2.2, 0, TAU); c.fill();
        }
        /* the molecule */
        const mx = bx + bw + 30, mw = Wd - mx - 14, my = by + 26;
        kit.label(c, s.name, mx, by + 6, { size: 13, weight: 650, color: C.text });
        const R = '#e8503a';
        const zig = (x0, y0, n, step, amp) => { const pts = []; for (let i = 0; i < n; i++) pts.push([x0 + i * step, y0 + (i % 2 ? amp : -amp)]); return pts; };
        const stroke = (pts) => { c.strokeStyle = C.text; c.lineWidth = 2; c.lineJoin = 'round'; c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); };
        const grp = (txt, x, y) => { c.fillStyle = C.bg2; c.beginPath(); c.arc(x, y, 11, 0, TAU); c.fill(); kit.label(c, txt, x, y, { size: 13, weight: 700, color: R, align: 'center', baseline: 'middle' }); };
        const cy = my + 62;
        if (s.kind === 'chain') {
          const n = Math.min(s.c, Math.max(2, Math.floor((mw - 40) / 20)));
          const step = Math.min(24, (mw - 40) / Math.max(1, n));
          const pts = zig(mx + 14, cy, n, step, 9);
          stroke(pts);
          if (s.head === 'OH') { const q = pts[pts.length - 1]; c.strokeStyle = C.text; c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(q[0] + 18, q[1] + (n % 2 ? -9 : 9)); c.stroke(); grp('OH', q[0] + 28, q[1] + (n % 2 ? -12 : 12)); }
          if (s.mid && s.head === 'O') { const q = pts[Math.floor(n / 2)]; grp(s.id === 'acetone' ? 'O' : 'O', q[0], q[1] - 20); c.strokeStyle = C.text; c.beginPath(); c.moveTo(q[0], q[1]); c.lineTo(q[0], q[1] - 9); c.stroke(); }
          if (s.c > n) kit.label(c, '… ' + s.c + ' carbons', mx + 14, cy + 34, { size: 11, color: C.muted });
        } else if (s.kind === 'glycerol') {
          stroke([[mx + 14, cy + 4], [mx + 38, cy - 8], [mx + 62, cy + 4], [mx + 86, cy - 8]]);
          grp('OH', mx + 38, cy - 34); grp('OH', mx + 62, cy + 30); grp('OH', mx + 14, cy + 26);
        } else if (s.kind === 'ring') {
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + 0.5; const x = mx + 50 + 28 * Math.cos(a), y = cy + 28 * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.stroke();
          c.beginPath(); c.arc(mx + 50, cy, 17, 0, TAU); c.stroke();
        } else if (s.kind === 'sugar') {
          c.strokeStyle = C.text; c.lineWidth = 2; for (const ox of [mx + 36, mx + 100]) { c.beginPath(); for (let i = 0; i < 6; i++) { const a = i * TAU / 6; const x = ox + 22 * Math.cos(a), y = cy + 22 * Math.sin(a); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.closePath(); c.stroke(); }
          for (const [x, y] of [[mx + 14, cy - 34], [mx + 36, cy + 46], [mx + 56, cy - 40], [mx + 78, cy + 40], [mx + 100, cy - 44], [mx + 122, cy + 24], [mx + 120, cy - 20], [mx + 12, cy + 18]]) grp('OH', x, y);
        } else if (s.kind === 'salt') {
          c.fillStyle = '#ab5cf2'; c.beginPath(); c.arc(mx + 34, cy, 14, 0, TAU); c.fill(); c.fillStyle = '#1ff01f'; c.beginPath(); c.arc(mx + 78, cy, 24, 0, TAU); c.fill();
          kit.label(c, '+', mx + 34, cy, { size: 16, align: 'center', baseline: 'middle', color: '#111', weight: 700 }); kit.label(c, '−', mx + 78, cy, { size: 16, align: 'center', baseline: 'middle', color: '#111', weight: 700 });
        } else if (s.kind === 'iodine') {
          c.fillStyle = '#6a2c91'; c.beginPath(); c.arc(mx + 36, cy, 22, 0, TAU); c.arc(mx + 84, cy, 22, 0, TAU); c.fill();
        } else if (s.kind === 'oil') {
          const pts0 = [[mx + 10, cy - 24], [mx + 10, cy], [mx + 10, cy + 24]];
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(pts0[0][0], pts0[0][1]); c.lineTo(pts0[2][0], pts0[2][1]); c.stroke();
          pts0.forEach((p, i) => { stroke(zig(p[0] + 14, p[1], 8, 14, 5 * (i % 2 ? 1 : -1))); grp('O', p[0] + 6, p[1]); });
        }
        kit.label(c, s.sites === 'none' ? 'no group that can bond to water' : 'red: ' + s.sites, mx, cy + 62, { size: 11.5, color: C.muted });
        kit.label(c, (lighter ? 'lighter than water (' : 'heavier than water (') + s.rho + ' g/cm³)', mx, cy + 80, { size: 11.5, color: C.muted });
        /* readout */
        const sol = Number.isFinite(s.S) ? sig(s.S, 2) + ' g per 100 g' : 'any ratio (miscible)';
        ro.set('S', sol);
        ro.set('verdict', restMass <= 0.001 ? 'all of it dissolves' : (dissolvedMass < 0.01 ? 'it stays out' : 'only ' + sig(dissolvedMass, 2) + ' g dissolves'));
        ro.set('layer', restMass <= 0.001 ? '—' : sig(restMass, 3) + ' g, ' + (s.liquid ? 'a liquid layer ' : 'solid ') + (lighter ? 'on top' : 'at the bottom'));
        ro.set('sites', s.sites);
        ro.set('logP', s.logP == null ? '—' : s.logP.toFixed(2));
        plot.set({
          series: [{ pts: curve, label: 'Traube: 3.0 kJ/mol per CH₂', dash: [5, 4], color: C.muted }, { pts: data, label: 'measured', line: false, dots: 4, color: C.accent }],
          x: { label: 'carbons in the alcohol', min: 3, max: 11 }, y: { label: 'solubility, g per 100 g water', log: true, min: 0.002, max: 20 },
          marks: s.head === 'OH' && Number.isFinite(s.S) ? [{ x: s.c, y: s.S, label: s.name }] : [], hlines: [{ y: 1, label: '1 g per 100 g' }]
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. the hydrophobic effect */
  /* The water network is kit.wsym's (a 2-D box of molecules that bond and unbond with temperature). The oil drops are discs the molecules cannot enter; the
   * bond counts near the oil are simply what the network does there. The areas and energies are the effective-tension model of the page. Schematic: the discs
   * stand for drops far larger than a nanometre (the flat-surface case), where water cannot bend its bonds round the oil. */
  Hyper.sim('sol-hydrophobic', {
    title: 'Water around oil',
    blurb: `Water molecules (the bonding network of the earlier pages) in a box with drops of oil that they cannot enter. The same volume of oil is split into **n** drops; the more pieces, the more oil surface touches water. The water molecules touching the oil are ringed: each has lost the neighbours it would have on the oil side, and the water pays for every one of them. The count of ringed molecules is the surface, and it grows as the oil is split up. Merging the drops shrinks the surface by a factor $n^{1/3}$.

**Try this**
- Slide *n* from 8 to 1 and watch the surface fall; the read-out gives the energy released in thermal units $k_BT$.
- Raise the temperature: the network is looser, but the free-energy bill per unit area does not shrink (it is largely entropy).
- Make the drop small (0.5 nm): the numbers are those of a single molecule's worth of surface; for such small solutes real water bends round the oil and keeps its bonds, so the saving in surface is the better guide than the bond count.
- Compare the 17 mN/m (small solutes) and 50 mN/m (large drops) costs.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Number of oil drops (same total volume)', min: 1, max: 8, step: 1, value: params.n || 4 },
        { id: 'r1', label: 'Radius if they were one drop', min: 0.5, max: 10, step: 0.5, value: 2, unit: 'nm' },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 25, unit: '°C' },
        { id: 'ring', type: 'check', label: 'Ring the water that touches the oil', value: true },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shuffle the water', primary: true }] }
      ], (id) => { if (id === 'shake') net = null; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['r', 'Radius of each drop'], ['A', 'Total oil–water surface'], ['left', 'Surface left if they all merge'], ['g17', 'Cost of this surface at 17 mN/m'], ['g50', 'Cost at 50 mN/m'], ['kT', 'Energy released on merging (50 mN/m)'], ['touch', 'Water molecules touching the oil']]);
      let net = null, sc = 20, drops = [], touching = 0, init = false;
      const targets = (n, R0, cx, cy) => {
        const out = [], r = R0 / Math.sqrt(n);
        if (n === 1) return [{ x: cx, y: cy, r }];
        const rho = Math.min(R0 * (0.9 + 0.25 * Math.sqrt(n)), Math.min(cx, cy) - r - 8);
        for (let k = 0; k < n; k++) out.push({ x: cx + rho * Math.cos(k * TAU / n + 0.3), y: cy + rho * Math.sin(k * TAU / n + 0.3), r });
        return out;
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const n = Math.round(V.n), T = V.T;
        sc = clamp(Wd / 36, 9, 14);
        const nMol = clamp(Math.round(0.85 * Wd * Hh / Math.pow(2.7 * sc, 2)), 36, 110);
        if (!net || net.length !== nMol) net = S.makeNetwork(nMol, Wd, Hh, sc, Math.floor(Math.random() * 1e6));
        const R0 = Math.min(Wd, Hh) * 0.24, cx = Wd / 2, cy = Hh / 2;
        const tg = targets(n, R0, cx, cy);
        if (!init || drops.length !== n) {                                // grow or shrink the list, keeping drops that exist
          const old = drops; drops = tg.map((d, k) => old[k] ? old[k] : { x: cx, y: cy, r: d.r }); init = true;
        }
        const k1 = 1 - Math.exp(-Math.min(dt, 0.05) * 4);
        drops.forEach((d, k) => { d.x += (tg[k].x - d.x) * k1; d.y += (tg[k].y - d.y) * k1; d.r += (tg[k].r - d.r) * k1; });
        let bonds = [];
        for (let i = 0; i < 3; i++) bonds = S.stepNetwork(net, Math.min(dt, 0.05) / 3, { T, W: Wd, H: Hh, scale: sc });
        for (const m of net) for (const d of drops) {
          const dx = m.x - d.x, dy = m.y - d.y, dist = Math.hypot(dx, dy) || 1, mn = d.r + 0.6 * sc;
          if (dist < mn) { m.x = d.x + dx / dist * mn; m.y = d.y + dy / dist * mn; }
        }
        const near = net.map(m => drops.some(d => Math.hypot(m.x - d.x, m.y - d.y) - d.r < 1.5 * sc));
        touching += (near.filter(Boolean).length - touching) * 0.05;
        /* draw */
        for (const d of drops) {
          c.fillStyle = 'rgba(225,185,60,0.75)'; c.strokeStyle = 'rgba(160,120,20,0.9)'; c.lineWidth = 2;
          c.beginPath(); c.arc(d.x, d.y, Math.max(1, d.r), 0, TAU); c.fill(); c.stroke();
        }
        kit.label(c, 'oil', drops[0].x, drops[0].y, { size: 12, color: '#5a4300', align: 'center', baseline: 'middle', weight: 600 });
        S.network(c, net, { scale: sc, bonds });
        if (V.ring) net.forEach((m, i) => { if (near[i]) { c.strokeStyle = C.warn; c.lineWidth = 1.5; c.beginPath(); c.arc(m.x, m.y, 0.8 * sc, 0, TAU); c.stroke(); } });
        kit.label(c, 'schematic: ' + net.length + ' water molecules, the drops are flat-surface stand-ins', 10, Hh - 10, { size: 11, color: C.muted });
        /* numbers: spheres of equal total volume */
        const r = V.r1 / Math.cbrt(n);                                     // nm
        const A = n * 4 * Math.PI * r * r, A1 = 4 * Math.PI * V.r1 * V.r1;     // nm²
        const toKJ = g => g * 1e-3 * A * 1e-18 * W.NA / 1e3;
        const dE = 50e-3 * (A - A1) * 1e-18;                                 // J per merger
        ro.set('r', sig(r, 3) + ' nm');
        ro.set('A', sig(A, 3) + ' nm²');
        ro.set('left', sig(100 * A1 / A, 3) + ' %');
        ro.set('g17', sig(toKJ(17), 3) + ' kJ/mol');
        ro.set('g50', sig(toKJ(50), 3) + ' kJ/mol');
        ro.set('kT', n > 1 ? sig(dE / (W.R / W.NA * (T + 273.15)), 3) + ' k_B T' : 'one drop: nothing left to merge');
        ro.set('touch', sig(touching, 2) + ' of ' + net.length);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. the fizzy bottle */
  /* c0 = kH(gas, 20 °C) · p0 when the bottle is filled; while sealed the pressure is c / kH(T) (so a warm bottle is under more pressure); once open the
   * dissolved gas relaxes towards kH(T) · p_air at a rate that grows with T (schematic: the 60 % per ten seconds is a stage rate, not a measurement). */
  Hyper.sim('sol-fizzy-bottle', {
    title: 'A bottle of dissolved gas',
    blurb: `A sealed bottle holds a gas dissolved at the pressure it was filled at, 20 °C. Warm it, and the same dissolved gas is in balance with a **higher** pressure (gauge at the neck). Open it and the pressure drops to that of the air; the liquid is **supersaturated**, bubbles grow on nuclei and the extra gas leaves at a rate set by how far from balance it is. (Schematic: bubble rates and foam are drawn for effect; the dissolved amounts, pressures and volumes are Henry's law.)

**Try this**
- Open the CO₂ bottle at 5 °C and at 25 °C: the cold one holds almost twice as much gas but fizzes more gently; the warm one foams over.
- Choose *oxygen* or *nitrogen*: the bubbles are few and slow, because these gases dissolve 20–50 times less. This is why a diver, whose tissues hold nitrogen under pressure, is the more worrying case.
- Warm a sealed bottle from 20 to 40 °C and read the pressure.
- The graph shows the dissolved amount in balance with the bottling pressure and with the air, against temperature.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 320, maxH: 460 });
      box.stage.appendChild(graph);
      const GAS = [['Carbon dioxide (drinks)', 'CO2'], ['Oxygen', 'O2'], ['Nitrogen', 'N2']];
      const PAIR = { CO2: 0.00042, O2: 0.2095, N2: 0.7808 };
      const ctl = kit.controls(box.side, [
        { id: 'gas', type: 'select', label: 'The dissolved gas', options: GAS, value: params.gas || 'CO2' },
        { id: 'p0', label: 'Filled at a pressure of', min: 1, max: 6, step: 0.1, value: 3, unit: 'atm' },
        { id: 'T', label: 'Temperature now', min: 0, max: 40, step: 1, value: params.T != null ? params.T : 20, unit: '°C' },
        { type: 'buttons', items: [{ id: 'open', label: 'Open the bottle', primary: true }, { id: 'seal', label: 'Fill and seal' }] }
      ], (id) => { if (id === 'open') opened = true; if (id === 'seal' || id === 'gas' || id === 'p0') fillIt(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['P', 'Pressure in the bottle'], ['c', 'Dissolved now'], ['super', 'Dissolved ÷ balance with the air'], ['vol', 'Gas dissolved when filled'], ['rel', 'Gas released so far (at 1 atm)']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', min: 0, max: 40 }, y: { label: 'dissolved gas, mmol/L', log: true }, legend: true }, 200);
      let opened = false, c0 = 0, cNow = 0, rel = 0, foam = 0, bubbles = [], acc = 0;
      const kH = (T) => W.henry(V.gas, T);
      function fillIt() { opened = false; c0 = kH(20) * V.p0; cNow = c0; rel = 0; foam = 0; bubbles = []; }
      fillIt();
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T, h = Math.min(dt, 0.05);
        const kh = kH(T), pAir = PAIR[V.gas], ceq = kh * pAir;
        const Phead = opened ? 1 : Math.max(1, cNow / kh);
        let flux = 0;
        if (opened) {
          const kr = 0.06 * (0.5 + T / 40) * 1.0;
          flux = cNow > ceq ? kr * (cNow - ceq) : 0;
          cNow = Math.max(ceq, cNow - flux * h);
          rel += flux * h;
        }
        const sup = cNow / ceq;
        /* bottle geometry */
        const bx = Wd * 0.18, bw = Math.min(150, Wd * 0.26), bt = 50, bb2 = Hh - 24, neckW = bw * 0.36;
        const cxm = bx + bw / 2, shoulder = bt + 70;
        const level = shoulder + 20 + (1 - 0.55) * 0;
        const liqTop = shoulder + 28;
        const body = () => { c.beginPath(); c.moveTo(cxm - neckW / 2, bt); c.lineTo(cxm - neckW / 2, shoulder - 30); c.quadraticCurveTo(cxm - neckW / 2, shoulder, bx, shoulder + 28); c.lineTo(bx, bb2 - 10); c.quadraticCurveTo(bx, bb2, bx + 10, bb2); c.lineTo(bx + bw - 10, bb2); c.quadraticCurveTo(bx + bw, bb2, bx + bw, bb2 - 10); c.lineTo(bx + bw, shoulder + 28); c.quadraticCurveTo(cxm + neckW / 2, shoulder, cxm + neckW / 2, shoulder - 30); c.lineTo(cxm + neckW / 2, bt); };
        c.save(); body(); c.closePath(); c.clip();
        c.fillStyle = 'rgba(110,70,40,0.55)'; c.fillRect(bx, liqTop, bw, bb2 - liqTop);
        /* bubbles */
        const rate = Math.min(220, 160 * Math.max(0, sup - 1) / Math.max(1, c0 / (kh * pAir)) * Math.min(1, flux / 0.03 + 0.2) + flux * 400);
        acc += rate * h;
        while (acc >= 1) { acc -= 1; bubbles.push({ x: bx + 8 + Math.random() * (bw - 16), y: bb2 - 6 - Math.random() * 12, r: rnd(1.2, 3), v: rnd(30, 70) }); }
        let popped = 0;
        for (const b of bubbles) { b.y -= b.v * (b.r / 2) * h * 1.8; b.r += 0.5 * h; b.x += randn() * 8 * h; if (b.y < liqTop) { b.dead = true; popped++; } }
        bubbles = bubbles.filter(b => !b.dead).slice(-400);
        c.fillStyle = 'rgba(255,255,255,0.75)';
        for (const b of bubbles) { c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.fill(); }
        foam = clamp(foam + popped * 0.004 - foam * 0.35 * h, 0, 1.4);
        if (foam > 0.01) { const fh = foam * 70; c.fillStyle = 'rgba(255,248,235,0.92)'; c.fillRect(bx, liqTop - fh, bw, fh + 2); }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2; body(); c.stroke();
        if (!opened) { c.fillStyle = C.warn; c.fillRect(cxm - neckW / 2 - 3, bt - 8, neckW + 6, 9); }
        else if (foam > 1.0) kit.label(c, 'foams over!', cxm, bt - 16, { size: 13, color: C.bad, align: 'center', weight: 700 });
        else kit.label(c, 'open', cxm, bt - 12, { size: 11.5, color: C.muted, align: 'center' });
        /* a pressure gauge */
        const gx = bx + bw + 90, gy = 130, gr = 58;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(gx, gy, gr, Math.PI * 0.75, Math.PI * 2.25); c.stroke();
        for (let p = 0; p <= 8; p++) { const a = Math.PI * 0.75 + p / 8 * Math.PI * 1.5, r0 = gr - 8, r1 = gr; c.beginPath(); c.moveTo(gx + r0 * Math.cos(a), gy + r0 * Math.sin(a)); c.lineTo(gx + r1 * Math.cos(a), gy + r1 * Math.sin(a)); c.stroke(); if (p % 2 === 0) kit.label(c, String(p), gx + (gr - 20) * Math.cos(a), gy + (gr - 20) * Math.sin(a), { size: 10.5, color: C.muted, align: 'center', baseline: 'middle' }); }
        const ang = Math.PI * 0.75 + clamp(Phead, 0, 8) / 8 * Math.PI * 1.5;
        kit.arrow(c, gx, gy, gx + (gr - 12) * Math.cos(ang), gy + (gr - 12) * Math.sin(ang), Phead > 5 ? C.bad : C.accent, 3);
        kit.label(c, sig(Phead, 3) + ' atm', gx, gy + gr + 20, { size: 14, color: C.text, align: 'center', weight: 650 });
        kit.label(c, opened ? 'open to the air' : 'sealed', gx, gy + gr + 38, { size: 11.5, color: C.muted, align: 'center' });
        /* read-outs */
        ro.set('P', sig(Phead, 3) + ' atm' + (opened ? ' (open)' : ' (sealed)'));
        ro.set('c', sig(cNow * 1000, 3) + ' mmol/L = ' + sig(cNow * (V.gas === 'CO2' ? 44.01 : V.gas === 'O2' ? 31.998 : 28.014), 3) + ' g/L');
        ro.set('super', sig(sup, 3) + ' ×');
        ro.set('vol', sig(c0 * 22.414, 3) + ' volumes (L of gas per L of liquid at 0 °C)');
        ro.set('rel', sig(rel * 22.414 * (T + 273.15) / 273.15, 3) + ' L of gas per L of liquid');
        const pts1 = [], pts2 = [];
        for (let TT = 0; TT <= 40; TT += 2) { const k = W.henry(V.gas, TT); pts1.push([TT, k * V.p0 * 1000]); pts2.push([TT, k * pAir * 1000]); }
        plot.set({ series: [{ pts: pts1, label: 'in balance with ' + sig(V.p0, 2) + ' atm', color: C.accent }, { pts: pts2, label: 'in balance with the air', color: C.muted }], x: { label: 'temperature (°C)', min: 0, max: 40 }, y: { label: 'dissolved gas, mmol/L', log: true }, marks: [{ x: T, y: cNow * 1000, label: 'now' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. colligative properties */
  /* The freezing and boiling points are read off the vapour-pressure curves of kit.water: the solvent's pressure over the solution is x_w · p(T), where x_w
   * counts every particle (i per formula unit); the ice curve is the sublimation pressure. Where the solution curve meets the ice curve is the freezing
   * point; where it meets one atmosphere, the boiling point. The NaCl measurement is the CRC liquidus table (to a few tenths of a kelvin). */
  const NACL_LIQ = [[0, 0], [1, -0.59], [2, -1.19], [4, -2.41], [6, -3.67], [8, -5.04], [10, -6.54], [12, -8.18], [14, -9.95], [16, -11.9], [18, -14.0], [20, -16.4], [22, -19.0], [23.3, -21.1]];
  Hyper.sim('sol-colligative', {
    title: 'A solute lowers the freezing point',
    blurb: `Dissolve something in water and the vapour pressure above it falls in proportion to the mole fraction of the particles (Raoult). The upper graph shows that: the solution's vapour pressure is a fixed fraction of the pure water's; the ice curve falls as you cool; they meet at the **freezing point**. The lower graph is the same idea at the boiling end: the solution reaches one atmosphere at a higher temperature.

**Try this**
- Same mass, different solutes: 10 % of *sugar*, *salt* and *calcium chloride*. The more particles per gram, the bigger the shift.
- Slide *salt* up to 23 %: the measured freezing point reaches the eutectic, −21 °C; beyond it, salt crystallises out as well.
- *Ethylene glycol* at 50 %: the straight-line law gives −30 °C, the exact ideal solution −46 °C, and the measured value is −37 °C between them. Concentrated solutions are not ideal.
- Notice the boiling shift is a third of the freezing shift: a kitchen's worth of salt barely nudges the boiling point.`,
    mount(box, kit, params) {
      const W = kit.water, C0 = kit.chem;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 200 });
      box.stage.appendChild(graph);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); graph.appendChild(g1); graph.appendChild(g2);
      const SOL = [['Table salt, NaCl (i = 2)', { f: 'NaCl', i: 2, nacl: true }], ['Calcium chloride, CaCl₂ (i = 3)', { f: 'CaCl2', i: 3 }], ['Magnesium chloride, MgCl₂ (i = 3)', { f: 'MgCl2', i: 3 }], ['Potassium chloride, KCl (i = 2)', { f: 'KCl', i: 2 }], ['Sucrose (i = 1)', { f: 'C12H22O11', i: 1 }], ['Glucose (i = 1)', { f: 'C6H12O6', i: 1 }], ['Ethylene glycol (i = 1)', { f: 'C2H6O2', i: 1 }], ['Glycerol (i = 1)', { f: 'C3H8O3', i: 1 }], ['Ethanol (i = 1)', { f: 'C2H6O', i: 1 }], ['Urea (i = 1)', { f: 'CH4N2O', i: 1 }]];
      const sel0 = (SOL.find(s => s[1].f === params.solute) || SOL[0])[1];
      const ctl = kit.controls(box.side, [
        { id: 'sol', type: 'select', label: 'The solute', options: SOL, value: sel0 },
        { id: 'w', label: 'Mass fraction of solute', min: 0.2, max: 40, step: 0.2, value: params.w || 10, unit: '%' }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['m', 'Molality of the solute'], ['part', 'Particles in solution'], ['xw', 'Mole fraction of water'], ['dtf', 'Freezing point lowering, ideal law iKm'], ['fp', 'Freezing point, ideal solution (curves)'], ['meas', 'Measured (NaCl table)'], ['bp', 'Boiling point, ideal solution (curves)'], ['pi', 'Osmotic pressure at 25 °C (ideal)']]);
      const p1 = kit.plot(g1, { x: { label: 'temperature (°C)' }, y: { label: 'vapour pressure ÷ pure supercooled water' }, legend: true }, 190);
      const p2 = kit.plot(g2, { x: { label: 'temperature (°C)' }, y: { label: 'vapour pressure ÷ 1 atm' }, legend: true }, 190);
      const bisect = (f, a, b) => { let fa = f(a), fb = f(b); if (fa * fb > 0) return NaN; for (let i = 0; i < 60; i++) { const m = (a + b) / 2, fm = f(m); if (fa * fm <= 0) { b = m; fb = fm; } else { a = m; fa = fm; } } return (a + b) / 2; };
      const ice = T => W.sublimationPressure(Math.min(T, 0.01));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = V.sol, M = C0.molarMass(s.f), w = V.w / 100;
        const m = w / ((1 - w) * M / 1000);                          // mol/kg
        const nPart = s.i * m, nW = 1000 / W.M, xw = nW / (nW + nPart);
        const dTf = W.freezingDepression(m, s.i), dTb = W.boilingElevation(m, s.i);
        const fp = bisect(T => ice(T) / W.vapourPressure(T) - xw, -60, 0);
        const bp = bisect(T => xw * W.vapourPressure(T) - 101325, 99, 200);
        let meas = null;
        if (s.nacl) meas = W.interp(NACL_LIQ, V.w);
        /* the scale */
        const x0 = 40, x1 = Wd - 24, X = T => x0 + (T + 40) / 160 * (x1 - x0);
        const rows = [[Hh * 0.33, 'pure water', 0, 100, C.accent], [Hh * 0.78, 'with the solute', Number.isFinite(fp) ? fp : -60, Number.isFinite(bp) ? bp : 100 + dTb, C.warn]];
        for (const [y, lab, tf, tb, col] of rows) {
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
          for (let T = -40; T <= 120; T += 20) { c.beginPath(); c.moveTo(X(T), y - 4); c.lineTo(X(T), y + 4); c.stroke(); if (y > Hh / 2 || T % 40 === 0) kit.label(c, String(T), X(T), y + 16, { size: 10, color: C.muted, align: 'center' }); }
          kit.label(c, lab, x0, y - 30, { size: 12, color: C.text, weight: 600 });
          kit.dot(c, X(tf), y, 6, col, C.text); kit.dot(c, X(tb), y, 6, col, C.text);
          kit.label(c, 'freezes ' + sig(tf, 3) + ' °C', X(tf), y - 12, { size: 11, color: col, align: 'center', weight: 600 });
          kit.label(c, 'boils ' + sig(tb, 4) + ' °C', X(tb), y - 12, { size: 11, color: col, align: 'center', weight: 600 });
        }
        if (Number.isFinite(fp)) kit.arrow(c, X(0), Hh * 0.33 + 24, X(fp), Hh * 0.78 - 36, C.faint, 1.2);
        kit.arrow(c, X(100), Hh * 0.33 + 24, X(Number.isFinite(bp) ? bp : 100), Hh * 0.78 - 36, C.faint, 1.2);
        /* read-outs */
        ro.set('m', sig(m, 3) + ' mol/kg');
        ro.set('part', sig(nPart, 3) + ' mol/kg');
        ro.set('xw', xw.toFixed(4));
        ro.set('dtf', sig(dTf, 3) + ' K');
        ro.set('fp', Number.isFinite(fp) ? sig(fp, 3) + ' °C' : 'below −60 °C');
        ro.set('meas', s.nacl && meas != null ? sig(meas, 3) + ' °C' + (V.w >= 23.3 ? ' (eutectic: salt crystallises beyond)' : '') : '—');
        ro.set('bp', Number.isFinite(bp) ? sig(bp, 4) + ' °C' : '—');
        ro.set('pi', sig(W.osmoticPressure(nPart * 0.997, 1, 298.15) / 1e5, 3) + ' bar');
        /* graphs */
        const lo = Math.min(-8, Number.isFinite(fp) ? fp - 6 : -60), a = [], b = [];
        for (let T = lo; T <= 1.0001; T += (1 - lo) / 50) { const r = ice(T) / W.vapourPressure(T); a.push([T, r]); }
        p1.set({ series: [{ pts: [[lo, 1], [1, 1]], label: 'pure water', color: C.accent }, { pts: [[lo, xw], [1, xw]], label: 'the solution (Raoult)', color: C.warn }, { pts: a, label: 'ice', color: C.text }], x: { label: 'temperature (°C)', min: lo, max: 1 }, y: { label: 'vapour pressure ÷ pure supercooled water', min: Math.max(0, Math.min(xw, a[0][1]) - 0.1), max: 1.03 }, vlines: Number.isFinite(fp) ? [{ x: fp, label: 'freezing point' }] : [] });
        const hi = Math.max(104, Number.isFinite(bp) ? bp + 3 : 104), lo2 = 96, pa = [], pb = [];
        for (let T = lo2; T <= hi + 0.0001; T += (hi - lo2) / 40) { pa.push([T, W.vapourPressure(T) / 101325]); pb.push([T, xw * W.vapourPressure(T) / 101325]); }
        p2.set({ series: [{ pts: pa, label: 'pure water', color: C.accent }, { pts: pb, label: 'the solution', color: C.warn }], x: { label: 'temperature (°C)', min: lo2, max: hi }, y: { label: 'vapour pressure ÷ 1 atm', min: 0.7, max: 1.2 }, hlines: [{ y: 1, label: '1 atm' }], vlines: Number.isFinite(bp) ? [{ x: bp, label: 'boiling point' }] : [] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. osmosis in a U-tube */
  /* Π = i M R T from kit.water. The level difference follows d' = (d_eq − d)/τ with d_eq = (Π − P_applied)/(ρ g) — schematic time course; the equilibrium head, the
   * pressures and the direction of flow are exact. The solution's concentration is held constant (an unlimited supply), as in an osmometer with a wide arm. */
  Hyper.sim('sol-osmosis-utube', {
    title: 'A U-tube with a membrane',
    blurb: `A U-tube with a semipermeable membrane across the bottom: pure water on the right, a solution on the left. Water crosses towards the solution until the weight of the raised column balances the **osmotic pressure** $\\Pi = iMRT$. The ruler is in metres of water, and even a weak solution wants a tall column: 0.1 mol/L of NaCl needs 50 m. (Schematic: the time course is drawn; the equilibrium head and the pressures are exact.)

**Try this**
- Raise the concentration: the equilibrium head grows in proportion; sea water's 27 bar is 275 m.
- Press on the solution (*applied pressure*): when it passes Π the flow reverses and water is squeezed out of the solution — **reverse osmosis**.
- Compare *calcium chloride* (3 particles) with *glucose* (1): at equal molarity, three times the pressure.
- The graph marks sea water (27 bar) and blood (7.5 bar).`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 360, maxH: 520 });
      box.stage.appendChild(graph);
      const SOL = [['Table salt, NaCl (i = 2)', 2], ['Calcium chloride (i = 3)', 3], ['Glucose (i = 1)', 1], ['Sucrose (i = 1)', 1]];
      const ctl = kit.controls(box.side, [
        { id: 'i', type: 'select', label: 'The solute (particles per formula unit)', options: SOL, value: 2 },
        { id: 'M', label: 'Concentration of the solution', min: 0.001, max: 1, value: params.M || 0.05, log: true, unit: 'mol/L', sig: 2 },
        { id: 'P', label: 'Pressure applied to the solution', min: 0, max: 80, step: 0.5, value: 0, unit: 'bar' },
        { id: 'T', label: 'Temperature', min: 0, max: 40, step: 1, value: 25, unit: '°C' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Level the two arms', primary: true }] }
      ], (id) => { if (id === 'reset') d = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pi', 'Osmotic pressure Π = iMRT'], ['head', 'Head of water that balances Π'], ['net', 'Net drive: Π − applied pressure'], ['d', 'Level difference now'], ['verdict', 'What the water does']]);
      const plot = kit.plot(graph, { x: { label: 'concentration (mol/L)', log: true, min: 0.001, max: 1 }, y: { label: 'osmotic pressure (bar)', log: true, min: 0.05, max: 120 }, legend: true }, 190);
      let d = 0, part = [], dots = [];
      for (let k = 0; k < 90; k++) part.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0 });
      for (let k = 0; k < 14; k++) dots.push({ u: Math.random(), v: Math.random() });
      const HMAX = 60;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05), TK = V.T + 273.15;
        const Pi = W.osmoticPressure(V.M, V.i, TK) / 1e5;                         // bar
        const rho = W.density(V.T), g = W.g;
        const dEq = (Pi - V.P) * 1e5 / (rho * g);
        d += (dEq - d) * (1 - Math.exp(-h / 2.2));
        const net = Pi - V.P - rho * g * d / 1e5;
        /* geometry */
        const aw = Math.min(44, Wd * 0.07), xL = Wd * 0.2, xR = xL + aw * 2.4 + 20, baseY = Hh - 36, topY = 30;
        const yRef = topY + (baseY - topY) * 0.42;
        const scale = (yRef - topY - 6) / HMAX;                                    // px per metre
        const dd = clamp(d, -HMAX * 1.9, HMAX * 1.9);
        const yL = clamp(yRef - dd / 2 * scale, topY + 4, baseY - aw), yR = clamp(yRef + dd / 2 * scale, topY + 4, baseY - aw);
        const col = clamp(V.i * V.M * 3, 0, 1);
        const solCol = 'rgba(240,160,70,' + (0.25 + 0.4 * col).toFixed(2) + ')', watCol = 'rgba(70,150,235,0.35)';
        // tube walls
        c.strokeStyle = C.text; c.lineWidth = 2;
        const left = xL - aw / 2, right = xR + aw / 2, mid = (xL + xR) / 2;
        c.beginPath(); c.moveTo(left, topY); c.lineTo(left, baseY); c.lineTo(right, baseY); c.lineTo(right, topY);
        c.moveTo(xL + aw / 2, topY); c.lineTo(xL + aw / 2, baseY - aw); c.lineTo(xR - aw / 2, baseY - aw); c.lineTo(xR - aw / 2, topY); c.stroke();
        // liquids
        c.fillStyle = solCol; c.fillRect(left + 1, yL, aw - 1, baseY - yL); c.fillRect(left + 1, baseY - aw + 1, mid - left - 1, aw - 1);
        c.fillStyle = watCol; c.fillRect(xR - aw / 2 + 1, yR, aw - 1, baseY - yR); c.fillRect(mid + 1, baseY - aw + 1, right - mid - 1, aw - 1);
        // membrane
        c.strokeStyle = C.bad; c.lineWidth = 3; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(mid, baseY - aw); c.lineTo(mid, baseY); c.stroke(); c.setLineDash([]);
        kit.label(c, 'membrane', mid, baseY + 14, { size: 11, color: C.bad, align: 'center' });
        // solute particles (left) and water crossing
        const nPart = Math.round(clamp(Math.log10(V.i * V.M * 1000 + 1) * 22, 0, 90));
        for (let k = 0; k < nPart; k++) {
          const p = part[k]; p.vx += randn() * 0.03; p.vy += randn() * 0.03; p.vx *= 0.92; p.vy *= 0.92; p.x = clamp(p.x + p.vx * 0.05, 0.03, 0.97); p.y = clamp(p.y + p.vy * 0.05, 0.03, 0.97);
          const x = left + 4 + p.x * (aw - 8), y = yL + 8 + p.y * (baseY - yL - 12);
          c.fillStyle = 'rgba(210,90,20,0.9)'; c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
        }
        const flow = clamp(net / 20, -1, 1);
        if (Math.abs(flow) > 0.002) for (const q of dots) {
          q.u += flow * h * 1.4 * (0.4 + q.v); if (q.u > 1) q.u -= 1; if (q.u < 0) q.u += 1;
          const x = mid - 22 + q.u * 44, y = baseY - aw + 6 + q.v * (aw - 12);
          c.fillStyle = 'rgba(90,170,255,0.95)'; c.beginPath(); c.arc(x, y, 2.6, 0, TAU); c.fill();
        }
        if (Math.abs(flow) > 0.02) kit.arrow(c, mid - 28 * Math.sign(flow), baseY - aw - 12, mid + 28 * Math.sign(flow), baseY - aw - 12, flow > 0 ? C.ok : C.bad, 2.5);
        // a ruler in metres of water
        for (let m = -HMAX; m <= HMAX; m += 20) {
          const y = yRef - m * scale; if (y < topY || y > baseY) continue;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(right + 6, y); c.lineTo(right + 14, y); c.stroke();
          kit.label(c, m + ' m', right + 18, y, { size: 10, color: C.muted, baseline: 'middle' });
        }
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(left - 10, yRef); c.lineTo(right + 6, yRef); c.stroke(); c.setLineDash([]);
        kit.label(c, 'solution', xL, topY - 12, { size: 11.5, color: C.warn, align: 'center', weight: 600 });
        kit.label(c, 'pure water', xR, topY - 12, { size: 11.5, color: C.accent, align: 'center', weight: 600 });
        if (V.P > 0) kit.arrow(c, xL, topY - 4, xL, topY + 16, C.bad, 3);
        if (Math.abs(d) > HMAX * 1.9) kit.label(c, 'off the scale', right + 40, topY + 20, { size: 11.5, color: C.bad, weight: 600 });
        ro.set('pi', sig(Pi, 3) + ' bar');
        ro.set('head', sig(Pi * 1e5 / (rho * g), 3) + ' m of water');
        ro.set('net', sig(Pi - V.P, 3) + ' bar');
        ro.set('d', sig(d, 3) + ' m (solution above pure water if positive)');
        ro.set('verdict', Pi - V.P > 0.02 ? 'osmosis: water enters the solution' : Pi - V.P < -0.02 ? 'reverse osmosis: water is pushed out of the solution' : 'in balance');
        const pts = [];
        for (let k = 0; k <= 60; k++) { const M = 0.001 * Math.pow(1000, k / 60); pts.push([M, W.osmoticPressure(M, V.i, TK) / 1e5]); }
        plot.set({ series: [{ pts, label: 'osmotic pressure of this solute', color: C.accent }], x: { label: 'concentration (mol/L)', log: true, min: 0.001, max: 1 }, y: { label: 'osmotic pressure (bar)', log: true, min: 0.05, max: 120 }, marks: [{ x: V.M, y: Pi, label: 'now' }], hlines: [{ y: 27, label: 'sea water 27 bar' }, { y: 7.5, label: 'blood 7.5 bar' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 7. sea water and a salt pan */
  /* The recipe is kit.water.SEAWATER.ions scaled to the salinity; the density is kit.water.densityBrine. Pan sequence after Usiglio (1849): carbonate from a
   * concentration factor of 2, gypsum from 5.3, halite from 10.5, the bitter salts from 26. The fractions of the salt in each layer are rounded textbook
   * proportions — schematic. */
  Hyper.sim('sol-seawater', {
    title: 'The salt of the sea, and a salt pan',
    blurb: `A beaker of water at the salinity you choose, and a shallow pan from which the water is evaporating. Dots are ions in the proportions of the open ocean: chloride (green) and sodium (violet) make up 86 % of the mass. As the pan loses water the salt concentrates, the density climbs, and the minerals come out of solution **in order of solubility** — first calcium carbonate, then gypsum, then halite (table salt) — leaving a magnesium-rich bittern. (Schematic: the proportions of the layers are rounded; the density, freezing point and osmotic pressure are computed from measured relations.)

**Try this**
- Pick the *Dead Sea* (340 g/kg): the density is 1,240 kg/m³ and a swimmer sits high in the water.
- Slide the pan towards 90 % evaporated, where halite starts to crystallise.
- The Baltic at 8 g/kg freezes at −0.4 °C; the Red Sea at 41 at −2.2 °C.
- Read the density against temperature at 35 g/kg: there is no 4 °C maximum in the open sea.`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 480 });
      box.stage.appendChild(graph);
      const PLACES = [['Baltic Sea (about 8 g/kg)', 8], ['Black Sea (18)', 18], ['Open Atlantic (35)', 35], ['Mediterranean (38)', 38], ['Red Sea (41)', 41], ['Dead Sea (340)', 340]];
      const S0 = params.S || 35;
      const ctl = kit.controls(box.side, [
        { id: 'place', type: 'select', label: 'Take a sample from', options: PLACES, value: PLACES.some(p => p[1] === S0) ? S0 : 35 },
        { id: 'S', label: 'Salinity', min: 0, max: 350, step: 1, value: S0, unit: 'g/kg' },
        { id: 'T', label: 'Temperature', min: 0, max: 30, step: 1, value: 15, unit: '°C' },
        { id: 'ev', label: 'Pan: water evaporated', min: 0, max: 98, step: 0.5, value: params.ev || 0, unit: '%' }
      ], (id, v) => { if (id === 'place') ctl.set('S', v, false); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['S', 'Salinity now'], ['rho', 'Density'], ['fp', 'Freezing point (dilute estimate)'], ['pi', 'Osmotic pressure at 25 °C'], ['float', 'Share of a swimmer under water'], ['stage', 'In the pan']]);
      const plot = kit.plot(graph, { x: { label: 'salinity (g/kg)', min: 0, max: 350 }, y: { label: 'density (kg/m³)' }, legend: true }, 190);
      const SP = [['Cl⁻', '#1fb01f', 546], ['Na⁺', '#ab5cf2', 469], ['Mg²⁺', '#f0a030', 53], ['SO₄²⁻', '#e0e060', 28], ['Ca²⁺', '#40a0d0', 10], ['K⁺', '#d070b0', 10]];
      const tot = SP.reduce((s, x) => s + x[2], 0);
      const N0 = 300;
      const dots = [];
      for (let k = 0; k < N0; k++) { let r = Math.random() * tot, sp = 0; while (sp < SP.length - 1 && r > SP[sp][2]) { r -= SP[sp][2]; sp++; } dots.push({ sp, x: Math.random(), y: Math.random(), vx: 0, vy: 0, u: Math.random() }); }
      const LAYERS = [['calcium carbonate', 0.0035, '#e8e8e8'], ['gypsum', 0.0385, '#d8d4c4'], ['halite (sodium chloride)', 0.78, '#fbf2f0'], ['bitterns (Mg, K salts)', 0.178, '#d6b95c']];
      const CUT = [0, 0.0035, 0.042, 0.822, 1];
      const progress = cf => {                                                   // cumulative fraction of the salt that has crystallised
        const sm = (x, a, b) => clamp((x - a) / (b - a), 0, 1);
        return 0.0035 * sm(cf, 2, 5) + 0.0385 * sm(cf, 5.3, 10) + 0.78 * sm(cf, 10.5, 26) + 0.178 * sm(cf, 26, 90);
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05);
        const f = V.ev / 100, S = V.S, Seff = Math.min(S / Math.max(1 - f, 0.02), 450);
        const cf = Seff / 35;                                                    // concentration factor relative to the open ocean
        const cum = S <= 60 ? progress(cf) : 0;                                  // the sequence is for ocean-type water only
        const sOrig = S, wOrig = 1000 - S;                                          // g of salt and of water in one kilogram of the sample
        const sDis = sOrig * (1 - cum), wLeft = wOrig * (1 - f);
        const Ssol = Math.min(1000 * sDis / Math.max(sDis + wLeft, 1e-6), 450);   // salinity of the brine that remains, g/kg
        /* the pan */
        const px = 20, pw = Math.min(Wd * 0.5, 330), py = 36, ph = Hh - 80;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(px, py, pw, ph);
        const depth = (1 - f) * ph * 0.8;
        const bandH = ph * 0.2;
        const waterTop = py + ph - Math.max(bandH + 4, depth + 4);
        c.fillStyle = 'rgba(70,150,235,' + (0.25 + 0.25 * clamp(Seff / 350, 0, 1)).toFixed(2) + ')'; c.fillRect(px + 1, waterTop, pw - 2, py + ph - waterTop - 1);
        const nShown = Math.round(clamp(N0 * S / 35 * 0.55, 6, 300));
        for (let k = 0; k < nShown && k < dots.length; k++) {
          const q = dots[k];
          const settled = q.u < cum;
          if (settled) {
            let li = 0; while (li < 3 && q.u > CUT[li + 1]) li++;
            const y = py + ph - 3 - q.u * bandH * 1.0 - (k % 3);
            c.fillStyle = LAYERS[li][2]; c.beginPath(); c.arc(px + 4 + q.x * (pw - 8), clamp(y, py + ph - bandH, py + ph - 3), 2.4, 0, TAU); c.fill();
          } else {
            q.vx += randn() * 0.04; q.vy += randn() * 0.04; q.vx *= 0.9; q.vy *= 0.9; q.x = clamp(q.x + q.vx * 0.05, 0.02, 0.98); q.y = clamp(q.y + q.vy * 0.05, 0.02, 0.98);
            const y = waterTop + 3 + q.y * Math.max(8, py + ph - bandH - waterTop - 6);
            c.fillStyle = SP[q.sp][1]; c.beginPath(); c.arc(px + 4 + q.x * (pw - 8), y, 2.2, 0, TAU); c.fill();
          }
        }
        kit.label(c, V.ev > 0 ? 'the pan, ' + Math.round(V.ev) + ' % evaporated' : 'the sample', px, py - 10, { size: 12, color: C.text, weight: 600 });
        /* the recipe */
        const bx = px + pw + 30, bw = Wd - bx - 16;
        kit.label(c, 'what is dissolved (g per kg of water + salt)', bx, py - 10, { size: 12, color: C.text, weight: 600 });
        W.SEAWATER.ions.slice(0, 8).forEach((ion, k) => {
          const gkg = ion[1] * Ssol / 35, y = py + 10 + k * 26;
          const share = ion[1] / 35;
          c.fillStyle = k === 0 ? '#1fb01f' : k === 1 ? '#ab5cf2' : k === 2 ? '#e0e060' : k === 3 ? '#f0a030' : k === 4 ? '#40a0d0' : k === 5 ? '#d070b0' : C.muted;
          c.fillRect(bx, y, Math.max(2, (bw - 90) * share / 0.56), 14);
          kit.label(c, ion[0], bx + Math.max(2, (bw - 90) * share / 0.56) + 6, y + 7, { size: 11.5, color: C.text, baseline: 'middle' });
          kit.label(c, sig(gkg, 3), Wd - 16, y + 7, { size: 11.5, color: C.muted, align: 'right', baseline: 'middle' });
        });
        // the layers' key
        LAYERS.forEach((l, k) => { const y = py + 236 + k * 18; c.fillStyle = l[2]; c.fillRect(bx, y, 14, 12); c.strokeStyle = C.faint; c.strokeRect(bx, y, 14, 12); kit.label(c, l[0], bx + 22, y + 6, { size: 11.5, color: C.muted, baseline: 'middle' }); });
        kit.label(c, 'in order of crystallising', bx, py + 222, { size: 11, color: C.muted });
        /* read-outs */
        const rho = W.densityBrine(Ssol, V.T);
        ro.set('S', sig(Ssol, 3) + ' g/kg' + (cum > 0.001 ? ' (the brine left)' : ''));
        ro.set('rho', sig(rho, 4) + ' kg/m³');
        ro.set('fp', Ssol <= 60 ? sig(-0.0548 * Ssol, 3) + ' °C' : 'not by the dilute law (see the colligative page)');
        ro.set('pi', Ssol <= 60 ? sig(W.osmoticPressure(1.08 * Ssol / 35 * 0.998, 1, 298.15) / 1e5, 3) + ' bar' : '—');
        ro.set('float', sig(Math.min(100, 98500 / rho), 3) + ' % (a person of 985 kg/m³)');
        ro.set('stage', S > 60 ? 'brine of a different mix (the sequence is for ocean-type water)' : cf < 2 ?'nothing has crystallised' : cf < 5.3 ? 'calcium carbonate' : cf < 10.5 ? 'carbonate and gypsum' : cf < 26 ? 'halite is crystallising' : 'bittern salts are crystallising');
        const pts = [];
        for (let s = 0; s <= 350; s += 10) pts.push([s, W.densityBrine(s, V.T)]);
        plot.set({ series: [{ pts, label: 'density at ' + V.T + ' °C', color: C.accent }], x: { label: 'salinity (g/kg)', min: 0, max: 350 }, y: { label: 'density (kg/m³)' }, marks: [{ x: Math.min(Ssol, 350), y: rho, label: 'now' }], vlines: [{ x: 35, label: 'open ocean' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. conductivity and pH */
  /* Pure water: κ = F √Kw (λH + λOH), from kit.water's Kw(T) and limiting ionic conductivities (Robinson & Stokes). Salt: NaCl molar conductivity against
   * concentration at 25 °C (CRC) times the viscosity ratio η(25 °C)/η(T) from kit.water. Air: CO₂ at 4.2e-4 atm with Henry's law and the first dissociation
   * constant of carbonic acid (approximate pK1 against temperature). */
  const LAMH = [[0, 225], [18, 315], [25, 349.8], [35, 397], [45, 441], [55, 483], [100, 646]];
  const LAMOH = [[0, 105], [18, 171], [25, 198.6], [35, 233], [45, 267], [55, 301], [100, 450]];
  const LAMNACL = [[-4, 125.5], [-3, 123.7], [-2, 118.5], [-1, 106.7], [-0.3, 93.6], [0, 85.8], [0.3, 74.5], [0.6, 60]];       // log10(mol/L) → S·cm²/mol at 25 °C
  const PK1 = [[0, 6.58], [25, 6.35], [50, 6.30], [100, 6.45]];
  Hyper.sim('sol-conductivity-ph', {
    title: 'How well water conducts, and its pH',
    blurb: `The conductivity of pure water comes from its own ions, 10⁻⁷ mol/L of H₃O⁺ and OH⁻ at 25 °C, carried by the fastest ions there are. The meter is logarithmic: from the 0.055 µS/cm floor to sea water at 53,000 µS/cm. Add salt, or let the water breathe air (CO₂), and the reading climbs. The coloured strip is the pH scale, with the neutral point of **this** temperature marked: it is 7 only at 25 °C. (The pure-water and carbonic-acid ions follow from the ion product $K_w$ and Henry's law; the salt conductivities, scaled by the viscosity, are approximate above 50 °C.)

**Try this**
- Heat the water to 100 °C: pH of neutral water falls to 6.13 and the conductivity rises 15-fold.
- Add 10 mg/L of salt: a pinch, and the conductivity is 400 times the pure water's.
- Tick *open to the air*: a breath of CO₂ takes the pure water to pH 5.6 and about 1 µS/cm.
- Put in 28,000 mg/L of NaCl: 4.5 S/m, close to the sea's 5.3 S/m (the sea has other ions too).`,
    mount(box, kit, params) {
      const W = kit.water;
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250, maxH: 340 });
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: params.T != null ? params.T : 25, unit: '°C' },
        { id: 'dose', label: 'Salt (NaCl) dissolved', min: 0.01, max: 40000, value: 0.01, log: true, unit: 'mg/L', sig: 2 },
        { id: 'air', type: 'check', label: 'Open to the air (CO₂ dissolves)', value: false }
      ]);
      const V = ctl.values;
      const ro = kit.readout(box.side, [['k', 'Conductivity'], ['r', 'Resistivity'], ['pH', 'pH of this water'], ['pHn', 'pH of neutral water at this temperature'], ['Kw', 'Ion product K_w'], ['frac', 'Molecules ionised (pure water)'], ['kpure', 'Pure water alone at this temperature']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', min: 0, max: 100 }, y: { label: 'pK_w and neutral pH' }, legend: true }, 180);
      const MARKS = [[0.055, 'ultrapure'], [1, 'distilled'], [15, 'rain'], [300, 'tap'], [2500, 'EU limit'], [53000, 'sea water']];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T;
        const Kw = W.Kw(T), pKw = W.pKw(T), pHn = pKw / 2, H0 = Math.sqrt(Kw);
        const lamH = W.interp(LAMH, T), lamOH = W.interp(LAMOH, T);
        const walden = W.viscosity(25) / W.viscosity(T);
        const kPure = H0 * 1e-3 * (lamH + lamOH) * 1e6;                           // µS/cm
        let kWater = kPure, pH = pHn;
        if (V.air) {
          const Ka1 = Math.pow(10, -W.interp(PK1, T)), kHc = W.henry('CO2', T);
          const H = Math.sqrt(Ka1 * kHc * 4.2e-4 + Kw);
          kWater = H * 1e-3 * (lamH + 44.5 * walden) * 1e6; pH = -Math.log10(H);
        }
        const dose = V.dose > 0.02 ? V.dose : 0;
        const cNa = dose / 58440;                                                // mol/L
        const kSalt = dose > 0 ? cNa * 1e-3 * W.interp(LAMNACL, Math.log10(cNa)) * walden * 1e6 : 0;
        const k = kWater + kSalt;                                                // µS/cm
        /* the log meter */
        const mx0 = 24, mx1 = Wd - 24, my = 62, lo = -2, hi = 5, X = v => mx0 + (Math.log10(Math.max(v, 1e-2)) - lo) / (hi - lo) * (mx1 - mx0);
        kit.label(c, 'conductivity, µS/cm (logarithmic)', mx0, 20, { size: 12, color: C.text, weight: 600 });
        c.fillStyle = C.grid; c.fillRect(mx0, my - 5, mx1 - mx0, 10);
        c.fillStyle = C.accent; c.fillRect(mx0, my - 5, X(k) - mx0, 10);
        for (let e = lo; e <= hi; e++) { const x = X(Math.pow(10, e)); c.fillStyle = C.faint; c.fillRect(x, my - 9, 1, 18); kit.label(c, '10' + (e < 0 ? '⁻' : '') + '⁰¹²³⁴⁵⁶⁷⁸⁹'[Math.abs(e)], x, my + 22, { size: 10.5, color: C.muted, align: 'center' }); }
        MARKS.forEach(([v, lab], i) => { const x = X(v); c.fillStyle = C.warn; c.beginPath(); c.moveTo(x, my - 6); c.lineTo(x - 4, my - 14); c.lineTo(x + 4, my - 14); c.fill(); kit.label(c, lab, x, my - 18 - (i % 2) * 12, { size: 10.5, color: C.warn, align: 'center' }); });
        kit.arrow(c, X(k), my + 44, X(k), my + 8, C.bad, 2.5);
        kit.label(c, sig(k, 3) + ' µS/cm', X(k), my + 54, { size: 12.5, color: C.bad, align: 'center', weight: 700 });
        /* the pH strip */
        const sy = Hh - 70, sx0 = 24, sx1 = Wd - 24, PX = p => sx0 + p / 14 * (sx1 - sx0);
        kit.label(c, 'pH', sx0, sy - 16, { size: 12, color: C.text, weight: 600 });
        for (let p = 0; p < 14; p += 0.25) { c.fillStyle = 'hsl(' + (p / 14 * 270) + ' 70% 55%)'; c.fillRect(PX(p), sy, PX(p + 0.25) - PX(p) + 1, 16); }
        for (let p = 0; p <= 14; p += 2) kit.label(c, String(p), PX(p), sy + 28, { size: 10.5, color: C.muted, align: 'center' });
        kit.arrow(c, PX(pHn), sy - 14, PX(pHn), sy - 1, C.text, 2);
        kit.label(c, 'neutral at ' + T + ' °C: ' + pHn.toFixed(2), PX(pHn), sy - 24, { size: 11.5, color: C.text, align: 'center', weight: 600 });
        kit.arrow(c, PX(pH), sy + 46, PX(pH), sy + 18, C.bad, 2.5);
        kit.label(c, 'this water: ' + pH.toFixed(2), PX(pH), sy + 58, { size: 11.5, color: C.bad, align: 'center', weight: 700 });
        ro.set('k', k >= 1e4 ? sig(k / 1e4, 3) + ' S/m  (' + sig(k, 3) + ' µS/cm)' : sig(k, 3) + ' µS/cm');
        ro.set('r', k > 0 ? (1e6 / k >= 1e6 ? sig(1 / k, 3) + ' MΩ·cm' : sig(1e6 / k, 3) + ' Ω·cm') : '—');
        ro.set('pH', pH.toFixed(2) + (pH < pHn - 0.05 ? ' (acidic for this temperature)' : pH > pHn + 0.05 ? ' (basic for this temperature)' : ' (neutral)'));
        ro.set('pHn', pHn.toFixed(2));
        ro.set('Kw', sig(Kw, 3) + ' mol²/L²  (pK_w ' + pKw.toFixed(2) + ')');
        ro.set('frac', 'one in ' + sig(1 / W.ionFraction(T), 3));
        ro.set('kpure', sig(kPure, 3) + ' µS/cm  (' + sig(1 / kPure, 3) + ' MΩ·cm)');
        const a = [], b = [];
        for (let TT = 0; TT <= 100; TT += 5) { a.push([TT, W.pKw(TT)]); b.push([TT, W.pHneutral(TT)]); }
        plot.set({ series: [{ pts: a, label: 'pK_w', color: C.accent }, { pts: b, label: 'pH of neutral water', color: C.warn }], x: { label: 'temperature (°C)', min: 0, max: 100 }, y: { label: 'pK_w and neutral pH', min: 5, max: 16 }, marks: [{ x: T, y: pHn, label: 'now' }], hlines: [{ y: 7, label: 'pH 7' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 9. the kettle */
  /* Scale per boil = (hardness × carbonate share − 15 mg/L left in solution) × volume; the precipitation with temperature is drawn (smooth between 35 and 100 °C);
   * the thickness assumes a third of the scale sticks to 100 cm² of element at 1.5 g/cm³ — schematic. Soap: two stearate anions per divalent ion. */
  Hyper.sim('sol-hard-water', {
    title: 'The kettle and the limescale',
    blurb: `Press *Heat the kettle*. Dissolved calcium and hydrogen carbonate (the ions at the start) turn back into solid **calcium carbonate** as the water warms, releasing CO₂ bubbles; the crystals sink and cling to the element. The read-outs tell you how much scale one boil leaves, how much builds up in a year, and how much soap a bath of this water would waste. (Schematic: the thickness assumes a third of the scale sticks to a 100 cm² element; the amounts are the chemistry.)

**Try this**
- Compare a soft water (30 mg/L) with a very hard one (270 mg/L, like London's).
- Lower the *carbonate share*: with more permanent hardness (sulfate, chloride) boiling removes less.
- Run the *days* slider to see the element fur over.
- Hardness in other units: 1 °dH = 17.85 mg/L, 1 mmol/L = 100 mg/L.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Hardness (mg/L as CaCO₃)', min: 0, max: 500, step: 5, value: params.H != null ? params.H : 200, unit: 'mg/L' },
        { id: 'share', label: 'Carbonate (temporary) share of the hardness', min: 10, max: 100, step: 5, value: 70, unit: '%' },
        { id: 'V', label: 'Water in the kettle', min: 0.5, max: 2, step: 0.1, value: 1.5, unit: 'L' },
        { id: 'boils', label: 'Boils per day', min: 1, max: 10, step: 1, value: 5 },
        { id: 'days', label: 'Days of use', min: 0, max: 365, step: 5, value: 120, unit: 'days' },
        { type: 'buttons', items: [{ id: 'heat', label: 'Heat the kettle', primary: true }, { id: 'cool', label: 'Cool it' }] }
      ], (id) => { if (id === 'heat') heating = true; if (id === 'cool') { heating = false; Tw = 20; crystals.length = 0; } });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cls', 'Class (USGS scale)'], ['units', 'In other units'], ['boil', 'Scale left by one boil'], ['year', 'Scale in a year at this use'], ['days', 'Scale after the days chosen'], ['thick', 'Thickness on the element (schematic)'], ['soap', 'Soap lost to scum in a 150 L bath']]);
      let heating = false, Tw = 20, crystals = [], bubbles = [], ions = [];
      for (let k = 0; k < 70; k++) ions.push({ x: Math.random(), y: Math.random(), vx: 0, vy: 0, ca: k % 3 !== 0, u: Math.random() });
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const h = Math.min(dt, 0.05);
        if (heating && Tw < 100) Tw = Math.min(100, Tw + 14 * h);
        const Hd = V.H, share = V.share / 100;
        const perBoil = Math.max(0, Hd * share - 15) * V.V;                      // mg
        const perYear = perBoil * V.boils * 365 / 1000;                          // g
        const massDays = perBoil * V.boils * V.days / 1000;                     // g
        const thick = massDays * 0.3 / (1.5 * 100) * 10;                         // mm
        const phi = clamp((Tw - 35) / 65, 0, 1), phiS = phi * phi * (3 - 2 * phi);
        const limit = Math.max(0, Math.min(1, perBoil / Math.max(1, Hd * V.V)));  // share of the hardness that crystallises
        /* kettle */
        const kx = 30, kw = Math.min(Wd * 0.42, 270), ky = 40, kh = Hh - 90;
        c.strokeStyle = C.text; c.lineWidth = 2.5;
        c.beginPath(); c.moveTo(kx + 14, ky + kh); c.lineTo(kx, ky + 30); c.quadraticCurveTo(kx + kw * 0.5, ky - 12, kx + kw, ky + 30); c.lineTo(kx + kw - 14, ky + kh); c.closePath(); c.stroke();
        c.fillStyle = 'rgba(70,150,235,0.32)'; c.beginPath(); c.moveTo(kx + 15, ky + kh - 2); c.lineTo(kx + 4, ky + 56); c.lineTo(kx + kw - 4, ky + 56); c.lineTo(kx + kw - 15, ky + kh - 2); c.closePath(); c.fill();
        // spout and handle
        c.beginPath(); c.moveTo(kx + kw - 4, ky + 40); c.lineTo(kx + kw + 36, ky + 26); c.stroke();
        c.beginPath(); c.moveTo(kx + 8, ky + 40); c.bezierCurveTo(kx - 38, ky + 10, kx - 38, ky + kh - 10, kx + 14, ky + kh - 20); c.stroke();
        // the element and its scale
        const ey = ky + kh - 22, ex0 = kx + 28, ex1 = kx + kw - 28, layer = clamp(thick * 6, 0, 20);
        c.fillStyle = Tw > 90 ? C.bad : C.muted; c.fillRect(ex0, ey - 3, ex1 - ex0, 6);
        if (layer > 0.3) { c.fillStyle = 'rgba(245,242,232,0.95)'; for (let x = ex0; x < ex1; x += 6) { const hh = layer * (0.6 + 0.4 * Math.abs(Math.sin(x * 0.9))); c.fillRect(x, ey - 3 - hh, 5, hh * 2 + 6); } }
        // ions: Ca²⁺ and HCO₃⁻ dissolved; those that crystallise sink to the element
        for (const q of ions) {
          const goes = q.u < limit * phiS && q.ca;
          if (goes) { q.y = Math.min(0.97, q.y + h * (0.1 + 0.5 * phiS)); q.x += (0.5 - q.x) * h * 0.2; }
          else { q.vx += randn() * 0.03; q.vy += randn() * 0.03; q.vx *= 0.9; q.vy *= 0.9; q.x = clamp(q.x + q.vx * 0.05, 0.03, 0.97); q.y = clamp(q.y + q.vy * 0.05, 0.03, 0.97); }
          const x = kx + 18 + q.x * (kw - 36), y = ky + 62 + q.y * (kh - 100);
          c.fillStyle = goes && q.y > 0.7 ? '#f5f2e8' : q.ca ? '#40a0d0' : '#e89030'; c.beginPath(); c.arc(x, y, goes && q.y > 0.7 ? 3.4 : 2.6, 0, TAU); c.fill();
        }
        // CO₂ bubbles while heating
        if (heating && phi > 0.02 && Tw < 100.1) { const n = phi * 160 * h * limit; for (let k = 0; k < n + Math.random(); k++) if (Math.random() < n) bubbles.push({ x: kx + 20 + Math.random() * (kw - 40), y: ey - 6, v: rnd(30, 60) }); }
        if (heating && Tw >= 100) for (let k = 0; k < 3; k++) if (Math.random() < 0.5) bubbles.push({ x: kx + 20 + Math.random() * (kw - 40), y: ey - 6, v: rnd(60, 110) });
        c.fillStyle = 'rgba(255,255,255,0.8)';
        for (const b of bubbles) { b.y -= b.v * h; c.beginPath(); c.arc(b.x, b.y, 2.2, 0, TAU); c.fill(); }
        bubbles = bubbles.filter(b => b.y > ky + 56);
        S.thermometer(c, kx + kw + 74, ky + 10, kh - 20, Tw, { min: 0, max: 110 });
        kit.label(c, 'dissolved: Ca²⁺ (blue), HCO₃⁻ (orange); white: CaCO₃ scale', kx, Hh - 12, { size: 11.5, color: C.muted });
        kit.label(c, Math.round(Tw) + ' °C', kx + kw + 74, ky - 6, { size: 12, color: C.text, align: 'center', weight: 600 });
        if (layer > 0.3) kit.label(c, 'scale on the element after ' + Math.round(V.days) + ' days: about ' + sig(thick, 2) + ' mm', ex0, ey + 24, { size: 11.5, color: C.text });
        /* read-outs */
        ro.set('cls', Hd <= 60 ? 'soft (0–60 mg/L)' : Hd <= 120 ? 'moderately hard (61–120)' : Hd <= 180 ? 'hard (121–180)' : 'very hard (above 180)');
        ro.set('units', sig(Hd / 100.09, 3) + ' mmol/L · ' + sig(Hd / 17.848, 3) + ' °dH · ' + sig(Hd / 10, 3) + ' °fH · ' + sig(Hd / 14.25, 3) + ' °Clark');
        ro.set('boil', sig(perBoil, 3) + ' mg');
        ro.set('year', sig(perYear, 3) + ' g (' + sig(perYear / 2.71, 3) + ' cm³ of calcite)');
        ro.set('days', sig(massDays, 3) + ' g in ' + Math.round(V.days) + ' days');
        ro.set('thick', sig(thick, 2) + ' mm');
        ro.set('soap', sig(2 * (Hd / 100.09) * 150 * 306.5 / 1000, 3) + ' g of sodium stearate');
      }, box.stage);
      loop.start();
    }
  });
})();
