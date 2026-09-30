/* The Puzzle Cabinet · tools/gen/hanoi.js
 *
 *   node tools/gen/hanoi.js        writes data/towers.js
 *
 * The Tower of Hanoi family: Lucas's towers of 2 to 8 discs, Dudeney's
 * cheeses on four stools, clockwise-only and next-door-only towers, twin
 * towers, Tower-of-London patterns and "finish from here" positions. Every
 * par is the fewest moves found by breadth-first search over all positions.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/hanoi.js'));
const H = C.hanoi;
const eng = C.engines.hanoi;

const tw = (n, pg) => Array.from({ length: n }, () => pg);
const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
const W = (k) => WORDS[k] || String(k);
const cap1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const out = [];
const add = (p) => { out.push(p); return p; };

/* ---------- the classics, told in our own words ---------- */

const lucasSrc = 'Édouard Lucas, sold in 1883 as the work of “Professor N. Claus (de Siam)” — an anagram of Lucas d\'Amiens.';

add({
  id: 'hanoi-two', title: 'The Smallest Tower', diff: 1,
  text: 'Two discs stand on peg A, the small one on top. Move the tower to peg C. Only the top disc of a peg may move, one at a time, and a disc may never rest on a smaller one.',
  data: { n: 2, pegs: 3, start: tw(2, 0), goal: tw(2, 2), rule: 'free', look: 'toy' },
  hints: ['The big disc must reach C, and it can only move when nothing is on top of it — and nothing is on C.'],
  explain: 'Small disc to B, big disc to C, small disc onto it: three moves. Every bigger tower is solved by the same idea, one size up.',
  concepts: ['recursion']
});
add({
  id: 'hanoi-three', title: 'Three Discs', diff: 1, year: 1883, source: lucasSrc,
  text: 'The puzzle Lucas sold in a little box, in miniature: three discs on peg A. Move the whole tower to peg C, one disc at a time, never a larger disc on a smaller.',
  data: { n: 3, pegs: 3, start: tw(3, 0), goal: tw(3, 2), rule: 'free', look: 'toy' },
  hints: ['Before the biggest disc can move, the two above it must be stacked out of the way — on peg B.', 'Two discs to B takes three moves; the big disc goes to C; the two follow it: 3 + 1 + 3.'],
  explain: 'Seven moves. To shift a tower of n discs, shift the n − 1 above the largest out of the way, move the largest, and shift the n − 1 back on top. Each extra disc doubles the work and adds one: 1, 3, 7, 15, 31 … that is 2ⁿ − 1. The solution to the big problem is built from the solution to a smaller one: [[c:recursion|recursion]].',
  concepts: ['recursion'], links: ['hanoi-two', 'hanoi-four']
});
add({
  id: 'hanoi-four', title: 'Four Discs', diff: 2, year: 1883, source: lucasSrc,
  text: 'Four discs on peg A. Bring them to peg C in the fewest moves.',
  data: { n: 4, pegs: 3, start: tw(4, 0), goal: tw(4, 2), rule: 'free', look: 'toy' },
  hints: ['With an even number of discs, the smallest disc goes first to the middle peg, not to the target.', 'The smallest disc moves on every other move, always the same way round (A → B → C → A). In between there is only ever one legal move that does not touch it.'],
  explain: 'Fifteen moves, and the pattern is pure [[c:binary|binary]]: number the moves 1 to 15 and write each number in binary. The disc that moves at move m is one more than the number of zeros at the end of m — move 4 = 100₂ moves disc 3, move 8 = 1000₂ moves the big disc 4, right in the middle.',
  concepts: ['binary', 'recursion'], links: ['hanoi-three', 'hanoi-five']
});
add({
  id: 'hanoi-five', title: 'Five Discs', diff: 3, year: 1883, source: lucasSrc,
  text: 'Five discs, three pegs. Move the tower from A to C.',
  data: { n: 5, pegs: 3, start: tw(5, 0), goal: tw(5, 2), rule: 'free', look: 'toy' },
  hints: ['An odd number of discs: the smallest goes straight to the target peg first.', 'Alternate: move the smallest disc one step round (A → C → B → A for an odd tower), then make the only other legal move. Repeat.'],
  explain: 'Thirty-one moves (2⁵ − 1). The two-step rhythm in the hint — smallest disc round the circle, then the only other possible move — solves any tower without thinking, and it never makes a wasted move.',
  concepts: ['recursion', 'binary']
});
add({
  id: 'hanoi-six', title: 'Six Discs', diff: 4, year: 1883, source: lucasSrc,
  text: 'Six discs. Move them from peg A to peg B — the middle one this time.',
  data: { n: 6, pegs: 3, start: tw(6, 0), goal: tw(6, 1), rule: 'free', look: 'wood' },
  hints: ['Which way round should the smallest disc travel when the target is B and the tower has an even number of discs?', 'For an even tower going A to B, the smallest disc moves A → C → B → A …'],
  explain: 'Sixty-three moves. Only the direction of the smallest disc depends on the target: it circles one way for an odd tower and the other way for an even one.',
  concepts: ['recursion']
});
add({
  id: 'hanoi-seven', title: 'Seven Discs', diff: 5, year: 1883, source: lucasSrc,
  text: 'Seven discs, 127 moves if you never waste one. A test of patience more than of cleverness — the rhythm, once found, does all the thinking.',
  data: { n: 7, pegs: 3, start: tw(7, 0), goal: tw(7, 2), rule: 'free', look: 'toy' },
  hints: ['Odd tower: the smallest disc travels A → C → B → A, moving every other time.'],
  explain: '2⁷ − 1 = 127. The biggest disc moves once, the next twice, the next four times … the smallest disc 64 times.',
  concepts: ['recursion', 'binary']
});
add({
  id: 'hanoi-monks', title: 'The Monks\' Tower', diff: 5, year: 1883, source: lucasSrc,
  text: 'The tower came with a legend. In a great temple, it said, three diamond needles stand on a brass plate, and at the creation sixty-four discs of pure gold were stacked on one of them. Day and night the priests move the discs by these very rules, and when all sixty-four stand on another needle, the world will end.\n\nHere are the top eight. Move them to needle C.',
  data: { n: 8, pegs: 3, start: tw(8, 0), goal: tw(8, 2), rule: 'free', look: 'gold' },
  hints: ['Eight is even: the smallest disc starts towards the middle needle.', 'The smallest disc circles A → B → C → A, moving every other time; in between, make the only other legal move.'],
  explain: '255 moves for eight discs. Sixty-four discs need 2⁶⁴ − 1 = 18,446,744,073,709,551,615 moves: at one move a second, the priests need well over 500 billion years. The world is safe for now.',
  concepts: ['recursion', 'binary', 'state-space']
});
add({
  id: 'hanoi-reve', title: 'The Reve\'s Puzzle', diff: 4, year: 1907,
  source: 'Henry Ernest Dudeney, *The Canterbury Puzzles* (1907).',
  text: 'In Dudeney\'s Canterbury tales the Reve, one of the pilgrims, sets a puzzle with cheeses. Eight cheeses of different sizes sit in a pile on the first of four stools. Move them all to the last stool, one at a time, never a larger cheese on a smaller. With four stools the job is far shorter than with three — but how short?',
  data: { n: 8, pegs: 4, start: tw(8, 0), goal: tw(8, 3), rule: 'free', look: 'cheese' },
  hints: ['Split the pile. Move some small cheeses aside using all four stools; move the big ones with the three stools left; then bring the small ones back.', 'Five small cheeses aside with four stools take 13 moves; the three big ones with three stools take 7; the five back take 13 again.'],
  explain: 'Thirty-three moves, as Dudeney said. With four stools there is no simple formula like 2ⁿ − 1. J. S. Frame and B. M. Stewart gave the best way to split the pile in 1941; that nothing cleverer exists was proved for four stools only in 2014, by Thierry Bousch. The Cabinet checked eight cheeses the dull way: by searching all 65,536 positions.',
  concepts: ['recursion', 'state-space'], links: ['hanoi-reve-3', 'hanoi-reve-5']
});

