/* HYPER-CHEMISTRY · sims/organic.js — simulations for organic chemistry: turning about
 * single bonds, functional groups and isomers in 3-D, chirality and mirror images,
 * substitution mechanisms, Markovnikov addition, polymer growth and amino-acid charge. */
(function () {
  'use strict';

  const d2r = Math.PI / 180;
  const R_GAS = 8.314462618, KB = 1.380649e-23, H_PL = 6.62607015e-34;
  const SUBS = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const pretty = f => String(f).replace(/\d/g, d => SUBS[d]);

  /* ---------------------------------------------------------------- vectors */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = a => Math.hypot(a[0], a[1], a[2]);
  const unit = a => { const n = norm(a) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
  const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

  /* place atom d bonded to c: |cd| = len, angle b–c–d = ang, dihedral a–b–c–d = dih (degrees) */
  function nerf(a, b, c, len, ang, dih) {
    const bc = unit(sub(c, b));
    let n = cross(sub(b, a), bc);
    if (norm(n) < 1e-6) n = cross([0.3, 1, 0.2], bc);
    n = unit(n);
    const m = cross(n, bc), th = ang * d2r, ph = dih * d2r;
    return add(c, add(mul(bc, -len * Math.cos(th)), add(mul(m, len * Math.sin(th) * Math.cos(ph)), mul(n, len * Math.sin(th) * Math.sin(ph)))));
  }
  /* the two free tetrahedral positions on an atom P that already has neighbours N1 and N2 */
  function tetra2(P, N1, N2, len) {
    const v1 = unit(sub(N1, P)), v2 = unit(sub(N2, P));
    const d = unit(mul(add(v1, v2), -1)), n = unit(cross(v1, v2)), a = 54.75 * d2r;
    return [add(P, mul(add(mul(d, Math.cos(a)), mul(n, Math.sin(a))), len)), add(P, mul(add(mul(d, Math.cos(a)), mul(n, -Math.sin(a))), len))];
  }
  /* the one free position opposite the given neighbours (sp3 with three, sp2 with two) */
  function opposite(P, Ns, len) {
    let s = [0, 0, 0];
    for (const N of Ns) s = add(s, unit(sub(N, P)));
    return add(P, mul(unit(mul(s, -1)), len));
  }

  /* a molecule under construction: atoms in ångström, bonds [i, j, order] */
  function Mol() {
    const m = { atoms: [], bonds: [], lone: [] };
    // an atom index, or a point [x, y, z] used as a reference only
    const P = i => (Array.isArray(i) ? i : [m.atoms[i].x, m.atoms[i].y, m.atoms[i].z]);
    const at = (el, p, extra) => { m.atoms.push(Object.assign({ el, x: p[0], y: p[1], z: p[2] }, extra || {})); return m.atoms.length - 1; };
    const bond = (i, j, o) => { m.bonds.push([i, j, o || 1]); return j; };
    const api = {
      m, P, at, bond,
      /* new atom bonded to c, angle with b, dihedral with a */
      z: (el, c, len, b, ang, a, dih, order) => bond(c, at(el, nerf(P(a), P(b), P(c), len, ang, dih)), order),
      /* a methyl's (or NH3's) three hydrogens on c, bonded to b, staggered about b–c against a */
      H3: (c, b, a, len, start) => [0, 1, 2].map(k => bond(c, at('H', nerf(P(a), P(b), P(c), len || 1.09, 109.5, (start == null ? 60 : start) + 120 * k)))),
      H2: (c, n1, n2, len) => tetra2(P(c), P(n1), P(n2), len || 1.09).map(p => bond(c, at('H', p))),
      H1: (c, ns, len) => bond(c, at('H', opposite(P(c), ns.map(P), len || 1.09))),
      /* n atoms around c, each at angle ang from the bond c → toward, starting at azimuth phase */
      U: (el, c, toward, n, len, ang, phase) => {
        const u = unit(sub(P(toward), P(c)));
        const e1 = unit(cross(u, Math.abs(u[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0])), e2 = cross(u, e1);
        const out = [];
        for (let k = 0; k < n; k++) {
          const a = ((phase || 0) + k * 360 / n) * d2r, t = ang * d2r;
          const dir = add(mul(u, Math.cos(t)), mul(add(mul(e1, Math.cos(a)), mul(e2, Math.sin(a))), Math.sin(t)));
          out.push(bond(c, at(el, add(P(c), mul(dir, len)))));
        }
        return out;
      },
      done: () => m
    };
    return api;
  }
  const centreOf = mol => {
    const n = mol.atoms.length || 1;
    return mol.atoms.reduce((s, a) => [s[0] + a.x / n, s[1] + a.y / n, s[2] + a.z / n], [0, 0, 0]);
  };
  const extentOf = mol => {
    const c = centreOf(mol);
    let e = 0.5;
    for (const a of mol.atoms) e = Math.max(e, Math.hypot(a.x - c[0], a.y - c[1], a.z - c[2]));
    return e;
  };
  /* molecular formula in Hill order (C, H, then alphabetical) */
  function formulaOf(mol) {
    const n = {};
    for (const a of mol.atoms) n[a.el] = (n[a.el] || 0) + 1;
    const keys = Object.keys(n).sort((p, q) => (p === 'C' ? -2 : p === 'H' ? -1 : 0) - (q === 'C' ? -2 : q === 'H' ? -1 : 0) || (p < q ? -1 : p > q ? 1 : 0));
    const hill = n.C ? keys : Object.keys(n).sort();
    return hill.map(k => k + (n[k] > 1 ? n[k] : '')).join('');
  }
  /* the atoms of a substituent: everything reached from root without passing through centre */
  function groupAtoms(mol, centre, root) {
    const seen = new Set([centre, root]), out = [root], stack = [root];
    while (stack.length) {
      const i = stack.pop();
      for (const [a, b] of mol.bonds) {
        const j = a === i ? b : b === i ? a : -1;
        if (j >= 0 && !seen.has(j)) { seen.add(j); out.push(j); stack.push(j); }
      }
    }
    return out;
  }

  /* ---------------------------------------------------------------- 3 × 3 orientations */
  const mmul = (A, B) => A.map(r => [0, 1, 2].map(j => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
  const mvec = (A, v) => [dot(A[0], v), dot(A[1], v), dot(A[2], v)];
  const transpose = A => [0, 1, 2].map(i => [A[0][i], A[1][i], A[2][i]]);
  const rotY = t => [[Math.cos(t), 0, Math.sin(t)], [0, 1, 0], [-Math.sin(t), 0, Math.cos(t)]];
  const rotX = t => [[1, 0, 0], [0, Math.cos(t), -Math.sin(t)], [0, Math.sin(t), Math.cos(t)]];
  /* rotation by angle t about the unit axis u */
  function axisRot(u, t) {
    const c = Math.cos(t), s = Math.sin(t), C1 = 1 - c, [x, y, z] = u;
    return [[c + x * x * C1, x * y * C1 - z * s, x * z * C1 + y * s], [y * x * C1 + z * s, c + y * y * C1, y * z * C1 - x * s], [z * x * C1 - y * s, z * y * C1 + x * s, c + z * z * C1]];
  }
  /* axis and angle of a rotation matrix */
  function axisAngle(Rm) {
    const tr = Rm[0][0] + Rm[1][1] + Rm[2][2];
    const t = Math.acos(clamp((tr - 1) / 2, -1, 1));
    if (t < 1e-6) return { u: [1, 0, 0], t: 0 };
    if (Math.PI - t < 1e-4) {
      // a half turn: the axis from the diagonal
      const x = Math.sqrt(Math.max(0, (Rm[0][0] + 1) / 2)), y = Math.sqrt(Math.max(0, (Rm[1][1] + 1) / 2)), z = Math.sqrt(Math.max(0, (Rm[2][2] + 1) / 2));
      const u = [x, Rm[0][1] >= 0 ? y : -y, Rm[0][2] >= 0 ? z : -z];
      return { u: unit(u), t };
    }
    return { u: unit([Rm[2][1] - Rm[1][2], Rm[0][2] - Rm[2][0], Rm[1][0] - Rm[0][1]]), t };
  }
  /* an orthonormal frame (as rows) from two directions: the first exactly, the second in the plane */
  function basis(a, b) {
    const f1 = unit(a), f2 = unit(sub(b, mul(f1, dot(b, f1)))), f3 = cross(f1, f2);
    return [f1, f2, f3];
  }
  /* draw a molecule turned by the orientation O about its own centre, at (cx, cy) */
  const DIST = 12;
  function drawTurned(kit, ctx, mol, O, o) {
    const c = o.centre || centreOf(mol);
    const atoms = mol.atoms.map(a => { const p = mvec(O, [a.x - c[0], a.y - c[1], a.z - c[2]]); return Object.assign({}, a, { x: p[0], y: p[1], z: p[2] }); });
    const view = { rotX: 0, rotY: 0, scale: o.scale, dist: DIST };
    const pts = kit.mol.draw(ctx, { atoms, bonds: mol.bonds, lone: mol.lone || [] }, view, Object.assign({}, o, { centre: [0, 0, 0] }));
    return { pts, world: atoms };
  }
  /* screen position of a turned point, the same projection as kit.mol */
  const project = (p, scale, cx, cy) => { const f = DIST / (DIST - p[2]); return { x: cx + p[0] * scale * f, y: cy - p[1] * scale * f, f }; };

  /* R or S from the directions (centre → group) of priorities 1, 2, 3 */
  const handedness = (v1, v2, v3) => (dot(v1, cross(v2, v3)) < 0 ? 'R' : 'S');

  /* Eyring rate constant (1/s or 1/(M·s)) for a free-energy barrier in kJ/mol */
  const eyring = (G, T) => KB * T / H_PL * Math.exp(-G * 1000 / (R_GAS * T));

  /* rich text on the canvas: [[text, colour], ...] one after another */
  function spans(c, kit, parts, x, y, o) {
    o = o || {};
    const size = o.size || 14;
    c.save();
    c.font = (o.weight || 600) + ' ' + size + 'px "Segoe UI", system-ui, sans-serif';
    let w = 0;
    for (const [t] of parts) w += c.measureText(t).width;
    let px = o.align === 'center' ? x - w / 2 : o.align === 'right' ? x - w : x;
    c.restore();
    for (const [t, col] of parts) {
      kit.label(c, t, px, y, { size, weight: o.weight || 600, color: col });
      c.save(); c.font = (o.weight || 600) + ' ' + size + 'px "Segoe UI", system-ui, sans-serif'; px += c.measureText(t).width; c.restore();
    }
  }

  /* ================================================================ conformations */
  // butane: E(φ) = a0 + a1 cos φ + a2 cos 2φ + a3 cos 3φ, fitted to anti 0, gauche 3.8,
  // CH3/H eclipsed 16 and CH3/CH3 eclipsed 19 kJ/mol; ethane: 12 kJ/mol threefold barrier
  const BUT = [9.766667, 2.266667, -0.266667, 7.233333];
  const E_CONF = {
    ethane: p => 6 * (1 + Math.cos(3 * p * d2r)),
    butane: p => BUT[0] + BUT[1] * Math.cos(p * d2r) + BUT[2] * Math.cos(2 * p * d2r) + BUT[3] * Math.cos(3 * p * d2r)
  };
  function confName(kind, p) {
    p = ((p % 360) + 360) % 360;
    const near = t => Math.min(Math.abs(p - t), 360 - Math.abs(p - t)) <= 15;
    if (kind === 'ethane') {
      if ([0, 120, 240].some(near)) return 'eclipsed';
      if ([60, 180, 300].some(near)) return 'staggered';
      return 'skew (in between)';
    }
    if (near(180)) return 'anti (staggered)';
    if (near(60) || near(300)) return 'gauche (staggered)';
    if (near(120) || near(240)) return 'eclipsed (CH₃ over H)';
    if (near(0)) return 'fully eclipsed (CH₃ over CH₃)';
    return 'skew (in between)';
  }
  function buildConf(kind, phi) {
    const b = Mol();
    const s = Math.sin(109.5 * d2r), k = Math.cos(109.5 * d2r);
    const c2 = b.at('C', [-0.77, 0, 0]), c3 = b.at('C', [0.77, 0, 0]);
    b.bond(c2, c3, 1);
    const front = [], back = [];
    for (let j = 0; j < 3; j++) {
      const a1 = (90 + 120 * j) * d2r, a2 = (90 + phi + 120 * j) * d2r;
      const heavy = kind === 'butane' && j === 0;
      const L = heavy ? 1.54 : 1.09;
      front.push(b.bond(c2, b.at(heavy ? 'C' : 'H', [-0.77 + L * k, L * s * Math.cos(a1), L * s * Math.sin(a1)])));
      back.push(b.bond(c3, b.at(heavy ? 'C' : 'H', [0.77 - L * k, L * s * Math.cos(a2), L * s * Math.sin(a2)])));
    }
    if (kind === 'butane') { b.H3(front[0], c2, c3); b.H3(back[0], c3, c2); }
    return { mol: b.done(), c2, c3, front, back };
  }

  Hyper.sim('org-conformations', {
    title: 'Turning about a single bond: ethane and butane',
    blurb: `The two middle carbons are joined by a σ bond, which lets the ends turn freely — but not for free. Set the **dihedral angle** with the slider (or drag the molecule) and watch the energy follow; the Newman projection on the right looks straight down the C–C bond.

- Ethane: three equal wells (staggered) and three equal humps (eclipsed), 12 kJ/mol apart.
- Butane: the **anti** well at 180° is lowest; the two **gauche** wells at 60° and 300° sit 3.8 kJ/mol higher, because the methyl groups touch.
- Tick **Thermal motion**: the molecule is kicked at random and spends most of its time in the wells. The dots on the graph count where it has been; they build up the Boltzmann curve. Raise the temperature and the gauche share grows.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const k0 = params && params.mol === 'ethane' ? 'ethane' : 'butane';
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: [['Butane, CH₃CH₂–CH₂CH₃', 'butane'], ['Ethane, CH₃–CH₃', 'ethane']], value: k0 },
        { id: 'phi', label: 'Dihedral angle', min: 0, max: 360, step: 1, value: k0 === 'ethane' ? 60 : 180, unit: '°' },
        { id: 'thermal', type: 'check', label: 'Thermal motion (random kicks)', value: false },
        { id: 'T', label: 'Temperature', min: 100, max: 1000, step: 10, value: 298, unit: 'K' },
        { id: 'newman', type: 'check', label: 'Look along the C–C bond', value: false },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear the dots' }] }
      ], (id, v) => {
        if (id === 'mol') { phi = v === 'ethane' ? 60 : 180; ctl.set('phi', phi); clearHist(); curve(); }
        else if (id === 'phi') phi = v;
        else if (id === 'T') curve();
        else if (id === 'clear') clearHist();
        else if (id === 'newman') setView();
        loop.once();
      });
      const ro = kit.readout(box.side, [['phi', 'Dihedral angle'], ['E', 'Energy above the lowest'], ['name', 'Conformation'], ['pop', 'At this temperature'], ['rate', 'Hops over the lowest barrier']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'dihedral angle (°)', min: 0, max: 360 }, y: { label: 'energy (kJ/mol)', min: 0, max: 21 } }, 180);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.35, rotY: 0.55, scale: 62 });
      kit.mol.rotator(st, view, () => loop.once());
      let phi = V.phi, hist = new Array(72).fill(0), nh = 0, frameNo = 0;
      const clearHist = () => { hist = new Array(72).fill(0); nh = 0; curve(); };
      function setView() {
        if (V.newman) { view.rotY = Math.PI / 2 - 0.12; view.rotX = 0.1; } else { view.rotY = 0.55; view.rotX = -0.35; }
      }
      // Boltzmann weights over the circle, and the populations of the wells
      function boltz() {
        const E = E_CONF[V.mol], RT = R_GAS * V.T / 1000;
        const w = [];
        let Z = 0;
        for (let d = 0; d < 360; d += 1) { const x = Math.exp(-E(d) / RT); w.push(x); Z += x; }
        return { w: w.map(x => x / Z), Z };
      }
      function curve() {
        const E = E_CONF[V.mol];
        const pts = [];
        for (let d = 0; d <= 360; d += 2) pts.push([d, E(d)]);
        const b = boltz();
        const top = 20 / Math.max(...b.w);
        const pop = b.w.filter((_, i) => i % 2 === 0).map((x, i) => [i * 2, x * top]);
        const series = [{ pts, label: 'energy' }, { pts: pop, label: 'Boltzmann population (scaled)', dash: [5, 4] }];
        if (nh > 50) {
          const hm = Math.max(...hist) || 1, scale = top * Math.max(...b.w) * 5 / nh;
          void hm;
          series.push({ pts: hist.map((c, i) => [i * 5 + 2.5, c * scale]), label: 'where it has been (scaled)', line: false, dots: 3 });
        }
        plot.set({ series, y: { label: 'energy (kJ/mol)', min: 0, max: 21 }, marks: [{ x: phi, y: E(phi), label: Math.round(phi) + '°' }] });
      }
      // Metropolis steps on the energy curve: the thermal kicks
      function kick(n) {
        const E = E_CONF[V.mol], RT = R_GAS * V.T / 1000;
        for (let i = 0; i < n; i++) {
          const trial = phi + (Math.random() + Math.random() + Math.random() - 1.5) * 9;
          const dE = E(trial) - E(phi);
          if (dE <= 0 || Math.random() < Math.exp(-dE / RT)) phi = ((trial % 360) + 360) % 360;
          hist[Math.floor(phi / 5) % 72]++; nh++;
        }
      }
      function readouts() {
        const E = E_CONF[V.mol], b = boltz();
        ro.set('phi', Math.round(phi) + '°');
        ro.set('E', E(phi).toFixed(1) + ' kJ/mol');
        ro.set('name', confName(V.mol, phi));
        if (V.mol === 'butane') {
          let anti = 0;
          for (let d = 121; d < 240; d++) anti += b.w[d];
          ro.set('pop', Math.round(anti * 100) + ' % anti, ' + Math.round((1 - anti) * 100) + ' % gauche');
        } else {
          let stag = 0;
          for (let d = 0; d < 360; d++) if (Math.abs(((d % 120) + 120) % 120 - 60) <= 30) stag += b.w[d];
          ro.set('pop', Math.round(stag * 100) + ' % within 30° of staggered');
        }
        const barrier = V.mol === 'ethane' ? 12 : E(120) - E(180);
        const k = eyring(barrier, V.T);
        ro.set('rate', kit.fmt(k, 2) + ' per second');
      }
      function drawNewman(c, x0, y0, R, C) {
        const E = E_CONF[V.mol];
        c.beginPath(); c.arc(x0, y0, R, 0, Math.PI * 2);
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 2; c.stroke();
        const isMe = j => V.mol === 'butane' && j === 0;
        const colOf = el => kit.chem.el(el).color;
        // back carbon: bonds from the rim, turned by φ (drawn first, behind)
        for (let j = 0; j < 3; j++) {
          const a = (-90 + phi + 120 * j) * d2r;
          const x1 = x0 + R * Math.cos(a), y1 = y0 + R * Math.sin(a), x2 = x0 + R * 1.75 * Math.cos(a), y2 = y0 + R * 1.75 * Math.sin(a);
          c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
          kit.dot(c, x2, y2, isMe(j) ? 9 : 6, colOf(isMe(j) ? 'C' : 'H'), 'rgba(0,0,0,.5)');
          if (isMe(j)) kit.label(c, 'CH₃', x2 + 12 * Math.cos(a), y2 + 12 * Math.sin(a) + (Math.sin(a) > 0 ? 6 : -6), { size: 11.5, align: 'center', color: C.muted });
        }
        // front carbon: bonds from the centre
        for (let j = 0; j < 3; j++) {
          const a = (-90 + 120 * j) * d2r;
          const x2 = x0 + R * 1.45 * Math.cos(a), y2 = y0 + R * 1.45 * Math.sin(a);
          c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x2, y2); c.stroke();
          kit.dot(c, x2, y2, isMe(j) ? 9 : 6, colOf(isMe(j) ? 'C' : 'H'), 'rgba(0,0,0,.5)');
          if (isMe(j)) kit.label(c, 'CH₃', x2, y2 - 16, { size: 11.5, align: 'center', color: C.text });
        }
        kit.dot(c, x0, y0, 4, C.text);
        kit.label(c, 'Newman projection', x0, y0 + R * 1.75 + 22, { size: 12, align: 'center', color: C.muted });
        kit.label(c, 'φ = ' + Math.round(phi) + '°   E = ' + E(phi).toFixed(1) + ' kJ/mol', x0, y0 + R * 1.75 + 40, { size: 12.5, align: 'center', weight: 600 });
      }
      function frame(dt) {
        if (V.thermal && dt) {
          kick(12);
          ctl.set('phi', Math.round(phi));
        }
        const C = kit.colors();
        const c = st.begin();
        const built = buildConf(V.mol, phi);
        const W = st.W, Hh = st.H;
        const wMol = W * 0.6;
        view.scale = Math.min(wMol, Hh - 60) / (2 * (extentOf(built.mol) + 0.6));
        kit.mol.draw(c, built.mol, view, { cx: wMol / 2, cy: Hh / 2 + 12, labels: true, highlight: [built.c2, built.c3] });
        const E = E_CONF[V.mol];
        kit.label(c, (V.mol === 'ethane' ? 'Ethane' : 'Butane') + ': ' + confName(V.mol, phi), 14, 20, { size: 16, weight: 650 });
        kit.label(c, 'energy ' + E(phi).toFixed(1) + ' kJ/mol above the ' + (V.mol === 'ethane' ? 'staggered form' : 'anti form'), 14, 42, { size: 12.5, color: C.muted });
        kit.label(c, 'drag to turn', wMol - 10, Hh - 12, { size: 11, color: C.faint, align: 'right' });
        const R = Math.min((W - wMol) * 0.22, Hh * 0.16);
        drawNewman(c, wMol + (W - wMol) / 2, Hh * 0.42, R, C);
        frameNo++;
        const key = V.mol + '|' + Math.round(phi) + '|' + V.T;
        if (key !== lastKey && (!V.thermal || frameNo % 6 === 0 || !dt)) { lastKey = key; curve(); readouts(); }
      }
      let lastKey = '';
      setView();
      curve();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ functional groups in 3-D */
  function benzeneRing(b, r) {
    const ring = [];
    for (let k = 0; k < 6; k++) ring.push(b.at('C', [r * Math.cos(k * 60 * d2r), r * Math.sin(k * 60 * d2r), 0]));
    for (let k = 0; k < 6; k++) b.bond(ring[k], ring[(k + 1) % 6], k % 2 ? 1 : 2);
    return ring;
  }
  const radial = (b, ringAtom, len) => { const p = b.P(ringAtom); return mul(unit([p[0], p[1], 0]), norm([p[0], p[1], 0]) + len); };
  /* a chair ring: atoms at radius r, alternately ±h, numbered clockwise seen from +z */
  function chairRing(b, els, bond, angle) {
    const r = bond * Math.sqrt((2 - 2 * Math.cos(angle * d2r)) / 3), h = Math.sqrt(Math.max(0, bond * bond - r * r)) / 2;
    const ring = els.map((el, k) => b.at(el, [r * Math.cos(-k * 60 * d2r), r * Math.sin(-k * 60 * d2r), (k % 2 ? 1 : -1) * h]));
    ring.forEach((a, k) => b.bond(a, ring[(k + 1) % ring.length], 1));
    return ring;
  }
  /* axial and equatorial positions on ring atom k */
  function chairSlots(b, ring, k, len) {
    const P = b.P(ring[k]), [p1, p2] = tetra2(P, b.P(ring[(k + 5) % 6]), b.P(ring[(k + 1) % 6]), 1);
    const up = P[2] > 0 ? 1 : -1;
    const ax = (p1[2] - P[2]) * up > (p2[2] - P[2]) * up ? p1 : p2, eq = ax === p1 ? p2 : p1;
    return { ax: add(P, mul(unit(sub(ax, P)), len)), eq: add(P, mul(unit(sub(eq, P)), len)), axDir: unit(sub(ax, P)), eqDir: unit(sub(eq, P)) };
  }
  /* a C18 fatty acid, all-anti, with an optional cis C9=C10 double bond; C[1] is the carboxyl carbon */
  function fattyAcid(cis) {
    const b = Mol(), C = [];
    C[1] = b.at('C', [0, 0, 0]);
    C[2] = b.bond(C[1], b.at('C', [1.52, 0, 0]));
    const o1 = b.z('O', C[1], 1.21, C[2], 123, [1.52, 1, 0], 0, 2);
    const o2 = b.z('O', C[1], 1.34, C[2], 112, o1, 180);
    const ho = b.z('H', o2, 0.97, C[1], 107, o1, 0);
    for (let i = 3; i <= 18; i++) {
      const dbl = cis && i === 10;                                     // C9=C10
      const len = dbl ? 1.34 : (cis && (i === 9 || i === 11)) ? 1.50 : 1.53;
      const ang = (cis && (i === 10 || i === 11)) ? 124 : 113;          // the angle at C(i−1)
      const dih = (cis && i === 11) ? 0 : 180;                          // C8–C9=C10–C11 = 0: cis
      C[i] = b.z('C', C[i - 1], len, C[i - 2], ang, i === 3 ? o2 : C[i - 3], dih, dbl ? 2 : 1);
    }
    for (let i = 2; i <= 17; i++) {
      if (cis && (i === 9 || i === 10)) b.H1(C[i], [C[i - 1], C[i + 1]]);
      else b.H2(C[i], C[i - 1], C[i + 1]);
    }
    b.H3(C[18], C[17], C[16]);
    return { mol: b.done(), hl: [C[1], o1, o2, ho].concat(cis ? [C[9], C[10]] : []) };
  }

  const GALLERY = {
    ethene: {
      name: 'ethene (ethylene)', cls: 'alkene', group: 'C=C double bond', cond: 'CH2=CH2', bp: '−104 °C',
      use: 'the raw material for poly(ethene) and ethane-1,2-diol (antifreeze)',
      build: kit => ({ mol: kit.chem.molecule('C2H4'), hl: [0, 1] })
    },
    ethyne: {
      name: 'ethyne (acetylene)', cls: 'alkyne', group: 'C≡C triple bond', cond: 'HC≡CH', bp: '−84 °C (sublimes)',
      use: 'the oxy-acetylene welding flame, over 3000 °C',
      build: kit => ({ mol: kit.chem.molecule('C2H2'), hl: [0, 1] })
    },
    benzene: {
      name: 'benzene', cls: 'arene (aromatic)', group: 'benzene ring (six delocalised π electrons)', cond: 'C6H6', bp: '80 °C',
      use: 'the parent of styrene, phenol, nylon precursors and countless drugs; a carcinogen, so replaced by toluene as a solvent',
      build: kit => ({ mol: kit.chem.molecule('C6H6'), hl: [0, 1, 2, 3, 4, 5] })
    },
    chloromethane: {
      name: 'chloromethane', cls: 'haloalkane', group: 'C–halogen bond', cond: 'CH3Cl', bp: '−24 °C',
      use: 'a building block for silicones; made naturally by seaweed and fungi',
      build: () => {
        const b = Mol();
        const c = b.at('C', [0, 0, 0]), cl = b.bond(c, b.at('Cl', [1.78, 0, 0]));
        b.U('H', c, cl, 3, 1.09, 108.5, 90);
        return { mol: b.done(), hl: [c, cl] };
      }
    },
    ethanol: {
      name: 'ethanol', cls: 'alcohol (primary)', group: 'hydroxyl, –OH, on a carbon with one other carbon', cond: 'CH3CH2OH', bp: '78 °C',
      use: 'drinks, hand gel, fuel blended into petrol (E10)',
      build: kit => ({ mol: kit.chem.molecule('C2H5OH'), hl: [2, 3] })
    },
    propan2ol: {
      name: 'propan-2-ol (isopropyl alcohol)', cls: 'alcohol (secondary)', group: 'hydroxyl on a carbon with two other carbons', cond: 'CH3CH(OH)CH3', bp: '82 °C',
      use: 'rubbing alcohol and electronics cleaner',
      build: () => {
        const b = Mol();
        const c2 = b.at('C', [0, 0, 0]), c1 = b.bond(c2, b.at('C', [1.54, 0, 0]));
        const c3 = b.z('C', c2, 1.54, c1, 109.5, [1.54, 1, 0], 0);
        // O and H on the two free tetrahedral positions of C2
        const [pO, pH] = tetra2(b.P(c2), b.P(c1), b.P(c3), 1);
        const o = b.bond(c2, b.at('O', mul(pO, 1.43)));
        b.bond(c2, b.at('H', mul(pH, 1.09)));
        const ho = b.z('H', o, 0.96, c2, 109, c1, 180);
        b.H3(c1, c2, o); b.H3(c3, c2, o);
        return { mol: b.done(), hl: [o, ho] };
      }
    },
    ether: {
      name: 'methoxymethane (dimethyl ether)', cls: 'ether', group: 'C–O–C', cond: 'CH3OCH3', bp: '−24 °C',
      use: 'aerosol propellant; a clean-burning diesel substitute',
      build: () => {
        const b = Mol();
        const o = b.at('O', [0, 0, 0]), c1 = b.bond(o, b.at('C', [1.41, 0, 0]));
        const c2 = b.z('C', o, 1.41, c1, 111.7, [1.41, 1, 0], 0);
        b.H3(c1, o, c2, 1.09, 180); b.H3(c2, o, c1, 1.09, 180);
        return { mol: b.done(), hl: [o] };
      }
    },
    ethanal: {
      name: 'ethanal (acetaldehyde)', cls: 'aldehyde', group: 'C=O at the end of a chain, –CHO', cond: 'CH3CHO', bp: '20 °C',
      use: 'the product of alcohol metabolism in the liver, blamed for hangovers',
      build: () => {
        const b = Mol();
        const c1 = b.at('C', [0, 0, 0]), c2 = b.bond(c1, b.at('C', [1.50, 0, 0]));
        const o = b.z('O', c2, 1.21, c1, 124, [0, 1, 0], 0, 2);
        const h = b.z('H', c2, 1.11, c1, 116, o, 180);
        b.H3(c1, c2, o, 1.09, 0);
        return { mol: b.done(), hl: [c2, o, h] };
      }
    },
    propanone: {
      name: 'propanone (acetone)', cls: 'ketone', group: 'C=O between two carbons', cond: 'CH3COCH3', bp: '56 °C',
      use: 'nail-varnish remover, a solvent for plastics and paints',
      build: () => {
        const b = Mol();
        const c2 = b.at('C', [0, 0, 0]), c1 = b.bond(c2, b.at('C', [1.51, 0, 0]));
        const o = b.z('O', c2, 1.21, c1, 121.5, [1.51, 1, 0], 0, 2);
        const c3 = b.z('C', c2, 1.51, c1, 117, o, 180);
        b.H3(c1, c2, o, 1.09, 0); b.H3(c3, c2, o, 1.09, 0);
        return { mol: b.done(), hl: [c2, o] };
      }
    },
    acid: {
      name: 'ethanoic acid (acetic acid)', cls: 'carboxylic acid', group: 'carboxyl, –COOH', cond: 'CH3COOH', bp: '118 °C',
      use: 'vinegar (about 5 %), and the raw material for vinyl acetate and cellulose acetate',
      build: () => {
        const b = Mol();
        const c1 = b.at('C', [0, 0, 0]), c2 = b.bond(c1, b.at('C', [1.50, 0, 0]));
        const o1 = b.z('O', c2, 1.21, c1, 124, [0, 1, 0], 0, 2);
        const o2 = b.z('O', c2, 1.34, c1, 112, o1, 180);
        const h = b.z('H', o2, 0.97, c2, 107, o1, 0);
        b.H3(c1, c2, o1, 1.09, 0);
        return { mol: b.done(), hl: [c2, o1, o2, h] };
      }
    },
    ester: {
      name: 'ethyl ethanoate (ethyl acetate)', cls: 'ester', group: '–COO– joining two carbon groups', cond: 'CH3COOCH2CH3', bp: '77 °C',
      use: 'nail-varnish remover, glues, and the fruity smell of pear drops',
      build: () => {
        const b = Mol();
        const c1 = b.at('C', [0, 0, 0]), c2 = b.bond(c1, b.at('C', [1.50, 0, 0]));
        const o1 = b.z('O', c2, 1.21, c1, 125, [0, 1, 0], 0, 2);
        const o2 = b.z('O', c2, 1.34, c1, 111, o1, 180);
        const c3 = b.z('C', o2, 1.45, c2, 117, o1, 0);
        const c4 = b.z('C', c3, 1.52, o2, 108, c2, 180);
        b.H3(c1, c2, o1, 1.09, 0); b.H2(c3, o2, c4); b.H3(c4, c3, o2, 1.09, 60);
        return { mol: b.done(), hl: [c2, o1, o2] };
      }
    },
    amine: {
      name: 'methylamine', cls: 'amine (primary)', group: 'amino, –NH₂', cond: 'CH3NH2', bp: '−6 °C',
      use: 'made in industry for drugs, pesticides and solvents; part of the smell of rotting fish',
      build: () => {
        const b = Mol();
        const c = b.at('C', [0, 0, 0]), n = b.bond(c, b.at('N', [1.47, 0, 0]));
        const h1 = b.z('H', n, 1.01, c, 110, [0, 1, 0], 60), h2 = b.z('H', n, 1.01, c, 110, [0, 1, 0], 180);
        b.H3(c, n, h1, 1.09, 60);
        b.m.lone = [{ atom: n, dir: unit(sub(opposite(b.P(n), [b.P(c), b.P(h1), b.P(h2)], 1), b.P(n))) }];
        return { mol: b.done(), hl: [n, h1, h2] };
      }
    },
    amide: {
      name: 'ethanamide (acetamide)', cls: 'amide', group: '–CONH₂: C=O joined to nitrogen', cond: 'CH3CONH2', bp: '221 °C',
      use: 'the same link that joins amino acids in proteins, and nylon',
      build: () => {
        const b = Mol();
        const c1 = b.at('C', [0, 0, 0]), c2 = b.bond(c1, b.at('C', [1.51, 0, 0]));
        const o = b.z('O', c2, 1.23, c1, 122, [0, 1, 0], 0, 2);
        const n = b.z('N', c2, 1.33, c1, 116, o, 180);
        const h1 = b.z('H', n, 1.01, c2, 120, o, 0), h2 = b.z('H', n, 1.01, c2, 120, o, 180);
        b.H3(c1, c2, o, 1.09, 0);
        return { mol: b.done(), hl: [c2, o, n, h1, h2] };
      }
    },
    nitrile: {
      name: 'ethanenitrile (acetonitrile)', cls: 'nitrile', group: '–C≡N', cond: 'CH3CN', bp: '82 °C',
      use: 'the standard solvent of HPLC chromatography',
      build: () => {
        const b = Mol();
        const c1 = b.at('C', [0, 0, 0]), c2 = b.bond(c1, b.at('C', [1.46, 0, 0]));
        const n = b.bond(c2, b.at('N', [2.62, 0, 0]), 3);
        b.U('H', c1, c2, 3, 1.09, 109.5, 90);
        return { mol: b.done(), hl: [c2, n] };
      }
    },
    phenol: {
      name: 'phenol', cls: 'phenol', group: '–OH on a benzene ring', cond: 'C6H5OH', bp: '182 °C',
      use: 'the starting point for polycarbonate (via bisphenol A), phenolic resins and aspirin',
      build: () => {
        const b = Mol();
        const ring = benzeneRing(b, 1.39);
        for (let k = 1; k < 6; k++) b.bond(ring[k], b.at('H', radial(b, ring[k], 1.08)));
        const o = b.bond(ring[0], b.at('O', radial(b, ring[0], 1.36)));
        const h = b.z('H', o, 0.96, ring[0], 109, ring[1], 0);
        return { mol: b.done(), hl: [o, h] };
      }
    },
    aspirin: {
      name: 'aspirin (2-acetoxybenzoic acid)', cls: 'a drug with three groups', group: 'carboxylic acid, ester and benzene ring', cond: 'CH3COOC6H4COOH', bp: 'decomposes (melts at 136 °C)',
      use: 'pain relief and heart-attack prevention: about 100 billion tablets a year',
      build: () => {
        const b = Mol();
        const ring = benzeneRing(b, 1.39);
        for (let k = 2; k < 6; k++) b.bond(ring[k], b.at('H', radial(b, ring[k], 1.08)));
        const ca = b.bond(ring[0], b.at('C', radial(b, ring[0], 1.49)));
        const o1 = b.z('O', ca, 1.21, ring[0], 122, ring[1], 180, 2);
        const o2 = b.z('O', ca, 1.33, ring[0], 115, ring[1], 0);
        const ho = b.z('H', o2, 0.97, ca, 107, ring[0], 180);
        const oe = b.bond(ring[1], b.at('O', radial(b, ring[1], 1.39)));
        const ce = b.z('C', oe, 1.36, ring[1], 118, ring[0], 90);
        const oe2 = b.z('O', ce, 1.20, oe, 123, ring[1], 0, 2);
        const cm = b.z('C', ce, 1.50, oe, 111, ring[1], 180);
        b.H3(cm, ce, oe, 1.09, 60);
        return { mol: b.done(), hl: [ca, o1, o2, ho, oe, ce, oe2] };
      }
    },
    cyclohexane: {
      name: 'cyclohexane (chair)', cls: 'cycloalkane', group: 'a ring of six sp³ carbons; highlighted: the six axial H', cond: 'C6H12', bp: '81 °C',
      use: 'turned into adipic acid and caprolactam, the monomers of nylon',
      build: () => {
        const b = Mol();
        const ring = chairRing(b, ['C', 'C', 'C', 'C', 'C', 'C'], 1.54, 111);
        const ax = [];
        for (let k = 0; k < 6; k++) {
          const s = chairSlots(b, ring, k, 1.09);
          ax.push(b.bond(ring[k], b.at('H', s.ax)));
          b.bond(ring[k], b.at('H', s.eq));
        }
        return { mol: b.done(), hl: ax };
      }
    },
    glucose: {
      name: 'β-D-glucose (β-D-glucopyranose)', cls: 'carbohydrate (a sugar)', group: 'five –OH groups and a hemiacetal; every large group equatorial', cond: 'C6H12O6', bp: 'decomposes (melts near 150 °C)',
      use: 'blood sugar; its chains make starch, glycogen and cellulose',
      build: () => {
        const b = Mol();
        // ring C1 C2 C3 C4 C5 O5, clockwise from above; 4C1 chair: C1 down, C4 up
        const ring = chairRing(b, ['C', 'C', 'C', 'C', 'C', 'O'], 1.50, 111);
        const oh = [];
        for (let k = 0; k < 5; k++) {
          const s = chairSlots(b, ring, k, 1);
          b.bond(ring[k], b.at('H', add(b.P(ring[k]), mul(s.axDir, 1.09))));
          if (k < 4) {
            const o = b.bond(ring[k], b.at('O', add(b.P(ring[k]), mul(s.eqDir, 1.43))));
            b.z('H', o, 0.96, ring[k], 109, ring[(k + 1) % 6], 180);
            oh.push(o);
          } else {
            const c6 = b.bond(ring[k], b.at('C', add(b.P(ring[k]), mul(s.eqDir, 1.52))));
            const o6 = b.z('O', c6, 1.43, ring[k], 111, ring[5], 180);
            b.H2(c6, ring[k], o6);
            b.z('H', o6, 0.96, c6, 109, ring[k], 180);
          }
        }
        return { mol: b.done(), hl: oh.concat([ring[5]]) };
      }
    },
    stearic: {
      name: 'octadecanoic acid (stearic acid)', cls: 'saturated fatty acid', group: 'carboxyl head on a straight C₁₇ tail', cond: 'CH3(CH2)16COOH', bp: 'melts at 69 °C',
      use: 'soap, candles and cocoa butter: straight chains pack well, so the fat is solid',
      build: () => fattyAcid(false)
    },
    oleic: {
      name: '(9Z)-octadec-9-enoic acid (oleic acid)', cls: 'unsaturated fatty acid', group: 'carboxyl head; one cis C=C at carbon 9', cond: 'CH3(CH2)7CH=CH(CH2)7COOH', bp: 'melts at 13 °C',
      use: 'most of olive oil: the cis bend stops the chains packing, so the fat is liquid',
      build: () => fattyAcid(true)
    }
  };
  const GALLERY_ORDER = [
    ['Alkene: ethene', 'ethene'], ['Alkyne: ethyne', 'ethyne'], ['Arene: benzene', 'benzene'], ['Cycloalkane: cyclohexane', 'cyclohexane'],
    ['Haloalkane: chloromethane', 'chloromethane'], ['Alcohol (1°): ethanol', 'ethanol'], ['Alcohol (2°): propan-2-ol', 'propan2ol'], ['Phenol', 'phenol'],
    ['Ether: methoxymethane', 'ether'], ['Aldehyde: ethanal', 'ethanal'], ['Ketone: propanone', 'propanone'], ['Carboxylic acid: ethanoic acid', 'acid'],
    ['Ester: ethyl ethanoate', 'ester'], ['Amine: methylamine', 'amine'], ['Amide: ethanamide', 'amide'], ['Nitrile: ethanenitrile', 'nitrile'],
    ['Drug: aspirin', 'aspirin'], ['Sugar: β-D-glucose', 'glucose'], ['Fatty acid: stearic acid', 'stearic'], ['Fatty acid: oleic acid', 'oleic']
  ];

  Hyper.sim('org-groups', {
    title: 'Functional groups in 3-D',
    blurb: `Each molecule is shown in its real shape, with the atoms of its **functional group** ringed. The group — not the carbon skeleton — decides how a molecule reacts, so learn to spot it. Drag to turn.

- Compare **ethanal** and **propanone**: the same C=O, but at the end of a chain (aldehyde) or in the middle (ketone).
- Compare **ethanoic acid** and **ethyl ethanoate**: replacing the acidic H by an ethyl group turns a sharp acid into a fruity-smelling ester — and drops the boiling point by 40 °C, because the O–H hydrogen bond is gone.
- **Cyclohexane**: the ring is not flat but a chair. The ringed hydrogens are axial (parallel to the ring's axis); the others are equatorial.
- **β-D-glucose**: every OH and the CH₂OH sit equatorial, the most comfortable arrangement of any aldohexose.
- **Stearic** against **oleic acid**: one cis double bond bends the chain.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const m0 = params && params.mol && GALLERY[params.mol] ? params.mol : 'ethanol';
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: GALLERY_ORDER, value: m0 },
        { id: 'hl', type: 'check', label: 'Ring the functional group', value: true },
        { id: 'space', type: 'check', label: 'Space-filling', value: false },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true }
      ], id => { if (id === 'mol') load(); loop.once(); });
      const ro = kit.readout(box.side, [['name', 'Name'], ['cls', 'Class'], ['group', 'Functional group'], ['f', 'Molecular formula'], ['M', 'Molar mass'], ['bp', 'Boiling point'], ['use', 'Where you meet it']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.3, rotY: 0.5 });
      kit.mol.rotator(st, view, () => loop.once());
      let cur = null, entry = null;
      function load() {
        entry = GALLERY[V.mol] || GALLERY.ethanol;
        try { cur = entry.build(kit); } catch (e) { cur = { mol: kit.chem.molecule('CH4'), hl: [] }; }
        const f = formulaOf(cur.mol);
        ro.set('name', entry.name); ro.set('cls', entry.cls); ro.set('group', entry.group);
        ro.set('f', pretty(f) + (entry.cond && entry.cond !== f ? '  ·  ' + pretty(entry.cond) : ''));
        let M = NaN;
        try { M = kit.chem.molarMass(f); } catch (e) { M = NaN; }
        ro.set('M', Number.isFinite(M) ? M.toFixed(2) + ' g/mol' : '—');
        ro.set('bp', entry.bp); ro.set('use', entry.use);
      }
      function frame(dt) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const C = kit.colors();
        const c = st.begin();
        const ext = extentOf(cur.mol) + (V.space ? 1.0 : 0.6);
        view.scale = Math.max(8, Math.min(st.W, st.H - 70) / (2 * ext));
        kit.mol.draw(c, cur.mol, view, { cx: st.W / 2, cy: st.H / 2 + 14, style: V.space ? 'space' : 'ball', labels: true, highlight: V.hl ? cur.hl : [] });
        kit.label(c, entry.name, 14, 20, { size: 16, weight: 650 });
        kit.label(c, entry.cls + ' · ' + pretty(entry.cond), 14, 42, { size: 12.5, color: C.muted });
        if (V.hl) kit.label(c, 'ringed: ' + entry.group, 14, st.H - 14, { size: 12, color: C.accent });
        kit.label(c, 'drag to turn', st.W - 12, 20, { size: 11, color: C.faint, align: 'right' });
      }
      load();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ structural isomers */
  // each isomer: parent chain length, branches [chain index, length], name, boiling point (°C)
  const ISOMERS = {
    C4H10: [
      { name: 'butane', ch: 4, br: [], bp: -0.5 },
      { name: '2-methylpropane', ch: 3, br: [[1, 1]], bp: -11.7 }
    ],
    C5H12: [
      { name: 'pentane', ch: 5, br: [], bp: 36.1 },
      { name: '2-methylbutane', ch: 4, br: [[1, 1]], bp: 27.8 },
      { name: '2,2-dimethylpropane', ch: 3, br: [[1, 1], [1, 1]], bp: 9.5 }
    ],
    C6H14: [
      { name: 'hexane', ch: 6, br: [], bp: 68.7 },
      { name: '2-methylpentane', ch: 5, br: [[1, 1]], bp: 60.3 },
      { name: '3-methylpentane', ch: 5, br: [[2, 1]], bp: 63.3 },
      { name: '2,3-dimethylbutane', ch: 4, br: [[1, 1], [2, 1]], bp: 58.0 },
      { name: '2,2-dimethylbutane', ch: 4, br: [[1, 1], [1, 1]], bp: 49.7 }
    ],
    C7H16: [
      { name: 'heptane', ch: 7, br: [], bp: 98.4 },
      { name: '2-methylhexane', ch: 6, br: [[1, 1]], bp: 90.0 },
      { name: '3-methylhexane', ch: 6, br: [[2, 1]], bp: 92.0 },
      { name: '3-ethylpentane', ch: 5, br: [[2, 2]], bp: 93.5 },
      { name: '2,3-dimethylpentane', ch: 5, br: [[1, 1], [2, 1]], bp: 89.8 },
      { name: '2,4-dimethylpentane', ch: 5, br: [[1, 1], [3, 1]], bp: 80.5 },
      { name: '3,3-dimethylpentane', ch: 5, br: [[2, 1], [2, 1]], bp: 86.1 },
      { name: '2,2-dimethylpentane', ch: 5, br: [[1, 1], [1, 1]], bp: 79.2 },
      { name: '2,2,3-trimethylbutane', ch: 4, br: [[1, 1], [1, 1], [2, 1]], bp: 80.9 }
    ]
  };
  const N_ALKANE_BP = [[1, -161.5], [2, -88.6], [3, -42.1], [4, -0.5], [5, 36.1], [6, 68.7], [7, 98.4], [8, 125.7], [9, 150.8], [10, 174.1]];
  /* skeleton in 2-D, bond length 1: returns { pts: [[x, y]], bonds: [[i, j]], chain: n } with y up */
  function skeleton(iso) {
    const pts = [], bonds = [];
    const c30 = Math.cos(30 * d2r), s30 = 0.5;
    for (let i = 0; i < iso.ch; i++) { pts.push([i * c30, i % 2 ? s30 : 0]); if (i) bonds.push([i - 1, i]); }
    const count = {};
    for (const [i] of iso.br) count[i] = (count[i] || 0) + 1;
    const used = {};
    for (const [i, len] of iso.br) {
      const k = used[i] = (used[i] || 0) + 1;
      const up = i % 2 === 1;
      let ang;
      if (count[i] === 1 || (i === 0 || i === iso.ch - 1)) ang = up ? 90 : 270;
      else ang = k === 1 ? 90 : 270;
      if (count[i] === 2 && k === 2 && ang === (up ? 90 : 270)) ang = up ? 270 : 90;
      let prev = i, dir = ang;
      for (let s = 0; s < len; s++) {
        const p = [pts[prev][0] + Math.cos(dir * d2r), pts[prev][1] + Math.sin(dir * d2r)];
        pts.push(p); bonds.push([prev, pts.length - 1]);
        prev = pts.length - 1;
        dir = dir === 270 ? 330 : dir === 90 ? 30 : dir;
      }
    }
    return { pts, bonds, chain: iso.ch };
  }

  Hyper.sim('org-isomers', {
    title: 'Isomers of the alkanes: same formula, different skeletons',
    blurb: `Every skeleton in a panel has the same molecular formula, yet each is a different compound with its own name and boiling point. The **longest chain** (accent colour) gives the name's stem; the branches (orange) are the prefixes. Click a skeleton to select it.

- Branching always lowers the boiling point: a compact, nearly spherical molecule touches its neighbours over less surface, so the London forces between molecules are weaker.
- Pentane boils at 36 °C, 2,2-dimethylpropane at 9.5 °C — the same atoms, a 27 °C difference.
- On the graph, the straight-chain alkanes climb steadily; every branched isomer lies below its straight-chain partner.
- The count grows fast: 2, 3, 5, 9 isomers here — and 75 for C₁₀H₂₂, over 366 000 for C₂₀H₄₂.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const f0 = params && ISOMERS[params.formula] ? params.formula : 'C6H14';
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'Molecular formula', options: [['C₄H₁₀ (2 isomers)', 'C4H10'], ['C₅H₁₂ (3 isomers)', 'C5H12'], ['C₆H₁₄ (5 isomers)', 'C6H14'], ['C₇H₁₆ (9 isomers)', 'C7H16']], value: f0 },
        { id: 'atoms', type: 'check', label: 'Show the carbons (CH₃, CH₂, CH, C)', value: false },
        { id: 'chain', type: 'check', label: 'Colour the longest chain', value: true }
      ], id => { if (id === 'f') sel = 0; update(); loop.once(); });
      const ro = kit.readout(box.side, [['name', 'Selected isomer'], ['bp', 'Boiling point'], ['d', 'Against the straight chain'], ['stem', 'Longest chain'], ['br', 'Branches'], ['M', 'Molar mass (all isomers)']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'number of carbon atoms', min: 0.5, max: 10.5 }, y: { label: 'boiling point (°C)' } }, 170);
      const V = ctl.values;
      let sel = 0, cells = [];
      const STEM = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept'];
      function update() {
        const list = ISOMERS[V.f] || ISOMERS.C6H14;
        sel = clamp(sel, 0, list.length - 1);
        const iso = list[sel];
        const n = +V.f.slice(1, V.f.indexOf('H'));
        ro.set('name', iso.name);
        ro.set('bp', iso.bp.toFixed(1) + ' °C');
        ro.set('d', sel === 0 ? 'this is the straight chain' : (iso.bp - list[0].bp).toFixed(1) + ' °C');
        ro.set('stem', iso.ch + ' carbons (' + STEM[iso.ch] + '-)');
        ro.set('br', iso.br.length ? iso.br.map(([i, l]) => (l === 2 ? 'ethyl' : 'methyl') + ' on C' + (i + 1)).join(', ') : 'none');
        ro.set('M', kit.chem.molarMass(V.f).toFixed(2) + ' g/mol');
        plot.set({
          series: [{ pts: N_ALKANE_BP, label: 'straight-chain alkanes', dots: 3 },
                   { pts: list.map(q => [n, q.bp]), label: 'isomers of ' + pretty(V.f), line: false, dots: 4.5 }],
          marks: [{ x: n, y: iso.bp, label: iso.name }]
        });
      }
      kit.click(st, p => {
        const k = cells.findIndex(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (k >= 0) { sel = k; update(); loop.once(); }
      }, p => cells.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const list = ISOMERS[V.f] || ISOMERS.C6H14;
        const n = list.length, cols = n <= 2 ? 2 : 3, rows = Math.ceil(n / cols);
        const top = 30, cw = (st.W - 20) / cols, chh = (st.H - top - 6) / rows;
        kit.label(c, pretty(V.f) + ': ' + n + ' structural isomers', 14, 16, { size: 15, weight: 650 });
        cells = [];
        list.forEach((iso, k) => {
          const x = 10 + (k % cols) * cw, y = top + Math.floor(k / cols) * chh;
          cells.push({ x, y, w: cw, h: chh });
          c.fillStyle = k === sel ? C.surface : C.bg2;
          c.strokeStyle = k === sel ? C.accent : C.grid; c.lineWidth = k === sel ? 2 : 1;
          c.beginPath(); c.rect(x + 3, y + 3, cw - 6, chh - 6); c.fill(); c.stroke();
          const sk = skeleton(iso);
          const xs = sk.pts.map(p => p[0]), ys = sk.pts.map(p => p[1]);
          const w = Math.max(...xs) - Math.min(...xs) || 1, h = Math.max(...ys) - Math.min(...ys) || 1;
          const L = Math.min((cw - 40) / Math.max(w, 2.5), (chh - 52) / Math.max(h, 1.6), 38);
          const ox = x + cw / 2 - (Math.min(...xs) + w / 2) * L, oy = y + (chh - 30) / 2 + 6 + (Math.min(...ys) + h / 2) * L;
          const X = p => ox + p[0] * L, Y = p => oy - p[1] * L;
          for (const [i, j] of sk.bonds) {
            const inChain = i < sk.chain && j < sk.chain;
            c.strokeStyle = V.chain ? (inChain ? C.accent : C.warn) : C.text;
            c.lineWidth = 3; c.lineCap = 'round';
            c.beginPath(); c.moveTo(X(sk.pts[i]), Y(sk.pts[i])); c.lineTo(X(sk.pts[j]), Y(sk.pts[j])); c.stroke();
          }
          if (V.atoms) {
            const deg = sk.pts.map(() => 0);
            for (const [i, j] of sk.bonds) { deg[i]++; deg[j]++; }
            sk.pts.forEach((p, i) => {
              const hN = 4 - deg[i];
              kit.label(c, 'C' + (hN ? 'H' + (hN > 1 ? SUBS[hN] : '') : ''), X(p), Y(p), { size: 11, align: 'center', weight: 600, bg: C.bg2 });
            });
          }
          kit.label(c, iso.name, x + cw / 2, y + chh - 30, { size: 12.5, align: 'center', weight: 600 });
          kit.label(c, 'bp ' + iso.bp.toFixed(1) + ' °C', x + cw / 2, y + chh - 14, { size: 11.5, align: 'center', color: C.muted });
        });
      }
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ chirality */
  function tetraDirs() {
    const g = [[0, 0, 1], [0.9428, 0, -0.3333], [-0.4714, 0.8165, -0.3333], [-0.4714, -0.8165, -0.3333]];
    return g.map(unit);
  }
  /* each preset: a molecule, its stereocentre, and the root atoms of its groups in CIP order */
  const CHIRAL = {
    chbrclf: {
      title: 'bromochlorofluoromethane, CHBrClF', chiral: true, want: 'R',
      build() {
        const b = Mol(), d = tetraDirs();
        const c = b.at('C', [0, 0, 0]);
        const g = [['Br', 1.94], ['Cl', 1.78], ['F', 1.35], ['H', 1.09]].map(([el, L], k) => b.bond(c, b.at(el, mul(d[k], L))));
        return { mol: b.done(), centre: c, roots: g, names: ['Br', 'Cl', 'F', 'H'] };
      }
    },
    ch2brcl: {
      title: 'bromochloromethane, CH₂BrCl', chiral: false,
      build() {
        const b = Mol(), d = tetraDirs();
        const c = b.at('C', [0, 0, 0]);
        const g = [['Br', 1.94], ['Cl', 1.78], ['H', 1.09], ['H', 1.09]].map(([el, L], k) => b.bond(c, b.at(el, mul(d[k], L))));
        return { mol: b.done(), centre: c, roots: g, names: ['Br', 'Cl', 'H', 'H'] };
      }
    },
    butanol: {
      title: 'butan-2-ol', chiral: true, want: 'R',
      build() {
        const b = Mol(), d = tetraDirs();
        const c2 = b.at('C', [0, 0, 0]);
        const o = b.bond(c2, b.at('O', mul(d[0], 1.43))), c3 = b.bond(c2, b.at('C', mul(d[1], 1.54))), c1 = b.bond(c2, b.at('C', mul(d[2], 1.54))), h = b.bond(c2, b.at('H', mul(d[3], 1.09)));
        b.z('H', o, 0.96, c2, 109, c3, 180);
        const c4 = b.z('C', c3, 1.54, c2, 112, o, 180);
        b.H2(c3, c2, c4); b.H3(c4, c3, c2); b.H3(c1, c2, o);
        return { mol: b.done(), centre: c2, roots: [o, c3, c1, h], names: ['OH', 'CH₂CH₃', 'CH₃', 'H'] };
      }
    },
    alanine: {
      title: 'alanine (the L form is S)', chiral: true, want: 'S',
      build() {
        const b = Mol(), d = tetraDirs();
        const ca = b.at('C', [0, 0, 0]);
        const n = b.bond(ca, b.at('N', mul(d[0], 1.47))), cc = b.bond(ca, b.at('C', mul(d[1], 1.53))), cb = b.bond(ca, b.at('C', mul(d[2], 1.54))), h = b.bond(ca, b.at('H', mul(d[3], 1.09)));
        b.z('H', n, 1.01, ca, 109.5, cc, 60); b.z('H', n, 1.01, ca, 109.5, cc, 180);
        const o1 = b.z('O', cc, 1.21, ca, 123, n, -20, 2);
        const o2 = b.z('O', cc, 1.34, ca, 112, o1, 180);
        b.z('H', o2, 0.97, cc, 107, o1, 0);
        b.H3(cb, ca, n);
        return { mol: b.done(), centre: ca, roots: [n, cc, cb, h], names: ['NH₂', 'COOH', 'CH₃', 'H'] };
      }
    },
    lactic: {
      title: 'lactic acid (the (S) form is made in muscles)', chiral: true, want: 'S',
      build() {
        const b = Mol(), d = tetraDirs();
        const c2 = b.at('C', [0, 0, 0]);
        const o = b.bond(c2, b.at('O', mul(d[0], 1.43))), c1 = b.bond(c2, b.at('C', mul(d[1], 1.53))), c3 = b.bond(c2, b.at('C', mul(d[2], 1.54))), h = b.bond(c2, b.at('H', mul(d[3], 1.09)));
        b.z('H', o, 0.96, c2, 109, c1, 180);
        const o1 = b.z('O', c1, 1.21, c2, 123, o, 0, 2);
        const o2 = b.z('O', c1, 1.34, c2, 112, o1, 180);
        b.z('H', o2, 0.97, c1, 107, o1, 0);
        b.H3(c3, c2, o);
        return { mol: b.done(), centre: c2, roots: [o, c1, c3, h], names: ['OH', 'COOH', 'CH₃', 'H'] };
      }
    }
  };
  function mirrorMol(mol) {
    return { atoms: mol.atoms.map(a => Object.assign({}, a, { x: -a.x })), bonds: mol.bonds.map(b => b.slice()), lone: [] };
  }
  const dirOf = (mol, c, r) => unit([mol.atoms[r].x - mol.atoms[c].x, mol.atoms[r].y - mol.atoms[c].y, mol.atoms[r].z - mol.atoms[c].z]);
  function labelRS(mol, P) {
    if (!P.chiralNow) return '—';
    const v = P.roots.slice(0, 3).map(r => dirOf(mol, P.centre, r));
    return handedness(v[0], v[1], v[2]);
  }

  Hyper.sim('org-chirality', {
    title: 'Mirror images: can you make them match?',
    blurb: `On the left a molecule, on the right its mirror image. Drag either one to turn it and try to make the two look the same. Then press **Slide them together**: the mirror image is turned so that groups 1 and 2 point the same way as in the original, and laid over it.

- With **CHBrClF** two groups always end up swapped. The two are **enantiomers**: non-superimposable mirror images, like your hands.
- With **CH₂BrCl** everything matches — two identical hydrogens make it achiral.
- **Point H away** turns each molecule so that the lowest-priority group faces away from you. Read 1 → 2 → 3: clockwise is **R**, anticlockwise **S**. The mirror image always has the other label.
- **Swap two groups** on the original: exchanging any two groups turns R into S.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const p0 = params && CHIRAL[params.mol] ? params.mol : 'chbrclf';
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: [['CHBrClF', 'chbrclf'], ['CH₂BrCl (achiral)', 'ch2brcl'], ['butan-2-ol', 'butanol'], ['alanine', 'alanine'], ['lactic acid', 'lactic']], value: p0 },
        { id: 'prio', type: 'check', label: 'Show CIP priorities 1–4', value: true },
        { type: 'buttons', items: [{ id: 'overlay', label: 'Slide them together', primary: true }, { id: 'away', label: 'Point H away' }, { id: 'swap', label: 'Swap two groups' }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'mol') load();
        else if (id === 'overlay') startOverlay();
        else if (id === 'away') { mode = 'side'; OL = awayFrame(left); OR = awayFrame(right); arrows = true; }
        else if (id === 'swap') { swap(); arrows = false; }
        else if (id === 'reset') { mode = 'side'; OL = start(); OR = start(); arrows = false; }
        describe(); loop.once();
      });
      const ro = kit.readout(box.side, [['L', 'Original'], ['R', 'Mirror image'], ['same', 'Superimposable?'], ['pri', 'Priorities']]);
      const V = ctl.values;
      let P = null, left = null, right = null, OL = null, OR = null, mode = 'side', anim = 0, from = null, target = null, arrows = false, verdict = '';
      const start = () => mmul(rotX(-0.35), rotY(0.5));
      function load() {
        const def = CHIRAL[V.mol] || CHIRAL.chbrclf;
        const built = def.build();
        P = Object.assign({}, built, { def, chiralNow: def.chiral });
        left = built.mol;
        if (def.want && labelRS(left, P) !== def.want) left = mirrorMol(left);
        right = mirrorMol(left);
        OL = start(); OR = start(); mode = 'side'; arrows = false; verdict = '';
      }
      // exchange groups 1 and 2 of the original by reflecting them through the plane of groups 3 and 4
      function swap() {
        const c = P.centre, g1 = groupAtoms(left, c, P.roots[0]), g2 = groupAtoms(left, c, P.roots[1]);
        const o = [left.atoms[c].x, left.atoms[c].y, left.atoms[c].z];
        const n = unit(sub(dirOf(left, c, P.roots[0]), dirOf(left, c, P.roots[1])));
        const atoms = left.atoms.map(a => Object.assign({}, a));
        for (const i of g1.concat(g2)) {
          const p = sub([atoms[i].x, atoms[i].y, atoms[i].z], o), q = add(o, sub(p, mul(n, 2 * dot(p, n))));
          atoms[i].x = q[0]; atoms[i].y = q[1]; atoms[i].z = q[2];
        }
        left = { atoms, bonds: left.bonds, lone: [] };
        right = mirrorMol(left);
        mode = 'side';
      }
      // turn a molecule so its lowest-priority group points away from the viewer and group 1 up
      function awayFrame(mol) {
        const v4 = dirOf(mol, P.centre, P.roots[3]), v1 = dirOf(mol, P.centre, P.roots[0]);
        const f3 = mul(v4, -1), f2 = unit(sub(v1, mul(f3, dot(v1, f3)))), f1 = cross(f2, f3);
        return mmul(rotX(0.12), [f1, f2, f3]);
      }
      function startOverlay() {
        // target: the mirror's groups 1 and 2 along the original's, as the original is shown now
        const a1 = mvec(OL, dirOf(left, P.centre, P.roots[0])), a2 = mvec(OL, dirOf(left, P.centre, P.roots[1]));
        const m1 = dirOf(right, P.centre, P.roots[0]), m2 = dirOf(right, P.centre, P.roots[1]);
        target = mmul(transpose(basis(a1, a2)), basis(m1, m2));
        from = OR; anim = 0; mode = 'moving'; arrows = false;
      }
      function describe() {
        const rl = labelRS(left, P), rr = labelRS(right, P);
        ro.set('L', P.chiralNow ? '(' + rl + ')-' + P.def.title.split(' (')[0] : P.def.title + ': no stereocentre');
        ro.set('R', P.chiralNow ? '(' + rr + ')-' + P.def.title.split(' (')[0] : 'the same molecule');
        ro.set('same', mode === 'overlaid' ? verdict : (P.chiralNow ? 'no — press Slide them together' : 'yes — press Slide them together'));
        ro.set('pri', P.names.map((s, i) => (i + 1) + ' ' + s).join(' > '));
      }
      function checkMatch(wl, wr) {
        // each atom bonded to the stereocentre in the mirror image must lie on an atom of the same element in the original
        const bad = [];
        for (const i of P.roots) {
          const a = wr[i];
          const hit = P.roots.some(j => wl[j].el === a.el && Math.hypot(a.x - wl[j].x, a.y - wl[j].y, a.z - wl[j].z) < 0.4);
          if (!hit) bad.push(i);
        }
        return bad;
      }
      function rsArrow(c, pts, C, cx, cy) {
        const [a, b2, d] = P.roots.slice(0, 3).map(r => pts[r]);
        const ang = q => Math.atan2(q.y - cy, q.x - cx);
        const t1 = ang(a), t2 = ang(b2), t3 = ang(d);
        const norm2 = t => ((t % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const cw = norm2(t2 - t1) < norm2(t3 - t1);        // increasing canvas angle = clockwise on screen
        const r = 0.9 * Math.min(...[a, b2, d].map(q => Math.hypot(q.x - cx, q.y - cy)));
        c.strokeStyle = C.warn; c.lineWidth = 2.5;
        c.beginPath(); c.arc(cx, cy, r, t1 + (cw ? 0.25 : -0.25), t3 + (cw ? -0.25 : 0.25), !cw); c.stroke();
        const te = t3 + (cw ? -0.25 : 0.25), ex = cx + r * Math.cos(te), ey = cy + r * Math.sin(te);
        const tx = cw ? -Math.sin(te) : Math.sin(te), ty = cw ? Math.cos(te) : -Math.cos(te);
        kit.arrow(c, ex - tx * 10, ey - ty * 10, ex + tx * 2, ey + ty * 2, C.warn, 2.5);
        return cw ? 'R' : 'S';
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const ext = Math.max(extentOf(left), 1.5) + 0.6;
        const scale = Math.max(10, Math.min(W / 2, Hh - 70) / (2 * ext));
        const xl = W * 0.25, xr = W * 0.75, cy = Hh / 2 + 10;
        if (mode === 'moving') {
          anim = Math.min(1, anim + (dt || 0) / 1.6);
          if (!dt) anim = 1;
          const s = anim < 1 ? 0.5 - 0.5 * Math.cos(Math.PI * anim) : 1;
          const d = mmul(target, transpose(from)), aa = axisAngle(d);
          OR = mmul(axisRot(aa.u, aa.t * s), from);
          if (anim >= 1) { OR = target; mode = 'overlaid'; }
        }
        const cL = [left.atoms[P.centre].x, left.atoms[P.centre].y, left.atoms[P.centre].z];
        const cR = [right.atoms[P.centre].x, right.atoms[P.centre].y, right.atoms[P.centre].z];
        const s = mode === 'moving' ? (anim < 1 ? 0.5 - 0.5 * Math.cos(Math.PI * anim) : 1) : mode === 'overlaid' ? 1 : 0;
        const xR = xr + (xl - xr) * s;
        // the mirror plane
        if (mode === 'side') {
          c.save(); c.setLineDash([6, 5]); c.strokeStyle = C.faint; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(W / 2, 54); c.lineTo(W / 2, Hh - 24); c.stroke(); c.restore();
          kit.label(c, 'mirror', W / 2, Hh - 12, { size: 11, color: C.faint, align: 'center' });
        }
        const L = drawTurned(kit, c, left, OL, { cx: xl, cy, scale, centre: cL, labels: true, highlight: [P.centre] });
        c.save();
        if (mode !== 'side') c.globalAlpha = 0.5;
        const Rr = drawTurned(kit, c, right, OR, { cx: xR, cy, scale, centre: cR, labels: true, highlight: [P.centre] });
        c.restore();
        if (V.prio && mode === 'side') {
          for (const [pts, off] of [[L.pts, 0], [Rr.pts, 0]]) {
            P.roots.forEach((r, k) => {
              const q = pts[r];
              kit.label(c, String(k + 1), q.x + 14 + off, q.y - 14, { size: 12, weight: 700, color: C.bg2, bg: C.accent, align: 'center' });
            });
          }
        }
        if (mode === 'overlaid') {
          const bad = checkMatch(L.world, Rr.world);
          verdict = bad.length ? 'no: two groups end up swapped' : 'yes: every atom matches';
          for (const i of bad) { const q = Rr.pts[i]; c.beginPath(); c.arc(q.x, q.y, 16, 0, Math.PI * 2); c.strokeStyle = C.bad; c.lineWidth = 3; c.stroke(); }
          kit.label(c, bad.length ? 'Not superimposable: the ringed atoms have nothing to match' : 'Superimposable: this molecule is achiral', W / 2, Hh - 14, { size: 13.5, weight: 650, align: 'center', color: bad.length ? C.bad : C.ok });
          describe();
        }
        let tagL = labelRS(left, P), tagR = labelRS(right, P);
        if (arrows && P.chiralNow && mode === 'side') {
          const pl = project(mvec(OL, [0, 0, 0]), scale, xl, cy), pr = project([0, 0, 0], scale, xr, cy);
          tagL = rsArrow(c, L.pts, C, pl.x, pl.y); tagR = rsArrow(c, Rr.pts, C, pr.x, pr.y);
        }
        if (mode === 'side') {
          kit.label(c, 'original' + (P.chiralNow ? ': (' + tagL + ')' : ''), xl, 22, { size: 15, weight: 650, align: 'center' });
          kit.label(c, 'mirror image' + (P.chiralNow ? ': (' + tagR + ')' : ''), xr, 22, { size: 15, weight: 650, align: 'center' });
          kit.label(c, 'drag either one to turn it', W / 2, 44, { size: 11, color: C.faint, align: 'center' });
        } else kit.label(c, P.def.title, W / 2, 22, { size: 15, weight: 650, align: 'center' });
      }
      // drag the left or right molecule
      let last = null;
      kit.drag(st, {
        hit: p => (mode === 'moving' ? null : p.x < st.W / 2 ? 'L' : 'R'),
        start: (w, p) => { last = p; if (mode === 'overlaid') mode = 'side'; },
        move: (w, p) => {
          if (!last) last = p;
          const Rm = mmul(rotX((p.y - last.y) * 0.01), rotY((p.x - last.x) * 0.01));
          if (w === 'L') OL = mmul(Rm, OL); else OR = mmul(Rm, OR);
          last = p; arrows = false; loop.once();
        },
        end: () => { last = null; describe(); },
        hover: true
      });
      load(); describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ SN1 and SN2 */
  // model free-energy barriers (kJ/mol) at 298 K: SN2 with a strong anionic nucleophile in a
  // polar aprotic solvent, SN1 (ionisation) in a polar protic solvent; adjusted below
  const SUBST = {
    methyl: { name: 'bromomethane', cls: 'methyl', groups: [['H'], ['H'], ['H']], sn2: 80, sn1: 150, chiral: false },
    primary: { name: 'bromoethane', cls: 'primary (1°)', groups: [['H'], ['H'], ['C', 'CH₃']], sn2: 88, sn1: 135, chiral: false },
    secondary: { name: '2-bromobutane', cls: 'secondary (2°)', groups: [['H'], ['C', 'CH₃'], ['C', 'C₂H₅']], sn2: 100, sn1: 108, chiral: true },
    tertiary: { name: '3-bromo-3-methylhexane', cls: 'tertiary (3°)', groups: [['C', 'CH₃'], ['C', 'C₂H₅'], ['C', 'C₃H₇']], sn2: 130, sn1: 90, chiral: true }
  };
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const lerp = (a, b, t) => a + (b - a) * t;
  function fmtTime(s) {
    if (!Number.isFinite(s)) return 'forever';
    if (s < 1e-3) return kitFmt(s * 1e6) + ' µs';
    if (s < 1) return kitFmt(s * 1e3) + ' ms';
    if (s < 120) return kitFmt(s) + ' s';
    if (s < 7200) return kitFmt(s / 60) + ' min';
    if (s < 3 * 86400) return kitFmt(s / 3600) + ' h';
    if (s < 3.15e7 * 2) return kitFmt(s / 86400) + ' days';
    return kitFmt(s / 3.156e7) + ' years';
  }
  const kitFmt = v => (v >= 100 ? Math.round(v).toString() : v.toPrecision(2));

  Hyper.sim('org-sn1-sn2', {
    title: 'SN1 or SN2? Substrate, nucleophile and solvent decide',
    blurb: `A nucleophile replaces the bromine of a bromoalkane by one of two routes. **SN2** is one step: the nucleophile pushes in from the back as the bromide leaves, and the other three groups flip over like an umbrella in the wind. **SN1** is two steps: the bromide leaves first, giving a flat carbocation, which the nucleophile then attacks from either face.

- Go from methyl to tertiary: crowding blocks the back-side attack (SN2 barrier rises), while the carbocation becomes more stable (SN1 barrier falls).
- Change **[Nu]**: on the graph only the SN2 rate grows with it — the nucleophile is not involved in the slow step of SN1.
- A polar protic solvent (water, alcohols) cages anions and stabilises ions: it slows SN2 and speeds SN1.
- Watch the 3-D model: SN2 inverts the carbon; SN1 gives both hands, with a slight excess of inversion.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const s0 = params && SUBST[params.substrate] ? params.substrate : 'secondary';
      const ctl = kit.controls(box.side, [
        { id: 'sub', type: 'select', label: 'Substrate', options: [['CH₃Br (methyl)', 'methyl'], ['CH₃CH₂Br (primary)', 'primary'], ['2-bromobutane (secondary)', 'secondary'], ['3-bromo-3-methylhexane (tertiary)', 'tertiary']], value: s0 },
        { id: 'nu', type: 'select', label: 'Nucleophile', options: [['strong, anionic (OH⁻, CN⁻, I⁻)', 'strong'], ['weak, neutral (H₂O, CH₃OH)', 'weak']], value: params && params.nu === 'weak' ? 'weak' : 'strong' },
        { id: 'solv', type: 'select', label: 'Solvent', options: [['polar aprotic (propanone, DMSO)', 'aprotic'], ['polar protic (water, ethanol)', 'protic']], value: params && params.solv === 'protic' ? 'protic' : 'aprotic' },
        { id: 'c', label: 'Nucleophile concentration [Nu]', min: 0.01, max: 2, value: 1, unit: 'M', log: true, sig: 2 },
        { id: 'show', type: 'select', label: 'Animate', options: [['the faster route', 'auto'], ['SN2', 'sn2'], ['SN1', 'sn1']], value: 'auto' }
      ], (id) => { if (id !== 'c') { anim = 0; tally = [0, 0]; } update(); loop.once(); });
      const ro = kit.readout(box.side, [['sub', 'Substrate'], ['k2', 'k(SN2), second order'], ['k1', 'k(SN1), first order'], ['share', 'Product formed by SN2'], ['half', 'Half-life of the substrate'], ['stereo', 'Stereochemistry'], ['note', 'Note']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: '[Nu] (mol/L)', log: true, min: 0.01, max: 2 }, y: { label: 'rate constant k_obs (1/s)', log: true } }, 170);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.25, rotY: 0.35, scale: 42 });
      kit.mol.rotator(st, view, () => loop.once());
      let G2 = 100, G1 = 100, k2 = 0, k1 = 0, anim = 0, side = -1, tally = [0, 0], counted = false, route = 'sn2';
      const T = 298.15;
      function update() {
        const S = SUBST[V.sub] || SUBST.secondary;
        G2 = S.sn2 + (V.solv === 'protic' ? 8 : 0) + (V.nu === 'weak' ? 22 : 0);
        G1 = S.sn1 + (V.solv === 'protic' ? 0 : 20);
        k2 = eyring(G2, T); k1 = eyring(G1, T);
        const r2 = k2 * V.c, tot = r2 + k1;
        route = V.show === 'auto' ? (r2 >= k1 ? 'sn2' : 'sn1') : V.show;
        ro.set('sub', S.name + ', ' + S.cls);
        ro.set('k2', kit.fmt(k2, 2) + ' L mol⁻¹ s⁻¹  (ΔG‡ ' + G2 + ' kJ/mol)');
        ro.set('k1', kit.fmt(k1, 2) + ' s⁻¹  (ΔG‡ ' + G1 + ' kJ/mol)');
        const share = r2 / tot;
        ro.set('share', (share > 0.9995 ? '> 99.9' : share < 0.0005 ? '< 0.1' : (share * 100).toFixed(1)) + ' %');
        ro.set('half', fmtTime(Math.LN2 / tot));
        ro.set('stereo', !S.chiral ? 'invisible here: the carbon is not a stereocentre' : share > 0.9 ? 'inversion (SN2)' : share < 0.1 ? 'racemisation, slight excess of inversion (SN1)' : 'mixed: inversion plus some racemisation');
        ro.set('note', V.sub === 'tertiary' && V.nu === 'strong' ? 'a strong base with a tertiary halide mostly gives elimination (E2) instead' : V.nu === 'weak' && share < 0.5 ? 'solvolysis: the solvent is the nucleophile' : '—');
        const xs = [];
        for (let lg = -2; lg <= Math.log10(2) + 1e-9; lg += 0.05) xs.push(Math.pow(10, lg));
        plot.set({
          series: [{ pts: xs.map(x => [x, k2 * x]), label: 'SN2: k₂[Nu]' }, { pts: xs.map(x => [x, k1]), label: 'SN1: k₁', dash: [5, 4] }, { pts: xs.map(x => [x, k2 * x + k1]), label: 'observed' }],
          marks: [{ x: V.c, y: k2 * V.c + k1, label: '[Nu] = ' + kit.fmt(V.c, 2) + ' M' }]
        });
      }
      // the atoms at a given moment of the animation
      function scene(t) {
        const S = SUBST[V.sub] || SUBST.secondary;
        const b = Mol();
        const c = b.at('C', [0, 0, 0]);
        let theta = 109.5, dBr = 1.94, brDir = [1, 0, 0], dNu = 6, nuSide = -1, cCharge = 0, brCharge = 0, nuCharge = V.nu === 'weak' ? 0 : -1, caption = '';
        if (route === 'sn2') {
          const s = smooth((t - 0.4) / 2.8);
          theta = 109.5 - 39 * s;
          dBr = s < 0.5 ? lerp(1.94, 2.4, s / 0.5) : lerp(2.4, 5.2, (s - 0.5) / 0.5);
          dNu = s < 0.5 ? lerp(5.2, 2.1, s / 0.5) : lerp(2.1, 1.43, (s - 0.5) / 0.5);
          if (s > 0.6) { brCharge = -1; nuCharge = 0; }
          caption = s < 0.35 ? 'SN2: the nucleophile approaches from the back' : s < 0.65 ? 'transition state: five groups, C flat, bonds half made, half broken' : 'the groups have flipped: inversion';
        } else {
          const s1 = smooth(t / 1.5), s2 = smooth((t - 2.3) / 1.5);
          dBr = lerp(1.94, 4.8, s1);
          brDir = unit([lerp(1, 0.45, s1), lerp(0, 0.9, s1), 0]);
          theta = s2 > 0 ? 90 + 19.5 * side * s2 : lerp(109.5, 90, s1);
          nuSide = side;
          dNu = lerp(5.2, 1.43, s2);
          if (s1 > 0.55) { cCharge = s2 < 0.6 ? 1 : 0; brCharge = -1; }
          if (s2 > 0.6) nuCharge = 0;
          caption = t < 1.5 ? 'SN1 step 1 (slow): the C–Br bond breaks' : t < 2.3 ? 'a flat carbocation: either face is open' : 'step 2 (fast): attack from the ' + (side < 0 ? 'back — inversion' : 'front — retention');
        }
        b.m.atoms[c].charge = cCharge;
        const s = Math.sin(theta * d2r), k = Math.cos(theta * d2r);
        S.groups.forEach(([el, lab], j) => {
          const a = (90 + 120 * j) * d2r, L = el === 'H' ? 1.09 : 1.54;
          b.bond(c, b.at(el, [L * k, L * s * Math.cos(a), L * s * Math.sin(a)], lab ? { label: lab } : undefined));
        });
        const br = b.at('Br', mul(brDir, dBr), { charge: brCharge });
        if (dBr < 2.5) b.bond(c, br);
        const nu = b.at('O', [nuSide * dNu, 0, 0], { label: V.nu === 'weak' ? (dNu < 1.6 && route === 'sn2' && t > 3.4 ? 'OH' : 'H₂O') : 'OH', charge: nuCharge });
        if (dNu < 2.5) b.bond(c, nu);
        return { mol: b.done(), caption };
      }
      function drawProfile(c, x0, y0, w, h, C) {
        const top = Math.max(G1, G2) + 15, bot = -40;
        const Y = g => y0 + h - (g - bot) / (top - bot) * h;
        const X = s => x0 + s * w;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.stroke();
        kit.label(c, 'free energy', x0 + 4, y0 - 8, { size: 11, color: C.muted });
        kit.label(c, 'reaction progress →', x0 + w, y0 + h + 12, { size: 11, color: C.muted, align: 'right' });
        const curve = (pts) => {
          c.beginPath();
          for (let i = 0; i < pts.length - 1; i++) {
            const [sa, ga] = pts[i], [sb, gb] = pts[i + 1];
            for (let q = 0; q <= 20; q++) {
              const u = q / 20, g = ga + (gb - ga) * (0.5 - 0.5 * Math.cos(Math.PI * u));
              const px = X(sa + (sb - sa) * u), py = Y(g);
              if (i === 0 && q === 0) c.moveTo(px, py); else c.lineTo(px, py);
            }
          }
          c.stroke();
        };
        const p2 = [[0, 0], [0.5, G2], [1, -30]];
        const p1 = [[0, 0], [0.28, G1], [0.46, G1 - 22], [0.6, G1 - 12], [1, -30]];
        const fast2 = route === 'sn2';
        c.lineWidth = fast2 ? 3 : 1.5; c.strokeStyle = fast2 ? C.accent : C.muted; c.setLineDash(fast2 ? [] : [5, 4]); curve(p2);
        c.lineWidth = !fast2 ? 3 : 1.5; c.strokeStyle = !fast2 ? C.warn : C.muted; c.setLineDash(!fast2 ? [] : [5, 4]); curve(p1);
        c.setLineDash([]);
        kit.label(c, 'SN2 ' + G2, X(0.5), Y(G2) - 10, { size: 11.5, align: 'center', color: fast2 ? C.accent : C.muted, weight: 650 });
        kit.label(c, 'SN1 ' + G1, X(0.28), Y(G1) - 10, { size: 11.5, align: 'center', color: !fast2 ? C.warn : C.muted, weight: 650 });
        kit.label(c, 'carbocation', X(0.46), Y(G1 - 22) + 12, { size: 10.5, align: 'center', color: C.faint });
        kit.label(c, 'R–Br + Nu', X(0), Y(0) + 12, { size: 10.5, color: C.muted });
        kit.label(c, 'R–Nu + Br⁻', X(1), Y(-30) + 12, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'ΔG‡ in kJ/mol', x0 + w, y0 - 8, { size: 10.5, color: C.faint, align: 'right' });
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const cycle = route === 'sn2' ? 4.2 : 4.6;
        anim += dt || 0;
        if (anim > cycle) {
          anim = 0; counted = false;
          if (route === 'sn1') side = Math.random() < 0.6 ? -1 : 1;
        }
        if (route === 'sn1' && !counted && anim > 3.8) { tally[side < 0 ? 0 : 1]++; counted = true; }
        const pw = W * 0.42;
        drawProfile(c, 30, 46, pw - 40, Hh - 90, C);
        kit.label(c, 'Energy profiles', 16, 20, { size: 15, weight: 650 });
        const sc = scene(anim);
        view.scale = Math.min(W - pw, Hh - 60) / 11.5;
        kit.mol.draw(c, sc.mol, view, { cx: pw + (W - pw) / 2, cy: Hh / 2 + 6, labels: true, centre: [0, 0, 0], highlight: [0] });
        kit.label(c, sc.caption, pw + (W - pw) / 2, 20, { size: 13, weight: 650, align: 'center' });
        if (route === 'sn1' && SUBST[V.sub].chiral) kit.label(c, 'so far: inversion ' + tally[0] + ' · retention ' + tally[1], pw + (W - pw) / 2, Hh - 14, { size: 12, align: 'center', color: C.muted });
        else kit.label(c, 'drag to turn', W - 12, Hh - 12, { size: 11, color: C.faint, align: 'right' });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Markovnikov */
  // alkene + HBr: the electrophile (H⁺, or Br· with peroxides) adds to one carbon of the C=C and
  // leaves a cation (or radical) on the other. Model barriers for that first step, kJ/mol.
  const BAR_ION = { 3: 65, 2: 80, 1: 110 }, BAR_RAD = { 3: 6, 2: 9, 1: 20 };
  const ALKENES = {
    propene: {
      name: 'propene, CH₃CH=CH₂',
      A: { ion: ['H', 'CH3', 'CH3'], rad: ['H', 'CH3', 'CH2Br'], deg: 2, ionProd: '2-bromopropane', radProd: '1-bromopropane' },
      B: { ion: ['H', 'H', 'CH2CH3'], rad: ['H', 'H', 'CHBrCH3'], deg: 1, ionProd: '1-bromopropane', radProd: '2-bromopropane' }
    },
    isobutene: {
      name: '2-methylpropene, (CH₃)₂C=CH₂',
      A: { ion: ['CH3', 'CH3', 'CH3'], rad: ['CH3', 'CH3', 'CH2Br'], deg: 3, ionProd: '2-bromo-2-methylpropane', radProd: '1-bromo-2-methylpropane' },
      B: { ion: ['H', 'H', 'CH(CH3)2'], rad: ['H', 'H', 'CBr(CH3)2'], deg: 1, ionProd: '1-bromo-2-methylpropane', radProd: '2-bromo-2-methylpropane' }
    },
    butene: {
      name: 'but-2-ene, CH₃CH=CHCH₃',
      A: { ion: ['H', 'CH3', 'CH2CH3'], rad: ['H', 'CH3', 'CHBrCH3'], deg: 2, ionProd: '2-bromobutane', radProd: '2-bromobutane' },
      B: { ion: ['H', 'CH3', 'CH2CH3'], rad: ['H', 'CH3', 'CHBrCH3'], deg: 2, ionProd: '2-bromobutane', radProd: '2-bromobutane' }
    },
    ethene: {
      name: 'ethene, CH₂=CH₂',
      A: { ion: ['H', 'H', 'CH3'], rad: ['H', 'H', 'CH2Br'], deg: 1, ionProd: 'bromoethane', radProd: 'bromoethane' },
      B: { ion: ['H', 'H', 'CH3'], rad: ['H', 'H', 'CH2Br'], deg: 1, ionProd: 'bromoethane', radProd: 'bromoethane' }
    }
  };
  const DEG = { 1: 'primary', 2: 'secondary', 3: 'tertiary' };
  /* a flat reactive carbon at the origin with three groups in the xy-plane; returns the molecule and the α hydrogens */
  function buildIntermediate(groups, cation) {
    const b = Mol();
    const c = b.at('C', [0, 0, 0], cation ? { charge: 1 } : undefined);
    const alphaH = [];
    const up = [0, 0, 1];
    groups.forEach((g, j) => {
      const a = (90 + 120 * j) * d2r, dir = [Math.cos(a), Math.sin(a), 0];
      if (g === 'H') { b.bond(c, b.at('H', mul(dir, 1.09))); return; }
      const x = b.bond(c, b.at('C', mul(dir, 1.50)));
      // the three other positions on this sp3 carbon; the first eclipses the empty p orbital
      const spec = { CH3: ['H', 'H', 'H'], CH2CH3: ['H', 'CH3', 'H'], CH2Br: ['H', 'Br', 'H'], CHBrCH3: ['H', 'Br', 'CH3'], 'CH(CH3)2': ['H', 'CH3', 'CH3'], 'CBr(CH3)2': ['Br', 'CH3', 'CH3'] }[g] || ['H', 'H', 'H'];
      spec.forEach((s, k) => {
        const el = s === 'CH3' ? 'C' : s;
        const L = el === 'H' ? 1.09 : el === 'Br' ? 1.94 : 1.54;
        const p = nerf(up, b.P(c), b.P(x), L, 109.5, k * 120);
        const i = b.bond(x, b.at(el, p));
        if (el === 'H') alphaH.push(i);
        if (s === 'CH3') b.H3(i, x, c);
      });
    });
    return { mol: b.done(), alphaH };
  }
  function rotView(p, v) {
    const cy = Math.cos(v.rotY), sy = Math.sin(v.rotY), cx = Math.cos(v.rotX), sx = Math.sin(v.rotX);
    const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
    return [x1, p[1] * cx - z1 * sx, p[1] * sx + z1 * cx];
  }

  Hyper.sim('org-markovnikov', {
    title: 'Adding HBr to an alkene: which way round?',
    blurb: `Hydrogen bromide adds across a C=C in two steps. First H⁺ attaches to one carbon of the double bond, leaving a **carbocation** on the other; then Br⁻ joins it. For an unsymmetrical alkene there are two possible cations, shown side by side (drag to turn them). The more stable one forms faster, and its product dominates — **Markovnikov's rule**.

- Propene: the secondary cation (left) has six neighbouring C–H bonds (ringed) that feed electrons into its empty p orbital; the primary cation has two. The secondary route wins by about 10⁵ to 1.
- 2-methylpropene gives a tertiary cation: even more selective. But-2-ene has two equal choices and one product.
- Tick **Peroxides**: now a bromine atom adds first and the more stable **radical** decides — so Br ends up on the *other* carbon (anti-Markovnikov).
- Raise the temperature: selectivity falls, but only slowly.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const a0 = params && ALKENES[params.alkene] ? params.alkene : 'propene';
      const ctl = kit.controls(box.side, [
        { id: 'alk', type: 'select', label: 'Alkene', options: [['propene', 'propene'], ['2-methylpropene', 'isobutene'], ['but-2-ene', 'butene'], ['ethene', 'ethene']], value: a0 },
        { id: 'perox', type: 'check', label: 'Peroxides present (radical chain)', value: !!(params && params.perox) },
        { id: 'T', label: 'Temperature', min: 250, max: 450, step: 5, value: 298, unit: 'K' },
        { id: 'orb', type: 'check', label: 'Show the half-empty or empty p orbital', value: true }
      ], () => { update(); loop.once(); });
      const ro = kit.readout(box.side, [['A', 'Route A goes through'], ['B', 'Route B goes through'], ['dd', 'Difference in barrier'], ['ratio', 'Rate ratio A : B'], ['major', 'Major product'], ['minor', 'Minor product']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.55, rotY: 0.25, scale: 40 });
      kit.mol.rotator(st, view, () => loop.once());
      let IA = null, IB = null, gA = 0, gB = 0;
      function update() {
        const A = ALKENES[V.alk] || ALKENES.propene, rad = !!V.perox, key = rad ? 'rad' : 'ion';
        IA = buildIntermediate(A.A[key], !rad); IB = buildIntermediate(A.B[key], !rad);
        const bars = rad ? BAR_RAD : BAR_ION;
        gA = bars[A.A.deg]; gB = bars[A.B.deg];
        const kind = rad ? 'radical' : 'cation';
        ro.set('A', DEG[A.A.deg] + ' ' + kind + ' (ΔG‡ ' + gA + ' kJ/mol)');
        ro.set('B', DEG[A.B.deg] + ' ' + kind + ' (ΔG‡ ' + gB + ' kJ/mol)');
        const dd = gB - gA, ratio = Math.exp(dd * 1000 / (R_GAS * V.T));
        ro.set('dd', dd + ' kJ/mol');
        ro.set('ratio', dd === 0 ? '1 : 1' : kit.fmt(ratio, 2) + ' : 1');
        const pa = A.A[rad ? 'radProd' : 'ionProd'], pb = A.B[rad ? 'radProd' : 'ionProd'];
        if (pa === pb) { ro.set('major', pa + ' (the only product)'); ro.set('minor', '—'); }
        else {
          const f = ratio / (1 + ratio);
          ro.set('major', pa + ' (' + (f > 0.99999 ? '> 99.999' : (f * 100).toFixed(f > 0.999 ? 3 : 1)) + ' %)' + (rad ? ' — anti-Markovnikov' : ' — Markovnikov'));
          ro.set('minor', pb + ' (' + kit.fmt((1 - f) * 100, 2) + ' %)');
        }
      }
      function drawOrbital(c, cx, cy, C, single) {
        for (const s of [1, -1]) {
          const tip = rotView([0, 0, s * 1.25], view), base = rotView([0, 0, 0], view);
          const P = project(tip, view.scale, cx, cy), B0 = project(base, view.scale, cx, cy);
          const ang = Math.atan2(P.y - B0.y, P.x - B0.x), len = Math.hypot(P.x - B0.x, P.y - B0.y);
          c.save(); c.translate((P.x + B0.x) / 2, (P.y + B0.y) / 2); c.rotate(ang);
          c.beginPath(); c.ellipse(0, 0, Math.max(8, len * 0.6), 0.42 * view.scale, 0, 0, Math.PI * 2);
          c.fillStyle = C.dark ? 'rgba(160,170,255,.20)' : 'rgba(80,90,200,.14)'; c.fill();
          c.strokeStyle = C.dark ? 'rgba(160,170,255,.5)' : 'rgba(80,90,200,.4)'; c.lineWidth = 1; c.stroke();
          c.restore();
          if (single && s === 1) kit.dot(c, P.x, P.y, 3.2, C.accent);
        }
      }
      function drawProfile(c, x0, y0, w, h, C) {
        const top = Math.max(gA, gB) + 12, bot = -60;
        const Y = g => y0 + h - (g - bot) / (top - bot) * h, X = s => x0 + s * w;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y0 + h); c.lineTo(x0 + w, y0 + h); c.stroke();
        const path = (g, col, dash, width) => {
          const pts = [[0, 0], [0.3, g], [0.5, g - (V.perox ? 4 : 25)], [0.65, g - (V.perox ? 1 : 18)], [1, -45]];
          c.beginPath();
          for (let i = 0; i < pts.length - 1; i++) for (let q = 0; q <= 16; q++) {
            const u = q / 16, s = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, gg = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * (0.5 - 0.5 * Math.cos(Math.PI * u));
            if (!i && !q) c.moveTo(X(s), Y(gg)); else c.lineTo(X(s), Y(gg));
          }
          c.strokeStyle = col; c.lineWidth = width; c.setLineDash(dash); c.stroke(); c.setLineDash([]);
        };
        path(gB, C.warn, [5, 4], 2);
        path(gA, C.accent, [], 3);
        kit.label(c, 'A ' + gA, X(0.3), Y(gA) - 10, { size: 11.5, color: C.accent, align: 'center', weight: 650 });
        if (gB !== gA) kit.label(c, 'B ' + gB, X(0.3) + 34, Y(gB) - 10, { size: 11.5, color: C.warn, align: 'center', weight: 650 });
        kit.label(c, 'alkene + HBr', X(0), Y(0) + 12, { size: 10.5, color: C.muted });
        kit.label(c, 'bromoalkane', X(1), Y(-45) + 12, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, (V.perox ? 'radical' : 'cation') + ' intermediate', X(0.5), Y(Math.min(gA, gB) - (V.perox ? 4 : 25)) + 14, { size: 10.5, color: C.faint, align: 'center' });
        kit.label(c, 'free energy (kJ/mol) against reaction progress', x0, y0 - 8, { size: 10.5, color: C.faint });
      }
      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const A = ALKENES[V.alk] || ALKENES.propene, rad = !!V.perox;
        const molH = Hh * 0.58;
        view.scale = Math.min(W / 2, molH) / 7.5;
        kit.label(c, (rad ? 'HBr + peroxides: ' : 'HBr: ') + A.name, 14, 18, { size: 15, weight: 650 });
        const spots = [[W * 0.25, molH / 2 + 22, IA, 'A: ' + DEG[A.A.deg] + (rad ? ' radical' : ' cation'), C.accent], [W * 0.75, molH / 2 + 22, IB, 'B: ' + DEG[A.B.deg] + (rad ? ' radical' : ' cation'), C.warn]];
        for (const [cx, cy, I, lab, col] of spots) {
          if (V.orb) drawOrbital(c, cx, cy, C, rad);
          kit.mol.draw(c, I.mol, view, { cx, cy, labels: true, centre: [0, 0, 0], highlight: [0].concat(I.alphaH) });
          kit.label(c, lab, cx, 44, { size: 13, weight: 650, align: 'center', color: col });
          kit.label(c, I.alphaH.length + ' neighbouring C–H bonds (ringed)', cx, molH + 14, { size: 11.5, align: 'center', color: C.muted });
        }
        drawProfile(c, 40, molH + 44, W - 70, Hh - molH - 66, C);
      }
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ polymerisation */
  const POLYMERS = {
    nylon: { name: 'nylon-6,6', step: true, M0: 113.16, a: 'O', b: 'N', note: 'hexanedioic acid + hexane-1,6-diamine; each link releases H₂O' },
    pet: { name: 'PET', step: true, M0: 96.08, a: 'O', b: 'C', note: 'benzene-1,4-dicarboxylic acid + ethane-1,2-diol; each link releases H₂O' },
    pe: { name: 'poly(ethene)', step: false, M0: 28.05, note: 'CH₂=CH₂ monomers add to a growing radical end' },
    pvc: { name: 'PVC, poly(chloroethene)', step: false, M0: 62.50, note: 'CH₂=CHCl monomers add to a growing radical end' },
    ps: { name: 'polystyrene', step: false, M0: 104.15, note: 'C₆H₅CH=CH₂ monomers add to a growing radical end' }
  };

  Hyper.sim('org-polymer', {
    title: 'Growing polymers: step growth against chain growth',
    blurb: `Each dot is a monomer. In **step growth** (nylon, PET, polyesters) any two molecules with matching ends can join, releasing water: monomers pair into dimers, dimers into tetramers, and long chains appear only at the very end. In **chain growth** (poly(ethene), PVC, polystyrene) a few reactive ends are started and each races through hundreds of monomers — long chains appear at once, next to unreacted monomer.

- Step growth: watch the graph follow the **Carothers** curve $X_n = 1/(1-p)$. At 90 % conversion the average chain is only 10 units long; useful nylon needs over 99 %.
- Chain growth: the average length of the polymer formed is large from the very first percent of conversion.
- Watch the dispersity $M_w/M_n$, the spread of chain lengths: in step growth it rises roughly as $1 + p$, towards 2 (in this small box everything finally joins into one molecule).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const p0 = params && POLYMERS[params.polymer] ? params.polymer : 'nylon';
      const ctl = kit.controls(box.side, [
        { id: 'poly', type: 'select', label: 'Polymer', options: [['Nylon-6,6 (step growth)', 'nylon'], ['PET (step growth)', 'pet'], ['Poly(ethene) (chain growth)', 'pe'], ['PVC (chain growth)', 'pvc'], ['Polystyrene (chain growth)', 'ps']], value: p0 },
        { id: 'n', label: 'Monomers', min: 100, max: 600, step: 50, value: 400 },
        { id: 'speed', label: 'Reactions per second', min: 5, max: 300, value: 60, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start / pause', primary: true }, { id: 'reset', label: 'Restart' }] }
      ], id => {
        if (id === 'go') running = !running;
        else if (id === 'speed') { /* live */ }
        else reset();
        loop.once();
      });
      const ro = kit.readout(box.side, [['p', 'Conversion p'], ['mol', 'Molecules (incl. monomer)'], ['xn', 'Average chain length Xₙ'], ['car', 'Carothers 1/(1 − p)'], ['mn', 'Mₙ'], ['d', 'Dispersity Mw/Mn'], ['big', 'Longest chain']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'conversion p', min: 0, max: 1 }, y: { label: 'average chain length Xₙ', log: true, min: 1 } }, 170);
      const V = ctl.values;
      let mons = [], parent = [], links = [], water = [], trace = [], running = false, acc = 0, reacted = 0, active = [], P = POLYMERS[p0], lastP = -1, done = false;
      const find = i => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
      function reset() {
        P = POLYMERS[V.poly] || POLYMERS.nylon;
        const N = Math.round(V.n);
        mons = []; links = []; water = []; trace = [[0, 1]]; active = []; reacted = 0; acc = 0; lastP = -1; done = false; running = true;
        const cols = Math.ceil(Math.sqrt(N * 1.8)), rows = Math.ceil(N / cols);
        const idx = [];
        for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) idx.push([q, r]);
        idx.sort(() => Math.random() - 0.5);
        for (let i = 0; i < N; i++) {
          const [q, r] = idx[i];
          mons.push({ x: (q + 0.5 + (Math.random() - 0.5) * 0.6) / cols, y: (r + 0.5 + (Math.random() - 0.5) * 0.6) / rows, type: P.step ? (i % 2 ? 'b' : 'a') : 'm', free: 2, used: false, live: false });
        }
        parent = mons.map((_, i) => i);
        plotUpdate();
      }
      const dist2 = (a, b) => (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
      function nearest(i, ok) {
        let best = -1, bd = Infinity;
        for (let j = 0; j < mons.length; j++) { if (j === i || !ok(j)) continue; const d = dist2(mons[i], mons[j]); if (d < bd) { bd = d; best = j; } }
        return best;
      }
      function stepGrowth() {
        const cand = [];
        for (let i = 0; i < mons.length; i++) for (let f = 0; f < mons[i].free; f++) cand.push(i);          // one entry per free end
        if (!cand.length) return false;
        for (let tries = 0; tries < 6; tries++) {
          const i = cand[Math.floor(Math.random() * cand.length)];
          const ri = find(i);
          // molecules diffuse: react with one of the few nearest matching ends, chosen at random
          const near = [];
          for (let j = 0; j < mons.length; j++) if (mons[j].free > 0 && mons[j].type !== mons[i].type && find(j) !== ri) for (let f = 0; f < mons[j].free; f++) near.push([dist2(mons[i], mons[j]), j]);
          if (!near.length) continue;
          near.sort((p, q) => p[0] - q[0]);
          const j = near[Math.floor(Math.random() * Math.min(12, near.length))][1];
          mons[i].free--; mons[j].free--; parent[find(j)] = ri; links.push([i, j]); reacted++;
          water.push({ x: (mons[i].x + mons[j].x) / 2, y: (mons[i].y + mons[j].y) / 2, t: 0 });
          return true;
        }
        return false;
      }
      function chainGrowth() {
        const freeMon = [];
        for (let i = 0; i < mons.length; i++) if (!mons[i].used) freeMon.push(i);
        if (!freeMon.length && !active.length) return false;
        // initiation: a new radical now and then (always when none is growing)
        if (freeMon.length && (!active.length || Math.random() < 0.02)) {
          const i = freeMon[Math.floor(Math.random() * freeMon.length)];
          mons[i].used = true; mons[i].live = true; active.push(i);
          return true;
        }
        if (!active.length) return false;
        const k = Math.floor(Math.random() * active.length), end = active[k];
        // termination: rarely, or when two growing ends meet
        const other = active.find(a => a !== end && dist2(mons[a], mons[end]) < 0.0025);
        if (other != null && Math.random() < 0.5) {
          links.push([end, other]); parent[find(other)] = find(end);
          mons[end].live = false; mons[other].live = false;
          active = active.filter(a => a !== end && a !== other);
          return true;
        }
        if (Math.random() < 0.006 || !freeMon.length) { mons[end].live = false; active.splice(k, 1); return true; }
        const j = nearest(end, j => !mons[j].used);
        if (j < 0) { mons[end].live = false; active.splice(k, 1); return true; }
        mons[j].used = true; mons[j].live = true; mons[end].live = false;
        links.push([end, j]); parent[find(j)] = find(end); active[k] = j; reacted++;
        return true;
      }
      function stats() {
        const N = mons.length, sizes = new Map();
        for (let i = 0; i < N; i++) {
          if (!P.step && !mons[i].used) continue;
          const r = find(i); sizes.set(r, (sizes.get(r) || 0) + 1);
        }
        const s = [...sizes.values()];
        const n = s.length, sum = s.reduce((a, b) => a + b, 0), sum2 = s.reduce((a, b) => a + b * b, 0);
        const conv = P.step ? reacted / N : sum / N;
        return { conv, count: P.step ? n : n + (N - sum), xn: n ? sum / n : 1, disp: sum ? sum2 * n / (sum * sum) : 1, big: s.length ? Math.max(...s) : 0, chains: n };
      }
      function plotUpdate() {
        const S = stats();
        const pts = [];
        for (let p = 0; p <= 0.995; p += 0.005) pts.push([p, 1 / (1 - p)]);
        plot.set({
          x: { label: 'conversion p', min: 0, max: 1 }, y: { label: 'average chain length Xₙ', log: true, min: 1, max: Math.max(10, mons.length) },
          series: [{ pts, label: 'Carothers: 1/(1 − p) for step growth', dash: [5, 4] }, { pts: trace.slice(), label: 'this simulation', line: false, dots: 3 }],
          marks: [{ x: S.conv, y: Math.max(1, S.xn), label: 'now' }]
        });
        ro.set('p', (S.conv * 100).toFixed(1) + ' %');
        ro.set('mol', String(S.count));
        ro.set('xn', S.xn.toFixed(1) + (P.step ? '' : ' (polymer only)'));
        ro.set('car', P.step ? (S.conv < 1 ? (1 / (1 - S.conv)).toFixed(1) : '∞') : 'does not apply');
        ro.set('mn', kit.fmt(S.xn * P.M0, 3) + ' g/mol');
        ro.set('d', S.disp.toFixed(2));
        ro.set('big', S.big + ' units');
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        if (running && dt) {
          acc += dt * V.speed;
          let n = 0;
          while (acc >= 1 && n < 400) {
            acc -= 1; n++;
            const ok = P.step ? stepGrowth() : chainGrowth();
            if (!ok) { running = false; done = true; break; }
          }
          const S = stats();
          if (S.conv - lastP >= 0.01 || (done && lastP < S.conv)) { trace.push([S.conv, Math.max(1, S.xn)]); lastP = S.conv; plotUpdate(); }
        }
        for (const w of water) { w.t += dt || 0; w.y -= (dt || 0) * 0.05; }
        water = water.filter(w => w.t < 1.2);
        const x0 = 12, y0 = 34, w = st.W - 24, h = st.H - 46;
        c.fillStyle = C.bg2; c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.rect(x0, y0, w, h); c.fill(); c.stroke();
        const X = m => x0 + 6 + m.x * (w - 12), Y = m => y0 + 6 + m.y * (h - 12);
        const r = Math.max(2.2, Math.min(5, Math.sqrt(w * h / mons.length) * 0.16));
        c.strokeStyle = C.text; c.globalAlpha = 0.55; c.lineWidth = Math.max(1.2, r * 0.5);
        c.beginPath();
        for (const [i, j] of links) { c.moveTo(X(mons[i]), Y(mons[i])); c.lineTo(X(mons[j]), Y(mons[j])); }
        c.stroke(); c.globalAlpha = 1;
        const colOf = m => P.step ? kit.chem.el(m.type === 'a' ? P.a : P.b).color : kit.chem.el('C').color;
        for (const m of mons) {
          const dim = P.step ? m.free === 2 : !m.used;
          c.globalAlpha = dim ? 0.55 : 1;
          kit.dot(c, X(m), Y(m), m.live ? r * 1.5 : r, m.live ? C.warn : colOf(m), 'rgba(0,0,0,.35)');
        }
        c.globalAlpha = 1;
        for (const q of water) { c.globalAlpha = Math.max(0, 1 - q.t / 1.2); kit.dot(c, x0 + 6 + q.x * (w - 12), y0 + 6 + q.y * (h - 12), r * 0.9, kit.chem.el('O').color); c.globalAlpha = 1; }
        kit.label(c, P.name + ' — ' + (P.step ? 'step growth' : 'chain growth'), 14, 16, { size: 14, weight: 650 });
        kit.label(c, P.note, st.W - 14, 16, { size: 11.5, color: C.muted, align: 'right' });
        if (done) kit.label(c, 'finished', x0 + w / 2, y0 + h / 2, { size: 16, weight: 700, align: 'center', color: C.warn, bg: C.bg2 });
      }
      reset(); running = false;
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ amino acids and pH */
  // ionisable groups: [label, pKa, 'a' (neutral → −1) or 'b' (+1 → neutral), form when protonated, when not]
  const AMINO = {
    gly: { name: 'glycine (Gly, G)', side: null, groups: [['α-COOH', 2.34, 'a'], ['α-NH₃⁺', 9.60, 'b']] },
    ala: { name: 'alanine (Ala, A)', side: ['CH₃', 'CH₃'], groups: [['α-COOH', 2.34, 'a'], ['α-NH₃⁺', 9.69, 'b']] },
    cys: { name: 'cysteine (Cys, C)', side: ['CH₂–SH', 'CH₂–S⁻'], groups: [['α-COOH', 1.96, 'a'], ['side-chain SH', 8.18, 'a'], ['α-NH₃⁺', 10.28, 'b']] },
    asp: { name: 'aspartic acid (Asp, D)', side: ['CH₂–COOH', 'CH₂–COO⁻'], groups: [['α-COOH', 1.88, 'a'], ['side-chain COOH', 3.65, 'a'], ['α-NH₃⁺', 9.60, 'b']] },
    glu: { name: 'glutamic acid (Glu, E)', side: ['(CH₂)₂–COOH', '(CH₂)₂–COO⁻'], groups: [['α-COOH', 2.19, 'a'], ['side-chain COOH', 4.25, 'a'], ['α-NH₃⁺', 9.67, 'b']] },
    his: { name: 'histidine (His, H)', side: ['CH₂–imidazole–H⁺', 'CH₂–imidazole'], groups: [['α-COOH', 1.82, 'a'], ['imidazole–H⁺', 6.00, 'b'], ['α-NH₃⁺', 9.17, 'b']] },
    lys: { name: 'lysine (Lys, K)', side: ['(CH₂)₄–NH₃⁺', '(CH₂)₄–NH₂'], groups: [['α-COOH', 2.18, 'a'], ['α-NH₃⁺', 8.95, 'b'], ['side-chain NH₃⁺', 10.53, 'b']] },
    arg: { name: 'arginine (Arg, R)', side: ['(CH₂)₃–guanidinium⁺', '(CH₂)₃–guanidine'], groups: [['α-COOH', 2.17, 'a'], ['α-NH₃⁺', 9.04, 'b'], ['guanidinium', 12.48, 'b']] }
  };
  const groupCharge = (g, pH) => (g[2] === 'b' ? 1 / (1 + Math.pow(10, pH - g[1])) : -1 / (1 + Math.pow(10, g[1] - pH)));
  const netCharge = (A, pH) => A.groups.reduce((s, g) => s + groupCharge(g, pH), 0);
  const fmtZ = z => (Math.abs(z) < 0.005 ? '0.00' : (z > 0 ? '+' : '−') + Math.abs(z).toFixed(2));
  function isoelectric(A) {
    let lo = 0, hi = 14;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (netCharge(A, m) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  Hyper.sim('org-amino-ph', {
    title: 'An amino acid\'s charge against pH',
    blurb: `Every amino acid carries at least two groups that gain or lose a proton with pH: the α-carboxyl and the α-amino group, plus an ionisable side chain in some. Move the **pH** and watch the dominant form change, the net charge follow the curve, and the band in the gel drift towards the electrode of opposite charge.

- Glycine at pH 1 is a cation, at pH 6 a **zwitterion** (+ and − on one molecule, net charge zero), at pH 12 an anion.
- At the **isoelectric point** pI the band stops moving: this is how electrophoresis and isoelectric focusing separate proteins.
- Aspartic and glutamic acid have low pI (acidic side chains); lysine and arginine high pI (basic side chains). Histidine's side chain (pKa 6.0) switches right in the physiological range — which is why it appears in so many enzyme active sites.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const a0 = params && AMINO[params.aa] ? params.aa : 'gly';
      const ctl = kit.controls(box.side, [
        { id: 'aa', type: 'select', label: 'Amino acid', options: Object.keys(AMINO).map(k => [AMINO[k].name, k]), value: a0 },
        { id: 'pH', label: 'pH', min: 0, max: 14, step: 0.05, value: 7 },
        { id: 'gel', type: 'check', label: 'Run the electrophoresis gel', value: true },
        { type: 'buttons', items: [{ id: 'pi', label: 'Go to pI' }, { id: 'again', label: 'Restart the gel' }] }
      ], id => {
        if (id === 'pi') { ctl.set('pH', Math.round(isoelectric(A()) * 100) / 100); }
        if (id === 'aa' || id === 'again' || id === 'pi') band = 0;
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['pka', 'pKa values'], ['pi', 'Isoelectric point pI'], ['z', 'Net charge at this pH'], ['form', 'Main form'], ['move', 'In an electric field']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'pH', min: 0, max: 14 }, y: { label: 'net charge', min: -2.2, max: 2.2 } }, 180);
      const V = ctl.values;
      const A = () => AMINO[V.aa] || AMINO.gly;
      let band = 0;
      function update() {
        const a = A(), pI = isoelectric(a), z = netCharge(a, V.pH);
        ro.set('pka', a.groups.map(g => g[0] + ' ' + g[1].toFixed(2)).join(', '));
        ro.set('pi', pI.toFixed(2));
        ro.set('z', fmtZ(z));
        ro.set('form', Math.abs(z) < 0.5 ? 'zwitterion (net charge about 0)' : z > 0 ? 'cation (net positive)' : 'anion (net negative)');
        ro.set('move', Math.abs(z) < 0.05 ? 'stays put (at its pI)' : z > 0 ? 'towards the negative electrode (cathode)' : 'towards the positive electrode (anode)');
        const pts = [], parts = a.groups.map(() => []);
        for (let p = 0; p <= 14.001; p += 0.1) {
          pts.push([p, netCharge(a, p)]);
          a.groups.forEach((g, i) => parts[i].push([p, groupCharge(g, p)]));
        }
        plot.set({
          series: [{ pts, label: 'net charge', width: 3 }].concat(a.groups.map((g, i) => ({ pts: parts[i], label: g[0], dash: [4, 4] }))),
          vlines: [{ x: pI, label: 'pI ' + pI.toFixed(2) }],
          hlines: [{ y: 0 }],
          marks: [{ x: V.pH, y: z, label: 'pH ' + V.pH.toFixed(2) }]
        });
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const a = A(), z = netCharge(a, V.pH), W = st.W, Hh = st.H;
        if (V.gel && dt) band = clamp(band - z * 0.07 * dt, -1, 1);
        const POS = C.series[0], NEG = C.bad;
        // the dominant form: a protonated group while pH < pKa
        const prot = g => V.pH < g[1];
        const byLabel = l => a.groups.find(g => g[0] === l);
        const nG = byLabel('α-NH₃⁺'), cG = byLabel('α-COOH');
        const sideG = a.groups.find(g => g !== nG && g !== cG);
        const cy = Hh * 0.36, cx = W / 2;
        kit.label(c, a.name + ' at pH ' + V.pH.toFixed(2), 14, 20, { size: 15, weight: 650 });
        kit.label(c, 'main form in solution', 14, 42, { size: 12, color: C.muted });
        const left = prot(nG) ? [['H₃N⁺', POS]] : [['H₂N', C.text]];
        const right = prot(cG) ? [['COOH', C.text]] : [['COO⁻', NEG]];
        spans(c, kit, left, cx - 34, cy, { size: 20, align: 'right' });
        kit.label(c, '—', cx - 22, cy, { size: 20, align: 'center', color: C.muted });
        kit.label(c, 'C', cx, cy, { size: 20, align: 'center', weight: 700 });
        kit.label(c, '—', cx + 22, cy, { size: 20, align: 'center', color: C.muted });
        spans(c, kit, right, cx + 34, cy, { size: 20 });
        kit.label(c, 'H', cx, cy - 30, { size: 18, align: 'center' });
        kit.label(c, '|', cx, cy - 15, { size: 16, align: 'center', color: C.muted });
        kit.label(c, '|', cx, cy + 16, { size: 16, align: 'center', color: C.muted });
        let sideText = 'H', sideCol = C.text;
        if (a.side) {
          if (sideG) { const on = prot(sideG); sideText = a.side[on ? 0 : 1]; sideCol = /⁺/.test(sideText) ? POS : /⁻/.test(sideText) ? NEG : C.text; }
          else sideText = a.side[0];
        }
        kit.label(c, sideText, cx, cy + 32, { size: 17, align: 'center', color: sideCol, weight: 600 });
        kit.label(c, 'net charge ' + fmtZ(z), cx, cy + 62, { size: 14, align: 'center', weight: 650, color: Math.abs(z) < 0.1 ? C.ok : z > 0 ? POS : NEG });
        // the gel
        const gx = 40, gw = W - 80, gy = Hh * 0.8, gh = 26;
        c.fillStyle = C.surface; c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.rect(gx, gy - gh / 2, gw, gh); c.fill(); c.stroke();
        kit.label(c, '−', gx - 16, gy, { size: 22, weight: 700, align: 'center', color: POS });
        kit.label(c, '+', gx + gw + 16, gy, { size: 22, weight: 700, align: 'center', color: NEG });
        kit.label(c, 'cathode', gx, gy + gh / 2 + 12, { size: 11, color: C.muted });
        kit.label(c, 'anode', gx + gw, gy + gh / 2 + 12, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'electrophoresis gel', gx + gw / 2, gy - gh / 2 - 10, { size: 11, color: C.muted, align: 'center' });
        c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(gx + gw / 2, gy - gh / 2); c.lineTo(gx + gw / 2, gy + gh / 2); c.stroke(); c.setLineDash([]);
        const bx = gx + gw / 2 + band * (gw / 2 - 8);
        c.fillStyle = C.warn; c.globalAlpha = 0.85; c.fillRect(bx - 5, gy - gh / 2 + 3, 10, gh - 6); c.globalAlpha = 1;
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

})();
