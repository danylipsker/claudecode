/* The Puzzle Cabinet · tools/gen/dice.js
 *
 *   node tools/gen/dice.js      writes data/dice.js
 *
 * Dice to turn in your head: hidden faces in towers and rows, an odd die seen
 * three ways, a die rolled along a path, and dice mazes. Every answer is
 * recomputed (and for the mazes the par found by search) by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/dice.js'));
const L = C.diceLib;
const E = C.engines.dice;
const OR = Array.from(L.ORIENTS.values());
const rng = C.rng(606);
const pickO = () => rng.pick(OR).slice();
const list = [];

function scene(id, title, diff, text, dice, ask, extra) {
  const d = { kind: 'scene', dice, ask };
  d.answer = L.sceneAnswer(d);
  if (d.answer == null) throw new Error(id + ': not decided');
  return Object.assign({ id, title, diff, text, concepts: ['rotation-3d'], tags: ['hidden faces'], data: d }, extra || {});
}

/* ---------- warm-ups and towers ---------- */

{
  const o = [3, 1, 2];
  list.push(scene('dice-bottom', 'Face Down', 1, 'A standard die lies on the table. Walk round it (drag the view) and look. What number is on the face resting on the table?', [[0, 0, 0, ...o]], { face: [0, 'b'] },
    { hints: ['Opposite faces of a die add up to 7.', 'The bottom is opposite the top.'], explain: 'Opposite faces add up to 7, so the bottom is 7 minus the top: 7 − ' + o[0] + ' = **' + (7 - o[0]) + '**.' }));
}
{
  const o = [5, 4, 1];
  list.push(scene('dice-five-faces', 'All You Can See', 1, 'Walk round this single die and add up the numbers on **every face you can see** — the top and all four sides.', [[0, 0, 0, ...o]], 'visible',
    { hints: ['All six faces add up to 1 + 2 + … + 6 = 21.', 'Only the bottom is hidden.'], explain: 'The six faces add up to 21 and only the bottom (7 − ' + o[0] + ' = ' + (7 - o[0]) + ') is hidden: 21 − ' + (7 - o[0]) + ' = **' + (21 - (7 - o[0])) + '**.' }));
}
[
  ['dice-tower-2', 'Two High', 1, 2], ['dice-tower-3', 'Three High', 2, 3], ['dice-tower-5', 'Five High', 2, 5]
].forEach(([id, title, diff, n]) => {
  const dice = [];
  for (let i = 0; i < n; i++) dice.push([0, i, 0, ...pickO()]);
  const top = dice[n - 1][3];
  list.push(scene(id, title, diff, 'A tower of ' + n + ' standard dice stands on the table. Add up every face that **nobody can see from anywhere**: the faces pressed against each other and the one against the table.', dice, 'hidden',
    { hints: ['The hidden faces come in opposite pairs: the top and bottom of every die except the top one.', 'Each pair adds up to 7; the top die gives only its bottom.'], explain: 'Every die but the top one hides both its top and its bottom — a pair adding up to 7. The top die hides only its bottom, 7 − ' + top + '. Total: ' + (n - 1) + ' × 7 + ' + (7 - top) + ' = **' + (7 * n - top) + '**. You only need to look at the very top!', tags: ['hidden faces', 'tower'] }));
});
{
  const dice = [0, 1, 2].map((x) => [x, 0, 0, ...pickO()]);
  list.push(scene('dice-row-3', 'Shoulder to Shoulder', 2, 'Three standard dice stand in a row on the table, touching. What is the total of all the **hidden** faces — the ones against the table and the ones pressed together?', dice, 'hidden',
    { hints: ['The bottoms are opposite the tops.', 'The middle die hides both its left and right faces — a pair adding to 7.', 'The end dice each hide one side face: the one opposite the side you can see.'], explain: 'Bottoms: 21 minus the three tops. The middle die hides a left–right pair: 7. The end dice each hide the face opposite their visible outer side. Adding up gives **' + L.sceneAnswer({ kind: 'scene', dice, ask: 'hidden' }) + '**.', tags: ['hidden faces', 'row'] }));
}
{
  const dice = [0, 1, 2, 3].map((x) => [x, 0, 0, ...pickO()]);
  list.push(scene('dice-row-4', 'Four in a Row', 3, 'Four standard dice in a row on the table, touching. Total of every hidden face?', dice, 'hidden',
    { hints: ['Each inner die hides a whole left–right pair: 7 each.', 'Walk round to read the tops and the two outer ends.'], tags: ['hidden faces', 'row'] }));
}
{
  const dice = [0, 1, 2].map((x) => [x, 0, 0, ...pickO()]);
  list.push(scene('dice-row-visible', 'What Shows', 3, 'Three standard dice in a row, touching. Walk all the way round and add up every face you **can** see.', dice, 'visible',
    { hints: ['Three dice have 3 × 21 = 63 pips in all.', 'Take away what is hidden: the bottoms and the four faces pressed together.'], tags: ['visible faces', 'row'] }));
}
{
  const dice = [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1], [0, 1, 0]].map((q) => [...q, ...pickO()]);
  list.push(scene('dice-block', 'The Little Stack', 3, 'Four standard dice make a square on the table and a fifth sits on top of one of them. Add up every hidden face — against the table or against another die.', dice, 'hidden',
    { hints: ['Each die on the table hides its bottom, which is opposite its top — but one of those tops is hidden too.', 'Count pairs: a hidden face whose opposite face is also hidden makes 7 with it, whatever the numbers are.'], tags: ['hidden faces', 'stack'] }));
}
{
  const dice = [[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0], [1, 1, 0], [0, 2, 0]].map((q) => [...q, ...pickO()]);
  list.push(scene('dice-staircase', 'The Staircase', 4, 'Six standard dice make a staircase: three on the table, two on top of those, and one at the very top. What is the total of the hidden faces — against the table or against another die?', dice, 'hidden',
    { hints: ['Look for opposite pairs that are both hidden — each is worth 7 without reading anything.', 'The bottom-left die is hidden on its top, its bottom and its right side.'], tags: ['hidden faces', 'stack'] }));
}
{
  const dice = [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1], [0, 1, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]].map((q) => [...q, ...pickO()]);
  list.push(scene('dice-cube', 'The Big Die', 4, 'Eight standard dice are stacked into a 2 × 2 × 2 cube on the table. What is the total of all the hidden faces — against the table or against another die?', dice, 'hidden',
    { hints: ['Count, die by die, how many of its faces touch the table or another die.', 'The top four dice each hide three faces (the bottom and two sides); the bottom four each hide four (top, bottom and two sides).', 'In the bottom layer the top and bottom of each die are both hidden: that pair makes 7 without reading anything.'], tags: ['hidden faces', 'cube'] }));
}
{
  // the face nobody can see, decided by the sides you can
  const dice = [[0, 0, 0, 2, 1, 4], [0, 1, 0, 5, 3, 6]];
  list.push(scene('dice-under-tower', 'Underneath It All', 3, 'Two standard dice stand in a tower. What number is on the bottom of the **lower** die, the face against the table?', dice, { face: [0, 'b'] },
    { hints: ['The bottom is opposite the top — but the lower die\'s top is hidden under the other die.', 'Read two touching side faces of the lower die. On these dice, with 1 on top and 2 facing south, 3 is on the east; turn that picture until it matches.'], explain: 'Two neighbouring side faces fix how a die is turned, and so the hidden top; the bottom is 7 minus that. Here the lower die shows ' + dice[0][4] + ' to the south and ' + dice[0][5] + ' to the east, so its top is ' + dice[0][3] + ' and its bottom **' + (7 - dice[0][3]) + '**.' }));
}
{
  const dice = [0, 1, 2].map((x) => [x, 0, 0, ...pickO()]);
  list.push(scene('dice-middle-east', 'Squeezed in the Middle', 4, 'Three standard dice stand in a row, touching. What number is on the **east (right) face of the middle die** — the face pressed against its right-hand neighbour?', dice, { face: [1, 'e'] },
    { hints: ['Both side faces of the middle die are hidden, and they add up to 7 — but which is which?', 'You can see its top and its front. On these dice, with 1 on top and 2 facing south, 3 is on the east; turn that picture to match.'], explain: 'Top and front fix the die completely once you know which way round the numbers go: here the middle die shows ' + dice[1][3] + ' on top and ' + dice[1][4] + ' in front, which puts **' + dice[1][5] + '** on the east.' }));
}

