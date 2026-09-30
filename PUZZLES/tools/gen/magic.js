/* The Puzzle Cabinet · tools/gen/magic.js
 *
 *   node tools/gen/magic.js        writes data/magic-squares.js and data/magic-figures.js
 *
 * The classics first (the Lo Shu, Dürer, the temple square, Franklin, the
 * staircase of Siam, the magic hexagon, the no-neighbours puzzle …), then
 * squares and figures made by js/lib/magic.js: a random full arrangement, and
 * printed numbers chosen until the answer is unique and reasoning alone can
 * finish it. Every puzzle is checked by the solver; "any" puzzles accept every
 * arrangement that keeps the rule.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/magic.js'));
require(path.join(ROOT, 'engines/magic.js'));
const M = C.Magic;
const t0 = Date.now();

/* ---------- helpers ---------- */

function solveAny(d) {
  const r = M.count(M.figure(d), { limit: 1, nodeLimit: 5e7 });
  if (!r.n) throw new Error('no arrangement for ' + JSON.stringify(d).slice(0, 80));
  return r.first;
}
function countAll(d, lim) { return M.count(M.figure(d), { limit: lim || 1e6, nodeLimit: 5e8 }).n; }

// givens for a known answer: `must` slots first, then as few as keep the answer unique and reasoning able to finish
function withGivens(d, sol, rng, opts) {
  opts = opts || {};
  const F0 = M.figure(Object.assign({}, d, { givens: [] }));
  const N = F0.N;
  let gv = (opts.must || []).slice();
  const uniq = (list) => M.count(M.figure(Object.assign({}, d, { givens: list.map((s) => [s, sol[s]]) })), { limit: 2, nodeLimit: 3e6 }).n === 1;
  const order = rng.shuffle(Array.from({ length: N }, (_, i) => i).filter((i) => gv.indexOf(i) < 0));
  for (const s of order) { if (uniq(gv)) break; gv.push(s); }
  if (!uniq(gv)) throw new Error('could not make unique');
  for (let i = gv.length - 1; i >= 0; i--) {
    if ((opts.must || []).indexOf(gv[i]) >= 0) continue;
    const s = gv[i];
    gv.splice(i, 1);
    if (!uniq(gv)) gv.splice(i, 0, s);
  }
  let added = 0;
  for (const s of order) { if (added >= (opts.extra || 0)) break; if (gv.indexOf(s) < 0) { gv.push(s); added++; } }
  const dd = Object.assign({}, d, { givens: gv.sort((x, y) => x - y).map((s) => [s, sol[s]]), sol });
  const g = M.solvable(dd, sol, rng);
  if (!g) throw new Error('reasoning cannot finish ' + JSON.stringify(d).slice(0, 60));
  return { d: dd, g };
}

const outSq = [], outFig = [];
const ids = new Set();
function add(list, p) {
  if (ids.has(p.id)) throw new Error('duplicate id ' + p.id);
  ids.add(p.id);
  list.push(p);
}
function gradeOf(d) { return d.any ? null : M.grade(M.figure(d)); }

/* ---------- squares: the classics ---------- */

const LOSHU = [4, 9, 2, 3, 5, 7, 8, 1, 6];
add(outSq, {
  id: 'magic-lo-shu', title: 'The Lo Shu', diff: 1,
  source: 'Chinese legend; the Lo Shu is the oldest known magic square.',
  text: 'Chinese legend tells of a great flood, and of a turtle that climbed out of the river Luo with a pattern of dots on its shell. In every row, column and diagonal the dots came to the same total. Rebuild the pattern with the tiles 1 to 9 — odd numbers in white dots, even numbers in black. Two tiles are already in place.',
  hints: ['Every line of three makes 15: the nine numbers add up to 45, shared among three rows.', 'The 5 belongs in the middle: it is the only number that can sit on four lines at once.', 'Across the middle from the 4 is the 6; across from the 9 is the 1.'],
  explain: 'The Lo Shu: 4 9 2 / 3 5 7 / 8 1 6. Opposite numbers around the centre always make 10, the even numbers sit in the corners and the odd ones in between. Every 3 × 3 magic square of the numbers 1 to 9 is this one, turned or reflected — eight versions in all.',
  concepts: ['magic-constant', 'symmetry'], tags: ['3 × 3', 'legend', 'classic'],
  data: { fig: 'square', n: 3, target: 15, givens: [[0, 4], [1, 9]], sol: LOSHU, dots: true }
});
add(outSq, {
  id: 'magic-eight-ways', title: 'Eight Ways to Fifteen', diff: 1,
  text: 'Put 1 to 9 in the square so that every row, every column and both diagonals make 15. Nothing is given, and any correct square counts.',
  hints: ['The magic sum is 45 ÷ 3 = 15.', 'The centre must be 5: add up the middle row, the middle column and both diagonals — they cover every cell once and the centre three extra times.', 'The even numbers go in the corners.'],
  explain: 'There is really only one answer — the Lo Shu — and the other seven are its turns and reflections. The centre is forced to be 5, pairs across the centre make 10, and 1 cannot sit in a corner (the corner lines would need two more numbers making 14 three times over).',
  concepts: ['magic-constant', 'symmetry'], tags: ['3 × 3', 'classic'], links: ['magic-lo-shu'],
  data: { fig: 'square', n: 3, target: 15, sol: LOSHU, any: true }
});

