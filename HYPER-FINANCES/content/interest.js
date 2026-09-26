/* HYPER-FINANCES · content/interest.js — the price of money in time: simple interest,
 * compound interest, how often it compounds, and the rule of 72. */
Hyper.add(

{
  id: 'simple-interest', parent: 'interest', title: 'Simple interest', level: 1,
  short: 'Interest is the price of using someone else\'s money for a time. Simple interest is paid on the original amount only, so it grows in a straight line: the same sum every year.',
  keywords: ['simple interest', 'interest', 'principal', 'interest rate', 'flat rate', 'add-on interest', 'day count', 'accrued interest', 'coupon', 'payday loan', 'I = Prt'],
  prereq: ['what-is-money', 'math:percentages', 'math:linear-functions'],
  related: ['compound-interest', 'apr', 'car-finance', 'high-cost-credit', 'term-deposits', 'bond-basics'],
  body: `
Lend a friend ¤1,000 for two years and agree on 5 % a year. Each year the use of your money is worth ¤50 to them, so after two years they return ¤1,100. That ¤50 a year is **interest**: the price of using someone else's money for a time. The lender is paid for waiting, for the risk of not being repaid, and for the purchasing power that [[inflation-purchasing-power|inflation]] will take in the meantime.

### The formula
When interest is charged on the original amount (the **principal**) only, it is **simple interest**:

$$I = P\\,r\\,t, \\qquad A = P\\,(1 + r\\,t)$$

with the yearly rate $r$ as a fraction (5 % = 0.05) and the time $t$ in years. The amount grows in a straight line — the same ¤50 every year — so doubling the time doubles the interest, and money doubles after $1/r$ years: 20 years at 5 %.

### Where it is really used
- **Short periods.** Interest for part of a year is simple: ¤5,000 for 90 days at 4 % earns $5{,}000 \\times 0.04 \\times 90/365 = ¤49.32$. Banks and markets differ on the *day count* — dividing by 365, by 360, or by the actual days in the year — which is why two "4 %" deposits can pay slightly different amounts.
- **Interest that is paid out.** A [[term-deposits|term deposit]] that pays its interest into your current account every year, or a [[bond-basics|bond]] paying a fixed coupon, gives simple interest if you spend the payments. Reinvest them and the interest starts earning interest — that is [[compound-interest]].
- **Accrued interest** on deposits and loans between payment dates.

### The flat-rate trap
Some car dealers and consumer lenders quote a **flat** (or *add-on*) rate: the interest is computed on the full amount borrowed for the whole term, even though you repay part of the debt every month. Borrow ¤10,000 at "5 % flat" over 3 years: the interest is $10{,}000 \\times 0.05 \\times 3 = ¤1{,}500$, and you pay $11{,}500/36 = ¤319.44$ a month. But the balance falls all the time, so on average you owe only about half the loan. The rate that the same payments really represent is about **9.3 % a year** — nearly double the headline. That is why regulators in many countries require lenders to show an [[apr|APR]], and why a flat rate should always be converted before comparing ([[car-finance]]).

> [!warn] A flat rate is roughly half the true rate of an instalment loan. Always ask for the APR, or put the payment, the term and the amount into [the loan calculator](#/tools/money/loan).

### Short, expensive credit
A fee of ¤15 for every ¤100 borrowed for two weeks sounds modest. As simple interest it is 15 % per two weeks — about 390 % a year (26 two-week periods). If the loan is rolled over again and again, the fees compound, and the cost of a year of borrowing becomes thousands of per cent. See [[high-cost-credit]].

### Simple or compound?
Simple interest is the building block: over one period, simple and compound interest are identical. They part ways when interest is left in to earn more interest. The simulation below races them against each other; the gap between the two curves is the "interest on interest" that makes long-term saving, and long-term debt, so powerful.
`,
  ideas: [
    'Interest is the price of using money for a time: a reward for waiting, risk and inflation.',
    'Simple interest is paid on the principal only: I = P r t, a straight line in time.',
    'It is used for short periods and for interest that is paid out rather than reinvested.',
    'A flat (add-on) rate on an instalment loan is roughly half the true yearly cost.',
    'Over one period simple and compound interest agree; they diverge when interest stays in.'
  ],
  pitfalls: [
    'A 5 % flat-rate loan costs 5 % a year — Interest is charged on the whole loan even as you repay it; the true rate of the same payments is about 9.3 % over three years.',
    'Doubling the rate doubles the interest, so doubling the time must be worse — Under simple interest both double the interest exactly. Only with compounding does time become the stronger lever.',
    'All "4 %" deposits pay the same — Day-count conventions (365, 360 or actual days) and how often interest is credited change the amount slightly; compare the effective rate.'
  ],
  formulas: [
    {
      name: 'Simple interest',
      expr: 'I = P*r*t', tex: 'I = P\\,r\\,t',
      vars: {
        I: { name: 'interest', q: 'money', unit: '$' },
        P: { name: 'principal (amount lent or borrowed)', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 1000 },
        t: { name: 'time', q: 'years', unit: 'yr', value: 2 }
      },
      note: 'Choose months or days for $t$ in the unit menu; the formula receives years.',
      practice: { unknowns: ['I', 'r', 't'] },
      stories: {
        I: 'You lend {P} for {t} at {r} a year simple interest. How much interest do you earn?',
        r: 'A loan of {P} for {t} costs {I} of simple interest. What is the yearly rate?',
        t: 'At {r} a year simple interest, how long does it take {P} to earn {I}?'
      }
    },
    {
      name: 'Amount with simple interest',
      expr: 'A = P*(1 + r*t)', tex: 'A = P\\,(1 + r\\,t)',
      vars: {
        A: { name: 'amount at the end', q: 'money', unit: '$' },
        P: { name: 'principal', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 1000 },
        t: { name: 'time', q: 'years', unit: 'yr', value: 2 }
      },
      practice: { unknowns: ['A', 'P'] },
      stories: {
        A: 'You deposit {P} for {t} at {r} simple interest. How much do you have at the end?',
        P: 'How much must you deposit at {r} simple interest to have {A} after {t}?'
      }
    },
    {
      name: 'Interest for a number of days',
      expr: 'I = P*r*d/D', tex: 'I = P\\,r\\,\\frac{d}{D}',
      vars: {
        I: { name: 'interest', q: 'money', unit: '$' },
        P: { name: 'principal', q: 'money', unit: '$', value: 5000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 4, min: 0.001, max: 1000 },
        d: { name: 'days', int: true, value: 90 },
        D: { name: 'days in the year by convention (365 or 360)', int: true, value: 365, fixed: true }
      },
      note: 'Set $D$ = 360 to see the money-market convention used for many loans and deposits: it pays slightly more for the same quoted rate.',
      practice: { unknowns: ['I'] },
      stories: { I: 'A deposit of {P} earns {r} a year for {d} days (a {D}-day year). How much interest does it earn?' }
    },
    {
      name: 'Monthly payment on a flat-rate loan',
      expr: 'M = P*(1 + r*T)/(12*T)', tex: 'M = \\frac{P\\,(1 + r\\,T)}{12\\,T}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 10000 },
        r: { name: 'flat (add-on) rate per year', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 200 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 3 }
      },
      note: 'The interest is charged on the full amount for the whole term. To see the true yearly cost, enter the same payment in the level-payment formula on [[amortization]] and solve for the rate.',
      practice: { unknowns: ['M'] },
      stories: { M: 'A dealer offers {P} over {T} at a flat rate of {r}. What is the monthly payment?' }
    }
  ],
  examples: [
    {
      title: 'A loan between friends',
      q: 'You lend a friend ¤1,000 for 2 years at 5 % simple interest. How much do they repay, and how long would it take the money to double at this rate?',
      steps: [
        'Interest: $I = 1{,}000 \\times 0.05 \\times 2 = ¤100$.',
        'Repaid: $A = 1{,}000 + 100 = ¤1{,}100$.',
        'Doubling needs $I = P$, so $r\\,t = 1$ and $t = 1/0.05 = 20$ years.'
      ],
      a: '¤1,100; money doubles in 20 years under simple interest at 5 %.'
    },
    {
      title: 'Unmasking a flat rate',
      q: 'A car loan of ¤10,000 over 3 years is offered at "5 % flat". What is the monthly payment, and what yearly rate do those payments really represent?',
      steps: [
        'Interest: $10{,}000 \\times 0.05 \\times 3 = ¤1{,}500$; total repaid ¤11,500.',
        'Payment: $11{,}500 / 36 = ¤319.44$ a month.',
        'Find the monthly rate $i$ at which 36 payments of ¤319.44 repay ¤10,000 (the level-payment formula, solved numerically): $i = 0.776\\,\\%$.',
        'Yearly: $12 \\times 0.776\\,\\% = 9.31\\,\\%$ nominal, or $1.00776^{12} - 1 = 9.72\\,\\%$ effective.'
      ],
      a: '¤319.44 a month; the true cost is about 9.3 % a year — almost double the "5 %".'
    },
    {
      title: 'Ninety days on deposit',
      q: '¤5,000 is placed for 90 days at 4 % a year. How much interest does it earn with a 365-day year, and with a 360-day year?',
      steps: [
        '365-day year: $5{,}000 \\times 0.04 \\times 90/365 = ¤49.32$.',
        '360-day year: $5{,}000 \\times 0.04 \\times 90/360 = ¤50.00$.'
      ],
      a: '¤49.32 or ¤50.00, depending on the day-count convention.'
    }
  ],
  quiz: [
    { q: 'How much simple interest does ¤2,000 earn in 3 years at 4 % a year?', answer: 240, unit: '$',
      why: 'I = P r t = 2,000 × 0.04 × 3 = ¤240.' },
    { q: 'Under simple interest, how long does money take to double at 5 % a year?', answer: 20, unit: 'yr',
      why: 'Doubling means the interest equals the principal: r t = 1, so t = 1/0.05 = 20 years. (With compounding it takes about 14.2.)' },
    { q: 'A loan is quoted at "6 % flat" over 5 years with monthly payments. Its true yearly rate is…', choices: ['exactly 6 %', 'a little under 6 %', 'nearly twice 6 %', 'six times 6 %'], a: 2,
      why: 'Interest is charged on the full amount for five years, though on average you owe only about half of it. The same payments correspond to about 10.8 % a year.' },
    { q: 'A lender charges ¤15 per ¤100 borrowed for two weeks. Roughly what simple yearly rate is that?', choices: ['15 %', '30 %', 'about 390 %', 'about 1.5 %'], a: 2,
      why: '15 % per two weeks, and there are 26 two-week periods in a year: 26 × 15 % = 390 %. Rolled over and compounded it is far more.' },
    { q: 'Over a single period, simple and compound interest give the same amount.', a: true,
      why: 'Compounding only matters once interest has been added and starts earning interest itself — from the second period on.' }
  ],
  applications: ['Interest on short deposits, bills and loans of less than a year.', 'Bond coupons and deposit interest that is paid out.', 'Spotting flat-rate and add-on loans and converting them to an APR.', 'Reading the cost of short, expensive credit.'],
  sim: 'mi-race'
},

