/* The Puzzle Cabinet · tools/gen/tangram.js
 *
 *   node tools/gen/tangram.js        writes data/tangram.js
 *
 * Each figure is a lattice polygon (area 16, edges horizontal, vertical or at
 * 45°). The plane is cut into quarter-cell triangles (each unit cell split
 * by both diagonals); every piece, in each of its 8 lattice orientations and
 * every position, covers a set of them. Exact cover (js/lib/dlx.js) then
 * finds a way to lay the seven pieces, which becomes the puzzle's solution.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'engines/tangram.js'));
const G = C.geom;
const SET = C.tangramSets.tangram;

function quarters(i, j) {
  return [[i + 0.5, j + 1 / 6], [i + 5 / 6, j + 0.5], [i + 0.5, j + 5 / 6], [i + 1 / 6, j + 0.5]];
}

function solveFigure(target, seed) {
  if (Math.abs(G.absArea(target) - 16) > 1e-6) return { err: 'area ' + G.absArea(target) };
  const b = G.bbox([target]);
  const qs = [], qIndex = new Map();
  for (let i = Math.floor(b.x0); i < Math.ceil(b.x1); i++) {
    for (let j = Math.floor(b.y0); j < Math.ceil(b.y1); j++) {
      quarters(i, j).forEach((q, k) => {
        if (G.pointInPoly(q, target)) { qIndex.set(i + ',' + j + ',' + k, qs.length); qs.push(q); }
      });
    }
  }
  if (qs.length !== 64) return { err: 'not a lattice figure (' + qs.length + ' quarters)' };
  const slots = [];
  for (const t in SET.types) for (let n = 0; n < SET.types[t].n; n++) slots.push(t);
  const rows = [], meta = [];
  const typeRows = {};
  for (const t in SET.types) {
    typeRows[t] = [];
    const seen = new Set();
    for (const flip of [0, 1]) {
      for (const rot of [0, 90, 180, 270]) {
        const base = G.placePoly(SET.types[t].poly, { x: 0, y: 0, rot, flip: !!flip }).map((p) => G.round(p, 1e6));
        const bb = G.bbox([base]);
        for (let dx = Math.floor(b.x0 - bb.x0); dx <= Math.ceil(b.x1 - bb.x1); dx++) {
          for (let dy = Math.floor(b.y0 - bb.y0); dy <= Math.ceil(b.y1 - bb.y1); dy++) {
            const poly = base.map((p) => [p[0] + dx, p[1] + dy]);
            const pb = G.bbox([poly]);
            const cov = [];
            let bad = false;
            for (let i = Math.floor(pb.x0); i < Math.ceil(pb.x1) && !bad; i++) {
              for (let j = Math.floor(pb.y0); j < Math.ceil(pb.y1) && !bad; j++) {
                quarters(i, j).forEach((q, k) => {
                  if (bad || !G.pointInPoly(q, poly)) return;
                  const id = qIndex.get(i + ',' + j + ',' + k);
                  if (id == null) bad = true; else cov.push(id);
                });
              }
            }
            if (bad || cov.length !== Math.round(G.absArea(poly) * 4)) continue;
            const key = cov.slice().sort((x, y) => x - y).join(',');
            if (seen.has(key)) continue;
            seen.add(key);
            typeRows[t].push({ cov, pl: [t, dx, dy, rot, flip] });
          }
        }
      }
    }
  }
  slots.forEach((t, si) => {
    typeRows[t].forEach((r) => { rows.push(r.cov.concat([64 + si])); meta.push(r.pl); });
  });
  const sols = C.DLX.solve({ primary: 64 + slots.length, rows, max: 1, shuffle: C.rng(seed || 1) });
  if (!sols.length) return { err: sols.aborted ? 'search gave up' : 'no solution in lattice orientations' };
  return { pieces: sols[0].map((ri) => meta[ri]) };
}

/* ---------- the figures ---------- */
// [id, title, diff, polygon, text]. Lattice outlines of area 16 only; the pictures
// (people, animals, objects) are built from placements in tools/gen/tangram-figures.js.
const FIGS = [
  ['square', 'The Square', 3, [[0, 0], [4, 0], [4, 4], [0, 4]], 'Put the seven pieces back in their box: a plain square. It is how the set is sold, and it is surprisingly hard to get back once the pieces are out.'],
  ['triangle', 'The Great Triangle', 2, [[4, 0], [8, 4], [0, 4]], 'One big right-angled triangle, as wide as two boxes.'],
  ['rectangle', 'The Long Rectangle', 3, [[2, 0], [6, 4], [4, 6], [0, 2]], 'A rectangle twice as long as it is wide, lying on the slant.'],
  ['parallelogram', 'The Parallelogram', 2, [[0, 0], [4, 0], [8, 4], [4, 4]], 'A big parallelogram leaning to the right.'],
  ['trapezoid', 'The Right Trapezoid', 2, [[0, 0], [2, 0], [6, 4], [0, 4]], 'A trapezoid with one upright side and one slanting at 45°.'],
  ['hexagon', 'The Hexagon', 3, [[2, 0], [4, 0], [6, 2], [4, 4], [2, 4], [0, 2]], 'A six-sided figure, pointed at both ends.'],
];

const out = [];
const failed = [];
FIGS.forEach((f, i) => {
  const [slug, title, diff, poly, text] = f;
  const r = solveFigure(poly, 17 + i * 31);
  if (r.err) { failed.push(slug + ': ' + r.err); return; }
  out.push({ id: 'tangram-' + slug, title, diff, text, pieces: r.pieces });
});

const lines = [];
lines.push('/* The Puzzle Cabinet · data/tangram.js — made by tools/gen/tangram.js */');
lines.push('Cabinet.family({');
lines.push("  id: 'tangram', engine: 'tangram', cat: 'shapes', name: 'Tangram', order: 1,");
lines.push("  blurb: 'Seven pieces cut from a square — two large triangles, a medium one, two small, a square and a parallelogram — make every one of these figures.',");
lines.push("  origin: { year: 1800, who: 'China, Song dynasty furniture to Qing puzzle books', note: 'The tangram (七巧板, \"seven boards of skill\") appears in Chinese books around 1800 and swept Europe and America in a craze from 1817. Lewis Carroll, Napoleon (so the story goes) and Edgar Allan Poe all owned sets.' },");
lines.push("  concepts: ['dissection']");
lines.push('}, [');
out.forEach((p, i) => {
  lines.push('  { id: ' + JSON.stringify(p.id) + ', title: ' + JSON.stringify(p.title) + ', diff: ' + p.diff + ',');
  lines.push('    text: ' + JSON.stringify(p.text) + ',');
  lines.push("    goal: 'Cover the silhouette with all seven pieces.',");
  if (i === 0) lines.push("    hints: ['The two large triangles together make half the square.', 'The medium triangle and the two small ones sit along one side; the square and the parallelogram fill the rest.'],");
  lines.push('    data: { pieces: ' + JSON.stringify(p.pieces) + ' } },');
});
lines.push(']);');
fs.writeFileSync(path.join(ROOT, 'data/tangram.js'), lines.join('\n') + '\n');
console.log('tangram: ' + out.length + ' figures written' + (failed.length ? '; not tileable: ' + failed.join('; ') : ''));