// Dürer: the year of the engraving sits in the middle of the bottom row
const DURER = [16, 3, 2, 13, 5, 10, 11, 8, 9, 6, 7, 12, 4, 15, 14, 1];
{
  const x = withGivens({ fig: 'square', n: 4, target: 34 }, DURER, C.rng(1514), { must: [13, 14] });
  add(outSq, {
    id: 'magic-durer', title: 'Dürer\'s Square', year: 1514, diff: Math.max(2, x.g.level),
    source: 'Albrecht Dürer, the engraving *Melencolia I* (1514).',
    text: 'In the engraving *Melencolia I*, Albrecht Dürer hung a 4 × 4 magic square on the wall, with the year of the work — 15 14 — in the middle of the bottom row. Rebuild it: the numbers 1 to 16, with every row, column and diagonal making 34.',
    hints: ['The magic sum: 1 + 2 + … + 16 = 136, shared among four rows, is 34.', 'Work on the lines that already have two or three numbers in them.'],
    explain: 'Dürer\'s square: 16 3 2 13 / 5 10 11 8 / 9 6 7 12 / 4 15 14 1. It does more than it must: the four corners make 34, so do the four centre cells, and so does each of the four 2 × 2 quarters.',
    concepts: ['magic-constant', 'deduction'], tags: ['4 × 4', 'art', 'classic'], data: x.d
  });
}

// the temple square at Khajuraho: every broken diagonal makes 34 too
const KHAJ = [7, 12, 1, 14, 2, 13, 8, 11, 16, 3, 10, 5, 9, 6, 15, 4];
{
  const x = withGivens({ fig: 'square', n: 4, target: 34 }, KHAJ, C.rng(954), { extra: 1 });
  add(outSq, {
    id: 'magic-khajuraho', title: 'The Temple Square', diff: Math.max(2, x.g.level),
    source: 'An inscription at the Parshvanath temple, Khajuraho, India.',
    text: 'A 4 × 4 square carved at the Parshvanath temple in Khajuraho, India, is more than magic. Rebuild it: 1 to 16, every row, column and diagonal making 34.',
    hints: ['Look for a line with a single gap.', 'In this square the numbers in each 2 × 2 corner block also make 34.'],
    explain: 'The temple square: 7 12 1 14 / 2 13 8 11 / 16 3 10 5 / 9 6 15 4. It is *pandiagonal*: the broken diagonals, which run off one edge and come back on the other (like 12 + 8 + 5 + 9), make 34 as well. Such squares can be shifted a row or a column round and stay magic.',
    concepts: ['magic-constant', 'symmetry'], tags: ['4 × 4', 'pandiagonal', 'classic'], data: x.d
  });
}

// the staircase of Siam (de la Loubère's method), 5 × 5
function siamese(n) {
  const a = new Array(n * n).fill(0);
  let r = 0, c = (n - 1) / 2;
  for (let v = 1; v <= n * n; v++) {
    a[r * n + c] = v;
    const r2 = (r - 1 + n) % n, c2 = (c + 1) % n;
    if (a[r2 * n + c2]) r = (r + 1) % n; else { r = r2; c = c2; }
  }
  return a;
}
{
  const S5 = siamese(5);
  const must = [1, 2, 3, 4, 5].map((v) => S5.indexOf(v));
  const x = withGivens({ fig: 'square', n: 5, target: 65 }, S5, C.rng(1691), { must });
  add(outSq, {
    id: 'magic-siam', title: 'The Staircase of Siam', diff: Math.max(3, x.g.level),
    source: 'The method Simon de la Loubère brought back to France from Siam in the late 17th century.',
    text: 'A French envoy home from Siam brought a simple recipe for odd-sized squares: put 1 in the middle of the top row, then keep stepping one up and one to the right, wrapping around the edges — and when the next cell is already taken, drop one straight down instead. This 5 × 5 was begun that way. Finish it, with every line making 65.',
    hints: ['Follow the recipe from 5: one up and one right lands on the 1, which is taken, so 6 goes straight below the 5.', 'Keep climbing: 6, 7, 8, 9, 10, then drop again below the 10 for 11.'],
    explain: 'The finished square: 17 24 1 8 15 / 23 5 7 14 16 / 4 6 13 20 22 / 10 12 19 21 3 / 11 18 25 2 9. The same staircase makes a magic square of any odd size.',
    concepts: ['magic-constant', 'deduction'], tags: ['5 × 5', 'method', 'classic'], data: x.d
  });
}

