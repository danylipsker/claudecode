/* The Puzzle Cabinet · tools/gen/divide.js
 *
 *   node tools/gen/divide.js     writes data/divide-congruent.js and data/rep-tiles.js
 *
 * Cut into equal parts: classic figures (the square with a quarter missing,
 * staircases, Aztec diamonds, crosses, letters …) are tried with every
 * number of parts; a figure is kept when exactly one piece shape cuts it
 * into k congruent parts (js/lib/polyo.js divide: every piece through the
 * top-left square is tried, exact cover checks the rest). Then figures are
 * grown from k copies of a random piece and kept under the same rule.
 * Rep-tiles: polyominoes whose scaled copies are tiled by copies of themselves.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/polyo.js'));
require(path.join(ROOT, 'engines/divide.js'));
const Po = C.Polyo;
const D = C.divideMaker;
const K = (x, y) => x + ',' + y;
const MARKS = 'abcdefghijklmnop';
const NUMW = Po.NUMW;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- figures ---------- */

function rect(w, h, x0, y0) {
  const o = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) o.push([x + (x0 || 0), y + (y0 || 0)]);
  return o;
}
function minus(cells, holes) {
  const hs = new Set(holes.map((c) => K(c[0], c[1])));
  return cells.filter((c) => !hs.has(K(c[0], c[1])));
}
function blocks(rows, s) { // a picture of blocks, each s × s squares
  const o = [];
  Po.parse(rows).forEach((c) => { for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) o.push([c[0] * s + i, c[1] * s + j]); });
  return o;
}
function stair(m) { const o = []; for (let y = 0; y < m; y++) for (let x = 0; x <= y; x++) o.push([x, y]); return o; }
function pyramid(m) { const o = []; for (let y = 0; y < m; y++) for (let x = m - 1 - y; x <= m - 1 + y; x++) o.push([x, y]); return o; }
function aztec(m) {
  const o = [];
  for (let y = 0; y < 2 * m; y++) {
    const half = y < m ? y + 1 : 2 * m - y;
    for (let x = m - half; x < m + half; x++) o.push([x, y]);
  }
  return o;
}
function doubleStair(m) { // steps up then down: rows of 1, 2 … m … 2, 1 squares, left-aligned
  const o = [];
  for (let y = 0; y < 2 * m - 1; y++) { const len = y < m ? y + 1 : 2 * m - 1 - y; for (let x = 0; x < len; x++) o.push([x, y]); }
  return o;
}

function puzzle(meta, region, placements, extra) {
  const L = Po.landscape(region, placements);
  const p = {};
  Object.keys(meta).forEach((k) => { if (meta[k] !== undefined) p[k] = meta[k]; });
  p.data = Object.assign({ sol: Po.solRows(L.region, L.placements, MARKS) }, extra || {});
  return p;
}

// the unique cutting of a figure into k parts, or null
function cutting(cells, k, opts) {
  opts = opts || {};
  const t = Date.now();
  const maxShapes = opts.maxShapes || 1;
  const res = Po.divide(cells, k, { limit: 40, maxShapes: maxShapes + 1, visitLimit: opts.visitLimit || 6e5, nodeLimit: 1e6 });
  const ms = Date.now() - t;
  if (res.aborted || !res.length || res.length > maxShapes) return { ok: false, why: res.aborted ? 'search too big (' + ms + ' ms)' : res.length ? res.length + ' shapes' : 'impossible' };
  // the stored cutting uses the least regular shape; the others go in alt (for hints)
  const list = res.slice().sort((a, b) => Number(D.isRect(a.part)) - Number(D.isRect(b.part)) || a.count - b.count);
  const r = list[0];
  return {
    ok: true, part: r.part, count: r.count, capped: r.capped, shapes: list.length,
    anyRect: list.some((x) => D.isRect(x.part)),
    alt: list.slice(1).map((x) => Po.toRows(x.part).join('|')),
    placements: r.sol.map((c, i) => ({ piece: i, cells: c }))
  };
}

/* ---------- Cut into equal parts ---------- */