{
  id: 'compound-interest', parent: 'interest', title: 'Compound interest', level: 1,
  short: 'When interest is left to earn interest, money grows by the same percentage every year — exponentially. Slow at first and startling later, compounding makes time the most powerful ingredient in saving, and the most dangerous one in debt.',
  keywords: ['compound interest', 'compounding', 'interest on interest', 'exponential growth', 'future value', 'snowball', 'start early', 'A = P(1+r)^t', 'savings growth', 'fees compound'],
  prereq: ['simple-interest', 'math:exponential-growth-decay', 'math:geometric-series'],
  related: ['effective-rate', 'rule-of-72', 'annuities', 'compounding-returns', 'investment-fees', 'credit-cards', 'why-invest'],
  body: `
Put ¤1,000 in an account paying 5 % a year and leave the interest in. After one year you have ¤1,050. In the second year the 5 % is earned on ¤1,050, so you receive ¤52.50, not ¤50 — the extra ¤2.50 is **interest on interest**. It looks like nothing. But it grows every year, and after 30 years the account holds ¤4,321.94, while simple interest would have given ¤2,500. In year 30 alone the interest is ¤205.81, four times the first year's.

### The formula
Each year multiplies the balance by the same factor $1 + r$:

$$A = P\\,(1+r)^{t}$$

That is [[math:exponential-growth-decay|exponential growth]]: equal *percentages* in equal times, rather than equal amounts. On a graph it bends upwards, slowly at first and then steeply — which is why compounding feels unimpressive for years and then suddenly does most of the work.

### Time is the strongest ingredient
Two savers put away ¤200 a month at 7 % a year. Anna starts at 25, saves for 10 years, then stops and lets the money grow until 65. Ben starts at 35 and saves every month for 30 years until 65.

| | Anna | Ben |
|---|---:|---:|
| Months of saving | 120 | 360 |
| Paid in | ¤24,000 | ¤72,000 |
| At 65 | ¤280,968 | ¤243,994 |

Anna paid in a third as much and ends with more, because her money had ten more years to compound. (At 6 % they finish roughly level; returns of 7 % a year are not guaranteed, and real markets go up and down — see [[compounding-returns]].) Someone who saves the same ¤200 from 25 all the way to 65 at 7 % ends with ¤524,963.

### The rate matters more than it looks
¤10,000 left for 30 years grows to ¤32,434 at 4 % and ¤100,627 at 8 %. Doubling the rate did not double the growth; it multiplied it by four. Small differences in rates — and in fees — become large differences in outcomes.

> [!key] Compounding rewards two things above all: time, and not interrupting it. Every year the money stays invested, the base on which it grows is larger.

### It works just as hard against you
A debt at 20 % a year that is not paid down doubles in under four years. Card balances, unpaid loans and arrears compound for the lender ([[credit-cards]]). And costs compound too: a 1 % yearly fee on an investment growing 7 % a year leaves ¤56,308 instead of ¤76,123 from ¤10,000 after 30 years — the fee takes a quarter of the result ([[investment-fees]]).

### Regular saving
Most people do not invest one lump but add a little every month. Each deposit compounds for the time it stays in, and the total is a sum of a [[math:geometric-series|geometric series]] — an [[annuities|annuity]]:

$$A = P\\,(1+i)^{n} + c\\,\\frac{(1+i)^{n} - 1}{i}$$

with a monthly rate $i = r/12$, $n$ months and a monthly deposit $c$. The simulation below splits the balance into what you paid in, simple interest, and interest on interest; try [the savings calculator](#/tools/money/save) with your own numbers.

> [!tip] If the exponential curve feels discouraging because the early years look flat, remember that the flat part is where the base is being built. Nothing about it is wasted.
`,
  ideas: [
    'Compound interest is earned on the interest already added: A = P (1 + r)^t.',
    'Growth is exponential — equal percentages in equal times — slow at first, then steep.',
    'Time is the strongest lever: starting ten years earlier can beat saving three times as much later.',
    'Doubling the rate more than doubles the long-run growth.',
    'Compounding works against you in debts and fees exactly as it works for you in savings.'
  ],
  pitfalls: [
    'Interest is the same every year — Only under simple interest. With compounding the yearly interest grows with the balance: ¤50 in year one becomes ¤205.81 in year 30 at 5 %.',
    'A 1 % fee is too small to matter — It compounds against you every year: over 30 years at 7 % it takes about a quarter of the final amount.',
    'Compound growth is guaranteed in investments — Deposits compound at a stated rate; investments compound at whatever returns the market gives, which vary and can be negative.'
  ],
  derivation: {
    title: 'From one year to many',
    steps: [
      { text: 'After one year the balance is the principal plus its interest:', tex: 'A_1 = P + P\\,r = P\\,(1+r)' },
      { text: 'The second year starts from $A_1$, and the same happens again:', tex: 'A_2 = A_1\\,(1+r) = P\\,(1+r)^2' },
      { text: 'Each year multiplies by the same factor, so after $t$ years:', tex: 'A_t = P\\,(1+r)^{t}' },
      { text: 'The interest on interest is what compound gives beyond simple interest:', tex: 'A_t - P\\,(1 + r\\,t) = P\\left[(1+r)^t - 1 - r\\,t\\right] \\approx P\\,\\frac{t(t-1)}{2}\\,r^2 \\text{ for small } r\\,t' }
    ]
  },
  formulas: [
    {
      name: 'Future value with compound interest',
      expr: 'A = P*(1 + r)^t', tex: 'A = P\\,(1+r)^{t}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly rate', q: 'ratio', unit: '%', value: 5, min: -90, max: 1000 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Solve for $t$ to see how long a goal takes, or for $r$ to find the rate a growth implies (the [[compounding-returns|CAGR]]).',
      practice: { unknowns: ['A', 'P', 't', 'r'] },
      stories: {
        A: 'You invest {P} at {r} a year, compounded yearly, for {t}. What is it worth at the end?',
        P: 'How much must you invest today at {r} a year to have {A} in {t}?',
        t: 'At {r} a year, how long does {P} take to grow to {A}?',
        r: 'An investment of {P} grew to {A} in {t}. What yearly compound rate is that?'
      }
    },
    {
      name: 'A lump sum plus monthly saving',
      expr: 'A = P*(1 + r/12)^(12*T) + c*((1 + r/12)^(12*T) - 1)/(r/12)',
      tex: 'A = P\\left(1+\\tfrac{r}{12}\\right)^{12T} + c\\,\\frac{\\left(1+\\tfrac{r}{12}\\right)^{12T} - 1}{r/12}',
      vars: {
        A: { name: 'balance at the end', q: 'money', unit: '$' },
        P: { name: 'starting amount', q: 'money', unit: '$', value: 10000 },
        c: { name: 'added at the end of every month', q: 'money', unit: '$', value: 200 },
        r: { name: 'yearly rate (compounded monthly)', q: 'ratio', unit: '%', value: 6, min: 0.01, max: 100 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'Solve for $c$ to find the monthly saving a goal needs, or for $T$ to see when you reach it.',
      practice: { unknowns: ['A', 'c', 'T'] },
      stories: {
        A: 'You start with {P} and add {c} every month at {r} a year for {T}. What will you have?',
        c: 'You start with {P} and want {A} in {T}. At {r} a year, how much must you add each month?',
        T: 'Starting with {P} and adding {c} a month at {r}, how long until you have {A}?'
      }
    },
    {
      name: 'Growth after a yearly fee',
      expr: 'A = P*((1 + r)*(1 - f))^t', tex: 'A = P\\,\\big[(1+r)(1-f)\\big]^{t}',
      vars: {
        A: { name: 'value at the end, after fees', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return before fees', q: 'ratio', unit: '%', value: 7, min: -90, max: 100 },
        f: { name: 'yearly fee, as a share of the balance', q: 'ratio', unit: '%', value: 1, min: 0, max: 50 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Set $f$ = 0 to see what the fee costs over the years.',
      practice: { unknowns: ['A'] },
      stories: { A: 'You invest {P} for {t}. The investments return {r} a year and the fund charges {f} of the balance each year. What is left at the end?' }
    }
  ],
  examples: [
    {
      title: 'Thirty years at 5 %',
      q: 'Compare ¤1,000 left for 30 years at 5 % with compound interest and with simple interest.',
      steps: [
        'Compound: $1{,}000 \\times 1.05^{30} = 1{,}000 \\times 4.3219 = ¤4{,}321.94$.',
        'Simple: $1{,}000 \\times (1 + 0.05 \\times 30) = ¤2{,}500$.',
        'Interest on interest: $4{,}321.94 - 2{,}500 = ¤1{,}821.94$ — more than the simple interest itself (¤1,500).'
      ],
      a: '¤4,321.94 against ¤2,500.'
    },
    {
      title: 'How long to a goal?',
      q: 'How long does ¤10,000 take to grow to ¤25,000 at 6 % a year?',
      steps: [
        'We need $(1.06)^t = 25{,}000/10{,}000 = 2.5$.',
        'Take [[math:logarithms|logarithms]]: $t = \\ln 2.5 / \\ln 1.06 = 0.9163 / 0.05827$.',
        '$t = 15.73$ years.'
      ],
      a: 'About 15.7 years.'
    },
    {
      title: 'The early starter',
      q: 'Anna saves ¤200 a month from 25 to 35 and then stops; Ben saves ¤200 a month from 35 to 65. Both earn 7 % a year, compounded monthly. Who has more at 65?',
      steps: [
        'Anna after 10 years: $200 \\times (1.005833^{120} - 1)/0.005833 = ¤34{,}616.96$.',
        'That lump grows for 30 more years: $34{,}616.96 \\times 1.005833^{360} = ¤280{,}968$.',
        'Ben after 30 years of saving: $200 \\times (1.005833^{360} - 1)/0.005833 = ¤243{,}994$.'
      ],
      a: 'Anna, with ¤280,968 from ¤24,000 paid in, against Ben\'s ¤243,994 from ¤72,000.'
    }
  ],
  quiz: [
    { q: '¤5,000 is invested at 6 % a year, compounded yearly, for 12 years. What is it worth?', answer: 10060.98, unit: '$',
      why: '5,000 × 1.06¹² = 5,000 × 2.0122 = ¤10,060.98 — it has doubled, as the rule of 72 predicts (72/6 = 12).' },
    { q: 'At a fixed compound rate, the interest earned each year…', choices: ['is the same every year', 'grows every year', 'shrinks every year', 'depends on inflation only'], a: 1,
      why: 'Interest is a fixed percentage of a growing balance, so it grows by the same factor (1 + r) every year.' },
    { q: '¤10,000 is invested for 30 years at 8 % instead of 4 %. The growth (the gain above ¤10,000) is about…', choices: ['twice as large', 'four times as large', 'the same', '1.5 times as large'], a: 1,
      why: 'At 4 % it grows to ¤32,434 (a gain of ¤22,434); at 8 % to ¤100,627 (a gain of ¤90,627) — about four times as much. Compounding magnifies rate differences over long periods.' },
    { q: 'An unpaid debt grows at 24 % a year. Roughly how many years until it doubles?', answer: 3.22, unit: 'yr',
      why: 'ln 2 / ln 1.24 = 3.22 years (the rule of 72 says 3). Expensive debt compounds fast.' },
    { q: 'A 1 % yearly fee on an investment that returns 7 % reduces the final amount after 30 years by about 1 %.', a: false,
      why: 'The fee compounds: the balance is multiplied by 0.99 every year, 0.99³⁰ = 0.74, so about 26 % of the final amount is lost.' }
  ],
  applications: ['Savings accounts, deposits and investment growth.', 'Deciding when to start saving, and how much each year of delay costs.', 'Understanding why credit-card and unpaid debts spiral.', 'Seeing what fees really cost over decades.'],
  history: 'Tables of compound interest were printed in Europe from the 16th century for merchants and moneylenders; the Babylonians already solved compound-interest problems on clay tablets about 4,000 years ago.',
  sim: 'ref-compound'
},

{
  id: 'effective-rate', parent: 'interest', title: 'Compounding frequency and the effective rate', level: 2,
  short: 'The same headline rate grows faster when interest is added more often. The effective annual rate says what a rate really does in a year, and it is the right number for comparing offers.',
  keywords: ['effective annual rate', 'EAR', 'AER', 'APY', 'annual equivalent rate', 'compounding frequency', 'nominal rate', 'monthly compounding', 'daily compounding', 'continuous compounding', 'number e', 'periodic rate'],
  prereq: ['compound-interest', 'math:number-e', 'math:limits'],
  related: ['apr', 'credit-cards', 'rule-of-72', 'bank-accounts', 'option-pricing'],
  body: `
Two offers both say "12 %". A deposit pays 12 % once a year. A credit card charges 1 % a month. After a year, ¤1,000 in the deposit has become ¤1,120, but ¤1,000 owed on the card has become ¤1,126.83 — because each month's interest was added to the balance and charged interest in the following months. The card's **effective** rate is 12.68 %.

### Nominal and effective
A rate quoted per year but paid in $m$ instalments is a **nominal** rate $r$: each period earns $r/m$. Compounded $m$ times, a year multiplies money by $(1 + r/m)^m$, so the **effective annual rate** is

$$E = \\left(1 + \\frac{r}{m}\\right)^{m} - 1$$

| Compounding | $m$ | 6 % nominal | 20 % nominal |
|---|---:|---:|---:|
| yearly | 1 | 6.000 % | 20.000 % |
| every six months | 2 | 6.090 % | 21.000 % |
| quarterly | 4 | 6.136 % | 21.551 % |
| monthly | 12 | 6.168 % | 21.939 % |
| daily | 365 | 6.183 % | 22.134 % |
| continuously | ∞ | 6.184 % | 22.140 % |

Two things stand out. More frequent compounding always helps the saver and costs the borrower. And the gain levels off: going from yearly to monthly matters, going from daily to continuous hardly at all.

### The limit, and the number e
As $m$ grows without bound, $(1 + r/m)^m$ approaches $e^{r}$, where $e = 2.71828…$ is the [[math:number-e|number e]]. At 100 % a year, ¤1 compounded yearly becomes ¤2, monthly ¤2.61, daily ¤2.71 — and never more than ¤2.718. This **continuous compounding** is the natural language of growth in mathematics and is used in pricing bonds and options ([[option-pricing]]):

$$A = P\\,e^{r t}, \\qquad E = e^{r} - 1$$

### The names on the offer
The effective rate goes by different names. Savings are often advertised with it: the *APY* (annual percentage yield) in the US, the *AER* (annual equivalent rate) in the UK. For loans, the US *APR* is the periodic rate times the number of periods — a nominal rate, although it includes certain fees — while in the UK and the EU the APR of a consumer loan is an effective rate that includes the costs of the credit. See [[apr]] for how fees enter.

> [!key] Compare offers on effective rates. A saver prefers 4.9 % compounded monthly (5.01 % effective) to 5 % paid once a year; a borrower prefers the opposite.

### Going the other way
Sometimes you know the effective yearly rate and need the rate per period — to check a monthly payment, or to turn a yearly return into a monthly one. Divide the year into $m$ equal compounding steps:

$$i = (1 + E)^{1/m} - 1$$

5 % a year effective is 0.4074 % a month, not $5/12 = 0.4167\\,\\%$: twelve months at 0.4167 % would compound to 5.12 %.

### Why it matters in daily life
For small rates and short times the differences are small: on a 6 % deposit, monthly instead of yearly compounding adds 0.17 percentage points. For expensive credit it is large: 2 % a month is 24 % nominal but 26.82 % effective. Card and overdraft rates are often stated per month or per day for exactly this reason — read them as effective yearly rates before comparing.
`,
  ideas: [
    'A nominal rate r paid m times a year earns r/m per period.',
    'The effective annual rate is E = (1 + r/m)^m − 1, and it is what a rate really does in a year.',
    'More frequent compounding helps savers and costs borrowers, but the gain levels off.',
    'The limit of ever more frequent compounding is continuous compounding: e^r.',
    'Compare offers on effective rates; convert with i = (1 + E)^(1/m) − 1 to get a rate per period.'
  ],
  pitfalls: [
    'Daily compounding makes a huge difference — For ordinary rates it adds little beyond monthly compounding: 6.183 % against 6.168 % at 6 %. It matters more for high rates.',
    'A monthly rate is the yearly rate divided by 12 — Only for a nominal rate. The monthly rate equivalent to 5 % effective is 0.4074 %, not 0.4167 %.',
    'The APR is the same thing everywhere — In the US the APR of a loan is nominal; in the UK and the EU it is effective and includes fees. Read the definition that applies.'
  ],
  derivation: {
    title: 'Why the limit is e^r',
    steps: [
      { text: 'Write $m = r\\,k$, so that $r/m = 1/k$ and the yearly factor becomes', tex: '\\left(1 + \\frac{r}{m}\\right)^{m} = \\left[\\left(1 + \\frac{1}{k}\\right)^{k}\\right]^{r}' },
      { text: 'As $m \\to \\infty$, $k \\to \\infty$ too, and the bracket tends to the number $e$ by its definition:', tex: '\\lim_{k \\to \\infty}\\left(1 + \\frac{1}{k}\\right)^{k} = e = 2.71828\\ldots' },
      { text: 'So the yearly factor tends to $e^{r}$ and, over $t$ years,', tex: 'A = P\\,e^{r t}, \\qquad E = e^{r} - 1' },
      { text: 'Equivalently, a balance growing continuously obeys $dA/dt = rA$, whose solution is the exponential — the same law as radioactive decay or population growth, with the sign reversed.', tex: '\\dv{A}{t} = r\\,A \\;\\Rightarrow\\; A = P\\,e^{rt}' }
    ]
  },
  formulas: [
    {
      name: 'Effective annual rate',
      expr: 'E = (1 + r/m)^m - 1', tex: 'E = \\left(1 + \\frac{r}{m}\\right)^{m} - 1',
      vars: {
        E: { name: 'effective annual rate', q: 'ratio', unit: '%' },
        r: { name: 'nominal yearly rate', q: 'ratio', unit: '%', value: 12, min: 0.001, max: 1000 },
        m: { name: 'compounding periods per year', int: true, value: 12, min: 1, max: 100000 }
      },
      note: '$m$ = 1 yearly, 2 half-yearly, 4 quarterly, 12 monthly, 52 weekly, 365 daily.',
      practice: { unknowns: ['E', 'r'] },
      stories: {
        E: 'A card charges a nominal {r} a year, compounded {m} times a year. What is the effective yearly rate?',
        r: 'An account advertises an effective rate of {E}, with interest added {m} times a year. What nominal rate is that?'
      }
    },
    {
      name: 'Continuous compounding: effective rate',
      expr: 'E = exp(r) - 1', tex: 'E = e^{r} - 1',
      vars: {
        E: { name: 'effective annual rate', q: 'ratio', unit: '%' },
        r: { name: 'continuously compounded rate', q: 'ratio', unit: '%', value: 6, min: -100, max: 500 }
      },
      stories: { E: 'A rate of {r} is compounded continuously. What is the effective yearly rate?' }
    },
    {
      name: 'Rate per period from an effective yearly rate',
      expr: 'i = (1 + E)^(1/m) - 1', tex: 'i = (1 + E)^{1/m} - 1',
      vars: {
        i: { name: 'rate per period', q: 'ratio', unit: '%' },
        E: { name: 'effective yearly rate', q: 'ratio', unit: '%', value: 5, min: 0.001, max: 1000 },
        m: { name: 'periods per year', int: true, value: 12, min: 1, max: 100000 }
      },
      practice: { unknowns: ['i', 'E'] },
      stories: {
        i: 'An investment returns an effective {E} a year. What is the equivalent rate for each of {m} periods in the year?',
        E: 'A loan charges {i} per period, with {m} periods a year. What is the effective yearly rate?'
      }
    },
    {
      name: 'Growth with m compoundings a year',
      expr: 'A = P*(1 + r/m)^(m*t)', tex: 'A = P\\left(1 + \\frac{r}{m}\\right)^{m t}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'nominal yearly rate', q: 'ratio', unit: '%', value: 6, min: 0.001, max: 1000 },
        m: { name: 'compounding periods per year', int: true, value: 12, min: 1, max: 100000, fixed: true },
        t: { name: 'years', q: 'years', unit: 'yr', value: 10 }
      },
      practice: { unknowns: ['A', 't'] },
      stories: {
        A: 'You deposit {P} at a nominal {r} compounded {m} times a year for {t}. What do you have at the end?',
        t: 'At a nominal {r} compounded {m} times a year, how long does {P} take to become {A}?'
      }
    }
  ],
  examples: [
    {
      title: 'A card at 1.5 % a month',
      q: 'A credit card charges 1.5 % a month on unpaid balances. What are its nominal and effective yearly rates?',
      steps: [
        'Nominal: $12 \\times 1.5\\,\\% = 18\\,\\%$.',
        'Effective: $1.015^{12} - 1 = 1.19562 - 1 = 19.56\\,\\%$.'
      ],
      a: '18 % nominal, 19.56 % effective.'
    },
    {
      title: 'Ten years at 6 %, three ways',
      q: '¤10,000 is deposited for 10 years at 6 % a year. What is it worth with yearly, monthly and continuous compounding?',
      steps: [
        'Yearly: $10{,}000 \\times 1.06^{10} = ¤17{,}908.48$.',
        'Monthly: $10{,}000 \\times 1.005^{120} = ¤18{,}193.97$.',
        'Continuous: $10{,}000 \\times e^{0.6} = ¤18{,}221.19$.'
      ],
      a: '¤17,908.48, ¤18,193.97 and ¤18,221.19 — monthly gains ¤285, continuous only ¤27 more.'
    }
  ],
  quiz: [
    { q: 'For a saver, which is better: 5.0 % paid once a year, or 4.9 % compounded monthly?', choices: ['5.0 % yearly', '4.9 % monthly', 'they are exactly equal', 'it depends on the amount'], a: 1,
      why: '(1 + 0.049/12)¹² − 1 = 5.01 %, a hair above 5.00 %. Compare effective rates, not headline rates.' },
    { q: 'A lender charges 2 % a month. What is the effective yearly rate, in per cent?', answer: 26.82, unit: '%',
      why: '1.02¹² − 1 = 0.2682. The nominal rate (24 %) understates the cost.' },
    { q: 'With daily compounding, a nominal 10 % becomes about 10.5 % effective.', a: true,
      why: '(1 + 0.10/365)³⁶⁵ − 1 = 10.52 %. Continuous compounding would give e^0.1 − 1 = 10.52 % as well.' },
    { q: 'As interest is compounded more and more often at the same nominal rate r, the effective rate…', choices: ['grows without limit', 'approaches e^r − 1', 'approaches 2r', 'first rises and then falls'], a: 1,
      why: '(1 + r/m)^m tends to e^r as m grows, so the effective rate levels off at e^r − 1.' }
  ],
  applications: ['Comparing savings accounts, deposits and loans that compound differently.', 'Reading card and overdraft rates quoted per month or per day.', 'Converting yearly returns into monthly ones for plans and loan payments.', 'Continuous compounding in bond and option pricing.'],
  history: 'Jacob Bernoulli met the number e in 1683 while asking exactly this question — what happens to a loan at 100 % as interest is compounded more and more often.',
  sim: 'mi-frequency'
},

{
  id: 'rule-of-72', parent: 'interest', title: 'The rule of 72', level: 1,
  short: 'Divide 72 by an interest rate in per cent and you get, roughly, the number of years it takes money to double. It works for savings, debts, inflation and growth, and is most accurate around 8 %.',
  keywords: ['rule of 72', 'rule of 70', 'rule of 69', 'doubling time', 'halving time', 'mental arithmetic', 'estimate', 'rule of 114', 'tripling time'],
  prereq: ['compound-interest', 'math:logarithms'],
  related: ['inflation-purchasing-power', 'effective-rate', 'compounding-returns', 'credit-cards', 'gdp'],
  body: `
How long does money take to double at 6 % a year? Divide 72 by 6: about **12 years**. The exact answer is 11.90 years. That is the **rule of 72**, the most useful piece of mental arithmetic in personal finance: it turns any growth rate into a picture you can hold in your head.

### Why it works
Money doubles when $(1+r)^t = 2$. Taking [[math:logarithms|logarithms]],

$$t = \\frac{\\ln 2}{\\ln(1+r)} \\approx \\frac{0.693}{r}$$

because $\\ln(1+r) \\approx r$ for small rates. With the rate in per cent that is $69.3/R$. Two things push the practical constant up to 72: for ordinary rates $\\ln(1+r)$ is a little *smaller* than $r$, so the true doubling time is a little longer than $69.3/R$; and 72 divides neatly by 2, 3, 4, 6, 8, 9 and 12.

| Rate | Exact | 72 ÷ rate | 70 ÷ rate |
|---:|---:|---:|---:|
| 1 % | 69.66 years | 72.0 | 70.0 |
| 2 % | 35.00 | 36.0 | 35.0 |
| 4 % | 17.67 | 18.0 | 17.5 |
| 6 % | 11.90 | 12.0 | 11.7 |
| 8 % | 9.01 | 9.0 | 8.8 |
| 10 % | 7.27 | 7.2 | 7.0 |
| 12 % | 6.12 | 6.0 | 5.8 |
| 18 % | 4.19 | 4.0 | 3.9 |
| 24 % | 3.22 | 3.0 | 2.9 |

The rule of 72 is exact at about 7.85 % and within 3 % of the truth for rates from 2 % to 14 %. At low rates — inflation, deposits — the **rule of 70** is closer; at high rates both rules underestimate the time, the rule of 72 by about 7 % at 24 %. For continuous compounding the exact constant is 69.3.

### Four ways to use it
- **Savings.** At 8 % a year money doubles about every 9 years, so ¤10,000 left for 36 years goes through four doublings: ¤160,000 (exactly ¤159,682).
- **Inflation.** At 3 % prices double in 24 years, so money kept in cash loses half its [[inflation-purchasing-power|purchasing power]] within one working life.
- **Debt.** At 18 % a card balance left unpaid doubles in 4 years ([[credit-cards]]).
- **Economies.** An economy growing 7 % a year doubles its output in about ten years ([[gdp]]).

It also runs backwards: to double money in 6 years you need about $72/6 = 12\\,\\%$ a year (exactly 12.25 %) — a useful check on promises that sound too good.

> [!tip] Counting in doublings makes long horizons easy. Thirty years at 7 % is about three doublings (72 ÷ 7 ≈ 10 years each), so money grows roughly eightfold — exactly 7.6 times. Forty years at 3 % inflation is about 1.7 doublings of prices: things end up costing about three and a quarter times as much.

### Tripling and more
The same idea works for any multiple $k$: $t = \\ln k / \\ln(1+r)$. For tripling, $100 \\ln 3 \\approx 110$, and the practical constant is about 114 or 115: at 8 %, 114/8 = 14.25 years, against 14.27 exactly. Quadrupling is two doublings: 144.

> [!key] Doubling time ≈ 72 ÷ the rate in per cent. It is exact enough for every everyday decision, and it works for anything that grows by a fixed percentage — money, prices, debts, populations.
`,
  ideas: [
    'Years to double ≈ 72 ÷ the yearly rate in per cent.',
    'It comes from t = ln 2 / ln(1 + r) ≈ 0.693 / r, adjusted upwards for typical rates.',
    'It is exact near 8 %; the rule of 70 is closer at low rates, and both underestimate at high ones.',
    'It works for anything growing by a fixed percentage: savings, prices, debts, economies.',
    'Backwards, 72 ÷ years gives the rate needed to double in that time.'
  ],
  pitfalls: [
    'At 10 % money doubles in 10 years — Compound interest doubles it in about 7.3 years; 10 years is what simple interest would take.',
    'The rule is exact — It is an approximation, excellent near 8 %, a few per cent off at low and high rates, and poor above about 30 %.',
    'Halving the rate halves the doubling time — It doubles it: the time is inversely proportional to the rate.'
  ],
  formulas: [
    {
      name: 'Exact doubling time',
      expr: 't = ln(2)/ln(1 + r)', tex: 't = \\frac{\\ln 2}{\\ln(1+r)}',
      vars: {
        t: { name: 'years to double', q: 'years', unit: 'yr' },
        r: { name: 'yearly growth rate', q: 'ratio', unit: '%', value: 6, min: 0.001, max: 1000 }
      },
      note: 'For prices growing with inflation, $t$ is also the time for money to lose half its purchasing power.',
      practice: { unknowns: ['t', 'r'] },
      stories: {
        t: 'Money grows at {r} a year. How long does it take to double?',
        r: 'You want an investment to double in {t}. What yearly rate does that need?'
      }
    },
    {
      name: 'The rule of 72',
      expr: 't = 72/R', tex: 't \\approx \\frac{72}{R}',
      vars: {
        t: { name: 'approximate years to double', q: 'years', unit: 'yr' },
        R: { name: 'yearly rate as a number of per cent (6 for 6 %)', value: 6, min: 0.01, max: 1000 }
      },
      note: '$R$ is the plain number of per cent, so 6 % is entered as 6. Compare with the exact doubling time above.',
      practice: { unknowns: ['t', 'R'] },
      stories: {
        t: 'Estimate with the rule of 72: at {R} per cent a year, how long does money take to double?',
        R: 'Using the rule of 72, what rate in per cent doubles money in {t}?'
      }
    },
    {
      name: 'Time to multiply money k times',
      expr: 't = ln(k)/ln(1 + r)', tex: 't = \\frac{\\ln k}{\\ln(1+r)}',
      vars: {
        t: { name: 'years needed', q: 'years', unit: 'yr' },
        k: { name: 'multiple (2 doubles, 3 triples, 10 is ten times)', value: 3, min: 1.0001, max: 1e9 },
        r: { name: 'yearly growth rate', q: 'ratio', unit: '%', value: 8, min: 0.001, max: 1000 }
      },
      practice: { unknowns: ['t', 'k'] },
      stories: {
        t: 'At {r} a year, how long does money take to grow {k} times?',
        k: 'Money grows at {r} a year for {t}. By what factor has it grown?'
      }
    }
  ],
  examples: [
    {
      title: 'Four doublings',
      q: 'Estimate what ¤10,000 becomes in 36 years at 8 % a year, and check it exactly.',
      steps: [
        'Rule of 72: $72/8 = 9$ years per doubling, and 36 years is 4 doublings.',
        '$10{,}000 \\times 2^4 = ¤160{,}000$.',
        'Exactly: $10{,}000 \\times 1.08^{36} = ¤159{,}681.72$ — the estimate is 0.2 % high.'
      ],
      a: 'About ¤160,000 (exactly ¤159,682).'
    },
    {
      title: 'A promise to check',
      q: 'A scheme promises to double your money in 3 years. What yearly return is that, and how does it compare with the long-run returns of broad share markets?',
      steps: [
        'Rule of 72 backwards: $72/3 = 24\\,\\%$ a year.',
        'Exactly: $2^{1/3} - 1 = 26.0\\,\\%$ a year.',
        'Over long periods, broad share markets have returned very roughly 5–10 % a year before inflation, with large swings along the way. A steady 26 % would be extraordinary; such promises call for great caution ([[scams-fraud]]).'
      ],
      a: 'About 26 % a year — far above what diversified investments have delivered.'
    }
  ],
  quiz: [
    { q: 'With inflation at 3 % a year, prices double in about…', choices: ['3 years', '12 years', '24 years', '72 years'], a: 2,
      why: '72 / 3 = 24 years (exactly 23.4). Over a working life of 40 years, prices more than triple.' },
    { q: 'Using the rule of 72, what yearly rate doubles money in 6 years? (in per cent)', answer: 12, unit: '%', tol: 0.03,
      why: '72 / 6 = 12 %. The exact rate is 2^(1/6) − 1 = 12.25 % — the rule is very close.' },
    { q: '¤5,000 grows at 9 % a year for 24 years. Using doublings, roughly what is it worth?', choices: ['¤10,000', '¤20,000', '¤40,000', '¤80,000'], a: 2,
      why: '72 / 9 = 8 years per doubling, so 24 years is three doublings: 5,000 × 8 = ¤40,000. Exactly: ¤39,555.' },
    { q: 'The rule of 72 gives the same accuracy at every interest rate.', a: false,
      why: 'It is exact near 7.85 %, slightly pessimistic at low rates (where 70 is closer) and increasingly optimistic at high rates: at 24 % it says 3 years against 3.22.' },
    { q: 'At 12 % a year, how many years exactly does money take to double?', answer: 6.12, unit: 'yr',
      why: 'ln 2 / ln 1.12 = 0.6931 / 0.1133 = 6.12 years; the rule of 72 gives 6.' }
  ],
  applications: ['Quick checks of savings goals and investment promises.', 'Feeling what inflation does to cash over a lifetime.', 'Seeing how fast unpaid debts grow.', 'Reading growth rates of economies, prices and populations.'],
  history: 'The rule appears in Luca Pacioli\'s mathematics textbook "Summa de arithmetica" of 1494, stated without proof — suggesting it was already well known to merchants of the time.',
  sim: 'mi-rule72'
}

);
