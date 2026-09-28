/* Hyper Driving · app.js — start-up: the page shell, routes, settings applied
 * to the document (language, direction, theme, text size), global clicks on
 * terms and facts, offline support and the update check.
 */
(function (D) {
  'use strict';
  const { h, esc } = D.util;
  const V = D.views;
  const A = D.app = {};

  const NAV = [
    ['home', '#/', 'home', 'nav.home'],
    ['learn', '#/learn', 'book', 'nav.learn'],
    ['signs', '#/signs', 'sign', 'nav.signs'],
    ['vehicle', '#/vehicle', 'car', 'nav.vehicle'],
    ['practice', '#/practice', 'quiz', 'nav.practice'],
    ['glossary', '#/glossary', 'dict', 'nav.glossary']
  ];

  A.applySettings = () => {
    const root = document.documentElement;
    const l = D.lang();
    root.lang = l;
    root.dir = D.dir();
    const t = D.settings.theme || 'auto';
    root.dataset.theme = t === 'auto' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : t;
    root.style.setProperty('--fs', String(D.settings.fontScale || 1));
    A.shell();
  };

  // the frame around every screen; rebuilt when the language changes
  A.shell = () => {
    const app = document.getElementById('app');
    const T = D.t;
    const navLinks = (cls) => NAV.map(([k, href, ico, lab]) => `<a class="${cls}" href="${href}" data-nav="${k}">${D.icon(ico, 22)}<span>${esc(T(lab))}</span></a>`).join('');
    app.innerHTML = `
      <header class="top">
        <button id="top-back" class="icon-btn" hidden aria-label="${esc(T('nav.back'))}">${D.icon('back')}</button>
        <a class="brand" href="#/" aria-label="${esc(D.config.app)}">
          <svg class="logo" viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 29 26H3z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/><path d="M16 12v6M16 21.5v.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>
          <span class="brand-name">${esc(D.config.app)}</span></a>
        <div id="top-title" class="top-title"></div>
        <div class="top-actions">
          <a class="icon-btn" href="#/search" aria-label="${esc(T('nav.search'))}" title="${esc(T('nav.search'))}">${D.icon('search')}</a>
          <a class="icon-btn" href="#/updates" data-nav="updates" aria-label="${esc(T('nav.updates'))}" title="${esc(T('nav.updates'))}">${D.icon('update')}<i class="badge" id="upd-badge" hidden></i></a>
          ${D.settings.editor ? `<a class="icon-btn" href="#/editor" data-nav="editor" aria-label="${esc(T('nav.editor'))}" title="${esc(T('nav.editor'))}">${D.icon('edit')}</a>` : ''}
          <a class="icon-btn" href="#/settings" data-nav="settings" aria-label="${esc(T('nav.settings'))}" title="${esc(T('nav.settings'))}">${D.icon('settings')}</a>
        </div>
      </header>
      <nav class="rail" aria-label="${esc(T('nav.menu'))}">${navLinks('rail-link')}</nav>
      <main id="main" tabindex="-1"></main>
      <nav class="tabbar" aria-label="${esc(T('nav.menu'))}">${navLinks('tab-link')}</nav>
      <div id="pop" hidden></div>
      <div id="offline" class="offline" hidden>${esc(T('offline'))}</div>`;
    document.getElementById('top-back').addEventListener('click', () => {
      if (V._back) D.go(V._back); else history.back();
    });
    if (D.update && D.update.pending) document.getElementById('upd-badge').hidden = false;
  };

  // ---------- routes ----------
  D.route('', V.home);
  D.route('learn', V.learn);
  D.route('chapter/:id', V.chapter);
  D.route('lesson/:id', V.lesson);
  D.route('signs', V.signs);
  D.route('signs/:series', V.signs);
  D.route('sign/:num', V.sign);
  D.route('vehicle', V.vehicle);
  D.route('vehicle/dash', V.dashList);
  D.route('vehicle/dash/:id', V.dashOne);
  D.route('vehicle/trouble', V.troubleList);
  D.route('vehicle/maintenance', V.maintenance);
  D.route('trouble/:id', V.trouble);
  D.route('tool/:name', V.tool);
  D.route('practice', V.practice);
  D.route('quiz', V.quiz);
  D.route('results', V.results);
  D.route('cards', V.cards);
  D.route('glossary', V.glossary);
  D.route('term/:id', V.term);
  D.route('search', V.search);
  D.route('updates', V.updates);
  D.route('settings', V.settings);

  let lastHash = null;
  A.render = () => {
    V.closePop();
    const hash = location.hash || '#/';
    const r = D.resolveRoute(hash);
    const m = document.getElementById('main');
    if (!m) return;
    try {
      if (!r) V.notFound();
      else r.fn(r.params, r.query);
    } catch (e) {
      console.error(e);
      m.innerHTML = `<div class="empty"><p>${esc(D.t('common.error'))}</p><pre class="err">${esc(e.stack || e.message)}</pre></div>`;
    }
    if (hash !== lastHash) { window.scrollTo(0, 0); lastHash = hash; }
  };
  D.on('route', A.render);

  // ---------- start ----------
  A.start = async () => {
    D.util.h = h;
    // the pack decides the default language, so read it before the first paint
    try { await D.content.load(D.settings.jurisdiction || D.config.defaultJurisdiction); }
    catch (e) {
      console.error(e);
      document.getElementById('app').innerHTML = `<div class="fatal"><h1>${esc(D.config.app)}</h1><p>${esc(D.t('err.load'))}</p><pre>${esc(e.message)}</pre></div>`;
      return;
    }
    A.applySettings();
    A.render();
    window.addEventListener('hashchange', A.render);

    // global clicks: term chips and law values open a card; clicks outside close it
    document.addEventListener('click', (e) => {
      const term = e.target.closest('.term[data-term]');
      if (term) { e.preventDefault(); V.termPop(term.getAttribute('data-term'), term); return; }
      const fact = e.target.closest('.fact[data-fact]');
      if (fact) { e.preventDefault(); V.factPop(fact.getAttribute('data-fact'), fact); return; }
      const pop = document.getElementById('pop');
      if (pop && !pop.hidden && !e.target.closest('.pop-card')) V.closePop();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') V.closePop(); });
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => { if (D.settings.theme === 'auto') A.applySettings(), A.render(); });

    const off = () => { const o = document.getElementById('offline'); if (o) o.hidden = navigator.onLine; };
    window.addEventListener('online', off); window.addEventListener('offline', off); off();

    D.on('settings', (e) => { if (e.key === 'lang') { A.applySettings(); } });
    D.on('update-available', () => { const b = document.getElementById('upd-badge'); if (b) b.hidden = false; });
    D.on('updated', () => { A.shell(); });

    // offline: a service worker keeps the app and its bundled pack (not inside
    // native wrappers, which serve the files locally anyway)
    if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !/[?&]nosw\b/.test(location.search)) {
      navigator.serviceWorker.register('sw.js').catch(() => { /* offline support is optional */ });
    }
    D.update.autoCheck();
  };
})(globalThis.Drive = globalThis.Drive || {});
