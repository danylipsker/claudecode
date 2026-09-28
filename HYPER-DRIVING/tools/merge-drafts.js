#!/usr/bin/env node
/* Hyper Driving · tools/merge-drafts.js — folds writers' draft files into the
 * shared pack files, then rebuilds the manifest.
 *
 *   node tools/merge-drafts.js            show what would be merged
 *   node tools/merge-drafts.js --apply    merge, move the drafts to content/il/_merged/, run publish
 *
 * Drafts (see tools/load.js): _new-facts-*.json, _new-terms-*.json,
 * _new-figures-*.json, _work/signs-*.json, _work/dash.json.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const pack = path.join(ROOT, 'content', 'il');
const apply = process.argv.includes('--apply');
// --skip <regexp>: leave matching draft files alone (e.g. a writer still at work)
const skipRe = (() => { const i = process.argv.indexOf('--skip'); return i >= 0 ? new RegExp(process.argv[i + 1]) : null; })();
const skip = (n) => !!(skipRe && skipRe.test(n));
const read = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const write = (f, j) => fs.writeFileSync(f, JSON.stringify(j, null, 1) + '\n');
const moved = [];
const done = (f) => moved.push(f);

// facts
const factsF = path.join(pack, 'facts.json');
const facts = read(factsF);
fs.readdirSync(pack).filter((n) => /^_new-facts-.*\.json$/.test(n) && !skip(n)).sort().forEach((n) => {
  const j = read(path.join(pack, n));
  let a = 0;
  (j.facts || []).forEach((f) => { if (!facts.facts.some((x) => x.id === f.id)) { facts.facts.push(f); a++; } else console.warn('  skip fact ' + f.id + ' (exists)'); });
  (j.offences || []).forEach((o) => { if (!facts.offences.some((x) => x.id === o.id)) { facts.offences.push(o); a++; } else console.warn('  skip offence ' + o.id + ' (exists)'); });
  console.log(n + ': ' + a + ' facts/offences'); done(n);
});

// glossary
const glossF = path.join(pack, 'glossary.json');
const gloss = read(glossF);
fs.readdirSync(pack).filter((n) => /^_new-terms-.*\.json$/.test(n) && !skip(n)).sort().forEach((n) => {
  const j = read(path.join(pack, n));
  let a = 0;
  (j.terms || j).forEach((t) => { if (!gloss.terms.some((x) => x.id === t.id)) { gloss.terms.push(t); a++; } else console.warn('  skip term ' + t.id + ' (exists)'); });
  console.log(n + ': ' + a + ' terms'); done(n);
});

// figures
const figF = path.join(pack, 'figures.json');
const figs = read(figF);
fs.readdirSync(pack).filter((n) => /^_new-figures-.*\.json$/.test(n) && !skip(n)).sort().forEach((n) => {
  const j = read(path.join(pack, n));
  let a = 0;
  Object.entries(j.figures || {}).forEach(([id, f]) => { if (!figs.figures[id]) { figs.figures[id] = f; a++; } else console.warn('  skip figure ' + id + ' (exists)'); });
  console.log(n + ': ' + a + ' figures'); done(n);
});

// signs (drawings) and dash
const signsF = path.join(pack, 'signs.json');
const signs = read(signsF);
const work = path.join(pack, '_work');
const byNum = new Map(signs.signs.map((s) => [String(s.num), s]));
if (fs.existsSync(work)) {
  fs.readdirSync(work).filter((n) => /^signs-.*\.json$/.test(n) && !skip(n)).sort().forEach((n) => {
    const j = read(path.join(work, n));
    signs.glyphs = Object.assign({}, signs.glyphs || {}, j.glyphs || {});
    let a = 0;
    (j.signs || []).forEach((w) => {
      const s = byNum.get(String(w.num));
      if (!s) { console.warn('  sign ' + w.num + ' not in signs.json'); return; }
      ['shape', 'colors', 'draw', 'w', 'lamps', 'flash', 'horizontal', 'svg'].forEach((k) => { if (w[k] !== undefined) s[k] = w[k]; });
      a++;
    });
    console.log('_work/' + n + ': ' + a + ' signs, ' + Object.keys(j.glyphs || {}).length + ' glyphs'); done('_work/' + n);
  });
  const dw = path.join(work, 'dash.json');
  if (fs.existsSync(dw)) {
    const j = read(dw);
    const dashF = path.join(pack, 'dash.json');
    const dash = read(dashF);
    const by = new Map(dash.lights.map((d) => [d.id, d]));
    (j.lights || []).forEach((d) => by.set(d.id, d));
    dash.lights = [...by.values()];
    signs.glyphs = Object.assign({}, signs.glyphs || {}, j.glyphs || {});
    console.log('_work/dash.json: ' + (j.lights || []).length + ' lights, ' + Object.keys(j.glyphs || {}).length + ' glyphs');
    if (apply) write(dashF, dash);
    done('_work/dash.json');
  }
}
// signs in table order: series 100…900 then the appendix, by number then suffix
const key = (s) => { const n = String(s.num); const m = n.match(/(\d+)/); return [String(s.series) === 'S' ? 1 : 0, m ? +m[1] : 0, n]; };
signs.signs.sort((a, b) => { const x = key(a), y = key(b); return x[0] - y[0] || x[1] - y[1] || (x[2] < y[2] ? -1 : x[2] > y[2] ? 1 : 0); });

if (!apply) { console.log('\n(dry run — add --apply to merge)'); process.exit(0); }
write(factsF, facts); write(glossF, gloss); write(figF, figs); write(signsF, signs);
const arch = path.join(pack, '_merged', new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-'));
fs.mkdirSync(path.join(arch, '_work'), { recursive: true });
moved.forEach((f) => fs.renameSync(path.join(pack, f), path.join(arch, f)));
console.log('merged; drafts moved to ' + path.relative(ROOT, arch));
execFileSync(process.execPath, [path.join(__dirname, 'publish.js')], { stdio: 'inherit' });
