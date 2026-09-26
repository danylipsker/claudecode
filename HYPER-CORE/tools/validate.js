/* Checks a Hyper discipline's content the way the app will use it.
 *
 *   node HYPER-CORE/tools/validate.js HYPER-PHYSICS
 *   node HYPER-CORE/tools/validate.js HYPER-PHYSICS --only content/mechanics.js,sims/mechanics.js
 *   node HYPER-CORE/tools/validate.js HYPER-MATH --final       (planned concepts must all exist)
 *
 * Loads every .js file in the discipline's content/ and sims/ folders (outline.js
 * first) plus the other disciplines' catalog.js, builds the graph and then checks:
 *   - ids, parents, prerequisites and related links resolve (links into another
 *     discipline are checked against its catalog when there is one)
 *   - every piece of text and TeX renders (bodies, ideas, examples, quizzes, notes ...)
 *   - every formula parses, declares its variables, and solves back to its own
 *     starting values for every variable (the calculator's "solve for anything")
 *   - practice problems can be generated from every formula
 *   - quizzes and problems are well formed; simulations referenced exist
 * With --only, problems are reported for the nodes and simulations those files define.
 * Exit code 1 when there are errors.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { makeContext, loadCore, run } = require('./load');

const args = process.argv.slice(2);
const discDir = path.resolve(args.find(a => !a.startsWith('--')) || 'HYPER-PHYSICS');
const onlyArg = (args.find(a => a.startsWith('--only=')) || '').slice(7) || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '');
const only = onlyArg ? new Set(onlyArg.split(',').map(s => path.resolve(discDir, s.trim()))) : null;
const FINAL = args.includes('--final');
const QUIET = args.includes('--quiet');

const DISC = { 'HYPER-PHYSICS': 'physics', 'HYPER-MATH': 'math', 'HYPER-ELECTRONICS': 'electronics', 'HYPER-CHEMISTRY': 'chemistry' }[path.basename(discDir)];
if (!DISC) { console.error('Not a Hyper discipline folder: ' + discDir); process.exit(2); }

const ctx = makeContext();
const H = loadCore(ctx);
H.use(DISC);

const errors = [], warns = [], infos = [];
const E = (where, msg) => errors.push(where + ': ' + msg);
const W = (where, msg) => warns.push(where + ': ' + msg);

/* ---------------------------------------------------------------- load files */
const files = [];
for (const sub of ['content', 'sims']) {
  const dir = path.join(discDir, sub);
  if (!fs.existsSync(dir)) continue;
  const list = fs.readdirSync(dir).filter(f => f.endsWith('.js')).sort((a, b) => (a === 'outline.js' ? -1 : b === 'outline.js' ? 1 : a.localeCompare(b)));
  for (const f of list) files.push(path.join(dir, f));
}
// other disciplines' catalogs
for (const d of ['HYPER-PHYSICS', 'HYPER-MATH', 'HYPER-ELECTRONICS', 'HYPER-CHEMISTRY']) {
  const c = path.join(discDir, '..', d, 'catalog.js');
  if (d !== path.basename(discDir) && fs.existsSync(c)) { try { run(ctx, c); } catch (e) { W(d + '/catalog.js', e.message); } }
}
const fileOfNode = new Map(), fileOfSim = new Map();
let curFile = null;
const origAdd = H.add, origSim = H.sim;
H.add = function () {
  const before = new Set(H.nodes.keys());
  origAdd.apply(H, arguments);
  for (const id of H.nodes.keys()) if (!before.has(id)) fileOfNode.set(id, curFile);
};
H.sim = function (id, def) { origSim.call(H, id, def); fileOfSim.set(id, curFile); };
for (const f of files) {
  curFile = f;
  const errBefore = H.errors.length;
  try { run(ctx, f); }
  catch (e) {
    const rel = path.relative(discDir, f);
    if (!only || only.has(f)) E(rel, 'failed to load: ' + e.message + (e.stack ? ' ' + (e.stack.split('\n').find(l => l.includes(path.basename(f))) || '').trim() : ''));
    else W(rel, 'failed to load (not checked): ' + e.message);
  }
  for (const m of H.errors.slice(errBefore)) E(path.relative(discDir, f), m);
  H.errors.length = errBefore;
}
curFile = null;

