/* The Puzzle Cabinet · tools/gen/lights.js
 *
 *   node tools/gen/lights.js      writes data/lights-out.js and data/glasses.js
 *
 * Hand-made classics first (pictures, Merlin's square, the bar bet with three
 * glasses), then puzzles made by the engine's own generator (the one behind
 * the Endless drawer) with fixed seeds. Every par is the fewest presses or
 * turns, found by the solver; every impossible puzzle is proved impossible
 * by search and carries its reason.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'engines/lights.js'));
const L = C.lightsSolver;
const E = C.engines.lights;

function fail(msg) { throw new Error(msg); }
function bits(rows) { return rows.join('').replace(/\./g, '0'); }
// the pattern made by pressing these lamps on a dark grid
function pressedStart(grid, list) {
  const B = L.model({ grid, start: '0'.repeat(grid[0] * grid[1]) });
  const s = B.start.slice();
  list.forEach((i) => L.applyPress(B, s, i));
  return s.join('');
}

/* =====================================================================
 * Lights Out
 * ===================================================================== */

const PICTURES = [
  { title: 'The Big Plus', grid: [5, 5], rows: ['..1..', '..1..', '11111', '..1..', '..1..'] },
  { title: 'X Marks the Spot', grid: [5, 5], rows: ['1...1', '.1.1.', '..1..', '.1.1.', '1...1'] },
  { title: 'Picture Frame', grid: [5, 5], rows: ['11111', '1...1', '1...1', '1...1', '11111'] },
  { title: 'Chessboard', grid: [5, 5], rows: ['1.1.1', '.1.1.', '1.1.1', '.1.1.', '1.1.1'] },
  { title: 'Letter H', grid: [5, 5], rows: ['1...1', '1...1', '11111', '1...1', '1...1'] },
  { title: 'Diamond Ring', grid: [5, 5], rows: ['..1..', '.1.1.', '1...1', '.1.1.', '..1..'] },
  { title: 'Four Corners', grid: [5, 5], rows: ['11.11', '11.11', '.....', '11.11', '11.11'] },
  { title: 'Hourglass', grid: [5, 5], rows: ['11111', '.111.', '..1..', '.111.', '11111'] },
  { title: 'Sweetheart', grid: [7, 7], rows: ['.......', '.11.11.', '1111111', '1111111', '.11111.', '..111..', '...1...'] },
  { title: 'Smile, Please', grid: [7, 7], rows: ['.......', '.1...1.', '.1...1.', '.......', '1.....1', '.1...1.', '..111..'] },
  { title: 'Bullseye', grid: [7, 7], rows: ['1111111', '1.....1', '1.111.1', '1.1.1.1', '1.111.1', '1.....1', '1111111'] },
  { title: 'Stripes', grid: [6, 6], rows: ['111111', '......', '111111', '......', '111111', '......'] },
  { title: 'Staircase', grid: [6, 6], rows: ['1.....', '11....', '.11...', '..11..', '...11.', '....11'] },
  { title: 'Arrow', grid: [6, 6], rows: ['..11..', '.1111.', '111111', '..11..', '..11..', '..11..'] },
  { title: 'Space Invader', grid: [7, 6], rows: ['..1.1..', '.11111.', '11.1.11', '1111111', '1.1.1.1', '..1.1..'] },
  { title: 'Checkmate', grid: [6, 6], rows: ['1.1.1.', '.1.1.1', '1.1.1.', '.1.1.1', '1.1.1.', '.1.1.1'] },
  { title: 'Snowflake', grid: [7, 7], rows: ['...1...', '.1.1.1.', '..111..', '1111111', '..111..', '.1.1.1.', '...1...'] }
];

function lampPuzzle(fields, d, info) {
  const B = L.model(d);
  const pl = L.plan(B, B.start);
  if (!pl || !pl.n) fail('not solvable: ' + fields.id);
  if (!pl.exact) fail('par not exact: ' + fields.id);
  const sc = L.lampScore(d, B, pl.n);
  return Object.assign({ diff: L.lampDiff(sc), par: pl.n, text: L.lampText(d, info) }, fields, { par: pl.n, data: d, _score: sc });
}

