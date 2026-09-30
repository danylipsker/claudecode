/* The Puzzle Cabinet · tools/gen/twiddle.js
 *
 *   node tools/gen/twiddle.js        writes data/twiddle.js
 *
 * Twiddle, turntables, Loopover and the Hungarian rings. Small boards are
 * searched completely (breadth-first from the goal), so a puzzle can be taken
 * from any distance, up to the farthest positions there are; bigger ones are
 * scrambled at random. Every par is the fewest moves, found by the engine's
 * bidirectional search and checked again by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/twiddle.js'));
const W = C.twiddle;

const full = new Map();
// every position of a small board, by distance from the goal
function layers(d) {
  const key = JSON.stringify(d);
  if (full.has(key)) return full.get(key);
  const M = W.model(d);
  const seen = new Set([M.goal]);
  const out = [[M.goal]];
  let fr = [M.goal];
  while (fr.length) {
    const nx = [];
    for (const x of fr) for (let g = 0; g < M.gens.length; g++) { const y = W.apply(M, x, g); if (!seen.has(y)) { seen.add(y); nx.push(y); } }
    if (nx.length) out.push(nx);
    fr = nx;
  }
  full.set(key, out);
  return out;
}

const used = new Set();
function make(d, depth, rng, opts) {
  opts = opts || {};
  const M = W.model(d);
  let s = null;
  if (opts.full) {
    const L = layers(d);
    if (depth >= L.length) throw new Error('no position at depth ' + depth);
    const layer = L[depth];
    for (let t = 0; t < 1000; t++) { const c = rng.pick(layer); if (!used.has(c)) { s = c; break; } }
  } else {
    for (let t = 0; t < 200 && !s; t++) {
      const r = W.scramble(d, rng, depth, true);
      if (r && !used.has(W.startOf(M, r.data))) s = W.startOf(M, r.data);
    }
  }
  if (!s) throw new Error('could not make ' + JSON.stringify(d) + ' at ' + depth);
  used.add(s);
  const r = W.solve(M, s, M.goal, 5e6);
  if (r.fail || r.path.length !== depth) throw new Error('depth mismatch ' + (r.path && r.path.length) + ' vs ' + depth);
  const data = Object.assign({}, d);
  if (M.kind === 'rings') data.start = s;
  else {
    const a = Array.from(s, (c) => c.charCodeAt(0) - 48);
    data.start = a.map((c) => (M.orient ? c >> 2 : c));
    if (M.orient) data.ori = a.map((c) => c & 3);
  }
  data.sol = r.path.map((gi) => M.gens[gi].tok).join(' ');
  return { data, par: depth, M, s };
}

// the parity of the tile arrangement (for the explanations)
function oddPerm(M, s) {
  const a = Array.from(s, (c) => (c.charCodeAt(0) - 48) >> (M.orient ? 2 : 0));
  let odd = false;
  const seen = new Array(a.length).fill(false);
  for (let i = 0; i < a.length; i++) {
    if (seen[i]) continue;
    let j = i, len = 0;
    while (!seen[j]) { seen[j] = true; j = a[j]; len++; }
    if (len % 2 === 0) odd = !odd;
  }
  return odd;
}

const puzzles = [];
function add(o, made) {
  const p = Object.assign({}, o, { par: made.par, data: made.data });
  if (!p.text) p.text = W.textFor(made.data, made.par);
  puzzles.push(p);
  return p;
}

const TW = { kind: 'twiddle', w: 3, h: 3, k: 2 };
const TABLES3 = { kind: 'turn', w: 4, h: 3, k: 2, tables: [[0, 0], [2, 0], [1, 1]] };
const TABLES5 = { kind: 'turn', w: 4, h: 4, k: 2, tables: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]] };
const WHEELS = { kind: 'turn', w: 5, h: 3, k: 3, tables: [[0, 0], [2, 0]] };
const L3 = { kind: 'loop', w: 3, h: 3 }, L4 = { kind: 'loop', w: 4, h: 4 }, L5 = { kind: 'loop', w: 5, h: 5 }, L43 = { kind: 'loop', w: 4, h: 3 };
const ring = (n, m, style) => ({ kind: 'rings', n, m, goal: W.ringGoal(n, m, style) });

const rng = C.rng(2718);

/* ---------- first puzzles of each kind, with words of their own ---------- */

