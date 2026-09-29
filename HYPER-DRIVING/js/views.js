/* Hyper Driving · views.js — the screens. Each route renders into #main.
 * Content comes from D.data (content.js); words of the interface from D.t.
 */
(function (D) {
  'use strict';
  const { h, esc } = D.util;
  const C = D.content, Q = D.quiz, M = D.markup;
  const V = D.views = {};
  const T = (k, v) => D.t(k, v);
  // titles and summaries may carry {{fact:…}}: printed as plain text with the value filled in
  const plain = (s) => esc(M.valuesText(s == null ? '' : s));

  // ---------- helpers ----------
  const html = (s) => { const t = document.createElement('template'); t.innerHTML = s.trim(); return t.content; };
  const main = () => document.getElementById('main');
  V.setTitle = (title, opts) => {
    opts = opts || {};
    const el = document.getElementById('top-title');
    if (el) el.textContent = title || '';
    document.title = (title ? title + ' · ' : '') + D.config.app;
    const back = document.getElementById('top-back');
    if (back) back.hidden = !opts.back;
    V._back = opts.back || null;
    document.querySelectorAll('[data-nav]').forEach((a) => a.classList.toggle('on', a.getAttribute('data-nav') === (opts.nav || '')));
  };

  // an icon for a chapter: an interface icon, a sign ("sign:302") or a glyph ("glyph:car-side")
  V.chapIcon = (icon, size) => {
    size = size || 30;
    if (icon && icon.startsWith('sign:')) { const s = D.data.signByNum.get(icon.slice(5)); if (s) return D.signs.svg(s, { size }); }
    if (icon && icon.startsWith('dash:')) { const d = D.data.dashById.get(icon.slice(5)); if (d) return D.dash.svg(d, { size }); }
    return D.icon(icon || 'book', size * 0.8);
  };

  const hueStyle = (hue) => (hue != null ? `--h:${hue}` : '');
  const progressBar = (frac) => `<div class="pbar"><span style="width:${Math.round(Math.max(0, Math.min(1, frac)) * 100)}%"></span></div>`;
  const pill = (txt, cls) => `<span class="pill ${cls || ''}">${esc(txt)}</span>`;
  const licenceName = (id) => { const c = (D.data.licences.classes || []).find((x) => x.id === id); return c ? D.tr(c.name) : id; };

  // licence classes an item is tagged with, as short pills
  const licencePills = (item) => {
    if (!item || !item.licence || !item.licence.length) return '';
    const set = [...C.expandLicences(item.licence)];
    return `<span class="lic-pills" title="${esc(T('learn.forLicence'))}">${set.map((x) => pill(x, 'lic')).join('')}</span>`;
  };

  function chapterStats(id) {
    const ls = C.lessonsOf(id);
    const read = ls.filter((l) => Q.lessonRead(l.id)).length;
    const qn = Q.pool({ chapters: [id] }).length;
    return { lessons: ls.length, read, questions: qn };
  }

  // =========================================================
  // HOME
  // =========================================================
  V.home = () => {
    V.setTitle('', { nav: 'home' });
    const p = Q.progress();
    const allLessons = C.chaptersOf().reduce((a, c) => a + C.lessonsOf(c.id).length, 0);
    const read = Object.keys(p.lessons).filter((id) => C.lesson(id)).length;
    const pool = Q.pool();
    const st = Q.stats(pool);
    const exams = p.exams.filter((e) => e.lic === D.settings.licence).slice(-5);
    const rules = Q.examRules();
    const last = p.last && C.lesson(p.last);
    let nextLesson = null;
    if (last) {
      const ls = C.lessonsOf(last._chapter);
      nextLesson = ls[last._index + 1] || null;
    }
    if (!nextLesson) {
      for (const cm of C.chaptersOf()) { const x = C.lessonsOf(cm.id).find((l) => !Q.lessonRead(l.id)); if (x) { nextLesson = x; break; } }
    }
    // sign of the day: the same all day, different tomorrow
    const signs = D.data.signs.filter((s) => s.cat !== 'marking' && D.tr(s.name));
    const sod = signs.length ? signs[D.util.hash(D.util.today()) % signs.length] : null;
    const notices = (D.data.notices || []).filter((n) => !n.until || n.until >= D.util.today()).slice(0, 3);
    const readiness = pool.length ? st.mastered / pool.length : 0;

    const el = html(`
      <section class="hero">
        <div class="hero-text">
          <h1>${esc(D.config.app)}</h1>
          <p class="lead">${esc(T('app.tagline'))}</p>
          <a class="lic-chip" href="#/settings">${D.icon(licIcon(D.settings.licence), 18)}<span>${esc(T('home.studyingFor'))}: <b>${esc(licenceName(D.settings.licence))}</b></span><span class="lic-change">${esc(T('home.change'))}</span></a>
        </div>
        <div class="stats">
          <div class="stat"><div class="stat-n">${read}<small>/${allLessons}</small></div><div class="stat-l">${esc(T('home.lessonsRead'))}</div>${progressBar(allLessons ? read / allLessons : 0)}</div>
          <div class="stat"><div class="stat-n">${st.mastered}<small>/${pool.length}</small></div><div class="stat-l">${esc(T('home.mastered'))}</div>${progressBar(readiness)}</div>
          <div class="stat"><div class="stat-n">${exams.filter((e) => e.passed).length}<small>/${exams.length}</small></div><div class="stat-l">${esc(T('home.lastExams'))}</div>
            <div class="exam-dots">${exams.length ? exams.map((e) => `<span class="dot ${e.passed ? 'ok' : 'bad'}" title="${e.correct}/${e.n}"></span>`).join('') : `<small class="muted">${esc(T('home.noExams'))}</small>`}</div></div>
        </div>
      </section>
      ${notices.length ? `<section class="notices">${notices.map((n) => `<a class="notice sev-${esc(n.severity || 'info')}" href="#/updates">${D.icon('bell', 18)}<div><b>${esc(D.tr(n.title))}</b><span>${esc(D.fmtDate(n.date))}</span></div></a>`).join('')}</section>` : ''}
      <section class="grid2">
        ${nextLesson ? `<a class="card go" href="#/lesson/${esc(nextLesson.id)}" style="${hueStyle((C.chapterMeta(nextLesson._chapter) || {}).hue)}">
          <div class="card-k">${esc(last ? T('home.continue') : T('home.start'))}</div>
          <div class="card-t">${plain(nextLesson.title)}</div>
          <div class="card-s">${esc((C.chapter(nextLesson._chapter) || {}).title || '')}</div></a>` : ''}
        ${sod ? `<a class="card sod" href="#/sign/${esc(sod.num)}"><div class="sod-art">${D.signs.svg(sod, { size: 84 })}</div>
          <div><div class="card-k">${esc(T('home.signOfDay'))}</div><div class="card-t">${esc(D.tr(sod.name))}</div><div class="card-s">${esc(T('signs.number'))} ${esc(sod.num)}</div></div></a>` : ''}
      </section>
      <h2 class="sec">${esc(T('home.quick'))}</h2>
      <section class="quick">
        <button class="qa" data-act="exam">${D.icon('clock')}<b>${esc(T('home.exam'))}</b><small>${esc(T('practice.examDesc', { n: rules.questions, min: rules.minutes, err: rules.maxErrors }))}</small></button>
        <button class="qa" data-act="smart">${D.icon('bolt')}<b>${esc(T('home.smart'))}</b><small>${esc(T('practice.smartDesc'))}</small></button>
        <button class="qa" data-act="mistakes">${D.icon('flag')}<b>${esc(T('home.mistakes'))}</b><small>${st.wrong ? st.wrong + ' ' + esc(T('learn.questions')) : esc(T('practice.mistakesDesc'))}</small></button>
        <button class="qa" data-act="signs">${D.icon('sign')}<b>${esc(T('home.signDrill'))}</b><small>${esc(T('practice.signsDesc'))}</small></button>
      </section>
      <h2 class="sec">${esc(T('learn.title'))}</h2>
      <section class="chapters">${chapterCards(C.chaptersOf('theory').slice(0, 6))}</section>
      <p class="more-link"><a href="#/learn">${esc(T('common.more'))} ${D.icon('next', 16)}</a></p>
    `);
    const m = main(); m.replaceChildren(el);
    m.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => V.startPractice(b.getAttribute('data-act'))));
  };

  const licIcon = (id) => {
    const g = D.data && D.data.licences && Object.entries(D.data.licences.groups || {}).find(([k, v]) => k !== 'all' && v.includes(id));
    return { car: 'car', moto: 'moto', heavy: 'truck', bus: 'bus', tractor: 'tractor' }[g && g[0]] || 'car';
  };

  function chapterCards(list) {
    return list.map((cm) => {
      const ch = C.chapter(cm.id);
      if (!ch) return '';
      const s = chapterStats(cm.id);
      return `<a class="chap" href="#/chapter/${esc(cm.id)}" style="${hueStyle(cm.hue)}">
        <div class="chap-ico">${V.chapIcon(cm.icon)}</div>
        <div class="chap-body"><div class="chap-t">${plain(ch.title)}</div><div class="chap-s">${plain(ch.summary)}</div>
        <div class="chap-meta">${s.lessons} ${esc(T('learn.lessons'))} · ${s.questions} ${esc(T('learn.questions'))}</div>${progressBar(s.lessons ? s.read / s.lessons : 0)}</div></a>`;
    }).join('');
  }

  // =========================================================
  // LEARN
  // =========================================================
  V.learn = () => {
    V.setTitle(T('learn.title'), { nav: 'learn' });
    const secs = (D.data.course.sections || []).filter((s) => s.id !== 'vehicle');
    const el = html(`<header class="page-head"><h1>${esc(T('learn.title'))}</h1><p class="lead">${esc(T('learn.intro'))}</p></header>
      ${(secs.length ? secs : [{ id: 'theory' }]).map((s) => `${s.title ? `<h2 class="sec">${esc(D.tr(s.title))}</h2>` : ''}<section class="chapters">${chapterCards(C.chaptersOf(s.id))}</section>`).join('')}`);
    main().replaceChildren(el);
  };

  V.chapter = ({ id }) => {
    const cm = C.chapterMeta(id), ch = C.chapter(id);
    if (!cm || !ch) return V.notFound();
    const isVeh = cm.section === 'vehicle';
    V.setTitle(ch.title, { nav: isVeh ? 'vehicle' : 'learn', back: isVeh ? '#/vehicle' : '#/learn' });
    const s = chapterStats(id);
    const lessons = ch.lessons || [];
    const el = html(`<header class="page-head chap-head" style="${hueStyle(cm.hue)}">
        <div class="chap-ico big">${V.chapIcon(cm.icon, 48)}</div>
        <div><h1>${plain(ch.title)}</h1><p class="lead">${plain(ch.summary)}</p>
        <div class="chap-meta">${s.lessons} ${esc(T('learn.lessons'))} · ${s.questions} ${esc(T('learn.questions'))}</div></div>
      </header>
      ${lessons.length ? `<ol class="lesson-list">${lessons.map((ls, i) => `<li><a href="#/lesson/${esc(ls.id)}" class="${Q.lessonRead(ls.id) ? 'read' : ''}${C.forLicence(ls) ? '' : ' other-lic'}">
        <span class="ln">${i + 1}</span><span class="lt"><b>${plain(ls.title)}</b><small>${plain(ls.summary)}</small></span>${licencePills(ls)}
        <span class="lr">${Q.lessonRead(ls.id) ? D.icon('check', 18) : D.icon('next', 18)}</span></a></li>`).join('')}</ol>` : `<p class="empty">${esc(T('learn.empty'))}</p>`}
      ${s.questions ? `<div class="actions"><button class="btn primary" data-practice="${esc(id)}">${D.icon('quiz', 18)} ${esc(T('learn.practiceChapter'))}</button></div>` : ''}`);
    main().replaceChildren(el);
    const b = main().querySelector('[data-practice]');
    if (b) b.addEventListener('click', () => V.startPractice('topic', { chapters: [id] }));
  };

  V.lesson = ({ id }) => {
    const ls = C.lesson(id);
    if (!ls) return V.notFound();
    const cm = C.chapterMeta(ls._chapter) || {};
    const ch = C.chapter(ls._chapter) || {};
    const isVeh = cm.section === 'vehicle';
    V.setTitle(ch.title || '', { nav: isVeh ? 'vehicle' : 'learn', back: '#/chapter/' + ls._chapter });
    const list = ch.lessons || [];
    const prev = list[ls._index - 1], next = list[ls._index + 1];
    M.problems = [];
    const body = M.withLang(ls._lang, () => M.render(ls.body));
    const kp = (ls.keyPoints || []).length ? `<aside class="keypoints"${ls._lang !== D.lang() ? ` dir="${D.config.languages[ls._lang].dir}"` : ''}><h3>${D.icon('star', 18)} ${esc(T('learn.keyPoints'))}</h3><ul>${M.withLang(ls._lang, () => ls.keyPoints.map((k) => `<li>${M.inline(k)}</li>`).join(''))}</ul></aside>` : '';
    const terms = (ls.terms || []).filter((t) => D.data.termById.has(t));
    const signs = (ls.signs || []).map(String).filter((n) => D.data.signByNum.has(n));
    const qn = Q.pool({ lesson: id }).length;
    const el = html(`<article class="lesson" style="${hueStyle(cm.hue)}">
      <header class="lesson-head">
        <div class="crumbs"><a href="#/chapter/${esc(ls._chapter)}">${plain(ch.title)}</a> · ${esc(T('learn.lesson'))} ${ls._index + 1}/${list.length}</div>
        <h1>${plain(ls.title)}</h1>
        ${ls.summary ? `<p class="lead">${plain(ls.summary)}</p>` : ''}
        ${!C.forLicence(ls) ? `<p class="note">${esc(T('learn.notForYou'))} ${licencePills(ls)}</p>` : ''}
        ${ls._lang !== D.lang() ? `<p class="note">${esc(T('learn.fallback'))}</p>` : ''}
      </header>
      <div class="prose" ${ls._lang !== D.lang() ? `dir="${D.config.languages[ls._lang].dir}" lang="${ls._lang}"` : ''}>${body}</div>
      ${kp}
      ${signs.length ? `<section class="lesson-extra"><h3>${esc(T('learn.signsHere'))}</h3><div class="sign-row">${signs.map((n) => { const s = D.data.signByNum.get(n); return `<a class="sign-card mini" href="#/sign/${esc(n)}">${D.signs.svg(s, { size: 64 })}<span class="sign-num">${esc(n)}</span><span class="sign-name">${esc(D.tr(s.name))}</span></a>`; }).join('')}</div></section>` : ''}
      ${terms.length ? `<section class="lesson-extra"><h3>${esc(T('learn.termsHere'))}</h3><div class="term-cloud">${terms.map((t) => M.inline('[[term:' + t + ']]')).join('')}</div></section>` : ''}
      <div class="lesson-actions">
        ${qn ? `<button class="btn primary" data-practice>${D.icon('quiz', 18)} ${esc(T('learn.practiceLesson'))} <small>(${qn})</small></button>` : ''}
      </div>
      <nav class="pager">
        ${prev ? `<a class="pg prev" href="#/lesson/${esc(prev.id)}">${D.icon('back', 18)}<span><small>${esc(T('learn.prev'))}</small>${plain(prev.title)}</span></a>` : '<span></span>'}
        ${next ? `<a class="pg next" href="#/lesson/${esc(next.id)}"><span><small>${esc(T('learn.next'))}</small>${plain(next.title)}</span>${D.icon('next', 18)}</a>` : '<span></span>'}
      </nav>
    </article>`);
    const m = main(); m.replaceChildren(el);
    M.hydrate(m);
    const pb = m.querySelector('[data-practice]');
    if (pb) pb.addEventListener('click', () => V.startPractice('lesson', { lesson: id }));
    Q.markLesson(id);
    if (M.problems.length && D.settings.editor) console.warn('lesson', id, 'broken refs:', M.problems);
  };

  // =========================================================
  // SIGNS
  // =========================================================
  V.signs = ({ series }) => {
    V.setTitle(T('signs.title'), { nav: 'signs' });
    const all = D.data.series || [];
    let q = '';
    let cur = series || '';
    const el = html(`<header class="page-head"><h1>${esc(T('signs.title'))}</h1><p class="lead">${esc(T('signs.intro'))}</p></header>
      <div class="toolbar">
        <input type="search" class="search-in" placeholder="${esc(T('signs.search'))}" aria-label="${esc(T('signs.search'))}">
        <button class="btn small" data-drill>${D.icon('quiz', 16)} ${esc(T('signs.drill'))}</button>
      </div>
      <div class="chips" role="tablist">
        <button class="chip" data-s="">${esc(T('signs.all'))}</button>
        ${all.map((s) => `<button class="chip" data-s="${esc(s.id)}" style="${hueStyle(s.hue)}">${esc(D.tr(s.short || s.title))}</button>`).join('')}
      </div>
      <p class="series-desc muted"></p>
      <div class="sign-grid"></div>`);
    const m = main(); m.replaceChildren(el);
    const grid = m.querySelector('.sign-grid'), desc = m.querySelector('.series-desc');
    const draw = () => {
      m.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.getAttribute('data-s') === cur));
      const sd = all.find((s) => s.id === cur);
      desc.textContent = sd ? D.tr(sd.desc || '') : '';
      const nq = C.norm(q);
      const list = D.data.signs.filter((s) => (!cur || String(s.series) === cur) && (!nq || C.norm(s.num + ' ' + Object.values(s.name || {}).join(' ')).includes(nq)));
      grid.innerHTML = list.length ? list.map((s) => `<a class="sign-card" href="#/sign/${esc(s.num)}">${D.signs.svg(s, { size: 88 })}<span class="sign-num">${esc(s.num)}</span><span class="sign-name">${esc(D.tr(s.name))}</span></a>`).join('')
        : `<p class="empty">${esc(T('signs.none'))}</p>`;
    };
    m.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => { cur = c.getAttribute('data-s'); history.replaceState(null, '', cur ? '#/signs/' + cur : '#/signs'); draw(); }));
    m.querySelector('.search-in').addEventListener('input', (e) => { q = e.target.value; draw(); });
    m.querySelector('[data-drill]').addEventListener('click', () => V.startPractice('signs', { series: cur }));
    draw();
  };

  V.sign = ({ num }) => {
    const s = D.data.signByNum.get(num);
    if (!s) return V.notFound();
    V.setTitle(T('signs.number') + ' ' + num, { nav: 'signs', back: '#/signs/' + s.series });
    const ser = (D.data.series || []).find((x) => x.id === String(s.series));
    const other = D.lang() === 'he' ? 'en' : 'he';
    const used = (C.usage().sign.get(String(num)) || []).filter((w) => w.type === 'lesson' && w.lang === (C.lesson(w.id) || {})._lang);
    const lessons = [...new Set(used.map((w) => w.id))].map((id) => C.lesson(id)).filter(Boolean);
    const related = (s.related || []).map(String).map((n) => D.data.signByNum.get(n)).filter(Boolean);
    const qs = C.questions().filter((q) => String(q.sign) === String(num) || (q.q && q.q.includes('[[sign:' + num)));
    // every picture the chart shows for this number, and the chart page(s) they come from
    const pics = D.signs.art(num) || [];
    const pages = [...new Set(pics.map((p) => p.page).filter(Boolean))];
    const hero = pics.length > 1
      ? `<div class="sign-pics">${pics.map((p, i) => D.signs.svg(s, { size: pics.length > 2 ? 100 : 140, pic: i, maxW: 2 })).join('')}</div>`
      : D.signs.svg(s, { size: 220, maxW: 1 });
    const el = html(`<article class="sign-page" style="${hueStyle(ser && ser.hue)}">
      <div class="sign-hero">${hero}${pages.length ? `<p class="sign-src">${esc(T('signs.fromChart', { p: pages.join(', ') }))}</p>` : ''}</div>
      <div class="sign-info">
        <div class="crumbs">${ser ? `<a href="#/signs/${esc(ser.id)}">${esc(D.tr(ser.title))}</a>` : ''}</div>
        <h1><span class="num-badge">${esc(num)}</span> ${esc(D.tr(s.name))}</h1>
        ${s.name && s.name[other] ? `<p class="other-lang" lang="${other}" dir="${D.config.languages[other].dir}">${esc(s.name[other])}</p>` : ''}
        <h3>${esc(T('signs.meaning'))}</h3>
        <div class="prose">${M.render(D.tr(s.meaning))}</div>
        ${s.notes && D.tr(s.notes) ? `<aside class="callout callout-remember"><div class="callout-head"><span class="callout-icon">★</span>${esc(T('signs.notes'))}</div><div class="callout-body">${M.render(D.tr(s.notes))}</div></aside>` : ''}
        ${related.length ? `<h3>${esc(T('signs.related'))}</h3><div class="sign-row">${related.map((r) => `<a class="sign-card mini" href="#/sign/${esc(r.num)}">${D.signs.svg(r, { size: 60 })}<span class="sign-num">${esc(r.num)}</span><span class="sign-name">${esc(D.tr(r.name))}</span></a>`).join('')}</div>` : ''}
        ${lessons.length ? `<h3>${esc(T('signs.inLessons'))}</h3><ul class="link-list">${lessons.map((l) => `<li><a href="#/lesson/${esc(l.id)}">${plain(l.title)}</a></li>`).join('')}</ul>` : ''}
        <div class="actions">
          <button class="btn primary" data-drill>${D.icon('quiz', 18)} ${esc(T('signs.drill'))}</button>
          ${qs.length ? `<button class="btn" data-qs>${D.icon('check', 18)} ${qs.length} ${esc(T('learn.questions'))}</button>` : ''}
        </div>
      </div></article>`);
    const m = main(); m.replaceChildren(el);
    M.hydrate(m);
    m.querySelector('[data-drill]').addEventListener('click', () => V.startPractice('signs', { series: String(s.series) }));
    const qb = m.querySelector('[data-qs]');
    if (qb) qb.addEventListener('click', () => { Q.session('topic', qs); D.go('#/quiz'); });
  };

  // =========================================================
  // VEHICLE
  // =========================================================
  const TOOLS = [
    { w: 'four-stroke', icon: 'engine', he: 'מנוע ארבע פעימות', en: 'Four-stroke engine' },
    { w: 'four-stroke', p: 'type=diesel', icon: 'engine', he: 'מנוע דיזל', en: 'Diesel engine' },
    { w: 'stopping-distance', icon: 'brake', he: 'מחשבון מרחק עצירה', en: 'Stopping-distance calculator' },
    { w: 'speed-energy', icon: 'speed', he: 'מהירות ואנרגיה', en: 'Speed and energy' },
    { w: 'blind-spots', icon: 'eye', he: 'שטחים מתים', en: 'Blind spots' },
    { w: 'tyre-code', icon: 'tyre', he: 'קריאת קוד צמיג', en: 'Reading a tyre code' },
    { w: 'traffic-light', icon: 'light', he: 'מחזור הרמזור', en: 'The traffic-light cycle' },
    { w: 'following-distance', icon: 'road', he: 'שמירת מרחק', en: 'Following distance' }
  ];
  V.vehicle = () => {
    V.setTitle(T('vehicle.title'), { nav: 'vehicle' });
    const trees = C.trees();
    const el = html(`<header class="page-head"><h1>${esc(T('vehicle.title'))}</h1><p class="lead">${esc(T('vehicle.intro'))}</p></header>
      <section class="grid3">
        <a class="card tool" href="#/vehicle/dash">${D.icon('gauge', 30)}<div><div class="card-t">${esc(T('vehicle.dash'))}</div><div class="card-s">${D.data.dash.length} · ${esc(T('vehicle.dashIntro'))}</div></div></a>
        <a class="card tool" href="#/vehicle/trouble">${D.icon('tree', 30)}<div><div class="card-t">${esc(T('vehicle.trouble'))}</div><div class="card-s">${trees.length} · ${esc(T('vehicle.troubleIntro'))}</div></div></a>
        <a class="card tool" href="#/vehicle/maintenance">${D.icon('calendar', 30)}<div><div class="card-t">${esc(T('vehicle.maintenance'))}</div><div class="card-s">${esc(T('vehicle.maintenanceIntro'))}</div></div></a>
      </section>
      <h2 class="sec">${esc(T('vehicle.systems'))}</h2>
      <section class="chapters">${chapterCards(C.chaptersOf('vehicle'))}</section>
      <h2 class="sec">${esc(T('vehicle.tools'))}</h2>
      <section class="grid4">${TOOLS.map((t) => `<a class="card tool small" href="#/tool/${t.w}${t.p ? '?' + t.p : ''}">${D.icon(t.icon, 24)}<div class="card-t">${esc(D.lang() === 'he' ? t.he : t.en)}</div></a>`).join('')}</section>`);
    main().replaceChildren(el);
  };

  V.tool = ({ name }, query) => {
    const t = TOOLS.find((x) => x.w === name && (!x.p || x.p === Object.entries(query).map(([k, v]) => k + '=' + v).join('&'))) || TOOLS.find((x) => x.w === name);
    if (!t || !D.widgets.has(name)) return V.notFound();
    V.setTitle(D.lang() === 'he' ? t.he : t.en, { nav: 'vehicle', back: '#/vehicle' });
    const el = h('div', { class: 'tool-page' }, h('h1', {}, D.lang() === 'he' ? t.he : t.en), h('figure', { class: 'fig fig-widget' }, h('div', { class: 'widget', 'data-widget': name, 'data-params': JSON.stringify(query || {}) })));
    main().replaceChildren(el);
    M.hydrate(main());
  };

  V.dashList = () => {
    V.setTitle(T('vehicle.dash'), { nav: 'vehicle', back: '#/vehicle' });
    const groups = ['red', 'amber', 'yellow', 'green', 'blue', 'white'];
    const el = html(`<header class="page-head"><h1>${esc(T('vehicle.dash'))}</h1><p class="lead">${esc(T('vehicle.dashIntro'))}</p></header>
      <div class="dash-legend">${['red', 'amber', 'green', 'blue', 'white'].map((c) => `<span><i style="background:${D.dash.COL[c]}"></i>${esc(T('dash.' + c))}</span>`).join('')}</div>
      ${groups.map((g) => { const ds = D.data.dash.filter((d) => d.color === g); return ds.length ? `<section class="dash-grid">${ds.map((d) => `<a class="dash-card" href="#/vehicle/dash/${esc(d.id)}">${D.dash.svg(d, { size: 64 })}<span>${esc(D.tr(d.name))}</span></a>`).join('')}</section>` : ''; }).join('')}
      <div class="actions"><button class="btn primary" data-drill>${D.icon('quiz', 18)} ${esc(T('practice.dash'))}</button></div>`);
    main().replaceChildren(el);
    main().querySelector('[data-drill]').addEventListener('click', () => V.startPractice('dash'));
  };

  V.dashOne = ({ id }) => {
    const d = D.data.dashById.get(id);
    if (!d) return V.notFound();
    V.setTitle(D.tr(d.name), { nav: 'vehicle', back: '#/vehicle/dash' });
    const other = D.lang() === 'he' ? 'en' : 'he';
    const el = html(`<article class="sign-page">
      <div class="sign-hero">${D.dash.svg(d, { size: 160 })}</div>
      <div class="sign-info">
        <h1>${esc(D.tr(d.name))}</h1>
        ${d.name && d.name[other] ? `<p class="other-lang" lang="${other}" dir="${D.config.languages[other].dir}">${esc(d.name[other])}</p>` : ''}
        <p>${pill(T('dash.' + (d.color === 'yellow' ? 'amber' : d.color)), 'sev-' + d.color)}</p>
        <h3>${esc(T('dash.meaning'))}</h3><div class="prose">${M.render(D.tr(d.meaning))}</div>
        ${d.action ? `<h3>${esc(T('dash.action'))}</h3><div class="prose">${M.render(D.tr(d.action))}</div>` : ''}
        ${d.severity ? `<p class="sev sev-${esc(d.severity)}">${esc(T('sev.' + d.severity))}</p>` : ''}
        ${d.tree ? `<p><a class="btn" href="#/trouble/${esc(d.tree)}">${D.icon('tree', 18)} ${esc(T('vehicle.trouble'))}</a></p>` : ''}
      </div></article>`);
    main().replaceChildren(el);
    M.hydrate(main());
  };

  V.troubleList = () => {
    V.setTitle(T('vehicle.trouble'), { nav: 'vehicle', back: '#/vehicle' });
    const trees = C.trees();
    const cats = [...new Set(trees.map((t) => t.group || ''))];
    const el = html(`<header class="page-head"><h1>${esc(T('vehicle.trouble'))}</h1><p class="lead">${esc(T('vehicle.troubleIntro'))}</p></header>
      ${cats.map((c) => `${c ? `<h2 class="sec">${esc(c)}</h2>` : ''}<section class="grid2">${trees.filter((t) => (t.group || '') === c).map((t) => `<a class="card go" href="#/trouble/${esc(t.id)}"><div class="card-t">${plain(t.title)}</div><div class="card-s">${plain(t.summary)}</div>${t.vehicles ? `<div class="veh-pills">${t.vehicles.map((v) => D.icon({ car: 'car', motorcycle: 'moto', truck: 'truck', bus: 'bus' }[v] || 'car', 16)).join('')}</div>` : ''}</a>`).join('')}</section>`).join('')}`);
    main().replaceChildren(el);
  };

  // a decision tree: nodes { q, options: [{label, next}] } or { result, severity, text, actions: [] }
  V.trouble = ({ id }) => {
    const tr = C.tree(id);
    if (!tr) return V.notFound();
    V.setTitle(tr.title, { nav: 'vehicle', back: '#/vehicle/trouble' });
    const path = [];
    const m = main();
    const draw = () => {
      const nodeId = path.length ? path[path.length - 1].next : tr.start;
      const n = tr.nodes[nodeId];
      if (!n) { m.innerHTML = `<p class="bad-ref">⟦node ${esc(nodeId)}⟧</p>`; return; }
      const trail = path.map((p) => `<li><span class="q">${M.inline(tr.nodes[p.from].q)}</span><span class="a">${esc(p.label)}</span></li>`).join('');
      const body = n.q
        ? `<div class="tree-q"><h2>${M.inline(n.q)}</h2>${n.text ? `<div class="prose">${M.render(n.text)}</div>` : ''}<div class="tree-opts">${n.options.map((o, i) => `<button class="btn opt" data-i="${i}">${M.inline(o.label)}</button>`).join('')}</div></div>`
        : `<div class="tree-r sev-${esc(n.severity || 'soon')}"><div class="card-k">${esc(T('tree.result'))}</div><h2>${M.inline(n.result || '')}</h2>
            ${n.severity ? `<p class="sev sev-${esc(n.severity)}">${esc(T('sev.' + n.severity))}</p>` : ''}
            ${n.text ? `<div class="prose">${M.render(n.text)}</div>` : ''}
            ${n.actions && n.actions.length ? `<h3>${esc(T('tree.do'))}</h3><ol class="steps">${n.actions.map((a) => `<li>${M.inline(a)}</li>`).join('')}</ol>` : ''}
            ${n.lesson ? `<p><a class="xref" href="#/lesson/${esc(n.lesson)}">${esc(T('quiz.toLesson'))}</a></p>` : ''}</div>`;
      m.innerHTML = `<article class="tree"><header class="page-head"><h1>${plain(tr.title)}</h1>${tr.summary ? `<p class="lead">${plain(tr.summary)}</p>` : ''}</header>
        ${tr.safety ? `<aside class="callout callout-danger"><div class="callout-head"><span class="callout-icon">⚠</span>${esc(D.tr(M.CALLOUT.danger))}</div><div class="callout-body">${M.render(tr.safety)}</div></aside>` : ''}
        ${trail ? `<ol class="trail">${trail}</ol>` : ''}${body}
        <div class="actions">${path.length ? `<button class="btn small" data-back>${D.icon('back', 16)} ${esc(T('tree.back'))}</button><button class="btn small" data-restart>${esc(T('tree.restart'))}</button>` : ''}</div></article>`;
      M.hydrate(m);
      m.querySelectorAll('.opt').forEach((b) => b.addEventListener('click', () => {
        const o = n.options[+b.getAttribute('data-i')];
        path.push({ from: nodeId, next: o.next, label: M.plain(o.label) });
        draw(); m.scrollIntoView({ block: 'start' });
      }));
      const bb = m.querySelector('[data-back]'); if (bb) bb.addEventListener('click', () => { path.pop(); draw(); });
      const br = m.querySelector('[data-restart]'); if (br) br.addEventListener('click', () => { path.length = 0; draw(); });
    };
    draw();
  };

  V.maintenance = () => {
    V.setTitle(T('vehicle.maintenance'), { nav: 'vehicle', back: '#/vehicle' });
    const mt = D.data.maintenance || {};
    const items = mt.items || [];
    const kinds = [...new Set(items.flatMap((i) => i.vehicles || ['car']))];
    let kind = kinds.includes('car') ? 'car' : kinds[0];
    const el = html(`<header class="page-head"><h1>${esc(T('vehicle.maintenance'))}</h1><p class="lead">${esc(T('vehicle.maintenanceIntro'))}</p></header>
      ${mt.intro ? `<div class="prose">${M.render(D.tr(mt.intro))}</div>` : ''}
      <div class="chips">${kinds.map((k) => `<button class="chip" data-k="${esc(k)}">${D.icon({ car: 'car', motorcycle: 'moto', truck: 'truck', bus: 'bus', ev: 'plug' }[k] || 'car', 16)} ${esc(D.tr((mt.vehicleNames || {})[k]) || k)}</button>`).join('')}</div>
      <div class="table-wrap"><table class="maint"><thead><tr><th>${esc(T('maint.item'))}</th><th>${esc(T('maint.every'))}</th><th>${esc(T('maint.who'))}</th><th></th></tr></thead><tbody></tbody></table></div>`);
    const m = main(); m.replaceChildren(el);
    const tb = m.querySelector('tbody');
    const draw = () => {
      m.querySelectorAll('.chip').forEach((c) => c.classList.toggle('on', c.getAttribute('data-k') === kind));
      tb.innerHTML = items.filter((i) => (i.vehicles || ['car']).includes(kind)).map((i) => {
        const every = [i.km ? D.fmtNum(i.km) + ' ' + T('common.km') : '', i.months ? i.months + ' ' + T('common.months') : '', i.when ? D.tr(i.when) : ''].filter(Boolean).join(` ${T('common.or')} `);
        return `<tr><td><b>${esc(D.tr(i.name))}</b>${i.what ? `<div class="muted">${M.inline(D.tr(i.what))}</div>` : ''}</td><td>${esc(every)}</td><td>${esc(T(i.who === 'garage' ? 'maint.garage' : 'maint.driver'))}</td><td>${i.lesson ? `<a class="xref" href="#/lesson/${esc(i.lesson)}">${D.icon('book', 16)}</a>` : ''}</td></tr>`;
      }).join('');
    };
    m.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => { kind = c.getAttribute('data-k'); draw(); }));
    draw();
  };

  // =========================================================
  // PRACTICE
  // =========================================================
  V.practice = () => {
    V.setTitle(T('practice.title'), { nav: 'practice' });
    const pool = Q.pool(), st = Q.stats(pool), rules = Q.examRules();
    const chs = C.chaptersOf().filter((c) => Q.pool({ chapters: [c.id] }).length);
    const el = html(`<header class="page-head"><h1>${esc(T('practice.title'))}</h1><p class="lead">${esc(T('practice.intro'))}</p>
      <p class="muted">${esc(T('practice.pool', { n: pool.length, lic: D.settings.licence }))}</p></header>
      <section class="modes">
        <button class="mode" data-act="exam">${D.icon('clock', 28)}<b>${esc(T('practice.exam'))}</b><small>${esc(T('practice.examDesc', { n: rules.questions, min: rules.minutes, err: rules.maxErrors }))}</small></button>
        <button class="mode" data-act="smart">${D.icon('bolt', 28)}<b>${esc(T('practice.smart'))}</b><small>${esc(T('practice.smartDesc'))}${st.due ? ` · ${st.due}` : ''}</small></button>
        <button class="mode" data-act="mistakes">${D.icon('flag', 28)}<b>${esc(T('practice.mistakes'))}</b><small>${esc(T('practice.mistakesDesc'))}${st.wrong ? ` · ${st.wrong}` : ''}</small></button>
        <button class="mode" data-act="signs">${D.icon('sign', 28)}<b>${esc(T('practice.signs'))}</b><small>${esc(T('practice.signsDesc'))}</small></button>
        <button class="mode" data-act="dash">${D.icon('gauge', 28)}<b>${esc(T('practice.dash'))}</b><small>${esc(T('practice.dashDesc'))}</small></button>
        <a class="mode" href="#/cards">${D.icon('dict', 28)}<b>${esc(T('practice.terms'))}</b><small>${esc(T('practice.termsDesc'))}</small></a>
      </section>
      <h2 class="sec">${esc(T('practice.topic'))}</h2>
      <p class="muted">${esc(T('practice.topicDesc'))}</p>
      <section class="topic-list">${chs.map((cm) => {
        const ch = C.chapter(cm.id) || {};
        const p = Q.pool({ chapters: [cm.id] }), s = Q.stats(p);
        return `<button class="topic" data-ch="${esc(cm.id)}" style="${hueStyle(cm.hue)}"><span class="chap-ico">${V.chapIcon(cm.icon, 24)}</span><span class="tt"><b>${esc(ch.title || cm.id)}</b><small>${s.mastered}/${p.length}</small>${progressBar(p.length ? s.mastered / p.length : 0)}</span></button>`;
      }).join('')}</section>`);
    const m = main(); m.replaceChildren(el);
    m.querySelectorAll('[data-act]').forEach((b) => b.addEventListener('click', () => V.startPractice(b.getAttribute('data-act'))));
    m.querySelectorAll('[data-ch]').forEach((b) => b.addEventListener('click', () => V.startPractice('topic', { chapters: [b.getAttribute('data-ch')] })));
  };

  V.startPractice = (mode, opts) => {
    opts = opts || {};
    let qs = [];
    if (mode === 'exam') {
      const ex = Q.buildExam();
      if (!ex.questions.length) return V.toast(T('practice.noDue'));
      Q.session('exam', ex.questions, ex.rules);
      return D.go('#/quiz');
    }
    if (mode === 'smart') qs = Q.smartSet(20);
    else if (mode === 'mistakes') { qs = Q.mistakeSet(30); if (!qs.length) return V.toast(T('practice.noMistakes')); }
    else if (mode === 'topic') qs = D.util.shuffle(Q.pool({ chapters: opts.chapters })).slice(0, opts.n || 20);
    else if (mode === 'lesson') qs = D.util.shuffle(Q.pool({ lesson: opts.lesson }));
    else if (mode === 'signs') {
      const f = opts.series ? (s) => String(s.series) === String(opts.series) : null;
      qs = D.util.shuffle(Q.signDrill(10, f).concat(Q.signReverseDrill(5, f)));
    }
    else if (mode === 'dash') qs = Q.dashDrill(12);
    if (!qs.length) return V.toast(T('practice.noDue'));
    Q.session(mode, qs, opts);
    D.go('#/quiz');
  };

  // an option: markup, or a sign drawing in the reverse sign drill
  const optHTML = (q, oi, size) => {
    if (q.optSigns) { const s = D.data.signByNum.get(String(q.options[oi])); return s ? D.signs.svg(s, { size: size || 84 }) : esc(q.options[oi]); }
    return M.inline(q.options[oi]);
  };

  // ---------- the quiz screen ----------
  let timer = null;
  V.quiz = () => {
    const s = Q.current;
    if (!s || s.done) return D.go('#/practice');
    V.setTitle(T(s.mode === 'exam' ? 'practice.exam' : 'practice.title'), { nav: 'practice', back: '#/practice' });
    const m = main();
    clearInterval(timer);
    const letters = T('quiz.optLetters');
    const draw = () => {
      const it = s.items[s.i];
      const q = it.q;
      const answered = it.chosen != null;
      const show = s.instant && answered;
      const qSign = q.sign && D.data.signByNum.get(String(q.sign));
      const qDash = q.dash && D.data.dashById.get(q.dash);
      const figHtml = q.fig ? M.render('[[fig:' + q.fig + ']]') : '';
      m.innerHTML = `<div class="quiz mode-${s.mode}">
        <div class="quiz-top">
          <span>${esc(T('quiz.question', { i: s.i + 1, n: s.items.length }))}</span>
          ${s.deadline ? `<span class="timer" id="qtimer">${D.icon('clock', 16)} <b></b></span>` : ''}
        </div>
        ${progressBar((s.i + (answered ? 1 : 0)) / s.items.length)}
        ${s.mode === 'exam' ? `<div class="qnav">${s.items.map((x, k) => `<button class="qdot${k === s.i ? ' cur' : ''}${x.chosen != null ? ' done' : ''}" data-go="${k}">${k + 1}</button>`).join('')}</div>` : ''}
        <div class="qcard">
          ${qSign ? `<div class="q-sign">${D.signs.svg(qSign, { size: 150 })}</div>` : ''}
          ${qDash ? `<div class="q-sign">${D.dash.svg(qDash, { size: 120 })}</div>` : ''}
          ${figHtml}
          <h2 class="q-text">${M.inline(q.q)}</h2>
          <div class="opts">${it.order.map((oi, k) => {
            let cls = 'opt';
            if (show) { if (oi === q.answer) cls += ' right'; else if (oi === it.chosen) cls += ' wrong'; else cls += ' dim'; }
            else if (!s.instant && oi === it.chosen) cls += ' picked';
            return `<button class="${cls}${q.optSigns ? ' opt-sign' : ''}" data-k="${k}" ${show ? 'disabled' : ''}><span class="ol">${esc(letters[k] || k + 1)}</span><span class="ot">${optHTML(q, oi)}</span></button>`;
          }).join('')}</div>
          ${show ? `<div class="feedback ${it.ok ? 'ok' : 'bad'}"><b>${esc(T(it.ok ? 'quiz.correct' : 'quiz.wrong'))}</b>
             ${q.explain ? `<div class="prose">${M.render(q.explain)}</div>` : ''}
             ${q.lesson && C.lesson(q.lesson) ? `<a class="xref" href="#/lesson/${esc(q.lesson)}">${D.icon('book', 16)} ${esc(T('quiz.toLesson'))}: ${plain(C.lesson(q.lesson).title)}</a>` : ''}
             ${q._link ? `<a class="xref" href="${esc(q._link)}">${D.icon('next', 16)}</a>` : ''}</div>` : ''}
        </div>
        <div class="quiz-actions">
          ${s.mode === 'exam'
            ? `${s.i > 0 ? `<button class="btn" data-prev>${D.icon('back', 16)}</button>` : ''}
               ${s.i < s.items.length - 1 ? `<button class="btn primary" data-next>${esc(T('quiz.next'))} ${D.icon('next', 16)}</button>` : ''}
               <button class="btn ${s.i === s.items.length - 1 ? 'primary' : ''}" data-submit>${esc(T('quiz.submit'))}</button>`
            : show ? `<button class="btn primary" data-next>${esc(s.i < s.items.length - 1 ? T('quiz.next') : T('quiz.finish'))} ${D.icon('next', 16)}</button>` : ''}
        </div></div>`;
      M.hydrate(m);
      m.querySelectorAll('.opt[data-k]').forEach((b) => b.addEventListener('click', () => {
        Q.answer(s, it, +b.getAttribute('data-k'));
        if (s.mode === 'exam') { draw(); }
        else draw();
      }));
      const nx = m.querySelector('[data-next]');
      if (nx) nx.addEventListener('click', () => { if (s.i < s.items.length - 1) { s.i++; draw(); } else finish(); });
      const pv = m.querySelector('[data-prev]'); if (pv) pv.addEventListener('click', () => { s.i--; draw(); });
      m.querySelectorAll('[data-go]').forEach((b) => b.addEventListener('click', () => { s.i = +b.getAttribute('data-go'); draw(); }));
      const sb = m.querySelector('[data-submit]');
      if (sb) sb.addEventListener('click', () => {
        const left = s.items.filter((x) => x.chosen == null).length;
        if (left && !confirm(T('quiz.submitConfirm', { n: left }))) return;
        finish();
      });
      tickTimer();
    };
    const finish = () => { clearInterval(timer); Q.finish(s); D.go('#/results'); };
    const tickTimer = () => {
      const el = document.getElementById('qtimer');
      if (!s.deadline || !el) return;
      const left = Math.max(0, s.deadline - Date.now());
      const mm = Math.floor(left / 60000), ss = Math.floor((left % 60000) / 1000);
      el.querySelector('b').textContent = `${mm}:${String(ss).padStart(2, '0')}`;
      el.classList.toggle('low', left < 5 * 60000);
      if (left <= 0) { V.toast(T('quiz.timeUp')); finish(); }
    };
    if (s.deadline) timer = setInterval(tickTimer, 1000);
    draw();
  };

  V.results = () => {
    const s = Q.current;
    if (!s || !s.done) return D.go('#/practice');
    V.setTitle(T('quiz.done'), { nav: 'practice', back: '#/practice' });
    const r = s.result;
    const letters = T('quiz.optLetters');
    const el = html(`<div class="results">
      <div class="res-head ${s.mode === 'exam' ? (r.passed ? 'ok' : 'bad') : ''}">
        ${s.mode === 'exam' ? `<h1>${esc(T(r.passed ? 'quiz.passed' : 'quiz.failed'))}</h1>` : `<h1>${esc(T('quiz.done'))}</h1>`}
        <div class="res-score">${esc(T('quiz.score', { c: r.correct, n: r.n }))}</div>
        ${s.mode === 'exam' ? `<p class="muted">${esc(T('quiz.passRule', { err: r.maxErrors }))}</p>` : ''}
        ${progressBar(r.n ? r.correct / r.n : 0)}
        <div class="actions"><button class="btn primary" data-again>${esc(T('quiz.again'))}</button><a class="btn" href="#/practice">${esc(T('practice.title'))}</a></div>
      </div>
      <h2 class="sec">${esc(T('quiz.review'))}</h2>
      <ol class="review">${s.items.map((it) => `<li class="${it.ok ? 'ok' : 'bad'}">
        <div class="rq">${it.q.sign && D.data.signByNum.get(String(it.q.sign)) ? `<span class="rs">${D.signs.svg(D.data.signByNum.get(String(it.q.sign)), { size: 40 })}</span>` : ''}${it.q.dash && D.data.dashById.get(it.q.dash) ? `<span class="rs">${D.dash.svg(D.data.dashById.get(it.q.dash), { size: 36 })}</span>` : ''}${M.inline(it.q.q)}</div>
        <div class="ra"><span>${esc(T('quiz.yourAnswer'))}:</span> ${it.chosen != null ? optHTML(it.q, it.chosen, 40) : `<i>${esc(T('quiz.noAnswer'))}</i>`}</div>
        ${!it.ok ? `<div class="ra right"><span>${esc(T('quiz.theAnswer'))}:</span> ${optHTML(it.q, it.q.answer, 40)}</div>` : ''}
        ${!it.ok && it.q.explain ? `<details><summary>${esc(T('quiz.explain'))}</summary><div class="prose">${M.render(it.q.explain)}</div>${it.q.lesson && C.lesson(it.q.lesson) ? `<a class="xref" href="#/lesson/${esc(it.q.lesson)}">${esc(T('quiz.toLesson'))}</a>` : ''}</details>` : ''}
      </li>`).join('')}</ol></div>`);
    const m = main(); m.replaceChildren(el);
    void letters;
    m.querySelector('[data-again]').addEventListener('click', () => {
      if (s.mode === 'exam') V.startPractice('exam');
      else { Q.session(s.mode, s.items.map((x) => x.q), s.opts); D.go('#/quiz'); }
    });
  };

  // ---------- term flashcards ----------
  V.cards = () => {
    V.setTitle(T('practice.terms'), { nav: 'practice', back: '#/practice' });
    const cats = [...new Set(D.data.glossary.map((t) => t.cat))];
    let cat = '', dirHeEn = true, deck = [], i = 0, flipped = false;
    const other = D.lang() === 'he' ? 'en' : 'he';
    const m = main();
    const deal = () => {
      const due = Q.progress().drills.term;
      deck = D.util.shuffle(D.data.glossary.filter((t) => !cat || t.cat === cat)).sort((a, b) => ((due[a.id] || { box: -1 }).box - (due[b.id] || { box: -1 }).box)).slice(0, 20);
      i = 0; flipped = false; draw();
    };
    const draw = () => {
      const t = deck[i];
      const front = t ? (dirHeEn ? C.termName(t, D.lang(), true) : (t.term[other] || '')) : '';
      const back = t ? (dirHeEn ? (t.term[other] || '') : C.termName(t, D.lang(), true)) : '';
      m.innerHTML = `<div class="cards-page">
        <div class="toolbar">
          <select class="sel" data-cat><option value="">${esc(T('gloss.all'))}</option>${cats.map((c) => `<option value="${esc(c)}"${c === cat ? ' selected' : ''}>${esc(catName(c))}</option>`).join('')}</select>
          <button class="btn small" data-dir>${esc(dirHeEn ? D.lang() + ' → ' + other : other + ' → ' + D.lang())}</button>
        </div>
        ${t ? `<div class="flash${flipped ? ' flipped' : ''}" tabindex="0" role="button" aria-label="${esc(T('quiz.flip'))}">
          <div class="flash-front"><div class="flash-term" ${!dirHeEn ? `dir="${D.config.languages[other].dir}" lang="${other}"` : ''}>${esc(front)}</div><small>${esc(catName(t.cat))}</small></div>
          <div class="flash-back"><div class="flash-term" ${dirHeEn ? `dir="${D.config.languages[other].dir}" lang="${other}"` : ''}>${esc(back)}</div>
            ${(t.alt && t.alt[D.lang()] && t.alt[D.lang()].length) ? `<div class="muted">${esc(T('gloss.alt'))}: ${esc(t.alt[D.lang()].join(', '))}</div>` : ''}
            <div class="flash-def">${M.inline(D.tr(t.def))}</div></div>
        </div>
        <div class="cards-meta">${i + 1} / ${deck.length}</div>
        <div class="actions">${flipped ? `<button class="btn bad" data-no>${esc(T('quiz.didntKnow'))}</button><button class="btn ok" data-yes>${esc(T('quiz.knew'))}</button>` : `<button class="btn primary" data-flip>${esc(T('quiz.flip'))}</button>`}</div>`
        : `<p class="empty">${esc(T('quiz.done'))}</p><div class="actions"><button class="btn primary" data-again>${esc(T('quiz.again'))}</button></div>`}
      </div>`;
      const fl = m.querySelector('.flash');
      const flip = () => { flipped = !flipped; draw(); };
      if (fl) { fl.addEventListener('click', flip); fl.addEventListener('keydown', (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(); } }); }
      const b = (sel, fn) => { const x = m.querySelector(sel); if (x) x.addEventListener('click', fn); };
      b('[data-flip]', flip);
      b('[data-yes]', () => { Q.recordDrill('term', t.id, true); i++; flipped = false; draw(); });
      b('[data-no]', () => { Q.recordDrill('term', t.id, false); deck.push(t); i++; flipped = false; draw(); });
      b('[data-again]', deal);
      b('[data-dir]', () => { dirHeEn = !dirHeEn; flipped = false; draw(); });
      const sc = m.querySelector('[data-cat]'); if (sc) sc.addEventListener('change', (e) => { cat = e.target.value; deal(); });
    };
    deal();
  };

  // =========================================================
  // GLOSSARY
  // =========================================================
  const catName = (c) => { const g = (D.data.glossaryCats || {})[c]; return g ? D.tr(g) : c; };
  V.glossary = () => {
    V.setTitle(T('gloss.title'), { nav: 'glossary' });
    const cats = [...new Set(D.data.glossary.map((t) => t.cat))];
    let cat = '', q = '';
    const el = html(`<header class="page-head"><h1>${esc(T('gloss.title'))}</h1><p class="lead">${esc(T('gloss.intro'))}</p></header>
      <div class="toolbar"><input type="search" class="search-in" placeholder="${esc(T('gloss.search'))}" aria-label="${esc(T('gloss.search'))}">
      <select class="sel" aria-label="category"><option value="">${esc(T('gloss.all'))}</option>${cats.map((c) => `<option value="${esc(c)}">${esc(catName(c))}</option>`).join('')}</select></div>
      <p class="muted count"></p><ul class="gloss-list"></ul>`);
    const m = main(); m.replaceChildren(el);
    const list = m.querySelector('.gloss-list'), cnt = m.querySelector('.count');
    const other = D.lang() === 'he' ? 'en' : 'he';
    const draw = () => {
      const nq = C.norm(q);
      const items = D.data.glossary.filter((t) => (!cat || t.cat === cat) && (!nq || C.norm(Object.values(t.term || {}).join(' ') + ' ' + Object.values(t.alt || {}).flat().join(' ')).includes(nq)))
        .sort((a, b) => C.termName(a).localeCompare(C.termName(b), D.locale()));
      cnt.textContent = T('gloss.count', { n: items.length });
      list.innerHTML = items.slice(0, 400).map((t) => `<li><a href="#/term/${esc(t.id)}" class="${C.termMissing(t) ? 'missing' : ''}">
        <b>${esc(C.termName(t, D.lang(), D.settings.niqqud))}</b>
        <span class="g-other" lang="${other}" dir="${D.config.languages[other].dir}">${esc((t.term || {})[other] || '')}</span>
        ${(t.alt && t.alt[D.lang()] || []).length ? `<small class="g-alt">${esc(t.alt[D.lang()].join(' · '))}</small>` : ''}</a></li>`).join('');
    };
    m.querySelector('.search-in').addEventListener('input', (e) => { q = e.target.value; draw(); });
    m.querySelector('.sel').addEventListener('change', (e) => { cat = e.target.value; draw(); });
    draw();
  };

  V.term = ({ id }) => {
    const t = D.data.termById.get(id);
    if (!t) return V.notFound();
    V.setTitle(C.termName(t), { nav: 'glossary', back: '#/glossary' });
    const other = D.lang() === 'he' ? 'en' : 'he';
    const lessons = [...new Set((C.usage().term.get(id) || []).filter((w) => w.type === 'lesson').map((w) => w.id))].map((x) => C.lesson(x)).filter(Boolean);
    const alts = (t.alt && t.alt[D.lang()]) || [];
    const el = html(`<article class="term-page">
      <div class="crumbs">${esc(catName(t.cat))}</div>
      <h1 class="term-big">${esc(C.termName(t))}</h1>
      ${t.niqqud && t.niqqud[D.lang()] ? `<p class="niqqud">${esc(t.niqqud[D.lang()])}</p>` : ''}
      ${C.termMissing(t) ? `<p class="note warn">${esc(T('gloss.noHebrew'))}</p>` : ''}
      <p class="term-other" lang="${other}" dir="${D.config.languages[other].dir}">${esc((t.term || {})[other] || '')}${t.alt && t.alt[other] && t.alt[other].length ? ` <small>(${esc(t.alt[other].join(', '))})</small>` : ''}</p>
      ${alts.length ? `<p><span class="muted">${esc(T('gloss.alt'))}:</span> ${alts.map((a) => pill(a, t.jargon && t.jargon.includes(a) ? 'jargon' : '')).join(' ')}</p>` : ''}
      ${t.usage && t.usage[D.lang()] ? `<p>${pill(T(t.usage[D.lang()] === 'jargon' ? 'gloss.jargon' : 'gloss.official'), 'usage')}</p>` : ''}
      <div class="prose">${M.render(D.tr(t.def))}</div>
      ${t.def && t.def[other] ? `<div class="prose other-def" lang="${other}" dir="${D.config.languages[other].dir}">${M.render(t.def[other])}</div>` : ''}
      ${t.note && D.tr(t.note) ? `<aside class="callout callout-note"><div class="callout-head"><span class="callout-icon">i</span>${esc(D.tr(M.CALLOUT.note))}</div><div class="callout-body">${M.render(D.tr(t.note))}</div></aside>` : ''}
      ${t.law ? `<p><span class="muted">${esc(T('gloss.law'))}:</span> ${esc(D.tr(t.law))}</p>` : ''}
      ${(t.see || []).filter((s) => D.data.termById.has(s)).length ? `<h3>${esc(T('gloss.see'))}</h3><div class="term-cloud">${t.see.filter((s) => D.data.termById.has(s)).map((s) => `<a class="term-link" href="#/term/${esc(s)}">${esc(C.termName(D.data.termById.get(s)))}</a>`).join('')}</div>` : ''}
      ${lessons.length ? `<h3>${esc(T('gloss.lessons'))}</h3><ul class="link-list">${lessons.map((l) => `<li><a href="#/lesson/${esc(l.id)}">${plain(l.title)}</a></li>`).join('')}</ul>` : ''}
    </article>`);
    main().replaceChildren(el);
  };

  // =========================================================
  // SEARCH
  // =========================================================
  V.search = (params, query) => {
    V.setTitle(T('search.title'), { nav: '' });
    const el = html(`<div class="search-page"><input type="search" class="search-in big" placeholder="${esc(T('search.placeholder'))}" aria-label="${esc(T('search.placeholder'))}" value="${esc(query.q || '')}"><div class="search-res"></div></div>`);
    const m = main(); m.replaceChildren(el);
    const inp = m.querySelector('input'), res = m.querySelector('.search-res');
    const link = { lesson: (id) => '#/lesson/' + id, sign: (id) => '#/sign/' + id, term: (id) => '#/term/' + id, tree: (id) => '#/trouble/' + id, dash: (id) => '#/vehicle/dash/' + id };
    const ico = (it) => it.kind === 'sign' ? D.signs.svg(D.data.signByNum.get(it.id), { size: 32 }) : it.kind === 'dash' ? D.dash.svg(D.data.dashById.get(it.id), { size: 30 }) : D.icon({ lesson: 'book', term: 'dict', tree: 'tree' }[it.kind], 22);
    const draw = () => {
      const r = C.search(inp.value);
      history.replaceState(null, '', '#/search?q=' + encodeURIComponent(inp.value));
      if (!inp.value.trim()) { res.innerHTML = ''; return; }
      if (!r.length) { res.innerHTML = `<p class="empty">${esc(T('search.none'))}</p>`; return; }
      const groups = ['lesson', 'sign', 'term', 'tree', 'dash'];
      res.innerHTML = groups.map((g) => { const xs = r.filter((x) => x.kind === g); return xs.length ? `<h3>${esc(T('search.' + g + 's'))}</h3><ul class="res-list">${xs.map((x) => `<li><a href="${link[g](x.id)}"><span class="ri">${ico(x)}</span><span><b>${plain(x.title)}</b>${x.sub ? `<small>${plain(x.sub)}</small>` : ''}</span></a></li>`).join('')}</ul>` : ''; }).join('');
    };
    inp.addEventListener('input', draw);
    draw();
    setTimeout(() => inp.focus(), 50);
  };

  // =========================================================
  // UPDATES
  // =========================================================
  V.updates = () => {
    V.setTitle(T('upd.title'), { nav: 'updates' });
    const mf = D.data.manifest, pack = D.data.pack;
    const U = D.update;
    const diff = U.state.lastDiff;
    const upcoming = [...D.data.facts.values()].map((f) => ({ f, nx: C.nextChange(f) })).filter((x) => x.nx);
    const originTxt = pack.draft ? T('upd.draft') : pack.origin === 'downloaded' ? T('upd.downloaded') : T('upd.bundled');
    const el = html(`<header class="page-head"><h1>${esc(T('upd.title'))}</h1><p class="lead">${esc(T('upd.intro'))}</p></header>
      <section class="card upd-card">
        <dl class="kv">
          <dt>${esc(T('set.jurisdiction'))}</dt><dd>${esc(D.tr(mf.name || D.config.jurisdictions[D.data.jur].name))}${mf.authority ? ` · ${esc(D.tr(mf.authority))}` : ''}</dd>
          <dt>${esc(T('upd.version'))}</dt><dd><b>${esc(mf.version)}</b></dd>
          <dt>${esc(T('upd.published'))}</dt><dd>${esc(D.fmtDate(mf.published))}</dd>
          <dt>${esc(T('upd.source'))}</dt><dd>${esc(originTxt)}</dd>
          <dt>${esc(T('upd.lastCheck'))}</dt><dd>${esc(U.state.lastCheck ? D.fmtDate(U.state.lastCheck, { dateStyle: 'medium', timeStyle: 'short' }) : T('upd.never'))}</dd>
        </dl>
        <div class="actions">
          <button class="btn primary" data-check>${D.icon('update', 18)} ${esc(T('upd.check'))}</button>
          <label class="btn">${D.icon('upload', 18)} ${esc(T('upd.loadFile'))}<input type="file" accept=".json,application/json" hidden data-file></label>
          ${pack.origin === 'downloaded' ? `<button class="btn" data-revert>${esc(T('upd.revert'))}</button>` : ''}
        </div>
        <p class="upd-msg" role="status"></p>
      </section>
      ${upcoming.length ? `<h2 class="sec">${esc(T('upd.changelog'))} — ${esc(T('common.new'))}</h2><ul class="changes">${upcoming.map(({ f, nx }) => `<li>${D.icon('calendar', 18)}<span><b>${esc(D.tr(f.label))}</b> — ${esc(T('upd.scheduled', { d: D.fmtDate(nx.from), v: C.fmtValue(nx.value, f.unit) }))}</span></li>`).join('')}</ul>` : ''}
      ${diff && (diff.facts.length || diff.offences.length || diff.signs.added.length || diff.signs.changed.length || diff.lessons.added || diff.lessons.changed || diff.questions.added || diff.questions.changed) ? `<h2 class="sec">${esc(T('upd.changelog'))}: ${esc(diff.from || '')} → ${esc(diff.to)}</h2>
        <ul class="changes">
          ${diff.facts.map((x) => `<li>${D.icon('law', 18)}<span><b>${esc(D.tr(x.label))}</b> — ${x.added ? esc(C.fmtValue(x.new, x.unit)) : esc(T('upd.changedFrom', { old: C.fmtValue(x.old, x.unit), new: C.fmtValue(x.new, x.unit) }))}</span></li>`).join('')}
          ${diff.offences.map((x) => `<li>${D.icon('coin', 18)}<span><b>${esc(D.tr(x.title))}</b> — ${x.added ? esc(C.fmtValue(x.fine, 'ils')) : esc(T('upd.changedFrom', { old: C.fmtValue(x.oldFine, 'ils') + ' / ' + (x.oldPoints ?? '—'), new: C.fmtValue(x.fine, 'ils') + ' / ' + (x.points ?? '—') }))}</span></li>`).join('')}
          ${diff.signs.added.length ? `<li>${D.icon('sign', 18)}<span>${esc(T('common.new'))}: ${diff.signs.added.map((n) => M.inline('[[sign:' + n + '|icon]]') + ' ' + esc(n)).join(' ')}</span></li>` : ''}
          ${diff.signs.changed.length ? `<li>${D.icon('sign', 18)}<span>${diff.signs.changed.map((n) => M.inline('[[sign:' + n + '|icon]]') + ' ' + esc(n)).join(' ')}</span></li>` : ''}
          ${diff.lessons.added + diff.lessons.changed ? `<li>${D.icon('book', 18)}<span>${diff.lessons.added} + ${diff.lessons.changed} ${esc(T('learn.lessons'))}</span></li>` : ''}
          ${diff.questions.added + diff.questions.changed ? `<li>${D.icon('quiz', 18)}<span>${diff.questions.added} + ${diff.questions.changed} ${esc(T('learn.questions'))}</span></li>` : ''}
        </ul>` : ''}
      ${(D.data.notices || []).length ? `<h2 class="sec">${esc(T('upd.notices'))}</h2>${D.data.notices.map((n) => `<article class="notice-full sev-${esc(n.severity || 'info')}"><header><b>${esc(D.tr(n.title))}</b><span class="muted">${esc(D.fmtDate(n.date))}${n.effective ? ' · ' + esc(T('upd.effective', { d: D.fmtDate(n.effective) })) : ''}</span></header><div class="prose">${M.render(D.tr(n.body))}</div></article>`).join('')}` : ''}
      ${(D.data.changelog || []).length ? `<h2 class="sec">${esc(T('upd.changelog'))}</h2><ul class="changelog">${D.data.changelog.map((v) => `<li><b>${esc(v.version)}</b> <span class="muted">${esc(D.fmtDate(v.date))}</span><div class="prose">${M.render(D.tr(v.notes))}</div></li>`).join('')}</ul>` : ''}`);
    const m = main(); m.replaceChildren(el);
    M.hydrate(m);
    const msg = m.querySelector('.upd-msg');
    const say = (t, cls) => { msg.textContent = t; msg.className = 'upd-msg ' + (cls || ''); };
    m.querySelector('[data-check]').addEventListener('click', async () => {
      say(T('upd.checking'));
      try {
        const r = await U.check();
        if (r.noServer) return say(T('upd.noServer'));
        if (!r.available) return say(T('upd.upToDate'), 'ok');
        say(T('upd.available', { v: r.manifest.version }));
        const b = h('button', { class: 'btn primary small' }, T('upd.install'));
        b.addEventListener('click', async () => { try { await U.installFrom(r); V.toast(T('upd.installed')); V.rerender(); } catch (e) { say(T('upd.failed', { e: e.message }), 'bad'); } });
        msg.append(' ', b);
      } catch (e) { say(T('upd.failed', { e: e.message }), 'bad'); }
    });
    m.querySelector('[data-file]').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { await U.installFile(f); V.toast(T('upd.installed')); V.rerender(); }
      catch (err) { say(T('upd.failed', { e: err.message }), 'bad'); }
    });
    const rv = m.querySelector('[data-revert]');
    if (rv) rv.addEventListener('click', async () => { await U.revert(); V.rerender(); });
  };

  // =========================================================
  // SETTINGS
  // =========================================================
  V.settings = () => {
    V.setTitle(T('set.title'), { nav: 'settings' });
    const S = D.settings;
    const langs = (D.data.manifest.languages || Object.keys(D.config.languages)).filter((l) => D.config.languages[l]);
    const lic = D.data.licences.classes || [];
    const el = html(`<header class="page-head"><h1>${esc(T('set.title'))}</h1></header>
      <section class="settings">
        <label class="set-row"><span>${esc(T('set.language'))}</span><select data-k="lang">${langs.map((l) => `<option value="${l}"${l === D.lang() ? ' selected' : ''}>${esc(D.config.languages[l].name)}</option>`).join('')}</select></label>
        <label class="set-row"><span>${esc(T('set.licence'))}</span><select data-k="licence">${lic.map((c) => `<option value="${esc(c.id)}"${c.id === S.licence ? ' selected' : ''}>${esc(D.tr(c.name))}</option>`).join('')}</select></label>
        <label class="set-row"><span>${esc(T('set.jurisdiction'))}</span><select data-k="jurisdiction">${Object.keys(D.config.jurisdictions).map((j) => `<option value="${j}"${j === D.data.jur ? ' selected' : ''}>${esc(D.tr(D.config.jurisdictions[j].name))}</option>`).join('')}</select></label>
        <label class="set-row"><span>${esc(T('set.theme'))}</span><select data-k="theme">${['auto', 'light', 'dark'].map((t) => `<option value="${t}"${t === S.theme ? ' selected' : ''}>${esc(T('set.theme.' + t))}</option>`).join('')}</select></label>
        <label class="set-row"><span>${esc(T('set.font'))}</span><input type="range" min="0.9" max="1.4" step="0.05" value="${S.fontScale}" data-k="fontScale"></label>
        <label class="set-row check"><input type="checkbox" data-k="showEnglishTerms"${S.showEnglishTerms ? ' checked' : ''}><span>${esc(T('set.englishTerms'))}</span></label>
        <label class="set-row check"><input type="checkbox" data-k="niqqud"${S.niqqud ? ' checked' : ''}><span>${esc(T('set.niqqud'))}</span></label>
        <label class="set-row check"><input type="checkbox" data-k="examTimer"${S.examTimer ? ' checked' : ''}><span>${esc(T('set.examTimer'))}</span></label>
        <label class="set-row check"><input type="checkbox" data-k="autoUpdate"${S.autoUpdate ? ' checked' : ''}><span>${esc(T('set.autoUpdate'))}</span></label>
      </section>
      <h2 class="sec">${esc(T('set.progress'))}</h2>
      <div class="actions">
        <button class="btn" data-export>${D.icon('download', 18)} ${esc(T('set.export'))}</button>
        <label class="btn">${D.icon('upload', 18)} ${esc(T('set.import'))}<input type="file" accept=".json" hidden data-import></label>
        <button class="btn bad" data-reset>${D.icon('trash', 18)} ${esc(T('set.reset'))}</button>
      </div>
      <h2 class="sec">${esc(T('set.about'))}</h2>
      <p class="muted">${esc(T('set.aboutText'))}</p>
      <p class="muted">${esc(D.config.app)} ${esc(D.config.appVersion)} · ${esc(T('upd.version'))} ${esc(D.data.manifest.version)}</p>
      <label class="set-row check editor-toggle"><input type="checkbox" data-k="editor"${S.editor ? ' checked' : ''}><span>${esc(T('set.editor'))}</span></label>
      ${S.editor ? `<p><a class="btn" href="#/editor">${D.icon('edit', 18)} ${esc(T('nav.editor'))}</a></p>` : ''}`);
    const m = main(); m.replaceChildren(el);
    m.querySelectorAll('[data-k]').forEach((inp) => inp.addEventListener('change', async () => {
      const k = inp.getAttribute('data-k');
      const v = inp.type === 'checkbox' ? inp.checked : inp.type === 'range' ? +inp.value : inp.value;
      D.setSetting(k, v);
      if (k === 'jurisdiction' || k === 'editor') { await D.content.load(D.settings.jurisdiction); }
      D.app.applySettings();
      V.rerender();
    }));
    m.querySelector('[data-export]').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify({ app: D.config.app, jur: D.data.jur, date: new Date().toISOString(), progress: Q.progress(), settings: D.settings }, null, 1)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: 'hyper-driving-progress.json' });
      document.body.appendChild(a); a.click(); a.remove();
    });
    m.querySelector('[data-import]').addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      try { const j = JSON.parse(await f.text()); if (j.progress) Q.replace(j.progress); V.toast('✓'); V.rerender(); } catch (err) { V.toast(T('common.error') + ': ' + err.message); }
    });
    m.querySelector('[data-reset]').addEventListener('click', () => { if (confirm(T('set.resetConfirm'))) { Q.reset(); V.rerender(); } });
  };

  V.notFound = () => {
    V.setTitle(T('err.route'), { back: '#/' });
    main().innerHTML = `<p class="empty">${esc(T('err.route'))}</p><p><a class="btn" href="#/">${esc(T('nav.home'))}</a></p>`;
  };

  // ---------- pop-up cards: terms and facts ----------
  V.closePop = () => { const p = document.getElementById('pop'); if (p) { p.hidden = true; p.innerHTML = ''; } };
  V.termPop = (id, anchor) => {
    const t = D.data.termById.get(id); if (!t) return;
    const other = D.lang() === 'he' ? 'en' : 'he';
    const alts = (t.alt && t.alt[D.lang()]) || [];
    V.pop(`<div class="pop-term">
      <div class="pop-h"><b class="term-big">${esc(C.termName(t))}</b>${t.niqqud && t.niqqud[D.lang()] ? `<span class="niqqud">${esc(t.niqqud[D.lang()])}</span>` : ''}</div>
      <div class="term-other" lang="${other}" dir="${D.config.languages[other].dir}">${esc((t.term || {})[other] || '')}</div>
      ${C.termMissing(t) ? `<p class="note warn">${esc(T('gloss.noHebrew'))}</p>` : ''}
      ${alts.length ? `<div class="muted">${esc(T('gloss.alt'))}: ${esc(alts.join(' · '))}</div>` : ''}
      <div class="prose">${M.render(D.tr(t.def))}</div>
      <a class="xref" href="#/term/${esc(id)}">${esc(T('gloss.title'))} ${D.icon('next', 14)}</a></div>`, anchor);
  };
  V.factPop = (id, anchor) => {
    const f = D.fact(id); if (!f) return;
    const nx = C.nextChange(f);
    V.pop(`<div class="pop-fact"><div class="pop-h">${D.icon('law', 18)} <b>${esc(D.tr(f.label))}</b></div>
      <div class="fact-big">${esc(C.fmtValue(C.factValue(f), f.unit))}</div>
      ${nx ? `<p class="note">${esc(T('upd.scheduled', { d: D.fmtDate(nx.from), v: C.fmtValue(nx.value, f.unit) }))}</p>` : ''}
      ${f.source ? `<p class="muted">${esc(D.tr(f.source.title))}${f.source.clause ? ', ' + esc(f.source.clause) : ''}</p>` : ''}</div>`, anchor);
  };
  V.pop = (inner, anchor) => {
    const p = document.getElementById('pop');
    p.innerHTML = `<div class="pop-card" role="dialog">${inner}<button class="pop-x" aria-label="${esc(T('common.close'))}">${D.icon('close', 18)}</button></div>`;
    p.hidden = false;
    const card = p.firstElementChild;
    if (anchor && window.innerWidth > 700) {
      const r = anchor.getBoundingClientRect();
      const top = Math.min(window.innerHeight - 40, r.bottom + 8);
      card.style.position = 'fixed';
      card.style.top = top + 'px';
      const w = Math.min(380, window.innerWidth - 24);
      card.style.width = w + 'px';
      let left = D.dir() === 'rtl' ? r.right - w : r.left;
      left = Math.max(12, Math.min(window.innerWidth - w - 12, left));
      card.style.left = left + 'px';
      requestAnimationFrame(() => { const cr = card.getBoundingClientRect(); if (cr.bottom > window.innerHeight - 8) card.style.top = Math.max(8, r.top - cr.height - 8) + 'px'; });
    }
    card.querySelector('.pop-x').addEventListener('click', V.closePop);
  };

  V.toast = (msg) => {
    const t = h('div', { class: 'toast', role: 'status' }, msg);
    document.body.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  };

  V.rerender = () => D.emit('route');
})(globalThis.Drive = globalThis.Drive || {});
