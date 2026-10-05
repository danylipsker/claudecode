/* HYPER-ESP32 · sims/device-security.js
 *
 * Simulations of the topic "Securing the device". Defensive only: they show what each protection closes and what it costs.
 * Nothing here touches a chip, burns a fuse or breaks anything.
 *
 *   ds-attacker-doors    the doors of a device in someone's hand, and which protection closes which (focus: model | debug | physical)
 *   ds-chain-of-trust    secure boot: the checks from the ROM to the program, lighting link by link, and where an altered image stops
 *   ds-flash-contents    what a reader of the flash chip sees, with and without encryption; a block altered by hand (focus: nvs)
 *   ds-efuse-keys        the key blocks of the eFuses: purposes, read protection, the Key Manager
 *   ds-signing-oracle    a key that signs without being read: file, encrypted flash, DS peripheral, HMAC, secure element
 *   ds-rollback          signed updates, the rollback of a bad update and the one-way counter against old versions
 *   ds-two-worlds        a trusted world beside the application, and what the permission controller refuses
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- small helpers shared by the simulations */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const inside = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  const clip = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, Math.max(1, n - 1)) + '…' : s; };
  const MONO = 'Consolas, "Cascadia Mono", "Courier New", monospace';
  const h2 = v => (v < 16 ? '0' : '') + (v & 255).toString(16).toUpperCase();
  // a small deterministic hash: the same input always gives the same bytes (so a picture does not flicker)
  function hash(a, b, c) {
    let h = Math.imul((a | 0) + 0x9e3779b9, 2654435761) ^ Math.imul((b | 0) + 0x7f4a7c15, 2246822519) ^ Math.imul((c | 0) + 0x165667b1, 3266489917);
    h ^= h >>> 15; h = Math.imul(h, 2246822519); h ^= h >>> 13; h = Math.imul(h, 3266489917); h ^= h >>> 16;
    return h >>> 0;
  }
  // a paragraph wrapped to a width: draws at most `max` lines, returns the height used
  function paragraph(kit, c, text, x, y, w, o) {
    o = o || {};
    const size = o.size || 11.5, lh = o.lh || size + 4, max = o.max || 4;
    c.save(); c.font = (o.weight || 500) + ' ' + size + 'px system-ui, "Segoe UI", sans-serif';
    const words = String(text == null ? '' : text).split(' '), lines = [];
    let cur = '';
    for (const wd of words) {
      const t = cur ? cur + ' ' + wd : wd;
      if (c.measureText(t).width > w * 0.96 && cur) { lines.push(cur); cur = wd; } else cur = t;
    }
    if (cur) lines.push(cur);
    c.restore();
    lines.slice(0, max).forEach((ln, i) => kit.label(c, i === max - 1 && lines.length > max ? ln + '…' : ln, x, y + i * lh, { size, color: o.color, weight: o.weight, align: o.align }));
    return Math.min(lines.length, max) * lh;
  }
  // what the catalogue says about a chip's security, as one text
  const secText = chip => ((chip && chip.security) || []).join(' | ');
  const hasHmac = chip => !/\bno HMAC\b/i.test(secText(chip)) && /HMAC/i.test(secText(chip));
  const hasKeyManager = chip => !/\bno Key Manager\b/i.test(secText(chip)) && /Key Manager/i.test(secText(chip));
  const noSecurity = chip => !chip || !chip.security || !chip.security.length || /^none\b/i.test(chip.security[0]);

  /* ================================================================ ds-chain-of-trust */
  const CASES = [
    { id: 'ok', name: 'The signed release, unchanged', fail: -1 },
    { id: 'app', name: 'One byte of the application changed', fail: 1, why: 'The signature no longer matches the application, so the bootloader does not start it.' },
    { id: 'boot', name: 'The bootloader replaced by an unsigned one', fail: 0, why: 'The ROM cannot match the bootloader to the key digest in the eFuses, so it does not hand over control.' },
    { id: 'key', name: 'The application signed with someone else\'s key', fail: 1, why: 'The signature is valid, but the key behind it does not hash to any digest in the eFuses.' },
    { id: 'old', name: 'An older version, genuinely signed', fail: -1, why: 'Every check passes: the signature is genuine. Stopping an old version needs the anti-rollback counter.' }
  ];
  const STEP = 0.9;      // seconds from one link of the chain to the next
  Hyper.sim('ds-chain-of-trust', {
    title: 'The chain of trust, link by link',
    blurb: `The picture shows the first moments after power-on. Each stage checks the signature of the next against the **digest of the owner's public key** that was burned into the eFuses: a green tick lets the chain go on, a red cross stops it there. This is **a simulation: nothing touches a real chip**.

**Try this**
- Leave it at *the signed release*: every link lights green and the program runs.
- Change one byte of the **application**: the bootloader's check fails and the program never starts.
- Replace the **bootloader**: now the ROM refuses, one link earlier.
- Pick *signed with someone else's key*: the signature is perfectly valid, but not the owner's.
- Pick *an older version, genuinely signed*: every check passes. Secure boot alone does not stop a rollback.
- Switch secure boot **off**: no link checks anything, and even the altered image runs.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 340, maxH: 400 });
      const ids = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-c2', 'esp32-c5', 'esp32-c61', 'esp32-h2', 'esp32-p4', 'esp8266'].filter(id => E.chip(id));
      let anim = 0;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: ids.includes(params && params.chip) ? params.chip : 'esp32-c3' },
        { id: 'case', type: 'select', label: 'What was changed', options: CASES.map(k => [k.name, k.id]), value: 'ok' },
        { id: 'sb', type: 'check', label: 'Secure boot enabled in the eFuses', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Power on', primary: true }] }
      ], () => { anim = 0; loop.start(); });
      const ro = kit.readout(box.side, [['res', 'Result'], ['why', 'Because'], ['scheme', 'Scheme (catalogue)']]);
      function layout() {
        const W = st.W, M = 12, narrow = W < 560, R = { narrow, M };
        if (!narrow) {
          const gap = Math.min(54, W * 0.07), bw = (W - 2 * M - 3 * gap) / 4, bh = 70, y = 104;
          R.stages = [0, 1, 2, 3].map(i => ({ x: M + i * (bw + gap), y, w: bw, h: bh }));
          R.efuse = { x: R.stages[0].x, y: 16, w: 2 * bw + gap, h: 44 };
          R.res = { x: M, y: y + bh + 48, w: W - 2 * M };
        } else {
          const bh = 34, gap = 20, y0 = 60;
          R.stages = [0, 1, 2, 3].map(i => ({ x: M + 34, y: y0 + i * (bh + gap), w: W - 2 * M - 34, h: bh }));
          R.efuse = { x: M, y: 8, w: W - 2 * M, h: 40 };
          R.res = { x: M, y: y0 + 4 * (bh + gap) + 4, w: W - 2 * M };
        }
        return R;
      }
      // who rejects what, and the words for it
      function verdict() {
        const chip = E.chip(ctl.values.chip), k = CASES.find(x => x.id === ctl.values.case) || CASES[0];
        const hw = !noSecurity(chip), on = !!ctl.values.sb && hw;
        const ok0 = !(on && k.fail === 0), ok1 = ok0 && !(on && k.fail === 1);
        const tampered = k.id === 'boot' || k.id === 'app' || k.id === 'key';
        let res, why;
        if (!hw) { res = 'No secure boot on this chip'; why = 'The chip has no hardware for it: whatever is in the flash runs.'; }
        else if (!on) { res = tampered ? 'Runs the altered image' : 'Runs the image, unchecked'; why = 'Secure boot is off: nothing compares any image with a key, so nothing can refuse one.'; }
        else if (!ok0) { res = 'Stops: the ROM refused the bootloader'; why = k.why; }
        else if (!ok1) { res = 'Stops: the bootloader refused the application'; why = k.why + ' With a second valid image in another slot it could fall back to that.'; }
        else { res = k.id === 'old' ? 'Runs the old version' : 'Runs the signed release'; why = k.id === 'old' ? k.why : 'Both signatures match the key digest in the eFuses.'; }
        return { chip, hw, on, ok0, ok1, tampered, k, res, why };
      }
      const loop = kit.loop(dt => {
        anim += dt;
        const c = st.begin(), C = kit.colors(), V = verdict(), R = layout(), M = R.M;
        const done = anim >= 3 * STEP + 0.5;
        const names = [['ROM bootloader', 'in the chip, fixed'], ['Bootloader', 'second stage'], ['Application', 'your program'], ['Program runs', 'at last']];
        // state of the stage i (0 ROM, 1 bootloader, 2 application, 3 running): idle, ok, bad, skipped
        const stageState = i => {
          if (i === 0) return 'ok';
          if (anim < i * STEP) return 'idle';
          if (!V.on) return 'ok';
          if (i === 1) return V.ok0 ? 'ok' : 'bad';
          if (!V.ok0) return 'skipped';
          if (i === 2) return V.ok1 ? 'ok' : 'bad';
          return V.ok1 ? 'ok' : 'skipped';
        };
        // the eFuse box and its two wires
        const ef = R.efuse;
        S.box(c, ef.x, ef.y, ef.w, ef.h, { label: 'eFuses: digest of the owner\'s public key', sub: V.hw ? (V.on ? 'burned and write-protected' : 'empty: no key burned') : 'this chip has none', color: V.on ? C.ok : C.faint, dash: !V.on, size: 11.5 });
        const wireCol = V.on ? C.ok : C.faint;
        if (!R.narrow) {
          for (const i of [0, 1]) { const s = R.stages[i]; S.wire(c, [[s.x + s.w / 2, ef.y + ef.h], [s.x + s.w / 2, s.y]], { color: wireCol, dash: !V.on }); }
        } else {
          const lx = M + 12;
          S.wire(c, [[lx, ef.y + ef.h], [lx, R.stages[1].y + R.stages[1].h / 2]], { color: wireCol, dash: !V.on });
          for (const i of [0, 1]) { const s = R.stages[i]; S.wire(c, [[lx, s.y + s.h / 2], [s.x, s.y + s.h / 2]], { color: wireCol, dash: !V.on }); }
        }
        // the stages
        R.stages.forEach((s, i) => {
          const state = stageState(i);
          const col = state === 'ok' ? (V.on || i === 0 ? C.ok : C.warn) : state === 'bad' ? C.bad : C.faint;
          S.box(c, s.x, s.y, s.w, s.h, { label: names[i][0], sub: R.narrow ? null : names[i][1], color: col, active: state === 'ok' || state === 'bad', dash: state === 'idle' || state === 'skipped', size: R.narrow ? 12 : 12.5 });
          if (state === 'bad') kit.label(c, 'refused', s.x + s.w - 8, s.y + 10, { size: 10.5, color: C.bad, align: 'right', weight: 650 });
          if (state === 'skipped') kit.label(c, 'never reached', s.x + s.w - 8, s.y + 10, { size: 10, color: C.faint, align: 'right' });
          // what the image carries
          if (i === 1 || i === 2) {
            const wrong = (i === 1 && V.k.id === 'boot') || (i === 2 && (V.k.id === 'app' || V.k.id === 'key'));
            const tag = i === 1 ? (V.k.id === 'boot' ? 'unsigned' : 'signed: owner') : V.k.id === 'app' ? 'signed, then altered' : V.k.id === 'key' ? 'signed: someone else' : V.k.id === 'old' ? 'signed: owner (old)' : 'signed: owner';
            const tx = R.narrow ? s.x + s.w - 8 : s.x + s.w / 2, ty = R.narrow ? s.y + s.h - 9 : s.y + s.h + 14;
            kit.label(c, tag, tx, ty, { size: 10.5, color: wrong ? C.bad : C.muted, align: R.narrow ? 'right' : 'center', weight: wrong ? 650 : 500 });
          }
        });
        // the links with their ticks
        for (let k = 0; k < 3; k++) {
          const a = R.stages[k], b = R.stages[k + 1];
          const x1 = R.narrow ? a.x + a.w / 2 : a.x + a.w + 3, y1 = R.narrow ? a.y + a.h + 1 : a.y + a.h / 2;
          const x2 = R.narrow ? b.x + b.w / 2 : b.x - 3, y2 = R.narrow ? b.y - 1 : b.y + b.h / 2;
          const t0 = k * STEP, t1 = (k + 1) * STEP, f = clamp((anim - t0) / (t1 - t0), 0, 1);
          const passes = k === 0 ? V.ok0 : k === 1 ? V.ok0 && V.ok1 : V.ok0 && V.ok1;
          const decided = anim >= t1 && (k === 0 || (k === 1 ? V.ok0 : V.ok0 && V.ok1));
          const reached = k === 0 || (k === 1 ? V.ok0 : V.ok0 && V.ok1);
          kit.arrow(c, x1, y1, x2, y2, reached ? (decided ? (V.on ? (passes ? C.ok : C.bad) : C.warn) : C.muted) : C.faint, 2);
          if (reached && f > 0 && f < 1) kit.dot(c, x1 + (x2 - x1) * f, y1 + (y2 - y1) * f, 4.5, C.accent);
          const lx = R.narrow ? x1 + 10 : (x1 + x2) / 2, ly = R.narrow ? (y1 + y2) / 2 : y1 - 14;
          const lab = k < 2 ? (V.on ? 'checks signature' : 'no check') : 'jumps to it';
          if (reached) kit.label(c, k < 2 ? (R.narrow ? lab : (V.on ? 'checks' : 'no check')) : 'jumps', lx, ly, { size: 10, color: C.muted, align: R.narrow ? 'left' : 'center' });
          if (decided && k < 2 && V.on) kit.label(c, passes ? '✓' : '✗', R.narrow ? x1 - 12 : (x1 + x2) / 2, R.narrow ? ly : y1 + 14, { size: 16, weight: 700, color: passes ? C.ok : C.bad, align: 'center' });
        }
        // the result
        const rs = R.res;
        const final = V.on ? (V.ok0 && V.ok1) : true;
        const col = !V.on ? (V.tampered ? C.bad : C.warn) : final ? C.ok : C.bad;
        if (done) {
          kit.label(c, V.res, rs.x, rs.y, { size: 13.5, weight: 700, color: col });
          paragraph(kit, c, V.why, rs.x, rs.y + 20, rs.w, { size: 11.5, color: C.text2, max: 3 });
        } else kit.label(c, 'powering on …', rs.x, rs.y, { size: 12.5, color: C.muted });
        ro.set('res', done ? V.res : 'powering on …');
        ro.set('why', done ? V.why : '—');
        const line = V.chip && V.chip.security && V.chip.security[0];
        ro.set('scheme', line ? clip(line, 150) : 'not listed');
        if (done) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ds-flash-contents */
  // sixteen bytes a row. Fake settings, with one row repeated; fake program text mixed with bytes that look like machine code
  const lcg = (seed, n) => { const out = []; let x = seed >>> 0; for (let i = 0; i < n; i++) { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; out.push((x >>> 24) & 255); } return out; };
  const bytesOf = s => Array.from(s).map(ch => ch.charCodeAt(0) & 255);
  const FLASH_SETS = {
    settings: { rows: ['ssid=HomeNet-5G ', 'pass=Lemon!Tree7', 'mqtt_user=meter1', 'mqtt_pass=Qp3x9a', 'api_token=a91f3c', 'device_id=0042  ', 'api_token=a91f3c', 'calib=1.0342    '].map(bytesOf), same: [4, 6] },
    code: { rows: [bytesOf('Connecting to %s'), lcg(11, 16), bytesOf('https://api.exam'), lcg(23, 16), bytesOf('ple.com/v1/data\0'), lcg(37, 16), bytesOf('Connecting to %s'), lcg(41, 16)], same: [0, 6] }
  };
  const FLASH_BASE = 0x10000;
  const ascii = b => (b >= 32 && b < 127 ? String.fromCharCode(b) : '.');
  Hyper.sim('ds-flash-contents', {
    title: 'What a reader of the flash chip sees',
    blurb: `The top panel is **the memory chip as someone holding the board would read it**: addresses, bytes and their text. The lower panel is **what the program sees** once the chip has decrypted. Everything here is made-up sample data, and **nothing touches a real chip**.

**Try this**
- With encryption **off**, read the passwords straight from the chip, and notice rows 5 and 7 are identical.
- Switch it **on**: the same bytes look like noise, and rows 5 and 7 now differ, because the address is mixed into the cipher.
- Click a row of the top panel to *alter it by hand*. Off, you change exactly the character you choose. On, the chip decrypts the block to garbage: an attacker can break a block but not write a value.
- Compare the chips: the cipher in the catalogue differs between the ESP32 and the later ones.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const nvs = !!(params && params.focus === 'nvs');
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 372, maxH: 410 });
      const edited = {};
      let hits = [];
      const ids = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-c2', 'esp32-p4'].filter(id => E.chip(id));
      const defs = [
        { id: 'enc', type: 'select', label: nvs ? 'NVS encryption' : 'Flash encryption', options: nvs ? [['Plain NVS partition', 0], ['Encrypted NVS partition', 1]] : [['Off', 0], ['On', 1]], value: 0 },
        { id: 'what', type: 'select', label: 'The memory holds', options: [['Settings and credentials', 'settings'], ['Program and text strings', 'code']], value: 'settings' },
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: ids.includes('esp32-s3') ? 'esp32-s3' : ids[0] },
        { type: 'buttons', items: [{ id: 'reset', label: 'Undo my edits' }] }
      ];
      const ctl = kit.controls(box.side, defs, (id) => { if (id === 'reset' || id === 'what' || id === 'enc') for (const k of Object.keys(edited)) delete edited[k]; loop.once(); });
      if (nvs) ctl.show('what', false);
      const ro = kit.readout(box.side, [['seen', 'A reader of the chip sees'], ['same', 'The two identical rows'], ['edit', 'After your edit'], ['cipher', nvs ? 'Schemes this chip can use' : 'Cipher (catalogue)']]);
      const KEY = 0x5bd1e995;
      // the ciphertext of row r: bytes that depend on the address as well as on the text
      const cipher = (plain, r) => plain.map((b, i) => (b ^ (hash(r * 16 + i, KEY, 1) & 255)) & 255);
      const garble = (r, i) => hash(r + 100, i, 7) & 255;
      const printable = b => String.fromCharCode(33 + (b % 90));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10;
        const set = FLASH_SETS[nvs ? 'settings' : ctl.values.what] || FLASH_SETS.settings;
        const on = ctl.values.enc === 1;
        const chip = E.chip(ctl.values.chip);
        const addrW = 44, avail = W - 2 * M - addrW - 12, cell = Math.min(24, avail * 0.68 / 16);
        const fs = clamp(cell * 0.52, 8.5, 11.5), hexX = M + addrW, ascX = hexX + 16 * cell + 12, rowH = 17;
        // what is stored, row by row (plain: the text; encrypted: ciphertext)
        const stored = set.rows.map((plain, r) => {
          let bytes = on ? cipher(plain, r) : plain.slice();
          const e = edited[r];
          if (e != null) bytes[e] = on ? bytes[e] ^ 0x20 : 35;
          return bytes;
        });
        const seen = set.rows.map((plain, r) => {
          if (edited[r] == null) return plain.map(ascii).join('');
          if (!on) { const b = plain.slice(); b[edited[r]] = 35; return b.map(ascii).join(''); }
          return plain.map((b, i) => printable(garble(r, i))).join('');
        });
        let y = 8;
        kit.label(c, nvs ? 'The NVS partition, read from the memory chip' : 'The memory chip, read by someone holding the board', M, y + 6, { size: 12, weight: 650, color: C.text2 });
        y += 24;
        hits = [];
        set.rows.forEach((plain, r) => {
          const ry = y + r * rowH, b = stored[r], e = edited[r];
          if (e != null) { c.fillStyle = C.dark ? 'rgba(224,160,48,.16)' : 'rgba(200,130,20,.12)'; c.fillRect(M - 4, ry - rowH / 2 + 1, W - 2 * M + 8, rowH - 2); }
          kit.label(c, h2(((FLASH_BASE + r * 16) >> 8) & 255) + h2((r * 16) & 255), M, ry, { size: fs, color: C.faint, font: MONO });
          for (let i = 0; i < 16; i++) kit.label(c, h2(b[i]), hexX + i * cell + cell / 2, ry, { size: fs, align: 'center', color: e === i ? C.warn : C.text2, weight: e === i ? 700 : 500, font: MONO });
          kit.label(c, b.map(ascii).join(''), ascX, ry, { size: fs + 1, color: on ? C.muted : C.text, font: MONO });
          hits.push({ x: 0, y: ry - rowH / 2, w: W, h: rowH, r });
        });
        y += set.rows.length * rowH + 14;
        kit.label(c, 'What the program sees after the chip decrypts', M, y, { size: 12, weight: 650, color: C.text2 });
        y += 18;
        set.rows.forEach((plain, r) => {
          const ry = y + r * rowH, garbled = on && edited[r] != null, changed = !on && edited[r] != null;
          kit.label(c, h2(((FLASH_BASE + r * 16) >> 8) & 255) + h2((r * 16) & 255), M, ry, { size: fs, color: C.faint, font: MONO });
          kit.label(c, seen[r], hexX, ry, { size: fs + 1, color: garbled ? C.bad : changed ? C.warn : C.text, font: MONO, weight: garbled || changed ? 700 : 500 });
          if (garbled) kit.label(c, 'garbage: that block is lost', hexX + 16 * (fs + 1) * 0.6 + 14, ry, { size: 10.5, color: C.bad });
          else if (changed) kit.label(c, 'changed as the attacker chose', hexX + 16 * (fs + 1) * 0.6 + 14, ry, { size: 10.5, color: C.warn });
        });
        kit.label(c, 'click a row of the top panel to alter it by hand', M, st.H - 12, { size: 10.5, color: C.faint });
        // the read-outs
        const [ra, rb] = set.same, sameStored = stored[ra].every((v, i) => v === stored[rb][i]);
        ro.set('seen', on ? 'ciphertext: bytes with no pattern and no text' : 'readable text, passwords included');
        ro.set('same', 'rows ' + (ra + 1) + ' and ' + (rb + 1) + ': ' + (sameStored ? 'the same bytes, so repeated data shows' : 'different bytes: the address is mixed in'));
        const ed = Object.keys(edited);
        ro.set('edit', ed.length ? (on ? 'the chip decrypts that block to garbage' : 'the program reads exactly the value that was written') : 'click a row to alter it');
        const enc = chip ? (chip.security || []).find(s => /encrypt/i.test(s)) : '';
        if (nvs) ro.set('cipher', chip ? 'with flash encryption: always · from the HMAC key: ' + (hasHmac(chip) ? 'yes' : 'no (no HMAC peripheral)') : '—');
        else ro.set('cipher', enc ? clip(enc, 120) : (noSecurity(chip) ? 'none: no hardware encryption' : 'not listed'));
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inside(p, q)); if (h) { const k = (edited[h.r] == null) ? (hash(h.r, 5, 5) % 12) + 2 : null; if (k == null) delete edited[h.r]; else edited[h.r] = k; loop.once(); } }, p => hits.some(q => inside(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ds-attacker-doors */
  const PROT = [
    ['fe', 'Flash encryption'], ['sb', 'Secure boot'], ['ota', 'Signed updates'], ['ar', 'Anti-rollback counter'], ['rd', 'Keys read-protected in eFuses'],
    ['jt', 'JTAG closed'], ['dl', 'Download mode closed'], ['id', 'Identity key in hardware (DS, HMAC, secure element)'], ['tee', 'Trusted execution environment']
  ];
  const DOORS = [
    { id: 'chip', name: 'Read the flash chip directly', f: t => t.fe ? ['closed', 'only ciphertext is there'] : ['open', 'everything in it is readable'] },
    { id: 'uart', name: 'Dump the flash through the serial port', f: t => (t.fe || t.dl) ? ['closed', t.dl ? 'the ROM refuses download mode' : 'the dump is only ciphertext'] : ['open', 'the ROM hands out the flash contents'] },
    { id: 'jtag', name: 'Attach a debugger', f: t => t.jt ? ['closed', 'the debug port is switched off'] : ['open', 'a debugger can halt the chip and read its memory'] },
    { id: 'cable', name: 'Load their own firmware by cable', f: t => (t.sb || t.dl) ? ['closed', t.sb ? 'unsigned images are refused' : 'download mode is off'] : ['open', 'any image can be uploaded'] },
    { id: 'write', name: 'Rewrite the flash chip', f: t => t.sb ? ['closed', 'the bootloader rejects unsigned images'] : t.fe ? ['partly', 'they cannot choose the content, only garble blocks'] : ['open', 'any content can be written'] },
    { id: 'ota', name: 'Push a forged update over the air', f: t => (t.sb || t.ota) ? ['closed', 'the signature check fails'] : ['open', 'the update is not checked'] },
    { id: 'old', name: 'Install an old, vulnerable version', f: t => t.ar ? ['closed', 'the counter refuses older versions'] : (t.sb || t.ota) ? ['partly', 'an old image still carries a valid signature'] : ['open', 'any version installs'] },
    { id: 'efuse', name: 'Read keys out of the eFuses', f: t => t.rd ? ['closed', 'read-protected: only hardware can use them'] : (t.sb && t.jt) ? ['partly', 'it would take a bug in your own program'] : ['open', 'any program on the chip can read them'] },
    { id: 'oracle', name: 'Make the chip sign or decrypt for them', f: t => !t.sb ? ['open', 'their own code can run and ask'] : ['partly', 'only through a bug in your program'] },
    { id: 'clone', name: 'Copy its identity to another board', f: t => t.id ? ['closed', 'the key cannot leave the hardware'] : t.fe ? ['partly', 'an encrypted copy will not run elsewhere'] : ['open', 'the key is just a file in flash'] },
    { id: 'glitch', name: 'Fault injection next to the chip', f: t => (t.sb || t.fe) ? ['partly', 'no switch closes it; newer chips raise the cost'] : ['open', 'there is no check to skip, so nothing to inject'] },
    { id: 'bug', name: 'Exploit a bug in your own program', f: t => (t.sb && t.tee) ? ['partly', 'cannot persist, cannot reach the keys'] : t.sb ? ['partly', 'cannot persist; can misuse what the program reaches'] : t.tee ? ['partly', 'cannot reach the keys; can misuse the program'] : ['open', 'everything the program can reach is exposed'] }
  ];
  const FOCUS = {
    model: { doors: DOORS.map(d => d.id), prot: PROT.map(p => p[0]) },
    debug: { doors: ['chip', 'uart', 'jtag', 'cable', 'efuse'], prot: ['fe', 'sb', 'rd', 'jt', 'dl'] },
    physical: { doors: ['chip', 'uart', 'jtag', 'write', 'clone', 'glitch'], prot: ['fe', 'sb', 'jt', 'dl', 'id'] }
  };
  const PRESETS = {
    dev: { fe: 0, sb: 0, ota: 0, ar: 0, rd: 0, jt: 0, dl: 0, id: 0, tee: 0 },
    home: { fe: 1, sb: 1, ota: 1, ar: 1, rd: 1, jt: 1, dl: 0, id: 0, tee: 0 },
    secret: { fe: 1, sb: 1, ota: 1, ar: 1, rd: 1, jt: 1, dl: 1, id: 1, tee: 1 }
  };
  Hyper.sim('ds-attacker-doors', {
    title: 'The doors of a device in someone\'s hand',
    blurb: `Each row is a way in for **someone who holds the unit** (a thief, a second-hand buyer, a finder). Each protection on the right closes some of them: **red is open, amber is only partly closed, green is closed**. It is a model of what each protection is *for*, not a test of any real device.

**Try this**
- Start with the *development board*: every door is open. That is right for the bench.
- Pick *a sensible home product* and read what is left amber or red.
- Switch **flash encryption** off with the rest on: the chip door opens again, whatever else is closed.
- Watch the costs in the read-outs: the *one-way* steps, the recovery you lose and the debugging you lose.
- No set of switches closes **fault injection** or a **bug in your own program**: those are lowered, not removed.`,
    mount(box, kit, params) {
      const focus = FOCUS[params && params.focus] ? params.focus : 'model';
      const F = FOCUS[focus];
      const rows = DOORS.filter(d => F.doors.includes(d.id));
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 56 + rows.length * 30, maxH: 64 + rows.length * 32 });
      const defs = [{ id: 'preset', type: 'select', label: 'Start from', options: [['A bare development board', 'dev'], ['A sensible home product', 'home'], ['A product holding a valuable secret', 'secret'], ['My own choice', 'custom']], value: focus === 'model' ? 'home' : 'dev' }];
      for (const [id, label] of PROT) defs.push({ id, type: 'check', label, value: false });
      let silent = false;
      const ctl = kit.controls(box.side, defs, (id, v) => {
        if (id === 'preset') { if (PRESETS[v]) { silent = true; for (const [k] of PROT) ctl.set(k, !!PRESETS[v][k]); silent = false; } }
        else if (!silent) { silent = true; ctl.set('preset', 'custom'); silent = false; }
        loop.once();
      });
      for (const [id] of PROT) ctl.show(id, F.prot.includes(id));
      if (PRESETS[ctl.values.preset]) { silent = true; for (const [k] of PROT) ctl.set(k, !!PRESETS[ctl.values.preset][k]); silent = false; }
      const ro = kit.readout(box.side, [['closed', 'Doors closed'], ['open', 'Still open'], ['oneway', 'One-way steps taken'], ['cable', 'Recovery by cable'], ['dbg', 'Debugging in the field']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const t = {};
        for (const [k] of PROT) t[k] = !!ctl.values[k];
        kit.label(c, 'Ways in for someone holding the unit', M, 14, { size: 12, weight: 650, color: C.text2 });
        const rh = Math.min(32, (st.H - 36) / Math.max(1, rows.length));
        let nClosed = 0, nPartly = 0;
        const open = [];
        rows.forEach((d, i) => {
          const [s, why] = d.f(t), y = 30 + i * rh;
          const col = s === 'closed' ? C.ok : s === 'partly' ? C.warn : C.bad;
          if (s === 'closed') nClosed++; else if (s === 'partly') nPartly++; else open.push(d.name);
          c.fillStyle = col; c.globalAlpha = 0.9; c.fillRect(M, y + 3, 5, rh - 8); c.globalAlpha = 1;
          kit.label(c, clip(d.name, Math.floor((W - 2 * M - 90) / 6.2)), M + 14, y + rh * 0.32, { size: 11.5, weight: 600 });
          kit.label(c, clip(why, Math.floor((W - 2 * M - 20) / 5.3)), M + 14, y + rh * 0.72, { size: 10, color: C.muted });
          kit.label(c, s === 'closed' ? 'CLOSED' : s === 'partly' ? 'PARTLY' : 'OPEN', W - M, y + rh * 0.32, { size: 10.5, weight: 700, color: col, align: 'right' });
        });
        ro.set('closed', nClosed + ' of ' + rows.length + ' closed, ' + nPartly + ' only partly');
        ro.set('open', open.length ? clip(open.join(' · '), 150) : 'none of these doors');
        const oneWay = ['fe', 'sb', 'rd', 'jt', 'dl', 'ar'].filter(k => t[k] && F.prot.includes(k)).length;
        ro.set('oneway', oneWay + (oneWay ? ' (they cannot be undone)' : ''));
        ro.set('cable', t.dl ? 'gone: the ROM no longer takes uploads' : 'still possible');
        ro.set('dbg', t.jt ? 'gone: no debugger on units in the field' : 'possible');
        ctl.show('preset', true);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ds-efuse-keys */
  // [id, name, hue, kind]  kind: secret (must be read-protected), public (a hash: must be write-protected), user
  const PURPOSES = [
    ['xts', 'XTS-AES key (flash encryption)', 212, 'secret'],
    ['sbd', 'Secure boot key digest', 140, 'public'],
    ['hmds', 'HMAC key for the Digital Signature', 280, 'secret'],
    ['hmup', 'HMAC key (answer returned to software)', 36, 'secret'],
    ['hmjt', 'HMAC key that re-enables JTAG', 8, 'secret'],
    ['ecdsa', 'ECDSA key', 320, 'secret'],
    ['user', 'User data', 190, 'user']
  ];
  const ESP32_ROLES = [['xts', 'BLOCK1: flash encryption key (fixed role)'], ['sbd', 'BLOCK2: secure boot key (fixed role)'], ['user', 'BLOCK3: yours, shared with factory data']];
  const hasEcdsaDs = chip => /ECDSA[_ ]DS|ECDSA Digital Signature/i.test(secText(chip));
  Hyper.sim('ds-efuse-keys', {
    title: 'Key blocks, purposes and protection',
    blurb: `The eFuses hold a few blocks meant for keys. Click a block, choose what its key is *for*, and **burn** it in the simulation; then let software try to read every block. A key that is **read-protected** reads as zeros to the program, yet the hardware engine named by its purpose can still use it. **Nothing here touches a real chip**, and no burn command is given on this page.

**Try this**
- Burn a flash encryption key *with* read protection, then press *Software reads every block*: it sees zeros. Burn another *without* it and read again.
- Burn a block twice: the second burn is refused, because a burned bit never returns to 0.
- Switch the chip to the **ESP32**: three blocks with fixed roles, no purposes to choose.
- Choose an **HMAC key** on the ESP32 or an **ECDSA key** on the S3 and see the chip refuse: the catalogue says it has no such peripheral.
- Count the blocks used: six go quickly.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 410, maxH: 440 });
      const ids = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-p4'].filter(id => E.chip(id));
      let chipId = ids.includes(params && params.chip) ? params.chip : 'esp32-s3', sel = 0, mode = 'idle', counter = 0, hits = [];
      let msg = 'Click a block, choose a purpose and burn a key into it.';
      const fresh = () => Array.from({ length: chipId === 'esp32' ? 3 : 6 }, () => ({ burned: false, purpose: null, rd: false, wr: false, key: [] }));
      let blocks = fresh();
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: chipId },
        { id: 'purpose', type: 'select', label: 'Purpose of the key', options: PURPOSES.map(p => [p[1], p[0]]), value: 'xts' },
        { id: 'rd', type: 'check', label: 'Read-protect it', value: true },
        { id: 'wr', type: 'check', label: 'Write-protect it', value: true },
        { type: 'buttons', items: [{ id: 'burn', label: 'Burn a key into the block', primary: true }, { id: 'read', label: 'Software reads every block' }, { id: 'new', label: 'New chip' }] }
      ], (id, v) => {
        if (id === 'chip') { chipId = v; blocks = fresh(); sel = 0; mode = 'idle'; msg = 'A new chip: every block is empty.'; ctl.show('purpose', v !== 'esp32'); }
        else if (id === 'new') { blocks = fresh(); sel = 0; mode = 'idle'; msg = 'A fresh chip. A real one has no such button.'; }
        else if (id === 'read') { mode = 'read'; msg = 'Software reads every block. Where a key is readable, any program on the chip can copy it: so can a hijacked one.'; }
        else if (id === 'burn') burn();
        loop.once();
      });
      ctl.show('purpose', chipId !== 'esp32');
      const ro = kit.readout(box.side, [['sel', 'Selected block'], ['used', 'Blocks used'], ['km', 'Key Manager (catalogue)'], ['advice', 'Advice']]);
      const roleOf = i => (chipId === 'esp32' ? ESP32_ROLES[i][1].split(':')[0] : 'KEY' + i);
      function burn() {
        const b = blocks[sel], chip = E.chip(chipId);
        mode = 'idle';
        if (!b) return;
        if (b.burned) { msg = 'Refused: ' + roleOf(sel) + ' already holds a key. A burned bit never returns to 0, so a second burn could only mix the two keys.'; return; }
        const pid = chipId === 'esp32' ? ESP32_ROLES[sel][0] : ctl.values.purpose;
        const p = PURPOSES.find(x => x[0] === pid);
        if ((pid === 'hmds' || pid === 'hmup' || pid === 'hmjt') && !hasHmac(chip)) { msg = 'Not possible: ' + chip.name + ' has no HMAC peripheral, so no key could use that purpose.'; return; }
        if (pid === 'ecdsa' && !hasEcdsaDs(chip)) { msg = 'Not possible: ' + chip.name + ' has no ECDSA signature peripheral in the catalogue.'; return; }
        counter++;
        b.burned = true; b.purpose = pid; b.rd = !!ctl.values.rd; b.wr = !!ctl.values.wr;
        b.key = Array.from({ length: 32 }, (_, i) => hash(sel * 31 + counter, 77, i) & 255);
        if (p[3] === 'secret' && !b.rd) msg = 'Burned ' + roleOf(sel) + ' as "' + p[1] + '", but it is not read-protected: any program running on the chip can read this key.';
        else if (p[3] === 'public' && !b.wr) msg = 'Burned the digest. It is a hash of a public key, so it is not secret, but without write protection more bits could still be burned into it.';
        else if (!b.wr) msg = 'Burned and read-protected, but not write-protected: further bits could still be burned into the block.';
        else msg = 'Burned ' + roleOf(sel) + ' as "' + p[1] + '"' + (b.rd ? ', read-protected and write-protected: hardware can use it, nobody can read or change it.' : ' and write-protected.');
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, n = blocks.length, chip = E.chip(chipId), rowH = 46;
        kit.label(c, 'Key blocks of the ' + chip.name + ' (click one to select it)', M, 14, { size: 12, weight: 650, color: C.text2 });
        hits = [];
        const cw = (W - 2 * M) / 32;
        blocks.forEach((b, i) => {
          const y = 30 + i * rowH, p = b.burned ? PURPOSES.find(x => x[0] === b.purpose) : null, isSel = i === sel;
          if (isSel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.14)' : 'rgba(60,90,220,.09)'; c.fillRect(M - 6, y - 3, W - 2 * M + 12, rowH - 4); }
          kit.label(c, roleOf(i), M, y + 8, { size: 11.5, weight: 700 });
          const title = chipId === 'esp32' ? (b.burned ? 'key burned' : ESP32_ROLES[i][1].split(': ')[1]) : (p ? p[1] : 'unused');
          kit.label(c, clip(title, Math.floor((W - 2 * M - 120) / 5.8)), M + 54, y + 8, { size: 11, color: p ? C.text : C.muted });
          if (b.burned) {
            kit.label(c, b.wr ? 'WR' : 'wr', W - M - 20, y + 8, { size: 10.5, weight: 700, align: 'center', color: b.wr ? C.ok : C.faint });
            kit.label(c, b.rd ? 'RD' : 'rd', W - M - 52, y + 8, { size: 10.5, weight: 700, align: 'center', color: b.rd ? C.ok : C.warn });
          }
          for (let k = 0; k < 32; k++) {
            const x = M + k * cw;
            if (!b.burned) { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 20.5, cw - 1.5, 14); continue; }
            if (mode === 'read' && b.rd) { c.fillStyle = C.dark ? 'rgba(150,156,190,.25)' : 'rgba(80,90,120,.18)'; c.fillRect(x, y + 20, cw - 1, 15); continue; }
            if (mode === 'read') { c.fillStyle = C.dark ? 'rgba(229,72,77,.22)' : 'rgba(200,40,50,.14)'; c.fillRect(x, y + 20, cw - 1, 15); kit.label(c, h2(b.key[k]), x + cw / 2, y + 27.5, { size: clamp(cw * 0.6, 7.5, 10), align: 'center', color: C.bad, font: MONO }); continue; }
            c.globalAlpha = 0.35 + 0.5 * ((b.key[k] & 15) / 15); c.fillStyle = kit.hue(p[2], 1); c.fillRect(x, y + 20, cw - 1, 15); c.globalAlpha = 1;
          }
          if (mode === 'read' && b.burned && b.rd) kit.label(c, 'reads as zeros: hidden from software', W / 2, y + 27.5, { size: 10.5, align: 'center', color: C.text2 });
          hits.push({ x: 0, y: y - 3, w: W, h: rowH - 4, i });
        });
        const y2 = 30 + n * rowH + 6;
        paragraph(kit, c, msg, M, y2, W - 2 * M, { size: 11.5, color: C.text2, max: 3 });
        kit.label(c, 'RD read-protected · WR write-protected (lower case: not set)', M, st.H - 10, { size: 10, color: C.faint });
        // read-outs
        const b = blocks[sel], used = blocks.filter(x => x.burned).length;
        ro.set('sel', b ? roleOf(sel) + ': ' + (b.burned ? (PURPOSES.find(x => x[0] === b.purpose) || [0, 'key'])[1] : 'unused') : '—');
        ro.set('used', used + ' of ' + n + (used === n ? ' (full)' : ''));
        ro.set('km', hasKeyManager(chip) ? 'yes: keys can be deployed wrapped under a chip-unique key, using no block' : 'no');
        const bad = blocks.find(x => x.burned && (PURPOSES.find(q => q[0] === x.purpose) || [])[3] === 'secret' && !x.rd);
        const open = blocks.find(x => x.burned && !x.wr);
        ro.set('advice', bad ? 'Read-protect every secret key: one block is readable by software' : open ? 'Write-protect the burned blocks' : used ? 'Every burned block is protected' : 'Burn a key (simulated) to start');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inside(p, q)); if (h) { sel = h.i; loop.once(); } }, p => hits.some(q => inside(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ds-signing-oracle */
  const WHERE = [['file', 'A plain file in flash'], ['enc', 'A file in encrypted flash'], ['ds', 'The Digital Signature peripheral'], ['hmac', 'A secret derived by the HMAC peripheral'], ['element', 'A secure element on the I2C bus']];
  const ATT = [['none', 'Nothing: the honest case'], ['dump', 'A copy of the flash contents'], ['code', 'Their own code running on the device']];
  // what each attacker gets, per place the key is kept: [clone, text] and [oracle, text]
  const OUTCOME = {
    file: { dump: [[true, 'the key is a file in the dump'], [false, 'not needed: they already have the key']], code: [[true, 'their code reads the file'], [true, 'and can sign from anywhere']] },
    enc: { dump: [[false, 'a dump of encrypted flash is ciphertext, useless on another chip'], [false, 'they have no running device']], code: [[true, 'code on the chip sees the key in clear: flash encryption does not hide it from the program'], [true, 'and can sign from anywhere']] },
    ds: { dump: [[false, 'only the wrapped key is there; its unlocking key is in a read-protected eFuse'], [false, 'they have no running device']], code: [[false, 'code can ask for signatures but never sees the key'], [true, 'for as long as they hold the device']] },
    hmac: { dump: [[false, 'the root key is in an eFuse and the derived secret is recomputed, not stored'], [false, 'they have no running device']], code: [[true, 'the answer comes back to the program: a derived secret can be copied, the root key cannot'], [true, 'while they hold the device, and the derived secret anywhere']] },
    element: { dump: [[false, 'the key is in another chip altogether'], [false, 'they have no running device']], code: [[false, 'code can only send commands over the I2C bus'], [true, 'for as long as they hold the device']] }
  };
  const supportsKeyHolder = (where, chip) => {
    if (where === 'hmac') return hasHmac(chip);
    if (where === 'ds') return !/\bno Digital Signature\b/i.test(secText(chip)) && /Digital Signature|RSA_DS|ECDSA_DS/i.test(secText(chip));
    return true;
  };
  Hyper.sim('ds-signing-oracle', {
    title: 'A key that signs without being read',
    blurb: `A server sends a challenge; the device signs it with a private key; the server checks. The picture shows **where the key is kept** and what two kinds of attacker get: someone with **a copy of the flash**, and someone who has got **their own code running on the device**. It is a model of what each place of storage protects against, not a test of any real device.

**Try this**
- Press *Send a challenge* to follow one honest exchange.
- Keep the key in a **plain file**: a dump alone clones the device.
- Move it to **encrypted flash**: the dump is now useless, but code on the chip still sees the key.
- Move it to the **Digital Signature peripheral** or a **secure element**: even code on the chip cannot copy the key, only ask for signatures while it holds the device.
- Try the **HMAC** secret: the root key is safe, but the derived secret is handed to the program.
- Pick a chip without the peripheral (the ESP32 for DS or HMAC) and read what the catalogue says.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 420, maxH: 450 });
      const ids = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-c61', 'esp32-p4'].filter(id => E.chip(id));
      const startWhere = WHERE.some(w => w[0] === (params && params.where)) ? params.where : 'ds';
      let anim = 99;
      const ctl = kit.controls(box.side, [
        { id: 'where', type: 'select', label: 'The private key is kept in', options: WHERE.map(w => [w[1], w[0]]), value: startWhere },
        { id: 'att', type: 'select', label: 'The attacker has', options: ATT.map(a => [a[1], a[0]]), value: 'none' },
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: ids.includes('esp32-s3') ? 'esp32-s3' : ids[0] },
        { type: 'buttons', items: [{ id: 'send', label: 'Send a challenge', primary: true }] }
      ], (id) => { if (id === 'send') { anim = 0; loop.start(); } else loop.once(); });
      const ro = kit.readout(box.side, [['where', 'Key kept in'], ['clone', 'Copied to another board?'], ['oracle', 'Used while they hold the device?'], ['chip', 'This chip (catalogue)']]);
      function layout(where) {
        const W = st.W, M = 12, narrow = W < 560, el = where === 'element', ew = el ? Math.min(124, W * 0.3) : 0, R = { narrow, M };
        if (!narrow) { R.server = { x: 54, y: 124 }; R.frame = { x: 118, y: 26, w: W - 118 - M - (el ? ew + 12 : 0), h: 196 }; }
        else { R.server = { x: W / 2, y: 36 }; R.frame = { x: M, y: 92, w: W - 2 * M - (el ? ew + 8 : 0), h: 150 }; }
        const f = R.frame, pw = Math.min(112, f.w * 0.36), hw = Math.min(190, f.w * 0.5);
        R.prog = { x: f.x + 12, y: f.y + (narrow ? 30 : 56), w: pw, h: 56 };
        R.holder = el ? { x: f.x + f.w + 8, y: f.y + (narrow ? 14 : 44), w: ew, h: 100 } : { x: f.x + f.w - 12 - hw, y: f.y + (narrow ? 22 : 34), w: hw, h: narrow ? 112 : 130 };
        R.att = { x: W * 0.5, y: f.y + f.h + 54 };
        R.res = { x: M, y: R.att.y + 48, w: W - 2 * M };
        return R;
      }
      const loop = kit.loop(dt => {
        if (anim < 2.6) anim = Math.min(2.6, anim + dt);
        const c = st.begin(), C = kit.colors(), where = ctl.values.where, att = ctl.values.att, chip = E.chip(ctl.values.chip);
        const R = layout(where), f = R.frame, pr = R.prog, hd = R.holder, M = R.M;
        const ok = supportsKeyHolder(where, chip), out = ok && att !== 'none' ? OUTCOME[where][att] : null;
        // the device and its parts
        c.save(); c.strokeStyle = C.faint; c.lineWidth = 1.4; c.setLineDash([6, 4]); c.strokeRect(f.x, f.y, f.w, f.h); c.restore();
        kit.label(c, 'The device (' + clip(chip.name, 18) + ')', f.x + 8, f.y + 12, { size: 11, color: C.muted });
        S.node(c, R.server.x, R.server.y, { kind: 'server', label: 'Server', r: 20, color: kit.hue(212) });
        S.box(c, pr.x, pr.y, pr.w, pr.h, { label: 'Program', sub: att === 'code' ? 'attacker\'s code' : 'your code', color: att === 'code' ? C.bad : C.muted, active: att === 'code', size: 12 });
        const names = { file: ['Flash', 'key.pem, plain file'], enc: ['Encrypted flash', 'key.pem, decrypted for code'], ds: ['DS peripheral', 'signs inside'], hmac: ['HMAC peripheral', 'derives inside'], element: ['Secure element', 'key made inside'] }[where];
        S.box(c, hd.x, hd.y, hd.w, hd.h, { color: ok ? (where === 'file' || where === 'enc' ? C.warn : C.ok) : C.bad, dash: !ok, active: ok });
        kit.label(c, names[0], hd.x + hd.w / 2, hd.y + 14, { size: 12, weight: 650, align: 'center' });
        kit.label(c, ok ? names[1] : 'not on this chip', hd.x + hd.w / 2, hd.y + 29, { size: 10, align: 'center', color: ok ? C.muted : C.bad });
        if (ok) {
          if (where === 'file' || where === 'enc') { S.box(c, hd.x + 10, hd.y + hd.h - 40, hd.w - 20, 26, { label: 'private key', color: C.bad, size: 11 }); }
          else {
            S.node(c, hd.x + hd.w / 2, hd.y + 56, { kind: 'lock', r: 14, color: C.ok });
            kit.label(c, where === 'ds' ? 'key never leaves' : where === 'hmac' ? 'root key never leaves' : 'key never leaves', hd.x + hd.w / 2, hd.y + hd.h - 30, { size: 10, align: 'center', color: C.ok });
            if (where !== 'element') kit.label(c, 'unlocked by an eFuse key', hd.x + hd.w / 2, hd.y + hd.h - 16, { size: 9.5, align: 'center', color: C.faint });
          }
        }
        // the exchange
        const sx = R.narrow ? R.server.x : R.server.x + 24, sy = R.narrow ? R.server.y + 26 : R.server.y;
        const px = R.narrow ? pr.x + pr.w / 2 : pr.x, py = R.narrow ? pr.y : pr.y + pr.h / 2;
        S.link(c, sx, sy, px, py, { arrow: 'both', color: C.muted, label: 'challenge / signature' });
        const ax = pr.x + pr.w, ay = pr.y + pr.h / 2, bx = hd.x, by = hd.y + hd.h / 2;
        S.link(c, ax, ay, bx, by, { arrow: 'both', color: C.muted, label: where === 'element' ? 'I2C' : where === 'hmac' ? 'message / answer' : 'hash / signature' });
        if (anim < 2.6) {
          const ph = anim / 0.65, k = Math.floor(ph), fr = ph - k;
          const segs = [[sx, sy, px, py, 'challenge'], [ax, ay, bx, by, 'hash'], [bx, by, ax, ay, where === 'hmac' ? 'answer' : 'signature'], [px, py, sx, sy, 'signature']];
          const sg = segs[Math.min(3, k)];
          S.msg(c, sg[0], sg[1], sg[2], sg[3], clamp(fr, 0, 1), { label: sg[4], color: C.accent });
        }
        // the attacker
        S.node(c, R.att.x, R.att.y, { kind: 'laptop', label: 'Attacker', r: 17, color: att === 'none' ? C.faint : C.bad, dim: att === 'none' });
        if (att !== 'none') {
          const tx = att === 'dump' ? hd.x + hd.w / 2 : pr.x + pr.w / 2, ty = att === 'dump' ? hd.y + hd.h : pr.y + pr.h;
          const win = out && out[0][0];
          S.link(c, R.att.x, R.att.y - 20, tx, ty + 2, { arrow: 'end', color: win ? C.bad : C.ok, label: att === 'dump' ? 'copy of the flash' : 'runs own code' });
        }
        // the verdicts
        const rs = R.res;
        if (!ok) {
          paragraph(kit, c, chip.name + ' has no ' + (where === 'hmac' ? 'HMAC peripheral' : 'Digital Signature peripheral') + ' in the catalogue, so this place for the key does not exist on it. Choose a file, encrypted flash or a secure element, or another chip.', rs.x, rs.y, rs.w, { size: 11.5, color: C.bad, max: 3 });
        } else if (!out) {
          paragraph(kit, c, 'The honest case: the server sends a fresh challenge, the device signs it with its private key, and the server checks the signature with the public key it knows. Choose an attacker to see what each place of storage protects.', rs.x, rs.y, rs.w, { size: 11.5, color: C.text2, max: 3 });
        } else {
          const h1 = paragraph(kit, c, 'Copied to another board: ' + (out[0][0] ? 'YES' : 'NO') + ' - ' + out[0][1], rs.x, rs.y, rs.w, { size: 11.5, color: out[0][0] ? C.bad : C.ok, max: 2, weight: 600 });
          paragraph(kit, c, 'Used while they hold the device: ' + (out[1][0] ? 'YES' : 'NO') + ' - ' + out[1][1], rs.x, rs.y + h1 + 6, rs.w, { size: 11.5, color: out[1][0] ? C.warn : C.ok, max: 2, weight: 600 });
        }
        ro.set('where', WHERE.find(w => w[0] === where)[1]);
        ro.set('clone', !ok ? 'not possible on this chip' : out ? (out[0][0] ? 'YES: ' : 'no: ') + clip(out[0][1], 70) : 'no attacker chosen');
        ro.set('oracle', !ok ? 'not possible on this chip' : out ? (out[1][0] ? 'YES: ' : 'no: ') + clip(out[1][1], 70) : 'no attacker chosen');
        ro.set('chip', (hasHmac(chip) ? 'HMAC yes' : 'HMAC no') + ' · ' + (supportsKeyHolder('ds', chip) ? 'Digital Signature yes' : 'Digital Signature no'));
        if (anim >= 2.6) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ds-rollback */
  const OTA_IMAGES = [
    { id: 'v1', name: 'v1.0', sv: 0, signer: 'owner', note: 'secure version 0: holes A and B' },
    { id: 'v2', name: 'v2.0', sv: 0, signer: 'owner', note: 'secure version 0: holes A and B' },
    { id: 'v3', name: 'v3.0', sv: 1, signer: 'owner', note: 'secure version 1: closes hole A' },
    { id: 'v4', name: 'v4.0', sv: 1, signer: 'owner', note: 'secure version 1: a feature release, hole B remains' },
    { id: 'v5', name: 'v5.0', sv: 2, signer: 'owner', note: 'secure version 2: closes hole B' },
    { id: 'x1', name: 'v4.1 from a stranger', sv: 3, signer: 'other', note: 'signed with a key that is not the owner\'s' },
    { id: 'x2', name: 'v6.0 unsigned', sv: 3, signer: 'none', note: 'carries no signature at all' }
  ];
  const COUNTER_BITS = 16;
  Hyper.sim('ds-rollback', {
    title: 'Signed updates and the one-way counter',
    blurb: `A device with two update slots receives offers. **Check signatures** refuses images that are not the owner's. The **eFuse counter** at the bottom holds the lowest *secure version* that may run: it goes up when a new image marks itself valid after its self-test, and **never goes down**. The *pending* state is a different safety net: an image that does not pass its self-test is dropped at the next reset. The counter has 16 steps here as an example; the real size depends on the chip. **Nothing here touches a real chip.**

**Try this**
- Offer **v3.0**, then press *Self-test passes*: the counter rises to 1.
- Now offer **v2.0** with anti-rollback **on** (refused: below the counter) and **off** (installed, holes included). Its signature is perfectly genuine.
- Offer an image *from a stranger* with signature checking on and off.
- Offer an image and press *Self-test fails*: the device goes back by itself. That is **rollback**, not anti-rollback.
- Offer **v4.0** after v3.0: the counter stays at 1 because the secure version did not rise.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 350, maxH: 360 });
      const initial = () => ({ slots: [OTA_IMAGES[1], OTA_IMAGES[0]], run: 0, prev: 0, pending: false, counter: 0, log: ['The device runs v2.0 from slot A. Offer it an update.'] });
      let D = initial();
      const say = t => { D.log.push(t); if (D.log.length > 5) D.log.shift(); };
      const ctl = kit.controls(box.side, [
        { id: 'offer', type: 'select', label: 'Offer the device', options: OTA_IMAGES.map(i => [i.name, i.id]), value: 'v3' },
        { id: 'sig', type: 'check', label: 'Check signatures', value: true },
        { id: 'ar', type: 'check', label: 'Anti-rollback counter', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Offer this update', primary: true }, { id: 'ok', label: 'Self-test passes' }, { id: 'bad', label: 'Self-test fails: reset' }, { id: 'new', label: 'New device' }] }
      ], (id) => {
        const img = OTA_IMAGES.find(i => i.id === ctl.values.offer);
        if (id === 'go') {
          if (D.pending) say('The last update is still pending: mark it valid or reset first.');
          else if (ctl.values.sig && img.signer !== 'owner') say(img.name + ' refused: ' + (img.signer === 'none' ? 'it has no signature' : 'its signature is not the owner\'s'));
          else if (ctl.values.ar && img.sv < D.counter) say(img.name + ' refused: secure version ' + img.sv + ' is below the counter (' + D.counter + ')');
          else {
            const other = 1 - D.run;
            D.slots[other] = img; D.prev = D.run; D.run = other; D.pending = true;
            say(img.name + ' installed in slot ' + (other ? 'B' : 'A') + ' and started: pending verification' + (ctl.values.sig || img.signer === 'owner' ? '' : ' (a forged image was accepted: nothing checked it)'));
          }
        } else if (id === 'ok') {
          if (!D.pending) say('Nothing is pending.');
          else {
            const img2 = D.slots[D.run];
            D.pending = false;
            if (ctl.values.ar && img2.sv > D.counter) { D.counter = Math.min(COUNTER_BITS, img2.sv); say(img2.name + ' marked valid. The counter rises to ' + D.counter + ': older secure versions can never be installed again.'); }
            else say(img2.name + ' marked valid.' + (ctl.values.ar ? ' The counter stays at ' + D.counter + '.' : ''));
          }
        } else if (id === 'bad') {
          if (!D.pending) say('Reset: nothing was pending, the device carries on.');
          else { const was = D.slots[D.run]; D.run = D.prev; D.pending = false; say(was.name + ' did not mark itself valid: after the reset the bootloader went back to ' + D.slots[D.run].name + '. The counter did not move.'); }
        } else if (id === 'new') D = initial();
        loop.once();
      });
      const ro = kit.readout(box.side, [['run', 'The device runs'], ['counter', 'Lowest secure version allowed'], ['left', 'Counter steps left'], ['last', 'Last event']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, narrow = W < 560;
        const img = OTA_IMAGES.find(i => i.id === ctl.values.offer) || OTA_IMAGES[0];
        let offer, sa, sb, y;
        if (!narrow) { const ow = W * 0.32, sw = (W - M - (M + ow + 30) - 10) / 2; offer = { x: M, y: 30, w: ow, h: 70 }; sa = { x: M + ow + 30, y: 30, w: sw, h: 70 }; sb = { x: sa.x + sw + 10, y: 30, w: sw, h: 70 }; y = 130; }
        else { offer = { x: M, y: 28, w: W - 2 * M, h: 50 }; sa = { x: M, y: 92, w: (W - 2 * M - 10) / 2, h: 54 }; sb = { x: sa.x + sa.w + 10, y: 92, w: sa.w, h: 54 }; y = 168; }
        kit.label(c, 'Offered', offer.x, 14, { size: 11.5, weight: 650, color: C.text2 });
        kit.label(c, 'The two slots of the device', sa.x, narrow ? 80 : 14, { size: 11.5, weight: 650, color: C.text2 });
        S.box(c, offer.x, offer.y, offer.w, offer.h, { label: img.name, sub: img.signer === 'owner' ? 'signed by the owner' : img.signer === 'other' ? 'signed by a stranger' : 'unsigned', color: img.signer === 'owner' ? C.ok : C.bad, size: 12.5 });
        if (!narrow) kit.arrow(c, offer.x + offer.w + 4, offer.y + offer.h / 2, sa.x - 4, sa.y + sa.h / 2, C.muted, 2);
        [sa, sb].forEach((r, i) => {
          const im = D.slots[i], running = D.run === i, pend = running && D.pending;
          const state = !im ? 'empty' : running ? (pend ? 'running, pending verify' : 'running, valid') : 'previous image';
          S.box(c, r.x, r.y, r.w, r.h, { label: im ? im.name : 'empty', sub: 'slot ' + (i ? 'B' : 'A') + ' · ' + state, color: pend ? C.warn : running ? C.ok : C.faint, active: running, dash: !running, size: 12 });
        });
        // the counter
        kit.label(c, 'eFuse counter: ' + D.counter + ' of ' + COUNTER_BITS + ' bits burned (an example size)', M, y, { size: 11.5, weight: 650, color: C.text2 });
        const cw = (W - 2 * M) / COUNTER_BITS;
        for (let k = 0; k < COUNTER_BITS; k++) {
          const x = M + k * cw, on = k < D.counter;
          c.fillStyle = on ? (C.dark ? 'rgba(229,72,77,.55)' : 'rgba(200,40,50,.45)') : 'transparent';
          if (on) c.fillRect(x + 1, y + 12, cw - 2, 20);
          c.strokeStyle = on ? C.bad : C.faint; c.lineWidth = 1; c.strokeRect(x + 1.5, y + 12.5, cw - 3, 19);
          kit.label(c, on ? '1' : '0', x + cw / 2, y + 22, { size: 10, align: 'center', color: on ? C.text : C.faint, font: MONO });
        }
        kit.label(c, 'A burned bit stays burned: the minimum only goes up.', M, y + 44, { size: 10.5, color: C.muted });
        // the log
        let ly = y + 66;
        kit.label(c, 'What happened', M, ly, { size: 11.5, weight: 650, color: C.text2 });
        ly += 16;
        D.log.slice(-4).forEach((t, i, arr) => { kit.label(c, clip(t, Math.floor((W - 2 * M) / 5.8)), M, ly + i * 15, { size: 10.5, color: i === arr.length - 1 ? C.text : C.muted }); });
        const run = D.slots[D.run];
        ro.set('run', run.name + (D.pending ? ' (pending verify)' : ''));
        ro.set('counter', D.counter);
        ro.set('left', (COUNTER_BITS - D.counter) + ' of ' + COUNTER_BITS);
        ro.set('last', D.log[D.log.length - 1]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ds-two-worlds */
  const WORLD_ACTIONS = [
    ['own', 'Read its own data'],
    ['service', 'Ask the trusted part to sign a message'],
    ['key', 'Read the key store directly'],
    ['code', 'Overwrite the trusted code'],
    ['engine', 'Drive the AES and HMAC engines itself'],
    ['jump', 'Jump into the middle of the trusted code']
  ];
  const hasPermissionHw = chip => /World Controller|permission|APM|TEE|PMS/i.test(secText(chip)) && !/\bno TEE\b/i.test(secText(chip));
  Hyper.sim('ds-two-worlds', {
    title: 'Two worlds on one chip',
    blurb: `The **application** (left) runs in the non-secure world. The **trusted part** (right) holds a key store, its code and the crypto engines, behind a **permission controller** that marks them secure-only. Choose what the application tries. With the hardware and a trusted part both in place, anything but its own data and the **service gate** gets an access fault. This is **a model of the idea**, not of one chip.

**Try this**
- Ask for a **signature**: the gate lets it through, and only the answer comes back.
- Try to **read the key store** directly: the controller refuses. Tick *hijacked* to see that it makes no difference.
- Untick *a trusted part is set up*: the hardware has nothing to enforce, and the key is plain memory.
- Choose the **original ESP32** or the **ESP32-C2**: no permission hardware, so nothing refuses anything.
- Compare the S3 and C3 (World Controller) with the C6 and P4 (TEE controller): the catalogue words differ, the idea is the same.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 390, maxH: 420 });
      const ids = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-p4', 'esp32-c2'].filter(id => E.chip(id));
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ids.map(id => [E.chip(id).name, id]), value: ids.includes('esp32-c6') ? 'esp32-c6' : ids[0] },
        { id: 'act', type: 'select', label: 'The application tries to', options: WORLD_ACTIONS.map(a => [a[1], a[0]]), value: 'key' },
        { id: 'tee', type: 'check', label: 'A trusted part is set up (software)', value: true },
        { id: 'hij', type: 'check', label: 'The application has been hijacked', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['hw', 'Hardware (catalogue)'], ['enf', 'Enforced?'], ['res', 'Result']]);
      function outcome(hw, sw, act) {
        const enforced = hw && sw;
        if (act === 'own') return [true, 'Its own data: the application may read it. The controller has no reason to object.'];
        if (act === 'service') return sw ? [true, 'The gate passes the request, the trusted part signs, and only the signature comes back. The key never crosses the boundary.'] : [false, 'There is no trusted part, so there is no service to call: the key would have to live in the application.'];
        const why = enforced ? 'Access fault: the controller refuses, and nothing is read or changed.' : (!hw ? 'This chip has no permission hardware: nothing can refuse.' : 'The hardware could refuse, but no trusted part is set up, so no region is marked secure: nothing is protected.');
        const hit = {
          key: 'The read succeeds: the key is plain memory the application can reach.',
          code: 'The write succeeds: the "trusted" code is now the attacker\'s.',
          engine: 'The application drives the engines itself and can use the keys loaded in them.',
          jump: 'The jump succeeds: trusted code runs from the middle and can skip its own checks.'
        }[act];
        return enforced ? [false, why] : [true, why + ' ' + hit];
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, narrow = W < 560;
        const chip = E.chip(ctl.values.chip), act = ctl.values.act, hw = hasPermissionHw(chip), sw = !!ctl.values.tee, hij = !!ctl.values.hij;
        const out = outcome(hw, sw, act), allowed = out[0], enforced = hw && sw;
        let A, K, T, tg, own;
        if (!narrow) {
          A = { x: M, y: 40, w: W * 0.27, h: 250 }; K = { x: A.x + A.w + W * 0.07, y: 30, w: 26, h: 270 };
          const tx = K.x + K.w + W * 0.07; T = { x: tx, y: 40, w: W - tx - M, h: 250 };
          const bh = 46, g = 12; tg = { gate: { x: T.x + 10, y: T.y + 30, w: T.w - 20, h: bh }, key: null, code: null, engine: null };
          ['key', 'code', 'engine'].forEach((k, i) => { tg[k] = { x: T.x + 10, y: T.y + 30 + (i + 1) * (bh + g), w: T.w - 20, h: bh }; });
          own = { x: A.x + 10, y: A.y + 34, w: A.w - 20, h: 54 };
          A.prog = { x: A.x + 10, y: A.y + 130, w: A.w - 20, h: 64 };
        } else {
          A = { x: M, y: 28, w: W - 2 * M, h: 84 }; K = { x: M, y: 122, w: W - 2 * M, h: 22 }; T = { x: M, y: 154, w: W - 2 * M, h: 168 };
          const bw = (T.w - 30) / 2, bh = 58;
          tg = { gate: { x: T.x + 10, y: T.y + 26, w: bw, h: 56 }, key: { x: T.x + 20 + bw, y: T.y + 26, w: bw, h: 56 }, code: { x: T.x + 10, y: T.y + 92, w: bw, h: 56 }, engine: { x: T.x + 20 + bw, y: T.y + 92, w: bw, h: 56 } };
          own = { x: A.x + 10, y: A.y + 26, w: (A.w - 30) / 2, h: 50 };
          A.prog = { x: own.x + own.w + 10, y: A.y + 26, w: own.w, h: 50 };
        }
        // the two worlds
        c.save(); c.setLineDash([6, 4]); c.lineWidth = 1.4; c.strokeStyle = C.faint; c.strokeRect(A.x, A.y, A.w, A.h); c.strokeStyle = enforced ? C.ok : C.faint; c.strokeRect(T.x, T.y, T.w, T.h); c.restore();
        kit.label(c, 'Non-secure world: the application', A.x + 8, A.y + 12, { size: 11, color: C.muted });
        kit.label(c, 'Secure world: the trusted part' + (sw ? '' : ' (not set up)'), T.x + 8, T.y + 12, { size: 11, color: enforced ? C.ok : C.muted });
        S.box(c, own.x, own.y, own.w, own.h, { label: 'its own data', color: C.muted, size: 11 });
        S.box(c, A.prog.x, A.prog.y, A.prog.w, A.prog.h, { label: hij ? 'attacker\'s code' : 'application code', sub: 'runs here', color: hij ? C.bad : C.accent, active: true, size: 11.5 });
        const names = { gate: ['service gate', 'the only way in'], key: ['key store', 'secure-only'], code: ['trusted code', 'secure-only'], engine: ['AES / HMAC engines', 'secure-only'] };
        for (const k of Object.keys(tg)) {
          const r = tg[k], sel = (act === 'service' && k === 'gate') || act === k || (act === 'jump' && k === 'code');
          S.box(c, r.x, r.y, r.w, r.h, { label: names[k][0], sub: sw ? names[k][1] : 'not protected', color: sel ? (allowed ? C.ok : C.bad) : (sw ? C.muted : C.faint), active: sel, dash: !sw, size: 11 });
        }
        // the permission controller
        c.fillStyle = enforced ? (C.dark ? 'rgba(34,179,122,.30)' : 'rgba(34,179,122,.22)') : (C.dark ? 'rgba(150,156,190,.18)' : 'rgba(80,90,120,.12)');
        c.fillRect(K.x, K.y, K.w, K.h);
        c.strokeStyle = enforced ? C.ok : C.faint; c.lineWidth = 1.4; c.strokeRect(K.x + 0.5, K.y + 0.5, K.w - 1, K.h - 1);
        if (!narrow) { c.save(); c.translate(K.x + K.w / 2, K.y + K.h / 2); c.rotate(-Math.PI / 2); kit.label(c, enforced ? 'controller ON' : hw ? 'controller idle' : 'no controller on this chip', 0, 0, { size: 11, align: 'center', color: enforced ? C.ok : C.muted }); c.restore(); }
        else kit.label(c, enforced ? 'controller ON' : hw ? 'controller idle' : 'no controller on this chip', K.x + K.w / 2, K.y + K.h / 2, { size: 11, align: 'center', color: enforced ? C.ok : C.muted });
        // the attempt
        const target = act === 'own' ? own : act === 'service' ? tg.gate : act === 'jump' ? tg.code : tg[act];
        const from = act === 'own' ? { x: A.prog.x + A.prog.w / 2, y: A.prog.y } : { x: A.prog.x + A.prog.w, y: A.prog.y + A.prog.h / 2 };
        const to = act === 'own' ? { x: own.x + own.w / 2, y: own.y + own.h } : (narrow ? { x: target.x + target.w / 2, y: target.y } : { x: target.x, y: target.y + target.h / 2 });
        const stopX = narrow ? to.x : K.x + K.w / 2, stopY = narrow ? K.y + K.h / 2 : to.y;
        if (act === 'own' || allowed) kit.arrow(c, from.x, from.y, to.x, to.y, C.ok, 2.4);
        else {
          kit.arrow(c, from.x, from.y, narrow ? from.x + (to.x - from.x) * 0.5 : stopX - 4, narrow ? K.y - 2 : stopY, C.bad, 2.4);
          kit.label(c, '✗ access fault', narrow ? from.x + (to.x - from.x) * 0.5 : stopX - 8, narrow ? K.y - 10 : stopY - 14, { size: 11, weight: 700, color: C.bad, align: narrow ? 'center' : 'right' });
        }
        const ry = narrow ? T.y + T.h + 14 : T.y + T.h + 16;
        paragraph(kit, c, (allowed ? (act === 'own' || act === 'service' ? 'Allowed. ' : 'It works. ') : 'Refused. ') + out[1], M, ry, W - 2 * M, { size: 11.5, color: allowed && act !== 'own' && act !== 'service' ? C.bad : allowed ? C.ok : C.ok, max: 3, weight: 600 });
        const hwLine = (chip.security || []).find(s => /World Controller|permission|APM|TEE/i.test(s) && !/^No\b/.test(s));
        ro.set('hw', hw ? clip(hwLine || 'permission hardware listed', 110) : 'none listed');
        ro.set('enf', enforced ? 'yes: hardware and trusted part both in place' : !hw ? 'no: no hardware' : 'no: no trusted part set up');
        ro.set('res', out[1]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
