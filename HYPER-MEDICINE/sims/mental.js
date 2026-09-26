/* HYPER-MEDICINE · sims/mental.js — Mind and Mental Health simulations. All are schematic
 * and gentle: pictures that teach one idea each, never data about a real person.
 *   mh-stress-curve    arousal and performance (the inverted U), and stress piling up over weeks
 *   mh-anxiety-cycle   anxiety across repeated sessions: escape, safety behaviours, exposure
 *   mh-mood-chart      a year of mood: everyday ups and downs, depression, bipolar patterns
 *   mh-tolerance       tolerance, dependence and withdrawal as the brain adapts to a drug
 *   mh-thought-record  a CBT thought record to work through by sorting the evidence
 *   mh-recovery        the course of recovery with and without treatment, gradual and uneven */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared drawing helpers */
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const smooth = x => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
  const font = (c, size, weight) => { c.font = (weight || 500) + ' ' + size + 'px ' + FONT; };
  const pct = v => Math.round(v) + ' %';

  function wrap(c, text, maxW) {
    const words = String(text).split(/\s+/).filter(Boolean), lines = [];
    let cur = '';
    for (const w of words) {
      const t = cur ? cur + ' ' + w : w;
      if (cur && c.measureText(t).width > maxW) { lines.push(cur); cur = w; } else cur = t;
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }
  function rrect(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, Math.max(0, w), Math.max(0, h), r); else c.rect(x, y, Math.max(0, w), Math.max(0, h));
  }
  // axes, grid and tick labels for a plotting box b = { x, y, w, h }; returns the maps X, Y
  function frame(c, C, b, xr, yr, o) {
    o = o || {};
    const X = x => b.x + (x - xr[0]) / (xr[1] - xr[0]) * b.w;
    const Y = y => b.y + b.h - (y - yr[0]) / (yr[1] - yr[0]) * b.h;
    c.save();
    c.lineWidth = 1; font(c, 10.5); c.fillStyle = C.muted; c.strokeStyle = C.grid;
    for (const t of o.yTicks || []) {
      const y = Y(t[0]);
      c.beginPath(); c.moveTo(b.x, y); c.lineTo(b.x + b.w, y); c.stroke();
      if (t[1] != null) { c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(t[1], b.x - 5, y); }
    }
    for (const t of o.xTicks || []) {
      const x = X(t[0]);
      c.beginPath(); c.moveTo(x, b.y); c.lineTo(x, b.y + b.h); c.stroke();
      if (t[1] != null) { c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(t[1], x, b.y + b.h + 4); }
    }
    c.strokeStyle = C.axis; c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(b.x, b.y + b.h); c.lineTo(b.x + b.w, b.y + b.h); c.stroke();
    if (o.xLabel) { c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(o.xLabel, b.x + b.w / 2, b.y + b.h + 18); }
    if (o.yLabel) {
      c.translate(b.x - (o.yGap || 36), b.y + b.h / 2); c.rotate(-Math.PI / 2);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(o.yLabel, 0, 0);
    }
    c.restore();
    return { X, Y };
  }
  function line(c, pts, X, Y, color, width, dash, alpha) {
    if (!pts || pts.length < 2) return;
    c.save();
    c.globalAlpha = alpha == null ? 1 : alpha;
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])));
    c.stroke();
    c.restore();
  }
  // shade between a series and a level: one colour above it, another below
  function fillTo(c, pts, X, Y, level, up, down, alpha) {
    if (!pts || pts.length < 2) return;
    c.save();
    c.globalAlpha = alpha == null ? 0.3 : alpha;
    for (const [col, sgn] of [[up, 1], [down, -1]]) {
      if (!col) continue;
      c.fillStyle = col; c.beginPath(); c.moveTo(X(pts[0][0]), Y(level));
      for (const p of pts) c.lineTo(X(p[0]), Y(sgn > 0 ? Math.max(level, p[1]) : Math.min(level, p[1])));
      c.lineTo(X(pts[pts.length - 1][0]), Y(level)); c.closePath(); c.fill();
    }
    c.restore();
  }
  function vmark(c, C, X, b, x, text, kit, color) {
    c.save();
    c.strokeStyle = color || C.muted; c.setLineDash([4, 4]); c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(X(x), b.y); c.lineTo(X(x), b.y + b.h); c.stroke();
    c.restore();
    if (text) kit.label(c, text, X(x) + 4, b.y + 9, { size: 10.5, color: color || C.muted, bg: C.bg2 });
  }

  /* ================================================================ 1 · STRESS */
  Hyper.sim('mh-stress-curve', {
    title: 'Stress: the curve and the weeks',
    blurb: `Two schematic pictures of stress.

**Arousal and performance** — the inverted U. Slide **Arousal** from calm to keyed-up and watch performance rise, peak and fall.
- Compare a simple, familiar task with a complex or new one: the peak for the complex task comes at a lower level of arousal.
- It is a teaching picture, not a law — people and tasks vary.

**Stress over eight weeks** — each stressful event sends stress up, and it settles over the following days.
- With one or two events a week and a quick recovery, stress returns to baseline in between: short bursts, which the body handles well.
- Add events or slow the recovery: the peaks pile up, stress stops returning to baseline and the background load (dashed) creeps up — chronic stress.
- Tick **Sleep, activity and support**: each event lands a little softer and settles sooner.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const p = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Arousal and performance', 'curve'], ['Stress over eight weeks', 'weeks']], value: p.view === 'weeks' ? 'weeks' : 'curve' },
        { id: 'arousal', label: 'Arousal (how keyed-up)', min: 0, max: 100, step: 1, value: 45, unit: '%' },
        { id: 'task', type: 'select', label: 'The task', options: [['Complex or new', 'complex'], ['Simple and familiar', 'simple']], value: 'complex' },
        { id: 'events', label: 'Stressful events a week', min: 0, max: 7, step: 1, value: 2 },
        { id: 'recovery', label: 'Time to settle after each', min: 0.5, max: 6, step: 0.5, value: 1.5, unit: 'days' },
        { id: 'buffers', type: 'check', label: 'Sleep, activity and support', value: false },
        { type: 'buttons', items: [{ id: 'reseed', label: 'Different weeks' }] }
      ], id => { if (id === 'reseed') seed++; build(); modes(); });
      const ro = kit.readout(box.side, [['zone', 'Where you are'], ['perf', 'Performance'], ['feel', 'What it can feel like'],
        ['peak', 'Highest stress'], ['strain', 'Time in the strain zone'], ['load', 'Background load, week 8']]);
      const V = ctl.values;
      let seed = 3, series = [], loadS = [], evs = [], stats = { above: 0, peak: 0, load: 0 }, tNow = 0;

      const shape = task => task === 'simple' ? { o: 0.62, w: 0.34 } : { o: 0.4, w: 0.24 };
      const perf = (a, task) => { const s = shape(task); return 0.08 + 0.92 * Math.exp(-((a - s.o) / s.w) * ((a - s.o) / s.w)); };
      const ZONE = 0.63;   // half-width of "in the zone" in units of w: performance at least 70 % of the best

      function modes() {
        const w = V.view === 'weeks';
        for (const k of ['arousal', 'task']) ctl.show(k, !w);
        for (const k of ['events', 'recovery', 'buffers', 'reseed']) ctl.show(k, w);
        for (const k of ['zone', 'perf', 'feel']) ro.show(k, !w);
        for (const k of ['peak', 'strain', 'load']) ro.show(k, w);
      }
      function build() {
        const u = kit.fin.uniforms(seed * 7919 + 11);
        evs = [];
        for (let w = 0; w < 8; w++) for (let k = 0; k < V.events; k++) evs.push({ t: w * 7 + u() * 7, a: 20 + 18 * u() });
        evs.sort((a, b) => a.t - b.t);
        const amp = V.buffers ? 0.8 : 1, tau = Math.max(0.2, V.recovery * (V.buffers ? 0.6 : 1)), dt = 0.1, base = 6;
        let S = base, L = base, j = 0, above = 0, peak = 0;
        series = []; loadS = [];
        for (let i = 0; i <= 560; i++) {
          const t = i * dt;
          while (j < evs.length && evs[j].t <= t) { S = Math.min(100, S + evs[j].a * amp); j++; }
          const shown = S;
          series.push([t, shown]); loadS.push([t, L]);
          if (shown > 50) above++;
          peak = Math.max(peak, shown);
          S = base + (S - base) * Math.exp(-dt / tau);
          L += (S - L) * dt / 10;
        }
        stats = { above: above / series.length, peak, load: L };
        tNow = 0;
      }
      function report() {
        const s = shape(V.task), a = V.arousal / 100, P = perf(a, V.task);
        const zone = a < s.o - ZONE * s.w ? 0 : a > s.o + ZONE * s.w ? 2 : 1;
        ro.set('zone', ['Under-aroused', 'In the zone', 'Over-aroused'][zone]);
        ro.set('perf', pct(100 * P) + ' of your best');
        ro.set('feel', ['bored, flat, easily distracted', 'alert and focused: challenged but coping', 'racing heart, tense, mind going blank, mistakes creeping in'][zone]);
        ro.set('peak', Math.round(stats.peak) + ' / 100');
        ro.set('strain', pct(100 * stats.above) + ' of the time');
        ro.set('load', Math.round(stats.load) + ' / 100' + (stats.load > 30 ? ' — building up' : ' — low'));
      }
      function drawCurve(c, C) {
        const W = st.W, Hh = st.H;
        const b = { x: 54, y: 44, w: Math.max(60, W - 54 - 16), h: Math.max(60, Hh - 44 - 48) };
        const s = shape(V.task);
        const { X, Y } = frame(c, C, b, [0, 100], [0, 100], {
          yTicks: [[0, '0'], [25, null], [50, '50'], [75, null], [100, '100']],
          xTicks: [[0, 'calm'], [50, null], [100, null]],
          xLabel: 'arousal / stress (schematic)', yLabel: 'performance', yGap: 38
        });
        kit.label(c, 'very high', b.x + b.w, b.y + b.h + 10, { size: 10.5, color: C.muted, align: 'right' });
        // the three zones for the chosen task
        const z1 = 100 * clamp(s.o - ZONE * s.w, 0, 1), z2 = 100 * clamp(s.o + ZONE * s.w, 0, 1);
        c.save();
        c.globalAlpha = 0.1; c.fillStyle = C.muted; c.fillRect(X(0), b.y, X(z1) - X(0), b.h);
        c.globalAlpha = 0.12; c.fillStyle = C.ok; c.fillRect(X(z1), b.y, X(z2) - X(z1), b.h);
        c.globalAlpha = 0.1; c.fillStyle = C.bad; c.fillRect(X(z2), b.y, X(100) - X(z2), b.h);
        c.restore();
        kit.label(c, 'bored', (X(0) + X(z1)) / 2, b.y - 11, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'in the zone', (X(z1) + X(z2)) / 2, b.y - 11, { size: 11, color: C.ok, align: 'center', weight: 600 });
        kit.label(c, 'overloaded', (X(z2) + X(100)) / 2, b.y - 11, { size: 11, color: C.bad, align: 'center' });
        const other = V.task === 'simple' ? 'complex' : 'simple';
        const pts = task => { const out = []; for (let i = 0; i <= 100; i++) out.push([i, 100 * perf(i / 100, task)]); return out; };
        line(c, pts(other), X, Y, C.muted, 1.6, [5, 5]);
        line(c, pts(V.task), X, Y, C.accent, 2.8);
        const name = t => t === 'simple' ? 'simple, familiar task' : 'complex or new task';
        kit.label(c, '— ' + name(V.task), b.x, 11, { size: 10.5, color: C.accent, weight: 600 });
        kit.label(c, '- - ' + name(other), b.x + 152, 11, { size: 10.5, color: C.muted });
        const a = V.arousal;
        const y = Y(100 * perf(a / 100, V.task));
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = 0.5; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(X(a), b.y + b.h); c.lineTo(X(a), y); c.stroke(); c.restore();
        kit.dot(c, X(a), y, 7, C.accent, C.bg2);
        kit.label(c, 'you', X(a) + 10, y - 12, { size: 11.5, weight: 650, color: C.accent });
      }
      function drawWeeks(c, C, dt) {
        tNow = Math.min(56, tNow + (dt || 0) * 8);
        const W = st.W, Hh = st.H;
        const b = { x: 50, y: 22, w: Math.max(60, W - 50 - 16), h: Math.max(60, Hh - 22 - 50) };
        const xt = []; for (let w = 0; w <= 8; w++) xt.push([w * 7, W < 460 && w % 2 ? null : 'wk ' + w]);
        const { X, Y } = frame(c, C, b, [0, 56], [0, 100], { yTicks: [[0, '0'], [50, '50'], [100, '100']], xTicks: xt, xLabel: 'weeks', yLabel: 'stress (schematic)', yGap: 34 });
        c.save(); c.globalAlpha = 0.09; c.fillStyle = C.bad; c.fillRect(b.x, Y(100), b.w, Y(50) - Y(100)); c.restore();
        kit.label(c, 'strain zone', b.x + b.w - 6, Y(94), { size: 10.5, color: C.bad, align: 'right' });
        const shown = series.filter(q => q[0] <= tNow), shownL = loadS.filter(q => q[0] <= tNow);
        fillTo(c, shown, X, Y, 0, C.accent, null, 0.14);
        line(c, shown, X, Y, C.accent, 2);
        line(c, shownL, X, Y, C.warn, 2, [6, 4]);
        for (const e of evs) if (e.t <= tNow) { c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(X(e.t), b.y + b.h); c.lineTo(X(e.t), b.y + b.h - 7); c.stroke(); c.restore(); }
        kit.label(c, 'stress', b.x + 8, b.y + 8, { size: 11, color: C.accent, weight: 600 });
        kit.label(c, 'background load', b.x + 56, b.y + 8, { size: 11, color: C.warn, weight: 600 });
        kit.label(c, '| event', b.x + 160, b.y + 8, { size: 11, color: C.warn });
        if (shown.length) { const q = shown[shown.length - 1]; kit.dot(c, X(q[0]), Y(q[1]), 4.5, C.accent, C.bg2); }
      }
      function draw(dt) {
        const C = kit.colors(), c = st.begin();
        if (V.view === 'weeks') drawWeeks(c, C, dt); else drawCurve(c, C);
        report();
      }
      build(); modes();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2 · THE ANXIETY CYCLE */
  const FEARS = {
    train: { name: 'A crowded train (panic)', ladder: ['standing on the platform', 'one stop, off-peak', 'three stops, off-peak', 'one stop at rush hour', 'the whole journey at rush hour'] },
    dog: { name: 'Dogs (a phobia)', ladder: ['looking at photos of dogs', 'a small dog across the park', 'a calm dog on a lead nearby', 'stroking a calm dog', 'a friend\'s lively dog'] },
    social: { name: 'Speaking up (social anxiety)', ladder: ['asking a shop assistant a question', 'a comment to one colleague', 'a question in a small meeting', 'an opinion in a team meeting', 'a short talk to the team'] },
    reminder: { name: 'Reminders of a frightening event', ladder: ['writing a few lines about it', 'looking at a photo of the place', 'passing the place as a passenger', 'visiting the place with a friend', 'going there alone'] }
  };
  const STRATS = [['Escape when it peaks (avoidance)', 'escape'], ['Stay, leaning on safety behaviours', 'safety'], ['Stay and let it pass (exposure)', 'exposure']];
  const LEARNS = {
    escape: '"Leaving is what kept me safe." The fear is never tested, so it stays or grows — and avoidance tends to spread.',
    safety: '"I only got through because of my safety behaviour." Some learning, but the fear falls slowly.',
    exposure: '"It was hard, but what I feared did not happen — and I coped." Each session starts lower.'
  };
  Hyper.sim('mh-anxiety-cycle', {
    title: 'The anxiety cycle: avoidance and exposure',
    blurb: `Anxiety (0–100, as people rate it in therapy) during repeated visits to a feared situation, one curve per session. Schematic: real sessions are bumpier, but the pattern is well established.

- **Escape when it peaks**: anxiety drops fast after leaving — that relief is what teaches the brain to escape again. Session after session the peak stays high, or rises.
- **Safety behaviours** (sitting by the door, carrying water, rehearsing every word) take the edge off but block the learning, so the fear fades only slowly.
- **Exposure**: staying lets anxiety rise, peak and fall on its own, and the next session starts lower. In therapy this is done gradually, up a ladder of steps the person chooses — try a higher **step**.
- Modern research suggests the key is not that anxiety falls within a session but that the person learns the feared outcome does not happen, or that they can cope.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const p = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'fear', type: 'select', label: 'The fear', options: Object.keys(FEARS).map(k => [FEARS[k].name, k]), value: FEARS[p.fear] ? p.fear : 'train' },
        { id: 'strategy', type: 'select', label: 'What the person does', options: STRATS, value: LEARNS[p.strategy] ? p.strategy : 'escape' },
        { id: 'step', label: 'Step on the fear ladder', min: 1, max: 5, step: 1, value: 2 },
        { id: 'n', label: 'Sessions', min: 2, max: 10, step: 1, value: 6 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play again', primary: true }] }
      ], () => build());
      const ro = kit.readout(box.side, [['what', 'The situation'], ['first', 'Peak anxiety, session 1'], ['last', 'Peak anxiety, last session'], ['learn', 'What the brain learns']]);
      const V = ctl.values;
      let sessions = [], clock = 0;
      const PER = 2.4;   // seconds of animation per session

      function curve(E, strat) {
        const a0 = 0.45 * E, pts = [];
        let peak = 0;
        for (let i = 0; i <= 120; i++) {
          const t = i * 0.25;
          let A;
          if (t <= 3) A = a0 + (E - a0) * smooth(t / 3);
          else if (strat === 'escape') A = 8 + (E - 8) * Math.exp(-(t - 3) / 1.2);
          else if (strat === 'safety') { const f = 0.55 * E; A = f + (E - f) * Math.exp(-(t - 3) / 12); }
          else A = 10 + (E - 10) * Math.exp(-(t - 3) / 6.5);
          pts.push([t, A]);
          peak = Math.max(peak, A);
        }
        return { pts, peak };
      }
      function build() {
        sessions = []; clock = 0;
        let E = Math.min(95, 50 + 9 * V.step);
        const n = Math.round(V.n);
        for (let k = 0; k < n; k++) {
          sessions.push(curve(E, V.strategy));
          E = V.strategy === 'escape' ? Math.min(97, E * 1.03 + 0.5) : V.strategy === 'safety' ? E * 0.95 : Math.max(18, E * 0.78);
        }
        const f = FEARS[V.fear] || FEARS.train;
        ro.set('what', 'Step ' + V.step + ': ' + f.ladder[clamp(Math.round(V.step), 1, 5) - 1]);
        const a = sessions[0].peak, b = sessions[sessions.length - 1].peak;
        ro.set('first', Math.round(a) + ' / 100');
        ro.set('last', Math.round(b) + ' / 100 (' + (b >= a ? '+' : '−') + Math.abs(Math.round(b - a)) + ')');
        ro.set('learn', LEARNS[V.strategy] || '');
      }
      const hueOf = peak => 125 * (1 - clamp((peak - 20) / 72, 0, 1));
      function draw(dt) {
        clock += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const side = clamp(W * 0.27, 96, 190);
        const b = { x: 50, y: 24, w: Math.max(60, W - 50 - side - 26), h: Math.max(60, Hh - 24 - 48) };
        const { X, Y } = frame(c, C, b, [0, 30], [0, 100], {
          yTicks: [[0, '0'], [25, null], [50, '50'], [75, null], [100, '100']],
          xTicks: [[0, '0'], [3, null], [10, '10'], [20, '20'], [30, '30 min']],
          xLabel: 'minutes in the situation', yLabel: 'anxiety', yGap: 34
        });
        const n = sessions.length, cur = Math.min(n - 1, Math.floor(clock / PER)), frac = clamp((clock - cur * PER) / (PER * 0.85), 0, 1);
        for (let k = 0; k <= cur; k++) {
          const s = sessions[k], last = k === cur;
          const pts = last ? s.pts.filter(q => q[0] <= 30 * frac + 0.01) : s.pts;
          const col = kit.hue(hueOf(s.peak));
          const alpha = last ? 1 : 0.3 + 0.4 * (k + 1) / (cur + 1);
          if (V.strategy === 'escape') {
            line(c, pts.filter(q => q[0] <= 3), X, Y, col, last ? 2.8 : 1.8, null, alpha);
            line(c, pts.filter(q => q[0] >= 3), X, Y, col, last ? 2.2 : 1.4, [5, 4], alpha);
          } else line(c, pts, X, Y, col, last ? 2.8 : 1.8, null, alpha);
          if (last && pts.length) { const q = pts[pts.length - 1]; kit.dot(c, X(q[0]), Y(q[1]), 5, col, C.bg2); }
        }
        if (V.strategy === 'escape') kit.label(c, 'leaves: quick relief', X(3) + 8, Y(sessions[cur].peak) - 4, { size: 10.5, color: C.muted, bg: C.bg2 });
        kit.label(c, 'session ' + (cur + 1) + ' of ' + n, b.x + b.w, b.y - 12, { size: 11.5, weight: 650, align: 'right' });
        // the peaks, session by session
        const bx = b.x + b.w + 26, bw = side - 10, gap = 3, cw = (bw - gap * (n - 1)) / n;
        kit.label(c, 'peak each session', bx + bw / 2, b.y - 12, { size: 10.5, color: C.muted, align: 'center' });
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 2, b.y + b.h); c.lineTo(bx + bw, b.y + b.h); c.stroke(); c.restore();
        for (let k = 0; k <= cur; k++) {
          const h = sessions[k].peak / 100 * b.h * (k === cur ? smooth(frac * 2) : 1);
          c.fillStyle = kit.hue(hueOf(sessions[k].peak));
          c.fillRect(bx + k * (cw + gap), b.y + b.h - h, Math.max(1, cw), h);
        }
        font(c, 10); c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let k = 0; k < n; k++) if (n <= 6 || k % 2 === 0) c.fillText(String(k + 1), bx + k * (cw + gap) + cw / 2, b.y + b.h + 4);
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3 · MOOD OVER A YEAR */
  const MOODS = [['Everyday ups and downs', 'everyday'], ['A depressive episode', 'depression'], ['Bipolar I', 'bipolar1'], ['Bipolar II', 'bipolar2'], ['Cyclothymia', 'cyclo']];
  const MOOD_TEXT = {
    everyday: 'Everyday ups and downs: mood shifts with events and settles again within days or weeks.',
    depression: 'A depressive episode: weeks to months of low mood well below the person\'s usual range.',
    bipolar1: 'Bipolar I: a manic episode, then a depressive one, with stable stretches between.',
    bipolar2: 'Bipolar II: short hypomanic highs and longer, heavier lows.',
    cyclo: 'Cyclothymia: frequent milder highs and lows over a long time, never reaching a full episode.'
  };
  function moodYear(pattern, treated, seed, fin) {
    const n = fin.normals(seed), u = fin.uniforms(seed * 17 + 3);
    const env = (d, e) => {
      const a = e.s, b = a + e.rise, h = b + e.hold, f = h + e.fall;
      return d < a || d >= f ? 0 : d < b ? smooth((d - a) / e.rise) : d < h ? 1 : 1 - smooth((d - h) / e.fall);
    };
    const jit = () => Math.round((u() - 0.5) * 30);
    const life = [];
    const nEv = pattern === 'everyday' ? 5 : 2;
    for (let k = 0; k < nEv; k++) life.push({ d: 15 + u() * 330, a: (u() < 0.55 ? -1 : 1) * (0.9 + 0.8 * u()), len: 4 + 10 * u() });
    const eps = [];
    let tx = null;
    if (pattern === 'depression') {
      const s = 75 + jit();
      if (treated) {
        tx = s + 42;
        eps.push({ s, rise: 24, hold: 26, fall: 85, depth: -3.8 });
        eps.push({ s: s + 90, rise: 5, hold: 6, fall: 10, depth: -1.1 });      // a setback on the way up
      } else eps.push({ s, rise: 24, hold: 150, fall: 70, depth: -3.8 });
    } else if (pattern === 'bipolar1') {
      const s = 60 + jit();
      eps.push({ s, rise: 6, hold: 14, fall: 10, depth: 4.3 });
      if (treated) tx = s + 18;
      eps.push(treated ? { s: s + 45, rise: 18, hold: 18, fall: 30, depth: -2.4 } : { s: s + 45, rise: 18, hold: 60, fall: 40, depth: -3.6 });
      const s3 = 280 + jit();
      eps.push(treated ? { s: s3, rise: 4, hold: 3, fall: 5, depth: 1.6 } : { s: s3, rise: 6, hold: 16, fall: 10, depth: 4.1 });
    } else if (pattern === 'bipolar2') {
      const s = 50 + jit();
      eps.push({ s, rise: 3, hold: 6, fall: 4, depth: 2.7 });
      eps.push(treated ? { s: s + 25, rise: 18, hold: 24, fall: 35, depth: -2.6 } : { s: s + 25, rise: 18, hold: 80, fall: 40, depth: -3.5 });
      if (treated) tx = s + 45;
      const s3 = 245 + jit();
      eps.push(treated ? { s: s3, rise: 3, hold: 3, fall: 3, depth: 1.5 } : { s: s3, rise: 3, hold: 7, fall: 4, depth: 2.8 });
      if (!treated) eps.push({ s: s3 + 30, rise: 15, hold: 30, fall: 20, depth: -3.2 });
    } else if (pattern === 'cyclo' && treated) tx = 0;
    let ar = 0, ph = u() * 6.28;
    const m = [];
    for (let d = 0; d < 365; d++) {
      ar = 0.8 * ar + 0.3 * n();
      let v = ar + (d % 7 >= 5 ? 0.2 : 0);
      for (const e of life) if (d >= e.d) v += e.a * Math.exp(-(d - e.d) / e.len);
      for (const e of eps) v += e.depth * env(d, e);
      if (pattern === 'cyclo') { ph += 2 * Math.PI / (26 + 14 * Math.sin(d / 47)); v += (treated ? 1.2 : 2.1) * Math.sin(ph); }
      m.push(clamp(v, -5, 5));
    }
    return { m, tx, eps };
  }
  Hyper.sim('mh-mood-chart', {
    title: 'A year of mood',
    blurb: `A mood chart of the kind people keep in a diary or an app: each day's mood from −5 (very low) to +5 (very high), 0 being the person's usual self. The years shown are made up, but the patterns follow the descriptions in the classifications.

- **Everyday ups and downs** stay mostly inside the usual range and recover after good and bad events.
- **A depressive episode** is a long stretch far below it. Tick **With treatment** to see treatment start at the marker: improvement is gradual, with a setback on the way.
- **Bipolar I and II** show episodes of mania or hypomania and of depression, with stable months between; treatment makes episodes shorter, milder and rarer.
- Click on the chart to read a day. Press **Another year** for a different made-up year with the same pattern.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const p = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'pattern', type: 'select', label: 'Pattern', options: MOODS, value: MOOD_TEXT[p.pattern] ? p.pattern : 'everyday' },
        { id: 'treated', type: 'check', label: 'With treatment', value: !!p.treated },
        { id: 'band', type: 'check', label: 'Show the usual range', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Another year' }] }
      ], id => { if (id === 'again') seed++; build(); });
      const ro = kit.readout(box.side, [['usual', 'Days in the usual range'], ['low', 'Days at −3 or lower'], ['high', 'Days at +3 or higher'], ['day', 'Selected day'], ['about', 'What it shows']]);
      const V = ctl.values;
      let seed = 1, Y1 = null, pin = null, sweep = 0, geo = null;
      function build() {
        Y1 = moodYear(V.pattern, V.treated, seed, kit.fin);
        const m = Y1.m, count = f => m.filter(f).length;
        ro.set('usual', pct(100 * count(v => Math.abs(v) <= 2) / m.length));
        ro.set('low', String(count(v => v <= -3)));
        ro.set('high', String(count(v => v >= 3)));
        ro.set('about', MOOD_TEXT[V.pattern] + (V.treated && V.pattern !== 'everyday' ? ' Treatment makes episodes milder and shorter; the marker shows when it began.' : ''));
        ctl.show('treated', V.pattern !== 'everyday');
      }
      function dayText(d) {
        const v = Y1.m[d], w = Math.floor((d % 30.4) / 7.6) + 1;
        const word = v >= 3 ? 'high' : v >= 2 ? 'upbeat' : v > -2 ? 'within the usual range' : v > -3 ? 'low' : 'very low';
        return 'month ' + (Math.floor(d / 30.42) + 1) + ', week ' + Math.min(4, w) + ': ' + (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(1) + ' (' + word + ')';
      }
      kit.click(st, q => {
        if (!geo) return;
        const d = Math.round((q.x - geo.b.x) / geo.b.w * 364);
        if (d >= 0 && d < 365 && q.y >= geo.b.y && q.y <= geo.b.y + geo.b.h) pin = pin === d ? null : d;
        loop.once();
      }, q => !!geo && q.x >= geo.b.x && q.x <= geo.b.x + geo.b.w && q.y >= geo.b.y && q.y <= geo.b.y + geo.b.h);
      function draw(dt) {
        sweep = (sweep + (dt || 0) * 36) % 365;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const b = { x: 64, y: 16, w: Math.max(60, W - 64 - 14), h: Math.max(60, Hh - 16 - 46) };
        const xt = [];
        for (let k = 0; k <= 12; k++) xt.push([k * 30.42, k === 12 ? null : W < 480 && k % 2 ? null : String(k + 1)]);
        const { X, Y } = frame(c, C, b, [0, 365], [-5, 5], {
          yTicks: [[5, '+5'], [3, '+3 high'], [0, '0 usual'], [-3, '−3 low'], [-5, '−5']],
          xTicks: xt, xLabel: 'month of the year'
        });
        geo = { b, X };
        if (V.band) {
          c.save(); c.globalAlpha = 0.1; c.fillStyle = C.ok; c.fillRect(b.x, Y(2), b.w, Y(-2) - Y(2)); c.restore();
          kit.label(c, 'usual range', b.x + b.w - 6, Y(2) + 9, { size: 10.5, color: C.ok, align: 'right' });
        }
        const pts = Y1.m.map((v, d) => [d, v]);
        fillTo(c, pts, X, Y, 0, C.warn, kit.hue(215), 0.33);
        // name each episode inside its shaded area, near the zero line, under the mood line
        for (const e of Y1.eps) {
          if (Math.abs(e.depth) < 2.4) continue;
          const mid = e.s + e.rise + e.hold / 2;
          const name = e.depth > 0 ? (e.depth >= 3.5 ? 'mania' : 'hypomania') : 'depression';
          kit.label(c, name, X(mid), Y(e.depth > 0 ? 1 : -1), { size: 10.5, weight: 650, align: 'center', color: C.text2 });
        }
        line(c, pts, X, Y, C.text2, 1.3);
        if (Y1.tx != null && Y1.tx > 0) vmark(c, C, X, b, Y1.tx, 'treatment starts', kit, C.ok);
        const d = pin != null ? pin : Math.floor(sweep);
        c.save(); c.strokeStyle = C.accent; c.globalAlpha = pin != null ? 0.9 : 0.35; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(d), b.y); c.lineTo(X(d), b.y + b.h); c.stroke(); c.restore();
        kit.dot(c, X(d), Y(Y1.m[d]), pin != null ? 5 : 3.5, C.accent, C.bg2);
        ro.set('day', (pin != null ? '' : '(click to pick) ') + dayText(d));
        if (W > 480) kit.label(c, 'schematic — not a real person', b.x + b.w, b.y + b.h + 26, { size: 10, color: C.faint, align: 'right' });
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4 · TOLERANCE AND WITHDRAWAL */
  function tolerance(V) {
    // the drug level falls with a 20-hour time constant; the brain's counter-adaptation A follows the
    // level slowly (rate per day) and unwinds about half as fast; the person feels level − adaptation
    const D0 = V.dose, rate = V.speed, use = Math.round(V.days), T = 90, kdec = Math.exp(-1 / 20), gain = 0.9, TAPER = 28;
    let L = 0, A = 0, dStop = D0, firstPeak = D0, lastPeak = D0, needAtStop = D0, minAfter = 0, back = null, calm = 0;
    const felt = [], dose = [], need = [];
    for (let day = 0; day < T; day++) {
      const needD = D0 + A;                                  // the dose needed for the first day's effect from a standing start
      const chaseD = Math.max(0, D0 + A - L);                // the same, allowing for what is left from yesterday
      let d;
      if (day < use || V.plan === 'keep') d = V.chase ? clamp(chaseD, D0, 4 * D0) : D0;
      else if (V.plan === 'taper' && day < use + TAPER) d = dStop * (1 - (day - use + 1) / (TAPER + 1));
      else d = 0;
      if (day < use) { dStop = d; needAtStop = needD; }
      L += d;
      dose.push([day, d]); need.push([day, needD]);
      let peak = -1e9, low = 1e9;
      for (let h = 0; h < 24; h++) {
        const s = L - A;
        felt.push([day + h / 24, s]);
        peak = Math.max(peak, s); low = Math.min(low, s);
        const target = gain * L;
        A += (target > A ? rate : 0.55 * rate) / 24 * (target - A);
        L *= kdec;
      }
      if (day === 0) firstPeak = peak;
      if (day < use) lastPeak = peak;
      if (day >= use && V.plan !== 'keep') {
        minAfter = Math.min(minAfter, low);
        // back near usual: the whole day within 10 % of the first effect, three days running
        calm = low > -0.1 * D0 && peak < 0.1 * D0 ? calm + 1 : 0;
        if (back == null && calm === 3) back = day - use - 2;
      }
    }
    return { felt, dose, need, firstPeak, lastPeak, needAtStop, minAfter, back, use, D0 };
  }
  Hyper.sim('mh-tolerance', {
    title: 'Tolerance, dependence and withdrawal',
    blurb: `A schematic of how the brain adapts to a drug taken every day. The top graph is how the person feels compared with their usual self (0): up is the drug's effect, down is feeling worse than usual. The bottom graph shows the dose taken each day, and the dose that would now be needed to get the first day's effect. Units are arbitrary.

- Watch the daily peaks shrink: the brain pushes back against the drug (tolerance), and between doses the person dips below their usual self.
- **Stop suddenly**: the drug is gone but the brain's counter-adaptation is not — the dip is withdrawal, roughly the mirror image of the drug's effect, and it fades over days to weeks.
- **Taper gradually**: the adaptation unwinds as the dose falls, so the dip is much shallower. This is why stopping some medicines, and heavy drinking, should be planned with a doctor.
- Tick **Chase the first effect**: raising the dose keeps the effect, but the adaptation grows with it and withdrawal gets deeper.
- After stopping, the dose needed (dashed) falls back: tolerance fades within weeks. Going back to a dose taken before is then far more dangerous — one reason overdoses are common after a detox, a hospital stay or prison.
- Tolerance and withdrawal are *physical dependence*. Addiction is something more: craving, loss of control and carrying on despite harm.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'dose', label: 'Daily dose (arbitrary units)', min: 1, max: 10, step: 0.5, value: 5 },
        { id: 'speed', label: 'How fast the brain adapts', min: 0.05, max: 0.4, step: 0.01, value: 0.15, fmt: v => v < 0.12 ? 'slowly' : v < 0.25 ? 'moderately' : 'quickly' },
        { id: 'days', label: 'Days of daily use', min: 10, max: 60, step: 1, value: 35, unit: 'days' },
        { id: 'plan', type: 'select', label: 'Then', options: [['Stop suddenly', 'stop'], ['Taper gradually over four weeks', 'taper'], ['Keep using', 'keep']], value: 'stop' },
        { id: 'chase', type: 'check', label: 'Chase the first effect (raise the dose)', value: false },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], () => build());
      const ro = kit.readout(box.side, [['first', 'Effect of the first dose'], ['last', 'Effect on the last day of use'], ['need', 'Dose now needed for the first effect'], ['low', 'Lowest point afterwards'], ['back', 'Back near usual after']]);
      const V = ctl.values;
      let R = null, tNow = 0;
      function build() {
        R = tolerance(V);
        tNow = 0;
        ro.set('first', '100 % (the reference)');
        ro.set('last', pct(100 * R.lastPeak / R.firstPeak) + ' of the first');
        ro.set('need', '× ' + (R.needAtStop / R.D0).toFixed(1) + ' the first dose');
        if (V.plan === 'keep') { ro.set('low', 'still using — dips between doses'); ro.set('back', '—'); }
        else {
          const lo = Math.round(100 * R.minAfter / R.D0);
          ro.set('low', (lo < 0 ? '−' : '') + Math.abs(lo) + ' %' + (V.plan === 'taper' ? ' (while tapering)' : ' (withdrawal)'));
          const from = V.plan === 'taper' ? ' after the taper began' : ' after the last dose';
          ro.set('back', R.back != null ? 'about ' + R.back + ' days' + from : 'more than ' + (90 - R.use) + ' days' + from);
        }
      }
      function draw(dt) {
        tNow = Math.min(90, tNow + (dt || 0) * 10);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const hTop = (Hh - 30 - 44) * 0.64, hBot = (Hh - 30 - 44) - hTop - 26;
        const bT = { x: 52, y: 18, w: Math.max(60, W - 52 - 14), h: Math.max(40, hTop) };
        const bB = { x: 52, y: bT.y + bT.h + 26, w: bT.w, h: Math.max(30, hBot) };
        let ym = R.D0 * 1.15;
        for (const q of R.felt) ym = Math.max(ym, Math.abs(q[1]) * 1.1);
        const xt = [[0, '0'], [15, '15'], [30, '30'], [45, '45'], [60, '60'], [75, '75'], [90, '90']];
        const top = frame(c, C, bT, [0, 90], [-ym, ym], { yTicks: [[R.D0, 'first'], [0, 'usual'], [-R.D0, null]], xTicks: xt.map(q => [q[0], null]) });
        const shown = R.felt.filter(q => q[0] <= tNow);
        fillTo(c, shown, top.X, top.Y, 0, C.warn, kit.hue(215), 0.35);
        line(c, shown, top.X, top.Y, C.text2, 1.1);
        if (V.plan !== 'keep') vmark(c, C, top.X, bT, R.use, V.plan === 'taper' ? 'starts to taper' : 'stops', kit, C.muted);
        kit.label(c, 'above 0: drug effect', bT.x, 9, { size: 10.5, color: C.warn, weight: 600 });
        kit.label(c, 'below: worse than usual', bT.x + 124, 9, { size: 10.5, color: kit.hue(215), weight: 600 });
        let dm = R.D0 * 1.2;
        for (const q of R.need) dm = Math.max(dm, q[1] * 1.1);
        for (const q of R.dose) dm = Math.max(dm, q[1] * 1.1);
        const bot = frame(c, C, bB, [0, 90], [0, dm], { yTicks: [[0, '0'], [R.D0, 'first']], xTicks: xt, xLabel: 'days' });
        const bw = Math.max(1, bB.w / 90 - 1);
        c.save(); c.fillStyle = C.accent; c.globalAlpha = 0.7;
        for (const q of R.dose) if (q[0] <= tNow && q[1] > 0) c.fillRect(bot.X(q[0]), bot.Y(q[1]), bw, bot.Y(0) - bot.Y(q[1]));
        c.restore();
        line(c, R.need.filter(q => q[0] <= tNow).map(q => [q[0] + 0.5, q[1]]), bot.X, bot.Y, C.bad, 2, [5, 4]);
        kit.label(c, 'dose taken', bB.x + 6, bB.y - 9, { size: 10.5, color: C.accent, weight: 600 });
        kit.label(c, 'dose needed for the first effect', bB.x + 80, bB.y - 9, { size: 10.5, color: C.bad, weight: 600 });
        const q = shown[shown.length - 1];
        if (q) kit.dot(c, top.X(q[0]), top.Y(q[1]), 4, C.accent, C.bg2);
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5 · A THOUGHT RECORD */
  const TRAPS = [['Name the thinking trap…', 'none'], ['Mind-reading', 'mind'], ['Catastrophising', 'catastrophe'], ['Fortune-telling', 'fortune'],
    ['All-or-nothing thinking', 'allnothing'], ['Overgeneralising', 'overgeneral'], ['Labelling', 'labelling'], ['"Should" statements', 'should']];
  const TRAP_INFO = {
    mind: 'mind-reading: assuming you know what someone else thinks',
    catastrophe: 'catastrophising: jumping to the worst possible outcome',
    fortune: 'fortune-telling: treating a prediction as a fact',
    allnothing: 'all-or-nothing thinking: seeing only total success or total failure',
    overgeneral: 'overgeneralising: one event taken as a never-ending pattern',
    labelling: 'labelling: a harsh label for yourself from one moment',
    should: '"should" statements: rigid rules about how you must be'
  };
  const RECORDS = {
    email: {
      name: 'An unanswered email', belief: 85, feelings: [['anxious', 80], ['ashamed', 60]], traps: ['mind', 'catastrophe', 'fortune'],
      situation: 'My manager has not replied to my email all day.',
      thought: 'She thinks my work is useless — I\'m going to lose my job.',
      cards: [['She has seemed brisk with me this week.', 'for'], ['She praised my report last week.', 'against'], ['Her calendar shows she is on leave today.', 'against'],
        ['I made a small error in last month\'s figures.', 'for'], ['No one has raised a concern about my work.', 'against'], ['She often answers everyone late in the week.', 'against']],
      balanced: 'She is away today and her recent feedback was good. If something is wrong I can ask — one slow reply does not mean I will lose my job.'
    },
    friend: {
      name: 'A friend walks past', belief: 80, feelings: [['hurt', 75], ['sad', 70]], traps: ['mind', 'overgeneral'],
      situation: 'A friend walked past me in the street without saying hello.',
      thought: 'She\'s angry with me — nobody really likes me.',
      cards: [['We haven\'t talked much this month.', 'for'], ['She was looking at her phone and walking fast.', 'against'], ['She invited me to her birthday two weeks ago.', 'against'],
        ['I cancelled plans with her recently.', 'for'], ['Two other friends called me this week.', 'against'], ['She has walked past others without noticing before.', 'against']],
      balanced: 'She was probably distracted and did not see me. I will send her a message — one missed hello does not mean nobody likes me.'
    },
    talk: {
      name: 'Stumbling in a presentation', belief: 85, feelings: [['embarrassed', 85], ['anxious', 65]], traps: ['allnothing', 'labelling', 'mind'],
      situation: 'I stumbled over my words twice during a presentation at work.',
      thought: 'I\'m hopeless at this — everyone thinks I\'m incompetent.',
      cards: [['I lost my place on one slide.', 'for'], ['My voice shook at the start.', 'for'], ['Two colleagues asked good follow-up questions.', 'against'],
        ['My manager said the content was clear.', 'against'], ['When others stumble, I hardly notice or remember it.', 'against'], ['I finished on time and covered every point.', 'against']],
      balanced: 'I stumbled twice, and the talk still went well enough for people to engage with it. Slips are normal; I can practise my opening next time.'
    },
    exam: {
      name: 'A disappointing practice test', belief: 80, feelings: [['anxious', 85], ['low', 60]], traps: ['catastrophe', 'fortune', 'allnothing'],
      situation: 'I got a lower mark than I hoped on a practice test.',
      thought: 'I\'m going to fail the real exam and my future is ruined.',
      cards: [['I got two topics badly wrong.', 'for'], ['It was a practice test, meant to show gaps.', 'against'], ['I passed the last three tests.', 'against'],
        ['I have been revising less than I planned.', 'for'], ['There are six weeks left to revise.', 'against'], ['One exam result does not decide a whole future.', 'against']],
      balanced: 'This shows me two topics to work on, and I have six weeks. I have passed before, and one mark does not decide my future.'
    }
  };
  Hyper.sim('mh-thought-record', {
    title: 'A thought record (CBT)',
    blurb: `The thought record is one of the core tools of cognitive behavioural therapy. It slows an upsetting moment down into steps: what happened, the thought that flashed through your mind, how you felt, the evidence for and against that thought, and a more balanced way of seeing it.

- **Tap each evidence card** to sort it: once for *supports the thought*, twice for *does not support it*, three times to put it back. Some cards genuinely support the thought — a balanced view includes them.
- **Name the thinking trap** in the side panel; most automatic thoughts fit one or two.
- When at least two cards are sorted as *not supporting* the thought, press **Write a balanced thought** and watch the re-rating.
- The aim is not to feel nothing, or to think positively, but to see the situation more accurately — distress usually falls to a more proportionate level. In therapy, a person writes their own thoughts and evidence; these examples are made up.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 470, maxH: 640 });
      const p = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'scenario', type: 'select', label: 'Situation', options: Object.keys(RECORDS).map(k => [RECORDS[k].name, k]), value: RECORDS[p.scenario] ? p.scenario : 'email' },
        { id: 'trap', type: 'select', label: 'Thinking trap', options: TRAPS, value: 'none' },
        { type: 'buttons', items: [{ id: 'balance', label: 'Write a balanced thought', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'scenario' || id === 'reset') { reset(); if (id === 'reset') ctl.set('trap', 'none'); }
        else if (id === 'balance') { if (score().againstOk >= 2) balanced = true; else tip = 'First sort at least two cards that do not support the thought.'; }
        update();
      });
      const ro = kit.readout(box.side, [['belief', 'Belief in the thought'], ['feel', 'Feelings'], ['trap', 'Thinking trap'], ['cards', 'Evidence sorted'], ['tip', 'Next step']]);
      const V = ctl.values;
      let state = [], balanced = false, tip = '', hits = [];
      function reset() { state = RECORDS[V.scenario].cards.map(() => ''); balanced = false; tip = ''; if (V.trap !== 'none') ctl.set('trap', 'none'); }
      function score() {
        const R = RECORDS[V.scenario];
        let againstOk = 0, good = 0, wrong = 0, sorted = 0;
        R.cards.forEach((cd, i) => {
          const s = state[i];
          if (!s) return;
          sorted++;
          if (s === cd[1]) { good++; if (s === 'against') againstOk++; } else wrong++;
        });
        const trapFit = V.trap !== 'none' && R.traps.includes(V.trap);
        const B = clamp(R.belief - 8 * againstOk - (trapFit ? 5 : 0) - (balanced ? 14 : 0) + 3 * wrong, 25, R.belief);
        const drop = (R.belief - B) / R.belief;
        return { B: Math.round(B), drop, againstOk, good, wrong, sorted, trapFit, R };
      }
      function update() {
        const s = score(), R = s.R;
        ro.set('belief', R.belief + ' % → ' + s.B + ' %');
        ro.set('feel', R.feelings.map(f => f[0] + ' ' + f[1] + ' → ' + Math.round(f[1] * (1 - 0.75 * s.drop)) + ' %').join(', '));
        ro.set('trap', V.trap === 'none' ? 'not named yet' : s.trapFit ? 'Yes — ' + TRAP_INFO[V.trap] : 'Possibly, but look again: this thought is more like ' + TRAP_INFO[R.traps[0]].split(':')[0]);
        ro.set('cards', s.sorted + ' of ' + R.cards.length + ' sorted' + (s.sorted ? '; ' + s.good + ' as a therapist might' : ''));
        ro.set('tip', balanced ? 'Done. Notice the feelings eased but did not vanish — that is the realistic aim.' : tip || (s.againstOk >= 2 ? 'Press "Write a balanced thought".' : 'Tap the evidence cards to sort them.'));
        tip = '';
      }
      function layout(c, fs) {
        const R = RECORDS[V.scenario], W = st.W, pad = 10, w = W - 2 * pad, lh = Math.round(fs * 1.32), gap = 8, meterW = W < 440 ? 64 : 96;
        const rows = [];
        let y = 6;
        const add = (key, title, text, right) => {
          font(c, fs);
          const lines = wrap(c, text, w - 20 - (right ? meterW : 0));
          const h = 8 + fs + 6 + lines.length * lh + 6;
          rows.push({ key, title, lines, x: pad, y, w, h, right });
          y += h + gap;
        };
        add('situation', '1  Situation', R.situation, false);
        add('thought', '2  Automatic thought', '"' + R.thought + '"', true);
        add('feel', '3  Feelings', R.feelings.map(f => f[0]).join(', '), true);
        const ev = { key: 'evidence', title: '4  Evidence — tap each card to sort it', x: pad, y, w, h: 0 };
        rows.push(ev);
        const cols = W > 900 ? 3 : 2, cw = (w - 16 - (cols - 1) * 8) / cols, cards = [];
        let cy = y + 8 + fs + 8;
        for (let r = 0; r * cols < R.cards.length; r++) {
          let rh = 0;
          const row = [];
          for (let k = 0; k < cols; k++) {
            const i = r * cols + k;
            if (i >= R.cards.length) break;
            font(c, fs - 0.5);
            const lines = wrap(c, R.cards[i][0], cw - 14);
            const h = 7 + lines.length * lh + fs + 8;
            rh = Math.max(rh, h);
            row.push({ i, lines, x: pad + 8 + k * (cw + 8), y: cy, w: cw });
          }
          row.forEach(cd => { cd.h = rh; cards.push(cd); });
          cy += rh + 6;
        }
        ev.h = cy - y + 2;
        y = cy + gap;
        add('balanced', '5  Balanced thought', balanced ? '"' + R.balanced + '"' : 'Sort at least two cards that do not support the thought, then press "Write a balanced thought".', true);
        return { rows, cards, total: y, lh, meterW };
      }
      function meter(c, C, x, y, w, from, to, label) {
        const h = 8;
        kit.label(c, label, x, y, { size: 10, color: C.muted });
        rrect(c, x, y + 9, w, h, 4); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1; c.stroke();
        rrect(c, x, y + 9, w * to / 100, h, 4); c.fillStyle = to < from ? C.ok : C.accent; c.fill();
        c.save(); c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x + w * from / 100, y + 6); c.lineTo(x + w * from / 100, y + 20); c.stroke(); c.restore();
        kit.label(c, from + ' → ' + to + ' %', x, y + 29, { size: 10.5, weight: 600, color: C.text });
      }
      function draw() {
        const C = kit.colors(), c = st.begin();
        let fs = 12.5, L = layout(c, fs);
        while (L.total > st.H && fs > 9) { fs -= 1; L = layout(c, fs); }
        const s = score(), R = s.R;
        hits = [];
        for (const r of L.rows) {
          rrect(c, r.x, r.y, r.w, r.h, 8);
          c.fillStyle = r.key === 'balanced' && balanced ? kit.hue(150, 0.14) : C.surface; c.fill();
          c.strokeStyle = r.key === 'balanced' && balanced ? C.ok : C.border2; c.lineWidth = 1; c.stroke();
          kit.label(c, r.title, r.x + 10, r.y + 6 + fs / 2 + 1, { size: fs - 1, weight: 700, color: C.accent });
          if (r.lines) {
            font(c, fs, r.key === 'thought' || (r.key === 'balanced' && balanced) ? 600 : 500);
            c.fillStyle = C.text; c.textAlign = 'left'; c.textBaseline = 'middle';
            r.lines.forEach((ln, k) => c.fillText(ln, r.x + 10, r.y + 8 + fs + 6 + k * L.lh + L.lh / 2 - 2));
          }
          if (r.right) {
            const mx = r.x + r.w - L.meterW - 4, mw = L.meterW - 8;
            if (r.key === 'thought') meter(c, C, mx, r.y + 6, mw, R.belief, s.B, 'belief');
            if (r.key === 'balanced') meter(c, C, mx, r.y + 6, mw, R.feelings[1][1], Math.round(R.feelings[1][1] * (1 - 0.75 * s.drop)), R.feelings[1][0]);
            if (r.key === 'feel') meter(c, C, mx, r.y + 6, mw, R.feelings[0][1], Math.round(R.feelings[0][1] * (1 - 0.75 * s.drop)), R.feelings[0][0]);
          }
        }
        for (const cd of L.cards) {
          const stt = state[cd.i];
          const col = stt === 'for' ? C.warn : stt === 'against' ? C.ok : C.border2;
          rrect(c, cd.x, cd.y, cd.w, cd.h, 6);
          c.fillStyle = C.bg2; c.fill();
          c.strokeStyle = col; c.lineWidth = stt ? 2 : 1; c.stroke();
          font(c, fs - 0.5); c.fillStyle = C.text; c.textAlign = 'left'; c.textBaseline = 'middle';
          cd.lines.forEach((ln, k) => c.fillText(ln, cd.x + 7, cd.y + 7 + k * L.lh + L.lh / 2 - 1));
          const tag = stt === 'for' ? 'supports the thought' : stt === 'against' ? 'does not support it' : 'tap to sort';
          kit.label(c, tag, cd.x + 7, cd.y + cd.h - fs / 2 - 5, { size: fs - 2, weight: stt ? 650 : 500, color: stt ? col : C.faint });
          hits.push(cd);
        }
      }
      const hitCard = q => hits.find(cd => q.x >= cd.x && q.x <= cd.x + cd.w && q.y >= cd.y && q.y <= cd.y + cd.h);
      kit.click(st, q => {
        const cd = hitCard(q);
        if (!cd || balanced) return;
        const cur = state[cd.i];
        state[cd.i] = cur === '' ? 'for' : cur === 'for' ? 'against' : '';
        update(); draw();
      }, q => !!hitCard(q));
      reset(); update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6 · THE COURSE OF RECOVERY */
  const TREATS = [['No treatment (natural course)', 'none'], ['A talking therapy', 'therapy'], ['An antidepressant', 'medicine'], ['Both together', 'both']];
  function recoveryPeople(tr, stepUp, seed, count, fin) {
    const n = fin.normals(seed), u = fin.uniforms(seed * 31 + 5);
    // illustrative rates: the chance of a good response to each option, loosely after trial averages
    const P = { none: 0.38, therapy: 0.5, medicine: 0.5, both: 0.62 };
    const out = [];
    for (let k = 0; k < count; k++) {
      const S0 = clamp(Math.round(18 + 2.6 * n()), 13, 25);
      const resp = u() < (P[tr] || 0.38);
      const lag = tr === 'none' ? 0 : tr === 'therapy' ? 1 : 1.5;
      const tau = tr === 'none' ? 7 + 7 * u() : 3.5 + 4 * u();
      const R = resp ? 0.65 + 0.3 * u() : 0.08 + 0.2 * u();
      const base = w => S0 * (1 - R * (1 - Math.exp(-Math.max(0, w - lag) / tau)));
      // a second treatment for those not improving by week 8 (drawn for everyone, so ticking the
      // box changes nothing else about the same simulated people)
      const r2 = u(), r3 = u(), r4 = u();
      let changed = false, R2 = 0, tau2 = 5;
      if (stepUp && tr !== 'none' && base(8) > 0.75 * S0) {
        changed = true;
        R2 = r2 < 0.45 ? 0.55 + 0.3 * r3 : 0.05 + 0.15 * r3;
        tau2 = 3.5 + 3 * r4;
      }
      const pts = [];
      let ar = 0, bump = 0, setbacks = 0;
      for (let w = 0; w <= 26; w++) {
        let b = base(w);
        if (changed && w > 8) b *= 1 - R2 * (1 - Math.exp(-(w - 8.5) / tau2));
        if (w > 0) {
          ar = 0.45 * ar + 1.3 * n();
          bump *= 0.55;
          if (w > 2 && u() < 0.07) { bump += 3 + 3 * u(); setbacks++; }
        }
        pts.push([w, w === 0 ? S0 : clamp(Math.round(b + ar + bump), 0, 27)]);
      }
      const first = test => { for (let w = 1; w < 26; w++) if (test(pts[w][1]) && test(pts[w + 1][1])) return w; return null; };
      out.push({ S0, pts, changed, setbacks, resp: first(s => s <= S0 / 2), rem: first(s => s < 5) });
    }
    return out;
  }
  Hyper.sim('mh-recovery', {
    title: 'The course of recovery',
    blurb: `A symptom score over six months, on a 0–27 scale like the PHQ-9 questionnaire used for depression (20 or more is severe, under 5 minimal). The people are simulated; the rates are loosely based on averages from trials and are illustrative, not predictions for anyone.

- **One person**: improvement is gradual and uneven — good weeks, bad weeks, the occasional setback. A setback is not the end of recovery.
- With **Adjust the treatment at week 8** ticked, a person who has not improved by then switches or adds a treatment — and many then do improve. Not responding to the first treatment does not mean nothing will work.
- **Forty people**: faint lines are individuals, the bold line the median. Compare no treatment with therapy, medicine and both. Many people improve without treatment too, but more slowly and fewer of them.
- Press **Another person** to meet someone else.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const p = params || {};
      const ctl = kit.controls(box.side, [
        { id: 'tr', type: 'select', label: 'Treatment', options: TREATS, value: TREATS.some(t => t[1] === p.treatment) ? p.treatment : 'therapy' },
        { id: 'view', type: 'select', label: 'Show', options: [['One person', 'one'], ['Forty people', 'many']], value: p.view === 'many' ? 'many' : 'one' },
        { id: 'step', type: 'check', label: 'Adjust the treatment at week 8 if not improving', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Another person', primary: true }] }
      ], id => { if (id === 'again') seed++; build(); });
      const ro = kit.readout(box.side, [['start', 'Score at the start'], ['resp', 'Response (score halved)'], ['rem', 'Remission (under 5)'], ['setbacks', 'Setbacks along the way'],
        ['pResp', 'Responded by week 12'], ['pRem', 'In remission by week 26'], ['median', 'Median score, start → week 26']]);
      const V = ctl.values;
      let seed = 4, one = null, many = [], med = [], tNow = 0;
      function build() {
        one = recoveryPeople(V.tr, V.step, seed, 1, kit.fin)[0];
        many = recoveryPeople(V.tr, V.step, 1000 + seed, 40, kit.fin);
        med = [];
        for (let w = 0; w <= 26; w++) { const v = many.map(q => q.pts[w][1]).sort((a, b) => a - b); med.push([w, (v[19] + v[20]) / 2]); }
        tNow = 0;
        const isOne = V.view === 'one';
        for (const k of ['start', 'resp', 'rem', 'setbacks']) ro.show(k, isOne);
        for (const k of ['pResp', 'pRem', 'median']) ro.show(k, !isOne);
        ro.set('start', one.S0 + ' (' + (one.S0 >= 20 ? 'severe' : 'moderately severe') + ')');
        ro.set('resp', one.resp != null ? 'week ' + one.resp : 'not yet at six months — further options remain');
        ro.set('rem', one.rem != null ? 'week ' + one.rem : 'not yet at six months');
        ro.set('setbacks', String(one.setbacks) + (one.changed ? '; treatment adjusted at week 8' : ''));
        const frac = f => pct(100 * many.filter(f).length / many.length);
        ro.set('pResp', frac(q => q.resp != null && q.resp <= 12));
        ro.set('pRem', frac(q => q.rem != null));
        ro.set('median', med[0][1] + ' → ' + med[26][1]);
      }
      function draw(dt) {
        tNow = Math.min(26, tNow + (dt || 0) * 2.6);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const b = { x: 46, y: 18, w: Math.max(60, W - 46 - 16), h: Math.max(60, Hh - 18 - 46) };
        const xt = [];
        for (let w = 0; w <= 26; w += 2) xt.push([w, w % 4 === 0 || W > 560 ? String(w) : null]);
        const { X, Y } = frame(c, C, b, [0, 26], [0, 27], { yTicks: [[0, '0'], [5, '5'], [10, '10'], [15, '15'], [20, '20'], [27, '27']], xTicks: xt, xLabel: 'weeks', yLabel: 'symptom score', yGap: 30 });
        for (const [lo, hi, name] of [[0, 5, 'minimal'], [5, 10, 'mild'], [10, 15, 'moderate'], [15, 20, 'moderately severe'], [20, 27, 'severe']]) {
          kit.label(c, name, b.x + b.w - 4, Y((lo + hi) / 2), { size: 10, color: C.faint, align: 'right' });
        }
        const cut = pts => pts.filter(q => q[0] <= tNow + 1e-9);
        if (V.view === 'many') {
          for (const q of many) line(c, cut(q.pts), X, Y, C.accent, 1, null, 0.22);
          line(c, cut(med), X, Y, C.accent, 3);
          const tm = Math.min(tNow, 26);
          kit.label(c, 'median', X(tm) + (tm > 13 ? -6 : 6), Y(med[Math.floor(tm)][1]) - 12, { size: 11, weight: 650, color: C.accent, align: tm > 13 ? 'right' : 'left', bg: C.bg2 });
        } else {
          c.save(); c.strokeStyle = C.muted; c.setLineDash([4, 4]); c.lineWidth = 1;
          c.beginPath(); c.moveTo(b.x, Y(one.S0 / 2)); c.lineTo(b.x + b.w, Y(one.S0 / 2)); c.stroke(); c.restore();
          kit.label(c, 'half the starting score', b.x + 6, Y(one.S0 / 2) - 9, { size: 10, color: C.muted, bg: C.bg2 });
          if (one.changed && tNow >= 8) vmark(c, C, X, b, 8, 'treatment adjusted', kit, C.warn);
          const pts = cut(one.pts);
          line(c, pts, X, Y, C.accent, 2.4);
          for (const q of pts) kit.dot(c, X(q[0]), Y(q[1]), 3, C.accent);
          // mark response and remission with a thin line up to a label above the curve
          const flag = (w, text, row) => {
            const y = b.y + 10 + 15 * (row + (one.changed ? 1 : 0));
            c.save(); c.strokeStyle = C.ok; c.setLineDash([2, 3]); c.lineWidth = 1;
            c.beginPath(); c.moveTo(X(w), y + 7); c.lineTo(X(w), Y(one.pts[w][1]) - 6); c.stroke(); c.restore();
            kit.dot(c, X(w), Y(one.pts[w][1]), 6, C.ok);
            kit.label(c, text + ', week ' + w, X(w), y, { size: 10.5, weight: 650, color: C.ok, align: w > 20 ? 'right' : w < 4 ? 'left' : 'center', bg: C.bg2 });
          };
          if (one.resp != null && tNow >= one.resp) flag(one.resp, 'response', 0);
          if (one.rem != null && tNow >= one.rem) flag(one.rem, 'remission', one.resp != null && Math.abs(one.rem - one.resp) < 5 ? 1 : 0);
        }
        kit.label(c, (TREATS.find(t => t[1] === V.tr) || TREATS[0])[0] + ' — simulated', b.x, 9, { size: 11, color: C.text2 });
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
