/* Hyper Driving · content.js — loads a jurisdiction's content pack and turns it
 * into the indexes the screens read.
 *
 * A pack is a folder (or a downloaded copy of one) described by manifest.json:
 *   { format, jurisdiction, version, published, defaultLanguage, languages,
 *     files: [ { path, role, lang?, sha256, bytes } ], signature? }
 * Every file is JSON. Roles:
 *   facts       facts.json — legal numbers, fines and points, with sources and dated changes
 *   licences    licence classes and groups
 *   exam        the mock-exam blueprint
 *   course      chapter order, sections, icons
 *   signs       sign table: series + every sign's drawing and texts
 *   sign-art    the signs' pictures (the official sign chart, traced), by sign number
 *   glossary    bilingual terms
 *   dash        dashboard warning lights
 *   figures     diagrams (raw SVG or built-in widgets) with labels
 *   maintenance maintenance schedule
 *   notices     announcements from the authority
 *   changelog   what each version changed
 *   lessons     <lang>/lessons/<chapter>.json — one chapter's lessons in one language
 *   questions   <lang>/questions/<chapter>.json
 *   trees       <lang>/trees/<name>.json — troubleshooting decision trees
 *   ui          interface-string overrides
 * Short texts inside shared files are {he, en, …} objects; long texts (lessons,
 * questions, trees) have one file per language with the same ids.
 *
 * Where the pack comes from: the one built into the app, unless IndexedDB holds
 * a newer downloaded update (update.js), and — in editor mode — the editor's
 * unsaved draft on top.
 */