// Dudeney's stools, smaller
[[3, 1], [4, 2], [5, 2], [6, 3], [7, 3]].forEach(([n, df]) => {
  add({
    id: 'hanoi-reve-' + n, title: cap1(W(n)) + ' Cheeses, Four Stools', diff: df,
    source: n === 3 ? 'After Dudeney\'s Reve\'s Puzzle, *The Canterbury Puzzles* (1907).' : undefined,
    text: cap1(W(n)) + ' cheeses of different sizes are piled on stool A. Move them to stool D, one at a time, never a larger on a smaller. You have two spare stools, not one.',
    data: { n, pegs: 4, start: tw(n, 0), goal: tw(n, 3), rule: 'free', look: 'cheese' },
    hints: n === 3 ? ['With two spare stools, the two small cheeses need not share one.'] : undefined,
    explain: n === 3 ? 'Five moves: the two small cheeses go to separate stools, the big one crosses, and they climb back on. With three stools it would take seven.' : undefined,
    concepts: ['recursion'], links: ['hanoi-reve']
  });
});

// clockwise only
add({
  id: 'hanoi-clock-2b', title: 'Clockwise Pair', diff: 1,
  text: 'Two discs on peg A — but in this tower a disc may only travel clockwise, one step: A to B, B to C, C back to A. Move the tower to peg B.',
  data: { n: 2, pegs: 3, start: tw(2, 0), goal: tw(2, 1), rule: 'cyclic', look: 'toy' },
  hints: ['The small disc cannot go straight from A to the far side and back: to get "behind" the big disc it must go the long way round.'],
  explain: 'Five moves where the free tower needs three: the small disc makes a full lap. Going to the peg one step clockwise takes 1, 5, 15, 43 … moves for 1, 2, 3, 4 discs.',
  concepts: ['recursion', 'state-space'], links: ['hanoi-clock-2c', 'hanoi-clock-3b']
});
add({
  id: 'hanoi-clock-2c', title: 'The Long Way Round', diff: 1,
  text: 'Clockwise only again (A → B → C → A), two discs. This time the tower must go to peg C — two steps clockwise.',
  data: { n: 2, pegs: 3, start: tw(2, 0), goal: tw(2, 2), rule: 'cyclic', look: 'toy' },
  explain: 'Seven moves. Two steps clockwise costs more than one: 2, 7, 21, 59 … for 1, 2, 3, 4 discs. The two sequences feed each other — each is built from the other one size down.',
  concepts: ['recursion'], links: ['hanoi-clock-2b']
});
add({
  id: 'hanoi-clock-3b', title: 'Three Discs, Clockwise', diff: 3,
  text: 'Three discs on A; discs move only clockwise (A → B → C → A). Bring the tower to B.',
  data: { n: 3, pegs: 3, start: tw(3, 0), goal: tw(3, 1), rule: 'cyclic', look: 'toy' },
  hints: ['To put the big disc on B, the two small ones must be on C first — two steps clockwise from A.', 'Two discs two steps round take 7 moves; the big one moves; then the two go from C to B — also two steps clockwise.'],
  explain: 'Fifteen moves: 7 + 1 + 7. The pair has to make its way two steps round twice.',
  concepts: ['recursion']
});
add({
  id: 'hanoi-clock-3c', title: 'Three Discs the Long Way', diff: 4,
  text: 'Three discs, clockwise moves only. Move the tower from A to C.',
  data: { n: 3, pegs: 3, start: tw(3, 0), goal: tw(3, 2), rule: 'cyclic', look: 'toy' },
  concepts: ['recursion']
});
add({
  id: 'hanoi-clock-4b', title: 'Four Discs, Clockwise', diff: 5,
  text: 'Four discs, clockwise only, from A to B. Forty-three moves if you never slip.',
  data: { n: 4, pegs: 3, start: tw(4, 0), goal: tw(4, 1), rule: 'cyclic', look: 'toy' },
  concepts: ['recursion']
});

