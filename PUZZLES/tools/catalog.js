/* The Puzzle Cabinet · tools/catalog.js
 *   node tools/catalog.js      writes data/catalog.js
 * The catalog lets the library list and search every puzzle without loading
 * the puzzle files: one row per puzzle, one entry per family.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { all, ROOT } = require('./load');

const { C, famFiles, errors, extraHistory, extraConcepts } = all();
// a file that fails to load is left out (another writer may be half-way through it)
if (errors.length) console.warn('LEFT OUT (load errors):\n  ' + errors.join('\n  '));

const catOrder = C.categories.map((c) => c.id);
const families = {};
const rows = [];
const fids = Object.keys(C.families).sort((a, b) => {
  const A = C.families[a].meta, B = C.families[b].meta;
  return catOrder.indexOf(A.cat) - catOrder.indexOf(B.cat) || (A.order || 0) - (B.order || 0) || A.name.localeCompare(B.name);
});
fids.forEach((fid, k) => {
  const f = C.families[fid], m = f.meta;
  const eng = C.engines[m.engine] || {};
  const fam = {
    name: m.name, cat: m.cat, engine: m.engine, files: famFiles[fid], count: f.puzzles.length,
    blurb: m.blurb || '', origin: m.origin || null, concepts: m.concepts || [],
    deps: (eng.deps || []).concat(m.deps || []).filter((d, i, a) => a.indexOf(d) === i),
    order: k,
    endless: m.endless === true || (!!eng.generate && m.endless !== false && (!eng.generates || eng.generates.includes(fid)))
  };
  if (!fam.endless) delete fam.endless;
  if (!fam.origin) delete fam.origin;
  if (!fam.deps.length) delete fam.deps;
  if (!fam.concepts.length) delete fam.concepts;
  families[fid] = fam;
  f.puzzles.forEach((p) => {
    const r = [p.id, p.title, fid, p.diff || 0, p.year == null ? null : p.year, (p.tags || []).join(' '), (p.concepts || []).join(' '), (p.links || []).join(' ')];
    while (r.length > 4 && (r[r.length - 1] === '' || r[r.length - 1] == null)) r.pop();
    rows.push(r);
  });
});
const body = JSON.stringify({ built: new Date().toISOString().slice(0, 10), families, rows, history: extraHistory, concepts: extraConcepts }).replace(/\],\[/g, '],\n[');
const out = '/* The Puzzle Cabinet · data/catalog.js — made by tools/catalog.js, do not edit */\nCabinet.catalog(' + body + ');\n';
fs.writeFileSync(path.join(ROOT, 'data/catalog.js'), out);
console.log('catalog: ' + Object.keys(families).length + ' families, ' + rows.length + ' puzzles, ' + Math.round(out.length / 1024) + ' KB');
