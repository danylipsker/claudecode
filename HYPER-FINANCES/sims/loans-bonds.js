/* HYPER-FINANCES · sims/loans-bonds.js — simulations for Loans and Credit and for Bonds.
 *   lb-apr-fees     a loan as cash flows; how fees and the repayment date set the APR
 *   lb-prepay       a lump-sum prepayment: interest saved, the penalty, the return
 *   lb-refi         refinancing: the real break-even against the payment rule
 *   lb-balloon      amortizing, balloon and interest-only loans side by side
 *   lb-payday       a payday fee rolled over, against the same money on a card
 *   lb-price-yield  a bond's price as discounted cash flows; the price–yield curve and duration
 *   lb-yield-curve  normal, flat and inverted yield curves and the forward rates they imply
 *   lb-credit       a portfolio of risky bonds: defaults, recovery and the credit spread
 * All the arithmetic comes from kit.fin (HYPER-CORE/js/finance.js). */
(function () {
  'use strict';

  const FONT = '11px system-ui, sans-serif';

  // horizontal gridlines with money labels on the left, for values from lo to hi
  function moneyGrid(kit, c, C, x0, y0, w, h, lo, hi) {
    const step = Hyper.niceStep(hi - lo, 5);
    c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = Math.ceil(lo / step) * step; v <= hi * 1.0001; v += step) {
      const y = y0 + h - (v - lo) / (hi - lo) * h;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(kit.money(Math.abs(v) < step * 1e-6 ? 0 : v, 0, true), x0 - 6, y);
    }
  }
  // year labels under a time axis running from 0 to T years
  function yearAxis(kit, c, C, x0, y, w, T, label) {
    const tick = T > 24 ? 5 : T > 10 ? 2 : 1;
    c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
    for (let t = 0; t <= T + 1e-9; t += tick) c.fillText(String(t), x0 + t / T * w, y + 4);
    if (label) kit.label(c, label, x0 + w / 2, y + 24, { size: 11.5, color: C.muted, align: 'center' });
  }
  function legend(kit, c, C, x, y, items) {
    let xx = x;
    for (const [col, text, dash] of items) {
      c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 3;
      if (dash) { c.setLineDash([5, 4]); c.beginPath(); c.moveTo(xx, y); c.lineTo(xx + 16, y); c.stroke(); c.setLineDash([]); }
      else c.fillRect(xx, y - 5, 11, 11);
      kit.label(c, text, xx + (dash ? 21 : 16), y, { size: 11.5, color: C.text2 });
      c.font = '11.5px system-ui, sans-serif';
      xx += (dash ? 21 : 16) + c.measureText(text).width + 16;
    }
  }
  const yrs = n => n + (n === 1 ? ' year' : ' years');

  /* ================================================================ fees and the APR */
  Hyper.sim('lb-apr-fees', {
    title: 'Fees and the true rate: a loan as cash flows',
    blurb: `Above the line is what you receive; below it, what you pay back each year — interest and capital — and, if you repay early, the balance at that moment. The **APR** is the one yearly rate at which the two sides balance. The graph shows that rate for every possible repayment date.

- Set the fees to 0: the yearly cost equals the interest rate, whatever the date.
- Add a fee and move **Repaid after** towards 1 year: the same fee weighs more and more per year.
- Tick **Compare with a no-fee offer**: where the curve crosses the other offer's rate is the horizon beyond which the fee pays for itself.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const plot = kit.plot(box.stage, { x: { label: 'repaid after (years)', name: 'repaid after' }, y: { label: 'yearly cost (%)' }, fmtX: v => v.toFixed(1) + ' years', fmtY: v => v.toFixed(2) + ' %' }, 190);
      const T0 = p.T || 3;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 1000, max: 1000000, value: p.P || 10000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Interest rate', min: 0.5, max: 30, step: 0.1, value: p.r != null ? p.r : 7, unit: '%' },
        { id: 'T', label: 'Term', min: 1, max: 30, step: 1, value: T0, unit: 'years' },
        { id: 'fp', label: 'Up-front fees (% of the loan)', min: 0, max: 10, step: 0.1, value: p.fp != null ? p.fp : 5, unit: '%' },
        { id: 'H', label: 'Repaid after', min: 1, max: 30, step: 1, value: p.H || T0, unit: 'years' },
        { id: 'cmp', type: 'check', label: 'Compare with a no-fee offer', value: !!p.compare },
        { id: 'r2', label: 'No-fee offer: interest rate', min: 0.5, max: 30, step: 0.1, value: p.r2 || 8, unit: '%' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['pay', 'Monthly payment'], ['recv', 'You really receive'], ['aprH', 'Yearly cost if repaid then'], ['eff', 'The same, compounded'], ['apr', 'APR if kept to the end'], ['be', 'Same yearly cost as the no-fee offer after']]);
      const V = ctl.values;
      let s = null, years = [], fee = 0, Tn = 1, h = 1, aprH = NaN;

      function aprAt(m) {
        const pays = s.rows.slice(0, m).map(r => r.payment);
        if (!pays.length) return NaN;
        pays[pays.length - 1] += s.rows[pays.length - 1].balance;
        return kit.fin.apr({ principal: V.P, fees: fee, payments: pays }).apr;
      }
      function solve() {
        Tn = Math.max(1, Math.round(V.T));
        h = Math.min(Math.max(1, Math.round(V.H)), Tn);
        fee = V.P * V.fp / 100;
        s = kit.fin.amortize({ principal: V.P, annual: V.r / 100, years: Tn });
        years = kit.fin.yearly(s);
        const curve = [];
        for (let y = 1; y <= Tn; y++) curve.push([y, aprAt(12 * y) * 100]);
        aprH = aprAt(12 * h);
        const aprEnd = curve[curve.length - 1][1] / 100;
        let cross = null;
        if (V.cmp) {
          const r2 = V.r2 / 100;
          if (aprAt(1) <= r2) cross = 0;
          else if (!(aprEnd <= r2)) cross = Infinity;
          else {
            let lo = 1, hi = 12 * Tn;
            while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (aprAt(mid) <= r2) hi = mid; else lo = mid; }
            cross = hi;
          }
        }
        ro.set('pay', kit.money(s.firstPayment));
        ro.set('recv', kit.money(V.P - fee) + (fee > 0 ? ' (' + kit.money(fee) + ' of fees)' : ' (no fees)'));
        ro.set('aprH', kit.pct(aprH) + ' (after ' + yrs(h) + ')');
        ro.set('eff', kit.pct(Math.pow(1 + aprH / 12, 12) - 1));
        ro.set('apr', kit.pct(aprEnd));
        ro.show('be', !!V.cmp);
        ro.set('be', cross == null ? '—' : cross === 0 ? 'from the start' : cross === Infinity ? 'not within the term' : (cross / 12).toFixed(1) + ' years (month ' + cross + ')');
        const ys = curve.map(q => q[1]).concat([V.r]).concat(V.cmp ? [V.r2] : []).filter(Number.isFinite);
        const lo = Math.min(...ys), hi = Math.max(...ys), pad = Math.max(0.25, (hi - lo) * 0.12);
        plot.set({
          x: { label: 'repaid after (years)', name: 'repaid after', min: 1, max: Math.max(2, Tn) },
          y: { label: 'yearly cost (%)', min: Math.max(0, lo - pad), max: hi + pad },
          series: [{ pts: curve, label: 'this offer, fees included', width: 2.5, dots: Tn <= 12 ? 3 : 0 }],
          hlines: [{ y: V.r, label: 'its interest rate' }].concat(V.cmp ? [{ y: V.r2, label: 'the no-fee offer', color: kit.colors().ok }] : []),
          vlines: [{ x: h, label: 'repaid' }].concat(V.cmp && cross > 0 && Number.isFinite(cross) ? [{ x: cross / 12, label: 'same cost', color: kit.colors().ok }] : []),
          marks: Number.isFinite(aprH) ? [{ x: h, y: aprH * 100 }] : [],
          legend: true
        });
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!s || !years.length) return;
        const W = st.W, Hh = st.H;
        const x0 = 64, x1 = W - 16, yTop = 34, yBot = Hh - 12;
        const base = yTop + (yBot - yTop) * 0.52;
        const last = years[h - 1] || { payment: 0 };
        const finalBal = s.rows[12 * h - 1] ? s.rows[12 * h - 1].balance : 0;
        const maxAmt = Math.max(V.P, last.payment + finalBal, 1);
        const k = Math.min(base - yTop - 6, yBot - base - 6) / maxAmt;
        const xs = x0 + 34, span = x1 - xs;
        const bw = Math.max(3, span / Tn * 0.62);
        const xOf = t => xs + t / Tn * span;
        // the line between "to you" and "from you"
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0 - 6, base); c.lineTo(x1, base); c.stroke();
        kit.label(c, 'to you', x0 - 10, base - 12, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'from you', x0 - 10, base + 12, { size: 11, color: C.muted, align: 'right' });
        // what you receive: the loan, less the fees that go straight back
        const rw = Math.max(bw, 16), rx = x0 - 2;
        const hNet = (V.P - fee) * k, hFee = fee * k;
        c.fillStyle = C.ok; c.fillRect(rx, base - hNet, rw, hNet);
        if (hFee > 0) { c.fillStyle = C.bad; c.fillRect(rx, base - hNet - hFee, rw, hFee); }
        kit.label(c, 'you receive ' + kit.money(V.P - fee), rx + rw + 8, base - hNet / 2, { size: 12, color: C.text, weight: 600 });
        if (fee > 0) kit.label(c, 'fees ' + kit.money(fee) + ', paid straight back', rx + rw + 8, Math.max(yTop + 6, base - hNet - hFee / 2), { size: 11.5, color: C.bad });
        // what you pay, year by year
        years.forEach((y, j) => {
          const x = xOf(j + 0.5) - bw / 2;
          const hI = y.interest * k, hC = y.principal * k;
          if (j < h) {
            c.fillStyle = C.warn; c.fillRect(x, base, bw, hI);
            c.fillStyle = C.accent; c.fillRect(x, base + hI, bw, hC);
            if (j === h - 1 && finalBal > 0.5) {
              const hB = finalBal * k;
              c.fillStyle = C.series[5] || C.accent; c.fillRect(x, base + hI + hC, bw, hB);
              kit.label(c, 'balance repaid ' + kit.money(finalBal), x + bw / 2 + (j > Tn / 2 ? -bw : bw), Math.min(yBot - 8, base + hI + hC + hB / 2), { size: 11.5, color: C.text, align: j > Tn / 2 ? 'right' : 'left' });
            }
          } else {
            c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 3]); c.strokeRect(x, base, bw, hI + hC); c.setLineDash([]);
          }
        });
        // year ticks on the line
        c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'bottom';
        const tick = Tn > 20 ? 5 : Tn > 10 ? 2 : 1;
        for (let t = tick; t <= Tn; t += tick) c.fillText(String(t), xOf(t - 0.5), base - 2);
        // headline and legend
        kit.label(c, 'Yearly cost ' + kit.pct(aprH) + ' — the one rate at which what you receive and what you pay balance', x0 - 6, 12, { size: 12.5, color: C.text, weight: 600 });
        legend(kit, c, C, x0 - 6, 28, [[C.warn, 'interest'], [C.accent, 'capital'], [C.series[5] || C.accent, 'balance at repayment'], [C.bad, 'fees']]);
        if (h < Tn) kit.label(c, 'dashed: payments you no longer make', x1, yBot - 4, { size: 11, color: C.muted, align: 'right' });
      }
      const loop = kit.loop(() => draw(), box.stage);
      solve();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ early repayment */
  Hyper.sim('lb-prepay', {
    title: 'Paying early: interest saved against the penalty',
    blurb: `The dashed line is what you would owe without the extra payment, the solid line what you owe with it. The green area is debt you no longer carry — every unit of it stops costing interest. The bars compare the interest saved with the penalty.

- Switch between **Lower the payment** and **Shorten the loan**: the interest saved changes a lot, but with no penalty the **return on the prepayment** is the loan's rate either way. Both are worth the same.
- Raise the **penalty**: the return falls a little below the loan's rate.
- Move **You repay everything after** to two years after the prepayment: the same penalty has little time to be earned back, and the return drops.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      let V = null;
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 20000, max: 2000000, value: p.P || 250000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Interest rate', min: 0.5, max: 15, step: 0.1, value: p.r || 5, unit: '%' },
        { id: 'T', label: 'Term', min: 5, max: 40, step: 1, value: p.T || 25, unit: 'years' },
        { id: 'L', label: 'Extra payment', min: 1000, max: 500000, value: p.L || 20000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'Y', label: 'Paid after year', min: 1, max: 39, step: 1, value: p.Y || 5 },
        { id: 'pen', label: 'Penalty (% of the extra payment)', min: 0, max: 5, step: 0.1, value: p.pen != null ? p.pen : 2, unit: '%' },
        { id: 'mode', type: 'select', label: 'The lender will…', options: [['lower the payment', 'reduce'], ['shorten the loan', 'shorten']], value: p.mode || 'reduce' },
        { id: 'H', label: 'You repay everything after', min: 1, max: 40, step: 1, value: p.H || 25, fmt: v => (V && v >= V.T ? 'the end' : yrs(Math.round(v))) }
      ], () => { solve(); loop.once(); });
      V = ctl.values;
      const ro = kit.readout(box.side, [['bal', 'Owed when you pay extra'], ['after', 'Afterwards'], ['saved', 'Interest saved'], ['pen', 'Penalty'], ['ret', 'Return on the extra payment'], ['rec', 'Penalty earned back after']]);
      let base = null, pre = null, Tn = 25, km = 60, hm = 300, Lx = 0, pen = 0, saved = 0;

      function solve() {
        Tn = Math.round(V.T);
        const n = 12 * Tn, rate = V.r / 100;
        const y = Math.min(Math.max(1, Math.round(V.Y)), Tn - 1);
        km = 12 * y;
        hm = Math.min(n, Math.max(km + 1, 12 * Math.round(V.H)));
        base = kit.fin.amortize({ principal: V.P, annual: rate, years: Tn });
        const bal = base.rows[km - 1].balance;
        Lx = Math.min(V.L, bal);
        pre = kit.fin.amortize({ principal: V.P, annual: rate, years: Tn, lumps: [{ k: km, amount: Lx }], prepay: V.mode });
        pen = Lx * V.pen / 100;
        saved = 0;
        let rec = null;
        const flows = [-(Lx + pen)];
        for (let k = km + 1; k <= hm; k++) {
          const b = base.rows[k - 1], q = pre.rows[k - 1];
          saved += b.interest - (q ? q.interest : 0);
          if (rec == null && saved >= pen) rec = k - km;
          let f = b.payment - (q ? q.payment : 0);
          if (k === hm) f += b.balance - (q ? q.balance : 0);
          flows.push(f);
        }
        const ret = Lx > 0 ? kit.fin.irr(flows) * 12 : NaN;
        const nb = pre.rows[km];
        ro.set('bal', kit.money(bal) + ' (year ' + y + ')');
        ro.set('after', V.mode === 'reduce'
          ? (nb ? 'payment ' + kit.money(base.firstPayment) + ' → ' + kit.money(nb.payment) : 'loan repaid in full')
          : (pre.periods < n ? 'ends ' + (n - pre.periods) + ' months early' : 'ends on schedule'));
        ro.set('saved', kit.money(saved) + (hm < n ? ' (until you repay)' : ''));
        ro.set('pen', kit.money(pen));
        ro.set('ret', Number.isFinite(ret) ? kit.pct(ret) + ' a year (the loan: ' + kit.pct(rate) + ')' : '—');
        ro.set('rec', pen <= 0 ? 'no penalty' : rec == null ? 'not before you repay' : rec + (rec === 1 ? ' month' : ' months'));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!base) return;
        const W = st.W, Hh = st.H;
        const x0 = 66, y0 = 40, w = W - x0 - 150, h = Hh - y0 - 44;
        const n = 12 * Tn;
        const X = k => x0 + k / n * w, Y = v => y0 + h - v / V.P * h;
        moneyGrid(kit, c, C, x0, y0, w, h, 0, V.P);
        yearAxis(kit, c, C, x0, y0 + h, w, Tn, 'years');
        // the debt you no longer carry
        c.fillStyle = C.ok; c.globalAlpha = 0.2; c.beginPath();
        c.moveTo(X(km), Y(base.rows[km - 1].balance));
        for (let k = km; k <= hm; k++) c.lineTo(X(k), Y(base.rows[k - 1].balance));
        for (let k = hm; k >= km; k--) c.lineTo(X(k), Y(pre.rows[k - 1] ? pre.rows[k - 1].balance : 0));
        c.closePath(); c.fill(); c.globalAlpha = 1;
        // without and with the extra payment
        c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(X(0), Y(V.P));
        base.rows.forEach(r => c.lineTo(X(r.k), Y(r.balance))); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(0), Y(V.P));
        pre.rows.forEach(r => { if (r.k === km) c.lineTo(X(r.k), Y(r.balance + r.extra)); c.lineTo(X(r.k), Y(r.balance)); });
        c.stroke();
        // the extra payment
        const bk = base.rows[km - 1].balance;
        kit.arrow(c, X(km), Y(bk) - 26, X(km), Y(bk - Lx) , C.ok, 2.2);
        kit.label(c, 'extra ' + kit.money(Lx, 0), X(km) + 6, Y(bk) - 30, { size: 11.5, color: C.ok, weight: 600 });
        if (hm < n) {
          c.strokeStyle = C.text2; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(hm), y0); c.lineTo(X(hm), y0 + h); c.stroke(); c.setLineDash([]);
          kit.label(c, 'all repaid', X(hm) + 4, y0 + 8, { size: 11, color: C.text2 });
        }
        legend(kit, c, C, x0, 14, [[C.muted, 'without the extra payment', true], [C.accent, 'with it'], [C.ok, 'debt no longer carried']]);
        // the two bars: interest saved and the penalty
        const bx = x0 + w + 34, bh = h - 30, top = Math.max(saved, pen, 1);
        const bar = (x, v, col, t1) => {
          const hh = v / top * bh;
          c.fillStyle = col; c.fillRect(x, y0 + bh - hh + 10, 34, hh);
          kit.label(c, kit.money(v, 0), x + 17, y0 + bh - hh + 2, { size: 11, color: C.text, align: 'center' });
          kit.label(c, t1, x + 17, y0 + bh + 22, { size: 11, color: C.muted, align: 'center' });
        };
        bar(bx, saved, C.ok, 'interest saved');
        bar(bx + 58, pen, C.bad, 'penalty');
      }
      const loop = kit.loop(() => draw(), box.stage);
      solve();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ refinancing */
  Hyper.sim('lb-refi', {
    title: 'Refinancing: when do the costs pay back?',
    blurb: `The solid line is your real position after switching: the payments saved so far, plus how much less you owe, minus the costs. Where it crosses zero, the switch has paid for itself. The dashed line counts only the payments saved — the quick rule most people use.

- With the defaults (the same 20 years), the solid line crosses zero before the dashed one: the lower rate also repays capital faster.
- Set **New term** to 30 years: the dashed line leaps up — "paid back in a year" — but the solid line is above zero only for a few years, then sinks and finishes far below it.
- Tick **Add the costs to the loan**: nothing is paid up front, but the costs are borrowed and cost interest for the whole term.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'B', label: 'Balance owed', min: 10000, max: 2000000, value: p.B || 200000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'left', label: 'Years left on the loan', min: 1, max: 35, step: 1, value: p.left || 20 },
        { id: 'r1', label: 'Current rate', min: 0.5, max: 15, step: 0.05, value: p.r1 || 6, unit: '%' },
        { id: 'r2', label: 'New rate', min: 0.5, max: 15, step: 0.05, value: p.r2 || 5, unit: '%' },
        { id: 'C', label: 'Costs of switching', min: 0, max: 30000, step: 100, value: p.C != null ? p.C : 4000, fmt: v => kit.money(v, 0) },
        { id: 'nT', label: 'New term', min: 1, max: 40, step: 1, value: p.nT || 20, unit: 'years' },
        { id: 'roll', type: 'check', label: 'Add the costs to the loan', value: !!p.roll }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['pay', 'Monthly payment'], ['beP', 'Paid back, counting payments'], ['beT', 'Paid back, counting the balance too'], ['g5', 'Real gain after 5 years'], ['life', 'Over the whole life']]);
      const V = ctl.values;
      let payPts = [], realPts = [], N = 12, nOld = 12, nNew = 12, beP = null, beT = null, behind = null;

      function solve() {
        nOld = 12 * Math.round(V.left); nNew = 12 * Math.round(V.nT);
        const up = V.roll ? 0 : V.C;
        const old = kit.fin.amortize({ principal: V.B, annual: V.r1 / 100, periods: nOld });
        const nw = kit.fin.amortize({ principal: V.B + (V.roll ? V.C : 0), annual: V.r2 / 100, periods: nNew });
        N = Math.max(nOld, nNew);
        payPts = [[0, -up]]; realPts = [[0, -V.C]];
        let cum = -up, g5 = NaN;
        beP = null; beT = null; behind = null;
        for (let m = 1; m <= N; m++) {
          const o = old.rows[m - 1], q = nw.rows[m - 1];
          cum += (o ? o.payment : 0) - (q ? q.payment : 0);
          const real = cum + (o ? o.balance : 0) - (q ? q.balance : 0);
          payPts.push([m, cum]); realPts.push([m, real]);
          if (beP == null && cum >= 0) beP = m;
          if (beT == null && real >= 0) beT = m;
          if (beT != null && behind == null && real < 0) behind = m;
          if (m === 60) g5 = real;
        }
        if (V.roll) beP = 0;
        const life = realPts[realPts.length - 1][1];
        const m12 = m => m == null ? 'never' : m + ' months (' + (m / 12).toFixed(1) + ' years)';
        ro.set('pay', kit.money(old.firstPayment) + ' → ' + kit.money(nw.firstPayment));
        ro.set('beP', V.roll ? 'at once (nothing paid up front)' : m12(beP));
        ro.set('beT', m12(beT) + (behind ? '; behind again after ' + (behind / 12).toFixed(1) + ' years' : ''));
        ro.set('g5', Number.isFinite(g5) ? kit.money(g5) : '—');
        ro.set('life', kit.money(Math.abs(life)) + (life >= 0 ? ' saved' : ' lost'));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!realPts.length) return;
        const W = st.W, Hh = st.H;
        const x0 = 72, y0 = 44, w = W - x0 - 90, h = Hh - y0 - 44;
        const all = realPts.concat(payPts).map(q => q[1]);
        let lo = Math.min(0, ...all), hi = Math.max(0, ...all);
        const pad = (hi - lo) * 0.08 || 1;
        lo -= pad; hi += pad;
        const X = m => x0 + m / N * w, Y = v => y0 + h - (v - lo) / (hi - lo) * h;
        moneyGrid(kit, c, C, x0, y0, w, h, lo, hi);
        yearAxis(kit, c, C, x0, y0 + h, w, N / 12, 'years after refinancing');
        c.strokeStyle = C.text2; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x0 + w, Y(0)); c.stroke();
        kit.label(c, 'ahead', x0 + w + 6, Y(0) - 10, { size: 11, color: C.ok });
        kit.label(c, 'behind', x0 + w + 6, Y(0) + 10, { size: 11, color: C.bad });
        if (nOld !== nNew) {
          const m = Math.min(nOld, nNew);
          c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(m), y0); c.lineTo(X(m), y0 + h); c.stroke(); c.setLineDash([]);
          kit.label(c, nOld < nNew ? 'the old loan would have ended' : 'the new loan ends', X(m) - 4, y0 + 8, { size: 11, color: C.muted, align: 'right' });
        }
        const line = (pts, col, wd, dash) => {
          c.strokeStyle = col; c.lineWidth = wd; c.setLineDash(dash || []); c.beginPath();
          pts.forEach((q, j) => j ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1])));
          c.stroke(); c.setLineDash([]);
        };
        line(payPts, C.muted, 2, [6, 4]);
        line(realPts, C.accent, 2.6);
        if (beP != null && beP > 0 && !V.roll) { kit.dot(c, X(beP), Y(0), 4.5, C.muted, C.bg2); kit.label(c, 'payment rule: ' + beP + ' mo', X(beP) + 6, Y(0) + 14, { size: 11, color: C.muted }); }
        if (beT != null) { kit.dot(c, X(beT), Y(0), 5.5, C.ok, C.bg2); kit.label(c, 'really paid back: ' + beT + ' mo', X(beT) + 6, Y(0) - 14, { size: 11.5, color: C.ok, weight: 600 }); }
        if (behind != null) { kit.dot(c, X(behind), Y(0), 5.5, C.bad, C.bg2); kit.label(c, 'behind again', X(behind) + 6, Y(0) + 14, { size: 11.5, color: C.bad, weight: 600 }); }
        const life = realPts[realPts.length - 1][1];
        kit.dot(c, X(N), Y(life), 5.5, life >= 0 ? C.ok : C.bad, C.bg2);
        kit.label(c, kit.money(life, 0, true), X(N) + 8, Y(life), { size: 11.5, color: life >= 0 ? C.ok : C.bad, weight: 600 });
        legend(kit, c, C, x0, 16, [[C.accent, 'real gain: payments saved + lower balance − costs'], [C.muted, 'payments saved − costs', true]]);
      }
      const loop = kit.loop(() => draw(), box.stage);
      solve();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ balloon and interest-only */
  Hyper.sim('lb-balloon', {
    title: 'Amortizing, balloon or interest-only',
    blurb: `Three ways to repay the same loan at the same rate. The lines show what is still owed; the drop at the end is the final payment, which has to come from somewhere. The bars add up everything paid: capital and interest.

- Compare the monthly payments in the read-out with the interest in the bars: every unit saved each month comes back as interest.
- Set the **balloon** to 0 % and it is an ordinary loan; at 100 % it is interest-only.
- Shorten the **term**: the payments rise, but the final sums stay just as large.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 5000, max: 2000000, value: p.P || 300000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Interest rate', min: 0.5, max: 15, step: 0.1, value: p.r || 5, unit: '%' },
        { id: 'T', label: 'Term', min: 1, max: 40, step: 1, value: p.T || 25, unit: 'years' },
        { id: 'bp', label: 'Balloon (% of the loan)', min: 0, max: 100, step: 1, value: p.bp != null ? p.bp : p.B ? Math.min(100, p.B / (p.P || 300000) * 100) : 30, unit: '%' }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['a', 'Amortizing'], ['b', 'With the balloon'], ['i', 'Interest-only'], ['x', 'Extra interest against amortizing']]);
      const V = ctl.values;
      let loans = [];

      function solve() {
        const base = { principal: V.P, annual: V.r / 100, years: Math.round(V.T) };
        const B = V.P * V.bp / 100;
        const am = kit.fin.amortize(base), bl = kit.fin.amortize(Object.assign({ balloon: B }, base)), io = kit.fin.amortize(Object.assign({ method: 'interest-only' }, base));
        const C = kit.colors();
        loans = [
          { name: 'amortizing', s: am, col: C.ok },
          { name: 'balloon ' + kit.money(B, 0, true), s: bl, col: C.series[5] || C.warn },
          { name: 'interest-only', s: io, col: C.bad }
        ];
        const lastPay = s => s.rows[s.rows.length - 1].payment;
        ro.set('a', kit.money(am.firstPayment) + ' a month; ' + kit.money(am.totals.interest, 0) + ' interest');
        ro.set('b', kit.money(bl.firstPayment) + ' a month, then ' + kit.money(lastPay(bl)) + '; ' + kit.money(bl.totals.interest, 0) + ' interest');
        ro.set('i', kit.money(io.firstPayment) + ' a month, then ' + kit.money(lastPay(io)) + '; ' + kit.money(io.totals.interest, 0) + ' interest');
        ro.set('x', 'balloon +' + kit.money(bl.totals.interest - am.totals.interest, 0) + ', interest-only +' + kit.money(io.totals.interest - am.totals.interest, 0));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!loans.length) return;
        const W = st.W, Hh = st.H;
        const Tn = Math.round(V.T), n = 12 * Tn;
        const x0 = 70, y0 = 40, w = W - x0 - 110, h = (Hh - 60) * 0.56;
        const X = k => x0 + k / n * w, Y = v => y0 + h - v / V.P * h;
        moneyGrid(kit, c, C, x0, y0, w, h, 0, V.P);
        yearAxis(kit, c, C, x0, y0 + h, w, Tn, '');
        kit.label(c, 'still owed', x0, y0 - 10, { size: 11.5, color: C.muted });
        legend(kit, c, C, x0 + 80, y0 - 10, loans.map(L => [L.col, L.name]));
        loans.forEach((L, j) => {
          c.strokeStyle = L.col; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(0), Y(V.P));
          const rows = L.s.rows;
          for (let q = 0; q < rows.length - 1; q++) c.lineTo(X(rows[q].k), Y(rows[q].balance));
          const before = rows.length > 1 ? rows[rows.length - 2].balance : V.P;
          c.lineTo(X(n), Y(before)); c.stroke();
          // the final payment
          if (before > V.P * 0.02) {
            kit.arrow(c, X(n) + 8 + j * 14, Y(before), X(n) + 8 + j * 14, Y(0), L.col, 2);
            kit.label(c, kit.money(rows[rows.length - 1].payment, 0, true), X(n) + 14 + j * 14, Y(before) - 8 - j * 13, { size: 11, color: L.col, weight: 600 });
          }
        });
        // everything paid, split into capital and interest
        const by = y0 + h + 40, bh = Math.max(12, (Hh - by - 26) / 3 - 8);
        const top = Math.max(...loans.map(L => L.s.totals.paid), 1);
        const bw = W - x0 - 130;
        loans.forEach((L, j) => {
          const y = by + j * (bh + 8);
          const wc = V.P / top * bw, wi = L.s.totals.interest / top * bw;
          c.fillStyle = C.accent; c.fillRect(x0, y, wc, bh);
          c.fillStyle = C.warn; c.fillRect(x0 + wc, y, wi, bh);
          kit.label(c, L.name, x0 - 6, y + bh / 2, { size: 11, color: L.col, align: 'right', weight: 600 });
          kit.label(c, kit.money(L.s.totals.paid, 0, true) + ' paid', x0 + wc + wi + 6, y + bh / 2, { size: 11, color: C.text2 });
        });
        legend(kit, c, C, x0, Hh - 10, [[C.accent, 'capital repaid'], [C.warn, 'interest']]);
      }
      const loop = kit.loop(() => draw(), box.stage);
      solve();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ payday loan */
  Hyper.sim('lb-payday', {
    title: 'The price of a fortnight',
    blurb: `A short loan with a fee for every ¤100 borrowed, rolled over again and again. The red staircase is the fees paid so far; the dashed line is what you borrowed — still owed in full until the very end. The green line is the interest the same money would have cost on a credit card.

- With the defaults, watch the fees overtake the loan itself.
- Set **Rollovers** to 0: one fortnight, a small-looking fee — and still an APR of hundreds of per cent.
- Compare the red and the green: the card is far from cheap, and still a small fraction of the fees.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'fee', label: 'Fee for every ' + kit.money(100, 0), min: 5, max: 30, step: 0.5, value: p.fee || 15, fmt: v => kit.money(v, 2) },
        { id: 'days', label: 'Length of each loan', min: 7, max: 31, step: 1, value: p.days || 14, unit: 'days' },
        { id: 'amt', label: 'Amount borrowed', min: 50, max: 1500, step: 50, value: p.amt || 400, fmt: v => kit.money(v, 0) },
        { id: 'roll', label: 'Rollovers', min: 0, max: 12, step: 1, value: p.roll != null ? p.roll : 5 },
        { id: 'card', label: 'A credit card at', min: 5, max: 40, step: 1, value: p.card || 24, unit: '% a year' }
      ], () => { prog = 0; loop.start(); });
      const ro = kit.readout(box.side, [['fee', 'Each period costs'], ['apr', 'APR (nominal)'], ['eff', 'Effective, if rolled all year'], ['tot', 'Fees paid in total'], ['card', 'The same on the card']]);
      const V = ctl.values;
      let prog = 0;

      function draw(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const periods = Math.round(V.roll) + 1, d = Math.round(V.days), f = V.fee / 100;
        const feeEach = V.amt * f, total = periods * feeEach, days = periods * d;
        const cardAt = t => V.amt * (Math.pow(1 + V.card / 100 / 365, t) - 1);
        prog = Math.min(periods, prog + (dt || 0) * 1.4);
        if (prog >= periods && loop.running) loop.stop();
        const now = (dt === 0 && !loop.running) ? periods : prog;
        const x0 = 70, y0 = 58, w = W - x0 - 24, h = Hh - y0 - 44;
        const top = Math.max(V.amt, total) * 1.15;
        const X = t => x0 + t / days * w, Y = v => y0 + h - v / top * h;
        moneyGrid(kit, c, C, x0, y0, w, h, 0, top);
        // time axis in days
        c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        for (let k = 0; k <= periods; k++) if (periods <= 8 || k % 2 === 0 || k === periods) c.fillText('day ' + k * d, X(k * d), y0 + h + 4);
        // what you borrowed, owed until the end
        c.strokeStyle = C.text2; c.lineWidth = 1.6; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(X(0), Y(V.amt)); c.lineTo(X(days), Y(V.amt)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'still owed: ' + kit.money(V.amt, 0), X(0) + 6, Y(V.amt) - 9, { size: 11.5, color: C.text2 });
        // the fees paid so far: a staircase
        const shown = Math.floor(now + 1e-9);
        c.fillStyle = C.bad; c.globalAlpha = 0.22; c.beginPath(); c.moveTo(X(0), Y(0));
        let cum = 0;
        for (let k = 1; k <= shown; k++) { c.lineTo(X(k * d), Y(cum)); cum += feeEach; c.lineTo(X(k * d), Y(cum)); }
        c.lineTo(X(Math.min(now, periods) * d), Y(cum)); c.lineTo(X(Math.min(now, periods) * d), Y(0)); c.closePath(); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.bad; c.lineWidth = 2.4; c.beginPath(); c.moveTo(X(0), Y(0));
        cum = 0;
        for (let k = 1; k <= shown; k++) { c.lineTo(X(k * d), Y(cum)); cum += feeEach; c.lineTo(X(k * d), Y(cum)); }
        c.lineTo(X(Math.min(now, periods) * d), Y(cum)); c.stroke();
        for (let k = 1; k <= shown; k++) if (periods <= 8 || k === shown) kit.label(c, '+' + kit.money(feeEach, 0), X(k * d) - 4, Y(k * feeEach) - 9, { size: 11, color: C.bad, align: 'right' });
        // the same money on a card
        c.strokeStyle = C.ok; c.lineWidth = 2.2; c.beginPath();
        for (let t = 0; t <= now * d; t += Math.max(0.5, days / 200)) { const x = X(t), y = Y(cardAt(t)); if (t === 0) c.moveTo(x, y); else c.lineTo(x, y); }
        c.stroke();
        // when the fees overtake the loan
        const over = Math.ceil(V.amt / feeEach - 1e-9);
        if (over <= shown) { kit.dot(c, X(over * d), Y(over * feeEach), 5, C.bad, C.bg2); kit.label(c, 'the fees now exceed what you borrowed', X(over * d) - 8, Y(over * feeEach) - 24, { size: 11.5, color: C.text, align: 'right', weight: 600, bg: C.surface }); }
        // cursor
        if (now < periods) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(now * d), y0); c.lineTo(X(now * d), y0 + h); c.stroke(); }
        const apr = f * 365 / d, eff = Math.pow(1 + f, 365 / d) - 1;
        kit.label(c, 'APR ' + Math.round(apr * 100).toLocaleString('en') + ' % — effective ' + Math.round(eff * 100).toLocaleString('en') + ' % a year', x0, 16, { size: 14, color: C.bad, weight: 700 });
        legend(kit, c, C, x0, 40, [[C.bad, 'fees paid so far'], [C.ok, 'interest on a card'], [C.text2, 'the loan itself', true]]);
        ro.set('fee', kit.money(feeEach) + ' every ' + d + ' days');
        ro.set('apr', Math.round(apr * 100).toLocaleString('en') + ' %');
        ro.set('eff', Math.round(eff * 100).toLocaleString('en') + ' %');
        ro.set('tot', kit.money(total) + ' over ' + days + ' days, and ' + kit.money(V.amt, 0) + ' still to repay');
        ro.set('card', kit.money(cardAt(days)) + ' of interest at ' + V.card + ' %');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ bond price and yield */
  Hyper.sim('lb-price-yield', {
    title: 'A bond\'s price: discounted payments and the price–yield curve',
    blurb: `Top: the payments the bond promises — the coupons and, at the end, the face value — each drawn at its full size (outline) and at its value today (filled), discounted at the market yield. The price is the sum of the filled parts; the bar underneath adds them up against the face value.
Below: the price at every yield. The straight line touching the curve is the duration estimate.

- Raise the **market yield**: every filled bar shrinks, the distant ones most, and the price falls.
- Set the yield equal to the **coupon rate**: the price is exactly the face value.
- Choose **Then yields move by** +1 point: compare the true new price on the curve with the tangent's estimate. The curve bends away from the line — convexity — so losses are a little smaller and gains a little larger than duration says.
- Lengthen the **maturity** to 30 years: the curve steepens. Long bonds are far more sensitive.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const plot = kit.plot(box.stage, { x: { label: 'market yield (%)', name: 'yield' }, y: { label: 'price', fmt: v => kit.money(v, 0) }, fmtX: v => v.toFixed(2) + ' %', fmtY: v => kit.money(v) }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'c', label: 'Coupon rate', min: 0, max: 12, step: 0.25, value: p.c != null ? p.c : 4, unit: '%' },
        { id: 'T', label: 'Years to maturity', min: 1, max: 30, step: 1, value: p.T || 10 },
        { id: 'y', label: 'Market yield', min: 0.25, max: 12, step: 0.05, value: p.y || 5, unit: '%' },
        { id: 'f', type: 'select', label: 'Coupons paid', options: [['once a year', 1], ['twice a year', 2]], value: p.f || 1 },
        { id: 'dy', type: 'select', label: 'Then yields move by', options: [['nothing', 0], ['+1 point', 1], ['−1 point', -1], ['+2 points', 2], ['−2 points', -2]], value: p.dy || 0 }
      ], () => { solve(); loop.once(); });
      const FACE = 1000;
      const ro = kit.readout(box.side, [['price', 'Price, per ' + kit.money(FACE, 0) + ' of face value'], ['cy', 'Current yield'], ['mac', 'Macaulay duration'], ['mod', 'Modified duration'], ['chg', 'After the move']]);
      const V = ctl.values;
      let b = null, flows = [];

      function solve() {
        const C = kit.colors();
        const f = +V.f || 1, T = Math.round(V.T), y = V.y / 100, c = V.c / 100, dy = +V.dy || 0;
        b = kit.fin.bond({ face: FACE, coupon: c, ytm: y, years: T, freq: f });
        flows = [];
        for (let k = 1; k <= T * f; k++) {
          const cf = FACE * c / f + (k === T * f ? FACE : 0);
          flows.push({ t: k / f, cf, coupon: FACE * c / f, pv: cf / Math.pow(1 + y / f, k) });
        }
        const P0 = b.price, D = b.modified;
        const kind = Math.abs(P0 - FACE) < 0.005 ? 'at par' : P0 > FACE ? 'a premium of ' + kit.money(P0 - FACE) : 'a discount of ' + kit.money(FACE - P0);
        ro.set('price', kit.money(P0) + ' (' + kind + ')');
        ro.set('cy', b.currentYield > 0 ? kit.pct(b.currentYield) : '— (no coupon)');
        ro.set('mac', b.macaulay.toFixed(2) + ' years');
        ro.set('mod', D.toFixed(2) + ': a 1-point rise ≈ −' + D.toFixed(2) + ' %');
        // the price–yield curve and the duration tangent
        const hiY = Math.max(12, V.y + Math.abs(dy) + 1);
        const curve = [];
        for (let yy = 0.1; yy <= hiY + 1e-9; yy += 0.05) curve.push([yy, kit.fin.bond({ face: FACE, coupon: c, ytm: yy / 100, years: T, freq: f }).price]);
        const tan = [];
        for (let yy = Math.max(0.1, V.y - 3); yy <= V.y + 3 + 1e-9; yy += 0.1) tan.push([yy, P0 * (1 - D * (yy - V.y) / 100)]);
        const marks = [{ x: V.y, y: P0, color: C.accent }];
        if (dy) {
          const y1 = Math.max(0.1, V.y + dy);
          const b1 = kit.fin.bond({ face: FACE, coupon: c, ytm: y1 / 100, years: T, freq: f });
          const est1 = P0 * (1 - D * (y1 - V.y) / 100), est2 = est1 + P0 * 0.5 * b.convexity * Math.pow((y1 - V.y) / 100, 2);
          marks.push({ x: y1, y: b1.price, color: dy > 0 ? C.bad : C.ok, label: kit.money(b1.price, 0) });
          marks.push({ x: y1, y: est1, color: C.muted, r: 4 });
          ro.set('chg', kit.pct(b1.price / P0 - 1) + ' → ' + kit.money(b1.price) + '; duration says ' + kit.pct(est1 / P0 - 1) + ', with convexity ' + kit.pct(est2 / P0 - 1));
        } else ro.set('chg', 'choose a move below');
        plot.set({
          x: { label: 'market yield (%)', name: 'yield', min: 0, max: hiY },
          series: [{ pts: curve, label: 'price at each yield', width: 2.5, color: C.accent }, { pts: tan, label: 'duration estimate (tangent)', dash: [6, 4], color: C.muted, hover: false }],
          hlines: [{ y: FACE, label: 'face value' }],
          vlines: c > 0 ? [{ x: V.c, label: 'yield = coupon' }] : [],
          marks
        });
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        if (!b || !flows.length) return;
        const W = st.W, Hh = st.H;
        const x0 = 64, x1 = W - 20, top = 40, base = Hh - 70, w = x1 - x0, h = base - top;
        const T = Math.round(V.T);
        const maxCf = Math.max(...flows.map(q => q.cf), 1);
        const bw = Math.max(2, Math.min(28, w / flows.length * 0.62));
        const pvFace = FACE / Math.pow(1 + V.y / 100 / (+V.f || 1), flows.length);
        const pvCoupons = b.price - pvFace;
        // payments: full size as an outline, value today filled
        flows.forEach((q, j) => {
          const x = x0 + (j + 1) / flows.length * (w - bw);
          const hc = q.cf / maxCf * h, hp = q.pv / maxCf * h;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x, base - hc, bw, hc);
          c.fillStyle = j === flows.length - 1 ? C.ok : C.accent; c.fillRect(x, base - hp, bw, hp);
        });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, base); c.lineTo(x1, base); c.stroke();
        c.font = FONT; c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = T > 20 ? 5 : T > 10 ? 2 : 1;
        for (let t = tick; t <= T; t += tick) c.fillText(t + ' yr', x0 + t / T * (w - bw) + bw / 2, base + 3);
        kit.label(c, 'face value ' + kit.money(FACE, 0) + ', worth ' + kit.money(pvFace) + ' today', x1, top - 6, { size: 11.5, color: C.ok, align: 'right' });
        kit.label(c, 'each payment: full size (outline) and value today (filled), at ' + kit.pct(V.y / 100), x0, 12, { size: 12, color: C.text, weight: 600 });
        // the price, assembled from the discounted payments
        const by = Hh - 34, bh = 14, scale = Math.max(1, w - 250) / Math.max(b.price, FACE);
        c.fillStyle = C.accent; c.fillRect(x0, by, pvCoupons * scale, bh);
        c.fillStyle = C.ok; c.fillRect(x0 + pvCoupons * scale, by, pvFace * scale, bh);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x0 + FACE * scale, by - 5); c.lineTo(x0 + FACE * scale, by + bh + 5); c.stroke(); c.setLineDash([]);
        kit.label(c, 'face', x0 + FACE * scale, by - 10, { size: 10.5, color: C.text2, align: 'center' });
        kit.label(c, 'price ' + kit.money(b.price) + ' = coupons ' + kit.money(pvCoupons) + ' + face ' + kit.money(pvFace), x0 + Math.max(b.price, FACE) * scale + 10, by + bh / 2, { size: 11.5, color: C.text, weight: 600 });
      }
      const loop = kit.loop(() => draw(), box.stage);
      solve();
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the yield curve */
  // a smooth curve through a short and a long yield with an optional hump (Nelson–Siegel form)
  const MATS = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 20, 30];
  function curveFn(s, l, k) {
    const tau = 1.8;
    const g = m => (1 - Math.exp(-m / tau)) / (m / tau), hmp = m => g(m) - Math.exp(-m / tau);
    const g1 = g(0.25), g2 = g(30), h1 = hmp(0.25), h2 = hmp(30);
    const b1 = (s - l - k * (h1 - h2)) / (g1 - g2), b0 = s - b1 * g1 - k * h1;
    return m => b0 + b1 * g(m) + k * hmp(m);
  }
  const PRESETS = { normal: [3, 5, 0], flat: [4.2, 4.2, 0], inverted: [5.5, 3.8, 0], humped: [3.5, 3.8, 2.5] };

  Hyper.sim('lb-yield-curve', {
    title: 'The yield curve: normal, flat, inverted',
    blurb: `Each dot is the yield on government bonds of one maturity, from three months to thirty years; the line through them is the yield curve. The dashed line shows what the curve implies for one-year rates in the years ahead — the forward rates.

- Step through the shapes. **Normal**: longer loans pay more. **Inverted**: short rates are above long ones — the market expects rates to fall.
- Raise the **short rate** alone, as a central bank does when it tightens: the curve flattens, then inverts.
- Watch the dashed forward rates: when the curve slopes down, the rates it implies for later years are lower still.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 290 });
      const pre = PRESETS[p.preset] || PRESETS.normal;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Shape', options: [['normal (upward)', 'normal'], ['flat', 'flat'], ['inverted', 'inverted'], ['humped', 'humped']], value: PRESETS[p.preset] ? p.preset : 'normal' },
        { id: 's', label: 'Short rate (3 months)', min: 0, max: 10, step: 0.05, value: pre[0], unit: '%' },
        { id: 'l', label: 'Long rate (30 years)', min: 0, max: 10, step: 0.05, value: pre[1], unit: '%' },
        { id: 'k', label: 'Hump in the middle', min: -3, max: 3, step: 0.1, value: pre[2], unit: 'points' }
      ], (id, v) => {
        if (id === 'preset' && PRESETS[v]) { const q = PRESETS[v]; ctl.set('s', q[0]); ctl.set('l', q[1]); ctl.set('k', q[2]); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['m3', '3-month yield'], ['y2', '2-year yield'], ['y10', '10-year yield'], ['sp', 'Slope (10 years − 3 months)'], ['shape', 'Shape'], ['sig', 'What it usually signals']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const Y = curveFn(V.s, V.l, V.k);
        const fwd = [];
        for (let m = 1; m < 30; m++) {
          const a = Y(m) / 100, bb = Y(m + 1) / 100;
          fwd.push([m + 0.5, (Math.pow(1 + bb, m + 1) / Math.pow(1 + a, m) - 1) * 100]);
        }
        const vals = MATS.map(Y).concat(fwd.map(q => q[1]));
        const lo = Math.min(0, Math.floor(Math.min(...vals) - 0.5)), hi = Math.max(4, Math.ceil(Math.max(...vals) + 0.5));
        const x0 = 56, y0 = 40, w = W - x0 - 24, h = Hh - y0 - 50;
        const X = m => x0 + Math.sqrt(m / 30) * w, YY = v => y0 + h - (v - lo) / (hi - lo) * h;
        // grid in per cent
        const step = Hyper.niceStep(hi - lo, 5);
        c.font = FONT; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, YY(v)); c.lineTo(x0 + w, YY(v)); c.stroke();
          c.fillStyle = C.muted; c.fillText((Math.abs(v) < 1e-9 ? 0 : +v.toFixed(2)) + ' %', x0 - 6, YY(v));
        }
        c.textAlign = 'center'; c.textBaseline = 'top';
        for (const m of MATS) c.fillText(m < 1 ? Math.round(m * 12) + ' mo' : m + ' yr', X(m), y0 + h + 5);
        kit.label(c, 'maturity', x0 + w / 2, y0 + h + 26, { size: 11.5, color: C.muted, align: 'center' });
        // forward rates
        c.strokeStyle = C.warn; c.lineWidth = 1.8; c.setLineDash([6, 4]); c.beginPath();
        fwd.forEach((q, j) => j ? c.lineTo(X(q[0]), YY(q[1])) : c.moveTo(X(q[0]), YY(q[1]))); c.stroke(); c.setLineDash([]);
        // the curve and its points
        c.strokeStyle = C.accent; c.lineWidth = 2.6; c.beginPath();
        for (let j = 0; j <= 200; j++) { const m = 0.25 + (30 - 0.25) * Math.pow(j / 200, 2); const x = X(m), yv = YY(Y(m)); if (j) c.lineTo(x, yv); else c.moveTo(x, yv); }
        c.stroke();
        for (const m of MATS) { kit.dot(c, X(m), YY(Y(m)), 4, C.accent, C.bg2); }
        for (const m of [0.25, 2, 10, 30]) kit.label(c, Y(m).toFixed(2) + ' %', X(m), YY(Y(m)) - 13, { size: 11, color: C.text, align: 'center' });
        legend(kit, c, C, x0, 16, [[C.accent, 'yield by maturity'], [C.warn, 'implied one-year rate in future years', true]]);
        // what the shape says
        const slope = Y(10) - Y(0.25), mid = Math.max(Y(2), Y(3), Y(5)), ends = Math.max(Y(0.25), Y(30));
        let shape, sig;
        if (mid > ends + 0.3 && slope > -0.25) { shape = 'humped'; sig = 'mixed: rates expected to rise for a while, then fall back'; }
        else if (slope > 0.5) { shape = 'normal (upward)'; sig = 'lenders want more for longer loans; rates expected to hold or rise'; }
        else if (slope < -0.25) { shape = 'inverted'; sig = 'the market expects rates to fall — often ahead of a slowdown'; }
        else { shape = 'flat'; sig = 'little difference between maturities; often a turning point'; }
        ro.set('m3', Y(0.25).toFixed(2) + ' %');
        ro.set('y2', Y(2).toFixed(2) + ' %');
        ro.set('y10', Y(10).toFixed(2) + ' %');
        ro.set('sp', (slope >= 0 ? '+' : '−') + Math.abs(slope).toFixed(2) + ' points');
        ro.set('shape', shape);
        ro.set('sig', sig);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ credit risk */
  Hyper.sim('lb-credit', {
    title: 'Credit risk: a hundred bonds, and some of them fail',
    blurb: `Each square is a bond from a different borrower, ¤100 each, all promising the same yield. Every year each borrower still paying has the same chance of defaulting; a defaulted bond pays back only the recovery rate. The bars compare a safe government bond, the promised yield, the return to expect on average, and what this particular draw earned.

- Press **Draw again** a few times: the number of defaults changes, and so does the return. That scatter is the risk.
- Lower the **spread** until it roughly equals the expected loss (see the read-out): the risky bonds then earn, on average, about what the safe one pays — with extra uncertainty for nothing.
- Raise the default chance to 10 % a year, as for weak borrowers in a deep recession: the promised yield stops meaning much.`,
    mount(box, kit, params) {
      const p = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Government bond yield', min: 0, max: 10, step: 0.1, value: p.g != null ? p.g : 4, unit: '%' },
        { id: 's', label: 'Credit spread', min: 0, max: 15, step: 0.1, value: p.s != null ? p.s : 3, unit: 'points' },
        { id: 'pd', label: 'Chance of default each year', min: 0, max: 20, step: 0.1, value: p.pd != null ? p.pd : 2, unit: '%' },
        { id: 'R', label: 'Recovery after a default', min: 0, max: 100, step: 1, value: p.R != null ? p.R : 40, unit: '%' },
        { id: 'T', label: 'Years held', min: 1, max: 10, step: 1, value: p.T || 5 },
        { type: 'buttons', items: [{ id: 'draw', label: 'Draw again', primary: true }] }
      ], id => { if (id === 'draw') { seed++; } sample(); loop.once(); });
      const ro = kit.readout(box.side, [['y', 'Promised yield'], ['el', 'Expected loss a year'], ['er', 'Expected return (about)'], ['be', 'Spread that only covers the loss'], ['draw', 'This draw']]);
      const V = ctl.values;
      let seed = 7, u = [], res = null;

      // the same random numbers for every setting, so raising the default chance only adds defaults
      function sample() {
        const z = kit.fin.normals(seed);
        u = [];
        for (let i = 0; i < 100; i++) { const row = []; for (let t = 0; t < 10; t++) row.push(kit.fin.ncdf(z())); u.push(row); }
      }
      function run() {
        const T = Math.round(V.T), y = (V.g + V.s) / 100, pd = V.pd / 100, R = V.R / 100;
        const flows = new Array(T + 1).fill(0);
        flows[0] = -10000;
        const when = [];
        for (let i = 0; i < 100; i++) {
          let d = 0;
          for (let t = 1; t <= T; t++) if (u[i][t - 1] < pd) { d = t; break; }
          when.push(d);
          for (let t = 1; t <= T; t++) {
            if (d && t === d) { flows[t] += 100 * R; break; }
            flows[t] += 100 * y + (t === T ? 100 : 0);
          }
        }
        const irr = kit.fin.irr(flows);
        const el = pd * (1 - R);
        const er = (1 - pd) * (1 + y) + pd * R - 1;
        const g = V.g / 100;
        const be = pd < 1 ? (1 + g - pd * R) / (1 - pd) - 1 - g : NaN;
        res = { T, y, el, er, be, irr, when, n: when.filter(Boolean).length, g };
        ro.set('y', kit.pct(y) + ' (' + kit.pct(g) + ' + ' + V.s.toFixed(1) + ' points)');
        ro.set('el', kit.pct(el));
        ro.set('er', kit.pct(er));
        ro.set('be', Number.isFinite(be) ? kit.pct(be) : '—');
        ro.set('draw', res.n + (res.n === 1 ? ' default, ' : ' defaults, ') + (Number.isFinite(irr) ? kit.pct(irr) + ' a year' : 'most of the money lost'));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        run();
        const W = st.W, Hh = st.H;
        // the hundred bonds
        const side = Math.max(8, Math.min((Hh - 70) / 10, (W * 0.48) / 10));
        const gx = 20, gy = 40;
        kit.label(c, '100 bonds, ' + kit.money(100, 0) + ' each — red: defaulted (year shown)', gx, 16, { size: 12, color: C.text, weight: 600 });
        res.when.forEach((d, i) => {
          const x = gx + (i % 10) * side, y = gy + Math.floor(i / 10) * side;
          c.fillStyle = d ? C.bad : C.ok; c.globalAlpha = d ? 0.9 : 0.55;
          c.fillRect(x + 1, y + 1, side - 2, side - 2); c.globalAlpha = 1;
          if (d && side >= 16) kit.label(c, String(d), x + side / 2, y + side / 2, { size: 10, color: C.bg2, align: 'center', weight: 700 });
        });
        // the returns
        const bx = gx + side * 10 + 50, bw = W - bx - 30;
        const items = [['government bond', res.g, C.muted], ['promised', res.y, C.accent], ['expected', res.er, C.warn], ['this draw', res.irr, Number.isFinite(res.irr) && res.irr >= res.g ? C.ok : C.bad]];
        const vals = items.map(q => q[1]).filter(Number.isFinite);
        const lo = Math.min(0, ...vals), hi = Math.max(0.01, ...vals);
        const zx = bx + (0 - lo) / (hi - lo) * bw;
        const bh = Math.min(30, (Hh - gy - 40) / items.length - 12);
        kit.label(c, 'yearly return over ' + yrs(res.T), bx, 16, { size: 12, color: C.text, weight: 600 });
        items.forEach(([name, v, col], j) => {
          const y = gy + 18 + j * (bh + 26);
          kit.label(c, name, bx, y - 8, { size: 11.5, color: C.text2 });
          if (!Number.isFinite(v)) { kit.label(c, '—', bx, y + bh / 2, { size: 12, color: C.muted }); return; }
          const x = bx + (v - lo) / (hi - lo) * bw;
          c.fillStyle = col; c.fillRect(Math.min(zx, x), y, Math.abs(x - zx), bh);
          kit.label(c, kit.pct(v), Math.max(zx, x) + 6, y + bh / 2, { size: 11.5, color: C.text, weight: 600 });
        });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(zx, gy + 10); c.lineTo(zx, gy + 18 + items.length * (bh + 26)); c.stroke();
      }
      sample();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

})();
