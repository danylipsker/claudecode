/* The Puzzle Cabinet · tools/gen/hop.js
 *
 *   node tools/gen/hop.js      writes data/frogs-toads.js and data/coin-pairs.js
 *
 * Every puzzle is solved here by breadth-first search (engines/hop.js): the
 * shortest solution is stored and its length is the par.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/hop.js'));
const H = C.hopLogic, E = C.engines.hop;
const SHOW = process.argv.includes('--show');

const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen'];
const Num = (n) => NUM[n].charAt(0).toUpperCase() + NUM[n].slice(1);
const pretty = (s) => s.replace(/_/g, '·');
const problems = [];

function finish(p) {
  const path = H.solve(p.data, null, 3e6);
  if (!path) { problems.push(p.id + ': ' + (path === null ? 'no solution' : 'search too big')); return null; }
  p.par = path.length;
  p.data.sol = [].concat.apply([], path.map((m) => [m.from, m.to]));
  if (SHOW) console.log(p.id.padEnd(22), 'par', String(p.par).padStart(2), ' ', path.map((m) => m.s).join(' '));
  return p;
}
function write(file, meta, list, history) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/hop.js */');
  lines.push('Cabinet.family(' + JSON.stringify(meta) + ', [');
  list.forEach((p, i) => {
    const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'hints', 'explain', 'links', 'concepts', 'tags', 'par', 'data'].filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < list.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  if (history) lines.push('Cabinet.history(' + JSON.stringify(history) + ');');
  fs.writeFileSync(path.join(ROOT, file), lines.join('\n') + '\n');
}
function check(list) { list.forEach((p) => { const v = E.verify(p); if (!v.ok) problems.push(p.id + ': ' + v.err); }); }

