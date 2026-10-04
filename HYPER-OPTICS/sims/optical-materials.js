/* HYPER-OPTICS · sims/optical-materials.js — simulations of the topic "Optical materials" (prefix om-)
 *   om-glass-code     the six digits of a glass code, read from n_d and V_d; the index curve with the F, d and C lines
 *   om-glass-map      the Abbe diagram of every material in the table, and the partial-dispersion view; pick two glasses
 *   om-dispersion     n(λ) of a glass from its Sellmeier terms, with a Cauchy fit, the group index and the resonances
 *   om-transmission   a plate of material: Fresnel losses and Beer–Lambert absorption, internal and external transmittance
 *   om-band-chart     the transmission windows of glasses, crystals, plastics and infrared materials on one wavelength axis
 *   om-properties     bar charts of index, Abbe number, density, expansion, dn/dT and the thermal focus coefficient
 *   om-thermal        a lens in a barrel: the focus moves with temperature; athermal housings
 *   om-fringes        an interferogram of a surface (flatness) or of a glass blank (homogeneity), in fringes and in waves
 *   om-drawing        an optical drawing with its callouts: click an indication to read what it states
 *   om-making         from blank to lens: the stages of generating, grinding, polishing and centring
 * All numbers come from kit.optics; the drawing is kit.osym and the canvas helpers of the kit.
 */
