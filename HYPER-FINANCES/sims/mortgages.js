/* HYPER-FINANCES · sims/mortgages.js — simulations for Mortgages and Property:
 *   mg-ltv         the deposit, loan-to-value and equity (negative equity when prices fall)
 *   mg-rate-paths  a fixed and a variable loan run through the same rate scenario
 *   mg-cpi-linked  an inflation-linked loan against an unlinked one, in money of the day or today's money
 *   mg-mix         a mortgage built from tracks: expected cost against the worst stressed payment
 *   mg-afford      affordability: income limits, a stress-tested rate and the largest loan
 *   mg-fee-rate    a fee or a higher rate: the true yearly cost by how long you keep the loan
 *   mg-rent-buy    two households, one renting and one buying, over thirty years
 *   mg-leverage    the return on your own money at different loan-to-values as prices move
 * Loans are computed by kit.fin (amortize, payment, affordable, irr); money is shown with kit.money. */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pctAxis = dec => v => v.toFixed(dec || 0) + ' %';

  /* a chart frame: gridlines, tick labels and axis titles; returns the mappings X(v), Y(v) */
  function chart(kit, c, C, o) {
    let xmin = o.xmin, xmax = o.xmax, ymin = o.ymin, ymax = o.ymax;
    if (!Number.isFinite(xmin)) xmin = 0;
    if (!Number.isFinite(xmax) || !(xmax > xmin)) xmax = xmin + 1;
    if (!Number.isFinite(ymin)) ymin = 0;
    if (!Number.isFinite(ymax) || !(ymax > ymin)) ymax = ymin + 1;
    const X = v => o.x0 + (v - xmin) / (xmax - xmin) * o.w;
    const Y = v => o.y0 + o.h - (v - ymin) / (ymax - ymin) * o.h;
    c.save();
    c.font = FONT; c.lineWidth = 1;
    const ys = Hyper.niceStep(ymax - ymin, o.ny || 5);
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(ymin / ys - 1e-9) * ys, n = 0; v <= ymax + ys * 1e-6 && n < 40; v += ys, n++) {
      const zero = Math.abs(v) < ys * 1e-6, y = Y(v);
      c.strokeStyle = zero ? C.axis : C.grid;
      c.beginPath(); c.moveTo(o.x0, y); c.lineTo(o.x0 + o.w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(o.yfmt(zero ? 0 : v), o.x0 - 6, y);
    }
    if (!o.noX) {
      const xs = o.xs || Hyper.niceStep(xmax - xmin, o.nx || 6);
      c.textAlign = 'center'; c.textBaseline = 'top';
      for (let v = Math.ceil(xmin / xs - 1e-9) * xs, n = 0; v <= xmax + xs * 1e-6 && n < 60; v += xs, n++) {
        const zero = Math.abs(v) < xs * 1e-6, x = X(v);
        c.strokeStyle = zero && xmin < 0 ? C.axis : C.grid;
        c.beginPath(); c.moveTo(x, o.y0); c.lineTo(x, o.y0 + o.h); c.stroke();
        c.fillStyle = C.muted; c.fillText(o.xfmt ? o.xfmt(zero ? 0 : v) : String(Math.round(v * 100) / 100), x, o.y0 + o.h + 5);
      }
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    c.beginPath(); c.moveTo(o.x0, o.y0); c.lineTo(o.x0, o.y0 + o.h); c.lineTo(o.x0 + o.w, o.y0 + o.h); c.stroke();
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, o.x0 + o.w, o.y0 + o.h + 26, { size: 11.5, color: C.muted, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, o.x0, o.y0 - 13, { size: 11.5, color: C.muted });
    return { X, Y, xmin, xmax, ymin, ymax };
  }
  /* a polyline through [x, y] points, clipped to a rectangle */
  function line(c, pts, X, Y, color, width, dash, clip) {
    c.save();
    if (clip) { c.beginPath(); c.rect(clip[0], clip[1], clip[2], clip[3]); c.clip(); }
    c.strokeStyle = color; c.lineWidth = width || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath();
    let pen = false;
    for (const p of pts) {
      if (!Number.isFinite(p[0]) || !Number.isFinite(p[1])) { pen = false; continue; }
      const x = X(p[0]), y = Y(p[1]);
      if (pen) c.lineTo(x, y); else c.moveTo(x, y);
      pen = true;
    }
    c.stroke();
    c.restore();
  }
  /* a row of legend entries [color, text, dash] */
  function legend(kit, c, C, items, x, y) {
    c.save();
    c.font = '11.5px system-ui, sans-serif';
    let xx = x;
    for (const it of items) {
      c.strokeStyle = it[0]; c.lineWidth = 3; c.setLineDash(it[2] || []);
      c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke();
      c.setLineDash([]);
      kit.label(c, it[1], xx + 21, y, { size: 11.5, color: C.text2 });
      xx += 21 + c.measureText(it[1]).width + 18;
    }
    c.restore();
  }
  /* the balance of a level-payment loan after k payments */
  function balanceAfter(P, i, n, k) {
    if (k >= n) return 0;
    const M = Hyper.finance.payment(P, i, n);
    if (Math.abs(i) < 1e-12) return P - M * k;
    return P * Math.pow(1 + i, k) - M * (Math.pow(1 + i, k) - 1) / i;
  }
  const years = y => (Math.round(y * 10) / 10) + (y === 1 ? ' year' : ' years');

  /* ================================================================ deposit, LTV and equity */
  Hyper.sim('mg-ltv', {
    title: 'Deposit, loan-to-value and your equity',
    blurb: `The left column is the day you buy: your **deposit** and the **loan**. The right column is the home some years later: what you still **owe** and your **equity** — or, if prices have fallen far enough, the **negative equity** in red. The ruler below shows the loan-to-value then and now.

- With the defaults (10 % down, three years in), lower the price change to −15 %: the home is now worth less than the debt.
- Raise the deposit to 25 % and repeat: the same fall leaves you comfortably above water.
- Set the price change to zero and move *Years since buying*: in the first years the balance hardly moves — the deposit is almost your whole cushion.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Price of the home', min: 50000, max: 3000000, value: 300000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'dep', label: 'Deposit', min: 0, max: 60, step: 1, value: 10, unit: '%' },
        { id: 'r', label: 'Mortgage rate', min: 0, max: 12, step: 0.1, value: 5, unit: '%' },
        { id: 'T', label: 'Term', min: 5, max: 40, step: 1, value: 30, unit: 'years' },
        { id: 'yrs', label: 'Years since buying', min: 0, max: 40, step: 1, value: 3, unit: 'years' },
        { id: 'chg', label: 'Price change since buying', min: -50, max: 50, step: 1, value: 0, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['loan', 'Loan at purchase'], ['bal', 'Still owed now'], ['val', 'Home worth now'], ['eq', 'Your equity'], ['ltv', 'Loan-to-value now'], ['cush', 'Fall that wipes it out']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const P = V.V, L = P * (1 - V.dep / 100), n = Math.round(V.T * 12), k = Math.min(n, Math.round(V.yrs * 12));
        const i = V.r / 100 / 12;
        const B = L > 0 ? Math.max(0, balanceAfter(L, i, n, k)) : 0;
        const Vn = P * (1 + V.chg / 100), E = Vn - B;
        const ltv0 = L / P, ltv1 = Vn > 0 ? B / Vn : 0;
        // money axis and the two columns
        const x0 = 70, y0 = 34, w = W - x0 - 24, h = Hh - y0 - 108;
        const top = Math.max(P, Vn, B) * 1.12;
        const g = chart(kit, c, C, { x0, y0, w, h, xmin: 0, xmax: 1, ymin: 0, ymax: top, yfmt: v => kit.money(v, 0, true), noX: true, ylabel: 'value and debt' });
        const bw = Math.min(120, w * 0.2), cx1 = x0 + w * 0.2, cx2 = x0 + w * 0.56;
        const seg = (cx, a, b, col, alpha, text) => {
          if (b <= a) return;
          const ya = g.Y(a), yb = g.Y(b);
          c.globalAlpha = alpha; c.fillStyle = col; c.fillRect(cx - bw / 2, yb, bw, ya - yb); c.globalAlpha = 1;
          if (ya - yb > 17 && text) kit.label(c, text, cx, (ya + yb) / 2, { size: 11.5, color: C.text, align: 'center', weight: 600 });
        };
        seg(cx1, 0, L, C.accent, 0.85, 'loan ' + kit.money(L, 0, true));
        seg(cx1, L, P, C.ok, 0.85, 'deposit ' + kit.money(P - L, 0, true));
        kit.label(c, 'the day you buy', cx1, y0 + h + 14, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, kit.money(P, 0, true), cx1, g.Y(P) - 10, { size: 11.5, color: C.text2, align: 'center' });
        if (E >= 0) {
          seg(cx2, 0, B, C.accent, 0.85, B > 0 ? 'owed ' + kit.money(B, 0, true) : '');
          seg(cx2, B, Vn, C.ok, 0.85, 'equity ' + kit.money(E, 0, true));
        } else {
          seg(cx2, 0, Vn, C.accent, 0.85, 'owed, covered ' + kit.money(Vn, 0, true));
          seg(cx2, Vn, B, C.bad, 0.55, '');
          kit.label(c, 'negative equity ' + kit.money(E, 0, true), cx2 + bw / 2 + 8, (g.Y(Vn) + g.Y(B)) / 2, { size: 12, color: C.bad, weight: 600 });
        }
        kit.label(c, 'after ' + years(k / 12), cx2, y0 + h + 14, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'worth ' + kit.money(Vn, 0, true), cx2, g.Y(Math.max(Vn, B)) - 10, { size: 11.5, color: C.text2, align: 'center' });
        // the balance now, drawn across both columns: how far it has come down
        if (B > 0) line(c, [[0, B], [1, B]], v => cx1 - bw / 2 + v * (cx2 + bw / 2 - cx1 + bw / 2), g.Y, C.text, 1.2, [4, 4]);
        // the LTV ruler
        const ry = Hh - 40, rx0 = x0, rw = w, lmax = 1.2, RX = v => rx0 + clamp(v, 0, lmax) / lmax * rw;
        const bands = [[0, 0.6, C.ok, 'best rates'], [0.6, 0.8, C.accent, ''], [0.8, 1, C.warn, 'insurance often needed'], [1, lmax, C.bad, 'negative equity']];
        for (const [a, b, col, t] of bands) {
          c.globalAlpha = 0.2; c.fillStyle = col; c.fillRect(RX(a), ry - 9, RX(b) - RX(a), 18); c.globalAlpha = 1;
          if (t) kit.label(c, t, (RX(a) + RX(b)) / 2, ry - 20, { size: 11, color: C.muted, align: 'center' });
        }
        c.save(); c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let v = 0; v <= lmax + 1e-9; v += 0.2) c.fillText(Math.round(v * 100) + ' %', RX(v), ry + 12);
        c.restore();
        kit.label(c, 'loan-to-value', rx0 - 6, ry, { size: 11.5, color: C.muted, align: 'right' });
        c.save(); c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(RX(ltv0), ry, 6, 0, Math.PI * 2); c.stroke(); c.restore();
        kit.dot(c, RX(ltv1), ry, 6, E >= 0 ? C.accent : C.bad, C.bg2);
        kit.label(c, 'then ○  now ●', rx0 + rw, ry - 20, { size: 11, color: C.text2, align: 'right' });
        // read-outs
        ro.set('loan', kit.money(L, 0) + ' (LTV ' + kit.pct(ltv0, 0) + ')');
        ro.set('bal', kit.money(B, 0) + (L > 0 ? ' (' + kit.pct(1 - B / L, 1) + ' repaid)' : ''));
        ro.set('val', kit.money(Vn, 0));
        ro.set('eq', kit.money(E, 0) + (Vn > 0 ? ' (' + kit.pct(E / Vn, 1) + ' of the value)' : ''));
        ro.set('ltv', kit.pct(ltv1, 1));
        ro.set('cush', E > 0 && Vn > 0 ? 'a fall of ' + kit.pct(1 - B / Vn, 1) + ' from here' : E === 0 ? 'none left' : 'already underwater');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ fixed against variable */
  const SCEN = {
    flat: () => 0,
    rise: t => Math.min(1, t / 3),
    spike: t => t < 1.5 ? t / 1.5 : t < 3.5 ? 1 : Math.max(0.4, 1 - 0.6 * (t - 3.5) / 3),
    fall: t => -Math.min(1, t / 3),
    cycle: t => Math.sin(2 * Math.PI * t / 8)
  };
  Hyper.sim('mg-rate-paths', {
    title: 'Fixed or variable: the payment when rates move',
    blurb: `Two loans for the same amount run through the same **rate scenario**. The top panel shows the rates, the bottom one the monthly payments. The variable loan follows the market month by month. The fixed loan keeps its rate for the fixed period; if that is shorter than the term, at each reset it takes a new fix at the market's fixed rate of the day (today's fixed rate moved by the same amount as the market).

- *A sharp spike, then easing* with a five-year fix: the variable borrower feels the spike at once; the fixed borrower meets what is left of it at the reset.
- Try a two-year fix in *A steady rise*: the fix only delays the shock.
- In *A fall* the variable loan wins, and the fixed borrower would need to [[refinancing|refinance]] to catch up.
- Look at the total interest: which loan was cheaper depends entirely on the scenario — which nobody knows in advance.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 50000, max: 2000000, value: 250000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'T', label: 'Term', min: 10, max: 35, step: 1, value: 25, unit: 'years' },
        { id: 'rf', label: 'Fixed rate today', min: 0.5, max: 10, step: 0.05, value: 5, unit: '%' },
        { id: 'rv', label: 'Variable rate today', min: 0.5, max: 10, step: 0.05, value: 4, unit: '%' },
        { id: 'fix', type: 'select', label: 'Fixed for', options: [['the whole term', 0], ['10 years, then refix', 10], ['5 years, then refix', 5], ['2 years, then refix', 2]], value: p.fix != null ? p.fix : 0 },
        { id: 'scen', type: 'select', label: 'Rate scenario', options: [['A steady rise', 'rise'], ['A sharp spike, then easing', 'spike'], ['A fall', 'fall'], ['Ups and downs', 'cycle'], ['Rates stay where they are', 'flat']], value: p.scenario || 'rise' },
        { id: 'size', label: 'Size of the move', min: 0, max: 6, step: 0.25, value: 3, unit: 'points' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['f', 'Fixed: first → highest payment'], ['v', 'Variable: first → highest payment'], ['shock', 'Largest variable payment vs first'], ['ti', 'Total interest, fixed / variable'], ['d', 'Over the whole loan']]);
      const V = ctl.values;
      let A = null, B = null;
      function solve() {
        const s = SCEN[V.scen] || SCEN.flat, size = V.size / 100, fix = +V.fix;
        const mkt = k => size * s((k - 1) / 12);
        const vr = k => Math.max(0.0025, V.rv / 100 + mkt(k));
        const fr = k => {
          if (!fix) return V.rf / 100;
          const start = Math.floor((k - 1) / (12 * fix)) * 12 * fix + 1;
          return Math.max(0.0025, V.rf / 100 + mkt(start));
        };
        A = kit.fin.amortize({ principal: V.P, years: V.T, rates: fr });
        B = kit.fin.amortize({ principal: V.P, years: V.T, rates: vr });
        const fa = A.rows[0].payment, fb = B.rows[0].payment, ma = A.maxPayment, mb = B.maxPayment;
        ro.set('f', kit.money(fa) + ' → ' + kit.money(ma));
        ro.set('v', kit.money(fb) + ' → ' + kit.money(mb));
        const kmax = B.rows.findIndex(r => r.payment >= mb - 0.005);   // the first month at the peak (the last payment can exceed it by a rounding hair)
        ro.set('shock', (mb > fb * 1.0005 ? '+' + kit.pct(mb / fb - 1, 0) + ' (' + kit.money(mb - fb) + ' a month, year ' + (kmax >= 0 ? Math.ceil((kmax + 1) / 12) : 1) + ')' : 'none: it never rises'));
        ro.set('ti', kit.money(A.totals.interest, 0) + ' / ' + kit.money(B.totals.interest, 0));
        const dd = A.totals.interest - B.totals.interest;
        ro.set('d', Math.abs(dd) < 1 ? 'they cost the same' : dd > 0 ? 'variable was cheaper by ' + kit.money(dd, 0) : 'fixed was cheaper by ' + kit.money(-dd, 0));
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!A || !B) return;
        const W = st.W, Hh = st.H;
        const x0 = 70, w = W - x0 - 24;
        const h1 = Math.max(70, (Hh - 110) * 0.36), y1 = 36, y2 = y1 + h1 + 44, h2 = Hh - y2 - 44;
        const ra = A.rows.map(r => [(r.k - 1) / 12, r.rate * 100]), rb = B.rows.map(r => [(r.k - 1) / 12, r.rate * 100]);
        const allR = ra.concat(rb).map(q => q[1]);
        const rlo = Math.max(0, Math.min(...allR) - 0.5), rhi = Math.max(...allR) + 0.5;
        const g1 = chart(kit, c, C, { x0, y0: y1, w, h: h1, xmin: 0, xmax: V.T, ymin: rlo, ymax: rhi, ny: 3, yfmt: v => (Math.round(v * 10) / 10) + ' %', ylabel: 'interest rate' });
        line(c, rb, g1.X, g1.Y, C.warn, 2.2);
        line(c, ra, g1.X, g1.Y, C.accent, 2.2);
        const pa = A.rows.map(r => [(r.k - 1) / 12, r.payment]), pb = B.rows.map(r => [(r.k - 1) / 12, r.payment]);
        const allP = pa.concat(pb).map(q => q[1]);
        const plo = Math.min(...allP) * 0.85, phi = Math.max(...allP) * 1.06;
        const g2 = chart(kit, c, C, { x0, y0: y2, w, h: h2, xmin: 0, xmax: V.T, ymin: plo, ymax: phi, ny: 4, yfmt: v => kit.money(v, 0), xlabel: 'years', ylabel: 'monthly payment' });
        line(c, pb, g2.X, g2.Y, C.warn, 2.4);
        line(c, pa, g2.X, g2.Y, C.accent, 2.4);
        if (+V.fix) for (let t = +V.fix; t < V.T; t += +V.fix) line(c, [[t, plo], [t, phi]], g2.X, g2.Y, C.faint, 1, [3, 4]);
        legend(kit, c, C, [[C.accent, 'fixed'], [C.warn, 'variable']], x0 + w - 170, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ linked against unlinked */
  Hyper.sim('mg-cpi-linked', {
    title: 'Inflation-linked or unlinked?',
    blurb: `The same loan as an **unlinked fixed rate** and as a **CPI-linked real rate**. On the linked loan the balance is raised every month by inflation and the payment recalculated, so both grow with prices. Switch the view to *today's money* to see the same paths with inflation taken out: the linked payment becomes a flat line.

- With the defaults the linked payment starts about ¤330 lower but overtakes the unlinked one in the ninth year.
- Set inflation to 4 %: the linked balance climbs above the amount borrowed and stays there for years.
- Find the break-even: the inflation at which the two loans cost the same (shown in the read-out). Below it the linked loan is cheaper, above it the unlinked one.
- Set inflation to 0: the linked loan is just a loan at the real rate.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 50000, max: 2000000, value: 300000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'T', label: 'Term', min: 5, max: 35, step: 1, value: 25, unit: 'years' },
        { id: 'rn', label: 'Unlinked fixed rate', min: 0.5, max: 12, step: 0.05, value: 5, unit: '%' },
        { id: 'rr', label: 'Linked real rate', min: 0, max: 8, step: 0.05, value: 3, unit: '%' },
        { id: 'pi', label: 'Inflation', min: -1, max: 10, step: 0.1, value: 2.5, unit: '% a year' },
        { id: 'view', type: 'select', label: 'Show amounts in', options: [['money of the day', 'nominal'], ['today\'s money', 'real']], value: 'nominal' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['first', 'First payment, unlinked / linked'], ['y10', 'Payment in year 10'], ['over', 'Linked payment overtakes'], ['peak', 'Linked balance'], ['eq', 'Linked loan costs, as a money rate'], ['be', 'Break-even inflation']]);
      const V = ctl.values;
      let U = null, Lk = null;
      function solve() {
        const pi = V.pi / 100, rn = V.rn / 100, rr = V.rr / 100;
        U = kit.fin.amortize({ principal: V.P, annual: rn, years: V.T });
        Lk = kit.fin.amortize({ principal: V.P, annual: rr, years: V.T, inflation: pi });
        ro.set('first', kit.money(U.rows[0].payment) + ' / ' + kit.money(Lk.rows[0].payment));
        const k10 = Math.min(120, Lk.rows.length) - 1;
        ro.set('y10', (k10 < 119 ? 'last (year ' + Math.ceil((k10 + 1) / 12) + '): ' : '') + kit.money(U.rows[k10].payment) + ' / ' + kit.money(Lk.rows[k10].payment));
        const ov = Lk.rows.findIndex((r, j) => r.payment > U.rows[j].payment);
        ro.set('over', ov < 0 ? 'never' : ov === 0 ? 'from the start' : 'in year ' + Math.ceil((ov + 1) / 12));
        let peak = 0, pk = 0;
        Lk.rows.forEach(r => { if (r.balance > peak) { peak = r.balance; pk = r.k; } });
        const back = Lk.rows.findIndex(r => r.k > pk && r.balance < V.P);
        ro.set('peak', peak > V.P ? 'peaks at ' + kit.money(peak, 0) + ' in year ' + Math.ceil(pk / 12) + (back >= 0 ? ', below the loan again in year ' + Math.ceil((back + 1) / 12) : '') : 'never above the amount borrowed');
        const eq = 12 * ((1 + rr / 12) * Math.pow(1 + pi, 1 / 12) - 1);
        ro.set('eq', kit.pct(eq) + (Math.abs(eq - rn) < 5e-5 ? ': the same' : eq < rn ? ': cheaper than ' + kit.pct(rn) : ': dearer than ' + kit.pct(rn)));
        const be = Math.pow((1 + rn / 12) / (1 + rr / 12), 12) - 1;
        ro.set('be', kit.pct(be) + ' a year');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!U || !Lk) return;
        const W = st.W, Hh = st.H;
        const real = V.view === 'real', pi = V.pi / 100;
        const d = k => real ? Math.pow(1 + pi, k / 12) : 1;
        const x0 = 76, w = W - x0 - 24;
        const h1 = Math.max(70, (Hh - 110) * 0.44), y1 = 36, y2 = y1 + h1 + 44, h2 = Hh - y2 - 44;
        const pu = U.rows.map(r => [r.k / 12, r.payment / d(r.k)]), pl = Lk.rows.map(r => [r.k / 12, r.payment / d(r.k)]);
        const allP = pu.concat(pl).map(q => q[1]);
        const g1 = chart(kit, c, C, { x0, y0: y1, w, h: h1, xmin: 0, xmax: V.T, ymin: Math.min(...allP) * 0.85, ymax: Math.max(...allP) * 1.06, ny: 4, yfmt: v => kit.money(v, 0), ylabel: 'monthly payment' + (real ? ', today\'s money' : '') });
        line(c, pu, g1.X, g1.Y, C.accent, 2.4);
        line(c, pl, g1.X, g1.Y, C.warn, 2.4);
        const bu = [[0, V.P]].concat(U.rows.map(r => [r.k / 12, r.balance / d(r.k)])), bl = [[0, V.P]].concat(Lk.rows.map(r => [r.k / 12, r.balance / d(r.k)]));
        const bmax = Math.max(V.P, ...bl.map(q => q[1])) * 1.08;
        const g2 = chart(kit, c, C, { x0, y0: y2, w, h: h2, xmin: 0, xmax: V.T, ymin: 0, ymax: bmax, ny: 4, yfmt: v => kit.money(v, 0, true), xlabel: 'years', ylabel: 'still owed' + (real ? ', today\'s money' : '') });
        line(c, [[0, V.P], [V.T, V.P]], g2.X, g2.Y, C.faint, 1.2, [5, 4]);
        kit.label(c, 'amount borrowed', g2.X(V.T) - 4, g2.Y(V.P) - 9, { size: 11, color: C.muted, align: 'right' });
        line(c, bu, g2.X, g2.Y, C.accent, 2.4);
        line(c, bl, g2.X, g2.Y, C.warn, 2.4);
        legend(kit, c, C, [[C.accent, 'unlinked ' + kit.pct(V.rn / 100)], [C.warn, 'linked ' + kit.pct(V.rr / 100) + ' + inflation']], x0 + 8, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the mortgage mix */
  Hyper.sim('mg-mix', {
    title: 'Build a mortgage from tracks',
    blurb: `Split a mortgage between a **fixed unlinked** track, a **variable** track and a **CPI-linked** track by giving each a number of parts (1 : 1 : 1 is equal thirds). Every dot is one possible mix, in steps of 10 %: across, its **expected rate** (the tracks' rates weighted by their shares, the linked one at its real rate plus expected inflation); up, its **worst monthly payment in the stress test** during the first ten years, in today's money — as if your income rises with the expected inflation but not with the shock. The 25-year term is fixed.

- The dots along the lower-left edge are the **frontier**: no mix is both cheaper and safer than them. The corners are the single-track loans.
- With the defaults, equal thirds costs about 4.66 % and its worst month is below that of *any* single track: a rate rise hits the variable track at once, while excess inflation builds up in the linked one over years.
- Yet with these rates equal thirds is *not* on the frontier (see the read-out): find a mix that is both cheaper and safer. Then make the fixed rate equal to the variable one and look again.
- Switch the stress test to *rates only* or *inflation only* and watch which corner becomes dangerous.
- The expected rate assumes the variable rate stays where it is today; if markets expect rises, the variable corner is less cheap than it looks.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Mortgage', min: 100000, max: 3000000, value: 600000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'wf', label: 'Fixed unlinked track: parts', min: 0, max: 6, step: 1, value: 1 },
        { id: 'wv', label: 'Variable track: parts', min: 0, max: 6, step: 1, value: 1 },
        { id: 'wl', label: 'CPI-linked track: parts', min: 0, max: 6, step: 1, value: 1 },
        { id: 'rf', label: 'Fixed rate', min: 1, max: 10, step: 0.05, value: 5, unit: '%' },
        { id: 'rv', label: 'Variable rate today', min: 0.5, max: 10, step: 0.05, value: 4, unit: '%' },
        { id: 'rl', label: 'Linked real rate', min: 0, max: 6, step: 0.05, value: 2.5, unit: '%' },
        { id: 'pi', label: 'Expected inflation', min: 0, max: 8, step: 0.1, value: 2.5, unit: '%' },
        { id: 'stress', type: 'select', label: 'Stress test', options: [['rates +2 points and inflation +3 points', 'both'], ['rates +2 points only', 'rate'], ['inflation +3 points only', 'infl']], value: 'both' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['split', 'Your mix'], ['pay', 'First payment'], ['worst', 'Worst month in the test'], ['rate', 'Expected rate of the mix'], ['front', 'On the frontier?']]);
      const V = ctl.values;
      const TERM = 25, N = TERM * 12, WIN = 120;
      let grid = [], front = [], me = null, corners = [], first = 0;

      function solve() {
        const pi = V.pi / 100, rf = V.rf / 100, rv = V.rv / 100, rl = V.rl / 100;
        const sR = V.stress !== 'infl' ? 0.02 : 0, sI = V.stress !== 'rate' ? 0.03 : 0;
        const base = [
          kit.fin.amortize({ principal: V.P, annual: rf, years: TERM }),
          kit.fin.amortize({ principal: V.P, annual: rv, years: TERM }),
          kit.fin.amortize({ principal: V.P, annual: rl, years: TERM, inflation: pi })
        ];
        const str = [
          base[0],
          kit.fin.amortize({ principal: V.P, annual: rv + sR, years: TERM }),
          kit.fin.amortize({ principal: V.P, annual: rl, years: TERM, inflation: pi + sI })
        ];
        // stressed payments in today's money (deflated by the expected inflation), first ten years
        const S = str.map(s => s.rows.slice(0, WIN).map((r, j) => r.payment / Math.pow(1 + pi, (j + 1) / 12)));
        const rates = [rf, rv, 12 * ((1 + rl / 12) * Math.pow(1 + pi, 1 / 12) - 1)];
        const evalMix = w => {
          let worst = 0, when = 1;
          for (let j = 0; j < Math.min(WIN, N); j++) {
            const p = w[0] * S[0][j] + w[1] * S[1][j] + w[2] * S[2][j];
            if (p > worst + 1e-9) { worst = p; when = j + 1; }
          }
          return { w, cost: w[0] * rates[0] + w[1] * rates[1] + w[2] * rates[2], worst, when };
        };
        grid = [];
        for (let a = 0; a <= 10; a++) for (let b = 0; b <= 10 - a; b++) grid.push(evalMix([a / 10, b / 10, (10 - a - b) / 10]));
        const sorted = grid.slice().sort((x, y) => x.cost - y.cost || x.worst - y.worst);
        front = []; let best = Infinity;
        for (const g of sorted) if (g.worst < best - 1e-6) { best = g.worst; front.push(g); }
        corners = [grid.find(g => g.w[0] === 1), grid.find(g => g.w[1] === 1), grid.find(g => g.w[2] === 1)];
        let tot = V.wf + V.wv + V.wl;
        const w = tot > 0 ? [V.wf / tot, V.wv / tot, V.wl / tot] : [1 / 3, 1 / 3, 1 / 3];
        me = evalMix(w);
        first = w[0] * base[0].rows[0].payment + w[1] * base[1].rows[0].payment + w[2] * base[2].rows[0].payment;
        ro.set('split', w.map((x, j) => Math.round(x * 100) + ' % ' + ['fixed', 'variable', 'linked'][j]).join(' · ') + (tot > 0 ? '' : ' (all parts at zero: equal thirds)'));
        ro.set('pay', kit.money(first));
        ro.set('worst', kit.money(me.worst) + ' (' + (me.worst >= first ? '+' : '') + kit.pct(me.worst / first - 1, 0) + ', year ' + Math.ceil(me.when / 12) + ')');
        ro.set('rate', kit.pct(me.cost));
        const dominated = grid.some(g => g.cost < me.cost - 1e-6 && g.worst < me.worst - 1e-6);
        ro.set('front', dominated ? 'no: another mix is both cheaper and safer' : 'yes, or very close');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!grid.length) return;
        const W = st.W, Hh = st.H;
        const x0 = 80, y0 = 40, w = W - x0 - 30, h = Hh - y0 - 50;
        const xs = grid.map(g => g.cost * 100), ys = grid.map(g => g.worst);
        const xlo = Math.min(...xs), xhi = Math.max(...xs), ylo = Math.min(...ys), yhi = Math.max(...ys);
        const px = Math.max(0.05, (xhi - xlo) * 0.08), py = Math.max(10, (yhi - ylo) * 0.1);
        const g = chart(kit, c, C, { x0, y0, w, h, xmin: xlo - px, xmax: xhi + px, ymin: ylo - py, ymax: yhi + py, ny: 5, yfmt: v => kit.money(v, 0), xfmt: pctAxis(2), xlabel: 'expected rate of the mix', ylabel: 'worst month in the stress test (today\'s money)' });
        for (const q of grid) kit.dot(c, g.X(q.cost * 100), g.Y(q.worst), 3, C.faint);
        line(c, front.map(q => [q.cost * 100, q.worst]), g.X, g.Y, C.ok, 2.2);
        for (const q of front) kit.dot(c, g.X(q.cost * 100), g.Y(q.worst), 3.5, C.ok);
        const names = ['all fixed', 'all variable', 'all linked'];
        corners.forEach((q, j) => {
          if (!q) return;
          const X = g.X(q.cost * 100), Y = g.Y(q.worst);
          kit.dot(c, X, Y, 5, C.text2, C.bg2);
          kit.label(c, names[j], X + (X > x0 + w * 0.7 ? -8 : 8), Y - 11, { size: 11.5, color: C.text2, align: X > x0 + w * 0.7 ? 'right' : 'left' });
        });
        const MX = g.X(me.cost * 100), MY = g.Y(me.worst);
        kit.dot(c, MX, MY, 8, C.accent, C.bg2);
        kit.label(c, 'your mix', MX + (MX > x0 + w * 0.7 ? -12 : 12), MY + 14, { size: 12, color: C.accent, weight: 700, align: MX > x0 + w * 0.7 ? 'right' : 'left' });
        legend(kit, c, C, [[C.ok, 'frontier'], [C.faint, 'other mixes']], x0 + w - 190, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ affordability */
  Hyper.sim('mg-afford', {
    title: 'How much can you borrow — and how much should you?',
    blurb: `On the left, your monthly **income**: other debt payments, the **mortgage payment** the lender's limits allow, and what is left. The lender applies two limits — the mortgage payment as a share of income (PTI) and all debts as a share of income (DTI) — and the tighter one binds. On the right, the **largest loan** that payment could repay, for every interest rate: the lender reads it not at the rate you will pay but at a **stress-tested** rate a few points higher.

- Remove the other debts: when the DTI limit was binding, the largest loan jumps.
- Move the stress buffer from 0 to 3 points and watch the loan fall by roughly a tenth per point.
- The last read-out is the point of the exercise: the payment you would actually pay, as a share of income. The stress test leaves room for rates to rise.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'Y', label: 'Monthly income', min: 1000, max: 40000, value: 6000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'D', label: 'Other debt payments a month', min: 0, max: 3000, step: 25, value: 400, fmt: v => kit.money(v, 0) },
        { id: 'pti', label: 'Limit on the mortgage payment', min: 10, max: 60, step: 1, value: 35, unit: '% of income' },
        { id: 'dti', label: 'Limit on all debt payments', min: 10, max: 70, step: 1, value: 45, unit: '% of income' },
        { id: 'r', label: 'Rate offered', min: 0.5, max: 12, step: 0.05, value: 5, unit: '%' },
        { id: 's', label: 'Stress buffer', min: 0, max: 5, step: 0.25, value: 2, unit: 'points' },
        { id: 'T', label: 'Term', min: 10, max: 40, step: 1, value: 30, unit: 'years' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['M', 'Largest mortgage payment'], ['L0', 'Largest loan at the rate offered'], ['L1', 'Largest loan, stress-tested'], ['pay', 'Your payment on that loan']]);
      const V = ctl.values;
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const Y = V.Y, n = Math.round(V.T * 12);
        const mP = V.pti / 100 * Y, mD = Math.max(0, V.dti / 100 * Y - V.D), M = Math.max(0, Math.min(mP, mD));
        const bind = mP <= mD ? 'payment-to-income' : 'debt-to-income';
        const loan = rate => kit.fin.affordable(M, rate / 100 / 12, n);
        const L0 = loan(V.r), L1 = loan(V.r + V.s);
        // the income column
        const bx = 34, bw = Math.min(90, W * 0.13), y0 = 40, h = Hh - y0 - 50;
        const YY = v => y0 + h - clamp(v / Y, 0, 1) * h;
        const parts = [[0, Math.min(V.D, Y), C.warn, 'other debts'], [Math.min(V.D, Y), Math.min(V.D + M, Y), C.accent, 'mortgage'], [Math.min(V.D + M, Y), Y, C.faint, 'the rest']];
        for (const [a, b, col, t] of parts) {
          if (b <= a) continue;
          c.globalAlpha = col === C.faint ? 0.35 : 0.85; c.fillStyle = col; c.fillRect(bx, YY(b), bw, YY(a) - YY(b)); c.globalAlpha = 1;
          if (YY(a) - YY(b) > 16) kit.label(c, t, bx + bw / 2, (YY(a) + YY(b)) / 2, { size: 11, color: C.text, align: 'center', weight: 600 });
        }
        for (const [f, t] of [[V.pti / 100, 'PTI ' + V.pti + ' %'], [V.dti / 100, 'DTI ' + V.dti + ' %']]) {
          const yy = y0 + h - clamp(f, 0, 1) * h;
          line(c, [[0, yy], [1, yy]], v => bx - 4 + v * (bw + 8), v => v, C.text, 1.2, [4, 3]);
          kit.label(c, t, bx + bw + 8, yy, { size: 11, color: C.text2 });
        }
        kit.label(c, 'income ' + kit.money(Y, 0), bx, y0 - 14, { size: 11.5, color: C.muted });
        // the largest loan against the rate
        const cx0 = bx + bw + 110, cw = W - cx0 - 24;
        const pts = [];
        for (let r = 0.5; r <= 12.0001; r += 0.1) pts.push([r, loan(r)]);
        const g = chart(kit, c, C, { x0: cx0, y0, w: cw, h, xmin: 0.5, xmax: 12, ymin: 0, ymax: Math.max(1, loan(0.5)) * 1.05, ny: 5, yfmt: v => kit.money(v, 0, true), xfmt: pctAxis(0), xlabel: 'interest rate', ylabel: 'largest loan for ' + kit.money(M, 0) + ' a month' });
        line(c, pts, g.X, g.Y, C.accent, 2.4);
        const r1 = Math.min(12, V.r + V.s);
        line(c, [[V.r, 0], [V.r, L0]], g.X, g.Y, C.muted, 1.2, [4, 3]);
        line(c, [[r1, 0], [r1, L1]], g.X, g.Y, C.warn, 1.4, [4, 3]);
        line(c, [[0.5, L1], [r1, L1]], g.X, g.Y, C.warn, 1.4, [4, 3]);
        kit.dot(c, g.X(V.r), g.Y(L0), 5.5, C.accent, C.bg2);
        kit.dot(c, g.X(r1), g.Y(L1), 6, C.warn, C.bg2);
        kit.label(c, 'offered', g.X(V.r) + 8, g.Y(L0) - 10, { size: 11.5, color: C.text2 });
        if (V.s > 0) kit.label(c, 'stress-tested', g.X(r1) + 8, g.Y(L1) - 12, { size: 11.5, color: C.warn, weight: 600 });
        // read-outs
        ro.set('M', kit.money(M, 0) + (M > 0 ? ' (' + bind + ' binds)' : ': other debts use the whole limit'));
        ro.set('L0', kit.money(L0, 0));
        ro.set('L1', kit.money(L1, 0) + (L0 > 0 && V.s > 0 ? ' (−' + kit.pct(1 - L1 / L0, 0) + ')' : ''));
        const pay = L1 > 0 ? kit.fin.payment(L1, V.r / 100 / 12, n) : 0;
        ro.set('pay', kit.money(pay, 0) + ' a month at ' + kit.pct(V.r / 100) + ' = ' + kit.pct(pay / Y, 0) + ' of income');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ fee or rate */
  // the yearly rate (APR) of a level-payment loan with an up-front fee, repaid after `months`
  function aprOver(P, r, N, fee, months) {
    const i = r / 12, M = Hyper.finance.payment(P, i, N), n = Math.min(months, N);
    const Bn = Math.max(0, balanceAfter(P, i, N, n));
    const net = P - fee;
    if (!(net > 0)) return NaN;
    const pv = j => Math.abs(j) < 1e-12 ? M * n + Bn : M * (1 - Math.pow(1 + j, -n)) / j + Bn * Math.pow(1 + j, -n);
    let lo = Math.min(0, i) - 0.001, hi = Math.max(0.001, i + 0.01);
    for (let t = 0; t < 60 && pv(hi) > net; t++) hi *= 2;
    for (let t = 0; t < 70; t++) { const m = (lo + hi) / 2; if (pv(m) > net) lo = m; else hi = m; }
    return 12 * (lo + hi) / 2;
  }
  Hyper.sim('mg-fee-rate', {
    title: 'A fee or a higher rate? It depends how long you keep the loan',
    blurb: `Two offers for the same loan: **A** with a lower rate and a fee, **B** with a higher rate and no fee. Each line is the true yearly cost — the APR, fee included — if you repay the loan (by selling or refinancing) after the number of years along the bottom. A fee is paid once, so the shorter you keep the loan, the more it weighs.

- With the defaults the lines cross just before five years: leave earlier and B is cheaper, stay longer and A is.
- Double A's fee and watch the crossing move out.
- Set both fees to zero: the lines become flat, each at its own rate.
- Use *You keep the loan for* to read the costs at your own horizon.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 50000, max: 2000000, value: 250000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'T', label: 'Term', min: 5, max: 35, step: 1, value: 25, unit: 'years' },
        { id: 'ra', label: 'Offer A: rate', min: 0.5, max: 12, step: 0.05, value: 4.6, unit: '%' },
        { id: 'fa', label: 'Offer A: fee', min: 0, max: 20000, step: 250, value: 3000, fmt: v => kit.money(v, 0) },
        { id: 'rb', label: 'Offer B: rate', min: 0.5, max: 12, step: 0.05, value: 4.9, unit: '%' },
        { id: 'fb', label: 'Offer B: fee', min: 0, max: 20000, step: 250, value: 0, fmt: v => kit.money(v, 0) },
        { id: 'h', label: 'You keep the loan for', min: 1, max: 35, step: 1, value: 3, unit: 'years' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['pay', 'Monthly payment, A / B'], ['apr', 'True yearly cost over your years'], ['cost', 'Interest and fees in those years'], ['cross', 'Which is cheaper']]);
      const V = ctl.values;
      let ca = [], cb = [], cross = null, N = 0, H = 0;
      function solve() {
        N = Math.round(V.T * 12);
        H = Math.min(V.h, V.T);
        const P = V.P, ra = V.ra / 100, rb = V.rb / 100;
        ca = []; cb = [];
        for (let m = 12; m <= N; m += 3) { ca.push([m / 12, 100 * aprOver(P, ra, N, V.fa, m)]); cb.push([m / 12, 100 * aprOver(P, rb, N, V.fb, m)]); }
        // the month from which the order of the two offers changes for good
        const diff = m => aprOver(P, ra, N, V.fa, m) - aprOver(P, rb, N, V.fb, m);
        const s0 = Math.sign(diff(1));
        cross = null;
        for (let m = 2; m <= N; m++) if (Math.sign(diff(m)) !== s0 && Math.sign(diff(m)) !== 0) { cross = m; break; }
        const sa = kit.fin.amortize({ principal: P, annual: ra, years: V.T }), sb = kit.fin.amortize({ principal: P, annual: rb, years: V.T });
        const hm = Math.round(H * 12);
        const iA = sa.rows.slice(0, hm).reduce((s, r) => s + r.interest, 0) + V.fa, iB = sb.rows.slice(0, hm).reduce((s, r) => s + r.interest, 0) + V.fb;
        const pa = sa.rows[0].payment, pb = sb.rows[0].payment;
        ro.set('pay', kit.money(pa) + ' / ' + kit.money(pb));
        const aA = aprOver(P, ra, N, V.fa, hm), aB = aprOver(P, rb, N, V.fb, hm);
        ro.set('apr', 'A ' + kit.pct(aA) + ' · B ' + kit.pct(aB) + ' (' + years(H) + ')');
        ro.set('cost', 'A ' + kit.money(iA, 0) + ' · B ' + kit.money(iB, 0));
        const first = s0 < 0 ? 'A' : s0 > 0 ? 'B' : 'neither';
        const second = first === 'A' ? 'B' : 'A';
        ro.set('cross', cross ? first + ' if you leave within ' + years(cross / 12) + ' (' + cross + ' months), ' + second + ' if you stay longer' : first === 'neither' ? 'they cost the same' : first + ' at every horizon');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!ca.length) return;
        const W = st.W, Hh = st.H;
        const x0 = 64, y0 = 40, w = W - x0 - 24, h = Hh - y0 - 50;
        const all = ca.concat(cb).map(q => q[1]).filter(Number.isFinite);
        const lo = Math.min(...all, V.ra, V.rb), hiA = Math.max(...all);
        const hi = Math.min(hiA, Math.max(V.ra, V.rb) + 3);
        const pad = Math.max(0.05, (hi - lo) * 0.1);
        const g = chart(kit, c, C, { x0, y0, w, h, xmin: 1, xmax: Math.max(2, V.T), ymin: lo - pad, ymax: hi + pad, ny: 5, yfmt: pctAxis(2), xlabel: 'years before you repay (sell or refinance)', ylabel: 'true yearly cost (APR)' });
        const clip = [x0, y0, w, h];
        line(c, ca, g.X, g.Y, C.accent, 2.4, null, clip);
        line(c, cb, g.X, g.Y, C.warn, 2.4, null, clip);
        if (cross) line(c, [[cross / 12, lo - pad], [cross / 12, hi + pad]], g.X, g.Y, C.ok, 1.4, [4, 3]);
        if (cross) kit.label(c, 'break-even ' + years(cross / 12), g.X(cross / 12) + 6, y0 + 10, { size: 11.5, color: C.ok, weight: 600 });
        line(c, [[H, lo - pad], [H, hi + pad]], g.X, g.Y, C.text, 1, [2, 3]);
        const hm = Math.round(H * 12);
        const yA = 100 * aprOver(V.P, V.ra / 100, N, V.fa, hm), yB = 100 * aprOver(V.P, V.rb / 100, N, V.fb, hm);
        if (Number.isFinite(yA) && yA <= hi + pad) kit.dot(c, g.X(H), g.Y(yA), 5, C.accent, C.bg2);
        if (Number.isFinite(yB) && yB <= hi + pad) kit.dot(c, g.X(H), g.Y(yB), 5, C.warn, C.bg2);
        legend(kit, c, C, [[C.accent, 'A: ' + kit.pct(V.ra / 100) + ' + ' + kit.money(V.fa, 0) + ' fee'], [C.warn, 'B: ' + kit.pct(V.rb / 100) + ' + ' + kit.money(V.fb, 0) + ' fee']], x0 + 10, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ rent or buy */
  // two households with the same budget: the buyer pays the mortgage and running costs; the renter
  // invests the deposit and the buying costs, pays the rent and invests the difference each month
  // (and the buyer invests it when the rent is the dearer). Yearly net worth of each.
  function rentBuy(o) {
    const F = Hyper.finance;
    const V0 = o.price, dep = o.deposit * V0, buyC = o.buyCost * V0, L = Math.max(0, V0 - dep);
    const n = Math.round(o.years * 12), nm = o.term * 12;
    const iM = o.rate / 12, M = L > 0 ? F.payment(L, iM, nm) : 0;
    const gP = Math.pow(1 + o.growth, 1 / 12), gI = Math.pow(1 + o.invest, 1 / 12) - 1;
    let V = V0, B = L, renter = dep + buyC, owner = 0, rent = o.rent;
    const pts = [{ t: 0, buy: V0 * (1 - o.sellCost) - L, rent: renter }];
    let first = null;
    for (let k = 1; k <= n; k++) {
      if (k > 1 && (k - 1) % 12 === 0) rent *= 1 + o.rentGrowth;
      const run = V * o.running / 12;
      let pay = 0;
      if (B > 0.005) { const it = B * iM; pay = Math.min(M, B + it); B = B + it - pay; if (B < 0.005) B = 0; }
      const own = pay + run;
      if (k === 1) first = { own, pay, run, rent };
      renter *= 1 + gI; owner *= 1 + gI;
      const diff = own - rent;
      if (diff >= 0) renter += diff; else owner -= diff;
      V *= gP;
      if (k % 12 === 0) pts.push({ t: k / 12, buy: V * (1 - o.sellCost) - B + owner, rent: renter });
    }
    let cross = null;
    for (let j = 1; j < pts.length; j++) if (pts.slice(j).every(p => p.buy >= p.rent)) { cross = pts[j].t; break; }
    return { pts, first, cross, M };
  }
  Hyper.sim('mg-rent-buy', {
    title: 'Rent or buy: two households, one flat',
    blurb: `Two households with the same money and the same home. The **buyer** pays a deposit, buying costs of 4 % of the price, then the mortgage (30 years) and running costs every month; selling would cost 5 %. The **renter** invests the deposit and the buying costs instead, pays the rent, and each month invests whatever the buyer is spending beyond the rent (when rent is the dearer, the buyer invests the difference). The lines are each household's net worth: the home less selling costs and debt, plus investments. Taxes are left out — they differ by country and can tilt the result either way.

- With the defaults the renter leads for about ten years; then the buyer pulls ahead.
- Lower the price growth to 1 %: the renter stays ahead for all thirty years.
- Raise the rent: at a lower price-to-rent ratio buying wins much sooner.
- Raise the investment return, or the mortgage rate: each favours renting.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'price', label: 'Price of the home', min: 100000, max: 2000000, value: 400000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'rent', label: 'Rent for the same home', min: 300, max: 10000, value: 1600, log: true, sig: 2, fmt: v => kit.money(v, 0) + ' a month' },
        { id: 'dep', label: 'Deposit', min: 5, max: 100, step: 1, value: 20, unit: '%' },
        { id: 'rate', label: 'Mortgage rate', min: 1, max: 10, step: 0.1, value: 5, unit: '%' },
        { id: 'g', label: 'Price growth', min: -3, max: 8, step: 0.1, value: 3, unit: '% a year' },
        { id: 'rg', label: 'Rent growth', min: -2, max: 8, step: 0.1, value: 3, unit: '% a year' },
        { id: 'inv', label: 'Return on investments', min: 0, max: 10, step: 0.1, value: 6, unit: '% a year' },
        { id: 'run', label: 'Running costs of owning', min: 0, max: 4, step: 0.1, value: 1.5, unit: '% of value a year' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['m1', 'First month: owning / renting'], ['pr', 'Price-to-rent ratio'], ['y5', 'After 5 years (buy / rent)'], ['y10', 'After 10 years'], ['y30', 'After 30 years'], ['x', 'Buying pulls ahead']]);
      const V = ctl.values;
      let R = null;
      function solve() {
        R = rentBuy({ price: V.price, rent: V.rent, deposit: V.dep / 100, rate: V.rate / 100, term: 30, growth: V.g / 100, rentGrowth: V.rg / 100, invest: V.inv / 100, running: V.run / 100, buyCost: 0.04, sellCost: 0.05, years: 30 });
        const f = R.first;
        ro.set('m1', kit.money(f.own, 0) + ' / ' + kit.money(f.rent, 0));
        ro.set('pr', (V.price / (12 * V.rent)).toFixed(1) + ' (gross yield ' + kit.pct(12 * V.rent / V.price, 1) + ')');
        const at = y => { const p = R.pts[y]; return kit.money(p.buy, 0, true) + ' / ' + kit.money(p.rent, 0, true) + ' (' + (p.buy >= p.rent ? 'buyer +' + kit.money(p.buy - p.rent, 0, true) : 'renter +' + kit.money(p.rent - p.buy, 0, true)) + ')'; };
        ro.set('y5', at(5)); ro.set('y10', at(10)); ro.set('y30', at(30));
        ro.set('x', R.cross == null ? 'not within 30 years' : R.cross <= 1 ? 'from the first year' : 'after ' + R.cross + ' years');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!R) return;
        const W = st.W, Hh = st.H;
        const x0 = 70, y0 = 40, w = W - x0 - 24, h = Hh - y0 - 50;
        const all = R.pts.flatMap(p => [p.buy, p.rent]);
        const lo = Math.min(0, ...all), hi = Math.max(...all) * 1.06;
        const g = chart(kit, c, C, { x0, y0, w, h, xmin: 0, xmax: 30, ymin: lo, ymax: hi, ny: 5, xs: 5, yfmt: v => kit.money(v, 0, true), xlabel: 'years', ylabel: 'net worth' });
        // shade the gap between the two paths
        c.save(); c.globalAlpha = 0.12;
        for (let j = 0; j + 1 < R.pts.length; j++) {
          const a = R.pts[j], b = R.pts[j + 1];
          c.fillStyle = (a.buy + b.buy >= a.rent + b.rent) ? C.accent : C.warn;
          c.beginPath(); c.moveTo(g.X(a.t), g.Y(a.buy)); c.lineTo(g.X(b.t), g.Y(b.buy)); c.lineTo(g.X(b.t), g.Y(b.rent)); c.lineTo(g.X(a.t), g.Y(a.rent)); c.closePath(); c.fill();
        }
        c.restore();
        line(c, R.pts.map(p => [p.t, p.rent]), g.X, g.Y, C.warn, 2.4);
        line(c, R.pts.map(p => [p.t, p.buy]), g.X, g.Y, C.accent, 2.4);
        if (R.cross != null) {
          line(c, [[R.cross, lo], [R.cross, hi]], g.X, g.Y, C.ok, 1.4, [4, 3]);
          kit.label(c, 'buying ahead from year ' + R.cross, g.X(R.cross) + 6, y0 + 30, { size: 11.5, color: C.ok, weight: 600, align: R.cross > 22 ? 'right' : 'left' });
        }
        legend(kit, c, C, [[C.accent, 'buyer'], [C.warn, 'renter who invests']], x0 + 10, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ leverage in property */
  // the yearly return on the buyer's own money (IRR): an interest-only loan of `ltv` of the price,
  // net rent of `yld` of the value each year, the price changing by `growth` a year, sold after `years`
  function levered(o) {
    const L = o.ltv, E0 = 1 - L + o.buyCost;
    const flows = [-E0];
    let V = 1, back = 0;
    for (let y = 1; y <= o.years; y++) {
      const rent = o.yld * V;
      V *= 1 + o.growth;
      let cf = rent - L * o.rate;
      if (y === o.years) cf += V * (1 - o.sellCost) - L;
      flows.push(cf); back += cf;
    }
    return { E0, irr: Hyper.finance.irr(flows), gain: back - E0 };
  }
  Hyper.sim('mg-leverage', {
    title: 'Leverage in property: the return on your own money',
    blurb: `A property bought with part of its price borrowed (interest-only), rented out at a **net yield** after costs, and sold after some years. Each line is a **loan-to-value**: it shows the yearly return on the money you put in — the deposit plus the buying costs — for every yearly change in the price along the bottom. The thick line is your choice; the money figures are for a ¤400,000 property.

- Steeper lines mean more leverage: gains and losses are both multiplied.
- Find where the lines cross: to the right of it borrowing helps, to the left it hurts. The crossing sits where the property's own return, after costs, equals the mortgage rate.
- With prices flat and costs off, move the net yield above and below the mortgage rate: the order of the lines flips.
- Where a line drops off the bottom, the sale no longer repays the loan: more than the whole deposit is lost.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Price change', min: -10, max: 10, step: 0.5, value: p.growth != null ? p.growth : 3, unit: '% a year' },
        { id: 'ltv', label: 'Your loan-to-value', min: 0, max: 95, step: 5, value: p.ltv != null ? p.ltv : 75, unit: '%' },
        { id: 'y', label: 'Net rental yield', min: 0, max: 10, step: 0.1, value: p.yld != null ? p.yld : 3, unit: '% a year' },
        { id: 'r', label: 'Mortgage rate', min: 0, max: 12, step: 0.1, value: 5, unit: '%' },
        { id: 'n', label: 'Years held', min: 1, max: 20, step: 1, value: p.years || 5, unit: 'years' },
        { id: 'costs', type: 'check', label: 'Buying (4 %) and selling (3 %) costs', value: p.costs != null ? !!p.costs : true }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['lev', 'Leverage'], ['in', 'Your money in'], ['ret', 'Return on your money'], ['gain', 'Gain or loss'], ['cash', 'Bought for cash instead'], ['wipe', 'Price fall that takes the deposit']]);
      const V = ctl.values;
      const PRICE = 400000, REFS = [0, 0.5, 0.9];
      let curves = [], mine = [], myY = 0;
      function solve() {
        const bc = V.costs ? 0.04 : 0, sc = V.costs ? 0.03 : 0;
        const base = { yld: V.y / 100, rate: V.r / 100, years: Math.round(V.n), buyCost: bc, sellCost: sc };
        const run = (ltv, gr) => levered(Object.assign({}, base, { ltv, growth: gr }));
        const curve = ltv => { const pts = []; for (let x = -10; x <= 10.0001; x += 0.25) { const q = run(ltv, x / 100); pts.push([x, Number.isFinite(q.irr) ? q.irr * 100 : -100]); } return pts; };
        curves = REFS.filter(l => Math.abs(l - V.ltv / 100) > 1e-9).map(l => [l, curve(l)]);
        mine = curve(V.ltv / 100);
        const me = run(V.ltv / 100, V.g / 100), cash = run(0, V.g / 100);
        myY = Number.isFinite(me.irr) ? me.irr * 100 : -100;
        const lev = 1 / (1 - V.ltv / 100);
        ro.set('lev', lev.toFixed(1) + '× (a 1 % price move is ' + lev.toFixed(1) + ' % of your equity)');
        ro.set('in', kit.money(me.E0 * PRICE, 0) + (V.costs ? ' incl. ' + kit.money(bc * PRICE, 0) + ' of buying costs' : ''));
        ro.set('ret', Number.isFinite(me.irr) ? kit.pct(me.irr, 1) + ' a year' : 'lost more than everything put in');
        ro.set('gain', kit.money(me.gain * PRICE, 0) + ' (' + (me.gain >= 0 ? '+' : '') + kit.pct(me.gain / me.E0, 0) + ' of your money)');
        ro.set('cash', Number.isFinite(cash.irr) ? kit.pct(cash.irr, 1) + ' a year' : '—');
        ro.set('wipe', V.ltv > 0 ? kit.pct(1 - (V.ltv / 100) / (1 - sc), 1) + ' (from the sale alone)' : 'none: nothing is borrowed');
      }
      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = 64, y0 = 40, w = W - x0 - 24, h = Hh - y0 - 50;
        const g = chart(kit, c, C, { x0, y0, w, h, xmin: -10, xmax: 10, ymin: -40, ymax: 40, ny: 8, xs: 2, yfmt: pctAxis(0), xfmt: v => (v > 0 ? '+' : '') + v + ' %', xlabel: 'yearly change in the price', ylabel: 'yearly return on your own money' });
        const clip = [x0, y0, w, h];
        const colOf = l => l === 0 ? C.ok : l === 0.5 ? (C.series[4] || C.muted) : C.bad;
        for (const [l, pts] of curves) line(c, pts, g.X, g.Y, colOf(l), 1.4, [5, 4], clip);
        line(c, mine, g.X, g.Y, C.accent, 3, null, clip);
        line(c, [[V.g, -40], [V.g, 40]], g.X, g.Y, C.text, 1, [2, 3]);
        if (myY >= -40 && myY <= 40) kit.dot(c, g.X(V.g), g.Y(myY), 6, C.accent, C.bg2);
        legend(kit, c, C, [[C.accent, 'your loan: ' + V.ltv + ' %']].concat(curves.map(([l]) => [colOf(l), Math.round(l * 100) + ' %', [5, 4]])), x0 + 10, 14);
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
