/* The Puzzle Cabinet · tools/gen/nets.js
 *
 *   node tools/gen/nets.js      writes data/cube-nets.js
 *
 * A few named classics first, then puzzles made by the engine's own makers
 * (engines/nets.js) with fixed seeds. Every puzzle is checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/space3d.js'));
require(path.join(ROOT, 'engines/nets.js'));
const N = C.nets, S = C.space, E = C.engines.nets;

const out = [];
const used = new Set();
function add(p, id, title, extra) {
  const q = Object.assign({ id, title, diff: p.diff, text: p.text, goal: p.goal }, extra || {}, { data: p.data });
  if (q.data.why) delete q.data.why;
  const r = E.verify(q);
  if (!r.ok) throw new Error(id + ': ' + r.err);
  if (out.some((x) => x.title === q.title)) throw new Error('title twice: ' + q.title);
  out.push(q);
}
const keyOf = (d) => JSON.stringify(d.kind === 'pick' ? d.nets.map((n) => S.freeKey(n.g, n.c)).sort() : d.kind === 'fold' || d.kind === 'opposite' || d.kind === 'pairs' ? [S.freeKey(d.net.g, d.net.c), d.kind, d.ask == null ? '' : S.labelOf(d.net, d.ask)[0]] : d);

/* ---------- named classics ---------- */

const fold = (cells, yes, diff) => ({ diff, data: { kind: 'fold', net: { g: 's', c: cells }, answer: yes } });
const classics = [
  ['nets-cross', 'The Cross', 1, [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]], true,
    'The best-known net of all: six squares in the shape of a cross. Does it fold into a cube?',
    ['The long upright is a belt of four faces that wraps round the cube.', 'The two arms of the cross become the two ends of the belt.'],
    'It folds. The upright of the cross wraps round as four sides of the cube; the two arms fold up as the two remaining sides — no overlaps, no gaps.'],
  ['nets-six-row', 'Six in a Row', 1, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]], false,
    'Six squares in a single strip. Can it be folded into a cube?',
    ['Roll the strip round: after four squares you are back where you started.'],
    'It does not fold. Four squares in a row already wrap all the way round the cube, so the fifth lands on top of the first, the sixth on the second — and the two ends of the cube stay open.'],
  ['nets-brick', 'The Brick', 1, [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], false,
    'Two rows of three squares make a neat rectangle. Will it fold into a cube?',
    ['Look at any four squares that meet at one point.', 'How many faces of a cube meet at a corner?'],
    'It does not fold. Four squares meet at a point in the middle of each 2 × 2 block, but only three faces of a cube meet at a corner — two of them are bound to overlap.'],
  ['nets-tee', 'The Tee', 1, [[0, 0], [1, 0], [2, 0], [1, 1], [1, 2], [1, 3]], true,
    'A capital T made of six squares. Does it fold into a cube?',
    ['The upright of the T is a row of four.', 'The two squares on the crossbar sit on opposite sides of the top of the row.'],
    'It folds: the upright wraps round as a belt of four faces and the two ends of the crossbar close the two open sides.'],
  ['nets-u-bend', 'The U-Bend', 2, [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 0]], false,
    'A row of four squares with a square standing up at each end, like a letter U. Does it fold into a cube?',
    ['The row of four becomes the belt round the cube.', 'Both extra squares are on the same side of the belt…'],
    'It does not fold. The row of four wraps round the cube as a belt, and the belt closes up so that its first and last squares are neighbours. Both flaps stand on the same side of the belt, so both fold over the same open end, one on top of the other — and the other end stays open.'],
  ['nets-staircase', 'The Staircase', 2, [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], true,
    'Six squares climbing down in steps of two. Can the staircase be folded into a cube?',
    ['There is no row of four here, so think of it as three pairs.', 'The two end squares finish up opposite each other.'],
    'It folds — the only net of the cube made of three steps of two. Fold it in 3D and watch the stairs close up.'],
  ['nets-hook', 'The Hook', 2, [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2]], false,
    'A row of four squares that bends down at one end into a hook. Does it fold into a cube?',
    ['Look for a row of more than four squares, round a corner as well as straight.', 'Follow the squares from one end, folding as you go.'],
    'It does not fold. Following the squares round, the last square comes back onto the second, and one side of the cube is never covered.'],
  ['nets-lightning', 'Lightning Strike', 2, [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]], true,
    'A zigzag like a lightning bolt: two squares, then three, then one. Does it fold into a cube?',
    ['The middle row of three becomes three faces round the cube.', 'The squares at the two ends of the zigzag land on opposite sides.'],
    'It folds — this is one of the three nets built from a row of three with a step at each end.']
];
classics.forEach(([id, title, diff, cells, yes, text, hints, explain]) => {
  const p = fold(cells, yes, diff);
  p.text = text;
  p.goal = 'Answer **Yes** or **No**.';
  add(p, id, title, { hints, explain, tags: ['classic'], concepts: ['folding'] });
  used.add(keyOf(p.data));
});

