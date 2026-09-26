/* HYPER-FINANCES · content/debt.js — Personal Finance › Managing debt:
 * useful and harmful debt, credit cards and the minimum-payment trap, paying debts off
 * (avalanche and snowball), credit scores and reports, debt-to-income and affordability. */
Hyper.add(

/* ================================================================ good and bad debt */
{
  id: 'good-and-bad-debt', parent: 'debt', title: 'Good debt and bad debt', level: 1,
  short: 'Debt moves money through time: you spend future income today and pay for it. Whether that helps or harms depends on what it buys, what it costs, and whether you can still pay when things go wrong.',
  keywords: ['good debt', 'bad debt', 'borrowing', 'consumer debt', 'secured loan', 'unsecured loan', 'cost of credit', 'buy now pay later', 'real interest rate', 'leverage'],
  prereq: ['how-loans-work', 'compound-interest', 'opportunity-cost'],
  related: ['credit-cards', 'high-cost-credit', 'debt-to-income', 'apr', 'leverage-basics', 'real-vs-nominal', 'debt-payoff'],
  body: `
Debt moves money through time: you spend tomorrow's income today, and pay for the privilege. That is neither virtuous nor shameful in itself. A mortgage lets a family live in a home for decades while paying for it; a card balance rolled over for years can quietly take a fifth of someone's income. The difference lies in four questions.

### Four questions to ask of any loan
1. **What does it buy, and will it outlast the loan?** A home you live in for 25 years, a qualification that raises your earnings for 40, a tool that earns money for a business: each can outlast its loan. A holiday, a meal or a phone replaced in two years does not.
2. **Does it earn or save more than it costs?** Borrowing at 5 % to buy something that saves you rent or earns 8 % may pay. Borrowing at 24 % almost never does.
3. **Can you still pay if things go wrong?** A payment that fits only if nothing changes is fragile. Ask what happens if income falls by a fifth or a variable rate rises two points ([[debt-to-income]]).
4. **What does it really cost?** Compare the total you will pay with the price, and read the [[apr|APR]], not the headline rate. [Comparing loans](#/tools/money/compare) side by side makes the difference visible.

### One sofa, three prices
A ¤2,000 sofa:
- paid from savings: ¤2,000;
- on a card at 24 %, paid off over two years: ¤105.74 a month, ¤2,537.81 in all — ¤537.81 of interest, 27 % on top;
- "buy now, pay later" in four interest-free instalments of ¤500: ¤2,000 if every instalment is paid on time — but late fees, and in some products backdated interest, if one is missed ([[high-cost-credit]]).

A ¤3,000 holiday put on a card at 22 % and repaid at ¤100 a month takes 44 months and ¤1,395 of interest. The memories fade long before the payments do.

### A spectrum, not two boxes
Mainstream credit runs roughly from cheaper to dearer in this order; actual rates depend on the country, the year and the borrower:

| Kind of credit | Why it is priced so |
|---|---|
| Mortgage | secured by the home; lenders can take it back |
| Car loan | secured by a car, which loses value |
| Student loan | in some countries subsidised or repaid from income |
| Personal loan | unsecured; priced on your record |
| Credit card, overdraft | unsecured, flexible, used most by people under strain |
| Payday and similar loans | small, short, very high annualised cost |

The rate is the lender's estimate of risk plus its costs. Security lowers it; flexibility and risk raise it.

### Leverage cuts both ways
Borrowing to buy something that rises in value multiplies your gain; if it falls, it multiplies your loss, and the debt is still owed in full ([[leverage-basics]]). Buy a home with a 10 % deposit and a 10 % fall in prices wipes out your whole stake.

### Inflation and debt
Inflation erodes a fixed debt: with prices rising 3 % a year, a 5 % mortgage costs about 1.9 % a year in real terms ([[real-vs-nominal]]). The same arithmetic works against savers. It does not rescue a card at 22 %, whose real cost is still about 18 %.

### Debt and feelings
Debt carries weight that numbers do not show: dread of opening letters, shame, arguments at home. None of it means you have failed; most people borrow at some point, and many have been where you are. The way out starts with a list — every debt, its balance, its rate, its payment — and a plan ([[debt-payoff]]). Asking early for help, from the lender or from a free, not-for-profit debt advice service where your country has one, is a strength.

> [!key] Useful debt buys something that lasts, costs less than it earns or saves, and leaves a margin for bad times. Harmful debt pays for today with tomorrow, at a high price.
`,
  ideas: [
    'Debt is a tool for moving money through time; judge each loan by what it buys, what it costs and whether you can carry it in bad times.',
    'Credit that outlasts its purpose — a holiday still being paid for years later — is the costly kind.',
    'Rates follow risk: secured, long-term loans are cheapest; unsecured, flexible and short-term credit the dearest.',
    'Leverage multiplies both gains and losses; the debt stays the same size either way.',
    'Inflation lowers the real cost of fixed-rate debt, but not enough to make expensive credit cheap.'
  ],
  pitfalls: [
    'All debt is bad — A mortgage or a well-chosen education loan can make someone better off; the question is the cost, the purpose and the margin for error.',
    '"Good debt" is safe whatever the amount — A mortgage or a student loan that is too large for the income is still dangerous; the category does not protect you.',
    'An interest-free instalment plan is always free — Only if every payment is made on time; late fees, and backdated interest on some products, can make it expensive.'
  ],
  formulas: [
    {
      name: 'Total paid for something bought on credit',
      expr: 'C = 12*T*P*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'C = 12\\,T\\,P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        C: { name: 'total paid', q: 'money', unit: '$' },
        T: { name: 'repayment period', q: 'years', unit: 'yr', value: 2 },
        P: { name: 'price financed', q: 'money', unit: '$', value: 2000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 24, min: 3, max: 36 }
      },
      note: 'Level monthly payments for the whole period. Everything above the price is interest.',
      practice: { unknowns: ['C', 'P'] },
      stories: {
        C: 'You buy a sofa for {P} on credit at {r} a year, repaid in equal monthly payments over {T}. How much do you pay in total?',
        P: 'You can bear to pay {C} in total over {T} at {r} a year. What price can you finance?'
      }
    },
    {
      name: 'The real interest rate',
      expr: 'rr = (1 + r)/(1 + p) - 1', tex: 'r_{\\text{real}} = \\frac{1 + r}{1 + p} - 1',
      vars: {
        rr: { name: 'real interest rate', q: 'ratio', unit: '%', signed: true, tex: 'r_{\\text{real}}' },
        r: { name: 'interest rate on the loan', q: 'ratio', unit: '%', value: 5, min: 0, max: 30 },
        p: { name: 'inflation', q: 'ratio', unit: '%', value: 3, min: 0, max: 15 }
      },
      note: 'What borrowing costs in goods and services rather than in money. Roughly the rate minus inflation.',
      practice: { unknowns: ['rr', 'p'] },
      stories: {
        rr: 'Your mortgage charges {r} a year and prices rise {p} a year. What is the real cost of borrowing?',
        p: 'A loan at {r} a year has a real cost of {rr}. What inflation does that assume?'
      }
    },
    {
      name: 'What a price change does to a leveraged stake',
      expr: 'x = g/d', tex: 'x = \\frac{g}{d}',
      vars: {
        x: { name: 'change in your own stake', q: 'ratio', unit: '%', signed: true },
        g: { name: 'change in the price of what you bought', q: 'ratio', unit: '%', value: -10, signed: true, min: -50, max: 50 },
        d: { name: 'your deposit, as a share of the price', q: 'ratio', unit: '%', value: 10, min: 5, max: 50 }
      },
      note: 'Before interest and costs. With a 10 % deposit every price move is multiplied by ten in what you own.',
      practice: { unknowns: ['x', 'g'] },
      stories: {
        x: 'You buy a home with a deposit of {d} of the price, borrowing the rest. Prices then change by {g}. By how much does your stake change?',
        g: 'With a deposit of {d}, your stake changed by {x}. How much did prices move?'
      }
    }
  ],
  examples: [
    {
      title: 'One sofa, three ways',
      q: 'A ¤2,000 sofa: from savings, or on a card at 24 % repaid in equal monthly payments over two years. What does the card cost?',
      steps: [
        'Monthly rate $i = 0.24/12 = 0.02$, $n = 24$: $M = 2\\,000 \\times 0.02/(1 - 1.02^{-24}) = ¤105.74$.',
        'Total paid: $24 \\times 105.74 = ¤2{,}537.81$ (to the cent, before rounding the payment).',
        'Interest: ¤537.81, or 27 % on top of the price. Saving ¤105.74 a month for 19 months first would have bought it outright.'
      ],
      a: '¤2,537.81 in total, ¤537.81 of it interest.'
    },
    {
      title: 'Real cost of two debts',
      q: 'Prices rise 3 % a year. What is the real cost of a 5 % mortgage, and of a card at 22 %?',
      steps: [
        'Mortgage: $1.05/1.03 - 1 = 1.94\\,\\%$ a year.',
        'Card: $1.22/1.03 - 1 = 18.4\\,\\%$ a year.',
        'Inflation helps the borrower at the margin; it does not change which debt to clear first.'
      ],
      a: 'About 1.9 % and 18.4 % a year in real terms.'
    }
  ],
  quiz: [
    { q: 'A ¤1,000 purchase is repaid in 12 equal monthly payments at 24 % a year (2 % a month). How much interest is paid in total?', answer: 134.72, unit: '$',
      why: 'The payment is $1\\,000 \\times 0.02/(1 - 1.02^{-12}) = ¤94.56$; twelve of them are ¤1,134.72, so ¤134.72 is interest.' },
    { q: 'Which loan best passes the four questions?', choices: ['A card balance for a holiday, repaid at the minimum', 'A modest fixed-rate loan for training that raises your pay, with payments well inside your budget', 'A payday loan to cover the gap until next month', 'A car loan stretched to eight years to afford a bigger car'], a: 1,
      why: 'It buys something that lasts, likely earns more than it costs, and leaves a margin. The others fund consumption at a high cost or stretch a depreciating asset beyond its value.' },
    { q: 'An interest-free "buy now, pay later" plan cannot cost more than the price.', a: false,
      why: 'Missed instalments can bring fees, and some products charge backdated interest if the balance is not cleared in time. It is free only if everything is paid on schedule.' },
    { q: 'A loan charges 5 % and inflation is 3 %. What is the real interest rate?', answer: 1.94, unit: '%',
      why: '(1.05 / 1.03) − 1 = 0.0194, about 1.9 % — close to the simple difference, 2 %.' },
    { q: 'Why do credit cards usually charge more than mortgages?', choices: ['Card companies are less efficient', 'Card debt is unsecured and flexible, so lenders bear more risk of loss', 'Mortgages are subsidised everywhere', 'Cards compound daily and mortgages never compound'], a: 1,
      why: 'A mortgage is secured by the home; a card has no collateral and can be drawn at any time, often by people under strain, so losses are higher and priced in.' }
  ],
  applications: ['Deciding whether a purchase should wait until you have saved for it.', 'Judging a loan offer by its total cost, not the monthly payment.', 'Choosing which debts to clear first.', 'Understanding why a small deposit makes a home purchase riskier.'],
  sim: 'ref-amortization'
},

