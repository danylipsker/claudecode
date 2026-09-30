/* The Puzzle Cabinet · engines/divide.js
 *
 * Cut a shape made of squares into k congruent parts — the same size and
 * shape, turning and turning over allowed — along the grid lines. The player
 * colours the squares, one colour per part.
 *
 * data: {
 *   sol:  ['aab.', 'abbc', ...]   the shape; each square marked with its part in one
 *                                  solution ('a', 'b', …); '.' is outside the shape
 *   part: '##|#.'                  optional (rep-tiles): every part must be a copy of this shape
 *   noMirror: true                 optional: parts may turn but not turn over
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const S = (tag, attrs, parent) => C.s(tag, attrs, parent);
  const K = (x, y) => x + ',' + y;
  const LET = 'ABCDEFGHIJKLMNOP';
  const MARKS = 'abcdefghijklmnop';
  const COLORS = ['#ff8787', '#4dabf7', '#ffd43b', '#69db7c', '#b197fc', '#ffa94d', '#3bc9db', '#f783ac', '#a9e34b', '#748ffc', '#e8a87c', '#20c997', '#da77f2', '#fab005', '#91a7ff', '#c0eb75'];
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen'];

  // the puzzle: its squares (sorted by row, then column), the stored parts
  function model(p) {
    const Po = C.Polyo, d = p.data;
    const g = Po.grid(d.sol);
    const cells = [];
    g.forEach((ch, k) => cells.push(k.split(',').map(Number)));
    cells.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    const idx = new Map(cells.map((c, i) => [K(c[0], c[1]), i]));
    const marks = Array.from(new Set(cells.map((c) => g.get(K(c[0], c[1]))))).sort();
    const parts = marks.map((m) => cells.filter((c) => g.get(K(c[0], c[1])) === m));
    const solOf = cells.map((c) => marks.indexOf(g.get(K(c[0], c[1]))));
    const k = parts.length, n = cells.length / Math.max(1, k);
    const part = d.part ? Po.norm(Po.parse(d.part)) : null;
    const alts = (d.alt || []).map((r) => Po.norm(Po.parse(r)));
    return { cells, idx, parts, solOf, k, n, part, alts, free: !d.noMirror };
  }

  /* ---------- making puzzles (the generator and the endless drawer share this) ---------- */

  // a random polyomino of n squares without holes
  function randomPoly(rng, n) {
    const Po = C.Polyo;
    for (let tries = 0; tries < 50; tries++) {
      const cells = [[0, 0]], set = new Set(['0,0']);
      while (cells.length < n) {
        const c = rng.pick(cells), d = rng.pick(Po.NB);
        const q = [c[0] + d[0], c[1] + d[1]], kq = K(q[0], q[1]);
        if (set.has(kq)) continue;
        set.add(kq); cells.push(q);
      }
      if (!Po.holes(cells)) return Po.norm(cells);
    }
    return null;
  }
  const isRect = (cells) => { const b = C.Polyo.bbox(cells); return b.w * b.h === cells.length; };

  /* k copies of a random n-square piece laid together; kept only when exactly one
   * piece shape cuts the result into k congruent parts.
   * -> { region, placements, count, capped, part } or null */
  function makeDivide(rng, k, n, opts) {
    const Po = C.Polyo;
    opts = opts || {};
    const P = randomPoly(rng, n);
    if (!P || (isRect(P) && n > 2 && !opts.allowRect)) return null;
    const shapes = [];
    for (let i = 0; i < k; i++) shapes.push(P);
    const g = Po.grow(shapes, rng, { aspect: 1 + rng() * 0.6, beta: opts.beta || 1.1 });
    if (!g || Po.holes(g.region) || isRect(g.region)) return null;
    const res = Po.divide(g.region, k, { limit: opts.limit || 30, maxShapes: 2, visitLimit: opts.visitLimit || 2e5, nodeLimit: 2e5 });
    if (res.aborted || res.length !== 1) return null;
    const r = res[0];
    if (isRect(r.part) && n > 2 && !opts.allowRect) return null;
    const L = Po.landscape(g.region, r.sol.map((cells, i) => ({ piece: i, cells })));
    return { region: L.region, placements: L.placements, count: r.count, capped: r.capped, part: r.part };
  }

  // how hard: bigger parts and more of them are harder; a unique cutting is harder to find
  function gradeDivide(k, n, count, capped) {
    let e = n + 2 * (k - 2);
    if (count === 1 && !capped) e += 1;
    if (count >= 8 || capped) e -= 1;
    return e <= 5 ? 1 : e <= 7 ? 2 : e <= 9 ? 3 : e <= 11 ? 4 : 5;
  }

  const FIELDS = ['Acre', 'Allotment', 'Barnyard', 'Glebe', 'Paddock', 'Pasture', 'Croft', 'Orchard', 'Vineyard', 'Common', 'Heath', 'Moor', 'Fen', 'Copse', 'Spinney', 'Coppice', 'Homestead', 'Grange', 'Manor', 'Smallholding', 'Kitchen Garden', 'Rose Garden', 'Herb Garden', 'Hayfield', 'Cornfield', 'Barley Field', 'Hop Garden', 'Cherry Orchard', 'Pear Orchard', 'Mill Pond', 'Water Meadow', 'Sheepfold', 'Goose Green', 'Duck Pond', 'Rabbit Warren', 'Tithe Barn', 'Parsonage', 'Village Green', 'Market Square', 'Bowling Green', 'Croquet Lawn', 'Parterre', 'Knot Garden', 'Lily Pond', 'Walled Garden', 'Glasshouse', 'Seedbed', 'Strawberry Bed', 'Asparagus Bed', 'Pumpkin Patch', 'Potato Field', 'Flax Field', 'Lavender Field', 'Tulip Field', 'Sunflower Field', 'Tea Terrace', 'Olive Grove', 'Lemon Grove', 'Orange Grove', 'Almond Grove', 'Walnut Grove', 'Chestnut Grove', 'Beech Wood', 'Birch Wood', 'Willow Bed', 'Reed Bed', 'Salt Marsh', 'Shingle Bank', 'Oyster Bed', 'Boatyard', 'Timber Yard', 'Brickfield', 'Clay Pit', 'Gravel Pit', 'Chalk Pit', 'Peat Bog', 'Fern Gully', 'Hill Farm', 'Valley Farm', 'Home Farm', 'Top Field', 'Long Acre', 'Ten Acre', 'Five Acre', 'Hundred Acre', 'Broad Field', 'Crooked Field', 'Hanging Field', 'Stony Field', 'Windy Field', 'Sunny Bank', 'Shady Nook', 'Bluebell Wood', 'Primrose Bank', 'Cowslip Meadow', 'Buttercup Meadow', 'Daisy Field', 'Poppy Field', 'Clover Field', 'Cabbage Patch', 'Turnip Field', 'Hazel Copse', 'Holly Hedge', 'Orchard Corner', 'Mill Lane', 'Church Close', 'Pound Field', 'Gallows Hill', 'Cuckoo Pen', 'Nightingale Wood', 'Owl\'s Barn', 'Fox Covert', 'Badger Bank', 'Otter Pool', 'Heron Marsh', 'Swan Reach', 'Kingfisher Bend', 'Cider Orchard', 'Plum Orchard', 'Quince Garden', 'Medlar Corner', 'Mulberry Garden', 'Fig Wall', 'Vine House', 'Bee Garden', 'Dovecote Field', 'Pigeon Close', 'Rookery', 'Heronry', 'Warren Hill', 'Beacon Hill', 'Windmill Hill', 'Watermill Meadow', 'Ferry Field', 'Ford Meadow', 'Bridge Close', 'Lock Keeper\'s Garden', 'Ploughed Field', 'Stubble Field', 'Fallow Field'];
  const TEXTS = [
    (k) => 'Cut the shape into ' + NUMW[k] + ' identical pieces.',
    (k) => 'Share this field among ' + NUMW[k] + ' heirs: the plots must be the same size and the same shape.',
    (k) => 'Divide the shape along the grid lines into ' + NUMW[k] + ' congruent parts.',
    (k) => 'The will leaves the field to ' + NUMW[k] + ' children, in shares equal in size and in shape. Draw the boundaries.',
    (k) => 'Split it into ' + NUMW[k] + ' matching pieces — turning a piece over is allowed.'
  ];
  const HALVES = ['Cut the shape into two identical halves.', 'Two brothers, one field: split it into two plots of the same shape and size.', 'Find the cut that makes two congruent halves.'];
  function divideText(rng, k) { return k === 2 && rng() < 0.6 ? rng.pick(HALVES) : rng.pick(TEXTS)(k); }
  // parts and sizes per level for the endless drawer
  const LEVELS = [null,
    [[2, 4], [2, 5], [3, 3]],
    [[2, 6], [2, 7], [3, 4], [3, 5], [4, 3]],
    [[2, 8], [3, 6], [4, 4], [4, 5]],
    [[2, 9], [3, 7], [4, 6], [5, 5]],
    [[2, 10], [4, 7], [5, 6], [6, 5]]
  ];
  C.divideMaker = { randomPoly, makeDivide, gradeDivide, divideText, FIELDS, LEVELS, isRect };

  C.engine({
    id: 'divide',
    name: 'Cut into equal parts',
    deps: ['js/lib/dlx.js', 'js/lib/polyo.js'],
    generates: ['divide-congruent'],

    // endless: k copies of a random piece, kept when the cutting is unique in shape
    generate(rng, level) {
      const Po = C.Polyo;
      for (let tries = 0; tries < 40; tries++) {
        const kn = rng.pick(LEVELS[level]);
        const r = makeDivide(rng, kn[0], kn[1], { visitLimit: 6e4, limit: 12 });
        if (!r) continue;
        return {
          title: 'The ' + rng.pick(FIELDS),
          text: divideText(rng, kn[0]),
          diff: level,
          tags: ['endless'],
          data: { sol: Po.solRows(r.region, r.placements, MARKS) }
        };
      }
      return null;
    },
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    noMoves: true,
    about: 'Cut the shape along the grid lines into parts that are all **the same size and shape** — a part may be turned round or turned over. Colour the squares, one colour for each part: pick a colour from the dots under the figure (or beside the puzzle text, or press **1**–**9**), then click or drag across squares. Clicking a square that already has the colour rubs it out; **Alt**-click picks up a square\'s colour. Thick lines show where parts meet, and each part shows its letter and size. When a part reaches the right size, the brush moves on to a fresh colour by itself.',

    verify(p) {
      const Po = C.Polyo;
      if (!Po) return { ok: false, err: 'js/lib/polyo.js is needed' };
      const d = p.data;
      if (!d || !Array.isArray(d.sol)) return { ok: false, err: 'data.sol is needed' };
      const m = model(p);
      if (m.k < 2) return { ok: false, err: 'fewer than two parts' };
      if (m.k > LET.length) return { ok: false, err: 'more than ' + LET.length + ' parts' };
      if (m.cells.length % m.k) return { ok: false, err: 'the squares do not share out evenly' };
      const key0 = Po.canon(m.parts[0], m.free);
      for (let i = 0; i < m.k; i++) {
        const pc = m.parts[i];
        if (pc.length !== m.n) return { ok: false, err: 'part ' + LET[i] + ' has ' + pc.length + ' squares, not ' + m.n };
        if (!Po.connected(pc)) return { ok: false, err: 'part ' + LET[i] + ' is not connected' };
        if (Po.canon(pc, m.free) !== key0) return { ok: false, err: 'part ' + LET[i] + ' has another shape' };
      }
      if (m.part && Po.canon(m.part, m.free) !== key0) return { ok: false, err: 'the parts are not copies of data.part' };
      if (!Po.connected(m.cells)) return { ok: false, err: 'the shape is in pieces' };
      for (const a of m.alts) {
        if (a.length !== m.n || !Po.connected(a)) return { ok: false, err: 'an alt shape has the wrong size' };
        if (!Po.tile(m.cells, a, m.free, 1, 2e5).count) return { ok: false, err: 'an alt shape does not cut the figure' };
      }
      return { ok: true };
    },

    mount(ctx, p) {
      const Po = C.Polyo, wb = ctx.wb, d = p.data;
      const m = model(p);
      const N = m.cells.length, k = m.k, n = m.n;
      const paint = new Int8Array(N).fill(-1);
      let cur = 0;
      const partWord = m.part ? 'copies of the small shape' : 'parts of the same size and shape';
      if (!p.goal) ctx.setGoal('Cut the shape into ' + NUMW[k] + ' ' + partWord + ' (' + C.plural(n, 'square') + ' each).');

      /* ---------- the board ---------- */
      const bb = Po.bbox(m.cells);
      const board = wb.layer('board'), top = wb.layer('top');
      const g = S('g', { class: 'dv-board' }, board);
      const loops = Po.outline(m.cells).map((l) => C.pathOf(l)).join('');
      S('path', { d: loops, class: 'dv-shadow', 'fill-rule': 'evenodd' }, g);
      const rects = m.cells.map((c, i) => S('rect', { x: c[0], y: c[1], width: 1, height: 1, class: 'dv-cell', 'data-i': i }, g));
      const inner = Po.innerEdges(m.cells);
      S('path', { d: inner.map((e) => 'M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3]).join(''), class: 'dv-grid' }, g);
      const walls = S('path', { class: 'dv-wall' }, g);
      S('path', { d: loops, class: 'dv-edge', 'fill-rule': 'evenodd' }, g);
      const labels = S('g', { class: 'dv-labels' }, g);
      const hintG = S('g', { class: 'dv-hint' }, top);
      // the two squares on each side of every inner edge
      const pairs = inner.map((e) => {
        const vertical = e[0] === e[2];
        const a = vertical ? m.idx.get(K(e[0] - 1, e[1])) : m.idx.get(K(e[0], e[1] - 1));
        const b = vertical ? m.idx.get(K(e[0], e[1])) : m.idx.get(K(e[0], e[1]));
        return { e, a, b };
      });
      // a palette on the table, under the figure, so the colours are at hand on a phone too
      const W = bb.x1 - bb.x0 + 1, per = Math.max(5, Math.min(k + 1, Math.floor(W / 0.95)));
      const swR = 0.34, swGap = 0.9;
      const swatches = [];
      const palG = S('g', { class: 'dv-pal' }, board);
      for (let c = -1; c < k; c++) {
        const j = c + 1, rowN = Math.floor(j / per), col = j % per;
        const inRow = Math.min(per, k + 1 - rowN * per);
        const cx = bb.x0 + W / 2 + (col - (inRow - 1) / 2) * swGap, cy = bb.y1 + 1.75 + rowN * swGap;
        const sg = S('g', { class: 'dv-sw' + (c < 0 ? ' rub' : '') }, palG);
        S('circle', { cx, cy, r: swR + 0.09, class: 'dv-sw-ring' }, sg);
        S('circle', { cx, cy, r: swR, class: 'dv-sw-dot', fill: c < 0 ? 'var(--panel-3)' : COLORS[c] }, sg);
        const t = S('text', { x: cx, y: cy, 'font-size': 0.3, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'dv-sw-t' }, sg);
        t.textContent = c < 0 ? '×' : LET[c];
        swatches.push({ c, cx, cy, sg });
      }
      const palRows = Math.ceil((k + 1) / per);
      const palY1 = bb.y1 + 1.75 + (palRows - 1) * swGap + swR + 0.3;
      const palW = Math.min(per, k + 1) * swGap;
      wb.setBounds({ x0: Math.min(bb.x0, bb.x0 + W / 2 - palW / 2) - 0.7, y0: bb.y0 - 0.7, x1: Math.max(bb.x1 + 1, bb.x0 + W / 2 + palW / 2) + 0.7, y1: palY1 + 0.3 }, 0.06);

      /* ---------- the colour chips ---------- */
      const chips = [];
      const panel = ctx.h('div.dv-panel');
      const row = ctx.h('div.dv-chips');
      for (let c = 0; c < k; c++) {
        const b = ctx.h('button.dv-chip', { type: 'button', title: 'Part ' + LET[c] + (c < 9 ? ' (' + (c + 1) + ')' : ''), onclick: () => setColour(c) },
          ctx.h('i', { style: { background: COLORS[c] } }, LET[c]), ctx.h('span', ''));
        chips.push(b);
        row.appendChild(b);
      }
      const rub = ctx.h('button.dv-chip.rub', { type: 'button', title: 'Rub out (Delete)', onclick: () => setColour(-1) }, ctx.h('i', '×'), ctx.h('span', 'rub'));
      row.appendChild(rub);
      panel.appendChild(row);
      const info = ctx.h('div.dv-info');
      panel.appendChild(info);
      if (m.part) {
        const pb = Po.bbox(m.part);
        const sv = '<svg viewBox="-0.2 -0.2 ' + (pb.w + 0.4) + ' ' + (pb.h + 0.4) + '" width="' + Math.min(120, 22 * pb.w) + '" height="' + Math.min(90, 22 * pb.h) + '"><path d="' + Po.outline(m.part).map((l) => C.pathOf(l)).join('') + '" fill="' + COLORS[0] + '" stroke="rgba(0,0,0,.55)" stroke-width=".08" stroke-linejoin="round"/><path d="' + Po.innerEdges(m.part).map((e) => 'M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3]).join('') + '" stroke="rgba(0,0,0,.25)" stroke-width=".05"/></svg>';
        panel.appendChild(ctx.h('div.dv-part', ctx.h('span', 'Every part is a copy of:'), ctx.h('div', { html: sv })));
      }
      ctx.panel.appendChild(panel);
      function setColour(c) {
        cur = c;
        chips.forEach((b, i) => b.classList.toggle('on', i === c));
        rub.classList.toggle('on', c < 0);
        swatches.forEach((s) => s.sg.classList.toggle('on', s.c === c));
      }

      /* ---------- drawing ---------- */
      function comps() {
        const out = [];
        for (let c = 0; c < k; c++) {
          const cs = [];
          for (let i = 0; i < N; i++) if (paint[i] === c) cs.push(m.cells[i]);
          out.push({ n: cs.length, parts: cs.length ? Po.components(cs) : [] });
        }
        return out;
      }
      function redraw() {
        for (let i = 0; i < N; i++) {
          const v = paint[i];
          rects[i].style.fill = v >= 0 ? COLORS[v] : '';
          rects[i].classList.toggle('on', v >= 0);
        }
        let wd = '';
        pairs.forEach((q) => {
          const a = paint[q.a], b = paint[q.b];
          if (a !== b && (a >= 0 || b >= 0)) wd += 'M' + q.e[0] + ' ' + q.e[1] + 'L' + q.e[2] + ' ' + q.e[3];
        });
        walls.setAttribute('d', wd);
        labels.innerHTML = '';
        const cs = comps();
        cs.forEach((c, ci) => {
          c.parts.forEach((pc) => {
            const a = pc.slice().sort((u, v) => u[1] - v[1] || u[0] - v[0])[0];
            const bad = c.parts.length > 1 || pc.length > n;
            const done = !bad && pc.length === n;
            const t = S('text', { x: a[0] + 0.09, y: a[1] + 0.24, 'font-size': 0.25, class: 'dv-lab' + (bad ? ' bad' : done ? ' done' : '') }, labels);
            t.textContent = LET[ci] + ' ' + pc.length;
          });
        });
        chips.forEach((b, c) => {
          const x = cs[c];
          const ok = x.parts.length === 1 && x.n === n;
          b.classList.toggle('done', ok);
          b.classList.toggle('bad', x.parts.length > 1 || x.n > n);
          b.lastChild.textContent = x.n + '/' + n + (ok ? ' ✓' : '');
          swatches[c + 1].sg.classList.toggle('done', ok);
        });
        const left = paint.reduce((s, v) => s + (v < 0 ? 1 : 0), 0);
        info.innerHTML = C.md(NUMW[k].charAt(0).toUpperCase() + NUMW[k].slice(1) + ' parts of **' + n + '** squares' + (left ? ' · ' + C.plural(left, 'square') + ' still white' : ' · every square coloured'));
      }

      /* ---------- painting ---------- */
      let stroke = null;
      const cellAt = (pt) => m.idx.get(K(Math.floor(pt[0]), Math.floor(pt[1])));
      function apply(i) {
        const v = stroke.erase ? -1 : cur;
        if (paint[i] === v) return;
        paint[i] = v;
        stroke.changed = true;
        hintG.innerHTML = '';
        redraw();
      }
      wb.handlers.board = {
        down(pt, ev) {
          const sw = swatches.find((s) => G.dist(pt, [s.cx, s.cy]) < swGap / 2);
          if (sw) { setColour(sw.c); ctx.sfx('tap'); return true; }
          const i = cellAt(pt);
          if (i == null) return false;
          if (ev && ev.altKey) { if (paint[i] >= 0) setColour(paint[i]); return true; }
          stroke = { erase: cur < 0 || paint[i] === cur, changed: false, last: pt, colour: cur };
          apply(i);
          return true;
        },
        move(pt) {
          if (!stroke) return;
          const steps = Math.max(1, Math.ceil(G.dist(stroke.last, pt) / 0.25));
          for (let s = 1; s <= steps; s++) { const i = cellAt(G.lerp(stroke.last, pt, s / steps)); if (i != null) apply(i); }
          stroke.last = pt;
        },
        up() {
          const st = stroke;
          stroke = null;
          if (!st || !st.changed) return;
          // a finished part: move the brush on to a colour not used yet
          if (!st.erase && st.colour >= 0) {
            const c = comps()[st.colour];
            if (c.n === n && c.parts.length === 1) {
              const used = comps();
              let nx = -1;
              for (let j = 1; j <= k && nx < 0; j++) { const q = (st.colour + j) % k; if (!used[q].n) nx = q; }
              if (nx >= 0) setColour(nx);
            }
          }
          ctx.changed('cells');
        }
      };

      /* ---------- solutions ---------- */
      let tilings = null;
      function allTilings() {
        if (tilings) return tilings;
        const stored = m.parts.map((pc) => pc.map((c) => m.idx.get(K(c[0], c[1]))));
        tilings = [stored];
        [m.part || m.parts[0]].concat(m.alts).forEach((shape) => {
          const r = Po.tile(m.cells, shape, m.free, 300, 2e5);
          (r.all || []).forEach((t) => tilings.push(t.map((pc) => pc.map((c) => m.idx.get(K(c[0], c[1]))))));
        });
        return tilings;
      }
      // how badly a cutting disagrees with the colours so far
      function conflicts(t) {
        const partOf = new Int16Array(N);
        t.forEach((pc, j) => pc.forEach((i) => { partOf[i] = j; }));
        let bad = 0, good = 0, first = null;
        pairs.forEach((q) => {
          const a = paint[q.a], b = paint[q.b];
          if (a < 0 || b < 0) return;
          const same = a === b, sameT = partOf[q.a] === partOf[q.b];
          if (same !== sameT) { bad++; if (!first) first = { q, same }; } else if (same) good++;
        });
        for (let c = 0; c < k; c++) {
          const ps = new Set();
          for (let i = 0; i < N; i++) if (paint[i] === c) ps.add(partOf[i]);
          if (ps.size > 1) bad += ps.size - 1;
        }
        return { bad, good, first, partOf };
      }
      function best() {
        let bt = null, bc = null;
        allTilings().forEach((t) => {
          const c = conflicts(t);
          if (!bc || c.bad < bc.bad || (c.bad === bc.bad && c.good > bc.good)) { bt = t; bc = c; }
        });
        return { t: bt, c: bc };
      }
      function ring(list, cls) {
        hintG.innerHTML = '';
        list.forEach((cells) => Po.outline(cells).forEach((l) => S('path', { d: C.pathOf(l), class: cls }, hintG)));
        clearTimeout(ring.t);
        ring.t = setTimeout(() => { hintG.innerHTML = ''; }, 6000);
      }
      const cellsOf = (list) => list.map((i) => m.cells[i]);
      function partDone(pc) {
        const c = paint[pc[0]];
        if (c < 0 || !pc.every((i) => paint[i] === c)) return false;
        for (let i = 0; i < N; i++) if (paint[i] === c && !pc.includes(i)) return false;
        return true;
      }
      // the square with the fewest neighbours in the shape: parts through it are easiest to see
      function tightness(pc) {
        return Math.min.apply(null, pc.map((i) => {
          const c = m.cells[i];
          return [[1, 0], [-1, 0], [0, 1], [0, -1]].filter((dd) => m.idx.has(K(c[0] + dd[0], c[1] + dd[1]))).length;
        }));
      }

      function assign(t) {
        // colours for a cutting that keep as much of the player's colouring as possible
        const votes = [];
        t.forEach((pc, j) => {
          const cnt = new Map();
          pc.forEach((i) => { if (paint[i] >= 0) cnt.set(paint[i], (cnt.get(paint[i]) || 0) + 1); });
          cnt.forEach((v, c) => votes.push({ j, c, v }));
        });
        votes.sort((a, b) => b.v - a.v);
        const col = new Array(t.length).fill(-1), used = new Set();
        votes.forEach((x) => { if (col[x.j] < 0 && !used.has(x.c)) { col[x.j] = x.c; used.add(x.c); } });
        let free = 0;
        col.forEach((c, j) => { if (c < 0) { while (used.has(free)) free++; col[j] = free; used.add(free); } });
        return col;
      }

      setColour(0);
      redraw();
      const timers = [];

      return {
        check(manual) {
          const left = paint.reduce((s, v) => s + (v < 0 ? 1 : 0), 0);
          if (left) return { solved: false, msg: manual ? C.plural(left, 'square') + ' still to colour.' : '' };
          const cs = comps();
          const unused = cs.findIndex((c) => !c.n);
          if (unused >= 0) return { solved: false, msg: 'Colour ' + LET[unused] + ' is not used: every one of the ' + NUMW[k] + ' parts needs its own colour.' };
          const split = cs.findIndex((c) => c.parts.length > 1);
          if (split >= 0) return { solved: false, msg: 'Part ' + LET[split] + ' is in ' + NUMW[cs[split].parts.length] + ' separate pieces.' };
          const wrong = cs.findIndex((c) => c.n !== n);
          if (wrong >= 0) return { solved: false, msg: 'Part ' + LET[wrong] + ' has ' + C.plural(cs[wrong].n, 'square') + '; each part needs ' + n + '.' };
          const keys = cs.map((c) => Po.canon(c.parts[0], m.free));
          const odd = keys.findIndex((x) => x !== keys[0]);
          if (odd >= 0) return { solved: false, msg: 'Parts A and ' + LET[odd] + ' have the same size but not the same shape' + (m.free ? '' : ' (turning over is not allowed here)') + '.' };
          if (m.part && keys[0] !== Po.canon(m.part, m.free)) return { solved: false, msg: 'The parts match each other, but they must be copies of the small shape.' };
          const mirrored = m.free && new Set(cs.map((c) => Po.canon(c.parts[0], false))).size > 1;
          return { solved: true, msg: C.plural(k, 'identical part') + (mirrored ? ' — some of them turned over, which is allowed.' : '.') };
        },
        hint(i) {
          if (i === 0) {
            return 'Each of the ' + NUMW[k] + ' parts has **' + n + '** squares' + (m.part ? ' and is a copy of the small shape.' : ' (the whole shape has ' + N + ').');
          }
          const b = best();
          if (b.c.bad) {
            const f = b.c.first;
            if (f) return { text: 'This cannot be finished as it is: the two ringed squares should be ' + (f.same ? 'in different parts.' : 'in the same part.'), show() { ring([cellsOf([f.q.a]), cellsOf([f.q.b])], 'dv-badring'); } };
            return 'This cannot be finished as it is: one colour is spread over squares that cannot all be in one part. Rub out a few squares.';
          }
          const todo = b.t.filter((pc) => !partDone(pc));
          if (!todo.length) return 'Every part is right — press Check.';
          todo.sort((x, y) => {
            const px = x.some((q) => paint[q] >= 0) ? 0 : 1, py = y.some((q) => paint[q] >= 0) ? 0 : 1;
            return px - py || tightness(x) - tightness(y) || x[0] - y[0];
          });
          const pc = todo[0];
          const started = pc.some((q) => paint[q] >= 0);
          return { text: started ? 'The part you have started can be finished like the dashed outline.' : 'One part can go where the dashed outline shows.', show() { ring([cellsOf(pc)], 'dv-hintpoly'); } };
        },
        solve() {
          hintG.innerHTML = '';
          const t = best().t;
          const col = assign(t);
          const want = new Int8Array(N);
          t.forEach((pc, j) => pc.forEach((q) => { want[q] = col[j]; }));
          // rub out the colours that disagree, then paint the missing parts one at a time
          for (let i = 0; i < N; i++) if (paint[i] >= 0 && paint[i] !== want[i]) paint[i] = -1;
          redraw();
          const order = t.map((pc, j) => j).filter((j) => !t[j].every((q) => paint[q] === want[q]));
          let step = 0;
          const next = () => {
            if (step >= order.length) { redraw(); ctx.changed('solve'); return; }
            const j = order[step++];
            t[j].forEach((q) => { paint[q] = col[j]; });
            redraw();
            timers.push(setTimeout(next, C.anim(Math.max(60, 900 / Math.max(1, order.length)))));
          };
          timers.push(setTimeout(next, C.anim(150)));
        },
        getState() { return { p: Array.from(paint, (v) => (v < 0 ? '.' : MARKS[v])).join(''), c: cur }; },
        setState(s) {
          if (!s || typeof s.p !== 'string') return;
          for (let i = 0; i < N; i++) { const v = MARKS.indexOf(s.p[i]); paint[i] = v >= 0 && v < k ? v : -1; }
          if (s.c != null && s.c < k) setColour(s.c);
          hintG.innerHTML = '';
          redraw();
        },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
          const v = parseInt(ev.key, 10);
          if (v >= 1 && v <= Math.min(9, k)) { setColour(v - 1); return true; }
          if (ev.key === 'Delete' || ev.key === 'Backspace') { setColour(-1); return true; }
          return false;
        },
        destroy() {
          timers.forEach(clearTimeout);
          clearTimeout(ring.t);
          wb.handlers.board = null;
        }
      };
    },

    thumb(p) {
      const Po = C.Polyo;
      if (!Po) return '';
      const m = model(p);
      const b = Po.bbox(m.cells);
      const pad = 0.6, s = Math.max(b.w, b.h);
      let out = '<svg viewBox="' + (b.x0 - pad) + ' ' + (b.y0 - pad) + ' ' + (b.w + 2 * pad) + ' ' + (b.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
      const loops = Po.outline(m.cells).map((l) => C.pathOf(l)).join('');
      out += '<path d="' + loops + '" fill="var(--ink-2)" fill-opacity=".2" fill-rule="evenodd"/>';
      out += '<path d="' + Po.innerEdges(m.cells).map((e) => 'M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3]).join('') + '" stroke="var(--ink-2)" stroke-opacity=".28" stroke-width="' + (0.035 * s / 4 + 0.03) + '"/>';
      out += '<path d="' + loops + '" fill="none" stroke="var(--ink-2)" stroke-width="' + (0.05 * s / 4 + 0.07) + '" stroke-linejoin="round"/>';
      const r = Math.max(0.55, s * 0.13);
      out += '<circle cx="' + (b.x1 + 1 + pad - r * 1.05) + '" cy="' + (b.y0 - pad + r * 1.05) + '" r="' + r + '" fill="var(--gold)"/>';
      out += '<text x="' + (b.x1 + 1 + pad - r * 1.05) + '" y="' + (b.y0 - pad + r * 1.05) + '" font-size="' + (r * 1.05) + '" font-weight="800" text-anchor="middle" dominant-baseline="central" fill="#1b2140">' + m.k + '</text>';
      return out + '</svg>';
    }
  });

  C.divideModel = model;
  C.divideColors = COLORS;

  C.css('divide', `
    .dv-shadow { fill: var(--board); filter: drop-shadow(0 .06px .12px rgba(0,0,0,.4)); }
    .dv-cell { fill: var(--board-2); cursor: pointer; }
    .dv-cell:hover { fill: color-mix(in srgb, var(--board-2) 70%, var(--accent)); }
    .dv-cell.on:hover { filter: brightness(1.08); }
    .dv-grid { stroke: var(--grid-2); stroke-width: .035; fill: none; pointer-events: none; }
    .dv-wall { stroke: rgba(12, 14, 30, .88); stroke-width: .1; stroke-linecap: round; fill: none; pointer-events: none; }
    [data-theme="light"] .dv-wall { stroke: rgba(20, 20, 40, .85); }
    .dv-edge { fill: none; stroke: var(--ink-2); stroke-width: .1; stroke-linejoin: round; pointer-events: none; }
    .dv-lab { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: rgba(0, 0, 0, .55); pointer-events: none; dominant-baseline: central; }
    .dv-lab.done { fill: rgba(0, 0, 0, .8); }
    .dv-lab.bad { fill: #b00020; }
    .dv-hintpoly { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .1; stroke-dasharray: .22 .14; stroke-linejoin: round; pointer-events: none; animation: dvpulse 1s ease-in-out infinite; }
    .dv-badring { fill: rgba(255, 90, 90, .18); stroke: var(--red); stroke-width: .1; stroke-dasharray: .2 .12; pointer-events: none; animation: dvpulse 1s ease-in-out infinite; }
    @keyframes dvpulse { 50% { opacity: .45; } }
    .dv-sw { cursor: pointer; }
    .dv-sw-ring { fill: none; stroke: transparent; stroke-width: .07; }
    .dv-sw.on .dv-sw-ring { stroke: var(--accent); }
    .dv-sw-dot { stroke: rgba(0, 0, 0, .35); stroke-width: .03; }
    .dv-sw-t { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 800; fill: rgba(0, 0, 0, .7); pointer-events: none; }
    .dv-sw.rub .dv-sw-t { fill: var(--muted); }
    .dv-sw.done .dv-sw-dot { stroke: var(--green); stroke-width: .07; }
    .dv-panel { margin: 10px 0 4px; }
    .dv-chips { display: flex; flex-wrap: wrap; gap: 6px; }
    .dv-chip { display: inline-flex; align-items: center; gap: 6px; padding: 3px 9px 3px 3px; border-radius: 999px; border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: inherit; font-size: .78rem; cursor: pointer; }
    .dv-chip i { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-style: normal; font-weight: 800; font-size: .72rem; color: rgba(0, 0, 0, .7); }
    .dv-chip.rub i { background: var(--panel-3); color: var(--muted); font-size: .95rem; }
    .dv-chip span { color: var(--muted); font-variant-numeric: tabular-nums; min-width: 2.2em; }
    .dv-chip.on { border-color: var(--accent); box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent); }
    .dv-chip.done span { color: var(--green); font-weight: 700; }
    .dv-chip.bad span { color: var(--red); font-weight: 700; }
    .dv-info { margin-top: 8px; font-size: .8rem; color: var(--muted); }
    .dv-part { margin-top: 8px; display: flex; align-items: center; gap: 10px; font-size: .8rem; color: var(--muted); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
