/* The Puzzle Cabinet · tools/gen/mapcolor.js
 *
 *   node tools/gen/mapcolor.js        writes data/map-colouring.js
 *
 * A few maps made by hand to show the ideas (slices that meet at a point,
 * odd and even wheels, lines drawn right across), then maps made by the
 * engine's own generator with fixed seeds. Every puzzle passes verify(): the
 * colouring exists, and where the pre-coloured regions claim to leave one
 * way only, the search proves there is exactly one.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/mapgen.js'));
require(path.join(ROOT, 'engines/mapcolor.js'));
const L = C.MapGen, E = C.engines.mapcolor;

// n slices of a round pie (no middle): neighbours share a cut, opposite slices only the centre
function pizza(nSlices, r) {
  r = r || 300;
  const pts = [400, 400], R = [];
  const ring = [];
  const per = Math.max(4, Math.round(48 / nSlices));
  for (let s = 0; s < nSlices; s++) {
    for (let q = 0; q < per; q++) {
      const a = (s + q / per) * 2 * Math.PI / nSlices - Math.PI / 2;
      pts.push(Math.round(400 + r * Math.cos(a)), Math.round(400 + r * Math.sin(a)));
      ring.push(pts.length / 2 - 1);
    }
  }
  for (let s = 0; s < nSlices; s++) {
    const loop = [0];
    for (let q = 0; q <= per; q++) loop.push(ring[(s * per + q) % ring.length]);
    R.push(loop);
  }
  return { pts, R, round: 1 };
}
// a triangle in a triangle: four regions that all touch
function fourTouch() {
  const pts = [400, 60, 740, 640, 60, 640, 400, 300, 520, 500, 280, 500];
  return { pts, R: [[3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]] };
}

const specials = [
  { slug: 'pizza-six', title: 'Pizza for Six', diff: 1, data: Object.assign(pizza(6), { k: 2, mode: 'free' }),
    text: 'Colour the six slices with just **two** colours so that slices sharing a cut differ. Slices that meet only at the very centre do not count as neighbours.',
    explain: 'Round an even ring the two colours simply take turns: Rose, Saffron, Rose, Saffron… Opposite slices touch only at a point, which is allowed.' },
  { slug: 'pizza-five', title: 'Five Slices', diff: 1, data: Object.assign(pizza(5), { k: 3, mode: 'free' }),
    text: 'Five slices this time. Two colours taking turns will not quite go round — use **three**.',
    explain: 'Around an odd ring, alternating two colours leaves the last slice next to two different colours already, or next to its own. One slice needs a third colour. Odd rings are where the difficulty in map colouring comes from.', links: ['maps-odd-wheel'] },
  { slug: 'four-touch', title: 'Everybody Touches Everybody', diff: 1, data: Object.assign(fourTouch(), { k: 4, mode: 'free' }),
    text: 'Four regions, and each shares a border with all three others. Colour them.',
    explain: 'When four regions all touch one another, each needs its own colour — so no rule with fewer than four colours can work for every map. Five regions can never all touch each other on a flat map, which is one reason four might be enough (proving it is far harder).' },
  { slug: 'odd-wheel', title: 'The Odd Wheel', diff: 2, data: Object.assign(L.radialMap([{ n: 5, off: 0 }], [120, 300]), { mode: 'can3', ans: false }),
    text: 'A round field in the middle, and five fields in a ring around it. Could three colours be enough?',
    explain: 'No. The ring of five needs three colours, because two colours cannot alternate round an odd ring. The middle field touches all five, so it can use none of those three: a fourth colour is needed. A region inside an odd ring of neighbours — an **odd wheel** — always forces four colours.', links: ['maps-even-wheel'] },
  { slug: 'even-wheel', title: 'The Even Wheel', diff: 2, data: Object.assign(L.radialMap([{ n: 6, off: 0 }], [120, 300]), { mode: 'can3', ans: true }),
    text: 'The same idea with six fields round the middle. Three colours enough, or not?',
    explain: 'Yes: the ring of six alternates between two colours, and the middle takes the third. Whether a ring is odd or even makes all the difference.', links: ['maps-odd-wheel'] },
  { slug: 'lines-across', title: 'Lines Across', diff: 2, data: Object.assign(L.glassMap(C.rng(51), 5, true), { k: 2, mode: 'free' }),
    text: 'This map was made by drawing five straight lines right across a sheet. Colour it with only **two** colours.',
    explain: 'Any map made by lines drawn right across can be coloured with two colours: colour each region by whether it lies on the “upper” side of an even or an odd number of lines. Crossing any border crosses exactly one line, so the count changes by one and the colour flips.' },
  { slug: 'more-lines', title: 'Seven Lines', diff: 3, data: Object.assign(L.glassMap(C.rng(77), 7, true, 900, 640, 'oct'), { k: 2, mode: 'free' }),
    text: 'Seven straight lines across an eight-sided board. Two colours will do — find how.' },
  { slug: 'dartboard', title: 'The Dartboard', diff: 3, data: Object.assign(L.radialMap([{ n: 6, off: 0 }, { n: 12, off: 15 }], [80, 200, 320]), { mode: 'can3' }),
    text: 'A bull, a ring of six and an outer ring of twelve, the outer fields staggered against the inner ones. Can three colours manage?' },
  { slug: 'target', title: 'Target Practice', diff: 3, data: Object.assign(L.radialMap([{ n: 4, off: 45 }, { n: 7, off: 0 }], [80, 200, 320]), { mode: 'can3' }),
    text: 'A bull, a ring of four and an outer ring of seven. Three colours or four?' }
];
specials.forEach((s) => { s.data.ans = s.data.mode === 'can3' ? L.colourable(L.build(s.data).adj, 3) : s.data.ans; });

// a rose window: a unique colouring with a few panes coloured in
function roseWindow(rng, rings, radii, k) {
  const d = L.radialMap(rings, radii);
  const M = L.build(d);
  const b = L.bestUnique(M.adj, k, rng, 8);
  d.k = k; d.mode = 'unique'; d.giv = b.giv;
  return d;
}
specials.push(
  { slug: 'rose-window', title: 'Rose Window', diff: 3, data: roseWindow(C.rng(3), [{ n: 8, off: 0 }, { n: 16, off: 11.25 }], [70, 180, 300], 4),
    text: 'A round church window of coloured panes. Colour the rest with the four colours, no two neighbouring panes alike; the panes already coloured leave only one way.' },
  { slug: 'great-rose', title: 'The Great Rose', diff: 4, data: roseWindow(C.rng(8), [{ n: 6, off: 0 }, { n: 12, off: 15 }, { n: 18, off: 5 }], [60, 150, 240, 330], 4),
    text: 'A larger window with three rings of panes. Four colours; one way only.' }
);

/* ---------- generated maps ---------- */

