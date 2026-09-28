/* HYPER-ERGONOMICS · sims/mind-transport.js — simulations for the mind at work and for vehicles and transport.
 *   mt-signal-detection  signal detection: noise and signal distributions, the criterion, hits, misses and false alarms;
 *                        the ideal criterion from prevalence and costs; and the vigilance decrement over a watch, with breaks
 *   mt-workload          a task timeline in four resource lanes (seeing, hearing, thinking, responding) for driving, an
 *                        approach to land and a control-room upset; secondary tasks, automation, time pressure, experience
 *   mt-swiss-cheese      errors flying at layers of defence with drifting holes; independence and common causes
 *   mt-takeover          an automated car hands back control before a lane closure; SA levels against the distance left
 *   mt-decision          drift–diffusion decisions: caution, evidence quality, noise and deadlines; error rates and RTs
 *   mt-usability-test    30 hidden problems met by test users; one big round against small iterative rounds
 *   mt-legibility        a sign seen at a distance, blurred to the reader's eyesight; height rules against distance
 *   mt-seat-vibration    a seat on a spring and damper over a vibrating floor; transmissibility, SEAT, A(8)
 *   mt-driver-package    a driver of any size in a car, SUV or truck cab: seat track, knee, elbow, airbag distance,
 *                        head room, sight lines over the bonnet and under the header, a child in front
 *   mt-blind-zones       plan view of a car, trucks or a forklift: direct vision past sills, pillars and loads, and
 *                        convex mirrors traced ray by ray to the ground; a draggable person
 *   mt-cockpit           a pilot at the design eye position: over-nose view on approach, pedals, overhead panel
 *   mt-steps-access      steps and handholds into cabs, buses and machines for people of any size
 *   mt-standing-passenger a standing passenger in a bus: tilted gravity, stance, holds and the force needed
 * Models written here (not in the engine): equal-variance signal detection with an illustrative vigilance decrement,
 * a VACP-style multiple-resource timeline, a Swiss-cheese Monte Carlo with a common-cause factor, the drift–diffusion
 * model, a problem-discovery model with blocking problems, a single-degree-of-freedom seat, seated and standing
 * manikins with two-link limbs, sight-line and convex-mirror ray tracing, and a jerk-limited bus speed profile.
 */
