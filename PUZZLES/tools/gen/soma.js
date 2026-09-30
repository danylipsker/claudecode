/* The Puzzle Cabinet · tools/gen/soma.js
 *
 *   node tools/gen/soma.js        writes data/soma.js and data/polycube-packing.js
 *   node tools/gen/soma.js --dry  only prints the report
 *
 * The figures are drawn here by hand (height maps 'h:…' — one digit per
 * column, rows from the back — or layers 'rows|rows/rows|rows', bottom layer
 * first, back row first). Every one is solved by exact cover, its solutions
 * are counted (up to the figure's own symmetries) to grade it, and one
 * solution is stored. Grown figures and shadow figures come from the
 * engine's own generator with fixed seeds.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/polycube.js'));
require(path.join(ROOT, 'engines/soma.js'));
const P = C.Polycube, S = C.soma, E = C.engines.soma;

const SOMA = ['V', 'L', 'T', 'Z', 'A', 'B', 'P'];
const TETRA = ['I4', 'O4', 'L', 'T', 'Z', 'A', 'B', 'P'];
const FLAT5 = ['F5', 'I5', 'L5', 'N5', 'P5', 'T5', 'U5', 'V5', 'W5', 'X5', 'Y5', 'Z5'];
const Q5 = Array.from({ length: 17 }, (_, i) => 'Q' + (i + 1));

/* ---------- figures ---------- */

function fig(spec) {
  if (Array.isArray(spec)) return spec;
  if (spec.startsWith('h:')) {
    const cells = [];
    spec.slice(2).split('|').forEach((row, z) => {
      for (let x = 0; x < row.length; x++) {
        const h = row[x] === '.' ? 0 : parseInt(row[x], 36);
        for (let y = 0; y < h; y++) cells.push([x, y, z]);
      }
    });
    return cells;
  }
  return P.cellsOf(spec);
}
const box = (w, h, d) => { const out = []; for (let y = 0; y < h; y++) for (let z = 0; z < d; z++) for (let x = 0; x < w; x++) out.push([x, y, z]); return out; };

// how many of the 48 turnings and mirrorings map the figure onto itself
function symmetries(cells) {
  const k0 = P.keyOf(cells);
  let n = 0;
  for (const mir of [false, true]) {
    const base = mir ? P.mirror(cells) : cells;
    for (let ri = 0; ri < 24; ri++) if (P.keyOf(base.map((c) => P.rot(ri, c))) === k0) n++;
  }
  return n;
}
function colourDiff(cells) {
  let e = 0;
  cells.forEach((c) => { if ((c[0] + c[1] + c[2]) % 2 === 0) e++; });
  return Math.abs(2 * e - cells.length);
}

// count the solutions (labelled, up to a limit), and keep one (chosen with a seeded shuffle)
function study(cells, keys, opts) {
  opts = opts || {};
  const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
  const one = P.solve(cells, shapes, { max: 1, nodeLimit: opts.oneLimit || 4e7, any: opts.any, shuffle: C.rng(opts.seed || 7) });
  if (!one.sols.length) return null;
  const all = P.solve(cells, shapes, { max: opts.max || 2e6, nodeLimit: opts.nodeLimit || 4e7, any: opts.any });
  const place = keys.map((k, i) => one.sols[0][i] || null);
  // pieces of the same shape can be swapped: count those as one (the most numerous shape is already counted once by the solver)
  const dup = {};
  keys.forEach((k) => { const c = P.canon(P.pieceCells(k)); dup[c] = (dup[c] || 0) + 1; });
  const ns = Object.values(dup).sort((a, b) => b - a);
  if (!opts.any && ns[0] > 1) ns.shift();
  let f = 1;
  ns.forEach((n) => { for (let i = 2; i <= n; i++) f *= i; });
  const sym = symmetries(cells);
  return { sol: P.solString(shapes, place), place, count: all.sols.length, aborted: all.aborted, distinct: Math.max(1, all.sols.length / sym / f), sym, nodes: one.nodes };
}

const seenFig = new Map();
function figKey(cells) { return [false, true].map((mir) => P.canon(mir ? P.mirror(cells) : cells)).sort()[0]; }

/* ---------- puzzle records ---------- */

function makePuzzle(d, cells, keys, show, r, report) {
  const data = { pieces: keys, sol: r.sol };
  if (show && show !== 'cells') data.show = show;
  if (d.any) data.any = true;
  const p = { id: d.id, title: d.title, diff: d.diff };
  if (d.year) p.year = d.year;
  if (d.source) p.source = d.source;
  p.text = d.text;
  if (d.goal) p.goal = d.goal;
  if (d.hints) p.hints = d.hints;
  if (d.explain) p.explain = d.explain;
  if (d.links) p.links = d.links;
  const concepts = ['exact-cover'].concat(d.concepts || []);
  if (show === 'views' && !concepts.includes('projection')) concepts.push('projection');
  p.concepts = concepts.filter((c, i, a) => a.indexOf(c) === i);
  if (d.tags && d.tags.length) p.tags = d.tags;
  p.data = data;
  report.push(d.id.padEnd(28) + ' diff ' + d.diff + '  sols ' + String(r.count).padStart(7) + (r.aborted ? '+' : ' ') + ' distinct ' + r.distinct.toFixed(1).padStart(8) + '  sym ' + String(r.sym).padStart(2) + '  colour ' + colourDiff(cells) + '  nodes ' + r.nodes);
  return p;
}

// given pieces: the lowest ones of the stored solution (the top is left to build)
function lowest(keys, place, n) {
  const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
  const h = place.map((pl, i) => {
    const cs = P.place(shapes[i], pl.ri, pl.t);
    return { i, y: cs.reduce((s, c) => s + c[1], 0) / cs.length };
  });
  h.sort((a, b) => a.y - b.y || a.i - b.i);
  return h.slice(0, n).map((x) => x.i).sort((a, b) => a - b);
}

module.exports = { fig, box, study, symmetries, colourDiff };

/* ======================================================================
 *  The Soma cube
 * ====================================================================== */

const CUBE3 = box(3, 3, 3);

