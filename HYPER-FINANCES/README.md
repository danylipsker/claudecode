# Hyper Finances

Money without the fear — the fifth Hyper app, on the same engine as Hyper Physics, Math,
Electronics and Chemistry (`../HYPER-CORE`). Interest, loans and mortgages, budgeting and
saving, banking, investing and the stock exchange, leverage and derivatives, portfolios and
retirement, and the micro and macroeconomics behind them: every idea explained, every
formula a calculator, every decision something you can try before you make it. All text,
questions and simulations are original.

Open `index.html` in a browser, or from the repository root:

```bash
node scripts/serve.js 8172
```

then open <http://localhost:8172/HYPER-FINANCES/>. No installation, no network.

> For learning, not personal financial, legal or tax advice: the pages explain how things
> work and let you calculate; they do not know your situation or your country's rules.

## What is in it

**155 concepts** in 14 branches and 26 topics, with **452 formula calculators**,
**90 simulations** (used 149 times across the pages), **756 quiz questions** and
**322 worked examples**.

| Branch | Concepts | Topics |
|---|---:|---|
| Money and Interest | 14 | what money is · interest and compounding · the time value of money |
| Personal Finance | 14 | budgeting and cash flow · managing debt · insurance and protection |
| Money and the Mind | 7 | money fears, loss aversion, biases, mental accounting, present bias, habits |
| Banks and Banking | 9 | how banks work · accounts and payments |
| Loans and Credit | 10 | how loans are repaid, APR, comparing, repaying early, refinancing, costly credit |
| Mortgages and Property | 12 | fixed, variable, inflation-linked and mixed mortgages, affordability · property |
| Investing Fundamentals | 12 | the basics · funds and costs |
| The Stock Market | 16 | the exchange and its language · what a share is worth |
| Bonds and Fixed Income | 8 | pricing, yield, duration, credit risk, the yield curve |
| Leverage, Margin and Derivatives | 10 | leverage and margin calls · futures and options |
| Portfolio and Risk | 9 | return, volatility, correlation, the frontier, allocation, drawdowns, sequence risk |
| Wealth and Retirement | 8 | how wealth is built, independence, pensions, retirement income, taxes |
| Microeconomics | 12 | markets and prices · firms and competition |
| Macroeconomics | 14 | measuring the economy · money, rates and governments · booms and busts |

## Money in your own currency

Every amount is shown in the currency you choose (Tools → Money calculators: $, €, £, ₪,
¥, ₹, CHF …). It changes the symbol, not the numbers — there are no exchange rates; an
amount is an amount. Calculators accept "250,000" and "₪1,200.50" as typed.

## Money calculators

Tools → Money calculators, for your own numbers:

- **Loan & mortgage** — level (annuity, "Spitzer") or equal-capital payments, fees and the
  APR, extra payments and lump sums (shorter loan or lower payment), a rate change, an
  inflation-linked balance; the full schedule by year or month, and a CSV download.
- **Compare loans** — two offers side by side, including an early exit.
- **Savings plan** — contributions, return, fees and inflation, and a goal.
- **Financial independence** — the target, the years to reach it, and how a retirement
  survives 1 000 random markets.
- **Returns** — CAGR, the IRR of any cash flows, average against compound return.
- **Inflation** and **Credit card** (the minimum-payment trap).

The arithmetic behind them and the simulations is `HYPER-CORE/js/finance.js`, tested by
`HYPER-CORE/tools/test-finance.js` against textbook values.

## Files and checks

Same layout as the other Hyper apps: `content/outline.js` (branches, topics, planned
concepts), `content/reference.js` (amortization: the reference page authors followed),
`sims/reference.js` (a loan explorer and the compound-interest snowball), one
`content/*.js` per topic, `sims/*.js`, and a generated `catalog.js`. See
`../HYPER-CORE/AUTHORING.md` (the section "Finance: money, rates and time"), and run

```bash
node HYPER-CORE/tools/test-finance.js
node HYPER-CORE/tools/validate.js HYPER-FINANCES --final
node HYPER-CORE/tools/simtest.js HYPER-FINANCES
node HYPER-CORE/tools/catalog.js --all
```
