/* The Puzzle Cabinet · tools/gen/tatham2.js
 *
 *   node tools/gen/tatham2.js                  writes all five data files
 *   node tools/gen/tatham2.js net range        only these (net, magnets, tracks, signpost, range)
 *
 * The making itself is in js/lib/tatham2-logic.js (the Endless drawers use
 * the same code); here it runs with fixed seeds and a plan of sizes, logic
 * levels and wanted difficulties.
 *
 * data/net.js       random trees without crosses, edges swapped near the tiles
 *                   logic cannot settle until it settles them all; then every
 *                   tile turned at random (some boards wrap around)
 * data/magnets.js   a random domino tiling and random magnets, changed where
 *                   logic is stuck; harder ones hide some counts
 * data/tracks.js    a winding line from A to B (an L bent by bumps and corner
 *                   flips); pieces given where logic is stuck, then any piece
 *                   that is not needed taken away again
 * data/signpost.js  a path of straight moves through every square from corner
 *                   to corner; numbers given where logic is stuck, then thinned
 * data/range.js     random black squares that never touch and keep the whites
 *                   joined; every number shown, then taken away while logic
 *                   still solves it
 * Every puzzle is graded by the logic it needs and checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/tatham2-logic.js'));
require(path.join(ROOT, 'engines/tatham2.js'));
const L = C.tatham2Logic;
const E = C.engines.tatham2;

const want = process.argv.slice(2);
const doIt = (k) => !want.length || want.includes(k);
const pad3 = (k) => String(k).padStart(3, '0');

function writeFamily(file, meta, puzzles) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/tatham2.js */');
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

/* plan rows: [maker args…, count, wanted difficulty]; a row keeps trying until it has
 * its count at the wanted difficulty (or gives up and takes the nearest) */
function makeMany(kind, seed, plan, make) {
  const rng = C.rng(seed);
  const out = [];
  for (const row of plan) {
    const count = row[row.length - 2], target = row[row.length - 1], args = row.slice(0, -2);
    let made = 0, tries = 0;
    const spare = [];
    const t0 = Date.now();
    while (made < count && tries++ < 400) {
      const r = make(args, rng);
      if (!r) continue;
      const diff = E.grade[kind](r);
      if (diff !== target) { spare.push([Math.abs(diff - target), diff, r]); continue; }
      out.push({ r, diff });
      made++;
    }
    spare.sort((a, b) => a[0] - b[0]);
    while (made < count && spare.length) { const [, diff, r] = spare.shift(); out.push({ r, diff }); made++; }
    console.log('  ' + kind + ' ' + JSON.stringify(args) + ' -> ' + target + ': ' + made + '/' + count + ' in ' + tries + ' tries, ' + (Date.now() - t0) + ' ms');
  }
  return out;
}

function toPuzzles(kind, prefix, made, titles, tagsOf, conceptsOf) {
  made.sort((a, b) => a.diff - b.diff || a.r.w * a.r.h - b.r.w * b.r.h || (a.r.wrap ? 1 : 0) - (b.r.wrap ? 1 : 0));
  const used = new Set();
  return made.map(({ r, diff }, k) => {
    const data = E.pack[kind](r);
    const list = typeof titles === 'function' ? titles(r) : titles;
    let title = list.find((t) => !used.has(t)) || (kind + ' ' + (k + 1));
    used.add(title);
    return {
      id: prefix + '-' + pad3(k + 1),
      title,
      diff,
      text: E.textFor(data),
      concepts: conceptsOf,
      tags: tagsOf(r),
      data
    };
  });
}

/* ---------- Net ---------- */

