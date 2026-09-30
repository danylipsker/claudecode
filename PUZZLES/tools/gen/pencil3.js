/* The Puzzle Cabinet · tools/gen/pencil3.js
 *
 *   node tools/gen/pencil3.js                      writes all five data files
 *   node tools/gen/pencil3.js lits heyawake        only these (number-path, norinori, lits, heyawake, yajilin)
 *
 * The making itself is in js/lib/pencil3-logic.js (the Endless drawers use the
 * same code); here it runs with fixed seeds and a plan of sizes and levels.
 *
 * data/number-path.js  a random chain through every cell (rectangles, and
 *                      shapes for the king-wise ones), then numbers taken
 *                      away while logic of the wanted level still finishes it
 * data/norinori.js     dominoes that never touch side by side, paired into
 *                      regions, cells moved between regions until logic
 *                      finds exactly those dominoes
 * data/lits.js         a chain of tetrominoes, a region round each, the same
 *                      nudging
 * data/heyawake.js     rectangular rooms, a legal shading, every room
 *                      numbered, then numbers taken away
 * data/yajilin.js      a loop grown by bumps, the cells it misses shaded or
 *                      made clue cells, clues adjusted until logic finishes
 * Every puzzle is graded by the logic it needs and checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/pencil3-logic.js'));
require(path.join(ROOT, 'engines/pencil3.js'));
const L = C.pencil3Logic;
const E = C.engines.pencil3;

const want = process.argv.slice(2);
const doIt = (k) => !want.length || want.includes(k);

function writeFamily(file, meta, puzzles) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/pencil3.js */');
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
  let bad = 0, slow = 0, worst = 0;
  const t0 = Date.now();
  puzzles.forEach((p) => {
    const s = Date.now();
    const r = E.verify(p);
    const dt = Date.now() - s;
    worst = Math.max(worst, dt);
    if (dt > 300) slow++;
    if (!r.ok) { bad++; console.log('  VERIFY FAILED ' + p.id + ': ' + r.err); }
  });
  console.log(file + ': ' + puzzles.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB, verify ' + (Date.now() - t0) + ' ms (worst ' + worst + ')' + (slow ? ' (' + slow + ' slow)' : '') + (bad ? ', ' + bad + ' FAILED' : ''));
  const byDiff = [0, 0, 0, 0, 0, 0];
  puzzles.forEach((p) => byDiff[p.diff]++);
  console.log('  difficulty 1..5: ' + byDiff.slice(1).join(' / '));
}
const pad3 = (k) => String(k).padStart(3, '0');

// run a plan: rows [..., count]; make(row, try) returns a puzzle or null
function makeMany(label, plan, make) {
  const out = [];
  for (const row of plan) {
    const count = row[row.length - 1];
    let made = 0, tries = 0;
    const t0 = Date.now();
    while (made < count && tries++ < 400) {
      const r = make(row, tries);
      if (!r) continue;
      out.push(r);
      made++;
    }
    console.log('  ' + label + ' ' + JSON.stringify(row.slice(0, -1)) + ': ' + made + '/' + count + ' in ' + tries + ' tries, ' + (Date.now() - t0) + ' ms');
  }
  return out;
}
function titled(list, titles, fallback) {
  if (list.length > titles.length) console.log('  (only ' + titles.length + ' titles for ' + list.length + ' puzzles)');
  return list.map((x, k) => titles[k] || fallback + ' ' + (k + 1));
}

/* ---------- number path ---------- */

