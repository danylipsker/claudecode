/* The Puzzle Cabinet · tools/gen/picsums.js
 *
 *   node tools/gen/picsums.js     writes data/picture-sums.js
 *
 * A handful of hand-made puzzles first (the fruit salad with its traps, the
 * three lines that must all be added, hats, half an apple), then puzzles from
 * the engine's own generator at every level: lines, grids and balance
 * scales. Every puzzle is checked by engines/picsums.js: the values must be
 * whole, unique, and found one step at a time.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/picart.js'));
require(path.join(ROOT, 'engines/picsums.js'));
const P = C.picSums;
const E = C.engines.picsums;

const out = [];
const titles = new Set();
const keys = new Set();
function add(p, keepDiff) {
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  const lv = P.levelOf(p.data);
  if (!keepDiff) p.diff = lv;
  const k = JSON.stringify(p.data);
  if (keys.has(k)) return false;
  if (titles.has(p.title)) throw new Error('duplicate title ' + p.title);
  keys.add(k);
  titles.add(p.title);
  out.push(p);
  return true;
}
const L = (t, r) => ({ t, r });

/* ---------- hand-made ---------- */

add({ id: 'ps-three-apples', title: 'Three Apples', text: 'Each picture stands for a whole number — the same picture, the same number. Find them, then work out the last line.',
  hints: ['The first line has only apples in it.'],
  concepts: ['deduction'], tags: ['fruit', 'first'],
  data: { kind: 'lines', pics: ['apple', 'pear'], sol: [10, 4], lines: [L([0, '+', 0, '+', 0], 30), L([0, '+', 1, '+', 1], 18)], ask: { t: [0, '+', 1] }, ans: 14 } });

add({ id: 'ps-scales-first', title: 'Lemons on the Scales', text: 'Every scale balances. A marble weighs 1. How many marbles balance the last scale?',
  concepts: ['deduction'], tags: ['balance', 'first'],
  data: { kind: 'balance', pics: ['lemon', 'orange'], sol: [3, 5], bal: [{ l: [0], r: [{ u: 3 }] }, { l: [1], r: [0, { u: 2 }] }], ask: { l: [0, 1, 1] }, ans: 13 } });

add({ id: 'ps-little-grid', title: 'The Little Grid', text: 'Each picture stands for a whole number. The numbers beside the rows and under the columns are their totals. Find the number behind every picture.',
  concepts: ['deduction'], tags: ['grid', 'first'],
  data: { kind: 'grid', pics: ['cat', 'dog'], sol: [4, 7], grid: [[0, 0, 0], [0, 1, 1]], rs: [12, 18], cs: [8, 11, 11] } });

add({ id: 'ps-order', title: 'Order, Order!', text: 'Each picture stands for a whole number. Find them, then work out the last line — the way a calculator that knows its manners would.',
  hints: ['Two stars make 12.', 'In the last line, do the multiplication before the addition.'],
  explain: 'Two stars make 12, so ★ = 6. Then a heart and a star make 10: ♥ = 4. A moon and a heart make 11: moon = 7. The last line is 4 + 6 × 7: multiplication first, so 4 + 42 = **46** (not 10 × 7 = 70).',
  concepts: ['deduction'], tags: ['shapes', 'order of operations'],
  data: { kind: 'lines', pics: ['star', 'heart', 'moon'], sol: [6, 4, 7], lines: [L([0, '+', 0], 12), L([1, '+', 0], 10), L([2, '+', 1], 11)], ask: { t: [1, '+', 0, '*', 2] }, ans: 46 } });

