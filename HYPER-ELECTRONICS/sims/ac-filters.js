/* HYPER-ELECTRONICS · sims/ac-filters.js — simulations for AC and Signals and for
 * Filters and Frequency Response: a waveform lab, Fourier synthesis with a line
 * spectrum, RL and RLC step responses, phasors of a series RLC circuit, AC power and
 * power-factor correction, resonance (and the self-resonance of real capacitors), a
 * Bode plotter with the filter on the scope, and three-phase supply.
 * Circuits are solved by kit.Circuit (transients with c.step, responses with c.ac)
 * and drawn with kit.schem; time signals go on kit.schem.scope, Bode plots on kit.plot. */
(function () {
  'use strict';

  const TAU = 2 * Math.PI;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const dB = x => 20 * Math.log10(Math.max(Math.abs(x), 1e-12));
  const logspace = (a, b, n) => { const o = []; for (let k = 0; k < n; k++) o.push(a * Math.pow(b / a, k / (n - 1))); return o; };
  /* the smallest 1–2–5 step that is at least x (for volts and seconds per division) */
  function niceUp(x) {
    if (!(x > 0) || !Number.isFinite(x)) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(x)));
    const f = x / p;
    return (f <= 1.0001 ? 1 : f <= 2.0001 ? 2 : f <= 5.0001 ? 5 : 10) * p;
  }
  const perDiv = (vmax, divs) => niceUp(Math.max(Math.abs(vmax), 1e-6) / divs);
  /* the scope's own trace colours, and theme hues that match them for drawings beside it */
  const SC = ['#f4e04d', '#4dd6f4', '#f47ad6', '#7bf47a'];
  const HUE = [48, 192, 318, 125];
  /* complex numbers for phasors */
  const cx = (re, im) => ({ re, im });
  const csub = (a, b) => cx(a.re - b.re, a.im - b.im);
  const cadd = (a, b) => cx(a.re + b.re, a.im + b.im);
  const cscale = (a, k) => cx(a.re * k, a.im * k);
  const cdiv = (a, b) => { const d = (b.re * b.re + b.im * b.im) || 1e-300; return cx((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cabs = a => Math.hypot(a.re, a.im);
  const carg = a => Math.atan2(a.im, a.re);
  const deg = r => r * 180 / Math.PI;
  const rotate = (p, a) => cx(p.re * Math.cos(a) - p.im * Math.sin(a), p.re * Math.sin(a) + p.im * Math.cos(a));
  const fromAc = r => cx(r.re, r.im);
  /* the instantaneous value of a (peak) phasor: v(t) = Im(V e^{jωt}) = |V| sin(ωt + arg V) */
  const inst = (p, w, t) => p.re * Math.sin(w * t) + p.im * Math.cos(w * t);

  /* a phasor as an arrow from (ox, oy), k pixels per unit; returns the tip */
  function arrowP(kit, c, ox, oy, p, k, col, label, w) {
    const x2 = ox + p.re * k, y2 = oy - p.im * k;
    if (Number.isFinite(x2) && Number.isFinite(y2)) {
      kit.arrow(c, ox, oy, x2, y2, col, w || 2.4);
      if (label) kit.label(c, label, x2 + (p.re >= 0 ? 6 : -6), y2 + (p.im >= 0 ? -9 : 11), { size: 12, color: col, align: p.re >= 0 ? 'left' : 'right', weight: 600 });
    }
    return [x2, y2];
  }
  /* a dashed line between two points */
  function dashed(c, x1, y1, x2, y2, col, w) {
    if (![x1, y1, x2, y2].every(Number.isFinite)) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 1.2; c.setLineDash([5, 4]);
    c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }
  /* a horizontal level across a scope screen, with a label at its right end */
  function level(kit, c, x, w, top, h, y, col, text, left) {
    if (!(y >= top + 1 && y <= top + h - 1)) return;
    dashed(c, x, y, x + w, y, col, 1.6);
    kit.label(c, text, left ? x + 8 : x + w - 8, y - 9, { size: 11.5, color: col, align: left ? 'left' : 'right', weight: 600 });
  }

  /* ================================================================ waveform lab */
  Hyper.sim('acf-waveforms', {
    title: 'Waveform lab: peak, average and RMS',
    blurb: `The instrument samples one period of the waveform and measures it live. On the screen, the dashed lines are the **average** (green) and the **RMS** level (pink); the lower panel plots $v^2$, whose mean is the square of the RMS — the heating effect.

- Compare a sine, a square and a triangle of the same peak: RMS is $0.707$, $1$ and $0.577$ times the peak.
- Choose the PWM pulse train and move the duty cycle $D$: the average goes as $D$, the RMS as $\\sqrt{D}$.
- Add a DC offset to a sine: the RMS rises, the RMS of the AC part does not.
- Watch the last read-out: a cheap averaging meter is calibrated for sines, so it is right for a sine and wrong for anything else.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Waveform', value: params.shape || 'sine',
          options: [['Sine', 'sine'], ['Square', 'square'], ['Triangle', 'triangle'], ['Sawtooth', 'saw'], ['PWM pulse train', 'pwm'], ['Half-wave rectified sine', 'half'], ['Full-wave rectified sine', 'full']] },
        { id: 'amp', label: 'Amplitude (peak)', min: 0.5, max: 10, step: 0.1, value: 5, unit: 'V' },
        { id: 'dc', label: 'DC offset', min: -5, max: 5, step: 0.1, value: 0, unit: 'V' },
        { id: 'duty', label: 'Duty cycle D', min: 1, max: 99, step: 1, value: 25, unit: '%' },
        { id: 'sq', type: 'check', label: 'Show v² (the heating effect)', value: true }
      ], () => { measure(); dirty = true; });
      const ro = kit.readout(box.side, [['pk', 'Peak |v| max'], ['pp', 'Peak-to-peak'], ['avg', 'Average (DC)'], ['rav', 'Rectified average'], ['rms', 'RMS (true)'],
        ['acrms', 'RMS of the AC part'], ['cf', 'Crest factor'], ['ff', 'Form factor'], ['meter', 'Averaging meter reads']]);
      const V = ctl.values;
      const T = 1e-3;                       // one period: 1 ms (1 kHz)
      let m = { avg: 0, rav: 0, rms: 0, mx: 1, mn: -1 }, dirty = true;

      function wave(u) {
        const A = V.amp;
        u -= Math.floor(u);
        let v;
        switch (V.shape) {
          case 'square': v = u < 0.5 ? A : -A; break;
          case 'triangle': v = u < 0.25 ? 4 * A * u : u < 0.75 ? A * (2 - 4 * u) : A * (4 * u - 4); break;
          case 'saw': v = A * (2 * u - 1); break;
          case 'pwm': v = u < V.duty / 100 ? A : 0; break;
          case 'half': v = Math.max(0, A * Math.sin(TAU * u)); break;
          case 'full': v = A * Math.abs(Math.sin(TAU * u)); break;
          default: v = A * Math.sin(TAU * u);
        }
        return v + V.dc;
      }
      function measure() {
        ctl.show('duty', V.shape === 'pwm');
        const N = 4000;
        let s = 0, sa = 0, s2 = 0, mx = -Infinity, mn = Infinity;
        const vals = new Float64Array(N);
        for (let k = 0; k < N; k++) {
          const v = wave((k + 0.5) / N);
          vals[k] = v; s += v; sa += Math.abs(v); s2 += v * v;
          if (v > mx) mx = v; if (v < mn) mn = v;
        }
        // the exact crests of the sine-based shapes, which midpoint samples just miss
        if (V.shape === 'sine' || V.shape === 'half' || V.shape === 'full') mx = Math.max(mx, V.amp + V.dc);
        if (V.shape === 'sine') mn = Math.min(mn, -V.amp + V.dc);
        const avg = s / N, rav = sa / N, rms = Math.sqrt(s2 / N);
        const acrms = Math.sqrt(Math.max(0, rms * rms - avg * avg));
        let sac = 0;
        for (let k = 0; k < N; k++) sac += Math.abs(vals[k] - avg);
        const meter = Math.PI / (2 * Math.SQRT2) * sac / N;     // an AC-coupled, average-responding meter scaled for sines
        const pk = Math.max(Math.abs(mx), Math.abs(mn));
        m = { avg, rav, rms, acrms, meter, pk, mx, mn };
        ro.set('pk', kit.eng(pk, 'V'));
        ro.set('pp', kit.eng(mx - mn, 'V'));
        ro.set('avg', kit.eng(Math.abs(avg) < 1e-9 ? 0 : avg, 'V'));
        ro.set('rav', kit.eng(rav, 'V'));
        ro.set('rms', kit.eng(rms, 'V'));
        ro.set('acrms', kit.eng(acrms < 1e-9 ? 0 : acrms, 'V'));
        ro.set('cf', rms > 1e-9 ? (pk / rms).toFixed(3) : '—');
        ro.set('ff', rav > 1e-9 ? (rms / rav).toFixed(3) : '—');
        if (acrms > 1e-6) {
          const err = (meter / acrms - 1) * 100;
          ro.set('meter', kit.eng(meter, 'V') + '  (' + (err >= 0 ? '+' : '−') + Math.abs(err).toFixed(1) + ' %)');
        } else ro.set('meter', '0 V');
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const sx = 16, sy = 12, sw = W - 32;
        const sh = Math.round(V.sq ? Hh * 0.54 : Hh - 44);
        const vmax = Math.max(Math.abs(m.mx), Math.abs(m.mn), 0.1);
        const vdiv = perDiv(vmax, 3.6);
        const tdiv = T / 5;                     // two periods across the screen
        kit.schem.scope(c, sx, sy, sw, sh, { tdiv, traces: [{ fn: t => wave(t / T), vdiv, label: 'v(t)', color: SC[0] }] });
        const Y = v => sy + sh / 2 - v / vdiv * sh / 8;
        const ya = Y(m.avg), yr = Y(m.rms);
        level(kit, c, sx, sw, sy, sh, ya, SC[3], 'average ' + kit.eng(Math.abs(m.avg) < 1e-9 ? 0 : m.avg, 'V'), Math.abs(ya - yr) < 16);
        level(kit, c, sx, sw, sy, sh, yr, SC[2], 'RMS ' + kit.eng(m.rms, 'V'), false);
        if (!V.sq) return;
        // v² and its mean
        const py = sy + sh + 34, ph = Hh - py - 22, px = 58, pw = W - px - 18;
        if (ph < 40) return;
        const v2max = Math.max(m.mx * m.mx, m.mn * m.mn, 1e-6);
        const top = niceUp(v2max);
        const YY = q => py + ph - q / top * ph;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath();
        for (let k = 0; k <= 4; k++) { const yy = py + ph * k / 4; c.moveTo(px, yy); c.lineTo(px + pw, yy); }
        c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.stroke();
        kit.label(c, kit.fmt(top, 3) + ' V²', px - 6, py, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, '0', px - 6, py + ph, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'v²', px - 30, py + ph / 2, { size: 12, color: C.text, weight: 600 });
        const N = 400;
        c.beginPath(); c.moveTo(px, py + ph);
        for (let k = 0; k <= N; k++) { const v = wave(2 * k / N); c.lineTo(px + pw * k / N, YY(v * v)); }
        c.lineTo(px + pw, py + ph); c.closePath();
        c.save(); c.globalAlpha = 0.22; c.fillStyle = C.accent; c.fill(); c.restore();
        c.beginPath();
        for (let k = 0; k <= N; k++) { const v = wave(2 * k / N); k ? c.lineTo(px + pw * k / N, YY(v * v)) : c.moveTo(px, YY(v * v)); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke();
        const ms = m.rms * m.rms;
        dashed(c, px, YY(ms), px + pw, YY(ms), C.warn, 1.8);
        kit.label(c, 'mean of v² = ' + kit.fmt(ms, 3) + ' V²   →   RMS = √(mean) = ' + kit.eng(m.rms, 'V'), px + pw - 6, YY(ms) - 10,
          { size: 12, color: C.warn, align: 'right', weight: 600, bg: C.surface });
        kit.label(c, 'two periods (1 kHz)', px + pw, py + ph + 13, { size: 11, color: C.muted, align: 'right' });
      }

      measure();
      const loop = kit.loop(() => { if (dirty) { dirty = false; draw(); } }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; loop.once(); });
    }
  });

  /* ================================================================ Fourier synthesis */
  Hyper.sim('acf-spectrum', {
    title: 'A waveform built from its harmonics',
    blurb: `The yellow trace is the ideal waveform; the blue one is the sum of its sine-wave harmonics up to the one you choose. The bars below are the **line spectrum**: the amplitude of each harmonic of the 1 kHz fundamental. Pass the wave through an RC filter and the circuit simulator scales and shifts every harmonic by its own response.

- Square wave: step the number of harmonics from 1 to 49. Only odd harmonics appear, falling as $1/n$; the ripples crowd towards the edges but the overshoot stays near 9 % of the jump.
- Triangle: only odd harmonics, falling as $1/n^2$ — three terms already look right.
- Pulse train: at a 20 % duty cycle every fifth harmonic vanishes. Why? (The $\\sin(n\\pi D)$ envelope has a zero there.)
- Choose the RC low-pass with 49 harmonics and lower the corner: the edges round off exactly as on the RC scope, because the high harmonics are cut.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Target waveform', value: params.shape || 'square',
          options: [['Square', 'square'], ['Triangle', 'triangle'], ['Sawtooth', 'saw'], ['Pulse train', 'pulse']] },
        { id: 'n', label: 'Highest harmonic in the sum', min: 1, max: 49, step: 1, value: params.n || 7 },
        { id: 'duty', label: 'Pulse duty cycle', min: 5, max: 50, step: 1, value: 20, unit: '%' },
        { id: 'filter', type: 'select', label: 'Pass it through', value: params.filter || 'none',
          options: [['Nothing (an ideal wire)', 'none'], ['RC low-pass filter', 'lp'], ['RC high-pass filter', 'hp']] },
        { id: 'fc', label: 'Filter corner', min: 100, max: 100e3, value: 3000, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'db', type: 'check', label: 'Spectrum in dBV', value: !!params.db }
      ], () => { compute(); dirty = true; });
      const ro = kit.readout(box.side, [['a1', 'Fundamental (peak)'], ['rmsT', 'RMS of the ideal wave'], ['rmsN', 'RMS of the sum shown'], ['share', 'Share of the power'],
        ['ovs', 'Overshoot at the jump'], ['thd', 'THD of the ideal wave'], ['thdo', 'THD after the filter']]);
      const V = ctl.values;
      const A = 5, F1 = 1000, NH = 199;
      let dirty = true, circ = null, H = [], sum = [], ideal = [], spec = [];

      function coef(n) {               // [a_n, b_n]: a_n cos nθ + b_n sin nθ; n = 0 gives [DC, 0]
        const D = V.duty / 100;
        if (V.shape === 'pulse') {
          if (n === 0) return [A * D, 0];
          return [A * Math.sin(TAU * n * D) / (n * Math.PI), A * (1 - Math.cos(TAU * n * D)) / (n * Math.PI)];
        }
        if (n === 0) return [0, 0];
        if (V.shape === 'square') return [0, n % 2 ? 4 * A / (n * Math.PI) : 0];
        if (V.shape === 'triangle') return [0, n % 2 ? 8 * A / (Math.PI * Math.PI * n * n) * (((n - 1) / 2) % 2 ? -1 : 1) : 0];
        return [0, -2 * A / (n * Math.PI)];          // a sawtooth rising from −A to +A
      }
      function target(u) {
        u -= Math.floor(u);
        switch (V.shape) {
          case 'square': return u < 0.5 ? A : -A;
          case 'triangle': return u < 0.25 ? 4 * A * u : u < 0.75 ? A * (2 - 4 * u) : A * (4 * u - 4);
          case 'pulse': return u < V.duty / 100 ? A : 0;
          default: return A * (2 * u - 1);
        }
      }
      function trueRms() {
        const D = V.duty / 100;
        return V.shape === 'square' ? A : V.shape === 'pulse' ? A * Math.sqrt(D) : A / Math.sqrt(3);
      }
      function compute() {
        ctl.show('duty', V.shape === 'pulse');
        ctl.show('fc', V.filter !== 'none');
        ro.show('thdo', V.filter !== 'none');
        // the filter's response at every harmonic, from the circuit simulator
        H = [];
        if (V.filter !== 'none') {
          const R = 10e3, Cf = 1 / (TAU * R * V.fc);
          circ = new kit.Circuit();
          circ.V('in', 'gnd', 0, { ac: 1 });
          if (V.filter === 'lp') { circ.R('in', 'out', R); circ.C('out', 'gnd', Cf, 0); }
          else { circ.C('in', 'out', Cf, 0); circ.R('out', 'gnd', R); }
          for (let n = 0; n <= NH; n++) { const r = circ.ac(n * F1).v('out'); H.push({ mag: r.mag, ph: r.phase * Math.PI / 180 }); }
        } else for (let n = 0; n <= NH; n++) H.push({ mag: 1, ph: 0 });
        // the spectrum, before and after the filter
        spec = [];
        for (let n = 0; n <= NH; n++) {
          const [a, b] = coef(n);
          const amp = n === 0 ? Math.abs(a) : Math.hypot(a, b);
          spec.push({ a, b, amp, out: amp * H[n].mag });
        }
        // the partial sum over two periods
        const M = 700, N = Math.round(V.n);
        sum = []; ideal = [];
        for (let k = 0; k <= M; k++) {
          const u = 2 * k / M, th = TAU * u;
          let v = spec[0].a * H[0].mag;
          for (let n = 1; n <= N; n++) {
            const s = spec[n];
            if (!s.amp) continue;
            const ph = n * th + H[n].ph;
            v += H[n].mag * (s.a * Math.cos(ph) + s.b * Math.sin(ph));
          }
          sum.push([u * 1e-3, v]);
          ideal.push([u * 1e-3, target(u)]);
        }
        // read-outs
        const rT = trueRms();
        let pN = spec[0].out * spec[0].out;
        for (let n = 1; n <= N; n++) pN += spec[n].out * spec[n].out / 2;
        const a1 = spec[1].amp;
        ro.set('a1', kit.eng(spec[1].out, 'V') + (V.filter !== 'none' ? '  (was ' + kit.eng(a1, 'V') + ')' : ''));
        ro.set('rmsT', kit.eng(rT, 'V'));
        ro.set('rmsN', kit.eng(Math.sqrt(pN), 'V'));
        ro.set('share', V.filter === 'none' ? (100 * pN / (rT * rT)).toFixed(2) + ' %' : '—');
        if (V.filter === 'none' && V.shape !== 'triangle') {
          let mx = -Infinity;
          const K = 3000;
          for (let k = 0; k < K; k++) {           // the first half period holds the upper overshoot
            const th = TAU * (k + 0.5) / K;
            let v = spec[0].a;
            for (let n = 1; n <= N; n++) { const s = spec[n]; if (s.amp) v += s.a * Math.cos(n * th) + s.b * Math.sin(n * th); }
            if (v > mx) mx = v;
          }
          const hi = A, lo = V.shape === 'pulse' ? 0 : -A;
          ro.set('ovs', N > 1 ? (100 * Math.max(0, mx - hi) / (hi - lo)).toFixed(1) + ' % of the jump' : '—');
        } else ro.set('ovs', V.filter === 'none' ? 'none (no jump)' : '—');
        const dc = V.shape === 'pulse' ? A * V.duty / 100 : 0;
        const acr2 = Math.max(0, rT * rT - dc * dc);
        ro.set('thd', a1 > 1e-9 ? (100 * Math.sqrt(Math.max(0, acr2 - a1 * a1 / 2)) / (a1 / Math.SQRT2)).toFixed(1) + ' %' : '—');
        if (V.filter !== 'none') {
          let h2 = 0;
          for (let n = 2; n <= NH; n++) h2 += spec[n].out * spec[n].out;
          ro.set('thdo', spec[1].out > 1e-9 ? (100 * Math.sqrt(h2) / spec[1].out).toFixed(1) + ' %' : '—');
        }
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const sx = 16, sy = 12, sw = W - 32, sh = Math.round(Hh * 0.48);
        let vmax = 1;
        for (const p of sum) vmax = Math.max(vmax, Math.abs(p[1]));
        const vdiv = perDiv(Math.max(vmax, A), 3.7);
        kit.schem.scope(c, sx, sy, sw, sh, {
          tdiv: 0.2e-3,
          traces: [{ pts: ideal, vdiv, label: 'ideal', color: SC[0], width: 1.6 }, { pts: sum, vdiv, label: 'sum to n = ' + Math.round(V.n), color: SC[1] }]
        });
        // the line spectrum
        const bx = 62, by = sy + sh + 34, bw = W - bx - 20, bh = Hh - by - 34;
        if (bh < 50) return;
        const nShow = Math.max(15, Math.min(49, Math.round(V.n) * 2 + 1));
        const N = Math.round(V.n);
        const useDb = V.db;
        const floor = -40, ceil = 20;
        let amax = 0;
        for (let n = 0; n <= nShow; n++) amax = Math.max(amax, spec[n].amp);
        const top = niceUp(amax || 1);
        const Yv = a => useDb ? by + bh - (clamp(dB(a), floor, ceil) - floor) / (ceil - floor) * bh : by + bh - a / top * bh;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let k = 0; k <= 4; k++) { const yy = by + bh * k / 4; c.moveTo(bx, yy); c.lineTo(bx + bw, yy); }
        c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.stroke();
        for (let k = 0; k <= 4; k++) {
          const val = useDb ? ceil - (ceil - floor) * k / 4 : top * (1 - k / 4);
          kit.label(c, useDb ? val.toFixed(0) : kit.fmt(val, 3), bx - 6, by + bh * k / 4, { size: 11, color: C.muted, align: 'right' });
        }
        kit.label(c, useDb ? 'dBV' : 'V (peak)', 6, by - 14, { size: 11.5, color: C.text, weight: 600 });
        const slot = bw / (nShow + 1), barW = Math.max(2, Math.min(18, slot * 0.6));
        for (let n = 0; n <= nShow; n++) {
          const s = spec[n];
          const xm = bx + slot * (n + 0.5);
          if (s.amp > 1e-9) {
            // the ideal wave's harmonic, as an outline
            c.strokeStyle = C.faint; c.lineWidth = 1;
            c.strokeRect(xm - barW / 2, Yv(s.amp), barW, by + bh - Yv(s.amp));
            if (n <= N && s.out > 1e-12) {
              c.fillStyle = C.accent;
              const yt = Yv(s.out);
              c.fillRect(xm - barW / 2, yt, barW, by + bh - yt);
            }
          }
          if (n % (nShow > 30 ? 5 : nShow > 15 ? 2 : 1) === 0 || n === 1) kit.label(c, String(n), xm, by + bh + 11, { size: 10.5, color: C.muted, align: 'center' });
        }
        kit.label(c, 'harmonic n (× 1 kHz)  ·  filled: in the sum' + (V.filter !== 'none' ? ', filtered' : '') + '  ·  outline: ideal',
          bx + bw, by + bh + 26, { size: 11, color: C.muted, align: 'right' });
      }

      compute();
      const loop = kit.loop(() => { if (dirty) { dirty = false; draw(); } }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; loop.once(); });
    }
  });

  /* ================================================================ RL and RLC step response */
  Hyper.sim('acf-step', {
    title: 'Step response on the oscilloscope: RL and RLC',
    blurb: `A 0–5 V square wave switches the circuit on and off, and the simulator steps it in time. The scope shows the input (yellow), the voltage across the energy store (blue: $v_L$ or $v_C$) and the voltage across the resistor, which is the current times $R$ (pink).

- **RL:** the current rises along $1 - e^{-t/\\tau}$ with $\\tau = L/R$ while $v_L$ decays; at switch-off $v_L$ jumps negative — the inductor keeps the current flowing.
- **RLC:** lower $R$ and the capacitor voltage overshoots and rings at almost $f_0 = 1/(2\\pi\\sqrt{LC})$.
- Press **Critical damping**: the fastest rise with no overshoot. Raise $R$ further and the response turns sluggish (over-damped).
- Compare the measured overshoot with the formula $e^{-\\pi\\zeta/\\sqrt{1-\\zeta^2}}$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 340 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Circuit', options: [['RL: resistor and inductor', 'rl'], ['Series RLC', 'rlc']], value: params.circuit || 'rlc' },
        { id: 'r', label: 'R', min: 10, max: 10e3, value: params.r || 100, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'l', label: 'L', min: 100e-6, max: 1, value: 10e-3, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'c', label: 'C', min: 1e-9, max: 10e-6, value: 100e-9, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { type: 'buttons', items: [{ id: 'crit', label: 'Critical damping' }] }
      ], (id) => {
        if (id === 'crit') ctl.set('r', clamp(Number((2 * Math.sqrt(V.l / V.c)).toPrecision(3)), 10, 10e3));
        rebuild();
      });
      const ro = kit.readout(box.side, [['tau', 'τ = L/R'], ['ifin', 'Final current V/R'], ['i63', 'Current at t = τ (63 %)'], ['en', 'Energy stored ½LI²'], ['ratio', 'Half-period / τ'],
        ['f0', 'f₀ = 1/(2π√LC)'], ['zeta', 'ζ = (R/2)√(C/L)'], ['q', 'Q = 1/(2ζ)'], ['fd', 'Rings at f₀√(1−ζ²)'], ['rc', 'Critical R = 2√(L/C)'], ['ovs', 'Overshoot, formula'], ['ovm', 'Overshoot, measured']]);
      const V = ctl.values;
      const VS = 5;
      let c, dt, tdiv, P, spf, dec, count, tStart, buf, rlc, maxVc, maxVr, vrScale, measured, info;

      function rebuild() {
        rlc = V.kind === 'rlc';
        ctl.show('c', rlc); ctl.show('crit', rlc);
        const R = V.r, L = V.l, Cc = V.c;
        if (!rlc) {
          const tau = L / R;
          tdiv = niceUp(1.2 * tau);                  // the up-step lasts at least 6τ
          dt = Math.min(tau / 100, 5 * tdiv / 1500);
          vrScale = 2;
          info = { tau };
        } else {
          const w0 = 1 / Math.sqrt(L * Cc), a = R / (2 * L), z = a / w0, T0 = TAU / w0;
          let span;
          if (z < 1) span = clamp(5 / a, 3 * T0, 8 * T0);
          else span = 5 * (a + Math.sqrt(a * a - w0 * w0)) / (w0 * w0);     // 5 × the slow time constant
          tdiv = niceUp(span / 5);
          dt = z < 1 ? Math.min(T0 / 1500, 5 * tdiv / 1500) : 5 * tdiv / 3000;
          const Z0 = Math.sqrt(L / Cc);
          vrScale = perDiv(Math.min(VS, VS * R / Z0), 3);
          info = { w0, a, z, T0, Z0 };
        }
        P = 10 * tdiv;
        c = new kit.Circuit();
        c.V('in', 'gnd', t => ((t % P) < P / 2 ? VS : 0));
        c.R('in', 'a', R);
        if (rlc) { c.L('a', 'b', L, 0); c.C('b', 'gnd', Cc, 0); }
        else c.L('a', 'gnd', L, 0);
        c.reset();
        const perSweep = P / dt;
        spf = Math.max(1, Math.round(perSweep / 96));        // one sweep in about 1.6 s
        dec = Math.max(1, Math.round(perSweep / 1400));
        count = 0; tStart = 0; buf = []; maxVc = -Infinity; maxVr = 0; measured = null;
        readouts();
      }
      function readouts() {
        const R = V.r;
        for (const k of ['tau', 'ifin', 'i63', 'en', 'ratio']) ro.show(k, !rlc);
        for (const k of ['f0', 'zeta', 'q', 'fd', 'rc', 'ovs', 'ovm']) ro.show(k, rlc);
        if (!rlc) {
          const tau = info.tau;
          ro.set('tau', kit.eng(tau, 's'));
          ro.set('ifin', kit.eng(VS / R, 'A'));
          ro.set('i63', kit.eng(0.632 * VS / R, 'A'));
          ro.set('en', kit.eng(0.5 * V.l * Math.pow(VS / R, 2), 'J'));
          ro.set('ratio', (5 * tdiv / tau).toPrecision(3));
          return;
        }
        const { w0, z, Z0 } = info;
        const f0 = w0 / TAU;
        const regime = z < 0.995 ? 'under-damped' : z > 1.005 ? 'over-damped' : 'critical';
        ro.set('f0', kit.eng(f0, 'Hz'));
        ro.set('zeta', z.toPrecision(3) + ' (' + regime + ')');
        ro.set('q', (1 / (2 * z)).toPrecision(3));
        ro.set('fd', z < 1 ? kit.eng(f0 * Math.sqrt(1 - z * z), 'Hz') : 'no ringing');
        ro.set('rc', kit.eng(2 * Z0, 'Ω'));
        const ovs = z < 1 ? 100 * Math.exp(-Math.PI * z / Math.sqrt(1 - z * z)) : 0;
        ro.set('ovs', ovs.toFixed(1) + ' %');
        ro.set('ovm', measured == null ? 'after one sweep…' : measured.toFixed(1) + ' %');
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          c.step(dt);
          let tr = c.t - tStart;
          if (tr >= P) {
            tStart += P; tr -= P;
            if (rlc && Number.isFinite(maxVc)) { measured = Math.max(0, (maxVc - VS) / VS * 100); readouts(); }
            if (maxVr > 0) vrScale = perDiv(maxVr, 3);
            buf = []; maxVc = -Infinity; maxVr = 0;
          }
          const vin = c.v('in'), va = c.v('a'), vr = vin - va;
          const vst = rlc ? c.v('b') : va;
          if (tr < P / 2 && vst > maxVc) maxVc = vst;
          if (Math.abs(vr) > maxVr) maxVr = Math.abs(vr);
          if (++count % dec === 0) buf.push([tr, vin, vst, vr]);
        }
        draw();
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        // the schematic across the top
        const y = 46, x0 = Math.max(40, W * 0.1), sp = Math.min(110, (W - x0 - 150) / 3);
        S.vsource(g, x0, y, x0, y + 74, { label: 'square', value: '0–5 V', color: C.text });
        S.wire(g, [[x0, y], [x0 + 20, y]]);
        S.resistor(g, x0 + 20, y, x0 + 20 + sp, y, { label: 'R', value: kit.eng(V.r, 'Ω') });
        const xl = x0 + 20 + sp;
        if (rlc) {
          S.inductor(g, xl, y, xl + sp, y, { label: 'L', value: kit.eng(V.l, 'H') });
          const xc = xl + sp + 30;
          S.wire(g, [[xl + sp, y], [xc, y]]);
          S.capacitor(g, xc, y, xc, y + 74, { label: 'C', value: kit.eng(V.c, 'F') });
          S.wire(g, [[x0, y + 74], [xc, y + 74]]);
          S.node(g, xc, y);
          S.wire(g, [[xc, y], [xc + 40, y]]);
          kit.label(g, 'v_C to scope', xc + 46, y, { size: 12, color: kit.hue(HUE[1]) });
        } else {
          S.wire(g, [[xl, y], [xl + 30, y]]);
          S.inductor(g, xl + 30, y, xl + 30, y + 74, { label: 'L', value: kit.eng(V.l, 'H') });
          S.wire(g, [[x0, y + 74], [xl + 30, y + 74]]);
          S.node(g, xl + 30, y);
          S.wire(g, [[xl + 30, y], [xl + 70, y]]);
          kit.label(g, 'v_L to scope', xl + 76, y, { size: 12, color: kit.hue(HUE[1]) });
        }
        S.ground(g, x0 + 60, y + 74);
        // the scope
        const sy = 152, sh = Math.max(140, Hh - sy - 28);
        const vd = 2, off = -1.5;
        const labels = rlc ? ['IN', 'v_C', 'V_R = iR'] : ['IN', 'v_L', 'V_R = iR'];
        S.scope(g, 16, sy, W - 32, sh, {
          tdiv, divy: 8,
          traces: [
            { pts: buf.map(p => [p[0], p[1]]), vdiv: vd, offset: off, label: labels[0], color: SC[0], width: 1.6 },
            { pts: buf.map(p => [p[0], p[2]]), vdiv: vd, offset: off, label: labels[1], color: SC[1] },
            { pts: buf.map(p => [p[0], p[3]]), vdiv: rlc ? vrScale : vd, offset: rlc ? 0 : off, label: labels[2], color: SC[2] }
          ]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ phasors of a series RLC circuit */
  Hyper.sim('acf-phasor', {
    title: 'Phasors of a series RLC circuit',
    blurb: `A 10 V (peak) sine drives R, L and C in series; the simulator solves it with complex impedances. Each voltage is an arrow — a **phasor** — turning anticlockwise at the signal frequency (slowed down here). Its height is the instantaneous voltage: the dashed lines carry each tip across to the scope, where the cursor sits at the same instant.

- $v_R$ (blue) is always in step with the current; $v_L$ (pink) leads it by 90°, $v_C$ (green) lags it by 90°.
- Choose **tip to tail**: the three voltage phasors add up to the source phasor (Kirchhoff's voltage law), even though their sizes add up to much more.
- Sweep the frequency through resonance: the impedance triangle flattens, $\\varphi$ passes through zero and $v_L$ and $v_C$ grow larger than the source.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Frequency', min: 20, max: 20e3, value: params.f || 300, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'r', label: 'R', min: 1, max: 10e3, value: 100, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'l', label: 'L', min: 1e-3, max: 1, value: 100e-3, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'c', label: 'C', min: 10e-9, max: 100e-6, value: 1e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'mode', type: 'select', label: 'Voltage phasors drawn', value: params.mode || 'origin',
          options: [['From the origin', 'origin'], ['Tip to tail (they sum to the source)', 'chain']] },
        { id: 'spin', type: 'check', label: 'Rotate (time slowed down)', value: true },
        { type: 'buttons', items: [{ id: 'res', label: 'Tune to resonance' }] }
      ], (id) => {
        if (id === 'res') ctl.set('f', clamp(Number((1 / (TAU * Math.sqrt(V.l * V.c))).toPrecision(3)), 20, 20e3));
        solve();
      });
      const ro = kit.readout(box.side, [['xl', 'X_L = ωL'], ['xc', 'X_C = 1/(ωC)'], ['z', '|Z| and φ'], ['i', 'Current, peak / RMS'], ['v', 'V_R, V_L, V_C (peak)'], ['f0', 'Resonance f₀'], ['kind', 'The circuit is']]);
      const V = ctl.values;
      const VSRC = 10;
      let P = null, tc = 0;

      function solve() {
        const c = new kit.Circuit();
        c.V('in', 'gnd', 0, { ac: VSRC });
        c.R('in', 'a', V.r); c.L('a', 'b', V.l, 0); c.C('b', 'gnd', V.c, 0);
        const ac = c.ac(V.f);
        const Vs = fromAc(ac.v('in')), Va = fromAc(ac.v('a')), Vb = fromAc(ac.v('b'));
        const VR = csub(Vs, Va), VL = csub(Va, Vb), VC = Vb;
        const I = cscale(VR, 1 / V.r);
        const w = TAU * V.f, XL = w * V.l, XC = 1 / (w * V.c);
        const Z = cdiv(Vs, I);
        P = { Vs, VR, VL, VC, I, w, XL, XC, X: XL - XC, Z };
        const zm = cabs(Z), phi = deg(carg(Z));
        ro.set('xl', kit.eng(XL, 'Ω'));
        ro.set('xc', kit.eng(XC, 'Ω'));
        ro.set('z', kit.eng(zm, 'Ω') + ',  φ = ' + phi.toFixed(1) + '°');
        ro.set('i', kit.eng(cabs(I), 'A') + ' / ' + kit.eng(cabs(I) / Math.SQRT2, 'A'));
        ro.set('v', [VR, VL, VC].map(p => kit.eng(cabs(p), 'V')).join(', '));
        ro.set('f0', kit.eng(1 / (TAU * Math.sqrt(V.l * V.c)), 'Hz'));
        ro.set('kind', Math.abs(phi) < 1 ? 'at resonance: I in phase with V' : phi > 0 ? 'inductive: I lags V by ' + phi.toFixed(0) + '°' : 'capacitive: I leads V by ' + (-phi).toFixed(0) + '°');
      }

      function draw(dt) {
        if (!P) return;
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const T = 1 / V.f, tdiv = niceUp(T / 5), span = 10 * tdiv;
        if (V.spin) tc = (tc + (dt || 0) * 0.2 * T) % span;
        const ang = P.w * tc;
        const cols = HUE.map(h => kit.hue(h));
        const top = 12, sh = Math.min(Hh * 0.6, W * 0.42), cy = top + sh / 2;
        const scx = W * 0.4, sw = W - scx - 14;
        const maxA = Math.max(cabs(P.Vs), cabs(P.VR), cabs(P.VL), cabs(P.VC));
        const vdiv = perDiv(maxA, 3.4), k = sh / 8 / vdiv;
        const ox = W * 0.2, oy = cy;
        // the phasor area (clipped, so a long tip-to-tail chain cannot run into the scope)
        g.save(); g.beginPath(); g.rect(0, top - 6, W * 0.39, sh + 12); g.clip();
        g.strokeStyle = C.grid; g.lineWidth = 1;
        g.beginPath(); g.moveTo(16, oy); g.lineTo(W * 0.38, oy); g.moveTo(ox, top); g.lineTo(ox, top + sh); g.stroke();
        g.beginPath(); g.arc(ox, oy, cabs(P.Vs) * k, 0, TAU); g.strokeStyle = C.faint; g.setLineDash([3, 4]); g.stroke(); g.setLineDash([]);
        const r = p => rotate(p, ang);
        const VS = r(P.Vs), VR = r(P.VR), VL = r(P.VL), VC = r(P.VC), I = r(P.I);
        // the current: direction only
        const iu = cabs(I) > 0 ? cscale(I, 0.42 * cabs(P.Vs) / cabs(I)) : cx(0, 0);
        arrowP(kit, g, ox, oy, iu, k, C.muted, 'I', 1.6);
        let tips;
        if (V.mode === 'chain') {
          const t1 = arrowP(kit, g, ox, oy, VR, k, cols[1], 'V_R');
          const t2 = arrowP(kit, g, t1[0], t1[1], VL, k, cols[2], 'V_L');
          arrowP(kit, g, t2[0], t2[1], VC, k, cols[3], 'V_C');
          const ts = arrowP(kit, g, ox, oy, VS, k, cols[0], 'V_S', 2.8);
          tips = [[ts[1], 0]];
        } else {
          const ts = arrowP(kit, g, ox, oy, VS, k, cols[0], 'V_S', 2.8);
          const t1 = arrowP(kit, g, ox, oy, VR, k, cols[1], 'V_R');
          const t2 = arrowP(kit, g, ox, oy, VL, k, cols[2], 'V_L');
          const t3 = arrowP(kit, g, ox, oy, VC, k, cols[3], 'V_C');
          tips = [[ts[1], 0], [t1[1], 1], [t2[1], 2], [t3[1], 3]];
        }
        g.restore();
        // the scope, on the same vertical scale, and the cursor at the same instant
        const tr = (p, i, lab) => ({ fn: t => inst(p, P.w, t), vdiv, label: lab, color: SC[i], width: i ? 1.8 : 2.2 });
        S.scope(g, scx, top, sw, sh, { tdiv, traces: [tr(P.Vs, 0, sw > 430 ? 'v_S' : 'S'), tr(P.VR, 1, sw > 430 ? 'v_R' : 'R'), tr(P.VL, 2, sw > 430 ? 'v_L' : 'L'), tr(P.VC, 3, sw > 430 ? 'v_C' : 'C')] });
        const xc = scx + tc / span * sw;
        g.save(); g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(xc, top); g.lineTo(xc, top + sh); g.stroke(); g.restore();
        for (const [ty, i] of tips) {
          if (!(ty >= top && ty <= top + sh)) continue;
          dashed(g, ox, ty, xc, ty, i ? SC[i] : C.muted, 1);
          kit.dot(g, xc, ty, 3.5, SC[i]);
        }
        // the impedance triangle
        const tb = top + sh + 30, th = Hh - tb - 12;
        if (th > 50) {
          const R = V.r, X = P.X, tw = W * 0.34;
          const s = Math.min((tw - 70) / R, (th - 24) / Math.max(Math.abs(X), 1e-12));
          const x0 = 26, y0 = X >= 0 ? tb + th - 6 : tb + 16;
          const x1 = x0 + R * s, y1 = y0 - X * s;
          kit.label(g, 'Impedance triangle', x0, tb - 8, { size: 12, color: C.text, weight: 600 });
          S.wire(g, [[x0, y0], [x1, y0]], { color: cols[1], width: 2.4 });
          S.wire(g, [[x1, y0], [x1, y1]], { color: C.warn, width: 2.4 });
          S.wire(g, [[x0, y0], [x1, y1]], { color: C.accent, width: 2.4 });
          kit.label(g, 'R', (x0 + x1) / 2, y0 + (X >= 0 ? 11 : -11), { size: 11.5, color: cols[1], align: 'center', weight: 600 });
          kit.label(g, (X >= 0 ? 'X = ' : 'X = −') + kit.eng(Math.abs(X), 'Ω'), x1 + 6, (y0 + y1) / 2, { size: 11.5, color: C.warn, weight: 600 });
          kit.label(g, '|Z| ' + kit.eng(cabs(P.Z), 'Ω') + ', φ ' + deg(carg(P.Z)).toFixed(0) + '°', x0 + 4, y1 + (X >= 0 ? -12 : 14), { size: 11.5, color: C.accent, weight: 600 });
        }
        // the circuit
        const x0 = W * 0.46, x1 = W - 40, yT = tb + 34, yB = Hh - 16;
        if (yB - yT > 60 && x1 - x0 > 200) {
          const d = (x1 - x0);
          S.vsource(g, x0, yB, x0, yT, { ac: true, label: 'v_S', value: '10 V peak', labelColor: cols[0] });
          S.wire(g, [[x0, yT], [x0 + d * 0.08, yT]]);
          S.resistor(g, x0 + d * 0.08, yT, x0 + d * 0.38, yT, { label: 'R ' + kit.eng(V.r, 'Ω'), value: 'V_R ' + kit.eng(cabs(P.VR), 'V'), labelColor: cols[1] });
          S.inductor(g, x0 + d * 0.42, yT, x0 + d * 0.74, yT, { label: 'L ' + kit.eng(V.l, 'H'), value: 'V_L ' + kit.eng(cabs(P.VL), 'V'), labelColor: cols[2] });
          S.wire(g, [[x0 + d * 0.38, yT], [x0 + d * 0.42, yT]]);
          S.wire(g, [[x0 + d * 0.74, yT], [x1, yT]]);
          S.capacitor(g, x1, yT, x1, yB, { label: 'C ' + kit.eng(V.c, 'F'), value: 'V_C ' + kit.eng(cabs(P.VC), 'V'), labelColor: cols[3], labelOffset: -100 });
          S.wire(g, [[x0, yB], [x1, yB]]);
        }
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ AC power and power factor */
  Hyper.sim('acf-power', {
    title: 'AC power: P, Q, S and power-factor correction',
    blurb: `A mains supply feeds an inductive load — resistance in series with inductance, like a motor or a transformer. The circuit is solved by the simulator; the panels show the voltage and the supply current, and their product, the instantaneous power $p = vi$.

- With $L = 0$ the current is in phase and $p$ never goes negative: all the energy is used.
- Add inductance: $p$ dips below zero twice a cycle — energy borrowed by the magnetic field and handed back. The average (dashed) is the real power $P$; the swing is set by the apparent power $S$.
- Press **Correct to pf = 1**: the capacitor supplies the load's reactive power locally, the supply current falls and $p$ stops going negative — the load itself has not changed at all.
- Keep adding capacitance: the circuit becomes over-corrected (leading) and the current rises again.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'mains', type: 'select', label: 'Supply', options: [['230 V, 50 Hz', 'eu'], ['120 V, 60 Hz', 'us']], value: 'eu' },
        { id: 'r', label: 'Load resistance R', min: 2, max: 100, step: 0.5, value: 20, unit: 'Ω' },
        { id: 'l', label: 'Load inductance L', min: 0, max: 200, step: 1, value: 50, unit: 'mH' },
        { id: 'c', label: 'Correction capacitor', min: 0, max: 300, step: 1, value: params.c || 0, unit: 'µF' },
        { type: 'buttons', items: [{ id: 'unity', label: 'Correct to pf = 1', primary: true }, { id: 'none', label: 'Remove the capacitor' }] }
      ], (id) => {
        if (id === 'unity') { solve(); ctl.set('c', clamp(Math.round(sol.cNeed * 1e6), 0, 300)); }
        if (id === 'none') ctl.set('c', 0);
        solve();
      });
      const ro = kit.readout(box.side, [['p', 'Real power P'], ['q', 'Reactive power Q'], ['s', 'Apparent power S'], ['pf', 'Power factor'], ['il', 'Load current (RMS)'], ['is', 'Supply current (RMS)'], ['cn', 'C for pf = 1']]);
      const V = ctl.values;
      let sol = null;

      function solve() {
        const us = V.mains === 'us', Vrms = us ? 120 : 230, f = us ? 60 : 50, Vpk = Vrms * Math.SQRT2, w = TAU * f;
        const c = new kit.Circuit();
        const src = c.V('in', 'gnd', 0, { ac: Vpk });
        c.R('in', 'm', V.r);
        c.L('m', 'gnd', V.l * 1e-3, 0);
        if (V.c > 0) c.C('in', 'gnd', V.c * 1e-6, 0);
        const ac = c.ac(f);
        const Vin = fromAc(ac.v('in')), Vm = fromAc(ac.v('m'));
        const Il = cscale(csub(Vin, Vm), 1 / V.r);
        const is = ac.i(src);
        const Is = is ? cx(is.re, is.im) : Il;
        // complex power with peak phasors: S = ½ V I*
        const P = 0.5 * (Vin.re * Is.re + Vin.im * Is.im), Q = 0.5 * (Vin.im * Is.re - Vin.re * Is.im);
        const Sa = 0.5 * cabs(Vin) * cabs(Is);
        const Pl = 0.5 * (Vin.re * Il.re + Vin.im * Il.im), Ql = 0.5 * (Vin.im * Il.re - Vin.re * Il.im);
        const cNeed = Ql / (w * Vrms * Vrms);
        sol = { Vrms, f, Vpk, w, Vin, Il, Is, P, Q, S: Sa, Ql, Qc: Ql - Q, cNeed, pf: Sa > 0 ? P / Sa : 1 };
        ro.set('p', kit.eng(P, 'W'));
        ro.set('q', kit.eng(Q, 'var') + (V.c > 0 ? '  (load ' + kit.eng(Ql, 'var') + ')' : ''));
        ro.set('s', kit.eng(Sa, 'VA'));
        const lag = Q > 1e-6 * Sa ? ' lagging' : Q < -1e-6 * Sa ? ' leading' : '';
        ro.set('pf', sol.pf.toFixed(3) + lag + '  (φ = ' + deg(Math.atan2(Q, P)).toFixed(1) + '°)');
        ro.set('il', kit.eng(cabs(Il) / Math.SQRT2, 'A'));
        ro.set('is', kit.eng(cabs(Is) / Math.SQRT2, 'A'));
        ro.set('cn', kit.eng(Math.max(0, cNeed), 'F'));
      }

      function draw() {
        if (!sol) return;
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const px = 56, pw = W * 0.58 - px, T = 1 / sol.f, w = sol.w;
        const ph = (Hh - 70) / 2, y1 = 22, y2 = y1 + ph + 34;
        const ipk = cabs(sol.Is), ilpk = cabs(sol.Il), vpk = sol.Vpk;
        const frame = (y, h, title) => {
          g.strokeStyle = C.grid; g.lineWidth = 1; g.strokeRect(px, y, pw, h);
          g.strokeStyle = C.axis; g.beginPath(); g.moveTo(px, y + h / 2); g.lineTo(px + pw, y + h / 2); g.stroke();
          kit.label(g, title, px, y - 10, { size: 12, color: C.text, weight: 600 });
        };
        const curve = (y, h, fn, scale, col, width, dash) => {
          g.save(); g.strokeStyle = col; g.lineWidth = width || 2; if (dash) g.setLineDash(dash);
          g.beginPath();
          const N = 300;
          for (let k = 0; k <= N; k++) { const t = 2 * T * k / N; const yy = y + h / 2 - fn(t) / scale * h * 0.45; k ? g.lineTo(px + pw * k / N, yy) : g.moveTo(px, yy); }
          g.stroke(); g.restore();
        };
        // voltage and current
        frame(y1, ph, 'Voltage and supply current (each on its own scale)');
        const iscale = Math.max(ipk, ilpk, 1e-9);
        if (V.c > 0) curve(y1, ph, t => inst(sol.Il, w, t), iscale, C.series[1], 1.4, [4, 4]);
        curve(y1, ph, t => inst(sol.Vin, w, t), vpk, C.series[0], 2.2);
        curve(y1, ph, t => inst(sol.Is, w, t), iscale, C.series[1], 2.2);
        kit.label(g, 'v: ' + kit.eng(vpk, 'V') + ' peak', px + 6, y1 + 12, { size: 11.5, color: C.series[0], weight: 600 });
        kit.label(g, 'i supply: ' + kit.eng(ipk, 'A') + ' peak' + (V.c > 0 ? '   (dashed: load current ' + kit.eng(ilpk, 'A') + ')' : ''), px + 6, y1 + ph - 12, { size: 11.5, color: C.series[1], weight: 600 });
        // instantaneous power
        frame(y2, ph, 'Instantaneous power p = v·i');
        const pmax = Math.max(Math.abs(sol.P) + sol.S, 1e-9);
        const pAt = t => inst(sol.Vin, w, t) * inst(sol.Is, w, t);
        const N = 300, Y = p => y2 + ph / 2 - p / pmax * ph * 0.45;
        for (const sign of [1, -1]) {
          g.beginPath(); g.moveTo(px, Y(0));
          for (let k = 0; k <= N; k++) { const t = 2 * T * k / N; const p = pAt(t); g.lineTo(px + pw * k / N, Y(sign > 0 ? Math.max(0, p) : Math.min(0, p))); }
          g.lineTo(px + pw, Y(0)); g.closePath();
          g.save(); g.globalAlpha = 0.25; g.fillStyle = sign > 0 ? C.ok : C.bad; g.fill(); g.restore();
        }
        curve(y2, ph, pAt, pmax / 1, C.text, 1.8);
        dashed(g, px, Y(sol.P), px + pw, Y(sol.P), C.warn, 1.8);
        kit.label(g, 'average = P = ' + kit.eng(sol.P, 'W'), px + pw - 6, Y(sol.P) - 10, { size: 11.5, color: C.warn, align: 'right', weight: 600, bg: C.surface });
        if (sol.P - sol.S < -1e-6 * sol.S) kit.label(g, 'red: energy returned to the supply', px + 6, y2 + ph - 10, { size: 11, color: C.bad });
        kit.label(g, 'two cycles', px + pw, y2 + ph + 12, { size: 11, color: C.muted, align: 'right' });
        // the power triangle
        const bx = W * 0.64, bw = W - bx - 20, by = 30, bh = Hh * 0.46;
        kit.label(g, 'Power triangle', bx, by - 12, { size: 12, color: C.text, weight: 600 });
        const qUp = Math.max(0, sol.Ql, sol.Q), qDown = Math.max(0, -sol.Q);
        const s = Math.min((bw - 30) / Math.max(sol.P, 1e-9), (bh - 36) / Math.max(qUp + qDown, 1e-9));
        const o = [bx + 4, by + 14 + qUp * s];
        const tp = [o[0] + sol.P * s, o[1]];
        S.wire(g, [o, tp], { color: C.ok, width: 3 });
        kit.label(g, 'P', (o[0] + tp[0]) / 2, o[1] + 11, { size: 12, color: C.ok, align: 'center', weight: 700 });
        const tq = [tp[0], tp[1] - sol.Ql * s];
        S.wire(g, [tp, tq], { color: C.warn, width: 3 });
        kit.label(g, 'Q_L', tp[0] + 6, (tp[1] + tq[1]) / 2, { size: 12, color: C.warn, weight: 700 });
        if (V.c > 0) {
          const tn = [tp[0], tp[1] - sol.Q * s];
          S.wire(g, [[tq[0] + 5, tq[1]], [tn[0] + 5, tn[1]]], { color: C.series[2], width: 3 });
          kit.label(g, 'Q_C', tq[0] + 11, (tq[1] + tn[1]) / 2, { size: 12, color: C.series[2], weight: 700 });
          S.wire(g, [o, tn], { color: C.accent, width: 3 });
          kit.label(g, 'S', (o[0] + tn[0]) / 2 - 8, (o[1] + tn[1]) / 2 - 10, { size: 12, color: C.accent, align: 'right', weight: 700 });
          dashed(g, o[0], o[1], tq[0], tq[1], C.faint, 1.2);
        } else {
          S.wire(g, [o, tq], { color: C.accent, width: 3 });
          kit.label(g, 'S', (o[0] + tq[0]) / 2 - 8, (o[1] + tq[1]) / 2 - 10, { size: 12, color: C.accent, align: 'right', weight: 700 });
        }
        // the circuit
        const cx0 = bx + 10, cx1 = W - 76, cy0 = by + bh + 40, cy1 = Hh - 24;
        if (cy1 - cy0 > 70) {
          const xm = (cx0 + cx1) / 2;
          S.vsource(g, cx0, cy1, cx0, cy0, { ac: true, label: 'mains', value: sol.Vrms + ' V' });
          S.wire(g, [[cx0, cy0], [cx1, cy0]]);
          S.wire(g, [[cx0, cy1], [cx1, cy1]]);
          const my = (cy0 + cy1) / 2;
          S.resistor(g, cx1, cy0, cx1, my, { label: 'R', value: kit.eng(V.r, 'Ω') });
          S.inductor(g, cx1, my, cx1, cy1, { label: 'L', value: kit.eng(V.l * 1e-3, 'H') });
          S.capacitor(g, xm, cy0, xm, cy1, { label: 'C', value: kit.eng(V.c * 1e-6, 'F'), color: V.c > 0 ? C.text : C.faint });
          S.node(g, xm, cy0); S.node(g, xm, cy1);
          kit.label(g, 'load', cx1 + 14, cy1 + 12, { size: 11, color: C.muted });
        }
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ resonance, and real capacitors */
  Hyper.sim('acf-resonance', {
    title: 'Resonance and Q',
    blurb: `**Series RLC:** a 1 V sine of adjustable frequency drives R, L and C in series; the graph shows the current the simulator finds at each frequency, for your $R$ and for three and ten times it.

- The peak sits at $f_0 = 1/(2\\pi\\sqrt{LC})$ whatever $R$ is; $R$ sets its height ($V/R$) and its width.
- The dashed band marks the half-power points: their spacing is the bandwidth, $f_0/Q$.
- Tune to resonance and read $V_C$: with $Q = 16$ the capacitor sees 16 V from a 1 V source.

**Real capacitors:** a capacitor also has series resistance (ESR) and inductance (ESL). Its impedance falls like a capacitor's, bottoms out at the self-resonant frequency, then rises like an inductor's. Add the 10 µF part and look for the parallel (anti-)resonance peak between the two dips.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', value: params.mode || 'series',
          options: [['Series RLC: current against frequency', 'series'], ['Real capacitors: impedance against frequency', 'cap']] },
        { id: 'r', label: 'R', min: 1, max: 1000, value: 20, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'l', label: 'L', min: 1e-3, max: 1, value: 10e-3, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'c', label: 'C', min: 1e-9, max: 10e-6, value: 100e-9, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'f', label: 'Signal frequency', min: 100, max: 100e3, value: 4000, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'cap', label: 'Small capacitor', min: 1e-9, max: 1e-6, value: 100e-9, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'esl', label: 'Its ESL (part + mounting)', min: 0.2e-9, max: 10e-9, value: 1e-9, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'esr', label: 'Its ESR', min: 1e-3, max: 1, value: 20e-3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'bulk', type: 'check', label: 'Add 10 µF (ESR 10 mΩ, ESL 2 nH) in parallel', value: true },
        { type: 'buttons', items: [{ id: 'tune', label: 'Tune to f₀' }] }
      ], (id) => {
        if (id === 'tune') ctl.set('f', clamp(Number((1 / (TAU * Math.sqrt(V.l * V.c))).toPrecision(3)), 100, 100e3));
        compute(); draw();
      });
      const SER = ['f0', 'q', 'bw', 'i', 'vc', 'ph'], CAP = ['srf', 'zsrf', 'z1m', 'z300', 'srfb', 'ar'];
      const ro = kit.readout(box.side, [['f0', 'f₀ = 1/(2π√LC)'], ['q', 'Q = (1/R)√(L/C)'], ['bw', 'Bandwidth f₀/Q'], ['i', 'Current at the signal frequency'], ['vc', 'V_C and V_L there (source 1 V)'], ['ph', 'Phase of the current'],
        ['srf', 'Self-resonance 1/(2π√(ESL·C))'], ['zsrf', '|Z| at self-resonance (≈ ESR)'], ['z1m', '|Z| at 1 MHz (ideal)'], ['z300', '|Z| at 300 MHz (ideal)'], ['srfb', 'Self-resonance of the 10 µF'], ['ar', 'Anti-resonance peak']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: 'current (mA)' } }, 250);
      const V = ctl.values;
      let at = null;

      function series(R, fs) {
        const c = new kit.Circuit();
        c.V('in', 'gnd', 0, { ac: 1 });
        c.R('in', 'a', R); c.L('a', 'b', V.l, 0); c.C('b', 'gnd', V.c, 0);
        return fs.map(f => {
          const r = c.ac(f), vin = fromAc(r.v('in')), va = fromAc(r.v('a')), vb = fromAc(r.v('b'));
          return { i: cscale(csub(vin, va), 1 / R), vc: vb, vl: csub(va, vb) };
        });
      }
      function capCircuit(small, bulk) {
        const c = new kit.Circuit();
        c.I('gnd', 'p', 0, { ac: 1 });                 // 1 A into the node: its voltage is the impedance
        if (small) { c.C('p', 's1', V.cap, 0); c.R('s1', 's2', V.esr); c.L('s2', 'gnd', V.esl, 0); }
        if (bulk) { c.C('p', 'b1', 10e-6, 0); c.R('b1', 'b2', 0.01); c.L('b2', 'gnd', 2e-9, 0); }
        return c;
      }
      function compute() {
        const ser = V.mode === 'series';
        for (const id of ['r', 'l', 'c', 'f', 'tune']) ctl.show(id, ser);
        for (const id of ['cap', 'esl', 'esr', 'bulk']) ctl.show(id, !ser);
        for (const k of SER) ro.show(k, ser);
        for (const k of CAP) ro.show(k, !ser);
        if (ser) {
          const f0 = 1 / (TAU * Math.sqrt(V.l * V.c)), Q = Math.sqrt(V.l / V.c) / V.r;
          const fs = logspace(f0 / 10, f0 * 10, 301);
          const mk = (R, dash, lab) => ({ pts: series(R, fs).map((s, k) => [fs[k], cabs(s.i) * 1e3]), label: lab, dash });
          const e = Math.sqrt(1 + 1 / (4 * Q * Q)), f1 = f0 * (e - 1 / (2 * Q)), f2 = f0 * (e + 1 / (2 * Q));
          at = series(V.r, [V.f])[0];
          const imax = 1 / V.r * 1e3;
          plot.set({
            x: { label: 'frequency (Hz)', log: true, min: f0 / 10, max: f0 * 10 },
            y: { label: 'current (mA)', log: false, min: 0, max: imax * 1.1 },
            series: [mk(V.r, null, 'R = ' + kit.eng(V.r, 'Ω') + ', Q = ' + Q.toPrecision(3)), mk(3 * V.r, [6, 4], '3R'), mk(10 * V.r, [2, 4], '10R')],
            hlines: [{ y: imax / Math.SQRT2, label: 'half power: I_max/√2' }],
            vlines: [{ x: f1, label: 'f₁' }, { x: f0, label: 'f₀' }, { x: f2, label: 'f₂' }],
            marks: [{ x: V.f, y: cabs(at.i) * 1e3 }],
            fmtX: v => kit.eng(v, 'Hz'), fmtY: v => kit.fmt(v, 3) + ' mA'
          });
          ro.set('f0', kit.eng(f0, 'Hz'));
          ro.set('q', Q.toPrecision(3));
          ro.set('bw', kit.eng(f0 / Q, 'Hz') + ' (' + kit.eng(f1, 'Hz') + ' to ' + kit.eng(f2, 'Hz') + ')');
          ro.set('i', kit.eng(cabs(at.i), 'A'));
          ro.set('vc', kit.eng(cabs(at.vc), 'V') + ', ' + kit.eng(cabs(at.vl), 'V'));
          const phi = deg(carg(at.i));
          ro.set('ph', Math.abs(phi) < 0.5 ? 'in phase with the voltage' : phi > 0 ? 'leads by ' + phi.toFixed(1) + '° (capacitive)' : 'lags by ' + (-phi).toFixed(1) + '° (inductive)');
        } else {
          const fs = logspace(1e4, 1e9, 251);
          const cs = capCircuit(true, false), cb = capCircuit(false, true), cp = capCircuit(true, true);
          const z = (c, f) => cabs(fromAc(c.ac(f).v('p')));
          const zs = fs.map(f => [f, z(cs, f)]);
          const ser = [{ pts: fs.map(f => [f, 1 / (TAU * f * V.cap)]), label: 'ideal ' + kit.eng(V.cap, 'F'), dash: [3, 4] }, { pts: zs, label: 'real ' + kit.eng(V.cap, 'F') }];
          let peak = null;
          const srf = 1 / (TAU * Math.sqrt(V.esl * V.cap)), srfB = 1 / (TAU * Math.sqrt(2e-9 * 10e-6));
          if (V.bulk) {
            ser.push({ pts: fs.map(f => [f, z(cb, f)]), label: '10 µF alone', dash: [6, 4] });
            const zp = fs.map(f => [f, z(cp, f)]);
            ser.push({ pts: zp, label: 'both in parallel', width: 3 });
            const lo = Math.min(srf, srfB), hi = Math.max(srf, srfB);
            for (const p of zp) if (p[0] > lo && p[0] < hi && (!peak || p[1] > peak[1])) peak = p;
          }
          plot.set({
            x: { label: 'frequency (Hz)', log: true, min: 1e4, max: 1e9 },
            y: { label: '|Z| (Ω)', log: true, min: 1e-3, max: 1e3 },
            series: ser, hlines: [{ y: V.esr, label: 'ESR' }], vlines: [{ x: srf, label: 'SRF' }],
            marks: peak ? [{ x: peak[0], y: peak[1], label: 'anti-resonance' }] : [],
            fmtX: v => kit.eng(v, 'Hz'), fmtY: v => kit.eng(v, 'Ω')
          });
          ro.set('srf', kit.eng(srf, 'Hz'));
          ro.set('zsrf', kit.eng(z(cs, srf), 'Ω'));
          ro.set('z1m', kit.eng(z(cs, 1e6), 'Ω') + ' (' + kit.eng(1 / (TAU * 1e6 * V.cap), 'Ω') + ')');
          ro.set('z300', kit.eng(z(cs, 3e8), 'Ω') + ' (' + kit.eng(1 / (TAU * 3e8 * V.cap), 'Ω') + ')');
          ro.show('srfb', V.bulk); ro.show('ar', V.bulk);
          ro.set('srfb', kit.eng(srfB, 'Hz'));
          ro.set('ar', peak ? kit.eng(peak[1], 'Ω') + ' at ' + kit.eng(peak[0], 'Hz') : '—');
        }
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        if (V.mode === 'series') {
          const x0 = Math.max(50, W * 0.08), x1 = Math.min(W - 200, x0 + 420), yT = 48, yB = Hh - 32;
          const d = x1 - x0;
          S.vsource(g, x0, yB, x0, yT, { ac: true, label: '1 V', value: kit.eng(V.f, 'Hz') });
          S.wire(g, [[x0, yT], [x0 + d * 0.06, yT]]);
          S.resistor(g, x0 + d * 0.06, yT, x0 + d * 0.3, yT, { label: 'R', value: kit.eng(V.r, 'Ω') });
          S.wire(g, [[x0 + d * 0.3, yT], [x0 + d * 0.36, yT]]);
          S.inductor(g, x0 + d * 0.36, yT, x0 + d * 0.64, yT, { label: 'L', value: kit.eng(V.l, 'H') });
          S.wire(g, [[x0 + d * 0.64, yT], [x1, yT]]);
          S.capacitor(g, x1, yT, x1, yB, { label: 'C', value: kit.eng(V.c, 'F') });
          S.wire(g, [[x0, yB], [x1, yB]]);
          if (at) {
            S.meter(g, x0 + d * 0.5, yB, 'A', kit.eng(cabs(at.i), 'A'));
            const xr = x1 + 80;
            kit.label(g, 'At ' + kit.eng(V.f, 'Hz') + ':', xr, yT + 4, { size: 12.5, color: C.text, weight: 600 });
            kit.label(g, 'I   ' + kit.eng(cabs(at.i), 'A'), xr, yT + 28, { size: 12.5, color: C.accent });
            kit.label(g, 'V_L ' + kit.eng(cabs(at.vl), 'V'), xr, yT + 50, { size: 12.5, color: C.series[1] });
            kit.label(g, 'V_C ' + kit.eng(cabs(at.vc), 'V'), xr, yT + 72, { size: 12.5, color: C.series[2] });
            kit.label(g, 'source 1 V', xr, yT + 94, { size: 12, color: C.muted });
          }
        } else {
          const x0 = Math.max(60, W * 0.12), yT = 30, yB = Hh - 30, h = yB - yT;
          S.rail(g, x0, yT + 10, 'supply rail');
          const col = (x, cval, esr, esl, lab) => {
            S.wire(g, [[x0, yT + 10], [x, yT + 10]]);
            S.capacitor(g, x, yT + 10, x, yT + 10 + h * 0.3, { label: lab, value: kit.eng(cval, 'F') });
            S.resistor(g, x, yT + 10 + h * 0.3, x, yT + 10 + h * 0.6, { label: 'ESR', value: kit.eng(esr, 'Ω') });
            S.inductor(g, x, yT + 10 + h * 0.6, x, yB - 8, { label: 'ESL', value: kit.eng(esl, 'H') });
            S.ground(g, x, yB - 8);
          };
          col(x0 + 60, V.cap, V.esr, V.esl, 'C');
          if (V.bulk) col(x0 + 230, 10e-6, 0.01, 2e-9, 'C bulk');
          const xt = V.bulk ? x0 + 400 : x0 + 230;
          if (W - xt > 250) {
            kit.label(g, 'Below its self-resonance a capacitor', xt, yT + 30, { size: 12.5, color: C.text });
            kit.label(g, 'is a capacitor; above it, an inductor.', xt, yT + 50, { size: 12.5, color: C.text });
            kit.label(g, 'At the dip only the ESR is left.', xt, yT + 76, { size: 12.5, color: C.muted });
          }
        }
      }
      compute();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
    }
  });

  /* ================================================================ Bode plotter and the filter on the scope */
  Hyper.sim('acf-bode', {
    title: 'Bode plotter: filters on the bench',
    blurb: `Pick a filter; the simulator sweeps it from 10 Hz to 1 MHz and draws its Bode plot — gain in decibels and phase against log frequency. The scope shows a 1 V sine at the **test frequency** going in (yellow) and coming out (blue).

- **RC low-pass:** flat, then a −20 dB/decade slope; at the corner the gain is −3 dB and the phase −45°. Move the test frequency a decade above: one tenth of the amplitude, lagging almost 90°.
- **Two RC sections:** the slope doubles to −40 dB/decade, but the knee is soft — at the corner it is already −9.5 dB, because the second section loads the first.
- **Sallen–Key:** an op-amp buffers the second order; set $Q = 0.707$ for the flattest (Butterworth) response, raise $Q$ and a peak grows. Far up, the real op-amp runs out of gain and the response climbs back.
- **Band-pass and notch:** $Q$ sets how narrow they are.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const S = kit.schem;
      const types = [['RC low-pass', 'lp'], ['RC high-pass', 'hp'], ['Two RC low-pass sections', 'lp2'], ['Sallen–Key low-pass (op-amp)', 'sk'], ['RLC band-pass', 'bp'], ['RLC band-stop (notch)', 'bs']];
      const qDefault = { sk: 0.707, bp: 2, bs: 2 };
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Filter', options: types, value: params.type || 'lp' },
        { id: 'fc', label: 'Corner / centre frequency', min: 50, max: 20e3, value: params.fc || 1000, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'q', label: 'Q', min: 0.3, max: 10, value: qDefault[params.type] || 0.707, log: true, sig: 2 },
        { id: 'f', label: 'Test frequency', min: 10, max: 1e6, value: params.f || 1000, log: true, sig: 3, fmt: v => kit.eng(v, 'Hz') },
        { id: 'asy', type: 'check', label: 'Show straight-line asymptotes', value: true }
      ], (id) => {
        if (id === 'type' && qDefault[V.type]) ctl.set('q', qDefault[V.type]);
        compute(); dirty = true;
      });
      const ro = kit.readout(box.side, [['parts', 'Components'], ['fc', 'Corner / centre'], ['mag', 'Gain at the test frequency'], ['ph', 'Phase at the test frequency'], ['dl', 'Time shift'], ['slope', 'Local slope']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const pm = kit.plot(gbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: 'gain (dB)' } }, 210);
      const pp = kit.plot(gbox, { x: { label: 'frequency (Hz)', log: true }, y: { label: 'phase (°)' } }, 160);
      const V = ctl.values;
      let dirty = true, circ = null, parts = {}, test = { mag: 1, phase: 0 };

      function build() {
        const c = new kit.Circuit();
        c.V('in', 'gnd', 0, { ac: 1 });
        const w0 = TAU * V.fc, Q = V.q, Z0 = 1000;
        let p = {};
        switch (V.type) {
          case 'hp': { const R = 10e3, C = 1 / (w0 * R); c.C('in', 'out', C, 0); c.R('out', 'gnd', R); p = { R, C }; break; }
          case 'lp2': { const R = 10e3, C = 1 / (w0 * R); c.R('in', 'a', R); c.C('a', 'gnd', C, 0); c.R('a', 'out', R); c.C('out', 'gnd', C, 0); p = { R, C }; break; }
          case 'sk': {
            const C2 = 10e-9, C1 = 4 * Q * Q * C2, R = 1 / (w0 * 2 * Q * C2);
            c.R('in', 'x', R); c.R('x', 'p', R); c.C('p', 'gnd', C2, 0); c.C('x', 'out', C1, 0);
            c.OPAMP('p', 'out', 'out', { gain: 2e5, gbw: 1e6, rout: 50 });     // a general-purpose op-amp: 1 MHz, 50 Ω open-loop output
            p = { R, C1, C2 }; break;
          }
          case 'bp': { const L = Z0 / w0, C = 1 / (Z0 * w0), R = Z0 / Q; c.L('in', 'a', L, 0); c.C('a', 'out', C, 0); c.R('out', 'gnd', R); p = { R, L, C }; break; }
          case 'bs': { const L = Z0 / w0, C = 1 / (Z0 * w0), R = Z0 / Q; c.R('in', 'out', R); c.L('out', 'a', L, 0); c.C('a', 'gnd', C, 0); p = { R, L, C }; break; }
          default: { const R = 10e3, C = 1 / (w0 * R); c.R('in', 'out', R); c.C('out', 'gnd', C, 0); p = { R, C }; }
        }
        return { c, p };
      }
      function asymptotes(fmin, fmax) {
        const f0 = V.fc, Q = V.q, t = V.type;
        const L = x => Math.log10(x);
        if (t === 'lp') return [[fmin, 0], [f0, 0], [fmax, -20 * L(fmax / f0)]];
        if (t === 'hp') return [[fmin, -20 * L(f0 / fmin)], [f0, 0], [fmax, 0]];
        if (t === 'sk') return [[fmin, 0], [f0, 0], [fmax, -40 * L(fmax / f0)]];
        if (t === 'lp2') {
          const p1 = f0 * (3 - Math.sqrt(5)) / 2, p2 = f0 * (3 + Math.sqrt(5)) / 2;
          return [[fmin, 0], [p1, 0], [p2, -20 * L(p2 / p1)], [fmax, -20 * L(p2 / p1) - 40 * L(fmax / p2)]];
        }
        if (t === 'bp') { const q = -20 * L(Q); return [[fmin, 20 * L(fmin / f0) + q], [f0, q], [fmax, -20 * L(fmax / f0) + q]]; }
        return null;
      }
      function compute() {
        ctl.show('q', V.type === 'sk' || V.type === 'bp' || V.type === 'bs');
        const b = build();
        circ = b.c; parts = b.p;
        const fs = logspace(10, 1e6, 301);
        const mag = [], ph = [];
        let prev = null, acc = 0;
        for (const f of fs) {
          const r = circ.ac(f).v('out');
          let p = r.phase;
          if (prev != null) {
            let d = p + acc - prev;
            if (d > 270) acc -= 360; else if (d < -270) acc += 360;
          }
          p += acc; prev = p;
          mag.push([f, dB(r.mag)]); ph.push([f, p]);
        }
        const r = circ.ac(V.f).v('out');
        test = r;
        const up = circ.ac(V.f * 1.02).v('out').mag, dn = circ.ac(V.f / 1.02).v('out').mag;
        const slope = (dB(up) - dB(dn)) / (2 * Math.log10(1.02));
        let ymax = 5;
        for (const p of mag) ymax = Math.max(ymax, p[1] + 5);
        const ser = [{ pts: mag, label: '|H|' }];
        const as = V.asy ? asymptotes(10, 1e6) : null;
        if (as) ser.push({ pts: as, label: 'asymptotes', dash: [6, 5], width: 1.6, hover: false });
        const lab = V.type === 'bp' || V.type === 'bs' ? 'f₀' : 'f_c';
        pm.set({
          x: { label: 'frequency (Hz)', log: true, min: 10, max: 1e6 },
          y: { label: 'gain (dB)', min: -80, max: Math.ceil(ymax / 10) * 10 },
          series: ser, vlines: [{ x: V.fc, label: lab }], hlines: [{ y: -3, label: '−3 dB' }],
          marks: [{ x: V.f, y: dB(r.mag) }], fmtX: v => kit.eng(v, 'Hz'), fmtY: v => v.toFixed(1) + ' dB'
        });
        pp.set({
          x: { label: 'frequency (Hz)', log: true, min: 10, max: 1e6 },
          y: { label: 'phase (°)' },
          series: [{ pts: ph, label: 'phase' }], vlines: [{ x: V.fc, label: lab }],
          marks: [{ x: V.f, y: ph.reduce((best, p) => Math.abs(Math.log(p[0] / V.f)) < Math.abs(Math.log(best[0] / V.f)) ? p : best, ph[0])[1] }],
          fmtX: v => kit.eng(v, 'Hz'), fmtY: v => v.toFixed(1) + '°'
        });
        const e = kit.eng;
        const pr = parts;
        ro.set('parts', V.type === 'sk' ? 'R₁ = R₂ = ' + e(pr.R, 'Ω') + ', C₁ = ' + e(pr.C1, 'F') + ', C₂ = ' + e(pr.C2, 'F')
          : pr.L ? 'R = ' + e(pr.R, 'Ω') + ', L = ' + e(pr.L, 'H') + ', C = ' + e(pr.C, 'F') : 'R = ' + e(pr.R, 'Ω') + ', C = ' + e(pr.C, 'F'));
        ro.set('fc', e(V.fc, 'Hz') + (V.type === 'lp2' ? ' (each section)' : ''));
        ro.set('mag', r.mag.toPrecision(3) + ' × = ' + dB(r.mag).toFixed(1) + ' dB');
        ro.set('ph', r.phase.toFixed(1) + '°');
        ro.set('dl', e(Math.abs(r.phase) / 360 / V.f, 's') + (r.phase < 0 ? ' behind' : r.phase > 0 ? ' ahead' : ''));
        ro.set('slope', (Math.abs(slope) < 0.05 ? 0 : slope).toFixed(1) + ' dB/decade');
      }

      function drawSchematic(g, C, x0, y0, w, h) {
        const e = kit.eng, pr = parts, t = V.type, yb = y0 + h - 22;
        // the signal row: lower for the Sallen–Key, whose feedback capacitor runs above it
        const yt = t === 'sk' ? y0 + 126 : y0 + 50;
        const xin = x0 + 16;
        S.vsource(g, xin, yb, xin, yt, { ac: true, label: 'in', value: '1 V' });
        S.ground(g, xin, yb);
        const xo = x0 + w - 30;
        const outCol = kit.hue(HUE[1]);
        const out = x => { S.wire(g, [[x, yt], [xo, yt]]); S.node(g, xo, yt); kit.label(g, 'out', xo + 6, yt, { size: 12, color: outCol, weight: 600 }); };
        const bottom = x => S.wire(g, [[xin, yb], [x, yb]]);
        if (t === 'lp' || t === 'hp') {
          const xa = xin + (w - 60) * 0.25, xb = xin + (w - 60) * 0.65;
          S.wire(g, [[xin, yt], [xa, yt]]);
          if (t === 'lp') { S.resistor(g, xa, yt, xb, yt, { label: 'R', value: e(pr.R, 'Ω') }); S.capacitor(g, xb, yt, xb, yb, { label: 'C', value: e(pr.C, 'F') }); }
          else { S.capacitor(g, xa, yt, xb, yt, { label: 'C', value: e(pr.C, 'F') }); S.resistor(g, xb, yt, xb, yb, { label: 'R', value: e(pr.R, 'Ω') }); }
          S.node(g, xb, yt); bottom(xb); out(xb);
        } else if (t === 'lp2') {
          const d = (w - 60) / 4;
          S.wire(g, [[xin, yt], [xin + d * 0.3, yt]]);
          S.resistor(g, xin + d * 0.3, yt, xin + d * 1.4, yt, { label: 'R', value: e(pr.R, 'Ω') });
          S.capacitor(g, xin + d * 1.4, yt, xin + d * 1.4, yb, { label: 'C', value: e(pr.C, 'F') });
          S.resistor(g, xin + d * 1.4, yt, xin + d * 2.6, yt, { label: 'R' });
          S.capacitor(g, xin + d * 2.6, yt, xin + d * 2.6, yb, { label: 'C' });
          S.node(g, xin + d * 1.4, yt); S.node(g, xin + d * 2.6, yt);
          bottom(xin + d * 2.6); out(xin + d * 2.6);
        } else if (t === 'bp') {
          const d = (w - 60) / 4;
          S.wire(g, [[xin, yt], [xin + d * 0.2, yt]]);
          S.inductor(g, xin + d * 0.2, yt, xin + d * 1.4, yt, { label: 'L', value: e(pr.L, 'H') });
          S.capacitor(g, xin + d * 1.4, yt, xin + d * 2.6, yt, { label: 'C', value: e(pr.C, 'F') });
          S.resistor(g, xin + d * 2.6, yt, xin + d * 2.6, yb, { label: 'R', value: e(pr.R, 'Ω') });
          S.node(g, xin + d * 2.6, yt); bottom(xin + d * 2.6); out(xin + d * 2.6);
        } else if (t === 'bs') {
          const d = (w - 60) / 4, xm = xin + d * 2.4, ym = (yt + yb) / 2;
          S.wire(g, [[xin, yt], [xin + d * 0.6, yt]]);
          S.resistor(g, xin + d * 0.6, yt, xm, yt, { label: 'R', value: e(pr.R, 'Ω') });
          S.inductor(g, xm, yt, xm, ym, { label: 'L', value: e(pr.L, 'H') });
          S.capacitor(g, xm, ym, xm, yb, { label: 'C', value: e(pr.C, 'F') });
          S.node(g, xm, yt); bottom(xm); out(xm);
        } else {
          // Sallen–Key, unity gain: in – R₁ – x – R₂ – (+); C₂ from (+) to ground; C₁ from x up and over
          // to the output; the output straight back to (−)
          const d = (w - 60) / 5;
          const xx = xin + d * 1.2, xp = xin + d * 2.3;
          const ya = yt - 15;                         // op-amp centre: its + input (the lower pin) on the signal row
          const yfb = ya - 40, yc = ya - 72;          // the feedback wire, and the row of C₁ above it
          S.wire(g, [[xin, yt], [xin + d * 0.1, yt]]);
          S.resistor(g, xin + d * 0.1, yt, xx, yt, { label: 'R₁', value: e(pr.R, 'Ω'), labelOffset: 14 });
          S.resistor(g, xx, yt, xp, yt, { label: 'R₂', labelOffset: 14 });
          S.node(g, xx, yt);
          const pins = S.opamp(g, xp + d * 1.3, ya, {});
          S.wire(g, [[xp, yt], pins.inp]);
          S.node(g, xp, yt);
          S.capacitor(g, xp, yt, xp, yb, { label: 'C₂', value: e(pr.C2, 'F') });
          bottom(xp);
          const xo2 = pins.out[0] + 12, xc1 = xo2 + 18;
          S.wire(g, [pins.out, [xc1, pins.out[1]]]);
          S.node(g, xo2, pins.out[1]);
          S.wire(g, [pins.inn, [pins.inn[0] - 8, pins.inn[1]], [pins.inn[0] - 8, yfb], [xo2, yfb], [xo2, pins.out[1]]]);
          S.wire(g, [[xx, yt], [xx, yc]]);
          S.capacitor(g, xx, yc, xc1, yc, { label: 'C₁', value: e(pr.C1, 'F'), labelOffset: 14 });
          S.wire(g, [[xc1, yc], [xc1, pins.out[1]]]);
          S.node(g, xc1, pins.out[1]);
          S.wire(g, [[xc1, pins.out[1]], [xo, pins.out[1]]]);
          S.node(g, xo, pins.out[1]);
          kit.label(g, 'out', xo + 6, pins.out[1], { size: 12, color: outCol, weight: 600 });
        }
      }
      function draw() {
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const sw = Math.max(240, W * 0.5), sx = W - sw - 14;
        drawSchematic(g, C, 8, 0, sx - 16, Hh);
        const w = TAU * V.f, T = 1 / V.f, tdiv = niceUp(T / 4.5);
        const vdiv = perDiv(Math.max(1, test.mag), 3.5);
        const ph = test.phase * Math.PI / 180;
        S.scope(g, sx, 14, sw, Hh - 40, {
          tdiv,
          traces: [{ fn: t => Math.sin(w * t), vdiv, label: 'in', color: SC[0] }, { fn: t => test.mag * Math.sin(w * t + ph), vdiv, label: 'out', color: SC[1] }]
        });
      }
      compute();
      const loop = kit.loop(() => { if (dirty) { dirty = false; draw(); } }, box.stage);
      loop.start();
      st.onResize(() => { dirty = true; loop.once(); });
    }
  });

  /* ================================================================ three-phase supply */
  Hyper.sim('acf-three-phase', {
    title: 'Three-phase supply: phase and line voltages',
    blurb: `Three sources 120° apart feed three load resistors connected in star. The phasors turn together (slowed down); the scope shows the phase voltages and, if you like, the line voltage $v_{12}$ between two phases — $\\sqrt{3}$ times larger and 30° ahead.

- With equal loads the three currents cancel: the neutral carries nothing, and the total power drawn is perfectly steady (ripple 0 %).
- Make the loads unequal: now the neutral carries the difference.
- Then **disconnect the neutral** with unequal loads: the load's star point wanders off the centre, and one load gets far more than its rated voltage. That is why a broken neutral wrecks appliances.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'sys', type: 'select', label: 'Supply', options: [['230/400 V, 50 Hz', 'eu'], ['120/208 V, 60 Hz', 'us']], value: 'eu' },
        { id: 'ra', label: 'Load on L1', min: 10, max: 500, step: 1, value: 50, unit: 'Ω' },
        { id: 'rb', label: 'Load on L2', min: 10, max: 500, step: 1, value: 50, unit: 'Ω' },
        { id: 'rc', label: 'Load on L3', min: 10, max: 500, step: 1, value: 50, unit: 'Ω' },
        { id: 'neutral', type: 'check', label: 'Neutral connected', value: true },
        { id: 'line', type: 'check', label: 'Show the line voltage v₁₂', value: true },
        { id: 'spin', type: 'check', label: 'Rotate (time slowed down)', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['vp', 'Phase voltage (RMS)'], ['vl', 'Line voltage (RMS)'], ['i', 'Line currents I₁, I₂, I₃'], ['in', 'Neutral current'], ['vld', 'Voltage on each load'], ['p', 'Total power'], ['rip', 'Ripple of total power']]);
      const V = ctl.values;
      let P = null, tc = 0;

      function solve() {
        const us = V.sys === 'us', Vph = us ? 120 : 230, f = us ? 60 : 50, Vpk = Vph * Math.SQRT2;
        const c = new kit.Circuit();
        c.V('a', 'gnd', 0, { ac: Vpk, phase: 0 });
        c.V('b', 'gnd', 0, { ac: Vpk, phase: -120 });
        c.V('c', 'gnd', 0, { ac: Vpk, phase: 120 });
        c.R('a', 's', V.ra); c.R('b', 's', V.rb); c.R('c', 's', V.rc);
        c.SW('s', 'gnd', V.neutral);
        const ac = c.ac(f);
        const Va = fromAc(ac.v('a')), Vb = fromAc(ac.v('b')), Vc = fromAc(ac.v('c')), Vs = fromAc(ac.v('s'));
        const La = csub(Va, Vs), Lb = csub(Vb, Vs), Lc = csub(Vc, Vs);
        const Ia = cscale(La, 1 / V.ra), Ib = cscale(Lb, 1 / V.rb), Ic = cscale(Lc, 1 / V.rc);
        const In = cadd(cadd(Ia, Ib), Ic);
        const w = TAU * f;
        P = { Va, Vb, Vc, Vs, La, Lb, Lc, Ia, Ib, Ic, In: V.neutral ? In : cx(0, 0), w, f, Vpk };
        const rms = p => kit.eng(cabs(p) / Math.SQRT2, 'A');
        ro.set('vp', kit.eng(Vph, 'V'));
        ro.set('vl', kit.eng(cabs(csub(Va, Vb)) / Math.SQRT2, 'V') + ' = √3 × ' + Vph + ' V');
        ro.set('i', [Ia, Ib, Ic].map(rms).join(', '));
        ro.set('in', V.neutral ? rms(In) : 'no neutral');
        ro.set('vld', [La, Lb, Lc].map(p => kit.eng(cabs(p) / Math.SQRT2, 'V')).join(', '));
        const Pt = 0.5 * (cabs(La) ** 2 / V.ra + cabs(Lb) ** 2 / V.rb + cabs(Lc) ** 2 / V.rc);
        ro.set('p', kit.eng(Pt, 'W'));
        // instantaneous total power over a cycle
        let mn = Infinity, mx = -Infinity;
        for (let k = 0; k < 200; k++) {
          const t = k / 200 / f;
          const p = inst(La, w, t) ** 2 / V.ra + inst(Lb, w, t) ** 2 / V.rb + inst(Lc, w, t) ** 2 / V.rc;
          mn = Math.min(mn, p); mx = Math.max(mx, p);
        }
        ro.set('rip', Pt > 0 ? (100 * (mx - mn) / Pt < 0.05 ? '0' : (100 * (mx - mn) / Pt).toFixed(0)) + ' % (peak to peak)' : '—');
      }

      function draw(dt) {
        if (!P) return;
        const C = kit.colors();
        const g = st.begin();
        const W = st.W, Hh = st.H;
        const T = 1 / P.f, tdiv = niceUp(T / 5), span = 10 * tdiv;
        if (V.spin) tc = (tc + (dt || 0) * 0.2 * T) % span;
        const ang = P.w * tc;
        const cols = HUE.map(h => kit.hue(h));
        const top = 12, sh = Math.min(Hh * 0.58, W * 0.42), cy = top + sh / 2;
        const scx = W * 0.4, sw = W - scx - 14;
        const Vline = cabs(csub(P.Va, P.Vb));
        const vdiv = perDiv(V.line ? Vline : P.Vpk, 3.4), k = sh / 8 / vdiv;
        const ox = W * 0.2, oy = cy;
        g.strokeStyle = C.grid; g.lineWidth = 1;
        g.beginPath(); g.moveTo(16, oy); g.lineTo(W * 0.38, oy); g.moveTo(ox, top); g.lineTo(ox, top + sh); g.stroke();
        const r = p => rotate(p, ang);
        const va = r(P.Va), vb = r(P.Vb), vc = r(P.Vc), vs = r(P.Vs);
        const ta = arrowP(kit, g, ox, oy, va, k, cols[0], 'V₁', 2.6);
        const tb = arrowP(kit, g, ox, oy, vb, k, cols[1], 'V₂', 2.6);
        const tcc = arrowP(kit, g, ox, oy, vc, k, cols[2], 'V₃', 2.6);
        if (V.line) {
          // the line-voltage triangle joins the tips; V₁₂ = V₁ − V₂ runs from the tip of V₂ to the tip of V₁
          dashed(g, tcc[0], tcc[1], ta[0], ta[1], C.faint, 1.2);
          dashed(g, tb[0], tb[1], tcc[0], tcc[1], C.faint, 1.2);
          kit.arrow(g, tb[0], tb[1], ta[0], ta[1], cols[3], 2.2);
          kit.label(g, 'V₁₂', (ta[0] + tb[0]) / 2 + 6, (ta[1] + tb[1]) / 2, { size: 12, color: cols[3], weight: 600 });
        }
        // the load's star point, and the currents (on their own scale)
        const sp = [ox + vs.re * k, oy - vs.im * k];
        if (cabs(P.Vs) > 1e-3 * P.Vpk) {
          for (const t of [ta, tb, tcc]) dashed(g, sp[0], sp[1], t[0], t[1], C.bad, 1.2);
          kit.dot(g, sp[0], sp[1], 4.5, C.bad);
          kit.label(g, 'load star point', sp[0] + 8, sp[1] + 12, { size: 11, color: C.bad });
        }
        const imax = Math.max(cabs(P.Ia), cabs(P.Ib), cabs(P.Ic), 1e-12);
        const ik = 0.45 * P.Vpk * k / imax;
        [[P.Ia, 'I₁'], [P.Ib, 'I₂'], [P.Ic, 'I₃']].forEach(([I, lab]) => arrowP(kit, g, ox, oy, r(I), ik, C.muted, lab, 1.4));
        if (cabs(P.In) > 1e-3 * imax) arrowP(kit, g, ox, oy, r(P.In), ik, C.bad, 'I_N', 2);
        // scope with the cursor at the same instant
        const traces = [P.Va, P.Vb, P.Vc].map((p, i) => ({ fn: t => inst(p, P.w, t), vdiv, label: (sw > 430 ? 'v' : '') + (i + 1), color: SC[i], width: 1.8 }));
        if (V.line) traces.push({ fn: t => inst(csub(P.Va, P.Vb), P.w, t), vdiv, label: sw > 430 ? 'v12' : '12', color: SC[3], width: 2.2 });
        S.scope(g, scx, top, sw, sh, { tdiv, traces });
        const xc = scx + tc / span * sw;
        g.save(); g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 1; g.beginPath(); g.moveTo(xc, top); g.lineTo(xc, top + sh); g.stroke(); g.restore();
        [ta, tb, tcc].forEach((t, i) => { if (t[1] >= top && t[1] <= top + sh) { dashed(g, ox, t[1], xc, t[1], SC[i], 1); kit.dot(g, xc, t[1], 3.5, SC[i]); } });
        // the wiring: three phases and a neutral to a star-connected load
        const y0 = top + sh + 40, y3 = Hh - 12;
        if (y3 - y0 > 126) {
          const xs = 60, xe = Math.min(W - 70, xs + 560);
          const ys = [y0, y0 + 22, y0 + 44], ystar = y3 - 30, yn = y3 - 6;
          const loads = [V.ra, V.rb, V.rc];
          kit.label(g, 'supply', xs - 26, y0 - 20, { size: 11, color: C.muted });
          ys.forEach((y, i) => {
            kit.label(g, 'L' + (i + 1), xs - 26, y, { size: 12, color: cols[i], weight: 700 });
            const xl = xe - 150 + i * 60;
            S.wire(g, [[xs, y], [xl, y], [xl, y0 + 58]], { color: cols[i] });
            S.resistor(g, xl, y0 + 58, xl, ystar, { label: kit.eng(loads[i], 'Ω'), labelOffset: 12 });
          });
          S.wire(g, [[xe - 150, ystar], [xe - 30, ystar]]);
          [0, 1, 2].forEach(i => S.node(g, xe - 150 + i * 60, ystar));
          kit.label(g, 'star point', xe - 24, ystar, { size: 11, color: C.muted });
          kit.label(g, 'N', xs - 26, yn, { size: 12, color: C.text, weight: 700 });
          S.wire(g, [[xs, yn], [xe - 280, yn]]);
          S.switch(g, xe - 280, yn, xe - 230, yn, { closed: V.neutral });
          S.wire(g, [[xe - 230, yn], [xe - 90, yn], [xe - 90, ystar]]);
          kit.label(g, V.neutral ? 'neutral current ' + kit.eng(cabs(P.In) / Math.SQRT2, 'A') : 'neutral open', xs + 10, yn - 12, { size: 11.5, color: V.neutral ? C.warn : C.bad });
        }
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