// Franklin's 8 × 8 with bent diagonals
const FRANKLIN = [52, 61, 4, 13, 20, 29, 36, 45, 14, 3, 62, 51, 46, 35, 30, 19, 53, 60, 5, 12, 21, 28, 37, 44, 11, 6, 59, 54, 43, 38, 27, 22, 55, 58, 7, 10, 23, 26, 39, 42, 9, 8, 57, 56, 41, 40, 25, 24, 50, 63, 2, 15, 18, 31, 34, 47, 16, 1, 64, 49, 48, 33, 32, 17];
{
  // check what we say about it
  const half = [];
  for (let r = 0; r < 8; r++) half.push(FRANKLIN.slice(r * 8, r * 8 + 4).reduce((a, b) => a + b), FRANKLIN.slice(r * 8 + 4, r * 8 + 8).reduce((a, b) => a + b));
  const blocks = [];
  for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) blocks.push(FRANKLIN[r * 8 + c] + FRANKLIN[r * 8 + c + 1] + FRANKLIN[r * 8 + 8 + c] + FRANKLIN[r * 8 + 8 + c + 1]);
  if (half.some((x) => x !== 130)) throw new Error('Franklin half rows');
  const blocks130 = blocks.every((x) => x === 130);
  const d = { fig: 'square', n: 8, franklin: true, target: 260 };
  const rng = C.rng(1706);
  // print most of the square: blank a scattering of cells, keeping the answer unique
  const blanks = [];
  for (const s of rng.shuffle(Array.from({ length: 64 }, (_, i) => i))) {
    if (blanks.length >= 16) break;
    const b2 = blanks.concat([s]);
    const gv = [];
    for (let i = 0; i < 64; i++) if (b2.indexOf(i) < 0) gv.push([i, FRANKLIN[i]]);
    const dd = Object.assign({}, d, { givens: gv, sol: FRANKLIN, nums: Array.from({ length: 64 }, (_, i) => i + 1) });
    if (M.count(M.figure(dd), { limit: 2 }).n !== 1) continue;
    if (!M.reason(M.figure(dd)).solved) continue;
    blanks.push(s);
  }
  const gv = [];
  for (let i = 0; i < 64; i++) if (blanks.indexOf(i) < 0) gv.push([i, FRANKLIN[i]]);
  const dd = Object.assign({}, d, { givens: gv, sol: FRANKLIN });
  add(outSq, {
    id: 'magic-franklin', title: 'Franklin\'s Bent Diagonals', diff: 3,
    source: 'Benjamin Franklin, who described making such squares in one of his letters.',
    text: 'Benjamin Franklin made squares like this one to pass the time as a young clerk of the Pennsylvania Assembly. Every row and every column of this 8 × 8 makes 260 — and so does every **bent diagonal**: four cells slanting down to the right, then four slanting back down to the left (wrapping around the sides). Most of the numbers are in place. Put back the ' + blanks.length + ' that are missing.',
    hints: ['Find a row, a column or a bent diagonal with a single gap.', 'The bent diagonal totals are shown along the top, one for each column where a bent diagonal starts.'],
    explain: 'Franklin\'s square has more hidden in it than the lines checked here: every half row and half column makes 130, and the bent diagonals work turned in all four directions' + (blocks130 ? ', and any 2 × 2 block of four cells makes 130' : '') + '. It is not magic on its two main diagonals, though — Franklin traded them for the bent ones.',
    concepts: ['magic-constant', 'deduction'], tags: ['8 × 8', 'classic'], data: dd
  });
}

