/* HYPER-CORE · ui/terms.js
 *
 * Math terms in the page: a click on a [[?term]] in any text, or on a chip under a formula, opens a small
 * card saying what the symbol means and how to deal with it; Tools → Math terms lists the whole dictionary
 * (#/tools/terms, #/tools/terms/<id>). The dictionary itself is HYPER-CORE/js/glossary.js.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, esc = H.util.esc, G = () => H.glossary;

  // Hyper Math's page for a term, if that catalog is loaded
  const mathLink = t => {
    if (!t.math) return '';
    const ref = 'math:' + t.math, known = (H.catalogs && H.catalogs.math && H.catalogs.math.has(t.math)) || (H.discipline && H.discipline.id === 'math' && H.nodes.has(t.math));
    if (!known) return '';
    const href = H.discipline && H.discipline.id === 'math' ? '#/c/' + t.math : (H.href ? H.href(ref) : '#/c/' + ref);
    return '<a class="chip" href="' + esc(href) + '">' + H.icon('book', 14) + ' Learn it in Hyper Math</a>';
  };
  function cardHtml(t, full) {
    return '<div class="gt-head"><span class="gt-sym">' + H.texSafe(t.sym, false) + '</span><b>' + esc(t.title) + '</b></div>' +
      '<div class="gt-sec"><span>What it means</span><p>' + H.inline(t.means) + '</p></div>' +
      '<div class="gt-sec"><span>How to deal with it</span><p>' + H.inline(t.howto) + '</p></div>' +
      (t.example ? '<div class="gt-sec"><span>For example</span><p>' + H.inline(t.example) + '</p></div>' : '') +
      '<div class="gt-links">' + mathLink(t) + (full ? '' : '<a class="chip" href="#/tools/terms/' + esc(t.id) + '">All math terms</a>') + '</div>';
  }

  /* ---------------------------------------------------------------- the pop-up card */
  let pop = null, anchor = null;
  function close() { if (pop) { pop.remove(); pop = null; } if (anchor) { anchor.setAttribute('aria-expanded', 'false'); anchor = null; } }
  function open(el, id) {
    const t = G() && G().get(id);
    if (!t) return;
    if (anchor === el) { close(); return; }
    close();
    anchor = el; el.setAttribute('aria-expanded', 'true');
    pop = document.createElement('div');
    pop.className = 'gpop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', t.title);
    pop.innerHTML = '<button class="gpop-x" aria-label="Close">×</button>' + cardHtml(t, false);
    document.body.appendChild(pop);
    const r = el.getBoundingClientRect(), w = Math.min(380, window.innerWidth - 24);
    pop.style.width = w + 'px';
    let left = r.left + window.scrollX, top = r.bottom + window.scrollY + 8;
    left = Math.max(12 + window.scrollX, Math.min(left, window.scrollX + window.innerWidth - w - 12));
    if (r.bottom + pop.offsetHeight + 16 > window.innerHeight && r.top > pop.offsetHeight + 16) top = r.top + window.scrollY - pop.offsetHeight - 8;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    pop.querySelector('.gpop-x').focus({ preventScroll: true });
  }
  document.addEventListener('click', e => {
    const el = e.target.closest('.gterm, .gchip');
    if (el && el.dataset.g) { e.preventDefault(); e.stopPropagation(); open(el, el.dataset.g); return; }
    if (pop && (e.target.closest('.gpop-x') || !e.target.closest('.gpop'))) close();
    else if (pop && e.target.closest('.gpop a')) close();
  }, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && pop) { const a = anchor; close(); if (a) a.focus(); } });
  window.addEventListener('hashchange', close);
  window.addEventListener('resize', close);

  /* ---------------------------------------------------------------- chips under a formula */
  H.termChips = function (tex) {
    if (!G()) return '';
    const ids = G().detect(tex);
    if (!ids.length) return '';
    return '<div class="fterms"><span>The math in it</span>' + ids.map(id => { const t = G().get(id); return '<button type="button" class="gchip" data-g="' + id + '" title="' + esc(t.title) + ': what it means">' + H.texSafe(t.sym.split(/\\,|=/)[0].trim() || t.sym, false) + '<i>' + esc(t.title.replace(/^\S{1,3} — /, '')) + '</i></button>'; }).join('') + '</div>';
  };

  /* ---------------------------------------------------------------- Tools → Math terms */
  H.termsTool = function (el, params, sub) {
    if (!G()) { el.innerHTML = '<p class="muted">The math terms dictionary is not loaded.</p>'; return; }
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every symbol and idea of the mathematics used in these pages: what it means and how to deal with it when you meet it in a formula. The same cards open when you click a dotted term in the text or a chip under a formula.</p>' +
      '<div class="toolbar"><input type="search" class="inp tq" placeholder="Find a term: integral, curl, e^{iθ}, eigenvalue …" style="flex:1;min-width:220px"></div>' +
      '<nav class="subtabs tgroups" style="margin:10px 0 4px;flex-wrap:wrap">' + G().groups.map(([g]) => '<a href="#" data-grp="' + esc(g) + '">' + esc(g) + '</a>').join('') + '</nav><div class="tlist"></div>';
    const list = ui.$('.tlist', el), q = ui.$('.tq', el);
    const draw = () => {
      const s = q.value.trim().toLowerCase();
      list.innerHTML = G().groups.map(([g, ids]) => {
        const hits = ids.map(id => G().get(id)).filter(t => !s || (t.title + ' ' + t.means + ' ' + t.id + ' ' + t.sym).toLowerCase().includes(s));
        return hits.length ? '<h3 class="tgh" data-grp="' + esc(g) + '">' + esc(g) + '</h3><div class="termgrid">' + hits.map(t => '<div class="boxy termcard" id="term-' + t.id + '">' + cardHtml(t, true) + '</div>').join('') + '</div>' : '';
      }).join('') || '<p class="muted">No term matches.</p>';
    };
    q.addEventListener('input', draw);
    el.querySelector('.tgroups').addEventListener('click', e => {
      const a = e.target.closest('[data-grp]'); if (!a) return; e.preventDefault();
      const h = list.querySelector('h3[data-grp="' + CSS.escape(a.dataset.grp) + '"]'); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    draw();
    if (sub && G().has(sub)) setTimeout(() => { const c = document.getElementById('term-' + sub); if (c) { c.scrollIntoView({ block: 'center' }); c.classList.add('flash'); } }, 30);
  };
})();
