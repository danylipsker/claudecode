/* The Puzzle Cabinet · tools/gen/cryptarithm.js
 *
 *   node tools/gen/cryptarithm.js        writes data/alphametics.js
 *
 * The classics first (in our own words), then "doubly true" sums of number
 * words, sums from themed word lists (every pair and total in a theme is
 * tried and only sums with exactly one answer are kept), differences, long
 * multiplications in letters (the key word spells the digits 0-9) and
 * skeleton multiplications in stars. Every puzzle is graded by the reasoner
 * in js/lib/alphametic.js and ordered easiest first.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/alphametic.js'));
require(path.join(ROOT, 'engines/cryptarithm.js'));
const A = C.Alpha;
const t0 = Date.now();

function solveOne(op, rows, extra) {
  const d = Object.assign({ op, rows }, extra || {});
  const P = A.build(d);
  if (P.nL > 10) return null;
  const r = A.count(P, { limit: 2, nodeLimit: 5e6 });
  if (r.n !== 1) return null;
  d.sol = A.rowsWith(P, r.first.L, r.first.S);
  return d;
}
function gradeOf(d) { return A.grade(A.build(d)); }
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const STD = 'Each letter stands for a different digit, and no number begins with 0.';

/* ---------- the classics ---------- */

const classics = [
  { rows: 'TO GO OUT', title: 'To Go Out', text: 'A first taste, three short words. ' + STD + ' What are TO, GO and OUT?',
    hints: ['Two two-digit numbers make less than 200, so the O at the front of OUT is 1.', 'O is 1, so in the units column O + O = 2 ends in T.'], tags: ['starter'] },
  { rows: 'I BB ILL', title: 'I and Two Bees', text: STD + ' A single digit and a two-digit number make a three-digit total — there is not much room to hide.',
    hints: ['A three-digit total from so little: the numbers must be as big as they can be.', 'BB is 99 and I is 1.'], tags: ['starter'] },
  { rows: 'SO SO TOO', title: 'So So', text: STD + ' Twice SO is TOO.', hints: ['T must be 1: twice a two-digit number is less than 200.', 'O + O ends in O: which digits do that?'], tags: ['starter'] },
  { rows: 'I DID TOO', title: 'I Did Too', text: STD + ' A one-, a three- and a three-digit number.', hints: ['DID plus a single digit reaches the next hundred: TOO must be D + 1 hundred.', 'For the carry to go all the way up, ID must be 99.'], tags: ['starter'] },
  { rows: 'EGG EGG PAGE', title: 'An Egg and an Egg', text: 'Two eggs make a page. ' + STD, hints: ['P is 1.', 'G + G ends in E, and G + G + carry ends in G.'], tags: ['starter', 'food'] },
  { rows: 'HE SEES THE LIGHT', title: 'He Sees the Light', text: STD + ' A little sentence that is also a sum.', hints: ['The total has four digits, the longest term four: L is 1.', 'SEES is nearly all of it: S must be 9.'] },
  { rows: 'EAT THAT APPLE', title: 'Eat That Apple', text: STD + ' The biggest number here has only four digits, but the total has five.', hints: ['A is 1 and P is 0: THAT must be in the nine thousands.', 'T is 9; now look at the units: T + T ends in E.'], tags: ['food'] },
  { rows: 'UN UN NEUF ONZE', title: 'Un, Un, Neuf', text: 'A French sum, true in words as well: *un + un + neuf = onze* (1 + 1 + 9 = 11). ' + STD,
    hints: ['NEUF has four digits and so does ONZE: the carry into the thousands is 0 or 1.', 'In the units column N + N + F ends in E; in the tens, U + U + E (+ carry) ends in Z.'], tags: ['doubly-true', 'french'] },
  { rows: 'NO GUN NO HUNT', title: 'No Gun, No Hunt', text: STD + ' A sensible sentence and a sensible sum.', hints: ['H is 1.', 'U must be 0: GUN plus two small numbers only just reaches a thousand.'] },
  { rows: 'COCA COLA OASIS', title: 'Coca Cola', text: 'A sum on a fizzy theme. ' + STD, hints: ['O is 1.', 'A + A ends in S, and C + C ends in A: try small values for S.'] },
  { rows: 'KYOTO OSAKA TOKYO', title: 'Kyoto and Osaka', text: 'Two old cities of Japan add up to its capital. ' + STD, hints: ['No carry out of the top column: K + O is less than 10.', 'Look at the units: O + A ends in O, so A is 0 or there is no such thing — A is 0.'], tags: ['places'] },
  { rows: 'POTATO TOMATO PUMPKIN', title: 'Potato and Tomato', text: 'A harvest sum. ' + STD, hints: ['P is 1.', 'The units and the hundreds columns both add O + O and T + T: compare them.'], tags: ['food'] },
  { rows: 'SEND MORE MONEY', title: 'Send More Money', year: 1924, source: 'Henry Ernest Dudeney, *Strand Magazine*, July 1924.',
    text: 'The most famous letter sum of all: a hard-up student\'s telegram home, in which every letter stands for a different digit (and no number begins with 0). How much money is asked for?',
    hints: ['Two four-digit numbers add up to less than 20 000. What must M be?', 'With M = 1, the thousands column S + 1 (+ carry) must reach at least 10, and O cannot be 1 — so O = 0.', 'In the hundreds, E + 0 + carry = N, so N = E + 1; in the tens N + R (+ carry) ends in E, which makes R = 8.'],
    explain: 'M is a carry, so **M = 1**. Then S + 1 + carry ≥ 10 forces **O = 0** and **S = 9**. The hundreds give N = E + 1 (a carry comes in), and the tens then need R + 1 = 9 with a carry of its own: **R = 8**. That leaves D + E ≥ 12 with the free digits 2–7, which works only for **E = 5, N = 6, D = 7, Y = 2**: 9567 + 1085 = 10652.', tags: ['classic'], links: ['alpha-count-coin-snub'] },
  { op: '-', rows: 'COUNT COIN SNUB', id: 'alpha-count-coin-snub', title: 'Count Your Coins', text: 'A subtraction in letters. ' + STD + ' (When you finish, compare the numbers with a famous telegram.)',
    hints: ['Read it as the addition that checks it: COIN + SNUB = COUNT. Then C = 1.', 'With C = 1, O must be 0.'], explain: 'It is SEND + MORE = MONEY in disguise: 10652 − 1085 = 9567.', tags: ['subtraction'], links: ['alpha-send-more-money'] },
  { rows: 'FORTY TEN TEN SIXTY', title: 'Forty, Ten, Ten', text: 'A "doubly true" sum: it works in words (40 + 10 + 10 = 60) and, with each letter a different digit, in figures too. ' + STD,
    hints: ['Units: Y + N + N ends in Y, so N + N is 0 or 10 — and tens: T + E + E ends in T the same way.', 'N = 0 and E = 5. The hundreds then carry 2 into the thousands, which makes O = 9 and I = 1.'],
    explain: 'The units force **N = 0** and the tens **E = 5** (carrying 1). O + a carry of 2 must pass 10 and leave I, so **O = 9, I = 1**. The rest is a small search: 29786 + 850 + 850 = 31486.', tags: ['doubly-true', 'classic'] },
  { rows: 'LOGIC LOGIC PROLOG', title: 'Logic Doubled', text: 'Twice LOGIC is PROLOG (the name of a programming language made for logic). ' + STD, hints: ['P is 1.', 'Compare the columns: C + C ends in G, I + I (+ carry) ends in O.'] },
  { rows: 'FIFTY STATES AMERICA', title: 'Fifty States', text: STD + ' A patriotic sum.', hints: ['A is 1 and M is 0.', 'S must be 9 so that STATES reaches a million with FIFTY\'s help.'], tags: ['places'] },
  { rows: 'DOUBLE DOUBLE TOIL TROUBLE', title: 'Double, Double', text: 'The witches of *Macbeth* stir their cauldron: *double, double, toil and trouble*. ' + STD,
    hints: ['T is 1.', 'DOUBLE + DOUBLE is nearly all of TROUBLE: compare the last three columns, B L E twice against B L E once.'], tags: ['literature'] },
  { rows: 'HOCUS POCUS PRESTO', title: 'Hocus Pocus', text: 'Say the magic words. ' + STD, hints: ['P is 1.', 'The last three columns add OCUS to itself twice over: CUS + CUS ends in STO.'], tags: ['magic'] },
  { rows: 'CROSS ROADS DANGER', title: 'Crossroads', text: 'A road sign in letters. ' + STD, hints: ['D is 1.', 'Units: S + S ends in R; tens: S + D (+ carry) ends in E. With D = 1 you can pair them up.'], tags: ['classic'] },
  { rows: 'BASE BALL GAMES', title: 'Base and Ball', text: STD + ' A sporting sum.', hints: ['G is 1.', 'B + B + carry ends in A, and A + A ends in M: work down from the top.'] },
  { rows: 'DONALD GERALD ROBERT', title: 'Donald, Gerald and Robert', text: 'A famous test of patience, often printed with the start "D = 5". Here you are given nothing at all. ' + STD,
    hints: ['Units: D + D ends in T. Tens: L + L (+ carry) ends in R, and the hundreds A + A (+ carry) ends in E.', 'Look at the thousands column: O + E ends in O. What does that say about E?', 'E is 9 (with a carry of 1), and then D = 5, T = 0.'],
    explain: 'The thousands column O + E ends in O, so E is 0 or 9; T takes 0 from the units (D + D ends in T), so **E = 9** with a carry. The hundreds make A = 4, and from there **D = 5, T = 0, L = 8, R = 7, G = 1, O = 2, N = 6, B = 3**: 526485 + 197485 = 723970. The puzzle became a favourite of psychologists who study how people think their way through a problem.', tags: ['classic'] },
  { rows: 'SIX SEVEN SEVEN TWENTY', title: 'Six, Seven, Seven', text: 'Another doubly true sum: 6 + 7 + 7 = 20 in words, and in figures too. ' + STD, hints: ['T is 1.', 'Units: X + N + N ends in Y; tens: I + E + E (+ carry) ends in T = 1.'], tags: ['doubly-true'] },
  { rows: 'NINE SEVEN SEVEN SEVEN THIRTY', title: 'Nine and Three Sevens', text: 'Doubly true: 9 + 7 + 7 + 7 = 30. ' + STD, hints: ['T is 1: three five-digit numbers and a four-digit one stay under 400 000, and the front digit must be a carry.'], tags: ['doubly-true'] },
  { rows: 'THREE THREE TWO TWO ONE ELEVEN', title: 'Three, Three, Two, Two, One', text: 'Doubly true: 3 + 3 + 2 + 2 + 1 = 11. ' + STD, hints: ['E is 1.', 'Units: E + E + O + O + E ends in N — with E = 1 that is 3 + 2 × O.'], tags: ['doubly-true'] },
  { rows: 'MARS VENUS URANUS SATURN NEPTUNE', title: 'Four Planets Make a Fifth', text: 'An astronomical sum. ' + STD, hints: ['N is 1.', 'Units: S + S + S + N ends in E.'], tags: ['space'] },
  { rows: 'EARTH AIR FIRE WATER NATURE', title: 'The Four Elements', text: 'Earth, air, fire and water — the old elements add up to nature. ' + STD, hints: ['N is 1.', 'The units column R + R + E + R ends in E: so three Rs make a round 10 or 20.'], tags: ['nature'] },
  { rows: 'APPLE LEMON BANANA', title: 'Fruit Salad', text: 'A sum from the fruit bowl. ' + STD, hints: ['B is 1.', 'A appears in both of the words being added and three times in the total: follow it column by column.'], tags: ['food'] },
  { rows: 'BLACK GREEN ORANGE', title: 'Mixing Colours', text: 'A painter\'s sum. ' + STD, hints: ['O is 1.', 'Look at the hundreds: A + E (+ carry) ends in A.'], tags: ['colour'] },
  { rows: 'ELEVEN NINE FIVE FIVE THIRTY', title: 'Eleven, Nine, Five, Five', text: 'Doubly true: 11 + 9 + 5 + 5 = 30. ' + STD, hints: ['Units: N + E + E + E ends in Y.', 'Tens: E + N + V + V (+ carry) ends in T.'], tags: ['doubly-true'] },
  { rows: 'SATURN URANUS NEPTUNE PLUTO PLANETS', title: 'The Outer Planets', text: 'The planets beyond Jupiter (Pluto included, as it was when this puzzle became famous) add up to the planets. ' + STD,
    hints: ['NEPTUNE is the only seven-digit number: P must be NEPTUNE\'s N plus a carry.', 'Units: N + S + E + O ends in S — so N + E + O is a round 10 or 20.'], tags: ['space', 'classic'] }
];

