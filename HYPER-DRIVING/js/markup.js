/* Hyper Driving · markup.js — the small text language lessons, questions and
 * explanations are written in (AUTHORING.md is the writers' guide).
 *
 * Blocks (one per line or paragraph):
 *   blank line            ends a paragraph
 *   # Heading / ## Sub    section headings inside a lesson
 *   - item / 1. item      lists (a line indented by two spaces continues the item)
 *   | a | b |             table rows; a |---| row under the first row makes it a header
 *   :::law [title] … :::  callouts: law, warn, danger, tip, remember, example, note, tech, fine
 *   ---                   a rule
 *   [[fig:id]]            a diagram from figures.json, alone on its line
 *   [[widget:id a=1 b=x]] an interactive widget, alone on its line
 *   [[signs:301,302,303]] a row of sign cards, alone on its line
 * Inline:
 *   **bold**   ==highlight==
 *   [[term:id]] [[term:id|shown text]]     glossary term (tap → Hebrew + English + definition)
 *   [[sign:302]] [[sign:302|text]] [[sign:302|icon]]
 *   [[lesson:id|text]] [[chapter:id|text]] [[tree:id|text]] [[dash:id]] [[dash:id|icon]]
 *   {{fact:id}} {{fact:id|n}} (number only)   {{fine:offence}} {{points:offence}}
 */