// the tetrahedron: three shapes of four triangles
{
  const tris = S.polyforms('t', 4).map((x) => ({ g: 't', c: x.cells }));
  const p = { diff: 2, data: { kind: 'pick', nets: tris, answer: tris.map((n, i) => (S.netFolds(n) ? i : -1)).filter((i) => i >= 0) } };
  p.text = 'A tetrahedron is a pyramid made of four equilateral triangles. There are only three ways to join four triangles edge to edge. Which of them fold into a tetrahedron?';
  p.goal = 'Select each net that folds into a **tetrahedron**, then press **Answer**.';
  add(p, 'nets-tetra-three', 'Four Triangles', { hints: ['Three faces of a tetrahedron meet at each corner — no more.'], explain: 'Two of the three fold: the big triangle (its three corners fold up to meet over the middle one) and the straight strip. The bent one has three triangles meeting at a point plus a fourth that lands on top of one of them.', concepts: ['folding'] });
  used.add(keyOf(p.data));
}
// the six-sided die
{
  const net = { g: 's', c: [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2], [1, 3]], l: [['d2', 0], ['d3', 1], ['d1', 0], ['d4', 0], ['d5', 0], ['d6', 1]] };
  const p = { diff: 1, data: { kind: 'opposite', net, ask: 2, answer: 5 } };
  p.text = 'An unfolded die. On a real die the opposite faces add up to seven — but check it by folding in your head: which face ends up **opposite** the single pip?';
  p.goal = 'Click the face that lands opposite the **one**, then press **Answer**.';
  add(p, 'nets-die-one', 'The Die Unfolded', { hints: ['The one is in the middle of the cross. Which square is two steps away from it in a straight line?'], explain: 'The six. Squares with one square between them in a straight row always end up opposite each other — and 1 + 6 = 7, as on every proper die.', concepts: ['folding'] });
}

/* ---------- made by the engine ---------- */

const T = {
  pick: ['Paper Patterns', 'Cut-Out Parade', 'The Folding Test', 'Six Squares Each', 'Boxes in Waiting', 'Flat-Pack', 'Will They Close?', 'The Pattern Book', 'A Drawer of Nets', 'Card Cut-Outs', 'The Cardboard Test', 'Lids and Flaps', 'Folding Fortunes', 'The Parcel Office', 'Crease Lines', 'Box or Not?', 'The Stationer\'s Tray', 'The Packing Room', 'The Scissor Pile', 'Sorting the Offcuts', 'The Box Factory', 'Quality Control', 'Eight Candidates', 'Diamonds and Triangles', 'The Eight-Sided Test', 'Triangle Parade', 'Octahedral Offcuts', 'Pyramid Pairs'],
  opposite: ['Across the Cube', 'Face to Face', 'The Far Side', 'Back to Back', 'Opposites Attract', 'Top and Bottom', 'Never Neighbours', 'On the Other Side', 'Across the Way', 'Poles Apart', 'The Hidden Partner', 'Antipodes', 'Head and Tail', 'Heaven and Earth', 'North and South', 'Sunrise, Sunset', 'Far Apart', 'Out of Sight', 'Eight Faces, Four Pairs', 'Through the Middle'],
  pairs: ['Three Couples', 'Pair Them Up', 'Opposite Numbers', 'Partners', 'The Matchmaker', 'Dance Partners', 'Twins Apart', 'The Sock Drawer', 'Couples Only', 'Four Couples', 'Eight Faces Paired', 'Seating Plan'],
  match: ['Which Cube?', 'Fold and Find', 'The Line-Up', 'Spot the Real One', 'Odd Cubes Out', 'The Genuine Article', 'Impostors', 'Three Fakes', 'The Honest Cube', 'The Printer\'s Proof', 'Letter Box', 'Arrows Everywhere', 'The Dice Maker', 'Colour Box', 'Turned About', 'Mirror Trap', 'Which Way Up?', 'The Identity Parade', 'Cube Suspects', 'Paper Detective', 'Lookalikes', 'The Forger', 'Counterfeit Cubes', 'Face Value', 'Printed Matter', 'Folded Evidence', 'Box Clever', 'True Colours'],
  build: ['Mend the Die', 'Missing Faces', 'The Broken Die', 'Patch It Up', 'Die Hard', 'Back in One Piece', 'The Last Square', 'Two to Place', 'Finish the Net', 'Spare Parts', 'The Die Is Cast', 'Three Loose Ends']
};
const nextT = {};
const title = (kind) => { nextT[kind] = (nextT[kind] || 0); return T[kind][nextT[kind]++]; };
let serial = 0;
function make(kind, fn, count, prefix) {
  let made = 0, seed = 1;
  while (made < count && seed < 4000) {
    const p = fn(C.rng('nets:' + prefix + ':' + seed++));
    if (!p) continue;
    const k = keyOf(p.data);
    if (used.has(k)) continue;
    used.add(k);
    serial++;
    add(p, 'nets-' + prefix + '-' + String(++made).padStart(2, '0'), title(kind));
  }
  if (made < count) throw new Error('only ' + made + ' of ' + prefix);
}