/* ================= frogs and toads ================= */
const FT = [];
const gradeF = (par, variant) => { let g = par <= 8 ? 1 : par <= 15 ? 2 : par <= 24 ? 3 : par <= 35 ? 4 : 5; if (variant && par > 5) g = Math.min(5, g + 1); return g; };
function frogsText(n, m, gaps, jump) {
  const who = Num(n) + ' frog' + (n > 1 ? 's' : '') + ' on the left, facing right, and ' + NUM[m] + ' toad' + (m > 1 ? 's' : '') + ' on the right, facing left';
  const pads = gaps === 1 ? 'one empty lily pad between them' : NUM[gaps] + ' empty lily pads between them';
  return who + ', with ' + pads + '. ' + (jump > 1 ? 'These are leapers: a jump may clear one counter **or two**. ' : '') + 'Swap them over — frogs to the right, toads to the left.';
}
function countExplain(n, m) {
  return 'Every frog has to get past every toad, and two counters can only pass by one jumping the other: that is ' + n + ' × ' + m + ' = ' + (n * m) + ' jumps. Each frog travels ' + (m + 1) + ' pads and each toad ' + (n + 1) + ', ' + (n * (m + 1) + m * (n + 1)) + ' pads in all; the jumps cover ' + (2 * n * m) + ' of them, so ' + (n + m) + ' single hops make up the rest. ' + (n * m) + ' + ' + (n + m) + ' = ' + (n * m + n + m) + ' moves, and no fewer will do.';
}
// one empty pad in the middle
for (let n = 1; n <= 5; n++) for (let m = n; m <= 5; m++) {
  FT.push({ id: 'frogs-' + n + '-' + m, title: Num(n) + ' Frog' + (n > 1 ? 's' : '') + ', ' + Num(m) + ' Toad' + (m > 1 ? 's' : ''), data: { kind: 'frogs', row: 'F'.repeat(n) + '_' + 'T'.repeat(m) }, n, m, gaps: 1, jump: 1 });
}
FT.push({ id: 'frogs-6-6', title: 'Six Frogs, Six Toads', data: { kind: 'frogs', row: 'FFFFFF_TTTTTT' }, n: 6, m: 6, gaps: 1, jump: 1 });
[[1, 1], [2, 2], [2, 3], [3, 3], [3, 4], [4, 4]].forEach(([n, m]) => FT.push({ id: 'frogs-2gap-' + n + '-' + m, title: Num(n) + ' and ' + Num(m) + ', Two Empty Pads', data: { kind: 'frogs', row: 'F'.repeat(n) + '__' + 'T'.repeat(m) }, n, m, gaps: 2, jump: 1 }));
[[2, 2], [3, 3]].forEach(([n, m]) => FT.push({ id: 'frogs-3gap-' + n + '-' + m, title: Num(n) + ' and ' + Num(m) + ', Three Empty Pads', data: { kind: 'frogs', row: 'F'.repeat(n) + '___' + 'T'.repeat(m) }, n, m, gaps: 3, jump: 1 }));
[[2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5]].forEach(([n, m]) => FT.push({ id: 'frogs-leap-' + n + '-' + m, title: 'Leapfrog: ' + Num(n) + ' and ' + Num(m), data: { kind: 'frogs', row: 'F'.repeat(n) + '_' + 'T'.repeat(m), jump: 2 }, n, m, gaps: 1, jump: 2 }));
[[3, 3], [4, 4]].forEach(([n, m]) => FT.push({ id: 'frogs-leap2gap-' + n + '-' + m, title: 'Leapfrog: ' + Num(n) + ' and ' + Num(m) + ', Two Empty Pads', data: { kind: 'frogs', row: 'F'.repeat(n) + '__' + 'T'.repeat(m), jump: 2 }, n, m, gaps: 2, jump: 2 }));
const ODD = [
  ['F_FTT', 'No Pad in the Middle', 'The empty pad is between the two frogs, and the leading frog is already nose to nose with the toads.'],
  ['FF_T_T', 'A Gap Among the Toads', 'One empty pad in the middle and one between the two toads.'],
  ['F_F_TT', 'A Gap Among the Frogs', 'One empty pad in the middle and one between the two frogs.'],
  ['F_FT_T', 'Gaps in the Ranks', 'The two empty pads are inside the groups, one among the frogs and one among the toads; the middle frog and toad are nose to nose.'],
  ['F_F_T_T', 'Everyone Apart', 'Every counter has an empty pad beside it.'],
  ['FF_TT_T', 'The Toad Who Hangs Back', 'The last toad sits one pad apart from the others.'],
  ['F_FFT_TT', 'A Frog Held Back', 'The last frog waits one pad behind the others, and the front frog is already face to face with a toad.'],
  ['F_FF_TTT', 'The Frog at the Back', 'Three frogs and three toads, but the last frog sits one pad behind the others.'],
  ['FFF_T_TT', 'A Toad Out in Front', 'Three of each; the leading toad has one empty pad behind it.'],
  ['FF_F_TTT', 'A Frog Out in Front', 'Three of each; the leading frog has one empty pad behind it.']
];
ODD.forEach(([row, title, note], i) => {
  const n = (row.match(/F/g) || []).length, m = (row.match(/T/g) || []).length;
  FT.push({ id: 'frogs-odd-' + (i + 1), title, data: { kind: 'frogs', row }, n, m, odd: note });
});
const frogs = [];
FT.forEach((f) => {
  const p = { id: f.id, title: f.title };
  const variant = f.gaps > 1 || f.jump > 1 || !!f.odd;
  if (f.odd) p.text = Num(f.n) + ' frog' + (f.n > 1 ? 's' : '') + ' and ' + NUM[f.m] + ' toad' + (f.m > 1 ? 's' : '') + ', as usual frogs facing right and toads facing left. ' + f.odd + ' Swap them over, so the row reads the other way round: **' + pretty(f.data.row.split('').reverse().join('')) + '**.';
  else p.text = frogsText(f.n, f.m, f.gaps, f.jump);
  p.data = f.data;
  if (!finish(p)) return;
  p.diff = gradeF(p.par, variant);
  if (!variant) p.explain = countExplain(f.n, f.m);
  else if (f.jump > 1) p.explain = 'Leaps save moves: a jump over two counters does the work of two ordinary jumps. Here the fewest moves is ' + p.par + ' (without leaping it would be ' + (f.gaps === 1 ? f.n * f.m + f.n + f.m : 'more') + ').';
  p.concepts = variant ? ['state-space'] : ['state-space', 'invariant'];
  if (f.id === 'frogs-3-3') {
    p.hints = ['The moves come in runs: some frogs, then some toads, then frogs again.', 'The runs are 1, 2, 3, 3, 3, 2, 1 moves long.', 'Keep frogs and toads alternating in the middle of the pond: two of a kind side by side in the middle usually block each other.'];
    p.tags = ['classic'];
    p.links = ['frogs-2-2', 'frogs-4-4'];
  }
  if (f.id === 'frogs-1-1') p.hints = ['Either may go first — but then someone has to jump.'];
  if (f.id === 'frogs-2-2') p.hints = ['Runs again: one frog, then two toads, then two frogs…'];
  frogs.push(p);
});
frogs.sort((a, b) => a.diff - b.diff || a.par - b.par);
check(frogs);
write('data/frogs-toads.js', {
  id: 'frogs-toads', engine: 'hop', cat: 'coins', name: 'Frogs and toads', order: 3,
  blurb: 'Frogs hop right, toads hop left, nobody goes back: swap them over across the lily pads.',
  origin: { who: 'A traditional puzzle', note: 'Known under many names — frogs and toads, sheep and goats, the jumping counters. With n frogs, m toads and one empty square between them the fewest moves is nm + n + m, which for n of each is (n + 1)² − 1. Elwyn Berlekamp, John Conway and Richard Guy turned it into a two-player game, Toads and Frogs, the first game in their *Winning Ways for Your Mathematical Plays* (1982).' },
  concepts: ['state-space', 'invariant']
}, frogs);