const classics = [];
classics.push(lampPuzzle({
  id: 'lo-first-light', title: 'First Light',
  text: 'Welcome to Lights Out. Pressing a lamp switches it and its neighbours above, below, left and right: lit lamps go dark and dark ones light up. Five lamps are lit. Put them all out.',
  hints: ['One press is enough. Which lamp touches all five?'],
  explain: 'The centre lamp switches itself and its four neighbours — exactly the five that were lit. Every Lights Out puzzle is built from presses like this one, laid on top of each other.',
  concepts: ['parity'], tags: ['lights out', 'warm-up']
}, { grid: [3, 3], start: '010111010' }));
classics.push(lampPuzzle({
  id: 'lo-corner-shop', title: 'Corner Shop',
  text: 'Three lamps are lit in the corner of a 3 × 3 panel. A press switches a lamp and its neighbours above, below, left and right. Put them out.',
  hints: ['A corner lamp has only two neighbours.'],
  tags: ['lights out', 'warm-up']
}, { grid: [3, 3], start: '110100000' }));
classics.push(lampPuzzle({
  id: 'lo-two-presses', title: 'Two by Two',
  text: 'On this 3 × 3 panel two presses were made to light these lamps. Find them and undo them — the same two presses put everything right again.',
  hints: ['Pressing a lamp twice does nothing, so the presses that made the pattern also clear it.', 'Look for the lamps with the most lit neighbours.'],
  concepts: ['parity'], tags: ['lights out', 'warm-up']
}, { grid: [3, 3], start: pressedStart([3, 3], [0, 8]) }));
classics.push(lampPuzzle({
  id: 'lo-nine-lights', title: 'Nine Lights',
  text: 'Every lamp of the 3 × 3 panel is lit. Press lamps (each one switches itself and its neighbours above, below, left and right) until all are dark.',
  hints: ['Try the four corners. What is left?', 'After the four corners only the middle is lit… or is it? Count again.'],
  explain: 'Press the four corners and the centre: five presses. Each corner switches itself and two edge lamps, so every edge lamp is switched twice by the corners (no change) and once by the centre; the corners and the centre are switched once each. Every lamp changes exactly once — all out.',
  concepts: ['parity'], tags: ['lights out', 'all on']
}, { grid: [3, 3], start: '111111111' }));
classics.push(lampPuzzle({
  id: 'lo-sixteen-candles', title: 'Sixteen Candles',
  text: 'All sixteen lamps of a 4 × 4 panel are lit. Pressing a lamp switches it and its neighbours above, below, left and right. Blow out every candle.',
  hints: ['It can be done in four presses.', 'No two of the four presses are in the same row or the same column.'],
  concepts: ['parity'], tags: ['lights out', 'all on']
}, { grid: [4, 4], start: '1111111111111111' }));
classics.push(lampPuzzle({
  id: 'lo-magic-square', title: 'The Magic Square', year: 1978,
  source: 'The “magic square” game of *Merlin*, the handheld electronic game by Parker Brothers (1978).',
  text: 'Merlin’s magic square: nine buttons that light up. Pressing a **corner** switches the four lamps of its corner block; an **edge** switches the three along its side; the **centre** switches itself and the four edge lamps. All are dark. Light the eight outer lamps, with the centre left dark.',
  hints: ['Hover over a button to see what it switches.', 'The answer uses eight presses — every button but one.'],
  explain: 'Press every button except the centre. Each outer lamp is switched an odd number of times, the centre an even number. Merlin’s rules are chosen so that every one of the 512 patterns can be reached — the 9 × 9 table of switches has an inverse over the numbers mod 2 — so every magic-square game can be won.',
  concepts: ['parity'], tags: ['merlin', 'classic']
}, { grid: [3, 3], nb: 'merlin', start: '000000000', target: '111101111' }));
classics.push(lampPuzzle({
  id: 'lo-full-house', title: 'Full House',
  text: 'The classic 5 × 5 panel with every one of its 25 lamps lit. Pressing a lamp switches it and its neighbours above, below, left and right. Put out all the lights.',
  hints: ['Work row by row: press the lamp under every lit lamp in the row above (“chasing the lights”). Everything ends up in the bottom row.', 'The shortest answer uses 15 presses — and it is symmetric.'],
  explain: 'Fifteen presses is the least. On the 5 × 5 panel only a quarter of all patterns can be solved at all, and every solvable one has exactly four solutions, because two special sets of presses change nothing. A handy method: chase the lights down to the bottom row, then press a few top-row lamps from a small table and chase again.',
  concepts: ['parity', 'working-backwards'], tags: ['lights out', 'all on', 'classic']
}, { grid: [5, 5], start: '1111111111111111111111111' }));