/* ================================================================ credit cards */
{
  id: 'credit-cards', parent: 'debt', title: 'Credit cards and minimum payments', level: 1,
  short: 'A credit card is a way to pay and an always-open line of expensive credit. Paid in full each month it can cost nothing; paid at the minimum, a modest balance can last decades and cost more than twice what was borrowed.',
  keywords: ['credit card', 'minimum payment', 'grace period', 'statement balance', 'revolving credit', 'card APR', 'balance transfer', 'cash advance', 'credit limit', 'interest-free period'],
  prereq: ['compound-interest', 'apr', 'good-and-bad-debt'],
  related: ['debt-payoff', 'credit-scores', 'high-cost-credit', 'payments', 'effective-rate', 'present-bias'],
  body: `
A credit card is two products in one piece of plastic: a convenient way to pay, and a line of expensive credit that never closes. Used only for the first, it can cost nothing at all. Drift into the second and it becomes one of the most expensive loans most people ever take.

### How a card charges — or does not
Each month the card sends a statement: what you bought, the balance, a due date and a **minimum payment**. On most cards:
- Pay the whole statement balance by the due date and purchases carry no interest. This is the **grace period**, commonly a few weeks from the purchase.
- Pay less, and interest is charged on the balance at the card's rate; on many cards new purchases then lose the grace period too, until the balance is cleared.
- Cash withdrawals usually carry a fee and interest from the first day.

Cards differ between countries. In several, the everyday "credit" card is really a deferred-debit card that is settled in full from your bank account each month, with revolving credit as an option you must choose. Read your own card's terms.

Card rates are usually among the highest in mainstream lending, often several times a mortgage rate, and they compound monthly: an APR of 22 % is an [[effective-rate|effective]] 24.4 % a year.

### The minimum-payment trap
The minimum is usually a small percentage of the balance, with a floor. It looks affordable, and that is the trap. Take ¤5,000 at 22 %, with a minimum of 2.5 % of the balance or ¤25, whichever is more:
- In the first month the interest is ¤91.67 and the minimum ¤125: only ¤33.33 reduces the debt.
- As the balance falls, so does the minimum, so the balance falls ever more slowly. While the minimum is a fixed share $p$ of the balance, the balance shrinks by the same factor every month,

$$B = B_0\\left(1 + \\frac{r}{12} - p\\right)^{12T}$$

  a [[math:exponential-growth-decay|decay]] that never reaches zero on its own: here the balance halves only every 8.6 years.
- In total it takes **314 months — over 26 years — and ¤11,819 of interest**, more than twice the original debt.

Now keep paying the first minimum, ¤125, as a fixed amount: 73 months and ¤4,095. Pay ¤200 a month: 34 months and ¤1,750. The single most powerful card habit is to pay a **fixed amount**, never just the minimum. Try your own card in [the credit-card calculator](#/tools/money/card).

Some regulators require the minimum to cover at least the month's interest plus a slice of the balance, or require statements to show how long minimum payments would take.

### Using a card well
- Set up an automatic payment of the **full statement balance**. The card then gives you a few weeks of free credit, and in some countries extra protection when goods are not delivered.
- If you carry a balance, stop putting new spending on that card until it is cleared.
- Keep the balance low compared with the limit; it matters for your [[credit-scores|credit score]].
- Watch the fees: annual, late-payment, foreign-currency and cash-withdrawal fees.
- **Balance transfers**: another card may offer 0 % on a transferred balance for a year or more, for a fee of a few per cent. Moving ¤5,000 for a 3 % fee costs ¤150; staying at 22 % while paying ¤200 a month would cost about ¤961 of interest over the same year. It works only if the balance is cleared before the offer ends and nothing new goes on the card.
- Rewards are worth something only if you pay in full: 1 % cashback does not offset 22 % interest.

> [!warn] Using one card to pay another, or paying only minimums on several cards, is a signal to stop, list every debt and make a plan ([[debt-payoff]]). Free, not-for-profit debt advice early on widens your options.
`,
  ideas: [
    'Paying the full statement balance by the due date usually means no interest on purchases.',
    'A carried balance is charged one of the highest rates in mainstream lending, compounded monthly.',
    'A minimum that is a percentage of the balance shrinks with it, so the debt decays slowly and can last decades.',
    'Paying a fixed amount instead of the minimum cuts the time and the interest dramatically.',
    'Balance transfers help only if the balance is cleared within the offer and no new spending is added.'
  ],
  pitfalls: [
    'The minimum payment is what the bank thinks I can afford to pay off the debt — It is designed to keep the account in good standing, not to clear it; at the minimum, ¤5,000 at 22 % takes over 26 years.',
    'Rewards make the card pay for itself — Only when the balance is cleared every month; a few per cent of points is small beside a rate above 20 %.',
    'A 0 % balance transfer makes the debt disappear — It pauses the interest. The fee is real, and when the offer ends any balance left is charged the standard rate.'
  ],
  formulas: [
    {
      name: 'Balance when paying only a percentage minimum',
      expr: 'B = B0*(1 + r/12 - p)^(12*T)', tex: 'B = B_0 \\left(1 + \\frac{r}{12} - p\\right)^{12T}',
      vars: {
        B: { name: 'balance still owed', q: 'money', unit: '$' },
        B0: { name: 'balance today', q: 'money', unit: '$', value: 5000 },
        r: { name: 'card interest rate (APR)', q: 'ratio', unit: '%', value: 22, min: 10, max: 36 },
        p: { name: 'minimum payment, share of the balance', q: 'ratio', unit: '%', value: 2.5, min: 1, max: 5 },
        T: { name: 'time paying the minimum', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'Each month interest is added and $p$ of the balance is paid. Valid until the minimum reaches its floor (often a small fixed sum). With the defaults, ¤5,000 is still ¤2,241 after ten years of payments.',
      practice: { unknowns: ['B', 'T'] },
      stories: {
        B: 'You owe {B0} on a card at {r} and pay only the minimum, {p} of the balance each month. How much will you still owe after {T}?',
        T: 'You owe {B0} on a card at {r} and pay {p} of the balance each month. How long until the balance is down to {B}?'
      }
    },
    {
      name: 'Time to clear a card with a fixed payment',
      expr: 'M = B*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'M = B\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        M: { name: 'fixed monthly payment', q: 'money', unit: '$', value: 200 },
        B: { name: 'card balance', q: 'money', unit: '$', value: 5000 },
        r: { name: 'card interest rate (APR)', q: 'ratio', unit: '%', value: 22, min: 8, max: 36 },
        T: { name: 'time to clear the balance', q: 'years', unit: 'mo' }
      },
      solveFor: 'T',
      note: 'No new spending on the card. The payment must be more than the first month\'s interest, $B\\,r/12$, or the balance never falls.',
      practice: { unknowns: ['T', 'M'] },
      stories: {
        T: 'You owe {B} on a card at {r} and pay a fixed {M} each month, with no new spending. How long until it is paid off?',
        M: 'You owe {B} on a card at {r} and want it gone in {T}. What fixed monthly payment does that take?'
      }
    },
    {
      name: 'Effective yearly rate of a card',
      expr: 'ra = (1 + r/12)^12 - 1', tex: 'r_{\\text{eff}} = \\left(1 + \\frac{r}{12}\\right)^{12} - 1',
      vars: {
        ra: { name: 'effective yearly rate', q: 'ratio', unit: '%', tex: 'r_{\\text{eff}}' },
        r: { name: 'card APR (nominal, charged monthly)', q: 'ratio', unit: '%', value: 22, min: 8, max: 36 }
      },
      stories: {
        ra: 'A card charges an APR of {r}, applied monthly. What does a balance cost over a full year?',
        r: 'An unpaid card balance grows by {ra} over a year. What APR, charged monthly, does that mean?'
      }
    }
  ],
  examples: [
    {
      title: 'Inside the minimum-payment trap',
      q: 'A ¤5,000 balance at 22 %; the minimum is 2.5 % of the balance or ¤25. How much of the first minimum repays the debt, how fast does the balance shrink, and what does paying only the minimum cost?',
      steps: [
        'First month: interest $5\\,000 \\times 0.22/12 = ¤91.67$; minimum $0.025 \\times 5\\,000 = ¤125$; capital repaid ¤33.33.',
        'Each month the balance is multiplied by $1 + 0.22/12 - 0.025 = 0.99333$. It halves after $\\ln 0.5/\\ln 0.99333 = 104$ months — 8.6 years.',
        'Month by month until it is gone (the ¤25 floor finally finishes it): 314 months and ¤11,819 of interest.',
        'A fixed ¤200 a month: $n = -\\ln(1 - 5\\,000 \\times 0.01833/200)/\\ln 1.01833 = 33.7$, so 34 months and ¤1,750 of interest.'
      ],
      a: '¤33.33 of the first ¤125; 26 years and ¤11,819 at the minimum against 34 months and ¤1,750 at ¤200 a month.'
    },
    {
      title: 'Is a balance transfer worth it?',
      q: 'You owe ¤5,000 at 22 % and can pay ¤200 a month. Another card offers 0 % for 12 months with a 3 % transfer fee. Compare the first year.',
      steps: [
        'Staying: 12 months of interest on a falling balance, paying ¤200 a month, comes to about ¤961; the balance after a year is ¤3,561.',
        'Moving: the fee is $0.03 \\times 5\\,000 = ¤150$, added to the balance. After 12 payments of ¤200, $5\\,150 - 2\\,400 = ¤2{,}750$ is left.',
        'The transfer saves about ¤811 in the year — provided nothing new is spent on either card, and the ¤2,750 left is cleared or moved before the standard rate applies.'
      ],
      a: 'About ¤811 saved in the first year, and ¤811 less still owed.'
    }
  ],
  quiz: [
    { q: 'You owe ¤3,000 on a card at 24 % a year (2 % a month). How much interest is added in the first month?', answer: 60, unit: '$',
      why: '3,000 × 0.02 = ¤60. With a minimum of 2.5 % (¤75), only ¤15 would reduce the debt.' },
    { q: 'You pay the full statement balance by the due date every month. What interest do you pay on purchases, on most cards?', choices: ['The full APR', 'Half the APR', 'None', 'Interest only on the largest purchase'], a: 2,
      why: 'Paying in full within the grace period means purchases carry no interest. Cash withdrawals and fees are separate.' },
    { q: 'If you pay the minimum every month and stop spending on the card, the debt will be gone within a few years.', a: false,
      why: 'A minimum that is a percentage of the balance shrinks with it. ¤5,000 at 22 % with a 2.5 % minimum takes about 26 years.' },
    { q: 'A card\'s APR is 22 %, charged monthly. What is the effective yearly rate?', answer: 24.36, unit: '%',
      why: '(1 + 0.22/12)^12 − 1 = 0.2436: interest is charged on interest each month.' },
    { q: 'Which habit cuts a card debt\'s cost the most?', choices: ['Paying the minimum on time', 'Paying a fixed amount well above the minimum, with no new spending', 'Moving the due date', 'Earning more reward points'], a: 1,
      why: 'A fixed payment does not shrink with the balance, so the debt falls steadily: ¤200 a month clears ¤5,000 at 22 % in 34 months instead of 26 years.' }
  ],
  applications: ['Using a card for convenience without ever paying interest.', 'Seeing through the minimum payment on a statement.', 'Judging a balance-transfer offer.', 'Setting up automatic full payments.'],
  sim: 'pf-min-trap'
},

/* ================================================================ debt payoff */
{
  id: 'debt-payoff', parent: 'debt', title: 'Paying off debt: avalanche and snowball', level: 2,
  short: 'With several debts, pay every minimum and throw everything else at one target; when it is gone, roll its payment into the next. Highest rate first (avalanche) costs least; smallest balance first (snowball) gives quick wins.',
  keywords: ['debt payoff', 'debt avalanche', 'debt snowball', 'debt repayment plan', 'consolidation', 'debt free', 'pay off credit card', 'debt advice', 'insolvency', 'rollover'],
  prereq: ['credit-cards', 'amortization', 'good-and-bad-debt'],
  related: ['refinancing', 'financial-habits', 'present-bias', 'early-repayment', 'mental-accounting', 'emergency-fund', 'money-anxiety'],
  body: `
When several debts pile up, the question "which one first?" can freeze people. The method that works is simpler than it sounds:
1. **List every debt**: balance, interest rate, minimum payment.
2. **Pay the minimum on all of them**, always. Missed payments bring fees, penalty rates and damage to your credit record.
3. **Put every spare unit of money on one target debt.**
4. When the target is cleared, **roll its whole payment into the next target**. The amount thrown at debt grows each time a debt disappears.

The only real question is the order.

### Avalanche: highest rate first
Target the debt with the highest interest rate. Each extra unit of money then stops the most expensive interest, so the **avalanche always pays the least interest** of any order when the total monthly payment is fixed.

### Snowball: smallest balance first
Target the smallest balance, whatever its rate. The first debt vanishes quickly, then the next: visible wins that keep people going. Studies of people repaying real debts suggest that closing whole accounts, more than the amount repaid, helps them stay the course. If a plan you abandon costs more than a plan you finish, the snowball's extra interest can be money well spent.

### Four debts, ¤500 a month
| Debt | Balance | Rate | Minimum |
|---|---:|---:|---:|
| Card A | ¤6,000 | 24 % | ¤150 |
| Card B | ¤1,500 | 20 % | ¤40 |
| Store card | ¤800 | 18 % | ¤25 |
| Personal loan | ¤2,500 | 10 % | ¤80 |

The minimums add up to ¤295; this household can put ¤500 a month towards its debts.

| Plan | Debt-free after | Total interest | First debt cleared |
|---|---:|---:|---:|
| Minimums only (kept at today's amounts) | 82 months | ¤7,771 | month 37 |
| Avalanche | 27 months | ¤2,502 | month 21 |
| Snowball | 28 months | ¤2,919 | month 4 |

The big decision is not avalanche or snowball: both save more than ¤4,800 against minimums only and finish more than four years sooner. It is committing a fixed sum every month and rolling freed payments forward. Between the two methods the difference here is ¤417 and one month — the price of the snowball's early win. When the smallest debt also has the highest rate, the two orders are the same.

### Other tools, and their catches
- **Consolidation**: one new loan at a lower rate pays off the others. It helps if the rate is really lower than the weighted average of the debts (19.8 % above), the fees are small, and the term is not stretched. ¤10,800 at 12 % over three years costs ¤358.71 a month and ¤2,114 of interest; paying ¤500 a month on it clears it in 25 months for ¤1,429. Stretched over five years it costs only ¤240.24 a month — and ¤3,614 of interest, more than the avalanche. The real danger is the empty cards: if they fill up again, the debt has doubled.
- **Balance transfers** for card debt ([[credit-cards]]).
- **Talk to the lender** before you miss a payment: a lower rate, a pause or a payment plan is often possible, because lenders prefer that to a default.
- **Refinancing** larger loans ([[refinancing]]).
- When debts truly cannot be repaid, most countries have formal procedures — court-supervised repayment plans, debt-relief orders, personal insolvency or bankruptcy — each with serious consequences. Free, not-for-profit debt advice is the right first step. Beware companies that charge up front or promise to make debts vanish.

### After the last payment
When the last debt is gone, send the whole monthly sum to the [[emergency-fund|emergency fund]] and then to saving. You have already learned to live without it — that is a raise you gave yourself.

> [!tip] Keep the list where you see it and cross out each debt as it goes. The feeling of progress is part of the method.
`,
  ideas: [
    'Pay every minimum, put all spare money on one target, and roll each cleared payment into the next target.',
    'The avalanche (highest rate first) always pays the least interest for a given monthly sum.',
    'The snowball (smallest balance first) costs a little more but gives early wins that help people finish.',
    'Committing a fixed monthly amount matters far more than which of the two orders you choose.',
    'Consolidation helps only at a truly lower rate, without stretching the term, and with the old cards left empty.'
  ],
  pitfalls: [
    'Spread spare money evenly over all debts — Concentrating on one target clears debts faster and, with the avalanche, costs the least interest.',
    'The snowball always costs more than the avalanche — Never less, but the same when the smallest balance also has the highest rate; often the difference is modest.',
    'A consolidation loan with a lower payment is always better — A longer term can raise the total interest, and freed-up cards invite new debt.'
  ],
  formulas: [
    {
      name: 'Weighted average rate of two debts',
      expr: 'rw = (B1*r1 + B2*r2)/(B1 + B2)', tex: 'r_w = \\frac{B_1 r_1 + B_2 r_2}{B_1 + B_2}',
      vars: {
        rw: { name: 'average rate on the debts', q: 'ratio', unit: '%', tex: 'r_w' },
        B1: { name: 'balance of the first debt', q: 'money', unit: '$', value: 6000 },
        r1: { name: 'rate of the first debt', q: 'ratio', unit: '%', value: 24 },
        B2: { name: 'balance of the second debt', q: 'money', unit: '$', value: 2500 },
        r2: { name: 'rate of the second debt', q: 'ratio', unit: '%', value: 10 }
      },
      note: 'The rate a consolidation loan must beat. Add more debts in the same way: each rate weighted by its balance.',
      practice: { unknowns: ['rw', 'r2'] },
      stories: {
        rw: 'You owe {B1} at {r1} and {B2} at {r2}. What single rate would cost the same interest this month?',
        r2: 'You owe {B1} at {r1} and {B2} on a second debt; the average rate is {rw}. What rate does the second debt charge?'
      }
    },
    {
      name: 'Time to clear a debt with a fixed payment',
      expr: 'T = -ln(1 - B*r/(12*M))/(12*ln(1 + r/12))', tex: 'T = -\\frac{\\ln\\left(1 - \\dfrac{B\\,r}{12\\,M}\\right)}{12\\,\\ln(1 + r/12)}',
      vars: {
        T: { name: 'time to clear the debt', q: 'years', unit: 'mo' },
        B: { name: 'amount owed', q: 'money', unit: '$', value: 10800 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 20, min: 3, max: 36 },
        M: { name: 'paid each month', q: 'money', unit: '$', value: 500 }
      },
      note: 'The level-payment formula solved for time. It needs $M > B\\,r/12$: a payment that only covers the interest never clears anything. The defaults are close to the four debts on this page taken together.',
      practice: { unknowns: ['T', 'M', 'B'] },
      stories: {
        T: 'You owe {B} at {r} and can pay {M} a month. How long until you are debt-free?',
        M: 'You owe {B} at {r} and want to be debt-free in {T}. How much must you pay each month?',
        B: 'You can pay {M} a month at {r} and want to be debt-free in {T}. How much debt can that clear?'
      }
    }
  ],
  examples: [
    {
      title: 'The first months of an avalanche',
      q: 'The four debts above, with ¤500 a month. How is the first payment split, and what happens when Card A is cleared?',
      steps: [
        'Minimums: ¤150 + ¤40 + ¤25 + ¤80 = ¤295. The remaining ¤205 goes to Card A, the highest rate (24 %), so Card A receives ¤355.',
        'Card A\'s first month of interest is $6\\,000 \\times 0.02 = ¤120$, so its balance falls by ¤235 in the first month instead of ¤30 at its minimum.',
        'Card A is cleared in month 21. From month 22 its ¤355 joins Card B\'s ¤40: ¤395 a month clears Card B by month 24, then the store card (month 25) and the loan (month 27).',
        'Total interest: ¤2,502, against ¤7,771 paying only the minimums.'
      ],
      a: 'Card A gets ¤355 a month; everything is cleared in 27 months.'
    },
    {
      title: 'Should you consolidate?',
      q: 'The same ¤10,800 could be replaced by one loan at 12 %. Compare a three-year and a five-year term with the avalanche at ¤500 a month (¤2,502 of interest).',
      steps: [
        'Three years: $M = 10\\,800 \\times 0.01/(1 - 1.01^{-36}) = ¤358.71$; interest $36 \\times 358.71 - 10\\,800 = ¤2{,}114$.',
        'Five years: $M = ¤240.24$; interest $60 \\times 240.24 - 10\\,800 = ¤3{,}614$.',
        'Paying ¤500 a month on the 12 % loan: cleared in 25 months with about ¤1,429 of interest.',
        'The lower rate helps only while the payment stays high; the long term costs more than the avalanche.'
      ],
      a: 'Worth it at 12 % if you keep paying about ¤500 a month (¤1,429); not if the term is stretched to five years (¤3,614).'
    }
  ],
  quiz: [
    { q: 'With a fixed total monthly payment, which order of repayment pays the least interest?', choices: ['Smallest balance first', 'Highest interest rate first', 'Largest balance first', 'An equal share to each debt'], a: 1,
      why: 'Each extra unit of money stops the most expensive interest when it goes to the highest rate — the avalanche.' },
    { q: 'You owe ¤4,000 at 20 % and ¤1,000 at 10 %. What is the weighted average rate?', answer: 18, unit: '%',
      why: '(4,000 × 0.20 + 1,000 × 0.10) ÷ 5,000 = 900 ÷ 5,000 = 0.18. A consolidation loan must beat 18 % to lower the interest.' },
    { q: 'The snowball always costs more interest than the avalanche.', a: false,
      why: 'It never costs less, but when the smallest balance also has the highest rate the two orders are identical, and the difference is often modest.' },
    { q: 'Card B (minimum ¤40) is cleared under the snowball. What happens to the ¤40?', choices: ['It is spent', 'It rolls into the payment on the next target debt', 'It goes back to the card company', 'It is split among all remaining debts'], a: 1,
      why: 'Rolling each freed payment forward is what makes both methods accelerate: the total monthly sum stays the same while the number of debts falls.' },
    { q: 'A consolidation loan lowers your monthly payment from ¤500 to ¤240. What should you check before celebrating?', choices: ['Nothing: a lower payment is always better', 'The total interest over the new, longer term, the fees, and whether the old cards will stay empty', 'Only the brand of the lender', 'Whether the payment date is convenient'], a: 1,
      why: 'Stretching the term can raise the total interest (¤3,614 against ¤2,502 in the example), and refilled cards double the debt.' }
  ],
  applications: ['Turning a pile of debts into one plan with a finish date.', 'Deciding between avalanche and snowball for your own debts.', 'Judging a consolidation offer.', 'Redirecting freed-up payments into saving when the debts are gone.'],
  sim: 'pf-avalanche'
},

/* ================================================================ credit scores */
{
  id: 'credit-scores', parent: 'debt', title: 'Credit scores and credit reports', level: 1,
  short: 'Lenders judge whether you will repay from your credit report — the record of your borrowing and payments — often summarised as a score. Paying on time, using little of your limits and applying rarely are what matter nearly everywhere.',
  keywords: ['credit score', 'credit report', 'credit history', 'credit bureau', 'credit reference agency', 'FICO', 'credit utilisation', 'credit utilization', 'hard inquiry', 'credit register', 'creditworthiness'],
  prereq: ['credit-cards', 'how-loans-work'],
  related: ['debt-to-income', 'mortgage-affordability', 'loan-comparison', 'apr', 'scams-fraud', 'debt-payoff'],
  body: `
When you apply for a loan, a lender wants to know one thing: will this person pay me back? Most of what it knows comes from your **credit report**, the record of your past borrowing and repayment, and often a **credit score** that sums it up in one number.

### Reports and scores
A credit report lists your accounts — cards, loans, mortgages — with their limits and balances, whether payments arrived on time, any defaults, and recent applications for credit. In many countries it is kept by private **credit bureaus** (credit reference agencies); in others by a public **central credit register**, often run by the central bank; some countries have both.

A score turns the report into a number that predicts how likely you are to fall seriously behind on payments in the next year or two. Lenders use it to say yes or no, and more and more to set the price: a better score, a lower rate.

### What goes into a score
Each system has its own formula, and most are not fully public. The best known, the FICO score used by many lenders in the US (it runs from 300 to 850), publishes these approximate weights:

| Factor | Weight (FICO, US) | In plain words |
|---|---:|---|
| Payment history | 35 % | Have you paid on time? |
| Amounts owed | 30 % | How much of your available credit are you using? |
| Length of credit history | 15 % | How long have your accounts been open? |
| New credit | 10 % | Have you applied for a lot of credit lately? |
| Credit mix | 10 % | Different kinds of credit handled well |

Other countries and scorers weigh things differently, and some lenders build their own models. But the themes are almost universal: **pay on time, use well under your limits, and apply for credit rarely**.

### Utilisation
The share of your card limits you are using is your *utilisation*. ¤1,800 on ¤6,000 of limits is 30 %; a common guideline is to stay below about 30 %, and lower is better. Closing an unused card can push it up: the same ¤1,800 on ¤2,000 of remaining limits is 90 %.

### Why it matters in money
On a ¤250,000 mortgage over 25 years, 5 % instead of 6 % means ¤1,461.48 a month instead of ¤1,610.75 — ¤149.28 a month, about ¤44,784 over the loan. On a ¤20,000 car loan over five years, 6 % instead of 10 % saves ¤2,297. In some countries a record also matters for renting a flat or a phone contract.

### Myths
- *Checking your own report or score lowers it.* No: your own checks are "soft" and invisible to lenders; only applications for credit count.
- *Your income and savings are in your score.* Usually not; the report records borrowing, not wealth. Lenders check income separately ([[debt-to-income]]).
- *Having no credit at all is best.* Where scores are built from behaviour, an empty file can make borrowing harder. A card used lightly and paid in full each month builds a record.
- *A debt paid off disappears from the report at once.* Late payments and defaults usually stay for a number of years set by local law, weighing less as they age.

### What you can do
- In many countries you have a legal right to see your report free of charge. Check it once a year and before any large application.
- Dispute mistakes: accounts that are not yours, payments marked late that were on time. An unknown account can be a sign of identity theft ([[scams-fraud]]).
- Set up automatic payments of at least the minimum on every account: one missed payment can undo months of good behaviour.
- A damaged record does recover. Negative marks fade year by year while new, on-time payments build up.

> [!warn] Firms that promise to "repair" or "wipe" a credit report for a fee cannot remove accurate information. What they can legitimately do — dispute errors — you can do yourself, free.
`,
  ideas: [
    'A credit report records your borrowing and repayment; a score condenses it into a prediction of default.',
    'Scores are used both to approve loans and to set their rates.',
    'Almost everywhere the same behaviours help: paying on time, low utilisation of limits, few applications.',
    'Your own checks do not affect your score; applications for credit can.',
    'You can usually see your report free and dispute errors yourself.'
  ],
  pitfalls: [
    'Checking my score will lower it — Looking at your own report is a soft check that lenders do not see.',
    'Closing old cards improves my score — It can raise utilisation and shorten your history, which may lower it.',
    'A high income guarantees a good score — Scores measure how you handle credit, not how much you earn.'
  ],
  formulas: [
    {
      name: 'Credit utilisation',
      expr: 'u = B/L', tex: 'u = \\frac{B}{L}',
      vars: {
        u: { name: 'utilisation', q: 'ratio', unit: '%' },
        B: { name: 'card balances', q: 'money', unit: '$', value: 1800 },
        L: { name: 'total card limits', q: 'money', unit: '$', value: 6000 }
      },
      practice: { unknowns: ['u', 'B'] },
      stories: {
        u: 'Your card balances add up to {B} and your limits to {L}. What is your utilisation?',
        B: 'Your limits total {L} and you want to keep utilisation at {u}. What is the most you should carry?'
      }
    },
    {
      name: 'Monthly cost of a higher rate',
      expr: 'D = P*(r2/12)/(1 - (1 + r2/12)^(-12*T)) - P*(r1/12)/(1 - (1 + r1/12)^(-12*T))',
      tex: 'D = P\\,\\frac{r_2/12}{1 - (1 + r_2/12)^{-12T}} - P\\,\\frac{r_1/12}{1 - (1 + r_1/12)^{-12T}}',
      vars: {
        D: { name: 'extra paid each month', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 },
        r1: { name: 'rate with a strong record', q: 'ratio', unit: '%', value: 5, min: 1, max: 12 },
        r2: { name: 'rate with a weaker record', q: 'ratio', unit: '%', value: 6, min: 1, max: 12 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 25, min: 10, max: 35 }
      },
      note: 'The difference between two level payments. Multiply by $12T$ for the cost over the whole loan.',
      practice: { unknowns: ['D'] },
      stories: { D: 'You borrow {P} over {T}. A strong credit record would get you {r1}; a weaker one {r2}. How much more a month does the weaker record cost?' }
    }
  ],
  examples: [
    {
      title: 'What a percentage point is worth',
      q: 'A ¤250,000 mortgage over 25 years at 5 % or at 6 %. Compare the payments and the totals.',
      steps: [
        'At 5 %: $M = 250\\,000 \\times (0.05/12)/(1 - (1 + 0.05/12)^{-300}) = ¤1{,}461.48$.',
        'At 6 %: $M = ¤1{,}610.75$.',
        'Difference: ¤149.28 a month; over 300 payments, $300 \\times 149.28 = ¤44{,}784$.'
      ],
      a: '¤149.28 a month, about ¤44,784 over the loan.'
    },
    {
      title: 'Closing an old card',
      q: 'You carry ¤1,800 on card A (limit ¤2,000) and nothing on card B (limit ¤4,000). What happens to utilisation if you close card B?',
      steps: [
        'Now: $1\\,800/(2\\,000 + 4\\,000) = 30\\,\\%$.',
        'After closing B: $1\\,800/2\\,000 = 90\\,\\%$.',
        'Utilisation triples, which in most scoring systems counts against you; it can make sense to keep an unused card open, or to repay the balance first.'
      ],
      a: 'From 30 % to 90 %.'
    }
  ],
  quiz: [
    { q: 'In the published FICO weights used in the US, which factor counts most?', choices: ['Credit mix', 'Payment history', 'New credit', 'Income'], a: 1,
      why: 'Payment history is about 35 %, amounts owed about 30 %. Income is not part of the score at all.' },
    { q: 'You owe ¤900 on cards with limits totalling ¤3,000. What is your utilisation?', answer: 30, unit: '%',
      why: '900 ÷ 3,000 = 0.30. A common guideline is to stay under about 30 %, and lower is better.' },
    { q: 'Checking your own credit report lowers your score.', a: false,
      why: 'Your own look is a soft enquiry that lenders do not see. Applications for credit are the enquiries that can count.' },
    { q: 'You carry ¤1,800 on one card with a ¤2,000 limit and close another card with a ¤4,000 limit and no balance. What is your utilisation now?', answer: 90, unit: '%',
      why: 'The balance stays ¤1,800 but the limits fall to ¤2,000: 1,800 ÷ 2,000 = 90 %, up from 30 %.' },
    { q: 'A firm offers, for a fee, to remove a correctly recorded late payment from your report. What should you expect?', choices: ['It can remove it quickly', 'Accurate information cannot be removed; you can dispute real errors yourself for free', 'It will raise your score by 100 points', 'It will close all your accounts'], a: 1,
      why: 'Credit reports must be accurate, not flattering. Legitimate corrections are free to request; "repair" promises for accurate data are a warning sign.' }
  ],
  applications: ['Preparing for a mortgage or car loan application.', 'Spotting identity theft early.', 'Understanding why two people get different rates on the same loan.', 'Rebuilding after a difficult period.']
},

/* ================================================================ debt-to-income */
{
  id: 'debt-to-income', parent: 'debt', title: 'Debt-to-income and affordability', level: 2,
  short: 'Lenders measure whether you can pay by comparing your debt payments with your income. The ratio sets how much you may borrow; your own budget, and a stress test at higher rates, decide how much you should.',
  keywords: ['debt-to-income', 'DTI', 'payment-to-income', 'loan-to-income', 'affordability', 'how much can I borrow', 'stress test', 'front-end ratio', 'back-end ratio', 'DSTI'],
  prereq: ['household-budget', 'amortization', 'good-and-bad-debt'],
  related: ['mortgage-affordability', 'credit-scores', 'down-payment-ltv', 'emergency-fund', 'variable-rate-mortgages', 'mortgage-costs'],
  body: `
Before they lend, lenders ask two questions: *will* you pay — your record and [[credit-scores|credit score]] — and *can* you pay. The second is answered with ratios between what you owe each month and what you earn.

### The ratio
$$\\text{DTI} = \\frac{\\text{monthly debt payments}}{\\text{monthly income}}$$

With a gross income of ¤6,000 a month and payments of ¤350 on a car, ¤250 on a student loan and ¤100 on a card, the ratio is ¤700 ÷ ¤6,000 = 11.7 %.

Whether "income" means gross or net differs. US lenders traditionally use gross income; many regulators elsewhere write their limits on net income. Always ask which one a number refers to: 36 % of a gross ¤6,000 is ¤2,160 a month, while 36 % of a net ¤4,500 is ¤1,620.

### Limits you may meet
Every country and lender has its own rules. Some common patterns:
- **A traditional US guideline**: housing costs up to about 28 % of gross income (the "front-end" ratio) and all debt payments up to about 36 % (the "back-end" ratio). Lenders may go higher for strong applicants.
- **Payment-to-income caps** on mortgages, set by regulators and usually on net income. Israel, for example, does not allow a new mortgage payment above half of the household's regular net income.
- **Loan-to-income limits**: the UK restricts how many new mortgages may exceed 4.5 times income, and several other European countries use similar multiples.
- **Stress tests**: many lenders check that you could still pay if the rate rose by a few percentage points.

### From a ratio to a loan
Under the 36 % guideline, ¤6,000 of gross income allows ¤2,160 a month of debt payments. The existing ¤700 leaves ¤1,460 for a mortgage, which at 5 % over 25 years carries a loan of about ¤249,748:

$$P = (d\\,I - D)\\,\\frac{1 - (1 + r/12)^{-12T}}{r/12}$$

The same ¤1,460 carries about ¤307,880 at 3 % but only ¤206,571 at 7 %. That is why rising rates cool housing markets: incomes stay the same, but what they can borrow falls by a third. And clearing the ¤350 car loan before applying would add about ¤59,871 of borrowing capacity at 5 %. [The loan calculator](#/tools/money/loan) shows the full schedule for any loan you are considering.

### What the lender allows and what you can live with
A lender's maximum is not a recommendation. It does not know your childcare costs, your plans, or how secure your job is. Before borrowing near the limit:
- **Live on it first.** Put the new payment in your [[household-budget|budget]] and save the difference for a few months. If that hurts, the loan will too.
- **Stress-test it yourself.** ¤250,000 over 25 years costs ¤1,461.48 a month at 5 %, about 24 % of the ¤6,000 income; at 7 % it would be ¤1,766.95, and with the other debts 41 % of gross income. On a [[variable-rate-mortgages|variable rate]] this is not hypothetical.
- **Keep the cushion.** The [[emergency-fund|emergency fund]] should survive the deposit and the costs of buying.
- **Count everything.** Owning a home costs more than the payment: insurance, maintenance, property taxes ([[mortgage-costs]]).

> [!key] The ratio tells a lender how much you *can* borrow. Your budget tells you how much you *should*.
`,
  ideas: [
    'Debt-to-income compares monthly debt payments with monthly income; lenders use it to cap what you may borrow.',
    'Limits are written on gross income in some countries and net income in others — always check which.',
    'A maximum payment converts into a maximum loan through the level-payment formula, so rates change borrowing capacity sharply.',
    'Existing debts reduce what a new loan can be; clearing them raises capacity.',
    'Borrow by your budget and a stress test at higher rates, not by the lender\'s ceiling.'
  ],
  pitfalls: [
    'If the bank approves it, I can afford it — Approval means you fit the lender\'s rules; it does not know your other costs, plans or job security.',
    'A 36 % limit is the same wherever it applies — On gross income it allows far more than on net income; compare like with like.',
    'My payment will stay the same — On a variable or adjustable rate it can rise; test the budget at a rate two or three points higher.'
  ],
  formulas: [
    {
      name: 'Debt-to-income ratio',
      expr: 'd = D/I', tex: 'd = \\frac{D}{I}',
      vars: {
        d: { name: 'debt-to-income ratio', q: 'ratio', unit: '%' },
        D: { name: 'monthly debt payments', q: 'money', unit: '$', value: 700 },
        I: { name: 'monthly income', q: 'money', unit: '$', value: 6000 }
      },
      practice: { unknowns: ['d', 'D'] },
      stories: {
        d: 'Your debt payments are {D} a month and your income is {I} a month. What is your debt-to-income ratio?',
        D: 'Your income is {I} a month and a lender allows a ratio of {d}. What total monthly debt payments does that allow?'
      }
    },
    {
      name: 'The largest loan a ratio allows',
      expr: 'P = (d*I - D)*(1 - (1 + r/12)^(-12*T))/(r/12)', tex: 'P = (d\\,I - D)\\,\\frac{1 - (1 + r/12)^{-12T}}{r/12}',
      vars: {
        P: { name: 'largest new loan', q: 'money', unit: '$' },
        d: { name: 'allowed debt-to-income ratio', q: 'ratio', unit: '%', value: 36, min: 20, max: 50 },
        I: { name: 'monthly income', q: 'money', unit: '$', value: 6000 },
        D: { name: 'existing monthly debt payments', q: 'money', unit: '$', value: 700 },
        r: { name: 'yearly interest rate of the new loan', q: 'ratio', unit: '%', value: 5, min: 1, max: 12 },
        T: { name: 'term of the new loan', q: 'years', unit: 'yr', value: 25, min: 10, max: 35 }
      },
      note: 'The room left under the ratio, turned into a loan by the level-payment formula. Needs $d\\,I > D$.',
      practice: { unknowns: ['P', 'I'] },
      stories: {
        P: 'Your income is {I} a month, you already pay {D} a month on other debts, and the lender allows {d}. How large a loan at {r} over {T} can you get?',
        I: 'You want to borrow {P} at {r} over {T}; you pay {D} a month on other debts and the lender allows {d}. What monthly income do you need?'
      }
    },
    {
      name: 'Debt-to-income with a new loan',
      expr: 'd = (P*(r/12)/(1 - (1 + r/12)^(-12*T)) + D)/I', tex: 'd = \\frac{1}{I}\\left(P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}} + D\\right)',
      vars: {
        d: { name: 'debt-to-income ratio', q: 'ratio', unit: '%' },
        P: { name: 'new loan', q: 'money', unit: '$', value: 250000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 7, min: 1, max: 12 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 25, min: 10, max: 35 },
        D: { name: 'other monthly debt payments', q: 'money', unit: '$', value: 700 },
        I: { name: 'monthly income', q: 'money', unit: '$', value: 6000 }
      },
      note: 'A stress test: try the rate you have been offered, then the same loan two or three points higher.',
      practice: { unknowns: ['d', 'P'] },
      stories: {
        d: 'You borrow {P} over {T}. If the rate were {r}, and you also pay {D} a month on other debts from an income of {I}, what share of income would go on debt?',
        P: 'You want your debt payments to stay at {d} of your income of {I}, with {D} already committed. At {r} over {T}, how much can you borrow?'
      }
    }
  ],
  examples: [
    {
      title: 'How much can the ratio lend?',
      q: 'Gross income ¤6,000 a month; existing payments ¤700. The lender allows 36 % of gross income. What is the largest mortgage at 5 % over 25 years?',
      steps: [
        'Allowed payments: $0.36 \\times 6\\,000 = ¤2{,}160$; room for the mortgage: $2\\,160 - 700 = ¤1{,}460$.',
        '$i = 0.05/12$, $n = 300$, $(1 + i)^{-300} = 0.28725$.',
        '$P = 1\\,460 \\times (1 - 0.28725)/0.0041667 = ¤249{,}748$.'
      ],
      a: 'About ¤249,748.'
    },
    {
      title: 'A stress test',
      q: 'A ¤250,000 mortgage over 25 years, with ¤700 of other debt payments and ¤6,000 of gross income. What share of income goes on debt at 5 %, and at 7 %?',
      steps: [
        'At 5 %: payment ¤1,461.48; $(1\\,461.48 + 700)/6\\,000 = 36.0\\,\\%$.',
        'At 7 %: payment ¤1,766.95; $(1\\,766.95 + 700)/6\\,000 = 41.1\\,\\%$.',
        'Two points on the rate move the household from the edge of the guideline to well beyond it. With a fixed rate this is a question for renewal; with a variable rate it can happen within the year.'
      ],
      a: '36.0 % at 5 %; 41.1 % at 7 %.'
    }
  ],
  quiz: [
    { q: 'Your debt payments are ¤1,200 a month and your gross income ¤4,000. What is your debt-to-income ratio?', answer: 30, unit: '%',
      why: '1,200 ÷ 4,000 = 0.30, or 30 %.' },
    { q: 'Rates rise from 3 % to 7 %. What happens to the loan a fixed ¤1,460 payment can carry over 25 years?', choices: ['It barely changes', 'It falls by about a third', 'It halves exactly', 'It rises'], a: 1,
      why: 'From about ¤307,880 to about ¤206,571 — a third less. The payment is the same; each unit of it now pays more interest.' },
    { q: 'If the bank approves the loan, the payment is affordable for your household.', a: false,
      why: 'Approval means you fit the lender\'s ratios. Only your budget knows your other costs and goals, and whether you could survive a rate rise or an income drop.' },
    { q: 'A limit of 36 % of net income, with a net income of ¤4,500 a month, allows how much in monthly debt payments?', answer: 1620, unit: '$',
      why: '0.36 × 4,500 = ¤1,620 — far less than 36 % of a gross income of ¤6,000 (¤2,160). Always check which income a limit uses.' },
    { q: 'Before applying for a mortgage you pay off a car loan costing ¤350 a month. Under a debt-to-income rule, what happens?', choices: ['Nothing changes', 'The room for the mortgage payment grows by ¤350 a month, raising the loan you can get', 'Your score falls so the loan shrinks', 'The lender adds the old payment anyway'], a: 1,
      why: 'Existing payments come off the allowed total; at 5 % over 25 years, ¤350 a month is about ¤59,871 of extra borrowing capacity.' }
  ],
  applications: ['Estimating how much a lender might lend before house-hunting.', 'Stress-testing a mortgage at higher rates.', 'Deciding whether to clear a small loan before applying.', 'Comparing limits between countries and lenders.']
}

);
