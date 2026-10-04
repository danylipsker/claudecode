/* HYPER-CORE · ui/optictools.js
 *
 * The Tools pages of Hyper Optics: this file holds the shared helpers of the labs and the Optics dictionary;
 * each lab lives in its own file (ui/optics-<name>.js) and adds itself to Hyper.opticsTools:
 *
 *   #/tools/bench        the ray bench: lenses, mirrors and stops on an axis               (optics-bench.js)
 *   #/tools/lenslab      real prescriptions traced: layout, ray fans, spots, Seidel bars    (optics-lenslab.js)
 *   #/tools/camera       field of view, depth of field, sensors, mounts, exposure, MTF     (optics-camera.js)
 *   #/tools/coatings     thin-film designer, Fresnel explorer, glass map, filters          (optics-coatings.js)
 *   #/tools/colour       spectra to colour, chromaticity diagram, Munsell wheel, deficiency (optics-colour.js)
 *   #/tools/eyelab       the eye, prescriptions, acuity and blur, progressive lenses       (optics-eye.js)
 *   #/tools/beams        Gaussian beams, resonators, diffraction, gratings, laser table    (optics-beams.js)
 *   #/tools/illusions    a gallery of interactive illusions                                (optics-illusions.js)
 *   #/tools/dictionary   every term the pages define, A to Z                               (this file)
 *
 * The mathematics is HYPER-CORE/js/optics.js, optics-wave.js and optics-vision.js (kit.optics); the drawing
 * is opticsym.js (kit.osym).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc;
  const T = H.opticsTools = H.opticsTools || {};

  /* ---------------------------------------------------------------- shared by the labs: T.util */
  T.util = {
    /* sub-tabs under a tool: -> { tab, body } */
    subtabs(el, base, TABS, sub, note) {
      const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
      el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' + (note ? '<p class="small faint mt">' + note + '</p>' : '');
      return { tab, body: ui.$('.mbody', el) };
    },
    /* a lab: controls on the left, a canvas stage on the right, room under it: -> { side, stage, under, st } */
    lab(el, intro, aspect, opts) {
      el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="pjlab"><div class="pjside"></div><div><div class="pjstage"></div><div class="pjunder"></div></div></div>';
      const stageEl = ui.$('.pjstage', el);
      const st = H.kit.stage(stageEl, Object.assign({ aspect: aspect || 0.6, minH: 300, maxH: 720 }, opts || {}));
      return { side: ui.$('.pjside', el), stage: stageEl, under: ui.$('.pjunder', el), st };
    },
    box: (title, html) => '<div class="boxy" style="margin-top:10px"><h3>' + title + '</h3>' + html + '</div>',
    /* a link to a concept of this app, if it exists: ' <a href=…>title</a>' or '' */
    link: (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '',
    /* "Read more" chips for a list of concept ids */
    more(ids) { const a = ids.filter(id => H.nodes.has(id)); return a.length ? '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Read more:</span>' + a.map(id => '<a class="chip" href="#/c/' + id + '">' + esc(H.titleOf(id)) + '</a>').join('') + '</div>' : ''; },
    /* a table: head ['a', 'b'], rows [[…], …]; numbers are right-aligned */
    table(head, rows, opts) {
      return '<div class="tablewrap" style="' + (opts && opts.maxHeight ? 'max-height:' + opts.maxHeight + 'px;overflow:auto' : '') + '"><table class="optable"><thead><tr>' + head.map(h => '<th>' + h + '</th>').join('') + '</tr></thead><tbody>' +
        rows.map(r => '<tr' + (r.hl ? ' class="hl"' : '') + '>' + (r.cells || r).map(c => '<td' + (typeof c === 'number' ? ' class="num"' : '') + '>' + (typeof c === 'number' ? U.fmt(c, 4) : c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    },
    swatch: rgb => '<span class="opsw" style="background:rgb(' + rgb.join(',') + ')"></span>',
    f: (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—',
    /* redraw when the theme changes, until the page is left */
    onTheme(fn) { document.addEventListener('hyper:theme', fn); ui.onLeave(() => document.removeEventListener('hyper:theme', fn)); }
  };

  /* ---------------------------------------------------------------- the dictionary */
  T.dictionary = function (el, params, sub) {
    const all = H.allTerms();
    if (!all.length) { el.innerHTML = '<p class="muted">No terms are defined yet.</p>'; return; }
    const letterOf = t => { const m = /[a-z0-9]/i.exec(t.term.normalize('NFD')); const c = m ? m[0].toUpperCase() : '#'; return /[0-9]/.test(c) ? '#' : c; };
    const LETTERS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const branches = H.branches.map(b => [b.id, b.title]);
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every term the pages of Hyper Optics define — ' + all.length + ' of them — with the page that explains it. Abbreviations are listed under their letters too (AOI, EFL, MTF, NA …). The search box at the top of the app finds the same terms.</p>' +
      '<div class="toolbar"><input type="search" class="inp dq" placeholder="Find a term or an abbreviation: f-number, AOI, Abbe, ferrule, chief ray …" style="flex:1;min-width:240px">' +
      '<select class="inp db"><option value="">All branches</option>' + branches.map(([id, t]) => '<option value="' + id + '">' + esc(t) + '</option>').join('') + '</select></div>' +
      '<nav class="dict-letters"></nav><div class="dlist"></div>';
    const q = ui.$('.dq', el), bsel = ui.$('.db', el), nav = ui.$('.dict-letters', el), list = ui.$('.dlist', el);
    // an abbreviation given under "also" gets its own entry pointing at the term
    const entries = all.map(t => Object.assign({ key: t.term }, t));
    for (const t of all) for (const a of t.also) if (/^[A-Z0-9][A-Za-z0-9/#′'.-]{1,7}$/.test(a) && a.toLowerCase() !== t.term.toLowerCase()) entries.push(Object.assign({}, t, { key: a, ref: t.term }));
    const sortKey = s => s.normalize('NFD').toLowerCase().replace(/^[^a-z0-9]+/, '');
    entries.sort((a, b) => sortKey(a.key).localeCompare(sortKey(b.key)));
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const card = t => '<div class="dict-e" style="--h:' + t.hue + '"><b>' + H.inline(t.key) + '</b>' +
      (t.ref ? '<span class="aka">= ' + H.inline(t.ref) + '</span>' : t.also.length ? '<span class="aka">' + t.also.map(a => H.inline(a)).join(' · ') + '</span>' : '') +
      '<p>' + H.inline(t.def) + '</p><a href="#/c/' + t.id + '">' + H.icon('right', 12) + ' ' + esc(t.title) + '</a></div>';
    const draw = () => {
      const s = norm(q.value.trim()), b = bsel.value;
      const hits = entries.filter(t => (!b || t.branch === b) && (!s || norm(t.key).includes(s) || (!t.ref && (norm(t.also.join(' ')).includes(s) || (s.length > 2 && norm(t.def).includes(s))))));
      // a query puts the terms that start with it first
      if (s) hits.sort((x, y) => (norm(y.key).startsWith(s) - norm(x.key).startsWith(s)) || (norm(y.key).includes(s) - norm(x.key).includes(s)) || sortKey(x.key).localeCompare(sortKey(y.key)));
      const by = {};
      for (const t of hits) { const L = s ? '' : letterOf({ term: t.key }); (by[L] = by[L] || []).push(t); }
      nav.innerHTML = s ? '<span class="small muted">' + hits.length + ' found</span>' : LETTERS.map(L => '<a href="#" data-l="' + L + '" class="' + (by[L] ? '' : 'off') + '">' + L + '</a>').join('');
      list.innerHTML = hits.length ? (s ? '<div class="dict-list" style="margin-top:10px">' + hits.slice(0, 300).map(card).join('') + '</div>'
        : LETTERS.filter(L => by[L]).map(L => '<h3 class="dict-h" id="dict-' + (L === '#' ? 'num' : L) + '">' + L + '</h3><div class="dict-list">' + by[L].map(card).join('') + '</div>').join(''))
        : '<p class="muted">No term matches.</p>';
    };
    q.addEventListener('input', U.debounce(draw, 100));
    bsel.addEventListener('change', draw);
    nav.addEventListener('click', e => { const a = e.target.closest('[data-l]'); if (!a) return; e.preventDefault(); const h = document.getElementById('dict-' + (a.dataset.l === '#' ? 'num' : a.dataset.l)); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    if (sub) q.value = decodeURIComponent(sub).replace(/-/g, ' ');
    draw();
  };
})();