/* ---------- an odd die, seen three ways ---------- */

function oddViews(seed) {
  const r = C.rng(seed);
  for (let tries = 0; tries < 400; tries++) {
    const nums = r.shuffle([1, 2, 3, 4, 5, 6]);
    const Lb = { t: nums[0], b: nums[1], n: nums[2], s: nums[3], e: nums[4], w: nums[5] };
    if (Lb.t + Lb.b === 7 && Lb.n + Lb.s === 7) continue;
    const T = L.turnings(Lb);
    const views = r.shuffle(T.slice()).slice(0, 3).map((x) => [x.t, x.s, x.e]);
    const faces = [1, 2, 3, 4, 5, 6];
    for (const v of r.shuffle(faces)) {
      const vals = L.oppositeFromViews(views, v);
      if (vals.length !== 1) continue;
      // the answer must not be visible opposite in a single view (it never is: opposite faces never show together)
      return { views, v, ans: vals[0] };
    }
  }
  return null;
}
[['dice-odd-1', 'The Joker\'s Die', 3, 31], ['dice-odd-2', 'Another Odd Die', 4, 47], ['dice-odd-3', 'The Third Look', 4, 83]].forEach(([id, title, diff, seed]) => {
  const q = oddViews(seed);
  list.push({
    id, title, diff,
    text: 'This die has the numbers 1 to 6, but **not** in the usual places — opposite faces need not add up to 7. Here it is three times (A, B, C), turned different ways; faces marked ? are simply out of sight. Which number is **opposite the ' + q.v + '**?',
    hints: ['Two faces seen together in one view are never opposite each other.', 'List, for the ' + q.v + ', every number you have seen beside it. Whatever is left must be opposite.'],
    explain: 'A number that ever appears in the same view as the ' + q.v + ' touches it, so it cannot be opposite. Cross off every such number; the views here leave only **' + q.ans + '**. (If one number were left over but the views could still be fitted by two different dice, the puzzle would be unfair — the computer checked all 720 ways of numbering a cube.)',
    concepts: ['rotation-3d', 'deduction'], tags: ['views', 'odd die'],
    data: { kind: 'views', views: q.views, ask: { opposite: q.v }, answer: q.ans }
  });
});

