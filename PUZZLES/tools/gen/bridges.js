/* The Puzzle Cabinet · tools/gen/bridges.js
 *
 *   node tools/gen/bridges.js        writes data/bridges.js
 *
 * Königsberg as Euler knew it, its later variants, and invented river towns.
 * Each map is a set of land polygons (drawn smoothed) and candidate bridge
 * slots: a point in the water and a direction; the bridge runs from the shore
 * behind the point to the shore in front of it. A puzzle uses some slots as
 * bridges; for the impossible ones the other slots are building sites, and
 * the fewest new bridges needed is found by search.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/graphlib.js'));
require(path.join(ROOT, 'js/lib/graphgen.js'));
require(path.join(ROOT, 'engines/graphs.js'));
const G = C.geom, GL = C.GraphLib, K = C.graphsKit;
const eng = C.engines.graphs;
const r1 = (v) => Math.round(v * 10) / 10;

// the smoothed outline the engine draws (quadratic curves through the edge midpoints)
function smoothPoly(poly) {
  const n = poly.length, out = [];
  for (let i = 0; i < n; i++) {
    const a = G.mid(poly[(i - 1 + n) % n], poly[i]), c = poly[i], b = G.mid(poly[i], poly[(i + 1) % n]);
    for (let k = 0; k < 8; k++) { const t = k / 8, u = 1 - t; out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]]); }
  }
  return out;
}
function circlePoly(cx, cy, r, n) { return Array.from({ length: n || 12 }, (x, i) => { const a = Math.PI * 2 * i / (n || 12); return [r1(cx + r * Math.cos(a)), r1(cy + r * Math.sin(a))]; }); }

// slot: [a, b, mx, my, dx, dy] — from land a (behind the point) to land b (ahead)
function place(map, slot) {
  const [a, b, mx, my, dx0, dy0] = slot;
  const l = Math.hypot(dx0, dy0), dx = dx0 / l, dy = dy0 / l;
  const polys = map.lands.map((ld) => smoothPoly(ld.p));
  const march = (sign, land) => {
    for (let s = 0; s < 80; s += 0.2) {
      const p = [mx + sign * dx * s, my + sign * dy * s];
      for (let k = 0; k < polys.length; k++) {
        if (G.pointInPoly(p, polys[k])) {
          if (k !== land) throw new Error(map.key + ': slot ' + JSON.stringify(slot) + ' meets land ' + k + ' instead of ' + land);
          return p;
        }
      }
    }
    throw new Error(map.key + ': slot ' + JSON.stringify(slot) + ' finds no shore');
  };
  const pa = march(-1, a), pb = march(1, b);
  return [a, b, r1(pa[0]), r1(pa[1]), r1(pb[0]), r1(pb[1])];
}

/* ---------- the maps ---------- */