const TITLES = {
  grid: ['The Patchwork Quilt', 'Allotments', 'Crazy Paving', 'The Parish Fields', 'Hedgerows', 'The Estate Map', 'Market Gardens', 'The Tiled Floor', 'The Rice Terraces', 'Town Plots', 'Garden Beds', 'The Mosaic', 'The Common Land', 'Enclosures', 'The Sampler', 'Village Greens', 'The Vineyard', 'Orchards', 'The Commons', 'Smallholdings', 'The Glebe', 'Water Meadows', 'Strip Farms', 'The Manor Lands',
    'The Hop Gardens', 'Paddocks', 'The Kitchen Garden', 'Tulip Fields', 'The Parterre', 'Sheepfolds', 'The Lavender Rows', 'Cloister Garth', 'The Tithe Map', 'Flower Borders', 'The Dovecote Field', 'Polders', 'The Bowling Green', 'Salt Pans', 'The Physic Garden', 'Cottage Plots', 'The Maze Garden', 'Pasture and Plough', 'The Quilted Hills', 'Nursery Beds'],
  voronoi: ['Countries', 'The Continent', 'The Federation', 'Provinces', 'The Duchies', 'The Cantons', 'Border Country', 'The Old Kingdoms', 'The Principalities', 'Counties', 'The Marches', 'The League of States', 'Frontiers', 'Dominions', 'The Electorates', 'Baronies', 'The Free Cities', 'Satrapies', 'The Shires', 'Palatinates'],
  glass: ['Stained Glass', 'Cracked Ice', 'The Broken Window', 'Shattered Slate', 'Leaded Lights', 'Crystal', 'The Chapel Window', 'Crazed Glaze'],
  lines: ['Straight Cuts', 'Crossroads', 'Lines Through', 'Ruled Paper', 'The Surveyor\'s Lines', 'Crisscross', 'Laser Beams'],
  island: []
};
const used = new Set(specials.map((s) => s.title));
function title(style, d) {
  if (style === 'island') { let t = d.label; let n = 2; while (used.has(t)) t = d.label + ' ' + ['', '', 'II', 'III', 'IV', 'V'][n++]; used.add(t); return t; }
  const bank = TITLES[style === 'grid3' ? 'grid' : style] || TITLES.grid;
  for (const t of bank) if (!used.has(t)) { used.add(t); return t; }
  let i = 2;
  while (used.has(bank[0] + ' ' + i)) i++;
  used.add(bank[0] + ' ' + i);
  return bank[0] + ' ' + i;
}

const want = { 1: 12, 2: 16, 3: 18, 4: 14, 5: 10 };
const gen = [];
for (let lv = 1; lv <= 5; lv++) {
  let got = 0;
  for (let s = 0; got < want[lv] && s < 400; s++) {
    const p = E.generate(C.rng('gen-map:' + lv + ':' + s), lv, { id: 'map-colouring' });
    if (!p) continue;
    const d = p.data;
    const style = d.g ? 'grid' : d.sea ? 'island' : (d.mode === 'free' && d.k === 2) ? 'lines' : /Stained/.test(p.title) ? 'glass' : 'voronoi';
    // keep the mix varied: at most a third of any one kind at a level
    const key = d.mode + d.k + style;
    const same = gen.filter((g) => g.lv === lv && g.key === key).length;
    if (same >= Math.ceil(want[lv] / 3)) continue;
    gen.push({ lv, key, style, p });
    got++;
  }
}