(function () {
  'use strict';
  const font = () => getComputedStyle(document.body).fontFamily || 'sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const DEG = Math.PI / 180;
  const ord = p => { const r = Math.round(p); const s = (r % 100 >= 11 && r % 100 <= 13) ? 'th' : ['th', 'st', 'nd', 'rd'][r % 10] || 'th'; return r + s; };
  const who = (sex, p) => ord(p) + '-percentile ' + (sex === 'm' ? 'man' : 'woman');
  const onTheme = fn => { document.addEventListener('hyper:theme', fn); return () => document.removeEventListener('hyper:theme', fn); };
  const pctTxt = (f, d) => (100 * f).toFixed(d == null ? 1 : d) + ' %';
  const sexCol = (C, sex) => sex === 'm' ? C.hue(215, 0.95) : C.hue(330, 0.95);

  /* ================================================================ mt-signal-detection */
  Hyper.sim('mt-signal-detection', {
    title: 'Finding rare signals — and the watch that decays',
    blurb: `Signal detection in one picture. The evidence an observer gets from a harmless event (noise, left curve) and from a real signal (right curve) overlap; the observer says "signal" whenever the evidence lies right of the **criterion** (red line). Green is hits, red misses, amber false alarms. The distance between the curves is the **sensitivity d′**. Below, the same observer over a long watch: an illustrative model of the vigilance decrement with the typical shape — most of the loss in the first 15–30 minutes, worse when events come fast and when signals are rare — and what breaks do to it.

**Try this**
- Move the criterion right: false alarms fall, but hits fall too. Only a larger d′ gives more hits *and* fewer false alarms.
- Make signals rare (1 %) with equal costs and press *Set the ideal criterion*: the best criterion becomes very cautious and half the signals or more are missed — the prevalence effect.
- Now make a miss 100 times as costly as a false alarm (a weapon in a bag): the ideal criterion swings back to liberal.
- Watch for 60 min with no break, then with a break every 20 min: compare the hit rate at the end of the watch.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 400 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time on watch (min)', min: 0, max: 60 }, y: { label: 'rate (%)', min: 0, max: 100 }, legend: true }, 190);
      const ideal = () => {
        const p = V.prev, beta = ((1 - p) / p) / V.cost;
        return V.d > 0.05 ? clamp(Math.log(beta) / V.d, -2, 2.5) : 0;
      };
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Sensitivity d′ (how distinct a signal is)', min: 0, max: 4, step: 0.05, value: 2 },
        { id: 'c', label: 'Criterion c (0 neutral, + cautious, − liberal)', min: -2, max: 2.5, step: 0.05, value: 0 },
        { id: 'prev', type: 'select', label: 'Share of events that are real signals', options: [['50 % (common)', 0.5], ['10 %', 0.1], ['1 % (rare)', 0.01], ['0.1 % (very rare)', 0.001]], value: 0.1 },
        { id: 'cost', type: 'select', label: 'Cost of a miss compared with a false alarm', options: [['equal', 1], ['10 times', 10], ['100 times', 100]], value: 1 },
        { id: 'watch', label: 'Length of the watch', min: 10, max: 120, step: 5, value: 60, unit: 'min' },
        { id: 'brk', type: 'select', label: 'Break or change of task', options: [['none', 0], ['every 20 min', 20], ['every 30 min', 30], ['every 60 min', 60]], value: 0 },
        { id: 'rate', type: 'select', label: 'Events to inspect', options: [['slow (5 a minute)', 5], ['fast (30 a minute)', 30]], value: 30 },
        { type: 'buttons', items: [{ id: 'ideal', label: 'Set the ideal criterion', primary: true }, { id: 'neutral', label: 'Neutral criterion' }] }
      ], id => {
        if (id === 'ideal') ctl.set('c', Math.round(ideal() * 20) / 20);
        if (id === 'neutral') ctl.set('c', 0);
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['H', 'Hits (signals found)'], ['F', 'False alarms (of harmless events)'], ['n', 'Per 1000 events'], ['acc', 'Correct decisions'], ['ic', 'Ideal criterion'], ['end', 'Hits at the end of the watch'], ['mean', 'Hits over the whole watch']]);
      const Phi = x => E.phi(x);
      // illustrative vigilance model: d′ falls and c rises with time since the last break, time constant 12 min
      function atTime(t) {
        const since = V.brk > 0 ? t % V.brk : t, g = 1 - Math.exp(-since / 12);
        const dd = (V.rate >= 30 ? 0.28 : 0.12) * g, dc = (V.prev <= 0.01 ? 0.45 : V.prev <= 0.1 ? 0.3 : 0.15) * g;
        const d = V.d * (1 - dd), c = V.c + dc;
        return { d, c, H: Phi(d / 2 - c), F: Phi(-d / 2 - c) };
      }
      function draw() {
        const C = kit.colors(), d = V.d, c0 = V.c, p = V.prev;
        const H = Phi(d / 2 - c0), F = Phi(-d / 2 - c0);
        ro.set('H', pctTxt(H));
        ro.set('F', pctTxt(F, F < 0.01 ? 2 : 1));
        const ns = 1000 * p, nn = 1000 - ns;
        ro.set('n', (ns * H).toFixed(ns < 10 ? 2 : 1) + ' hits, ' + (ns * (1 - H)).toFixed(ns < 10 ? 2 : 1) + ' misses, ' + (nn * F).toFixed(1) + ' false alarms');
        ro.set('acc', pctTxt(p * H + (1 - p) * (1 - F)));
        ro.set('ic', 'c = ' + ideal().toFixed(2) + (ideal() >= 2.49 ? ' (off the scale: very cautious)' : ''));
        // the watch
        const T = V.watch, hp = [], fp = [];
        let sum = 0, n = 0;
        for (let t = 0; t <= T + 1e-9; t += 0.5) { const a = atTime(t); hp.push([t, 100 * a.H]); fp.push([t, 100 * a.F]); sum += a.H; n++; }
        const last = atTime(V.brk > 0 && T % V.brk === 0 ? T - 0.01 : T);
        ro.set('end', pctTxt(last.H) + ' (from ' + pctTxt(H) + ' at the start)');
        ro.set('mean', pctTxt(sum / Math.max(1, n)));
        const vl = [];
        if (V.brk > 0) for (let t = V.brk; t < T; t += V.brk) vl.push({ x: t, label: 'break' });
        plot.set({ x: { label: 'time on watch (min) — illustrative model', min: 0, max: T }, series: [{ pts: hp, label: 'hits', color: C.ok, width: 2 }, { pts: fp, label: 'false alarms', color: C.warn, width: 2, dash: [5, 4] }], vlines: vl, hlines: [] });
        // the distributions
        const cx = st.begin(), W = st.W, Hh = st.H;
        cx.font = '12px ' + font();
        const lo = -d / 2 - 3.6, hi = d / 2 + 3.6, x0 = 30, x1 = W - 20, yb = Hh - 44, yt = 34;
        const X = v => x0 + (v - lo) / (hi - lo) * (x1 - x0);
        const pdf = (v, mu) => Math.exp(-0.5 * (v - mu) * (v - mu)) / Math.sqrt(2 * Math.PI);
        const Y = q => yb - q / 0.4 * (yb - yt);
        const N = 200;
        const area = (mu, from, to, col) => {
          const a = Math.max(lo, from), b = Math.min(hi, to);
          if (b <= a) return;
          cx.beginPath(); cx.moveTo(X(a), yb);
          for (let i = 0; i <= N; i++) { const v = a + (b - a) * i / N; cx.lineTo(X(v), Y(pdf(v, mu))); }
          cx.lineTo(X(b), yb); cx.closePath(); cx.fillStyle = col; cx.fill();
        };
        const mN = -d / 2, mS = d / 2;
        area(mN, c0, hi, C.hue(40, 0.35));
        area(mS, lo, c0, C.hue(0, 0.3));
        area(mS, c0, hi, C.hue(140, 0.35));
        const curve = (mu, col) => { cx.beginPath(); for (let i = 0; i <= N; i++) { const v = lo + (hi - lo) * i / N; const y = Y(pdf(v, mu)); i ? cx.lineTo(X(v), y) : cx.moveTo(X(v), y); } cx.strokeStyle = col; cx.lineWidth = 2; cx.stroke(); };
        curve(mN, C.muted); curve(mS, C.accent);
        cx.strokeStyle = C.axis; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(x0, yb); cx.lineTo(x1, yb); cx.stroke();
        kit.label(cx, 'harmless events (noise)', X(mN), Y(0.4) - 12, { align: 'center', size: 11.5, color: C.muted });
        kit.label(cx, 'real signals', X(mS), Y(0.4) - (d < 1.2 ? 26 : 12), { align: 'center', size: 11.5, color: C.accent });
        // d′ bracket
        if (d > 0.2) { const yy = Y(0.4) + 10; kit.arrow(cx, X(0), yy, X(mS), yy, C.text, 1.2, 6); kit.arrow(cx, X(0), yy, X(mN), yy, C.text, 1.2, 6); kit.label(cx, 'd′ = ' + d.toFixed(2), X(0), yy + 12, { align: 'center', size: 11.5, bg: C.bg2 }); }
        // criterion
        const xc = X(clamp(c0, lo, hi));
        cx.strokeStyle = C.bad; cx.lineWidth = 2.5; cx.beginPath(); cx.moveTo(xc, yt - 18); cx.lineTo(xc, yb + 4); cx.stroke();
        kit.label(cx, 'criterion c = ' + c0.toFixed(2) + '   say "signal" →', xc + 6, yt - 20, { size: 11.5, color: C.bad });
        const ic = ideal(), xi = X(clamp(ic, lo, hi));
        cx.setLineDash([4, 4]); cx.strokeStyle = C.text; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(xi, yt); cx.lineTo(xi, yb); cx.stroke(); cx.setLineDash([]);
        kit.label(cx, 'ideal', xi, yb + 14, { align: 'center', size: 11, color: C.muted });
        // legend
        const lg = [[C.hue(140, 0.6), 'hits ' + pctTxt(H, 0)], [C.hue(0, 0.55), 'misses ' + pctTxt(1 - H, 0)], [C.hue(40, 0.6), 'false alarms ' + pctTxt(F, 0)]];
        lg.forEach((l, i) => { const lx = x0 + i * Math.max(120, (x1 - x0) / 3.2); cx.fillStyle = l[0]; cx.fillRect(lx, Hh - 22, 12, 12); kit.label(cx, l[1], lx + 17, Hh - 16, { size: 11.5 }); });
        kit.label(cx, 'evidence (standard deviations of the noise)', x1, yb + 14, { align: 'right', size: 11, color: C.muted });
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-workload */
  // demands per task on four channels, 0–1 of one person's capacity, in the manner of VACP workload models
  const WL = {
    drive: {
      name: 'Driving through town', T: 120,
      tasks: [
        { n: 'Lane keeping and speed', t0: 0, t1: 120, v: 0.3, a: 0, c: 0.15, m: 0.25, auto: { n: 'Supervising cruise and lane keeping', v: 0.2, c: 0.2, m: 0.06 } },
        { n: 'Scanning mirrors and traffic', t0: 0, t1: 120, v: 0.15, a: 0, c: 0.1, m: 0 },
        { n: 'Navigation voice', t0: 24, t1: 30, v: 0, a: 0.4, c: 0.2, m: 0 },
        { n: 'Junction: look, signal, turn', t0: 40, t1: 56, v: 0.3, a: 0, c: 0.3, m: 0.35 },
        { n: 'Navigation voice', t0: 74, t1: 80, v: 0, a: 0.4, c: 0.2, m: 0 },
        { n: 'Pedestrian at a crossing', t0: 84, t1: 96, v: 0.3, a: 0, c: 0.35, m: 0.15 }
      ],
      extra: {
        call: { n: 'Hands-free phone call', t0: 12, t1: 108, v: 0, a: 0.45, c: 0.35, m: 0.05 },
        type: { n: 'Typing a destination on the screen', t0: 30, t1: 62, v: 0.5, a: 0, c: 0.25, m: 0.45 }
      },
      autoTxt: 'adaptive cruise and lane keeping: less steering, more monitoring'
    },
    app: {
      name: 'Approach and landing', T: 180,
      tasks: [
        { n: 'Flying the approach by hand', t0: 0, t1: 160, v: 0.35, a: 0, c: 0.2, m: 0.4, auto: { n: 'Monitoring the autopilot', v: 0.2, c: 0.25, m: 0.05 } },
        { n: 'Monitoring instruments', t0: 0, t1: 180, v: 0.2, a: 0, c: 0.1, m: 0 },
        { n: 'Air traffic clearance, read-back', t0: 20, t1: 32, v: 0, a: 0.5, c: 0.3, m: 0.15 },
        { n: 'Gear, flaps and checklist', t0: 60, t1: 86, v: 0.3, a: 0, c: 0.25, m: 0.4 },
        { n: 'Runway change: brief and reset', t0: 100, t1: 132, v: 0.35, a: 0.1, c: 0.45, m: 0.3 },
        { n: 'Flare and touchdown', t0: 160, t1: 180, v: 0.5, a: 0, c: 0.3, m: 0.55, auto: { v: 0.5, c: 0.3, m: 0.55 } }
      ],
      extra: {
        call: { n: 'Call from the cabin', t0: 104, t1: 122, v: 0, a: 0.4, c: 0.3, m: 0.1 },
        type: { n: 'Non-essential chat (breaks the sterile-cockpit rule)', t0: 60, t1: 140, v: 0, a: 0.3, c: 0.25, m: 0.15 }
      },
      autoTxt: 'autopilot coupled to the approach until the flare'
    },
    cr: {
      name: 'Control room: the 10 minutes after an upset', T: 600,
      tasks: [
        { n: 'Watching the plant overview', t0: 0, t1: 600, v: 0.2, a: 0, c: 0.15, m: 0 },
        { n: 'Phone calls from the field', t0: 120, t1: 190, v: 0, a: 0.45, c: 0.3, m: 0.2 }
      ],
      extra: {
        call: { n: 'Radio calls from a maintenance team', t0: 240, t1: 330, v: 0, a: 0.4, c: 0.25, m: 0.15 },
        type: { n: 'Shift-handover questions', t0: 200, t1: 320, v: 0, a: 0.35, c: 0.3, m: 0.2 }
      },
      autoTxt: 'alarm suppression by plant state: about 60 % of the flood filtered'
    }
  };
  Hyper.sim('mt-workload', {
    title: 'A workload timeline in four channels',
    blurb: `A task timeline in the manner of multiple-resource (VACP) workload models: each task asks for a share of one person's capacity to **see**, **hear**, **think** and **respond** (hands and voice). The lanes add up the demands second by second; a lane over the dashed 80 % line leaves little reserve, and over 100 % (red) something must give — a task is shed, delayed or done badly. Demand values are illustrative, chosen to show the method.

**Try this**
- Driving through town: add the *typing* task — the seeing and responding lanes overflow at the junction. Swap it for the *hands-free call*: the eyes are free, but the thinking lane peaks at the pedestrian crossing.
- Approach and landing: switch the automation off and on; then add the non-essential chat and see why airlines keep the flight deck "sterile" below 10 000 ft.
- Control room: raise the alarms in the first 10 minutes from 10 to 30; then switch on the alarm suppression.
- Raise the time pressure to 1.3 and change the experience from *expert* to *novice*.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'Scenario', options: [['Driving through town', 'drive'], ['Approach and landing', 'app'], ['Control room after an upset', 'cr']], value: 'drive' },
        { id: 'ex', type: 'select', label: 'Secondary task', options: [['none', 'none'], ['a call (hands-free / cabin / radio)', 'call'], ['typing / chat / handover', 'type']], value: 'none' },
        { id: 'auto', type: 'check', label: 'Automation or support on', value: false },
        { id: 'alarms', label: 'Alarms in the first 10 minutes', min: 0, max: 40, step: 1, value: 12 },
        { id: 'tp', label: 'Time pressure (the same tasks in less time)', min: 0.7, max: 1.5, step: 0.05, value: 1 },
        { id: 'xp', type: 'select', label: 'Experience', options: [['novice', 1.25], ['trained', 1], ['expert', 0.82]], value: 1 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sc', 'Scenario'], ['peak', 'Busiest moment'], ['over', 'Time with a channel over 100 %'], ['warn', 'Time with a channel over 80 %'], ['mean', 'Average load of the busiest channel'], ['v', 'Verdict']]);
      const CH = [['v', 'see'], ['a', 'hear'], ['c', 'think'], ['m', 'respond']];
      function tasks() {
        const S = WL[V.sc], out = [];
        S.tasks.forEach(t => { const d = V.auto && t.auto ? Object.assign({}, t, t.auto) : t; out.push(d); });
        if (V.sc === 'cr') {
          const n = Math.round(V.alarms * (V.auto ? 0.4 : 1));
          for (let i = 0; i < n; i++) { const t0 = 600 * Math.pow((i + 0.5) / Math.max(1, n + 1), 1.8); out.push({ n: 'Alarm', t0, t1: t0 + 30, v: 0.25, a: 0.05, c: 0.35, m: 0.2, alarm: true }); }
        }
        if (V.ex !== 'none') out.push(S.extra[V.ex]);
        return out;
      }
      function draw() {
        const S = WL[V.sc], TT = S.T, ts = tasks(), C = kit.colors();
        ctl.show('alarms', V.sc === 'cr');
        const k = V.tp * V.xp, dt = TT / 600;
        const series = CH.map(() => []);
        let over = 0, warn = 0, peak = { v: 0, t: 0, ch: 'v' }, busiest = [0, 0, 0, 0];
        for (let i = 0; i <= 600; i++) {
          const t = i * dt;
          CH.forEach(([key], j) => {
            let s = 0;
            ts.forEach(q => { if (t >= q.t0 && t < q.t1) s += q[key] * (key === 'v' || key === 'c' ? k : V.tp); });
            series[j].push(s); busiest[j] += s;
            if (s > peak.v) peak = { v: s, t, ch: key };
          });
          const mx = Math.max(series[0][i], series[1][i], series[2][i], series[3][i]);
          if (mx > 1) over++; if (mx > 0.8) warn++;
        }
        const jb = busiest.indexOf(Math.max(...busiest));
        const chName = key => CH.find(c => c[0] === key)[1];
        const active = ts.filter(q => peak.t >= q.t0 && peak.t < q.t1 && q[peak.ch] > 0).map(q => q.alarm ? 'alarms' : q.n.toLowerCase());
        const uniq = [...new Set(active)];
        ro.set('sc', S.name + (V.auto ? ' — ' + S.autoTxt : ''));
        ro.set('peak', Math.round(peak.v * 100) + ' % of "' + chName(peak.ch) + '" at ' + Math.round(peak.t) + ' s (' + uniq.slice(0, 3).join(' + ') + ')');
        const share = f => pctTxt(f, f > 0 && f < 0.1 ? 1 : 0) + ' (' + Math.round(f * TT) + ' s)';
        ro.set('over', share(over / 601));
        ro.set('warn', share(warn / 601));
        ro.set('mean', Math.round(100 * busiest[jb] / 601) + ' % ("' + CH[jb][1] + '")');
        ro.set('v', over > 0 ? 'overload: tasks will be shed, delayed or done badly' : warn / 601 > 0.1 ? 'little reserve: an interruption tips it over' : 'manageable, with reserve for surprises');
        // drawing
        const cx = st.begin(), W = st.W, H = st.H;
        cx.font = '11.5px ' + font();
        const xl = 150, xr = W - 14, X = t => xl + t / TT * (xr - xl);
        const shown = V.sc === 'cr' ? ts.filter(q => !q.alarm) : ts;
        const nAl = ts.length - shown.length;
        const rows = shown.length + (nAl ? 1 : 0), rh = clamp((H * 0.36) / Math.max(1, rows), 10, 20), top = 18;
        kit.label(cx, 'tasks', 8, 8, { size: 11, color: C.muted });
        const tc = q => { const tot = q.v + q.a + q.c + q.m || 1; return C.hue(215 * q.v / tot + 40 * q.a / tot + 280 * q.c / tot + 140 * q.m / tot, 0.75); };
        shown.forEach((q, i) => {
          const y = top + i * rh;
          kit.label(cx, q.n.length > 24 ? q.n.slice(0, 23) + '…' : q.n, xl - 6, y + rh / 2, { align: 'right', size: 10.5, color: q === WL[V.sc].extra[V.ex] ? C.warn : C.text });
          cx.fillStyle = tc(q); cx.fillRect(X(q.t0), y + 2, Math.max(2, X(q.t1) - X(q.t0)), rh - 4);
        });
        if (nAl) {
          const y = top + shown.length * rh;
          kit.label(cx, nAl + ' alarms (30 s each)', xl - 6, y + rh / 2, { align: 'right', size: 10.5, color: C.bad });
          ts.filter(q => q.alarm).forEach(q => { cx.fillStyle = C.hue(0, 0.55); cx.fillRect(X(q.t0), y + 2, Math.max(2, X(q.t1) - X(q.t0)), rh - 4); cx.strokeStyle = C.bg2; cx.lineWidth = 1; cx.strokeRect(X(q.t0), y + 2, Math.max(2, X(q.t1) - X(q.t0)), rh - 4); });
        }
        // the four lanes
        const y0 = top + rows * rh + 16, laneH = (H - y0 - 26) / 4;
        CH.forEach(([key, lab], j) => {
          const yb = y0 + (j + 1) * laneH - 4, yt = yb - laneH + 8, sc = (yb - yt) / 1.5;
          const Yv = v => yb - Math.min(1.5, v) * sc;
          cx.fillStyle = C.surface; cx.fillRect(xl, yt, xr - xl, yb - yt);
          const col = [C.hue(215, 1), C.hue(40, 1), C.hue(280, 1), C.hue(140, 1)][j];
          cx.beginPath(); cx.moveTo(xl, yb);
          series[j].forEach((s, i) => cx.lineTo(X(i * dt), Yv(s)));
          cx.lineTo(xr, yb); cx.closePath(); cx.fillStyle = C.hue([215, 40, 280, 140][j], 0.3); cx.fill();
          cx.beginPath(); series[j].forEach((s, i) => i ? cx.lineTo(X(i * dt), Yv(s)) : cx.moveTo(X(0), Yv(s))); cx.strokeStyle = col; cx.lineWidth = 1.5; cx.stroke();
          // overload in red
          cx.fillStyle = C.hue(0, 0.55);
          series[j].forEach((s, i) => { if (s > 1) cx.fillRect(X(i * dt) - 0.5, Yv(s), Math.max(1, (xr - xl) / 600 + 0.5), Yv(1) - Yv(s)); });
          cx.strokeStyle = C.bad; cx.lineWidth = 1; cx.beginPath(); cx.moveTo(xl, Yv(1)); cx.lineTo(xr, Yv(1)); cx.stroke();
          cx.setLineDash([4, 4]); cx.strokeStyle = C.warn; cx.beginPath(); cx.moveTo(xl, Yv(0.8)); cx.lineTo(xr, Yv(0.8)); cx.stroke(); cx.setLineDash([]);
          kit.label(cx, lab, xl - 6, (yt + yb) / 2 - 6, { align: 'right', size: 12, weight: 600, color: col });
          kit.label(cx, 'peak ' + Math.round(100 * Math.max(...series[j])) + ' %', xl - 6, (yt + yb) / 2 + 8, { align: 'right', size: 10.5, color: C.muted });
          if (j === 0) { kit.label(cx, '100 %', xr - 2, Yv(1) - 7, { align: 'right', size: 10, color: C.bad }); kit.label(cx, '80 %', xr - 40, Yv(0.8) - 7, { align: 'right', size: 10, color: C.warn }); }
        });
        // time axis
        const ya = H - 16, stp = Hyper.niceStep(TT, 8);
        cx.fillStyle = C.muted; cx.textAlign = 'center';
        for (let t = 0; t <= TT + 1e-9; t += stp) cx.fillText(TT >= 300 ? (t / 60).toFixed(t % 60 ? 1 : 0) + ' min' : t + ' s', X(t), ya + 4);
        cx.textAlign = 'left';
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-swiss-cheese */
  Hyper.sim('mt-swiss-cheese', {
    title: 'Layers of defence and the holes in them',
    blurb: `Reason's Swiss-cheese model, made to count. Errors (dots) leave the sharp end on the left; each layer of defence stops most of them, but has holes — drifting slowly up and down as latent conditions come and go. An error that finds a hole in every layer reaches the right-hand side: an accident. The read-outs give the exact numbers from the same model: the chance that an error passes a layer is 1 − (share stopped); with *dependence*, a layer behind a failed one fails too with that probability (the same fatigue, the same wrong drawing, the same trust in a colleague).

**Try this**
- Three independent layers stopping 90 % each: about one error in a thousand gets through. Count the dots for a minute.
- Set the dependence to 30 %: the protection weakens more than tenfold — the layers now fail together.
- Tick *production pressure and maintenance backlog*: the holes triple in size in every layer at once.
- Remove layers one by one, then compare with halving the error probability: design layers usually buy more than exhortation.`,
    mount(box, kit) {
      const U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280, maxH: 460 });
      const NAMES = ['Design: keyed parts, interlocks', 'Procedure and checklist', 'Independent check', 'Alarm and automatic stop', 'Emergency response'];
      const rnd = U.rng(20250928);
      let parts = [], counts = null, emitAcc = 0, flash = 0;
      const resetCounts = () => { counts = { n: 0, stop: [0, 0, 0, 0, 0], through: 0 }; parts = []; };
      resetCounts();
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Error probability per task', min: 0.0001, max: 0.1, value: 0.001, log: true, fmt: v => '1 in ' + Math.round(1 / v) },
        { id: 'N', label: 'Tasks per working day', min: 10, max: 5000, value: 200, log: true, fmt: v => String(Math.round(v)) },
        { id: 'L', label: 'Layers of defence', min: 1, max: 5, step: 1, value: 3 },
        { id: 'd', label: 'Share of errors each layer stops', min: 50, max: 99, step: 1, value: 90, unit: '%' },
        { id: 'beta', label: 'Dependence between layers (common causes)', min: 0, max: 90, step: 5, value: 0, unit: '%' },
        { id: 'latent', type: 'check', label: 'Production pressure and maintenance backlog (latent conditions)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the counts' }] }
      ], id => { if (id === 'reset' || id === 'L' || id === 'd' || id === 'beta' || id === 'latent') resetCounts(); model(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['q', 'An error passes one layer'], ['T', 'An error passes every layer'], ['task', 'Accident chance per task'], ['yr', 'Accidents per year (250 days)'], ['dots', 'Dots so far']]);
      let M = null;
      function model() {
        const L = Math.round(V.L), q0 = 1 - V.d / 100, q = V.latent ? Math.min(0.9, 3 * q0) : q0, b = V.beta / 100;
        const qn = b + (1 - b) * q, T = q * Math.pow(qn, L - 1);
        const perTask = V.p * T, yr = perTask * V.N * 250;
        M = { L, q, qn, T, perTask, yr };
        ro.set('q', pctTxt(q, 1) + (L > 1 && b > 0 ? ' (the next, after a failure: ' + pctTxt(qn, 1) + ')' : ''));
        ro.set('T', T < 1e-4 ? '1 in ' + Math.round(1 / T).toLocaleString('en-GB') : pctTxt(T, 2));
        ro.set('task', perTask > 0 ? '1 in ' + Math.round(1 / perTask).toLocaleString('en-GB') : '—');
        ro.set('yr', yr <= 0 ? '0' : yr >= 1 ? yr.toFixed(1) + ' — one every ' + Math.max(1, Math.round(250 / yr)) + ' working days' : yr.toFixed(yr < 0.1 ? 3 : 2) + ' — one every ' + (1 / yr).toFixed(1) + ' years');
      }
      model();
      // holes: a few gaps per layer, drifting; total open height = q of the plate
      const holeSeeds = [0, 1, 2, 3, 4].map(i => [0, 1, 2].map(j => ({ base: 0.18 + 0.32 * j + 0.08 * ((i * 7 + j * 3) % 5) / 5, w: 0.25 + 0.2 * ((i + j) % 3), ph: i * 1.7 + j * 2.3 })));
      function holes(i, t) {
        const q = M.q, per = q / 3;
        return holeSeeds[i].map(h => { const c = clamp(h.base + 0.1 * Math.sin(h.w * t + h.ph), per / 2 + 0.02, 1 - per / 2 - 0.02); return [c - per / 2, c + per / 2]; });
      }
      const inHole = (i, y, t) => holes(i, t).some(([a, b]) => y >= a && y <= b);
      let geo = null;
      function layout() {
        const W = st.W, H = st.H, x0 = 70, x1 = W - 90, L = M.L, top = 44, bot = H - 40;
        const xs = []; for (let i = 0; i < L; i++) xs.push(x0 + 40 + (x1 - x0 - 80) * (L === 1 ? 0.5 : i / (L - 1)));
        geo = { W, H, x0, x1, xs, top, bot, ph: bot - top };
      }
      const SPEED = () => (geo.x1 - geo.x0) / 3.2;
      function spawn(t) {
        // the fate of this error, from the same model as the read-outs
        let stopAt = M.L;
        for (let i = 0; i < M.L; i++) { const pass = rnd() < (i === 0 ? M.q : M.qn); if (!pass) { stopAt = i; break; } }
        counts.n++;
        const pt = { x: geo.x0 - 10, y: geo.top + geo.ph * (0.1 + 0.8 * rnd()), stopAt, next: 0, done: false, age: 0 };
        aim(pt, t);
        parts.push(pt);
      }
      function aim(pt, t) {
        const i = pt.next;
        if (i >= M.L) { pt.tx = geo.x1 + 40; pt.ty = pt.y; return; }
        const tArr = t + Math.max(0.01, (geo.xs[i] - pt.x) / SPEED());
        let yf = 0.5;
        if (i < pt.stopAt) { const hs = holes(i, tArr), h = hs[Math.floor(rnd() * hs.length) % hs.length]; yf = h[0] + (h[1] - h[0]) * (0.2 + 0.6 * rnd()); }
        else { for (let k = 0; k < 20; k++) { yf = 0.05 + 0.9 * rnd(); if (!inHole(i, yf, tArr)) break; } }
        pt.tx = geo.xs[i]; pt.ty = geo.top + geo.ph * yf;
      }
      const loop = kit.loop((dt, t) => {
        layout();
        // advance
        emitAcc += dt * 7;
        while (emitAcc >= 1) { emitAcc -= 1; spawn(t); }
        const sp = SPEED();
        parts.forEach(pt => {
          pt.age += dt;
          if (pt.done) return;
          const dx = pt.tx - pt.x, dy = pt.ty - pt.y, dist = Math.hypot(dx, dy), step = sp * dt * Math.max(1, dist / Math.max(1e-6, Math.abs(dx)));
          if (dist <= step || dist < 0.5) {
            pt.x = pt.tx; pt.y = pt.ty;
            if (pt.next >= M.L) { pt.done = true; pt.hit = true; counts.through++; flash = 1; pt.age = 0; return; }
            if (pt.next === pt.stopAt) { pt.done = true; counts.stop[pt.next]++; pt.age = 0; return; }
            pt.next++; aim(pt, t);
          } else { pt.x += dx / dist * step; pt.y += dy / dist * step; }
        });
        parts = parts.filter(pt => !pt.done || pt.age < (pt.hit ? 2.5 : 1.2));
        flash = Math.max(0, flash - dt * 1.2);
        // draw
        const c = st.begin(), C = kit.colors(), { W, H, xs, top, bot, ph } = geo;
        c.font = '11.5px ' + font();
        if (flash > 0) { c.fillStyle = C.hue(0, 0.25 * flash); c.fillRect(geo.x1, 0, W - geo.x1, H); }
        kit.label(c, 'errors at the', 8, top - 22, { size: 11, color: C.muted }); kit.label(c, 'sharp end', 8, top - 8, { size: 11, color: C.muted });
        kit.label(c, 'accident', W - 8, top - 16, { size: 12, weight: 600, color: C.bad, align: 'right' });
        xs.forEach((x, i) => {
          const hw = 9;
          c.fillStyle = C.hue(46, 0.55); c.strokeStyle = C.hue(40, 0.9); c.lineWidth = 1.2;
          c.beginPath(); c.roundRect ? c.roundRect(x - hw, top, 2 * hw, ph, 5) : c.rect(x - hw, top, 2 * hw, ph); c.fill(); c.stroke();
          c.fillStyle = C.bg2;
          holes(i, t).forEach(([a, b]) => { const y0 = top + a * ph, y1 = top + b * ph; c.beginPath(); c.ellipse(x, (y0 + y1) / 2, hw * 0.75, Math.max(0.5, (y1 - y0) / 2), 0, 0, 6.283); c.fill(); });
          const nm = NAMES[i], words = nm.split(': ');
          kit.label(c, words[0], x, bot + 14, { size: 10.5, align: 'center', color: C.text });
          if (words[1]) kit.label(c, words[1], x, bot + 27, { size: 10, align: 'center', color: C.muted });
          kit.label(c, 'stopped ' + counts.stop[i], x, top - 10, { size: 10.5, align: 'center', color: C.muted });
        });
        parts.forEach(pt => {
          const col = pt.hit ? C.bad : pt.done ? C.muted : C.hue(20, 0.95);
          const a = pt.done ? Math.max(0, 1 - pt.age / (pt.hit ? 2.5 : 1.2)) : 1;
          c.globalAlpha = a; kit.dot(c, pt.x, pt.y, pt.hit ? 5 : 3, col); c.globalAlpha = 1;
        });
        kit.label(c, 'through: ' + counts.through, W - 8, bot + 14, { size: 12, weight: 600, color: C.bad, align: 'right' });
        ro.set('dots', counts.n + ' errors: ' + counts.stop.slice(0, M.L).join(' + ') + ' stopped, ' + counts.through + ' through');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ mt-takeover */
  const TK_STATE = { monitor: { n: 0.6, a: 1.2, s2: 0.8, s3: 3, name: 'monitoring the road' }, phone: { n: 1.3, a: 2.0, s2: 1.8, s3: 6, name: 'absorbed in a phone' }, drowsy: { n: 2.2, a: 2.6, s2: 2.5, s3: 8, name: 'drowsy' } };
  const TK_HMI = { visual: 2.0, sound: 1.0, haptic: 0.85 };
  Hyper.sim('mt-takeover', {
    title: 'Taking back control from automation',
    blurb: `An automated car cruises in the right-hand lane and meets a lane closure it cannot handle, so it asks the driver to take over (a *take-over request*) a set time before the closure. The driver first has to notice (eyes back on the road), then act (hands on the wheel, foot on the brake), while situation awareness builds up level by level — perceiving the scene, understanding it, projecting what will happen. The car then brakes at 6 m/s², or changes lane if the next lane is free; with too little room it brakes as hard as it can (9 m/s²) or reaches the cones. Driver times are illustrative, in the range reported by simulator studies (typically 2–3.5 s to act, longer when absorbed or drowsy, much longer to understand fully).

**Try this**
- 120 km/h, 7 s budget, a monitoring driver warned by sound: a comfortable take-over. Make the driver absorbed in a phone: the margin shrinks. Drowsy: only an emergency stop saves it — and at 5 s of budget nothing does.
- Warn by a visual icon only: the time to notice doubles.
- Put traffic in the next lane: the lane change is gone and only braking remains.
- Find the shortest budget that works for the phone user at 130 km/h — then compare with the 10 s that the UN rules give drivers of automated lane-keeping cars.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed', min: 60, max: 130, step: 5, value: 120, unit: 'km/h' },
        { id: 'tb', label: 'Time budget: request to lane closure', min: 3, max: 15, step: 0.5, value: 7, unit: 's' },
        { id: 'st', type: 'select', label: 'Driver', options: [['monitoring the road', 'monitor'], ['absorbed in a phone', 'phone'], ['drowsy', 'drowsy']], value: 'phone' },
        { id: 'hmi', type: 'select', label: 'Take-over warning', options: [['visual icon only', 'visual'], ['visual + sound', 'sound'], ['visual + sound + seat vibration', 'haptic']], value: 'sound' },
        { id: 'traffic', type: 'check', label: 'Traffic in the next lane', value: false },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], () => { T0 = null; plan(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['bud', 'Time budget and distance'], ['act', 'Driver notices / acts after'], ['left', 'Distance left when acting'], ['need', 'Distance needed'], ['sa', 'Situation awareness at the action'], ['out', 'Outcome']]);
      let P = null, T0 = null;
      function plan() {
        const S = TK_STATE[V.st], v = V.v / 3.6, D0 = v * V.tb;
        const tn = S.n * TK_HMI[V.hmi], ta = tn + S.a, t2 = tn + S.s2, t3 = tn + S.s3;
        const R = D0 - v * ta, brake6 = v * v / 12, brake9 = v * v / 18, lc = v * 2.5;
        let mode, a = 6, out, margin;
        if (!V.traffic && R >= lc && lc <= brake6) { mode = 'lane'; margin = R - lc; out = 'changes lane with ' + Math.round(margin) + ' m to spare'; }
        else if (R >= brake6) { mode = 'brake'; margin = R - brake6; out = (margin > 20 ? 'stops calmly, ' : 'stops, but only ') + Math.round(margin) + ' m before the cones'; }
        else if (!V.traffic && R >= lc) { mode = 'lane'; margin = R - lc; out = 'a late swerve into the free lane, ' + Math.round(margin) + ' m to spare'; }
        else if (R >= brake9) { mode = 'brake'; a = v * v / (2 * Math.max(1, R - 1)); margin = R - v * v / (2 * a); out = 'emergency stop at ' + a.toFixed(1) + ' m/s² — just in time'; }
        else if (R > 0) { mode = 'brake'; a = 9; margin = R - brake9; const vHit = Math.sqrt(Math.max(0, v * v - 2 * a * R)); out = 'hits the lane closure at ' + Math.round(vHit * 3.6) + ' km/h'; }
        else { mode = 'none'; a = 0; margin = R; out = 'reaches the closure at full speed before acting'; }
        P = { v, D0, tn, ta, t2, t3, R, brake6, brake9, lc, mode, a, out, margin };
        ro.set('bud', V.tb.toFixed(1) + ' s = ' + Math.round(D0) + ' m at ' + V.v + ' km/h');
        ro.set('act', tn.toFixed(1) + ' s / ' + ta.toFixed(1) + ' s (' + S.name + ')');
        ro.set('left', Math.round(R) + ' m');
        ro.set('need', 'braking at 6 m/s²: ' + Math.round(brake6) + ' m; lane change: ' + (V.traffic ? 'blocked' : Math.round(lc) + ' m'));
        const lev = ta >= t3 ? 3 : ta >= t2 ? 2 : ta >= tn ? 1 : 0;
        ro.set('sa', ['none', 'level 1 (sees)', 'level 2 (understands)', 'level 3 (anticipates)'][lev]);
        ro.set('out', out);
      }
      // position along the road (m) and lateral lane position (0 = right lane, 1 = left lane) at time t after the request
      function state(t) {
        const p = P;
        if (t <= p.ta || p.mode === 'none') {
          const x = p.v * t;
          return { x: Math.min(x, p.D0 + 40), lat: 0, sp: p.v, stop: x >= p.D0 && p.mode === 'none' };
        }
        const u = t - p.ta, x0 = p.v * p.ta;
        if (p.mode === 'lane') return { x: x0 + p.v * u, lat: Math.min(1, u / 2.5), sp: p.v };
        const ts = p.v / p.a, uu = Math.min(u, ts), x = x0 + p.v * uu - 0.5 * p.a * uu * uu, sp = Math.max(0, p.v - p.a * uu);
        if (x >= p.D0 && p.margin < 0) { return { x: p.D0, lat: 0, sp: 0, crash: true }; }
        return { x, lat: 0, sp };
      }
      plan();
      const loop = kit.loop((dt, tt) => {
        if (T0 == null) T0 = tt;
        const t = Math.min(tt - T0, Math.max(V.tb + 6, P.ta + P.v / Math.max(1, P.a) + 2));
        const s = state(t), c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '11.5px ' + font();
        // the road, from the request point to beyond the closure
        const xl = 20, xr = W - 20, span = P.D0 + 60, X = m => xl + m / span * (xr - xl);
        const roadTop = 34, laneW = 34, yR = roadTop + 1.5 * laneW, yL = roadTop + 0.5 * laneW;
        c.fillStyle = C.surface; c.fillRect(0, roadTop, W, 2 * laneW);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(0, roadTop); c.lineTo(W, roadTop); c.moveTo(0, roadTop + 2 * laneW); c.lineTo(W, roadTop + 2 * laneW); c.stroke();
        c.setLineDash([14, 12]); c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, roadTop + laneW); c.lineTo(W, roadTop + laneW); c.stroke(); c.setLineDash([]);
        // closure: cones across the right lane
        for (let k = 0; k < 7; k++) { const cxp = X(P.D0) + k * 7, cy = yR + laneW * 0.4 - k * laneW * 0.12; c.fillStyle = C.hue(25, 1); c.beginPath(); c.moveTo(cxp, cy - 7); c.lineTo(cxp - 4, cy + 4); c.lineTo(cxp + 4, cy + 4); c.closePath(); c.fill(); }
        kit.label(c, 'lane closed', X(P.D0) + 4, roadTop + 2 * laneW + 12, { size: 11, color: C.warn });
        kit.label(c, 'take-over request', X(0), roadTop - 12, { size: 11, color: C.accent });
        c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), roadTop - 4); c.lineTo(X(0), roadTop + 2 * laneW); c.stroke();
        // where the driver acts
        const xa = P.v * P.ta;
        if (xa < span) { c.strokeStyle = C.ok; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(xa), roadTop); c.lineTo(X(xa), roadTop + 2 * laneW); c.stroke(); c.setLineDash([]); kit.label(c, 'driver acts', X(xa), roadTop + 2 * laneW + 12, { size: 11, color: C.ok, align: 'center' }); }
        // traffic in the next lane
        if (V.traffic) { const ox = P.v * 0.97 * t + 18; drawCar(c, X(Math.min(span, ox)), yL, C.muted, C); }
        // own car
        const y = yR - s.lat * laneW, sx = Math.min(s.x, span);
        drawCar(c, X(sx), y, s.crash ? C.bad : C.hue(215, 1), C);
        kit.label(c, (s.sp * 3.6).toFixed(0) + ' km/h', X(sx), y - 16, { size: 11, align: 'center', bg: C.bg2 });
        // timeline with SA levels
        const tl0 = 150, tl1 = W - 20, Tmax = Math.max(V.tb, P.t3, P.ta) + 1.5, TX = u => tl0 + u / Tmax * (tl1 - tl0);
        const rows = [['Take-over request', 0, null, C.accent], ['Eyes on the road', P.tn, null, C.text], ['Hands on, acting', P.ta, null, C.ok], ['SA 1: perceives the scene', P.tn, P.tn + 0.6, C.hue(215, 1)], ['SA 2: understands it', P.tn + 0.6, P.t2, C.hue(260, 1)], ['SA 3: anticipates', P.t2, P.t3, C.hue(300, 1)]];
        const y0 = roadTop + 2 * laneW + 34, rh = Math.max(16, (H - y0 - 30) / rows.length);
        rows.forEach(([lab, a, b, col], i) => {
          const yy = y0 + i * rh + rh / 2;
          kit.label(c, lab, tl0 - 8, yy, { size: 11, align: 'right', color: C.text });
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(tl0, yy); c.lineTo(tl1, yy); c.stroke();
          if (b == null) { if (t >= a) kit.dot(c, TX(a), yy, 5, col); else kit.dot(c, TX(a), yy, 5, C.bg2, col); kit.label(c, a.toFixed(1) + ' s', TX(a) + 8, yy, { size: 10.5, color: C.muted }); }
          else { const fill = clamp((t - a) / Math.max(0.01, b - a), 0, 1); c.fillStyle = C.faint; c.fillRect(TX(a), yy - 5, TX(b) - TX(a), 10); c.fillStyle = col; c.fillRect(TX(a), yy - 5, (TX(b) - TX(a)) * fill, 10); kit.label(c, 'by ' + b.toFixed(1) + ' s', TX(b) + 6, yy, { size: 10.5, color: C.muted }); }
        });
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(TX(V.tb), y0); c.lineTo(TX(V.tb), y0 + rows.length * rh); c.stroke();
        kit.label(c, 'closure reached at full speed', TX(V.tb), y0 + rows.length * rh + 10, { size: 10.5, color: C.warn, align: 'center' });
        c.strokeStyle = C.text; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(TX(Math.min(t, Tmax)), y0 - 6); c.lineTo(TX(Math.min(t, Tmax)), y0 + rows.length * rh); c.stroke(); c.setLineDash([]);
        kit.label(c, 't = ' + t.toFixed(1) + ' s', 8, H - 12, { size: 11, color: C.muted });
        if (s.crash) kit.label(c, 'collision with the lane closure', W / 2, roadTop - 14, { size: 12.5, weight: 600, color: C.bad, align: 'center', bg: C.bg2 });
      }, box.stage);
      function drawCar(c, x, y, col, C) {
        c.fillStyle = col; c.beginPath(); c.roundRect ? c.roundRect(x - 14, y - 7, 28, 14, 4) : c.rect(x - 14, y - 7, 28, 14); c.fill();
        c.fillStyle = C.bg2; c.fillRect(x + 3, y - 5, 6, 10);
      }
      loop.start();
    }
  });

  /* ================================================================ mt-decision */
  Hyper.sim('mt-decision', {
    title: 'Deciding against the clock',
    blurb: `Each line is one decision, modelled as evidence that wanders (a random walk) and drifts towards the right answer until it reaches a boundary: the top one is the right choice, the bottom one the wrong one. The **drift rate** is the quality of the evidence (a clear display, a practised pattern); the **distance between the boundaries** is the caution; the **noise** grows with stress and distraction. A **deadline** forces a guess on whatever evidence there is. About 0.3 s for seeing and moving is added to every decision. The right-hand panel collects the reaction times of correct (up) and wrong (down) decisions.

**Try this**
- Lower the caution from 0.12 to 0.06: decisions come twice as fast and the errors double.
- Set a 0.6 s deadline, then 0.4 s: forced guesses appear on the line and the error rate climbs.
- Now raise the quality of the evidence to 0.4: faster *and* more accurate — the only way to have both.
- Raise the noise (stress): the same person with the same caution errs more.`,
    mount(box, kit) {
      const U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300, maxH: 480 });
      const Ter = 0.3, DT = 0.002, BW = 0.05, NB = 50;
      let rnd = U.rng(77), traces = [], stats = null;
      const reset = () => { traces = []; stats = { n: 0, err: 0, forced: 0, sumRT: 0, hc: new Array(NB).fill(0), he: new Array(NB).fill(0) }; };
      reset();
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Quality of the evidence (drift rate, per second)', min: 0.05, max: 0.5, step: 0.01, value: 0.2 },
        { id: 'a', label: 'Caution (distance between the boundaries)', min: 0.04, max: 0.2, step: 0.005, value: 0.12 },
        { id: 's', label: 'Noise (stress, distraction)', min: 0.07, max: 0.16, step: 0.005, value: 0.1 },
        { id: 'dl', type: 'select', label: 'Deadline for the response', options: [['none', 0], ['1.0 s', 1.0], ['0.6 s', 0.6], ['0.4 s', 0.4]], value: 0 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Clear the results' }, { id: 'pause', label: 'Pause / run' }] }
      ], id => { if (id === 'pause') { loop.toggle(); return; } reset(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['model', 'Model, no deadline'], ['sim', 'Simulated decisions'], ['forced', 'Forced by the deadline'], ['what', 'In words']]);
      const gauss = () => { let u = 0; while (u === 0) u = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rnd()); };
      function trial() {
        const a = V.a, v = V.v, s = V.s, tmax = V.dl > 0 ? Math.max(0.02, V.dl - Ter) : 4;
        let x = a / 2, t = 0;
        const pts = [[0, x]], sq = s * Math.sqrt(DT);
        let k = 0;
        while (x > 0 && x < a && t < tmax) { x += v * DT + sq * gauss(); t += DT; if (++k % 5 === 0) pts.push([t, x]); }
        let ok, forced = false;
        if (x >= a) ok = true; else if (x <= 0) ok = false; else { forced = true; ok = x > a / 2 || (x === a / 2 && rnd() < 0.5); }
        pts.push([t, clamp(x, 0, a)]);
        return { pts, t, ok, forced };
      }
      const loop = kit.loop((dt) => {
        if (dt > 0) for (let i = 0; i < 3; i++) {
          const r = trial(), rt = r.t + Ter, b = Math.min(NB - 1, Math.floor(rt / BW));
          stats.n++; stats.sumRT += rt; if (!r.ok) stats.err++; if (r.forced) stats.forced++;
          (r.ok ? stats.hc : stats.he)[b]++;
          traces.push(r); if (traces.length > 40) traces.shift();
        }
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '11.5px ' + font();
        const a = V.a, v = V.v, s = V.s, z = v * a / (s * s);
        const pe = 1 / (1 + Math.exp(z)), md = v > 0 ? a / (2 * v) * Math.tanh(z / 2) : 0;
        ro.set('model', 'errors ' + pctTxt(pe) + ', decision ' + md.toFixed(2) + ' s, reaction ≈ ' + (md + Ter).toFixed(2) + ' s');
        ro.set('sim', stats.n ? stats.n + ' decisions: ' + pctTxt(stats.err / stats.n) + ' wrong, mean reaction ' + (stats.sumRT / stats.n).toFixed(2) + ' s' : '—');
        ro.set('forced', V.dl > 0 && stats.n ? pctTxt(stats.forced / stats.n, 0) + ' of decisions were guesses at the deadline' : 'no deadline');
        ro.set('what', pe > 0.15 || (stats.n > 30 && stats.err / stats.n > 0.15) ? 'fast but error-prone: more caution or better evidence needed' : md + Ter > 0.9 ? 'accurate but slow' : 'a reasonable balance');
        // traces
        const x0 = 46, x1 = W * 0.62, yc = H / 2, half = (H / 2 - 30) / 0.11;
        const Tshow = V.dl > 0 ? V.dl - Ter + 0.05 : clamp(3 * md + 0.2, 0.4, 3);
        const X = t => x0 + t / Tshow * (x1 - x0), Y = e => yc - (e - a / 2) * half;
        c.fillStyle = C.hue(140, 0.12); c.fillRect(x0, Y(a) - 14, x1 - x0, 14);
        c.fillStyle = C.hue(0, 0.12); c.fillRect(x0, Y(0), x1 - x0, 14);
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(x0, Y(a)); c.lineTo(x1, Y(a)); c.stroke();
        c.strokeStyle = C.bad; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x1, Y(0)); c.stroke();
        kit.label(c, 'right answer', x0 + 4, Y(a) - 8, { size: 11, color: C.ok });
        kit.label(c, 'wrong answer', x0 + 4, Y(0) + 8, { size: 11, color: C.bad });
        kit.label(c, 'start', x0 - 6, Y(a / 2), { size: 10.5, align: 'right', color: C.muted });
        traces.forEach((r, i) => {
          const age = (traces.length - 1 - i) / Math.max(1, traces.length - 1);
          c.globalAlpha = 0.15 + 0.85 * (1 - age);
          c.strokeStyle = r.forced ? C.warn : r.ok ? C.hue(215, 1) : C.bad; c.lineWidth = i === traces.length - 1 ? 1.8 : 1;
          c.beginPath(); r.pts.forEach(([t, e], j) => { const px = X(Math.min(t, Tshow)), py = Y(e); j ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke();
          c.globalAlpha = 1;
        });
        if (V.dl > 0) { const xd = X(V.dl - Ter); c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xd, Y(a) - 16); c.lineTo(xd, Y(0) + 16); c.stroke(); c.setLineDash([]); kit.label(c, 'deadline', xd, Y(0) + 24, { size: 11, align: 'center', color: C.warn }); }
        c.fillStyle = C.muted; c.textAlign = 'center';
        const stp = Hyper.niceStep(Tshow, 5);
        for (let t = 0; t <= Tshow + 1e-9; t += stp) c.fillText(t.toFixed(stp < 0.1 ? 2 : 1), X(t), H - 10);
        c.textAlign = 'left';
        kit.label(c, 'decision time (s), after ' + Ter + ' s of seeing and moving', x0, 14, { size: 11, color: C.muted });
        // histograms of reaction time
        const hx0 = W * 0.68, hx1 = W - 12, hy = H / 2, hH = H / 2 - 36;
        const mx = Math.max(1, ...stats.hc, ...stats.he), bw = (hx1 - hx0) / 40;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(hx0, hy); c.lineTo(hx1, hy); c.stroke();
        for (let b = 0; b < 40; b++) {
          const hc = stats.hc[b] / mx * hH, he = stats.he[b] / mx * hH;
          if (hc > 0) { c.fillStyle = C.hue(215, 0.8); c.fillRect(hx0 + b * bw, hy - hc, bw - 1, hc); }
          if (he > 0) { c.fillStyle = C.hue(0, 0.8); c.fillRect(hx0 + b * bw, hy, bw - 1, he); }
        }
        kit.label(c, 'correct', hx0, 16, { size: 11, color: C.hue(215, 1) });
        kit.label(c, 'wrong', hx0, H - 26, { size: 11, color: C.bad });
        c.fillStyle = C.muted; c.textAlign = 'center';
        for (let t = 0; t <= 2; t += 0.5) c.fillText(t.toFixed(1), hx0 + t / BW * bw, H - 10);
        c.textAlign = 'left';
        kit.label(c, 'reaction time (s)', hx1, H - 26, { size: 10.5, align: 'right', color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ mt-usability-test */
  Hyper.sim('mt-usability-test', {
    title: 'How many test users find the problems?',
    blurb: `A product hides 30 usability problems (rows), from ones nearly everybody meets to ones few meet. Each column is one test user; a dot means that user ran into that problem. Problems in the second half of the task (lower rows) can only be met by users who get past the three **blocking** problems (■) near the start — a user stuck at a blocker never sees what lies behind it. With *fix between rounds*, everything found in a round is fixed before the next. The graph compares the problems found with the classic model $F = 1 - (1 - L)^n$.

**Try this**
- Press *1 round of 15*, then *3 rounds of 5*: the same fifteen users, but the iterative plan uncovers far more of the second-half problems, because the blockers are fixed after the first round.
- Untick *blocking problems*: now the two plans find about the same — the classic curve holds.
- Lower the share each user meets to 10 % (a complex product, a diverse audience): five users are no longer enough.
- Press *Another sample of users* a few times: small tests vary a lot.`,
    mount(box, kit) {
      const U = Hyper.util;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320, maxH: 520 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'test users so far', min: 0 }, y: { label: 'problems found (of 30)', min: 0, max: 30 }, legend: true }, 180);
      const NP = 30, BLOCK = [0, 1, 2];
      // relative detectability of each problem (mean 1): a few common, many rare
      const REL = []; for (let i = 0; i < NP; i++) REL.push(0.25 + 1.5 * Math.pow(1 - (i % 15) / 15, 2.2));
      const mRel = REL.reduce((s, x) => s + x, 0) / NP; for (let i = 0; i < NP; i++) REL[i] /= mRel;
      let seed = 1;
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Share of the problems one user meets (average)', min: 5, max: 60, step: 1, value: 31, unit: '%' },
        { id: 'n', label: 'Users per round', min: 1, max: 15, step: 1, value: 5 },
        { id: 'R', label: 'Rounds', min: 1, max: 4, step: 1, value: 3 },
        { id: 'fix', type: 'check', label: 'Fix what was found between rounds', value: true },
        { id: 'blk', type: 'check', label: 'Blocking problems hide the second half of the task', value: true },
        { type: 'buttons', items: [{ id: 'one', label: '1 round of 15' }, { id: 'three', label: '3 rounds of 5', primary: true }, { id: 'seed', label: 'Another sample of users' }] }
      ], id => {
        if (id === 'one') { ctl.set('n', 15); ctl.set('R', 1); }
        if (id === 'three') { ctl.set('n', 5); ctl.set('R', 3); ctl.set('fix', true); }
        if (id === 'seed') seed++;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['plan', 'Test plan'], ['found', 'Problems found'], ['deep', 'Found in the second half'], ['left', 'Left in the product'], ['model', 'Classic model F = 1 − (1 − L)ⁿ']]);
      function run() {
        const r = U.rng(seed * 104729 + 7), L = V.L / 100, n = Math.round(V.n), R = Math.round(V.R);
        const p = REL.map(x => clamp(L * x, 0, 0.9));
        const fixed = new Array(NP).fill(-1), found = new Array(NP).fill(-1), hits = [], curve = [[0, 0]];
        let nf = 0, users = 0;
        for (let rd = 0; rd < R; rd++) {
          for (let u = 0; u < n; u++) {
            const col = [];
            const blockedBy = V.blk ? BLOCK.filter(b => fixed[b] < 0 && r() < p[b]) : [];
            for (let i = 0; i < NP; i++) {
              if (fixed[i] >= 0) { col.push(0); continue; }
              let hit;
              if (BLOCK.includes(i)) hit = blockedBy.includes(i);
              else if (i >= 15 && blockedBy.length) { r(); hit = false; }
              else hit = r() < p[i];
              col.push(hit ? 1 : 0);
              if (hit && found[i] < 0) { found[i] = users; nf++; }
            }
            hits.push({ col, rd }); users++;
            curve.push([users, nf]);
          }
          if (V.fix) for (let i = 0; i < NP; i++) if (found[i] >= 0 && fixed[i] < 0) fixed[i] = rd + 1;
        }
        return { p, fixed, found, hits, curve, nf, users, n, R };
      }
      function draw() {
        const S = run(), C = kit.colors(), L = V.L / 100;
        const deep = S.found.filter((f, i) => i >= 15 && f >= 0).length;
        ro.set('plan', S.R + ' round' + (S.R > 1 ? 's' : '') + ' of ' + S.n + ' = ' + S.users + ' users' + (S.R > 1 && V.fix ? ', fixing between rounds' : ''));
        ro.set('found', S.nf + ' of 30 (' + pctTxt(S.nf / 30, 0) + ')');
        ro.set('deep', deep + ' of 15');
        ro.set('left', (30 - S.nf) + ' never found — they ship with the product');
        ro.set('model', pctTxt(1 - Math.pow(1 - L, S.users), 0) + ' for ' + S.users + ' users (' + pctTxt(1 - Math.pow(1 - L, 5), 0) + ' for 5)');
        const model = []; for (let k = 0; k <= S.users; k++) model.push([k, 30 * (1 - Math.pow(1 - L, k))]);
        plot.set({ x: { label: 'test users so far', min: 0, max: Math.max(1, S.users) }, series: [{ pts: S.curve, label: 'found in this test', color: C.accent, width: 2 }, { pts: model, label: 'classic model', color: C.muted, dash: [5, 4], width: 1.5 }], vlines: S.R > 1 ? Array.from({ length: S.R - 1 }, (_, k) => ({ x: (k + 1) * S.n, label: 'fix' })) : [] });
        // the matrix
        const c = st.begin(), W = st.W, H = st.H;
        c.font = '11px ' + font();
        const xl = 118, top = 26, rh = (H - top - 14) / NP, gapR = 10, cw = Math.min(26, (W - xl - 16 - gapR * (S.R - 1)) / Math.max(1, S.users));
        const colX = (u, rd) => xl + u * cw + rd * gapR + cw / 2;
        kit.label(c, 'problems', 8, 12, { size: 11, color: C.muted });
        for (let rd = 0; rd < S.R; rd++) kit.label(c, 'round ' + (rd + 1), colX(rd * S.n, rd) - cw / 2, 12, { size: 11, color: C.muted });
        for (let i = 0; i < NP; i++) {
          const y = top + i * rh + rh / 2, f = S.found[i] >= 0;
          if (i === 15) { c.strokeStyle = C.axis; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(8, y - rh / 2); c.lineTo(W - 8, y - rh / 2); c.stroke(); c.setLineDash([]); }
          const lab = (BLOCK.includes(i) ? '■ ' : '') + (i < 15 ? 'first half ' : 'second half ') + (i % 15 + 1);
          kit.label(c, lab, xl - 40, y, { size: Math.min(10.5, rh * 0.9), align: 'right', color: f ? C.ok : C.muted });
          c.fillStyle = C.hue(0, 0.5 + 0.4 * S.p[i]); c.fillRect(xl - 36, y - 2, Math.max(1, 30 * S.p[i]), 4);
          S.hits.forEach((h, u) => {
            const x = colX(u, h.rd);
            if (S.fixed[i] >= 0 && S.fixed[i] <= h.rd) { c.fillStyle = C.faint; c.fillRect(x - cw * 0.3, y - 0.5, cw * 0.6, 1); return; }
            if (h.col[i]) kit.dot(c, x, y, Math.max(1.5, Math.min(4, rh * 0.32)), S.found[i] === u ? C.accent : C.hue(215, 0.7));
            else { c.fillStyle = C.grid; c.fillRect(x - 1, y - 1, 2, 2); }
          });
        }
        kit.label(c, 'bars: how often a user meets it', 8, H - 6, { size: 10, color: C.muted });
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-legibility */
  const LG_TEXT = [['Platform 3 →', 'Platform 3 →'], ['EMERGENCY STOP', 'EMERGENCY STOP'], ['Close valve V12 before opening', 'Close valve V12 before opening'], ['EXIT', 'EXIT'], ['Max. load 500 kg', 'Max. load 500 kg']];
  Hyper.sim('mt-legibility', {
    title: 'How far away can it be read?',
    blurb: `A label or sign seen from a chosen distance. On the left an impression of it: the letters are drawn at their true visual angle (scaled so that 20′ of arc is about 44 pixels) and blurred to the reader's eyesight, contrast and light. The model: a reader with normal acuity just recognises capitals at 5′ of arc (the eye-chart threshold); quick, comfortable reading needs about 3.5 times that, near the 16–22′ of ISO 9241-303. Lower acuity, contrast or light raise both thresholds. On the right: the character height needed at each distance by the common rules, and this label's point.

**Try this**
- 30 mm capitals: find the distance where they stop being comfortable for a young reader in good light, then for an older reader (6/9, 20/30 vision) in dim light.
- Switch to low contrast (grey on grey): the legible distance shrinks as much as halving the letter height.
- Put the reader in a car at 50 km/h: see how few seconds the sign stays legible, and how much bigger it must be for long messages.
- Compare the ADA line with the 20′ line: accessible signs are almost twice as big.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240, maxH: 400 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'viewing distance (m)', min: 0.3, max: 60, log: true }, y: { label: 'capital height (mm)', min: 1, max: 1000, log: true }, legend: true }, 210);
      const ctl = kit.controls(box.side, [
        { id: 'txt', type: 'select', label: 'Text', options: LG_TEXT, value: LG_TEXT[0][1] },
        { id: 'h', label: 'Capital height', min: 2, max: 400, value: 30, log: true, sig: 2, unit: 'mm' },
        { id: 'D', label: 'Viewing distance', min: 0.3, max: 60, value: 6, log: true, sig: 2, unit: 'm' },
        { id: 'acu', type: 'select', label: 'Reader\'s eyesight', options: [['normal (6/6, 20/20)', 1], ['older reader (6/9, 20/30)', 0.67], ['low vision (6/18, 20/60)', 0.33]], value: 1 },
        { id: 'con', type: 'select', label: 'Contrast', options: [['high (black on white)', 1], ['medium (about 3 : 1)', 0.8], ['low (grey on grey)', 0.55]], value: 1 },
        { id: 'lux', type: 'select', label: 'Light', options: [['good', 1], ['dim', 0.8], ['night, lit sign', 0.65]], value: 1 },
        { id: 'v', label: 'Reader moving at', min: 0, max: 120, step: 5, value: 0, unit: 'km/h' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ang', 'Visual angle of a capital'], ['verdict', 'For this reader'], ['dist', 'Legible up to'], ['need', 'Height for comfortable reading here'], ['rules', 'Rules at this distance'], ['move', 'Moving reader']]);
      const MIN = Math.PI / 10800;
      const angOf = (h, D) => 2 * Math.atan(h / (2 * D)) / MIN;            // arcmin; h, D in the same units
      const hFor = (a, D) => 2 * D * Math.tan(a * MIN / 2);
      function draw() {
        const C = kit.colors(), Veff = V.acu * V.con * V.lux, ath = 5 / Veff, acf = 3.5 * ath;
        const hm = V.h / 1000, a = angOf(hm, V.D);
        const Dth = hm / (2 * Math.tan(ath * MIN / 2)), Dcf = hm / (2 * Math.tan(acf * MIN / 2));
        ro.set('ang', a.toFixed(1) + '′ of arc (legibility ratio ' + Math.round(V.D * 1000 / V.h) + ')');
        ro.set('verdict', a >= acf ? 'comfortable at a glance' : a >= ath ? 'readable with effort (' + Math.round(acf) + '′ needed for comfort)' : 'not legible (' + ath.toFixed(1) + '′ needed even to make it out)');
        ro.set('dist', 'comfortably ' + kit.fmt(Dcf, 2) + ' m; with effort ' + kit.fmt(Dth, 2) + ' m');
        ro.set('need', Math.round(hFor(acf, V.D) * 1000) + ' mm for this reader and light');
        const ada = V.D <= 1.83 ? 16 : 16 + 3.2 * (V.D - 1.83) / 0.305;
        ro.set('rules', '20′: ' + Math.round(hFor(20, V.D) * 1000) + ' mm · ADA sign: ' + Math.round(ada) + ' mm · road sign: ' + Math.round(V.D * 1000 / 360) + ' mm');
        const Dm = 10;
        ro.set('move', V.v > 0 ? (Dcf > Dm ? 'legible for ' + ((Dcf - Dm) / (V.v / 3.6)).toFixed(1) + ' s before it leaves the view (at ' + Dm + ' m)' : 'never comfortably legible before it passes') : 'standing still');
        // the curves
        const Ds = []; for (let k = 0; k <= 60; k++) Ds.push(0.3 * Math.pow(200, k / 60));
        plot.set({
          series: [
            { pts: Ds.map(D => [D, hFor(16, D) * 1000]), label: '16′ (minimum)', color: C.muted, dash: [4, 4], width: 1.2 },
            { pts: Ds.map(D => [D, hFor(20, D) * 1000]), label: '20′ (preferred)', color: C.hue(215, 1), width: 2 },
            { pts: Ds.map(D => [D, D <= 1.83 ? 16 : 16 + 3.2 * (D - 1.83) / 0.305]), label: 'ADA signs', color: C.hue(280, 1), width: 2 },
            { pts: Ds.map(D => [D, D * 1000 / 360]), label: 'road signs (30 ft/in)', color: C.hue(40, 1), width: 1.5, dash: [6, 3] },
            { pts: Ds.map(D => [D, hFor(acf, D) * 1000]), label: 'this reader, comfortable', color: C.ok, width: 1.5 }
          ],
          marks: [{ x: V.D, y: V.h, label: V.h.toFixed(0) + ' mm at ' + kit.fmt(V.D, 2) + ' m', color: a >= acf ? C.ok : a >= ath ? C.warn : C.bad }]
        });
        // the impression
        const c = st.begin(), W = st.W, H = st.H, s = 2.2;
        c.font = '12px ' + font();
        const px = clamp(a * s, 2, H * 0.4);
        const sw = W * 0.9, sh = clamp(px * 2.2, 26, H * 0.62), sx = (W - sw) / 2, sy = 24;
        c.fillStyle = '#f2f1ea'; c.strokeStyle = '#9a9a90'; c.lineWidth = 1;
        c.fillRect(sx, sy, sw, sh); c.strokeRect(sx, sy, sw, sh);
        const fg = V.con >= 1 ? '#111111' : V.con >= 0.8 ? '#5d5d5d' : '#a4a39c';
        const dim = V.lux >= 1 ? 0 : V.lux >= 0.8 ? 0.25 : 0.45;
        const blur = Math.min(30, 0.9 * s / Veff);
        c.save();
        c.beginPath(); c.rect(sx, sy, sw, sh); c.clip();
        c.filter = 'blur(' + blur.toFixed(1) + 'px)';
        c.fillStyle = fg; c.textAlign = 'center'; c.textBaseline = 'middle';
        c.font = '700 ' + (px / 0.72).toFixed(1) + 'px ' + font();
        c.fillText(V.txt, W / 2, sy + sh / 2);
        c.filter = 'none';
        if (dim > 0) { c.fillStyle = 'rgba(0,0,0,' + dim + ')'; c.fillRect(sx, sy, sw, sh); }
        c.restore();
        kit.label(c, 'impression at ' + kit.fmt(V.D, 2) + ' m (' + a.toFixed(0) + '′ of arc; an impression, not a vision test)', sx, 12, { size: 11, color: C.muted });
        // the geometry below: eye, distance, letter
        const yb = H - 26, x0 = 40, x1 = W - 40;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb); c.stroke();
        kit.dot(c, x0, yb, 5, C.text);
        const hh = clamp(a / 60 * 30, 3, 40);
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath(); c.moveTo(x1, yb); c.lineTo(x1, yb - hh); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(x0, yb); c.lineTo(x1, yb - hh); c.stroke(); c.setLineDash([]);
        kit.label(c, 'eye', x0, yb + 13, { size: 11, align: 'center', color: C.muted });
        kit.label(c, kit.fmt(V.D, 2) + ' m', (x0 + x1) / 2, yb + 13, { size: 11, align: 'center', color: C.muted });
        kit.label(c, V.h.toFixed(0) + ' mm', x1, yb - hh - 10, { size: 11, align: 'right', color: C.accent });
        kit.label(c, 'angle ' + a.toFixed(1) + '′', x0 + 30, yb - 10, { size: 11, color: C.text });
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-seat-vibration */
  // illustrative floor spectra: [frequency Hz, frequency-weighted r.m.s. m/s²] — a few dominant components
  const SV_VEH = {
    car: { name: 'Car on a motorway', lines: [[1.3, 0.2], [3, 0.1], [12, 0.12]] },
    truck: { name: 'Truck on a motorway', lines: [[1.8, 0.3], [3.5, 0.2], [10, 0.15]] },
    tractor: { name: 'Tractor in a field', lines: [[2, 0.6], [3.5, 0.35], [7, 0.2]] },
    forklift: { name: 'Forklift on an uneven floor', lines: [[3, 0.3], [6, 0.5], [12, 0.3]] },
    loader: { name: 'Wheel loader on a site', lines: [[2.5, 0.5], [4.5, 0.5], [8, 0.3]] }
  };
  const transm = (f, fn, z) => { const r = f / fn, q = 2 * z * r; return Math.sqrt((1 + q * q) / ((1 - r * r) * (1 - r * r) + q * q)); };
  Hyper.sim('mt-seat-vibration', {
    title: 'A seat on a shaking floor',
    blurb: `A driver's seat on a vibrating cab floor, modelled as a mass on a spring and damper driven by the floor (the motion is exaggerated). The floor's vibration is an illustrative spectrum of three dominant frequencies, with frequency-weighted magnitudes of the order reported for such vehicles. The graph shows the seat's transmissibility against frequency — above 1 it amplifies, below 1 it isolates — with the vehicle's frequencies marked and the 4–8 Hz band where the seated body is most sensitive. The traces show the floor and seat accelerations; the read-outs give the SEAT value and the daily exposure A(8) against the EU action and limit values.

**Try this**
- Forklift, foam cushion only: the seat's 4 Hz resonance sits on the forklift's vibration — SEAT above 100 %. Switch to a suspension seat at 1.8 Hz.
- Now the tractor with the same suspension seat: its 2 Hz pitching is amplified. Lower the natural frequency or raise the damping.
- Raise the damping ratio from 0.1 to 0.6: the resonance peak falls, but the isolation at high frequencies gets worse.
- Wheel loader, 8 hours, foam cushion: A(8) passes even the EU limit value. With the suspension seat at 1.8 Hz it is just above the action value; how low must the natural frequency go? (The model leaves out end stops and fore-and-aft and sideways vibration, which is why real seats cannot go much below about 1.5 Hz.)`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280, maxH: 440 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'frequency (Hz)', min: 0.5, max: 20, log: true }, y: { label: 'transmissibility (seat ÷ floor)', min: 0, max: 3 }, legend: true }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.keys(SV_VEH).map(k => [SV_VEH[k].name, k]), value: 'forklift' },
        { id: 'seat', type: 'select', label: 'Seat', options: [['foam cushion only (resonance near 4 Hz)', 'foam'], ['suspension seat (set below)', 'susp']], value: 'foam' },
        { id: 'fn', label: 'Natural frequency of the suspension', min: 1.3, max: 3.5, step: 0.05, value: 1.8, unit: 'Hz' },
        { id: 'z', label: 'Damping ratio', min: 0.1, max: 0.6, step: 0.01, value: 0.3 },
        { id: 'hrs', label: 'Hours a day on the vehicle', min: 0.5, max: 10, step: 0.5, value: 6, unit: 'h' }
      ], () => { update(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['floor', 'Floor (weighted)'], ['seatA', 'Seat (weighted)'], ['seat', 'SEAT value'], ['a8', 'Daily exposure A(8)'], ['time', 'Time to reach the action value']]);
      let P = null, sim = null, buf = [];
      const par = () => V.seat === 'foam' ? { fn: 4, z: 0.2 } : { fn: V.fn, z: V.z };
      function update() {
        ctl.show('fn', V.seat === 'susp'); ctl.show('z', V.seat === 'susp');
        const veh = SV_VEH[V.veh], p = par(), C = kit.colors();
        const af = Math.sqrt(veh.lines.reduce((s, [, a]) => s + a * a, 0)), as = Math.sqrt(veh.lines.reduce((s, [f, a]) => s + Math.pow(transm(f, p.fn, p.z) * a, 2), 0));
        const a8 = E.a8([[as, V.hrs]]), L = E.VIBRATION_LIMITS;
        P = { veh, p, af, as, a8 };
        ro.set('floor', af.toFixed(2) + ' m/s²');
        ro.set('seatA', as.toFixed(2) + ' m/s²');
        ro.set('seat', pctTxt(as / af, 0) + (as > af ? ' — the seat makes it worse' : ' — the seat helps'));
        ro.set('a8', a8.toFixed(2) + ' m/s² for ' + V.hrs + ' h' + (a8 > L.wholeBodyLimit ? ' — above the EU limit value (1.15)' : a8 > L.wholeBodyAction ? ' — above the EU action value (0.5)' : ' — below the EU action value (0.5)'));
        ro.set('time', as > 0 ? (8 * Math.pow(L.wholeBodyAction / as, 2)).toFixed(1) + ' h a day' : '—');
        const pts = []; for (let k = 0; k <= 120; k++) { const f = 0.5 * Math.pow(40, k / 120); pts.push([f, transm(f, p.fn, p.z)]); }
        plot.set({ series: [{ pts, label: V.seat === 'foam' ? 'foam cushion' : 'suspension seat', color: C.accent, width: 2 }, { pts: [[4, 0.02], [8, 0.02]], label: '4–8 Hz: most sensitive', color: C.warn, width: 6 }], hlines: [{ y: 1, label: 'T = 1' }], vlines: veh.lines.map(([f, a]) => ({ x: f, label: f + ' Hz (' + a + ')' })) });
        // reset the oscillator
        sim = { y: 0, yd: 0, t: 0, ph: veh.lines.map((_, i) => i * 1.9 + 0.4) };
        buf = [];
      }
      update();
      const loop = kit.loop(dt => {
        const veh = P.veh, p = P.p, wn = 2 * Math.PI * p.fn, n = Math.max(1, Math.round(dt / 0.0005)), h = dt / n;
        let af = 0, as = 0;
        for (let i = 0; i < n; i++) {
          sim.t += h;
          af = 0; veh.lines.forEach(([f, a], k) => { af += Math.SQRT2 * a * Math.sin(2 * Math.PI * f * sim.t + sim.ph[k]); });
          const ydd = -wn * wn * sim.y - 2 * p.z * wn * sim.yd - af;
          sim.yd += ydd * h; sim.y += sim.yd * h;
          as = -wn * wn * sim.y - 2 * p.z * wn * sim.yd;
        }
        let zf = 0; veh.lines.forEach(([f, a], k) => { const w = 2 * Math.PI * f; zf -= Math.SQRT2 * a / (w * w) * Math.sin(w * sim.t + sim.ph[k]); });
        const zs = zf + sim.y;
        if (dt > 0) { buf.push([sim.t, af, as]); while (buf.length && buf[0][0] < sim.t - 3) buf.shift(); }
        // draw
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '11.5px ' + font();
        const gx = W * 0.2, base = H - 40, k = 3;                // motion exaggerated: 1 mm of travel drawn as 3 px
        const yF = base - zf * 1000 * k, yS = base - 110 - zs * 1000 * k;
        // floor
        c.fillStyle = C.faint; c.fillRect(gx - 110, yF, 220, 12);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(gx - 110, yF, 220, 12);
        kit.label(c, 'cab floor', gx + 118, yF + 6, { size: 11, color: C.muted });
        // spring and damper
        const sx = gx - 40, dx = gx + 40, top = yS + 8, bot = yF;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath();
        const turns = 8; for (let i = 0; i <= turns * 2; i++) { const y = top + (bot - top) * i / (turns * 2); const x = sx + (i === 0 || i === turns * 2 ? 0 : (i % 2 ? -10 : 10)); i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
        const mid = (top + bot) / 2;
        c.beginPath(); c.moveTo(dx, top); c.lineTo(dx, mid - 6); c.moveTo(dx - 9, mid - 6); c.lineTo(dx + 9, mid - 6); c.stroke();
        c.strokeRect(dx - 12, mid - 14, 24, bot - mid + 14 - 2);
        // seat and a seated person
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(gx - 90, yS - 4, 190, 14); c.strokeRect(gx - 90, yS - 4, 190, 14);
        c.fillRect(gx - 104, yS - 150, 16, 150); c.strokeRect(gx - 104, yS - 150, 16, 150);
        const col = C.hue(215, 0.9);
        c.strokeStyle = col; c.lineCap = 'round';
        c.lineWidth = 16; c.beginPath(); c.moveTo(gx - 70, yS - 14); c.lineTo(gx - 64, yS - 118); c.stroke();
        c.lineWidth = 13; c.beginPath(); c.moveTo(gx - 70, yS - 12); c.lineTo(gx + 40, yS - 16); c.lineTo(gx + 58, yF - 4); c.stroke();
        c.lineWidth = 9; c.beginPath(); c.moveTo(gx - 62, yS - 110); c.lineTo(gx - 10, yS - 70); c.lineTo(gx + 40, yS - 80); c.stroke();
        c.fillStyle = col; c.beginPath(); c.arc(gx - 62, yS - 140, 15, 0, 6.283); c.fill();
        c.lineCap = 'butt';
        kit.label(c, V.seat === 'foam' ? 'foam cushion: fₙ ≈ 4 Hz' : 'suspension: fₙ = ' + p.fn.toFixed(2) + ' Hz, ζ = ' + p.z.toFixed(2), gx - 110, 14, { size: 11.5, color: C.text });
        kit.label(c, 'motion exaggerated', gx - 110, 30, { size: 10.5, color: C.muted });
        // acceleration traces
        const tx0 = W * 0.46, tx1 = W - 14, ty = H * 0.5, th = H * 0.4, amax = Math.max(1.5, 2.2 * Math.max(P.af, P.as));
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(tx0, ty); c.lineTo(tx1, ty); c.stroke();
        const TX = t => tx1 - (sim.t - t) / 3 * (tx1 - tx0), TY = a => ty - a / amax * th;
        c.lineWidth = 1.3; c.strokeStyle = C.muted; c.beginPath(); buf.forEach(([t, a], i) => i ? c.lineTo(TX(t), TY(a)) : c.moveTo(TX(t), TY(a))); c.stroke();
        c.lineWidth = 2; c.strokeStyle = C.accent; c.beginPath(); buf.forEach(([t, , a], i) => i ? c.lineTo(TX(t), TY(a)) : c.moveTo(TX(t), TY(a))); c.stroke();
        kit.label(c, 'floor', tx0, ty - th + 4, { size: 11, color: C.muted });
        kit.label(c, 'seat', tx0 + 44, ty - th + 4, { size: 11, color: C.accent });
        kit.label(c, 'acceleration, last 3 s (±' + amax.toFixed(1) + ' m/s²)', tx1, ty + th + 12, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'SEAT ' + pctTxt(P.as / P.af, 0), tx1, ty - th + 4, { size: 12, weight: 600, color: P.as > P.af ? C.bad : C.ok, align: 'right' });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ mt-driver-package */
  // side views in mm, origin at the accelerator heel point (AHP), x forward, z up; the road is at z = −G.
  // Geometry is illustrative and rounded, typical of each kind of vehicle.
  const PK = {
    car: { name: 'Saloon car', G: 280, H30: 250, rear: -790, front: -550, beta: 23, wheel: { x: -330, z: 640, d: 370, tilt: 25 }, pedal: { x: 200, z: 110 },
      obs: [[250, 700], [800, 640], [1450, 520]], header: [-320, 1110], roof: 1120, frontX: 1600, axles: [1150, -1650], r: 315, view: [-2000, 4600],
      body: [[-2000, 1120], [-320, 1120], [250, 700], [800, 640], [1450, 520], [1600, 300], [1600, -150]], floor: [[-1300, -60], [60, -60], [150, 180], [250, 700]] },
    suv: { name: 'SUV', G: 420, H30: 330, rear: -760, front: -520, beta: 20, wheel: { x: -320, z: 690, d: 380, tilt: 28 }, pedal: { x: 200, z: 110 },
      obs: [[220, 770], [800, 740], [1450, 650]], header: [-300, 1230], roof: 1240, frontX: 1600, axles: [1200, -1700], r: 370, view: [-2000, 5000],
      body: [[-2000, 1240], [-300, 1240], [220, 770], [800, 740], [1450, 650], [1600, 350], [1600, -170]], floor: [[-1300, -60], [60, -60], [150, 200], [220, 770]] },
    truck: { name: 'Truck, high cab-over', G: 1250, H30: 440, rear: -690, front: -490, beta: 14, wheel: { x: -200, z: 640, d: 460, tilt: 55 }, pedal: { x: 200, z: 130 },
      obs: [[480, 700], [150, 640]], header: [420, 1800], roof: 1950, frontX: 560, axles: [-150, -3950], r: 500, view: [-2600, 5600],
      body: [[-2600, 1950], [420, 1950], [420, 1800], [480, 700], [560, 650], [560, -900], [400, -900]], floor: [[-1500, -60], [60, -60], [150, 150], [150, 640], [480, 700]] }
  };
  Hyper.sim('mt-driver-package', {
    title: 'A driver in the package',
    blurb: `A side view of a driver of any sex and percentile in a car, an SUV or a truck cab, drawn to scale from representative body dimensions (link lengths from Drillis and Contini). The driver sets the seat on its track so that the knee is bent about 125° with the heel at the accelerator heel point — unless the track runs out. From the eye, two sight lines: down over the bonnet or window sill to the road, and up under the top of the windscreen. A child stands in front of the vehicle: green if the top of the head is above the line of sight, red if hidden. Vehicle geometry is illustrative and rounded.

**Try this**
- Car, 5th-percentile woman: the seat goes near the front stop, her eyes are low, the ground ahead appears later. 95th-percentile man: near the rear stop, and little head room — raise the seat and he touches the roof.
- The same knee angle puts the 5th-percentile woman and the 95th-percentile man about 150 mm apart on the track; the rest of the usual 200–250 mm covers people's different preferred postures.
- The small woman sitting forward is cramped at the wheel and close to the airbag: push the wheel away (a telescopic column) until her breastbone is at least 250 mm from the wheel centre.
- Switch to the truck and walk the child towards the cab: it disappears 2–3 m in front of the bumper, whoever drives.
- Recline the backrest from 23° to 35°: the eyes drop and move back; the arms straighten to reach the wheel.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.keys(PK).map(k => [PK[k].name, k]), value: 'car' },
        { id: 'sex', type: 'select', label: 'Driver', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) },
        { id: 'adj', label: 'Seat raised by', min: 0, max: 60, step: 5, value: 20, unit: 'mm' },
        { id: 'beta', label: 'Backrest angle from the vertical', min: 5, max: 35, step: 1, value: 23, unit: '°' },
        { id: 'wr', label: 'Steering wheel pulled towards the driver (− pushed away)', min: -60, max: 60, step: 5, value: 0, unit: 'mm' },
        { id: 'auto', type: 'check', label: 'The driver sets the seat (knee about 125°)', value: true },
        { id: 'pos', label: 'Seat on its track (0 rearmost, 100 foremost)', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'ch', type: 'select', label: 'Child in front', options: [['about 1.0 m tall (about 4 years)', 1000], ['about 0.85 m tall (about 2 years)', 850]], value: 1000 },
        { id: 'cx', label: 'Child\'s distance ahead of the vehicle', min: 0, max: 5, step: 0.1, value: 1.5, unit: 'm' }
      ], id => { if (id === 'veh') ctl.set('beta', PK[V.veh].beta); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Driver'], ['seat', 'Seat'], ['knee', 'Knee angle'], ['elbow', 'Elbow angle at the wheel'], ['bag', 'Breastbone to wheel centre'], ['head', 'Head room'], ['eye', 'Eye height above the road'], ['down', 'Looking down ahead'], ['up', 'Looking up']]);
      const deg = r => r / DEG;
      function solve() {
        const K = PK[V.veh], P = E.person({ sex: V.sex, p: V.p }), S = P.stature, shoe = 30;
        const a = 0.245 * S, b = 0.246 * S, A = { x: 0.2 * P.footLength, z: 0.039 * S + shoe };
        const zh = K.H30 + V.adj;
        const dPref = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(125 * DEG));
        const xPref = A.x - Math.sqrt(Math.max(0, dPref * dPref - (zh - A.z) * (zh - A.z)));
        const xh = V.auto ? clamp(xPref, K.rear, K.front) : K.rear + (K.front - K.rear) * V.pos / 100;
        const H = { x: xh, z: zh }, D = Math.hypot(A.x - H.x, A.z - H.z);
        let knee, kAng, reach = true;
        const ux = (A.x - H.x) / D, uz = (A.z - H.z) / D;
        if (D >= a + b - 1) { reach = false; kAng = 180; knee = { x: H.x + ux * a, z: H.z + uz * a }; }
        else { const l = (a * a - b * b + D * D) / (2 * D), hk = Math.sqrt(Math.max(0, a * a - l * l)); knee = { x: H.x + l * ux - hk * uz, z: H.z + l * uz + hk * ux }; kAng = deg(Math.acos(clamp((a * a + b * b - D * D) / (2 * a * b), -1, 1))); }
        const be = V.beta * DEG, t = { x: -Math.sin(be), z: Math.cos(be) }, f = { x: Math.cos(be), z: Math.sin(be) };
        const along = (L, fw) => ({ x: H.x + L * t.x + fw * f.x, z: H.z + L * t.z + fw * f.z });
        const sh = along(P.shoulderHeightSit - 90, 0.01 * S), eye = along(P.eyeHeightSit - 90, 0.045 * S), vertex = along(P.sittingHeight - 90, 0.01 * S), headC = along(P.sittingHeight - 90 - 0.065 * S, 0.02 * S);
        const Wc = { x: K.wheel.x - V.wr, z: K.wheel.z }, L1 = 0.186 * S, L2 = 0.2 * S, Dw = Math.hypot(Wc.x - sh.x, Wc.z - sh.z);
        const chest = along(P.shoulderHeightSit - 90 - 170, 0.1 * S), bag = Math.hypot(Wc.x - chest.x, Wc.z - chest.z);
        let elbow, eAng, armOK = true;
        if (Dw >= L1 + L2 - 1) { armOK = false; eAng = 180; elbow = { x: sh.x + (Wc.x - sh.x) * L1 / Dw, z: sh.z + (Wc.z - sh.z) * L1 / Dw }; }
        else { const vx = (Wc.x - sh.x) / Dw, vz = (Wc.z - sh.z) / Dw, l = (L1 * L1 - L2 * L2 + Dw * Dw) / (2 * Dw), hh = Math.sqrt(Math.max(0, L1 * L1 - l * l)); elbow = { x: sh.x + l * vx + hh * vz, z: sh.z + l * vz - hh * vx }; eAng = deg(Math.acos(clamp((L1 * L1 + L2 * L2 - Dw * Dw) / (2 * L1 * L2), -1, 1))); }
        const hand = armOK ? Wc : { x: sh.x + (Wc.x - sh.x) * (L1 + L2) / Dw, z: sh.z + (Wc.z - sh.z) * (L1 + L2) / Dw };
        // vision: the most limiting edge ahead of the eye
        let dep = Infinity; K.obs.forEach(([ox, oz]) => { if (ox > eye.x + 1) dep = Math.min(dep, Math.atan2(eye.z - oz, ox - eye.x)); });
        dep = Math.max(dep, 0.5 * DEG);
        const xGround = eye.x + (eye.z + K.G) / Math.tan(dep), hc = V.ch, xChild = eye.x + (eye.z + K.G - hc) / Math.tan(dep);
        const upA = Math.atan2(K.header[1] - eye.z, K.header[0] - eye.x);
        return { K, P, S, A, H, knee, kAng, reach, xh, xPref, sh, eye, vertex, headC, elbow, eAng, armOK, hand, dep, xGround, xChild, upA, shoe, Wc, bag };
      }
      function draw() {
        const R = solve(), K = R.K, P = R.P, C = kit.colors();
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(P.stature) + ' mm');
        const onTrack = Math.round(R.xh - K.rear);
        ro.set('seat', onTrack + ' mm forward of the rear stop (track ' + (K.front - K.rear) + ' mm)' + (V.auto && R.xPref > K.front + 1 ? ' — at the front stop: wants to be closer' : V.auto && R.xPref < K.rear - 1 ? ' — at the rear stop: wants to be farther back' : ''));
        ro.set('knee', !R.reach ? 'cannot reach the pedal — move the seat forward' : Math.round(R.kAng) + '°' + (R.kAng < 100 ? ' — cramped' : R.kAng > 135 ? ' — stretched' : ' — comfortable (100–135°)'));
        ro.set('elbow', !R.armOK ? 'arms straight: cannot reach the wheel from the backrest' : Math.round(R.eAng) + '°' + (R.eAng > 160 ? ' — nearly straight' : R.eAng < 80 ? ' — cramped: push the wheel away' : ''));
        ro.set('bag', Math.round(R.bag) + ' mm' + (V.veh !== 'truck' && R.bag < 250 ? ' — closer than the 250 mm advised for the airbag' : ''));
        const hr = K.roof - R.vertex.z;
        ro.set('head', Math.round(hr) + ' mm' + (hr < 0 ? ' — head hits the roof' : hr < 40 ? ' — tight' : ''));
        ro.set('eye', Math.round(R.eye.z + K.G) + ' mm');
        const gAhead = (R.xGround - K.frontX) / 1000, cAhead = (R.xChild - K.frontX) / 1000;
        ro.set('down', (R.dep / DEG).toFixed(1) + '° down: road visible from ' + gAhead.toFixed(1) + ' m ahead; the child\'s head from ' + (cAhead <= 0 ? 'right at the front' : cAhead.toFixed(1) + ' m'));
        const sig = 5000, xS = R.upA > 0.5 * DEG ? R.eye.x + (sig - K.G - R.eye.z) / Math.tan(R.upA) : Infinity;
        ro.set('up', (R.upA / DEG).toFixed(1) + '° up: a signal 5 m above the road is hidden when nearer than ' + (Number.isFinite(xS) ? ((xS - K.frontX) / 1000).toFixed(1) + ' m ahead of the front' : 'any distance'));
        // drawing
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11.5px ' + font(); c.lineCap = 'round'; c.lineJoin = 'round';
        const x0 = K.view[0], x1 = K.view[1], z0 = -K.G - 60, z1 = K.roof + 250;
        const k = Math.min((W - 20) / (x1 - x0), (Hh - 20) / (z1 - z0)), ox = 10 - x0 * k, oz = Hh - 10 + z0 * k;
        const X = x => ox + x * k, Z = z => oz - z * k;
        // road
        c.fillStyle = C.faint; c.fillRect(0, Z(-K.G), W, Hh - Z(-K.G));
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Z(-K.G)); c.lineTo(W, Z(-K.G)); c.stroke();
        // wheels
        K.axles.forEach(ax => { c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.arc(X(ax), Z(-K.G + K.r), K.r * k, 0, 6.283); c.stroke(); });
        // body and floor
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); K.body.forEach(([x, z], i) => i ? c.lineTo(X(x), Z(z)) : c.moveTo(X(x), Z(z))); c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); K.floor.forEach(([x, z], i) => i ? c.lineTo(X(x), Z(z)) : c.moveTo(X(x), Z(z))); c.stroke();
        // seat track and seat
        c.strokeStyle = C.hue(40, 0.9); c.lineWidth = 3; c.beginPath(); c.moveTo(X(K.rear - 150), Z(K.H30 - 200)); c.lineTo(X(K.front + 150), Z(K.H30 - 200)); c.stroke();
        kit.label(c, 'seat track', X(K.front + 160), Z(K.H30 - 200), { size: 10, color: C.muted });
        const Hx = R.H.x, Hz = R.H.z, be = V.beta * DEG;
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(Hx - 150), Z(Hz - 130)); c.lineTo(X(Hx + 330), Z(Hz - 70)); c.lineTo(X(Hx + 330), Z(Hz - 140)); c.lineTo(X(Hx - 170), Z(Hz - 200)); c.closePath(); c.fill(); c.stroke();
        const bt = { x: -Math.sin(be), z: Math.cos(be) }, bf = { x: Math.cos(be), z: Math.sin(be) }, b0 = { x: Hx - 140, z: Hz - 140 };
        c.beginPath(); c.moveTo(X(b0.x), Z(b0.z)); c.lineTo(X(b0.x + 780 * bt.x), Z(b0.z + 780 * bt.z)); c.lineTo(X(b0.x + 780 * bt.x - 90 * bf.x), Z(b0.z + 780 * bt.z - 90 * bf.z)); c.lineTo(X(b0.x - 90 * bf.x), Z(b0.z - 90 * bf.z)); c.closePath(); c.fill(); c.stroke();
        // pedal and wheel
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(K.pedal.x - 40), Z(K.pedal.z - 60)); c.lineTo(X(K.pedal.x + 40), Z(K.pedal.z + 70)); c.stroke();
        const tl = K.wheel.tilt * DEG, wr = K.wheel.d / 2, wx = R.Wc.x, wz = R.Wc.z;
        // the rim seen edge-on, its top inclined forward by the tilt; the column runs forward and down
        c.lineWidth = 4; c.beginPath(); c.moveTo(X(wx - wr * Math.sin(tl)), Z(wz - wr * Math.cos(tl))); c.lineTo(X(wx + wr * Math.sin(tl)), Z(wz + wr * Math.cos(tl))); c.stroke();
        c.lineWidth = 3; c.beginPath(); c.moveTo(X(wx), Z(wz)); c.lineTo(X(wx + 350 * Math.cos(tl)), Z(wz - 350 * Math.sin(tl))); c.stroke();
        // sight lines
        const e = R.eye;
        const xg = Math.min(R.xGround, x1), zg = e.z - (xg - e.x) * Math.tan(R.dep);
        c.strokeStyle = C.hue(48, 1); c.lineWidth = 1.3; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(X(e.x), Z(e.z)); c.lineTo(X(xg), Z(zg)); c.stroke();
        const xu = Math.min(x1, e.x + (K.roof + 250 - e.z) / Math.max(0.05, Math.tan(R.upA)));
        c.beginPath(); c.moveTo(X(e.x), Z(e.z)); c.lineTo(X(xu), Z(e.z + (xu - e.x) * Math.tan(R.upA))); c.stroke();
        c.setLineDash([]);
        // hidden zone under the line, in front of the vehicle
        if (R.xGround > K.frontX) { c.fillStyle = C.hue(0, 0.16); c.beginPath(); c.moveTo(X(K.frontX), Z(-K.G)); c.lineTo(X(Math.min(R.xGround, x1)), Z(-K.G)); c.lineTo(X(K.frontX), Z(e.z - (K.frontX - e.x) * Math.tan(R.dep))); c.closePath(); c.fill(); }
        // the child
        const cxm = K.frontX + V.cx * 1000, visible = cxm >= R.xChild, ccol = visible ? C.ok : C.bad, chh = V.ch;
        c.strokeStyle = ccol; c.fillStyle = ccol; c.lineWidth = Math.max(2, 70 * k);
        c.beginPath(); c.moveTo(X(cxm), Z(-K.G)); c.lineTo(X(cxm), Z(-K.G + chh * 0.8)); c.stroke();
        c.beginPath(); c.arc(X(cxm), Z(-K.G + chh * 0.9), Math.max(3, 90 * k), 0, 6.283); c.fill();
        kit.label(c, visible ? 'seen' : 'hidden', X(cxm), Z(-K.G + chh) - 12, { size: 11, align: 'center', color: ccol, bg: C.bg2 });
        // the driver
        const col = sexCol(C, V.sex), S = R.S;
        c.strokeStyle = col; c.fillStyle = col;
        const seg = (p1, p2, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(p1.x), Z(p1.z)); c.lineTo(X(p2.x), Z(p2.z)); c.stroke(); };
        const ankle = R.reach ? R.A : { x: R.knee.x + (R.A.x - R.H.x) / Math.hypot(R.A.x - R.H.x, R.A.z - R.H.z) * 0.246 * S, z: R.knee.z + (R.A.z - R.H.z) / Math.hypot(R.A.x - R.H.x, R.A.z - R.H.z) * 0.246 * S };
        seg(R.H, R.knee, 0.075 * S); seg(R.knee, ankle, 0.055 * S);
        seg(ankle, R.reach ? { x: K.pedal.x, z: K.pedal.z } : { x: ankle.x + 0.14 * S, z: ankle.z + 0.02 * S }, 0.04 * S);
        seg(R.H, R.sh, 0.11 * S);
        seg(R.sh, R.elbow, 0.045 * S); seg(R.elbow, R.hand, 0.04 * S);
        c.beginPath(); c.arc(X(R.headC.x), Z(R.headC.z), 0.065 * S * k, 0, 6.283); c.fill();
        kit.dot(c, X(e.x), Z(e.z), Math.max(2, 3), C.bg2);
        kit.dot(c, X(R.H.x), Z(R.H.z), 3, C.bg2, C.text);
        kit.label(c, 'H-point', X(R.H.x) - 6, Z(R.H.z) + 12, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, K.name + ' · ' + who(V.sex, V.p), 10, 14, { size: 12, color: C.text });
        kit.label(c, 'road visible from ' + gAhead.toFixed(1) + ' m ahead', X(Math.min(R.xGround, x1 - 900)), Z(-K.G) + 12, { size: 11, color: C.hue(48, 1) });
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-blind-zones */
  // plan views in metres: x forward (0 at the front of the body), y to the left (the driver sits on the left), z up.
  // obstacles: [x1, y1, x2, y2, zBottom, zTop] block a line of sight crossing them between those heights.
  // mirrors: centre, a ground point the mirror is aimed at, radius of curvature (convex), width and height. Illustrative.
  const BZ = {
    car: { name: 'Car', L: 4.6, Wd: 1.8, eye: [-2.05, 0.37, 1.18], view: [-11, 6.5, 6.5],
      obs: [[-0.05, -0.85, -0.05, 0.85, 0, 0.8], [-0.6, -0.85, -0.6, 0.85, 0, 0.87], [-1.05, -0.8, -1.05, 0.8, 0, 0.97], [-4.6, 0.9, -0.05, 0.9, 0, 0.95], [-4.6, -0.9, -0.05, -0.9, 0, 0.95],
        [-1.0, 0.7, -1.12, 0.8, 0.95, 1.4], [-1.0, -0.7, -1.12, -0.8, 0.95, 1.4], [-2.35, 0.88, -2.5, 0.88, 0.95, 1.4], [-2.35, -0.88, -2.5, -0.88, 0.95, 1.4],
        [-3.55, 0.85, -3.95, 0.72, 1.0, 1.4], [-3.55, -0.85, -3.95, -0.72, 1.0, 1.4], [-3.95, -0.75, -3.95, 0.75, 0, 1.06], [-4.6, -0.85, -4.6, 0.85, 0, 1.0],
        [-3.1, 0.25, -3.1, 0.6, 0.95, 1.2], [-3.1, -0.25, -3.1, -0.6, 0.95, 1.2], [-1.3, -0.14, -1.3, 0.14, 1.2, 1.3], [-1.1, 0.92, -1.15, 1.08, 0.9, 1.05], [-1.1, -0.92, -1.15, -1.08, 0.9, 1.05]],
      mirrors: [{ n: 'left door mirror', c: [-1.12, 1.0, 1.0], aim: [-12, 1.9, 0], R: 1.4, w: 0.18, h: 0.11 }, { n: 'right door mirror', c: [-1.12, -1.0, 1.0], aim: [-12, -2.3, 0], R: 1.2, w: 0.18, h: 0.11 }, { n: 'interior mirror', c: [-1.3, 0, 1.25], aim: [-25, 0.4, 0], R: Infinity, w: 0.25, h: 0.07 }] },
    truck: { name: 'Truck, high cab', L: 7.5, Wd: 2.5, eye: [-0.9, 0.62, 2.35], view: [-13, 6, 7],
      obs: [[-0.08, -1.2, -0.08, 1.2, 0, 1.95], [-2.2, 1.25, -0.08, 1.25, 0, 2.0], [-2.2, -1.25, -0.08, -1.25, 0, 2.0], [-0.08, 1.12, -0.2, 1.25, 1.95, 3.0], [-0.08, -1.12, -0.2, -1.25, 1.95, 3.0],
        [-2.2, -1.25, -2.2, 1.25, 0, 3.2], [-7.5, 1.25, -2.3, 1.25, 0, 3.8], [-7.5, -1.25, -2.3, -1.25, 0, 3.8], [-7.5, -1.25, -7.5, 1.25, 0, 3.8], [-0.25, 1.3, -0.25, 1.62, 1.9, 2.7], [-0.25, -1.3, -0.25, -1.62, 1.9, 2.7]],
      mirrors: [{ n: 'main mirror, left', c: [-0.25, 1.52, 2.45], aim: [-20, 2.6, 0], R: 1.8, w: 0.2, h: 0.35 }, { n: 'main mirror, right', c: [-0.25, -1.52, 2.45], aim: [-20, -2.9, 0], R: 1.8, w: 0.2, h: 0.35 },
        { n: 'wide-angle, left', c: [-0.25, 1.52, 2.1], aim: [-6, 3.5, 0], R: 0.4, w: 0.18, h: 0.15 }, { n: 'wide-angle, right', c: [-0.25, -1.52, 2.1], aim: [-6, -4.0, 0], R: 0.4, w: 0.18, h: 0.15 },
        { n: 'close-proximity', c: [-0.1, -1.35, 2.75], aim: [-1.2, -2.2, 0], R: 0.35, w: 0.18, h: 0.18 }, { n: 'front mirror', c: [0.1, -0.9, 2.95], aim: [1.2, 0, 0], R: 0.35, w: 0.2, h: 0.2 }] },
    low: { name: 'Truck, low-entry cab', L: 7.5, Wd: 2.5, eye: [-0.9, 0.62, 1.8], view: [-13, 6, 7],
      obs: [[-0.08, -1.2, -0.08, 1.2, 0, 1.15], [-2.2, 1.25, -0.08, 1.25, 0, 1.3], [-1.2, -1.25, -0.08, -1.25, 0, 0.8], [-2.2, -1.25, -1.2, -1.25, 0, 1.3], [-0.08, 1.12, -0.2, 1.25, 1.15, 2.5], [-0.08, -1.12, -0.2, -1.25, 1.15, 2.5],
        [-2.2, -1.25, -2.2, 1.25, 0, 2.9], [-7.5, 1.25, -2.3, 1.25, 0, 3.8], [-7.5, -1.25, -2.3, -1.25, 0, 3.8], [-7.5, -1.25, -7.5, 1.25, 0, 3.8], [-0.25, 1.3, -0.25, 1.62, 1.5, 2.3], [-0.25, -1.3, -0.25, -1.62, 1.5, 2.3]],
      mirrors: [{ n: 'main mirror, left', c: [-0.25, 1.52, 2.0], aim: [-20, 2.6, 0], R: 1.8, w: 0.2, h: 0.35 }, { n: 'main mirror, right', c: [-0.25, -1.52, 2.0], aim: [-20, -2.9, 0], R: 1.8, w: 0.2, h: 0.35 },
        { n: 'wide-angle, left', c: [-0.25, 1.52, 1.65], aim: [-6, 3.5, 0], R: 0.4, w: 0.18, h: 0.15 }, { n: 'wide-angle, right', c: [-0.25, -1.52, 1.65], aim: [-6, -4.0, 0], R: 0.4, w: 0.18, h: 0.15 },
        { n: 'close-proximity', c: [-0.1, -1.35, 2.3], aim: [-1.2, -2.2, 0], R: 0.35, w: 0.18, h: 0.18 }, { n: 'front mirror', c: [0.1, -0.9, 2.5], aim: [1.2, 0, 0], R: 0.35, w: 0.2, h: 0.2 }] },
    fork: { name: 'Counterbalance forklift', L: 2.35, Wd: 1.1, front: 1.2, eye: [-1.15, 0.05, 1.95], view: [-8, 7.5, 6],
      obs: [[-0.45, 0.47, -0.45, 0.53, 1.0, 2.15], [-0.45, -0.47, -0.45, -0.53, 1.0, 2.15], [-1.85, 0.47, -1.85, 0.53, 1.3, 2.15], [-1.85, -0.47, -1.85, -0.53, 1.3, 2.15],
        [-1.8, 0.55, -0.3, 0.55, 0, 0.95], [-1.8, -0.55, -0.3, -0.55, 0, 0.95], [-0.35, -0.4, -0.35, 0.4, 0, 1.15], [-2.35, -0.55, -2.35, 0.55, 0, 1.3], [-1.8, -0.55, -1.8, 0.55, 0, 1.3]],
      mirrors: [] }
  };
  const v3 = { sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], mul: (a, k) => [a[0] * k, a[1] * k, a[2] * k], dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], norm: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
  Hyper.sim('mt-blind-zones', {
    title: 'Blind zones around a vehicle',
    blurb: `The vehicle from above, with the driver's eye position marked. Every patch of ground is tested: can the driver see a person of the chosen height standing there — directly, through the windows past the bonnet, sills, pillars, mirrors and load (their head, chest or hips), or at least their feet in one of the mirrors, traced ray by ray off each convex mirror to the ground? **Red** is hidden, **amber** seen only in a mirror; drag the person (the circle) around. Geometry is illustrative and rounded, typical of each kind of vehicle.

**Try this**
- Car, child 1.0 m: a small zone behind the boot and patches beside the rear pillars. Switch the mirrors off to see what they cover.
- High-cab truck: the zone in front of the cab and along the passenger side swallows a child — and even an adult close to the front corner. The close-proximity and front mirrors fill most of it, if the driver looks at six mirrors at once.
- Low-entry cab: the same truck with the eyes 0.55 m lower and glass down to the knee in the passenger door — the direct-vision idea behind London's Direct Vision Standard and the EU's new truck rules.
- Forklift with a load 1.2 m tall on lowered forks: a child is hidden for about 2.5 m ahead. Make the load 1.5 m tall and even an adult close in front disappears — the reason to drive in reverse when a load blocks the view.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 380, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.keys(BZ).map(k => [BZ[k].name, k]), value: 'truck' },
        { id: 'ph', type: 'select', label: 'Person', options: [['child about 1.0 m tall', 1.0], ['adult 1.75 m', 1.75], ['adult bending down, 0.9 m', 0.9]], value: 1.0 },
        { id: 'mir', type: 'check', label: 'Mirrors in use', value: true },
        { id: 'fh', label: 'Forks raised to', min: 0, max: 3, step: 0.05, value: 0.15, unit: 'm' },
        { id: 'lh', label: 'Height of the load on the forks', min: 0, max: 1.6, step: 0.05, value: 1.2, unit: 'm' },
        { type: 'buttons', items: [{ id: 'front', label: 'Person close in front' }, { id: 'side', label: 'Person at the passenger side' }] }
      ], id => {
        const K = BZ[V.veh];
        if (id === 'front') { ped = { x: (K.front || 0) + 0.6, y: -0.2 }; }
        if (id === 'side') { ped = { x: -Math.min(1.5, K.L / 2), y: -K.Wd / 2 - 0.6 }; }
        if (id === 'veh' || id === 'front' || id === 'side' || id === 'ph' || id === 'mir' || id === 'fh' || id === 'lh') { if (id === 'veh') ped = { x: (K.front || 0) + 1.0, y: -0.3 }; compute(); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['veh', 'Driver\'s eyes'], ['ped', 'The person'], ['front', 'Straight ahead, hidden up to'], ['side', 'Passenger side, hidden up to'], ['hid', 'Hidden within 2 m of the vehicle'], ['hidD', '… by the windows alone']]);
      let ped = { x: 1.0, y: -0.3 }, G = null;
      const CELL = 0.2;
      function obstacles(K) {
        const o = K.obs.slice();
        if (V.veh === 'fork') {
          const fh = V.fh, mastTop = Math.max(2.15, fh + 1.2), lt = fh + 0.15 + V.lh;
          o.push([-0.05, 0.28, -0.05, 0.42, 0, mastTop], [-0.05, -0.28, -0.05, -0.42, 0, mastTop], [-0.05, -0.42, -0.05, 0.42, mastTop - 0.12, mastTop]);
          o.push([0.02, -0.45, 0.02, 0.45, fh, fh + 0.35]);
          if (V.lh > 0) { const x0 = 0.08, x1 = 1.2, y0 = -0.5, y1 = 0.5, zb = fh + 0.15; o.push([x0, y0, x0, y1, zb, lt], [x1, y0, x1, y1, zb, lt], [x0, y0, x1, y0, zb, lt], [x0, y1, x1, y1, zb, lt]); }
        }
        return o;
      }
      function blocked(A, B, obs) {
        const dx = B[0] - A[0], dy = B[1] - A[1];
        for (const s of obs) {
          const ex = s[2] - s[0], ey = s[3] - s[1], den = dx * ey - dy * ex;
          if (Math.abs(den) < 1e-12) continue;
          const qx = s[0] - A[0], qy = s[1] - A[1], t = (qx * ey - qy * ex) / den, u = (qx * dy - qy * dx) / den;
          if (t <= 0.0005 || t >= 0.9995 || u < 0 || u > 1) continue;
          const z = A[2] + (B[2] - A[2]) * t;
          if (z >= s[4] && z <= s[5]) return true;
        }
        return false;
      }
      const inside = (K, x, y) => x <= (K.front || 0) + 0.02 && x >= -K.L - 0.02 && Math.abs(y) <= K.Wd / 2 + 0.02;
      function visibleDirect(K, obs, x, y) {
        const E = K.eye;
        for (const f of [1, 0.75, 0.5]) if (!blocked(E, [x, y, V.ph * f], obs)) return true;
        return false;
      }
      function compute() {
        const K = BZ[V.veh], obs = obstacles(K), E = K.eye, [xmin, xmax, ymax] = K.view;
        const nx = Math.round((xmax - xmin) / CELL), ny = Math.round(2 * ymax / CELL);
        const dir = new Uint8Array(nx * ny), mir = new Uint8Array(nx * ny);
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = xmin + (i + 0.5) * CELL, y = -ymax + (j + 0.5) * CELL;
          if (inside(K, x, y)) { dir[i * ny + j] = 2; continue; }
          dir[i * ny + j] = visibleDirect(K, obs, x, y) ? 1 : 0;
        }
        const hits = [];
        if (V.mir) K.mirrors.forEach((m, mi) => {
          const c = m.c, n0 = v3.norm(v3.add(v3.norm(v3.sub(E, c)), v3.norm(v3.sub(m.aim, c))));
          let e1 = v3.cross(n0, [0, 0, 1]); if (Math.hypot(e1[0], e1[1], e1[2]) < 1e-6) e1 = [0, 1, 0]; e1 = v3.norm(e1);
          const e2 = v3.cross(e1, n0), NU = 36, NV = 30;
          for (let a = 0; a <= NU; a++) for (let b = 0; b <= NV; b++) {
            const u = (a / NU - 0.5) * m.w, v = (b / NV - 0.5) * m.h, off = v3.add(v3.mul(e1, u), v3.mul(e2, v));
            const S = v3.add(c, off), n = Number.isFinite(m.R) ? v3.norm(v3.add(n0, v3.mul(off, 1 / m.R))) : n0;
            const d = v3.norm(v3.sub(S, E)), r = v3.sub(d, v3.mul(n, 2 * v3.dot(d, n)));
            if (r[2] > -0.004) continue;
            const t = -S[2] / r[2], Gp = [S[0] + t * r[0], S[1] + t * r[1], 0];
            if (Math.hypot(Gp[0] - S[0], Gp[1] - S[1]) > 40) continue;
            if (blocked(S, Gp, obs)) continue;
            hits.push([Gp[0], Gp[1], mi]);
            const i = Math.floor((Gp[0] - xmin) / CELL), j = Math.floor((Gp[1] + ymax) / CELL);
            if (i >= 0 && i < nx && j >= 0 && j < ny) mir[i * ny + j] = 1;
          }
        });
        // fill single-cell gaps between mirror hits (the rays are samples of a continuous field)
        const mir2 = mir.slice();
        for (let i = 1; i < nx - 1; i++) for (let j = 1; j < ny - 1; j++) if (!mir[i * ny + j]) { let s = 0; for (let di = -1; di <= 1; di++) for (let dj = -1; dj <= 1; dj++) s += mir[(i + di) * ny + j + dj]; if (s >= 4) mir2[i * ny + j] = 1; }
        // hidden areas within 2 m of the body, and along two probe lines
        let hid = 0, hidD = 0;
        for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
          const x = xmin + (i + 0.5) * CELL, y = -ymax + (j + 0.5) * CELL, k = i * ny + j;
          if (dir[k] === 2) continue;
          const dxo = Math.max(0, x - (K.front || 0), -K.L - x), dyo = Math.max(0, Math.abs(y) - K.Wd / 2);
          if (Math.hypot(dxo, dyo) > 2) continue;
          if (!dir[k]) { hidD += CELL * CELL; if (!mir2[k]) hid += CELL * CELL; }
        }
        const seen = (x, y) => { const i = Math.floor((x - xmin) / CELL), j = Math.floor((y + ymax) / CELL); if (i < 0 || i >= nx || j < 0 || j >= ny) return true; const k = i * ny + j; return dir[k] === 1 || mir2[k] === 1; };
        let fr = 0; for (let d = 0.1; d < 8; d += 0.1) { if (seen((K.front || 0) + d, 0)) { fr = d - 0.1; break; } fr = d; }
        let sd = 0; const xs = V.veh === 'fork' ? -1.1 : Math.max(-K.L / 2, -1.5); for (let d = 0.1; d < 6; d += 0.1) { if (seen(xs, -K.Wd / 2 - d)) { sd = d - 0.1; break; } sd = d; }
        G = { K, obs, nx, ny, xmin, xmax, ymax, dir, mir: mir2, hits, hid, hidD, fr, sd, seen };
      }
      function pedStatus() {
        const K = G.K;
        if (inside(K, ped.x, ped.y)) return 'inside';
        if (visibleDirect(K, G.obs, ped.x, ped.y)) return 'direct';
        const i = Math.floor((ped.x - G.xmin) / CELL), j = Math.floor((ped.y + G.ymax) / CELL);
        if (i >= 0 && i < G.nx && j >= 0 && j < G.ny && G.mir[i * G.ny + j]) return 'mirror';
        return 'hidden';
      }
      let T = null;
      function draw() {
        if (!G) compute();
        ctl.show('fh', V.veh === 'fork'); ctl.show('lh', V.veh === 'fork'); ctl.show('mir', V.veh !== 'fork');
        const K = G.K, C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        c.font = '11.5px ' + font();
        const k = Math.min((W - 20) / (G.xmax - G.xmin), (H - 20) / (2 * G.ymax));
        const ox = W / 2 - (G.xmin + G.xmax) / 2 * k, oy = H / 2;
        const X = x => ox + x * k, Y = y => oy - y * k;          // forward is to the right, left is up
        T = { X, Y, k, ox, oy };
        // cells
        for (let i = 0; i < G.nx; i++) for (let j = 0; j < G.ny; j++) {
          const kk = i * G.ny + j, d = G.dir[kk];
          if (d === 1 || d === 2) continue;
          c.fillStyle = G.mir[kk] ? C.hue(40, 0.4) : C.hue(0, 0.36);
          const x = G.xmin + i * CELL, y = -G.ymax + (j + 1) * CELL;
          c.fillRect(X(x), Y(y), CELL * k + 0.6, CELL * k + 0.6);
        }
        // 2 m band
        c.setLineDash([3, 4]); c.strokeStyle = C.muted; c.lineWidth = 1;
        const fx = K.front || 0;
        c.beginPath(); c.roundRect ? c.roundRect(X(-K.L - 2), Y(K.Wd / 2 + 2), (K.L + fx + 4) * k, (K.Wd + 4) * k, 2 * k) : c.rect(X(-K.L - 2), Y(K.Wd / 2 + 2), (K.L + fx + 4) * k, (K.Wd + 4) * k); c.stroke();
        c.setLineDash([]);
        kit.label(c, '2 m', X(-K.L - 2) + 4, Y(K.Wd / 2 + 2) - 8, { size: 10, color: C.muted });
        // the vehicle
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.fillRect(X(-K.L), Y(K.Wd / 2), K.L * k, K.Wd * k); c.strokeRect(X(-K.L), Y(K.Wd / 2), K.L * k, K.Wd * k);
        if (V.veh === 'fork') { c.fillStyle = C.muted; c.fillRect(X(0.05), Y(0.45), 1.1 * k, 0.12 * k); c.fillRect(X(0.05), Y(-0.33), 1.1 * k, 0.12 * k); if (V.lh > 0) { c.fillStyle = C.hue(30, 0.55); c.fillRect(X(0.08), Y(0.5), 1.12 * k, 1.0 * k); kit.label(c, 'load ' + (V.fh + 0.15 + V.lh).toFixed(2) + ' m high', X(0.64), Y(0), { size: 10.5, align: 'center' }); } }
        c.strokeStyle = C.text; c.lineWidth = 2.2;
        G.obs.forEach(s => { if (s[5] > 1.4 && s[4] > 0.5) { c.beginPath(); c.moveTo(X(s[0]), Y(s[1])); c.lineTo(X(s[2]), Y(s[3])); c.stroke(); } });
        if (V.mir) K.mirrors.forEach(m => { kit.dot(c, X(m.c[0]), Y(m.c[1]), 3, C.hue(200, 1)); });
        const E = K.eye;
        kit.dot(c, X(E[0]), Y(E[1]), 4, C.accent);
        kit.label(c, 'eyes ' + E[2].toFixed(2) + ' m', X(E[0]) + 6, Y(E[1]) - 9, { size: 10.5, color: C.accent });
        kit.label(c, 'forward →', W - 10, 14, { size: 11, color: C.muted, align: 'right' });
        // the person
        const s = pedStatus(), col = s === 'direct' ? C.ok : s === 'mirror' ? C.warn : s === 'hidden' ? C.bad : C.muted;
        if (s === 'direct') { c.strokeStyle = C.ok; c.lineWidth = 1; c.beginPath(); c.moveTo(X(E[0]), Y(E[1])); c.lineTo(X(ped.x), Y(ped.y)); c.stroke(); }
        kit.dot(c, X(ped.x), Y(ped.y), Math.max(6, 0.25 * k), col, C.text);
        const dist = Math.hypot(Math.max(0, ped.x - fx, -K.L - ped.x), Math.max(0, Math.abs(ped.y) - K.Wd / 2));
        kit.label(c, s === 'direct' ? 'seen' : s === 'mirror' ? 'mirror only' : s === 'hidden' ? 'hidden' : '', X(ped.x) + 10, Y(ped.y) - 10, { size: 11, color: col, bg: C.bg2 });
        ro.set('veh', K.name + ': ' + E[2].toFixed(2) + ' m above the ground');
        ro.set('ped', (s === 'direct' ? 'seen directly' : s === 'mirror' ? 'seen only in a mirror' : s === 'hidden' ? 'hidden from the driver' : 'inside the vehicle outline') + ', ' + dist.toFixed(1) + ' m from the vehicle');
        ro.set('front', G.fr < 0.05 ? 'nothing (seen at the front)' : G.fr.toFixed(1) + ' m in front');
        ro.set('side', G.sd < 0.05 ? 'nothing (seen at the side)' : G.sd.toFixed(1) + ' m from the side');
        ro.set('hid', G.hid.toFixed(1) + ' m²' + (V.mir && K.mirrors.length ? ' with the mirrors' : ''));
        ro.set('hidD', G.hidD.toFixed(1) + ' m²');
      }
      kit.drag(st, {
        hit: p => { if (!T) return null; return Math.hypot(p.x - T.X(ped.x), p.y - T.Y(ped.y)) < 18 ? 1 : null; },
        move: (w, p) => { if (!T) return; ped = { x: clamp((p.x - T.ox) / T.k, G.xmin, G.xmax), y: clamp((T.oy - p.y) / T.k, -G.ymax, G.ymax) }; draw(); },
        hover: true
      });
      st.onResize(() => draw());
      const off = onTheme(draw);
      compute(); draw();
      return off;
    }
  });

  /* ================================================================ mt-cockpit */
  // a flight deck in side view, mm, origin at the design eye position (DEP), x forward, z up. Illustrative geometry:
  // the nose and glareshield edge give 17° of over-the-nose vision from the DEP.
  const CK = { nose: [900, -275], frame: [650, 330], overhead: [250, 380], yoke: [420, -360], pedal: [870, -1050], seatX: [-60, 200], seatZ: [-830, -580], beta: 12, travel: 90 };
  Hyper.sim('mt-cockpit', {
    title: 'Eyes at the design eye position',
    blurb: `A pilot of any sex and percentile on the flight deck of an airliner, in side view and to scale (representative body data). The deck is laid out from the **design eye position** (the cross): from there the view over the nose is 17° below the aircraft's datum, the instruments and the overhead panel are where they should be. Below, the aircraft on a 3° approach: the ground hidden below the nose, the visual segment the runway visual range leaves, and the approach-light bars (every 30 m for 900 m before the threshold) the pilot can see. Geometry illustrative.

**Try this**
- The 5th-percentile woman in a seat left at the mid setting: her eyes are about 110 mm low and the hidden ground ahead nearly doubles. Press *Align the eyes*.
- The 95th-percentile man: aligned, his knees are cramped at the rudder pedals — move the pedals forward.
- The 5th-percentile woman is 1.52 m tall, below the 1.57 m the transport rules design for: even with the pedals fully back she cannot push full rudder, and the overhead panel is out of reach without leaning.
- The 1st-percentile woman: the seat cannot rise far enough; airlines provide seat cushions for exactly this.
- At 30 m with 550 m of runway visual range, count the light bars in view from the design eye position and from 60 mm too low.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 420, maxH: 660 });
      const ctl = kit.controls(box.side, [
        { id: 'sex', type: 'select', label: 'Pilot', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) },
        { id: 'sz', label: 'Seat height (H-point below the design eye)', min: CK.seatZ[0], max: CK.seatZ[1], step: 5, value: -705, unit: 'mm' },
        { id: 'sx', label: 'Seat fore–aft (H-point ahead of the design eye)', min: CK.seatX[0], max: CK.seatX[1], step: 5, value: 70, unit: 'mm' },
        { id: 'pa', label: 'Rudder pedals moved forward by', min: -120, max: 120, step: 10, value: 0, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'align', label: 'Align the eyes', primary: true }, { id: 'mid', label: 'Seat at the mid setting' }] },
        { id: 'h', label: 'Height above the runway on approach', min: 15, max: 150, step: 1, value: 60, unit: 'm' },
        { id: 'pitch', label: 'Nose-up pitch attitude', min: 0, max: 6, step: 0.5, value: 3, unit: '°' },
        { id: 'rvr', label: 'Runway visual range', min: 300, max: 1500, step: 25, value: 800, unit: 'm' }
      ], id => {
        if (id === 'align') { const o = eyeOffset(person()); ctl.set('sz', clamp(Math.round(-o.z / 5) * 5, CK.seatZ[0], CK.seatZ[1])); ctl.set('sx', clamp(Math.round(-o.x / 5) * 5, CK.seatX[0], CK.seatX[1])); }
        if (id === 'mid') { ctl.set('sz', -705); ctl.set('sx', 70); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Pilot'], ['eye', 'Eyes relative to the design eye'], ['nose', 'View over the nose'], ['seg', 'On approach'], ['legs', 'Rudder pedals'], ['over', 'Overhead panel'], ['yoke', 'Control wheel']]);
      const person = () => E.person({ sex: V.sex, p: V.p });
      const be = CK.beta * DEG, tv = { x: -Math.sin(be), z: Math.cos(be) }, fv = { x: Math.cos(be), z: Math.sin(be) };
      const eyeOffset = P => ({ x: (P.eyeHeightSit - 90) * tv.x + 0.045 * P.stature * fv.x, z: (P.eyeHeightSit - 90) * tv.z + 0.045 * P.stature * fv.z });
      const two = (S0, T, L1, L2, down) => { const d = Math.hypot(T.x - S0.x, T.z - S0.z), vx = (T.x - S0.x) / d, vz = (T.z - S0.z) / d; if (d >= L1 + L2) return { ok: false, J: { x: S0.x + vx * L1, z: S0.z + vz * L1 }, E: { x: S0.x + vx * (L1 + L2), z: S0.z + vz * (L1 + L2) }, ang: 180, d }; const l = (L1 * L1 - L2 * L2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, L1 * L1 - l * l)) * (down ? -1 : 1); return { ok: true, J: { x: S0.x + l * vx - h * vz, z: S0.z + l * vz + h * vx }, E: T, ang: Math.acos(clamp((L1 * L1 + L2 * L2 - d * d) / (2 * L1 * L2), -1, 1)) / DEG, d }; };
      function draw() {
        const P = person(), S = P.stature, C = kit.colors(), H = { x: V.sx, z: V.sz }, off = eyeOffset(P);
        const eye = { x: H.x + off.x, z: H.z + off.z };
        const sh = { x: H.x + (P.shoulderHeightSit - 90) * tv.x, z: H.z + (P.shoulderHeightSit - 90) * tv.z };
        const nx = CK.nose[0] - eye.x, nz = eye.z - CK.nose[1], th = Math.atan2(nz, nx) / DEG;
        const hEye = V.h + eye.z / 1000, dHid = th - V.pitch > 0.3 ? hEye / Math.tan((th - V.pitch) * DEG) : Infinity;
        const reach = Math.sqrt(Math.max(0, V.rvr * V.rvr - hEye * hEye));
        const toThr = V.h / Math.tan(3 * DEG) - 300;               // the glide path aims about 300 m beyond the threshold
        const bars = []; for (let s = 0; s <= 900; s += 30) bars.push(toThr - s);
        const seen = bars.filter(x => x >= dHid && x <= reach).length, rwySeen = Math.max(0, reach - Math.max(dHid, toThr));
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(S) + ' mm, sitting eye height ' + Math.round(P.eyeHeightSit) + ' mm');
        const dz = eye.z, dx = eye.x;
        ro.set('eye', (Math.abs(dz) < 8 && Math.abs(dx) < 15 ? 'at the design eye position' : Math.round(Math.abs(dz)) + ' mm ' + (dz < 0 ? 'below' : 'above') + ', ' + Math.round(Math.abs(dx)) + ' mm ' + (dx < 0 ? 'behind' : 'ahead')));
        ro.set('nose', th.toFixed(1) + '° below the datum (17° from the design eye)');
        ro.set('seg', Number.isFinite(dHid) ? Math.round(dHid) + ' m hidden below the nose; ' + (reach > dHid ? 'ground visible to ' + Math.round(reach) + ' m: ' + seen + ' approach-light bars' + (rwySeen > 0 ? ' and ' + Math.round(rwySeen) + ' m of runway' : '') : 'nothing on the ground in view') : 'the nose hides the whole ground ahead');
        // legs: ankle behind the ball of the foot on the pedal
        const a = 0.245 * S, b = 0.246 * S, ped = { x: CK.pedal[0] + V.pa, z: CK.pedal[1] };
        const Af = { x: ped.x + CK.travel - 150, z: ped.z + 60 }, Aa = { x: ped.x - CK.travel - 150, z: ped.z + 60 }, An = { x: ped.x - 150, z: ped.z + 60 };
        const dFull = Math.hypot(Af.x - H.x, Af.z - H.z), dBack = Math.hypot(Aa.x - H.x, Aa.z - H.z);
        const kneeAt = d => Math.acos(clamp((a * a + b * b - d * d) / (2 * a * b), -1, 1)) / DEG;
        ro.set('legs', dFull > 0.97 * (a + b) ? (V.pa <= -120 ? 'cannot push full rudder even with the pedals fully back — outside the design range' : 'cannot push full rudder — move the pedals back') : kneeAt(dBack) < 85 ? 'knee ' + Math.round(kneeAt(dBack)) + '° at full back travel — cramped: move the pedals forward' : 'full travel reached, knee ' + Math.round(kneeAt(dBack)) + '–' + Math.round(kneeAt(dFull)) + '°');
        const L1 = 0.186 * S, L2 = 0.2 * S, ov = { x: CK.overhead[0], z: CK.overhead[1] }, dov = Math.hypot(ov.x - sh.x, ov.z - sh.z);
        ro.set('over', dov <= L1 + L2 ? 'reached with the shoulders on the seat' : 'out of reach by ' + Math.round(dov - L1 - L2) + ' mm — the pilot must lean forward');
        const yk = { x: CK.yoke[0], z: CK.yoke[1] }, arm = two(sh, yk, L1, L2, true);
        ro.set('yoke', arm.ok ? 'elbow ' + Math.round(arm.ang) + '°' : 'out of reach from the backrest');
        // ---- the flight deck
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11.5px ' + font(); c.lineCap = 'round'; c.lineJoin = 'round';
        const topH = Hh * 0.64, k = Math.min((W - 30) / 2200, (topH - 20) / 1750), ox = W * 0.42, oz = 20 + 700 * k;
        const X = x => ox + x * k, Z = z => oz - z * k;
        // structure: floor, glareshield and nose, windscreen, overhead panel, instrument panel
        c.strokeStyle = C.text; c.lineWidth = 2;
        c.beginPath(); c.moveTo(X(-900), Z(-1150)); c.lineTo(X(1200), Z(-1150)); c.stroke();
        c.beginPath(); c.moveTo(X(600), Z(-200)); c.lineTo(X(CK.nose[0]), Z(CK.nose[1])); c.lineTo(X(1250), Z(-600)); c.stroke();
        c.beginPath(); c.moveTo(X(CK.nose[0]), Z(CK.nose[1])); c.lineTo(X(CK.frame[0]), Z(CK.frame[1])); c.lineTo(X(-300), Z(560)); c.lineTo(X(-900), Z(600)); c.stroke();
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.fillRect(X(560), Z(-230), 90 * k, 700 * k); c.strokeRect(X(560), Z(-230), 90 * k, 700 * k);
        kit.label(c, 'instrument panel', X(610), Z(-940), { size: 10, color: C.muted, align: 'center' });
        c.fillRect(X(100), Z(520), 350 * k, 90 * k); c.strokeRect(X(100), Z(520), 350 * k, 90 * k);
        kit.label(c, 'overhead panel', X(275), Z(560) - 16, { size: 10, color: C.muted, align: 'center' });
        // yoke column and rudder pedals
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(X(520), Z(-1150)); c.lineTo(X(yk.x + 30), Z(yk.z - 40)); c.stroke();
        c.lineWidth = 5; c.beginPath(); c.moveTo(X(yk.x), Z(yk.z - 110)); c.lineTo(X(yk.x - 20), Z(yk.z + 110)); c.stroke();
        c.lineWidth = 4; c.beginPath(); c.moveTo(X(ped.x - 40), Z(ped.z - 90)); c.lineTo(X(ped.x + 30), Z(ped.z + 90)); c.stroke();
        c.strokeStyle = C.hue(40, 0.9); c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(ped.x - CK.travel), Z(ped.z - 110)); c.lineTo(X(ped.x + CK.travel), Z(ped.z - 110)); c.stroke();
        // seat with its adjustment box
        c.strokeStyle = C.hue(40, 0.9); c.setLineDash([3, 3]); c.lineWidth = 1; c.strokeRect(X(CK.seatX[0]), Z(CK.seatZ[1]), (CK.seatX[1] - CK.seatX[0]) * k, (CK.seatZ[1] - CK.seatZ[0]) * k); c.setLineDash([]);
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(X(H.x - 170), Z(H.z - 110)); c.lineTo(X(H.x + 330), Z(H.z - 80)); c.lineTo(X(H.x + 330), Z(H.z - 150)); c.lineTo(X(H.x - 190), Z(H.z - 180)); c.closePath(); c.fill(); c.stroke();
        const b0 = { x: H.x - 160, z: H.z - 130 };
        c.beginPath(); c.moveTo(X(b0.x), Z(b0.z)); c.lineTo(X(b0.x + 800 * tv.x), Z(b0.z + 800 * tv.z)); c.lineTo(X(b0.x + 800 * tv.x - 90 * fv.x), Z(b0.z + 800 * tv.z - 90 * fv.z)); c.lineTo(X(b0.x - 90 * fv.x), Z(b0.z - 90 * fv.z)); c.closePath(); c.fill(); c.stroke();
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X(H.x), Z(H.z - 170)); c.lineTo(X(H.x), Z(-1150)); c.stroke();
        // sight line over the nose
        const far = 2400, sl = { x: eye.x + far, z: eye.z - far * nz / nx };
        c.strokeStyle = C.hue(48, 1); c.setLineDash([6, 4]); c.lineWidth = 1.3; c.beginPath(); c.moveTo(X(eye.x), Z(eye.z)); c.lineTo(X(Math.min(1250, sl.x)), Z(eye.z - (Math.min(1250, sl.x) - eye.x) * nz / nx)); c.stroke(); c.setLineDash([]);
        // the design eye position
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(-40), Z(0)); c.lineTo(X(40), Z(0)); c.moveTo(X(0), Z(-40)); c.lineTo(X(0), Z(40)); c.stroke();
        kit.label(c, 'design eye', X(0) - 6, Z(0) - 14, { size: 10.5, color: C.accent, align: 'right' });
        // the pilot
        const col = sexCol(C, V.sex);
        c.strokeStyle = col; c.fillStyle = col;
        const seg = (p1, p2, w) => { c.lineWidth = Math.max(2, w * k); c.beginPath(); c.moveTo(X(p1.x), Z(p1.z)); c.lineTo(X(p2.x), Z(p2.z)); c.stroke(); };
        const leg = two(H, An, a, b, false);
        seg(H, leg.J, 0.075 * S); seg(leg.J, leg.E, 0.055 * S); seg(leg.E, { x: ped.x, z: ped.z }, 0.04 * S);
        seg(H, sh, 0.11 * S); seg(sh, arm.J, 0.045 * S); seg(arm.J, arm.E, 0.04 * S);
        const hc = { x: H.x + (P.sittingHeight - 90 - 0.065 * S) * tv.x + 0.02 * S * fv.x, z: H.z + (P.sittingHeight - 90 - 0.065 * S) * tv.z + 0.02 * S * fv.z };
        c.beginPath(); c.arc(X(hc.x), Z(hc.z), 0.065 * S * k, 0, 6.283); c.fill();
        kit.dot(c, X(eye.x), Z(eye.z), 3, C.bg2);
        if (dov > L1 + L2) { c.strokeStyle = C.bad; c.setLineDash([3, 3]); c.lineWidth = 1; c.beginPath(); c.moveTo(X(sh.x), Z(sh.z)); c.lineTo(X(ov.x), Z(ov.z)); c.stroke(); c.setLineDash([]); }
        kit.label(c, th.toFixed(1) + '° over the nose', X(CK.nose[0]) + 8, Z(CK.nose[1]) + 14, { size: 11, color: C.hue(48, 1) });
        // ---- the approach, heights exaggerated
        const y0 = topH + 16, y1 = Hh - 22, gx0 = 20, gx1 = W - 16, span = Math.max(1200, toThr + 400), GX = m => gx0 + m / span * (gx1 - gx0);
        const zmax = Math.max(40, V.h * 1.3), GZ = m => y1 - m / zmax * (y1 - y0 - 10);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(gx0, y1); c.lineTo(gx1, y1); c.stroke();
        c.fillStyle = C.faint; if (toThr < span) c.fillRect(GX(Math.max(0, toThr)), y1 - 3, GX(span) - GX(Math.max(0, toThr)), 3);
        bars.forEach(x => { if (x > 0 && x < span) kit.dot(c, GX(x), y1 - 1, 2.2, x >= dHid && x <= reach ? C.warn : C.muted); });
        if (toThr > 0 && toThr < span) kit.label(c, 'threshold', GX(toThr), y1 + 11, { size: 10, align: 'center', color: C.muted });
        // hidden and visible ground
        if (Number.isFinite(dHid)) { c.fillStyle = C.hue(0, 0.25); c.fillRect(GX(0), y1 - 6, GX(Math.min(span, dHid)) - GX(0), 6); c.fillStyle = C.hue(140, 0.3); if (reach > dHid) c.fillRect(GX(Math.min(span, dHid)), y1 - 6, GX(Math.min(span, reach)) - GX(Math.min(span, dHid)), 6); }
        c.strokeStyle = C.hue(48, 1); c.setLineDash([5, 4]); c.lineWidth = 1.2;
        if (Number.isFinite(dHid) && dHid < span) { c.beginPath(); c.moveTo(GX(0), GZ(V.h)); c.lineTo(GX(dHid), y1); c.stroke(); }
        c.setLineDash([]);
        // glide path and the aircraft
        c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(GX(0), GZ(V.h)); c.lineTo(GX(Math.min(span, toThr + 300)), GZ(Math.max(0, V.h - Math.min(span, toThr + 300) * Math.tan(3 * DEG)))); c.stroke();
        c.fillStyle = C.text; c.beginPath(); c.moveTo(GX(0) + 14, GZ(V.h)); c.lineTo(GX(0) - 10, GZ(V.h) - 5); c.lineTo(GX(0) - 10, GZ(V.h) + 5); c.closePath(); c.fill();
        kit.label(c, V.h + ' m', GX(0) + 16, GZ(V.h) - 10, { size: 10.5, color: C.text });
        kit.label(c, (Number.isFinite(dHid) ? Math.round(dHid) + ' m hidden · ' : '') + seen + ' light bars in view · heights not to scale', gx1, y0 + 4, { size: 10.5, color: C.muted, align: 'right' });
      }
      st.onResize(() => draw());
      const offT = onTheme(draw);
      draw();
      return offT;
    }
  });

  /* ================================================================ mt-steps-access */
  // entrances in mm: floor height above the road, number of equal risers, handhold from lo to hi above the road
  const SA = {
    truck: { name: 'Truck, high cab', H: 1350, n: 4, lo: 1100, hi: 2600, door: 1650, kneel: false },
    low: { name: 'Truck, low-entry cab', H: 600, n: 2, lo: 800, hi: 2200, door: 1800, kneel: false },
    bus: { name: 'City bus, low floor', H: 340, n: 1, lo: 700, hi: 2000, door: 1900, kneel: true },
    coach: { name: 'Coach', H: 1150, n: 4, lo: 800, hi: 2100, door: 1900, kneel: false },
    loader: { name: 'Wheel loader', H: 1650, n: 5, lo: 1150, hi: 3150, door: 1600, kneel: false }
  };
  Hyper.sim('mt-steps-access', {
    title: 'Steps and handholds into a vehicle',
    blurb: `The entrance of a truck cab, a bus, a coach or a wheel loader in side view, with equal risers from the road (or the kerb) to the floor and a vertical handhold beside the door. A person of any sex and percentile stands at the foot of the steps, drawn to scale (link lengths from Drillis and Contini); the dashed outline shows the same person on the last step. The read-outs judge each step-up against the person's knee height (a simple guide: up to about half the knee height is as easy as a stair; beyond about 85 % the arms must pull), whether the handhold can be grasped from the ground and still held on the last step, and how fast a jump down would land.

**Try this**
- High cab, 5th-percentile woman: four risers of about 340 mm are hard work for her; the handhold starts within reach. Try three risers.
- Raise the bottom of the handhold to 1.6 m: she can no longer take hold before the first step.
- Low-floor bus with kneeling from a 150 mm kerb: a single small step, and a ramp gentle enough for a wheelchair. Switch the kneeling off and lower the kerb.
- Wheel loader: 1.65 m of climbing — five risers, a long handhold, and never jump.`,
    mount(box, kit) {
      const E = kit.ergo, SG = E.SEGMENTS;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 400, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.keys(SA).map(k => [SA[k].name, k]), value: 'truck' },
        { id: 'sex', type: 'select', label: 'Person', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 5, fmt: v => ord(v) },
        { id: 'H', label: 'Floor height above the road', min: 250, max: 2000, step: 10, value: 1350, unit: 'mm' },
        { id: 'n', label: 'Number of equal risers', min: 1, max: 7, step: 1, value: 4 },
        { id: 'lo', label: 'Handhold from (above the road)', min: 400, max: 2200, step: 10, value: 1100, unit: 'mm' },
        { id: 'hi', label: 'Handhold up to', min: 1000, max: 3600, step: 10, value: 2600, unit: 'mm' },
        { id: 'kerb', label: 'Kerb or platform height', min: 0, max: 300, step: 10, value: 0, unit: 'mm' },
        { id: 'kneel', type: 'check', label: 'Bus kneels (lowers the entry by 70 mm)', value: true }
      ], id => {
        if (id === 'veh') { const P = SA[V.veh]; ctl.set('H', P.H); ctl.set('n', P.n); ctl.set('lo', P.lo); ctl.set('hi', P.hi); ctl.set('kerb', V.veh === 'bus' ? 150 : 0); }
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Person'], ['r', 'Each riser'], ['step', 'Step-up for this person'], ['grip', 'Handhold from the ground'], ['top', 'Handhold on the last step'], ['jump', 'Jumping down instead'], ['ramp', 'Ramp (1.0 m) for a wheelchair']]);
      function draw() {
        const K = SA[V.veh], P = E.person({ sex: V.sex, p: V.p }), S = P.stature, shoe = 25, C = kit.colors();
        const kneel = K.kneel && V.kneel ? 70 : 0, floor = V.H - kneel, base = V.kerb, rise = Math.max(0, floor - base), n = Math.max(1, Math.round(V.n)), r = rise / n;
        const knee = SG.knee * S + shoe, dem = (r + 50) / knee;
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(S) + ' mm; knee height ' + Math.round(knee) + ' mm in shoes');
        ro.set('r', Math.round(r) + ' mm × ' + n + (base > 0 ? ' (from a ' + base + ' mm kerb)' : '') + (r > 400 ? ' — above the usual 250–400 mm' : r < 150 && n > 1 ? ' — fewer steps would do' : ''));
        ro.set('step', Math.round(100 * dem) + ' % of knee height — ' + (dem <= 0.55 ? 'easy, like a stair' : dem <= 0.85 ? 'needs the handholds' : dem <= 1 ? 'hard: pulls up with the arms' : 'too high for this person'));
        const reachUp = P.gripReachUp + shoe - 100, reachLow = P.knuckleHeight + shoe;
        const gripOK = V.lo <= reachUp + base && V.hi >= reachLow + base;
        ro.set('grip', gripOK ? 'can take hold before the first step (comfortable reach ' + Math.round(reachUp + base) + ' mm)' : V.lo > reachUp + base ? 'out of reach: the handhold starts ' + Math.round(V.lo - reachUp - base) + ' mm too high' : 'the handhold ends below the hand');
        const lastStep = floor - r, needTop = lastStep + P.elbowHeight + shoe;
        ro.set('top', V.hi >= needTop ? 'still held at elbow height or above' : 'ends ' + Math.round(needTop - V.hi) + ' mm too low: nothing to hold on the last step');
        const v = Math.sqrt(2 * 9.81 * rise / 1000);
        ro.set('jump', rise > 0 ? 'from the floor: ' + v.toFixed(1) + ' m/s landing; one riser at a time: ' + Math.sqrt(2 * 9.81 * r / 1000).toFixed(1) + ' m/s' : '—');
        ro.set('ramp', rise <= 0 ? 'level: no ramp needed' : rise > 400 ? 'too high for a ramp: wheelchair users need a lift' : (rise / 10).toFixed(0) + ' %' + (rise / 1000 > 0.12 ? ' — steeper than 12 %: needs help or a longer ramp' : ' — within 12 %'));
        // drawing
        const c = st.begin(), W = st.W, Hh = st.H;
        c.font = '11.5px ' + font(); c.lineCap = 'round'; c.lineJoin = 'round';
        const zTop = Math.max(floor + K.door + 150, V.hi + 150, S + 150), k = Math.min((Hh - 30) / zTop, (W - 20) / 3400), gx = 30, gz = Hh - 18;
        const X = x => gx + x * k, Z = z => gz - z * k;
        // road and kerb
        c.fillStyle = C.faint; c.fillRect(0, Z(0), W, Hh - Z(0));
        if (base > 0) { c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.muted; c.fillRect(X(0), Z(base), 1500 * k, base * k); c.strokeRect(X(0), Z(base), 1500 * k, base * k); kit.label(c, 'kerb ' + base + ' mm', X(60), Z(base) + 10, { size: 10.5, color: C.muted }); }
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(0, Z(0)); c.lineTo(W, Z(0)); c.stroke();
        // vehicle: steps rise to the right, into the door
        const x0 = 1500, tread = 190;
        c.fillStyle = C.surface2 || C.surface; c.strokeStyle = C.text; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(X(x0 + (n - 1) * tread), Z(Math.max(0, floor - 450))); c.lineTo(X(3400), Z(Math.max(0, floor - 450))); c.lineTo(X(3400), Z(floor + K.door + 120)); c.lineTo(X(x0 + (n - 1) * tread + 40), Z(floor + K.door + 120)); c.stroke();
        c.beginPath(); c.moveTo(X(x0 + (n - 1) * tread), Z(floor)); c.lineTo(X(3400), Z(floor)); c.stroke();
        kit.label(c, 'floor ' + Math.round(floor) + ' mm', X(x0 + n * tread + 60), Z(floor) - 10, { size: 11 });
        c.fillStyle = C.hue(40, 0.55); c.strokeStyle = C.text; c.lineWidth = 1.2;
        for (let i = 1; i < n; i++) { const z = base + i * r, xx = x0 + (i - 1) * tread; c.fillRect(X(xx), Z(z), tread * k, 22 * k + 1); c.strokeRect(X(xx), Z(z), tread * k, 22 * k + 1); }
        // the handhold
        c.strokeStyle = C.hue(200, 1); c.lineWidth = Math.max(3, 32 * k);
        const hx = x0 - 60;
        c.beginPath(); c.moveTo(X(hx), Z(V.lo)); c.lineTo(X(hx), Z(V.hi)); c.stroke();
        kit.label(c, 'handhold ' + V.lo + '–' + V.hi, X(hx) - 6, Z(V.hi) - 10, { size: 10.5, color: C.hue(200, 1), align: 'right' });
        // a standing figure: feet at (fx, fz)
        const col = sexCol(C, V.sex);
        const figure = (fx, fz, handZ, ghost) => {
          const z = s => fz + shoe + s * S, sh = { x: fx + 0.02 * S, z: z(SG.shoulder) }, hip = { x: fx, z: z(SG.hip) };
          c.globalAlpha = ghost ? 0.45 : 1; c.strokeStyle = col; c.fillStyle = col; if (ghost) c.setLineDash([4, 3]);
          const L = (a, b, w) => { c.lineWidth = Math.max(ghost ? 1.5 : 2, w * k); c.beginPath(); c.moveTo(X(a.x), Z(a.z)); c.lineTo(X(b.x), Z(b.z)); c.stroke(); };
          L({ x: fx, z: fz + shoe }, { x: fx + 0.01 * S, z: z(SG.knee) }, 0.055 * S); L({ x: fx + 0.01 * S, z: z(SG.knee) }, hip, 0.07 * S);
          L(hip, sh, 0.12 * S);
          // arm up to the handhold if in reach, else hanging
          const L1 = SG.upperArm * S, L2 = (SG.forearm + SG.hand / 2) * S, tgt = { x: hx, z: clamp(handZ, V.lo, V.hi) }, d = Math.hypot(tgt.x - sh.x, tgt.z - sh.z);
          if (d <= L1 + L2 && handZ >= V.lo - 1 && handZ <= V.hi + 1) {
            const vx = (tgt.x - sh.x) / d, vz = (tgt.z - sh.z) / d, l = (L1 * L1 - L2 * L2 + d * d) / (2 * d), hgt = Math.sqrt(Math.max(0, L1 * L1 - l * l));
            const el = { x: sh.x + l * vx + hgt * vz, z: sh.z + l * vz - hgt * vx };
            L(sh, el, 0.045 * S); L(el, tgt, 0.04 * S);
          } else { L(sh, { x: sh.x + 0.05 * S, z: z(SG.wristStanding) }, 0.045 * S); }
          c.setLineDash([]);
          c.beginPath(); c.arc(X(fx + 0.03 * S), Z(z(SG.eye) + 0.02 * S), 0.065 * S * k, 0, 6.283); c.fill();
          c.globalAlpha = 1;
        };
        const standX = x0 - 420;
        figure(standX, base, Math.min(V.hi, Math.max(V.lo, Math.min(reachUp + base, P.shoulderHeight + shoe + base + 150))), false);
        if (n >= 1) figure(x0 + (n - 2) * tread + tread * 0.4, floor - r, Math.min(V.hi, lastStep + P.elbowHeight + shoe + 100), true);
        kit.label(c, K.name + (kneel ? ' (kneeling)' : ''), 10, 14, { size: 12 });
        kit.label(c, Math.round(r) + ' mm risers', X(x0 + (n - 1) * tread) + 8, Z(base + r / 2), { size: 11, color: dem > 0.85 ? C.bad : dem > 0.55 ? C.warn : C.ok });
      }
      st.onResize(() => draw());
      const off = onTheme(draw);
      draw();
      return off;
    }
  });

  /* ================================================================ mt-standing-passenger */
  const SP_STYLE = { smooth: { a: 1.0, b: 1.0, j: 1.5, name: 'smooth' }, normal: { a: 1.5, b: 1.5, j: 3, name: 'normal' }, harsh: { a: 2.5, b: 2.5, j: 6, name: 'harsh' }, emergency: { a: 1.5, b: 4.5, j: 15, name: 'emergency stop' } };
  // one cycle: jerk-limited pull-away to 50 km/h, cruise, braking to a stop, dwell; returns a(t) samples every 0.02 s
  function spProfile(s) {
    const vmax = 50 / 3.6, out = [], dt = 0.02;
    const pulse = (A, J, dv, sign) => { const tr = A / J, tp = Math.max(0, dv / A - tr), pts = []; for (let t = 0; t < 2 * tr + tp; t += dt) pts.push(sign * (t < tr ? J * t : t < tr + tp ? A : Math.max(0, A - J * (t - tr - tp)))); return pts; };
    const push = (arr) => arr.forEach(a => out.push(a));
    push(new Array(Math.round(1.5 / dt)).fill(0));
    push(pulse(s.a, s.j, vmax, 1));
    push(new Array(Math.round(3 / dt)).fill(0));
    push(pulse(s.b, s.j, vmax, -1));
    push(new Array(Math.round(2 / dt)).fill(0));
    return { a: out, dt };
  }
  Hyper.sim('mt-standing-passenger', {
    title: 'Standing in a moving bus',
    blurb: `A standing passenger of any size in a bus that pulls away to 50 km/h, cruises and stops, with the acceleration shaped by the driving style (jerk-limited). In the bus the passenger feels a tilted gravity — gravity plus the opposite of the bus's acceleration (the yellow line from the centre of mass). While it passes between the feet the passenger stays up without holding; when it leaves the base, they must step, grab — or fall. With a hold, the read-out gives the hand force from the moments about the edge of the feet, $F = m\\,(a h - g b/2)/h_r$, against the force the hand can hold. A static model: real people also sway, step and bend.

**Try this**
- Normal driving, feet side by side facing forward, no hold: the pull-away already takes the passenger to the edge. Turn sideways with the feet apart.
- Emergency stop: nobody stays up without a hold. Hold a pole at waist height, then an overhead rail — the higher grip needs about half the force.
- An older or frailer passenger with a weaker hold (lower the hand force to 60 N): only smooth driving keeps her safe.
- Compare a 5th-percentile woman and a 95th-percentile man: the heavier passenger needs more force, but also has a higher centre of mass.`,
    mount(box, kit) {
      const E = kit.ergo;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300, maxH: 460 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px'; box.stage.appendChild(gb);
      const plot = kit.plot(gb, { x: { label: 'time (s)', min: 0 }, y: { label: 'acceleration (m/s²)', min: -5, max: 3 }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'style', type: 'select', label: 'Driving', options: Object.keys(SP_STYLE).map(k => [SP_STYLE[k].name, k]), value: 'normal' },
        { id: 'sex', type: 'select', label: 'Passenger', options: [['Woman', 'f'], ['Man', 'm']], value: 'f' },
        { id: 'p', label: 'Percentile', min: 1, max: 99, step: 1, value: 50, fmt: v => ord(v) },
        { id: 'stance', type: 'select', label: 'Stance', options: [['facing forward, feet side by side', 'fwd'], ['facing forward, one foot ahead (stride)', 'stride'], ['facing sideways, feet apart', 'side'], ['facing sideways, feet together', 'sideT']], value: 'fwd' },
        { id: 'hold', type: 'select', label: 'Holding', options: [['nothing', 0], ['a pole at waist height (1.0 m)', 1.0], ['an overhead rail (1.75 m)', 1.75]], value: 0 },
        { id: 'cap', label: 'Force the hand can hold', min: 40, max: 300, step: 10, value: 150, unit: 'N' },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the trip' }] }
      ], id => { if (id === 'restart' || id === 'style') { t0 = null; counts = { step: 0, lost: 0 }; } setup(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['who', 'Passenger'], ['lim', 'Stays up without holding up to'], ['a', 'Bus now'], ['F', 'Hand force now / at the peak'], ['state', 'Passenger'], ['n', 'This trip']]);
      let prof = null, t0 = null, counts = { step: 0, lost: 0 }, lastBad = false, x = 0;
      function body() {
        const P = E.person({ sex: V.sex, p: V.p }), S = P.stature, h = 0.55 * S / 1000;
        const b = (V.stance === 'fwd' ? P.footLength : V.stance === 'stride' ? 0.28 * S : V.stance === 'side' ? 0.24 * S + P.footBreadth : 2 * P.footBreadth) / 1000;
        return { P, S, h, b, m: P.weight, lim: 9.81 * b / (2 * h) };
      }
      function setup() {
        prof = spProfile(SP_STYLE[V.style]);
        const B = body(), C = kit.colors(), T = prof.a.length * prof.dt;
        const pts = prof.a.map((a, i) => [i * prof.dt, a]);
        const fpeak = V.hold > 0 ? Math.max(...prof.a.map(a => Math.max(0, B.m * (Math.abs(a) * B.h - 9.81 * B.b / 2) / V.hold))) : 0;
        B.fpeak = fpeak;
        plot.set({ x: { label: 'time (s)', min: 0, max: T }, series: [{ pts, label: 'bus acceleration', color: C.accent, width: 2 }], hlines: [{ y: B.lim, label: 'no-hold limit' }, { y: -B.lim, label: '' }, { y: 1.5, label: 'comfort ±1.5' }, { y: -1.5, label: '' }] });
        ro.set('who', who(V.sex, V.p) + ', ' + Math.round(B.m) + ' kg, centre of mass ' + B.h.toFixed(2) + ' m, base ' + Math.round(B.b * 1000) + ' mm');
        ro.set('lim', B.lim.toFixed(2) + ' m/s²');
        cur = B;
      }
      let cur = null;
      setup();
      const loop = kit.loop((dt, tt) => {
        if (t0 == null) t0 = tt;
        if (tt < t0) t0 = tt;
        const B = cur, T = prof.a.length * prof.dt, t = (((tt - t0) % T) + T) % T, i = clamp(Math.floor(t / prof.dt), 0, prof.a.length - 1);
        const a = prof.a[i], jerk = i > 0 ? (prof.a[i] - prof.a[i - 1]) / prof.dt : 0;
        const need = Math.abs(a) > B.lim;
        const F = V.hold > 0 ? Math.max(0, B.m * (Math.abs(a) * B.h - 9.81 * B.b / 2) / V.hold) : 0;
        const bad = need && (V.hold === 0 || F > V.cap);
        if (bad && !lastBad && dt > 0) { if (V.hold === 0) counts.step++; else counts.lost++; }
        lastBad = bad;
        ro.set('a', (a >= 0 ? '+' : '') + a.toFixed(2) + ' m/s² (' + (a > 0.05 ? 'pulling away' : a < -0.05 ? 'braking' : 'steady') + '), jerk ' + jerk.toFixed(1) + ' m/s³');
        ro.set('F', V.hold > 0 ? Math.round(F) + ' N / ' + Math.round(B.fpeak) + ' N' : 'no hold');
        ro.set('state', bad ? (V.hold === 0 ? 'must step or grab — or falls' : 'the hold gives way') : need ? 'upright thanks to the hold' : 'upright without effort');
        ro.set('n', counts.step + ' stumbles without a hold, ' + counts.lost + ' lost holds');
        plot.set({ vlines: [{ x: t, label: '' }] });
        // draw the bus interior and the passenger
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '11.5px ' + font(); c.lineCap = 'round';
        let v = 0; for (let j = 0; j <= i; j++) v += prof.a[j] * prof.dt;
        x += Math.max(0, v) * dt;
        const k = (H - 40) / 2300, fl = H - 22, cx = W * 0.45, X = m => cx + m * 1000 * k, Z = m => fl - m * 1000 * k;
        // windows scrolling past
        c.fillStyle = C.surface; c.fillRect(0, Z(2.2), W, Z(0.95) - Z(2.2));
        c.strokeStyle = C.muted; c.lineWidth = 1;
        const off = (x * 1000 * k) % 120;
        for (let px = -off; px < W; px += 120) { c.beginPath(); c.moveTo(px, Z(2.1)); c.lineTo(px + 40, Z(1.05)); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(0, fl); c.lineTo(W, fl); c.moveTo(0, Z(2.25)); c.lineTo(W, Z(2.25)); c.stroke();
        kit.label(c, 'direction of travel →', W - 10, Z(2.25) + 12, { size: 11, color: C.muted, align: 'right' });
        // pole and rail
        c.strokeStyle = C.hue(50, 1); c.lineWidth = Math.max(3, 35 * k);
        c.beginPath(); c.moveTo(X(0.45), fl); c.lineTo(X(0.45), Z(2.25)); c.stroke();
        c.beginPath(); c.moveTo(0, Z(1.8)); c.lineTo(W, Z(1.8)); c.stroke();
        // passenger: upright, feet spanning b along the bus (drawn as the base), CoM at h
        const S = B.S / 1000, col = sexCol(C, V.sex), lean = clamp(-Math.atan2(a, 9.81) * 0.6 + (bad ? -Math.sign(a) * 0.25 : 0), -0.6, 0.6);
        const foot0 = -B.b / 2, foot1 = B.b / 2;
        c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(X(foot0), fl - 2); c.lineTo(X(foot1), fl - 2); c.stroke();
        const R = (px, pz) => ({ x: px * Math.cos(lean) + pz * Math.sin(lean), z: -px * Math.sin(lean) + pz * Math.cos(lean) });
        const pt = (px, pz) => { const q = R(px, pz); return [X(q.x), Z(q.z)]; };
        c.strokeStyle = bad ? C.bad : col; c.fillStyle = bad ? C.bad : col;
        const L = (p1, p2, w) => { c.lineWidth = Math.max(2, w * 1000 * k); c.beginPath(); c.moveTo(...p1); c.lineTo(...p2); c.stroke(); };
        L(pt(0, 0.04), pt(0, 0.53 * S), 0.07 * S); L(pt(0, 0.53 * S), pt(0, 0.82 * S), 0.12 * S);
        const shp = R(0, 0.82 * S);
        if (V.hold > 0) { const hx = V.hold > 1.5 ? 0.15 : 0.45, hz = V.hold; c.lineWidth = Math.max(2, 0.04 * S * 1000 * k); c.beginPath(); c.moveTo(X(shp.x), Z(shp.z)); c.lineTo(X((shp.x + hx) / 2 + 0.05), Z((shp.z + hz) / 2 - (V.hold > 1.5 ? 0 : 0.08))); c.lineTo(X(hx), Z(hz)); c.stroke(); }
        else L(pt(0, 0.82 * S), pt(0.05, 0.5 * S), 0.04 * S);
        const hp = pt(0, 0.93 * S);
        c.beginPath(); c.arc(hp[0], hp[1], 0.065 * S * 1000 * k, 0, 6.283); c.fill();
        // centre of mass and the tilted gravity
        const cm = [X(0), Z(B.h)], hit = -a * B.h / 9.81;          // the tilted gravity (−a, −g) from the centre of mass meets the floor here
        kit.dot(c, cm[0], cm[1], 4, C.bg2, C.text);
        c.strokeStyle = C.hue(48, 1); c.lineWidth = 2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(cm[0], cm[1]); c.lineTo(X(hit), fl); c.stroke(); c.setLineDash([]);
        kit.label(c, 'tilted gravity', X(hit) + (a > 0 ? -6 : 6), fl - 12, { size: 10.5, color: C.hue(48, 1), align: a > 0 ? 'right' : 'left' });
        kit.label(c, (a >= 0 ? '+' : '') + a.toFixed(1) + ' m/s²', 12, 16, { size: 13, weight: 600, color: Math.abs(a) > B.lim ? C.bad : Math.abs(a) > 1.5 ? C.warn : C.text });
        kit.label(c, 'feet ' + Math.round(B.b * 1000) + ' mm along the bus', X(foot1) + 8, fl - 8, { size: 10.5, color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

})();
