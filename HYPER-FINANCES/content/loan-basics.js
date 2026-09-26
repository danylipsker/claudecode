/* HYPER-FINANCES · content/loan-basics.js — Loans and Credit › Borrowing.
 * How a loan works, equal-capital repayment, the APR, comparing offers, early repayment,
 * refinancing, interest-only and balloon loans, car finance, and high-cost credit.
 * (Amortization with level payments is the reference concept, in content/reference.js.)
 * Every amount was computed with Hyper.finance; simulations are in sims/loans-bonds.js.
 * "How a loan works" is `how-loans-work` (the topic itself is `loan-basics`). */
Hyper.add(

/* ================================================================ HOW A LOAN WORKS */
{
  id: 'how-loans-work', parent: 'loan-basics', title: 'How a loan works', level: 1,
  short: 'A loan exchanges money now for a schedule of payments later. Interest is the price of the time and the risk; the principal, the rate, the term, the repayment method and the fees decide what it really costs.',
  keywords: ['loan', 'borrowing', 'principal', 'interest rate', 'term', 'secured loan', 'unsecured loan', 'collateral', 'personal loan', 'fixed rate', 'variable rate', 'cost of credit', 'risk premium', 'lender'],
  prereq: ['simple-interest', 'compound-interest', 'time-value-of-money'],
  related: ['amortization', 'apr', 'loan-comparison', 'good-and-bad-debt', 'credit-scores', 'debt-to-income', 'mortgage-basics'],
  body: `
You borrow ¤20,000 today and promise to pay ¤405.53 a month for five years. That is all a loan is: **money now, exchanged for more money later, on a schedule both sides sign**. Used well, it moves spending to the moment it matters — a home you can live in while you pay for it, a vehicle that gets you to work, a course that raises your income. Used badly, it takes a slice of every future pay cheque for something already gone. The difference is rarely luck. It is knowing what the loan really costs, and whether its schedule fits your life.

### The parts of every loan
| Part | What it means | In the example |
|---|---|---|
| **Principal** | the amount you receive and must repay | ¤20,000 |
| **Interest rate** | the yearly price of borrowing, charged on what you still owe | 8 % a year |
| **Term** | how long you have to repay | 5 years, 60 payments |
| **Repayment method** | how the payments are shaped | equal monthly payments |
| **Fees and conditions** | set-up fees, insurance, penalties | none here |

Each month the lender charges one-twelfth of the yearly rate on the balance: in the first month $20\\,000 \\times 0.08/12 = ¤133.33$. The rest of the ¤405.53 repays capital, so the balance falls and next month's interest is a little smaller. How that plays out over the whole term is [[amortization]].

### Why interest exists
A lender gives up money it could use elsewhere, takes the risk that some borrowers will not repay, and has costs to cover. The rate you are offered is roughly the sum of those parts:

$$r \\approx b + p + k$$

The **base rate** $b$ follows the wider market and the central bank ([[monetary-policy]]). The **risk premium** $p$ depends on you — income, existing debts, [[credit-scores|credit history]] — and on whether the loan is secured. The last part $k$ covers the lender's costs and profit. That is why two people can be offered different rates on the same day, and why the same person pays less for a mortgage than for a credit card.

### Secured or unsecured
A **secured** loan is backed by something the lender may take and sell if you stop paying: the home for a mortgage, the car for a car loan. The lender's risk is lower, so the rate is lower. An **unsecured** loan — a personal loan, an overdraft, a credit card — has only your promise behind it, and costs more. For you the trade-off runs the other way: missed payments on a secured loan can cost you the thing itself.

### Fixed or variable
A **fixed** rate stays the same for an agreed period, so the payment is known in advance. A **variable** rate follows a benchmark, so the payment can rise or fall ([[variable-rate-mortgages]]). A fixed rate is a kind of insurance against rising rates, and insurance usually has a price.

### What it costs
The honest measure is everything you pay minus what you borrowed. For ¤20,000:

| Rate and term | Monthly payment | Total interest |
|---|---:|---:|
| 8 %, 5 years | ¤405.53 | ¤4,331.67 |
| 8 %, 7 years | ¤311.72 | ¤6,184.84 |
| 18 %, 5 years | ¤507.87 | ¤10,472.11 |

Two more years lower the payment by ¤93.81 and add ¤1,853.17 of interest. A weaker credit profile that turns 8 % into 18 % more than doubles the cost. Fees count too, which is why many countries require lenders to quote one yearly figure that includes them, the [[apr|APR]].

> [!tip] Before you sign, ask five questions. What is the APR? What will I repay in total? What fees are there, now and later? What happens if I repay early — or miss a payment? Is the rate fixed, and for how long?

> [!key] A loan is a schedule you can calculate to the cent. Knowing the numbers turns it from something that happens to you into a decision you make.
`,
  ideas: [
    'A loan exchanges money now for a schedule of payments later; interest is the price of the time and of the risk.',
    'Interest is charged each month on the balance still owed, at one-twelfth of the yearly rate.',
    'A rate is roughly a base rate plus a risk premium plus the lender\'s costs — so your credit profile and any collateral change it.',
    'A secured loan is cheaper because the lender can take the asset; that same fact is the borrower\'s risk.',
    'Compare loans by total cost and APR; the monthly payment only tells you whether you can carry it.'
  ],
  pitfalls: [
    'The bank approved it, so I can afford it — Approval means the lender expects to be repaid, not that the payment leaves room for the rest of your life. Your own budget is the test.',
    'A longer term makes a loan cheaper because the payment is lower — It makes each payment smaller and the total larger: ¤20,000 at 8 % costs ¤4,331.67 of interest over 5 years and ¤6,184.84 over 7.',
    'Collateral is just paperwork — On a secured loan the car or the home really can be repossessed if payments stop; that is exactly why the rate is lower.'
  ],
  formulas: [
    {
      name: 'Total cost of a loan',
      expr: 'C = 12*T*M + F - P', tex: 'C = 12\\,T\\,M + F - P',
      vars: {
        C: { name: 'total cost of the credit', q: 'money', unit: '$' },
        T: { name: 'term', q: 'years', unit: 'yr', value: 5 },
        M: { name: 'monthly payment', q: 'money', unit: '$', value: 405.53 },
        F: { name: 'fees paid', q: 'money', unit: '$', value: 250 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 20000 }
      },
      note: 'Everything you pay — payments and fees — minus what you received, for a fixed-rate loan kept to the end. The defaults are ¤20,000 at 8 % over five years with a ¤250 set-up fee.',
      practice: { unknowns: ['C', 'M'] },
      stories: {
        C: 'You borrow {P} and repay {M} a month for {T}, after paying {F} of fees. What does the credit cost you in total?',
        M: 'A loan of {P} over {T} costs {C} in total, including {F} of fees. What is the monthly payment?'
      }
    },
    {
      name: 'What an interest rate is made of',
      expr: 'r = b + p + k',
      vars: {
        r: { name: 'rate offered', q: 'ratio', unit: '%' },
        b: { name: 'base rate (the market\'s price of money)', q: 'ratio', unit: '%', value: 3 },
        p: { name: 'risk premium for this borrower and loan', q: 'ratio', unit: '%', value: 2.5 },
        k: { name: 'lender\'s costs and margin', q: 'ratio', unit: '%', value: 1.5 }
      },
      note: 'A way of thinking, not a law: lenders price each part differently, but a better credit profile or good collateral lowers $p$, and a change in the central bank\'s rate moves $b$.',
      stories: {
        r: 'The base rate is {b}, the lender adds {p} for your risk and {k} for its costs. What rate are you offered?',
        p: 'You are offered {r} when the base rate is {b} and the lender\'s costs are {k}. What risk premium are you being charged?'
      }
    }
  ],
  examples: [
    {
      title: 'What ¤20,000 really costs',
      q: 'You borrow ¤20,000 at 8 % a year, repaid in equal monthly payments over five years. Find the payment, the total repaid and the total interest.',
      steps: [
        'Monthly rate $i = 0.08/12 = 0.0066667$; number of payments $n = 60$.',
        '$(1+i)^{-60} = 0.67121$, so $M = 20\\,000 \\times 0.0066667 / (1 - 0.67121) = ¤405.53$.',
        'Total repaid: $60 \\times 405.53 = ¤24{,}331.67$ (with the unrounded payment).',
        'Total interest: $24\\,331.67 - 20\\,000 = ¤4{,}331.67$, or 21.7 % of the amount borrowed.'
      ],
      a: '¤405.53 a month; ¤24,331.67 repaid; ¤4,331.67 of interest.'
    },
    {
      title: 'Two years longer',
      q: 'The same ¤20,000 at 8 %, but over seven years. What happens to the payment and to the interest?',
      steps: [
        '$n = 84$ and $(1+i)^{-84} = 0.57227$, so $M = 20\\,000 \\times 0.0066667/(1 - 0.57227) = ¤311.72$.',
        'Total repaid $84 \\times 311.72 = ¤26{,}184.84$; interest ¤6,184.84.',
        'The payment is ¤93.81 lower each month; the interest is ¤1,853.17 higher in total.'
      ],
      a: 'The payment falls to ¤311.72, and the interest rises to ¤6,184.84.'
    }
  ],
  quiz: [
    { q: 'Why is a loan secured on a car usually cheaper than an unsecured personal loan of the same size?', choices: ['cars never lose value', 'the lender can take and sell the car if payments stop, so its risk is lower', 'car dealers must lend at low rates', 'secured loans are always shorter'], a: 1,
      why: 'Collateral lowers the lender\'s expected loss, so the risk premium in the rate is smaller. The flip side is that the borrower can lose the car.' },
    { q: 'On the same day, a lender offers you 9 % and your colleague 6 % for the same kind of loan. The most likely reason is…', choices: ['the base rate changed between the two offers', 'your risk premium is higher — income, debts or credit history', 'the lender made an error', '9 % loans carry lower fees'], a: 1,
      why: 'The base rate is the same for both on the same day; the difference is the lender\'s view of each borrower\'s risk.' },
    { q: 'You repay ¤405.53 a month for 60 months on a ¤20,000 loan with no fees. How much interest do you pay in total?', answer: 4331.8, unit: '$',
      why: '60 × 405.53 = ¤24,331.80 repaid; minus the ¤20,000 borrowed leaves about ¤4,332 of interest.' },
    { q: 'If market interest rates rise next year, the payment on your fixed-rate loan rises too.', a: false,
      why: 'A fixed rate stays the same for the agreed period, whatever the market does; that certainty is what the fixed rate buys.' },
    { q: 'Stretching a loan from 5 to 7 years at the same rate…', choices: ['lowers the payment and the total interest', 'lowers the payment and raises the total interest', 'raises the payment and lowers the total interest', 'changes only the end date'], a: 1,
      why: 'The balance stays high for longer, so more interest accumulates even though each payment is smaller.' }
  ],
  applications: ['Reading any loan offer: principal, rate, term, repayment method and fees.', 'Understanding why your rate differs from someone else\'s, and what would lower it.', 'Choosing between a secured and an unsecured way to borrow.'],
  sim: { id: 'lb-apr-fees', params: { P: 20000, r: 8, T: 5, fp: 0 } }
},

/* ================================================================ EQUAL CAPITAL */
{
  id: 'equal-principal', parent: 'loan-basics', title: 'Equal-capital repayment', level: 2,
  short: 'Repay the same slice of capital every month, plus interest on what is left: the payment starts high and falls in a straight line, the debt shrinks faster, and the total interest is lower than with level payments.',
  keywords: ['equal principal', 'equal capital', 'linear repayment', 'linear amortization', 'straight-line repayment', 'declining payments', 'keren shava', 'lineaire hypotheek', 'total interest', 'average balance'],
  prereq: ['amortization', 'how-loans-work', 'math:arithmetic-series'],
  related: ['apr', 'early-repayment', 'mortgage-basics', 'mortgage-affordability', 'present-value'],
  body: `
Imagine repaying a ¤200,000 loan over 20 years by handing back exactly the same slice of capital every month: $200\\,000/240 = ¤833.33$. On top of that slice you pay the month's interest on what you still owe. In the first month you owe the whole amount, so at 6 % the interest is ¤1,000 and the payment ¤1,833.33. Each month the balance is ¤833.33 smaller, so the interest — and the payment — falls by $833.33 \\times 0.005 = ¤4.17$, in a straight line down to ¤837.50 in the last month. This is **equal-capital** (linear, or equal-principal) repayment. Many lenders in continental Europe and in Israel offer it as a standard alternative to [[amortization|level payments]], and it is common for business loans everywhere.

### The two schedules side by side
| Month | Equal capital: payment | its interest | Level: payment | its interest |
|---|---:|---:|---:|---:|
| 1 | ¤1,833.33 | ¤1,000.00 | ¤1,432.86 | ¤1,000.00 |
| 60 | ¤1,587.50 | ¤754.17 | ¤1,432.86 | ¤851.90 |
| 120 | ¤1,337.50 | ¤504.17 | ¤1,432.86 | ¤649.23 |
| 180 | ¤1,087.50 | ¤254.17 | ¤1,432.86 | ¤375.86 |
| 240 | ¤837.50 | ¤4.17 | ¤1,432.86 | ¤7.13 |

The equal-capital payment starts ¤400.47 higher and drops below the level payment from month 98, early in the ninth year. After ten years it has repaid exactly half the loan, while the level-payment loan still owes ¤129,062.84.

### The formulas
With $n$ payments and a monthly rate $i = r/12$, the payment in month $k$ is the capital slice plus interest on the balance left after $k-1$ slices:

$$M_k = \\frac{P}{n} + \\left(P - (k-1)\\frac{P}{n}\\right) i$$

The interest adds up as an [[math:arithmetic-series|arithmetic series]] (see the derivation below):

$$I_{\\text{total}} = P\\,i\\,\\frac{n+1}{2}$$

For our loan $200\\,000 \\times 0.005 \\times 241/2 = ¤120{,}500$, against ¤143,886.91 with level payments — ¤23,386.91 less.

### Is it really cheaper?
Less interest leaves your account, yes. But look at why. Total interest is always **rate × average balance × time**. The equal-capital loan's average balance is ¤100,416.67, the level loan's ¤119,905.76 — and 120,500 / 143,886.91 is exactly the same ratio. You pay less interest because **you borrow less money for less time**: the extra capital paid in the early years works like a prepayment. At the loan's own rate, both schedules are worth precisely ¤200,000 today; in [[present-value|present-value]] terms neither is the better deal. The choice turns on two other things:

- **Cash flow.** The first year of equal capital costs ¤21,725 against ¤17,194.35 — 26 % more, just when budgets are usually tightest. Lenders often test affordability on the first, highest payment, so equal capital can lower how much you may borrow ([[mortgage-affordability]]).
- **What else the money could do.** If the extra early payments would otherwise sit in savings earning less than the loan's rate, equal capital saves you money. If they would clear a dearer debt or build your [[emergency-fund|emergency fund]], level payments may serve you better.

> [!key] Equal capital repays faster, so it costs less interest; level payments leave more money in your hands early on. At the same rate, neither is a trick.
`,
  ideas: [
    'Equal capital repays the same slice of the loan each month; the interest, and so the payment, falls by a fixed amount every month.',
    'The first payment is the highest — on ¤200,000 at 6 % over 20 years, ¤1,833.33 against ¤1,432.86 for level payments.',
    'Total interest is $P\\,i\\,(n+1)/2$: lower than with level payments because the balance falls faster.',
    'Total interest is always rate × average balance × time; a lower total means a smaller average debt, not a better price.',
    'At the loan\'s own rate both schedules are worth exactly the amount borrowed: choose by cash flow and by what else the money could do.'
  ],
  pitfalls: [
    'Equal capital must come with a lower interest rate — The rate is the same; the total interest is lower only because the balance falls faster.',
    'The high early payments last only a few months — On ¤200,000 at 6 % over 20 years the equal-capital payment stays above the level payment for more than eight years.',
    'Level payments are a trick to make borrowers pay more interest — Both schedules repay the same loan at the same rate; level payments simply repay more slowly, so the balance, and the interest on it, stays higher for longer.'
  ],
  derivation: {
    title: 'Total interest on an equal-capital loan',
    steps: [
      { text: 'Each payment repays $P/n$ of capital, so before payment $k$ the balance is', tex: 'B_{k-1} = P - (k-1)\\frac{P}{n}' },
      { text: 'The interest in payment $k$ is that balance times the monthly rate. Summing over all $n$ payments:', tex: 'I = i\\sum_{k=1}^{n}\\left(P - (k-1)\\frac{P}{n}\\right) = i\\left(nP - \\frac{P}{n}\\sum_{j=0}^{n-1} j\\right)' },
      { text: 'The sum $0 + 1 + \\dots + (n-1)$ is the arithmetic series $n(n-1)/2$:', tex: 'I = i\\left(nP - \\frac{P(n-1)}{2}\\right) = P\\,i\\,\\frac{n+1}{2}' },
      { text: 'The average balance is $P(n+1)/(2n)$ — a little over half the loan — so the total interest is the monthly rate times the average balance times the number of months.', tex: 'I = i \\cdot \\bar{B} \\cdot n' }
    ]
  },
  formulas: [
    {
      name: 'Payment in month k (equal capital)',
      expr: 'M = P/(12*T) + (P - (k - 1)*P/(12*T))*r/12',
      tex: 'M = \\frac{P}{12T} + \\left(P - (k-1)\\frac{P}{12T}\\right)\\frac{r}{12}',
      vars: {
        M: { name: 'payment in month k', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 200000 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 20 },
        k: { name: 'payment number', int: true, value: 1, min: 1 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 6, min: 0.01, max: 50 }
      },
      note: 'The capital slice $P/(12T)$ never changes; the interest falls by the same amount every month. Try $k = 240$ for the last payment.',
      practice: { unknowns: ['M'] },
      stories: { M: 'A loan of {P} at {r} is repaid in equal capital over {T}. What is payment number {k}?' }
    },
    {
      name: 'Total interest with equal capital',
      expr: 'I = P*(r/12)*(12*T + 1)/2', tex: 'I = P\\,\\frac{r}{12}\\,\\frac{12T + 1}{2}',
      vars: {
        I: { name: 'total interest paid', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 200000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 6 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'Compare with the level-payment total, $12\\,T\\,M - P$: for ¤200,000 at 6 % over 20 years, ¤120,500 against ¤143,886.91.',
      practice: { unknowns: ['I', 'T'] },
      stories: {
        I: 'You repay {P} at {r} in equal capital over {T}. How much interest do you pay in total?',
        T: 'An equal-capital loan of {P} at {r} costs {I} of interest in total. How long is it?'
      }
    },
    {
      name: 'Total interest from the average balance',
      expr: 'I = r*B*T', tex: 'I = r\\,\\bar{B}\\,T',
      vars: {
        I: { name: 'total interest paid', q: 'money', unit: '$' },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 6 },
        B: { name: 'average balance owed', q: 'money', unit: '$', value: 100416.67, tex: '\\bar{B}' },
        T: { name: 'term', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'True for any schedule at a fixed rate, when $\\bar{B}$ is the average of the balances at the start of each month. It shows why a faster repayment costs less interest: the average debt is smaller.',
      stories: { I: 'Over {T} you owe on average {B}, at {r} a year. How much interest do you pay?' }
    }
  ],
  examples: [
    {
      title: 'The first and the last payment',
      q: '¤200,000 is repaid in equal capital over 20 years at 6 % a year. Find the first payment, the last payment and the total interest.',
      steps: [
        'Capital slice: $200\\,000/240 = ¤833.33$; monthly rate $i = 0.005$.',
        'First month: interest $200\\,000 \\times 0.005 = ¤1{,}000$, payment ¤1,833.33.',
        'Last month: only one slice is owed, interest $833.33 \\times 0.005 = ¤4.17$, payment ¤837.50.',
        { text: 'Total interest:', tex: 'I = 200\\,000 \\times 0.005 \\times \\frac{241}{2} = ¤120{,}500' }
      ],
      a: 'From ¤1,833.33 down to ¤837.50; ¤120,500 of interest in total (level payments: ¤143,886.91).'
    },
    {
      title: 'When does equal capital become the smaller payment?',
      q: 'For the same loan the level payment is ¤1,432.86. From which month is the equal-capital payment lower?',
      steps: [
        'We need $833.33 + (200\\,000 - (k-1) \\times 833.33) \\times 0.005 < 1\\,432.86$.',
        'So the interest part must be below ¤599.53: the balance must be below ¤119,905.',
        '$200\\,000 - (k-1)\\times 833.33 < 119\\,905$ gives $k - 1 > 96.1$, so $k \\ge 98$.',
        'Check: payment 97 is ¤1,433.33 (still higher), payment 98 is ¤1,429.17.'
      ],
      a: 'From payment 98 — early in the ninth year.'
    }
  ],
  quiz: [
    { q: 'On an equal-capital loan, what happens to the monthly payment over time?', choices: ['it stays the same', 'it falls by the same amount every month', 'it rises with the balance', 'it falls faster and faster'], a: 1,
      why: 'The capital part is fixed, and the interest falls each month by one capital slice times the monthly rate, so the payment falls in a straight line.' },
    { q: '¤120,000 is repaid in equal capital over 10 years at 6 % a year. What is the first monthly payment?', answer: 1600, unit: '$',
      why: 'Capital slice 120,000 / 120 = ¤1,000; first month\'s interest 120,000 × 0.005 = ¤600; together ¤1,600.' },
    { q: 'Because equal capital costs less total interest, it is always the better choice.', a: false,
      why: 'At the same rate both schedules are worth the amount borrowed; equal capital simply repays faster. If the higher early payments strain your budget or could clear a dearer debt, level payments can be the better choice.' },
    { q: 'Same loan, same rate, same term. After ten years of a 20-year loan, which schedule leaves the larger balance?', choices: ['equal capital', 'level payments', 'they are equal', 'it depends on inflation'], a: 1,
      why: 'Equal capital has repaid exactly half (¤100,000 of ¤200,000); level payments still owe ¤129,062.84 at 6 %, because their early payments are mostly interest.' }
  ],
  applications: ['Choosing a repayment method when a lender offers both.', 'Business and equipment loans, which are often repaid in equal capital.', 'Understanding why a faster repayment always means less total interest.'],
  sim: { id: 'ref-amortization', params: { method: 'linear' } }
},

/* ================================================================ APR */
{
  id: 'apr', parent: 'loan-basics', title: 'APR: the true cost of a loan', level: 2,
  short: 'The annual percentage rate folds the fees into one yearly rate: the rate at which what you actually receive equals the value of everything you repay. It is the loan\'s internal rate of return, seen from the borrower\'s side.',
  keywords: ['APR', 'annual percentage rate', 'APRC', 'effective annual rate', 'true cost of credit', 'arrangement fee', 'origination fee', 'points', 'internal rate of return', 'nominal rate', 'effective rate', 'truth in lending', 'finance charge'],
  prereq: ['how-loans-work', 'amortization', 'irr', 'effective-rate'],
  related: ['loan-comparison', 'early-repayment', 'high-cost-credit', 'credit-cards', 'mortgage-costs', 'npv'],
  body: `
Two lenders offer ¤10,000 over three years. One charges 7 % and a ¤500 arrangement fee; the other charges 8 % and no fee. Which is cheaper? The rates alone cannot say, because the fee is paid differently from the interest. The **annual percentage rate** — the APR — puts everything on one scale: it is the single yearly rate at which what you actually receive equals the value of everything you pay back.

### What you receive and what you pay
With the 7 % offer the payment is ¤308.77 a month, computed on the full ¤10,000. But ¤500 goes straight back to the lender, so you really receive ¤9,500 and repay 36 × ¤308.77. The APR is the rate $a$ that balances the two:

$$P - F = \\sum_{k=1}^{n} \\frac{M}{(1+a/12)^k} = M\\,\\frac{1-(1+a/12)^{-n}}{a/12}$$

This is exactly the [[irr|internal rate of return]] of the loan from your side. There is no neat formula for $a$; it is found by trial, which the calculator below does for you. Here $a = 10.50\\,\\%$. The 8 % loan with no fee has an APR of 8 %, so it is clearly the cheaper one, although its headline rate is higher.

### The same fee, different horizons
A fee is paid once, so its weight depends on how long you keep the loan. The ¤500 fee on ¤10,000 at 7 % gives an APR of 10.50 % over three years but 9.17 % over five. And the APR printed on an offer assumes you keep the loan to the end. Repay early and the fee is spread over fewer months, so your true yearly cost is higher than the APR says. A ¤250,000 mortgage at 4.5 % over 25 years with ¤3,000 of fees:

| Kept for | True yearly cost |
|---|---:|
| 25 years (the printed APR) | 4.62 % |
| 5 years | 4.79 % |
| 2 years | 5.15 % |

### Nominal or effective?
Most APRs are yearly rates built from a monthly one, and countries disagree on how. In the US the Truth in Lending rules define the APR as the monthly rate times twelve — a *nominal* rate. In the EU and the UK the equivalent figure, the APRC, must be an *effective* annual rate, with the monthly compounding built in:

$$\\text{EAR} = \\left(1 + \\frac{\\text{APR}}{12}\\right)^{12} - 1$$

So 7 % charged monthly is 7.23 % effective, and the 10.50 % APR above is 11.02 % effective. When you compare offers, make sure both numbers are of the same kind ([[effective-rate]]).

### What the APR leaves out
- **Optional or later costs.** Insurance you may decline, late charges and penalty fees are usually left out; exactly which costs must be included differs by country and by kind of loan.
- **Variable rates.** The APR of a variable-rate loan assumes today's rate forever.
- **Size and length.** A lower APR over a longer term can still mean more interest in total, and the APR says nothing about [[early-repayment|early-repayment]] penalties or flexibility.

> [!key] The APR answers one question well: what is this loan's yearly price, fees included, if I keep it to the end? Use it to compare offers of the same length — then check the total cost over the time you really expect to keep the loan.
`,
  ideas: [
    'The APR is the rate at which the amount you actually receive (loan minus fees) equals the present value of your payments.',
    'It is the loan\'s internal rate of return from the borrower\'s side, found numerically.',
    'An up-front fee weighs more the sooner you repay: the printed APR assumes you keep the loan to the end.',
    'US APRs are nominal (monthly rate × 12); EU and UK APRCs are effective annual rates.',
    'A lower APR is a lower price per year, not necessarily a lower total: the term matters too.'
  ],
  pitfalls: [
    'The APR is the rate interest is charged at — Interest is charged at the contract rate; the APR is a summary that also spreads the fees over the term.',
    'The lowest APR is always the cheapest loan for me — Only if you keep it to the end and the terms are similar: repay early and up-front fees weigh more; stretch the term and the total interest rises.',
    'An APR from one country compares directly with one from another — US APRs are nominal, EU and UK APRCs are effective, and the fees that must be included differ.'
  ],
  formulas: [
    {
      name: 'APR from what you receive and what you pay',
      expr: 'P - F = M*(1 - (1 + A/12)^(-12*T))/(A/12)',
      tex: 'P - F = M\\,\\frac{1 - (1 + A/12)^{-12T}}{A/12}',
      vars: {
        A: { name: 'APR (nominal yearly rate)', q: 'ratio', unit: '%', min: 0.01, max: 500 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 10000 },
        F: { name: 'up-front fees', q: 'money', unit: '$', value: 500 },
        M: { name: 'monthly payment', q: 'money', unit: '$', value: 308.77 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 3 }
      },
      solveFor: 'A',
      note: 'The payment is the one set by the contract rate on the full amount (¤308.77 is ¤10,000 at 7 % over three years). The APR is found numerically — it is the internal rate of return of the loan.',
      practice: { unknowns: ['A', 'F'] },
      stories: {
        A: 'You borrow {P} over {T} at {M} a month, but pay {F} of fees at the start. What is the APR?',
        F: 'A loan of {P} over {T} at {M} a month is advertised with an APR of {A}. How much are the up-front fees?'
      }
    },
    {
      name: 'Effective yearly rate of a monthly APR',
      expr: 'E = (1 + A/12)^12 - 1', tex: 'E = \\left(1 + \\frac{A}{12}\\right)^{12} - 1',
      vars: {
        E: { name: 'effective yearly rate', q: 'ratio', unit: '%' },
        A: { name: 'nominal APR, charged monthly', q: 'ratio', unit: '%', value: 10.5, min: 0, max: 1000 }
      },
      note: 'Converts a US-style nominal APR into the effective rate used for EU and UK APRCs.',
      stories: {
        E: 'A loan is advertised at an APR of {A}, charged monthly. What is the effective yearly rate?',
        A: 'A European offer shows an APRC (effective) of {E}. What nominal monthly-compounded APR is that?'
      }
    }
  ],
  examples: [
    {
      title: 'The fee that turns 7 % into 10.5 %',
      q: '¤10,000 at 7 % over three years, with a ¤500 arrangement fee paid at the start. What is the APR?',
      steps: [
        'The payment is set on the full ¤10,000: $i = 0.07/12$, $(1+i)^{-36} = 0.81108$, $M = 10\\,000 \\times 0.0058333/(1 - 0.81108) = ¤308.77$.',
        'You receive $10\\,000 - 500 = ¤9{,}500$ and repay 36 payments of ¤308.77.',
        'Find $a$ with $9\\,500 = 308.77\\,(1 - (1 + a/12)^{-36})/(a/12)$. Try 10 %: the right side is ¤9,569.19, too big, so the rate is higher. Try 11 %: ¤9,431.37, too small. Narrowing down gives $a = 10.50\\,\\%$.',
        'Effective: $(1 + 0.105/12)^{12} - 1 = 11.02\\,\\%$.'
      ],
      a: 'An APR of 10.50 % (11.02 % effective) — dearer than an 8 % loan with no fee.'
    },
    {
      title: 'The same fees, kept for a shorter time',
      q: 'A ¤250,000 mortgage at 4.5 % over 25 years (¤1,389.58 a month) has ¤3,000 of fees. What is the true yearly cost if you keep it 25 years, 5 years or 2 years?',
      steps: [
        'Kept to the end: you receive ¤247,000 and make 300 payments; the rate that balances them is 4.62 %.',
        'Sold after 5 years: the flows are 60 payments plus the ¤219,644.76 still owed, repaid at month 60. The balancing rate is 4.79 %.',
        'Refinanced after 2 years: 24 payments plus the ¤238,669.02 then owed; the balancing rate is 5.15 %.',
        'The fee is the same ¤3,000; spread over fewer months it adds more to each year.'
      ],
      a: '4.62 %, 4.79 % and 5.15 % a year.'
    }
  ],
  quiz: [
    { q: 'A loan at 6 % with no fees of any kind has an APR of…', choices: ['less than 6 %', 'exactly 6 %', 'more than 6 %', 'it depends on the term'], a: 1,
      why: 'With no fees you receive the full amount, so the rate that balances what you receive and what you pay is the contract rate itself.' },
    { q: 'A card charges 1.5 % a month. What is its nominal APR, in per cent?', answer: 18, unit: '%',
      why: '1.5 % × 12 = 18 % nominal. Effective, with monthly compounding, it is (1.015)¹² − 1 = 19.56 %.' },
    { q: 'A five-year loan has an up-front fee, and you expect to repay it after one year. Your true yearly cost will be…', choices: ['lower than the printed APR', 'equal to the printed APR', 'higher than the printed APR', 'equal to the interest rate'], a: 2,
      why: 'The printed APR spreads the fee over five years; repaid after one, the same fee is spread over one year, so it adds far more per year.' },
    { q: 'A lower APR always means a lower monthly payment.', a: false,
      why: 'The payment also depends on the term: a longer loan can have a lower payment and a higher APR, or a lower APR and a higher payment.' },
    { q: 'Why is a loan\'s APR usually higher than its interest rate?', choices: ['because it compounds daily', 'because it includes the fees you must pay', 'because it adds inflation', 'because lenders round it up'], a: 1,
      why: 'Fees reduce what you really receive while the payments stay the same, so the rate that balances them is higher than the contract rate.' }
  ],
  applications: ['Comparing loans with different fees and rates on one scale.', 'Spotting when an up-front fee makes a "low rate" expensive.', 'Reading US APRs and European APRCs correctly.', 'Estimating your true cost if you expect to repay early.'],
  history: 'The US Truth in Lending Act of 1968 made a standard APR compulsory on consumer loans, so that borrowers could compare offers on one number. European rules followed with the consumer credit directives, which settled on an effective yearly rate, the APRC.',
  sim: { id: 'lb-apr-fees', params: { P: 10000, r: 7, T: 3, fp: 5 } }
},

/* ================================================================ COMPARING OFFERS */
{
  id: 'loan-comparison', parent: 'loan-basics', title: 'Comparing loan offers', level: 2,
  short: 'Compare offers over the time you will really keep the loan: interest plus fees, the APR at the same term, and the payment you can carry — then the flexibility and the conditions behind the numbers.',
  keywords: ['compare loans', 'loan offers', 'best loan', 'fees versus rate', 'break-even', 'total cost', 'APR comparison', 'mortgage comparison', 'personal loan comparison', 'negotiating a loan', 'loan horizon'],
  prereq: ['apr', 'amortization', 'how-loans-work'],
  related: ['early-repayment', 'refinancing', 'mortgage-costs', 'fixed-rate-mortgages', 'variable-rate-mortgages', 'household-budget'],
  body: `
Two offers arrive for the same ¤250,000 mortgage over 25 years. Offer A: 4.5 % with ¤3,000 of fees, ¤1,389.58 a month. Offer B: 4.9 % with no fees, ¤1,446.95 a month. A is cheaper every month; B costs nothing to start. Which is better depends on something neither offer mentions: **how long you will keep the loan**.

### Compare over the time you will really keep it
Up to any moment, a loan has cost you the interest paid so far plus the fees — the capital you repaid is your own money coming back. If you sell or refinance after a given time:

| Keep it for | A: interest + fees | B: interest | Cheaper |
|---|---:|---:|---|
| 1 year | ¤14,136.70 | ¤12,133.58 | B, by ¤2,003.11 |
| 2 years | ¤25,018.97 | ¤24,005.08 | B, by ¤1,013.89 |
| 3 years | ¤35,635.13 | ¤35,601.34 | about equal |
| 5 years | ¤56,019.63 | ¤57,912.32 | A, by ¤1,892.69 |
| 25 years | ¤169,874.36 | ¤184,083.96 | A, by ¤14,209.60 |

The fee is earned back after about three years. A quick check: the rate gap of 0.4 points saves about $250\\,000 \\times 0.004 = ¤1{,}000$ of interest a year at first, so ¤3,000 of fees need about three years. Dividing the fee by the difference in *payments* (¤57.37 a month) would give 52 months — too pessimistic, because the cheaper loan also repays capital faster. Many people move, sell or refinance long before a mortgage ends, so the horizon deserves an honest guess rather than a hopeful one.

### Offers of different lengths
For ¤15,000, three offers:

| Offer | Rate, term, fee | Monthly | APR | Interest + fees |
|---|---|---:|---:|---:|
| X | 6.9 %, 5 years, ¤400 | ¤296.31 | 8.04 % | ¤3,178.65 |
| Y | 7.9 %, 4 years, none | ¤365.49 | 7.90 % | ¤2,543.53 |
| Z | 5.9 %, 7 years, none | ¤218.41 | 5.90 % | ¤3,346.43 |

Z has the lowest rate and APR — and the highest total, because it lasts longest. Y costs least in total but asks the most each month. X's low headline rate hides a fee that makes it the dearest per year. There is no single winner, because each number answers a different question: the **APR** is the price per year, the **total** is what the length costs, the **payment** is whether you can carry it. A sound order: find the shortest term whose payment leaves room in your [[household-budget|budget]], then take the lowest APR at that term.

### Beyond the numbers
- **Flexibility**: can you overpay or repay early without a [[early-repayment|penalty]]?
- **Rate type**: a fixed rate often starts higher than a variable one because it carries the risk of rising rates for you ([[fixed-rate-mortgages]]).
- **Conditions**: a discount that needs your salary paid into the bank, insurance that must be bought through the lender, a rate that holds for only two years.
- **Like with like**: offers in writing, for the same amount and term, obtained within a few days of each other. Lenders expect you to compare, and in many markets a written offer from one lender can be taken to another.

Try your own offers, including the year you might repay early, in [the offer comparison](#/tools/money/compare).
`,
  ideas: [
    'The cost of a loan up to any date is the interest paid plus the fees; capital repaid is your own money coming back.',
    'A lower rate with a fee beats a higher rate without one only if you keep the loan past the break-even.',
    'The break-even is roughly the fee divided by the yearly interest saved (loan × rate gap), not by the payment difference.',
    'APR compares the price per year; the total shows what the length costs; the payment shows what you can carry.',
    'Compare like with like: same amount, same term, same horizon, written offers.'
  ],
  pitfalls: [
    'The offer with the lowest monthly payment is the best — A lower payment often comes from a longer term, which raises the total cost.',
    'Divide the fee by the payment difference to find the break-even — That overstates it: the lower-rate loan also repays capital faster. Use the interest saved, about the loan times the rate gap each year.',
    'Compare total interest across loans of different lengths — A longer loan always accumulates more interest; compare APRs at the same term, and totals over the same horizon.'
  ],
  formulas: [
    {
      name: 'Break-even horizon for an up-front fee',
      expr: 'H = F/(P*(b - a))', tex: 'H = \\frac{F}{P\\,(b - a)}',
      vars: {
        H: { name: 'years until the fee is earned back', q: 'years', unit: 'yr' },
        F: { name: 'extra fees of the lower-rate offer', q: 'money', unit: '$', value: 3000 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 },
        a: { name: 'rate of the offer with fees', q: 'ratio', unit: '%', value: 4.5 },
        b: { name: 'rate of the offer without fees', q: 'ratio', unit: '%', value: 4.9 }
      },
      note: 'An estimate for the early years of a long loan: the interest saved each year is about the loan times the rate gap. For the defaults, adding up interest and fees month by month gives month 37; comparing the two offers\' APRs, which also allows for the time value of money, gives month 41.',
      practice: { unknowns: ['H', 'F'] },
      stories: {
        H: 'Offer A charges {F} of fees for a rate of {a}; offer B charges no fees at {b}. On a loan of {P}, roughly how long until A\'s fees are earned back?',
        F: 'You expect to keep a loan of {P} for {H}. One offer is at {b} with no fees. What is the most you should pay in fees for a rate of {a}?'
      }
    },
    {
      name: 'Total cost of an offer kept to the end',
      expr: 'C = 12*T*P*(r/12)/(1 - (1 + r/12)^(-12*T)) + F - P',
      tex: 'C = 12\\,T\\,P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}} + F - P',
      vars: {
        C: { name: 'interest and fees over the whole loan', q: 'money', unit: '$' },
        T: { name: 'term', q: 'years', unit: 'yr', value: 5 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 15000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 6.9, min: 0.01, max: 50 },
        F: { name: 'fees', q: 'money', unit: '$', value: 400 }
      },
      note: 'Level monthly payments at a fixed rate. The defaults are offer X above; try 7.9 % over 4 years with no fee (offer Y).',
      practice: { unknowns: ['C'] },
      stories: { C: 'An offer lends {P} at {r} over {T}, with {F} of fees. What does it cost in total if kept to the end?' }
    }
  ],
  examples: [
    {
      title: 'A fee or a higher rate?',
      q: '¤250,000 over 25 years. Offer A: 4.5 % plus ¤3,000 of fees. Offer B: 4.9 %, no fees. Which is cheaper if you sell after 2 years, and if you keep the loan 5 years?',
      steps: [
        'Payments: A ¤1,389.58, B ¤1,446.95 a month.',
        'After 2 years A has cost ¤22,018.97 of interest plus ¤3,000 of fees = ¤25,018.97; B has cost ¤24,005.08 of interest. B is ¤1,013.89 cheaper.',
        'After 5 years: A ¤56,019.63, B ¤57,912.32. Now A is ¤1,892.69 cheaper.',
        { text: 'Rough break-even:', tex: 'H \\approx \\frac{3\\,000}{250\\,000 \\times 0.004} = 3 \\text{ years}' }
      ],
      a: 'B if you sell within about three years; A if you keep the loan longer.'
    },
    {
      title: 'Three personal loans',
      q: 'For ¤15,000: X at 6.9 % over 5 years with a ¤400 fee, Y at 7.9 % over 4 years, Z at 5.9 % over 7 years. Rank them by payment, by APR and by total cost.',
      steps: [
        'Payments: X ¤296.31, Y ¤365.49, Z ¤218.41 — Z is the easiest to carry.',
        'APRs: X 8.04 % (the fee spread over 5 years), Y 7.90 %, Z 5.90 % — Z is the lowest price per year.',
        'Interest + fees: X ¤3,178.65, Y ¤2,543.53, Z ¤3,346.43 — Y costs least in total, Z most.',
        'If Y\'s payment fits the budget, it is the cheapest route; if not, Z is cheaper per year than X and the payment is lowest.'
      ],
      a: 'No single winner: Y has the lowest total, Z the lowest APR and payment, X is dearest per year.'
    }
  ],
  quiz: [
    { q: 'You will very probably sell your home within two years. Offer A has a lower rate but high fees; offer B a slightly higher rate and no fees. Which is likely cheaper for you?', choices: ['A, because the rate is lower', 'B, because the fees would not have time to be earned back', 'they are always equal', 'A, because fees are tax-deductible'], a: 1,
      why: 'The fee is earned back only through years of lower interest; over two years there is not enough time, as in the ¤250,000 example where B stays cheaper for about three years.' },
    { q: 'A lender charges ¤2,000 of fees for a rate 0.5 points lower on a ¤200,000 loan. Roughly how many years until the fee is earned back?', answer: 2, unit: 'yr',
      why: 'The interest saved is about 200,000 × 0.005 = ¤1,000 a year, so ¤2,000 takes about two years.' },
    { q: 'The offer with the lowest interest rate always has the lowest total cost.', a: false,
      why: 'Fees and the term matter too: a low rate over a long term (offer Z) or with a fee (offer X) can cost more in total than a higher rate over a shorter term.' },
    { q: 'For two loans of the same amount and term, the most useful single number for comparing their price is…', choices: ['the monthly payment', 'the APR', 'the headline rate', 'the fee'], a: 1,
      why: 'The APR combines the rate and the fees into one yearly price; at the same term it ranks the offers fairly.' }
  ],
  applications: ['Choosing between mortgage offers with different fees and rates.', 'Deciding how much an up-front fee is worth, given how long you expect to keep a loan.', 'Comparing personal and car loans of different lengths without being misled by the payment.'],
  sim: { id: 'lb-apr-fees', params: { P: 250000, r: 4.5, T: 25, fp: 1.2, compare: true, r2: 4.9 } }
},

/* ================================================================ EARLY REPAYMENT */
{
  id: 'early-repayment', parent: 'loan-basics', title: 'Early repayment and prepayment penalties', level: 2,
  short: 'Every unit repaid early stops costing the loan\'s rate for all the years it would have been owed — a guaranteed return. Whether to shorten the loan or lower the payment, what penalties cost, and what to do first.',
  keywords: ['early repayment', 'prepayment', 'overpayment', 'lump sum', 'prepayment penalty', 'early repayment charge', 'ERC', 'shorten the loan', 'reduce the payment', 'pay off mortgage early', 'break-even', 'redemption fee'],
  prereq: ['amortization', 'how-loans-work', 'present-value'],
  related: ['refinancing', 'apr', 'emergency-fund', 'debt-payoff', 'fixed-rate-mortgages', 'opportunity-cost'],
  body: `
You have ¤20,000 you do not need, and a mortgage at 5 %. Paying part of it off early is one of the safest "investments" there is: every unit you prepay stops costing 5 % for all the years it would have been owed. That is a guaranteed return equal to the loan's rate, which no market can take away. But it is not free of trade-offs: money put into a loan is hard to get back, the contract may charge a penalty, and the same money might do more good elsewhere.

### Shorten the loan or lower the payment?
Take ¤250,000 at 5 % over 25 years (¤1,461.48 a month). After five years ¤221,450.47 is still owed, and you pay ¤20,000 extra. Lenders usually offer two ways to apply it:

| | Keep the payment, shorten the loan | Keep the end date, lower the payment |
|---|---|---|
| Payment | ¤1,461.48 | ¤1,329.48 (¤131.99 less) |
| The loan ends | 34 months early | on schedule |
| Interest saved | ¤30,549.29 | ¤11,677.88 |

Shortening "saves" almost three times as much interest — yet the two are worth the same. With the lower payment you keep ¤131.99 every month for 20 years; valued at the loan's 5 %, those amounts are worth exactly the ¤20,000 you prepaid, just as the 34 payments you skip at the end are. Shortening simply keeps you repaying faster, so less interest accumulates. Choose by what you need: a lower payment buys breathing room; a shorter loan buys an earlier debt-free date.

### Penalties
A lender that fixed your rate may lose money when you repay — especially if rates have fallen since — and may charge you for it. Common patterns:
- a **percentage of the amount repaid**, often 1–3 % and falling over the years;
- **some months of interest** on the amount repaid;
- a **rate-difference charge** for the lender's lost interest. If our 5 % loan could only be lent again at 3 %, that loss on ¤20,000 over 20 years is worth about ¤3,799.44 today;
- an administrative fee, sometimes the only charge on a variable-rate loan.

Rules differ by country. In the EU, compensation on consumer credit (not mortgages) is capped at 1 % of the amount repaid early, or 0.5 % if less than a year remains. In the US, a prepayment penalty on most home loans is allowed only on certain fixed-rate "qualified mortgages", only in the first three years, and at most 2 % and then 1 %. Many UK lenders let you overpay up to 10 % of the balance a year during a fixed period without a charge. Read the clause in *your* contract.

### The break-even
A penalty lowers the return on the prepayment. Paying ¤400 (2 %) to prepay ¤20,000, and lowering the payment by ¤131.99 for 20 years, earns 4.76 % a year instead of 5 %. If you sell the home two years later, the same ¤400 has only two years to be earned back and the return falls to 3.93 %. Compare that return with what the money could safely earn elsewhere, after tax.

### Before you prepay
1. Keep an [[emergency-fund|emergency fund]] outside the loan: money inside it cannot pay for a lost job.
2. Clear dearer debts first — cards, car loans, overdrafts ([[debt-payoff]]).
3. Where mortgage interest is tax-deductible, prepaying earns the after-tax rate, not the contract rate.
4. Count peace of mind. For many people a smaller debt is worth more than the last fraction of a percentage point.
`,
  ideas: [
    'A prepayment earns exactly the loan\'s interest rate, guaranteed, for as long as the money would have been owed.',
    'Shortening the loan and lowering the payment are worth the same at the loan\'s rate; they differ in cash flow and in the debt-free date.',
    'Penalties are a percentage, some months of interest, or the lender\'s lost interest when rates have fallen; the rules differ by country.',
    'A penalty lowers the return on prepaying, most of all if you will sell or refinance soon.',
    'Build a cushion and clear dearer debts before prepaying a cheap loan.'
  ],
  pitfalls: [
    'The option that "saves" the most interest is the best — Shortening shows the bigger saving only because you keep repaying faster; valued at the loan\'s rate, both options are worth the amount prepaid.',
    'Money prepaid can be taken back when I need it — Usually it can only be reached by borrowing again, if a lender agrees. Keep a cushion outside the loan.',
    'A penalty makes prepaying pointless — Often not: a 2 % penalty lowers a 5 % return to about 4.76 % over 20 years. It matters most when you will repay the whole loan soon anyway.'
  ],
  formulas: [
    {
      name: 'Lower payment after a prepayment',
      expr: 'D = L*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'D = L\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        D: { name: 'fall in the monthly payment', q: 'money', unit: '$' },
        L: { name: 'amount prepaid', q: 'money', unit: '$', value: 20000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'years left on the loan', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'When the lender keeps the end date and recalculates the payment. It is simply the level payment on the amount prepaid, over the remaining term.',
      practice: { unknowns: ['D', 'L'] },
      stories: {
        D: 'You prepay {L} on a loan at {r} with {T} left, keeping the end date. By how much does the monthly payment fall?',
        L: 'You want your payment on a loan at {r} with {T} left to fall by {D}. How much must you prepay?'
      }
    },
    {
      name: 'A penalty of some months of interest',
      expr: 'F = L*(r/12)*m', tex: 'F = L\\,\\frac{r}{12}\\,m',
      vars: {
        F: { name: 'penalty', q: 'money', unit: '$' },
        L: { name: 'amount repaid early', q: 'money', unit: '$', value: 20000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5 },
        m: { name: 'months of interest charged', int: true, value: 3, min: 1 }
      },
      stories: { F: 'Your contract charges {m} months of interest on any amount repaid early. You repay {L} of a loan at {r}. What is the penalty?' }
    },
    {
      name: 'Return on a prepayment after a penalty',
      expr: 'L*(1 + f) = D*(1 - (1 + y/12)^(-12*T))/(y/12)',
      tex: 'L\\,(1 + f) = D\\,\\frac{1 - (1 + y/12)^{-12T}}{y/12}',
      vars: {
        y: { name: 'return on the prepayment (yearly)', q: 'ratio', unit: '%', min: 0.01, max: 100 },
        L: { name: 'amount prepaid', q: 'money', unit: '$', value: 20000 },
        f: { name: 'penalty, as a share of the amount', q: 'ratio', unit: '%', value: 2, min: 0, max: 50 },
        D: { name: 'fall in the monthly payment', q: 'money', unit: '$', value: 131.99 },
        T: { name: 'years left on the loan', q: 'years', unit: 'yr', value: 20 }
      },
      solveFor: 'y',
      note: 'You pay the prepayment and the penalty now, and receive a lower payment every month until the end. Without a penalty the return is the loan\'s rate (5 % here); the 2 % penalty lowers it to 4.76 %.',
      practice: { unknowns: ['y'] },
      stories: { y: 'You prepay {L} and pay a penalty of {f} of it; your payment falls by {D} a month for {T}. What yearly return does the prepayment earn?' }
    }
  ],
  examples: [
    {
      title: 'Shorten or lower?',
      q: '¤250,000 at 5 % over 25 years. After five years you prepay ¤20,000. What happens if the lender shortens the loan, and if it lowers the payment instead?',
      steps: [
        'Balance after 60 payments: ¤221,450.47; after the prepayment ¤201,450.47, with 240 months left.',
        { text: 'Lower the payment: the new level payment over 240 months is', tex: 'M = 201\\,450.47 \\times \\frac{0.0041667}{1 - 0.36864} = ¤1{,}329.48' },
        'That is ¤131.99 a month less; interest over the life falls by ¤11,677.88.',
        'Shorten: keeping ¤1,461.48 a month, the ¤201,450.47 is repaid in 206 more payments instead of 240 — the loan ends 34 months early and ¤30,549.29 less interest is paid.',
        'Both are worth ¤20,000 at the loan\'s rate: the difference in "interest saved" reflects the faster repayment, not a better deal.'
      ],
      a: 'Lower payment: ¤1,329.48 a month, ¤11,677.88 less interest. Shorter loan: ends 34 months early, ¤30,549.29 less interest.'
    },
    {
      title: 'Is a 2 % penalty worth paying?',
      q: 'Prepaying the ¤20,000 costs a 2 % penalty (¤400), and the payment falls by ¤131.99 for 20 years. What return does the prepayment earn — and what if you sell the home two years later?',
      steps: [
        'You pay ¤20,400 now and receive ¤131.99 a month for 240 months.',
        'The rate that balances them is 4.76 % a year (without the penalty it would be exactly 5 %).',
        'If you sell after two years you receive 24 × ¤131.99 plus a balance ¤18,774.51 lower at the sale. The balancing rate is 3.93 %.',
        'So the prepayment beats savings earning less than about 4.76 % after tax if you stay — but only those earning under 3.93 % if you sell in two years.'
      ],
      a: '4.76 % a year if you keep the loan; 3.93 % if you sell after two years.'
    }
  ],
  quiz: [
    { q: 'Your loan charges 6 % and has no penalty. Prepaying ¤1,000 earns you, in effect…', choices: ['nothing, the money is gone', 'a guaranteed 6 % a year on the ¤1,000', 'the stock market\'s return', '6 % only if you shorten the loan'], a: 1,
      why: 'Every unit prepaid stops costing 6 % for as long as it would have been owed, whichever way the lender applies it.' },
    { q: 'You prepay ¤10,000 on a loan at 6 %; the penalty is three months of interest on the amount repaid. How much is the penalty?', answer: 150, unit: '$',
      why: '10,000 × 0.06 / 12 × 3 = ¤150.' },
    { q: 'Shortening the loan saves more interest than lowering the payment, so it is always the better way to apply a prepayment.', a: false,
      why: 'Valued at the loan\'s rate both are worth the amount prepaid. Lowering the payment gives more room in the budget; shortening gives an earlier end. Choose by need.' },
    { q: 'What is usually wise to do before prepaying a mortgage?', choices: ['borrow on a credit card to prepay more', 'build an emergency fund and clear dearer debts', 'wait for rates to rise', 'switch to an interest-only loan'], a: 1,
      why: 'Money in the mortgage cannot pay for an emergency, and a card at 20 % costs far more than a mortgage at 5 %: those come first.' }
  ],
  applications: ['Deciding what to do with a bonus, an inheritance or savings beyond your cushion.', 'Reading the early-repayment clause of a mortgage before signing.', 'Choosing between a shorter loan and a lower payment after a prepayment.'],
  sim: 'lb-prepay'
},

/* ================================================================ REFINANCING */
{
  id: 'refinancing', parent: 'loan-basics', title: 'Refinancing', level: 2,
  short: 'Replacing a loan with a new one — for a lower rate, a different term or a fixed rate. It pays when the interest saved outlasts the costs; stretching the term to lower the payment can quietly make it far more expensive.',
  keywords: ['refinancing', 'refinance', 'remortgage', 'switching lender', 'break-even', 'closing costs', 'cash-out refinance', 'debt consolidation', 'rate and term', 'lower payment'],
  prereq: ['amortization', 'loan-comparison', 'early-repayment'],
  related: ['apr', 'fixed-rate-mortgages', 'variable-rate-mortgages', 'mortgage-costs', 'debt-payoff', 'monetary-policy'],
  body: `
Refinancing means taking a new loan to pay off an old one — usually for a lower rate, sometimes to change the term, to switch from a variable to a fixed rate, or to merge several debts. It is one of the few financial moves where an afternoon of paperwork can be worth tens of thousands. It can also quietly make a loan more expensive. The difference lies in three numbers: the rate gap, the costs, and the time left.

### A lower rate, the same term
You owe ¤200,000 with 20 years left at 6 %, paying ¤1,432.86 a month. A lender offers 5 %, with ¤4,000 of costs — fees, valuation, legal work, and any penalty on the old loan. Over the same 20 years the new payment is ¤1,319.91, ¤112.95 less.

How long until the costs are recovered? The usual answer divides the costs by the payment saving: ¤4,000 / ¤112.95 ≈ 35 months. But the lower rate also repays capital faster — after five years you would owe ¤166,909.73 instead of ¤169,799.20 — so counting payments alone undersells it. Count **interest** instead: one point less on ¤200,000 saves about ¤2,000 a year, and the costs are recovered in about two years (month 25 exactly). Over the full 20 years the refinance saves ¤23,108.15 after costs.

### The trap: a lower payment by stretching the term
The lender also offers 30 years at 5 %: the payment drops to ¤1,073.64, ¤359.22 less than today. Divide the costs by that and the break-even looks like 11 months. It is not. Counting the balance too, you are ahead only from month 27 to about year 15: the new loan's balance falls so slowly that the gap in what you owe soon outgrows the payment savings. Over the remaining life the interest *rises* from ¤143,886.91 to ¤186,511.57, and the loan costs ¤46,624.66 more, because you now owe the money for ten extra years. Stretching the term is a separate decision — sometimes a wise one when cash is tight — but it should never hide inside a refinance that is sold as "saving money".

> [!key] Compare a refinance at the same remaining term, over the time you expect to keep the loan, counting interest and costs. If you also want a lower payment, decide on the term by itself.

### Costs added to the loan
If the ¤4,000 is added to the new loan, you borrow ¤204,000 at 5 %: the payment is ¤1,346.31, only ¤86.55 below the old one, and you pay interest on the costs for 20 years.

### When it tends to make sense
- the rate gap is large compared with the costs, and many years remain;
- you expect to keep the loan well past the break-even;
- you want certainty: switching a variable rate to a fixed one is refinancing to reduce *risk*, and can be worth a slightly higher cost ([[fixed-rate-mortgages]]).

Be careful with **consolidation**. Moving card or car debt into a mortgage lowers the rate, but it can spread a three-year debt over 25 years — raising the total — and it turns unsecured debt into debt secured on your home. And **cash-out** refinancing, borrowing more against the home's value, is new borrowing: judge it as such.

Rules of thumb such as "refinance when rates fall by one point" ignore the loan's size, the costs and the time left. The calculation takes minutes: try both loans in [the offer comparison](#/tools/money/compare) or [the loan calculator](#/tools/money/loan).
`,
  ideas: [
    'A refinance pays when the interest saved over the time you keep the loan exceeds its costs.',
    'Counting interest, not payments, gives the true break-even: roughly the costs divided by (balance × rate gap) a year.',
    'Resetting to a longer term lowers the payment but can raise the lifetime cost by tens of thousands.',
    'Costs added to the loan are borrowed too, and cost interest for the whole term.',
    'Refinancing can also buy certainty — a fixed rate — or be a trap, when unsecured debt is moved onto your home.'
  ],
  pitfalls: [
    'If the new payment is lower, the refinance saves money — Not if the term was stretched: ¤200,000 moved from 20 years at 6 % to 30 years at 5 % lowers the payment by ¤359.22 and costs ¤46,624.66 more over the life.',
    'Refinance whenever rates fall by one point — A rule of thumb that ignores the size of the loan, the costs and the years left; a small loan near its end may never recover the costs.',
    'Costs rolled into the new loan are free — They are borrowed at the new rate and repaid, with interest, over the whole term.'
  ],
  formulas: [
    {
      name: 'Break-even counted on payments',
      expr: 'N = C/(12*(A - B))', tex: 'N = \\frac{C}{12\\,(A - B)}',
      vars: {
        N: { name: 'time until the costs are recovered', q: 'years', unit: 'mo' },
        C: { name: 'costs of refinancing', q: 'money', unit: '$', value: 4000 },
        A: { name: 'old monthly payment', q: 'money', unit: '$', value: 1432.86 },
        B: { name: 'new monthly payment', q: 'money', unit: '$', value: 1319.91 }
      },
      note: 'The quick answer — valid only at the same remaining term, and pessimistic even then. With a longer new term it is badly misleading.',
      practice: { unknowns: ['N'] },
      stories: { N: 'Refinancing costs {C} and lowers your payment from {A} to {B}, with the same end date. How long until the costs are recovered?' }
    },
    {
      name: 'Break-even counted on interest',
      expr: 'N = C/(L*(a - b))', tex: 'N = \\frac{C}{L\\,(a - b)}',
      vars: {
        N: { name: 'time until the costs are recovered', q: 'years', unit: 'mo' },
        C: { name: 'costs of refinancing', q: 'money', unit: '$', value: 4000 },
        L: { name: 'balance refinanced', q: 'money', unit: '$', value: 200000 },
        a: { name: 'old interest rate', q: 'ratio', unit: '%', value: 6 },
        b: { name: 'new interest rate', q: 'ratio', unit: '%', value: 5 }
      },
      note: 'The interest saved each year is about the balance times the rate gap. For the defaults this gives 24 months; the exact month-by-month answer is 25.',
      practice: { unknowns: ['N', 'b'] },
      stories: {
        N: 'You refinance {L} from {a} to {b}, paying {C} of costs. Roughly how long until the interest saved covers the costs?',
        b: 'Refinancing {L} at {a} would cost {C}, and you expect to move in {N}. What new rate would just break even by then?'
      }
    }
  ],
  examples: [
    {
      title: 'Same term, lower rate',
      q: '¤200,000 is owed with 20 years left at 6 %. A new loan at 5 % over 20 years costs ¤4,000. What is the break-even, and the saving over the life?',
      steps: [
        'Old payment ¤1,432.86; new payment $200\\,000 \\times 0.0041667/(1 - 0.36864) = ¤1{,}319.91$.',
        'Counted on payments: $4\\,000 / 112.95 = 35$ months.',
        'Counted on interest: about $200\\,000 \\times 0.01 = ¤2{,}000$ saved a year, so about 24 months; month by month, the costs are covered at month 25.',
        'Interest over 20 years: ¤143,886.91 old, ¤116,778.75 new. Saving after costs: $143\\,886.91 - 116\\,778.75 - 4\\,000 \\approx ¤23{,}108$.'
      ],
      a: 'The costs are recovered after about two years; the refinance saves about ¤23,108 over the life.'
    },
    {
      title: 'The 30-year reset',
      q: 'The same lender offers 30 years at 5 % instead. What happens to the payment and the lifetime cost?',
      steps: [
        'Payment: $200\\,000 \\times 0.0041667/(1 - 0.22383) = ¤1{,}073.64$, ¤359.22 below today.',
        'The payment rule suggests a break-even of $4\\,000/359.22 = 11$ months.',
        'Counting payments saved plus the difference in what is owed, minus the costs, you are ahead only from month 27 until about year 15.',
        'Interest over the new life is ¤186,511.57 against ¤143,886.91 left on the old loan.',
        'Lifetime: $143\\,886.91 - 186\\,511.57 - 4\\,000 = -¤46{,}624.66$ — a loss.'
      ],
      a: 'The payment falls by ¤359.22 a month, and the loan costs ¤46,624.66 more over its life.'
    }
  ],
  quiz: [
    { q: 'Refinancing costs ¤3,000 and lowers your payment by ¤100 a month, with the same end date. Counting payments only, how many months until the costs are recovered?', answer: 30, unit: 'mo',
      why: '3,000 / 100 = 30 months — and, counting interest, the true break-even is usually a little sooner.' },
    { q: 'If a refinance lowers your monthly payment, it saves you money.', a: false,
      why: 'A longer term lowers the payment and can raise the lifetime interest by far more than the rate cut saves.' },
    { q: 'Refinancing ¤200,000 from 6 % to 5 % at the same term costs ¤4,000. Why is the true break-even sooner than costs ÷ payment saving?', choices: ['the new lender refunds part of the costs', 'the lower rate also repays capital faster, so the interest falls more than the payment', 'inflation reduces the costs', 'the payment saving grows every month'], a: 1,
      why: 'At the lower rate more of each payment goes to capital, so the balance — and all future interest — falls faster than the payment difference alone shows.' },
    { q: 'Moving a credit-card balance into your mortgage…', choices: ['always lowers the total you pay', 'lowers the rate, but may raise the total and puts your home at stake', 'is not allowed anywhere', 'has no effect on the mortgage'], a: 1,
      why: 'The rate falls, but the debt may now be repaid over decades instead of years, and it is secured on your home.' }
  ],
  applications: ['Deciding whether a lower rate is worth the switching costs.', 'Spotting a refinance that lowers the payment by stretching the term.', 'Switching a variable-rate loan to a fixed one to reduce risk.'],
  sim: 'lb-refi'
},

/* ================================================================ INTEREST-ONLY AND BALLOON */
{
  id: 'balloon-interest-only', parent: 'loan-basics', title: 'Interest-only and balloon loans', level: 2,
  short: 'Loans that lower today\'s payment by leaving capital to be repaid later: interest-only loans repay nothing until the end, balloon loans leave a large final sum. They cost more interest and depend on the money being there when the bill comes.',
  keywords: ['interest-only', 'balloon payment', 'balloon loan', 'bullet loan', 'residual', 'payment shock', 'refinancing risk', 'bridging loan', 'buy-to-let', 'PCP'],
  prereq: ['amortization', 'how-loans-work', 'refinancing'],
  related: ['car-finance', 'bond-basics', 'variable-rate-mortgages', 'mortgage-affordability', 'financial-crises', 'property-leverage'],
  body: `
Most loans shrink as you pay them. Two kinds do not, or not fully: the **interest-only** loan, where each payment covers only the month's interest and the whole amount is repaid at the end, and the **balloon** loan, where the payments repay only part of the capital and leave a large final sum — the balloon. Both lower the payment today by moving repayment to later. That is their use, and their danger.

### Three ways to repay ¤300,000 at 5 % over 25 years
| | Monthly payment | Final payment | Total interest |
|---|---:|---:|---:|
| Amortizing (level payments) | ¤1,753.77 | ¤1,753.77 | ¤226,131.04 |
| Balloon of ¤90,000 (30 %) | ¤1,602.64 | ¤91,602.64 | ¤270,791.73 |
| Interest-only | ¤1,250.00 | ¤301,250.00 | ¤375,000.00 |

The interest-only payment is ¤503.77 lower each month — and after 25 years of payments you still owe every unit you borrowed. The total interest is higher not because the lender charges more but because the balance never falls: you rent the whole ¤300,000 for the whole time. An interest-only loan is exactly how a [[bond-basics|bond]] works: coupons along the way, the face value at the end.

### The formulas
Interest-only: $M = P\\,r/12$. With a balloon $B$ repaid alongside the last payment, only the rest is amortized:

$$M = \\left(P - B(1+i)^{-n}\\right)\\frac{i}{1-(1+i)^{-n}}, \\qquad i = \\frac{r}{12}$$

With $B = 0$ this is the ordinary [[amortization|level payment]]; with $B = P$ it becomes $P\\,i$, interest-only.

### Payment shock
Many loans are interest-only for a first period and amortize afterwards. On ¤300,000 at 5 %, ten years of interest-only followed by 15 years of repayment means the payment jumps from ¤1,250 to ¤2,372.38 — up 90 % overnight. If the rate has risen to 7 % by then, it becomes ¤2,696.48, up 116 %. The ratio of the amortizing payment to the interest-only one is $1/(1-(1+i)^{-n})$: the shorter the remaining term, the larger the shock.

### Refinancing risk
A balloon must be paid with money from somewhere: savings, the sale of the asset, or a new loan. That plan works while prices hold, rates stay reasonable and income is steady. When all three turn together — as in the US housing bust of 2007–2010, when many borrowers held interest-only and similar loans — borrowers who counted on refinancing found they could not, and some lost their homes ([[financial-crises]]).

### When they are used sensibly
- **Bridging loans**, repaid when one home is sold to pay for the next.
- **Investors** who expect rental income and a sale to repay the capital, and who accept the risk ([[property-leverage]]).
- **Car finance** with a guaranteed future value ([[car-finance]]): the balloon is what the car is expected to be worth.
- **Companies and governments**, whose [[bond-basics|bonds]] are interest-only loans refinanced again and again.

> [!warn] If you consider one, ask exactly where the final sum will come from, and what happens if that source fails. If the honest answer is "I will refinance", check the plan with a rate two or three points higher and a lower property or car value.
`,
  ideas: [
    'An interest-only payment is $P\\,r/12$: it never reduces the debt, so the whole amount is due at the end.',
    'A balloon loan amortizes only part of the capital; the rest is due as one large final payment.',
    'Lower payments now mean more interest in total, because the balance stays high for longer.',
    'When an interest-only period ends, the payment can jump by 90 % or more — more if rates have risen.',
    'The final sum depends on selling or refinancing at a good moment: that is the risk you carry.'
  ],
  pitfalls: [
    'Interest-only is cheaper because the payment is lower — The payment is lower because nothing is repaid; the total interest is far higher and the debt is still all there at the end.',
    'I can always refinance the balloon — Only if a lender will lend on the day it is due, at a rate you can afford, against an asset that has held its value. In a downturn all three can fail together.',
    'The payment after an interest-only period will be manageable because it is years away — The shorter remaining term makes it much larger than an amortizing payment would have been from the start.'
  ],
  formulas: [
    {
      name: 'Interest-only payment',
      expr: 'M = P*r/12', tex: 'M = P\\,\\frac{r}{12}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 300000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5 }
      },
      stories: {
        M: 'You borrow {P} interest-only at {r}. What is the monthly payment?',
        P: 'You can pay {M} a month. At {r}, how much can you borrow interest-only — knowing none of it will be repaid by the payments?'
      }
    },
    {
      name: 'Level payment with a balloon',
      expr: 'M = (P - B*(1 + r/12)^(-12*T))*(r/12)/(1 - (1 + r/12)^(-12*T))',
      tex: 'M = \\left(P - B\\,(1 + r/12)^{-12T}\\right)\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 300000 },
        B: { name: 'balloon due at the end', q: 'money', unit: '$', value: 90000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 25 }
      },
      note: 'The balloon is paid together with the last regular payment. With $B = 0$ this is the ordinary level payment; with $B = P$ it is interest-only.',
      practice: { unknowns: ['M', 'B'] },
      stories: {
        M: 'A loan of {P} at {r} over {T} leaves a balloon of {B} at the end. What is the monthly payment?',
        B: 'You borrow {P} at {r} over {T} and can pay {M} a month. How large a balloon will be left at the end?'
      }
    },
    {
      name: 'Payment shock after an interest-only period',
      expr: 'S = 1/(1 - (1 + r/12)^(-12*T))', tex: 'S = \\frac{1}{1 - (1 + r/12)^{-12T}}',
      vars: {
        S: { name: 'new payment ÷ interest-only payment' },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'years left to repay', q: 'years', unit: 'yr', value: 15 }
      },
      note: 'At 5 % with 15 years left the payment rises 1.9-fold. The shorter the time left, the larger the jump.',
      stories: { S: 'Your interest-only period ends with {T} left to repay at {r}. By what factor does the payment rise?' }
    }
  ],
  examples: [
    {
      title: 'What the lower payment costs',
      q: '¤300,000 at 5 % over 25 years: compare level payments, a ¤90,000 balloon and interest-only.',
      steps: [
        'Level: $(1 + 0.05/12)^{-300} = 0.28725$, $M = 300\\,000 \\times 0.0041667/0.71275 = ¤1{,}753.77$; interest ¤226,131.04.',
        'Balloon: the ¤90,000 is worth $90\\,000 \\times 0.28725 = ¤25{,}852.48$ today, so $M = (300\\,000 - 25\\,852.48) \\times 0.0041667/0.71275 = ¤1{,}602.64$; interest ¤270,791.73, with ¤91,602.64 due at the end.',
        'Interest-only: $300\\,000 \\times 0.05/12 = ¤1{,}250$; interest $300 \\times 1\\,250 = ¤375{,}000$, and ¤300,000 still due.'
      ],
      a: 'Payments of ¤1,753.77, ¤1,602.64 and ¤1,250; total interest ¤226,131.04, ¤270,791.73 and ¤375,000.'
    },
    {
      title: 'Ten years of interest only',
      q: '¤300,000 at 5 %, interest-only for 10 years, then repaid over 15. What is the payment after year 10 — and if the rate is then 7 %?',
      steps: [
        'First ten years: ¤1,250 a month, and the balance is still ¤300,000.',
        'Then $(1 + 0.05/12)^{-180} = 0.47310$, so $M = 300\\,000 \\times 0.0041667/0.52690 = ¤2{,}372.38$ — 90 % more.',
        'At 7 %: $(1 + 0.07/12)^{-180} = 0.35101$, $M = 300\\,000 \\times 0.0058333/0.64899 = ¤2{,}696.48$ — 116 % more.'
      ],
      a: 'The payment jumps from ¤1,250 to ¤2,372.38, or to ¤2,696.48 if rates have risen to 7 %.'
    }
  ],
  quiz: [
    { q: 'You borrowed ¤240,000 interest-only ten years ago and made every payment. How much do you owe now?', choices: ['nothing', 'about half', 'the full ¤240,000', 'it depends on the rate'], a: 2,
      why: 'Interest-only payments cover only the interest; none of the capital is repaid until the end.' },
    { q: 'What is the monthly interest-only payment on ¤240,000 at 6 %?', answer: 1200, unit: '$',
      why: '240,000 × 0.06 / 12 = ¤1,200.' },
    { q: 'At the same rate and term, a balloon loan costs less interest than a fully amortizing loan.', a: false,
      why: 'The balloon part is never repaid until the end, so interest is charged on it for the whole term: ¤270,791.73 against ¤226,131.04 in the example.' },
    { q: 'The main risk of a balloon or interest-only loan is…', choices: ['that the payment rises every month', 'having to repay or refinance a large sum at a time you do not choose', 'that the lender can cancel it at any time', 'that the interest is not tax-deductible'], a: 1,
      why: 'The final sum falls due on a fixed date; if property prices, rates or income have moved against you, selling or refinancing may be impossible or ruinous.' }
  ],
  applications: ['Understanding bridging loans, buy-to-let mortgages and balloon car finance.', 'Planning for the payment jump when an interest-only period ends.', 'Seeing why a bond is simply an interest-only loan.'],
  sim: 'lb-balloon'
},

/* ================================================================ CAR FINANCE */
{
  id: 'car-finance', parent: 'loan-basics', title: 'Car loans and leasing', level: 1,
  short: 'A car loses value while you pay for it. Cash, bank loans, dealer 0 % offers, balloon finance and leasing are different ways of paying for that loss plus interest — and long loans can leave you owing more than the car is worth.',
  keywords: ['car loan', 'auto loan', 'car finance', 'leasing', 'lease', 'PCP', 'personal contract purchase', 'hire purchase', '0 % finance', 'cash discount', 'negative equity', 'depreciation', 'money factor', 'residual value'],
  prereq: ['how-loans-work', 'amortization', 'balloon-interest-only'],
  related: ['apr', 'loan-comparison', 'good-and-bad-debt', 'household-budget', 'opportunity-cost'],
  body: `
A car is often the second-largest thing people borrow for, and it is unusual in one way: it loses value while you are paying for it. A ¤30,000 car might be worth ¤24,000 after a year and about half its price after four or five — the pace depends on the model and the market. Every way of paying for a car is a different way of paying for that loss plus interest.

### The main ways to pay
- **Cash**: no interest, but the money no longer earns anything or cushions emergencies ([[opportunity-cost]]).
- **A loan** from a bank or credit union: you own the car, often pledged to the lender until the loan is repaid.
- **Dealer finance**: convenient, sometimes subsidised by the manufacturer (0 % offers), sometimes the dearest option in the showroom.
- **Balloon finance** (in the UK, *personal contract purchase*, PCP): lower payments and a large final sum, usually set at a guaranteed future value. At the end you pay it, refinance it or hand the car back ([[balloon-interest-only]]).
- **Leasing**: you rent the car for a few years, paying for the value it loses plus a finance charge, within mileage and wear limits, then hand it back.

A balloon makes the payment look light: on a ¤30,000 car with ¤3,000 down, 7 % over four years and ¤12,000 left as the final sum, the payment is ¤429.19 instead of ¤646.55 — but the interest is ¤5,601.30 instead of ¤4,034.33, and the ¤12,000 is still to be found.

### 0 % or the cash discount?
A ¤30,000 car is offered at 0 % over 48 months (¤625 a month) *or* with ¤2,500 off for cash. The 0 % is not free: if the real price is ¤27,500, paying ¤30,000 over four years is borrowing at an implied 4.33 % a year. If your bank would lend at 6 %, borrowing ¤27,500 costs ¤645.84 a month, ¤31,000.24 in total — more than the dealer's ¤30,000, so here the 0 % wins. The discount would need to exceed ¤3,387.30 to change that. Settle the price first and the finance second, so that one cannot hide inside the other.

### Long loans and negative equity
Stretching ¤30,000 at 7 % from four years to seven lowers the payment from ¤718.39 to ¤452.78 but raises the interest from ¤4,482.59 to ¤8,033.55. Worse, the debt now falls more slowly than the car's value. If the car loses 20 % in its first year and 15 % a year after that, the seven-year loan owes more than the car is worth for four years: ¤26,557.58 against ¤24,000 after one year, ¤18,908.20 against ¤17,340 after three. That is **negative equity**. If the car is written off or must be sold, the insurance payout or the sale may not clear the loan — and the gap is often rolled into the next car loan.

### What a lease payment is made of
A lease charges roughly the value the car loses, spread over the months, plus interest on the money tied up in it. For a ¤30,000 car expected to be worth ¤16,500 after three years, at 6 %:

$$M \\approx \\frac{C - R}{n} + (C + R)\\,\\frac{r}{24} = ¤375 + ¤116.25 = ¤491.25$$

The exact annuity value is ¤493.20, before taxes and fees. In the US the finance part is quoted as a *money factor*, the rate divided by 2,400 — here 0.0025.

> [!tip] Before visiting a dealer, get a loan quote from your own bank. Then compare total costs — the price, the interest, the fees, and the add-ons (extended warranties, insurance, protection packages) that are easy to roll into the finance and then pay interest on for years.
`,
  ideas: [
    'A car loses value while you pay for it; every way of paying is a way of paying for that loss plus interest.',
    'A 0 % offer against a cash discount has a hidden rate: compare it with what your bank would charge.',
    'Long car loans lower the payment, raise the interest and leave you owing more than the car is worth for years.',
    'A lease payment is about the depreciation per month plus interest on the average value tied up in the car.',
    'Negotiate the price and the finance separately, with your own loan quote in hand.'
  ],
  pitfalls: [
    'The monthly payment is what matters — A dealer can meet any payment by stretching the term or adding a balloon; compare the price and the total cost.',
    '0 % finance means the loan is free — If paying cash would earn a discount, the 0 % offer costs you that discount: an implied rate of 4.33 % in the example.',
    'Leasing is always cheaper because the payment is lower — You pay for the car\'s best years of depreciation and own nothing at the end; mileage and wear charges can add more.'
  ],
  formulas: [
    {
      name: 'Lease payment (depreciation plus finance charge)',
      expr: 'M = (C - R)/(12*T) + (C + R)*r/24', tex: 'M = \\frac{C - R}{12\\,T} + (C + R)\\,\\frac{r}{24}',
      vars: {
        M: { name: 'monthly lease payment', q: 'money', unit: '$' },
        C: { name: 'price of the car (capitalised cost)', q: 'money', unit: '$', value: 30000 },
        R: { name: 'residual value at the end', q: 'money', unit: '$', value: 16500 },
        T: { name: 'length of the lease', q: 'years', unit: 'yr', value: 3 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 6 }
      },
      note: 'The usual approximation: interest on the average of the price and the residual. It is within a few units of the exact annuity, before taxes and fees.',
      practice: { unknowns: ['M', 'R'] },
      stories: {
        M: 'A car costing {C} is leased for {T} with a residual value of {R}, at {r}. About how much is the monthly payment?',
        R: 'A lease on a car costing {C} for {T} at {r} is quoted at {M} a month. What residual value does it assume?'
      }
    },
    {
      name: 'The rate hidden in a 0 % offer',
      expr: 'P - D = P/(12*T)*(1 - (1 + a/12)^(-12*T))/(a/12)',
      tex: 'P - D = \\frac{P}{12T}\\,\\frac{1 - (1 + a/12)^{-12T}}{a/12}',
      vars: {
        a: { name: 'implied yearly rate', q: 'ratio', unit: '%', min: 0.01, max: 100 },
        P: { name: 'list price, paid in 0 % instalments', q: 'money', unit: '$', value: 30000 },
        D: { name: 'discount offered for cash', q: 'money', unit: '$', value: 2500 },
        T: { name: 'length of the 0 % plan', q: 'years', unit: 'yr', value: 4 }
      },
      solveFor: 'a',
      note: 'Taking the 0 % plan means giving up the discount: in effect you borrow the cash price and repay the list price. If your own lender charges less than $a$, take the discount and borrow there.',
      practice: { unknowns: ['a'] },
      stories: { a: 'A car costs {P} at 0 % over {T}, or {D} less for cash. What interest rate is hidden in the 0 % offer?' }
    }
  ],
  examples: [
    {
      title: '0 % or ¤2,500 off?',
      q: 'A ¤30,000 car: 0 % over 48 months, or ¤2,500 off for cash. Your bank lends at 6 %. Which is cheaper?',
      steps: [
        '0 % plan: $30\\,000/48 = ¤625$ a month, ¤30,000 in total.',
        'Discount and a bank loan: borrow ¤27,500 at 6 %; $(1.005)^{-48} = 0.78710$, $M = 27\\,500 \\times 0.005/0.21290 = ¤645.84$, ¤31,000.24 in total.',
        'The 0 % plan is ¤1,000.24 cheaper. Its implied rate — the rate at which ¤625 × 48 repays ¤27,500 — is 4.33 %, below the bank\'s 6 %.',
        'At 6 %, the 48 payments of ¤625 are worth ¤26,612.70 today, so a cash discount above $30\\,000 - 26\\,612.70 = ¤3{,}387.30$ would win.'
      ],
      a: 'The 0 % plan: it costs ¤30,000 against ¤31,000.24; its hidden rate is 4.33 %.'
    },
    {
      title: 'Seven years, and negative equity',
      q: '¤30,000 borrowed at 7 % for a car. Compare 4 and 7 years, and check the 7-year balance against the car\'s value if it loses 20 % in year one and 15 % a year after.',
      steps: [
        '4 years: $M = ¤718.39$, interest ¤4,482.59. 7 years: $M = ¤452.78$, interest ¤8,033.55.',
        'Car value: ¤24,000 after 1 year, ¤20,400 after 2, ¤17,340 after 3, ¤14,739 after 4.',
        '7-year balance: ¤26,557.58, ¤22,866.31, ¤18,908.20, ¤14,663.96 — more than the car is worth for the first four years.',
        'The 4-year loan owes ¤23,266.03 after one year, already below the car\'s value.'
      ],
      a: 'The 7-year loan costs ¤3,550.96 more interest and stays underwater for four years.'
    }
  ],
  quiz: [
    { q: 'You owe ¤18,000 on a car worth ¤15,000. This is called…', choices: ['a balloon', 'negative equity', 'a residual value', 'depreciation'], a: 1,
      why: 'Negative equity means the debt is larger than the asset is worth; selling the car would not clear the loan.' },
    { q: 'A ¤18,000 car is sold at 0 % over 36 months. What is the monthly payment?', answer: 500, unit: '$',
      why: 'With no interest the payment is simply 18,000 / 36 = ¤500.' },
    { q: 'A 0 % dealer offer is always the cheapest way to buy the car.', a: false,
      why: 'If a cash discount is available instead, the 0 % plan costs you that discount; compare its hidden rate with what your own lender charges.' },
    { q: 'For a new car, the biggest single cost of the first few years of ownership is usually…', choices: ['fuel', 'depreciation', 'insurance', 'the loan fee'], a: 1,
      why: 'A new car typically loses a large share of its value in its first years — often more than all the running costs together.' }
  ],
  applications: ['Choosing between a 0 % offer and a cash discount.', 'Understanding balloon car finance and leases before signing.', 'Avoiding negative equity by keeping car loans short.'],
  sim: { id: 'lb-balloon', params: { P: 27000, r: 7, T: 4, B: 12000 } }
},

/* ================================================================ HIGH-COST CREDIT */
{
  id: 'high-cost-credit', parent: 'loan-basics', title: 'Payday loans, buy-now-pay-later and other costly credit', level: 1,
  short: 'Credit sold by the size of a fee rather than a rate — payday loans, late fees on split payments, overdraft charges, rent-to-own. Turned into yearly rates they reach hundreds or thousands of per cent. The numbers, the rules and the warning signs.',
  keywords: ['payday loan', 'buy now pay later', 'BNPL', 'late fee', 'rollover', 'short-term loan', 'overdraft fee', 'rent-to-own', 'title loan', 'loan shark', 'usury', 'APR', 'predatory lending', 'debt trap'],
  prereq: ['apr', 'how-loans-work', 'effective-rate'],
  related: ['credit-cards', 'debt-payoff', 'emergency-fund', 'scams-fraud', 'present-bias', 'money-anxiety'],
  body: `
Some credit is sold by the size of a fee rather than a rate: "¤15 per ¤100 borrowed", "four interest-free payments", "only ¤15 a week". The amounts feel small because they are quoted over days or weeks. Turned into a yearly rate — the one number that lets you compare — they are among the most expensive money anywhere. The people who use them are rarely careless; they are usually short of cash, time and options, and these products are built for exactly that moment. Knowing the numbers is the best protection.

### Payday loans
A typical payday loan charges a fee of ¤15 for every ¤100, repaid on the next payday, two weeks later. As a yearly rate:

$$\\text{APR} = \\frac{F}{P}\\cdot\\frac{365}{d} = 0.15 \\times \\frac{365}{14} = 391\\,\\%$$

And that is the nominal figure. If the loan is rolled over — the fee paid, the debt carried to the next payday — the cost compounds: $(1.15)^{365/14} - 1 \\approx 3{,}724\\,\\%$ a year. In practice the harm is easier to see. Borrow ¤400, pay ¤60 every two weeks to roll it over, and after five rollovers you have paid ¤360 in fees and still owe the whole ¤400. Instalment versions spread the cost but not the price: ¤1,000 repaid in 12 fortnightly payments of ¤133.33 (¤1,600 in all) has an APR of 210 %.

### Buy now, pay later
Splitting a ¤200 purchase into four payments of ¤50 every two weeks, with no interest, costs nothing — if every payment is on time. A single ¤10 late fee changes that: the ¤150 of credit now costs ¤10 over six weeks, an APR of 85 % (132 % effective). Two late fees make it 172 %. The larger risk is quieter: several plans with several shops, each small, together more than a budget can carry — and in some countries missed payments now reach your credit report.

### The rest of the family
| Product | Example | Yearly rate |
|---|---|---:|
| Overdraft fee | ¤35 for going ¤20 over for 5 days | 12,775 % |
| Rent-to-own | a ¤500 TV for 78 weekly payments of ¤15 | 135 % |
| Car-title loan | 25 % a month, the car as security | 300 % |

Illegal lenders — loan sharks — add threats to the price.

### Rules differ
In the UK, high-cost short-term credit has been capped since 2015: interest and fees at 0.8 % a day, default fees at £15, and the total cost at 100 % of the amount borrowed. In the US the rules are set state by state — some cap small loans at about 36 % a year, others allow payday fees — and a federal 36 % cap protects active-duty service members. Many EU countries set usury ceilings. Buy-now-pay-later has been lightly regulated in many places, and the rules are changing.

### Warning signs
- the price is quoted per ¤100, per week or per item — **never as an APR**;
- "no credit check", "guaranteed approval", or pressure to sign today;
- a fee to be paid *before* you receive the money — usually a [[scams-fraud|scam]];
- access to your bank account, or post-dated cheques, as security;
- offers to "roll over" or "top up" instead of repaying;
- borrowing to pay another debt.

> [!note] If you are already in the cycle, you are not alone, and it can be broken. Stop the rollovers, list every debt with its rate, ask each lender for a repayment plan, and get free, independent debt advice — most countries have non-profit services. Even a small [[emergency-fund|cushion]] of a few hundred is the best protection against the next emergency becoming the next loan.
`,
  ideas: [
    'A short-term fee becomes a yearly rate by multiplying by the number of such periods in a year: ¤15 per ¤100 for 14 days is a 391 % APR.',
    'Rolling a loan over pays the full fee again without reducing the debt; compounded, the yearly cost runs into thousands of per cent.',
    'Interest-free split payments are free only when every payment is on time; late fees turn them into very expensive credit.',
    'Rules differ widely: the UK caps high-cost short-term credit, the US regulates it state by state.',
    'The warning signs — prices quoted per ¤100 or per week, up-front fees, rollovers, pressure — are visible before you sign.'
  ],
  pitfalls: [
    'It is only ¤15 — ¤15 on ¤100 for two weeks is a 391 % APR, and it is paid again every time the loan is rolled over.',
    'Rolling over just gives me more time — Each rollover costs a full new fee and repays nothing: after five rollovers of ¤400, ¤360 of fees are paid and ¤400 is still owed.',
    'Buy-now-pay-later is not really debt — It is credit: missed payments bring fees, can reach your credit report, and several small plans add up to one large commitment.'
  ],
  formulas: [
    {
      name: 'APR of a short-term fee',
      expr: 'A = F/P*365/d', tex: 'A = \\frac{F}{P}\\cdot\\frac{365}{d}',
      vars: {
        A: { name: 'APR (nominal)', q: 'ratio', unit: '%' },
        F: { name: 'fee', q: 'money', unit: '$', value: 15 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 100 },
        d: { name: 'length of the loan in days', int: true, value: 14, min: 1 }
      },
      note: 'The nominal yearly rate, as US lenders must quote it. It does not count compounding when the loan is rolled over.',
      practice: { unknowns: ['A', 'F'] },
      stories: {
        A: 'A lender charges {F} for every {P} borrowed, repaid after {d} days. What is the APR?',
        F: 'A short-term loan of {P} for {d} days is advertised at an APR of {A}. How large is the fee?'
      }
    },
    {
      name: 'Effective yearly cost when a fee repeats',
      expr: 'E = (1 + F/P)^(365/d) - 1', tex: 'E = \\left(1 + \\frac{F}{P}\\right)^{365/d} - 1',
      vars: {
        E: { name: 'effective yearly cost', q: 'ratio', unit: '%' },
        F: { name: 'fee per period', q: 'money', unit: '$', value: 15 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 100 },
        d: { name: 'days per period', int: true, value: 14, min: 1 }
      },
      note: 'The cost if the loan is rolled over all year, each fee counted as borrowed too. It is what the EU and UK APRC measures.',
      practice: { unknowns: ['E'] },
      stories: { E: 'A loan of {P} costs {F} every {d} days and is rolled over all year. What is the effective yearly cost?' }
    }
  ],
  examples: [
    {
      title: 'The fortnight fee as a yearly rate',
      q: 'A payday lender charges ¤15 per ¤100 for 14 days. What are the APR and the effective yearly cost? What do five rollovers of a ¤400 loan cost?',
      steps: [
        { text: 'Nominal APR: the fee rate times the number of 14-day periods in a year,', tex: 'A = 0.15 \\times \\frac{365}{14} = 3.911 = 391\\,\\%' },
        { text: 'Effective, if rolled over all year:', tex: 'E = 1.15^{365/14} - 1 = 38.24 - 1 = 3\\,724\\,\\%' },
        'A ¤400 loan costs ¤60 per fortnight. The first loan and five rollovers make six fees: ¤360, and the ¤400 is still owed.'
      ],
      a: '391 % APR (3,724 % effective); ¤360 of fees for a ¤400 loan after five rollovers.'
    },
    {
      title: 'One late fee on a split payment',
      q: 'A ¤200 purchase is split into four payments of ¤50, at purchase and every two weeks. One payment is late and a ¤10 fee is added. What is the APR of this credit?',
      steps: [
        'At the start you pay ¤50, so the credit is ¤150.',
        'You repay ¤50 at week 2, ¤60 at week 4 (with the fee) and ¤50 at week 6.',
        'The weekly rate that balances ¤150 against these payments is 1.63 %.',
        'Yearly: $1.63\\,\\% \\times 52 = 85\\,\\%$ nominal; $(1.0163)^{52} - 1 = 132\\,\\%$ effective.'
      ],
      a: 'About 85 % APR (132 % effective) — from one ¤10 fee.'
    }
  ],
  quiz: [
    { q: 'A lender charges ¤20 per ¤100 for 30 days. What is the nominal APR, in per cent?', answer: 243.3, unit: '%',
      why: '20 % × 365 / 30 = 243.3 %.' },
    { q: 'A buy-now-pay-later plan with no interest costs nothing, whatever happens.', a: false,
      why: 'It is free only if every payment is on time. Late fees on small amounts over a few weeks are very expensive credit — one ¤10 fee on ¤150 for six weeks is about 85 % APR.' },
    { q: 'Which is the clearest sign of a loan scam?', choices: ['an APR shown in large print', 'a fee you must pay before the money is released', 'a credit check', 'a written contract'], a: 1,
      why: 'Legitimate lenders take their fees from the loan or with the repayments; demanding money first is the classic advance-fee fraud.' },
    { q: 'You borrow ¤400 with a ¤60 fee, roll the loan over three times paying ¤60 each time, then repay the ¤400. How much have you paid in fees?', answer: 240, unit: '$',
      why: 'The original fee plus three rollover fees: 4 × ¤60 = ¤240, for the use of ¤400 for eight weeks.' },
    { q: 'Why are payday fees usually quoted per ¤100 rather than as a yearly rate?', choices: ['because the law forbids APRs on short loans', 'because a fee for two weeks looks small, while the yearly rate reveals the cost', 'because the fee is not interest', 'because APRs only apply to mortgages'], a: 1,
      why: 'Quoting over a short period makes the price feel small; the APR puts it on the same scale as every other loan — which is why many countries require it.' }
  ],
  applications: ['Recognising expensive credit before signing.', 'Explaining the numbers to a friend or relative considering a payday loan.', 'Choosing a safer way through a cash emergency — a repayment plan, a community lender, a small cushion.'],
  sim: 'lb-payday'
}

);