add({ id: 'ps-fruit-salad', title: 'Fruit Salad', text: 'Each picture stands for a whole number — the same picture, the same number. Find them, then work out the last line. Look carefully!',
  hints: ['Three apples make 30.', 'Look very closely at the cherries and the bananas in the last line.', 'The last line has a single cherry and a bunch of only two bananas — and a multiplication to do first.'],
  explain: 'Three apples make 30, so an apple is 10. An apple and two bunches make 22: a bunch of three bananas is 6 — so one banana is 2. A bunch minus a pair of cherries is 2: the pair is 4, one cherry 2. The last line has **one** cherry (2) and a bunch of **two** bananas (4), and × comes first: 2 + 10 × 4 = **42**.',
  concepts: ['deduction'], tags: ['fruit', 'trap', 'classic style'],
  data: { kind: 'lines', pics: ['apple', 'banana', 'cherries'], sol: [10, 6, 4], lines: [L([0, '+', 0, '+', 0], 30), L([0, '+', 1, '+', 1], 22), L([1, '-', 2], 2)], ask: { t: [{ k: 2, n: 1 }, '+', 0, '*', { k: 1, n: 2 }] }, ans: 42 } });

add({ id: 'ps-round-triangle', title: 'All Three Together', text: 'Each picture stands for a whole number. No line has only one kind of picture in it. Find them all.',
  hints: ['Every picture appears in exactly two of the lines.', 'Add all three lines: you get twice the sum of the three pictures.'],
  explain: 'Add the three lines: each picture is counted twice, so twice (cupcake + doughnut + lollipop) = 11 + 15 + 14 = 40, and the three together make 20. Take away each line in turn: lollipop = 20 − 11 = 9, cupcake = 20 − 15 = 5, doughnut = 20 − 14 = 6.',
  concepts: ['deduction', 'symmetry'], tags: ['sweets', 'add them all'],
  data: { kind: 'lines', pics: ['cupcake', 'donut', 'lollipop'], sol: [5, 6, 9], lines: [L([0, '+', 1], 11), L([1, '+', 2], 15), L([0, '+', 2], 14)] } });

add({ id: 'ps-half-apple', title: 'Half an Apple', text: 'Each picture stands for a whole number. Find them, then the last line — and count what is really there.',
  hints: ['An apple and a pear make 13; two apples and a pear make 21.', 'The apple in the last line has been cut in half.'],
  explain: 'The second line has one apple more than the first and is 8 more: an apple is 8, so a pear is 5, and two pears and a lemon make 17: the lemon is 7. The last line has **half** an apple: 4 + 7 + 5 = **16**.',
  concepts: ['deduction'], tags: ['fruit', 'trap'],
  data: { kind: 'lines', pics: ['apple', 'pear', 'lemon'], sol: [8, 5, 7], lines: [L([0, '+', 1], 13), L([0, '+', 0, '+', 1], 21), L([1, '+', 1, '+', 2], 17)], ask: { t: [{ k: 0, n: 1 }, '+', 2, '+', 1] }, ans: 16 } });

add({ id: 'ps-hats', title: 'Hats Off', text: 'Each picture stands for a whole number — a hat is a picture too. Find them all, then the last line.',
  hints: ['Two hats make 6.', 'In the last line the frog is wearing the hat: count both.'],
  explain: 'Two hats make 6: a hat is 3. A frog and a hat make 11: the frog is 8. A pig minus a frog is 1: the pig is 9. In the last line the frog wears the hat (8 + 3 = 11), and × comes first: 9 + 11 × 2 = **31**.',
  concepts: ['deduction'], tags: ['animals', 'trap'],
  data: { kind: 'lines', pics: ['hat', 'frog', 'pig'], sol: [3, 8, 9], lines: [L([0, '+', 0], 6), L([1, '+', 0], 11), L([2, '-', 1], 1)], ask: { t: [2, '+', { k: 1, hat: 0 }, '*', { v: 2 }] }, ans: 31 } });

