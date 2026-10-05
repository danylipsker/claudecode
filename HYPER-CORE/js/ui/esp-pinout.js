/* HYPER-CORE · ui/esp-pinout.js
 *
 * Hyper ESP32 · Tools → Pinout explorer
 *
 *   #/tools/pinout/explore   a board drawn with its header pins, coloured by what each can do; or a chip, GPIO by GPIO.
 *                            Filters show the pins that suit a job; a click explains one pin.
 *   #/tools/pinout/plan      a pin planner: say what must be connected (an I2C sensor, three buttons, a servo …) and
 *                            get an assignment with its reasons, its warnings and the pin definitions as code.
 *   #/tools/pinout/boot      the strapping pins of a chip and what each decides at reset.
 *
 * Data: Hyper.esp.PINS (from the datasheets) and the headers of Hyper.esp.BOARDS (from the makers' pinout tables).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, E = H.esp;
  const T = H.espTools = H.espTools || {};
  const S = () => H.esym;

  const st = { board: null, chip: 'esp32', mode: 'kind', sel: null, jobs: null, wifi: true };
  const MODES = [
    ['kind', 'Everything, by kind'], ['safe', 'Safe to use for anything'], ['output', 'Can be an output'], ['adc', 'Analogue input (ADC)'], ['adc-wifi', 'Analogue input that works with Wi-Fi on'],
    ['touch', 'Capacitive touch'], ['dac', 'Analogue output (DAC)'], ['wake', 'Can wake from deep sleep'], ['care', 'Needs care: strapping, flash, USB, serial']
  ];
  const boardsWithHeaders = () => E.BOARDS.filter(b => b.headers && b.headers.length && E.PINS[b.chip]);
  const target = () => (st.board && E.board(st.board)) || null;
  const chipId = () => (target() ? target().chip : st.chip);

  function pickers(el, onChange) {
    const boards = boardsWithHeaders();
    const makers = [...new Set(boards.map(b => b.maker))].sort((a, b) => (a === 'Espressif' ? -1 : b === 'Espressif' ? 1 : a.localeCompare(b)));
    const bar = ui.el('<div class="toolbar"><label class="small muted">Board</label><select class="inp pboard" style="max-width:340px"><option value="">— a bare chip —</option>' +
      makers.map(m => '<optgroup label="' + esc(m) + '">' + boards.filter(b => b.maker === m).sort((a, b) => a.name.localeCompare(b.name)).map(b => '<option value="' + b.id + '"' + (b.id === st.board ? ' selected' : '') + '>' + esc(b.name) + '</option>').join('') + '</optgroup>').join('') + '</select>' +
      '<label class="small muted">or chip</label><select class="inp pchip">' + Object.keys(E.PINS).map(id => '<option value="' + id + '"' + (id === chipId() ? ' selected' : '') + '>' + esc((E.chip(id) || { name: id }).name) + '</option>').join('') + '</select></div>');
    el.appendChild(bar);
    const sb = ui.$('.pboard', bar), sc = ui.$('.pchip', bar);
    sb.addEventListener('change', () => { st.board = sb.value || null; if (st.board) { st.chip = E.board(st.board).chip; sc.value = st.chip; } st.sel = null; onChange(); });
    sc.addEventListener('change', () => { st.chip = sc.value; st.board = null; sb.value = ''; st.sel = null; onChange(); });
  }
  const levelTag = lv => lv === 'avoid' ? '<span class="esptag n" style="text-decoration:none;opacity:1;color:var(--bad);border-color:var(--bad)">do not use</span>' : lv === 'caution' ? '<span class="esptag w">with care</span>' : lv === 'yes' ? '<span class="esptag y">free to use</span>' : '';
  function pinCard(chip, p) {
    if (!p) return '<div class="esppin"><h4>Click a pin</h4><p class="muted" style="margin:0">Each pin tells what it can do, what it does at power-up, and whether it is safe for an ordinary job.</p></div>';
    if (p.gpio == null) {
      const kind = E.pinKind(chip, p);
      const say = { gnd: 'Ground: the 0 V reference. Every part of a circuit shares it.', power: /5|VIN|VBUS|USB/i.test(p.label) ? 'A supply pin at USB or input voltage (about 5 V). It is not a logic pin — never connect it to a GPIO.' : /BAT/i.test(p.label) ? 'The battery connection (3.0–4.2 V for a lithium cell).' : 'The 3.3 V supply the chip runs on. It can feed small sensors; how much it can give depends on the board\'s regulator.',
        ctrl: 'The chip-enable (reset) pin: pulling it low restarts the chip. It has a pull-up and usually a button.', nc: 'Not connected.', adc: 'The analogue input of the ESP8266: 0 to 1 V at the chip (boards add a divider to accept 3.3 V).' }[kind] || '';
      return '<div class="esppin"><h4>' + esc(p.label) + '</h4><p style="margin:0">' + say + '</p></div>';
    }
    const g = E.pin(chip, p.gpio), v = E.pinVerdict(chip, p.gpio);
    if (!g) return '<div class="esppin"><h4>GPIO' + p.gpio + '</h4><p class="muted" style="margin:0">No data for this pin.</p></div>';
    return '<div class="esppin"><h4>GPIO' + g.n + (p.label && p.label !== String(g.n) ? ' <span class="small muted" style="font-weight:400">printed “' + esc(p.label) + '”</span>' : '') + ' ' + levelTag(v.level) + '</h4>' +
      '<div class="row">' + E.pinCaps(chip, g.n).map(c => '<span class="esptag">' + esc(c) + '</span>').join('') + '</div>' +
      '<p style="margin:4px 0">' + esc(v.text) + '</p>' +
      (g.strap ? '<p style="margin:4px 0"><b>At reset:</b> ' + esc(g.strap) + '</p>' : '') +
      (g.pull ? '<p class="small muted" style="margin:4px 0">Internal pull-' + esc(g.pull) + ' at reset.</p>' : '') +
      (g.glitch ? '<p class="small muted" style="margin:4px 0">Its level moves briefly during power-up or boot: do not hang a relay or a motor driver on it without thought.</p>' : '') + '</div>';
  }
  const legend = kinds => '<div class="esplegend">' + kinds.map(k => '<span><i style="background:' + S().kindColor(k) + '"></i>' + esc(S().KINDS[k].name) + '</span>').join('') + '</div>';

  /* ---------------------------------------------------------------- explore */
  function explore(body) {
    body.innerHTML = '<div class="pk"></div><div class="esplab"><div class="side"><div class="pmode"></div><div class="pcard"></div><div class="prules"></div></div><div><div class="stage"></div><div class="under" style="margin-top:8px"></div></div></div>';
    const side = ui.$('.pmode', body), card = ui.$('.pcard', body), rules = ui.$('.prules', body), stageEl = ui.$('.stage', body), under = ui.$('.under', body);
    let stage = null, drawn = null, hover = -1;
    const fits = (g, mode) => {
      if (!g) return false;
      if (mode === 'care') return g.flash || g.safe === 'caution';
      return E.pinsFor(chipId(), mode).includes(g.n);
    };
    const paint = () => {
      const b = target(), chip = chipId(), P = E.PINS[chip];
      card.innerHTML = pinCard(chip, st.sel);
      const c = E.chip(chip);
      rules.innerHTML = P && P.rules && P.rules.length ? '<details class="deriv" open><summary>Pin rules of the ' + esc(c ? c.name : chip) + '</summary><div class="dbody"><ul style="padding-left:18px;font-size:13.5px;line-height:1.5">' + P.rules.map(r => '<li>' + esc(r) + '</li>').join('') + '</ul></div></details>' : '';
      if (b) {
        stageEl.style.display = '';
        if (!stage) { stage = H.kit.stage(stageEl, { aspect: 0.95, minH: 420, maxH: 760 }); wire(); }
        const ctx = stage.begin();
        const dim = st.mode === 'kind' ? null : p => p.gpio == null ? true : !fits(E.pin(chip, p.gpio), st.mode);
        const hl = {};
        if (st.sel && st.sel.gpio != null) hl[st.sel.gpio] = ui.colors().accent;
        drawn = S().board(ctx, b, { x: 8, y: 6, w: stage.W - 16, h: stage.H - 12 }, { dim, hover, highlight: hl });
        under.innerHTML = legend(['gpio', 'adc', 'touch', 'input', 'strap', 'uart', 'usb', 'flash', 'power', 'gnd', 'ctrl']) +
          (b.watch && b.watch.length ? '<p class="small muted" style="margin:8px 0 0"><b>This board:</b> ' + b.watch.map(esc).join(' ') + '</p>' : '') +
          '<p class="small faint" style="margin:6px 0 0">Pin order from the maker\'s pinout' + (b.src ? ' (<a href="' + esc(b.src) + '" target="_blank" rel="noopener">source</a>)' : '') + '. The drawing is schematic: the antenna end is at the top. Check your board\'s own silkscreen — revisions differ.</p>';
      } else {
        stageEl.style.display = 'none';
        // a bare chip: every GPIO as a tile
        const gs = P ? P.gpios : [];
        under.innerHTML = '<div class="espgrid" style="grid-template-columns:repeat(auto-fill,minmax(150px,1fr))">' + gs.map(g => {
          const kind = E.pinKind(chip, { label: String(g.n), gpio: g.n }), off = st.mode !== 'kind' && !fits(g, st.mode);
          return '<div class="espcard" data-gpio="' + g.n + '" role="button" tabindex="0" style="border-left-color:' + S().kindColor(kind) + ';opacity:' + (off ? 0.3 : 1) + (st.sel && st.sel.gpio === g.n ? ';background:var(--surface2)' : '') + '"><b style="font-size:14px">GPIO' + g.n + '</b><span class="sub">' + esc(E.pinCaps(chip, g.n).slice(0, 3).join(' · ') || 'digital I/O') + '</span></div>';
        }).join('') + '</div><div style="margin-top:10px">' + legend(['gpio', 'adc', 'touch', 'input', 'strap', 'uart', 'usb', 'flash', 'jtag']) + '</div>' +
          (P && P.src ? '<p class="small faint" style="margin:6px 0 0">From ' + esc(P.src) + '.</p>' : '');
      }
    };
    const wire = () => {
      const cv = stage.canvas;
      cv.addEventListener('pointermove', e => { if (!drawn) return; const p = stage.pos(e), i = S().boardHit(drawn, p.x, p.y); cv.style.cursor = i >= 0 ? 'pointer' : ''; if (i !== hover) { hover = i; paint(); } });
      cv.addEventListener('pointerleave', () => { if (hover !== -1) { hover = -1; paint(); } });
      cv.addEventListener('click', e => { if (!drawn) return; const p = stage.pos(e), i = S().boardHit(drawn, p.x, p.y); if (i >= 0) { const q = drawn.pins[i]; st.sel = { label: q.label, gpio: q.gpio }; paint(); } });
      stage.onResize(() => paint());
    };
    pickers(ui.$('.pk', body), paint);
    side.appendChild(ui.el('<div class="ctl"><div class="cl"><span>Show the pins that are</span></div><select class="inp pm" style="width:100%">' + MODES.map(([k, t]) => '<option value="' + k + '"' + (k === st.mode ? ' selected' : '') + '>' + t + '</option>').join('') + '</select></div>'));
    ui.$('.pm', side).addEventListener('change', e => { st.mode = e.target.value; paint(); });
    under.addEventListener('click', e => { const t = e.target.closest('[data-gpio]'); if (t) { st.sel = { label: t.dataset.gpio, gpio: +t.dataset.gpio }; paint(); } });
    T.util.onTheme(paint);
    paint();
  }

  /* ---------------------------------------------------------------- plan */
  const JOBS = [['i2c', 'An I2C bus (sensors, OLED)'], ['spi', 'An SPI bus (TFT, SD card, LoRa)'], ['uart', 'A second serial port (GPS, RS-485)'], ['adc', 'An analogue input'], ['button', 'A button'], ['in', 'A digital input'],
    ['out', 'A digital output (relay, LED)'], ['pwm', 'A PWM output (dimmer, motor)'], ['servo', 'A servo'], ['neopixel', 'An addressable LED strip'], ['onewire', 'A 1-Wire sensor (DS18B20)'], ['touch', 'A touch pad'], ['dac', 'An analogue output (DAC)'],
    ['wake', 'A wake-up pin for deep sleep'], ['i2s', 'I2S audio']];
  function plan(body) {
    if (!st.jobs) st.jobs = [{ what: 'i2c', n: 1 }, { what: 'adc', n: 1 }, { what: 'button', n: 2 }, { what: 'pwm', n: 1 }];
    body.innerHTML = '<p class="muted" style="margin:0 0 10px">List what the project must connect. The planner gives each job a pin, keeping scarce pins (ADC, touch, DAC) for the jobs that need them and leaving strapping, USB and serial-console pins for last — and says why.</p>' +
      '<div class="pk"></div><div class="espcols"><div class="boxy"><h3>Jobs</h3><div class="pjobs"></div>' +
      '<div class="row mt" style="gap:6px;flex-wrap:wrap"><select class="inp padd">' + JOBS.map(([k, t]) => '<option value="' + k + '">' + t + '</option>').join('') + '</select><button class="btn sm pri pgo">Add</button></div>' +
      '<label class="ctl chk" style="margin-top:10px"><input type="checkbox" class="pwifi"' + (st.wifi ? ' checked' : '') + '>The project uses Wi-Fi (analogue inputs must work with it on)</label></div>' +
      '<div class="boxy"><h3>Assignment</h3><div class="pres"></div></div></div><div class="pcode" style="margin-top:12px"></div>';
    const jobsEl = ui.$('.pjobs', body), res = ui.$('.pres', body), code = ui.$('.pcode', body);
    const paint = () => {
      jobsEl.innerHTML = st.jobs.length ? st.jobs.map((j, i) => '<div class="row" style="gap:8px;align-items:center;margin:4px 0"><input type="number" min="1" max="16" value="' + j.n + '" data-n="' + i + '" class="inp" style="width:58px;height:28px">' +
        '<span style="flex:1">' + esc((JOBS.find(x => x[0] === j.what) || [0, j.what])[1]) + '</span><button class="btn sm ghost" data-del="' + i + '">Remove</button></div>').join('') : '<p class="muted">Nothing yet.</p>';
      const tgt = target() || chipId();
      const r = E.planPins(tgt, st.jobs, { wifi: st.wifi });
      res.innerHTML = (r.assign.length ? '<table class="optable"><thead><tr><th>Job</th><th>Pin</th><th>Why</th></tr></thead><tbody>' + r.assign.map(a => '<tr><td>' + esc(a.name) + (a.role ? ' <span class="muted">' + esc(a.role) + '</span>' : '') + '</td><td><b style="color:' + (a.level === 'none' ? 'var(--bad)' : a.level === 'caution' ? 'var(--warn)' : 'var(--ok)') + '">' + (a.gpio == null ? '—' : 'GPIO' + a.gpio) + '</b></td><td class="small">' + esc(a.why) + '</td></tr>').join('') + '</tbody></table>' : '<p class="muted">Add a job.</p>') +
        (r.warnings.length ? '<div class="callout co-warn" style="margin-top:10px"><div class="co-h">Careful</div><ul style="margin:0;padding-left:18px">' + r.warnings.map(w => '<li>' + esc(w) + '</li>').join('') + '</ul></div>' : '') +
        (r.free.length ? '<p class="small muted mt">Still free and unproblematic: ' + r.free.map(n => 'GPIO' + n).join(', ') + '.</p>' : '<p class="small muted mt">No unproblematic pin is left.</p>');
      code.innerHTML = '';
      if (r.cpp && ui.codeCard) code.appendChild(ui.codeCard({ title: 'The pin definitions', cpp: r.cpp, py: r.py, na: { blocks: 'Block environments ask for the pin number in each block: use the numbers of the table above.' } }));
    };
    pickers(ui.$('.pk', body), paint);
    body.addEventListener('click', e => {
      const d = e.target.closest('[data-del]');
      if (d) { st.jobs.splice(+d.dataset.del, 1); paint(); return; }
      if (e.target.closest('.pgo')) { const k = ui.$('.padd', body).value, ex = st.jobs.find(j => j.what === k); if (ex) ex.n = Math.min(16, ex.n + 1); else st.jobs.push({ what: k, n: 1 }); paint(); }
    });
    body.addEventListener('change', e => {
      const n = e.target.closest('[data-n]');
      if (n) { st.jobs[+n.dataset.n].n = Math.max(1, Math.min(16, +n.value || 1)); paint(); }
      if (e.target.closest('.pwifi')) { st.wifi = e.target.checked; paint(); }
    });
    paint();
  }

  /* ---------------------------------------------------------------- boot */
  function boot(body) {
    body.innerHTML = '<p class="muted" style="margin:0 0 10px">A few pins are read once, at the instant the chip leaves reset, to decide how it starts: run the program or wait for a new one, which voltage the flash gets, whether the boot messages are printed. Afterwards they are ordinary pins — but whatever is wired to them must not hold them at the wrong level during reset.</p><div class="pk"></div><div class="bbody"></div>';
    const out = ui.$('.bbody', body);
    const paint = () => {
      const chip = chipId(), P = E.PINS[chip], c = E.chip(chip);
      if (!P) { out.innerHTML = '<p class="muted">No data.</p>'; return; }
      out.innerHTML = '<h3 style="margin:6px 0 8px">Strapping pins of the ' + esc(c ? c.name : chip) + '</h3>' +
        T.util.table(['Pin', 'What it decides', 'For a normal start', 'Internal pull'], (P.strapping || []).map(s => ['<b>GPIO' + s.gpio + '</b>', esc(s.meaning || ''), esc(String(s.level == null ? '' : s.level)), esc(s.pull || 'none')])) +
        '<div class="callout co-tip" style="margin-top:12px"><div class="co-h">In practice</div><p>Do not put a button to ground, an LED to the supply, or a sensor output on a strapping pin unless you have checked the level it gives at power-up. Entering download mode by hand: hold the BOOT button (GPIO' + ((P.defaults || {}).boot != null ? P.defaults.boot : '0') + '), tap reset, release BOOT.</p></div>' +
        (P.defaults ? '<h3 style="margin:16px 0 8px">Default pins in the Arduino core</h3>' + T.util.table(['Function', 'GPIO'], [['Serial (UART0) TX / RX', [P.defaults.tx, P.defaults.rx].join(' / ')], ['I2C SDA / SCL', [P.defaults.sda, P.defaults.scl].join(' / ')], ['SPI SCK / MISO / MOSI / SS', [P.defaults.sck, P.defaults.miso, P.defaults.mosi, P.defaults.ss].join(' / ')], ['Boot button', P.defaults.boot == null ? '—' : P.defaults.boot]].map(r => [r[0], '<b>' + esc(String(r[1])) + '</b>'])) +
          '<p class="small faint mt">Defaults of the generic board definition; a board\'s own definition may differ. Any of these can be moved to other pins in software.</p>' : '') +
        T.util.more(['strapping-pins', 'boot-modes-and-download-mode', 'pins-at-boot']);
    };
    pickers(ui.$('.pk', body), paint);
    paint();
  }

  T.pinout = function (el, params, sub) {
    if (!E || !Object.keys(E.PINS).length) { el.innerHTML = '<p class="muted">The pin tables are not loaded.</p>'; return; }
    if (params && params.get('board') && E.board(params.get('board'))) { st.board = params.get('board'); st.chip = E.board(st.board).chip; st.sel = null; }
    else if (params && params.get('chip') && E.PINS[params.get('chip')]) { st.chip = params.get('chip'); st.board = null; st.sel = null; }
    // the first visit opens on the board most people own
    else if (!st.touched) { const d = E.board('esp32-devkitc-v4') || boardsWithHeaders()[0]; if (d) { st.board = d.id; st.chip = d.chip; } }
    st.touched = true;
    const { tab, body } = T.util.subtabs(el, 'pinout', [['explore', 'Explore'], ['plan', 'Pin planner'], ['boot', 'Boot and strapping']], sub);
    ({ explore, plan, boot })[tab](body);
  };
  T.pinout.tabs = ['explore', 'plan', 'boot'];
  T.pinout.dom = true; T.pinout.words = true;
})();