// next door only
add({
  id: 'hanoi-next-2', title: 'Next Door Only', diff: 2,
  text: 'Two discs on A. A disc may move only to a neighbouring peg: A ↔ B ↔ C — never straight from A to C or back. Bring the tower to C.',
  data: { n: 2, pegs: 3, start: tw(2, 0), goal: tw(2, 2), rule: 'adjacent', look: 'wood' },
  hints: ['Every trip from one end to the other has to stop at B on the way.'],
  explain: 'Eight moves — and there are exactly nine positions of two discs, so the solution passes through every one of them. For n discs it takes 3ⁿ − 1 moves: the longest road through the puzzle, visiting each of the 3ⁿ positions once.',
  concepts: ['recursion', 'state-space'], links: ['hanoi-next-3']
});
add({
  id: 'hanoi-next-2b', title: 'Next Door to the Middle', diff: 1,
  text: 'Neighbours only (A ↔ B ↔ C), two discs, and this time the tower goes to the middle peg B.',
  data: { n: 2, pegs: 3, start: tw(2, 0), goal: tw(2, 1), rule: 'adjacent', look: 'wood' },
  concepts: ['recursion']
});
add({
  id: 'hanoi-next-3', title: 'Three Doors Down', diff: 4,
  text: 'Three discs, moves only between neighbouring pegs (A ↔ B ↔ C). Bring the tower from A to C.',
  data: { n: 3, pegs: 3, start: tw(3, 0), goal: tw(3, 2), rule: 'adjacent', look: 'wood' },
  hints: ['The big disc must go A → B and later B → C. Each time, the two small discs must be on the far side of it — both at the other end.', 'So the pair travels A → C, back C → A, and A → C again: 8 + 1 + 8 + 1 + 8.'],
  explain: '26 moves = 3³ − 1: every one of the 27 positions is visited exactly once, in the order of a ternary [[c:gray-code|Gray code]].',
  concepts: ['recursion', 'gray-code', 'state-space']
});
add({
  id: 'hanoi-next-3b', title: 'Three to the Middle', diff: 3,
  text: 'Three discs, neighbours only (A ↔ B ↔ C). Bring the tower from A to the middle peg B.',
  data: { n: 3, pegs: 3, start: tw(3, 0), goal: tw(3, 1), rule: 'adjacent', look: 'wood' },
  concepts: ['recursion']
});
add({
  id: 'hanoi-next-4', title: 'Eighty Moves', diff: 5,
  text: 'Four discs, neighbours only, A to C. The shortest solution visits all 81 positions of four discs — every one of them, exactly once.',
  data: { n: 4, pegs: 3, start: tw(4, 0), goal: tw(4, 2), rule: 'adjacent', look: 'wood' },
  concepts: ['recursion', 'state-space']
});

