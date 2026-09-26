/* HYPER-FINANCES · sims/reference.js — the reference simulations for finance authors:
 * a loan's schedule drawn year by year (kit.fin.amortize, kit.money, kit.table), and the
 * compound-interest snowball that splits a balance into what you paid and what interest added. */
(function () {
  'use strict';

  // a money axis on the left of a chart area: gridlines and labels ("$250k")
  function moneyAxis(kit, c, x0, y0, w, h, max, C) {
    const step = Hyper.niceStep(max, 5);
    c.font = '11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let v = 0; v <= max * 1.0001; v += step) {
      const y = y0 + h - v / max * h;
      c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x0 + w, y); c.stroke();
      c.fillStyle = C.muted; c.fillText(kit.money(v, 0, true), x0 - 6, y);
    }
  }

  /* ================================================================ amortization */
  Hyper.sim('ref-amortization', {
    title: 'Inside a loan: where every payment goes',
    blurb: `Each bar is one year of payments: the **interest** part and the **capital** part (and any extra you pay). The line is what you still owe. Drag **Look at payment** to see how one instalment splits.

- Early bars are mostly interest; the balance falls slowly, then faster. Find the month where capital overtakes interest.
- Switch to **Equal capital**: payments start higher and fall, the balance drops in a straight line, and the total interest is lower.
- Add a small **extra** each month and watch the loan end years early.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Amount borrowed', min: 10000, max: 2000000, value: 250000, log: true, sig: 2, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Interest rate', min: 0, max: 15, step: 0.05, value: 5, unit: '%' },
        { id: 'T', label: 'Term', min: 1, max: 40, step: 1, value: 25, unit: 'years' },
        { id: 'method', type: 'select', label: 'Repayment', options: [['Level payments (annuity)', 'annuity'], ['Equal capital (linear)', 'linear']], value: params && params.method || 'annuity' },
        { id: 'extra', label: 'Extra every month', min: 0, max: 3000, step: 25, value: 0, fmt: v => kit.money(v, 0) },
        { id: 'k', label: 'Look at payment no.', min: 1, max: 480, step: 1, value: 1 }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['pay', 'Monthly payment'], ['split', 'That payment'], ['tot', 'Total interest'], ['end', 'Paid off in'], ['cross', 'Capital > interest from']]);
      const tbl = kit.table(box.stage, [
        { label: 'Year', key: 'year', align: 'left' }, { label: 'Paid', key: 'paid', fmt: v => kit.money(v) }, { label: 'Interest', key: 'interest', fmt: v => kit.money(v) },
        { label: 'Capital', key: 'capital', fmt: v => kit.money(v) }, { label: 'Still owed', key: 'balance', fmt: v => kit.money(v) }
      ], { maxHeight: 220 });
      const V = ctl.values;
      let s = null, years = [], sel = null;

      function solve() {
        s = kit.fin.amortize({ principal: V.P, annual: V.r / 100, years: V.T, method: V.method, extra: V.extra });
        years = kit.fin.yearly(s);
        const k = Math.min(Math.round(V.k), s.periods);
        sel = s.rows[k - 1];
        const first = s.rows[0], last = s.rows[s.rows.length - 1];
        ro.set('pay', V.method === 'linear' ? kit.money(first.payment) + ' → ' + kit.money(last.payment) : kit.money(first.payment));
        ro.set('split', sel ? 'no. ' + k + ': ' + kit.money(sel.interest) + ' interest + ' + kit.money(sel.principal + sel.extra) + ' capital' : '—');
        ro.set('tot', kit.money(s.totals.interest) + ' (' + kit.pct(s.totals.interest / V.P, 0) + ' of the loan)');
        ro.set('end', (s.periods / 12).toFixed(1) + ' years (' + s.periods + ' payments)');
        const cross = s.rows.findIndex(r => r.principal + r.extra > r.interest);
        ro.set('cross', cross < 0 ? '—' : 'payment ' + (cross + 1) + ' (year ' + Math.ceil((cross + 1) / 12) + ')');
        const hy = sel ? sel.year : 0;
        tbl.set(years.map(y => ({ year: y.year, paid: y.payment + y.extra, interest: y.interest, capital: y.principal + y.extra, balance: y.balance, _cls: y.year === hy ? 'hl' : '' })));
      }

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = 64, y0 = 30, w = W - x0 - 64, h = Hh - y0 - 46;
        if (!s || !years.length) return;
        const maxBar = Math.max(...years.map(y => y.payment + y.extra)) * 1.1;
        moneyAxis(kit, c, x0, y0, w, h, maxBar, C);
        kit.label(c, 'paid each year', x0, y0 - 14, { size: 11.5, color: C.muted });
        const n = Math.max(V.T, years.length), bw = w / n;
        years.forEach((y, j) => {
          const x = x0 + j * bw + bw * 0.12, bwi = bw * 0.76;
          const hI = y.interest / maxBar * h, hP = y.principal / maxBar * h, hE = y.extra / maxBar * h;
          let yy = y0 + h;
          c.fillStyle = C.warn; c.fillRect(x, yy - hI, bwi, hI); yy -= hI;
          c.fillStyle = kit.hue(215); c.fillRect(x, yy - hP, bwi, hP); yy -= hP;
          if (hE > 0) { c.fillStyle = C.ok; c.fillRect(x, yy - hE, bwi, hE); }
          if (sel && y.year === sel.year) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 1, yy - hE - 1, bwi + 2, y0 + h - yy + hE + 2); }
        });
        // the balance on its own scale (right axis)
        const bx = k => x0 + k / 12 * bw;
        c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(bx(0), y0 + h - h);
        s.rows.forEach(r => c.lineTo(bx(r.k), y0 + h - r.balance / V.P * h));
        c.stroke();
        c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle';
        for (const f of [0, 0.25, 0.5, 0.75, 1]) c.fillText(Math.round(f * 100) + ' %', x0 + w + 6, y0 + h - f * h);
        kit.label(c, 'still owed (right scale)', x0 + w, y0 - 14, { size: 11.5, color: C.text, align: 'right' });
        // x axis
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = n > 20 ? 5 : n > 10 ? 2 : 1;
        for (let yv = tick; yv <= n; yv += tick) c.fillText(String(yv), x0 + (yv - 0.5) * bw, y0 + h + 5);
        kit.label(c, 'year', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
        // legend
        const lg = [[C.warn, 'interest'], [kit.hue(215), 'capital']].concat(V.extra > 0 ? [[C.ok, 'extra']] : []);
        lg.forEach(([col, t], j) => { c.fillStyle = col; c.fillRect(x0 + 120 + j * 86, y0 - 19, 11, 11); kit.label(c, t, x0 + 136 + j * 86, y0 - 14, { size: 11.5, color: C.text2 }); });
        // the chosen payment, split
        if (sel) {
          const px = bx(sel.k), py = y0 + h - sel.balance / V.P * h;
          kit.dot(c, px, py, 5, C.accent, C.bg2);
        }
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ compound interest */
  Hyper.sim('ref-compound', {
    title: 'The compound-interest snowball',
    blurb: `Each bar is your balance at the end of a year, split into what you **paid in**, the **simple interest** those payments earned, and the **interest earned on interest** — the part that only compounding produces.

- With the defaults, look at the last bars: interest on interest is soon the largest slice.
- Halve the years: the final balance falls by far more than half. Time is the ingredient that matters most.
- Compare 4 % and 8 %: double the rate gives much more than double the growth.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'P', label: 'Starting amount', min: 0, max: 100000, step: 500, value: 5000, fmt: v => kit.money(v, 0) },
        { id: 'c', label: 'Added every month', min: 0, max: 3000, step: 25, value: 300, fmt: v => kit.money(v, 0) },
        { id: 'r', label: 'Yearly return', min: 0, max: 15, step: 0.1, value: 7, unit: '%' },
        { id: 'T', label: 'Years', min: 1, max: 50, step: 1, value: 30 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['end', 'Balance at the end'], ['in', 'You paid in'], ['si', 'Simple interest'], ['ci', 'Interest on interest'], ['dbl', 'Money doubles every']]);
      const V = ctl.values;

      function draw() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const x0 = 64, y0 = 30, w = W - x0 - 16, h = Hh - y0 - 46;
        const r = V.r / 100, i = r / 12, T = Math.round(V.T);
        // year by year: balance with monthly compounding; paid in; simple interest on each payment
        const bars = [];
        let bal = V.P;
        for (let y = 1; y <= T; y++) {
          for (let m = 0; m < 12; m++) bal = bal * (1 + i) + V.c;
          const paid = V.P + V.c * 12 * y;
          // simple interest: each deposit earns r a year on itself only, for the time it has been in
          const simple = V.P * r * y + V.c * r * (12 * y) * (12 * y - 1) / 2 / 12;
          bars.push({ y, bal, paid, simple: Math.min(simple, Math.max(0, bal - paid)), comp: Math.max(0, bal - paid - simple) });
        }
        const last = bars[bars.length - 1];
        const max = Math.max(1, last.bal) * 1.08;
        moneyAxis(kit, c, x0, y0, w, h, max, C);
        const bw = w / T;
        bars.forEach((b, j) => {
          const x = x0 + j * bw + bw * 0.12, wi = bw * 0.76;
          let yy = y0 + h;
          for (const [v, col] of [[b.paid, kit.hue(215)], [b.simple, C.warn], [b.comp, C.ok]]) { const hh = v / max * h; c.fillStyle = col; c.fillRect(x, yy - hh, wi, hh); yy -= hh; }
        });
        c.fillStyle = C.muted; c.font = '11px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top';
        const tick = T > 20 ? 5 : T > 10 ? 2 : 1;
        for (let yv = tick; yv <= T; yv += tick) c.fillText(String(yv), x0 + (yv - 0.5) * bw, y0 + h + 5);
        kit.label(c, 'year', x0 + w / 2, y0 + h + 24, { size: 11.5, color: C.muted, align: 'center' });
        [[kit.hue(215), 'paid in'], [C.warn, 'simple interest'], [C.ok, 'interest on interest']].forEach(([col, t], j) => {
          c.fillStyle = col; c.fillRect(x0 + j * 130, y0 - 19, 11, 11); kit.label(c, t, x0 + 16 + j * 130, y0 - 14, { size: 11.5, color: C.text2 });
        });
        ro.set('end', kit.money(last.bal));
        ro.set('in', kit.money(last.paid) + ' (' + kit.pct(last.paid / last.bal, 0) + ')');
        ro.set('si', kit.money(last.simple));
        ro.set('ci', kit.money(last.comp) + ' (' + kit.pct(last.comp / last.bal, 0) + ')');
        ro.set('dbl', r > 0 ? kit.fin.doublingTime(r).toFixed(1) + ' years (72 ÷ ' + V.r + ' = ' + (72 / V.r).toFixed(1) + ')' : 'never');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });
})();