/* the prime-digit multiplication */
const primeStars = {
  id: 'alpha-prime-digits', title: 'Prime Digits Only',
  text: 'A long multiplication in which **every** digit — in the numbers multiplied, in both partial products and in the answer — is a prime: 2, 3, 5 or 7. Stars may repeat digits. Put the digits back.',
  data: { op: '*', rows: ['***', '**', '****', '****', '*****'], digits: '2357' },
  hints: ['Only four digits are allowed anywhere. The last digit of each partial product is the last digit of the top number times a digit of the multiplier.', 'The top number ends in 5: 5 × a prime digit ends in 5 (or 0 — not allowed).', 'Both digits of the multiplier are the same.'],
  explain: '775 × 33: each partial product is 775 × 3 = 2325, and the total is 25 575. It is the only way, and a pleasing one to check by hand: the digit 5 at the end is forced first, then the rest falls into place column by column.',
  tags: ['stars', 'multiplication', 'primes'], concepts: ['alphametic', 'deduction']
};

/* the key words behind the letter multiplications, with a title that hints at each */
const KEYCLUE = {
  BLACKSMITH: 'At the Forge', PATHFINDER: 'Finding the Way', LUMBERJACK: 'In the Forest', DUMBWAITER: 'Below Stairs', TRAMPOLINE: 'Boing!',
  BIRTHPLACE: 'Where It All Began', CLOTHESPIN: 'Washing Day', COMPLAINTS: 'The Grumble Book', FLAMINGOES: 'Pink Visitors', HYDRAULICS: 'Water Power',
  MOTHERLAND: 'Home Soil', NIGHTMARES: 'Bad Dreams', PLAYGROUND: 'Swings and Slides', REPUBLICAN: 'No King Here', BANKRUPTCY: 'Out of Pocket',
  PRODUCTIVE: 'A Busy Day', CAMPGROUND: 'Under Canvas', COPYRIGHTS: 'All Rights Reserved', BLOCKHEADS: 'Wooden Heads', FORMULATED: 'Worked Out',
  GUNPOWDERS: 'Bang!', SPORTINGLY: 'Fair Play'
};

