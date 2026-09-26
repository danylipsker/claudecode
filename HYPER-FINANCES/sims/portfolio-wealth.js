/* HYPER-FINANCES · sims/portfolio-wealth.js — simulations for Portfolio and Risk and for
 * Wealth and Retirement: two assets and a correlation, random portfolios with the efficient
 * frontier and the capital allocation line, beta as a regression slope, drawdowns, sequence
 * risk, the saving rate against the years to independence, the 4 % rule in 1 000 simulated
 * markets, an annuity against drawdown, and tax drag. Every market here is simulated
 * (seeded, via kit.fin.normals) and labelled as such. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fin = v => Number.isFinite(v);

  /* ---------------------------------------------------------------- chart helpers */
  function ticks(lo, hi, n) {
    const step = Hyper.niceStep(hi - lo, n || 5);
    const out = [];
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return out;
  }
  function logTicks(lo, hi) {
    const out = [];
    for (let e = Math.floor(Math.log10(lo)); e <= Math.ceil(Math.log10(hi)); e++) {
      for (const m of [1, 2, 5]) { const v = m * Math.pow(10, e); if (v >= lo * 0.999 && v <= hi * 1.001) out.push(v); }
    }
    return out;
  }
  // a chart frame in rectangle r = {x, y, w, h}: grid, tick labels, axes and titles.
  // o = {x0, x1, y0, y1, ylog, xfmt, yfmt, xlabel, ylabel, nx, ny}. Returns the maps X(v), Y(v).
  function frame(kit, c, C, r, o) {
    const sx = (o.x1 - o.x0) || 1;
    const sy = o.ylog ? (Math.log(o.y1 / o.y0) || 1) : ((o.y1 - o.y0) || 1);
    const X = v => r.x + (v - o.x0) / sx * r.w;
    const Y = o.ylog ? v => r.y + r.h - Math.log(Math.max(v, o.y0 * 1e-3) / o.y0) / sy * r.h
                     : v => r.y + r.h - (v - o.y0) / sy * r.h;
    c.save();
    c.font = FONT; c.lineWidth = 1;
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (const v of (o.ylog ? logTicks(o.y0, o.y1) : ticks(o.y0, o.y1, o.ny || 5))) {
      const y = Math.round(Y(v)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(r.x, y); c.lineTo(r.x + r.w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(o.yfmt ? o.yfmt(v) : kit.fmt(v, 3), r.x - 6, y);
    }
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (const v of ticks(o.x0, o.x1, o.nx || 6)) {
      const x = Math.round(X(v)) + 0.5;
      c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, r.y); c.lineTo(x, r.y + r.h); c.stroke();
      if (!o.noXText) { c.fillStyle = C.muted; c.fillText(o.xfmt ? o.xfmt(v) : kit.fmt(v, 3), x, r.y + r.h + 4); }
    }
    const zy = !o.ylog && o.y0 < 0 && o.y1 > 0 ? Y(0) : r.y + r.h;
    const zx = o.x0 < 0 && o.x1 > 0 ? X(0) : r.x;
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(r.x, zy); c.lineTo(r.x + r.w, zy); c.moveTo(zx, r.y); c.lineTo(zx, r.y + r.h); c.stroke();
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, r.x + r.w, r.y + r.h + (o.noXText ? 8 : 24), { size: 11.5, color: C.muted, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, r.x, r.y - 12, { size: 11.5, color: C.muted });
    return { X, Y };
  }
  function clipTo(c, r) { c.save(); c.beginPath(); c.rect(r.x, r.y - 1, r.w, r.h + 2); c.clip(); }
  function polyline(c, pts, X, Y, color, width, dash) {
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    let pen = false;
    for (const p of pts) {
      if (!fin(p[0]) || !fin(p[1])) { pen = false; continue; }
      const x = X(p[0]), y = Y(p[1]);
      if (pen) c.lineTo(x, y); else c.moveTo(x, y);
      pen = true;
    }
    c.stroke();
    c.restore();
  }
  // a filled band between two series lo[] and hi[] of [x, y]
  function band(c, lo, hi, X, Y, color, alpha) {
    if (!lo.length) return;
    c.save();
    c.globalAlpha = alpha; c.fillStyle = color;
    c.beginPath();
    lo.forEach((p, k) => { if (k) c.lineTo(X(p[0]), Y(p[1])); else c.moveTo(X(p[0]), Y(p[1])); });
    for (let k = hi.length - 1; k >= 0; k--) c.lineTo(X(hi[k][0]), Y(hi[k][1]));
    c.closePath(); c.fill();
    c.restore();
  }
  function legend(kit, c, C, items, x, y) {
    let xx = x;
    c.save(); c.font = '11.5px system-ui, sans-serif';
    for (const it of items) {
      c.strokeStyle = it[0]; c.lineWidth = 3; c.setLineDash(it[2] || []);
      c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke();
      c.setLineDash([]);
      const w = c.measureText(it[1]).width;
      kit.label(c, it[1], xx + 21, y, { size: 11.5, color: C.text2 });
      xx += 34 + w;
    }
    c.restore();
  }
  const money = (kit, v) => kit.money(v, 0);
  const pctf = (kit, f, d) => fin(f) ? kit.pct(f, d == null ? 1 : d) : '—';
  const yrs = v => fin(v) ? (v < 10 ? v.toFixed(1) : String(Math.round(v))) : '—';

  /* ================================================================ two assets */
  Hyper.sim('pw-two-assets', {
    title: 'Two assets and their correlation',
    blurb: `Every mix of two assets, from all of one to all of the other, placed by its **risk** (across) and **expected return** (up). The thick curve is for the correlation you choose; the faint dashed lines are the extremes: +1 (a straight line) and −1 (a V that touches zero risk). The solid part holds the efficient mixes; the dashed part is beaten by a mix with the same risk and more return.

- Slide the **correlation** from +1 towards −1 and watch the curve bow to the left: the same returns, less risk.
- With the shares-and-bonds defaults, find the least risky mix (green): a little in shares makes the portfolio *safer* than bonds alone.
- Move the **weight** and compare the mix's risk with the average of the two risks — the gap is what diversification removes.`,
    mount(box, kit, params) {
      const P = params || {};
      const twins = P.preset === 'twins';
      const nA = twins ? 'A' : 'shares', nB = twins ? 'B' : 'bonds';
      const NA = twins ? 'Asset A' : 'Shares', NB = twins ? 'Asset B' : 'Bonds';
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'rho', label: 'Correlation ρ', min: -1, max: 1, step: 0.05, value: P.rho != null ? P.rho : (twins ? 0 : 0.2) },
        { id: 'w', label: 'Weight in ' + nA, min: 0, max: 100, step: 1, value: P.w != null ? P.w : (twins ? 50 : 60), unit: '%' },
        { id: 'mu1', label: NA + ': expected return', min: 0, max: 15, step: 0.5, value: twins ? 8 : 8, unit: '%' },
        { id: 's1', label: NA + ': volatility', min: 1, max: 40, step: 0.5, value: twins ? 20 : 18, unit: '%' },
        { id: 'mu2', label: NB + ': expected return', min: 0, max: 15, step: 0.5, value: twins ? 6 : 4, unit: '%' },
        { id: 's2', label: NB + ': volatility', min: 1, max: 40, step: 0.5, value: twins ? 20 : 6, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['mix', 'The mix'], ['avg', 'Average of the two risks'], ['cut', 'Risk removed by mixing'], ['mv', 'Least risky mix'], ['sh', 'Sharpe ratio (cash at 2 %)']]);
      const V = ctl.values;

      function leastRisky(o) {
        const den = o.s1 * o.s1 + o.s2 * o.s2 - 2 * o.rho * o.s1 * o.s2;
        if (den < 1e-12) return o.s1 <= o.s2 ? 1 : 0;
        return clamp((o.s2 * o.s2 - o.rho * o.s1 * o.s2) / den, 0, 1);
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const o = { mu1: V.mu1 / 100, s1: V.s1 / 100, mu2: V.mu2 / 100, s2: V.s2 / 100, rho: V.rho };
        const r = { x: 56, y: 34, w: st.W - 76, h: st.H - 84 };
        const xmax = Math.max(V.s1, V.s2) * 1.15;
        const ylo = Math.min(0, Math.min(V.mu1, V.mu2) - 1), yhi = Math.max(V.mu1, V.mu2) * 1.15 + 1;
        const f = frame(kit, c, C, r, { x0: 0, x1: xmax, y0: ylo, y1: yhi, xfmt: v => v + ' %', yfmt: v => v + ' %', xlabel: 'risk: volatility a year', ylabel: 'expected return a year' });
        const N = 200;
        const curve = rho => { const pts = []; for (let k = 0; k <= N; k++) { const m = kit.fin.mix2({ w: k / N, mu1: o.mu1, mu2: o.mu2, s1: o.s1, s2: o.s2, rho }); pts.push([m.sd * 100, m.mu * 100]); } return pts; };
        clipTo(c, r);
        polyline(c, curve(1), f.X, f.Y, C.faint, 1.3, [4, 4]);
        polyline(c, curve(-1), f.X, f.Y, C.faint, 1.3, [4, 4]);
        const wm = leastRisky(o);
        const pts = curve(o.rho);
        const flat = Math.abs(o.mu1 - o.mu2) < 1e-9;
        const upA = o.mu1 >= o.mu2;
        const eff = [], ineff = [];
        pts.forEach((p, k) => {
          const w = k / N;
          if (flat || (upA ? w >= wm - 1e-9 : w <= wm + 1e-9)) eff.push(p);
          if (!flat && (upA ? w <= wm + 1e-9 : w >= wm - 1e-9)) ineff.push(p);
        });
        polyline(c, ineff, f.X, f.Y, C.accent, 2, [6, 5]);
        polyline(c, eff, f.X, f.Y, C.accent, 3.2);
        c.restore();
        // the two assets, the least risky mix, the chosen mix
        const lab = (t, x, y, col) => kit.label(c, t, x, y, { size: 12, color: col || C.text, weight: 600 });
        kit.dot(c, f.X(V.s1), f.Y(V.mu1), 6, C.series[1], C.bg2); lab(NA, f.X(V.s1) - 8, f.Y(V.mu1) - 14);
        kit.dot(c, f.X(V.s2), f.Y(V.mu2), 6, C.series[2], C.bg2); lab(NB, f.X(V.s2) + 9, f.Y(V.mu2) + 14);
        const mm = kit.fin.mix2({ w: wm, mu1: o.mu1, mu2: o.mu2, s1: o.s1, s2: o.s2, rho: o.rho });
        kit.dot(c, f.X(mm.sd * 100), f.Y(mm.mu * 100), 5, C.ok, C.bg2);
        const w = V.w / 100;
        const m = kit.fin.mix2({ w, mu1: o.mu1, mu2: o.mu2, s1: o.s1, s2: o.s2, rho: o.rho });
        const avg = w * o.s1 + (1 - w) * o.s2;
        // the gap between the average risk and the actual risk of the mix
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(f.X(avg * 100), f.Y(m.mu * 100)); c.lineTo(f.X(m.sd * 100), f.Y(m.mu * 100)); c.stroke(); c.restore();
        kit.dot(c, f.X(avg * 100), f.Y(m.mu * 100), 3.5, C.warn);
        kit.dot(c, f.X(m.sd * 100), f.Y(m.mu * 100), 7.5, C.accent, C.bg2);
        lab(Math.round(V.w) + ' % ' + nA, f.X(m.sd * 100) + 11, f.Y(m.mu * 100) - 12, C.accent);
        kit.label(c, 'ρ = ' + V.rho.toFixed(2), r.x + 10, r.y + 10, { size: 12.5, color: C.text, weight: 600 });
        ro.set('mix', pctf(kit, m.mu) + ' expected, ' + pctf(kit, m.sd) + ' volatility');
        ro.set('avg', pctf(kit, avg));
        ro.set('cut', avg > 0 ? pctf(kit, 1 - m.sd / avg, 0) + ' of it' : '—');
        ro.set('mv', Math.round(wm * 100) + ' % ' + nA + ': ' + pctf(kit, mm.mu) + ' at ' + pctf(kit, mm.sd));
        ro.set('sh', m.sd > 1e-9 ? kit.fin.sharpe(m.mu, m.sd, 0.02).toFixed(2) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ random portfolios, frontier, CAL */
  const ASSETS = [
    { name: 'Bonds', mu: 0.04, s: 0.06 },
    { name: 'Home shares', mu: 0.08, s: 0.18 },
    { name: 'Foreign shares', mu: 0.075, s: 0.16 },
    { name: 'Property funds', mu: 0.065, s: 0.15 }
  ];
  function corrMatrix(rsb, rss) {
    return [[1, rsb, rsb, 0.3], [rsb, 1, rss, 0.55], [rsb, rss, 1, 0.55], [0.3, 0.55, 0.55, 1]];
  }
  // Gaussian elimination with partial pivoting; null if singular
  function solveLinear(A, b) {
    const n = b.length, M = A.map((row, i) => row.concat([b[i]]));
    for (let col = 0; col < n; col++) {
      let piv = col;
      for (let i = col + 1; i < n; i++) if (Math.abs(M[i][col]) > Math.abs(M[piv][col])) piv = i;
      if (Math.abs(M[piv][col]) < 1e-14) return null;
      const t = M[col]; M[col] = M[piv]; M[piv] = t;
      for (let i = 0; i < n; i++) {
        if (i === col) continue;
        const f = M[i][col] / M[col][col];
        for (let j = col; j <= n; j++) M[i][j] -= f * M[col][j];
      }
    }
    return M.map((row, i) => row[n] / row[i]);
  }
  // the long-only minimum-variance frontier: for each target return, the best of every subset
  // of assets solved with the two constraints (sum of weights 1, expected return = target)
  function frontier(mu, cov) {
    const n = mu.length, lo = Math.min(...mu), hi = Math.max(...mu), K = 120, out = [];
    const variance = w => { let v = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) v += w[i] * w[j] * cov[i][j]; return v; };
    for (let k = 0; k <= K; k++) {
      const m = lo + (hi - lo) * k / K;
      let best = null;
      for (let mask = 1; mask < (1 << n); mask++) {
        const idx = [];
        for (let i = 0; i < n; i++) if (mask & (1 << i)) idx.push(i);
        let w = null;
        if (idx.length === 1) {
          if (Math.abs(mu[idx[0]] - m) < 1e-9) { w = new Array(n).fill(0); w[idx[0]] = 1; }
        } else {
          const q = idx.length, A = [], b = [];
          for (let a = 0; a < q; a++) {
            const row = [];
            for (let bb = 0; bb < q; bb++) row.push(2 * cov[idx[a]][idx[bb]]);
            row.push(mu[idx[a]], 1); A.push(row); b.push(0);
          }
          A.push(idx.map(i => mu[i]).concat([0, 0])); b.push(m);
          A.push(idx.map(() => 1).concat([0, 0])); b.push(1);
          const x = solveLinear(A, b);
          if (x && idx.every((i, a) => x[a] > -1e-9)) { w = new Array(n).fill(0); idx.forEach((i, a) => { w[i] = Math.max(0, x[a]); }); }
        }
        if (!w) continue;
        const v = variance(w);
        if (!best || v < best.v) best = { w, v };
      }
      if (best) out.push({ mu: m, sd: Math.sqrt(Math.max(0, best.v)), w: best.w });
    }
    return out;
  }

  Hyper.sim('pw-frontier-cloud', {
    title: 'Random portfolios, the efficient frontier and the best Sharpe ratio',
    blurb: `Each faint dot is a random mix of four asset classes (illustrative assumptions, not forecasts), coloured by its Sharpe ratio. The thick curve is the **efficient frontier** — the best expected return for each level of risk, with no borrowing or short selling. The star is the mix with the **highest Sharpe ratio**, and the straight line from cash through it is the **capital allocation line**.

- No random dot lies above the frontier: the optimiser finds what luck cannot beat.
- Raise the **correlation between share markets**: the frontier moves right, as diversifying between them helps less.
- Turn on the line and slide **Amount in the best mix**: below 100 % you hold cash, above it you borrow. Compare the line with the frontier at the same risk.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'rss', label: 'Correlation between share markets', min: 0.3, max: 0.95, step: 0.05, value: 0.7 },
        { id: 'rsb', label: 'Correlation of shares with bonds', min: -0.3, max: 0.6, step: 0.05, value: 0.2 },
        { id: 'rf', label: 'Cash rate', min: 0, max: 5, step: 0.25, value: 2, unit: '%' },
        { id: 'cal', type: 'check', label: 'Show the capital allocation line', value: !!P.cal },
        { id: 'k', label: 'Amount in the best mix', min: 0, max: 200, step: 5, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New random portfolios', primary: true }] }
      ], id => { if (id === 'new') seed++; if (id !== 'k' && id !== 'cal') solve(); ctl.show('k', V.cal); loop.once(); });
      const ro = kit.readout(box.side, [['best', 'Best Sharpe mix'], ['br', 'Its return and risk'], ['bs', 'Its Sharpe ratio'], ['one', 'Best single asset'], ['line', 'On the line'], ['front', 'Frontier at that risk']]);
      const V = ctl.values;
      let seed = 3, cloud = [], front = [], tan = null, mv = null, key = '';
      ctl.show('k', V.cal);

      function solve() {
        const rho = corrMatrix(V.rsb, V.rss);
        const mu = ASSETS.map(a => a.mu);
        const cov = rho.map((row, i) => row.map((x, j) => x * ASSETS[i].s * ASSETS[j].s));
        const k2 = V.rsb + '|' + V.rss;
        if (k2 !== key) { front = frontier(mu, cov); key = k2; }
        const rnd = Hyper.util.rng(seed * 7919 + 13);
        cloud = [];
        for (let t = 0; t < 1500; t++) {
          let w = ASSETS.map(() => (rnd() < 0.25 ? 0 : -Math.log(1 - rnd() * 0.999999)));
          let sum = w.reduce((a, b) => a + b, 0);
          if (sum <= 0) { w = ASSETS.map(() => 1); sum = w.length; }
          w = w.map(x => x / sum);
          let m = 0, v = 0;
          for (let i = 0; i < w.length; i++) { m += w[i] * mu[i]; for (let j = 0; j < w.length; j++) v += w[i] * w[j] * cov[i][j]; }
          cloud.push({ mu: m, sd: Math.sqrt(Math.max(0, v)) });
        }
        mv = front.reduce((a, p) => (!a || p.sd < a.sd ? p : a), null);
      }
      function tangency(rf) {
        let best = null;
        for (const p of front) {
          if (p.sd < 1e-9 || p.mu < (mv ? mv.mu : 0) - 1e-12) continue;
          const s = (p.mu - rf) / p.sd;
          if (!best || s > best.s) best = { p, s };
        }
        return best;
      }
      function frontierAt(sd) {  // expected return on the efficient frontier at a given risk
        const eff = front.filter(p => mv && p.mu >= mv.mu - 1e-12);
        if (!eff.length || sd < eff[0].sd) return null;
        for (let i = 1; i < eff.length; i++) {
          const a = eff[i - 1], b = eff[i];
          if (sd >= a.sd && sd <= b.sd) return a.mu + (b.mu - a.mu) * (b.sd > a.sd ? (sd - a.sd) / (b.sd - a.sd) : 0);
        }
        return null;
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const rf = V.rf / 100;
        tan = tangency(rf);
        const r = { x: 56, y: 34, w: st.W - 76, h: st.H - 84 };
        const xmax = Math.max(...ASSETS.map(a => a.s)) * 100 * 1.15;
        const k = V.k / 100;
        let ymax = Math.max(...ASSETS.map(a => a.mu)) * 100 * 1.3;
        if (V.cal && tan) ymax = Math.max(ymax, (rf + k * (tan.p.mu - rf)) * 100 + 1);
        const f = frame(kit, c, C, r, { x0: 0, x1: xmax, y0: 0, y1: ymax, xfmt: v => v + ' %', yfmt: v => v + ' %', xlabel: 'risk: volatility a year', ylabel: 'expected return a year' });
        clipTo(c, r);
        // the cloud, coloured by Sharpe ratio
        const sh = cloud.map(p => (p.mu - rf) / Math.max(p.sd, 1e-9));
        const smin = Math.min(...sh), smax = Math.max(...sh), span = smax - smin || 1;
        cloud.forEach((p, i) => {
          c.globalAlpha = 0.55;
          kit.dot(c, f.X(p.sd * 100), f.Y(p.mu * 100), 2.1, kit.hue(20 + 180 * (sh[i] - smin) / span));
        });
        c.globalAlpha = 1;
        // the frontier: efficient part solid, the lower branch dashed
        const upper = front.filter(p => mv && p.mu >= mv.mu - 1e-12).map(p => [p.sd * 100, p.mu * 100]);
        const lower = front.filter(p => mv && p.mu <= mv.mu + 1e-12).map(p => [p.sd * 100, p.mu * 100]);
        polyline(c, lower, f.X, f.Y, C.text, 1.6, [5, 4]);
        polyline(c, upper, f.X, f.Y, C.text, 3);
        // the capital allocation line
        if (V.cal && tan) {
          const x2 = xmax, y2 = (rf + tan.s * x2 / 100) * 100;
          polyline(c, [[0, rf * 100], [x2, y2]], f.X, f.Y, C.warn, 2.2);
        }
        c.restore();
        kit.dot(c, f.X(0), f.Y(rf * 100), 5, C.warn, C.bg2);
        kit.label(c, 'cash', f.X(0) + 8, f.Y(rf * 100) + 12, { size: 11.5, color: C.text2 });
        ASSETS.forEach((a, i) => {
          kit.dot(c, f.X(a.s * 100), f.Y(a.mu * 100), 5.5, C.series[(i + 1) % C.series.length], C.bg2);
          kit.label(c, a.name, f.X(a.s * 100) + 8, f.Y(a.mu * 100) + (i % 2 ? 12 : -12), { size: 11.5, color: C.text2 });
        });
        if (tan) {
          const tx = f.X(tan.p.sd * 100), ty = f.Y(tan.p.mu * 100);
          c.save(); c.fillStyle = C.warn; c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.beginPath();
          for (let q = 0; q < 10; q++) { const a = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 4 : 9.5; const px = tx + rr * Math.cos(a), py = ty + rr * Math.sin(a); if (q) c.lineTo(px, py); else c.moveTo(px, py); }
          c.closePath(); c.fill(); c.stroke(); c.restore();
          kit.label(c, 'best Sharpe', tx - 12, ty - 16, { size: 12, color: C.text, weight: 600, align: 'right' });
        }
        if (V.cal && tan) {
          const lsd = k * tan.p.sd, lmu = rf + k * (tan.p.mu - rf);
          kit.dot(c, f.X(lsd * 100), f.Y(lmu * 100), 7, C.accent, C.bg2);
        }
        kit.label(c, 'illustrative assumptions · 1 500 random mixes', r.x + r.w, r.y - 12, { size: 11, color: C.muted, align: 'right' });
        // read-outs
        if (tan) {
          ro.set('best', ASSETS.map((a, i) => (a.name.split(' ')[0]) + ' ' + Math.round(tan.p.w[i] * 100) + ' %').join(', '));
          ro.set('br', pctf(kit, tan.p.mu) + ' expected, ' + pctf(kit, tan.p.sd) + ' volatility');
          ro.set('bs', tan.s.toFixed(2));
        } else { ro.set('best', '—'); ro.set('br', '—'); ro.set('bs', '—'); }
        const singles = ASSETS.map(a => ({ a, s: (a.mu - rf) / a.s })).sort((x, y) => y.s - x.s);
        ro.set('one', singles[0].a.name + ', ' + singles[0].s.toFixed(2));
        if (V.cal && tan) {
          const lsd = k * tan.p.sd, lmu = rf + k * (tan.p.mu - rf);
          ro.set('line', pctf(kit, lmu) + ' at ' + pctf(kit, lsd) + (k > 1 ? ' (borrowing ' + Math.round((k - 1) * 100) + ' % more)' : k < 1 ? ' (' + Math.round((1 - k) * 100) + ' % in cash)' : ''));
          const fr = frontierAt(lsd);
          ro.set('front', fr == null ? 'none at that risk' : pctf(kit, fr));
        } else { ro.set('line', 'turn on the line'); ro.set('front', '—'); }
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ beta */
  Hyper.sim('pw-beta', {
    title: 'Beta: a share against the market (simulated)',
    blurb: `Each dot is one month: the market's return across, a share's return up — both simulated from the numbers you set. The orange line is the least-squares fit; its slope is the **estimated beta**. The dashed line is the true beta used to make the data.

- With 60 months and a lot of company-specific risk, press **New sample** a few times: the estimated beta jumps around the true one by ±0.2 or more.
- Set the specific volatility to 0: every dot lands on the line, and R² — the share of the risk that comes from the market — is 100 %.
- Give the share a **true alpha** of a few per cent a year and see how hard it is to detect in five years of data.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'beta', label: 'True beta', min: -0.5, max: 2.5, step: 0.05, value: 1.2 },
        { id: 'spec', label: 'Company-specific volatility (a year)', min: 0, max: 50, step: 1, value: 25, unit: '%' },
        { id: 'alpha', label: 'True alpha (a year)', min: -10, max: 10, step: 0.5, value: 0, unit: '%' },
        { id: 'n', label: 'Months of data', min: 12, max: 240, step: 1, value: 60 },
        { type: 'buttons', items: [{ id: 'new', label: 'New sample', primary: true }] }
      ], id => { if (id === 'new') { seed++; stream(); } loop.once(); });
      const ro = kit.readout(box.side, [['b', 'Estimated beta'], ['a', 'Estimated alpha (a year)'], ['r2', 'R²: share of risk from the market'], ['vol', 'Share / market volatility (a year)'], ['split', 'Market risk + specific risk']]);
      const V = ctl.values;
      const SM = 0.18 / Math.sqrt(12), MM = 0.006;   // the simulated market: 18 % a year, 0.6 % a month
      let seed = 1, zm = [], ze = [];
      function stream() {
        const g = kit.fin.normals(seed * 104729 + 7);
        zm = []; ze = [];
        for (let k = 0; k < 240; k++) { zm.push(g()); ze.push(g()); }
      }
      stream();
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const n = Math.round(V.n), se = V.spec / 100 / Math.sqrt(12), al = V.alpha / 100 / 12;
        const xs = [], ys = [];
        for (let k = 0; k < n; k++) { const m = MM + SM * zm[k]; xs.push(m); ys.push(al + V.beta * m + se * ze[k]); }
        const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        let sxx = 0, sxy = 0, syy = 0;
        for (let k = 0; k < n; k++) { sxx += (xs[k] - mx) * (xs[k] - mx); sxy += (xs[k] - mx) * (ys[k] - my); syy += (ys[k] - my) * (ys[k] - my); }
        const b = sxx > 0 ? sxy / sxx : 0, a = my - b * mx;
        let ssr = 0;
        for (let k = 0; k < n; k++) { const e = ys[k] - a - b * xs[k]; ssr += e * e; }
        const s2 = n > 2 ? ssr / (n - 2) : 0, seb = sxx > 0 ? Math.sqrt(s2 / sxx) : 0;
        const r2 = syy > 0 ? clamp(1 - ssr / syy, 0, 1) : 1;
        const lx = Math.max(0.05, ...xs.map(Math.abs)) * 110, ly = Math.max(0.05, ...ys.map(Math.abs)) * 110;
        const r = { x: 56, y: 34, w: st.W - 76, h: st.H - 84 };
        const f = frame(kit, c, C, r, { x0: -lx, x1: lx, y0: -ly, y1: ly, xfmt: v => v + ' %', yfmt: v => v + ' %', xlabel: 'market return in the month', ylabel: 'share return in the month' });
        clipTo(c, r);
        c.globalAlpha = 0.7;
        for (let k = 0; k < n; k++) kit.dot(c, f.X(xs[k] * 100), f.Y(ys[k] * 100), 3.2, C.accent);
        c.globalAlpha = 1;
        polyline(c, [[-lx, (al + V.beta * -lx / 100) * 100], [lx, (al + V.beta * lx / 100) * 100]], f.X, f.Y, C.muted, 1.5, [6, 5]);
        polyline(c, [[-lx, (a + b * -lx / 100) * 100], [lx, (a + b * lx / 100) * 100]], f.X, f.Y, C.warn, 2.8);
        c.restore();
        kit.label(c, 'slope = β ≈ ' + b.toFixed(2), r.x + 10, r.y + 10, { size: 12.5, color: C.warn, weight: 600 });
        kit.label(c, 'simulated: ' + n + ' months', r.x + r.w, r.y - 12, { size: 11, color: C.muted, align: 'right' });
        const volS = Math.sqrt(syy / Math.max(1, n - 1)) * Math.sqrt(12), volM = Math.sqrt(sxx / Math.max(1, n - 1)) * Math.sqrt(12);
        ro.set('b', b.toFixed(2) + ' ± ' + seb.toFixed(2) + '  (true ' + V.beta.toFixed(2) + ')');
        ro.set('a', pctf(kit, a * 12) + '  (true ' + pctf(kit, V.alpha / 100) + ')');
        ro.set('r2', pctf(kit, r2, 0));
        ro.set('vol', pctf(kit, volS, 0) + ' / ' + pctf(kit, volM, 0));
        ro.set('split', pctf(kit, Math.abs(b) * volM, 0) + ' + ' + pctf(kit, Math.sqrt(s2 * 12), 0));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ drawdowns */
  Hyper.sim('pw-drawdown', {
    title: 'A simulated market: growth, drawdowns and recovery',
    blurb: `A single simulated market, month by month, starting from ¤10,000 (top, on a logarithmic scale so that equal percentage moves look equal). The dashed line is the highest value so far; the shaded stretch is the deepest fall and its recovery. Below, the **underwater chart**: how far the value is below its last peak.

- Press **New market** several times with the same settings: the deepest fall ranges widely from one history to the next.
- Compare the **average yearly return** with the **compound return**: the gap is roughly half the variance. Raise the volatility and watch the gap grow.
- Set the volatility to 0: a smooth line, never under water.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'mu', label: 'Average yearly return', min: 0, max: 15, step: 0.5, value: P.mu != null ? P.mu : 8, unit: '%' },
        { id: 'sd', label: 'Volatility', min: 0, max: 40, step: 1, value: P.sd != null ? P.sd : 18, unit: '%' },
        { id: 'T', label: 'Years', min: 5, max: 60, step: 1, value: 30 },
        { type: 'buttons', items: [{ id: 'new', label: 'New market', primary: true }] }
      ], id => { if (id === 'new') { seed++; stream(); } loop.once(); });
      const ro = kit.readout(box.side, [['avg', 'Average yearly return'], ['cagr', 'Compound return (CAGR)'], ['dd', 'Deepest fall'], ['need', 'Gain needed to recover it'], ['under', 'Longest time below a peak'], ['loss', 'Losing years']]);
      const V = ctl.values;
      let seed = 1, z = [];
      function stream() { const g = kit.fin.normals(seed * 7907 + 3); z = []; for (let k = 0; k < 720; k++) z.push(g()); }
      stream();
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const T = Math.round(V.T), N = 12 * T, m = V.mu / 100 / 12, s = V.sd / 100 / Math.sqrt(12);
        const val = [10000], peak = [10000], dd = [0];
        for (let k = 1; k <= N; k++) {
          const ret = Math.max(-0.95, m + s * z[k - 1]);
          val.push(val[k - 1] * (1 + ret));
          peak.push(Math.max(peak[k - 1], val[k]));
          dd.push(1 - val[k] / peak[k]);
        }
        // deepest fall: its peak, trough and recovery
        let maxDD = 0, trough = 0;
        for (let k = 0; k <= N; k++) if (dd[k] > maxDD) { maxDD = dd[k]; trough = k; }
        let pk = trough;
        while (pk > 0 && val[pk] < peak[trough]) pk--;
        let rec = -1;
        for (let k = trough; k <= N; k++) if (val[k] >= peak[trough] && k > trough) { rec = k; break; }
        // longest spell under water
        let longest = 0, start = -1;
        for (let k = 1; k <= N; k++) {
          if (dd[k] > 1e-12) { if (start < 0) start = k - 1; }
          else if (start >= 0) { longest = Math.max(longest, k - start); start = -1; }
        }
        const ongoing = start >= 0;
        if (ongoing) longest = Math.max(longest, N - start);
        // calendar years
        const yr = [];
        for (let y = 1; y <= T; y++) yr.push(val[12 * y] / val[12 * (y - 1)] - 1);
        const avg = yr.reduce((a, b) => a + b, 0) / T;
        const cagr = Math.pow(val[N] / val[0], 1 / T) - 1;
        const losing = yr.filter(x => x < 0).length;
        // top: value on a log scale
        const top = { x: 64, y: 30, w: st.W - 84, h: (st.H - 90) * 0.62 };
        const bot = { x: 64, y: top.y + top.h + 26, w: st.W - 84, h: (st.H - 90) * 0.38 - 4 };
        const vmin = Math.min(...val) * 0.9, vmax = Math.max(...peak) * 1.1;
        const ft = frame(kit, c, C, top, { x0: 0, x1: T, y0: vmin, y1: vmax, ylog: true, yfmt: v => kit.money(v, 0, true), noXText: true, ylabel: 'value (simulated market, log scale)' });
        clipTo(c, top);
        if (maxDD > 1e-9) {
          const x1 = rec > 0 ? rec : N;
          c.save(); c.globalAlpha = 0.14; c.fillStyle = C.bad;
          c.fillRect(ft.X(pk / 12), top.y, ft.X(x1 / 12) - ft.X(pk / 12), top.h); c.restore();
        }
        polyline(c, peak.map((v, k) => [k / 12, v]), ft.X, ft.Y, C.faint, 1.3, [5, 4]);
        polyline(c, val.map((v, k) => [k / 12, v]), ft.X, ft.Y, C.accent, 2);
        c.restore();
        // bottom: underwater
        const lo = -Math.max(0.05, maxDD * 1.1) * 100;
        const fb = frame(kit, c, C, bot, { x0: 0, x1: T, y0: lo, y1: 0, yfmt: v => Math.round(v) + ' %', xlabel: 'years', ny: 3 });
        clipTo(c, bot);
        const under = dd.map((d, k) => [k / 12, -d * 100]);
        band(c, under, under.map(p => [p[0], 0]), fb.X, fb.Y, C.bad, 0.3);
        polyline(c, under, fb.X, fb.Y, C.bad, 1.4);
        c.restore();
        kit.label(c, 'below the last peak', bot.x + 6, bot.y + bot.h - 10, { size: 11, color: C.muted });
        ro.set('avg', pctf(kit, avg));
        ro.set('cagr', pctf(kit, cagr) + ' (' + money(kit, val[0]) + ' → ' + money(kit, val[N]) + ')');
        ro.set('dd', maxDD > 0 ? pctf(kit, maxDD, 0) : 'none');
        ro.set('need', maxDD > 0 && maxDD < 1 ? '+' + pctf(kit, maxDD / (1 - maxDD), 0) + (rec > 0 ? ', regained after ' + yrs((rec - trough) / 12) + ' years' : ', not regained yet') : '—');
        ro.set('under', longest > 0 ? yrs(longest / 12) + ' years' + (ongoing && longest === N - start ? ' (still under)' : '') : 'never');
        ro.set('loss', losing + ' of ' + T);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ sequence of returns */
  Hyper.sim('pw-sequence', {
    title: 'The same returns in two orders',
    blurb: `Thirty simulated yearly returns, used twice: in one order and in another. The strips at the bottom show the returns year by year (green up, red down). Money is added or taken at the start of each year.

- Choose **Neither** as the money flow: both lines end at exactly the same value — without flows, order does not matter.
- Choose **Withdraw each year**: with bad years first the pot can run dry, although the average and the compound return are identical.
- Choose **Save each year**: now bad years *first* are the better order, because the savings buy cheaply while the pot is small.
- Set the volatility to 0 and the two orders become the same.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'Compare', options: [['Bad years first, good years first', 'sort'], ['As drawn, and reversed', 'rev']], value: 'sort' },
        { id: 'flow', type: 'select', label: 'Money flow', options: [['Withdraw each year', 'out'], ['Save each year', 'in'], ['Neither', 'none']], value: 'out' },
        { id: 'amt', label: 'Yearly amount', min: 0, max: 100000, step: 1000, value: 50000, fmt: v => kit.money(v, 0) },
        { id: 'mu', label: 'Average return', min: 0, max: 12, step: 0.5, value: 6, unit: '%' },
        { id: 'sd', label: 'Volatility', min: 0, max: 30, step: 1, value: 15, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New returns', primary: true }] }
      ], id => { if (id === 'new') { seed++; stream(); } loop.once(); });
      const ro = kit.readout(box.side, [['avg', 'Average return (both orders)'], ['cagr', 'Compound return (both orders)'], ['e1', 'First order ends with'], ['e2', 'Second order ends with'], ['out', 'Money runs out']]);
      const V = ctl.values;
      const Y = 30;
      let seed = 9, z = [];
      function stream() { const g = kit.fin.normals(seed * 6007 + 11); z = []; for (let k = 0; k < Y; k++) z.push(g()); }
      stream();
      function run(rets, start) {
        let b = start, out = -1;
        const path = [[0, b]];
        rets.forEach((r, k) => {
          if (V.flow === 'out') { if (b > 0 && b <= V.amt && out < 0) out = k + 1; b = Math.max(0, b - V.amt); }
          else if (V.flow === 'in') b += V.amt;
          b *= 1 + r;
          path.push([k + 1, b]);
        });
        return { path, end: b, out };
      }
      function strip(c, C, rets, x, y, w, h, label) {
        const cw = w / rets.length;
        rets.forEach((r, k) => {
          const a = clamp(Math.abs(r) / 0.3, 0.15, 1);
          c.save(); c.globalAlpha = a; c.fillStyle = r >= 0 ? C.ok : C.bad; c.fillRect(x + k * cw + 0.5, y, cw - 1, h); c.restore();
        });
        kit.label(c, label, x - 6, y + h / 2, { size: 11, color: C.muted, align: 'right' });
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const rets = z.map(x => Math.max(-0.9, V.mu / 100 + V.sd / 100 * x));
        let o1, o2, n1, n2;
        if (V.order === 'sort') { o1 = rets.slice().sort((a, b) => a - b); o2 = rets.slice().sort((a, b) => b - a); n1 = 'bad first'; n2 = 'good first'; }
        else { o1 = rets.slice(); o2 = rets.slice().reverse(); n1 = 'as drawn'; n2 = 'reversed'; }
        const start = V.flow === 'in' ? 0 : 1000000;
        const A = run(o1, start), B = run(o2, start);
        const r = { x: 72, y: 34, w: st.W - 92, h: st.H - 130 };
        const ymax = Math.max(1, ...A.path.map(p => p[1]), ...B.path.map(p => p[1])) * 1.08;
        const f = frame(kit, c, C, r, { x0: 0, x1: Y, y0: 0, y1: ymax, yfmt: v => kit.money(v, 0, true), xlabel: 'year', ylabel: 'pot (simulated returns)' });
        clipTo(c, r);
        polyline(c, A.path, f.X, f.Y, C.warn, 2.6);
        polyline(c, B.path, f.X, f.Y, C.ok, 2.6, [7, 4]);
        c.restore();
        legend(kit, c, C, [[C.warn, n1], [C.ok, n2, [7, 4]]], r.x + 10, r.y + 10);
        const sy = r.y + r.h + 36, cw = r.w / Y;
        strip(c, C, o1, r.x + cw * 0, sy, r.w, 12, n1);
        strip(c, C, o2, r.x, sy + 18, r.w, 12, n2);
        const avg = rets.reduce((a, b) => a + b, 0) / Y;
        const cagr = Math.pow(rets.reduce((a, b) => a * (1 + b), 1), 1 / Y) - 1;
        ro.set('avg', pctf(kit, avg));
        ro.set('cagr', pctf(kit, cagr));
        ro.set('e1', money(kit, A.end) + ' (' + n1 + ')');
        ro.set('e2', money(kit, B.end) + ' (' + n2 + ')');
        ro.set('out', V.flow !== 'out' ? '—' : (A.out > 0 ? n1 + ': year ' + A.out : n1 + ': never') + '; ' + (B.out > 0 ? n2 + ': year ' + B.out : n2 + ': never'));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ saving rate and independence */
  // years to reach (1 − s)/w times take-home pay, saving s of it a year at real return r,
  // starting with k years of spending already invested (all in today's money)
  function yearsToFI(s, r, w, k) {
    const target = (1 - s) / w, have = k * (1 - s);
    if (have >= target) return 0;
    if (s <= 0) return Infinity;
    if (r < 1e-9) return (target - have) / s;
    return Math.log((target + s / r) / (have + s / r)) / Math.log(1 + r);
  }
  Hyper.sim('pw-fi-curve', {
    title: 'Saving rate and the years to financial independence',
    blurb: `How many years of saving it takes until investments can pay your spending, as a function of the **saving rate** — the share of take-home pay you invest. Everything is in today's money: the return is the return above inflation, and the goal is your yearly spending divided by the withdrawal rate. Income itself cancels out.

- Move from 10 % to 20 % to 30 %: each step saves many years, because saving more both builds the pot faster *and* lowers the spending it must replace.
- Lower the **return** by two points (the dashed curve shows it): the curve shifts up most at low saving rates.
- Add **what you already have**: a head start shortens the wait at every saving rate.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Your saving rate', min: 5, max: 90, step: 1, value: P.s || 25, unit: '%' },
        { id: 'r', label: 'Return above inflation', min: 0, max: 10, step: 0.25, value: 5, unit: '%' },
        { id: 'w', label: 'Withdrawal rate', min: 2.5, max: 6, step: 0.1, value: 4, unit: '%' },
        { id: 'k', label: 'Already invested (years of spending)', min: 0, max: 20, step: 0.5, value: 0 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['n', 'Years to independence'], ['goal', 'Goal'], ['more', 'Saving 5 points more'], ['low', 'Returns 2 points lower'], ['grow', 'Share of the goal from growth']]);
      const V = ctl.values;
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const r = { x: 56, y: 34, w: st.W - 76, h: st.H - 84 };
        const R = V.r / 100, W = V.w / 100, K = V.k, R2 = Math.max(0, R - 0.02);
        const f = frame(kit, c, C, r, { x0: 0, x1: 90, y0: 0, y1: 70, xfmt: v => v + ' %', yfmt: v => String(v), xlabel: 'saving rate: share of take-home pay invested', ylabel: 'years until investments cover spending' });
        const pts = [], pts2 = [];
        for (let s = 3; s <= 90; s += 0.5) { pts.push([s, yearsToFI(s / 100, R, W, K)]); pts2.push([s, yearsToFI(s / 100, R2, W, K)]); }
        clipTo(c, r);
        polyline(c, pts2.map(p => [p[0], Math.min(p[1], 200)]), f.X, f.Y, C.muted, 1.6, [6, 4]);
        polyline(c, pts.map(p => [p[0], Math.min(p[1], 200)]), f.X, f.Y, C.accent, 3);
        c.restore();
        const s = V.s / 100, n = yearsToFI(s, R, W, K);
        if (fin(n) && n <= 70) {
          kit.dot(c, f.X(V.s), f.Y(n), 7, C.warn, C.bg2);
          kit.label(c, yrs(n) + ' years', f.X(V.s) + 10, f.Y(n) - 12, { size: 12.5, color: C.text, weight: 600 });
        }
        const pr = v => 'return ' + (+(v * 100).toFixed(2)) + ' %';
        legend(kit, c, C, [[C.accent, pr(R)], [C.muted, pr(R2), [6, 4]]], r.x + r.w - 250, r.y + 8);
        ro.set('n', fin(n) ? (n === 0 ? 'already there' : yrs(n) + ' years') : 'never at this saving rate');
        ro.set('goal', (1 / W).toFixed(1) + ' × yearly spending');
        const nm = yearsToFI(Math.min(0.95, s + 0.05), R, W, K);
        ro.set('more', fin(nm) ? yrs(nm) + ' years' : '—');
        const nl = yearsToFI(s, R2, W, K);
        ro.set('low', fin(nl) ? yrs(nl) + ' years' : 'never');
        const target = (1 - s) / W, paid = s * n + K * (1 - s);
        ro.set('grow', fin(n) && n > 0 && target > 0 ? pctf(kit, clamp(1 - paid / target, 0, 1), 0) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the 4 % rule, Monte Carlo */
  Hyper.sim('pw-four-percent', {
    title: 'The 4 % rule in 1 000 simulated markets',
    blurb: `A retirement starts with ¤1,000,000 and spends a fixed amount each year, in today's money, while the rest stays invested. Each of 1 000 simulated markets draws its yearly returns at random (normal, with the average and volatility you set). Left: the **fan** of outcomes — the middle band holds half the markets, the wide band 80 %. Right: the share of markets in which the money lasts, for every withdrawal rate.

- With the defaults a 4 % withdrawal lasts in most but not all markets. Find the rate at which nine markets in ten succeed.
- Raise the **volatility** with the same average: success falls, although the average return has not changed — that is sequence risk.
- Stretch the **years** to 50 for an early retirement and watch the curve slide to the left.
- The simple model has independent years and thin tails; real markets are lumpier. Treat the numbers as a guide.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'wr', label: 'Withdrawal rate', min: 2, max: 8, step: 0.1, value: P.wr || 4, unit: '%' },
        { id: 'mu', label: 'Average return above inflation', min: 0, max: 8, step: 0.25, value: 5, unit: '%' },
        { id: 'sd', label: 'Volatility', min: 0, max: 25, step: 0.5, value: 12, unit: '%' },
        { id: 'T', label: 'Years the money must last', min: 10, max: 60, step: 1, value: P.years || 30 },
        { type: 'buttons', items: [{ id: 'new', label: 'New markets', primary: true }] }
      ], id => { if (id === 'new') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['spend', 'Spending each year'], ['ok', 'Markets where it lasts'], ['med', 'Typical pot at the end'], ['p10', 'Unlucky 10 %: pot at the end'], ['flat', 'With the average every year']]);
      const V = ctl.values;
      const POT = 1000000;
      let seed = 1, curveKey = '', curve = [];
      function mc(wr) {
        return kit.fin.monteCarlo({ initial: POT, withdrawal: POT * wr, years: Math.round(V.T), mean: V.mu / 100, sd: V.sd / 100, runs: 1000, seed, percentiles: [10, 25, 50, 75, 90] });
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const T = Math.round(V.T), wr = V.wr / 100;
        const res = mc(wr);
        const key = [V.mu, V.sd, T, seed].join('|');
        if (key !== curveKey) {
          curve = [];
          for (let w = 2; w <= 8.0001; w += 0.25) curve.push([w, mc(w / 100).success * 100]);
          curveKey = key;
        }
        const gap = 44, lw = (st.W - 70 - gap) * 0.62;
        const L = { x: 64, y: 34, w: lw, h: st.H - 84 };
        const Rr = { x: L.x + L.w + gap + 10, y: 34, w: st.W - (L.x + L.w + gap + 10) - 14, h: st.H - 84 };
        const hi = Math.max(POT * 1.3, ...res.years.map(y => y.p[75])) * 1.05;
        const f = frame(kit, c, C, L, { x0: 0, x1: T, y0: 0, y1: hi, yfmt: v => kit.money(v, 0, true), xlabel: 'years into retirement', ylabel: 'pot in today\'s money (simulated)' });
        const q = k => res.years.map(y => [y.year, Math.min(y.p[k], hi * 1.5)]);
        clipTo(c, L);
        band(c, q(10), q(90), f.X, f.Y, C.accent, 0.13);
        band(c, q(25), q(75), f.X, f.Y, C.accent, 0.25);
        polyline(c, [[0, POT], [T, POT]], f.X, f.Y, C.faint, 1.2, [5, 4]);
        polyline(c, q(50), f.X, f.Y, C.accent, 2.6);
        polyline(c, q(10), f.X, f.Y, C.bad, 1.5, [4, 3]);
        c.restore();
        legend(kit, c, C, [[C.accent, 'median'], [C.bad, 'unlucky 10 %', [4, 3]]], L.x + 10, L.y + 10);
        // success against withdrawal rate
        const g = frame(kit, c, C, Rr, { x0: 2, x1: 8, y0: 0, y1: 100, xfmt: v => v + ' %', yfmt: v => v + ' %', xlabel: 'withdrawal rate', ylabel: 'markets where it lasts', nx: 3 });
        clipTo(c, Rr);
        polyline(c, [[2, 90], [8, 90]], g.X, g.Y, C.faint, 1, [4, 4]);
        polyline(c, curve, g.X, g.Y, C.ok, 2.6);
        c.restore();
        kit.dot(c, g.X(V.wr), g.Y(res.success * 100), 6, C.warn, C.bg2);
        // read-outs
        const end = res.years[res.years.length - 1];
        let b = POT, lasted = T;
        for (let y = 1; y <= T; y++) { b = b * (1 + V.mu / 100) - POT * wr; if (b <= 0) { lasted = y; break; } }
        ro.set('spend', money(kit, POT * wr) + ' (' + kit.pct(wr, 1) + ' of the start)');
        ro.set('ok', pctf(kit, res.success, 0) + ' of 1 000');
        ro.set('med', money(kit, end.p[50]));
        ro.set('p10', end.p[10] > 0 ? money(kit, end.p[10]) : 'ran out');
        ro.set('flat', b > 0 ? 'lasts, ending with ' + money(kit, b) : 'runs out in year ' + lasted);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ annuity against drawdown */
  Hyper.sim('pw-annuity-drawdown', {
    title: 'An annuity against drawing down',
    blurb: `At 65 a pot can buy a lifetime income (an inflation-linked **annuity**, paid for life at the payout rate you set) or stay invested while you **draw down** a fixed income from it. Top: the yearly income from each. Bottom: what is left in the drawdown pot — which goes to heirs. Everything is in today's money; the return is above inflation.

- Drag **Age at death** from 75 to 100: drawdown wins if life is short (money is left over); the annuity wins if it is long (it keeps paying).
- With the drawdown income equal to the annuity's (the default), find the age at which the pot runs dry; then lower the drawdown income until it lasts to 100.
- Tick **A bad first year**: one −25 % year at the start makes the pot run out years earlier, although every later year is the same.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'pot', label: 'Pot at 65', min: 100000, max: 2000000, value: 500000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'a', label: 'Annuity payout rate', min: 3, max: 9, step: 0.1, value: 5.5, unit: '%' },
        { id: 'wd', label: 'Drawdown income, share of the pot', min: 2, max: 10, step: 0.1, value: 5.5, unit: '%' },
        { id: 'r', label: 'Return above inflation (drawdown)', min: -1, max: 7, step: 0.25, value: 3, unit: '%' },
        { id: 'death', label: 'Age at death', min: 66, max: 105, step: 1, value: 90 },
        { id: 'bad', type: 'check', label: 'A bad first year (−25 %)', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ai', 'Annuity income'], ['di', 'Drawdown income'], ['dry', 'Drawdown money lasts until'], ['ra', 'Received by death: annuity'], ['rd', 'Received by death: drawdown'], ['left', 'Left to heirs at death']]);
      const V = ctl.values;
      const A0 = 65, A1 = 105;
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const ann = V.pot * V.a / 100, W = V.pot * V.wd / 100, death = Math.round(V.death);
        // drawdown: income taken at the end of each year of age
        let b = V.pot, dryAge = null, recvD = 0, recvA = 0, left = 0;
        const pot = [[A0, b]], incD = [], incA = [];
        for (let age = A0 + 1; age <= A1; age++) {
          const ret = age === A0 + 1 && V.bad ? -0.25 : V.r / 100;
          b = b * (1 + ret);
          const take = Math.min(W, Math.max(0, b));
          b -= take;
          if (b <= 1e-6 && dryAge == null) dryAge = age - 1 + (W > 0 ? take / W : 1);
          b = Math.max(0, b);
          pot.push([age, b]);
          incD.push([age, take]); incA.push([age, ann]);
          if (age <= death) { recvD += take; recvA += ann; }
          if (age === death) left = b;
        }
        const top = { x: 70, y: 30, w: st.W - 90, h: (st.H - 96) * 0.42 };
        const bot = { x: 70, y: top.y + top.h + 34, w: st.W - 90, h: (st.H - 96) * 0.58 - 6 };
        const imax = Math.max(ann, W, 1) * 1.35;
        const ft = frame(kit, c, C, top, { x0: A0, x1: A1, y0: 0, y1: imax, yfmt: v => kit.money(v, 0, true), noXText: true, ylabel: 'income each year', ny: 3 });
        clipTo(c, top);
        const step = pts => { const out = []; pts.forEach(p => { out.push([p[0] - 1, p[1]], [p[0], p[1]]); }); return out; };
        polyline(c, step(incA), ft.X, ft.Y, C.ok, 2.6);
        polyline(c, step(incD), ft.X, ft.Y, C.accent, 2.6, [7, 4]);
        polyline(c, [[death, 0], [death, imax]], ft.X, ft.Y, C.text2, 1.4, [3, 3]);
        c.restore();
        legend(kit, c, C, [[C.ok, 'annuity'], [C.accent, 'drawdown', [7, 4]]], top.x + 10, top.y + 10);
        const pmax = Math.max(V.pot, ...pot.map(p => p[1])) * 1.1;
        const fb = frame(kit, c, C, bot, { x0: A0, x1: A1, y0: 0, y1: pmax, yfmt: v => kit.money(v, 0, true), xlabel: 'age', ylabel: 'left in the drawdown pot' });
        clipTo(c, bot);
        band(c, pot, pot.map(p => [p[0], 0]), fb.X, fb.Y, C.accent, 0.2);
        polyline(c, pot, fb.X, fb.Y, C.accent, 2.2);
        polyline(c, [[death, 0], [death, pmax]], fb.X, fb.Y, C.text2, 1.4, [3, 3]);
        c.restore();
        kit.label(c, 'death at ' + death, fb.X(death) + (death > 95 ? -6 : 6), bot.y + 12, { size: 11.5, color: C.text2, align: death > 95 ? 'right' : 'left' });
        if (dryAge != null && dryAge <= A1) kit.dot(c, fb.X(dryAge), fb.Y(0), 5, C.bad, C.bg2);
        ro.set('ai', money(kit, ann) + ' a year for life');
        ro.set('di', money(kit, W) + ' a year while it lasts');
        ro.set('dry', dryAge == null ? 'beyond ' + A1 : 'age ' + Math.floor(dryAge));
        ro.set('ra', money(kit, recvA));
        ro.set('rd', money(kit, recvD));
        ro.set('left', 'drawdown ' + money(kit, left) + '; annuity ' + money(kit, 0));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ tax drag */
  Hyper.sim('pw-tax-drag', {
    title: 'Where the tax goes: four ways to invest the same earnings',
    blurb: `¤10,000 of earnings, before income tax, invested at the same return in four ways. Each line shows what you would have after all taxes if you cashed out in that year.

- **Taxed every year**: income tax now, then tax on the return each year (like interest in an ordinary account).
- **Taxed once at the end**: income tax now, and the gain taxed only when you sell (deferral).
- **Tax-free growth**: income tax now, nothing after (relief on the way out).
- **Relief in, taxed out**: no tax now, income tax on everything withdrawn (the usual pension design).

Try: set the two income-tax rates equal and the last two lines coincide exactly. Lower the retirement tax rate and the pension design pulls ahead; raise it and tax-free growth wins. Stretch the years to see the yearly-taxed line fall ever further behind.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Return before tax', min: 0, max: 12, step: 0.25, value: 7, unit: '%' },
        { id: 'T', label: 'Years', min: 1, max: 50, step: 1, value: 30 },
        { id: 'tg', label: 'Tax on investment returns', min: 0, max: 50, step: 1, value: 25, unit: '%' },
        { id: 'ti', label: 'Income tax now', min: 0, max: 50, step: 1, value: 30, unit: '%' },
        { id: 'to', label: 'Income tax in retirement', min: 0, max: 50, step: 1, value: 30, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'Taxed every year'], ['b', 'Taxed once at the end'], ['c', 'Tax-free growth'], ['d', 'Relief in, taxed out'], ['drag', 'Yearly tax takes, of the gain']]);
      const V = ctl.values;
      const P0 = 10000;
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const r = V.r / 100, T = Math.round(V.T), tg = V.tg / 100, ti = V.ti / 100, to = V.to / 100;
        const A = [], B = [], Cc = [], D = [];
        for (let t = 0; t <= T; t++) {
          const g = kit.fin.fv(1, r, t);
          A.push([t, P0 * (1 - ti) * kit.fin.fv(1, r * (1 - tg), t)]);
          B.push([t, P0 * (1 - ti) * (g - tg * (g - 1))]);
          Cc.push([t, P0 * (1 - ti) * g]);
          D.push([t, P0 * g * (1 - to)]);
        }
        const rr = { x: 70, y: 34, w: st.W - 90, h: st.H - 84 };
        const ymax = Math.max(P0, ...Cc.map(p => p[1]), ...D.map(p => p[1])) * 1.08;
        const f = frame(kit, c, C, rr, { x0: 0, x1: T, y0: 0, y1: ymax, yfmt: v => kit.money(v, 0, true), xlabel: 'years invested', ylabel: 'after all taxes, if cashed out' });
        clipTo(c, rr);
        polyline(c, A, f.X, f.Y, C.bad, 2.4);
        polyline(c, B, f.X, f.Y, C.warn, 2.4);
        polyline(c, Cc, f.X, f.Y, C.ok, 2.6);
        polyline(c, D, f.X, f.Y, C.accent, 2.4, [7, 5]);
        c.restore();
        legend(kit, c, C, [[C.bad, 'taxed yearly'], [C.warn, 'taxed at the end'], [C.ok, 'tax-free growth'], [C.accent, 'relief in, taxed out', [7, 5]]], rr.x + 10, rr.y + 10);
        const last = arr => arr[arr.length - 1][1];
        const gainA = last(A) - P0 * (1 - ti), gainC = last(Cc) - P0 * (1 - ti);
        ro.set('a', money(kit, last(A)));
        ro.set('b', money(kit, last(B)));
        ro.set('c', money(kit, last(Cc)));
        ro.set('d', money(kit, last(D)));
        ro.set('drag', gainC > 1e-9 ? pctf(kit, 1 - gainA / gainC, 0) + ' (the rate is ' + kit.pct(tg, 0) + ')' : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