/* ---------- rolling ---------- */

function rollP(id, title, diff, die, pathStr, ask, extra) {
  const d = { kind: 'roll', start: [0, 0], die, path: pathStr, ask: ask || 't' };
  const r = L.rollPath(d);
  d.answer = L.faceOf(r.o, d.ask);
  const names = { N: 'north', S: 'south', E: 'east', W: 'west' };
  const what = { t: 'on top', s: 'facing south (towards you)', e: 'on the east side' }[d.ask];
  return Object.assign({
    id, title, diff,
    text: 'The die starts with **' + die[0] + '** on top, **' + die[1] + '** facing south (towards you) and **' + die[2] + '** on the east (right). It tips over one edge at a time, following the arrows: ' + pathStr.split('').map((c) => names[c]).join(', ') + '. At the end, what number is ' + what + '?',
    concepts: ['rotation-3d'], tags: ['rolling'],
    data: d
  }, extra || {});
}
list.push(rollP('dice-roll-one', 'One Tip East', 1, [1, 2, 3], 'E', 't', { hints: ['Tipping east, the top face goes down the east side and the west face comes up.', 'The west face is opposite the east: 7 − 3.'], explain: 'Rolling east, the west face comes to the top: 7 − 3 = **4**.' }));
list.push(rollP('dice-roll-two', 'East, Then North', 1, [6, 3, 2], 'EN', 't', { hints: ['After the east roll, the old west face (7 − 2 = 5) is on top.', 'Rolling north, the south face comes up — and rolling east did not change the south face.'] }));
list.push(rollP('dice-roll-straight', 'Four in a Line', 1, [2, 6, 3], 'SSSS', 't', { hints: ['Each roll south brings the north face up. After four rolls the die has turned a full circle.'], explain: 'Four quarter-turns in the same direction make a whole turn: the die is back the way it started, with **2** on top.' }));
list.push(rollP('dice-roll-square', 'Round the Square', 2, [1, 2, 3], 'ESWN', 't', {
  hints: ['It ends in the square where it started — but is it the same way up?', 'Follow it one roll at a time: east brings up 4, south brings up the north face…'],
  explain: 'Back in its starting square, the die has **4** on top, not 1: rolling round a loop turns a die. (Rolling round a square three times in the same direction brings it back to where it began.)',
  data: null
}));
list[list.length - 1].data = { kind: 'roll', start: [0, 0], die: [1, 2, 3], path: 'ESWN', ask: 't', answer: 4, traps: [{ match: 1, msg: 'It is back in the same square — but not the same way up. Roll it and see.' }] };
{
  const r2 = C.rng(1717);
  const lens = [[4, 2], [5, 2], [6, 3], [7, 3], [8, 3], [10, 4], [11, 4], [13, 5], [16, 5]];
  lens.forEach(([n, diff], k) => {
    // a path that never visits a square twice
    let pathStr;
    for (;;) {
      let x = 0, y = 0; pathStr = '';
      const seen = new Set(['0,0']);
      let ok = true;
      for (let i = 0; i < n; i++) {
        const opts = 'NESW'.split('').filter((dd) => { const q = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[dd]; return !seen.has((x + q[0]) + ',' + (y + q[1])); });
        if (!opts.length) { ok = false; break; }
        const dd = r2.pick(opts), q = { N: [0, -1], S: [0, 1], E: [1, 0], W: [-1, 0] }[dd];
        x += q[0]; y += q[1]; pathStr += dd; seen.add(x + ',' + y);
      }
      if (ok) break;
    }
    const die = r2.pick(OR).slice();
    const ask = k >= 5 && k % 2 ? 's' : 't';
    list.push(rollP('dice-roll-' + (k + 1), 'The Long Way ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][k], diff, die, pathStr, ask, {
      hints: ['Keep track of just three faces: top, south and east. The other three are 7 minus those.', 'Rolling east: new top = old west. Rolling south: new top = old north. Rolling west: new top = old east. Rolling north: new top = old south.']
    }));
  });
}