// is every file wired into index.html?
const indexHtml = fs.existsSync(path.join(discDir, 'index.html')) ? fs.readFileSync(path.join(discDir, 'index.html'), 'utf8') : '';
for (const f of files) {
  const rel = path.relative(discDir, f).replace(/\\/g, '/');
  if (indexHtml && !indexHtml.includes('src="' + rel + '"')) infos.push(rel + ' is not listed in index.html yet');
}

/* ---------------------------------------------------------------- build */
H.build();
const buildErrs = H.errors.splice(0);
const mine = id => !only || only.has(fileOfNode.get(id));
for (const m of buildErrs) {
  const id = m.split(':')[0];
  if (mine(id)) {
    // links to planned concepts that another author has not written yet are only a note
    const planned = new Set();
    for (const n of H.list) for (const p of (n.plan || [])) planned.add(p[0]);
    const target = (/"([^"]+)"/.exec(m) || [])[1];
    if (target && planned.has(target) && !FINAL) infos.push(m + ' (planned, not written yet)');
    else E(id, m.slice(id.length + 2));
  }
}

/* ---------------------------------------------------------------- text and TeX */
function checkText(where, s, block) {
  if (s == null || s === '') return;
  if (typeof s !== 'string') { E(where, 'expected text, got ' + typeof s); return; }
  H.texErrors = [];
  H.linkErrors = [];
  try { block ? H.text(s) : H.inline(s); } catch (e) { E(where, 'text failed to render: ' + e.message); }
  for (const t of H.texErrors) E(where, 'TeX error "' + t.error + '" in: ' + t.src.slice(0, 120));
  for (const l of H.linkErrors) {
    const r = H.ref(l);
    const planned = [...H.list].some(n => (n.plan || []).some(p => p[0] === r.id));
    if (r.local && planned && !FINAL) infos.push(where + ': link to planned [[' + l + ']] (not written yet)');
    else E(where, 'link to unknown concept [[' + l + ']]');
  }
  H.texErrors = null; H.linkErrors = null;
  // cross-discipline links: check against the other catalog when it is loaded
  const re = /\[\[([a-z]+):([^\]|]+)/g;
  let m;
  while ((m = re.exec(s))) {
    const cat = H.catalogs[m[1]];
    if (!H.DISCIPLINES[m[1]]) E(where, 'unknown discipline in [[' + m[1] + ':' + m[2] + ']]');
    else if (cat && !cat.has(m[2].trim())) W(where, 'link [[' + m[1] + ':' + m[2] + ']] is not in the ' + m[1] + ' catalog');
  }
  lostBackslash(where, s);
  const dollars = (s.replace(/\\\$/g, '').match(/\$/g) || []).length;
  if (dollars % 2) E(where, 'odd number of $ signs: an unclosed math span');
}
/* In JS strings "\frac" is a form feed + "rac", "\theta" a tab + "heta", "\nu" a newline + "u".
   TeX commands must be written with a doubled backslash: "\\frac". */
function lostBackslash(where, s) {
  if (/[\x08\x0b\x0c\r]/.test(s)) E(where, 'contains a control character: a TeX command such as \\frac, \\vec, \\beta or \\rho was written with a single backslash (write \\\\frac inside JS strings)');
  if (/\t/.test(s)) E(where, 'contains a tab: probably \\theta, \\tau, \\times or \\text written with a single backslash (write \\\\theta)');
  const inl = s.replace(/\$\$[\s\S]*?\$\$/g, '').match(/\$[^$]+\$/g) || [];
  if (inl.some(m => /\n/.test(m))) W(where, 'a line break inside inline math: probably \\nu, \\nabla or \\neq written with a single backslash');
  // a command that lost its backslash silently becomes letters: "sqrt", "Delta" inside the maths
  const maths = (s.match(/\$\$[\s\S]*?\$\$|\$[^$]+\$/g) || []).map(m => m.replace(/\\(text|mathrm|operatorname|textrm|mbox)\s*\{[^}]*\}/g, ''));
  const lost = /(^|[^\\A-Za-z])(frac|dfrac|sqrt|Delta|delta|mathrm|mathbf|theta|alpha|beta|lambda|omega|Omega|sigma|cdot|times|approx|infty|partial|nabla|vec|hat|left|right|sum|int|lim|varepsilon|epsilon|rho|mu|phi|psi|hbar|circ|quad)(?![A-Za-z])/;
  for (const m of maths) {
    const x = lost.exec(m);
    if (x) { W(where, 'maths contains the bare word "' + x[2] + '": a TeX command that lost its backslash? In: ' + m.slice(0, 80)); break; }
  }
}
function checkTex(where, tex, display) {
  if (!tex) return;
  lostBackslash(where, tex);
  try { H.tex(tex, display); } catch (e) { E(where, 'TeX error "' + e.message + '" in: ' + tex.slice(0, 120)); }
}
function checkSteps(where, steps) {
  (steps || []).forEach((s, i) => {
    if (typeof s === 'string') checkText(where + ' step ' + (i + 1), s, true);
    else { checkText(where + ' step ' + (i + 1), s.text, true); checkTex(where + ' step ' + (i + 1), s.tex, true); }
  });
}