add(outSq, {
  id: 'magic-nine-primes', title: 'Nine Primes', diff: 2,
  text: 'These nine prime numbers can make a magic square: every row, column and diagonal adding up to 177. Find it — any of its turns or reflections counts.',
  hints: ['The centre of a 3 × 3 magic square is always a third of the magic sum.', 'The centre is 59, and the pairs across it make 118: 17 and 101, 89 and 29, 71 and 47, 113 and 5.'],
  explain: 'One answer: 17 89 71 / 113 59 5 / 47 29 101. In any 3 × 3 magic square the centre is a third of the magic sum, and the numbers across from each other around it add up to twice the centre.',
  concepts: ['magic-constant', 'symmetry'], tags: ['3 × 3', 'primes'],
  data: { fig: 'square', n: 3, target: 177, nums: [5, 17, 29, 47, 59, 71, 89, 101, 113], sol: [17, 89, 71, 113, 59, 5, 47, 29, 101], any: true }
});
add(outSq, {
  id: 'magic-times', title: 'Times, Not Plus', diff: 3,
  text: 'A square for multiplying: place the nine numbers so that every row, column and diagonal has the same **product**, 216. Any arrangement that works counts.',
  hints: ['6 × 6 × 6 = 216: the centre is 6.', 'Every number here is a power of 2 times a power of 3. Multiplying adds the powers — so think of the Lo Shu.'],
  explain: 'Write each number as 2^a × 3^b with a and b from 0 to 2. Multiplying three numbers adds their powers of 2 and their powers of 3, so the square works exactly when the powers form magic squares of their own — the Lo Shu in disguise. One answer: 2 36 3 / 9 6 4 / 12 1 18.',
  concepts: ['magic-constant', 'symmetry'], tags: ['3 × 3', 'multiplication'],
  data: { fig: 'square', n: 3, rule: 'prod', target: 216, nums: [1, 2, 3, 4, 6, 9, 12, 18, 36], sol: solveAny({ fig: 'square', n: 3, rule: 'prod', target: 216, nums: [1, 2, 3, 4, 6, 9, 12, 18, 36] }), any: true }
});
add(outSq, {
  id: 'magic-nothing-alike', title: 'Nothing Alike', diff: 2,
  text: 'The opposite of magic: put 1 to 9 in the square so that the eight lines — three rows, three columns, two diagonals — all have **different** totals. Any arrangement that works counts.',
  hints: ['Big numbers together make big totals: try the largest numbers bunched in one corner.'],
  explain: 'Such a square is sometimes called a *heterosquare*. They are easy to find by trial — unlike magic squares, there are a great many of them.',
  concepts: ['magic-constant'], tags: ['3 × 3', 'antimagic'],
  data: { fig: 'square', n: 3, rule: 'hetero', sol: solveAny({ fig: 'square', n: 3, rule: 'hetero' }), any: true }
});
add(outSq, {
  id: 'magic-antimagic', title: 'Antimagic', diff: 4,
  text: 'Put 1 to 16 in the square so that the ten totals — four rows, four columns and two diagonals — are all different **and** make a run of ten consecutive numbers (say 29, 30, 31 … 38). Any arrangement that works counts.',
  hints: ['The four rows share the total 136, as do the four columns, so their average is 34: the run sits around 34.', 'Put the largest numbers along one row and one column, the smallest along the opposite ones.'],
  explain: 'One answer: 1 10 16 2 / 15 4 6 9 / 7 11 12 8 / 13 5 3 14 — its totals are 29 to 38. Squares like this are called *antimagic*; there are none of size 3 × 3, but plenty from 4 × 4 up.',
  concepts: ['magic-constant'], tags: ['4 × 4', 'antimagic'],
  data: { fig: 'square', n: 4, rule: 'anti', sol: [1, 10, 16, 2, 15, 4, 6, 9, 7, 11, 12, 8, 13, 5, 3, 14], any: true }
});

