/* The Puzzle Cabinet · tools/gen/shade.js
 *
 *   node tools/gen/shade.js                 writes all four data files
 *   node tools/gen/shade.js akari takuzu    only these (nonograms, akari, takuzu, star-battle)
 *
 * The making itself is in js/lib/shade-logic.js (the Endless drawers use the
 * same code); here it runs with fixed seeds and a plan of sizes and levels.
 *
 * data/nonograms.js   pictures drawn in tools/gen/shade-pictures.js, letters,
 *                     spirals and inkblots (see tools/gen/shade-nonograms.js)
 * data/akari.js       black cells with half-turn symmetry, bulbs that light
 *                     everything, then numbers taken away while logic of the
 *                     wanted level still solves it
 * data/takuzu.js      a random full grid, then digits taken away the same way
 * data/star-battle.js random regions, nudged cell by cell until exactly one
 *                     star placement fits
 * Every puzzle is graded by the logic it needs and checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/shade-logic.js'));
require(path.join(ROOT, 'engines/shade.js'));
const L = C.shadeLogic;
const E = C.engines.shade;

const want = process.argv.slice(2);
const doIt = (k) => !want.length || want.includes(k);

function writeFamily(file, meta, puzzles) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/shade.js */');
  lines.push('Cabinet.family({');
  Object.keys(meta).forEach((k, i, a) => lines.push('  ' + k + ': ' + JSON.stringify(meta[k]) + (i < a.length - 1 ? ',' : '')));
  lines.push('}, [');
  puzzles.forEach((p, i) => {
    const keys = Object.keys(p).filter((k) => p[k] != null);
    lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(', ') + ' }' + (i < puzzles.length - 1 ? ',' : ''));
  });
  lines.push(']);');
  const out = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data', file), out);
  let bad = 0, slow = 0;
  const t0 = Date.now();
  puzzles.forEach((p) => {
    const s = Date.now();
    const r = E.verify(p);
    if (Date.now() - s > 300) slow++;
    if (!r.ok) { bad++; console.log('  VERIFY FAILED ' + p.id + ': ' + r.err); }
  });
  console.log(file + ': ' + puzzles.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB, verify ' + (Date.now() - t0) + ' ms' + (slow ? ' (' + slow + ' slow)' : '') + (bad ? ', ' + bad + ' FAILED' : ''));
  const byDiff = [0, 0, 0, 0, 0, 0];
  puzzles.forEach((p) => byDiff[p.diff]++);
  console.log('  difficulty 1..5: ' + byDiff.slice(1).join(' / '));
}
const pad3 = (k) => String(k).padStart(3, '0');

function makeMany(label, plan, make) {
  const out = [];
  for (const row of plan) {
    const count = row[row.length - 1];
    let made = 0, tries = 0;
    const t0 = Date.now();
    while (made < count && tries++ < 300) {
      const r = make(row, tries);
      if (!r) continue;
      out.push(r);
      made++;
    }
    console.log('  ' + label + ' ' + JSON.stringify(row.slice(0, -1)) + ': ' + made + '/' + count + ' in ' + tries + ' tries, ' + (Date.now() - t0) + ' ms');
  }
  return out;
}

/* ---------- takuzu ---------- */

