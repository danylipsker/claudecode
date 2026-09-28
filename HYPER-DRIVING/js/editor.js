/* Hyper Driving · editor.js — the content editor for the transport authority's
 * staff (Settings → content-editor mode). Nothing here changes the app: edits
 * go to a draft (IndexedDB) laid over the pack, the reader's view shows the
 * draft at once, and "Export update" writes one update file:
 *   { "bundle": 1, "manifest": {…}, "files": { path: json } }
 * which is tested with Updates → "Load an update file", then signed and
 * published with tools/publish.js.
 *
 * Screens: #/editor (overview + export), #/editor/facts, #/editor/offences,
 * #/editor/notices, #/editor/lessons, #/editor/lesson/<id>, #/editor/questions/<chapter>,
 * #/editor/signs, #/editor/sign/<num>, #/editor/check
 */
(function (D) {
  'use strict';
  const { h, esc } = D.util;
  const C = D.content, M = D.markup, V = D.views;
  const E = D.editor = {};
  const L = (he, en) => (D.lang() === 'he' ? he : en);
  const main = () => document.getElementById('main');
  const clone = (x) => JSON.parse(JSON.stringify(x));

  // ---------- the draft ----------
  const DKEY = () => 'draft:' + D.data.jur;
  E.draft = async () => (await D.idb.get(DKEY())) || { files: {} };
  // take a working copy of a pack file (the draft's copy if there is one)
  E.file = async (path) => {
    const d = await E.draft();
    if (d.files[path]) return clone(d.files[path]);
    const base = D.data.pack.base ? D.data.pack.base.files[path] : D.data.pack.files[path];
    return base ? clone(base) : null;
  };
  E.saveFile = async (path, obj) => {
    const d = await E.draft();
    d.files[path] = obj;
    d.changed = new Date().toISOString();
    await D.idb.set(DKEY(), d);
    await C.load(D.data.jur);
    V.toast(L('נשמר בטיוטה', 'Saved to the draft'));
  };
  E.discard = async () => { await D.idb.del(DKEY()); await C.load(D.data.jur); };

  const nav = (cur) => `<nav class="ed-nav">${[
    ['', L('סקירה', 'Overview')], ['facts', L('ערכים בחוק', 'Legal values')], ['offences', L('קנסות ונקודות', 'Fines & points')],
    ['notices', L('הודעות', 'Notices')], ['lessons', L('שיעורים ושאלות', 'Lessons & questions')], ['signs', L('תמרורים', 'Signs')], ['check', L('בדיקה', 'Check')]
  ].map(([k, t]) => `<a href="#/editor${k ? '/' + k : ''}" class="${k === cur ? 'on' : ''}">${esc(t)}</a>`).join('')}</nav>`;
  const guard = () => {
    if (D.settings.editor) return true;
    main().innerHTML = `<p class="empty">${esc(L('מצב עורך כבוי. אפשר להפעיל אותו בהגדרות.', 'Editor mode is off. Turn it on in Settings.'))}</p>`;
    return false;
  };
  const langs = () => D.data.manifest.languages || ['he', 'en'];

  // ---------- overview & export ----------
  E.home = async () => {
    V.setTitle(L('עורך תוכן', 'Content editor'), { nav: 'editor' });
    if (!guard()) return;
    const d = await E.draft();
    const paths = Object.keys(d.files);
    const mf = D.data.manifest;
    main().innerHTML = `${nav('')}
      <header class="page-head"><h1>${esc(L('עורך תוכן', 'Content editor'))}</h1>
      <p class="lead">${esc(L('שינויים נשמרים בטיוטה ומוצגים מיד באפליקציה במכשיר זה. כשמסיימים — מייצאים קובץ עדכון, בודקים אותו, חותמים ומפרסמים.', 'Changes are kept in a draft and shown in the app on this device at once. When done, export an update file, test it, sign it and publish it.'))}</p></header>
      <section class="card">
        <dl class="kv"><dt>${esc(D.t('upd.version'))}</dt><dd>${esc(mf.version)}</dd>
        <dt>${esc(L('קבצים בטיוטה', 'Files in the draft'))}</dt><dd>${paths.length ? paths.map((p) => `<code>${esc(p)}</code>`).join(' ') : '—'}</dd>
        ${d.changed ? `<dt>${esc(L('שינוי אחרון', 'Last change'))}</dt><dd>${esc(D.fmtDate(d.changed, { dateStyle: 'medium', timeStyle: 'short' }))}</dd>` : ''}</dl>
        <label class="ed-field"><span>${esc(L('הערות לגרסה (מה השתנה) — עברית', 'Release notes (what changed) — Hebrew'))}</span><textarea data-notes="he" rows="3"></textarea></label>
        <label class="ed-field"><span>${esc(L('הערות לגרסה — אנגלית', 'Release notes — English'))}</span><textarea data-notes="en" rows="3" dir="ltr"></textarea></label>
        <div class="actions">
          <button class="btn primary" data-export ${paths.length ? '' : 'disabled'}>${D.icon('download', 18)} ${esc(L('ייצוא קובץ עדכון', 'Export update file'))}</button>
          <button class="btn bad" data-discard ${paths.length ? '' : 'disabled'}>${D.icon('trash', 18)} ${esc(L('מחיקת הטיוטה', 'Discard the draft'))}</button>
        </div>
      </section>
      <section class="prose ed-help">${M.render(L(
        '# איך מפרסמים שינוי בחוק\n1. משנים את הערך במסך **ערכים בחוק** או **קנסות ונקודות** — אפשר גם לתזמן שינוי לתאריך כניסה לתוקף.\n2. מעדכנים שיעורים ושאלות אם הניסוח עצמו השתנה (ערכים מספריים מתעדכנים בכל הטקסטים לבד).\n3. מוסיפים **הודעה** לתלמידים.\n4. **בדיקה** — מוודאת שאין הפניות שבורות.\n5. **ייצוא קובץ עדכון**, ואז בעדכונים ← „טעינת קובץ עדכון” כדי לראות אותו כתלמיד.\n6. חותמים ומפרסמים: `node tools/publish.js <הקובץ> --key <מפתח פרטי> --out <תיקייה בשרת>`.',
        '# How to publish a change in the law\n1. Change the value under **Legal values** or **Fines & points** — a change can also be scheduled for the date it takes effect.\n2. Update lessons and questions if their wording changed (numbers update in every text by themselves).\n3. Add a **notice** for learners.\n4. **Check** — makes sure no reference is broken.\n5. **Export update file**, then Updates → "Load an update file" to see it as a learner.\n6. Sign and publish: `node tools/publish.js <file> --key <private key> --out <server folder>`.'))}</section>`;
    const m = main();
    m.querySelector('[data-discard]').addEventListener('click', async () => { if (confirm(L('למחוק את כל הטיוטה?', 'Discard the whole draft?'))) { await E.discard(); E.home(); } });
    m.querySelector('[data-export]').addEventListener('click', async () => {
      const notes = {}; m.querySelectorAll('[data-notes]').forEach((t) => { if (t.value.trim()) notes[t.getAttribute('data-notes')] = t.value.trim(); });
      const bundle = await E.buildBundle(notes);
      const blob = new Blob([JSON.stringify(bundle)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: `update-${bundle.manifest.jurisdiction}-${bundle.manifest.version}.json` });
      document.body.appendChild(a); a.click(); a.remove();
    });
  };

  // a whole new pack version: base pack + draft, a new version number, the
  // release notes added to changelog.json, fresh hashes, no signature yet
  E.buildBundle = async (notes) => {
    const d = await E.draft();
    const base = D.data.pack.base || D.data.pack;
    const files = Object.assign({}, base.files, d.files);
    const today = D.util.today();
    const prev = String(base.manifest.version || '');
    const seq = prev.startsWith(today.replace(/-/g, '.')) ? (+(prev.split('-')[1] || 0) + 1) : 1;
    const version = today.replace(/-/g, '.') + '-' + seq;
    if (notes && Object.keys(notes).length) {
      const cl = clone(files['changelog.json'] || { versions: [] });
      cl.versions = [{ version, date: today, notes }].concat(cl.versions || []);
      files['changelog.json'] = cl;
    }
    const listed = new Map(base.manifest.files.map((f) => [f.path, f]));
    Object.keys(files).forEach((p) => { if (!listed.has(p)) listed.set(p, C.describePath(p)); });
    const entries = [];
    for (const [p, f] of listed) {
      if (files[p] === undefined) continue;
      entries.push(Object.assign({}, f, { sha256: await D.update.sha256(files[p]), bytes: JSON.stringify(files[p]).length }));
    }
    const manifest = Object.assign({}, base.manifest, { version, published: today, files: entries });
    delete manifest.signature;
    return { bundle: 1, manifest, files };
  };

  // ---------- legal values ----------
  E.facts = async (params, query, which) => {
    which = which || 'facts';
    const isOff = which === 'offences';
    V.setTitle(isOff ? L('קנסות ונקודות', 'Fines & points') : L('ערכים בחוק', 'Legal values'), { nav: 'editor', back: '#/editor' });
    if (!guard()) return;
    const F = await E.file('facts.json');
    const list = isOff ? (F.offences || []) : (F.facts || []);
    const usage = C.usage();
    let q = '';
    main().innerHTML = `${nav(which)}<div class="toolbar"><input type="search" class="search-in" placeholder="${esc(L('חיפוש', 'Search'))}"></div>
      <div class="table-wrap"><table class="ed-table"><thead><tr><th>id</th><th>${esc(L('תיאור', 'Label'))}</th>
      ${isOff ? `<th>${esc(L('קנס ₪', 'Fine ₪'))}</th><th>${esc(L('נקודות', 'Points'))}</th>` : `<th>${esc(L('ערך', 'Value'))}</th><th>${esc(L('יחידה', 'Unit'))}</th>`}
      <th>${esc(L('שינויים מתוזמנים', 'Scheduled changes'))}</th><th>${esc(L('מקור', 'Source'))}</th><th>${esc(L('בשימוש', 'Used'))}</th></tr></thead><tbody></tbody></table></div>
      <div class="actions"><button class="btn primary" data-save>${esc(D.t('common.save'))}</button></div>`;
    const m = main(), tb = m.querySelector('tbody');
    const draw = () => {
      const nq = C.norm(q);
      tb.innerHTML = list.map((f, i) => ({ f, i })).filter(({ f }) => !nq || C.norm(f.id + ' ' + Object.values(f.label || f.title || {}).join(' ')).includes(nq)).map(({ f, i }) => {
        const used = (isOff ? usage.fine.get(f.id) : usage.fact.get(f.id)) || [];
        const conf = f.confidence ? `<span class="pill conf-${esc(f.confidence)}">${esc(f.confidence)}</span>` : '';
        return `<tr data-i="${i}"><td><code>${esc(f.id)}</code> ${conf}</td><td>${esc(D.tr(f.label || f.title))}</td>
          ${isOff
            ? `<td><input class="ed-num" data-f="fine" value="${f.fine == null ? '' : f.fine}" inputmode="numeric"></td><td><input class="ed-num" data-f="points" value="${f.points == null ? '' : f.points}" inputmode="numeric"></td>`
            : `<td><input class="ed-num" data-f="value" value="${esc(Array.isArray(f.value) ? f.value.join('–') : typeof f.value === 'object' ? JSON.stringify(f.value) : f.value)}"></td><td>${esc(f.unit || '')}</td>`}
          <td class="ed-changes">${(f.changes || []).map((c, k) => `<span class="pill">${esc(c.from)} → ${esc(isOff ? [c.fine, c.points].filter((x) => x != null).join(' / ') : String(c.value))} <button class="x" data-rm="${k}" aria-label="remove">×</button></span>`).join('')}
            <button class="btn small" data-sched>+ ${esc(L('תזמון', 'Schedule'))}</button></td>
          <td class="muted small">${esc(f.source ? D.tr(f.source.title) + (f.source.clause ? ', ' + f.source.clause : '') : '')}</td>
          <td>${used.length ? `<details><summary>${used.length}</summary>${used.slice(0, 30).map((w) => `<div><a href="#/${w.type === 'lesson' ? 'lesson/' + w.id : w.type === 'question' ? 'editor/questions/' + ((C.question(w.id) || {})._chapter || '') : w.type === 'sign' ? 'sign/' + w.id : 'vehicle/dash/' + w.id}">${esc(w.type)} ${esc(w.id)}</a></div>`).join('')}</details>` : '0'}</td></tr>`;
      }).join('');
      tb.querySelectorAll('tr').forEach((tr) => {
        const f = list[+tr.getAttribute('data-i')];
        tr.querySelectorAll('input[data-f]').forEach((inp) => inp.addEventListener('change', () => {
          const k = inp.getAttribute('data-f'), v = inp.value.trim();
          if (k === 'value') {
            if (/^-?\d+(\.\d+)?$/.test(v)) f.value = +v;
            else if (/^\d+(\.\d+)?\s*[–-]\s*\d+(\.\d+)?$/.test(v)) f.value = v.split(/[–-]/).map((x) => +x.trim());
            else { try { f.value = JSON.parse(v); } catch (e) { f.value = v; } }
          } else f[k] = v === '' ? null : +v;
          f.confidence = 'high'; f.verified = D.util.today();
        }));
        tr.querySelectorAll('[data-rm]').forEach((b) => b.addEventListener('click', () => { f.changes.splice(+b.getAttribute('data-rm'), 1); draw(); }));
        tr.querySelector('[data-sched]').addEventListener('click', () => {
          const from = prompt(L('תאריך כניסה לתוקף (YYYY-MM-DD)', 'Date it takes effect (YYYY-MM-DD)'), D.util.today());
          if (!from || !/^\d{4}-\d{2}-\d{2}$/.test(from)) return;
          const c = { from };
          if (isOff) {
            const fine = prompt(L('קנס חדש (₪), ריק = ללא שינוי', 'New fine (₪), empty = unchanged'), f.fine == null ? '' : f.fine);
            const pts = prompt(L('נקודות, ריק = ללא שינוי', 'Points, empty = unchanged'), f.points == null ? '' : f.points);
            if (fine) c.fine = +fine; if (pts) c.points = +pts;
          } else {
            const v = prompt(L('הערך החדש', 'The new value'), Array.isArray(f.value) ? f.value.join('-') : f.value);
            if (v == null) return;
            c.value = /^-?\d+(\.\d+)?$/.test(v.trim()) ? +v : v;
          }
          (f.changes = f.changes || []).push(c);
          draw();
        });
      });
    };
    m.querySelector('.search-in').addEventListener('input', (e) => { q = e.target.value; draw(); });
    m.querySelector('[data-save]').addEventListener('click', () => E.saveFile('facts.json', F));
    draw();
  };

  // ---------- notices ----------
  E.notices = async () => {
    V.setTitle(L('הודעות', 'Notices'), { nav: 'editor', back: '#/editor' });
    if (!guard()) return;
    const N = (await E.file('notices.json')) || { notices: [] };
    const m = main();
    const draw = () => {
      m.innerHTML = `${nav('notices')}<div class="actions"><button class="btn" data-add>+ ${esc(L('הודעה חדשה', 'New notice'))}</button><button class="btn primary" data-save>${esc(D.t('common.save'))}</button></div>
        ${N.notices.map((n, i) => `<section class="card ed-notice" data-i="${i}">
          <div class="ed-grid">
            <label class="ed-field"><span>${esc(L('תאריך', 'Date'))}</span><input type="date" data-k="date" value="${esc(n.date || '')}"></label>
            <label class="ed-field"><span>${esc(L('בתוקף מ', 'Effective'))}</span><input type="date" data-k="effective" value="${esc(n.effective || '')}"></label>
            <label class="ed-field"><span>${esc(L('להציג עד', 'Show until'))}</span><input type="date" data-k="until" value="${esc(n.until || '')}"></label>
            <label class="ed-field"><span>${esc(L('חשיבות', 'Severity'))}</span><select data-k="severity">${['info', 'important', 'urgent'].map((s) => `<option${s === n.severity ? ' selected' : ''}>${s}</option>`).join('')}</select></label>
          </div>
          ${langs().map((l) => `<label class="ed-field"><span>${esc(L('כותרת', 'Title'))} (${l})</span><input data-t="title" data-l="${l}" dir="${D.config.languages[l].dir}" value="${esc((n.title || {})[l] || '')}"></label>
            <label class="ed-field"><span>${esc(L('גוף ההודעה', 'Body'))} (${l})</span><textarea rows="4" data-t="body" data-l="${l}" dir="${D.config.languages[l].dir}">${esc((n.body || {})[l] || '')}</textarea></label>`).join('')}
          <button class="btn small bad" data-del>${D.icon('trash', 16)}</button></section>`).join('')}`;
      m.querySelector('[data-add]').addEventListener('click', () => { N.notices.unshift({ id: 'n-' + Date.now().toString(36), date: D.util.today(), severity: 'info', title: {}, body: {} }); draw(); });
      m.querySelector('[data-save]').addEventListener('click', () => E.saveFile('notices.json', N));
      m.querySelectorAll('.ed-notice').forEach((sec) => {
        const n = N.notices[+sec.getAttribute('data-i')];
        sec.querySelectorAll('[data-k]').forEach((x) => x.addEventListener('change', () => { n[x.getAttribute('data-k')] = x.value || undefined; }));
        sec.querySelectorAll('[data-t]').forEach((x) => x.addEventListener('input', () => { const t = x.getAttribute('data-t'); (n[t] = n[t] || {})[x.getAttribute('data-l')] = x.value; }));
        sec.querySelector('[data-del]').addEventListener('click', () => { N.notices.splice(N.notices.indexOf(n), 1); draw(); });
      });
    };
    draw();
  };

  // ---------- lessons ----------
  E.lessons = () => {
    V.setTitle(L('שיעורים ושאלות', 'Lessons & questions'), { nav: 'editor', back: '#/editor' });
    if (!guard()) return;
    main().innerHTML = `${nav('lessons')}${C.chaptersOf().map((cm) => {
      const ch = C.chapter(cm.id) || { lessons: [] };
      return `<section class="card"><h3>${esc(ch.title || cm.id)} <a class="btn small" href="#/editor/questions/${esc(cm.id)}">${esc(L('שאלות', 'Questions'))} (${D.quiz.pool({ chapters: [cm.id], licence: null }).length})</a></h3>
        <ul class="link-list">${(ch.lessons || []).map((ls) => `<li><a href="#/editor/lesson/${esc(ls.id)}">${esc(ls.title)}</a> <small class="muted">${esc(ls.id)}</small></li>`).join('')}</ul></section>`;
    }).join('')}`;
  };

  // side-by-side editing of a lesson in every language, with a live preview
  E.lesson = async ({ id }) => {
    const ls0 = C.lesson(id);
    if (!ls0) return V.notFound();
    V.setTitle(ls0.title, { nav: 'editor', back: '#/editor/lessons' });
    if (!guard()) return;
    const ch = ls0._chapter;
    const files = {};
    for (const l of langs()) files[l] = await E.file(`${l}/lessons/${ch}.json`);
    const m = main();
    m.innerHTML = `${nav('lessons')}<div class="actions"><a class="btn small" href="#/lesson/${esc(id)}">${D.icon('eye', 16)} ${esc(L('תצוגה', 'View'))}</a><button class="btn primary" data-save>${esc(D.t('common.save'))}</button></div>
      <div class="ed-cols">${langs().map((l) => {
        const f = files[l]; const ls = f && f.lessons.find((x) => x.id === id);
        const dir = D.config.languages[l].dir;
        return `<section class="ed-col" data-l="${l}"><h3>${esc(D.config.languages[l].name)}</h3>
          ${f ? `<label class="ed-field"><span>${esc(L('כותרת', 'Title'))}</span><input data-k="title" dir="${dir}" value="${esc(ls ? ls.title : '')}"></label>
          <label class="ed-field"><span>${esc(L('תקציר', 'Summary'))}</span><input data-k="summary" dir="${dir}" value="${esc(ls ? ls.summary || '' : '')}"></label>
          <label class="ed-field"><span>${esc(L('גוף השיעור', 'Body'))}</span><textarea data-k="body" dir="${dir}" rows="18" class="mono">${esc(ls ? ls.body : '')}</textarea></label>
          <label class="ed-field"><span>${esc(L('נקודות חשובות (שורה לכל נקודה)', 'Key points (one per line)'))}</span><textarea data-k="keyPoints" dir="${dir}" rows="4">${esc(ls ? (ls.keyPoints || []).join('\n') : '')}</textarea></label>
          <div class="ed-preview prose" dir="${dir}"></div>` : `<p class="muted">${esc(L('אין קובץ לשפה זו', 'No file for this language'))}: ${esc(l)}/lessons/${esc(ch)}.json</p>`}</section>`;
      }).join('')}</div>`;
    const preview = (col) => {
      const b = col.querySelector('[data-k="body"]'); if (!b) return;
      M.problems = [];
      const pv = col.querySelector('.ed-preview');
      pv.innerHTML = M.render(b.value) + (M.problems.length ? `<p class="bad-ref">${esc(M.problems.join(', '))}</p>` : '');
      M.hydrate(pv);
    };
    m.querySelectorAll('.ed-col').forEach((col) => {
      preview(col);
      const b = col.querySelector('[data-k="body"]');
      if (b) b.addEventListener('input', () => { clearTimeout(b._t); b._t = setTimeout(() => preview(col), 300); });
    });
    m.querySelector('[data-save]').addEventListener('click', async () => {
      for (const col of m.querySelectorAll('.ed-col')) {
        const l = col.getAttribute('data-l'); const f = files[l]; if (!f) continue;
        let ls = f.lessons.find((x) => x.id === id);
        if (!ls) { ls = { id }; const base = files[langs()[0]].lessons; const idx = base.findIndex((x) => x.id === id); f.lessons.splice(Math.min(idx, f.lessons.length), 0, ls); }
        col.querySelectorAll('[data-k]').forEach((x) => {
          const k = x.getAttribute('data-k');
          if (k === 'keyPoints') ls.keyPoints = x.value.split('\n').map((s) => s.trim()).filter(Boolean);
          else ls[k] = x.value;
        });
        await E.saveFile(`${l}/lessons/${ch}.json`, f);
      }
    });
  };

  // ---------- questions ----------
  E.questions = async ({ chapter }) => {
    V.setTitle(L('שאלות', 'Questions'), { nav: 'editor', back: '#/editor/lessons' });
    if (!guard()) return;
    const l = D.lang();
    const path = `${l}/questions/${chapter}.json`;
    const F = (await E.file(path)) || { chapter, questions: [] };
    const letters = D.t('quiz.optLetters');
    const m = main();
    const draw = () => {
      m.innerHTML = `${nav('lessons')}<h2>${esc((C.chapter(chapter) || {}).title || chapter)} — ${esc(D.config.languages[l].name)}</h2>
        <div class="actions"><button class="btn" data-add>+ ${esc(L('שאלה חדשה', 'New question'))}</button><button class="btn primary" data-save>${esc(D.t('common.save'))}</button></div>
        ${F.questions.map((q, i) => `<section class="card ed-q" data-i="${i}">
          <div class="muted"><code>${esc(q.id)}</code> ${q.lesson ? '· ' + esc(q.lesson) : ''} ${q.licence ? '· ' + esc(q.licence.join(',')) : ''}</div>
          <label class="ed-field"><span>${esc(L('השאלה', 'Question'))}</span><textarea rows="2" data-k="q">${esc(q.q)}</textarea></label>
          ${q.options.map((o, k) => `<label class="ed-opt"><input type="radio" name="ans${i}" value="${k}"${k === q.answer ? ' checked' : ''}> <b>${esc(letters[k] || k + 1)}</b> <input data-o="${k}" value="${esc(o)}"></label>`).join('')}
          <label class="ed-field"><span>${esc(L('הסבר', 'Explanation'))}</span><textarea rows="3" data-k="explain">${esc(q.explain || '')}</textarea></label>
          <div class="ed-grid"><label class="ed-field"><span>${esc(L('תמרור', 'Sign'))}</span><input data-k="sign" value="${esc(q.sign || '')}"></label>
          <label class="ed-field"><span>${esc(L('שיעור', 'Lesson'))}</span><input data-k="lesson" value="${esc(q.lesson || '')}"></label>
          <label class="ed-field"><span>${esc(L('דרגות (פסיק)', 'Classes (comma)'))}</span><input data-k="licence" value="${esc((q.licence || []).join(','))}"></label></div>
          <button class="btn small bad" data-del>${D.icon('trash', 16)}</button></section>`).join('')}`;
      m.querySelector('[data-add]').addEventListener('click', () => {
        const n = F.questions.length + 1;
        F.questions.unshift({ id: `q-${chapter}-x${Date.now().toString(36)}`, chapter, q: '', options: ['', '', '', ''], answer: 0, explain: '' });
        void n; draw();
      });
      m.querySelector('[data-save]').addEventListener('click', () => E.saveFile(path, F));
      m.querySelectorAll('.ed-q').forEach((sec) => {
        const q = F.questions[+sec.getAttribute('data-i')];
        sec.querySelectorAll('[data-k]').forEach((x) => x.addEventListener('change', () => {
          const k = x.getAttribute('data-k'), v = x.value.trim();
          if (k === 'licence') { if (v) q.licence = v.split(',').map((s) => s.trim()).filter(Boolean); else delete q.licence; }
          else if (v || k === 'q') q[k] = x.value; else delete q[k];
        }));
        sec.querySelectorAll('[data-o]').forEach((x) => x.addEventListener('change', () => { q.options[+x.getAttribute('data-o')] = x.value; }));
        sec.querySelectorAll('input[type=radio]').forEach((x) => x.addEventListener('change', () => { q.answer = +x.value; }));
        sec.querySelector('[data-del]').addEventListener('click', () => { if (confirm(L('למחוק את השאלה?', 'Delete this question?'))) { F.questions.splice(F.questions.indexOf(q), 1); draw(); } });
      });
    };
    draw();
  };

  // ---------- signs ----------
  E.signs = () => {
    V.setTitle(L('תמרורים', 'Signs'), { nav: 'editor', back: '#/editor' });
    if (!guard()) return;
    main().innerHTML = `${nav('signs')}<div class="actions"><button class="btn" data-add>+ ${esc(L('תמרור חדש', 'New sign'))}</button></div>
      <div class="sign-grid">${D.data.signs.map((s) => `<a class="sign-card" href="#/editor/sign/${esc(s.num)}">${D.signs.svg(s, { size: 72 })}<span class="sign-num">${esc(s.num)}</span><span class="sign-name">${esc(D.tr(s.name))}</span></a>`).join('')}</div>`;
    main().querySelector('[data-add]').addEventListener('click', async () => {
      const num = prompt(L('מספר התמרור', 'Sign number')); if (!num) return;
      const F = await E.file('signs.json');
      if (F.signs.find((s) => String(s.num) === num)) return D.go('#/editor/sign/' + num);
      F.signs.push({ num, series: num.replace(/^(\d)\d*.*$/, '$100'), cat: 'warning', draw: [], name: {}, meaning: {} });
      await E.saveFile('signs.json', F);
      D.go('#/editor/sign/' + num);
    });
  };

  E.sign = async ({ num }) => {
    V.setTitle(L('תמרור', 'Sign') + ' ' + num, { nav: 'editor', back: '#/editor/signs' });
    if (!guard()) return;
    const F = await E.file('signs.json');
    const s = F.signs.find((x) => String(x.num) === String(num));
    if (!s) return V.notFound();
    const m = main();
    const shape = Object.assign({}, s); ['name', 'meaning', 'notes'].forEach((k) => delete shape[k]);
    m.innerHTML = `${nav('signs')}<div class="ed-cols">
      <section class="ed-col"><div class="ed-sign-prev"></div>
        <label class="ed-field"><span>${esc(L('ציור (JSON)', 'Drawing (JSON)'))}</span><textarea rows="16" class="mono" dir="ltr" data-draw>${esc(JSON.stringify(shape, null, 1))}</textarea></label>
        <p class="muted small">${esc(L('צורות: triangle, triangle-down, circle, octagon, square, rect, diamond, plate, marking, light. סמלים:', 'Shapes: triangle, triangle-down, circle, octagon, square, rect, diamond, plate, marking, light. Glyphs:'))} ${Object.keys(D.glyphs.lib).filter((g) => !g.startsWith('dash-')).map(esc).join(', ')}</p></section>
      <section class="ed-col">${langs().map((l) => `<h3>${esc(D.config.languages[l].name)}</h3>
        <label class="ed-field"><span>${esc(L('שם', 'Name'))}</span><input data-t="name" data-l="${l}" dir="${D.config.languages[l].dir}" value="${esc((s.name || {})[l] || '')}"></label>
        <label class="ed-field"><span>${esc(L('משמעות', 'Meaning'))}</span><textarea rows="4" data-t="meaning" data-l="${l}" dir="${D.config.languages[l].dir}">${esc((s.meaning || {})[l] || '')}</textarea></label>
        <label class="ed-field"><span>${esc(L('חשוב לדעת', 'Good to know'))}</span><textarea rows="3" data-t="notes" data-l="${l}" dir="${D.config.languages[l].dir}">${esc((s.notes || {})[l] || '')}</textarea></label>`).join('')}
        <div class="actions"><button class="btn primary" data-save>${esc(D.t('common.save'))}</button></div></section></div>`;
    const prev = m.querySelector('.ed-sign-prev'), ta = m.querySelector('[data-draw]');
    const draw = () => {
      try { const d = JSON.parse(ta.value); prev.innerHTML = D.signs.svg(Object.assign({}, d, { name: s.name }), { size: 200 }); ta.classList.remove('bad'); }
      catch (e) { ta.classList.add('bad'); }
    };
    ta.addEventListener('input', draw);
    draw();
    m.querySelector('[data-save]').addEventListener('click', async () => {
      let d; try { d = JSON.parse(ta.value); } catch (e) { return V.toast(D.t('common.error') + ': JSON'); }
      Object.keys(s).forEach((k) => { if (!['name', 'meaning', 'notes'].includes(k)) delete s[k]; });
      Object.assign(s, d);
      m.querySelectorAll('[data-t]').forEach((x) => { const t = x.getAttribute('data-t'); (s[t] = s[t] || {})[x.getAttribute('data-l')] = x.value; });
      await E.saveFile('signs.json', F);
    });
  };

  // ---------- check: every reference resolves, languages match ----------
  E.check = () => {
    V.setTitle(L('בדיקה', 'Check'), { nav: 'editor', back: '#/editor' });
    if (!guard()) return;
    const out = D.check.run();
    main().innerHTML = `${nav('check')}<p>${out.errors.length} ${esc(L('שגיאות', 'errors'))}, ${out.warnings.length} ${esc(L('אזהרות', 'warnings'))}</p>
      ${out.errors.length ? `<h3>${esc(L('שגיאות', 'Errors'))}</h3><ul class="check-list bad">${out.errors.map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}
      ${out.warnings.length ? `<h3>${esc(L('אזהרות', 'Warnings'))}</h3><ul class="check-list">${out.warnings.slice(0, 500).map((e) => `<li>${esc(e)}</li>`).join('')}</ul>` : ''}`;
  };

  D.route('editor', E.home);
  D.route('editor/facts', (p, q) => E.facts(p, q, 'facts'));
  D.route('editor/offences', (p, q) => E.facts(p, q, 'offences'));
  D.route('editor/notices', E.notices);
  D.route('editor/lessons', E.lessons);
  D.route('editor/lesson/:id', E.lesson);
  D.route('editor/questions/:chapter', E.questions);
  D.route('editor/signs', E.signs);
  D.route('editor/sign/:num', E.sign);
  D.route('editor/check', E.check);
})(globalThis.Drive = globalThis.Drive || {});
