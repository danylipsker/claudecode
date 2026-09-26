/* HYPER-CHEMISTRY · sims/reference.js — the reference simulations for chemistry
 * authors: particles that react in a flask, counted against a live graph; and a 3-D
 * molecule (kit.mol) whose shape comes from electron pairs pushing one another apart. */
(function () {
  'use strict';

  const SUB = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const pretty = f => f.replace(/\d/g, d => SUB[d]);
  // a #rrggbb colour made 30 % darker, for the shaded edge of an atom
  const darker = hex => {
    const n = parseInt(hex.slice(1), 16);
    return 'rgb(' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * 0.7)).join(',') + ')';
  };

  /* ================================================================ limiting reagent */
  // flat drawings of small molecules, atom positions in ångström
  const SHAPES = {
    H2: [['H', -0.37, 0], ['H', 0.37, 0]],
    O2: [['O', -0.6, 0], ['O', 0.6, 0]],
    N2: [['N', -0.55, 0], ['N', 0.55, 0]],
    H2O: [['H', -0.76, -0.5], ['H', 0.76, -0.5], ['O', 0, 0.1]],
    NH3: [['H', 0, 1.0], ['H', -0.87, -0.5], ['H', 0.87, -0.5], ['N', 0, 0]],
    CH4: [['H', 1.09, 0], ['H', -1.09, 0], ['H', 0, 1.09], ['H', 0, -1.09], ['C', 0, 0]],
    CO2: [['O', -1.16, 0], ['O', 1.16, 0], ['C', 0, 0]]
  };
  const REACTIONS = [
    { name: '2H₂ + O₂ → 2H₂O', r: [['H2', 2], ['O2', 1]], p: [['H2O', 2]] },
    { name: 'N₂ + 3H₂ → 2NH₃', r: [['N2', 1], ['H2', 3]], p: [['NH3', 2]] },
    { name: 'CH₄ + 2O₂ → CO₂ + 2H₂O', r: [['CH4', 1], ['O2', 2]], p: [['CO2', 1], ['H2O', 2]] }
  ];

  Hyper.sim('ref-limiting', {
    title: 'Particles in a flask: who runs out first?',
    blurb: `Each press of **React** lets the molecules combine in the ratio of the equation, one reaction event at a time, until one reactant is gone. The bars compare what you started with (outline) and what is there now; the graph shows how much product the mixture can make.

- Start with 8 H₂ and 6 O₂: hydrogen runs out although there is more of it — it is needed twice as fast.
- Find the exact ratio: nothing is left over. On the graph it is the corner of the line.
- Past the corner, adding more of reactant 1 makes no more product: it is in excess.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const rx0 = params && params.rx != null ? +params.rx : 0;
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: REACTIONS.map((r, i) => [r.name, i]), value: rx0 },
        { id: 'na', label: 'Molecules of reactant 1', min: 0, max: 24, step: 1, value: 8 },
        { id: 'nb', label: 'Molecules of reactant 2', min: 0, max: 24, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'go', label: 'React', primary: true }, { id: 'mix', label: 'Mix again' }] }
      ], id => {
        if (id === 'go') { if (done) mix(); running = true; }
        else mix();
      });
      const ro = kit.readout(box.side, [['ra', 'Reactant 1: n ÷ ν'], ['rb', 'Reactant 2: n ÷ ν'], ['lim', 'Limiting reagent'], ['prod', 'Product at the end'], ['left', 'Left over at the end']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'molecules of reactant 1' }, y: { label: 'product molecules', min: 0 } }, 170);
      const V = ctl.values;
      let R = REACTIONS[rx0], mols = [], flashes = [], running = false, done = false, clock = 0, start = [0, 0];

      const setLabel = (id, text) => {
        const r = ctl.rows[id], lab = r && r.row && r.row.querySelector && r.row.querySelector('.cl span');
        if (lab) lab.textContent = text;
      };
      const spawn = (sp, x, y, speed) => {
        const a = Math.random() * Math.PI * 2, s = (speed || 0.08) * (0.6 + Math.random() * 0.8);
        mols.push({ sp, x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, th: Math.random() * 6.3, w: (Math.random() - 0.5) * 2 });
      };
      function mix() {
        R = REACTIONS[V.rx] || REACTIONS[0];
        setLabel('na', pretty(R.r[0][0]) + ' molecules');
        setLabel('nb', pretty(R.r[1][0]) + ' molecules');
        mols = []; flashes = []; running = false; done = false; clock = 0;
        start = [Math.round(V.na), Math.round(V.nb)];
        start.forEach((n, k) => { for (let i = 0; i < n; i++) spawn(R.r[k][0], 0.06 + Math.random() * 0.88, 0.08 + Math.random() * 0.84); });
        analyse();
      }
      const count = sp => mols.reduce((s, m) => s + (m.sp === sp ? 1 : 0), 0);
      // what the mixture will give when it has finished
      function analyse() {
        const [na, nb] = start, a = R.r[0][1], b = R.r[1][1];
        const qa = na / a, qb = nb / b;
        const events = Math.floor(Math.min(qa, qb));
        ro.set('ra', na + ' ÷ ' + a + ' = ' + kit.fmt(qa, 3));
        ro.set('rb', nb + ' ÷ ' + b + ' = ' + kit.fmt(qb, 3));
        ro.set('lim', na + nb === 0 ? '—' : Math.abs(qa - qb) < 1e-9 ? 'neither: exact ratio' : pretty(R.r[qa < qb ? 0 : 1][0]));
        ro.set('prod', R.p.map(([f, nu]) => events * nu + ' ' + pretty(f)).join(', '));
        ro.set('left', [na - events * a, nb - events * b].map((n, k) => n + ' ' + pretty(R.r[k][0])).join(', '));
        // the product line: what reactant 1 can make with reactant 2 held fixed
        const pts = [];
        for (let x = 0; x <= 24; x += 0.25) pts.push([x, Math.min(x / a, qb) * R.p[0][1]]);
        const corner = a * qb;
        plot.set({
          x: { label: 'molecules of ' + pretty(R.r[0][0]) + ' (' + pretty(R.r[1][0]) + ' fixed at ' + nb + ')', min: 0, max: 24 },
          y: { label: 'molecules of ' + pretty(R.p[0][0]) + ' formed', min: 0, max: Math.max(4, qb * R.p[0][1] * 1.2, 24 / a * R.p[0][1] * 0.2) },
          series: [{ pts, label: pretty(R.p[0][0]) }],
          vlines: corner <= 24 ? [{ x: corner, label: 'exact ratio' }] : [],
          marks: [{ x: na, y: Math.min(qa, qb) * R.p[0][1], label: 'your mixture' }]
        });
      }
      // one reaction event: the right numbers of each reactant, near one another, become products
      function react() {
        for (const [f, nu] of R.r) if (count(f) < nu) return false;
        const seedList = mols.filter(m => m.sp === R.r[0][0]);
        const seed = seedList[Math.floor(Math.random() * seedList.length)];
        const used = [];
        for (const [f, nu] of R.r) {
          const cands = mols.filter(m => m.sp === f && !used.includes(m)).sort((p, q) => Math.hypot(p.x - seed.x, p.y - seed.y) - Math.hypot(q.x - seed.x, q.y - seed.y));
          used.push(...cands.slice(0, nu));
        }
        const cx = used.reduce((s, m) => s + m.x, 0) / used.length, cy = used.reduce((s, m) => s + m.y, 0) / used.length;
        mols = mols.filter(m => !used.includes(m));
        for (const [f, nu] of R.p) for (let k = 0; k < nu; k++) spawn(f, cx + (Math.random() - 0.5) * 0.04, cy + (Math.random() - 0.5) * 0.04, 0.14);
        flashes.push({ x: cx, y: cy, t: 0 });
        return true;
      }

      function drawMolecule(c, sp, x, y, th, s, alpha) {
        const shape = SHAPES[sp] || [['C', 0, 0]];
        const cs = Math.cos(th), sn = Math.sin(th);
        c.globalAlpha = alpha == null ? 1 : alpha;
        for (const [el, ax, ay] of shape) {
          const e = kit.chem.el(el);
          const px = x + (ax * cs - ay * sn) * s, py = y - (ax * sn + ay * cs) * s;
          const r = (0.25 + (e.r || 70) / 100 * 0.6) * s;
          const g = c.createRadialGradient(px - r * 0.35, py - r * 0.35, r * 0.1, px, py, r);
          g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, e.color); g.addColorStop(1, darker(e.color));
          c.beginPath(); c.arc(px, py, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
          c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.55)'; c.stroke();
        }
        c.globalAlpha = 1;
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const vx0 = 12, vy0 = 34, vw = W * 0.6, vh = Hh - vy0 - 14;
        const s = Math.max(10, Math.min(16, Math.min(vw, vh) / 20));
        // motion: a gentle random walk, bouncing off the walls
        for (const m of mols) {
          m.x += m.vx * dt; m.y += m.vy * dt; m.th += m.w * dt;
          if (m.x < 0.04 && m.vx < 0) m.vx = -m.vx; if (m.x > 0.96 && m.vx > 0) m.vx = -m.vx;
          if (m.y < 0.05 && m.vy < 0) m.vy = -m.vy; if (m.y > 0.95 && m.vy > 0) m.vy = -m.vy;
          m.vx *= 0.995; m.vy *= 0.995;
          const sp = Math.hypot(m.vx, m.vy);
          if (sp < 0.05) { m.vx += (Math.random() - 0.5) * 0.02; m.vy += (Math.random() - 0.5) * 0.02; }
        }
        if (running) {
          clock += dt;
          while (clock > 0.22 && running) {
            clock -= 0.22;
            if (!react()) { running = false; done = true; }
          }
        }
        for (const f of flashes) f.t += dt;
        flashes = flashes.filter(f => f.t < 0.6);
        // the equation
        kit.label(c, R.name, vx0 + vw / 2, 16, { size: 16, weight: 600, align: 'center' });
        // the vessel
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.rect(vx0, vy0, vw, vh); c.fill(); c.stroke();
        for (const f of flashes) {
          c.beginPath(); c.arc(vx0 + f.x * vw, vy0 + f.y * vh, 6 + 50 * f.t, 0, Math.PI * 2);
          c.strokeStyle = C.warn; c.globalAlpha = 1 - f.t / 0.6; c.lineWidth = 2; c.stroke(); c.globalAlpha = 1;
        }
        for (const m of mols) drawMolecule(c, m.sp, vx0 + m.x * vw, vy0 + m.y * vh, m.th, s);
        if (done) kit.label(c, 'finished: ' + pretty(R.r.find(([f, nu]) => count(f) < nu)[0]) + ' has run out', vx0 + vw / 2, vy0 + vh - 14, { size: 13, color: C.warn, align: 'center', bg: C.bg2 });
        else if (!running && mols.length) kit.label(c, 'press React', vx0 + vw / 2, vy0 + vh - 14, { size: 12, color: C.muted, align: 'center' });
        // the bars: start (outline) against now (filled)
        const species = R.r.map(([f, nu]) => ({ f, nu, start: start[R.r.findIndex(q => q[0] === f)], kind: 'r' }))
          .concat(R.p.map(([f, nu]) => ({ f, nu, start: null, kind: 'p' })));
        const events = Math.floor(Math.min(start[0] / R.r[0][1], start[1] / R.r[1][1]));
        const top = Math.max(1, ...species.map(q => q.kind === 'r' ? q.start : events * q.nu));
        const bx0 = vx0 + vw + 24, bw = W - bx0 - 12, bh = vh - 50, n = species.length;
        const colw = Math.min(56, bw / n);
        species.forEach((q, i) => {
          const x = bx0 + i * colw + colw * 0.15, w = colw * 0.7, yb = vy0 + bh + 6;
          const now = count(q.f), full = q.kind === 'r' ? q.start : events * q.nu;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]);
          c.strokeRect(x, yb - bh * full / top, w, bh * full / top); c.setLineDash([]);
          c.fillStyle = q.kind === 'r' ? C.series[i % 7] : C.ok;
          c.fillRect(x, yb - bh * now / top, w, bh * now / top);
          kit.label(c, String(now), x + w / 2, yb - bh * now / top - 9, { size: 12, align: 'center' });
          kit.label(c, pretty(q.f), x + w / 2, yb + 13, { size: 13, align: 'center', weight: 600 });
        });
        kit.label(c, 'filled: now', bx0, vy0 + vh - 6, { size: 10.5, color: C.muted });
        kit.label(c, 'dashed: start / end', bx0, vy0 + vh + 7, { size: 10.5, color: C.muted });
      }
      mix();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ VSEPR */
  const PRESETS = [
    ['CO₂ · 2 bonds, 0 lone pairs', { c: 'C', x: 'O', b: 2, l: 0, order: 2 }],
    ['BF₃ · 3, 0', { c: 'B', x: 'F', b: 3, l: 0 }],
    ['SnCl₂ · 2, 1', { c: 'Sn', x: 'Cl', b: 2, l: 1 }],
    ['CH₄ · 4, 0', { c: 'C', x: 'H', b: 4, l: 0 }],
    ['NH₃ · 3, 1', { c: 'N', x: 'H', b: 3, l: 1 }],
    ['H₂O · 2, 2', { c: 'O', x: 'H', b: 2, l: 2 }],
    ['PCl₅ · 5, 0', { c: 'P', x: 'Cl', b: 5, l: 0 }],
    ['SF₄ · 4, 1', { c: 'S', x: 'F', b: 4, l: 1 }],
    ['ClF₃ · 3, 2', { c: 'Cl', x: 'F', b: 3, l: 2 }],
    ['XeF₂ · 2, 3', { c: 'Xe', x: 'F', b: 2, l: 3 }],
    ['SF₆ · 6, 0', { c: 'S', x: 'F', b: 6, l: 0 }],
    ['BrF₅ · 5, 1', { c: 'Br', x: 'F', b: 5, l: 1 }],
    ['XeF₄ · 4, 2', { c: 'Xe', x: 'F', b: 4, l: 2 }]
  ];

  Hyper.sim('ref-vsepr', {
    title: 'VSEPR lab: electron pairs pushing apart',
    blurb: `The bonding pairs and lone pairs around the central atom repel one another and settle as far apart as they can on a sphere — the shape is not drawn from a table, it comes out of the repulsion. Drag the molecule to turn it.

- Go through CH₄ → NH₃ → H₂O: the electron pairs stay tetrahedral, but the *shape* (the atoms only) goes from tetrahedral to pyramidal to bent.
- Untick **Lone pairs push harder** and the angle in water opens back to 109.5°; tick it and it closes to about 104°.
- In SF₄ and ClF₃ the lone pairs choose the roomy equatorial positions. Press **Shake** and watch them find their way back.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 320 });
      const p0 = params && params.mol != null ? +params.mol : 5;
      const ctl = kit.controls(box.side, [
        { id: 'mol', type: 'select', label: 'Molecule', options: PRESETS.map((p, i) => [p[0], i]).concat([['Your own: use the sliders', -1]]), value: p0 },
        { id: 'b', label: 'Bonding pairs (atoms X)', min: 1, max: 6, step: 1, value: PRESETS[p0] ? PRESETS[p0][1].b : 2 },
        { id: 'l', label: 'Lone pairs (E)', min: 0, max: 3, step: 1, value: PRESETS[p0] ? PRESETS[p0][1].l : 2 },
        { id: 'strong', type: 'check', label: 'Lone pairs push harder', value: true },
        { id: 'lone', type: 'check', label: 'Show lone pairs', value: true },
        { id: 'space', type: 'check', label: 'Space-filling', value: false },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true },
        { type: 'buttons', items: [{ id: 'shake', label: 'Shake' }] }
      ], (id, v) => {
        if (id === 'mol') { if (v >= 0) { ctl.set('b', PRESETS[v][1].b); ctl.set('l', PRESETS[v][1].l); } seed(0.35); }
        else if (id === 'b' || id === 'l') {
          if (V.b + V.l > 6) ctl.set(id === 'b' ? 'l' : 'b', 6 - (id === 'b' ? V.b : V.l));
          ctl.set('mol', -1); seed(0.35);
        } else if (id === 'shake') shake();
        loop.once();
      });
      const ro = kit.readout(box.side, [['axe', 'Type'], ['eg', 'Electron pairs'], ['shape', 'Shape'], ['ang', 'Bond angles (model)'], ['ideal', 'Textbook angle']]);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.45, rotY: 0.6 });
      kit.mol.rotator(st, view, () => loop.once());
      let dom = [];   // electron domains: { lone, p: unit vector, v: velocity }

      const unit = p => { const n = Math.hypot(p[0], p[1], p[2]) || 1; return [p[0] / n, p[1] / n, p[2] / n]; };
      function seed(jitter) {
        const b = Math.round(V.b), l = Math.round(V.l);
        const g = kit.chem.vsepr(b, l);
        dom = g.dirs.map(p => ({ lone: false, p })).concat(g.lone.map(p => ({ lone: true, p })))
          .map(d => ({ lone: d.lone, p: unit(d.p.map(x => x + (Math.random() - 0.5) * jitter)), v: [0, 0, 0] }));
        describe();
      }
      function shake() { for (const d of dom) d.p = unit(d.p.map(x => x + (Math.random() - 0.5) * 1.2)); }
      // pairs repel like charges on a sphere; lone pairs, held closer to the nucleus, repel more
      function relax(iter) {
        const wLB = V.strong ? 1.25 : 1, wLL = V.strong ? 1.6 : 1;
        for (let it = 0; it < iter; it++) {
          for (const a of dom) {
            const f = [0, 0, 0];
            for (const c of dom) {
              if (a === c) continue;
              const w = a.lone && c.lone ? wLL : (a.lone || c.lone ? wLB : 1);
              const r = [a.p[0] - c.p[0], a.p[1] - c.p[1], a.p[2] - c.p[2]];
              const L = Math.max(0.05, Math.hypot(r[0], r[1], r[2]));
              for (let k = 0; k < 3; k++) f[k] += w * r[k] / (L * L * L);
            }
            const dot = f[0] * a.p[0] + f[1] * a.p[1] + f[2] * a.p[2];
            for (let k = 0; k < 3; k++) a.v[k] = (a.v[k] + 0.01 * (f[k] - dot * a.p[k])) * 0.88;
          }
          for (const a of dom) a.p = unit([a.p[0] + a.v[0], a.p[1] + a.v[1], a.p[2] + a.v[2]]);
        }
      }
      const preset = () => (V.mol >= 0 && PRESETS[V.mol]) ? PRESETS[V.mol][1] : { c: 'P', x: 'F', b: V.b, l: V.l, custom: true };
      function build() {
        const P = preset();
        const ec = kit.chem.el(P.c), ex = kit.chem.el(P.x);
        const len = ((ec.r || 75) + (ex.r || 75)) / 100;
        const atoms = [{ el: P.c, x: 0, y: 0, z: 0, label: P.custom ? 'A' : undefined }], bonds = [], lone = [];
        for (const d of dom) {
          if (d.lone) lone.push({ atom: 0, dir: d.p });
          else { atoms.push({ el: P.x, x: d.p[0] * len, y: d.p[1] * len, z: d.p[2] * len, label: P.custom ? 'X' : undefined }); bonds.push([0, atoms.length - 1, P.order || 1]); }
        }
        return { atoms, bonds, lone };
      }
      function angles(m) {
        const out = [];
        for (let i = 1; i < m.atoms.length; i++) for (let j = i + 1; j < m.atoms.length; j++) out.push({ i, j, a: kit.mol.angle(m, i, 0, j) });
        return out;
      }
      function describe() {
        const b = Math.round(V.b), l = Math.round(V.l);
        const g = kit.chem.vsepr(b, l);
        const sub = n => String(n).replace(/\d/g, d => SUB[d]);
        ro.set('axe', 'AX' + sub(b) + (l ? 'E' + (l > 1 ? sub(l) : '') : '') + ' · ' + (b + l) + ' electron pairs');
        ro.set('eg', g.electronGeometry);
        ro.set('shape', b + l > 6 ? '—' : g.name);
        ro.set('ideal', String(g.angle).replace(/(\d+(\.\d+)?)/g, '$1°').replace(/</g, '< '));
      }

      function frame(dt) {
        relax(dt ? 30 : 0);
        if (V.spin && !view.dragging) view.rotY += 0.35 * (dt || 0);
        const m = build();
        const as = angles(m);
        // distinct angles, grouped to the nearest degree
        const uniq = [];
        for (const x of as.map(q => q.a).sort((p, q) => p - q)) if (!uniq.length || x - uniq[uniq.length - 1] > 1.5) uniq.push(x);
        ro.set('ang', uniq.length ? uniq.slice(0, 3).map(x => x.toFixed(1) + '°').join(', ') + (uniq.length > 3 ? ' …' : '') : '—');
        const C = kit.colors();
        const c = st.begin();
        // zoom to fit: the farthest atom (plus its ball) or lone-pair lobe from the centre, in ångström
        const P = preset(), rc = (kit.chem.el(P.c).r || 75) / 100, rx = (kit.chem.el(P.x).r || 75) / 100;
        const extent = Math.max(rc + rx + (V.space ? rx * 1.25 : 0.28 + rx * 0.22), (0.28 + rc * 0.22 + 0.5) * 1.15) + 0.2;
        view.scale = Math.min(st.W, st.H - 50) / (2 * extent);
        const small = as.slice().sort((p, q) => p.a - q.a)[0];
        kit.mol.draw(c, m, view, { cx: st.W / 2, cy: st.H / 2 + 8, style: V.space ? 'space' : 'ball', lone: V.lone, angle: small && !V.space ? [small.i, 0, small.j] : null });
        const g = kit.chem.vsepr(Math.round(V.b), Math.round(V.l));
        kit.label(c, (V.mol >= 0 ? PRESETS[V.mol][0].split(' ·')[0] + ': ' : '') + g.name, 14, 20, { size: 17, weight: 650 });
        kit.label(c, 'electron pairs: ' + g.electronGeometry, 14, 42, { size: 12.5, color: C.muted });
        kit.label(c, 'drag to turn', st.W - 14, st.H - 14, { size: 11, color: C.faint, align: 'right' });
      }
      seed(0.35);
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
