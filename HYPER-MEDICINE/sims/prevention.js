/* HYPER-MEDICINE · sims/prevention.js — simulations for Prevention and Life Stages:
 * activity and risk, lung function and smoking, alcohol and blood alcohol, confounding,
 * life tables, an ageing population pyramid, pregnancy week by week, and the compression
 * of morbidity. Curves that are illustrative say so on the canvas. */
(function () {
  'use strict';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');
  const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  /* a plot frame drawn on a stage: grid, ticks, axis labels; returns the mapping */
  function frame(kit, c, C, r, xr, yr, o) {
    o = o || {};
    const X = v => r.x0 + (v - xr[0]) / (xr[1] - xr[0]) * (r.x1 - r.x0);
    const Y = v => r.y1 - (v - yr[0]) / (yr[1] - yr[0]) * (r.y1 - r.y0);
    const xs = o.xstep || Hyper.niceStep(xr[1] - xr[0], 6), ys = o.ystep || Hyper.niceStep(yr[1] - yr[0], 5);
    c.save();
    c.lineWidth = 1; c.font = '11px system-ui, sans-serif'; c.strokeStyle = C.grid; c.fillStyle = C.muted;
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let v = Math.ceil(xr[0] / xs - 1e-9) * xs; v <= xr[1] + 1e-9; v += xs) {
      const x = X(v); c.beginPath(); c.moveTo(x, r.y0); c.lineTo(x, r.y1); c.stroke();
      c.fillText(o.xfmt ? o.xfmt(v) : String(+v.toFixed(6)), x, r.y1 + 4);
    }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(yr[0] / ys - 1e-9) * ys; v <= yr[1] + 1e-9; v += ys) {
      const y = Y(v); c.beginPath(); c.moveTo(r.x0, y); c.lineTo(r.x1, y); c.stroke();
      c.fillText(o.yfmt ? o.yfmt(v) : String(+v.toFixed(6)), r.x0 - 5, y);
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(r.x0, r.y0); c.lineTo(r.x0, r.y1); c.lineTo(r.x1, r.y1); c.stroke();
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, r.x1, r.y1 + 26, { size: 11.5, color: C.text2, align: 'right', weight: 600 });
    if (o.ylabel) {
      c.save(); c.translate(12, (r.y0 + r.y1) / 2); c.rotate(-Math.PI / 2);
      kit.label(c, o.ylabel, 0, 0, { size: 11.5, color: C.text2, align: 'center', weight: 600 });
      c.restore();
    }
    return { X, Y };
  }
  function polyline(c, pts, color, width, dash) {
    c.save(); c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.restore();
  }

  /* ================================================================ 1. activity dose–response */
  Hyper.sim('prev-activity-dose', {
    title: 'Physical activity and the risk of dying early',
    blurb: `The curve shows roughly how the risk of death over the following years falls with weekly physical activity, compared with people who are inactive. It is **approximate and illustrative**, shaped like the pooled cohort studies of several hundred thousand adults — which, being observational, somewhat overstate the benefit.

- Start from **Inactive** and add 60 minutes a week: see how far the risk falls. Then compare going from 300 to 360 minutes.
- Swap moderate minutes for vigorous ones: a vigorous minute counts about double.
- Strength training on two or more days is part of the WHO guideline too; its benefits (muscle, bone, falls, blood sugar) are not in this curve.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const RR = m => 0.62 + 0.38 * Math.exp(-Math.max(0, m) / 97.5);   // m: moderate-equivalent minutes a week
      const ctl = kit.controls(box.side, [
        { id: 'mod', label: 'Moderate activity (brisk walking, cycling)', min: 0, max: 600, step: 10, value: 60, unit: 'min/week' },
        { id: 'vig', label: 'Vigorous activity (running, fast cycling)', min: 0, max: 300, step: 5, value: 0, unit: 'min/week' },
        { id: 'str', label: 'Muscle-strengthening days', min: 0, max: 7, step: 1, value: 0, unit: 'days/week' },
        { type: 'buttons', items: [{ id: 'none', label: 'Inactive' }, { id: 'who', label: 'WHO minimum', primary: true }, { id: 'lots', label: 'Very active' }] }
      ], id => {
        if (id === 'none') { ctl.set('mod', 0); ctl.set('vig', 0); ctl.set('str', 0); }
        else if (id === 'who') { ctl.set('mod', 150); ctl.set('vig', 0); ctl.set('str', 2); }
        else if (id === 'lots') { ctl.set('mod', 300); ctl.set('vig', 150); ctl.set('str', 3); }
      });
      const ro = kit.readout(box.side, [['eq', 'Moderate-equivalent minutes'], ['met', 'Activity volume'], ['who', 'WHO 2020 guideline'], ['rr', 'Risk of early death vs inactive'], ['next', '30 more minutes a week']]);
      const V = ctl.values;
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const eq = V.mod + 2 * V.vig, xmax = 900;
        const r = { x0: 62, y0: 26, x1: W - 16, y1: Hh - 46 };
        const ax = frame(kit, c, C, r, [0, xmax], [50, 105], { xstep: 150, ystep: 10, yfmt: v => v + ' %', xlabel: 'minutes of moderate activity a week (a vigorous minute counts as two)', ylabel: 'risk vs inactive' });
        // the WHO range
        c.save(); c.globalAlpha = 0.12; c.fillStyle = C.ok; c.fillRect(ax.X(150), r.y0, ax.X(300) - ax.X(150), r.y1 - r.y0); c.restore();
        kit.label(c, 'WHO: 150–300 min', ax.X(225), r.y0 - 10, { size: 11, color: C.ok, align: 'center', weight: 600 });
        // the benefit under the no-change line
        c.save(); c.beginPath(); c.moveTo(ax.X(0), ax.Y(100));
        for (let m = 0; m <= xmax; m += 5) c.lineTo(ax.X(m), ax.Y(100 * RR(m)));
        c.lineTo(ax.X(xmax), ax.Y(100)); c.closePath(); c.globalAlpha = 0.1; c.fillStyle = C.accent; c.fill(); c.restore();
        polyline(c, [[ax.X(0), ax.Y(100)], [ax.X(xmax), ax.Y(100)]], C.muted, 1.2, [5, 4]);
        kit.label(c, 'inactive = 100 %', ax.X(xmax) - 4, ax.Y(100) - 9, { size: 10.5, color: C.muted, align: 'right' });
        const curve = [];
        for (let m = 0; m <= xmax; m += 5) curve.push([ax.X(m), ax.Y(100 * RR(m))]);
        polyline(c, curve, C.accent, 2.8);
        kit.label(c, 'approximate curve, shaped like pooled cohort studies', r.x1 - 4, r.y1 - 12, { size: 10.5, color: C.muted, align: 'right' });
        // the steep start
        kit.arrow(c, ax.X(170), ax.Y(88), ax.X(45), ax.Y(88.5), C.warn, 1.6);
        kit.label(c, 'the steepest gain: from nothing to something', ax.X(178), ax.Y(88), { size: 11, color: C.warn, weight: 600 });
        // you
        const e = Math.min(eq, xmax), y = 100 * RR(eq);
        polyline(c, [[ax.X(e), r.y1], [ax.X(e), ax.Y(y)], [r.x0, ax.Y(y)]], C.faint, 1, [3, 3]);
        kit.dot(c, ax.X(e), ax.Y(y), 6, C.bad, C.bg2);
        const lab = 'you: ' + Math.round((1 - RR(eq)) * 100) + ' % lower' + (eq > xmax ? ' (off the scale)' : '');
        kit.label(c, lab, ax.X(e) + (e > xmax * 0.7 ? -10 : 10), ax.Y(y) - 14, { size: 12, weight: 650, align: e > xmax * 0.7 ? 'right' : 'left', bg: C.surface });
        // read-outs
        ro.set('eq', eq + ' min a week');
        ro.set('met', fx(eq * 4 / 60, 1) + ' MET-hours a week');
        const aer = eq >= 300 ? 'aerobic: upper range met' : eq >= 150 ? 'aerobic: met' : 'aerobic: ' + (150 - eq) + ' min short';
        ro.set('who', aer + (V.str >= 2 ? '; strength: met' : '; strength: ' + (2 - V.str) + ' more day' + (V.str === 1 ? '' : 's')));
        ro.set('rr', eq ? 'about ' + Math.round((1 - RR(eq)) * 100) + ' % lower' : 'the reference (inactive)');
        ro.set('next', 'about ' + fx((RR(eq) - RR(eq + 30)) * 100, 1) + ' points lower still');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. lung function (Fletcher–Peto, schematic) */
  Hyper.sim('prev-lung-function', {
    title: 'Lung function over a lifetime: smoking and stopping',
    blurb: `A **schematic** of the classic picture drawn by Charles Fletcher and Richard Peto (1977): lung function — the FEV₁, the air blown out in the first second — as a share of its value at 25. Everyone loses some with age; in smokers whose lungs are susceptible it falls several times faster. Stopping does not bring lost function back, but from then on it falls only at a never-smoker's pace.

- Press **Play a lifetime** and watch the three people age together.
- Move **The smoker stops at age** from 70 down to 35: each decade earlier adds years before breathlessness becomes disabling.
- Lower the susceptibility: many smokers lose lung function only a little faster than non-smokers — yet still carry the risks of cancer, heart attack and stroke.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      let age = 25, playing = false;
      const ctl = kit.controls(box.side, [
        { id: 'stop', label: 'The smoker stops at age', min: 30, max: 80, step: 1, value: 45, unit: 'yr' },
        { id: 'sus', label: 'Susceptibility (decline × a never-smoker\'s)', min: 1.5, max: 6, step: 0.1, value: 4, unit: '×' },
        { id: 'classic', type: 'check', label: 'Also show stopping at 45 and at 65', value: true },
        { type: 'buttons', items: [{ id: 'play', label: 'Play a lifetime', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], id => {
        if (id === 'play') { if (age >= 89.9) age = 25; playing = true; }
        else if (id === 'pause') playing = false;
      });
      const ro = kit.readout(box.side, [['age', 'Age'], ['never', 'Never-smoker'], ['smoker', 'Smoker who never stops'], ['stopped', 'Smoker who stops'], ['dis', 'Disabling breathlessness from'], ['gain', 'Years gained by stopping']]);
      const V = ctl.values;
      const K = 25 / Math.pow(50, 1.5), DIS = 30, DEATH = 12;
      const g = a => K * Math.pow(Math.max(0, a - 25), 1.5);
      const never = a => 100 - g(a);
      const smoker = a => 100 - V.sus * g(a);
      const stopped = (a, s) => (a <= s ? smoker(a) : smoker(s) - (g(a) - g(s)));
      const cross = f => { for (let a = 25; a <= 100; a += 0.1) if (f(a) <= DIS) return a; return null; };
      function draw(dt) {
        if (playing) { age += (dt || 0) * 7; if (age >= 90) { age = 90; playing = false; } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = { x0: 62, y0: 18, x1: W - 16, y1: Hh - 46 };
        const ax = frame(kit, c, C, r, [25, 90], [0, 105], { xstep: 10, ystep: 20, yfmt: v => v + ' %', xlabel: 'age (years)', ylabel: 'FEV₁, % of value at 25' });
        c.save(); c.globalAlpha = 0.1; c.fillStyle = C.warn; c.fillRect(r.x0, ax.Y(DIS), r.x1 - r.x0, ax.Y(DEATH) - ax.Y(DIS));
        c.fillStyle = C.bad; c.fillRect(r.x0, ax.Y(DEATH), r.x1 - r.x0, ax.Y(0) - ax.Y(DEATH)); c.restore();
        kit.label(c, 'disabling breathlessness', r.x0 + 6, ax.Y(DIS) + 9, { size: 10.5, color: C.warn, weight: 600 });
        kit.label(c, 'life-threatening', r.x0 + 6, ax.Y(DEATH) + 9, { size: 10.5, color: C.bad, weight: 600 });
        const path = f => { const p = []; for (let a = 25; a <= 90.001; a += 0.5) p.push([ax.X(a), ax.Y(clamp(f(a), 0, 100))]); return p; };
        if (V.classic) {
          for (const s of [45, 65]) if (Math.abs(s - V.stop) > 0.5) {
            polyline(c, path(a => stopped(a, s)), C.muted, 1.4, [5, 4]);
            kit.label(c, 'stops at ' + s, ax.X(90) - 4, ax.Y(clamp(stopped(90, s), 2, 100)) - 8, { size: 10.5, color: C.muted, align: 'right' });
          }
        }
        polyline(c, path(never), C.ok, 2.6);
        polyline(c, path(smoker), C.bad, 2.6);
        polyline(c, path(a => stopped(a, V.stop)), kit.hue(215), 2.8);
        kit.label(c, 'never smoked', ax.X(90) - 4, ax.Y(never(90)) - 9, { size: 11.5, color: C.ok, align: 'right', weight: 650 });
        const sx = cross(smoker);
        kit.label(c, 'smokes throughout', ax.X(sx ? clamp(sx - 1, 30, 84) : 84), ax.Y(clamp(smoker(sx ? sx - 1 : 84), 4, 100)) - 10, { size: 11.5, color: C.bad, align: 'right', weight: 650 });
        kit.dot(c, ax.X(V.stop), ax.Y(clamp(smoker(V.stop), 0, 100)), 4.5, kit.hue(215), C.bg2);
        kit.label(c, 'stops at ' + V.stop, ax.X(V.stop) + 8, ax.Y(clamp(smoker(V.stop), 0, 100)) - 12, { size: 11.5, color: kit.hue(215), weight: 650 });
        kit.label(c, 'schematic, after Fletcher and Peto (1977)', r.x1 - 4, r.y0 + 8, { size: 10.5, color: C.muted, align: 'right' });
        // the cursor
        polyline(c, [[ax.X(age), r.y0], [ax.X(age), r.y1]], C.faint, 1, [3, 3]);
        for (const [f, col] of [[never, C.ok], [smoker, C.bad], [a => stopped(a, V.stop), kit.hue(215)]]) kit.dot(c, ax.X(age), ax.Y(clamp(f(age), 0, 100)), 5, col, C.bg2);
        const pc = v => Math.round(clamp(v, 0, 100)) + ' %';
        ro.set('age', Math.round(age) + ' years' + (playing ? ' (playing)' : ''));
        ro.set('never', pc(never(age)));
        ro.set('smoker', pc(smoker(age)));
        ro.set('stopped', pc(stopped(age, V.stop)));
        const s2 = cross(a => stopped(a, V.stop));
        ro.set('dis', (sx ? 'age ' + Math.round(sx) : 'after 100') + ' if never stopping; ' + (s2 ? 'age ' + Math.round(s2) : 'not before 100') + ' if stopping at ' + V.stop);
        ro.set('gain', !sx ? '— (no disability before 100)' : !s2 ? 'more than ' + Math.round(100 - sx) + ' years' : s2 - sx < 0.5 ? 'none — stopped too late for the lungs' : 'about ' + Math.round(s2 - sx) + ' years');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. alcohol: standard drinks and blood alcohol */
  const DRINKS = [
    ['Beer 5 %, 330 mL bottle', 330, 0.05, 'beer'],
    ['Beer 5 %, pint (568 mL)', 568, 0.05, 'beer'],
    ['Strong beer 8 %, 440 mL can', 440, 0.08, 'beer'],
    ['Cider 4.5 %, 500 mL', 500, 0.045, 'beer'],
    ['Wine 13 %, small glass (125 mL)', 125, 0.13, 'wine'],
    ['Wine 13 %, standard glass (175 mL)', 175, 0.13, 'wine'],
    ['Wine 13 %, large glass (250 mL)', 250, 0.13, 'wine'],
    ['Spirit 40 %, single (25 mL)', 25, 0.40, 'shot'],
    ['Spirit 40 %, large shot (40 mL)', 40, 0.40, 'shot'],
    ['Alcohol-free beer 0.5 %, 330 mL', 330, 0.005, 'beer']
  ];
  const grams = d => d[1] * d[2] * 0.789;
  Hyper.sim('prev-alcohol', {
    title: 'Standard drinks and blood alcohol',
    blurb: `Choose a drink, how many and over how long, and see the grams of alcohol, the standard drinks in three countries' units, and an estimate of the blood alcohol over the following hours (Widmark's model, with absorption from the stomach and a steady removal by the liver).

**Educational only.** People differ widely, and no calculation can say whether someone is fit to drive — impairment begins well below every legal limit, and the only safe amount before driving is none.

- Compare a pint of beer, a large glass of wine and a single spirit: which holds the most alcohol?
- Change the body mass and the body-water setting: the same drinks give very different levels.
- Tick **Drinking with a meal**: the peak is lower and later — but the alcohol still has to be removed, at about the same slow rate.
- Note how long it takes to get back to zero after an evening's drinking: often into the next morning.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { height: 128, minH: 118, maxH: 150 });
      const ctl = kit.controls(box.side, [
        { id: 'drink', type: 'select', label: 'Drink', options: DRINKS.map((d, i) => [d[0], i]), value: 5 },
        { id: 'n', label: 'Number of drinks', min: 0, max: 10, step: 1, value: 2 },
        { id: 'hours', label: 'Spread over', min: 0.5, max: 6, step: 0.5, value: 2, unit: 'h' },
        { id: 'mass', label: 'Body mass', min: 40, max: 130, step: 1, value: 70, unit: 'kg' },
        { id: 'r', type: 'select', label: 'Body water (Widmark factor)', options: [['Typical man, r ≈ 0.68', 0.68], ['Typical woman, r ≈ 0.55', 0.55]], value: 0.68 },
        { id: 'beta', label: 'Removal rate (varies between people)', min: 0.1, max: 0.25, step: 0.01, value: 0.15, unit: '‰/h' },
        { id: 'food', type: 'check', label: 'Drinking with a meal', value: false }
      ], () => update());
      const ro = kit.readout(box.side, [['g', 'One drink contains'], ['tot', 'Total alcohol'], ['std', 'Standard drinks'], ['peak', 'Estimated peak'], ['zero', 'Back to zero'], ['note', 'Remember']]);
      const plot = kit.plot(box.stage, { x: { label: 'hours after the first drink', name: 'time', min: 0, max: 12 }, y: { label: 'blood alcohol (‰ ≈ g/L)', min: 0, max: 1 } }, 240);
      const tab = kit.table(box.stage, [
        { label: 'Drink', key: 'name', align: 'left' },
        { label: 'Alcohol (g)', key: 'g', fmt: v => fx(v, 1) },
        { label: 'UK units (8 g)', key: 'uk', fmt: v => fx(v, 1) },
        { label: '10-g drinks', key: 'au', fmt: v => fx(v, 1) },
        { label: 'US drinks (14 g)', key: 'us', fmt: v => fx(v, 1) }
      ], { maxHeight: 300 });
      const V = ctl.values;
      let res = null;
      function simulate() {
        const d = DRINKS[V.drink] || DRINKS[0];
        const g1 = grams(d), n = Math.max(0, Math.round(V.n)), T = V.hours;
        const Vd = Math.max(1, V.r * V.mass), vmax = V.beta * Vd, km = 0.05 * Vd;
        const ka = V.food ? 1.2 : 4.5, F = V.food ? 0.85 : 1;       // absorption per hour; share reaching the blood
        const times = []; for (let i = 0; i < n; i++) times.push(i * T / Math.max(1, n));
        let G = 0, B = 0, next = 0, peak = 0, tpeak = 0, tzero = null;
        const dt = 1 / 120, pts = [[0, 0]];
        for (let k = 1; k <= 24 * 120; k++) {
          const t = k * dt;
          while (next < n && times[next] <= t) { G += g1; next++; }
          const abs = ka * G * dt; G -= abs; B += F * abs;
          B -= Math.min(B, vmax * B / (km + B) * dt);
          const conc = B / Vd;
          if (conc > peak) { peak = conc; tpeak = t; }
          if (k % 6 === 0) pts.push([t, conc]);
          if (tzero == null && next >= n && G < 0.05 && conc < 0.01 && t > tpeak) tzero = t;
        }
        return { d, g1, n, tot: g1 * n, peak, tpeak, tzero, pts };
      }
      function update() {
        res = simulate();
        const xmax = Math.min(24, Math.max(8, Math.ceil((res.tzero || 24) + 1)));
        const ymax = Math.max(1, Math.ceil(res.peak * 12) / 10);
        plot.set({
          x: { label: 'hours after the first drink', name: 'time', min: 0, max: xmax },
          y: { label: 'blood alcohol (‰ ≈ g/L)', min: 0, max: ymax },
          series: [{ pts: res.pts.filter(p => p[0] <= xmax), label: 'estimated blood alcohol (educational)', fill: true, color: kit.hue(350) }],
          hlines: [{ y: 0.5, label: '0.5 ‰ — driving limit in many countries' }, { y: 0.8, label: '0.8 ‰ — limit in some others' }],
          marks: res.n && res.d[2] > 0.01 ? [{ x: res.tpeak, y: res.peak, label: 'peak ' + fx(res.peak, 2) + ' ‰' }] : [],
          fmtX: v => fx(v, 1) + ' h', fmtY: v => fx(v, 2) + ' ‰', legend: true
        });
        tab.set(DRINKS.map((d, i) => ({ name: d[0], g: grams(d), uk: grams(d) / 8, au: grams(d) / 10, us: grams(d) / 14, _cls: i === V.drink ? 'hl' : '' })));
        ro.set('g', fx(res.g1, 1) + ' g of alcohol (' + fx(res.g1 / 8, 1) + ' UK units)');
        ro.set('tot', fx(res.tot, 0) + ' g in ' + res.n + ' drink' + (res.n === 1 ? '' : 's'));
        ro.set('std', fx(res.tot / 8, 1) + ' UK · ' + fx(res.tot / 10, 1) + ' × 10 g · ' + fx(res.tot / 14, 1) + ' US');
        ro.set('peak', res.peak < 0.005 ? 'about zero' : fx(res.peak, 2) + ' ‰ (≈ ' + fx(res.peak * 0.1, 3) + ' % BAC) after ' + fx(res.tpeak, 1) + ' h');
        ro.set('zero', res.peak < 0.005 ? '—' : res.tzero ? 'about ' + fx(res.tzero, 1) + ' h after the first drink' : 'more than 24 h');
        ro.set('note', 'an estimate for learning — never a guide to driving');
      }
      function drawGlasses() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const d = res ? res.d : DRINKS[5], n = res ? res.n : 0;
        const base = Hh - 30, scale = 3.1;
        const h = 14 + Math.sqrt(d[1]) * scale, w = d[3] === 'shot' ? 26 : d[3] === 'wine' ? 40 : 30 + Math.sqrt(d[1]) * 0.5;
        const liquid = d[3] === 'wine' ? kit.hue(350, 0.75) : d[3] === 'shot' ? kit.hue(35, 0.45) : d[2] < 0.01 ? kit.hue(55, 0.35) : kit.hue(42, 0.75);
        const gap = Math.min(w + 22, (W - 40) / Math.max(1, n));
        const x0 = 20 + Math.max(0, (W - 40 - gap * n) / 2);
        if (!n) kit.label(c, 'no drinks', W / 2, Hh / 2, { size: 13, color: C.muted, align: 'center' });
        for (let i = 0; i < n; i++) {
          const cx = x0 + gap * (i + 0.5);
          c.save(); c.lineWidth = 1.6; c.strokeStyle = C.text2; c.fillStyle = liquid;
          if (d[3] === 'wine') {
            const bh = h * 0.55, top = base - h;
            c.beginPath(); c.moveTo(cx - w / 2, top); c.quadraticCurveTo(cx - w / 2, top + bh, cx, top + bh); c.quadraticCurveTo(cx + w / 2, top + bh, cx + w / 2, top); c.stroke();
            c.beginPath(); c.moveTo(cx - w / 2 + 3, top + bh * 0.35); c.quadraticCurveTo(cx - w / 2 + 3, top + bh - 2, cx, top + bh - 2); c.quadraticCurveTo(cx + w / 2 - 3, top + bh - 2, cx + w / 2 - 3, top + bh * 0.35); c.closePath(); c.fill();
            c.beginPath(); c.moveTo(cx, top + bh); c.lineTo(cx, base); c.moveTo(cx - w * 0.32, base); c.lineTo(cx + w * 0.32, base); c.stroke();
          } else {
            const top = base - h, tw = w, bw = d[3] === 'shot' ? w * 0.85 : w * 0.78;
            c.beginPath(); c.moveTo(cx - tw / 2 + 2, top + h * 0.12); c.lineTo(cx + tw / 2 - 2, top + h * 0.12); c.lineTo(cx + bw / 2 - 1, base - 1); c.lineTo(cx - bw / 2 + 1, base - 1); c.closePath(); c.fill();
            c.beginPath(); c.moveTo(cx - tw / 2, top); c.lineTo(cx - bw / 2, base); c.lineTo(cx + bw / 2, base); c.lineTo(cx + tw / 2, top); c.stroke();
          }
          c.restore();
        }
        kit.label(c, n ? n + ' × ' + d[0] + ' = ' + fx(grams(d) * n, 0) + ' g of alcohol' : '', W / 2, Hh - 12, { size: 12, color: C.text2, align: 'center', weight: 600 });
      }
      update();
      const loop = kit.loop(() => drawGlasses(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
      const onTheme = () => update();                     // series colours follow the theme
      document.addEventListener('hyper:theme', onTheme);
      return () => document.removeEventListener('hyper:theme', onTheme);
    }
  });

  /* ================================================================ 4. confounding */
  Hyper.sim('prev-confounding', {
    title: 'Coffee, smoking and a false alarm: confounding',
    blurb: `Two thousand people are followed for twenty years: 1,000 who drink a lot of coffee and 1,000 who do not. Each square is a person; red squares developed lung disease. In this made-up population coffee itself does nothing (unless you change **True effect of coffee**) — but coffee drinkers smoke more often.

- In **All together**, coffee drinkers clearly get ill more often: the crude relative risk is about 2.
- Switch to **Split by smoking**: within smokers, and within non-smokers, coffee makes no difference. Smoking was the confounder.
- Make smoking equally common in both groups: the false association vanishes even in the crude view.
- Tick **Random sample** and press **New sample** a few times: chance alone moves the numbers, most in the small groups.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 300 });
      let seed = 1;
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['All together (crude)', 'crude'], ['Split by smoking', 'split']], value: 'crude' },
        { id: 'p1', label: 'Smokers among coffee drinkers', min: 0, max: 90, step: 1, value: 50, unit: '%' },
        { id: 'p0', label: 'Smokers among non-coffee drinkers', min: 0, max: 90, step: 1, value: 20, unit: '%' },
        { id: 'rrs', label: 'Smoking multiplies the risk by', min: 1, max: 20, step: 0.5, value: 10, unit: '×' },
        { id: 'rrc', label: 'True effect of coffee', min: 0.5, max: 3, step: 0.1, value: 1, unit: '×' },
        { id: 'random', type: 'check', label: 'Random sample (chance)', value: false },
        { type: 'buttons', items: [{ id: 'sample', label: 'New sample' }] }
      ], id => { if (id === 'sample') seed++; update(); });
      const ro = kit.readout(box.side, [['r1', 'Risk, coffee drinkers'], ['r0', 'Risk, non-coffee drinkers'], ['crude', 'Crude relative risk'], ['rs', 'Among smokers'], ['rn', 'Among non-smokers'], ['mh', 'Adjusted for smoking']]);
      const V = ctl.values, N = 1000, BASE = 0.02;
      let K = null;
      function binom(R, n, p) { let k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; return k; }
      function update() {
        const s1 = Math.round(N * V.p1 / 100), s0 = Math.round(N * V.p0 / 100), n1 = N - s1, n0 = N - s0;
        const rs = Math.min(1, BASE * V.rrs), rn = BASE, rc = V.rrc;
        const risk = { s1: Math.min(1, rs * rc), n1: Math.min(1, rn * rc), s0: rs, n0: rn };
        let cs1, cn1, cs0, cn0;
        if (V.random) { const R = kit.fin.uniforms(seed); cs1 = binom(R, s1, risk.s1); cn1 = binom(R, n1, risk.n1); cs0 = binom(R, s0, risk.s0); cn0 = binom(R, n0, risk.n0); }
        else { cs1 = Math.round(s1 * risk.s1); cn1 = Math.round(n1 * risk.n1); cs0 = Math.round(s0 * risk.s0); cn0 = Math.round(n0 * risk.n0); }
        // the order in which the squares are drawn: sorted by smoking, or shuffled (the crude view)
        const R2 = kit.fin.uniforms(97);
        const col = (s, n, cs, cn) => {
          const a = []; for (let i = 0; i < s; i++) a.push(i < cs ? 3 : 2); for (let i = 0; i < n; i++) a.push(i < cn ? 1 : 0);
          const sh = a.slice(); for (let i = sh.length - 1; i > 0; i--) { const j = Math.floor(R2() * (i + 1)); const t = sh[i]; sh[i] = sh[j]; sh[j] = t; }
          return { sorted: a, shuffled: sh };
        };
        K = { s1, s0, n1, n0, cs1, cn1, cs0, cn0, c1: col(s1, n1, cs1, cn1), c0: col(s0, n0, cs0, cn0) };
        const pr = (a, b) => (b > 0 ? fx(100 * a / b, 1) + ' %' : '—');
        const ratio = (a, b, c, d) => (b > 0 && d > 0 && c > 0 ? fx((a / b) / (c / d), 2) : '—');
        ro.set('r1', pr(cs1 + cn1, N) + '  (' + (cs1 + cn1) + ' of 1,000)');
        ro.set('r0', pr(cs0 + cn0, N) + '  (' + (cs0 + cn0) + ' of 1,000)');
        ro.set('crude', ratio(cs1 + cn1, N, cs0 + cn0, N));
        ro.set('rs', ratio(cs1, s1, cs0, s0) + (s1 && s0 ? '  (' + pr(cs1, s1) + ' vs ' + pr(cs0, s0) + ')' : ''));
        ro.set('rn', ratio(cn1, n1, cn0, n0) + (n1 && n0 ? '  (' + pr(cn1, n1) + ' vs ' + pr(cn0, n0) + ')' : ''));
        const ts = s1 + s0, tn = n1 + n0;
        const num = (ts ? cs1 * s0 / ts : 0) + (tn ? cn1 * n0 / tn : 0), den = (ts ? cs0 * s1 / ts : 0) + (tn ? cn0 * n1 / tn : 0);
        ro.set('mh', den > 0 ? fx(num / den, 2) + ' (Mantel–Haenszel)' : '—');
      }
      function draw() {
        if (!K) return;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const split = V.view === 'split';
        const pad = 16, colW = (W - pad * 3) / 2, top = 44, gridH = Hh - top - 58;
        const q = Math.max(2, Math.min(colW / 40, gridH / 25));
        const cols = [[K.c1, 'Drink a lot of coffee', K.s1, K.cs1 + K.cn1], [K.c0, 'Little or no coffee', K.s0, K.cs0 + K.cn0]];
        const fill = [C.dark ? 'rgba(255,255,255,0.13)' : 'rgba(0,0,0,0.10)', C.bad, C.dark ? 'rgba(255,255,255,0.42)' : 'rgba(0,0,0,0.42)', C.bad];
        cols.forEach(([arr, title, s, cases], k) => {
          const x0 = pad + k * (colW + pad) + (colW - q * 40) / 2;
          kit.label(c, title, x0 + q * 20, 14, { size: 13, weight: 650, align: 'center' });
          kit.label(c, 'ill: ' + cases + ' of 1,000 (' + fx(cases / 10, 1) + ' %)', x0 + q * 20, 31, { size: 11.5, color: C.bad, align: 'center', weight: 600 });
          const list = split ? arr.sorted : arr.shuffled;
          for (let i = 0; i < list.length; i++) {
            const t = list[i], rr = Math.floor(i / 40), cc = i % 40;
            c.fillStyle = split ? fill[t] : (t % 2 ? C.bad : fill[0]);
            c.fillRect(x0 + cc * q + 0.5, top + rr * q + 0.5, q - 1, q - 1);
          }
          if (split) {
            const yb = top + Math.ceil(s / 40) * q;
            if (s > 0 && s < 1000) polyline(c, [[x0 - 4, yb], [x0 + q * 40 + 4, yb]], C.accent, 1.6);
            if (s > 0) kit.label(c, 'smokers ' + s, x0 + q * 40 + 2, top + 8, { size: 10.5, color: C.text2, align: 'right', bg: C.surface });
            if (s < 1000) kit.label(c, 'non-smokers ' + (1000 - s), x0 + q * 40 + 2, Math.min(top + 25 * q - 8, yb + 10), { size: 10.5, color: C.text2, align: 'right', bg: C.surface });
          }
        });
        const ly = Hh - 30;
        c.fillStyle = C.bad; c.fillRect(pad, ly - 5, 10, 10);
        kit.label(c, 'developed the disease', pad + 16, ly, { size: 11.5, color: C.text2 });
        if (split) {
          c.fillStyle = fill[2]; c.fillRect(pad + 170, ly - 5, 10, 10); kit.label(c, 'smoker', pad + 186, ly, { size: 11.5, color: C.text2 });
          c.fillStyle = fill[0]; c.fillRect(pad + 250, ly - 5, 10, 10); kit.label(c, 'non-smoker', pad + 266, ly, { size: 11.5, color: C.text2 });
        } else kit.label(c, 'smoking hidden — choose "Split by smoking"', pad + 170, ly, { size: 11.5, color: C.muted });
        kit.label(c, 'a made-up population', W - pad, ly, { size: 10.5, color: C.muted, align: 'right' });
      }
      update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. life tables */
  // Siler mortality: infant/child + background + ageing (Gompertz); tuned to approximate life expectancies
  const ERAS = [
    ['About 1800, before modern medicine', { a1: 0.40, b1: 0.9, a2: 0.0085, a3: 0.00020, b3: 0.083 }],
    ['About 1900, an industrialising country', { a1: 0.21, b1: 1.0, a2: 0.0042, a3: 0.00009, b3: 0.092 }],
    ['About 1950, a high-income country', { a1: 0.035, b1: 1.5, a2: 0.0012, a3: 0.00006, b3: 0.093 }],
    ['The world average in the 2020s', { a1: 0.035, b1: 1.2, a2: 0.0010, a3: 0.000045, b3: 0.090 }],
    ['A high-income country in the 2020s', { a1: 0.004, b1: 1.5, a2: 0.0002, a3: 0.000009, b3: 0.106 }]
  ];
  function lifeTable(p, child, shift) {
    const mu = x => child * p.a1 * Math.exp(-p.b1 * x) + p.a2 + p.a3 * Math.exp(p.b3 * (x - shift));
    const dx = 0.1, n = 1300, l = new Float64Array(n + 1);
    l[0] = 1;
    for (let i = 0; i < n; i++) l[i + 1] = l[i] * Math.exp(-mu((i + 0.5) * dx) * dx);
    const T = new Float64Array(n + 1);             // years lived beyond each point
    for (let i = n - 1; i >= 0; i--) T[i] = T[i + 1] + (l[i] + l[i + 1]) / 2 * dx;
    const at = x => l[Math.round(clamp(x, 0, 130) / dx)];
    const ex = x => { const i = Math.round(clamp(x, 0, 129) / dx); return l[i] > 1e-12 ? T[i] / l[i] : 0; };
    let mode = 0, dmax = 0, median = null;
    for (let i = 100; i < n; i++) { const d = (l[i] - l[i + 1]) / dx; if (d > dmax) { dmax = d; mode = i * dx; } }
    for (let i = 0; i < n; i++) if (l[i + 1] < 0.5) { median = i * dx; break; }
    return { mu, at, ex, e0: T[0], mode, median };
  }
  Hyper.sim('prev-life-table', {
    title: 'Life tables: survival through the ages',
    blurb: `Each curve follows 100,000 babies through life at the death rates of an era, from a mortality model (child deaths + background deaths + ageing) **tuned to approximate the life expectancies of each period** — illustrative, not real national tables.

- Compare **about 1800** with **a high-income country today**: most of the difference is in childhood. Look at *life expectancy at 65* too — it has risen far less.
- Turn **Child deaths** down to 0.1× in the 1800 setting: life expectancy at birth leaps, while the lives of adults barely change.
- **Ageing delayed** shifts the adult death rates: this is where today's gains come from — the curve becomes more rectangular.
- Watch the **100 babies**: in the 1800 setting about four in ten die before 5, yet a good share of the rest reach 65 or more. Switch the graph to **Ages at death** to see why an average of 32 years hid many deaths in old age.
- The table below is a short life table: for each age, how many of 100,000 are still alive, their risk of dying within the year, and the years they have left on average.`,
    mount(box, kit) {
      const ctl = kit.controls(box.side, [
        { id: 'era', type: 'select', label: 'Death rates of', options: ERAS.map((e, i) => [e[0], i]), value: 1 },
        { id: 'child', label: 'Child deaths (× the era\'s level)', min: 0.1, max: 3, value: 1, log: true, sig: 2, unit: '×' },
        { id: 'shift', label: 'Ageing delayed by', min: -10, max: 10, step: 0.5, value: 0, unit: 'yr' },
        { id: 'view', type: 'select', label: 'Show', options: [['Survival curves', 'surv'], ['Ages at death', 'dist']], value: 'surv' },
        { id: 'all', type: 'check', label: 'Compare all eras', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['e0', 'Life expectancy at birth'], ['e65', 'Life expectancy at 65'], ['l5', 'Survive to age 5'], ['l65', 'Survive to 65'], ['mode', 'Commonest adult age at death'], ['med', 'Half have died by']]);
      const st = kit.stage(box.stage, { height: 150, minH: 140, maxH: 170 });
      const plot = kit.plot(box.stage, { x: { label: 'age (years)', name: 'age', min: 0, max: 110 }, y: { label: 'still alive (%)', min: 0, max: 100 } }, 300);
      let cur = null;
      // 100 babies, coloured by the age at which they die (largest-remainder rounding to 100)
      function drawBabies() {
        if (!cur) return;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const cuts = [0, 5, 45, 65, 85, 130], names = ['before 5', '5–44', '45–64', '65–84', '85 or older'];
        const cols = [C.bad, C.warn, kit.hue(48), kit.hue(190), C.ok];
        const raw = names.map((_, i) => 100 * (cur.at(cuts[i]) - cur.at(cuts[i + 1])));
        const n = raw.map(Math.floor); let left = 100 - n.reduce((a, b) => a + b, 0);
        raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { n[i]++; left--; } });
        const legendW = Math.min(170, W * 0.3), gw = W - legendW - 30, per = 20, q = Math.min(gw / per, (Hh - 36) / 5);
        kit.label(c, 'Of 100 babies born at these death rates, the age at death:', 14, 12, { size: 12, weight: 650 });
        let k = 0;
        n.forEach((cnt, i) => { for (let j = 0; j < cnt && k < 100; j++, k++) kit.dot(c, 14 + (k % per + 0.5) * q, 28 + (Math.floor(k / per) + 0.5) * q, Math.max(1.5, q * 0.36), cols[i]); });
        names.forEach((nm, i) => {
          const y = 34 + i * 20, x = W - legendW;
          kit.dot(c, x, y, 5, cols[i]);
          kit.label(c, nm + ': ' + n[i], x + 10, y, { size: 11.5, color: C.text2 });
        });
      }
      const tab = kit.table(box.stage, [
        { label: 'Age', key: 'age', align: 'left' },
        { label: 'Alive, of 100,000', key: 'l', fmt: v => Math.round(v).toLocaleString('en-GB') },
        { label: 'Risk of dying within the year', key: 'q', fmt: v => (v < 0.001 ? fx(v * 1000, 2) + ' ‰' : fx(v * 100, 2) + ' %') },
        { label: 'Years left (life expectancy)', key: 'e', fmt: v => fx(v, 1) }
      ], { maxHeight: 320 });
      const V = ctl.values;
      function update() {
        const era = ERAS[V.era] || ERAS[0];
        const L = lifeTable(era[1], V.child, V.shift);
        cur = L;
        const series = [];
        const pal = [kit.hue(28), kit.hue(140), kit.hue(265), kit.hue(190), kit.hue(215)];
        if (V.view === 'surv') {
          if (V.all) ERAS.forEach((e, i) => {
            if (i === V.era && V.child === 1 && V.shift === 0) return;
            const Li = lifeTable(e[1], 1, 0), pts = [];
            for (let x = 0; x <= 110; x += 1) pts.push([x, 100 * Li.at(x)]);
            series.push({ pts, label: e[0].replace(/,.*$/, '') + ' (' + Math.round(Li.e0) + ' yr)', dash: [5, 4], width: 1.5, color: pal[i] });
          });
          const pts = []; for (let x = 0; x <= 110; x += 0.5) pts.push([x, 100 * L.at(x)]);
          series.push({ pts, label: 'selected: life expectancy ' + fx(L.e0, 1) + ' yr', width: 3, color: C0(), fill: true });
          plot.set({ y: { label: 'still alive (%)', min: 0, max: 100 }, series, marks: [], hlines: [{ y: 50, label: 'half still alive' }], vlines: [{ x: 65, label: '65' }], fmtY: v => fx(v, 1) + ' %', fmtX: v => fx(v, 0) + ' yr', legend: true });
        } else {
          const pts = [];
          for (let x = 0; x <= 110; x += 1) pts.push([x + 0.5, 100 * (L.at(x) - L.at(x + 1))]);
          const inf = 100 * (1 - L.at(1));
          series.push({ pts, label: 'deaths at each age (% of all births)', width: 2.4, color: C0(), fill: true });
          plot.set({ y: { label: 'deaths at each age (% of births)', min: 0, max: 5 }, series, hlines: [], vlines: [{ x: L.e0, label: 'life expectancy ' + fx(L.e0, 0) }],
            marks: inf > 5 ? [{ x: 2, y: 4.8, label: 'first year: ' + fx(inf, 0) + ' % (off the scale)' }] : [], fmtY: v => fx(v, 2) + ' %', fmtX: v => fx(v, 0) + ' yr', legend: true });
        }
        ro.set('e0', fx(L.e0, 1) + ' years');
        ro.set('e65', L.at(65) > 1e-6 ? fx(L.ex(65), 1) + ' more years (to about ' + Math.round(65 + L.ex(65)) + ')' : '—');
        ro.set('l5', fx(100 * L.at(5), 1) + ' %');
        ro.set('l65', fx(100 * L.at(65), 1) + ' %');
        ro.set('mode', fx(L.mode, 0) + ' years');
        ro.set('med', L.median != null ? 'age ' + fx(L.median, 0) : '—');
        tab.set([0, 1, 5, 15, 30, 45, 65, 80, 90, 100].map(a => ({ age: a, l: 100000 * L.at(a), q: L.at(a) > 0 ? 1 - L.at(a + 1) / L.at(a) : 1, e: L.ex(a) })));
      }
      const C0 = () => kit.colors().bad;
      update();
      const loop = kit.loop(() => drawBabies(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
      const onTheme = () => update();                     // series colours follow the theme
      document.addEventListener('hyper:theme', onTheme);
      return () => document.removeEventListener('hyper:theme', onTheme);
    }
  });

  /* ================================================================ 6. an ageing population pyramid */
  const PA = { a1: 0.21, b1: 1.0, a2: 0.0042, a3: 0.00009, b3: 0.092 };   // life expectancy about 49
  const PB = { a1: 0.004, b1: 1.5, a2: 0.0002, a3: 0.000009, b3: 0.106 }; // life expectancy about 82
  function sil(s) { const o = {}; for (const k in PA) o[k] = k[0] === 'b' ? PA[k] + (PB[k] - PA[k]) * s : Math.exp(Math.log(PA[k]) + (Math.log(PB[k]) - Math.log(PA[k])) * s); return o; }
  const S_GRID = [];
  function sForLE(le) {
    if (!S_GRID.length) for (let s = -0.2; s <= 1.8001; s += 0.02) S_GRID.push([s, lifeTable(sil(s), 1, 0).e0]);
    if (le <= S_GRID[0][1]) return S_GRID[0][0];
    for (let i = 1; i < S_GRID.length; i++) if (le <= S_GRID[i][1]) { const [s0, e0] = S_GRID[i - 1], [s1, e1] = S_GRID[i]; return s0 + (s1 - s0) * (le - e0) / (e1 - e0); }
    return S_GRID[S_GRID.length - 1][0];
  }
  Hyper.sim('prev-pyramid', {
    title: 'An ageing population',
    blurb: `A model country (**illustrative**, not a real one) starts in 1950 with six children per woman and a life expectancy of about 47. Over the following decades fertility falls and life expectancy rises — the demographic transition every region of the world is going through at its own pace. The pyramid shows each five-year age group as a share of the population (men left, women right).

- Press **Play** and watch the wide base of children narrow and the top fill out, until the pyramid becomes a column.
- Set the final fertility to 2.1 (replacement) and to 1.2 (as in parts of East Asia and southern Europe): compare the share aged 65 and over in 2100.
- Choose a **fast** fertility decline: a bulge of people born before the decline marches up the pyramid, and decades later the old-age share rises steeply.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      let playing = false, acc = 0, traj = null;
      const ctl = kit.controls(box.side, [
        { id: 'year', label: 'Year', min: 1950, max: 2100, step: 1, value: 1950 },
        { id: 'tfr', label: 'Children per woman, after the transition', min: 1, max: 4, step: 0.1, value: 1.6 },
        { id: 'le', label: 'Life expectancy reached by 2100', min: 60, max: 92, step: 1, value: 84, unit: 'yr' },
        { id: 'pace', type: 'select', label: 'Fertility falls', options: [['fast (mostly 1960–1990)', 25], ['at a medium pace (1975–2015)', 45], ['slowly (2000–2050)', 75]], value: 45 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }, { id: 'pause', label: 'Pause' }, { id: 'start', label: 'Back to 1950' }] }
      ], id => {
        if (id === 'play') { if (V.year >= 2100) ctl.set('year', 1950); playing = true; }
        else if (id === 'pause') playing = false;
        else if (id === 'start') { playing = false; ctl.set('year', 1950); }
        else if (id === 'tfr' || id === 'le' || id === 'pace') build();
      });
      const ro = kit.readout(box.side, [['yr', 'Year'], ['pop', 'Population (1950 = 100)'], ['tfr', 'Children per woman'], ['le', 'Life expectancy'], ['med', 'Median age'], ['old', 'Aged 65 and over'], ['kids', 'Under 15'], ['dep', 'Aged 65+ per 100 of working age']]);
      const V = ctl.values, AGES = 101, MALE = 0.512;
      // share of a woman's births at each age 15–49 (sums to 1)
      const ASF = []; let asfSum = 0;
      for (let a = 15; a <= 49; a++) { const v = Math.pow(a - 14, 3) * Math.exp(-(a - 14) / 4.2); ASF.push(v); asfSum += v; }
      for (let i = 0; i < ASF.length; i++) ASF[i] /= asfSum;
      function survival(p, mult) {
        const mu = x => mult * (p.a1 * Math.exp(-p.b1 * x) + p.a2 + p.a3 * Math.exp(p.b3 * x));
        const out = new Float64Array(AGES);
        for (let x = 0; x < AGES; x++) out[x] = Math.exp(-(mu(x + 0.25) + mu(x + 0.75)) / 2);
        return { p: out, first: Math.exp(-mu(0.1) * 0.25 - mu(0.35) * 0.25) };
      }
      function step(m, f, tfr, sm, sf) {
        let births = 0;
        for (let a = 15; a <= 49; a++) births += f[a] * tfr * ASF[a - 15];
        const nm = new Float64Array(AGES), nf = new Float64Array(AGES);
        for (let x = 0; x < AGES - 1; x++) { nm[x + 1] = m[x] * sm.p[x]; nf[x + 1] = f[x] * sf.p[x]; }
        nm[AGES - 1] += m[AGES - 1] * sm.p[AGES - 1]; nf[AGES - 1] += f[AGES - 1] * sf.p[AGES - 1];
        nm[0] = births * MALE * sm.first; nf[0] = births * (1 - MALE) * sf.first;
        return [nm, nf];
      }
      function stats(m, f) {
        let tot = 0, kids = 0, old = 0, work = 0;
        for (let x = 0; x < AGES; x++) { const v = m[x] + f[x]; tot += v; if (x < 15) kids += v; else if (x >= 65) old += v; else work += v; }
        let cum = 0, med = 0;
        for (let x = 0; x < AGES; x++) { const v = m[x] + f[x]; if (cum + v >= tot / 2) { med = x + (tot / 2 - cum) / Math.max(v, 1e-12); break; } cum += v; }
        return { tot, kids: kids / tot, old: old / tot, dep: work > 0 ? 100 * old / work : 0, med };
      }
      function build() {
        const tf = V.tfr, lf = V.le, pace = V.pace;
        const tfrAt = y => tf + (6 - tf) / (1 + Math.exp((y - (1950 + pace)) / (pace / 6)));
        const leAt = y => lf - (lf - 47) * Math.exp(-(y - 1950) / 45);
        // a stable starting population: 200 years at 1950 rates
        let s = sForLE(leAt(1950)), p = sil(s);
        let sm = survival(p, 1.12), sf = survival(p, 0.88);
        let m = new Float64Array(AGES).fill(1), f = new Float64Array(AGES).fill(1);
        for (let i = 0; i < 200; i++) { [m, f] = step(m, f, tfrAt(1950), sm, sf); let t = 0; for (let x = 0; x < AGES; x++) t += m[x] + f[x]; for (let x = 0; x < AGES; x++) { m[x] /= t; f[x] /= t; } }
        let total0 = 0; for (let x = 0; x < AGES; x++) total0 += m[x] + f[x];
        traj = [];
        for (let y = 1950; y <= 2100; y++) {
          const st0 = stats(m, f);
          traj.push({ y, m: m.slice(), f: f.slice(), tfr: tfrAt(y), le: leAt(y), st: st0, idx: 100 * st0.tot / total0 });
          p = sil(sForLE(leAt(y + 1))); sm = survival(p, 1.12); sf = survival(p, 0.88);
          [m, f] = step(m, f, tfrAt(y), sm, sf);
        }
      }
      function draw(dt) {
        if (!traj) return;
        if (playing) { acc += dt || 0; while (acc > 0.07) { acc -= 0.07; if (V.year < 2100) ctl.set('year', V.year + 1); else { playing = false; break; } } }
        const T = traj[clamp(Math.round(V.year) - 1950, 0, traj.length - 1)];
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the pyramid
        const wide = W >= 560, pw = wide ? Math.min(W * 0.58, W - 250) : W - 36, cx = 18 + pw / 2, top = 30, bot = Hh - 40, groups = 20, bh = (bot - top) / groups;
        const tot = T.st.tot, half = pw / 2 - 30, maxShare = 0.1;
        kit.label(c, 'men', cx - half / 2, 14, { size: 12, color: kit.hue(215), weight: 650, align: 'center' });
        kit.label(c, 'women', cx + half / 2, 14, { size: 12, color: kit.hue(340), weight: 650, align: 'center' });
        for (let gI = 0; gI < groups; gI++) {
          let sm = 0, sfm = 0;
          const hi = gI === groups - 1 ? AGES : gI * 5 + 5;
          for (let x = gI * 5; x < hi; x++) { sm += T.m[x]; sfm += T.f[x]; }
          const y = bot - (gI + 1) * bh;
          const wm = clamp(sm / tot / maxShare, 0, 1) * half, wf = clamp(sfm / tot / maxShare, 0, 1) * half;
          c.fillStyle = kit.hue(215, gI >= 13 ? 0.95 : 0.6); c.fillRect(cx - 14 - wm, y + 1, wm, bh - 2);
          c.fillStyle = kit.hue(340, gI >= 13 ? 0.95 : 0.6); c.fillRect(cx + 14, y + 1, wf, bh - 2);
          if (gI % 2 === 0) kit.label(c, gI === groups - 1 ? '95+' : String(gI * 5), cx, y + bh / 2, { size: 9.5, color: C.muted, align: 'center' });
        }
        c.save(); c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const s of [0.05, 0.1]) { const d = s / maxShare * half; c.beginPath(); c.moveTo(cx - 14 - d, top); c.lineTo(cx - 14 - d, bot); c.moveTo(cx + 14 + d, top); c.lineTo(cx + 14 + d, bot); c.stroke(); }
        c.restore();
        kit.label(c, '5 %', cx + 14 + 0.5 * half, bot + 10, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, '10 %', cx + 14 + half, bot + 10, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'share of the population in each 5-year age group', cx, bot + 26, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, String(T.y), 18, top + 4, { size: 22, weight: 700, color: C.text });
        // share of old and young over time
        const r = { x0: pw + 70, y0: 30, x1: W - 14, y1: Hh - 60 };
        if (wide && r.x1 - r.x0 > 80) {
          const ax = frame(kit, c, C, r, [1950, 2100], [0, 50], { xstep: 50, ystep: 10, yfmt: v => v + ' %' });
          const o = [], k = [];
          traj.forEach(q => { o.push([ax.X(q.y), ax.Y(100 * q.st.old)]); k.push([ax.X(q.y), ax.Y(100 * q.st.kids)]); });
          polyline(c, k, kit.hue(140), 2.2); polyline(c, o, C.bad, 2.4);
          polyline(c, [[ax.X(T.y), r.y0], [ax.X(T.y), r.y1]], C.faint, 1, [3, 3]);
          kit.dot(c, ax.X(T.y), ax.Y(100 * T.st.old), 4.5, C.bad, C.bg2); kit.dot(c, ax.X(T.y), ax.Y(100 * T.st.kids), 4.5, kit.hue(140), C.bg2);
          kit.label(c, 'under 15', r.x0 + 6, r.y0 + 6, { size: 11, color: kit.hue(140), weight: 650 });
          kit.label(c, '65 and over', r.x0 + 6, r.y0 + 22, { size: 11, color: C.bad, weight: 650 });
          kit.label(c, 'model population (illustrative)', r.x1, r.y1 + 34, { size: 10.5, color: C.muted, align: 'right' });
        }
        ro.set('yr', String(T.y) + (playing ? ' (playing)' : ''));
        ro.set('pop', fx(T.idx, 0));
        ro.set('tfr', fx(T.tfr, 2));
        ro.set('le', fx(T.le, 1) + ' years');
        ro.set('med', fx(T.st.med, 1) + ' years');
        ro.set('old', fx(100 * T.st.old, 1) + ' %');
        ro.set('kids', fx(100 * T.st.kids, 1) + ' %');
        ro.set('dep', fx(T.st.dep, 0));
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. pregnancy week by week */
  const WEIGHT = [[8, 1], [10, 4], [12, 14], [14, 45], [16, 100], [18, 190], [20, 320]];   // grams, approximate
  function fetalWeight(w) {
    if (w < 8) return null;
    if (w >= 20) return Math.exp(0.578 + 0.332 * w - 0.00354 * w * w);                      // Hadlock (1991), median
    for (let i = 1; i < WEIGHT.length; i++) if (w <= WEIGHT[i][0]) {
      const [w0, g0] = WEIGHT[i - 1], [w1, g1] = WEIGHT[i];
      return Math.exp(Math.log(g0) + (Math.log(g1) - Math.log(g0)) * (w - w0) / (w1 - w0));
    }
    return null;
  }
  const crl = w => { const d = w * 7; return d > 45 ? Math.pow((d - 23.73) / 8.052, 2) / 10 : Math.max(0.1, (d - 28) / 35); };   // cm (Robinson, from about 7 weeks)
  const crownHeel = w => (w <= 20 ? Math.pow(w / 4, 2) : w * 5 / 4);                                                             // cm (Haase's rule, lunar months)
  const MILESTONES = [
    [4, 'Implantation is complete; a pregnancy test turns positive around the missed period.'],
    [6, 'A flickering heartbeat can often be seen on an ultrasound scan.'],
    [8, 'All the major organs are forming; the embryo is about 1.6 cm long.'],
    [10, 'From now on the embryo is called a fetus.'],
    [12, 'The first-trimester scan (about 11–14 weeks) dates the pregnancy and offers screening.'],
    [14, 'The second trimester begins; for many women nausea eases.'],
    [18, 'Movements are often first felt between about 16 and 24 weeks (earlier in later pregnancies).'],
    [20, 'The mid-pregnancy scan (about 18–21 weeks) checks the baby\'s anatomy and the placenta.'],
    [24, 'The edge of viability: with neonatal intensive care, a baby born now may survive.'],
    [26, 'Screening for gestational diabetes is usually done around 24–28 weeks.'],
    [28, 'The third trimester begins; the baby\'s movements should be felt every day.'],
    [34, 'Most babies have turned head-down by now.'],
    [37, 'Early term: the baby is ready to be born.'],
    [40, 'The due date — though only about 1 baby in 25 arrives on it.'],
    [42, 'Post-term: induction of labour is usually offered by about 41–42 weeks.']
  ];
  Hyper.sim('prev-pregnancy-weeks', {
    title: 'Pregnancy week by week',
    blurb: `A **schematic** of the baby and the womb, drawn to scale, from 4 to 42 weeks (counted from the first day of the last period). Sizes are approximate averages — babies vary. Before about 14 weeks the length given is the crown–rump length measured on scans; after that the crown-to-heel length, estimated with Haase's rule.

- Press **Play the weeks** and watch the growth: slow in length early on, and a weight that more than triples in the last ten weeks.
- Stop at 12, 20 and 28 weeks and read the milestones.
- Notice the mother's side: her blood volume and cardiac output rise by 30–50 %, most of it by the middle of pregnancy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      let playing = false, acc = 0;
      const ctl = kit.controls(box.side, [
        { id: 'week', label: 'Week of pregnancy', min: 4, max: 42, step: 1, value: 12 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play the weeks', primary: true }, { id: 'pause', label: 'Pause' }] }
      ], id => {
        if (id === 'play') { if (V.week >= 42) ctl.set('week', 4); playing = true; }
        else if (id === 'pause') playing = false;
      });
      const ro = kit.readout(box.side, [['wk', 'Week'], ['len', 'Length'], ['wt', 'Weight'], ['womb', 'Top of the womb'], ['mum', 'Mother: blood volume, heart output'], ['ms', 'Milestone']]);
      const V = ctl.values;
      function baby(c, C, cx, cy, L, w) {
        // a curled baby, drawn from its crown–rump length L (px); an embryo is a simple curve
        c.save();
        const skin = C.dark ? 'hsl(20 55% 62%)' : 'hsl(20 60% 70%)', edge = C.dark ? 'hsl(20 40% 40%)' : 'hsl(20 40% 48%)';
        c.fillStyle = skin; c.strokeStyle = edge; c.lineWidth = Math.max(1, L * 0.02);
        if (w < 9) {
          c.beginPath(); c.arc(cx, cy, L * 0.42, Math.PI * 0.95, Math.PI * 2.35); c.lineWidth = Math.max(2, L * 0.28); c.strokeStyle = skin; c.stroke();
          c.beginPath(); c.arc(cx + L * 0.1, cy - L * 0.34, L * 0.24, 0, Math.PI * 2); c.fill();
        } else {
          const hr = L * (w < 14 ? 0.3 : 0.24);
          c.beginPath(); c.ellipse(cx, cy + L * 0.08, L * 0.28, L * 0.4, -0.35, 0, Math.PI * 2); c.fill(); c.stroke();          // body
          c.beginPath(); c.arc(cx + L * 0.2, cy - L * 0.34, hr, 0, Math.PI * 2); c.fill(); c.stroke();                               // head
          c.lineCap = 'round'; c.lineWidth = Math.max(2, L * 0.1); c.strokeStyle = skin;
          c.beginPath(); c.moveTo(cx - L * 0.05, cy + L * 0.38); c.quadraticCurveTo(cx + L * 0.35, cy + L * 0.5, cx + L * 0.3, cy + L * 0.1); c.stroke();   // legs
          c.beginPath(); c.moveTo(cx + L * 0.12, cy - L * 0.1); c.quadraticCurveTo(cx + L * 0.4, cy - L * 0.02, cx + L * 0.34, cy - L * 0.2); c.stroke();  // arm
        }
        c.restore();
      }
      function draw(dt) {
        if (playing) { acc += dt || 0; if (acc > 0.55) { acc = 0; if (V.week < 42) ctl.set('week', V.week + 1); else playing = false; } }
        const w = V.week, C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const tlH = 70, areaH = Hh - tlH - 10, lw = Math.min(W * 0.5, areaH * 1.05);
        const pxcm = (areaH - 30) / 40;                         // the full-term womb (about 38 cm) fits
        const womb = 7.5 + 30 * smooth(4, 38, w), ww = womb * 0.78;
        const cx = 20 + lw / 2, cy = 16 + (areaH - 16) / 2;
        // the womb, the fluid and the placenta
        c.save();
        c.beginPath(); c.ellipse(cx, cy, ww * pxcm / 2, womb * pxcm / 2, 0, 0, Math.PI * 2);
        c.fillStyle = C.dark ? 'rgba(120,170,255,0.10)' : 'rgba(80,140,230,0.10)'; c.fill();
        c.lineWidth = 3; c.strokeStyle = C.dark ? 'hsl(350 45% 55%)' : 'hsl(350 50% 60%)'; c.stroke();
        if (w >= 6) { c.beginPath(); c.ellipse(cx, cy, ww * pxcm / 2 - 3, womb * pxcm / 2 - 3, 0, -Math.PI * 0.85, -Math.PI * 0.45); c.lineWidth = Math.max(3, womb * pxcm * 0.06); c.strokeStyle = C.dark ? 'hsl(345 45% 42%)' : 'hsl(345 45% 62%)'; c.stroke(); }
        c.restore();
        const L = (w < 14 ? crl(w) : crownHeel(w) * 0.66) * pxcm;
        if (w >= 5) baby(c, C, cx, cy + L * 0.05, Math.max(2, L), w);
        kit.label(c, 'womb (uterus)', cx, cy - womb * pxcm / 2 - 10, { size: 10.5, color: C.muted, align: 'center' });
        if (w >= 6 && womb * pxcm > 90) kit.label(c, 'placenta', cx - ww * pxcm * 0.28, cy - womb * pxcm * 0.38, { size: 10, color: C.muted, align: 'center' });
        // a 10 cm scale bar
        const sx = 20, sy = areaH - 4;
        polyline(c, [[sx, sy - 5], [sx, sy], [sx + 10 * pxcm, sy], [sx + 10 * pxcm, sy - 5]], C.text2, 1.5);
        kit.label(c, '10 cm', sx + 5 * pxcm, sy - 10, { size: 10.5, color: C.text2, align: 'center' });
        // the text panel
        const tx = 20 + lw + 16, tri = w < 14 ? 'first trimester' : w < 28 ? 'second trimester' : 'third trimester';
        kit.label(c, 'Week ' + w, tx, 26, { size: 22, weight: 700 });
        kit.label(c, tri, tx, 50, { size: 13, color: C.text2, weight: 600 });
        const ms = MILESTONES.filter(m => m[0] <= w).pop(), nx = MILESTONES.find(m => m[0] > w);
        const wrap = (txt, x, y, maxW, size, col) => {
          c.save(); c.font = size + 'px system-ui, sans-serif';
          const words = txt.split(' '); let line = '', yy = y;
          for (const word of words) { const t2 = line ? line + ' ' + word : word; if (c.measureText(t2).width > maxW && line) { kit.label(c, line, x, yy, { size, color: col }); line = word; yy += size + 5; } else line = t2; }
          if (line) kit.label(c, line, x, yy, { size, color: col });
          c.restore(); return yy + size + 8;
        };
        let yy = 80;
        if (ms) { kit.label(c, 'Now (from week ' + ms[0] + ')', tx, yy, { size: 11.5, color: C.accent, weight: 650 }); yy = wrap(ms[1], tx, yy + 18, W - tx - 14, 12.5, C.text); }
        if (nx) { kit.label(c, 'Next, at week ' + nx[0], tx, yy + 4, { size: 11.5, color: C.muted, weight: 650 }); wrap(nx[1], tx, yy + 22, W - tx - 14, 12, C.muted); }
        // the timeline
        const t0 = 20, t1 = W - 20, ty = Hh - 42, X = k => t0 + k / 42 * (t1 - t0);
        [[0, 14, 28], [14, 28, 140], [28, 42, 265]].forEach(([a, b, h]) => { c.fillStyle = kit.hue(h, 0.22); c.fillRect(X(a), ty - 9, X(b) - X(a), 18); });
        kit.label(c, 'first trimester', (X(0) + X(14)) / 2, ty, { size: 10.5, color: C.text2, align: 'center' });
        kit.label(c, 'second', (X(14) + X(28)) / 2, ty, { size: 10.5, color: C.text2, align: 'center' });
        kit.label(c, 'third', (X(28) + X(42)) / 2, ty, { size: 10.5, color: C.text2, align: 'center' });
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1;
        for (const m of MILESTONES) { c.beginPath(); c.moveTo(X(m[0]), ty + 10); c.lineTo(X(m[0]), ty + 15); c.stroke(); }
        c.restore();
        for (const k of [0, 10, 20, 30, 40]) kit.label(c, String(k), X(k), ty + 24, { size: 10, color: C.muted, align: 'center' });
        c.fillStyle = C.ok; c.globalAlpha = 0.25; c.fillRect(X(37), ty - 12, X(42) - X(37), 3); c.globalAlpha = 1;
        kit.arrow(c, X(w), ty - 26, X(w), ty - 11, C.bad, 2);
        // read-outs
        const g = fetalWeight(w);
        ro.set('wk', w + ' weeks (' + tri + ')');
        ro.set('len', w < 7 ? 'a few millimetres' : w < 14 ? 'about ' + fx(crl(w), 1) + ' cm (crown–rump)' : 'about ' + fx(crownHeel(w), 0) + ' cm (crown–heel)');
        ro.set('wt', g == null ? 'under a gram' : g < 1000 ? 'about ' + (g < 10 ? fx(g, 0) : Math.round(g / 5) * 5) + ' g' : 'about ' + fx(g / 1000, 1) + ' kg');
        ro.set('womb', w < 12 ? 'inside the pelvis' : w < 20 ? 'rising above the pubic bone' : w <= 36 ? 'about ' + w + ' cm above the pubic bone' : 'near the ribs; drops as the head engages');
        ro.set('mum', '+' + Math.round(45 * smooth(6, 32, w)) + ' % blood volume, +' + Math.round(40 * smooth(5, 26, w)) + ' % cardiac output');
        ro.set('ms', ms ? ms[1] : 'Too early to detect.');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. compression of morbidity */
  function morbidity(dD, dH) {
    const muD = x => 0.0004 + 0.000018 * Math.exp(0.1 * (x - dD));
    const muH = x => 0.00008 * Math.exp(0.085 * (x - dH));
    const dx = 0.25, S = [], H = [];
    let s = 1, h = 1, LE = 0, DF = 0;
    for (let x = 0; x <= 115; x += dx) {
      S.push([x, s]); H.push([x, h]);
      const s2 = s * Math.exp(-muD(x + dx / 2) * dx), h2 = h * Math.exp(-(muD(x + dx / 2) + muH(x + dx / 2)) * dx);
      LE += (s + s2) / 2 * dx; DF += (h + h2) / 2 * dx; s = s2; h = h2;
    }
    return { S, H, LE, DF, dis: LE - DF };
  }
  Hyper.sim('prev-compression', {
    title: 'The compression of morbidity',
    blurb: `An **illustrative** model population. The upper curve is the share still alive at each age; the lower curve the share alive *and free of disability*. The shaded band between them is life lived with disability, and its area is the expected years with disability. Dashed curves are the starting point.

- **Expansion**: push death back but not the onset of disability — life lengthens, and so do the years of illness.
- **Compression**: push the onset of disability back further than death — life lengthens *and* the years of illness shrink. That was James Fries's hope in 1980, and cohort studies suggest that not smoking, staying active and keeping a healthy weight do both.
- Try moving only the onset of disability: the years of illness fall even if life expectancy is unchanged.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const base = morbidity(0, 0);
      let cur = null;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Scenario', options: [['Your own settings', 'own'], ['Compression: disability delayed more than death', 'comp'], ['Expansion: longer life, disability not delayed', 'exp'], ['Postponement: both delayed equally', 'post']], value: 'comp' },
        { id: 'dD', label: 'Death postponed by', min: -5, max: 12, step: 0.5, value: 3, unit: 'yr' },
        { id: 'dH', label: 'Onset of disability postponed by', min: -5, max: 15, step: 0.5, value: 8, unit: 'yr' }
      ], id => {
        if (id === 'preset') {
          const P = { comp: [3, 8], exp: [5, 0], post: [5, 5] }[V.preset];
          if (P) { ctl.set('dD', P[0]); ctl.set('dH', P[1]); }
        } else ctl.set('preset', 'own');
        cur = morbidity(V.dD, V.dH);
      });
      const ro = kit.readout(box.side, [['le', 'Life expectancy'], ['df', 'Years free of disability'], ['dis', 'Years with disability'], ['share', 'Share of life with disability'], ['verdict', 'Verdict']]);
      const V = ctl.values;
      cur = morbidity(V.dD, V.dH);
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const barsH = 74, r = { x0: 62, y0: 18, x1: W - 16, y1: Hh - barsH - 46 };
        const ax = frame(kit, c, C, r, [40, 110], [0, 100], { xstep: 10, ystep: 25, yfmt: v => v + ' %', xlabel: 'age (years)', ylabel: 'share of people' });
        const toPx = arr => arr.filter(p => p[0] >= 40 && p[0] <= 110).map(p => [ax.X(p[0]), ax.Y(100 * p[1])]);
        const sP = toPx(cur.S), hP = toPx(cur.H);
        // the band of life with disability
        c.save(); c.beginPath(); sP.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
        for (let i = hP.length - 1; i >= 0; i--) c.lineTo(hP[i][0], hP[i][1]);
        c.closePath(); c.globalAlpha = 0.22; c.fillStyle = C.warn; c.fill(); c.restore();
        polyline(c, toPx(base.S), C.muted, 1.4, [5, 4]); polyline(c, toPx(base.H), C.muted, 1.4, [5, 4]);
        polyline(c, sP, C.text, 2.4); polyline(c, hP, C.ok, 2.6);
        const lab = (arr, txt, col, dy) => { const p = arr.find(q => q[0] >= 85) || arr[arr.length - 1]; kit.label(c, txt, ax.X(p[0]) + 6, ax.Y(100 * p[1]) + dy, { size: 11.5, color: col, weight: 650 }); };
        lab(cur.S, 'alive', C.text, -10); lab(cur.H, 'alive and free of disability', C.ok, 12);
        kit.label(c, 'illustrative model; dashed = starting point', r.x1 - 4, r.y0 + 8, { size: 10.5, color: C.muted, align: 'right' });
        // life-course bars
        const bx0 = r.x0, bx1 = r.x1, maxA = 95, B = a => bx0 + a / maxA * (bx1 - bx0);
        const bar = (y, res, name) => {
          c.fillStyle = C.ok; c.globalAlpha = 0.75; c.fillRect(B(0), y, B(res.DF) - B(0), 16);
          c.fillStyle = C.warn; c.fillRect(B(res.DF), y, B(res.LE) - B(res.DF), 16); c.globalAlpha = 1;
          kit.label(c, name, B(0) + 6, y + 8, { size: 11, color: C.bg2, weight: 650 });
          kit.label(c, fx(res.dis, 1) + ' yr with disability', B(res.LE) + 6, y + 8, { size: 11, color: C.text2 });
        };
        const by = Hh - barsH;
        bar(by, base, 'start: ' + fx(base.DF, 1) + ' healthy years');
        bar(by + 26, cur, 'scenario: ' + fx(cur.DF, 1) + ' healthy years');
        kit.label(c, 'average lifetime (from birth), years: green in good health, amber with disability', bx0, by + 58, { size: 10.5, color: C.muted });
        ro.set('le', fx(base.LE, 1) + ' → ' + fx(cur.LE, 1) + ' years');
        ro.set('df', fx(base.DF, 1) + ' → ' + fx(cur.DF, 1) + ' years');
        ro.set('dis', fx(base.dis, 1) + ' → ' + fx(cur.dis, 1) + ' years');
        ro.set('share', fx(100 * base.dis / base.LE, 1) + ' % → ' + fx(100 * cur.dis / cur.LE, 1) + ' %');
        const d = cur.dis - base.dis;
        ro.set('verdict', Math.abs(d) < 0.15 ? 'about the same years of illness' : d < 0 ? 'compression: ' + fx(-d, 1) + ' fewer years of illness' : 'expansion: ' + fx(d, 1) + ' more years of illness');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
