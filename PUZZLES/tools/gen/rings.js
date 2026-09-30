/* The Puzzle Cabinet · tools/gen/rings.js
 *
 *   node tools/gen/rings.js        writes data/chinese-rings.js
 *
 * The Chinese rings from two rings to the classic nine, putting them back on,
 * the quick-pair rule, Spin-Out, and positions left halfway. Every par is the
 * fewest moves found by breadth-first search (and, for single moves, checked
 * against the Gray code).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/rings.js'));
const R = C.rings;
const eng = C.engines.rings;

const all = (n, v) => Array.from({ length: n }, () => v);
const out = [];
const add = (p) => { out.push(p); return p; };

const grayWhy = (n, par) => 'Write the rings as a binary number, ring ' + n + ' on the left, 1 for a ring on the loop: ' + '1'.repeat(n) + '. The positions of the puzzle follow a [[c:gray-code|Gray code]] — each move changes one digit — so the number of moves is what that Gray code stands for in ordinary [[c:binary|binary]]. To decode it, read from the left with a running digit that starts at 0 and flips at every 1 of the Gray code; the running digits spell the binary number. ' + '1'.repeat(n) + ' becomes ' + par.toString(2) + ' = **' + par + '**.';

add({
  id: 'rings-two', title: 'Two Rings', diff: 1,
  text: 'The Chinese rings — in France the *baguenaudier*, the time-waster — are a row of rings on a wire loop, each ring held by a rod to the bar below. Ring 1, at the far end, slides on and off freely. Ring 2 may move only while ring 1 is on the loop. Take both rings off.',
  data: { n: 2, start: all(2, 1), goal: all(2, 0), rule: 'single', look: 'rings' },
  hints: ['If ring 1 comes off first, ring 2 is stuck. So which one first?'],
  explain: 'Ring 2 first (it may move, since ring 1 is on), then ring 1: two moves. Every larger set of rings is freed by this same rule, applied again and again.',
  concepts: ['recursion']
});
add({
  id: 'rings-three', title: 'Three Rings', diff: 1,
  text: 'Three rings on the loop. Ring 1 always moves freely. Any other ring may go on or off only when the ring just before it is **on** and all the rings before that are **off**. Take all three off.',
  data: { n: 3, start: all(3, 1), goal: all(3, 0), rule: 'single', look: 'rings' },
  hints: ['Ring 3 comes off only when ring 2 is on and ring 1 is off.', 'So: ring 1 off, ring 3 off. Now bring ring 1 back so that ring 2 can leave.'],
  explain: 'Five moves: 1 off, 3 off, 1 on, 2 off, 1 off. Notice that ring 1 had to go back **on** — the rings come off by going backwards now and then. ' + grayWhy(3, 5),
  concepts: ['recursion', 'gray-code'], links: ['rings-two', 'rings-four']
});
add({
  id: 'rings-three-on', title: 'Putting Them Back', diff: 1,
  text: 'Three rings, all off the loop. Put them all back on. The same rule: ring 1 is free; another ring moves only when the ring before it is on and all before that are off.',
  data: { n: 3, start: all(3, 0), goal: all(3, 1), rule: 'single', look: 'rings' },
  hints: ['Putting on is taking off played backwards.'],
  explain: 'Every move can be undone, so putting the rings on is the taking-off solution run backwards: five moves again.',
  concepts: ['gray-code']
});
add({
  id: 'rings-four', title: 'Four Rings', diff: 2,
  text: 'Four rings on the loop. Take them all off in the fewest moves.',
  data: { n: 4, start: all(4, 1), goal: all(4, 0), rule: 'single', look: 'rings' },
  hints: ['At every moment only two moves are possible: ring 1, or the ring just after the first ring that is on. One of them undoes your last move — so there is only ever one sensible move!', 'The only real decision is the first move. With an even number of rings, start with ring 2.'],
  explain: 'Ten moves. The first move decides everything: with an odd number of rings take ring 1 first, with an even number take ring 2. After that, never undo your last move. ' + grayWhy(4, 10),
  concepts: ['gray-code', 'binary'], links: ['rings-three', 'rings-five']
});
add({
  id: 'rings-spin-4', title: 'A Little Spin-Out', diff: 2,
  text: 'Spin-Out is a plastic puzzle of the 1970s: a slider of spinners locked in a case. A spinner turned **across** is locked; turned **upright** it can pass the gate. The rules are the Chinese rings in disguise: spinner 1 (on the right) turns freely; any other spinner turns only when the one to its right is across and all beyond it are upright. Turn all four upright.',
  data: { n: 4, start: all(4, 1), goal: all(4, 0), rule: 'single', look: 'spinout' },
  hints: ['An even number of spinners: turn spinner 2 first.'],
  concepts: ['gray-code'], links: ['rings-four', 'rings-spinout']
});
add({
  id: 'rings-five', title: 'Five Rings', diff: 3,
  text: 'Five rings. Take them all off.',
  data: { n: 5, start: all(5, 1), goal: all(5, 0), rule: 'single', look: 'rings' },
  hints: ['Odd number of rings: begin with ring 1.', 'Then alternate: move ring 1, then make the only other legal move, then ring 1 again …'],
  explain: 'Twenty-one moves. The rhythm of the hint is the whole solution: ring 1 moves on every odd move, and each even move is forced. ' + grayWhy(5, 21),
  concepts: ['gray-code', 'binary']
});
add({
  id: 'rings-five-on', title: 'Five Back On', diff: 3,
  text: 'All five rings are off the loop. Put every one of them back on.',
  data: { n: 5, start: all(5, 0), goal: all(5, 1), rule: 'single', look: 'rings' },
  concepts: ['gray-code']
});
add({
  id: 'rings-quick-5', title: 'The Quick Pair', diff: 3,
  text: 'On many real sets of rings the first two can slide on or off **together**. This puzzle allows it: besides the usual moves, rings 1 and 2 may go on or off as one move when both are on or both are off (use the **1+2** bracket). Take all five rings off in the fewest moves.',
  data: { n: 5, start: all(5, 1), goal: all(5, 0), rule: 'double', look: 'rings' },
  hints: ['The pair move replaces "ring 2, then ring 1" (or "ring 1, then ring 2") by a single move.', 'Begin by taking ring 1 off alone — then ring 3 is free.'],
  explain: 'Sixteen moves instead of twenty-one. With the pair move, n rings take 2ⁿ⁻¹ moves when n is odd and 2ⁿ⁻¹ − 1 when n is even — which is why books that count this way give 256 for nine rings, and books that count single rings give 341.',
  concepts: ['gray-code', 'state-space'], links: ['rings-five', 'rings-nine']
});
add({
  id: 'rings-spin-5', title: 'Spin-Out with Five', diff: 3,
  text: 'Five spinners locked across. Turn them all upright to free the slider.',
  data: { n: 5, start: all(5, 1), goal: all(5, 0), rule: 'single', look: 'spinout' },
  concepts: ['gray-code']
});
add({
  id: 'rings-six', title: 'Six Rings', diff: 4,
  text: 'Six rings: forty-two moves if you never take a wrong turn.',
  data: { n: 6, start: all(6, 1), goal: all(6, 0), rule: 'single', look: 'rings' },
  hints: ['Six is even: the first move is ring 2.'],
  explain: grayWhy(6, 42),
  concepts: ['gray-code', 'binary']
});
add({
  id: 'rings-quick-6', title: 'Six with the Quick Pair', diff: 4,
  text: 'Six rings, and rings 1 and 2 may travel together as one move when both are on or both are off. Take them all off.',
  data: { n: 6, start: all(6, 1), goal: all(6, 0), rule: 'double', look: 'rings' },
  concepts: ['state-space']
});
add({
  id: 'rings-spinout', title: 'Spin-Out', diff: 5,
  text: 'The full Spin-Out: seven spinners locked across in their case. Turn all seven upright so the slider comes free. Eighty-five turns, not one to spare.',
  source: 'Spin-Out, a plastic puzzle of the 1970s; its mathematics is that of the Chinese rings.',
  data: { n: 7, start: all(7, 1), goal: all(7, 0), rule: 'single', look: 'spinout' },
  hints: ['Seven is odd: turn spinner 1 first.', 'Never undo your last turn; at each step only one other turn is possible.'],
  explain: 'Eighty-five turns — the same as seven Chinese rings. ' + grayWhy(7, 85).replace(/rings/g, 'spinners').replace('a ring on the loop', 'a spinner across'),
  concepts: ['gray-code', 'binary']
});
add({
  id: 'rings-seven', title: 'Seven Rings', diff: 5,
  text: 'Seven rings. Take them all off the loop.',
  data: { n: 7, start: all(7, 1), goal: all(7, 0), rule: 'single', look: 'rings' },
  concepts: ['gray-code']
});
add({
  id: 'rings-eight', title: 'Eight Rings', diff: 5,
  text: 'Eight rings — a hundred and seventy moves. Once the rhythm is in your fingers, it goes faster than you think.',
  data: { n: 8, start: all(8, 1), goal: all(8, 0), rule: 'single', look: 'rings' },
  concepts: ['gray-code']
});
add({
  id: 'rings-nine', title: 'The Nine Linked Rings', diff: 5, year: 1550,
  source: 'Gerolamo Cardano described the rings in *De subtilitate* (1550); Louis Gros analysed them in 1872. In China the puzzle is called the nine linked rings.',
  text: 'The classic set has nine rings. Take them all off: 341 moves if you never go the wrong way — an evening\'s patient work in the days before screens.',
  data: { n: 9, start: all(9, 1), goal: all(9, 0), rule: 'single', look: 'rings' },
  hints: ['Nine is odd: ring 1 first.', 'Move ring 1 on every odd move; the even moves are forced.'],
  explain: 'Three hundred and forty-one moves: 111111111 in Gray code is 101010101 in binary. Louis Gros saw in 1872 that the positions of the rings run through the binary numbers in this way — the idea we now call the [[c:gray-code|Gray code]], after Frank Gray, who used it in a patent for electronic counting. For n rings the count is ⌈2ⁿ⁺¹/3⌉ − 1.',
  concepts: ['gray-code', 'binary', 'recursion'], links: ['rings-quick-5']
});

/* ---------- positions left halfway, and patterns ---------- */