// warm-ups: parts of the set, or the cube with pieces already in place
const WARM = [
  { id: 'soma-flat-start', title: 'Flat Out', fig: box(5, 1, 3), pieces: ['V', 'L', 'T', 'Z'],
    text: 'Four of the seven Soma pieces are flat: the **V**, the **L**, the **T** and the **Z**. Lay them together into a slab of 5 × 3 cubes, one cube thick. A gentle start: you only need to slide and spin them (Q and E).',
    hints: ['The V is the only piece of three cubes. Try it in a corner of the slab.'],
    explain: 'Four of the Soma pieces lie flat — the V, L, T and Z. They are the shapes you can make from three or four squares, apart from the straight lines and the 2 × 2 square, which Piet Hein left out because they are too regular. The other three pieces never lie flat.' },
  { id: 'soma-which-two', title: 'Which Two?', fig: '##|##/##|#.', pieces: SOMA, any: true,
    text: 'The ghost is a 2 × 2 × 2 cube with one corner bitten off: seven cubes. Two of the seven Soma pieces fill it exactly. Which two? (The other five stay on the table.)',
    hints: ['Seven cubes: one piece of three and one of four.', 'The V is the only piece of three. Which four-cube piece fills what is left beside it?'],
    explain: 'Seven is 3 + 4, so the V must be one of the two. The four cubes left beside it are not flat, so the partner is one of the twisted pieces — A, B or P — and only the right one fits the bite.' },
  { id: 'soma-three-twists', title: 'Three Twisted Ones', fig: 'h:44|43', pieces: ['V', 'A', 'B', 'P'],
    text: 'The three pieces that never lie flat — the twists **A** and **B** and the three-armed **P** — with the V, build a little tower two cubes square and four high, one cube short at the top.',
    hints: ['A and B are mirror images of each other: each fits inside a 2 × 2 × 2 box.'] },
  { id: 'soma-last-three', title: 'The Last Three', fig: CUBE3, pieces: SOMA, given: 4, seed: 11,
    text: 'The Soma cube, nearly done: four pieces are already in place and stay there (they are shown dimmer). Put in the last three.',
    hints: ['Look at the hole the three must fill. Which piece fits its lowest cubes?'] },
  { id: 'soma-four-to-go', title: 'Four to Go', fig: CUBE3, pieces: SOMA, given: 3, seed: 23,
    text: 'Three pieces of the Soma cube are fixed in place at the bottom. Build the rest of the cube around them with the other four.',
    hints: ['Finish the bottom layer first, then read the shape of the hole that is left.'] },
  { id: 'soma-half-built', title: 'Half Built', fig: CUBE3, pieces: SOMA, given: 2, seed: 31,
    text: 'Two pieces are fixed at the bottom of the cube. Five to place — the cube is yours to finish.' }
];

const CUBE = {
  id: 'soma-cube', title: 'The Soma Cube', fig: CUBE3, year: 1933,
  source: 'Piet Hein (1933); popularised by Martin Gardner in *Scientific American* (1958).',
  text: 'The seven Soma pieces — every irregular shape that three or four cubes can make — fit together into a 3 × 3 × 3 cube. Build it.',
  hints: ['Place the awkward pieces first — the T and the P — and keep the small V for last: it fits into many corners.', 'Every layer of the cube has nine cubes. Try to finish the bottom layer before you worry about the top.'],
  explain: 'There are 240 essentially different ways to build the cube (turnings and mirror images of the whole cube counted once), which is why it makes a friendly start. Paint the 27 small cubes like a three-dimensional chessboard: 14 of one colour and 13 of the other. The T and the P always cover three cubes of one colour and one of the other, the V two and one, the other four pieces two and two. So the difference of one can only be made in a few ways — one of the T and the P must lean toward each colour, and the V toward the larger one. Such colour counts decide which figures can be built at all.',
  concepts: ['coloring-argument']
};

