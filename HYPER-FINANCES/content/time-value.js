/* HYPER-FINANCES · content/time-value.js — the time value of money: moving amounts along a
 * timeline, present and future value, annuities and perpetuities, NPV and the IRR. */
Hyper.add(

{
  id: 'time-value-of-money', parent: 'time-value', title: 'The time value of money', level: 1,
  short: 'An amount today is worth more than the same amount later, because today\'s money can earn, is safe from inflation and risk, and gives you the choice. Amounts at different dates must be moved to the same date before they can be compared.',
  keywords: ['time value of money', 'TVM', 'money today', 'discounting', 'compounding', 'timeline', 'lump sum or instalments', 'lottery annuity', 'discount rate', 'future value', 'present value'],
  prereq: ['compound-interest', 'opportunity-cost', 'inflation-purchasing-power'],
  related: ['present-value', 'annuities', 'npv', 'present-bias', 'real-vs-nominal'],
  body: `
Would you rather have ¤1,000 today or ¤1,000 in a year? Almost everyone chooses today, and they are right — even in a world without inflation. Money in hand can be put to work: at 5 % it becomes ¤1,050 in a year. Prices may rise meanwhile. A promise of future money might not be kept. And money today keeps every option open: you can always wait, but you cannot spend next year's money now without borrowing it. Together these make **the time value of money**: an amount is worth more the sooner you have it.

### Amounts at different dates are like different currencies
You would never add ¤100 to 100 of a foreign currency and call it 200 of anything; first you convert. Amounts at different dates are the same: ¤1,000 today and ¤1,000 in ten years cannot be added or compared until they are moved to the same date. The "exchange rate" between today and a year from now is $1 + r$, where $r$ is the rate you could earn — your [[opportunity-cost|opportunity cost]].

- **Forward** (compounding): $F = P\\,(1+r)^t$ — what money today becomes.
- **Backward** (discounting): $P = F/(1+r)^t$ — what a future amount is worth today, its [[present-value|present value]].

Draw a timeline, place each amount at its date, move them all to one date, and every question about loans, savings, pensions and prizes becomes arithmetic.

### A choice between two offers
¤10,000 now, or ¤12,000 in four years? Discounted at 5 %, the ¤12,000 is worth ¤9,872.43 today — a little less than ¤10,000, so the money now is better. At 4 % it is worth ¤10,257.65, and waiting wins. The two offers are equal at the **break-even rate**

$$r^{*} = \\left(\\frac{F}{P}\\right)^{1/t} - 1 = 1.2^{1/4} - 1 = 4.66\\,\\%$$

So the question "which is better?" has no answer until you know what you could do with the money in between: repay a loan at 7 %, earn 3 % on a deposit, invest at an uncertain return.

### A prize: the lump sum or the payments?
Some lotteries let a winner of a "¤1 million" jackpot take ¤50,000 a year for 20 years, the first payment now, or a single payment of ¤600,000. Discounted at 5 %, the twenty payments are worth ¤654,266 today — more than the lump. At 7 % they are worth ¤566,780, and the lump is better. The two are equal at about 6.2 %. (Taxes, the risk of the payer and your own self-control matter too — but the timeline is where the thinking starts.)

### Interest-free instalments
A shop offers a ¤1,200 item for 12 monthly payments of ¤100 at "0 %". If your money earns 5 % a year, those payments are worth ¤1,168.12 today, so the instalments are genuinely cheaper than paying ¤1,200 at once. But if paying cash earns a 3 % discount — ¤1,164 — cash wins narrowly: taking the instalments would be like borrowing at about 5.7 % a year.

> [!key] Never compare amounts at different dates directly. Move them to one date with a rate that reflects what the money could otherwise do, then compare.

People often discount the near future far more steeply than any interest rate justifies — a bird in the hand now feels worth three next month. That tendency, [[present-bias]], is the human side of the same idea, and knowing about it is half of resisting it.
`,
  ideas: [
    'An amount is worth more the sooner you have it: it can earn, it is safe from inflation and risk, and it keeps your options open.',
    'Amounts at different dates must be moved to the same date before they are added or compared.',
    'Compounding moves money forward, F = P (1 + r)^t; discounting moves it back, P = F / (1 + r)^t.',
    'Which of two offers is better depends on the rate: they are equal at the break-even rate.',
    'The rate to use is your opportunity cost — what the money could otherwise earn, or the interest it would save.'
  ],
  pitfalls: [
    'Without inflation, money today and money later would be worth the same — Money today can still earn interest, and future promises carry risk; the time value remains.',
    'The larger total is the better offer — ¤12,000 in four years is worth less than ¤10,000 now if you can earn more than 4.66 % a year.',
    '"0 % instalments" and paying cash cost the same — Spread payments are worth less in today\'s money than their total; but a cash discount can more than make up for that.'
  ],
  formulas: [
    {
      name: 'What a future amount is worth today',
      expr: 'P = F/(1 + r)^t', tex: 'P = \\frac{F}{(1+r)^{t}}',
      vars: {
        P: { name: 'present value (worth today)', q: 'money', unit: '$' },
        F: { name: 'amount received later', q: 'money', unit: '$', value: 12000 },
        r: { name: 'yearly rate (your opportunity cost)', q: 'ratio', unit: '%', value: 5, min: -50, max: 1000 },
        t: { name: 'years until it is received', q: 'years', unit: 'yr', value: 4 }
      },
      practice: { unknowns: ['P', 'F'] },
      stories: {
        P: 'You are promised {F} in {t}. If you can earn {r} a year, what is that promise worth today?',
        F: 'What amount in {t} is worth the same as {P} today, if money earns {r} a year?'
      }
    },
    {
      name: 'Break-even rate between money now and money later',
      expr: 'r = (F/P)^(1/t) - 1', tex: 'r^{*} = \\left(\\frac{F}{P}\\right)^{1/t} - 1',
      vars: {
        r: { name: 'rate at which the two offers are equal', q: 'ratio', unit: '%', signed: true, tex: 'r^{*}' },
        F: { name: 'amount offered later', q: 'money', unit: '$', value: 12000 },
        P: { name: 'amount offered now', q: 'money', unit: '$', value: 10000 },
        t: { name: 'years to wait', q: 'years', unit: 'yr', value: 4 }
      },
      note: 'If you can earn more than $r^*$, take the money now; if less, the later amount is worth more.',
      practice: { unknowns: ['r'] },
      stories: { r: 'You are offered {P} now or {F} in {t}. At what yearly rate are the two offers worth the same?' }
    }
  ],
  examples: [
    {
      title: 'Now or later?',
      q: 'You are offered ¤10,000 now or ¤12,000 in four years. Which is worth more if you can earn 5 %? If you can earn 4 %?',
      steps: [
        'At 5 %: $12{,}000 / 1.05^4 = 12{,}000 / 1.21551 = ¤9{,}872.43$ — less than ¤10,000; take the money now.',
        'At 4 %: $12{,}000 / 1.04^4 = 12{,}000 / 1.16986 = ¤10{,}257.65$ — more than ¤10,000; waiting pays.',
        'Break-even: $1.2^{1/4} - 1 = 4.66\\,\\%$.'
      ],
      a: 'Money now at 5 %, money later at 4 %; they are equal at 4.66 %.'
    },
    {
      title: 'The jackpot choice',
      q: 'A prize is paid either as ¤50,000 a year for 20 years, the first payment today, or as ¤600,000 now. Compare them at 5 %.',
      steps: [
        'The payments are an annuity due: $50{,}000 \\times \\dfrac{1 - 1.05^{-20}}{0.05} \\times 1.05$.',
        '$1.05^{-20} = 0.37689$, so the factor is $(1 - 0.37689)/0.05 \\times 1.05 = 13.0853$.',
        'Present value: $50{,}000 \\times 13.0853 = ¤654{,}266$ — more than ¤600,000.',
        'At 7 % the same payments are worth ¤566,780, less than the lump; the two are equal at about 6.2 %.'
      ],
      a: 'At 5 % the payments are worth ¤654,266 today, so they beat the ¤600,000 lump.'
    }
  ],
  quiz: [
    { q: 'You can have ¤10,000 now or ¤11,000 in two years. A safe deposit pays 6 % a year. Which is worth more today?', choices: ['¤11,000 in two years', '¤10,000 now', 'They are equal', 'It cannot be decided'], a: 1,
      why: '¤11,000 / 1.06² = ¤9,789.96, less than ¤10,000. Put the ¤10,000 in the deposit and you would have ¤11,236 in two years.' },
    { q: 'If inflation were zero forever, ¤1,000 today and ¤1,000 in five years would be worth the same.', a: false,
      why: 'Money today can still earn interest, and a future promise carries some risk of not being paid. Inflation is only one of the reasons for the time value of money.' },
    { q: 'At what yearly rate are ¤5,000 now and ¤6,000 in three years worth the same? (in per cent)', answer: 6.27, unit: '%',
      why: '(6,000 / 5,000)^(1/3) − 1 = 1.2^(1/3) − 1 = 6.27 %.' },
    { q: 'What is ¤1,000 received in one year worth today, at 5 %?', answer: 952.38, unit: '$',
      why: '1,000 / 1.05 = ¤952.38: invest that today at 5 % and you have ¤1,000 in a year.' },
    { q: 'Why can you not simply add ¤1,000 received today and ¤1,000 received in ten years?', choices: ['Because of taxes', 'Because they are at different dates, and money has a price in time', 'Because banks forbid it', 'You can: the total is ¤2,000 of value'], a: 1,
      why: 'Amounts at different dates are like different currencies: move them to one date with a rate first. At 5 %, the pair is worth ¤1,613.91 today.' }
  ],
  applications: ['Choosing between a lump sum and payments (prizes, pensions, settlements).', 'Deciding whether to pay cash or in instalments.', 'Comparing job offers, bonuses and deferred pay.', 'The foundation of every loan, bond, pension and valuation.'],
  sim: 'mi-timeline'
},

{
  id: 'present-value', parent: 'time-value', title: 'Present and future value', level: 2,
  short: 'The present value of a future amount is what you would need to invest today to have it then. Discounting shrinks distant money sharply, the more so the higher the rate — and any stream of payments is worth the sum of its discounted parts.',
  keywords: ['present value', 'PV', 'future value', 'FV', 'discounting', 'discount factor', 'discount rate', 'value additivity', 'continuous discounting', 'sinking fund', 'interest-rate sensitivity'],
  prereq: ['time-value-of-money', 'compound-interest', 'math:exponential-functions'],
  related: ['annuities', 'npv', 'bond-pricing', 'duration', 'dcf-valuation', 'real-vs-nominal', 'risk-and-return'],
  body: `
How much must you put aside today to have ¤20,000 for a child's studies in 8 years, if the money earns 4 % a year? ¤14,613.80: invested at 4 %, it grows to exactly ¤20,000. That sum is the **present value** of ¤20,000 due in 8 years, and ¤20,000 is the **future value** of ¤14,613.80. The two are the same money seen from two dates.

$$\\text{PV} = \\frac{\\text{FV}}{(1+r)^{t}}, \\qquad \\text{FV} = \\text{PV}\\,(1+r)^{t}$$

### Discount factors
The number $1/(1+r)^t$ is the **discount factor**: the value today of ¤1 due in $t$ years.

| Rate | 1 year | 5 years | 10 years | 20 years | 30 years | 50 years |
|---:|---:|---:|---:|---:|---:|---:|
| 3 % | 0.971 | 0.863 | 0.744 | 0.554 | 0.412 | 0.228 |
| 5 % | 0.952 | 0.784 | 0.614 | 0.377 | 0.231 | 0.087 |
| 8 % | 0.926 | 0.681 | 0.463 | 0.215 | 0.099 | 0.021 |

Distant money shrinks fast. At 5 %, ¤1 due in 30 years is worth ¤0.23 today, and in 50 years ¤0.09; at 8 %, just ¤0.02. That is why decisions with very long horizons — pensions, infrastructure, climate — depend so heavily on the rate chosen.

### Many payments: add the pieces
A stream of payments is worth the sum of its discounted parts — each amount moved back to today separately. ¤3,000, ¤4,000 and ¤5,000 at the ends of the next three years, discounted at 6 %:

$$\\text{PV} = \\frac{3{,}000}{1.06} + \\frac{4{,}000}{1.06^2} + \\frac{5{,}000}{1.06^3} = 2{,}830.19 + 3{,}559.99 + 4{,}198.10 = ¤10{,}588.27$$

This **additivity** is what makes present value so powerful: a loan, a bond, a business or a pension is just a list of dated amounts, and its value is one sum. Equal payments give the [[annuities|annuity]] formula; payments forever, the [[perpetuities|perpetuity]].

### Long-dated values swing with rates
When rates rise from 3 % to 5 %, ¤100,000 due in 5 years falls in present value from ¤86,261 to ¤78,353 (−9 %), but ¤100,000 due in 30 years falls from ¤41,199 to ¤23,138 (−44 %). The further away the money, the more its value today moves with interest rates. This is exactly why long-term bonds fall so much when rates rise ([[bond-pricing]], [[duration]]), and why pension funds watch rates so closely.

### Which rate?
The discount rate is the return you could earn elsewhere **at similar risk**. A promise as safe as a government's is discounted at the government's borrowing rate for that term; an uncertain business profit at a higher rate that pays for the risk ([[risk-and-return]], [[dcf-valuation]]). And stay consistent: nominal amounts with nominal rates, amounts in today's money with real rates ([[real-vs-nominal]]).

> [!key] Present value is the price of the future in today's money. Distant and uncertain amounts are worth less; the higher the rate, the steeper the discount.

### Continuous discounting
Where interest compounds continuously, as in much of financial mathematics, $\\text{PV} = \\text{FV}\\,e^{-rt}$: ¤20,000 in 8 years at 4 % is then worth ¤14,522.98.
`,
  ideas: [
    'Present value is what you would invest today to have a future amount: PV = FV / (1 + r)^t.',
    'The discount factor 1/(1 + r)^t is the value today of ¤1 due in t years.',
    'A stream of payments is worth the sum of its discounted parts.',
    'Distant amounts shrink fast and are very sensitive to the rate.',
    'Discount at the return available elsewhere at similar risk, keeping nominal and real consistent.'
  ],
  pitfalls: [
    'Discounting is only for investors — Every mortgage payment, pension choice and "pay later" offer is a present-value question.',
    'The discount rate should be the rate I hope to earn — It should be the rate you could actually earn at the same risk. A hopeful rate makes future money look too cheap to wait for, and future costs too small to worry about.',
    'Mixing real and nominal is harmless — Discounting nominal future amounts at a real rate overstates their value; use nominal with nominal and real with real.'
  ],
  formulas: [
    {
      name: 'Present value of one future amount',
      expr: 'P = F/(1 + r)^t', tex: '\\text{PV} = \\frac{\\text{FV}}{(1+r)^{t}}',
      vars: {
        P: { name: 'present value', q: 'money', unit: '$', tex: '\\text{PV}' },
        F: { name: 'future value (amount due)', q: 'money', unit: '$', value: 20000, tex: '\\text{FV}' },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 4, min: -50, max: 1000 },
        t: { name: 'years until it is due', q: 'years', unit: 'yr', value: 8 }
      },
      note: 'Solve for $\\text{FV}$ to compound instead, for $t$ to see when a sum reaches a goal, or for $r$ for the rate needed.',
      practice: { unknowns: ['P', 'F', 't', 'r'] },
      stories: {
        P: 'You will need {F} in {t}. How much must you invest today at {r} a year?',
        F: 'You invest {P} today at {r} a year. What will it be worth in {t}?',
        t: 'You invest {P} at {r} a year. How long until it reaches {F}?',
        r: 'You have {P} today and need {F} in {t}. What yearly return does that require?'
      }
    },
    {
      name: 'Present value of three yearly amounts',
      expr: 'P = C1/(1 + r) + C2/(1 + r)^2 + C3/(1 + r)^3', tex: '\\text{PV} = \\frac{C_1}{1+r} + \\frac{C_2}{(1+r)^2} + \\frac{C_3}{(1+r)^3}',
      vars: {
        P: { name: 'present value of the three amounts', q: 'money', unit: '$', tex: '\\text{PV}' },
        C1: { name: 'amount at the end of year 1', q: 'money', unit: '$', value: 3000, signed: true },
        C2: { name: 'amount at the end of year 2', q: 'money', unit: '$', value: 4000, signed: true },
        C3: { name: 'amount at the end of year 3', q: 'money', unit: '$', value: 5000, signed: true },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 6, min: 0, max: 1000 }
      },
      practice: { unknowns: ['P'] },
      stories: { P: 'You will receive {C1}, {C2} and {C3} at the ends of the next three years. At {r}, what are they worth today?' }
    },
    {
      name: 'Continuous discounting',
      expr: 'P = F*exp(-r*t)', tex: '\\text{PV} = \\text{FV}\\,e^{-r t}',
      vars: {
        P: { name: 'present value', q: 'money', unit: '$', tex: '\\text{PV}' },
        F: { name: 'future value', q: 'money', unit: '$', value: 20000, tex: '\\text{FV}' },
        r: { name: 'continuously compounded rate', q: 'ratio', unit: '%', value: 4, min: -50, max: 500 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 8 }
      },
      practice: { unknowns: ['P'] },
      stories: { P: 'At a continuously compounded {r}, what is {F} due in {t} worth today?' }
    }
  ],
  examples: [
    {
      title: 'Saving for studies',
      q: 'You want ¤20,000 in 8 years. How much must you invest today at 4 % a year?',
      steps: [
        '$1.04^8 = 1.36857$.',
        '$\\text{PV} = 20{,}000 / 1.36857 = ¤14{,}613.80$.',
        'Check: $14{,}613.80 \\times 1.36857 = ¤20{,}000$.'
      ],
      a: '¤14,613.80 today.'
    },
    {
      title: 'Rates and distance',
      q: 'Compare the present values of ¤100,000 due in 5 years and in 30 years, at 3 % and at 5 %.',
      steps: [
        'Due in 5 years: $100{,}000/1.03^5 = ¤86{,}261$ and $100{,}000/1.05^5 = ¤78{,}353$ — a 9 % fall.',
        'Due in 30 years: $100{,}000/1.03^{30} = ¤41{,}199$ and $100{,}000/1.05^{30} = ¤23{,}138$ — a 44 % fall.',
        'The distant amount is almost five times as sensitive to the rise in rates.'
      ],
      a: 'A 2-point rise cuts the 5-year value by 9 % and the 30-year value by 44 %.'
    }
  ],
  quiz: [
    { q: 'What is ¤50,000 due in 10 years worth today at 7 % a year?', answer: 25417.46, unit: '$',
      why: '50,000 / 1.07¹⁰ = 50,000 / 1.96715 = ¤25,417.46. At 7 %, money about doubles in 10 years, so the present value is about half.' },
    { q: 'A higher discount rate always lowers the present value of a future positive amount.', a: true,
      why: 'The amount is divided by (1 + r)^t, which grows with r. The effect is stronger the further away the amount is.' },
    { q: 'Interest rates rise from 3 % to 5 %. Whose present value falls more: ¤100,000 due in 5 years, or ¤100,000 due in 30 years?', choices: ['the 5-year amount', 'the 30-year amount', 'they fall by the same share', 'neither changes'], a: 1,
      why: 'The 30-year value falls by 44 %, the 5-year value by 9 %: the discount compounds over more years. Long bonds are hit hardest by rising rates for the same reason.' },
    { q: 'At 7 %, the discount factor is 0.5 for an amount due in about…', choices: ['5 years', '7 years', '10 years', '14 years'], a: 2,
      why: 'Money doubles in about 72/7 ≈ 10 years at 7 % (exactly 10.24), so ¤1 due then is worth ¤0.50 today.' },
    { q: 'A future amount stated in nominal money is discounted at a real rate. The result is…', choices: ['too high', 'too low', 'correct', 'negative'], a: 0,
      why: 'Real rates are lower than nominal ones when there is inflation, so the discount is too weak and the present value comes out too high.' }
  ],
  applications: ['Working out what to set aside today for a future goal.', 'Valuing a stream of payments: pensions, leases, settlements.', 'Understanding why long bonds and pension liabilities move with interest rates.', 'The first step of every valuation of a business or a project.'],
  sim: { id: 'mi-timeline', params: { preset: 'three' } }
},