PICTURES.forEach((pic, i) => {
  const start = bits(pic.rows);
  const d = { grid: pic.grid.slice(), start };
  const B = L.model(d);
  if (!L.plan(B, B.start)) { console.log('  (picture not solvable, skipped: ' + pic.title + ')'); return; }
  classics.push(lampPuzzle({
    id: 'lo-pic-' + pic.title.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''), title: pic.title,
    text: 'The lamps of this ' + pic.grid[0] + ' × ' + pic.grid[1] + ' panel make a picture. Pressing a lamp switches it and its neighbours above, below, left and right. Put the picture out.',
    tags: ['lights out', 'picture']
  }, d));
});

// light a picture instead of clearing one
[
  { id: 'lo-light-heart', title: 'Light the Heart', grid: [7, 7], rows: PICTURES[8].rows },
  { id: 'lo-write-an-h', title: 'Write an H', grid: [5, 5], rows: ['1...1', '1...1', '11111', '1...1', '1...1'] },
  { id: 'lo-draw-a-frame', title: 'Draw a Frame', grid: [6, 6], rows: ['111111', '1....1', '1....1', '1....1', '1....1', '111111'] }
].forEach((t) => {
  const d = { grid: t.grid.slice(), start: '0'.repeat(t.grid[0] * t.grid[1]), target: bits(t.rows) };
  if (!L.plan(L.model(d), L.model(d).start)) { console.log('  (target not reachable, skipped: ' + t.title + ')'); return; }
  classics.push(lampPuzzle({ id: t.id, title: t.title, text: 'All dark. Pressing a lamp switches it and its neighbours above, below, left and right. Light up exactly the picture in the goal box — no more, no less.', tags: ['lights out', 'picture', 'target'] }, d));
});
// from one picture to another
{
  const d = { grid: [6, 6], start: bits(PICTURES[11].rows), target: bits(PICTURES[15].rows) };
  classics.push(lampPuzzle({ id: 'lo-stripes-to-checks', title: 'Stripes to Checks', text: 'Turn the striped pattern into the chequered one in the goal box. Pressing a lamp switches it and its neighbours above, below, left and right.', tags: ['lights out', 'picture', 'target'] }, d));
}

const NAMES = ['Night Watch', 'Firefly', 'Lamplighter', 'Blackout', 'Dimmer Switch', 'Candlelight', 'Starlight', 'Beacon', 'Porch Light', 'Glowworm',
  'Lantern Row', 'Switchboard', 'Fuse Box', 'Neon Sign', 'Ember', 'Spark', 'Flicker', 'Twilight', 'Dusk', 'Dawn', 'Curfew', 'Afterglow', 'Halo', 'Aurora',
  'Comet Tail', 'Lighthouse', 'Chandelier', 'Torchlight', 'Floodlight', 'Spotlight', 'Footlights', 'Marquee', 'Streetlamp', 'Night Owl', 'Pilot Light',
  'Signal Fire', 'Will-o’-the-Wisp', 'Moonrise', 'Moonlight', 'Sunset', 'Sunrise', 'Northern Lights', 'Morse Code', 'Traffic Lights', 'Scoreboard',
  'Control Room', 'Power Cut', 'Brownout', 'Short Circuit', 'Night Shift', 'Last Orders', 'Closing Time', 'Midnight Oil', 'Wick', 'Tallow', 'Gaslight',
  'Arc Lamp', 'Filament', 'Glow Stick', 'Sparkler', 'Bonfire', 'Hearth', 'Glimmer', 'Twinkle', 'Shimmer', 'Gleam', 'Lumen', 'Candela', 'Photon',
  'Stained Glass', 'Rose Window', 'Paper Lanterns', 'Fairy Lights', 'Birthday Cake', 'Jack-o’-Lantern', 'Moth to a Flame', 'Night Light',
  'Reading Lamp', 'Anglepoise', 'Headlamp', 'Searchlight', 'Semaphore', 'Heliograph', 'Flashbulb', 'Darkroom', 'Red Light', 'Green Light',
  'Amber Light', 'Stage Door', 'Blue Hour', 'Golden Hour', 'Evening Star', 'Morning Star', 'Shooting Star', 'Constellation', 'Big Dipper',
  'Orion’s Belt', 'Pleiades', 'Milky Way', 'Eclipse', 'New Moon', 'Half Moon', 'Full Moon', 'Harvest Moon', 'Lava Lamp', 'Disco Ball', 'Mirror Ball',
  'Light Switch', 'Pull Cord', 'Fuse Wire', 'Candle Snuffer', 'Oil Lamp', 'Hurricane Lamp', 'Miner’s Lamp', 'Bioluminescence'];