function genTakuzu() {
  const rng = C.rng(20260930 + 7);
  // [n, logic level allowed, wanted top level or 0 = any, count]
  const plan = [[6, 1, 1, 5], [6, 2, 2, 3], [8, 1, 1, 4], [8, 2, 2, 4], [8, 3, 3, 3], [10, 1, 1, 2], [10, 2, 2, 4], [10, 3, 3, 4], [10, 4, 4, 3], [12, 2, 2, 3], [12, 3, 3, 3], [12, 4, 4, 2]];
  const out = makeMany('takuzu', plan, ([n, level, top]) => {
    const t = L.tkMake(n, level, rng);
    return t && (!top || t.top === top) ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.n - b.n || a.top - b.top);
  const TITLES = ['Heads or Tails', 'Salt and Pepper', 'Day and Night', 'On and Off', 'Two-Tone', 'Tick and Tock', 'Bits and Bytes', 'Even Stevens',
    'Coin Toss', 'Piano Keys', 'Light Switch', 'Binary Star', 'Double Act', 'Mirror, Mirror', 'Zebra Crossing', 'Black Tie', 'Magpie',
    'Penguin Parade', 'Chessboard', 'Tuxedo', 'Dalmatian', 'Ebony and Ivory', 'Stripes', 'Barcode', 'Half and Half', 'Fifty-Fifty',
    'Balance Sheet', 'Seesaw', 'Equilibrium', 'Yes and No', 'Ones and Zeros', 'Odd One In', 'Pairs Skating', 'Checks and Balances',
    'Tea for Two', 'Two by Two', 'Twin Peaks', 'Noughts', 'Flip-Flop', 'Toggle', 'Either Or', 'Pas de Deux'];
  const puzzles = out.map((t, k) => ({
    id: 'takuzu-' + pad3(k + 1),
    title: TITLES[k] || 'Binary ' + (k + 1),
    diff: t.diff,
    text: E.textFor({ kind: 'takuzu', n: t.n }),
    concepts: ['deduction', 'parity'],
    tags: [t.n + 'x' + t.n, 'binairo', 'binary'],
    data: { kind: 'takuzu', n: t.n, grid: t.grid, sol: t.sol }
  }));
  writeFamily('takuzu.js', {
    id: 'takuzu', engine: 'shade', cat: 'pencil', name: 'Takuzu', order: 22,
    blurb: 'Zeros and ones: never three alike in a row, half of each in every line, and no two lines the same.',
    origin: { year: 2009, who: 'Peter De Schepper and Frank Coussement', note: 'Binary puzzles like these were published as Binairo by two Belgian puzzle makers around 2009; the same rules also go by the names Takuzu and Unruly.' },
    concepts: ['deduction', 'parity']
  }, puzzles);
}

/* ---------- light up ---------- */

function genAkari() {
  const rng = C.rng(20260930 + 11);
  // [w, h, level, density, count]
  const plan = [[7, 7, 1, 0.2, 7], [7, 7, 2, 0.18, 3], [8, 8, 1, 0.2, 4], [8, 8, 2, 0.18, 4], [10, 10, 1, 0.2, 4], [10, 10, 2, 0.17, 7], [12, 12, 1, 0.19, 3], [12, 12, 2, 0.16, 5], [14, 14, 2, 0.16, 4]];
  const out = makeMany('akari', plan, ([w, h, level, dens]) => {
    const a = L.akMake(w, h, rng, dens, level);
    return a && (level === 1 || a.grade.l2 > 0) ? a : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w - b.w || a.grade.l2 - b.grade.l2);
  const TITLES = ['First Light', 'Lantern Alley', 'Candle Count', 'Lamplighter\'s Round', 'Moth Magnet', 'Porch Light', 'Night Shift', 'Glow-worm Lane',
    'The Chandelier', 'Blackout', 'Beacon Hill', 'Streetlamps', 'Torchbearer', 'Fireflies', 'Neon Nights', 'The Lighthouse Keeper', 'Twilight',
    'Spotlight', 'Footlights', 'Paper Lanterns', 'Gaslight Row', 'Flicker', 'Afterglow', 'Wall Sconce', 'Search Party', 'Moonless',
    'Wick and Wax', 'Bright Idea', 'Lumen', 'Candela', 'Filament', 'Tungsten', 'Night Light', 'Chiaroscuro', 'Luminary', 'Incandescent',
    'Dimmer Switch', 'Power Cut', 'Lights Out', 'Dawn Patrol', 'Sunbeam', 'Glowstick'];
  const puzzles = out.map((a, k) => ({
    id: 'akari-' + pad3(k + 1),
    title: TITLES[k] || 'Lights ' + (k + 1),
    diff: a.diff,
    text: E.textFor({ kind: 'akari' }),
    concepts: ['deduction'],
    tags: [a.w + 'x' + a.h, 'akari', 'light up'],
    data: { kind: 'akari', grid: a.grid, sol: a.sol }
  }));
  writeFamily('akari.js', {
    id: 'akari', engine: 'shade', cat: 'pencil', name: 'Light Up', order: 21,
    blurb: 'Light every cell of a dark grid with bulbs that shine along rows and columns, and never on each other.',
    origin: { year: 2001, who: 'Nikoli, Japan', note: 'The Japanese puzzle publisher Nikoli made Akari (“light”) one of its regular puzzles around 2001; in English it is called Light Up.' },
    concepts: ['deduction']
  }, puzzles);
}

/* ---------- star battle ---------- */

function genStarBattle() {
  const rng = C.rng(20260930 + 23);
  // [n, stars, count]
  const plan = [[5, 1, 5], [6, 1, 7], [7, 1, 6], [8, 1, 6], [9, 2, 3], [10, 2, 4]];
  const out = makeMany('star battle', plan, ([n, s]) => L.sbMake(n, s, rng, 1500));
  out.sort((a, b) => a.diff - b.diff || a.n - b.n || a.grade.top - b.grade.top);
  const TITLES = ['Twinkle', 'North Star', 'Orion\'s Belt', 'Little Dipper', 'Pleiades', 'Cassiopeia', 'Southern Cross', 'Night Sky', 'Stargazer',
    'Shooting Star', 'Supernova', 'Galaxy', 'Nebula', 'Starfish', 'Star Anise', 'Starling', 'Stardust', 'Lodestar', 'Morning Star',
    'Evening Star', 'Comet Tail', 'Meteor Shower', 'Planetarium', 'Observatory', 'Telescope', 'Zodiac', 'Polaris', 'Sirius Business',
    'Vega', 'Constellation', 'Milky Way', 'Big Dipper'];
  const puzzles = out.map((t, k) => ({
    id: 'star-' + pad3(k + 1),
    title: TITLES[k] || 'Stars ' + (k + 1),
    diff: t.diff,
    text: E.textFor({ kind: 'starbattle', stars: t.s, regions: t.regions }),
    concepts: ['deduction', 'pigeonhole'],
    tags: [t.n + 'x' + t.n, t.s + ' star' + (t.s > 1 ? 's' : ''), 'star battle'],
    data: { kind: 'starbattle', stars: t.s, regions: t.regions, sol: t.sol }
  }));
  writeFamily('star-battle.js', {
    id: 'star-battle', engine: 'shade', cat: 'pencil', name: 'Star Battle', order: 23,
    blurb: 'One star (or two) in every row, column and region, and no two stars touching.',
    origin: { year: 2003, who: 'Hans Eendebak', note: 'Star Battle was invented by the Dutch puzzle maker Hans Eendebak in 2003 and has become a favourite of puzzle championships.' },
    concepts: ['deduction', 'pigeonhole']
  }, puzzles);
}

if (doIt('takuzu')) genTakuzu();
if (doIt('akari')) genAkari();
if (doIt('star-battle')) genStarBattle();
if (doIt('nonograms')) require('./shade-nonograms.js').run({ C, L, E, writeFamily, pad3 });