add({
  id: 'tw-twiddle-01', title: 'First Twist', diff: 1,
  source: 'Simon Tatham\'s *Twiddle*, from his Portable Puzzle Collection.',
  text: 'Nine numbered tiles, and one 2×2 block of them has been given a quarter turn. Turn it back so that the tiles read 1 to 9 in rows.\n\nClick a block to turn it clockwise; right-click (or long-press) to turn it anticlockwise. The block that will turn is outlined as you point.',
  hints: ['Which four tiles are out of place? They form a 2×2 block.', 'They went round one step clockwise, so turn them anticlockwise.'],
  explain: 'A quarter turn is undone by a quarter turn the other way. Notice that a quarter turn moves four tiles round in a cycle — keep that in mind for later puzzles.',
  concepts: ['state-space'], tags: ['twiddle', 'first']
}, make(TW, 1, rng, { full: true }));
add({
  id: 'tw-loop-01', title: 'One Step Aside', diff: 1,
  source: 'Like *Loopover*, a web game by Cary Huang, and *Sixteen* in Simon Tatham\'s Portable Puzzle Collection.',
  text: 'Rows and columns of this board slide round like a loop: a tile pushed off one edge comes back at the other. One row or column has slid one step. Put the tiles back in order, 1 to 9.\n\nDrag a tile to slide its row or column, or click the arrows round the edge.',
  hints: ['Find the line whose tiles are right but shifted.', 'Slide it one step back the other way.'],
  explain: 'One step back undoes one step. On a 3×3 loop every slide moves three tiles round in a cycle.',
  concepts: ['state-space'], tags: ['loop', 'first']
}, make(L3, 1, rng, { full: true }));
add({
  id: 'tw-rings-01', title: 'Crossing Over', diff: 1,
  source: 'After the Hungarian rings, a puzzle of the Rubik\'s-cube years usually credited to Endre Pózsonyi.',
  text: 'Two rings of balls cross each other, sharing the two gold balls where they meet. Turning one ring carries those two balls away from the other. The goal, shown small under the rings: the left ring red, the right ring blue, gold at both crossings.\n\nDrag a ball round its ring, or click the round arrows. A turn of any size counts as one move.',
  hints: ['Only one ring was turned.', 'Bring both gold balls back to the crossings with a single turn.'],
  explain: 'One turn of the right size undoes one turn. With two turns the puzzle becomes more interesting: the crossings are where the rings trade balls.',
  concepts: ['state-space'], tags: ['rings', 'first']
}, make(ring(10, 2, 'three'), 1, rng, { full: true }));
add({
  id: 'tw-turn-01', title: 'Round Table', diff: 1,
  text: 'Three round turntables sit under this board; each carries a 2×2 block of tiles, and only those blocks can turn. Two turns have mixed it up. Put the tiles back in order, 1 to 12.',
  hints: ['Work backwards: which turntable was turned last? Its tiles are nearly right.', 'Undo that turn, then the other one.'],
  explain: 'Turntables are Twiddle with most of the blocks glued down. Fewer choices make each position easier to read, but some arrangements take many more moves.',
  concepts: ['state-space'], tags: ['turntables', 'first']
}, make(TABLES3, 2, rng, { full: false }));

/* ---------- Twiddle 3×3 ---------- */

const TW_T = ['Pinwheel', 'Crossed Fingers', 'The Windmill', 'Round the Houses', 'Carousel', 'Weathervane', 'Whirligig', 'Spinning Plates', 'The Gyroscope'];
const TW_D = [1, 1, 2, 2, 3, 3, 4, 4, 5];
TW_T.forEach((title, i) => {
  const depth = i + 2;
  const mk = make(TW, depth, rng, { full: true });
  const odd = oddPerm(mk.M, mk.s);
  add({
    id: 'tw-twiddle-' + String(i + 2).padStart(2, '0'), title, diff: TW_D[i],
    hints: depth === 2 ? ['Two blocks were turned. The last one turned is the one whose tiles still look like a neat cycle.'] : undefined,
    explain: i === 3 ? 'A quarter turn of a 2×2 block moves four tiles round a cycle, and a cycle of four is an *odd* permutation (three swaps). So every move changes the parity of the arrangement. This one is ' + (odd ? 'odd' : 'even') + ', so it needs an ' + (odd ? 'odd' : 'even') + ' number of moves — and ' + depth + ' is the fewest.' : undefined,
    concepts: i === 3 ? ['state-space', 'parity'] : ['state-space'], tags: ['twiddle']
  }, mk);
});
{
  const mk = make(TW, 11, rng, { full: true });
  add({
    id: 'tw-twiddle-11', title: 'The Farthest Corner', diff: 5,
    text: 'Of the 362,880 ways to arrange nine tiles, only 20 need as many as 11 quarter turns — no arrangement needs more. This is one of them. Solve it in 11.',
    explain: 'A complete search of all 362,880 arrangements (9!, and every one can be reached) shows that the farthest need 11 moves: 20 positions, against 130,042 at 7 moves, the most common distance.',
    concepts: ['state-space', 'parity'], tags: ['twiddle', 'farthest']
  }, mk);
}