const PER_LEVEL = [0, 14, 22, 24, 18, 8];
const seen = new Set(classics.map((p) => JSON.stringify(p.data)));
const generated = [];
const rng = C.rng(19950101);
for (let level = 1; level <= 5; level++) {
  const kinds = L.LAMP_KINDS.filter((k) => level >= k[0] && level <= k[1]);
  let got = 0, turn = 0, guard = 0;
  while (got < PER_LEVEL[level] && guard++ < 5000) {
    const K = kinds[turn % kinds.length];
    turn++;
    const r = L.makeLamp(rng, level, K[3]);
    if (!r) continue;
    const key = JSON.stringify(r.d);
    if (seen.has(key)) continue;
    seen.add(key);
    generated.push({ d: r.d, info: r.info, par: r.par, diff: level, score: r.score });
    got++;
  }
  if (got < PER_LEVEL[level]) fail('level ' + level + ': only ' + got);
}
generated.sort((a, b) => a.diff - b.diff || a.score - b.score || a.par - b.par);
const lamps = classics.slice();
generated.forEach((g, i) => {
  if (i >= NAMES.length) fail('not enough names');
  lamps.push({ id: 'lo-' + String(i + 1).padStart(3, '0'), title: NAMES[i], diff: g.diff, par: g.par, text: L.lampText(g.d, g.info), data: g.d, _score: g.score, _gen: 1 });
});
lamps.forEach((p) => { if (p.diff == null) p.diff = L.lampDiff(p._score); });
// easiest first: classics are placed among the generated ones by their difficulty
lamps.sort((a, b) => a.diff - b.diff || (a._gen || 0) - (b._gen || 0) || a._score - b._score);

/* =====================================================================
 * Turning glasses
 * ===================================================================== */

function glassPuzzle(fields, d) {
  const G = L.gModel(d);
  const path = L.gSolve(G, G.start);
  const out = Object.assign({ text: L.glassText(d) }, fields, { data: d });
  if (d.impossible) {
    if (path) fail('said impossible but solvable: ' + fields.id);
    const R = L.gReasons(G);
    if (!R[d.why]) fail('reason does not hold: ' + fields.id);
    if (out.diff == null) out.diff = L.glassImpDiff(G, d.why);
  } else {
    if (!path || !path.length) fail('not solvable: ' + fields.id);
    out.par = path.length;
    if (out.diff == null) out.diff = L.glassDiff(L.glassScore(G, path.length));
  }
  return out;
}