/* ---------- mazes ---------- */

{
  const bands = [[2, [3, 4], 2], [2, [4, 5], 1], [3, [6, 8], 3], [4, [9, 12], 3], [5, [13, 22], 2]];
  const r3 = C.rng(2468);
  let k = 0;
  bands.forEach(([diff, [lo, hi], count]) => {
    let made = 0, guard = 0;
    while (made < count && guard++ < 20000) {
      const W = r3.range(4, diff <= 2 ? 5 : diff === 3 ? 6 : 7), Hh = r3.range(4, diff <= 2 ? 5 : diff === 3 ? 6 : 7);
      const rows = [];
      for (let y = 0; y < Hh; y++) { let row = ''; for (let x = 0; x < W; x++) { const u = r3(); row += u < 0.12 ? '#' : u < 0.12 + 0.3 + diff * 0.06 ? String(r3.range(1, 6)) : '.'; } rows.push(row); }
      const start = [0, r3.int(Hh)], goal = [W - 1, r3.int(Hh)];
      const setC = (q, ch) => { rows[q[1]] = rows[q[1]].slice(0, q[0]) + ch + rows[q[1]].slice(q[0] + 1); };
      setC(start, '.'); setC(goal, '.');
      const d = { kind: 'maze', grid: rows, start, goal, die: r3.pick(OR).slice() };
      if (diff >= 4 && r3() < 0.5) d.goalTop = r3.range(1, 6);
      const pth = L.mazeSolve(d);
      if (!pth || pth.length < lo || pth.length > hi) continue;
      const free = L.mazeSolve(Object.assign({}, d, { grid: rows.map((r) => r.replace(/[1-6]/g, '.')), goalTop: null }));
      if (diff >= 3 && free && free.length >= pth.length - 1) continue;
      k++; made++;
      list.push({
        id: 'dice-maze-' + String(k).padStart(2, '0'), title: 'Die Maze ' + ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][k - 1], diff, par: pth.length,
        text: 'Roll the die from the green square to the gold one, tipping it over one edge at a time. A **numbered** square takes the die only if that number comes out **on top**; blank squares take it any way up; where there is no square there is no floor.' + (d.goalTop ? ' It must arrive showing **' + d.goalTop + '** on top.' : ''),
        hints: k === 1 ? ['Before each roll, work out what will be on top afterwards: rolling east brings up the west face (7 − east).', 'The flat plan (2D button) shows the four side faces around the die.'] : null,
        concepts: ['rotation-3d', 'state-space'], tags: ['maze'],
        data: d
      });
    }
    if (made < count) throw new Error('could not make mazes for diff ' + diff);
  });
}

const out = list.map((p, i) => ({ p, i })).sort((a, b) => a.p.diff - b.p.diff || a.i - b.i).map((x) => x.p);
const lines = ['/* The Puzzle Cabinet · data/dice.js — made by tools/gen/dice.js */', 'Cabinet.family(' + JSON.stringify({
  id: 'dice', engine: 'dice', cat: 'cards', name: 'Dice', order: 4,
  blurb: 'Turn a die in your head: the faces nobody can see, where a rolling die ends up, and mazes where the die may only land on its own number.',
  origin: { who: 'Traditional', note: 'Dice are among the oldest gaming pieces; the rule that opposite faces add up to seven is centuries old. These puzzles are about seeing a die in space, not about chance.' },
  concepts: ['rotation-3d']
}, null, 2).replace(/"(\w+)":/g, '$1:') + ', ['];
out.forEach((p, i) => {
  Object.keys(p).forEach((k) => { if (p[k] == null) delete p[k]; });
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  lines.push('  { ' + Object.keys(p).map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' }' + (i < out.length - 1 ? ',' : ''));
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/dice.js'), lines.join('\n') + '\n');
const by = [0, 0, 0, 0, 0, 0];
out.forEach((p) => by[p.diff]++);
console.log('dice.js: ' + out.length + ' puzzles; by difficulty ' + by.slice(1).join(' / '));
