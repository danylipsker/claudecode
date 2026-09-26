/* HYPER-CORE · ui/money.js
 *
 * Tools → Money calculators (Hyper Finances): the everyday calculations people need,
 * each with its numbers, a graph and, for loans, the full schedule.
 *
 *   #/tools/money/loan      loan and mortgage: level or equal-capital payments, extras, a rate
 *                           change, index-linking, fees → APR; schedule by year or month; CSV
 *   #/tools/money/compare   two loan offers side by side
 *   #/tools/money/save      a savings plan: contributions, return, fees, inflation
 *   #/tools/money/retire    financial independence: the target, the years to get there, and
 *                           how a withdrawal plan survives random markets (Monte Carlo)
 *   #/tools/money/returns   CAGR, IRR of any cash flows, average versus compound return
 *   #/tools/money/inflation what money is worth over time
 *   #/tools/money/card      a credit card paid at the minimum
 *
 * The arithmetic is HYPER-CORE/js/finance.js (tested by tools/test-finance.js).
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, F = () => H.finance;
  const M = (v, d) => U.money(v, d), MC = v => U.money(v, 0, true), P = (f, d) => U.pct(f, d);

  const TABS = [['loan', 'Loan & mortgage'], ['compare', 'Compare loans'], ['save', 'Savings plan'], ['retire', 'Financial independence'],
    ['returns', 'Returns: CAGR & IRR'], ['inflation', 'Inflation'], ['card', 'Credit card']];

  /* ---------------------------------------------------------------- form helpers */
  // fields: [id, label, value, kind ('money' | 'pct' | 'yr' | 'n' | 'select' | 'check'), extra]
  function form(el, fields, onChange) {
    const cur = H.units.currency;
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'select') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' +
        extra.map(([v, t]) => '<option value="' + esc(v) + '"' + (v === value ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      const unit = kind === 'money' ? cur : kind === 'pct' ? '%' : kind === 'yr' ? 'years' : (extra || '');
      const shown = kind === 'money' ? U.group(value, 0) : String(value);
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp' + (kind === 'money' ? ' pre' : '') + '">' +
        (kind === 'money' ? '<i>' + esc(cur) + '</i>' : '') + '<input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(shown) + '">' +
        (kind !== 'money' && unit ? '<i>' + esc(unit) + '</i>' : '') + '</span></label>';
    }).join('');
    const kinds = {};
    fields.forEach(f => { kinds[f[0]] = f[3]; });
    const values = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, k = kinds[id];
        if (k === 'check') v[id] = inp.checked;
        else if (k === 'select') v[id] = inp.value;
        else {
          let x = NaN;
          try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || '0'), {}); } catch (e) { x = NaN; }
          inp.classList.toggle('bad', !Number.isFinite(x));
          v[id] = k === 'pct' ? x / 100 : x;
        }
      });
      return v;
    };
    el.addEventListener('input', () => onChange(values()));
    el.addEventListener('change', e => {
      const inp = e.target;
      if (kinds[inp.dataset.f] === 'money') { const x = U.cleanNum(inp.value); if (/^-?[\d.]+$/.test(x)) inp.value = U.group(+x, +x % 1 ? 2 : 0); }
      onChange(values());
    });
    return values;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function plotIn(el, opts, h) {
    const cv = document.createElement('canvas');
    cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    el.appendChild(cv);
    const p = new H.Plot(cv, Object.assign({ fmtY: v => M(v, 0) }, opts));
    ui.onLeave(() => p.destroy());
    return p;
  }
  const moneyAxis = label => ({ label, min: 0, fmt: v => MC(v) });
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot boxy"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), extra: ui.$('.mextra', el) };
  }
  function csv(name, head, rows) {
    const q = s => /[",\n]/.test(s) ? '"' + String(s).replace(/"/g, '""') + '"' : s;
    const text = [head].concat(rows).map(r => r.map(x => q(typeof x === 'number' ? (Math.round(x * 100) / 100).toString() : String(x))).join(',')).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/csv' }));
    a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  }

  /* ---------------------------------------------------------------- loan and mortgage */
  function loan(el) {
    const L = layout(el, 'Any loan repaid in instalments: a mortgage, a car loan, a personal loan. Change a number and everything follows. Level payments (annuity; called French or “Spitzer” in some countries) keep the instalment constant; equal capital (linear) repays the same capital each month, so payments start higher and fall.');
    const plot = plotIn(L.plot, { x: { label: 'years', min: 0 }, y: moneyAxis('') , fmtX: v => U.fmt(v, 3) + ' yr' }, 250);
    let byMonth = false, last = null;
    const read = form(L.form, [
      ['P', 'Amount borrowed', 300000, 'money'], ['r', 'Interest rate (yearly)', 5, 'pct'], ['T', 'Term', 30, 'yr'],
      ['method', 'Repayment', 'annuity', 'select', [['annuity', 'Level payments (annuity)'], ['linear', 'Equal capital (linear)'], ['interest-only', 'Interest only, capital at the end']]],
      ['fees', 'Up-front fees', 0, 'money'],
      ['s1', 'Paying more', 0, 'sep'],
      ['extra', 'Extra every month', 0, 'money'], ['lump', 'One-off prepayment', 0, 'money'], ['lumpY', '… after year', 5, 'n', 'yr'],
      ['prepay', 'A prepayment should…', 'shorten', 'select', [['shorten', 'shorten the loan (same payment)'], ['reduce', 'lower the payment (same end)']]],
      ['s2', 'What if', 0, 'sep'],
      ['newR', 'The rate changes to', 5, 'pct'], ['newY', '… after year', 0, 'n', 'yr (0 = never)'],
      ['infl', 'Linked to inflation of', 0, 'pct', '% a year (0 = not linked)']
    ], v => calc(v));
    function calc(v) {
      const base = { principal: v.P, annual: v.r, years: v.T, method: v.method, fees: v.fees, prepay: v.prepay, inflation: v.infl || 0 };
      if (v.newY > 0) base.rates = [[1, v.r], [Math.round(v.newY * 12) + 1, v.newR]];
      const plain = F().amortize(base);
      const s = F().amortize(Object.assign({}, base, { extra: v.extra, lumps: v.lump > 0 ? [{ k: Math.max(1, Math.round(v.lumpY * 12)), amount: v.lump }] : [] }));
      last = { s, v };
      if (!s.rows.length || !Number.isFinite(s.firstPayment)) { L.stats.innerHTML = '<p class="muted">Enter an amount, a rate and a term.</p>'; return; }
      const aprV = F().apr({ principal: v.P, fees: v.fees, payments: s.rows.map(r => r.payment + r.extra) });
      const saved = plain.totals.interest + plain.totals.indexation - s.totals.interest - s.totals.indexation;
      const firstInt = s.rows[0].interest / s.rows[0].payment;
      L.stats.innerHTML =
        stat('First monthly payment', M(s.firstPayment), v.method === 'linear' ? 'falling to ' + M(s.rows[s.rows.length - 1].payment) : v.infl ? 'rising with prices to ' + M(s.maxPayment) : (v.newY > 0 ? 'then ' + M(s.rows[Math.min(s.rows.length - 1, Math.round(v.newY * 12))].payment) : ''), 'big') +
        stat('Total interest', M(s.totals.interest), P(s.totals.interest / v.P, 0) + ' of the loan') +
        (v.infl ? stat('Indexation added', M(s.totals.indexation), 'the balance grows with prices') : '') +
        stat('Total repaid', M(s.totals.paid), 'fees included') +
        stat('Paid off in', U.fmt(s.years, 3) + ' years', s.periods + ' payments' + (s.periods < plain.periods ? ' — ' + ((plain.periods - s.periods) / 12).toFixed(1) + ' years early' : '')) +
        stat('True cost (APR)', P(aprV.apr), v.fees ? 'the fees included' : 'no fees: equal to the rate') +
        (saved > 0.5 ? stat('Saved by paying more', M(saved), 'interest you will not pay', 'good') : '') +
        stat('Interest in the first payment', P(firstInt, 0), 'the rest repays the capital');
      // the graph: what is still owed, and the interest and capital paid so far
      const bal = [[0, v.P]], ci = [[0, 0]], cp = [[0, 0]], plainBal = [[0, v.P]];
      let ai = 0, ap = 0;
      s.rows.forEach(r => { ai += r.interest; ap += r.principal + r.extra; bal.push([r.k / 12, r.balance]); ci.push([r.k / 12, ai]); cp.push([r.k / 12, ap]); });
      plain.rows.forEach(r => plainBal.push([r.k / 12, r.balance]));
      plot.set({
        x: { label: 'years', min: 0, max: Math.max(plain.years, s.years) },
        series: [{ pts: bal, label: 'still owed', width: 2.5 }, { pts: ci, label: 'interest paid so far' }, { pts: cp, label: 'capital repaid so far' }]
          .concat(s.periods < plain.periods || v.lump > 0 ? [{ pts: plainBal, label: 'owed without extras', dash: [6, 4] }] : [])
      });
      table();
    }
    function table() {
      if (!last) return;
      const { s, v } = last;
      const rows = byMonth ? s.rows.map(r => ({ t: 'Month ' + r.k, payment: r.payment + r.extra, interest: r.interest, principal: r.principal + r.extra, indexation: r.indexation, balance: r.balance, rate: r.rate }))
                           : F().yearly(s).map(y => ({ t: 'Year ' + y.year, payment: y.payment + y.extra, interest: y.interest, principal: y.principal + y.extra, indexation: y.indexation, balance: y.balance }));
      const idx = !!v.infl;
      L.extra.innerHTML = '<div class="boxy"><div class="row" style="justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><h3 style="margin:0">Repayment schedule</h3><div class="row" style="gap:6px">' +
        '<button class="btn sm' + (byMonth ? '' : ' pri') + '" data-m="0">By year</button><button class="btn sm' + (byMonth ? ' pri' : '') + '" data-m="1">By month</button>' +
        '<button class="btn sm" data-csv="1">' + H.icon('download', 15) + ' CSV</button></div></div>' +
        '<div class="simtable" style="max-height:360px"><table class="ftable"><thead><tr><th style="text-align:left">' + (byMonth ? 'Month' : 'Year') + '</th><th>Paid</th><th>Interest</th><th>Capital</th>' + (idx ? '<th>Indexation</th>' : '') + '<th>Still owed</th></tr></thead><tbody>' +
        rows.map(r => '<tr><td>' + esc(r.t) + '</td><td class="num">' + M(r.payment) + '</td><td class="num">' + M(r.interest) + '</td><td class="num">' + M(r.principal) + '</td>' + (idx ? '<td class="num">' + M(r.indexation) + '</td>' : '') + '<td class="num">' + M(r.balance) + '</td></tr>').join('') +
        '</tbody></table></div></div>';
      L.extra.querySelectorAll('[data-m]').forEach(b => { b.onclick = () => { byMonth = b.dataset.m === '1'; table(); }; });
      L.extra.querySelector('[data-csv]').onclick = () => csv('repayment-schedule.csv', ['period', 'paid', 'interest', 'capital', 'indexation', 'balance'], rows.map(r => [r.t, r.payment, r.interest, r.principal, r.indexation, r.balance]));
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- two offers */
  function compare(el) {
    const L = layout(el, 'Two offers for the same need. The monthly payment is what you feel; the total cost and the APR (fees included) are what you pay. A lower rate with high fees can cost more than a higher rate with none — especially if you repay early.');
    const plot = plotIn(L.plot, { x: { label: 'years', min: 0 }, y: moneyAxis('still owed'), fmtX: v => U.fmt(v, 3) + ' yr' }, 230);
    const read = form(L.form, [
      ['a', 'Offer A', 0, 'sep'], ['PA', 'Amount', 250000, 'money'], ['rA', 'Rate', 4.5, 'pct'], ['TA', 'Term', 25, 'yr'], ['fA', 'Fees', 3000, 'money'],
      ['mA', 'Repayment', 'annuity', 'select', [['annuity', 'Level payments'], ['linear', 'Equal capital']]],
      ['b', 'Offer B', 0, 'sep'], ['PB', 'Amount', 250000, 'money'], ['rB', 'Rate', 4.9, 'pct'], ['TB', 'Term', 25, 'yr'], ['fB', 'Fees', 0, 'money'],
      ['mB', 'Repayment', 'annuity', 'select', [['annuity', 'Level payments'], ['linear', 'Equal capital']]],
      ['c', 'If you repay early', 0, 'sep'], ['exitY', 'Sell or refinance after', 0, 'n', 'yr (0 = keep to the end)']
    ], v => calc(v));
    function calc(v) {
      const one = (Pr, r, T, fees, m) => {
        const s = F().amortize({ principal: Pr, annual: r, years: T, method: m, fees });
        let rows = s.rows, paid = fees, exitBal = 0;
        if (v.exitY > 0) { rows = s.rows.slice(0, Math.round(v.exitY * 12)); exitBal = rows.length ? rows[rows.length - 1].balance : Pr; }
        rows.forEach(x => { paid += x.payment; });
        const pays = rows.map(x => x.payment); if (exitBal) pays[pays.length - 1] += exitBal;
        const a = F().apr({ principal: Pr, fees, payments: pays });
        return { s, cost: paid + exitBal - Pr, apr: a.apr, first: s.firstPayment };
      };
      const A = one(v.PA, v.rA, v.TA, v.fA, v.mA), B = one(v.PB, v.rB, v.TB, v.fB, v.mB);
      const win = A.cost < B.cost ? 'A' : 'B', diff = Math.abs(A.cost - B.cost);
      L.stats.innerHTML =
        stat('Offer A: monthly', M(A.first), 'APR ' + P(A.apr), win === 'A' ? 'good' : '') + stat('Offer B: monthly', M(B.first), 'APR ' + P(B.apr), win === 'B' ? 'good' : '') +
        stat('A: interest and fees', M(A.cost), v.exitY > 0 ? 'over ' + v.exitY + ' years' : 'over the whole loan') + stat('B: interest and fees', M(B.cost), v.exitY > 0 ? 'over ' + v.exitY + ' years' : 'over the whole loan') +
        stat('Cheaper overall', 'Offer ' + win, 'by ' + M(diff), 'big');
      const pts = s => [[0, s.rows.length ? s.rows[0].balance + s.rows[0].principal : 0]].concat(s.rows.map(r => [r.k / 12, r.balance]));
      plot.set({ series: [{ pts: pts(A.s), label: 'Offer A' }, { pts: pts(B.s), label: 'Offer B', dash: [6, 4] }], vlines: v.exitY > 0 ? [{ x: v.exitY, label: 'repaid early' }] : [] });
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- savings */
  function save(el) {
    const L = layout(el, 'A plan: something now, something every month, left to grow. The graph separates what you put in from what the growth added — after enough years the growth is most of it. Fees and inflation are the two quiet thieves: see what each takes.');
    const plot = plotIn(L.plot, { x: { label: 'years', min: 0 }, y: moneyAxis(''), fmtX: v => U.fmt(v, 3) + ' yr' }, 250);
    const read = form(L.form, [
      ['init', 'Starting amount', 10000, 'money'], ['c', 'Added every month', 500, 'money'], ['raise', 'Raise the monthly amount by', 0, 'pct', '% a year'],
      ['r', 'Return (before fees)', 6, 'pct', '% a year'], ['T', 'For', 25, 'yr'], ['fee', 'Yearly fees', 1, 'pct', '% of the balance'],
      ['infl', 'Inflation', 2.5, 'pct', '% a year'], ['goal', 'Goal (0 = none)', 0, 'money']
    ], v => calc(v));
    function calc(v) {
      const g = F().grow({ initial: v.init, contribution: v.c, raise: v.raise, annual: v.r, years: v.T, fee: v.fee, inflation: v.infl });
      const nf = F().grow({ initial: v.init, contribution: v.c, raise: v.raise, annual: v.r, years: v.T, fee: 0, inflation: v.infl });
      const tg = v.goal > 0 ? F().timeToGoal({ goal: v.goal, initial: v.init, contribution: v.c, annual: v.r - v.fee }) : null;
      L.stats.innerHTML =
        stat('After ' + v.T + ' years', M(g.balance), 'in future money', 'big') +
        stat('In today\'s money', M(g.real), 'after ' + P(v.infl, 1) + ' inflation a year') +
        stat('You put in', M(g.contributed), P(g.contributed / g.balance, 0) + ' of the pot') +
        stat('Growth added', M(g.growth), P(g.growth / g.balance, 0) + ' of the pot', 'good') +
        stat('Fees cost you', M(nf.balance - g.balance), M(g.fees) + ' charged, plus the growth it would have made', v.fee ? 'bad' : '') +
        (tg != null ? stat('Goal reached in', Number.isFinite(tg) ? U.fmt(tg, 3) + ' years' : 'never at this rate', M(v.goal)) : '');
      const step = Math.max(1, Math.round(g.rows.length / 240));
      const pick = f => g.rows.filter((r, k) => k % step === 0 || k === g.rows.length - 1).map(r => [r.t, f(r)]);
      plot.set({ series: [{ pts: pick(r => r.balance), label: 'balance', width: 2.5, fill: true }, { pts: pick(r => r.contributed), label: 'paid in' },
        { pts: pick(r => r.real), label: 'in today\'s money', dash: [6, 4] }], hlines: v.goal > 0 ? [{ y: v.goal, label: 'goal' }] : [] });
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- financial independence */
  function retire(el) {
    const L = layout(el, 'Financial independence is a pot large enough that a modest yearly withdrawal pays your costs indefinitely. The “4 % rule” comes from history: 25 times your yearly spending, withdrawn at 4 % and raised with inflation, lasted 30 years in almost every past period. The fan below starts a retirement from your target and runs it through 1 000 random markets — they do not deliver the average every year, and the order of good and bad years matters. Everything is in today\'s money, so the return is the return above inflation.');
    const plot = plotIn(L.plot, { x: { label: 'years into retirement', min: 0 }, y: moneyAxis(''), fmtX: v => U.fmt(v, 3) + ' yr' }, 260);
    const read = form(L.form, [
      ['spend', 'Yearly spending you want to cover', 40000, 'money'], ['wr', 'Withdrawal rate', 4, 'pct'],
      ['have', 'Invested today', 100000, 'money'], ['save', 'Invested every month', 1500, 'money'],
      ['real', 'Expected return above inflation', 5, 'pct', '% a year'], ['sd', 'Ups and downs (volatility)', 12, 'pct', '% a year'],
      ['years', 'The money must last', 30, 'yr']
    ], v => calc(v));
    function calc(v) {
      const target = v.spend / v.wr;
      const tY = F().timeToGoal({ goal: target, initial: v.have, contribution: v.save, annual: v.real });
      // retirement, in today's money: start with the target and spend `spend` a year, with random yearly returns
      const mc = F().monteCarlo({ initial: target, withdrawal: v.spend, years: v.years, mean: v.real, sd: v.sd, runs: 1000, seed: 11, percentiles: [10, 50, 90] });
      const pc = q => mc.years.map(y => [y.year, y.p[q]]);
      L.stats.innerHTML =
        stat('Your independence number', M(target), 'spending ÷ withdrawal rate = ' + U.fmt(1 / v.wr, 3) + ' × spending', 'big') +
        stat('Reached in', Number.isFinite(tY) ? U.fmt(tY, 3) + ' years' : 'not at this saving rate', 'at the expected return, in today\'s money') +
        stat('Retirements that last ' + v.years + ' years', P(mc.success, 0), 'of 1 000 random markets, starting from the target', mc.success >= 0.9 ? 'good' : mc.success < 0.75 ? 'bad' : '') +
        stat('Spending in the first year', M(target * v.wr), 'then kept up with inflation');
      plot.set({ x: { label: 'years into retirement', min: 0, max: v.years },
        series: [{ pts: pc(90), label: 'lucky (90th percentile)', dash: [4, 4] }, { pts: pc(50), label: 'typical (median)', width: 2.5 }, { pts: pc(10), label: 'unlucky (10th percentile)', dash: [4, 4] }],
        hlines: [{ y: target, label: 'starting pot' }] });
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- returns */
  function returns(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Three ways to say how well an investment did. CAGR smooths a start and an end value into one yearly rate. IRR does the same when money went in and came out at different times — it is the rate that makes all the flows balance. And an average of yearly returns is not what you earned: a +50 % year followed by a −50 % year averages 0 % but loses a quarter.</p>' +
      '<div class="cols2" style="margin-top:0;align-items:start"><div class="boxy"><h3>CAGR</h3><div class="mc1"></div><div class="mstats ro1"></div></div>' +
      '<div class="boxy"><h3>IRR of cash flows</h3><p class="small muted">One flow per line: <code>year amount</code>, money in negative, money out positive. Years may be fractions.</p>' +
      '<textarea class="inp irrflows" rows="7" style="width:100%;font-family:var(--font-mono);height:auto">0 -10000\n1 -2000\n2 -2000\n3 1500\n5 18000</textarea><div class="mstats ro2"></div></div>' +
      '<div class="boxy"><h3>Average against compound</h3><p class="small muted">Yearly returns in %, separated by spaces or commas.</p><input class="inp avgr" style="width:100%" value="50, -50, 20, -10, 30"><div class="mstats ro3"></div></div></div>';
    const r1 = ui.$('.ro1', el), r2 = ui.$('.ro2', el), r3 = ui.$('.ro3', el);
    const read = form(ui.$('.mc1', el), [['a', 'Start value', 10000, 'money'], ['b', 'End value', 25000, 'money'], ['n', 'Years', 8, 'yr']], v => one(v));
    function one(v) { const g = F().cagr(v.a, v.b, v.n); r1.innerHTML = stat('CAGR', P(g), 'a year, compounded', 'big') + stat('Total growth', P(v.b / v.a - 1, 0), '×' + U.fmt(v.b / v.a, 3)); }
    const flows = () => {
      const lines = ui.$('.irrflows', el).value.split(/\n/).map(s => s.trim()).filter(Boolean).map(s => s.split(/[\s,;]+/).map(x => +U.cleanNum(x)));
      const good = lines.filter(l => l.length >= 2 && l.every(Number.isFinite));
      if (good.length < 2) { r2.innerHTML = '<p class="muted small">Two flows or more.</p>'; return; }
      const irr = F().irr(good.map(l => l[1]), good.map(l => l[0]));
      const put = -good.filter(l => l[1] < 0).reduce((s, l) => s + l[1], 0), got = good.filter(l => l[1] > 0).reduce((s, l) => s + l[1], 0);
      r2.innerHTML = stat('IRR', Number.isFinite(irr) ? P(irr) : 'none', 'a year', 'big') + stat('Money in / out', M(put) + ' / ' + M(got), 'profit ' + M(got - put));
    };
    const avg = () => {
      const rs = ui.$('.avgr', el).value.split(/[\s,;]+/).map(x => parseFloat(x)).filter(Number.isFinite).map(x => x / 100);
      if (!rs.length) { r3.innerHTML = ''; return; }
      const mean = rs.reduce((s, x) => s + x, 0) / rs.length, grow = rs.reduce((s, x) => s * (1 + x), 1), g = Math.pow(grow, 1 / rs.length) - 1;
      r3.innerHTML = stat('Average of the returns', P(mean), 'what the numbers suggest') + stat('Compound (actual) return', P(g), '¤100 became ' + M(100 * grow), g < mean - 1e-9 ? 'bad' : 'big');
      r3.innerHTML = r3.innerHTML.replace('¤', esc(H.units.currency));
    };
    ui.$('.irrflows', el).addEventListener('input', flows);
    ui.$('.avgr', el).addEventListener('input', avg);
    one(read()); flows(); avg();
  }

  /* ---------------------------------------------------------------- inflation */
  function inflation(el) {
    const L = layout(el, 'Inflation is a slow, steady fall in what money buys. At 3 % a year prices double in about 24 years, so cash under the mattress loses half its value within a working life — and a savings rate below inflation is a loss, however it looks on the statement.');
    const plot = plotIn(L.plot, { x: { label: 'years from now', min: 0 }, y: moneyAxis(''), fmtX: v => U.fmt(v, 3) + ' yr' }, 230);
    const read = form(L.form, [['amt', 'An amount today', 1000, 'money'], ['i', 'Inflation', 3, 'pct', '% a year'], ['T', 'Over', 20, 'yr'], ['dep', 'Interest earned on it', 1, 'pct', '% a year']], v => calc(v));
    function calc(v) {
      const price = v.amt * Math.pow(1 + v.i, v.T), power = v.amt / Math.pow(1 + v.i, v.T), saved = v.amt * Math.pow(1 + v.dep, v.T), realSaved = saved / Math.pow(1 + v.i, v.T);
      L.stats.innerHTML = stat('The same things will cost', M(price), 'in ' + v.T + ' years', 'big') +
        stat('Today\'s money will buy', M(power), 'worth of today\'s things (' + P(power / v.amt - 1, 0) + ')', 'bad') +
        stat('Prices double in', U.fmt(F().doublingTime(v.i), 3) + ' years', 'rule of 72: ' + U.fmt(72 / (v.i * 100), 3)) +
        stat('Kept at ' + P(v.dep, 1), M(saved) + ' → ' + M(realSaved), 'nominal → in today\'s money; real rate ' + P(F().real(v.dep, v.i)), realSaved < v.amt ? 'bad' : 'good');
      const pts = f => Array.from({ length: 61 }, (_, k) => { const t = v.T * k / 60; return [t, f(t)]; });
      plot.set({ series: [{ pts: pts(t => v.amt * Math.pow(1 + v.i, t)), label: 'price of the same basket' }, { pts: pts(t => v.amt / Math.pow(1 + v.i, t)), label: 'what the cash buys', width: 2.5 },
        { pts: pts(t => v.amt * Math.pow(1 + v.dep, t) / Math.pow(1 + v.i, t)), label: 'saved, in today\'s money', dash: [6, 4] }] });
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- credit card */
  function card(el) {
    const L = layout(el, 'Card statements offer a minimum payment: a small percentage of the balance. Paying only that keeps you in debt for years, because as the balance falls so does the payment. A fixed amount a month — even a modest one — clears it far sooner.');
    const plot = plotIn(L.plot, { x: { label: 'years', min: 0 }, y: moneyAxis('balance'), fmtX: v => U.fmt(v, 3) + ' yr' }, 230);
    const read = form(L.form, [['bal', 'Balance', 5000, 'money'], ['apr', 'Card interest (APR)', 22, 'pct'], ['minPct', 'Minimum payment', 2.5, 'pct', '% of the balance'], ['minFloor', '… but at least', 25, 'money'], ['fixed', 'Or pay a fixed', 200, 'money']], v => calc(v));
    function calc(v) {
      const path = (fixed) => {
        let b = v.bal, m = 0, it = 0;
        const pts = [[0, b]];
        while (b > 0.005 && m < 1200) {
          const i = b * v.apr / 12;
          const pay = Math.min(b + i, fixed ? v.fixed : Math.max(v.minFloor, b * v.minPct));
          if (pay <= i) return { months: Infinity, interest: Infinity, pts };
          b += i - pay; it += i; m++;
          pts.push([m / 12, b]);
        }
        return { months: m, interest: it, pts };
      };
      const mn = path(false), fx = path(true);
      const ym = x => Number.isFinite(x) ? (x >= 24 ? U.fmt(x / 12, 3) + ' years' : x + ' months') : 'never';
      L.stats.innerHTML = stat('Minimum payments: debt-free in', ym(mn.months), 'interest ' + (Number.isFinite(mn.interest) ? M(mn.interest) : '—'), 'bad') +
        stat('Paying ' + M(v.fixed) + ' a month', ym(fx.months), 'interest ' + (Number.isFinite(fx.interest) ? M(fx.interest) : '—'), 'good') +
        stat('The difference', Number.isFinite(mn.interest) && Number.isFinite(fx.interest) ? M(mn.interest - fx.interest) : '—', 'kept in your pocket', 'big');
      plot.set({ series: [{ pts: mn.pts, label: 'minimum payments' }, { pts: fx.pts, label: 'fixed payment', width: 2.5 }] });
    }
    calc(read());
  }

  /* ---------------------------------------------------------------- the tab */
  H.moneyTools = function (el, params, sub) {
    const tab = TABS.some(t => t[0] === sub) ? sub : 'loan';
    const cur = H.units.currency;
    el.innerHTML = '<div class="row mhead" style="justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:12px"><nav class="subtabs">' +
      TABS.map(([k, t]) => '<a href="#/tools/money/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav>' +
      '<label class="small muted row" style="gap:6px;align-items:center">Currency <select class="inp mcur">' + H.units.CURRENCIES.map(([s, n]) => '<option value="' + esc(s) + '"' + (s === cur ? ' selected' : '') + '>' + esc(s + ' ' + n) + '</option>').join('') + '</select></label></div>' +
      '<div class="mbody"></div><p class="small faint mt">For learning and planning, not personal financial advice: real loans, taxes and products have terms these calculators do not know about.</p>';
    ui.$('.mcur', el).onchange = e => { H.settings.set('currency', e.target.value); location.reload(); };
    ({ loan, compare, save, retire, returns, inflation, card })[tab](ui.$('.mbody', el));
  };
})();
