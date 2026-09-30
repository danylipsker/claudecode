/* The Puzzle Cabinet · tools/validate.js
 *
 *   node tools/validate.js                 every family
 *   node tools/validate.js --family jugs   one family (or several: --family a,b)
 *   node tools/validate.js --engine jugs   every family of one engine
 *   node tools/validate.js --quick         skip the solvers
 *
 * Checks every family's description and every puzzle's fields, links and
 * concepts, then runs its engine's verify(p): the puzzle must be solvable
 * (and, where the engine says so, have one solution and the right par).
 */
'use strict';
const { all } = require('./load');

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const famFilter = opt('--family') ? new Set(opt('--family').split(',')) : null;
const engFilter = opt('--engine');
const quick = args.includes('--quick');

const { C, errors: loadErrors } = all();
const errors = loadErrors.slice();
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const cats = new Set(C.categories.map((c) => c.id));
let count = 0, verified = 0;
const byCat = {};
const slow = [];
const t0 = Date.now();

(C.problems || []).forEach(err);

for (const fid of Object.keys(C.families)) {
  const f = C.families[fid], m = f.meta;
  if (famFilter && !famFilter.has(fid)) continue;
  if (engFilter && m.engine !== engFilter) continue;
  const eng = C.engines[m.engine];
  if (!eng) { err(fid + ': no engine "' + m.engine + '"'); continue; }
  if (!cats.has(m.cat)) err(fid + ': unknown category "' + m.cat + '"');
  if (!m.name) err(fid + ': family has no name');
  if (!m.blurb) warn(fid + ': family has no blurb');
  (m.concepts || []).forEach((c) => { if (!C.conceptById[c]) warn(fid + ': unknown concept ' + c); });
  byCat[m.cat] = (byCat[m.cat] || 0) + f.puzzles.length;
  for (const p of f.puzzles) {
    count++;
    const where = p.id + ' (' + fid + ')';
    if (!p.id || !/^[a-z0-9][a-z0-9-]*$/.test(p.id)) err(where + ': id must be lowercase letters, digits and dashes');
    if (!p.title) err(where + ': no title');
    if (!(p.diff >= 1 && p.diff <= 5)) err(where + ': diff must be 1..5');
    if (!p.text && !eng.textOptional) warn(where + ': no text');
    if (!p.data) err(where + ': no data');
    if (p.year != null && (typeof p.year !== 'number' || p.year > 2100)) err(where + ': bad year');
    (p.links || []).forEach((l) => { if (!C.byId[l]) err(where + ': link to missing puzzle ' + l); });
    (p.concepts || []).forEach((c) => { if (!C.conceptById[c]) warn(where + ': unknown concept ' + c); });
    if (p.hints && !Array.isArray(p.hints)) err(where + ': hints must be a list');
    const text = [p.text, p.explain, p.goal].concat(p.hints || []).join(' ');
    (text.match(/\[\[([\w-]+)(?:\|[^\]]*)?\]\]/g) || []).forEach((mm) => {
      const id = /\[\[([\w-]+)/.exec(mm)[1];
      if (!C.byId[id]) err(where + ': text links to missing puzzle ' + id);
    });
    (text.match(/\[\[c:([\w-]+)/g) || []).forEach((mm) => { const id = mm.slice(4); if (!C.conceptById[id]) warn(where + ': text links to unknown concept ' + id); });
    (text.match(/\[\[f:([\w-]+)/g) || []).forEach((mm) => { const id = mm.slice(4); if (!C.families[id]) warn(where + ': text links to unknown family ' + id); });
    if (quick || !eng.verify || !p.data) continue;
    const s = Date.now();
    let r;
    try { r = eng.verify(p); } catch (e) { r = { ok: false, err: 'verify threw: ' + e.message + ' ' + (e.stack || '').split('\n')[1] }; }
    const dt = Date.now() - s;
    if (dt > 1500) slow.push(where + ' ' + dt + ' ms');
    if (!r || !r.ok) err(where + ': ' + (r && r.err || 'verify failed'));
    else { verified++; if (r.warn) warn(where + ': ' + r.warn); }
  }
}

// endless: make a few puzzles at every level and check each one like a stored puzzle
const endlessN = opt('--endless') ? parseInt(opt('--endless'), 10) || 5 : (args.includes('--endless') ? 5 : 0);
if (endlessN) {
  for (const fid of Object.keys(C.families)) {
    const m = C.families[fid].meta, eng = C.engines[m.engine];
    if (famFilter && !famFilter.has(fid)) continue;
    if (engFilter && m.engine !== engFilter) continue;
    if (!eng || !eng.generate || m.endless === false || (eng.generates && !eng.generates.includes(fid))) continue;
    const line = [];
    for (let lv = 1; lv <= 5; lv++) {
      let ok = 0, made = 0, ms = 0;
      for (let k = 0; k < endlessN; k++) {
        const s = Date.now();
        let p = null;
        try { p = eng.generate(C.rng('x:' + fid + ':' + lv + ':' + (1000 + k)), lv, m); } catch (e) { err(fid + ' endless L' + lv + ': generate threw ' + e.message); }
        ms += Date.now() - s;
        if (!p) continue;
        made++;
        p = Object.assign({ text: '' }, p, { id: 'x-' + fid + '-' + lv + '-' + k, family: fid, engine: m.engine, diff: p.diff || lv });
        let r;
        try { r = eng.verify ? eng.verify(p) : { ok: true }; } catch (e) { r = { ok: false, err: e.message }; }
        if (r && r.ok) ok++; else err(fid + ' endless L' + lv + ' seed ' + (1000 + k) + ': ' + (r && r.err));
      }
      line.push('L' + lv + ' ' + ok + '/' + endlessN + ' (' + Math.round(ms / Math.max(1, endlessN)) + ' ms)');
      if (!made) warn(fid + ' endless L' + lv + ': nothing made');
    }
    console.log('endless ' + fid.padEnd(20) + line.join('  '));
  }
}

const total = Object.values(byCat).reduce((a, b) => a + b, 0);
console.log('Families: ' + Object.keys(C.families).length + ', puzzles: ' + count + (quick ? '' : ', verified: ' + verified) + ' (' + ((Date.now() - t0) / 1000).toFixed(1) + ' s)');
if (!famFilter && !engFilter) {
  C.categories.forEach((c) => { if (byCat[c.id]) console.log('  ' + c.name.padEnd(26) + String(byCat[c.id]).padStart(5)); });
  console.log('  ' + 'total'.padEnd(26) + String(total).padStart(5));
}
if (slow.length) console.log('Slow: ' + slow.slice(0, 20).join('; '));
if (warns.length) { console.log('\n' + warns.length + ' warnings:'); warns.slice(0, 60).forEach((w) => console.log('  ! ' + w)); if (warns.length > 60) console.log('  …'); }
if (errors.length) { console.log('\n' + errors.length + ' ERRORS:'); errors.slice(0, 120).forEach((e) => console.log('  x ' + e)); process.exit(1); }
console.log('OK');