/* ---------- write ---------- */

const puzzles = [];
specials.forEach((s) => {
  puzzles.push({ id: 'maps-' + s.slug, title: s.title, diff: s.diff, text: s.text, explain: s.explain, links: s.links, data: s.data });
});
let no = 0;
gen.forEach((g) => {
  no++;
  const p = g.p, d = p.data;
  const t = title(g.style, d);
  let text = p.text;
  if (g.style === 'island') text = 'The provinces of ' + d.label.replace(/^The /, 'the ') + '. ' + text;
  puzzles.push({ id: 'maps-' + String(no).padStart(3, '0'), title: t, diff: g.lv, text, data: d });
});
puzzles.forEach((p) => {
  const r = E.verify(p);
  if (!r.ok) throw new Error(p.id + ': ' + r.err);
  if (r.warn) console.log('warn ' + p.id + ': ' + r.warn);
  p.concepts = p.data.mode === 'unique' ? ['graph', 'deduction'] : p.data.mode === 'can3' ? ['graph', 'four-colour'] : ['graph'];
  p.tags = [p.data.mode === 'can3' ? 'three or four' : p.data.k + ' colours', p.data.g ? 'grid' : p.data.sea ? 'island' : 'map'];
});
puzzles.sort((a, b) => a.diff - b.diff);

const q = (v) => JSON.stringify(v);
let out = '/* The Puzzle Cabinet · data/map-colouring.js — made by tools/gen/mapcolor.js */\n';
out += `Cabinet.concepts([
  { id: 'four-colour', name: 'The four-colour theorem', see: ['graph', 'planarity'],
    text: 'Colour any map drawn on a flat sheet so that regions sharing a border differ, and **four colours are always enough**. Francis Guthrie noticed it in 1852 while colouring the counties of England. Alfred Kempe published a proof in 1879 that stood for eleven years until Percy Heawood found the flaw (and proved that five colours are enough). Kenneth Appel and Wolfgang Haken finally proved four in 1976, with a computer checking almost two thousand configurations — the first famous theorem whose proof no one could check by hand.\\n\\nThree colours are not always enough: a region surrounded by an **odd** ring of neighbours (an odd wheel) needs a fourth, because two colours cannot take turns round an odd ring.' }
]);
Cabinet.history([
  { year: 1852, title: 'Four colours for the counties', text: 'Francis Guthrie, colouring a map of the counties of England, notices that four colours seem always to be enough, and the question reaches Augustus De Morgan.', links: ['map-colouring'] },
  { year: 1976, title: 'The four-colour theorem', text: 'Kenneth Appel and Wolfgang Haken prove that four colours suffice for every map, with a computer checking almost two thousand cases.', links: ['map-colouring', 'maps-odd-wheel'] }
]);
`;
out += 'Cabinet.family({\n';
out += "  id: 'map-colouring', engine: 'mapcolor', cat: 'logic', name: 'Colour the map', order: 12,\n";
out += "  blurb: 'Colour every region so that no two neighbours match — with four colours, sometimes three, sometimes two. Pre-coloured regions leave one way only.',\n";
out += "  origin: { year: 1852, who: 'Francis Guthrie', note: 'Colouring a map of the counties of England in 1852, Francis Guthrie noticed that four colours always seemed to be enough. The question went round the mathematical world for more than a century before Kenneth Appel and Wolfgang Haken proved the four-colour theorem in 1976.' },\n";
out += "  concepts: ['graph', 'four-colour', 'deduction']\n";
out += '}, [\n';
out += puzzles.map((p) => {
  const lines = ['  { id: ' + q(p.id), '    title: ' + q(p.title), '    diff: ' + p.diff, '    text: ' + q(p.text)];
  if (p.explain) lines.push('    explain: ' + q(p.explain));
  if (p.links) lines.push('    links: ' + q(p.links));
  lines.push('    concepts: ' + q(p.concepts));
  lines.push('    tags: ' + q(p.tags));
  lines.push('    data: ' + q(p.data) + ' }');
  return lines.join(',\n');
}).join(',\n') + '\n]);\n';
fs.writeFileSync(path.join(ROOT, 'data/map-colouring.js'), out);
const byDiff = {}, byMode = {};
puzzles.forEach((p) => { byDiff[p.diff] = (byDiff[p.diff] || 0) + 1; const m = p.data.mode + (p.data.mode === 'can3' ? '' : p.data.k); byMode[m] = (byMode[m] || 0) + 1; });
console.log('data/map-colouring.js: ' + puzzles.length + ' puzzles, by difficulty ' + JSON.stringify(byDiff) + ', by kind ' + JSON.stringify(byMode) + ', ' + Math.round(out.length / 1024) + ' KB');