// the classic kind of Soma figure: things you can recognise
const FIGS = [
  { id: 'soma-steps', title: 'The Steps', fig: 'h:432|432|432', text: 'A wide flight of steps, climbing to four cubes high.' },
  { id: 'soma-wall', title: 'The Garden Wall', fig: 'h:33333|3333.', text: 'A wall two cubes thick and three high, with one end broken off.' },
  { id: 'soma-skyscraper', title: 'The Skyscraper', fig: 'h:77|76', text: 'Seven storeys on a 2 × 2 plot (one corner is a storey short — the roof garden).',
    hints: ['Every piece must fit inside a column two cubes wide: the flat ones stand on edge.'] },
  { id: 'soma-loaf', title: 'The Loaf', fig: 'h:23332|23432', text: 'A loaf of bread fresh from the oven, with a little crust sticking up.' },
  { id: 'soma-piano', title: 'The Grand Piano', fig: 'h:2222|2222|222.|32..', text: 'A grand piano seen from above, with its lid propped up at the corner.' },
  { id: 'soma-bed', title: 'The Bed', fig: 'h:333|222|222|222', text: 'A bed with a tall headboard and a deep mattress.' },
  { id: 'soma-crystal', title: 'The Crystal', fig: '.#.|###|.#./###|###|###/###|###|###/.#.|###|...', text: 'A chunky crystal: a pointed foot, a square body and a jagged crown.',
    explain: 'Our first crystal had a diamond-shaped middle — and 17 cubes of one chessboard colour against 10 of the other. The Soma pieces can never make a difference of more than 5 (the V can tip the balance by one, the T and the P by two each), so it could not be built. This one is balanced.', concepts: ['coloring-argument'] },
  { id: 'soma-boot', title: 'The Boot', fig: 'h:55|55|22|11|1.', text: 'A tall boot, laced up to five cubes high, with its toe on the table.' },
  { id: 'soma-armchair', title: 'The Armchair', fig: 'h:443|323|323', text: 'A deep armchair: a high back, two arms and a soft seat.' },
  { id: 'soma-pyramid', title: 'The Pyramid', fig: 'h:12321|12321|12321', text: 'A long stepped roof: a ridge three cubes high, sloping down on both sides.' },
  { id: 'soma-walled-garden', title: 'The Walled Garden', fig: 'h:2222|2112|2111|2222', text: 'A garden inside a wall two cubes high, with a gap in the wall for the gate.' },
  { id: 'soma-bridge', title: 'The Bridge', fig: '##.##|##.##/##.##|##.##/#####|#####/..#..|.....', text: 'A bridge on two piers over a narrow stream, with a lamp in the middle of the parapet.' },
  { id: 'soma-tunnel', title: 'The Tunnel', fig: '###|###|###/#.#|#.#|#.#/###|###|###/.#.|.#.|.#.', text: 'A tunnel three cubes long with a ridge along its roof. The trains go through the hole.' },
  { id: 'soma-tower', title: 'The Tower', fig: 'h:651|561|111', text: 'A square tower, two cubes across, rising six high from a 3 × 3 base, with two battlements on top.',
    hints: ['The tower is two cubes wide: which pieces fit inside a 2 × 2 column?'] },
  { id: 'soma-bathtub', title: 'The Bathtub', fig: 'h:22222|21112|22222', text: 'A bathtub for a small bather: five cubes long, three wide, two high, with a hollow of three cubes in the top.',
    hints: ['The rim around the hollow is one cube thick. The pieces that make it lie along it.'] },
  { id: 'soma-throne', title: 'The Throne', fig: 'h:555|222|222', text: 'A throne with a very tall back — five cubes — and a deep seat.' },
  { id: 'soma-tee', title: 'The Tee', fig: 'h:3333|.33.|.33.|.3..', text: 'A big letter T, three cubes thick, with a little foot.' },
  { id: 'soma-corner', title: 'The Stepped Corner', fig: 'h:543|432|321', text: 'The corner of a stepped pyramid, five cubes high at the top.',
    explain: 'This corner has 16 cubes of one chessboard colour and 11 of the other: a difference of five, the most the Soma pieces can manage. So the V must cover two cubes of the larger colour, and the T and the P three each. Knowing that, their places come quickly.', concepts: ['coloring-argument'] },
  { id: 'soma-snake', title: 'The Snake', fig: 'h:22...|222..|.222.|..222|...23', text: 'A snake winding across the table, two cubes high, raising its head at the end.' },
  { id: 'soma-hill', title: 'The Hill', fig: 'h:1231|2442|1331', text: 'A lumpy hill with a steep double peak.' },
  { id: 'soma-sphinx', title: 'The Sphinx', fig: 'h:2221.|33322|2221.', text: 'A sphinx lying on the sand, paws forward, head raised.' },
  { id: 'soma-anvil', title: 'The Anvil', fig: '.###.|.###.|.###./..#..|.###.|..#../.####|#####|.####', text: 'An anvil: a square block, a narrow waist and a wide top with a horn.',
    explain: 'The anvil has 16 cubes of one chessboard colour and 11 of the other — a difference of five, the most the Soma pieces can make. So the V, the T and the P must all lean the same way: the V covers two cubes of the larger colour, the T and the P three each.', concepts: ['coloring-argument'] },
  { id: 'soma-sofa', title: 'The Sofa', fig: 'h:23332|21112|21112', text: 'A sofa with a high back and two arms. Sit down when you have built it.' },
  { id: 'soma-gateway', title: 'The Gateway', fig: '##.##|##.##/##.##|##.##/##.##|##.##/.###.|.....', text: 'Two square gateposts, three high, joined by a lintel across the top.',
    hints: ['The lintel rests on both posts: the pieces at its ends must hook down into the posts.'] },
  { id: 'soma-bench', title: 'The Bench', fig: '##...##|##...##/#######|#######/.#####.|.......', text: 'A park bench: a long seat on two sturdy legs, with a low back.' },
  { id: 'soma-dog', title: 'The Dog', fig: '.#..#.|.#..#./.####.|.####./#####.|.####./....##|....##/....#.|....#.', text: 'A dog on four short legs, with its head up, its ears pricked and a stub of a tail.',
    hints: ['Each leg is a single cube: the piece that makes it must reach up into the body.'] },
  { id: 'soma-elephant', title: 'The Elephant', fig: '#..#.|....#|#..#./####.|#####|####./.###.|.###.|.###.', text: 'An elephant on four stout legs, with a round back and its trunk down to the ground.' },
  { id: 'soma-giraffe', title: 'The Giraffe', fig: '#.#|...|#.#/###|###|###/###|###|###/...|...|.##/...|...|.#./...|...|.##', text: 'A giraffe: a square body on four little legs, a long neck and a head looking along.',
    hints: ['The top of the neck is one cube wide: the piece that holds the head must run down through it.'] },
  { id: 'soma-duck', title: 'The Duck', fig: '.###.|#####|.###./.###.|#####|.###./.....|#...#|...../.....|...###|.....', text: 'A duck on the pond, tail up at one end, head and beak at the other.' },
  { id: 'soma-cannon', title: 'The Cannon', fig: '#.#|...|#.#/###|###|###/###..|#####|##.../.....|####.|.....', text: 'A cannon on a carriage with four wheels, its barrel pointing out across the table.' },
  { id: 'soma-footstool', title: 'The Footstool', fig: '.#.|#.#|.#./###|###|###/###|###|###/.#.|###|.#.', text: 'A stool with a cross-shaped cushion. Its four legs stand under the middles of its sides — a strange place for legs, but there is a reason.',
    explain: 'With the legs at the corners, as a real stool has them, the figure has 17 cubes of one chessboard colour and 10 of the other. The Soma pieces can never make a difference of more than 5, so that stool cannot be built. Moving the legs to the middles of the sides balances the colours.', concepts: ['coloring-argument'] },
  { id: 'soma-well', title: 'The Well', fig: '###|#.#|###/###|#.#|###/###|#.#|###/...|###|...', text: 'A well with a square shaft, three deep, and a beam across the top for the bucket.',
    hints: ['The beam across the top rests on the walls at its ends. The piece that makes its middle must hang onto one of them.'] },
  { id: 'soma-arch', title: 'The Arch', fig: '#...#|#...#/#...#|#...#/##.##|##.##/#####|#####/..#..|.....', text: 'A triumphal arch on two thin legs, with a keystone on top.',
    hints: ['The legs are one cube wide and two high: the pieces that make them must also help to make the arch above.'] },
  { id: 'soma-fort', title: 'The Fort', fig: 'h:3222|2..2|2..2|2233', text: 'A little fort: a square courtyard walled two high, with a tower at two of its corners.',
    hints: ['The walls are one cube thick: every piece must lie along them, bending round the corners.'] },
  { id: 'soma-mushroom', title: 'The Mushroom', fig: '....|.##.|.##.|..../....|.##.|.##.|..../####|####|####|####/....|.##.|.#..|....', text: 'A mushroom: a stem of 2 × 2 cubes, a flat cap of 4 × 4, and a little knob on top.',
    hints: ['The cap is one cube thick. The pieces that hold its edges cannot reach anywhere but along the cap — or down into the stem.'] },
  { id: 'soma-table', title: 'The Table and Vase', fig: '#..#|....|....|#..#/####|####|####|####/....|.##.|.##.|..../....|.#..|.##.|....', text: 'A square table on four legs, with a vase on it.',
    hints: ['Each leg is a single cube under a corner of the table top.'] }
];

