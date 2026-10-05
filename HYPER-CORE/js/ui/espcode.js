/* HYPER-CORE · ui/espcode.js
 *
 * The program card of a concept page (Hyper ESP32): one program shown as Scratch-style blocks, Arduino C++ and
 * MicroPython (and, where a page gives them, ESP-IDF C and ESPHome YAML), with what it needs, how it is wired,
 * and what it prints. The reader's choice of language is remembered and applied to every card.
 *
 *   concept: code: [{ title, about, needs, wiring: [[from, to, note?], …], libs: [...], blocks, cpp, py, idf, yaml,
 *                     na: { py: 'why there is no MicroPython version' }, output, notes: [...] }]
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, C = H.code;
  if (!C) return;

  const pref = () => (H.settings && H.settings.data && H.settings.data.codeLang) || 'blocks';
  const setPref = k => { if (H.settings) H.settings.set('codeLang', k); document.dispatchEvent(new CustomEvent('hyper:codelang', { detail: k })); };

  ui.codeCard = function (e, node, index) {
    const card = ui.el('<div class="card codecard"></div>');
    const na = e.na || {};
    // the tabs this card has: a language it gives, or one it explains the absence of
    const tabs = C.TABS.filter(([k]) => e[k] != null || na[k]);
    const side = (e.needs || (e.wiring && e.wiring.length) || (e.libs && e.libs.length) || e.output || (e.notes && [].concat(e.notes).length));
    card.innerHTML =
      '<div class="cchead"><span class="tag">' + H.icon('chip', 18) + '</span><h3>' + H.inline(e.title || 'Program') + '</h3></div>' +
      (e.about ? '<div class="ccabout">' + H.text(e.about) + '</div>' : '') +
      '<div class="cctabs">' + tabs.map(([k, t]) => '<button class="lang' + (e[k] == null ? ' na' : '') + '" data-k="' + k + '">' + t + '</button>').join('') +
        '<span class="sp"></span><button class="tbtn" data-act="copy" title="Copy the program">' + H.icon('copy', 15) + '<span>Copy</span></button></div>' +
      '<div class="ccgrid' + (side ? '' : ' noside') + '"><div class="ccmain"></div>' + (side ? '<div class="ccside">' +
        (e.needs ? '<div><h4>You need</h4>' + H.inline(e.needs) + '</div>' : '') +
        (e.wiring && e.wiring.length ? '<div><h4>Wiring</h4><table>' + e.wiring.map(w => '<tr><td>' + H.inline(String(w[0])) + '</td><td>' + H.inline(String(w[1])) + (w[2] ? '<small>' + H.inline(String(w[2])) + '</small>' : '') + '</td></tr>').join('') + '</table></div>' : '') +
        (e.libs && e.libs.length ? '<div><h4>Libraries</h4><ul>' + [].concat(e.libs).map(l => '<li>' + H.inline(l) + '</li>').join('') + '</ul></div>' : '') +
        (e.output ? '<div><h4>What you should see</h4><pre>' + esc(C.dedent(e.output)) + '</pre></div>' : '') +
        (e.notes && [].concat(e.notes).length ? '<div><h4>Notes</h4><ul>' + [].concat(e.notes).map(l => '<li>' + H.inline(l) + '</li>').join('') + '</ul></div>' : '') +
      '</div>' : '') + '</div>';
    const main = ui.$('.ccmain', card);
    let cur = null;
    // asked = the reader clicked this tab (then a missing language shows its reason); otherwise the card opens on the
    // preferred language when it has it, and on the first language it has when it does not
    const show = (k, asked) => {
      const first = tabs.find(t => e[t[0]] != null);
      if (!tabs.some(t => t[0] === k) || (!asked && e[k] == null)) k = first ? first[0] : tabs[0][0];
      cur = k;
      ui.$$('.cctabs .lang', card).forEach(b => b.classList.toggle('on', b.dataset.k === k));
      if (e[k] == null) main.innerHTML = '<div class="ccna">' + H.icon('info', 15) + ' ' + H.inline(na[k]) + '</div>';
      else main.innerHTML = C.pre(e[k], C.langOfTab[k]);
      main.scrollTop = 0;
    };
    card.addEventListener('click', ev => {
      const b = ev.target.closest('.lang');
      if (b) { if (e[b.dataset.k] != null) setPref(b.dataset.k); show(b.dataset.k, true); return; }
      if (ev.target.closest('[data-act=copy]')) {
        const text = e[cur] == null ? '' : C.dedent(e[cur]);
        const done = () => ui.toast(text ? 'Copied the ' + (C.TABS.find(t => t[0] === cur) || ['', 'program'])[1] + ' version' : 'Nothing to copy');
        if (navigator.clipboard && text) navigator.clipboard.writeText(text).then(done, done); else done();
      }
    });
    // another card changed the language: follow it when this card has that language
    const follow = ev => { if (ev.detail !== cur && e[ev.detail] != null) show(ev.detail); };
    document.addEventListener('hyper:codelang', follow);
    ui.onLeave(() => document.removeEventListener('hyper:codelang', follow));
    show(pref());
    return card;
  };
})();