add({ id: 'ps-clover', title: 'Not So Lucky', text: 'Each picture stands for a whole number. Find them, then the last line. Four-leaf clovers are rare — are they all here?',
  hints: ['Two clovers and a mushroom make 20; one clover and a mushroom make 12.', 'The clover in the last line has only three leaves.'],
  explain: 'The two first lines differ by one clover and by 8: a four-leaf clover is 8, so each leaf is 2, and the mushroom is 4. A ladybird and a mushroom make 9: the ladybird is 5. The last clover has three leaves (6): 6 × 5 − 4 = **26**.',
  concepts: ['deduction'], tags: ['garden', 'trap'],
  data: { kind: 'lines', pics: ['clover', 'mushroom', 'ladybird'], sol: [8, 4, 5], lines: [L([0, '+', 0, '+', 1], 20), L([0, '+', 1], 12), L([2, '+', 1], 9)], ask: { t: [{ k: 0, n: 3 }, '*', 2, '-', 1] }, ans: 26 } });

add({ id: 'ps-see-saw', title: 'Two Kinds of Weight', text: 'Every scale balances. A marble weighs 1. Neither of the first two scales tells you any weight directly — but together they do. How many marbles balance the last scale?',
  hints: ['Compare the two scales: what is on one and not the other?'],
  concepts: ['deduction'], tags: ['balance'],
  data: { kind: 'balance', pics: ['owl', 'fish'], sol: [7, 4], bal: [{ l: [0, 1], r: [{ w: 11 }] }, { l: [0, 1, 1], r: [{ w: 15 }] }], ask: { l: [0, 0, 1] }, ans: 18 } });

/* ---------- from the generator ---------- */

const want = { 1: 14, 2: 16, 3: 16, 4: 13, 5: 11 };
const have = {};
out.forEach((p) => { have[p.diff] = (have[p.diff] || 0) + 1; });
const KINDS = ['lines', 'grid', 'lines', 'balance', 'lines', 'grid', 'balance'];
let n = 0;
for (let lv = 1; lv <= 5; lv++) {
  for (let seed = 1; (have[lv] || 0) < want[lv] && seed < 5000; seed++) {
    const kind = KINDS[seed % KINDS.length];
    const d = P.generate(C.rng(52000 + lv * 1000 + seed), lv, kind);
    if (!d) continue;
    let title = P.titleOf(d);
    const base = title;
    for (let k = 2; titles.has(title); k++) title = base + ' ' + ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][k];
    const p = { id: 'ps-' + String(n + 1).padStart(3, '0'), title, diff: lv, text: P.textOf(d), concepts: ['deduction'], tags: [d.kind], data: d };
    if (!add(p)) continue;
    n++;
    have[lv] = (have[lv] || 0) + 1;
  }
}
out.sort((a, b) => a.diff - b.diff);

const meta = {
  id: 'picture-sums', engine: 'picsums', cat: 'numbers', name: 'Picture sums', order: 12,
  blurb: 'Apples, cats and cupcakes stand for numbers. Lines, grids and balance scales give their totals: find every value — and watch for traps in the last line.',
  origin: { who: 'A traditional school puzzle', note: 'Sums with pictures in place of numbers are a staple of children\'s puzzle books and, in their “can you solve it?” form with a trap in the last line, of social media. They are simultaneous equations in disguise: the same elimination that solves them was taught in ancient China and in the algebra books of every age.' },
  concepts: ['deduction']
};

let s = '/* The Puzzle Cabinet · data/picture-sums.js — made by tools/gen/picsums.js */\n';
s += 'Cabinet.family(' + JSON.stringify(meta) + ', [\n';
s += out.map((p) => '  ' + JSON.stringify(p)).join(',\n');
s += '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/picture-sums.js'), s);
const by = {}, kinds = {};
out.forEach((p) => { by[p.diff] = (by[p.diff] || 0) + 1; kinds[p.data.kind] = (kinds[p.data.kind] || 0) + 1; });
console.log('data/picture-sums.js: ' + out.length + ' puzzles', JSON.stringify(by), JSON.stringify(kinds), (s.length / 1024).toFixed(0) + ' KB');