const rng = C.rng(15501872);
const plan = [
  ['partial', 2, [7, 12], 2, { n: 5 }, 'rings'], ['pattern', 2, [6, 12], 1, { n: 4 }, 'rings'],
  ['partial', 3, [14, 25], 1, { n: 6 }, 'rings'], ['pattern', 3, [14, 25], 1, { n: 5 }, 'spinout'],
  ['partial', 4, [30, 60], 1, { n: 7 }, 'rings'], ['pattern', 4, [30, 60], 1, { n: 7 }, 'rings'],
  ['partial', 1, [3, 4], 1, { n: 4 }, 'rings'], ['partial', 1, [4, 5], 1, { n: 4 }, 'spinout']
];
const titles = ['Halfway There', 'Left in a Tangle', 'A Pattern of Rings', 'Some On, Some Off', 'Spinners Askew', 'Where Was I?', 'The Middle of the Road', 'Nearly Free', 'A Few Turns Left'];
let ti = 0, serial = 0;
const seen = new Set();
plan.forEach(([kind, level, band, count, opts, look]) => {
  for (let made = 0, guard = 0; made < count && guard < 400; guard++) {
    const d = R.build(kind, rng, level, Object.assign({ band, look }, opts));
    if (!d) continue;
    const key = JSON.stringify(d);
    if (seen.has(key)) continue;
    seen.add(key);
    made++;
    add({
      id: 'rings-' + String(++serial).padStart(3, '0'), title: titles[ti++], text: R.textOf(d, kind), data: d,
      concepts: ['gray-code']
    });
  }
});

