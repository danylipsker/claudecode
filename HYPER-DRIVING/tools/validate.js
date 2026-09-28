#!/usr/bin/env node
/* Hyper Driving · tools/validate.js — checks a content pack.
 *
 *   node tools/validate.js                 the files on disk + writers' draft files (_new-*.json, _work/)
 *   node tools/validate.js --warnings      list every warning
 *   node tools/validate.js --grep "sd-"    only messages containing this text
 *   node tools/validate.js --release       exactly what ships: the manifest's files, no drafts,
 *                                          and the manifest must match the disk (tools/publish.js)
 *
 * Checks: every JSON parses, every reference resolves, questions and trees
 * are well formed, languages agree, every lesson renders.
 * Exit code 1 when there are errors.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { D, loadPack } = require('./load');
const { sha } = require('./publish');
const { listPack } = require('./load');

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : null; };
const packArg = opt('pack') || 'content/il';
const grep = opt('grep');

const release = !!opt('release');
const { files, problems, manifest, diskManifest, packDir, applied } = loadPack(packArg, release ? {} : { fromDisk: true, drafts: true });
const errors = problems.slice();
const warnings = [];

// manifest ↔ disk (release mode)
if (release) {
  const onDisk = new Set(listPack(packDir));
  const listed = new Set(manifest.files.map((f) => f.path));
  onDisk.forEach((p) => { if (!listed.has(p)) errors.push('file not in manifest (run node tools/publish.js): ' + p); });
  manifest.files.forEach((f) => { if (files[f.path] && f.sha256 !== sha(files[f.path])) errors.push('stale hash in manifest (run node tools/publish.js): ' + f.path); });
} else if (applied && applied.length) console.log('drafts: ' + applied.join(', '));
void diskManifest;

// the shared rules (js/check.js)
const r = D.check.run();
errors.push(...r.errors);
warnings.push(...r.warnings);

// every lesson, question and tree renders without throwing and without broken refs
const M = D.markup;
Object.keys(D.data.text).forEach((l) => {
  D.settings.lang = l;
  const t = D.data.text[l];
  t.lessonById.forEach((ls) => {
    try { M.problems = []; M.render(ls.body); (ls.keyPoints || []).forEach(M.inline); }
    catch (e) { errors.push(`${l} lesson ${ls.id}: render failed: ${e.message}`); }
  });
  t.questions.forEach((q) => {
    try { M.inline(q.q); q.options.forEach(M.inline); M.render(q.explain || ''); }
    catch (e) { errors.push(`${l} question ${q.id}: render failed: ${e.message}`); }
  });
});
D.settings.lang = null;

// text facts carry codes ("mandatory"), not words: they must not be shown inline
const codeFacts = new Set([...D.data.facts.values()].filter((f) => f.unit === 'text' && typeof f.value === 'string' && /^[a-z0-9_]+$/i.test(f.value) && !/^\d+$/.test(f.value)).map((f) => f.id));
const usage = D.content.usage();
codeFacts.forEach((id) => (usage.fact.get(id) || []).forEach((w) => { if (w.type !== 'question' || true) warnings.push(`${w.lang || ''} ${w.type} ${w.id}: shows the coded text fact {{fact:${id}}} — write the rule in words instead`); }));

const filt = (a) => (grep ? a.filter((x) => x.includes(grep)) : a);
const E = filt(errors), W = filt(warnings);
const count = (m) => { let n = 0; m.forEach(() => n++); return n; };
const langs = Object.keys(D.data.text);
console.log(`pack ${manifest.jurisdiction} ${manifest.version}: ${D.data.course.chapters.length} chapters, ` +
  langs.map((l) => `${l}: ${count(D.data.text[l].lessonById)} lessons / ${D.data.text[l].questions.length} questions / ${D.data.text[l].trees.length} trees`).join('; ') +
  `, ${D.data.signs.length} signs, ${D.data.glossary.length} terms, ${D.data.dash.length} lights, ${D.data.facts.size} facts, ${D.data.offences.size} offences`);
if (E.length) { console.log(`\n✗ ${E.length} errors`); E.slice(0, opt('all') ? 1e9 : 200).forEach((e) => console.log('  ' + e)); }
if (W.length) {
  if (opt('warnings')) { console.log(`\n! ${W.length} warnings`); W.forEach((w) => console.log('  ' + w)); }
  else {
    const kinds = {};
    W.forEach((w) => { const k = w.replace(/^.*?: /, '').replace(/"[^"]*"/g, '"…"').slice(0, 70); kinds[k] = (kinds[k] || 0) + 1; });
    console.log(`\n! ${W.length} warnings (--warnings to list):`);
    Object.entries(kinds).sort((a, b) => b[1] - a[1]).slice(0, 15).forEach(([k, n]) => console.log(`  ${String(n).padStart(4)} × ${k}`));
  }
}
if (!E.length) console.log('\n✓ no errors');
process.exitCode = E.length ? 1 : 0;