// harder: the figure as a smooth shell (no cube lines to count)
const SHELLS = [
  { id: 'soma-shell-seat', title: 'The Window Seat', fig: 'h:4444|2222|111.', text: 'A seat under a window, with a step in front. This time the figure is a smooth shell, without its cube lines: count the cubes by eye.' },
  { id: 'soma-shell-block', title: 'The Notched Block', fig: 'h:333|323|334', text: 'A 3 × 3 × 3 block — nearly. One cube has been taken from the top and put back somewhere else. Smooth shell: where?' },
  { id: 'soma-shell-l', title: 'The Big L', fig: 'h:32|22|3222|3222', text: 'A big letter L lying on the table, two and three cubes high. Only the shell is shown.' },
  { id: 'soma-shell-bath', title: 'The Sunken Bath', fig: 'h:2222|2112|2112|2221', text: 'A bath sunk into a platform, shown as a smooth shell. Count its walls carefully — one corner is lower.' },
  { id: 'soma-shell-ramp', title: 'The Twisted Ramp', fig: 'h:1112|2223|3334', text: 'A ramp that rises two ways at once. The figure is a smooth shell, so look at it from several sides.' },
  { id: 'soma-shell-kennel', title: 'The Kennel', fig: '###|#.#|#.#/###|#.#|#.#/###|###|###/...|###|.../...|.#.|...', text: 'A kennel with an open door, a ridged roof and a little chimney. Smooth shell: the door is easy to miss from behind.' },
  { id: 'soma-shell-spiral', title: 'The Spiral Stair', fig: 'h:122|7.3|543', text: 'Steps winding up around a hole, from one cube high to seven. Shown as a smooth shell — turn it round to count the steps.',
    hints: ['Around the hole, each column is one step higher than the one before it — nearly.'] }
];

const STONE_TEXTS = [
  'No name and no story: 27 cubes the computer grew from the seven pieces. Build it.',
  'A rough lump of rock from the Soma quarry. Build it with all seven pieces.',
  'A shape nobody designed — it grew one piece at a time. Put the seven pieces back together.',
  'Twenty-seven cubes in an odd heap. Every piece is used, every cube filled once.',
  'A pebble of cubes, polished only on the outside. Build it.'
];