function divideFamily() {
  const out = [];
  const log = [];
  const used = new Set(['Acre']);
  const rngT = C.rng(4242);
  const fieldName = () => {
    const pool = D.FIELDS.filter((f) => !used.has(f));
    const f = rngT.pick(pool);
    used.add(f);
    return 'The ' + f;
  };
  const seenFig = new Set();

  // curated figures: [slug, name (title stem), description, cells, ks, extra meta]
  const FIGS = [
    ['quarter2', 'The Quarter Missing', 'A square with one quarter cut away', minus(rect(4, 4), rect(2, 2, 2, 0)), [3], { allowRect: true, text: 'A square with one quarter cut away. Share what is left among three: three pieces of the same size and shape.', hints: ['Twelve squares, three parts: four squares each.'], links: ['rep-l3-2'], explain: 'Three 2 × 2 squares — the easy one. Cutting the same figure into **four** identical pieces is the famous puzzle: see [[rep-l3-2]].' }],
    ['quarter3', 'The Quarter Missing, Larger', 'A 6 × 6 square with a 3 × 3 quarter cut away', minus(rect(6, 6), rect(3, 3, 3, 0)), [3]],
    ['quarter4', 'The Great L', 'An 8 × 8 square with a 4 × 4 quarter cut away', minus(rect(8, 8), rect(4, 4, 4, 0)), [4], { links: ['rep-l3-2'], explain: 'Each part is the same L as the whole figure, at half the size: the L is a **rep-tile** — see [[f:rep-tiles|Rep-tiles]].' }],
    ['holed5', 'The Holed Square', 'A 5 × 5 square with its centre square missing', minus(rect(5, 5), [[2, 2]]), [2, 3, 4, 6, 8]],
    ['holed7', 'The Big Holed Square', 'A 7 × 7 square with its centre square missing', minus(rect(7, 7), [[3, 3]]), [4, 6, 8, 12]],
    ['ring6', 'The Frame', 'A 6 × 6 square with a 2 × 2 hole in the middle', minus(rect(6, 6), rect(2, 2, 2, 2)), [4, 8]],
    ['corners4', 'The Clipped Board', 'A 4 × 4 square with two opposite corners removed', minus(rect(4, 4), [[0, 0], [3, 3]]), [2]],
    ['corners6', 'The Clipped Chessboard', 'A 6 × 6 square with two opposite corners removed', minus(rect(6, 6), [[0, 0], [5, 5]]), [2, 17]],
    ['stair4', 'The Four Steps', 'A staircase of four steps', stair(4), [2, 5]],
    ['stair5', 'The Five Steps', 'A staircase of five steps', stair(5), [3, 5]],
    ['stair6', 'The Six Steps', 'A staircase of six steps', stair(6), [3, 7]],
    ['stair7', 'The Seven Steps', 'A staircase of seven steps', stair(7), [2, 4, 7]],
    ['stair8', 'The Eight Steps', 'A staircase of eight steps', stair(8), [3, 4, 6, 9, 12]],
    ['pyr3', 'The Little Pyramid', 'A pyramid of 1, 3 and 5 squares', pyramid(3), [3]],
    ['pyr4', 'The Pyramid', 'A pyramid of 1, 3, 5 and 7 squares', pyramid(4), [2, 4, 8]],
    ['pyr5', 'The Tall Pyramid', 'A pyramid of 1, 3, 5, 7 and 9 squares', pyramid(5), [5]],
    ['aztec2', 'The Small Diamond', 'An Aztec diamond of rows 2, 4, 4, 2', aztec(2), [2, 3, 4]],
    ['aztec3', 'The Aztec Diamond', 'An Aztec diamond of rows 2, 4, 6, 6, 4, 2', aztec(3), [2, 3, 4, 6, 8]],
    ['aztec4', 'The Great Diamond', 'An Aztec diamond of rows 2 to 8 and back', aztec(4), [4, 5, 8, 10]],
    ['dstair3', 'The Arrowhead', 'Steps up and down: rows of 1, 2, 3, 2, 1', doubleStair(3), [3]],
    ['dstair4', 'The Big Arrowhead', 'Steps up and down: rows of 1, 2, 3, 4, 3, 2, 1', doubleStair(4), [2, 4, 8]],
    ['cross2', 'The Greek Cross', 'A Greek cross of five 2 × 2 blocks', blocks('.#.|###|.#.', 2), [2, 4, 5]],
    ['cross3', 'The Great Cross', 'A Greek cross of five 3 × 3 blocks', blocks('.#.|###|.#.', 3), [5, 9]],
    ['latin2', 'The Latin Cross', 'A Latin cross of six 2 × 2 blocks', blocks('.#.|###|.#.|.#.', 2), [2, 3, 4, 6, 8]],
    ['t2', 'The Letter T', 'A capital T of 2 × 2 blocks', blocks('###|.#.|.#.', 2), [2, 4, 5]],
    ['h2', 'The Letter H', 'A capital H of 2 × 2 blocks', blocks('#.#|###|#.#', 2), [2, 4, 7]],
    ['u2', 'The Letter U', 'A capital U of 2 × 2 blocks', blocks('#.#|#.#|###', 2), [2, 4, 7]],
    ['e2', 'The Letter E', 'A capital E of 2 × 2 blocks', blocks('##|#.|##|#.|##', 2), [2, 4, 8]],
    ['f2', 'The Letter F', 'A capital F of 2 × 2 blocks', blocks('###|#..|##.|#..', 2), [2, 4, 7]],
    ['s2', 'The Letter S', 'A capital S of 2 × 2 blocks', blocks('###|#..|###|..#|###', 2), [2, 4, 11]],
    ['z2', 'The Letter Z', 'A capital Z of 2 × 2 blocks', blocks('##.|.#.|.##', 2), [2, 4, 5]],
    ['p2', 'The Letter P', 'A capital P of 2 × 2 blocks', blocks('##|##|#.', 2), [2, 4, 5]],
    ['w2', 'The Letter W', 'A W of 2 × 2 blocks', blocks('#..|##.|.##', 2), [2, 4, 5]],
    ['plus-bar', 'The Signpost', 'A long bar with a short cross-bar', Po.parse('..#...|######|..#...|..#...'), [3]],
    ['notch35', 'The Notched Plank', 'A 3 × 5 plank with a notch in one long side', minus(rect(5, 3), [[2, 0]]), [2]],
    ['notch46', 'The Notched Board', 'A 4 × 6 board with two notches', minus(rect(6, 4), [[0, 0], [5, 3]]), [2, 11]],
    ['steps-wide', 'The Terraces', 'Terraces three squares deep', Po.parse('##....|####..|######|######'), [2, 4, 5]],
    ['hook', 'The Shepherd\'s Crook', 'A hooked staff', Po.parse('####|#..#|#...|#...|#...'), [2, 3]],
    ['house', 'The Cottage', 'A cottage with a pitched roof and a door', Po.parse('..##..|.####.|######|##..##|##..##'), [2, 4, 5]],
    ['boat', 'The Sailing Boat', 'A boat with a sail', Po.parse('...#...|..##...|.###...|#######|.#####.'), [2, 3, 6]],
    ['tree', 'The Fir Tree', 'A fir tree on its trunk', Po.parse('..##..|.####.|######|..##..|..##..'), [2, 4, 8]],
    ['key', 'The Key', 'An old iron key', Po.parse('###.....|#.######|###..#.#'), [3, 5]],
    ['fish', 'The Fish', 'A fish with a forked tail', Po.parse('.##..#|######|.##..#'), [2, 3, 4]],
    ['arrow', 'The Arrow', 'An arrow pointing right', Po.parse('..#...|..##..|######|..##..|..#...'), [2, 3, 4]],
    ['crown', 'The Crown', 'A crown with four points', Po.parse('#.##.#|######|######'), [2, 4, 8]],
    ['chevron', 'The Chevron', 'A chevron, point down', Po.parse('##....##|.##..##.|..####..'), [2, 3, 4]],
    ['zigzag', 'The Zigzag', 'A zigzag staircase', Po.parse('##....|.##...|..##..|...##.|....##'), [2, 5]],
    ['bowtie', 'The Bow Tie', 'A bow tie', Po.parse('#....#|##..##|######|######|##..##|#....#'), [2, 3, 4, 6, 8]],
    ['hourglass', 'The Hourglass', 'An hourglass', Po.parse('######|.####.|..##..|.####.|######'), [2]],
    ['heart', 'The Heart', 'A heart', Po.parse('.##.##.|#######|#######|.#####.|..###..|...#...'), [3, 9]],
    ['bird', 'The Bird', 'A bird in flight', Po.parse('##....|.###..|..####|.####.|...#..'), [2, 7]],
    ['mushroom', 'The Mushroom', 'A mushroom', Po.parse('.####.|######|..##..|..##..'), [2, 7]],
    ['cup', 'The Cup', 'A cup', Po.parse('#....#|#....#|######|.####.'), [2, 7]],
    ['bridge', 'The Bridge', 'A bridge on two piers', Po.parse('########|##....##|##....##'), [2, 4, 8]],
    ['castle', 'The Castle', 'A castle with battlements and a gate', Po.parse('#.#.#.#|#######|#######|###.###'), [2, 3, 4, 6, 8]],
    ['pinwheel', 'The Pinwheel', 'A pinwheel', Po.parse('##...|.#..#|.####|#..#.|...##'), [2, 3, 4]]
  ];
  const curated = [];
  FIGS.forEach(([slug, name, desc, cells, ks, extra]) => {
    extra = extra || {};
    ks.forEach((k) => {
      if (cells.length % k) { log.push(slug + '/' + k + ': squares do not share out'); return; }
      const n = cells.length / k;
      if (n < 3) return;
      const r = cutting(cells, k, { maxShapes: 2 });
      if (!r.ok) { log.push(slug + '/' + k + ': ' + r.why); return; }
      if (r.anyRect && !extra.allowRect) { log.push(slug + '/' + k + ': rectangles work'); return; }
      const title = name + (ks.length > 1 || k > 2 ? ', in ' + cap(NUMW[k]) : ', in Two');
      const diff = Math.max(1, D.gradeDivide(k, n, r.count, r.capped) - (r.shapes > 1 ? 1 : 0));
      let text = extra.text || desc + ' (' + cells.length + ' squares). Cut it into ' + NUMW[k] + ' pieces of the same size and shape.';
      if (r.shapes > 1) text += ' Two different shapes of piece will do it: find either.';
      const explain = extra.explain || (r.shapes > 1 ? 'Two shapes of piece work here. Once you have found one, try for the other: the hint button follows whichever you are building.' : r.count === 1 && !r.capped ? 'There is only one way to do it.' : undefined);
      curated.push(puzzle({
        id: 'divide-' + slug + '-' + k, title, diff, text,
        hints: extra.hints, explain, links: extra.links, tags: ['classic-shape']
      }, cells, r.placements, r.alt.length ? { alt: r.alt } : null));
      seenFig.add(Po.canon(cells) + '/' + k);
    });
  });

  // grown figures: [k, n, how many]
  const PLAN = [
    [2, 4, 8], [2, 5, 8], [2, 6, 7], [2, 7, 6], [2, 8, 5], [2, 9, 4], [2, 10, 4], [2, 11, 2], [2, 12, 2],
    [3, 3, 6], [3, 4, 7], [3, 5, 6], [3, 6, 6], [3, 7, 4], [3, 8, 3],
    [4, 3, 6], [4, 4, 6], [4, 5, 5], [4, 6, 4], [4, 7, 3], [4, 8, 2],
    [5, 4, 3], [5, 5, 3], [5, 6, 2], [6, 4, 2], [6, 5, 2]
  ];
  const grown = [];
  PLAN.forEach(([k, n, many], pi) => {
    const rng = C.rng(9000 + pi * 17);
    let got = 0;
    for (let tries = 0; tries < 400 && got < many; tries++) {
      const r = D.makeDivide(rng, k, n, { visitLimit: 6e5, limit: 40 });
      if (!r) continue;
      const key = Po.canon(r.region) + '/' + k;
      if (seenFig.has(key)) continue;
      seenFig.add(key);
      got++;
      grown.push({ k, n, r, diff: D.gradeDivide(k, n, r.count, r.capped), text: D.divideText(rng, k) });
    }
    if (got < many) log.push('grown ' + k + '×' + n + ': only ' + got);
  });
  grown.forEach((g, i) => {
    out.push(puzzle({
      id: 'divide-g' + String(i + 1).padStart(3, '0'), title: fieldName(), diff: g.diff, text: g.text,
      tags: ['grown']
    }, g.r.region, g.r.placements));
  });
  // the very first puzzle explains the game
  const all = curated.concat(out);
  all.forEach((p, i) => { p._o = i; });
  all.sort((a, b) => a.diff - b.diff || a._o - b._o);
  all.forEach((p) => { delete p._o; });
  const first = all[0];
  first.text = 'Cut the shape along the grid lines into pieces that are all the same size and the same shape. Colour each piece with its own colour: pick one of the coloured dots under the figure, then click or drag across the squares. ' + first.text;
  return { list: all, log };
}

