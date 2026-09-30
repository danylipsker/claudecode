/* The Puzzle Cabinet · tools/gen/tatham1.js
 *
 *   node tools/gen/tatham1.js                    writes all five data files
 *   node tools/gen/tatham1.js tents hitori       only these (tents, dominosa, hitori, fillomino, shikaku)
 *
 * The making itself is in js/lib/tatham1-logic.js (the Endless drawers use
 * the same code); here it runs with fixed seeds and a plan of sizes and
 * logic levels:
 *
 * data/tents.js      tents placed at random (never touching), a tree beside
 *                    each; kept when the counts allow exactly one camp
 * data/dominosa.js   a random tiling of the rectangle, a full set dealt onto
 *                    it, numbers swapped until only one layout fits
 * data/hitori.js     a random Latin square; black cells that never touch,
 *                    keep the white area whole and pin every white cell;
 *                    each black cell copies a white number of its line
 * data/fillomino.js  a random cut into groups of 1–9, then clues taken away
 *                    while rules alone still finish the grid
 * data/shikaku.js    a random cut into rectangles, a number in each, moved
 *                    until only one cut fits
 * Every puzzle is graded by the logic it needs and checked by verify().
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'js/lib/tatham1-logic.js'));
require(path.join(ROOT, 'engines/tatham1.js'));
const T = C.tatham1;
const E = C.engines.tatham1;

const want = process.argv.slice(2);
const doIt = (k) => !want.length || want.includes(k);

function writeFamily(file, meta, puzzles) {
  const lines = [];
  lines.push('/* The Puzzle Cabinet · data/' + file + ' — made by tools/gen/tatham1.js */');
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

// run a plan: rows end with the count wanted; make(row) returns a puzzle or null
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
function titled(list, titles, prefix) {
  const used = new Set();
  return list.map((x, k) => {
    let t = titles[k] || prefix + ' ' + (k + 1);
    while (used.has(t)) t += ' II';
    used.add(t);
    return t;
  });
}

/* ---------- tents ---------- */

