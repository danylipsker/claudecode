/* HYPER-FINANCES · sims/mind-banking.js — simulations for Money and the Mind and for
 * Banks and Banking: a small cushion against surprise bills, a loss-aversion experiment on
 * yourself, anchoring with a jar of beans, present bias and the preference reversal, where
 * pay rises go (and automatic escalation), how a loan creates a deposit, a bank run, and
 * the long cost of small fees and exchange mark-ups. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // a reproducible stream of uniform numbers in [0, 1)
  const uniform = seed => (Hyper.util && Hyper.util.rng) ? Hyper.util.rng(seed >>> 0) : Math.random;

  // a value axis with gridlines, labelled on the left of a chart area
  function yAxis(c, C, x0, y0, w, h, lo, hi, fmt, n) {
    if (!(hi > lo)) return;
    const step = Hyper.niceStep(hi - lo, n || 5);
    if (!(step > 0)) return;
    c.save();
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-6; v += step) {
      const y = y0 + h - (v - lo) / (hi - lo) * h;
      const zero = Math.abs(v) < step * 1e-6;
      c.strokeStyle = zero ? C.axis : C.grid; c.lineWidth = 1;
      c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(fmt(zero ? 0 : v), x0 - 6, y);
    }
    c.restore();
  }
  // year ticks under a chart whose x runs from 0 to n years
  function xYears(kit, c, C, x0, y0, w, h, n, title) {
    const tick = n > 30 ? 10 : n > 12 ? 5 : n > 6 ? 2 : 1;
    c.save();
    c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
    for (let t = 0; t <= n + 1e-9; t += tick) c.fillText(String(t), x0 + t / n * w, y0 + h + 5);
    c.restore();
    kit.label(c, title || 'years', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
  }
  // a row of coloured keys; items: [colour, text, dashed?]
  function legend(kit, c, C, x, y, items) {
    c.save();
    c.font = '11.5px system-ui, sans-serif';
    let xx = x;
    for (const it of items) {
      if (it[2]) { c.strokeStyle = it[0]; c.lineWidth = 2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 14, y); c.stroke(); c.setLineDash([]); }
      else { c.fillStyle = it[0]; c.fillRect(xx, y - 5.5, 11, 11); }
      kit.label(c, it[1], xx + 18, y, { size: 11.5, color: C.text2 });
      xx += 18 + c.measureText(it[1]).width + 18;
    }
    c.restore();
  }
  function polyline(c, pts, col, width, dash) {
    if (pts.length < 2) return;
    c.save();
    c.strokeStyle = col; c.lineWidth = width || 2;
    if (dash) c.setLineDash(dash);
    c.beginPath();
    pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
    c.stroke();
    c.restore();
  }
  // text wrapped to a width; returns the y after the last line
  function wrap(kit, c, text, x, y, maxW, o) {
    o = o || {};
    const size = o.size || 12.5, lh = size * 1.35;
    c.save();
    c.font = (o.weight || 500) + ' ' + size + 'px system-ui, sans-serif';
    const words = String(text).split(' ');
    let lineTxt = '';
    const lines = [];
    for (const wd of words) {
      const test = lineTxt ? lineTxt + ' ' + wd : wd;
      if (c.measureText(test).width > maxW && lineTxt) { lines.push(lineTxt); lineTxt = wd; } else lineTxt = test;
    }
    if (lineTxt) lines.push(lineTxt);
    c.restore();
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh, { size, color: o.color, align: o.align, weight: o.weight }));
    return y + lines.length * lh;
  }
  const times = r => (r >= 10 ? r.toFixed(0) : r.toFixed(2).replace(/\.?0+$/, '')) + '×';

  /* ================================================================ a cushion against surprises */
  Hyper.sim('mb-cushion', {
    title: 'A small cushion against surprise bills',
    blurb: `Five years of one household, month by month. Now and then a surprise bill arrives: a repair, a dentist, a broken phone. The **green** bars are the cushion of savings; the **red** bars below the line are what had to go on a credit card at 24 % a year because the cushion was not enough. Each month the amount you set aside first pays down the card, then refills the cushion up to your target. The same surprises happen whatever you choose, so the comparison is fair.

- Surprises are only surprising one at a time: three ¤300 bills a year cost ¤75 a month on average. With the defaults, ¤50 is set aside, less than that, so the card debt keeps coming back. Count the months in debt and the interest.
- Raise the set-aside to ¤100, just above the average: the debt still appears, but it is paid off.
- Now also start with a ¤1,000 cushion: all or nearly all the bills are paid from savings, and the card is barely used.
- Press **Another five years** for a different run of luck. The lesson holds: set aside at least what surprises cost on average, and let a cushion absorb their timing.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'start', label: 'Cushion you start with', min: 0, max: 3000, step: 50, value: 0, fmt: m0 },
        { id: 'target', label: 'Cushion you aim to keep', min: 0, max: 5000, step: 100, value: 1000, fmt: m0 },
        { id: 'save', label: 'Set aside every month', min: 0, max: 400, step: 10, value: 50, fmt: m0 },
        { id: 'freq', label: 'Surprise bills a year', min: 0, max: 12, step: 1, value: 3 },
        { id: 'size', label: 'Typical surprise bill', min: 50, max: 2000, step: 50, value: 300, fmt: m0 },
        { type: 'buttons', items: [{ id: 'again', label: 'Another five years', primary: true }] }
      ], id => { if (id === 'again') { seed++; luck(); } solve(); loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Surprise bills'], ['abs', 'Paid from the cushion'], ['dm', 'Months with card debt'], ['int', 'Card interest paid'], ['max', 'Largest card debt']]);
      const V = ctl.values, M = 60, APR = 0.24;
      let seed = 4, us = [], zs = [], rows = [];

      function luck() {
        const u = uniform(seed * 7919 + 13), g = kit.fin.normals(seed * 104729 + 1);
        us = []; zs = [];
        for (let m = 0; m < M; m++) { us.push(u()); zs.push(g()); }
      }
      function solve() {
        let cushion = V.start, debt = 0, interest = 0, maxDebt = 0, debtMonths = 0, count = 0, absorbed = 0, total = 0;
        rows = [];
        for (let m = 0; m < M; m++) {
          const it = debt * APR / 12;
          debt += it; interest += it;
          const hit = us[m] < V.freq / 12;
          const s = hit ? Math.min(6, Math.exp(0.55 * zs[m] - 0.55 * 0.55 / 2)) * V.size : 0;
          if (hit) {
            count++; total += s;
            const use = Math.min(cushion, s);
            cushion -= use; debt += s - use;
            if (s - use < 0.005) absorbed++;
          }
          const pay = Math.min(debt, V.save);
          debt -= pay;
          cushion += Math.min(V.save - pay, Math.max(0, V.target - cushion));
          if (debt < 0.005) debt = 0;
          if (debt > 0) debtMonths++;
          maxDebt = Math.max(maxDebt, debt);
          rows.push({ m, cushion, debt, s });
        }
        ro.set('n', count + ' in five years, ' + kit.money(total, 0) + ' in all');
        ro.set('abs', count ? absorbed + ' of ' + count : 'none arrived');
        ro.set('dm', debtMonths + ' of 60');
        ro.set('int', kit.money(interest));
        ro.set('max', kit.money(maxDebt));
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, x0 = 66, y0 = 48, w = W - x0 - 16, h = Hh - y0 - 44;
        if (!rows.length || w < 40 || h < 40) return;
        const up = Math.max(100, V.target, V.start, ...rows.map(r => r.cushion)) * 1.12;
        const dn = Math.max(up * 0.3, ...rows.map(r => r.debt)) * 1.12;
        const Y = v => y0 + h - (v + dn) / (up + dn) * h;
        yAxis(c, C, x0, y0, w, h, -dn, up, v => kit.money(v, 0, true));
        const bw = w / M;
        for (let yr = 1; yr < 5; yr++) polyline(c, [[x0 + yr * 12 * bw, y0], [x0 + yr * 12 * bw, y0 + h]], C.grid, 1);
        if (V.target > 0) polyline(c, [[x0, Y(V.target)], [x0 + w, Y(V.target)]], C.ok, 1.3, [5, 4]);
        rows.forEach((r, j) => {
          const x = x0 + j * bw + bw * 0.15, wi = Math.max(1, bw * 0.7);
          if (r.cushion > 0) { c.fillStyle = C.ok; c.fillRect(x, Y(r.cushion), wi, Y(0) - Y(r.cushion)); }
          if (r.debt > 0) { c.fillStyle = C.bad; c.fillRect(x, Y(0), wi, Y(-r.debt) - Y(0)); }
          if (r.s > 0) {
            const s = clamp(3 + Math.sqrt(r.s / Math.max(1, V.size)) * 3, 3, 9), cx = x + wi / 2, ty = y0 - 3;
            c.fillStyle = C.warn;
            c.beginPath(); c.moveTo(cx - s, ty - s * 1.3); c.lineTo(cx + s, ty - s * 1.3); c.lineTo(cx, ty); c.closePath(); c.fill();
          }
        });
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let yr = 1; yr <= 5; yr++) c.fillText('year ' + yr, x0 + (yr - 0.5) * 12 * bw, y0 + h + 6);
        c.restore();
        legend(kit, c, C, x0, 14, [[C.ok, 'cushion'], [C.bad, 'on the credit card'], [C.warn, 'surprise bill'], [C.ok, 'target', true]]);
      }
      luck(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ loss aversion */
  Hyper.sim('mb-loss-aversion', {
    title: 'Would you take this bet?',
    blurb: `A fair coin is tossed once. Heads, you win the amount offered; tails, you lose the stake. Answer honestly: there is no right answer, and turning down a bet you could not afford to lose is sensible. After ten offers the sim estimates your **break-even**, how many times the possible loss a win has to be before you say yes.

- Every offer above 1× has a positive expected value, yet most people want the win to be around 1.5 to 2.5 times the loss.
- Change the stake to the smallest and the largest amount and answer again: the reluctance is usually weaker for small sums and stronger for large ones.
- The curve is the prospect-theory value function: losses (left) fall more steeply than gains rise. Move **λ** and **α** and watch the model's break-even move.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const RATIOS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4];
      const stakes = [10, 100, 1000, 10000];
      const answers = {}, orders = {}, rounds = {};
      const ctl = kit.controls(box.side, [
        { id: 'L', type: 'select', label: 'What you could lose', options: stakes.map(v => [kit.money(v, 0), v]), value: 100 },
        { type: 'buttons', items: [{ id: 'yes', label: 'Take the bet', primary: true }, { id: 'no', label: 'No thanks' }, { id: 'reset', label: 'Start again' }] },
        { id: 'lam', label: 'Model: loss aversion λ', min: 1, max: 4, step: 0.05, value: 2.25 },
        { id: 'alpha', label: 'Model: curvature α', min: 0.3, max: 1, step: 0.01, value: 0.88 }
      ], id => {
        const L = V.L, a = list(L);
        if ((id === 'yes' || id === 'no') && a.length < RATIOS.length) a.push({ ratio: order(L)[a.length], yes: id === 'yes' });
        if (id === 'reset') { answers[L] = []; rounds[L] = (rounds[L] || 0) + 1; orders[L] = null; }
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['bet', 'This bet'], ['ev', 'Expected value'], ['you', 'Your break-even'], ['lamY', 'Your λ (with this α)'], ['model', 'Model break-even']]);
      const V = ctl.values;
      function list(L) { return answers[L] || (answers[L] = []); }
      function order(L) {
        if (!orders[L]) {
          const u = uniform(L * 31 + 7 + 1000 * (rounds[L] || 0));
          orders[L] = RATIOS.map(r => [u(), r]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
        }
        return orders[L];
      }
      // the threshold that explains the answers best: accept at or above it, decline below
      function breakEven(a) {
        if (!a.length) return null;
        const cands = [...new Set(a.map(x => x.ratio))].sort((p, q) => p - q);
        let best = null;
        for (let j = 0; j <= cands.length; j++) {
          const lo = j ? cands[j - 1] : 0, hi = j < cands.length ? cands[j] : Infinity;
          const err = a.filter(x => (x.yes ? x.ratio <= lo : x.ratio >= hi)).length;
          if (!best || err < best.err) best = { lo, hi, err };
        }
        return best;
      }
      let be = null;
      function update() {
        const L = V.L, a = list(L), k = a.length, lam = V.lam, al = V.alpha;
        be = breakEven(a);
        if (k < RATIOS.length) {
          const G = order(L)[k] * L;
          ro.set('bet', 'win ' + kit.money(G, 0) + ' or lose ' + kit.money(L, 0));
          ro.set('ev', (G - L >= 0 ? '+' : '') + kit.money((G - L) / 2) + ' a toss');
        } else { ro.set('bet', 'all ten answered'); ro.set('ev', '—'); }
        if (!be) { ro.set('you', 'answer a few offers'); ro.set('lamY', '—'); }
        else if (be.lo === 0) { ro.set('you', 'below ' + times(be.hi) + ' the loss'); ro.set('lamY', 'about 1 or less'); }
        else if (!Number.isFinite(be.hi)) { ro.set('you', 'above ' + times(be.lo) + ' the loss'); ro.set('lamY', 'more than ' + Math.pow(be.lo, al).toFixed(1)); }
        else { const mid = (be.lo + be.hi) / 2; ro.set('you', 'between ' + times(be.lo) + ' and ' + times(be.hi)); ro.set('lamY', 'about ' + Math.pow(mid, al).toFixed(1)); }
        ro.set('model', times(Math.pow(lam, 1 / al)) + ' the loss');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, L = V.L, a = list(L), k = a.length, lam = V.lam, al = V.alpha;
        // the offer card
        const cw = Math.max(150, Math.min(260, W * 0.34)), cx = 16 + cw / 2;
        c.fillStyle = C.surface; c.strokeStyle = C.grid; c.lineWidth = 1;
        c.beginPath(); if (c.roundRect) c.roundRect(16, 16, cw, Hh - 32, 10); else c.rect(16, 16, cw, Hh - 32); c.fill(); c.stroke();
        if (k < RATIOS.length) {
          const G = order(L)[k] * L;
          kit.label(c, 'Offer ' + (k + 1) + ' of ' + RATIOS.length, cx, 38, { size: 12, color: C.muted, align: 'center' });
          kit.dot(c, cx, 88, 30, C.warn, C.text);
          kit.label(c, '½', cx, 88, { size: 22, color: C.bg2, align: 'center', weight: 700 });
          kit.label(c, 'Heads: win ' + kit.money(G, 0), cx, 140, { size: 15, color: C.ok, align: 'center', weight: 700 });
          kit.label(c, 'Tails: lose ' + kit.money(L, 0), cx, 166, { size: 15, color: C.bad, align: 'center', weight: 700 });
          wrap(kit, c, 'On average this bet pays ' + kit.money((G - L) / 2) + ' a toss. Would you take it once?', cx, 198, cw - 24, { size: 12, color: C.muted, align: 'center' });
        } else {
          kit.label(c, 'Done', cx, 40, { size: 15, color: C.text, align: 'center', weight: 700 });
          wrap(kit, c, 'You answered all ten offers at this stake. Your answers are on the curve. Change the stake, or press Start again.', cx, 70, cw - 24, { size: 12.5, color: C.text2, align: 'center' });
        }
        // the value function
        const x0 = 16 + cw + 52, y0 = 26, w = W - x0 - 18, h = Hh - y0 - 44;
        if (w < 60 || h < 60) return;
        const xmin = -1.25, xmax = 4.25;
        const v = r => (r >= 0 ? Math.pow(r, al) : -lam * Math.pow(-r, al));
        const ymin = v(xmin) * 1.08, ymax = Math.max(v(xmax), lam) * 1.1;
        const X = r => x0 + (r - xmin) / (xmax - xmin) * w, Y = y => y0 + h - (y - ymin) / (ymax - ymin) * h;
        yAxis(c, C, x0, y0, w, h, ymin, ymax, t => t.toFixed(1), 6);
        polyline(c, [[X(0), y0], [X(0), y0 + h]], C.axis, 1);
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (const r of [-1, 0, 1, 2, 3, 4]) c.fillText((r > 0 ? '+' : r < 0 ? '−' : '') + (r ? kit.money(Math.abs(r) * L, 0, true) : '0'), X(r), y0 + h + 5);
        c.restore();
        kit.label(c, 'loss or gain', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'how it feels', x0 - 44, y0 - 14, { size: 11.5, color: C.muted });
        // risk-neutral reference and the value curve
        polyline(c, [[X(xmin), Y(xmin)], [X(Math.min(xmax, ymax)), Y(Math.min(xmax, ymax))]], C.faint, 1.2, [2, 4]);
        const pts = [];
        for (let j = 0; j <= 240; j++) { const r = xmin + (xmax - xmin) * j / 240; pts.push([X(r), Y(v(r))]); }
        polyline(c, pts, C.accent, 2.6);
        // the pain of the loss, mirrored as a height a gain must reach
        polyline(c, [[X(0), Y(lam)], [X(xmax), Y(lam)]], C.bad, 1.3, [5, 4]);
        kit.label(c, 'pain of losing ' + kit.money(L, 0), X(xmax) - 4, Y(lam) - 10, { size: 11, color: C.bad, align: 'right' });
        polyline(c, [[X(-1), Y(0)], [X(-1), Y(v(-1))]], C.bad, 1.3, [2, 3]);
        const star = Math.pow(lam, 1 / al);
        if (star <= xmax) {
          polyline(c, [[X(star), Y(0)], [X(star), Y(lam)]], C.muted, 1.2, [3, 3]);
          kit.label(c, 'model: ' + times(star), X(star), Y(0) + 12, { size: 11, color: C.muted, align: 'center' });
        }
        if (be && be.lo > 0 && Number.isFinite(be.hi)) {
          const mid = (be.lo + be.hi) / 2;
          polyline(c, [[X(mid), y0 + 4], [X(mid), Y(v(mid))]], C.warn, 1.6, [6, 3]);
          kit.label(c, 'you: about ' + times(mid), X(mid), y0 + 4, { size: 11.5, color: C.warn, align: 'center', bg: C.bg2 });
        }
        a.forEach(x => kit.dot(c, X(x.ratio), Y(v(x.ratio)), 5.5, x.yes ? C.ok : C.bad, C.bg2));
        if (k < RATIOS.length) { const r = order(L)[k]; c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(X(r), Y(v(r)), 8.5, 0, Math.PI * 2); c.stroke(); }
        legend(kit, c, C, x0, Hh - 10, [[C.ok, 'took it'], [C.bad, 'declined']]);
      }
      update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ anchoring */
  Hyper.sim('mb-anchoring', {
    title: 'Anchors: guess the jar',
    blurb: `A jar full of beans, too many to count. Before you guess, you are asked whether there are more or fewer than some number, and that number is chosen at random: sometimes far too low, sometimes far too high. It carries no information at all. Set **Your estimate**, press **Submit**, then **Next jar**. After a few jars, compare your guesses after low and after high anchors.

- If the anchor pulls you, your guesses after high anchors sit above your guesses after low ones, although the jars are no different.
- Even the starting position of the estimate slider is an anchor. Move it well away before you think.
- Tick **Show a simulated crowd**: people whose guesses lean on the anchor by the chosen weight. Even a weight of 20–30 % splits the crowd in two, the pattern seen in the classic experiments.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'est', label: 'Your estimate', min: 20, max: 5000, value: 500, log: true, sig: 2, fmt: v => Hyper.util.group(v, 0) + ' beans' },
        { type: 'buttons', items: [{ id: 'submit', label: 'Submit my estimate', primary: true }, { id: 'next', label: 'Next jar' }] },
        { id: 'crowd', type: 'check', label: 'Show a simulated crowd', value: false },
        { id: 'w', label: 'Crowd: weight on the anchor', min: 0, max: 0.8, step: 0.05, value: 0.3, fmt: v => Math.round(v * 100) + ' %' }
      ], id => {
        if (id === 'submit' && !revealed) { rounds.push({ a: jar.A / jar.N, g: V.est / jar.N, low: jar.low }); revealed = true; }
        if (id === 'next') { jarNo++; newJar(); }
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['q', 'Anchor shown'], ['res', 'Last result'], ['lo', 'Your guesses after low anchors'], ['hi', 'Your guesses after high anchors'], ['crowd', 'Crowd medians (low / high)']]);
      const V = ctl.values;
      let jarNo = 1, jar = null, revealed = false;
      const rounds = [];
      const flip = uniform(20240601)() < 0.5;
      const round2 = x => { const p = Math.pow(10, Math.max(0, Math.floor(Math.log10(x)) - 1)); return Math.round(x / p) * p; };
      function newJar() {
        const u = uniform(jarNo * 9973 + 5);
        const N = Math.round(Math.exp(Math.log(150) + u() * Math.log(1200 / 150)));
        const low = ((jarNo % 2) === 0) === flip;
        const A = round2(N * (low ? 0.3 + 0.2 * u() : 2 + u()));
        const dots = [];
        for (let i = 0; i < N; i++) dots.push([u(), u(), Math.floor(u() * 4)]);
        jar = { N, A, low, dots };
        revealed = false;
      }
      const gmean = xs => Math.exp(xs.reduce((s, x) => s + Math.log(x), 0) / xs.length);
      // a crowd: own guesses spread around the truth, then pulled towards the anchor
      function crowd() {
        const g = kit.fin.normals(99), wgt = V.w, lo = [], hi = [];
        for (let i = 0; i < 400; i++) {
          const own = Math.exp(0.4 * g());
          const A = i % 2 ? 2.5 : 0.4;
          const e = Math.exp(wgt * Math.log(A) + (1 - wgt) * Math.log(own));
          (i % 2 ? hi : lo).push(e);
        }
        const med = xs => { const s = xs.slice().sort((p, q) => p - q); return s[Math.floor(s.length / 2)]; };
        return { lo, hi, mlo: med(lo), mhi: med(hi) };
      }
      let cr = null;
      function update() {
        ro.set('q', 'more or less than ' + Hyper.util.group(jar.A, 0) + '?');
        const last = rounds[rounds.length - 1];
        ro.set('res', revealed && last ? 'truth ' + Hyper.util.group(jar.N, 0) + ', you were ' + times(last.g) : rounds.length ? 'guess, then submit' : 'no guesses yet');
        const L = rounds.filter(r => r.low), Hi = rounds.filter(r => !r.low);
        ro.set('lo', L.length ? times(gmean(L.map(r => r.g))) + ' the truth (' + L.length + ')' : '—');
        ro.set('hi', Hi.length ? times(gmean(Hi.map(r => r.g))) + ' the truth (' + Hi.length + ')' : '—');
        cr = crowd();
        ro.set('crowd', times(cr.mlo) + ' / ' + times(cr.mhi));
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        // the jar
        const jw = Math.max(150, Math.min(W * 0.4, 320)), jx = 20, jy = 64, jh = Hh - jy - 20;
        kit.label(c, 'Jar ' + jarNo + ': more or fewer than ' + Hyper.util.group(jar.A, 0) + ' beans?', jx, 16, { size: 13, color: C.text, weight: 700 });
        kit.label(c, revealed ? 'There are ' + Hyper.util.group(jar.N, 0) + '. You said ' + Hyper.util.group(V.est, 0) + '.' : 'Look, estimate, then submit.', jx, 38, { size: 12, color: revealed ? C.warn : C.muted });
        c.fillStyle = C.surface; c.strokeStyle = C.text2; c.lineWidth = 2;
        c.beginPath(); if (c.roundRect) c.roundRect(jx, jy + 12, jw, jh - 12, 18); else c.rect(jx, jy + 12, jw, jh - 12); c.fill(); c.stroke();
        c.fillStyle = C.muted; c.fillRect(jx + jw * 0.18, jy, jw * 0.64, 12);
        const cols = [C.warn, C.bad, C.series[1], C.ok];
        const bx = jx + 8, by = jy + 22, bwid = jw - 16, bh = jh - 34;
        const r = clamp(Math.sqrt(bwid * bh / Math.max(1, jar.N)) * 0.32, 1.4, 3.2);
        for (const d of jar.dots) { c.fillStyle = cols[d[2]]; c.beginPath(); c.arc(bx + d[0] * bwid, by + d[1] * bh, r, 0, Math.PI * 2); c.fill(); }
        // the chart: your rounds, or the crowd
        const x0 = jx + jw + 58, y0 = 48, w = W - x0 - 18, h = Hh - y0 - 44;
        if (w < 80 || h < 60) return;
        const LO = 0.2, HI = 5, lg = v => Math.log(v / LO) / Math.log(HI / LO);
        const ticks = [0.25, 0.5, 1, 2, 4];
        if (V.crowd) {
          const X = v => x0 + clamp(lg(v), 0, 1) * w;
          const bins = 30, hl = new Array(bins).fill(0), hh = new Array(bins).fill(0);
          const bin = v => clamp(Math.floor(lg(v) * bins), 0, bins - 1);
          cr.lo.forEach(v => hl[bin(v)]++); cr.hi.forEach(v => hh[bin(v)]++);
          const mx = Math.max(1, ...hl, ...hh);
          c.save(); c.globalAlpha = 0.7;
          for (let j = 0; j < bins; j++) {
            const xa = x0 + j / bins * w, bw2 = w / bins * 0.9;
            c.fillStyle = C.series[0]; c.fillRect(xa, y0 + h - hl[j] / mx * h, bw2, hl[j] / mx * h);
            c.fillStyle = C.series[1]; c.fillRect(xa, y0 + h - hh[j] / mx * h, bw2, hh[j] / mx * h);
          }
          c.restore();
          polyline(c, [[x0, y0 + h], [x0 + w, y0 + h]], C.axis, 1);
          polyline(c, [[X(1), y0], [X(1), y0 + h]], C.ok, 1.5, [5, 4]);
          kit.label(c, 'truth', X(1) + 4, y0 + 6, { size: 11, color: C.ok });
          for (const [m, col, t] of [[cr.mlo, C.series[0], 'low anchor'], [cr.mhi, C.series[1], 'high anchor']]) {
            polyline(c, [[X(m), y0 + 16], [X(m), y0 + h]], col, 2);
            kit.label(c, t + ': ' + times(m), X(m), y0 + 18 + (col === C.series[1] ? 16 : 0), { size: 11, color: col, align: 'center', bg: C.bg2 });
          }
          c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
          for (const t of ticks) c.fillText(times(t), X(t), y0 + h + 5);
          c.restore();
          kit.label(c, 'estimate ÷ true number (400 simulated people)', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
        } else {
          const X = v => x0 + clamp(lg(v), 0, 1) * w, Y = v => y0 + h - clamp(lg(v), 0, 1) * h;
          c.save(); c.font = FONT; c.fillStyle = C.muted;
          for (const t of ticks) {
            polyline(c, [[X(t), y0], [X(t), y0 + h]], C.grid, 1);
            polyline(c, [[x0, Y(t)], [x0 + w, Y(t)]], C.grid, 1);
            c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(times(t), X(t), y0 + h + 5);
            c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(times(t), x0 - 6, Y(t));
          }
          c.restore();
          polyline(c, [[x0, Y(1)], [x0 + w, Y(1)]], C.ok, 1.5, [5, 4]);
          kit.label(c, 'truth', x0 + w - 4, Y(1) - 10, { size: 11, color: C.ok, align: 'right' });
          polyline(c, [[X(LO), Y(LO)], [X(HI), Y(HI)]], C.faint, 1.2, [2, 4]);
          kit.label(c, 'guess = anchor', X(3.2), Y(3.2) + 14, { size: 11, color: C.faint, align: 'center' });
          kit.label(c, 'your guess ÷ truth', x0 - 48, y0 - 12, { size: 11.5, color: C.muted });
          kit.label(c, 'anchor ÷ truth', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
          if (!rounds.length) kit.label(c, 'Your guesses will appear here.', x0 + w / 2, y0 + h * 0.3, { size: 12.5, color: C.muted, align: 'center' });
          rounds.forEach(r => kit.dot(c, X(r.a), Y(r.g), 5.5, r.low ? C.series[0] : C.series[1], C.bg2));
          const L = rounds.filter(r => r.low), Hi = rounds.filter(r => !r.low);
          if (L.length) polyline(c, [[x0, Y(gmean(L.map(r => r.g)))], [X(1), Y(gmean(L.map(r => r.g)))]], C.series[0], 2, [6, 3]);
          if (Hi.length) polyline(c, [[X(1), Y(gmean(Hi.map(r => r.g)))], [x0 + w, Y(gmean(Hi.map(r => r.g)))]], C.series[1], 2, [6, 3]);
        }
        legend(kit, c, C, x0, 16, [[C.series[0], 'after a low anchor'], [C.series[1], 'after a high anchor']]);
      }
      newJar(); update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ present bias */
  const fmtMonths = v => (v <= 0 ? 'now' : v < 1 ? Math.round(v * 4) + (Math.round(v * 4) === 1 ? ' week' : ' weeks') : (Number.isInteger(v) ? v : v.toFixed(1)) + (v === 1 ? ' month' : ' months'));
  Hyper.sim('mb-present-bias', {
    title: 'Now or later: the preference reversal',
    blurb: `Two rewards: a smaller one sooner and a larger one a little later. The curves show how much each is **felt** to be worth when seen from each moment before it arrives: far away, both look small; close up, they loom. Drag **The smaller one is this far away** to move "you are here".

- With the hyperbolic curve and the defaults, from months away you would wait for ¤110; when ¤100 is on offer today, it wins. The curves cross: that is the reversal.
- Switch to **Exponential**: the curves never cross. Whatever you prefer from afar, you still prefer up close. This is the patient, consistent chooser of textbook economics.
- **Quasi-hyperbolic** keeps exponential patience for the future but discounts everything that is not *now* by β: the preference flips only at the last moment.
- Raise the larger reward until even the impatient chooser waits.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'How the future is discounted', options: [['Hyperbolic (like most people)', 'hyp'], ['Exponential (steady)', 'exp'], ['Quasi-hyperbolic (β–δ)', 'qh']], value: params.model || 'hyp' },
        { id: 'A1', label: 'Smaller, sooner', min: 10, max: 500, step: 5, value: 100, fmt: m0 },
        { id: 'A2', label: 'Larger, later', min: 10, max: 1000, step: 5, value: 110, fmt: m0 },
        { id: 'gap', label: 'Extra wait for the larger', min: 0.25, max: 24, step: 0.25, value: 1, fmt: fmtMonths },
        { id: 'front', label: 'The smaller one is this far away', min: 0, max: 36, step: 0.5, value: 0, fmt: fmtMonths },
        { id: 'k', label: 'Impatience k (per year)', min: 0.1, max: 10, value: 2, log: true, sig: 2 },
        { id: 'r', label: 'Discount rate (per year)', min: 1, max: 300, step: 1, value: 30, unit: '%' },
        { id: 'beta', label: 'Present bias β', min: 0.4, max: 1, step: 0.01, value: 0.7 }
      ], () => { showCtl(); update(); loop.once(); });
      const ro = kit.readout(box.side, [['here', 'Seen from “you are here”'], ['vals', 'Felt values'], ['flip', 'The choice flips'], ['rate', 'Waiting earns']]);
      const V = ctl.values, SPAN = 36;
      function showCtl() { ctl.show('k', V.model === 'hyp'); ctl.show('r', V.model !== 'hyp'); ctl.show('beta', V.model === 'qh'); }
      // the felt value of one unit of money s years away
      function D(s) {
        if (s <= 1e-9) return 1;
        if (V.model === 'hyp') return 1 / (1 + V.k * s);
        const e = Math.pow(1 + V.r / 100, -s);
        return V.model === 'qh' ? V.beta * e : e;
      }
      // tau: months from the left edge; the smaller reward arrives at SPAN, the larger at SPAN + gap
      const v1 = tau => V.A1 * D((SPAN - tau) / 12), v2 = tau => V.A2 * D((SPAN + V.gap - tau) / 12);
      function flipPoint() {
        if (V.A2 <= V.A1) return { text: 'never: the later one is not larger' };
        if (V.model === 'hyp') {
          const t = V.A1 * (V.gap / 12) / (V.A2 - V.A1) - 1 / V.k;   // years before the smaller reward
          return t <= 0 ? { text: 'never: you always wait' } : { tau: SPAN - t * 12, text: 'when the smaller one is ' + (t * 12 < 1 ? fmtMonths(Math.max(0.25, Math.round(t * 48) / 4)) : (t * 12).toFixed(1) + ' months') + ' away' };
        }
        const d0 = v1(SPAN) - v2(SPAN), dfar = v1(0) - v2(0);
        if (V.model === 'exp') return d0 > 0 ? { text: 'never: you always take the sooner' } : { text: 'never: you always wait' };
        if (dfar > 0) return { text: 'never: you always take the sooner' };
        return d0 > 0 ? { tau: SPAN, text: 'only when the smaller one is here, now' } : { text: 'never: you always wait' };
      }
      function update() {
        const tau = SPAN - V.front, a = v1(tau), b = v2(tau);
        ro.set('here', a > b ? 'take ' + kit.money(V.A1, 0) + ' sooner' : 'wait for ' + kit.money(V.A2, 0));
        ro.set('vals', kit.money(a) + ' against ' + kit.money(b));
        ro.set('flip', flipPoint().text);
        ro.set('rate', V.A2 > V.A1 ? kit.pct(Math.min(1e6, Math.pow(V.A2 / V.A1, 12 / V.gap) - 1), 0) + ' a year' : 'nothing');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, x0 = 62, y0 = 36, w = W - x0 - 20, h = Hh - y0 - 50;
        if (w < 60 || h < 60) return;
        const tmax = SPAN + V.gap, ymax = Math.max(V.A1, V.A2) * 1.12;
        const X = tau => x0 + tau / tmax * w, Y = v => y0 + h - v / ymax * h;
        yAxis(c, C, x0, y0, w, h, 0, ymax, v => kit.money(v, 0, true));
        // months-before ticks
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let m = 0; m <= SPAN; m += 6) c.fillText(String(m), X(SPAN - m), y0 + h + 5);
        c.restore();
        kit.label(c, 'months before the smaller reward', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
        const p1 = [], p2 = [];
        for (let j = 0; j <= 400; j++) {
          const t1 = SPAN * j / 400; p1.push([X(t1), Y(v1(Math.min(t1, SPAN - 1e-6)))]);
          const t2 = tmax * j / 400; p2.push([X(t2), Y(v2(Math.min(t2, tmax - 1e-6)))]);
        }
        polyline(c, p1, C.series[1], 2.4);
        polyline(c, p2, C.series[0], 2.4);
        // the rewards themselves
        c.fillStyle = C.series[1]; c.fillRect(X(SPAN) - 4, Y(V.A1), 8, Y(0) - Y(V.A1));
        c.fillStyle = C.series[0]; c.fillRect(X(tmax) - 4, Y(V.A2), 8, Y(0) - Y(V.A2));
        kit.label(c, kit.money(V.A1, 0), X(SPAN), Y(V.A1) - 10, { size: 11.5, color: C.series[1], align: 'right' });
        kit.label(c, kit.money(V.A2, 0), X(tmax), Y(V.A2) - 10, { size: 11.5, color: C.series[0], align: 'right' });
        const fp = flipPoint();
        if (fp.tau != null && fp.tau >= 0) {
          const yy = Y(v2(fp.tau));
          kit.dot(c, X(fp.tau), yy, 5, C.warn, C.bg2);
          kit.label(c, 'the choice flips', X(fp.tau) - 8, yy - 14, { size: 11.5, color: C.warn, align: 'right' });
        }
        // you are here
        const tau = SPAN - V.front;
        polyline(c, [[X(tau), y0], [X(tau), y0 + h]], C.text, 1.4, [4, 3]);
        kit.label(c, 'you are here', X(tau) + (tau > tmax * 0.8 ? -6 : 6), y0 + 8, { size: 11.5, color: C.text, align: tau > tmax * 0.8 ? 'right' : 'left', bg: C.bg2 });
        kit.dot(c, X(tau), Y(v1(tau)), 4.5, C.series[1], C.bg2);
        kit.dot(c, X(tau), Y(v2(tau)), 4.5, C.series[0], C.bg2);
        legend(kit, c, C, x0, 14, [[C.series[1], 'felt value of the smaller, sooner'], [C.series[0], 'felt value of the larger, later']]);
      }
      showCtl(); update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ raises: lifestyle inflation and escalation */
  Hyper.sim('mb-raises', {
    title: 'Where do your pay rises go?',
    blurb: `A working life in today's money: pay rises a little every year above inflation. Path **A** and path **B** earn exactly the same; they differ only in what happens to each rise. The top chart is the savings pot, the bottom one what is left to spend each year.

- **Spend raises or save part** (A spends every rise, B saves the chosen share of each one): with the defaults B ends with nearly three times the pot, and because B got used to a lower level of spending, that pot covers nearly four times as many years of it.
- Set the share saved to 100 % and then to 20 %: even a small share of each rise adds up, because it is taken before it is ever spent.
- **Automatic escalation** (A saves a fixed rate, B raises its rate a little every year until a cap): as long as each step is smaller than the pay rise, take-home pay after saving never falls.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const mode0 = params.mode === 'escalate' ? 'escalate' : 'lifestyle';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Compare', options: [['Spend raises or save part', 'lifestyle'], ['Automatic escalation', 'escalate']], value: mode0 },
        { id: 'I0', label: 'Take-home pay at the start (a year)', min: 10000, max: 200000, value: mode0 === 'escalate' ? 36000 : 40000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'g', label: 'Pay rise per year, above inflation', min: 0, max: 5, step: 0.1, value: 2, unit: '%' },
        { id: 'N', label: 'Working years', min: 10, max: 45, step: 1, value: 40 },
        { id: 'r', label: 'Return on savings, above inflation', min: 0, max: 8, step: 0.1, value: 4, unit: '%' },
        { id: 's0', label: 'Saving rate at the start', min: 0, max: 30, step: 0.5, value: mode0 === 'escalate' ? 3 : 10, unit: '%' },
        { id: 'f', label: 'B saves this share of each rise', min: 0, max: 100, step: 5, value: 50, unit: '%' },
        { id: 'step', label: 'B raises its rate each year by', min: 0, max: 3, step: 0.25, value: 1, fmt: v => (+v.toFixed(2)) + (v === 1 ? ' point' : ' points') },
        { id: 'cap', label: 'B stops raising at', min: 5, max: 40, step: 1, value: 15, unit: '%' }
      ], () => { showCtl(); solve(); loop.once(); });
      const ro = kit.readout(box.side, [['a', 'Pot at the end, A'], ['b', 'Pot at the end, B'], ['rate', 'Saving rate at the end (A / B)'], ['spend', 'Spending in the last year (A / B)'], ['cover', 'Years of that spending the pot covers'], ['dip', 'Does B\'s spending ever fall?']]);
      const V = ctl.values;
      let rows = [];
      function showCtl() { const e = V.mode === 'escalate'; ctl.show('f', !e); ctl.show('step', e); ctl.show('cap', e); }
      function solve() {
        const N = Math.round(V.N), g = V.g / 100, r = V.r / 100, s0 = V.s0 / 100, f = V.f / 100;
        const esc = V.mode === 'escalate';
        let wa = 0, wb = 0, dip = 0, prev = null;
        rows = [{ t: 0, wa: 0, wb: 0 }];
        for (let t = 0; t < N; t++) {
          const I = V.I0 * Math.pow(1 + g, t);
          let sa, sb;
          if (esc) { sa = s0 * I; sb = Math.min(s0 + V.step / 100 * t, Math.max(V.cap / 100, s0)) * I; }
          else { sa = s0 * V.I0; sb = s0 * V.I0 + f * (I - V.I0); }
          wa = wa * (1 + r) + sa; wb = wb * (1 + r) + sb;
          const spB = I - sb;
          if (prev != null && spB < prev - 0.01 && !dip) dip = t + 1;
          prev = spB;
          rows.push({ t: t + 1, I, sa, sb, spA: I - sa, spB, wa, wb });
        }
        const L = rows[rows.length - 1];
        ro.set('a', kit.money(L.wa, 0));
        ro.set('b', kit.money(L.wb, 0) + (L.wa > 0 ? ' (' + (L.wb / L.wa).toFixed(1) + '× A)' : ''));
        ro.set('rate', kit.pct(L.sa / L.I, 1) + ' / ' + kit.pct(L.sb / L.I, 1));
        ro.set('spend', kit.money(L.spA, 0) + ' / ' + kit.money(L.spB, 0));
        ro.set('cover', (L.spA > 0 ? (L.wa / L.spA).toFixed(1) : '∞') + ' / ' + (L.spB > 0 ? (L.wb / L.spB).toFixed(1) : '∞') + ' years');
        ro.set('dip', dip ? 'yes, in year ' + dip : 'never');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, x0 = 70, w = W - x0 - 18;
        if (rows.length < 2 || w < 60) return;
        const N = rows.length - 1;
        const y1 = 40, h1 = (Hh - 40 - 70) * 0.58, y2 = y1 + h1 + 36, h2 = Hh - y2 - 40;
        if (h1 < 30 || h2 < 30) return;
        const X = t => x0 + t / N * w;
        // savings pots
        const wmax = Math.max(1, ...rows.map(q => Math.max(q.wa, q.wb))) * 1.08;
        yAxis(c, C, x0, y1, w, h1, 0, wmax, v => kit.money(v, 0, true), 4);
        polyline(c, rows.map(q => [X(q.t), y1 + h1 - q.wa / wmax * h1]), C.warn, 2.4);
        polyline(c, rows.map(q => [X(q.t), y1 + h1 - q.wb / wmax * h1]), C.ok, 2.4);
        kit.label(c, 'savings pot', x0, y1 - 12, { size: 11.5, color: C.muted });
        // spending per year
        const q1 = rows.slice(1);
        const smax = Math.max(...q1.map(q => q.I)) * 1.08;
        const smin = Math.min(...q1.map(q => Math.min(q.spA, q.spB))) * 0.8;
        const Y2 = v => y2 + h2 - (v - smin) / (smax - smin) * h2;
        yAxis(c, C, x0, y2, w, h2, smin, smax, v => kit.money(v, 0, true), 3);
        polyline(c, q1.map(q => [X(q.t), Y2(q.I)]), C.muted, 1.6, [4, 3]);
        polyline(c, q1.map(q => [X(q.t), Y2(q.spA)]), C.warn, 2);
        polyline(c, q1.map(q => [X(q.t), Y2(q.spB)]), C.ok, 2);
        kit.label(c, 'spending each year (after saving)', x0, y2 - 12, { size: 11.5, color: C.muted });
        xYears(kit, c, C, x0, y2, w, h2, N, 'years of work');
        const esc = V.mode === 'escalate';
        legend(kit, c, C, x0 + 110, 14, [[C.warn, esc ? 'A: fixed saving rate' : 'A: spends every rise'], [C.ok, esc ? 'B: escalating rate' : 'B: saves part of each rise'], [C.muted, 'pay', true]]);
      }
      showCtl(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ money creation */
  Hyper.sim('mb-money-creation', {
    title: 'Loans create deposits',
    blurb: `**Step by step:** two banks, drawn as balance sheets (what they own on the left, what they owe on the right, and the two sides always equal). Ana banks at A, Ben at B. Press the buttons in order and watch which numbers change.

- **Bank A lends to Ana**: a loan appears on A's assets and a deposit in Ana's account. No one else has less: new money now exists.
- **Ana pays Ben**: the deposit moves to Bank B, and A must hand B the same amount of central-bank reserves. If A runs short, it borrows reserves.
- **Ana repays her loan**: the loan and the deposit disappear together, and the money is destroyed.

**Textbook multiplier:** the classroom story of deposits lent out and re-deposited round after round. Change the reserve ratio and the share people keep as cash and watch the total converge to the multiplier. It is a useful exercise in [[math:geometric-series|geometric series]], but real banks are limited mainly by profitable borrowers, capital rules and the central bank's interest rate, not by a fixed multiple of reserves.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Step by step: two banks', 'steps'], ['Textbook multiplier', 'multiplier']], value: params.mode === 'multiplier' ? 'multiplier' : 'steps' },
        { id: 'amt', label: 'Loan to Ana', min: 1000, max: 20000, step: 500, value: 10000, fmt: m0 },
        { type: 'buttons', items: [{ id: 'lend', label: 'Bank A lends to Ana', primary: true }, { id: 'pay', label: 'Ana pays Ben' }, { id: 'earn', label: 'Ben pays Ana' }, { id: 'repay', label: 'Ana repays her loan' }, { id: 'reset', label: 'Reset' }] },
        { id: 'B', label: 'New reserves put in', min: 100, max: 10000, step: 100, value: 1000, fmt: m0 },
        { id: 'rr', label: 'Reserve ratio', min: 1, max: 50, step: 1, value: 10, unit: '%' },
        { id: 'c', label: 'Cash the public keeps (share of deposits)', min: 0, max: 50, step: 1, value: 0, unit: '%' },
        { id: 'n', label: 'Rounds of lending', min: 1, max: 40, step: 1, value: 20 }
      ], id => {
        if (id === 'lend') lend(); else if (id === 'pay') pay(); else if (id === 'earn') earn(); else if (id === 'repay') repay(); else if (id === 'reset') reset();
        showCtl(); update(); loop.once();
      });
      const ro = kit.readout(box.side, [['money', 'Money (all deposits)'], ['res', 'Reserves held by banks'], ['ana', 'Ana: account / loan'], ['mult', 'Multiplier'], ['tot', 'Money after these rounds'], ['lim', 'Limit']]);
      const V = ctl.values;
      // the step-by-step world
      let A, Bk, ana, ben, anaLoan, msg, delta, before = null;
      const moneyTxt = v => kit.money(v, 0);
      function reset() {
        A = { res: 3000, loans: 27000, dep: 27000, cb: 0, eq: 3000 };
        Bk = { res: 3000, loans: 27000, dep: 27000, cb: 0, eq: 3000 };
        ana = 0; ben = 0; anaLoan = 0; delta = {};
        msg = 'Two banks, each holding ' + moneyTxt(27000) + ' of its customers\' deposits. Press “Bank A lends to Ana”.';
      }
      // what changed in each balance sheet since snap()
      function snap() { before = { A: Object.assign({}, A), B: Object.assign({}, Bk) }; }
      function diff() {
        delta = {};
        for (const [k, now] of [['A', A], ['B', Bk]]) {
          const d = {};
          for (const key of Object.keys(now)) if (Math.abs(now[key] - before[k][key]) > 0.5) d[key] = now[key] - before[k][key];
          delta[k] = d;
        }
      }
      function settle(from, to, x) {           // reserves move between banks; a bank short of reserves borrows them
        from.res -= x;
        if (from.res < 0) { from.cb += -from.res; from.res = 0; }
        to.res += x;
        if (to.cb > 0) { const back = Math.min(to.cb, to.res); to.cb -= back; to.res -= back; }
      }
      function lend() {
        const x = V.amt;
        snap();
        A.loans += x; A.dep += x; ana += x; anaLoan += x;
        diff();
        msg = 'Bank A typed ' + moneyTxt(x) + ' into Ana\'s account and recorded her promise to repay as an asset. Deposits are money, so money grew by ' + moneyTxt(x) + ', and nobody else has less.';
      }
      function pay() {
        const x = ana;
        if (x <= 0) { msg = 'Ana has nothing in her account to pay with yet. Lend to her first, or let Ben pay her.'; delta = {}; return; }
        snap();
        ana -= x; A.dep -= x; ben += x; Bk.dep += x;
        settle(A, Bk, x);
        diff();
        const borrowed = A.cb - before.A.cb;
        msg = 'Ana paid Ben ' + moneyTxt(x) + '. Her deposit at A became his deposit at B, so the total of money did not change, but Bank A had to transfer ' + moneyTxt(x) + ' of reserves to Bank B' + (borrowed > 0.5 ? ', borrowing ' + moneyTxt(borrowed) + ' of them from the central bank because it was short.' : '.');
      }
      function earn() {
        const x = Math.min(ben, Math.max(anaLoan - ana, 0));
        if (x <= 0) { msg = ben <= 0 ? 'Ben has nothing to pay with yet: let Ana pay him first.' : 'Ana already has enough to repay her loan.'; delta = {}; return; }
        snap();
        ben -= x; Bk.dep -= x; ana += x; A.dep += x;
        settle(Bk, A, x);
        diff();
        msg = 'Ben bought ' + moneyTxt(x) + ' of Ana\'s work. The deposit moved back to Bank A and the reserves with it' + (before.A.cb > A.cb + 0.5 ? ', and A used them to repay its central-bank borrowing.' : '.') + ' Ana can now repay her loan.';
      }
      function repay() {
        const x = Math.min(ana, anaLoan);
        if (x <= 0) { msg = anaLoan <= 0 ? 'Ana has no loan to repay.' : 'Ana has no money in her account to repay with: let Ben pay her first.'; delta = {}; return; }
        snap();
        ana -= x; anaLoan -= x; A.dep -= x; A.loans -= x;
        diff();
        msg = 'Ana repaid ' + moneyTxt(x) + '. The loan and her deposit cancelled out: that money no longer exists. Repaying loans destroys money just as lending creates it.';
      }
      function showCtl() {
        const s = V.mode === 'steps';
        for (const id of ['amt', 'lend', 'pay', 'earn', 'repay', 'reset']) ctl.show(id, s);
        for (const id of ['B', 'rr', 'c', 'n']) ctl.show(id, !s);
        for (const k of ['money', 'res', 'ana']) ro.show(k, s);
        for (const k of ['mult', 'tot', 'lim']) ro.show(k, !s);
      }
      // the textbook multiplier: each round a share rr is kept as reserves, the public keeps c per unit of deposits as cash
      function multiplier() {
        const rr = V.rr / 100, c = V.c / 100, q = (1 - rr) / (1 + c), n = Math.round(V.n);
        const out = [];
        let dep = V.B / (1 + c), total = 0;
        for (let j = 0; j < n; j++) { const cash = c * dep; total += dep + cash; out.push({ j, dep, cash, total }); dep *= q; }
        return { out, total, limit: V.B * (1 + c) / (rr + c), m: (1 + c) / (rr + c) };
      }
      function update() {
        if (V.mode === 'steps') {
          ro.set('money', kit.money(A.dep + Bk.dep, 0));
          ro.set('res', kit.money(A.res + Bk.res, 0) + (A.cb + Bk.cb > 0 ? ' (' + kit.money(A.cb + Bk.cb, 0) + ' borrowed)' : ''));
          ro.set('ana', kit.money(ana, 0) + ' / ' + kit.money(anaLoan, 0));
        } else {
          const M = multiplier();
          ro.set('mult', M.m.toFixed(2) + '×');
          ro.set('tot', kit.money(M.total, 0));
          ro.set('lim', kit.money(M.limit, 0) + ' (' + kit.pct(M.total / M.limit, 0) + ' reached)');
        }
      }
      function drawBank(c, C, bank, name, d, x, y, w, h, scale) {
        kit.label(c, name, x + w / 2, y - 14, { size: 13, color: C.text, align: 'center', weight: 700 });
        const colW = w * 0.42, gap = w - 2 * colW;
        const sides = [
          [x, 'owns', [['reserves', bank.res, C.accent, 'res'], ['loans', bank.loans, C.series[1], 'loans']]],
          [x + colW + gap, 'owes', [['deposits', bank.dep, C.ok, 'dep'], ['central bank', bank.cb, C.warn, 'cb'], ['capital', bank.eq, C.muted, 'eq']]]
        ];
        for (const [sx, title, items] of sides) {
          kit.label(c, title, sx + colW / 2, y + h + 12, { size: 11.5, color: C.muted, align: 'center' });
          let yy = y + h;
          for (const [lab, v, col, key] of items) {
            if (v <= 0) continue;
            const hh = v / scale * h, dv = d && d[key];
            c.fillStyle = col; c.fillRect(sx, yy - hh, colW, hh);
            c.strokeStyle = dv ? C.text : C.bg2; c.lineWidth = dv ? 2.5 : 1; c.strokeRect(sx, yy - hh, colW, hh);
            const dTxt = dv ? (dv > 0 ? '+' : '−') + kit.money(Math.abs(dv), 0) : '';
            if (hh > 26) {
              const three = dv && hh > 44;
              kit.label(c, lab, sx + colW / 2, yy - hh / 2 - (three ? 14 : 7), { size: 11, color: C.bg2, align: 'center', weight: 700 });
              kit.label(c, kit.money(v, 0), sx + colW / 2, yy - hh / 2 + (three ? 0 : 7), { size: 11, color: C.bg2, align: 'center' });
              if (three) kit.label(c, dTxt, sx + colW / 2, yy - hh / 2 + 14, { size: 11, color: C.bg2, align: 'center', weight: 700 });
            } else if (hh > 12) kit.label(c, lab + ' ' + (dv ? dTxt : kit.money(v, 0, true)), sx + colW / 2, yy - hh / 2, { size: 10.5, color: C.bg2, align: 'center' });
            yy -= hh;
          }
        }
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (V.mode === 'steps') {
          const top = 40, msgH = 58, h = Hh - top - msgH - 30;
          const pw = Math.max(120, W * 0.22), bw = (W - pw - 60) / 2;
          if (bw < 80 || h < 60) return;
          const scale = Math.max(A.res + A.loans, Bk.res + Bk.loans, 1) * 1.05;
          drawBank(c, C, A, 'Bank A', delta.A, 20, top, bw, h, scale);
          drawBank(c, C, Bk, 'Bank B', delta.B, 20 + bw + 20, top, bw, h, scale);
          // the people
          const px = W - pw - 8;
          c.fillStyle = C.surface; c.strokeStyle = C.grid; c.lineWidth = 1;
          c.beginPath(); if (c.roundRect) c.roundRect(px, top - 26, pw, h + 40, 8); else c.rect(px, top - 26, pw, h + 40); c.fill(); c.stroke();
          let yy = top - 6;
          const row = (t, v, col) => { kit.label(c, t, px + 10, yy, { size: 11.5, color: C.muted }); kit.label(c, kit.money(v, 0), px + pw - 10, yy + 16, { size: 13, color: col, align: 'right', weight: 700 }); yy += 40; };
          row('Ana\'s account at A', ana, C.ok);
          row('Ana owes Bank A', anaLoan, C.series[1]);
          row('Ben\'s account at B', ben, C.ok);
          row('All money (deposits)', A.dep + Bk.dep, C.accent);
          wrap(kit, c, msg, 20, Hh - msgH - 4, W - 40, { size: 12.5, color: C.text2 });
        } else {
          const M = multiplier();
          const x0 = 70, y0 = 36, w = W - x0 - 20, h = Hh - y0 - 50;
          if (w < 60 || h < 60 || !M.out.length) return;
          const n = M.out.length, ymax = Math.max(M.limit, V.B) * 1.08;
          const Y = v => y0 + h - v / ymax * h, bw = w / n;
          yAxis(c, C, x0, y0, w, h, 0, ymax, v => kit.money(v, 0, true));
          M.out.forEach((q, j) => {
            const x = x0 + j * bw + bw * 0.15, wi = Math.max(1, bw * 0.7);
            c.fillStyle = C.ok; c.fillRect(x, Y(q.dep), wi, Y(0) - Y(q.dep));
            if (q.cash > 0) { c.fillStyle = C.warn; c.fillRect(x, Y(q.dep + q.cash), wi, Y(q.dep) - Y(q.dep + q.cash)); }
          });
          polyline(c, M.out.map((q, j) => [x0 + (j + 0.5) * bw, Y(q.total)]), C.accent, 2.4);
          polyline(c, [[x0, Y(M.limit)], [x0 + w, Y(M.limit)]], C.accent, 1.3, [6, 4]);
          kit.label(c, 'limit ' + kit.money(M.limit, 0) + ' = ' + M.m.toFixed(2) + ' × ' + kit.money(V.B, 0), x0 + w - 4, Y(M.limit) - 11, { size: 11.5, color: C.accent, align: 'right', bg: C.bg2 });
          c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
          const tick = n > 20 ? 5 : n > 10 ? 2 : 1;
          for (let j = 0; j < n; j += tick) c.fillText(String(j + 1), x0 + (j + 0.5) * bw, y0 + h + 5);
          c.restore();
          kit.label(c, 'round of lending', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
          legend(kit, c, C, x0, 14, [[C.ok, 'new deposits this round'], [C.warn, 'kept as cash'], [C.accent, 'money created so far']]);
        }
      }
      reset(); showCtl(); update();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a bank run */
  Hyper.sim('mb-bank-run', {
    title: 'A bank run: confidence and cash',
    blurb: `240 depositors of one small bank; bigger dots hold bigger balances, and the violet ones are businesses. A rumour starts and some depositors withdraw. Each day the others look at how many have already gone, and each follows once that share passes their own threshold (a quarter of households never hear of it). The bank pays with its cash, then by selling bonds in a hurry at a loss; its loans cannot be sold quickly. When it cannot pay, it fails. This is a simple model of the idea, not a forecast of any real bank.

- With **Deposit insurance** off, press **Spread the rumour**: a sound bank fails within a week, only because depositors expected other depositors to run.
- Tick **Deposit insurance** (up to ¤100,000 each) and run it again: insured depositors, ringed in green, have no reason to join, and the run fizzles. Businesses with large balances are only partly insured.
- Instead, tick **Central bank lends against loans**: the bank turns its loans into cash and pays everyone who asks, so it survives. Then set **Losses on the bank's loans** to 12 %, more than its capital: no amount of lending saves an insolvent bank.
- Set cash to 50 %: even a bank holding half its deposits in cash fails if enough people run. No bank can repay everyone at once.
- Switch to **Phone apps**: the same run is over in two days instead of six, leaving far less time to respond.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'rumour', label: 'Depositors who hear the rumour first', min: 0, max: 40, step: 1, value: 10, unit: '%' },
        { id: 'calm', label: 'A typical depositor follows once … have left', min: 5, max: 80, step: 1, value: 30, unit: '%' },
        { id: 'cash', label: 'Cash and reserves (share of deposits)', min: 5, max: 50, step: 1, value: 10, unit: '%' },
        { id: 'hair', label: 'Loss when selling bonds in a hurry', min: 0, max: 40, step: 1, value: 15, unit: '%' },
        { id: 'bad', label: 'Losses on the bank\'s loans', min: 0, max: 20, step: 0.5, value: 0, unit: '%' },
        { id: 'ins', type: 'check', label: 'Deposit insurance', value: !!params.ins },
        { id: 'lolr', type: 'check', label: 'Central bank lends against loans', value: !!params.lolr },
        { id: 'speed', type: 'select', label: 'How withdrawals happen', options: [['Queues at the branches (a fifth a day)', 0.2], ['Phone apps (all at once)', 1]], value: 0.2 },
        { type: 'buttons', items: [{ id: 'go', label: 'Spread the rumour', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => { if (id === 'go') begin(); else reset(); update(); loop.once(); });
      const ro = kit.readout(box.side, [['day', 'Day'], ['out', 'Withdrawn so far'], ['liq', 'Cash it could still raise'], ['cap', 'Capital (assets − debts)'], ['insd', 'Insured share of deposits'], ['st', 'Status']]);
      const V = ctl.values, n = 240, COLS = 20, ROWS = 12, LIMIT = 100000;
      // the depositors (fixed): households and a few businesses with large balances;
      // the insurance limit is 2.2 times the average household balance
      const u = uniform(4242), g = kit.fin.normals(777), deps = [];
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const firm = u() < 0.1;
        const size = firm ? 6 * Math.exp(0.7 * g() - 0.245) : Math.exp(0.6 * g() - 0.18);
        deps.push({ firm, size, z: g(), order: u(), asleep: !firm && u() < 0.25 });   // a quarter of households never hear of it
        sum += size;
      }
      const hh = deps.filter(d => !d.firm);
      const unit = LIMIT / (2.2 * hh.reduce((s, d) => s + d.size, 0) / Math.max(1, hh.length));
      const TOTAL = sum * unit;
      deps.forEach(d => { d.money = d.size * unit; d.insured = Math.min(d.money, LIMIT); });
      const rumourOrder = deps.map((d, i) => i).sort((a, b) => deps[a].order - deps[b].order);
      const insuredShare = deps.reduce((s, d) => s + d.insured, 0) / TOTAL;
      let S = null, acc = 0;
      // the share of others gone at which a depositor follows; insurance removes the reason to hurry
      function theta(d) {
        if (d.asleep) return Infinity;
        let t = V.calm / 100 + (d.firm ? -0.08 + 0.1 * d.z : 0.15 * d.z);
        if (V.ins) t += 0.8 * d.insured / d.money;
        return Math.max(0.005, t);               // nobody leaves before somebody else has
      }
      function reset() {
        const D = TOTAL, assets = D / 0.92, cash = V.cash / 100 * D, bonds = 0.3 * D;
        S = { day: 0, active: false, done: false, state: deps.map(() => 0), owed: deps.map(d => d.money), cash, bonds, loans: Math.max(0, assets - cash - bonds),
              cb: 0, deposits: D, paid: 0, hist: [[0, 0]], fail: '', status: 'Calm. Nobody is worried yet.' };
        acc = 0;
        if (equity() < 0) { S.fail = 'insolvent'; S.status = 'The loan losses already exceed the bank\'s capital: it is insolvent before anyone runs.'; }
      }
      const loanValue = () => S.loans * (1 - V.bad / 100);
      const equity = () => S.cash + S.bonds + loanValue() - S.deposits - S.cb;
      const cbRoom = () => (V.lolr && equity() >= 0 ? Math.max(0, 0.9 * loanValue() - S.cb) : 0);   // it lends to solvent banks, keeping a 10 % margin on the loans pledged
      const canRaise = () => S.cash + S.bonds * (1 - V.hair / 100) + cbRoom();
      function raise(need) {
        const room = cbRoom();                   // decided before today's payments
        let got = Math.min(S.cash, need);
        S.cash -= got; need -= got;
        if (need > 1e-6 && S.bonds > 0) {
          const h = V.hair / 100, book = Math.min(S.bonds, need / Math.max(1e-9, 1 - h));
          S.bonds -= book; got += book * (1 - h); need -= book * (1 - h);
        }
        if (need > 1e-6) { const b = Math.min(room, need); S.cb += b; got += b; need -= b; }
        return got;
      }
      function begin() {
        if (!S || S.day > 0 || S.fail) reset();
        if (S.fail) return;
        S.active = true;
        stepDay();
      }
      function stepDay() {
        if (!S || S.done || !S.active) return;
        S.day++;
        if (S.day === 1) {
          const k = Math.round(V.rumour / 100 * n);
          for (let j = 0; j < k; j++) if (S.state[rumourOrder[j]] === 0) S.state[rumourOrder[j]] = 1;
        }
        // depositors look at how many have gone and decide; news travels faster with phones
        let joined = 0;
        const rounds = V.speed >= 1 ? 3 : 1;
        for (let q = 0; q < rounds; q++) {
          const seen = S.state.filter(s => s > 0).length / n;
          deps.forEach((d, i) => { if (S.state[i] === 0 && theta(d) < seen) { S.state[i] = 1; joined++; } });
        }
        // each queued depositor can take out a share of the original balance a day (all of it with phone apps)
        const want = deps.map((d, i) => (S.state[i] === 1 ? Math.min(S.owed[i], V.speed * d.money + 1) : 0));
        const need = want.reduce((s, x) => s + x, 0);
        const got = need > 0 ? raise(need) : 0;
        const share = need > 0 ? got / need : 0;
        deps.forEach((d, i) => {
          if (S.state[i] !== 1) return;
          S.owed[i] -= want[i] * share;
          if (S.owed[i] < 1) { S.owed[i] = 0; S.state[i] = 2; }
        });
        S.deposits -= got; S.paid += got;
        S.hist.push([S.day, S.paid / TOTAL]);
        const stillQueued = S.state.some(s => s === 1);
        if (got < need - 1 && equity() >= 0) { S.done = true; S.fail = 'illiquid'; S.status = 'Day ' + S.day + ': the bank ran out of cash and could not pay. It fails, although its assets were still worth more than its debts.'; }
        else if (got < need - 1 || equity() < 0) { S.done = true; S.fail = 'insolvent'; S.status = 'Day ' + S.day + ': selling assets at fire-sale prices wiped out the bank\'s capital. It fails.'; }
        else if (S.day > 1 && joined === 0 && !stillQueued) { S.done = true; S.status = 'Day ' + S.day + ': nobody else is leaving. The run is over and the bank survived' + (S.cb > 0 ? ', thanks to ' + kit.money(S.cb, 0, true) + ' borrowed from the central bank.' : '.'); }
        else if (S.day >= 40) { S.done = true; S.status = 'Forty days on, withdrawals are still trickling out.'; }
        else S.status = 'Day ' + S.day + ': ' + (joined ? joined + ' more depositors joined the queue.' : 'the queue is being paid.');
        if (S.fail && S.done) {
          const left = deps.reduce((s, d, i) => s + S.owed[i], 0);
          const ins = V.ins ? deps.reduce((s, d, i) => s + Math.min(S.owed[i], LIMIT), 0) : 0;
          S.status += ' ' + kit.money(left, 0, true) + ' is still inside: ' + (V.ins ? kit.money(ins, 0, true) + ' insured (paid out by the insurer), ' + kit.money(left - ins, 0, true) + ' frozen until the assets are sold.' : 'all of it frozen until the assets are sold.');
        }
        if (S.done) S.active = false;
      }
      function update() {
        if (!S) return;
        ro.set('day', String(S.day));
        ro.set('out', kit.money(S.paid, 0, true) + ' (' + kit.pct(S.paid / TOTAL, 0) + ')');
        ro.set('liq', kit.money(canRaise(), 0, true));
        ro.set('cap', kit.money(equity(), 0, true));
        ro.set('insd', V.ins ? kit.pct(insuredShare, 0) + ' (up to ' + kit.money(LIMIT, 0, true) + ' each)' : 'no insurance');
        ro.set('st', S.fail ? (S.fail === 'illiquid' ? 'failed: out of cash' : 'failed: insolvent') : S.done ? 'survived' : S.active ? 'run under way' : 'calm');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        if (!S) return;
        // depositors
        const gx = 16, gy = 30, gw = W * 0.5 - 24, gh = Hh - gy - 56 - 34;
        const cell = Math.max(4, Math.min(gw / COLS, gh / ROWS));
        kit.label(c, 'Depositors', gx, 14, { size: 12.5, color: C.text, weight: 700 });
        deps.forEach((d, i) => {
          const x = gx + (i % COLS + 0.5) * cell, y = gy + (Math.floor(i / COLS) + 0.5) * cell;
          const r = clamp(cell * (0.16 + 0.1 * Math.sqrt(d.size)), 1.5, cell * 0.46);
          const s = S.state[i];
          const col = s === 2 ? C.faint : s === 1 ? C.warn : S.fail && S.done ? (V.ins && d.insured >= d.money - 1 ? C.ok : C.bad) : d.firm ? C.series[5] : C.accent;
          kit.dot(c, x, y, r, col);
          if (V.ins && d.insured >= d.money - 1 && s === 0) { c.strokeStyle = C.ok; c.lineWidth = 1.3; c.beginPath(); c.arc(x, y, r + 2.2, 0, Math.PI * 2); c.stroke(); }
        });
        legend(kit, c, C, gx, gy + ROWS * cell + 14, [[C.accent, 'calm'], [C.warn, 'queuing'], [C.faint, 'got out']]);
        wrap(kit, c, S.status, gx, Hh - 46, W - 32, { size: 12, color: S.fail ? C.bad : S.done ? C.ok : C.text2 });
        // the bank: what it can pay with against what it owes
        const bx = W * 0.5 + 24, bw = W - bx - 16, by = 30;
        if (bw < 80) return;
        kit.label(c, 'The bank', bx, 14, { size: 12.5, color: C.text, weight: 700 });
        const sc = bw / (TOTAL * 1.12);
        const bar = (y, parts, label) => {
          kit.label(c, label, bx, y - 8, { size: 11, color: C.muted });
          let x = bx;
          for (const [v, col] of parts) { const wv = Math.max(0, v) * sc; c.fillStyle = col; c.fillRect(x, y, wv, 16); x += wv; }
        };
        bar(by + 14, [[S.deposits, C.ok]], 'owes depositors ' + kit.money(S.deposits, 0, true));
        bar(by + 56, [[S.cash, C.accent], [S.bonds * (1 - V.hair / 100), C.series[1]], [cbRoom(), C.warn]], 'can raise quickly ' + kit.money(canRaise(), 0, true));
        legend(kit, c, C, bx, by + 86, [[C.accent, 'cash'], [C.series[1], 'bonds, sold fast'], [C.warn, 'central bank']].slice(0, V.lolr ? 3 : 2));
        // withdrawals over time
        const cx0 = bx + 34, cy0 = by + 116, cw = bw - 40, ch = Hh - cy0 - 56 - 40;
        if (ch < 40) return;
        const days = Math.max(10, S.day + 2);
        yAxis(c, C, cx0, cy0, cw, ch, 0, 1, v => Math.round(v * 100) + '%', 4);
        const lim = (V.cash / 100 * TOTAL + 0.3 * TOTAL * (1 - V.hair / 100) + (V.lolr ? 0.9 * (TOTAL / 0.92 - V.cash / 100 * TOTAL - 0.3 * TOTAL) * (1 - V.bad / 100) : 0)) / TOTAL;
        if (lim < 1) { polyline(c, [[cx0, cy0 + ch - lim * ch], [cx0 + cw, cy0 + ch - lim * ch]], C.bad, 1.3, [5, 4]); kit.label(c, 'most it can pay', cx0 + cw - 2, cy0 + ch - lim * ch - 9, { size: 10.5, color: C.bad, align: 'right' }); }
        polyline(c, S.hist.map(p => [cx0 + p[0] / days * cw, cy0 + ch - p[1] * ch]), C.warn, 2.4);
        kit.label(c, 'share of deposits withdrawn', cx0 - 30, cy0 - 12, { size: 11, color: C.muted });
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = days > 20 ? 5 : 2;
        for (let dd = 0; dd <= days; dd += tick) c.fillText(String(dd), cx0 + dd / days * cw, cy0 + ch + 4);
        c.restore();
        kit.label(c, 'day', cx0 + cw / 2, cy0 + ch + 22, { size: 11, color: C.muted, align: 'center' });
      }
      reset(); update();
      // the loop advances one day every 0.7 s during a run; otherwise it only redraws when asked (dt = 0)
      let drawn = false;
      const loop = kit.loop(dt => {
        if (S && S.active && !S.done) {
          acc += dt;
          if (acc >= 0.7) { acc = 0; stepDay(); update(); drawn = false; }
        }
        if (dt === 0 || !drawn) { draw(); drawn = true; }
      }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ small fees, long years */
  Hyper.sim('mb-fee-drag', {
    title: 'Small fees, long years',
    blurb: `**Account fees:** a monthly fee, a few cash-machine charges and the odd overdraft fee look trivial one at a time. The chart adds them up year by year (**paid**) and shows what the same money would have grown to had it been saved at the chosen return instead (**grown**).

**Sending money abroad:** two ways of converting the same amount every month, each with a mark-up hidden in the exchange rate and a fixed fee. The chart shows the cost of each over the years and what the difference would have grown to.

- In account mode, set the monthly fee to ¤10 and everything else to zero: ¤3,600 is paid over 30 years, and over ¤8,000 is lost once growth at 5 % is counted.
- In exchange mode, compare a 3 % mark-up with a 0.5 % one on ¤500 a month: the percentage matters far more than the fixed fee on anything but small amounts.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const m0 = v => kit.money(v, 0), m2 = v => kit.money(v, 2);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Show', options: [['Account fees', 'fees'], ['Sending money abroad', 'fx']], value: params.mode === 'fx' ? 'fx' : 'fees' },
        { id: 'fee', label: 'Monthly account fee', min: 0, max: 30, step: 0.5, value: 8, fmt: m2 },
        { id: 'atm', label: 'Cash-machine fees a month', min: 0, max: 20, step: 1, value: 2 },
        { id: 'atmFee', label: 'Each of them costs', min: 0, max: 6, step: 0.25, value: 2.5, fmt: m2 },
        { id: 'od', label: 'Overdraft fees a year', min: 0, max: 24, step: 1, value: 2 },
        { id: 'odFee', label: 'Each overdraft fee', min: 0, max: 50, step: 1, value: 25, fmt: m0 },
        { id: 'amt', label: 'Converted every month', min: 50, max: 5000, value: 500, log: true, sig: 2, fmt: m0 },
        { id: 'ma', label: 'Way A: mark-up on the rate', min: 0, max: 6, step: 0.1, value: 3, unit: '%' },
        { id: 'fa', label: 'Way A: fixed fee', min: 0, max: 20, step: 0.5, value: 5, fmt: m2 },
        { id: 'mb', label: 'Way B: mark-up on the rate', min: 0, max: 6, step: 0.1, value: 0.5, unit: '%' },
        { id: 'fb', label: 'Way B: fixed fee', min: 0, max: 20, step: 0.5, value: 2, fmt: m2 },
        { id: 'T', label: 'Years', min: 1, max: 40, step: 1, value: 30 },
        { id: 'r', label: 'Return if saved instead', min: 0, max: 10, step: 0.1, value: 5, unit: '%' }
      ], () => { showCtl(); solve(); loop.once(); });
      const ro = kit.readout(box.side, [['yr', 'Cost per year'], ['per', 'Cost of one transfer (A / B)'], ['tot', 'Paid over the years'], ['grown', 'Grown at the return']]);
      const V = ctl.values;
      let rows = [];
      function showCtl() {
        const f = V.mode === 'fees';
        for (const id of ['fee', 'atm', 'atmFee', 'od', 'odFee']) ctl.show(id, f);
        for (const id of ['amt', 'ma', 'fa', 'mb', 'fb']) ctl.show(id, !f);
        ro.show('per', !f);
      }
      function solve() {
        const T = Math.round(V.T), i = V.r / 100 / 12, f = V.mode === 'fees';
        const perA = f ? 0 : V.amt * V.ma / 100 + V.fa, perB = f ? 0 : V.amt * V.mb / 100 + V.fb;
        const monthly = f ? V.fee + V.atm * V.atmFee : perA, monthlyB = f ? 0 : perB;
        const yearlyExtra = f ? V.od * V.odFee : 0;
        let paidA = 0, paidB = 0, grownA = 0, grownB = 0;
        rows = [{ t: 0, paidA: 0, paidB: 0, grownA: 0, grownB: 0 }];
        for (let m = 1; m <= T * 12; m++) {
          const addA = monthly + yearlyExtra / 12, addB = monthlyB;
          paidA += addA; paidB += addB;
          grownA = grownA * (1 + i) + addA; grownB = grownB * (1 + i) + addB;
          if (m % 12 === 0) rows.push({ t: m / 12, paidA, paidB, grownA, grownB });
        }
        if (f) {
          ro.set('yr', kit.money(12 * monthly + yearlyExtra));
          ro.set('tot', kit.money(paidA, 0));
          ro.set('grown', kit.money(grownA, 0));
        } else {
          ro.set('per', m2(perA) + ' (' + kit.pct(perA / V.amt, 1) + ') / ' + m2(perB) + ' (' + kit.pct(perB / V.amt, 1) + ')');
          ro.set('yr', kit.money(12 * perA) + ' / ' + kit.money(12 * perB) + ' (A / B)');
          ro.set('tot', kit.money(paidA, 0) + ' / ' + kit.money(paidB, 0));
          ro.set('grown', 'the difference: ' + kit.money(grownA - grownB, 0));
        }
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H, x0 = 70, y0 = 40, w = W - x0 - 18, h = Hh - y0 - 48;
        if (rows.length < 2 || w < 60 || h < 60) return;
        const T = rows.length - 1, f = V.mode === 'fees';
        const ymax = Math.max(10, ...rows.map(q => Math.max(q.grownA, q.paidA, q.paidB, q.grownB))) * 1.08;
        const X = t => x0 + t / T * w, Y = v => y0 + h - v / ymax * h;
        yAxis(c, C, x0, y0, w, h, 0, ymax, v => kit.money(v, 0, true));
        xYears(kit, c, C, x0, y0, w, h, T, 'years');
        if (f) {
          c.save(); c.globalAlpha = 0.18; c.fillStyle = C.bad;
          c.beginPath(); c.moveTo(X(0), Y(0)); rows.forEach(q => c.lineTo(X(q.t), Y(q.grownA))); for (let j = rows.length - 1; j >= 0; j--) c.lineTo(X(rows[j].t), Y(rows[j].paidA)); c.closePath(); c.fill();
          c.restore();
          polyline(c, rows.map(q => [X(q.t), Y(q.paidA)]), C.warn, 2.4);
          polyline(c, rows.map(q => [X(q.t), Y(q.grownA)]), C.bad, 2.4);
          const L = rows[rows.length - 1];
          kit.label(c, kit.money(L.grownA, 0), X(T) - 4, Y(L.grownA) - 12, { size: 11.5, color: C.bad, align: 'right', bg: C.bg2 });
          kit.label(c, kit.money(L.paidA, 0), X(T) - 4, Y(L.paidA) + 14, { size: 11.5, color: C.warn, align: 'right', bg: C.bg2 });
          legend(kit, c, C, x0, 14, [[C.warn, 'fees paid'], [C.bad, 'what they would have grown to']]);
        } else {
          polyline(c, rows.map(q => [X(q.t), Y(q.paidA)]), C.warn, 2.4);
          polyline(c, rows.map(q => [X(q.t), Y(q.paidB)]), C.ok, 2.4);
          polyline(c, rows.map(q => [X(q.t), Y(Math.max(0, q.grownA - q.grownB))]), C.bad, 1.8, [6, 4]);
          legend(kit, c, C, x0, 14, [[C.warn, 'way A: paid'], [C.ok, 'way B: paid'], [C.bad, 'the difference, grown', true]]);
        }
      }
      showCtl(); solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