function somaFamily(report) {
  const out = [];
  const addOne = (d, keys, show, opts) => {
    opts = opts || {};
    const cells = fig(d.fig);
    const size = keys.reduce((s, k) => s + P.pieceCells(k).length, 0);
    const bad = !P.connected(cells) ? 'not connected' : !d.any && cells.length !== size ? cells.length + ' cubes for pieces of ' + size
      : show === 'views' && P.hull(cells).length !== cells.length ? 'views do not fix it' : null;
    if (bad) throw new Error(d.id + ': ' + bad);
    const r = study(cells, keys, { any: d.any, seed: d.seed });
    if (!r) throw new Error(d.id + ': no solution');
    const k = figKey(cells);
    if (seenFig.has(k) && !opts.again) throw new Error(d.id + ': the same figure as ' + seenFig.get(k));
    if (!seenFig.has(k)) seenFig.set(k, d.id);
    const cd = colourDiff(cells);
    let diff = d.diff;
    if (!diff) {
      const n = r.distinct;
      diff = n >= 40 ? 2 : n >= 8 ? 3 : 4;
      if (show === 'shell') diff = Math.min(5, diff + 1);
      if (show === 'views') diff = n >= 30 ? 4 : 5;
    }
    let explain = d.explain || '';
    if (!d.any && keys.length === 7 && show !== 'views' && !opts.again) {
      const n = Math.round(r.distinct);
      const count = n <= 1 ? 'As far as the computer can find, this figure can be built in only **one** way (turnings and mirror images of the whole figure aside).'
        : 'The computer finds ' + n + ' essentially different ways to build it (turnings and mirror images of the whole figure counted once).';
      explain = explain ? explain + ' ' + count : count;
    }
    const concepts = (d.concepts || []).slice();
    if (show === 'views') {
      explain = 'Every cube the three shadows allow is part of the figure, so the shadows fix it completely: it is the only figure of 27 cubes that casts them. The computer finds ' + Math.round(r.distinct) + ' essentially different ways to build it.';
    }
    if (cd >= 5 && !concepts.includes('coloring-argument')) concepts.push('coloring-argument');
    const p = makePuzzle(Object.assign({}, d, { diff, explain: explain || undefined, concepts, tags: (d.tags || []).concat(show === 'views' ? ['views'] : show === 'shell' ? ['shell'] : []) }), cells, keys, show, r, report);
    if (d.given) p.data.given = lowest(keys, r.place, d.given);
    out.push(p);
    return p;
  };

  WARM.forEach((d) => addOne(Object.assign({ diff: 1 }, d), d.pieces, 'cells', { again: true }));
  addOne(Object.assign({ diff: 2 }, CUBE), SOMA, 'cells', { again: true });
  FIGS.forEach((d) => addOne(d, SOMA, 'cells'));
  SHELLS.forEach((d) => addOne(d, SOMA, 'shell'));

  // figures grown at random from the seven pieces: a pool, then a spread of easy, middling and hard ones
  const names = C.rng(4101).shuffle(S.STONES.slice());
  let ni = 0, made = 0;
  const pool = [];
  for (let s = 1; s <= 700; s++) {
    const spread = 0.2 + (s % 9) * 0.1, maxH = 3 + (s % 3), maxW = 4 + (s % 3), maxD = 4 + (s % 5 === 0 ? 1 : 0);
    const g = S.grown(C.rng(5000 + s), SOMA, { maxH, maxW, maxD, spread });
    if (!g) continue;
    const k = figKey(g.cells);
    if (seenFig.has(k) || pool.some((x) => x.k === k)) continue;
    const r = study(g.cells, SOMA, { seed: s, max: 3000 });
    if (!r) continue;
    pool.push({ s, g, k, d: r.distinct });
  }
  const want = [
    { lo: 1, hi: 8, n: 3, show: 'shell' }, { lo: 1, hi: 8, n: 4, show: 'cells' },
    { lo: 8, hi: 40, n: 2, show: 'shell' }, { lo: 8, hi: 40, n: 5, show: 'cells' },
    { lo: 60, hi: 1e9, n: 2, show: 'cells' }
  ];
  report.push('grown pool: ' + pool.length + ', hard ' + pool.filter((x) => x.d < 8).length);
  pool.sort((a, b) => a.d - b.d || a.s - b.s);
  const picks = [];
  want.forEach((w) => {
    const cand = pool.filter((x) => !x.used && x.d >= w.lo && x.d < w.hi);
    cand.slice(0, w.n).forEach((x) => { x.used = true; picks.push({ x, w }); });
  });
  picks.sort((a, b) => a.x.s - b.x.s);
  picks.forEach(({ x, w }) => {
    const shell = w.show === 'shell';
    const d = { id: 'soma-g' + String(made + 1).padStart(2, '0'), title: 'The ' + names[ni++], fig: x.g.cells, seed: x.s,
      text: STONE_TEXTS[made % STONE_TEXTS.length] + (shell ? ' It is shown as a smooth shell, so count its cubes by eye.' : ''), tags: ['grown'] };
    addOne(d, SOMA, w.show);
    made++;
  });

  // figures fixed by their three shadows
  let nv = 0;
  for (let s = 1; nv < 14 && s < 3000; s++) {
    const f = S.shadowFigure(C.rng(7000 + s), SOMA, 27, 2e5);
    if (!f) continue;
    if (seenFig.has(figKey(f.cells))) continue;
    const b = P.bbox(f.cells);
    if (b.size[1] < 3 && nv % 2) continue;
    const d = {
      id: 'soma-v' + String(nv + 1).padStart(2, '0'), title: 'Shadows of ' + names[ni], fig: f.cells, seed: s,
      text: nv === 0
        ? 'This time the figure itself is hidden. Its three shadows are shown instead: the front view on the back wall, the side view on the side wall, and the view from above on the table. Exactly one figure of 27 cubes casts all three — work it out and build it with the seven pieces. The side panel shows the three views flat, with dots for the shadows of your own cubes.'
        : VIEW_TEXTS[nv % VIEW_TEXTS.length],
      hints: viewHints(f.cells)
    };
    try { addOne(d, SOMA, 'views'); nv++; ni++; } catch (e) { /* next */ }
  }
  return out;
}

/* ======================================================================
 *  Packing blocks
 * ====================================================================== */

const rep = (k, n) => Array.from({ length: n }, () => k);
const CONWAY = rep('K8', 13).concat(['C8', 'O4', 'I3', 'I3', 'I3']);
const SG = rep('O4', 6).concat(rep('M1', 3));