/* ---------- Twiddle variants ---------- */

const ROWS3 = Object.assign({ rows: true }, TW), ROWS43 = { kind: 'twiddle', w: 4, h: 3, k: 2, rows: true };
add({ id: 'tw-rows-01', title: 'Rank and File', diff: 1,
  source: 'The "one number per row" option of Simon Tatham\'s Twiddle.',
  text: 'Here tiles carry only the number of the row they belong in: three 1s, three 2s, three 3s. Turn 2×2 blocks until every row holds only its own number. It can be done in 3 moves.',
  hints: ['Any 1 will do in the top row — the tiles with the same number are interchangeable.'],
  concepts: ['state-space'], tags: ['twiddle', 'rows'] }, make(ROWS3, 3, rng, { full: true }));
add({ id: 'tw-rows-02', title: 'Three by Three', diff: 2, concepts: ['state-space'], tags: ['twiddle', 'rows'] }, make(ROWS3, 5, rng, { full: true }));
add({ id: 'tw-rows-03', title: 'Row, Row, Row', diff: 2, concepts: ['state-space'], tags: ['twiddle', 'rows'] }, make(ROWS43, 5, rng, { full: true }));
add({ id: 'tw-rows-04', title: 'The Row Boats', diff: 3, concepts: ['state-space'], tags: ['twiddle', 'rows'] }, make(ROWS43, 7, rng, { full: true }));
{
  const mk = make(ROWS43, 10, rng, { full: true });
  add({ id: 'tw-rows-05', title: 'The Only One', diff: 5,
    text: 'On a 4×3 board with one number per row, there are 34,650 different positions. Exactly one of them needs 10 moves — more than any other. Here it is.',
    explain: 'A complete search from the goal finds one single position at distance 10. It is the unique farthest point of this little universe.',
    concepts: ['state-space'], tags: ['twiddle', 'rows', 'farthest'] }, mk);
}
const OR3 = Object.assign({ orient: true }, TW);
const OR_T = [['Heads Up', 4, 2], ['Stand Up Straight', 6, 3], ['Upright Citizens', 8, 4], ['Head Over Heels', 10, 5]];
OR_T.forEach(([title, depth, diff], i) => {
  add({
    id: 'tw-upright-' + String(i + 1).padStart(2, '0'), title, diff,
    source: i === 0 ? 'The "orientable" option of Simon Tatham\'s Twiddle.' : undefined,
    text: i === 0 ? 'Now the tiles turn as the blocks turn, and each has a bar along its top edge. Put them in order **and** upright, every bar at the top. It can be done in ' + depth + ' moves.' : undefined,
    hints: i === 0 ? ['Four quarter turns of one block bring it back — every tile in it turned a full circle.'] : undefined,
    explain: i === 1 ? 'Every quarter turn turns four tiles a quarter each: a whole turn in total. So the total turning of all nine tiles, counted in quarter turns, never changes modulo 4 — an invariant. That is why you can never have just one tile standing on its head.' : undefined,
    concepts: i === 1 ? ['state-space', 'invariant'] : ['state-space'], tags: ['twiddle', 'upright']
  }, make(OR3, depth, rng, { full: false }));
});
const TW4 = { kind: 'twiddle', w: 4, h: 4, k: 2 }, TW43 = { kind: 'twiddle', w: 4, h: 4, k: 3 };
[['Four Square', 3, 2], ['The Quadrille', 5, 3], ['Chessboard Waltz', 6, 3], ['Sixteen Candles', 7, 4], ['The Big Twiddle', 8, 5]].forEach(([title, depth, diff], i) => {
  add({ id: 'tw-four-' + String(i + 1).padStart(2, '0'), title, diff, concepts: ['state-space'], tags: ['twiddle'] }, make(TW4, depth, rng));
});
[['Big Wheels', 3, 2], ['Ferris Wheels', 4, 3], ['The Great Wheel', 6, 4]].forEach(([title, depth, diff], i) => {
  add({
    id: 'tw-wheels-' + String(i + 1).padStart(2, '0'), title, diff,
    explain: i === 2 ? 'A quarter turn of a 3×3 block moves its eight outer tiles in two cycles of four and leaves the middle one still: two odd cycles make an even permutation. So on this board only even arrangements can ever be reached.' : undefined,
    concepts: i === 2 ? ['state-space', 'parity'] : ['state-space'], tags: ['twiddle']
  }, make(TW43, depth, rng));
});

