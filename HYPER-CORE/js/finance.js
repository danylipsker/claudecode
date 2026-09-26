/* HYPER-CORE · finance.js
 *
 * The arithmetic of money, for simulations (kit.fin), the money calculators and tests.
 * Nothing here uses the DOM. Rates are fractions (0.05 = 5 %); `i` is a rate per period,
 * `annual` a nominal annual rate; amounts are plain numbers in the reader's currency.
 *
 *   F.payment(300000, 0.05 / 12, 360)             -> 1610.46   (a level "annuity" payment; also called French or Spitzer)
 *   F.amortize({ principal: 300000, annual: 0.05, years: 30, method: 'annuity' | 'linear' | 'interest-only',
 *                extra: 100, lumps: [{ k: 60, amount: 20000 }], prepay: 'shorten' | 'reduce',
 *                rates: [[1, 0.05], [61, 0.065]], inflation: 0.02, balloon: 0 })   (inflation: an index-linked loan)
 *      -> { rows: [{ k, year, rate, payment, interest, principal, extra, indexation, balance }], totals: {...}, periods }
 *   F.grow({ initial, contribution, annual, years, perYear: 12, fee, inflation, raise })   // a savings plan
 *   F.npv(rate, flows, times?)  F.irr(flows, times?)  F.apr({ principal, fees, payments | payment + n, perYear })
 *   F.bond({ face, coupon, ytm, years, freq })  F.bondYield({ price, face, coupon, years, freq })
 *   F.blackScholes({ S, K, r, sigma, T, type })  F.monteCarlo({...})  F.drawdown({...})
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  /* ---------------------------------------------------------------- time value of money */
  const pow = (x, n) => Math.pow(x, n);
  // the level payment that repays `principal` in n periods at rate i, leaving `balloon` at the end
  function payment(principal, i, n, balloon) {
    balloon = balloon || 0;
    if (n <= 0) return principal;
    if (Math.abs(i) < 1e-12) return (principal - balloon) / n;
    return (principal - balloon * pow(1 + i, -n)) * i / (1 - pow(1 + i, -n));
  }
  const fv = (pv, i, n) => pv * pow(1 + i, n);
  const pv = (future, i, n) => future * pow(1 + i, -n);
  // value of n equal payments: at the end of the periods (ordinary) or at the start (due)
  const fvAnnuity = (pmt, i, n, due) => (Math.abs(i) < 1e-12 ? pmt * n : pmt * (pow(1 + i, n) - 1) / i) * (due ? 1 + i : 1);
  const pvAnnuity = (pmt, i, n, due) => (Math.abs(i) < 1e-12 ? pmt * n : pmt * (1 - pow(1 + i, -n)) / i) * (due ? 1 + i : 1);
  // how many payments repay a loan (Infinity when the payment does not even cover the interest)
  function nper(principal, i, pmt) {
    if (Math.abs(i) < 1e-12) return principal / pmt;
    if (pmt <= principal * i) return Infinity;
    return -Math.log(1 - principal * i / pmt) / Math.log(1 + i);
  }
  // the periodic rate that makes `pmt` repay `principal` in n periods
  function rateOf(principal, n, pmt) {
    if (pmt * n <= principal) return pmt * n === principal ? 0 : NaN;
    let lo = 0, hi = 1;
    while (payment(principal, hi, n) < pmt && hi < 1e6) hi *= 2;
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (payment(principal, m, n) < pmt) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const effective = (annual, m) => m === Infinity ? Math.exp(annual) - 1 : pow(1 + annual / m, m) - 1;
  const nominal = (eff, m) => m === Infinity ? Math.log(1 + eff) : m * (pow(1 + eff, 1 / m) - 1);
  const real = (nominalRate, inflation) => (1 + nominalRate) / (1 + inflation) - 1;       // Fisher
  const cagr = (start, end, years) => pow(end / start, 1 / years) - 1;
  const doublingTime = r => Math.log(2) / Math.log(1 + r);

  /* ---------------------------------------------------------------- cash flows */
  // flows[k] at time times[k] (periods; default 0, 1, 2 …)
  function npv(rate, flows, times) {
    let s = 0;
    for (let k = 0; k < flows.length; k++) s += flows[k] / pow(1 + rate, times ? times[k] : k);
    return s;
  }
  // the rate at which npv = 0; searched over (-99.99 %, 1000 %) for a sign change, then bisected
  function irr(flows, times) {
    const f = r => npv(r, flows, times);
    const grid = [-0.9999, -0.99, -0.9, -0.75, -0.5, -0.3, -0.2, -0.1, -0.05, 0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.3, 0.5, 0.75, 1, 2, 5, 10];
    let lo = null, hi = null;
    // prefer the root nearest to zero (the one that makes economic sense for ordinary flows)
    const pairs = [];
    for (let k = 0; k + 1 < grid.length; k++) if (Math.sign(f(grid[k])) !== Math.sign(f(grid[k + 1]))) pairs.push([grid[k], grid[k + 1]]);
    if (!pairs.length) return NaN;
    pairs.sort((a, b) => Math.min(Math.abs(a[0]), Math.abs(a[1])) - Math.min(Math.abs(b[0]), Math.abs(b[1])));
    [lo, hi] = pairs[0];
    let flo = f(lo);
    for (let k = 0; k < 200; k++) {
      const m = (lo + hi) / 2, fm = f(m);
      if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m;
    }
    return (lo + hi) / 2;
  }
  // every rate at which npv = 0 (flows that change sign more than once can have several)
  function irrAll(flows, times) {
    const f = r => npv(r, flows, times), out = [];
    let a = -0.99, fa = f(a);
    for (let k = 1; k <= 2000; k++) {
      const b = -0.99 + k * (10.99 / 2000), fb = f(b);
      if (fa === 0) out.push(a);
      else if (Math.sign(fa) !== Math.sign(fb)) {
        let lo = a, hi = b, flo = fa;
        for (let j = 0; j < 100; j++) { const m = (lo + hi) / 2, fm = f(m); if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m; }
        out.push((lo + hi) / 2);
      }
      a = b; fa = fb;
    }
    return out;
  }
  // the true yearly cost of a loan with fees: the rate that equates what you receive with what you pay
  function apr(o) {
    const perYear = o.perYear || 12;
    const pays = o.payments || Array.from({ length: o.n }, () => o.payment);
    const flows = [o.principal - (o.fees || 0)].concat(pays.map(p => -p));
    const i = irr(flows);
    return { periodic: i, apr: i * perYear, effective: pow(1 + i, perYear) - 1 };
  }

  /* ---------------------------------------------------------------- loans */
  // rates: a number, a function of the period k (1-based), or [[fromPeriod, annual], ...]
  function rateAt(o, k) {
    if (typeof o.rates === 'function') return o.rates(k);
    if (Array.isArray(o.rates)) { let r = o.rates[0][1]; for (const [from, v] of o.rates) if (k >= from) r = v; return r; }
    return o.annual;
  }
  function amortize(o) {
    const perYear = o.perYear || 12;
    const N = Math.round(o.periods || (o.years || 0) * perYear);
    const method = o.method || 'annuity';
    const prepay = o.prepay || 'shorten';
    const monthlyIndex = o.inflation ? pow(1 + o.inflation, 1 / perYear) - 1 : 0;
    const lumps = {};
    for (const l of (o.lumps || [])) lumps[l.k] = (lumps[l.k] || 0) + l.amount;
    let bal = o.principal, balloon = o.balloon || 0;
    const rows = [];
    let pay = null, lastRate = null, principalPart0 = (o.principal - balloon) / Math.max(1, N);
    const tot = { interest: 0, principal: 0, extra: 0, indexation: 0, paid: 0, fees: o.fees || 0 };
    for (let k = 1; k <= N && bal > 1e-7; k++) {
      const annual = rateAt(o, k), i = annual / perYear, left = N - k + 1;
      // an index-linked loan: the balance (and the balloon) grow with prices before each payment
      let indexation = 0;
      if (monthlyIndex) { indexation = bal * monthlyIndex; bal += indexation; balloon *= 1 + monthlyIndex; }
      const interest = bal * i;
      let principal;
      if (method === 'linear') {
        // equal repayment of capital (re-spread over the remaining periods, so indexation and prepayments are handled)
        principal = (bal - balloon) / left;
        pay = principal + interest;
      } else if (method === 'interest-only') {
        principal = k === N ? bal : 0;
        pay = interest + principal;
      } else {
        if (pay == null || annual !== lastRate || monthlyIndex || (prepay === 'reduce' && rows.length && rows[rows.length - 1].extra > 0)) pay = payment(bal, i, left, balloon);
        principal = Math.min(pay - interest, bal);
        if (k === N) principal = bal;       // the last payment clears what is left (the balloon too)
      }
      lastRate = annual;
      let extra = (o.extra || 0) + (lumps[k] || 0);
      extra = Math.max(0, Math.min(extra, bal - principal));
      bal -= principal + extra;
      if (Math.abs(bal) < 1e-7) bal = 0;
      const row = { k, year: Math.ceil(k / perYear), rate: annual, payment: interest + principal, interest, principal, extra, indexation, balance: bal };
      rows.push(row);
      tot.interest += interest; tot.principal += principal; tot.extra += extra; tot.indexation += indexation; tot.paid += row.payment + extra;
    }
    void principalPart0;
    tot.paid += tot.fees;
    tot.cost = tot.paid - o.principal;                 // everything paid beyond the amount borrowed
    const first = rows[0] || { payment: 0 };
    return { rows, totals: tot, periods: rows.length, perYear, firstPayment: first.payment, maxPayment: Math.max(0, ...rows.map(r => r.payment)), years: rows.length / perYear };
  }
  // the payments summed per year, for tables and charts
  function yearly(schedule) {
    const out = [];
    for (const r of schedule.rows) {
      let y = out[r.year - 1];
      if (!y) y = out[r.year - 1] = { year: r.year, payment: 0, interest: 0, principal: 0, extra: 0, indexation: 0, balance: 0 };
      y.payment += r.payment; y.interest += r.interest; y.principal += r.principal; y.extra += r.extra; y.indexation += r.indexation; y.balance = r.balance;
    }
    return out.filter(Boolean);
  }
  // the largest loan a payment can carry
  const affordable = (pmt, i, n) => pvAnnuity(pmt, i, n);
  // a credit card paid at the minimum: months to clear and interest paid
  function minimumPayoff(o) {
    let bal = o.balance, months = 0, interest = 0;
    const i = o.apr / 12;
    while (bal > 0.005 && months < 1200) {
      const it = bal * i;
      const pay = Math.min(bal + it, Math.max(o.minFloor || 0, bal * (o.minPct != null ? o.minPct : 0.02) + (o.plusInterest ? it : 0), o.fixed || 0));
      if (pay <= it && months > 0 && !o.fixed) return { months: Infinity, interest: Infinity };
      bal += it - pay; interest += it; months++;
    }
    return { months, interest };
  }

  /* ---------------------------------------------------------------- saving and spending */
  // a savings plan, period by period: contributions at the end of each period, a yearly fee
  // on the balance, contributions raised each year; `real` is in today's money
  function grow(o) {
    const perYear = o.perYear || 12, N = Math.round((o.years || 0) * perYear);
    const i = (o.annual || 0) / perYear, fee = (o.fee || 0) / perYear, infl = pow(1 + (o.inflation || 0), 1 / perYear);
    let bal = o.initial || 0, contributed = o.initial || 0, c = o.contribution || 0, fees = 0, deflator = 1;
    const rows = [{ k: 0, t: 0, balance: bal, contributed, fees: 0, real: bal }];
    for (let k = 1; k <= N; k++) {
      bal *= 1 + i;
      const f = bal * fee; bal -= f; fees += f;
      bal += c; contributed += c;
      deflator *= infl;
      rows.push({ k, t: k / perYear, balance: bal, contributed, fees, real: bal / deflator });
      if (k % perYear === 0 && o.raise) c *= 1 + o.raise;
    }
    const last = rows[rows.length - 1];
    return { rows, balance: last.balance, contributed: last.contributed, growth: last.balance - last.contributed, fees: last.fees, real: last.real };
  }
  // years until a goal is reached by saving `contribution` a period (Infinity if never)
  function timeToGoal(o) {
    const perYear = o.perYear || 12, i = (o.annual || 0) / perYear;
    let bal = o.initial || 0;
    for (let k = 0; k <= 200 * perYear; k++) {                // give up after two centuries
      if (bal >= o.goal) return k / perYear;
      bal = bal * (1 + i) + (o.contribution || 0);
    }
    return Infinity;
  }
  // spending a pot: a yearly withdrawal that keeps pace with inflation
  function drawdown(o) {
    let bal = o.balance, w = o.withdrawal;
    const rows = [{ year: 0, balance: bal, withdrawn: 0 }];
    for (let y = 1; y <= (o.years || 60); y++) {
      const take = Math.min(w, bal);
      bal = (bal - take) * (1 + (o.annual || 0));
      rows.push({ year: y, balance: bal, withdrawn: take });
      if (bal <= 0) return { rows, lasts: y - 1 + take / w, depleted: true };
      w *= 1 + (o.inflation || 0);
    }
    return { rows, lasts: Infinity, depleted: false };
  }

  /* ---------------------------------------------------------------- randomness */
  function normals(seed) {
    const u = H.util && H.util.rng ? H.util.rng(seed >>> 0) : Math.random;
    let spare = null;
    return () => {
      if (spare != null) { const s = spare; spare = null; return s; }
      let a = 0, b = 0;
      while (a <= 1e-12) a = u();
      b = u();
      const r = Math.sqrt(-2 * Math.log(a));
      spare = r * Math.sin(2 * Math.PI * b);
      return r * Math.cos(2 * Math.PI * b);
    };
  }
  // many possible futures of a portfolio with random yearly returns (normal, mean and sd)
  // -> { years: [{ year, p: { 10: …, 50: …, 90: … } }], success (fraction never depleted), finals }
  function monteCarlo(o) {
    const runs = o.runs || 1000, years = o.years || 30, g = normals(o.seed || 1);
    const pcts = o.percentiles || [10, 25, 50, 75, 90];
    const paths = [];
    let ok = 0;
    for (let r = 0; r < runs; r++) {
      let bal = o.initial || 0, w = o.withdrawal || 0, c = o.contribution || 0, alive = true;
      const path = [bal];
      for (let y = 1; y <= years; y++) {
        const ret = Math.max(-0.99, (o.mean || 0) + (o.sd || 0) * g());
        bal = bal * (1 + ret) + c - w;
        if (bal <= 0) { bal = 0; alive = false; }
        path.push(bal);
        w *= 1 + (o.inflation || 0); c *= 1 + (o.raise || 0);
      }
      if (alive) ok++;
      paths.push(path);
    }
    const out = [];
    for (let y = 0; y <= years; y++) {
      const col = paths.map(p => p[y]).sort((a, b) => a - b);
      const p = {};
      for (const q of pcts) p[q] = col[Math.min(col.length - 1, Math.floor(q / 100 * col.length))];
      out.push({ year: y, p });
    }
    return { years: out, success: ok / runs, finals: paths.map(p => p[years]) };
  }

  /* ---------------------------------------------------------------- bonds */
  // price of a bond per `face`, coupons `freq` times a year, `years` to maturity
  function bond(o) {
    const f = o.freq || 1, n = Math.round(o.years * f), c = o.face * o.coupon / f, y = o.ytm / f;
    let price = 0, dur = 0, conv = 0;
    for (let k = 1; k <= n; k++) {
      const cf = c + (k === n ? o.face : 0), d = pow(1 + y, -k);
      price += cf * d; dur += (k / f) * cf * d; conv += cf * d * k * (k + 1) / (f * f);
    }
    const macaulay = dur / price;
    return { price, macaulay, modified: macaulay / (1 + y), convexity: conv / (price * pow(1 + y, 2)), currentYield: o.face * o.coupon / price };
  }
  function bondYield(o) {
    let lo = -0.5, hi = 2;
    for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (bond(Object.assign({}, o, { ytm: m })).price > o.price) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  /* ---------------------------------------------------------------- options */
  // the standard normal distribution function (Zelen and Severo; |error| < 7.5e-8)
  function ncdf(x) {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp(-x * x / 2);
    const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x > 0 ? 1 - p : p;
  }
  function blackScholes(o) {
    const { S, K, r, sigma, T } = o;
    if (T <= 0 || sigma <= 0) { const intrinsic = o.type === 'put' ? Math.max(K - S, 0) : Math.max(S - K, 0); return { price: intrinsic, delta: o.type === 'put' ? (S < K ? -1 : 0) : (S > K ? 1 : 0) }; }
    const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * T) / (sigma * Math.sqrt(T)), d2 = d1 - sigma * Math.sqrt(T);
    if (o.type === 'put') return { price: K * Math.exp(-r * T) * ncdf(-d2) - S * ncdf(-d1), delta: ncdf(d1) - 1, d1, d2 };
    return { price: S * ncdf(d1) - K * Math.exp(-r * T) * ncdf(d2), delta: ncdf(d1), d1, d2 };
  }
  // what an option position is worth at expiry, per share
  const payoff = (type, S, K, premium, short) => (short ? -1 : 1) * ((type === 'put' ? Math.max(K - S, 0) : Math.max(S - K, 0)) - premium);

  /* ---------------------------------------------------------------- portfolios, leverage */
  // two assets: weights w and 1 − w, returns mu, risks s, correlation rho
  function mix2(o) {
    const w = o.w, v = 1 - w;
    const mu = w * o.mu1 + v * o.mu2;
    const sd = Math.sqrt(w * w * o.s1 * o.s1 + v * v * o.s2 * o.s2 + 2 * w * v * o.rho * o.s1 * o.s2);
    return { mu, sd };
  }
  const sharpe = (mu, sd, rf) => (mu - (rf || 0)) / sd;
  // return on your own money when a fraction is borrowed: leverage L = assets / equity
  const leveraged = (assetReturn, L, borrowRate) => L * assetReturn - (L - 1) * (borrowRate || 0);
  // the price at which a margin call comes, for shares bought at p0 with an initial margin m0
  // (your share of the purchase) and a maintenance margin mm
  const marginCallPrice = (p0, m0, mm) => (1 - m0) * p0 / (1 - mm);
  // a daily-rebalanced leveraged fund over returns r[]: the "volatility drag"
  function leveragedPath(returns, L) {
    let v = 1, u = 1;
    const out = [[0, 1, 1]];
    returns.forEach((r, k) => { u *= 1 + r; v *= Math.max(0, 1 + L * r); out.push([k + 1, u, v]); });
    return out;
  }

  H.finance = {
    payment, fv, pv, fvAnnuity, pvAnnuity, nper, rateOf, effective, nominal, real, cagr, doublingTime,
    npv, irr, irrAll, apr, amortize, yearly, affordable, minimumPayoff,
    grow, timeToGoal, drawdown, normals, monteCarlo,
    uniforms: seed => (H.util && H.util.rng ? H.util.rng(seed >>> 0) : Math.random),   // reproducible numbers in [0, 1)
    bond, bondYield, ncdf, blackScholes, payoff,
    mix2, sharpe, leveraged, marginCallPrice, leveragedPath
  };
})(typeof window !== 'undefined' ? window : globalThis);