// twin towers
add({
  id: 'hanoi-twin-swap', title: 'Twin Towers', diff: 2,
  text: 'Two towers of interleaved sizes: the red discs (1 and 3) on peg A, the blue (2 and 4) on peg C. Make them change places — red to C, blue to A — one disc at a time, never a bigger on a smaller.',
  data: { n: 4, pegs: 3, start: [0, 2, 0, 2], goal: [2, 0, 2, 0], rule: 'free', look: 'twin' },
  hints: ['The big blue disc 4 needs A empty and nothing on top of it.'],
  concepts: ['state-space']
});
add({
  id: 'hanoi-twin-sort', title: 'Red and Blue', diff: 2,
  text: 'One tower, red and blue discs taking turns. Separate the colours: the red discs on B, the blue on C.',
  data: { n: 4, pegs: 3, start: tw(4, 0), goal: [1, 2, 1, 2], rule: 'free', look: 'twin' },
  concepts: ['state-space']
});
add({
  id: 'hanoi-twin-swap-6', title: 'Twin Towers of Six', diff: 4,
  text: 'Red discs 1, 3 and 5 on peg A, blue discs 2, 4 and 6 on peg C. Exchange the two towers.',
  data: { n: 6, pegs: 3, start: [0, 2, 0, 2, 0, 2], goal: [2, 0, 2, 0, 2, 0], rule: 'free', look: 'twin' },
  concepts: ['state-space']
});
add({
  id: 'hanoi-twin-sort-6', title: 'Unmix Six', diff: 4,
  text: 'Six discs on A, red and blue in turn. Put the red ones on C and the blue ones on B.',
  data: { n: 6, pegs: 3, start: tw(6, 0), goal: [2, 1, 2, 1, 2, 1], rule: 'free', look: 'twin' },
  concepts: ['state-space']
});

