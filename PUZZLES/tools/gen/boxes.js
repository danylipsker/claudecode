/* The Puzzle Cabinet · tools/gen/boxes.js
 *
 *   node tools/gen/boxes.js        writes data/dots-and-boxes.js
 *
 * Lessons first: positions found by search that need exactly one idea at the
 * first decision (take the free boxes, draw a safe line, give the least, all
 * but two, the hard-hearted handout, all but four, a sacrifice, the right
 * safe line, the last chain). Then endgames graded by the engine's own
 * measure. Every position is solved exactly by the engine's solver.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/boxes.js'));
const B = C.boxesLib, E = C.engines.boxes;

function first(d) {
  const Gm = B.gameOf(d), S = Gm.S;
  const x = Gm.best(0, 0, 0);
  const need = Gm.need(0, 0);
  const all = S.moves(0);
  const k = B.moveKind(S, 0, x.i);
  const bad = all.filter((y) => y.net < need).map((y) => Object.assign({ i: y.i }, B.moveKind(S, 0, y.i)));
  const good = all.filter((y) => y.net >= need).map((y) => Object.assign({ i: y.i }, B.moveKind(S, 0, y.i)));
  return { Gm, S, x, k, bad, good, st: B.structure(S, 0) };
}
// the user's moves along best play until the first one that is not a capture
function firstNonTake(d) {
  const Gm = B.gameOf(d), S = Gm.S;
  let m = 0, gY = 0;
  for (let s = 0; s < 40; s++) {
    const x = Gm.best(m, gY, 0);
    if (!x) return null;
    const k = B.moveKind(S, m, x.i);
    if (k.kind !== 'take') {
      const bad = S.moves(m).filter((y) => y.net < Gm.need(gY, 0)).map((y) => B.moveKind(S, m, y.i));
      return { k, bad, took: gY, st: B.structure(S, m) };
    }
    m |= 1 << x.i; gY += x.c;
  }
  return null;
}

function find(seed, sizes, maxLeft, safeLeft, goalLevel, test) {
  const rng = C.rng(seed);
  for (let t = 0; t < 40000; t++) {
    const sz = rng.pick(sizes);
    const pos = B.randomPosition(rng, sz[0], sz[1], rng.range(0, safeLeft), maxLeft);
    if (!pos) continue;
    const S = B.solverFor(pos);
    if (S.n < 4 || S.openBoxes.length < 3) continue;
    const d = B.setGoal(rng, pos, goalLevel);
    if (!d) continue;
    const a = B.analyse(d);
    if (!a) continue;
    if (test(d, a, first(d))) return d;
  }
  throw new Error('no position found for seed ' + seed);
}
const tricks = (a) => a.feats.decline + a.feats.sacrifice + a.feats.hard;

const lessons = [
  { id: 'dab-free-boxes', title: 'Free Boxes', diff: 1,
    text: 'Some boxes already have three sides: the fourth line wins them — and then you move again. Here the computer has left a little something lying about.',
    hints: ['A box with three sides drawn is yours for one line, and you then draw another.', 'Collect what is free first; then think about what the last line should be.'],
    find: () => find(101, [[2, 3], [3, 2], [2, 2]], 9, 1, 1, (d, a, f) => f.st.ready.length >= 1 && f.k.kind === 'take' && f.bad.length > 0 && tricks(a) === 0) },
  { id: 'dab-nothing-free', title: 'Nothing for Free', diff: 1,
    text: 'No box is ready to take. Draw a line that gives nothing away — a line that does not put a third side on any box.',
    hints: ['A line is **safe** when neither box beside it would end up with three sides.', 'Count the sides already drawn on the boxes on each side of a line.'],
    find: () => find(202, [[2, 3], [3, 2], [3, 3]], 11, 2, 1, (d, a, f) => !f.st.ready.length && f.k.kind === 'safe' && f.bad.some((b) => b.kind !== 'safe') && tricks(a) === 0) },
  { id: 'dab-smallest-gift', title: 'The Smallest Gift', diff: 2,
    text: 'Every line left gives something away: whatever you draw, I get boxes. What will you give me?',
    hints: ['Each line you draw now opens a chain of boxes for me.', 'Give me the shortest chain you can.'],
    find: () => find(303, [[2, 3], [3, 3], [2, 4]], 12, 0, 1, (d, a, f) => !f.st.ready.length && !f.st.safe.length && f.k.kind === 'open' && !f.k.hard && f.bad.some((b) => b.kind === 'open') && f.st.comps.length >= 2) },
  { id: 'dab-take-them-all', title: 'Take Them All', diff: 2,
    text: 'I have handed you some boxes. Take them all — or all but the last two? Look at what is left after them.',
    hints: ['Declining the end of a chain only pays when a long chain is still to come.', 'Nothing long follows: there is no control worth paying two boxes for.'],
    find: () => find(404, [[2, 3], [3, 3], [3, 2]], 12, 0, 3, (d, a, f) => f.st.ready.length >= 1 && f.k.kind === 'take' && f.bad.some((b) => b.kind === 'decline') && a.feats.decline === 0) },
  { id: 'dab-all-but-two', title: 'All but Two', diff: 3,
    text: 'I have just opened a long chain for you. Take the lot? Think about what you will have to do after the last box.',
    hints: ['Take every box, and you must move again — and open the next chain for me.', 'Take all but the last two. Then draw the line at the far end, so the last two are left for me as a pair (a *double-cross*). Now I must open the next chain.'],
    find: () => find(505, [[3, 3], [3, 4], [4, 3]], 14, 0, 3, (d, a, f) => f.st.ready.length >= 1 && f.k.kind === 'take' && (() => { const z = firstNonTake(d); return z && z.k.kind === 'decline' && z.took >= 1 && z.bad.some((b) => b.kind === 'take') && !z.st.comps.some((c) => c.kind === 'loop'); })()) },
  { id: 'dab-hard-hearted', title: 'The Hard-Hearted Handout', diff: 3,
    text: 'Nothing safe is left, and the cheapest gift is a chain of two boxes. But *how* you give it matters.',
    hints: ['Give a two-box chain by an end line, and I may take neither box and hand the pair straight back to you — keeping control.', 'Draw the line **between** the two boxes: two single boxes cannot be declined.'],
    find: () => find(606, [[3, 3], [3, 4], [2, 4]], 14, 0, 3, (d, a, f) => !f.st.ready.length && f.k.kind === 'open' && f.k.hard && f.bad.some((b) => b.kind === 'open' && b.comp && b.comp.len === 2)) },
  { id: 'dab-count-safe', title: 'Count the Safe Lines', diff: 3,
    text: 'There are still safe lines to draw — but they are not all equally safe. When they run out, someone must open a chain.',
    hints: ['If we both keep playing safe lines, who draws the last one? The other player must then open a chain.', 'Choose the safe line after which I am the one to run out of safe lines first.'],
    find: () => find(707, [[3, 3], [3, 4], [4, 3]], 14, 3, 3, (d, a, f) => !f.st.ready.length && f.k.kind === 'safe' && f.st.safe.length >= 3 && f.bad.some((b) => b.kind === 'safe')) },
  { id: 'dab-all-but-four', title: 'All but Four', diff: 4,
    text: 'There is a loop on the board. When the time comes to take it, how much should you keep — and how much hand back?',
    hints: ['Declining a loop costs more than a chain: you must leave four boxes, as two pairs.', 'Take all but four of the loop, then draw the line that leaves two pairs for me. I take them and must open the next chain.'],
    find: () => find(808, [[3, 3], [3, 4], [4, 4]], 16, 1, 3, (d, a) => a.feats.loop >= 1) },
  { id: 'dab-sacrifice', title: 'Sacrifice to Win', diff: 4,
    text: 'Safe lines are still to be had. But playing safe here loses: find the line that gives something away — and wins.',
    hints: ['Count the safe lines: whoever draws the last one makes the other open the long chains.', 'Hand me a box or two now, and the count of safe lines comes out in your favour.'],
    find: () => find(909, [[3, 3], [3, 4], [4, 3]], 15, 3, 3, (d, a, f) => f.k.kind === 'sacrifice' && f.bad.some((b) => b.kind === 'safe') && f.good.length <= 2) }
];

const out = [];
lessons.forEach((L) => {
  const d = L.find();
  const p = { id: L.id, title: L.title, diff: L.diff, text: L.text, hints: L.hints, explain: B.explainOf(d), concepts: ['parity', 'working-backwards'], tags: ['lesson', 'dots and boxes'], data: d };
  out.push(p);
});

// graded endgames
const COUNT = [0, 8, 10, 12, 10, 8];
let no = 0;
const seen = new Set(out.map((p) => p.data.lines));
for (let lv = 1; lv <= 5; lv++) {
  const rng = C.rng(20260930 + lv * 7919);
  let made = 0, guard = 0;
  while (made < COUNT[lv] && guard++ < 5000) {
    const g = B.makeGame(rng, lv, 1);
    if (!g || seen.has(g.d.lines)) continue;
    seen.add(g.d.lines);
    made++;
    no++;
    out.push({ id: 'dab-' + String(no).padStart(3, '0'), title: 'Endgame ' + no + ': ' + B.gameTitle(g.d), diff: lv, text: B.gameText(g.d), concepts: ['parity'], tags: ['endgame'], data: g.d });
  }
  if (made < COUNT[lv]) throw new Error('level ' + lv + ': only ' + made);
}

out.forEach((p) => { const r = E.verify(p); if (!r.ok) throw new Error(p.id + ': ' + r.err); });
const sorted = out.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.i - b.i).map((x) => x.p);

const lines = [];
lines.push('/* The Puzzle Cabinet · data/dots-and-boxes.js — made by tools/gen/boxes.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'dots-and-boxes', engine: 'boxes', cat: 'games', name: 'Dots and boxes', order: 8,");
lines.push("  blurb: 'The pencil-and-paper game, near the end: take the boxes, decline the last two, sacrifice for control — against a computer that never slips.',");
lines.push("  origin: { year: 1889, who: 'Édouard Lucas', note: 'Édouard Lucas described the game in 1889 as *la pipopipette*. A century later Elwyn Berlekamp showed how experts play it: count the long chains, fight for control, and give away two boxes at the end of a chain to keep it.' },");
lines.push("  concepts: ['parity', 'working-backwards', 'nim-sum']");
lines.push('}, [');
sorted.forEach((p) => {
  const keys = ['id', 'title', 'diff', 'year', 'source', 'text', 'hints', 'explain', 'links', 'concepts', 'tags', 'data'].filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
});
lines.push(']);');
lines.push('');
lines.push('Cabinet.history([');
lines.push("  { year: 1889, title: 'La pipopipette', text: 'Édouard Lucas describes a new game of dots joined by lines, where completing a square wins it and earns another move: dots and boxes.', links: ['dots-and-boxes'] }");
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/dots-and-boxes.js'), lines.join('\n') + '\n');
const byDiff = [0, 0, 0, 0, 0, 0];
sorted.forEach((p) => byDiff[p.diff]++);
console.log('dots-and-boxes: ' + sorted.length + ' puzzles; by difficulty ' + byDiff.slice(1).join(' / '));