/* ================= coins in pairs ================= */
const grouped = (n) => ['H'.repeat(n) + 'T'.repeat(n), 'T'.repeat(n) + 'H'.repeat(n)];
const alt = (n) => ['HT'.repeat(n), 'TH'.repeat(n)];
function perms(a) { if (a.length <= 1) return [a]; const out = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach((q) => out.push([x].concat(q)))); return out; }
const metals = (n) => perms(['G', 'S', 'C']).map((q) => q.map((c) => c.repeat(n)).join(''));
const CP = [
  { id: 'pairs-piles-8', title: 'Eight Coins, Four Piles', diff: 1, data: { kind: 'piles', n: 8, over: 2 },
    source: 'A traditional parlour puzzle, often done with matches.',
    text: 'Eight coins lie in a row. Make four piles of two. Each move, pick up a single coin and jump it — left or right — over exactly **two** coins, onto the next single coin. Empty places do not count, but a pile counts as two coins.',
    hints: ['Try jumping the fourth coin to the right.', 'Once a pile is made it counts double: it can be the two coins you jump over.'],
    tags: ['classic'] },
  { id: 'pairs-metals-2', title: 'Gold, Silver and Copper', diff: 1, data: { kind: 'pairs', row: '__GSCGSC', k: 2, goal: metals(2) },
    text: 'Two gold, two silver and two copper coins lie in a row — gold, silver, copper, gold, silver, copper — with two empty places at the left end. Move two neighbouring coins at a time, keeping their order, into two empty places side by side, until the golds are together, the silvers together and the coppers together, in one unbroken row.' },
  { id: 'pairs-triples-3', title: 'Three at a Time', diff: 1, data: { kind: 'pairs', row: '___HTHTHT', k: 3, goal: grouped(3) },
    text: 'Six coins alternate heads and tails, with three empty places at the left. Move **three** neighbouring coins at a time, keeping their order, into three empty places side by side. Bring the heads together and the tails together.' },
  { id: 'pairs-3-room', title: 'Three Pairs in Three Moves', diff: 2, data: { kind: 'pairs', row: '____HTHTHT', k: 2, goal: grouped(3) },
    text: 'Six coins alternate: heads, tails, heads, tails, heads, tails, with four empty places to the left. Moving two neighbouring coins at a time (keeping their order) into two empty places, bring all the heads together and all the tails together, in one unbroken row, in three moves.',
    hints: ['The finished row need not be where the coins are now.'] },
  { id: 'pairs-3', title: 'Three Pairs, Little Room', diff: 2, data: { kind: 'pairs', row: '__HTHTHT', k: 2, goal: grouped(3) },
    text: 'The same six coins, but only two empty places at the left. Bring the heads together and the tails together, moving pairs.',
    explain: 'With so little room three pairs need four moves — with four empty places they can be done in three ([[pairs-3-room]]). With four to seven pairs, two empty places are enough to finish in as many moves as there are pairs.',
    links: ['pairs-3-room', 'pairs-tait-4'] },
  { id: 'pairs-mix-3', title: 'Shuffle Them Up', diff: 2, data: { kind: 'pairs', row: '__HHHTTT', k: 2, goal: alt(3) },
    text: 'Now the other way round: three heads together and three tails together, two empty places at the left. Moving pairs, make the coins **alternate** heads and tails in one unbroken row.' },
  { id: 'pairs-hhtt', title: 'Doubles into Singles', diff: 2, data: { kind: 'pairs', row: '__HHTTHHTT', k: 2, goal: alt(4) },
    text: 'Eight coins lie in doubles — two heads, two tails, two heads, two tails — with two empty places at the left. Moving pairs, make them alternate heads and tails, in one unbroken row.' },
  { id: 'pairs-piles-10', title: 'Ten Coins, Five Piles', diff: 2, data: { kind: 'piles', n: 10, over: 2 },
    text: 'Ten coins in a row. Make five piles of two, each move jumping a single coin over exactly two coins onto a single coin.',
    links: ['pairs-piles-8'] },
  { id: 'pairs-tait-4', title: 'Tait\'s Four Pairs', diff: 3, year: 1884, data: { kind: 'pairs', row: '__HTHTHTHT', k: 2, goal: grouped(4) },
    source: 'P. G. Tait, 1884.',
    text: 'Eight coins alternate heads and tails, with two empty places at the left end. A move takes **two neighbouring coins** together, keeping their order, and puts them in two empty places side by side. In **four moves**, bring all the heads together and all the tails together in one unbroken row.',
    hints: ['The finished row ends up two places further left: the empty places move to the right end.', 'Your first move takes a pair from near the right end into the two empty places.', 'Every move must close one gap as it opens another; plan the last move first.'],
    tags: ['classic'], links: ['pairs-3', 'pairs-tait-5'] },
  { id: 'pairs-tait-5', title: 'Five Pairs', diff: 3, data: { kind: 'pairs', row: '__HTHTHTHTHT', k: 2, goal: grouped(5) },
    text: 'Ten coins alternate heads and tails, with two empty places at the left. Moving pairs, bring the heads together and the tails together in five moves.',
    links: ['pairs-tait-4'] },
  { id: 'pairs-mix-4', title: 'Shuffle Four', diff: 3, data: { kind: 'pairs', row: '__HHHHTTTT', k: 2, goal: alt(4) },
    text: 'Four heads together, four tails together, two empty places at the left. Moving pairs, make them alternate.',
    links: ['pairs-mix-3'] },
  { id: 'pairs-piles-12', title: 'Twelve Coins, Six Piles', diff: 3, data: { kind: 'piles', n: 12, over: 2 },
    text: 'Twelve coins in a row. Make six piles of two, each coin jumping over exactly two coins.' },
  { id: 'pairs-piles-12-4', title: 'Jumping Four', diff: 3, data: { kind: 'piles', n: 12, over: 4 },
    text: 'Twelve coins in a row. Make six piles of two — but now each jump must clear exactly **four** coins (a pile counts as two).',
    explain: 'Six moves, one per pile. Jumping over four coins needs a row of at least twelve. For every row of up to eighteen coins the search here tried, jumping over two works from eight coins, over four from twelve and over six from sixteen — while jumping over one, three or five coins never works at all.' },
  { id: 'pairs-triples-4', title: 'Three at a Time, Eight Coins', diff: 3, data: { kind: 'pairs', row: '___HTHTHTHT', k: 3, goal: grouped(4) },
    text: 'Eight coins alternate heads and tails, three empty places at the left. Move three neighbours at a time, in order, into three empty places. Bring the heads together and the tails together.',
    links: ['pairs-triples-3'] },
  { id: 'pairs-metals-3', title: 'Three Metals, Three of Each', diff: 4, data: { kind: 'pairs', row: '__GSCGSCGSC', k: 2, goal: metals(3) },
    text: 'Gold, silver, copper, three times over, with two empty places at the left. Moving pairs, gather each metal together in one unbroken row — in any order of metals.',
    links: ['pairs-metals-2'] },
  { id: 'pairs-tait-6', title: 'Six Pairs', diff: 4, data: { kind: 'pairs', row: '__HTHTHTHTHTHT', k: 2, goal: grouped(6) },
    text: 'Twelve coins alternate heads and tails, with two empty places at the left. Moving pairs, sort them in six moves.' },
  { id: 'pairs-mix-5', title: 'Shuffle Five', diff: 4, data: { kind: 'pairs', row: '__HHHHHTTTTT', k: 2, goal: alt(5) },
    text: 'Five heads together, five tails together, two empty places at the left. Moving pairs, make them alternate.' },
  { id: 'pairs-triples-5', title: 'Three at a Time, Ten Coins', diff: 4, data: { kind: 'pairs', row: '___HTHTHTHTHT', k: 3, goal: grouped(5) },
    text: 'Ten coins alternate heads and tails, three empty places at the left. Moving three neighbours at a time, bring the heads together and the tails together.' },
  { id: 'pairs-metals-triples', title: 'Three Metals, Three at a Time', diff: 4, data: { kind: 'pairs', row: '___GSCGSCGSC', k: 3, goal: metals(3) },
    text: 'Gold, silver, copper, three times over, with three empty places at the left. Moving three neighbours at a time, gather each metal together.' },
  { id: 'pairs-piles-16-4', title: 'Sixteen Coins, Jumping Four', diff: 4, data: { kind: 'piles', n: 16, over: 4 },
    text: 'Sixteen coins in a row. Make eight piles of two, each jump clearing exactly four coins.' },
  { id: 'pairs-tait-7', title: 'Seven Pairs', diff: 5, data: { kind: 'pairs', row: '__HTHTHTHTHTHTHT', k: 2, goal: grouped(7) },
    text: 'Fourteen coins alternate heads and tails, with two empty places at the left. Moving pairs, sort them in seven moves.',
    links: ['pairs-tait-4'] },
  { id: 'pairs-piles-18-6', title: 'Eighteen Coins, Jumping Six', diff: 5, data: { kind: 'piles', n: 18, over: 6 },
    text: 'Eighteen coins in a row. Make nine piles of two; every jump must clear exactly **six** coins.' }
];
const pairs = [];
CP.forEach((c) => {
  const p = Object.assign({}, c);
  if (!p.concepts) p.concepts = ['state-space'];
  if (!finish(p)) return;
  pairs.push(p);
});
// the explanation of the eight coins, from the solution itself
const e8 = pairs.find((p) => p.id === 'pairs-piles-8');
if (e8) {
  const s = e8.data.sol, words = [];
  for (let k = 0; k < s.length; k += 2) words.push('the ' + ord(s[k] + 1) + ' coin onto the ' + ord(s[k + 1] + 1));
  e8.explain = 'Four moves, one for each pile — for example ' + words.join(', ') + ' (counting the coins from the left as they lay at the start). With six coins it cannot be done; with eight, ten, twelve or more it can.';
}
function ord(n) { return n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th'); }
const t4 = pairs.find((p) => p.id === 'pairs-tait-4');
if (t4) {
  const s = t4.data.sol, words = [];
  for (let k = 0; k < s.length; k += 2) words.push('places ' + (s[k] + 1) + '–' + (s[k] + 2) + ' to ' + (s[k + 1] + 1) + '–' + (s[k + 1] + 2));
  t4.explain = 'Number the places 1 to 10 from the left, the coins on 3 to 10. Move the pairs on ' + words.join('; then ') + '. With four, five, six or seven pairs (as far as the search here went) two empty places are enough to sort n pairs in n moves; three pairs need four moves unless there is more room.';
}
pairs.sort((a, b) => a.diff - b.diff || a.par - b.par);
check(pairs);
write('data/coin-pairs.js', {
  id: 'coin-pairs', engine: 'hop', cat: 'coins', name: 'Coins in pairs', order: 4,
  blurb: 'Move coins two by two to sort heads from tails — or jump them into piles of two.',
  origin: { year: 1884, who: 'P. G. Tait', note: 'The Scottish physicist Peter Guthrie Tait set the puzzle of sorting a row of alternating coins by moving two neighbours at a time in 1884. Jumping coins into piles of two is an older parlour game, often played with matches.' },
  concepts: ['state-space']
}, pairs, [{ year: 1884, title: 'Tait\'s coin pairs', text: 'The Scottish physicist P. G. Tait sets the puzzle of sorting a row of alternating coins by moving two neighbours at a time, keeping their order.', links: ['coin-pairs', 'pairs-tait-4'] }]);

console.log('frogs-toads: ' + frogs.length + ' puzzles, by difficulty ' + [1, 2, 3, 4, 5].map((k) => frogs.filter((p) => p.diff === k).length).join('/'));
console.log('coin-pairs: ' + pairs.length + ' puzzles, by difficulty ' + [1, 2, 3, 4, 5].map((k) => pairs.filter((p) => p.diff === k).length).join('/'));
if (problems.length) { console.log('PROBLEMS:\n  ' + problems.join('\n  ')); process.exitCode = 1; }
