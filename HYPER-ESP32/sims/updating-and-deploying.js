/* HYPER-ESP32 · sims/updating-and-deploying.js
 *
 * Simulations of the topic "Updating and deploying" (updating-and-deploying):
 *
 *   ud-ota-slots         the two program slots during an update, with a power cut at a chosen stage and what the bootloader does
 *   ud-rollback          a new program on probation: a crash, a hang, or a lost network, with and without rollback, watchdog and self-test
 *   ud-fleet-rollout     a fleet of 400 devices updated all at once or in rings, with a halt when a ring fails
 *   ud-version-compare   is the offered version newer? text order, a packed number and the field-by-field rule side by side
 *   (more follow in the same file: the production line, test limits, the certificate cover, the licence mix, heartbeats)
 *
 * Numbers come from kit.esp where there is a real figure (partition sizes, flash time on a UART); the behaviour of the
 * bootloader follows the ESP-IDF OTA documentation. Pictures that do not move redraw on demand; the ones that play run a loop.
 * Theme colours only.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2))); else c.rect(x, y, w, h); };
  const mulberry = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  // greedy word wrap: the lines of a text that must fit a width at a font size
  function wrap(c, text, maxW, size, weight) {
    c.save();
    c.font = (weight || 500) + ' ' + size + 'px system-ui, "Segoe UI", sans-serif';
    const words = String(text).split(' '), lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (cur && c.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t;
    }
    if (cur) lines.push(cur);
    c.restore();
    return lines;
  }
  const toneColor = (C, tone) => (tone === 'ok' ? C.ok : tone === 'bad' ? C.bad : tone === 'warn' ? C.warn : tone === 'info' ? C.accent : C.muted);
  const fmtT = s => (s < 10 ? s.toFixed(1) : Math.round(s)) + ' s';

  /* a slot box of the two-slot pictures. sl: { v (version), note, fill (0…1), tone, run, over (fraction replaced, for an overwrite), unused } */
  function drawSlot(c, C, kit, x, y, w, h, title, sl, dim) {
    const line = sl.unused ? C.faint : toneColor(C, sl.tone);
    c.save();
    if (dim) c.globalAlpha = 0.45;
    rrect(c, x, y, w, h, 8);
    c.fillStyle = C.surface; c.fill();
    c.lineWidth = sl.run ? 2.6 : 1.4; c.strokeStyle = line;
    if (sl.unused) c.setLineDash([5, 4]);
    c.stroke(); c.setLineDash([]);
    kit.label(c, title, x + 9, y + 13, { size: 10.5, color: C.muted, baseline: 'middle' });
    if (sl.run) kit.label(c, 'running', x + w - 9, y + 13, { size: 10.5, color: C.ok, align: 'right', baseline: 'middle', weight: 650 });
    if (sl.v) kit.label(c, sl.v, x + 9, y + h * 0.5, { size: Math.min(24, h * 0.3), weight: 700, color: sl.v.indexOf('v2') >= 0 ? kit.hue(150) : kit.hue(212), baseline: 'middle' });
    const noteLines = wrap(c, sl.note || '', w - 18, 10.5);
    noteLines.slice(0, 2).forEach((t, i) => kit.label(c, t, x + 9, y + h - 24 + i * 12 - (noteLines.length > 1 ? 4 : 0), { size: 10.5, color: sl.unused ? C.faint : line, baseline: 'middle' }));
    // the fill bar along the bottom edge
    if (!sl.unused && (sl.fill > 0 && sl.fill < 1 || sl.over != null)) {
      const bx = x + 9, bw = w - 18, by = y + h - 9;
      c.fillStyle = C.dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.10)'; c.fillRect(bx, by, bw, 4);
      if (sl.over != null) { c.fillStyle = kit.hue(212); c.fillRect(bx, by, bw, 4); c.fillStyle = kit.hue(150); c.fillRect(bx, by, bw * clamp(sl.over, 0, 1), 4); }
      else { c.fillStyle = kit.hue(150); c.fillRect(bx, by, bw * clamp(sl.fill, 0, 1), 4); }
    }
    c.restore();
  }

  /* ================================================================ ud-ota-slots */
  const CUTS = [['No power cut', 'none'], ['During the download', 'download'], ['While the image is checked', 'check'], ['While the record is switched', 'switch'], ['Just after the first start', 'probation']];

  function otaPlan(v) {
    const slots = v.method === 'slots';
    const stages = slots
      ? [['download', 3.2], ['check', 1.0], ['switch', 1.2], ['restart', 1.0], [v.rollback ? 'probation' : 'running', v.rollback ? 2.6 : 1.4]]
      : [['overwrite', 3.2], ['restart', 1.0], ['running', 1.4]];
    let cut = null;
    if (v.cut !== 'none') cut = slots ? { download: [0, 0.55], check: [1, 0.5], switch: [2, 0.45], probation: [4, 0.4] }[v.cut] : { download: [0, 0.5], check: [0, 0.95], switch: [0, 0.95], probation: [2, 0.4] }[v.cut];
    const at = (s, f) => stages.slice(0, s).reduce((a, x) => a + x[1], 0) + f * stages[s][1];
    return { slots, stages, cut, total: at(stages.length - 1, 1), cutTime: cut ? at(cut[0], cut[1]) : null };
  }
  function stageAt(plan, t) {
    let acc = 0;
    for (let s = 0; s < plan.stages.length; s++) { const d = plan.stages[s][1]; if (t < acc + d) return [s, (t - acc) / d]; acc += d; }
    return [plan.stages.length - 1, 1];
  }
  // what the slots and the otadata records hold at stage s, fraction f, on a run without a cut
  function normalView(plan, v, s, f) {
    const V = {
      A: { v: 'v1', note: 'running, valid', fill: 1, tone: 'ok', run: true },
      B: { v: '', note: 'empty', fill: 0, tone: 'dim' },
      recs: [{ text: 'seq 1 → slot A · valid', tone: 'ok', on: true }, { text: 'empty', tone: 'dim' }],
      status: ''
    };
    if (plan.slots) {
      if (s === 0) { V.B = { v: 'v2', note: 'writing ' + Math.round(f * 100) + ' %', fill: f, tone: 'warn' }; V.status = 'Downloading v2 into slot B, while v1 keeps running'; }
      else if (s === 1) { V.B = { v: 'v2', note: 'being checked', fill: 1, tone: 'warn' }; V.status = 'Checking the size and the checksum of the image in slot B'; }
      else if (s === 2) {
        V.B = { v: 'v2', note: 'checked, not selected yet', fill: 1, tone: 'ok' };
        V.recs[1] = f < 0.55 ? { text: 'being written…', tone: 'warn' } : { text: 'seq 2 → slot B · new', tone: 'ok' };
        V.status = 'Writing a new record into the other sector of otadata';
      } else if (s === 3) {
        V.B = { v: 'v2', note: 'checked', fill: 1, tone: 'ok' };
        V.recs[1] = { text: 'seq 2 → slot B · new', tone: 'ok', on: f > 0.5 };
        V.recs[0].on = false;
        V.A = { v: 'v1', note: f < 0.5 ? 'stopping' : 'idle, spare', fill: 1, tone: 'dim', run: false };
        V.status = f < 0.5 ? 'Restarting' : 'Bootloader: the highest valid sequence is 2, so slot B starts';
      } else {
        V.A = { v: 'v1', note: 'idle, spare', fill: 1, tone: 'dim', run: false };
        V.recs[0].on = false;
        if (v.rollback) {
          const ok = f > 0.85;
          V.B = { v: 'v2', note: ok ? 'running, valid' : 'running, pending verify', fill: 1, tone: ok ? 'ok' : 'warn', run: true };
          V.recs[1] = { text: 'seq 2 → slot B · ' + (ok ? 'valid' : 'pending verify'), tone: ok ? 'ok' : 'warn', on: true };
          V.status = ok ? 'The self-test passed: v2 marks itself valid' : 'v2 runs on probation and makes its self-test';
        } else {
          V.B = { v: 'v2', note: 'running', fill: 1, tone: 'ok', run: true };
          V.recs[1] = { text: 'seq 2 → slot B', tone: 'ok', on: true };
          V.status = 'v2 runs. Rollback is off, so nothing can send it back';
        }
      }
    } else {
      V.B = { v: '', note: 'no second slot', fill: 0, tone: 'dim', unused: true };
      V.recs = [{ text: 'no otadata: one program slot only', tone: 'dim' }, { text: '', tone: 'dim' }];
      if (s === 0) { V.A = { v: 'v1 → v2', note: 'being overwritten ' + Math.round(f * 100) + ' %', over: f, fill: f, tone: 'warn', run: true }; V.status = 'Overwriting the running program: the old one is destroyed as it goes'; }
      else if (s === 1) { V.A = { v: 'v2', note: 'written', fill: 1, tone: 'ok' }; V.status = 'Restarting'; }
      else { V.A = { v: 'v2', note: 'running', fill: 1, tone: 'ok', run: true }; V.status = 'v2 runs'; }
    }
    return V;
  }
  // what the bootloader finds when the power comes back, and what it does
  function finalView(plan, v) {
    const last = plan.stages.length - 1;
    if (!plan.cut) {
      const V = normalView(plan, v, last, 1);
      return { view: V, result: { tone: 'ok', head: plan.slots && v.rollback ? 'v2 is running and confirmed' : 'v2 is running', text: 'The update went through. The old program stays in the other slot as a spare until the next update.' } };
    }
    const [s, f] = plan.cut;
    const V = normalView(plan, v, s, f);
    if (!plan.slots) {
      if (v.cut === 'probation') { V.A = { v: 'v2', note: 'running', fill: 1, tone: 'ok', run: true }; V.status = ''; return { view: V, result: { tone: 'ok', head: 'Starts v2', text: 'The overwrite had finished; v2 is complete and starts. A cut earlier would have been fatal.' } }; }
      V.A = { v: 'v1 / v2', note: 'half old, half new: no valid image', over: f, fill: f, tone: 'bad', run: false };
      return { view: V, result: { tone: 'bad', head: 'Nothing to start', text: 'The only program slot holds half of v1 and half of v2. The bootloader finds no valid image, so the device stays dead until someone flashes it over the cable.' } };
    }
    V.A = { v: 'v1', note: 'complete: will run', fill: 1, tone: 'ok', run: true };
    V.recs[0].on = true;
    if (v.cut === 'download') {
      V.B = { v: 'v2', note: 'half written, ignored', fill: f, tone: 'bad' };
      return { view: V, result: { tone: 'warn', head: 'Starts v1', text: 'The record still names slot A, whose program is complete. The half-written image in slot B is never started and is erased by the next try.' } };
    }
    if (v.cut === 'check') {
      V.B = { v: 'v2', note: 'complete but never selected', fill: 1, tone: 'warn' };
      return { view: V, result: { tone: 'warn', head: 'Starts v1', text: 'The image in slot B was complete, but nothing had selected it: the record still names slot A. v1 starts and the update is tried again.' } };
    }
    if (v.cut === 'switch') {
      V.B = { v: 'v2', note: 'checked, not selected', fill: 1, tone: 'warn' };
      V.recs[1] = { text: 'half written: bad checksum', tone: 'bad' };
      return { view: V, result: { tone: 'warn', head: 'Starts v1', text: 'The half-written record fails its checksum and is ignored. The older record, in the other sector, still decides: v1 starts.' } };
    }
    // just after the first start of v2
    if (v.rollback) {
      V.A = { v: 'v1', note: 'running again (rolled back)', fill: 1, tone: 'ok', run: true };
      V.B = { v: 'v2', note: 'aborted', fill: 1, tone: 'bad', run: false };
      V.recs[0].on = false; V.recs[1] = { text: 'seq 2 → slot B · aborted', tone: 'bad', on: false };
      return { view: V, result: { tone: 'warn', head: 'Rolls back to v1', text: 'v2 was still pending verify when the power failed. The bootloader marks it aborted and starts the previous slot.' } };
    }
    V.A = { v: 'v1', note: 'idle, spare', fill: 1, tone: 'dim', run: false };
    V.B = { v: 'v2', note: 'running', fill: 1, tone: 'ok', run: true };
    V.recs[0].on = false; V.recs[1] = { text: 'seq 2 → slot B', tone: 'ok', on: true };
    return { view: V, result: { tone: 'ok', head: 'Starts v2', text: 'Without rollback nothing is on probation, so v2 simply starts again. If it were a bad program, nothing would send the device back to v1.' } };
  }

  Hyper.sim('ud-ota-slots', {
    title: 'An update, and a power cut at the wrong moment',
    blurb: `Two program slots, **A** and **B**, and the small record in **otadata** that tells the bootloader which one to start. The update plays in five steps; pick the moment at which the **power fails** and read what the bootloader finds when the power returns.

**Try this**
- Leave the method on *idle slot* and cut the power **during the download**: the old program is untouched, so v1 simply starts.
- Cut it **while the record is switched**: the half-written record fails its checksum and is ignored.
- Switch the method to *overwrite the running program* and cut the power during the download: the device is dead.
- Cut the power **just after the first start**: with *rollback* on, the bootloader marks v2 aborted and returns to v1; with it off, v2 simply starts.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'How the update is written', options: [['Into the idle slot (OTA)', 'slots'], ['Over the running program', 'inplace']], value: 'slots' },
        { id: 'cut', type: 'select', label: 'Power fails', options: CUTS, value: params.cut || 'none' },
        { id: 'rollback', type: 'check', label: 'Rollback enabled in the bootloader', value: params.mode === 'rollback' },
        { type: 'buttons', items: [{ id: 'go', label: 'Play the update again', primary: true }] }
      ], () => { clk = 0; });
      const ro = kit.readout(box.side, [['stage', 'Step'], ['power', 'Power'], ['boot', 'The bootloader starts'], ['dev', 'The device']]);
      let clk = 0;
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const v = ctl.values, plan = otaPlan(v), OFF = 1.4;
        let phase = 'run', view, result = null, sIdx, frac;
        if (plan.cut && clk >= plan.cutTime) {
          [sIdx, frac] = plan.cut;
          if (clk < plan.cutTime + OFF) { phase = 'off'; view = normalView(plan, v, sIdx, frac); }
          else { phase = 'result'; const fin = finalView(plan, v); view = fin.view; result = fin.result; }
        } else if (!plan.cut && clk >= plan.total) {
          [sIdx, frac] = [plan.stages.length - 1, 1]; phase = 'result'; const fin = finalView(plan, v); view = fin.view; result = fin.result;
        } else { [sIdx, frac] = stageAt(plan, clk); view = normalView(plan, v, sIdx, frac); }
        const n = plan.stages.length, gap = 4, cw = (W - 2 * M - gap * (n - 1)) / n;
        // the stage chips
        plan.stages.forEach((s, i) => {
          const x = M + i * (cw + gap), done = phase === 'result' && !plan.cut ? true : i < sIdx, cur = i === sIdx && phase !== 'result';
          const cutHere = plan.cut && plan.cut[0] === i;
          rrect(c, x, 8, cw, 22, 6);
          c.fillStyle = done ? (C.dark ? 'rgba(123,140,255,.28)' : 'rgba(60,90,220,.16)') : C.surface; c.fill();
          c.lineWidth = cur ? 2.2 : 1.2; c.strokeStyle = cur ? C.accent : C.border2 || C.faint; c.stroke();
          kit.label(c, s[0], x + cw / 2, 19, { size: cw < 70 ? 9.5 : 10.5, color: done || cur ? C.text : C.faint, align: 'center', baseline: 'middle', weight: cur ? 650 : 500 });
          if (cutHere && phase !== 'run') kit.label(c, 'power lost', x + cw / 2, 40, { size: 10, color: C.bad, align: 'center', baseline: 'middle', weight: 650 });
        });
        // the slots
        const sy = 52, sh = clamp(H * 0.25, 74, 112), sw = (W - 2 * M - 12) / 2, dim = phase === 'off';
        drawSlot(c, C, kit, M, sy, sw, sh, 'Slot A · ota_0', view.A, dim);
        drawSlot(c, C, kit, M + sw + 12, sy, sw, sh, 'Slot B · ota_1', view.B, dim);
        // otadata
        const oy = sy + sh + 12, oh = clamp(H * 0.15, 50, 70);
        rrect(c, M, oy, W - 2 * M, oh, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 1.2; c.strokeStyle = C.muted; c.stroke();
        kit.label(c, 'otadata: two records (sequence, state, checksum)', M + 9, oy + 12, { size: 10.5, color: C.muted, baseline: 'middle' });
        const rw = (W - 2 * M - 18 - 8) / 2;
        view.recs.forEach((r, i) => {
          const rx = M + 9 + i * (rw + 8), ry = oy + 22, rh = oh - 30;
          rrect(c, rx, ry, rw, rh, 5);
          c.fillStyle = r.on ? (C.dark ? 'rgba(34,179,122,.22)' : 'rgba(34,179,122,.16)') : (C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'); c.fill();
          c.lineWidth = r.on ? 1.8 : 1; c.strokeStyle = r.on ? C.ok : C.faint; c.stroke();
          const lines = wrap(c, r.text, rw - 12, 10.5);
          lines.slice(0, 2).forEach((t, k) => kit.label(c, t, rx + 6, ry + rh / 2 + (k - (lines.length > 1 ? 0.5 : 0)) * 12, { size: 10.5, color: toneColor(C, r.tone), baseline: 'middle' }));
        });
        // the status line and the result
        const ty = oy + oh + 16;
        const sLines = wrap(c, phase === 'off' ? 'The power is gone. Nothing runs and nothing is written.' : phase === 'result' ? 'Power is back. The ROM starts the bootloader, which reads otadata.' : view.status, W - 2 * M, 12.5, 600);
        sLines.slice(0, 2).forEach((t, i) => kit.label(c, t, M, ty + i * 15, { size: 12.5, weight: 600, color: phase === 'off' ? C.bad : C.text, baseline: 'middle' }));
        if (result) {
          const ry = ty + 20 + (sLines.length > 1 ? 12 : 0), lines = wrap(c, result.text, W - 2 * M - 20, 11.5), rh = Math.min(H - ry - 6, 28 + lines.length * 14);
          rrect(c, M, ry, W - 2 * M, rh, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = toneColor(C, result.tone); c.stroke();
          kit.label(c, result.head, M + 10, ry + 14, { size: 13, weight: 700, color: toneColor(C, result.tone), baseline: 'middle' });
          lines.forEach((t, i) => kit.label(c, t, M + 10, ry + 31 + i * 14, { size: 11.5, color: C.text2 || C.text, baseline: 'middle' }));
        }
        // the read-outs
        ro.set('stage', phase === 'result' && !plan.cut ? 'finished' : plan.stages[sIdx][0] + (phase === 'run' ? ' (' + Math.round(frac * 100) + ' %)' : ''));
        ro.set('power', phase === 'off' ? 'lost' : phase === 'result' && plan.cut ? 'back on' : plan.cut ? 'on, will fail at ' + fmtT(plan.cutTime) : 'stays on');
        ro.set('boot', result ? result.head : 'not yet');
        ro.set('dev', result ? (result.tone === 'bad' ? 'dead until reflashed by cable' : result.tone === 'warn' ? 'works, on the old program' : 'works, on the new program') : 'updating');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ud-rollback */
  function rollbackRun(v) {
    const ev = [], rb = v.rb, bug = v.bug, wdt = v.wdt;
    let a = 'v1 valid', b = 'v2 new', run = 'A', end = null;
    const push = (t, text, tone, na, nb, nrun) => { if (na) a = na; if (nb) b = nb; if (nrun) run = nrun; ev.push({ t, text, tone, a, b, run }); };
    push(0, 'v2 is written into slot B and the record names B', 'info', 'v1 valid, running', 'v2 new', 'A');
    push(0, rb ? 'Restart: the bootloader runs v2 and marks it pending verify' : 'Restart: the bootloader runs v2', 'info', 'v1 valid, spare', rb ? 'v2 pending verify' : 'v2 running', 'B');
    let conf = null, giveUp = null;
    if (v.confirm === 'first') conf = 0.3;
    else if (v.confirm === 'timed') conf = 30;
    else { conf = bug === 'wifi' ? null : 5; giveUp = 60; }
    const cand = [];
    if (bug === 'crash') cand.push([1.0, 'crash']);
    if (bug === 'hang') { cand.push([10, 'hang']); if (wdt) cand.push([15, 'wdt']); }
    if (rb && conf != null) cand.push([conf, 'confirm']);
    if (rb && giveUp != null && conf == null) cand.push([giveUp, 'giveup']);
    cand.sort((x, y) => x[0] - y[0]);
    let state = rb ? 'pending' : 'valid';
    const restart = (t, why) => {
      push(t, why, 'bad');
      if (state === 'pending') {
        push(t + 0.8, 'Bootloader: v2 was still pending verify, so it is aborted. v1 starts', 'warn', 'v1 valid, running', 'v2 aborted', 'A');
        end = { tone: 'warn', head: 'Rolled back to v1', text: 'The device runs the old program again, and can try the update later. The update failed, the device did not.' };
      } else {
        push(t + 0.8, 'The bootloader starts v2 again, and it fails the same way, for ever', 'bad', null, rb ? 'v2 valid, in a loop' : 'v2 in a loop', 'B');
        end = { tone: 'bad', head: 'A boot loop', text: rb ? 'v2 had already confirmed itself, so every restart brings it back. Unless it stays up long enough to fetch a fix, the device needs a visit.' : 'Rollback is off, so nothing ever sends the device back to v1. Unless it stays up long enough to fetch a fix, it needs a visit.' };
      }
    };
    for (const [t, what] of cand) {
      if (end) break;
      if (what === 'crash') restart(t, 'v2 crashes: the chip restarts');
      else if (what === 'hang') {
        push(t, 'v2 hangs: the program no longer does anything', 'bad');
        if (!wdt) end = { tone: 'bad', head: state === 'pending' ? 'Stuck on probation' : 'Hung for ever', text: 'A hang is not a reset, so no rollback happens. Without a watchdog the device sits there, useless. Only a watchdog turns a hang into a restart.' };
      } else if (what === 'wdt') restart(t, 'The watchdog fires: the chip restarts');
      else if (what === 'confirm') { push(t, 'v2 confirms itself: marked valid', 'ok', null, 'v2 valid, running', 'B'); state = 'valid'; }
      else if (what === 'giveup') {
        push(t, 'The self-test failed (no server within 60 s): v2 marks itself invalid and restarts', 'warn');
        push(t + 0.8, 'Bootloader starts v1', 'warn', 'v1 valid, running', 'v2 invalid', 'A');
        end = { tone: 'warn', head: 'Rolled back to v1', text: 'The self-test waited for the server and gave up. The device is safe on the old program, which can reach the network.' };
      }
    }
    if (!end) {
      if (bug === 'wifi') end = { tone: 'bad', head: 'Running, but cut off', text: 'v2 starts and keeps running, so no reset ever comes. It cannot reach the network or the server, and nothing sends it back: only a visit can fix it. A self-test that waited for the server would have rolled it back.' };
      else end = { tone: 'ok', head: 'v2 works', text: state === 'valid' && rb ? 'The new program is confirmed and stays. The old one is a spare in slot A.' : 'The new program runs. Nothing was ever on probation, so nothing could have stopped a bad one.' };
    }
    return { ev, end };
  }

  Hyper.sim('ud-rollback', {
    title: 'A bad update on probation',
    blurb: `An update has just been written. The new program **v2** has a fault of your choosing. Whether the device ends up safe depends on three things you control: *rollback* in the bootloader, a *watchdog*, and **when v2 confirms** that it is good.

**Try this**
- Fault *crashes at start*, confirmation *in the first line*: the crash comes after the confirmation, so v2 stays, and the device loops for ever.
- Change the confirmation to *after 30 s*: the crash resets v2 before it confirms, and the device returns to v1.
- Fault *hangs after 10 s*, no watchdog: nothing resets, nothing rolls back. Switch the watchdog on.
- Fault *starts, but cannot join Wi-Fi*: only the confirmation that **waits for the server** saves the device.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 400, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'bug', type: 'select', label: 'The new program v2…', options: [['works', 'none'], ['crashes at start', 'crash'], ['hangs after 10 s', 'hang'], ['starts, but cannot join Wi-Fi', 'wifi']], value: 'crash' },
        { id: 'confirm', type: 'select', label: 'v2 confirms itself…', options: [['in its first line', 'first'], ['after 30 s without a reset', 'timed'], ['after reaching the server (gives up at 60 s)', 'server']], value: 'first' },
        { id: 'wdt', type: 'check', label: 'Watchdog switched on', value: true },
        { id: 'rb', type: 'check', label: 'Rollback enabled in the bootloader', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Run the update again', primary: true }] }
      ], () => { shown = 0; });
      const ro = kit.readout(box.side, [['run', 'Running at the end'], ['a', 'Slot A'], ['b', 'Slot B'], ['res', 'Outcome']]);
      let shown = 0;
      const loop = kit.loop(dt => {
        shown += dt / 0.8;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const R = rollbackRun(ctl.values), n = Math.min(R.ev.length, Math.floor(shown) + 1), cur = R.ev[n - 1], done = n >= R.ev.length;
        // the two slots in the state of the latest event shown
        const sh = clamp(H * 0.17, 56, 78), sw = (W - 2 * M - 12) / 2, tone = s => (/aborted|invalid|loop/.test(s) ? 'bad' : /pending|new/.test(s) ? 'warn' : /valid|running/.test(s) ? 'ok' : 'dim');
        drawSlot(c, C, kit, M, 8, sw, sh, 'Slot A · v1', { v: '', note: cur.a, tone: tone(cur.a), run: cur.run === 'A', fill: 1 }, false);
        drawSlot(c, C, kit, M + sw + 12, 8, sw, sh, 'Slot B · v2', { v: '', note: cur.b, tone: tone(cur.b), run: cur.run === 'B', fill: 1 }, false);
        // the events so far, in time order
        let size = 11.5, rows = [];
        const build = sz => R.ev.slice(0, n).map(e => ({ e, lines: wrap(c, e.text, W - 2 * M - 62, sz) }));
        const resH = done ? 70 : 0, avail = H - (sh + 8 + 12) - resH - 10;
        rows = build(size);
        const need = r => r.reduce((a, x) => a + x.lines.length * (size + 3) + 6, 0);
        if (need(rows) > avail) { size = 10; rows = build(size); }
        let y = sh + 8 + 18;
        for (const r of rows) {
          kit.label(c, '+' + fmtT(r.e.t), M, y, { size: 10.5, color: C.muted, baseline: 'middle' });
          kit.dot(c, M + 52, y, 4, toneColor(C, r.e.tone));
          r.lines.forEach((t, i) => kit.label(c, t, M + 62, y + i * (size + 3), { size, color: C.text, baseline: 'middle' }));
          y += r.lines.length * (size + 3) + 6;
        }
        if (done) {
          const lines = wrap(c, R.end.text, W - 2 * M - 20, 11), ry = Math.min(H - 12 - (24 + lines.length * 13), Math.max(y + 4, H * 0.7)), rh = 24 + lines.length * 13 + 4;
          rrect(c, M, ry, W - 2 * M, rh, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = toneColor(C, R.end.tone); c.stroke();
          kit.label(c, R.end.head, M + 10, ry + 13, { size: 13, weight: 700, color: toneColor(C, R.end.tone), baseline: 'middle' });
          lines.forEach((t, i) => kit.label(c, t, M + 10, ry + 29 + i * 13, { size: 11, color: C.text2 || C.text, baseline: 'middle' }));
        }
        const last = R.ev[R.ev.length - 1];
        ro.set('run', done ? (last.run === 'A' ? 'v1' : 'v2') : '…');
        ro.set('a', done ? last.a : '…');
        ro.set('b', done ? last.b : '…');
        ro.set('res', done ? R.end.head : 'playing');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ud-fleet-rollout */
  const FLEET = 400, COLS = 20;
  const RING_SIZES = { rings: [['canary', 8], ['early', 40], ['wide', 200], ['everyone', 400]], all: [['everyone', 400]] };
  Hyper.sim('ud-fleet-rollout', {
    title: 'Rolling a release out in rings',
    blurb: `A fleet of 400 devices, one dot each. A release goes out **all at once**, or in **rings** — a few devices first, then more — and the roll-out **halts** if too many in a ring fail. The new version breaks a share of the devices (a hardware variant, a router quirk); each device's fate is fixed, so you can compare runs.

**Try this**
- Start with the rings and the defaults: the canary ring is lucky, the early ring catches the fault, and 360 devices never see the bad version.
- Switch to *everyone at once*: every broken device breaks together.
- Lower the share to 4 %: the early ring passes, the wide ring catches it, later. A small ring can miss a rare fault.
- Raise it to 15 %: even the canary ring of eight sees it. Switch off *roll themselves back* to see the devices that would need a visit.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 420, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'plan', type: 'select', label: 'Release plan', options: [['Rings: 8 · 40 · 200 · all', 'rings'], ['Everyone at once', 'all']], value: params.plan === 'all' ? 'all' : 'rings' },
        { id: 'bug', label: 'Share of devices the new version breaks', min: 0, max: 30, step: 1, value: 8, unit: '%' },
        { id: 'halt', label: 'Halt if more than … of a ring fail', min: 0, max: 20, step: 1, value: 3, unit: '%' },
        { id: 'back', type: 'check', label: 'Failed devices roll themselves back', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Start the roll-out', primary: true }] }
      ], () => { clk = 0; });
      const ro = kit.readout(box.side, [['good', 'On the new version, working'], ['bad', 'Failing, not recovered'], ['back', 'Rolled back to the old version'], ['old', 'Still on the old version'], ['res', 'Roll-out']]);
      // a fixed fleet: every device has a number that decides whether the new version breaks it, and a place in the update order
      const rnd = mulberry(54), u = [], order = [], pos = new Array(FLEET);
      for (let i = 0; i < FLEET; i++) { u.push(rnd()); order.push(i); }
      for (let i = FLEET - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      order.forEach((d, k) => { pos[d] = k; });
      let clk = 0;
      const T_UPDATE = 1.4, T_SOAK = 1.0, T_BACK = 1.2, T_GAP = 0.5;
      // the timetable of the rings: when each starts, how many fail, and whether the roll-out halts there
      function timetable(v) {
        const defs = RING_SIZES[v.plan], out = [];
        let prev = 0, t = 0, halted = -1;
        defs.forEach(([name, cum], r) => {
          if (halted >= 0) { out.push({ name, from: prev, to: cum, skipped: true }); prev = cum; return; }
          let fails = 0;
          for (let i = 0; i < FLEET; i++) if (pos[i] >= prev && pos[i] < cum && u[i] < v.bug / 100) fails++;
          const size = cum - prev, rate = size ? fails / size : 0;
          const R = t + T_UPDATE + T_SOAK, verdict = R + (v.back ? T_BACK : 0) + 0.8;
          const haltAny = defs.length > 1 && rate * 100 > v.halt;
          out.push({ name, from: prev, to: cum, size, fails, rate, t0: t, tRes: R, tVerdict: verdict, halt: haltAny });
          if (haltAny) halted = r;
          t = verdict + T_GAP; prev = cum;
        });
        return { rows: out, halted, end: out.filter(x => !x.skipped).slice(-1)[0].tVerdict };
      }
      // the state of one device at the time t
      function deviceState(v, tt, i) {
        const rows = tt.rows, p = pos[i];
        const ring = rows.find(r => p >= r.from && p < r.to);
        if (!ring || ring.skipped || clk < ring.t0) return 'old';
        const local = (p - ring.from) / Math.max(1, ring.size);
        if (clk < ring.t0 + T_UPDATE * local) return 'old';
        const fails = u[i] < v.bug / 100;
        if (clk < ring.tRes) return 'probation';
        if (!fails) return 'good';
        return v.back && clk >= ring.tRes + T_BACK ? 'back' : 'failed';
      }
      const loop = kit.loop(dt => {
        clk += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const v = ctl.values, tt = timetable(v), wide = W >= 600;
        const cell = wide ? Math.min((H - 2 * M) / COLS, (W * 0.46) / COLS) : Math.min((W - 2 * M) / COLS, (H * 0.5) / COLS);
        const gx = wide ? M : Math.max(M, (W - cell * COLS) / 2), gy = M;
        const col = { old: C.faint, probation: kit.hue(212), good: C.ok, failed: C.bad, back: C.warn };
        const count = { old: 0, probation: 0, good: 0, failed: 0, back: 0 };
        for (let i = 0; i < FLEET; i++) {
          const s = deviceState(v, tt, i); count[s]++;
          const cx = gx + (i % COLS + 0.5) * cell, cy = gy + (Math.floor(i / COLS) + 0.5) * cell;
          c.beginPath(); c.arc(cx, cy, Math.max(1.5, cell * 0.36), 0, Math.PI * 2);
          c.fillStyle = col[s]; c.globalAlpha = s === 'old' ? 0.55 : 1; c.fill(); c.globalAlpha = 1;
        }
        // the legend and the table of rings
        const x0 = wide ? gx + cell * COLS + 18 : M, w0 = wide ? W - x0 - M : W - 2 * M;
        let y = wide ? 18 : gy + cell * COLS + 18;
        const legend = [['old version', col.old], ['new, on probation', col.probation], ['new, working', col.good], ['failing', col.bad], ['rolled back', col.warn]];
        let lx = x0;
        for (const [name, colr] of legend) {
          const tw = name.length * 6.2 + 22;
          if (lx + tw > x0 + w0 && lx > x0) { lx = x0; y += 16; }
          kit.dot(c, lx + 5, y, 4.5, colr);
          kit.label(c, name, lx + 14, y, { size: 10.5, color: C.muted, baseline: 'middle' });
          lx += tw + 6;
        }
        y += 26;
        kit.label(c, 'ring', x0, y, { size: 10.5, color: C.faint, baseline: 'middle' });
        kit.label(c, 'devices', x0 + w0 * 0.30, y, { size: 10.5, color: C.faint, baseline: 'middle' });
        kit.label(c, 'failed', x0 + w0 * 0.52, y, { size: 10.5, color: C.faint, baseline: 'middle' });
        kit.label(c, 'verdict', x0 + w0 * 0.72, y, { size: 10.5, color: C.faint, baseline: 'middle' });
        y += 18;
        let haltRow = null;
        for (const r of tt.rows) {
          const known = !r.skipped && clk >= r.tRes, decided = !r.skipped && clk >= r.tVerdict;
          kit.label(c, r.name, x0, y, { size: 12, weight: 600, color: r.skipped ? C.faint : C.text, baseline: 'middle' });
          kit.label(c, String(r.to - r.from), x0 + w0 * 0.30, y, { size: 12, color: r.skipped ? C.faint : C.text, baseline: 'middle' });
          kit.label(c, r.skipped ? '–' : known ? r.fails + ' (' + (r.size ? Math.round(100 * r.fails / r.size) : 0) + ' %)' : '…', x0 + w0 * 0.52, y, { size: 12, color: r.skipped ? C.faint : C.text, baseline: 'middle' });
          const vt = r.skipped ? 'never reached' : !decided ? (clk >= r.t0 ? 'soaking…' : 'waiting') : r.halt ? 'HALT' : 'passed';
          kit.label(c, vt, x0 + w0 * 0.72, y, { size: 12, weight: 650, color: r.halt && decided ? C.bad : decided && !r.skipped ? C.ok : C.muted, baseline: 'middle' });
          if (r.halt && decided && !haltRow) haltRow = r;
          y += 22;
        }
        y += 6;
        const finished = clk >= tt.end;
        const bad = count.failed, back = count.back, good = count.good, old = count.old;
        let msg = '', tone = 'info';
        if (finished) {
          if (haltRow) { msg = 'Halted after the ' + haltRow.name + ' ring: ' + haltRow.fails + ' of ' + haltRow.size + ' devices failed. ' + old + ' devices never saw the bad version.'; tone = back + bad > 0 ? 'warn' : 'ok'; }
          else if (v.plan === 'all') { msg = 'Everyone at once: ' + (bad + back) + ' of ' + FLEET + ' devices were broken together' + (v.back ? ', then returned to the old version by themselves.' : ' and stay broken.'); tone = bad + back ? 'bad' : 'ok'; }
          else { msg = 'Every ring passed under the halt limit: ' + good + ' devices work and ' + (bad + back) + ' were broken' + (v.bug > 0 && bad + back > 0 ? ' (a ring can pass with some failures below the limit).' : '.'); tone = bad + back ? 'warn' : 'ok'; }
        } else msg = 'Roll-out in progress…';
        wrap(c, msg, w0, 12, 600).slice(0, 4).forEach((t, i) => kit.label(c, t, x0, y + i * 15, { size: 12, weight: 600, color: tone === 'info' ? C.text : toneColor(C, tone), baseline: 'middle' }));
        ro.set('good', String(good));
        ro.set('bad', String(bad));
        ro.set('back', String(back));
        ro.set('old', String(old + count.probation));
        ro.set('res', finished ? (haltRow ? 'halted at ' + haltRow.name : 'complete') : 'running');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ud-version-compare */
  const VERSIONS = ['0.9.12', '1.2.3', '1.2.4', '1.9.0', '1.10.0', '1.99.0', '1.100.0', '2.0.0-rc.1', '2.0.0', '2.0.1', '10.0.0'];
  const parseV = s => { const parts = s.split('-'), n = parts[0].split('.').map(Number); return { n, pre: parts[1] || null }; };
  const packedV = s => { const p = parseV(s).n; return p[0] * 10000 + p[1] * 100 + p[2]; };
  const FIELDS = ['major', 'minor', 'patch'];
  // the field-by-field rule: -1, 0, 1, and the field that decided
  function semCmp(a, b) {
    const A = parseV(a), B = parseV(b);
    for (let i = 0; i < 3; i++) if (A.n[i] !== B.n[i]) return { r: Math.sign(A.n[i] - B.n[i]), at: i, text: FIELDS[i] + ' ' + A.n[i] + (A.n[i] > B.n[i] ? ' > ' : ' < ') + B.n[i] };
    if (A.pre === B.pre) return { r: 0, at: -1, text: 'the same version' };
    if (!A.pre) return { r: 1, at: 3, text: 'a release comes after its pre-release' };
    if (!B.pre) return { r: -1, at: 3, text: 'a pre-release comes before its release' };
    return { r: A.pre < B.pre ? -1 : 1, at: 3, text: 'pre-release ' + A.pre + (A.pre < B.pre ? ' < ' : ' > ') + B.pre };
  }
  Hyper.sim('ud-version-compare', {
    title: 'Is the offered version newer?',
    blurb: `A device runs one version and the server offers another. Four rules decide whether to **update**; only one of them is right for every pair. The wrong answers are marked.

**Try this**
- Running *1.9.0*, offered *1.10.0*: the text rule says the offered version is older. It is not.
- Running *1.99.0*, offered *1.100.0*, then *2.0.0*: the packed number puts 1.100.0 and 2.0.0 at the same value, so the major release is never seen as newer.
- Offer *2.0.0-rc.1* against *2.0.0*: a pre-release comes before its release; the other rules ignore the label.
- Look at the last rule: "different" is fine when the server names the version a device should run, and it steps back as readily as forward.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360, maxH: 520 });
      const opts = VERSIONS.map(s => [s, s]);
      const ctl = kit.controls(box.side, [
        { id: 'run', type: 'select', label: 'The device runs', options: opts, value: VERSIONS.includes(params.run) ? params.run : '1.9.0' },
        { id: 'off', type: 'select', label: 'The server offers', options: opts, value: VERSIONS.includes(params.off) ? params.off : '1.10.0' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['sem', 'Field by field'], ['txt', 'Text order'], ['pack', 'Packed number'], ['diff', 'Server names the version']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), S = kit.esym, W = st.W, M = 10;
        const run = ctl.values.run, off = ctl.values.off;
        const sem = semCmp(off, run), pr = parseV(run), po = parseV(off);
        const truth = sem.r > 0;
        const rules = [
          { name: 'Text order', detail: '"' + off + '" ' + (off > run ? '>' : '<=') + ' "' + run + '"', upd: off > run },
          { name: 'Packed number, two digits a field', detail: packedV(off) + (packedV(off) > packedV(run) ? ' > ' : packedV(off) === packedV(run) ? ' = ' : ' < ') + packedV(run), upd: packedV(off) > packedV(run) },
          { name: 'Field by field (the right rule)', detail: sem.text, upd: truth, right: true },
          { name: 'The server names the version: any difference', detail: off + (off !== run ? ' ≠ ' : ' = ') + run, upd: off !== run, policy: true }
        ];
        // the two versions as fields; the field that decides is lit
        const fw = W - 2 * M - 64;
        [['running', run, pr], ['offered', off, po]].forEach(([label, text, p], k) => {
          const y = 12 + k * 52;
          kit.label(c, label, M, y + 17, { size: 11, color: C.muted, baseline: 'middle' });
          const fields = [0, 1, 2].map(i => ({ label: FIELDS[i], value: String(p.n[i]), size: 1, color: sem.at === i ? 150 : 212 })).concat([{ label: 'pre', value: p.pre || '–', size: 1.3, color: sem.at === 3 ? 150 : 212 }]);
          S.frame(c, M + 64, y, fw, fields, { h: 36 });
        });
        let y = 124;
        const rh = clamp((st.H - y - 8) / 4, 44, 60);
        for (const r of rules) {
          const wrong = !r.right && !r.policy && r.upd !== truth;
          const tone = r.policy ? (r.upd && !truth ? 'warn' : 'ok') : wrong ? 'bad' : 'ok';
          rrect(c, M, y, W - 2 * M, rh - 6, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = r.right ? 2 : 1.2; c.strokeStyle = r.right ? C.ok : wrong ? C.bad : C.border2 || C.faint; c.stroke();
          kit.label(c, r.name, M + 10, y + 14, { size: 12, weight: 650, baseline: 'middle' });
          kit.label(c, r.detail, M + 10, y + rh - 20, { size: 11, color: C.muted, baseline: 'middle' });
          const verdict = (r.upd ? 'update' : 'keep') + (wrong ? ' · WRONG' : r.policy && r.upd && !truth ? ' · steps back' : '');
          kit.label(c, verdict, W - M - 10, y + 14, { size: 12, weight: 700, color: toneColor(C, tone), align: 'right', baseline: 'middle' });
          y += rh;
        }
        ro.set('sem', truth ? 'update' : 'keep');
        ro.set('txt', rules[0].upd ? 'update' : 'keep');
        ro.set('pack', rules[1].upd ? 'update' : 'keep');
        ro.set('diff', rules[3].upd ? 'update' : 'keep');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ud-production-line */
  Hyper.sim('ud-production-line', {
    title: 'A production line: load, flash, test, label',
    blurb: `Four stations in a row. Each one handles some **positions** at once, and takes a **cycle time** for each unit, so its capacity is positions × 3600 ÷ cycle time units an hour. The line can run only as fast as its **slowest station**, the bottleneck (in red). Flashing time is the wire time of the image on a UART, ten bits to a byte, plus four seconds to reset, synchronise and verify; esptool compresses the image, so real times are often shorter.

**Try this**
- Raise the programming speed to 921 600 baud: flashing gets quicker, but if the test is the bottleneck the line does not.
- Lengthen the test to 40 s, then add test positions until the bottleneck moves.
- Make the image 4 MB at 115 200 baud: now flashing is the problem, and extra flashing positions are the cure.
- Raise the share of failing units: good units an hour fall below the line speed.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const test = params.focus === 'test';
      const ctl = kit.controls(box.side, [
        { id: 'size', label: 'Program image', min: 0.5, max: 4, step: 0.1, value: 1.3, unit: 'MB' },
        { id: 'baud', type: 'select', label: 'Programming speed', options: [['115 200 baud', 115200], ['460 800 baud', 460800], ['921 600 baud', 921600], ['2 000 000 baud', 2000000]], value: test ? 921600 : 460800 },
        { id: 'pf', label: 'Flashing positions', min: 1, max: 12, step: 1, value: test ? 6 : 2 },
        { id: 'tt', label: 'Test time', min: 5, max: 60, step: 1, value: test ? 30 : 20, unit: 's' },
        { id: 'pt', label: 'Test positions', min: 1, max: 12, step: 1, value: 2 },
        { id: 'fail', label: 'Units failing the test', min: 0, max: 15, step: 1, value: test ? 6 : 3, unit: '%' }
      ], () => {});
      const ro = kit.readout(box.side, [['flash', 'Flashing, one unit'], ['rate', 'Line speed'], ['bn', 'Bottleneck'], ['good', 'Good units an hour'], ['batch', 'Time for 1000 good units']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), S = kit.esym, W = st.W, H = st.H, M = 10;
        const v = ctl.values;
        const flashT = 10 * v.size * 1e6 / v.baud + 4;      // ten bits a byte on the wire, and four seconds for reset, sync and verify
        const stations = [
          { name: 'Load', cyc: 6, p: 1, sub: 'by hand' },
          { name: 'Flash', cyc: flashT, p: v.pf, sub: 'and write data' },
          { name: 'Test', cyc: v.tt + 3, p: v.pt, sub: 'self-test' },
          { name: 'Label', cyc: 7, p: 1, sub: 'and pack' }
        ];
        stations.forEach(s => { s.rate = 3600 * s.p / s.cyc; });
        const line = Math.min(...stations.map(s => s.rate)), bn = stations.findIndex(s => s.rate === line);
        const goodRate = line * (1 - v.fail / 100);
        // the stations and the units flowing between them
        const gap = 22, bw = (W - 2 * M - 3 * gap) / 4, by = 14, bh = 60;
        stations.forEach((s, i) => {
          const x = M + i * (bw + gap);
          S.box(c, x, by, bw, bh, { label: s.name, sub: Math.round(s.cyc) + ' s × ' + s.p, color: i === bn ? C.bad : C.muted, active: i === bn, size: 12.5 });
          if (i < 3) {
            const x1 = x + bw, x2 = x + bw + gap, y = by + bh / 2;
            S.wire(c, [[x1, y], [x2, y]], { color: C.muted });
            // units move at a pace that follows the line speed
            const f = ((t * (0.3 + line / 900)) + i * 0.37) % 1;
            kit.dot(c, x1 + f * gap, y, 3.5, C.accent);
          }
          const idle = 100 * (1 - line / s.rate);
          kit.label(c, i === bn ? 'bottleneck' : 'idle ' + Math.round(idle) + ' %', x + bw / 2, by + bh + 12, { size: 10.5, color: i === bn ? C.bad : C.muted, align: 'center', baseline: 'middle', weight: i === bn ? 650 : 500 });
        });
        // the capacity of each station, with the line speed marked
        const cy0 = by + bh + 44, lx = M + 54, lw = W - lx - M - 62, maxR = Math.max(...stations.map(s => s.rate), 1);
        kit.label(c, 'capacity of each station, units an hour', M, cy0 - 10, { size: 11, color: C.muted, baseline: 'middle' });
        stations.forEach((s, i) => {
          const y = cy0 + 8 + i * 26;
          kit.label(c, s.name, M, y + 8, { size: 11.5, baseline: 'middle' });
          const w = lw * s.rate / maxR;
          c.fillStyle = i === bn ? C.bad : C.accent; c.globalAlpha = 0.75; c.fillRect(lx, y, Math.max(2, w), 16); c.globalAlpha = 1;
          kit.label(c, Math.round(s.rate) + ' / h', lx + lw + 6, y + 8, { size: 11, color: C.text2 || C.text, baseline: 'middle' });
        });
        const mx = lx + lw * line / maxR;
        c.save(); c.setLineDash([4, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(mx, cy0 + 2); c.lineTo(mx, cy0 + 12 + 4 * 26); c.stroke(); c.restore();
        kit.label(c, 'line speed', mx + 4, cy0 + 2, { size: 10.5, color: C.warn, baseline: 'middle' });
        const sy = cy0 + 20 + 4 * 26;
        wrap(c, 'The line makes ' + Math.round(line) + ' units an hour, set by the ' + stations[bn].name.toLowerCase() + ' station; ' + Math.round(goodRate) + ' of them are good. Speeding up any other station changes nothing.', W - 2 * M, 12, 600)
          .slice(0, 3).forEach((tx, i) => kit.label(c, tx, M, sy + i * 15, { size: 12, weight: 600, baseline: 'middle' }));
        ro.set('flash', kit.fmt(flashT, 3) + ' s');
        ro.set('rate', Math.round(line) + ' units / h');
        ro.set('bn', stations[bn].name);
        ro.set('good', Math.round(goodRate) + ' / h');
        ro.set('batch', goodRate > 0 ? kit.fmt(1000 / goodRate, 3) + ' h' : 'never');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ud-test-limits */
  // the normal distribution function, from a standard approximation of erf
  const erf = x => { const s = x < 0 ? -1 : 1; x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
  const Phi = z => 0.5 * (1 + erf(z / Math.SQRT2));
  Hyper.sim('ud-test-limits', {
    title: 'Test limits: false rejects and escapes',
    blurb: `Ten thousand units come off a line. Their **sleep current** varies from unit to unit (the blue curve); the specification says at most 15 µA. The test measures each unit with some **noise** (the dashed curve is what the jig sees) and passes it if the reading is below the **test limit**. Units out of specification are shaded red.

**Try this**
- Set the test limit to the specification (15 µA) with some noise: good units fail (false rejects) and bad ones slip through (escapes).
- Lower the limit to 13 µA, a **guard band** of 2 µA: escapes nearly vanish, at the cost of more false rejects.
- Reduce the noise to zero: the two errors disappear, at any limit equal to the specification.
- Widen the spread of the units: the same limit now lets out far more bad ones.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 360, maxH: 540 });
      const SPEC = 15, LO = 0, HI = 24, N = 10000;
      const ctl = kit.controls(box.side, [
        { id: 'mean', label: 'Typical sleep current of a unit', min: 6, max: 14, step: 0.1, value: 10, unit: 'µA' },
        { id: 'sd', label: 'Spread from unit to unit (σ)', min: 0.3, max: 3, step: 0.1, value: 1.5, unit: 'µA' },
        { id: 'noise', label: 'Measurement noise (σ)', min: 0, max: 3, step: 0.1, value: 0.8, unit: 'µA' },
        { id: 'limit', label: 'Test limit', min: 8, max: 22, step: 0.1, value: 15, unit: 'µA' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bad', 'Units out of specification'], ['pass', 'Units that pass the test'], ['fr', 'False rejects: good, failed'], ['esc', 'Escapes: bad, shipped'], ['guard', 'Guard band']]);
      const pdf = (x, m, s) => (s > 0 ? Math.exp(-0.5 * ((x - m) / s) ** 2) / (s * Math.sqrt(2 * Math.PI)) : 0);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const v = ctl.values, M = 12;
        // integrate over the true value of a unit
        const steps = 480, dx = (HI - LO) / steps;
        let bad = 0, esc = 0, fr = 0, pass = 0;
        for (let i = 0; i < steps; i++) {
          const x = LO + (i + 0.5) * dx, f = pdf(x, v.mean, v.sd) * dx;
          const pp = v.noise > 0 ? Phi((v.limit - x) / v.noise) : (x <= v.limit ? 1 : 0);
          pass += f * pp;
          if (x > SPEC) { bad += f; esc += f * pp; } else fr += f * (1 - pp);
        }
        // the chart
        const px = M + 8, pw = W - px - M, py = 16, ph = H * 0.5;
        const X = x => px + (x - LO) / (HI - LO) * pw;
        const sMeas = Math.sqrt(v.sd * v.sd + v.noise * v.noise);
        let top = 0;
        for (let x = LO; x <= HI; x += 0.1) top = Math.max(top, pdf(x, v.mean, v.sd), pdf(x, v.mean, sMeas));
        const Y = d => py + ph - (d / (top * 1.1)) * ph;
        // the true distribution, the part out of specification in red
        c.beginPath(); c.moveTo(X(LO), py + ph);
        for (let x = LO; x <= HI; x += 0.1) c.lineTo(X(x), Y(pdf(x, v.mean, v.sd)));
        c.lineTo(X(HI), py + ph); c.closePath(); c.fillStyle = kit.hue(212, 0.35); c.fill();
        c.beginPath(); c.moveTo(X(SPEC), py + ph);
        for (let x = SPEC; x <= HI; x += 0.1) c.lineTo(X(x), Y(pdf(x, v.mean, v.sd)));
        c.lineTo(X(HI), py + ph); c.closePath(); c.fillStyle = C.bad; c.globalAlpha = 0.55; c.fill(); c.globalAlpha = 1;
        // what the jig sees
        c.save(); c.setLineDash([5, 3]); c.strokeStyle = C.text2 || C.text; c.lineWidth = 1.6; c.beginPath();
        for (let x = LO; x <= HI; x += 0.1) { const yy = Y(pdf(x, v.mean, sMeas)); if (x === LO) c.moveTo(X(x), yy); else c.lineTo(X(x), yy); }
        c.stroke(); c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py + ph); c.lineTo(px + pw, py + ph); c.stroke();
        for (let x = 0; x <= HI; x += 4) { kit.label(c, String(x), X(x), py + ph + 11, { size: 10, color: C.faint, align: 'center', baseline: 'middle' }); }
        kit.label(c, 'sleep current, µA', px + pw, py + ph + 24, { size: 10.5, color: C.muted, align: 'right', baseline: 'middle' });
        // the two limits
        c.save(); c.lineWidth = 2; c.strokeStyle = C.bad; c.setLineDash([6, 3]); c.beginPath(); c.moveTo(X(SPEC), py); c.lineTo(X(SPEC), py + ph); c.stroke(); c.restore();
        c.save(); c.lineWidth = 2.4; c.strokeStyle = C.ok; c.beginPath(); c.moveTo(X(v.limit), py - 4); c.lineTo(X(v.limit), py + ph); c.stroke(); c.restore();
        const left = v.limit < SPEC;
        kit.label(c, 'spec ' + SPEC, X(SPEC) + (left ? 5 : -5), py + 8, { size: 10.5, color: C.bad, align: left ? 'left' : 'right', baseline: 'middle', weight: 650 });
        const limLeft = left || X(v.limit) + 100 > W;
        kit.label(c, 'test limit ' + v.limit.toFixed(1), X(v.limit) + (limLeft ? -5 : 5), py + 22, { size: 10.5, color: C.ok, align: limLeft ? 'right' : 'left', baseline: 'middle', weight: 650 });
        // the 10 000 units split four ways
        const gy = py + ph + 44, gw = W - 2 * M;
        const parts = [['good, pass', N * (1 - bad - fr), C.ok], ['good, failed', N * fr, C.warn], ['bad, caught', N * (bad - esc), kit.hue(212)], ['bad, SHIPPED', N * esc, C.bad]];
        kit.label(c, 'what happens to 10 000 units', M, gy - 8, { size: 11, color: C.muted, baseline: 'middle' });
        let gx = M;
        parts.forEach(([name, n, colr]) => { const w = gw * n / N; if (w > 0) { c.fillStyle = colr; c.globalAlpha = 0.85; c.fillRect(gx, gy, Math.max(w, n > 0.5 ? 2 : 0), 18); c.globalAlpha = 1; } gx += w; });
        let lx = M, ly = gy + 34;
        parts.forEach(([name, n, colr]) => {
          const label = name + ' ' + Math.round(n), tw = label.length * 6.1 + 22;
          if (lx + tw > W - M && lx > M) { lx = M; ly += 15; }
          kit.dot(c, lx + 5, ly, 4.5, colr);
          kit.label(c, label, lx + 14, ly, { size: 10.5, color: C.text2 || C.text, baseline: 'middle' });
          lx += tw + 6;
        });
        ro.set('bad', Math.round(N * bad) + ' of 10 000');
        ro.set('pass', Math.round(N * pass) + ' of 10 000');
        ro.set('fr', Math.round(N * fr) + ' of 10 000');
        ro.set('esc', Math.round(N * esc) + ' of 10 000');
        ro.set('guard', kit.fmt(SPEC - v.limit, 2) + ' µA');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ud-certificate-cover */
  Hyper.sim('ud-certificate-cover', {
    title: 'What the module\'s certificate covers',
    blurb: `A product is built around a certified radio module. Change the choices and see which duties are **covered** by the module's approval (green), which are **still the product's** (amber), and where the **cover is lost** (red). A picture of the principle, not legal advice: the real rules depend on the module, the regions and the product.

**Try this**
- Start with the module's own antenna as tested: only the radio is covered; everything else is amber.
- Choose an antenna the approval does not list, or tick off the placement: the radio items turn red.
- Make the product hand-held or worn, or give it mains wiring, and watch the amber items grow heavier.
- Untick *sold to others*: formal approvals are not needed for a one-off, though the rules on band and power still bind you.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 560, maxH: 760 });
      const ctl = kit.controls(box.side, [
        { id: 'sold', type: 'check', label: 'The product is sold or installed for others', value: true },
        { id: 'antenna', type: 'select', label: 'Antenna', options: [['The module\'s own antenna, as tested', 'own'], ['An external antenna the approval lists', 'listed'], ['An antenna the approval does not list', 'other']], value: 'own' },
        { id: 'place', type: 'check', label: 'Placement and keep-out as in the datasheet', value: true },
        { id: 'mod', type: 'select', label: 'The module', options: [['As sold', 'asis'], ['Modified: shield removed or parts changed', 'modified']], value: 'asis' },
        { id: 'power', type: 'select', label: 'Power', options: [['A lithium cell', 'cell'], ['A plug-in mains adapter', 'adapter'], ['Mains wiring inside the product', 'mains']], value: 'cell' },
        { id: 'use', type: 'select', label: 'Use', options: [['On a shelf or wall, away from the body', 'fixed'], ['Hand-held or worn', 'worn']], value: 'fixed' },
        { id: 'names', type: 'check', label: 'Uses the Bluetooth, Wi-Fi or Matter name', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['radio', 'The radio cover'], ['own', 'Still the product\'s own'], ['lost', 'Cover lost']]);
      function items(v) {
        const radioOK = v.antenna !== 'other' && v.place && v.mod === 'asis';
        const out = [];
        const radioWhy = v.antenna === 'other' ? 'the antenna is not on the approval' : !v.place ? 'the placement is not as tested' : 'the module was changed';
        out.push({ t: 'The radio and its spectrum tests', d: radioOK ? 'Covered by the module\'s tests and approvals, used as tested.' : 'Cover lost: ' + radioWhy + ', so the radio of this product must be assessed again.', tone: radioOK ? 'ok' : 'bad' });
        out.push({ t: 'The antenna and where it sits', d: v.antenna === 'own' && v.place ? 'The antenna and keep-out are as in the module\'s approval.' : v.antenna === 'listed' && v.place ? 'An antenna the approval lists, fitted as its notes say: still covered.' : v.antenna === 'other' ? 'More gain raises the radiated power, and the pattern is untested: not covered.' : 'A PCB antenna beside metal or a battery has another pattern and tuning: not covered.', tone: (v.antenna === 'other' || !v.place) ? 'bad' : 'ok' });
        out.push({ t: 'Radio exposure of people', d: v.use === 'worn' ? 'The module\'s assessment assumes a distance from the body. Worn or hand-held use needs its own assessment.' : radioOK ? 'Covered at the distance the module was assessed for.' : 'Depends on the radio, which must be assessed again.', tone: v.use === 'worn' ? 'warn' : radioOK ? 'ok' : 'bad' });
        out.push({ t: 'Noise from the product\'s own electronics (EMC)', d: 'Regulators, displays and motor drivers radiate too. The finished product is tested as a whole: it is not part of the module\'s approval.', tone: 'warn' });
        out.push({ t: 'Electrical safety and the power source', d: v.power === 'mains' ? 'The heavy job: mains wiring needs the safety standards, isolation, an enclosure, and a specialist and a lab.' : v.power === 'adapter' ? 'A certified mains adapter keeps mains out of your product, which leaves far less to assess.' : 'A lithium cell needs a protection circuit and a charger IC, and its transport has rules (UN 38.3, watt-hour limits).', tone: 'warn' });
        out.push({ t: 'Labels, RoHS, WEEE, battery and packaging rules', d: 'The marks, the "contains" label, the recycling mark and registration, and the substance rules belong to the product.', tone: 'warn' });
        out.push({ t: 'Cybersecurity of connected radio equipment (EU)', d: 'Applied since August 2025 in the EU: an update path, no default passwords, protected interfaces. It is the product\'s software, not the module\'s.', tone: 'warn' });
        out.push({ t: 'Using the names: Bluetooth, Wi-Fi, Matter', d: v.names ? 'A programme of its own for each: a Bluetooth listing (a qualified module\'s listing helps), Wi-Fi Alliance and Matter certification.' : 'Not used, so nothing to do.', tone: v.names ? 'warn' : 'dim' });
        return { list: out, radioOK, sold: v.sold };
      }
      const label = { ok: 'covered', warn: 'yours', bad: 'cover lost', dim: 'not needed' };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const R = items(ctl.values);
        const list = R.sold ? R.list : R.list.map(o => ({ t: o.t, d: 'Not placed on the market, so no formal approval is needed. The rules on bands and transmit power still bind you.', tone: 'dim' }));
        let size = 10.5, rows = list.map(o => ({ o, lines: wrap(c, o.d, W - 2 * M - 26, size) }));
        const heights = r => r.map(x => 22 + x.lines.length * (size + 2.5) + 8);
        const total = () => heights(rows).reduce((a, b) => a + b, 0) + (rows.length - 1) * 5;
        if (total() > H - 8) { size = 9.5; rows = list.map(o => ({ o, lines: wrap(c, o.d, W - 2 * M - 26, size) })); }
        let y = 6;
        heights(rows).forEach((h, i) => {
          const r = rows[i], tone = r.o.tone, col = toneColor(C, tone);
          rrect(c, M, y, W - 2 * M, h, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 1.2; c.strokeStyle = C.border2 || C.faint; c.stroke();
          c.fillStyle = col; c.fillRect(M, y + 4, 4, h - 8);
          kit.label(c, r.o.t, M + 14, y + 13, { size: 11.5, weight: 650, baseline: 'middle' });
          kit.label(c, label[tone], W - M - 10, y + 13, { size: 11, weight: 700, color: col, align: 'right', baseline: 'middle' });
          r.lines.forEach((t, k) => kit.label(c, t, M + 14, y + 28 + k * (size + 2.5), { size, color: C.text2 || C.text, baseline: 'middle' }));
          y += h + 5;
        });
        const own = list.filter(o => o.tone === 'warn').length, lost = list.filter(o => o.tone === 'bad').length;
        ro.set('radio', !R.sold ? 'not needed for a one-off' : R.radioOK ? 'kept: used as tested' : 'lost');
        ro.set('own', R.sold ? own + ' of 8 duties' : 'none formally');
        ro.set('lost', R.sold ? String(lost) : '0');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ud-licence-mix */
  const PARTS = [
    { id: 'idf', name: 'ESP-IDF', lic: 'Apache-2.0', fam: 'perm', on: true },
    { id: 'core', name: 'Arduino core for the ESP32', lic: 'LGPL-2.1', fam: 'weak', on: true },
    { id: 'mpy', name: 'MicroPython', lic: 'MIT', fam: 'perm', on: false },
    { id: 'json', name: 'a JSON library', lic: 'MIT', fam: 'perm', on: true },
    { id: 'gpl', name: 'a library under the GPL', lic: 'GPL-3.0', fam: 'strong', on: false }
  ];
  const FAM = { perm: ['permissive', 'ok'], weak: ['weak copyleft', 'warn'], strong: ['strong copyleft', 'bad'] };
  Hyper.sim('ud-licence-mix', {
    title: 'What the licences of a firmware ask',
    blurb: `Tick the components that go into the firmware image and whether you **give or sell it to others**. The duties that fall due are listed, and the last box says whether your own code can stay closed. An outline of the usual positions at the time of writing; it is **not legal advice**, and the real answer depends on the exact licences and on how the parts are combined.

**Try this**
- Start as it is: ESP-IDF, the Arduino core and a JSON library. Notices are due, and the LGPL core raises the question of replacing the library.
- Add *a library under the GPL*: the verdict turns red, because the GPL covers the combined firmware, your own code included.
- Untick *you give or sell it to others*: most duties fall away, since they begin when you hand something over.
- Pick MicroPython alone: only notices.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 520, maxH: 700 });
      const defs = PARTS.map(p => ({ id: p.id, type: 'check', label: p.name + ' (' + p.lic + ')', value: p.on })).concat([{ id: 'dist', type: 'check', label: 'You give or sell the firmware to others', value: true }]);
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Components'], ['due', 'Duties due'], ['closed', 'Your code can stay closed']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values;
        const on = PARTS.filter(p => v[p.id]), dist = v.dist;
        const has = f => on.some(p => p.fam === f);
        // the component chips
        let x = M, y = 8;
        kit.label(c, 'in the firmware image', M, y + 4, { size: 11, color: C.muted, baseline: 'middle' });
        y += 18;
        for (const p of PARTS) {
          const label = p.name + ' · ' + p.lic, w = label.length * 6 + 18;
          if (x + w > W - M && x > M) { x = M; y += 28; }
          const sel = !!v[p.id], col = toneColor(C, FAM[p.fam][1]);
          rrect(c, x, y, w, 22, 11); c.fillStyle = sel ? C.surface : 'transparent'; c.fill();
          c.lineWidth = sel ? 2 : 1; c.strokeStyle = sel ? col : C.faint; c.globalAlpha = sel ? 1 : 0.5; c.stroke(); c.globalAlpha = 1;
          kit.label(c, label, x + 9, y + 11, { size: 10.5, color: sel ? C.text : C.faint, baseline: 'middle', weight: sel ? 600 : 500 });
          x += w + 6;
        }
        y += 34;
        // the image they make
        const strongest = has('strong') ? 'strong' : has('weak') ? 'weak' : on.length ? 'perm' : null;
        const fc = strongest ? toneColor(C, FAM[strongest][1]) : C.faint;
        rrect(c, M, y, W - 2 * M, 38, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2.2; c.strokeStyle = fc; c.stroke();
        kit.label(c, 'Your firmware image = your own code + the parts above', M + 10, y + 14, { size: 12, weight: 650, baseline: 'middle' });
        kit.label(c, strongest ? 'the strictest licence in it: ' + FAM[strongest][0] : 'nothing selected', M + 10, y + 29, { size: 10.5, color: fc, baseline: 'middle' });
        y += 52;
        // the duties
        const duties = [
          ['Keep the copyright notices and licence texts, and ship a notices page', on.length > 0 && dist],
          ['Mark the Apache-2.0 files you changed', v.idf && dist],
          ['Let users replace the LGPL library: the means to relink', v.core && dist],
          ['Offer the complete source of the whole firmware under the GPL', v.gpl && dist],
          ['Let owners of consumer devices install modified firmware (GPL-3.0)', v.gpl && dist],
          ['Keep a list of components and licences (good practice, and asked for by EU rules)', on.length > 0]
        ];
        kit.label(c, 'duties that fall due', M, y, { size: 11, color: C.muted, baseline: 'middle' });
        y += 14;
        let due = 0;
        for (const [text, d] of duties) {
          const lines = wrap(c, text, W - 2 * M - 70, 11), h = 8 + lines.length * 14;
          rrect(c, M, y, W - 2 * M, h, 6); c.fillStyle = C.surface; c.fill(); c.lineWidth = 1; c.strokeStyle = d ? C.warn : C.border2 || C.faint; c.stroke();
          lines.forEach((t, i) => kit.label(c, t, M + 10, y + 11 + i * 14, { size: 11, color: d ? C.text : C.faint, baseline: 'middle' }));
          kit.label(c, d ? 'due' : 'not due', W - M - 10, y + h / 2, { size: 11, weight: 700, color: d ? C.warn : C.faint, align: 'right', baseline: 'middle' });
          if (d) due++;
          y += h + 5;
        }
        y += 4;
        // the verdict
        let head, text, tone, closed;
        if (!on.length) { head = 'Nothing selected'; text = 'Pick the components that go into the image.'; tone = 'dim'; closed = '–'; }
        else if (!dist) { head = 'Not handing it over'; text = 'Most duties begin when you give or sell the device or the image to someone else. Keep the list of components anyway.'; tone = 'ok'; closed = 'yes, while it stays with you'; }
        else if (has('strong')) { head = 'Your own code cannot stay closed'; text = 'The GPL covers the combined firmware: the source of the whole image, your own code included, must be offered under the GPL.'; tone = 'bad'; closed = 'no'; }
        else if (has('weak')) { head = 'It can stay closed, with a condition'; text = 'The LGPL part must stay replaceable by the user. How to meet that in one firmware image is a question for a specialist.'; tone = 'warn'; closed = 'yes, if the LGPL part stays replaceable'; }
        else { head = 'Your own code can stay closed'; text = 'Permissive licences ask for notices and licence texts, and nothing more about your source.'; tone = 'ok'; closed = 'yes'; }
        const lines = wrap(c, text, W - 2 * M - 20, 11.5), vh = 26 + lines.length * 14, vy = Math.min(y, H - vh - 6);
        rrect(c, M, vy, W - 2 * M, vh, 8); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = toneColor(C, tone); c.stroke();
        kit.label(c, head, M + 10, vy + 14, { size: 13, weight: 700, color: toneColor(C, tone), baseline: 'middle' });
        lines.forEach((t, i) => kit.label(c, t, M + 10, vy + 31 + i * 14, { size: 11.5, color: C.text2 || C.text, baseline: 'middle' }));
        ro.set('n', String(on.length));
        ro.set('due', String(due));
        ro.set('closed', closed);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ud-heartbeat */
  Hyper.sim('ud-heartbeat', {
    title: 'Heartbeats, lost messages and the alarm',
    blurb: `A device sends a **heartbeat** every interval; some are lost on the way. The server keeps the **age of the last heartbeat** (the saw-tooth) and raises an alarm when it passes the **threshold** of k missed beats (the dashed line). Alarms in red. Early alarms, while the device is fine, are **false alarms**. The strip on top shows each beat: green arrived, hollow lost.

**Try this**
- Set k to 1 with 12 % loss: the saw-tooth crosses the line again and again, all false alarms.
- Raise k to 3 or 4: false alarms vanish, but the real failure is noticed later.
- Raise the loss to 30 %: even k = 3 misfires now and then. Read the expected false alarms a day.
- Move the failure out to *never* to see a run with no real fault.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380, maxH: 560 });
      const N = 60;
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Heartbeat interval', min: 10, max: 300, step: 5, value: 60, unit: 's' },
        { id: 'k', label: 'Missed beats that raise an alarm', min: 1, max: 8, step: 1, value: 3 },
        { id: 'loss', label: 'Messages lost on the way', min: 0, max: 40, step: 1, value: 12, unit: '%' },
        { id: 'die', label: 'The device fails after beat', min: 10, max: 60, step: 1, value: 36, fmt: val => (val >= 60 ? 'never' : String(Math.round(val))) }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['thr', 'Alarm threshold'], ['fa', 'False alarms in this run'], ['day', 'Expected false alarms a day'], ['det', 'The failure is noticed']]);
      const rnd = mulberry(88), u = [0];
      for (let i = 1; i <= N; i++) u.push(rnd());
      const fmtDur = s => (s < 120 ? Math.round(s) + ' s' : s < 7200 ? kit.fmt(s / 60, 3) + ' min' : kit.fmt(s / 3600, 3) + ' h');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const T = v.T, k = Math.round(v.k), loss = v.loss / 100, die = Math.round(v.die), never = die >= 60;
        const tEnd = N * T, dieT = never ? Infinity : die * T, thr = k * T;
        // which beats arrive
        const recv = [0], state = [];
        for (let i = 1; i <= N; i++) {
          const alive = never || i <= die, ok = alive && u[i] >= loss;
          state.push(!alive ? 'none' : ok ? 'ok' : 'lost');
          if (ok) recv.push(i * T);
        }
        // the alarms: a gap between two received beats longer than the threshold
        const alarms = [];
        for (let i = 0; i < recv.length; i++) {
          const a = recv[i], b = i + 1 < recv.length ? recv[i + 1] : tEnd;
          if (b - a > thr + 1e-9) alarms.push({ s: a + thr, e: b, last: i + 1 >= recv.length });
        }
        const isFalse = al => (never ? true : !(al.last));
        const falseCount = alarms.filter(isFalse).length;
        const det = never ? null : alarms.find(al => al.last);
        // the strip of beats
        const px = M, pw = W - 2 * M, sw = pw / N;
        kit.label(c, 'each beat: green arrived, hollow lost, grey after the failure', M, 10, { size: 10.5, color: C.muted, baseline: 'middle' });
        state.forEach((s, i) => {
          const bx = px + i * sw + 0.5, bw = Math.max(1.5, sw - 1.5);
          if (s === 'ok') { c.fillStyle = C.ok; c.fillRect(bx, 20, bw, 14); }
          else if (s === 'lost') { c.strokeStyle = C.bad; c.lineWidth = 1.4; c.strokeRect(bx, 20.5, bw, 13); }
          else { c.fillStyle = C.faint; c.globalAlpha = 0.3; c.fillRect(bx, 20, bw, 14); c.globalAlpha = 1; }
        });
        // the age of the last heartbeat
        const cx = M + 34, cw = W - cx - M, cy = 56, ch = H * 0.44;
        const X = t => cx + (t / tEnd) * cw;
        let maxAge = thr * 1.4, j = 0;
        const age = [];
        for (let i = 0; i <= cw; i += 2) {
          const t = i / cw * tEnd;
          while (j + 1 < recv.length && recv[j + 1] <= t) j++;
          const a = t - recv[j]; age.push([i, a]); if (a > maxAge) maxAge = a;
        }
        const Y = a => cy + ch - (a / (maxAge * 1.08)) * ch;
        for (const al of alarms) {
          c.fillStyle = C.bad; c.globalAlpha = 0.22; c.fillRect(X(al.s), cy, Math.max(1, X(al.e) - X(al.s)), ch); c.globalAlpha = 1;
        }
        c.beginPath(); age.forEach(([i, a], n) => { const px2 = cx + i, py2 = Y(a); if (n) c.lineTo(px2, py2); else c.moveTo(px2, py2); });
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.stroke();
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.beginPath(); c.moveTo(cx, Y(thr)); c.lineTo(cx + cw, Y(thr)); c.stroke(); c.restore();
        kit.label(c, 'alarm at ' + k + ' × ' + T + ' s = ' + fmtDur(thr), cx + cw - 2, Y(thr) - 8, { size: 10.5, color: C.warn, align: 'right', baseline: 'middle', weight: 650 });
        if (!never) {
          c.save(); c.strokeStyle = C.bad; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(dieT), cy); c.lineTo(X(dieT), cy + ch); c.stroke(); c.restore();
          kit.label(c, 'device fails', X(dieT) - 4, cy + 8, { size: 10.5, color: C.bad, align: 'right', baseline: 'middle', weight: 650 });
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, cy + ch); c.lineTo(cx + cw, cy + ch); c.stroke();
        kit.label(c, 'age of last beat', cx, cy - 8, { size: 10.5, color: C.muted, baseline: 'middle' });
        for (const f of [0.5, 1]) kit.label(c, fmtDur(maxAge * 1.08 * f), cx - 4, Y(maxAge * 1.08 * f) + (f === 1 ? 6 : 0), { size: 9.5, color: C.faint, align: 'right', baseline: 'middle' });
        for (let b = 10; b <= N; b += 10) kit.label(c, b + '', X(b * T), cy + ch + 11, { size: 9.5, color: C.faint, align: 'center', baseline: 'middle' });
        kit.label(c, 'beats since start (' + fmtDur(tEnd) + ' in all)', cx + cw, cy + ch + 25, { size: 10.5, color: C.muted, align: 'right', baseline: 'middle' });
        // what it comes to
        const perDay = 86400 / T * Math.pow(loss, k);
        let detText;
        if (never) detText = 'No real failure in this run: every alarm is false.';
        else if (!det) detText = 'The failure is not noticed within this window: the threshold is too long.';
        else if (det.s <= dieT) detText = 'An alarm was already running when the device failed: noticed at once.';
        else detText = 'The failure is noticed ' + fmtDur(det.s - dieT) + ' after it happens.';
        const ty = cy + ch + 44;
        wrap(c, falseCount + ' false alarm' + (falseCount === 1 ? '' : 's') + ' in this run; about ' + kit.fmt(perDay, 2) + ' a day expected. ' + detText, W - 2 * M, 12, 600)
          .slice(0, 3).forEach((t, i) => kit.label(c, t, M, ty + i * 15, { size: 12, weight: 600, baseline: 'middle' }));
        ro.set('thr', k + ' × ' + T + ' s = ' + fmtDur(thr));
        ro.set('fa', String(falseCount));
        ro.set('day', kit.fmt(perDay, 2) + ' a day');
        ro.set('det', never ? 'no failure' : !det ? 'not within the window' : det.s <= dieT ? 'at once' : 'after ' + fmtDur(det.s - dieT));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