function genNet() {
  const plan = [
    [5, 5, false, 3, 7, 1],
    [7, 7, false, 3, 8, 2], [5, 5, true, 3, 3, 2],
    [9, 9, false, 3, 8, 3], [7, 7, true, 3, 4, 3],
    [11, 11, false, 3, 6, 4], [9, 9, true, 3, 4, 4],
    [13, 11, false, 4, 5, 5], [11, 11, true, 4, 5, 5]
  ];
  const made = makeMany('net', 20260930 + 101, plan, ([w, h, wrap, lv], rng) => L.netMake(w, h, wrap, rng, lv, { budget: 4000, iters: 3000 }));
  const PLAIN = ['First Connection', 'Hello, World', 'Plumber\'s Apprentice', 'Garden Hose', 'Junction Box', 'Fuse Box', 'Switchboard', 'Hot and Cold',
    'Party Line', 'Patch Panel', 'Waterworks', 'Dial-Up', 'Handshake', 'Local Network', 'Branch Office', 'Irrigation', 'Aqueduct', 'Telegraph Office',
    'Relay Station', 'Cable Tangle', 'Circuit Board', 'Substation', 'Mains Supply', 'Root System', 'River Delta', 'Family Tree', 'Coral Reef',
    'Frost Ferns', 'Lightning Strike', 'Canal Network', 'Tributaries', 'Server Room', 'Backbone', 'Capillaries', 'Mycelium', 'Power Station',
    'Oil Refinery', 'Spanning Tree', 'Plumbing Nightmare', 'The Grid', 'Data Centre', 'Mainframe'];
  const WRAP = ['Round the Back', 'Torus', 'Doughnut Network', 'Over the Edge', 'Pac-Man Plumbing', 'Wraparound', 'Endless Pipes', 'Globe Trotter',
    'No Edges', 'Seamless', 'Tube Map', 'Ring Road', 'Bagel Works', 'Circumnavigation', 'Round and Round', 'World Wide Web'];
  const puzzles = toPuzzles('net', 'net', made, (r) => (r.wrap ? WRAP : PLAIN), (r) => [r.w + 'x' + r.h, r.wrap ? 'wrapping' : 'plain', 'tatham', 'netwalk'], ['graph', 'deduction']);
  writeFamily('net.js', {
    id: 'net', engine: 'tatham2', cat: 'mechanical', name: 'Net', order: 21,
    blurb: 'Turn the tiles until every pipe joins one network lit from the source. Some boards wrap around at the edges.',
    origin: { who: 'Simon Tatham\'s Portable Puzzle Collection', note: 'The rules and controls follow Net in Simon Tatham\'s free collection of puzzles; the same idea is also known as NetWalk. Every board here is our own, and each has exactly one solution.' },
    concepts: ['graph', 'deduction']
  }, puzzles);
}

/* ---------- Magnets ---------- */

function genMagnets() {
  const plan = [
    [6, 5, 1, 0, 6, 1], [6, 5, 2, 0, 6, 2], [8, 7, 1, 0, 3, 2], [8, 7, 2, 0, 8, 3],
    [8, 7, 3, 4, 6, 4], [10, 9, 2, 0, 4, 4], [10, 9, 3, 8, 7, 5]
  ];
  const made = makeMany('magnets', 20260930 + 202, plan, ([w, h, lv, hide], rng) => L.magMake(w, h, rng, lv, { hide, budget: 4000 }));
  const TITLES = ['Opposites Attract', 'Poles Apart', 'Fridge Door', 'Lodestone', 'Compass Needle', 'Field Lines', 'Iron Filings', 'Horseshoe',
    'Bar Magnets', 'North and South', 'Plus and Minus', 'Dipole', 'Push and Pull', 'Stick Together', 'Polarity', 'Terminals', 'Anode and Cathode',
    'Static Cling', 'Battery Pack', 'Positive Thinking', 'Negative Space', 'Neutral Ground', 'Tug of War', 'Magnetic North', 'Aurora',
    'Electromagnet', 'Maglev', 'Ferrite', 'Solenoid', 'Armature', 'Faraday\'s Desk', 'Domino Effect', 'Repulsion', 'Attraction', 'Charged Up',
    'Blank Cheque', 'Lines of Force', 'Magnetic Personality', 'Earth\'s Core', 'Pole Position', 'Cross Currents'];
  const puzzles = toPuzzles('magnets', 'magnets', made, TITLES, (r) => [r.w + 'x' + r.h, 'tatham', 'dominoes'], ['deduction', 'parity']);
  writeFamily('magnets.js', {
    id: 'magnets', engine: 'tatham2', cat: 'pencil', name: 'Magnets', order: 41,
    blurb: 'Fill the domino slots with magnets and blanks: like poles never touch, and every row and column has its count of + and −.',
    origin: { who: 'Simon Tatham\'s Portable Puzzle Collection', note: 'The rules and controls follow Magnets in Simon Tatham\'s free collection of puzzles. Every grid here is our own, and each has exactly one solution.' },
    concepts: ['deduction', 'parity']
  }, puzzles);
}