(function () {
  'use strict';
  const R2D = 180 / Math.PI;
  const fx = (x, d) => Number.isFinite(x) ? x.toFixed(d) : '—';
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  // Gaussian elimination with partial pivoting: solves A x = b
  function gauss(A, b) {
    const n = b.length, M = A.map((r, i) => r.concat([b[i]]));
    for (let i = 0; i < n; i++) {
      let p = i; for (let r = i + 1; r < n; r++) if (Math.abs(M[r][i]) > Math.abs(M[p][i])) p = r;
      [M[i], M[p]] = [M[p], M[i]];
      if (Math.abs(M[i][i]) < 1e-300) return b.map(() => 0);
      for (let r = i + 1; r < n; r++) { const f = M[r][i] / M[i][i]; for (let c = i; c <= n; c++) M[r][c] -= f * M[i][c]; }
    }
    const x = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) { let s = M[i][n]; for (let c = i + 1; c < n; c++) s -= M[i][c] * x[c]; x[i] = s / M[i][i]; }
    return x;
  }
  // short names for labels on the glass map
  const SHORT = { 'fused-silica': 'fused silica', 'CaF2': 'CaF₂', 'MgF2': 'MgF₂', 'sapphire': 'sapphire', 'calcite-o': 'calcite o', 'calcite-e': 'calcite e', 'quartz-o': 'quartz o', 'quartz-e': 'quartz e', 'water': 'water', 'crown-1.523': 'crown 1.523', 'PMMA': 'PMMA', 'PC': 'PC', 'PS': 'PS', 'COP': 'COP', 'CR-39': 'CR-39', 'trivex': 'Trivex', 'hi-1.60': 'plastic 1.60', 'hi-1.67': 'plastic 1.67', 'hi-1.74': 'plastic 1.74' };
  const shortName = id => SHORT[id] || id;
  const GLASS_LIST = [['N-FK51A · fluor crown', 'N-FK51A'], ['Fused silica', 'fused-silica'], ['N-K5 · crown', 'N-K5'], ['N-BK7 · borosilicate crown', 'N-BK7'], ['N-BAK4 · barium crown', 'N-BAK4'], ['N-SK16 · dense crown', 'N-SK16'], ['N-LAK9 · lanthanum crown', 'N-LAK9'], ['N-BAF10 · barium flint', 'N-BAF10'], ['F2 · flint', 'F2'], ['N-SF5 · dense flint', 'N-SF5'], ['N-SF10 · dense flint', 'N-SF10'], ['N-SF11 · dense flint', 'N-SF11'], ['N-SF6 · dense flint', 'N-SF6'], ['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC']];

  /* ================================================================ the glass code */
  Hyper.sim('om-glass-code', {
    title: 'The glass code: index, Abbe number and the spread of colours',
    blurb: `Pick a material. The six digits of its **glass code** are read straight off two numbers, the index n_d and the Abbe number V_d. The bar shows where the material sits between crowns and flints, and the graph shows its index across the visible spectrum with the three lines F, d and C that define V_d.

**Try this**
- Choose *N-BK7*: 517642 is n_d = 1.517 and V_d = 64.2. Then *N-SF11*: 785257, a much higher index and a much steeper curve.
- Compare *N-SK16* and *F2*. Their first three digits are the same (index 1.620), but the Abbe number, and the curve, are quite different: the index alone does not name a glass.
- Watch the vertical distance between the F and C marks, n_F − n_C, grow as V_d falls. That gap is the spread of colours.
- Try *fused silica* and the plastics: the same reading works for every transparent material.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: GLASS_LIST, value: params.mat || 'N-BK7' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['code', 'Glass code'], ['seven', 'With the density'], ['nd', 'Index n_d (587.56 nm)'], ['nF', 'Index n_F (486.13 nm)'], ['nC', 'Index n_C (656.27 nm)'], ['dn', 'Principal dispersion n_F − n_C'], ['Vd', 'Abbe number V_d'], ['cls', 'Class']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'refractive index n', min: 1.4, max: 1.9 } }, 200);
      const L = O.LINES;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const m = O.MATERIALS[V.mat], a = O.abbe(V.mat), code = O.glassCode(V.mat);
        const bound = a.nd < 1.60 ? 55 : 50;
        // the six digits
        const s = Math.max(30, Math.min(54, (Math.min(W - 60, 520) - 60) / 6)), gap = 6, grp = 22;
        const total = 6 * s + 4 * gap + grp, x0 = (W - total) / 2 - 20, y0 = 20;
        const dx = i => x0 + i * (s + gap) + (i >= 3 ? grp - gap : 0);
        for (let i = 0; i < 6; i++) {
          rrect(c, dx(i), y0, s, s * 1.15, 8);
          c.fillStyle = i < 3 ? S.glass(0.22) : 'rgba(224,160,48,0.20)'; c.fill();
          c.strokeStyle = i < 3 ? S.edge() : C.warn; c.lineWidth = 1.3; c.stroke();
          kit.label(c, code[i], dx(i) + s / 2, y0 + s * 0.58, { size: s * 0.7, align: 'center', color: C.text, weight: 700, font: MONO });
        }
        const g1 = [dx(0), dx(2) + s], g2 = [dx(3), dx(5) + s], yb = y0 + s * 1.15 + 8;
        for (const [g, col] of [[g1, S.edge()], [g2, C.warn]]) { c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(g[0], yb); c.lineTo(g[0], yb + 5); c.lineTo(g[1], yb + 5); c.lineTo(g[1], yb); c.stroke(); }
        kit.label(c, 'n_d = ' + fx(a.nd, 4), (g1[0] + g1[1]) / 2, yb + 17, { align: 'center', size: 13, weight: 650 });
        kit.label(c, '(n_d − 1) × 1000 → ' + code.slice(0, 3), (g1[0] + g1[1]) / 2, yb + 34, { align: 'center', size: 11.5, color: C.muted });
        kit.label(c, 'V_d = ' + fx(a.vd, 2), (g2[0] + g2[1]) / 2, yb + 17, { align: 'center', size: 13, weight: 650 });
        kit.label(c, '10 × V_d → ' + code.slice(3), (g2[0] + g2[1]) / 2, yb + 34, { align: 'center', size: 11.5, color: C.muted });
        if (m.density) {
          const dens = String(Math.round(m.density * 100)).padStart(3, '0'), xd = g2[1] + 14;
          kit.label(c, '.' + dens, xd, y0 + s * 0.58, { size: s * 0.5, color: C.muted, font: MONO, weight: 600 });
          kit.label(c, 'density ' + fx(m.density, 2) + ' g/cm³', xd, yb + 17, { size: 11.5, color: C.muted });
        }
        // the crown–flint bar: V_d from 100 (left) to 20 (right)
        const bx = 34, bw = W - 68, by = Hh - 66, bh = 20, X = v => bx + (100 - v) / 80 * bw;
        c.save(); c.globalAlpha = 1; c.fillStyle = S.glass(0.26); c.fillRect(bx, by, X(bound) - bx, bh);
        c.fillStyle = 'rgba(224,160,48,0.28)'; c.fillRect(X(bound), by, bx + bw - X(bound), bh); c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(bound), by - 4); c.lineTo(X(bound), by + bh + 4); c.stroke();
        kit.label(c, 'crown', (bx + X(bound)) / 2, by + bh / 2, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'flint', (X(bound) + bx + bw) / 2, by + bh / 2, { align: 'center', color: C.muted, size: 12 });
        for (const v of [100, 80, 60, 40, 20]) kit.label(c, String(v), X(v), by + bh + 11, { align: 'center', color: C.faint, size: 11 });
        kit.label(c, 'Abbe number V_d', bx + bw, by + bh + 26, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'boundary ' + bound, X(bound), by - 11, { align: 'center', color: C.muted, size: 11 });
        for (const e of GLASS_LIST) { const aa = O.abbe(e[1]); if (Number.isFinite(aa.vd)) kit.dot(c, X(aa.vd), by + bh / 2 + 11, 2.2, C.faint); }
        const mx = X(a.vd);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(mx, by - 3); c.lineTo(mx - 7, by - 15); c.lineTo(mx + 7, by - 15); c.closePath(); c.fill();
        kit.label(c, m.name.split(' (')[0], mx, by - 26, { align: 'center', weight: 650, size: 12.5, color: C.text });
        // the index curve with the three lines
        const pts = [];
        for (let nm = 400; nm <= 700; nm += 10) pts.push([nm, O.index(V.mat, nm)]);
        plot.set({ series: [{ pts, label: m.name.split(' (')[0] }], marks: [{ x: L.F, y: a.nF, label: 'F' }, { x: L.d, y: a.nd, label: 'd' }, { x: L.C, y: a.nC, label: 'C' }] });
        ro.set('code', code);
        ro.set('seven', m.density ? code + '.' + String(Math.round(m.density * 100)).padStart(3, '0') : '—');
        ro.set('nd', fx(a.nd, 5));
        ro.set('nF', fx(a.nF, 5));
        ro.set('nC', fx(a.nC, 5));
        ro.set('dn', fx(a.dn, 5));
        ro.set('Vd', fx(a.vd, 2));
        ro.set('cls', a.vd > bound ? 'crown (V_d above ' + bound + ' for n_d ' + (a.nd < 1.60 ? 'below' : 'above') + ' 1.60)' : 'flint (V_d below ' + bound + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the glass map */
  Hyper.sim('om-glass-map', {
    title: 'The glass map: every material of the table on one diagram',
    blurb: `Each dot is a material, placed by its index n_d (up) and its Abbe number V_d (to the **left** for low dispersion, as the old diagram has it). Drag across the map to choose glass **A**, switch the control to **B**, and pick a second one: the read-out gives the focal lengths of the two elements of a 100 mm achromat made from the pair.

**Try this**
- Put A on *N-BK7* and B on *F2*, then B on *N-SF5*, and then A on *N-FK51A*. The wider the gap in V_d, the gentler the two lenses.
- Find the crown–flint boundary (the step at V_d = 55 and 50) and decide where PMMA, polycarbonate and calcium fluoride lie.
- Switch to the *partial dispersion* view: most glasses lie on a straight "normal line". The fluor crown N-FK51A and the two fluorides sit far above it: those are the materials that can cancel the secondary spectrum.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const all = [];
      for (const m of Object.values(O.MATERIALS)) {
        if (!['glass', 'crystal', 'plastic', 'liquid'].includes(m.kind) || m.id === 'diamond') continue;
        const a = O.abbe(m.id);
        if (!Number.isFinite(a.vd) || a.vd > 150) continue;
        all.push({ id: m.id, name: shortName(m.id), full: m.name, kind: m.kind, nd: a.nd, vd: a.vd, P: (O.index(m.id, O.LINES.g) - a.nF) / (a.nF - a.nC), sell: !!m.s });
      }
      const byId = id => all.find(p => p.id === id) || all[0];
      const sel = { A: byId(params.a || 'N-BK7'), B: byId(params.b || 'F2') };
      const NL = v => 0.6438 - 0.001682 * v;                      // the normal line of partial dispersion
      const LABELLED = new Set(['N-BK7', 'N-SF11', 'N-FK51A', 'fused-silica', 'F2', 'CaF2', 'MgF2', 'PMMA', 'PC', 'sapphire', 'N-LAK9', 'N-SF6', 'N-BAK4', 'calcite-o', 'calcite-e', 'water']);
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'The map shows', options: [['Index against Abbe number', 'abbe'], ['Partial dispersion against Abbe number', 'pgf']], value: params.view || 'abbe' },
        { id: 'which', type: 'select', label: 'Dragging on the map moves', options: [['Glass A', 'A'], ['Glass B', 'B']], value: 'A' },
        { id: 'g', type: 'check', label: 'Glasses', value: true },
        { id: 'c', type: 'check', label: 'Crystals', value: true },
        { id: 'p', type: 'check', label: 'Plastics', value: true },
        { id: 'line', type: 'check', label: 'Crown / flint boundary', value: true },
        { type: 'buttons', items: [{ id: 'swap', label: 'Swap A and B' }] }
      ], id => {
        if (id === 'swap') { const t = sel.A; sel.A = sel.B; sel.B = t; }
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Glass A'], ['B', 'Glass B'], ['dV', 'Difference in Abbe number'], ['f', 'Elements of a 100 mm achromat'], ['P', 'Partial dispersion minus the normal line']]);
      let hover = null;
      const visible = () => all.filter(p => (p.kind === 'glass' && V.g) || (p.kind === 'crystal' && V.c) || (p.kind === 'plastic' && V.p) || p.kind === 'liquid').filter(p => V.view === 'abbe' || p.sell);
      const geom = () => {
        const Lm = 58, Rm = 16, T = 14, B = 42, W = st.W, Hh = st.H, pg = V.view === 'pgf';
        const y0 = pg ? 0.515 : 1.36, y1 = pg ? 0.640 : 1.92;
        return { Lm, Rm, T, B, W, Hh, pg, y0, y1, X: v => Lm + (110 - v) / 90 * (W - Lm - Rm), Y: y => T + (y1 - y) / (y1 - y0) * (Hh - T - B) };
      };
      const pos = p => { const g = geom(); return [g.X(p.vd), g.Y(g.pg ? p.P : p.nd)]; };
      const nearest = q => { let best = null, bd = 1e9; for (const p of visible()) { const [x, y] = pos(p); const d = Math.hypot(x - q.x, y - q.y); if (d < bd) { bd = d; best = p; } } return bd < 42 ? best : null; };
      const pick = p => { sel[V.which] = p; loop.once(); };
      kit.drag(st, { hover: true, hit: q => nearest(q), start: p => pick(p), move: (p, q) => { const n = nearest(q); if (n) pick(n); } });
      st.canvas.addEventListener('pointermove', e => { const n = nearest(st.pos(e)); if (n !== hover) { hover = n; loop.once(); } });
      const kindCol = (C, k) => k === 'glass' ? C.series[0] : k === 'crystal' ? C.series[1] : k === 'plastic' ? C.series[2] : C.series[3];
      const code = p => p.vd < 100 && p.nd < 2 ? O.glassCode(p.id) : '—';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom();
        // grid and axes
        c.lineWidth = 1; c.strokeStyle = C.grid;
        for (let v = 20; v <= 110; v += 10) { const x = Math.round(g.X(v)) + 0.5; c.beginPath(); c.moveTo(x, g.T); c.lineTo(x, g.Hh - g.B); c.stroke(); kit.label(c, String(v), x, g.Hh - g.B + 12, { align: 'center', color: C.muted, size: 11 }); }
        const ys = g.pg ? 0.02 : 0.1, yStart = Math.ceil(g.y0 / ys - 1e-9) * ys;
        for (let y = yStart; y <= g.y1 + 1e-9; y += ys) { const yy = Math.round(g.Y(y)) + 0.5; c.beginPath(); c.moveTo(g.Lm, yy); c.lineTo(g.W - g.Rm, yy); c.stroke(); kit.label(c, y.toFixed(g.pg ? 2 : 1), g.Lm - 6, yy, { align: 'right', color: C.muted, size: 11 }); }
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(g.Lm, g.T, g.W - g.Lm - g.Rm, g.Hh - g.T - g.B);
        kit.label(c, 'Abbe number V_d  (high dispersion →)', g.W - g.Rm, g.Hh - 8, { align: 'right', color: C.text, weight: 600, size: 12 });
        kit.label(c, g.pg ? 'partial dispersion P_g,F' : 'index n_d', g.Lm + 6, g.T + 11, { color: C.text, weight: 600, size: 12 });
        // the crown / flint boundary or the normal line
        if (!g.pg && V.line) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.setLineDash([6, 4]);
          c.beginPath(); c.moveTo(g.X(50), g.T); c.lineTo(g.X(50), g.Y(1.60)); c.lineTo(g.X(55), g.Y(1.60)); c.lineTo(g.X(55), g.Hh - g.B); c.stroke(); c.restore();
          kit.label(c, 'crowns', g.X(80), g.T + 26, { align: 'center', color: C.warn, size: 12.5, weight: 650 });
          kit.label(c, 'flints', g.X(33), g.Hh - g.B - 14, { align: 'center', color: C.warn, size: 12.5, weight: 650 });
        }
        if (g.pg) {
          c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.3; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(g.X(100), g.Y(NL(100))); c.lineTo(g.X(20), g.Y(NL(20))); c.stroke(); c.restore();
          kit.label(c, 'normal line', g.X(30), g.Y(NL(30)) - 14, { align: 'center', color: C.muted, size: 11.5 });
        }
        // the pair
        const A = sel.A, B = sel.B, pa = pos(A), pb = pos(B);
        c.save(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(pa[0], pa[1]); c.lineTo(pb[0], pb[1]); c.stroke(); c.restore();
        for (const p of visible()) {
          const [x, y] = pos(p), isSel = p === A || p === B;
          kit.dot(c, x, y, isSel ? 6.5 : 4.3, kindCol(C, p.kind), isSel ? C.text : null);
          if (LABELLED.has(p.id) || isSel || p === hover) kit.label(c, p.name + (p === A ? '  (A)' : p === B ? '  (B)' : ''), x + 8, y - 7, { size: p === hover || isSel ? 12 : 11, color: isSel ? C.text : p === hover ? C.text : C.muted, weight: isSel ? 650 : 500 });
        }
        // legend
        let lx = g.Lm + 10;
        for (const [k, t] of [['glass', 'glasses'], ['crystal', 'crystals'], ['plastic', 'plastics'], ['liquid', 'water']]) { kit.dot(c, lx, g.Hh - g.B - 14 + (g.pg ? -22 : 0), 4, kindCol(C, k)); kit.label(c, t, lx + 8, g.Hh - g.B - 14 + (g.pg ? -22 : 0), { size: 11, color: C.muted }); lx += 22 + t.length * 6.6; }
        // read-outs
        const crownSide = A.vd >= B.vd ? A : B, flintSide = A.vd >= B.vd ? B : A, dV = crownSide.vd - flintSide.vd;
        ro.set('A', A.full.split(' (')[0] + ' · ' + code(A) + (A.sell ? '' : ' (n_d, V_d only)'));
        ro.set('B', B.full.split(' (')[0] + ' · ' + code(B) + (B.sell ? '' : ' (n_d, V_d only)'));
        ro.set('dV', fx(dV, 1));
        ro.set('f', dV < 2 ? 'no achromat: the Abbe numbers are too close' : crownSide.name + ' ' + fx(100 * dV / crownSide.vd, 1) + ' mm, ' + flintSide.name + ' ' + fx(-100 * dV / flintSide.vd, 1) + ' mm');
        ro.set('P', A.sell && B.sell ? 'A ' + (A.P - NL(A.vd) >= 0 ? '+' : '−') + Math.abs(A.P - NL(A.vd)).toFixed(4) + ' · B ' + (B.P - NL(B.vd) >= 0 ? '+' : '−') + Math.abs(B.P - NL(B.vd)).toFixed(4) : 'only for materials with a dispersion formula');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dispersion formulas */
  Hyper.sim('om-dispersion', {
    title: 'Dispersion formulas: Sellmeier against Cauchy',
    blurb: `The index of a glass against wavelength, computed from its Sellmeier terms. A Cauchy curve (two or three terms) is fitted to the same data between 400 and 700 nm only, and the strip above the graph shows where the visible band lies.

**Try this**
- In the *visible* range the Cauchy curve lies on top of the Sellmeier curve. Open the range to *250 to 2500 nm*: the fit drifts away in the infrared, and a third term helps only in the ultraviolet (try N-SF11).
- Switch on the *resonances*. The curve climbs steeply towards the ultraviolet resonance, which is why blue is bent more than red.
- Open the range to *12 000 nm* with N-BK7: the formula breaks down at the infrared resonance near 10.2 µm, where the glass absorbs and the curve is cut off.
- Switch on the *group index* and move the wavelength: n_g is above n in the transparent range.
- Choose *calcium fluoride* and compare its flat curve with *N-SF11*.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { height: 64, minH: 60, maxH: 70 });
      const gb = document.createElement('div'); gb.style.padding = '0 0 10px'; box.stage.appendChild(gb);
      const MATS = GLASS_LIST.slice(0, 13).concat([['Calcium fluoride', 'CaF2'], ['Magnesium fluoride', 'MgF2'], ['Sapphire', 'sapphire']]).filter(e => O.MATERIALS[e[1]] && O.MATERIALS[e[1]].s);
      const RANGES = { vis: [400, 700], wide: [250, 2500], ir: [250, 12000] };
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'range', type: 'select', label: 'Wavelength range', options: [['Visible, 400 to 700 nm', 'vis'], ['Ultraviolet to near infrared, 250 to 2500 nm', 'wide'], ['To the infrared resonance, 250 to 12 000 nm', 'ir']], value: params.range || 'vis' },
        { id: 'cau', type: 'select', label: 'Cauchy fit (to 400–700 nm)', options: [['none', 0], ['two terms: A + B/λ²', 2], ['three terms: + C/λ⁴', 3]], value: params.cau != null ? params.cau : 2 },
        { id: 'grp', type: 'check', label: 'Show the group index', value: !!params.grp },
        { id: 'res', type: 'check', label: 'Mark the resonances', value: params.res !== false },
        { id: 'lam', label: 'Wavelength', min: 250, max: 2400, step: 1, value: params.lam || 587.56, unit: 'nm' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Index n'], ['slope', 'Slope dn/dλ'], ['ng', 'Group index'], ['cau', 'Cauchy value (error)'], ['ABC', 'Cauchy constants'], ['res', 'Resonances √C']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', min: 400, max: 700 }, y: { label: 'refractive index n' }, pad: [14, 16, 38, 58] }, 300);
      const cache = {};
      const fit = (id, k) => {
        const key = id + k;
        if (cache[key]) return cache[key];
        const A = Array.from({ length: k }, () => new Array(k).fill(0)), b = new Array(k).fill(0);
        for (let nm = 400; nm <= 700; nm += 10) {
          const x = 1 / Math.pow(nm / 1000, 2), phi = [1, x, x * x].slice(0, k), n = O.index(id, nm);
          for (let r = 0; r < k; r++) { b[r] += phi[r] * n; for (let q = 0; q < k; q++) A[r][q] += phi[r] * phi[q]; }
        }
        return (cache[key] = gauss(A, b));
      };
      const cauchy = (co, nm) => { const x = 1 / Math.pow(nm / 1000, 2); return co[0] + co[1] * x + (co[2] || 0) * x * x; };
      const ok = n => Number.isFinite(n) && n > 1 && n < 3 ? n : NaN;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const m = O.MATERIALS[V.mat], [lo, hi] = RANGES[V.range], x0 = 58, x1 = W - 16, X = nm => x0 + (nm - lo) / (hi - lo) * (x1 - x0);
        // the strip: ultraviolet, visible, infrared
        c.fillStyle = C.surface; c.fillRect(x0, 8, x1 - x0, 26);
        const v0 = Math.max(lo, 380), v1 = Math.min(hi, 780);
        if (v1 > v0) S.spectrum(c, X(v0), 8, X(v1) - X(v0), 26, v0, v1);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, 8, x1 - x0, 26);
        if (lo < 380) kit.label(c, 'ultraviolet', Math.min(X(380) - 6, x0 + 56), 21, { align: X(380) - x0 > 70 ? 'center' : 'right', color: C.muted, size: 11 });
        if (hi > 780) kit.label(c, 'infrared', X(780) + 8, 21, { align: 'left', color: C.muted, size: 11 });
        if (hi <= 780) kit.label(c, 'visible', (x0 + x1) / 2, 21, { align: 'center', color: C.text, size: 11 });
        const res = [m.s[3], m.s[4], m.s[5]].map(v => Math.sqrt(v) * 1000);                // nm
        if (V.res) res.forEach((r, i) => { if (r >= lo && r <= hi) { const x = X(r); c.fillStyle = C.bad; c.beginPath(); c.moveTo(x, 46); c.lineTo(x - 5, 56); c.lineTo(x + 5, 56); c.closePath(); c.fill(); } });
        kit.label(c, V.res ? 'red marks: resonances of the material' : '', x1, 54, { align: 'right', color: C.muted, size: 10.5 });
        // the curves
        const pts = [], gpts = [], cpts = [], N = 160;
        const co = V.cau ? fit(V.mat, V.cau) : null;
        let ymin = 9, ymax = 0;
        for (let i = 0; i <= N; i++) {
          const nm = lo + (hi - lo) * i / N, n = ok(O.index(V.mat, nm));
          pts.push([nm, n]);
          if (Number.isFinite(n)) { ymin = Math.min(ymin, n); ymax = Math.max(ymax, n); }
          if (V.grp) { const ng = ok(O.groupIndex(V.mat, nm)); gpts.push([nm, ng]); if (Number.isFinite(ng)) { ymin = Math.min(ymin, ng); ymax = Math.max(ymax, ng); } }
          if (co) { const cn = ok(cauchy(co, nm)); cpts.push([nm, cn]); if (Number.isFinite(cn)) { ymin = Math.min(ymin, cn); ymax = Math.max(ymax, cn); } }
        }
        if (!(ymax > ymin)) { ymin = 1.4; ymax = 1.9; }
        const pad = (ymax - ymin) * 0.06 + 0.001;
        const series = [{ pts, label: 'Sellmeier' }];
        if (co) series.push({ pts: cpts, label: V.cau === 2 ? 'Cauchy, two terms' : 'Cauchy, three terms', dash: true });
        if (V.grp) series.push({ pts: gpts, label: 'group index n_g' });
        const vl = V.res ? res.filter(r => r >= lo && r <= hi).map(r => ({ x: r, color: C.bad })) : [];
        const nmCur = Math.max(lo, Math.min(hi, V.lam)), nCur = ok(O.index(V.mat, nmCur));
        plot.set({ x: { label: 'wavelength (nm)', min: lo, max: hi }, y: { label: 'refractive index', min: ymin - pad, max: ymax + pad }, series, vlines: vl, marks: Number.isFinite(nCur) ? [{ x: nmCur, y: nCur }] : [] });
        const n = O.index(V.mat, V.lam), slope = (O.index(V.mat, V.lam + 1) - O.index(V.mat, V.lam - 1)) / 2 * 1000;
        ro.set('n', fx(n, 5) + ' at ' + fx(V.lam, 0) + ' nm');
        ro.set('slope', fx(slope, 4) + ' per µm');
        ro.set('ng', fx(O.groupIndex(V.mat, V.lam), 4));
        ro.set('cau', co ? fx(cauchy(co, V.lam), 5) + '  (' + (cauchy(co, V.lam) - n >= 0 ? '+' : '−') + Math.abs(cauchy(co, V.lam) - n).toExponential(1) + ')' : 'switched off');
        ro.set('ABC', co ? 'A = ' + fx(co[0], 4) + ', B = ' + fx(co[1], 5) + ' µm²' + (co.length > 2 ? ', C = ' + fx(co[2], 6) + ' µm⁴' : '') : '—');
        ro.set('res', res.map(r => (r / 1000).toPrecision(3) + ' µm').join(', '));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ transmission of a plate */
  const KINDCOL = (C, k) => k === 'glass' ? C.series[0] : k === 'crystal' ? C.series[1] : k === 'plastic' ? C.series[2] : k === 'ir' ? C.series[3] : C.series[4];
  const WL = nm => nm >= 1000 ? (nm / 1000).toPrecision(3).replace(/\.?0+$/, '') + ' µm' : Math.round(nm) + ' nm';
  Hyper.sim('om-transmission', {
    title: 'Light through a plate: reflection, absorption and the window',
    blurb: `A beam meets a plate. At each face a fraction R is reflected (Fresnel); inside, the beam fades by e^(−αd). The stacked bar shows where the light goes, and the graph shows the external transmittance (solid) and the internal one (dashed) across the spectrum. The **window edges** are placed at the typical transmission range of each material and the curve between them is **schematic**; the reflection losses are exact.

**Try this**
- *N-BK7* at 550 nm: about 8 % is lost at the two faces however thick the plate is; move the thickness slider up to 200 mm and watch absorption eat the rest.
- Tick the *anti-reflection coating*: the surface loss almost vanishes, and what remains is absorption.
- Choose *germanium* and sweep the wavelength from 550 nm to 10 µm: opaque, then a window with a huge surface loss, 36 % at each face.
- Choose *fused silica* and go to 200 nm, then *N-BK7*: only one of them is still clear.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const MATS = [['N-BK7 (crown glass)', 'N-BK7'], ['N-SF11 (dense flint glass)', 'N-SF11'], ['Fused silica', 'fused-silica'], ['Sapphire', 'sapphire'], ['Calcium fluoride', 'CaF2'], ['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC'], ['Silicon', 'silicon'], ['Germanium', 'germanium'], ['Zinc selenide', 'ZnSe'], ['Zinc sulfide', 'ZnS']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'd', label: 'Thickness', min: 0.1, max: 200, value: params.d || 10, unit: 'mm', log: true, sig: 3 },
        { id: 'nm', label: 'Wavelength', min: 150, max: 20000, value: params.nm || 550, log: true, sig: 3, fmt: WL },
        { id: 'coat', type: 'check', label: 'Anti-reflection coating on both faces (0.5 % left)', value: !!params.coat }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Refractive index'], ['R', 'Reflectance per face'], ['tau', 'Internal transmittance'], ['T', 'External transmittance'], ['split', 'Reflected · absorbed'], ['OD', 'Optical density −log T'], ['win', 'Typical window']]);
      const plot = kit.plot(gb, { x: { label: 'wavelength (nm)', log: true, min: 100, max: 30000 }, y: { label: 'transmittance (%)', min: 0, max: 100 } }, 210);
      const FLOOR = { glass: 0.0002, crystal: 0.0002, plastic: 0.0008, ir: 0.0005, liquid: 0.0003 };
      // absorption coefficient per mm: a floor, and a steep rise at each edge of the window (schematic)
      const alpha = (id, nm) => {
        const m = O.MATERIALS[id], lo = m.range[0], hi = m.range[1], a0 = Math.LN2 / 10;
        return (FLOOR[m.kind] || 0.0003) + a0 * Math.exp((lo - nm) / (0.04 * lo)) + a0 * Math.exp((nm - hi) / (0.10 * hi));
      };
      const calc = (id, nm, d, coat) => {
        const n = O.index(id, nm), R = coat ? 0.005 : O.normalR(1, n), tau = Math.exp(-alpha(id, nm) * d);
        const den = 1 - R * R * tau * tau, T = (1 - R) * (1 - R) * tau / den;
        const refl = R + R * (1 - R) * (1 - R) * tau * tau / den;
        return { n, R, tau, T, refl, abs: Math.max(0, 1 - T - refl) };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, m = O.MATERIALS[V.mat], r = calc(V.mat, V.nm, V.d, V.coat);
        const cy = Hh * 0.4, bh = Math.min(30, Hh * 0.1), sx = W * 0.34, sw = 36 + 110 * Math.log10(V.d / 0.1) / Math.log10(2000), sh = Math.min(Hh * 0.3, 90);
        const beam = O.clamp(V.nm, 380, 700), vis = V.nm >= 380 && V.nm <= 780;
        const colAt = p => vis ? S.nm(beam, 0.12 + 0.88 * Math.sqrt(Math.max(0, p))) : (C.dark ? 'rgba(235,238,250,' : 'rgba(40,50,90,') + (0.12 + 0.88 * Math.sqrt(Math.max(0, p))).toFixed(3) + ')';
        // the plate
        c.fillStyle = S.glass(0.3); c.fillRect(sx, cy - sh, sw, 2 * sh);
        c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.strokeRect(sx, cy - sh, sw, 2 * sh);
        kit.label(c, m.name.split(' (')[0] + ', ' + kit.fmt(V.d, 3) + ' mm', sx + sw / 2, cy - sh - 12, { align: 'center', color: C.muted, size: 12 });
        // the beam in, inside, out
        const p1 = 1 - r.R, p2 = p1 * r.tau, p3 = p2 * (1 - r.R);
        c.fillStyle = colAt(1); c.fillRect(20, cy - bh / 2, sx - 20, bh);
        const gr = c.createLinearGradient(sx, 0, sx + sw, 0);
        gr.addColorStop(0, colAt(p1)); gr.addColorStop(1, colAt(p2));
        c.fillStyle = gr; c.fillRect(sx, cy - bh / 2, sw, bh);
        c.fillStyle = colAt(p3); c.fillRect(sx + sw, cy - bh / 2, W - 20 - sx - sw, bh);
        // reflections at the faces
        if (r.R > 0.0005) {
          const wR = 1 + 7 * Math.sqrt(r.R);
          S.ray(c, [[sx, cy], [sx - Math.min(110, sx - 24), cy - 50]], { color: C.warn, width: wR, arrows: false, alpha: 0.9 });
          S.ray(c, [[sx + sw, cy], [sx + sw + 70, cy + 44]], { color: C.warn, width: 1 + 7 * Math.sqrt(r.R * p2), arrows: false, alpha: 0.9 });
        }
        kit.label(c, '100 %', 24, cy + bh / 2 + 14, { color: C.muted, size: 11.5 });
        kit.label(c, 'R = ' + (100 * r.R).toFixed(r.R < 0.1 ? 1 : 0) + ' %', sx - 6, cy - 54, { align: 'right', color: C.warn, size: 11.5 });
        kit.label(c, (100 * p1).toFixed(1) + ' %', sx + 2, cy + bh / 2 + 14, { color: C.muted, size: 11.5 });
        kit.label(c, (100 * p2).toFixed(1) + ' %', sx + sw - 2, cy + bh / 2 + 14, { align: 'right', color: C.muted, size: 11.5 });
        kit.label(c, 'T = ' + (100 * r.T).toFixed(1) + ' %', W - 24, cy - bh / 2 - 12, { align: 'right', color: C.text, size: 12.5, weight: 650 });
        // where the light goes
        const bx = 24, bw = W - 48, by = Hh - 52, hb = 18;
        const parts = [[r.refl, C.warn, 'reflected'], [r.abs, C.bad, 'absorbed'], [r.T, C.ok, 'transmitted']];
        let x = bx;
        for (const [f, col, name] of parts) { const w = bw * f; c.fillStyle = col; c.globalAlpha = 0.85; c.fillRect(x, by, w, hb); c.globalAlpha = 1; if (w > 70) kit.label(c, name + ' ' + (100 * f).toFixed(1) + ' %', x + w / 2, by + hb / 2, { align: 'center', color: '#101428', size: 11.5, weight: 650 }); x += w; }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, by, bw, hb);
        kit.label(c, 'where the light goes: reflected at the faces, absorbed inside, transmitted', bx, by - 10, { color: C.muted, size: 11.5 });
        // the spectrum
        const ext = [], inn = [];
        for (let i = 0; i <= 140; i++) { const nm = 100 * Math.pow(300, i / 140), q = calc(V.mat, nm, V.d, V.coat); ext.push([nm, 100 * q.T]); inn.push([nm, 100 * q.tau]); }
        plot.set({ series: [{ pts: ext, label: 'external transmittance' }, { pts: inn, label: 'internal transmittance', dash: true }], marks: [{ x: V.nm, y: 100 * r.T }], vlines: [{ x: V.nm, label: WL(V.nm) }] });
        ro.set('n', kit.fmt(r.n, 4));
        ro.set('R', (100 * r.R).toFixed(2) + ' %' + (V.coat ? ' (coated)' : ''));
        ro.set('tau', (100 * r.tau).toFixed(r.tau > 0.995 ? 2 : 1) + ' %');
        ro.set('T', (100 * r.T).toFixed(2) + ' %');
        ro.set('split', (100 * r.refl).toFixed(1) + ' % · ' + (100 * r.abs).toFixed(1) + ' %');
        ro.set('OD', r.T > 1e-12 ? kit.fmt(-Math.log10(r.T), 3) : '> 12');
        ro.set('win', WL(m.range[0]) + ' to ' + WL(m.range[1]) + ' (' + (V.nm < m.range[0] ? 'below the window' : V.nm > m.range[1] ? 'beyond the window' : 'inside it') + ')');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the band chart */
  Hyper.sim('om-band-chart', {
    title: 'Who transmits where: the windows of optical materials',
    blurb: `Each bar is the typical transmission window of a material, on a logarithmic wavelength axis from 100 nm to 30 µm. The strip at the top names the bands. Drag the vertical cursor (or use the slider): the bars that cross it are the materials that transmit there, with their index and the reflection loss of one uncoated surface.

**Try this**
- Put the cursor at 550 nm: all the glasses and plastics are in, and the fluorides and sapphire too. Move it to 200 nm: only fused silica, crystalline quartz, sapphire, the fluorides and (just) water remain.
- Move it to 10 µm, the middle of the thermal band: only germanium, zinc selenide, zinc sulfide and diamond remain. Read the reflection loss: 36 % per face for germanium.
- Choose *For the infrared*, then compare the bar of silicon (starts at 1.2 µm) with germanium (starts at 2 µm).`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360, maxH: 520 });
      const GROUPS = { all: ['fused-silica', 'N-BK7', 'N-SF11', 'PMMA', 'PC', 'water', 'sapphire', 'quartz-o', 'calcite-o', 'MgF2', 'CaF2', 'diamond', 'silicon', 'germanium', 'ZnSe', 'ZnS'],
        uv: ['fused-silica', 'sapphire', 'quartz-o', 'calcite-o', 'CaF2', 'MgF2', 'diamond', 'N-BK7', 'PMMA'],
        ir: ['N-BK7', 'fused-silica', 'sapphire', 'MgF2', 'CaF2', 'silicon', 'germanium', 'ZnSe', 'ZnS', 'diamond'],
        vis: ['N-BK7', 'N-SF11', 'fused-silica', 'PMMA', 'PC', 'CR-39', 'water'] };
      const ctl = kit.controls(box.side, [
        { id: 'group', type: 'select', label: 'Materials shown', options: [['All', 'all'], ['For the ultraviolet', 'uv'], ['For the infrared', 'ir'], ['Glasses and plastics for the visible', 'vis']], value: params.group || 'all' },
        { id: 'nm', label: 'Wavelength of the cursor', min: 100, max: 30000, value: params.nm || 550, log: true, sig: 3, fmt: WL }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['band', 'The cursor is in'], ['E', 'Photon energy'], ['pass', 'Transmit here'], ['stop', 'Absorb here']]);
      const LO = 100, HI = 30000, lg = Math.log10;
      const geom = () => { const W = st.W, x0 = 126, x1 = W - 112; return { W, x0, x1, X: nm => x0 + (lg(nm) - lg(LO)) / (lg(HI) - lg(LO)) * (x1 - x0), inv: x => Math.pow(10, lg(LO) + (x - x0) / (x1 - x0) * (lg(HI) - lg(LO))) }; };
      kit.drag(st, { hover: true, hit: p => { const g = geom(); return p.x >= g.x0 - 8 && p.x <= g.x1 + 8 ? 'cursor' : null; }, start: (t, p) => setNm(p), move: (t, p) => setNm(p) });
      const setNm = p => { const g = geom(); const v = Math.max(LO, Math.min(HI, g.inv(p.x))); ctl.set('nm', Number(v.toPrecision(3))); loop.once(); };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), Hh = st.H, ids = GROUPS[V.group];
        // the bands, as a strip
        const top = 12, sh = 20;
        const bands = O.BANDS.filter(b => ['uvc', 'uvb', 'uva', 'nir', 'swir', 'mwir', 'lwir', 'fir'].includes(b[0]));
        bands.forEach((b, i) => { const a = g.X(Math.max(LO, b[2])), z = g.X(Math.min(HI, b[3])); if (z <= a) return; c.fillStyle = i % 2 ? S.glass(0.14) : S.glass(0.28); c.fillRect(a, top, z - a, sh); if (z - a > 26) kit.label(c, b[1].split(' (')[0].replace('near infrared', 'NIR').replace('short-wave infrared', 'SWIR').replace('mid-wave infrared', 'MWIR').replace('long-wave (thermal) infrared', 'LWIR').replace('far infrared', 'far IR'), (a + z) / 2, top + sh / 2, { align: 'center', size: 10.5, color: C.text }); });
        { const a = g.X(380), z = g.X(780); for (let x = Math.floor(a); x < z; x++) { c.fillStyle = S.nm(g.inv(x)); c.fillRect(x, top, 1.5, sh); } }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(g.x0, top, g.x1 - g.x0, sh);
        // gridlines per decade
        const rows = ids.length, y0 = top + sh + 16, rh = (Hh - y0 - 34) / rows;
        c.strokeStyle = C.grid;
        for (let e = 2; e <= 4; e++) for (const k of [1, 2, 5]) { const nm = k * Math.pow(10, e); if (nm > HI || nm < LO) continue; const x = Math.round(g.X(nm)) + 0.5; c.beginPath(); c.moveTo(x, y0 - 6); c.lineTo(x, Hh - 30); c.stroke(); kit.label(c, WL(nm), x, Hh - 20, { align: 'center', size: 10.5, color: C.muted }); }
        const nmC = V.nm, xc = g.X(nmC), pass = [], stop = [];
        ids.forEach((id, i) => {
          const m = O.MATERIALS[id], y = y0 + i * rh + rh / 2, lo = m.range[0], hi = Math.min(m.range[1], HI), inside = nmC >= lo && nmC <= m.range[1];
          const bh = Math.min(rh * 0.62, 18), a = g.X(Math.max(LO, lo)), z = g.X(hi);
          c.globalAlpha = inside ? 0.95 : 0.4; c.fillStyle = KINDCOL(C, m.kind); c.fillRect(a, y - bh / 2, Math.max(2, z - a), bh); c.globalAlpha = 1;
          kit.label(c, m.name.split(' (')[0].replace(' (infrared)', ''), 8, y, { size: 11.5, color: inside ? C.text : C.muted, weight: inside ? 650 : 500 });
          const txt = lo <= LO ? 'below ' + WL(m.range[1]) : WL(lo) + ' – ' + (m.range[1] > HI ? 'far IR' : WL(m.range[1]));
          if (z - a > 96) kit.label(c, txt, (a + z) / 2, y, { align: 'center', size: 10.5, color: '#101428', weight: 600 });
          if (inside) {
            const n = O.index(id, nmC);
            kit.label(c, 'n ' + n.toFixed(2) + ' · R ' + (100 * O.normalR(1, n)).toFixed(1) + ' %', g.x1 + 8, y, { size: 11, color: C.text });
            pass.push(m.name.split(' (')[0]);
          } else stop.push(m.name.split(' (')[0]);
        });
        c.strokeStyle = C.text; c.lineWidth = 1.8; c.beginPath(); c.moveTo(xc, top - 2); c.lineTo(xc, Hh - 30); c.stroke();
        kit.label(c, WL(nmC), xc, Hh - 8, { align: 'center', size: 12, weight: 650, color: C.text });
        kit.label(c, 'one uncoated face', g.x1 + 8, y0 - 8, { size: 10.5, color: C.faint });
        ro.set('band', O.colourName(nmC));
        ro.set('E', O.photonEnergy(nmC).toFixed(O.photonEnergy(nmC) < 0.1 ? 3 : 2) + ' eV');
        ro.set('pass', pass.length ? pass.join(', ') : 'none of these');
        ro.set('stop', stop.length ? stop.join(', ') : 'none of these');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ the properties of the materials */
  Hyper.sim('om-properties', {
    title: 'Material properties side by side',
    blurb: `Every material of the table as a bar, for the property you choose. Plastics, glasses, crystals and infrared materials are told apart by colour, and the dashed line marks N-BK7 for comparison. Properties without a published value in the table are simply left out.

**Try this**
- Choose *density*: plastics are at half the weight of glass. Choose *thermal expansion* and *dn/dT*: the plastics are off the scale of the glasses, and dn/dT is *negative* for them.
- Choose *thermal power coefficient γ*: the combination (dn/dT)/(n − 1) − α that tells how fast the focus moves with temperature. Fused silica and germanium move one way, plastics and the fluorides the other, N-BK7 hardly at all.
- Choose *Fresnel loss*: germanium and silicon lose a third per face.
- Choose the group *crystals* and *Abbe number*: calcium and magnesium fluoride have the lowest dispersion of all.`,
    mount(box, kit, params) {
      const O = kit.optics;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      const PROPS = {
        nd: { label: 'Refractive index n_d', get: (m, a) => a.nd, fmt: v => v.toFixed(3), base: 1 },
        vd: { label: 'Abbe number V_d', get: (m, a) => Number.isFinite(a.vd) && a.vd < 150 ? a.vd : undefined, fmt: v => v.toFixed(1), base: 0 },
        rho: { label: 'Density (g/cm³)', get: m => m.density, fmt: v => v.toFixed(2), base: 0 },
        cte: { label: 'Thermal expansion α (10⁻⁶/K)', get: m => m.cte, fmt: v => v.toFixed(1), base: 0 },
        dndt: { label: 'dn/dT (10⁻⁶/K)', get: m => m.dndt, fmt: v => v.toFixed(1), base: 0 },
        gam: { label: 'Thermal power coefficient γ (10⁻⁶/K)', get: (m, a) => m.dndt != null && m.cte != null ? m.dndt / (a.nd - 1) - m.cte : undefined, fmt: v => v.toFixed(1), base: 0 },
        R: { label: 'Fresnel loss per face (%)', get: (m, a) => 100 * O.normalR(1, a.nd), fmt: v => v.toFixed(1), base: 0 }
      };
      const GROUPS = [['All materials', 'all'], ['Glasses', 'glass'], ['Plastics', 'plastic'], ['Crystals', 'crystal'], ['Infrared materials', 'ir']];
      const ctl = kit.controls(box.side, [
        { id: 'prop', type: 'select', label: 'Property', options: Object.keys(PROPS).map(k => [PROPS[k].label, k]), value: params.prop || 'dndt' },
        { id: 'group', type: 'select', label: 'Group', options: GROUPS, value: params.group || 'all' },
        { id: 'sort', type: 'check', label: 'Sort by value', value: params.sort !== false }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Materials shown'], ['hi', 'Largest'], ['lo', 'Smallest'], ['ref', 'N-BK7 for comparison']]);
      const ALL = Object.values(O.MATERIALS).filter(m => ['glass', 'crystal', 'plastic', 'ir', 'liquid'].includes(m.kind)).map(m => ({ m, a: O.abbe(m.id) }));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, P = PROPS[V.prop];
        let rows = ALL.filter(e => V.group === 'all' || e.m.kind === V.group).map(e => ({ id: e.m.id, name: e.m.name.split(' (')[0].replace(' (infrared)', ''), kind: e.m.kind, v: P.get(e.m, e.a) })).filter(r => r.v != null && Number.isFinite(r.v));
        if (V.sort) rows.sort((p, q) => q.v - p.v);
        const ref = ALL.find(e => e.m.id === 'N-BK7'), refV = P.get(ref.m, ref.a);
        const x0 = 150, x1 = W - 66, top = 30, bot = Hh - 12, rh = (bot - top) / Math.max(1, rows.length), bh = Math.min(rh * 0.7, 20);
        let lo = Math.min(P.base, ...rows.map(r => r.v), refV), hi = Math.max(P.base, ...rows.map(r => r.v), refV);
        if (hi - lo < 1e-9) hi = lo + 1;
        const pad = (hi - lo) * 0.04; if (lo < P.base) lo -= pad; hi += pad;
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0), xb = X(P.base);
        kit.label(c, P.label, 10, 14, { weight: 650, size: 12.5, color: C.text });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(xb, top - 4); c.lineTo(xb, bot); c.stroke();
        const fs = Math.max(9.5, Math.min(12, rh * 0.8));
        rows.forEach((r, i) => {
          const y = top + i * rh + rh / 2, xv = X(r.v);
          c.fillStyle = KINDCOL(C, r.kind); c.globalAlpha = 0.9; c.fillRect(Math.min(xb, xv), y - bh / 2, Math.max(1.5, Math.abs(xv - xb)), bh); c.globalAlpha = 1;
          kit.label(c, r.name, x0 - 8, y, { align: 'right', size: fs, color: C.text });
          const inside = xv + 54 < W; kit.label(c, P.fmt(r.v), r.v >= P.base ? Math.min(xv + 5, W - 58) : Math.max(xv - 5, x0 + 4), y, { align: r.v >= P.base ? 'left' : 'right', size: fs, color: C.muted });
        });
        if (Number.isFinite(refV)) { c.save(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(refV), top - 4); c.lineTo(X(refV), bot); c.stroke(); c.restore(); kit.label(c, 'N-BK7', X(refV), top - 12, { align: 'center', size: 11, color: C.text }); }
        let lx = x0;
        for (const [k, t] of [['glass', 'glasses'], ['crystal', 'crystals'], ['plastic', 'plastics'], ['ir', 'infrared materials'], ['liquid', 'water']]) { c.fillStyle = KINDCOL(C, k); c.fillRect(lx, Hh - 8, 9, 5); kit.label(c, t, lx + 13, Hh - 5, { size: 10.5, color: C.muted }); lx += 28 + t.length * 6; }
        const top1 = rows.length ? rows.reduce((p, q) => q.v > p.v ? q : p) : null, bot1 = rows.length ? rows.reduce((p, q) => q.v < p.v ? q : p) : null;
        ro.set('n', rows.length + ' of ' + ALL.filter(e => V.group === 'all' || e.m.kind === V.group).length);
        ro.set('hi', top1 ? top1.name + '  ' + P.fmt(top1.v) : '—');
        ro.set('lo', bot1 ? bot1.name + '  ' + P.fmt(bot1.v) : '—');
        ro.set('ref', Number.isFinite(refV) ? P.fmt(refV) : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ heat and focus */
  Hyper.sim('om-thermal', {
    title: 'Heat and focus: a lens in its barrel',
    blurb: `A singlet focused on a distant object at 20 °C, then warmed or cooled. The lens expands, its index changes with dn/dT and the barrel grows, moving the sensor. The ruler magnifies the focus: the triangle is where the image forms, the line is the sensor, and the green band is the depth of focus ±2λN². The graph gives the focus error across the temperature range. The lens is traced by the ray-tracing engine at each temperature.

**Try this**
- N-BK7 in an *aluminium* barrel, ΔT = +40 K, f/4: the sensor ends up 76 µm beyond the image, four times the green band. Change the barrel to *titanium*, then *invar*.
- Choose the *ideal athermal housing*: its expansion is −γ and the focus stays on the sensor at every temperature.
- Choose *acrylic* in a plastic barrel: the focus moves by almost a millimetre, fifty times the band. Open the aperture and the band narrows further.
- *Fused silica* has a positive γ: its focus moves the other way.
- *Germanium* at 10 µm has the largest γ of all.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym, Sy = O.sys;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const gb = document.createElement('div'); gb.style.padding = '6px 10px 10px'; box.stage.appendChild(gb);
      const MATS = [['N-BK7 glass', 'N-BK7'], ['N-FK51A fluor crown', 'N-FK51A'], ['Fused silica', 'fused-silica'], ['Calcium fluoride', 'CaF2'], ['Acrylic (PMMA)', 'PMMA'], ['Polycarbonate', 'PC'], ['Cyclo-olefin polymer', 'COP'], ['Silicon (4 µm)', 'silicon'], ['Germanium (10 µm)', 'germanium']];
      const LAM = { silicon: 4000, germanium: 10000 };
      const HOUS = [['Aluminium, 23 ppm/K', 23], ['Brass, 19 ppm/K', 19], ['Steel, 12 ppm/K', 12], ['Titanium, 8.6 ppm/K', 8.6], ['Invar, 1.3 ppm/K', 1.3], ['Plastic (polycarbonate), 67 ppm/K', 67], ['Ideal athermal housing (α_h = −γ)', 'ideal']];
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Lens material', options: MATS, value: params.mat || 'N-BK7' },
        { id: 'hous', type: 'select', label: 'Barrel and spacer', options: HOUS, value: params.hous != null ? params.hous : 23 },
        { id: 'f', label: 'Focal length', min: 10, max: 200, step: 1, value: params.f || 100, unit: 'mm' },
        { id: 'N', label: 'f-number', min: 1.4, max: 16, value: params.N || 4, log: true, sig: 2, fmt: v => 'f/' + kit.fmt(v, 2) },
        { id: 'dT', label: 'Temperature change from 20 °C', min: -40, max: 80, step: 1, value: params.dT != null ? params.dT : 40, unit: 'K' }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gam', 'Thermal power coefficient γ'], ['f', 'Focal length now'], ['dz', 'Sensor beyond the image by'], ['dof', 'Depth of focus'], ['blur', 'Blur circle on the sensor'], ['need', 'Barrel that would cure it'], ['verdict', 'Verdict']]);
      const plot = kit.plot(gb, { x: { label: 'temperature change (K)', min: -40, max: 80 }, y: { label: 'sensor beyond image (µm)' } }, 200);
      let key = '', base = null, par0 = null;
      const getBase = () => {
        const k = V.mat + '|' + V.f + '|' + V.N;
        if (k !== key) { key = k; base = O.design.singlet({ f: V.f, glass: V.mat, q: 0, D: V.f / V.N }); par0 = Sy.paraxial(base); }
      };
      const at = dT => {
        getBase();
        const m = O.MATERIALS[V.mat], sc = Sy.scale(base, 1 + m.cte * 1e-6 * dT);
        sc.surfaces[0].n = O.index(V.mat, 587.56) + m.dndt * 1e-6 * dT;
        return sc;
      };
      const gammaOf = () => { const m = O.MATERIALS[V.mat], n = O.index(V.mat, 587.56); return m.dndt / (n - 1) - m.cte; };
      const alphaH = () => V.hous === 'ideal' ? -gammaOf() : V.hous;
      const dzMm = dT => { const p = Sy.paraxial(at(dT)); return par0.zImage * (1 + alphaH() * 1e-6 * dT) - p.zImage; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        getBase();
        const lam = LAM[V.mat] || 550, dof = 2 * lam * 1e-3 * V.N * V.N;               // µm
        const sc = at(V.dT), p = Sy.paraxial(sc), L0 = par0.zImage, sensorZ = L0 * (1 + alphaH() * 1e-6 * V.dT);
        const dz = (sensorZ - p.zImage) * 1000;                                           // µm
        // the lens in its barrel
        const D = V.f / V.N, yh = Math.max(D * 0.65, L0 * 0.1);
        const top = 14, picH = Hh * 0.52, m = S.map({ W, H: picH + top }, -0.1 * L0, 1.1 * L0, yh, { left: 24, right: 30, top, bottom: 8, stretch: 3 });
        const wall = Math.max(D / 2 * 1.35, L0 * 0.07);
        c.fillStyle = C.dark ? '#2b3252' : '#cfd5e6';
        for (const sg of [-1, 1]) c.fillRect(m.X(-0.04 * L0), m.Y(sg * wall) - (sg > 0 ? 0 : 5), m.X(sensorZ) - m.X(-0.04 * L0), 5);
        S.axis(c, m.X(-0.1 * L0), m.y0, m.X(1.1 * L0));
        S.system(c, sc, m);
        S.rays(c, Sy.fan2d(sc, { nm: 587.56, n: 5, zEnd: sensorZ, zStart: -0.09 * L0 }), m, { nm: LAM[V.mat] ? 620 : 587.56 });
        S.sensor(c, m.X(sensorZ), m.y0, Math.min(m.sy * D * 0.35, 28), { pixels: 8 });
        kit.label(c, V.mat + ' lens, f = ' + V.f + ' mm, ' + (V.dT >= 0 ? '+' : '−') + Math.abs(V.dT) + ' K', 26, 12, { color: C.muted, size: 12 });
        // the magnified focus ruler
        const R = Math.max(3 * dof, 1.3 * Math.abs(dz), 10), xc = W / 2, half = W / 2 - 70, yr = Hh * 0.78;
        const X = u => xc + u / R * half;
        c.fillStyle = C.ok; c.globalAlpha = 0.25; c.fillRect(X(-dof), yr - 22, X(dof) - X(-dof), 44); c.globalAlpha = 1;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(-R), yr); c.lineTo(X(R), yr); c.stroke();
        const step = Hyper.niceStep(2 * R, 8);
        for (let u = Math.ceil(-R / step) * step; u <= R + 1e-9; u += step) { const x = X(u); c.beginPath(); c.moveTo(x, yr - 4); c.lineTo(x, yr + 4); c.stroke(); kit.label(c, kit.fmt(Math.abs(u) < step * 1e-6 ? 0 : u, 3), x, yr + 16, { align: 'center', size: 10.5, color: C.muted }); }
        kit.label(c, 'focus ruler, µm along the axis (the picture above is not to this scale)', xc, yr + 34, { align: 'center', size: 11, color: C.faint });
        c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(xc, yr - 28); c.lineTo(xc, yr + 28); c.stroke();
        kit.label(c, 'sensor', xc, yr - 36, { align: 'center', size: 12, weight: 650, color: C.text });
        const xi = X(-dz);
        c.fillStyle = C.accent; c.beginPath(); c.moveTo(xi, yr - 2); c.lineTo(xi - 7, yr - 17); c.lineTo(xi + 7, yr - 17); c.closePath(); c.fill();
        if (Math.abs(dz) > 0.02 * R) kit.label(c, 'image', xi, yr - 28, { align: 'center', size: 12, weight: 650, color: C.accent });
        kit.label(c, 'depth of focus ±' + kit.fmt(dof, 3) + ' µm', X(dof), yr + 30 + 22, { align: 'left', size: 11, color: C.ok });
        // the focus error across temperature
        const pts = []; let big = dof;
        for (let T = -40; T <= 80; T += 5) { const v = dzMm(T) * 1000; pts.push([T, v]); big = Math.max(big, Math.abs(v)); }
        plot.set({ x: { label: 'temperature change from 20 °C (K)', min: -40, max: 80 }, y: { label: 'sensor beyond image (µm)', min: -1.15 * big, max: 1.15 * big }, series: [{ pts, label: 'focus error' }], hlines: [{ y: dof, label: '+ depth of focus', color: C.ok }, { y: -dof, color: C.ok }], marks: [{ x: V.dT, y: dz }] });
        const g = gammaOf(), ok = Math.abs(dz) <= dof;
        ro.set('gam', kit.fmt(g, 3) + ' ppm/K');
        ro.set('f', kit.fmt(p.efl, 5) + ' mm  (' + (p.efl >= par0.efl ? '+' : '−') + Math.abs(100 * (p.efl / par0.efl - 1)).toFixed(3) + ' %)');
        ro.set('dz', (dz >= 0 ? '+' : '−') + Math.abs(dz).toFixed(Math.abs(dz) < 100 ? 1 : 0) + ' µm' + (Math.abs(dz) > 1000 ? '  (' + (Math.abs(dz) / 1000).toFixed(2) + ' mm)' : ''));
        ro.set('dof', '± ' + kit.fmt(dof, 3) + ' µm  (2λN² at ' + WL(lam) + ')');
        ro.set('blur', kit.fmt(Math.abs(dz) / V.N, 3) + ' µm  (geometric, Δz / N)');
        ro.set('need', 'expansion ' + kit.fmt(-g, 3) + ' ppm/K  (now ' + kit.fmt(alphaH(), 3) + ')');
        ro.set('verdict', ok ? 'in focus: within the depth of focus' : 'out of focus by ' + kit.fmt(Math.abs(dz) / dof, 2) + ' times the depth of focus');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ interferograms */
  Hyper.sim('om-fringes', {
    title: 'Interferograms: the flatness of a surface, the homogeneity of a blank',
    blurb: `An interferometer turns small path errors into fringes. Opened from the flatness page the picture is a **surface** against a reference flat: one fringe is half a wavelength of height (the light crosses the gap twice). Opened from the glass-quality page it is a **glass blank** in transmission: one fringe is one wavelength of path, which is the index variation times the thickness. The graph beside the picture is the height, or the path, along the horizontal diameter with the tilt removed.

**Try this**
- *Surface*: one fringe of power is a ring pattern; a surface flat to λ/4 shows only half a fringe of error in all. Add irregularity and see which shapes the fringes follow.
- *Surface*: add tilt. The fringes become straight lines and the shape shows as their bending; the readout of power and irregularity is unchanged because tilt is not a flatness error.
- *Blank*: the preset buttons set the classes of homogeneity at 50 mm and watch the fringes of 632.8 nm light; a class 3 blank gives about a third of a fringe.
- *Blank*: raise the thickness or the index variation, and switch on striae: thin lines that no eye could see in the glass.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const mode = params.mode === 'blank' ? 'blank' : 'surface';
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 310 });
      const defs = [
        { id: 'nm', type: 'select', label: 'Wavelength of the test', options: [['Helium–neon laser, 632.8 nm', 632.8], ['Green laser, 532 nm', 532], ['Violet laser, 405 nm', 405]], value: 632.8 },
        { id: 'tilt', label: 'Tilt: fringes across the aperture', min: 0, max: 10, step: 0.1, value: params.tilt != null ? params.tilt : 0 }
      ];
      const CLASSES = [['c1', 'Class 1', 20], ['c2', 'Class 2', 5], ['c3', 'Class 3', 2], ['c4', 'Class 4', 1], ['c5', 'Class 5', 0.5]];
      if (mode === 'surface') defs.push(
        { id: 'pow', label: 'Power (rings from edge to centre)', min: 0, max: 6, step: 0.05, value: params.pow != null ? params.pow : 1, unit: 'fringes' },
        { id: 'irr', label: 'Irregularity, peak to valley', min: 0, max: 2, step: 0.05, value: params.irr != null ? params.irr : 0.5, unit: 'fringes' },
        { id: 'shape', type: 'select', label: 'Shape of the irregularity', options: [['Astigmatism (a saddle)', 'ast'], ['A hill', 'hill'], ['Turned-down edge', 'edge'], ['Ripple', 'ripple']], value: params.shape || 'ast' });
      else defs.push(
        { id: 'dn', label: 'Index variation, peak to valley', min: 0.2, max: 60, value: params.dn || 4, unit: 'ppm', log: true, sig: 2 },
        { id: 't', label: 'Thickness of the blank', min: 5, max: 250, value: params.t || 50, unit: 'mm', log: true, sig: 3 },
        { id: 'str', label: 'Striae', min: 0, max: 1, step: 0.05, value: params.str || 0 },
        { type: 'buttons', items: CLASSES.map(c => ({ id: c[0], label: c[1] + ' (±' + c[2] + ' ppm)' })) });
      const ctl = kit.controls(box.side, defs, id => {
        const cl = CLASSES.find(c => c[0] === id);
        if (cl) ctl.set('dn', 2 * cl[2]);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, mode === 'surface'
        ? [['pv', 'Peak to valley of the surface'], ['wave', 'In waves · in nanometres'], ['grade', 'Flatness grade'], ['rms', 'RMS of the surface'], ['wf', 'Wavefront error it causes']]
        : [['opd', 'Peak-to-valley path difference'], ['wave', 'In waves of the test wavelength'], ['cls', 'Homogeneity class of that variation'], ['use', 'Good enough for']]);
      // the irregular shapes, each scaled so that its peak-to-valley height over the aperture is 1
      const SHAPES = {
        ast: (x, y) => x * x - y * y,
        hill: (x, y) => Math.exp(-((x - 0.2) * (x - 0.2) + (y + 0.1) * (y + 0.1)) / 0.12),
        edge: (x, y) => { const r = Math.hypot(x, y), e = Math.max(0, r - 0.7) / 0.3; return -e * e * (3 - 2 * e); },
        ripple: (x, y) => Math.cos(2 * Math.PI * 1.7 * Math.hypot(x, y)),
        blank: (x, y) => 0.6 * x * y + 0.5 * (x * x + y * y - 0.5) + 0.25 * Math.sin(2.2 * x + 1.1) * Math.cos(1.7 * y)
      };
      const NORM = {};
      const norm = k => {
        if (NORM[k]) return NORM[k];
        let lo = 1e9, hi = -1e9;
        for (let j = 0; j < 41; j++) for (let i = 0; i < 41; i++) { const x = i / 20 - 1, y = j / 20 - 1; if (x * x + y * y > 1) continue; const v = SHAPES[k](x, y); lo = Math.min(lo, v); hi = Math.max(hi, v); }
        return (NORM[k] = { lo, span: Math.max(1e-9, hi - lo) });
      };
      const h01 = (k, x, y) => { const n = norm(k); return (SHAPES[k](x, y) - n.lo) / n.span; };
      const STRIAE = [[0.35, -0.55, 0.035, 1], [0.35, 0.12, 0.02, -0.7], [0.35, 0.5, 0.03, 0.9], [1.2, -0.2, 0.025, 0.6], [2.9, 0.1, 0.03, -0.8]];
      const striae = (x, y) => { let s = 0; for (const [th, cc, w, a] of STRIAE) { const d = x * Math.sin(th) - y * Math.cos(th) - cc; s += a * Math.exp(-(d * d) / (w * w)); } return s; };
      // the field in fringes (surface) or waves (blank), tilt not included
      const field = (x, y) => {
        if (mode === 'surface') return V.pow * (x * x + y * y) + V.irr * h01(V.shape, x, y);
        const opd = V.dn * V.t, lam = V.nm;                                                 // nm
        return opd / lam * (h01('blank', x, y) + V.str * 0.3 * striae(x, y));
      };
      const stats = () => {
        let lo = 1e9, hi = -1e9, s = 0, s2 = 0, n = 0;
        for (let j = 0; j < 41; j++) for (let i = 0; i < 41; i++) { const x = i / 20 - 1, y = j / 20 - 1; if (x * x + y * y > 1) continue; const v = field(x, y); lo = Math.min(lo, v); hi = Math.max(hi, v); s += v; s2 += v * v; n++; }
        return { pv: hi - lo, rms: Math.sqrt(Math.max(0, s2 / n - (s / n) * (s / n))), mean: s / n };
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, lam = V.nm;
        const d = Math.min(Hh - 50, W * 0.44), cx = 20 + d / 2, cy = 14 + d / 2, N = 64;
        S.cells(c, cx - d / 2, cy - d / 2, d, d, N, N, (u, v) => {
          const x = 2 * u - 1, y = 2 * v - 1;
          if (x * x + y * y > 1) return 0;
          const ph = field(x, y) + V.tilt * x / 2;
          return 0.5 * (1 + Math.cos(2 * Math.PI * ph));
        }, { nm: lam, gamma: 0.9 });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, d / 2, 0, 2 * Math.PI); c.stroke();
        kit.label(c, mode === 'surface' ? 'fringes against a reference flat' : 'fringes through the blank', cx, cy + d / 2 + 14, { align: 'center', color: C.muted, size: 12 });
        // the profile along the horizontal diameter, tilt removed
        const st0 = stats(), unit = mode === 'surface' ? lam / 2 : lam;                      // nm per fringe
        const px = cx + d / 2 + 52, pw = W - px - 22, py = 34, ph = Hh - 98;
        const prof = [], N2 = 80; let lo = 1e9, hi = -1e9;
        for (let i = 0; i <= N2; i++) { const x = -1 + 2 * i / N2, v = field(x, 0) * unit; prof.push([x, v]); lo = Math.min(lo, v); hi = Math.max(hi, v); }
        const mid = (lo + hi) / 2, R = Math.max(hi - lo, unit) * 0.75;
        const X = x => px + (x + 1) / 2 * pw, Y = v => py + ph / 2 - (v - mid) / R * (ph / 2);
        c.fillStyle = C.surface; c.fillRect(px, py, pw, ph); c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(px, py, pw, ph);
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(px, Y(mid)); c.lineTo(px + pw, Y(mid)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath(); prof.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
        kit.label(c, mode === 'surface' ? 'surface height along a diameter (nm)' : 'optical path along a diameter (nm)', px, py - 12, { color: C.muted, size: 11.5 });
        // the scale of one fringe
        const sx = px + pw - 14, y1 = Y(mid + unit / 2), y2 = Y(mid - unit / 2);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(sx, y1); c.lineTo(sx, y2); c.moveTo(sx - 4, y1); c.lineTo(sx + 4, y1); c.moveTo(sx - 4, y2); c.lineTo(sx + 4, y2); c.stroke();
        kit.label(c, '1 fringe = ' + kit.fmt(unit, 4) + ' nm', sx - 8, Y(mid - unit / 2) + 12, { align: 'right', color: C.warn, size: 11.5 });
        kit.label(c, 'peak to valley along this line: ' + kit.fmt(hi - lo, 3) + ' nm', px, py + ph + 14, { color: C.muted, size: 11.5 });
        if (mode === 'surface') {
          const pvW = st0.pv / 2, wf = Math.abs(2 * pvW);
          const grade = pvW <= 1 / 20 + 1e-9 ? 'λ/20 or better' : pvW <= 1 / 10 + 1e-9 ? 'λ/10' : pvW <= 1 / 4 + 1e-9 ? 'λ/4' : pvW <= 1 / 2 + 1e-9 ? 'λ/2' : 'worse than λ/2';
          ro.set('pv', kit.fmt(st0.pv, 3) + ' fringes');
          ro.set('wave', kit.fmt(pvW, 3) + ' wave · ' + kit.fmt(pvW * lam, 3) + ' nm');
          ro.set('grade', grade + ' (waves of ' + kit.fmt(lam, 4) + ' nm)');
          ro.set('rms', kit.fmt(st0.rms * lam / 2, 3) + ' nm  (λ/' + (st0.rms > 1e-9 ? kit.fmt(lam / (st0.rms * lam / 2), 3) : '∞') + ')');
          ro.set('wf', 'mirror ' + kit.fmt(wf, 3) + ' wave · glass surface (n − 1) × ' + kit.fmt(pvW, 3) + ' = ' + kit.fmt(0.52 * pvW, 3) + ' wave');
        } else {
          const w = st0.pv, tol = V.dn / 2;
          const cls = tol <= 0.5 ? 'class 5 or better' : tol <= 1 ? 'class 4' : tol <= 2 ? 'class 3' : tol <= 5 ? 'class 2' : tol <= 20 ? 'class 1' : 'worse than class 1';
          ro.set('opd', kit.fmt(w * lam, 3) + ' nm  (index variation ' + kit.fmt(V.dn, 3) + ' ppm × ' + kit.fmt(V.t, 3) + ' mm' + (V.str > 0 ? ', plus striae' : '') + ')');
          ro.set('wave', kit.fmt(w, 3) + ' wave  ≈ λ/' + (w > 1e-9 ? kit.fmt(1 / w, 3) : '∞'));
          ro.set('cls', cls + ' (±' + kit.fmt(tol, 2) + ' ppm)');
          ro.set('use', w <= 0.1 ? 'interferometer optics (below λ/10)' : w <= 0.25 ? 'precision optics (below λ/4)' : w <= 1 ? 'ordinary imaging optics' : 'not for imaging at this thickness');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ an optical drawing */
  Hyper.sim('om-drawing', {
    title: 'Reading an optical drawing: a plano-convex lens',
    blurb: `The drawing of a plano-convex lens of focal length 100 mm, with a numbered call-out for every kind of indication that an optical drawing carries. **Click a number** (or choose it in the list) to read what the indication states, how to read it, a typical value and why it matters. The radius and the thicknesses are computed from the lens itself; the tolerance values are typical of a precision grade and are described in plain words, not copied from the standard.

**Try this**
- Click **3**, the radius: 51.7 mm follows from R = (n − 1) f. Then **4**: the edge is thinner than the centre by the sag of the curved face.
- Click **5** (form) and **6** (centring): two different errors of shape, one of the surface itself and one of how the axis sits in the glass.
- Click **8**, the clear aperture, and **7**, the surface imperfections: both belong to the front view, and the defects only count inside the circle.
- Click **10**, the chamfer, and **2**, the diameter: why the tolerance is +0/−0.1.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 350 });
      const sys = O.design.singlet({ f: 100, glass: 'N-BK7', q: 1, D: 25.4, t: 4.5 });
      const R = sys.surfaces[0].R, D = 25.4, CT = 4.5, sag = R - Math.sqrt(R * R - (D / 2) * (D / 2)), nd = O.index('N-BK7', 587.56);
      const ITEMS = [
        { id: 1, title: 'Material', says: 'The glass, and the grades its index, homogeneity, stress, bubbles and striae must meet.', reads: 'N-BK7 with n_d = ' + nd.toFixed(4) + ' ± 0.0005, and a class for each of homogeneity, stress birefringence and bubbles.', typ: 'homogeneity class 3, stress no more than 10 nm/cm', why: 'Sets the focal length, the colour correction and the quality of the wavefront.' },
        { id: 2, title: 'Diameter', says: 'The outside diameter and its tolerance.', reads: '25.4 mm, +0/−0.1: never larger, because the lens must go into a 25.4 mm holder.', typ: '+0/−0.1 mm commercial; +0/−0.025 precision', why: 'Fit in the mount and the clear aperture follow from it.' },
        { id: 3, title: 'Radius of the curved face', says: 'The radius of curvature, with its sign, and how closely it must be held.', reads: 'R = ' + R.toFixed(1) + ' mm = (n − 1) f. Positive: the centre of curvature is on the side the light goes to.', typ: '±0.5 % to ±2 %, or a number of fringes against a test plate', why: 'The radius sets the focal length: 1 % in R is 1 % in f.' },
        { id: 4, title: 'Centre thickness', says: 'The thickness on the axis and its tolerance.', reads: '4.5 ± 0.1 mm. The edge is ' + (CT - sag).toFixed(1) + ' mm thick, thinner by the sag of ' + sag.toFixed(2) + ' mm.', typ: '±0.1 mm commercial; ±0.01 mm high precision', why: 'Changes the back focal length and the spacing in a cemented or multi-lens system.' },
        { id: 5, title: 'Surface form', says: 'How closely the surface follows its ideal shape: power and irregularity, in fringes, at a stated wavelength.', reads: 'For example 2 fringes of power and ½ fringe of irregularity at 632.8 nm. One fringe is half a wavelength of height.', typ: 'power 3 to 5, irregularity ½ to 1 fringe commercial; under 1 and ¼ precision', why: 'Departures from the ideal shape appear as wavefront error in the image.' },
        { id: 6, title: 'Centring', says: 'How well the optical axis coincides with the mechanical axis of the cylinder.', reads: 'Given as a tilt of the optical axis (beam deviation) in arcminutes, or an offset in millimetres: for example up to 3′.', typ: '3 to 5′ commercial; 1 to 3′ precision; under 1′ high precision', why: 'A decentred lens steers the beam and shifts the image, and adds coma when mounted in a system.' },
        { id: 7, title: 'Surface imperfections', says: 'The scratches, pits and chips allowed inside the clear aperture.', reads: 'Scratch-dig 60-40: a scratch matching reference 60 and no dig larger than 0.4 mm. The ISO form states a count and a size grade instead.', typ: '80-50 commercial; 60-40 standard; 20-10 laser', why: 'Defects scatter light and, in lasers, absorb it and start damage.' },
        { id: 8, title: 'Clear aperture', says: 'The diameter inside which the optical specifications hold.', reads: 'At least 90 % of the diameter: ' + (0.9 * D).toFixed(1) + ' mm. The rim outside it may hold chamfer and small chips.', typ: '90 % of the diameter for standard lenses', why: 'Defines where the form, imperfection and coating specifications are checked.' },
        { id: 9, title: 'Coating', says: 'The coating on each face: its type, band, angle of incidence and residual reflectance.', reads: 'Anti-reflection, 400 to 700 nm, under 0.5 % per face at 0° angle of incidence.', typ: 'broadband AR 400–700 nm, or a V-coat for a laser line', why: 'Uncoated glass loses 4 % per face; a coating raises the transmission of each face to 99.5 %.' },
        { id: 10, title: 'Protective chamfer', says: 'A small flat on the edge that prevents chipping.', reads: 'A face width of 0.3 mm at most, at 45°, outside the clear aperture.', typ: '0.2 to 0.5 mm at 45°', why: 'A sharp edge chips in handling and in the mount; the chips would spread inwards.' }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'item', type: 'select', label: 'Call-out', options: ITEMS.map(i => [i.id + ' · ' + i.title, i.id]), value: params.item || 3 }
      ], () => loop.once());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['title', 'Indication'], ['says', 'What it states'], ['reads', 'How to read it'], ['typ', 'Typical values'], ['why', 'Why it matters']]);
      let hot = [];
      const find = p => hot.find(h => Math.hypot(h.x - p.x, h.y - p.y) < 15);
      kit.click(st, p => { const h = find(p); if (h) { ctl.set('item', h.id); loop.once(); } }, p => !!find(p));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const h = Math.min(Hh * 0.27, 100, W * 0.16), sc = h / (D / 2), yc = Hh * 0.46, x0 = Math.max(92, W * 0.2), tp = CT * sc, Rp = R * sc;
        const surfX = yy => x0 + (Rp - Math.sqrt(Math.max(0, Rp * Rp - yy * yy)));            // the curved face at height yy above the axis
        hot = [];
        S.axis(c, x0 - 70, yc, x0 + tp + 120);
        S.lens(c, x0, yc, h, { R1: Rp, R2: 0, t: tp });
        kit.label(c, 'section, light from the left', x0 + tp / 2, yc + h + 66, { align: 'center', color: C.faint, size: 11.5 });
        S.ray(c, [[x0 - 70, yc - h * 0.4], [x0 - 18, yc - h * 0.4]], { color: C.warn, width: 1.6, minArrow: 20 });
        // dimensions
        S.dim(c, x0 + tp + 52, yc - h, x0 + tp + 52, yc + h, 'Ø 25.4 +0/−0.1', { off: -14 });
        S.dim(c, x0, yc + h + 26, x0 + tp, yc + h + 26, '4.5 ± 0.1', { off: 14 });
        c.save(); c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x0 + tp, yc - h); c.lineTo(x0 + tp + 56, yc - h); c.moveTo(x0 + tp, yc + h); c.lineTo(x0 + tp + 56, yc + h); c.moveTo(x0, yc + h); c.lineTo(x0, yc + h + 30); c.moveTo(x0 + tp, yc + h); c.lineTo(x0 + tp, yc + h + 30); c.stroke(); c.restore();
        // the clear aperture, in section
        const ca = 0.9 * h;
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + tp + 3, yc - ca); c.lineTo(x0 + tp + 3, yc + ca); c.stroke();
        // chamfer marks at the rim
        c.strokeStyle = C.text; c.lineWidth = 1.4; for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(x0 + tp - 4, yc + sg * h); c.lineTo(x0 + tp, yc + sg * (h - 4)); c.stroke(); }
        // the front view
        const rf = Math.min(Hh * 0.25, W * 0.15), cf = [Math.min(W - rf - 70, x0 + tp + 190 + rf), yc];
        c.fillStyle = S.glass(0.2); c.beginPath(); c.arc(cf[0], cf[1], rf, 0, 2 * Math.PI); c.fill(); c.strokeStyle = S.edge(); c.lineWidth = 1.3; c.stroke();
        c.strokeStyle = C.ok; c.lineWidth = 1.6; c.setLineDash([5, 4]); c.beginPath(); c.arc(cf[0], cf[1], 0.9 * rf, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(cf[0] - 0.55 * rf, cf[1] + 0.38 * rf); c.lineTo(cf[0] + 0.3 * rf, cf[1] - 0.1 * rf); c.stroke();
        kit.dot(c, cf[0] - 0.25 * rf, cf[1] - 0.35 * rf, 2.6, C.muted);
        kit.label(c, 'front view', cf[0], cf[1] + rf + 16, { align: 'center', color: C.faint, size: 11.5 });
        kit.label(c, 'clear aperture ≥ ' + (0.9 * D).toFixed(1), cf[0], cf[1] + 0.9 * rf + 4 + 0, { align: 'center', color: C.ok, size: 10.5, baseline: 'top' });
        // the call-outs: [id, marker position, anchor position]
        const sy = yy => [surfX(yy), yc - yy];
        const callouts = [
          [1, [x0 + tp + 80, yc + h * 0.62], [x0 + tp * 0.6, yc + h * 0.3]],
          [2, [x0 + tp + 96, yc - h * 0.55], [x0 + tp + 52, yc - h * 0.55]],
          [3, [x0 - 52, yc - h * 0.98], sy(h * 0.72)],
          [4, [x0 + tp / 2, yc + h + 58], [x0 + tp / 2, yc + h + 28]],
          [5, [x0 - 52, yc + h * 0.98], sy(-h * 0.72)],
          [6, [x0 - 52, yc], [x0 - 14, yc]],
          [7, [cf[0] + rf + 26, cf[1] - rf * 0.5], [cf[0] - 0.12 * rf, cf[1] + 0.14 * rf]],
          [8, [cf[0] + rf + 26, cf[1] + rf * 0.55], [cf[0] + 0.9 * rf * 0.72, cf[1] + 0.9 * rf * 0.69]],
          [9, [x0 + tp + 40, yc - h - 22], [x0 + tp, yc - h * 0.82]],
          [10, [x0 - 8, yc - h - 24], [x0 + tp - 2, yc - h + 2]]
        ];
        for (const [id, m, a] of callouts) {
          const sel = id === V.item;
          c.strokeStyle = sel ? C.accent : C.muted; c.lineWidth = sel ? 1.8 : 1; c.beginPath(); c.moveTo(m[0], m[1]); c.lineTo(a[0], a[1]); c.stroke();
          c.fillStyle = sel ? C.accent : C.muted; c.beginPath(); c.arc(a[0], a[1], sel ? 3.6 : 2.4, 0, 2 * Math.PI); c.fill();
          c.fillStyle = sel ? C.accent : C.surface; c.strokeStyle = sel ? C.accent : C.muted; c.lineWidth = 1.4; c.beginPath(); c.arc(m[0], m[1], 12, 0, 2 * Math.PI); c.fill(); c.stroke();
          kit.label(c, String(id), m[0], m[1], { align: 'center', size: 12, weight: 700, color: sel ? '#101428' : C.text });
          hot.push({ id, x: m[0], y: m[1] });
        }
        kit.label(c, 'R ' + R.toFixed(1), x0 - 52, yc - h * 0.98 - 22, { align: 'center', size: 11.5, color: C.text });
        const it = ITEMS.find(i => i.id === V.item) || ITEMS[0];
        ro.set('title', it.id + ' · ' + it.title);
        ro.set('says', it.says);
        ro.set('reads', it.reads);
        ro.set('typ', it.typ);
        ro.set('why', it.why);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ making a lens */
  Hyper.sim('om-making', {
    title: 'From blank to lens: the stages of optical fabrication',
    blurb: `A lens in section at each stage of its making, with the tool, the size of the abrasive and what is left in the surface. The bars on the right are on a **logarithmic** scale: the roughness of the surface and the depth of the cracks beneath it, stage by stage. Every stage must remove the cracks of the one before. The figures are typical orders of magnitude; shops differ.

**Try this**
- Step from the *blank* to the *polished* lens and watch the roughness bar fall by four orders of magnitude, from micrometres to a nanometre.
- Look at the damage bars: the cracks of generating reach tens of micrometres, so grinding must take off more than that before it can begin to polish.
- At *centred and edged* the dashed optical axis moves onto the mechanical axis: the lens is turned about its optical axis while the edge is ground.
- At *coated* the faint reflection of each face has almost gone.`,
    mount(box, kit, params) {
      const O = kit.optics, S = kit.osym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 320 });
      const STAGES = [
        { short: '0 · Blank', name: 'Blank', tool: 'diamond saw, or a pressed preform', grit: '—', rough: 10, dmg: 100, does: 'A slab or rod is cut, or a hot gob pressed, to a size a millimetre or two over.', next: 'generating takes off the sawn surface and sets the shape' },
        { short: '1 · Generated', name: 'Generated', tool: 'bonded-diamond cup wheel', grit: 'diamond, about 64 µm', rough: 2, dmg: 40, does: 'The cup wheel cuts the radius and the thickness to about 0.05 mm; the surface is rough and cracked.', next: 'rough grinding must remove at least 40 µm of cracks' },
        { short: '2 · Rough ground', name: 'Rough ground', tool: 'iron lap, loose abrasive or diamond pellets', grit: 'about 30 µm', rough: 0.8, dmg: 30, does: 'The lap, the same radius as the lens, removes the generating damage and refines the shape.', next: 'fine grinding must remove about 30 µm' },
        { short: '3 · Fine ground', name: 'Fine ground', tool: 'lap, finer loose abrasive', grit: 'about 9 µm', rough: 0.2, dmg: 10, does: 'A finer abrasive leaves a matt surface with only shallow cracks; the radius is set within a few fringes.', next: 'polishing must remove about 10 µm' },
        { short: '4 · Polished', name: 'Polished', tool: 'pitch or polyurethane lap, cerium oxide in water', grit: 'about 1 µm', rough: 0.001, dmg: 0, does: 'Polishing removes the last damage layer and leaves a clear surface of 1 to 2 nm RMS, then the form is measured against a test plate.', next: 'the lens is centred, and edged to size' },
        { short: '5 · Centred and edged', name: 'Centred and edged', tool: 'diamond wheel, the lens turning about its optical axis', grit: 'diamond', rough: 0.001, dmg: 0, does: 'The lens is aligned on its optical axis and its edge ground to the diameter and chamfered: optical and mechanical axes now coincide.', next: 'the lens is cleaned and coated' },
        { short: '6 · Coated', name: 'Coated', tool: 'vacuum deposition of thin films', grit: 'layers of about 100 nm', rough: 0.001, dmg: 0, does: 'Thin layers cut the reflection of each face from 4 % to under 0.5 %; the lens is inspected and cemented into doublets if needed.', next: 'finished: inspect, clean, mount' }
      ];
      const ctl = kit.controls(box.side, [
        { id: 'stage', label: 'Stage', min: 0, max: 6, step: 1, value: params.stage != null ? params.stage : 1, fmt: v => STAGES[Math.max(0, Math.min(6, Math.round(v)))].short },
        { type: 'buttons', items: [{ id: 'back', label: 'Previous stage' }, { id: 'next', label: 'Next stage', primary: true }] }
      ], id => {
        if (id === 'next') ctl.set('stage', Math.min(6, Math.round(V.stage) + 1));
        if (id === 'back') ctl.set('stage', Math.max(0, Math.round(V.stage) - 1));
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Stage'], ['tool', 'Tool'], ['grit', 'Abrasive'], ['rough', 'Roughness (RMS)'], ['dmg', 'Cracks below the surface'], ['does', 'What happens'], ['next', 'Next']]);
      const um = v => v >= 1 ? kit.fmt(v, 3) + ' µm' : v >= 0.001 ? kit.fmt(v * 1000, 3) + ' nm' : '< 1 nm';
      // a small deterministic scatter of dots for the matt look of a ground surface
      const dots = []; { let s = 7; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647; for (let i = 0; i < 260; i++) dots.push([rnd(), rnd(), rnd()]); }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, k = Math.max(0, Math.min(6, Math.round(V.stage))), S0 = STAGES[k];
        // the lens in section
        const lx = 40, lw = W * 0.4, cy = Hh * 0.42, h = Math.min(Hh * 0.3, lw * 0.4), t = Math.min(h * 0.55, 46);
        const Rp = h * 3.2;
        const decentre = k === 4 ? 7 : 0;
        const dashAxis = (x1, x2, y, col) => { c.save(); c.strokeStyle = col; c.lineWidth = 1.3; c.setLineDash([9, 3, 2, 3]); c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke(); c.restore(); };
        const matt = k <= 3 ? (C.dark ? 'rgba(190,195,215,' : 'rgba(110,115,140,') + (0.45 - 0.1 * k).toFixed(2) + ')' : null;
        const cx0 = lx + lw / 2 - t / 2;
        if (k === 0) {
          S.block(c, lx + lw * 0.2, cy - h * 1.05, lw * 0.6, h * 2.1, { fill: matt, color: C.muted });
        } else {
          S.lens(c, cx0, cy, h, { R1: Rp, R2: 0, t, fill: matt || undefined, color: k <= 3 ? C.muted : undefined });
        }
        if (k <= 3) {
          const nd = k === 0 ? 150 : k === 1 ? 190 : k === 2 ? 110 : 60;
          for (let i = 0; i < nd && i < dots.length; i++) { const d = dots[i], y = cy - h + d[0] * 2 * h, x = (k === 0 ? lx + lw * 0.2 + d[1] * lw * 0.6 : cx0 + d[1] * t * 0.9 + 1); c.fillStyle = C.faint; c.fillRect(x, y, 1.8 - 0.3 * k, 1.8 - 0.3 * k); }
        }
        if (k >= 4) {                           // the clear surface: a highlight, and later the axes and the chamfers
          c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx0 + 4, cy - h * 0.55); c.lineTo(cx0 + 4, cy - h * 0.15); c.stroke();
        }
        if (k >= 4) {
          dashAxis(lx, lx + lw, cy + decentre, C.accent);                     // the optical axis
          dashAxis(lx, lx + lw, cy, C.warn);                                  // the mechanical axis of the cylinder
          kit.label(c, k === 4 ? 'optical axis (blue) is off the mechanical axis (amber)' : 'the two axes coincide', lx + lw / 2, cy + h + 36, { align: 'center', size: 11.5, color: C.muted });
        }
        if (k >= 5) { c.strokeStyle = C.text; c.lineWidth = 1.5; for (const sg of [-1, 1]) { c.beginPath(); c.moveTo(cx0 + t - 5, cy + sg * h); c.lineTo(cx0 + t, cy + sg * (h - 5)); c.stroke(); } }
        if (k === 6) { c.strokeStyle = C.accent; c.lineWidth = 2.2; c.globalAlpha = 0.8; c.beginPath(); for (let i = -12; i <= 12; i++) { const y = h * i / 12, x = cx0 + (Rp - Math.sqrt(Rp * Rp - y * y)) - 2.5; i === -12 ? c.moveTo(x, cy - y) : c.lineTo(x, cy - y); } c.stroke(); c.beginPath(); c.moveTo(cx0 + t + 2.5, cy - h); c.lineTo(cx0 + t + 2.5, cy + h); c.stroke(); c.globalAlpha = 1; }
        kit.label(c, S0.name, lx + lw / 2, cy - h * 1.05 - 18, { align: 'center', size: 13, weight: 650, color: C.text });
        kit.label(c, S0.tool, lx + lw / 2, cy + h + 16, { align: 'center', size: 11.5, color: C.muted });
        // the bars: roughness and damage on a log scale
        const bx = lx + lw + 66, bw = W - bx - 24, by = 34, rowH = (Hh - by - 40) / 5, LO = -3.5, HI = 2.3;
        const X = v => bx + (Math.log10(Math.max(v, 3.2e-4)) - LO) / (HI - LO) * bw;
        kit.label(c, 'surface and cracks, µm (logarithmic)', bx, by - 14, { color: C.muted, size: 11.5 });
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const e of [-3, -2, -1, 0, 1, 2]) { const x = X(Math.pow(10, e)); c.beginPath(); c.moveTo(x, by - 4); c.lineTo(x, by + rowH * 5); c.stroke(); kit.label(c, e >= 0 ? String(Math.pow(10, e)) : '0.' + '0'.repeat(-e - 1) + '1', x, by + rowH * 5 + 12, { align: 'center', size: 10.5, color: C.muted }); }
        for (let i = 0; i <= 4; i++) {
          const s = STAGES[i], y = by + i * rowH, act = i === Math.min(k, 4);
          if (act) { c.fillStyle = C.accent; c.globalAlpha = 0.12; c.fillRect(bx - 56, y, bw + 56, rowH); c.globalAlpha = 1; }
          kit.label(c, s.name.replace('Rough ground', 'Rough gr.').replace('Fine ground', 'Fine gr.'), bx - 52, y + rowH / 2, { size: 11, color: act ? C.text : C.muted, weight: act ? 650 : 500 });
          c.fillStyle = C.accent; c.fillRect(bx, y + rowH * 0.18, Math.max(2, X(s.rough) - bx), rowH * 0.26);
          if (s.dmg > 0) { c.fillStyle = C.warn; c.fillRect(bx, y + rowH * 0.52, Math.max(2, X(s.dmg) - bx), rowH * 0.26); kit.label(c, um(s.dmg), X(s.dmg) + 5, y + rowH * 0.65, { size: 10.5, color: C.muted }); }
          else kit.label(c, 'none left', bx + 6, y + rowH * 0.65, { size: 10.5, color: C.ok });
          kit.label(c, um(s.rough), X(s.rough) + 5, y + rowH * 0.31, { size: 10.5, color: C.muted });
        }
        c.fillStyle = C.accent; c.fillRect(bx, Hh - 22, 10, 6); kit.label(c, 'roughness', bx + 14, Hh - 19, { size: 10.5, color: C.muted });
        c.fillStyle = C.warn; c.fillRect(bx + 90, Hh - 22, 10, 6); kit.label(c, 'cracks', bx + 104, Hh - 19, { size: 10.5, color: C.muted });
        ro.set('name', S0.name);
        ro.set('tool', S0.tool);
        ro.set('grit', S0.grit);
        ro.set('rough', um(S0.rough) + (k === 0 ? ' (sawn)' : ''));
        ro.set('dmg', S0.dmg > 0 ? 'about ' + um(S0.dmg) + ' deep' : 'none');
        ro.set('does', S0.does);
        ro.set('next', S0.next);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

})();