// the Tower of London, curated start
add({
  id: 'hanoi-london', title: 'The Tower of London', diff: 1, year: 1982,
  source: 'After the Tower of London planning test of the neuropsychologist Tim Shallice (1982).',
  text: 'Three balls — red, green and blue — on three pegs that hold three, two and one ball. Any ball may sit on any other; only the peg heights limit you. Make the arrangement in the goal picture in as few moves as you can. Psychologists use puzzles like this to watch people plan ahead.',
  data: { london: true, n: 3, pegs: 3, caps: [3, 2, 1], start: [[0, 2], [1], []], goal: [[2, 0], [1], []] },
  hints: ['Red and blue must change places on the tall peg — so both have to leave it for a moment.', 'The short peg holds one ball and the middle peg has room for one more: park red and blue there.'],
  concepts: ['state-space']
});

/* ---------- made by search (seeded, so the same every time) ---------- */

const rng = C.rng(18831883);
const names = {
  scramble: ['Finish the Job', 'Left Half-Done', 'The Interrupted Tower', 'After the Tea Break', 'A Tower in Pieces', 'Back on Track', 'The Apprentice\'s Muddle', 'Scattered Discs', 'Half a Tower', 'The Shortcut Home', 'Loose Ends', 'Tidy the Workshop'],
  pattern: ['Copy the Picture', 'A New Arrangement', 'Shuffle the Stacks', 'Rearranged', 'The Other Way Round', 'Picture This', 'Swap Shop', 'Mix and Match'],
  london: ['Red on Top', 'Short Peg, Tall Peg', 'Three Heights', 'The Planner', 'Four Beads', 'Beads Rearranged', 'Think Ahead', 'Look Before You Leap'],
  'reve-scramble': ['Cheeses Everywhere', 'Back on the Stool', 'The Cheese Shop']
};
const used = new Set(out.map((p) => p.title));
const nameFor = (kind) => {
  const list = names[kind];
  for (const t of list) if (!used.has(t)) { used.add(t); return t; }
  let k = 2;
  while (used.has(list[0] + ' ' + k)) k++;
  used.add(list[0] + ' ' + k);
  return list[0] + ' ' + k;
};
const seen = new Set(out.map((p) => JSON.stringify(p.data)));
let serial = 0;
// kind, level (sets n), band of pars, how many
const plan = [
  ['london', 1, [3, 4], 1, { n: 3 }], ['london', 1, [5, 6], 1, { n: 3 }], ['london', 1, [7, 8], 1, { n: 3 }],
  ['scramble', 1, [4, 7], 2, { n: 3 }], ['pattern', 1, [4, 7], 2, { n: 3 }],
  ['london', 2, [8, 10], 2, { n: 4 }],
  ['scramble', 2, [9, 15], 3, { n: 4 }], ['pattern', 2, [9, 15], 2, { n: 4 }],
  ['scramble', 3, [18, 31], 3, { n: 5 }], ['pattern', 3, [18, 31], 2, { n: 5 }], ['reve-scramble', 3, [16, 25], 1, { n: 7 }],
  ['scramble', 4, [36, 63], 2, { n: 6 }], ['pattern', 4, [40, 63], 1, { n: 6 }], ['reve-scramble', 4, [26, 36], 1, { n: 8 }],
  ['scramble', 5, [80, 127], 1, { n: 7 }]
];
plan.forEach(([kind, level, band, count, opts]) => {
  for (let made = 0, guard = 0; made < count && guard < 500; guard++) {
    const d = H.build(kind, rng, level, Object.assign({ band }, opts));
    if (!d) continue;
    const key = JSON.stringify(d);
    if (seen.has(key)) continue;
    const par = H.parOf(d);
    if (par < band[0] || par > band[1]) continue;
    seen.add(key);
    made++;
    const variants = [
      H.textOf(d, kind),
      kind === 'scramble' ? 'A tower was halfway through a move when its owner was called away. Bring every disc to peg ' + 'ABCD'[d.goal[0]] + ', one at a time, never a bigger on a smaller.' : null,
      kind === 'scramble' ? 'The discs are scattered over the three pegs. Stack them all on peg ' + 'ABCD'[d.goal[0]] + ' in the fewest moves.' : null
    ].filter(Boolean);
    add({
      id: 'hanoi-' + String(++serial).padStart(3, '0'), title: nameFor(kind), diff: H.diffOf(par, d),
      text: variants[serial % variants.length], data: d, concepts: kind === 'london' ? ['state-space'] : ['state-space', 'recursion']
    });
  }
});

