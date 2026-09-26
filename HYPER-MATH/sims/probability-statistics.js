/* HYPER-MATH · sims/probability-statistics.js — simulations for the Probability &
 * Statistics branch (probability, distributions, statistics). Every id starts "ps-".
 * Wrapped in a function so the helpers do not leak into the shared global scope. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared maths */
  const SQRTPI = Math.sqrt(Math.PI), SQ2PI = Math.sqrt(2 * Math.PI);
  function erfSeries(x) {
    let sum = 0, term = x, n = 0;
    while (Math.abs(term) > 1e-17 * Math.max(1, Math.abs(sum)) && n < 200) { sum += term / (2 * n + 1); n++; term *= -x * x / n; }
    return 2 / SQRTPI * sum;
  }
  function erfc(x) {
    if (x < 0) return 2 - erfc(-x);
    if (x < 3) return 1 - erfSeries(x);
    let f = x;
    for (let k = 60; k >= 1; k--) f = x + (k / 2) / f;
    return Math.exp(-x * x) / (SQRTPI * f);
  }
  const Phi = z => 0.5 * erfc(-z / Math.SQRT2);          // P(Z < z)
  const upper = z => 0.5 * erfc(z / Math.SQRT2);         // P(Z > z), accurate far out
  const normPdf = (x, mu, s) => Math.exp(-0.5 * ((x - mu) / s) * ((x - mu) / s)) / (s * SQ2PI);
  const LF = [0];
  const logFact = k => { for (let i = LF.length; i <= k; i++) LF[i] = LF[i - 1] + Math.log(i); return LF[k]; };
  function binomPmf(n, k, p) {
    if (k < 0 || k > n) return 0;
    if (p <= 0) return k === 0 ? 1 : 0;
    if (p >= 1) return k === n ? 1 : 0;
    return Math.exp(logFact(n) - logFact(k) - logFact(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p));
  }
  const poissonPmf = (lam, k) => lam > 0 ? Math.exp(k * Math.log(lam) - lam - logFact(k)) : (k === 0 ? 1 : 0);
  function randn() {
    let u = 0;
    while (u === 0) u = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * Math.random());
  }
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const pct = (p, d) => (100 * p).toFixed(d == null ? 1 : d) + ' %';
  const fontOf = () => { try { return getComputedStyle(document.body).fontFamily || 'sans-serif'; } catch (e) { return 'sans-serif'; } };

  /* a percentage that stays readable for tiny probabilities */
  function pctSmart(p) {
    if (!(p > 0)) return '0 %';
    if (p >= 0.1) return (100 * p).toFixed(1) + ' %';
    if (p >= 0.001) return (100 * p).toFixed(2) + ' %';
    return (100 * p).toPrecision(2) + ' %';
  }

  /* axis ticks along a horizontal line */
  function xTicks(c, C, kit, lo, hi, toX, y, fmt, n, color) {
    const step = Hyper.niceStep(hi - lo, n || 6);
    const start = Math.ceil(lo / step - 1e-9) * step;
    c.strokeStyle = C.axis; c.lineWidth = 1;
    for (let v = start; v <= hi + 1e-9 * Math.abs(hi || 1); v += step) {
      const x = toX(v);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 4); c.stroke();
      kit.label(c, fmt ? fmt(v) : kit.fmt(Math.abs(v) < 1e-12 ? 0 : v, 4), x, y + 13, { align: 'center', size: 11, color: color || C.muted });
    }
  }

  /* ================================================================ Galton board */
  Hyper.sim('ps-galton', {
    title: 'Galton board',
    blurb: `Balls fall through $n$ rows of pegs and bounce right with probability $p$ at every peg. The bin a ball ends in is its number of right-bounces $k$, so the bins fill up with a **binomial distribution** — and there are exactly $\\binom{n}{k}$ routes into bin $k$.

- Watch the bars grow towards the dots, the prediction $N\\binom{n}{k}p^k(1-p)^{n-k}$. The early piles are ragged; hundreds of balls later they match.
- Tick **Normal curve** and raise the number of rows: the bell fits better and better.
- Set $p = 0.1$ with 4 rows: the pile is lopsided. With 16 rows it is almost bell-shaped again, centred on $np$.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.68 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Rows of pegs n', min: 1, max: 16, step: 1, value: params.n || 10 },
        { id: 'p', label: 'Chance of bouncing right p', min: 0.05, max: 0.95, step: 0.05, value: params.p || 0.5 },
        { id: 'rate', label: 'Balls per second', min: 1, max: 400, value: 15, log: true, sig: 2 },
        { id: 'pred', type: 'check', label: 'Binomial prediction (dots)', value: true },
        { id: 'norm', type: 'check', label: 'Normal curve', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause', primary: true }, { id: 'burst', label: '+1000 at once' }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'n' || id === 'p' || id === 'clear') reset();
        else if (id === 'burst') { for (let i = 0; i < 1000; i++) land(dropPath().k); }
        else if (id === 'run') { running = !running; if (ctl.rows.run) ctl.rows.run.textContent = running ? 'Pause' : 'Run'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['N', 'Balls landed'], ['m', 'Mean bin (observed)'], ['mt', 'Mean, theory np'], ['s', 'Spread SD (observed)'], ['sth', 'SD, theory √(np(1−p))']]);
      const V = ctl.values;
      const SPEED = 9;            // rows fallen per second
      const MAXFLY = 160;         // balls animated at once; the rest land directly
      let counts = [], N = 0, sum = 0, sum2 = 0, flying = [], acc = 0, running = true;
      const rows = () => Math.max(1, Math.round(V.n));
      function reset() { counts = new Array(rows() + 1).fill(0); N = 0; sum = 0; sum2 = 0; flying = []; acc = 0; }
      function dropPath() {
        const n = rows(), path = [];
        let k = 0;
        for (let r = 0; r < n; r++) { const right = Math.random() < V.p ? 1 : 0; path.push(right); k += right; }
        return { path, k };
      }
      function land(k) { if (k < counts.length) { counts[k]++; N++; sum += k; sum2 += k * k; } }
      reset();

      function layout() {
        const n = rows(), W = st.W, H = st.H;
        const histTop = H * 0.56, baseY = H - 30;
        const dx = Math.max(6, Math.min((W - 40) / (n + 1), 48));
        const top = 18, bot = histTop - 12;
        const dy = (bot - top) / (n + 0.4);
        return { n, dx, dy, cx: W / 2, top, histTop, baseY };
      }
      const px = (L, r, j) => L.cx + (j - r / 2) * L.dx;
      const py = (L, r) => L.top + (r + 0.6) * L.dy;

      function draw() {
        const c = st.begin(), C = kit.colors(), L = layout(), n = L.n;
        c.font = '11px ' + fontOf();
        const p = V.p, mu = n * p, sd = Math.sqrt(n * p * (1 - p));
        // histogram scale: the tallest of the bars and the prediction
        let peak = 0;
        for (let k = 0; k <= n; k++) peak = Math.max(peak, counts[k] || 0, N * binomPmf(n, k, p));
        if (V.norm && sd > 0) peak = Math.max(peak, N * normPdf(mu, mu, sd));
        const hH = L.baseY - L.histTop;
        const sy = peak > 0 ? hH / (peak * 1.08) : 0;
        // bin walls
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 0; k <= n + 1; k++) {
          const x = px(L, n, k) - L.dx / 2;
          c.beginPath(); c.moveTo(x + 0.5, py(L, n - 1) + L.dy * 0.4); c.lineTo(x + 0.5, L.baseY); c.stroke();
        }
        // bars
        c.fillStyle = C.accent; c.globalAlpha = 0.55;
        for (let k = 0; k <= n; k++) {
          const h = (counts[k] || 0) * sy;
          if (h > 0) c.fillRect(px(L, n, k) - L.dx * 0.42, L.baseY - h, L.dx * 0.84, h);
        }
        c.globalAlpha = 1;
        // normal curve
        if (V.norm && sd > 0 && N > 0) {
          c.strokeStyle = C.series[2]; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 200; i++) {
            const k = -0.5 + (n + 1) * i / 200;
            const x = L.cx + (k - n / 2) * L.dx, y = L.baseY - N * normPdf(k, mu, sd) * sy;
            i ? c.lineTo(x, y) : c.moveTo(x, y);
          }
          c.stroke();
        }
        // binomial prediction
        if (V.pred && N > 0) for (let k = 0; k <= n; k++) kit.dot(c, px(L, n, k), L.baseY - N * binomPmf(n, k, p) * sy, 3.2, C.warn, C.bg2);
        // baseline and bin numbers
        c.strokeStyle = C.axis; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(px(L, n, 0) - L.dx / 2, L.baseY); c.lineTo(px(L, n, n) + L.dx / 2, L.baseY); c.stroke();
        const every = L.dx < 16 ? 2 : 1;
        for (let k = 0; k <= n; k += every) kit.label(c, String(k), px(L, n, k), L.baseY + 12, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'bin k = number of right bounces', L.cx, L.baseY + 25, { align: 'center', size: 11, color: C.faint });
        // pegs
        const pr = clamp(L.dx * 0.08, 1.5, 3.5);
        c.fillStyle = C.faint;
        for (let r = 0; r < n; r++) for (let j = 0; j <= r; j++) { c.beginPath(); c.arc(px(L, r, j), py(L, r) + pr + 3, pr, 0, 2 * Math.PI); c.fill(); }
        // balls in flight
        const br = clamp(L.dx * 0.14, 2, 5);
        for (const b of flying) {
          const lvl = Math.min(b.t, n), r = Math.floor(lvl), f = lvl - r;
          let j = 0;
          for (let q = 0; q < r && q < b.path.length; q++) j += b.path[q];
          let x, y;
          if (r < n) {
            const j2 = j + b.path[r];
            x = px(L, r, j) + (px(L, r + 1, j2) - px(L, r, j)) * f;
            y = py(L, r) - br + (py(L, r + 1) - py(L, r)) * f - Math.sin(Math.PI * f) * L.dy * 0.35;
            if (r === n - 1) y = py(L, r) - br + (L.dy) * f - Math.sin(Math.PI * f) * L.dy * 0.35;
          } else {
            const g = clamp(b.t - n, 0, 1);
            x = px(L, n, j);
            const y0 = py(L, n - 1) + L.dy - br, y1 = L.baseY - (counts[j] || 0) * sy - br;
            y = y0 + (Math.max(y0, y1) - y0) * g * g;
          }
          kit.dot(c, x, y, br, C.accent);
        }
        // readouts
        ro.set('N', String(N));
        ro.set('mt', kit.fmt(mu, 4));
        ro.set('sth', kit.fmt(sd, 4));
        if (N > 0) {
          const m = sum / N;
          ro.set('m', kit.fmt(m, 4));
          ro.set('s', N > 1 ? kit.fmt(Math.sqrt(Math.max(0, (sum2 - N * m * m) / (N - 1))), 4) : '—');
        } else { ro.set('m', '—'); ro.set('s', '—'); }
      }

      const loop = kit.loop((dt) => {
        if (running && dt > 0) {
          acc += V.rate * dt;
          let k = Math.floor(acc);
          acc -= k;
          while (k-- > 0) {
            const d = dropPath();
            if (flying.length < MAXFLY && V.rate < 150) flying.push({ path: d.path, k: d.k, t: 0 });
            else land(d.k);
          }
          const n = rows();
          for (const b of flying) b.t += dt * SPEED;
          const keep = [];
          for (const b of flying) { if (b.t >= n + 1) land(b.k); else keep.push(b); }
          flying = keep;
        }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Dice: the central limit theorem */
  Hyper.sim('ps-clt', {
    title: 'Dice and the central limit theorem',
    blurb: `Roll $n$ dice again and again and plot the **sum** (or the mean) of each roll. The bars are the observed fractions, the dots the exact probabilities, the curve the normal distribution with the same mean and standard deviation.

- Start with one die: every face settles near 1/6 — probability as a long-run frequency. The largest gap from the exact values shrinks roughly like $1/\\sqrt{N}$.
- Two dice give a triangle; five already look like a bell. That is the **central limit theorem** at work.
- Pick a lopsided die: one die is badly skewed, yet the sum of 20 is still bell-shaped.
- Switch the plot to **the mean**: as $n$ grows the peak narrows like $\\sigma/\\sqrt{n}$ — why averaging readings helps.`,
    mount(box, kit, params) {
      params = params || {};
      const DICE = [['Fair die', [1, 1, 1, 1, 1, 1]], ['Loaded: a six half the time', [1, 1, 1, 1, 1, 5]], ['Lopsided: mostly low faces', [10, 4, 2, 2, 1, 1]], ['Only 1 or 6', [1, 0, 0, 0, 0, 1]]];
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Dice per roll n', min: 1, max: 30, step: 1, value: params.n || 5 },
        { id: 'die', type: 'select', label: 'Each die', options: DICE, value: DICE[0][1] },
        { id: 'view', type: 'select', label: 'Plot', options: [['The sum of the dice', 'sum'], ['The mean (sum ÷ n)', 'mean']], value: params.view || 'sum' },
        { id: 'rate', label: 'Rolls per second', min: 1, max: 3000, value: params.rate || 30, log: true, sig: 2 },
        { id: 'norm', type: 'check', label: 'Normal curve', value: params.norm !== false },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause', primary: true }, { id: 'burst', label: '+10 000 at once' }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'n' || id === 'die' || id === 'clear') reset();
        else if (id === 'burst') { for (let i = 0; i < 10000; i++) roll(false); }
        else if (id === 'run') { running = !running; if (ctl.rows.run) ctl.rows.run.textContent = running ? 'Pause' : 'Run'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['N', 'Rolls'], ['m', 'Average (observed)'], ['mt', 'Average, theory'], ['s', 'SD (observed)'], ['stt', 'SD, theory'], ['gap', 'Largest gap from exact']]);
      const V = ctl.values;
      let counts = [], N = 0, sum = 0, sum2 = 0, acc = 0, running = true, last = [], cdf = [], exact = [], mu1 = 3.5, var1 = 35 / 12;
      const nn = () => Math.max(1, Math.round(V.n));
      function reset() {
        const n = nn(), w = V.die, tot = w.reduce((a, b) => a + b, 0) || 1;
        const p = w.map(x => x / tot);
        cdf = []; let run = 0;
        for (const q of p) { run += q; cdf.push(run); }
        cdf[5] = 1;
        mu1 = p.reduce((s, q, i) => s + q * (i + 1), 0);
        var1 = p.reduce((s, q, i) => s + q * (i + 1 - mu1) * (i + 1 - mu1), 0);
        // exact distribution of the sum: convolve n times (index = sum − n)
        let d = [1];
        for (let i = 0; i < n; i++) {
          const e = new Array(d.length + 5).fill(0);
          for (let s = 0; s < d.length; s++) if (d[s]) for (let f = 0; f < 6; f++) e[s + f] += d[s] * p[f];
          d = e;
        }
        exact = d;
        counts = new Array(5 * n + 1).fill(0);
        N = 0; sum = 0; sum2 = 0; acc = 0; last = [];
      }
      function face() { const u = Math.random(); let f = 0; while (f < 5 && u >= cdf[f]) f++; return f + 1; }
      function roll(keep) {
        const n = nn();
        let s = 0;
        if (keep) last = [];
        for (let i = 0; i < n; i++) { const f = face(); s += f; if (keep) last.push(f); }
        counts[s - n]++; N++; sum += s; sum2 += s * s;
      }
      reset();

      function drawDie(c, C, x, y, sz, f) {
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.border2 || C.axis; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(x, y, sz, sz, sz * 0.18) : c.rect(x, y, sz, sz); c.fill(); c.stroke();
        if (sz < 13) { kit.label(c, String(f), x + sz / 2, y + sz / 2, { align: 'center', size: Math.max(8, sz * 0.8), color: C.text }); return; }
        const P = { 1: [[0.5, 0.5]], 2: [[0.27, 0.27], [0.73, 0.73]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
                    4: [[0.27, 0.27], [0.73, 0.27], [0.27, 0.73], [0.73, 0.73]], 5: [[0.27, 0.27], [0.73, 0.27], [0.5, 0.5], [0.27, 0.73], [0.73, 0.73]],
                    6: [[0.27, 0.23], [0.73, 0.23], [0.27, 0.5], [0.73, 0.5], [0.27, 0.77], [0.73, 0.77]] }[f] || [];
        c.fillStyle = C.text;
        for (const q of P) { c.beginPath(); c.arc(x + q[0] * sz, y + q[1] * sz, sz * 0.085, 0, 2 * Math.PI); c.fill(); }
      }

      function draw() {
        const c = st.begin(), C = kit.colors(), n = nn(), W = st.W, H = st.H;
        c.font = '11px ' + fontOf();
        const mean = V.view === 'mean';
        // the latest roll
        const sz = clamp((W - 40) / n - 4, 8, 30);
        const rowW = n * (sz + 4) - 4;
        let x0 = (W - rowW) / 2;
        const shown = last.length === n ? last : [];
        shown.forEach((f, i) => drawDie(c, C, x0 + i * (sz + 4), 10, sz, f));
        if (shown.length) {
          const s = shown.reduce((a, b) => a + b, 0);
          kit.label(c, mean ? 'mean ' + kit.fmt(s / n, 3) : 'sum ' + s, W / 2, sz + 22, { align: 'center', size: 12, color: C.muted });
        }
        // histogram frame
        const L = 46, R = W - 16, T = sz + 38, B = H - 32;
        const lo = mean ? 1 : n, hi = mean ? 6 : 6 * n, bw = mean ? 1 / n : 1;   // bin width in plotted units
        const X = v => L + (v - (lo - bw / 2)) / (hi - lo + bw) * (R - L);
        const muS = n * mu1, sdS = Math.sqrt(n * var1);
        const muP = mean ? mu1 : muS, sdP = mean ? sdS / n : sdS;
        let peak = 0;
        for (let i = 0; i < exact.length; i++) peak = Math.max(peak, exact[i] / bw, N ? counts[i] / N / bw : 0);
        if (V.norm && sdP > 0) peak = Math.max(peak, normPdf(muP, muP, sdP));
        const Y = d => B - (peak > 0 ? d / (peak * 1.1) : 0) * (B - T);
        // grid and axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const ys = Hyper.niceStep(peak * 1.1 || 1, 4);
        for (let v = ys; v < peak * 1.1; v += ys) { c.beginPath(); c.moveTo(L, Y(v) + 0.5); c.lineTo(R, Y(v) + 0.5); c.stroke(); kit.label(c, kit.fmt(v, 3), L - 5, Y(v), { align: 'right', size: 10.5, color: C.faint }); }
        // bars
        c.fillStyle = C.accent; c.globalAlpha = 0.55;
        const barW = Math.max(1, (X(lo + bw) - X(lo)) * 0.86);
        if (N) for (let i = 0; i < counts.length; i++) {
          if (!counts[i]) continue;
          const v = mean ? (i + n) / n : i + n;
          const h = B - Y(counts[i] / N / bw);
          c.fillRect(X(v) - barW / 2, B - h, barW, h);
        }
        c.globalAlpha = 1;
        // normal curve
        if (V.norm && sdP > 0) {
          c.strokeStyle = C.series[2]; c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= 240; i++) {
            const v = lo - bw / 2 + (hi - lo + bw) * i / 240;
            const y = Y(normPdf(v, muP, sdP));
            i ? c.lineTo(X(v), y) : c.moveTo(X(v), y);
          }
          c.stroke();
        }
        // exact probabilities
        const dotR = clamp(barW * 0.35, 1.5, 3.4);
        for (let i = 0; i < exact.length; i++) {
          if (exact[i] < 1e-7) continue;
          const v = mean ? (i + n) / n : i + n;
          kit.dot(c, X(v), Y(exact[i] / bw), dotR, C.warn);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(L, B); c.lineTo(R, B); c.stroke();
        xTicks(c, C, kit, lo, hi, X, B, v => kit.fmt(v, 3), mean ? 5 : Math.min(10, 5 * n), C.muted);
        kit.label(c, (mean ? 'mean' : 'sum') + ' of ' + n + (n === 1 ? ' die' : ' dice') + '   ·   bars: observed   dots: exact' + (V.norm ? '   curve: normal' : ''), (L + R) / 2, T - 8, { align: 'center', size: 11, color: C.faint });
        // readouts
        ro.set('N', String(N));
        ro.set('mt', kit.fmt(muP, 4));
        ro.set('stt', kit.fmt(sdP, 4));
        if (N) {
          const m = sum / N, v = N > 1 ? Math.max(0, (sum2 - N * m * m) / (N - 1)) : 0;
          ro.set('m', kit.fmt(mean ? m / n : m, 4));
          ro.set('s', N > 1 ? kit.fmt(Math.sqrt(v) / (mean ? n : 1), 4) : '—');
          let gap = 0;
          for (let i = 0; i < exact.length; i++) gap = Math.max(gap, Math.abs(counts[i] / N - exact[i]));
          ro.set('gap', (100 * gap).toFixed(2) + ' points');
        } else { ro.set('m', '—'); ro.set('s', '—'); ro.set('gap', '—'); }
      }

      const loop = kit.loop((dt) => {
        if (running && dt > 0) {
          acc += V.rate * dt;
          let k = Math.floor(acc);
          acc -= k;
          if (k > 0) { while (k-- > 1) roll(false); roll(true); }
        }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Areas under the normal curve */
  Hyper.sim('ps-normal-area', {
    title: 'Areas under the normal curve',
    blurb: `Drag the markers **a** and **b**. The shaded area is the probability of a value in the shaded range; the lower scale shows the same markers as **z-scores**, $z = (x - \\mu)/\\sigma$.

- Try the preset buttons: ±1σ holds 68.3 %, ±2σ 95.4 %, ±3σ 99.7 %, and ±1.96σ exactly 95 %.
- Switch the example: the numbers on the top scale change, the areas for the same $z$ do not.
- Choose **Outside a and b** — the two tails a two-sided hypothesis test uses. Push the markers to ±5σ and read "about 1 in …".`,
    mount(box, kit, params) {
      params = params || {};
      const EX = [
        ['Standard normal (μ = 0, σ = 1)', { mu: 0, s: 1, unit: '', dig: 3 }],
        ['Adult male height (μ = 175 cm, σ = 7 cm)', { mu: 175, s: 7, unit: ' cm', dig: 4 }],
        ['IQ score (μ = 100, σ = 15)', { mu: 100, s: 15, unit: '', dig: 3 }],
        ['Shaft diameter (μ = 20.00 mm, σ = 0.02 mm)', { mu: 20, s: 0.02, unit: ' mm', dig: 4 }]
      ];
      const MODES = [['Between a and b', 'between'], ['Outside a and b (two tails)', 'outside'], ['Below b (left tail)', 'below'], ['Above a (right tail)', 'above']];
      const st = kit.stage(box.stage, { aspect: 0.52 });
      const z0 = params.z || 1;
      let za = -z0, zb = z0;
      const ctl = kit.controls(box.side, [
        { id: 'ex', type: 'select', label: 'Example', options: EX, value: EX[0][1] },
        { id: 'mode', type: 'select', label: 'Shade', options: MODES, value: params.mode || 'between' },
        { type: 'buttons', items: [{ id: 'k1', label: '±1σ' }, { id: 'k2', label: '±2σ' }, { id: 'k3', label: '±3σ' }, { id: 'k196', label: '±1.96σ' }] }
      ], (id) => {
        const k = { k1: 1, k2: 2, k3: 3, k196: 1.96 }[id];
        if (k) { za = -k; zb = k; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['a', 'Marker a'], ['za', 'z of a'], ['b', 'Marker b'], ['zb', 'z of b'], ['P', 'Shaded probability'], ['one', 'About 1 in']]);
      const V = ctl.values;
      const ZL = -5.3, ZR = 5.3;
      const geo = () => ({ L: 20, R: st.W - 20, T: 34, B: st.H - 52 });
      const Xz = (g, z) => g.L + (z - ZL) / (ZR - ZL) * (g.R - g.L);
      const zX = (g, x) => ZL + (x - g.L) / (g.R - g.L) * (ZR - ZL);
      const peak = normPdf(0, 0, 1);
      const Yd = (g, d) => g.B - d / (peak * 1.25) * (g.B - g.T);
      const shows = () => ({ a: V.mode !== 'below', b: V.mode !== 'above' });

      kit.drag(st, {
        hover: true,
        hit(p) {
          const g = geo(), sh = shows();
          if (p.y < g.T - 20 || p.y > g.B + 44) return null;
          const da = sh.a ? Math.abs(p.x - Xz(g, za)) : 1e9, db = sh.b ? Math.abs(p.x - Xz(g, zb)) : 1e9;
          if (Math.min(da, db) > 16) return null;
          return da <= db ? 'a' : 'b';
        },
        move(which, p) {
          const g = geo();
          const z = Math.round(clamp(zX(g, p.x), ZL + 0.05, ZR - 0.05) * 100) / 100;
          if (which === 'a') za = V.mode === 'above' ? z : Math.min(z, zb);
          else zb = V.mode === 'below' ? z : Math.max(z, za);
          loop.once();
        }
      });

      function prob() {
        switch (V.mode) {
          case 'outside': return Phi(za) + upper(zb);
          case 'below': return Phi(zb);
          case 'above': return upper(za);
          default: return Math.max(0, Phi(zb) - Phi(za));
        }
      }
      function shadeRange(c, g, z1, z2) {
        z1 = Math.max(z1, ZL); z2 = Math.min(z2, ZR);
        if (z2 <= z1) return;
        c.beginPath(); c.moveTo(Xz(g, z1), g.B);
        for (let i = 0; i <= 120; i++) { const z = z1 + (z2 - z1) * i / 120; c.lineTo(Xz(g, z), Yd(g, normPdf(z, 0, 1))); }
        c.lineTo(Xz(g, z2), g.B); c.closePath(); c.fill();
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), g = geo(), ex = V.ex, sh = shows();
        c.font = '11px ' + fontOf();
        const xs = z => kit.fmt(ex.mu + z * ex.s, ex.dig) + ex.unit;
        // shaded area
        c.fillStyle = C.accent; c.globalAlpha = 0.35;
        if (V.mode === 'between') shadeRange(c, g, za, zb);
        else if (V.mode === 'outside') { shadeRange(c, g, ZL, za); shadeRange(c, g, zb, ZR); }
        else if (V.mode === 'below') shadeRange(c, g, ZL, zb);
        else shadeRange(c, g, za, ZR);
        c.globalAlpha = 1;
        // σ guides
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let z = -5; z <= 5; z++) { c.beginPath(); c.moveTo(Xz(g, z) + 0.5, g.T); c.lineTo(Xz(g, z) + 0.5, g.B); c.stroke(); }
        // the curve
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= 300; i++) { const z = ZL + (ZR - ZL) * i / 300; const y = Yd(g, normPdf(z, 0, 1)); i ? c.lineTo(Xz(g, z), y) : c.moveTo(Xz(g, z), y); }
        c.stroke();
        // axes: x on top of the numbers, z below
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(g.L, g.B); c.lineTo(g.R, g.B); c.stroke();
        const every = Xz(g, 1) - Xz(g, 0) < 52 ? 2 : 1;   // thin the x labels on narrow screens
        for (let z = -5; z <= 5; z++) {
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(Xz(g, z), g.B); c.lineTo(Xz(g, z), g.B + 4); c.stroke();
          if (z % every === 0) kit.label(c, xs(z), Xz(g, z), g.B + 14, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, (z > 0 ? '+' : z < 0 ? '−' : '') + Math.abs(z) + 'σ', Xz(g, z), g.B + 29, { align: 'center', size: 10.5, color: C.faint });
        }
        kit.label(c, 'x', g.L - 12, g.B + 14, { size: 10.5, color: C.muted });
        kit.label(c, 'z', g.L - 12, g.B + 29, { size: 10.5, color: C.faint });
        // markers
        const mark = (z, name) => {
          const x = Xz(g, z);
          c.strokeStyle = C.series[1]; c.lineWidth = 2; c.beginPath(); c.moveTo(x, g.T - 12); c.lineTo(x, g.B); c.stroke();
          kit.dot(c, x, g.T - 14, 7, C.series[1], C.bg2);
          kit.label(c, name, x, g.T - 14, { align: 'center', size: 10, weight: 700, color: C.bg2 });
        };
        if (sh.a) mark(za, 'a');
        if (sh.b) mark(zb, 'b');
        // probability label
        const P = prob();
        const zc = V.mode === 'between' ? (za + zb) / 2 : V.mode === 'below' ? Math.max(ZL + 0.8, zb - 1.2) : V.mode === 'above' ? Math.min(ZR - 0.8, za + 1.2) : 0;
        kit.label(c, 'P = ' + pctSmart(P), Xz(g, zc), g.T + 12, { align: 'center', size: 13, weight: 700, color: C.accent, bg: C.bg2 });
        // readouts
        const zs = z => z.toFixed(2).replace('-', '−');
        ro.set('a', sh.a ? xs(za) : '—'); ro.set('za', sh.a ? zs(za) : '—');
        ro.set('b', sh.b ? xs(zb) : '—'); ro.set('zb', sh.b ? zs(zb) : '—');
        ro.set('P', P.toPrecision(4) + '  (' + pctSmart(P) + ')');
        ro.set('one', P > 0 ? kit.fmt(1 / P, 3) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ A Poisson process */
  Hyper.sim('ps-poisson-process', {
    title: 'Random events: counts and gaps',
    blurb: `Events arrive at random at an average rate $r$ — like clicks of a Geiger counter. The tape at the top shows them against time, cut into intervals of length $T$.

- **Left:** how many events fall in each interval. The dots are the Poisson prediction with $\\lambda = rT$; mean and variance of the counts both approach $\\lambda$.
- **Right:** the gaps between successive events. They follow the exponential curve $r\\,e^{-rt}$ — short gaps are the most common, which is why random events look clumped.
- Make $\\lambda$ large (high rate, long intervals) and the count histogram turns into a bell.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Rate r', min: 0.2, max: 20, value: params.rate || 2, log: true, sig: 2, unit: 'per s' },
        { id: 'T', label: 'Interval T', min: 0.25, max: 5, step: 0.25, value: 1, unit: 's' },
        { id: 'speed', type: 'select', label: 'Speed', options: [['Real time', 1], ['5 × faster', 5], ['25 × faster', 25], ['200 × faster', 200]], value: 5 },
        { id: 'theory', type: 'check', label: 'Theory (Poisson and exponential)', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Pause', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'r' || id === 'T' || id === 'clear') reset();
        else if (id === 'run') { running = !running; if (ctl.rows.run) ctl.rows.run.textContent = running ? 'Pause' : 'Run'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['lam', 'Expected count λ = rT'], ['m', 'Mean count (observed)'], ['v', 'Variance of counts'], ['g', 'Mean gap (theory 1/r)'], ['ni', 'Intervals / events']]);
      const V = ctl.values;
      const GB = 24;                                   // gap histogram bins
      let t, next, lastEv, events, hist, gaps, gapOver, nGaps, gapSum, iStart, iCount, done, cSum, cSum2, nInt, running = true;
      const expo = () => -Math.log(1 - Math.random()) / V.r;
      function reset() {
        t = 0; next = expo(); lastEv = null; events = []; hist = new Array(80).fill(0); gaps = new Array(GB).fill(0); gapOver = 0; nGaps = 0; gapSum = 0;
        iStart = 0; iCount = 0; done = []; cSum = 0; cSum2 = 0; nInt = 0;
      }
      reset();
      const gapMax = () => 5 / V.r;
      function closeTo(time) {
        while (time >= iStart + V.T) {
          hist[Math.min(iCount, hist.length - 1)]++; nInt++; cSum += iCount; cSum2 += iCount * iCount;
          done.push({ s: iStart, n: iCount }); if (done.length > 40) done.shift();
          iStart += V.T; iCount = 0;
        }
      }
      function advance(dt) {
        const end = t + dt;
        let guard = 0;
        while (next <= end && guard++ < 20000) {
          closeTo(next);
          iCount++;
          if (lastEv != null) {
            const gp = next - lastEv;
            nGaps++; gapSum += gp;
            const b = Math.floor(gp / gapMax() * GB);
            if (b < GB) gaps[b]++; else gapOver++;
          }
          lastEv = next; events.push(next);
          next += expo();
        }
        closeTo(end);
        t = end;
        const win = 8 * V.T;
        let cut = 0;
        while (cut < events.length && events[cut] < t - win) cut++;
        if (cut) events.splice(0, cut);
      }

      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        c.font = '11px ' + fontOf();
        const lam = V.r * V.T;
        // the tape
        const tL = 16, tR = W - 16, tT = 14, tB = 66, win = 8 * V.T;
        const TX = x => tL + (x - (t - win)) / win * (tR - tL);
        c.fillStyle = C.surface || C.bg2; c.fillRect(tL, tT, tR - tL, tB - tT);
        c.strokeStyle = C.border || C.grid; c.lineWidth = 1; c.strokeRect(tL + 0.5, tT + 0.5, tR - tL, tB - tT);
        for (const d of done) {
          if (d.s + V.T < t - win) continue;
          const x = TX(d.s + V.T);
          c.strokeStyle = C.faint; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x, tT); c.lineTo(x, tB); c.stroke(); c.setLineDash([]);
          const xm = TX(d.s + V.T / 2);
          if (xm > tL + 6) kit.label(c, String(d.n), xm, tB + 11, { align: 'center', size: 11, color: C.muted });
        }
        c.strokeStyle = C.accent; c.lineWidth = 2;
        for (const e of events) { const x = TX(e); if (x >= tL && x <= tR) { c.beginPath(); c.moveTo(x, tT + 8); c.lineTo(x, tB - 8); c.stroke(); } }
        kit.label(c, 'events in the last ' + kit.fmt(win, 3) + ' s (now at the right); numbers = count in each interval', W / 2, tB + 25, { align: 'center', size: 10.5, color: C.faint });
        // two histograms
        const top = tB + 60, B = H - 30, mid = W / 2;
        const panels = [{ L: 40, R: mid - 14 }, { L: mid + 30, R: W - 14 }];
        // counts
        {
          const P = panels[0];
          let kmax = Math.max(4, Math.ceil(lam + 4 * Math.sqrt(lam) + 1));
          for (let k = hist.length - 1; k > kmax; k--) if (hist[k]) { kmax = k; break; }
          kmax = Math.min(kmax, hist.length - 1);
          const X = k => P.L + (k + 0.5) / (kmax + 1) * (P.R - P.L);
          let peak = 0;
          for (let k = 0; k <= kmax; k++) peak = Math.max(peak, poissonPmf(lam, k), nInt ? hist[k] / nInt : 0);
          const Y = v => B - (peak > 0 ? v / (peak * 1.12) : 0) * (B - top);
          const bw = (P.R - P.L) / (kmax + 1) * 0.84;
          c.fillStyle = C.accent; c.globalAlpha = 0.55;
          if (nInt) for (let k = 0; k <= kmax; k++) if (hist[k]) { const y = Y(hist[k] / nInt); c.fillRect(X(k) - bw / 2, y, bw, B - y); }
          c.globalAlpha = 1;
          if (V.theory) for (let k = 0; k <= kmax; k++) kit.dot(c, X(k), Y(poissonPmf(lam, k)), clamp(bw * 0.25, 1.8, 3.6), C.warn, C.bg2);
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(P.L, B); c.lineTo(P.R, B); c.stroke();
          const every = Math.max(1, Math.ceil((kmax + 1) / 12));
          for (let k = 0; k <= kmax; k += every) kit.label(c, String(k), X(k), B + 12, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, 'events per interval (λ = ' + kit.fmt(lam, 3) + ')', (P.L + P.R) / 2, top - 12, { align: 'center', size: 11, color: C.muted });
        }
        // gaps
        {
          const P = panels[1], gm = gapMax(), wb = gm / GB;
          const X = g => P.L + g / gm * (P.R - P.L);
          let peak = V.r;
          if (nGaps) for (let b = 0; b < GB; b++) peak = Math.max(peak, gaps[b] / nGaps / wb);
          const Y = v => B - v / (peak * 1.12) * (B - top);
          c.fillStyle = C.accent; c.globalAlpha = 0.55;
          if (nGaps) for (let b = 0; b < GB; b++) if (gaps[b]) { const y = Y(gaps[b] / nGaps / wb); c.fillRect(X(b * wb) + 1, y, X(wb) - X(0) - 2, B - y); }
          c.globalAlpha = 1;
          if (V.theory) {
            c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
            for (let i = 0; i <= 120; i++) { const g = gm * i / 120; const y = Y(V.r * Math.exp(-V.r * g)); i ? c.lineTo(X(g), y) : c.moveTo(X(g), y); }
            c.stroke();
          }
          c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(P.L, B); c.lineTo(P.R, B); c.stroke();
          xTicks(c, C, kit, 0, gm, X, B, v => kit.fmt(v, 3), 5, C.muted);
          kit.label(c, 'gap between events (s)', (P.L + P.R) / 2, top - 12, { align: 'center', size: 11, color: C.muted });
        }
        // readouts
        ro.set('lam', kit.fmt(lam, 4));
        if (nInt) {
          const m = cSum / nInt;
          ro.set('m', kit.fmt(m, 4));
          ro.set('v', nInt > 1 ? kit.fmt(Math.max(0, (cSum2 - nInt * m * m) / (nInt - 1)), 4) : '—');
        } else { ro.set('m', '—'); ro.set('v', '—'); }
        ro.set('g', nGaps ? kit.fmt(gapSum / nGaps, 3) + ' s (' + kit.fmt(1 / V.r, 3) + ' s)' : '— (' + kit.fmt(1 / V.r, 3) + ' s)');
        ro.set('ni', nInt + ' / ' + (nGaps + (lastEv != null ? 1 : 0)));
      }
      const loop = kit.loop((dt) => {
        if (running && dt > 0) advance(dt * V.speed);
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Bayes: a medical test */
  Hyper.sim('ps-bayes-test', {
    title: 'A positive test: what does it mean?',
    blurb: `Each square is a person. **Red** squares are ill and tested positive, **red outlines** are ill but were missed, **orange** squares are healthy but tested positive (false alarms), and grey squares are healthy and negative. Of all the positives — red and orange — what fraction is red? That fraction is $P(\\text{ill} \\mid +)$, and Bayes' theorem computes it; the bar on the right shows it directly.

- With the defaults (1 % prevalence, 90 % sensitivity, 91 % specificity) most positives are false alarms: $P(\\text{ill} \\mid +) \\approx 9\\,\\%$.
- Raise the specificity to 99.9 % and watch the orange false positives vanish.
- Raise the prevalence (a test given only to people with symptoms): the same test becomes far more convincing.
- Tick **Retest the positives**: yesterday's posterior is today's prior.`,
    mount(box, kit, params) {
      params = params || {};
      const perc = v => pctSmart(v);
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'prev', label: 'Prevalence (prior)', min: 0.001, max: 0.5, value: params.prev || 0.01, log: true, sig: 2, fmt: perc },
        { id: 'sens', label: 'Sensitivity P(+ | ill)', min: 0.5, max: 1, step: 0.005, value: params.sens || 0.9, fmt: perc },
        { id: 'spec', label: 'Specificity P(− | healthy)', min: 0.5, max: 0.999, step: 0.001, value: params.spec || 0.91, fmt: perc },
        { id: 'pop', type: 'select', label: 'Population', options: [['1 000 people', 1000], ['10 000 people', 10000]], value: 1000 },
        { id: 'group', type: 'check', label: 'Group people by test result', value: false },
        { id: 'retest', type: 'check', label: 'Retest the positives', value: false }
      ], () => { dirty = true; loop.once(); });
      const ro = kit.readout(box.side, [['ill', 'Have the condition'], ['pos', 'Test positive'], ['tp', 'Positive and ill'], ['post', 'P(ill | +)'], ['npv', 'P(healthy | −)'], ['post2', 'P(ill | + twice)']]);
      const V = ctl.values;
      // a fixed shuffle so that people keep their places when the sliders move
      const rnd = Hyper.util.rng(20260926);
      const perm = [];
      for (let i = 0; i < 10000; i++) perm.push(i);
      for (let i = perm.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); const tmp = perm[i]; perm[i] = perm[j]; perm[j] = tmp; }
      let dirty = true, lastC = null, lastW = 0;

      function counts() {
        const n = V.pop, D = Math.round(n * V.prev), TP = Math.round(D * V.sens), FN = D - TP;
        const Hh = n - D, FP = Math.round(Hh * (1 - V.spec)), TN = Hh - FP;
        const TP2 = Math.round(TP * V.sens), FP2 = Math.round(FP * (1 - V.spec));
        return { n, D, TP, FN, Hh, FP, TN, TP2, FP2 };
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, k = counts();
        c.font = '11px ' + fontOf();
        const cols = k.n === 1000 ? 40 : 100, rowsN = k.n / cols;
        const gridW = W * 0.68, legendH = 34;
        const cell = Math.max(1, Math.min((gridW - 16) / cols, (H - legendH - 20) / rowsN));
        const gx = 12, gy = 12;
        // category of each seat: 0 TP, 1 FN, 2 FP, 3 TN (and whether positive twice)
        const cat = new Uint8Array(k.n), twice = new Uint8Array(k.n);
        const order = [];
        if (V.group) for (let i = 0; i < k.n; i++) order.push(i);
        else for (let i = 0; i < 10000; i++) if (perm[i] < k.n) order.push(perm[i]);
        let idx = 0;
        const fill = (count, v, n2) => { for (let i = 0; i < count; i++, idx++) { cat[order[idx]] = v; if (i < n2) twice[order[idx]] = 1; } };
        fill(k.TP, 0, k.TP2); fill(k.FP, 2, k.FP2); fill(k.FN, 1, 0); fill(k.TN, 3, 0);
        const gap = cell > 4 ? 1 : 0;
        for (let i = 0; i < k.n; i++) {
          const x = gx + (i % cols) * cell, y = gy + Math.floor(i / cols) * cell, s = cell - gap;
          const v = cat[i];
          if (v === 0) { c.fillStyle = C.bad; c.globalAlpha = V.retest && !twice[i] ? 0.45 : 1; c.fillRect(x, y, s, s); c.globalAlpha = 1; }
          else if (v === 2) { c.fillStyle = C.warn; c.globalAlpha = V.retest && !twice[i] ? 0.35 : 1; c.fillRect(x, y, s, s); c.globalAlpha = 1; }
          else if (v === 1) { c.strokeStyle = C.bad; c.lineWidth = Math.max(1, cell * 0.14); c.strokeRect(x + 0.5, y + 0.5, Math.max(0.5, s - 1), Math.max(0.5, s - 1)); }
          else { c.fillStyle = C.grid; c.fillRect(x, y, s, s); }
          if (V.retest && twice[i] && cell >= 6) kit.dot(c, x + s / 2, y + s / 2, Math.max(1, s * 0.18), C.bg2);
        }
        // legend
        const ly = gy + rowsN * cell + 18;
        const items = [[C.bad, 'ill, test +', 'fill'], [C.bad, 'ill, test −', 'line'], [C.warn, 'healthy, test +', 'fill'], [C.grid, 'healthy, test −', 'fill']];
        let lx = gx;
        for (const [col, text, how] of items) {
          if (how === 'fill') { c.fillStyle = col; c.fillRect(lx, ly - 5, 10, 10); } else { c.strokeStyle = col; c.lineWidth = 2; c.strokeRect(lx + 1, ly - 4, 8, 8); }
          kit.label(c, text, lx + 14, ly, { size: 11, color: C.muted });
          lx += 22 + text.length * 6.2;
        }
        // the positives, as one bar
        const bx = gx + cols * cell + 26, bw = Math.max(30, W - bx - 60), by = gy + 18, bh = Math.max(60, rowsN * cell - 40);
        const pos = k.TP + k.FP;
        kit.label(c, 'All ' + pos + ' positives', bx + bw / 2, gy + 4, { align: 'center', size: 11.5, weight: 600, color: C.text });
        if (pos > 0) {
          const hTP = bh * k.TP / pos;
          c.fillStyle = C.bad; c.fillRect(bx, by + bh - hTP, bw, hTP);
          c.fillStyle = C.warn; c.fillRect(bx, by, bw, bh - hTP);
          if (hTP > 14) kit.label(c, k.TP + ' ill', bx + bw / 2, by + bh - hTP / 2, { align: 'center', size: 11, weight: 600, color: '#fff' });
          if (bh - hTP > 14) kit.label(c, k.FP + ' healthy', bx + bw / 2, by + (bh - hTP) / 2, { align: 'center', size: 11, weight: 600, color: '#222' });
        } else { c.strokeStyle = C.grid; c.strokeRect(bx, by, bw, bh); }
        // exact probabilities
        const p = V.prev, se = V.sens, sp = V.spec;
        const post = p * se / (p * se + (1 - p) * (1 - sp));
        const npv = (1 - p) * sp / ((1 - p) * sp + p * (1 - se));
        const post2 = p * se * se / (p * se * se + (1 - p) * (1 - sp) * (1 - sp));
        kit.label(c, 'P(ill | +) = ' + pctSmart(post), bx + bw / 2, by + bh + 18, { align: 'center', size: 12.5, weight: 700, color: C.accent });
        ro.set('ill', k.D + ' of ' + k.n);
        ro.set('pos', String(pos));
        ro.set('tp', k.TP + (pos ? ' (' + pctSmart(k.TP / pos) + ')' : ''));
        ro.set('post', pctSmart(post));
        ro.set('npv', pctSmart(npv));
        ro.set('post2', V.retest ? pctSmart(post2) : '(tick Retest)');
      }
      const loop = kit.loop(() => {
        const C = kit.colors();
        if (dirty || C !== lastC || st.W !== lastW) { draw(); dirty = false; lastC = C; lastW = st.W; }
      }, box.stage).start();
      st.onResize(() => { dirty = true; loop.once(); });
      loop.once();
    }
  });

  /* ================================================================ Monty Hall */
  Hyper.sim('ps-monty-hall', {
    title: 'The Monty Hall game',
    blurb: `A car hides behind one door, goats behind the others. Click a door. The host, who knows where the car is, opens every other door but one — always showing goats. Then **Stick** with your door or **Switch** to the last closed one.

- Play a dozen games by hand, then press **Auto-play**, which alternates the two strategies, and watch the win rates settle at $1/3$ and $2/3$.
- Why? Switching wins exactly when your first pick was wrong — and it is wrong two times in three.
- Try 10 doors: sticking wins 1 in 10, switching 9 in 10. The host's choice carries information.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'doors', type: 'select', label: 'Doors', options: [['3 doors', 3], ['5 doors', 5], ['10 doors', 10]], value: 3 },
        { id: 'rate', label: 'Auto-play speed', min: 1, max: 500, value: 20, log: true, sig: 2, unit: 'games/s' },
        { type: 'buttons', items: [{ id: 'stick', label: 'Stick' }, { id: 'switch', label: 'Switch' }, { id: 'next', label: 'New game' }] },
        { type: 'buttons', items: [{ id: 'auto', label: 'Auto-play', primary: true }, { id: 'reset', label: 'Reset tallies' }] }
      ], (id) => {
        if (id === 'doors') { resetTally(); newGame(); }
        else if (id === 'stick') decide(false);
        else if (id === 'switch') decide(true);
        else if (id === 'next') newGame();
        else if (id === 'auto') { auto = !auto; if (ctl.rows.auto) ctl.rows.auto.textContent = auto ? 'Stop' : 'Auto-play'; }
        else if (id === 'reset') resetTally();
        loop.once();
      });
      const ro = kit.readout(box.side, [['phase', 'Now'], ['st', 'Stick: won / played'], ['sw', 'Switch: won / played'], ['th', 'Theory: stick / switch']]);
      const V = ctl.values;
      let g, auto = false, acc = 0, games = 0;
      const tally = { stick: { w: 0, n: 0, pts: [] }, switch: { w: 0, n: 0, pts: [] } };
      const nd = () => V.doors;
      function resetTally() { for (const k of ['stick', 'switch']) { tally[k].w = 0; tally[k].n = 0; tally[k].pts = []; } games = 0; }
      function newGame() { g = { car: Math.floor(Math.random() * nd()), pick: null, other: null, open: [], phase: 'pick', final: null, win: null }; }
      function pick(d) {
        if (g.phase !== 'pick') return;
        g.pick = d;
        if (d === g.car) { do { g.other = Math.floor(Math.random() * nd()); } while (g.other === d); }
        else g.other = g.car;
        g.open = [];
        for (let i = 0; i < nd(); i++) if (i !== g.pick && i !== g.other) g.open.push(i);
        g.phase = 'decide';
      }
      function record(sw, win) {
        const t = tally[sw ? 'switch' : 'stick'];
        t.n++; if (win) t.w++;
        t.pts.push([t.n, t.w / t.n]);
        if (t.pts.length > 3000) t.pts = t.pts.filter((q, i) => i % 2 === 0 || i === t.pts.length - 1);
      }
      function decide(sw) {
        if (g.phase !== 'decide') return;
        g.final = sw ? g.other : g.pick;
        g.win = g.final === g.car;
        g.sw = sw;
        g.phase = 'done';
        record(sw, g.win);
      }
      function autoGame() {
        newGame();
        pick(Math.floor(Math.random() * nd()));
        decide(games % 2 === 1);
        games++;
      }
      resetTally(); newGame();

      function doorRects() {
        const n = nd(), W = st.W;
        const gap = n > 5 ? 8 : 18;
        const dw = Math.min(86, (W - 30 - gap * (n - 1)) / n), dh = Math.min(st.H * 0.4, dw * 1.45);
        const x0 = (W - (n * dw + (n - 1) * gap)) / 2;
        const out = [];
        for (let i = 0; i < n; i++) out.push({ x: x0 + i * (dw + gap), y: 30, w: dw, h: dh });
        return out;
      }
      kit.drag(st, {
        hit(p) {
          const r = doorRects();
          for (let i = 0; i < r.length; i++) if (p.x >= r[i].x && p.x <= r[i].x + r[i].w && p.y >= r[i].y && p.y <= r[i].y + r[i].h) return i;
          return null;
        },
        start(i) {
          if (g.phase === 'pick') pick(i);
          else if (g.phase === 'decide') { if (i === g.pick) decide(false); else if (i === g.other) decide(true); }
          else newGame();
          loop.once();
        },
        move() {}
      });

      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, R = doorRects();
        c.font = '11px ' + fontOf();
        const reveal = g.phase === 'done';
        R.forEach((r, i) => {
          const opened = g.open.indexOf(i) >= 0 || reveal;
          c.fillStyle = opened ? (C.bg || C.bg2) : (C.surface2 || C.surface || C.grid);
          c.strokeStyle = C.border2 || C.axis; c.lineWidth = 1.5;
          c.beginPath(); c.roundRect ? c.roundRect(r.x, r.y, r.w, r.h, 6) : c.rect(r.x, r.y, r.w, r.h); c.fill(); c.stroke();
          const cx = r.x + r.w / 2, cy = r.y + r.h / 2, fs = clamp(r.w * 0.2, 9, 15);
          if (opened) kit.label(c, i === g.car ? 'CAR' : 'goat', cx, cy, { align: 'center', size: fs, weight: 700, color: i === g.car ? C.ok : C.faint });
          else {
            kit.label(c, String(i + 1), cx, cy, { align: 'center', size: fs * 1.3, weight: 700, color: C.text2 || C.text });
            kit.dot(c, r.x + r.w * 0.8, cy + 4, Math.max(2, r.w * 0.04), C.muted);
          }
          if (i === g.pick) { c.strokeStyle = C.accent; c.lineWidth = 3; c.strokeRect(r.x - 3, r.y - 3, r.w + 6, r.h + 6); kit.label(c, 'your pick', cx, r.y - 12, { align: 'center', size: 10.5, color: C.accent }); }
          if (reveal && i === g.final) kit.label(c, g.win ? 'WIN' : 'lose', cx, r.y + r.h + 14, { align: 'center', size: 12, weight: 700, color: g.win ? C.ok : C.bad });
          else if (g.phase === 'decide' && i === g.other) kit.label(c, 'switch here?', cx, r.y + r.h + 14, { align: 'center', size: 10.5, color: C.series[2] });
        });
        // running win fractions
        const pL = 44, pR = W - 16, pT = R[0].y + R[0].h + 34, pB = H - 26;
        const nMax = Math.max(10, tally.stick.n, tally.switch.n);
        const X = n => pL + n / nMax * (pR - pL), Y = f => pB - f * (pB - pT);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const f of [0, 0.25, 0.5, 0.75, 1]) { c.beginPath(); c.moveTo(pL, Y(f) + 0.5); c.lineTo(pR, Y(f) + 0.5); c.stroke(); kit.label(c, f.toFixed(2), pL - 5, Y(f), { align: 'right', size: 10, color: C.faint }); }
        const n = nd();
        c.setLineDash([6, 4]); c.lineWidth = 1.2;
        c.strokeStyle = C.series[1]; c.beginPath(); c.moveTo(pL, Y(1 / n)); c.lineTo(pR, Y(1 / n)); c.stroke();
        c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(pL, Y((n - 1) / n)); c.lineTo(pR, Y((n - 1) / n)); c.stroke();
        c.setLineDash([]);
        for (const [key, col] of [['stick', C.series[1]], ['switch', C.series[2]]]) {
          const pts = tally[key].pts;
          if (!pts.length) continue;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          pts.forEach((q, i) => i ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1])));
          c.stroke();
        }
        kit.label(c, 'win rate: stick', pL + 6, pT + 8, { size: 11, color: C.series[1] });
        kit.label(c, 'switch', pL + 100, pT + 8, { size: 11, color: C.series[2] });
        kit.label(c, 'games played with that strategy: ' + nMax, (pL + pR) / 2, pB + 14, { align: 'center', size: 10.5, color: C.faint });
        ro.set('phase', g.phase === 'pick' ? 'Pick a door' : g.phase === 'decide' ? 'Stick or switch?' : (g.win ? 'Won the car' : 'Got a goat') + ' — click for a new game');
        const f = t => t.n ? t.w + ' / ' + t.n + ' (' + pct(t.w / t.n, 1) + ')' : '—';
        ro.set('st', f(tally.stick)); ro.set('sw', f(tally.switch));
        ro.set('th', pct(1 / n, 1) + ' / ' + pct((n - 1) / n, 1));
      }
      const loop = kit.loop((dt) => {
        if (auto && dt > 0) {
          acc += V.rate * dt;
          let k = Math.floor(acc);
          acc -= k;
          while (k-- > 0) autoGame();
        }
        draw();
      }, box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Least squares */
  Hyper.sim('ps-least-squares', {
    title: 'Least-squares line',
    blurb: `Drag the points, or click an empty spot to add one. The line is the **least-squares fit**: of all straight lines it has the smallest sum of squared vertical misses (the red residuals). Tick **Squares** to see those squares literally.

- Tick **Try your own line** and drag its two handles: however hard you try, your sum of squares never beats the fitted line's.
- Choose **One outlier**: a single stray point swings the line and drops $r$.
- Choose **Curved data**: $r$ is near zero although $y$ clearly depends on $x$ — $r$ only measures *straight-line* association.`,
    mount(box, kit) {
      const SETS = [
        ['Spring: extension vs load', { xl: 'load (N)', yl: 'extension (cm)', pts: [[1, 1.4], [2, 2.3], [3, 3.5], [4, 5.0], [5, 5.9], [6, 7.4], [7, 8.3], [8, 9.7]] }],
        ['Noisy trend', { xl: 'x', yl: 'y', pts: [[0.8, 3.1], [1.7, 2.2], [2.5, 4.4], [3.1, 3.2], [4.2, 5.6], [5.0, 4.1], [5.9, 6.9], [6.6, 5.3], [7.4, 7.9], [8.3, 6.6], [9.1, 8.8]] }],
        ['One outlier', { xl: 'load (N)', yl: 'extension (cm)', pts: [[1, 1.4], [2, 2.3], [3, 3.5], [4, 5.0], [5, 5.9], [6, 7.4], [7, 8.3], [8.5, 1.5]] }],
        ['No correlation', { xl: 'x', yl: 'y', pts: [[1.2, 6.1], [2.3, 2.8], [3.1, 8.2], [4.4, 4.9], [5.2, 1.9], [6.1, 7.3], [7.3, 3.6], [8.2, 6.4], [8.9, 2.6], [2.0, 5.2], [6.8, 5.6]] }],
        ['Curved data', { xl: 'x', yl: 'y', pts: [[1, 7.4], [2, 4.9], [3, 2.9], [4, 1.6], [5, 1.1], [6, 1.5], [7, 2.8], [8, 5.1], [9, 7.2]] }]
      ];
      const st = kit.stage(box.stage, { aspect: 0.62 });
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Data', options: SETS, value: SETS[0][1] },
        { id: 'res', type: 'check', label: 'Residuals', value: true },
        { id: 'sq', type: 'check', label: 'Squares of the residuals', value: false },
        { id: 'mine', type: 'check', label: 'Try your own line', value: false },
        { type: 'buttons', items: [{ id: 'add', label: 'Add a point' }, { id: 'del', label: 'Remove last' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'set' || id === 'reset') load();
        else if (id === 'add' && pts.length < 40) { const f = fit(); const x = 0.5 + Math.random() * 9; pts.push([x, clamp((f ? f.a + f.b * x : 5) + randn() * 1.2, 0, 10)]); }
        else if (id === 'del' && pts.length) pts.pop();
        else if (id === 'mine') placeMine();
        loop.once();
      });
      const ro = kit.readout(box.side, [['b', 'Slope b'], ['a', 'Intercept a'], ['r', 'Correlation r'], ['R2', 'R²'], ['sse', 'Sum of squared residuals'], ['my', 'Your line: sum of squares']]);
      const V = ctl.values;
      let pts = [], mine = [[2, 3], [8, 7]];
      function load() { pts = V.set.pts.map(q => q.slice()); placeMine(); }
      function placeMine() { const f = fit(); if (f) mine = [[2, clamp(f.a + f.b * 2 + 1.2, 0, 10)], [8, clamp(f.a + f.b * 8 - 1.0, 0, 10)]]; }
      function fit() {
        const n = pts.length;
        if (n < 2) return null;
        let mx = 0, my = 0;
        for (const q of pts) { mx += q[0]; my += q[1]; }
        mx /= n; my /= n;
        let sxx = 0, sxy = 0, syy = 0;
        for (const q of pts) { sxx += (q[0] - mx) * (q[0] - mx); sxy += (q[0] - mx) * (q[1] - my); syy += (q[1] - my) * (q[1] - my); }
        if (sxx < 1e-12) return null;
        const b = sxy / sxx, a = my - b * mx;
        let sse = 0;
        for (const q of pts) sse += (q[1] - a - b * q[0]) * (q[1] - a - b * q[0]);
        return { a, b, r: syy > 1e-12 ? sxy / Math.sqrt(sxx * syy) : null, R2: syy > 1e-12 ? 1 - sse / syy : null, sse, mx, my };
      }
      load();
      const geo = () => ({ L: 46, R: st.W - 16, T: 14, B: st.H - 36 });
      const X = (g, x) => g.L + x / 10 * (g.R - g.L), Y = (g, y) => g.B - y / 10 * (g.B - g.T);
      const xv = (g, px) => (px - g.L) / (g.R - g.L) * 10, yv = (g, py) => (g.B - py) / (g.B - g.T) * 10;
      kit.drag(st, {
        hover: true,
        hit(p) {
          const g = geo();
          if (V.mine) for (let i = 0; i < 2; i++) if (Math.hypot(p.x - X(g, mine[i][0]), p.y - Y(g, mine[i][1])) < 13) return { h: i };
          let best = null, bd = 13;
          pts.forEach((q, i) => { const d = Math.hypot(p.x - X(g, q[0]), p.y - Y(g, q[1])); if (d < bd) { bd = d; best = i; } });
          if (best != null) return { p: best };
          if (p.x > g.L && p.x < g.R && p.y > g.T && p.y < g.B && pts.length < 40) { pts.push([xv(g, p.x), yv(g, p.y)]); loop.once(); return { p: pts.length - 1 }; }
          return null;
        },
        move(o, p) {
          const g = geo(), x = clamp(xv(g, p.x), 0, 10), y = clamp(yv(g, p.y), 0, 10);
          if (o.h != null) mine[o.h] = [x, y];
          else if (pts[o.p]) pts[o.p] = [x, y];
          loop.once();
        }
      });
      function draw() {
        const c = st.begin(), C = kit.colors(), g = geo(), f = fit();
        c.font = '11px ' + fontOf();
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let v = 0; v <= 10; v += 2) {
          c.beginPath(); c.moveTo(X(g, v) + 0.5, g.T); c.lineTo(X(g, v) + 0.5, g.B); c.stroke();
          c.beginPath(); c.moveTo(g.L, Y(g, v) + 0.5); c.lineTo(g.R, Y(g, v) + 0.5); c.stroke();
          kit.label(c, String(v), X(g, v), g.B + 12, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, String(v), g.L - 6, Y(g, v), { align: 'right', size: 10.5, color: C.muted });
        }
        kit.label(c, V.set.xl, (g.L + g.R) / 2, g.B + 26, { align: 'center', size: 11, color: C.faint });
        kit.label(c, V.set.yl, g.L + 6, g.T + 8, { size: 11, color: C.faint });
        const line = (a, b, col, w, dash) => {
          // clip the line y = a + b x to the 0..10 box
          let x1 = 0, x2 = 10;
          if (Math.abs(b) > 1e-9) { const xa = (0 - a) / b, xb = (10 - a) / b; x1 = Math.max(0, Math.min(xa, xb)); x2 = Math.min(10, Math.max(xa, xb)); }
          if (x2 <= x1) return;
          c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []);
          c.beginPath(); c.moveTo(X(g, x1), Y(g, a + b * x1)); c.lineTo(X(g, x2), Y(g, a + b * x2)); c.stroke(); c.setLineDash([]);
        };
        if (f) {
          if (V.sq) for (const q of pts) {
            const yl = f.a + f.b * q[0], s = Math.abs(Y(g, q[1]) - Y(g, yl));
            const left = X(g, q[0]) + s > g.R;
            c.fillStyle = C.bad; c.globalAlpha = 0.14;
            c.fillRect(left ? X(g, q[0]) - s : X(g, q[0]), Math.min(Y(g, q[1]), Y(g, yl)), s, s);
            c.globalAlpha = 1;
          }
          if (V.res || V.sq) for (const q of pts) {
            const yl = f.a + f.b * q[0];
            c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(g, q[0]), Y(g, q[1])); c.lineTo(X(g, q[0]), Y(g, yl)); c.stroke();
          }
          line(f.a, f.b, C.accent, 2.4);
          kit.dot(c, X(g, f.mx), Y(g, f.my), 4, C.bg2, C.accent);
        }
        let mySse = null;
        if (V.mine) {
          const dxm = mine[1][0] - mine[0][0];
          if (Math.abs(dxm) > 1e-6) {
            const b = (mine[1][1] - mine[0][1]) / dxm, a = mine[0][1] - b * mine[0][0];
            line(a, b, C.series[1], 2, [7, 5]);
            mySse = 0;
            for (const q of pts) mySse += (q[1] - a - b * q[0]) * (q[1] - a - b * q[0]);
          }
          for (const h of mine) kit.dot(c, X(g, h[0]), Y(g, h[1]), 7, C.series[1], C.bg2);
        }
        for (const q of pts) kit.dot(c, X(g, q[0]), Y(g, q[1]), 5, C.text, C.bg2);
        if (f) {
          ro.set('b', kit.fmt(f.b, 3)); ro.set('a', kit.fmt(f.a, 3));
          ro.set('r', f.r == null ? '—' : f.r.toFixed(3)); ro.set('R2', f.R2 == null ? '—' : f.R2.toFixed(3));
          ro.set('sse', kit.fmt(f.sse, 4));
        } else for (const k of ['b', 'a', 'r', 'R2', 'sse']) ro.set(k, '—');
        ro.set('my', mySse == null ? (V.mine ? '—' : '(tick Try your own line)') : kit.fmt(mySse, 4));
      }
      const loop = kit.loop(() => draw(), box.stage).start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Spread made visible */
  Hyper.sim('ps-spread', {
    title: 'Mean, median and standard deviation',
    blurb: `Drag the dots along the line. Each coloured square is built on a **deviation** from the mean, so its area is that deviation squared. The variance is the average square (dividing by $n - 1$), and the **standard deviation** $s$ is the side of that average square — drawn dashed.

- Drag one dot far to the right: its square dominates, the mean follows it, the median hardly moves.
- Make all the dots nearly equal: every square shrinks and $s \\to 0$.
- Compare $s$ (divide by $n-1$) with $\\sigma$ (divide by $n$): the difference matters only for small samples.`,
    mount(box, kit) {
      const SETS = [
        ['Five readings: 4, 7, 8, 9, 12', [4, 7, 8, 9, 12]],
        ['The same with an outlier', [4, 7, 8, 9, 12, 19]],
        ['A tight cluster', [7.5, 7.8, 8, 8.1, 8.4, 8.2]],
        ['Two clusters', [3, 3.5, 4, 12, 12.5, 13]]
      ];
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Data', options: SETS, value: SETS[0][1] },
        { id: 'sq', type: 'check', label: 'Deviations and their squares', value: true },
        { id: 'band', type: 'check', label: 'Mean ± 1 SD band', value: true },
        { id: 'med', type: 'check', label: 'Median', value: true },
        { type: 'buttons', items: [{ id: 'add', label: 'Add a value' }, { id: 'del', label: 'Remove one' }, { id: 'out', label: 'Add an outlier' }] }
      ], (id) => {
        if (id === 'set') xs = V.set.slice();
        else if (id === 'add' && xs.length < 30) { const m = stats().m; xs.push(clamp(Math.round((m + randn() * 2.5) * 10) / 10, 0.2, 19.8)); }
        else if (id === 'del' && xs.length > 1) xs.pop();
        else if (id === 'out' && xs.length < 30) xs.push(Math.random() < 0.5 ? 19.5 : 0.5);
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Number of values n'], ['m', 'Mean'], ['med', 'Median'], ['ss', 'Sum of squared deviations'], ['s', 'SD s (÷ (n − 1))'], ['sg', 'σ (÷ n)'], ['rng', 'Range']]);
      const V = ctl.values;
      let xs = V.set.slice();
      const XMAX = 20;
      function stats() {
        const n = xs.length;
        if (!n) return { n: 0, m: 10, med: 10, ss: 0, s: 0, sg: 0 };
        const m = xs.reduce((a, b) => a + b, 0) / n;
        const srt = xs.slice().sort((a, b) => a - b);
        const med = n % 2 ? srt[(n - 1) / 2] : (srt[n / 2 - 1] + srt[n / 2]) / 2;
        const ss = xs.reduce((a, x) => a + (x - m) * (x - m), 0);
        return { n, m, med, ss, s: n > 1 ? Math.sqrt(ss / (n - 1)) : 0, sg: Math.sqrt(ss / n), lo: srt[0], hi: srt[n - 1] };
      }
      const geo = () => ({ L: 24, R: st.W - 24, base: st.H - 50 });
      const X = (g, x) => g.L + x / XMAX * (g.R - g.L);
      const unit = g => (g.R - g.L) / XMAX;
      // dots sit on the number line; dots that would overlap are stacked upwards
      function dotY(g) {
        const order = xs.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
        const y = new Array(xs.length).fill(0);
        let prevX = -1e9, lvl = 0;
        for (const [x, i] of order) { lvl = (X(g, x) - prevX < 11) ? lvl + 1 : 0; prevX = X(g, x); y[i] = g.base - lvl * 11; }
        return y;
      }
      kit.drag(st, {
        hover: true,
        hit(p) {
          const g = geo(), ys = dotY(g);
          let best = null, bd = 13;
          xs.forEach((x, i) => { const d = Math.hypot(p.x - X(g, x), p.y - ys[i]); if (d < bd) { bd = d; best = i; } });
          return best;
        },
        move(i, p) {
          const g = geo();
          xs[i] = Math.round(clamp((p.x - g.L) / (g.R - g.L) * XMAX, 0, XMAX) * 10) / 10;
          loop.once();
        }
      });
      function draw() {
        const c = st.begin(), C = kit.colors(), g = geo(), S = stats(), u = unit(g);
        c.font = '11px ' + fontOf();
        // ±1 SD band
        if (V.band && S.n > 1) {
          c.fillStyle = C.accent; c.globalAlpha = 0.1;
          c.fillRect(X(g, S.m - S.s), 8, 2 * S.s * u, g.base - 8);
          c.globalAlpha = 1;
          const y = g.base + 34;
          c.strokeStyle = C.accent; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(X(g, S.m - S.s), y - 5); c.lineTo(X(g, S.m - S.s), y + 5); c.moveTo(X(g, S.m - S.s), y); c.lineTo(X(g, S.m + S.s), y); c.moveTo(X(g, S.m + S.s), y - 5); c.lineTo(X(g, S.m + S.s), y + 5); c.stroke();
          kit.label(c, 'mean ± s', X(g, S.m + S.s) + 6, y, { size: 10.5, color: C.accent });
        }
        // squares of the deviations
        if (V.sq && S.n) {
          xs.forEach((x, i) => {
            const d = x - S.m, side = Math.abs(d) * u;
            if (side < 0.5) return;
            const col = C.series[(i % 6) + 1];
            const x0 = Math.min(X(g, S.m), X(g, x));
            c.fillStyle = col; c.globalAlpha = 0.13; c.fillRect(x0, g.base - side, side, side);
            c.globalAlpha = 0.7; c.strokeStyle = col; c.lineWidth = 1; c.strokeRect(x0 + 0.5, g.base - side + 0.5, side, side);
            c.globalAlpha = 1;
          });
          if (S.n > 1 && S.s > 0) {
            const side = S.s * u;
            c.strokeStyle = C.text; c.lineWidth = 1.6; c.setLineDash([6, 4]);
            c.strokeRect(X(g, S.m) - side, g.base - side, side, side); c.setLineDash([]);
            kit.label(c, 'side s', X(g, S.m) - side / 2, g.base - side - 9, { align: 'center', size: 10.5, color: C.text });
          }
        }
        // the number line
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(g.L, g.base); c.lineTo(g.R, g.base); c.stroke();
        for (let v = 0; v <= XMAX; v += 2) {
          c.beginPath(); c.moveTo(X(g, v), g.base); c.lineTo(X(g, v), g.base + 4); c.stroke();
          kit.label(c, String(v), X(g, v), g.base + 14, { align: 'center', size: 10, color: C.faint });
        }
        // mean and median
        if (S.n) {
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(X(g, S.m), 8); c.lineTo(X(g, S.m), g.base + 24); c.stroke();
          kit.label(c, 'mean ' + kit.fmt(S.m, 3), X(g, S.m) + 5, 14, { size: 11, weight: 600, color: C.accent });
          if (V.med) {
            c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(g, S.med), 26); c.lineTo(X(g, S.med), g.base + 24); c.stroke(); c.setLineDash([]);
            kit.label(c, 'median ' + kit.fmt(S.med, 3), X(g, S.med) + 5, 32, { size: 11, weight: 600, color: C.warn });
          }
        }
        // dots
        const ys = dotY(g);
        xs.forEach((x, i) => kit.dot(c, X(g, x), ys[i], 5.5, V.sq ? C.series[(i % 6) + 1] : C.text, C.bg2));
        // readouts
        ro.set('n', String(S.n));
        ro.set('m', S.n ? kit.fmt(S.m, 4) : '—'); ro.set('med', S.n ? kit.fmt(S.med, 4) : '—');
        ro.set('ss', kit.fmt(S.ss, 4));
        ro.set('s', S.n > 1 ? kit.fmt(S.s, 4) : '—'); ro.set('sg', S.n ? kit.fmt(S.sg, 4) : '—');
        ro.set('rng', S.n ? kit.fmt(S.hi - S.lo, 4) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage).start();
      st.onResize(() => loop.once());
    }
  });
})();