// shapes for the king-wise chains ('#' a cell)
const SHAPES = {
  diamond: ['...#...', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...'],
  heart: ['.##...##.', '####.####', '#########', '#########', '.#######.', '..#####..', '...###...', '....#....'],
  ring: ['########', '########', '########', '###..###', '###..###', '########', '########', '########'],
  plus: ['...###...', '...###...', '...###...', '#########', '#########', '#########', '...###...', '...###...', '...###...'],
  house: ['....#....', '...###...', '..#####..', '.#######.', '#########', '.##...##.', '.##...##.', '.#######.'],
  hourglass: ['#######', '.#####.', '..###..', '...#...', '..###..', '.#####.', '#######'],
  arrow: ['...#....', '...##...', '########', '#########', '########', '...##...', '...#....'],
  bowtie: ['##.....##', '###...###', '####.####', '#########', '####.####', '###...###', '##.....##']
};

function genNumberPath() {
  const rng = C.rng(20260930 + 101);
  // [w, h, adj, logic level, shape or '', count]
  const plan = [
    [5, 5, 8, 1, '', 4], [6, 6, 4, 1, '', 4], [7, 7, 8, 1, 'diamond', 1], [6, 6, 8, 1, '', 2],
    [7, 7, 8, 2, '', 4], [7, 7, 4, 2, '', 4], [9, 8, 8, 2, 'heart', 1], [7, 7, 8, 2, 'hourglass', 1],
    [8, 8, 8, 3, '', 5], [8, 8, 4, 3, '', 4], [8, 8, 8, 3, 'ring', 1], [9, 9, 8, 3, 'plus', 1], [8, 7, 8, 3, 'arrow', 1],
    [9, 9, 8, 3, '', 3], [9, 9, 4, 3, '', 3], [9, 8, 8, 4, 'house', 1], [9, 7, 8, 4, 'bowtie', 1], [9, 9, 8, 4, '', 2],
    [10, 10, 8, 4, '', 3], [10, 10, 4, 4, '', 3]
  ];
  const out = makeMany('number path', plan, ([w, h, adj, level, shape]) => {
    const on = new Uint8Array(w * h);
    if (shape) SHAPES[shape].forEach((row, r) => { for (let c = 0; c < w; c++) if (row[c] === '#') on[r * w + c] = 1; });
    else on.fill(1);
    const P = L.npBase(w, h, on, adj);
    const m = L.npMake(P, rng, level, { ends: adj === 8, extra: level === 1 ? 2 : 0 });
    if (!m || (level >= 2 && m.grade.top < level)) return null;
    return { w, h, adj, shape, m };
  });
  out.sort((a, b) => a.m.diff - b.m.diff || a.w * a.h - b.w * b.h || a.m.grade.top - b.m.grade.top);
  const TITLES = ['First Steps', 'One, Two, Buckle My Shoe', 'Stepping Stones', 'Counting Sheep', 'Hopscotch', 'Breadcrumbs', 'Join the Dots',
    'Roll Call', 'The Diamond Walk', 'Daisy Chain', 'Head Count', 'King\'s Walk', 'Rook\'s Round', 'Paper Trail', 'Conga Line', 'Snail Trail',
    'Treasure Trail', 'Heart of the Matter', 'Hourglass', 'Follow the Leader', 'Ariadne\'s Thread', 'String of Beads', 'Abacus', 'Caterpillar',
    'Garden Path', 'Serpentine', 'Meander', 'Zigzag', 'The Doughnut', 'Crossroads', 'Signal Arrow', 'Slalom', 'Tightrope', 'Pilgrim\'s Way',
    'Boustrophedon', 'Relay Race', 'Chain Letter', 'Ant Line', 'Centipede', 'Home Sweet Home', 'Bow Tie', 'Paperchase', 'Long Way Round',
    'Grand March', 'Marathon', 'Millipede', 'The Century', 'Clockwork', 'Labyrinth of Numbers', 'Grand Tour'];
  const shapeTitle = { diamond: 'The Diamond Walk', heart: 'Heart of the Matter', ring: 'The Doughnut', plus: 'Crossroads', house: 'Home Sweet Home', hourglass: 'Hourglass', arrow: 'Signal Arrow', bowtie: 'Bow Tie' };
  const plain = TITLES.filter((t) => !Object.values(shapeTitle).includes(t));
  let pk = 0;
  const puzzles = out.map((x, k) => {
    const d = { kind: 'numpath', w: x.w, h: x.h, adj: x.adj, given: x.m.given, sol: x.m.sol };
    const n = x.m.sol.filter((v) => v > 0).length;
    const title = x.shape ? shapeTitle[x.shape] : plain[pk++] || 'Chain of ' + n;
    return {
      id: 'numpath-' + pad3(k + 1),
      title,
      diff: x.m.diff,
      text: E.textFor(d),
      goal: E.goalFor(d),
      concepts: x.adj === 4 ? ['graph', 'parity', 'deduction'] : ['graph', 'hamilton', 'deduction'],
      tags: [x.w + 'x' + x.h, x.adj === 8 ? 'king steps' : 'side steps', 'number chain'].concat(x.shape ? ['shape'] : []),
      data: d
    };
  });
  // titles must stay unique
  const seen = new Set();
  puzzles.forEach((p, k) => { if (seen.has(p.title)) p.title = p.title + ' ' + (k + 1); seen.add(p.title); });
  writeFamily('number-path.js', {
    id: 'number-path', engine: 'pencil3', cat: 'pencil', name: 'Number path', order: 60,
    blurb: 'Write 1 to n so that each number touches the next: one chain through every cell.',
    origin: { who: 'Gyora Benedek; Marilyn vos Savant', note: 'Chains of numbers like these became newspaper favourites in the late 2000s: the Israeli mathematician Gyora Benedek\'s puzzles let the chain step like a chess king, Marilyn vos Savant\'s in Parade magazine only side by side. Underneath, both ask for a path that visits every cell once — a Hamilton path.' },
    concepts: ['graph', 'hamilton', 'parity', 'deduction']
  }, puzzles);
}

/* ---------- norinori ---------- */

function genNorinori() {
  const rng = C.rng(20260930 + 103);
  // [w, h, logic level, wanted top (0 any), count]
  const plan = [[6, 6, 2, 0, 7], [7, 7, 2, 0, 5], [7, 7, 3, 3, 2], [8, 8, 2, 2, 4], [8, 8, 3, 3, 5], [9, 9, 3, 3, 6], [10, 10, 3, 3, 7], [12, 12, 3, 3, 4]];
  const out = makeMany('norinori', plan, ([w, h, level, top]) => {
    const m = L.nrMake(w, h, rng, { level, harden: level >= 3 ? 120 : 0 });
    return m && (!top || m.grade.top >= top) ? m : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['Double Blank', 'Pips', 'Knock-On', 'Side by Side', 'Two by One', 'Tandem', 'Duet', 'Bones', 'Tile Rack', 'Double Six',
    'Domino Effect', 'Spinner', 'Line of Play', 'Boneyard', 'Fives and Threes', 'Draw Game', 'Block Game', 'Chicken Foot', 'Double Nine',
    'Shuffle the Bones', 'Twins', 'Buddy System', 'Partners', 'Doubles', 'Couples Only', 'Pairs Skating', 'Two Step', 'Bunk Beds',
    'Salt and Pepper', 'Bookends', 'Matching Socks', 'Noah\'s Ark', 'Two of a Kind', 'Double Act', 'Twin Towers', 'Stepping Pairs',
    'The Long Table', 'Toppling Row', 'Chain Reaction', 'Double Twelve', 'Grand Domino'];
  const titles = titled(out, TITLES, 'Dominoes');
  const puzzles = out.map((m, k) => ({
    id: 'norinori-' + pad3(k + 1),
    title: titles[k],
    diff: m.diff,
    text: E.textFor({ kind: 'norinori' }),
    concepts: ['deduction'],
    tags: [m.w + 'x' + m.h, 'norinori', 'dominoes', 'shading'],
    data: { kind: 'norinori', regions: m.regions, sol: m.sol }
  }));
  writeFamily('norinori.js', {
    id: 'norinori', engine: 'pencil3', cat: 'pencil', name: 'Norinori', order: 61,
    blurb: 'Two shaded cells in every region, and every shaded cell in a domino.',
    origin: { who: 'Nikoli, Japan', note: 'Norinori is one of the pencil puzzles of the Japanese puzzle publisher Nikoli, famous for its hand-made logic puzzles.' },
    concepts: ['deduction']
  }, puzzles);
}

/* ---------- LITS ---------- */

function genLits() {
  const rng = C.rng(20260930 + 107);
  // [w, h, 'easy' (logic without the joining-up rule) or '', count]
  const plan = [[5, 5, 'easy', 3], [6, 6, 'easy', 5], [6, 6, '', 4], [7, 7, '', 7], [8, 8, '', 7], [9, 9, '', 6], [10, 10, '', 6], [12, 12, '', 4]];
  const out = makeMany('lits', plan, ([w, h, mode]) => {
    const m = L.ltMake(w, h, rng, {});
    return m && (mode !== 'easy' || m.grade.top <= 2) ? m : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['Four Square', 'Building Blocks', 'Letter Press', 'Movable Type', 'Block Capitals', 'Alphabet Soup', 'Brickwork', 'Quartet',
    'Tee Time', 'Straight Talk', 'S-Bend', 'L-Shaped Room', 'Flagstones', 'Crazy Paving', 'Mosaic', 'Parquet', 'Masonry', 'Dry Stone Wall',
    'Stepping Out', 'Four Corners', 'Fourfold', 'Jigsaw Wall', 'Garden Wall', 'Cornerstone', 'Keystone', 'The Four Letters', 'Typesetter',
    'Composing Stick', 'Stonemason', 'Terraces', 'Staircase', 'Ramparts', 'Battlements', 'Great Wall', 'Aqueduct', 'Bricklayer\'s Puzzle',
    'Tangled Letters', 'Sampler', 'Castle Keep', 'Fortress', 'Tower of Babel', 'Labyrinth Wall'];
  const titles = titled(out, TITLES, 'Tetrominoes');
  const puzzles = out.map((m, k) => ({
    id: 'lits-' + pad3(k + 1),
    title: titles[k],
    diff: m.diff,
    text: E.textFor({ kind: 'lits' }),
    concepts: ['deduction', 'graph'],
    tags: [m.w + 'x' + m.h, 'lits', 'tetrominoes', 'shading'],
    data: { kind: 'lits', regions: m.regions, sol: m.sol }
  }));
  writeFamily('lits.js', {
    id: 'lits', engine: 'pencil3', cat: 'pencil', name: 'LITS', order: 62,
    blurb: 'A tetromino in every region, all joined up, no 2×2, and no identical twins side by side.',
    origin: { who: 'Nikoli, Japan', note: 'LITS comes from the Japanese puzzle publisher Nikoli. Its name spells out the four tetrominoes that can appear: L, I, T and S (the square O would make a forbidden 2×2 block).' },
    concepts: ['deduction', 'graph']
  }, puzzles);
}

/* ---------- Heyawake ---------- */

function genHeyawake() {
  const rng = C.rng(20260930 + 109);
  // [w, h, logic level, wanted top (0 any), count]
  const plan = [[6, 6, 2, 0, 6], [7, 7, 2, 0, 3], [6, 6, 3, 3, 4], [7, 7, 3, 3, 5], [8, 8, 3, 3, 6], [9, 9, 3, 3, 5], [9, 9, 4, 4, 4], [10, 10, 4, 0, 8]];
  const out = makeMany('heyawake', plan, ([w, h, level, top]) => {
    const m = L.hyMake(w, h, rng, { level });
    return m && (!top || m.grade.top >= top) ? m : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['Open Plan', 'Box Room', 'Bedsit', 'Studio Flat', 'Pantry', 'Scullery', 'Parlour', 'Floor Plan', 'Room Service', 'Hallway',
    'Antechamber', 'Drawing Room', 'Attic', 'Cellar', 'Conservatory', 'Larder', 'Loft', 'Garret', 'Vestibule', 'Study', 'Library', 'Gallery',
    'Boudoir', 'Annexe', 'Guest Wing', 'West Wing', 'East Wing', 'Great Hall', 'Blueprint', 'Architect\'s Desk', 'Doors Ajar', 'House Rules',
    'Open House', 'Rooms with a View', 'The Lodger', 'Penthouse', 'Mansion', 'Country House', 'Castle Chambers', 'Palace of Rooms', 'Labyrinthine Lodgings'];
  const titles = titled(out, TITLES, 'Rooms');
  const puzzles = out.map((m, k) => ({
    id: 'heyawake-' + pad3(k + 1),
    title: titles[k],
    diff: m.diff,
    text: E.textFor({ kind: 'heyawake' }),
    concepts: ['deduction', 'graph'],
    tags: [m.w + 'x' + m.h, 'heyawake', 'rooms', 'shading'],
    data: { kind: 'heyawake', w: m.w, h: m.h, rooms: m.rooms, sol: m.sol }
  }));
  writeFamily('heyawake.js', {
    id: 'heyawake', engine: 'pencil3', cat: 'pencil', name: 'Heyawake', order: 63,
    blurb: 'Shade cells room by room: never two touching, the white cells all joined, no white line through three rooms.',
    origin: { who: 'Nikoli, Japan', note: 'A puzzle from the Japanese publisher Nikoli; its name means, roughly, "dividing rooms".' },
    concepts: ['deduction', 'graph']
  }, puzzles);
}

/* ---------- Yajilin ---------- */

function genYajilin() {
  const rng = C.rng(20260930 + 113);
  // [w, h, logic level, wanted top (0 any), count]
  const plan = [[6, 6, 2, 0, 6], [7, 7, 2, 0, 5], [8, 8, 2, 0, 5], [10, 10, 2, 0, 8], [7, 7, 4, 4, 5], [8, 8, 4, 4, 4], [10, 10, 4, 4, 8]];
  const out = makeMany('yajilin', plan, ([w, h, level, top]) => {
    const m = L.yjMake(w, h, rng, { level, cover: 0.85 });
    return m && (!top || m.grade.top >= top) ? m : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['Round Trip', 'Ring Road', 'Roundabout', 'Lap of Honour', 'Orbit', 'Racetrack', 'Loop the Loop', 'Carousel', 'Merry-go-round',
    'Circle Line', 'Bus Route', 'Milk Round', 'Paper Round', 'Beating the Bounds', 'Perimeter', 'Boundary Walk', 'Scenic Route', 'Detour',
    'Switchback', 'Hairpin Bends', 'Weathervane', 'Compass Points', 'Quiver', 'Bullseye', 'Arrowhead', 'Fletcher', 'Bowstring', 'Longbow',
    'Crossbow', 'Grand Tour', 'Circumnavigation', 'Figure Skater', 'Conveyor Belt', 'Paternoster', 'Ring of Roses', 'Night Watch',
    'Sentry Round', 'Circuit Breaker', 'Grand Prix', 'Magic Roundabout', 'Ouroboros', 'Around the World'];
  const titles = titled(out, TITLES, 'Loop');
  const puzzles = out.map((m, k) => ({
    id: 'yajilin-' + pad3(k + 1),
    title: titles[k],
    diff: m.diff,
    text: E.textFor({ kind: 'yajilin' }),
    concepts: ['deduction', 'graph', 'hamilton', 'parity'],
    tags: [m.w + 'x' + m.h, 'yajilin', 'loop', 'arrows'],
    data: { kind: 'yajilin', w: m.w, h: m.h, clues: m.clues, sol: m.sol }
  }));
  writeFamily('yajilin.js', {
    id: 'yajilin', engine: 'pencil3', cat: 'pencil', name: 'Yajilin', order: 64,
    blurb: 'Arrows count the shaded cells; one loop runs through everything else.',
    origin: { who: 'Nikoli, Japan', note: 'A puzzle from the Japanese publisher Nikoli; its name comes from yajirushi, the Japanese word for an arrow.' },
    concepts: ['deduction', 'graph', 'hamilton', 'parity']
  }, puzzles);
}

const t0 = Date.now();
if (doIt('number-path')) genNumberPath();
if (doIt('norinori')) genNorinori();
if (doIt('lits')) genLits();
if (doIt('heyawake')) genHeyawake();
if (doIt('yajilin')) genYajilin();
console.log('done in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
