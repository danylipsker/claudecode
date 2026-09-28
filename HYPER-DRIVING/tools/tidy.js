#!/usr/bin/env node
/* Hyper Driving · tools/tidy.js — mechanical clean-ups of written content.
 *
 *   node tools/tidy.js            report what would change
 *   node tools/tidy.js --apply    rewrite the files
 *
 * - Hebrew typography: "…" around Hebrew text → „…”; ASCII " between Hebrew
 *   letters → ״ (gershayim); ' after ג ז צ ת ץ צ in transliterations → ׳.
 * - Questions: options are put in a fixed pseudo-random order per question id
 *   (the answer index follows), so the stored correct answer is not always in
 *   the same place (the app also shuffles on screen). Questions marked
 *   "fixed": true are left alone. The same order is applied to every language
 *   version of a question, so translations stay aligned.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const pack = path.join(ROOT, 'content', 'il');
const apply = process.argv.includes('--apply');
const skipRe = (() => { const i = process.argv.indexOf('--skip'); return i >= 0 ? new RegExp(process.argv[i + 1]) : null; })();
const HEB = /[א-ת]/;

function typo(s) {
  if (typeof s !== 'string' || !HEB.test(s)) return s;
  let t = s;
  // "…" pairs in Hebrew text (not inside markup references)
  t = t.replace(/(^|[\s(\[—–-])"([^"\n\[\]{}]{1,80}?)"(?=$|[\s.,;:!?)\]—–-])/g, (m, pre, inner) => (HEB.test(inner) ? pre + '„' + inner + '”' : m));
  t = t.replace(/([א-ת])"([א-ת])/g, '$1״$2');
  t = t.replace(/([גזצתץ])'(?=[\s,.;:!?)־—–-]|$)/g, '$1׳');
  return t;
}
function walk(o, fn) {
  if (Array.isArray(o)) return o.map((x) => walk(x, fn));
  if (o && typeof o === 'object') { const r = {}; for (const k of Object.keys(o)) r[k] = k === 'svg' || k === 'id' ? o[k] : walk(o[k], fn); return r; }
  return fn(o);
}
// a permutation from the question id (xorshift seeded by FNV-1a)
function perm(id, n) {
  let h = 2166136261; for (let i = 0; i < id.length; i++) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  let s = h >>> 0 || 1;
  const rnd = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

let changed = 0;
const langs = fs.readdirSync(pack).filter((d) => /^[a-z]{2}$/.test(d));
for (const l of langs) {
  for (const sub of ['lessons', 'questions', 'trees']) {
    const dir = path.join(pack, l, sub);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json') && !(skipRe && skipRe.test(n)))) {
      const file = path.join(dir, f);
      const before = fs.readFileSync(file, 'utf8');
      let j = walk(JSON.parse(before), typo);
      if (sub === 'questions') {
        j.questions = j.questions.map((q) => {
          if (q.fixed || q.shuffled || !Array.isArray(q.options)) return q;
          const p = perm(q.id, q.options.length);           // new position k holds old option p[k]
          const opts = p.map((i) => q.options[i]);
          return Object.assign({}, q, { options: opts, answer: p.indexOf(q.answer), shuffled: true });
        });
      }
      const after = JSON.stringify(j, null, 1) + '\n';
      if (after !== before) {
        changed++;
        console.log((apply ? 'tidied ' : 'would tidy ') + path.relative(ROOT, file));
        if (apply) fs.writeFileSync(file, after);
      }
    }
  }
}
console.log(changed + ' files' + (apply ? ' rewritten' : ' (dry run; --apply to write)'));