const PACK = [
  // first steps
  { id: 'pack-three-into-eight', title: 'Three into Eight', diff: 1, fig: box(2, 2, 2), pieces: ['V', 'V', 'D2'],
    text: 'Two V pieces (three cubes in a corner) and a pair of cubes make a 2 × 2 × 2 cube. Put them together.',
    hints: ['Stand one V upright.'] },
  { id: 'pack-twin-twists', title: 'Twin Twists', diff: 1, fig: box(2, 2, 2), pieces: ['A', 'A'],
    text: 'Two copies of the same twisted piece make a 2 × 2 × 2 cube. Fit them together.',
    explain: 'Two twists of the same hand make the cube. A twist and its mirror image cannot: try it with the Soma set\'s A and B and they always leave a gap. Handedness matters in three dimensions — which is why the Soma set needs both.',
    concepts: ['rotation-3d'] },
  { id: 'pack-two-tripods', title: 'Two Tripods', diff: 1, fig: box(2, 2, 2), pieces: ['P', 'P'],
    text: 'The tripod is a cube with three arms, one along each direction. Two tripods make a 2 × 2 × 2 cube.',
    hints: ['The two corner cubes — where the arms meet — end up at opposite corners of the cube.'] },
  { id: 'pack-rods', title: 'Nine Rods', diff: 1, fig: box(3, 3, 3), pieces: rep('I3', 9),
    text: 'Nine rods of three cubes fill a 3 × 3 × 3 box. The obvious way works — but can you also do it with the rods pointing in all three directions?' },
  { id: 'pack-abl', title: 'A Brick of Three', diff: 1, fig: box(2, 2, 3), pieces: ['A', 'B', 'L'],
    text: 'The two twists, A and B, and the L make a brick of 2 × 2 × 3 cubes.' },
  { id: 'pack-bpt', title: 'The Awkward Squad', diff: 1, fig: box(2, 2, 3), pieces: ['B', 'P', 'T'],
    text: 'The twist B, the tripod P and the T: three awkward pieces that make a tidy 2 × 2 × 3 brick.' },
  { id: 'pack-slab', title: 'The Paving Slab', diff: 2, fig: box(3, 2, 3), pieces: ['V', 'V', 'L', 'T', 'Z'],
    text: 'Two V pieces, the L, the T and the Z make a slab of 3 × 3 cubes, two deep.' },
  { id: 'pack-nine-corners', title: 'Nine Corners', diff: 2, fig: box(3, 3, 3), pieces: rep('V', 9),
    text: 'Nine V pieces — three cubes in a corner — fill a 3 × 3 × 3 cube.',
    hints: ['Three V\'s can never fill a flat 3 × 3 layer — try it and a gap is always left — so some V\'s must stand upright across two layers.'] },
  { id: 'pack-tetra-tower', title: 'The Tetracube Tower', diff: 2, fig: box(2, 4, 2), pieces: ['L', 'Z', 'A', 'B'],
    text: 'Four tetracubes — the L, the Z and the two twists — make a tower two cubes square and four high.' },
  { id: 'pack-six-tetra', title: 'Six in a Box', diff: 2, fig: box(4, 2, 3), pieces: ['I4', 'O4', 'L', 'T', 'Z', 'P'],
    text: 'Six tetracubes — pieces of four cubes — fill a box of 4 × 3 × 2.' },
  // the eight tetracubes
  { id: 'pack-tetra-half', title: 'Eight Tetracubes, Half Done', diff: 2, fig: box(4, 2, 4), pieces: TETRA, given: 4, seed: 3,
    text: 'There are eight tetracubes — every way of joining four cubes face to face, with the mirror twists counted apart. Together they fill a 4 × 4 × 2 box. Four are in place; put in the other four.' },
  { id: 'pack-tetra-two', title: 'Eight Tetracubes, Two in Place', diff: 3, fig: box(4, 2, 4), pieces: TETRA, given: 2, seed: 5,
    text: 'The eight tetracubes into a 4 × 4 × 2 box, with two already in place.' },
  { id: 'pack-tetracubes', title: 'The Eight Tetracubes', diff: 3, fig: box(4, 2, 4), pieces: TETRA,
    text: 'All eight tetracubes — the straight I, the square O, the L, T and Z, the two twists and the tripod — fill a box of 4 × 4 × 2 cubes. Pack them.',
    hints: ['The straight I and the square O are the easiest to fit: leave them for the end.', 'The three pieces that do not lie flat — the twists and the tripod — each need both layers of the box.'] },
  { id: 'pack-long-box', title: 'The Long Box', diff: 4, fig: box(8, 2, 2), pieces: TETRA,
    text: 'The eight tetracubes again, this time into a long box of 8 × 2 × 2.',
    hints: ['Everything must fit into a column two cubes wide: the flat pieces stand on edge.'] },
  { id: 'pack-slothouber', title: 'The Slothouber–Graatsma Cube', diff: 4, fig: box(3, 3, 3), pieces: SG,
    source: 'Named after the Dutch designers Jan Slothouber and William Graatsma.',
    text: 'Six flat blocks of 1 × 2 × 2 and three single cubes fill a 3 × 3 × 3 cube. It looks easy.',
    hints: ['Think about where the three single cubes can go: any 2 × 2 × 1 block placed next to the centre blocks a lot.', 'The three single cubes lie on one long diagonal of the cube — corner, centre, opposite corner.'],
    explain: 'Apart from turning the cube over, there is only one way: the three single cubes sit on a long diagonal of the cube, and the six blocks wind around them in a pinwheel. The computer confirms it is the only solution.' },
  // pentacubes
  { id: 'pack-penta-brick', title: 'The Pentacube Brick', diff: 3, fig: box(5, 2, 3), pentaSubset: 6, seed: 11,
    text: 'Six pentacubes — pieces of five cubes — fill a brick of 5 × 3 × 2.' },
  { id: 'pack-flat-twelve', title: 'The Flat Twelve', diff: 4, fig: box(5, 3, 4), pieces: FLAT5,
    text: 'The twelve pentominoes, given the thickness of one cube, fill a box of 5 × 4 × 3. On paper they are flat shapes; here you may stand them on edge and turn them any way at all.',
    hints: ['The X (the plus sign) fits in very few places. Put it in first.', 'Stand some pieces upright: a flat layer of the box cannot hold whole pieces everywhere.'] },
  { id: 'pack-flat-wide', title: 'The Wide Twelve', diff: 4, fig: box(6, 2, 5), pieces: FLAT5,
    text: 'The twelve flat pentacubes again, this time into a box of 6 × 5 × 2.' },
  { id: 'pack-flat-long', title: 'The Long Twelve', diff: 5, fig: box(10, 2, 3), pieces: FLAT5,
    text: 'The twelve flat pentacubes into a long box of 10 × 3 × 2 — the tightest of the three boxes.',
    hints: ['The X needs room around its middle: the box is only three wide and two high, so the X must lie across it.'] },
  { id: 'pack-penta-nine', title: 'Nine Pentacubes', diff: 4, fig: box(5, 3, 3), pentaSubset: 9, seed: 21,
    text: 'Nine pentacubes, some flat and some twisted, fill a box of 5 × 3 × 3.' },
  { id: 'pack-penta-ten', title: 'Ten in a Tray', diff: 4, fig: box(5, 2, 5), pentaSubset: 10, seed: 31,
    text: 'Ten pentacubes pack into a square tray of 5 × 5, two cubes deep.' },
  { id: 'pack-thirteen', title: 'Thirteen Pieces, Sixty-Four Cubes', diff: 5, fig: box(4, 4, 4), bedlam: true, seed: 41,
    text: 'Twelve pentacubes and one tetracube fill a 4 × 4 × 4 cube. Commercial puzzles such as the Bedlam cube pack thirteen pieces into the same box; this set is our own.',
    hints: ['Start with the pieces that do not lie flat: they are hardest to fit once the box fills up.'] },
  { id: 'pack-conway', title: 'Conway\'s Box', diff: 5, fig: box(5, 5, 5), pieces: CONWAY,
    source: 'A packing puzzle of John Horton Conway.',
    text: 'Thirteen bricks of 1 × 2 × 4, one 2 × 2 × 2 cube, one 2 × 2 × 1 block and three rods of 1 × 1 × 3 fill a 5 × 5 × 5 box. Conway\'s puzzle is famous for being much harder than it looks.',
    hints: ['The small pieces — the three rods, the cube and the square block — decide everything. Place them first; the bricks will follow.', 'Try the three rods pointing in three different directions, well apart from each other.'] }
];