/* ---------- Tracks ---------- */

function genTracks() {
  const plan = [
    [6, 6, 1, 6, 1], [6, 6, 2, 3, 1], [8, 8, 2, 8, 2], [8, 8, 3, 4, 3], [10, 8, 3, 4, 3], [10, 10, 3, 3, 3],
    [8, 8, 4, 4, 4], [10, 10, 4, 4, 4], [10, 10, 4, 2, 5], [12, 10, 4, 4, 5]
  ];
  const made = makeMany('tracks', 20260930 + 303, plan, ([w, h, lv], rng) => L.trkMake(w, h, rng, lv, { budget: 4000, fill: 0.45 + rng() * 0.15 }));
  const TITLES = ['Branch Line', 'Single Track', 'Level Crossing', 'Goods Yard', 'Request Stop', 'Sleepers', 'Ballast', 'Leaves on the Line',
    'The Milk Train', 'Mail Coach', 'Night Sleeper', 'Puffing Billy', 'Rocket', 'Viaduct', 'Tunnel Vision', 'Cutting', 'Embankment', 'Gradient',
    'Hairpin', 'Horseshoe Curve', 'Switchback', 'Narrow Gauge', 'Broad Gauge', 'Terminus', 'Timetable', 'Rush Hour', 'Commuter Belt',
    'Last Train Home', 'Scenic Route', 'Heritage Railway', 'Steam Up', 'Coal Tender', 'Footplate', 'Guard\'s Van', 'Buffer Stop', 'Turntable',
    'Loco Motion', 'Full Steam Ahead', 'Points Failure', 'Signal Box', 'Junction', 'The Long Way Round', 'Wrong Side of the Tracks'];
  const puzzles = toPuzzles('tracks', 'tracks', made, TITLES, (r) => [r.w + 'x' + r.h, 'tatham', 'railway'], ['parity', 'graph', 'deduction']);
  writeFamily('tracks.js', {
    id: 'tracks', engine: 'tatham2', cat: 'pencil', name: 'Tracks', order: 42,
    blurb: 'Lay one railway line from A to B. The numbers count the track squares in every row and column.',
    origin: { who: 'Simon Tatham\'s Portable Puzzle Collection', note: 'The rules and controls follow Tracks in Simon Tatham\'s free collection of puzzles; puzzles of this kind are also known as Train Tracks. Every line here is our own, and each has exactly one solution.' },
    concepts: ['parity', 'graph', 'deduction']
  }, puzzles);
}

/* ---------- Signpost ---------- */