/* ---------- building the list ---------- */

const out = [];
const used = new Set();
function add(p) {
  if (used.has(p.id)) throw new Error('duplicate id ' + p.id);
  used.add(p.id);
  out.push(p);
}

classics.forEach((c) => {
  const op = c.op || '+';
  const rows = c.rows.split(' ');
  const d = solveOne(op, rows);
  if (!d) throw new Error('classic not unique: ' + c.rows);
  const g = gradeOf(d);
  const id = c.id || 'alpha-' + slug(rows.join(' '));
  const p = { id, title: c.title, diff: g.level };
  if (c.year) p.year = c.year;
  if (c.source) p.source = c.source;
  p.text = c.text;
  if (c.hints) p.hints = c.hints;
  if (c.explain) p.explain = c.explain;
  if (c.links) p.links = c.links;
  p.concepts = ['alphametic'];
  p.tags = (c.tags || []).concat(['classic']).filter((t, i, a) => a.indexOf(t) === i);
  p.data = d;
  p._score = g.score;
  add(p);
});
{
  const d = Object.assign({}, primeStars.data);
  const r = A.count(A.build(d), { limit: 2 });
  if (r.n !== 1) throw new Error('prime stars not unique');
  d.sol = A.rowsWith(A.build(d), r.first.L, r.first.S);
  const g = gradeOf(d);
  add(Object.assign({}, primeStars, { diff: Math.max(3, g.level), data: d, _score: g.score }));
}
const classicRows = new Set(out.map((p) => p.data.rows.join(' ')));
console.log('classics', out.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* doubly true: number words that add up in words and in figures */
const nums = [];
for (let n = 1; n <= 100; n++) if (A.numberWord(n)) nums.push(n);
const doubly = [];
const tryDoubly = (terms) => {
  const s = terms.reduce((a, b) => a + b, 0), w = A.numberWord(s);
  if (!w) return;
  const rows = terms.slice().sort((a, b) => b - a).map(A.numberWord).concat([w]);
  if (classicRows.has(rows.join(' '))) return;
  const L = Math.max.apply(null, rows.slice(0, -1).map((x) => x.length));
  if (w.length < L) return;
  const P = A.build({ op: '+', rows });
  if (P.nL > 10) return;
  const r = A.count(P, { limit: 5, nodeLimit: 2e6 });
  if (!r.n) return;
  const d = { op: '+', rows, sol: A.rowsWith(P, r.first.L, r.first.S) };
  if (r.n > 1) {
    if (r.n > 4 || terms.length > 3) return;
    const g = A.addGivens(d, C.rng(C.hash(rows.join(''))), 0);
    if (!g) return;
    d.given = g;
    const c1 = A.count(A.build(d), { limit: 2 });
    if (c1.n !== 1) return;
    d.sol = A.rowsWith(A.build(d), c1.first.L, c1.first.S);
  }
  doubly.push({ d, terms, s });
};
for (let i = 0; i < nums.length; i++) for (let j = i; j < nums.length; j++) {
  tryDoubly([nums[i], nums[j]]);
  for (let k = j; k < nums.length; k++) {
    tryDoubly([nums[i], nums[j], nums[k]]);
    for (let l = k; l < nums.length; l++) {
      tryDoubly([nums[i], nums[j], nums[k], nums[l]]);
      for (let m = l; m < nums.length && nums[i] + nums[j] + nums[k] + nums[l] + nums[m] <= 100; m++) tryDoubly([nums[i], nums[j], nums[k], nums[l], nums[m]]);
    }
  }
}
// keep the short ones, and only a few of the long five-term chains (they get samey)
doubly.forEach((x) => { x.g = gradeOf(x.d); });
doubly.sort((a, b) => a.terms.length - b.terms.length || a.g.score - b.g.score);
const pickDoubly = [];
const nTerms = {};
doubly.forEach((x) => {
  const k = x.terms.length, cap = { 2: 9, 3: 8, 4: 5, 5: 2 }[k] || 0;
  if ((nTerms[k] || 0) >= cap) return;
  nTerms[k] = (nTerms[k] || 0) + 1;
  pickDoubly.push(x);
});
pickDoubly.forEach((x) => {
  const d = x.d, g = x.g;
  const rows = d.rows;
  const words = rows.slice(0, -1).map((w) => w.toLowerCase());
  const nG = d.given ? d.given.length : 0;
  add({
    id: 'alpha-' + slug(rows.join(' ')), title: rows.slice(0, -1).map((w) => w.charAt(0) + w.slice(1).toLowerCase()).join(' + ') + ' = ' + rows[rows.length - 1].charAt(0) + rows[rows.length - 1].slice(1).toLowerCase(),
    diff: g.level,
    text: 'Doubly true: ' + words.join(' + ') + ' = ' + rows[rows.length - 1].toLowerCase() + ' (' + x.terms.slice().sort((a, b) => b - a).join(' + ') + ' = ' + x.s + ') in words, and — with each letter a different digit — in figures too. No number begins with 0.' +
      (nG ? ' ' + (nG === 1 ? 'One letter is' : ['', '', 'Two', 'Three', 'Four'][nG] + ' letters are') + ' given, because without ' + (nG === 1 ? 'it' : 'them') + ' there would be more than one answer.' : ''),
    concepts: ['alphametic'], tags: ['doubly-true', 'numbers'], data: d, _score: g.score
  });
});
console.log('doubly true', pickDoubly.length, 'of', doubly.length, JSON.stringify(nTerms), ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* themed sums: every pair of words in a theme with a total from the same theme */
const themed = [];
for (const th of Object.keys(A.THEMES)) {
  const ws = A.themeWords[th];
  for (let i = 0; i < ws.length; i++) for (let j = i; j < ws.length; j++) {
    const terms = [ws[i], ws[j]];
    if (A.letterSet(terms).size > 10) continue;
    const L = Math.max(ws[i].length, ws[j].length);
    for (const res of ws) {
      if (res === ws[i] || res === ws[j] || (res.length !== L && res.length !== L + 1)) continue;
      const rows = [ws[i], ws[j], res];
      if (classicRows.has(rows.join(' '))) continue;
      const P = A.build({ op: '+', rows });
      if (P.nL > 10) continue;
      const r = A.count(P, { limit: 5 });
      if (!r.n) continue;
      themed.push({ th, rows, n: r.n, sol: A.rowsWith(P, r.first.L, r.first.S), twin: i === j });
    }
  }
}
console.log('themed candidates', themed.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

// three terms: a seeded sample in each theme
const rng3 = C.rng(1955);
for (const th of Object.keys(A.THEMES)) {
  const ws = A.themeWords[th].filter((w) => w.length <= 6);
  for (let k = 0; k < 2500; k++) {
    const terms = [rng3.pick(ws), rng3.pick(ws), rng3.pick(ws)].sort((a, b) => b.length - a.length || (a < b ? -1 : 1));
    if (new Set(terms).size < 2 || A.letterSet(terms).size > 10) continue;
    const L = terms[0].length;
    const res = rng3.pick(ws.filter((w) => (w.length === L || w.length === L + 1) && terms.indexOf(w) < 0) || []);
    if (!res) continue;
    const rows = terms.concat([res]);
    const P = A.build({ op: '+', rows });
    if (P.nL > 10) continue;
    const r = A.count(P, { limit: 2 });
    if (r.n !== 1) continue;
    if (themed.some((x) => x.rows.join(' ') === rows.join(' '))) continue;
    themed.push({ th, rows, n: 1, sol: A.rowsWith(P, r.first.L, r.first.S), three: true });
  }
}
console.log('with triples', themed.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

// grade the unique ones (and a few with two to four answers, made unique with given letters)
const rngG = C.rng(1924);
const pool = [];
themed.forEach((x) => {
  let d = { op: '+', rows: x.rows, sol: x.sol };
  if (x.n > 1) {
    if (x.n > 3 || rngG() > 0.12) return;
    const g = A.addGivens(d, rngG, 0);
    if (!g) return;
    d.given = g;
    const c1 = A.count(A.build(d), { limit: 2 });
    if (c1.n !== 1) return;
    d.sol = A.rowsWith(A.build(d), c1.first.L, c1.first.S);
  }
  const g = A.grade(A.build(d), { fast: true });
  pool.push({ x, d, g });
});
console.log('graded pool', pool.length, ((Date.now() - t0) / 1000).toFixed(1) + ' s');

// choose: a spread of levels, many themes, few repeated words
const want = { 1: 13, 2: 16, 3: 17, 4: 16, 5: 11 };
const wantSub = { 1: 2, 2: 3, 3: 3, 4: 3, 5: 2 };
const wordUse = {};
const themeUse = {};
const rngP = C.rng(2024);
const byLevel = {};
pool.forEach((q) => { (byLevel[q.g.level] = byLevel[q.g.level] || []).push(q); });
for (let lv = 1; lv <= 5; lv++) {
  const cand = rngP.shuffle((byLevel[lv] || []).slice().sort((a, b) => (a.x.rows.join() < b.x.rows.join() ? -1 : 1)));
  // prefer different words, three-term sums now and then, and not too many "X + X"
  cand.sort((a, b) => (a.x.twin ? 1 : 0) - (b.x.twin ? 1 : 0));
  let got = 0, twins = 0, subs = 0, triples = 0;
  const need = want[lv] + wantSub[lv];
  for (const q of cand) {
    if (got >= need) break;
    const rows = q.x.rows;
    if (rows.some((w) => (wordUse[w] || 0) >= 2)) continue;
    if ((themeUse[q.x.th] || 0) >= 6) continue;
    if (q.x.twin && twins >= Math.ceil(need / 4)) continue;
    if (q.x.three && triples >= 3) continue;
    const asSub = subs < wantSub[lv] && !q.x.three && !q.d.given && got % 3 === 1;
    const d = asSub ? C.cryptAsDifference(q.d) : q.d;
    const id = 'alpha-' + slug(d.rows.join(' '));
    if (used.has(id)) continue;
    // stored puzzles: reasoning alone must finish them, so every hint has a reason
    const full = A.grade(A.build(d));
    if (!full.solved) continue;
    rows.forEach((w) => { wordUse[w] = (wordUse[w] || 0) + 1; });
    themeUse[q.x.th] = (themeUse[q.x.th] || 0) + 1;
    if (q.x.twin) twins++;
    if (q.x.three) triples++;
    if (asSub) subs++;
    const w = C.cryptWords(d, asSub ? 'sub' : 'sum', q.x.th);
    add({ id, title: w.title, diff: full.level, text: w.text, concepts: ['alphametic'], tags: w.tags.concat([q.x.th]), data: d, _score: full.score });
    got++;
  }
  console.log('level', lv, 'themed', got, '(differences ' + subs + ', triples ' + triples + ')');
}

/* long multiplications in letters, and in stars */
const keyUsed = new Set();
for (let lv = 1; lv <= 5; lv++) {
  let made = 0;
  for (let s = 0; s < 400 && made < 2; s++) {
    const x = A.makeMul(C.rng(7000 + lv * 100 + s), lv, { stars: false, needKey: true, loose: lv >= 4, budget: 4000 });
    if (!x || !x.d.key || keyUsed.has(x.d.key)) continue;
    keyUsed.add(x.d.key);
    const d = x.d;
    add({
      id: 'alpha-key-' + d.key.toLowerCase(), title: KEYCLUE[d.key] || d.key, diff: x.grade.level,
      text: 'A multiplication written in letters: each letter is a different digit, and no number begins with 0.' + (d.given ? ' ' + (d.given.length === 1 ? 'One letter is' : C.plural(d.given.length, 'letter').replace(/^\d+/, (m) => ['', 'One', 'Two', 'Three', 'Four'][+m] || m) + ' are') + ' given.' : '') +
        ' When you have them all, read the letters in order from 0 to 9: they spell a word — and the title is a clue to it.',
      concepts: ['alphametic', 'deduction'], tags: ['multiplication', 'letters', 'key word'], data: d, _score: x.grade.score
    });
    made++;
  }
}
let starN = 0;
for (let lv = 1; lv <= 5; lv++) {
  let made = 0;
  for (let s = 0; s < 400 && made < 2; s++) {
    const x = A.makeMul(C.rng(9000 + lv * 100 + s), lv, { stars: true, budget: 6000 });
    if (!x) continue;
    starN++;
    const w = C.cryptWords(x.d, 'mul');
    add({ id: 'alpha-stars-' + String(starN).padStart(2, '0'), title: w.title.replace('Hidden digits', 'Hidden digits no. ' + starN), diff: x.grade.level, text: w.text,
      concepts: ['alphametic', 'deduction'], tags: w.tags, data: x.d, _score: x.grade.score });
    made++;
  }
}
console.log('multiplications done', ((Date.now() - t0) / 1000).toFixed(1) + ' s');

/* easiest first; within a level, by the grader's score */
out.sort((a, b) => a.diff - b.diff || a._score - b._score);
const titles = new Set();
out.forEach((p) => {
  if (titles.has(p.title)) p.title += ' (' + p.id.slice(-2) + ')';
  titles.add(p.title);
  delete p._score;
});

const meta = {
  id: 'alphametics', engine: 'cryptarithm', cat: 'numbers', name: 'Alphametics', order: 1,
  blurb: 'Letter sums in which every letter hides a different digit — SEND + MORE = MONEY and its many cousins — with long multiplications in letters and in stars.',
  origin: { year: 1924, who: 'Henry Ernest Dudeney', note: 'Dudeney\'s SEND + MORE = MONEY appeared in the *Strand Magazine* in July 1924 and is still the most famous letter sum. The word *alphametic* was coined by J. A. H. Hunter in 1955.' },
  concepts: ['alphametic', 'deduction']
};

const lines = ['/* The Puzzle Cabinet · data/alphametics.js — made by tools/gen/cryptarithm.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 2) + ', ['];
out.forEach((p, i) => {
  const keys = Object.keys(p).filter((k) => k !== 'data');
  const head = keys.map((k) => JSON.stringify(k) + ':' + JSON.stringify(p[k])).join(',');
  lines.push('  {' + head + ',"data":' + JSON.stringify(p.data) + '}' + (i < out.length - 1 ? ',' : ''));
});
lines.push(']);', '');
fs.writeFileSync(path.join(ROOT, 'data/alphametics.js'), lines.join('\n'));
const spread = [0, 0, 0, 0, 0, 0];
out.forEach((p) => spread[p.diff]++);
console.log('wrote data/alphametics.js:', out.length, 'puzzles; by level', spread.slice(1).join(' / '), ((Date.now() - t0) / 1000).toFixed(1) + ' s');
