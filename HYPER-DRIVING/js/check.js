/* Hyper Driving · check.js — checks a loaded pack: every reference resolves,
 * questions are well formed, languages match, trees are complete, Hebrew
 * typography is right. Used by the editor (Check screen) and by
 * tools/validate.js, so the same rules hold in both places.
 */
(function (D) {
  'use strict';
  const K = D.check = {};
  const REF = /\[\[(\w+):([^\]|]+)(?:\|([^\]]*))?\]\]/g;
  const VAL = /\{\{(\w+):([^}|]+)(?:\|[^}]*)?\}\}/g;
  const KINDS = new Set(['term', 'sign', 'dash', 'lesson', 'chapter', 'tree', 'fig', 'widget', 'signs']);
  const CATS = new Set(['warning', 'priority', 'prohibition', 'mandatory', 'information', 'guide', 'supplementary', 'roadworks', 'marking', 'light', 'other']);

  K.run = () => {
    const d = D.data;
    const errors = [], warnings = [];
    const err = (w, m) => errors.push(w + ': ' + m);
    const warn = (w, m) => warnings.push(w + ': ' + m);

    const refs = (text, where) => {
      if (text == null) return;
      const s = String(text);
      let m;
      REF.lastIndex = 0;
      while ((m = REF.exec(s))) {
        const k = m[1], id = m[2].trim();
        if (!KINDS.has(k)) { err(where, 'unknown reference kind [[' + k + ':…]]'); continue; }
        const ok = {
          term: () => d.termById.has(id),
          sign: () => d.signByNum.has(id),
          signs: () => id.split(',').every((n) => d.signByNum.has(n.trim())),
          dash: () => d.dashById.has(id),
          lesson: () => !!D.content.lesson(id),
          chapter: () => !!D.content.chapterMeta(id),
          tree: () => !!D.content.tree(id),
          fig: () => !!d.figures[id],
          widget: () => !D.widgets || D.widgets.has(id.split(/\s+/)[0])
        }[k]();
        if (!ok) err(where, 'missing ' + k + ' "' + id + '"');
      }
      VAL.lastIndex = 0;
      while ((m = VAL.exec(s))) {
        const k = m[1], id = m[2].trim();
        if (k === 'fact') {
          if (!d.facts.has(id)) err(where, 'missing fact "' + id + '"');
          else if (!/\|\s*n\s*\}\}$/.test(m[0])) {
            // "{{fact:x}} שנים" prints the unit twice ("5 שנים שנים") — use {{fact:x|n}}
            // the next two words, without a possessive or a Hebrew prefix letter ("השעות", "valid points")
            const after = (s.slice(VAL.lastIndex).match(/^(?:\s+[^\s.,;:!?()[\]{}|—–]+){1,2}/) || [''])[0].trim().split(/\s+/);
            const units = unitWords(d.facts.get(id).unit);
            // (only the article ה marks a repeat: "5 שעות השעות"; "מיום", "בשעות" are ordinary words)
            const hit = after.find((wd, i) => { const x = wd.replace(/[’']s?$/, '').toLowerCase(); return units.has(x) || (i === 0 && /^ה[א-ת]/.test(x) && units.has(x.slice(1))); });
            if (hit) err(where, 'unit "' + hit + '" written after {{fact:' + id + '}}, which prints its own — use {{fact:' + id + '|n}} or drop the word');
            // "גיל 17 שנים" / "age 17 years": after an age word the number stands alone
            if (d.facts.get(id).unit === 'years' && /(^|[\s(„"“—*_-])((?:ב|ל|מ)?גיל|[Aa]ges?|[Aa]ged) $/.test(s.slice(0, m.index))) err(where, 'age word before {{fact:' + id + '}} — use {{fact:' + id + '|n}} ("גיל 17", "age 17")');
          }
        }
        else if (k === 'fine' || k === 'points') {
          const o = d.offences.get(id);
          if (!o) err(where, 'missing offence "' + id + '"');
          else if (o[k === 'fine' ? 'fine' : 'points'] == null) warn(where, 'offence "' + id + '" has no ' + k);
        } else err(where, 'unknown value kind {{' + k + ':…}}');
      }
      // Hebrew typography: gershayim and geresh, not ASCII quotes
      if (/[א-ת]"[א-ת]/.test(s)) warn(where, 'ASCII " inside a Hebrew word — use ״ (gershayim)');
      if (/[גזצתץ]'/.test(s)) warn(where, 'ASCII \' after a Hebrew letter — use ׳ (geresh)');
      if (/\[\[[^\]]*$|^[^[]*\]\]/.test(s.replace(/\[\[[^\]]*\]\]/g, ''))) warn(where, 'unbalanced [[ ]]');
      const colons = (s.match(/^:::/gm) || []).length;
      if (colons % 2) err(where, 'unclosed ::: callout');
    };

    // every spelling a unit is printed with, in any language ("שנה", "שנים", "year", "years")
    function unitWords(unit) {
      const out = new Set();
      const add = (u) => Object.entries(D.content.UNITS[u] || {}).forEach(([k, v]) => { if (k.length === 2) [].concat(v).forEach((w) => w && out.add(String(w).toLowerCase())); });
      add(unit);
      if (unit === 'ym') { add('years'); add('months'); }
      return out;
    }
    // a text with its values filled in as they read on a given date (for comparing options)
    const valueAt = (text, lang, date) => String(text || '').replace(/\{\{(fact|fine|points):([^}|]+)(?:\|([^}]*))?\}\}/g, (m0, k, id, arg) => {
      id = id.trim();
      if (k === 'fact') {
        const f = d.facts.get(id);
        return f ? D.content.fmtValue(D.content.factValue(f, date), f.unit, lang, { numberOnly: arg === 'n' }) : m0;
      }
      const o = d.offences.get(id); if (!o) return m0;
      const key = k === 'fine' ? 'fine' : 'points';
      return String(D.content.factValue({ value: o[key], changes: (o.changes || []).filter((c) => c[key] != null).map((c) => ({ from: c.from, value: c[key] })) }, date));
    });
    // option text for comparing: unit spellings made equal ("30 m" = "30 metres" = "30 מטרים"), no thousands separators
    const UNITFORM = new Map();
    Object.entries(D.content.UNITS).forEach(([u, def]) => ['he', 'en'].forEach((l) => [].concat(def[l] || []).forEach((w) => { if (w) UNITFORM.set(D.content.norm(w), u); })));
    [['מטרים', 'm'], ['מ׳', 'm'], ['metres', 'm'], ['metre', 'm'], ['meters', 'm'], ['meter', 'm'], ['kilometres', 'km'], ['centimetres', 'cm'], ['millimetres', 'mm'],
      ['kilograms', 'kg'], ['kilogram', 'kg'], ['tonnes', 't'], ['tonne', 't'], ['tons', 't'], ['שניה', 's']].forEach(([w, u]) => UNITFORM.set(D.content.norm(w), u));
    const canon = (s) => D.content.norm(s).replace(/(\d),(?=\d{3}\b)/g, '$1').split(' ').map((w) => UNITFORM.get(w) || w).join(' ');
    // the dates on which any value used in these texts changes (from today on)
    const changeDates = (texts) => {
      const today = D.util.today(), dates = new Set([today]);
      texts.forEach((t) => String(t || '').replace(/\{\{(fact|fine|points):([^}|]+)[^}]*\}\}/g, (m0, k, id) => {
        const x = k === 'fact' ? d.facts.get(id.trim()) : d.offences.get(id.trim());
        ((x && x.changes) || []).forEach((c) => { if (c.from > today) dates.add(c.from); });
        return m0;
      }));
      return [...dates].sort();
    };

    const langs = Object.keys(d.text);
    const dl = d.manifest.defaultLanguage || 'he';

    // course and lessons
    const chapterIds = new Set();
    d.course.chapters.forEach((c) => {
      if (chapterIds.has(c.id)) err('course', 'duplicate chapter ' + c.id);
      chapterIds.add(c.id);
      if (!d.text[dl] || !d.text[dl].chapters.has(c.id)) warn('course', 'chapter "' + c.id + '" has no lessons file in ' + dl);
    });
    const allLessons = new Map();
    langs.forEach((l) => {
      const t = d.text[l];
      t.chapters.forEach((ch, cid) => {
        if (!chapterIds.has(cid)) err(l + '/lessons/' + cid, 'chapter not in course.json');
        (ch.lessons || []).forEach((ls) => {
          const w = l + ' lesson ' + ls.id;
          if (!ls.id) { err(l + '/lessons/' + cid, 'lesson without id'); return; }
          if (!ls.title) err(w, 'no title');
          if (!ls.body || ls.body.length < 80) warn(w, 'very short body');
          const key = l + ':' + ls.id;
          if (allLessons.has(key)) err(w, 'duplicate lesson id'); allLessons.set(key, ls);
          refs(ls.body, w); (ls.keyPoints || []).forEach((k) => refs(k, w + ' keyPoint'));
          refs(ls.title, w + ' title'); refs(ls.summary, w + ' summary');
          (ls.terms || []).forEach((x) => { if (!d.termById.has(x)) err(w, 'terms: missing term "' + x + '"'); });
          (ls.signs || []).forEach((x) => { if (!d.signByNum.has(String(x))) err(w, 'signs: missing sign "' + x + '"'); });
          if (ls.licence) ls.licence.forEach((x) => { if (!knownLic(x)) err(w, 'unknown licence "' + x + '"'); });
        });
      });
    });
    function knownLic(x) { return (d.licences.classes || []).some((c) => c.id === x) || !!(d.licences.groups || {})[x]; }

    // questions
    const qIds = new Map();
    langs.forEach((l) => {
      d.text[l].questions.forEach((q) => {
        const w = l + ' question ' + q.id;
        if (!q.id) { err(l, 'question without id'); return; }
        if (qIds.has(l + ':' + q.id)) err(w, 'duplicate question id'); qIds.set(l + ':' + q.id, q);
        if (!chapterIds.has(q._chapter)) err(w, 'unknown chapter ' + q._chapter);
        if (!q.q) err(w, 'no question text');
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 6) err(w, 'needs 2–6 options');
        else {
          if (!(q.answer >= 0 && q.answer < q.options.length)) err(w, 'answer index out of range');
          const seen = new Set();
          q.options.forEach((o, i) => { if (!String(o).trim()) err(w, 'empty option ' + i); const n = D.content.norm(o); if (seen.has(n)) err(w, 'duplicate option "' + o + '"'); seen.add(n); refs(o, w + ' option'); });
          // two options that read the same once the values are filled in — today, or after a scheduled change
          // (a typed wrong answer can collide with a fact whose value changed)
          changeDates(q.options).forEach((date) => {
            const read = new Map();
            q.options.forEach((o, i) => {
              const n = canon(valueAt(o, l, date));
              if (read.has(n)) err(w, 'options ' + (read.get(n) + 1) + ' and ' + (i + 1) + ' read the same ("' + valueAt(o, l, date) + '")' + (date !== D.util.today() ? ' from ' + date : ''));
              else read.set(n, i);
            });
          });
        }
        if (!q.explain) warn(w, 'no explanation');
        if (q.lesson && !D.content.lesson(q.lesson)) err(w, 'missing lesson "' + q.lesson + '"');
        if (q.sign && !d.signByNum.has(String(q.sign))) err(w, 'missing sign "' + q.sign + '"');
        if (q.fig && !d.figures[q.fig]) err(w, 'missing figure "' + q.fig + '"');
        (q.facts || []).forEach((f) => { if (!d.facts.has(f)) err(w, 'facts: missing fact "' + f + '"'); });
        if (q.licence) q.licence.forEach((x) => { if (!knownLic(x)) err(w, 'unknown licence "' + x + '"'); });
        refs(q.q, w); refs(q.explain, w + ' explain');
      });
    });
    // languages agree on answers
    if (langs.length > 1) {
      d.text[dl].questions.forEach((q) => {
        langs.filter((l) => l !== dl).forEach((l) => {
          const o = d.text[l].qById.get(q.id);
          if (o && o.answer !== q.answer) err(l + ' question ' + q.id, 'answer differs from ' + dl);
          if (o && o.options.length !== q.options.length) err(l + ' question ' + q.id, 'option count differs from ' + dl);
        });
      });
    }

    // translations follow the default language: same ids, same references,
    // same shape (checked only for chapters/trees the translation has)
    const refSet = (s) => {
      const out = [];
      String(s || '').replace(/\{\{(fact|fine|points):([^}|]+)[^}]*\}\}/g, (m, k, id) => { out.push(k + ':' + id.trim()); return m; });
      String(s || '').replace(/\[\[(sign|signs|dash|fig|widget|lesson|chapter|tree):([^\]|]+)[^\]]*\]\]/g, (m, k, id) => { out.push(k + ':' + id.trim()); return m; });
      return out.sort().join(' ');
    };
    const count = (s, re) => (String(s || '').match(re) || []).length;
    langs.filter((l) => l !== dl).forEach((l) => {
      const src = d.text[dl], tr = d.text[l];
      tr.chapters.forEach((ch, cid) => {
        const sc = src.chapters.get(cid); if (!sc) return;
        const a = (sc.lessons || []).map((x) => x.id), b = (ch.lessons || []).map((x) => x.id);
        a.filter((id) => !b.includes(id)).forEach((id) => warn(l + ' lesson ' + id, 'missing (in ' + dl + ')'));
        b.filter((id) => !a.includes(id)).forEach((id) => err(l + ' lesson ' + id, 'not in ' + dl));
        if (a.join() !== b.filter((id) => a.includes(id)).join()) warn(l + '/lessons/' + cid, 'lesson order differs from ' + dl);
        (ch.lessons || []).forEach((ls) => {
          const s = src.lessonById.get(ls.id); if (!s) return;
          const w = l + ' lesson ' + ls.id;
          if (refSet(s.body) !== refSet(ls.body)) warn(w, 'references differ from ' + dl + ': ' + dl + ' [' + refSet(s.body) + '] vs [' + refSet(ls.body) + ']');
          if ((s.keyPoints || []).length !== (ls.keyPoints || []).length) warn(w, 'key point count differs from ' + dl);
          if (count(s.body, /^:::\w+/gm) !== count(ls.body, /^:::\w+/gm)) warn(w, 'callout count differs from ' + dl);
          if (count(s.body, /^#{1,3}\s/gm) !== count(ls.body, /^#{1,3}\s/gm)) warn(w, 'heading count differs from ' + dl);
          if (JSON.stringify(s.licence || []) !== JSON.stringify(ls.licence || [])) err(w, 'licence differs from ' + dl);
          if (/[א-ת]{3,}/.test(String(ls.title) + ' ' + String(ls.summary)) && l !== 'he') warn(w, 'title/summary still contains Hebrew');
        });
      });
      const trQ = new Set(tr.questions.map((q) => q._chapter));
      src.questions.forEach((q) => {
        if (!trQ.has(q._chapter)) return;
        const o = tr.qById.get(q.id);
        if (!o) { warn(l + ' question ' + q.id, 'missing (in ' + dl + ')'); return; }
        const w = l + ' question ' + q.id;
        const qs = refSet(q.q + ' ' + q.options.join(' ') + ' ' + (q.explain || '')), os = refSet(o.q + ' ' + o.options.join(' ') + ' ' + (o.explain || ''));
        if (qs !== os) warn(w, 'references differ from ' + dl);
        ['lesson', 'sign', 'fig'].forEach((k) => { if ((q[k] || '') !== (o[k] || '')) err(w, '"' + k + '" differs from ' + dl); });
        if (JSON.stringify(q.licence || []) !== JSON.stringify(o.licence || [])) err(w, 'licence differs from ' + dl);
      });
      tr.trees.forEach((t) => {
        const s = src.treeById.get(t.id); if (!s) { err(l + ' tree ' + t.id, 'not in ' + dl); return; }
        const shape = (x) => Object.keys(x.nodes || {}).sort().map((k) => k + '>' + ((x.nodes[k].options || []).map((o) => o.next).join(',')) + (x.nodes[k].severity || '')).join(' ');
        if (shape(s) !== shape(t) || s.start !== t.start) err(l + ' tree ' + t.id, 'node structure differs from ' + dl);
      });
    });

    // trees
    langs.forEach((l) => d.text[l].trees.forEach((tr) => {
      const w = l + ' tree ' + tr.id;
      const nodes = tr.nodes || {};
      if (!nodes[tr.start]) { err(w, 'start node "' + tr.start + '" missing'); return; }
      const seen = new Set(); const stack = [tr.start];
      while (stack.length) {
        const id = stack.pop(); if (seen.has(id)) continue; seen.add(id);
        const n = nodes[id]; if (!n) { err(w, 'missing node "' + id + '"'); continue; }
        refs(n.q, w + ' ' + id); refs(n.text, w + ' ' + id); refs(n.result, w + ' ' + id); (n.actions || []).forEach((a) => refs(a, w + ' ' + id));
        if (n.q) {
          if (!n.options || n.options.length < 2) err(w, 'node "' + id + '" asks but has < 2 options');
          (n.options || []).forEach((o) => { refs(o.label, w + ' ' + id); if (!nodes[o.next]) err(w, 'node "' + id + '" → missing "' + o.next + '"'); else stack.push(o.next); });
        } else if (!n.result) err(w, 'node "' + id + '" has neither q nor result');
        if (n.severity && !['stop', 'soon', 'ok'].includes(n.severity)) err(w, 'node "' + id + '" bad severity');
        if (n.lesson && !D.content.lesson(n.lesson)) err(w, 'node "' + id + '" missing lesson ' + n.lesson);
      }
      Object.keys(nodes).forEach((id) => { if (!seen.has(id)) warn(w, 'unreachable node "' + id + '"'); });
      refs(tr.safety, w + ' safety');
    }));

    // signs
    const nums = new Set();
    d.signs.forEach((s) => {
      const w = 'sign ' + s.num;
      if (nums.has(String(s.num))) err(w, 'duplicate number'); nums.add(String(s.num));
      if (!CATS.has(s.cat)) err(w, 'unknown category "' + s.cat + '"');
      if (!s.name || !s.name[dl]) err(w, 'no ' + dl + ' name');
      if (!s.meaning || !s.meaning[dl]) warn(w, 'no ' + dl + ' meaning');
      if (!s.svg) (s.draw || []).forEach((it) => { if (it.g && !D.glyphs.has(it.g)) err(w, 'unknown glyph "' + it.g + '"'); });
      (s.lamps || []).forEach((lp) => { if (lp.g && !D.glyphs.has(lp.g)) err(w, 'unknown glyph "' + lp.g + '"'); });
      (s.related || []).forEach((r) => { if (!d.signByNum.has(String(r))) warn(w, 'related sign "' + r + '" missing'); });
      if (!(d.series || []).some((x) => x.id === String(s.series))) warn(w, 'series "' + s.series + '" not described');
      Object.values(s.meaning || {}).forEach((x) => refs(x, w)); Object.values(s.notes || {}).forEach((x) => refs(x, w));
    });

    // sign pictures: each belongs to a sign, and is well formed
    Object.keys(d.signArt || {}).forEach((num) => {
      const w = 'sign picture ' + num, list = d.signArt[num];
      if (!d.signByNum.has(num)) err(w, 'no sign with this number');
      if (!Array.isArray(list) || !list.length) return err(w, 'not a list of pictures');
      list.forEach((p, i) => {
        const wi = list.length > 1 ? w + ' (' + (i + 1) + ')' : w;
        if (!p || !(p.w > 0 && p.h > 0)) return err(wi, 'no size');
        if (!Array.isArray(p.layers) || !p.layers.length) return err(wi, 'no layers');
        p.layers.forEach((l, j) => {
          if (!/^(#[0-9a-f]{3,8}|[a-z]+)$/i.test(l[0])) err(wi, 'layer ' + (j + 1) + ': bad colour "' + l[0] + '"');
          if (typeof l[1] !== 'string' || !/^M[MmLlCcQqZz0-9\s,.-]*$/.test(l[1])) err(wi, 'layer ' + (j + 1) + ': bad path');
        });
      });
    });

    // dashboard lights
    d.dash.forEach((x) => {
      const w = 'dash ' + x.id;
      if (x.g && !D.glyphs.has(x.g)) err(w, 'unknown glyph "' + x.g + '"');
      if (!x.g && !x.draw) err(w, 'no glyph or drawing');
      if (!x.name || !x.name[dl]) err(w, 'no ' + dl + ' name');
      if (!['red', 'amber', 'yellow', 'green', 'blue', 'white'].includes(x.color)) err(w, 'bad colour ' + x.color);
      if (x.tree && !D.content.tree(x.tree)) err(w, 'missing tree ' + x.tree);
      Object.values(x.meaning || {}).forEach((y) => refs(y, w)); Object.values(x.action || {}).forEach((y) => refs(y, w));
    });

    // glossary
    const tids = new Set();
    d.glossary.forEach((t) => {
      const w = 'term ' + t.id;
      if (tids.has(t.id)) err(w, 'duplicate id'); tids.add(t.id);
      if (!t.term || !t.term[dl]) err(w, 'no ' + dl + ' term');
      if (!t.term || !t.term.en) warn(w, 'no English term');
      if (!t.def || !t.def[dl]) warn(w, 'no ' + dl + ' definition');
      (t.see || []).forEach((s) => { if (!d.termById.has(s)) warn(w, 'see: missing "' + s + '"'); });
      if (t.usage && t.usage.he === 'none') warn(w, 'no Hebrew term yet (shown in English)');
    });

    // facts and offences
    d.facts.forEach((f, id) => {
      const w = 'fact ' + id;
      if (f.unit && !D.content.UNITS[f.unit]) err(w, 'unknown unit "' + f.unit + '"');
      if (!f.label || !f.label[dl]) err(w, 'no ' + dl + ' label');
      if (!f.source) warn(w, 'no source');
      if (f.confidence === 'low') warn(w, 'low confidence — verify');
      (f.changes || []).forEach((c) => { if (!/^\d{4}-\d{2}-\d{2}$/.test(c.from || '')) err(w, 'change without a valid "from" date'); });
    });
    d.offences.forEach((o, id) => {
      const w = 'offence ' + id;
      if (!o.title || !o.title[dl]) err(w, 'no ' + dl + ' title');
      if (o.confidence === 'low') warn(w, 'low confidence — verify');
    });

    // figures, maintenance, notices
    Object.entries(d.figures).forEach(([id, f]) => {
      const w = 'figure ' + id;
      if (f.kind === 'widget' && D.widgets && !D.widgets.has(f.widget)) err(w, 'unknown widget ' + f.widget);
      if (f.kind !== 'widget' && !f.svg) err(w, 'no svg');
      Object.values(f.caption || {}).forEach((c) => refs(c, w + ' caption'));
      Object.entries(f.labels || {}).forEach(([k, l]) => Object.values(l || {}).forEach((t) => refs(t, w + ' label ' + k)));
      if (f.svg) (String(f.svg).match(/\{\{label:([\w.-]+)\}\}/g) || []).forEach((m) => { const k = m.slice(8, -2); if (!(f.labels || {})[k]) err(w, 'svg uses {{label:' + k + '}} but labels has no "' + k + '"'); });
    });
    ((d.maintenance || {}).items || []).forEach((i, k) => { if (!i.name) err('maintenance ' + k, 'no name'); if (i.lesson && !D.content.lesson(i.lesson)) err('maintenance ' + k, 'missing lesson ' + i.lesson); });
    (d.notices || []).forEach((n) => Object.values(n.body || {}).forEach((b) => refs(b, 'notice ' + n.id)));

    return { errors, warnings };
  };
})(globalThis.Drive = globalThis.Drive || {});
