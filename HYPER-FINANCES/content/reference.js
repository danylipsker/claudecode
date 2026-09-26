/* HYPER-FINANCES · content/reference.js — the reference concept for finance authors:
 * its depth, practical angle and layout are the model (see also sims/reference.js). */
Hyper.add(

{
  id: 'amortization', parent: 'loan-basics', title: 'Amortization: level payments', level: 1,
  short: 'Most loans and mortgages are repaid in equal monthly instalments. Each one pays the month\'s interest first and repays capital with the rest — so early payments are mostly interest, and the debt falls slowly before it falls fast.',
  keywords: ['amortization', 'amortisation', 'annuity loan', 'level payment', 'French amortization', 'Spitzer', 'mortgage payment', 'instalment', 'repayment schedule', 'principal', 'interest', 'amortization table'],
  prereq: ['how-loans-work', 'compound-interest', 'annuities', 'math:geometric-series'],
  related: ['equal-principal', 'apr', 'early-repayment', 'mortgage-basics', 'refinancing', 'loan-comparison'],
  body: `
Borrow ¤250,000 for 25 years at 5 % a year and the bank will ask for ¤1,461.48 every month, the same amount for 300 months. That fixed instalment is called a **level payment**, and the loan an **annuity loan** (bankers in continental Europe say *French* amortization; in Israel it is the *Spitzer* schedule). It is by far the most common way to repay a mortgage, a car loan or a personal loan, and understanding what happens inside each payment explains most of what surprises borrowers.

### What each payment does
Every month the lender charges interest on what you still owe, at one-twelfth of the yearly rate. Your payment covers that interest first; whatever is left over **repays capital** (the *principal*) and shrinks the balance:

$$\\text{interest}_k = B_{k-1}\\,\\frac{r}{12}, \\qquad \\text{capital}_k = M - \\text{interest}_k, \\qquad B_k = B_{k-1} - \\text{capital}_k$$

In the first month the balance is the whole ¤250,000, so the interest is ¤1,041.67 — **71 % of the payment** — and only ¤419.81 repays the loan. Next month the balance is a little smaller, so the interest is a little smaller and the capital part a little larger. The split tilts every month, slowly at first: capital overtakes interest only in month 135, more than eleven years in. By the last year almost the whole payment is capital.

> [!key] The payment is constant, but what it buys changes: early payments mostly rent the money, late payments mostly repay it.

### The formula
Why ¤1,461.48? The payments form an [[annuities|annuity]]: their [[present-value|present value]] at the loan's rate must equal the amount borrowed. With a monthly rate $i = r/12$ and $n$ payments,

$$M = P\\,\\frac{i}{1 - (1+i)^{-n}}$$

The balance still owed after $k$ payments is what the loan would have grown to, minus what the payments so far would have grown to:

$$B_k = P(1+i)^k - M\\,\\frac{(1+i)^k - 1}{i}$$

After 10 years of the 25 — 40 % of the time — the balance is still ¤184,811: you have repaid only 26 % of the loan. That is not a trick by the bank; it is simply what interest on a large balance costs.

### The term: the biggest lever
A longer term lowers the payment but raises the total interest, because the balance stays high for longer. For ¤200,000 at 6 %:

| Term | Monthly payment | Total interest |
|---|---:|---:|
| 15 years | ¤1,687.71 | ¤103,788 |
| 30 years | ¤1,199.10 | ¤231,676 |

The 30-year loan costs ¤488 a month less — and ¤127,888 more in total. Neither is wrong: the lower payment buys flexibility and safety if income falls. But it is worth knowing the price.

### Paying a little extra
Anything paid beyond the instalment goes straight to capital, and capital that is repaid stops costing interest for all the remaining years. On the ¤250,000 loan, an extra ¤200 a month ends it in 238 months instead of 300 — five years early — and saves ¤44,432 of interest. Check first whether your contract charges an [[early-repayment|early-repayment fee]], and whether the lender will shorten the loan or lower the payment.

> [!warn] A level payment is only level while the rate is fixed. On a [[variable-rate-mortgages|variable-rate]] or [[index-linked-mortgages|inflation-linked]] loan the payment is recalculated as the rate or the index moves.

### Level payments or equal capital?
The alternative is to repay the same amount of capital every month, the [[equal-principal|equal-capital]] (linear) method. Its first payment is higher — ¤1,875 instead of ¤1,461 on our loan — and then falls steadily to ¤837, and because the balance falls faster the total interest is lower: ¤156,771 instead of ¤188,443. Level payments are easier to budget; equal capital is cheaper if you can carry the higher start. The simulation below lets you compare them.
`,
  ideas: [
    'A level (annuity) payment is the same every month; it pays the month\'s interest first and repays capital with the rest.',
    'Early payments are mostly interest, late payments mostly capital — the split tilts every month.',
    'The payment formula comes from setting the present value of all the payments equal to the loan.',
    'A longer term lowers the payment and raises the total interest.',
    'Extra payments go straight to capital and save interest for every remaining month.'
  ],
  pitfalls: [
    'After half the term, half the loan is repaid — Far less: on a 25-year loan at 5 %, 26 % is repaid after 10 years, and half only after more than 16 years.',
    'The bank charges more interest early on — The rate is the same every month; the interest is larger early because the balance is larger.',
    'The lowest monthly payment is the cheapest loan — Stretching the term lowers the payment and raises the total paid; compare total cost and APR.'
  ],
  formulas: [
    {
      name: 'Level monthly payment',
      expr: 'M = P*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'M = P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 25 }
      },
      note: 'Solve for $P$ to see how much a payment can borrow, for $T$ to see how long a payment takes, or for $r$ to find the rate hidden in an offer.',
      practice: { unknowns: ['M', 'P', 'T'] },
      stories: {
        M: 'You borrow {P} over {T} at {r} a year, repaid in equal monthly instalments. What is the payment?',
        P: 'You can afford {M} a month for {T}. At {r} a year, how much can you borrow?',
        T: 'A loan of {P} at {r} a year is repaid at {M} a month. How long will it take?'
      }
    },
    {
      name: 'Balance still owed after k payments',
      expr: 'B = P*(1 + r/12)^k - M*((1 + r/12)^k - 1)/(r/12)',
      tex: 'B = P\\left(1 + \\tfrac{r}{12}\\right)^{k} - M\\,\\frac{\\left(1 + \\tfrac{r}{12}\\right)^{k} - 1}{r/12}',
      vars: {
        B: { name: 'balance still owed', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50, fixed: true },
        M: { name: 'monthly payment', q: 'money', unit: '$', value: 1461.48 },
        k: { name: 'payments made', int: true, value: 120 }
      },
      note: 'The defaults are the ¤250,000, 5 %, 25-year loan after ten years. The balance is what you would need to clear the loan today (before any early-repayment fee).',
      practice: { unknowns: ['B'] },
      stories: { B: 'A loan of {P} at {r} is repaid at {M} a month. How much is still owed after {k} payments?' }
    },
    {
      name: 'Interest in one payment',
      expr: 'I = B*r/12', tex: 'I = B\\,\\frac{r}{12}',
      vars: {
        I: { name: 'interest in this month\'s payment', q: 'money', unit: '$' },
        B: { name: 'balance owed at the start of the month', q: 'money', unit: '$', value: 250000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5 }
      },
      stories: { I: 'You owe {B} on a loan at {r} a year. How much of this month\'s payment is interest?' }
    },
    {
      name: 'Total interest over the loan',
      expr: 'I = 12*T*M - P', tex: 'I = 12\\,T\\,M - P',
      vars: {
        I: { name: 'total interest paid', q: 'money', unit: '$' },
        T: { name: 'term', q: 'years', unit: 'yr', value: 25 },
        M: { name: 'monthly payment', q: 'money', unit: '$', value: 1461.48 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 }
      },
      note: 'Everything paid minus what was borrowed — if the loan runs its full term with no fees and a fixed rate.',
      practice: { unknowns: ['I'] },
      stories: { I: 'A loan of {P} is repaid at {M} a month for {T}. How much interest is paid in total?' }
    }
  ],
  examples: [
    {
      title: 'Where the first payment goes',
      q: 'A ¤250,000 mortgage at 5 % over 25 years. Find the monthly payment, and how much of the first payment is interest.',
      steps: [
        'Monthly rate $i = 0.05/12 = 0.0041667$; number of payments $n = 300$.',
        '$(1+i)^{-300} = 0.28725$, so $M = 250\\,000 \\times 0.0041667 / (1 - 0.28725) = ¤1{,}461.48$.',
        'First month\'s interest: $250\\,000 \\times 0.0041667 = ¤1{,}041.67$.',
        'Capital repaid: $1{,}461.48 - 1{,}041.67 = ¤419.81$. The balance becomes ¤249,580.19, and next month\'s interest is computed on that.'
      ],
      a: '¤1,461.48 a month; the first payment is ¤1,041.67 interest (71 %) and ¤419.81 capital.'
    },
    {
      title: 'How much is left after ten years?',
      q: 'The same loan after 120 payments. What is still owed, and what share of the loan has been repaid?',
      steps: [
        '$(1+i)^{120} = 1.64701$.',
        '$B = 250\\,000 \\times 1.64701 - 1{,}461.48 \\times (1.64701 - 1)/0.0041667 = 411\\,752 - 226\\,941 = ¤184{,}811$.',
        'Repaid: $250\\,000 - 184\\,811 = ¤65{,}189$, or 26 % of the loan — in 40 % of the term.',
        'Payments so far: $120 \\times 1{,}461.48 = ¤175{,}378$, of which ¤110,189 was interest.'
      ],
      a: '¤184,811 still owed; 26 % repaid after 40 % of the time.'
    },
    {
      title: 'Fifteen or thirty years?',
      q: 'For ¤200,000 at 6 %, compare the monthly payment and the total interest over 15 and over 30 years.',
      steps: [
        '15 years: $i = 0.005$, $n = 180$, $M = 200\\,000 \\times 0.005/(1 - 1.005^{-180}) = ¤1{,}687.71$; interest $180 \\times 1{,}687.71 - 200\\,000 = ¤103{,}788$.',
        '30 years: $n = 360$, $M = ¤1{,}199.10$; interest $360 \\times 1{,}199.10 - 200\\,000 = ¤231{,}676$.',
        'The longer term costs ¤488.61 less a month and ¤127,888 more in total.'
      ],
      a: '¤1,687.71 against ¤1,199.10 a month; ¤103,788 against ¤231,676 of interest.'
    }
  ],
  quiz: [
    { q: 'On a level-payment mortgage, the interest part of each payment…', choices: ['stays the same', 'falls every month', 'rises every month', 'depends on the month of the year'], a: 1,
      why: 'Interest is charged on the balance, which falls a little every month; the payment is constant, so the capital part grows as the interest part shrinks.' },
    { q: 'Halfway through a 30-year mortgage at 6 %, about half of the loan has been repaid.', a: false,
      why: 'Only about 29 % is repaid after 15 years of a 30-year loan at 6 %: the early payments are mostly interest.' },
    { q: 'A ¤100,000 loan at 12 % a year (1 % a month): how much interest is in the first monthly payment?', answer: 1000, unit: '$',
      why: 'The first month\'s interest is the balance times the monthly rate: 100,000 × 0.01 = ¤1,000, whatever the payment is.' },
    { q: 'You add ¤100 to every monthly payment. Where does it go?', choices: ['to the next month\'s interest', 'entirely to capital', 'split like the normal payment', 'to the bank\'s fees'], a: 1,
      why: 'The regular payment has already covered the month\'s interest; anything extra reduces the balance, and so all the future interest on it.' },
    { q: 'Two loans for the same amount and rate, one over 20 years and one over 30. Which has the lower total interest?', choices: ['the 20-year loan', 'the 30-year loan', 'they are equal', 'it depends on inflation'], a: 0,
      why: 'The balance falls faster on the shorter loan, so less interest accumulates, even though each payment is higher.' }
  ],
  problems: [
    { q: 'You can afford ¤1,500 a month. At 4.5 % a year over 30 years, how much can you borrow?', answer: 296041, unit: '$', tol: 0.005,
      hint: 'Solve the payment formula for the amount: $P = M\\,(1 - (1+i)^{-n})/i$.',
      steps: ['$i = 0.045/12 = 0.00375$, $n = 360$.', '$(1.00375)^{-360} = 0.25985$.', '$P = 1\\,500 \\times (1 - 0.25985)/0.00375 = ¤296{,}041$.'] }
  ],
  applications: ['Every fixed-rate mortgage, car loan and personal loan with equal instalments.', 'Reading a repayment schedule and knowing what you still owe.', 'Deciding between a shorter and a longer term.', 'Working out what an extra payment or a lump sum is worth.'],
  sim: 'ref-amortization'
}

);
