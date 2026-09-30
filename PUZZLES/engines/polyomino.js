/* The Puzzle Cabinet · engines/polyomino.js
 *
 * Polyominoes: pieces made of squares joined edge to edge (the twelve
 * pentominoes, the tetrominoes, trominoes, dominoes, hexominoes …) to be
 * packed into a board of squares, every square covered exactly once. The
 * pieces snap to the grid, turn by quarter turns and may be turned over.
 *
 * data: {
 *   pieces: ['F', 'I', 'L4', '##.|.##', ...]   named pieces (js/lib/polyo.js LIB) or rows
 *   sol:    ['0011..', ...]     the board, each square marked with the index of the
 *                               piece covering it in one solution ('0'-'9', 'a'-'z', 'A'-'Z');
 *                               '.' is not part of the board
 *   given:  [3, 7]              optional: these pieces start in place and stay there
 *   classic: true               optional: verify also runs the exact-cover search
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const S = (tag, attrs, parent) => C.s(tag, attrs, parent);
  const CH = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const K = (x, y) => x + ',' + y;
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty-one'];

  // the puzzle read from its data: board squares, pieces, their squares in the stored solution
  function model(p) {
    const Po = C.Polyo, d = p.data;
    const g = Po.grid(d.sol);
    const region = [], byPiece = [], bad = [];
    g.forEach((ch, k) => {
      const xy = k.split(',').map(Number);
      region.push(xy);
      const i = CH.indexOf(ch);
      if (i < 0 || i >= d.pieces.length) bad.push(ch);
      else (byPiece[i] = byPiece[i] || []).push(xy);
    });
    const pieces = d.pieces.map((spec, i) => {
      const L = Po.piece(spec, i);
      return { i, spec, name: L.name, full: L.full, color: L.color, cells: L.cells, canon: Po.canon(L.cells), sol: byPiece[i] || [] };
    });
    return { region, pieces, bad, given: new Set(d.given || []) };
  }

  // the turning point of a piece: a cell corner or a cell centre, as near the middle as possible,
  // so quarter turns keep the squares on the grid
  function pivotOf(cells) {
    let sx = 0, sy = 0;
    cells.forEach((c) => { sx += c[0] + 0.5; sy += c[1] + 0.5; });
    const cx = sx / cells.length, cy = sy / cells.length;
    const a = [Math.round(cx), Math.round(cy)], b = [Math.floor(cx) + 0.5, Math.floor(cy) + 0.5];
    return G.dist(a, [cx, cy]) <= G.dist(b, [cx, cy]) ? a : b;
  }

  function inset(loop, d) {
    const n = loop.length, out = [];
    for (let i = 0; i < n; i++) {
      const a = loop[(i + n - 1) % n], b = loop[i], c = loop[(i + 1) % n];
      const d1 = G.norm(G.sub(b, a)), d2 = G.norm(G.sub(c, b));
      out.push([b[0] + d * (-d1[1] - d2[1]), b[1] + d * (d1[0] + d2[0])]);
    }
    return out;
  }

  // the drawing of a piece in its own coordinates (pivot at 0, 0)
  function shapeData(cells, pv) {
    const Po = C.Polyo;
    const sh = (q) => [q[0] - pv[0], q[1] - pv[1]];
    const loops = Po.outline(cells).map((l) => l.map(sh));
    let lab = null, bd = Infinity;
    let sx = 0, sy = 0;
    cells.forEach((c) => { sx += c[0] + 0.5; sy += c[1] + 0.5; });
    const cen = [sx / cells.length, sy / cells.length];
    cells.forEach((c) => { const q = [c[0] + 0.5, c[1] + 0.5], dd = G.dist(q, cen); if (dd < bd - 1e-9) { bd = dd; lab = sh(q); } });
    return {
      loop: loops[0],
      path: loops.map((l) => C.pathOf(l)).join(''),
      inner: Po.innerEdges(cells).map((e) => { const a = sh([e[0], e[1]]), b = sh([e[2], e[3]]); return 'M' + a[0] + ' ' + a[1] + 'L' + b[0] + ' ' + b[1]; }).join(''),
      bevel: loops.map((l) => C.pathOf(inset(l, 0.075))).join(''),
      label: lab
    };
  }

  // lay the pieces out in rows no wider than maxW (gaps of one square)
  function shelves(items, maxW) {
    const order = items.map((it, i) => i).sort((a, b) => items[b].h - items[a].h || a - b);
    let x = 0, y = 0, rowH = 0, W = 0;
    const pos = [];
    for (const i of order) {
      const it = items[i];
      if (x > 0 && x + it.w > maxW) { x = 0; y += rowH + 1; rowH = 0; }
      pos[i] = [x, y];
      x += it.w + 1;
      rowH = Math.max(rowH, it.h);
      W = Math.max(W, x - 1);
    }
    return { pos, w: W, h: y + rowH };
  }

  // where the tray goes (right of the board or under it) and how wide, for the biggest view
  function layout(board, items, stage) {
    const sw = Math.max(200, stage.w - (stage.w < 560 ? 0 : 60)), sh = Math.max(200, stage.h - (stage.w < 560 ? 60 : 0));
    const maxPiece = items.reduce((m, it) => Math.max(m, it.w), 1);
    const sumW = items.reduce((m, it) => m + it.w + 1, 0);
    let best = null;
    for (let mw = maxPiece; mw <= Math.max(maxPiece, sumW); mw++) {
      const t = shelves(items, mw);
      if (!items.length) { t.w = 0; t.h = 0; }
      [['right', board.w + 2 + t.w, Math.max(board.h, t.h)], ['below', Math.max(board.w, t.w), board.h + 2 + t.h]].forEach(([side, w, h]) => {
        const k = Math.min(sw / (w + 1.2), sh / (h + 1.2));
        if (!best || k > best.k + 1e-9) best = { k, side, t, w, h };
      });
    }
    const b = best, t = b.t;
    let tx, ty;
    if (b.side === 'right') { tx = board.w + 2; ty = Math.floor((board.h - t.h) / 2); }
    else { tx = Math.floor((board.w - t.w) / 2); ty = board.h + 2; }
    return { side: b.side, tray: { x: tx, y: ty, w: t.w, h: t.h }, pos: t.pos.map((q) => [q[0] + tx, q[1] + ty]) };
  }

  // names for boards (the stored puzzles and the endless ones)
  const WORDS = {
    pento: ['Anvil', 'Beacon', 'Bastion', 'Cairn', 'Chimney', 'Citadel', 'Comet', 'Crag', 'Dais', 'Dune', 'Forge', 'Gable', 'Galleon', 'Gatehouse', 'Glacier', 'Harbour', 'Hearth', 'Hive', 'Keep', 'Kiln', 'Lantern', 'Ledge', 'Loom', 'Mesa', 'Mill', 'Minaret', 'Moat', 'Monolith', 'Obelisk', 'Orchard', 'Pagoda', 'Pier', 'Pinnacle', 'Plateau', 'Quarry', 'Rampart', 'Reef', 'Ridge', 'Rook', 'Sail', 'Scarp', 'Spire', 'Summit', 'Terrace', 'Turret', 'Viaduct', 'Wharf', 'Windmill', 'Ziggurat', 'Barbican', 'Belfry', 'Bulwark', 'Causeway', 'Cloister', 'Cupola', 'Dovecote', 'Escarpment', 'Fortress', 'Granary', 'Hangar', 'Isthmus', 'Jetty', 'Lagoon', 'Lookout', 'Mastaba', 'Outcrop', 'Parapet', 'Pavilion', 'Promontory', 'Pylon', 'Redoubt', 'Rotunda', 'Sconce', 'Shoal', 'Skerry', 'Stockade', 'Tor', 'Watchtower', 'Weir', 'Aqueduct'],
    pack: ['Acorn', 'Badger', 'Biscuit', 'Bramble', 'Buttercup', 'Candle', 'Chestnut', 'Clover', 'Cobble', 'Crumpet', 'Daisy', 'Dormouse', 'Ember', 'Fern', 'Fig', 'Flint', 'Gingerbread', 'Hazelnut', 'Hedgehog', 'Heron', 'Ivy', 'Juniper', 'Kettle', 'Kipper', 'Lark', 'Lichen', 'Magpie', 'Marmalade', 'Meadow', 'Mitten', 'Moss', 'Muffin', 'Nutmeg', 'Otter', 'Owl', 'Pebble', 'Pepper', 'Pickle', 'Pinecone', 'Plum', 'Puffin', 'Quince', 'Radish', 'Robin', 'Saffron', 'Scone', 'Sorrel', 'Sparrow', 'Squirrel', 'Teapot', 'Thimble', 'Thistle', 'Toadstool', 'Toffee', 'Truffle', 'Tulip', 'Turnip', 'Walnut', 'Wren', 'Yarrow', 'Almond', 'Bluebell', 'Bobbin', 'Button', 'Cinnamon', 'Crocus', 'Dumpling', 'Fox', 'Gooseberry', 'Hare', 'Kestrel', 'Lantana', 'Marigold', 'Mistletoe', 'Nettle', 'Oatcake', 'Parsnip', 'Pudding', 'Rhubarb', 'Snowdrop', 'Starling', 'Sultana', 'Tadpole', 'Teacake', 'Thrush', 'Wagtail', 'Weasel', 'Willow', 'Woodlark', 'Barley', 'Beetroot', 'Cress', 'Damson', 'Elder', 'Finch', 'Gorse', 'Hawthorn', 'Kingfisher', 'Lupin', 'Mallow', 'Newt', 'Primrose', 'Rowan', 'Sage', 'Shrew', 'Sloe', 'Swift', 'Tansy', 'Vole', 'Wheatear', 'Woodruff', 'Yew', 'Bilberry', 'Cowslip', 'Dunnock', 'Foxglove', 'Harebell', 'Linnet', 'Medlar', 'Pipit', 'Samphire', 'Siskin', 'Teasel']
  };
  C.polyominoWords = WORDS;
  const TEMPL = [
    (d) => 'Fit ' + d + ' into the board.',
    (d) => 'Every square covered, every piece used: ' + d + '.',
    (d, n) => 'A board of ' + n + ' squares, and ' + d + ' to fill it.',
    (d) => 'Cover the board with ' + d + ' — no gaps, no overlaps.',
    (d) => 'Pack ' + d + ' into this shape.'
  ];
  C.polyominoTexts = TEMPL;

  // endless: which pieces for a level
  function endlessSet(rng, level, packing) {
    const Po = C.Polyo;
    const hex = () => 'H' + (1 + rng.int(35));
    const many = (f, k) => { const a = []; for (let i = 0; i < k; i++) a.push(f()); return a; };
    const pents = (k) => rng.shuffle(Po.PENT.slice()).slice(0, k);
    const tets = (k) => rng.shuffle(Po.TET.slice()).slice(0, k);
    const hexes = (k) => { const s = new Set(); while (s.size < k) s.add(hex()); return Array.from(s); };
    if (!packing) return pents([0, 2 + rng.int(2), 4 + rng.int(2), 6 + rng.int(2), 8 + rng.int(2), 10 + rng.int(3)][level]);
    const trom = (k) => many(() => (rng() < 0.55 ? 'L3' : 'I3'), k);
    const opts = {
      1: [() => trom(3 + rng.int(3)), () => tets(2 + rng.int(2)), () => hexes(2)],
      2: [() => Po.TET.slice(), () => hexes(3 + rng.int(2)), () => trom(2).concat(tets(3))],
      3: [() => hexes(5 + rng.int(2)), () => tets(2).concat(pents(4)), () => ['o1', 'I2', 'I3', 'L3'].concat(Po.TET)],
      4: [() => Po.TET.concat(Po.TET), () => hexes(7), () => tets(3).concat(pents(5))],
      5: [() => hexes(8 + rng.int(2)), () => tets(5).concat(pents(7 + rng.int(3))), () => Po.TET.concat(Po.TET, pents(3))]
    }[level];
    return rng.pick(opts)();
  }

  C.engine({
    id: 'polyomino',
    name: 'Polyominoes',
    deps: ['js/lib/dlx.js', 'js/lib/polyo.js'],
    generates: ['pentominoes', 'polyomino-packing'],

    // endless: a board grown from a random set of pieces; the level is the number and kind of pieces
    generate(rng, level, fam) {
      const Po = C.Polyo;
      const packing = !!(fam && fam.id === 'polyomino-packing');
      const names = endlessSet(rng, level, packing).sort();
      const shapes = names.map((n, i) => Po.piece(n, i).cells);
      const area = shapes.reduce((s, c) => s + c.length, 0);
      for (let tries = 0; tries < 25; tries++) {
        const g = Po.grow(shapes, rng, { aspect: 1.1 + rng() * 0.5 });
        if (!g || Po.holes(g.region)) continue;
        const b = Po.bbox(g.region);
        if (Math.min(b.w, b.h) < 2 || (b.w * b.h === area && names.length > 2 && rng() < 0.7)) continue;
        const L = Po.landscape(g.region, g.placements);
        return {
          title: 'The ' + rng.pick(packing ? WORDS.pack : WORDS.pento),
          text: cap(rng.pick(TEMPL)(Po.describe(names), area)),
          diff: level,
          tags: ['endless'],
          data: { pieces: names, sol: Po.solRows(L.region, L.placements) }
        };
      }
      return null;
    },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { grid: 1, snapPx: 14, rotStep: 90 },
    noMoves: true,
    about: 'Fill the board with **all** the pieces: every square covered once, nothing hanging over the edge. **Drag** a piece onto the board — it clicks into the grid. **Turn** it a quarter turn with a **double-click**, the **R** key (Shift+R the other way), the round handle or Shift + wheel. **Turn it over** with **X** or the ⇋ button. Pieces that overlap show red. Stuck? A hint places one piece of a solution that fits what you have built so far — or tells you which piece cannot stay. The paint tool colours board squares, handy for a chessboard colouring argument.',

    verify(p) {
      const Po = C.Polyo;
      if (!Po || !C.DLX) return { ok: false, err: 'js/lib/polyo.js and js/lib/dlx.js are needed' };
      const d = p.data;
      if (!d || !Array.isArray(d.sol) || !Array.isArray(d.pieces) || !d.pieces.length) return { ok: false, err: 'data needs sol and pieces' };
      if (d.pieces.length > CH.length) return { ok: false, err: 'too many pieces' };
      const m = model(p);
      if (m.bad.length) return { ok: false, err: 'unknown piece mark ' + m.bad[0] };
      for (const pc of m.pieces) {
        if (!pc.cells.length) return { ok: false, err: 'piece ' + pc.spec + ' has no squares' };
        if (!Po.connected(pc.cells)) return { ok: false, err: 'piece ' + pc.spec + ' is not connected' };
        if (!pc.sol.length) return { ok: false, err: 'piece ' + pc.spec + ' is missing from the solution' };
        if (Po.canon(pc.sol) !== pc.canon) return { ok: false, err: 'piece ' + pc.i + ' (' + pc.spec + ') has the wrong shape in the solution' };
      }
      for (const i of m.given) if (!(i >= 0 && i < m.pieces.length)) return { ok: false, err: 'bad given index ' + i };
      if (m.given.size >= m.pieces.length) return { ok: false, err: 'every piece is given' };
      if (d.classic) {
        const r = Po.pack({ region: m.region, pieces: m.pieces.map((pc) => pc.cells), max: 1, nodeLimit: 4e5 });
        if (!r.sols.length && !r.aborted) return { ok: false, err: 'the exact-cover search finds no solution' };
      }
      return { ok: true };
    },

    mount(ctx, p) {
      const Po = C.Polyo, wb = ctx.wb, d = p.data;
      const m = model(p);
      const regionSet = new Set(m.region.map((c) => K(c[0], c[1])));
      const bb = Po.bbox(m.region);
      const total = m.region.length;
      if (!p.goal) ctx.setGoal('Cover every square of the board with all ' + C.plural(m.pieces.length, 'piece') + '.');

      /* ---------- the pieces' drawings ---------- */
      const shapes = m.pieces.map((pc) => {
        const pv = pivotOf(pc.cells);
        return Object.assign({ pv }, shapeData(pc.cells, pv));
      });
      const letterOf = (pc) => (/^[A-Z][345]?$/.test(pc.name) ? pc.name.charAt(0) : /^H\d+$/.test(pc.name) ? pc.name.slice(1) : '');
      wb.type('polyo', {
        poly(o) { return shapes[o.data.i].loop; },
        draw(g, o) {
          const sh = shapes[o.data.i], pc = m.pieces[o.data.i];
          const fill = o.fill || pc.color;
          S('path', { d: sh.path, class: 'po-body', fill, 'fill-rule': 'evenodd' }, g);
          if (sh.inner) S('path', { d: sh.inner, class: 'po-inner' }, g);
          S('path', { d: sh.bevel, class: 'po-bevel' }, g);
          S('path', { d: sh.path, class: 'po-edge' }, g);
          const lt = letterOf(pc);
          if (o.data.given) S('circle', { cx: sh.label[0], cy: sh.label[1], r: 0.11, class: 'po-pin' }, g);
          else if (lt) {
            const t = S('text', { x: 0, y: 0, 'font-size': 0.46, class: 'po-letter', 'text-anchor': 'middle', 'dominant-baseline': 'central',
              transform: 'translate(' + sh.label[0] + ' ' + sh.label[1] + ') scale(' + (o.flip ? -1 : 1) + ' 1) rotate(' + (-(o.rot || 0)) + ')' }, g);
            t.textContent = lt;
          }
        }
      });

      /* ---------- the board ---------- */
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const boardG = S('g', { class: 'po-board' }, board);
      const loops = Po.outline(m.region);
      S('path', { d: loops.map((l) => C.pathOf(l)).join(''), class: 'po-shadow', 'fill-rule': 'evenodd' }, boardG);
      m.region.forEach((c) => S('rect', { x: c[0], y: c[1], width: 1, height: 1, class: 'po-cell', 'data-key': 'c' + c[0] + '_' + c[1] }, boardG));
      const gridD = Po.innerEdges(m.region).map((e) => 'M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3]).join('');
      S('path', { d: gridD, class: 'po-grid' }, boardG);
      S('path', { d: loops.map((l) => C.pathOf(l)).join(''), class: 'po-board-edge', 'fill-rule': 'evenodd' }, boardG);
      const overG = S('g', { class: 'po-over' }, top);
      const hintG = S('g', { class: 'po-hint' }, top);
      wb.applyPaints();

      /* ---------- the tray and the pieces ---------- */
      const loose = m.pieces.filter((pc) => !m.given.has(pc.i));
      const items = loose.map((pc) => { const b = Po.bbox(pc.cells); return { w: b.w, h: b.h }; });
      const boardBox = { w: bb.x1 + 1, h: bb.y1 + 1 };
      const L = layout(boardBox, items, wb.size());
      if (loose.length) {
        const tr = L.tray;
        S('rect', { x: tr.x - 0.5, y: tr.y - 0.5, width: tr.w + 1, height: tr.h + 1, rx: 0.4, class: 'po-tray' }, bg);
      }
      const objs = [];
      m.pieces.forEach((pc) => {
        const sh = shapes[pc.i];
        const spec = {
          id: 'pc' + pc.i, type: 'polyo', kind: 'polyo', name: pc.full.charAt(0).toUpperCase() + pc.full.slice(1),
          rotate: 90, flipable: true, snap: true, fill: pc.color,
          data: { i: pc.i }
        };
        if (m.given.has(pc.i)) {
          const pl = placement(pc.i, pc.sol, 0, false);
          Object.assign(spec, pl, { move: false, rotate: false, flipable: false, cls: 'given' });
          spec.data.given = 1;
        } else {
          const at = L.pos[loose.indexOf(pc)];
          spec.x = at[0] + sh.pv[0]; spec.y = at[1] + sh.pv[1];
        }
        objs.push(wb.add(spec));
      });
      const b0 = G.bbox([[[bb.x0, bb.y0], [bb.x1 + 1, bb.y1 + 1]], loose.length ? [[L.tray.x - 0.5, L.tray.y - 0.5], [L.tray.x + L.tray.w + 0.5, L.tray.y + L.tray.h + 0.5]] : [[0, 0]]]);
      wb.setBounds({ x0: b0.x0 - 0.6, y0: b0.y0 - 0.6, x1: b0.x1 + 0.6, y1: b0.y1 + 0.6 }, 0.05);

      /* ---------- geometry of the pieces on the table ---------- */
      function pieces() { return m.pieces.map((pc) => wb.get('pc' + pc.i)).filter(Boolean); }
      // the board squares a piece covers (or null when it is off the grid)
      function cellsOf(o, at) {
        const pc = m.pieces[o.data.i], sh = shapes[o.data.i];
        const t = at || o;
        const out = [];
        for (const c of pc.cells) {
          const w = G.place([c[0] + 0.5 - sh.pv[0], c[1] + 0.5 - sh.pv[1]], t);
          const x = Math.round(w[0] - 0.5), y = Math.round(w[1] - 0.5);
          if (Math.abs(w[0] - 0.5 - x) > 0.04 || Math.abs(w[1] - 0.5 - y) > 0.04) return null;
          out.push([x, y]);
        }
        return out;
      }
      // the placement { x, y, rot, flip } that puts piece i on these squares with symmetry t (or any that fits)
      function placement(i, target, rotHint, flipHint) {
        const pc = m.pieces[i], sh = shapes[i];
        const want = Po.key(target);
        let best = null, bs = Infinity;
        for (let t = 0; t < 8; t++) {
          if (Po.key(Po.orient(pc.cells, t)) !== want) continue;
          const rot = (t % 4) * 90, flip = t >= 4;
          let dr = Math.abs(G.normDeg(rot - (rotHint || 0))); if (dr > 180) dr = 360 - dr;
          const sc = dr + (flip !== !!flipHint ? 1000 : 0);
          if (sc < bs) { bs = sc; best = { rot, flip }; }
        }
        if (!best) return null;
        const cen = pc.cells.map((c) => G.place([c[0] + 0.5 - sh.pv[0], c[1] + 0.5 - sh.pv[1]], { x: 0, y: 0, rot: best.rot, flip: best.flip }));
        const mx = Math.min.apply(null, cen.map((q) => q[0])), my = Math.min.apply(null, cen.map((q) => q[1]));
        const tb = Po.bbox(target);
        return { x: Math.round((tb.x0 + 0.5 - mx) * 2) / 2, y: Math.round((tb.y0 + 0.5 - my) * 2) / 2, rot: best.rot, flip: best.flip };
      }

      // who covers what
      function coverage() {
        const count = new Map();
        const info = [];
        pieces().forEach((o) => {
          const cs = cellsOf(o);
          const r = { o, cells: cs, inside: 0, outside: 0 };
          if (cs) cs.forEach((c) => {
            const k = K(c[0], c[1]);
            if (regionSet.has(k)) { r.inside++; count.set(k, (count.get(k) || 0) + 1); } else r.outside++;
          });
          info.push(r);
        });
        let covered = 0, over = 0;
        count.forEach((n) => { covered++; if (n > 1) over++; });
        info.forEach((r) => {
          r.placed = !!r.cells && r.outside === 0;
          r.clean = r.placed && r.cells.every((c) => count.get(K(c[0], c[1])) === 1);
        });
        return { count, info, covered, over };
      }

      function refresh() {
        const cv = coverage();
        overG.innerHTML = '';
        cv.count.forEach((n, k) => {
          if (n < 2) return;
          const xy = k.split(',').map(Number);
          S('rect', { x: xy[0] + 0.06, y: xy[1] + 0.06, width: 0.88, height: 0.88, rx: 0.12, class: 'po-overcell' }, overG);
        });
        const placed = cv.info.filter((r) => r.placed).length;
        ctx.stat('Pieces', placed + ' / ' + m.pieces.length);
        ctx.stat('Squares', cv.covered + ' / ' + total);
        boardG.classList.toggle('po-done', cv.covered === total && !cv.over && placed === m.pieces.length);
        return cv;
      }

      /* ---------- handlers ---------- */
      function snapAt(o, at) {
        const pc = m.pieces[o.data.i], sh = shapes[o.data.i];
        const c = pc.cells[0];
        const w = G.place([c[0] + 0.5 - sh.pv[0], c[1] + 0.5 - sh.pv[1]], { x: at.x, y: at.y, rot: at.rot == null ? o.rot : at.rot, flip: o.flip });
        return { x: at.x + Math.round(w[0] - 0.5) + 0.5 - w[0], y: at.y + Math.round(w[1] - 0.5) + 0.5 - w[1] };
      }
      wb.handlers.snap = (o, at) => (o.data && o.data.i != null ? snapAt(o, at) : null);
      wb.handlers.settle = (list, why) => {
        list.forEach((o) => {
          if (!o.data || o.data.i == null) return;
          o.rot = G.normDeg(Math.round((o.rot || 0) / 90) * 90);
          const s = snapAt(o, o);
          o.x = Math.round(s.x * 2) / 2; o.y = Math.round(s.y * 2) / 2;
          if (why === 'rotate' || why === 'flip') wb.renderObj(o);
        });
        hintG.innerHTML = '';
      };
      wb.handlers.pick = (o, list) => {
        const ids = new Set(list.map((q) => q.id));
        wb.order = wb.order.filter((id) => !ids.has(id)).concat(wb.order.filter((id) => ids.has(id)));
        wb.restack();
      };
      // a double tap turns a piece (the workbench's pointer capture hides dblclick targets, so taps are timed here)
      let lastTap = { id: null, t: 0 };
      const onTap = (e) => {
        const o = e && e.obj;
        if (!o || !o.data || o.data.i == null) return;
        const now = Date.now();
        if (lastTap.id === o.id && now - lastTap.t < 380) {
          lastTap = { id: null, t: 0 };
          if (o.rotate && !o.locked) { wb.select([o]); wb.rotateSel(90, [o]); }
        } else lastTap = { id: o.id, t: now };
      };
      wb.on('tap', onTap);
      wb.on('change', () => refresh());
      wb.on('restore', () => { hintG.innerHTML = ''; refresh(); });
      refresh();

      /* ---------- solving: from what is on the board, or the stored solution ---------- */
      const nameOf = (pc) => (/^H\d+$/.test(pc.name) ? 'hexomino ' + pc.name.slice(1) : 'the ' + pc.full);
      function stored() { return m.pieces.map((pc) => ({ piece: pc.i, cells: pc.sol })); }
      // a solution that keeps every cleanly placed piece where it is
      function plan(nodeLimit) {
        const cv = coverage();
        const good = cv.info.filter((r) => r.clean);
        const fixed = good.map((r) => ({ piece: r.o.data.i, cells: r.cells }));
        const res = Po.pack({ region: m.region, pieces: m.pieces.map((pc) => pc.cells), fixed, max: 1, nodeLimit: nodeLimit || 3e5 });
        if (res.sols.length) return { sol: fixed.concat(res.sols[0]), good, cv };
        return { none: !res.aborted, aborted: res.aborted, good, cv };
      }
      function sameCells(a, b) { return a && b && a.length === b.length && Po.key(a) === Po.key(b) && Po.bbox(a).x0 === Po.bbox(b).x0 && Po.bbox(a).y0 === Po.bbox(b).y0; }
      // does the stored solution agree with the pieces placed so far?
      function storedAgrees(good) {
        return good.every((r) => m.pieces.some((pc) => pc.canon === m.pieces[r.o.data.i].canon && sameCells(pc.sol, r.cells)));
      }
      function showTarget(cells, o, cls) {
        hintG.innerHTML = '';
        Po.outline(cells).forEach((l) => S('path', { d: C.pathOf(l), class: cls || 'po-hintpoly' }, hintG));
        if (o && o.el) { o.el.classList.remove('po-hinted'); void o.el.getBBox; o.el.classList.add('po-hinted'); setTimeout(() => o.el && o.el.classList.remove('po-hinted'), 2400); }
        clearTimeout(showTarget.t);
        showTarget.t = setTimeout(() => { hintG.innerHTML = ''; }, 6000);
      }
      // the empty square that is hardest to fill (fewest empty neighbours), top-left first
      function hardest(sol, covered) {
        let best = null, bs = 9;
        m.region.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]).forEach((c) => {
          if (covered.has(K(c[0], c[1]))) return;
          let n = 0;
          [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach((dd) => { const k = K(c[0] + dd[0], c[1] + dd[1]); if (regionSet.has(k) && !covered.has(k)) n++; });
          if (n < bs) { bs = n; best = c; }
        });
        return best ? sol.find((s) => s.cells.some((c) => c[0] === best[0] && c[1] === best[1])) : null;
      }
      function suggest(sol, good, lead) {
        const covered = new Set();
        good.forEach((r) => r.cells.forEach((c) => covered.add(K(c[0], c[1]))));
        const fixedIdx = new Set(good.map((r) => r.o.data.i));
        const next = hardest(sol.filter((s) => !fixedIdx.has(s.piece)), covered);
        if (!next) return 'Every piece is where it belongs — press Check.';
        const pc = m.pieces[next.piece], o = wb.get('pc' + pc.i);
        const pl = placement(pc.i, next.cells, o.rot, o.flip);
        const turn = pl && pl.flip !== !!o.flip ? ' — turned over' : '';
        return {
          text: (lead || '') + cap(nameOf(pc)) + ' can go where the dashed outline shows' + turn + '.',
          show() { showTarget(next.cells, o); }
        };
      }

      return {
        check(manual) {
          const cv = refresh();
          const unaligned = cv.info.filter((r) => !r.cells);
          if (unaligned.length) return { solved: false, msg: cap(nameOf(m.pieces[unaligned[0].o.data.i])) + ' is not on the grid.' };
          if (cv.over) return { solved: false, msg: 'Pieces overlap on ' + C.plural(cv.over, 'square') + ' (shown red).' };
          const hang = cv.info.find((r) => r.inside > 0 && r.outside > 0);
          if (hang) return { solved: false, msg: cap(nameOf(m.pieces[hang.o.data.i])) + ' hangs over the edge.' };
          const off = cv.info.filter((r) => !r.placed);
          if (cv.covered === total && !off.length) return { solved: true, msg: 'Every square covered exactly once.' };
          if (!manual) return { solved: false };
          return { solved: false, msg: C.plural(total - cv.covered, 'square') + ' still empty' + (off.length ? ', ' + C.plural(off.length, 'piece') + ' still to place' : '') + '.' };
        },
        hint() {
          const pr = plan(3e5);
          const mine = pr.good.filter((r) => !m.given.has(r.o.data.i)).length;
          if (pr.sol) return suggest(pr.sol, pr.good, mine ? (mine === 1 ? 'The piece you have placed can stay. ' : 'All ' + NUMW[mine] + ' pieces you have placed can stay. ') : '');
          if (pr.none) {
            // which placed piece is in the way?
            for (const r of pr.good) {
              if (m.given.has(r.o.data.i)) continue;
              const fixed = pr.good.filter((q) => q !== r).map((q) => ({ piece: q.o.data.i, cells: q.cells }));
              const res = Po.pack({ region: m.region, pieces: m.pieces.map((pc) => pc.cells), fixed, max: 1, nodeLimit: 1e5 });
              if (res.sols.length) {
                const pc = m.pieces[r.o.data.i];
                return { text: 'The board cannot be finished from here: ' + nameOf(pc) + ' cannot stay where it is (outlined in red).', show() { showTarget(r.cells, r.o, 'po-badpoly'); } };
              }
            }
            return 'The board cannot be finished with the pieces where they are now, and moving any single one is not enough. Take a few pieces off and try again.';
          }
          if (storedAgrees(pr.good)) {
            const st = stored().filter((s) => !pr.good.some((r) => r.o.data.i === s.piece || sameCells(r.cells, s.cells)));
            return suggest(st.concat(pr.good.map((r) => ({ piece: r.o.data.i, cells: r.cells }))), pr.good);
          }
          const odd = pr.good.find((r) => !m.given.has(r.o.data.i) && !m.pieces.some((pc) => pc.canon === m.pieces[r.o.data.i].canon && sameCells(pc.sol, r.cells)));
          if (odd) return { text: 'This is a big search, so I checked against the solution I know: ' + nameOf(m.pieces[odd.o.data.i]) + ' is not where that solution has it. It might still work — or it might not.', show() { showTarget(odd.cells, odd.o, 'po-badpoly'); } };
          return 'Keep going — no piece is obviously wrong.';
        },
        solve() {
          hintG.innerHTML = '';
          const pr = plan(3e5);
          let sol = pr.sol;
          if (!sol) sol = stored();
          // which object goes where: the solution's piece index, or a free twin of the same shape
          const moves = [];
          sol.forEach((s) => {
            const o = wb.get('pc' + s.piece);
            const pl = placement(s.piece, s.cells, o.rot, o.flip);
            moves.push({ o, pl });
          });
          moves.forEach((mv) => { if (!!mv.o.flip !== mv.pl.flip) { mv.o.flip = mv.pl.flip; mv.o.rot = G.normDeg(-(mv.o.rot || 0)); wb.renderObj(mv.o); } });
          const from = moves.map((mv) => ({ x: mv.o.x, y: mv.o.y, rot: mv.o.rot || 0 }));
          wb.select([]);
          const t0 = performance.now(), ms = C.anim(1000);
          const step = (now) => {
            const k = Math.min(1, (now - t0) / ms), e = 0.5 - Math.cos(k * Math.PI) / 2;
            moves.forEach((mv, i) => {
              let dr = G.normDeg(mv.pl.rot - from[i].rot); if (dr > 180) dr -= 360;
              wb.update(mv.o, { x: from[i].x + (mv.pl.x - from[i].x) * e, y: from[i].y + (mv.pl.y - from[i].y) * e, rot: from[i].rot + dr * e });
            });
            if (k < 1) { requestAnimationFrame(step); return; }
            moves.forEach((mv) => { Object.assign(mv.o, { x: mv.pl.x, y: mv.pl.y, rot: mv.pl.rot }); wb.renderObj(mv.o); });
            refresh();
            ctx.changed('solve');
          };
          requestAnimationFrame(step);
        },
        destroy() {
          wb.handlers.snap = null; wb.handlers.settle = null; wb.handlers.pick = null;
          wb.off('tap', onTap);
          clearTimeout(showTarget.t);
        }
      };
    },

    thumb(p) {
      const Po = C.Polyo;
      if (!Po) return '';
      const m = model(p);
      const b = Po.bbox(m.region);
      const pad = 0.6;
      let s = '<svg viewBox="' + (b.x0 - pad) + ' ' + (b.y0 - pad) + ' ' + (b.w + 2 * pad) + ' ' + (b.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
      const loops = Po.outline(m.region);
      s += '<path d="' + loops.map((l) => C.pathOf(l)).join('') + '" fill="var(--ink-2)" fill-opacity=".22" fill-rule="evenodd"/>';
      m.given.forEach((i) => {
        const pc = m.pieces[i];
        s += '<path d="' + Po.outline(pc.sol).map((l) => C.pathOf(l)).join('') + '" fill="' + pc.color + '" stroke="rgba(0,0,0,.45)" stroke-width=".06"/>';
      });
      s += '<path d="' + Po.innerEdges(m.region).map((e) => 'M' + e[0] + ' ' + e[1] + 'L' + e[2] + ' ' + e[3]).join('') + '" stroke="var(--ink-2)" stroke-opacity=".28" stroke-width=".05"/>';
      s += '<path d="' + loops.map((l) => C.pathOf(l)).join('') + '" fill="none" stroke="var(--ink-2)" stroke-width=".12" stroke-linejoin="round"/>';
      return s + '</svg>';
    }
  });

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  C.polyominoModel = model;

  C.css('polyomino', `
    .po-shadow { fill: var(--board); filter: drop-shadow(0 .06px .12px rgba(0,0,0,.4)); }
    .po-cell { fill: var(--board-2); }
    .po-grid { stroke: var(--grid-2); stroke-width: .035; fill: none; pointer-events: none; }
    .po-board-edge { fill: none; stroke: var(--ink-2); stroke-width: .09; stroke-linejoin: round; pointer-events: none; transition: stroke .3s; }
    .po-board.po-done .po-board-edge { stroke: var(--green); stroke-width: .14; }
    .po-tray { fill: rgba(255, 255, 255, .025); stroke: var(--line); stroke-width: .05; stroke-dasharray: .25 .18; }
    [data-theme="light"] .po-tray { fill: rgba(0, 0, 0, .025); }
    .po-body { stroke: none; }
    .po-inner { stroke: rgba(0, 0, 0, .22); stroke-width: .035; fill: none; }
    .po-bevel { stroke: rgba(255, 255, 255, .42); stroke-width: .055; fill: none; stroke-linejoin: round; }
    .po-edge { stroke: rgba(0, 0, 0, .55); stroke-width: .05; fill: none; stroke-linejoin: round; }
    .po-letter { font-weight: 800; font-family: "Segoe UI", system-ui, sans-serif; fill: rgba(0, 0, 0, .36); pointer-events: none; }
    .po-pin { fill: rgba(0, 0, 0, .4); stroke: rgba(255, 255, 255, .5); stroke-width: .03; }
    .po-overcell { fill: rgba(255, 70, 70, .5); stroke: var(--red); stroke-width: .05; pointer-events: none; }
    .po-hintpoly { fill: rgba(255, 209, 102, .2); stroke: var(--gold); stroke-width: .09; stroke-dasharray: .22 .14; stroke-linejoin: round; pointer-events: none; animation: populse 1s ease-in-out infinite; }
    .po-badpoly { fill: rgba(255, 90, 90, .15); stroke: var(--red); stroke-width: .11; stroke-dasharray: .22 .14; stroke-linejoin: round; pointer-events: none; animation: populse 1s ease-in-out infinite; }
    @keyframes populse { 50% { opacity: .45; } }
    .wb-obj.po-hinted { animation: wbflash 1.2s ease-in-out 2; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
