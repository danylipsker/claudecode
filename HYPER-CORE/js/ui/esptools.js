/* HYPER-CORE · ui/esptools.js
 *
 * The Tools pages of Hyper ESP32. This file holds the helpers the labs share (Hyper.espTools.util), and the tools
 * that read the catalogue of chips and boards:
 *
 *   #/tools/advisor      describe a project in words: which chip suits it, why, and which boards carry it
 *   #/tools/chips        every chip of the family, its virtues and limits, side-by-side comparison
 *   #/tools/boards       the boards built on them, by maker and by what they carry
 *   #/tools/dictionary   every term the pages define, A to Z
 *
 * and each lab lives in its own file, adding itself to Hyper.espTools:
 *
 *   #/tools/pinout       boards and chips pin by pin, and a pin planner               (esp-pinout.js)
 *   #/tools/blocklab     build a program from blocks; see it as C++ and MicroPython   (esp-blocks.js)
 *   #/tools/displaylab   virtual displays and a GUI designer                         (esp-display.js)
 *   #/tools/fsmlab       state machines: draw, run, generate code                    (esp-fsm.js)
 *   #/tools/signals      UART, I2C, SPI, PWM, WS2812 … on a logic analyser           (esp-signals.js)
 *   #/tools/espcalc      battery life, PWM, ADC, link budget, partitions …           (esp-calc.js)
 *
 * The data is HYPER-CORE/js/esp32-chips.js and esp32-boards.js; the reasoning is esp32.js (Hyper.esp).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = H.esp;
  const T = H.espTools = H.espTools || {};

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
      el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') + '<div class="esplab"><div class="side"></div><div><div class="stage"></div><div class="under" style="margin-top:10px"></div></div></div>';
      const stageEl = ui.$('.stage', el);
      const st = H.kit.stage(stageEl, Object.assign({ aspect: aspect || 0.6, minH: 300, maxH: 720 }, opts || {}));
      return { side: ui.$('.side', el), stage: stageEl, under: ui.$('.under', el), st };
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
    f: (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—',
    /* a program shown in the three languages, as on a concept page: entry = { title, blocks, cpp, py, … } */
    code(el, entry) { el.innerHTML = ''; if (ui.codeCard) el.appendChild(ui.codeCard(entry)); },
    /* redraw when the theme changes, until the page is left */
    onTheme(fn) { document.addEventListener('hyper:theme', fn); ui.onLeave(() => document.removeEventListener('hyper:theme', fn)); },
    /* the page of a chip (its concept), if it is written */
    chipPage: id => 'soc-' + id,
    tags: c => E.chipTags(c).map(([t, k]) => '<span class="esptag ' + k + '">' + esc(t) + '</span>').join('')
  };
  const util = T.util;
  const chipHue = c => /risc/i.test(c.arch) ? 150 : c.id === 'esp8266' ? 40 : 8;

  /* ---------------------------------------------------------------- the dictionary */
  T.dictionary = function (el, params, sub) {
    const all = H.allTerms();
    if (!all.length) { el.innerHTML = '<p class="muted">No terms are defined yet.</p>'; return; }
    const letterOf = t => { const m = /[a-z0-9]/i.exec(t.term.normalize('NFD')); const c = m ? m[0].toUpperCase() : '#'; return /[0-9]/.test(c) ? '#' : c; };
    const LETTERS = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const branches = H.branches.map(b => [b.id, b.title]);
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every term the pages of Hyper ESP32 define — ' + all.length + ' of them — with the page that explains it. Abbreviations have their own entries (GPIO, ADC, OTA, GATT, RSSI, PSRAM …). The search box at the top of the app finds the same terms.</p>' +
      '<div class="toolbar"><input type="search" class="inp dq" placeholder="Find a term or an abbreviation: strapping pin, brownout, MTU, QoS, DTIM …" style="flex:1;min-width:240px">' +
      '<select class="inp db"><option value="">All branches</option>' + branches.map(([id, t]) => '<option value="' + id + '">' + esc(t) + '</option>').join('') + '</select></div>' +
      '<nav class="dict-letters"></nav><div class="dlist"></div>';
    const q = ui.$('.dq', el), bsel = ui.$('.db', el), nav = ui.$('.dict-letters', el), list = ui.$('.dlist', el);
    const entries = all.map(t => Object.assign({ key: t.term }, t));
    for (const t of all) for (const a of t.also) if (/^[A-Z0-9][A-Za-z0-9/#′'.+-]{1,9}$/.test(a) && a.toLowerCase() !== t.term.toLowerCase()) entries.push(Object.assign({}, t, { key: a, ref: t.term }));
    const sortKey = s => s.normalize('NFD').toLowerCase().replace(/^[^a-z0-9]+/, '');
    entries.sort((a, b) => sortKey(a.key).localeCompare(sortKey(b.key)));
    const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const card = t => '<div class="dict-e" style="--h:' + t.hue + '"><b>' + H.inline(t.key) + '</b>' +
      (t.ref ? '<span class="aka">= ' + H.inline(t.ref) + '</span>' : t.also.length ? '<span class="aka">' + t.also.map(a => H.inline(a)).join(' · ') + '</span>' : '') +
      '<p>' + H.inline(t.def) + '</p><a href="#/c/' + t.id + '">' + H.icon('right', 12) + ' ' + esc(t.title) + '</a></div>';
    const draw = () => {
      const s = norm(q.value.trim()), b = bsel.value;
      const hits = entries.filter(t => (!b || t.branch === b) && (!s || norm(t.key).includes(s) || (!t.ref && (norm(t.also.join(' ')).includes(s) || (s.length > 2 && norm(t.def).includes(s))))));
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
  T.dictionary.words = true;

  /* ---------------------------------------------------------------- the project advisor */
  const IDEAS = [
    'A battery-powered weather station in the garden that sends temperature and humidity to my phone every ten minutes',
    'A Bluetooth speaker that plays music from a phone',
    'A Zigbee light switch for Home Assistant that runs for a year on a coin cell',
    'A robot car with two motors and encoders, driven from a web page',
    'A touch-screen thermostat with a 4.3 inch display and a relay for the boiler',
    'A doorbell with a camera that sends a photo to Telegram',
    'A USB macro keyboard with 12 keys and RGB LEDs',
    'LoRa soil moisture sensors on a farm, solar powered',
    'A voice-controlled lamp that recognises a wake word without the cloud',
    'A CAN bus logger for a car that stores data on an SD card',
    'A Matter smart plug that works with Apple Home and Google Home',
    'A tiny wearable step counter with a small OLED, programmed in MicroPython'
  ];
  const adv = { text: '', on: new Set(), off: new Set(), current: false };       // kept while the app is open
  T.advisor = function (el) {
    if (!E.CHIPS.length) { el.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const groups = [...new Set(E.NEEDS.map(n => n.group))];
    el.innerHTML =
      '<p class="muted" style="margin:0 0 10px">Say what you want to build, in your own words. The advisor picks out what the project needs — you can correct it by clicking the needs below — and ranks the chips of the family, saying why each fits, where it falls short, and which boards carry it.</p>' +
      '<textarea class="espidea" placeholder="For example: a battery-powered sensor in the greenhouse that reports temperature over Wi-Fi and shows it on a small screen …"></textarea>' +
      '<div class="row" style="flex-wrap:wrap;gap:6px;margin:8px 0 2px"><span class="small muted">Try:</span>' + IDEAS.map((t, i) => '<button class="chip" data-idea="' + i + '">' + esc(t.length > 46 ? t.slice(0, 44) + '…' : t) + '</button>').join('') + '</div>' +
      '<div class="boxy" style="margin-top:12px"><h3>' + H.icon('target', 16) + 'What the project needs <span class="small muted" style="font-weight:400;margin-left:6px">click to add or remove; outlined ones were found in your words</span></h3>' +
        groups.map(g => '<div class="espneedgrp">' + esc(g) + '</div><div class="espneeds">' + E.NEEDS.filter(n => n.group === g).map(n => '<button class="espneed" data-need="' + n.id + '">' + esc(n.label) + '</button>').join('') + '</div>').join('') +
        '<label class="ctl chk" style="margin-top:12px"><input type="checkbox" class="advcur"' + (adv.current ? ' checked' : '') + '>Only chips recommended for new designs</label></div>' +
      '<div class="advout" style="margin-top:14px"></div>';
    const ta = ui.$('.espidea', el), out = ui.$('.advout', el);
    ta.value = adv.text;
    const selected = () => {
      const found = E.understand(ta.value);
      const ids = new Set(found.map(f => f.id).filter(id => !adv.off.has(id)));
      for (const id of adv.on) ids.add(id);
      return { ids: [...ids], found };
    };
    const draw = () => {
      adv.text = ta.value;
      const { ids, found } = selected();
      const fmap = new Map(found.map(f => [f.id, f.words]));
      ui.$$('.espneed', el).forEach(b => {
        const id = b.dataset.need;
        b.classList.toggle('on', ids.includes(id));
        b.classList.toggle('found', fmap.has(id));
        b.title = fmap.has(id) ? 'Found in your words: ' + fmap.get(id).join(', ') : '';
      });
      if (!ids.length) {
        out.innerHTML = '<div class="empty" style="padding:24px">Describe the project, or click what it needs. With nothing chosen, here is the family at a glance: <a href="#/tools/chips">all chips</a>.</div>';
        return;
      }
      const r = E.advise(ids, { include: adv.current ? 'current' : 'all' });
      const top = r.ranked.slice(0, 6);
      const line = (x, cls, mark) => '<li class="' + cls + '"><b>' + mark + ' ' + esc(x.label) + '</b> — ' + esc(x.text) + '</li>';
      out.innerHTML = '<h3 style="margin:0 0 8px">' + (r.ranked.length ? 'Best fits' : 'No chip of the family meets every requirement') + '</h3>' +
        (r.ranked.length ? '' : '<p class="muted">Look at what rules each chip out below; a requirement may be met by an added part (a LoRa radio, an Ethernet chip, a CAN controller) or by pairing two chips.</p>') +
        '<div class="esprank">' + top.map((x, i) => {
          const c = E.chip(x.chip), page = util.chipPage(c.id);
          const boards = x.boards.map(E.board).filter(Boolean);
          return '<div class="r' + (i === 0 ? ' top' : '') + '" style="--eh:' + chipHue(c) + '"><h4><span class="espscore">' + x.score + '</span>' + esc(c.name) +
            ' <span class="small muted" style="font-weight:400">' + esc(c.tagline || '') + '</span></h4>' +
            '<div class="espbar"><i style="width:' + x.score + '%"></i></div>' +
            '<div class="tags" style="display:flex;gap:4px;flex-wrap:wrap;margin:6px 0">' + util.tags(c) + '</div>' +
            '<ul>' + x.yes.map(y => line(y, 'yes', '✓')).join('') + x.partly.map(y => line(y, 'no', '≈')).join('') + x.watch.map(w => '<li class="no"><b>! Watch</b> — ' + esc(w) + '</li>').join('') + '</ul>' +
            (boards.length ? '<div class="row" style="flex-wrap:wrap;gap:6px;margin-top:8px"><span class="small muted">Boards that fit:</span>' + boards.map(b => '<a class="chip" href="#/tools/boards?b=' + b.id + '">' + esc(b.name) + '</a>').join('') + '</div>' : '') +
            '<div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">' + (H.nodes.has(page) ? '<a class="btn sm" href="#/c/' + page + '">' + H.icon('book', 14) + 'Read about the ' + esc(c.name) + '</a>' : '') +
            '<a class="btn sm ghost" href="#/tools/chips?c=' + c.id + '">Details</a><a class="btn sm ghost" href="#/tools/pinout?chip=' + c.id + '">Pins</a></div></div>';
        }).join('') + '</div>' +
        (r.ranked.length > top.length ? '<p class="small muted mt">Also possible: ' + r.ranked.slice(top.length).map(x => esc(E.chip(x.chip).name) + ' (' + x.score + ')').join(', ') + '.</p>' : '') +
        (r.out.length ? '<details class="deriv" style="margin-top:14px"><summary>Ruled out (' + r.out.length + ')</summary><div class="dbody"><ul>' + r.out.map(o => '<li><b>' + esc(E.chip(o.chip).name) + '</b> — ' + o.why.map(esc).join('; ') + '</li>').join('') + '</ul></div></details>' : '') +
        '<p class="small faint mt">The score weighs how well each chip meets what was asked, then how settled its tools and libraries are, and prefers the simpler chip when two fit equally. It is a starting point for reading the chip\'s page and datasheet, not a verdict.</p>';
    };
    ta.addEventListener('input', U.debounce(() => { adv.on.clear(); adv.off.clear(); draw(); }, 200));
    el.addEventListener('click', e => {
      const idea = e.target.closest('[data-idea]');
      if (idea) { ta.value = IDEAS[+idea.dataset.idea]; adv.on.clear(); adv.off.clear(); draw(); return; }
      const b = e.target.closest('[data-need]');
      if (b) {
        const id = b.dataset.need, isOn = b.classList.contains('on');
        if (isOn) { adv.on.delete(id); adv.off.add(id); } else { adv.off.delete(id); adv.on.add(id); }
        draw();
      }
    });
    ui.$('.advcur', el).addEventListener('change', e => { adv.current = e.target.checked; draw(); });
    draw();
  };
  T.advisor.dom = true;

  /* ---------------------------------------------------------------- chips */
  const chipSt = { sel: null, cmp: new Set() };
  T.chips = function (el, params) {
    if (!E.CHIPS.length) { el.innerHTML = '<p class="muted">The chip catalogue is not loaded.</p>'; return; }
    const want = params && params.get('c');
    if (want && E.chip(want)) chipSt.sel = want;
    if (!chipSt.sel) chipSt.sel = E.CHIPS[0].id;
    if (!chipSt.cmp.size) ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6'].filter(E.chip).forEach(id => chipSt.cmp.add(id));
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every system-on-chip Espressif makes for this family. Click a chip for its strengths and limits; tick up to five to compare them line by line. Numbers are from the datasheets — the chip alone, not a board.</p>' +
      '<div class="espgrid chipgrid"></div><div class="chipdetail" style="margin-top:14px"></div>' +
      '<h3 style="margin:22px 0 8px">Side by side</h3><div class="chipcmp"></div>';
    const grid = ui.$('.chipgrid', el), detail = ui.$('.chipdetail', el), cmp = ui.$('.chipcmp', el);
    const drawGrid = () => {
      grid.innerHTML = E.CHIPS.filter(c => !c.hidden).map(c => '<div class="espcard' + (c.id === chipSt.sel ? ' on' : '') + '" data-chip="' + c.id + '" style="--eh:' + chipHue(c) + '" role="button" tabindex="0"><b>' + esc(c.name) + '</b>' +
        '<span class="sub">' + esc(c.tagline || '') + '</span><div class="tags">' + util.tags(c) + '</div>' +
        '<label class="small muted" style="display:flex;gap:6px;align-items:center;margin-top:8px"><input type="checkbox" data-cmp="' + c.id + '"' + (chipSt.cmp.has(c.id) ? ' checked' : '') + '>compare</label></div>').join('');
    };
    const li = xs => (xs || []).map(x => '<li>' + H.inline(x) + '</li>').join('');
    const drawDetail = () => {
      const c = E.chip(chipSt.sel);
      if (!c) { detail.innerHTML = ''; return; }
      const page = util.chipPage(c.id), boards = E.boardsOf(c.id), mods = E.MODULES.filter(m => m.chip === c.id);
      const fact = (k, v) => v == null || v === '' || v === false ? '' : '<tr><td>' + k + '</td><td>' + v + '</td></tr>';
      detail.innerHTML = '<div class="boxy" style="--eh:' + chipHue(c) + '"><h3 style="font-size:19px">' + esc(c.name) + ' <span class="small muted" style="font-weight:400">' + esc(c.tagline || '') + '</span></h3>' +
        (c.role ? '<p style="margin:0 0 10px">' + H.inline(c.role) + '</p>' : '') +
        '<div class="espcols">' +
          '<div class="boxy espgood"><h3>Virtues</h3><ul>' + li(c.good) + '</ul></div>' +
          '<div class="boxy espbad"><h3>Limitations</h3><ul>' + li(c.bad) + '</ul></div>' +
          '<div class="boxy"><h3>In numbers</h3><table class="ftable" style="width:100%;font-size:13.5px">' +
            fact('Announced', c.year) + fact('Status', esc(c.status || '')) + fact('Core', esc(c.arch) + (c.cores > 1 ? ' × ' + c.cores : '') + ', ' + c.mhz + ' MHz') +
            fact('RAM' + (c.rom ? ' / ROM' : ''), (c.sram >= 1024 ? c.sram / 1024 + ' MB' : c.sram + ' KB') + (c.rom ? ' / ' + c.rom + ' KB' : '')) + fact('GPIO', c.gpio) + fact('Strapping pins', (c.strap || []).map(n => 'GPIO' + n).join(', ')) +
            fact('Supply', c.vdd ? c.vdd[0] + '–' + c.vdd[1] + ' V' : '') + fact('Deep sleep', c.sleepUa != null ? c.sleepUa + ' µA' : '') + fact('Transmit peak', c.txMa ? c.txMa + ' mA' : '') +
            fact('Packages', esc((c.pkg || []).join(', '))) + '</table></div>' +
        '</div>' +
        (c.security && c.security.length ? '<details class="deriv"><summary>Security features</summary><div class="dbody"><ul>' + li(c.security) + '</ul></div></details>' : '') +
        (mods.length ? '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">Modules:</span>' + mods.map(m => '<span class="esptag" title="' + esc([m.flash, m.psram, m.antenna].filter(Boolean).join(' · ')) + '">' + esc(m.name) + '</span>').join('') + '</div>' : '') +
        (boards.length ? '<div class="row mt" style="flex-wrap:wrap;gap:6px"><span class="small muted">' + boards.length + ' boards:</span>' + boards.slice(0, 14).map(b => '<a class="chip" href="#/tools/boards?b=' + b.id + '">' + esc(b.name) + '</a>').join('') + (boards.length > 14 ? '<a class="chip" href="#/tools/boards?chip=' + c.id + '">all ' + boards.length + ' …</a>' : '') + '</div>' : '') +
        '<div class="row mt" style="gap:6px;flex-wrap:wrap">' + (H.nodes.has(page) ? '<a class="btn sm pri" href="#/c/' + page + '">' + H.icon('book', 14) + 'The page on the ' + esc(c.name) + '</a>' : '') +
        '<a class="btn sm" href="#/tools/pinout?chip=' + c.id + '">' + H.icon('chip', 14) + 'Its pins</a>' +
        (c.src && c.src[0] ? '<a class="btn sm ghost" href="' + esc(c.src[0]) + '" target="_blank" rel="noopener">Datasheet</a>' : '') + '</div></div>';
    };
    const drawCmp = () => {
      const ids = [...chipSt.cmp].filter(E.chip);
      if (ids.length < 2) { cmp.innerHTML = '<p class="muted">Tick two or more chips above.</p>'; return; }
      const rows = E.compare(ids);
      let html = '<div class="tablewrap" style="max-height:640px;overflow:auto"><table class="esptable"><thead><tr><th></th>' + ids.map(id => '<th>' + esc(E.chip(id).name) + '</th>').join('') + '</tr></thead><tbody>', g = '';
      for (const r of rows) {
        if (r.group !== g) { g = r.group; html += '<tr class="grp"><th colspan="' + (ids.length + 1) + '">' + esc(g) + '</th></tr>'; }
        html += '<tr><th>' + esc(r.label) + '</th>' + r.values.map((v, i) => '<td class="' + (r.best[i] ? 'best' : v === '—' ? 'none' : '') + '">' + esc(v) + '</td>').join('') + '</tr>';
      }
      cmp.innerHTML = html + '</tbody></table></div><p class="small faint mt">Green marks the best value of a row. A dash means the chip has no such feature.</p>';
    };
    el.addEventListener('click', e => {
      if (e.target.closest('[data-cmp]')) return;
      const c = e.target.closest('[data-chip]');
      if (c) { chipSt.sel = c.dataset.chip; drawGrid(); drawDetail(); }
    });
    el.addEventListener('change', e => {
      const b = e.target.closest('[data-cmp]');
      if (!b) return;
      if (b.checked) { if (chipSt.cmp.size >= 5) { b.checked = false; ui.toast('Five at most'); return; } chipSt.cmp.add(b.dataset.cmp); } else chipSt.cmp.delete(b.dataset.cmp);
      drawCmp();
    });
    drawGrid(); drawDetail(); drawCmp();
  };
  T.chips.dom = true; T.chips.words = true;

  /* ---------------------------------------------------------------- boards */
  const HAS = [['display', 'Display'], ['touch', 'Touch screen'], ['bigdisplay', 'Large display'], ['epaper', 'E-paper'], ['battery', 'Battery charger'], ['lora', 'LoRa'], ['camera', 'Camera'], ['mic', 'Microphone'], ['speaker', 'Speaker'],
    ['sd', 'SD card'], ['eth', 'Ethernet'], ['gnss', 'GNSS'], ['cell', 'Cellular'], ['imu', 'Motion sensor'], ['relay', 'Relay'], ['qwiic', 'Qwiic / STEMMA QT'], ['grove', 'Grove'], ['case', 'In a case'], ['tiny', 'Thumb-sized'], ['rgb', 'RGB LED']];
  const boardSt = { maker: '', chip: '', has: new Set(), q: '', sel: null };
  T.boards = function (el, params) {
    if (!E.BOARDS.length) { el.innerHTML = '<p class="muted">The board catalogue is not loaded.</p>'; return; }
    if (params && params.get('b') && E.board(params.get('b'))) boardSt.sel = params.get('b');
    if (params && params.get('chip')) boardSt.chip = params.get('chip');
    if (params && params.get('maker')) boardSt.maker = params.get('maker');
    const makers = [...new Set(E.BOARDS.map(b => b.maker))].sort((a, b) => (a === 'Espressif' ? -1 : b === 'Espressif' ? 1 : a.localeCompare(b)));
    const chips = E.CHIPS.filter(c => E.BOARDS.some(b => b.chip === c.id));
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">' + E.BOARDS.length + ' boards from ' + makers.length + ' makers, all built on Espressif chips. Filter by maker, chip or what the board carries; click one for its details, its quirks and the page of its maker. Board facts come from the makers\' own pages — check the current revision before you solder.</p>' +
      '<div class="toolbar"><select class="inp bmaker"><option value="">All makers</option>' + makers.map(m => '<option' + (m === boardSt.maker ? ' selected' : '') + '>' + esc(m) + '</option>').join('') + '</select>' +
      '<select class="inp bchip"><option value="">All chips</option>' + chips.map(c => '<option value="' + c.id + '"' + (c.id === boardSt.chip ? ' selected' : '') + '>' + esc(c.name) + '</option>').join('') + '</select>' +
      '<input type="search" class="inp bq" placeholder="Find a board: Core2, XIAO, T-Display, Feather, CYD …" style="flex:1;min-width:200px" value="' + esc(boardSt.q) + '"></div>' +
      '<div class="espneeds" style="margin-bottom:12px">' + HAS.map(([k, t]) => '<button class="espneed' + (boardSt.has.has(k) ? ' on' : '') + '" data-has="' + k + '">' + t + '</button>').join('') + '</div>' +
      '<div class="bdetail"></div><div class="small muted bcount" style="margin:10px 0 6px"></div><div class="espgrid bgrid"></div>';
    const grid = ui.$('.bgrid', el), detail = ui.$('.bdetail', el), count = ui.$('.bcount', el);
    const norm = s => String(s || '').toLowerCase();
    const filtered = () => E.BOARDS.filter(b => (!boardSt.maker || b.maker === boardSt.maker) && (!boardSt.chip || b.chip === boardSt.chip) &&
      [...boardSt.has].every(h => (b.has || []).includes(h)) && (!boardSt.q || norm(b.name + ' ' + b.maker + ' ' + (b.family || '') + ' ' + (b.part || '')).includes(norm(boardSt.q))));
    const drawGrid = () => {
      const list = filtered().sort((a, b) => (b.pop || 0) - (a.pop || 0) || a.name.localeCompare(b.name));
      count.textContent = list.length + ' board' + (list.length === 1 ? '' : 's');
      grid.innerHTML = list.slice(0, 240).map(b => {
        const c = E.chip(b.chip);
        return '<div class="espcard' + (b.id === boardSt.sel ? ' on' : '') + '" data-board="' + b.id + '" style="--eh:' + (c ? chipHue(c) : 8) + '" role="button" tabindex="0"><b>' + esc(b.name) + '</b><span class="sub">' + esc(b.maker) + (c ? ' · ' + esc(c.name) : '') + (b.role === 'co' ? ' (as radio co-processor)' : '') + '</span>' +
          '<div class="tags">' + (b.has || []).slice(0, 7).map(h => '<span class="esptag">' + esc((HAS.find(x => x[0] === h) || [h, h])[1]) + '</span>').join('') + (b.status && /discont|eol|retired/i.test(b.status) ? '<span class="esptag w">discontinued</span>' : '') + '</div></div>';
      }).join('') || '<p class="muted">No board matches these filters.</p>';
    };
    const li = xs => (xs || []).map(x => '<li>' + H.inline(String(x)) + '</li>').join('');
    const drawDetail = () => {
      const b = boardSt.sel && E.board(boardSt.sel);
      if (!b) { detail.innerHTML = ''; return; }
      const c = E.chip(b.chip);
      const fact = (k, v) => v == null || v === '' || v === false ? '' : '<tr><td style="white-space:nowrap;color:var(--muted);padding-right:10px">' + k + '</td><td>' + v + '</td></tr>';
      const pins = b.pins ? Object.entries(b.pins) : [];
      detail.innerHTML = '<div class="boxy" style="margin-bottom:6px"><h3 style="font-size:19px">' + esc(b.name) + ' <span class="small muted" style="font-weight:400">' + esc(b.maker) + (b.family ? ' · ' + esc(b.family) : '') + (b.year ? ' · ' + b.year : '') + '</span></h3>' +
        '<div class="espcols">' +
          '<div><table style="font-size:13.5px;line-height:1.5">' +
            fact('Chip', (c ? '<a href="#/tools/chips?c=' + c.id + '">' + esc(c.name) + '</a>' : esc(b.chip || '')) + (b.part ? ' — ' + esc(b.part) : '') + (b.role === 'co' ? ' <span class="esptag w">radio co-processor, not the main MCU</span>' : '')) +
            fact('Memory', [b.flash ? esc(b.flash) + ' flash' : '', b.psram ? esc(b.psram) + ' PSRAM' : ''].filter(Boolean).join(', ')) +
            fact('USB', b.usb ? esc([b.usb.conn, b.usb.bridge].filter(Boolean).join(' · ')) : '') +
            fact('Display', b.display ? esc(b.display) : '') + fact('Battery', b.battery ? esc(b.battery) : '') +
            fact('On board', (b.onboard || []).map(esc).join(' · ')) + fact('Expansion', (b.expansion || []).map(esc).join(' · ')) +
            fact('Size', b.size ? b.size.join(' × ') + ' mm' : '') + fact('Software', (b.software || []).map(esc).join(', ')) + fact('Status', esc(b.status || '')) +
          '</table></div>' +
          '<div class="boxy espgood"><h3>Good for</h3><ul>' + li(b.good) + '</ul></div>' +
          '<div class="boxy espbad"><h3>Watch out</h3><ul>' + li(b.watch) + '</ul></div>' +
        '</div>' +
        (pins.length ? '<details class="deriv"' + (pins.length <= 14 ? ' open' : '') + '><summary>Fixed pin assignments (' + pins.length + ')</summary><div class="dbody"><div class="row" style="flex-wrap:wrap;gap:6px">' + pins.map(([k, v]) => '<span class="esptag"><b>' + esc(k.replace(/_/g, ' ')) + '</b> ' + esc(Array.isArray(v) ? v.join(', ') : String(v)) + '</span>').join('') + '</div></div></details>' : '') +
        '<div class="row mt" style="gap:6px;flex-wrap:wrap">' + (b.headers && b.headers.length ? '<a class="btn sm pri" href="#/tools/pinout?board=' + b.id + '">' + H.icon('chip', 14) + 'Pinout</a>' : (c ? '<a class="btn sm" href="#/tools/pinout?chip=' + c.id + '">' + H.icon('chip', 14) + 'Pins of the ' + esc(c.name) + '</a>' : '')) +
        (b.page && H.nodes.has(b.page) ? '<a class="btn sm" href="#/c/' + b.page + '">' + H.icon('book', 14) + esc(H.titleOf(b.page)) + '</a>' : '') +
        (b.src ? '<a class="btn sm ghost" href="' + esc(b.src) + '" target="_blank" rel="noopener">The maker\'s page</a>' : '') + '</div></div>';
    };
    el.addEventListener('click', e => {
      const h = e.target.closest('[data-has]');
      if (h) { const k = h.dataset.has; if (boardSt.has.has(k)) boardSt.has.delete(k); else boardSt.has.add(k); h.classList.toggle('on'); drawGrid(); return; }
      const b = e.target.closest('[data-board]');
      if (b) { boardSt.sel = b.dataset.board; drawGrid(); drawDetail(); detail.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    });
    ui.$('.bmaker', el).addEventListener('change', e => { boardSt.maker = e.target.value; drawGrid(); });
    ui.$('.bchip', el).addEventListener('change', e => { boardSt.chip = e.target.value; drawGrid(); });
    ui.$('.bq', el).addEventListener('input', U.debounce(e => { boardSt.q = ui.$('.bq', el).value; drawGrid(); }, 120));
    drawGrid(); drawDetail();
  };
  T.boards.dom = true; T.boards.words = true;
})();
