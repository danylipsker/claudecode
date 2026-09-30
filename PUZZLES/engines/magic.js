/* The Puzzle Cabinet · engines/magic.js
 *
 * Magic figures: squares, triangles, stars, the magic hexagon, wheels, rings,
 * and their contrary cousins (every line different; no neighbours in a row).
 * Number tiles wait in a tray; drag them onto the circles (or click a tile and
 * then a circle, or pick a circle and type the number). Every line shows its
 * running total, green when it is right. The figures, the solver, the
 * reasoning behind the hints and the puzzle maker live in js/lib/magic.js
 * (Cabinet.Magic); see it for p.data.
 *
 * The engine state: { a: the number the player has put in each slot (0 = none) }.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const SOLVED = ['Every line balances.', 'Magic, and no trickery.', 'The turtle would be proud.', 'Sums in perfect harmony.', 'All lines agree.'];

  // world scale for each kind of figure: units → pixels of the board, slot radius
  function scaleOf(F) {
    if (F.kind === 'square') { const S = F.n >= 6 ? 62 : F.n === 5 ? 76 : F.n === 4 ? 88 : 104; return { S, r: S * 0.44, cell: true }; }
    if (F.kind === 'graph') return { S: F.d.scale || 110, r: 27 };
    if (F.kind === 'hexagon') return { S: 110, r: 38, hex: true };
    if (F.kind === 'star') return { S: F.points >= 7 ? 190 : 170, r: 27 };
    if (F.kind === 'polygon' && F.k >= 5) return { S: 190, r: 25 };
    return { S: 165, r: 29 };
  }

  function goalOf(F) {
    const what = F.kind === 'square' ? (F.franklin ? 'row, column and bent diagonal' : 'row, column and diagonal') : F.kind === 'polygon' ? 'side' : F.kind === 'star' || F.kind === 'hexagon' ? 'line' : F.kind === 'wheel' ? 'line through the middle' : 'line';
    if (F.rule === 'sum') return 'Every ' + what + ' adds up to **' + F.target + '**.';
    if (F.rule === 'prod') return 'The numbers in every ' + what + ' multiply to **' + F.target + '**.';
    if (F.rule === 'hetero') return 'Every ' + what + ' adds up to a **different** total.';
    if (F.rule === 'anti') return 'The ' + F.lines.length + ' line totals are all different and make a run of consecutive numbers.';
    if (F.rule === 'apart') return 'No two numbers joined by a line are **consecutive** (like 4 and 5).';
    return '';
  }

  /* ---------- thumbnails (and the board shares the drawing of lines) ---------- */

  function skeleton(F, sc) {
    // the drawn lines of a figure: segments between neighbouring slots, the rings, the edges
    const seg = [];
    const P = (i) => [F.slots[i][0] * sc.S, F.slots[i][1] * sc.S];
    if (F.kind === 'square' || F.kind === 'hexagon') return { seg, rings: [] };
    if (F.rule === 'apart' && F.edges) F.edges.forEach(([a, b]) => seg.push([P(a), P(b)]));
    else if (F.edges) F.edges.forEach(([a, b]) => seg.push([P(a), P(b)]));
    const rings = (F.rings || []).map(([x, y, r]) => [x * sc.S, y * sc.S, r * sc.S]);
    if (F.kind === 'wheel') rings.push([0, 0, F.rim * sc.S]);
    return { seg, rings };
  }

  function hexPath(cx, cy, r) {
    let d = '';
    for (let i = 0; i < 6; i++) { const a = Math.PI / 6 + i * Math.PI / 3; d += (i ? 'L' : 'M') + (cx + Math.cos(a) * r).toFixed(1) + ' ' + (cy + Math.sin(a) * r).toFixed(1); }
    return d + 'Z';
  }

  C.engine({
    id: 'magic',
    name: 'Magic figures',
    deps: ['js/lib/magic.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Put the numbers from the tray into the empty circles (or cells) so that every line keeps the rule. **Drag** a tile onto a place — dropping it on a taken place swaps the two — or **click** a tile and then a place. You can also pick a place and **type** its number; **Backspace** sends it back to the tray, and so does a double-click or a drag off the figure.\n\n' +
      'Every line shows its running total: grey while it is still open, **green** when it is right, **red** when it has gone wrong. Printed numbers are fixed. Hints name the next number that can be worked out and why (where the puzzle has one answer); where any arrangement that keeps the rule is accepted, they show one way to go on.',

    generate(rng, level, meta) {
      const M = C.Magic;
      if (!M) return null;
      const kind = meta && meta.id === 'magic-squares' ? 'squares' : 'figures';
      const x = M.make(rng, level, kind);
      if (!x) return null;
      const F = M.figure(x.d);
      const w = madeWords(F, x.d);
      return { title: w.title, text: w.text, diff: level, tags: w.tags, data: x.d };
    },
    generates: ['magic-squares', 'magic-figures'],

    verify(p) {
      const M = C.Magic;
      if (!M) return { ok: false, err: 'js/lib/magic.js is not loaded' };
      const d = p.data;
      let F;
      try { F = M.figure(d); } catch (e) { return { ok: false, err: 'bad figure: ' + e.message }; }
      if (F.nums.length !== F.N) return { ok: false, err: 'the tray must hold one number per place (' + F.N + ')' };
      if (new Set(F.nums).size !== F.nums.length) return { ok: false, err: 'the numbers must all be different' };
      if (!Array.isArray(d.sol) || d.sol.length !== F.N) return { ok: false, err: 'sol must give a number for every place' };
      if (d.sol.slice().sort((a, b) => a - b).join() !== F.nums.join()) return { ok: false, err: 'sol does not use the tray numbers' };
      for (const s in F.givens) if (d.sol[s] !== F.givens[s]) return { ok: false, err: 'a given disagrees with sol at ' + s };
      if ((F.rule === 'sum' || F.rule === 'prod') && F.target == null) return { ok: false, err: 'a target is needed' };
      const pr = M.problems(F, d.sol);
      if (!pr.ok) return { ok: false, err: 'the stored arrangement breaks the rule' };
      if (d.any) return { ok: true };
      const r = M.count(F, { limit: 2, nodeLimit: 4e6 });
      if (r.aborted) return { ok: false, err: 'the solver gave up' };
      if (r.n !== 1) return { ok: false, err: r.n ? 'more than one arrangement fits' : 'no arrangement fits' };
      if (r.first.join() !== d.sol.join()) return { ok: false, err: 'the one arrangement is not the stored one' };
      return { ok: true };
    },

    thumb(p) {
      const M = C.Magic;
      if (!M) return '';
      const F = M.figure(p.data), sc = scaleOf(F);
      const b = F.box.map((v) => v * sc.S);
      let s = '<svg viewBox="' + b[0] + ' ' + b[1] + ' ' + (b[2] - b[0]) + ' ' + (b[3] - b[1]) + '" preserveAspectRatio="xMidYMid meet">';
      const sk = skeleton(F, sc);
      sk.rings.forEach(([x, y, r]) => { s += '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="none" stroke="var(--ink-2)" stroke-width="' + sc.r * 0.14 + '" opacity=".6"/>'; });
      sk.seg.forEach(([a, c]) => { s += '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + c[0].toFixed(1) + ' ' + c[1].toFixed(1) + '" stroke="var(--ink-2)" stroke-width="' + sc.r * 0.14 + '" opacity=".6"/>'; });
      F.slots.forEach(([x0, y0], i) => {
        const x = x0 * sc.S, y = y0 * sc.S, g = F.givens[i];
        if (sc.cell) s += '<rect x="' + (x - sc.S / 2 + 3) + '" y="' + (y - sc.S / 2 + 3) + '" width="' + (sc.S - 6) + '" height="' + (sc.S - 6) + '" rx="' + sc.S * 0.12 + '" fill="' + (g ? 'var(--board-2)' : 'var(--cell)') + '" stroke="var(--ink-2)" stroke-width="' + sc.S * 0.04 + '"/>';
        else if (sc.hex) s += '<path d="' + hexPath(x, y, sc.S * 0.47) + '" fill="' + (g ? 'var(--board-2)' : 'var(--cell)') + '" stroke="var(--ink-2)" stroke-width="4"/>';
        else s += '<circle cx="' + x + '" cy="' + y + '" r="' + sc.r + '" fill="' + (g ? 'var(--gold)' : 'var(--cell)') + '" stroke="var(--ink-2)" stroke-width="' + sc.r * 0.12 + '"/>';
        if (g) s += '<text x="' + x + '" y="' + (y + sc.r * 0.36) + '" font-size="' + sc.r * (g > 99 ? 0.75 : 1.05) + '" font-weight="700" text-anchor="middle" font-family="Segoe UI, system-ui, sans-serif" fill="var(--ink)">' + g + '</text>';
      });
      return s + '</svg>';
    },

    mount(ctx, p) { return mountMagic(ctx, p); }
  });

  // titles and statements for made puzzles (the generator uses the same words)
  function madeWords(F, d) {
    const nG = (d.givens || []).length;
    const nums = F.nums, run = nums.every((v, i) => !i || v - nums[i - 1] === nums[1] - nums[0]);
    const range = run && nums[1] - nums[0] === 1 ? nums[0] + ' to ' + nums[nums.length - 1] : run ? nums.slice(0, 3).join(', ') + ' … ' + nums[nums.length - 1] + ' (going up by ' + (nums[1] - nums[0]) + ')' : nums.join(', ');
    const given = nG ? ' ' + (nG === 1 ? 'One number is' : nG + ' numbers are') + ' already in place, and with them there is just one way to finish.' : '';
    if (F.kind === 'square') {
      return { title: 'Magic square ' + F.n + ' × ' + F.n + ' · ' + F.target, tags: ['square'],
        text: 'Put the numbers ' + range + ' into the ' + F.n + ' × ' + F.n + ' square so that every row, every column and both diagonals add up to **' + F.target + '**.' + given };
    }
    const nm = { polygon: F.sides === 3 ? 'triangle' : F.sides === 4 ? 'square frame' : F.sides === 5 ? 'pentagon' : 'figure', star: F.points + '-pointed star', hexagon: 'hexagon', wheel: 'wheel' }[F.kind] || 'figure';
    const lines = F.kind === 'polygon' ? 'every side' : F.kind === 'wheel' ? 'every line through the hub' : 'every line';
    return { title: 'Magic ' + nm + ' · ' + F.target, tags: [F.kind === 'polygon' && F.sides === 3 ? 'triangle' : F.kind],
      text: 'Put the numbers ' + range + ' into the ' + (F.kind === 'hexagon' ? 'cells' : 'circles') + ' of the ' + nm + ' so that ' + lines + ' adds up to **' + F.target + '**.' + given };
  }
  C.magicWords = madeWords;

  // the dots of the Lo Shu: odd numbers in white, even in black
  function dotsOf(v, r) {
    const out = [], k = Math.min(v, 12), rr = r * (k <= 3 ? 0.18 : k <= 6 ? 0.15 : 0.12);
    if (k === 1) out.push([0, 0]);
    else {
      const R = r * (k <= 4 ? 0.36 : 0.5);
      for (let i = 0; i < k; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / k; out.push([Math.cos(a) * R, Math.sin(a) * R]); }
    }
    return { pts: out, rr };
  }

  /* ---------- playing ---------- */

  function mountMagic(ctx, p) {
    const M = C.Magic, d = p.data, wb = ctx.wb, s = ctx.s, h = ctx.h;
    const F = M.figure(d), sc = scaleOf(F);
    const N = F.N, given = F.givens, S = sc.S, R = sc.r;
    let a = new Array(N).fill(0);
    let selSlot = -1, selTile = 0, busy = false, dead = false, timer = null, lastHint = null, hintEls = [];
    let typed = '', typedT = null, hoverLine = -1, drag = null, lastUp = { v: 0, t: 0 };
    const isGiven = (i) => given[i] != null;
    const valAt = (i) => isGiven(i) ? given[i] : a[i];
    const full = () => Array.from({ length: N }, (_, i) => valAt(i));

    ctx.setGoal(goalOf(F) + (d.any ? ' *Any arrangement that does this counts.*' : ''));

    /* geometry: the figure, then the tray underneath */
    const box = F.box.map((v) => v * S);
    const trayNums = F.nums.filter((v) => !Object.values(given).includes(v));
    const tileR = sc.cell ? S * 0.4 : R;
    const gap = tileR * 0.45, pitch = 2 * tileR + gap;
    const figW = box[2] - box[0];
    const perRow = Math.max(5, Math.min(trayNums.length, Math.floor((Math.max(figW, 8 * pitch)) / pitch)));
    const rows = Math.ceil(trayNums.length / perRow);
    const trayW = Math.min(trayNums.length, perRow) * pitch - gap;
    const cx = (box[0] + box[2]) / 2;
    const trayY0 = box[3] + tileR + 26;
    const trayPos = {};
    trayNums.forEach((v, i) => {
      const r = Math.floor(i / perRow), c = i % perRow;
      const inRow = Math.min(perRow, trayNums.length - r * perRow);
      const x0 = cx - (inRow * pitch - gap) / 2 + tileR;
      trayPos[v] = [x0 + c * pitch, trayY0 + r * pitch];
    });
    const trayBox = [cx - trayW / 2 - 14, trayY0 - tileR - 12, cx + trayW / 2 + 14, trayY0 + (rows - 1) * pitch + tileR + 12];
    const bx0 = Math.min(box[0], trayBox[0]), bx1 = Math.max(box[2], trayBox[2]);
    wb.setBounds({ x0: bx0 - 10, y0: box[1] - 10, x1: bx1 + 10, y1: trayBox[3] + 36 }, 0.04);
    const slotXY = (i) => [F.slots[i][0] * S, F.slots[i][1] * S];

    /* the board */
    const board = wb.layer('board'), topL = wb.layer('top');
    const g0 = s('g', { class: 'mg mg-' + F.kind }, board);
    const gSkel = s('g', { class: 'mg-nohit' }, g0);
    const gLineHl = s('g', { class: 'mg-nohit' }, g0);
    const gSlots = s('g', null, g0);
    const gBadges = s('g', null, g0);
    s('rect', { x: trayBox[0], y: trayBox[1], width: trayBox[2] - trayBox[0], height: trayBox[3] - trayBox[1], rx: 18, class: 'mg-tray' }, g0);
    s('text', { x: trayBox[0] + 12, y: trayBox[3] + 18, class: 'mg-traylbl', text: 'tray' }, g0);
    const gGhost = s('g', { class: 'mg-nohit' }, g0);
    const gTiles = s('g', null, g0);
    const gDrag = s('g', { class: 'mg-nohit' }, topL);

    // lines of the figure
    const sk = skeleton(F, sc);
    sk.rings.forEach(([x, y, r]) => s('circle', { cx: x, cy: y, r, class: 'mg-ring' }, gSkel));
    const edgeEls = sk.seg.map(([p0, p1]) => s('path', { d: 'M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + 'L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1), class: 'mg-seg' }, gSkel));
    if (F.kind === 'square' && !F.franklin) {
      const n = F.n;
      s('path', { d: 'M' + 0 + ' ' + 0 + 'L' + n * S + ' ' + n * S + 'M' + n * S + ' 0L0 ' + n * S, class: 'mg-diag' }, gBadges);
    }

    // places
    const slotEls = F.slots.map((pt, i) => {
      const [x, y] = [pt[0] * S, pt[1] * S];
      let el;
      if (sc.cell) el = s('rect', { x: x - S / 2 + 3, y: y - S / 2 + 3, width: S - 6, height: S - 6, rx: S * 0.12, class: 'mg-slot cell', 'data-key': 'mg' + i }, gSlots);
      else if (sc.hex) el = s('path', { d: hexPath(x, y, S * 0.47), class: 'mg-slot hex', 'data-key': 'mg' + i }, gSlots);
      else el = s('circle', { cx: x, cy: y, r: R + 3, class: 'mg-slot', 'data-key': 'mg' + i }, gSlots);
      return el;
    });

    // line totals
    const badges = F.lines.map((line, li) => {
      const [bx, by] = [F.badge[li][0] * S, F.badge[li][1] * S];
      const g = s('g', { class: 'mg-badge' }, gBadges);
      const w = sc.cell ? S * 0.62 : 44, hh = sc.cell ? S * 0.4 : 26;
      const rect = s('rect', { x: bx - w / 2, y: by - hh / 2, width: w, height: hh, rx: hh / 2 }, g);
      const t = s('text', { x: bx, y: by + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', style: 'font-size:' + (sc.cell ? Math.round(S * 0.24) : 15) + 'px' }, g);
      return { g, rect, t, x: bx, y: by, w, h: hh };
    });

    // ghosts in the tray, then the tiles themselves
    trayNums.forEach((v) => {
      const [x, y] = trayPos[v];
      if (sc.cell) s('rect', { x: x - tileR, y: y - tileR, width: 2 * tileR, height: 2 * tileR, rx: tileR * 0.3, class: 'mg-ghost' }, gGhost);
      else s('circle', { cx: x, cy: y, r: tileR, class: 'mg-ghost' }, gGhost);
      s('text', { x, y: y + 1, class: 'mg-ghostnum', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(v) }, gGhost);
    });
    function makeTile(v, parent, fixed) {
      const g = s('g', { class: 'mg-tile' + (fixed ? ' fixed' : '') }, parent);
      if (sc.cell) s('rect', { x: -tileR, y: -tileR, width: 2 * tileR, height: 2 * tileR, rx: tileR * 0.3, class: 'mg-disc' }, g);
      else if (sc.hex) s('path', { d: hexPath(0, 0, tileR * 1.08), class: 'mg-disc' }, g);
      else s('circle', { r: tileR, class: 'mg-disc' }, g);
      if (d.dots) {
        const q = dotsOf(v, tileR);
        q.pts.forEach(([x, y]) => s('circle', { cx: x, cy: y, r: q.rr, class: 'mg-dot ' + (v % 2 ? 'odd' : 'even') }, g));
      } else {
        const fs = tileR * (v >= 100 ? 0.78 : v >= 10 ? 0.92 : 1.05);
        s('text', { class: 'mg-num', 'text-anchor': 'middle', 'dominant-baseline': 'central', y: 1, style: 'font-size:' + fs.toFixed(1) + 'px', text: String(v) }, g);
      }
      return g;
    }
    const tileEls = {};
    trayNums.forEach((v) => { tileEls[v] = makeTile(v, gTiles, false); });
    for (const i in given) { const g = makeTile(given[i], gSlots, true); const [x, y] = slotXY(+i); g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')'); }

    /* the panel */
    const readout = h('div.mg-readout');
    const back = h('button.btn.small', { type: 'button', onclick: () => allBack() }, 'All back to the tray');
    ctx.panel.appendChild(h('div.mg-panel', readout, h('div.mg-row', back)));

    /* drawing */
    function where(v) { const i = a.indexOf(v); return i; }
    function draw() {
      const vals = full(), pr = M.problems(F, vals);
      const badLine = new Set(pr.bad);
      // tiles: in their slot or in the tray
      trayNums.forEach((v) => {
        const i = where(v), g = tileEls[v];
        if (drag && drag.v === v && drag.moved) return;
        const [x, y] = i >= 0 ? slotXY(i) : trayPos[v];
        g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        const inBad = i >= 0 && (F.slotLines[i].some((li) => badLine.has(li)) || pr.badEdges.some(([p0, p1]) => p0 === i || p1 === i));
        g.setAttribute('class', 'mg-tile' + (i >= 0 ? ' placed' : '') + (selTile === v ? ' sel' : '') + (inBad ? ' bad' : ''));
      });
      slotEls.forEach((el, i) => {
        const base = el.getAttribute('class').replace(/ (sel|hot|lit|given)/g, '');
        const lit = hoverLine >= 0 && F.lines[hoverLine] && F.lines[hoverLine].includes(i);
        el.setAttribute('class', base + (isGiven(i) ? ' given' : '') + (selSlot === i ? ' sel' : '') + (drag && drag.hover === i ? ' hot' : '') + (lit ? ' lit' : ''));
      });
      // edges that join consecutive numbers (the "apart" rule)
      if (F.rule === 'apart' && F.edges) {
        F.edges.forEach(([p0, p1], k) => {
          const bad = vals[p0] && vals[p1] && Math.abs(vals[p0] - vals[p1]) === 1;
          if (edgeEls[k]) edgeEls[k].setAttribute('class', 'mg-seg' + (bad ? ' bad' : vals[p0] && vals[p1] ? ' ok' : ''));
        });
      }
      // line totals
      const selLines = selSlot >= 0 ? new Set(F.slotLines[selSlot]) : new Set();
      let done = 0;
      badges.forEach((b, li) => {
        const line = F.lines[li];
        const have = line.filter((i) => vals[i]).map((i) => vals[i]);
        const complete = have.length === line.length;
        const tot = F.rule === 'prod' ? have.reduce((x, y) => x * y, 1) : have.reduce((x, y) => x + y, 0);
        let cls = 'mg-badge';
        if (!have.length) { b.t.textContent = F.rule === 'sum' || F.rule === 'prod' ? String(F.target) : '·'; cls += ' empty'; }
        else {
          b.t.textContent = String(tot) + (complete ? '' : '…');
          if (complete && !badLine.has(li) && (F.rule === 'sum' || F.rule === 'prod' || F.rule === 'hetero' || F.rule === 'anti')) { cls += ' ok'; done++; }
          else if (badLine.has(li) || (F.rule === 'sum' && tot > F.target) || (F.rule === 'prod' && F.target % tot)) cls += ' bad';
          else cls += ' part';
        }
        if (selLines.has(li) || hoverLine === li) cls += ' lit';
        b.g.setAttribute('class', cls);
      });
      // the read-out
      const placed = vals.filter((v) => v).length;
      let rd = '<b>' + placed + '</b> of ' + N + ' placed';
      if (F.rule === 'sum' || F.rule === 'prod' || F.rule === 'hetero' || F.rule === 'anti') rd += ' · <b>' + done + '</b> of ' + F.lines.length + ' lines ' + (F.rule === 'sum' ? 'make ' + F.target : F.rule === 'prod' ? 'make ' + F.target : 'finished');
      if (F.rule === 'apart' && F.edges) { const bad = pr.badEdges.length; rd += bad ? ' · <span class="bad">' + C.plural(bad, 'line joins', 'lines join') + ' neighbours</span>' : ''; }
      if (F.rule === 'anti' && pr.spread) rd += ' · <span class="bad">totals run ' + pr.spread[0] + '–' + pr.spread[1] + ', not a run of ' + F.lines.length + '</span>';
      readout.innerHTML = rd;
      wb.applyPaints();
    }

    /* finding things under the pointer */
    function tileAt(pt) {
      let best = 0, bd = (tileR * 1.05) * (tileR * 1.05);
      trayNums.forEach((v) => {
        const i = where(v), [x, y] = i >= 0 ? slotXY(i) : trayPos[v];
        const dd = (pt[0] - x) ** 2 + (pt[1] - y) ** 2;
        if (dd < bd) { bd = dd; best = v; }
      });
      return best;
    }
    function slotAt(pt, slack) {
      let best = -1, bd = (R * (slack || 1.15)) ** 2;
      if (sc.cell) bd = (S * 0.5 * (slack || 1)) ** 2 * 1.3;
      for (let i = 0; i < N; i++) {
        const [x, y] = slotXY(i), dd = (pt[0] - x) ** 2 + (pt[1] - y) ** 2;
        if (dd < bd) { bd = dd; best = i; }
      }
      return best;
    }
    function badgeAt(pt) {
      for (let li = 0; li < badges.length; li++) { const b = badges[li]; if (Math.abs(pt[0] - b.x) <= b.w / 2 + 4 && Math.abs(pt[1] - b.y) <= b.h / 2 + 4) return li; }
      return -1;
    }

    /* moving numbers */
    function commit(why) {
      clearHint();
      draw();
      ctx.changed(why);
    }
    // put number v into slot i (or back in the tray when i < 0); a number already there goes where v came from
    function put(v, i) {
      if (busy) return false;
      if (i >= 0 && isGiven(i)) { ctx.toast('That number is printed on the puzzle.'); return false; }
      const from = where(v);
      if (from === i) return false;
      if (i < 0) { if (from >= 0) a[from] = 0; }
      else {
        const other = a[i];
        a[i] = v;
        if (from >= 0) a[from] = other;
      }
      ctx.sfx(i >= 0 ? 'snap' : 'tap');
      return true;
    }
    function allBack() {
      if (busy || !a.some((v) => v)) return;
      a = new Array(N).fill(0);
      selSlot = -1; selTile = 0;
      commit('clear');
    }

    wb.handlers.board = {
      down(pt, ev) {
        if (busy) return true;
        const v = tileAt(pt);
        if (v) { drag = { v, p0: pt, moved: false, hover: -1, ev }; return true; }
        const i = slotAt(pt);
        if (i >= 0) {
          if (isGiven(i)) { ctx.toast('That number is printed on the puzzle.'); return true; }
          if (selTile) { const t = selTile; selTile = 0; if (put(t, i)) commit('place'); else draw(); return true; }
          selSlot = selSlot === i ? -1 : i;
          typed = '';
          clearHint();
          draw();
          return true;
        }
        const li = badgeAt(pt);
        if (li >= 0) { hoverLine = hoverLine === li ? -1 : li; draw(); return true; }
        if (selSlot >= 0 || selTile) { selSlot = -1; selTile = 0; draw(); }
        return false;
      },
      move(pt) {
        if (!drag) return;
        if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) < tileR * 0.25) return;
        drag.moved = true;
        const g = tileEls[drag.v];
        g.setAttribute('transform', 'translate(' + pt[0].toFixed(1) + ' ' + pt[1].toFixed(1) + ') scale(1.08)');
        g.classList.add('drag');
        gTiles.appendChild(g);
        const i = slotAt(pt, 1.35);
        if (i !== drag.hover) { drag.hover = i; draw(); }
      },
      up(pt) {
        const dg = drag;
        drag = null;
        if (!dg) return;
        tileEls[dg.v].classList.remove('drag');
        if (dg.moved) {
          const i = slotAt(pt, 1.35);
          selTile = 0;
          if (i >= 0 && !isGiven(i)) { if (put(dg.v, i)) commit('place'); else draw(); }
          else if (i < 0 && where(dg.v) >= 0) { put(dg.v, -1); commit('unplace'); }
          else { if (i >= 0) ctx.toast('That number is printed on the puzzle.'); draw(); }
          return;
        }
        // a click on a tile
        const now = Date.now(), v = dg.v, at = where(v);
        if (lastUp.v === v && now - lastUp.t < 380 && at >= 0) { lastUp = { v: 0, t: 0 }; put(v, -1); selTile = 0; commit('unplace'); return; }
        lastUp = { v, t: now };
        if (selSlot >= 0 && at < 0) { const i = selSlot; selSlot = -1; if (put(v, i)) commit('place'); else draw(); return; }
        if (selTile && selTile !== v && at >= 0) { const t = selTile; selTile = 0; if (put(t, at)) commit('swap'); else draw(); return; }
        selTile = selTile === v ? 0 : v;
        selSlot = -1;
        clearHint();
        draw();
      },
      hover(pt) {
        const li = badgeAt(pt);
        if (li !== hoverLine && (li >= 0 || hoverLine >= 0)) { hoverLine = li; draw(); }
      }
    };

    // typing a number into the chosen place (several digits: a short wait decides)
    function typeDigit(dg) {
      if (selSlot < 0) { ctx.toast('Pick an empty place first, then type its number.'); return; }
      if (isGiven(selSlot)) return;
      typed += dg;
      clearTimeout(typedT);
      const free = trayNums.filter((v) => where(v) < 0 || where(v) === selSlot);
      const exact = free.find((v) => String(v) === typed);
      const longer = free.some((v) => String(v).startsWith(typed) && String(v) !== typed);
      if (exact && !longer) { finishTyping(exact); return; }
      if (!exact && !longer) { ctx.toast('No ' + typed + ' left in the tray.'); typed = ''; return; }
      ctx.say('Typed ' + typed + '…');
      typedT = setTimeout(() => { if (exact) finishTyping(exact); typed = ''; }, 800);
    }
    function finishTyping(v) {
      typed = '';
      ctx.say('');
      if (put(v, selSlot)) {
        // on to the next empty place
        const next = nextEmpty(selSlot);
        selSlot = next;
        commit('type');
      }
    }
    function nextEmpty(from) {
      for (let k = 1; k <= N; k++) { const i = (from + k) % N; if (!isGiven(i) && !a[i]) return i; }
      return -1;
    }
    function moveSel(dx, dy) {
      if (selSlot < 0) { selSlot = nextEmpty(-1); draw(); return; }
      const [x0, y0] = slotXY(selSlot);
      let best = -1, bs = Infinity;
      for (let i = 0; i < N; i++) {
        if (i === selSlot) continue;
        const [x, y] = slotXY(i), vx = x - x0, vy = y - y0;
        const along = vx * dx + vy * dy;
        if (along <= 1) continue;
        const off = Math.abs(vx * dy - vy * dx);
        const score = along + off * 2.5;
        if (score < bs) { bs = score; best = i; }
      }
      if (best >= 0) { selSlot = best; typed = ''; draw(); }
    }

    /* hints */
    function clearHint() {
      hintEls.forEach((el) => el.remove());
      hintEls = [];
    }
    function ring(i, cls) {
      const [x, y] = slotXY(i);
      if (sc.cell) hintEls.push(s('rect', { x: x - S / 2 + 1, y: y - S / 2 + 1, width: S - 2, height: S - 2, rx: S * 0.14, class: 'mg-hint ' + cls }, topL));
      else hintEls.push(s('circle', { cx: x, cy: y, r: R + 8, class: 'mg-hint ' + cls }, topL));
    }
    function showLine(li) {
      F.lines[li].forEach((i) => ring(i, 'line'));
      const b = badges[li];
      hintEls.push(s('rect', { x: b.x - b.w / 2 - 4, y: b.y - b.h / 2 - 4, width: b.w + 8, height: b.h + 8, rx: (b.h + 8) / 2, class: 'mg-hint target' }, topL));
    }
    const place = F.kind === 'square' ? 'cell' : 'circle';
    const again = ' *Ask again and I will put it in.*';

    function hint() {
      if (busy) return null;
      const vals = full(), pr = M.problems(F, vals);
      if (pr.bad.length && (F.rule === 'sum' || F.rule === 'prod')) {
        const li = pr.bad[0];
        return { text: 'Look at ' + F.names[li] + ': it ' + (F.rule === 'prod' ? 'multiplies' : 'adds up') + ' to ' + M.lineVal(F, vals, li) + ', not ' + F.target + '.', show() { showLine(li); } };
      }
      if (pr.bad.length) { const li = pr.bad[0]; return { text: F.names[li] + ' has the same total as another line — every total must be different.', show() { pr.bad.forEach(showLine); } }; }
      if (pr.badEdges.length) { const [x, y] = pr.badEdges[0]; return { text: 'The ' + vals[x] + ' and the ' + vals[y] + ' are joined by a line, and they are next to each other in counting.', show() { ring(x, 'target'); ring(y, 'target'); } }; }
      // a number above the line's target: say so before anything else
      for (let li = 0; li < F.lines.length && F.rule === 'sum'; li++) {
        const tot = F.lines[li].reduce((t, i) => t + (vals[i] || 0), 0);
        if (tot > F.target) return { text: F.names[li] + ' already comes to ' + tot + ', more than ' + F.target + '.', show() { showLine(li); } };
      }
      if (!d.any) {
        const wrong = [];
        for (let i = 0; i < N; i++) if (a[i] && a[i] !== d.sol[i]) wrong.push(i);
        if (wrong.length) {
          const i = wrong[0];
          return { text: 'Nothing is broken yet, but the **' + a[i] + '** in the gold ' + place + ' is not where it belongs' + (wrong.length > 1 ? ' (and ' + C.plural(wrong.length - 1, 'other number') + ' too)' : '') + '. Send it back to the tray and think again.', show() { ring(i, 'target'); } };
        }
      }
      if (lastHint && !valAt(lastHint.i) && where(lastHint.v) < 0) {
        const q = lastHint;
        lastHint = null;
        put(q.v, q.i);
        commit('hint');
        return { text: 'Put in: **' + q.v + '**.', show() { ring(q.i, 'target'); } };
      }
      if (vals.every((v) => v)) return 'Every place is filled. Press Check!';
      if (!d.any) {
        const st = M.hintStep(F, vals);
        if (st && st.s != null) {
          lastHint = { i: st.s, v: st.v };
          return { text: st.text + again, show() { if (st.li != null) showLine(st.li); else (st.lines || []).forEach(showLine); ring(st.s, 'target'); } };
        }
        // reasoning has run out (it should not, for the puzzles here): the answer itself
        const i = vals.findIndex((v) => !v);
        lastHint = { i, v: d.sol[i] };
        return { text: 'This step needs a longer search. The gold ' + place + ' takes **' + d.sol[i] + '**.' + again, show() { ring(i, 'target'); } };
      }
      // any arrangement counts: find one that goes on from here (the stored one first, if it fits)
      const fix = {};
      for (let i = 0; i < N; i++) if (a[i]) fix[i] = a[i];
      const onSol = a.every((v, i) => !v || v === d.sol[i]);
      const r = onSol ? { n: 1, first: d.sol } : M.count(F, { limit: 1, nodeLimit: 4e5, fix });
      if (!r.n && r.aborted) {
        const i = a.findIndex((v, k) => v && v !== d.sol[k]);
        return { text: 'This one is hard to search from here. One answer I know has something else in the gold ' + place + ' — try moving your ' + a[i] + '.', show() { ring(i, 'target'); } };
      }
      if (r.n) {
        const st = F.rule === 'sum' || F.rule === 'prod' ? M.hintStep(F, vals) : null;
        const i = st && st.s != null && r.first[st.s] === st.v ? st.s : vals.findIndex((v) => !v);
        lastHint = { i, v: r.first[i] };
        const started = a.some((v) => v);
        const plain = started ? 'You are on a good road: the numbers you have placed can all stay. One way to go on puts **' + r.first[i] + '** in the gold ' + place + '.'
          : 'A place to start: put **' + r.first[i] + '** in the gold ' + place + ' — it belongs to one of the arrangements that work.';
        return { text: (st && st.s === i ? st.text : plain) + again, show() { ring(i, 'target'); } };
      }
      // the placed numbers block every answer: find one to move
      for (let i = 0; i < N; i++) {
        if (!a[i]) continue;
        const f2 = Object.assign({}, fix);
        delete f2[i];
        if (M.count(F, { limit: 1, nodeLimit: 2e5, fix: f2 }).n) return { text: 'From here nothing works: the **' + a[i] + '** in the gold ' + place + ' blocks every arrangement. Move it.', show() { ring(i, 'target'); } };
      }
      return { text: 'From here nothing works. Try sending a few numbers back to the tray.', show() {} };
    }

    /* the solution, number by number */
    function solve() {
      if (busy) return;
      clearHint();
      lastHint = null;
      selSlot = -1; selTile = 0;
      // keep what is right; the rest goes back first
      const target = d.sol.slice();
      if (d.any) {
        const fix = {};
        for (let i = 0; i < N; i++) if (a[i]) fix[i] = a[i];
        const r = M.count(F, { limit: 1, nodeLimit: 6e5, fix });
        if (r.n) for (let i = 0; i < N; i++) target[i] = r.first[i];
      }
      for (let i = 0; i < N; i++) if (a[i] && a[i] !== target[i]) a[i] = 0;
      const todo = [];
      for (let i = 0; i < N; i++) if (!isGiven(i) && a[i] !== target[i]) todo.push(i);
      draw();
      if (!todo.length) { ctx.changed('solve'); return; }
      busy = true;
      let k = 0;
      const step = () => {
        if (dead) return;
        const i = todo[k++];
        a[i] = target[i];
        draw();
        if (k < todo.length) timer = setTimeout(step, C.anim(N > 16 ? 60 : 130));
        else { busy = false; timer = null; ctx.changed('solve'); }
      };
      step();
    }

    draw();

    return {
      noMoves: true,
      check() {
        const vals = full(), pr = M.problems(F, vals);
        if (pr.ok) return { solved: true, msg: SOLVED[(C.hash(p.id) >>> 3) % SOLVED.length] };
        const left = vals.filter((v) => !v).length;
        if (left) return { solved: false, msg: left === 1 ? 'One place is still empty.' : left + ' places are still empty.' };
        if (pr.bad.length) return { solved: false, msg: F.names[pr.bad[0]].charAt(0).toUpperCase() + F.names[pr.bad[0]].slice(1) + (F.rule === 'sum' ? ' makes ' + M.lineVal(F, vals, pr.bad[0]) + ', not ' + F.target + '.' : ' breaks the rule.') };
        if (pr.badEdges.length) return { solved: false, msg: 'Two neighbours in counting are joined by a line.' };
        if (pr.spread) return { solved: false, msg: 'The totals are all different, but they do not make a run of consecutive numbers.' };
        return { solved: false, msg: 'Not yet.' };
      },
      hint,
      solve,
      explain() {
        const r = M.reason(F);
        if (d.any) return 'Any arrangement that keeps the rule counts. One of them: ' + d.sol.join(', ') + ' (reading the places in order).';
        const c = r.counts;
        const bits = [];
        if (c.last) bits.push(C.plural(c.last, 'line with one gap', 'lines with one gap'));
        if (c.only) bits.push(C.plural(c.only, 'place where only one number fits', 'places where only one number fits'));
        if (c.place) bits.push(C.plural(c.place, 'number with only one home', 'numbers with only one home'));
        if (c.trial) bits.push(C.plural(c.trial, 'short what-if'));
        return r.solved ? 'This one can be finished by reasoning alone: ' + (bits.length ? bits.join(', ') : 'the printed numbers settle it') + '.' : '';
      },
      getState() { return { a: a.slice() }; },
      setState(st) {
        if (!st) return;
        if (timer) { clearTimeout(timer); timer = null; busy = false; }
        a = new Array(N).fill(0);
        (st.a || []).forEach((v, i) => { if (i < N && !isGiven(i)) a[i] = v; });
        lastHint = null;
        drag = null;
        clearHint();
        draw();
      },
      reset() { selSlot = -1; selTile = 0; lastHint = null; clearHint(); draw(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        const m = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = m ? m[1] : /^[0-9]$/.test(k) ? k : null;
        if (dg != null && selSlot >= 0) { typeDigit(dg); return true; }
        if ((k === 'Backspace' || k === 'Delete') && selSlot >= 0) {
          if (a[selSlot]) { a[selSlot] = 0; commit('unplace'); }
          return true;
        }
        const dir = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[k];
        if (dir) { moveSel(dir[0], dir[1]); return true; }
        if (k === 'Escape' && (selSlot >= 0 || selTile)) { selSlot = -1; selTile = 0; draw(); return false; }
        return false;
      },
      destroy() { dead = true; if (timer) clearTimeout(timer); clearTimeout(typedT); }
    };
  }

  C.css('magic', `
    .mg-nohit, .mg-hint { pointer-events: none; }
    .mg-seg { stroke: var(--ink-2); stroke-opacity: .55; stroke-width: 5; stroke-linecap: round; fill: none; }
    .mg-seg.ok { stroke: var(--green); stroke-opacity: .5; }
    .mg-seg.bad { stroke: var(--red); stroke-opacity: .9; stroke-width: 7; }
    .mg-ring { fill: none; stroke: var(--ink-2); stroke-opacity: .45; stroke-width: 4; }
    .mg-diag { stroke: var(--purple); stroke-opacity: .28; stroke-width: 2.5; stroke-dasharray: 5 9; fill: none; pointer-events: none; }
    .mg-slot { fill: var(--cell); stroke: var(--ink-2); stroke-opacity: .55; stroke-width: 3; cursor: pointer; transition: fill .12s; }
    .mg-slot.cell { stroke-width: 2.5; }
    .mg-slot.given { fill: var(--board-2); cursor: default; }
    .mg-slot:hover { stroke: var(--accent); stroke-opacity: 1; }
    .mg-slot.sel { stroke: var(--accent); stroke-opacity: 1; stroke-width: 4.5; fill: var(--accent); fill-opacity: .18; }
    .mg-slot.hot { stroke: var(--gold); stroke-opacity: 1; stroke-width: 5; fill: var(--gold); fill-opacity: .2; }
    .mg-slot.lit { fill: var(--gold); fill-opacity: .14; }
    .mg-tray { fill: var(--wood-dark); fill-opacity: .18; stroke: var(--wood); stroke-opacity: .35; stroke-width: 2; }
    .mg-traylbl { font: 600 12px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .mg-ghost { fill: none; stroke: var(--ink-2); stroke-opacity: .22; stroke-width: 2; stroke-dasharray: 4 4; }
    .mg-ghostnum { font: 600 15px "Segoe UI", system-ui, sans-serif; fill: var(--faint); opacity: .6; }
    .mg-tile { cursor: grab; }
    .mg-tile .mg-disc { fill: #f3e6c8; stroke: #b08a4a; stroke-width: 2.5; filter: drop-shadow(0 2px 2px rgba(0,0,0,.35)); }
    [data-theme="dark"] .mg-tile .mg-disc { fill: #e9d9b4; }
    .mg-tile .mg-num { font-family: Georgia, "Times New Roman", serif; font-weight: 700; fill: #3b2a12; pointer-events: none; }
    .mg-tile.placed .mg-disc { stroke: #8a6a34; }
    .mg-tile.sel .mg-disc { stroke: var(--accent); stroke-width: 4.5; }
    .mg-tile.bad .mg-disc { fill: #f6c9c3; stroke: var(--red); }
    .mg-tile.drag { cursor: grabbing; opacity: .92; }
    .mg-tile.drag .mg-disc { filter: drop-shadow(0 6px 6px rgba(0,0,0,.4)); }
    .mg-tile.fixed { cursor: default; }
    .mg-tile.fixed .mg-disc { fill: #c9b27f; stroke: #7a5a26; }
    [data-theme="dark"] .mg-tile.fixed .mg-disc { fill: #b99e66; }
    .mg-dot { stroke: #3b2a12; stroke-width: 1.6; }
    .mg-dot.odd { fill: #fffaf0; }
    .mg-dot.even { fill: #2a1d0c; }
    .mg-badge { cursor: pointer; }
    .mg-badge rect { fill: var(--panel-2); stroke: var(--line); stroke-width: 1.5; }
    .mg-badge text { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--muted); pointer-events: none; }
    .mg-badge.empty text { fill: var(--faint); font-weight: 600; }
    .mg-badge.part text { fill: var(--text); }
    .mg-badge.ok rect { fill: var(--green); fill-opacity: .2; stroke: var(--green); }
    .mg-badge.ok text { fill: var(--green); }
    .mg-badge.bad rect { fill: var(--red); fill-opacity: .18; stroke: var(--red); }
    .mg-badge.bad text { fill: var(--red); }
    .mg-badge.lit rect { stroke: var(--gold); stroke-width: 2.5; }
    .mg-hint { fill: none; }
    .mg-hint.line { stroke: var(--gold); stroke-opacity: .55; stroke-width: 3; stroke-dasharray: 6 5; }
    .mg-hint.target { stroke: var(--gold); stroke-width: 4; animation: mgpulse 1.1s ease-in-out infinite; }
    @keyframes mgpulse { 50% { stroke-opacity: .3; } }
    .mg-panel { width: 100%; display: flex; flex-direction: column; gap: 8px; }
    .mg-readout { font-size: .84rem; color: var(--muted); background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; padding: 7px 10px; }
    .mg-readout b { color: var(--text); }
    .mg-readout .bad { color: var(--red); }
    .mg-row { display: flex; gap: 6px; flex-wrap: wrap; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
