/* Tests of the finance module and of money in the engine (units, formatting, formulas).
 *   node HYPER-CORE/tools/test-finance.js
 */
'use strict';
const path = require('path');
const { makeContext, loadCore, run } = require('./load');
const ctx = makeContext();
const H = loadCore(ctx);
// (finance.js is part of the core)
const F = H.finance;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

// time value of money
near(F.payment(300000, 0.05 / 12, 360), 1610.46, 0.005, 'mortgage payment');
near(F.payment(12000, 0, 12), 1000, 1e-9, 'zero-rate payment');
near(F.nper(300000, 0.05 / 12, 1610.4649), 360, 0.01, 'number of payments');
ok(F.nper(100000, 0.01, 500) === Infinity, 'payment below the interest never repays');
near(F.rateOf(300000, 360, 1610.4649) * 12, 0.05, 1e-7, 'rate from a payment');
near(F.effective(0.12, 12), 0.126825, 1e-6, 'effective annual rate, monthly compounding');
near(F.effective(0.05, Infinity), Math.exp(0.05) - 1, 1e-12, 'continuous compounding');
near(F.nominal(F.effective(0.06, 4), 4), 0.06, 1e-12, 'nominal from effective');
near(F.real(0.07, 0.03), 0.038835, 1e-6, 'Fisher real rate');
near(F.fvAnnuity(100, 0.07 / 12, 360), 121997.10, 0.01, 'saving 100 a month for 30 years at 7 %');
near(F.pvAnnuity(1000, 0.04, 25), 15622.08, 0.01, 'present value of an annuity');
near(F.cagr(1000, 2000, 10), 0.071773, 1e-6, 'CAGR of a doubling in ten years');
near(F.doublingTime(0.08), 9.006, 0.001, 'doubling time at 8 %');

// cash flows
near(F.npv(0.1, [-1000, 300, 400, 500]), -21.04, 0.005, 'NPV');
near(F.irr([-100, 110]), 0.10, 1e-9, 'IRR of one period');
near(F.npv(F.irr([-1000, 300, 400, 500]), [-1000, 300, 400, 500]), 0, 1e-6, 'NPV at the IRR is zero');
near(F.irr([-1000, 0, 0, 1331]), 0.10, 1e-9, 'IRR with gaps');
const two = F.irrAll([-10000, 23000, -13200]);
ok(two.length === 2 && Math.abs(two[0] - 0.1) < 1e-6 && Math.abs(two[1] - 0.2) < 1e-6, 'two IRRs when the flows change sign twice (' + two + ')');
near(F.irr([-100, 60, 60], [0, 0.5, 1]), F.irr([-100, 60, 60], [0, 0.5, 1]), 0, 'IRR with times');
const a = F.apr({ principal: 10000, fees: 0, payment: F.payment(10000, 0.10 / 12, 24), n: 24 });
near(a.apr, 0.10, 1e-7, 'APR without fees equals the nominal rate');
const af = F.apr({ principal: 10000, fees: 300, payment: F.payment(10000, 0.10 / 12, 24), n: 24 });
ok(af.apr > 0.12 && af.apr < 0.135, 'a 3 % fee on a two-year loan adds about 3 points to the APR (' + af.apr + ')');

// amortization
const ann = F.amortize({ principal: 300000, annual: 0.05, years: 30 });
ok(ann.periods === 360, 'annuity: 360 payments');
near(ann.firstPayment, 1610.46, 0.005, 'annuity: first payment');
near(ann.rows[359].balance, 0, 1e-6, 'annuity: paid off');
near(ann.totals.interest, 1610.4649 * 360 - 300000, 0.1, 'annuity: total interest');
near(ann.rows[0].interest, 1250, 1e-9, 'annuity: first month interest');
const lin = F.amortize({ principal: 120000, annual: 0.06, years: 10, method: 'linear' });
near(lin.firstPayment, 1600, 1e-9, 'linear: first payment is capital + interest');
near(lin.totals.interest, 36300, 1e-6, 'linear: total interest');
near(lin.rows[119].payment, 1005, 1e-9, 'linear: last payment');
const ext = F.amortize({ principal: 300000, annual: 0.05, years: 30, extra: 200 });
ok(ext.periods < 300 && ext.totals.interest < ann.totals.interest - 50000, 'extra 200 a month shortens the loan by years (' + ext.periods + ')');
const red = F.amortize({ principal: 300000, annual: 0.05, years: 30, lumps: [{ k: 12, amount: 50000 }], prepay: 'reduce' });
ok(red.periods === 360 && red.rows[12].payment < 1400, 'a lump sum with "reduce" keeps the term and lowers the payment');
const shorten = F.amortize({ principal: 300000, annual: 0.05, years: 30, lumps: [{ k: 12, amount: 50000 }] });
ok(shorten.periods < 300 && Math.abs(shorten.rows[12].payment - 1610.46) < 0.01, 'a lump sum with "shorten" keeps the payment and ends earlier');
const idx0 = F.amortize({ principal: 100000, annual: 0.03, years: 20, inflation: 0 });
const idx = F.amortize({ principal: 100000, annual: 0.03, years: 20, inflation: 0.02 });
ok(idx.rows[239].payment > idx0.rows[239].payment * 1.45 && idx.totals.indexation > 20000, 'index-linked: payments and balance grow with prices');
near(idx.rows[239].balance, 0, 1e-6, 'index-linked: still paid off');
near(idx.firstPayment, F.payment(100000 * Math.pow(1.02, 1 / 12), 0.03 / 12, 240), 1e-6, 'index-linked: the first payment is on the indexed balance');
const vr = F.amortize({ principal: 200000, annual: 0.04, years: 25, rates: [[1, 0.04], [61, 0.07]] });
ok(vr.rows[60].payment > vr.rows[59].payment + 250, 'a rate rise after five years raises the payment');
const io = F.amortize({ principal: 100000, annual: 0.06, years: 5, method: 'interest-only' });
near(io.rows[0].payment, 500, 1e-9, 'interest-only payment'); near(io.rows[59].payment, 100500, 1e-9, 'interest-only: the capital at the end');
const bl = F.amortize({ principal: 100000, annual: 0.06, years: 5, balloon: 40000 });
near(bl.rows[59].balance, 0, 1e-6, 'balloon loan cleared at the end'); ok(bl.rows[59].payment > 40000, 'balloon paid in the last payment');
ok(F.yearly(ann).length === 30 && Math.abs(F.yearly(ann)[0].payment - 12 * 1610.4649) < 0.01, 'yearly summary');