out.forEach((p) => {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  p.par = r.par;
  if (!p.diff) p.diff = R.diffOf(p.par);
});
const order = out.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.p.par - b.p.par || a.i - b.i);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/chinese-rings.js — made by tools/gen/rings.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'chinese-rings', engine: 'rings', cat: 'mechanical', name: 'Chinese rings', order: 2,");
lines.push("  blurb: 'Free the rings from the wire loop. Only one ring is ever free — the rest wait on their neighbours, and the way out runs through a Gray code.',");
lines.push("  origin: { year: 1550, who: 'Gerolamo Cardano', note: 'The rings are old in China, where they are called the nine linked rings. Cardano described them in 1550; Louis Gros showed in 1872 that the moves follow the binary numbers, in the order now called a Gray code. Spin-Out (1970s) is the same puzzle in plastic.' },");
lines.push("  concepts: ['gray-code', 'binary', 'recursion']");
lines.push('}, [');
order.forEach(({ p }) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'data', 'hints', 'explain', 'links', 'concepts', 'par'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
});
lines.push(']);');
lines.push('Cabinet.history([');
lines.push("  { year: 1550, title: 'Cardano\\'s rings', text: 'Gerolamo Cardano describes the ring-and-loop puzzle in his book De subtilitate — one of the earliest descriptions of the Chinese rings in print.', links: ['chinese-rings', 'rings-nine'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/chinese-rings.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
out.forEach((p) => byDiff[p.diff]++);
console.log('chinese-rings: ' + out.length + ' puzzles; by difficulty 1-5: ' + byDiff.slice(1).join(' / ') + '; pars ' + Math.min(...out.map((p) => p.par)) + '..' + Math.max(...out.map((p) => p.par)));
