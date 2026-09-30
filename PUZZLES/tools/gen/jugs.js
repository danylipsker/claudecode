/* The Puzzle Cabinet · tools/gen/jugs.js
 *
 *   node tools/gen/jugs.js        writes data/jugs.js
 *
 * The classic measuring puzzles first, then variants found by search. Every
 * puzzle's par is the fewest moves found by breadth-first search.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/jugs.js'));
const S = C.jugsSolver;

const classics = [
  {
    id: 'jugs-tartaglia', title: 'Tartaglia\'s Wine', diff: 2, year: 1556,
    source: 'Niccolò Tartaglia, *General trattato di numeri et misure* (1556); the same problem is in Bachet (1612).',
    text: 'A friend has an 8-pint jug full of fine wine and wants to share it fairly with you. The only other vessels are a 5-pint and a 3-pint jug, none of them marked. Split the wine into two equal halves.',
    data: { caps: [8, 5, 3], start: [8, 0, 0], goal: { state: [4, 4, 0] }, unit: 'pints' },
    hints: ['You will need to pour back into the 8-pint jug more than once.', 'Keep the 3-pint jug busy: fill it from the 5 and empty it into the 8.'],
    explain: 'The amounts that can appear are all the combinations the three jugs allow; the search through them is short. Seven pours is the least: 8→5, 5→3, 3→8, 5→3, 8→5, 5→3, 3→8. Tartaglia printed the puzzle in 1556; it was already old then.',
    concepts: ['state-space']
  },
  {
    id: 'jugs-die-hard', title: 'Four Gallons at the Fountain', diff: 1,
    text: 'At a fountain you have a 5-gallon and a 3-gallon jug, and a bomb that goes off unless you put *exactly* 4 gallons on the scale. Fill, empty and pour as much as you like.',
    data: { caps: [5, 3], start: [0, 0], goal: { jug: 0, amount: 4 }, tap: true, drain: true, unit: 'gal' },
    hints: ['Filling the 5 and pouring into the 3 leaves 2 in the big jug.', 'Could you get that 2 into the small jug and leave room for exactly 3 more?'],
    explain: 'Fill the 5, pour into the 3 (2 left), empty the 3, pour the 2 in, fill the 5 again, top up the 3 (it takes 1): 4 gallons remain. The puzzle is ancient; a film made it famous in 1995.',
    concepts: ['state-space', 'gcd']
  },
  {
    id: 'jugs-poisson', title: 'Poisson\'s Twelve Pints', diff: 3, year: 1797,
    source: 'Told of the mathematician Siméon Denis Poisson, whose interest in mathematics it is said to have started.',
    text: 'Someone has 12 pints of wine and wants to give away half of it, but has only an 8-pint and a 5-pint vessel. How can 6 pints be put into the 8-pint vessel?',
    data: { caps: [12, 8, 5], start: [12, 0, 0], goal: { state: [null, 6, null] }, unit: 'pints' },
    hints: ['Try working with the 5-pint vessel as a measuring cup.'],
    concepts: ['state-space']
  },
  {
    id: 'jugs-ten-seven-three', title: 'Ten Litres, Two Friends', diff: 3,
    text: 'Share 10 litres of milk equally between two friends using the 10-litre can, a 7-litre can and a 3-litre can.',
    data: { caps: [10, 7, 3], start: [10, 0, 0], goal: { state: [5, 5, 0] }, unit: 'L' },
    concepts: ['state-space']
  },
  {
    id: 'jugs-nine-four', title: 'Six from Nine and Four', diff: 2,
    text: 'With a 9-litre and a 4-litre bucket, a tap and a drain, measure out exactly 6 litres.',
    data: { caps: [9, 4], start: [0, 0], goal: { any: 6 }, tap: true, drain: true, unit: 'L' },
    concepts: ['state-space', 'gcd']
  },
  {
    id: 'jugs-one-from-seven-eleven', title: 'One Litre from Seven and Eleven', diff: 3,
    text: 'With a 7-litre and an 11-litre jug, a tap and a drain, get exactly 1 litre.',
    data: { caps: [11, 7], start: [0, 0], goal: { any: 1 }, tap: true, drain: true, unit: 'L' },
    explain: 'Because 7 and 11 have no common factor, every whole number of litres up to 11 can be measured — the jugs can reach any amount that is a combination 7a + 11b.',
    concepts: ['gcd']
  },
  {
    id: 'jugs-impossible-looking', title: 'Two from Six and Four?', diff: 1,
    text: 'A 6-litre and a 4-litre jug, a tap and a drain. Get exactly 2 litres in one of them.',
    data: { caps: [6, 4], start: [0, 0], goal: { any: 2 }, tap: true, drain: true, unit: 'L' },
    explain: 'Every amount you can make is a multiple of 2, the greatest common divisor of 6 and 4 — so 2 is easy, but 1 or 3 would be impossible.',
    concepts: ['gcd']
  },
  {
    id: 'jugs-balsam', title: 'The Balsam of Three Thieves', diff: 4, year: 1556,
    source: 'Niccolò Tartaglia, *General trattato di numeri et misure* (1556).',
    text: 'Three thieves steal a 24-ounce vase of precious balsam. Running away, they find a shop with three empty vessels of 5, 11 and 13 ounces. How can they share the balsam into three equal parts of 8 ounces?',
    data: { caps: [24, 13, 11, 5], start: [24, 0, 0, 0], goal: { state: [8, 8, 8, 0] }, unit: 'oz', names: ['vase', null, null, null] },
    hints: ['At the end the 5-ounce vessel is empty and the other three hold 8 each.', 'Aim first for 8 in the 13-ounce vessel.'],
    concepts: ['state-space']
  }
];

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
const W = (n) => WORDS[n] || String(n);
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function titleOf(d) {
  const g = d.goal, c = d.caps;
  if (g.state && g.state[0] != null && g.state[0] === g.state[1]) return cap1('halve the ' + W(c[0]));
  const want = g.any != null ? g.any : g.amount;
  if (g.jug != null) return cap1(W(want) + ' in the ' + W(c[g.jug]) + ' (' + c.join('·') + ')');
  return cap1(W(want) + ' from ' + c.map(W).join(', ').replace(/, ([^,]*)$/, ' and $1'));
}

function diffOf(par) { return par <= 4 ? 1 : par <= 6 ? 2 : par <= 9 ? 3 : par <= 13 ? 4 : 5; }

function variants(n) {
  const rng = C.rng(20260930);
  const out = [];
  const seen = new Set(classics.map((c) => JSON.stringify([c.data.caps, c.data.start, c.data.goal])));
  let guard = 0;
  while (out.length < n && guard++ < 200000) {
    const kind = rng.int(3);
    let d;
    if (kind === 0) { // two jugs, tap and drain
      const a = rng.range(3, 13), b = rng.range(2, a - 1);
      const t = rng.range(1, a - 1);
      d = { caps: [a, b], start: [0, 0], goal: { any: t }, tap: true, drain: true };
    } else if (kind === 1) { // three jugs, share or split without tap
      const a = rng.range(6, 16), b = rng.range(3, a - 1), c = rng.range(2, b - 1);
      if (rng() < 0.6 && a % 2 === 0 && b >= a / 2) d = { caps: [a, b, c], start: [a, 0, 0], goal: { state: [a / 2, a / 2, 0] } };
      else d = { caps: [a, b, c], start: [a, 0, 0], goal: { any: rng.range(1, b - 1) } };
    } else { // three jugs with a tap and a drain, a total in two of them
      const a = rng.range(5, 12), b = rng.range(3, a - 1), c = rng.range(2, b - 1);
      d = { caps: [a, b, c], start: [0, 0, 0], goal: { jug: rng.int(3), amount: 0 }, tap: true, drain: true };
      d.goal.amount = rng.range(1, d.caps[d.goal.jug] - 1);
    }
    const key = JSON.stringify([d.caps, d.start, d.goal]);
    if (seen.has(key)) continue;
    const path = S.solve(d);
    if (!path || path.length < 3) continue;
    // keep a spread of difficulty: fewer easy ones
    const par = path.length;
    const want = [0, 14, 30, 34, 26, 16];
    const df = diffOf(par);
    if (out.filter((x) => x.diff === df).length >= want[df]) continue;
    seen.add(key);
    d.unit = rng.pick(['L', 'L', 'L', 'pints', 'gal']);
    out.push({ d, par, diff: df });
  }
  out.sort((x, y) => x.par - y.par);
  return out;
}

const vs = variants(120);
const lines = [];
lines.push('/* The Puzzle Cabinet · data/jugs.js — made by tools/gen/jugs.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'jugs', engine: 'jugs', cat: 'measure', name: 'Water jugs', order: 1,");
lines.push("  blurb: 'Measure an exact amount with jugs that have no marks: pour until one is empty or the other full.',");
lines.push("  origin: { year: 1556, who: 'Niccolò Tartaglia', note: 'Pouring puzzles are in medieval collections; Tartaglia printed the 8-5-3 wine puzzle in 1556 and Bachet solved it in 1612. The mathematics behind them is the greatest common divisor.' },");
lines.push("  concepts: ['state-space', 'gcd']");
lines.push('}, [');
const emit = (p) => {
  const keys = Object.keys(p).filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
classics.forEach((c) => {
  const path = S.solve(c.data);
  if (!path) throw new Error('classic has no solution: ' + c.id);
  emit(Object.assign({}, c, { par: path.length, goal: undefined }));
});
const usedTitles = new Set(classics.map((c) => c.title));
vs.forEach((v, i) => {
  const d = v.d;
  const u = d.unit;
  const capsTxt = d.caps.map((c) => c + (u.length <= 2 ? ' ' + u : ' ' + u)).join(', ');
  let text;
  if (d.tap) text = 'Jugs of ' + capsTxt + ', a tap to fill from and a drain to pour away.';
  else text = 'The ' + d.caps[0] + ' ' + u + ' jug is full; the ' + d.caps.slice(1).map((c) => c + ' ' + u).join(' and the ') + ' jugs are empty. No tap, no drain: only pouring.';
  let title = titleOf(d);
  if (usedTitles.has(title)) title += ' (' + (i + 1) + ')';
  usedTitles.add(title);
  emit({ id: 'jugs-v' + String(i + 1).padStart(3, '0'), title, diff: v.diff, par: v.par, text, data: d });
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/jugs.js'), lines.join('\n') + '\n');
console.log('jugs: ' + classics.length + ' classics + ' + vs.length + ' variants; pars ' + vs[0].par + '..' + vs[vs.length - 1].par);
