/* HYPER-MEDICINE · sims/endocrine.js — simulations for hormones and diabetes:
 *   endo-axis      the thyroid feedback loop (TRH → TSH → T4), with the lab pattern of each fault
 *   endo-cortisol  cortisol through the day and night, stress, jet lag and steroid tablets
 *   endo-cycle     the menstrual cycle's hormones, ovary and womb lining (schematic)
 *   endo-bone      bone density across a lifetime, the menopause, treatment and the T-score
 *   endo-meal      glucose and insulin after a meal: healthy, insulin resistance, type 2, no insulin
 *   endo-a1c       HbA1c as a memory of the past three months, and the estimated average glucose
 *   endo-hypo      a hypoglycaemia timeline: the body's defences, symptoms and treatment
 * All models are simplified and schematic; their numbers are typical, not individual. */
(function () {
  'use strict';

  const MG = 18.016;                                         // mg/dL per mmol/L of glucose
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = (x, d) => Number.isFinite(x) ? x : (d || 0);
  const gauss = (x, m, s) => Math.exp(-0.5 * ((x - m) / s) * ((x - m) / s));
  const agauss = (x, m, sl, sr) => gauss(x, m, x < m ? sl : sr);           // asymmetric bump
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a || 1), 0, 1); return t * t * (3 - 2 * t); };
  function rrect(c, x, y, w, h, r) {
    w = Math.max(0, w); h = Math.max(0, h); r = Math.max(0, Math.min(r, w / 2, h / 2));
    c.beginPath(); c.moveTo(x + r, y);
    c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
    c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
  }
  const gtxt = (v, u) => u === 'mg' ? Math.round(v * MG) + ' mg/dL' : v.toFixed(1) + ' mmol/L';
  const gboth = v => v.toFixed(1) + ' mmol/L (' + Math.round(v * MG) + ' mg/dL)';
  const hhmm = h => { h = ((h % 24) + 24) % 24; const m = Math.floor(h * 60 + 1e-6); return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'); };
  // an arrow whose width shows how much is flowing, with dots moving along it
  function flowArrow(kit, c, x1, y1, x2, y2, w, color, phase) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    if (len < 4) return;
    kit.arrow(c, x1, y1, x2, y2, color, clamp(w, 1, 14), Math.max(8, w * 2.2));
    if (w < 1.3 || phase == null) return;
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    c.fillStyle = color;
    for (let s = ((phase % 22) + 22) % 22; s < len - 14; s += 22) {
      c.globalAlpha = 0.9; c.beginPath(); c.arc(x1 + ux * s, y1 + uy * s, clamp(w * 0.45, 1.2, 4), 0, Math.PI * 2); c.fill();
    }
    c.globalAlpha = 1;
  }

  /* ================================================================ the thyroid axis */
  const AXIS = {
    healthy: { cap: 100, pit: 100, ab: 0, tabs: 0 },
    hashimoto: { cap: 20, pit: 100, ab: 0, tabs: 0 },
    graves: { cap: 100, pit: 100, ab: 60, tabs: 0 },
    pituitary: { cap: 100, pit: 4, ab: 0, tabs: 0 },
    tablets: { cap: 0, pit: 100, ab: 0, tabs: 100 }
  };
  function thyroidPattern(tsh, ft4) {
    const tl = tsh < 0.4, th = tsh > 4.0, fl = ft4 < 10, fh = ft4 > 22;
    if (th && fl) return ['Primary hypothyroidism', 'The thyroid cannot keep up, so the pituitary pushes TSH up hard.'];
    if (th && fh) return ['TSH and free T4 both high', 'Rare: a TSH-making pituitary tumour, or resistance to thyroid hormone.'];
    if (th) return ['Subclinical hypothyroidism', 'Free T4 is still in range, held there by extra TSH.'];
    if (tl && fh) return ['Hyperthyroidism', 'Too much T4; the pituitary has switched TSH off.'];
    if (fl) return ['Central (secondary) hypothyroidism', 'Free T4 is low, yet the pituitary does not answer with more TSH.'];
    if (tl) return ['Subclinical hyperthyroidism', 'Free T4 in range but TSH suppressed — for example slightly too much thyroxine.'];
    if (fh) return ['Free T4 high, TSH normal', 'Unusual: think of test interference (such as biotin) or a rare pituitary cause.'];
    return ['Normal thyroid function', 'TSH and free T4 are both within the usual reference ranges.'];
  }
  // one step of the loop, time in days: F free T4 (pmol/L), T TSH (mU/L)
  function axisStep(s, p, dt) {
    const k = Math.LN2 / 7, A = p.ab / 100 * 15;
    const prod = 45 * (p.cap / 100) * (s.T + A) / (s.T + A + 3) + 15 * (p.tabs / 100);
    s.F += k * (prod - s.F) * dt;
    const Tt = (p.pit / 100) * 100 / (1 + Math.pow(Math.max(0, s.F) / 7.47, 6));
    s.T += (Tt - s.T) / 2 * dt;
    s.F = Math.max(0, s.F); s.T = Math.max(1e-4, s.T);
  }

  Hyper.sim('endo-axis', {
    title: 'The thyroid feedback loop',
    blurb: `The hypothalamus sends TRH to the pituitary, the pituitary sends TSH to the thyroid, and the thyroid's T4 feeds back to switch both off. Arrow widths show how much hormone is flowing; the graph tracks TSH (orange, logarithmic scale) and free T4 (blue) over the last eight months, with the usual reference ranges shaded. Time runs at a few days per second.

- Pick **Hashimoto's thyroiditis** and watch the lab pattern form: free T4 drifts down over weeks while TSH climbs steeply.
- Set **thyroid capacity** to about 40 %: free T4 stays in range while TSH rises — subclinical hypothyroidism.
- Choose **Thyroid removed, taking thyroxine** and move the tablets between 80 % and 140 % of a normal day's output: under- and over-replacement show up in the TSH first — and take weeks to settle.
- Compare **Graves' disease** with **pituitary failure**: both change free T4, but TSH moves in opposite directions.

A teaching model with typical values; it is not a tool for interpreting anyone's results.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const start = AXIS[(params && params.condition) || 'healthy'] ? (params && params.condition) || 'healthy' : 'healthy';
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Situation', options: [['Healthy', 'healthy'], ['Hashimoto\'s thyroiditis (thyroid failing)', 'hashimoto'], ['Graves\' disease (stimulating antibodies)', 'graves'], ['Pituitary failure (central)', 'pituitary'], ['Thyroid removed, taking thyroxine', 'tablets']], value: start },
        { id: 'cap', label: 'Thyroid capacity', min: 0, max: 120, step: 1, value: AXIS[start].cap, unit: '%' },
        { id: 'pit', label: 'Pituitary function', min: 0, max: 100, step: 1, value: AXIS[start].pit, unit: '%' },
        { id: 'ab', label: 'Stimulating antibodies', min: 0, max: 100, step: 1, value: AXIS[start].ab, unit: '%' },
        { id: 'tabs', label: 'Thyroxine tablets (share of a normal day\'s output)', min: 0, max: 200, step: 5, value: AXIS[start].tabs, unit: '%' },
        { id: 'speed', label: 'Speed', min: 0.5, max: 12, step: 0.5, value: 4, unit: 'days/s' },
        { type: 'buttons', items: [{ id: 'settle', label: 'Jump to the steady state', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id, v) => {
        if (id === 'preset') { const p = AXIS[v]; for (const k of ['cap', 'pit', 'ab', 'tabs']) ctl.set(k, p[k]); }
        else if (id === 'settle') settle();
        else if (id === 'pause') running = !running;
        report();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Day'], ['tsh', 'TSH'], ['ft4', 'Free T4'], ['pat', 'Pattern'], ['why', 'What it means']]);
      const s = { F: 15, T: 1.5 };
      let day = 0, running = true, hist = [], ph = [0, 0, 0, 0];
      function settle() { for (let i = 0; i < 12000; i++) axisStep(s, V, 0.05); hist = []; }
      settle();
      function report() {
        ro.set('day', Math.floor(day) + '');
        ro.set('tsh', (s.T < 0.01 ? '< 0.01' : kit.fmt(s.T, 2)) + ' mU/L (usual about 0.4–4)');
        ro.set('ft4', s.F.toFixed(1) + ' pmol/L = ' + (s.F / 12.87).toFixed(2) + ' ng/dL (usual about 10–22 pmol/L)');
        const p = thyroidPattern(s.T, s.F);
        ro.set('pat', p[0]); ro.set('why', p[1]);
      }
      function draw(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (running && dt > 0) {
          const days = dt * V.speed, n = Math.max(1, Math.ceil(days / 0.05));
          for (let i = 0; i < n; i++) axisStep(s, V, days / n);
          day += days;
          if (!hist.length || day - hist[hist.length - 1][0] >= 0.5) hist.push([day, s.F, s.T]);
          hist = hist.filter(h => h[0] > day - 245);
          for (let i = 0; i < 4; i++) ph[i] += dt * 30;
        }
        const blue = kit.hue(215), orange = kit.hue(28), red = C.bad;
        // ---- the diagram
        const LW = Math.min(W * 0.4, 270), cx = LW * 0.42;
        const y1 = Hh * 0.1, y2 = Hh * 0.32, y3 = Hh * 0.6, y4 = Hh * 0.88;
        const trh = (V.pit > 0 ? 1 : 0.4) / (1 + Math.pow(s.F / 15, 2));
        const tshW = 1 + 7 * clamp((Math.log10(s.T) + 2) / 4, 0, 1);
        const t4W = 1 + 3.2 * clamp(s.F / 15, 0, 3);
        const bw = Math.min(150, LW * 0.62);
        const boxAt = (y, label, sub, on) => {
          const bh = 34;
          rrect(c, cx - bw / 2, y - bh / 2, bw, bh, 8); c.fillStyle = C.surface; c.fill();
          c.strokeStyle = on ? C.border2 : C.faint; c.lineWidth = 1.5; c.stroke();
          kit.label(c, label, cx, y - (sub ? 6 : 0), { size: 12.5, weight: 650, align: 'center', color: on ? C.text : C.muted });
          if (sub) kit.label(c, sub, cx, y + 8, { size: 10.5, align: 'center', color: C.muted });
        };
        flowArrow(kit, c, cx, y1 + 18, cx, y2 - 20, 1 + 4 * trh, C.muted, ph[0] * (0.3 + trh));
        kit.label(c, 'TRH', cx + 10, (y1 + y2) / 2, { size: 11.5, color: C.muted, weight: 600 });
        flowArrow(kit, c, cx, y2 + 18, cx, y3 - 32, tshW, orange, ph[1] * clamp(tshW / 4, 0.1, 2));
        kit.label(c, 'TSH', cx + 12, (y2 + y3) / 2 - 6, { size: 12, color: orange, weight: 650 });
        flowArrow(kit, c, cx, y3 + 30, cx, y4 - 18, t4W, blue, ph[2] * clamp(s.F / 15, 0.05, 2.5));
        kit.label(c, 'T4', cx + 12, (y3 + y4) / 2, { size: 12, color: blue, weight: 650 });
        // feedback arc: T4 switching off the pituitary and hypothalamus
        const edge = cx + bw / 2, fx = edge + 24, fw = clamp(0.8 + s.F / 12, 0.8, 5), fy = (y3 + y4) / 2 + 14;
        c.strokeStyle = red; c.lineWidth = fw; c.setLineDash([6, 5]);
        c.beginPath(); c.moveTo(cx + 8, fy); c.lineTo(fx, fy); c.lineTo(fx, y1); c.lineTo(edge + 10, y1); c.stroke();
        c.beginPath(); c.moveTo(fx, y2); c.lineTo(edge + 10, y2); c.stroke(); c.setLineDash([]);
        boxAt(y1, 'Hypothalamus', '', true);
        boxAt(y2, 'Pituitary', V.pit < 50 ? 'failing' : '', V.pit > 5);
        for (const yy of [y1, y2]) { kit.dot(c, edge + 8, yy, 7, C.surface, red); kit.label(c, '−', edge + 8, yy, { size: 13, weight: 700, color: red, align: 'center' }); }
        if (W >= 520) kit.label(c, 'feedback', fx - 4, (y2 + y3) / 2, { size: 10.5, color: red, align: 'right' });
        // the thyroid: a butterfly whose size shows goitre or shrinkage
        const goitre = V.cap > 0 ? 0.28 * clamp(Math.log10(Math.max(1e-3, s.T) / 4), 0, 1.4) + (V.ab > 0 ? 0.18 : 0) : 0;
        const sc = V.cap <= 0 ? 0 : clamp(0.55 + 0.35 * V.cap / 100 + goitre, 0.4, 1.35);
        if (sc > 0) {
          c.fillStyle = kit.hue(345, 0.55); c.strokeStyle = kit.hue(345); c.lineWidth = 1.5;
          for (const sgn of [-1, 1]) { c.beginPath(); c.ellipse(cx + sgn * 17 * sc, y3, 15 * sc, 24 * sc, sgn * 0.25, 0, Math.PI * 2); c.fill(); c.stroke(); }
          c.beginPath(); c.ellipse(cx, y3 + 6 * sc, 9 * sc, 6 * sc, 0, 0, Math.PI * 2); c.fill();
          if (cx - 40 * sc - 8 > 44) kit.label(c, 'Thyroid', cx - 40 * sc - 8, y3, { size: 12, weight: 650, align: 'right' });
        } else {
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.ellipse(cx, y3, 30, 20, 0, 0, Math.PI * 2); c.stroke(); c.setLineDash([]);
          kit.label(c, 'no thyroid', cx - 38, y3, { size: 11.5, color: C.muted, align: 'right' });
        }
        // antibodies (Y shapes) switching on the TSH receptor
        const nab = Math.round(V.ab / 15);
        for (let i = 0; i < nab; i++) {
          const a = -2.4 + i * 0.75, rx = cx + Math.cos(a) * 52, ry = y3 + Math.sin(a) * 30 + 6;
          c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(rx, ry + 7); c.lineTo(rx, ry); c.lineTo(rx - 5, ry - 6); c.moveTo(rx, ry); c.lineTo(rx + 5, ry - 6); c.stroke();
        }
        if (nab) kit.label(c, 'antibodies', cx - 50, y3 + 36, { size: 10.5, color: C.ok, align: 'right' });
        // tablets
        if (V.tabs > 0) {
          const px = Math.max(20, cx - 58), py = (y3 + y4) / 2 + 8;
          rrect(c, px - 14, py - 7, 28, 14, 7); c.fillStyle = blue; c.fill();
          flowArrow(kit, c, px + 16, py, cx - 6, py, 1 + 2.2 * V.tabs / 100, blue, ph[3] * V.tabs / 100);
          kit.label(c, 'tablets', px, py + 16, { size: 10.5, color: blue, align: 'center' });
        }
        boxAt(y4, 'Body tissues', s.F < 10 ? 'running slow' : s.F > 22 ? 'running fast' : 'normal pace', true);
        // ---- the graph: last 240 days, free T4 (left, linear) and TSH (right, log)
        const gx0 = LW + 34, gx1 = W - 40, gy0 = 26, gy1 = Hh - 30;
        if (gx1 - gx0 > 60) {
          const X = d => gx1 - (day - d) / 240 * (gx1 - gx0);
          const YF = f => gy1 - clamp(f, 0, 50) / 50 * (gy1 - gy0);
          const YT = t => gy1 - (clamp(Math.log10(Math.max(t, 1e-3)), -2, 2) + 2) / 4 * (gy1 - gy0);
          c.fillStyle = kit.hue(215, 0.1); c.fillRect(gx0, YF(22), gx1 - gx0, YF(10) - YF(22));
          c.fillStyle = kit.hue(28, 0.1); c.fillRect(gx0, YT(4), gx1 - gx0, YT(0.4) - YT(4));
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let f = 0; f <= 50; f += 10) { c.beginPath(); c.moveTo(gx0, YF(f)); c.lineTo(gx1, YF(f)); c.stroke(); kit.label(c, String(f), gx0 - 5, YF(f), { size: 10, color: blue, align: 'right' }); }
          for (const tv of [0.01, 0.1, 1, 10, 100]) kit.label(c, String(tv), gx1 + 5, YT(tv), { size: 10, color: orange });
          kit.label(c, 'free T4 (pmol/L)', gx0, gy0 - 14, { size: 10.5, color: blue, weight: 600 });
          kit.label(c, 'TSH (mU/L)', gx1 - 4, gy0 - 14, { size: 10.5, color: orange, weight: 600, align: 'right' });
          kit.label(c, 'days — the last 8 months', (gx0 + gx1) / 2, gy1 + 16, { size: 10.5, color: C.muted, align: 'center' });
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(gx0, gy0); c.lineTo(gx0, gy1); c.lineTo(gx1, gy1); c.lineTo(gx1, gy0); c.stroke();
          const line = (k, Y, col) => {
            c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath();
            let pen = false;
            for (const h of hist) { const x = X(h[0]); if (x < gx0) continue; pen ? c.lineTo(x, Y(h[k])) : c.moveTo(x, Y(h[k])); pen = true; }
            if (pen) c.lineTo(gx1, Y(k === 1 ? s.F : s.T));
            c.stroke();
          };
          line(1, YF, blue); line(2, YT, orange);
          kit.dot(c, gx1, YF(s.F), 4, blue); kit.dot(c, gx1, YT(s.T), 4, orange);
        }
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ cortisol through the day */
  Hyper.sim('endo-cortisol', {
    title: 'Cortisol through the day',
    blurb: `The body clock drives the adrenal axis, so cortisol climbs in the early morning, peaks within an hour or so of waking and falls to its lowest around midnight, with smaller pulses every hour or two. Shaded bands are the hours of sleep; the dial shows the time of day.

- Press **A stressful moment**: adrenaline (the spike marker) acts within seconds, cortisol rises over the next half hour and takes a couple of hours to settle.
- Press **Fly 7 hours east**: the person now sleeps by the new local clock, but the cortisol peak arrives in the afternoon and moves back only about an hour a day — jet lag.
- Tick **Steroid tablets** and turn up the speed: over a few weeks, feedback switches off the body's own production. Untick it and watch how slowly it recovers — why steroids taken for more than a few weeks are never stopped suddenly.

Schematic: real levels vary between people and laboratories.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'wake', label: 'Usual waking time', min: 4, max: 11, step: 0.5, value: 7, fmt: v => hhmm(v) },
        { id: 'speed', label: 'Speed (minutes of the day per second)', min: 5, max: 480, step: 5, value: 30, unit: 'min/s' },
        { id: 'steroid', type: 'check', label: 'Steroid tablets (long-term)', value: false },
        { type: 'buttons', items: [{ id: 'stress', label: 'A stressful moment', primary: true }, { id: 'fly', label: 'Fly 7 hours east' }] }
      ], id => {
        if (id === 'stress') { stress.push(t); if (stress.length > 30) stress.shift(); }
        else if (id === 'fly') { lag = 7; t += 7; hist = hist.map(p => [p[0] + 7, p[1]]); stress = stress.map(s0 => s0 + 7); }   // the local clock jumps 7 hours ahead
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['clock', 'Local time'], ['cort', 'Cortisol'], ['phase', 'What is happening'], ['clockb', 'Body clock'], ['axis', 'Adrenal axis']]);
      const kel = Math.LN2 / 1.17;
      let t = 0, C = 60, lag = 0, sup = 1, stress = [], hist = [];
      function drive(h) {
        const s = h - lag, u = (((s - (V.wake - 4)) % 24) + 24) % 24;
        return u < 3.5 ? Math.pow(u / 3.5, 2.5) : Math.exp(-(u - 3.5) / 3.8);
      }
      const pulse = h => 1 + 0.5 * Math.pow(Math.max(0, Math.sin(2 * Math.PI * h / 1.5)), 3);
      function stressDrive(h) { let a = 0; for (const s0 of stress) if (h >= s0 && h < s0 + 4) a += Math.exp(-(h - s0) / 0.35); return a; }
      function step(hours) {
        const n = Math.max(1, Math.ceil(hours / 0.01)), dt = hours / n;
        for (let i = 0; i < n; i++) {
          const acth = sup * ((0.03 + drive(t)) * pulse(t) + stressDrive(t));
          C += (420 * acth - kel * C) * dt;
          C = Math.max(0, C);
          if (lag > 0) lag = Math.max(0, lag - dt / 24);
          sup += (V.steroid ? (0.05 - sup) / 240 : (1 - sup) / 960) * dt;     // weeks to suppress, months to recover
          t += dt;
        }
      }
      t = -96;                                          // settle into the rhythm, keeping the last two days, then start at 05:00
      while (t < 5) { step(0.1); if (t > 5 - 48) hist.push([t, C]); }
      function report() {
        ro.set('clock', 'Day ' + (Math.floor(t / 24) + 1) + ', ' + hhmm(t));
        ro.set('cort', Math.round(C) + ' nmol/L (' + (C / 27.59).toFixed(1) + ' µg/dL)');
        const h = ((t % 24) + 24) % 24, sinceWake = (((h - V.wake) % 24) + 24) % 24;
        const asleep = sinceWake >= 16;
        const recent = stress.some(s0 => t - s0 >= 0 && t - s0 < 2);
        ro.set('phase', recent ? 'stress response: cortisol raised for an hour or two' : sup < 0.5 ? (V.steroid ? 'own cortisol switched off by the tablets' : 'own cortisol still low while the axis recovers') :
          asleep ? (sinceWake > 21 ? 'asleep: cortisol rising towards waking' : 'asleep: cortisol near its lowest') :
            sinceWake < 1.5 ? 'the morning peak after waking' : 'falling through the day');
        ro.set('clockb', lag > 0.05 ? Math.round(lag * 10) / 10 + ' h behind local time (jet lag)' : 'in step with the day');
        ro.set('axis', sup > 0.9 ? 'working normally' : (V.steroid ? 'being suppressed' : 'recovering') + ' — own production ' + Math.round(sup * 100) + ' %');
      }
      function draw(dt) {
        if (dt > 0) { step(dt * V.speed / 60); hist.push([t, C]); hist = hist.filter(p => p[0] > t - 48); }
        const Cc = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const night = kit.hue(230, Cc.dark ? 0.18 : 0.1), line = kit.hue(275);
        // the 24-hour dial
        const R = Math.min(Hh * 0.33, W * 0.14, 90), dx = R + 18, dy = Hh * 0.46;
        const ang = h => -Math.PI / 2 + (h / 24) * Math.PI * 2;
        c.beginPath(); c.arc(dx, dy, R, 0, Math.PI * 2); c.fillStyle = Cc.surface; c.fill(); c.strokeStyle = Cc.border2; c.lineWidth = 2; c.stroke();
        c.beginPath(); c.moveTo(dx, dy); c.arc(dx, dy, R * 0.92, ang(V.wake - 8), ang(V.wake)); c.closePath(); c.fillStyle = night; c.fill();
        for (let hh = 0; hh < 24; hh++) {
          const a = ang(hh), r1 = hh % 6 === 0 ? R * 0.8 : R * 0.88;
          c.strokeStyle = Cc.muted; c.lineWidth = hh % 6 === 0 ? 2 : 1; c.beginPath(); c.moveTo(dx + Math.cos(a) * r1, dy + Math.sin(a) * r1); c.lineTo(dx + Math.cos(a) * R * 0.97, dy + Math.sin(a) * R * 0.97); c.stroke();
          if (hh % 6 === 0) kit.label(c, String(hh), dx + Math.cos(a) * R * 0.64, dy + Math.sin(a) * R * 0.64, { size: 10.5, color: Cc.text2, align: 'center' });
        }
        const a = ang(((t % 24) + 24) % 24);
        c.strokeStyle = Cc.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx + Math.cos(a) * R * 0.78, dy + Math.sin(a) * R * 0.78); c.stroke();
        kit.dot(c, dx, dy, 4, Cc.text);
        kit.label(c, hhmm(t), dx, dy + R + 16, { size: 14, weight: 650, align: 'center' });
        kit.label(c, 'sleep', dx + Math.cos(ang(V.wake - 4)) * R * 0.5, dy + Math.sin(ang(V.wake - 4)) * R * 0.5, { size: 10, color: Cc.muted, align: 'center' });
        // the strip chart: the last 48 hours
        const x0 = dx + R + 50, x1 = W - 12, y0 = 18, y1 = Hh - 38, cmax = 800;
        if (x1 - x0 > 60) {
          const X = h => x1 - (t - h) / 48 * (x1 - x0), Y = v => y1 - clamp(v, 0, cmax) / cmax * (y1 - y0);
          // sleep bands (by the local clock)
          for (let d = Math.floor((t - 48) / 24) - 1; d <= Math.floor(t / 24) + 1; d++) {
            const a0 = d * 24 + V.wake - 8, a1 = d * 24 + V.wake;
            const xa = Math.max(x0, X(a0)), xb = Math.min(x1, X(a1));
            if (xb > xa) { c.fillStyle = night; c.fillRect(xa, y0, xb - xa, y1 - y0); }
          }
          c.strokeStyle = Cc.grid; c.lineWidth = 1;
          for (let v = 0; v <= cmax; v += 200) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); kit.label(c, String(v), x0 - 5, Y(v), { size: 10, color: Cc.muted, align: 'right' }); }
          c.setLineDash([4, 4]); c.strokeStyle = Cc.faint; c.beginPath(); c.moveTo(x0, Y(50)); c.lineTo(x1, Y(50)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'midnight level usually below about 50', x1 - 4, Y(50) - 8, { size: 10, color: Cc.muted, align: 'right' });
          for (const s0 of stress) {
            const xs = X(s0); if (xs < x0) continue;
            c.strokeStyle = Cc.warn; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xs, y1); c.lineTo(xs, y0 + 14); c.stroke();
            const right = xs > x1 - 110;
            kit.label(c, 'stress: adrenaline', right ? xs - 3 : xs + 3, y0 + 8, { size: 10, color: Cc.warn, align: right ? 'right' : 'left' });
          }
          const hstep = x1 - x0 < 360 ? 12 : 6;
          for (let hh = Math.ceil((t - 48) / hstep) * hstep; hh <= t; hh += hstep) {
            const xh = X(hh); if (xh < x0 + 12 || xh > x1 - 12) continue;
            kit.label(c, hhmm(hh).slice(0, 2) + ':00', xh, y1 + 10, { size: 10, color: Cc.muted, align: 'center' });
          }
          c.strokeStyle = line; c.lineWidth = 2.2; c.beginPath();
          hist.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])));
          c.stroke();
          kit.dot(c, x1, Y(C), 4, line);
          kit.label(c, 'cortisol (nmol/L), last 48 hours of local time', x0, y1 + 24, { size: 10.5, color: Cc.muted });
        }
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the menstrual cycle */
  // relative hormone levels (0–1, each scaled to its own peak) on cycle day d
  function cycleLevels(d, L, mode) {
    if (mode === 'pill') {
      const active = d < 22;
      return { fsh: active ? 0.12 : 0.12 + 0.2 * smooth(22, 28, d), lh: active ? 0.1 : 0.1 + 0.12 * smooth(22, 28, d), e2: active ? 0.1 : 0.1 + 0.25 * smooth(23, 28, d), p4: 0.03, hcg: 0,
        lining: d < 22 ? 3 + 2 * smooth(1, 21, d) : d < 24 ? 5 : 5 - 3 * smooth(24, 27, d), bleed: d >= 24 && d < 28, temp: 36.4, follicle: active ? 4 : 4 + 5 * smooth(22, 28, d), cl: 0, ov: null };
    }
    const O = L - 14, x = d - O;
    const preg = mode === 'preg';
    const fsh = 0.25 + 0.4 * gauss(d, 3, 2.3) + 0.4 * gauss(x, -0.5, 0.6) + 0.35 * smooth(L - 3, L + 1, d) * (preg ? 0 : 1) - 0.1 * smooth(O + 2, O + 6, d);
    const lh = 0.08 + 0.04 * smooth(1, O, d) + 0.9 * gauss(x, -0.6, 0.55);
    let e2 = 0.1 + 0.9 * agauss(x, -1.3, 2.8, 0.8) + 0.42 * gauss(x, 7, 3);
    let p4 = 0.03 + 0.97 * agauss(x, 7, 2.4, preg ? 50 : 2.7) * (x > -1 ? 1 : 0.2);
    let hcg = 0;
    if (preg) {
      hcg = Math.min(1.25, 0.02 * Math.pow(2, (x - 8) / 2)) * smooth(O + 7.5, O + 9, d);        // doubles about every two days
      e2 += (Math.max(e2, 0.52 + 0.03 * (x - 7)) - e2) * smooth(O + 5, O + 9, d);
      if (x > 7) p4 = Math.max(p4, 1 + 0.004 * (x - 7));
    }
    p4 = Math.min(1.2, p4);
    const bleed = d < 5.5 || (!preg && d >= L + 1);
    const lining = d < 5.5 ? 10 - 7 * smooth(1, 5.5, d) : 3 + 8 * smooth(5.5, O, d) + 1.5 * smooth(O, O + 6, d) - (!preg && d > L ? 8 * smooth(L, L + 5, d) : 0);
    const temp = 36.35 + 0.42 * clamp(p4 / 0.35, 0, 1);
    const follicle = x < 0 ? clamp(4 + 16 * smooth(4, O, d), 4, 21) : 0;
    const cl = x >= 0 ? (preg ? 1 : clamp(1 - smooth(O + 10, O + 14, d), 0, 1)) : 0;
    return { fsh: clamp(fsh, 0, 1), lh: clamp(lh, 0, 1), e2: clamp(e2, 0, 1.1), p4: clamp(p4, 0, 1.2), hcg, lining: Math.max(1, lining), bleed, temp, follicle, cl, ov: O };
  }

  Hyper.sim('endo-cycle', {
    title: 'The menstrual cycle',
    blurb: `Four hormones drawn across one cycle, each scaled to its own peak (their real units and sizes differ): **FSH** grows a follicle, the follicle's **oestradiol** thickens the womb lining, a surge of **LH** releases the egg, and the corpus luteum's **progesterone** holds the lining — until it fades and the period starts. Drag the day marker, or let it run.

- Make the cycle **35 days** long, then **21**: only the part before ovulation changes, so ovulation always falls about 14 days before the next period.
- The green band is the fertile window — the five days before ovulation and the day itself.
- Choose **Pregnancy begins**: hCG from the embryo keeps the corpus luteum alive, progesterone stays high and the period does not come.
- Choose **Combined pill**: FSH and LH are held down, no follicle matures and there is no LH surge; the bleed in the pill-free week is a withdrawal bleed.

Schematic curves for a typical cycle; real cycles vary from month to month.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Scenario', options: [['A natural cycle', 'natural'], ['Pregnancy begins this cycle', 'preg'], ['Combined pill (21 days of pills, 7 without)', 'pill']], value: 'natural' },
        { id: 'L', label: 'Cycle length', min: 21, max: 35, step: 1, value: 28, unit: 'days' },
        { id: 'speed', label: 'Speed', min: 0.5, max: 5, step: 0.5, value: 1.5, unit: 'days/s' },
        { id: 'play', type: 'check', label: 'Run', value: true }
      ], id => { if (id === 'mode' || id === 'L') day = Math.min(day, span()); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Cycle day'], ['phase', 'Phase'], ['ovary', 'In the ovary'], ['fert', 'Fertile window'], ['temp', 'Waking temperature']]);
      let day = 1;
      const span = () => V.mode === 'pill' ? 28 : V.mode === 'preg' ? V.L + 12 : V.L;
      const geo = { x0: 40, x1: 400, y0: 30, y1: 200 };
      kit.drag(st, {
        hit: p => (p.x >= geo.x0 - 6 && p.x <= geo.x1 + 6 && p.y >= geo.y0 - 20 && p.y <= st.H) ? 1 : null,
        move: (k, p) => { day = clamp(1 + (p.x - geo.x0) / Math.max(1, geo.x1 - geo.x0) * span(), 1, span() + 0.999); ctl.set('play', false); },
        hover: true
      });
      function report(lv) {
        const d = Math.floor(day), O = V.L - 14;
        ro.set('day', d + (V.mode === 'preg' && d > V.L ? ' (period missed)' : ''));
        let phase;
        if (V.mode === 'pill') phase = d < 22 ? 'active pills: ovulation suppressed' : lv.bleed ? 'pill-free week: withdrawal bleed' : 'pill-free week';
        else if (lv.bleed) phase = d > V.L ? 'period (next cycle)' : 'period (menstrual phase)';
        else if (day < O - 1) phase = 'follicular phase: a follicle grows';
        else if (day < O + 0.8) phase = 'ovulation: the LH surge releases the egg';
        else if (V.mode === 'preg' && day > O + 8) phase = 'early pregnancy: hCG keeps progesterone high';
        else if (V.mode !== 'preg' && day > O + 11) phase = 'late luteal phase: progesterone falling, a period is coming';
        else phase = 'luteal phase: progesterone from the corpus luteum';
        ro.set('phase', phase);
        ro.set('ovary', V.mode === 'pill' ? 'follicles stay small — no ovulation' : lv.follicle > 0 ? 'lead follicle about ' + Math.round(lv.follicle) + ' mm' : lv.cl > 0.05 ? (V.mode === 'preg' ? 'corpus luteum kept alive by hCG' : 'corpus luteum making progesterone') : 'corpus luteum has faded');
        ro.set('fert', V.mode === 'pill' ? 'none — no ovulation' : 'days ' + (O - 5) + '–' + O + ' (ovulation about day ' + O + ')');
        ro.set('temp', lv.temp.toFixed(2) + ' °C' + (lv.temp > 36.6 ? ' — raised by progesterone' : ''));
      }
      function draw(dt) {
        if (V.play && dt > 0) { day += dt * V.speed; if (day >= span() + 1) day = 1; }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const side = W > 520 ? 118 : 0;
        const x0 = 34, x1 = W - 12 - side, y0 = 44, y1 = Hh * 0.64, ly0 = Hh * 0.64 + 34, ly1 = Hh - 26;
        geo.x0 = x0; geo.x1 = x1; geo.y0 = y0; geo.y1 = y1;
        const N = span(), X = d => x0 + (d - 1) / N * (x1 - x0), Y = v => y1 - clamp(v, 0, 1.2) / 1.2 * (y1 - y0);
        const O = V.mode === 'pill' ? null : V.L - 14;
        const cols = { fsh: kit.hue(200), lh: kit.hue(28), e2: kit.hue(330), p4: kit.hue(140), hcg: kit.hue(265) };
        // phase band and fertile window
        if (O != null) {
          c.fillStyle = kit.hue(140, 0.14); c.fillRect(X(O - 5), y0, X(O + 1) - X(O - 5), y1 - y0);
          kit.label(c, 'fertile window', (X(O - 5) + X(O + 1)) / 2, y0 + 8, { size: 10, color: C.ok, align: 'center' });
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(O + 0.5), y0); c.lineTo(X(O + 0.5), ly1); c.stroke(); c.setLineDash([]);
          kit.label(c, 'ovulation', X(O + 0.5) + 3, y1 - 8, { size: 10, color: C.muted });
        } else {
          c.fillStyle = kit.hue(215, 0.08); c.fillRect(X(1), y0, X(22) - X(1), y1 - y0);
          kit.label(c, 'active pills', (X(1) + X(22)) / 2, y0 + 8, { size: 10, color: C.muted, align: 'center' });
          kit.label(c, 'pill-free', (X(22) + X(29)) / 2, y0 + 8, { size: 10, color: C.muted, align: 'center' });
        }
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let d = 1; d <= N + 1; d++) {
          if ((d - 1) % 7 !== 0 && d !== N + 1) continue;
          c.beginPath(); c.moveTo(X(d), y0); c.lineTo(X(d), y1); c.stroke();
          kit.label(c, String(d), X(d), y1 + 10, { size: 10, color: C.muted, align: 'center' });
        }
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        // curves
        const keys = V.mode === 'preg' ? ['fsh', 'lh', 'e2', 'p4', 'hcg'] : ['fsh', 'lh', 'e2', 'p4'];
        const names = { fsh: 'FSH', lh: 'LH', e2: 'oestradiol', p4: 'progesterone', hcg: 'hCG' };
        const samples = [];
        for (let i = 0; i <= 240; i++) { const d = 1 + i / 240 * N; samples.push([d, cycleLevels(d, V.L, V.mode)]); }
        for (const k of keys) {
          c.strokeStyle = cols[k]; c.lineWidth = 2.2; c.beginPath();
          samples.forEach(([d, lv], i) => i ? c.lineTo(X(d), Y(lv[k])) : c.moveTo(X(d), Y(lv[k])));
          c.stroke();
        }
        if (V.mode === 'preg') kit.label(c, 'hCG keeps rising, doubling about every two days', x1 - 4, Y(1.2) + 10, { size: 10, color: cols.hcg, align: 'right', bg: C.bg2 });
        const lgap = Math.min(92, (x1 - x0) / keys.length);
        keys.forEach((k, i) => { c.fillStyle = cols[k]; c.fillRect(x0 + 6 + i * lgap, 6, 12, 4); kit.label(c, names[k], x0 + 22 + i * lgap, 8, { size: 10.5, color: C.text2 }); });
        // womb lining strip
        kit.label(c, 'womb lining', x0, ly0 - 8, { size: 10.5, color: C.muted });
        const LY = mm => ly1 - clamp(mm, 0, 14) / 14 * (ly1 - ly0);
        c.beginPath(); c.moveTo(X(1), ly1);
        samples.forEach(([d, lv]) => c.lineTo(X(d), LY(lv.lining)));
        c.lineTo(X(N + 1 - 1e-6), ly1); c.closePath(); c.fillStyle = kit.hue(350, 0.35); c.fill();
        samples.forEach(([d, lv], i) => { if (lv.bleed && i < samples.length - 1) { c.fillStyle = C.bad; c.fillRect(X(d), ly1 - 4, Math.max(1, X(samples[i + 1][0]) - X(d)), 4); } });
        // the day marker
        const lv = cycleLevels(day, V.L, V.mode), xd = X(Math.min(day, N + 1));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xd, y0 - 4); c.lineTo(xd, ly1); c.stroke();
        for (const k of keys) kit.dot(c, xd, Y(lv[k]), 3.5, cols[k]);
        kit.label(c, 'day ' + Math.floor(day), xd, y0 - 12, { size: 11, weight: 650, align: 'center', bg: C.bg2 });
        // the ovary
        if (side) {
          const ox = W - side / 2 - 6, oy = y0 + 44, orx = 44, ory = 32;
          c.beginPath(); c.ellipse(ox, oy, orx, ory, 0, 0, Math.PI * 2); c.fillStyle = kit.hue(20, 0.18); c.fill(); c.strokeStyle = kit.hue(20); c.lineWidth = 1.5; c.stroke();
          for (let i = 0; i < 6; i++) kit.dot(c, ox - 26 + (i % 3) * 13, oy - 12 + Math.floor(i / 3) * 22, 3.2, C.surface, C.muted);
          if (lv.follicle > 0) {
            const r = clamp(lv.follicle, 4, 21) * 0.95;
            kit.dot(c, ox + 12, oy, r, kit.hue(200, 0.35), kit.hue(200)); kit.dot(c, ox + 12 + r * 0.35, oy - r * 0.3, 2.5, C.text);
          } else if (lv.cl > 0.02) {
            c.globalAlpha = 0.25 + 0.75 * lv.cl; kit.dot(c, ox + 12, oy, 13, kit.hue(48), kit.hue(40)); c.globalAlpha = 1;
          }
          kit.label(c, 'ovary', ox, oy + ory + 12, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, lv.follicle > 0 ? 'follicle' : lv.cl > 0.02 ? 'corpus luteum' : '', ox, oy + ory + 26, { size: 10.5, color: C.text2, align: 'center' });
          // waking temperature
          const tx = ox, ty0 = oy + ory + 44, th = Math.max(30, ly1 - ty0 - 8);
          rrect(c, tx - 5, ty0, 10, th, 5); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.stroke();
          const f = clamp((lv.temp - 36.1) / 0.9, 0, 1);
          rrect(c, tx - 3, ty0 + th * (1 - f), 6, th * f, 3); c.fillStyle = C.bad; c.fill();
          kit.label(c, lv.temp.toFixed(1) + ' °C', tx + 10, ty0 + th * (1 - f), { size: 10.5 });
        }
        report(lv);
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ bone across a lifetime */
  const BMD_MEAN = 0.858, BMD_SD = 0.12;                   // femoral neck, young-adult reference (NHANES III)
  function boneCurve(o) {
    // o: { male, z, meno, fast, treat } -> [[age, bmd], ...]
    const peak = BMD_MEAN + (o.male ? 0.075 : 0) + o.z * BMD_SD;
    const out = [];
    let b = 0, treatYears = 0;
    for (let a = 0; a <= 95.001; a += 0.25) {
      if (a <= 30) b = peak * (0.42 + 0.58 / (1 + Math.exp(-(a - 13.5) / 2.2)));
      else {
        let r;
        if (o.male) r = a < 40 ? 0 : a < 70 ? 0.005 : 0.008;
        else if (a < 38) r = 0;
        else if (a < o.meno) r = 0.004;
        else if (a < o.meno + 7) r = o.fast;
        else r = a < 75 ? 0.007 : 0.01;
        if (o.treat < 95 && a >= o.treat) { r = treatYears < 3 ? -0.012 : 0.003; treatYears += 0.25; }
        b *= Math.pow(1 - r, 0.25);
      }
      out.push([a, b]);
    }
    return out;
  }
  const tscore = b => (b - BMD_MEAN) / BMD_SD;

  Hyper.sim('endo-bone', {
    title: 'Bone density across a lifetime',
    blurb: `Bone density at the hip (femoral neck) from birth to 95, on two scales: g/cm² on the left and the T-score on the right — the number of standard deviations from the young-adult average. The bands mark normal (T −1 or above), low bone mass (−1 to −2.5) and osteoporosis (−2.5 or below). Drag along the graph to see the bone's inner lattice at any age.

- Lower the **peak bone mass** (genes, childhood activity and diet): the whole curve drops, and osteoporosis arrives years earlier.
- Move the **menopause** earlier: the fast phase of loss starts sooner — why premature menopause is a risk factor.
- Start **treatment** at 65 and compare the T-score at 80.
- Switch to a **man**: a higher peak and no menopausal drop, but steady loss still reaches the low-bone-mass band in old age.

Schematic averages: individual bone density and loss rates vary widely.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Person', options: [['A woman', 'f'], ['A man', 'm']], value: 'f' },
        { id: 'z', label: 'Peak bone mass (compared with average)', min: -2, max: 2, step: 0.1, value: 0, unit: 'SD' },
        { id: 'meno', label: 'Age at menopause', min: 38, max: 58, step: 1, value: 51, unit: 'yr' },
        { id: 'fast', label: 'Yearly loss in the years after menopause', min: 0.5, max: 3, step: 0.1, value: 1.8, unit: '%' },
        { id: 'treat', label: 'Start bone treatment at age (95 = never)', min: 50, max: 95, step: 1, value: 95, unit: 'yr' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play a lifetime', primary: true }] }
      ], id => { if (id === 'play') { age = 0; playing = true; } build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['at', 'At the marked age'], ['t50', 'T-score at 50'], ['t65', 'T-score at 65'], ['t80', 'T-score at 80'], ['low', 'Low bone mass from'], ['op', 'Osteoporosis from']]);
      let curve = [], other = [], age = 68, playing = false;
      const geo = { x0: 0, x1: 1 };
      function build() {
        const male = V.sex === 'm';
        curve = boneCurve({ male, z: V.z, meno: V.meno, fast: V.fast / 100, treat: V.treat });
        other = boneCurve({ male: !male, z: V.z, meno: 51, fast: 0.018, treat: 95 });
        ctl.show('meno', !male); ctl.show('fast', !male);
        const at = a => curve[Math.round(clamp(a, 0, 95) * 4)][1];
        ro.set('t50', tscore(at(50)).toFixed(1)); ro.set('t65', tscore(at(65)).toFixed(1)); ro.set('t80', tscore(at(80)).toFixed(1));
        const first = lim => { const p = curve.find(q => q[0] > 30 && tscore(q[1]) <= lim); return p ? 'about age ' + Math.round(p[0]) : 'not before 95'; };
        ro.set('low', first(-1)); ro.set('op', first(-2.5));
      }
      kit.drag(st, {
        hit: p => p.x >= geo.x0 - 8 && p.x <= geo.x1 + 8 ? 1 : null,
        move: (k, p) => { age = clamp((p.x - geo.x0) / Math.max(1, geo.x1 - geo.x0) * 95, 0, 95); playing = false; },
        hover: true
      });
      build();
      function lattice(c, C, cx, cy, R, frac) {
        // a cross-section: a cortex ring and struts of trabecular bone that thin and break as density falls
        c.save();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill();
        c.clip();
        const n = 7, step = (2 * R) / n, keep = clamp(0.35 + frac * 0.75, 0, 1);
        c.strokeStyle = kit.hue(40, 0.95); c.lineCap = 'round';
        c.lineWidth = 0.6 + 3.4 * clamp(frac, 0, 1.1);
        let k = 0;
        for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
          const px = cx - R + i * step + ((j % 2) ? step / 2 : 0), py = cy - R + j * step;
          for (const [ex, ey] of [[step, 0], [step / 2, step], [-step / 2, step]]) {
            const h = Math.abs(Math.sin(++k * 12.9898) * 43758.5453) % 1;
            if (h > keep) continue;
            c.beginPath(); c.moveTo(px, py); c.lineTo(px + ex, py + ey); c.stroke();
          }
        }
        c.restore();
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.strokeStyle = kit.hue(40); c.lineWidth = 2 + 4 * clamp(frac, 0, 1.1); c.stroke();
      }
      function draw(dt) {
        if (playing && dt > 0) { age += dt * 9; if (age >= 95) { age = 95; playing = false; } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const side = W > 480 ? Math.min(150, W * 0.24) : 0;
        const x0 = 46 + side, x1 = W - 46, y0 = 16, y1 = Hh - 30;
        geo.x0 = x0; geo.x1 = x1;
        const tmin = -5, tmax = 2.5;
        const X = a => x0 + a / 95 * (x1 - x0), YT = tv => y1 - (clamp(tv, tmin, tmax) - tmin) / (tmax - tmin) * (y1 - y0);
        const Y = b => YT(tscore(b));
        // T-score bands apply to adults; in children bone is still being built
        const xa = X(20);
        c.fillStyle = kit.hue(140, 0.1); c.fillRect(xa, YT(tmax), x1 - xa, YT(-1) - YT(tmax));
        c.fillStyle = kit.hue(45, 0.14); c.fillRect(xa, YT(-1), x1 - xa, YT(-2.5) - YT(-1));
        c.fillStyle = kit.hue(0, 0.12); c.fillRect(xa, YT(-2.5), x1 - xa, YT(tmin) - YT(-2.5));
        kit.label(c, 'normal', xa + 6, YT(-0.55), { size: 10.5, color: C.ok });
        kit.label(c, 'low bone mass', xa + 6, YT(-1.75), { size: 10.5, color: C.warn });
        kit.label(c, 'osteoporosis', xa + 6, YT(-3.2), { size: 10.5, color: C.bad });
        kit.label(c, 'growing:', X(1), YT(1.9), { size: 10, color: C.muted });
        kit.label(c, 'no T-score', X(1), YT(1.5), { size: 10, color: C.muted });
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let a = 0; a <= 90; a += 10) { c.beginPath(); c.moveTo(X(a), y0); c.lineTo(X(a), y1); c.stroke(); kit.label(c, String(a), X(a), y1 + 10, { size: 10, color: C.muted, align: 'center' }); }
        for (let tv = -5; tv <= 2; tv++) kit.label(c, (tv > 0 ? '+' : '') + tv, x1 + 6, YT(tv), { size: 10, color: C.muted });
        for (let b = 0.3; b <= 1.15; b += 0.2) kit.label(c, b.toFixed(1), x0 - 5, Y(b), { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'age (years)', (x0 + x1) / 2, y1 + 22, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'g/cm²', x0 - 5, y0 + 2, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'T', x1 + 6, y0 + 2, { size: 10.5, color: C.muted, weight: 650 });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        if (V.sex === 'f') { c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(V.meno), y0); c.lineTo(X(V.meno), y1); c.stroke(); c.setLineDash([]); kit.label(c, 'menopause', X(V.meno) + 3, y0 + 8, { size: 10, color: C.muted }); }
        if (V.treat < 95) { c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(V.treat), y0 + 18); c.lineTo(X(V.treat), y1); c.stroke(); kit.label(c, 'treatment', X(V.treat) + 3, y0 + 24, { size: 10, color: C.ok }); }
        const path = (pts, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.setLineDash([]); };
        path(other, C.faint, 1.6, [5, 4]);
        path(curve, kit.hue(V.sex === 'f' ? 330 : 215), 2.6);
        kit.label(c, V.sex === 'f' ? 'dashed: a man with the same peak' : 'dashed: a woman with the same peak', x1 - 6, y1 - 10, { size: 10, color: C.muted, align: 'right' });
        const bNow = curve[Math.round(clamp(age, 0, 95) * 4)][1];
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(age), y0); c.lineTo(X(age), y1); c.stroke();
        kit.dot(c, X(age), Y(bNow), 5, C.accent, C.surface);
        const peak = curve[120][1];
        ro.set('at', 'age ' + Math.round(age) + ': ' + bNow.toFixed(2) + ' g/cm², T = ' + tscore(bNow).toFixed(1));
        if (side) {
          const R = Math.max(12, Math.min(side * 0.36, (Hh - 80) * 0.3));
          lattice(c, C, side / 2 + 6, Hh * 0.4, R, bNow / Math.max(0.3, peak));
          kit.label(c, 'inside the bone', side / 2 + 6, Hh * 0.4 - R - 14, { size: 11, color: C.muted, align: 'center' });
          kit.label(c, 'age ' + Math.round(age), side / 2 + 6, Hh * 0.4 + R + 16, { size: 13, weight: 650, align: 'center' });
          const T = tscore(bNow);
          kit.label(c, T <= -2.5 ? 'osteoporosis' : T <= -1 ? 'low bone mass' : 'normal', side / 2 + 6, Hh * 0.4 + R + 34, { size: 11.5, align: 'center', color: T <= -2.5 ? C.bad : T <= -1 ? C.warn : C.ok });
        }
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ glucose and insulin after a meal */
  // time in minutes, glucose G in mmol/L, insulin I and its delayed action X in µU/mL, gut glucose Q1, Q2 in mmol
  const MEAL_PROFILES = {
    normal: { si: 1, beta: 1, inc: 1, name: 'healthy' },
    resistant: { si: 0.35, beta: 2.1, inc: 1, name: 'insulin resistance' },
    t2: { si: 0.35, beta: 0.8, inc: 0.4, name: 'type 2 diabetes' },
    none: { si: 1, beta: 0, inc: 0, name: 'no insulin' }
  };
  const MM = { V: 13, c0: 0.018, ci: 0.006, sh: 0.08, n: 0.12, p2: 0.045, K: 7.5, inc0: 1.2, sd: 20, f: 0.75, Ub0: 0.552 };
  MM.Emax = (MM.Ub0 * 5 / 6 + 5 * (MM.c0 + MM.ci * 8)) * (1 + MM.sh * 8);
  MM.hill = G => { const g4 = Math.pow(Math.max(0, G), 4); return g4 / (g4 + Math.pow(MM.K, 4)); };
  MM.Smax = MM.n * 8 / MM.hill(5);
  function mealFlux(s, p, walk, Ra, dG) {
    const G = Math.max(0.5, s.G), Xs = s.X * p.si, none = p.beta === 0;
    const EGP = MM.Emax / (1 + MM.sh * Xs) + (walk ? (none ? 0.8 : 0.15) : 0);
    const Ub = MM.Ub0 * G / (G + 1);
    const Up = G * (MM.c0 + MM.ci * Xs + (walk ? (none ? 0.02 : 0.18) : 0));
    const Ren = 0.04 * Math.max(0, G - 10);
    const S = p.beta * (MM.Smax * MM.hill(G) + MM.inc0 * p.inc * Ra + MM.sd * p.inc * Math.max(0, dG));
    return { EGP, Ub, Up, Ren, S, Ra };
  }
  const mealBase = {};
  function mealBaseline(key) {
    if (mealBase[key]) return mealBase[key];
    const p = MEAL_PROFILES[key], s = { G: 5, I: 8, X: 8 };
    for (let t = 0; t < 4000; t += 0.2) {
      const f = mealFlux(s, p, false, 0, 0);
      s.G += (f.EGP - f.Ub - f.Up - f.Ren) / MM.V * 0.2; s.I += (f.S - MM.n * s.I) * 0.2; s.X += MM.p2 * (s.I - s.X) * 0.2;
    }
    return (mealBase[key] = { G: s.G, I: s.I, X: s.X });
  }
  function mealRun(key, carbs, ka, walkAt) {
    const p = MEAL_PROFILES[key], b = mealBaseline(key);
    const s = { G: b.G, I: b.I, X: b.X, Q1: carbs * MM.f * 1000 / 180.16, Q2: 0 };
    const out = [], dt = 0.1;
    let dG = 0, urine = 0;
    for (let i = 0; i <= 3000; i++) {
      const t = i * dt, walk = walkAt != null && t >= walkAt && t < walkAt + 20, Ra = ka * s.Q2;
      const f = mealFlux(s, p, walk, Ra, dG);
      if (i % 10 === 0) out.push({ t, G: s.G, I: s.I, f, walk, urine });
      dG = (f.EGP + Ra - f.Ub - f.Up - f.Ren) / MM.V;
      const dQ1 = -ka * s.Q1, dQ2 = ka * s.Q1 - ka * s.Q2;
      s.Q1 += dQ1 * dt; s.Q2 += dQ2 * dt;
      s.G = Math.max(0.5, s.G + dG * dt); s.I = Math.max(0, s.I + (f.S - MM.n * s.I) * dt); s.X += MM.p2 * (s.I - s.X) * dt;
      urine += f.Ren * dt * 0.18016;
    }
    return { pts: out, base: b };
  }

  Hyper.sim('endo-meal', {
    title: 'Glucose and insulin after a meal',
    blurb: `A simple model of the body after eating. The diagram shows where glucose is flowing at each moment — arrow widths are grams per hour — and the pancreas releasing insulin; the graphs follow blood glucose and insulin for five hours.

- Compare **healthy** with **insulin resistance**: glucose looks almost normal, but only because the pancreas is making two to three times as much insulin — the hidden stage before type 2 diabetes.
- Choose **type 2 diabetes** with the **75 g glucose drink** and read the 2-hour value: 11.1 mmol/L (200 mg/dL) or more is the diagnostic threshold.
- Tick **a walk after eating**: working muscle takes up glucose without insulin, and the peak drops (the dashed line is the same meal without the walk).
- Choose **no insulin**: the liver keeps pouring out glucose, the level climbs past the kidneys' threshold and glucose is lost in the urine — untreated type 1 diabetes. Without insulin, exercise raises glucose instead of lowering it.

A teaching model with typical values; it is not a tool for managing diabetes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const gbox = document.createElement('div'); gbox.style.padding = '4px 10px 10px'; box.stage.appendChild(gbox);
      const plotG = kit.plot(gbox, { x: { label: 'minutes after eating', min: 0, max: 300, name: 'time (min)' }, y: { label: 'blood glucose', min: 0 } }, 190);
      const plotI = kit.plot(gbox, { x: { label: 'minutes after eating', min: 0, max: 300, name: 'time (min)' }, y: { label: 'insulin (µU/mL)', min: 0 } }, 140);
      const p0 = params && MEAL_PROFILES[params.profile] ? params.profile : 'normal';
      const ctl = kit.controls(box.side, [
        { id: 'profile', type: 'select', label: 'Person', options: [['Healthy', 'normal'], ['Insulin resistance (pancreas compensating)', 'resistant'], ['Type 2 diabetes', 't2'], ['No insulin (untreated type 1)', 'none']], value: p0 },
        { id: 'food', type: 'select', label: 'Food', options: [['75 g glucose drink (the test)', 'drink'], ['Fast carbohydrate: white bread, juice', 'fast'], ['Slow carbohydrate: wholegrain, with protein and fat', 'slow']], value: 'fast' },
        { id: 'carbs', label: 'Carbohydrate in the meal', min: 0, max: 120, step: 5, value: 60, unit: 'g' },
        { id: 'walk', type: 'check', label: 'A 20-minute walk after eating', value: false },
        { id: 'walkAt', label: 'Walk starts after', min: 0, max: 90, step: 5, value: 20, unit: 'min' },
        { id: 'units', type: 'select', label: 'Glucose units', options: [['mmol/L', 'mmol'], ['mg/dL', 'mg']], value: 'mmol' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], id => { if (id === 'food' && ctl.values.food === 'drink') ctl.set('carbs', 75); if (id !== 'units') tNow = 0; build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time after eating'], ['g', 'Glucose now'], ['i', 'Insulin now'], ['peak', 'Peak glucose'], ['g2', 'Glucose at 2 hours'], ['walkfx', 'Effect of the walk'], ['urine', 'Glucose lost in urine']]);
      let run = null, ref = null, tNow = 0, ph = 0;
      const KA = { drink: 0.028, fast: 0.02, slow: 0.012 };
      function build() {
        const ka = KA[V.food] || 0.02, carbs = V.food === 'drink' ? 75 : V.carbs;
        run = mealRun(V.profile, carbs, ka, V.walk ? V.walkAt : null);
        ref = V.walk ? mealRun(V.profile, carbs, ka, null) : null;
        ctl.show('walkAt', V.walk); ctl.show('carbs', V.food !== 'drink');
        const u = V.units, cv = v => u === 'mg' ? v * MG : v;
        const series = [{ pts: run.pts.map(q => [q.t, cv(q.G)]), label: MEAL_PROFILES[V.profile].name + (V.walk ? ', with the walk' : ''), color: kit.hue(28) }];
        if (ref) series.push({ pts: ref.pts.map(q => [q.t, cv(q.G)]), label: 'without the walk', dash: [6, 4], color: kit.colors().faint });
        const top = Math.max(12, ...run.pts.map(q => q.G), ...(ref ? ref.pts.map(q => q.G) : [0])) * 1.08;
        plotG.set({ series, y: { label: 'blood glucose (' + (u === 'mg' ? 'mg/dL' : 'mmol/L') + ')', min: 0, max: cv(top) },
          hlines: [{ y: cv(7.8), label: '7.8 (140): 2-hour limit of normal' }, { y: cv(11.1), label: '11.1 (200): diabetes at 2 hours', color: kit.colors().bad }, { y: cv(3.9), label: '3.9 (70): low' }],
          fmtY: v => u === 'mg' ? Math.round(v) + ' mg/dL' : v.toFixed(1) + ' mmol/L', legend: true });
        plotI.set({ series: [{ pts: run.pts.map(q => [q.t, q.I]), label: 'insulin', color: kit.hue(215) }], y: { label: 'insulin (µU/mL)', min: 0, max: Math.max(20, ...run.pts.map(q => q.I)) * 1.1 }, fmtY: v => v.toFixed(0) + ' µU/mL' });
        const peak = run.pts.reduce((m, q) => q.G > m.G ? q : m, run.pts[0]);
        const at2 = run.pts[120];
        ro.set('peak', gtxt(peak.G, u) + ' at ' + Math.round(peak.t) + ' min');
        ro.set('g2', gtxt(at2.G, u) + (V.food === 'drink' ? (at2.G >= 11.1 ? ' — diabetes range' : at2.G >= 7.8 ? ' — impaired tolerance range' : ' — normal range') : ''));
        if (ref) {
          const pk2 = Math.max(...ref.pts.map(q => q.G)), b = run.base.G;
          const area = pts => pts.reduce((a, q) => a + Math.max(0, q.G - b), 0);
          const cut = area(ref.pts) > 1e-6 ? Math.round((1 - area(run.pts) / area(ref.pts)) * 100) : 0;
          ro.set('walkfx', V.profile === 'none' ? 'glucose rises: without insulin the liver releases more' : 'peak ' + (u === 'mg' ? Math.round((pk2 - peak.G) * MG) + ' mg/dL' : (pk2 - peak.G).toFixed(1) + ' mmol/L') + ' lower; rise above fasting ' + cut + ' % smaller');
        } else ro.set('walkfx', 'tick the walk to compare');
        const ur = run.pts[run.pts.length - 1].urine;
        ro.set('urine', ur < 0.05 ? 'none' : ur.toFixed(1) + ' g in 5 hours');
      }
      build();
      function draw(dt) {
        if (dt > 0 && tNow < 300) tNow = Math.min(300, tNow + dt * 20);
        ph += (dt || 0) * 40;
        const q = run.pts[Math.min(run.pts.length - 1, Math.round(tNow))];
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, f = q.f;
        const gcol = kit.hue(28), icol = kit.hue(215);
        const gph = x => x * 0.18016 * 60;                       // mmol/min -> g/h
        const wd = x => 1 + 3.2 * Math.sqrt(Math.max(0, gph(x)) / 8);
        const bx = W * 0.5, by = Hh * 0.55, bw = Math.min(150, W * 0.22), bh = Hh * 0.42;
        // the blood pool
        rrect(c, bx - bw / 2, by - bh / 2, bw, bh, 16); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke();
        const lvl = clamp(q.G / 30, 0, 1);
        c.save(); rrect(c, bx - bw / 2, by - bh / 2, bw, bh, 16); c.clip();
        c.fillStyle = kit.hue(28, 0.3); c.fillRect(bx - bw / 2, by + bh / 2 - bh * lvl, bw, bh * lvl); c.restore();
        const small = W < 560, fs = small ? 10 : 11.5;
        kit.label(c, 'blood', bx, by - bh / 2 + 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, gtxt(q.G, V.units), bx, by, { size: small ? 12.5 : 15, weight: 700, align: 'center' });
        kit.label(c, (small ? '' : 'insulin ') + Math.round(q.I) + ' µU/mL', bx, by + 18, { size: small ? 10 : 11, color: icol, align: 'center' });
        const node = (x, y, label, col) => {
          const w = Math.max(50, label.length * fs * 0.6 + 14);
          x = clamp(x, w / 2 + 4, W - w / 2 - 4);
          rrect(c, x - w / 2, y - 15, w, 30, 9); c.fillStyle = C.surface; c.fill(); c.strokeStyle = col || C.border2; c.lineWidth = 1.5; c.stroke();
          kit.label(c, label, x, y, { size: fs, weight: 650, align: 'center' });
        };
        const lx = W * 0.14, rx = W * 0.86, flowLabel = (x, y, v) => kit.label(c, Math.round(gph(v)) + ' g/h', x, y, { size: 10.5, color: gcol, align: 'center', bg: C.bg2 });
        // in: gut and liver
        flowArrow(kit, c, lx + 38, Hh * 0.3, bx - bw / 2 - 4, by - bh * 0.2, wd(f.Ra), gcol, ph); node(lx, Hh * 0.28, 'gut'); flowLabel((lx + bx) / 2 - 10, Hh * 0.3, f.Ra);
        flowArrow(kit, c, lx + 38, Hh * 0.78, bx - bw / 2 - 4, by + bh * 0.2, wd(f.EGP), gcol, ph); node(lx, Hh * 0.8, 'liver'); flowLabel((lx + bx) / 2 - 10, Hh * 0.86, f.EGP);
        // out: brain, muscle and fat, kidneys
        flowArrow(kit, c, bx + bw / 2 + 4, by - bh * 0.25, rx - 44, Hh * 0.18, wd(f.Ub), gcol, ph); node(rx, Hh * 0.16, 'brain'); flowLabel((bx + rx) / 2 + 8, Hh * 0.2, f.Ub);
        flowArrow(kit, c, bx + bw / 2 + 4, by, rx - 56, Hh * 0.52, wd(f.Up), gcol, ph); node(rx, Hh * 0.52, q.walk ? 'muscle (walking)' : 'muscle, fat', q.walk ? C.ok : null); flowLabel((bx + rx) / 2 + 8, Hh * 0.46, f.Up);
        if (f.Ren > 0.001) { flowArrow(kit, c, bx + bw / 2 + 4, by + bh * 0.3, rx - 44, Hh * 0.86, wd(f.Ren), gcol, ph); flowLabel((bx + rx) / 2 + 8, Hh * 0.9, f.Ren); }
        node(rx, Hh * 0.86, small ? 'kidneys' : 'kidneys → urine');
        // the pancreas and insulin
        const px = bx, py = 18;
        flowArrow(kit, c, px, py + 14, px, by - bh / 2 - 4, 1 + 3.2 * Math.sqrt(Math.max(0, f.S) / 3), icol, ph * 0.8);
        node(px, py, MEAL_PROFILES[V.profile].beta === 0 ? 'pancreas: no insulin' : 'pancreas: insulin', icol);
        kit.label(c, Math.round(tNow) + ' min', 8, Hh - 10, { size: 12, weight: 650, color: C.muted });
        plotG.set({ vlines: [{ x: tNow, color: C.text }] });
        plotI.set({ vlines: [{ x: tNow, color: C.text }] });
        ro.set('time', Math.round(tNow) + ' min' + (q.walk ? ' (walking)' : ''));
        ro.set('g', gboth(q.G));
        ro.set('i', Math.round(q.I) + ' µU/mL (fasting ' + Math.round(run.base.I) + ')');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ HbA1c */
  const A1C = { tau: 50, life: 120 };
  const a1cFromMean = (g, sf) => 1.627 + 0.6277 * g * sf;           // ADAG, with a red-cell age factor
  Hyper.sim('endo-a1c', {
    title: 'HbA1c: a three-month memory',
    blurb: `Glucose sticks to the haemoglobin inside red cells, and each cell keeps collecting it for as long as it lives — about four months. So HbA1c (the purple line) is a weighted average of past glucose, with the most recent weeks counting most. The dots are daily average glucose; at day 0 the average changes, for example after starting treatment.

- Drop the average from 10 to 7.5 mmol/L (180 to 135 mg/dL) and watch HbA1c: about half the change shows after a month, most of it after three — why HbA1c is rechecked about every three months.
- Try a **shorter red-cell life** (as after bleeding or with haemolysis): HbA1c reads lower for the same glucose. **Older red cells** (as in untreated iron deficiency) read higher. That is when HbA1c misleads.
- Compare the **estimated average glucose** with the true average: the ADAG equation, eAG = 28.7 × A1c − 46.7 mg/dL.

A teaching model: real red-cell survival and glycation vary between people.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'before', label: 'Average glucose before day 0', min: 4.5, max: 20, step: 0.5, value: 10, unit: 'mmol/L', fmt: v => v.toFixed(1) + ' mmol/L (' + Math.round(v * MG) + ' mg/dL)' },
        { id: 'after', label: 'Average glucose from day 0', min: 4.5, max: 20, step: 0.5, value: 7.5, unit: 'mmol/L', fmt: v => v.toFixed(1) + ' mmol/L (' + Math.round(v * MG) + ' mg/dL)' },
        { id: 'life', type: 'select', label: 'Red cells', options: [['Normal red-cell life', 1], ['Shorter red-cell life (bleeding, haemolysis)', 0.8], ['Older red cells (untreated iron deficiency)', 1.08]], value: 1 },
        { id: 'units', type: 'select', label: 'Glucose units', options: [['mmol/L', 'mmol'], ['mg/dL', 'mg']], value: 'mmol' },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay from day 0', primary: true }] }
      ], id => { if (id === 'replay' || id === 'before' || id === 'after') day = 0; build(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['day', 'Day'], ['a1c', 'HbA1c'], ['eag', 'Estimated average glucose'], ['true', 'True average, last 30 days'], ['cat', 'Range'], ['share', 'Share from the last 30 days']]);
      const D0 = -240, D1 = 180;
      let gl = [], a1 = [], day = 0;
      function build() {
        const R = kit.fin.normals(11);
        gl = [];
        for (let d = D0; d <= D1; d++) gl.push(Math.max(3.2, (d < 0 ? V.before : V.after) + 1.1 * R()));
        const sf = +V.life || 1, L = Math.round(A1C.life * sf), tau = A1C.tau * sf;
        const w = []; let ws = 0;
        for (let u = 0; u <= L; u++) { w.push(Math.exp(-u / tau)); ws += w[u]; }
        a1 = gl.map((g, i) => { let s = 0, n = 0; for (let u = 0; u <= L; u++) { const j = i - u; if (j < 0) break; s += w[u] * gl[j]; n += w[u]; } return n > 0 ? a1cFromMean(s / n, sf) : NaN; });
        let s30 = 0; for (let u = 0; u < 30; u++) s30 += w[u];
        ro.set('share', Math.round(s30 / ws * 100) + ' %');
      }
      build();
      function report(i) {
        const a = a1[i], u = V.units;
        ro.set('day', Math.round(day) + (day < 1 ? ' — the change starts' : ''));
        ro.set('a1c', Number.isFinite(a) ? a.toFixed(1) + ' % (' + Math.round(10.929 * (a - 2.15)) + ' mmol/mol)' : '—');
        const eag = Number.isFinite(a) ? (28.7 * a - 46.7) / MG : NaN;
        ro.set('eag', Number.isFinite(eag) ? gtxt(eag, u) : '—');
        let s = 0; for (let k = 0; k < 30; k++) s += gl[Math.max(0, i - k)];
        ro.set('true', gtxt(s / 30, u));
        ro.set('cat', !Number.isFinite(a) ? '—' : a >= 6.5 ? 'diabetes range (≥ 6.5 %, 48 mmol/mol)' : a >= 5.7 ? 'prediabetes range (5.7–6.4 %)' : 'normal range (below 5.7 %)');
      }
      function draw(dt) {
        if (dt > 0 && day < D1) day = Math.min(D1, day + dt * 12);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, u = V.units;
        const x0 = 52, x1 = W - 16, dmin = -60;
        const X = d => x0 + (d - dmin) / (D1 - dmin) * (x1 - x0);
        const iNow = Math.round(day) - D0;
        const cellsH = Hh > 360 ? 52 : 0;
        const ay0 = 20, ay1 = (Hh - cellsH) * 0.5, gy0 = ay1 + 26, gy1 = Hh - cellsH - 34;
        const amin = 4, amax = 13, YA = a => ay1 - (clamp(a, amin, amax) - amin) / (amax - amin) * (ay1 - ay0);
        const gmax = 22, YG = g => gy1 - clamp(g, 0, gmax) / gmax * (gy1 - gy0);
        // HbA1c panel
        c.fillStyle = kit.hue(140, 0.1); c.fillRect(x0, YA(5.7), x1 - x0, YA(amin) - YA(5.7));
        c.fillStyle = kit.hue(45, 0.14); c.fillRect(x0, YA(6.5), x1 - x0, YA(5.7) - YA(6.5));
        c.fillStyle = kit.hue(0, 0.09); c.fillRect(x0, YA(amax), x1 - x0, YA(6.5) - YA(amax));
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let a = 4; a <= 13; a += 1) { c.beginPath(); c.moveTo(x0, YA(a)); c.lineTo(x1, YA(a)); c.stroke(); if (a % 2 === 0) kit.label(c, a + ' %', x0 - 5, YA(a), { size: 10, color: C.muted, align: 'right' }); }
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x0, YA(7)); c.lineTo(x1, YA(7)); c.stroke(); c.setLineDash([]);
        kit.label(c, W < 560 ? '7 %: a common target' : '7 % (53 mmol/mol): a common target in diabetes', x1 - 4, YA(7) - 8, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'HbA1c', x0 + 4, ay0 + 2, { size: 11, weight: 650, color: kit.hue(275) });
        c.strokeStyle = kit.hue(275); c.lineWidth = 2.6; c.beginPath();
        let pen = false;
        for (let d = dmin; d <= Math.round(day); d++) { const v = a1[d - D0]; if (!Number.isFinite(v)) continue; pen ? c.lineTo(X(d), YA(v)) : c.moveTo(X(d), YA(v)); pen = true; }
        c.stroke();
        // glucose panel
        c.strokeStyle = C.grid;
        for (let g = 0; g <= 20; g += 5) { c.beginPath(); c.moveTo(x0, YG(g)); c.lineTo(x1, YG(g)); c.stroke(); kit.label(c, u === 'mg' ? String(Math.round(g * MG)) : String(g), x0 - 5, YG(g), { size: 10, color: C.muted, align: 'right' }); }
        kit.label(c, 'daily average glucose (' + (u === 'mg' ? 'mg/dL' : 'mmol/L') + ')', x0 + 4, gy0 - 8, { size: 11, weight: 650, color: kit.hue(28) });
        c.fillStyle = kit.hue(28, 0.8);
        for (let d = dmin; d <= Math.round(day); d++) { const g = gl[d - D0]; c.fillRect(X(d) - 1.2, YG(g) - 1.2, 2.4, 2.4); }
        for (const [a, b, g] of [[dmin, 0, V.before], [0, D1, V.after]]) { c.setLineDash([6, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(a), YG(g)); c.lineTo(X(b), YG(g)); c.stroke(); c.setLineDash([]); }
        // day axis and marker
        for (let d = -60; d <= D1; d += 30) { kit.label(c, String(d), clamp(X(d), x0 + 8, x1 - 10), gy1 + 10, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'days since the change', (x0 + x1) / 2, gy1 + 23, { size: 10, color: C.muted, align: 'center' });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), ay0); c.lineTo(X(0), gy1); c.stroke();
        kit.label(c, 'change', X(0) + 3, ay0 + 2, { size: 10, color: C.muted });
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.moveTo(X(day), ay0); c.lineTo(X(day), gy1); c.stroke();
        const aNow = a1[clamp(iNow, 0, a1.length - 1)];
        if (Number.isFinite(aNow)) kit.dot(c, X(day), YA(aNow), 5, kit.hue(275), C.surface);
        // red cells of different ages: each has collected glucose for as long as it has lived
        if (cellsH) {
          const n = 16, cy = Hh - cellsH / 2 + 2, cw = (x1 - x0) / n;
          kit.label(c, 'red cells today, from newest (left) to oldest: each dot is glucose it has collected', x0, cy - 19, { size: 10, color: C.muted });
          const L = Math.round(A1C.life * (+V.life || 1));
          for (let k = 0; k < n; k++) {
            const age = (k + 0.5) / n * L;
            let s = 0; for (let u2 = 0; u2 < age; u2++) s += gl[clamp(iNow - u2, 0, gl.length - 1)];
            const dots = Math.round(clamp(s / (10 * A1C.life), 0, 1.6) * 10);
            const r = Math.min(cw * 0.36, 11), cxk = x0 + (k + 0.5) * cw;
            kit.dot(c, cxk, cy, r, kit.hue(355), C.surface);
            for (let q = 0; q < dots; q++) {
              const a = q * 2.4, rr = r * 0.62 * Math.sqrt((q + 0.5) / 16);
              kit.dot(c, cxk + Math.cos(a) * rr * 1.2, cy + Math.sin(a) * rr * 1.2, 1.5, C.dark ? '#fff4c2' : '#fffbe6');
            }
          }
        }
        report(clamp(iNow, 0, a1.length - 1));
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ hypoglycaemia */
  const HYPO_SCEN = {
    meal: { drive: 1, cr: 0.02, base: 0.004, name: 'insulin, then a missed meal' },
    exercise: { drive: 1.35, cr: 0.02, base: 0.004, name: 'extra exercise on insulin' },
    alcohol: { drive: 1, cr: 0.004, base: 0.0015, name: 'alcohol: the liver cannot respond' }
  };
  Hyper.sim('endo-hypo', {
    title: 'A hypo, step by step',
    blurb: `A person with diabetes whose insulin is acting while no food is coming in: glucose drifts down. The gauge marks where, in a typical adult, the body switches off its own insulin, releases glucagon and adrenaline, produces warning symptoms, and where the brain starts to run short of fuel. Press **Start**, then treat.

- Treat early with **15 g of fast sugar** and recheck after about 15 minutes: the "15–15" approach. Then add a **slower snack**, because the insulin is still acting.
- Tick **impaired awareness**: the warning symptoms now come only after confusion has begun — the person may not be able to help themselves.
- Choose **alcohol**: the liver cannot release glucose, so the fall goes deeper and recovery is slower.
- Wait until the person is too drowsy to swallow: sugar by mouth is no longer safe — a helper gives **glucagon** and calls the emergency number.

Schematic: thresholds and timing vary between people. Follow your own diabetes team's plan.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'What happened', options: [['Insulin, then a missed meal', 'meal'], ['Extra exercise on insulin', 'exercise'], ['Alcohol in the evening', 'alcohol']], value: 'meal' },
        { id: 'unaware', type: 'check', label: 'Impaired awareness of hypoglycaemia', value: false },
        { id: 'speed', label: 'Speed', min: 1, max: 10, step: 0.5, value: 3, unit: 'min/s' },
        { id: 'units', type: 'select', label: 'Glucose units', options: [['mmol/L', 'mmol'], ['mg/dL', 'mg']], value: 'mmol' },
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'sugar', label: '15 g fast sugar' }, { id: 'snack', label: 'Slower snack' }, { id: 'glucagon', label: 'Glucagon (by a helper)' }] }
      ], id => {
        if (id === 'start') reset(true);
        else if (id === 'sugar') { if (G < 2.2) note = 'too drowsy to swallow safely: nothing by mouth'; else { gut.push({ g: 15, ka: 0.12, left: 15 }); events.push([t, '15 g sugar']); note = ''; } }
        else if (id === 'snack') { if (G < 2.2) note = 'too drowsy to swallow safely: nothing by mouth'; else { gut.push({ g: 20, ka: 0.025, left: 20 }); events.push([t, 'snack']); note = ''; } }
        else if (id === 'glucagon') { glucagon = 1; events.push([t, 'glucagon']); note = ''; }
        else if (id === 'scen') reset(false);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['time', 'Time'], ['g', 'Glucose'], ['level', 'Level'], ['body', 'The body\'s response'], ['feel', 'What the person feels'], ['todo', 'What to do']]);
      let t = 0, G = 6, running = false, hist = [], gut = [], events = [], glucagon = 0, note = '';
      function reset(go) { t = 0; G = 6; hist = [[0, G]]; gut = []; events = []; glucagon = 0; note = ''; running = !!go; }
      reset(false);
      const TH = () => ({ off: 4.5, counter: 3.8, symptoms: V.unaware ? 2.4 : 3.1, brain: 2.8, severe: 2.2 });
      function step(mins) {
        const sc = HYPO_SCEN[V.scen] || HYPO_SCEN.meal, th = TH();
        const n = Math.max(1, Math.ceil(mins / 0.1)), dt = mins / n;
        for (let i = 0; i < n; i++) {
          const e = sc.drive * smooth(0, 25, t) * (1 - 0.6 * smooth(150, 260, t));
          let dG = -0.012 * e * G + sc.base * (6 - G) + (G < th.counter ? sc.cr * (th.counter - G) : 0);
          for (const q of gut) { const a = q.ka * q.left * dt; q.left -= a; dG += a * 0.15 / dt; }
          if (glucagon > 0) { dG += glucagon * (V.scen === 'alcohol' ? 0.15 : 0.35); glucagon = Math.max(0, glucagon - 0.05 * dt); }
          G = clamp(G + dG * dt, 1.2, 15);
          t += dt;
        }
        gut = gut.filter(q => q.left > 0.05);
      }
      function report() {
        const th = TH();
        ro.set('time', running || t > 0 ? Math.round(t) + ' min' : 'press Start');
        ro.set('g', gboth(G));
        ro.set('level', G < th.severe ? 'level 3 (severe): needs another person\'s help' : G < 3.0 ? 'level 2: below 3.0 mmol/L (54 mg/dL)' : G < 3.9 ? 'level 1: below 3.9 mmol/L (70 mg/dL)' : 'not low');
        ro.set('body', G < th.counter ? (V.scen === 'alcohol' ? 'glucagon and adrenaline released — but the liver, blocked by alcohol, barely responds' : 'glucagon and adrenaline released; the liver pours out glucose') : G < th.off ? 'the pancreas stops any insulin of its own — but injected insulin or a sulfonylurea keeps acting' : 'nothing special yet');
        const feel = [];
        if (G < th.symptoms) feel.push('shaky, sweaty, heart pounding, hungry');
        if (G < th.brain) feel.push('confused, blurred vision, slurred speech');
        if (G < th.severe) feel.push('very drowsy — may not respond');
        ro.set('feel', feel.length ? feel.join('; ') : G < 3.9 ? (V.unaware ? 'nothing yet — no warning (impaired awareness)' : 'perhaps nothing yet') : 'normal');
        ro.set('todo', note || (G < th.severe ? 'nothing by mouth; recovery position; call your local emergency number; glucagon if available' : G < 3.9 ? 'take about 15 g of fast sugar and recheck in 15 minutes' : gut.length || events.length ? 'recheck; a slower snack if insulin is still acting' : '—'));
      }
      function draw(dt) {
        if (running && dt > 0) { step(dt * V.speed); hist.push([t, G]); if (t > 240) running = false; hist = hist.filter(p => p[0] > t - 180); }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, th = TH(), u = V.units;
        const lab = v => u === 'mg' ? String(Math.round(v * MG)) : v.toFixed(1);
        // the gauge
        const gx = 70, gy0 = 22, gy1 = Hh - 26, gmax = 8, gw = 22;
        const YG = v => gy1 - clamp(v, 0, gmax) / gmax * (gy1 - gy0);
        rrect(c, gx - gw / 2, gy0, gw, gy1 - gy0, 10); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke();
        c.save(); rrect(c, gx - gw / 2, gy0, gw, gy1 - gy0, 10); c.clip();
        c.fillStyle = G < 3.0 ? C.bad : G < 3.9 ? C.warn : C.ok; c.fillRect(gx - gw / 2, YG(G), gw, gy1 - YG(G)); c.restore();
        kit.label(c, lab(G), gx, gy0 - 10, { size: 13, weight: 700, align: 'center' });
        const marks = [[th.off, 'own insulin off'], [th.counter, 'glucagon, adrenaline'], [th.symptoms, 'warning symptoms'], [th.brain, 'brain short of fuel'], [th.severe, 'drowsy, unresponsive']];
        let lastY = -99;
        for (const [v, name] of marks.sort((a, b) => b[0] - a[0])) {
          const y = YG(v);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(gx + gw / 2, y); c.lineTo(gx + gw / 2 + 8, y); c.stroke();
          const ly = Math.max(y, lastY + 13); lastY = ly;
          kit.label(c, W < 560 ? lab(v) : lab(v) + ' ' + name, gx + gw / 2 + 11, ly, { size: 10, color: G < v ? C.text : C.muted, weight: G < v ? 650 : 500 });
        }
        for (let v = 0; v <= gmax; v += 2) kit.label(c, lab(v), gx - gw / 2 - 5, YG(v), { size: 10, color: C.muted, align: 'right' });
        // the strip chart
        const x0 = Math.min(260, W * 0.44), x1 = W - 12, y0 = 22, y1 = Hh - 86;
        if (x1 - x0 > 80) {
          const tspan = 180, tEnd = Math.max(tspan, t);
          const X = tt => x1 - (tEnd - tt) / tspan * (x1 - x0), Y = v => y1 - clamp(v, 0, gmax) / gmax * (y1 - y0);
          c.fillStyle = kit.hue(45, 0.12); c.fillRect(x0, Y(3.9), x1 - x0, Y(3.0) - Y(3.9));
          c.fillStyle = kit.hue(0, 0.12); c.fillRect(x0, Y(3.0), x1 - x0, Y(0) - Y(3.0));
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let v = 0; v <= gmax; v += 2) { c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); kit.label(c, lab(v), x0 - 5, Y(v), { size: 10, color: C.muted, align: 'right' }); }
          for (let m = Math.ceil((tEnd - tspan) / 30) * 30; m <= tEnd; m += 30) kit.label(c, String(m), X(m), y1 + 10, { size: 10, color: C.muted, align: 'center' });
          kit.label(c, 'level 1', x1 - 4, (Y(3.9) + Y(3.0)) / 2, { size: 10, color: C.warn, align: 'right' });
          kit.label(c, 'level 2', x1 - 4, Y(1.5), { size: 10, color: C.bad, align: 'right' });
          for (const [te, name] of events) { const xe = X(te); if (xe < x0) continue; c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xe, y0); c.lineTo(xe, y1); c.stroke(); kit.label(c, name, xe + 3, y0 + 6, { size: 10, color: C.ok }); }
          c.strokeStyle = kit.hue(28); c.lineWidth = 2.4; c.beginPath();
          let pen = false;
          for (const p of hist) { const x = X(p[0]); if (x < x0) continue; pen ? c.lineTo(x, Y(p[1])) : c.moveTo(x, Y(p[1])); pen = true; }
          c.stroke();
          kit.label(c, 'glucose (' + (u === 'mg' ? 'mg/dL' : 'mmol/L') + ')' + (x1 - x0 < 380 ? ', minutes' : ' over the last 3 hours; minutes since the start'), x0, y1 + 25, { size: 10.5, color: C.muted });
          // symptom lights
          const w = ((x1 - x0) - 12) / 3, tight = w < 120;
          const sy = Hh - 24, groups = [[tight ? 'shaky, sweaty' : 'shaky, sweaty, hungry', G < th.symptoms, C.warn], [tight ? 'confused' : 'confused, slurred speech', G < th.brain, C.bad], [tight ? 'drowsy' : 'drowsy, unresponsive', G < th.severe, C.bad]];
          groups.forEach(([txt, on, col], i) => {
            const sx = x0 + i * (w + 6);
            rrect(c, sx, sy - 13, w, 26, 8); c.fillStyle = on ? col : C.surface; c.globalAlpha = on ? 0.85 : 1; c.fill(); c.globalAlpha = 1;
            c.strokeStyle = on ? col : C.border2; c.lineWidth = 1; c.stroke();
            kit.label(c, txt, sx + w / 2, sy, { size: w < 120 ? 9 : 10.5, align: 'center', color: on ? (C.dark ? '#111' : '#fff') : C.muted, weight: on ? 650 : 500 });
          });
        }
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
