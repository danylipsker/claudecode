/* HYPER-CORE · ui/concept.js
 *
 * A concept's page:  map · understand · formulas · simulation · examples · practice · connections
 * A topic or branch page is the same page with its contents laid out as cards.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;

  function crumbs(n) {
    const parts = n.path.slice(0, -1).map(id => {
      const p = H.nodes.get(id);
      return '<a href="' + (p.kind === 'root' ? '#/' : '#/c/' + id) + '">' + esc(p.kind === 'root' ? H.discipline.short : p.title) + '</a>';
    });
    return '<nav class="crumbs" aria-label="Breadcrumb"><a href="#/">' + H.icon('home', 13) + '</a><span class="sep">›</span>' + parts.join('<span class="sep">›</span>') + '</nav>';
  }

  function linkCard(ref) {
    const r = H.ref(ref);
    if (r.local) {
      const n = H.nodes.get(r.id);
      if (!n) return '';
      return '<a class="lcard" href="#/c/' + n.id + '" style="--h:' + n.hue + '" data-ref="' + n.id + '"><span class="mdot m' + H.store.mastery(n.id) + '" data-md="' + n.id + '"></span><div><div class="lt">' + esc(n.title) + '</div><div class="ls">' + H.inline(n.short || '') + '</div></div></a>';
    }
    const d = H.DISCIPLINES[r.disc];
    const c = H.catalogs[r.disc] && H.catalogs[r.disc].get(r.id);
    return '<a class="lcard" href="' + esc(H.href(ref)) + '" style="--h:' + (d ? d.hue : 0) + '" data-ref="' + esc(ref) + '"><span class="mdot" style="border-style:dashed"></span><div><div class="xd" style="color:var(--bc)">' + esc(d ? d.title : r.disc) + '</div><div class="lt">' + esc(H.titleOf(ref)) + '</div>' + (c && c.short ? '<div class="ls">' + H.inline(c.short) + '</div>' : '') + '</div></a>';
  }

  /* concepts in the other disciplines that build on this one */
  function usedInCols(id) {
    const by = {};
    for (const ref of H.usedIn(id)) { const d = ref.split(':')[0]; (by[d] = by[d] || []).push(ref); }
    return Object.entries(by).map(([d, refs]) => {
      const D = H.DISCIPLINES[d];
      const shown = refs.slice(0, 10);
      return '<div class="lcol"><h3>Used in ' + esc(D ? D.title : d) + '</h3>' + shown.map(linkCard).join('') +
        (refs.length > shown.length ? '<div class="small faint">and ' + (refs.length - shown.length) + ' more</div>' : '') + '</div>';
    }).join('');
  }

  function pitfall(p) {
    if (typeof p === 'string') {
      const m = /^(.*?)\s+(?:—|--|->|→)\s+(.*)$/.exec(p);
      if (m) return '<li><span class="wrong">' + H.inline(m[1]) + '</span><br>' + H.inline(m[2]) + '</li>';
      return '<li>' + H.inline(p) + '</li>';
    }
    return '<li><span class="wrong">' + H.inline(p.wrong) + '</span><br>' + H.inline(p.right) + '</li>';
  }

  /* worked example: the steps come one at a time */
  function exampleCard(ex, i) {
    const card = ui.el('<div class="card excard"></div>');
    const steps = ex.steps || [];
    card.innerHTML = '<h3><span class="num">Example ' + (i + 1) + '</span>' + H.inline(ex.title || '') + '</h3>' +
      '<div class="q">' + H.text(ex.q) + '</div><ol class="steps"></ol><div class="ans"></div>' +
      '<div class="btnrow"><button class="btn sm pri" data-a="next">' + (steps.length ? 'Show the first step' : 'Show the answer') + '</button>' +
      (steps.length > 1 ? '<button class="btn sm ghost" data-a="all">Show everything</button>' : '') + '</div>';
    let k = 0;
    const ol = card.querySelector('.steps'), ans = card.querySelector('.ans'), next = card.querySelector('[data-a=next]'), all = card.querySelector('[data-a=all]');
    const stepHtml = s => typeof s === 'string' ? H.text(s) : (s.text ? H.text(s.text) : '') + (s.tex ? '<div class="stex">' + H.texSafe(s.tex, true) + '</div>' : '');
    const show = () => {
      if (k < steps.length) {
        ol.insertAdjacentHTML('beforeend', '<li>' + stepHtml(steps[k]) + '</li>');
        k++;
        next.textContent = k < steps.length ? 'Next step' : 'Show the answer';
      } else {
        if (ex.a) ans.innerHTML = '<div class="answer">' + H.inline(ex.a) + '</div>';
        next.remove(); if (all) all.remove();
      }
    };
    next.onclick = show;
    if (all) all.onclick = () => { while (card.contains(next)) show(); };
    return card;
  }

  function derivation(d) {
    const steps = d.steps || [];
    return '<details class="deriv"><summary>' + esc(d.title || 'Where it comes from') + '</summary><div class="dbody">' +
      (d.intro ? '<div class="prose">' + H.text(d.intro) + '</div>' : '') +
      '<ol class="steps">' + steps.map(s => '<li>' + (typeof s === 'string' ? H.text(s) : (s.text ? H.text(s.text) : '') + (s.tex ? '<div class="stex">' + H.texSafe(s.tex, true) + '</div>' : '')) + '</li>').join('') + '</ol>' +
      (d.outro ? '<div class="prose">' + H.text(d.outro) + '</div>' : '') + '</div></details>';
  }

  function kidCard(id) {
    const n = H.nodes.get(id);
    const isC = n.kind === 'concept';
    const p = isC ? null : H.progressOf(id);
    const nf = isC ? n.formulas.length : H.conceptsUnder(id).reduce((a, x) => a + H.nodes.get(x).formulas.length, 0);
    const ns = isC ? n.sims.length : H.conceptsUnder(id).reduce((a, x) => a + H.nodes.get(x).sims.length, 0);
    return '<a class="kid" href="#/c/' + id + '" style="--h:' + n.hue + '" data-ref="' + id + '">' +
      '<div class="kt">' + (isC ? '<span class="mdot m' + H.store.mastery(id) + '" data-md="' + id + '"></span>' : '') + esc(n.title) + '</div>' +
      '<div class="ks">' + H.inline(n.short || '') + '</div>' +
      '<div class="kf">' + (p ? '<span>' + p.total + ' concepts</span>' : '') + (nf ? '<span>' + H.icon('formulas', 12) + nf + '</span>' : '') + (ns ? '<span>' + H.icon('play', 12) + ns + '</span>' : '') +
        (isC && n.level ? '<span>' + ['', 'intro', 'intermediate', 'advanced'][n.level] + '</span>' : '') + '</div>' +
      (p && p.total ? '<div class="bar"><i class="ok" style="width:' + 100 * p.mastered / p.total + '%"></i><i style="width:' + 100 * (p.visited - p.mastered) / p.total + '%;opacity:.5"></i></div>' : '') + '</a>';
  }

  H.views.concept = function (id, params, samePage) {
    const n = H.nodes.get(id);
    if (!n) {
      ui.page('<h1>Not found</h1><p>There is no concept called “' + esc(id) + '” here. Try the search box above, or the <a href="#/map">map</a>.</p>');
      return;
    }
    if (samePage && ui.$('#view .page[data-id="' + id + '"]')) { scrollTo(params); return; }
    if (n.kind === 'root') { H.go('#/'); return; }
    ui.setTitle(n.title);
    H.store.visit(id);
    ui.refreshDots(id);
    const fs = H.formulasOf(n);
    const isC = n.kind === 'concept';
    const bm = H.store.data.bookmarks.includes(id);
    const branch = n.branch && n.branch !== id ? H.nodes.get(n.branch) : null;
    const hasPractice = n.quiz.length || fs.length || n.problems.length;
    const kids = n.children;
    const hasU = !!(n.body || n.ideas.length || n.pitfalls.length || n.derivation || n.applications.length || n.history);
    const sections = [
      ['understand', 'Understand', hasU],
      ['contents', 'Contents', kids.length > 0, kids.length],
      ['formulas', 'Formulas', fs.length > 0, fs.length],
      ['sim', n.sims.length > 1 ? 'Simulations' : 'Simulation', n.sims.length > 0, n.sims.length > 1 ? n.sims.length : 0],
      ['examples', 'Examples', n.examples.length > 0, n.examples.length],
      ['practice', 'Practice', !!hasPractice],
      ['links', 'Connections', true]
    ].filter(s => s[2]);

    const pre = n.prereq, leads = n.leadsTo;
    const rel = [...new Set(n.related.concat(n.relatedBy))].filter(x => !leads.includes(x) && !pre.includes(x));
    const page = ui.page(
      crumbs(n) +
      '<header class="phead" style="--h:' + n.hue + '"><div class="ptitle"><h1>' + esc(n.title) + '</h1><div class="pmeta">' +
        (branch ? '<a class="chip b" href="#/c/' + branch.id + '">' + esc(branch.title) + '</a>' : '') +
        (isC ? ui.levelChip(n.level) : '<span class="chip">' + H.progressOf(id).total + ' concepts</span>') +
        '<button class="chip' + (bm ? ' on' : '') + '" data-act="bookmark" title="Bookmark">' + H.icon('star', 13) + (bm ? 'Saved' : 'Save') + '</button>' +
      '</div></div>' + (n.short ? '<p class="lead">' + H.inline(n.short) + '</p>' : '') + '</header>' +
      '<div class="mapslot"></div>' +
      (sections.length > 2 ? '<nav class="sectabs">' + sections.map(s => '<a href="#/c/' + id + '?s=' + s[0] + '" data-s="' + s[0] + '">' + s[1] + (s[3] ? ' <span class="n">' + s[3] + '</span>' : '') + '</a>').join('') + '</nav>' : '') +
      (!hasU ? '' : '<section class="sect" id="s-understand" style="--h:' + n.hue + '">' +
        '<div class="prose">' + (n.body ? H.text(n.body) : '') + '</div>' +
        ((n.ideas.length || n.pitfalls.length) ? '<div class="cols2">' +
          (n.ideas.length ? '<div class="boxy ideas"><h3>' + H.icon('check', 16) + 'Key ideas</h3><ul>' + n.ideas.map(x => '<li>' + H.inline(x) + '</li>').join('') + '</ul></div>' : '') +
          (n.pitfalls.length ? '<div class="boxy pits"><h3>' + H.icon('info', 16) + 'Common mix-ups</h3><ul>' + n.pitfalls.map(pitfall).join('') + '</ul></div>' : '') +
        '</div>' : '') +
        (n.derivation ? derivation(n.derivation) : '') +
        (n.applications.length ? '<div class="boxy apps mt"><h3>' + H.icon('sparkle', 16) + 'Where you meet it</h3><ul>' + n.applications.map(x => '<li>' + H.inline(x) + '</li>').join('') + '</ul></div>' : '') +
        (n.history ? '<div class="callout co-history"><div class="co-h">History</div>' + H.text(n.history) + '</div>' : '') +
      '</section>') +
      (kids.length ? '<section class="sect" id="s-contents"><h2>' + H.icon('grid', 20) + 'In this ' + (n.kind === 'branch' ? 'branch' : 'topic') + '</h2><div class="kids">' + kids.map(kidCard).join('') + '</div></section>' : '') +
      (fs.length ? '<section class="sect" id="s-formulas"><h2>' + H.icon('formulas', 20) + 'Formulas <span class="n">click a symbol to solve for it</span></h2><div class="fslot"></div></section>' : '') +
      (n.sims.length ? '<section class="sect" id="s-sim"><h2>' + H.icon('play', 20) + (n.sims.length > 1 ? 'Simulations' : 'Simulation') + '</h2><div class="sslot"></div></section>' : '') +
      (n.examples.length ? '<section class="sect" id="s-examples"><h2>' + H.icon('bulb', 20) + 'Worked examples</h2><div class="eslot"></div></section>' : '') +
      (hasPractice ? '<section class="sect" id="s-practice"><h2>' + H.icon('practice', 20) + 'Practice</h2><div class="pslot"></div></section>' : '') +
      '<section class="sect" id="s-links"><h2>' + H.icon('link', 20) + 'Connections</h2><div class="links3">' +
        (pre.length ? '<div class="lcol"><h3>Builds on</h3>' + pre.map(linkCard).join('') + '</div>' : '') +
        (leads.length ? '<div class="lcol"><h3>Leads to</h3>' + leads.map(linkCard).join('') + '</div>' : '') +
        (rel.length ? '<div class="lcol"><h3>See also</h3>' + rel.map(linkCard).join('') + '</div>' : '') +
        usedInCols(id) +
        (!pre.length && !leads.length && !rel.length ? '<div class="lcol"><h3>Part of</h3>' + linkCard(n.parent) + '</div>' : '') +
      '</div><div class="row mt"><a class="btn sm" href="#/path/' + id + '">' + H.icon('route', 15) + 'Learning path to here</a><a class="btn sm" href="#/map?focus=' + id + '">' + H.icon('map', 15) + 'Show on the map</a></div></section>' +
      '<section class="sect" id="s-notes"><h2>' + H.icon('book', 20) + 'Your notes</h2>' +
        '<textarea class="notes" placeholder="Write down what you want to remember about ' + esc(n.title) + ' — a summary in your own words, a question to come back to. It stays in this browser."></textarea>' +
        '<div class="small faint nsaved"></div></section>' +
      pnav(id), 'concept');
    page.dataset.id = id;
    page.style.setProperty('--h', n.hue);

    ui.$('.mapslot', page).appendChild(ui.localMap(n));
    const fslot = ui.$('.fslot', page);
    if (fslot) fs.forEach(f => fslot.appendChild(ui.formulaCard(f)));
    const sslot = ui.$('.sslot', page);
    if (sslot) n.sims.forEach(s => sslot.appendChild(ui.simCard(s, n)));
    const eslot = ui.$('.eslot', page);
    if (eslot) n.examples.forEach((ex, i) => eslot.appendChild(exampleCard(ex, i)));
    const pslot = ui.$('.pslot', page);
    if (pslot && H.practice) H.practice.panel(pslot, n);
    // personal notes, saved as you type
    const notes = ui.$('.notes', page), saved = ui.$('.nsaved', page);
    const store = H.store.data;
    store.notes = store.notes || {};
    notes.value = store.notes[id] || '';
    const fit = () => { notes.style.height = 'auto'; notes.style.height = Math.max(90, notes.scrollHeight + 4) + 'px'; };
    fit();
    notes.addEventListener('input', U.debounce(() => {
      const v = notes.value.trim();
      if (v) store.notes[id] = notes.value; else delete store.notes[id];
      H.store.save();
      saved.textContent = 'Saved';
      setTimeout(() => { saved.textContent = ''; }, 1200);
    }, 400));
    notes.addEventListener('input', fit);

    page.addEventListener('click', e => {
      const b = e.target.closest('[data-act=bookmark]');
      if (b) {
        const on = H.store.toggleBookmark(id);
        b.classList.toggle('on', on);
        b.innerHTML = H.icon('star', 13) + (on ? 'Saved' : 'Save');
        ui.toast(on ? 'Bookmarked' : 'Bookmark removed');
      }
      const s = e.target.closest('.sectabs a');
      if (s) { e.preventDefault(); history.replaceState(null, '', s.getAttribute('href')); scrollTo(new URLSearchParams('s=' + s.dataset.s)); }
    });
    // which section is on screen
    const tabs = ui.$$('.sectabs a', page);
    if (tabs.length) {
      const view = ui.$('#view');
      const onScroll = () => {
        let cur = tabs[0].dataset.s;
        for (const t of tabs) { const sec = ui.$('#s-' + t.dataset.s, page); if (sec && sec.getBoundingClientRect().top < 140) cur = t.dataset.s; }
        tabs.forEach(t => t.classList.toggle('on', t.dataset.s === cur));
      };
      view.addEventListener('scroll', onScroll, { passive: true });
      ui.onLeave(() => view.removeEventListener('scroll', onScroll));
      onScroll();
    }
    scrollTo(params);
  };

  function scrollTo(params) {
    const s = params && params.get('s');
    const f = params && params.get('f');
    let el = null;
    if (s) el = ui.$('#s-' + s);
    else if (f != null) el = ui.$$('#view .fcard')[+f];
    if (el) requestAnimationFrame(() => {
      el.scrollIntoView({ block: 'start' });
      if (f != null) { el.style.transition = 'box-shadow .3s'; el.style.boxShadow = '0 0 0 3px var(--accent)'; setTimeout(() => { el.style.boxShadow = ''; }, 1400); }
    });
  }

  function pnav(id) {
    const i = H.order.indexOf(id);
    const prev = i > 0 ? H.nodes.get(H.order[i - 1]) : null;
    const next = i >= 0 && i < H.order.length - 1 ? H.nodes.get(H.order[i + 1]) : null;
    const ok = x => x && x.kind !== 'root';
    return '<nav class="pnav">' +
      (ok(prev) ? '<a href="#/c/' + prev.id + '"><small>← Previous  [</small>' + esc(prev.title) + '</a>' : '<span></span>') +
      (ok(next) ? '<a class="next" href="#/c/' + next.id + '"><small>Next  ] →</small>' + esc(next.title) + '</a>' : '') + '</nav>';
  }
})();
