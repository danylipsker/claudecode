/* The Puzzle Cabinet · tools/gen/timers.js
 *
 *   node tools/gen/timers.js      writes data/burning-ropes.js and data/hourglasses.js
 *
 * A few classics told by hand, then puzzles from the engine's own maker
 * (engines/timers.js, the same one the Endless drawers use), seeded, each
 * verified and given its par (the fewest actions) by the solver.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/timers.js'));
const E = C.engines.timers, S = C.timersSolver;

function classic(d, extra) {
  const plan = S.solve(d);
  if (!plan) throw new Error('no solution for ' + JSON.stringify(d));
  return Object.assign({ text: S.statement(d), goal: 'Reach a moment exactly ' + S.minutes(d.target) + ' after you started measuring.', par: plan.cost, data: d }, extra);
}

function fill(fid, prefix, classics, plan) {
  const out = [], seen = new Set(), titles = new Set();
  const key = (d) => JSON.stringify([d.ropes, d.glasses, d.target, d.from, !!d.snuff]);
  classics.forEach((p) => { seen.add(key(p.data)); titles.add(p.title); out.push(p); });
  let seed = C.hash(fid) % 100000;
  plan.forEach(([level, count]) => {
    let made = 0;
    for (let guard = 0; made < count && guard < count * 80; guard++) {
      const p = E.generate(C.rng(seed++), level, { id: fid });
      if (!p || seen.has(key(p.data))) continue;
      if (!E.verify(p).ok) continue;
      let t = p.title;
      for (let k = 2; titles.has(t); k++) t = p.title + ' (' + ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][k] + ')';
      p.title = t;
      titles.add(t);
      seen.add(key(p.data));
      out.push(p);
      made++;
    }
    if (made < count) console.warn(fid + ': level ' + level + ' only ' + made + ' of ' + count);
  });
  out.forEach((p, i) => { p._i = i; });
  out.sort((a, b) => a.diff - b.diff || a._i - b._i);
  let num = 0;
  out.forEach((p) => { delete p._i; if (!p.id) p.id = prefix + '-' + String(++num).padStart(3, '0'); const v = E.verify(p); if (!v.ok) throw new Error(p.id + ': ' + v.err); });
  console.log(fid + ': ' + out.length + ' puzzles (' + [1, 2, 3, 4, 5].map((l) => out.filter((p) => p.diff === l).length).join('/') + ')');
  return out;
}

function write(file, meta, list) {
  const order = ['id', 'title', 'diff', 'year', 'source', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags', 'par', 'data'];
  let s = '/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/timers.js */\nCabinet.family(' + JSON.stringify(meta, null, 2).replace(/\n\s*/g, ' ') + ', [\n';
  s += list.map((p) => '  { ' + order.filter((k) => p[k] != null).map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }').join(',\n');
  s += '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), s);
  console.log('  wrote data/' + file + ' (' + Math.round(s.length / 1024) + ' KB)');
}

/* ---------- burning ropes ---------- */

const ropeClassics = [
  classic({ ropes: [60], target: 30, from: 'start', seed: 11 }, {
    id: 'burn-half-hour', title: 'Half an Hour from One Fuse', diff: 1,
    hints: ['Where the fuse burns out does not matter, only when.', 'What if it burns from both ends at once?'],
    explain: 'Light both ends at once. The two flames always meet after exactly half the time, wherever along the rope that happens to be — one flame may have eaten most of it and the other very little.',
    concepts: ['state-space'], tags: ['classic']
  }),
  classic({ ropes: [60, 60], target: 45, from: 'start', seed: 23 }, {
    id: 'burn-forty-five', title: 'The Classic Forty-Five', diff: 2,
    source: 'A favourite of puzzle books and job interviews; nobody seems to know who first struck the match.',
    hints: ['One rope lit at both ends gives you half an hour.', 'Light the second rope at the same time, but at one end only. How much burning is left in it when the first rope has gone?', 'Thirty minutes are left in the second rope at that moment. Light its other end.'],
    explain: 'At the start light both ends of rope A and one end of rope B. When A burns out, 30 minutes have passed and B has 30 minutes of burning left in it, however long the piece looks. Now light B\'s other end: it burns out after 15 more minutes, at 45.',
    concepts: ['state-space'], tags: ['classic']
  }),
  classic({ ropes: [60, 60], target: 15, from: 'any', seed: 31 }, {
    id: 'burn-quarter', title: 'A Quarter of an Hour', diff: 2,
    hints: ['You cannot get a moment 15 minutes after the start — but you may start timing later.', 'The Classic Forty-Five makes a moment at 30 and another at 45.'],
    explain: 'Do the forty-five-minute trick and start timing at 30, when the first rope burns out: from then to 45 is a quarter of an hour.',
    links: ['burn-forty-five'], concepts: ['state-space'], tags: ['classic']
  }),
  classic({ ropes: [60, 60, 60], target: 52.5, from: 'start', seed: 41 }, {
    id: 'burn-fifty-two', title: 'Fifty-Two and a Half', diff: 3,
    hints: ['Three ropes can halve a halving: 30, then 15 more, then 7½ more.', 'Use the moment the first rope burns out (30) to light a second rope at its other end.'],
    concepts: ['state-space'], tags: ['classic']
  })
];
const burning = fill('burning-ropes', 'burn', ropeClassics, [[1, 6], [2, 8], [3, 9], [4, 8], [5, 6]]);
write('burning-ropes.js', {
  id: 'burning-ropes', engine: 'timers', cat: 'ropes', name: 'Burning ropes', order: 4,
  blurb: 'Fuses that burn for an hour — unevenly. Light their ends at the right moments to measure 45 minutes, 15, 22½ …',
  origin: { who: 'A modern classic', note: 'Timing with unevenly burning ropes became a favourite of puzzle books and job interviews in the late twentieth century. The trick is always the same: a rope lit at both ends burns out in half the time it has left, wherever the flames happen to meet.' },
  concepts: ['state-space']
}, burning);

/* ---------- hourglasses ---------- */

const glassClassics = [
  classic({ glasses: [4, 7], target: 9, from: 'start' }, {
    id: 'glass-nine-egg', title: 'The Nine-Minute Egg', diff: 2,
    text: 'An egg must boil for exactly nine minutes, and all you have are two hourglasses: one runs for 4 minutes and one for 7. Both have run down. Turn them at the start, or at the moment one runs out.\n\nTime exactly **9 minutes**, starting now.',
    hints: ['Start both. When the 4 runs out, turn it again.', 'When the 7 runs out (at 7 minutes), the 4 has been running for 3 minutes: 1 minute of sand is left in it.', 'At 8 the 4 runs out; the 7 has 1 minute of sand in its lower bulb. Turn the 7 over.'],
    explain: 'Start both glasses. At 4, turn the 4. At 7, turn the 7. At 8 the 4 runs out, and the 7 has run for just 1 minute since it was turned: turn it over and that minute runs back — out at 9.',
    concepts: ['state-space', 'gcd'], tags: ['classic', 'egg']
  }),
  classic({ glasses: [7, 11], target: 15, from: 'start' }, {
    id: 'glass-fifteen', title: 'Fifteen by the Seven and the Eleven', diff: 2,
    hints: ['Start both glasses. What is in the 7 when the 11 runs out?', 'At 11 the 7 (turned at 7) has 4 minutes of sand at the bottom.'],
    explain: 'Start both. At 7 turn the 7. At 11 turn the 7 again: the 4 minutes that had run through run back, out at 15.',
    concepts: ['state-space', 'gcd'], tags: ['classic']
  }),
  classic({ glasses: [3, 5], target: 1, from: 'any' }, {
    id: 'glass-one-minute', title: 'One Minute, Exactly', diff: 1,
    hints: ['Start both. Something happens at 3 and at 5.', 'Or: when the 3 runs out, the 5 still has 2 minutes. What happens if you turn the 3 at that moment?'],
    concepts: ['state-space', 'gcd'], tags: ['classic']
  }),
  classic({ glasses: [3, 5], target: 7, from: 'start' }, {
    id: 'glass-seven', title: 'Seven by the Three and the Five', diff: 2,
    hints: ['Start both; turn the 3 when it runs out.', 'When the 5 runs out, how much sand has run through the 3 since you turned it?', 'Two minutes have run through: turn the 3 over and they run back.'],
    concepts: ['state-space', 'gcd'], tags: []
  })
];
// (drop a hand-told puzzle the solver finds impossible or trivial)
const okGlass = glassClassics.filter((p) => { const v = E.verify(p); if (!v.ok) console.warn('left out ' + p.id + ': ' + v.err); return v.ok; });
const hourglasses = fill('hourglasses', 'glass', okGlass, [[1, 10], [2, 12], [3, 13], [4, 12], [5, 10]]);
write('hourglasses.js', {
  id: 'hourglasses', engine: 'timers', cat: 'measure', name: 'Hourglasses', order: 3,
  blurb: 'Two sandglasses that measure the wrong times. Turn them at the right moments to time exactly 9 minutes, 15, 13 …',
  origin: { who: 'Puzzle books', note: 'Timing with two sandglasses is a close cousin of the water-jug puzzles: every time you can reach is made of sums and differences of the two sizes, so the greatest common divisor is at work again.' },
  concepts: ['state-space', 'gcd']
}, hourglasses);