{
  id: 'annuities', parent: 'time-value', title: 'Annuities: regular payments', level: 2,
  short: 'An annuity is a series of equal payments at regular intervals — rent, a salary, a pension, a mortgage, a savings plan. Its present and future values follow from a geometric series, and the loan payment is just the annuity formula solved for the payment.',
  keywords: ['annuity', 'ordinary annuity', 'annuity due', 'present value of an annuity', 'future value of an annuity', 'level payments', 'sinking fund', 'growing annuity', 'pension', 'savings plan', 'annuity factor'],
  prereq: ['present-value', 'compound-interest', 'math:geometric-series'],
  related: ['perpetuities', 'amortization', 'how-loans-work', 'retirement-income', 'pensions', 'npv'],
  body: `
Rent every month, a salary every month, a pension every month, a mortgage payment every month, ¤300 into a savings plan every month: much of financial life is a stream of **equal payments at regular intervals**. In finance such a stream is called an **annuity** — whatever it pays for. (Insurance companies also sell a product called an annuity, a pension for life in exchange for a lump sum; that product is one use of the idea, see [[retirement-income]].)

### What the stream is worth today
Each payment is discounted by its own date, and the discount factors form a [[math:geometric-series|geometric series]] with ratio $1/(1+i)$. Summing it gives, for $n$ payments $C$ at the end of each period and a rate $i$ per period,

$$\\text{PV} = C\\,\\frac{1 - (1+i)^{-n}}{i}$$

A pension of ¤1,000 a month for 25 years, valued at 4 % a year, is worth ¤189,452 today — although it pays ¤300,000 in total. That is the lump sum an insurer would need, at that rate, to fund it. Value it at 6 % and it is worth only ¤155,207: the higher the rate, the less future payments are worth.

### What the stream grows to
Saving the same amount every period, each deposit compounds for the time it remains:

$$\\text{FV} = C\\,\\frac{(1+i)^{n} - 1}{i}$$

¤300 a month for 30 years at 6 % a year becomes ¤301,355, of which ¤108,000 was paid in. Turned around, the formula gives the **sinking fund** payment — how much to save each period for a target. To have ¤30,000 in 5 years at 4 %, save ¤452.50 a month; you pay in ¤27,150 and interest adds the rest.

### The loan payment is an annuity
A lender hands you an amount $P$ and receives a stream of equal payments whose present value, at the loan's rate, is exactly $P$. Solving the present-value formula for the payment gives the level payment of [[amortization]]: ¤200,000 over 25 years at 4 % costs ¤1,055.67 a month.

> [!key] One formula, many uses: what a pension is worth, how much a payment can borrow, what a savings plan grows to, and how much to save for a goal.

### Payments at the start: the annuity due
Rent and many savings plans are paid at the **start** of each period. Each payment then has one period more to earn or one period less to be discounted, so every value is multiplied by $(1+i)$. Ten yearly payments of ¤1,000 at 5 % are worth ¤7,721.73 at the ends of the years, and ¤8,107.82 at the starts.

### Growing payments
Salaries, rents and inflation-linked pensions tend to rise. If the first payment is $C$ and each grows by $g$ a year,

$$\\text{PV} = \\frac{C}{r - g}\\left[1 - \\left(\\frac{1+g}{1+r}\\right)^{n}\\right]$$

A pension starting at ¤20,000 a year and rising 2 % a year for 25 years is worth ¤343,683 at 5 % — about 22 % more than the level version (¤281,879). This is why an inflation-linked pension is so much more valuable than a fixed one with the same starting amount.

Try your own savings stream in [the savings calculator](#/tools/money/save), or a loan in [the loan calculator](#/tools/money/loan). Let $n$ grow without end and you reach the [[perpetuities|perpetuity]].
`,
  ideas: [
    'An annuity is a series of equal payments at regular intervals.',
    'Present value: C (1 − (1 + i)^−n) / i. Future value: C ((1 + i)^n − 1) / i.',
    'A loan\'s level payment is the annuity formula solved for the payment.',
    'Payments at the start of each period (an annuity due) are worth (1 + i) times more.',
    'Growing payments are worth much more than level ones with the same start.'
  ],
  pitfalls: [
    'A pension paying ¤300,000 in total is worth ¤300,000 — Its value today is far less, because later payments are discounted: ¤189,452 at 4 % for ¤1,000 a month over 25 years.',
    'Twice as many payments are worth twice as much — The later payments are discounted more heavily: 20 yearly payments are worth only 1.6 times 10 of them at 5 %.',
    'Monthly payments can be valued with the yearly rate — Use the rate per period (r/12 for a nominal yearly rate) and the number of periods; mixing them gives nonsense.'
  ],
  derivation: {
    title: 'The annuity formula from a geometric series',
    steps: [
      { text: 'Discount each of the $n$ payments by its own date, with $v = 1/(1+i)$:', tex: '\\text{PV} = C\\,v + C\\,v^2 + \\cdots + C\\,v^{n}' },
      { text: 'Multiply by $v$ and subtract: all the middle terms cancel.', tex: '\\text{PV} - v\\,\\text{PV} = C\\,v - C\\,v^{n+1}' },
      { text: 'Since $1 - v = i\\,v$, divide both sides by $i\\,v$:', tex: '\\text{PV} = C\\,\\frac{1 - v^{n}}{i} = C\\,\\frac{1 - (1+i)^{-n}}{i}' },
      { text: 'Compounding the whole value forward by $n$ periods gives the future value:', tex: '\\text{FV} = \\text{PV}\\,(1+i)^{n} = C\\,\\frac{(1+i)^{n} - 1}{i}' }
    ]
  },
  formulas: [
    {
      name: 'Present value of monthly payments',
      expr: 'V = C*(1 - (1 + r/12)^(-12*T))/(r/12)', tex: '\\text{PV} = C\\,\\frac{1 - (1 + r/12)^{-12T}}{r/12}',
      vars: {
        V: { name: 'value today of the payments', q: 'money', unit: '$', tex: '\\text{PV}' },
        C: { name: 'payment at the end of each month', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly rate (compounded monthly)', q: 'ratio', unit: '%', value: 4, min: 0.01, max: 100 },
        T: { name: 'years of payments', q: 'years', unit: 'yr', value: 25 }
      },
      note: 'Solve for $C$ to find the payment a lump sum can buy (or a loan requires), or for $T$ to see how long a sum lasts.',
      practice: { unknowns: ['V', 'C', 'T'] },
      stories: {
        V: 'A pension pays {C} a month for {T}. At {r} a year, what is it worth today?',
        C: 'A lump sum of {V} is turned into monthly payments for {T} at {r} a year. How large is each payment?',
        T: 'You draw {C} a month from {V} earning {r} a year. How long does the money last?'
      }
    },
    {
      name: 'Future value of monthly saving',
      expr: 'F = C*((1 + r/12)^(12*T) - 1)/(r/12)', tex: '\\text{FV} = C\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        F: { name: 'value at the end', q: 'money', unit: '$', tex: '\\text{FV}' },
        C: { name: 'saved at the end of each month', q: 'money', unit: '$', value: 300 },
        r: { name: 'yearly rate (compounded monthly)', q: 'ratio', unit: '%', value: 6, min: 0.01, max: 100 },
        T: { name: 'years of saving', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Solved for $C$ this is the sinking-fund payment: how much to save each month for a target.',
      practice: { unknowns: ['F', 'C', 'T'] },
      stories: {
        F: 'You save {C} a month for {T} at {r} a year. How much will you have?',
        C: 'You want {F} in {T}. At {r} a year, how much must you save each month?',
        T: 'Saving {C} a month at {r} a year, how long until you have {F}?'
      }
    },
    {
      name: 'Present value of yearly payments at the start of each year (annuity due)',
      expr: 'V = C*(1 - (1 + r)^(-n))/r*(1 + r)', tex: '\\text{PV} = C\\,\\frac{1 - (1+r)^{-n}}{r}\\,(1+r)',
      vars: {
        V: { name: 'value today', q: 'money', unit: '$', tex: '\\text{PV}' },
        C: { name: 'payment at the start of each year', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 100 },
        n: { name: 'number of payments', int: true, value: 10, min: 1, max: 1000 }
      },
      practice: { unknowns: ['V', 'C'] },
      stories: {
        V: 'You will receive {C} at the start of each year for {n} years, the first today. At {r}, what is the stream worth today?',
        C: 'A stream of {n} yearly payments, the first today, is worth {V} at {r}. How large is each payment?'
      }
    },
    {
      name: 'Present value of a growing annuity',
      expr: 'V = C/(r - g)*(1 - ((1 + g)/(1 + r))^n)', tex: '\\text{PV} = \\frac{C}{r - g}\\left[1 - \\left(\\frac{1+g}{1+r}\\right)^{n}\\right]',
      vars: {
        V: { name: 'value today', q: 'money', unit: '$', tex: '\\text{PV}' },
        C: { name: 'first payment, at the end of year 1', q: 'money', unit: '$', value: 20000 },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 100 },
        g: { name: 'yearly growth of the payments', q: 'ratio', unit: '%', value: 2, min: -50, max: 4.99, signed: true },
        n: { name: 'number of yearly payments', int: true, value: 25, min: 1, max: 1000 }
      },
      note: 'For $g$ below $r$. With $g = 0$ it is the ordinary annuity.',
      practice: { unknowns: ['V', 'C'] },
      stories: {
        V: 'A pension starts at {C} a year and rises {g} a year for {n} years. At {r}, what is it worth today?',
        C: 'A pot of {V} buys a pension rising {g} a year for {n} years, valued at {r}. What is the first year\'s payment?'
      }
    }
  ],
  examples: [
    {
      title: 'What a pension is worth',
      q: 'A pension pays ¤1,000 at the end of every month for 25 years. What is it worth today at 4 % a year?',
      steps: [
        'Monthly rate $i = 0.04/12 = 0.0033333$; $n = 300$ payments.',
        '$(1+i)^{-300} = 0.36849$.',
        '$\\text{PV} = 1{,}000 \\times (1 - 0.36849)/0.0033333 = ¤189{,}452$.'
      ],
      a: '¤189,452 — against ¤300,000 paid out in total.'
    },
    {
      title: 'Saving for a target',
      q: 'You want ¤30,000 in 5 years for a car or a deposit. Your savings earn 4 % a year. How much must you save each month?',
      steps: [
        '$i = 0.0033333$, $n = 60$, $(1+i)^{60} = 1.22100$.',
        '$C = \\text{FV} \\cdot i / ((1+i)^{n} - 1) = 30{,}000 \\times 0.0033333 / 0.22100 = ¤452.50$.',
        'You pay in $60 \\times 452.50 = ¤27{,}150$; interest adds about ¤2,850.'
      ],
      a: 'About ¤452.50 a month.'
    },
    {
      title: 'A growing pension',
      q: 'Compare a pension of ¤20,000 a year for 25 years with one that starts at ¤20,000 and rises 2 % a year, both valued at 5 %.',
      steps: [
        'Level: $20{,}000 \\times (1 - 1.05^{-25})/0.05 = ¤281{,}879$.',
        'Growing: $\\dfrac{20{,}000}{0.05 - 0.02}\\left[1 - \\left(\\dfrac{1.02}{1.05}\\right)^{25}\\right] = 666{,}667 \\times 0.51552 = ¤343{,}683$.',
        'The growing pension is worth 22 % more.'
      ],
      a: '¤281,879 level against ¤343,683 growing.'
    }
  ],
  quiz: [
    { q: 'Two annuities pay the same ¤1,000 a year for 10 years, one at the start of each year and one at the end. Which is worth more today?', choices: ['the one paid at the start', 'the one paid at the end', 'they are worth the same', 'it depends on inflation only'], a: 0,
      why: 'Each payment arrives a year sooner, so it is discounted one period less: the annuity due is worth (1 + i) times as much — ¤8,107.82 against ¤7,721.73 at 5 %.' },
    { q: 'What are 10 yearly payments of ¤1,000, at the ends of the years, worth today at 5 %?', answer: 7721.73, unit: '$',
      why: '1,000 × (1 − 1.05⁻¹⁰)/0.05 = 1,000 × 7.7217 = ¤7,721.73.' },
    { q: 'Doubling the number of payments of an annuity doubles its present value.', a: false,
      why: 'The extra payments come later and are discounted more: at 5 %, 20 yearly payments are worth 1.61 times 10 of them.' },
    { q: 'You save ¤200 a month for 20 years at 6 % a year, compounded monthly. How much do you have at the end?', answer: 92408.18, unit: '$',
      why: '200 × (1.005²⁴⁰ − 1)/0.005 = 200 × 462.04 = ¤92,408.18, from ¤48,000 paid in.' },
    { q: 'The monthly payment on a loan is set so that…', choices: ['the payments add up to twice the loan', 'the present value of the payments, at the loan\'s rate, equals the amount borrowed', 'the interest is the same every month', 'the loan is repaid in exactly 25 years'], a: 1,
      why: 'A loan is an annuity from the lender\'s side: the stream of payments, discounted at the loan\'s rate, is worth exactly what was lent.' }
  ],
  applications: ['Valuing a pension, and comparing a lump sum with an income.', 'Working out what a savings plan grows to, or what a goal needs.', 'Loan and mortgage payments.', 'Leases, rents and any contract of regular payments.'],
  sim: 'mi-annuity'
},

{
  id: 'perpetuities', parent: 'time-value', title: 'Perpetuities', level: 2,
  short: 'A perpetuity pays the same amount forever, yet has a finite value: the payment divided by the rate. The idea values endowments, very long bonds and the "terminal value" of businesses — and shows how strongly long-lived things react to interest rates.',
  keywords: ['perpetuity', 'growing perpetuity', 'C/r', 'Gordon growth', 'consol', 'endowment', 'terminal value', 'perpetual bond', 'infinite series', 'capitalisation rate'],
  prereq: ['annuities', 'present-value', 'math:geometric-series'],
  related: ['dividend-discount-model', 'dcf-valuation', 'bond-pricing', 'duration', 'financial-independence', 'rental-yield'],
  body: `
Suppose a payment of ¤1,000 arrives every year, forever. Infinitely many payments — surely an infinite value? Not at all. Put ¤20,000 in an account paying 5 % and withdraw the interest, ¤1,000, every year: the capital is never touched and the payments go on forever. So ¤20,000 buys exactly that stream, and a **perpetuity** paying $C$ a year at a rate $r$ is worth

$$\\text{PV} = \\frac{C}{r}$$

### Why infinity adds up to something finite
Each payment is discounted by one more factor of $1+r$, so the far payments become tiny. The values form a [[math:geometric-series|geometric series]] whose sum converges. At 5 %, half the value of a perpetuity comes from the first 14.2 years of payments, 77 % from the first 30, and 91 % from the first 50. The distant future matters, but less and less.

This also shows how an [[annuities|annuity]] relates to a perpetuity: $n$ payments are a perpetuity starting now *minus* a perpetuity starting after $n$ years, which gives $\\frac{C}{r}\\left[1 - (1+r)^{-n}\\right]$ — the annuity formula again.

### Rates move long-lived values a lot
At 5 %, ¤1,000 a year forever is worth ¤20,000; at 4 %, ¤25,000 — 25 % more for a single percentage point. Things whose payments stretch far into the future — very long bonds, property, shares of steady businesses — react strongly to interest rates, which is part of why falling rates tend to lift the prices of property and shares, and rising rates press them down ([[duration]], [[bond-pricing]]).

### Growing forever
If the payment grows by $g$ a year, starting with $C$ at the end of the first year, the value is

$$\\text{PV} = \\frac{C}{r - g} \\qquad (g < r)$$

¤1,000 growing 2 % a year, at 5 %, is worth ¤33,333. As $g$ approaches $r$ the value explodes, and for $g \\ge r$ the formula means nothing: no stream can grow faster than the discount rate forever. This is the **Gordon growth** formula behind the [[dividend-discount-model]] and the "terminal value" of a [[dcf-valuation|discounted cash-flow valuation]] — and the reason such valuations should be treated with care: a small change in $r - g$ changes everything.

> [!warn] In $C/(r - g)$ the denominator is a difference of two estimates. With $r$ = 7 % and $g$ = 3 % it is 4 %; nudge each by half a point in opposite directions and it becomes 3 %, raising the value by a third.

### Where perpetuities live
- **Perpetual bonds.** The British government's *consols*, first issued in the 1750s, paid interest with no date of repayment; the last were repaid in 2015. A few companies and banks still issue perpetual bonds.
- **Endowments.** A university or foundation that spends about 4–5 % of its fund a year hopes to support its purpose forever: a ¤5,000,000 endowment spending 4 % provides ¤200,000 a year.
- **Land and property.** A rent that is expected to continue indefinitely makes a property's value roughly rent divided by a rate — the *cap rate* of [[rental-yield]].
- **Financial independence.** Spending ¤30,000 a year forever, rising with prices, from investments earning 3 % after inflation needs ¤30,000 / 0.03 = ¤1,000,000. Plans that only need to last 30 years can spend somewhat more ([[financial-independence]]).
`,
  ideas: [
    'A perpetuity pays forever, yet is worth a finite C / r.',
    'Its value is dominated by the nearer payments: at 5 %, half comes from the first 14 years.',
    'A growing perpetuity is worth C / (r − g), and only makes sense for g < r.',
    'Long-lived values are very sensitive to rates: from 5 % to 4 %, a perpetuity gains 25 %.',
    'An annuity is a perpetuity now minus a perpetuity that starts after n payments.'
  ],
  pitfalls: [
    'Infinitely many payments must be worth an infinite amount — Discounting makes distant payments shrink geometrically, so the sum converges to C / r.',
    'A small change in the growth assumption changes the value a little — In C / (r − g) it changes the denominator, which can be small: with r − g at 3 %, raising g by half a point raises the value by a fifth.',
    'C / r uses the payment made today — The formula values payments starting one period from now; if the first payment is today, add it: C + C / r.'
  ],
  derivation: {
    title: 'Summing a stream that never ends',
    steps: [
      { text: 'Discount each payment by its date:', tex: '\\text{PV} = \\frac{C}{1+r} + \\frac{C}{(1+r)^2} + \\frac{C}{(1+r)^3} + \\cdots' },
      { text: 'This is a geometric series with first term $C/(1+r)$ and ratio $q = 1/(1+r) < 1$, so it converges to first term ÷ $(1 - q)$:', tex: '\\text{PV} = \\frac{C/(1+r)}{1 - 1/(1+r)} = \\frac{C/(1+r)}{r/(1+r)} = \\frac{C}{r}' },
      { text: 'With payments growing by $g$ the ratio is $q = (1+g)/(1+r)$, which is below 1 only if $g < r$:', tex: '\\text{PV} = \\frac{C/(1+r)}{1 - (1+g)/(1+r)} = \\frac{C}{r - g}' }
    ]
  },
  formulas: [
    {
      name: 'Value of a perpetuity',
      expr: 'V = C/r', tex: '\\text{PV} = \\frac{C}{r}',
      vars: {
        V: { name: 'value today', q: 'money', unit: '$', tex: '\\text{PV}' },
        C: { name: 'payment each year, starting in one year', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 1000 }
      },
      note: 'Solve for $C$ to see what a fund can pay out forever, or for $r$ to find the yield of a price.',
      practice: { unknowns: ['V', 'C', 'r'] },
      stories: {
        V: 'A stream pays {C} a year forever. At {r}, what is it worth?',
        C: 'A fund of {V} earns {r} a year. How much can it pay out each year forever?',
        r: 'A perpetual payment of {C} a year sells for {V}. What yield does that imply?'
      }
    },
    {
      name: 'Value of a growing perpetuity (Gordon)',
      expr: 'V = C/(r - g)', tex: '\\text{PV} = \\frac{C}{r - g}',
      vars: {
        V: { name: 'value today', q: 'money', unit: '$', tex: '\\text{PV}' },
        C: { name: 'first payment, one year from now', q: 'money', unit: '$', value: 1000 },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 1000 },
        g: { name: 'yearly growth of the payment', q: 'ratio', unit: '%', value: 2, min: -50, max: 100, signed: true }
      },
      note: 'Only for $g < r$. Solve for $g$ to find the growth a price assumes.',
      practice: { unknowns: ['V', 'g'] },
      stories: {
        V: 'A payment of {C} next year grows {g} a year forever. At {r}, what is the stream worth?',
        g: 'A stream starting at {C} next year is priced at {V} with a discount rate of {r}. What growth does that price assume?'
      }
    },
    {
      name: 'Share of a perpetuity\'s value paid in the first n years',
      expr: 'S = 1 - (1 + r)^(-n)', tex: 'S = 1 - (1+r)^{-n}',
      vars: {
        S: { name: 'share of the value from the first n payments', q: 'ratio', unit: '%' },
        r: { name: 'yearly discount rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 1000 },
        n: { name: 'years of payments counted', value: 30, min: 0, max: 100000 }
      },
      note: 'Solve for $n$ with $S$ = 50 % to find the "half-life" of a perpetuity: at 5 %, 14.2 years.',
      practice: { unknowns: ['S', 'n'] },
      stories: {
        S: 'At {r}, what share of a perpetuity\'s value comes from its first {n} years of payments?',
        n: 'At {r}, how many years of payments make up {S} of a perpetuity\'s value?'
      }
    }
  ],
  examples: [
    {
      title: 'An endowment',
      q: 'A foundation wants to fund a scholarship of ¤25,000 a year forever. If its fund earns 5 % a year, how large must the fund be? And if it earns 4 %?',
      steps: [
        'At 5 %: $\\text{PV} = 25{,}000 / 0.05 = ¤500{,}000$.',
        'At 4 %: $\\text{PV} = 25{,}000 / 0.04 = ¤625{,}000$.',
        'One percentage point less return requires a quarter more capital.'
      ],
      a: '¤500,000 at 5 %, ¤625,000 at 4 %.'
    },
    {
      title: 'A growing stream',
      q: 'A payment of ¤1,000 next year is expected to grow 2 % a year forever. What is it worth at 5 %? At 4 %?',
      steps: [
        'At 5 %: $1{,}000 / (0.05 - 0.02) = ¤33{,}333$.',
        'At 4 %: $1{,}000 / (0.04 - 0.02) = ¤50{,}000$.',
        'A one-point fall in the rate raised the value by half, because $r - g$ fell from 3 % to 2 %.'
      ],
      a: '¤33,333 at 5 %, ¤50,000 at 4 %.'
    }
  ],
  quiz: [
    { q: 'What is ¤600 a year forever worth at 4 %?', answer: 15000, unit: '$',
      why: '600 / 0.04 = ¤15,000. Check: 4 % of ¤15,000 is ¤600 a year, forever, without touching the capital.' },
    { q: 'The discount rate falls from 5 % to 4 %. The value of a level perpetuity…', choices: ['rises by 1 %', 'rises by 20 %', 'rises by 25 %', 'falls by 20 %'], a: 2,
      why: 'C/0.04 divided by C/0.05 = 1.25: a 25 % rise. Long-lived values are very sensitive to rates.' },
    { q: 'A perpetuity whose payments grow faster than the discount rate still has a finite value, just a very large one.', a: false,
      why: 'For g ≥ r the discounted payments do not shrink, so the series does not converge; the formula C/(r − g) no longer applies. No stream can grow faster than the discount rate forever.' },
    { q: 'An endowment of ¤5,000,000 spends 4 % of its value each year. How much does it provide a year?', answer: 200000, unit: '$',
      why: '5,000,000 × 0.04 = ¤200,000 a year, which can continue indefinitely if the fund earns 4 % after costs (and more if payments are to keep pace with inflation).' },
    { q: 'At 5 %, what share of a perpetuity\'s value comes from the first 30 years of payments?', choices: ['about 30 %', 'about 50 %', 'about 77 %', 'about 99 %'], a: 2,
      why: '1 − 1.05⁻³⁰ = 1 − 0.231 = 0.769. The first 30 years carry most of the value; the infinite remainder only 23 %.' }
  ],
  applications: ['Endowments and foundations that must last indefinitely.', 'Perpetual bonds and very long-dated investments.', 'The terminal value in company valuations and the dividend discount model.', 'A quick check of how much capital a lasting income needs.'],
  history: 'Perpetual government bonds date from the 18th century: Britain consolidated several of its debts into "consols" in 1751–1752, and the last of them were repaid in 2015.',
  sim: { id: 'mi-annuity', params: { forever: true } }
},

{
  id: 'npv', parent: 'time-value', title: 'Net present value', level: 2,
  short: 'Net present value adds up all the money a choice will cost and bring, each amount discounted to today. A positive NPV means the choice beats simply investing the money at your discount rate; a negative one means it does not.',
  keywords: ['net present value', 'NPV', 'discounted cash flow', 'investment appraisal', 'capital budgeting', 'hurdle rate', 'cost of capital', 'payback period', 'NPV profile', 'project evaluation'],
  prereq: ['present-value', 'annuities', 'opportunity-cost'],
  related: ['irr', 'dcf-valuation', 'rent-vs-buy', 'break-even', 'costs-and-profit', 'risk-and-return'],
  body: `
Solar panels cost ¤8,000 to install and cut your electricity bill by ¤1,000 a year for 15 years (round numbers for illustration). They pay for themselves in 8 years, and over their life they save ¤15,000. Are they worth it? Not necessarily: the ¤8,000 could have been earning something elsewhere, and a saving in year 15 is worth less than one today. **Net present value** settles it by moving every amount to today and adding them up:

$$\\text{NPV} = \\sum_{t=0}^{n} \\frac{C_t}{(1+r)^t} = C_0 + \\frac{C_1}{1+r} + \\frac{C_2}{(1+r)^2} + \\cdots$$

with the costs negative and the benefits positive, and $r$ the discount rate — the return you could otherwise earn at similar risk.

### Reading the answer
For the panels, the fifteen savings are an [[annuities|annuity]]. At 5 % they are worth ¤10,379.66 today, so $\\text{NPV} = 10{,}379.66 - 8{,}000 = +¤2{,}379.66$. At 8 %, ¤559.48. At 10 %, $-¤393.92$.

- **NPV > 0**: the choice beats investing the same money at $r$; it makes you richer by the NPV, in today's money.
- **NPV = 0**: it earns exactly $r$ — no better, no worse than the alternative.
- **NPV < 0**: the alternative at $r$ is better.

So whether the panels are "worth it" depends on your alternative. If the money would otherwise repay a mortgage at 5 %, they add value; if it would otherwise earn 10 % (with similar risk), they do not.

### The NPV profile
Plot NPV against the discount rate and, for a project whose costs come first, the curve falls as the rate rises: distant benefits shrink faster than the cost up front. The rate where it crosses zero is the project's [[irr|internal rate of return]] — 9.13 % for the panels. The simulation below lets you drag the cash flows and watch the curve move.

> [!key] NPV answers the question "how much richer does this make me, in today's money, compared with my best alternative?" — which is almost always the question that matters.

### A business example
A machine costs ¤20,000 and is expected to bring ¤6,000, ¤8,000, ¤9,000 and ¤5,000 over four years. At 10 %, the inflows are worth ¤5,454.55 + ¤6,611.57 + ¤6,761.83 + ¤3,415.07 = ¤22,243.02, so the NPV is +¤2,243.02. Among options that exclude each other, the one with the largest NPV adds the most value — not necessarily the one with the highest return in per cent.

### Why not just the payback period?
"It pays for itself in 8 years" ignores two things: when the money comes, and what happens after the payback. The panels pay back in 8 years of a 15-year life, yet at 10 % their NPV is negative. Payback is a useful sense of risk — how long your money is exposed — but not a measure of value.

### Getting the inputs right
NPV is only as good as the numbers put in:
- **Include everything**: maintenance, repairs, insurance, taxes, the value left at the end, and the time you will spend.
- **Leave out sunk costs**: money already spent is the same whatever you choose ([[opportunity-cost]]).
- **Be consistent**: nominal cash flows with a nominal rate, today's money with a real rate ([[real-vs-nominal]]).
- **Respect uncertainty**: try pessimistic and optimistic forecasts and several rates. If the answer flips, you have learned where the risk lies.

The same reasoning compares renting with buying a home ([[rent-vs-buy]]), a lease with a purchase, or a course of study with the income given up, and it is the core of valuing a company ([[dcf-valuation]]).
`,
  ideas: [
    'NPV is the sum of all cash flows, each discounted to today: costs negative, benefits positive.',
    'A positive NPV means the choice beats investing the money at the discount rate; it adds that much value today.',
    'For costs-first projects NPV falls as the rate rises, crossing zero at the IRR.',
    'Among mutually exclusive choices of similar risk, the largest NPV adds the most value.',
    'Payback periods ignore timing and later cash flows; NPV does not.'
  ],
  pitfalls: [
    'It pays for itself, so it is worth doing — Paying back the cost in nominal money says nothing about what the money could have earned meanwhile. The panels pay back in 8 years yet lose value at 10 %.',
    'A positive NPV guarantees a good outcome — NPV is computed from forecasts. It is the value if the forecasts come true; test it against worse ones.',
    'The project with the highest percentage return is the best — A small project can have a high return and a small NPV; when you can only choose one, compare NPVs.'
  ],
  formulas: [
    {
      name: 'NPV of a cost followed by level yearly savings',
      expr: 'N = -C + S*(1 - (1 + r)^(-n))/r', tex: '\\text{NPV} = -C + S\\,\\frac{1 - (1+r)^{-n}}{r}',
      vars: {
        N: { name: 'net present value', q: 'money', unit: '$', signed: true, tex: '\\text{NPV}' },
        C: { name: 'cost today', q: 'money', unit: '$', value: 8000 },
        S: { name: 'saving or income at the end of each year', q: 'money', unit: '$', value: 1000 },
        r: { name: 'discount rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 100 },
        n: { name: 'years of savings', int: true, value: 15, min: 1, max: 1000 }
      },
      note: 'Solve for $r$ with $\\text{NPV} = 0$ to find the internal rate of return, or for $S$ to find the yearly saving needed to break even.',
      practice: { unknowns: ['N', 'S'] },
      stories: {
        N: 'An investment costs {C} and saves {S} a year for {n} years. At a discount rate of {r}, what is its NPV?',
        S: 'An investment costs {C} and runs for {n} years. At {r}, how much must it save each year for an NPV of {N}?'
      }
    },
    {
      name: 'NPV of a three-year project',
      expr: 'N = C0 + C1/(1 + r) + C2/(1 + r)^2 + C3/(1 + r)^3', tex: '\\text{NPV} = C_0 + \\frac{C_1}{1+r} + \\frac{C_2}{(1+r)^2} + \\frac{C_3}{(1+r)^3}',
      vars: {
        N: { name: 'net present value', q: 'money', unit: '$', signed: true, tex: '\\text{NPV}' },
        C0: { name: 'cash flow today (a cost is negative)', q: 'money', unit: '$', value: -10000, signed: true },
        C1: { name: 'cash flow at the end of year 1', q: 'money', unit: '$', value: 4000, signed: true },
        C2: { name: 'cash flow at the end of year 2', q: 'money', unit: '$', value: 5000, signed: true },
        C3: { name: 'cash flow at the end of year 3', q: 'money', unit: '$', value: 4000, signed: true },
        r: { name: 'discount rate', q: 'ratio', unit: '%', value: 8, min: 0, max: 1000 }
      },
      practice: { unknowns: ['N'] },
      stories: { N: 'A project has cash flows of {C0} today, then {C1}, {C2} and {C3} at the ends of the next three years. At {r}, what is its NPV?' }
    }
  ],
  examples: [
    {
      title: 'Solar panels at three rates',
      q: 'Panels cost ¤8,000 and save ¤1,000 a year for 15 years. Find the NPV at 5 %, 8 % and 10 %.',
      steps: [
        'Annuity factor at 5 %: $(1 - 1.05^{-15})/0.05 = 10.3797$; the savings are worth ¤10,379.66; $\\text{NPV} = +¤2{,}379.66$.',
        'At 8 %: factor 8.5595; savings ¤8,559.48; $\\text{NPV} = +¤559.48$.',
        'At 10 %: factor 7.6061; savings ¤7,606.08; $\\text{NPV} = -¤393.92$.'
      ],
      a: '+¤2,379.66, +¤559.48 and −¤393.92: worth it against a 5 % or 8 % alternative, not against 10 %.'
    },
    {
      title: 'A machine for a small business',
      q: 'A machine costs ¤20,000 and should bring ¤6,000, ¤8,000, ¤9,000 and ¤5,000 at the ends of the next four years. What is its NPV at 10 %?',
      steps: [
        'Discount each inflow: $6{,}000/1.1 = 5{,}454.55$; $8{,}000/1.1^2 = 6{,}611.57$; $9{,}000/1.1^3 = 6{,}761.83$; $5{,}000/1.1^4 = 3{,}415.07$.',
        'Sum of the inflows: ¤22,243.02.',
        '$\\text{NPV} = 22{,}243.02 - 20{,}000 = +¤2{,}243.02$.'
      ],
      a: 'NPV ≈ +¤2,243 at 10 %.'
    }
  ],
  quiz: [
    { q: 'At your discount rate, a project\'s NPV is exactly zero. This means the project…', choices: ['loses money', 'earns exactly your discount rate', 'earns nothing at all', 'has no risk'], a: 1,
      why: 'A zero NPV means the project\'s cash flows are worth exactly what they cost when discounted at r: it earns r, no more and no less.' },
    { q: 'You pay ¤1,000 today and receive ¤1,100 in one year. What is the NPV at 5 %?', answer: 47.62, unit: '$',
      why: '−1,000 + 1,100/1.05 = −1,000 + 1,047.62 = ¤47.62.' },
    { q: 'For a project with a cost now and benefits later, raising the discount rate…', choices: ['raises the NPV', 'lowers the NPV', 'leaves the NPV unchanged', 'makes the NPV exactly zero'], a: 1,
      why: 'The benefits are discounted more heavily while the cost today is not discounted at all, so the NPV falls.' },
    { q: 'Two projects exclude each other and have the same risk. A has an NPV of ¤5,000 and an IRR of 12 %; B an NPV of ¤3,000 and an IRR of 25 %. Which adds more value at your discount rate?', choices: ['A', 'B', 'they are equal', 'impossible to say'], a: 0,
      why: 'NPV measures the value added in money. B earns a higher percentage, probably on a smaller amount, but A makes you ¤2,000 richer than B.' },
    { q: 'An investment that pays back its cost in 8 years and lasts 15 years must have a positive NPV.', a: false,
      why: 'Payback ignores the time value of money. The solar panels (¤8,000, then ¤1,000 a year for 15 years) pay back in 8 years but have an NPV of −¤393.92 at 10 %.' }
  ],
  applications: ['Deciding whether an investment in a home, a car, panels or insulation pays.', 'Comparing a lease with a purchase, or renting with buying.', 'Business investment decisions (capital budgeting).', 'The core of discounted cash-flow valuation.'],
  sim: 'mi-npv-irr'
},

{
  id: 'irr', parent: 'time-value', title: 'The internal rate of return', level: 3,
  short: 'The internal rate of return is the discount rate that makes a set of cash flows\' NPV exactly zero — the interest rate the investment itself pays. It is intuitive and widely used, but it has traps: several IRRs, none at all, and blindness to size.',
  keywords: ['internal rate of return', 'IRR', 'hurdle rate', 'money-weighted return', 'time-weighted return', 'multiple IRR', 'MIRR', 'NPV profile', 'yield', 'APR', 'yield to maturity'],
  prereq: ['npv', 'present-value', 'math:polynomials'],
  related: ['apr', 'yield-to-maturity', 'compounding-returns', 'dcf-valuation', 'rent-vs-buy'],
  body: `
The solar panels of the [[npv]] page cost ¤8,000 and save ¤1,000 a year for 15 years. At what rate does their NPV become exactly zero? At **9.13 %**. That rate is the **internal rate of return**: the panels behave like a savings account paying 9.13 % a year on the money still tied up in them. If your alternative earns less than that, the panels are the better use of the money; if it earns more, they are not.

$$0 = \\sum_{t=0}^{n} \\frac{C_t}{(1+\\text{IRR})^t}$$

### How it is found
For a single investment and a single payout the IRR is just the compound growth rate: ¤1,000 that becomes ¤1,210 in two years has an IRR of $\\sqrt{1.21} - 1 = 10\\,\\%$. With more cash flows, the equation is a [[math:polynomials|polynomial]] in $1/(1+\\text{IRR})$ and has no formula; it is solved by trial — guess a rate, compute the NPV, adjust — by bisection, or by [[math:newtons-method|Newton's method]]. Spreadsheets and [the returns calculator](#/tools/money/returns) do it in an instant.

### The rule, and why it usually agrees with NPV
For an ordinary project — money out first, money in later — the NPV falls as the rate rises and crosses zero once, at the IRR. So **IRR above your discount rate** means **NPV positive**, and the two rules agree on whether to go ahead.

### Your own return is an IRR
Put ¤10,000 into an investment, add ¤5,000 a year later, and find it worth ¤17,000 after two years. Your personal return — the **money-weighted return** — is the IRR of $-10{,}000$, $-5{,}000$ and $+17{,}000$: 7.76 % a year. It depends on when *you* added money. A fund's published return is **time-weighted**: it ignores deposits and withdrawals. If a fund gains 20 % and then loses 10 %, its time-weighted return is 3.92 % a year; an investor who put in ¤10,000 at the start and added ¤5,000 just before the bad year ended with ¤15,300 and earned only 1.19 % a year. Both numbers are right; they answer different questions.

The same idea is everywhere: a loan's [[apr|APR]] is the IRR of the money received and the payments made, and a bond's [[yield-to-maturity]] is the IRR of buying it and holding it to the end.

### The traps
- **Several IRRs.** If the cash flows change sign more than once, there can be more than one IRR. Pay ¤10,000, receive ¤23,000 a year later, then pay ¤13,200 to close the project: the NPV is zero at both 10 % and 20 %, and the IRR rule says nothing useful. The NPV at your rate still does. (The simulation below opens on this case; switch to the other projects to see ordinary ones.)
- **No IRR at all.** Flows that are all positive, or all negative, never give zero NPV.
- **Blind to size.** 40 % on ¤1,000 for a year adds ¤272.73 of value at 10 %; 15 % on ¤100,000 adds ¤4,545.45. When you can only choose one, compare NPVs.
- **Blind to duration.** A high IRR earned for one year is not the same as the same IRR for twenty; the IRR says nothing about how long your money is at work. And a high IRR only describes your whole money if the cash thrown off along the way can be reinvested at a similar rate — the *modified IRR* (MIRR) makes that reinvestment rate explicit.

> [!key] The IRR is the investment's own interest rate: compare it with what your money could otherwise earn. For decisions between alternatives, and whenever the cash flows change sign more than once, trust the NPV.
`,
  ideas: [
    'The IRR is the discount rate at which a project\'s NPV is zero.',
    'For ordinary projects (costs first), IRR above the discount rate means NPV above zero.',
    'It is found numerically: by trial, bisection or Newton\'s method.',
    'Your personal (money-weighted) return, a loan\'s APR and a bond\'s yield are all IRRs.',
    'It can mislead: several IRRs when signs change more than once, and blindness to size and duration.'
  ],
  pitfalls: [
    'The higher IRR is always the better project — Not when projects differ in size or length: 40 % on ¤1,000 adds less value than 15 % on ¤100,000. Compare NPVs.',
    'Every set of cash flows has one IRR — Flows that change sign more than once can have several; flows of one sign have none.',
    'My return equals the fund\'s published return — The fund reports a time-weighted return; yours depends on when you put money in and took it out (the money-weighted return, an IRR).'
  ],
  formulas: [
    {
      name: 'IRR of a cost followed by level yearly income',
      expr: 'C = S*(1 - (1 + r)^(-n))/r', tex: 'C = S\\,\\frac{1 - (1+\\text{IRR})^{-n}}{\\text{IRR}}',
      vars: {
        C: { name: 'cost today', q: 'money', unit: '$', value: 8000 },
        S: { name: 'income or saving at the end of each year', q: 'money', unit: '$', value: 1000 },
        r: { name: 'internal rate of return', q: 'ratio', unit: '%', min: 0.001, max: 1000, tex: '\\text{IRR}' },
        n: { name: 'years of income', int: true, value: 15, min: 1, max: 1000 }
      },
      solveFor: 'r',
      note: 'The cost equals the present value of the income when discounted at the IRR. There is no formula for the IRR: the calculator finds it numerically.',
      practice: { unknowns: ['r', 'S'] },
      stories: {
        r: 'An investment costs {C} and brings {S} at the end of each year for {n} years. What is its internal rate of return?',
        S: 'An investment costing {C} is to earn an IRR of {r} over {n} years. What yearly income does it need?'
      }
    },
    {
      name: 'IRR of an investment paying back over two years',
      expr: 'P = C1/(1 + r) + C2/(1 + r)^2', tex: 'P = \\frac{C_1}{1+\\text{IRR}} + \\frac{C_2}{(1+\\text{IRR})^2}',
      vars: {
        P: { name: 'amount invested today', q: 'money', unit: '$', value: 10000 },
        C1: { name: 'received after one year', q: 'money', unit: '$', value: 5000 },
        C2: { name: 'received after two years', q: 'money', unit: '$', value: 7000 },
        r: { name: 'internal rate of return', q: 'ratio', unit: '%', min: -99, max: 1000, signed: true, tex: '\\text{IRR}' }
      },
      solveFor: 'r',
      note: 'A quadratic in $1/(1+\\text{IRR})$: with two positive payouts it has exactly one sensible root.',
      practice: { unknowns: ['r'] },
      stories: { r: 'You invest {P} and receive {C1} after one year and {C2} after two. What is the internal rate of return?' }
    }
  ],
  examples: [
    {
      title: 'The IRR of the solar panels',
      q: 'Panels cost ¤8,000 and save ¤1,000 a year for 15 years. Find the IRR by narrowing down.',
      steps: [
        'NPV at 8 %: $+¤559.48$; at 10 %: $-¤393.92$. The IRR lies between.',
        'At 9 %: annuity factor $(1 - 1.09^{-15})/0.09 = 8.0607$, NPV $= +¤60.69$ — still positive, so the IRR is a little above 9 %.',
        'Narrowing further (bisection) gives 9.13 %, where $1{,}000 \\times (1 - 1.0913^{-15})/0.0913 = ¤8{,}000$.'
      ],
      a: 'IRR ≈ 9.13 % a year.'
    },
    {
      title: 'Your own return',
      q: 'You invested ¤10,000, added ¤5,000 one year later, and the account is worth ¤17,000 after two years. What was your money-weighted return?',
      steps: [
        'Cash flows from your side: $-10{,}000$ now, $-5{,}000$ after a year, $+17{,}000$ after two.',
        'With $x = 1 + \\text{IRR}$: $-10{,}000\\,x^2 - 5{,}000\\,x + 17{,}000 = 0$.',
        'The positive root is $x = (-5{,}000 + \\sqrt{25\\times10^{6} + 680\\times10^{6}})/20{,}000 = 1.07759$.'
      ],
      a: 'About 7.76 % a year.'
    },
    {
      title: 'Two IRRs',
      q: 'A project costs ¤10,000, returns ¤23,000 after one year, and then requires ¤13,200 to close it down after two years. Find its IRRs.',
      steps: [
        'NPV $= -10{,}000 + 23{,}000/x - 13{,}200/x^2$ with $x = 1 + \\text{IRR}$; multiply by $x^2$: $-10{,}000\\,x^2 + 23{,}000\\,x - 13{,}200 = 0$.',
        '$x = (23{,}000 \\pm \\sqrt{529\\times10^{6} - 528\\times10^{6}})/20{,}000 = (23{,}000 \\pm 1{,}000)/20{,}000$.',
        '$x = 1.10$ or $1.20$: IRRs of 10 % and 20 %. Between them the NPV is positive (¤18.90 at 15 %); outside them, negative.'
      ],
      a: 'Two IRRs, 10 % and 20 % — the IRR rule fails; use the NPV at your own rate.'
    }
  ],
  quiz: [
    { q: 'You invest ¤1,000 and receive ¤1,210 after two years, with nothing in between. What is the IRR, in per cent?', answer: 10, unit: '%',
      why: '(1,210 / 1,000)^(1/2) − 1 = 1.1 − 1 = 10 %.' },
    { q: 'You can do only one of two one-year projects, with a 10 % cost of capital: A turns ¤1,000 into ¤1,400 (IRR 40 %); B turns ¤100,000 into ¤115,000 (IRR 15 %). Which adds more value?', choices: ['A, because its IRR is higher', 'B, because its NPV is higher', 'They add the same', 'Neither beats 10 %'], a: 1,
      why: 'NPV of A = 1,400/1.1 − 1,000 = ¤272.73; NPV of B = 115,000/1.1 − 100,000 = ¤4,545.45. The IRR ignores size.' },
    { q: 'Every set of cash flows has exactly one IRR.', a: false,
      why: 'Flows that change sign more than once can have several IRRs (−10,000, +23,000, −13,200 has 10 % and 20 %); flows all of one sign have none.' },
    { q: 'An ordinary project (cost first, income later) has an IRR of 12 %, and your discount rate is 8 %. Its NPV at 8 % is…', choices: ['positive', 'negative', 'zero', 'impossible to tell'], a: 0,
      why: 'For costs-first flows NPV falls as the rate rises and is zero at the IRR; at any rate below the IRR it is positive.' },
    { q: 'A fund reports a return of 3.9 % a year, but your own money-weighted return is 1.2 % a year. The most likely reason is…', choices: ['the fund made an error', 'you added money just before a bad period', 'you withdrew money before a bad period', 'fees are not included in either'], a: 1,
      why: 'The money-weighted return (an IRR) gives more weight to periods when more of your money was in. Adding money just before a fall pulls it below the fund\'s time-weighted return.' }
  ],
  problems: [
    { q: 'A course costs ¤12,000 today and is expected to raise your take-home pay by ¤2,000 a year for 10 years. What is its internal rate of return, in per cent?', answer: 10.56, unit: '%', tol: 0.01,
      hint: 'Find the rate at which ¤2,000 a year for 10 years is worth ¤12,000: $12{,}000 = 2{,}000\\,(1 - (1+r)^{-10})/r$.',
      steps: [
        'At 10 %: annuity factor $(1 - 1.1^{-10})/0.1 = 6.1446$, so the income is worth $2{,}000 \\times 6.1446 = ¤12{,}289$ — more than the cost; the IRR is above 10 %.',
        'At 11 %: factor 5.8892, worth ¤11,778 — less than the cost; the IRR is below 11 %.',
        'Narrowing down between the two (bisection) gives $\\text{IRR} = 10.56\\,\\%$.'
      ] }
  ],
  applications: ['Comparing an investment\'s return with the cost of your money.', 'Measuring your own investment performance (the money-weighted return).', 'Understanding APRs and bond yields, which are IRRs.', 'Screening business and property investments — alongside NPV.'],
  sim: { id: 'mi-npv-irr', params: { preset: 'two' } }
}

);