(function (D) {
  'use strict';

  const C = D.content = {};

  // ---------- units ----------
  // he: [singular, plural] or a single form; placed after the number in both
  // languages except where noted (₪ comes first in English).
  const UNITS = {
    kmh: { he: 'קמ״ש', en: 'km/h' },
    m: { he: 'מטר', en: 'm' },
    km: { he: 'ק״מ', en: 'km' },
    cm: { he: 'ס״מ', en: 'cm' },
    mm: { he: 'מ״מ', en: 'mm' },
    s: { he: ['שנייה', 'שניות'], en: ['second', 'seconds'] },
    min: { he: ['דקה', 'דקות'], en: ['minute', 'minutes'] },
    h: { he: ['שעה', 'שעות'], en: ['hour', 'hours'] },
    days: { he: ['יום', 'ימים'], en: ['day', 'days'] },
    months: { he: ['חודש', 'חודשים'], en: ['month', 'months'] },
    years: { he: ['שנה', 'שנים'], en: ['year', 'years'] },
    kg: { he: 'ק״ג', en: 'kg' },
    t: { he: 'טון', en: 't' },
    kw: { he: 'קו״ט', en: 'kW' },
    hp: { he: 'כ״ס', en: 'hp' },
    cc: { he: 'סמ״ק', en: 'cc' },
    bar: { he: 'בר', en: 'bar' },
    psi: { he: 'PSI', en: 'psi' },
    points: { he: ['נקודה', 'נקודות'], en: ['point', 'points'] },
    ils: { he: '₪', en: '₪', enBefore: true },
    count: { he: '', en: '' },
    percent: { he: '%', en: '%', tight: true },
    ug_per_l_breath: { he: 'מיקרוגרם לליטר אוויר נשוף', en: 'µg per litre of exhaled air' },
    mg_per_100ml_blood: { he: 'מ״ג ל-100 מ״ל דם', en: 'mg per 100 ml of blood' },
    seats: { he: ['מושב', 'מושבים'], en: ['seat', 'seats'] },
    passengers: { he: ['נוסע', 'נוסעים'], en: ['passenger', 'passengers'] },
    db: { he: ['דציבל', 'דציבלים'], en: 'dB' },
    mps2: { he: 'מטר לשנייה בריבוע', en: 'm/s²' },
    lessons: { he: ['שיעור', 'שיעורים'], en: ['lesson', 'lessons'] },
    questions: { he: ['שאלה', 'שאלות'], en: ['question', 'questions'] },
    ym: { he: '', en: '' },
    range: { he: '', en: '' },
    ratio: { he: '', en: '' },
    text: { he: '', en: '' }
  };
  C.UNITS = UNITS;

  function unitWord(unit, n, lang) {
    const u = UNITS[unit]; if (!u) return unit || '';
    const f = u[lang] != null ? u[lang] : u.en;
    if (Array.isArray(f)) return Math.abs(n) === 1 ? f[0] : f[1];
    return f;
  }

  // "50 קמ״ש", "₪1,000", "0.24 µg…", "2–3 seconds"
  C.fmtValue = (value, unit, lang, opts) => {
    lang = lang || D.lang();
    opts = opts || {};
    if (value == null) return '—';
    if (typeof value === 'object' && !Array.isArray(value)) value = D.tr(value, lang);
    if (typeof value === 'string') return value;
    if (unit === 'ym' && Array.isArray(value)) {
      // [years, months] → "16 שנים ו-9 חודשים"
      const y = C.fmtValue(value[0], 'years', lang), mo = value[1] ? C.fmtValue(value[1], 'months', lang) : '';
      return mo ? (lang === 'he' ? y + ' ו-' + mo : y + ' and ' + mo) : y;
    }
    if (unit === 'range' && Array.isArray(value)) return value.join('–');
    const num = (x) => (typeof x === 'number' ? D.fmtNum(x) : String(x));
    const n = Array.isArray(value) ? value[value.length - 1] : value;
    const body = Array.isArray(value) ? value.map(num).join('–') : num(value);
    if (opts.numberOnly || !unit || unit === 'count' || unit === 'text') return body;
    const w = unitWord(unit, n, lang);
    if (!w) return body;
    const u = UNITS[unit] || {};
    if (u.tight) return body + w;
    if (lang === 'en' && u.enBefore) return w + body;
    return body + ' ' + w;
  };

  // ---------- facts with dated changes ----------
  // fact.changes = [{ from: 'YYYY-MM-DD', value, note }] — the value in force on
  // a date is the last change whose date has come, else the base value.
  C.factValue = (f, date) => {
    if (!f) return undefined;
    date = date || D.util.today();
    let v = f.value;
    (f.changes || []).slice().sort((a, b) => (a.from < b.from ? -1 : 1)).forEach((c) => { if (c.from <= date) v = c.value; });
    return v;
  };
  C.nextChange = (f, date) => {
    date = date || D.util.today();
    return (f && f.changes || []).filter((c) => c.from > date).sort((a, b) => (a.from < b.from ? -1 : 1))[0] || null;
  };
  D.fact = (id) => D.data && D.data.facts.get(id);
  D.offence = (id) => D.data && D.data.offences.get(id);
  D.fmtFact = (id, opts) => {
    const f = D.fact(id); if (!f) return null;
    return C.fmtValue(C.factValue(f), f.unit, null, opts);
  };

  // ---------- licences ----------
  C.expandLicences = (list) => {
    const L = D.data.licences; const out = new Set();
    (list || []).forEach((x) => {
      if (L.groups[x]) L.groups[x].forEach((c) => out.add(c)); else out.add(x);
    });
    return out;
  };
  // does an item tagged with licence classes/groups concern the reader's class?
  C.forLicence = (item, lic) => {
    lic = lic || D.settings.licence;
    if (!item || !item.licence || !item.licence.length) return true;
    return C.expandLicences(item.licence).has(lic);
  };

  // ---------- loading ----------
  const getJSON = async (url) => {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok) throw new Error(url + ': HTTP ' + r.status);
    return r.json();
  };

  C.compareVersions = (a, b) => {
    // versions like "2026.09.28-1" or "1.4.2": compare number runs in order
    const pa = String(a || '').match(/\d+/g) || [], pb = String(b || '').match(/\d+/g) || [];
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      const x = +(pa[i] || 0), y = +(pb[i] || 0);
      if (x !== y) return x < y ? -1 : 1;
    }
    return 0;
  };

  // read the bundled pack (files fetched from the app folder)
  C.readBundled = async (jur) => {
    const base = D.config.jurisdictions[jur].bundled;
    const manifest = await getJSON(base + 'manifest.json');
    const files = {};
    await Promise.all(manifest.files.map(async (f) => { files[f.path] = await getJSON(base + f.path); }));
    return { manifest, files, origin: 'bundled' };
  };

  // pack = { manifest, files: {path: object}, origin }
  C.load = async (jur) => {
    jur = jur || D.settings.jurisdiction || D.config.defaultJurisdiction;
    let pack = await C.readBundled(jur);
    // a downloaded update wins when it is newer than the bundled pack
    const stored = await D.idb.get('pack:' + jur);
    if (stored && stored.manifest && C.compareVersions(stored.manifest.version, pack.manifest.version) > 0) {
      pack = { manifest: stored.manifest, files: stored.files, origin: 'downloaded', installed: stored.installed };
    }
    pack.bundledVersion = pack.origin === 'bundled' ? pack.manifest.version : (await C.readBundledManifest(jur)).version;
    // the editor's draft, file by file, on top
    if (D.settings.editor) {
      const draft = await D.idb.get('draft:' + jur);
      if (draft && draft.files && Object.keys(draft.files).length) {
        pack = { manifest: Object.assign({}, pack.manifest), files: Object.assign({}, pack.files, draft.files), origin: pack.origin, draft: Object.keys(draft.files), base: pack };
        // a draft may add files the base manifest does not list
        const listed = new Set(pack.manifest.files.map((f) => f.path));
        pack.manifest.files = pack.manifest.files.slice();
        Object.keys(draft.files).forEach((p) => { if (!listed.has(p)) pack.manifest.files.push(C.describePath(p)); });
      }
    }
    C.assemble(jur, pack);
    return D.data;
  };
  C.readBundledManifest = async (jur) => getJSON(D.config.jurisdictions[jur].bundled + 'manifest.json');

  // the role and language a file has from where it lives in the pack
  C.describePath = (p) => {
    const m = p.match(/^([a-z]{2})\/(lessons|questions|trees)\/[^/]+\.json$/);
    if (m) return { path: p, role: m[2], lang: m[1] };
    const u = p.match(/^([a-z]{2})\/ui\.json$/);
    if (u) return { path: p, role: 'ui', lang: u[1] };
    return { path: p, role: p.replace(/\.json$/, '').replace(/^.*\//, '') };
  };

  // ---------- assembling the indexes ----------
  C.assemble = (jur, pack) => {
    const byRole = {};
    // lessons, questions and trees get working fields (_chapter, _index…) while
    // indexing, so they are indexed from copies: pack.files stays exactly as
    // published, which is what hashes, the editor and exports read
    const MUTATED = new Set(['lessons', 'questions', 'trees']);
    pack.manifest.files.forEach((f) => {
      let obj = pack.files[f.path]; if (obj == null) return;
      if (MUTATED.has(f.role)) obj = structuredClone(obj);
      (byRole[f.role] = byRole[f.role] || []).push({ meta: f, obj });
    });
    const one = (role, dflt) => (byRole[role] && byRole[role][0] ? byRole[role][0].obj : dflt);

    const data = {
      jur, pack, manifest: pack.manifest,
      facts: new Map(), offences: new Map(), pointsSystem: [],
      licences: { classes: [], groups: {} },
      exam: {}, course: { sections: [], chapters: [] },
      series: [], signs: [], signByNum: new Map(), signArt: {},
      glossary: [], termById: new Map(),
      dash: [], dashById: new Map(),
      figures: {}, maintenance: { items: [] }, notices: [], changelog: [],
      text: {}   // text[lang] = { chapters: Map, lessonById: Map, questions: [], qById: Map, trees: [], treeById: Map }
    };

    const F = one('facts', {});
    (F.facts || []).forEach((f) => data.facts.set(f.id, f));
    (F.offences || []).forEach((o) => data.offences.set(o.id, o));
    data.pointsSystem = F.pointsSystem || [];
    data.licences = Object.assign({ classes: [], groups: {} }, one('licences', {}));
    data.exam = one('exam', {});
    data.course = Object.assign({ sections: [], chapters: [] }, one('course', {}));
    const S = one('signs', {});
    data.series = S.series || [];
    data.signs = S.signs || [];
    data.signs.forEach((s) => data.signByNum.set(String(s.num), s));
    data.signArt = (one('sign-art', {}).art) || {};
    data.glossary = (one('glossary', {}).terms) || [];
    data.glossaryCats = (one('glossary', {}).cats) || {};
    data.glossary.forEach((t) => data.termById.set(t.id, t));
    data.dash = (one('dash', {}).lights) || [];
    data.dash.forEach((d) => data.dashById.set(d.id, d));
    data.figures = (one('figures', {}).figures) || {};
    data.maintenance = one('maintenance', { items: [] });
    data.notices = (one('notices', {}).notices) || [];
    data.changelog = (one('changelog', {}).versions) || [];

    const T = (l) => (data.text[l] = data.text[l] || { chapters: new Map(), lessonById: new Map(), questions: [], qById: new Map(), trees: [], treeById: new Map() });
    (byRole.lessons || []).forEach(({ meta, obj }) => {
      const t = T(meta.lang);
      t.chapters.set(obj.chapter, obj);
      (obj.lessons || []).forEach((ls, i) => { ls._chapter = obj.chapter; ls._index = i; t.lessonById.set(ls.id, ls); });
    });
    (byRole.questions || []).forEach(({ meta, obj }) => {
      const t = T(meta.lang);
      (obj.questions || []).forEach((q) => { q._chapter = q.chapter || obj.chapter; t.questions.push(q); t.qById.set(q.id, q); });
    });
    (byRole.trees || []).forEach(({ meta, obj }) => {
      const t = T(meta.lang);
      (obj.trees || [obj]).forEach((tr) => { if (tr && tr.id) { t.trees.push(tr); t.treeById.set(tr.id, tr); } });
    });
    const ui = {};
    (byRole.ui || []).forEach(({ meta, obj }) => { ui[meta.lang] = obj; });
    D.setUiOverrides(ui);

    D.data = data;
    C._search = null;
    D.emit('content', data);
    return data;
  };

  // ---------- language-aware lookups ----------
  // text for the reader's language, else the pack's default language
  const TL = (l) => (D.data.text[l] || null);
  C.langs = () => [D.lang(), D.data.manifest.defaultLanguage || 'he'];

  C.chapter = (id) => {
    for (const l of C.langs()) { const t = TL(l); if (t && t.chapters.has(id)) return Object.assign({ _lang: l }, t.chapters.get(id)); }
    return null;
  };
  C.chapterMeta = (id) => D.data.course.chapters.find((c) => c.id === id) || null;
  C.lesson = (id) => {
    for (const l of C.langs()) { const t = TL(l); if (t && t.lessonById.has(id)) { const ls = t.lessonById.get(id); ls._lang = l; return ls; } }
    return null;
  };
  // the questions in the reader's language; a question missing there is taken
  // from the default language so the pool never shrinks during a translation
  C.questions = () => {
    const [l, dl] = C.langs();
    const a = TL(l) ? TL(l).questions : [];
    if (l === dl) return a;
    const have = new Set(a.map((q) => q.id));
    return a.concat((TL(dl) ? TL(dl).questions : []).filter((q) => !have.has(q.id)));
  };
  C.question = (id) => {
    for (const l of C.langs()) { const t = TL(l); if (t && t.qById.has(id)) return t.qById.get(id); }
    return null;
  };
  C.trees = () => {
    const [l, dl] = C.langs();
    const a = TL(l) ? TL(l).trees : [];
    if (l === dl) return a;
    const have = new Set(a.map((t) => t.id));
    return a.concat((TL(dl) ? TL(dl).trees : []).filter((t) => !have.has(t.id)));
  };
  C.tree = (id) => {
    for (const l of C.langs()) { const t = TL(l); if (t && t.treeById.has(id)) return t.treeById.get(id); }
    return null;
  };
  C.chaptersOf = (section) => D.data.course.chapters.filter((c) => !section || c.section === section);
  C.lessonsOf = (chapterId) => { const ch = C.chapter(chapterId); return ch ? ch.lessons || [] : []; };

  // a glossary term's name in a language; terms with no Hebrew word carry the
  // English one ("usage": {"he": "none"}) until the authority supplies one
  C.termName = (t, lang, withNiqqud) => {
    if (!t) return '';
    lang = lang || D.lang();
    if (withNiqqud && t.niqqud && t.niqqud[lang]) return t.niqqud[lang];
    return D.tr(t.term, lang);
  };
  C.termMissing = (t, lang) => !!(t && t.usage && t.usage[lang || D.lang()] === 'none');

  // ---------- where things are used (for "appears in", and for the editor) ----------
  C.usage = () => {
    if (C._usage) return C._usage;
    const U = { fact: new Map(), fine: new Map(), sign: new Map(), term: new Map(), lesson: new Map(), dash: new Map(), tree: new Map(), fig: new Map() };
    const add = (kind, id, where) => { const m = U[kind]; if (!m) return; if (!m.has(id)) m.set(id, []); m.get(id).push(where); };
    const scan = (text, where) => {
      if (!text) return;
      String(text).replace(/\[\[(\w+):([^\]|]+)(?:\|[^\]]*)?\]\]/g, (m, k, id) => { add(k, id.trim(), where); return m; });
      String(text).replace(/\{\{(fact|fine|points):([^}|]+)(?:\|[^}]*)?\}\}/g, (m, k, id) => { add(k === 'fact' ? 'fact' : 'fine', id.trim(), where); return m; });
    };
    Object.keys(D.data.text).forEach((l) => {
      const t = D.data.text[l];
      t.lessonById.forEach((ls) => {
        const w = { type: 'lesson', id: ls.id, lang: l };
        scan(ls.body, w); (ls.keyPoints || []).forEach((k) => scan(k, w));
        (ls.signs || []).forEach((s) => add('sign', String(s), w));
        (ls.terms || []).forEach((s) => add('term', s, w));
      });
      t.questions.forEach((q) => {
        const w = { type: 'question', id: q.id, lang: l };
        scan(q.q, w); (q.options || []).forEach((o) => scan(o, w)); scan(q.explain, w);
        if (q.sign) add('sign', String(q.sign), w);
        (q.facts || []).forEach((f) => add('fact', f, w));
      });
      t.trees.forEach((tr) => {
        const w = { type: 'tree', id: tr.id, lang: l };
        Object.values(tr.nodes || {}).forEach((n) => { scan(n.q, w); scan(n.text, w); (n.actions || []).forEach((a) => scan(a, w)); });
      });
    });
    D.data.signs.forEach((s) => ['meaning', 'notes'].forEach((k) => s[k] && Object.values(s[k]).forEach((x) => scan(x, { type: 'sign', id: String(s.num) }))));
    D.data.dash.forEach((d) => ['meaning', 'action'].forEach((k) => d[k] && Object.values(d[k]).forEach((x) => scan(x, { type: 'dash', id: d.id }))));
    C._usage = U;
    return U;
  };
  D.on('content', () => { C._usage = null; });

  // ---------- search ----------
  const norm = (s) => String(s || '').toLowerCase()
    .replace(/[֑-ׇ]/g, '')            // niqqud and cantillation
    .replace(/[״"׳']/g, '')
    .replace(/\s+/g, ' ').trim();
  C.norm = norm;
  const plain = (md) => String(md || '').replace(/\[\[\w+:([^\]|]+)\|([^\]]+)\]\]/g, '$2').replace(/\[\[[^\]]+\]\]/g, ' ').replace(/\{\{[^}]+\}\}/g, ' ').replace(/[*#>|:=-]+/g, ' ');

  C.search = (q) => {
    const nq = norm(q); if (nq.length < 1) return [];
    if (!C._search) {
      const items = [];
      C.chaptersOf().forEach((cm) => C.lessonsOf(cm.id).forEach((ls) => items.push({ kind: 'lesson', id: ls.id, title: ls.title, sub: (C.chapter(cm.id) || {}).title, key: norm(ls.title), body: norm(ls.summary + ' ' + plain(ls.body)) })));
      D.data.signs.forEach((s) => items.push({ kind: 'sign', id: String(s.num), title: D.tr(s.name), sub: String(s.num), key: norm(s.num + ' ' + D.tr(s.name) + ' ' + Object.values(s.name || {}).join(' ')), body: norm(D.tr(s.meaning)) }));
      D.data.glossary.forEach((t) => items.push({ kind: 'term', id: t.id, title: C.termName(t), sub: t.term && t.term.en, key: norm(Object.values(t.term || {}).join(' ') + ' ' + Object.values(t.alt || {}).flat().join(' ')), body: norm(D.tr(t.def)) }));
      C.trees().forEach((tr) => items.push({ kind: 'tree', id: tr.id, title: tr.title, sub: tr.summary, key: norm(tr.title), body: norm(tr.summary) }));
      D.data.dash.forEach((d) => items.push({ kind: 'dash', id: d.id, title: D.tr(d.name), key: norm(Object.values(d.name || {}).join(' ')), body: norm(D.tr(d.meaning)) }));
      C._search = items;
    }
    const words = nq.split(' ');
    const scored = [];
    C._search.forEach((it) => {
      let sc = 0;
      for (const w of words) {
        if (it.key.includes(w)) sc += it.key.startsWith(w) ? 6 : 4;
        else if (it.body.includes(w)) sc += 1;
        else { sc = 0; break; }
      }
      if (sc) scored.push([sc, it]);
    });
    return scored.sort((a, b) => b[0] - a[0]).map((x) => x[1]).slice(0, 60);
  };
  D.on('settings', (e) => { if (e.key === 'lang') C._search = null; });
})(globalThis.Drive = globalThis.Drive || {});