const gClassics = [
  glassPuzzle({
    id: 'gl-bar-bet', title: 'The Bar Bet', diff: 1,
    source: 'A traditional bar bet; the trick is described in many books of betchas and table tricks.',
    text: 'A trickster sets out three glasses: the middle one upright, the outer two upside down. “Turning two glasses at a time, in exactly three moves I will get all three upright,” he says — and does. Can you beat him and do it in fewer?',
    hints: ['You do not need three moves.'],
    explain: 'One turn is enough: the two outer glasses. The trickster takes three moves only to hide how simple it is — and to set up the second half of the bet, [[gl-bar-bet-reversed]].',
    links: ['gl-bar-bet-reversed'], concepts: ['parity'], tags: ['glasses', 'bar bet', 'classic']
  }, { mode: 'glasses', look: 'glass', n: 3, turn: 2, start: '101' }),
  glassPuzzle({
    id: 'gl-bar-bet-reversed', title: 'The Bar Bet, Reversed', diff: 1,
    source: 'A traditional bar bet (the second half of [[gl-bar-bet]]).',
    text: 'Having won, the trickster casually turns the middle glass upside down and pushes the three across to you: “Your turn — two at a time, all three upright.” Can it be done?',
    hints: ['Count the glasses that are upside down after each turn you try.'],
    concepts: ['parity', 'invariant'], links: ['gl-bar-bet'], tags: ['glasses', 'bar bet', 'impossible', 'classic']
  }, { mode: 'glasses', look: 'glass', n: 3, turn: 2, start: '010', impossible: true, why: 'parity' }),
  glassPuzzle({
    id: 'gl-six-coins-five', title: 'Six Coins, Five at a Time',
    text: 'Six coins lie in a row, all tails up. At every turn you must turn over exactly **five** of them. Get all six heads up in as few turns as you can.',
    hints: ['Turning five coins is the same as turning all six and then turning one back.', 'So each turn is “turn everything, except one coin”. Leave out a different coin each time.'],
    explain: 'Six turns, leaving out a different coin each time: every coin is turned over five times — an odd number — so every one ends heads up. With an even number of coins this always works; with an odd number it never can: see [[gl-seven-coins-six]].',
    links: ['gl-seven-coins-six'], concepts: ['parity'], tags: ['coins', 'classic']
  }, { mode: 'glasses', look: 'coin', n: 6, turn: 5, start: '111111' }),
  glassPuzzle({
    id: 'gl-seven-coins-six', title: 'Seven Coins, Six at a Time',
    text: 'Seven coins lie in a row, all tails up. At every turn you must turn over exactly **six** of them. Get all seven heads up — or show that it cannot be done.',
    hints: ['Count the tails before and after a turn. Odd or even?'],
    links: ['gl-six-coins-five'], concepts: ['parity', 'invariant'], tags: ['coins', 'impossible', 'classic']
  }, { mode: 'glasses', look: 'coin', n: 7, turn: 6, start: '1111111', impossible: true, why: 'parity' }),
  glassPuzzle({
    id: 'gl-ten-three', title: 'Ten Glasses, Three at a Time',
    text: 'Ten glasses stand in a row, all upside down. At every turn you must turn over exactly **three** of them — any three. Stand them all upright in as few turns as you can.',
    hints: ['Three turns put nine upright. What about the tenth?', 'You may turn some upright glasses back over on the way.'],
    concepts: ['parity'], tags: ['glasses']
  }, { mode: 'glasses', look: 'glass', n: 10, turn: 3, start: '1111111111' }),
  glassPuzzle({
    id: 'gl-rainbow-row', title: 'Colours in a Row',
    text: 'Seven glasses stand in a row; the first and the second are upside down. At every turn you must turn over exactly **three that stand side by side**. Get all seven upright — or show that it cannot be done.',
    hints: ['Number the glasses 1 to 7 and colour them red, blue, green, red, blue, green, red.', 'Any three side by side contain one glass of each colour.'],
    concepts: ['coloring-argument', 'invariant', 'parity'], tags: ['glasses', 'impossible']
  }, { mode: 'glasses', look: 'glass', n: 7, turn: 3, adj: true, start: '1100000', impossible: true, why: 'colours' })
];