const WOOD_TEXTS = [
  (n, c) => 'Build the figure of ' + c + ' cubes with these ' + n + ' pieces.',
  (n, c) => 'A figure of ' + c + ' cubes, sawn into ' + n + ' pieces. Put it back together.',
  (n, c) => n.charAt(0).toUpperCase() + n.slice(1) + ' pieces, ' + c + ' cubes, one figure. Every cube filled exactly once.',
  (n, c) => 'The ' + n + ' pieces fit together into this figure of ' + c + ' cubes. Show how.'
];
const VIEW_TEXTS = [
  'Only the three shadows are given: front (on the back wall), side (on the side wall) and top (on the table). One figure casts them all. Build it.',
  'Three shadows, one hidden figure. Work out its shape from the views, then build it.',
  'The figure is hidden; its shadows on the two walls and the table are all you get. Build the one figure that casts them.',
  'Front, side and top: three views of one figure. Build it so that its shadows match all three.'
];
// hints for a figure given by its shadows: the key idea, then the cubes in each layer
function viewHints(cells) {
  const b = P.bbox(cells), layers = [];
  for (let y = b.lo[1]; y <= b.hi[1]; y++) layers.push(cells.filter((c) => c[1] === y).length);
  return [
    'The key: every cube that fits inside all three shadows is part of the figure. So on each square of the top view, stack cubes as high as the front and side views both allow.',
    'Counting from the table up, the layers have ' + layers.join(', ') + ' cubes.'
  ];
}
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen'];

function packFamily(report) {
  const out = [];
  const addOne = (d, keys, show) => {
    const cells = fig(d.fig);
    const size = keys.reduce((s, k) => s + P.pieceCells(k).length, 0);
    if (!P.connected(cells)) throw new Error(d.id + ': not connected');
    if (cells.length !== size) throw new Error(d.id + ': ' + cells.length + ' cubes for pieces of ' + size);
    if (show === 'views' && P.hull(cells).length !== cells.length) throw new Error(d.id + ': views do not fix it');
    const big = cells.length > 40;
    const r = study(cells, keys, { seed: d.seed, max: big ? 200 : 2e5, nodeLimit: big ? 3e6 : 2e7 });
    if (!r) throw new Error(d.id + ': no solution');
    let diff = d.diff;
    if (!diff) {
      const n = keys.length, dist = r.distinct;
      diff = n <= 3 ? 1 : n <= 5 ? 2 : n <= 7 ? 3 : 4;
      if (dist >= 60 && diff > 1) diff--;
      if (dist < 3 && !r.aborted && n > 4) diff++;
      if (show === 'shell' || show === 'views') diff++;
      diff = Math.max(1, Math.min(5, diff));
    }
    let explain = d.explain;
    if (!explain && !r.aborted && keys.length >= 4) {
      const n = Math.round(r.distinct);
      explain = n <= 1 ? 'As far as the computer can find, there is only one way to do it (turnings and mirror images of the whole figure aside).'
        : 'The computer finds ' + n + ' essentially different ways (turnings and mirror images of the whole figure counted once).';
    }
    if (show === 'views') explain = 'Every cube the three shadows allow is part of the figure, so the shadows fix it: it is the only figure of ' + cells.length + ' cubes that casts them.';
    const p = makePuzzle(Object.assign({}, d, { diff, explain, tags: (d.tags || []).concat(show === 'views' ? ['views'] : show === 'shell' ? ['shell'] : []) }), cells, keys, show, r, report);
    if (d.given) p.data.given = lowest(keys, r.place, d.given);
    out.push(p);
    return p;
  };

  // a subset of pentacubes that fills the box (found by trying seeded choices)
  function pentaPick(cells, n, seed) {
    for (let s = 0; s < 400; s++) {
      const rng = C.rng(seed * 1000 + s);
      const keys = rng.shuffle(FLAT5.concat(Q5)).slice(0, n);
      const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
      const r = P.solve(cells, shapes, { max: 1, nodeLimit: 2e5 });
      if (r.sols.length) return keys.sort((a, b) => FLAT5.concat(Q5).indexOf(a) - FLAT5.concat(Q5).indexOf(b));
    }
    throw new Error('no pentacube set for ' + n);
  }

  PACK.forEach((d) => {
    const cells = fig(d.fig);
    let keys = d.pieces;
    if (d.pentaSubset) keys = pentaPick(cells, d.pentaSubset, d.seed);
    if (d.bedlam) keys = pentaPick(box(4, 4, 4).slice(0, 60), 12, d.seed).concat(['T']);
    if (d.bedlam) {
      // make sure the thirteen really fill the 4 × 4 × 4 box
      for (let s = 0; s < 200; s++) {
        const shapes = keys.map((k) => P.pivoted(P.pieceCells(k)));
        const r = P.solve(cells, shapes, { max: 1, nodeLimit: 3e5 });
        if (r.sols.length) break;
        keys = C.rng(d.seed * 77 + s).shuffle(FLAT5.slice(0, 6).concat(Q5)).slice(0, 12).concat(['T']);
      }
    }
    addOne(d, keys, 'cells');
  });

  // figures grown from mixed pieces
  const names = C.rng(9101).shuffle(S.WOODS.slice());
  let ni = 0, made = 0;
  const pools = [
    { n: [2, 3], pool: ['D2', 'I3', 'V', 'L', 'T', 'Z', 'O4', 'A', 'B', 'P'], o: { maxH: 2, maxW: 3, maxD: 3, spread: 0.1 }, count: 5 },
    { n: [4, 4], pool: TETRA, o: { maxH: 3, maxW: 4, maxD: 3, spread: 0.15 }, count: 5 },
    { n: [5, 6], pool: TETRA.concat(['V', 'I3']), o: { maxH: 3, maxW: 4, maxD: 4, spread: 0.25 }, count: 5 },
    { n: [6, 7], pool: FLAT5.concat(Q5), o: { maxH: 3, maxW: 5, maxD: 4, spread: 0.35 }, count: 5 },
    { n: [8, 9], pool: FLAT5.concat(Q5), o: { maxH: 3, maxW: 5, maxD: 5, spread: 0.3 }, count: 4 },
    { n: [7, 7], pool: TETRA.concat(Q5.slice(0, 6)), o: { maxH: 4, maxW: 5, maxD: 5, spread: 0.6 }, count: 4, show: 'shell' }
  ];
  let s = 0;
  pools.forEach((pl) => {
    let k = 0;
    while (k < pl.count && s < 5000) {
      s++;
      const rng = C.rng(20000 + s);
      const n = rng.range(pl.n[0], pl.n[1]);
      const keys = rng.shuffle(pl.pool.slice()).slice(0, n);
      keys.sort((a, b) => pl.pool.indexOf(a) - pl.pool.indexOf(b));
      const g = S.grown(rng, keys, pl.o);
      if (!g) continue;
      if (seenFig.has(figKey(g.cells))) continue;
      seenFig.set(figKey(g.cells), 'grown');
      const id = 'pack-g' + String(made + 1).padStart(2, '0');
      const d = {
        id, title: 'The ' + names[ni] + ' Block', fig: g.cells, seed: s, tags: ['grown'],
        text: WOOD_TEXTS[made % WOOD_TEXTS.length](NUM[n] || n, g.cells.length) + (pl.show === 'shell' ? ' The figure is shown as a smooth shell: count its cubes yourself.' : '')
      };
      try { addOne(d, keys, pl.show || 'cells'); k++; made++; ni++; } catch (e) { /* next */ }
    }
  });

  // shadow figures from the eight tetracubes (32 cubes)
  let nv = 0;
  for (let t = 1; nv < 3 && t < 4000; t++) {
    const f = S.shadowFigure(C.rng(30000 + t), TETRA, 32, 2e5);
    if (!f || seenFig.has(figKey(f.cells))) continue;
    seenFig.set(figKey(f.cells), 'views');
    const d = { id: 'pack-v' + String(nv + 1).padStart(2, '0'), title: 'Shadows of ' + names[ni], fig: f.cells, seed: t, hints: viewHints(f.cells),
      text: nv === 0 ? 'The eight tetracubes build a figure of 32 cubes — but only its three shadows are shown: front on the back wall, side on the side wall, top on the table. Exactly one figure casts them all. Build it.'
        : VIEW_TEXTS[nv % VIEW_TEXTS.length] + ' (All eight tetracubes, 32 cubes.)' };
    try { addOne(d, TETRA, 'views'); nv++; ni++; } catch (e) { /* next */ }
  }
  return out;
}

