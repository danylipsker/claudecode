/* The Puzzle Cabinet · tools/gen/latin.js
 *
 *   node tools/gen/latin.js                 writes data/sudoku.js, kenken.js, futoshiki.js, skyscrapers.js
 *   node tools/gen/latin.js sudoku kenken   only those
 *
 * The puzzles come from js/lib/latin-make.js — the same maker the engine uses
 * for its Endless drawers — driven here with fixed seeds and a plan of sizes
 * and difficulties. Every puzzle starts as a random Latin square; clues are
 * taken away while the human-style solver (js/lib/latin-logic.js) can still
 * finish without guessing, so each has exactly one solution. The difficulty
 * is graded by the hardest technique needed (and the size, for the kinds
 * without boxes). Re-running gives the same puzzles and ids.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/latin-logic.js'));
require(path.join(ROOT, 'js/lib/latin-make.js'));
const L = C.Latin, M = L.make;

const only = process.argv.slice(2);
const want = (k) => !only.length || only.includes(k);

/* ---------- writing ---------- */

function write(file, meta, puzzles, extra) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/latin.js */');
  lines.push('Cabinet.family(' + JSON.stringify(meta, null, 2).replace(/\n\s*/g, ' ') + ', [');
  puzzles.forEach((p, k) => {
    const keys = Object.keys(p).filter((key) => p[key] != null);
    lines.push('  { ' + keys.map((key) => key + ': ' + JSON.stringify(p[key])).join(',\n    ') + ' }' + (k < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  if (extra) lines.push(extra);
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), out);
  console.log('data/' + file + ': ' + puzzles.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB');
}

function spread(list) {
  const c = {};
  list.forEach((p) => { c[p.diff] = (c[p.diff] || 0) + 1; });
  return JSON.stringify(c);
}

// easiest first; then smaller grids; ids and numbered titles in that order
function finish(prefix, got) {
  const vOrder = (d) => (d.regions ? 2 : d.diag ? 1 : 0);
  got.sort((a, b) => a.diff - b.diff || a.d.n - b.d.n || vOrder(a.d) - vOrder(b.d));
  const counters = {};
  return got.map((x, k) => {
    const w = M.words(x.d, x.diff);
    counters[w.title] = (counters[w.title] || 0) + 1;
    return {
      id: prefix + '-' + String(k + 1).padStart(3, '0'),
      title: w.title + ' no. ' + counters[w.title],
      diff: x.diff,
      text: w.text,
      tags: w.tags.concat(M.techTags(x.r)),
      data: x.d
    };
  });
}

/* ---------- making by plan ---------- */

// plan rows: [spec, how many]; each spec says what once() needs and what diff to keep
function byPlan(kind, seed, plan, maxTries) {
  const rng = C.rng(seed);
  const got = [], seen = new Set();
  for (const [spec, count, keepDiff] of plan) {
    let n = 0, tries = 0;
    const t0 = Date.now();
    while (n < count && tries++ < maxTries) {
      const x = M.once(kind, rng, spec);
      if (!x || (keepDiff && x.diff !== keepDiff)) continue;
      const key = JSON.stringify(x.d);
      if (seen.has(key)) continue;
      seen.add(key);
      got.push(x);
      n++;
    }
    console.log('  ' + kind + ' ' + JSON.stringify(spec) + (keepDiff ? ' diff ' + keepDiff : '') + ': ' + n + '/' + count + ' (' + tries + ' tries, ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
  }
  return got;
}

function makeSudoku() {
  const S = (n, diff, variant, sym) => ({ n, diff, variant: variant || '', sym });
  const plan = [
    [S(4, 1), 14],
    [S(6, 1), 8], [S(6, 2), 12], [S(6, 3, '', false), 10],
    [S(9, 1), 10], [S(9, 2), 14], [S(9, 3), 14], [S(9, 4), 12], [S(9, 5), 6],
    [S(6, 1, 'jigsaw'), 1], [S(6, 2, 'jigsaw'), 2], [S(6, 3, 'jigsaw'), 2], [S(9, 2, 'jigsaw'), 2], [S(9, 3, 'jigsaw'), 2], [S(9, 4, 'jigsaw'), 1],
    [S(6, 2, 'diag'), 2], [S(6, 3, 'diag', false), 1], [S(9, 1, 'diag'), 1], [S(9, 2, 'diag'), 1], [S(9, 3, 'diag'), 2], [S(9, 4, 'diag'), 2], [S(9, 5, 'diag'), 1]
  ];
  const puzzles = finish('sudoku', byPlan('sudoku', 1979, plan, 6000));
  console.log('sudoku: ' + puzzles.length + ' ' + spread(puzzles));
  return puzzles;
}

function makeKenKen() {
  // KenKen cannot aim at a level while it is made (the cages decide), so each row keeps one difficulty
  const K = (n, style) => ({ n, style });
  const plan = [
    [K(4, 'easy'), 8, 1], [K(4, 'mid'), 5, 2],
    [K(5, 'easy'), 5, 1], [K(5, 'mid'), 6, 2], [K(5, 'hard'), 4, 3],
    [K(6, 'easy'), 5, 2], [K(6, 'mid'), 6, 3], [K(6, 'hard'), 5, 4],
    [K(7, 'easy'), 3, 2], [K(7, 'mid'), 6, 3], [K(7, 'hard'), 6, 5]
  ];
  const puzzles = finish('kenken', byPlan('kenken', 2004, plan, 40000));
  console.log('kenken: ' + puzzles.length + ' ' + spread(puzzles));
  return puzzles;
}

function makeFutoshiki() {
  const F = (n, level) => ({ n, level });
  const plan = [
    [F(4, 1), 6], [F(4, 2), 4],
    [F(5, 1), 5], [F(5, 2), 5], [F(5, 3), 3],
    [F(6, 1), 4], [F(6, 2), 5], [F(6, 3), 4], [F(6, 4), 1],
    [F(7, 1), 3], [F(7, 2), 4], [F(7, 3), 4], [F(7, 4), 2]
  ];
  const puzzles = finish('futoshiki', byPlan('futoshiki', 2001, plan, 400));
  console.log('futoshiki: ' + puzzles.length + ' ' + spread(puzzles));
  return puzzles;
}

function makeSkyscrapers() {
  const F = (n, level) => ({ n, level });
  const plan = [
    [F(4, 1), 8], [F(4, 2), 6],
    [F(5, 1), 5], [F(5, 2), 7], [F(5, 3), 5],
    [F(6, 1), 3], [F(6, 2), 6], [F(6, 3), 6], [F(6, 4), 4]
  ];
  const puzzles = finish('skyscrapers', byPlan('skyscrapers', 1885, plan, 400));
  console.log('skyscrapers: ' + puzzles.length + ' ' + spread(puzzles));
  return puzzles;
}

/* ---------- the families ---------- */

const FAMILIES = {
  sudoku: {
    file: 'sudoku.js', make: makeSudoku,
    meta: {
      id: 'sudoku', engine: 'latin', cat: 'pencil', name: 'Sudoku', order: 1,
      blurb: 'Every row, column and box holds each digit once. Small 4×4 and 6×6 grids to begin, the classic 9×9 from gentle to fiendish, with jigsaw and diagonal variants along the way.',
      origin: { year: 1979, who: 'Howard Garns', note: 'Latin squares go back to Leonhard Euler. The puzzle itself appeared as Number Place in Dell\'s puzzle magazines in 1979, devised by Howard Garns; the Japanese publisher Nikoli took it up in 1984 under the name Sudoku, and in the mid-2000s it went round the world.' },
      concepts: ['latin-square', 'exact-cover', 'deduction']
    },
    extra: 'Cabinet.history([{ year: 1782, title: \'Euler\\\'s thirty-six officers\', text: \'Leonhard Euler asks whether 36 officers of six ranks and six regiments can stand in a 6 × 6 square with no rank and no regiment repeated in any row or column. On the way he studies Latin squares, the skeleton of every Sudoku; the answer — it cannot be done — was proved only in 1901.\', links: [\'sudoku\'] }]);'
  },
  kenken: {
    file: 'kenken.js', make: makeKenKen,
    meta: {
      id: 'kenken', engine: 'latin', cat: 'pencil', name: 'KenKen', order: 2,
      blurb: 'A Latin square with arithmetic: the digits in every outlined cage must make its number with its sign.',
      origin: { year: 2004, who: 'Tetsuya Miyamoto', note: 'The Japanese mathematics teacher Tetsuya Miyamoto invented these cage puzzles in 2004 to sharpen his pupils\' arithmetic and reasoning. They are also known as Calcudoku, and Simon Tatham\'s collection has them as Keen.' },
      concepts: ['latin-square', 'deduction']
    },
    extra: 'Cabinet.history([{ year: 2004, title: \'KenKen\', text: \'Tetsuya Miyamoto, a mathematics teacher in Japan, invents a Latin square with arithmetic cages to train his pupils in calculation and patient reasoning.\', links: [\'kenken\'] }]);'
  },
  futoshiki: {
    file: 'futoshiki.js', make: makeFutoshiki,
    meta: {
      id: 'futoshiki', engine: 'latin', cat: 'pencil', name: 'Futoshiki', order: 3,
      blurb: 'A Latin square with signs between neighbours: this one bigger, that one smaller — and a few digits to start from.',
      origin: { who: 'Japanese puzzle magazines', note: 'Futoshiki is Japanese for "inequality". The puzzle comes from Japan in the early 2000s; Simon Tatham\'s collection calls it Unequal.' },
      concepts: ['latin-square', 'deduction']
    }
  },
  skyscrapers: {
    file: 'skyscrapers.js', make: makeSkyscrapers,
    meta: {
      id: 'skyscrapers', engine: 'latin', cat: 'pencil', name: 'Skyscrapers', order: 4,
      blurb: 'Build a town of towers so that from every clue on the edge you see exactly that many roofs.',
      origin: { who: 'Puzzle magazines', note: 'A Latin square in disguise: every row and column is a street of buildings of different heights, and each clue counts the roofs you can see from its end. It is a favourite at logic-puzzle championships; Simon Tatham\'s collection has it as Towers.' },
      concepts: ['latin-square', 'deduction']
    }
  }
};

if (require.main === module) {
  const t0 = Date.now();
  for (const key of Object.keys(FAMILIES)) {
    if (!want(key)) continue;
    const F = FAMILIES[key];
    write(F.file, F.meta, F.make(), F.extra);
  }
  console.log('done in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
}

module.exports = { FAMILIES };