// saving and spending
const g = F.grow({ contribution: 100, annual: 0.07, years: 30 });
near(g.balance, 121997.10, 0.01, 'savings plan matches the annuity formula');
near(g.contributed, 36000, 1e-9, 'contributions counted');
const gf = F.grow({ contribution: 100, annual: 0.07, years: 30, fee: 0.01 });
ok(gf.balance < g.balance * 0.87 && gf.fees > 10000, 'a 1 % yearly fee costs over 13 % of the pot in 30 years (' + gf.balance + ')');
const gr = F.grow({ initial: 1000, annual: 0.03, years: 10, inflation: 0.03, perYear: 1 });
near(gr.real, 1000, 1e-6, 'growth equal to inflation keeps real value');
// (1 + i)^n = 1 + goal·i / c  ->  n = 330.4 months
near(F.timeToGoal({ goal: 1000000, contribution: 1000, annual: 0.07 }), Math.ceil(Math.log(1 + 1e6 * 0.07 / 12 / 1000) / Math.log(1 + 0.07 / 12)) / 12, 1e-9, 'time to a million at 1000 a month');
const dd = F.drawdown({ balance: 1000000, withdrawal: 40000, annual: 0.04, inflation: 0.02 });
ok(dd.depleted === false || dd.lasts > 30, '4 % withdrawal with 4 % return lasts over 30 years');
const dd2 = F.drawdown({ balance: 100000, withdrawal: 20000, annual: 0 });
near(dd2.lasts, 5, 1e-9, 'a pot spent evenly lasts balance / withdrawal years');
const mc = F.monteCarlo({ initial: 100, years: 20, mean: 0.07, sd: 0, runs: 5 });
near(mc.years[20].p[50], 100 * Math.pow(1.07, 20), 1e-6, 'Monte Carlo with no volatility is compound growth');
const mc2 = F.monteCarlo({ initial: 1e6, withdrawal: 40000, inflation: 0.02, years: 30, mean: 0.06, sd: 0.15, runs: 2000, seed: 7 });
ok(mc2.success > 0.5 && mc2.success < 0.99 && mc2.years[30].p[90] > mc2.years[30].p[10], 'Monte Carlo gives a spread and a success rate (' + mc2.success + ')');
const mc3 = F.monteCarlo({ initial: 1e6, withdrawal: 40000, years: 30, mean: 0.06, sd: 0.15, runs: 2000, seed: 7 });
ok(mc3.success === F.monteCarlo({ initial: 1e6, withdrawal: 40000, years: 30, mean: 0.06, sd: 0.15, runs: 2000, seed: 7 }).success, 'Monte Carlo is reproducible from its seed');