/* ---------------------------------------------------------------- nodes */
const stats = { concepts: 0, formulas: 0, sims: 0, quiz: 0, examples: 0, problems: 0, byBranch: {} };
const close = (a, b) => Math.abs(a - b) <= 1e-6 * Math.max(Math.abs(a), Math.abs(b), 1e-300);
for (const n of H.list) {
  if (!mine(n.id)) continue;
  const w = n.id;
  if (!n.title) E(w, 'no title');
  if (n.kind !== 'root' && !n.short) W(w, 'no short summary');
  if (n.kind !== 'root' && !n.parent) E(w, 'no parent');
  checkText(w + ' short', n.short, false);
  checkText(w + ' body', n.body, true);
  n.ideas.forEach((x, i) => checkText(w + ' idea ' + (i + 1), x, false));
  n.pitfalls.forEach((x, i) => typeof x === 'string' ? checkText(w + ' pitfall ' + (i + 1), x, false) : (checkText(w + ' pitfall ' + (i + 1), x.wrong, false), checkText(w + ' pitfall ' + (i + 1), x.right, false)));
  n.applications.forEach((x, i) => checkText(w + ' application ' + (i + 1), x, false));
  checkText(w + ' history', n.history, true);
  if (n.derivation) { checkText(w + ' derivation', n.derivation.intro, true); checkSteps(w + ' derivation', n.derivation.steps); checkText(w + ' derivation', n.derivation.outro, true); }
  if (n.kind === 'concept') {
    stats.concepts++;
    const b = n.branch || '?';
    stats.byBranch[b] = stats.byBranch[b] || { concepts: 0, formulas: 0, sims: 0, quiz: 0 };
    stats.byBranch[b].concepts++;
    stats.byBranch[b].formulas += n.formulas.length;
    stats.byBranch[b].sims += n.sims.length;
    stats.byBranch[b].quiz += n.quiz.length;
    if (!n.body || n.body.length < 500) W(w, 'body is short (' + (n.body ? n.body.length : 0) + ' characters); aim for a real explanation');
    if (n.ideas.length < 2) W(w, 'fewer than 2 key ideas');
    if (n.quiz.length < 3) W(w, 'fewer than 3 quiz questions');
    if (!n.keywords.length) W(w, 'no keywords (they help search)');
    if (![1, 2, 3].includes(n.level)) E(w, 'level must be 1, 2 or 3');
  }
  n.examples.forEach((ex, i) => {
    stats.examples++;
    const wh = w + ' example ' + (i + 1);
    if (!ex.q) E(wh, 'no question');
    checkText(wh, ex.title, false); checkText(wh, ex.q, true); checkSteps(wh, ex.steps); checkText(wh + ' answer', ex.a, false);
  });
  n.quiz.forEach((q, i) => {
    stats.quiz++;
    const wh = w + ' quiz ' + (i + 1);
    checkText(wh, q.q, true); checkText(wh + ' why', q.why, true);
    if (!q.q) E(wh, 'no question text');
    if (Array.isArray(q.choices)) {
      if (q.choices.length < 2) E(wh, 'needs at least 2 choices');
      if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.choices.length) E(wh, 'answer index a=' + q.a + ' is not one of the choices');
      q.choices.forEach((c, j) => checkText(wh + ' choice ' + (j + 1), String(c), false));
      if (new Set(q.choices.map(String)).size !== q.choices.length) E(wh, 'two choices are identical');
      if (!q.why) W(wh, 'no explanation (why)');
    } else if (typeof q.a === 'boolean') {
      if (!q.why) W(wh, 'no explanation (why)');
    } else if (typeof q.answer === 'string') {
      try {
        const known = new Set(q.vars || ['x']);
        const t = H.expr.parse(q.answer, { known });
        const extra = [...H.expr.vars(t)].filter(v => !known.has(v));
        if (extra.length) E(wh, 'expression answer uses ' + extra.join(', ') + ' which are not in vars');
      } catch (e) { E(wh, 'expression answer does not parse: ' + e.message); }
    } else if (typeof q.answer === 'number') {
      if (!Number.isFinite(q.answer)) E(wh, 'numeric answer is not a finite number');
      if (q.unit != null || q.qty) { const ru = H.resolveUnit({ unit: q.unit, q: q.qty }); if (ru.error) E(wh, ru.error); }
    } else E(wh, 'unknown question type: give choices+a, a:true/false, or answer (string expression / number)');
  });
  n.problems.forEach((p, i) => {
    stats.problems++;
    const wh = w + ' problem ' + (i + 1);
    checkText(wh, p.q, true); checkSteps(wh, p.steps); checkText(wh + ' hint', p.hint, false);
    if (typeof p.answer !== 'number' || !Number.isFinite(p.answer)) E(wh, 'answer must be a number');
    if (p.unit != null || p.qty) { const ru = H.resolveUnit({ unit: p.unit, q: p.qty }); if (ru.error) E(wh, ru.error); }
  });
  for (const s of n.sims) if (!H.sims[s.id]) E(w, 'simulation "' + s.id + '" is not defined');
  stats.sims += n.sims.length;
  // formulas
  const fsList = H.formulasOf(n);
  fsList.forEach((f, i) => {
    stats.formulas++;
    const wh = w + ' formula "' + (f.def.name || i + 1) + '"';
    for (const e of f.errors) E(wh, e);
    if (!f.eq) return;
    checkText(wh + ' name', f.def.name, false);
    checkText(wh + ' note', f.def.note, true);
    checkTex(wh + ' tex', f.displayTex, true);
    for (const v of f.vars) { checkTex(wh + ' var ' + v.id, v.tex, false); checkText(wh + ' var ' + v.id + ' name', v.name, false); }
    if (f.def.tex) {
      // every variable should be visible in the written formula (for the symbol highlight)
      for (const v of f.vars) {
        const key = H.texKey(v.tex);
        let mm = '';
        try { mm = H.tex(f.def.tex, true); } catch (e) { /* reported above */ }
        if (mm && !mm.includes('data-k="' + key.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '"')) W(wh, 'the symbol of "' + v.id + '" (' + v.tex + ') is not found in the formula\'s tex, so it cannot be highlighted or clicked there');
      }
    }
    const s = f.defaults();
    const r0 = f.solve(f.target, s);
    if (!r0.ok) { E(wh, 'cannot solve for its own unknown "' + f.target + '" with the default values: ' + r0.reason); return; }
    s[f.target] = r0.value;
    // a result of 3e-15 where 0 is expected is fine: compare against the formula's own scale
    const scale = Math.max(...f.vars.map(v => Math.abs(s[v.id]) || 0).filter(Number.isFinite), 1e-300);
    const near = (x, y) => close(x, y) || Math.abs(x - y) <= 1e-9 * scale;
    for (const v of f.vars) {
      if (v.def == null && v.id !== f.target && !v.isConst) W(wh, 'variable "' + v.id + '" has no value: give it a typical one');
      if (v.isConst) continue;
      const want = s[v.id];
      const s2 = Object.assign({}, s, { [v.id]: want === 0 ? 1 : want * 1.37 });
      const r = f.solve(v.id, s2);
      if (!r.ok) W(wh, 'solving for "' + v.id + '" fails with the default values (' + r.reason + ')');
      else if (!r.all.some(x => near(x, want))) E(wh, 'solving for "' + v.id + '" gives ' + r.all.map(x => +x.toPrecision(6)).join(' or ') + ' but the other values imply ' + +want.toPrecision(6) + ' — check the expression, units or min/max');
    }
    let made = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const p = f.problem({ seed });
      if (!p) continue;
      made++;
      checkText(wh + ' generated problem', f.problemText(p), true);
      for (const st of f.solutionSteps(p)) { checkText(wh + ' generated solution', st.text, true); checkTex(wh + ' generated solution', st.tex, true); }
    }
    if (!made && f.def.practice !== false) W(wh, 'no practice problem could be generated');
    if (f.def.stories) for (const [k, t] of Object.entries(f.def.stories)) {
      if (!f.byName[k]) E(wh, 'story for unknown variable "' + k + '"');
      for (const m of t.match(/\{(\w+)\}/g) || []) if (!f.byName[m.slice(1, -1)]) E(wh, 'story mentions {' + m.slice(1, -1) + '} which is not a variable');
    }
  });
}
// simulations
for (const [id, def] of Object.entries(H.sims)) {
  if (only && !only.has(fileOfSim.get(id))) continue;
  if (typeof def.mount !== 'function') E('sim ' + id, 'has no mount(box, kit, params) function');
  if (!def.title) W('sim ' + id, 'no title');
  checkText('sim ' + id + ' blurb', def.blurb, true);
  if (!H.list.some(n => n.sims.some(s => s.id === id))) W('sim ' + id, 'is not used by any concept');
}
// planned concepts
const missing = [];
for (const n of H.list) for (const [id, title] of (n.plan || [])) if (!H.nodes.has(id)) missing.push(id + ' (' + title + ', under ' + n.id + ')');
if (missing.length) (FINAL ? errors : infos).push(missing.length + ' planned concepts not written yet' + (missing.length <= 400 ? ':\n    ' + missing.join('\n    ') : ''));
// concepts not in any plan
for (const n of H.list) if (n.kind === 'concept' && mine(n.id)) {
  const p = H.nodes.get(n.parent);
  if (p && p.plan && !p.plan.some(x => x[0] === n.id)) infos.push(n.id + ' is an extra concept under ' + n.parent + ' (not in its plan) — fine if intended');
}