const gSeen = new Set(gClassics.map((p) => JSON.stringify(p.data)));
const gTitles = new Set(gClassics.map((p) => p.title));
const G_PER = [0, 5, 7, 7, 5, 3];
const grng = C.rng(20260930);
const gGen = [];
for (let level = 1; level <= 5; level++) {
  let got = 0, guard = 0, imp = 0;
  while (got < G_PER[level] && guard++ < 20000) {
    const r = L.makeGlasses(grng, level);
    if (!r) continue;
    if (r.d.impossible && imp >= 2) continue;
    const key = JSON.stringify(r.d);
    const title = L.glassTitle(r.d);
    if (gSeen.has(key) || gTitles.has(title)) continue;
    gSeen.add(key);
    gTitles.add(title);
    if (r.d.impossible) imp++;
    gGen.push(glassPuzzle({ title, diff: level, concepts: r.d.impossible ? ['parity', 'invariant'] : ['parity'] }, r.d));
    got++;
  }
  if (got < G_PER[level]) fail('glasses level ' + level + ': only ' + got);
}
gGen.forEach((p, i) => { p.id = 'gl-' + String(i + 1).padStart(3, '0'); if (p.data.why === 'colours') p.concepts = ['coloring-argument', 'invariant']; });
const gRank = (p) => p.diff * 100 + (p.id === 'gl-bar-bet' ? 0 : p.id === 'gl-bar-bet-reversed' ? 1 : 10 + (p.par != null ? p.par * 2 : 7));
const glasses = gClassics.concat(gGen).sort((a, b) => gRank(a) - gRank(b));

/* =====================================================================
 * writing
 * ===================================================================== */

function emit(lines, p) {
  const order = ['id', 'title', 'diff', 'year', 'source', 'par', 'text', 'goal', 'hints', 'explain', 'links', 'concepts', 'tags', 'data'];
  const keys = order.filter((k) => p[k] != null);
  lines.push('  { ' + keys.map((k) => k + ': ' + JSON.stringify(p[k])).join(',\n    ') + ' },');
}
function verifyAll(list) {
  list.forEach((p) => {
    const r = E.verify(p);
    if (!r.ok) fail(p.id + ': ' + r.err);
  });
  const ids = new Set(), titles = new Set();
  list.forEach((p) => {
    if (ids.has(p.id)) fail('duplicate id ' + p.id);
    if (titles.has(p.title)) fail('duplicate title ' + p.title);
    ids.add(p.id); titles.add(p.title);
  });
}
verifyAll(lamps);
verifyAll(glasses);

let out = ['/* The Puzzle Cabinet · data/lights-out.js — made by tools/gen/lights.js */', 'Cabinet.family({',
  "  id: 'lights-out', engine: 'lights', cat: 'mechanical', name: 'Lights Out', order: 20,",
  "  blurb: 'Press a lamp and it switches its neighbours too. Put every light out — on squares, shapes, wrapped boards, figures and three-colour panels.',",
  "  origin: { year: 1995, who: 'Tiger Electronics', note: 'Tiger Electronics sold the handheld Lights Out in 1995: a 5 × 5 grid of lit buttons, each switching itself and its four neighbours. Parker Brothers’ Merlin had played the same game on a 3 × 3 square in 1978. Mathematically it is a system of equations in arithmetic mod 2, solved by Gaussian elimination.' },",
  "  concepts: ['parity', 'binary', 'working-backwards']", '}, ['];
lamps.forEach((p) => emit(out, p));
out.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/lights-out.js'), out.join('\n') + '\n');

out = ['/* The Puzzle Cabinet · data/glasses.js — made by tools/gen/lights.js */', 'Cabinet.family({',
  "  id: 'glasses', engine: 'lights', cat: 'coins', name: 'Turning glasses', order: 20,",
  "  blurb: 'Turn over exactly so many glasses — or coins — at a time until all stand the right way up. Or prove that it can never be done.',",
  "  origin: { who: 'Traditional bar bets', note: 'Tricks with glasses turned two at a time are old tavern bets: the trickster wins from one position, then quietly hands his victim another where odd and even make it impossible. The same idea — an invariant — settles every puzzle here.' },",
  "  concepts: ['parity', 'invariant']", '}, ['];
glasses.forEach((p) => emit(out, p));
out.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/glasses.js'), out.join('\n') + '\n');

const spread = (list) => [1, 2, 3, 4, 5].map((k) => list.filter((p) => p.diff === k).length).join('/');
console.log('lights-out: ' + lamps.length + ' puzzles (' + classics.length + ' hand-made), difficulty ' + spread(lamps));
console.log('glasses: ' + glasses.length + ' puzzles (' + glasses.filter((p) => p.data.impossible).length + ' impossible), difficulty ' + spread(glasses));
