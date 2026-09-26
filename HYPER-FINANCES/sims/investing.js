/* HYPER-FINANCES · sims/investing.js — Investing Fundamentals and Funds and costs:
 * risk against return, diversification, the time horizon, a lump sum against regular
 * investing, fees, starting early, rebalancing, and a crowd of active managers against the
 * index. Every random market is seeded (kit.fin.normals), so a simulation is reproducible,
 * and every chart of a random market says that it is simulated. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------------------------------------------------------------- drawing helpers */
  function ticks(min, max, n) {
    const span = max - min;
    if (!(span > 0)) return [min];
    const step = Hyper.niceStep(span, n || 5);
    const out = [];
    for (let v = Math.ceil(min / step - 1e-9) * step; v <= max + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return out;
  }
  // horizontal gridlines and labels on the left of a chart area a = { x, y, w, h }
  function yAxis(c, C, a, min, max, fmt, n) {
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (const v of ticks(min, max, n)) {
      const y = a.y + a.h - (v - min) / (max - min) * a.h;
      c.strokeStyle = v === 0 && min < 0 ? C.axis : C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(a.x, y); c.lineTo(a.x + a.w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(v), a.x - 6, y);
    }
  }
  // tick labels under a chart area
  function xAxis(c, C, a, min, max, fmt, n) {
    c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted;
    for (const v of ticks(min, max, n)) c.fillText(fmt(v), a.x + (v - min) / (max - min) * a.w, a.y + a.h + 5);
  }
  // a logarithmic money axis: gridlines at 1, 2 and 5 × 10^k
  function logMoneyAxis(kit, c, C, a, min, max) {
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    const l0 = Math.log10(min), l1 = Math.log10(max);
    for (let e = Math.floor(l0); e <= Math.ceil(l1); e++) {
      for (const m of [1, 2, 5]) {
        const v = m * Math.pow(10, e), lv = Math.log10(v);
        if (lv < l0 - 1e-9 || lv > l1 + 1e-9) continue;
        const y = a.y + a.h - (lv - l0) / (l1 - l0) * a.h;
        c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); c.moveTo(a.x, y); c.lineTo(a.x + a.w, y); c.stroke();
        c.fillStyle = C.muted; c.fillText(kit.money(v, 0, true), a.x - 6, y);
      }
    }
  }
  function polyline(c, pts, color, width, dash) {
    if (pts.length < 2) return;
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
    for (let k = 1; k < pts.length; k++) c.lineTo(pts[k][0], pts[k][1]);
    c.stroke();
    c.restore();
  }
  function hline(c, x0, x1, y, color, dash) { polyline(c, [[x0, y], [x1, y]], color, 1.3, dash || [5, 4]); }
  // a band between two curves (arrays of [x, y] with the same x)
  function band(c, lo, hi, color) {
    if (lo.length < 2) return;
    c.fillStyle = color;
    c.beginPath(); c.moveTo(hi[0][0], hi[0][1]);
    for (let k = 1; k < hi.length; k++) c.lineTo(hi[k][0], hi[k][1]);
    for (let k = lo.length - 1; k >= 0; k--) c.lineTo(lo[k][0], lo[k][1]);
    c.closePath(); c.fill();
  }
  function legend(kit, c, items, x, y, gap) {
    let xx = x;
    for (const [col, text] of items) {
      c.fillStyle = col; c.fillRect(xx, y - 5, 11, 11);
      kit.label(c, text, xx + 15, y, { size: 11, color: kit.colors().text2 || kit.colors().text });
      xx += 15 + (gap || (text.length * 6.2 + 16));
    }
  }
  // the percentile q (0..1) of a sorted array, interpolated
  function pctile(sorted, q) {
    const n = sorted.length;
    if (!n) return 0;
    const k = clamp(q * (n - 1), 0, n - 1), i = Math.floor(k), f = k - i;
    return i + 1 < n ? sorted[i] * (1 - f) + sorted[i + 1] * f : sorted[i];
  }
  const pc = (v, d) => (v < 0 ? '−' : '') + Math.abs(v * 100).toFixed(d == null ? 0 : d) + ' %';
  const signedPct = (kit, v, d) => (v > 0 ? '+' : '') + kit.pct(v, d == null ? 1 : d);

  /* ================================================================ risk against return */
  // Approximate long-run history, US, 1926–2020, before inflation: compound yearly return g and
  // volatility s (standard deviation of yearly returns). Rounded; illustrative, not a forecast.
  const HIST = [
    { name: 'cash (treasury bills)', g: 0.033, s: 0.03 },
    { name: 'government bonds', g: 0.055, s: 0.10 },
    { name: 'large-company shares', g: 0.10, s: 0.20 },
    { name: 'small-company shares', g: 0.12, s: 0.31 }
  ];
  const INFL = 0.03;
  // the simulated mix: average (arithmetic) yearly returns that compound to the figures above
  const SHARES = { mu: 0.12, s: 0.20 }, BONDS = { mu: 0.06, s: 0.10 }, RHO_SB = 0.1;

  Hyper.sim('inv-risk-return', {
    title: 'Risk and return: what a higher return costs',
    blurb: `**Left:** four kinds of investment placed by their long-run compound return and their volatility — rounded, approximate US history over 1926–2020, before inflation. It is a picture of the past, not a forecast. The curve is every mix of shares and government bonds. **Right:** a run of *simulated* years for the mix you choose.

- Slide **Shares in the mix** from 0 to 100 %: the return rises, and so does the height of the bars. The bumpiness is the price of the return.
- Count the red bars at 100 % shares: in this model about one year in four is a loss, and more often than not a run of 30 years holds at least one fall of 25 % or more. (The simulation draws normal yearly returns; real markets have fatter tails, so real crashes are deeper and more frequent than a normal model suggests.)
- Tick **After inflation**: cash only just keeps its value, while shares keep most of their lead. The gap is the reward for bearing risk.
- Press **New years** a few times: the same mix can give quite different 30-year results.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Shares in the mix', min: 0, max: 100, step: 5, value: params && params.w != null ? params.w : 60, unit: '%' },
        { id: 'n', label: 'Years simulated', min: 10, max: 50, step: 1, value: 30 },
        { id: 'real', type: 'check', label: 'After inflation (about 3 % a year)', value: !!(params && params.real) },
        { type: 'buttons', items: [{ id: 'new', label: 'New years', primary: true }] }
      ], id => { if (id === 'new') seed++; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['mix', 'Your mix'], ['g', 'Long-run return'], ['vol', 'Volatility'], ['range', 'Two years in three'],
        ['worst', 'Simulated: worst year'], ['down', 'Simulated: down years'], ['end', kit.money(10000, 0) + ' became (simulated)']]);
      const V = ctl.values;
      let seed = 8, rets = [], S = null;

      const mixOf = w => {
        const m = kit.fin.mix2({ w, mu1: SHARES.mu, mu2: BONDS.mu, s1: SHARES.s, s2: BONDS.s, rho: RHO_SB });
        return { mu: m.mu, sd: m.sd, g: m.mu - m.sd * m.sd / 2 };
      };
      const realOf = x => V.real ? (1 + x) / (1 + INFL) - 1 : x;

      function solve() {
        const w = V.w / 100, n = Math.round(V.n);
        const g = kit.fin.normals(seed), q = Math.sqrt(1 - RHO_SB * RHO_SB);
        rets = [];
        let grow = 1, worst = Infinity, down = 0;
        for (let t = 0; t < n; t++) {
          const z1 = g(), z2 = g();
          const rs = SHARES.mu + SHARES.s * z1, rb = BONDS.mu + BONDS.s * (RHO_SB * z1 + q * z2);
          const r = realOf(Math.max(-0.95, w * rs + (1 - w) * rb));
          rets.push(r); grow *= 1 + r; worst = Math.min(worst, r); if (r < 0) down++;
        }
        const m = mixOf(w);
        S = { m, grow, worst, down, n };
        ro.set('mix', Math.round(V.w) + ' % shares, ' + Math.round(100 - V.w) + ' % bonds');
        ro.set('g', kit.pct(realOf(m.g), 1) + ' a year' + (V.real ? ' after inflation' : ''));
        ro.set('vol', kit.pct(m.sd, 1));
        ro.set('range', pc(realOf(m.mu - m.sd)) + ' to ' + pc(realOf(m.mu + m.sd)));
        ro.set('worst', kit.pct(worst, 1));
        ro.set('down', down + ' of ' + n);
        ro.set('end', kit.money(10000 * grow, 0) + ' (' + kit.pct(Math.pow(grow, 1 / n) - 1, 1) + ' a year)');
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!S) return;
        const split = Math.round(W * 0.5);
        // left: the historical map and the mixes
        const A = { x: 48, y: 36, w: split - 48 - 22, h: Hh - 36 - 46 };
        const ymin = V.real ? -0.02 : 0, ymax = V.real ? 0.10 : 0.13, xmax = 0.35;
        const X = s => A.x + s / xmax * A.w, Y = g => A.y + A.h - (g - ymin) / (ymax - ymin) * A.h;
        yAxis(c, C, A, ymin, ymax, v => pc(v), 5);
        xAxis(c, C, A, 0, xmax, v => pc(v), 5);
        kit.label(c, 'volatility (spread of yearly returns)', A.x + A.w / 2, A.y + A.h + 30, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'approximate history, US 1926–2020', A.x - 40, A.y - 24, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'compound return a year' + (V.real ? ', after inflation' : ', before inflation'), A.x - 40, A.y - 9, { size: 10.5, color: C.muted });
        const yRef = Y(V.real ? 0 : INFL);
        hline(c, A.x, A.x + A.w, yRef, C.faint);
        kit.label(c, V.real ? 'no growth in buying power' : 'inflation ≈ 3 %', A.x + A.w, yRef + 9, { size: 10.5, color: C.muted, align: 'right' });
        const curve = [];
        for (let k = 0; k <= 50; k++) { const m = mixOf(k / 50); curve.push([X(m.sd), Y(realOf(m.g))]); }
        polyline(c, curve, C.accent, 1.6, [4, 3]);
        HIST.forEach((h, j) => {
          const x = X(h.s), y = Y(realOf(h.g));
          kit.dot(c, x, y, 4.5, C.series[(j + 1) % C.series.length], C.bg2);
          const right = x < A.x + A.w * 0.55;
          kit.label(c, h.name, x + (right ? 8 : -8), y + (j === 1 ? 10 : -9), { size: 10.5, color: C.text, align: right ? 'left' : 'right' });
        });
        const my = Y(realOf(S.m.g)), mx = X(S.m.sd);
        kit.dot(c, mx, my, 6.5, C.accent, C.bg2);
        const lw = V.w < 50;             // keep the label clear of the bond and share labels
        kit.label(c, 'your mix', mx + (lw ? -9 : 9), my + (lw ? -12 : 12), { size: 11, color: C.accent, weight: 600, align: lw ? 'right' : 'left' });

        // right: simulated years for the mix
        const B = { x: split + 46, y: 36, w: W - split - 46 - 12, h: Hh - 36 - 46 };
        const lo = Math.min(-0.3, Math.floor(Math.min(...rets) * 10) / 10), hi = Math.max(0.4, Math.ceil(Math.max(...rets) * 10) / 10);
        const YB = r => B.y + B.h - (r - lo) / (hi - lo) * B.h;
        yAxis(c, C, B, lo, hi, v => pc(v), 6);
        const n = rets.length, bw = B.w / n;
        rets.forEach((r, t) => {
          const y0 = YB(0), y1 = YB(r);
          c.fillStyle = r >= 0 ? C.ok : C.bad;
          c.fillRect(B.x + t * bw + bw * 0.15, Math.min(y0, y1), bw * 0.7, Math.max(1, Math.abs(y1 - y0)));
        });
        const avg = rets.reduce((a, b) => a + b, 0) / n;
        hline(c, B.x, B.x + B.w, YB(avg), C.accent);
        kit.label(c, 'average ' + pc(avg, 1), B.x + B.w, YB(avg) - 9, { size: 10.5, color: C.accent, align: 'right' });
        xAxis(c, C, B, 1, n, v => String(Math.round(v)), 5);
        kit.label(c, 'simulated years for your mix', B.x - 40, B.y - 24, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'yearly return' + (V.real ? ' after inflation' : ''), B.x - 40, B.y - 9, { size: 10.5, color: C.muted });
        kit.label(c, 'year', B.x + B.w / 2, B.y + B.h + 30, { size: 11, color: C.muted, align: 'center' });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ diversification */
  Hyper.sim('inv-diversify', {
    title: 'Diversification: how many shares are enough?',
    blurb: `Twelve investors each pick shares at random from the same *simulated* market of 200 companies, and hold them in equal amounts for 25 years. **Left:** the volatility of a portfolio as shares are added: it falls fast, then levels off at the **market risk** that no amount of diversification removes. **Right:** what each investor's ¤10,000 became (logarithmic scale), with the whole market in bold.

- With **one share each**, the twelve results scatter from near-ruin to a fortune — and most end *below* the market line: a few big winners lift the average, and the typical single share trails it.
- Raise the number of shares to 10, 30, 100: the lines gather around the market. Nothing was given up; the luck was removed.
- Raise the **correlation**: the floor rises. When everything moves together, owning more of it helps less — which is why diversifying across countries and asset classes matters.`,
    mount(box, kit) {
      const U = 200, Y = 25, K = 12, MU = 0.09;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Shares each investor holds', min: 1, max: 100, step: 1, value: 1 },
        { id: 's', label: 'Volatility of a single share', min: 15, max: 60, step: 1, value: 35, unit: '%' },
        { id: 'rho', label: 'Correlation between shares', min: 0, max: 0.9, step: 0.05, value: 0.25 },
        { type: 'buttons', items: [{ id: 'new', label: 'New market', primary: true }] }
      ], id => { if (id === 'new') { seed++; draws(); } solve(); loop.once(); });
      const ro = kit.readout(box.side, [['one', 'A single share'], ['port', 'Your portfolio'], ['floor', 'Market risk (the floor)'], ['gone', 'Removable risk removed'],
        ['range', 'Simulated: the 12 investors'], ['mkt', 'Simulated: whole market']]);
      const V = ctl.values;
      let seed = 3, zM = [], zE = [], picks = [], paths = [], market = [];

      function draws() {
        const g = kit.fin.normals(seed);
        zM = Array.from({ length: Y }, () => g());
        zE = Array.from({ length: U }, () => Array.from({ length: Y }, () => g()));
        // each investor's shares: the 200 companies in a random order (uniform numbers from normals)
        picks = [];
        for (let k = 0; k < K; k++) {
          const keyed = Array.from({ length: U }, (_, i) => [kit.fin.ncdf(g()), i]).sort((a, b) => a[0] - b[0]);
          picks.push(keyed.map(x => x[1]));
        }
      }
      function solve() {
        const s = V.s / 100, rho = V.rho, N = clamp(Math.round(V.N), 1, U);
        const a = Math.sqrt(rho), b = Math.sqrt(1 - rho);
        // one market shock a year shared by all, plus each company's own shock
        const R = zE.map(e => e.map((x, t) => Math.max(-0.95, MU + s * (a * zM[t] + b * x))));
        paths = picks.map(order => {
          const ids = order.slice(0, N), p = [10000];
          for (let t = 0; t < Y; t++) { let m = 0; for (const i of ids) m += R[i][t]; p.push(p[t] * (1 + m / N)); }
          return p;
        });
        market = [10000];
        for (let t = 0; t < Y; t++) { let m = 0; for (let i = 0; i < U; i++) m += R[i][t]; market.push(market[t] * (1 + m / U)); }
        const sN = s * Math.sqrt(rho + (1 - rho) / N), fl = s * Math.sqrt(rho);
        const finals = paths.map(p => p[Y]).sort((x, y) => x - y);
        ro.set('one', kit.pct(s, 0) + ' a year');
        ro.set('port', N + (N === 1 ? ' share: ' : ' shares: ') + kit.pct(sN, 1) + ' a year');
        ro.set('floor', kit.pct(fl, 1));
        ro.set('gone', s - fl > 1e-9 ? kit.pct((s - sN) / (s - fl), 0) : '—');
        ro.set('range', kit.money(finals[0], 0) + ' to ' + kit.money(finals[K - 1], 0));
        const below = paths.filter(p => p[Y] < market[Y]).length;
        ro.set('mkt', kit.money(market[Y], 0) + ' (' + below + ' of 12 end below it)');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!paths.length) return;
        const s = V.s / 100, rho = V.rho, N = clamp(Math.round(V.N), 1, U);
        const split = Math.round(W * 0.42);
        // left: portfolio volatility against the number of holdings (logarithmic)
        const A = { x: 44, y: 36, w: split - 44 - 18, h: Hh - 36 - 46 };
        const ymax = s * 1.08;
        const X = n => A.x + Math.log10(n) / 2 * A.w, Yv = v => A.y + A.h - v / ymax * A.h;
        yAxis(c, C, A, 0, ymax, v => pc(v), 5);
        c.font = FONT; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted;
        for (const n of [1, 2, 5, 10, 20, 50, 100]) c.fillText(String(n), X(n), A.y + A.h + 5);
        kit.label(c, 'number of shares held', A.x + A.w / 2, A.y + A.h + 30, { size: 11, color: C.muted, align: 'center' });
        const fl = s * Math.sqrt(rho);
        const curve = [], floor = [], base = [];
        for (let k = 0; k <= 60; k++) { const n = Math.pow(10, k / 30); curve.push([X(n), Yv(s * Math.sqrt(rho + (1 - rho) / n))]); floor.push([X(n), Yv(fl)]); base.push([X(n), Yv(0)]); }
        band(c, base, floor, kit.hue(220, 0.16));
        band(c, floor, curve, kit.hue(30, 0.2));
        polyline(c, curve, C.warn, 2.2);
        hline(c, A.x, A.x + A.w, Yv(fl), C.accent);
        kit.label(c, 'market risk: stays', A.x + A.w - 4, Yv(fl) + 11, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'removable risk', A.x + 6, Yv(fl + 0.3 * (s - fl)), { size: 10.5, color: C.warn });
        const sN = s * Math.sqrt(rho + (1 - rho) / N);
        kit.dot(c, X(N), Yv(sN), 6, C.warn, C.bg2);
        kit.label(c, 'portfolio volatility', A.x - 36, A.y - 20, { size: 11.5, color: C.text, weight: 600 });

        // right: what each investor's money became
        const B = { x: split + 50, y: 36, w: W - split - 50 - 14, h: Hh - 36 - 46 };
        let lo = Infinity, hi = 0;
        for (const p of paths.concat([market])) for (const v of p) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
        lo = Math.max(100, lo * 0.85); hi = Math.max(hi * 1.15, lo * 10);
        const l0 = Math.log10(lo), l1 = Math.log10(hi);
        const XB = t => B.x + t / Y * B.w, YB = v => B.y + B.h - (Math.log10(Math.max(v, lo)) - l0) / (l1 - l0) * B.h;
        logMoneyAxis(kit, c, C, B, lo, hi);
        xAxis(c, C, B, 0, Y, v => String(Math.round(v)), 5);
        kit.label(c, 'year', B.x + B.w / 2, B.y + B.h + 30, { size: 11, color: C.muted, align: 'center' });
        paths.forEach((p, k) => polyline(c, p.map((v, t) => [XB(t), YB(v)]), C.series[1 + k % (C.series.length - 1)], 1.3));
        polyline(c, market.map((v, t) => [XB(t), YB(v)]), C.text, 3);
        kit.label(c, 'whole market', B.x + B.w - 2, YB(market[Y]) - 11, { size: 11, color: C.text, align: 'right', weight: 600 });
        kit.label(c, '12 investors, simulated (log scale)', B.x - 44, B.y - 20, { size: 11.5, color: C.text, weight: 600 });
      }
      draws(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the time horizon */
  Hyper.sim('inv-horizon', {
    title: 'The time horizon: how the range of outcomes narrows',
    blurb: `Two thousand investors hold the same *simulated* market for 1 to 40 years. For each holding period the chart shows their **yearly return, compounded over the whole period**: the middle half of the investors (dark band), the middle 90 % (light band) and the median. The thin lines are a few individual investors. Below: the chance of ending with less money than you started with. The market draws normal yearly returns — real markets have fatter tails and sometimes long flat decades, so treat this as the shape of the idea, not a forecast.

- Over one year, results run from a heavy loss to a large gain. Over 20 years the band is far narrower — but it never shrinks to a line, and the chance of a loss never quite reaches zero.
- The median sits **below** the dashed average of single years. That gap is the *volatility drag*: raise the volatility and watch it widen.
- Set the volatility to zero: everyone gets exactly the average. Risk is the spread, nothing else.`,
    mount(box, kit, params) {
      const K = 2000, Y = 40, NS = 24;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'mu', label: 'Average yearly return', min: 0, max: 12, step: 0.5, value: params && params.mu != null ? params.mu : 7, unit: '%' },
        { id: 'sd', label: 'Volatility', min: 0, max: 35, step: 1, value: params && params.sd != null ? params.sd : 18, unit: '%' },
        { id: 'T', label: 'Holding period to inspect', min: 1, max: 40, step: 1, value: params && params.T || 10, unit: 'years' },
        { type: 'buttons', items: [{ id: 'new', label: 'New market', primary: true }] }
      ], id => { if (id === 'new') { seed++; draws(); } if (id !== 'T') solve(); show(); loop.once(); });
      const ro = kit.readout(box.side, [['T', 'Holding period'], ['med', 'Median yearly return'], ['mid', 'Middle 90 % of investors'], ['loss', 'Chance of ending below the start'],
        ['avg', 'Average of single years'], ['drag', 'Volatility drag']]);
      const V = ctl.values;
      let seed = 21, Z = null, Q = null, sample = [];

      function draws() {
        const g = kit.fin.normals(seed);
        Z = new Float64Array(K * Y);
        for (let i = 0; i < Z.length; i++) Z[i] = g();
      }
      function solve() {
        const mu = V.mu / 100, sd = V.sd / 100;
        const L = new Float64Array(K * Y);               // cumulative log growth of each investor
        for (let k = 0; k < K; k++) {
          let acc = 0;
          for (let t = 0; t < Y; t++) { acc += Math.log(Math.max(0.05, 1 + mu + sd * Z[k * Y + t])); L[k * Y + t] = acc; }
        }
        Q = [];
        const col = new Float64Array(K);
        for (let T = 1; T <= Y; T++) {
          let losses = 0;
          for (let k = 0; k < K; k++) { const lg = L[k * Y + T - 1]; col[k] = Math.exp(lg / T) - 1; if (lg < 0) losses++; }
          const s = Array.from(col).sort((a, b) => a - b);
          Q[T] = { p5: pctile(s, 0.05), p25: pctile(s, 0.25), p50: pctile(s, 0.5), p75: pctile(s, 0.75), p95: pctile(s, 0.95), loss: losses / K };
        }
        sample = [];
        for (let k = 0; k < NS; k++) { const p = []; for (let T = 1; T <= Y; T++) p.push([T, Math.exp(L[k * Y + T - 1] / T) - 1]); sample.push(p); }
      }
      function show() {
        const T = clamp(Math.round(V.T), 1, Y), q = Q[T], mu = V.mu / 100;
        ro.set('T', T + (T === 1 ? ' year' : ' years'));
        ro.set('med', kit.pct(q.p50, 1) + ' a year');
        ro.set('mid', kit.pct(q.p5, 1) + ' to ' + kit.pct(q.p95, 1));
        ro.set('loss', kit.pct(q.loss, 1));
        ro.set('avg', kit.pct(mu, 1));
        const drag = mu - Q[Y].p50;
        ro.set('drag', kit.pct(Math.abs(drag) < 5e-4 ? 0 : drag, 1) + ' a year');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!Q) return;
        const T = clamp(Math.round(V.T), 1, Y), mu = V.mu / 100;
        const A = { x: 54, y: 34, w: W - 54 - 18, h: Math.round((Hh - 34) * 0.62) - 26 };
        const lo = clamp(Math.min(-0.1, Math.floor(Q[1].p5 * 10) / 10), -0.8, 0), hi = clamp(Math.max(0.2, Math.ceil(Q[1].p95 * 10) / 10), 0.1, 1);
        const X = t => A.x + (t - 1) / (Y - 1) * A.w, Yr = r => A.y + A.h - (clamp(r, lo, hi) - lo) / (hi - lo) * A.h;
        yAxis(c, C, A, lo, hi, v => pc(v), 6);
        const line = key => Q.slice(1).map((q, j) => [X(j + 1), Yr(q[key])]);
        band(c, line('p5'), line('p95'), kit.hue(220, 0.16));
        band(c, line('p25'), line('p75'), kit.hue(220, 0.3));
        for (const p of sample) polyline(c, p.map(([t, r]) => [X(t), Yr(r)]), C.faint, 0.8);
        polyline(c, line('p50'), C.accent, 2.4);
        hline(c, A.x, A.x + A.w, Yr(mu), C.warn);
        kit.label(c, 'average of single years ' + pc(mu, 1), A.x + A.w, Yr(mu) - 9, { size: 10.5, color: C.warn, align: 'right' });
        polyline(c, [[X(T), A.y], [X(T), A.y + A.h]], C.text, 1.2, [3, 3]);
        kit.dot(c, X(T), Yr(Q[T].p50), 5, C.accent, C.bg2);
        kit.label(c, 'simulated: yearly return, compounded over the years held', A.x - 46, A.y - 20, { size: 11.5, color: C.text, weight: 600 });
        legend(kit, c, [[kit.hue(220, 0.3), 'middle 50 %'], [kit.hue(220, 0.16), 'middle 90 %'], [C.accent, 'median']], Math.max(A.x + 4, A.x + A.w - 280), A.y + A.h - 10);

        // below: the chance of a loss
        const B = { x: A.x, y: A.y + A.h + 34, w: A.w, h: Hh - (A.y + A.h + 34) - 34 };
        if (B.h > 20) {
          const lmax = Math.max(0.1, Math.ceil(Q[1].loss * 10) / 10);
          yAxis(c, C, B, 0, lmax, v => pc(v), 3);
          const bw = B.w / (Y - 1);
          for (let t = 1; t <= Y; t++) {
            const h = Q[t].loss / lmax * B.h;
            c.fillStyle = t === T ? C.bad : kit.hue(0, 0.45);
            c.fillRect(X(t) - bw * 0.35, B.y + B.h - h, bw * 0.7, h);
          }
          kit.label(c, 'chance of ending with less than you put in', B.x + 4, B.y - 6, { size: 10.5, color: C.muted });
          xAxis(c, C, B, 1, Y, v => String(Math.round(v)), 8);
          kit.label(c, 'years held', B.x + B.w / 2, B.y + B.h + 24, { size: 11, color: C.muted, align: 'center' });
        }
      }
      draws(); solve(); show();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ lump sum or spread it */
  Hyper.sim('inv-regular', {
    title: 'All at once, or a little at a time?',
    blurb: `You have ¤12,000 to invest. Either invest it **all at once**, or **spread it** in equal parts over several months, keeping the rest in cash until its turn comes. **Left:** one *simulated* market; each dot is a purchase, and bigger dots are cheaper months, when the same amount buys more units. **Right:** spreading against investing at once, in 1,000 *simulated* markets: each dot is one market.

- Dots on the right (the market rose over the period) sit below the line: investing at once won. Dots on the left (the market fell) sit above it: spreading won. Most simulated markets rise, so investing at once wins more often.
- Stretch the period to 36 months: the lump sum's usual lead grows — and so does the size of the regret in the markets where it loses.
- Set the average return equal to the cash rate: now neither wins on average; spreading only narrows the range of outcomes.
- Compare the average cost with the average price in the left market: buying a fixed amount each month always pays less than the average price.`,
    mount(box, kit) {
      const K = 1000, NMAX = 36, L = 12000;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Spread over', min: 2, max: 36, step: 1, value: 12, unit: 'months' },
        { id: 'mu', label: 'Average yearly return', min: 0, max: 12, step: 0.5, value: 7, unit: '%' },
        { id: 'sd', label: 'Volatility', min: 5, max: 35, step: 1, value: 16, unit: '%' },
        { id: 'cash', label: 'Interest on the waiting cash', min: 0, max: 6, step: 0.25, value: 2, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New markets', primary: true }] }
      ], id => { if (id === 'new') { seed++; draws(); } solve(); loop.once(); });
      const ro = kit.readout(box.side, [['win', 'All at once came out ahead'], ['avg', 'Spreading, on average'], ['best', 'Spreading at its best'], ['worst', 'Spreading at its worst'],
        ['cost', 'Left market: your average cost'], ['price', 'Left market: average price']]);
      const V = ctl.values;
      let seed = 9, Z = null, res = [], sample = null;

      function draws() {
        const g = kit.fin.normals(seed);
        Z = new Float64Array(K * NMAX);
        for (let i = 0; i < Z.length; i++) Z[i] = g();
      }
      function run(k, n, mu, sd, cash) {
        const P = [100];
        for (let m = 0; m < n; m++) P.push(P[m] * Math.max(0.05, 1 + mu / 12 + sd / Math.sqrt(12) * Z[k * NMAX + m]));
        const part = L / n;
        let units = 0, waiting = L;
        for (let m = 0; m < n; m++) { units += part / P[m]; waiting -= part; waiting *= 1 + cash / 12; }
        const lump = L * P[n] / P[0], spread = units * P[n] + Math.max(0, waiting);
        return { P, units, diff: (spread - lump) / L, mkt: P[n] / P[0] - 1 };
      }
      function solve() {
        const n = clamp(Math.round(V.n), 1, NMAX), mu = V.mu / 100, sd = V.sd / 100, cash = V.cash / 100;
        res = [];
        for (let k = 0; k < K; k++) res.push(run(k, n, mu, sd, cash));
        sample = res[0];
        const d = res.map(r => r.diff);
        const wins = d.filter(x => x < 0).length;
        const mean = d.reduce((a, b) => a + b, 0) / K;
        ro.set('win', kit.pct(wins / K, 0) + ' of markets');
        ro.set('avg', signedPct(kit, mean, 1) + ' of the amount (' + (mean < 0 ? '−' : '+') + kit.money(Math.abs(mean) * L, 0) + ')');
        ro.set('best', signedPct(kit, Math.max(...d), 1));
        ro.set('worst', signedPct(kit, Math.min(...d), 1));
        const avgPrice = sample.P.slice(0, n).reduce((a, b) => a + b, 0) / n;
        ro.set('cost', kit.money(L / sample.units) + ' a unit');
        ro.set('price', kit.money(avgPrice) + ' a unit');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!sample) return;
        const n = clamp(Math.round(V.n), 1, NMAX);
        const split = Math.round(W * 0.45);
        // left: one market, with the purchases
        const A = { x: 50, y: 44, w: split - 50 - 16, h: Hh - 44 - 46 };
        const P = sample.P;
        let lo = Math.min(...P), hi = Math.max(...P);
        const pad = Math.max(2, (hi - lo) * 0.15); lo = Math.max(0, lo - pad); hi += pad;
        const X = m => A.x + m / n * A.w, Yp = p => A.y + A.h - (p - lo) / (hi - lo) * A.h;
        yAxis(c, C, A, lo, hi, v => kit.money(v, 0), 4);
        xAxis(c, C, A, 0, n, v => String(Math.round(v)), 6);
        kit.label(c, 'month', A.x + A.w / 2, A.y + A.h + 30, { size: 11, color: C.muted, align: 'center' });
        polyline(c, P.map((p, m) => [X(m), Yp(p)]), C.text, 1.8);
        const avgPrice = P.slice(0, n).reduce((a, b) => a + b, 0) / n, avgCost = L / sample.units;
        hline(c, A.x, A.x + A.w, Yp(avgPrice), C.warn);
        hline(c, A.x, A.x + A.w, Yp(avgCost), C.ok);
        const pmin = Math.min(...P.slice(0, n));
        for (let m = 0; m < n; m++) kit.dot(c, X(m), Yp(P[m]), 2.5 + 4 * pmin / P[m], C.accent, C.bg2);
        const above = Yp(avgPrice) < Yp(avgCost);
        kit.label(c, 'average price', A.x + 4, Yp(avgPrice) + (above ? -9 : 9), { size: 10.5, color: C.warn });
        kit.label(c, 'your average cost', A.x + 4, Yp(avgCost) + (above ? 9 : -9), { size: 10.5, color: C.ok });
        kit.label(c, 'one simulated market', A.x - 42, A.y - 28, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'price of a unit; dots are purchases', A.x - 42, A.y - 13, { size: 10.5, color: C.muted });

        // right: spreading minus all at once, across the markets
        const B = { x: split + 54, y: 44, w: W - split - 54 - 14, h: Hh - 44 - 46 };
        const xs = res.map(r => r.mkt).sort((a, b) => a - b), ys = res.map(r => r.diff).sort((a, b) => a - b);
        const x0 = Math.min(-0.1, pctile(xs, 0.005)), x1 = Math.max(0.1, pctile(xs, 0.995));
        const ymag = Math.max(0.02, Math.abs(pctile(ys, 0.005)), Math.abs(pctile(ys, 0.995))) * 1.1;
        const XB = x => B.x + (clamp(x, x0, x1) - x0) / (x1 - x0) * B.w, YB = y => B.y + B.h - (clamp(y, -ymag, ymag) + ymag) / (2 * ymag) * B.h;
        yAxis(c, C, B, -ymag, ymag, v => (v > 0 ? '+' : '') + pc(v), 4);
        xAxis(c, C, B, x0, x1, v => (v > 0 ? '+' : '') + pc(v), 5);
        polyline(c, [[XB(0), B.y], [XB(0), B.y + B.h]], C.axis, 1);
        for (const r of res) { c.fillStyle = r.diff < 0 ? kit.hue(220, 0.55) : kit.hue(30, 0.7); c.fillRect(XB(r.mkt) - 1.5, YB(r.diff) - 1.5, 3, 3); }
        kit.label(c, 'spreading won', B.x + 6, B.y + 10, { size: 10.5, color: C.warn });
        kit.label(c, 'all at once won', B.x + B.w - 4, B.y + B.h - 10, { size: 10.5, color: C.accent, align: 'right' });
        kit.label(c, 'market rise or fall over the period', B.x + B.w / 2, B.y + B.h + 30, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, '1,000 simulated markets', B.x - 48, B.y - 28, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'spreading minus all at once, share of the amount', B.x - 48, B.y - 13, { size: 10.5, color: C.muted });
      }
      draws(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ fees */
  Hyper.sim('inv-fees', {
    title: 'Fees: the silent drain',
    blurb: `The same savings plan in three funds that earn exactly the same return before costs and differ only in their yearly fee, charged on the balance (a twelfth of it each month). The shaded wedge is what the highest fee takes, compared with the lowest. Nothing here is random: it is plain arithmetic.

- With the defaults, compare the three final values: a fee that looks small in any one year takes a large slice over 30 years.
- Double the years: the wedge grows faster than the balance, because the fee also removes the growth that the fee money would have earned.
- Lower the return before fees to 4 %: a 2 % fee now takes about half of all the growth.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Starting amount', min: 0, max: 100000, step: 1000, value: 10000, fmt: v => kit.money(v, 0) },
        { id: 'c', label: 'Added every month', min: 0, max: 2000, step: 25, value: 300, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Return before fees', min: 0, max: 12, step: 0.5, value: 7, unit: '%' },
        { id: 'T', label: 'Years', min: 5, max: 50, step: 1, value: 30 },
        { id: 'fA', label: 'Yearly fee, fund A', min: 0, max: 3, step: 0.05, value: 0.1, unit: '%' },
        { id: 'fB', label: 'Yearly fee, fund B', min: 0, max: 3, step: 0.05, value: 1, unit: '%' },
        { id: 'fC', label: 'Yearly fee, fund C', min: 0, max: 3, step: 0.05, value: 2, unit: '%' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['paid', 'You paid in'], ['A', 'Fund A at the end'], ['B', 'Fund B at the end'], ['C', 'Fund C at the end'],
        ['lB', 'B leaves you, against A'], ['lC', 'C leaves you, against A'], ['growth', 'Growth C keeps, against A']]);
      const tbl = kit.table(box.stage, [
        { label: 'Year', key: 'year', align: 'left' }, { label: 'Paid in', key: 'paid', fmt: v => kit.money(v, 0) },
        { label: 'Fund A', key: 'a', fmt: v => kit.money(v, 0) }, { label: 'Fund B', key: 'b', fmt: v => kit.money(v, 0) }, { label: 'Fund C', key: 'c', fmt: v => kit.money(v, 0) }
      ], { maxHeight: 200 });
      const V = ctl.values;
      let runs = [];

      function solve() {
        const base = { initial: V.P, contribution: V.c, annual: V.r / 100, years: Math.round(V.T) };
        runs = [V.fA, V.fB, V.fC].map(f => kit.fin.grow(Object.assign({ fee: f / 100 }, base)));
        const [a, b, cc] = runs;
        ro.set('paid', kit.money(a.contributed, 0));
        ro.set('A', kit.money(a.balance, 0) + ' (fee ' + kit.pct(V.fA / 100) + ')');
        ro.set('B', kit.money(b.balance, 0) + ' (fee ' + kit.pct(V.fB / 100) + ')');
        ro.set('C', kit.money(cc.balance, 0) + ' (fee ' + kit.pct(V.fC / 100) + ')');
        const rel = (x, y) => y.balance > 0 ? ' (' + signedPct(kit, x.balance / y.balance - 1, 0) + ')' : '';
        ro.set('lB', (b.balance >= a.balance ? '+' : '−') + kit.money(Math.abs(b.balance - a.balance), 0) + rel(b, a));
        ro.set('lC', (cc.balance >= a.balance ? '+' : '−') + kit.money(Math.abs(cc.balance - a.balance), 0) + rel(cc, a));
        ro.set('growth', a.growth > 0 ? kit.pct(Math.max(0, cc.growth) / a.growth, 0) + ' of it' : '—');
        const rows = [], T = Math.round(V.T);
        for (let y = 5; y <= T; y += 5) rows.push({ year: y, paid: a.rows[y * 12].contributed, a: a.rows[y * 12].balance, b: b.rows[y * 12].balance, c: cc.rows[y * 12].balance });
        if (T % 5) rows.push({ year: T, paid: a.contributed, a: a.balance, b: b.balance, c: cc.balance });
        tbl.set(rows);
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!runs.length) return;
        const A = { x: 64, y: 34, w: W - 64 - 110, h: Hh - 34 - 44 };
        const T = Math.round(V.T), max = Math.max(1, ...runs.map(r => r.balance)) * 1.06;
        const X = t => A.x + t / T * A.w, Yv = v => A.y + A.h - v / max * A.h;
        yAxis(c, C, A, 0, max, v => kit.money(v, 0, true), 5);
        xAxis(c, C, A, 0, T, v => String(Math.round(v)), 6);
        kit.label(c, 'year', A.x + A.w / 2, A.y + A.h + 28, { size: 11, color: C.muted, align: 'center' });
        const pts = r => r.rows.filter((row, k) => k % 3 === 0 || k === r.rows.length - 1).map(row => [X(row.t), Yv(row.balance)]);
        const lines = runs.map(pts);
        const [ia, ic] = V.fA <= V.fC ? [0, 2] : [2, 0];
        band(c, lines[ic], lines[ia], kit.hue(0, 0.16));
        polyline(c, runs[0].rows.filter((row, k) => k % 3 === 0).map(row => [X(row.t), Yv(row.contributed)]), C.muted, 1.4, [5, 4]);
        const cols = [C.ok, C.warn, C.bad];
        lines.forEach((l, j) => polyline(c, l, cols[j], 2.4));
        const ends = runs.map((r, j) => ({ j, y: Yv(r.balance) })).sort((p, q) => p.y - q.y);
        for (let k = 1; k < ends.length; k++) ends[k].y = Math.max(ends[k].y, ends[k - 1].y + 15);
        const fees = [V.fA, V.fB, V.fC];
        for (const e of ends) kit.label(c, String.fromCharCode(65 + e.j) + ' ' + kit.pct(fees[e.j] / 100) + ': ' + kit.money(runs[e.j].balance, 0, true), A.x + A.w + 6, e.y, { size: 10.5, color: cols[e.j] });
        kit.label(c, 'balance with each fee (paid in: dashed)', A.x - 56, A.y - 18, { size: 11.5, color: C.text, weight: 600 });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ starting early */
  Hyper.sim('inv-early-late', {
    title: 'Two savers: starting early against starting late',
    blurb: `**Ann** starts young, saves for a few years, then stops and never adds another coin. **Ben** starts later and saves the same amount every month until retirement. Both earn the same return. Nothing here is random: it is plain compounding.

- With the defaults, Ann pays in a third of what Ben pays in — and still retires with more. Her early money simply has more years to grow.
- Move Ann's start later by five years and see how much she loses; then move Ben's start earlier by five years.
- Lower the return to 3 %: the advantage of starting early shrinks, because compounding needs both time and a rate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'amt', label: 'Saved every month', min: 25, max: 1000, step: 25, value: 200, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Yearly return', min: 0, max: 10, step: 0.5, value: 7, unit: '%' },
        { id: 'aStart', label: 'Ann starts at age', min: 18, max: 45, step: 1, value: 25 },
        { id: 'aYears', label: 'Ann saves for', min: 1, max: 20, step: 1, value: 10, unit: 'years' },
        { id: 'bStart', label: 'Ben starts at age', min: 20, max: 60, step: 1, value: 35 },
        { id: 'ret', label: 'Both retire at', min: 50, max: 70, step: 1, value: 65 }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['aPaid', 'Ann paid in'], ['aEnd', 'Ann at retirement'], ['bPaid', 'Ben paid in'], ['bEnd', 'Ben at retirement'],
        ['catch', 'Ben would need, a month'], ['share', 'Growth in Ann\'s pot']]);
      const V = ctl.values;
      let S = null;

      function saver(start, stop, age0, ret, i, amt) {
        const pts = [], paid = [];
        let bal = 0, inn = 0;
        for (let m = 0; m <= (ret - age0) * 12; m++) {
          const age = age0 + m / 12;
          pts.push([age, bal]); paid.push([age, inn]);
          if (m === (ret - age0) * 12) break;
          bal *= 1 + i;
          if (age >= start - 1e-9 && age < stop - 1e-9) { bal += amt; inn += amt; }
        }
        return { pts, paid, bal, inn };
      }
      function solve() {
        const ret = Math.round(V.ret), i = V.r / 100 / 12, amt = V.amt;
        const aStart = Math.min(Math.round(V.aStart), ret), aStop = Math.min(aStart + Math.round(V.aYears), ret), bStart = Math.min(Math.round(V.bStart), ret);
        const age0 = Math.min(aStart, bStart, ret);
        const a = saver(aStart, aStop, age0, ret, i, amt), b = saver(bStart, ret, age0, ret, i, amt);
        S = { a, b, age0, ret, aStart, aStop, bStart };
        ro.set('aPaid', kit.money(a.inn, 0) + ' (ages ' + aStart + '–' + aStop + ')');
        ro.set('aEnd', kit.money(a.bal, 0));
        ro.set('bPaid', kit.money(b.inn, 0) + ' (ages ' + bStart + '–' + ret + ')');
        ro.set('bEnd', kit.money(b.bal, 0));
        const nB = (ret - bStart) * 12;
        ro.set('catch', nB > 0 ? kit.money(a.bal / kit.fin.fvAnnuity(1, i, nB), 0) + ' to match Ann' : 'too late to start');
        ro.set('share', a.bal > 0 ? kit.pct(1 - a.inn / a.bal, 0) + ' of it is growth' : '—');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!S) return;
        const A = { x: 64, y: 34, w: W - 64 - 90, h: Hh - 34 - 44 };
        const max = Math.max(1000, S.a.bal, S.b.bal, S.b.inn, S.a.inn) * 1.08;
        const span = Math.max(1, S.ret - S.age0);
        const X = age => A.x + (age - S.age0) / span * A.w, Yv = v => A.y + A.h - v / max * A.h;
        yAxis(c, C, A, 0, max, v => kit.money(v, 0, true), 5);
        xAxis(c, C, A, S.age0, S.ret, v => String(Math.round(v)), 8);
        kit.label(c, 'age', A.x + A.w / 2, A.y + A.h + 28, { size: 11, color: C.muted, align: 'center' });
        const thin = arr => arr.filter((p, k) => k % 3 === 0 || k === arr.length - 1).map(([age, v]) => [X(age), Yv(v)]);
        polyline(c, thin(S.a.paid), C.ok, 1.3, [5, 4]);
        polyline(c, thin(S.b.paid), C.warn, 1.3, [5, 4]);
        polyline(c, thin(S.a.pts), C.ok, 2.6);
        polyline(c, thin(S.b.pts), C.warn, 2.6);
        const ya = Yv(S.a.bal), yb = Yv(S.b.bal), sep = Math.abs(ya - yb) < 16 ? (ya < yb ? -8 : 8) : 0;
        kit.label(c, 'Ann ' + kit.money(S.a.bal, 0, true), A.x + A.w + 6, ya + sep, { size: 11, color: C.ok, weight: 600 });
        kit.label(c, 'Ben ' + kit.money(S.b.bal, 0, true), A.x + A.w + 6, yb - sep, { size: 11, color: C.warn, weight: 600 });
        kit.label(c, 'balance (solid) and money paid in (dashed)', A.x - 56, A.y - 18, { size: 11.5, color: C.text, weight: 600 });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ rebalancing */
  Hyper.sim('inv-rebalance', {
    title: 'Rebalancing: holding the mix you chose',
    blurb: `A portfolio of shares and bonds starts at your target mix, in a *simulated* market. Three investors hold it: one **never rebalances**, one **resets the mix every year**, and one resets only when the share of shares drifts outside a **band** around the target. **Top:** the share of shares in each portfolio. **Bottom:** what ¤10,000 became. The read-outs at the end summarise 1,000 simulated markets.

- Watch the never-rebalanced line drift upwards: shares usually grow faster, so an untouched portfolio slowly turns into a riskier one than you chose.
- Rebalancing sells some of what has risen and buys what has fallen. Its effect on the return is small and goes either way — press **New market** a few times and compare the three endings — but it reliably keeps the risk near the level you chose. That is its purpose.
- Widen the band: far fewer trades, almost the same control.`,
    mount(box, kit) {
      const K = 1000, YMAX = 40;
      const SHR = { mu: 0.07, s: 0.18 }, BND = { mu: 0.03, s: 0.06 }, RHO = 0.1, Q = Math.sqrt(1 - RHO * RHO);
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'w', label: 'Target share of shares', min: 20, max: 90, step: 5, value: 60, unit: '%' },
        { id: 'band', label: 'Band: rebalance when off by more than', min: 1, max: 20, step: 1, value: 5, unit: 'points' },
        { id: 'Y', label: 'Years', min: 5, max: 40, step: 1, value: 30 },
        { type: 'buttons', items: [{ id: 'new', label: 'New market', primary: true }] }
      ], id => { if (id === 'new') { seed++; draws(); } solve(); loop.once(); });
      const ro = kit.readout(box.side, [['wn', 'Never: shares at the end'], ['vals', 'This market: never · yearly · band'], ['trades', 'Band: rebalances needed'],
        ['drift', '1,000 markets: never ends 15+ points above target'], ['vol', '1,000 markets: volatility, never → yearly'], ['ret', '1,000 markets: median yearly return, never → yearly'],
        ['more', '1,000 markets: never ended with more']]);
      const V = ctl.values;
      let seed = 8, Z1 = null, Z2 = null, runs = null;

      function draws() {
        const g = kit.fin.normals(seed);
        Z1 = new Float64Array(K * YMAX); Z2 = new Float64Array(K * YMAX);
        for (let i = 0; i < Z1.length; i++) { Z1[i] = g(); Z2[i] = g(); }
      }
      function run(k, w, bandW, mode, Y) {
        let S = w * 10000, B = (1 - w) * 10000, trades = 0;
        const wts = [w], vals = [10000], rets = [];
        for (let t = 0; t < Y; t++) {
          const z1 = Z1[k * YMAX + t], z2 = Z2[k * YMAX + t];
          const rs = Math.max(-0.95, SHR.mu + SHR.s * z1), rb = Math.max(-0.95, BND.mu + BND.s * (RHO * z1 + Q * z2));
          const v0 = S + B;
          S *= 1 + rs; B *= 1 + rb;
          const v1 = S + B, wt = v1 > 0 ? S / v1 : w;
          rets.push(v0 > 0 ? v1 / v0 - 1 : 0); wts.push(wt); vals.push(v1);
          if (mode === 'yearly' || (mode === 'band' && Math.abs(wt - w) > bandW)) { if (Math.abs(wt - w) > 1e-9) trades++; S = w * v1; B = (1 - w) * v1; }
        }
        return { wts, vals, rets, trades };
      }
      const sdOf = a => { const n = a.length; if (n < 2) return 0; const m = a.reduce((x, y) => x + y, 0) / n; return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / (n - 1)); };
      function solve() {
        const w = V.w / 100, bw = V.band / 100, Y = clamp(Math.round(V.Y), 1, YMAX);
        runs = { never: run(0, w, bw, 'never', Y), yearly: run(0, w, bw, 'yearly', Y), band: run(0, w, bw, 'band', Y), Y, w };
        let drift = 0, volN = 0, volY = 0, more = 0;
        const gN = [], gY = [];
        for (let k = 0; k < K; k++) {
          const a = run(k, w, bw, 'never', Y), b = run(k, w, bw, 'yearly', Y);
          if (a.wts[Y] >= w + 0.15) drift++;
          if (a.vals[Y] > b.vals[Y]) more++;
          volN += sdOf(a.rets); volY += sdOf(b.rets);
          gN.push(Math.pow(a.vals[Y] / 10000, 1 / Y) - 1); gY.push(Math.pow(b.vals[Y] / 10000, 1 / Y) - 1);
        }
        gN.sort((x, y) => x - y); gY.sort((x, y) => x - y);
        const R = runs;
        ro.set('wn', kit.pct(R.never.wts[Y], 0) + ' (target ' + kit.pct(w, 0) + ')');
        ro.set('vals', kit.money(R.never.vals[Y], 0, true) + ' · ' + kit.money(R.yearly.vals[Y], 0, true) + ' · ' + kit.money(R.band.vals[Y], 0, true));
        ro.set('trades', R.band.trades + ' in ' + Y + ' years (yearly: ' + R.yearly.trades + ')');
        ro.set('drift', kit.pct(drift / K, 0) + ' of markets');
        ro.set('vol', kit.pct(volN / K, 1) + ' → ' + kit.pct(volY / K, 1));
        ro.set('ret', kit.pct(pctile(gN, 0.5), 2) + ' → ' + kit.pct(pctile(gY, 0.5), 2));
        ro.set('more', kit.pct(more / K, 0) + ' of markets');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!runs) return;
        const Y = runs.Y, w = runs.w, bw = V.band / 100;
        const top = { x: 56, y: 34, w: W - 56 - 16, h: Math.round((Hh - 34) * 0.42) - 20 };
        const X = t => top.x + t / Y * top.w, Yw = v => top.y + top.h - v * top.h;
        yAxis(c, C, top, 0, 1, v => pc(v), 4);
        c.fillStyle = kit.hue(160, 0.14);
        c.fillRect(top.x, Yw(Math.min(1, w + bw)), top.w, Yw(Math.max(0, w - bw)) - Yw(Math.min(1, w + bw)));
        hline(c, top.x, top.x + top.w, Yw(w), C.muted);
        const cols = { never: C.bad, yearly: C.accent, band: C.ok };
        for (const m of ['yearly', 'band', 'never']) polyline(c, runs[m].wts.map((v, t) => [X(t), Yw(v)]), cols[m], m === 'never' ? 2.4 : 1.6);
        kit.label(c, 'share of shares in the portfolio (simulated market)', top.x - 48, top.y - 18, { size: 11.5, color: C.text, weight: 600 });

        const bot = { x: top.x, y: top.y + top.h + 44, w: top.w, h: Hh - (top.y + top.h + 44) - 40 };
        legend(kit, c, [[cols.never, 'never'], [cols.yearly, 'every year'], [cols.band, 'band']], Math.max(bot.x + 110, bot.x + bot.w - 230), bot.y - 14, 70);
        if (bot.h > 20) {
          let max = 0;
          for (const m of ['never', 'yearly', 'band']) for (const v of runs[m].vals) max = Math.max(max, v);
          max *= 1.08;
          const Yv = v => bot.y + bot.h - v / max * bot.h;
          yAxis(c, C, bot, 0, max, v => kit.money(v, 0, true), 4);
          for (const m of ['yearly', 'band', 'never']) polyline(c, runs[m].vals.map((v, t) => [X(t), Yv(v)]), cols[m], m === 'never' ? 2.4 : 1.6);
          xAxis(c, C, bot, 0, Y, v => String(Math.round(v)), 6);
          kit.label(c, 'what ' + kit.money(10000, 0) + ' became', bot.x - 48, bot.y - 14, { size: 11, color: C.muted });
          kit.label(c, 'year', bot.x + bot.w / 2, bot.y + bot.h + 26, { size: 11, color: C.muted, align: 'center' });
        }
      }
      draws(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ active managers against the index */
  Hyper.sim('inv-managers', {
    title: 'A crowd of active managers against the index',
    blurb: `Four hundred *simulated* fund managers invest in the same market as an index fund. Each year each manager beats or trails the market by chance (the **tracking error**), plus any real **skill**, and then pays the higher **costs** of active management. **Left:** the share of managers still ahead of the index fund after each number of years. **Right:** every manager's yearly return compared with the index after the holding period, best to worst.

- With no skill and costs 0.9 % a year above the index fund's, about four managers in ten are ahead after one year — and the share keeps falling as the years add up.
- Look at the read-outs for **five years in a row** and **still top quarter**: winning streaks and top rankings appear by pure luck, and top rankings rarely persist.
- Give the average manager some real skill before costs: only when it outweighs the cost gap does the crowd come out ahead.`,
    mount(box, kit) {
      const M = 400, Y = 30, MU = 0.07, SD = 0.18;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Years held', min: 1, max: 30, step: 1, value: 15 },
        { id: 'ca', label: 'Costs of an active fund', min: 0, max: 3, step: 0.1, value: 1, unit: '%' },
        { id: 'ci', label: 'Costs of the index fund', min: 0, max: 1, step: 0.05, value: 0.1, unit: '%' },
        { id: 'te', label: 'Tracking error (yearly luck)', min: 1, max: 10, step: 0.5, value: 4, unit: '%' },
        { id: 'alpha', label: 'Average skill before costs', min: -1, max: 2, step: 0.1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New crowd', primary: true }] }
      ], id => { if (id === 'new') { seed++; draws(); } solve(); loop.once(); });
      const ro = kit.readout(box.side, [['ahead', 'Ahead of the index after T years'], ['med', 'Median manager against the index'], ['gap', 'Expected gap from costs and skill'],
        ['streak', 'Beat the index 5 years running'], ['persist', 'Top quarter in years 1–5 still top in 6–10']]);
      const V = ctl.values;
      let seed = 13, zM = null, zJ = null, ahead = [], excess = [], T = 15;

      function draws() {
        const g = kit.fin.normals(seed);
        zM = new Float64Array(Y); zJ = new Float64Array(M * Y);
        for (let t = 0; t < Y; t++) zM[t] = g();
        for (let i = 0; i < zJ.length; i++) zJ[i] = g();
      }
      function solve() {
        const ca = V.ca / 100, ci = V.ci / 100, te = V.te / 100, alpha = V.alpha / 100;
        T = clamp(Math.round(V.T), 1, Y);
        const mkt = Array.from(zM, z => MU + SD * z);
        const LI = [0];
        for (let t = 0; t < Y; t++) LI.push(LI[t] + Math.log(Math.max(0.01, 1 + mkt[t] - ci)));
        const LJ = new Float64Array(M * (Y + 1));
        let streak = 0;
        for (let j = 0; j < M; j++) {
          let acc = 0, run5 = true;
          for (let t = 0; t < Y; t++) {
            const r = mkt[t] + alpha + te * zJ[j * Y + t] - ca;
            acc += Math.log(Math.max(0.01, 1 + r));
            LJ[j * (Y + 1) + t + 1] = acc;
            if (t < 5 && r <= mkt[t] - ci) run5 = false;
          }
          if (run5) streak++;
        }
        ahead = [];
        for (let t = 1; t <= Y; t++) { let n = 0; for (let j = 0; j < M; j++) if (LJ[j * (Y + 1) + t] > LI[t]) n++; ahead.push([t, n / M]); }
        excess = [];
        const gI = Math.exp(LI[T] / T) - 1;
        for (let j = 0; j < M; j++) excess.push(Math.exp(LJ[j * (Y + 1) + T] / T) - 1 - gI);
        excess.sort((a, b) => b - a);
        // persistence: the top quarter over years 1–5, and how many are in the top quarter over years 6–10
        const first = [], second = [];
        for (let j = 0; j < M; j++) { first.push([LJ[j * (Y + 1) + 5], j]); second.push([LJ[j * (Y + 1) + 10] - LJ[j * (Y + 1) + 5], j]); }
        first.sort((a, b) => b[0] - a[0]); second.sort((a, b) => b[0] - a[0]);
        const q = M / 4, topB = new Set(second.slice(0, q).map(x => x[1]));
        const kept = first.slice(0, q).filter(x => topB.has(x[1])).length;
        const p1 = kit.fin.ncdf((alpha - (ca - ci)) / te);
        ro.set('ahead', kit.pct(ahead[T - 1][1], 0) + ' of managers');
        ro.set('med', signedPct(kit, pctile(excess.slice().reverse(), 0.5), 2) + ' a year');
        ro.set('gap', signedPct(kit, alpha - (ca - ci), 2) + ' a year');
        ro.set('streak', streak + ' of ' + M + ' (luck alone: about ' + Math.round(M * Math.pow(p1, 5)) + ')');
        ro.set('persist', kept + ' of ' + q + ' (a coin would give about ' + Math.round(q / 4) + ')');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!ahead.length) return;
        const split = Math.round(W * 0.44);
        const A = { x: 48, y: 44, w: split - 48 - 18, h: Hh - 44 - 46 };
        const X = t => A.x + (t - 1) / (Y - 1) * A.w, Ys = v => A.y + A.h - v * A.h;
        yAxis(c, C, A, 0, 1, v => pc(v), 4);
        xAxis(c, C, A, 1, Y, v => String(Math.round(v)), 5);
        hline(c, A.x, A.x + A.w, Ys(0.5), C.faint);
        polyline(c, ahead.map(([t, v]) => [X(t), Ys(v)]), C.accent, 2.4);
        kit.dot(c, X(T), Ys(ahead[T - 1][1]), 5.5, C.accent, C.bg2);
        kit.label(c, 'managers ahead', A.x - 40, A.y - 28, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'of the index fund (simulated)', A.x - 40, A.y - 13, { size: 10.5, color: C.muted });
        kit.label(c, 'years held', A.x + A.w / 2, A.y + A.h + 30, { size: 11, color: C.muted, align: 'center' });

        const B = { x: split + 50, y: 44, w: W - split - 50 - 14, h: Hh - 44 - 46 };
        const mag = Math.max(0.01, Math.abs(excess[0]), Math.abs(excess[M - 1])) * 1.1;
        const Ye = v => B.y + B.h / 2 - v / mag * (B.h / 2);
        yAxis(c, C, B, -mag, mag, v => (v > 0 ? '+' : '') + pc(v, mag < 0.03 ? 1 : 0), 4);
        const bw = B.w / M;
        excess.forEach((v, j) => {
          const y0 = Ye(0), y1 = Ye(v);
          c.fillStyle = v > 0 ? C.ok : C.bad;
          c.fillRect(B.x + j * bw, Math.min(y0, y1), Math.max(0.8, bw * 0.9), Math.max(0.8, Math.abs(y1 - y0)));
        });
        hline(c, B.x, B.x + B.w, Ye(0), C.axis, [1, 0]);
        kit.label(c, 'each manager against the index', B.x - 44, B.y - 28, { size: 11.5, color: C.text, weight: 600 });
        kit.label(c, 'yearly return difference after ' + T + (T === 1 ? ' year' : ' years'), B.x - 44, B.y - 13, { size: 10.5, color: C.muted });
        kit.label(c, 'managers, best to worst', B.x + B.w / 2, B.y + B.h + 30, { size: 11, color: C.muted, align: 'center' });
      }
      draws(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