/* ---------- par, check, order, write ---------- */

out.forEach((p) => {
  const r = eng.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  p.par = r.par;
  if (!p.diff) p.diff = H.diffOf(p.par, p.data);
});
const order = out.map((p, i) => ({ p, i }));
order.sort((a, b) => a.p.diff - b.p.diff || a.p.par - b.p.par || a.i - b.i);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/towers.js — made by tools/gen/hanoi.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'towers', engine: 'hanoi', cat: 'mechanical', name: 'Towers of Hanoi', order: 1,");
lines.push("  blurb: 'Move a tower of discs from one peg to another, one disc at a time, never a larger on a smaller — and its many relatives.',");
lines.push("  origin: { year: 1883, who: 'Édouard Lucas', note: 'The French mathematician Édouard Lucas sold the Tower of Hanoi in 1883 under the name of Professor N. Claus (de Siam), with a legend of priests moving 64 golden discs. Dudeney gave it a fourth stool and cheeses in 1907; the four-peg version was proved optimal only in 2014.' },");
lines.push("  concepts: ['recursion', 'binary', 'state-space']");
lines.push('}, [');
const emit = (p) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'data', 'hints', 'explain', 'links', 'concepts', 'tags', 'par'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
};
order.forEach((o) => emit(o.p));
lines.push(']);');
lines.push('Cabinet.history([');
lines.push("  { year: 1941, title: 'Four pegs', text: 'J. S. Frame and B. M. Stewart publish the method for the Tower of Hanoi with four pegs — Dudeney\\'s cheeses on stools. Whether it is really the best stays open until Thierry Bousch proves it in 2014.', links: ['towers', 'hanoi-reve'] },");
lines.push("  { year: 1982, title: 'The Tower of London', text: 'The neuropsychologist Tim Shallice uses coloured balls on three pegs of different heights to study how people plan — a cousin of Lucas\\'s tower.', links: ['hanoi-london'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/towers.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
out.forEach((p) => byDiff[p.diff]++);
console.log('towers: ' + out.length + ' puzzles; by difficulty 1-5: ' + byDiff.slice(1).join(' / ') + '; pars ' + Math.min(...out.map((p) => p.par)) + '..' + Math.max(...out.map((p) => p.par)));