/* ---------------------------------------------------------------- report */
const out = [];
out.push(path.basename(discDir) + (only ? ' (only ' + [...only].map(f => path.relative(discDir, f)).join(', ') + ')' : ''));
out.push('  ' + stats.concepts + ' concepts, ' + stats.formulas + ' formulas, ' + stats.quiz + ' quiz questions, ' + stats.examples + ' examples, ' + stats.problems + ' problems, ' + stats.sims + ' simulation uses, ' + Object.keys(H.sims).length + ' simulations defined');
if (!only) for (const [b, s] of Object.entries(stats.byBranch)) out.push('    ' + b.padEnd(22) + s.concepts + ' concepts  ' + s.formulas + ' formulas  ' + s.sims + ' sims  ' + s.quiz + ' quiz');
console.log(out.join('\n'));
if (errors.length) console.log('\nERRORS (' + errors.length + ')\n  ' + errors.join('\n  '));
if (warns.length && !QUIET) console.log('\nWARNINGS (' + warns.length + ')\n  ' + warns.join('\n  '));
if (infos.length && !QUIET) console.log('\nNOTES\n  ' + infos.join('\n  '));
console.log('\n' + (errors.length ? 'FAILED with ' + errors.length + ' error(s)' : 'OK') + (warns.length ? ', ' + warns.length + ' warning(s)' : ''));
process.exit(errors.length ? 1 : 0);