(function (D) {
  'use strict';
  const { esc } = D.util;
  const M = D.markup = {};

  const CALLOUT = {
    law: { he: 'החוק קובע', en: 'The law says', icon: '§' },
    warn: { he: 'שימו לב', en: 'Watch out', icon: '!' },
    danger: { he: 'סכנה', en: 'Danger', icon: '⚠' },
    tip: { he: 'טיפ', en: 'Tip', icon: '✦' },
    remember: { he: 'לזכור', en: 'Remember', icon: '★' },
    example: { he: 'דוגמה', en: 'Example', icon: '▸' },
    note: { he: 'הערה', en: 'Note', icon: 'i' },
    tech: { he: 'מאחורי הקלעים', en: 'Under the bonnet', icon: '⚙' },
    fine: { he: 'קנס ונקודות', en: 'Fine and points', icon: '₪' }
  };
  M.CALLOUT = CALLOUT;

  // text shown in another language than the interface (a lesson not yet
  // translated) formats its values and terms in its own language
  M.lang = null;
  M.withLang = (lang, fn) => { const prev = M.lang; M.lang = lang; try { return fn(); } finally { M.lang = prev; } };
  const L = () => M.lang || D.lang();

  // collected while rendering, so a check can report broken references
  M.problems = [];
  const bad = (what) => { M.problems.push(what); return '<span class="bad-ref" title="missing">⟦' + esc(what) + '⟧</span>'; };

  // ---------- inline ----------
  function factHTML(kind, id, arg) {
    if (kind === 'fact') {
      const f = D.fact(id); if (!f) return bad('fact:' + id);
      const v = D.content.factValue(f);
      const txt = D.content.fmtValue(v, f.unit, L(), { numberOnly: arg === 'n' });
      const nx = D.content.nextChange(f);
      const title = D.tr(f.label) + (nx ? ' · ' + D.t('upd.scheduled', { d: D.fmtDate(nx.from), v: D.content.fmtValue(nx.value, f.unit) }) : '');
      return '<span class="fact' + (nx ? ' fact-changing' : '') + '" data-fact="' + esc(id) + '" title="' + esc(title) + '"><bdi>' + esc(txt) + '</bdi></span>';
    }
    const o = D.offence(id); if (!o) return bad(kind + ':' + id);
    if (kind === 'fine') {
      const v = D.content.factValue({ value: o.fine, changes: (o.changes || []).filter((c) => c.fine != null).map((c) => ({ from: c.from, value: c.fine })) });
      return '<span class="fact" data-offence="' + esc(id) + '" title="' + esc(D.tr(o.title)) + '"><bdi>' + esc(v == null ? '—' : D.content.fmtValue(v, 'ils', L())) + '</bdi></span>';
    }
    const p = D.content.factValue({ value: o.points, changes: (o.changes || []).filter((c) => c.points != null).map((c) => ({ from: c.from, value: c.points })) });
    return '<span class="fact" data-offence="' + esc(id) + '" title="' + esc(D.tr(o.title)) + '"><bdi>' + esc(p == null ? '—' : D.fmtNum(p)) + '</bdi></span>';
  }

  function termHTML(id, text) {
    const t = D.data.termById.get(id);
    if (!t) return bad('term:' + id);
    const lang = L();
    const shown = text || D.content.termName(t, lang, D.settings.niqqud);
    let extra = '';
    // beside the term, the same term in the other language: English in Hebrew
    // text, Hebrew in English text (readers in Israel meet both)
    const otherLang = lang === 'he' ? 'en' : 'he';
    const other = t.term && t.term[otherLang] && !D.content.termMissing(t, otherLang) && !D.content.termMissing(t, lang)
      ? String(t.term[otherLang]).replace(/\s*\([^)]*\)\s*$/, '') : '';
    if (D.settings.showEnglishTerms && other && other !== shown) {
      extra = '<span class="term-en"' + (otherLang === 'he' ? ' lang="he" dir="rtl"' : '') + '><bdi>' + esc(other) + '</bdi></span>';
    }
    const miss = D.content.termMissing(t, lang) ? ' term-missing' : '';
    return '<button type="button" class="term' + miss + '" data-term="' + esc(id) + '"><bdi>' + esc(shown) + '</bdi>' + extra + '</button>';
  }

  function signHTML(num, arg) {
    const s = D.data.signByNum.get(String(num));
    if (!s) return bad('sign:' + num);
    const ico = '<span class="sign-ico" aria-hidden="true">' + D.signs.svg(s, { size: 28 }) + '</span>';
    if (arg === 'icon') return '<a class="sign-ref icon-only" href="#/sign/' + esc(num) + '" title="' + esc(D.tr(s.name)) + '">' + ico + '</a>';
    return '<a class="sign-ref" href="#/sign/' + esc(num) + '">' + ico + '<bdi>' + esc(arg || D.tr(s.name)) + '</bdi></a>';
  }

  function dashHTML(id, arg) {
    const d = D.data.dashById.get(id);
    if (!d) return bad('dash:' + id);
    const ico = '<span class="dash-ico" aria-hidden="true">' + D.dash.svg(d, { size: 24 }) + '</span>';
    if (arg === 'icon') return '<a class="dash-ref icon-only" href="#/vehicle/dash/' + esc(id) + '" title="' + esc(D.tr(d.name)) + '">' + ico + '</a>';
    return '<a class="dash-ref" href="#/vehicle/dash/' + esc(id) + '">' + ico + '<bdi>' + esc(arg || D.tr(d.name)) + '</bdi></a>';
  }

  function linkHTML(kind, id, text) {
    const C = D.content;
    if (kind === 'lesson') {
      const ls = C.lesson(id); if (!ls) return bad('lesson:' + id);
      return '<a class="xref" href="#/lesson/' + esc(id) + '">' + esc(text || ls.title) + '</a>';
    }
    if (kind === 'chapter') {
      const ch = C.chapter(id);
      if (!ch && !C.chapterMeta(id)) return bad('chapter:' + id);
      return '<a class="xref" href="#/chapter/' + esc(id) + '">' + esc(text || (ch ? ch.title : id)) + '</a>';
    }
    if (kind === 'tree') {
      const tr = C.tree(id); if (!tr) return bad('tree:' + id);
      return '<a class="xref xref-tree" href="#/trouble/' + esc(id) + '">' + esc(text || tr.title) + '</a>';
    }
    return bad(kind + ':' + id);
  }

  // references become finished HTML in "slots" first, so the text around them
  // is escaped exactly once
  M.inline = (src) => {
    const slots = [];
    const slot = (html) => { slots.push(html); return '\u0000' + (slots.length - 1) + '\u0000'; };
    let s = String(src == null ? '' : src).replace(/\u0000/g, '');
    s = s.replace(/\{\{(fact|fine|points):([^}|]+)(?:\|([^}]*))?\}\}/g, (m, k, id, arg) => slot(factHTML(k, id.trim(), arg && arg.trim())));
    s = s.replace(/\[\[(\w+):([^\]|]+)(?:\|([^\]]*))?\]\]/g, (m, k, id, arg) => {
      id = id.trim(); arg = arg != null ? arg.trim() : '';
      switch (k) {
        case 'term': return slot(termHTML(id, arg));
        case 'sign': return slot(signHTML(id, arg));
        case 'signs': return slot('<span class="sign-inline-row">' + id.split(',').map((n) => signHTML(n.trim(), 'icon')).join('') + '</span>');
        case 'dash': return slot(dashHTML(id, arg));
        case 'lesson': case 'chapter': case 'tree': return slot(linkHTML(k, id, arg));
        default: return slot(bad(k + ':' + id));
      }
    });
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/==([^=]+)==/g, '<mark>$1</mark>');
    return s.replace(/\u0000(\d+)\u0000/g, (m, i) => slots[+i]);
  };

  // legal values as plain text (for SVG labels, which cannot hold HTML)
  M.valuesText = (src) => String(src == null ? '' : src).replace(/\{\{(fact|fine|points):([^}|]+)(?:\|([^}]*))?\}\}/g, (m, k, id, arg) => {
    id = id.trim();
    if (k === 'fact') { const f = D.fact(id); return f ? D.content.fmtValue(D.content.factValue(f), f.unit, L(), { numberOnly: arg === 'n' }) : m; }
    const o = D.offence(id); if (!o) return m;
    return k === 'fine' ? (o.fine == null ? '—' : D.content.fmtValue(o.fine, 'ils', L())) : (o.points == null ? '—' : D.fmtNum(o.points));
  });

  // ---------- blocks ----------
  function figureHTML(id) {
    const f = D.data.figures[id];
    if (!f) return bad('fig:' + id);
    const cap = f.caption ? '<figcaption>' + M.inline(D.tr(f.caption)) + '</figcaption>' : '';
    if (f.kind === 'widget') return widgetHTML(f.widget, f.params || {}, cap, id);
    let svg = String(f.svg || '');
    svg = svg.replace(/\{\{label:([\w.-]+)\}\}/g, (m, k) => esc(M.valuesText(D.tr((f.labels || {})[k]) || k)));
    return '<figure class="fig" data-fig="' + esc(id) + '"><div class="fig-art">' + svg + '</div>' + cap + '</figure>';
  }
  function widgetHTML(name, params, cap, figId) {
    if (!D.widgets || !D.widgets.has(name)) return bad('widget:' + name);
    return '<figure class="fig fig-widget"' + (figId ? ' data-fig="' + esc(figId) + '"' : '') + '><div class="widget" data-widget="' + esc(name) + '" data-params="' + esc(JSON.stringify(params || {})) + '"></div>' + (cap || '') + '</figure>';
  }
  function parseParams(str) {
    const p = {};
    (str || '').trim().split(/\s+/).filter(Boolean).forEach((kv) => {
      const i = kv.indexOf('='); if (i < 0) { p[kv] = true; return; }
      const k = kv.slice(0, i), v = kv.slice(i + 1);
      p[k] = v !== '' && !isNaN(+v) ? +v : v;
    });
    return p;
  }

  // "| a | [[term:x|text]] | b |" → cells; a | inside [[ ]] or {{ }} is not a cell border
  function splitRow(line) {
    const s = line.trim().replace(/^\|/, '').replace(/\|$/, '');
    const cells = []; let cur = '', depth = 0;
    for (let i = 0; i < s.length; i++) {
      const two = s.slice(i, i + 2);
      if (two === '[[' || two === '{{') { depth++; cur += two; i++; continue; }
      if ((two === ']]' || two === '}}') && depth) { depth--; cur += two; i++; continue; }
      if (s[i] === '|' && !depth) { cells.push(cur.trim()); cur = ''; continue; }
      cur += s[i];
    }
    cells.push(cur.trim());
    return cells;
  }

  M.render = (src) => {
    const lines = String(src || '').replace(/\r\n?/g, '\n').split('\n');
    const out = [];
    let para = [];
    let list = null;          // { type: 'ul'|'ol', items: [] }
    let table = null;         // rows

    const flushPara = () => { if (para.length) { out.push('<p>' + M.inline(para.join(' ')) + '</p>'); para = []; } };
    const flushList = () => {
      if (list) { out.push('<' + list.type + '>' + list.items.map((it) => '<li>' + M.inline(it) + '</li>').join('') + '</' + list.type + '>'); list = null; }
    };
    const flushTable = () => {
      if (!table) return;
      const rows = table.rows; let head = null;
      if (table.sepAt === 1) head = rows.shift();
      const cell = (tag) => (c) => '<' + tag + '>' + M.inline(c) + '</' + tag + '>';
      out.push('<div class="table-wrap"><table>' + (head ? '<thead><tr>' + head.map(cell('th')).join('') + '</tr></thead>' : '') +
        '<tbody>' + rows.map((r) => '<tr>' + r.map(cell('td')).join('') + '</tr>').join('') + '</tbody></table></div>');
      table = null;
    };
    const flushAll = () => { flushPara(); flushList(); flushTable(); };

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const line = raw.trim();

      // callout container: collect until a line that is just ":::"
      const cm = line.match(/^:::(\w+)\s*(.*)$/);
      if (cm && CALLOUT[cm[1]]) {
        flushAll();
        const inner = [];
        let j = i + 1;
        for (; j < lines.length && lines[j].trim() !== ':::'; j++) inner.push(lines[j]);
        i = j;
        const kind = cm[1], c = CALLOUT[kind];
        const title = cm[2] || D.tr(c);
        out.push('<aside class="callout callout-' + kind + '"><div class="callout-head"><span class="callout-icon" aria-hidden="true">' + esc(c.icon) + '</span>' + M.inline(title) + '</div><div class="callout-body">' + M.render(inner.join('\n')) + '</div></aside>');
        continue;
      }

      if (!line) { flushAll(); continue; }

      // alone-on-a-line blocks
      let m;
      if ((m = line.match(/^\[\[fig:([\w.-]+)\]\]$/))) { flushAll(); out.push(figureHTML(m[1])); continue; }
      if ((m = line.match(/^\[\[widget:([\w-]+)((?:\s+[^\]]*)?)\]\]$/))) { flushAll(); out.push(widgetHTML(m[1], parseParams(m[2]))); continue; }
      if ((m = line.match(/^\[\[signs:([^\]]+)\]\]$/))) {
        flushAll();
        out.push('<div class="sign-row">' + m[1].split(',').map((n) => n.trim()).filter(Boolean).map((n) => {
          const s = D.data.signByNum.get(n);
          if (!s) return bad('sign:' + n);
          return '<a class="sign-card mini" href="#/sign/' + esc(n) + '">' + D.signs.svg(s, { size: 72 }) + '<span class="sign-num">' + esc(n) + '</span><span class="sign-name">' + esc(D.tr(s.name)) + '</span></a>';
        }).join('') + '</div>');
        continue;
      }
      if (line === '---') { flushAll(); out.push('<hr>'); continue; }
      if ((m = line.match(/^(#{1,3})\s+(.*)$/))) {
        flushAll();
        const lvl = Math.min(5, m[1].length + 2);
        out.push('<h' + lvl + '>' + M.inline(m[2]) + '</h' + lvl + '>');
        continue;
      }
      if (line.startsWith('|')) {
        flushPara(); flushList();
        const cells = splitRow(line);
        if (!table) table = { rows: [], sepAt: -1 };
        if (cells.every((c) => /^:?-{2,}:?$/.test(c))) { table.sepAt = table.rows.length; continue; }
        table.rows.push(cells);
        continue;
      }
      if ((m = line.match(/^([-*•])\s+(.*)$/)) || (m = line.match(/^(\d+)[.)]\s+(.*)$/))) {
        flushPara(); flushTable();
        const type = /\d/.test(m[1]) ? 'ol' : 'ul';
        if (!list || list.type !== type) { flushList(); list = { type, items: [] }; }
        list.items.push(m[2]);
        continue;
      }
      // a continuation line of a list item
      if (list && /^\s{2,}\S/.test(raw)) { list.items[list.items.length - 1] += ' ' + line; continue; }
      flushList(); flushTable();
      para.push(line);
    }
    flushAll();
    return out.join('\n');
  };

  // plain text of a markup string (for search, previews, speech)
  M.plain = (src) => {
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (!div) return String(src || '');
    div.innerHTML = M.inline(String(src || '').replace(/^[#:|>-]+/gm, ' '));
    return div.textContent.replace(/\s+/g, ' ').trim();
  };

  // after the HTML is in the page: mount widgets
  M.hydrate = (root) => {
    root.querySelectorAll('.widget[data-widget]').forEach((el) => {
      if (el._mounted) return;
      el._mounted = true;
      let params = {};
      try { params = JSON.parse(el.getAttribute('data-params') || '{}'); } catch (e) { /* keep defaults */ }
      try { D.widgets.mount(el.getAttribute('data-widget'), el, params); }
      catch (e) { console.error(e); el.textContent = D.t('common.error') + ': ' + e.message; }
    });
  };
})(globalThis.Drive = globalThis.Drive || {});