/* ---------- turntables ---------- */

[['Lazy Susans', 4, 2], ['Dinner Service', 6, 2], ['Three Tables', 8, 3]].forEach(([title, depth, diff], i) => {
  add({ id: 'tw-turn-' + String(i + 2).padStart(2, '0'), title, diff, concepts: ['state-space'], tags: ['turntables'] }, make(TABLES3, depth, rng));
});
[['Five Tables', 4, 2], ['The Quincunx', 6, 3], ['Table Hopping', 8, 4]].forEach(([title, depth, diff], i) => {
  add({ id: 'tw-turn-' + String(i + 5).padStart(2, '0'), title, diff, concepts: ['state-space'], tags: ['turntables'] }, make(TABLES5, depth, rng));
});
add({ id: 'tw-turn-08', title: 'Two Big Wheels', diff: 3,
  text: 'Two turntables, each carrying a 3×3 block; they share a column of three tiles. Put the tiles back in order, 1 to 15. It can be done in 7 moves.',
  hints: ['The shared column is the only way tiles travel from one wheel to the other.'],
  concepts: ['state-space'], tags: ['turntables'] }, make(WHEELS, 7, rng, { full: true }));
{
  const mk = make(WHEELS, 18, rng, { full: true });
  add({ id: 'tw-turn-09', title: 'Gear Train', diff: 5,
    text: 'The same two wheels — but this is as far from home as they can go: 18 quarter turns. Only 14 of the 302,400 reachable positions are this far. Solve it in 18.',
    explain: 'Each wheel moves its eight outer tiles round in two cycles of four and leaves its middle tile where it is, so the two middle tiles never move at all. Between them the wheels can make only 302,400 arrangements, and a full search shows the farthest are 18 moves away.',
    concepts: ['state-space', 'parity'], tags: ['turntables', 'farthest'] }, mk);
}

/* ---------- Loopover ---------- */

const LOOP_T = [['Side Step', 2, 1], ['Loop the Loop', 3, 1], ['Round the Bend', 4, 2], ['Conveyor Belt', 5, 2], ['The Merry-Go-Round', 6, 3]];
LOOP_T.forEach(([title, depth, diff], i) => {
  const mk = make(L3, depth, rng, { full: true });
  add({
    id: 'tw-loop-' + String(i + 2).padStart(2, '0'), title, diff,
    explain: i === 3 ? 'On a 3×3 loop, every slide moves three tiles round a cycle — an *even* permutation. So only half of the 9! arrangements can ever appear: 181,440 of them, and you can never swap just two tiles. The farthest of them need 8 slides.' : undefined,
    concepts: i === 3 ? ['state-space', 'parity'] : ['state-space'], tags: ['loop']
  }, mk);
});
add({ id: 'tw-loop-07', title: 'Long Loop', diff: 3, concepts: ['state-space'], tags: ['loop'] }, make(L43, 5, rng));
[['Sixteen', 4, 2], ['Escalators', 6, 3], ['Paternoster', 7, 4], ['Railway Sidings', 8, 4]].forEach(([title, depth, diff], i) => {
  add({
    id: 'tw-loop-' + String(i + 8).padStart(2, '0'), title, diff,
    source: i === 0 ? 'Simon Tatham\'s *Sixteen* is this puzzle on a 4×4 board.' : undefined,
    explain: i === 0 ? 'On a 4×4 loop a slide moves four tiles round a cycle, which is an *odd* permutation, so — unlike the 3×3 — every arrangement of the sixteen tiles can be reached.' : undefined,
    concepts: i === 0 ? ['state-space', 'parity'] : ['state-space'], tags: ['loop']
  }, make(L4, depth, rng));
});
[['Twenty-Five Tiles', 6, 4], ['The Big Loop', 7, 5]].forEach(([title, depth, diff], i) => {
  add({ id: 'tw-loop-' + String(i + 12).padStart(2, '0'), title, diff, concepts: ['state-space'], tags: ['loop'] }, make(L5, depth, rng));
});

/* ---------- Hungarian rings ---------- */

