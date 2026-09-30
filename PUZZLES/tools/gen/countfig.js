/* The Puzzle Cabinet · tools/gen/countfig.js
 *
 *   node tools/gen/countfig.js     writes data/count-triangles.js and data/count-squares.js
 *
 * The classic counting figures first (named, with hints), then figures made
 * by the engine's own generator at each level. Every answer is counted by
 * engines/countfig.js.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/countfig.js'));
const K = C.countFigures;
const F = K.FIG;

const NAMES = ['The Kite', 'The Lantern', 'The Tent', 'The Web', 'The Prism', 'The Sail', 'The Gable', 'The Crystal', 'The Fan', 'The Arrowhead', 'The Pyramid', 'The Window', 'The Shard', 'The Lattice', 'The Beacon', 'The Compass Rose', 'The Signpost', 'The Awning', 'The Wedge', 'The Kaleidoscope', 'The Weathervane', 'The Trellis', 'The Harp', 'The Spinnaker', 'The Mosaic', 'The Obelisk', 'The Rafters', 'The Tangle', 'The Envelope', 'The Pennant', 'The Lighthouse', 'The Chevron', 'The Bellows', 'The Canopy', 'The Facet', 'The Loom', 'The Paper Plane', 'The Easel', 'The Spire', 'The Crossroads', 'The Scaffold', 'The Gemstone', 'The Starfish', 'The Portico', 'The Sundial', 'The Rigging', 'The Quilt', 'The Hayloft', 'The Keel', 'The Honeycomb', 'The Iris', 'The Gantry', 'The Ziggurat', 'The Shutter', 'The Pagoda', 'The Prow', 'The Snowflake', 'The Cartwheel', 'The Parapet', 'The Anvil'];

const tri = [];
const sq = [];
const add = (list, id, title, diff, fig, find, text, extra) => {
  const d = { pts: fig.pts.map((p) => p.map((v) => Math.round(v * 1e5) / 1e5)), segs: fig.segs, find };
  d.answer = K.count(d);
  list.push(Object.assign({ id, title, diff, text, data: d }, extra || {}));
};

// ---------- classics: triangles ----------
add(tri, 'count-tri-envelope', 'The Square and Its Diagonals', 1, F.grid(1, 1, [[0, 0, 3]]), 'triangles',
  'A square with both its diagonals drawn. How many triangles can you find?',
  { hints: ['Four small ones meet in the middle.', 'Each diagonal also cuts the square into two big triangles.'], explain: '4 small triangles and 4 made of two small ones: **8**.' });
add(tri, 'count-tri-fan1', 'One Line from the Top', 1, F.fan(1, 0), 'triangles',
  'A triangle with one line from the top corner down to the base.',
  { explain: 'Two small triangles and the whole one: **3**.' });
add(tri, 'count-tri-fan3', 'Three Lines from the Top', 2, F.fan(3, 0), 'triangles',
  'A triangle with three lines from the top corner down to the base.',
  { hints: ['Every triangle here has its top at the top corner, so it is fixed by two lines out of the five that start there.', 'Choose 2 of the 5 lines: 5 × 4 ÷ 2.'], explain: 'Each triangle is decided by two of the five lines from the top corner, so there are 5 × 4 ÷ 2 = **10**.', concepts: ['combinatorics'] });
add(tri, 'count-tri-fan3x1', 'The Fan with a Crossbar', 3, F.fan(3, 1), 'triangles',
  'A triangle with three lines from its top corner to the base, and one line across it parallel to the base.',
  { hints: ['Count the triangles whose base is on the bottom, then those whose base is the crossbar.', 'Each row gives the same count as the fan without a crossbar.'], explain: 'Every triangle has its top at the top corner and its base on one of the two horizontal lines. Each horizontal line gives 10 (two of the five slanting lines), so **20**.', concepts: ['combinatorics'] });
add(tri, 'count-tri-union', 'The Union Flag', 2, F.union(false), 'triangles',
  'A square with both diagonals and both midlines drawn, like a flag.',
  { hints: ['There are 8 small triangles around the centre.', 'Then triangles made of two small ones, and of four.'], explain: '8 small, 4 + 4 of two pieces (on the sides and around the centre)… and the halves of the square along each diagonal: **16** in all.' });
add(tri, 'count-tri-union-diamond', 'The Flag and the Diamond', 3, F.union(true), 'triangles',
  'The flag again, with a diamond joining the midpoints of the sides.',
  { hints: ['The diamond adds four corner triangles and splits the others.', 'Work region by region: corners, the diamond, then the big ones.'] });
add(tri, 'count-tri-grid2', 'Triangles in a Triangle (2)', 1, F.trigrid(2), 'triangles',
  'A triangle split into four small ones by joining the midpoints of its sides.',
  { explain: '4 small ones and the big one: **5**.' });
add(tri, 'count-tri-grid3', 'Triangles in a Triangle (3)', 2, F.trigrid(3), 'triangles',
  'A triangular grid with three small triangles along each side.',
  { hints: ['Some triangles point up and some point down.', 'Nine small, three of side two, one of side three.'], explain: '9 small, 3 of side two and the whole one: **13**. (All point up except three small ones pointing down — count them carefully.)' });
add(tri, 'count-tri-grid4', 'Triangles in a Triangle (4)', 3, F.trigrid(4), 'triangles',
  'A triangular grid with four small triangles along each side.',
  { hints: ['Count by size: side 1, 2, 3, 4 — and remember the upside-down ones, including an upside-down one of side 2.'], explain: 'Side 1: 16, side 2: 7 (6 up, 1 down), side 3: 3, side 4: 1 — **27**.' });
add(tri, 'count-tri-grid5', 'Triangles in a Triangle (5)', 4, F.trigrid(5), 'triangles',
  'A triangular grid with five small triangles along each side.',
  { hints: ['Pointing up: 15 + 10 + 6 + 3 + 1.', 'Pointing down: 10 small, 3 of side two.'], explain: 'Upward: 15 + 10 + 6 + 3 + 1 = 35. Downward: 10 + 3 = 13. Total **48**.' });
add(tri, 'count-tri-pentagram', 'The Pentagram in the Pentagon', 4, F.star(5, 2, true), 'triangles',
  'A regular pentagon with its five diagonals, which draw a five-pointed star. A famous test of patience: how many triangles?',
  { hints: ['The five star points, then the triangles made of a point and the middle.', 'Count by type and multiply by five — the figure has five-fold symmetry.'], explain: 'The figure turns into itself five ways, so the triangles come in groups of five: seven kinds × 5 = **35**.', concepts: ['symmetry'] });
add(tri, 'count-tri-hexagram', 'The Six-Pointed Star', 2, F.star(6, 2, false), 'triangles',
  'Two overlapping triangles make a six-pointed star.',
  { explain: 'Six small point triangles and the two big ones: **8**.' });
add(tri, 'count-tri-hexagram-sides', 'The Star in the Hexagon', 3, F.star(6, 2, true), 'triangles',
  'The six-pointed star inside a hexagon (its sides drawn).');
add(tri, 'count-tri-octagram', 'The Eight-Pointed Star', 4, F.star(8, 2, true), 'triangles',
  'A regular octagon with the diagonals that skip one corner.');

// ---------- classics: squares and rectangles ----------
add(sq, 'count-sq-2x2', 'A Window of Four', 1, F.grid(2, 2, []), 'squares',
  'A square window divided into four panes. How many squares?', { explain: '4 small and the whole window: **5**.' });
add(sq, 'count-sq-3x3', 'Noughts and Crosses', 2, F.grid(3, 3, []), 'squares',
  'The grid of noughts and crosses, closed all round. How many squares?', { hints: ['1 × 1, 2 × 2 and 3 × 3.'], explain: '9 + 4 + 1 = **14**.', concepts: ['combinatorics'] });
add(sq, 'count-sq-4x4', 'The Four by Four', 3, F.grid(4, 4, []), 'squares',
  'A 4 × 4 grid. How many squares of all sizes?', { hints: ['16 + 9 + …'], explain: '16 + 9 + 4 + 1 = **30**.', concepts: ['combinatorics'] });
add(sq, 'count-sq-chess', 'Squares on a Chessboard', 4, F.grid(8, 8, []), 'squares',
  'How many squares, of every size, are there on a chessboard? (Not only the 64 you see first.)',
  { hints: ['A 2 × 2 square can sit in 7 × 7 places.', 'Add 8² + 7² + … + 1².'], explain: '64 + 49 + 36 + 25 + 16 + 9 + 4 + 1 = **204**. An old favourite of puzzle columns.', concepts: ['combinatorics'] });
add(sq, 'count-rect-3x3', 'Rectangles in Noughts and Crosses', 3, F.grid(3, 3, []), 'rectangles',
  'In the closed 3 × 3 grid, how many rectangles are there (squares count as rectangles)?',
  { hints: ['A rectangle is fixed by two of the four upright lines and two of the four level lines.', '6 × 6.'], explain: 'Choose 2 of the 4 vertical lines (6 ways) and 2 of the 4 horizontal ones (6 ways): **36**.', concepts: ['combinatorics'] });
add(sq, 'count-rect-2x4', 'The Bar of Chocolate', 3, F.grid(4, 2, []), 'rectangles',
  'A bar of chocolate, 4 pieces long and 2 wide. How many rectangles can you see (squares included)?',
  { hints: ['Choose two of the five cuts across and two of the three cuts along.'], explain: '10 × 3 = **30**.', concepts: ['combinatorics'] });
add(sq, 'count-rect-chess', 'Rectangles on a Chessboard', 5, F.grid(8, 8, []), 'rectangles',
  'How many rectangles of every size and shape (squares included) are there on a chessboard?',
  { hints: ['Two of the nine vertical lines and two of the nine horizontal lines fix a rectangle.', '36 × 36.'], explain: 'C(9, 2) × C(9, 2) = 36 × 36 = **1296**.', concepts: ['combinatorics'] });

// ---------- made by the generator ----------
let nameAt = 0;
const nextName = () => NAMES[nameAt++ % NAMES.length];
const gen = (list, famId, per, prefix) => {
  const eng = C.engines.countfig;
  let n = 0;
  for (let lv = 1; lv <= 5; lv++) {
    let made = 0, seed = 1;
    while (made < per && seed < 5000) {
      const p = eng.generate(C.rng('countfig:' + famId + ':' + lv + ':' + seed++), lv, { id: famId });
      if (!p) continue;
      const key = JSON.stringify(p.data.segs.length + ':' + p.data.answer + ':' + p.data.pts.length);
      if (list.some((q) => JSON.stringify(q.data.segs.length + ':' + q.data.answer + ':' + q.data.pts.length) === key)) continue;
      n++; made++;
      p.data.pts = p.data.pts.map((q) => q.map((v) => Math.round(v * 1e5) / 1e5));
      p.data.answer = K.count(p.data);
      list.push({ id: prefix + String(n).padStart(3, '0'), title: nextName(), diff: lv, text: p.text, data: p.data });
    }
  }
};
gen(tri, 'count-triangles', 12, 'count-tri-g');
gen(sq, 'count-squares', 9, 'count-sq-g');

function write(file, meta, list) {
  const lines = ['/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/countfig.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', ['];
  list.sort((a, b) => a.diff - b.diff);
  list.forEach((p) => lines.push('  ' + JSON.stringify(p) + ','));
  lines.push(']);');
  fs.writeFileSync(path.join(ROOT, file), lines.join('\n') + '\n');
}
write('data/count-triangles.js', {
  id: 'count-triangles', engine: 'countfig', cat: 'shapes', name: 'Count the triangles', order: 20,
  blurb: 'How many triangles hide in the figure? Big ones, small ones, upside-down ones — click their corners to keep count.',
  concepts: ['combinatorics', 'symmetry']
}, tri);
write('data/count-squares.js', {
  id: 'count-squares', engine: 'countfig', cat: 'shapes', name: 'Count the squares', order: 21,
  blurb: 'Squares and rectangles in grids: from a window of four panes to every rectangle on a chessboard.',
  concepts: ['combinatorics']
}, sq);
console.log('count-triangles: ' + tri.length + ', count-squares: ' + sq.length);
