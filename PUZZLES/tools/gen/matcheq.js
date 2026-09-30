/* The Puzzle Cabinet · tools/gen/matcheq.js
 *
 *   node tools/gen/matcheq.js        writes data/matchstick-equations.js and data/roman-matches.js
 *
 * From every true equation of a set of forms (single digits, two-digit
 * numbers, three terms, ×; Roman sums and differences), every way of undoing
 * one change (moving, adding or taking away one match) is tried, and double
 * moves are sampled; a start that reads as a false equation and has exactly
 * one answer becomes a candidate. Fewer changes never work (checked by the
 * engine). Candidates are graded with the engine's own measure and a spread
 * is kept, easiest first. The Endless drawers use the same engine code.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/matches.js'));
require(path.join(ROOT, 'engines/matcheq.js'));
const Q = C.matcheq;
const ENG = C.engines.matcheq;

// every true equation of a form (digits: all numbers; Roman: numbers 1..limit)
function allTrue(form, mode, limit) {
  const out = [];
  if (mode === 'roman') {
    const parts = form.split(/([+\-=])/);
    const op = parts[1] === '=' ? parts[3] : parts[1];
    for (let a = 1; a <= limit; a++) for (let b = 1; b <= limit; b++) {
      const c = op === '+' ? a + b : a - b;
      if (parts.length === 3) { if (a === b) out.push(Q.roman(a) + '=' + Q.roman(b)); continue; }
      if (c < 1 || c > limit + 10) continue;
      out.push(parts[1] === '=' ? Q.roman(c) + '=' + Q.roman(a) + op + Q.roman(b) : Q.roman(a) + op + Q.roman(b) + '=' + Q.roman(c));
    }
    return out;
  }
  // digits: fill every number place, keep the true ones
  const places = [];
  for (let i = 0; i < form.length; i++) if (form[i] === 'd') places.push(i);
  const groups = [];
  let cur = null;
  for (let i = 0; i < form.length; i++) {
    if (form[i] === 'd') { if (!cur) { cur = []; groups.push(cur); } cur.push(i); } else cur = null;
  }
  const ranges = groups.map((g) => (g.length === 1 ? [0, 9] : [10, 99]));
  const rec = (gi, vals) => {
    if (gi === groups.length) {
      let s = form.split('');
      groups.forEach((g, k) => { const str = String(vals[k]); g.forEach((pos, j) => { s[pos] = str[j]; }); });
      s = s.join('');
      const cells = Q.cellsOf(s, 'digits');
      const J = Q.judge(cells, Q.masksOf(s, cells), 'digits');
      if (J.valid && J.true) out.push(s);
      return;
    }
    for (let v = ranges[gi][0]; v <= ranges[gi][1]; v++) { vals.push(v); rec(gi + 1, vals); vals.pop(); }
  };
  rec(0, []);
  return out;
}

// every start one change away from T (or a sample of two changes), with its facts
function startsFrom(T, mode, kind, k, rng, samples) {
  const eqT = mode === 'roman' ? Q.padRoman(T) : T;
  const cells = Q.cellsOf(eqT, mode);
  const mT = Q.masksOf(eqT, cells);
  const { full, empty } = Q.slots(cells, mT);
  const out = [];
  const seen = new Set();
  const tog = (m, s) => { m[s >> 3] ^= 1 << (s & 7); };
  const tryM = (m) => {
    const J = Q.judge(cells, m, mode);
    if (!J.valid || J.true) return;
    let eq = Q.show(cells, m), sol = eqT;
    if (mode === 'roman') [eq, sol] = Q.trimRoman(eq, sol);
    if (seen.has(eq)) return;
    seen.add(eq);
    const P = Q.checkPuzzle(eq, sol, mode, kind, k, { unique: true });
    if (P) out.push(P);
  };
  if (k === 1) {
    const m = mT.slice();
    if (kind === 'move') full.forEach((a) => empty.forEach((b) => { tog(m, a); tog(m, b); tryM(m); tog(m, a); tog(m, b); }));
    else if (kind === 'remove') empty.forEach((b) => { tog(m, b); tryM(m); tog(m, b); });
    else full.forEach((a) => { tog(m, a); tryM(m); tog(m, a); });
  } else {
    // two moves: every pair of lifted matches and every pair of empty places; keep the readable false ones, then check a sample
    const m = mT.slice();
    const found = new Map();
    const pairs = (list) => { const o = []; for (let i = 0; i < list.length; i++) for (let j = i + 1; j < list.length; j++) o.push([list[i], list[j]]); return o; };
    const P2 = pairs(full), E2 = pairs(empty);
    P2.forEach((f) => E2.forEach((e) => {
      f.forEach((s) => tog(m, s)); e.forEach((s) => tog(m, s));
      const J = Q.judge(cells, m, mode);
      if (J.valid && !J.true) { const key = Q.show(cells, m); if (!found.has(key)) found.set(key, m.slice()); }
      f.forEach((s) => tog(m, s)); e.forEach((s) => tog(m, s));
    }));
    rng.shuffle(Array.from(found.values())).slice(0, samples).forEach(tryM);
  }
  return out;
}

function collect(mode, specs, rng) {
  const all = new Map();
  specs.forEach(([form, kind, k, share, limit]) => {
    let Ts = allTrue(form, mode, limit || 20);
    if (share < 1) Ts = rng.shuffle(Ts).slice(0, Math.max(1, Math.round(Ts.length * share)));
    Ts.forEach((T) => startsFrom(T, mode, kind, k, rng, 25).forEach((P) => {
      if (!all.has(P.eq)) all.set(P.eq, Object.assign(P, { form }));
    }));
  });
  return Array.from(all.values());
}

function pick(cands, quota, rng) {
  const chosen = [];
  for (let lv = 1; lv <= 5; lv++) {
    const pool = rng.shuffle(cands.filter((c) => c.diff === lv));
    // round-robin over (form, rule) so the drawer is varied
    const groups = new Map();
    pool.forEach((c) => { const key = c.form + c.kind + c.k; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(c); });
    let got = 0;
    while (got < quota[lv]) {
      let any = false;
      for (const list of groups.values()) {
        if (got >= quota[lv] || !list.length) continue;
        chosen.push(list.shift()); got++; any = true;
      }
      if (!any) break;
    }
  }
  return chosen.sort((a, b) => a.diff - b.diff || a.score - b.score);
}

function write(file, meta, prefix, chosen, extra, rng, pre) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/matcheq.js */');
  if (pre) lines.push(pre);
  lines.push('Cabinet.family(' + meta + ', [');
  const emit = (p) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(', ') + ' },');
  };
  const hist = [0, 0, 0, 0, 0, 0], kinds = {};
  const titles = new Set();
  const list = extra.concat(chosen.map((P, i) => Object.assign({ id: prefix + String(i + 1).padStart(3, '0') }, Q.puzzleOf(P, rng, P.diff), { tags: [P.kind, P.k === 2 ? 'two moves' : 'one match'] })));
  list.forEach((p) => {
    const v = ENG.verify(p);
    if (!v.ok) throw new Error(p.id + ' ' + p.title + ': ' + v.err);
    if (titles.has(p.title)) throw new Error('duplicate title ' + p.title);
    titles.add(p.title);
    hist[p.diff]++;
    const r = Q.ruleOf(p.data);
    kinds[r.kind + r.k] = (kinds[r.kind + r.k] || 0) + 1;
    emit(p);
  });
  lines.push(']);');
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), out);
  console.log(file + ': ' + list.length + ' puzzles; levels ' + hist.slice(1).join('/') + '; ' + JSON.stringify(kinds) + '; ' + Math.round(out.length / 1024) + ' KB');
}