const MAPS = {
  konigsberg: {
    key: 'konigsberg',
    lands: [
      { n: 'A · Kneiphof', p: [[30, 47], [36, 42], [50, 41], [66, 41], [74, 45], [76, 50], [73, 56], [62, 59], [45, 59], [34, 56]], at: [52, 50] },
      { n: 'B · north bank', p: [[-10, -10], [170, -10], [170, 28], [130, 29], [100, 27], [80, 31], [55, 32], [30, 30], [10, 31], [-10, 30]], at: [40, 14] },
      { n: 'C · south bank', p: [[-10, 110], [170, 110], [170, 72], [130, 71], [100, 73], [80, 69], [55, 68], [30, 70], [10, 69], [-10, 70]], at: [40, 86] },
      { n: 'D · Lomse', p: [[170, 41], [120, 40], [100, 42], [92, 46], [91, 52], [95, 57], [110, 60], [170, 59]], at: [132, 50] }
    ],
    slots: {
      a: [0, 1, 42, 36, 0, -1], b: [0, 1, 62, 36, 0, -1], c: [0, 2, 42, 64, 0, 1], d: [0, 2, 62, 64, 0, 1],
      e: [0, 3, 84, 53, 1, 0], f: [1, 3, 112, 34, 0, 1], g: [2, 3, 112, 66, 0, -1],
      s1: [1, 2, 12, 50, 0, 1], s2: [0, 3, 84, 44.5, 1, 0], s3: [1, 3, 146, 34.5, 0, 1], s4: [2, 3, 146, 65.5, 0, -1], s5: [0, 1, 52, 36, 0, -1], s6: [0, 2, 52, 64, 0, 1]
    }
  },
  swan: {
    key: 'swan',
    lands: [
      { n: 'North bank', p: [[-10, -10], [170, -10], [170, 30], [140, 32], [110, 29], [80, 31], [50, 29], [20, 31], [-10, 30]], at: [80, 14] },
      { n: 'South bank', p: [[-10, 110], [170, 110], [170, 70], [140, 68], [110, 71], [80, 69], [50, 71], [20, 69], [-10, 70]], at: [80, 86] },
      { n: 'Swan Island', p: [[45, 47], [55, 41], [80, 40], [105, 41], [115, 47], [115, 53], [105, 59], [80, 60], [55, 59], [45, 53]], at: [80, 50] }
    ],
    slots: {
      n1: [2, 0, 58, 35, 0, -1], n2: [2, 0, 80, 35, 0, -1], n3: [2, 0, 102, 35, 0, -1],
      s1: [2, 1, 58, 65, 0, 1], s2: [2, 1, 80, 65, 0, 1], s3: [2, 1, 102, 65, 0, 1],
      w: [0, 1, 16, 50, 0, 1], e: [0, 1, 144, 50, 0, 1], w2: [0, 1, 32, 50, 0, 1], e2: [0, 1, 128, 50, 0, 1]
    }
  },
  twin: {
    key: 'twin',
    lands: [
      { n: 'North bank', p: [[-10, -10], [170, -10], [170, 30], [140, 32], [110, 29], [80, 31], [50, 29], [20, 31], [-10, 30]], at: [80, 14] },
      { n: 'South bank', p: [[-10, 110], [170, 110], [170, 70], [140, 68], [110, 71], [80, 69], [50, 71], [20, 69], [-10, 70]], at: [80, 86] },
      { n: 'Mill Island', p: [[22, 47], [30, 41], [45, 40], [60, 41], [67, 47], [67, 53], [60, 59], [45, 60], [30, 59], [22, 53]], at: [45, 50] },
      { n: 'Church Island', p: [[93, 47], [100, 41], [115, 40], [130, 41], [138, 47], [138, 53], [130, 59], [115, 60], [100, 59], [93, 53]], at: [115, 50] }
    ],
    slots: {
      m1: [2, 0, 35, 35, 0, -1], m2: [2, 0, 55, 35, 0, -1], m3: [2, 1, 35, 65, 0, 1], m4: [2, 1, 55, 65, 0, 1],
      c1: [3, 0, 105, 35, 0, -1], c2: [3, 0, 125, 35, 0, -1], c3: [3, 1, 105, 65, 0, 1], c4: [3, 1, 125, 65, 0, 1],
      i1: [2, 3, 80, 45, 1, 0], i2: [2, 3, 80, 55, 1, 0],
      w: [0, 1, 9, 50, 0, 1], e: [0, 1, 152, 50, 0, 1]
    }
  },
  confluence: {
    key: 'confluence',
    lands: [
      { n: 'West Town', p: [[-10, -10], [70, -10], [71, 15], [69, 35], [72, 53], [40, 56], [10, 54], [-10, 55]], at: [34, 27] },
      { n: 'East Town', p: [[86, -10], [170, -10], [170, 55], [140, 53], [110, 56], [88, 54], [85, 35], [87, 15]], at: [128, 27] },
      { n: 'South Fields', p: [[-10, 110], [170, 110], [170, 85], [140, 83], [110, 86], [80, 84], [50, 86], [20, 84], [-10, 85]], at: [60, 96] },
      { n: 'Heron Isle', p: [[108, 67], [115, 63], [125, 62], [135, 63], [142, 67], [142, 73], [135, 77], [125, 78], [115, 77], [108, 73]], at: [125, 70] }
    ],
    slots: {
      t1: [0, 1, 78, 12, 1, 0], t2: [0, 1, 78, 34, 1, 0],
      ws1: [0, 2, 20, 70, 0, 1], ws2: [0, 2, 50, 70, 0, 1],
      ei1: [1, 3, 118, 58.5, 0, 1], ei2: [1, 3, 132, 58, 0, 1],
      is1: [3, 2, 118, 81.5, 0, 1], is2: [3, 2, 132, 81, 0, 1],
      es1: [1, 2, 96, 70, 0, 1], es2: [1, 2, 157, 70, 0, 1]
    }
  },
  canals: {
    key: 'canals',
    lands: [
      { n: 'Northwest', p: [[-10, -10], [66, -10], [66, 30], [64, 35], [58, 36], [-10, 36]], at: [30, 18] },
      { n: 'Northeast', p: [[94, -10], [170, -10], [170, 36], [102, 36], [96, 35], [94, 30]], at: [130, 18] },
      { n: 'Southwest', p: [[-10, 110], [66, 110], [66, 70], [64, 65], [58, 64], [-10, 64]], at: [30, 84] },
      { n: 'Southeast', p: [[94, 110], [170, 110], [170, 64], [102, 64], [96, 65], [94, 70]], at: [130, 84] },
      { n: 'The Plaza', p: circlePoly(80, 50, 8.5, 12), at: [80, 50] }
    ],
    slots: {
      n1: [0, 1, 80, 12, 1, 0], n2: [0, 1, 80, 26, 1, 0], s1: [2, 3, 80, 88, 1, 0], s2: [2, 3, 80, 74, 1, 0],
      w1: [0, 2, 24, 50, 0, 1], w2: [0, 2, 46, 50, 0, 1], e1: [1, 3, 114, 50, 0, 1], e2: [1, 3, 136, 50, 0, 1],
      pnw: [0, 4, 69, 40, 1, 0.95], pne: [1, 4, 91, 40, -1, 0.95], psw: [2, 4, 69, 60, 1, -0.95], pse: [3, 4, 91, 60, -1, -0.95]
    }
  },
  bay: {
    key: 'bay',
    lands: [
      { n: 'The Mainland', p: [[-10, -10], [170, -10], [170, 12], [120, 14], [90, 12], [60, 16], [40, 24], [30, 40], [28, 60], [36, 76], [55, 86], [90, 88], [120, 86], [170, 88], [170, 110], [-10, 110]], at: [14, 50] },
      { n: 'Gull Rock', p: [[50, 48], [54, 42], [62, 41], [69, 45], [70, 52], [65, 58], [57, 59], [51, 55]], at: [60, 50] },
      { n: 'Seal Isle', p: [[88, 32], [94, 26], [104, 25], [113, 29], [114, 37], [108, 43], [97, 43], [89, 39]], at: [101, 34] },
      { n: 'Lighthouse Isle', p: [[92, 66], [98, 60], [108, 59], [117, 63], [118, 71], [112, 77], [101, 77], [93, 73]], at: [105, 68] }
    ],
    slots: {
      mg1: [0, 1, 40, 50, 1, 0], mg2: [0, 1, 56, 31, 0, 1], mg3: [0, 1, 58, 70, 0, -1],
      ms1: [0, 2, 100, 19, 0, 1], ms2: [0, 2, 124, 22, -1, 0.9],
      ml1: [0, 3, 105, 82, 0, -1], ml2: [0, 3, 126, 80, -1, -0.9],
      gs: [1, 2, 79, 39, 1, -0.6], gl: [1, 3, 80, 62, 1, 0.55], sl1: [2, 3, 103, 51, 0, 1], sl2: [2, 3, 111, 51, 0.1, 1]
    }
  }
};