function genSignpost() {
  const plan = [[4, 4, 2, 6, 1], [5, 5, 2, 8, 2], [5, 5, 3, 3, 3], [6, 6, 2, 6, 3], [7, 7, 2, 2, 3], [6, 6, 3, 8, 4], [7, 7, 3, 7, 5]];
  const made = makeMany('signpost', 20260930 + 404, plan, ([w, h, lv], rng) => L.spMake(w, h, rng, lv, { budget: 6000 }));
  const TITLES = ['Follow the Arrows', 'This Way Up', 'Treasure Trail', 'Paper Chase', 'Scavenger Hunt', 'Orienteering', 'Compass Rose',
    'Weathervane', 'Crossroads', 'Fingerpost', 'Milestone', 'You Are Here', 'One Way Street', 'Detour', 'Diversion', 'Shortcut', 'Join the Dots',
    'Chain Letter', 'Relay Race', 'Pass the Parcel', 'Stepping Stones', 'Hopscotch', 'Leapfrog', 'Next, Please', 'Count On Me', 'Order of Play',
    'Queue Jumper', 'Pointing Finger', 'Arrowhead', 'Quiver', 'Straight and Narrow', 'All Roads', 'Grand Tour', 'Pilgrimage', 'Signs of the Times',
    'Road Trip', 'Tourist Trail', 'Wayfinder', 'Breadcrumbs', 'Dot to Dot', 'Onwards'];
  const puzzles = toPuzzles('signpost', 'signpost', made, TITLES, (r) => [r.w + 'x' + r.h, 'tatham', 'arrows'], ['graph', 'hamilton', 'deduction']);
  writeFamily('signpost.js', {
    id: 'signpost', engine: 'tatham2', cat: 'pencil', name: 'Signpost', order: 43,
    blurb: 'Number the arrows 1, 2, 3 … so that every arrow points at the next number. Drag from arrow to arrow to link them.',
    origin: { who: 'Simon Tatham\'s Portable Puzzle Collection', note: 'The rules and controls follow Signpost in Simon Tatham\'s free collection of puzzles. The answer is a Hamilton path through the grid. Every grid here is our own, and each has exactly one solution.' },
    concepts: ['graph', 'hamilton', 'deduction']
  }, puzzles);
}

/* ---------- Range ---------- */

function genRange() {
  const plan = [
    [7, 7, 1, 0, 6, 1], [7, 7, 2, 0, 3, 2], [9, 6, 2, 0, 5, 2], [9, 9, 2, 0, 6, 3], [12, 8, 2, 0, 3, 3],
    [9, 9, 3, 8, 6, 4], [12, 8, 3, 8, 4, 4], [13, 9, 3, 10, 4, 5], [12, 10, 3, 10, 3, 5]
  ];
  const made = makeMany('range', 20260930 + 505, plan, ([w, h, lv, extra], rng) => L.rgMake(w, h, rng, lv, { extra, budget: 20000 }));
  const TITLES = ['Line of Sight', 'Field of View', 'Lookout', 'Watchtower', 'Periscope', 'Spyglass', 'Horizon', 'Vantage Point', 'Crow\'s Nest',
    'Blind Spot', 'Peekaboo', 'Hide and Seek', 'Sightseeing', 'Panorama', 'Skyline', 'Lighthouse', 'Searchlight', 'Eagle Eye', 'Far Sighted',
    'Keyhole', 'Window Seat', 'Open Plan', 'Blackout Blinds', 'Shadows', 'Ink Spots', 'Checkpoint', 'Observatory', 'Telescope', 'Binoculars',
    'Clear View', 'Sentry', 'Night Watch', 'Look Both Ways', 'Four Winds', 'Crosshairs', 'Black and White', 'Long Corridor', 'Gallery',
    'Hall of Mirrors', 'Bird\'s Eye', 'Kurodoko'];
  const puzzles = toPuzzles('range', 'range', made, TITLES, (r) => [r.w + 'x' + r.h, 'tatham', 'kurodoko'], ['deduction', 'graph']);
  writeFamily('range.js', {
    id: 'range', engine: 'tatham2', cat: 'pencil', name: 'Range', order: 44,
    blurb: 'Shade squares so that every number sees exactly that many squares along its row and column. Blacks never touch; the whites stay joined.',
    origin: { who: 'Nikoli, Japan', note: 'Range follows Simon Tatham\'s free collection of puzzles. The puzzle itself is Kurodoko, one of the puzzles of the Japanese publisher Nikoli, also known as Kuromasu. Every grid here is our own, and each has exactly one solution.' },
    concepts: ['deduction', 'graph']
  }, puzzles);
}

const t0 = Date.now();
if (doIt('net')) genNet();
if (doIt('magnets')) genMagnets();
if (doIt('tracks')) genTracks();
if (doIt('signpost')) genSignpost();
if (doIt('range')) genRange();
console.log('done in ' + ((Date.now() - t0) / 1000).toFixed(1) + ' s');