const SEVEN = "Cabinet.concepts([\n  { id: 'seven-segment', name: 'Seven-stroke digits', see: ['lateral'],\n    text: 'The digits of a pocket calculator or a digital clock are drawn with at most seven strokes: three across (top, middle and bottom) and four upright ones at the corners. An 8 uses all seven, a 1 only two. Because every digit is a set of strokes, digits live in families a single stroke apart: moving one stroke turns 6 into 0 or 9 and 3 into 2 or 5; adding one turns 5 into 6 or 9, 1 into 7, 3 into 9, and 0, 6 or 9 into 8. Every matchstick sum is built on these families — and on the plus sign, which is a minus with one more match.' }\n]);";
const ROMAN = "Cabinet.concepts([\n  { id: 'roman-numerals', name: 'Roman numerals', see: ['lateral'],\n    text: 'The Romans wrote numbers with letters: I is one, V five, X ten, L fifty, C a hundred. The letters are added from the largest down — XVII is ten, five and two ones — except that a smaller letter just before a larger one is taken away from it: IV is four, IX nine, XL forty. The Romans themselves were not strict about this (clock faces still show IIII), but these puzzles accept only the usual modern forms. Made of matches, I is one stroke and V, X and L two each, so a single match can change a number a great deal.' }\n]);";

