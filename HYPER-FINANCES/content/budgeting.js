/* HYPER-FINANCES · content/budgeting.js — Personal Finance › Budgeting and cash flow:
 * a budget that works, the emergency fund, net worth, the saving rate and goals.
 * The plan's concept id 'budgeting' is also the topic's id (Hyper.add rejects the duplicate),
 * so the Budgeting concept is 'household-budget'. */
Hyper.add(

/* ================================================================ budgeting */
{
  id: 'household-budget', parent: 'budgeting', title: 'Budgeting: a plan for your money', level: 1,
  short: 'A budget is a plan that tells your money where to go before the month decides for you: what comes in, what must go out, what you choose to spend, and what you keep.',
  keywords: ['budget', 'budgeting', 'cash flow', '50/30/20', 'needs and wants', 'zero-based budget', 'envelope method', 'pay yourself first', 'sinking fund', 'expenses', 'spending plan', 'net income'],
  prereq: ['what-is-money', 'opportunity-cost', 'math:percentages'],
  related: ['saving-rate', 'emergency-fund', 'mental-accounting', 'financial-habits', 'lifestyle-inflation', 'net-worth'],
  body: `
A budget is not a diet. It is a plan that tells your money where to go before the month decides for you. People who write one down for the first time often find that much of their worry came less from having too little than from not knowing: once every number is on one page, the problem has a size, and a problem with a size can be worked on.

### Start with what actually arrives
Build the budget on **net income**: what lands in your account after income tax, social contributions and any pension deductions. Then list where it goes, in three groups:
- **Fixed costs** that barely move: rent or mortgage, insurance, loan payments, subscriptions.
- **Variable necessities**: groceries, energy, transport, medicine.
- **Choices**: eating out, holidays, hobbies, the new phone.

Track one or two ordinary months before judging anything. Your bank and card statements already hold most of the record.

### A common guideline: 50/30/20
A popular rule of thumb splits net income into roughly **50 % for needs, 30 % for wants and 20 % for saving** (including debt repayment beyond the minimums). On ¤3,200 a month that is ¤1,600, ¤960 and ¤640. It is a starting point, not a law. In an expensive city rent alone can take 40 % of income; a young person living at home may need far less. Here is a real-looking month on ¤3,200:

| Line | Amount | Share of income |
|---|---:|---:|
| Rent | ¤1,150 | |
| Energy and water | ¤180 | |
| Groceries | ¤420 | |
| Transport | ¤260 | |
| Insurance | ¤90 | |
| Phone and internet | ¤60 | |
| Minimum debt payments | ¤150 | |
| **Needs** | **¤2,310** | **72 %** |
| **Wants** | **¤560** | **17.5 %** |
| **Saving** | **¤330** | **10.3 %** |

This household is not failing; it lives where housing is dear. What the budget shows is where the leverage lies: in rent and transport, not in the coffee.

### The bills that are not monthly
Budgets rarely break on true surprises. They break on yearly costs that a monthly plan forgets: car insurance, a service, holidays, birthdays, school fees. Add up the year's irregular costs and set aside a twelfth every month in a separate pot, a **sinking fund**. Car insurance of ¤900, a ¤420 service, ¤1,200 of holidays and ¤480 of gifts make ¤3,000 a year, or ¤250 a month. When the bill comes, the money is already waiting.

### Four ways to run it
- **Pay yourself first**: the saving leaves on payday, automatically, and you live on the rest ([[financial-habits]]).
- **Zero-based**: give every unit of income a job until nothing is unassigned; saving counts as a job.
- **Envelopes or pots**: a fixed amount per category, in cash or in named sub-accounts; when a pot is empty, that spending stops. It uses [[mental-accounting]] in your favour.
- **The big three only**: settle housing, transport and food, automate saving, and let the rest look after itself.

The best method is the one you will still be using in six months.

### Small leaks and big rocks
¤4.50 five days a week is ¤1,170 a year; saved monthly at 5 % instead, it would grow to about ¤81,145 over 30 years. That is worth knowing, because [[compound-interest|compounding]] makes small habits large. But it is not why most budgets fail. A cheaper flat, car or phone contract changes more in one decision than a year of skipped coffees. Keep the small pleasures you value and drop the ones you no longer notice.

> [!tip] A budget with no room for joy gets abandoned. Put a line for fun in it on purpose, and spend it without guilt.

> [!key] Spending less than you earn, deliberately, is the foundation that every other page in this branch builds on. Try your own numbers in [the savings calculator](#/tools/money/save).
`,
  ideas: [
    'Budget from net income: what actually arrives after tax and deductions.',
    'Split spending into needs, wants and saving; 50/30/20 is a common starting guideline, not a law.',
    'Irregular yearly bills belong in the monthly plan as a twelfth each month (a sinking fund).',
    'The large fixed costs (housing, transport, food) decide a budget far more than small daily purchases.',
    'The best budgeting method is the one you will keep using; automation does most of the work.'
  ],
  pitfalls: [
    'A budget means cutting out everything enjoyable — A budget that allows nothing fun is abandoned within weeks. Plan for pleasures; just choose them deliberately.',
    'My budget balanced this month, so it works — Check it against a whole year: insurance, repairs, holidays and gifts arrive in lumps and need a monthly set-aside.',
    'Everyone should match 50/30/20 exactly — It is a rough guide. Where housing is expensive needs may take 60 % or more; the question is whether your saving share meets your goals.'
  ],
  formulas: [
    {
      name: 'Share of income for one part of the budget',
      expr: 'A = s*I', tex: 'A = s\\,I',
      vars: {
        A: { name: 'monthly amount for this part', q: 'money', unit: '$' },
        s: { name: 'share of net income', q: 'ratio', unit: '%', value: 20, min: 5, max: 60 },
        I: { name: 'net monthly income', q: 'money', unit: '$', value: 3200 }
      },
      note: 'Use it both ways: what a share of income comes to, or what share a cost really takes.',
      stories: {
        A: 'Your net income is {I} a month and you aim to save {s} of it. How much is that a month?',
        s: 'Your net income is {I} a month and your rent is {A}. What share of your income does the rent take?',
        I: 'You want your rent of {A} to be no more than {s} of your net income. What income would that need?'
      }
    },
    {
      name: 'Monthly set-aside for an irregular bill',
      expr: 'm = A/n', tex: 'm = \\frac{A}{n}',
      vars: {
        m: { name: 'to set aside each month', q: 'money', unit: '$' },
        A: { name: 'bill when it comes', q: 'money', unit: '$', value: 3000 },
        n: { name: 'months until it is due', int: true, value: 12 }
      },
      note: 'A sinking fund: the bill is spread over the months before it arrives, so it never lands on one month.',
      stories: {
        m: 'Your irregular yearly costs (insurance, a service, holidays, gifts) add up to {A}, due over the next {n} months. How much should you set aside each month?',
        n: 'You set aside {m} a month for a bill of {A}. How many months does it take to have it ready?',
        A: 'You set aside {m} a month in a sinking fund for {n} months. How large a bill will be covered when it comes?'
      }
    },
    {
      name: 'Yearly cost of a small habit',
      expr: 'Y = 52*k*c', tex: 'Y = 52\\,k\\,c',
      vars: {
        Y: { name: 'cost over a year', q: 'money', unit: '$' },
        k: { name: 'times a week', int: true, value: 5 },
        c: { name: 'price each time', q: 'money', unit: '$', value: 4.5 }
      },
      practice: { unknowns: ['Y', 'c'] },
      stories: {
        Y: 'You buy something costing {c}, {k} times a week. What does it cost over a year?',
        c: 'A habit repeated {k} times a week costs {Y} a year. What does it cost each time?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a month against 50/30/20',
      q: 'Net income ¤3,200. Needs come to ¤2,310, wants to ¤560, and ¤330 is saved. Compare with the 50/30/20 guideline.',
      steps: [
        'Guideline amounts: $0.50 \\times 3\\,200 = ¤1{,}600$ needs, $0.30 \\times 3\\,200 = ¤960$ wants, $0.20 \\times 3\\,200 = ¤640$ saving.',
        'Actual shares: needs $2\\,310 / 3\\,200 = 72\\,\\%$, wants $560 / 3\\,200 = 17.5\\,\\%$, saving $330 / 3\\,200 = 10.3\\,\\%$.',
        'Needs are ¤710 over the guide, wants already ¤400 under it. Squeezing wants further cannot close the gap; the rent (¤1,150, 36 % of income) is where the room is — at the next move or renewal.'
      ],
      a: 'Needs 72 %, wants 17.5 %, saving 10.3 %: the lever is the largest fixed cost, not the small spending.'
    },
    {
      title: 'The bills that break budgets',
      q: 'In a year you expect car insurance ¤900, a car service ¤420, holidays ¤1,200 and gifts ¤480. How much should go into a sinking fund each month?',
      steps: [
        'Yearly total: $900 + 420 + 1\\,200 + 480 = ¤3{,}000$.',
        'Spread over 12 months: $3\\,000 / 12 = ¤250$ a month.',
        'Keep it in a separate pot so it is not mistaken for spare money; each bill is then paid from the pot, not from that month\'s income.'
      ],
      a: '¤250 a month.'
    }
  ],
  quiz: [
    { q: 'Your net income is ¤2,800 a month. Under the 50/30/20 guideline, how much would go to saving and extra debt repayment each month?', answer: 560, unit: '$',
      why: 'Twenty per cent of net income: 0.20 × 2,800 = ¤560.' },
    { q: 'A budget keeps coming out short every month. Which change is most likely to fix it for good?', choices: ['Skip the daily coffee', 'Renegotiate or reduce the largest fixed cost (rent, car, loan)', 'Track cash spending only', 'Leave irregular bills out so the month looks balanced'], a: 1,
      why: 'One decision on a large fixed cost changes every future month; small daily cuts help but rarely close a real gap, and hiding irregular bills only moves the problem.' },
    { q: 'A budget should be built on your gross salary, because that is the figure in your contract.', a: false,
      why: 'You can only spend what arrives: net income, after tax, social contributions and deductions. Budgeting from gross overstates what you have.' },
    { q: 'Your irregular costs add up to ¤2,400 a year. How much should you set aside each month?', answer: 200, unit: '$',
      why: '¤2,400 ÷ 12 = ¤200 a month into a sinking fund.' },
    { q: 'Your needs take 65 % of your net income. What does that tell you?', choices: ['You are bad with money', 'You must move house at once', 'Wants and saving share the remaining 35 %: decide that split deliberately and look at the biggest need when you can', 'Saving is impossible until needs fall to 50 %'], a: 2,
      why: 'The guideline is a diagnostic, not a verdict. High needs are common where housing is expensive; the budget shows what is left and where the biggest lever is.' }
  ],
  applications: ['Seeing, for the first time, where a month\'s income goes.', 'Absorbing yearly bills without a monthly crisis.', 'Finding the room to start saving or to pay off debt.', 'Deciding whether a new commitment (a car, a bigger flat) really fits.'],
  sim: 'pf-budget'
},

/* ================================================================ emergency fund */
{
  id: 'emergency-fund', parent: 'budgeting', title: 'The emergency fund', level: 1,
  short: 'Money kept safe and within reach for the things that go wrong — a repair, a medical bill, a lost job. It turns a crisis into an inconvenience and keeps you out of expensive debt.',
  keywords: ['emergency fund', 'rainy day fund', 'cash cushion', 'buffer', 'savings', 'job loss', 'three to six months', 'liquidity', 'safety net', 'unexpected expenses'],
  prereq: ['household-budget', 'bank-accounts', 'opportunity-cost'],
  related: ['deposit-insurance', 'money-market', 'insurance-basics', 'credit-cards', 'high-cost-credit', 'money-anxiety'],
  body: `
Sooner or later something breaks: the car, the boiler, a tooth, a job. An **emergency fund** is money set aside for exactly that — cash you do not invest, do not spend on holidays and do not have to explain. It turns a crisis into an inconvenience. It is also the most direct cure for money anxiety there is: a surprise bill that you can simply pay is not frightening.

### What it saves you from
Without a cushion, a ¤1,500 car repair goes on a credit card. At 22 % a year, paying ¤60 a month, it takes 34 months to clear and costs about ¤525 of interest — a third more than the repair itself. Paying ¤100 a month, it still takes 18 months and ¤270. Worse, shocks tend to arrive together: the car breaks the month the job goes, which is also when borrowing is hardest to get and a [[high-cost-credit|payday lender]] starts to look like a solution. With a fund, you pay the bill, then rebuild the fund over the following months. No interest, no calls, no spiral.

### How big?
A common guideline is **three to six months of essential spending** — not of income. Count what you could not cut in a crisis: rent or mortgage, food, energy, insurance, transport, minimum debt payments. With essentials of ¤2,400 a month, three months is ¤7,200 and six months ¤14,400.

The right size depends on how long it would take you to replace your income, and what else would pay the bills meanwhile:
- **Larger** (six months or more) with irregular or self-employed income, a single earner, dependants, or work in an industry that cuts jobs in recessions.
- **Smaller** can be reasonable with two stable incomes, generous unemployment insurance or a very secure job.

How long a fund lasts is simple arithmetic:

$$n = \\frac{F}{E - B}$$

where $F$ is the fund, $E$ your monthly essential spending and $B$ any income that continues (a partner's pay, unemployment benefit). A ¤14,400 fund with ¤2,400 of essentials and ¤500 of benefit lasts about 7.6 months.

### Where to keep it
Safe, reachable within a day or two, and not tied to the stock market: an instant-access [[bank-accounts|savings account]] or a [[money-market|money-market fund]], within your country's [[deposit-insurance|deposit insurance]] limit. Not shares: markets tend to fall in the same recessions that cost jobs, so the fund could be well down exactly when you need it. Not a long [[term-deposits|term deposit]] you cannot break without a penalty. Earning some interest matters — especially when inflation is high — but reaching the money matters more.

### Building it without despair
¤14,400 can feel impossible. Break it into steps:
1. A **starter fund** first — ¤1,000, or one month of essentials — even while you pay off debts, so the next surprise does not go back on the card.
2. Then an automatic transfer on payday. ¤300 a month at 3 % reaches ¤14,400 in about 45 months; ¤600 a month in about two years.
3. Windfalls — a tax refund, a bonus, a gift — go straight to the fund until it is complete.
4. After you use it, refilling it becomes the first saving priority again.

### Is cash a waste?
Money in a savings account earns less than money invested, and over the years that gap is a real [[opportunity-cost|opportunity cost]]. Think of it as the premium on the most useful [[insurance-basics|insurance]] you will ever own: it covers the dozen small disasters no policy covers, and it lets you choose a higher excess on the policies you do buy, which lowers their price.

> [!key] Decide what counts as an emergency before one happens: necessary, urgent and unexpected. A sale is not an emergency; a broken boiler in winter is.
`,
  ideas: [
    'An emergency fund is safe, easily reached money kept only for things that go wrong.',
    'A common guideline is three to six months of essential spending; more for irregular or single incomes.',
    'Without a cushion, shocks go on expensive credit and cost far more than the shock itself.',
    'Keep it in insured, instant-access savings — not in shares, which tend to fall when jobs are lost.',
    'Build it in steps: a small starter fund first, then automatic transfers until it is complete.'
  ],
  pitfalls: [
    'The fund should be three to six months of income — Of essential spending: what you could not cut in a crisis. That is usually well below income.',
    'Keep the fund in shares so it grows faster — Markets often fall in the recessions that also cost jobs; an emergency fund must be there, at full value, on the worst day.',
    'Pay off all debt before saving anything — Without even a small cushion, the next surprise goes straight back on the card. A starter fund first breaks the cycle.'
  ],
  formulas: [
    {
      name: 'How long a fund lasts',
      expr: 'n = F/(E - B)', tex: 'n = \\frac{F}{E - B}',
      vars: {
        n: { name: 'months the fund lasts' },
        F: { name: 'emergency fund', q: 'money', unit: '$', value: 14400 },
        E: { name: 'essential spending a month', q: 'money', unit: '$', value: 2400 },
        B: { name: 'income that continues, a month', q: 'money', unit: '$', value: 500 }
      },
      note: 'Only valid while $E > B$: if continuing income covers the essentials, the fund is not being drawn at all.',
      practice: { unknowns: ['n', 'F', 'E'] },
      stories: {
        n: 'You have {F} set aside. Your essentials cost {E} a month, and after losing your job you would still receive {B} a month in benefits. How many months does the fund last?',
        F: 'Essentials cost {E} a month, continuing income is {B}, and you want to last {n} months. How big must the fund be?',
        E: 'A fund of {F} must last {n} months, with {B} a month still coming in. What monthly essential spending can it support?'
      }
    },
    {
      name: 'Target size',
      expr: 'F = k*E', tex: 'F = k\\,E',
      vars: {
        F: { name: 'target emergency fund', q: 'money', unit: '$' },
        k: { name: 'months of essentials to cover', value: 6 },
        E: { name: 'essential spending a month', q: 'money', unit: '$', value: 2400 }
      },
      practice: { unknowns: ['F', 'E'] },
      stories: {
        F: 'Your essential spending is {E} a month and you want {k} months in reserve. How big should the fund be?',
        E: 'Your fund of {F} covers {k} months. What are your essential costs a month?'
      }
    },
    {
      name: 'Months to build it',
      expr: 'F = s*((1 + r/12)^n - 1)/(r/12)', tex: 'F = s\\,\\frac{(1 + r/12)^{n} - 1}{r/12}',
      vars: {
        F: { name: 'emergency fund to build', q: 'money', unit: '$', value: 14400 },
        s: { name: 'saved each month', q: 'money', unit: '$', value: 300 },
        r: { name: 'interest rate on the savings (a year)', q: 'ratio', unit: '%', value: 3, min: 0.5, max: 8 },
        n: { name: 'months of saving' }
      },
      solveFor: 'n',
      practice: { unknowns: ['n', 's'] },
      note: 'Deposits at the end of each month, interest added monthly. With the defaults the fund is complete after about 45 months; without interest it would take 48.',
      stories: {
        n: 'You save {s} a month at {r} a year towards an emergency fund of {F}. How many months will it take?',
        s: 'You want an emergency fund of {F} within {n} months, saving at {r} a year. How much must you save each month?'
      }
    }
  ],
  examples: [
    {
      title: 'The cost of having no cushion',
      q: 'A ¤1,500 car repair goes on a card charging 22 % a year, and you pay ¤60 a month. How long does it take, and what does it cost?',
      steps: [
        'Monthly rate: $0.22/12 = 1.833\\,\\%$; the first month\'s interest is $1\\,500 \\times 0.01833 = ¤27.50$, so only ¤32.50 of the first ¤60 repays the debt.',
        'The months needed follow from the payment formula: $n = -\\ln(1 - B\\,i/M)/\\ln(1+i) = -\\ln(1 - 1\\,500 \\times 0.01833/60)/\\ln(1.01833) = 33.7$, so 34 payments.',
        'Total paid ≈ ¤2,025, of which about ¤525 is interest — 35 % on top of the repair.',
        'Paid from an emergency fund instead, it costs ¤1,500, and refilling the fund at ¤60 a month takes 25 months with no interest at all.'
      ],
      a: '34 months and about ¤525 of interest on the card; nothing extra from a fund.'
    },
    {
      title: 'Sizing a fund',
      q: 'A household\'s essentials are ¤2,400 a month. If one earner lost a job, unemployment benefit would bring in ¤500 a month. How long would a ¤14,400 fund last, and what would six months of full cover cost?',
      steps: [
        'Monthly draw on the fund: $E - B = 2\\,400 - 500 = ¤1{,}900$.',
        'Months covered: $n = 14\\,400 / 1\\,900 = 7.6$.',
        'Six months of essentials with no other income: $6 \\times 2\\,400 = ¤14{,}400$ — the same fund, which the benefit stretches to more than seven months.'
      ],
      a: 'About 7.6 months; six months of full essentials is ¤14,400.'
    }
  ],
  quiz: [
    { q: 'Your essential spending is ¤2,000 a month and you want four months in reserve. How big should the fund be?', answer: 8000, unit: '$',
      why: 'Four months of essentials: 4 × 2,000 = ¤8,000. Count essentials, not income.' },
    { q: 'Where does an emergency fund belong?', choices: ['In a broad share index fund, because it grows faster', 'In an insured, instant-access savings account', 'In a five-year term deposit with the best rate', 'In cash hidden at home'], a: 1,
      why: 'It must be safe, reachable within days and at full value when trouble comes. Shares may be down in a recession, a long deposit is locked, and cash at home can be stolen or burnt and earns nothing.' },
    { q: 'A fund of ¤9,000; essentials of ¤2,500 a month, of which a partner\'s income still covers ¤1,000. How many months does the fund last?', answer: 6,
      why: 'The fund pays only the gap: 2,500 − 1,000 = ¤1,500 a month, and 9,000 ÷ 1,500 = 6 months.' },
    { q: 'Which household most needs a larger emergency fund?', choices: ['Two public-sector salaries, no children', 'A freelancer with irregular income, the only earner for a family', 'A retiree whose guaranteed pension covers all costs', 'A student living with parents'], a: 1,
      why: 'Irregular income, a single earner and dependants all lengthen the time the fund may have to carry the household.' },
    { q: 'A shop has a one-day sale on a television you have wanted for years. Using the emergency fund is reasonable, since you will refill it.', a: false,
      why: 'An emergency is necessary, urgent and unexpected. A sale is none of these — and the fund must be full on the day the real emergency comes.' }
  ],
  applications: ['Paying for a repair or a medical bill without borrowing.', 'Riding out a job loss while looking for the right next job, not the first one.', 'Choosing a higher insurance excess to lower premiums.', 'Sleeping better.'],
  sim: 'pf-emergency'
},

/* ================================================================ net worth */
{
  id: 'net-worth', parent: 'budgeting', title: 'Net worth and the personal balance sheet', level: 1,
  short: 'Everything you own minus everything you owe, at one moment. Your budget is a film of money flowing; your net worth is a photograph of where it has piled up — and its trend is the best single measure of progress.',
  keywords: ['net worth', 'balance sheet', 'assets', 'liabilities', 'equity', 'home equity', 'debt ratio', 'liquid net worth', 'depreciation', 'wealth'],
  prereq: ['household-budget', 'how-loans-work'],
  related: ['financial-statements', 'wealth-strategies', 'saving-rate', 'good-and-bad-debt', 'down-payment-ltv'],
  body: `
Your budget is a film: money flowing in and out, month after month. Your **net worth** is a photograph: everything you own minus everything you owe, at one moment.

$$W = A - L$$

Companies call this photograph the balance sheet ([[financial-statements]]); the same idea works for a household, and one page of it, updated once or twice a year, shows more about your progress than any single statement.

### Drawing up yours
**Assets** (what you own, at what it would fetch today):
- cash: current and savings accounts, the [[emergency-fund|emergency fund]];
- investments: funds, shares, bonds, retirement and pension accounts, at their current value, not what you paid;
- things that hold value: a home at a realistic sale price, a car at what it would sell for now.

**Liabilities** (what you owe): the mortgage balance, car and student loans, card balances, money owed to family, tax due.

| Assets | | Liabilities | |
|---|---:|---|---:|
| Home | ¤350,000 | Mortgage | ¤240,000 |
| Pension and investments | ¤60,000 | Car loan | ¤8,000 |
| Savings | ¤15,000 | Credit card | ¤2,000 |
| Car | ¤12,000 | | |
| **Total** | **¤437,000** | **Total** | **¤250,000** |

Net worth is ¤187,000, of which ¤110,000 is **home equity** — the home's value minus the mortgage.

### Negative is normal at the start
A graduate with ¤3,000 in the bank and a ¤28,000 student loan has a net worth of −¤25,000. That is not failure; it is a starting point, and it leaves out the largest asset a young person has — years of future earnings, which no balance sheet records ([[life-disability-insurance]] is about protecting it). What matters is the direction: is the number higher than last year?

### What moves it
Over a year, net worth changes by what you save, plus what your assets gain, minus what they lose:

$$\\Delta W = \\text{saving} + \\text{investment gains} - \\text{depreciation}$$

Repaying a debt does not change net worth on the day — cash falls and the debt falls by the same amount — but it stops interest leaking out afterwards. Buying a car on a loan does not change it on the day either; the loss comes as the car **depreciates**. A ¤30,000 car that loses 15 % of its value a year is worth about ¤13,311 after five years, whatever was paid for it.

Saving and growth together are powerful. From ¤20,000 today, saving ¤6,000 a year with 5 % growth, net worth reaches about ¤108,045 in ten years (¤80,000 of it put in) and ¤251,462 in twenty (¤140,000 put in).

### Three numbers worth watching
- **Debt ratio** = liabilities ÷ assets. Above: ¤250,000 ÷ ¤437,000 = 57 %; it falls as the mortgage is repaid.
- **Liquid net worth**: what you could reach within weeks, minus debts that are not tied to your home. Above: savings ¤15,000 minus car loan and card ¤10,000 = ¤5,000. A household worth ¤187,000 on paper has a ¤5,000 cushion — worth knowing before a crisis, not during one.
- **The trend**: the same date each year, the same method, conservative values.

> [!warn] Do not list a home at the price you hope for, or a car at what you paid. A balance sheet is for decisions, not for comfort: round down.

### What it cannot tell you
Net worth ignores income, security and obligations. A young doctor with a large student loan and a secure career may be better placed than someone with a small positive balance and an uncertain job. And wealth locked in a house does not pay this month's bills. Use the balance sheet together with the [[household-budget|budget]], not instead of it.
`,
  ideas: [
    'Net worth is assets minus liabilities, valued at what they would fetch today.',
    'The budget is a flow (per month); net worth is a stock (at one moment).',
    'Saving and investment gains raise net worth; spending beyond income, losses and depreciation lower it.',
    'Repaying debt moves money between columns without changing net worth on the day; it stops future interest.',
    'Negative net worth early in life is common; the trend matters more than the level.'
  ],
  pitfalls: [
    'Paying off a loan increases my net worth — On the day it does not: cash and debt fall together. It helps afterwards, by ending the interest.',
    'My car is worth what I paid for it — Cars lose value fast; list what it would sell for now, or the balance sheet flatters you.',
    'A high net worth means plenty of money to hand — Much of it may be home equity or retirement accounts. Look at liquid net worth before relying on it.'
  ],
  formulas: [
    {
      name: 'Net worth',
      expr: 'W = A - L', tex: 'W = A - L',
      vars: {
        W: { name: 'net worth', q: 'money', unit: '$', signed: true },
        A: { name: 'total assets', q: 'money', unit: '$', value: 437000 },
        L: { name: 'total liabilities', q: 'money', unit: '$', value: 250000 }
      },
      practice: { unknowns: ['W', 'L'] },
      stories: {
        W: 'A household owns assets worth {A} and owes {L}. What is its net worth?',
        L: 'Assets are worth {A} and net worth is {W}. How much does the household owe?'
      }
    },
    {
      name: 'Home equity',
      expr: 'Q = V - B', tex: 'Q = V - B',
      vars: {
        Q: { name: 'home equity', q: 'money', unit: '$', signed: true },
        V: { name: 'market value of the home', q: 'money', unit: '$', value: 350000 },
        B: { name: 'mortgage balance', q: 'money', unit: '$', value: 240000 }
      },
      note: 'Negative equity — owing more than the home is worth — happens when prices fall soon after buying with a small deposit.',
      practice: { unknowns: ['Q', 'B'] },
      stories: {
        Q: 'Your home would sell for {V} and you still owe {B} on the mortgage. What is your equity?',
        B: 'Your home would sell for {V} and your equity in it is {Q}. How much is still owed on the mortgage?'
      }
    },
    {
      name: 'Debt ratio',
      expr: 'd = L/A', tex: 'd = \\frac{L}{A}',
      vars: {
        d: { name: 'debt ratio', q: 'ratio', unit: '%' },
        L: { name: 'total liabilities', q: 'money', unit: '$', value: 250000 },
        A: { name: 'total assets', q: 'money', unit: '$', value: 437000 }
      },
      practice: { unknowns: ['d', 'L'] },
      stories: {
        d: 'You owe {L} and own assets worth {A}. What is your debt ratio?',
        L: 'Your assets are worth {A} and your debt ratio is {d}. How much do you owe?'
      }
    },
    {
      name: 'Net worth after years of saving and growth',
      expr: 'W = W0*(1 + r)^T + S*((1 + r)^T - 1)/r', tex: 'W = W_0 (1 + r)^{T} + S\\,\\frac{(1 + r)^{T} - 1}{r}',
      vars: {
        W: { name: 'net worth at the end', q: 'money', unit: '$' },
        W0: { name: 'net worth today', q: 'money', unit: '$', value: 20000 },
        S: { name: 'saved each year', q: 'money', unit: '$', value: 6000 },
        r: { name: 'yearly growth of what you own', q: 'ratio', unit: '%', value: 5, min: 1, max: 10 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'A simple model: everything grows at one rate, saving is added at the end of each year. With the defaults, ¤80,000 put in becomes about ¤108,045.',
      practice: { unknowns: ['W', 'S', 'T'] },
      stories: {
        W: 'Your net worth is {W0}. You save {S} a year and what you own grows {r} a year. What is your net worth after {T}?',
        S: 'Starting from {W0}, you want a net worth of {W} after {T}, with {r} growth a year. How much must you save each year?',
        T: 'Starting from {W0}, you save {S} a year and earn {r}. How long until your net worth is {W}?'
      }
    }
  ],
  examples: [
    {
      title: 'A household balance sheet',
      q: 'Home ¤350,000; pension and investments ¤60,000; savings ¤15,000; car ¤12,000. Mortgage ¤240,000; car loan ¤8,000; card ¤2,000. Find net worth, home equity, the debt ratio and liquid net worth.',
      steps: [
        'Assets: $350\\,000 + 60\\,000 + 15\\,000 + 12\\,000 = ¤437{,}000$. Liabilities: $240\\,000 + 8\\,000 + 2\\,000 = ¤250{,}000$.',
        'Net worth: $437\\,000 - 250\\,000 = ¤187{,}000$. Home equity: $350\\,000 - 240\\,000 = ¤110{,}000$.',
        'Debt ratio: $250\\,000 / 437\\,000 = 57\\,\\%$.',
        'Liquid: savings minus the debts not tied to the home, $15\\,000 - 8\\,000 - 2\\,000 = ¤5{,}000$.'
      ],
      a: 'Net worth ¤187,000; equity ¤110,000; debt ratio 57 %; liquid net worth only ¤5,000.'
    },
    {
      title: 'Starting below zero',
      q: 'A graduate has ¤3,000 in savings and a ¤28,000 student loan. She saves ¤6,000 a year from her first job and her savings grow 5 % a year. Roughly when does her net worth reach zero, if the loan balance stays the same?',
      steps: [
        'Today: $3\\,000 - 28\\,000 = -¤25{,}000$. She needs her assets to reach ¤28,000.',
        'After $T$ years her savings are $3\\,000 \\times 1.05^{T} + 6\\,000\\,(1.05^{T} - 1)/0.05$.',
        'After 3 years: $3\\,473 + 18\\,915 = ¤22{,}388$; after 4: $3\\,647 + 25\\,861 = ¤29{,}507$ (rounded).',
        'So net worth crosses zero during the fourth year — sooner still, since her loan payments also shrink the debt.'
      ],
      a: 'Within about four years.'
    }
  ],
  quiz: [
    { q: 'You use ¤1,000 from your savings to repay ¤1,000 of a loan. On that day your net worth…', choices: ['rises by ¤1,000', 'falls by ¤1,000', 'does not change', 'depends on the loan\'s rate'], a: 2,
      why: 'An asset (cash) and a liability (the loan) fall by the same amount. The benefit comes later: no more interest on that ¤1,000.' },
    { q: 'Assets ¤85,000, liabilities ¤97,000. What is the net worth?', answer: -12000, unit: '$',
      why: '85,000 − 97,000 = −¤12,000: negative, as is common early in life or just after buying a home with a large loan.' },
    { q: 'A car bought for ¤30,000 last year should appear on your balance sheet at ¤30,000.', a: false,
      why: 'List what it would sell for today. Cars lose a large part of their value in the first years.' },
    { q: 'Which of these raises your net worth?', choices: ['Taking a loan to buy a car', 'Saving part of your salary', 'Moving money from savings to pay off a card', 'Your car getting a year older'], a: 1,
      why: 'Saving adds assets without adding debt. A car loan adds equal assets and debts (then the car depreciates); paying the card moves money between columns; age lowers the car\'s value.' },
    { q: 'Assets ¤200,000, liabilities ¤150,000. What is the debt ratio?', answer: 75, unit: '%',
      why: '150,000 ÷ 200,000 = 0.75, or 75 %: three quarters of what the household holds is financed by debt.' }
  ],
  applications: ['A yearly check-up on whether you are moving forward.', 'Seeing how much of your wealth you could actually reach in a crisis.', 'Tracking home equity as a mortgage is repaid.', 'Understanding a company\'s balance sheet through your own.'],
  sim: 'pf-networth'
},

/* ================================================================ saving rate */
{
  id: 'saving-rate', parent: 'budgeting', title: 'Saving rate: the lever you control', level: 2,
  short: 'The share of your income you keep. Markets decide your return and employers your pay, but the saving rate is yours — and because it both builds your wealth and lowers the spending you must one day replace, it works twice.',
  keywords: ['saving rate', 'savings rate', 'savings ratio', 'pay yourself first', 'financial independence', 'years to retirement', 'FIRE', 'save more', 'raise'],
  prereq: ['household-budget', 'compound-interest', 'annuities'],
  related: ['financial-independence', 'lifestyle-inflation', 'wealth-strategies', 'financial-habits', 'retirement-planning', 'net-worth'],
  body: `
Of all the numbers in personal finance, one is almost entirely in your hands: the share of your income that you do not spend. Returns depend on markets, prices on the economy, pay on employers. The **saving rate** depends on you.

$$s = \\frac{\\text{saving}}{\\text{net income}}$$

### Why it works twice
Raising your saving rate from 10 % to 20 % does two things at once: it doubles what goes into your investments, and it lowers the spending that your investments will one day have to replace.

Suppose the goal is enough to live on without working. A common guideline, the [[financial-independence|4 % rule]], puts that at about 25 times a year's spending. Someone saving 10 % of income spends 90 %, so needs 25 × 0.9 = 22.5 years of income — while putting away only a tenth of a year's income each year. Someone saving 50 % needs 25 × 0.5 = 12.5 years of income and puts away half a year's income each year. Without any growth that is 225 years against 25. With a steady real return $r$ the answer depends on the saving rate alone, not on the size of the salary:

$$T = \\frac{\\ln\\left(1 + m\\,r\\,\\dfrac{1 - s}{s}\\right)}{\\ln(1 + r)}$$

where $m = 25$ is the multiple of yearly spending needed:

| Saving rate | Years at 5 % real return | Years at 3 % real return |
|---:|---:|---:|
| 10 % | 51 | 69 |
| 20 % | 37 | 47 |
| 30 % | 28 | 34 |
| 50 % | 17 | 19 |
| 70 % | 9 | 9 |

The model is simple — steady returns, no pension, no taxes, no pay rises — but its shape is the lesson. Moving from 10 % to 20 % saves about 15 years; the first steps up from a low saving rate buy decades. The same logic works for any goal: less spending means both more to save and less to need. For your own figures, with uncertain returns, try [the financial-independence calculator](#/tools/money/retire).

### Everyday arithmetic
¤300 a month for 30 years at 5 % grows to about ¤249,678; ¤600 a month to about ¤499,355. The growth rate is the same; the saving rate decides the scale. And because returns can be lost and salaries can stall, the saving rate is the one ingredient you can lean on in every year.

### Raising it without misery
- **Automate it.** The transfer leaves on payday, before it can be spent ([[financial-habits]]).
- **Fix big costs once**: housing, transport, insurance and contracts, rather than small things every day.
- **Save part of every raise.** Keep half of each pay rise for saving and enjoy the other half. Your spending still grows, so it does not feel like sacrifice, and the rate climbs year after year — a direct answer to [[lifestyle-inflation]].
- **Count what your employer adds.** In many countries employer pension contributions or matches are part of your saving at no cost to take-home pay.
- **Start small.** If 20 % feels impossible, start at 3 % or 5 % and add one percentage point every few months. A single point is rarely noticed.

### What counts
Definitions differ; choose one and keep it. A good one counts whatever builds [[net-worth|net worth]]: money moved to savings and investments, pension contributions from your pay, and the capital part of loan repayments — interest is spending. National household saving rates vary widely between countries and decades, shaped by pensions, culture and interest rates; your own rate is the one that matters.

> [!tip] Try it: in the simulation, slide the saving rate and watch how the years to independence fall — steeply at first, then more gently.
`,
  ideas: [
    'The saving rate is the share of net income you do not spend — the one financial number fully under your control.',
    'A higher saving rate both builds wealth faster and lowers the spending your wealth must one day replace.',
    'In a simple model, the years to financial independence depend only on the saving rate and the return, not on income.',
    'The first steps up from a low saving rate cut the most years.',
    'Automation and saving part of every raise lift the rate without a feeling of sacrifice.'
  ],
  pitfalls: [
    'Only high earners can save a meaningful share — The years to independence depend on the share saved, not the amount; a modest income at 20 % beats a large one at 5 %.',
    'Doubling the saving rate halves the time to independence — It does better than that at low rates (10 % → 20 % cuts 51 years to 37 at 5 %; without growth it would cut 225 years to 100), and less at high rates.',
    'Loan repayments are all spending — The capital part of a payment builds net worth, like saving; only the interest is spent.'
  ],
  formulas: [
    {
      name: 'Saving rate',
      expr: 's = S/I', tex: 's = \\frac{S}{I}',
      vars: {
        s: { name: 'saving rate', q: 'ratio', unit: '%' },
        S: { name: 'saved each month', q: 'money', unit: '$', value: 450 },
        I: { name: 'net monthly income', q: 'money', unit: '$', value: 3000 }
      },
      stories: {
        s: 'You earn {I} a month after tax and save {S}. What is your saving rate?',
        S: 'You earn {I} a month after tax and want a saving rate of {s}. How much must you save each month?'
      }
    },
    {
      name: 'Years to financial independence from the saving rate',
      expr: 'T = ln(1 + m*r*(1 - s)/s)/ln(1 + r)', tex: 'T = \\frac{\\ln\\left(1 + m\\,r\\,\\dfrac{1 - s}{s}\\right)}{\\ln(1 + r)}',
      vars: {
        T: { name: 'years to independence', q: 'years', unit: 'yr' },
        m: { name: 'multiple of yearly spending needed', value: 25, fixed: true },
        r: { name: 'real (after-inflation) return a year', q: 'ratio', unit: '%', value: 5, min: 1, max: 8 },
        s: { name: 'saving rate', q: 'ratio', unit: '%', value: 20, min: 5, max: 75 }
      },
      note: 'Starting from nothing, saving a constant share of a constant real income, returns steady, target 25 times a year\'s spending (the 4 % guideline). A model for the shape of the answer, not a forecast.',
      practice: { unknowns: ['T', 's'] },
      stories: {
        T: 'You save {s} of your income and earn {r} a year after inflation. You aim for {m} times your yearly spending. How many years until you are financially independent?',
        s: 'You want to reach {m} times your yearly spending in {T}, earning {r} a year after inflation. What saving rate does that take?'
      }
    },
    {
      name: 'What regular saving grows to',
      expr: 'A = c*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'A = c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        c: { name: 'saved each month', q: 'money', unit: '$', value: 300 },
        r: { name: 'yearly return', q: 'ratio', unit: '%', value: 5, min: 1, max: 10 },
        T: { name: 'years of saving', q: 'years', unit: 'yr', value: 30 }
      },
      practice: { unknowns: ['A', 'c'] },
      stories: {
        A: 'You save {c} a month for {T}, earning {r} a year. What is the pot worth at the end?',
        c: 'You want {A} in {T}, earning {r} a year. How much must you save each month?'
      }
    }
  ],
  examples: [
    {
      title: 'From 10 % to 20 %',
      q: 'Someone earning ¤3,000 a month after tax saves 10 %. How many years to financial independence at a 5 % real return — and at 20 %?',
      steps: [
        'At 10 %: spending ¤2,700 a month, target $25 \\times 2\\,700 \\times 12 = ¤810{,}000$.',
        '$T = \\ln(1 + 25 \\times 0.05 \\times 0.9/0.1)/\\ln 1.05 = \\ln 12.25/\\ln 1.05 = 51.4$ years.',
        'At 20 %: spending ¤2,400, target ¤720,000, and $T = \\ln(1 + 25 \\times 0.05 \\times 0.8/0.2)/\\ln 1.05 = \\ln 6/\\ln 1.05 = 36.7$ years.',
        'Ten percentage points of saving cut almost 15 years. The salary never entered the calculation.'
      ],
      a: 'About 51 years at 10 %, about 37 years at 20 %.'
    },
    {
      title: 'What counts as saving',
      q: 'Net pay ¤2,800 a month. She moves ¤250 to savings, puts ¤150 into a retirement account, and ¤300 of her mortgage payment is capital (the rest is interest). What is her saving rate?',
      steps: [
        'Everything that builds net worth counts: $250 + 150 + 300 = ¤700$.',
        '$s = 700 / 2\\,800 = 25\\,\\%$.',
        'Counting only the savings account would give $250/2\\,800 = 8.9\\,\\%$ and badly understate her progress.'
      ],
      a: '25 %.'
    }
  ],
  quiz: [
    { q: 'Two people each save 25 % of their income; one earns twice as much as the other. In the simple model, who reaches financial independence first?', choices: ['The higher earner', 'The lower earner', 'They take the same time', 'It cannot be known'], a: 2,
      why: 'Both the target (25 times spending) and the yearly saving scale with income, so income cancels. Only the saving rate and the return remain.' },
    { q: 'You earn ¤3,600 a month after tax and save ¤540. What is your saving rate?', answer: 15, unit: '%',
      why: '540 ÷ 3,600 = 0.15, or 15 %.' },
    { q: 'In the 5 % model, going from a 10 % to a 20 % saving rate cuts more years than going from 50 % to 60 %.', a: true,
      why: '10 % → 20 %: from 51 to 37 years (about 15 fewer). 50 % → 60 %: from 17 to 12 (about 4 fewer). The first points of saving are the most powerful.' },
    { q: 'Why does raising the saving rate shorten the time to independence so strongly?', choices: ['Because banks pay more interest on larger balances', 'Because it raises saving and lowers the spending the investments must replace', 'Because taxes fall when you save', 'Because returns are higher for people who save more'], a: 1,
      why: 'The same step moves both sides of the equation: more goes in each year, and the target — a multiple of spending — gets smaller.' },
    { q: 'You get a raise of ¤400 a month and decide to save half of it. By how much does your monthly saving go up?', answer: 200, unit: '$',
      why: 'Half of ¤400 is ¤200 more saved each month — and ¤200 more to spend, so the raise still feels like one.' }
  ],
  applications: ['Seeing how a change in lifestyle moves your retirement date.', 'Deciding what to do with a pay rise.', 'Comparing plans that seem very different by one number.', 'Keeping motivation: the rate improves long before the balance looks large.'],
  sim: 'pf-saving-rate'
},

/* ================================================================ financial goals */
{
  id: 'financial-goals', parent: 'budgeting', title: 'Financial goals and priorities', level: 1,
  short: 'Turning wishes into goals with an amount, a date and a reason; pricing them in monthly saving; matching the money to the horizon; and choosing an order when goals compete.',
  keywords: ['financial goals', 'priorities', 'SMART goals', 'saving for a house', 'deposit', 'order of priorities', 'employer match', 'sinking fund', 'horizon', 'financial plan'],
  prereq: ['household-budget', 'emergency-fund', 'time-value-of-money'],
  related: ['debt-payoff', 'retirement-planning', 'time-horizon', 'present-bias', 'mental-accounting', 'inflation-purchasing-power'],
  body: `
"I should save more" is a wish. "I will have ¤40,000 for a home deposit in five years' time" is a goal: it says what, how much and by when — and once a goal has those three, arithmetic can tell you what it takes each month. That turns a vague worry into a line in the budget.

### Make it concrete
A useful goal has an **amount**, a **date** and a **reason**. The reason matters more than it seems: it is what keeps the transfer running in month 23, when the goal feels far away and something shinier is on offer ([[present-bias]]). Write it down, name the savings pot after it ("Deposit", "Car", "Trip"), and look at the progress now and then.

### Price it
The monthly saving that reaches a goal $G$ in $T$ years, earning $r$ a year:

$$c = G\\,\\frac{r/12}{(1 + r/12)^{12T} - 1}$$

¤40,000 in five years at 3 % takes ¤618.75 a month (¤666.67 without any interest). If prices rise 2.5 % a year, the same deposit in future money is about ¤45,256, and the monthly figure becomes ¤700.06. Goals more than a couple of years away should be set in future money, or reviewed every year ([[inflation-purchasing-power]]). [The savings-plan calculator](#/tools/money/save) does this arithmetic for your own goal.

### Match the money to the horizon
- **Short** (up to about three years): the money must be there on the date — savings accounts, [[term-deposits|term deposits]]. A fall in the market the month before you buy a home is not a risk worth taking.
- **Medium** (three to ten years): a mix, becoming safer as the date approaches.
- **Long** (ten years and more), such as retirement: time to ride out falls, so growth assets usually do most of the work ([[time-horizon]]).

### When goals compete
Most people juggle several goals at once: a cushion, debts, a home, retirement, children. A sequence that many planners describe — a common pattern, not a law — runs roughly like this:
1. Pay essential bills and at least the minimum on every debt. Missed payments are expensive and damage your [[credit-scores|credit record]].
2. Build a small starter [[emergency-fund|emergency fund]].
3. If an employer matches retirement contributions, contribute enough to receive the full match. A 50 % match on a ¤3,000 contribution adds ¤1,500 at once — a return no investment can promise.
4. Clear expensive debt ([[debt-payoff]]). Paying off a card at 22 % is a guaranteed 22 % "return".
5. Complete the emergency fund.
6. Save steadily for retirement and, alongside, for the medium-term goals.
7. Then weigh extra payments on cheap debt such as a mortgage against investing more — a genuine trade-off with no single right answer.

The order bends to circumstances: an insecure job argues for a bigger fund sooner; a very cheap loan argues for not rushing to repay it; a goal with a fixed date, such as school fees, may need to run in parallel from the start.

### When you cannot do everything
Give each goal its own line in the budget, even a small one, rather than finishing one before starting the next. Progress on several fronts keeps motivation alive, and a goal that is funded a little is already real. Review the list once a year: goals change, and that is fine.

> [!key] A goal turns saving from "not spending" into "buying something later" — and people are much better at the second.
`,
  ideas: [
    'A goal has an amount, a date and a reason; with those, the monthly saving can be calculated.',
    'Goals years away should be set in future money, or reviewed yearly, because of inflation.',
    'Short-horizon money belongs in safe places; long-horizon money can take market risk.',
    'A common order: essentials and minimums, starter fund, employer match, expensive debt, full fund, then retirement and other goals.',
    'Several goals can progress together, each with its own line and its own pot.'
  ],
  pitfalls: [
    'Investing next year\'s house deposit in shares for a better return — Over one or two years shares can fall sharply; money with a fixed date belongs in safe places.',
    'Finish one goal completely before starting the next — Goals with deadlines (school fees, a deposit) need time; small parallel lines keep every one moving.',
    'A goal set in today\'s money stays the same size — With 2.5 % inflation, a ¤40,000 goal becomes about ¤45,256 in five years.'
  ],
  formulas: [
    {
      name: 'Monthly saving to reach a goal',
      expr: 'c = G*(r/12)/((1 + r/12)^(12*T) - 1)', tex: 'c = G\\,\\frac{r/12}{(1 + r/12)^{12T} - 1}',
      vars: {
        c: { name: 'saving each month', q: 'money', unit: '$' },
        G: { name: 'goal amount', q: 'money', unit: '$', value: 40000 },
        r: { name: 'yearly interest or return', q: 'ratio', unit: '%', value: 3, min: 0.5, max: 8 },
        T: { name: 'years until the goal', q: 'years', unit: 'yr', value: 5 }
      },
      practice: { unknowns: ['c', 'G', 'T'] },
      stories: {
        c: 'You want {G} for a home deposit in {T}, and your savings earn {r} a year. How much must you save each month?',
        G: 'You save {c} a month for {T} at {r} a year. How much will you have?',
        T: 'You save {c} a month at {r} a year towards a goal of {G}. How long will it take?'
      }
    },
    {
      name: 'A goal in future money',
      expr: 'G = G0*(1 + p)^T', tex: 'G = G_0 (1 + p)^{T}',
      vars: {
        G: { name: 'goal in money of the day', q: 'money', unit: '$' },
        G0: { name: 'goal in today\'s money', q: 'money', unit: '$', value: 40000 },
        p: { name: 'inflation a year', q: 'ratio', unit: '%', value: 2.5, min: 0, max: 10 },
        T: { name: 'years until the goal', q: 'years', unit: 'yr', value: 5 }
      },
      practice: { unknowns: ['G', 'G0'] },
      stories: {
        G: 'Something costs {G0} today and prices rise {p} a year. What will it cost in {T}?',
        G0: 'In {T} you will need {G}. With prices rising {p} a year, what is that in today\'s money?'
      }
    },
    {
      name: 'Reaching a goal from savings already made',
      expr: 'G = P*(1 + r/12)^(12*T) + c*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'G = P\\,(1 + r/12)^{12T} + c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        G: { name: 'goal amount', q: 'money', unit: '$', value: 40000 },
        P: { name: 'already saved', q: 'money', unit: '$', value: 10000 },
        c: { name: 'saving each month', q: 'money', unit: '$', value: 400 },
        r: { name: 'yearly interest or return', q: 'ratio', unit: '%', value: 3, min: 0.5, max: 8 },
        T: { name: 'years until the goal', q: 'years', unit: 'yr' }
      },
      solveFor: 'T',
      practice: { unknowns: ['T', 'c'] },
      stories: {
        T: 'You have {P} saved and add {c} a month at {r} a year. How long until you reach {G}?',
        c: 'You have {P} saved and want {G} in {T} at {r} a year. How much must you add each month?'
      }
    }
  ],
  examples: [
    {
      title: 'Pricing a home deposit',
      q: 'You want ¤40,000 in five years; your savings earn 3 % a year. What must you save each month — and how does it change if the ¤40,000 is in today\'s money and prices rise 2.5 % a year?',
      steps: [
        '$i = 0.03/12 = 0.0025$, $n = 60$, $(1.0025)^{60} = 1.1616$.',
        '$c = 40\\,000 \\times 0.0025 / 0.1616 = ¤618.75$ a month. Without interest: $40\\,000/60 = ¤666.67$.',
        'In future money the goal is $40\\,000 \\times 1.025^{5} = ¤45{,}256$, so $c = 45\\,256 \\times 0.0025/0.1616 = ¤700.06$.'
      ],
      a: '¤618.75 a month in money of the day; ¤700.06 if the goal keeps pace with 2.5 % inflation.'
    },
    {
      title: 'A head start',
      q: 'You already have ¤10,000 and can add ¤400 a month at 3 %. When do you reach ¤40,000?',
      steps: [
        'Set $P(1+i)^n + c\\,((1+i)^n - 1)/i = G$ and solve for $(1+i)^n = (G\\,i + c)/(P\\,i + c)$.',
        '$(40\\,000 \\times 0.0025 + 400)/(10\\,000 \\times 0.0025 + 400) = 500/425 = 1.1765$.',
        '$n = \\ln 1.1765/\\ln 1.0025 = 65.1$ months, about 5.4 years.'
      ],
      a: 'After about 65 months (5.4 years).'
    }
  ],
  quiz: [
    { q: 'You need ¤6,000 in 24 months, and ignore interest. How much a month?', answer: 250, unit: '$',
      why: '6,000 ÷ 24 = ¤250 a month. Interest would lower it a little.' },
    { q: 'Money for a house deposit you plan to pay in 18 months is best kept…', choices: ['in shares, for the higher expected return', 'in safe savings or a term deposit ending before the date', 'in a single promising company', 'in a long-term pension account'], a: 1,
      why: 'Over 18 months markets can fall a long way and not recover in time; with a fixed date, safety comes first.' },
    { q: 'Your employer adds 50 % of what you contribute to a retirement account, up to 6 % of salary. On a salary of ¤50,000, contributing ¤3,000 brings how much from the employer?', answer: 1500, unit: '$',
      why: 'Half of ¤3,000 = ¤1,500 a year, an immediate 50 % on your money before any investment return.' },
    { q: 'In a common order of priorities, which usually comes before paying down a low-rate mortgage early?', choices: ['A new car', 'Clearing a 22 % credit-card balance', 'Buying individual shares', 'Pre-paying next year\'s holiday'], a: 1,
      why: 'Clearing expensive debt gives a guaranteed high "return"; extra mortgage payments save only the mortgage rate.' }
  ],
  applications: ['Planning a home deposit, a car, a wedding or school fees.', 'Deciding what to do first when money cannot cover every goal.', 'Choosing where to keep money for each goal.', 'Turning a raise or a bonus into progress.'],
  sim: 'ref-compound'
}

);
