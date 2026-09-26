/* HYPER-MEDICINE · sims/first-aid.js — simulations for the first-aid topic:
 * a CPR rhythm trainer, the chain of survival against time, the rule of nines on a body
 * outline (with the Parkland estimate), blood loss and the body's response, body
 * temperature from hypothermia to heatstroke, and a choking decision flow.
 * Every figure here is approximate and schematic; the pages give the sources. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // piecewise-linear interpolation in a table of [x, y] points (x increasing)
  function interp(pts, x) {
    if (x <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (x <= pts[i][0]) {
        const x0 = pts[i - 1][0], y0 = pts[i - 1][1], x1 = pts[i][0], y1 = pts[i][1];
        return y0 + (y1 - y0) * (x - x0) / ((x1 - x0) || 1);
      }
    }
    return pts[pts.length - 1][1];
  }
  const clock = () => ((typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now()) / 1000;
  const grp = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const r1 = x => (Math.round(x * 10) / 10).toFixed(1);
  const pctText = p => Number.isInteger(p) ? String(p) : Number.isInteger(p * 2) ? p.toFixed(1) : p.toFixed(2);

  // text wrapped to a width on the canvas; returns the y below the last line
  function wrap(c, text, x, y, maxW, lh, font, color, draw) {
    c.save();
    c.font = font; c.fillStyle = color; c.textAlign = 'left'; c.textBaseline = 'top';
    const words = String(text).split(/\s+/).filter(Boolean);
    let line = '';
    for (const w of words) {
      const test = line ? line + ' ' + w : w;
      if (line && c.measureText(test).width > maxW) { if (draw !== false) c.fillText(line, x, y); y += lh; line = w; }
      else line = test;
    }
    if (line) { if (draw !== false) c.fillText(line, x, y); y += lh; }
    c.restore();
    return y;
  }
  function rrect(c, x, y, w, h, r) {
    w = Math.max(0, w); h = Math.max(0, h); r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h);
  }
  const FONT = (size, weight) => (weight || 500) + ' ' + size + 'px system-ui, sans-serif';

  /* ================================================================ CPR rhythm trainer */
  Hyper.sim('fa-cpr-trainer', {
    title: 'CPR rhythm trainer',
    blurb: `Push in time: click or tap the picture for every chest compression — or click it once and then use the **space bar**. The dial shows your rate against the target of **100–120 per minute** set by the European and American resuscitation guidelines.

- Turn on the **metronome** and let your hands follow it; then switch it off and see whether you keep the tempo.
- Try **30 : 2**: after 30 compressions give two breaths (here: just pause) and get back on the chest within 10 seconds — the read-out times the pause.
- Keep going for two minutes. Most people drift as they tire, which is why rescuers are told to swap every two minutes.
- A screen trains the rhythm only. Depth (5–6 cm in an adult) and letting the chest rise fully need a manikin — learn them on a course.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Compressions only (hands-only CPR)', 'hands'], ['30 compressions : 2 breaths', '30:2']], value: (params && params.mode) || 'hands' },
        { id: 'metro', type: 'check', label: 'Metronome (flashing beat)', value: true },
        { id: 'sound', type: 'check', label: 'Metronome sound', value: false },
        { id: 'tempo', label: 'Metronome tempo', min: 80, max: 140, step: 1, value: 110, unit: '/min' },
        { id: 'demo', type: 'check', label: 'Demo: compress for me', value: false },
        { type: 'buttons', items: [{ id: 'push', label: 'Compress', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], (id, v) => {
        if (id === 'push') press();
        else if (id === 'reset' || id === 'mode') reset();
        else if (id === 'sound' && v) audioInit();
        else if (id === 'demo') demoNext = 0;
      });
      const ro = kit.readout(box.side, [['rate', 'Rate now'], ['avg', 'Average rate'], ['band', 'Pushes in the 100–120 band'], ['n', 'Compressions'], ['pause', 'Longest pause'], ['ccf', 'Hands-on time']]);
      const V = ctl.values;
      let presses, count, cycleCount, cycles, inBand, judged, longest, handsOff, first, last, runTime, runN, lastPause, skipped;
      let nextBeat = null, flash = 0, audio = null, demoNext = 0, focused = false;
      function reset() {
        presses = []; count = 0; cycleCount = 0; cycles = 0; inBand = 0; judged = 0; longest = 0; handsOff = 0;
        first = null; last = null; runTime = 0; runN = 0; lastPause = null; skipped = false;
      }
      reset();
      const GAP = 1.5;                                   // a gap longer than this counts as a pause
      function press() {
        const t = clock();
        if (last != null) {
          const gap = t - last;
          if (gap < 0.12) return;                        // a bounce, not a compression
          if (gap > GAP) {
            handsOff += gap - 0.55; longest = Math.max(longest, gap); lastPause = gap;
          } else { runTime += gap; runN++; }
        } else first = t;
        if (V.mode === '30:2' && cycleCount >= 30) {
          skipped = last != null && t - last <= GAP;    // went on without the breaths
          cycleCount = 0; cycles++;
        }
        presses.push(t); last = t; count++; cycleCount++;
        if (presses.length > 60) presses.splice(0, presses.length - 60);
        const r = rateNow(t);
        if (r) { judged++; if (r >= 100 && r <= 120) inBand++; }
      }
      // the rate over the last few compressions of the current run (no pause in between)
      function rateNow(t) {
        if (last == null || t - last > GAP) return null;
        const run = [];
        for (let i = presses.length - 1; i >= 0 && run.length < 6; i--) {
          if (run.length && run[0] - presses[i] > GAP) break;
          run.unshift(presses[i]);
        }
        if (run.length < 3) return null;
        const span = run[run.length - 1] - run[0];
        return span > 0.1 ? 60 * (run.length - 1) / span : null;
      }
      function audioInit() {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC && !audio) audio = new AC();
          if (audio && audio.resume) audio.resume();
        } catch (e) { audio = null; }
      }
      function tick() {
        if (!audio || !V.sound) return;
        try {
          const o = audio.createOscillator(), g = audio.createGain(), t0 = audio.currentTime;
          o.frequency.value = 1050;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.004);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.06);
          o.connect(g); g.connect(audio.destination); o.start(t0); o.stop(t0 + 0.07);
        } catch (e) { /* no sound */ }
      }
      // the canvas takes clicks, taps and (once focused) key presses
      const cv = st.canvas;
      try { cv.tabIndex = 0; if (cv.style) cv.style.touchAction = 'manipulation'; } catch (e) { /* ignore */ }
      cv.addEventListener('pointerdown', e => { press(); try { cv.focus(); } catch (x) { /* ignore */ } if (e && e.preventDefault) e.preventDefault(); });
      cv.addEventListener('keydown', e => {
        if (!e || e.key === 'Tab' || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter' || /^[a-z0-9]$/i.test(e.key || '')) {
          if (e.preventDefault) e.preventDefault();
          if (!e.repeat) press();
        }
      });
      cv.addEventListener('focus', () => { focused = true; });
      cv.addEventListener('blur', () => { focused = false; });

      function draw(dt) {
        const t = clock();
        const period = 60 / V.tempo;
        if (nextBeat == null || nextBeat < t - 1) nextBeat = t + period;
        while (t >= nextBeat) { nextBeat += period; flash = 0.12; if (V.metro || V.sound) tick(); }
        flash = Math.max(0, flash - (dt || 0));
        if (V.demo) {
          if (!demoNext || demoNext < t - 2) demoNext = t;
          if (t >= demoNext) {
            press();
            demoNext += period;
            if (V.mode === '30:2' && cycleCount >= 30) demoNext += 5;   // two breaths, about 5 s
          }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = rateNow(t), paused = last != null && t - last > GAP;
        // ---- the manikin, side view
        const lw = W * 0.47, cy = Hh * 0.66, th = Math.min(Hh * 0.2, lw * 0.26), cm = th / 22;
        const tx0 = lw * 0.3, tx1 = lw * 0.92, hx = tx0 - th * 0.6;
        const since = last == null ? 9 : t - last;
        const depth = since < 0.12 ? 5.5 * since / 0.12 : since < 0.4 ? 5.5 * (1 - (since - 0.12) / 0.28) : 0;
        const top = cy - th / 2;
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        c.beginPath(); c.arc(hx, cy - th * 0.05, th * 0.42, 0, Math.PI * 2); c.fill(); c.stroke();
        const px = (tx0 + tx1) / 2 - (tx1 - tx0) * 0.12;             // hands: centre of the chest
        c.beginPath();
        c.moveTo(tx0, cy + th / 2); c.lineTo(tx0, top + th * 0.15);
        c.quadraticCurveTo(tx0 + 4, top, tx0 + th * 0.4, top);
        c.lineTo(px - th * 0.8, top);
        c.quadraticCurveTo(px, top + depth * cm * 2, px + th * 0.8, top);
        c.lineTo(tx1, top + th * 0.08); c.lineTo(tx1, cy + th / 2); c.closePath();
        c.fill(); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(tx0 - th, cy + th / 2 + 1); c.lineTo(tx1 + 10, cy + th / 2 + 1); c.stroke();
        // hands and straight arms, shoulders above the hands
        const hy = top + depth * cm;
        c.fillStyle = kit.hue(28, 0.9);
        rrect(c, px - th * 0.28, hy - th * 0.2, th * 0.56, th * 0.18, 4); c.fill();
        rrect(c, px - th * 0.24, hy - th * 0.36, th * 0.48, th * 0.16, 4); c.fill();
        c.strokeStyle = kit.hue(28, 0.9); c.lineWidth = Math.max(4, th * 0.14); c.lineCap = 'round';
        c.beginPath(); c.moveTo(px, hy - th * 0.36); c.lineTo(px, Math.max(8, hy - th * 1.9)); c.stroke();
        c.lineCap = 'butt';
        kit.label(c, W < 520 ? 'straight arms' : 'straight arms, shoulders over the hands', px, Math.max(12, hy - th * 1.9 - 2), { size: 11, color: C.muted, align: 'center', baseline: 'bottom' });
        // depth ruler
        const rx = tx1 + 14;
        c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(rx, top); c.lineTo(rx, top + 7 * cm); c.stroke();
        c.fillStyle = C.ok; c.globalAlpha = 0.35; c.fillRect(rx - 5, top + 5 * cm, 10, cm); c.globalAlpha = 1;
        for (let k = 0; k <= 7; k++) { c.beginPath(); c.moveTo(rx - (k % 5 ? 3 : 5), top + k * cm); c.lineTo(rx + 3, top + k * cm); c.stroke(); }
        kit.dot(c, rx, top + depth * cm, 3.5, C.accent);
        kit.label(c, '5–6 cm', rx + 8, top + 5.5 * cm, { size: 10.5, color: C.ok });
        kit.label(c, depth > 0.2 ? 'down' : last != null ? 'full recoil' : '', rx + 8, top + 1 * cm, { size: 10.5, color: C.muted });
        kit.label(c, W < 520 ? 'depth: picture only' : 'target depth — picture only: a screen cannot feel it', lw * 0.06, cy + th / 2 + 18, { size: 10.5, color: C.muted });
        // ---- the rate dial
        const gx = lw + (W - lw) / 2, gr = Math.min((W - lw) * 0.36, Hh * 0.3), gy = gr + 26;
        const ang = v => Math.PI + (clamp(v, 60, 160) - 60) / 100 * Math.PI;
        c.lineWidth = Math.max(8, gr * 0.14);
        c.strokeStyle = C.grid; c.beginPath(); c.arc(gx, gy, gr, Math.PI, 2 * Math.PI); c.stroke();
        c.strokeStyle = C.ok; c.beginPath(); c.arc(gx, gy, gr, ang(100), ang(120)); c.stroke();
        c.lineWidth = 1;
        for (let v = 60; v <= 160; v += 20) {
          const a = ang(v);
          kit.label(c, String(v), gx + Math.cos(a) * (gr + 14), gy + Math.sin(a) * (gr + 14), { size: 10, color: C.muted, align: 'center' });
        }
        if (r) {
          const a = ang(r);
          c.strokeStyle = r >= 100 && r <= 120 ? C.ok : C.warn; c.lineWidth = 3;
          c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + Math.cos(a) * gr * 0.9, gy + Math.sin(a) * gr * 0.9); c.stroke(); c.lineWidth = 1;
        }
        kit.dot(c, gx, gy, 4, C.text);
        kit.label(c, r ? String(Math.round(r)) : '—', gx, gy - gr * 0.38, { size: 22, weight: 700, align: 'center' });
        kit.label(c, 'compressions per minute', gx, gy + 14, { size: 11, color: C.muted, align: 'center' });
        if (V.metro) kit.dot(c, gx + gr * 0.95, 14, 7, flash > 0 ? C.accent : C.grid);
        if (V.metro) kit.label(c, 'beat', gx + gr * 0.95 - 12, 14, { size: 10.5, color: C.muted, align: 'right' });
        // ---- the last 8 seconds: your pushes against the beat
        const sx0 = lw + 12, sx1 = W - 12, sy = gy + 44, span = 8;
        const X = time => sx1 - (t - time) / span * (sx1 - sx0);
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke();
        if (V.metro) {
          c.strokeStyle = C.faint;
          for (let b = nextBeat - period; b > t - span; b -= period) { c.beginPath(); c.moveTo(X(b), sy - 6); c.lineTo(X(b), sy + 6); c.stroke(); }
        }
        c.strokeStyle = C.accent; c.lineWidth = 2.5;
        for (const p of presses) if (p > t - span) { c.beginPath(); c.moveTo(X(p), sy - 12); c.lineTo(X(p), sy); c.stroke(); }
        c.lineWidth = 1;
        kit.label(c, 'your pushes (blue) and the beat (grey), last 8 s', sx0, sy + 16, { size: 10.5, color: C.muted });
        // ---- feedback
        let msg, col = C.text;
        if (last == null) { msg = focused ? 'Keyboard ready: press the space bar for each push' : 'Click or tap the picture to push'; col = C.muted; }
        else if (V.mode === '30:2' && cycleCount >= 30 && paused) {
          const p = t - last;
          if (p <= 10) { msg = 'Two breaths now, then back on the chest (' + r1(p) + ' s)'; col = C.accent; }
          else { msg = 'Pause ' + Math.round(p) + ' s — too long: back on the chest!'; col = C.bad; }
        }
        else if (paused) { msg = 'Don\'t stop! Blood flow falls with every pause'; col = C.bad; }
        else if (!r) { msg = 'Keep going…'; col = C.muted; }
        else if (r < 100) { msg = 'Faster'; col = C.warn; }
        else if (r > 120) { msg = 'Slower'; col = C.warn; }
        else { msg = 'Good rate — keep it up'; col = C.ok; }
        if (!paused && skipped && V.mode === '30:2' && cycleCount < 4) { msg = 'In 30 : 2, pause for two breaths after 30'; col = C.warn; }
        const elapsed = first != null && last != null ? t - first : 0;
        if (!paused && elapsed > 5 && (elapsed % 120) < 5 && elapsed > 115) { msg = 'Two minutes: swap rescuers if someone can take over'; col = C.accent; }
        kit.label(c, msg, lw + (W - lw) / 2, Math.min(Hh - 44, sy + 44), { size: 15, weight: 650, color: col, align: 'center' });
        const cnt = V.mode === '30:2' ? 'Cycle ' + (cycles + 1) + ' · compression ' + Math.min(cycleCount, 30) + ' of 30' : count + ' compressions';
        kit.label(c, cnt, lw + (W - lw) / 2, Math.min(Hh - 20, sy + 70), { size: 12.5, color: C.text2, align: 'center' });
        // ---- read-outs
        let off = handsOff;
        if (paused) off += (t - last) - 0.55;
        const total = first != null ? Math.max(0.001, t - first) : 0;
        ro.set('rate', r ? Math.round(r) + ' /min' : paused ? 'paused' : '—');
        ro.set('avg', runN >= 2 && runTime > 0 ? Math.round(60 * runN / runTime) + ' /min' : '—');
        ro.set('band', judged ? Math.round(100 * inBand / judged) + ' %' : '—');
        ro.set('n', String(count));
        ro.set('pause', longest > 0 || (paused && last != null) ? r1(Math.max(longest, paused ? t - last : 0)) + ' s' : '—');
        ro.set('ccf', total > 2 ? Math.round(100 * clamp(1 - off / total, 0, 1)) + ' %' : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
      return () => { try { if (audio && audio.close) audio.close(); } catch (e) { /* ignore */ } };
    }
  });

  /* ================================================================ the chain of survival */
  // A teaching model built on the often-quoted rule of thumb: from about 70 % if the shock is
  // immediate, the chance of surviving a witnessed VF arrest falls by 7–10 percentage points
  // per minute with no CPR and by 3–4 points per minute while bystander CPR is going on.
  const S0 = 70;
  function survival(tCpr, tShock, a, b) {
    const without = Math.min(tCpr, tShock), withCpr = Math.max(0, tShock - tCpr);
    return clamp(S0 - a * without - b * withCpr, 0, S0);
  }
  Hyper.sim('fa-chain-survival', {
    title: 'The chain of survival against the clock',
    blurb: `Someone collapses in cardiac arrest (ventricular fibrillation) at minute 0. Set when a bystander starts CPR and when the first shock is given, and read the rough chance of survival. The bands show the range of the rule of thumb used in resuscitation teaching; the numbers are **approximate** and real outcomes depend on age, cause, place and much else.

- Press **Wait for the ambulance** with no CPR, then tick CPR on: the same minute of the shock, a very different chance.
- Press **AED nearby**: a defibrillator fetched from the wall in 3–4 minutes beats the best ambulance service.
- Notice the timeline: CPR does not restart the heart — it keeps a trickle of oxygen reaching the brain until the shock can.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'cpr', label: 'Bystander CPR starts after', min: 0, max: 15, step: 0.5, value: 1.5, unit: 'min' },
        { id: 'nocpr', type: 'check', label: 'No one starts CPR', value: !!(params && params.nocpr) },
        { id: 'shock', label: 'First shock after', min: 1, max: 20, step: 0.5, value: 9, unit: 'min' },
        { type: 'buttons', items: [{ id: 'aed', label: 'AED nearby' }, { id: 'amb', label: 'Wait for the ambulance' }] }
      ], id => {
        if (id === 'aed') ctl.set('shock', 3.5);
        if (id === 'amb') ctl.set('shock', 10);
        loop.once();
      });
      const ro = kit.readout(box.side, [['s', 'Chance of survival (rough)'], ['none', 'Same shock, no CPR'], ['cprmin', 'Minutes of CPR before the shock'], ['real', 'In real life']]);
      const V = ctl.values;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const tc = V.nocpr ? Infinity : V.cpr, ts = V.shock;
        const lo = survival(tc, ts, 10, 4), hi = survival(tc, ts, 7, 3), mid = survival(tc, ts, 8.5, 3.5);
        const nlo = survival(Infinity, ts, 10, 4), nhi = survival(Infinity, ts, 7, 3);
        // ---- the chain: five links, bright when that link is strong in this scenario
        const links = [
          ['Recognise', 'and call', 1],
          ['Early CPR', V.nocpr ? 'none' : 'at ' + V.cpr + ' min', V.nocpr ? 0.08 : clamp(1 - V.cpr / 8, 0.15, 1)],
          ['Early shock', 'at ' + ts + ' min', clamp(1 - (ts - 3) / 12, 0.15, 1)],
          ['Advanced care', 'paramedics', 0.8],
          ['Recovery', 'hospital, rehab', 0.8]
        ];
        const ly = 12, lh = Math.max(34, Hh * 0.12), lwid = (W - 24) / links.length;
        links.forEach((L, i) => {
          const x = 12 + i * lwid;
          c.globalAlpha = 0.25 + 0.75 * L[2];
          c.strokeStyle = i === 1 || i === 2 ? C.bad : C.accent; c.lineWidth = 4;
          rrect(c, x + 6, ly + 2, lwid - 12, lh - 4, lh / 2 - 2); c.stroke();
          c.globalAlpha = 1;
          kit.label(c, L[0], x + lwid / 2, ly + lh / 2 - 7, { size: 12, weight: 650, align: 'center', color: L[2] < 0.3 ? C.muted : C.text });
          kit.label(c, L[1], x + lwid / 2, ly + lh / 2 + 8, { size: 10.5, align: 'center', color: C.muted });
        });
        // ---- the timeline of blood flow to the brain
        const tly = ly + lh + 26, tx0 = 52, tx1 = W - 16, tmax = 20;
        const TX = m => tx0 + clamp(m, 0, tmax) / tmax * (tx1 - tx0);
        const seg = (a, b, col) => { if (b > a) { c.fillStyle = col; c.fillRect(TX(a), tly - 7, TX(b) - TX(a), 14); } };
        const cprStart = Math.min(tc, ts);
        seg(0, cprStart, C.bad);
        c.globalAlpha = 0.75; seg(cprStart, ts, C.warn); c.globalAlpha = 1;
        c.globalAlpha = 0.6; seg(ts, tmax, C.ok); c.globalAlpha = 1;
        kit.label(c, 'flow', 8, tly, { size: 10.5, color: C.muted });
        for (let m = 0; m <= tmax; m += 5) kit.label(c, m + ' min', TX(m), tly + 17, { size: 10, color: C.muted, align: 'center' });
        if (cprStart > 0.4) kit.label(c, 'none', TX(cprStart / 2), tly, { size: 10, color: '#fff', align: 'center' });
        if (ts - cprStart > 2.5) kit.label(c, 'CPR: about a quarter to a third of normal', TX((cprStart + ts) / 2), tly, { size: 10, color: '#000', align: 'center' });
        if (tmax - ts > 2) kit.label(c, 'after the shock, if the heart restarts', TX((ts + tmax) / 2), tly, { size: 10, color: C.text, align: 'center' });
        // ---- survival against minutes to the first shock
        const px0 = 52, px1 = W - 16, py0 = tly + 36, py1 = Hh - 30, ymax = 75;
        const PX = m => px0 + m / tmax * (px1 - px0), PY = s => py1 - clamp(s, 0, ymax) / ymax * (py1 - py0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let s = 0; s <= 70; s += 10) { c.beginPath(); c.moveTo(px0, PY(s)); c.lineTo(px1, PY(s)); c.stroke(); kit.label(c, s + ' %', px0 - 6, PY(s), { size: 10, color: C.muted, align: 'right' }); }
        for (let m = 0; m <= tmax; m += 5) kit.label(c, String(m), PX(m), py1 + 12, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'minutes from collapse to the first shock', (px0 + px1) / 2, py1 + 24, { size: 10.5, color: C.muted, align: 'center' });
        const band = (fLo, fHi, col) => {
          c.fillStyle = col; c.globalAlpha = 0.22; c.beginPath();
          for (let m = 0; m <= tmax + 1e-9; m += 0.25) { const x = PX(m), y = PY(fHi(m)); m ? c.lineTo(x, y) : c.moveTo(x, y); }
          for (let m = tmax; m >= -1e-9; m -= 0.25) c.lineTo(PX(m), PY(fLo(m)));
          c.closePath(); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          for (let m = 0; m <= tmax + 1e-9; m += 0.25) { const x = PX(m), y = PY((fLo(m) + fHi(m)) / 2); m ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke();
        };
        band(m => survival(Infinity, m, 10, 4), m => survival(Infinity, m, 7, 3), C.bad);
        if (!V.nocpr) band(m => survival(V.cpr, m, 10, 4), m => survival(V.cpr, m, 7, 3), C.ok);
        kit.label(c, 'no CPR', PX(4.2), PY(survival(Infinity, 4.2, 8.5, 3.5)) + 4, { size: 11, color: C.bad, weight: 600 });
        if (!V.nocpr) kit.label(c, 'CPR from ' + V.cpr + ' min', PX(Math.min(15, V.cpr + 7)) , PY(survival(V.cpr, Math.min(15, V.cpr + 7), 8.5, 3.5)) - 14, { size: 11, color: C.ok, weight: 600, align: 'center' });
        c.setLineDash([4, 4]); c.strokeStyle = C.accent; c.beginPath(); c.moveTo(PX(ts), py0); c.lineTo(PX(ts), py1); c.stroke(); c.setLineDash([]);
        kit.dot(c, PX(ts), PY(mid), 6, C.accent, C.bg2);
        kit.label(c, Math.round(lo) + '–' + Math.round(hi) + ' %', PX(ts) + (ts > 15 ? -10 : 10), PY(mid) - 12, { size: 13, weight: 700, color: C.accent, align: ts > 15 ? 'right' : 'left' });
        kit.label(c, 'rough teaching model (rule of thumb) — not a prediction', px1, py0 + 4, { size: 10, color: C.muted, align: 'right' });
        ro.set('s', Math.round(lo) + '–' + Math.round(hi) + ' %');
        ro.set('none', Math.round(nlo) + '–' + Math.round(nhi) + ' %');
        ro.set('cprmin', V.nocpr ? 'none' : r1(Math.max(0, ts - V.cpr)) + ' min');
        ro.set('real', 'about 1 in 10 survive an arrest outside hospital overall (European and US registries, 2017–2023)');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the rule of nines */
  // shares of the body surface, per region and side (front/back), adult rule of nines;
  // in children the head is larger and the legs smaller (simplified: infant head 18 %, each
  // leg 13.5 %, moving 1 % a year from head to legs until adult proportions at about 10 years)
  function shares(age) {
    let head = 9, leg = 18;
    if (age !== 'adult') { const a = Math.max(1, +age); head = Math.max(9, 18 - (a - 1)); leg = Math.min(18, 13.5 + 0.5 * (a - 1)); }
    return { head: head / 2, arm: 4.5, chest: 9, belly: 9, upback: 9, lowback: 9, leg: leg / 2, groin: 1, headTotal: head, legTotal: leg };
  }
  Hyper.sim('fa-rule-of-nines', {
    title: 'Rule of nines: how big is the burn?',
    blurb: `Click the body to mark the burned areas — **front and back** — and read the share of the body surface (TBSA). Count only blistered or deeper burns, never simple redness like sunburn. Scattered small patches are counted in palms: the person's own palm with fingers is about 1 %.

- Switch to a **1-year-old**: the head is twice as large a share (18 %) and the legs smaller.
- Try the **hot drink** example — a typical scald of a toddler — and notice how quickly a child reaches the 10 % at which hospital fluids are needed.
- The Parkland numbers are what a hospital team starts from, not something to do at the scene; see [the fluids calculator](#/tools/clinical/fluids). At the scene: cool with running water for 20 minutes and call.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'age', type: 'select', label: 'Person', options: [['Adult (and children from about 10)', 'adult'], ['Child, about 5 years', 5], ['Infant, about 1 year', 1]], value: (params && params.age) || 'adult' },
        { id: 'kg', label: 'Body weight', min: 3, max: 150, step: 1, value: 70, unit: 'kg' },
        { id: 'palms', label: 'Extra palm-sized patches', min: 0, max: 20, step: 1, value: 0, unit: '× 1 %' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Clear' }, { id: 'scald', label: 'Example: hot drink on a toddler' }, { id: 'fire', label: 'Example: clothing fire' }] }
      ], (id, v) => {
        if (id === 'age') ctl.set('kg', v === 'adult' ? 70 : v === 5 ? 18 : 10);
        if (id === 'clear') { burned.clear(); ctl.set('palms', 0); }
        if (id === 'scald') { burned.clear(); ctl.set('age', 1); ctl.set('kg', 10); ctl.set('palms', 0); ['F:head', 'F:chest', 'F:armR'].forEach(k => burned.add(k)); }
        if (id === 'fire') { burned.clear(); ctl.set('age', 'adult'); ctl.set('kg', 75); ctl.set('palms', 2); ['F:chest', 'F:belly', 'F:armL', 'F:armR', 'B:upback'].forEach(k => burned.add(k)); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['tbsa', 'Burned area (TBSA)'], ['size', 'What it means'], ['pk', 'Parkland: first 24 h'], ['h8', 'First 8 h (half)'], ['h16', 'Next 16 h'], ['maint', 'Plus maintenance (child)']]);
      const V = ctl.values;
      const burned = new Set();
      let regions = [];
      // build the clickable regions of one figure (front or back) centred at cx
      function figure(side, cx, topY, Hf, sh) {
        const out = [];
        const hr = Hf * (0.062 + 0.0042 * (sh.headTotal - 9));
        const legLen = Hf * (0.43 - 0.012 * (18 - sh.legTotal));
        const tTop = topY + 2 * hr + 6, tBot = topY + Hf - legLen, tw = Hf * 0.25;
        const tMid = (tTop + tBot) / 2;
        const aw = Hf * 0.075, al = (tBot - tTop) * 1.05 + Hf * 0.05;
        const add = (key, name, pct, shape) => out.push({ key: side + ':' + key, name, pct, shape });
        add('head', 'head and neck', sh.head, { t: 'circle', x: cx, y: topY + hr, r: hr });
        if (side === 'F') {
          add('groin', 'genital area', sh.groin, { t: 'rect', x: cx - tw * 0.12, y: tBot - Hf * 0.035, w: tw * 0.24, h: Hf * 0.05 });
          add('chest', 'chest', sh.chest, { t: 'rect', x: cx - tw / 2, y: tTop, w: tw, h: tMid - tTop });
          add('belly', 'abdomen', sh.belly, { t: 'rect', x: cx - tw / 2, y: tMid, w: tw, h: tBot - tMid });
        } else {
          add('upback', 'upper back', sh.upback, { t: 'rect', x: cx - tw / 2, y: tTop, w: tw, h: tMid - tTop });
          add('lowback', 'lower back and buttocks', sh.lowback, { t: 'rect', x: cx - tw / 2, y: tMid, w: tw, h: tBot - tMid });
        }
        const L = side === 'F' ? 'R' : 'L', Rr = side === 'F' ? 'L' : 'R';   // the person's right is on our left, seen from the front
        add('arm' + L, (L === 'R' ? 'right' : 'left') + ' arm', sh.arm, { t: 'rect', x: cx - tw / 2 - aw - 3, y: tTop + 2, w: aw, h: al });
        add('arm' + Rr, (Rr === 'R' ? 'right' : 'left') + ' arm', sh.arm, { t: 'rect', x: cx + tw / 2 + 3, y: tTop + 2, w: aw, h: al });
        add('leg' + L, (L === 'R' ? 'right' : 'left') + ' leg', sh.leg, { t: 'rect', x: cx - tw / 2, y: tBot + 2, w: tw / 2 - 2, h: legLen - 2 });
        add('leg' + Rr, (Rr === 'R' ? 'right' : 'left') + ' leg', sh.leg, { t: 'rect', x: cx + 2, y: tBot + 2, w: tw / 2 - 2, h: legLen - 2 });
        return out;
      }
      const inside = (s, p) => s.t === 'circle' ? Math.hypot(p.x - s.x, p.y - s.y) <= s.r : p.x >= s.x && p.x <= s.x + s.w && p.y >= s.y && p.y <= s.y + s.h;
      const hitRegion = p => regions.find(g => inside(g.shape, p)) || null;
      let hover = null;
      kit.click(st, p => { const g = hitRegion(p); if (g) { if (burned.has(g.key)) burned.delete(g.key); else burned.add(g.key); loop.once(); } }, p => { hover = hitRegion(p); return !!hover; });
      function total() {
        const sh = shares(V.age);
        let s = V.palms;
        for (const k of burned) {
          const part = k.split(':')[1];
          const base = part.replace(/[LR]$/, '');
          s += sh[base] || 0;
        }
        return Math.min(100, s);
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const sh = shares(V.age);
        const Hf = Math.min(Hh - 50, W * 0.62);
        const topY = 30;
        regions = figure('F', W * 0.27, topY, Hf, sh).concat(figure('B', W * 0.73, topY, Hf, sh));
        kit.label(c, 'FRONT', W * 0.27, 14, { size: 11.5, weight: 700, color: C.muted, align: 'center' });
        kit.label(c, 'BACK', W * 0.73, 14, { size: 11.5, weight: 700, color: C.muted, align: 'center' });
        // draw the groin last so it sits on top of the abdomen
        const order = regions.filter(g => !g.key.endsWith('groin')).concat(regions.filter(g => g.key.endsWith('groin')));
        for (const g of order) {
          const s = g.shape, on = burned.has(g.key);
          c.fillStyle = on ? C.bad : C.surface;
          c.globalAlpha = on ? 0.7 : 1;
          if (s.t === 'circle') { c.beginPath(); c.arc(s.x, s.y, s.r, 0, Math.PI * 2); } else rrect(c, s.x, s.y, s.w, s.h, Math.min(8, s.w / 3));
          c.fill(); c.globalAlpha = 1;
          c.strokeStyle = hover === g ? C.accent : C.border2; c.lineWidth = hover === g ? 2.5 : 1.2; c.stroke();
          const cx = s.t === 'circle' ? s.x : s.x + s.w / 2, cy = s.t === 'circle' ? s.y : s.y + s.h / 2;
          if (!g.key.endsWith('groin')) kit.label(c, pctText(g.pct) + '%', cx, cy, { size: 10.5, weight: 600, align: 'center', color: on ? '#fff' : C.muted });
        }
        const T = total();
        kit.label(c, 'Burned: ' + (T % 1 ? T.toFixed(1) : T) + ' %', W / 2, Hh - 14, { size: 15, weight: 700, align: 'center', color: T > 0 ? C.bad : C.muted });
        if (hover) kit.label(c, hover.name + ' (' + (hover.key[0] === 'F' ? 'front' : 'back') + '): ' + hover.pct + ' %', W / 2, 14, { size: 11.5, align: 'center', color: C.accent, bg: C.bg2 });
        // read-outs
        const child = V.age !== 'adult', pk = kit.med.parkland(V.kg, T);
        ro.set('tbsa', (T % 1 ? T.toFixed(1) : String(T)) + ' %');
        ro.set('size', T === 0 ? 'click the body to mark burns' : (child ? T >= 10 : T >= 20) ? 'major burn: emergency, hospital fluids (from ' + (child ? '10' : '20') + ' % in ' + (child ? 'a child' : 'an adult') + ')' : 'needs medical care if larger than the palm, deep, or on the face, hands, feet, genitals or a joint');
        ro.set('pk', grp(pk) + ' mL');
        ro.set('h8', grp(pk / 2) + ' mL · ' + grp(pk / 16) + ' mL/h');
        ro.set('h16', grp(pk / 2) + ' mL · ' + grp(pk / 32) + ' mL/h');
        ro.set('maint', child ? grp(kit.med.maintenanceFluids(V.kg)) + ' mL/h (4-2-1 rule)' : '—');
        ro.show('maint', child);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ blood loss and shock */
  // schematic responses by the share of blood volume lost, after the classes of haemorrhagic
  // shock taught in the ATLS course (10th edition, 2018); approximate, and people vary widely
  const ADULT = {
    hr: [[0, 75], [0.15, 100], [0.3, 120], [0.4, 140], [0.5, 155]],
    sys: [[0, 120], [0.15, 120], [0.3, 110], [0.4, 88], [0.5, 65]],
    dia: [[0, 80], [0.15, 84], [0.3, 85], [0.4, 66], [0.5, 45]],
    rr: [[0, 16], [0.15, 20], [0.3, 28], [0.4, 35], [0.5, 40]]
  };
  const CHILD = {     // a school-age child: blood pressure holds until late
    hr: [[0, 95], [0.15, 125], [0.3, 145], [0.4, 165], [0.5, 175]],
    sys: [[0, 105], [0.25, 103], [0.35, 95], [0.45, 70], [0.5, 58]],
    dia: [[0, 65], [0.25, 70], [0.35, 68], [0.45, 48], [0.5, 38]],
    rr: [[0, 20], [0.15, 25], [0.3, 32], [0.4, 40], [0.5, 45]]
  };
  function shockClass(f) {
    if (f < 0.15) return { n: 'I', mind: 'normal or slightly anxious', skin: 'normal', urine: 'normal (adult > 30 mL/h)', lvl: 0 };
    if (f < 0.3) return { n: 'II', mind: 'anxious', skin: 'pale, cool hands, slow capillary refill', urine: 'reduced (adult 20–30 mL/h)', lvl: 1 };
    if (f < 0.4) return { n: 'III', mind: 'anxious, confused', skin: 'cold, clammy, pale', urine: 'low (adult 5–15 mL/h)', lvl: 2 };
    return { n: 'IV', mind: 'confused, drowsy or unresponsive', skin: 'cold, grey, mottled', urine: 'almost none', lvl: 3 };
  }
  Hyper.sim('fa-blood-loss', {
    title: 'Blood loss and the body\'s response',
    blurb: `Drag **Blood lost**, or choose a wound and press **Let it bleed** (the clock runs ten times faster than real time), and watch how the body defends its blood pressure — until it cannot. Then stop the bleeding with **firm pressure** or a **tourniquet**.

- The heart rate climbs first; the blood pressure holds until about 30 % is lost. A normal blood pressure does **not** mean the bleeding is minor.
- Switch to a **child**: the pressure holds even longer and then falls suddenly — the fast pulse and cold hands are the warning.
- With a spurting bleed, count how many minutes it takes to reach class III. That is why pressing on the wound comes before anything else.
- The curves are schematic, after the classes taught in trauma courses; real people vary.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'kg', label: 'Body weight', min: 10, max: 120, step: 1, value: 70, unit: 'kg' },
        { id: 'who', type: 'select', label: 'Person', options: [['Adult (about 70 mL of blood per kg)', 'adult'], ['Child (about 80 mL per kg)', 'child']], value: 'adult' },
        { id: 'lost', label: 'Blood lost', min: 0, max: 50, step: 0.5, value: 0, unit: '%' },
        { id: 'wound', type: 'select', label: 'Wound (for the clock)', options: [['Steady bleeding from a deep cut (≈50 mL/min)', 50], ['Heavy bleeding (≈150 mL/min)', 150], ['Spurting arterial bleeding (≈400 mL/min)', 400]], value: 150 },
        { type: 'buttons', items: [{ id: 'bleed', label: 'Let it bleed', primary: true }, { id: 'press', label: 'Press firmly' }, { id: 'tq', label: 'Tourniquet (limb)' }, { id: 'reset', label: 'Reset' }] }
      ], (id, v) => {
        if (id === 'who') ctl.set('kg', v === 'child' ? 25 : 70);
        if (id === 'lost' || id === 'kg' || id === 'who') { lostML = V.lost / 100 * bv(); if (id === 'lost') running = false; }
        if (id === 'bleed') { running = true; care = 'none'; }
        if (id === 'press') care = 'press';
        if (id === 'tq') care = 'tq';
        if (id === 'reset') { running = false; care = 'none'; lostML = 0; clockS = 0; ctl.set('lost', 0); }
      });
      const ro = kit.readout(box.side, [['vol', 'Blood lost'], ['cls', 'Class of shock'], ['hr', 'Heart rate'], ['bp', 'Blood pressure'], ['rr', 'Breathing rate'], ['mind', 'Mental state'], ['skin', 'Skin'], ['urine', 'Urine output'], ['clock', 'Time since the injury']]);
      const V = ctl.values;
      const bv = () => V.kg * (V.who === 'child' ? 80 : 70);
      let lostML = 0, running = false, care = 'none', clockS = 0, beat = 0, drops = [];
      const SPEED = 10;
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        const flowNow = running ? V.wound * (care === 'tq' ? 0 : care === 'press' ? 0.1 : 1) : 0;   // mL per minute
        if (running) {
          clockS += dt * SPEED;
          lostML = Math.min(0.5 * bv(), lostML + flowNow / 60 * dt * SPEED);
          ctl.set('lost', Math.round(1000 * lostML / bv()) / 10);
        }
        const f = clamp(lostML / Math.max(1, bv()), 0, 0.5);
        const T = V.who === 'child' ? CHILD : ADULT;
        const hr = interp(T.hr, f), sys = interp(T.sys, f), dia = interp(T.dia, f), rr = interp(T.rr, f);
        const K = shockClass(f);
        beat = (beat + dt * hr / 60) % 1;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // ---- the blood volume, as a tank
        const bx = 24, bw = Math.min(90, W * 0.13), by0 = 34, by1 = Hh - 56;
        c.strokeStyle = C.border2; c.lineWidth = 2; rrect(c, bx, by0, bw, by1 - by0, 8); c.stroke();
        const left = 1 - f;
        c.fillStyle = C.bad; c.globalAlpha = 0.75;
        rrect(c, bx + 3, by1 - (by1 - by0 - 6) * left - 3, bw - 6, (by1 - by0 - 6) * left, 6); c.fill(); c.globalAlpha = 1;
        for (const [p, lab] of [[0.15, '15 %'], [0.3, '30 %'], [0.4, '40 %']]) {
          const y = by0 + (by1 - by0) * p;
          c.setLineDash([3, 3]); c.strokeStyle = C.text2; c.beginPath(); c.moveTo(bx - 4, y); c.lineTo(bx + bw + 4, y); c.stroke(); c.setLineDash([]);
          kit.label(c, lab + ' lost', bx + bw + 8, y, { size: 10, color: C.muted });
        }
        kit.label(c, 'blood volume', bx + bw / 2, 16, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, r1(bv() * left / 1000) + ' of ' + r1(bv() / 1000) + ' L', bx + bw / 2, by1 + 18, { size: 12, weight: 650, align: 'center' });
        // ---- the heart, beating at the heart rate
        const hx = bx + bw + (W < 520 ? 62 : 110), hy = Hh * 0.36, hs = Math.min(34, W * 0.05) * (1 + 0.14 * Math.exp(-beat * 9));
        c.fillStyle = C.bad; c.beginPath();
        c.moveTo(hx, hy + hs * 0.9);
        c.bezierCurveTo(hx - hs * 1.4, hy + hs * 0.1, hx - hs * 0.9, hy - hs * 1.0, hx, hy - hs * 0.35);
        c.bezierCurveTo(hx + hs * 0.9, hy - hs * 1.0, hx + hs * 1.4, hy + hs * 0.1, hx, hy + hs * 0.9);
        c.fill();
        kit.label(c, Math.round(hr) + ' /min', hx, hy + hs + 18, { size: 14, weight: 700, align: 'center' });
        // the wound and dripping blood (schematic dots)
        const wx = hx, wy = Hh * 0.72;
        c.strokeStyle = C.muted; c.lineWidth = 1.5; rrect(c, wx - 46, wy - 12, 92, 24, 12); c.stroke();
        kit.label(c, care === 'tq' ? 'tourniquet on' : care === 'press' ? 'firm pressure' : running ? 'bleeding' : 'wound', wx, wy, { size: 10.5, color: care === 'none' ? C.muted : C.ok, align: 'center' });
        if (flowNow > 0 && Math.random() < Math.min(0.9, flowNow / 300) * dt * 20) drops.push({ x: wx + (Math.random() - 0.5) * 30, y: wy + 12, v: 0 });
        for (const d of drops) { d.v += 300 * dt; d.y += d.v * dt; }
        drops = drops.filter(d => d.y < Hh - 4);
        for (const d of drops) kit.dot(c, d.x, d.y, 2.5, C.bad);
        // ---- the monitor
        const mx = Math.max(hx + 80, W * 0.48), mw = W - mx - 14, my = 16, mh = Hh - 70;
        c.fillStyle = C.dark ? '#0b0f14' : '#10161d'; rrect(c, mx, my, mw, mh, 10); c.fill();
        const rows = [['HR', Math.round(hr) + '', '#7dffb0'], ['BP', Math.round(sys) + '/' + Math.round(dia), '#ff8a8a'], ['RR', Math.round(rr) + '', '#8ad0ff'], ['SI', (hr / sys).toFixed(2), hr / sys > 1 ? '#ffb070' : '#cfd6e0']];
        const rh = mh / (rows.length + 1.2);
        rows.forEach((row, i) => {
          const y = my + rh * (i + 0.8);
          kit.label(c, row[0], mx + 14, y, { size: 12, weight: 700, color: row[2] });
          kit.label(c, row[1], mx + mw - 14, y, { size: Math.min(30, rh * 0.62), weight: 700, color: row[2], align: 'right' });
        });
        if (mw > 320) kit.label(c, 'SI = shock index, heart rate ÷ systolic; above 1 is a warning', mx + 12, my + mh - 14, { size: 10, color: '#aab4c0' });
        else kit.label(c, 'SI = HR ÷ systolic', mx + 8, my + mh - 14, { size: 9.5, color: '#aab4c0' });
        // ---- the class scale
        const sx0 = 24, sx1 = W - 14, sy = Hh - 22, SX = p => sx0 + p / 0.5 * (sx1 - sx0);
        const zones = [[0, 0.15, C.ok, 'I'], [0.15, 0.3, C.warn, 'II'], [0.3, 0.4, kit.hue(18), 'III'], [0.4, 0.5, C.bad, 'IV']];
        for (const z of zones) {
          c.fillStyle = z[2]; c.globalAlpha = K.n === z[3] ? 0.85 : 0.3; c.fillRect(SX(z[0]), sy - 7, SX(z[1]) - SX(z[0]) - 2, 14); c.globalAlpha = 1;
          kit.label(c, 'class ' + z[3], (SX(z[0]) + SX(z[1])) / 2, sy, { size: 10, weight: 650, color: C.dark ? '#fff' : '#000', align: 'center' });
        }
        kit.dot(c, SX(f), sy - 11, 5, C.text, C.bg2);
        // ---- read-outs
        ro.set('vol', grp(lostML) + ' mL (' + Math.round(f * 100) + ' %)');
        ro.set('cls', 'class ' + K.n + (f >= 0.4 ? ' — immediately life-threatening' : ''));
        ro.set('hr', Math.round(hr) + ' /min');
        ro.set('bp', Math.round(sys) + '/' + Math.round(dia) + ' mmHg' + (sys >= (V.who === 'child' ? 95 : 105) && f >= 0.15 ? ' (still normal!)' : ''));
        ro.set('rr', Math.round(rr) + ' /min');
        ro.set('mind', K.mind);
        ro.set('skin', K.skin);
        ro.set('urine', K.urine);
        const mm = Math.floor(clockS / 60), ss = Math.floor(clockS % 60);
        ro.set('clock', running || clockS > 0 ? mm + ' min ' + (ss < 10 ? '0' : '') + ss + ' s' + (running && flowNow === 0 ? ' — bleeding stopped' : '') : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ body temperature */
  const STAGES = [
    [-Infinity, 24, 'Severe hypothermia, no signs of life', 'Unresponsive; breathing and pulse may be undetectable.', 'Call the emergency number; start CPR if not breathing normally and keep going — specialist rewarming can still save people. Handle gently.', 222],
    [24, 28, 'Severe hypothermia', 'Unconscious; slow, weak breathing and pulse.', 'Call the emergency number. Handle very gently, keep horizontal, insulate; check breathing for up to a minute and start CPR if it is not normal.', 215],
    [28, 32, 'Moderate hypothermia', 'Drowsy, confused, clumsy; shivering stops.', 'Call the emergency number. Handle gently and keep lying down; remove wet clothes, insulate head and body, shelter from wind; no hot baths, no rubbing.', 208],
    [32, 35, 'Mild hypothermia', 'Shivering, cold pale skin, fumbling hands, poor judgement.', 'Get out of the cold and wind, replace wet clothes, insulate, warm sweet drinks if fully alert, gentle exercise if able. Get help if not improving.', 198],
    [35, 36.1, 'Cool', 'Cold, shivering.', 'Warm clothes, shelter, a warm drink.', 188],
    [36.1, 37.6, 'Normal', 'Normal core temperature (about 36.1–37.5 °C; it varies through the day and by where it is measured).', 'Nothing to do.', 150],
    [37.6, 38, 'Slightly raised', 'Warm; after exercise or with a mild illness.', 'Rest, fluids, a cool place.', 90],
    [38, 40, 'Fever or heat exhaustion', 'Fever: an illness resets the thermostat. Heat exhaustion: heavy sweating, weakness, dizziness, headache, nausea — but the person thinks clearly.', 'Heat exhaustion: move to the cool, lie down, loosen clothes, cool the skin, give water or an oral rehydration drink. Call for help if not better within about 30 minutes.', 38],
    [40, 42, 'Heatstroke (if confused, collapsed or fitting)', 'Hot skin (dry or sweating), confusion, slurred speech, collapse, seizures.', 'Call the emergency number and cool at once: cold-water immersion up to the neck is fastest; otherwise cold water on the skin with fanning and ice packs. Stop at about 39 °C.', 12],
    [42, Infinity, 'Life-threatening heatstroke', 'Organs and blood clotting begin to fail.', 'Cool immediately and keep cooling while help comes — every minute above 40 °C adds harm.', 2]
  ];
  const stageOf = T => STAGES.find(s => T >= s[0] && T < s[1]) || STAGES[5];
  Hyper.sim('fa-body-temp', {
    title: 'Body temperature: from hypothermia to heatstroke',
    blurb: `Move the core temperature from 22 to 44 °C and read the stage, the signs and what to do at each. Then press **Heatstroke at 42 °C** and **Start cooling** to compare cooling methods (one second here is three minutes).

- Cold-water immersion brings 42 °C down to 39 °C in about a quarter of an hour; ice packs alone take well over an hour. International first-aid guidance (ILCOR 2020, ERC 2021) prefers immersion for exertional heatstroke.
- Notice where shivering stops (about 32 °C): below it the body can no longer rewarm itself.
- Heatstroke is recognised by the brain, not only the thermometer: someone hot and confused after heat or effort needs cooling and an ambulance.
- Cooling rates are approximate ranges from studies of volunteers and athletes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Core body temperature', min: 22, max: 44, step: 0.1, value: (params && params.T) || 37, unit: '°C' },
        { id: 'method', type: 'select', label: 'Cooling method', options: [['Cold-water immersion (≈0.2 °C/min)', 0.2], ['Wet skin and fanning (≈0.05 °C/min)', 0.05], ['Ice packs to neck, armpits, groin (≈0.03 °C/min)', 0.03], ['Shade only (≈0.015 °C/min)', 0.015]], value: 0.2 },
        { type: 'buttons', items: [{ id: 'hot', label: 'Heatstroke at 42 °C' }, { id: 'cool', label: 'Start cooling', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id) => {
        if (id === 'hot') { cooling = false; ctl.set('T', 42); curve = []; minutes = 0; }
        if (id === 'cool') { if (V.T < 40) { ctl.set('T', 42); } cooling = true; curve = [[0, V.T]]; minutes = 0; }
        if (id === 'stop') cooling = false;
        if (id === 'T') cooling = false;
        if (id === 'method' && cooling) { curve = [[0, V.T]]; minutes = 0; }
      });
      const ro = kit.readout(box.side, [['T', 'Core temperature'], ['stage', 'Stage'], ['see', 'What you may see'], ['do', 'What to do'], ['cool', 'Cooling']]);
      const V = ctl.values;
      let cooling = false, curve = [], minutes = 0, shake = 0;
      function draw(dt) {
        dt = Math.min(dt || 0, 0.05);
        shake += dt;
        if (cooling) {
          const m = dt * 3;                              // one second is three minutes
          minutes += m;
          const T = Math.max(39, V.T - V.method * m);
          ctl.set('T', T);
          if (!curve.length || minutes - curve[curve.length - 1][0] > 0.2 || T <= 39) curve.push([minutes, T]);
          if (T <= 39) cooling = false;
        }
        const T = V.T, S = stageOf(T);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // ---- the thermometer
        const x = 46, y0 = 20, y1 = Hh - 24, Tmin = 22, Tmax = 44;
        const Y = t => y1 - (clamp(t, Tmin, Tmax) - Tmin) / (Tmax - Tmin) * (y1 - y0);
        for (const s of STAGES) {
          const a = Math.max(Tmin, s[0]), b = Math.min(Tmax, s[1]);
          c.fillStyle = kit.hue(s[5], 0.55); c.fillRect(x - 10, Y(b), 20, Y(a) - Y(b));
        }
        c.strokeStyle = C.border2; c.lineWidth = 1.5; c.strokeRect(x - 10, y0, 20, y1 - y0);
        for (let t = 22; t <= 44; t += 2) {
          c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x + 10, Y(t)); c.lineTo(x + 15, Y(t)); c.stroke();
          kit.label(c, t + '', x - 14, Y(t), { size: 10, color: C.muted, align: 'right' });
        }
        kit.label(c, '°C', x, y1 + 12, { size: 10.5, color: C.muted, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(x - 16, Y(T)); c.lineTo(x + 18, Y(T)); c.stroke(); c.lineWidth = 1;
        // stage names beside the scale
        const lx = x + 22;
        for (const s of STAGES) {
          const a = Math.max(Tmin, s[0]), b = Math.min(Tmax, s[1]);
          if (Y(a) - Y(b) < 13) continue;
          kit.label(c, s[2].replace(/ \(.*\)$/, ''), lx, (Y(a) + Y(b)) / 2, { size: 10.5, color: s === S ? C.text : C.muted, weight: s === S ? 700 : 500 });
        }
        // ---- the person (schematic)
        const px = Math.min(W * 0.52, lx + 250), py = Hh * 0.42, ps = Math.min(Hh * 0.15, 50);
        const hot = T >= 37.6, cold = T < 35;
        const skin = T >= 40 ? kit.hue(8) : hot ? kit.hue(24) : T < 32 ? kit.hue(215) : cold ? kit.hue(200) : C.surface;
        const jit = T >= 32 && T < 36.1 ? Math.sin(shake * 60) * 2 : 0;
        c.fillStyle = skin; c.strokeStyle = C.border2; c.lineWidth = 1.5;
        c.beginPath(); c.arc(px + jit, py - ps * 1.25, ps * 0.45, 0, Math.PI * 2); c.fill(); c.stroke();
        rrect(c, px - ps * 0.6 + jit, py - ps * 0.7, ps * 1.2, ps * 1.7, ps * 0.3); c.fill(); c.stroke();
        if (T >= 32 && T < 36.1) {
          c.strokeStyle = kit.hue(200); c.lineWidth = 1.5;
          for (const sgn of [-1, 1]) { c.beginPath(); for (let k = 0; k < 6; k++) c.lineTo(px + sgn * (ps * 0.85 + (k % 2) * 5), py - ps * 0.6 + k * ps * 0.25); c.stroke(); }
          kit.label(c, 'shivering', px, py + ps * 1.25, { size: 10.5, color: C.muted, align: 'center' });
        }
        if (T >= 37.6 && T < 40) {
          for (let k = 0; k < 4; k++) kit.dot(c, px - ps * 0.4 + k * ps * 0.27, py - ps * 0.2 + ((shake * 30 + k * 13) % 30), 2.5, kit.hue(200));
          kit.label(c, 'sweating', px, py + ps * 1.25, { size: 10.5, color: C.muted, align: 'center' });
        }
        if (T >= 40) {
          c.strokeStyle = C.bad; c.lineWidth = 1.5;
          for (let k = -1; k <= 1; k++) { c.beginPath(); for (let j = 0; j < 8; j++) c.lineTo(px + k * ps * 0.5 + Math.sin(j + shake * 6) * 3, py - ps * 1.9 - j * 4); c.stroke(); }
          kit.label(c, 'hot, confused', px, py + ps * 1.25, { size: 10.5, color: C.bad, align: 'center' });
        }
        if (T < 32) kit.label(c, 'still, drowsy or unresponsive', px, py + ps * 1.25, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, T.toFixed(1) + ' °C', px, py + ps * 1.25 + 22, { size: 18, weight: 700, align: 'center' });
        kit.label(c, S[2], px, py + ps * 1.25 + 44, { size: 12.5, weight: 650, align: 'center', color: S[5] > 180 ? kit.hue(S[5]) : S[5] < 40 ? C.bad : C.ok });
        // ---- the cooling curve
        const gx0 = Math.max(px + 90, W * 0.66), gx1 = W - 14, gy0 = 26, gy1 = Hh * 0.62;
        if (gx1 - gx0 > 80) {
          const tEnd = Math.max(40, minutes);
          const GX = m => gx0 + m / tEnd * (gx1 - gx0), GY = t => gy1 - (clamp(t, 38, 43) - 38) / 5 * (gy1 - gy0);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let t = 38; t <= 43; t++) { c.beginPath(); c.moveTo(gx0, GY(t)); c.lineTo(gx1, GY(t)); c.stroke(); kit.label(c, t + '', gx0 - 4, GY(t), { size: 9.5, color: C.muted, align: 'right' }); }
          c.setLineDash([4, 4]); c.strokeStyle = C.ok; c.beginPath(); c.moveTo(gx0, GY(39)); c.lineTo(gx1, GY(39)); c.stroke();
          c.strokeStyle = C.warn; c.beginPath(); c.moveTo(GX(30), gy0); c.lineTo(GX(30), gy1); c.stroke(); c.setLineDash([]);
          kit.label(c, 'target 39 °C', gx1, GY(39) + 10, { size: 9.5, color: C.ok, align: 'right' });
          kit.label(c, '30 min', GX(30) + 3, gy0 + 6, { size: 9.5, color: C.warn });
          if (curve.length > 1) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); curve.forEach((p, i) => i ? c.lineTo(GX(p[0]), GY(p[1])) : c.moveTo(GX(p[0]), GY(p[1]))); c.stroke(); c.lineWidth = 1; }
          kit.label(c, 'cooling (minutes)', (gx0 + gx1) / 2, gy1 + 14, { size: 10, color: C.muted, align: 'center' });
          if (!curve.length) kit.label(c, 'press Heatstroke, then Start cooling', (gx0 + gx1) / 2, (gy0 + gy1) / 2, { size: 10.5, color: C.muted, align: 'center' });
        }
        ro.set('T', T.toFixed(1) + ' °C');
        ro.set('stage', S[2]);
        ro.set('see', S[3]);
        ro.set('do', S[4]);
        const need = Math.max(0, (curve.length ? curve[0][1] : 42) - 39) / V.method;
        ro.set('cool', curve.length ? (cooling ? 'cooling… ' + Math.round(minutes) + ' min' : T <= 39.001 ? 'reached 39 °C after ' + Math.round(minutes) + ' min' : 'stopped at ' + Math.round(minutes) + ' min') : 'from 42 to 39 °C at this rate: about ' + Math.round(need) + ' min');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ choking: a decision flow */
  Hyper.sim('fa-choking-flow', {
    title: 'Choking: what would you do?',
    blurb: `A choking scenario, step by step. Read what you see and click what you would do; a wrong choice explains why and lets you try again. Each **New scenario** turns out differently — sometimes a cough clears it, sometimes you need several rounds, sometimes the person collapses.

- Try it for an **adult**, a **child** and an **infant**: the steps are the same idea, but a baby gets **chest** thrusts, never abdominal thrusts.
- The sequence follows the European Resuscitation Council (back blows first, then abdominal thrusts, alternating), which the American Heart Association also adopted in its 2025 update.
- Practising the hand positions on a manikin is the only way to be ready: look for a first-aid course near you.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'who', type: 'select', label: 'Who is choking', options: [['An adult', 'adult'], ['A child (over 1 year)', 'child'], ['An infant (under 1 year)', 'infant']], value: (params && params.who) || 'adult' },
        { type: 'buttons', items: [{ id: 'new', label: 'New scenario', primary: true }] }
      ], id => { if (id === 'who' || id === 'new') start(); });
      const ro = kit.readout(box.side, [['step', 'Step'], ['sets', 'Rounds of blows and thrusts'], ['score', 'Your choices: right / wrong']]);
      const V = ctl.values;
      let seed = 3, R = kit.fin.uniforms(seed), S = null, state = 'start', feedback = null, rounds = 0, right = 0, wrong = 0, usedThrusts = false, buttons = [], hoverB = null, pulse = 0;
      function start() {
        R = kit.fin.uniforms(seed++);
        const u = R();
        S = { severe: R() < 0.6, mildClears: R() < 0.6, clearAt: u < 0.25 ? 1 : u < 0.5 ? 2 : u < 0.7 ? 3 : u < 0.85 ? 4 : 99, collapseAfter: 4 };
        state = 'start'; feedback = null; rounds = 0; usedThrusts = false;
      }
      const baby = () => V.who === 'infant';
      const who = () => V.who === 'adult' ? 'the man' : V.who === 'child' ? 'the girl' : 'the baby';
      const Who = () => { const w = who(); return w[0].toUpperCase() + w.slice(1); };
      function scene() {
        if (V.who === 'adult') return 'In a restaurant, a man at the next table suddenly stops talking mid-bite, stands up and grips his throat. He looks frightened.';
        if (V.who === 'child') return 'At a birthday party, a 6-year-old girl who was running around with sweets in her mouth suddenly stops, clutches her throat and looks at you in panic.';
        return 'A 9-month-old baby in a high chair, eating finger food, suddenly goes quiet, with a strained face and wide eyes.';
      }
      function signs(severe) {
        if (baby()) return severe ? 'The baby cannot cry or cough; there is only a faint high-pitched squeak, and the lips are turning blue.' : 'The baby is coughing hard and crying loudly between coughs.';
        return severe ? Who() + ' nods but cannot speak; the coughs are silent and the lips are turning blue.' : Who() + ' is coughing hard and noisily and can say a few words.';
      }
      const thrustName = () => baby() ? 'chest thrusts' : 'abdominal thrusts';
      // the steps: text shown, choices [label, verdict 'ok' | 'meh' | 'bad', feedback, next]
      function step() {
        const B = baby();
        switch (state) {
          case 'start': return { h: 'What do you do first?', t: scene(), c: [
            [B ? 'Look and listen: can the baby cry or cough?' : 'Ask loudly: “Are you choking?”', 'ok', null, 'assess'],
            ['Slap ' + (B ? 'its' : 'their') + ' back straight away', 'bad', 'Not yet. First find out whether the cough still works: a strong cough is the best way to clear the airway, and back blows are for when coughing fails.'],
            ['Give ' + (B ? 'the baby' : 'them') + ' a drink of water', 'bad', 'Nothing to drink: water cannot get past a blocked airway and may be breathed in.'],
            ['Call the emergency number and wait for the ambulance', 'bad', 'Waiting costs minutes the brain does not have. Act now, and get someone else to make the call.']] };
          case 'assess': return { h: 'Mild or severe?', t: signs(S.severe), c: [
            ['Mild — ' + (B ? 'crying and coughing' : 'coughing and speaking') + ': encourage coughing and watch', S.severe ? 'bad' : 'ok', S.severe ? 'Silent coughs, no voice and blue lips mean the airway is almost or completely blocked: this is severe, act now.' : null, 'mild'],
            ['Severe — cannot breathe, speak or cough effectively: act now', S.severe ? 'ok' : 'bad', S.severe ? null : 'A loud cough and a voice mean air is moving: the cough is doing better than any blow could. Encourage it and watch closely.', 'severe']] };
          case 'mild': return S.mildClears ?
            { h: 'Keep watching', t: 'You stay close and encourage ' + who() + ' to keep coughing. After a few big coughs the piece of food comes out and the breathing settles.', c: [['Stay with ' + (B ? 'the baby' : 'them') + ' for a while', 'ok', null, 'cleared']] } :
            { h: 'It is getting worse', t: 'You encourage coughing, but the coughs become weak and silent. ' + (B ? 'The crying has stopped.' : Who() + ' can no longer speak and is starting to panic.'), c: [
              ['It is now severe: act', 'ok', null, 'severe'],
              ['Keep encouraging coughing', 'bad', 'When the cough stops working, coughing alone will not clear it. It is now severe: act.']] };
          case 'severe': return { h: 'Severe obstruction', t: 'Shout for help: anyone nearby should call the emergency number (speaker on) while you act. What now?', c: B ? [
              ['Up to 5 back blows, the baby face down along your forearm, head lower than the chest', 'ok', null, 'bb'],
              ['Up to 5 abdominal thrusts', 'bad', 'Never abdominal thrusts in a baby under one year: they can injure the liver and other organs. Babies get back blows and chest thrusts.'],
              ['Hold the baby upside down by the ankles and shake', 'bad', 'Dangerous and not effective. Support the baby on your forearm, head low, and give back blows.'],
              ['Sweep a finger through the mouth to find the object', 'bad', 'Blind finger sweeps can push the object deeper. Only remove something you can clearly see.']] : [
              ['Up to 5 sharp back blows', 'ok', null, 'bb'],
              ['Up to 5 abdominal thrusts', 'meh', 'Also effective, and long the main American teaching — but European guidelines and, since 2025, American ones start with back blows and then alternate. Carry on with thrusts.', 'thrust'],
              ['Lay ' + (V.who === 'adult' ? 'him' : 'her') + ' down and start CPR', 'bad', 'Not while ' + (V.who === 'adult' ? 'he' : 'she') + ' is conscious: CPR is for when the person becomes unresponsive.'],
              ['Sweep a finger through the mouth to find the object', 'bad', 'Blind finger sweeps can push the object deeper. Only remove something you can clearly see.']] };
          case 'bb': {
            const how = B ? 'Baby face down along your forearm, head lower than the body, jaw supported with your hand; you give up to 5 firm blows between the shoulder blades with the heel of your other hand.' :
              (V.who === 'child' ? 'Standing or kneeling beside her, you support her chest, lean her forward' : 'Standing beside him, you support his chest with one hand, lean him well forward') + ' and give up to 5 sharp blows between the shoulder blades with the heel of your hand, checking after each one.';
            if (rounds + 1 >= S.clearAt) return { h: 'Back blows', t: how + ' On blow 3 the piece of food flies out.', c: [['Check the breathing and stay with ' + (B ? 'the baby' : 'them'), 'ok', null, 'cleared', 1]] };
            return { h: 'Back blows', t: how + ' It is still stuck. What next?', c: [
              ['Up to 5 ' + thrustName(), 'ok', null, 'thrust', 1],
              ['More back blows, and keep going with only those', 'bad', 'Alternate: if five back blows do not work, switch to five ' + thrustName() + ' — they push air out of the lungs in a different way.'],
              ['Stop and wait for the ambulance', 'bad', 'Do not stop while ' + (B ? 'the baby is' : 'the person is') + ' conscious and blocked: keep alternating until it clears or help takes over.']] };
          }
          case 'thrust': {
            const how = B ? 'Baby turned face up along your forearm, head low; you give up to 5 chest thrusts on the lower half of the breastbone — like compressions, but sharper and slower.' :
              'From behind, you put a fist just above the navel, grasp it with your other hand and pull sharply inwards and upwards, up to 5 times' + (V.who === 'child' ? ', kneeling to her height.' : '.');
            if (rounds + 1 >= S.clearAt) return { h: B ? 'Chest thrusts' : 'Abdominal thrusts', t: how + ' The object pops out and ' + who() + (B ? ' starts to cry.' : ' gasps and starts breathing.'), c: [['Check the breathing and stay with ' + (B ? 'the baby' : 'them'), 'ok', null, 'cleared', 1]] };
            if (rounds + 1 >= S.collapseAfter) return { h: 'Still blocked', t: how + ' Nothing comes out, and ' + who() + ' goes limp and stops responding.', c: [['What now?', 'ok', null, 'collapse', 1]] };
            return { h: B ? 'Chest thrusts' : 'Abdominal thrusts', t: how + ' It is still stuck. Next?', c: [
              ['Back to up to 5 back blows', 'ok', null, 'bb', 1],
              ['Keep going with ' + thrustName() + ' only', 'bad', 'Keep alternating the two: 5 back blows, then 5 ' + thrustName() + '.'],
              ['Give up: nothing is working', 'bad', 'Keep going: many obstructions clear after several rounds, and if the person collapses, CPR itself can push the object out.']] };
          }
          case 'collapse': return { h: 'Unresponsive', t: Who() + ' is now unresponsive and not breathing normally.', c: B ? [
              ['Put the baby on a firm surface, make sure the emergency number is called (speaker on) and start infant CPR', 'ok', null, 'cpr'],
              ['Keep giving back blows and chest thrusts', 'bad', 'Once the baby is unresponsive, switch to CPR: its compressions also act as chest thrusts.'],
              ['Recovery position and wait', 'bad', 'The baby is not breathing normally: this is cardiac arrest territory and needs CPR now.']] : [
              ['Lower ' + (V.who === 'adult' ? 'him' : 'her') + ' to the floor, make sure the emergency number is called (speaker on) and start CPR', 'ok', null, 'cpr'],
              ['Keep giving abdominal thrusts', 'bad', 'Once the person is unresponsive, switch to CPR: chest compressions raise the pressure in the chest and can push the object out.'],
              ['Recovery position and wait for the ambulance', 'bad', 'Not breathing normally means cardiac arrest is near or present: start CPR now.'],
              ['Blind finger sweep to find it', 'bad', 'Never a blind sweep. When you open the airway for breaths, remove only what you can see.']] };
          case 'cpr': return { h: 'CPR', t: 'Chest compressions squeeze the chest and may push the object out. Each time you open the airway for breaths, look in the mouth and remove anything you can clearly see — no blind sweeps. Keep going until help takes over or ' + who() + ' starts breathing normally. End of this scenario.', c: [['New scenario', 'ok', null, 'restart']] };
          case 'cleared': return { h: 'Cleared', t: 'The airway is clear and ' + who() + ' is breathing. ' + (usedThrusts ? 'Because ' + thrustName() + ' can cause internal injuries, ' + (B ? 'the baby' : 'the person') + ' should be checked by a doctor today. ' : '') + 'A cough that will not settle, difficulty swallowing or the feeling that something is still stuck also need a doctor. End of this scenario.', c: [['New scenario', 'ok', null, 'restart']] };
        }
        return { h: '', t: '', c: [['New scenario', 'ok', null, 'restart']] };
      }
      function choose(ch) {
        const [label, verdict, fb, next, counts] = ch;
        if (verdict === 'bad') { wrong++; feedback = { ok: false, text: fb }; return; }
        if (next !== 'restart' && label !== 'What now?') right++;
        feedback = verdict === 'meh' ? { ok: true, meh: true, text: fb } : null;
        if (counts) rounds++;
        if (state === 'severe' && next === 'thrust') usedThrusts = true;
        if (state === 'bb' && next === 'thrust') usedThrusts = true;
        if (state === 'thrust') usedThrusts = true;
        if (next === 'restart') { start(); return; }
        if (next) state = next;
      }
      kit.click(st, p => { const b = buttons.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (b) { choose(b.ch); loop.once(); } },
        p => { hoverB = buttons.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h) || null; return !!hoverB; });
      const FLOW = [['assess', 'Ask and look: can they cough?'], ['mild', 'Mild: encourage coughing'], ['bb', 'Severe: up to 5 back blows'], ['thrust', 'Up to 5 thrusts (abdominal; chest in a baby)'], ['cpr', 'Unresponsive: call, start CPR']];
      const flowIndex = { start: 0, assess: 0, mild: 1, severe: 2, bb: 2, thrust: 3, collapse: 4, cpr: 4, cleared: -1 };
      start();
      function draw(dt) {
        pulse += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const narrow = W < 560;
        const cur = flowIndex[state];
        // ---- the flowchart
        let cardX = 14;
        if (!narrow) {
          const fx = 14, fw = W * 0.34, bh = Math.min(52, (Hh - 40) / 5 - 14), gap = ((Hh - 20) - 5 * bh) / 5;
          FLOW.forEach((f, i) => {
            const y = 14 + i * (bh + gap), on = i === cur;
            c.fillStyle = on ? C.accent : C.surface; c.globalAlpha = on ? 0.18 + 0.08 * Math.sin(pulse * 4) : 1;
            rrect(c, fx, y, fw, bh, 8); c.fill(); c.globalAlpha = 1;
            c.strokeStyle = on ? C.accent : C.border2; c.lineWidth = on ? 2.2 : 1.2; rrect(c, fx, y, fw, bh, 8); c.stroke();
            wrap(c, (i + 1) + '. ' + f[1], fx + 10, y + Math.max(4, bh / 2 - 15), fw - 20, 15, FONT(12, on ? 650 : 500), on ? C.text : C.text2);
            if (i < 4) kit.arrow(c, fx + fw / 2, y + bh + 2, fx + fw / 2, y + bh + gap - 3, C.muted, 1.5, 7);
          });
          // back blows and thrusts alternate
          const yb = 14 + 2 * (bh + gap) + bh / 2, yt = 14 + 3 * (bh + gap) + bh / 2;
          c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(fx + fw, yt); c.lineTo(fx + fw + 12, yt); c.lineTo(fx + fw + 12, yb); c.stroke();
          kit.arrow(c, fx + fw + 12, yb, fx + fw + 2, yb, C.muted, 1.2, 6);
          kit.label(c, 'repeat', fx + fw + 16, (yb + yt) / 2, { size: 10, color: C.muted });
          cardX = fx + fw + 56;
        } else {
          FLOW.forEach((f, i) => kit.dot(c, 20 + i * 22, 14, 6, i === cur ? C.accent : C.grid));
        }
        // ---- the scenario card
        const s = step();
        const cw = W - cardX - 14, top = narrow ? 30 : 14;
        const fs = narrow ? 12 : 13, fb = narrow ? 11.5 : 12.5, lh = narrow ? 15 : 18, lb = narrow ? 15 : 16;
        let y = top;
        kit.label(c, s.h, cardX, y + 8, { size: 15, weight: 700 });
        y += 24;
        y = wrap(c, s.t, cardX, y, cw, lh, FONT(fs), C.text) + 6;
        if (feedback) {
          const col = feedback.ok ? C.warn : C.bad;
          y = wrap(c, (feedback.ok ? 'Note: ' : 'Not the best choice: ') + feedback.text, cardX, y, cw, lb, FONT(fb, 600), col) + 8;
        }
        buttons = [];
        for (const ch of s.c) {
          const hgt = wrap(c, ch[0], 0, 0, cw - 24, lb, FONT(fb, 600), C.text, false) + 12;
          const b = { x: cardX, y, w: cw, h: hgt, ch };
          c.fillStyle = hoverB && hoverB.ch === ch ? C.accent : C.surface; c.globalAlpha = hoverB && hoverB.ch === ch ? 0.25 : 1;
          rrect(c, b.x, b.y, b.w, b.h, 8); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.accent; c.lineWidth = 1.3; rrect(c, b.x, b.y, b.w, b.h, 8); c.stroke();
          wrap(c, ch[0], b.x + 12, b.y + 6, cw - 24, lb, FONT(fb, 600), C.text);
          buttons.push(b);
          y += hgt + (narrow ? 6 : 8);
        }
        ro.set('step', s.h || '—');
        ro.set('sets', String(rounds));
        ro.set('score', right + ' / ' + wrong);
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
