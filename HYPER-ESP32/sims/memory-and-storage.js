/* HYPER-ESP32 · sims/memory-and-storage.js
 *
 * Simulations of the topic "Memory and storage" (memory-and-storage):
 *
 *   ms-flash-layout         the flash cut into partitions by each ready-made scheme; does your program, and an update, fit?
 *   ms-nvs-wear             NVS pages filling with entries; a counter written again and again walks through the pages (wear levelling)
 *   ms-heap-fragmentation   a heap as a grid of 1 KB cells: random blocks, or two growing Strings; the big request that fails
 *   ms-stack-heap           where the RAM goes: system, static data, task stacks, Wi-Fi, a buffer; PSRAM; a task stack overflowing
 *   ms-json-memory          JSON text against the memory of its parsed document; filter and stream (an approximate model)
 *   ms-ring-buffer          a ring buffer between a sampler and a slow writer: fill level, lost samples, flash writes
 *   ms-wear-life            flash life against writes per day, for one sector, NVS and a file system (log-log plot)
 *
 * Numbers come from kit.esp (partitions, flash life, chip RAM from the catalogue); sizes of the heap, of Wi-Fi and of the
 * JSON slots are typical figures and are said to be so on the page. Theme colours only; static pictures redraw on demand.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const kbText = kb => (kb >= 1024 ? (kb / 1024).toFixed(kb % 1024 ? 2 : 0).replace(/\.?0+$/, '') + ' MB' : Math.round(kb) + ' KB');
  const hex6 = n => '0x' + n.toString(16).toUpperCase().padStart(6, '0');
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); else c.rect(x, y, w, h); };
  const mulberry = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const lifeText = years => (years < 1 / 365 ? 'under a day' : years < 1 ? Math.round(years * 365) + ' days' : years < 100 ? (years < 10 ? years.toFixed(1) : Math.round(years)) + ' years' : 'over a hundred years');

  /* ================================================================ ms-flash-layout */
  const PART_HUE = { nvs: 280, otadata: 305, app0: 212, app1: 212, spiffs: 150, coredump: 8 };
  Hyper.sim('ms-flash-layout', {
    title: 'The flash, cut into partitions',
    blurb: `The tall picture is the flash of the chip from address 0 downwards; every row is a partition, with its address and size. Row heights are not to scale (a true scale would hide the small ones). The thin bar at the foot of a row shows how full it is with **your program** or **your files**. On the right the same table as the text file the build uses.

**Try this**
- Start with the *Default* scheme and raise **Your program** past 1280 KB: the bar turns red, and the build would stop with "Maximum is 1310720 bytes".
- Switch to *Huge app*: one slot of 3 MB, no second slot — and the line about updates changes.
- Pick *Minimal file system* and raise **Files you keep**: the program has room, the files do not.
- Look at the 8 MB and 16 MB schemes: the table is the same, only the slots grow.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360, maxH: 580 });
      const schemes = E.PARTITION_SCHEMES;
      const first = schemes.some(s => s.id === params.scheme) ? params.scheme : schemes[0].id;
      const ctl = kit.controls(box.side, [
        { id: 'scheme', type: 'select', label: 'Partition scheme', options: schemes.map(s => [s.name, s.id]), value: first },
        { id: 'prog', label: 'Your program', min: 100, max: 6600, step: 20, value: Number(params.prog) || 900, unit: 'KB' },
        { id: 'files', label: 'Files you keep', min: 0, max: 3600, step: 20, value: Number(params.files) || 300, unit: 'KB' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['flash', 'Flash'], ['slot', 'Room for one program'], ['verdict', 'Your program'], ['upd', 'Update over the air'], ['fs', 'File system'], ['fsv', 'Your files']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const sc = schemes.find(s => s.id === ctl.values.scheme) || schemes[0];
        const t = E.partitions(sc.parts, sc.flash);
        const prog = ctl.values.prog * 1024, files = ctl.values.files * 1024;
        const wide = W >= 600, lw = wide ? Math.min(W * 0.5, 400) : W - 2 * M;
        const top = 34, lh = H - top - 10;
        kit.label(c, 'Flash of ' + kbText(sc.flash / 1024), M, 15, { size: 13, weight: 650 });
        // the rows, top of the picture = address 0
        const rows = [
          { label: 'bootloader', sub: 'second stage', size: Math.sqrt(28), color: 30, right: '0x1000 or 0x0' },
          { label: 'partition table', size: 2, color: 30, right: '0x008000 · 4 KB' }
        ].concat(t.rows.map(r => ({ label: r.name, sub: r.type + ' · ' + r.subtype, size: Math.sqrt(r.size / 1024), color: PART_HUE[r.name] != null ? PART_HUE[r.name] : 335, right: hex6(r.offset) + ' · ' + kbText(r.size / 1024) })));
        const bx = S.layers(c, M, top, lw, rows, { h: lh, minRow: 19 });
        // how full the app and file-system rows are
        const gauge = (b, frac, bad) => {
          if (b.h < 26) return;
          c.save();
          c.fillStyle = C.dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.12)'; c.fillRect(b.x + 8, b.y + b.h - 9, b.w - 16, 4);
          c.fillStyle = bad ? C.bad : C.accent; c.fillRect(b.x + 8, b.y + b.h - 9, Math.max(2, (b.w - 16) * clamp(frac, 0, 1)), 4);
          c.restore();
        };
        let appIdx = 0;
        t.rows.forEach((r, i) => {
          const b = bx[i + 2];
          if (r.type === 'app') { if (appIdx === 0) gauge(b, prog / r.size, prog > r.size); appIdx++; }
          else if (r.name === 'spiffs') gauge(b, files / r.size, files > r.size);
        });
        // the table as text
        if (wide) {
          const x0 = M + lw + 22, pw = W - x0 - M;
          kit.label(c, 'partitions.csv', x0, 15, { size: 12, color: C.muted, weight: 600 });
          const lines = ['# Name, Type, SubType, Offset, Size'].concat(t.rows.map(r => r.name + ', ' + r.type + ', ' + r.subtype + ', 0x' + r.offset.toString(16) + ', 0x' + r.size.toString(16)));
          lines.forEach((ln, i) => S.text(c, ln, x0, 40 + i * 18, { align: 'left', mono: true, size: pw < 290 ? 10 : 11, color: i === 0 ? C.faint : C.text }));
          const ey = 40 + lines.length * 18 + 14;
          if (t.errors.length) t.errors.slice(0, 3).forEach((e, i) => S.text(c, e, x0, ey + i * 16, { align: 'left', size: 10.5, color: C.bad }));
          else S.text(c, 'the table fits the flash: ' + kbText(t.free / 1024) + ' left over', x0, ey, { align: 'left', size: 10.5, color: C.muted });
          S.text(c, '* the bootloader starts at 0x1000 on the ESP32 and S2, at 0x0 on the S3, C3 and C6', x0, H - 14, { align: 'left', size: 9.5, color: C.faint });
        }
        // numbers
        const fs = t.rows.find(r => r.name === 'spiffs');
        ro.set('flash', kbText(sc.flash / 1024) + ' · table ends ' + hex6(t.used));
        ro.set('slot', kbText(t.appMax / 1024) + (t.ota ? ' (two slots of that size)' : ' (a single slot)'));
        const fits = prog <= t.appMax;
        ro.set('verdict', fits ? 'fits, ' + kbText((t.appMax - prog) / 1024) + ' to spare' : 'too big: the build stops (Maximum is ' + t.appMax + ' bytes)');
        ro.set('upd', t.ota ? (fits ? 'possible: it goes into the idle slot' : 'impossible: the new program must fit one slot') : 'not possible: one slot only, update by cable');
        ro.set('fs', fs ? kbText(fs.size / 1024) : 'none');
        ro.set('fsv', fs ? (files <= fs.size ? 'fit (' + Math.round(100 * files / fs.size) + ' % full)' : 'do not fit') : 'nowhere to put them');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ms-nvs-wear */
  Hyper.sim('ms-nvs-wear', {
    title: 'NVS: a value walking through the pages',
    blurb: `Each row is one 4 KB page of the NVS partition, drawn as its **126 entries**. Writing a value never overwrites: a new entry is appended and the old one is marked **dead**. When the active page is full the next free page takes over; when only the spare page is left, the page with the most dead entries is cleaned — its live entries are copied and the page is **erased** (the number at the right counts those erases).

**Try this**
- Press *Run*: the counter's live entry (blue) moves on at every write, leaving dead entries (grey) behind.
- Watch the erase counts: they rise one page at a time, taking turns. That is wear levelling. Page 0 holds the values written once and is never cleaned, so it takes no part.
- Raise **Other values stored** to 250 or more: they fill whole pages that never take part in the rotation, so fewer pages share the wear and the life estimate drops.
- Give the partition more pages: each page then takes its turn less often, and the life estimate grows.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const ENTRIES = 126;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 520 });
      let pages = [], freeList = [], seq = 0, active = 0, writes = 0, erases = 0, counterAt = null, lastAt = null, running = true, acc = 0;
      const append = kind => {
        if (pages[active].used >= ENTRIES) advance();
        const pg = pages[active], i = pg.used++;
        pg.e[i] = kind; lastAt = { p: active, i };
        return { p: active, i };
      };
      function advance() {
        // free pages are taken from the front of a queue; a cleaned page goes to the back, so every page gets its turn
        if (freeList.length >= 2) { active = freeList.shift(); pages[active].seq = ++seq; return; }
        // only the spare page is free: clean the page with most dead entries into it
        const target = freeList.shift();
        let victim = -1, best = -1;
        pages.forEach((p, k) => { if (k !== target && p.used >= ENTRIES) { let dead = 0; for (let i = 0; i < ENTRIES; i++) if (p.e[i] === 3) dead++; if (dead > best || (dead === best && p.seq < pages[victim].seq)) { best = dead; victim = k; } } });   // most dead entries; the oldest page wins a tie
        if (victim < 0) { freeList.unshift(target); return; }
        active = target; pages[active].seq = ++seq;
        const v = pages[victim], tp = pages[target];
        for (let i = 0; i < ENTRIES; i++) {
          if (v.e[i] === 1 || v.e[i] === 2) { const pos = tp.used++; tp.e[pos] = v.e[i]; if (v.e[i] === 2) counterAt = { p: target, i: pos }; }
        }
        v.e.fill(0); v.used = 0; v.erases++; erases++;
        freeList.push(victim);
      }
      const writeCounter = () => {
        if (counterAt) pages[counterAt.p].e[counterAt.i] = 3;       // the old value is marked dead
        counterAt = append(2);
        writes++;
      };
      const init = () => {
        const n = ctl.values.pages, keys = Math.min(ctl.values.keys, (n - 1) * ENTRIES - 40);
        pages = []; for (let k = 0; k < n; k++) pages.push({ e: new Uint8Array(ENTRIES), used: 0, erases: 0, seq: 0 });
        seq = 1; pages[0].seq = 1; active = 0; writes = 0; erases = 0; counterAt = null; lastAt = null; acc = 0;
        freeList = []; for (let k = 1; k < n; k++) freeList.push(k);
        for (let k = 0; k < keys; k++) append(1);
        append(2); counterAt = lastAt; lastAt = null;
      };
      const ctl = kit.controls(box.side, [
        { id: 'pages', label: 'Pages in the partition', min: 3, max: 8, step: 1, value: 5, unit: 'pages' },
        { id: 'keys', label: 'Other values stored', min: 0, max: 300, step: 4, value: 12 },
        { id: 'speed', label: 'Counter writes per second shown', min: 5, max: 200, step: 5, value: 40 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'one', label: 'Write once' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'run') { running = !running; if (running) loop.start(); else loop.stop(); }
        else if (id === 'one') writeCounter();
        else if (id === 'pages' || id === 'keys' || id === 'reset') init();
        loop.once();
      });
      const ro = kit.readout(box.side, [['writes', 'Counter writes'], ['erases', 'Page erases'], ['per', 'Writes paid for by one erase'], ['worn', 'Most-worn page'], ['life', 'Life at one write a second']]);
      init();
      const loop = kit.loop(dt => {
        if (running) { acc += dt * ctl.values.speed; let n = 0; while (acc >= 1 && n < 60) { acc -= 1; writeCounter(); n++; } if (n === 60) acc = 0; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, np = pages.length;
        const labW = 50, rightW = W < 520 ? 44 : 74, sx = M + labW, sw = W - sx - rightW - M;
        const rowH = clamp((H - 130) / np, 20, 40), y0 = 34, cw = sw / ENTRIES;
        kit.label(c, 'NVS: ' + np + ' pages of 4 KB (' + (np * 4) + ' KB), 126 entries each', M, 14, { size: 11.5, color: C.text2, weight: 600 });
        pages.forEach((pg, k) => {
          const y = y0 + k * (rowH + 6);
          kit.label(c, 'page ' + k, M, y + rowH / 2, { size: 11, color: k === active ? C.text : C.muted, weight: k === active ? 700 : 500, baseline: 'middle' });
          c.save(); rrect(c, sx - 1, y, sw + 2, rowH, 3); c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fill(); c.lineWidth = k === active ? 2 : 1; c.strokeStyle = k === active ? C.accent : C.faint; c.stroke(); c.restore();
          for (let i = 0; i < ENTRIES; i++) {
            const v = pg.e[i]; if (!v) continue;
            c.fillStyle = v === 1 ? kit.hue(150, 0.9) : v === 2 ? C.accent : (C.dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.25)');
            c.fillRect(sx + i * cw, y + 2, Math.max(1, cw - 0.5), rowH - 4);
          }
          if (lastAt && lastAt.p === k) { c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(sx + lastAt.i * cw - 1.5, y + 0.5, Math.max(3, cw) + 3, rowH - 1); }
          const free = ENTRIES - pg.used;
          kit.label(c, (W < 520 ? '' : 'erased ') + pg.erases + '×', sx + sw + 8, y + rowH / 2 - (W < 520 ? 0 : 6), { size: 11, weight: 650, baseline: 'middle', color: pg.erases ? C.text : C.faint });
          if (W >= 520) kit.label(c, k === active ? 'writing here' : free === ENTRIES ? 'free' : free ? free + ' free' : 'full', sx + sw + 8, y + rowH / 2 + 8, { size: 9.5, color: C.muted, baseline: 'middle' });
        });
        // legend
        const ly = y0 + np * (rowH + 6) + 8, items = [['the counter', C.accent], ['other values', kit.hue(150, 0.9)], ['dead entries', C.dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.25)'], ['free', null]];
        let lx = M;
        items.forEach(([t, col]) => {
          if (col) { c.fillStyle = col; c.fillRect(lx, ly - 5, 10, 10); } else { c.strokeStyle = C.faint; c.strokeRect(lx + 0.5, ly - 4.5, 9, 9); }
          kit.label(c, t, lx + 15, ly, { size: 10.5, color: C.muted, baseline: 'middle' });
          lx += 22 + t.length * 5.6;
        });
        kit.label(c, 'One page stays free for the next cleaning.', M, ly + 22, { size: 10.5, color: C.faint });
        // numbers
        const worn = Math.max(...pages.map(p => p.erases));
        ro.set('writes', String(writes));
        ro.set('erases', String(erases));
        ro.set('per', erases ? kit.fmt(writes / erases, 3) : '— (keep writing)');
        ro.set('worn', worn + ' erases of about 100 000');
        const workers = pages.filter(p => p.erases > 0).length;
        ro.set('life', erases ? lifeText(E.flashLife(86400, workers * writes / erases)) + ' (ideal)' : '— (keep writing)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ms-heap-fragmentation */
  const FR_N = 96, FR_COLS = 24, FR_LEN = 20;
  // long-lived blocks already in the heap: [start, size]. In the "reserved" mode the String's room is taken first, before they appear
  const FR_OTHERS = { strings: [[16, 2], [28, 1], [40, 2], [52, 1], [64, 2], [76, 1], [88, 2]], reserve: [[24, 2], [34, 1], [46, 2], [58, 1], [70, 2], [82, 1], [92, 2]] };
  const wrapWords = (text, max) => { const out = []; let line = ''; for (const w of String(text).split(' ')) { if ((line + ' ' + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); } if (line) out.push(line); return out; };

  Hyper.sim('ms-heap-fragmentation', {
    title: 'A heap in pieces',
    blurb: `The heap is drawn as 96 cells of 1 KB. Coloured cells are allocated blocks, empty cells are free. **Free memory in total is not the same as a free block**: the green dashed frame marks the *largest* gap, the biggest allocation that can succeed.

**Try this**
- *Random blocks*: press *Run* and let allocations and frees mix for a while. The free total stays high but the largest gap shrinks; then press *Try the big request*.
- *A String grows*: a message String grows 1 KB at a time towards 20 KB in a heap that already holds a few long-lived blocks. When it cannot grow in place it **moves** to a bigger gap, leaving a hole behind — and at 17 KB no gap is big enough: it fails with 69 KB free. Press *Allocate* once or twice to see small blocks settle in the holes.
- *A String with reserve()*: the same String, but its 20 KB were taken first, when the heap was empty. It grows in place and never fails — though the long-lived blocks around it still split the rest of the heap: reserving protects the String, not the gaps.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 540 });
      let cells, blocks, nextId, rng, running = false, acc = 0, msg = '', msgKind = 'info', counts, str = 0, bigId = 0, bigAt = 0, clock = 0, last = '';
      const runs = () => { const out = []; let s = -1; for (let i = 0; i <= FR_N; i++) { const f = i < FR_N && cells[i] === 0; if (f && s < 0) s = i; else if (!f && s >= 0) { out.push({ s, n: i - s }); s = -1; } } return out; };
      const put = (s, n, kind, hue, cap) => { const id = nextId++; blocks[id] = { id, s, n, kind, hue, cap: cap || n, movedAt: -9 }; for (let i = s; i < s + (cap || n); i++) cells[i] = id; return id; };
      const alloc = (n, kind) => { const r = runs().find(q => q.n >= n); if (!r) return 0; return put(r.s, n, kind, 20 + (nextId * 53) % 300); };
      const release = id => { const b = blocks[id]; if (!b) return; for (let i = b.s; i < b.s + b.cap; i++) cells[i] = 0; delete blocks[id]; };
      const usedCells = () => { let u = 0; for (let i = 0; i < FR_N; i++) if (cells[i]) u++; return u; };
      const init = () => {
        cells = new Int16Array(FR_N); blocks = {}; nextId = 1; rng = mulberry(11); counts = { alloc: 0, free: 0, moves: 0 };
        acc = 0; msg = ''; msgKind = 'info'; bigId = 0; running = false; str = 0; last = '';
        const mode = ctl.values.mode;
        if (mode === 'random') { for (let k = 0; k < 9; k++) alloc(1 + Math.floor(rng() * 5), 'tmp'); }
        else {
          if (mode === 'reserve') str = put(0, 1, 'str', 212, FR_LEN);
          FR_OTHERS[mode].forEach(([s, n]) => put(s, n, 'other', 270));
          if (mode === 'strings') str = put(18, 1, 'str', 212);
        }
      };
      const growString = () => {
        const b = blocks[str];
        if (b.n >= FR_LEN) { msg = 'The String is complete: ' + FR_LEN + ' KB.'; msgKind = 'ok'; running = false; return; }
        if (b.n < b.cap) { b.n++; last = 'grew inside its reserved room'; return; }
        const next = b.s + b.n;
        if (next < FR_N && cells[next] === 0) { cells[next] = str; b.n++; b.cap++; last = 'grew in place'; return; }
        const r = runs().find(q => q.n >= b.n + 1);
        if (!r) { msg = 'Out of memory: the String needs ' + (b.n + 1) + ' KB in one piece, the largest gap is ' + Math.max(0, ...runs().map(q => q.n)) + ' KB — and ' + (FR_N - usedCells()) + ' KB are free.'; msgKind = 'bad'; running = false; return; }
        release(str);                                   // the old room is freed only after the new one is chosen
        str = put(r.s, b.n + 1, 'str', 212); blocks[str].movedAt = clock; counts.moves++; last = 'moved to a bigger gap, leaving a hole';
      };
      const SIZES = [1, 1, 2, 2, 3, 4, 6];
      const allocSmall = () => {
        const n = ctl.values.mode === 'random' ? SIZES[Math.floor(rng() * SIZES.length)] : 1 + Math.floor(rng() * 2);
        const id = alloc(n, ctl.values.mode === 'random' ? 'tmp' : 'other');
        if (id) { counts.alloc++; if (ctl.values.mode !== 'random') blocks[id].hue = 270; } else { msg = 'An allocation of ' + n + ' KB failed: no gap that big.'; msgKind = 'bad'; }
      };
      const freeSmall = () => {
        const ids = Object.keys(blocks).filter(k => blocks[k].kind === 'tmp' || (blocks[k].kind === 'other' && ctl.values.mode !== 'random'));
        if (!ids.length) return;
        release(+ids[Math.floor(rng() * ids.length)]); counts.free++;
      };
      const churn = () => { const u = usedCells() / FR_N; if (u < 0.5) allocSmall(); else if (u > 0.85) freeSmall(); else if (rng() < 0.5) allocSmall(); else freeSmall(); };
      const step = () => { if (ctl.values.mode === 'random') churn(); else growString(); };
      const bigTry = () => {
        const need = Math.round(ctl.values.big), rs = runs(), largest = rs.reduce((a, r) => Math.max(a, r.n), 0), total = FR_N - usedCells();
        if (largest >= need) { bigId = alloc(need, 'big'); bigAt = clock; msg = need + ' KB: allocated (the largest gap was ' + largest + ' KB).'; msgKind = 'ok'; }
        else { msg = need + ' KB: FAILED. No gap that big: the largest is ' + largest + ' KB, though ' + total + ' KB are free.'; msgKind = 'bad'; }
        loop.start();
      };
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What happens', options: [['Random blocks', 'random'], ['A String grows', 'strings'], ['A String with reserve()', 'reserve']], value: 'random' },
        { id: 'big', label: 'Big request', min: 4, max: 60, step: 1, value: 24, unit: 'KB' },
        { type: 'buttons', items: [{ id: 'step', label: 'Step ▶', primary: true }, { id: 'run', label: 'Run / pause' }, { id: 'alloc', label: 'Allocate' }, { id: 'free', label: 'Free one' }, { id: 'try', label: 'Try the big request' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'mode' || id === 'reset') { init(); }
        else if (id === 'step') { running = false; step(); }
        else if (id === 'run') { running = !running; if (running) loop.start(); }
        else if (id === 'alloc') allocSmall();
        else if (id === 'free') freeSmall();
        else if (id === 'try') { bigTry(); return; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['free', 'Free in total'], ['largest', 'Largest gap'], ['frag', 'Unusable for one big block'], ['act', 'So far']]);
      init();
      const loop = kit.loop(dt => {
        clock += dt;
        if (running) { acc += dt * 5; while (acc >= 1 && running) { acc -= 1; step(); } }
        if (bigId && clock - bigAt > 1.6) { release(bigId); bigId = 0; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const rows = FR_N / FR_COLS, cw = (W - 2 * M) / FR_COLS, ch = clamp((H - 150) / rows, 22, 56), gy = 32;
        const mode = ctl.values.mode;
        kit.label(c, 'The heap: 96 cells of 1 KB', M, 13, { size: 12, color: C.text2, weight: 650 });
        for (let i = 0; i < FR_N; i++) {
          const x = M + (i % FR_COLS) * cw, y = gy + Math.floor(i / FR_COLS) * (ch + 4), id = cells[i], b = blocks[id];
          if (!id) { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x + 1.5, y + 1.5, cw - 3, ch - 3); continue; }
          const sameL = i % FR_COLS !== 0 && cells[i - 1] === id, sameR = i % FR_COLS !== FR_COLS - 1 && cells[i + 1] === id;
          const x0 = x + (sameL ? 0 : 1.5), x1 = x + cw - (sameR ? 0 : 1.5);
          const col = b.kind === 'big' ? C.accent : kit.hue(b.hue, 0.9);
          if (i - b.s >= b.n) { c.strokeStyle = col; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.strokeRect(x0 + 0.5, y + 2, x1 - x0 - 1, ch - 4); c.setLineDash([]); }
          else { c.fillStyle = col; c.fillRect(x0, y + 1.5, x1 - x0, ch - 3); }
          if (b.kind === 'str' && clock - b.movedAt < 0.6) { c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(x0, y + 1.5, x1 - x0, ch - 3); }
        }
        // the largest gap
        const rs = runs();
        let best = null; for (const r of rs) if (!best || r.n > best.n) best = r;
        if (best) {
          c.save(); c.strokeStyle = C.ok; c.lineWidth = 2; c.setLineDash([5, 3]);
          let i = best.s; const end = best.s + best.n;
          while (i < end) { const row = Math.floor(i / FR_COLS), j = Math.min(end, (row + 1) * FR_COLS); c.strokeRect(M + (i % FR_COLS) * cw + 0.5, gy + row * (ch + 4) - 1, (j - i) * cw - 1, ch + 2); i = j; }
          c.restore();
        }
        const free = FR_N - usedCells(), largest = best ? best.n : 0;
        // the legend and the message
        const ly = gy + rows * (ch + 4) + 12;
        const legend = mode === 'random' ? 'coloured: allocated blocks · empty: free · green dashed frame: the largest gap' : 'blue: the String (dashed: room reserved, not yet used) · violet: blocks that live on · green dashed frame: the largest gap';
        wrapWords(legend, Math.floor((W - 2 * M) / 5.8)).forEach((ln, k) => kit.label(c, ln, M, ly + k * 14, { size: 10.5, color: C.muted }));
        const lines = wrapWords(msg || (mode === 'random' ? 'Press Run, or Step, to allocate and free.' : 'Press Run, or Step: the String grows 1 KB at a time.'), Math.floor((W - 2 * M) / 6.4));
        const my = ly + 34;
        lines.slice(0, 3).forEach((ln, k) => kit.label(c, ln, M, my + k * 16, { size: 12, weight: 650, color: msgKind === 'bad' ? C.bad : msgKind === 'ok' ? C.ok : C.text }));
        ro.set('free', free + ' KB');
        ro.set('largest', largest + ' KB');
        ro.set('frag', free ? Math.round(100 * (1 - largest / free)) + ' % of the free memory' : 'no free memory');
        ro.set('act', mode === 'random' ? counts.alloc + ' allocations, ' + counts.free + ' frees' : (blocks[str] ? 'String ' + blocks[str].n + ' KB; ' + counts.moves + ' move' + (counts.moves === 1 ? '' : 's') + (last ? ' (' + last + ')' : '') : '—'));
        if (!running && !bigId) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ms-stack-heap */
  const SH_BUFFERS = [['none', 0], ['JSON text, 16 KB', 16], ['LVGL band, 30 KB', 30], ['320 × 240 frame, 150 KB', 150], ['480 × 320 frame, 300 KB', 300], ['two 480 × 320 frames, 600 KB', 600]];
  Hyper.sim('ms-stack-heap', {
    title: 'Where the RAM goes',
    blurb: `The first bar is the **internal RAM** of the chip, taken from the catalogue. Part of it is code RAM, cache and the system; static data comes next; what is left is the **heap**, from which the stacks of the tasks, the Wi-Fi stack and everything your program allocates are taken. The second bar, if the board has it, is PSRAM. The last bar is the **stack of the loop task**.

The sizes of the system part, of Wi-Fi and of the frames are typical and rounded: the point is the shape. Print \`ESP.getFreeHeap()\` on your own board for the truth.

**Try this**
- Switch **Wi-Fi** on and add tasks with big stacks: the free heap melts away long before the RAM figure of the datasheet.
- Choose a **320 × 240 frame** with no PSRAM, then with 8 MB of PSRAM and the buffer put in PSRAM.
- Choose the ESP32-C3: it has no PSRAM interface, so the buffer must fit inside.
- Raise the **local array** in loop() to 7 KB and beyond: the stack is a fixed 8 KB and overflows, however much heap is free.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 420, maxH: 600 });
      const chips = ['esp32', 'esp32-s3', 'esp32-c3'].filter(id => E.chip(id));
      const ps0 = Number(params.psram) || 0;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(id => [E.chip(id).name, id]), value: chips.includes(params.chip) ? params.chip : chips[0] },
        { id: 'static', label: 'Global variables', min: 4, max: 120, step: 2, value: 30, unit: 'KB' },
        { id: 'wifi', type: 'check', label: 'Wi-Fi switched on', value: false },
        { id: 'tasks', label: 'Extra tasks', min: 0, max: 8, step: 1, value: 2 },
        { id: 'stack', label: 'Stack of each extra task', min: 1, max: 16, step: 1, value: 4, unit: 'KB' },
        { id: 'buf', type: 'select', label: 'A buffer you need', options: SH_BUFFERS, value: ps0 ? 150 : 0 },
        { id: 'psram', type: 'select', label: 'PSRAM on the board', options: [['none', 0], ['2 MB', 2], ['8 MB', 8]], value: ps0 },
        { id: 'where', type: 'select', label: 'Put the buffer in', options: [['internal RAM', 'int'], ['PSRAM', 'ps']], value: ps0 ? 'ps' : 'int' },
        { id: 'local', label: 'Local array in loop()', min: 0, max: 12, step: 0.5, value: 2, unit: 'KB' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ram', 'Internal RAM'], ['heap', 'Free heap'], ['ps', 'PSRAM'], ['stk', 'Loop task stack'], ['verdict', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, bw = W - 2 * M;
        const v = ctl.values, chip = E.chip(v.chip), sram = chip.sram;
        const hasPs = chip.psramMax != null;
        ctl.show('psram', hasPs);
        const psMb = hasPs ? v.psram : 0;
        ctl.show('where', psMb > 0);
        const heapStart = Math.round(0.56 * sram), sys = Math.max(0, sram - v.static - heapStart);
        const wifi = v.wifi ? 55 : 0, stacks = 8 + v.tasks * v.stack, buf = v.buf;
        const inPs = psMb > 0 && v.where === 'ps', bufInt = inPs ? 0 : buf;
        const need = wifi + stacks + bufInt, free = heapStart - need, over = free < 0;
        // bar 1: internal RAM
        kit.label(c, 'Internal RAM of the ' + chip.name + ': ' + kbText(sram), M, 13, { size: 12, weight: 650 });
        const by = 26, bh = 34, X = kb => M + (kb / sram) * bw;
        const segs = [['system & code RAM', sys, C.dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.2)'], ['global variables', v.static, kit.hue(270, 0.9)], ['task stacks', stacks, kit.hue(40, 0.9)], ['Wi-Fi', wifi, kit.hue(212, 0.9)], ['your buffer', bufInt, C.accent], ['free heap', Math.max(0, free), null]];
        let x = M; const legend = [];
        segs.forEach(([name, kb, col]) => {
          const w = Math.min(bw - (x - M), (kb / sram) * bw);
          if (kb > 0 && w > 0) {
            if (col) { c.fillStyle = col; c.fillRect(x, by, Math.max(1, w), bh); } else { c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'; c.fillRect(x, by, w, bh); }
            x += w;
          }
          legend.push([name, kb, col]);
        });
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(M, by, bw, bh);
        if (over) { c.strokeStyle = C.bad; c.lineWidth = 3; c.strokeRect(M - 1, by - 1, bw + 2, bh + 2); S.text(c, 'does not fit by ' + kbText(-free), M + bw / 2, by + bh / 2, { size: 12.5, weight: 700, color: C.bad }); }
        // legend, two columns
        const cols = W < 520 ? 2 : 3, lw = bw / cols;
        legend.forEach(([name, kb, col], i) => {
          const lx = M + (i % cols) * lw, ly = by + bh + 16 + Math.floor(i / cols) * 17;
          if (col) { c.fillStyle = col; c.fillRect(lx, ly - 5, 10, 10); } else { c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(lx + 0.5, ly - 4.5, 9, 9); }
          kit.label(c, name + ' ' + kbText(kb), lx + 15, ly, { size: 10.5, color: C.text2, baseline: 'middle' });
        });
        // bar 2: PSRAM
        const rowsLeg = Math.ceil(legend.length / cols), y2 = by + bh + 16 + rowsLeg * 17 + 14;
        let y3 = y2;
        if (psMb > 0) {
          const psKb = psMb * 1024;
          kit.label(c, 'PSRAM: ' + psMb + ' MB, reached through the cache (slower)', M, y2 + 2, { size: 12, weight: 650 });
          const py = y2 + 14;
          c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'; c.fillRect(M, py, bw, 22);
          if (inPs && buf > 0) { c.fillStyle = C.accent; c.fillRect(M, py, Math.max(2, bw * buf / psKb), 22); }
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(M, py, bw, 22);
          kit.label(c, inPs && buf ? 'your buffer ' + kbText(buf) + ' · free ' + kbText(psKb - buf) : 'free ' + kbText(psKb) + ' (the buffer is not here)', M + 6, py + 11, { size: 10.5, baseline: 'middle', color: inPs && buf ? '#fff' : C.text2 });
          y3 = py + 22 + 22;
        } else {
          kit.label(c, hasPs ? 'No PSRAM fitted on this board.' : chip.name + ' has no PSRAM interface.', M, y2 + 2, { size: 11.5, color: C.faint });
          y3 = y2 + 26;
        }
        // bar 3: the stack of the loop task
        const STK = 8, base = 1.5, used = base + v.local, sOver = used > STK;
        kit.label(c, 'Stack of the loop task: fixed ' + STK + ' KB', M, y3, { size: 12, weight: 650 });
        const sy = y3 + 12, sh = 24, sx = x2 => M + (x2 / STK) * bw * 0.72, sw = bw * 0.72;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'; c.fillRect(M, sy, sw, sh);
        c.fillStyle = kit.hue(40, 0.9); c.fillRect(M, sy, sx(Math.min(base, STK)) - M, sh);
        c.fillStyle = sOver ? C.bad : kit.hue(212, 0.9); c.fillRect(sx(base), sy, Math.max(0, sx(Math.min(used, STK)) - sx(base)), sh);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(M, sy, sw, sh);
        c.fillStyle = C.warn; c.fillRect(M + sw - 5, sy - 3, 5, sh + 6);
        kit.label(c, 'canary', M + sw + 6, sy + sh / 2 - 6, { size: 10, color: C.warn, baseline: 'middle' });
        kit.label(c, 'frames ' + kit.fmt(base, 2) + ' KB + array ' + kit.fmt(v.local, 2) + ' KB', M, sy + sh + 14, { size: 10.5, color: C.muted });
        if (sOver) wrapWords('Stack overflow: the canary at the end is overwritten. The chip stops with "Stack canary watchpoint triggered (loopTask)".', Math.floor(bw / 6.2)).slice(0, 2).forEach((ln, k) => kit.label(c, ln, M, sy + sh + 32 + k * 14, { size: 11, weight: 650, color: C.bad }));
        // numbers
        ro.set('ram', kbText(sram) + ' (system ' + kbText(sys) + ', static ' + kbText(v.static) + ', heap at start ' + kbText(heapStart) + ')');
        ro.set('heap', over ? 'none: ' + kbText(need) + ' wanted from ' + kbText(heapStart) : kbText(free) + ' of ' + kbText(heapStart));
        ro.set('ps', psMb > 0 ? (inPs && buf ? kbText(psMb * 1024 - buf) + ' free' : kbText(psMb * 1024) + ' free') : (hasPs ? 'none fitted' : 'no interface'));
        ro.set('stk', kit.fmt(used, 2) + ' of ' + STK + ' KB' + (sOver ? ' — overflow' : ''));
        ro.set('verdict', sOver ? 'the task crashes, though the heap is fine' : over ? (buf && !inPs ? 'the buffer does not fit: ' + (psMb > 0 ? 'put it in PSRAM' : hasPs ? 'add PSRAM' : 'draw in strips or choose another chip') : 'too many stacks, Wi-Fi and buffers for the heap') : 'fits');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ms-json-memory */
  const JS_KEYS = ['t', 'temp', 'hum', 'pres', 'lux', 'co2', 'bat', 'rssi'];
  const bytesText = b => (b >= 1024 ? (b / 1024).toFixed(b >= 10240 ? 0 : 1) + ' KB' : Math.round(b) + ' bytes');
  Hyper.sim('ms-json-memory', {
    title: 'JSON: the text against its memory',
    blurb: `A message is an array of readings, each an object with a few fields. The bar is your **free heap**; the coloured parts are what the parse uses: the **text** (when it is first collected in a String) and the **document** the parser builds from it. The model is approximate — every value takes a slot of a few bytes, keys and text values are copied — and says "assumed" where the exact figure depends on the library and the chip. On your board \`doc.memoryUsage()\` gives the true number.

**Try this**
- Raise the number of readings: text and document grow together, and the document is several times the text.
- Tick **Parse from the stream**: the String copy of the text disappears from the bar.
- Tick **Filter**: only two fields per reading are kept, and the document shrinks, though the text it reads does not.
- Make the free heap small and watch the verdict flip.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Readings in the message', min: 1, max: 400, log: true, value: 40, fmt: v => String(Math.round(v)) },
        { id: 'fields', label: 'Fields in each reading', min: 1, max: 8, step: 1, value: 3 },
        { id: 'klen', label: 'Key length', min: 1, max: 14, step: 1, value: 4, unit: 'characters' },
        { id: 'vlen', label: 'Value length', min: 1, max: 14, step: 1, value: 4, unit: 'characters' },
        { id: 'isText', type: 'check', label: 'Values are text, not numbers', value: false },
        { id: 'slot', label: 'Bytes per value in the document (assumed)', min: 8, max: 24, step: 4, value: 16 },
        { id: 'filter', type: 'check', label: 'Filter: keep only 2 fields', value: false },
        { id: 'stream', type: 'check', label: 'Parse from the stream (no String copy)', value: false },
        { id: 'heap', label: 'Free heap', min: 20, max: 300, step: 10, value: 120, unit: 'KB' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['text', 'JSON text'], ['doc', 'Parsed document'], ['need', 'Memory needed'], ['free', 'Free heap'], ['verdict', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, bw = W - 2 * M;
        const v = ctl.values, n = Math.round(v.n), f = v.fields, k = v.klen, l = v.vlen;
        const field = k + 3 + l + (v.isText ? 2 : 0), obj = 2 + (f - 1) + f * field;
        const text = 2 + n * obj + (n - 1);
        const kept = v.filter ? Math.min(2, f) : f;
        const slots = 1 + n + n * kept;
        const doc = slots * v.slot + n * kept * (k + 1) + (v.isText ? n * kept * (l + 1) : 0);
        const copy = v.stream ? 0 : text, need = doc + copy, heap = v.heap * 1024;
        // a sample of the text
        const key = i => JS_KEYS[i % JS_KEYS.length].slice(0, k).padEnd(k, '_');
        const val = i => { const d = '27182818284590'.slice(0, l); return v.isText ? '"' + d + '"' : d; };
        let sample = '[{' + Array.from({ length: f }, (_, i) => '"' + key(i) + '":' + val(i)).join(',') + '},{…}';
        sample += n > 2 ? ' … ' + n + ' in all]' : ']';
        const maxCh = Math.floor(bw / 7.1);
        kit.label(c, 'The message, first reading:', M, 13, { size: 11.5, color: C.muted, weight: 600 });
        S.text(c, sample.length > maxCh ? sample.slice(0, maxCh - 1) + '…' : sample, M, 32, { align: 'left', mono: true, size: 11.5 });
        // the bar of the heap
        const scale = Math.max(heap, need) * 1.04, X = b => M + (b / scale) * bw, by = 78, bh = 40;
        kit.label(c, 'The free heap, ' + kbText(v.heap) + ':', M, by - 12, { size: 11.5, color: C.muted, weight: 600 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(M, by, X(heap) - M, bh);
        let used = 0;
        const part = (bytes, col) => { if (bytes <= 0) return; c.fillStyle = col; c.fillRect(X(used), by, Math.max(1, X(used + bytes) - X(used)), bh); used += bytes; };
        if (copy) part(copy, kit.hue(40, 0.9));
        part(doc, C.accent);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.strokeRect(M, by, X(heap) - M, bh);
        const over = need > heap;
        if (over) { c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(X(heap), by - 8); c.lineTo(X(heap), by + bh + 8); c.stroke(); c.setLineDash([]); kit.label(c, 'heap ends here', X(heap) - 4, by + bh + 20, { size: 10.5, color: C.bad, align: 'right' }); }
        // legend
        const ly = by + bh + (over ? 38 : 24);
        const lg = [[v.stream ? 'text: read from the stream, never held whole' : 'the text, held in a String: ' + bytesText(text), v.stream ? null : kit.hue(40, 0.9)], ['the parsed document: ' + bytesText(doc), C.accent], [over ? 'missing: ' + bytesText(need - heap) : 'left free: ' + bytesText(heap - need), null]];
        lg.forEach(([t, col], i) => {
          const yy = ly + i * 18;
          if (col) { c.fillStyle = col; c.fillRect(M, yy - 5, 10, 10); } else { c.strokeStyle = over && i === 2 ? C.bad : C.faint; c.lineWidth = 1; c.strokeRect(M + 0.5, yy - 4.5, 9, 9); }
          kit.label(c, t, M + 16, yy, { size: 11, color: over && i === 2 ? C.bad : C.text2, baseline: 'middle' });
        });
        kit.label(c, 'ratio: the document is ' + kit.fmt(doc / Math.max(1, text), 2) + ' × the text', M, ly + 3 * 18 + 8, { size: 11, color: C.muted });
        // numbers
        ro.set('text', bytesText(text));
        ro.set('doc', bytesText(doc) + ' (' + kit.fmt(doc / Math.max(1, text), 2) + ' × the text)');
        ro.set('need', bytesText(need) + (v.stream ? ' (streamed)' : ' (text + document)'));
        ro.set('free', kbText(v.heap));
        ro.set('verdict', over ? 'does not fit: ' + (v.filter ? '' : 'filter, ') + (v.stream ? '' : 'stream, ') + 'or take the message in pieces' : 'fits, with ' + bytesText(heap - need) + ' to spare');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ms-ring-buffer */
  Hyper.sim('ms-ring-buffer', {
    title: 'A ring buffer in front of a slow writer',
    blurb: `The sampler puts a reading into the ring every instant; every **writer period** the writer wakes, takes everything waiting and writes it to flash or the card. While a write is in progress those cells stay occupied (amber). The graph shows how full the ring has been over the last 30 seconds.

**Try this**
- Leave the defaults: the ring keeps up, and the flash is written only once every few seconds.
- Raise the **sampling rate** or lengthen the **writer period** until the ring fills: samples are *lost* (red).
- Tick **the card stalls now and then**: every twelve seconds a write takes three extra seconds. A big enough ring rides it out; a small one loses samples.
- Compare *drop the newest* with *overwrite the oldest*: the same number is lost, but different ones.
- Read **flash writes per day** for the period you chose, and think of the page on wear.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330, maxH: 520 });
      let slots, tail, count, t, acc, nextWake, writing, wLeft, inflight, lost, written, flushes, peak, hist, histAcc, stallClock, lostFlash, lastLost;
      let running = true;
      const init = () => {
        const C0 = Math.round(ctl.values.cap);
        slots = new Array(C0).fill(0); tail = 0; count = 0; t = 0; acc = 0; nextWake = ctl.values.period; writing = false; wLeft = 0; inflight = 0;
        lost = 0; written = 0; flushes = 0; peak = 0; hist = []; histAcc = 0; stallClock = 0; lostFlash = 0; lastLost = [];
      };
      const waiting = () => { let w = 0; for (let j = 0; j < count; j++) if (slots[(tail + j) % slots.length] === 1) w++; return w; };
      const produce = () => {
        const C0 = slots.length;
        if (count < C0) { slots[(tail + count) % C0] = 1; count++; return; }
        lost++; lostFlash = 0.35; lastLost.push(t);
        if (ctl.values.policy === 'over') {
          // the oldest waiting sample is replaced: shift the later ones down and append the new one
          let at = -1; for (let j = 0; j < count; j++) if (slots[(tail + j) % C0] === 1) { at = j; break; }
          if (at >= 0) { for (let j = at; j < count - 1; j++) slots[(tail + j) % C0] = slots[(tail + j + 1) % C0]; slots[(tail + count - 1) % C0] = 1; }
        }
      };
      const advance = dt => {
        t += dt; stallClock += dt;
        acc += dt * ctl.values.rate; let guard = 0;
        while (acc >= 1 && guard++ < 200) { acc -= 1; produce(); }
        if (writing) {
          wLeft -= dt;
          if (wLeft <= 0) { for (let j = 0; j < inflight; j++) { slots[(tail + j) % slots.length] = 0; } tail = (tail + inflight) % slots.length; count -= inflight; written += inflight; inflight = 0; writing = false; flushes++; }
        } else {
          nextWake -= dt;
          if (nextWake <= 0) {
            nextWake += ctl.values.period; if (nextWake < 0) nextWake = ctl.values.period;
            const n = waiting();
            if (n > 0) {
              for (let j = 0; j < count; j++) { const ix = (tail + j) % slots.length; if (slots[ix] === 1) slots[ix] = 2; }
              inflight = count; writing = true;
              wLeft = 0.05 + n * 0.004; if (ctl.values.stall && stallClock >= 12) { wLeft += 3; stallClock = 0; }
            }
          }
        }
        peak = Math.max(peak, count);
        histAcc += dt; while (histAcc >= 0.1) { histAcc -= 0.1; hist.push(count); if (hist.length > 300) hist.shift(); }
        if (lostFlash > 0) lostFlash -= dt;
      };
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Sampling rate', min: 1, max: 40, step: 1, value: 10, unit: 'a second' },
        { id: 'cap', label: 'Ring buffer size', min: 8, max: 64, step: 4, value: 32, unit: 'samples' },
        { id: 'period', label: 'Writer period', min: 0.5, max: 10, step: 0.5, value: 2, unit: 's' },
        { id: 'stall', type: 'check', label: 'The card stalls now and then', value: false },
        { id: 'policy', type: 'select', label: 'When the ring is full', options: [['drop the newest sample', 'drop'], ['overwrite the oldest waiting one', 'over']], value: 'drop' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'run') { running = !running; if (running) loop.start(); else loop.stop(); }
        else if (id === 'cap' || id === 'reset') init();
        loop.once();
      });
      const ro = kit.readout(box.side, [['fill', 'In the ring now · peak'], ['lost', 'Samples lost'], ['written', 'Samples written'], ['perday', 'Flash writes per day'], ['verdict', 'Verdict']]);
      init();
      const loop = kit.loop(dt => {
        if (running) advance(dt);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, n = slots.length, v = ctl.values;
        const wide = W >= 600;
        const rr = Math.min(wide ? W * 0.2 : W * 0.3, (wide ? H : H * 0.5) * 0.36), cx = wide ? M + rr + 26 : W / 2, cy = wide ? H / 2 : rr + 44;
        // the ring
        const r1 = rr * 0.62, r2 = rr, step = Math.PI * 2 / n;
        for (let i = 0; i < n; i++) {
          const a0 = -Math.PI / 2 + i * step + 0.012, a1 = -Math.PI / 2 + (i + 1) * step - 0.012;
          const occ = (i - tail + n) % n < count, state = occ ? slots[i] : 0;
          c.beginPath(); c.arc(cx, cy, r2, a0, a1); c.arc(cx, cy, r1, a1, a0, true); c.closePath();
          c.fillStyle = state === 1 ? C.accent : state === 2 ? C.warn : (C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'); c.fill();
          c.lineWidth = 1; c.strokeStyle = state ? C.axis : C.faint; c.stroke();
        }
        // head and tail
        const ang = i => -Math.PI / 2 + (i + 0.5) * step, head = (tail + count) % n;
        const tick = (i, color, label, off) => { const a = ang(i), x1 = cx + Math.cos(a) * (r2 + 4), y1 = cy + Math.sin(a) * (r2 + 4), x2 = cx + Math.cos(a) * (r2 + 16), y2 = cy + Math.sin(a) * (r2 + 16); kit.arrow(c, x2, y2, x1, y1, color, 2); kit.label(c, label, cx + Math.cos(a) * (r2 + 28 + off), cy + Math.sin(a) * (r2 + 28 + off), { size: 10.5, color, align: 'center', baseline: 'middle', weight: 650 }); };
        tick(head, C.accent, 'head', 0); if (count > 0) tick(tail, C.warn, 'tail', 0);
        if (lostFlash > 0) { c.strokeStyle = C.bad; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, r2 + 7, ang(head) - 0.5, ang(head) + 0.5); c.stroke(); }
        S.text(c, count + ' / ' + n, cx, cy - 6, { size: 15, weight: 700 });
        S.text(c, writing ? 'writing ' + inflight : 'waiting', cx, cy + 12, { size: 10.5, color: writing ? C.warn : C.muted });
        // the history
        const gx = wide ? cx + r2 + 70 : M + 6, gw = W - gx - M - 4, gy = wide ? 60 : cy + r2 + 56, gh = wide ? H - 120 : Math.max(70, H - gy - 36);
        kit.label(c, 'In the ring over the last 30 s', gx, gy - 14, { size: 11, color: C.muted, weight: 600 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(gx, gy, gw, gh);
        const gxp = i => gx + (i / 300) * gw, gyp = q => gy + gh - (q / n) * gh, off = 300 - hist.length;
        c.beginPath(); c.moveTo(gxp(off), gy + gh);
        hist.forEach((q, i) => c.lineTo(gxp(off + i), gyp(q)));
        c.lineTo(gxp(300), gy + gh); c.closePath(); c.fillStyle = C.dark ? 'rgba(123,140,255,.35)' : 'rgba(60,90,220,.28)'; c.fill();
        c.strokeStyle = C.bad; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(gx, gy + 0.5); c.lineTo(gx + gw, gy + 0.5); c.stroke(); c.setLineDash([]);
        kit.label(c, 'full: ' + n, gx + gw - 4, gy + 10, { size: 10, color: C.bad, align: 'right' });
        lastLost = lastLost.filter(q => t - q < 30);
        c.fillStyle = C.bad; lastLost.forEach(q => c.fillRect(gx + gw - ((t - q) / 30) * gw - 1, gy + gh - 5, 2, 5));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(gx, gy, gw, gh);
        // numbers
        ro.set('fill', count + ' of ' + n + ' · peak ' + peak);
        ro.set('lost', String(lost));
        ro.set('written', String(written) + ' in ' + flushes + ' write' + (flushes === 1 ? '' : 's'));
        ro.set('perday', kit.fmt(86400 / v.period, 4) + ' (one every ' + kit.fmt(v.period, 2) + ' s)');
        const need = Math.ceil(v.rate * v.period) + (v.stall ? Math.ceil(v.rate * 3) : 0);
        ro.set('verdict', lost === 0 ? (t < 5 ? 'running…' : 'keeps up (about ' + need + ' cells needed)') : 'overflows: ' + lost + ' lost; about ' + need + ' cells needed');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ms-wear-life */
  Hyper.sim('ms-wear-life', {
    title: 'How long does the flash last?',
    blurb: `Life in years against **writes per day**, both axes logarithmic. Three ways of saving: one sector rewritten in place, NVS (a 20 KB partition: four working pages, 126 writes per erase) and lines appended to a file in a file system (spread over the whole partition, one erase per sector-full of lines). The dashed line is ten years. The curves are ideal; real life is shorter.

**Try this**
- Drag **writes per day** to 86 400 (once a second): a single sector lasts about a day, NVS about a year and a half.
- Move to 1 440 (once a minute): even a single sector lasts three months, NVS outlives the product.
- Make the log lines bigger: fewer lines fit in a sector, so the log wears faster.
- Lower the erase cycles to 10 000 (a worn or poor part) and see all three curves drop.`,
    mount(box, kit) {
      const E = kit.esp;
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Writes per day', min: 1, max: 1000000, log: true, value: 86400, fmt: v => kit.fmt(v, 3) },
        { id: 'n', label: 'Erase cycles per sector', min: 10000, max: 1000000, log: true, value: 100000, fmt: v => kit.fmt(v, 2) },
        { id: 'fs', label: 'File-system size for the log', min: 64, max: 3500, step: 32, value: 1408, unit: 'KB' },
        { id: 'rec', label: 'Bytes per log line', min: 10, max: 400, step: 5, value: 40 }
      ], () => update());
      const ro = kit.readout(box.side, [['one', 'One sector, rewritten in place'], ['nvs', 'NVS, 20 KB'], ['log', 'Log lines in a file system'], ['verdict', 'Against ten years']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'writes per day', log: true }, y: { label: 'life (years)', log: true } }, 280);
      const stores = () => {
        const v = ctl.values, sectors = Math.max(1, Math.round(v.fs / 4)), perSector = Math.max(1, Math.floor(4096 / v.rec));
        return [['one sector, rewritten in place', 1], ['NVS, 20 KB', 4 * 126], ['log lines in a file system', sectors * perSector]];
      };
      function update() {
        const v = ctl.values, S3 = stores(), w = v.w;
        const life = k => E.flashLife(w, S3[k][1], v.n);
        const pts = k => { const out = []; for (let i = 0; i <= 60; i++) { const x = Math.pow(10, 6 * i / 60); out.push([x, clamp(E.flashLife(x, S3[k][1], v.n), 1e-4, 1e5)]); } return out; };
        plot.set({
          x: { label: 'writes per day', log: true, min: 1, max: 1e6 },
          y: { label: 'life (years)', log: true, min: 1e-4, max: 1e5 },
          series: [{ label: S3[0][0], pts: pts(0) }, { label: S3[1][0], pts: pts(1) }, { label: S3[2][0], pts: pts(2), dash: true }],
          hlines: [{ y: 10, label: 'ten years' }],
          vlines: [{ x: w, label: kit.fmt(w, 3) + ' a day' }]
        });
        ro.set('one', lifeText(life(0)));
        ro.set('nvs', lifeText(life(1)));
        ro.set('log', lifeText(life(2)) + ' (' + Math.max(1, Math.round(v.fs / 4)) + ' sectors, ' + Math.max(1, Math.floor(4096 / v.rec)) + ' lines each)');
        const fails = [0, 1, 2].filter(k => life(k) < 10).map(k => ['single sector', 'NVS', 'the log'][k]);
        ro.set('verdict', fails.length ? 'under ten years: ' + fails.join(', ') : 'all three last ten years or more');
      }
      update();
    }
  });
})();