function digits() {
  const rng = C.rng(20260930);
  const specs = [
    ['d+d=d', 'move', 1, 1], ['d-d=d', 'move', 1, 1], ['d=d+d', 'move', 1, 1], ['d=d-d', 'move', 1, 1],
    ['d+d=dd', 'move', 1, 1], ['dd-d=d', 'move', 1, 1], ['dxd=d', 'move', 1, 1], ['dxd=dd', 'move', 1, 1],
    ['dd+d=dd', 'move', 1, 0.5], ['dd-d=dd', 'move', 1, 0.5], ['dd+dd=dd', 'move', 1, 0.08], ['d+d+d=d', 'move', 1, 1], ['d+d-d=d', 'move', 1, 1], ['d-d+d=d', 'move', 1, 1],
    ['d+d=d', 'remove', 1, 1], ['d-d=d', 'remove', 1, 1], ['d+d=dd', 'remove', 1, 1], ['dd-d=d', 'remove', 1, 1], ['d+d+d=d', 'remove', 1, 1],
    ['d+d=d', 'add', 1, 1], ['d-d=d', 'add', 1, 1], ['d+d=dd', 'add', 1, 1], ['dd-d=d', 'add', 1, 1], ['d+d+d=d', 'add', 1, 1],
    ['d+d=d', 'move', 2, 1], ['d-d=d', 'move', 2, 1], ['d=d+d', 'move', 2, 0.5], ['d+d=dd', 'move', 2, 0.5], ['dd-d=d', 'move', 2, 0.3], ['d+d+d=d', 'move', 2, 0.15]
  ];
  const cands = collect('digits', specs, rng);
  const t = {};
  cands.forEach((c) => { const k = c.diff + c.kind + c.k; t[k] = (t[k] || 0) + 1; });
  console.log('digits: ' + cands.length + ' candidates ' + JSON.stringify(t));
  const classics = [
    { id: 'meq-six-four', title: '6 + 4 = 4', diff: 1, source: 'A traditional matchstick sum.', text: 'The most famous of the matchstick sums. Move one match to make it true — there is more than one way.', explain: 'Take the middle bar of the 6 and put it on the upper right: the 6 becomes 0, and 0 + 4 = 4. Or take the upright of the plus and put it on the 6 to make an 8: 8 − 4 = 4. Either will do.', data: { eq: '6+4=4', sol: '0+4=4', move: 1 }, tags: ['move', 'classic'] }
  ];
  const chosen = pick(cands.filter((c) => !classics.some((k) => k.data.eq === c.eq)), [0, 34, 50, 56, 40, 20], rng);
  write('matchstick-equations.js',
    "{\n  id: 'matchstick-equations', engine: 'matcheq', cat: 'matches', name: 'Mend the sum', order: 3,\n  blurb: 'Sums written in matches, and all of them wrong. Move, take away or add a match to make each one true.',\n  origin: { who: 'Traditional puzzles, computer-made variants', note: 'Sums made of matches in the seven-stroke digits of a pocket calculator became a favourite in the late twentieth century. These were made by the Cabinet from every true sum of their kind; each has exactly one answer (apart from the first, the famous one) and cannot be mended with fewer matches.' },\n  concepts: ['lateral', 'seven-segment']\n}",
    'meq-', chosen, classics, rng, SEVEN);
}

function romans() {
  const rng = C.rng(1893);
  const specs = [
    ['r+r=r', 'move', 1, 1, 20], ['r-r=r', 'move', 1, 1, 20], ['r=r+r', 'move', 1, 1, 20], ['r=r-r', 'move', 1, 1, 20], ['r=r', 'move', 1, 1, 30],
    ['r+r=r', 'remove', 1, 1, 15], ['r-r=r', 'remove', 1, 1, 15], ['r+r=r', 'add', 1, 1, 15], ['r-r=r', 'add', 1, 1, 15],
    ['r+r=r', 'move', 2, 0.4, 12], ['r-r=r', 'move', 2, 0.4, 12]
  ];
  const cands = collect('roman', specs, rng);
  const t = {};
  cands.forEach((c) => { const k = c.diff + c.kind + c.k; t[k] = (t[k] || 0) + 1; });
  console.log('roman: ' + cands.length + ' candidates ' + JSON.stringify(t));
  const classics = [
    { id: 'roman-eleven', title: 'XI + I = X', diff: 1, source: 'A traditional Roman-numeral match puzzle.', text: 'Eleven and one make ten, says this sum. Move one match to make it true.', explain: 'Move the I of XI to the other side of the equals sign: X + I = XI. Ten and one make eleven.', data: { mode: 'roman', eq: 'XI+I=X_', sol: 'X_+I=XI', move: 1 }, tags: ['move', 'classic'] }
  ];
  const chosen = pick(cands.filter((c) => !classics.some((k) => k.data.eq === c.eq)), [0, 6, 10, 11, 8, 4], rng);
  write('roman-matches.js',
    "{\n  id: 'roman-matches', engine: 'matcheq', cat: 'matches', name: 'Roman sums', order: 4,\n  blurb: 'I, V, X and L made of matches: move, take away or add a match to make each Roman sum true.',\n  origin: { who: 'Traditional puzzles, computer-made variants', note: 'Roman numerals are made of straight strokes, which makes them perfect for matches: an I becomes a V, a V an X, with a match or two. Each of these has exactly one answer and cannot be mended with fewer matches.' },\n  concepts: ['lateral', 'roman-numerals']\n}",
    'roman-', chosen, classics, rng, ROMAN);
}

if (require.main === module) {
  const t0 = Date.now();
  if (!process.argv.includes('--roman')) digits();
  if (!process.argv.includes('--digits')) romans();
  console.log((Date.now() - t0) / 1000 + ' s');
}
