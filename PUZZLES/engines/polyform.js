/* The Puzzle Cabinet · engines/polyform.js
 *
 * Polyiamonds and polyhexes: pieces made of equilateral triangles (the
 * twelve hexiamonds, the sphinx, tetriamonds, pentiamonds, heptiamonds) or of
 * regular hexagons (trihexes, the seven tetrahexes, pentahexes), to be packed
 * into a board of the same cells, every cell covered exactly once. The pieces
 * snap to the lattice, turn by sixths of a turn and may be turned over. On the
 * triangle grid a piece turned by 60° swaps its up and down triangles, so it
 * only fits where the board's triangles point the other way.
 *
 * data: {
 *   grid:   'tri' | 'hex'
 *   pieces: ['P6', 'I6', 'Y4', ...]   named pieces (js/lib/polyform.js LIB) or rows of text
 *   sol:    ['.0011..', ...]  the board, each cell marked with the index of the piece covering
 *                             it in one solution ('0'-'9', 'a'-'z', 'A'-'Z'); '.' no cell.
 *                             Triangles: character X of row Y is the triangle (X, Y), pointing up
 *                             when X + Y is even. Hexagons: only X + Y even are cells (' ' between).
 *   given:  [3, 7]            optional: these pieces start in place and stay there
 *   classic: 1                optional: verify also runs the exact-cover search
 *   tone:   1                 optional: start with the board's colouring shown
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
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  // the puzzle read from its data: grid, board cells, pieces and their cells in the stored solution
  function model(p) {
    const PF = C.Polyform, d = p.data;
    const g = PF.G[d.grid];
    const m = PF.grid(g, d.sol);
    const region = [], byPiece = [], bad = [], off = [];
    m.forEach((ch, k) => {
      const xy = k.split(',').map(Number);
      if (!g.valid(xy)) { off.push(xy); return; }
      region.push(xy);
      const i = CH.indexOf(ch);
      if (i < 0 || i >= d.pieces.length) bad.push(ch);
      else (byPiece[i] = byPiece[i] || []).push(xy);
    });
    const pieces = d.pieces.map((spec, i) => {
      const L = PF.piece(g, spec, i);
      return { i, spec, name: L.name, full: L.full, num: L.num, color: L.color, cells: L.cells, canon: PF.canon(g, L.cells), sol: byPiece[i] || [] };
    });
    return { g, region, pieces, bad, off, given: new Set(d.given || []) };
  }

  // the turning point of a piece: the lattice point (a triangle corner, a hexagon centre) nearest its middle,
  // so turns by 60° keep every cell on the grid
  function pivotOf(g, cells) {
    let sx = 0, sy = 0;
    cells.forEach((c) => { const q = g.centre(c); sx += q[0]; sy += q[1]; });
    return C.Polyform.latticePoint([sx / cells.length, sy / cells.length]);
  }

  // a loop shrunk by d on every side (corners of any angle)
  function inset(loop, d) {
    const n = loop.length, out = [];
    for (let i = 0; i < n; i++) {
      const a = loop[(i + n - 1) % n], b = loop[i], c = loop[(i + 1) % n];
      const d1 = G.norm(G.sub(b, a)), d2 = G.norm(G.sub(c, b));
      const n1 = [-d1[1], d1[0]], n2 = [-d2[1], d2[0]];
      const k = d / Math.max(0.2, 1 + n1[0] * n2[0] + n1[1] * n2[1]);
      out.push([b[0] + k * (n1[0] + n2[0]), b[1] + k * (n1[1] + n2[1])]);
    }
    return out;
  }
  const r3 = (v) => Math.round(v * 1000) / 1000;
  const firstCell = (cs) => cs.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0])[0];
  const pathOf = (pts) => 'M' + pts.map((q) => r3(q[0]) + ' ' + r3(q[1])).join('L') + 'Z';

  // the drawing of a piece in its own coordinates (pivot at 0, 0)
  function shapeData(g, cells, pv) {
    const PF = C.Polyform;
    const sh = (q) => [q[0] - pv[0], q[1] - pv[1]];
    const loops = PF.outline(g, cells).map((l) => l.map(sh));
    const cen = cells.map((c) => sh(g.centre(c)));
    let mx = 0, my = 0;
    cen.forEach((q) => { mx += q[0]; my += q[1]; });
    mx /= cen.length; my /= cen.length;
    let lab = cen[0], bd = Infinity;
    cen.forEach((q) => { const dd = Math.hypot(q[0] - mx, q[1] - my); if (dd < bd - 1e-9) { bd = dd; lab = q; } });
    return {
      loop: loops[0],
      cen,
      path: loops.map(pathOf).join(''),
      inner: PF.innerEdges(g, cells).map((e) => { const a = sh([e[0], e[1]]), b = sh([e[2], e[3]]); return 'M' + r3(a[0]) + ' ' + r3(a[1]) + 'L' + r3(b[0]) + ' ' + r3(b[1]); }).join(''),
      bevel: loops.map((l) => pathOf(inset(l, g.id === 'tri' ? 0.06 : 0.07))).join(''),
      cellPolys: cells.map((c) => ({ up: g.id === 'tri' ? g.up(c) : null, d: pathOf(PF.poly(g, c).map(sh)) })),
      label: lab
    };
  }

  // lay the pieces out in rows no wider than maxW (world units)
  function shelves(items, maxW) {
    const order = items.map((it, i) => i).sort((a, b) => items[b].h - items[a].h || a - b);
    let x = 0, y = 0, rowH = 0, W = 0;
    const pos = [];
    for (const i of order) {
      const it = items[i];
      if (x > 0 && x + it.w > maxW + 1e-9) { x = 0; y += rowH + 1; rowH = 0; }
      pos[i] = [x, y];
      x += it.w + 1.2;
      rowH = Math.max(rowH, it.h);
      W = Math.max(W, x - 1.2);
    }
    return { pos, w: W, h: y + rowH };
  }

  // where the tray goes (right of the board or under it) and how wide, for the biggest view
  function layout(board, items, stage) {
    const sw = Math.max(200, stage.w - (stage.w < 560 ? 0 : 60)), sh = Math.max(200, stage.h - (stage.w < 560 ? 60 : 0));
    const maxPiece = items.reduce((m, it) => Math.max(m, it.w), 1);
    const sumW = items.reduce((m, it) => m + it.w + 1.2, 0);
    let best = null;
    for (let mw = maxPiece; mw <= Math.max(maxPiece, sumW) + 1e-9; mw += 0.5) {
      const t = shelves(items, mw);
      if (!items.length) { t.w = 0; t.h = 0; }
      [['right', board.w + 2 + t.w, Math.max(board.h, t.h)], ['below', Math.max(board.w, t.w), board.h + 2 + t.h]].forEach(([side, w, h]) => {
        const k = Math.min(sw / (w + 1.2), sh / (h + 1.2));
        if (!best || k > best.k + 1e-9) best = { k, side, t, w, h };
      });
    }
    const b = best, t = b.t;
    let tx, ty;
    if (b.side === 'right') { tx = board.x1 + 2; ty = board.y0 + (board.h - t.h) / 2; }
    else { tx = board.x0 + (board.w - t.w) / 2; ty = board.y1 + 2; }
    return { side: b.side, tray: { x: tx, y: ty, w: t.w, h: t.h }, pos: t.pos.map((q) => [q[0] + tx, q[1] + ty]) };
  }

  /* ---------- words ---------- */

  const WORDS = {
    tri: ['Arrowhead', 'Beacon', 'Bishop\'s Mitre', 'Bow Tie', 'Buoy', 'Burgee', 'Cairn', 'Chalet', 'Crystal', 'Cutwater', 'Delta', 'Diamond Mine', 'Dormer', 'Dragon Kite', 'Fan', 'Felucca', 'Fir', 'Flint', 'Galleon', 'Gable', 'Glacier', 'Hourglass', 'Iceberg', 'Jib', 'Junk', 'Kite', 'Lateen', 'Lighthouse', 'Mainsail', 'Moth', 'Needle', 'Obelisk', 'Origami Crane', 'Paper Hat', 'Pavilion', 'Pennant', 'Pinnacle', 'Plectrum', 'Prism', 'Pyramid', 'Quartz', 'Ridge Tent', 'Sandbar', 'Scree', 'Shard', 'Snowflake', 'Spinnaker', 'Spire', 'Staircase', 'Starfish', 'Steeple', 'Summit', 'Swallowtail', 'Tepee', 'Topsail', 'Trefoil', 'Trowel', 'Tuning Fork', 'Wedge', 'Weathervane', 'Windmill', 'Yardarm', 'Zigzag', 'Anchor', 'Bunting', 'Carousel', 'Chevron Road', 'Compass Rose', 'Crest', 'Dune', 'Escarpment', 'Fjord', 'Gemstone', 'Harlequin', 'Jester\'s Cap', 'Kaleidoscope', 'Mosaic', 'Nib', 'Paper Plane', 'Quill', 'Rooftops', 'Shark Fin', 'Sierra', 'Tangram Table', 'Thorn', 'Tricorn', 'Wavecrest', 'Whirligig', 'Wimple', 'Ziggurat'],
    hex: ['Acorn Cup', 'Apiary', 'Basalt', 'Beehive', 'Bolt', 'Bubble Wrap', 'Button Box', 'Clover', 'Cobbles', 'Comb', 'Coral', 'Drone', 'Frogspawn', 'Giant\'s Causeway', 'Grapes', 'Hive', 'Honeypot', 'Lily Pads', 'Mosaic', 'Nectar', 'Nut and Bolt', 'Pantry', 'Pebbledash', 'Pollen', 'Propolis', 'Queen Cell', 'Raspberry', 'Rosette', 'Snowdrift', 'Soap Suds', 'Stepping Stones', 'Sunflower', 'Tortoise Shell', 'Turtle', 'Wax', 'Wasp Nest', 'Pineapple', 'Quilt', 'Board Game', 'Bath Tiles', 'Bee Dance', 'Blackberry', 'Bumblebee', 'Buttercup', 'Chicken Wire', 'Clockwork', 'Dragonfly Eye', 'Fly\'s Eye', 'Foxglove', 'Hazelnut', 'Heather', 'Hexagon Hall', 'Lavender', 'Marigold', 'Meadow', 'Nutshell', 'Orchard', 'Pepperpot', 'Pinecone', 'Sugar Lumps', 'Thimble', 'Waffle', 'Wildflower', 'Worker Bee', 'Royal Jelly', 'Snow Crystal', 'Bee Garden', 'Cornflower', 'Dandelion']
  };
  C.polyformWords = WORDS;
  const TEMPL = [
    (d) => 'Fit ' + d + ' into the board.',
    (d, n, g) => 'Every ' + g.cell + ' covered, every piece used: ' + d + '.',
    (d, n, g) => 'A board of ' + n + ' ' + g.cells + ', and ' + d + ' to fill it.',
    (d) => 'Cover the board with ' + d + ' — no gaps, no overlaps.',
    (d) => 'Pack ' + d + ' into this shape.'
  ];
  C.polyformTexts = TEMPL;

  // endless: which pieces for a level
  function endlessSet(rng, level, grid) {
    const PF = C.Polyform, Sx = PF.SETS[grid];
    const some = (list, k) => rng.shuffle(list.slice()).slice(0, k);
    const many = (list, k) => { const a = []; for (let i = 0; i < k; i++) a.push(rng.pick(list)); return a; };
    if (grid === 'tri') {
      const small = ['D2', 'I3'].concat(Sx.tetri);
      return rng.pick({
        1: [() => many(small, 2 + rng.int(2)), () => some(Sx.tetri, 2).concat(some(Sx.penti, 1)), () => some(Sx.hexi, 2)],
        2: [() => Sx.tetri.concat(some(Sx.penti, 1 + rng.int(2))), () => some(Sx.hexi, 3), () => Sx.penti.slice(), () => ['P6', 'P6', 'P6']],
        3: [() => some(Sx.hexi, 4 + rng.int(2)), () => Sx.tetri.concat(Sx.penti), () => some(Sx.hepta, 3), () => some(Sx.hexi, 2).concat(Sx.penti)],
        4: [() => some(Sx.hexi, 6 + rng.int(2)), () => some(Sx.hepta, 4 + rng.int(2)), () => Sx.penti.concat(some(Sx.hexi, 4))],
        5: [() => some(Sx.hexi, 8 + rng.int(3)), () => some(Sx.hepta, 6 + rng.int(2)), () => some(Sx.hexi, 5).concat(some(Sx.hepta, 3))]
      }[level])();
    }
    const small = ['I2'].concat(Sx.tri);
    return rng.pick({
      1: [() => many(small, 2 + rng.int(2)), () => some(Sx.tetra, 2), () => some(Sx.tri, 2).concat(some(Sx.tetra, 1))],
      2: [() => some(Sx.tetra, 3 + rng.int(2)), () => Sx.tri.concat(some(Sx.tetra, 1)), () => some(Sx.penta, 2).concat(some(Sx.tri, 1))],
      3: [() => Sx.tetra.slice(), () => some(Sx.penta, 4), () => Sx.tri.concat(some(Sx.tetra, 3))],
      4: [() => Sx.tri.concat(Sx.tetra), () => some(Sx.penta, 5 + rng.int(2)), () => some(Sx.tetra, 4).concat(some(Sx.penta, 3))],
      5: [() => some(Sx.penta, 7 + rng.int(2)), () => Sx.tetra.concat(some(Sx.penta, 4)), () => Sx.tri.concat(Sx.tetra, some(Sx.penta, 2))]
    }[level])();
  }

  function pieceLabel(pc) {
    // the hexiamonds and tetrahexes have names of their own
    const L = C.Polyform.LIB;
    const e = L.tri[pc.name] || L.hex[pc.name];
    if (e && (e.hexi || e.tetra)) return 'the ' + pc.full;
    if (e && e.num) return pc.full;
    return 'the ' + pc.full;
  }

  C.engine({
    id: 'polyform',
    name: 'Triangles and hexagons',
    deps: ['js/lib/dlx.js', 'js/lib/polyform.js'],
    generates: ['polyiamonds', 'polyhexes'],

    // endless: a board grown from a random set of pieces; the level is the number and kind of pieces
    generate(rng, level, fam) {
      const PF = C.Polyform;
      const grid = fam && fam.id === 'polyhexes' ? 'hex' : 'tri';
      const g = PF.G[grid];
      const names = endlessSet(rng, level, grid).sort();
      const shapes = names.map((n, i) => PF.piece(g, n, i).cells);
      const area = shapes.reduce((s, c) => s + c.length, 0);
      for (let tries = 0; tries < 20; tries++) {
        const gr = PF.grow(g, shapes, rng, { aspect: 1.2 + rng() * 0.5 });
        if (!gr || PF.holes(g, gr.region)) continue;
        const L = PF.landscape(g, gr.region, gr.placements);
        const b = PF.bbox(g, L.region);
        if (b.h < 1.5) continue;
        return {
          title: 'The ' + rng.pick(WORDS[grid]),
          text: cap(rng.pick(TEMPL)(PF.describe(g, names), area, g)),
          diff: level,
          tags: ['endless'],
          data: { grid, pieces: names, sol: PF.solRows(g, L.region, L.placements) }
        };
      }
      return null;
    },
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { rotStep: 60, snapPx: 14 },
    noMoves: true,
    about(p) {
      const tri = !p || !p.data || p.data.grid !== 'hex';
      return 'Fill the board with **all** the pieces: every ' + (tri ? 'triangle' : 'hexagon') + ' covered once, nothing hanging over the edge. **Drag** a piece onto the board — it clicks into the grid. **Turn** it by a sixth of a turn with a **double-click**, the **R** key (Shift+R the other way), the round handle or Shift + wheel. **Turn it over** with **X** or the ⇋ button. ' +
        (tri ? 'The triangles of the grid point up and down in turn, and a piece turned by 60° swaps its own ups and downs, so each turn gives it a new chance to fit. ' : '') +
        'Pieces that overlap show red. Stuck? A hint places one piece of a solution that fits what you have built so far — or tells you which piece cannot stay. **' + (tri ? 'Two colours' : 'Three colours') + '** shades the board the classic way, for a colouring argument.';
    },

    verify(p) {
      const PF = C.Polyform;
      if (!PF || !C.DLX) return { ok: false, err: 'js/lib/polyform.js and js/lib/dlx.js are needed' };
      const d = p.data;
      if (!d || (d.grid !== 'tri' && d.grid !== 'hex')) return { ok: false, err: 'data.grid must be tri or hex' };
      if (!Array.isArray(d.sol) || !Array.isArray(d.pieces) || !d.pieces.length) return { ok: false, err: 'data needs sol and pieces' };
      if (d.pieces.length > CH.length) return { ok: false, err: 'too many pieces' };
      const m = model(p), g = m.g;
      if (m.off.length) return { ok: false, err: 'cell ' + m.off[0].join(',') + ' is not on the hexagon grid (X + Y must be even)' };
      if (m.bad.length) return { ok: false, err: 'unknown piece mark ' + m.bad[0] };
      for (const pc of m.pieces) {
        if (!pc.cells.length) return { ok: false, err: 'piece ' + pc.spec + ' has no cells' };
        if (!PF.connected(g, pc.cells)) return { ok: false, err: 'piece ' + pc.spec + ' is not connected' };
        if (!pc.sol.length) return { ok: false, err: 'piece ' + pc.i + ' (' + pc.spec + ') is missing from the solution' };
        if (PF.canon(g, pc.sol) !== pc.canon) return { ok: false, err: 'piece ' + pc.i + ' (' + pc.spec + ') has the wrong shape in the solution' };
      }
      for (const i of m.given) if (!(i >= 0 && i < m.pieces.length)) return { ok: false, err: 'bad given index ' + i };
      if (m.given.size >= m.pieces.length) return { ok: false, err: 'every piece is given' };
      // an independent check by the exact-cover search, where it is cheap (or asked for)
      if (d.classic || m.region.length <= 36) {
        const r = PF.pack({ grid: g, region: m.region, pieces: m.pieces.map((pc) => pc.cells), max: 1, nodeLimit: d.classic ? 6e5 : 1e5 });
        if (!r.sols.length && !r.aborted) return { ok: false, err: 'the exact-cover search finds no solution' };
      }
      return { ok: true };
    },

    mount(ctx, p) {
      const PF = C.Polyform, wb = ctx.wb, d = p.data;
      const m = model(p), g = m.g;
      const regionSet = new Set(m.region.map((c) => K(c[0], c[1])));
      const bb = PF.bbox(g, m.region);
      const total = m.region.length;
      const tri = g.id === 'tri';
      if (!p.goal) ctx.setGoal('Cover every ' + g.cell + ' of the board with all ' + C.plural(m.pieces.length, 'piece') + '.');
      let tone = !!d.tone;

      /* ---------- the pieces' drawings ---------- */
      const shapes = m.pieces.map((pc) => {
        const pv = pivotOf(g, pc.cells);
        return Object.assign({ pv }, shapeData(g, pc.cells, pv));
      });
      const oddTurn = (o) => ((Math.round((o.rot || 0) / 60) % 2) + 2) % 2 === 1;
      wb.type('pform', {
        poly(o) { return shapes[o.data.i].loop; },
        draw(gg, o) {
          const sh = shapes[o.data.i], pc = m.pieces[o.data.i];
          S('path', { d: sh.path, class: 'pf-body', fill: o.fill || pc.color, 'fill-rule': 'evenodd' }, gg);
          if (tone && tri) {
            // a sixth of a turn swaps up and down: shade the triangles that point down on the table
            const odd = oddTurn(o);
            const dn = sh.cellPolys.filter((cp) => cp.up === odd).map((cp) => cp.d).join('');
            if (dn) S('path', { d: dn, class: 'pf-shade' }, gg);
          }
          if (sh.inner) S('path', { d: sh.inner, class: 'pf-inner' }, gg);
          S('path', { d: sh.bevel, class: 'pf-bevel' }, gg);
          S('path', { d: sh.path, class: 'pf-edge' }, gg);
          if (o.data.given) S('circle', { cx: sh.label[0], cy: sh.label[1], r: tri ? 0.08 : 0.1, class: 'pf-pin' }, gg);
          else if (pc.num) {
            // heptiamonds and pentahexes have numbers, not names: the hints call them by it
            const t = S('text', { x: 0, y: 0, 'font-size': tri ? 0.3 : 0.42, class: 'pf-num', 'text-anchor': 'middle', 'dominant-baseline': 'central',
              transform: 'translate(' + r3(sh.label[0]) + ' ' + r3(sh.label[1]) + ') scale(' + (o.flip ? -1 : 1) + ' 1) rotate(' + (-(o.rot || 0)) + ')' }, gg);
            t.textContent = pc.num;
          }
        }
      });

      /* ---------- the board ---------- */
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const boardG = S('g', { class: 'pf-board pf-' + g.id + (tone ? ' pf-tone' : '') }, board);
      const loopD = PF.outline(g, m.region).map(pathOf).join('');
      S('path', { d: loopD, class: 'pf-shadow', 'fill-rule': 'evenodd' }, boardG);
      m.region.forEach((c) => S('path', { d: pathOf(PF.poly(g, c)), class: 'pf-cell pf-c' + PF.colour(g, c), 'data-key': 'c' + c[0] + '_' + c[1] }, boardG));
      const gridD = PF.innerEdges(g, m.region).map((e) => 'M' + r3(e[0]) + ' ' + r3(e[1]) + 'L' + r3(e[2]) + ' ' + r3(e[3])).join('');
      S('path', { d: gridD, class: 'pf-grid' }, boardG);
      S('path', { d: loopD, class: 'pf-board-edge', 'fill-rule': 'evenodd' }, boardG);
      const overG = S('g', { class: 'pf-over' }, top);
      const hintG = S('g', { class: 'pf-hint' }, top);
      wb.applyPaints();

      /* ---------- the tray and the pieces ---------- */
      const loose = m.pieces.filter((pc) => !m.given.has(pc.i));
      const items = loose.map((pc) => { const b = PF.bbox(g, pc.cells); return { w: b.w, h: b.h, b }; });
      const L = layout(bb, items, wb.size());
      if (loose.length) {
        const tr = L.tray;
        S('rect', { x: tr.x - 0.55, y: tr.y - 0.55, width: tr.w + 1.1, height: tr.h + 1.1, rx: 0.4, class: 'pf-tray' }, bg);
      }
      m.pieces.forEach((pc) => {
        const sh = shapes[pc.i];
        const spec = {
          id: 'pc' + pc.i, type: 'pform', kind: 'pform', name: cap(pc.full),
          rotate: 60, flipable: true, snap: true, fill: pc.color, hit: tri ? 0.14 : 0,
          data: { i: pc.i }
        };
        if (m.given.has(pc.i)) {
          Object.assign(spec, placement(pc.i, pc.sol, 0, false), { move: false, rotate: false, flipable: false, cls: 'given' });
          spec.data.given = 1;
        } else {
          const k = loose.indexOf(pc), it = items[k], at = L.pos[k];
          const q = PF.latticePoint([at[0] - it.b.x0 + sh.pv[0], at[1] - it.b.y0 + sh.pv[1]]);
          spec.x = q[0]; spec.y = q[1];
        }
        wb.add(spec);
      });
      const trayBox = loose.length ? [[L.tray.x - 0.55, L.tray.y - 0.55], [L.tray.x + L.tray.w + 0.55, L.tray.y + L.tray.h + 0.55]] : [[bb.x0, bb.y0]];
      const b0 = G.bbox([[[bb.x0, bb.y0], [bb.x1, bb.y1]], trayBox]);
      wb.setBounds({ x0: b0.x0 - 0.5, y0: b0.y0 - 0.5, x1: b0.x1 + 0.5, y1: b0.y1 + 0.5 }, 0.05);

      /* ---------- geometry of the pieces on the table ---------- */
      function pieces() { return m.pieces.map((pc) => wb.get('pc' + pc.i)).filter(Boolean); }
      // the board cells a piece covers (or null when it is off the grid)
      function cellsOf(o, at) {
        const sh = shapes[o.data.i], t = at || o, out = [];
        for (const q of sh.cen) {
          const w = G.place(q, t);
          const c = g.at(w), cc = g.centre(c);
          if (Math.abs(cc[0] - w[0]) > 0.05 || Math.abs(cc[1] - w[1]) > 0.05) return null;
          out.push(c);
        }
        return out;
      }
      // the placement { x, y, rot, flip } that puts piece i on these cells, turned as little as possible from rotHint
      function placement(i, target, rotHint, flipHint) {
        const pc = m.pieces[i], sh = shapes[i];
        const want = PF.key(g, target);
        let best = null, bs = Infinity;
        for (let t = 0; t < 12; t++) {
          if (PF.key(g, PF.orient(g, pc.cells, t)) !== want) continue;
          const rot = (t % 6) * 60, flip = t >= 6;
          let dr = Math.abs(G.normDeg(rot - (rotHint || 0))); if (dr > 180) dr = 360 - dr;
          const sc = dr + (flip !== !!flipHint ? 1000 : 0);
          if (sc < bs) { bs = sc; best = { rot, flip }; }
        }
        if (!best) return null;
        const W = sh.cen.map((q) => g.at(G.place(q, { x: 0, y: 0, rot: best.rot, flip: best.flip })));
        const a = firstCell(W), b = firstCell(target);
        return { x: (b[0] - a[0]) / 2, y: (b[1] - a[1]) * PF.H, rot: best.rot, flip: best.flip };
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
          S('path', { d: pathOf(PF.poly(g, xy, tri ? 0.1 : 0.07)), class: 'pf-overcell' }, overG);
        });
        const placed = cv.info.filter((r) => r.placed).length;
        ctx.stat('Pieces', placed + ' / ' + m.pieces.length);
        ctx.stat(cap(g.cells), cv.covered + ' / ' + total);
        boardG.classList.toggle('pf-done', cv.covered === total && !cv.over && placed === m.pieces.length);
        return cv;
      }

      /* ---------- the colouring ---------- */
      const toneBtn = ctx.button('', () => setTone(!tone), 'small');
      const legend = C.h('div.pf-legend');
      ctx.panel.appendChild(legend);
      function setTone(on) {
        tone = on;
        boardG.classList.toggle('pf-tone', on);
        toneBtn.textContent = on ? 'Hide the colours' : (tri ? 'Two colours: up and down' : 'Three colours');
        if (tri) pieces().forEach((o) => wb.renderObj(o));
        legend.innerHTML = '';
        if (!on) return;
        const n = PF.colourCount(g, m.region);
        const sw = (k) => '<span class="pf-sw pf-sw' + g.id + k + '"></span>';
        legend.innerHTML = tri
          ? 'The board: ' + sw(0) + ' <b>' + n[0] + '</b> pointing up, ' + sw(1) + ' <b>' + n[1] + '</b> pointing down. On the pieces, the darker triangles point down.'
          : 'The board: ' + sw(0) + ' <b>' + n[0] + '</b>, ' + sw(1) + ' <b>' + n[1] + '</b>, ' + sw(2) + ' <b>' + n[2] + '</b> — neighbours never share a colour.';
      }
      setTone(tone);

      /* ---------- handlers ---------- */
      wb.handlers.snap = (o, at) => {
        if (!o.data || o.data.i == null) return null;
        const q = PF.latticePoint([at.x, at.y]);
        return { x: q[0], y: q[1] };
      };
      wb.handlers.settle = (list, why) => {
        list.forEach((o) => {
          if (!o.data || o.data.i == null) return;
          o.rot = G.normDeg(Math.round((o.rot || 0) / 60) * 60);
          const q = PF.latticePoint([o.x, o.y]);
          o.x = q[0]; o.y = q[1];
          if (why === 'rotate' || why === 'flip') wb.renderObj(o);
        });
        hintG.innerHTML = '';
      };
      // a double tap turns a piece (the workbench's pointer capture hides dblclick targets, so taps are timed here)
      let lastTap = { id: null, t: 0 };
      const onTap = (e) => {
        const o = e && e.obj;
        if (!o || !o.data || o.data.i == null) return;
        const now = Date.now();
        if (lastTap.id === o.id && now - lastTap.t < 380) {
          lastTap = { id: null, t: 0 };
          if (o.rotate && !o.locked) { wb.select([o]); wb.rotateSel(60, [o]); }
        } else lastTap = { id: o.id, t: now };
      };
      wb.on('tap', onTap);
      wb.on('change', () => refresh());
      wb.on('restore', () => { hintG.innerHTML = ''; refresh(); });
      refresh();

      /* ---------- solving: from what is on the board, or the stored solution ---------- */
      let stopAnim = null;
      wb.handlers.pick = (o, list) => { if (stopAnim) return false; wb.raise(list); };
      const nameOf = (pc) => pieceLabel(pc);
      function stored() { return m.pieces.map((pc) => ({ piece: pc.i, cells: pc.sol })); }
      // a solution that keeps every cleanly placed piece where it is
      function plan(nodeLimit) {
        const cv = coverage();
        const good = cv.info.filter((r) => r.clean);
        const fixed = good.map((r) => ({ piece: r.o.data.i, cells: r.cells }));
        const res = PF.pack({ grid: g, region: m.region, pieces: m.pieces.map((pc) => pc.cells), fixed, max: 1, nodeLimit: nodeLimit || 3e5 });
        if (res.sols.length) return { sol: fixed.concat(res.sols[0]), good, cv };
        return { none: !res.aborted, aborted: res.aborted, good, cv };
      }
      const cellsKey = (cs) => cs.map((c) => c[0] + ',' + c[1]).sort().join(' ');
      function sameCells(a, b) { return a && b && a.length === b.length && cellsKey(a) === cellsKey(b); }
      // does the stored solution agree with the pieces placed so far?
      function storedAgrees(good) {
        return good.every((r) => m.pieces.some((pc) => pc.canon === m.pieces[r.o.data.i].canon && sameCells(pc.sol, r.cells)));
      }
      function showTarget(cells, o, cls) {
        hintG.innerHTML = '';
        // the floating bar of a selected piece could hide the outline
        wb.select([]);
        PF.outline(g, cells).forEach((l) => S('path', { d: pathOf(l), class: cls || 'pf-hintpoly' }, hintG));
        if (o && o.el) { o.el.classList.remove('pf-hinted'); void o.el.getBBox; o.el.classList.add('pf-hinted'); setTimeout(() => o.el && o.el.classList.remove('pf-hinted'), 2400); }
        clearTimeout(showTarget.t);
        showTarget.t = setTimeout(() => { hintG.innerHTML = ''; }, 6000);
      }
      // the empty cell that is hardest to fill (fewest empty neighbours), top-left first
      function hardest(sol, covered) {
        let best = null, bs = 9;
        m.region.slice().sort((a, b) => a[1] - b[1] || a[0] - b[0]).forEach((c) => {
          if (covered.has(K(c[0], c[1]))) return;
          let n = 0;
          g.nb(c).forEach((q) => { const k = K(q[0], q[1]); if (regionSet.has(k) && !covered.has(k)) n++; });
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
          if (cv.over) return { solved: false, msg: 'Pieces overlap on ' + C.plural(cv.over, g.cell) + ' (shown red).' };
          const hang = cv.info.find((r) => r.inside > 0 && r.outside > 0);
          if (hang) return { solved: false, msg: cap(nameOf(m.pieces[hang.o.data.i])) + ' hangs over the edge.' };
          const off = cv.info.filter((r) => !r.placed);
          if (cv.covered === total && !off.length) return { solved: true, msg: 'Every ' + g.cell + ' covered exactly once.' };
          if (!manual) return { solved: false };
          return { solved: false, msg: C.plural(total - cv.covered, g.cell) + ' still empty' + (off.length ? ', ' + C.plural(off.length, 'piece') + ' still to place' : '') + '.' };
        },
        hint() {
          const pr = plan(3e5);
          const mine = pr.good.filter((r) => !m.given.has(r.o.data.i)).length;
          if (pr.sol) return suggest(pr.sol, pr.good, mine ? (mine === 1 ? 'The piece you have placed can stay. ' : 'All ' + (NUMW[mine] || mine) + ' pieces you have placed can stay. ') : '');
          if (pr.none) {
            // which placed piece is in the way? (within a time budget: big boards must not stall the page)
            const t0 = Date.now();
            for (const r of pr.good) {
              if (Date.now() - t0 > 1500) break;
              if (m.given.has(r.o.data.i)) continue;
              const fixed = pr.good.filter((q) => q !== r).map((q) => ({ piece: q.o.data.i, cells: q.cells }));
              const res = PF.pack({ grid: g, region: m.region, pieces: m.pieces.map((pc) => pc.cells), fixed, max: 1, nodeLimit: 1e5 });
              if (res.sols.length) {
                const pc = m.pieces[r.o.data.i];
                return { text: 'The board cannot be finished from here: ' + nameOf(pc) + ' cannot stay where it is (outlined in red).', show() { showTarget(r.cells, r.o, 'pf-badpoly'); } };
              }
            }
            return 'The board cannot be finished with the pieces where they are now, and moving any single one is not enough. Take a few pieces off and try again.';
          }
          if (storedAgrees(pr.good)) {
            const st = stored().filter((s) => !pr.good.some((r) => r.o.data.i === s.piece || sameCells(r.cells, s.cells)));
            return suggest(st.concat(pr.good.map((r) => ({ piece: r.o.data.i, cells: r.cells }))), pr.good);
          }
          const odd = pr.good.find((r) => !m.given.has(r.o.data.i) && !m.pieces.some((pc) => pc.canon === m.pieces[r.o.data.i].canon && sameCells(pc.sol, r.cells)));
          if (odd) return { text: 'This is a big search, so I checked against the solution I know: ' + nameOf(m.pieces[odd.o.data.i]) + ' is not where that solution has it. It might still work — or it might not.', show() { showTarget(odd.cells, odd.o, 'pf-badpoly'); } };
          return 'Keep going — no piece is obviously wrong.';
        },
        solve() {
          hintG.innerHTML = '';
          if (stopAnim) { stopAnim(); stopAnim = null; }
          const pr = plan(3e5);
          const sol = pr.sol || stored();
          // which object goes where, and in what order: top rows first, for a tidy cascade
          const moves = [];
          sol.forEach((s) => {
            const o = wb.get('pc' + s.piece);
            if (!o || o.data.given) return;
            const pl = placement(s.piece, s.cells, o.rot, o.flip);
            if (pl) moves.push({ o, pl, at: firstCell(s.cells) });
          });
          moves.sort((a, b) => a.at[1] - b.at[1] || a.at[0] - b.at[0]);
          moves.forEach((mv) => { if (!!mv.o.flip !== mv.pl.flip) { mv.o.flip = mv.pl.flip; mv.o.rot = G.normDeg(-(mv.o.rot || 0)); wb.renderObj(mv.o); } });
          const from = moves.map((mv) => ({ x: mv.o.x, y: mv.o.y, rot: mv.o.rot || 0 }));
          const n = moves.length, per = n > 1 ? 0.5 : 1;
          const ease = (t) => 0.5 - Math.cos(t * Math.PI) / 2;
          wb.select([]);
          wb.raise(moves.map((mv) => mv.o));
          stopAnim = C.tween(C.anim(Math.min(2600, 700 + 120 * n)), (t) => {
            moves.forEach((mv, i) => {
              const s0 = n > 1 ? (1 - per) * i / (n - 1) : 0;
              const k = ease(Math.max(0, Math.min(1, (t - s0) / per)));
              let dr = G.normDeg(mv.pl.rot - from[i].rot); if (dr > 180) dr -= 360;
              wb.update(mv.o, { x: from[i].x + (mv.pl.x - from[i].x) * k, y: from[i].y + (mv.pl.y - from[i].y) * k, rot: from[i].rot + dr * k });
            });
          }, () => {
            stopAnim = null;
            moves.forEach((mv) => { Object.assign(mv.o, { x: mv.pl.x, y: mv.pl.y, rot: mv.pl.rot }); wb.renderObj(mv.o); });
            refresh();
            ctx.changed('solve');
          }, 'linear');
        },
        destroy() {
          wb.handlers.snap = null; wb.handlers.settle = null; wb.handlers.pick = null;
          wb.off('tap', onTap);
          clearTimeout(showTarget.t);
          if (stopAnim) { stopAnim(); stopAnim = null; }
        }
      };
    },

    thumb(p) {
      const PF = C.Polyform;
      if (!PF) return '';
      const m = model(p), g = m.g;
      const b = PF.bbox(g, m.region);
      const pad = 0.5;
      let s = '<svg viewBox="' + r3(b.x0 - pad) + ' ' + r3(b.y0 - pad) + ' ' + r3(b.w + 2 * pad) + ' ' + r3(b.h + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">';
      const loopD = PF.outline(g, m.region).map(pathOf).join('');
      s += '<path d="' + loopD + '" fill="var(--ink-2)" fill-opacity=".22" fill-rule="evenodd"/>';
      m.given.forEach((i) => {
        const pc = m.pieces[i];
        s += '<path d="' + PF.outline(g, pc.sol).map(pathOf).join('') + '" fill="' + pc.color + '" stroke="rgba(0,0,0,.45)" stroke-width=".05" fill-rule="evenodd"/>';
      });
      s += '<path d="' + PF.innerEdges(g, m.region).map((e) => 'M' + r3(e[0]) + ' ' + r3(e[1]) + 'L' + r3(e[2]) + ' ' + r3(e[3])).join('') + '" stroke="var(--ink-2)" stroke-opacity=".28" stroke-width=".045"/>';
      s += '<path d="' + loopD + '" fill="none" stroke="var(--ink-2)" stroke-width=".1" stroke-linejoin="round"/>';
      return s + '</svg>';
    }
  });

  C.polyformModel = model;

  C.css('polyform', `
    .pf-shadow { fill: var(--board); filter: drop-shadow(0 .06px .12px rgba(0,0,0,.4)); }
    .pf-cell { fill: var(--board-2); transition: fill .25s; }
    .pf-tone.pf-tri .pf-c1 { fill: color-mix(in srgb, var(--board-2) 66%, var(--ink) 34%); }
    .pf-tone.pf-hex .pf-c0 { fill: color-mix(in srgb, var(--board-2) 70%, var(--accent) 30%); }
    .pf-tone.pf-hex .pf-c1 { fill: color-mix(in srgb, var(--board-2) 70%, var(--teal) 30%); }
    .pf-tone.pf-hex .pf-c2 { fill: color-mix(in srgb, var(--board-2) 70%, var(--gold) 30%); }
    .pf-sw { display: inline-block; width: .9em; height: .9em; border-radius: 3px; vertical-align: -.1em; border: 1px solid var(--line); }
    .pf-swtri0 { background: var(--board-2); }
    .pf-swtri1 { background: color-mix(in srgb, var(--board-2) 66%, var(--ink) 34%); }
    .pf-swhex0 { background: color-mix(in srgb, var(--board-2) 70%, var(--accent) 30%); }
    .pf-swhex1 { background: color-mix(in srgb, var(--board-2) 70%, var(--teal) 30%); }
    .pf-swhex2 { background: color-mix(in srgb, var(--board-2) 70%, var(--gold) 30%); }
    .pf-legend { font-size: .86em; color: var(--muted); margin: .35em 0 .2em; line-height: 1.5; }
    .pf-legend:empty { display: none; }
    .pf-grid { stroke: var(--grid-2); stroke-width: .03; fill: none; pointer-events: none; }
    .pf-board-edge { fill: none; stroke: var(--ink-2); stroke-width: .08; stroke-linejoin: round; pointer-events: none; transition: stroke .3s; }
    .pf-board.pf-done .pf-board-edge { stroke: var(--green); stroke-width: .13; }
    .pf-tray { fill: rgba(255, 255, 255, .025); stroke: var(--line); stroke-width: .05; stroke-dasharray: .25 .18; }
    [data-theme="light"] .pf-tray { fill: rgba(0, 0, 0, .025); }
    .pf-body { stroke: none; }
    .pf-shade { fill: rgba(0, 0, 0, .2); stroke: none; pointer-events: none; }
    .pf-inner { stroke: rgba(0, 0, 0, .22); stroke-width: .03; fill: none; }
    .pf-bevel { stroke: rgba(255, 255, 255, .42); stroke-width: .05; fill: none; stroke-linejoin: round; }
    .pf-edge { stroke: rgba(0, 0, 0, .55); stroke-width: .045; fill: none; stroke-linejoin: round; }
    .pf-pin { fill: rgba(0, 0, 0, .4); stroke: rgba(255, 255, 255, .5); stroke-width: .03; }
    .pf-num { font-weight: 800; font-family: "Segoe UI", system-ui, sans-serif; fill: rgba(0, 0, 0, .42); pointer-events: none; }
    .pf-overcell { fill: rgba(255, 70, 70, .5); stroke: var(--red); stroke-width: .045; stroke-linejoin: round; pointer-events: none; }
    .pf-hintpoly { fill: rgba(255, 209, 102, .2); stroke: var(--gold); stroke-width: .08; stroke-dasharray: .2 .13; stroke-linejoin: round; pointer-events: none; animation: pfpulse 1s ease-in-out infinite; }
    .pf-badpoly { fill: rgba(255, 90, 90, .15); stroke: var(--red); stroke-width: .1; stroke-dasharray: .2 .13; stroke-linejoin: round; pointer-events: none; animation: pfpulse 1s ease-in-out infinite; }
    @keyframes pfpulse { 50% { opacity: .45; } }
    .wb-obj.pf-hinted { animation: wbflash 1.2s ease-in-out 2; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

