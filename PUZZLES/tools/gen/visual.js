/* The Puzzle Cabinet · tools/gen/visual.js
 *
 *   node tools/gen/visual.js
 *
 * Writes the five visual-reasoning drawers: data/matrices.js, data/what-next.js,
 * data/odd-one-out.js, data/spot-difference.js, data/punched-paper.js.
 * Every puzzle is made by js/lib/visual-gen.js from a fixed seed (so the ids
 * and pictures never change) and checked by the engine's verify(): exactly
 * one candidate obeys the rules. Easiest first; each level cycles through the
 * kinds of rule so a drawer never repeats itself for long.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/visual-gen.js'));
require(path.join(ROOT, 'engines/visual.js'));
const V = C.Visual;
const E = C.engines.visual;

function uniqueTitles() {
  const used = new Map();
  return (pool, rng) => {
    const free = pool.filter((t) => !used.has(t));
    let t;
    if (free.length) t = free[rng.int(free.length)];
    else { const base = pool[rng.int(pool.length)]; const n = (used.get(base) || 1) + 1; used.set(base, n); t = base + ' ' + ['', '', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][n]; }
    if (!used.has(t)) used.set(t, 1);
    return t;
  };
}

function make(fid, prefix, perLevel, makeOne, extra) {
  const out = [], seen = new Set(), title = uniqueTitles();
  let n = 0;
  for (let lv = 1; lv <= 5; lv++) {
    let got = 0;
    for (let i = 0; got < perLevel[lv] && i < perLevel[lv] * 40; i++) {
      const rng = C.rng(C.hash(fid + ':' + lv + ':' + i));
      const d = makeOne(rng, lv, got);
      if (!d) continue;
      const key = JSON.stringify(d);
      if (seen.has(key)) continue;
      const p = { id: prefix + '-' + String(n + 1).padStart(3, '0'), title: title(C.visualTitlePool(d), rng), diff: lv, text: C.visualText(d), data: d };
      if (extra) Object.assign(p, extra(d));
      const r = E.verify(p);
      if (!r.ok) { console.log('  skip ' + fid + ' L' + lv + ': ' + r.err); continue; }
      seen.add(key);
      out.push(p);
      n++; got++;
    }
    if (got < perLevel[lv]) console.log('  ! ' + fid + ' L' + lv + ': only ' + got);
  }
  return out;
}

function write(file, meta, list) {
  const body = '/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/visual.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' +
    list.map((p) => '  ' + JSON.stringify(p)).join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), body);
  const by = [0, 0, 0, 0, 0, 0];
  list.forEach((p) => by[p.diff]++);
  console.log(file + ': ' + list.length + ' puzzles (' + by.slice(1).join(' / ') + '), ' + Math.round(body.length / 1024) + ' KB');
}

// ---------- complete the matrix ----------
const matrices = make('matrices', 'mat', [0, 16, 16, 16, 16, 16], (rng, lv, i) => V.genMatrix(rng, lv, V.MREC[lv][i % V.MREC[lv].length]),
  () => ({ concepts: ['sequence', 'deduction'] }));
write('matrices.js', {
  id: 'matrices', engine: 'visual', cat: 'logic', name: 'Complete the matrix', order: 11,
  blurb: 'Nine pictures in three rows, one missing. Find the rules that run along the rows and pick the picture that obeys them all.',
  origin: { year: 1938, who: 'John C. Raven', note: 'Grids like these became famous through the progressive matrices test the psychologist John C. Raven published in 1938. These are our own designs, made by the computer, which checks that exactly one candidate fits every rule.' },
  concepts: ['sequence', 'deduction']
}, matrices);

// ---------- what comes next ----------
const next = make('what-next', 'next', [0, 10, 10, 10, 10, 10], (rng, lv, i) => V.genNext(rng, lv, V.NREC[lv][i % V.NREC[lv].length]),
  () => ({ concepts: ['sequence'] }));
write('what-next.js', {
  id: 'what-next', engine: 'visual', cat: 'logic', name: 'What comes next?', order: 12,
  blurb: 'Arrows that turn, dots that march round the edge, shapes that take turns: follow the pictures and pick the next one.',
  origin: { who: 'A traditional puzzle', note: 'Picture sequences are a staple of puzzle books and reasoning tests. Every sequence here follows rules the computer checks: no other simple rule fits the pictures shown and points to a different answer.' },
  concepts: ['sequence']
}, next);

// ---------- odd one out ----------
const OCON = { sym: ['symmetry'], chiral: ['symmetry'], parity: ['parity'], sidepar: ['parity'] };
const odd = make('odd-one-out', 'odd', [0, 12, 12, 12, 12, 12], (rng, lv, i) => V.genOdd(rng, lv, V.OTYPES[lv][i % V.OTYPES[lv].length]),
  (d) => ({ concepts: ['deduction'].concat(OCON[d.type] || []) }));
write('odd-one-out.js', {
  id: 'odd-one-out', engine: 'visual', cat: 'logic', name: 'Odd one out', order: 13,
  blurb: 'All the figures but one share something — a count, a mirror line, a hidden match. Which one does not belong?',
  origin: { who: 'A traditional puzzle', note: 'The odd one out is as old as puzzle books. Here the computer makes each set and checks every property it can think of, so that only one figure is singled out.' },
  concepts: ['deduction', 'symmetry', 'parity']
}, odd);

// ---------- spot the difference ----------
const TH = { 1: ['village', 'harbour', 'room'], 2: ['village', 'harbour', 'room'], 3: ['village', 'harbour', 'room', 'tiles'], 4: ['village', 'harbour', 'room', 'tiles'], 5: ['village', 'harbour', 'room', 'tiles'] };
const spot = make('spot-difference', 'spot', [0, 12, 12, 12, 12, 12], (rng, lv, i) => V.genSpot(rng, lv, TH[lv][i % TH[lv].length]));
write('spot-difference.js', {
  id: 'spot-difference', engine: 'visual', cat: 'logic', name: 'Spot the difference', order: 14,
  blurb: 'Two pictures, almost the same: a village, a harbour, a sitting room, a tiled floor. Find every difference and click it.',
  origin: { who: 'A traditional puzzle', note: 'A favourite of newspapers and children\'s magazines. These scenes are drawn by the computer from parts, and every difference is one it made on purpose — so none is an accident of the drawing.' }
}, spot);

// ---------- fold and punch (with mirror images first) ----------
const punched = make('punched-paper', 'punch', [0, 8, 8, 8, 8, 8], (rng, lv, i) => (lv === 1 && i < 4) || (lv === 2 && i < 3) ? V.genMirror(rng, lv) : V.genFold(rng, lv),
  (d) => ({ concepts: d.kind === 'mirror' ? ['symmetry'] : ['folding', 'symmetry'] }));
write('punched-paper.js', {
  id: 'punched-paper', engine: 'visual', cat: 'logic', name: 'Fold and punch', order: 15,
  blurb: 'A square of paper is folded, punched through every layer, and opened out. Where are the holes? Mirror images first, as a warm-up.',
  origin: { who: 'A traditional puzzle', note: 'Folded and punched paper is a classic test of seeing in the mind\'s eye. Every crease is a mirror; the computer unfolds each sheet layer by layer to check the answer.' },
  concepts: ['folding', 'symmetry']
}, punched);