/* ---------- Rep-tiles ---------- */

function repFamily() {
  const out = [];
  const log = [];
  const scaled = (cells, s) => { const o = []; cells.forEach((c) => { for (let j = 0; j < s; j++) for (let i = 0; i < s; i++) o.push([c[0] * s + i, c[1] * s + j]); }); return o; };
  const REP = [
    // [id, title, part rows, scale, diff, text, hints, extra]
    ['rep-domino-2', 'Domino Squared', '##', 2, 1, 'A domino, blown up to twice the size, is a 2 × 4 rectangle. Cut it into four dominoes. (Rectangles are rep-tiles in the dullest possible way — a warm-up.)'],
    ['rep-l3-2', 'The Chair', '#.|##', 2, 1, 'Three squares in an L — the shape tiling people call the **chair** — at twice its size. Cut the big L into four small L\'s, each a copy of the original.', ['Each corner of the big L is the corner of some small L. Start at the inside corner.'], { explain: 'There is only one way: a small L sits snugly in the inside corner and the other three fill the three arms. Since each small L can be cut the same way again, and again, the L tiles its own copies at every scale: [[rep-l3-4]].' }],
    ['rep-l4-2', 'The L of Four', '#.|#.|##', 2, 2, 'The L-tetromino at twice its size: cut it into four L-tetrominoes.', ['Two L-tetrominoes make a 2 × 4 rectangle.']],
    ['rep-p-2', 'The P, Four Times', '##|##|#.', 2, 2, 'The P-pentomino at twice its size: cut it into four P-pentominoes.', ['Two P-pentominoes make a 2 × 5 rectangle.']],
    ['rep-hex-2', 'The Boot', '####|##..', 2, 3, 'This hexomino looks like a boot. At twice the size, it can be cut into four boots.', ['Look at the toe of the big boot first: which way can a small boot fill it?']],
    ['rep-rect-3', 'Bricks', '###|###', 3, 1, 'A 2 × 3 brick at three times its size is a 6 × 9 wall. Build it from nine bricks: a rectangle is a rep-tile too, if not the most exciting one.'],
    ['rep-l3-3', 'Nine Chairs', '#.|##', 3, 2, 'The L-tromino at three times its size: nine small L\'s.', ['Two L-trominoes make a 2 × 3 rectangle — that helps in the big arms.']],
    ['rep-l4-3', 'Nine L\'s', '#.|#.|##', 3, 3, 'The L-tetromino at three times its size, cut into nine copies of itself.', ['Two L-tetrominoes make a 2 × 4 rectangle.']],
    ['rep-p-3', 'Nine P\'s', '##|##|#.', 3, 3, 'The P-pentomino at three times its size, cut into nine P\'s.', ['Two P-pentominoes make a 2 × 5 rectangle, and a P plus a square makes a 2 × 3.']],
    ['rep-hex-3', 'Nine Boots', '####|##..', 3, 4, 'The boot hexomino at three times its size: nine boots.'],
    ['rep-l3-big', 'L\'s All the Way Down', '', 0, 2, '', null, { big: '#.|##', bigScale: 4, text: 'The L at four times its size. Cut it into four L\'s at twice the size — each of them made of twelve squares.', hints: ['This is [[rep-l3-2]] again, with every square cut into four.'] }],
    ['rep-l4-big', 'Big L\'s', '', 0, 3, '', null, { big: '#.|#.|##', bigScale: 4, part: '#.|#.|##', partScale: 2, text: 'The L-tetromino at four times its size: cut it into four L-tetrominoes at twice the size.' }],
    ['rep-p-big', 'Big P\'s', '', 0, 3, '', null, { big: '##|##|#.', bigScale: 4, part: '##|##|#.', partScale: 2, text: 'The P-pentomino at four times its size: cut it into four P-pentominoes at twice the size.' }],
    ['rep-l4-2m', 'The L of Four, No Flipping', '#.|#.|##', 2, 3, 'The L-tetromino at twice its size again — but this time the four small L\'s may be turned round and not turned over: all of them keep the same hand.', null, { noMirror: true }],
    ['rep-p-2m', 'The P, No Flipping', '##|##|#.', 2, 3, 'Four P-pentominoes in the doubled P again, all of the same hand: turning allowed, turning over not.', null, { noMirror: true }],
    ['rep-l4-3m', 'Nine L\'s of One Hand', '#.|#.|##', 3, 4, 'Nine L-tetrominoes in the tripled L, all of the same hand: they may turn round, but not turn over.', null, { noMirror: true }],
    ['rep-p-3m', 'Nine P\'s of One Hand', '##|##|#.', 3, 4, 'Nine P-pentominoes in the tripled P, all of the same hand: turning allowed, turning over not.', null, { noMirror: true }],
    ['rep-l3-4', 'Sixteen Chairs', '#.|##', 4, 3, 'The L-tromino at four times its size: sixteen small L\'s.', ['Cut the big L into four L\'s at twice the size first (see [[rep-l3-2]]), then cut each of those into four.']],
    ['rep-l4-4', 'Sixteen L\'s', '#.|#.|##', 4, 4, 'The L-tetromino at four times its size: sixteen L-tetrominoes.', ['Think of it as four L\'s at twice the size, each cut into four.']],
    ['rep-p-4', 'Sixteen P\'s', '##|##|#.', 4, 4, 'The P-pentomino at four times its size: sixteen P\'s.', ['Four P\'s at twice the size, each cut into four.']],
    ['rep-hex-4', 'Sixteen Boots', '####|##..', 4, 5, 'The boot at four times its size: sixteen boots, 96 squares.', ['Cut it into four boots at twice the size first — each of those is [[rep-hex-2]].']]
  ];
  REP.forEach(([id, title, rows, s, diff, text, hints, extra]) => {
    extra = extra || {};
    if (extra.skip) return;
    let cells, part, k;
    if (extra.big) {
      cells = scaled(Po.parse(extra.big), extra.bigScale);
      part = scaled(Po.parse(extra.part || extra.big), extra.partScale || 2);
      k = cells.length / part.length;
      text = extra.text;
      hints = extra.hints || hints;
    } else {
      part = Po.norm(Po.parse(rows));
      cells = scaled(part, s);
      k = s * s;
    }
    const free = !extra.noMirror;
    const r = Po.tile(cells, part, free, 200, 3e6);
    if (!r.count) { log.push(id + ': no tiling'); return; }
    const count = r.count, capped = r.capped;
    const L = Po.landscape(cells, r.sol.map((c, i) => ({ piece: i, cells: c })));
    const p = { id, title, diff, text };
    if (hints) p.hints = hints;
    if (extra.explain) p.explain = extra.explain;
    else if (!capped) p.explain = count === 1 ? 'There is exactly one way to do it.' : 'There are ' + count + ' ways to do it, counting turned and mirrored copies of the whole picture as different.';
    p.tags = ['rep-tile'];
    p.data = { sol: Po.solRows(L.region, L.placements, MARKS), part: Po.toRows(Po.norm(part)).join('|') };
    if (extra.noMirror) p.data.noMirror = true;
    out.push(p);
  });
  out.forEach((p, i) => { p._o = i; });
  out.sort((a, b) => a.diff - b.diff || a._o - b._o);
  out.forEach((p) => { delete p._o; });
  return { list: out, log };
}

