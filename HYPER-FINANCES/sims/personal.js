/* HYPER-FINANCES · sims/personal.js — Personal Finance simulations:
 * a budget against 50/30/20, a shock with and without an emergency fund, a balance sheet
 * over thirty years, the saving rate and the years to independence, avalanche against
 * snowball, the minimum-payment trap, insurance as a bet you hope to lose, and a Ponzi
 * scheme that collapses when new money slows. Every loan and savings calculation goes
 * through kit.fin; amounts are shown with kit.money in the reader's currency. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';

  /* ---------------------------------------------------------------- drawing helpers */
  // a chart frame: horizontal gridlines with labels on the left, ticks along the bottom;
  // returns the scales X(x), Y(y)
  function frame(kit, c, C, a, o) {
    const xmin = o.xmin || 0, xmax = o.xmax > xmin ? o.xmax : xmin + 1;
    const ymin = Number.isFinite(o.ymin) ? o.ymin : 0;
    const ymax = Number.isFinite(o.ymax) && o.ymax > ymin ? o.ymax : ymin + 1;
    const X = x => a.x0 + (x - xmin) / (xmax - xmin) * a.w;
    const Y = y => a.y0 + a.h - (y - ymin) / (ymax - ymin) * a.h;
    const yfmt = o.yfmt || (v => kit.money(v, 0, true));
    const xfmt = o.xfmt || (v => String(Math.round(v * 100) / 100));
    const ys = Hyper.niceStep(ymax - ymin, o.yn || 5);
    c.save();
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let k = Math.ceil(ymin / ys - 1e-9); k * ys <= ymax + ys * 1e-6; k++) {
      const v = k * ys, y = Y(v);
      c.strokeStyle = k === 0 ? C.axis : C.grid; c.lineWidth = k === 0 ? 1.4 : 1;
      c.beginPath(); c.moveTo(a.x0, y); c.lineTo(a.x0 + a.w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(yfmt(v), a.x0 - 6, y);
    }
    const xs = o.xstep || Hyper.niceStep(xmax - xmin, o.xn || 6);
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let k = Math.ceil(xmin / xs - 1e-9); k * xs <= xmax + xs * 1e-6; k++) c.fillText(xfmt(k * xs), X(k * xs), a.y0 + a.h + 5);
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, a.x0 + a.w / 2, a.y0 + a.h + 25, { size: 11.5, color: C.muted, align: 'center' });
    if (o.ylabel) kit.label(c, o.ylabel, a.x0, a.y0 - 13, { size: 11.5, color: C.muted });
    return { X, Y };
  }
  function line(c, pts, S, color, width, dash) {
    if (!pts.length) return;
    c.save();
    c.strokeStyle = color; c.lineWidth = width || 2; c.lineJoin = 'round';
    if (dash) c.setLineDash(dash);
    c.beginPath();
    pts.forEach((p, k) => k ? c.lineTo(S.X(p[0]), S.Y(p[1])) : c.moveTo(S.X(p[0]), S.Y(p[1])));
    c.stroke();
    c.restore();
  }
  // coloured keys (a dash array draws a line instead of a square); wraps onto a new row before
  // maxX and returns the y just below the last row, so a chart can start there
  function legend(kit, c, C, items, x, y, maxX) {
    let xx = x, yy = y;
    c.save(); c.font = '11.5px system-ui, sans-serif';
    for (const [col, text, dash] of items) {
      const w = 17 + c.measureText(text).width + 18;
      if (maxX && xx > x && xx + w - 18 > maxX) { xx = x; yy += 17; }
      c.strokeStyle = c.fillStyle = col;
      if (dash) { c.lineWidth = 2; c.setLineDash(dash); c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + 14, yy); c.stroke(); c.setLineDash([]); }
      else c.fillRect(xx, yy - 5, 11, 11);
      kit.label(c, text, xx + 17, yy, { size: 11.5, color: C.text2 || C.text });
      xx += w;
    }
    c.restore();
    return yy + 8;
  }
  // a blue that stands apart from the greens (the finance accent and "ok" are both green)
  const blue = kit => kit.hue(215);
  // text on a coloured bar: white in the light theme, near-black in the dark one (lighter bars)
  const onBar = C => C.dark ? '#14161b' : '#fff';
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  // months as "18 months" or "4.5 years"
  const span = m => m < 24 ? Math.round(m) + (Math.round(m) === 1 ? ' month' : ' months') : (m / 12).toFixed(1) + ' years';

  /* ================================================================ a budget against 50/30/20 */
  Hyper.sim('pf-budget', {
    title: 'Where the money goes: your budget against 50/30/20',
    blurb: `The top bar is one month of net income, split into **needs** (orange), **wants** (blue) and what is **left to save** (green). Below it, the 50/30/20 guideline for the same income, and the three shares side by side.

- The defaults are the example month from the page: needs take 72 %, saving 10 %. Try trimming wants to zero: saving still cannot reach 20 % — the lever is housing.
- Lower the rent by ¤200 and watch saving, the yearly total and the time to a six-month emergency fund all move at once.
- Push spending above income: the red overhang is what would go on a card every month.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 330 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'inc', label: 'Net income a month', min: 500, max: 20000, value: 3200, log: true, sig: 2, fmt: m0 },
        { id: 'house', label: 'Housing (rent or mortgage)', min: 0, max: 6000, step: 10, value: 1150, fmt: m0 },
        { id: 'food', label: 'Groceries', min: 0, max: 2000, step: 10, value: 420, fmt: m0 },
        { id: 'trans', label: 'Transport', min: 0, max: 2000, step: 10, value: 260, fmt: m0 },
        { id: 'bills', label: 'Energy, phone, insurance', min: 0, max: 2000, step: 10, value: 330, fmt: m0 },
        { id: 'debt', label: 'Minimum debt payments', min: 0, max: 2000, step: 10, value: 150, fmt: m0 },
        { id: 'wants', label: 'Wants: eating out, fun, shopping', min: 0, max: 4000, step: 10, value: 560, fmt: m0 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['needs', 'Needs'], ['wants', 'Wants'], ['save', 'Left to save'], ['year', 'Saved in a year'], ['fund', 'Six months of essentials in']]);
      const V = ctl.values;
      const CATS = [['house', 'housing'], ['food', 'food'], ['trans', 'transport'], ['bills', 'bills'], ['debt', 'debts']];

      function bar(c, C, x0, y, h, px, segs) {
        let x = x0;
        for (const s of segs) {
          const w = Math.max(0, s.v * px);
          if (w <= 0) continue;
          c.fillStyle = s.col; c.fillRect(x, y, w, h);
          c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.strokeRect(x, y, w, h);
          if (s.text) {
            c.font = '600 11px system-ui, sans-serif';
            const t1 = s.text, t2 = kit.money(s.v, 0, true);
            if (c.measureText(t1).width + 8 < w) {
              kit.label(c, t1, x + w / 2, y + h / 2 - (h > 34 ? 7 : 0), { size: 11, color: onBar(C), align: 'center', weight: 600 });
              if (h > 34 && c.measureText(t2).width + 8 < w) kit.label(c, t2, x + w / 2, y + h / 2 + 8, { size: 11, color: onBar(C), align: 'center' });
            }
          }
          x += w;
        }
        return x;
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W;
        const inc = V.inc;
        const needs = CATS.reduce((s, [k]) => s + V[k], 0);
        const spent = needs + V.wants, save = inc - spent;
        const x0 = 16, w = W - 32;
        const scale = Math.max(inc, spent, 1), px = w / scale;
        // your month
        kit.label(c, 'Your month', x0, 16, { size: 12.5, weight: 600 });
        const segs = CATS.map(([k, t]) => ({ v: V[k], col: C.warn, text: t })).concat([{ v: V.wants, col: blue(kit), text: 'wants' }]);
        if (save > 0) segs.push({ v: save, col: C.ok, text: 'saving' });
        bar(c, C, x0, 28, 46, px, segs);
        // income mark, and a deficit overhang
        const xi = x0 + inc * px;
        if (save < 0) {
          c.save(); c.globalAlpha = 0.35; c.fillStyle = C.bad; c.fillRect(xi, 24, -save * px, 54); c.restore();
          kit.label(c, 'short by ' + kit.money(-save, 0) + ' a month', Math.min(xi + 4, x0 + w - 150), 88, { size: 11.5, color: C.bad, weight: 600 });
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xi, 22); c.lineTo(xi, 80); c.stroke();
        const il = 'income ' + kit.money(inc, 0);
        if (xi > x0 + 170) kit.label(c, il, xi - 5, 15, { size: 11.5, color: C.text2 || C.text, align: 'right' });
        else kit.label(c, il, Math.max(xi + 5, x0 + 90), 15, { size: 11.5, color: C.text2 || C.text });
        // the guideline
        const gy = 112;
        kit.label(c, 'The 50/30/20 guideline for the same income', x0, gy - 12, { size: 12.5, weight: 600 });
        bar(c, C, x0, gy, 30, px, [{ v: 0.5 * inc, col: C.warn, text: 'needs 50 %' }, { v: 0.3 * inc, col: blue(kit), text: 'wants 30 %' }, { v: 0.2 * inc, col: C.ok, text: 'saving 20 %' }]);
        // the shares side by side
        const my = 176;
        kit.label(c, 'Shares of income: yours (bar), the guideline (mark)', x0, my - 12, { size: 12.5, weight: 600 });
        const rows = [['Needs', needs / inc, 0.5, C.warn], ['Wants', V.wants / inc, 0.3, blue(kit)], ['Saving', save / inc, 0.2, save >= 0 ? C.ok : C.bad]];
        const lx = x0 + 150, lw = w - 150 - 8;
        rows.forEach(([name, share, guide, col], j) => {
          const y = my + 4 + j * 40;
          kit.label(c, name + '  ' + kit.pct(share, 0), x0, y + 11, { size: 12, color: C.text });
          c.fillStyle = C.grid; c.fillRect(lx, y + 2, lw, 18);
          const f = clamp(Math.abs(share), 0, 1);
          c.fillStyle = col; c.fillRect(lx, y + 2, f * lw, 18);
          const gx = lx + guide * lw;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(gx, y - 3); c.lineTo(gx, y + 25); c.stroke();
        });
        [0, 0.25, 0.5, 0.75, 1].forEach(f => kit.label(c, Math.round(f * 100) + ' %', lx + f * lw, my + 4 + 3 * 40 + 4, { size: 10.5, color: C.muted, align: 'center' }));
        // read-outs
        ro.set('needs', kit.money(needs, 0) + ' (' + kit.pct(needs / inc, 0) + ')');
        ro.set('wants', kit.money(V.wants, 0) + ' (' + kit.pct(V.wants / inc, 0) + ')');
        ro.set('save', save >= 0 ? kit.money(save, 0) + ' (' + kit.pct(save / inc, 1) + ')' : 'none: short by ' + kit.money(-save, 0));
        ro.set('year', save > 0 ? kit.money(12 * save, 0) : kit.money(0, 0));
        ro.set('fund', save > 0 ? span(6 * needs / save) + ' (' + kit.money(6 * needs, 0) + ')' : 'not while nothing is left');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ emergency fund */
  // month by month: the shock, then the normal surplus repays any debt first and refills savings
  function crisis(o) {
    let cash = o.fund, debt = 0, peak = 0, interest = 0, back = null;
    const pts = [[0, cash]], end = o.kind === 'job' ? o.months : 1;
    for (let t = 1; t <= 360; t++) {
      const it = debt * o.rate / 12;
      debt += it; interest += it;
      let flow = o.kind === 'job' && t <= o.months ? o.benefit - o.ess : o.surplus;
      if (o.kind === 'bill' && t === 1) flow -= o.bill;
      if (flow >= 0) { const pay = Math.min(debt, flow); debt -= pay; cash += flow - pay; }
      else { const take = Math.min(cash, -flow); cash -= take; debt += -flow - take; }
      if (debt < 0.005) debt = 0;
      peak = Math.max(peak, debt);
      pts.push([t, cash - debt]);
      if (back == null && t >= end && cash - debt >= o.fund - 0.005) back = t;
      if (back != null && t >= 120) break;
    }
    return { pts, peak, interest, back };
  }

  Hyper.sim('pf-emergency', {
    title: 'A shock, with and without a cushion',
    blurb: `Two identical households meet the same shock — a job loss or a large bill. One has an **emergency fund**; the other starts with nothing and borrows on a card. The lines show savings minus debt, month by month; afterwards both put their usual monthly surplus first towards any debt, then back into savings.

- With the defaults, the household without a fund is still paying for a four-month job loss long after the household with a fund has refilled it. Compare the interest.
- Set the fund to six months: the job loss no longer creates any debt at all.
- Raise the card rate or lower the monthly surplus: the gap between the two recoveries widens, because interest keeps growing on the debt while it is repaid.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'The shock', options: [['Job loss', 'job'], ['A large unexpected bill', 'bill']], value: 'job' },
        { id: 'ess', label: 'Essential spending a month', min: 500, max: 8000, step: 50, value: 2400, fmt: m0 },
        { id: 'fundm', label: 'Emergency fund (months of essentials)', min: 0, max: 12, step: 0.5, value: 3 },
        { id: 'months', label: 'Months without work', min: 1, max: 12, step: 1, value: 4 },
        { id: 'benefit', label: 'Income meanwhile (benefit, partner)', min: 0, max: 4000, step: 50, value: 500, fmt: m0 },
        { id: 'bill', label: 'The bill', min: 500, max: 20000, step: 100, value: 3000, fmt: m0 },
        { id: 'surplus', label: 'Usual surplus a month (after the shock)', min: 0, max: 3000, step: 25, value: 300, fmt: m0 },
        { id: 'rate', label: 'Card interest rate', min: 0, max: 40, step: 0.5, value: 22, unit: '%' }
      ], () => { modes(); loop.once(); });
      const ro = kit.readout(box.side, [['fund', 'The fund'], ['cover', 'It covers'], ['peak', 'Borrowed at the worst'], ['int', 'Interest paid'], ['back', 'Back where they started']]);
      const V = ctl.values;
      function modes() {
        const job = V.kind === 'job';
        ctl.show('months', job); ctl.show('benefit', job); ctl.show('bill', !job);
      }
      modes();

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const fund = V.fundm * V.ess;
        const base = { kind: V.kind, ess: V.ess, months: Math.round(V.months), benefit: V.benefit, bill: V.bill, surplus: V.surplus, rate: V.rate / 100 };
        const A = crisis(Object.assign({ fund }, base)), B = crisis(Object.assign({ fund: 0 }, base));
        const shockEnd = V.kind === 'job' ? Math.round(V.months) : 1;
        const last = Math.max(shockEnd, A.back || 0, B.back || 0);
        const T = clamp(Math.ceil((last + 6) / 6) * 6, 24, 120);
        const pa = A.pts.filter(p => p[0] <= T), pb = B.pts.filter(p => p[0] <= T);
        const all = pa.concat(pb).map(p => p[1]);
        const lo = Math.min(0, ...all), hi = Math.max(1, ...all);
        const pad = (hi - lo) * 0.08;
        const top = legend(kit, c, C, [[C.ok, 'with a fund of ' + kit.money(fund, 0)], [C.bad, 'with no fund (borrowing at ' + V.rate + ' %)']], 70, 13, st.W - 12) + 12;
        const a = { x0: 70, y0: top, w: st.W - 70 - 18, h: st.H - top - 48 };
        const S = frame(kit, c, C, a, { xmax: T, ymin: lo - pad, ymax: hi + pad, xlabel: 'months after the shock', xstep: T > 60 ? 12 : 6 });
        // the shock period
        c.save(); c.globalAlpha = 0.14; c.fillStyle = C.warn;
        c.fillRect(S.X(0), a.y0, S.X(shockEnd) - S.X(0), a.h); c.restore();
        kit.label(c, V.kind === 'job' ? 'no work' : 'the bill', S.X(shockEnd / 2), a.y0 + 10, { size: 11, color: C.muted, align: 'center' });
        line(c, pb, S, C.bad, 2.4);
        line(c, pa, S, C.ok, 2.4);
        for (const [R, col] of [[A, C.ok], [B, C.bad]]) if (R.back != null && R.back <= T) {
          const p = R.pts[R.back];
          kit.dot(c, S.X(p[0]), S.Y(p[1]), 4.5, col, C.bg2);
        }
        kit.label(c, 'savings minus debt', a.x0 + a.w, a.y0 + a.h - 10, { size: 11, color: C.muted, align: 'right' });

        const gap = V.kind === 'job' ? V.ess - V.benefit : V.bill;
        ro.set('fund', kit.money(fund, 0) + ' (' + V.fundm + ' months of essentials)');
        if (V.kind === 'job') ro.set('cover', gap > 0 ? (fund / gap).toFixed(1) + ' months of the gap (' + kit.money(gap, 0) + ' a month)' : 'not needed: income covers the essentials');
        else ro.set('cover', kit.pct(Math.min(1, fund / gap), 0) + ' of the bill');
        ro.set('peak', 'with: ' + kit.money(A.peak, 0) + ' · without: ' + kit.money(B.peak, 0));
        ro.set('int', 'with: ' + kit.money(A.interest, 0) + ' · without: ' + kit.money(B.interest, 0));
        const b = R => R.back == null ? 'not within 30 years' : span(R.back);
        ro.set('back', 'with: ' + b(A) + ' · without: ' + b(B));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ net worth over time */
  const START = {
    home: { A0: 75000, V: 350000, M: 240000, mr: 5, mt: 25, D: 10000, s: 500, g: 5, h: 2 },
    grad: { A0: 3000, V: 0, M: 0, mr: 5, mt: 25, D: 28000, s: 400, g: 5, h: 2 },
    rent: { A0: 20000, V: 0, M: 0, mr: 5, mt: 25, D: 0, s: 800, g: 5, h: 2 }
  };
  Hyper.sim('pf-networth', {
    title: 'A balance sheet over thirty years',
    blurb: `Above the axis, what you own: **investments** and the **home**. Below it, what you owe: the **mortgage** and **other debts**. The black line is **net worth** — the difference. Mortgage and loan payments come out of the budget; the monthly saving is invested on top.

- Start as **a graduate with a student loan**: net worth begins below zero and crosses it within a few years.
- As a homeowner, watch the mortgage shrink slowly and then fast, while home equity grows from both sides.
- Set home price growth to zero and then to −2 %: how much of the final net worth depended on the house?
- Double the monthly saving: the investment layer, not the house, is where your own decisions show most.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const m0 = v => kit.money(v, 0);
      const defs = [
        { id: 'start', type: 'select', label: 'Start as', options: [['A homeowner in mid-career', 'home'], ['A graduate with a student loan', 'grad'], ['A renter who invests', 'rent']], value: 'home' },
        { id: 'A0', label: 'Savings and investments today', min: 0, max: 500000, step: 1000, value: 75000, fmt: m0 },
        { id: 'V', label: 'Home value', min: 0, max: 1500000, step: 5000, value: 350000, fmt: m0 },
        { id: 'M', label: 'Mortgage owed', min: 0, max: 1500000, step: 5000, value: 240000, fmt: m0 },
        { id: 'mr', label: 'Mortgage rate', min: 0, max: 12, step: 0.1, value: 5, unit: '%' },
        { id: 'mt', label: 'Years left on the mortgage', min: 1, max: 35, step: 1, value: 25 },
        { id: 'D', label: 'Other debts (repaid over 10 years at 7 %)', min: 0, max: 100000, step: 500, value: 10000, fmt: m0 },
        { id: 's', label: 'Saved and invested a month', min: 0, max: 5000, step: 25, value: 500, fmt: m0 },
        { id: 'g', label: 'Investment return a year', min: 0, max: 10, step: 0.1, value: 5, unit: '%' },
        { id: 'h', label: 'Home price growth a year', min: -3, max: 8, step: 0.1, value: 2, unit: '%' }
      ];
      const ctl = kit.controls(box.side, defs, (id, v) => {
        if (id === 'start') for (const [k, x] of Object.entries(START[v] || {})) ctl.set(k, x);
        loop.once();
      });
      const ro = kit.readout(box.side, [['now', 'Net worth today'], ['zero', 'Net worth above zero'], ['y10', 'In 10 years'], ['y30', 'In 30 years'], ['mix', 'At 30: investments · home equity']]);
      const V = ctl.values;
      const Y = 30;

      function path() {
        const inv = kit.fin.grow({ initial: V.A0, contribution: V.s, annual: V.g / 100, years: Y }).rows;
        const mort = V.M > 0 ? kit.fin.amortize({ principal: V.M, annual: V.mr / 100, years: Math.round(V.mt) }).rows : [];
        const oth = V.D > 0 ? kit.fin.amortize({ principal: V.D, annual: 0.07, years: 10 }).rows : [];
        const bal = (rows, P, y) => y === 0 ? P : (rows[12 * y - 1] ? rows[12 * y - 1].balance : 0);
        const out = [];
        for (let y = 0; y <= Y; y++) {
          const i = inv[12 * y].balance, home = V.V * Math.pow(1 + V.h / 100, y);
          const m = V.M > 0 ? bal(mort, V.M, y) : 0, d = V.D > 0 ? bal(oth, V.D, y) : 0;
          out.push({ y, inv: i, home, mort: m, debt: d, net: i + home - m - d });
        }
        return out;
      }
      function area(c, S, pts0, pts1, col, alpha) {
        c.save(); c.globalAlpha = alpha; c.fillStyle = col;
        c.beginPath();
        pts1.forEach((p, k) => k ? c.lineTo(S.X(p[0]), S.Y(p[1])) : c.moveTo(S.X(p[0]), S.Y(p[1])));
        for (let k = pts0.length - 1; k >= 0; k--) c.lineTo(S.X(pts0[k][0]), S.Y(pts0[k][1]));
        c.closePath(); c.fill(); c.restore();
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const P = path();
        const hi = Math.max(1, ...P.map(p => p.inv + p.home), ...P.map(p => p.net));
        const lo = Math.min(0, ...P.map(p => -(p.mort + p.debt)), ...P.map(p => p.net));
        const pad = (hi - lo) * 0.06;
        const top = legend(kit, c, C, [[C.ok, 'investments'], [blue(kit), 'home'], [C.bad, 'mortgage'], [C.warn, 'other debts'], [C.text, 'net worth', []]], 70, 13, st.W - 12) + 12;
        const a = { x0: 70, y0: top, w: st.W - 70 - 18, h: st.H - top - 48 };
        const S = frame(kit, c, C, a, { xmax: Y, ymin: lo - pad, ymax: hi + pad, xlabel: 'years from now', xstep: 5 });
        const z = P.map(p => [p.y, 0]);
        const inv = P.map(p => [p.y, p.inv]), home = P.map(p => [p.y, p.inv + p.home]);
        const mort = P.map(p => [p.y, -p.mort]), debt = P.map(p => [p.y, -p.mort - p.debt]);
        area(c, S, z, inv, C.ok, 0.55);
        area(c, S, inv, home, blue(kit), 0.45);
        area(c, S, z, mort, C.bad, 0.4);
        area(c, S, mort, debt, C.warn, 0.55);
        line(c, P.map(p => [p.y, p.net]), S, C.text, 2.6);
        const cross = P.findIndex(p => p.net >= 0);
        if (P[0].net < 0 && cross > 0) {
          const p = P[cross];
          kit.dot(c, S.X(p.y), S.Y(p.net), 4.5, C.text, C.bg2);
          kit.label(c, 'net worth above zero in year ' + p.y, S.X(p.y) + 8, S.Y(p.net) - 12, { size: 11.5, color: C.text, bg: C.bg2 });
        }
        const p0 = P[0], p10 = P[10], p30 = P[Y];
        ro.set('now', kit.money(p0.net, 0));
        ro.set('zero', P[0].net >= 0 ? 'already' : cross > 0 ? 'in year ' + P[cross].y : 'not within ' + Y + ' years');
        ro.set('y10', kit.money(p10.net, 0));
        ro.set('y30', kit.money(p30.net, 0));
        ro.set('mix', kit.money(p30.inv, 0) + ' · ' + kit.money(p30.home - p30.mort, 0));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ saving rate */
  // years until savings reach m times a year's spending, saving a share s of income, real return r
  const yearsToFI = (s, r, m) => r > 1e-9 ? Math.log(1 + m * r * (1 - s) / s) / Math.log(1 + r) : m * (1 - s) / s;
  Hyper.sim('pf-saving-rate', {
    title: 'The saving rate and the years to independence',
    blurb: `Top: how many years it takes to build **25 times a year's spending** (the 4 % guideline) from nothing, for every saving rate, with the return you choose. The dashed curve has no growth at all. Bottom: your chosen plan, year by year, measured in years of spending.

- Move the saving rate from 10 % to 20 %, then from 50 % to 60 %: the same ten points buy very different numbers of years.
- Set the return to zero: the dashed and solid curves meet. Growth matters most at low saving rates, where the years are long.
- Change the withdrawal rate: a more cautious 3.5 % needs a larger pot and adds years; the curve keeps its shape.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Saving rate', min: 5, max: 90, step: 1, value: 20, unit: '%' },
        { id: 'r', label: 'Real return a year (after inflation)', min: 0, max: 10, step: 0.1, value: 5, unit: '%' },
        { id: 'w', label: 'Withdrawal rate in independence', min: 2.5, max: 6, step: 0.1, value: 4, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['T', 'Years to independence'], ['need', 'Target'], ['nog', 'With no growth at all'], ['more', '5 points more saving saves']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const s = V.s / 100, r = V.r / 100, m = 100 / V.w;
        const T = yearsToFI(s, r, m);
        const cap = 80;
        // top: years against saving rate
        const hTop = Math.round((st.H - 30) * 0.56);
        const top = legend(kit, c, C, [[blue(kit), 'with a ' + V.r + ' % real return', []], [C.muted, 'with no growth', [5, 4]]], 58, 12, st.W - 12) + 10;
        const a = { x0: 58, y0: top, w: st.W - 58 - 18, h: hTop - top - 40 };
        const S = frame(kit, c, C, a, { xmin: 0, xmax: 90, ymin: 0, ymax: cap, xstep: 10, yfmt: v => v + ' yr', xfmt: v => v + ' %', xlabel: 'saving rate' });
        const curve = [], flat = [];
        for (let p = 5; p <= 90; p += 0.5) {
          const q = p / 100;
          const t1 = yearsToFI(q, r, m), t0 = yearsToFI(q, 0, m);
          if (t1 <= cap) curve.push([p, t1]);
          if (t0 <= cap) flat.push([p, t0]);
        }
        line(c, flat, S, C.muted, 1.8, [5, 4]);
        line(c, curve, S, blue(kit), 2.6);
        const px = S.X(V.s), right = px > a.x0 + a.w - 170;
        if (T <= cap) {
          kit.dot(c, px, S.Y(T), 5.5, blue(kit), C.bg2);
          kit.label(c, V.s + ' % → ' + T.toFixed(1) + ' years', right ? px - 9 : px + 9, S.Y(T) - 12, { size: 12, weight: 600, color: C.text, bg: C.bg2, align: right ? 'right' : 'left' });
        } else kit.label(c, V.s + ' % → more than ' + cap + ' years', right ? px - 6 : px + 6, a.y0 + 10, { size: 12, weight: 600, color: C.text, bg: C.bg2, align: right ? 'right' : 'left' });
        // bottom: the plan, in years of spending
        const b = { x0: 58, y0: hTop + 22, w: st.W - 58 - 18, h: st.H - hTop - 22 - 40 };
        const N = Math.max(1, Math.min(cap, Math.ceil(T) + 2));
        const g = kit.fin.grow({ initial: 0, contribution: s, annual: r, years: N, perYear: 1 }).rows;
        const pts = g.map(row => [row.t, row.balance / (1 - s)]);
        const S2 = frame(kit, c, C, b, { xmin: 0, xmax: N, ymin: 0, ymax: Math.max(m, pts[pts.length - 1][1]) * 1.1, yfmt: v => v + '×', xlabel: 'years of saving', xstep: Hyper.niceStep(N, 8) });
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(b.x0, S2.Y(m)); c.lineTo(b.x0 + b.w, S2.Y(m)); c.stroke(); c.restore();
        kit.label(c, 'target: ' + m.toFixed(1) + ' × a year\'s spending', b.x0 + 6, S2.Y(m) - 10, { size: 11.5, color: C.ok });
        line(c, pts, S2, blue(kit), 2.4);
        kit.label(c, 'savings, in years of spending', b.x0, b.y0 - 11, { size: 11.5, color: C.muted });
        // read-outs
        const fmtT = t => t > 200 ? 'more than 200 years' : t.toFixed(1) + ' years';
        ro.set('T', fmtT(T));
        ro.set('need', m.toFixed(1) + ' × spending = ' + (m * (1 - s)).toFixed(1) + ' years of income');
        ro.set('nog', fmtT(yearsToFI(s, 0, m)));
        const s2 = Math.min(0.95, s + 0.05);
        ro.set('more', (T - yearsToFI(s2, r, m)).toFixed(1) + ' years');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the minimum-payment trap */
  // a card paid month by month: at the minimum (a share of the balance, a floor, optionally plus the
  // month's interest) or at a fixed amount; the same rule as kit.fin.minimumPayoff, kept for drawing
  function cardPath(o) {
    let b = o.balance;
    const i = o.apr / 12, pts = [[0, b]], pays = [];
    for (let m = 1; m <= 1200 && b > 0.005; m++) {
      const it = b * i;
      const due = o.fixed != null ? o.fixed : Math.max(o.minFloor, b * o.minPct + (o.plusInterest ? it : 0));
      const pay = Math.min(b + it, due);
      if (pay <= it) break;
      b += it - pay;
      pts.push([m / 12, Math.max(0, b)]);
      pays.push([m / 12, pay, it]);
    }
    return { pts, pays, done: b <= 0.005 };
  }
  Hyper.sim('pf-min-trap', {
    title: 'The minimum-payment trap',
    blurb: `Top: a card balance paid three ways — only the **minimum** the statement asks for, the **first minimum kept as a fixed amount**, and a **fixed payment** you choose. Bottom: what each minimum payment is made of, month by month: **interest** and the **capital** that actually reduces the debt.

- With the defaults, the minimum starts at ¤125, of which ¤91.67 is interest — and then shrinks with the balance. That is why it takes over 26 years.
- Simply freezing the payment at the first minimum cuts the time by about three quarters.
- Switch the rule to **interest plus 1 %**, a stricter kind of minimum some lenders use: better, but still slow.
- Lower the fixed payment until it barely covers the interest, and watch the fixed plan stall.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const m0 = v => kit.money(v, 0);
      const ctl = kit.controls(box.side, [
        { id: 'B', label: 'Card balance', min: 500, max: 30000, step: 100, value: 5000, fmt: m0 },
        { id: 'apr', label: 'Card interest rate (APR)', min: 5, max: 40, step: 0.5, value: 22, unit: '%' },
        { id: 'rule', type: 'select', label: 'The minimum is', options: [['A share of the balance', 'pct'], ['Interest plus a share of the balance', 'plus']], value: 'pct' },
        { id: 'pct', label: 'Share of the balance', min: 1, max: 5, step: 0.1, value: 2.5, unit: '%' },
        { id: 'floor', label: '… but at least', min: 5, max: 100, step: 5, value: 25, fmt: m0 },
        { id: 'fixed', label: 'Your fixed payment', min: 25, max: 2000, step: 5, value: 200, fmt: m0 }
      ], (id, v) => { if (id === 'rule') ctl.set('pct', v === 'plus' ? 1 : 2.5); loop.once(); });
      const ro = kit.readout(box.side, [['first', 'First minimum'], ['min', 'Minimum only'], ['keep', 'First minimum, kept fixed'], ['fix', 'Your fixed payment'], ['save', 'Fixed instead of minimum saves']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const apr = V.apr / 100, minPct = V.pct / 100, plus = V.rule === 'plus';
        const it0 = V.B * apr / 12, min0 = Math.min(V.B + it0, Math.max(V.floor, V.B * minPct + (plus ? it0 : 0)));
        const pMin = cardPath({ balance: V.B, apr, minPct, minFloor: V.floor, plusInterest: plus });
        const pKeep = cardPath({ balance: V.B, apr, fixed: min0 });
        const pFix = cardPath({ balance: V.B, apr, fixed: V.fixed });
        // totals from the finance module
        const tMin = kit.fin.minimumPayoff({ balance: V.B, apr, minPct, minFloor: V.floor, plusInterest: plus });
        const tot = f => f > it0 ? kit.fin.minimumPayoff({ balance: V.B, apr, minPct: 1e-9, fixed: f }) : null;
        const tKeep = tot(min0), tFix = tot(V.fixed);
        const Y = clamp(Math.ceil(Math.max(pMin.pts[pMin.pts.length - 1][0], pFix.pts[pFix.pts.length - 1][0], 2) / 5) * 5, 5, 40);
        const hTop = Math.round((st.H - 24) * 0.58);
        const top = legend(kit, c, C, [[C.bad, 'minimum only', []], [C.warn, 'first minimum kept', []], [C.ok, 'fixed ' + kit.money(V.fixed, 0), []]], 66, 13, st.W - 12) + 10;
        const a = { x0: 66, y0: top, w: st.W - 66 - 18, h: hTop - top - 36 };
        const S = frame(kit, c, C, a, { xmax: Y, ymin: 0, ymax: V.B * 1.08, xstep: Y > 20 ? 5 : Y > 10 ? 2 : 1 });
        const cut = pts => pts.filter(p => p[0] <= Y);
        line(c, cut(pFix.pts), S, C.ok, 2.4);
        line(c, cut(pKeep.pts), S, C.warn, 2.2);
        line(c, cut(pMin.pts), S, C.bad, 2.6);
        kit.label(c, 'balance', a.x0 + a.w, a.y0 + 8, { size: 11, color: C.muted, align: 'right' });
        // bottom: the minimum payment, split into interest and capital
        const b = { x0: 66, y0: hTop + 18, w: st.W - 66 - 18, h: st.H - hTop - 18 - 42 };
        const pm = pMin.pays.filter(p => p[0] <= Y);
        const S2 = frame(kit, c, C, b, { xmax: Y, ymin: 0, ymax: Math.max(min0, V.fixed) * 1.1, xstep: Y > 20 ? 5 : Y > 10 ? 2 : 1, yn: 4, xlabel: 'years' });
        if (pm.length) {
          c.save(); c.globalAlpha = 0.6;
          c.fillStyle = blue(kit); c.beginPath(); c.moveTo(S2.X(0), S2.Y(0));
          pm.forEach(p => c.lineTo(S2.X(p[0]), S2.Y(p[1]))); c.lineTo(S2.X(pm[pm.length - 1][0]), S2.Y(0)); c.closePath(); c.fill();
          c.fillStyle = C.warn; c.beginPath(); c.moveTo(S2.X(0), S2.Y(0));
          pm.forEach(p => c.lineTo(S2.X(p[0]), S2.Y(p[2]))); c.lineTo(S2.X(pm[pm.length - 1][0]), S2.Y(0)); c.closePath(); c.fill();
          c.restore();
        }
        line(c, [[0, V.fixed], [Math.min(Y, pFix.pts[pFix.pts.length - 1][0]), V.fixed]], S2, C.ok, 1.8, [6, 4]);
        legend(kit, c, C, [[C.warn, 'interest'], [blue(kit), 'capital'], [C.ok, 'fixed payment', [6, 4]]], b.x0, b.y0 - 9);
        // read-outs
        const say = t => !t || !Number.isFinite(t.months) ? 'never: it does not cover the interest' : span(t.months) + ', ' + kit.money(t.interest, 0) + ' interest';
        ro.set('first', kit.money(min0) + ' (' + kit.money(it0) + ' interest)');
        ro.set('min', say(tMin));
        ro.set('keep', say(tKeep));
        ro.set('fix', say(tFix));
        ro.set('save', tFix && Number.isFinite(tMin.interest) && Number.isFinite(tFix.interest) ? kit.money(tMin.interest - tFix.interest, 0) : '—');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ avalanche and snowball */
  const DEBTS = {
    page: { budget: 500, list: [['Card A', 6000, 24, 150], ['Card B', 1500, 20, 40], ['Store card', 800, 18, 25], ['Personal loan', 2500, 10, 80]] },
    same: { budget: 650, list: [['Store card', 800, 29, 25], ['Card', 2000, 22, 50], ['Personal loan', 4000, 12, 130], ['Car loan', 9000, 7, 260]] },
    split: { budget: 600, list: [['Big card', 9000, 25, 225], ['Loan 1', 1200, 8, 60], ['Loan 2', 2000, 9, 70], ['Store card', 600, 15, 25]] }
  };
  // every month: interest on each debt, the minimum on each, then everything left over to the
  // targets in order; a cleared debt's payment rolls on automatically because the total stays the same
  function payoff(list, budget, order) {
    const d = list.map(([name, bal, rate, min], k) => ({ k, name, bal, rate: rate / 100, min, cleared: null, interest: 0 }));
    const mins = d.reduce((s, x) => s + x.min, 0);
    budget = Math.max(budget, mins);
    const prio = order === 'avalanche' ? d.slice().sort((a, b) => b.rate - a.rate || a.bal - b.bal)
               : order === 'snowball' ? d.slice().sort((a, b) => a.bal - b.bal || b.rate - a.rate) : null;
    const rows = [d.map(x => x.bal)];
    let m = 0, interest = 0, first = null;
    while (d.some(x => x.bal > 0.005) && m < 600) {
      m++;
      for (const x of d) if (x.bal > 0.005) { const it = x.bal * x.rate / 12; x.bal += it; x.interest += it; interest += it; }
      let left = prio ? budget : Infinity;
      for (const x of d) if (x.bal > 0.005) { const p = Math.min(x.bal, x.min); x.bal -= p; left -= p; }
      if (prio) for (const x of prio) { if (left <= 0) break; if (x.bal > 0.005) { const p = Math.min(x.bal, left); x.bal -= p; left -= p; } }
      for (const x of d) if (x.bal <= 0.005 && x.cleared == null) { x.bal = 0; x.cleared = m; if (first == null) first = m; }
      rows.push(d.map(x => x.bal));
    }
    return { months: m, interest, first, debts: d, rows, mins, budget, done: d.every(x => x.bal <= 0.005) };
  }
  Hyper.sim('pf-avalanche', {
    title: 'Avalanche or snowball: paying off several debts',
    blurb: `The coloured layers are the balances of each debt, month by month, under the plan you pick. Every debt gets its minimum; everything else goes to one target at a time, and each cleared debt's payment rolls into the next. The dashed line is the total under the other method; the table shows when each debt is cleared.

- With the four debts from the page, the avalanche clears Card A first (month 21) and pays the least interest; the snowball wins its first debt in month 4 for about ¤417 more.
- Choose **Smallest debt is also the dearest**: the two orders become identical.
- Choose **A big expensive card and small cheap loans**: now the snowball's quick wins cost over ¤560.
- Lower the monthly amount towards the minimums and watch every plan stretch; then try **Minimums only**.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Debts', options: [['The four debts on the page', 'page'], ['Smallest debt is also the dearest', 'same'], ['A big expensive card and small cheap loans', 'split']], value: 'page' },
        { id: 'budget', label: 'Paid towards debts each month', min: 100, max: 2000, step: 5, value: 500, fmt: v => kit.money(v, 0) },
        { id: 'order', type: 'select', label: 'Plan shown', options: [['Avalanche: highest rate first', 'avalanche'], ['Snowball: smallest balance first', 'snowball'], ['Minimums only', 'minimums']], value: 'avalanche' }
      ], (id, v) => { if (id === 'set') ctl.set('budget', DEBTS[v].budget); solve(); loop.once(); });
      const ro = kit.readout(box.side, [['min', 'Minimums add up to'], ['ava', 'Avalanche'], ['snow', 'Snowball'], ['only', 'Minimums only'], ['diff', 'Snowball costs extra']]);
      const tbl = kit.table(box.stage, [
        { label: 'Debt', key: 'name', align: 'left' }, { label: 'Balance', key: 'bal', fmt: v => kit.money(v, 0) }, { label: 'Rate', key: 'rate', fmt: v => v + ' %' },
        { label: 'Minimum', key: 'min', fmt: v => kit.money(v, 0) }, { label: 'Cleared: avalanche', key: 'ca', fmt: v => v ? 'month ' + v : '—' }, { label: 'Cleared: snowball', key: 'cs', fmt: v => v ? 'month ' + v : '—' }
      ], { maxHeight: 200 });
      const V = ctl.values;
      let R = null;
      function solve() {
        const set = DEBTS[V.set] || DEBTS.page;
        R = { ava: payoff(set.list, V.budget, 'avalanche'), snow: payoff(set.list, V.budget, 'snowball'), only: payoff(set.list, 0, 'minimums'), list: set.list };
        const say = P => P.done ? span(P.months) + ', ' + kit.money(P.interest, 0) + ' interest, first cleared in month ' + P.first : 'not within 50 years';
        ro.set('min', kit.money(R.ava.mins, 0) + (V.budget < R.ava.mins ? ' (used instead of ' + kit.money(V.budget, 0) + ')' : ''));
        ro.set('ava', say(R.ava));
        ro.set('snow', say(R.snow));
        ro.set('only', say(R.only));
        ro.set('diff', kit.money(R.snow.interest - R.ava.interest, 0));
        tbl.set(R.list.map(([name, bal, rate, min], k) => ({ name, bal, rate, min, ca: R.ava.debts[k].cleared, cs: R.snow.debts[k].cleared })));
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!R) return;
        const P = V.order === 'snowball' ? R.snow : V.order === 'minimums' ? R.only : R.ava;
        const other = V.order === 'snowball' ? R.ava : R.snow;
        const Tm = Math.max(6, P.rows.length - 1, V.order === 'minimums' ? 0 : other.rows.length - 1);
        const total0 = R.list.reduce((s, x) => s + x[1], 0);
        // four well-separated hues (the palette's first and third entries are both green here)
        const cols = [C.series[1], C.series[3], C.series[5], C.series[6]];
        const top = legend(kit, c, C, R.list.map((x, k) => [cols[k], x[0]]).concat(V.order !== 'minimums' ? [[C.text, (V.order === 'snowball' ? 'avalanche' : 'snowball') + ' total', [6, 4]]] : []), 66, 13, st.W - 12) + 10;
        const a = { x0: 66, y0: top, w: st.W - 66 - 18, h: st.H - top - 46 };
        const S = frame(kit, c, C, a, { xmax: Tm, ymin: 0, ymax: total0 * 1.08, xlabel: 'months', xstep: Hyper.niceStep(Tm, 8) });
        // stacked balances, debt by debt
        let lower = P.rows.map((r, m) => [m, 0]);
        R.list.forEach((x, k) => {
          const upper = P.rows.map((r, m) => [m, lower[m][1] + r[k]]);
          c.save(); c.globalAlpha = 0.75; c.fillStyle = cols[k];
          c.beginPath();
          upper.forEach((p, j) => j ? c.lineTo(S.X(p[0]), S.Y(p[1])) : c.moveTo(S.X(p[0]), S.Y(p[1])));
          for (let j = lower.length - 1; j >= 0; j--) c.lineTo(S.X(lower[j][0]), S.Y(lower[j][1]));
          c.closePath(); c.fill(); c.restore();
          lower = upper;
        });
        if (V.order !== 'minimums') line(c, other.rows.map((r, m) => [m, r.reduce((s, v) => s + v, 0)]), S, C.text, 1.8, [6, 4]);
        // when each debt is cleared
        P.debts.forEach((x, k) => {
          if (x.cleared == null || x.cleared > Tm) return;
          const xx = S.X(x.cleared);
          c.strokeStyle = cols[k]; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xx, a.y0 + a.h); c.lineTo(xx, a.y0 + a.h - 10); c.stroke();
          kit.dot(c, xx, a.y0 + a.h - 12, 4, cols[k], C.bg2);
        });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ insurance: a bet you hope to lose */
  const RISKS = {
    ruin: { p: 1, L: 200000, k: 30, D: 1000, W0: 30000, s: 6000 },
    car: { p: 5, L: 8000, k: 35, D: 500, W0: 3000, s: 3000 },
    small: { p: 10, L: 500, k: 60, D: 50, W0: 3000, s: 3000 }
  };
  Hyper.sim('pf-insurance', {
    title: 'Insurance: a bet you hope to lose',
    blurb: `The same 300 households live 40 years twice: once **without insurance** and once **insured**, meeting exactly the same accidents. Each year they save a fixed amount (no interest, to keep the comparison plain); a loss strikes at random with the chance you set. Thin lines are single households, the bold line their average, the dashed line the unlucky 5 %. The red band is below zero: debt.

- **A rare, ruinous loss**: most uninsured households never meet the loss and end richer than the insured by all the premiums they skipped. On average the insured end poorer only by the loading. But about one uninsured household in four is ruined — and no insured one.
- **A frequent small loss**: insurance only costs money, and no one is ruined either way. Carry it yourself.
- On **the car accident**, raise the deductible: the premium falls noticeably, while the protection against the big loss barely changes — as long as savings can pay the deductible.
- Press **New lives** to draw a different set of accidents.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const m0 = v => kit.money(v, 0);
      const start = RISKS[params && params.preset] ? params.preset : 'ruin';
      const R0 = RISKS[start];
      const ctl = kit.controls(box.side, [
        { id: 'risk', type: 'select', label: 'The risk', options: [['A rare, ruinous loss', 'ruin'], ['Somewhere between: a car accident', 'car'], ['A frequent small loss: a broken phone', 'small']], value: start },
        { id: 'p', label: 'Chance of the loss each year', min: 0.1, max: 20, step: 0.1, value: R0.p, unit: '%' },
        { id: 'L', label: 'Size of the loss', min: 100, max: 500000, value: R0.L, log: true, sig: 2, fmt: m0 },
        { id: 'k', label: 'Insurer\'s loading (costs and profit)', min: 0, max: 100, step: 1, value: R0.k, unit: '%' },
        { id: 'D', label: 'Deductible (you pay)', min: 0, max: 20000, step: 50, value: R0.D, fmt: m0 },
        { id: 'W0', label: 'Savings at the start', min: 0, max: 300000, step: 1000, value: R0.W0, fmt: m0 },
        { id: 's', label: 'Saved each year', min: 0, max: 30000, step: 500, value: R0.s, fmt: m0 },
        { type: 'buttons', items: [{ id: 'again', label: 'New lives', primary: true }] }
      ], (id, v) => {
        if (id === 'risk') for (const [key, x] of Object.entries(RISKS[v] || {})) ctl.set(key, x);
        if (id === 'again') seed++;
        simulate(); loop.once();
      });
      const ro = kit.readout(box.side, [['exp', 'Expected loss a year'], ['prem', 'Premium a year'], ['cost', 'Insurance costs on average'], ['ruin', 'Ever below zero'], ['avg', 'Average after 40 years'], ['med', 'Typical (median) after 40 years'], ['low', 'Unlucky 5 % end below']]);
      const V = ctl.values;
      const N = 300, Y = 40;
      let seed = 11, S = null;

      function simulate() {
        const p = V.p / 100, D = Math.min(V.D, V.L);
        const premium = (1 + V.k / 100) * p * (V.L - D);
        const rnd = Hyper.util.rng(seed * 7919 + 13);
        const out = { none: [], ins: [], premium, D };
        for (let h = 0; h < N; h++) {
          let a = V.W0, b = V.W0, lowA = a, lowB = b;
          const pa = [a], pb = [b];
          for (let y = 1; y <= Y; y++) {
            const hit = rnd() < p;
            a += V.s - (hit ? V.L : 0);
            b += V.s - premium - (hit ? D : 0);
            lowA = Math.min(lowA, a); lowB = Math.min(lowB, b);
            pa.push(a); pb.push(b);
          }
          out.none.push({ path: pa, low: lowA }); out.ins.push({ path: pb, low: lowB });
        }
        const q = (arr, y, f) => { const col = arr.map(x => x.path[y]).sort((u, v) => u - v); return col[Math.min(col.length - 1, Math.floor(f * col.length))]; };
        for (const key of ['none', 'ins']) {
          const g = out[key];
          g.med = []; g.p5 = []; g.avg = [];
          for (let y = 0; y <= Y; y++) {
            g.med.push([y, q(g, y, 0.5)]); g.p5.push([y, q(g, y, 0.05)]);
            g.avg.push([y, g.reduce((s, x) => s + x.path[y], 0) / N]);
          }
          g.ruined = g.filter(x => x.low < 0).length / N;
        }
        S = out;
        ro.set('exp', kit.money(p * V.L, 0));
        ro.set('prem', kit.money(premium, 0) + (D > 0 ? ' (deductible ' + kit.money(D, 0) + ')' : ''));
        ro.set('cost', kit.money(premium - p * (V.L - D), 0) + ' a year, ' + kit.money(Y * (premium - p * (V.L - D)), 0) + ' over ' + Y + ' years');
        ro.set('ruin', 'uninsured ' + kit.pct(out.none.ruined, 0) + ' · insured ' + kit.pct(out.ins.ruined, 0));
        ro.set('avg', 'uninsured ' + kit.money(out.none.avg[Y][1], 0) + ' · insured ' + kit.money(out.ins.avg[Y][1], 0));
        ro.set('med', 'uninsured ' + kit.money(out.none.med[Y][1], 0) + ' · insured ' + kit.money(out.ins.med[Y][1], 0));
        ro.set('low', 'uninsured ' + kit.money(out.none.p5[Y][1], 0) + ' · insured ' + kit.money(out.ins.p5[Y][1], 0));
      }
      function panel(c, C, a, g, title, col, lo, hi) {
        const Sx = frame(kit, c, C, a, { xmax: Y, ymin: lo, ymax: hi, xstep: 10, xlabel: 'years', yn: 4 });
        if (lo < 0) { c.save(); c.globalAlpha = 0.12; c.fillStyle = C.bad; c.fillRect(a.x0, Sx.Y(0), a.w, a.y0 + a.h - Sx.Y(0)); c.restore(); }
        c.save(); c.globalAlpha = 0.16;
        for (let h = 0; h < N; h += 2) line(c, g[h].path.map((v, y) => [y, v]), Sx, col, 1);
        c.restore();
        line(c, g.p5, Sx, C.warn, 2, [6, 4]);
        line(c, g.avg, Sx, C.text, 2.4);
        kit.label(c, title, a.x0, a.y0 - 12, { size: 12.5, weight: 600, color: col });
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!S) return;
        let lo = 0, hi = 1;
        for (const g of [S.none, S.ins]) for (const x of g) for (const v of x.path) { if (v < lo) lo = v; if (v > hi) hi = v; }
        const pad = (hi - lo) * 0.05;
        const wide = st.W >= 560;
        if (wide) {
          const w = (st.W - 70 - 60 - 18) / 2;
          panel(c, C, { x0: 70, y0: 30, w, h: st.H - 30 - 46 }, S.none, 'Without insurance', C.bad, lo - pad, hi + pad);
          panel(c, C, { x0: 70 + w + 60, y0: 30, w, h: st.H - 30 - 46 }, S.ins, 'Insured', C.ok, lo - pad, hi + pad);
        } else {
          const h = (st.H - 30 - 46 - 60) / 2;
          panel(c, C, { x0: 62, y0: 30, w: st.W - 62 - 12, h }, S.none, 'Without insurance', C.bad, lo - pad, hi + pad);
          panel(c, C, { x0: 62, y0: 30 + h + 60, w: st.W - 62 - 12, h }, S.ins, 'Insured', C.ok, lo - pad, hi + pad);
        }
      }
      simulate();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a Ponzi scheme */
  // month by month: statements credit the promised return; withdrawals are paid from the cash that
  // new investors bring (less what the operator takes). Each month's newcomers are a cohort, so we
  // can see who came out ahead. The scheme collapses the first month it cannot pay what is asked.
  function ponzi(o) {
    const rm = Math.pow(1 + o.R, 1 / 12) - 1;
    let claimed = 0, cash = 0, inflow = o.N0, tin = 0, tout = 0, taken = 0, fellAt = null, collapse = null;
    const rows = [], cohorts = [];
    for (let t = 1; t <= o.T; t++) {
      if (t > 1) { if (t <= o.ts) inflow *= 1 + o.g; else { inflow *= 1 - o.f; if (fellAt == null) fellAt = t; } }
      const w = o.w * (o.panic && fellAt != null ? 2 : 1);
      for (const k of cohorts) k.bal *= 1 + rm;
      claimed *= 1 + rm;
      const request = w * claimed;
      const avail = cash + inflow * (1 - o.skim);
      const paid = Math.min(request, avail), share = request > 0 ? paid / request : 1;
      for (const k of cohorts) { const want = w * k.bal; k.out += want * share; k.bal -= want; }
      cohorts.push({ t, put: inflow, bal: inflow, out: 0 });
      cash = avail - paid; taken += inflow * o.skim;
      claimed += inflow - request;
      tin += inflow; tout += paid;
      rows.push({ t, inflow, paid, claimed, cash });
      if (paid < request - 1e-6) { collapse = t; break; }
    }
    return { rows, cohorts, collapse, claimed, cash, tin, tout, taken, fellAt, rm };
  }
  Hyper.sim('pf-ponzi', {
    title: 'A Ponzi scheme: paid with new money until it stops',
    blurb: `A scheme promises a steady return and credits it on every statement, but invests nothing: withdrawals are paid out of newcomers' money, after the operator takes a cut. Top: what investors are **told** they have against the **cash** that actually exists. Bottom: for each month's newcomers, what they finally got back minus what they put in.

- With the defaults, new money grows for two years and then fades. The scheme keeps paying for years on momentum — every early investor is a satisfied witness — and then collapses in a single month.
- Tick **Rumours**: when new money falls, withdrawals double, and the end comes almost two years sooner.
- Raise the **promised return**: the statements balloon faster, and the collapse comes earlier.
- Look at the bottom chart: when it collapses, the late investors' losses are exactly the early investors' gains plus the operator's cut. Nothing was ever earned.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Promised return a year', min: 5, max: 100, step: 1, value: 20, unit: '%' },
        { id: 'g', label: 'New money grows each month at first', min: 0, max: 15, step: 0.5, value: 6, unit: '%' },
        { id: 'ts', label: 'Months of growing new money', min: 6, max: 60, step: 1, value: 24 },
        { id: 'f', label: 'Then new money shrinks each month by', min: 0, max: 20, step: 0.5, value: 5, unit: '%' },
        { id: 'w', label: 'Investors withdraw each month', min: 0.5, max: 5, step: 0.1, value: 1.5, unit: '% of balance' },
        { id: 'skim', label: 'The operator takes', min: 0, max: 30, step: 1, value: 10, unit: '% of new money' },
        { id: 'panic', type: 'check', label: 'Rumours: withdrawals double once new money falls', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['prom', 'Promised'], ['col', 'Collapses in'], ['told', 'Statements then show'], ['flows', 'Paid in · paid out'], ['op', 'Kept by the operator'], ['who', 'Came out ahead']]);
      const V = ctl.values;
      const T = 180;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const P = ponzi({ R: V.R / 100, N0: 100000, g: V.g / 100, ts: Math.round(V.ts), f: V.f / 100, w: V.w / 100, skim: V.skim / 100, T, panic: V.panic });
        const end = P.collapse || T;
        const xmax = Math.max(12, end);
        const hTop = Math.round((st.H - 24) * 0.55);
        // top: told against real
        const top = legend(kit, c, C, [[C.warn, 'what statements say investors have', []], [blue(kit), 'cash that actually exists']], 70, 13, st.W - 12) + 10;
        const a = { x0: 70, y0: top, w: st.W - 70 - 18, h: hTop - top - 36 };
        const hi = Math.max(1, ...P.rows.map(r => Math.max(r.claimed, r.cash)));
        const S1 = frame(kit, c, C, a, { xmax, ymin: 0, ymax: hi * 1.08, xstep: Hyper.niceStep(xmax, 8) });
        const cashPts = [[0, 0]].concat(P.rows.map(r => [r.t, r.cash]));
        c.save(); c.globalAlpha = 0.5; c.fillStyle = blue(kit); c.beginPath(); c.moveTo(S1.X(0), S1.Y(0));
        cashPts.forEach(p => c.lineTo(S1.X(p[0]), S1.Y(p[1]))); c.lineTo(S1.X(end), S1.Y(0)); c.closePath(); c.fill(); c.restore();
        line(c, [[0, 0]].concat(P.rows.map(r => [r.t, r.claimed])), S1, C.warn, 2.6);
        const vline = (S, t, text, col, dy, right) => {
          const x = S.X(t);
          c.save(); c.strokeStyle = col; c.lineWidth = 1.5; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(x, a.y0); c.lineTo(x, a.y0 + a.h); c.stroke(); c.restore();
          kit.label(c, text, right ? x - 4 : x + 4, a.y0 + dy, { size: 11, color: col, align: right ? 'right' : 'left', bg: C.bg2 });
        };
        if (P.fellAt && P.fellAt <= end) vline(S1, P.fellAt, 'new money starts to fall', C.muted, 10, false);
        if (P.collapse) vline(S1, P.collapse, 'collapse', C.bad, 30, true);
        // bottom: who won and who lost, by month of joining
        const b = { x0: 70, y0: hTop + 22, w: st.W - 70 - 18, h: st.H - hTop - 22 - 42 };
        const net = P.cohorts.map(k => [k.t, k.out - k.put]);
        const lo = Math.min(0, ...net.map(p => p[1])), up = Math.max(1, ...net.map(p => p[1]));
        const S2 = frame(kit, c, C, b, { xmax, ymin: lo * 1.1, ymax: up * 1.1 + (up - lo) * 0.02, xstep: Hyper.niceStep(xmax, 8), yn: 4, xlabel: 'month the investors joined' });
        const bw = Math.max(1, b.w / xmax * 0.8);
        for (const [t, v] of net) {
          c.fillStyle = v >= 0 ? C.ok : C.bad;
          const y0 = S2.Y(0), y1 = S2.Y(v);
          c.fillRect(S2.X(t) - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0));
        }
        kit.label(c, 'got back minus put in', b.x0, b.y0 - 10, { size: 11.5, color: C.muted });
        // read-outs
        ro.set('prom', kit.pct(P.rm, 2) + ' a month, ' + V.R + ' % a year');
        ro.set('col', P.collapse ? 'month ' + P.collapse + ' (' + (P.collapse / 12).toFixed(1) + ' years)' : 'not within ' + T / 12 + ' years — yet');
        ro.set('told', kit.money(P.claimed, 0));
        ro.set('flows', kit.money(P.tin, 0) + ' · ' + kit.money(P.tout, 0));
        ro.set('op', kit.money(P.taken, 0) + (P.collapse ? '' : ' so far'));
        const winners = P.cohorts.filter(k => k.out >= k.put);
        const last = winners.length ? winners[winners.length - 1].t : null;
        const lostPut = P.cohorts.filter(k => k.out < k.put).reduce((s, k) => s + k.put, 0);
        if (!P.collapse) ro.set('who', 'not settled yet: on paper everyone is ahead, but the cash cannot cover the statements');
        else ro.set('who', last ? 'only those who joined by month ' + last + '; later investors, who brought ' + kit.pct(lostPut / P.tin, 0) + ' of all the money, lost' : 'no one');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