// bonds
const b = F.bond({ face: 100, coupon: 0.05, ytm: 0.05, years: 5 });
near(b.price, 100, 1e-9, 'a bond at its coupon yield is priced at par');
near(b.macaulay, 4.5460, 0.0001, 'Macaulay duration of a 5-year 5 % bond');
near(b.modified, 4.5460 / 1.05, 0.0001, 'modified duration');
near(F.bond({ face: 1000, coupon: 0.06, ytm: 0.08, years: 10, freq: 2 }).price, 864.10, 0.01, 'semi-annual bond below par');
near(F.bondYield({ price: 864.10, face: 1000, coupon: 0.06, years: 10, freq: 2 }), 0.08, 1e-5, 'yield from price');
near(F.bond({ face: 100, coupon: 0, ytm: 0.04, years: 10 }).macaulay, 10, 1e-9, 'a zero-coupon bond\'s duration is its maturity');
const up = F.bond({ face: 100, coupon: 0.05, ytm: 0.06, years: 10 }).price, base = F.bond({ face: 100, coupon: 0.05, ytm: 0.05, years: 10 });
near((up - base.price) / base.price, -base.modified * 0.01 + 0.5 * base.convexity * 1e-4, 0.0005, 'duration and convexity predict a price change');

// options
near(F.ncdf(0), 0.5, 1e-9, 'normal distribution at 0'); near(F.ncdf(1.96), 0.975, 1e-4, 'normal distribution at 1.96');
near(F.blackScholes({ S: 100, K: 100, r: 0.05, sigma: 0.2, T: 1 }).price, 10.4506, 0.0005, 'Black–Scholes call');
near(F.blackScholes({ S: 100, K: 100, r: 0.05, sigma: 0.2, T: 1, type: 'put' }).price, 5.5735, 0.0005, 'Black–Scholes put');
const c = F.blackScholes({ S: 110, K: 100, r: 0.03, sigma: 0.25, T: 0.5 }).price, p = F.blackScholes({ S: 110, K: 100, r: 0.03, sigma: 0.25, T: 0.5, type: 'put' }).price;
near(c - p, 110 - 100 * Math.exp(-0.03 * 0.5), 1e-4, 'put–call parity');
near(F.payoff('call', 120, 100, 5), 15, 1e-9, 'call payoff'); near(F.payoff('put', 120, 100, 5, true), 5, 1e-9, 'short put keeps the premium');

// portfolios and leverage
const m = F.mix2({ w: 0.5, mu1: 0.08, mu2: 0.04, s1: 0.2, s2: 0.05, rho: 0 });
near(m.mu, 0.06, 1e-12, 'portfolio return'); near(m.sd, Math.sqrt(0.01 + 0.000625), 1e-12, 'portfolio risk');
ok(F.mix2({ w: 0.5, mu1: 0.08, mu2: 0.04, s1: 0.2, s2: 0.2, rho: -1 }).sd < 1e-12, 'perfectly opposite assets cancel risk');
near(F.sharpe(0.08, 0.16, 0.02), 0.375, 1e-12, 'Sharpe ratio');
near(F.leveraged(0.10, 2, 0.05), 0.15, 1e-12, 'leverage doubles the excess return');
near(F.leveraged(-0.10, 2, 0.05), -0.25, 1e-12, 'and more than doubles a loss');
near(F.marginCallPrice(100, 0.5, 0.25), 66.667, 0.001, 'margin call price at 50 % initial, 25 % maintenance');
const lp = F.leveragedPath([0.1, -0.1, 0.1, -0.1], 2);
ok(lp[4][2] < lp[4][1], 'a leveraged fund loses to volatility drag in a choppy market');

// money in the engine
ok(H.units.currency === '$' && H.units.toSI(250, 'money', '$k') === 250000, 'money units');
ok(H.util.money(1234.567) === '$1,234.57' && H.util.money(-250000) === '−$250,000' && H.util.money(1.25e6, null, true) === '$1.25M', 'money formatting');
ok(H.util.cleanNum('$1,200.50') === '1200.50' && H.util.cleanNum('max(1,200)') === 'max(1,200)', 'typed amounts');
ok(/\$350,000/.test(H.text('A house at ¤350,000')), '¤ in text is the currency');
const f = new H.Formula({ name: 'payment', expr: 'M = P*(r/12)/(1 - (1 + r/12)^(-n))', vars: { M: { q: 'money', unit: '$' }, P: { q: 'money', unit: '$', value: 300000 }, r: { q: 'ratio', unit: '%', value: 5 }, n: { int: true, value: 360 } } });
ok(!f.errors.length && Math.abs(f.solve('M', f.defaults()).value - 1610.46) < 0.005, 'a money formula');
ok(H.Formula.show(1610.4649, f.byName.M) === '$1,610.46' && /<mtext[^>]*>\$1,610\.46</.test(H.tex(H.Formula.showTex(1610.4649, f.byName.M), false)), 'money in results and worked solutions');
const t = new H.Formula({ name: 'fv', expr: 'A = P*(1 + r)^t', vars: { A: { q: 'money', unit: '$' }, P: { q: 'money', unit: '$', value: 1000 }, r: { q: 'ratio', unit: '%', value: 7 }, t: { q: 'years', unit: 'yr', value: 10 } } });
near(t.solve('A', t.defaults()).value, 1967.15, 0.005, 'years as a quantity');
near(H.units.toSI(18, 'years', 'mo'), 1.5, 1e-12, 'months in years');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
