/* Hyper Driving · tools/load.js — loads the app's scripts into Node (no DOM)
 * and a content pack from disk, for the command-line checks.
 *
 *   const { D, loadPack } = require('./load');
 *   loadPack('content/il');                  // D.data is ready
 *   loadPack('content/il', { drafts: true }) // plus writers' draft files:
 *
 * Draft files (names starting with "_" are never published) let many writers
 * work at once without touching shared files:
 *   _new-facts-<chapter>.json   { "facts": [...], "offences": [...] }  → merged into facts.json
 *   _new-terms-<chapter>.json   { "terms": [...] }                     → merged into glossary.json
 *   _new-figures-<chapter>.json { "figures": { id: {...} } }           → merged into figures.json
 *   _work/signs-*.json          { "glyphs": {...}, "signs": [...] }    → drawings merged into signs.json by num
 *   _work/dash.json             { "glyphs": {...}, "lights": [...] }   → replaces dash.json lights by id
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const SCRIPTS = ['config', 'core', 'i18n', 'content', 'icons', 'glyphs', 'signs', 'dash', 'markup', 'widgets', 'quiz', 'update', 'check', 'views', 'editor'];

globalThis.Drive = globalThis.Drive || {};
for (const s of SCRIPTS) {
  const file = path.join(ROOT, 'js', s + '.js');
  vm.runInThisContext(fs.readFileSync(file, 'utf8'), { filename: file });
}
const D = globalThis.Drive;

function describePath(p) {
  let m = p.match(/^([a-z]{2})\/(lessons|questions|trees)\/[^/]+\.json$/);
  if (m) return { path: p, role: m[2], lang: m[1] };
  m = p.match(/^([a-z]{2})\/ui\.json$/);
  if (m) return { path: p, role: 'ui', lang: m[1] };
  return { path: p, role: p.replace(/\.json$/, '').replace(/^.*\//, '') };
}
function listPack(dir) {
  const out = [];
  const walk = (d, rel) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (e.name.startsWith('_') || e.name.startsWith('.')) continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) walk(path.join(d, e.name), r);
      else if (e.name.endsWith('.json') && r !== 'manifest.json') out.push(r);
    }
  };
  walk(dir, '');
  return out;
}
const readJSON = (f, problems) => {
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
  catch (e) { problems.push(path.basename(f) + ': ' + e.message); return null; }
};

// opts.fromDisk: take the file list from the folder, not the manifest
function readPack(dir, opts) {
  opts = opts || {};
  const packDir = path.resolve(ROOT, dir || 'content/il');
  const problems = [];
  const manifest = readJSON(path.join(packDir, 'manifest.json'), problems) || { jurisdiction: path.basename(packDir), version: '0', files: [] };
  const list = opts.fromDisk ? listPack(packDir).map(describePath) : manifest.files;
  const files = {};
  for (const f of list) {
    const p = path.join(packDir, f.path);
    if (!fs.existsSync(p)) { problems.push('manifest lists a missing file: ' + f.path); continue; }
    const j = readJSON(p, problems);
    if (j) files[f.path] = j;
  }
  const mf = Object.assign({}, manifest, { files: list });
  return { packDir, manifest: mf, diskManifest: manifest, files, problems };
}

function applyDrafts(packDir, files, problems) {
  const applied = [];
  const clone = (x) => JSON.parse(JSON.stringify(x));
  const each = (re, fn) => fs.readdirSync(packDir).filter((n) => re.test(n)).sort().forEach((n) => { const j = readJSON(path.join(packDir, n), problems); if (j) { fn(j, n); applied.push(n); } });
  if (files['facts.json']) {
    const F = files['facts.json'] = clone(files['facts.json']);
    each(/^_new-facts-.*\.json$/, (j, n) => {
      (j.facts || []).forEach((f) => { if (F.facts.some((x) => x.id === f.id)) problems.push(n + ': fact "' + f.id + '" already exists'); else F.facts.push(f); });
      (j.offences || []).forEach((o) => { if (F.offences.some((x) => x.id === o.id)) problems.push(n + ': offence "' + o.id + '" already exists'); else F.offences.push(o); });
    });
  }
  if (files['glossary.json']) {
    const G = files['glossary.json'] = clone(files['glossary.json']);
    each(/^_new-terms-.*\.json$/, (j, n) => (j.terms || j).forEach((t) => {
      if (G.terms.some((x) => x.id === t.id)) problems.push(n + ': term "' + t.id + '" already exists'); else G.terms.push(t);
    }));
  }
  if (files['figures.json']) {
    const Fg = files['figures.json'] = clone(files['figures.json']);
    each(/^_new-figures-.*\.json$/, (j, n) => Object.entries(j.figures || {}).forEach(([id, f]) => {
      if (Fg.figures[id]) problems.push(n + ': figure "' + id + '" already exists'); else Fg.figures[id] = f;
    }));
  }
  const work = path.join(packDir, '_work');
  if (fs.existsSync(work)) {
    if (files['signs.json']) {
      const S = files['signs.json'] = clone(files['signs.json']);
      const byNum = new Map(S.signs.map((s) => [String(s.num), s]));
      fs.readdirSync(work).filter((n) => /^signs-.*\.json$/.test(n)).sort().forEach((n) => {
        const j = readJSON(path.join(work, n), problems); if (!j) return;
        S.glyphs = Object.assign({}, S.glyphs || {}, j.glyphs || {});
        (j.signs || []).forEach((w) => {
          const s = byNum.get(String(w.num));
          if (!s) { problems.push('_work/' + n + ': sign ' + w.num + ' not in signs.json'); return; }
          ['shape', 'colors', 'draw', 'w', 'lamps', 'flash', 'horizontal', 'svg'].forEach((k) => { if (w[k] !== undefined) s[k] = w[k]; });
        });
        applied.push('_work/' + n);
      });
    }
    const dw = path.join(work, 'dash.json');
    if (fs.existsSync(dw) && files['dash.json']) {
      const j = readJSON(dw, problems);
      if (j) {
        const L = files['dash.json'] = clone(files['dash.json']);
        const by = new Map(L.lights.map((d) => [d.id, d]));
        (j.lights || []).forEach((d) => by.set(d.id, d));
        L.lights = [...by.values()];
        if (j.glyphs) files['signs.json'] = Object.assign({}, files['signs.json'], { glyphs: Object.assign({}, (files['signs.json'] || {}).glyphs || {}, j.glyphs) });
        applied.push('_work/dash.json');
      }
    }
  }
  return applied;
}

function loadPack(dir, opts) {
  opts = opts || {};
  const r = readPack(dir, opts);
  r.applied = opts.drafts ? applyDrafts(r.packDir, r.files, r.problems) : [];
  const sg = r.files['signs.json'];
  if (sg && sg.glyphs) Object.keys(sg.glyphs).forEach((k) => D.glyphs.add(k, sg.glyphs[k]));
  D.content.assemble(r.manifest.jurisdiction, { manifest: r.manifest, files: r.files, origin: 'bundled' });
  return Object.assign({ D }, r);
}

module.exports = { D, ROOT, readPack, loadPack, listPack, describePath };
