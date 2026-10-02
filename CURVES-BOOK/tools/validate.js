/* Curves Workshop · tools/validate.js
 *
 * Checks the figure files and the section files against the manifest of the book.
 *
 *   node tools/validate.js                  everything
 *   node tools/validate.js astroid conics   the figure files and section files of these names
 *   node tools/validate.js --coverage       also list every figure number still missing
 *
 * Exit code 1 when anything is wrong. Warnings do not fail the run.
 */
const path = require('path');
const fs = require('fs');
const args = process.argv.slice(2);
const names = args.filter(a => !a.startsWith('--'));
const C = require('./load')(names.length ? { figures: names, sections: names } : {});

const errors = [], warnings = [];
const err = (w, m) => errors.push(w + ': ' + m);
const warn = (w, m) => warnings.push(w + ': ' + m);

C.loadErrors.forEach(e => err(e.file, e.error));

/* ---- figures */
const M = C.manifest;
const byNumber = new Map();
for (const id of C.order) {
  const f = C.figures.get(id);
  if (!byNumber.has(f.fig)) byNumber.set(f.fig, []);
  byNumber.get(f.fig).push(f);
  const sec = C.sectionOfFig(f.fig);
  if (!f.section) err(id, 'no section');
  else if (!sec) err(id, 'figure number ' + f.fig + ' is not in the book (1–211)');
  else if (f.section !== sec.id) err(id, 'section "' + f.section + '" but the book puts Fig. ' + f.fig + ' in "' + sec.id + '"');
  if (!f.title) err(id, 'no title');
  if (typeof f.page !== 'number') err(id, 'no page number');
  else if (M.figures[f.fig] && Math.abs(M.figures[f.fig][0] - f.page) > 1) warn(id, 'page ' + f.page + ' but the manifest says ' + M.figures[f.fig][0]);
  let scene;
  try { scene = C.build(f); } catch (e) { err(id, 'build failed: ' + e.message); continue; }
  if (!scene.steps.length) err(id, 'no steps');
  if (scene.steps[0].tool !== 'given') warn(id, 'the first step is "' + scene.steps[0].tool + '", usually it is "given"');
  scene.steps.forEach(st => {
    if (!st.text.trim()) err(id, 'step ' + st.i + ' has no text');
    if (!st.shapes.length && st.tool !== 'note') warn(id, 'step ' + st.i + ' (' + st.tool + ') draws nothing');
  });
  const curves = scene.shapes.filter(s => s.t === 'curve');
  curves.forEach(c => { const n = c.pts.filter(Boolean).length; if (n < 2) err(id, 'a curve has fewer than 2 finite points'); });
  let svg;
  try { svg = C.svg(scene, { standalone: true }); } catch (e) { err(id, 'svg failed: ' + e.message); continue; }
  if (/NaN/.test(svg)) err(id, 'NaN in the SVG');
  const B = scene.bounds, ratio = (B.x1 - B.x0) / (B.y1 - B.y0);
  if (ratio > 4 || ratio < 0.25) warn(id, 'odd proportions (' + ratio.toFixed(2) + ':1); check the frame');
  if (svg.length > 400000) warn(id, 'large SVG (' + Math.round(svg.length / 1000) + ' kB); fewer samples?');
  const labels = scene.shapes.filter(s => s.t === 'label' || s.t === 'text');
  if (!labels.length) warn(id, 'no labels at all; the book labels its figures');
}
// panels consistent: fig-012 alone, or fig-012a.. without gaps
for (const [n, figs] of byNumber) {
  const parts = figs.map(f => f.part).sort();
  if (parts.length > 1 && parts.includes('')) err('fig-' + String(n).padStart(3, '0'), 'both an unlettered and lettered panels');
  if (parts.length > 1) parts.forEach((p, i) => { if (p !== String.fromCharCode(97 + i)) err('fig-' + String(n).padStart(3, '0'), 'panel letters have a gap: ' + parts.join(',')); });
  const exp = M.figures[n] && M.figures[n][1];
  if (exp && exp > 1 && parts.length === 1) warn('fig-' + String(n).padStart(3, '0'), 'the page shows ' + exp + ' panels, only one drawn');
}
// coverage
const missing = [];
for (let n = 1; n <= 211; n++) if (!byNumber.has(n)) missing.push(n);
if (!names.length) {
  if (missing.length) warn('coverage', missing.length + ' figure numbers have no drawing yet' + (args.includes('--coverage') ? ': ' + missing.join(' ') : ' (--coverage lists them)'));
} else {
  // for the named files: every figure of their sections should be present
  const secs = M.sections.filter(s => names.includes(s.id));
  secs.forEach(s => { for (let n = s.figs[0]; n <= s.figs[1]; n++) if (!byNumber.has(n)) warn(s.id, 'Fig. ' + n + ' (page ' + (M.figures[n] || ['?'])[0] + ') is not drawn (in this file or a sibling file)'); });
}

/* ---- sections */
const need = ['title', 'history', 'description'];
for (const [id, s] of C.sections) {
  const m = M.sections.find(x => x.id === id);
  if (!m) { err('section ' + id, 'not a section of the book'); continue; }
  need.forEach(k => { if (!s[k] || !String(s[k]).trim()) err('section ' + id, 'no ' + k); });
  if (!Array.isArray(s.equations)) warn('section ' + id, 'no equations list');
  if (!Array.isArray(s.items)) warn('section ' + id, 'no general items');
  if (!Array.isArray(s.bibliography)) warn('section ' + id, 'no bibliography');
  if (!Array.isArray(s.constructions) || !s.constructions.length) warn('section ' + id, 'no constructions list (what the learner can practise)');
  (s.constructions || []).forEach(c => { if (!C.figures.has(c.fig)) err('section ' + id, 'construction refers to unknown figure ' + c.fig); });
  const text = JSON.stringify(s);
  const bad = /\$[^$]*\\(?:frac|sqrt|cdot|theta|phi|pi)\b[^$]*\$/.test(text) ? null : null; // TeX inside $...$ is fine
  if (/\bHyperPhysics\b|wikipedia/i.test(text)) warn('section ' + id, 'mentions an outside site');
  (s.figures || []).forEach(f => { if (!C.figures.has(f)) err('section ' + id, 'lists unknown figure ' + f); });
}
if (!names.length) M.sections.forEach(s => { if (!C.sections.has(s.id)) warn('coverage', 'section "' + s.id + '" has no data/sections/' + s.id + '.js yet'); });

warnings.forEach(w => console.log('warning  ' + w));
errors.forEach(e => console.log('ERROR    ' + e));
console.log(C.order.length + ' figures, ' + C.sections.size + ' sections; ' + errors.length + ' errors, ' + warnings.length + ' warnings');
process.exit(errors.length ? 1 : 0);