/* ======================================================================
 *  Writing the files
 * ====================================================================== */

function sortByDiff(list, keepFirst) {
  const first = list.filter((p) => keepFirst.includes(p.id));
  const rest = list.filter((p) => !keepFirst.includes(p.id));
  const order = new Map(rest.map((p, i) => [p.id, i]));
  rest.sort((a, b) => a.diff - b.diff || order.get(a.id) - order.get(b.id));
  return first.concat(rest);
}

function writeFamily(file, meta, list, gen) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/soma.js */');
  lines.push('Cabinet.family(' + JSON.stringify(meta, null, 2).replace(/"([a-zA-Z_]\w*)":/g, '$1:') + ', [');
  list.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => k !== 'data');
    const parts = keys.map((k) => '    ' + k + ': ' + JSON.stringify(p[k]));
    parts.push('    data: ' + JSON.stringify(p.data));
    lines.push('  {\n' + parts.join(',\n') + '\n  }' + (i < list.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  if (!gen.dry) fs.writeFileSync(path.join(ROOT, 'data', file), lines.join('\n') + '\n');
}

if (require.main === module) {
  const dry = process.argv.includes('--dry');
  const report = [];
  const soma = sortByDiff(somaFamily(report), WARM.map((d) => d.id));
  const pack = sortByDiff(packFamily(report), []);
  console.log(report.join('\n'));
  const spread = (list) => [1, 2, 3, 4, 5].map((d) => d + ':' + list.filter((p) => p.diff === d).length).join(' ');
  console.log('soma ' + soma.length + ' (' + spread(soma) + ')   packing ' + pack.length + ' (' + spread(pack) + ')');
  writeFamily('soma.js', {
    id: 'soma', engine: 'soma', cat: 'space', name: 'The Soma cube', order: 3,
    blurb: 'Seven pieces of three and four cubes. Build the cube, then the steps, the bathtub, the dog and dozens of other figures — some shown only by their shadows.',
    origin: { year: 1933, who: 'Piet Hein', note: 'The Danish poet and inventor Piet Hein thought of the seven pieces in 1933. Martin Gardner made the Soma cube famous in *Scientific American* in 1958, and readers sent in hundreds of figures to build.' },
    concepts: ['exact-cover', 'rotation-3d', 'coloring-argument'],
    deps: ['js/lib/dlx.js', 'js/lib/polycube.js']
  }, soma, { dry });
  writeFamily('polycube-packing.js', {
    id: 'polycube-packing', engine: 'soma', cat: 'space', name: 'Packing blocks', order: 4,
    blurb: 'Tetracubes, pentacubes, bricks and blocks: pack every piece into the box, cube for cube — from two twists to Conway\'s notorious 5 × 5 × 5.',
    origin: { who: 'Slothouber and Graatsma, John Conway and others', note: 'After the Soma cube came a whole family of box-packing puzzles in three dimensions, some of them devilishly tight: the Slothouber–Graatsma cube, Conway\'s 5 × 5 × 5 box and the sets of pentacubes.' },
    concepts: ['exact-cover', 'rotation-3d'],
    deps: ['js/lib/dlx.js', 'js/lib/polycube.js']
  }, pack, { dry });
}
