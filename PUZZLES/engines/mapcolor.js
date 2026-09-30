/* The Puzzle Cabinet · engines/mapcolor.js
 *
 * Colour the map: give every region a colour so that no two neighbours — regions
 * that share a stretch of border, not just a corner — have the same one.
 *
 * data: {
 *   g: [w, h, 'cells'] | pts: [x0, y0, …], R: [[…], …]   the map (see js/lib/mapgen.js)
 *   wob: 1      borders drawn a little wavy, like real frontiers;  sea: 1  water round an island
 *   k: 2 | 3 | 4                 how many colours may be used
 *   mode: 'unique'               some regions are coloured already and only one way remains (verify proves it)
 *       | 'free'                 any colouring with at most k colours
 *       | 'can3'                 a question: can three colours ever be enough for this map? (answer: ans)
 *   giv: [[region, colour], …]   the regions coloured at the start
 *   ans: true | false            can3: whether three colours are enough
 *   names: ['Arvelia', …]        optional region names;  label: 'The Isle of Wend'  optional map title
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = () => C.MapGen;

  const COLS = [
    { name: 'Rose', fill: '#f2a0a6', deep: '#c9616b' },
    { name: 'Saffron', fill: '#f5d27a', deep: '#c49a2c' },
    { name: 'Sage', fill: '#9fd3a4', deep: '#4f9a5a' },
    { name: 'Sky', fill: '#9cc6f0', deep: '#4f86c0' }
  ];

  /* ---------- geometry for drawing ---------- */

  // a border between two corners, a little wavy when the map wants it; the same from both sides
  function edgeLine(P, a, b, amp, seed) {
    const pa = P[a], pb = P[b];
    const len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]);
    if (!amp || len < 18) return [pa, pb];
    const rng = C.rng(seed);
    let pts = [pa, pb];
    let A = len * amp;
    for (let lev = 0; lev < 3; lev++) {
      const out = [pts[0]];
      for (let i = 0; i + 1 < pts.length; i++) {
        const p = pts[i], q = pts[i + 1];
        const dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1;
        const off = (rng() * 2 - 1) * A;
        out.push([(p[0] + q[0]) / 2 - dy / l * off, (p[1] + q[1]) / 2 + dx / l * off], q);
      }
      pts = out;
      A *= 0.45;
    }
    return pts;
  }

  function geometry(d) {
    const M = G().build(d);
    const amp = d.wob ? 0.075 : 0;
    const eLines = new Map();
    M.edges.forEach((e, i) => {
      const coast = e.r.length < 2;
      const pts = edgeLine(M.P, e.a, e.b, coast && d.sea ? amp * 1.7 : amp, 7919 * e.a + 104729 * e.b + 17);
      e.pts = pts;
      e.i = i;
      eLines.set(e.a + ',' + e.b, e);
    });
    const lineOf = (u, v) => {
      const e = eLines.get(Math.min(u, v) + ',' + Math.max(u, v));
      if (!e) return [M.P[u], M.P[v]];
      return u === e.a ? e.pts : e.pts.slice().reverse();
    };
    // each region as closed rings of points (holes included)
    const rings = M.loops.map((L) => L.map((loop) => {
      const out = [];
      loop.forEach((u, i) => {
        const v = loop[(i + 1) % loop.length];
        const seg = lineOf(u, v);
        for (let k = 0; k < seg.length - 1; k++) out.push(seg[k]);
      });
      return out;
    }));
    return { M, rings, lineOf };
  }

  const fmt = (v) => Math.round(v * 10) / 10;
  const pathOf = (rings) => rings.map((r) => 'M' + r.map((p) => fmt(p[0]) + ' ' + fmt(p[1])).join('L') + 'Z').join('');

  function inRings(pt, rings) {
    let inside = false;
    rings.forEach((r) => {
      for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
        const a = r[i], b = r[j];
        if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
      }
    });
    return inside;
  }
  function segDist(p, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy;
    let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  }
  // the point deepest inside a region (for its name and its pin), and how far it is from the border
  function labelPoint(rings) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    rings[0].forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    let best = null;
    const N = 14;
    const dist = (p) => { let m = Infinity; rings.forEach((r) => r.forEach((a, i) => { m = Math.min(m, segDist(p, a, r[(i + 1) % r.length])); })); return m; };
    for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
      const p = [x0 + (x1 - x0) * (i + 0.5) / (N + 1), y0 + (y1 - y0) * (j + 0.5) / (N + 1)];
      if (!inRings(p, rings)) continue;
      const dd = dist(p);
      if (!best || dd > best.r) best = { p, r: dd };
    }
    if (!best) { const c = rings[0][0]; best = { p: c, r: 4 }; }
    // refine around the best sample
    let step = Math.max(x1 - x0, y1 - y0) / (N + 1) / 2;
    for (let it = 0; it < 12; it++) {
      let moved = false;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const p = [best.p[0] + dx * step, best.p[1] + dy * step];
        if (!inRings(p, rings)) continue;
        const dd = dist(p);
        if (dd > best.r) { best = { p, r: dd }; moved = true; }
      }
      if (!moved) step /= 2;
    }
    return best;
  }

  /* ---------- checking (node-safe) ---------- */

  function fixedOf(d, n) {
    const f = new Array(n).fill(-1);
    (d.giv || []).forEach(([r, c]) => { if (r >= 0 && r < n) f[r] = c; });
    return f;
  }

  function verify(p) {
    const d = p.data, L = G();
    if (!L) return { ok: false, err: 'js/lib/mapgen.js is not loaded' };
    if (!d || (!d.g && !(d.pts && d.R))) return { ok: false, err: 'a map (g, or pts and R) is needed' };
    const M = L.build(d);
    if (M.err) return { ok: false, err: M.err };
    if (M.n < 2) return { ok: false, err: 'fewer than two regions' };
    if (M.loops.some((l) => !l.length)) return { ok: false, err: 'a region has no outline' };
    if (!L.connected(M.adj)) return { ok: false, err: 'the map falls into separate pieces' };
    const mode = d.mode || 'unique', k = d.k || 4;
    if (d.names && d.names.length !== M.n) return { ok: false, err: 'names do not match the regions' };
    const fixed = fixedOf(d, M.n);
    if ((d.giv || []).some(([r, c]) => r < 0 || r >= M.n || c < 0 || c >= k)) return { ok: false, err: 'a pre-coloured region is out of range' };
    for (let r = 0; r < M.n; r++) if (fixed[r] >= 0) for (const u of M.adj[r]) if (fixed[u] === fixed[r]) return { ok: false, err: 'two pre-coloured neighbours share a colour' };
    if (mode === 'can3') {
      const three = L.colourable(M.adj, 3);
      if (three !== !!d.ans) return { ok: false, err: 'the answer says ' + (d.ans ? 'three colours are enough' : 'four are needed') + ' but the search says otherwise' };
      if (!three && !L.oddWheel(M.adj)) return { ok: true, warn: 'no odd wheel to show why four are needed' };
      return { ok: true };
    }
    if (mode === 'free') {
      if (!L.colourable(M.adj, k, fixed)) return { ok: false, err: 'no colouring with ' + k + ' colours exists' };
      return { ok: true };
    }
    if (k < 2 || k > 4) return { ok: false, err: 'k must be 2, 3 or 4' };
    const u = L.unique(M.adj, k, fixed);
    if (u.aborted) return { ok: false, err: 'the search gave up' };
    if (u.count === 0) return { ok: false, err: 'no colouring keeps the pre-coloured regions' };
    if (!u.unique) return { ok: false, err: 'more than one colouring is possible' };
    const gr = L.grade(M.adj, k, fixed);
    if (!gr.solved) return { ok: true, warn: 'the reasoning needs more than one supposition at a time' };
    return { ok: true, level: gr.level };
  }

  function solutionOf(d, M) {
    const L = G(), k = d.mode === 'can3' ? (d.ans ? 3 : 4) : (d.k || 4);
    const r = L.search(M.adj, k, d.mode === 'can3' ? null : fixedOf(d, M.n), 1);
    return r.count ? r.sols[0] : null;
  }

  /* ---------- endless ---------- */

  const TXT = {
    unique: (k) => 'Colour every region with one of the **' + k + '** colours so that no two neighbours match. The regions coloured already leave only one way to finish.',
    free: (k) => 'Colour the whole map using no more than **' + k + '** colours, so that no two neighbours match.',
    can3: () => 'Could this map be coloured with only **three** colours, no two neighbours alike? Try it with the colours if you like, then answer.'
  };

  function makeMap(rng, style, n) {
    const L = G();
    if (style === 'grid') { const w = Math.max(4, Math.round(Math.sqrt(n * 3.4 * 1.4))), h = Math.max(3, Math.round(n * 3.4 / w)); return L.gridMap(rng, w, h, n); }
    if (style === 'grid3') { const w = Math.max(5, Math.round(Math.sqrt(n * 4.2 * 1.4))), h = Math.max(4, Math.round(n * 4.2 / w)); return L.gridMap3(rng, w, h, Math.round(n * 1.5), n); }
    if (style === 'voronoi') return L.voronoiMap(rng, n);
    if (style === 'island') return L.islandMap(rng, n);
    if (style === 'glass') return L.glassMap(rng, n - 1, false);
    if (style === 'lines') return L.glassMap(rng, n, true);
    return null;
  }

  function levelOf(n, logic, k) {
    // size and the hardest kind of reasoning needed
    if (logic >= 3) return n > 30 ? 5 : n > 18 ? 4 : 3;
    if (logic === 2) return n > 30 ? 4 : n > 16 ? 3 : 2;
    return n > 32 ? 4 : n > 20 ? 3 : n > 12 ? 2 : 1;
  }

  function generate(rng, level, fam) {
    const L = G();
    const plan = [null,
      [['unique', 4, 'glass', 9, 12], ['unique', 4, 'grid', 9, 12], ['free', 4, 'voronoi', 10, 14], ['unique', 3, 'grid3', 8, 11]],
      [['unique', 4, 'voronoi', 14, 20], ['unique', 4, 'grid', 14, 20], ['unique', 3, 'grid3', 12, 16], ['can3', 3, 'grid', 10, 14], ['free', 2, 'lines', 4, 6]],
      [['unique', 4, 'voronoi', 20, 28], ['unique', 4, 'island', 18, 24], ['unique', 3, 'grid3', 16, 22], ['free', 3, 'grid3', 12, 18], ['can3', 3, 'grid3', 14, 20]],
      [['unique', 4, 'voronoi', 28, 36], ['unique', 4, 'island', 24, 32], ['unique', 3, 'grid3', 22, 30], ['free', 3, 'grid3', 20, 28]],
      [['unique', 4, 'voronoi', 36, 46], ['unique', 4, 'island', 32, 40], ['unique', 3, 'grid3', 30, 38]]
    ][level] || [];
    const pl = plan[Math.floor(rng() * plan.length)];
    if (!pl) return null;
    const [mode, k, style, lo, hi] = pl;
    const n = lo + Math.floor(rng() * (hi - lo + 1));
    for (let t = 0; t < 4; t++) {
      const d = makeMap(rng, style, n);
      if (!d) continue;
      const M = L.build(d);
      if (M.err || !L.connected(M.adj)) continue;
      d.k = k; d.mode = mode;
      if (style === 'island') { d.names = L.names(rng, M.n); d.label = 'The Isle of ' + L.ISLES[Math.floor(rng() * L.ISLES.length)]; }
      if (mode === 'can3') {
        d.ans = L.colourable(M.adj, 3);
        if (!d.ans && !L.oddWheel(M.adj)) continue;
        return { title: d.ans ? 'Three Will Do?' : 'Three or Four?', text: TXT.can3(), diff: level, data: d };
      }
      if (mode === 'free') {
        if (!L.colourable(M.adj, k)) continue;
        if (k === 3 && L.colourable(M.adj, 2)) continue;
        return { title: k === 2 ? 'Two Colours Only' : k === 3 ? 'Three Colours Only' : 'Four Colours', text: TXT.free(k), diff: level, data: d };
      }
      if (!L.colourable(M.adj, k)) continue;
      const b = L.bestUnique(M.adj, k, rng, level >= 4 ? 4 : 3);
      if (!b) continue;
      d.giv = b.giv;
      const gr = L.grade(M.adj, k, fixedOf(d, M.n));
      if (!gr.solved) continue;
      const lv = levelOf(M.n, gr.level, k);
      if (Math.abs(lv - level) > 1) continue;
      const kind = style === 'island' ? d.label : style === 'glass' ? 'Stained Glass' : style === 'voronoi' ? 'Countries' : 'Patchwork';
      return { title: kind + ' (' + M.n + ' regions)', text: TXT.unique(k), diff: level, data: d };
    }
    return null;
  }

  /* ---------- the page ---------- */

  function about(p) {
    const d = (p && p.data) || {};
    let s = 'Pick a colour in the panel (or press **1**–**' + Math.max(2, d.k || 4) + '**), then click regions to colour them. Click a region again with the same colour, or right-click it, to rub it out; **0** picks the eraser. **Cycle** mode steps each click through the colours. Drag across regions to colour several.\n\nNeighbours are regions that share a stretch of border; regions that meet only at a corner may have the same colour. A red border shows two neighbours that clash.';
    if (d.mode === 'can3') s += '\n\nThis one is a question: answer it in the panel. The colours are there to experiment with.';
    return s;
  }

  function mount(ctx, p) {
    const L = G(), d = p.data, wb = ctx.wb, s = ctx.s;
    const { M, rings } = geometry(d);
    const n = M.n, mode = d.mode || 'unique';
    const k = mode === 'can3' ? 4 : (d.k || 4);
    const fixed = mode === 'can3' ? new Array(n).fill(-1) : fixedOf(d, n);
    let col = fixed.slice();
    let pick = 0, cycle = false, hoverR = -1, drag = null;
    const timers = [];
    const labels = rings.map((r) => labelPoint(r));
    const bb = M.bbox, span = Math.max(bb.x1 - bb.x0, bb.y1 - bb.y0);
    const pad = span * (d.sea ? 0.07 : 0.03);
    wb.setBounds({ x0: bb.x0 - pad, y0: bb.y0 - pad - (d.label ? span * 0.06 : 0), x1: bb.x1 + pad, y1: bb.y1 + pad }, 0.04);
    const unit = span / 100;

    const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
    const gAll = s('g', { class: 'mc' + (d.sea ? ' sea' : '') }, board);
    if (d.sea) {
      const sea = s('g', { class: 'mc-sea' }, bg);
      s('rect', { x: bb.x0 - pad * 3, y: bb.y0 - pad * 3, width: bb.x1 - bb.x0 + pad * 6, height: bb.y1 - bb.y0 + pad * 6, rx: unit * 2 }, sea);
      for (let i = 0; i < 9; i++) {
        const y = bb.y0 + (bb.y1 - bb.y0) * (i + 0.5) / 9;
        let dd = 'M' + fmt(bb.x0 - pad * 2) + ' ' + fmt(y);
        for (let x = bb.x0 - pad * 2; x < bb.x1 + pad * 2; x += unit * 6) dd += 'q' + fmt(unit * 1.5) + ' ' + fmt(-unit * 0.8) + ' ' + fmt(unit * 3) + ' 0t' + fmt(unit * 3) + ' 0';
        s('path', { d: dd, class: 'mc-wave' }, sea);
      }
    }
    if (d.label) s('text', { x: (bb.x0 + bb.x1) / 2, y: bb.y0 - pad * 0.4, 'text-anchor': 'middle', class: 'mc-title', style: 'font-size:' + fmt(unit * 4.2) + 'px', text: d.label }, gAll);
    const regEls = rings.map((r, i) => s('path', { d: pathOf(r), class: 'mc-reg', 'data-r': i, 'fill-rule': 'evenodd' }, gAll));
    // borders: inner ones thin, the outline thick
    const bordG = s('g', { class: 'mc-borders', style: 'stroke-width:' + fmt(unit * 0.42) }, gAll);
    let inner = '', outer = '';
    M.edges.forEach((e) => {
      const dd = 'M' + e.pts.map((q) => fmt(q[0]) + ' ' + fmt(q[1])).join('L');
      if (e.r.length === 2) inner += dd; else outer += dd;
    });
    s('path', { d: inner, class: 'mc-in' }, bordG);
    s('path', { d: outer, class: 'mc-out', style: 'stroke-width:' + fmt(unit * 0.8) }, bordG);
    const clashG = s('g', { class: 'mc-clash', style: 'stroke-width:' + fmt(unit * 1.1) }, top);
    const pinG = s('g', { class: 'mc-pins' }, top);
    const nameG = s('g', { class: 'mc-names' }, top);
    const hintG = s('g', { class: 'mc-hint', style: 'stroke-width:' + fmt(unit * 0.9) }, top);
    const nameEls = [];
    if (d.names) {
      d.names.forEach((nm, i) => {
        const lp = labels[i];
        const fs = Math.min(unit * 2.6, lp.r * 0.55, lp.r * 3.4 / Math.max(4, nm.length) * 1.1);
        if (fs < unit * 1.1) return;
        nameEls[i] = s('text', { x: fmt(lp.p[0]), y: fmt(lp.p[1] + fs * 0.35), 'text-anchor': 'middle', class: 'mc-name', style: 'font-size:' + fmt(fs) + 'px', text: nm }, nameG);
      });
    }
    fixed.forEach((c, i) => {
      if (c < 0) return;
      const lp = labels[i], r = Math.min(unit * 1.3, lp.r * 0.4);
      const y = d.names ? lp.p[1] - Math.min(unit * 2.6, lp.r * 0.55) * 0.9 : lp.p[1];
      s('circle', { cx: fmt(lp.p[0]), cy: fmt(y), r: fmt(r), class: 'mc-pin', style: 'stroke-width:' + fmt(r * 0.35) }, pinG);
    });

    /* the panel: colour chips */
    const chips = [];
    const chipRow = ctx.h('div.mc-chips');
    for (let c = 0; c < k; c++) {
      const b = ctx.h('button.mc-chip', { type: 'button', title: COLS[c].name + ' (' + (c + 1) + ')', onclick: () => choose(c) },
        ctx.h('i', { style: { background: COLS[c].fill } }), ctx.h('span', COLS[c].name), ctx.h('kbd', String(c + 1)));
      chips.push(b); chipRow.appendChild(b);
    }
    const cycB = ctx.h('button.mc-chip.tool', { type: 'button', title: 'Each click steps the region through the colours', onclick: () => choose('cycle') }, ctx.h('i.cyc'), ctx.h('span', 'Cycle'));
    const eraB = ctx.h('button.mc-chip.tool', { type: 'button', title: 'Rub out (0)', onclick: () => choose(-1) }, ctx.h('i.era'), ctx.h('span', 'Rub out'), ctx.h('kbd', '0'));
    chipRow.append(cycB, eraB);
    ctx.panel.appendChild(chipRow);
    const clearB = ctx.h('button.btn.small.ghost', { type: 'button', onclick: () => { let ch = false; for (let i = 0; i < n; i++) if (fixed[i] < 0 && col[i] >= 0) { col[i] = -1; ch = true; } if (ch) { draw(); ctx.changed('clear'); } } }, 'Clear my colours');
    ctx.panel.appendChild(clearB);
    function choose(c) {
      if (c === 'cycle') { cycle = true; }
      else { cycle = false; pick = c; }
      chips.forEach((b, i) => b.classList.toggle('on', !cycle && pick === i));
      cycB.classList.toggle('on', cycle);
      eraB.classList.toggle('on', !cycle && pick === -1);
    }
    choose(0);

    let box = null;
    if (mode === 'can3') {
      box = ctx.answer({
        kind: 'choice',
        label: 'Can this map be coloured with three colours?',
        choices: ['Yes — three colours are enough', 'No — it needs four'],
        check: (v) => {
          const yes = v === 0;
          if (yes === !!d.ans) {
            timers.push(setTimeout(() => showWhy(false), 30));
            return { ok: true, msg: d.ans ? 'Yes! Three colours are enough — here is one way.' : 'Right: it needs four. Look at the flashing region and the ring round it.' };
          }
          return { ok: false, msg: d.ans ? 'Look again — there is a way with three. Try colouring it.' : 'Try colouring it with three: somewhere you will get stuck. Why?' };
        }
      });
    }

    /* drawing the state */
    function clashes() {
      const out = [];
      M.edges.forEach((e) => { if (e.r.length === 2 && col[e.r[0]] >= 0 && col[e.r[0]] === col[e.r[1]]) out.push(e); });
      return out;
    }
    function draw() {
      regEls.forEach((el, i) => {
        const c = col[i];
        el.style.fill = c >= 0 ? COLS[c].fill : '';
        el.classList.toggle('on', c >= 0);
        el.classList.toggle('given', fixed[i] >= 0);
        el.classList.toggle('hov', i === hoverR);
        if (nameEls[i]) nameEls[i].classList.toggle('on', c >= 0);
      });
      const cl = clashes();
      clashG.innerHTML = '';
      if (cl.length) s('path', { d: cl.map((e) => 'M' + e.pts.map((q) => fmt(q[0]) + ' ' + fmt(q[1])).join('L')).join(''), class: 'mc-clash-p' }, clashG);
      const done = col.filter((c) => c >= 0).length;
      ctx.stat('Coloured', done + '/' + n);
      ctx.stat('Clashes', cl.length);
      gAll.classList.toggle('solved', done === n && !cl.length && mode !== 'can3');
    }
    function flash(list, cls) {
      hintG.innerHTML = '';
      list.forEach((r) => s('path', { d: pathOf(rings[r]), class: cls || 'mc-flash', 'fill-rule': 'evenodd' }, hintG));
      timers.push(setTimeout(() => { hintG.innerHTML = ''; }, 3200));
    }

    /* colouring */
    function setColour(r, c, quiet) {
      if (r < 0 || r >= n) return false;
      if (fixed[r] >= 0) { if (!quiet) ctx.toast('That region was coloured for you.'); return false; }
      if (col[r] === c) return false;
      col[r] = c;
      return true;
    }
    function clickColour(r) {
      if (cycle) return col[r] + 1 >= k ? -1 : col[r] + 1;
      if (pick >= 0 && col[r] === pick) return -1;
      return pick;
    }
    const regionAt = (pt) => { for (let i = 0; i < n; i++) if (inRings(pt, rings[i])) return i; return -1; };
    wb.handlers.board = {
      down(pt, ev, el) {
        const t = el && el.closest ? el.closest('[data-r]') : null;
        const r = t ? +t.getAttribute('data-r') : regionAt(pt);
        if (r < 0) return false;
        const c = ev && ev.button === 2 ? -1 : clickColour(r);
        const changed = setColour(r, c);
        drag = { c, changed, last: r };
        if (changed) { ctx.sfx(c >= 0 ? 'tap' : 'snap'); draw(); }
        return true;
      },
      move(pt) {
        if (!drag || cycle) return;
        const r = regionAt(pt);
        if (r < 0 || r === drag.last) return;
        drag.last = r;
        if (fixed[r] >= 0) return;
        if (setColour(r, drag.c, true)) { drag.changed = true; ctx.sfx('tap'); draw(); }
      },
      up() {
        const dr = drag;
        drag = null;
        if (dr && dr.changed) ctx.changed('colour-map');
      },
      hover(pt, ev, el) {
        const t = el && el.closest ? el.closest('[data-r]') : null;
        const r = t ? +t.getAttribute('data-r') : -1;
        if (r !== hoverR) { hoverR = r; regEls.forEach((e2, i) => e2.classList.toggle('hov', i === r)); }
      },
      longpress(pt, ev, el) {
        const t = el && el.closest ? el.closest('[data-r]') : null;
        const r = t ? +t.getAttribute('data-r') : regionAt(pt);
        if (r >= 0 && setColour(r, -1)) { draw(); ctx.changed('colour-map'); }
      }
    };

    /* hints */
    const nameOf = (r) => (d.names ? '**' + d.names[r] + '**' : 'the flashing region');
    const colName = (c) => '**' + COLS[c].name + '**';
    let sol = null, lastHintR = -1;
    const solution = () => (sol || (sol = solutionOf(d, M)));
    function hint(hn) {
      if (mode === 'can3') {
        const w = L.oddWheel(M.adj);
        if (hn === 0) return 'Look for a region that is completely surrounded by a ring of neighbours, each touching the next. How many are in the ring?';
        if (d.ans) {
          if (hn === 1) return 'Try it: colour one region, then keep going. Where a region has two coloured neighbours of different colours, the third colour is forced.';
          return { text: 'Here is a start: these regions are coloured with three colours and nothing clashes.', show() { const s3 = L.search(M.adj, 3, null, 1).sols[0]; col = s3.map((c, i) => (i % 3 === 0 ? c : -1)); draw(); ctx.changed('hint'); } };
        }
        if (w && hn === 1) return { text: (d.names ? nameOf(w.hub) + ' is' : 'The flashing region is') + ' surrounded by a ring of ' + w.ring.length + ' neighbours.', show() { flash([w.hub]); } };
        if (w) return { text: 'Around a ring of ' + w.ring.length + ' — an odd number — two colours cannot simply take turns: the ring needs three. The region in the middle touches all of them.', show() { flash(w.ring, 'mc-flash ring'); } };
        return null;
      }
      const cl = clashes();
      if (cl.length) {
        const e = cl[0];
        return { text: 'Two neighbours share a colour — the red border between them.', show() { flash(e.r); } };
      }
      if (mode === 'unique') {
        const S = solution();
        const wrong = [];
        for (let i = 0; i < n; i++) if (col[i] >= 0 && S && col[i] !== S[i]) wrong.push(i);
        if (wrong.length) return { text: 'Something has gone astray: ' + (d.names ? nameOf(wrong[0]) : 'the flashing region') + ' cannot keep that colour.', show() { flash([wrong[0]]); } };
        let step = nextStep(col);
        // the same step again (nothing was done with the last hint): colour it in and go one further
        if (step && lastHintR === step.r && col[step.r] < 0 && S) {
          const r0 = step.r;
          col[r0] = S[r0];
          draw();
          ctx.changed('hint');
          const pre = (d.names ? nameOf(r0) : 'That region') + ' is ' + colName(S[r0]) + ' — coloured in for you. ';
          step = nextStep(col);
          if (!step) { lastHintR = -1; return { text: pre, show() { flash([r0]); } }; }
          step.text = pre + step.text;
        }
        if (step) { lastHintR = step.r; return step; }
        // nothing simple: give a region away
        const r = col.findIndex((c) => c < 0);
        if (r < 0) return null;
        return { text: (d.names ? nameOf(r) : 'The flashing region') + ' is ' + colName(S[r]) + '.', show() { col[r] = S[r]; draw(); flash([r]); ctx.changed('hint'); } };
      }
      // free: a region with no colour left, else the most crowded region and a colour that still leads somewhere
      for (let i = 0; i < n; i++) {
        if (col[i] >= 0) continue;
        const used = new Set(M.adj[i].map((u) => col[u]).filter((c) => c >= 0));
        if (used.size >= k) return { text: (d.names ? nameOf(i) : 'The flashing region') + ' has no colour left: every one of the ' + k + ' colours is next to it. Something around it must change.', show() { flash([i]); } };
      }
      const r2 = L.search(M.adj, k, col, 1, { nodeLimit: 2e5 });
      if (!r2.count) {
        return { text: 'Your colouring cannot be finished as it stands. Rub out a few colours in the busiest part of the map and try again.', show() { } };
      }
      let best = -1, bu = -1;
      for (let i = 0; i < n; i++) {
        if (col[i] >= 0) continue;
        const used = new Set(M.adj[i].map((u) => col[u]).filter((c) => c >= 0)).size;
        if (used > bu) { bu = used; best = i; }
      }
      if (best < 0) return null;
      const c2 = r2.sols[0][best];
      return { text: 'Try ' + colName(c2) + ' for ' + (d.names ? nameOf(best) : 'the flashing region') + '.', show() { flash([best]); } };
    }
    // one step of reasoning from the colours on the board (all correct so far)
    function nextStep(cur) {
      const full = (1 << k) - 1;
      const dom = cur.map((c) => (c >= 0 ? 1 << c : full));
      for (let i = 0; i < n; i++) if (cur[i] >= 0) M.adj[i].forEach((u) => { if (cur[u] < 0) dom[u] &= ~(1 << cur[i]); });
      const names = (mask) => { const o = []; for (let c = 0; c < k; c++) if (mask & (1 << c)) o.push(COLS[c].name); return o; };
      // a single
      for (let i = 0; i < n; i++) {
        if (cur[i] >= 0 || L.pop(dom[i]) !== 1) continue;
        const c = Math.log2(dom[i]);
        const around = names(full & ~dom[i]);
        return { r: i, text: (d.names ? nameOf(i) + ' touches ' : 'The flashing region touches ') + around.join(', ').replace(/, ([^,]*)$/, ' and $1') + ' — so it must be ' + colName(c) + '.', show() { flash([i]); } };
      }
      // a pair: two touching regions that share the same two possible colours
      const adjS = M.adj.map((a) => new Set(a));
      for (let u = 0; u < n; u++) {
        if (cur[u] >= 0 || L.pop(dom[u]) !== 2) continue;
        for (const v of M.adj[u]) {
          if (v <= u || cur[v] >= 0 || dom[v] !== dom[u]) continue;
          for (const w of M.adj[u]) {
            if (w === v || cur[w] >= 0 || !adjS[v].has(w) || !(dom[w] & dom[u])) continue;
            const two = names(dom[u]);
            return { r: w, text: 'The two flashing regions touch each other and can only be ' + two.join(' or ') + ', so between them they use both. ' + (d.names ? nameOf(w) : 'The region outlined') + ' touches both of them, so it can be neither.', show() { flash([u, v]); timers.push(setTimeout(() => flash([w], 'mc-flash ring'), 900)); } };
          }
        }
      }
      // a supposition that fails
      for (let i = 0; i < n; i++) {
        if (cur[i] >= 0 || L.pop(dom[i]) < 2) continue;
        for (let c = 0; c < k; c++) {
          if (!(dom[i] & (1 << c))) continue;
          const test = cur.slice();
          test[i] = c;
          const g2 = L.grade(M.adj, k, test);
          if (g2.contradiction) {
            return { r: i, text: 'Suppose ' + (d.names ? nameOf(i) : 'the flashing region') + ' were ' + colName(c) + '. Follow what that forces round about: some region is left with no colour at all. So it is not ' + COLS[c].name + '.', show() { flash([i]); } };
          }
        }
      }
      return null;
    }

    function showWhy(animated) {
      if (mode !== 'can3') return;
      const w = d.ans ? null : L.oddWheel(M.adj);
      const S = L.search(M.adj, d.ans ? 3 : 4, null, 1).sols[0];
      if (S) { col = S.slice(); draw(); }
      if (w) {
        hintG.innerHTML = '';
        w.ring.forEach((r) => s('path', { d: pathOf(rings[r]), class: 'mc-ring', 'fill-rule': 'evenodd' }, hintG));
        s('path', { d: pathOf(rings[w.hub]), class: 'mc-hub', 'fill-rule': 'evenodd', style: 'stroke-width:' + fmt(unit * 1.2) }, hintG);
      }
    }

    function key(ev) {
      if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
      const kk = ev.key;
      if (/^[1-4]$/.test(kk) && +kk <= k) { choose(+kk - 1); return true; }
      if (kk === '0') { choose(-1); return true; }
      return false;
    }

    draw();

    const inst = {
      noMoves: true,
      hint,
      key,
      getState() { return { col: Array.from(col) }; },
      setState(st) {
        if (!st || !Array.isArray(st.col) || st.col.length !== n) return;
        col = st.col.map((c, i) => (fixed[i] >= 0 ? fixed[i] : (c >= 0 && c < k ? c : -1)));
        draw();
      },
      solve() {
        if (mode === 'can3') { showWhy(true); if (box) box.feedback(d.ans ? 'Yes: three colours are enough, as the map now shows.' : 'It needs four: the region in the middle of an odd ring touches three colours.', 'good'); return; }
        // keep the player's colours when they can be finished, else start from the pre-coloured ones
        let base = col.slice();
        if (clashes().length) base = fixed.slice();
        let r = L.search(M.adj, k, base, 1, { nodeLimit: 3e5 });
        if (!r.count) { base = fixed.slice(); r = L.search(M.adj, k, base, 1); }
        const S = r.sols[0];
        if (!S) return;
        // colour outwards from the pre-coloured regions
        const order = [], seen = new Uint8Array(n), q = [];
        for (let i = 0; i < n; i++) if (base[i] >= 0) { seen[i] = 1; q.push(i); }
        if (!q.length) { seen[0] = 1; q.push(0); }
        for (let qi = 0; qi < q.length; qi++) { const v = q[qi]; if (base[v] < 0) order.push(v); for (const u of M.adj[v]) if (!seen[u]) { seen[u] = 1; q.push(u); } }
        for (let i = 0; i < n; i++) if (!seen[i] && base[i] < 0) order.push(i);
        col = base.map((c) => c);
        draw();
        let i = 0;
        const step = () => {
          if (i >= order.length) { draw(); ctx.changed('solve'); return; }
          const v = order[i++];
          col[v] = S[v];
          draw();
          timers.push(setTimeout(step, C.anim(Math.max(25, 900 / order.length))));
        };
        timers.push(setTimeout(step, C.anim(120)));
      },
      explain() {
        if (mode === 'can3') {
          if (d.ans) return 'Three colours are enough. Many maps need only three — but as soon as some region is surrounded by an **odd** ring of neighbours (each touching the next), a fourth is needed: two colours cannot alternate round an odd ring, so the ring takes three, and the region in the middle touches all three. The four-colour theorem says four always suffice.';
          const w = L.oddWheel(M.adj);
          return 'Four colours are needed. ' + (w ? 'A region here is surrounded by a ring of ' + w.ring.length + ' neighbours, each touching the next. Two colours cannot alternate round an odd ring, so the ring uses three colours — and the region in the middle touches every one of them.' : '') + ' Four, on the other hand, are always enough for any map drawn on a flat sheet: the four-colour theorem, proved by Kenneth Appel and Wolfgang Haken in 1976.';
        }
        if (mode === 'free' && k === 2) return 'Maps made by drawing straight lines right across a sheet can always be coloured with two colours: colour a region by whether it lies on an even or odd number of lines\' “upper” sides. Crossing any line flips the count, so neighbours always differ.';
        if (mode === 'free') return 'Any colouring with ' + k + ' colours and no clashing neighbours counts. There are usually many.';
        return 'Each region was settled either because its neighbours already used every other colour, or because the alternatives led to a region with no colour at all.';
      },
      destroy() { timers.forEach(clearTimeout); wb.handlers.board = null; }
    };
    if (mode !== 'can3') {
      inst.check = function (manual) {
        const blank = col.filter((c) => c < 0).length, cl = clashes().length;
        if (!blank && !cl) return { solved: true, msg: mode === 'unique' ? 'Every region coloured, no neighbours alike.' : 'Coloured with ' + new Set(col).size + ' colours and no clashes.' };
        if (!manual) return { solved: false };
        if (cl) return { solved: false, msg: C.plural(cl, 'border') + ' between neighbours of the same colour (shown in red).' };
        return { solved: false, msg: C.plural(blank, 'region') + ' still to colour.' };
      };
    }
    return inst;
  }

  /* ---------- a small picture for the drawer ---------- */

  function thumb(p) {
    const d = p.data;
    let geo;
    try { geo = geometry(d); } catch (e) { return ''; }
    const { M, rings } = geo;
    const bb = M.bbox, span = Math.max(bb.x1 - bb.x0, bb.y1 - bb.y0), pad = span * 0.04;
    const f = fixedOf(d, M.n);
    let s = '<svg viewBox="' + fmt(bb.x0 - pad) + ' ' + fmt(bb.y0 - pad) + ' ' + fmt(bb.x1 - bb.x0 + 2 * pad) + ' ' + fmt(bb.y1 - bb.y0 + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
    if (d.sea) s += '<rect x="' + fmt(bb.x0 - pad) + '" y="' + fmt(bb.y0 - pad) + '" width="' + fmt(bb.x1 - bb.x0 + 2 * pad) + '" height="' + fmt(bb.y1 - bb.y0 + 2 * pad) + '" fill="var(--water)" opacity=".35"/>';
    rings.forEach((r, i) => {
      const c = d.mode === 'can3' ? -1 : f[i];
      s += '<path d="' + pathOf(r) + '" fill-rule="evenodd" fill="' + (c >= 0 ? COLS[c].fill : 'var(--cell)') + '" stroke="var(--ink-2)" stroke-width="' + fmt(span / 140) + '" stroke-linejoin="round"/>';
    });
    return s + '</svg>';
  }

  C.engine({
    id: 'mapcolor',
    name: 'Colour the map',
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    deps: ['js/lib/mapgen.js'],
    noMoves: true,
    stateVersion: 1,
    about,
    verify,
    answerKey(p) { return p.data.mode === 'can3' ? (p.data.ans ? 0 : 1) : null; },
    generate,
    mount,
    thumb
  });

  C.mapColor = { COLS, geometry, verify, generate, levelOf, labelPoint };

  C.css('mapcolor', `
    .mc-reg { fill: var(--cell); cursor: pointer; transition: fill .18s ease, filter .15s; }
    .mc-reg.hov { filter: brightness(1.12); }
    .mc-reg.given { cursor: not-allowed; }
    .mc.sea .mc-reg:not(.on) { fill: var(--board-2); }
    .mc-sea rect { fill: var(--water); opacity: .22; }
    .mc-wave { fill: none; stroke: var(--water); stroke-width: 2; opacity: .35; stroke-linecap: round; }
    .mc-borders path { fill: none; stroke-linejoin: round; stroke-linecap: round; pointer-events: none; }
    .mc-in { stroke: var(--ink-2); opacity: .85; }
    .mc-out { stroke: var(--ink); }
    .mc-clash-p { fill: none; stroke: var(--red); stroke-linecap: round; stroke-linejoin: round; animation: mcclash 1s ease-in-out infinite; filter: drop-shadow(0 0 4px var(--red)); pointer-events: none; }
    @keyframes mcclash { 50% { opacity: .45; } }
    .mc-pin { fill: #2b2418; stroke: #fffdf6; pointer-events: none; }
    .mc-name { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 600; fill: var(--ink-2); opacity: .8; pointer-events: none; transition: fill .18s; }
    .mc-name.on { fill: #2b2418; opacity: .72; }
    .mc-title { font-family: Georgia, "Times New Roman", serif; font-style: italic; font-weight: 700; fill: var(--ink); letter-spacing: .04em; }
    .mc-flash { fill: rgba(255, 209, 102, .45); stroke: var(--gold); animation: mcflash .8s ease-in-out 4; pointer-events: none; }
    .mc-flash.ring { fill: rgba(108, 123, 255, .3); stroke: var(--accent); }
    @keyframes mcflash { 50% { opacity: .25; } }
    .mc-ring { fill: rgba(108, 123, 255, .12); stroke: var(--accent); stroke-dasharray: 6 5; pointer-events: none; }
    .mc-hub { fill: rgba(255, 209, 102, .25); stroke: var(--gold); opacity: .95; pointer-events: none; animation: mcflash 1.2s ease-in-out infinite; }
    .mc.solved .mc-out { stroke: var(--green); }
    .mc-chips { display: flex; flex-wrap: wrap; gap: 6px; width: 100%; }
    .mc-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 9px 5px 6px; border-radius: 999px; border: 1.5px solid var(--line); background: var(--panel-2); color: var(--text); font: 600 .85rem "Segoe UI", system-ui, sans-serif; cursor: pointer; }
    .mc-chip i { width: 18px; height: 18px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgba(0,0,0,.25); display: inline-block; }
    .mc-chip i.cyc { background: conic-gradient(#f2a0a6 0 25%, #f5d27a 0 50%, #9fd3a4 0 75%, #9cc6f0 0); }
    .mc-chip i.era { background: repeating-linear-gradient(45deg, var(--panel) 0 3px, var(--faint) 3px 5px); }
    .mc-chip kbd { font-size: .7rem; color: var(--muted); border: 1px solid var(--line); border-radius: 4px; padding: 0 4px; }
    .mc-chip:hover { border-color: var(--accent); }
    .mc-chip.on { border-color: var(--gold); box-shadow: 0 0 0 2px rgba(255, 209, 102, .35); background: var(--panel-3); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
