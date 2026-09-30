/* The Puzzle Cabinet · tools/gen/stamps.js
 *
 *   node tools/gen/stamps.js        writes data/stamp-folding.js
 *
 * For every strip and sheet size the engine's own search lists every pile
 * that folding the whole packet can make, with the fewest folds for each.
 * A few named piles come first; the rest are drawn at random (seeded) with a
 * spread of fold counts. Pile and reversed pile count as the same puzzle.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/stamps.js'));
const S = C.stampsSolver;

const PLAN = [ // [rows, cols, how many]
  [1, 3, 3], [1, 4, 6], [2, 2, 3], [1, 5, 8], [2, 3, 6], [1, 6, 8], [2, 4, 8], [3, 3, 5], [1, 7, 7], [1, 8, 6]
];

function canon(p) { const r = p.slice().reverse(); return p.join(' ') < r.join(' ') ? p : r; }
const isId = (p) => p.every((v, i) => v === i + 1);
const oddsThenEvens = (p) => { const n = p.length, want = []; for (let i = 1; i <= n; i += 2) want.push(i); for (let i = 2; i <= n; i += 2) want.push(i); return p.join() === want.join(); };
const evensUpOddsDown = (p) => { const n = p.length, want = []; for (let i = 2; i <= n; i += 2) want.push(i); for (let i = n - (n % 2 ? 0 : 1); i >= 1; i -= 2) want.push(i); return p.join() === want.join(); };

// named piles; returns the pile the right way up for its name
function special(p, R, K) {
  const n = p.length, rv = p.slice().reverse();
  for (const q of [p, rv]) {
    if (isId(q)) return { name: R === 1 ? NUM[n] + ' in Order' : 'The Sheet of ' + NUM[n] + ' in Order', tag: 'in order', target: q };
    if (oddsThenEvens(q)) return { name: 'Odds, Then Evens' + (R === 1 ? ' (' + NUM[n].toLowerCase() + ')' : ' (sheet of ' + NUM[n].toLowerCase() + ')'), tag: 'odd and even', target: q };
    if (evensUpOddsDown(q) && n >= 5) return { name: 'Evens Up, Odds Down (' + NUM[n].toLowerCase() + ')', tag: 'odd and even', target: q };
  }
  return null;
}
const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

const rng = C.rng(1891);
const out = [];
const titles = new Set();
PLAN.forEach(([R, K, want]) => {
  const all = S.allPiles(R, K);
  const uniq = new Map();
  all.forEach((depth, k) => {
    const p = k.split(' ').map(Number);
    const c = canon(p).join(' ');
    if (!uniq.has(c) || uniq.get(c) > depth) uniq.set(c, depth);
  });
  const list = Array.from(uniq.entries()).map(([k, depth]) => ({ p: k.split(' ').map(Number), depth }));
  const picked = [];
  // named piles first
  list.forEach((x) => { const sp = special(x.p, R, K); if (sp) picked.push(Object.assign(x, { sp })); });
  // then a spread over the fold counts
  const byDepth = {};
  list.forEach((x) => { if (!picked.includes(x)) (byDepth[x.depth] = byDepth[x.depth] || []).push(x); });
  const depths = Object.keys(byDepth).map(Number).sort((a, b) => a - b);
  let di = depths.length - 1, guard = 0;
  while (picked.length < want && guard++ < 1000) {
    const d = depths[di];
    di = (di + depths.length - 1) % depths.length;
    const pool = byDepth[d];
    if (!pool || !pool.length) continue;
    const i = rng.int(pool.length);
    picked.push(pool.splice(i, 1)[0]);
  }
  picked.forEach((x) => {
    // show the pile with its top stamp as the puzzle names it: randomly one way up
    let target = x.sp ? x.sp.target.slice() : x.p.slice();
    if (!x.sp && rng() < 0.5) target.reverse();
    const pth = S.solve(S.start(R, K), target);
    const par = pth.length;
    const d = { rows: R, cols: K, target };
    let title = x.sp ? x.sp.name : S.makeTitle(target, R, K);
    if (titles.has(title)) throw new Error('duplicate title ' + title);
    titles.add(title);
    const sheet = S.sheetWord(d);
    let text = 'Fold the ' + sheet + ' along the perforations until they all lie in one pile that reads, from the top down: **' + target.join(' ') + '**.';
    if (R > 1) text += ' The stamps are numbered row by row, as they lie at the start.';
    const hints = [];
    if (x.sp && x.sp.tag === 'in order') hints.push(R === 1 ? 'Stamp 1 on top, then 2 below it, then 3… each stamp folded back under the one before: a zigzag, like the bellows of a concertina.' : 'Fold the rows together first, then the columns — or the other way round. Watch the side view.');
    if (x.sp && x.sp.tag === 'odd and even') hints.push('Look at the side view as you go: the odd stamps and the even ones must end up in two separate runs. Which fold keeps each odd stamp away from its even neighbours?');
    const p = {
      id: 'stamps-' + R + 'x' + K + '-' + (out.filter((q) => q.data.rows === R && q.data.cols === K).length + 1),
      title, diff: S.grade(R, K, par), par, text, data: d,
      concepts: ['folding', 'combinatorics'], tags: [R === 1 ? 'strip' : 'sheet', NUM[R * K].toLowerCase() + ' stamps'].concat(x.sp ? [x.sp.tag] : [])
    };
    if (hints.length) p.hints = hints;
    out.push(p);
  });
});

// the classics of the drawer: a few words of history on the first ones
const first = out.find((p) => p.data.rows === 1 && p.data.cols === 4 && isId(p.data.target));
if (first) {
  first.explain = 'A strip folded like a concertina — each stamp turned back under the one before — reads 1, 2, 3, 4 from the top. There are 16 different piles a strip of four stamps can make (8 if a pile and the same pile turned over count once), and this is the one everybody finds first.';
}
const eight = out.find((p) => p.data.rows === 1 && p.data.cols === 8 && isId(p.data.target));
if (eight) {
  eight.explain = 'Seven folds, each the other way: the strip ends as a concertina. A strip of eight stamps can be folded into 1,392 different piles (counting a pile and its upside-down twin separately), a number found by listing them all — no formula for these counts is known. Folding the whole packet at every step, as this drawer does, reaches 1,328 of them; the rest need a flap tucked in between other layers.';
}

// easiest first; within a level by size, then par
out.sort((a, b) => a.diff - b.diff || (a.data.rows * a.data.cols) - (b.data.rows * b.data.cols) || a.par - b.par);

// fresh ids in the final order would change with the plan; keep the size-based ids (stable) but check they are unique
const ids = new Set();
out.forEach((p) => { if (ids.has(p.id)) throw new Error('duplicate id ' + p.id); ids.add(p.id); });

const lines = [];
lines.push('/* The Puzzle Cabinet · data/stamp-folding.js — made by tools/gen/stamps.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'stamp-folding', engine: 'stamps', cat: 'paper', name: 'Folding stamps', order: 2,");
lines.push("  blurb: 'A strip of stamps folds into a pile in many orders — but not in every order. Fold it along the perforations into the pile asked for.',");
lines.push("  origin: { year: 1891, who: 'Édouard Lucas, and many puzzlers since', note: " + JSON.stringify('Édouard Lucas asked in 1891 in how many ways a strip of stamps can be folded into a pile. The answers (1, 2, 6, 16, 50, 144, 462 … for one to seven stamps) have been found by listing, but no formula is known. Folding a sheet of eight stamps into a given order is a classic puzzle often credited to Henry Dudeney, and Martin Gardner wrote about the counting problem in his columns.') + ' },');
lines.push("  concepts: ['folding', 'combinatorics']");
lines.push('}, [');
out.forEach((p) => {
  const parts = ['id: ' + JSON.stringify(p.id) + ', title: ' + JSON.stringify(p.title) + ', diff: ' + p.diff + ', par: ' + p.par];
  parts.push('text: ' + JSON.stringify(p.text));
  if (p.hints) parts.push('hints: ' + JSON.stringify(p.hints));
  if (p.explain) parts.push('explain: ' + JSON.stringify(p.explain));
  parts.push('concepts: ' + JSON.stringify(p.concepts) + ', tags: ' + JSON.stringify(p.tags));
  parts.push('data: ' + JSON.stringify(p.data));
  lines.push('  { ' + parts.join(',\n    ') + ' },');
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/stamp-folding.js'), lines.join('\n') + '\n');
const byD = {};
out.forEach((p) => { byD[p.diff] = (byD[p.diff] || 0) + 1; });
console.log('stamp-folding: ' + out.length + ' puzzles; by difficulty ' + JSON.stringify(byD));