/* ---------- writing ---------- */

function lit(v) { return JSON.stringify(v); }
function lines(p) {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags'];
  const head = [];
  keys.forEach((k) => { if (p[k] !== undefined) head.push(k + ': ' + lit(p[k])); });
  const d = p.data;
  const data = ['sol: ' + lit(d.sol)];
  if (d.part) data.push('part: ' + lit(d.part));
  if (d.alt) data.push('alt: ' + lit(d.alt));
  if (d.noMirror) data.push('noMirror: true');
  return '  { ' + head.join(',\n    ') + ',\n    data: { ' + data.join(', ') + ' } }';
}
function write(file, meta, list, after) {
  const src = '/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/divide.js */\nCabinet.family(' + meta + ', [\n' + list.map(lines).join(',\n') + '\n]);\n' + (after || '');
  fs.writeFileSync(path.join(ROOT, file), src);
  return src.length;
}

if (require.main === module) {
  const t0 = Date.now();
  const dv = divideFamily();
  const n1 = write('data/divide-congruent.js', `{
  id: 'divide-congruent', engine: 'divide', cat: 'shapes', name: 'Cut into equal parts', order: 5,
  blurb: 'Cut a figure along the grid lines into two, three, four or more pieces of exactly the same size and shape.',
  origin: { who: 'A traditional puzzle', note: 'Sharing a field fairly among heirs is one of the oldest themes of the puzzle books, and cutting a figure into identical pieces was a favourite of the golden-age puzzle columns. Here every cut runs along the grid, and the figures are chosen so that one shape of piece works (now and then two).' },
  concepts: ['dissection', 'symmetry', 'area', 'exact-cover'],
  deps: ['js/lib/dlx.js', 'js/lib/polyo.js']
}`, dv.list);
  const rp = repFamily();
  const n2 = write('data/rep-tiles.js', `{
  id: 'rep-tiles', engine: 'divide', cat: 'shapes', name: 'Rep-tiles', order: 6,
  blurb: 'Shapes that can be cut into smaller copies of themselves: the L, the P, the boot — at two, three and four times their size.',
  origin: { year: 1963, who: 'Solomon W. Golomb and Martin Gardner', note: 'Golomb gave these self-replicating shapes the name rep-tiles, and Martin Gardner made them famous in his *Scientific American* column of 1963. Any rep-tile can be cut up again and again, so it tiles copies of itself at every scale.' },
  concepts: ['dissection', 'area', 'symmetry', 'recursion'],
  endless: false,
  deps: ['js/lib/dlx.js', 'js/lib/polyo.js']
}`, rp.list, `Cabinet.history([
  { year: 1963, title: 'Rep-tiles', text: 'Martin Gardner devotes his *Scientific American* column to rep-tiles — figures that can be cut into smaller copies of themselves — a name coined by Solomon Golomb. The L of three squares is the simplest polyomino among them.', links: ['rep-tiles', 'rep-l3-2'] }
]);
`);
  const dd = (l) => { const d = {}; l.forEach((p) => { d[p.diff] = (d[p.diff] || 0) + 1; }); return JSON.stringify(d); };
  console.log('divide-congruent: ' + dv.list.length + ' puzzles ' + dd(dv.list) + ', ' + Math.round(n1 / 1024) + ' KB');
  console.log('rep-tiles: ' + rp.list.length + ' puzzles ' + dd(rp.list) + ', ' + Math.round(n2 / 1024) + ' KB');
  if (dv.log.length || rp.log.length) console.log('left out:\n  ' + dv.log.concat(rp.log).join('\n  '));
  console.log((Date.now() - t0) + ' ms');
}