// 3 × 3 squares of other runs of numbers
const runs = [
  { a: 2, step: 2, title: 'A Square of Evens' }, { a: 1, step: 2, title: 'Odd Numbers Only' }, { a: 10, step: 10, title: 'In Tens' },
  { a: 5, step: 1, title: 'From Five to Thirteen' }, { a: 3, step: 3, title: 'By Threes' }, { a: 7, step: 7, title: 'Sevens' }
];
runs.forEach((q, k) => {
  const nums = Array.from({ length: 9 }, (_, i) => q.a + i * q.step);
  const map = LOSHU.map((v) => nums[v - 1]);
  // turn the Lo Shu around so the puzzles do not all look alike
  const rot = (arr, t) => { let b = arr.slice(); for (let i = 0; i < t; i++) b = [b[6], b[3], b[0], b[7], b[4], b[1], b[8], b[5], b[2]]; return b; };
  const sol = rot(k % 2 ? [map[2], map[1], map[0], map[5], map[4], map[3], map[8], map[7], map[6]] : map, k % 4);
  const x = withGivens({ fig: 'square', n: 3, nums, target: 3 * nums[4] }, sol, C.rng(300 + k), { extra: k < 3 ? 1 : 0 });
  add(outSq, {
    id: 'magic-run-' + (k + 1), title: q.title, diff: x.g.level,
    text: 'Put the numbers ' + nums.join(', ') + ' into the square so that every row, column and diagonal makes **' + 3 * nums[4] + '**. ' + (x.d.givens.length === 1 ? 'One number is' : x.d.givens.length + ' numbers are') + ' already in place.',
    hints: ['The middle number of the nine always goes in the centre.', 'This is the Lo Shu in disguise: each number is a step along from ' + q.a + '.'],
    concepts: ['magic-constant'], tags: ['3 × 3'], links: ['magic-lo-shu'], data: x.d
  });
});
console.log('square classics', outSq.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');
if (countAll({ fig: 'square', n: 3, rule: 'anti' }, 1)) throw new Error('a 3 × 3 antimagic square exists after all?');

/* ---------- squares: made ones ---------- */

function makeMany(list, prefix, specs, words) {
  let k = 0;
  specs.forEach(([d0, level, count, seedBase]) => {
    let made = 0;
    for (let s = 0; made < count && s < 400; s++) {
      const rng = C.rng(seedBase + s);
      const F0 = M.figure(d0);
      const sol = M.randomFill(F0, rng, 6e5);
      if (!sol) continue;
      const gv = M.chooseGivens(F0, sol, rng, [0, 2, 1, 0, 0, 0][level]);
      if (!gv) continue;
      const dd = Object.assign({}, d0, { givens: gv, sol });
      const g = M.solvable(dd, sol, rng);
      if (!g || g.level !== level) continue;
      k++;
      made++;
      const F = M.figure(dd);
      const w = words(F, dd, k);
      add(list, Object.assign({ id: prefix + String(k).padStart(2, '0'), diff: level, data: dd }, w));
    }
    if (made < count) console.log('  short:', JSON.stringify(d0), 'level', level, made + '/' + count);
  });
}
const sqWords = (F, dd, k) => {
  const w = C.magicWords(F, dd);
  return { title: F.n + ' × ' + F.n + ' no. ' + k, text: w.text, concepts: ['magic-constant', 'deduction'], tags: w.tags.concat([F.n + ' × ' + F.n]) };
};
makeMany(outSq, 'magic-sq-', [
  [{ fig: 'square', n: 4, target: 34 }, 2, 6, 4000],
  [{ fig: 'square', n: 4, target: 34 }, 3, 12, 4200],
  [{ fig: 'square', n: 4, target: 34 }, 4, 12, 4400],
  [{ fig: 'square', n: 5, target: 65 }, 3, 4, 5000],
  [{ fig: 'square', n: 5, target: 65 }, 4, 12, 5200],
  [{ fig: 'square', n: 5, target: 65 }, 5, 12, 5400]
], sqWords);
console.log('squares', outSq.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* ---------- figures: the classics ---------- */

const NUMW = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
const numw = (n) => NUMW[n] || String(n);
// triangles of 1-6 and of 1-9: any arrangement
[9, 10, 11, 12].forEach((t) => {
  const d = { fig: 'triangle', k: 3, target: t };
  add(outFig, {
    id: 'magic-tri6-' + t, title: 'A Triangle of ' + numw(t), diff: 1,
    text: 'Put the numbers 1 to 6 in the circles so that each side of the triangle adds up to **' + t + '**. Any way that works counts.',
    hints: ['The corner circles are on two sides each, so they are counted twice.', 'The three sides together make ' + 3 * t + ' = 21 + the three corners: so the corners add up to ' + (3 * t - 21) + '.'],
    explain: 'The corners must add up to ' + (3 * t - 21) + ' (the sides count them twice), which settles them: ' + { 9: '1, 2, 3', 10: '1, 3, 5', 11: '2, 4, 6', 12: '4, 5, 6' }[t] + '. The middle circles then fill themselves in. The four totals 9, 10, 11 and 12 are the only ones possible.',
    concepts: ['magic-constant'], tags: ['triangle'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
});
[17, 19, 20, 21, 23].forEach((t) => {
  const d = { fig: 'triangle', k: 4, target: t };
  add(outFig, {
    id: 'magic-tri9-' + t, title: 'Nine Around a Triangle: ' + t, diff: t === 20 ? 2 : t === 17 || t === 23 ? 3 : 2,
    text: 'Put the numbers 1 to 9 around the triangle — a circle at each corner and two along each side — so that every side adds up to **' + t + '**. Any way that works counts.',
    hints: ['The corners are counted twice: the three sides make ' + 3 * t + ' = 45 + the corners, so the corners add up to ' + (3 * t - 45) + '.', 'Choose three corners that make ' + (3 * t - 45) + ', then pair up the rest.'],
    explain: 'The corners always add up to three times the side total, less 45. Only the totals 17, 19, 20, 21 and 23 can be made (18 and 22 cannot, whatever the corners). For ' + t + ' there are ' + (countAll(d) / 48) + ' essentially different answers.',
    concepts: ['magic-constant', 'symmetry'], tags: ['triangle'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
});
[14, 16, 17, 19].forEach((t) => {
  const d = { fig: 'polygon', sides: 5, k: 3, target: t };
  add(outFig, {
    id: 'magic-pentagon-' + t, title: 'Pentagon of ' + numw(t), diff: t === 14 || t === 19 ? 2 : 3,
    text: 'Put the numbers 1 to 10 around the pentagon — one at each corner and one in the middle of each side — so that every side adds up to **' + t + '**. Any way that works counts.',
    hints: ['The five sides make ' + 5 * t + ' = 55 + the corners, so the corners add up to ' + (5 * t - 55) + '.'],
    explain: 'The corners add up to five times the side total less 55. The possible totals are 14, 16, 17 and 19 — 15 and 18 cannot be done.',
    concepts: ['magic-constant', 'symmetry'], tags: ['pentagon'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
});
{
  const d = { fig: 'star', points: 6, target: 26 };
  add(outFig, {
    id: 'magic-hexagram', title: 'The Star of Twenty-Six', diff: 3,
    text: 'Put the numbers 1 to 12 on the six-pointed star, one in each point and crossing, so that each of the six lines of four adds up to **26**. There are 80 different answers (not counting turns and reflections) — any of them counts.',
    hints: ['Each number is on two lines: 6 lines × 26 = 156 = 2 × 78, the total of 1 to 12. So 26 is forced.', 'Start with the six points: they need not add up to anything special, but big and small numbers should alternate.'],
    explain: 'The magic hexagram has 80 essentially different solutions — a complete count was a famous early computer exercise, but the 80 can be found by hand with patience.',
    concepts: ['magic-constant', 'symmetry'], tags: ['star'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
{
  const nums = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12];
  const d = { fig: 'star', points: 5, nums, target: 24 };
  add(outFig, {
    id: 'magic-pentagram', title: 'A Pentagram of Twenty-Four', diff: 3,
    text: 'With the numbers 1 to 10 a magic pentagram cannot be made at all. Leave out 7 and 11 from 1 to 12, though, and it can: put the ten numbers on the star so that every line of four adds up to **24**. Any way that works counts.',
    hints: ['Every circle is on two lines, so the five lines count every number twice: 2 × 60 = 120 = 5 × 24.', 'Put the 12 at a point of the star and see which pairs its two lines need.'],
    explain: 'Why not 1 to 10? The lines would each have to make 2 × 55 ÷ 5 = 22, and a complete search shows that no arrangement manages it. With 7 and 11 left out of 1 to 12 there are 12 essentially different answers.',
    concepts: ['magic-constant', 'symmetry'], tags: ['star'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
// the magic hexagon: three versions, from friendly to bare
const HEX = solveAny({ fig: 'hexagon', target: 38 });
const HEXF = M.figure({ fig: 'hexagon', target: 38 });
const HEXROWS = HEXF.lines.slice(0, 5).map((l) => l.map((i) => HEX[i]).join(' ')).join(' / ');
const HEXC = HEXF.slots.findIndex(([x, y]) => Math.abs(x) < 1e-9 && Math.abs(y) < 1e-9);
[[8, 3], [5, 4], [3, 5]].forEach(([want, lv], k) => {
  const rng = C.rng(1963 + k);
  const d0 = { fig: 'hexagon', target: 38 };
  const F0 = M.figure(d0);
  let gv = M.chooseGivens(F0, HEX, rng, 0);
  // top up to the number wanted
  const order = rng.shuffle(Array.from({ length: 19 }, (_, i) => i));
  for (const s of order) { if (gv.length >= want) break; if (!gv.some((g) => g[0] === s)) gv.push([s, HEX[s]]); }
  gv.sort((x, y) => x[0] - y[0]);
  const dd = Object.assign({}, d0, { givens: gv, sol: HEX });
  const g = M.solvable(dd, HEX, rng);
  add(outFig, {
    id: 'magic-hexagon-' + (k + 1), title: ['The Magic Hexagon', 'The Magic Hexagon, Barer', 'The Magic Hexagon, Bare Bones'][k], diff: g ? g.level : lv,
    source: k === 0 ? 'Found by Clifford W. Adams after many years of trying; Martin Gardner made it famous in *Scientific American*.' : undefined,
    text: 'Nineteen hexagonal cells, the numbers 1 to 19, and fifteen lines — rows in three directions, of three, four or five cells. Every line must add up to **38**. ' + (k === 0 ? 'Apart from a single cell on its own, this is the only magic hexagon there is. ' : '') + dd.givens.length + ' numbers are in place.',
    hints: ['Every cell lies on three lines, and the five rows in one direction hold every number once: 190 ÷ 5 = 38.', 'Look for a line with one gap; then a line with two gaps and few pairs that fit.'],
    explain: 'The magic hexagon, row by row: ' + HEXROWS + '. The centre is ' + HEX[HEXC] + '. Turns and reflections aside there is no other arrangement of 1 to 19 that works — and no bigger magic hexagon of consecutive numbers at all.',
    concepts: ['magic-constant', 'deduction'], tags: ['hexagon', 'classic'], data: dd
  });
});
// wheels: every line through the hub
[[3, 12, 1], [3, 10, 1], [3, 14, 1], [4, 15, 2], [4, 12, 2], [4, 18, 2], [5, 18, 3]].forEach(([spokes, t, lv]) => {
  const n = 2 * spokes + 1;
  const d = { fig: 'wheel', spokes, target: t };
  const hub = 2 * t - (n * (n + 1) / 2 - 0) / spokes; // hub from the totals: spokes·t = total + (spokes − 1)·hub
  const hubV = (spokes * t - n * (n + 1) / 2) / (spokes - 1);
  void hub;
  add(outFig, {
    id: 'magic-wheel-' + spokes + '-' + t, title: 'A Wheel of ' + numw(n) + ': ' + t, diff: lv,
    text: 'Put the numbers 1 to ' + n + ' on the wheel — one at the hub, the rest around the rim — so that every straight line through the hub adds up to **' + t + '**. Any way that works counts.',
    hints: ['The hub is on every line. The ' + spokes + ' lines together make ' + spokes * t + ' = ' + (n * (n + 1) / 2) + ' + ' + (spokes - 1) + ' more copies of the hub.', 'So the hub is ' + hubV + '; pair up the rest to make ' + (t - hubV) + '.'],
    explain: 'The hub must be ' + hubV + ', and the rim numbers pair up across the hub to make ' + (t - hubV) + ' each. The pairs can go round the rim in any order.',
    concepts: ['magic-constant', 'symmetry'], tags: ['wheel'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
});
// three rings (a Venn diagram of circles): the six crossing points
{
  const cs = [[0, -0.84], [-0.76, 0.48], [0.76, 0.48]], r = 1.16;
  const pts = [], lines = [[], [], []];
  for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) {
    const [x1, y1] = cs[i], [x2, y2] = cs[j];
    const dx = x2 - x1, dy = y2 - y1, dd = Math.hypot(dx, dy), aa = dd / 2, hh = Math.sqrt(r * r - aa * aa);
    const mx = x1 + dx / 2, my = y1 + dy / 2;
    for (const sg of [1, -1]) { pts.push([+(mx - sg * hh * dy / dd).toFixed(3), +(my + sg * hh * dx / dd).toFixed(3)]); lines[i].push(pts.length - 1); lines[j].push(pts.length - 1); }
  }
  const badge = cs.map(([x, y]) => { const l = Math.hypot(x, y) || 1; return [+(x / l * (l + r + 0.28)).toFixed(3), +(y / l * (l + r + 0.28)).toFixed(3)]; });
  const d = { fig: 'graph', slots: pts, lines, rings: cs.map(([x, y]) => [x, y, r]), names: ['the top ring', 'the left ring', 'the right ring'], badge, target: 14, scale: 100 };
  add(outFig, {
    id: 'magic-three-rings', title: 'Three Rings', diff: 1,
    text: 'Three rings cross at six points. Put the numbers 1 to 6 on the crossing points so that the four numbers on each ring add up to **14**. Any way that works counts.',
    hints: ['Every point is on two rings, so the three rings count 1 to 6 twice: 42 ÷ 3 = 14.', 'Each ring leaves out two points — and those two make 21 − 14 = 7.'],
    explain: 'The two points a ring misses add up to 7, so 1 and 6, 2 and 5, 3 and 4 are the pairs each ring leaves out — and they sit opposite each other in the pattern.',
    concepts: ['magic-constant', 'symmetry'], tags: ['rings'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
// a cross of nine
{
  const d = { fig: 'graph', slots: [[-2, 0], [-1, 0], [0, 0], [1, 0], [2, 0], [0, -2], [0, -1], [0, 1], [0, 2]], lines: [[0, 1, 2, 3, 4], [5, 6, 2, 7, 8]], names: ['the arm across', 'the arm down'], badge: [[2.85, 0], [0, 2.75]], target: 27, scale: 88 };
  add(outFig, {
    id: 'magic-cross', title: 'A Cross of Nine', diff: 1,
    text: 'Put the numbers 1 to 9 on the cross so that the arm across and the arm down each add up to **27**. Any way that works counts.',
    hints: ['The middle circle is on both arms: 27 + 27 = 45 + the middle.', 'So the middle is 9.'],
    explain: 'The two arms together count every number once and the middle twice: 54 = 45 + the middle, so the middle is 9 and each arm needs 18 more from four numbers.',
    concepts: ['magic-constant'], tags: ['cross'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
// no neighbours: the eight circles, and the corners of a cube
{
  const d = { fig: 'graph', rule: 'apart', slots: [[1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2], [2, 2]],
    edges: [[0, 2], [0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 3], [3, 4], [4, 5], [6, 2], [6, 3], [6, 4], [7, 3], [7, 4], [7, 5]], lines: [], scale: 120 };
  add(outFig, {
    id: 'magic-no-neighbours', title: 'No Neighbours', diff: 2,
    text: 'Put the numbers 1 to 8 in the eight circles so that no two circles joined by a line hold consecutive numbers — no 3 next to a 4, no 7 next to an 8. Any way that works counts.',
    hints: ['The two middle circles are each joined to six others. What can go in a circle with only one circle it is not joined to?', 'A number with only one neighbour in counting: 1 (only 2) and 8 (only 7). Put them in the middle.'],
    explain: 'The two middle circles touch all but one circle each, so they need numbers with a single neighbour in counting: 1 and 8. Then 2 and 7 go in the far circles each middle one does not touch, and the rest follow.',
    concepts: ['deduction'], tags: ['graph', 'classic'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
{
  const d = { fig: 'graph', rule: 'apart', slots: [[0, 0], [2.4, 0], [2.4, 2.4], [0, 2.4], [0.8, 0.8], [1.6, 0.8], [1.6, 1.6], [0.8, 1.6]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]], lines: [], scale: 110 };
  add(outFig, {
    id: 'magic-cube-corners', title: 'Corners of a Cube', diff: 1,
    text: 'The drawing is a cube seen from the front: eight corners, twelve edges. Number the corners 1 to 8 so that no edge joins two consecutive numbers. Any way that works counts.',
    hints: ['Each corner has three edges, so each number has three neighbours in the drawing and four it does not touch.', 'Odd numbers on one set of alternate corners and even on the other would make every edge join an odd to an even — so try mixing them differently.'],
    explain: 'There are many answers here: a corner touches only three others, so each number has plenty of safe places.',
    concepts: ['deduction'], tags: ['graph'], data: Object.assign(d, { sol: solveAny(d), any: true })
  });
}
console.log('figure classics', outFig.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* ---------- figures: made ones ---------- */

const figWords = (F, dd, k) => {
  const w = C.magicWords(F, dd);
  return { title: w.title + ' (no. ' + k + ')', text: w.text, concepts: ['magic-constant', 'deduction'], tags: w.tags };
};
makeMany(outFig, 'magic-fig-', [
  [{ fig: 'triangle', k: 4, target: 20 }, 1, 2, 100],
  [{ fig: 'triangle', k: 4, target: 19 }, 2, 3, 150],
  [{ fig: 'triangle', k: 4, target: 21 }, 2, 3, 200],
  [{ fig: 'polygon', sides: 4, k: 3, target: 12 }, 1, 2, 230],
  [{ fig: 'polygon', sides: 4, k: 3, target: 13 }, 2, 2, 260],
  [{ fig: 'polygon', sides: 5, k: 3, target: 16 }, 2, 2, 280],
  [{ fig: 'polygon', sides: 5, k: 3, target: 17 }, 3, 3, 300],
  [{ fig: 'triangle', k: 5, target: 28 }, 2, 2, 400],
  [{ fig: 'triangle', k: 5, target: 29 }, 3, 3, 450],
  [{ fig: 'triangle', k: 5, target: 30 }, 3, 2, 500],
  [{ fig: 'triangle', k: 5, target: 32 }, 4, 3, 550],
  [{ fig: 'polygon', sides: 4, k: 4, target: 22 }, 3, 2, 580],
  [{ fig: 'star', points: 6, target: 26 }, 3, 4, 600],
  [{ fig: 'star', points: 6, target: 26 }, 4, 8, 700],
  [{ fig: 'star', points: 6, target: 26 }, 5, 3, 800],
  [{ fig: 'star', points: 5, nums: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12], target: 24 }, 3, 2, 850],
  [{ fig: 'star', points: 7, target: 30 }, 4, 7, 900],
  [{ fig: 'star', points: 7, target: 30 }, 5, 4, 1000],
  [{ fig: 'hexagon', target: 38 }, 4, 2, 1100],
  [{ fig: 'hexagon', target: 38 }, 5, 7, 1200]
], figWords);
console.log('figures', outFig.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* ---------- writing ---------- */

function write(file, meta, list) {
  list.sort((a, b) => a.diff - b.diff);
  const titles = new Set();
  list.forEach((p) => { if (titles.has(p.title)) throw new Error('duplicate title ' + p.title); titles.add(p.title); });
  const lines = ['/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/magic.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', ['];
  list.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => k !== 'data' && p[k] !== undefined);
    lines.push('  {' + keys.map((k) => JSON.stringify(k) + ':' + JSON.stringify(p[k])).join(',') + ',"data":' + JSON.stringify(p.data) + '}' + (i < list.length - 1 ? ',' : ''));
  });
  lines.push(']);', '');
  fs.writeFileSync(path.join(ROOT, file), lines.join('\n'));
  const spread = [0, 0, 0, 0, 0, 0];
  list.forEach((p) => spread[p.diff]++);
  console.log('wrote ' + file + ': ' + list.length + ' puzzles; by level ' + spread.slice(1).join(' / '));
}

write('data/magic-squares.js', {
  id: 'magic-squares', engine: 'magic', cat: 'numbers', name: 'Magic squares', order: 2,
  blurb: 'Fill the grid so that every row, column and diagonal adds up to the same magic sum — from the Lo Shu to Dürer and Franklin.',
  origin: { who: 'Chinese legend', note: 'The Lo Shu of Chinese legend is the oldest known magic square. Albrecht Dürer engraved a 4 × 4 square in *Melencolia I* in 1514, and Benjamin Franklin built squares with bent diagonals to pass the time.' },
  concepts: ['magic-constant', 'deduction', 'symmetry']
}, outSq);
write('data/magic-figures.js', {
  id: 'magic-figures', engine: 'magic', cat: 'numbers', name: 'Magic triangles and stars', order: 3,
  blurb: 'Numbers on triangles, stars, wheels and rings — and the one and only magic hexagon: make every line add up. Plus a few contrary cousins.',
  origin: { who: 'Parlour puzzles; Clifford W. Adams', note: 'Magic triangles and stars are old parlour puzzles. The order-3 magic hexagon, 1 to 19 with every line making 38, is the only one of its kind; Clifford W. Adams found it after many years of trying, and Martin Gardner made it famous.' },
  concepts: ['magic-constant', 'symmetry', 'deduction']
}, outFig);
console.log('done', ((Date.now() - t0) / 1000).toFixed(1) + ' s');
