/* HYPER-ESP32 · sims/freertos-and-concurrency.js
 *
 * Simulations of the topic "FreeRTOS: several things at once" (freertos-and-concurrency):
 *
 *   fr-timeline    who runs when: three tasks, priorities, time slicing, a task that never blocks, a spinning wait
 *   fr-cores       which core runs what: loop(), your task and the radio on one or two cores (the chip comes from the catalogue)
 *   fr-queue       a producer and a consumer with a queue between them: filling, draining, dropping, blocking, overwriting
 *   fr-race        two tasks adding to one counter, instruction by instruction: lost updates, and the lock that prevents them
 *   fr-inversion   priority inversion and priority inheritance: a high task waiting for a lock held by a low one
 *   fr-isr         an event handled in the interrupt handler, or handed to a task by a semaphore, a notification or a queue
 *   fr-stack       a task's stack filling with a call chain, a local buffer and a library call; the high-water mark
 *   fr-timers      software timers: callbacks one after another in the timer service task, the tick, and a slow callback
 *   fr-asyncio     cooperative asyncio against pre-emptive tasks: what a job that does not yield does to the others
 *
 * The scheduling is simulated by the engine's fixed-priority scheduler (E.schedule) or by small models here; pictures
 * use theme colours only. Most are static pictures redrawn when a control changes; fr-queue, fr-race and fr-isr run.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const r1 = v => Math.round(v * 10) / 10;
  const fmtMs = v => (v >= 100 ? String(Math.round(v)) : v >= 10 ? String(r1(v)) : String(Math.round(v * 100) / 100)) + ' ms';
  const pctOf = v => Math.round(v * 100) + ' %';
  const rrPath = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); else c.rect(x, y, w, h); };
  const shortChip = ch => String(ch.name || ch.id).replace(/\s*\(.*\)\s*$/, '');
  /* the [a, b) intervals of an array in which every entry equals val */
  function segsOf(arr, val) {
    const out = []; let s = -1;
    for (let t = 0; t <= arr.length; t++) {
      const on = t < arr.length && arr[t] === val;
      if (on && s < 0) s = t;
      if (!on && s >= 0) { out.push([s, t]); s = -1; }
    }
    return out;
  }
  /* a nice spacing of time marks so that they are at least minPx apart */
  function niceMs(win, pw, minPx) {
    for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000]) if (s / win * pw >= minPx) return s;
    return 1000;
  }
  /* a pseudo-random generator that can be started again from a seed */
  function lcg(seed) { let s = (seed >>> 0) || 1; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ================================================================ fr-timeline */
  const TL_NAMES = ['Sensor', 'Display', 'Logger'];
  const TL_HUES = [212, 150, 28];
  const TL_BUSY = { none: [], S: [0], D: [1], L: [2], DL: [1, 2], all: [0, 1, 2] };
  const TL_SCEN = {
    priorities: { p: [3, 2, 1], busy: 'none', wL: 30, win: 200 },
    slicing: { p: [2, 2, 2], busy: 'all', wL: 30, win: 100 },
    starve: { p: [3, 2, 1], busy: 'S', wL: 30, win: 200 },
    spin: { p: [3, 2, 1], busy: 'D', wL: 30, win: 200 }
  };
  Hyper.sim('fr-timeline', {
    title: 'Who runs when',
    blurb: `Three tasks share one core. **Time runs to the right, one millisecond per step.** A **solid bar** means the task is running; a **pale bar** means it is ready but must wait for the core; **blank** means it is blocked, asleep until its next period. The triangles show when a task wakes up. The bottom row is the idle task: the core had nothing to do.

**Try this**
- In *Different priorities*, watch the **Sensor** (priority 3): it starts the moment it wakes, even in the middle of the Logger's long job, and the Logger is the one that waits. Now lower the Sensor's priority below the Logger's and see its pale bars grow.
- In *Equal priorities*, all three tasks run flat out: the core is shared in slices of one millisecond each.
- In *A task that never blocks*, the top-priority Sensor works for ever. Display and Logger never get a turn and the idle row is empty: the task watchdog would reset the chip.
- In *Waiting by spinning*, the Display waits by looping instead of sleeping. The Logger below it starves; the Sensor above is untouched.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 520 });
      const first = TL_SCEN[params.scenario] ? params.scenario : 'priorities';
      const F = TL_SCEN[first];
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Scenario', options: [['Different priorities', 'priorities'], ['Equal priorities: time slicing', 'slicing'], ['A task that never blocks', 'starve'], ['Waiting by spinning', 'spin']], value: first },
        { id: 'pS', label: 'Sensor priority', min: 1, max: 5, step: 1, value: F.p[0] },
        { id: 'pD', label: 'Display priority', min: 1, max: 5, step: 1, value: F.p[1] },
        { id: 'pL', label: 'Logger priority', min: 1, max: 5, step: 1, value: F.p[2] },
        { id: 'wL', label: 'Logger work each 100 ms', min: 5, max: 60, step: 5, value: F.wL, unit: 'ms' },
        { id: 'busy', type: 'select', label: 'Never blocks (spins)', options: [['no task', 'none'], ['Sensor', 'S'], ['Display', 'D'], ['Logger', 'L'], ['Display and Logger', 'DL'], ['all three', 'all']], value: F.busy },
        { id: 'win', label: 'Time shown', min: 100, max: 400, step: 50, value: F.win, unit: 'ms' }
      ], (id, v) => {
        if (id === 'scen') {
          const s = TL_SCEN[v];
          ctl.set('pS', s.p[0]); ctl.set('pD', s.p[1]); ctl.set('pL', s.p[2]); ctl.set('wL', s.wL); ctl.set('busy', s.busy); ctl.set('win', s.win);
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['load', 'Core busy'], ['u', 'Planned load'], ['resp', 'Sensor response'], ['miss', 'Deadlines missed'], ['share', 'Share of the core']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const win = Math.round(v.win), busy = TL_BUSY[v.busy] || [];
        const base = [{ prio: v.pS, period: 20, run: 4 }, { prio: v.pD, period: 50, run: 15 }, { prio: v.pL, period: 100, run: v.wL }];
        const tasks = base.map((t, i) => ({ name: TL_NAMES[i], prio: t.prio, period: busy.indexOf(i) >= 0 ? 1e6 : t.period, run: busy.indexOf(i) >= 0 ? 1e6 : t.run }));
        const res = E.schedule(tasks, win);
        // the state of every task in every millisecond: 2 running, 1 ready but waiting, 0 blocked
        const left = [0, 0, 0], due = [0, 0, 0], state = [[], [], []], rels = [[], [], []], ran = [0, 0, 0], worst = [0, 0, 0], done = [0, 0, 0], startAt = [0, 0, 0];
        for (let t = 0; t < win; t++) {
          for (let i = 0; i < 3; i++) if (t >= due[i]) { left[i] = tasks[i].run; due[i] += tasks[i].period; if (busy.indexOf(i) < 0) { rels[i].push(t); startAt[i] = t; } }
          const who = res.slots[t].task;
          for (let i = 0; i < 3; i++) state[i][t] = who === i ? 2 : left[i] > 0 ? 1 : 0;
          if (who >= 0) {
            ran[who]++; left[who]--;
            if (left[who] === 0 && busy.indexOf(who) < 0) { done[who]++; worst[who] = Math.max(worst[who], t + 1 - startAt[who]); }
          }
        }
        // the picture
        const lm = 62, rm = 12, top = 8, axisH = 34, pw = Math.max(40, st.W - lm - rm);
        const rowsH = st.H - top - axisH - 18, rh = rowsH / 4, bh = Math.min(30, rh * 0.62);
        const X = t => lm + t / win * pw;
        const rows = TL_NAMES.concat(['Idle']);
        rows.forEach((name, i) => {
          const y = top + i * rh, by = y + (rh - bh) / 2;
          const late = i < 3 && res.missed.indexOf(name) >= 0;
          kit.label(c, name, lm - 8, y + rh / 2 - (i < 3 ? 6 : 0), { size: 11.5, align: 'right', weight: 600, color: i < 3 ? C.text : C.muted });
          if (i < 3) kit.label(c, 'prio ' + base[i].prio, lm - 8, y + rh / 2 + 7, { size: 9.5, align: 'right', color: late ? C.bad : C.muted });
          if (i < 3 && busy.indexOf(i) >= 0) kit.label(c, 'never blocks: it spins', lm + 6, y + 9, { size: 9.5, color: C.warn });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(lm, y + 2, pw, rh - 4);
          if (i < 3) {
            for (const [a, b] of segsOf(state[i], 1)) { c.fillStyle = kit.hue(TL_HUES[i], 0.28); c.fillRect(X(a), by + bh * 0.3, Math.max(0.6, X(b) - X(a)), bh * 0.4); }
            for (const [a, b] of segsOf(state[i], 2)) { c.fillStyle = kit.hue(TL_HUES[i], 0.95); c.fillRect(X(a), by, Math.max(0.8, X(b) - X(a)), bh); }
            for (const t of rels[i]) { const x = X(t); c.fillStyle = kit.hue(TL_HUES[i]); c.beginPath(); c.moveTo(x - 3, y + 3); c.lineTo(x + 3, y + 3); c.lineTo(x, y + 9); c.closePath(); c.fill(); }
          } else {
            const idle = res.slots.map(s => (s.task < 0 ? 1 : 0));
            for (const [a, b] of segsOf(idle, 1)) { c.fillStyle = C.dark ? 'rgba(255,255,255,.22)' : 'rgba(0,0,0,.2)'; c.fillRect(X(a), by, Math.max(0.8, X(b) - X(a)), bh); }
          }
        });
        // the time axis
        const ay = top + 4 * rh + 4, step = niceMs(win, pw, 42);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(lm, ay); c.lineTo(lm + pw, ay); c.stroke();
        for (let t = 0; t <= win; t += step) {
          c.beginPath(); c.moveTo(X(t), ay); c.lineTo(X(t), ay + 4); c.stroke();
          kit.label(c, String(t), X(t), ay + 14, { size: 10, align: t === 0 ? 'left' : t + step > win ? 'right' : 'center', color: C.muted });
        }
        kit.label(c, 'ms', lm + pw, ay + 26, { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'solid: running · pale: waiting · blank: blocked', lm, ay + 26, { size: 10, color: C.muted });
        // the numbers
        const share = ran.map(n => Math.round(n / win * 100)), idleN = res.slots.filter(s => s.task < 0).length;
        const planned = base.reduce((a, t, i) => a + (busy.indexOf(i) >= 0 ? 0 : t.run / t.period), 0);
        ro.set('load', pctOf(res.load));
        ro.set('u', busy.length ? 'over 100 %: a task never blocks' : pctOf(planned) + (planned > 1 ? ' (too much)' : ''));
        ro.set('resp', busy.indexOf(0) >= 0 ? 'never finishes: it never blocks' : done[0] ? 'worst ' + fmtMs(worst[0]) + ' (needs 4 ms)' : 'did not finish in this window');
        ro.set('miss', res.missed.length ? res.missed.join(', ') : 'none');
        ro.set('share', 'Sensor ' + share[0] + ' % · Display ' + share[1] + ' % · Logger ' + share[2] + ' % · idle ' + Math.round(idleN / win * 100) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fr-cores */
  Hyper.sim('fr-cores', {
    title: 'Which core runs what',
    blurb: `The chip comes from the catalogue: a dual-core chip such as the ESP32 or ESP32-S3 has two cores, the rest have one. Each bar is the share of a core that a task needs. The radio and system tasks live on core 0, as in the Arduino core; \`loop()\` runs on core 1 unless the board menu says otherwise.

**Try this**
- On the **ESP32**, pin your task to **core 1** beside \`loop()\` and raise both works: that core overloads while core 0 is almost empty. Pin it to core 0 instead, or leave it **unpinned** and the scheduler uses the lighter core.
- Choose the **ESP32-C3**: everything shares core 0, and the loads that were spread over two cores are added up.
- On the C3 pin your task to **core 1**: the picture says that core does not exist. On a real chip that call is an error.
- Move \`loop()\` to **core 0** and watch it compete with the radio.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 560 });
      const chips = E.CHIPS.filter(c => !c.coproc && c.cores && c.id !== 'esp8266');   // the ESP8266 core has no FreeRTOS tasks to place
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [shortChip(c), c.id]), value: E.chip(params.chip) ? params.chip : 'esp32' },
        { id: 'loopCore', type: 'select', label: 'Arduino runs loop() on', options: [['core 1 (the default)', 1], ['core 0', 0]], value: 1 },
        { id: 'my', type: 'select', label: 'Your own task', options: [['not created', 'none'], ['unpinned: xTaskCreate', 'free'], ['pinned to core 0', 'p0'], ['pinned to core 1', 'p1']], value: 'p1' },
        { id: 'wl', label: 'Work done by loop()', min: 5, max: 100, step: 5, value: 35, unit: '%' },
        { id: 'wm', label: 'Work done by your task', min: 5, max: 100, step: 5, value: 40, unit: '%' },
        { id: 'ww', label: 'Radio and system tasks', min: 0, max: 60, step: 5, value: 20, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['c0', 'Core 0'], ['c1', 'Core 1'], ['say', 'Verdict']]);
      function place() {
        const v = ctl.values, ch = E.chip(v.chip) || E.chip('esp32'), n = ch.cores >= 2 ? 2 : 1, notes = [];
        const cores = [[], []];
        const add = (k, name, load, hue) => cores[k].push({ name, load, hue });
        add(0, 'Wi-Fi, Bluetooth, system', v.ww, 8);
        const lc = n === 2 ? v.loopCore : 0;
        add(lc, 'loop()', v.wl, 212);
        if (v.my !== 'none') {
          let k = 0;
          if (v.my === 'p1') { if (n === 2) k = 1; else notes.push('core 1 does not exist on this chip: the call fails'); }
          else if (v.my === 'free') {
            const sum = a => a.reduce((s, t) => s + t.load, 0);
            k = n === 2 && sum(cores[1]) < sum(cores[0]) ? 1 : 0;
          }
          add(k, 'your task' + (v.my === 'free' ? ' (unpinned)' : ''), v.wm, 150);
        }
        const tot = cores.map(a => a.reduce((s, t) => s + t.load, 0));
        return { ch, n, cores, tot, notes };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), M = 10, P = place();
        const stacked = st.W < 520 || P.n === 1;
        const pw = P.n === 1 ? st.W - 2 * M : stacked ? st.W - 2 * M : (st.W - 3 * M) / 2;
        const ph = P.n === 2 && stacked ? (st.H - 3 * M - 34) / 2 : st.H - 2 * M - 34;
        kit.label(c, shortChip(P.ch) + ': ' + (P.n === 2 ? 'two cores' : 'one core') + ' · ' + P.ch.mhz + ' MHz', M, 12, { size: 12.5, weight: 650 });
        for (let k = 0; k < P.n; k++) {
          const x = stacked ? M : M + k * (pw + M), y = 28 + (stacked ? k * (ph + M) : 0);
          rrPath(c, x, y, pw, ph, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border; c.lineWidth = 1.2; c.stroke();
          const title = P.n === 1 ? 'The only core (core 0): everything shares it' : k === 0 ? 'Core 0 · protocol core' : 'Core 1 · application core';
          kit.label(c, title, x + 8, y + 14, { size: 11.5, weight: 650, color: C.text2 });
          const list = P.cores[k], rows = Math.max(list.length, 1), rh = clamp((ph - 62) / Math.max(rows, 3), 20, 30), bw = pw - 16;
          list.forEach((t, i) => {
            const by = y + 30 + i * rh;
            c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(x + 8, by, bw, rh - 6);
            c.fillStyle = kit.hue(t.hue, 0.9); c.fillRect(x + 8, by, bw * clamp(t.load / 100, 0, 1), rh - 6);
            kit.label(c, t.name, x + 12, by + (rh - 6) / 2, { size: 10.5, weight: 600, color: C.text });
            kit.label(c, Math.round(t.load) + ' %', x + 8 + bw - 4, by + (rh - 6) / 2, { size: 10.5, align: 'right', color: C.text });
          });
          if (!list.length) kit.label(c, 'nothing runs here, only the idle task', x + 12, y + 40, { size: 10.5, color: C.faint });
          const ty = y + ph - 24, tot = P.tot[k];
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(x + 8, ty, bw, 12);
          c.fillStyle = tot > 100 ? C.bad : tot > 85 ? C.warn : C.ok; c.fillRect(x + 8, ty, bw * clamp(tot / 100, 0, 1), 12);
          kit.label(c, 'total ' + Math.round(tot) + ' %' + (tot > 100 ? ' · overloaded' : tot > 85 ? ' · tight' : ' · idle ' + Math.round(100 - tot) + ' %'), x + 8, ty - 8, { size: 10.5, color: tot > 100 ? C.bad : C.muted, weight: tot > 100 ? 650 : 400 });
        }
        if (P.notes.length) kit.label(c, P.notes[0], M, st.H - 10, { size: 11, color: C.bad, weight: 600 });
        ro.set('c0', Math.round(P.tot[0]) + ' % busy');
        ro.set('c1', P.n === 2 ? Math.round(P.tot[1]) + ' % busy' : 'this chip has one core');
        const over = P.tot.slice(0, P.n).some(t => t > 100);
        ro.set('say', P.notes.length ? P.notes[0] : over ? 'a core is overloaded' : P.tot.slice(0, P.n).some(t => t > 85) ? 'fits, with little room' : 'fits comfortably');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fr-queue */
  Hyper.sim('fr-queue', {
    title: 'A queue between two tasks',
    blurb: `A **producer** task puts an item in the queue every so often; a **consumer** task takes the oldest one out and needs some time to deal with it. The boxes in the middle are the slots of the queue; the graph underneath is how full it has been over the last eight seconds.

**Try this**
- With the starting values the producer is faster than the consumer, so the queue fills and then items are **dropped**. Make the consumer faster than the producer and the queue stays nearly empty and the consumer spends its time **blocked**, waiting, at no cost.
- Change *When the queue is full* to **block the producer**: nothing is lost, but the producer is held back to the consumer's pace.
- Choose **overwrite the oldest**: the queue always holds the newest items.
- **Pause the consumer** for a few seconds, then resume it: the queue absorbs a burst, up to its length.
- Make the queue longer: it delays the moment of dropping but cannot cure a consumer that is slower for good.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'pp', label: 'Producer sends every', min: 20, max: 1000, step: 10, value: 200, unit: 'ms' },
        { id: 'cp', label: 'Consumer needs for each item', min: 20, max: 1000, step: 10, value: 500, unit: 'ms' },
        { id: 'qn', label: 'Queue length', min: 1, max: 12, step: 1, value: 5, unit: 'items' },
        { id: 'pol', type: 'select', label: 'When the queue is full', options: [['drop the new item (timeout 0)', 'drop'], ['block the producer', 'block'], ['overwrite the oldest', 'over']], value: 'drop' },
        { type: 'buttons', items: [{ id: 'pause', label: 'Pause / resume the consumer', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id) => {
        if (id === 'pause') paused = !paused;
        if (id === 'reset') reset();
        if (id === 'qn') while (q.length > ctl.values.qn) { q.pop(); S.lost++; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['fill', 'In the queue'], ['flow', 'Sent · taken'], ['lost', 'Lost'], ['wait', 'Last item waited']]);
      let q, S, paused, t, acc, prodNext, blocked, cons, consEnd, hist, lastLost, lastHist;
      function reset() {
        q = []; S = { sent: 0, got: 0, lost: 0, wait: 0, id: 0 }; paused = false; t = 0; acc = 0; prodNext = 0.1; blocked = false; cons = null; consEnd = 0; hist = []; lastLost = -9; lastHist = -1;
      }
      reset();
      function tick() {
        const v = ctl.values, qn = Math.max(1, Math.round(v.qn));
        // the consumer finishes its item, then takes the next if there is one
        if (cons && t >= consEnd) { S.got++; cons = null; }
        if (!cons && !paused && q.length) { cons = q.shift(); consEnd = t + v.cp / 1000; S.wait = t - cons.born; }
        // the producer
        if (blocked) {
          if (q.length < qn) { q.push({ id: S.id++, born: t }); S.sent++; blocked = false; prodNext = t + v.pp / 1000; }
        } else if (t >= prodNext) {
          if (q.length < qn) { q.push({ id: S.id++, born: t }); S.sent++; prodNext = t + v.pp / 1000; }
          else if (v.pol === 'drop') { S.lost++; lastLost = t; S.id++; prodNext = t + v.pp / 1000; }
          else if (v.pol === 'over') { q.shift(); S.lost++; lastLost = t; q.push({ id: S.id++, born: t }); S.sent++; prodNext = t + v.pp / 1000; }
          else blocked = true;
        }
        if (t - lastHist >= 0.05) { hist.push([t, q.length]); lastHist = t; while (hist.length && hist[0][0] < t - 8) hist.shift(); }
      }
      const loop = kit.loop(dt => {
        acc += dt;
        let n = 0;
        while (acc >= 0.005 && n++ < 20) { acc -= 0.005; t += 0.005; tick(); }
        const c = st.begin(), C = kit.colors(), v = ctl.values, qn = Math.max(1, Math.round(v.qn)), W = st.W, M = 10;
        // producer, queue, consumer
        const bw = clamp(W * 0.19, 70, 100), bh = 64, by = 18, qx = M + bw + 16, qw = W - 2 * M - 2 * bw - 32;
        const sending = t - (prodNext - v.pp / 1000) < 0.12 && !blocked;
        rrPath(c, M, by, bw, bh, 8); c.fillStyle = blocked ? 'rgba(229,72,77,.18)' : C.surface; c.fill(); c.strokeStyle = blocked ? C.bad : C.border; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'Producer', M + bw / 2, by + 20, { size: 12, align: 'center', weight: 650 });
        kit.label(c, blocked ? 'queue full' : sending ? 'sending' : 'sleeping', M + bw / 2, by + 42, { size: 10.5, align: 'center', color: blocked ? C.bad : sending ? C.accent : C.muted });
        const cx = W - M - bw, busy = !!cons;
        rrPath(c, cx, by, bw, bh, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = busy ? C.accent : C.border; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'Consumer', cx + bw / 2, by + 20, { size: 12, align: 'center', weight: 650 });
        kit.label(c, busy ? 'working on #' + cons.id : paused ? 'paused' : 'blocked', cx + bw / 2, by + 42, { size: 10.5, align: 'center', color: busy ? C.accent : C.muted });
        if (busy) { const f = clamp(1 - (consEnd - t) / (v.cp / 1000), 0, 1); c.fillStyle = kit.hue(212, 0.8); c.fillRect(cx + 8, by + bh - 12, (bw - 16) * f, 5); }
        // arrows
        c.strokeStyle = C.muted; c.fillStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(M + bw, by + bh / 2); c.lineTo(qx - 3, by + bh / 2); c.stroke();
        c.beginPath(); c.moveTo(qx + qw + 4, by + bh / 2); c.lineTo(cx - 3, by + bh / 2); c.stroke();
        // the slots: the oldest item waits at the consumer's end, new ones join the line behind it
        const gap = 3, sw = Math.max(8, (qw - gap * (qn - 1)) / qn), sh = 40, sy = by + (bh - sh) / 2;
        for (let i = 0; i < qn; i++) {
          const x = qx + (qn - 1 - i) * (sw + gap), it = q[i];
          rrPath(c, x, sy, sw, sh, 4);
          if (it) { c.fillStyle = kit.hue((it.id * 47) % 360, 0.85); c.fill(); if (t - it.born < 0.15) { c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke(); } }
          else { c.strokeStyle = C.border2; c.lineWidth = 1; c.setLineDash([3, 3]); c.stroke(); c.setLineDash([]); }
          if (it && sw >= 20) kit.label(c, String(it.id), x + sw / 2, sy + sh / 2, { size: 10.5, align: 'center', weight: 650, color: C.dark ? '#10142a' : '#ffffff' });
        }
        kit.label(c, 'join here', qx, sy + sh + 11, { size: 9.5, color: C.faint });
        kit.label(c, 'leave here', qx + qw, sy + sh + 11, { size: 9.5, color: C.faint, align: 'right' });
        if (t - lastLost < 0.6) kit.label(c, v.pol === 'over' ? '↺ oldest overwritten' : '✕ item dropped', qx + qw / 2, by - 6, { size: 11, color: C.bad, align: 'center', weight: 650 });
        // the graph of the fill
        const gx = 58, gy = by + bh + 44, gw = W - gx - M, gh = Math.max(50, st.H - gy - 26);
        kit.label(c, 'items waiting, last 8 s', gx, gy - 12, { size: 10.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(gx, gy, gw, gh);
        const Y = n => gy + gh - clamp(n / qn, 0, 1.15) * gh * 0.87;
        c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(gx, Y(qn)); c.lineTo(gx + gw, Y(qn)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'full (' + qn + ')', gx - 4, Y(qn), { size: 9.5, align: 'right', color: C.warn });
        kit.label(c, '0', gx - 4, Y(0), { size: 9.5, align: 'right', color: C.faint });
        if (hist.length > 1) {
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
          let prevY = 0;
          hist.forEach(([ht, n], i) => {
            const x = gx + (ht - (t - 8)) / 8 * gw, y = Y(n);
            if (i === 0) c.moveTo(x, y); else { c.lineTo(x, prevY); c.lineTo(x, y); }
            prevY = y;
          });
          c.stroke();
        }
        kit.label(c, '8 s ago', gx, gy + gh + 11, { size: 9.5, color: C.faint });
        kit.label(c, 'now', gx + gw, gy + gh + 11, { size: 9.5, color: C.faint, align: 'right' });
        ro.set('fill', q.length + ' of ' + qn + (blocked ? ' (producer waiting)' : ''));
        ro.set('flow', S.sent + ' · ' + S.got);
        ro.set('lost', S.lost ? S.lost + (v.pol === 'over' ? ' overwritten' : ' dropped') : v.pol === 'block' ? 'none: the producer waits' : 'none');
        ro.set('wait', S.got || cons ? Math.round(S.wait * 1000) + ' ms in the queue' : 'no item taken yet');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ fr-race */
  Hyper.sim('fr-race', {
    title: 'Two tasks, one counter',
    blurb: `Each task adds 1 to a shared counter several times. An addition is **three instructions**: *load* the counter into a register, *add* 1, *store* it back. The scheduler may switch tasks between any two instructions. The coloured strip at the bottom is the order in which the instructions really ran; a **red store** overwrote a value that the other task had changed in the meantime: an update is lost.

**Try this**
- With *switch at random points* and no protection, press **New random run** a few times: the total changes from run to run and is nearly always short. Lower the chance of a switch, or the number of additions, and it sometimes comes out right: that is why such a bug hides in testing.
- Choose *switch after every instruction*: the worst case, in which half of the updates are lost.
- *Not until a task is done* never fails: with no switching in the middle there is no race. This is why such bugs hide in testing.
- Tick **Protect with a mutex** and repeat any of them: the total is always right. Watch the waiting steps, when one task waits for the lock.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 540 });
      let seed = 3, log = [], pos = 0, acc = 0, playing = true;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Additions per task', min: 3, max: 30, step: 1, value: 8 },
        { id: 'mode', type: 'select', label: 'The scheduler switches', options: [['at random points', 'random'], ['after every instruction', 'alternate'], ['not until a task is done', 'none']], value: 'random' },
        { id: 'sw', label: 'Chance of a switch at each step', min: 5, max: 80, step: 5, value: 35, unit: '%' },
        { id: 'protect', type: 'check', label: 'Protect with a mutex', value: false },
        { id: 'speed', label: 'Speed', min: 2, max: 40, step: 1, value: 8, unit: 'steps/s' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'again', label: 'Replay' }, { id: 'new', label: 'New random run' }, { id: 'end', label: 'Skip to the end' }] }
      ], (id) => {
        if (id === 'play') { playing = !playing; if (pos >= log.length) { pos = 0; playing = true; } }
        else if (id === 'again') { pos = 0; playing = true; }
        else if (id === 'new') { seed += 7; build(); pos = 0; playing = true; }
        else if (id === 'end') { pos = log.length; }
        else if (id !== 'speed') { build(); pos = 0; playing = true; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['now', 'Counter now'], ['exp', 'Expected at the end'], ['got', 'Counter at the end'], ['lost', 'Updates lost']]);
      function build() {
        const v = ctl.values, N = Math.round(v.N), rnd = lcg(seed), p = v.sw / 100;
        const prog = v.protect ? ['take', 'load', 'add', 'store', 'give'] : ['load', 'add', 'store'];
        const T = [{ pc: 0, n: 0, reg: 0, loaded: 0 }, { pc: 0, n: 0, reg: 0, loaded: 0 }];
        let mem = 0, owner = -1, cur = 0, guard = 0;
        log = [];
        const fin = k => T[k].n >= N;
        while (!(fin(0) && fin(1)) && guard++ < 4000) {
          if (fin(cur)) cur = 1 - cur;
          const t = T[cur], op = prog[t.pc];
          if (op === 'take' && owner >= 0 && owner !== cur) { log.push({ k: cur, op: 'wait', mem, reg: [T[0].reg, T[1].reg], owner, clobber: false }); cur = 1 - cur; continue; }
          let clobber = false;
          if (op === 'take') owner = cur;
          else if (op === 'load') { t.reg = mem; t.loaded = mem; }
          else if (op === 'add') t.reg = t.reg + 1;
          else if (op === 'store') { clobber = mem !== t.loaded; mem = t.reg; }
          else if (op === 'give') owner = -1;
          log.push({ k: cur, op, mem, reg: [T[0].reg, T[1].reg], owner, clobber });
          t.pc++; if (t.pc >= prog.length) { t.pc = 0; t.n++; }
          if (v.mode === 'alternate') cur = 1 - cur;
          else if (v.mode === 'random' && rnd() < p) cur = 1 - cur;
        }
        log.final = mem; log.expected = 2 * N; log.prog = prog;
      }
      build();
      const COL = { take: 280, load: 212, add: 46, store: 150, give: 280, wait: 0 };
      const loop = kit.loop(dt => {
        if (playing) { acc += dt * ctl.values.speed; while (acc >= 1) { acc -= 1; if (pos < log.length) pos++; } if (pos >= log.length) playing = false; }
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, M = 10, P = log.prog;
        const cur = pos > 0 ? log[pos - 1] : null, done = pos >= log.length;
        const mem = cur ? cur.mem : 0, regs = cur ? cur.reg : [0, 0];
        // the shared counter, and the lock
        const mw = clamp(W * 0.3, 110, 170);
        rrPath(c, W / 2 - mw / 2, 8, mw, 56, 10); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        kit.label(c, 'shared counter', W / 2, 24, { size: 10.5, align: 'center', color: C.muted });
        kit.label(c, String(mem), W / 2, 46, { size: 22, align: 'center', weight: 700 });
        if (v.protect) kit.label(c, 'mutex: ' + (cur && cur.owner >= 0 ? 'held by ' + 'AB'[cur.owner] : 'free'), W / 2, 78, { size: 10.5, align: 'center', color: cur && cur.owner >= 0 ? C.warn : C.ok, weight: 600 });
        // the two tasks
        const pwid = (W - 3 * M) / 2, ph = 20 + P.length * 19 + 12, py = 92;
        for (let k = 0; k < 2; k++) {
          const x = M + k * (pwid + M), y = py;
          const mine = cur && cur.k === k;
          rrPath(c, x, y, pwid, ph, 8); c.fillStyle = C.surface; c.fill(); c.strokeStyle = mine ? kit.hue(COL[cur.op], 0.95) : C.border; c.lineWidth = mine ? 2 : 1; c.stroke();
          kit.label(c, 'Task ' + 'AB'[k], x + 8, y + 12, { size: 11.5, weight: 650 });
          kit.label(c, 'register: ' + regs[k], x + pwid - 8, y + 12, { size: 10.5, align: 'right', color: C.text2 });
          P.forEach((op, i) => {
            const ry = y + 22 + i * 19, on = mine && cur.op === op;
            c.fillStyle = on ? kit.hue(COL[op], 0.9) : kit.hue(COL[op], 0.2); rrPath(c, x + 8, ry, pwid - 16, 16, 4); c.fill();
            const txt = { take: 'take the mutex', load: 'load: reg = counter', add: 'add: reg = reg + 1', store: 'store: counter = reg', give: 'give the mutex' }[op];
            kit.label(c, txt, x + 14, ry + 8, { size: 10.5, weight: on ? 650 : 400, color: on ? (C.dark ? '#10142a' : '#ffffff') : C.text2 });
          });
          if (mine && cur.op === 'store' && cur.clobber) kit.label(c, 'overwrote a newer value!', x + pwid - 8, y + ph - 8, { size: 10, align: 'right', color: C.bad, weight: 650 });
          if (cur && cur.op === 'wait' && cur.k === k) kit.label(c, 'waiting for the mutex', x + pwid - 8, y + ph - 8, { size: 10, align: 'right', color: C.warn, weight: 650 });
        }
        // the strip of what ran, in order
        const sy = py + ph + 20, sx = M + 22, sw = W - sx - M, n = Math.max(log.length, 1), cw = sw / n;
        kit.label(c, 'the order in which the instructions ran', M, sy - 8, { size: 10.5, color: C.muted });
        for (let k = 0; k < 2; k++) {
          kit.label(c, 'AB'[k], M + 8, sy + 8 + k * 20, { size: 11, weight: 650, align: 'center' });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(sx, sy + k * 20, sw, 16);
        }
        for (let i = 0; i < Math.min(pos, log.length); i++) {
          const e = log[i];
          c.fillStyle = e.op === 'wait' ? (C.dark ? 'rgba(255,255,255,.25)' : 'rgba(0,0,0,.22)') : e.clobber ? C.bad : kit.hue(COL[e.op], 0.9);
          c.fillRect(sx + i * cw, sy + e.k * 20, Math.max(1, cw - (cw > 4 ? 1 : 0)), 16);
        }
        const ly = sy + 46;
        [['load', 'load'], ['add', 'add'], ['store', 'store']].forEach(([k, name], i) => { c.fillStyle = kit.hue(COL[k], 0.9); c.fillRect(sx + i * 70, ly, 10, 10); kit.label(c, name, sx + i * 70 + 14, ly + 5, { size: 10, color: C.muted }); });
        c.fillStyle = C.bad; c.fillRect(sx + 210, ly, 10, 10); kit.label(c, 'lost update', sx + 224, ly + 5, { size: 10, color: C.muted });
        const lost = log.expected - log.final;
        ro.set('now', String(mem));
        ro.set('exp', String(log.expected));
        ro.set('got', done ? String(log.final) : 'still running');
        ro.set('lost', done ? (lost > 0 ? lost + ' lost' : 'none') : 'still running');
        if (!playing) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ fr-inversion */
  const INV_NAMES = ['H', 'M', 'L'];
  const INV_HUES = [8, 150, 212];
  function invertSim(p) {
    // phases: { run: ms, holds } · { take } · { give }; the low task already holds the lock at time 0
    const phases = [
      [{ run: 1 }, { take: 1 }, { run: 2 }, { give: 1 }],
      [{ run: p.wM }],
      [{ take: 1 }, { run: p.wL }, { give: 1 }, { run: 2 }]
    ];
    const wake = [p.tH, p.tM, 0], base = [3, 2, 1];
    const T = phases.map((ph, i) => ({ ph: ph.map(x => Object.assign({}, x)), i: 0, blocked: false, done: -1, wake: wake[i] }));
    const state = [[], [], []], owner = [], inv = [], blk = [];
    let own = -1, t = 0;
    const settle = (k, tt) => {
      const x = T[k];
      for (let g = 0; g < 8 && x.i < x.ph.length; g++) {
        const ph = x.ph[x.i];
        if (ph.take) { if (own < 0 || own === k) { own = k; x.blocked = false; x.i++; } else { x.blocked = true; return; } }
        else if (ph.give) { own = -1; x.i++; }
        else return;
      }
      if (x.i >= x.ph.length && x.done < 0) x.done = tt;
    };
    for (; t < 400; t++) {
      for (let k = 0; k < 3; k++) if (t >= T[k].wake && T[k].done < 0) settle(k, t);
      if (T.every(x => x.done >= 0)) break;
      let eff = base.slice();
      if (p.inherit && own >= 0) { const hb = T.some((x, k) => k !== own && x.blocked && t >= x.wake); if (hb) { for (let k = 0; k < 3; k++) if (k !== own && T[k].blocked) eff[own] = Math.max(eff[own], base[k]); } }
      let pick = -1;
      for (let k = 0; k < 3; k++) if (t >= T[k].wake && T[k].done < 0 && !T[k].blocked && (pick < 0 || eff[k] > eff[pick])) pick = k;
      for (let k = 0; k < 3; k++) state[k][t] = pick === k ? 2 : t >= T[k].wake && T[k].done < 0 ? (T[k].blocked ? 3 : 1) : 0;
      owner[t] = own; blk[t] = T[0].blocked && t >= T[0].wake && T[0].done < 0;
      inv[t] = pick === 1 && blk[t];
      if (pick >= 0) { const ph = T[pick].ph[T[pick].i]; ph.run--; if (ph.run <= 0) { T[pick].i++; settle(pick, t + 1); } }
      // a task whose lock was just released may now be able to go on
      for (let k = 0; k < 3; k++) if (T[k].blocked && own < 0) settle(k, t + 1);
    }
    return { state, owner, inv, blk, done: T.map(x => x.done), len: t };
  }
  Hyper.sim('fr-inversion', {
    title: 'Priority inversion',
    blurb: `Three tasks: **H** (high priority), **M** (medium) and **L** (low). L already holds a lock when H wakes and needs the same lock. M does not need the lock at all. **Solid** bars are running, **pale** ones are ready but waiting for the core, **hatched red** ones are H waiting for the lock. The bottom row shows who holds the lock.

**Try this**
- With the **binary semaphore**, L is stopped by M and cannot finish with the lock, so **H waits for M**, a task less important than itself. The red band is the inversion. Make M's work longer: H's wait grows with it, though H never needs M.
- Switch to the **mutex**: while H waits, L runs at H's priority, finishes with the lock quickly and H goes on. M waits.
- Move **H wakes at** after L has released the lock: no waiting, no inversion. The problem needs all three at once.
- Shorten the **deadline** until the semaphore misses it and the mutex still meets it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'lock', type: 'select', label: 'The lock is', options: [['a binary semaphore (no inheritance)', 'binary'], ['a mutex (priority inheritance)', 'mutex']], value: params.lock === 'mutex' ? 'mutex' : 'binary' },
        { id: 'tH', label: 'H wakes at', min: 1, max: 12, step: 1, value: 3, unit: 'ms' },
        { id: 'tM', label: 'M wakes at', min: 1, max: 15, step: 1, value: 4, unit: 'ms' },
        { id: 'wM', label: 'M works for', min: 4, max: 60, step: 1, value: 25, unit: 'ms' },
        { id: 'wL', label: 'L holds the lock for', min: 4, max: 20, step: 1, value: 10, unit: 'ms' },
        { id: 'dl', label: 'H deadline', min: 5, max: 60, step: 1, value: 20, unit: 'ms' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['done', 'H finishes at'], ['wait', 'H waits for the lock'], ['inv', 'M ran while H waited'], ['dl', 'Deadline']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const R = invertSim({ tH: Math.round(v.tH), tM: Math.round(v.tM), wM: Math.round(v.wM), wL: Math.round(v.wL), inherit: v.lock === 'mutex' });
        const win = Math.max(30, Math.ceil((R.len + 4) / 10) * 10);
        const lm = 78, rm = 12, top = 12, axisH = 34, pw = Math.max(40, st.W - lm - rm), rh = (st.H - top - axisH - 20) / 4, bh = Math.min(30, rh * 0.62);
        const X = t => lm + t / win * pw;
        const names = ['H · high', 'M · medium', 'L · low', 'lock held by'];
        names.forEach((nm, i) => {
          const y = top + i * rh, by = y + (rh - bh) / 2;
          kit.label(c, nm, lm - 6, y + rh / 2, { size: 10.5, align: 'right', weight: 600, color: i < 3 ? C.text : C.muted });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(lm, y + 2, pw, rh - 4);
          if (i < 3) {
            for (const [a, b] of segsOf(R.state[i], 1)) { c.fillStyle = kit.hue(INV_HUES[i], 0.28); c.fillRect(X(a), by + bh * 0.3, Math.max(0.6, X(b) - X(a)), bh * 0.4); }
            for (const [a, b] of segsOf(R.state[i], 3)) { c.fillStyle = C.dark ? 'rgba(229,72,77,.32)' : 'rgba(200,40,50,.22)'; c.fillRect(X(a), by, X(b) - X(a), bh); c.strokeStyle = C.bad; c.lineWidth = 1; c.strokeRect(X(a) + 0.5, by + 0.5, Math.max(0, X(b) - X(a) - 1), bh - 1); }
            for (const [a, b] of segsOf(R.state[i], 2)) { c.fillStyle = kit.hue(INV_HUES[i], 0.95); c.fillRect(X(a), by, Math.max(0.8, X(b) - X(a)), bh); }
          } else {
            for (let k = 0; k < 3; k++) for (const [a, b] of segsOf(R.owner.map(o => (o === k ? 1 : 0)), 1)) {
              c.fillStyle = kit.hue(INV_HUES[k], 0.8); c.fillRect(X(a), by, X(b) - X(a), bh);
              if (X(b) - X(a) > 14) kit.label(c, INV_NAMES[k], (X(a) + X(b)) / 2, by + bh / 2, { size: 11, align: 'center', weight: 700, color: C.dark ? '#10142a' : '#ffffff' });
            }
          }
        });
        // the inversion, as a band across the picture
        for (const [a, b] of segsOf(R.inv.map(x => (x ? 1 : 0)), 1)) {
          c.fillStyle = C.dark ? 'rgba(229,72,77,.14)' : 'rgba(200,40,50,.10)'; c.fillRect(X(a), top, X(b) - X(a), 4 * rh);
          kit.label(c, 'inversion', (X(a) + X(b)) / 2, top + 4 * rh + 4, { size: 10, align: 'center', color: C.bad, weight: 650 });
        }
        // the deadline and the wake-up marks
        const dx = X(Math.min(win, v.dl));
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(dx, top - 2); c.lineTo(dx, top + 4 * rh); c.stroke(); c.setLineDash([]);
        const dlLeft = dx > st.W - 70;
        kit.label(c, 'deadline', dlLeft ? dx - 3 : dx + 3, top + 4 * rh - 6, { size: 9.5, color: C.warn, align: dlLeft ? 'right' : 'left' });
        const marks = [[0, Math.round(v.tH)], [1, Math.round(v.tM)]];
        for (const [i, t] of marks) { const x = X(t), y = top + i * rh; c.fillStyle = kit.hue(INV_HUES[i]); c.beginPath(); c.moveTo(x - 3, y + 3); c.lineTo(x + 3, y + 3); c.lineTo(x, y + 9); c.closePath(); c.fill(); }
        // the axis
        const ay = top + 4 * rh + 18, step = niceMs(win, pw, 40);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(lm, ay); c.lineTo(lm + pw, ay); c.stroke();
        for (let t = 0; t <= win; t += step) { c.beginPath(); c.moveTo(X(t), ay); c.lineTo(X(t), ay + 4); c.stroke(); kit.label(c, String(t), X(t), ay + 14, { size: 10, align: t === 0 ? 'left' : t + step > win ? 'right' : 'center', color: C.muted }); }
        kit.label(c, 'ms', lm + pw, ay + 26, { size: 10, align: 'right', color: C.muted });
        // the numbers
        const hDone = R.done[0], waitN = R.blk.filter(Boolean).length, invN = R.inv.filter(Boolean).length;
        ro.set('done', hDone >= 0 ? hDone + ' ms' : 'not within the window');
        ro.set('wait', waitN + ' ms');
        ro.set('inv', invN ? invN + ' ms: a lower task held H back' : 'none: no inversion');
        ro.set('dl', hDone < 0 ? 'missed' : hDone <= v.dl ? 'met, ' + Math.round(v.dl - hDone) + ' ms to spare' : 'MISSED by ' + Math.round(hDone - v.dl) + ' ms');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fr-isr */
  const ISR_METHODS = { isr: 'isr', semaphore: 'sem', sem: 'sem', notify: 'notify', queue: 'queue' };
  Hyper.sim('fr-isr', {
    title: 'An event, a handler and a task',
    blurb: `Events arrive at random, as button edges or pulses would, about as often as the slider says. Below, four rows show the **events**, the **interrupt handler**, the **worker task** that does the real work, and a **control task** that should run for 1 ms every 10 ms. The handler outranks every task; the control task outranks the worker.

**Try this**
- Start with **all the work in the handler**. Each event takes the whole core for its work time: the control task is held up as long as the work lasts, and an event that arrives meanwhile may be lost.
- Choose **a binary semaphore**: the handler is a tiny blip, the work moves to the task, and the control task is no longer delayed. Raise the rate until events arrive while the task is busy: two events become one wake-up.
- Choose **a notification**: it counts, so nothing is lost; the backlog grows when events come faster than the task can work, and drains afterwards.
- Choose **a queue**: nothing is lost until its length is used up.
- Push the work and the rate until their product passes 1 000 ms a second: no design can keep up, but only the first one stops the control task.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'The event is handled', options: [['all in the interrupt handler', 'isr'], ['a handler gives a binary semaphore', 'sem'], ['a handler notifies the task (counts)', 'notify'], ['a handler sends to a queue', 'queue']], value: ISR_METHODS[params.method] || 'isr' },
        { id: 'rate', label: 'Events per second', min: 2, max: 80, step: 1, value: 20 },
        { id: 'work', label: 'Work for each event', min: 1, max: 40, step: 1, value: 12, unit: 'ms' },
        { id: 'qn', label: 'Queue length', min: 1, max: 10, step: 1, value: 4, unit: 'items' },
        { type: 'buttons', items: [{ id: 'again', label: 'Start again', primary: true }] }
      ], (id) => { if (id === 'again') reset(); loop.start(); });
      const ro = kit.readout(box.side, [['done', 'Events handled'], ['lost', 'Lost or merged'], ['ctl', 'Control task worst delay'], ['isr', 'Time in the handler'], ['wait', 'Waiting for the worker']]);
      const WIN = 1.6, DT = 0.0005;
      let s, rnd;
      function reset() {
        rnd = lcg(11);
        s = { t: 0, next: 0.05, isrRem: 0, isrPend: false, back: 0, sem: false, wRem: 0, wBusy: false, cRel: 0, cRem: 0, cWait: -1, worst: 0, handled: 0, lost: 0, isrTime: 0, ev: [], seg: { isr: [], work: [], ctl: [], blip: [] } };
      }
      reset();
      const mark = (row, t0, t1) => { const a = s.seg[row], l = a[a.length - 1]; if (l && t0 - l[1] < DT * 1.5) l[1] = t1; else a.push([t0, t1]); };
      function step() {
        const v = ctl.values, t = s.t, W = v.work / 1000, m = v.method, qn = Math.round(v.qn);
        // an event arrives
        if (t >= s.next) {
          s.ev.push(t);
          s.next = t + -Math.log(Math.max(1e-6, rnd())) / v.rate;
          if (m === 'isr') { if (s.isrRem > 0) { if (!s.isrPend) s.isrPend = true; else s.lost++; } else s.isrRem = W; }
          else {
            mark('blip', t, t + 0.0012);
            if (m === 'sem') { if (s.sem) s.lost++; else s.sem = true; }
            else if (m === 'notify') s.back++;
            else if (s.back < qn) s.back++; else s.lost++;
          }
        }
        // the control task is released every 10 ms
        if (t >= s.cRel + 0.01 - 1e-9) { s.cRel = Math.round((s.cRel + 0.01) * 1000) / 1000; if (s.cRem <= 0) { s.cRem = 0.001; s.cWait = s.cRel; } }
        // who gets the core
        if (s.isrRem > 0) {
          mark('isr', t, t + DT); s.isrRem -= DT; s.isrTime += DT;
          if (s.isrRem <= 1e-9) { s.handled++; s.isrRem = 0; if (s.isrPend) { s.isrPend = false; s.isrRem = W; } }
        } else if (s.cRem > 0) {
          if (s.cWait >= 0) { s.worst = Math.max(s.worst, t - s.cWait); s.cWait = -1; }
          mark('ctl', t, t + DT); s.cRem -= DT;
        } else {
          if (!s.wBusy) {
            if (m === 'sem' && s.sem) { s.sem = false; s.wBusy = true; s.wRem = W; }
            else if ((m === 'notify' || m === 'queue') && s.back > 0) { s.back--; s.wBusy = true; s.wRem = W; }
          }
          if (s.wBusy) { mark('work', t, t + DT); s.wRem -= DT; if (s.wRem <= 1e-9) { s.wBusy = false; s.handled++; } }
        }
        s.t += DT;
      }
      const loop = kit.loop(dt => {
        let n = Math.min(200, Math.round(dt / DT));
        while (n-- > 0) step();
        const c = st.begin(), C = kit.colors(), v = ctl.values, t = s.t, m = v.method;
        for (const k of Object.keys(s.seg)) while (s.seg[k].length && s.seg[k][0][1] < t - WIN) s.seg[k].shift();
        while (s.ev.length && s.ev[0] < t - WIN) s.ev.shift();
        const lm = 92, rm = 12, top = 10, pw = Math.max(40, st.W - lm - rm), rh = (st.H - top - 44) / 4, bh = Math.min(26, rh * 0.62);
        const X = tt => lm + (tt - (t - WIN)) / WIN * pw;
        const rows = [['Events', null], ['Handler', 8], ['Worker task', 212], ['Control task', 150]];
        rows.forEach(([nm, hue], i) => {
          const y = top + i * rh, by = y + (rh - bh) / 2;
          kit.label(c, nm, lm - 8, y + rh / 2, { size: 11, align: 'right', weight: 600 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(lm, y + 2, pw, rh - 4);
          if (i === 0) { c.strokeStyle = C.accent; c.lineWidth = 1.5; for (const e of s.ev) { const x = X(e); c.beginPath(); c.moveTo(x, y + 6); c.lineTo(x, y + rh - 6); c.stroke(); } }
          else {
            const rowSegs = i === 1 ? s.seg.isr.concat(s.seg.blip) : i === 2 ? s.seg.work : s.seg.ctl;
            for (const [a, b] of rowSegs) { c.fillStyle = kit.hue(hue, 0.95); const x0 = Math.max(lm, X(a)); c.fillRect(x0, by, Math.max(1.5, X(b) - x0), bh); }
          }
        });
        kit.label(c, '1.6 s ago', lm, top + 4 * rh + 12, { size: 10, color: C.muted });
        kit.label(c, 'now', lm + pw, top + 4 * rh + 12, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, m === 'isr' ? 'the handler works: nothing else runs' : 'the handler is a blip; the task does the work', lm, top + 4 * rh + 28, { size: 10, color: C.muted });
        const backlog = m === 'sem' ? (s.sem ? 1 : 0) : m === 'isr' ? (s.isrPend ? 1 : 0) : s.back;
        ro.set('done', String(s.handled));
        ro.set('lost', s.lost ? s.lost + (m === 'queue' ? ' (queue full)' : m === 'sem' ? ' (merged into one wake-up)' : ' (arrived during the handler)') : 'none');
        ro.set('ctl', s.t < 0.02 ? 'starting' : Math.round(s.worst * 1000 * 10) / 10 + ' ms (it needs 1 ms every 10)');
        ro.set('isr', m !== 'isr' ? 'under 1 %: a few microseconds per event' : s.t > 0 ? Math.round(s.isrTime / s.t * 100) + ' % of the core' : '0 %');
        ro.set('wait', m === 'isr' ? (backlog ? '1 event latched' : 'nothing') : backlog + (m === 'sem' ? ' (a semaphore holds at most 1)' : ' event' + (backlog === 1 ? '' : 's')));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ fr-stack */
  Hyper.sim('fr-stack', {
    title: 'A task\'s stack filling up',
    blurb: `The tall bar is the stack of one task, from its base at the top down to its end. It fills **downwards** with: the task function\'s own frame, a **local array** in that function, a **chain of calls** (the recursion), and a **library call** at the deepest point. The dashed line is the **high-water mark**: the deepest the stack has ever been. The sizes of the library calls are typical, not exact: they differ between chips and versions.

**Try this**
- Raise the **call depth**: each call adds a frame. Past the end of the stack the picture turns red: that is an overflow, and it corrupts the memory below.
- Add a **local array** of 2 000 bytes to a 2 048-byte stack: the task overflows before it calls anything.
- Lower the depth again: the **mark stays** where the deepest point was. That is why it tells you about the worst case you have already run. Press **Reset the mark** to start measuring again.
- Choose **TLS / HTTPS** as the library call and see why such tasks need 8 KB or more.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 520 });
      let mark = 0;
      const ctl = kit.controls(box.side, [
        { id: 'size', label: 'Stack size given to the task', min: 1024, max: 8192, step: 256, value: 4096, unit: 'bytes' },
        { id: 'depth', label: 'Call depth (recursion)', min: 0, max: 60, step: 1, value: 4 },
        { id: 'frame', label: 'Stack taken by each call', min: 32, max: 256, step: 8, value: 96, unit: 'bytes' },
        { id: 'buf', label: 'Local array in the task function', min: 0, max: 4000, step: 100, value: 0, unit: 'bytes' },
        { id: 'lib', type: 'select', label: 'Library call at the deepest point', options: [['none', 0], ['formatted printing (about 1 KB)', 1000], ['JSON parsing (about 1.5 KB)', 1500], ['TLS / HTTPS (about 6 KB)', 6000]], value: 0 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the mark', primary: true }] }
      ], (id) => { if (id === 'reset') mark = 0; loop.once(); });
      const ro = kit.readout(box.side, [['used', 'Stack in use now'], ['free', 'Free now'], ['hwm', 'High-water mark: least free ever'], ['say', 'Verdict']]);
      const BASE = 160;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, M = 12;
        const size = Math.round(v.size), depth = Math.round(v.depth), frame = Math.round(v.frame), buf = Math.round(v.buf), lib = Math.round(v.lib);
        const parts = [['task function', BASE, 280], ['local array', buf, 46], [depth + ' call' + (depth === 1 ? '' : 's') + ' of ' + frame + ' B', depth * frame, 212], ['library call', lib, 150]].filter(p => p[1] > 0);
        const used = parts.reduce((a, p) => a + p[1], 0);
        mark = Math.max(mark, used);
        const scaleMax = Math.max(size, used, mark) * 1.04, top = 22, bh = st.H - top - 22, ppb = bh / scaleMax;
        const Y = b => top + b * ppb, bx = M + 4, bw = clamp(W * 0.22, 70, 120);
        kit.label(c, 'base of the stack', bx, top - 10, { size: 10, color: C.faint });
        // the stack region and its end
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(bx, Y(0), bw, size * ppb);
        let y = 0;
        parts.forEach(([nm, b, hue], i) => {
          const h = b * ppb;
          c.fillStyle = kit.hue(hue, 0.85); c.fillRect(bx, Y(y), bw, Math.max(0.5, h));
          if (nm.indexOf('call') >= 0 && frame * ppb > 3) {
            c.strokeStyle = C.dark ? 'rgba(0,0,0,.45)' : 'rgba(255,255,255,.6)'; c.lineWidth = 1;
            for (let k = 1; k < depth; k++) { c.beginPath(); c.moveTo(bx, Y(y + k * frame)); c.lineTo(bx + bw, Y(y + k * frame)); c.stroke(); }
          }
          y += b;
        });
        if (used > size) { c.fillStyle = C.dark ? 'rgba(229,72,77,.55)' : 'rgba(200,40,50,.45)'; c.fillRect(bx, Y(size), bw, (used - size) * ppb); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 4, Y(size)); c.lineTo(bx + bw + 4, Y(size)); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(bx - 4, Y(mark)); c.lineTo(bx + bw + 4, Y(mark)); c.stroke(); c.setLineDash([]);
        // the legend, at the top of the right-hand column
        const lx = bx + bw + 16;
        parts.forEach(([nm, b, hue], i) => {
          const yy = top + 8 + i * 17;
          c.fillStyle = kit.hue(hue, 0.85); c.fillRect(lx, yy - 5, 10, 10);
          kit.label(c, nm + ': ' + b + ' B', lx + 15, yy, { size: 10.5, color: C.text2 });
        });
        // labels for the lines, pushed down so that they never overlap each other or the legend
        const labels = [[Y(size), 'end of the stack: ' + size + ' B', C.text, 600], [Y(mark), 'high-water mark', C.warn, 400]];
        if (used > size) labels.push([Y(size) + Math.min(14, (used - size) * ppb / 2), 'overflow of ' + (used - size) + ' B', C.bad, 650]);
        labels.sort((a, b) => a[0] - b[0]);
        let prev = top + 8 + parts.length * 17 + 4;
        for (const [yt, text, col, wt] of labels) {
          const yl = clamp(Math.max(yt + 3, prev + 14), 0, st.H - 8);
          if (Math.abs(yl - yt) > 5) { c.strokeStyle = col; c.lineWidth = 0.8; c.beginPath(); c.moveTo(bx + bw + 4, yt); c.lineTo(lx - 3, yl - 3); c.stroke(); }
          kit.label(c, text, lx, yl, { size: 10.5, color: col, weight: wt });
          prev = yl;
        }
        const free = size - used, freeAtMark = size - mark;
        ro.set('used', used + ' of ' + size + ' bytes');
        ro.set('free', free >= 0 ? free + ' bytes' : 'none: overflow by ' + (-free) + ' bytes');
        ro.set('hwm', freeAtMark >= 0 ? freeAtMark + ' bytes' : '0: it has overflowed');
        ro.set('say', free < 0 ? 'overflow: memory corrupted' : free < size * 0.25 ? 'tight: less than a quarter free' : 'fine: a margin of ' + Math.round(free / size * 100) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fr-timers */
  const TM_NAMES = ['T1 blink', 'T2 sensor', 'T3 timeout'];
  const TM_HUES = [212, 150, 28];
  Hyper.sim('fr-timers', {
    title: 'Software timers in the timer task',
    blurb: `Three software timers and the one **timer service task** that runs all their callbacks. A small triangle is the moment a timer is **due**; the solid block is when its callback really ran; a red line between them is how **late** it was. The bottom row is the timer task itself: callbacks run there one after another, never at the same time.

**Try this**
- Make the **sensor callback** take 60 ms: the blink timer, which should fire every 100 ms, now runs late whenever it is due while the sensor callback is running. One slow callback delays every timer.
- Switch the tick to **10 ms**, the ESP-IDF default. Set the blink period to 25 ms: the system rounds it **down** to two ticks, 20 ms.
- Move the **one-shot** to a moment when the sensor callback is running, and see it wait.
- Shorten the sensor timer\'s period until its callbacks come faster than they finish: the timer task is then fully busy and everything is late.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'tick', type: 'select', label: 'Tick of the system', options: [['1 ms (Arduino core)', 1], ['10 ms (ESP-IDF default)', 10]], value: 1 },
        { id: 'p1', label: 'T1 blink: period', min: 10, max: 500, step: 5, value: 100, unit: 'ms' },
        { id: 'p2', label: 'T2 sensor: period', min: 10, max: 500, step: 5, value: 250, unit: 'ms' },
        { id: 'd2', label: 'T2 sensor: callback takes', min: 0, max: 100, step: 1, value: 2, unit: 'ms' },
        { id: 'p3', label: 'T3 one-shot fires after', min: 50, max: 900, step: 10, value: 400, unit: 'ms' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['per', 'Periods the system uses'], ['late', 'Worst lateness T1 · T2 · T3'], ['busy', 'Timer task busy']]);
      const WIN = 1000;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, tk = Math.round(v.tick);
        // pdMS_TO_TICKS rounds down: the period the system really uses
        const act = [v.p1, v.p2, v.p3].map(p => Math.max(1, Math.floor(p / tk)) * tk);
        const dur = [1, v.d2, 1];
        const ev = [];
        for (let k = 0; k < 3; k++) {
          if (k === 2) { if (act[2] < WIN) ev.push({ k, due: act[2] }); continue; }
          for (let j = 1; j * act[k] < WIN && j < 200; j++) ev.push({ k, due: j * act[k] });
        }
        ev.sort((a, b) => a.due - b.due || a.k - b.k);
        let free = 0, busy = 0; const late = [0, 0, 0];
        for (const e of ev) { e.start = Math.max(e.due, free); e.end = e.start + dur[e.k]; free = e.end; e.late = e.start - e.due; late[e.k] = Math.max(late[e.k], e.late); busy += dur[e.k]; }
        const lm = 86, rm = 12, top = 10, axisH = 30, pw = Math.max(40, st.W - lm - rm), rh = (st.H - top - axisH - 14) / 4, bh = Math.min(26, rh * 0.62);
        const X = t => lm + clamp(t, 0, WIN) / WIN * pw;
        TM_NAMES.concat(['Tmr Svc task']).forEach((nm, i) => {
          const y = top + i * rh, by = y + (rh - bh) / 2;
          kit.label(c, nm, lm - 6, y + rh / 2, { size: 10.5, align: 'right', weight: 600, color: i < 3 ? C.text : C.muted });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(lm, y + 2, pw, rh - 4);
          for (const e of ev) {
            if (i < 3 && e.k !== i) continue;
            const x = X(e.due);
            if (i < 3) {
              c.fillStyle = kit.hue(TM_HUES[i]); c.beginPath(); c.moveTo(x - 3, y + 3); c.lineTo(x + 3, y + 3); c.lineTo(x, y + 9); c.closePath(); c.fill();
              if (e.late > 0) { c.fillStyle = C.bad; c.fillRect(x, by + bh + 1, Math.max(1, X(e.start) - x), 3); }
            }
            c.fillStyle = kit.hue(TM_HUES[e.k], 0.95); c.fillRect(X(e.start), by, Math.max(1.5, X(e.end) - X(e.start)), bh);
          }
        });
        const ay = top + 4 * rh + 4, step = niceMs(WIN, pw, 44);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(lm, ay); c.lineTo(lm + pw, ay); c.stroke();
        for (let t = 0; t <= WIN; t += step) { c.beginPath(); c.moveTo(X(t), ay); c.lineTo(X(t), ay + 4); c.stroke(); kit.label(c, String(t), X(t), ay + 14, { size: 10, align: t === 0 ? 'left' : t + step > WIN ? 'right' : 'center', color: C.muted }); }
        kit.label(c, 'ms', lm + pw, ay + 26, { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'triangle: due · block: callback ran · red: late', lm, ay + 26, { size: 10, color: C.muted });
        ro.set('per', act[0] + ' ms · ' + act[1] + ' ms · ' + act[2] + ' ms' + (act[0] !== v.p1 || act[1] !== v.p2 || act[2] !== v.p3 ? ' (rounded down to whole ticks)' : ''));
        ro.set('late', late.map(l => (l > 0 ? Math.round(l * 10) / 10 + ' ms' : 'none')).join(' · '));
        ro.set('busy', Math.min(100, Math.round(busy / WIN * 100)) + ' %' + (free > WIN ? ' (overloaded: callbacks pile up)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ fr-asyncio */
  Hyper.sim('fr-asyncio', {
    title: 'Cooperative jobs and pre-emptive tasks',
    blurb: `The same three jobs, run two ways: a **blink** job every 500 ms, a **button check** every 20 ms, and a **report** job every 2 seconds that can be told how long it works. In *asyncio* the jobs take turns in one thread and switch only when a job reaches an \`await\`. As *FreeRTOS tasks* of equal priority the scheduler can interrupt a job at any tick. Bars are running time; red marks are how long a job had to wait after it was due.

**Try this**
- With *asyncio* and a report that **works without yielding** for 300 ms, the button check is held up for the whole 300 ms: a quick press in that time would be missed.
- Choose *FreeRTOS tasks* with the same report: the scheduler interrupts it, so the button check is late by only a millisecond or two.
- Set the report to **wait properly** (an \`await\` or \`vTaskDelay\`): both styles are fine, because waiting costs nothing.
- Raise the work to 600 ms, and read the longest gap between button checks.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'The jobs run as', options: [['asyncio: cooperative, one thread', 'coop'], ['FreeRTOS tasks: pre-emptive, equal priority', 'pre']], value: 'coop' },
        { id: 'how', type: 'select', label: 'The report job', options: [['works without yielding', 'hog'], ['waits properly: await / vTaskDelay', 'yield']], value: 'hog' },
        { id: 'R', label: 'Report: work or wait', min: 0, max: 600, step: 10, value: 300, unit: 'ms' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['btn', 'Button check worst delay'], ['gap', 'Longest gap between checks'], ['blink', 'Blink worst delay']]);
      const WIN = 4000, NAMES = ['Blink', 'Button check', 'Report'], HUES = [28, 212, 150];
      function cooperative(tasks) {
        const left = [0, 0, 0], due = tasks.map(t => t.offset || 0), rel = [-1, -1, -1], slots = []; let cur = -1;
        for (let t = 0; t < WIN; t++) {
          for (let i = 0; i < 3; i++) if (t >= due[i]) { left[i] = tasks[i].run; due[i] += tasks[i].period; rel[i] = t; }
          if (cur < 0 || left[cur] <= 0) {
            cur = -1;
            for (let i = 0; i < 3; i++) if (left[i] > 0 && (cur < 0 || rel[i] < rel[cur])) cur = i;
          }
          if (cur >= 0) left[cur]--;
          slots.push({ t, task: cur });
        }
        return slots;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, R = Math.round(v.R);
        const tasks = [{ name: 'Blink', prio: 1, period: 500, run: 1 }, { name: 'Button check', prio: 1, period: 20, run: 1 }, { name: 'Report', prio: 1, period: 2000, run: v.how === 'hog' ? Math.max(1, R) : 1, offset: 100 }];
        const slots = v.mode === 'coop' ? cooperative(tasks) : E.schedule(tasks, WIN).slots;
        // when each job was due, when it first ran, and how late that was
        const delay = [0, 0, 0], delays = [[], [], []], runAt = [[], [], []];
        for (let i = 0; i < 3; i++) {
          for (let r = tasks[i].offset || 0; r < WIN; r += tasks[i].period) {
            let t = r; while (t < WIN && slots[t].task !== i) t++;
            if (t >= WIN) continue;
            const d = t - r; delays[i].push([r, d]); runAt[i].push(t); delay[i] = Math.max(delay[i], d);
          }
        }
        const lm = 84, rm = 12, top = 10, axisH = 30, pw = Math.max(40, st.W - lm - rm), rh = (st.H - top - axisH - 14) / 4, bh = Math.min(26, rh * 0.62);
        const X = t => lm + t / WIN * pw;
        NAMES.concat(['Idle']).forEach((nm, i) => {
          const y = top + i * rh, by = y + (rh - bh) / 2;
          kit.label(c, nm, lm - 6, y + rh / 2, { size: 10.5, align: 'right', weight: 600, color: i < 3 ? C.text : C.muted });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(lm, y + 2, pw, rh - 4);
          const arr = slots.map(s => (s.task === (i < 3 ? i : -1) ? 1 : 0));
          for (const [a, b] of segsOf(arr, 1)) { c.fillStyle = i < 3 ? kit.hue(HUES[i], 0.95) : (C.dark ? 'rgba(255,255,255,.2)' : 'rgba(0,0,0,.16)'); c.fillRect(X(a), by, Math.max(0.8, X(b) - X(a)), bh); }
          if (i < 3) for (const [r, d] of delays[i]) if (d > 1) { c.fillStyle = C.bad; c.fillRect(X(r), by + bh + 1, Math.max(1, X(r + d) - X(r)), 3); }
        });
        const ay = top + 4 * rh + 4, step = niceMs(WIN, pw, 44);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(lm, ay); c.lineTo(lm + pw, ay); c.stroke();
        for (let t = 0; t <= WIN; t += step) { c.beginPath(); c.moveTo(X(t), ay); c.lineTo(X(t), ay + 4); c.stroke(); kit.label(c, String(t), X(t), ay + 14, { size: 10, align: t === 0 ? 'left' : t + step > WIN ? 'right' : 'center', color: C.muted }); }
        kit.label(c, 'ms', lm + pw, ay + 26, { size: 10, align: 'right', color: C.muted });
        kit.label(c, 'bars: running · red: waited after being due', lm, ay + 26, { size: 10, color: C.muted });
        // the longest gap between two button checks
        let gap = 0; for (let k = 1; k < runAt[1].length; k++) gap = Math.max(gap, runAt[1][k] - runAt[1][k - 1]);
        ro.set('btn', delay[1] > 1 ? delay[1] + ' ms late (it is due every 20 ms)' : 'on time');
        ro.set('gap', gap + ' ms' + (gap > 25 ? ': a press shorter than that can be missed' : ''));
        ro.set('blink', delay[0] > 1 ? delay[0] + ' ms late' : 'on time');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