const R3 = ring(10, 2, 'three'), R4 = ring(10, 2, 'four'), R16 = ring(16, 3, 'four'), RN8 = ring(8, 1, 'numbers'), RN10 = ring(10, 2, 'numbers');
add({ id: 'tw-rings-02', title: 'Two Circles', diff: 1, concepts: ['state-space'], tags: ['rings'] }, make(R3, 2, rng, { full: true }));
add({ id: 'tw-rings-03', title: 'Venn Diagram', diff: 2, concepts: ['state-space'], tags: ['rings'] }, make(R3, 3, rng, { full: true }));
add({ id: 'tw-rings-04', title: 'Figure of Eight', diff: 2,
  text: 'Four colours now: each ring is half one colour and half another, with white balls at the crossings. Match the goal under the rings. It takes 3 turns.',
  concepts: ['state-space'], tags: ['rings'] }, make(R4, 3, rng));
add({ id: 'tw-rings-05', title: 'Crossroads', diff: 3, concepts: ['state-space'], tags: ['rings'] }, make(R4, 4, rng));
add({ id: 'tw-rings-06', title: 'Eclipse', diff: 3,
  text: 'Bigger rings of sixteen places, crossing wide: five balls of each ring lie inside the other. Match the goal in 4 turns.',
  concepts: ['state-space'], tags: ['rings'] }, make(R16, 4, rng));
add({ id: 'tw-rings-07', title: 'Solar and Lunar', diff: 4, concepts: ['state-space'], tags: ['rings'] }, make(R16, 5, rng));
add({ id: 'tw-rings-08', title: 'Counting Beads', diff: 3,
  text: 'Every ball is numbered, so every ball has exactly one home. Put them back as in the goal in 3 turns.',
  concepts: ['state-space'], tags: ['rings', 'numbers'] }, make(RN8, 3, rng));
add({ id: 'tw-rings-09', title: 'Abacus', diff: 4, concepts: ['state-space', 'parity'],
  explain: 'Turning a ring of eight places by one step moves eight balls round a cycle: an odd permutation. So, as with Twiddle, both even and odd arrangements are reachable, and the parity of the number of one-step turns always matches the parity of the arrangement.',
  tags: ['rings', 'numbers'] }, make(RN8, 4, rng));
{
  const mk = make(R3, 11, rng, { full: true });
  add({ id: 'tw-rings-10', title: 'Far Side of the Moon', diff: 5,
    text: 'With three colours, the rings have 1,969,110 different looks. Just 20 of them need 11 turns, and none needs more. This is one. Bring it home in 11.',
    explain: 'A complete search of every colouring the rings can reach shows the farthest positions are 11 turns away (a turn of any size counts as one). Few puzzles let you see their whole state space; this one fits in a computer\'s memory with room to spare.',
    concepts: ['state-space'], tags: ['rings', 'farthest'] }, mk);
}
add({ id: 'tw-rings-11', title: 'The Rosary', diff: 5, concepts: ['state-space'], tags: ['rings', 'numbers'] }, make(RN10, 5, rng));

/* ---------- write ---------- */

puzzles.forEach((p, i) => { p._i = i; });
puzzles.sort((a, b) => a.diff - b.diff || a._i - b._i);
const titles = new Set();
puzzles.forEach((p) => { if (titles.has(p.title)) throw new Error('duplicate title ' + p.title); titles.add(p.title); delete p._i; });

const lines = [];
lines.push('/* The Puzzle Cabinet · data/twiddle.js — made by tools/gen/twiddle.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'twiddle', engine: 'twiddle', cat: 'mechanical', name: 'Twiddle and friends', order: 10,");
lines.push("  blurb: 'Turn blocks of numbered tiles, slide rows round a loop, spin two crossing rings of balls: put everything back in order in the fewest moves.',");
lines.push("  origin: { who: 'Simon Tatham, Cary Huang and others', note: 'Twiddle and Sixteen come from Simon Tatham\\'s Portable Puzzle Collection; Loopover is a web game by Cary Huang; the Hungarian rings, two crossing rings of coloured balls, date from the years of Rubik\\'s cube. The turntables are a variation made for this cabinet.' },");
lines.push("  concepts: ['state-space', 'parity', 'invariant']");
lines.push('}, [');
const emit = (p) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'par', 'text', 'hints', 'explain', 'concepts', 'tags', 'data'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
puzzles.forEach(emit);
lines[lines.length - 1] = lines[lines.length - 1].replace(/,$/, '');
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/twiddle.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
puzzles.forEach((p) => byDiff[p.diff]++);
console.log('twiddle: ' + puzzles.length + ' puzzles; by difficulty ' + byDiff.slice(1).join(' / '));