function mapData(map, used, sites, goal) {
  const d = {
    kind: 'bridges', w: 160, h: 100,
    lands: map.lands.map((ld) => ({ n: ld.n, p: ld.p, at: ld.at })),
    br: used.map((k) => place(map, map.slots[k])),
    goal
  };
  if (sites && sites.length) d.sites = sites.map((k) => place(map, map.slots[k]));
  return d;
}
function finish(d) {
  const n = d.lands.length;
  const E = K.bridgeEdges(d);
  const s = K.walkable(n, E, d.goal === 'tour');
  if (s != null) {
    const walk = GL.eulerFrom(n, E, [], s);
    d.walk = [s].concat(walk);
    delete d.sites;
    return true;
  }
  const mb = K.minBuild(d);
  if (mb.k < 0) return false;
  d.build = mb.k;
  return true;
}
function oddCount(d) { return GL.odd(d.lands.length, K.bridgeEdges(d)).length; }

function main() {
  const P = [];
  const KB = MAPS.konigsberg;
  const euler7 = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  const kbSites = ['s1', 's2', 's3', 's4', 's5', 's6'];
  {
    const d = mapData(KB, euler7, kbSites, 'walk'); finish(d);
    P.push({
      id: 'bridges-konigsberg', title: 'The Seven Bridges of Königsberg', diff: 2, year: 1736,
      source: 'Leonhard Euler, *Solutio problematis ad geometriam situs pertinentis* (1736).',
      text: 'The river Pregel flows through Königsberg around two islands, and seven bridges join the four pieces of land. The townsfolk liked to ask whether one could take a stroll that crosses every bridge exactly once. (You need not end where you began.) Try it — and if you become sure it cannot be done, say so.',
      hints: ['Count the bridges that touch each piece of land.', 'Each time you walk onto a piece of land and off again, you use two of its bridges. What does that mean for land with an odd number of bridges?'],
      explain: 'Euler\'s argument: every time the walk passes over a piece of land it uses two of its bridges, one in and one out. So only the start and the end of the walk can have an odd number of bridges. In Königsberg the island A has five bridges and B, C and D three each — four odd pieces of land, but a walk has only two ends. No such walk exists. Euler proved this in 1736 without ever needing a map drawn to scale, and so began graph theory. One new bridge between two of the odd pieces makes the walk possible.',
      concepts: ['euler-path', 'graph', 'parity'], tags: ['classic', 'konigsberg'], data: d
    });
  }
  {
    const d = mapData(KB, euler7, kbSites, 'tour'); finish(d);
    P.push({
      id: 'bridges-konigsberg-home', title: 'Home for Supper', diff: 2,
      text: 'The same seven bridges, but now the stroll must end back where it started — in time for supper. Can it be done? If not, how many new bridges would the town need to build, at the least?',
      hints: ['For a walk that ends where it started, every piece of land needs an even number of bridges.', 'Each new bridge changes the count at two pieces of land. Four pieces are odd.'],
      explain: 'A round walk has no ends, so every piece of land must have an even number of bridges. Four pieces are odd, and a new bridge fixes two at a time: two new bridges are the least — for example one between the two banks and a second between the Kneiphof and the Lomse.',
      concepts: ['euler-path', 'parity'], tags: ['konigsberg'], data: d
    });
  }
  {
    const d = mapData(KB, euler7.concat(['s1']), null, 'walk'); finish(d);
    P.push({
      id: 'bridges-eighth', title: 'The Eighth Bridge', diff: 2,
      text: 'Suppose the town builds an eighth bridge, far to the west, joining the north bank straight to the south bank. Now take the stroll: every bridge exactly once.',
      hints: ['Count again: which pieces of land still have an odd number of bridges?', 'Start on one of the two odd pieces.'],
      explain: 'The new bridge makes the two banks even (four bridges each). Only the Kneiphof (five) and the Lomse (three) stay odd, so the walk must start on one of them and finish on the other.',
      concepts: ['euler-path', 'parity'], tags: ['konigsberg'], data: d
    });
  }
  {
    const d = mapData(KB, euler7.concat(['s1', 's2']), null, 'tour'); finish(d);
    P.push({
      id: 'bridges-ninth', title: 'The Ninth Bridge', diff: 3,
      text: 'With a ninth bridge between the Kneiphof and the Lomse, every piece of land has an even number of bridges. Take a round stroll over all nine, once each, and come home.',
      explain: 'All four pieces of land are even (Kneiphof six, the rest four each), so a round walk exists — and it can start anywhere.',
      concepts: ['euler-path'], tags: ['konigsberg'], data: d
    });
  }

  // invented towns
  const TOWNS = [
    { map: 'swan', town: 'Swanford', about: 'Swanford straddles a river with Swan Island in the middle.' },
    { map: 'twin', town: 'Twinmere', about: 'In Twinmere the river holds two islands: Mill Island with its water wheel and Church Island with its spire.' },
    { map: 'confluence', town: 'Forkham', about: 'Forkham stands where a brook runs into the river; Heron Isle sits in the river just below.' },
    { map: 'canals', town: 'the canal quarter', about: 'Two canals cross in the old quarter, cutting it into four blocks, with a little round plaza where they meet.' },
    { map: 'bay', town: 'Gull Bay', about: 'The harbour town of Gull Bay looks out on three islands linked to the shore and to each other by footbridges.' }
  ];
  const rng = C.rng(17360);
  const seen = new Set();
  const plan = [
    // [town, want: 'walk' | 'tour' | 'imp-walk' | 'imp-tour', min bridges, max bridges]
    [0, 'walk', 4, 5], [0, 'tour', 4, 6], [0, 'imp-tour', 4, 5], [0, 'imp-tour', 6, 7],
    [1, 'walk', 6, 8], [1, 'tour', 6, 9], [1, 'imp-walk', 7, 9], [1, 'walk', 9, 11],
    [2, 'walk', 5, 7], [2, 'imp-walk', 6, 8], [2, 'tour', 6, 8], [2, 'imp-tour', 7, 9],
    [3, 'walk', 6, 8], [3, 'imp-tour', 7, 9], [3, 'tour', 8, 10], [3, 'imp-walk', 9, 11],
    [4, 'walk', 6, 8], [4, 'imp-walk', 6, 8], [4, 'tour', 7, 9], [1, 'tour', 12, 12], [3, 'walk', 11, 11], [1, 'imp-tour', 10, 11], [4, 'imp-tour', 7, 8]
  ];
  plan.forEach(([ti, want, lo, hi], idx) => {
    const T = TOWNS[ti], map = MAPS[T.map];
    const keys = Object.keys(map.slots);
    let made = null;
    for (let t = 0; t < 4000 && !made; t++) {
      const k = lo + rng.int(hi - lo + 1);
      if (k > keys.length) continue;
      const pick = rng.shuffle(keys.slice()).slice(0, k).sort();
      const sig = T.map + ':' + pick.join(',');
      if (seen.has(sig)) continue;
      const rest = keys.filter((x) => !pick.includes(x));
      const goal = want.endsWith('tour') ? 'tour' : 'walk';
      const d = mapData(map, pick, rest, goal);
      const n = d.lands.length;
      // every piece of land reachable
      const adj = GL.adjacency(n, K.bridgeEdges(d));
      if (!GL.connected(n, adj, new Uint8Array(n).fill(1))) continue;
      const od = oddCount(d);
      if (want === 'walk' && od !== 2) continue;
      if (want === 'tour' && od !== 0) continue;
      if (want.startsWith('imp') && (goal === 'walk' ? od < 4 : od < 2)) continue;
      if (!finish(d)) continue;
      if (want.startsWith('imp') && (d.build < 1 || (want === 'imp-walk' && od >= 6 && d.build > 2))) continue;
      seen.add(sig);
      made = d;
    }
    if (!made) throw new Error('could not make ' + want + ' for ' + T.map);
    const nb = made.br.length, nl = made.lands.length;
    const imp = made.build != null;
    const goalText = made.goal === 'tour' ? 'crosses every bridge exactly once and ends where it began' : 'crosses every bridge exactly once (it may end anywhere)';
    const text = T.about + ' ' + cap(numWord(nb)) + ' bridges join its ' + numWord(nl) + ' pieces of land. Is there a stroll that ' + goalText + '? Walk it — or, if it cannot be done, say so and build the fewest new bridges that would make it possible.';
    let diff = nb <= 5 ? 1 : nb <= 8 ? 2 : nb <= 10 ? 3 : 4;
    if (imp && made.build >= 2) diff = Math.min(5, diff + 1);
    P.push({ id: '', title: titleFor(T, made, idx), diff, text, concepts: ['euler-path', 'parity'], tags: [imp ? 'impossible' : 'walk'], data: made });
  });

  P.sort((a, b) => a.diff - b.diff);
  let k = 0;
  const titles = new Set();
  P.forEach((p) => {
    if (!p.id) p.id = 'bridges-' + String(++k).padStart(2, '0');
    let t = p.title, rn = 1;
    while (titles.has(t)) t = p.title + ' ' + ['', 'II', 'III', 'IV'][rn++];
    p.title = t;
    titles.add(t);
    const r = eng.verify(p);
    if (!r.ok) throw new Error(p.id + ': ' + r.err);
  });
  const meta = {
    id: 'bridges', engine: 'graphs', cat: 'routes', name: 'Bridges of Königsberg', order: 3,
    blurb: 'Take a stroll over every bridge exactly once — or prove it cannot be done, and build the fewest new bridges that would make it possible.',
    origin: { year: 1736, who: 'Leonhard Euler', note: 'The people of Königsberg wondered whether a walk could cross each of the town\'s seven bridges exactly once. Euler showed in 1736 that it could not — and why — and so began graph theory.' },
    concepts: ['euler-path', 'graph', 'parity']
  };
  const lines = P.map((p) => '  ' + JSON.stringify(p));
  const out = '/* The Puzzle Cabinet · data/bridges.js — made by tools/gen/bridges.js */\nCabinet.family(' + JSON.stringify(meta, null, 2) + ', [\n' + lines.join(',\n') + '\n]);\n';
  fs.writeFileSync(path.join(ROOT, 'data/bridges.js'), out);
  const cnt = {};
  P.forEach((p) => { cnt[p.diff] = (cnt[p.diff] || 0) + 1; });
  console.log('bridges: ' + P.length + ' puzzles ' + JSON.stringify(cnt) + ', ' + Math.round(out.length / 1024) + ' KB');
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function numWord(n) { return C.GraphGen.NUM[n] || String(n); }
function titleFor(T, d, idx) {
  const nb = d.br.length;
  const base = { swan: 'Swanford', twin: 'Twinmere', confluence: 'Forkham', canals: 'The Canal Quarter', bay: 'Gull Bay' }[T.map];
  const tail = d.goal === 'tour' ? ['a Round Walk', 'a Sunday Circuit', 'an Evening Round', 'a Grand Loop'] : ['a Stroll', 'a Morning Walk', 'a Ramble', 'an Errand'];
  return base + ': ' + cap(numWord(nb)) + ' Bridges, ' + (d.build != null ? 'a Question' : tail[idx % tail.length]);
}

main();