function genTents() {
  const rng = C.rng(20260930 + 101);
  // [w, h, density, logic level allowed, wanted top level (0 any), count]
  const plan = [[5, 5, 0.2, 1, 1, 4], [6, 6, 0.2, 1, 1, 6], [7, 7, 0.2, 1, 1, 4], [7, 7, 0.21, 2, 2, 3], [8, 8, 0.2, 1, 1, 3], [8, 8, 0.2, 2, 2, 5],
    [10, 10, 0.2, 2, 2, 6], [10, 10, 0.2, 3, 3, 4], [12, 12, 0.2, 2, 2, 4], [12, 12, 0.2, 3, 3, 5], [15, 15, 0.2, 3, 3, 6]];
  const out = makeMany('tents', plan, ([w, h, dens, lv, top]) => {
    const t = T.tnMake(w, h, rng, dens, lv);
    return t && (!top || t.grade.top === top) ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['First Night Out', 'Pitch Perfect', 'Base Camp', 'Guy Ropes', 'Tent Pegs', 'Under Canvas', 'The Clearing', 'Pine Grove',
    'Birch Wood', 'Orchard Rows', 'Campfire Circle', 'Sleeping Bags', 'Midsummer Meadow', 'Scout Jamboree', 'Glamping', 'Forest Floor',
    'The Copse', 'Willow Bend', 'Oak and Ash', 'Nature Trail', 'Bivouac', 'Wild Camping', 'Rainfly', 'Ridge Pole', 'Canvas City',
    'Toadstool Ring', 'The Spinney', 'Beech Avenue', 'Larch Lane', 'Chestnut Walk', 'Holly Bush', 'Rowan Row', 'Elder Field', 'Hazel Hollow',
    'Maple Glade', 'Cedar Ridge', 'Poplar Line', 'Aspen Hill', 'Yew Tree Corner', 'Sycamore Square', 'Alder Marsh', 'Linden Park',
    'Hawthorn Hedge', 'Juniper Heath', 'Cypress Point', 'Walnut Grove', 'Elm Street Camp', 'Greenwood', 'Sherwood', 'The Big Woods'];
  const names = titled(out, TITLES, 'Camp');
  const puzzles = out.map((t, k) => ({
    id: 'tents-' + pad3(k + 1),
    title: names[k],
    diff: t.diff,
    text: E.textFor({ kind: 'tents' }),
    concepts: ['deduction', 'graph'],
    tags: [t.w + 'x' + t.h, 'tents and trees', 'tatham'],
    data: { kind: 'tents', grid: t.grid, rows: t.rows, cols: t.cols, sol: t.sol }
  }));
  writeFamily('tents.js', {
    id: 'tents', engine: 'tatham1', cat: 'pencil', name: 'Tents', order: 30,
    blurb: 'A tent beside every tree, no two tents touching, and the counts along the edge must come out right.',
    origin: { who: 'Dutch and Belgian puzzle magazines', note: 'Tents, also sold as *Tents and Trees*, grew up in the puzzle magazines of the Netherlands and Belgium. The rules here are the ones in Simon Tatham\'s Portable Puzzle Collection, where it is simply called Tents.' },
    concepts: ['deduction', 'graph']
  }, puzzles);
}

/* ---------- dominosa ---------- */

function genDominosa() {
  const rng = C.rng(20260930 + 202);
  // [n (double-n set), logic level allowed, wanted top level (0 any), count]
  const plan = [[2, 2, 0, 2], [3, 1, 1, 4], [3, 2, 2, 2], [4, 1, 1, 4], [4, 2, 2, 3], [5, 2, 2, 4], [5, 3, 3, 3], [6, 2, 2, 4], [6, 3, 3, 5], [7, 3, 3, 4], [8, 3, 3, 3], [9, 3, 3, 2]];
  const out = makeMany('dominosa', plan, ([n, lv, top]) => {
    const t = T.dmMake(n, rng, lv, 4000);
    return t && (!top || t.grade.top === top) ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.n - b.n || a.grade.top - b.grade.top);
  const TITLES = ['Double Blank', 'Knock Knock', 'Boneyard', 'Spinner', 'Train Game', 'Muggins', 'All Fives', 'Chickenfoot', 'Draw Game',
    'Block Game', 'Pips', 'Tiles Face Up', 'Double Six', 'Snake Eyes', 'The Shuffle', 'The Full Set', 'Line of Play', 'Domino Effect',
    'Matador', 'Sniff', 'Bergen', 'Fives and Threes', 'Cross Game', 'Sebastopol', 'Bones on the Table', 'Ivory and Ebony', 'Every Pair Once',
    'Back to Back', 'Twin Spots', 'Half and Half', 'Side by Side', 'Laid Face Up', 'Lost Lines', 'Double Trouble', 'Count the Spots',
    'Set in Stone', 'Clack', 'Tile Hunt', 'Double Nine', 'The Last Bone'];
  const names = titled(out, TITLES, 'Set');
  const puzzles = out.map((t, k) => ({
    id: 'dominosa-' + pad3(k + 1),
    title: names[k],
    diff: t.diff,
    text: E.textFor({ kind: 'dominosa', n: t.n }),
    concepts: ['exact-cover', 'deduction'],
    tags: ['double ' + t.n, (t.n + 1) + 'x' + (t.n + 2), 'dominoes', 'tatham'],
    data: { kind: 'dominosa', n: t.n, grid: t.grid, sol: t.sol }
  }));
  writeFamily('dominosa.js', {
    id: 'dominosa', engine: 'tatham1', cat: 'pencil', name: 'Dominosa', order: 31,
    blurb: 'A full set of dominoes lies face up with the lines between them rubbed out. Find every one.',
    origin: { who: 'a domino puzzle of many names', note: 'Puzzles about finding a set of dominoes hidden in a grid of numbers have been printed under several names. Simon Tatham\'s Portable Puzzle Collection calls this one Dominosa, and the rules here are his: a full double-n set, every domino exactly once.' },
    concepts: ['exact-cover', 'deduction']
  }, puzzles);
}

/* ---------- singles ---------- */

function genHitori() {
  const rng = C.rng(20260930 + 303);
  // [n, logic level allowed, wanted top level (0 any), count]
  const plan = [[4, 2, 0, 3], [5, 2, 2, 6], [6, 2, 2, 7], [7, 2, 2, 5], [7, 3, 3, 3], [8, 2, 2, 5], [8, 3, 3, 4], [9, 2, 2, 5], [9, 3, 3, 4], [10, 2, 2, 3], [10, 3, 3, 5]];
  const out = makeMany('singles', plan, ([n, lv, top]) => {
    const t = T.htMake(n, rng, lv, 3000);
    return t && (!top || t.grade.top === top) ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.n - b.n || a.grade.top - b.grade.top);
  const TITLES = ['Table for One', 'Solo', 'Party of One', 'Only Child', 'One of a Kind', 'Solitaire', 'Hermit', 'Lighthouse Keeper',
    'Island', 'Odd One Out', 'No Twins', 'Seeing Double', 'Déjà Vu', 'Echo', 'Say It Once', 'Singular', 'Monologue', 'Solo Flight',
    'Single File', 'Loner', 'Recluse', 'Private Room', 'Do Not Disturb', 'Unaccompanied', 'Soloist', 'A Cappella', 'Standalone',
    'Once Only', 'Single Serving', 'Singleton', 'Single Malt', 'Solo Sailor', 'Hitchhiker', 'Castaway', 'Wallflower', 'Sole Survivor',
    'Unrepeatable', 'No Encores', 'Blackout', 'Shades', 'Eclipse', 'Stepping Stones', 'Checkered Past', 'Black Squares', 'Cold Shoulder',
    'Personal Space', 'Lone Wolf', 'One-Man Band', 'Solo Act', 'Leave Me Alone'];
  const names = titled(out, TITLES, 'Singles');
  const puzzles = out.map((t, k) => ({
    id: 'hitori-' + pad3(k + 1),
    title: names[k],
    diff: t.diff,
    text: E.textFor({ kind: 'hitori' }),
    concepts: ['deduction', 'graph'],
    tags: [t.n + 'x' + t.n, 'hitori', 'singles', 'tatham'],
    data: { kind: 'hitori', grid: t.grid, sol: t.sol }
  }));
  writeFamily('hitori.js', {
    id: 'hitori', engine: 'tatham1', cat: 'pencil', name: 'Singles', order: 32,
    blurb: 'Black out repeated numbers — but black cells may not touch, and the white ones must stay joined.',
    origin: { who: 'Nikoli, Japan', note: 'Hitori comes from the Japanese puzzle publisher Nikoli; the name is short for “Hitori ni shite kure”, “leave me alone”. Simon Tatham\'s Portable Puzzle Collection calls it Singles, with exactly these rules.' },
    concepts: ['deduction', 'graph']
  }, puzzles);
}

/* ---------- filling ---------- */

function genFillomino() {
  const rng = C.rng(20260930 + 404);
  // [w, h, logic level, count]
  const plan = [[5, 5, 1, 5], [6, 6, 1, 5], [8, 8, 1, 4], [7, 7, 2, 4], [8, 8, 2, 5], [9, 9, 2, 5], [8, 8, 3, 4], [10, 8, 3, 4], [10, 10, 3, 4]];
  const out = makeMany('filling', plan, ([w, h, lv]) => {
    const t = T.flMake(w, h, rng, lv, 60000);
    return t && t.top === lv ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.top - b.top);
  const TITLES = ['Birds of a Feather', 'Safety in Numbers', 'Head Count', 'Party Sizes', 'Table Plan', 'Seating Chart', 'Group Photo',
    'Book Club', 'Quartet', 'Trio', 'Duets', 'Septet', 'Octet', 'Nine Lives', 'Allotments', 'Patchwork', 'Quilting Bee', 'Garden Beds',
    'Fields and Hedges', 'Parish Map', 'Neighbours', 'Room Sizes', 'Flatshare', 'Family Groups', 'Flocks', 'Herds', 'Shoals', 'Swarms',
    'Teams', 'Crews', 'Packs', 'Troupes', 'Clusters', 'Archipelago', 'Continents', 'Estates', 'Counties', 'Jigsaw', 'Crowd Control', 'Tribes',
    'Colonies', 'Pods'];
  const names = titled(out, TITLES, 'Filling');
  const puzzles = out.map((t, k) => ({
    id: 'fillomino-' + pad3(k + 1),
    title: names[k],
    diff: t.diff,
    text: E.textFor({ kind: 'fillomino' }),
    concepts: ['deduction'],
    tags: [t.w + 'x' + t.h, 'fillomino', 'filling', 'tatham'],
    data: { kind: 'fillomino', grid: t.grid, sol: t.sol }
  }));
  writeFamily('fillomino.js', {
    id: 'fillomino', engine: 'tatham1', cat: 'pencil', name: 'Filling', order: 33,
    blurb: 'Fill the grid with numbers so that every group of equal numbers is exactly that big.',
    origin: { who: 'Nikoli, Japan', note: 'Fillomino is one of the classic puzzles of the Japanese publisher Nikoli. Simon Tatham\'s Portable Puzzle Collection calls it Filling, with exactly these rules.' },
    concepts: ['deduction']
  }, puzzles);
}

/* ---------- rectangles ---------- */

function genShikaku() {
  const rng = C.rng(20260930 + 505);
  // [w, h, largest area, logic level allowed, lowest top level wanted, count]
  const plan = [[5, 5, 6, 1, 0, 4], [6, 6, 7, 1, 0, 4], [7, 7, 8, 2, 0, 5], [8, 8, 9, 2, 0, 4], [9, 9, 12, 2, 0, 4], [10, 10, 12, 2, 0, 4], [11, 11, 14, 3, 0, 4], [12, 12, 16, 3, 0, 4], [13, 13, 18, 3, 2, 4], [14, 14, 20, 3, 0, 3], [15, 15, 22, 3, 0, 3], [15, 15, 22, 3, 2, 3], [17, 17, 26, 3, 2, 4]];
  const out = makeMany('rectangles', plan, ([w, h, maxA, lv, top]) => {
    const t = T.skMake(w, h, rng, maxA, lv, 5000);
    return t && t.grade.top >= top ? t : null;
  });
  out.sort((a, b) => a.diff - b.diff || a.w * a.h - b.w * b.h || a.grade.top - b.grade.top);
  const TITLES = ['Parcel Post', 'Floor Tiles', 'Window Panes', 'Bookshelf', 'Chocolate Bar', 'Ice Tray', 'Egg Boxes', 'Office Blocks',
    'City Grid', 'Car Park', 'Paddy Fields', 'Tatami Room', 'Shoji Screen', 'Brickwork', 'Paving Slabs', 'Crates', 'Shipping Containers',
    'Storage Units', 'Filing Cabinet', 'Pigeonholes', 'Stamp Sheet', 'Land Registry', 'Surveyor', 'Floor Plan', 'Market Stalls', 'Beach Huts',
    'Picnic Blankets', 'Carpet Samples', 'Wallpaper', 'Circuit Board', 'Pixel Art', 'Sticky Notes', 'Index Cards', 'Plots and Plans',
    'Sash Windows', 'Stained Glass', 'Quilt Blocks', 'Rooftops', 'Solar Panels', 'Bento Box', 'Shelf Life', 'Boxing Clever', 'Square Deal',
    'Right Angles', 'Fair Shares', 'Area Code', 'Allotment Plots', 'Town Planning', 'Cardboard City', 'The Great Divide'];
  const names = titled(out, TITLES, 'Rectangles');
  const puzzles = out.map((t, k) => ({
    id: 'shikaku-' + pad3(k + 1),
    title: names[k],
    diff: t.diff,
    text: E.textFor({ kind: 'shikaku' }),
    concepts: ['exact-cover', 'deduction'],
    tags: [t.w + 'x' + t.h, 'shikaku', 'rectangles', 'tatham'],
    data: { kind: 'shikaku', w: t.w, h: t.h, clues: t.clues, sol: t.sol }
  }));
  writeFamily('shikaku.js', {
    id: 'shikaku', engine: 'tatham1', cat: 'pencil', name: 'Rectangles', order: 34,
    blurb: 'Cut the grid into rectangles, each holding one number: its own area.',
    origin: { who: 'Nikoli, Japan', note: 'Shikaku (from *Shikaku ni kire*, roughly “divide it into squares”) is a Nikoli puzzle. Simon Tatham\'s Portable Puzzle Collection calls it Rectangles; the rules here are his.' },
    concepts: ['exact-cover', 'deduction']
  }, puzzles);
}

if (doIt('tents')) genTents();
if (doIt('dominosa')) genDominosa();
if (doIt('hitori')) genHitori();
if (doIt('fillomino')) genFillomino();
if (doIt('shikaku')) genShikaku();