make('pick', (r) => N.makePick(r, 1), 5, 'pick1');
make('pick', (r) => N.makePick(r, 2), 5, 'pick2');
make('pick', (r) => N.makePick(r, 3), 5, 'pick3');
make('pick', (r) => N.makePick(r, 4), 4, 'pick4');
make('pick', (r) => N.makePick(r, 5), 3, 'pick5');
make('pick', (r) => { const p = N.makePick(r, 4, { solid: 'octa', n: 5 }); p.diff = 4; return p; }, 2, 'octpick4');
make('pick', (r) => { const p = N.makePick(r, 5, { solid: 'octa', n: 6 }); p.diff = 5; return p; }, 2, 'octpick5');
make('opposite', (r) => N.makeOpposite(r, 1), 6, 'opp1');
make('opposite', (r) => N.makeOpposite(r, 2), 5, 'opp2');
make('opposite', (r) => N.makeOpposite(r, 3), 4, 'opp3');
make('opposite', (r) => N.makeOpposite(r, 4, { solid: 'octa' }), 4, 'octopp');
make('pairs', (r) => N.makePairs(r, 2), 4, 'pairs2');
make('pairs', (r) => N.makePairs(r, 3), 4, 'pairs3');
make('pairs', (r) => N.makePairs(r, 5, { solid: 'octa' }), 3, 'octpairs');
make('match', (r) => N.makeMatch(r, 2), 6, 'match2');
make('match', (r) => N.makeMatch(r, 3), 6, 'match3');
make('match', (r) => N.makeMatch(r, 4), 6, 'match4');
make('match', (r) => N.makeMatch(r, 5), 6, 'match5');
make('build', (r) => N.makeBuild(r, 2), 3, 'build2');
make('build', (r) => N.makeBuild(r, 3), 3, 'build3');
make('build', (r) => N.makeBuild(r, 4), 3, 'build4');
make('build', (r) => N.makeBuild(r, 5), 2, 'build5');
{
  const a = N.makeAll('cube');
  add(Object.assign(a, { diff: 4 }), 'nets-all-cube', a.title, { tags: ['classic'], concepts: ['folding', 'symmetry'], explain: N.explainText(a.data) });
  const o = N.makeAll('octa');
  add(Object.assign(o, { diff: 5 }), 'nets-all-octa', o.title, { concepts: ['folding', 'symmetry'], explain: N.explainText(o.data) });
}

/* ---------- order: easiest first, the kinds interleaved ---------- */

const byDiff = {};
out.forEach((p) => { (byDiff[p.diff] = byDiff[p.diff] || []).push(p); });
const final = [];
Object.keys(byDiff).sort().forEach((dv) => {
  const list = byDiff[dv];
  const classics2 = list.filter((p) => p.tags && p.tags.includes('classic'));
  const rest = list.filter((p) => !classics2.includes(p));
  const groups = {};
  rest.forEach((p) => { (groups[p.data.kind] = groups[p.data.kind] || []).push(p); });
  const keys = Object.keys(groups);
  final.push(...classics2);
  for (let i = 0; keys.some((k) => groups[k][i]); i++) keys.forEach((k) => { if (groups[k][i]) final.push(groups[k][i]); });
});

const meta = {
  id: 'cube-nets',
  engine: 'nets',
  cat: 'space',
  name: 'Cube nets',
  order: 1,
  blurb: 'Flat patterns that fold into cubes — and a few tetrahedra and octahedra. Which ones fold, which faces end up opposite, which cube they make. Fold every one of them in 3D.',
  origin: { year: 1525, who: 'Albrecht Dürer', note: 'Dürer\'s *Underweysung der Messung* (1525) is the first known book to print nets: flat patterns of solids to cut out and fold. The eleven nets of the cube are a favourite of puzzle books and classrooms ever since.' },
  concepts: ['folding', 'rotation-3d', 'symmetry']
};
const lines = ['/* The Puzzle Cabinet · data/cube-nets.js — made by tools/gen/nets.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', ['];
final.forEach((p) => lines.push('  ' + JSON.stringify(p) + ','));
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/cube-nets.js'), lines.join('\n') + '\n');
const spread = {};
final.forEach((p) => { spread[p.diff] = (spread[p.diff] || 0) + 1; });
console.log('cube-nets: ' + final.length + ' puzzles', JSON.stringify(spread), (fs.statSync(path.join(ROOT, 'data/cube-nets.js')).size / 1024).toFixed(0) + ' KB');
