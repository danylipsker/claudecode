/* HYPER-FINANCES · content/accounts.js — accounts and payments: current and savings
 * accounts, term deposits, bank fees, ways of paying, and changing currency. */
Hyper.add(

{
  id: 'bank-accounts', parent: 'accounts', title: 'Current and savings accounts', level: 1,
  short: 'A current (checking) account is for money that comes and goes; a savings account is for money that stays. Knowing how each works, what it pays and what it costs lets you keep every ¤1 in the right place.',
  keywords: ['current account', 'checking account', 'savings account', 'easy access', 'notice account', 'overdraft', 'AER', 'APY', 'interest on savings', 'debit card', 'direct debit', 'standing order', 'real interest rate', 'high-interest savings'],
  prereq: ['how-banks-work', 'compound-interest', 'effective-rate'],
  related: ['term-deposits', 'bank-fees', 'payments', 'emergency-fund', 'deposit-insurance', 'real-vs-nominal', 'inflation-purchasing-power', 'money-market', 'why-invest'],
  body: `
Most people's financial life runs through two kinds of bank account. The **current account** (a *checking account* in North America) is the hub: pay comes in, bills and card payments go out. A **savings account** holds money you will not need this month, and pays interest for leaving it there. Choosing them well is not glamorous, but it is one of the easiest ways to stop losing money quietly.

### The current account
It comes with a debit card, transfers, **direct debits** (the payee collects agreed amounts) and **standing orders** (you send a fixed amount on a schedule), and sometimes an **overdraft**: permission to go below zero, which is a loan and usually an expensive one. Current accounts typically pay little or no interest. Depending on the country and the bank they may charge a monthly fee, and they charge for overdrafts, some cash withdrawals and payments abroad ([[bank-fees]]).

### Savings accounts
- **Easy-access** (instant access): withdraw at any time; the rate is variable and can change whenever the bank decides.
- **Notice accounts**: you give, say, 30, 60 or 95 days' notice before withdrawing, usually for a slightly higher rate.
- **Fixed-term** deposits lock the money away for a set time at a fixed rate ([[term-deposits]]).
- Watch for **introductory bonus rates** that fall after a year, and for conditions such as a minimum monthly deposit or a limit on withdrawals.

Interest on savings is taxed in many countries, and some offer tax-free savings accounts up to a yearly allowance. The rules vary widely, so check your own.

### Comparing rates: AER and APY
Rates are quoted per year, but interest may be paid monthly, and interest paid monthly earns interest itself. The **effective annual rate** (AER in the UK, APY in the US) includes that compounding:

$$\\mathrm{AER} = \\left(1 + \\frac{r}{n}\\right)^{n} - 1$$

A rate of 4 % paid monthly is an AER of 4.07 %: ¤407.42 a year on ¤10,000 instead of ¤400. Always compare accounts by the effective rate ([[effective-rate]]).

### The real rate
What matters in the end is what your savings can buy. If an account pays 0.5 % while prices rise by 3 % a year, the **real** rate is

$$r_{real} = \\frac{1 + i}{1 + \\pi} - 1 = \\frac{1.005}{1.03} - 1 = -2.4\\,\\%$$

Each year the money buys about 2.4 % less; after five years, ¤10,000 buys what ¤8,844 buys today ([[real-vs-nominal]]).

### The cost of idle money
Money sitting in a current account at 0 % instead of a savings account at, say, 4 % costs ¤40 a year for every ¤1,000: ¤800 a year on ¤20,000. Moving it takes an afternoon; inertia and [[present-bias]] keep it where it is, and banks know it. Many pay their existing customers less than they offer new ones, so a rate that was good three years ago may not be good today.

### A simple structure
A pattern many people find useful (a pattern, not a rule):
1. **Current account**: a month's spending plus a small buffer, so no payment ever bounces.
2. **Easy-access savings**: your [[emergency-fund|emergency fund]], a few months of essential costs, at a safe, insured bank paying a competitive rate.
3. **Pots and term deposits** for money needed on known dates.
4. **Long-term money** beyond that is usually invested rather than saved, because over many years savings accounts have often struggled to beat inflation ([[why-invest]]).
`,
  ideas: [
    'A current account handles money in and out; a savings account is for money that stays and should pay interest.',
    'Compare savings by the effective rate (AER, APY), which includes compounding.',
    'The real rate is what counts: interest below inflation means shrinking purchasing power.',
    'Idle money in the wrong account quietly costs its missing interest every year.'
  ],
  pitfalls: [
    'All savings accounts pay about the same — Rates differ a great deal between banks and between old and new accounts at the same bank. Check yours at least once a year.',
    'My savings are growing because the balance goes up — If the rate is below inflation, the balance grows while what it buys shrinks.',
    'A higher headline rate is always better — Compare AERs, and check the conditions: bonus periods, notice, withdrawal limits and fees.'
  ],
  formulas: [
    {
      name: 'Effective annual rate (AER, APY)',
      expr: 'AER = (1 + r/n)^n - 1', tex: '\\mathrm{AER} = \\left(1 + \\frac{r}{n}\\right)^{n} - 1',
      vars: {
        AER: { name: 'effective annual rate', q: 'ratio', unit: '%', tex: '\\mathrm{AER}' },
        r: { name: 'quoted yearly rate', q: 'ratio', unit: '%', value: 4, min: 0, max: 20 },
        n: { name: 'interest payments a year', int: true, value: 12 }
      },
      note: 'Monthly interest: $n = 12$; daily: $n = 365$. Solve for $r$ to find the quoted rate that gives a target AER.',
      practice: { unknowns: ['AER', 'r'] },
      stories: {
        AER: 'A savings account pays {r} a year, credited {n} times a year. What is its effective annual rate?',
        r: 'You want an effective rate of {AER} from an account that pays interest {n} times a year. What quoted rate does it need?'
      }
    },
    {
      name: 'The real interest rate',
      expr: 'rr = (1 + i)/(1 + infl) - 1', tex: 'r_{real} = \\frac{1 + i}{1 + \\pi} - 1',
      vars: {
        rr: { name: 'real rate (after inflation)', q: 'ratio', unit: '%', tex: 'r_{real}', signed: true },
        i: { name: 'interest rate the account pays', q: 'ratio', unit: '%', value: 0.5, min: -5, max: 30, signed: true },
        infl: { name: 'inflation rate', q: 'ratio', unit: '%', tex: '\\pi', value: 3, min: -5, max: 50, signed: true }
      },
      note: 'For small rates, $r_{real} \\approx i - \\pi$. A negative real rate means the savings buy less each year.',
      practice: { unknowns: ['rr'] },
      stories: { rr: 'Your savings earn {i} a year while prices rise {infl} a year. What is your real rate of return?' }
    },
    {
      name: 'What idle money costs',
      expr: 'C = B*(r2 - r1)', tex: 'C = B\\,(r_2 - r_1)',
      vars: {
        C: { name: 'interest missed each year', q: 'money', unit: '$', signed: true },
        B: { name: 'balance left where it is', q: 'money', unit: '$', value: 20000 },
        r2: { name: 'rate a better account pays', q: 'ratio', unit: '%', value: 4, min: 0, max: 15 },
        r1: { name: 'rate where the money sits now', q: 'ratio', unit: '%', value: 0, min: 0, max: 15 }
      },
      practice: { unknowns: ['C'] },
      stories: { C: '{B} sits in an account paying {r1} while a safe savings account pays {r2}. How much interest is missed each year?' }
    }
  ],
  examples: [
    {
      title: 'Monthly or yearly interest?',
      q: 'Account A pays 4.00 % once a year; account B pays 3.95 % credited monthly. Which pays more on ¤10,000 over a year?',
      steps: [
        'A: $10{,}000 \\times 0.04 = ¤400$; its AER is 4.00 %.',
        'B: AER $= (1 + 0.0395/12)^{12} - 1 = 4.02\\,\\%$, so $¤402$.',
        'B pays slightly more, despite the lower headline rate.'
      ],
      a: 'B: an AER of 4.02 % against 4.00 %.'
    },
    {
      title: 'Saving at 0.5 % while prices rise 3 %',
      q: '¤10,000 earns 0.5 % a year while inflation runs at 3 %. What is the real rate, and what is the money worth in today\'s prices after five years?',
      steps: [
        '$r_{real} = 1.005/1.03 - 1 = -2.43\\,\\%$.',
        'After five years: $10{,}000 \\times (1.005/1.03)^{5} = 10{,}000 \\times 0.8844 = ¤8{,}844$ in today\'s money.',
        'The balance has grown to ¤10,253, but it buys 11.6 % less than the original ¤10,000 did.'
      ],
      a: 'A real rate of −2.4 %; after five years the savings buy what ¤8,844 buys today.'
    }
  ],
  quiz: [
    { q: 'Account A pays 4.00 % once a year; account B pays 3.95 % monthly. Which pays more over a year?', choices: ['A', 'B', 'They pay exactly the same', 'Impossible to tell'], a: 1,
      why: 'B\'s effective rate is (1 + 0.0395/12)^12 − 1 = 4.02 %, slightly above A\'s 4.00 %.' },
    { q: 'If your savings account pays 2 % and inflation is 3 %, your savings are growing in real terms.', a: false,
      why: 'The real rate is 1.02/1.03 − 1 ≈ −1 %: the balance rises but buys less each year.' },
    { q: '¤15,000 sits in a current account at 0 % instead of a savings account at 3.5 %. How much interest is missed each year?', answer: 525, unit: '$',
      why: '15,000 × 0.035 = ¤525 a year.' },
    { q: 'What is the main job of a current account?', choices: ['Long-term growth', 'Handling money coming in and going out', 'Earning the highest interest', 'Protecting against inflation'], a: 1,
      why: 'It is the hub for everyday payments; savings belong in accounts that pay interest, and long-term money usually in investments.' }
  ],
  applications: ['Choosing where to keep everyday money and an emergency fund.', 'Comparing savings rates properly.', 'Checking whether your savings keep up with prices.', 'Setting up direct debits and standing orders so nothing is missed.']
},

{
  id: 'term-deposits', parent: 'accounts', title: 'Term deposits and certificates of deposit', level: 1,
  short: 'Lock money away for a fixed period, from a month to several years, at a rate fixed in advance. You gain certainty and usually a better rate; you give up access, and breaking the deposit early costs a penalty, if it is allowed at all.',
  keywords: ['term deposit', 'fixed deposit', 'certificate of deposit', 'CD', 'time deposit', 'fixed-rate bond', 'pikadon', 'early withdrawal penalty', 'CD ladder', 'laddering', 'maturity', 'reinvestment risk', 'inflation-linked deposit'],
  prereq: ['bank-accounts', 'compound-interest', 'effective-rate'],
  related: ['deposit-insurance', 'yield-curve', 'bond-basics', 'money-market', 'real-vs-nominal', 'inflation-linked-bonds', 'time-horizon', 'monetary-policy'],
  body: `
A term deposit is the simplest bargain in banking: you promise to leave your money with the bank for a fixed time, and the bank promises you a fixed rate. In the US it is a certificate of deposit (CD), in the UK a fixed-rate bond, in Australia and New Zealand a term deposit, in Israel a *pikadon*. Terms run from a month to five years or more.

### How it works
Deposit ¤10,000 for two years at 4.5 % a year, compounded yearly, and at maturity you receive

$$A = P\\left(1 + \\frac{r}{m}\\right)^{m t} = 10{,}000 \\times 1.045^{2} = ¤10{,}920.25$$

Interest may be paid at maturity, every year or every month; compare offers by their effective rate. The rate is fixed: good for you if rates fall during the term, costly if they rise. And the money is covered by [[deposit-insurance]] like any other deposit, up to the limit.

### Why the rate is usually higher
The bank can lend your money for longer without worrying that you will withdraw it, and it pays you for giving up access. Longer terms usually pay more, but not always: when markets expect interest rates to fall, a five-year deposit can pay less than a one-year deposit, a pattern called an inverted [[yield-curve]].

### Breaking a deposit early
Some term deposits cannot be broken at all. Others allow it for a penalty, often a number of days' interest: 90 days' interest on ¤10,000 at 4.5 % is ¤110.96. Is it ever worth paying? Suppose your deposit pays 3 % with a year and a half left, and new deposits pay 5 %. Switching gains

$$10{,}000 \\times (1.05^{1.5} - 1.03^{1.5}) = ¤305.94$$

more than the penalty, so switching wins, before tax and provided the bank allows it. With only a few months left, it usually would not.

### Laddering
Instead of putting ¤25,000 into one five-year deposit, split it into five of ¤5,000 maturing in one, two, three, four and five years. Each year one matures, and you either use it or reinvest it for five years. Once the ladder is built, some money becomes available every year, most of it earns longer-term rates, and you never lock everything in at one unlucky moment. With rates of 3.0, 3.3, 3.6, 3.8 and 4.0 % on the five rungs, the first ladder averages 3.54 %.

### Inflation
A fixed rate is fixed in money, not in what money buys. At 4 % with inflation at 3 %, the real return is $1.04/1.03 - 1 = 0.97\\,\\%$; if inflation jumps to 6 %, it becomes −1.9 %. Some countries offer deposits linked to the price index, which pay a real rate plus the rise in prices (Israel's index-linked deposits are one example), much like [[inflation-linked-bonds]].

### When a term deposit fits
- Money for a known date: a home deposit in two years, next year's school fees.
- Savings you are sure you will not need before the end of the term.
- Not usually your [[emergency-fund|emergency fund]], unless the deposit allows early access without a heavy penalty.
`,
  ideas: [
    'A term deposit exchanges access for a fixed rate, usually higher than easy-access savings.',
    'Early withdrawal is often penalised, commonly by a number of days\' interest, or not allowed at all.',
    'A ladder of deposits maturing in different years gives regular access and a good average rate.',
    'The rate is fixed in money: inflation can make the real return negative.'
  ],
  pitfalls: [
    'A longer term always pays more — When rates are expected to fall, longer deposits can pay less than shorter ones.',
    'I can always get my money back if I need it — Many deposits cannot be broken, and others charge penalties. Keep your emergency money elsewhere.',
    'A fixed rate means no risk — There is no credit risk up to the insured limit, but there is inflation risk and the risk of missing higher rates later.'
  ],
  formulas: [
    {
      name: 'Value at maturity',
      expr: 'A = P*(1 + r/m)^(m*t)', tex: 'A = P\\left(1 + \\frac{r}{m}\\right)^{m t}',
      vars: {
        A: { name: 'amount at maturity', q: 'money', unit: '$' },
        P: { name: 'amount deposited', q: 'money', unit: '$', value: 10000 },
        r: { name: 'fixed yearly rate', q: 'ratio', unit: '%', value: 4.5, min: 0, max: 15 },
        m: { name: 'times interest is compounded a year', int: true, value: 1 },
        t: { name: 'term', q: 'years', unit: 'yr', value: 2 }
      },
      practice: { unknowns: ['A', 'r', 't'] },
      stories: {
        A: 'You lock {P} in a term deposit at {r}, compounded {m} times a year, for {t}. What do you receive at maturity?',
        r: 'A {t} deposit of {P} pays back {A}, compounded {m} times a year. What is its rate?',
        t: 'At {r} compounded {m} times a year, how long must {P} stay deposited to become {A}?'
      }
    },
    {
      name: 'Early-withdrawal penalty in days of interest',
      expr: 'X = P*r*d/365', tex: 'X = P\\,r\\,\\frac{d}{365}',
      vars: {
        X: { name: 'penalty', q: 'money', unit: '$' },
        P: { name: 'amount deposited', q: 'money', unit: '$', value: 10000 },
        r: { name: 'deposit rate', q: 'ratio', unit: '%', value: 4.5, min: 0, max: 15 },
        d: { name: 'days of interest charged', int: true, value: 90 }
      },
      note: 'A common way of stating the penalty; some banks use other formulas or forbid early withdrawal altogether. Read the terms.',
      practice: { unknowns: ['X'] },
      stories: { X: 'Breaking a deposit of {P} at {r} costs {d} days of interest. How much is the penalty?' }
    },
    {
      name: 'Gain from switching to a higher rate',
      expr: 'G = P*((1 + r2)^t - (1 + r1)^t)', tex: 'G = P\\left[(1 + r_2)^{t} - (1 + r_1)^{t}\\right]',
      vars: {
        G: { name: 'extra earned by switching (before any penalty)', q: 'money', unit: '$', signed: true },
        P: { name: 'amount deposited', q: 'money', unit: '$', value: 10000 },
        r2: { name: 'new rate', q: 'ratio', unit: '%', value: 5, min: 0, max: 15 },
        r1: { name: 'current rate', q: 'ratio', unit: '%', value: 3, min: 0, max: 15 },
        t: { name: 'time left on the current deposit', q: 'years', unit: 'yr', value: 1.5 }
      },
      note: 'Compare $G$ with the penalty for breaking the deposit. Taxes and the new deposit\'s own lock-in also matter.',
      practice: { unknowns: ['G'] },
      stories: { G: 'Your {P} deposit earns {r1} with {t} left; new deposits pay {r2}. How much more would switching earn, before the penalty?' }
    }
  ],
  examples: [
    {
      title: 'Two years at 4.5 %',
      q: 'You deposit ¤10,000 for two years at 4.5 %, compounded yearly. What do you receive, and how much is interest?',
      steps: [
        '$A = 10{,}000 \\times 1.045^{2} = 10{,}000 \\times 1.092025 = ¤10{,}920.25$.',
        'Interest: ¤920.25, of which ¤20.25 is interest on the first year\'s interest.'
      ],
      a: '¤10,920.25, including ¤920.25 of interest.'
    },
    {
      title: 'Break it or keep it?',
      q: 'Your ¤10,000 deposit pays 3 % with 18 months left. New deposits pay 5 %. Breaking costs 90 days\' interest at 3 %. Should you switch?',
      steps: [
        'Gain from the higher rate: $10{,}000 \\times (1.05^{1.5} - 1.03^{1.5}) = 10{,}000 \\times (1.07593 - 1.04534) = ¤305.94$.',
        'Penalty: $10{,}000 \\times 0.03 \\times 90/365 = ¤73.97$.',
        'Net gain: about ¤232, before tax, if the bank allows early withdrawal.'
      ],
      a: 'Yes: about ¤306 extra against a ¤74 penalty.'
    },
    {
      title: 'A five-rung ladder',
      q: 'You split ¤25,000 into five deposits of ¤5,000 for 1 to 5 years, at 3.0, 3.3, 3.6, 3.8 and 4.0 %. What is the average rate, and what happens each year?',
      steps: [
        'Average rate: $(3.0 + 3.3 + 3.6 + 3.8 + 4.0)/5 = 3.54\\,\\%$.',
        'After one year the first ¤5,000 matures; reinvested for five years it earns the five-year rate.',
        'After four years every rung is a five-year deposit, and ¤5,000 (plus interest) becomes available every year.'
      ],
      a: '3.54 % at first, rising towards the five-year rate, with money maturing every year.'
    }
  ],
  quiz: [
    { q: 'You deposit ¤5,000 for three years at 4 % a year, compounded yearly. What do you receive at maturity?', answer: 5624.32, unit: '$',
      why: '5,000 × 1.04³ = ¤5,624.32.' },
    { q: 'A month after you lock in a five-year deposit, rates rise sharply. What have you lost?', choices: ['Part of your deposit', 'The chance to earn the higher rate, unless you pay to break the deposit', 'Your deposit insurance', 'Nothing at all'], a: 1,
      why: 'Your capital and interest are safe; the cost is the higher rate you are not earning, an opportunity cost.' },
    { q: 'A longer term always pays a higher rate.', a: false,
      why: 'When interest rates are expected to fall, banks may pay less for long deposits than for short ones.' },
    { q: 'Why does a ladder of deposits help?', choices: ['It guarantees the highest possible rate', 'Some money matures every year, so you are never locked in all at once at a bad moment', 'It avoids the deposit-insurance limit', 'It removes inflation risk'], a: 1,
      why: 'Spreading maturities gives regular access and averages the rates you lock in over time.' },
    { q: 'A penalty of 180 days\' interest on a ¤20,000 deposit at 5 %: how much is it?', answer: 493.15, unit: '$',
      why: '20,000 × 0.05 × 180/365 = ¤493.15.' }
  ],
  applications: ['Saving for a purchase on a known date.', 'Locking in a rate when rates may fall.', 'Building a ladder for steady access and a good average rate.', 'Deciding whether to break an old deposit for a better rate.']
},

{
  id: 'bank-fees', parent: 'accounts', title: 'Bank fees and the cost of convenience', level: 1,
  short: 'Monthly charges, overdraft and late fees, cash-machine and foreign-transaction fees look small one at a time. Added up and compounded over years they can cost thousands, and the most expensive ones fall on people with the least money.',
  keywords: ['bank fees', 'account fee', 'maintenance fee', 'overdraft fee', 'returned payment fee', 'ATM fee', 'cash machine fee', 'foreign transaction fee', 'transfer fee', 'minimum balance', 'fee drag', 'packaged account', 'switching banks'],
  prereq: ['bank-accounts', 'compound-interest', 'annuities'],
  related: ['investment-fees', 'currency-exchange', 'payments', 'credit-cards', 'apr', 'high-cost-credit', 'mental-accounting', 'financial-habits'],
  body: `
A ¤10 monthly account fee sounds like nothing. It is ¤120 a year and ¤3,600 over thirty years, and if the same money had been saved at 5 % instead, it would have grown to over ¤8,300. Fees are to everyday banking what interest is to borrowing: small numbers that compound.

### The common fees
| Fee | Usual form | How people reduce it |
|---|---|---|
| Monthly or maintenance | a fixed charge, sometimes waived above a minimum balance or when pay comes in | compare accounts; many charge nothing |
| Overdraft, returned payment | a charge per event or per day, plus interest | balance alerts, a small buffer, linking savings |
| Cash machines | charged by your bank, the machine's owner, or both | your own bank's machines; fewer, larger withdrawals |
| Foreign transactions | a percentage of each payment or withdrawal abroad, commonly a few per cent | a card without foreign fees ([[currency-exchange]]) |
| Transfers | fixed fees for urgent or international transfers | compare providers ([[payments]]) |
| Packaged accounts | a monthly fee for bundled insurance and perks | keep only if you would buy the extras anyway |

### Overdraft fees: a very expensive loan
A ¤35 fee for going ¤20 overdrawn for five days is the same as borrowing at

$$\\mathrm{APR} = \\frac{F}{B}\\cdot\\frac{365}{d} = \\frac{35}{20}\\cdot\\frac{365}{5} = 12{,}775\\,\\%$$

a year. Such fees fall hardest on people with small balances, who can least afford them. Regulators have acted in some countries: since 2020, UK banks must price overdrafts as a single yearly interest rate, without fixed fees. Elsewhere the rules keep being debated. Wherever you live, a balance alert and a small buffer in the current account are the cheapest protection there is.

### Fee drag
A fee paid every month is money that never gets the chance to grow. Its cost over the years is the future value of the stream of fees:

$$W = f\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}$$

For ¤10 a month over 30 years at 5 %, that is ¤8,323 for ¤3,600 paid. The same arithmetic, with a percentage of your savings instead of a fixed charge, is why [[investment-fees]] matter so much. The simulation below adds up a typical mix: an ¤8 monthly fee, two ¤2.50 cash-machine charges a month and two ¤25 overdraft fees a year come to ¤206 a year, ¤6,180 over 30 years, and over ¤14,000 counted with growth.

### Convenience has a price, and sometimes it is worth paying
Not every fee is bad. An account that charges a fee but includes travel insurance you would buy anyway may be good value; an urgent transfer may be worth its charge. The question is simply whether you know what you pay and would choose it again. Once a year, go through twelve months of statements and add up every fee. It is often the most profitable hour of the year.

### What banks count on
Inertia and complexity. Few people ever switch their current account, although several countries run free switching services that move your payments and direct debits across for you. And fees are often small, varied and spread over many lines of a statement, which makes them easy to overlook ([[mental-accounting]]).
`,
  ideas: [
    'Small regular fees add up, and their long-run cost includes the growth the money could have had.',
    'Overdraft and returned-payment fees are extremely expensive short-term borrowing.',
    'A yearly review of statements shows which fees you pay and which you could avoid.',
    'A fee is worth paying only if you would buy what it provides anyway.'
  ],
  pitfalls: [
    'It is only a few euros, pounds or dollars a month — Over decades a small monthly fee costs thousands, especially once lost growth is counted.',
    'An overdraft fee is just a penalty, not borrowing — It is the price of a short loan, and expressed as a yearly rate it is often thousands of per cent.',
    'All banks charge the same, so switching is pointless — Fees and rates vary a great deal, and switching is simpler than most people expect.'
  ],
  formulas: [
    {
      name: 'What a monthly fee grows to',
      expr: 'W = f*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'W = f\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        W: { name: 'fees with their lost growth', q: 'money', unit: '$' },
        f: { name: 'fee each month', q: 'money', unit: '$', value: 10 },
        r: { name: 'yearly return the money could have earned', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 15 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'The future value of the fees as a monthly annuity. Paid in total: $12\\,T\\,f$.',
      practice: { unknowns: ['W', 'f'] },
      stories: {
        W: 'An account charges {f} a month for {T}. Had the fees been saved at {r} instead, what would they have grown to?',
        f: 'You want the lifetime cost of your account, with growth at {r} over {T}, to stay below {W}. What is the highest monthly fee?'
      }
    },
    {
      name: 'An overdraft fee as a yearly rate',
      expr: 'APR = F/B*365/d', tex: '\\mathrm{APR} = \\frac{F}{B}\\cdot\\frac{365}{d}',
      vars: {
        APR: { name: 'equivalent yearly rate (simple)', q: 'ratio', unit: '%', tex: '\\mathrm{APR}' },
        F: { name: 'fee charged', q: 'money', unit: '$', value: 35 },
        B: { name: 'amount overdrawn', q: 'money', unit: '$', value: 20 },
        d: { name: 'days until repaid', int: true, value: 5 }
      },
      note: 'Treats the fee as interest on a short loan, without compounding ([[apr]]).',
      practice: { unknowns: ['APR'] },
      stories: { APR: 'A bank charges {F} when you go {B} overdrawn, and you repay after {d} days. What yearly rate is that?' }
    },
    {
      name: 'Yearly cost of everyday fees',
      expr: 'Y = 12*(m + n*u) + k*v', tex: 'Y = 12\\,(m + n\\,u) + k\\,v',
      vars: {
        Y: { name: 'fees a year', q: 'money', unit: '$' },
        m: { name: 'monthly account fee', q: 'money', unit: '$', value: 8 },
        n: { name: 'charged cash withdrawals a month', value: 2 },
        u: { name: 'fee per withdrawal', q: 'money', unit: '$', value: 2.5 },
        k: { name: 'overdraft fees a year', value: 2 },
        v: { name: 'fee per overdraft', q: 'money', unit: '$', value: 25 }
      },
      practice: { unknowns: ['Y'] },
      stories: { Y: 'Your account costs {m} a month, you pay {u} for each of {n} cash withdrawals a month, and {k} overdraft fees of {v} a year. What do you pay in a year?' }
    }
  ],
  examples: [
    {
      title: 'Ten a month for thirty years',
      q: 'An account charges ¤10 a month. What is paid over 30 years, and what would the money have grown to at 5 %?',
      steps: [
        'Paid: $12 \\times 30 \\times 10 = ¤3{,}600$.',
        'Monthly rate $0.05/12 = 0.004167$; $(1.004167^{360} - 1)/0.004167 = 832.26$.',
        '$W = 10 \\times 832.26 = ¤8{,}323$.'
      ],
      a: '¤3,600 paid; ¤8,323 counting the growth given up.'
    },
    {
      title: 'An overdraft fee as an interest rate',
      q: 'You go ¤20 overdrawn and pay a ¤35 fee; your pay arrives five days later. What yearly rate does that fee represent?',
      steps: [
        'The fee is $35/20 = 175\\,\\%$ of the amount borrowed, for five days.',
        'Over a year: $175\\,\\% \\times 365/5 = 12{,}775\\,\\%$.'
      ],
      a: 'About 12,775 % a year, far more than any credit card.'
    }
  ],
  quiz: [
    { q: 'A ¤5 monthly fee, three ¤2 cash-machine fees a month and one ¤30 overdraft fee a year: what is the yearly total?', answer: 162, unit: '$',
      why: '12 × (5 + 3 × 2) + 30 = 132 + 30 = ¤162.' },
    { q: 'Why does a fee paid every month cost more over the years than the fees simply added up?', choices: ['Banks charge interest on fees', 'The money could otherwise have been growing', 'Fees rise automatically with inflation', 'It does not'], a: 1,
      why: 'Each fee paid is money that cannot earn a return for the rest of the period: the lost growth compounds.' },
    { q: 'A ¤25 fee for a ¤50 overdraft lasting a week is a cheap way to borrow.', a: false,
      why: 'As a yearly rate it is 25/50 × 365/7 ≈ 2,600 %.' },
    { q: 'Which is usually the best first step to cut bank fees?', choices: ['Close all your accounts', 'List a year of fees from your statements and see which could be avoided', 'Stop using cards altogether', 'Use only cash abroad'], a: 1,
      why: 'You cannot cut what you have not seen; most people find a few fees they can avoid with small changes.' }
  ],
  applications: ['Choosing a current account.', 'Avoiding overdraft and returned-payment fees.', 'Estimating the long-run cost of a fee-charging account.', 'Deciding whether a packaged account is worth its fee.'],
  sim: 'mb-fee-drag'
},

{
  id: 'payments', parent: 'accounts', title: 'Payments: cards, transfers and digital money', level: 1,
  short: 'Every way of paying moves money between accounts through a system with its own costs, speed and protections. Knowing who pays the fees, and what can and cannot be reversed, helps you choose well and keeps you safer from fraud.',
  keywords: ['payments', 'debit card', 'credit card', 'bank transfer', 'instant payments', 'direct debit', 'chargeback', 'interchange fee', 'digital wallet', 'mobile payments', 'cash', 'central bank digital currency', 'CBDC', 'push payment fraud', 'contactless'],
  prereq: ['bank-accounts', 'how-banks-work'],
  related: ['credit-cards', 'bank-fees', 'currency-exchange', 'scams-fraud', 'money-creation', 'high-cost-credit', 'mental-accounting', 'central-banks'],
  body: `
Tapping a card for a coffee sets off a chain of messages between the café, its bank, a card network and your bank; a day or two later, money moves between the banks' accounts at the central bank. Every way of paying is a chain like this. They differ in who pays for it, how fast the money arrives, and what happens when something goes wrong.

### The main ways to pay
| Method | Money reaches the payee | Who pays the cost | Can you get money back? |
|---|---|---|---|
| Cash | at once | handling costs for shops and banks | only from the person you paid |
| Debit card | authorised in seconds, settled in a day or two | the shop, through its card fees | disputes and chargebacks through your bank |
| Credit card | the same; you repay the card issuer later | the shop, and you too if you carry a balance | chargebacks, and extra legal protection in some countries |
| Bank transfer | seconds (instant systems) to a few days | usually free within a country | rarely: treat it as final |
| Direct debit | on the agreed date | usually free | strong refund rights in many countries |
| Phone wallet | like the card behind it | like the card behind it | like the card behind it |

### Instant payments
Many countries now run public instant-payment systems that move money between banks in seconds, day and night: the UK's Faster Payments (2008), India's UPI (2016), SEPA Instant Credit Transfer in the euro area (2017), Brazil's Pix (2020) and the US FedNow service (2023) are examples. They are fast and cheap, and the payments are final, which is exactly why fraudsters love them.

### The card fees you do not see
When you pay by card, the shop pays a fee, typically a fixed amount plus a percentage. Part goes to your bank (the *interchange fee*), part to the card network and the shop's bank. The EU caps interchange on consumer cards at 0.2 % for debit and 0.3 % for credit (since 2015); in the US, debit interchange at large banks has been capped since 2011, credit-card interchange is not. Shops build these costs into their prices, so everyone pays for card rewards, including customers who pay cash. A fixed part weighs heavily on small payments: a fee of ¤0.25 plus 1.5 % is 2.1 % of a ¤40 purchase but 7.75 % of a ¤4 coffee.

### Protection and fraud
- **Card payments** can be disputed: if goods never arrive or are not as described, your bank can reverse the payment through a *chargeback*. In the UK, credit-card purchases between GBP 100 and GBP 30,000 also make the card issuer jointly liable with the seller.
- **Transfers you authorise yourself** are hard to reverse. In *authorised push payment* scams, criminals persuade people to send money themselves, posing as the bank, the police, a seller, an investment firm or a romantic partner. Since October 2024 UK payment firms must reimburse many victims of such scams within limits; elsewhere protection varies ([[scams-fraud]]).

> [!warn] Your bank will never ask you to move money to a "safe account", and never needs your full password or a one-time code to "protect" you. When in doubt, hang up and call the bank on a number you already know.

### Paying later, paying painlessly
*Buy now, pay later* splits a purchase into instalments, often interest-free if every payment is on time and with fees if not; it is still borrowing ([[high-cost-credit]]). And the less a payment feels like handing over money, with a tap, a stored card or a subscription, the easier it is to spend more than intended ([[mental-accounting]]).

### New kinds of money
- **E-money wallets** hold balances with payment firms; in many countries these are *safeguarded* (kept apart from the firm's own money) rather than covered by deposit insurance.
- **Crypto-assets** are private tokens whose value can swing violently; they are not deposits, are not insured, and payments cannot be reversed.
- **Central bank digital currencies** would be a digital form of cash issued by the central bank itself. Several central banks are studying or testing one: China began pilots of its e-CNY in 2020, and the European Central Bank started a preparation phase for a digital euro in November 2023.
`,
  ideas: [
    'Each payment method has its own speed, cost and protection; the fastest are usually the hardest to reverse.',
    'Card fees are paid by shops and passed into prices, so everyone pays for them.',
    'Card payments can be disputed; transfers you authorise are almost always final.',
    'Fraudsters target instant, final payments: no genuine bank asks you to move money to a "safe account".'
  ],
  pitfalls: [
    'A bank transfer can be reversed like a card payment — Transfers you authorise are usually final; check the payee before you send, especially with new or changed bank details.',
    'Paying by card costs me nothing — Card fees are built into prices for everyone, and card interest costs a great deal if you carry a balance.',
    'Money in a payment app is covered by deposit insurance — Often it is only safeguarded, or not protected at all. Check how your provider holds your money.'
  ],
  formulas: [
    {
      name: 'What a card payment costs the shop, in per cent',
      expr: 's = F/A + p', tex: 's = \\frac{F}{A} + p',
      vars: {
        s: { name: 'cost as a share of the payment', q: 'ratio', unit: '%' },
        F: { name: 'fixed fee per payment', q: 'money', unit: '$', value: 0.25 },
        A: { name: 'amount paid', q: 'money', unit: '$', value: 40 },
        p: { name: 'percentage fee', q: 'ratio', unit: '%', value: 1.5, min: 0, max: 5 }
      },
      note: 'Small payments are hit hardest by the fixed part, which is why some shops set a minimum for card payments.',
      practice: { unknowns: ['s'] },
      stories: { s: 'A shop pays {F} plus {p} on every card payment. What share of a {A} payment goes in fees?' }
    },
    {
      name: 'Is a rewards card worth its fee?',
      expr: 'N = A*b - K', tex: 'N = A\\,b - K',
      vars: {
        N: { name: 'net gain a year', q: 'money', unit: '$', signed: true },
        A: { name: 'spending on the card a year', q: 'money', unit: '$', value: 12000 },
        b: { name: 'cash back or rewards rate', q: 'ratio', unit: '%', value: 1, min: 0, max: 5 },
        K: { name: 'annual fee', q: 'money', unit: '$', value: 95 }
      },
      note: 'Only if you repay the full balance every month; interest on a carried balance soon outweighs any reward. Solve for $A$ with $N = 0$ for the break-even spending.',
      practice: { unknowns: ['N', 'A'] },
      stories: {
        N: 'A card pays {b} back on {A} of spending a year and charges a {K} annual fee. What is the net gain?',
        A: 'A card pays {b} back and charges {K} a year. How much must you spend on it for a net gain of {N}?'
      }
    }
  ],
  examples: [
    {
      title: 'The coffee and the fridge',
      q: 'A shop pays ¤0.25 plus 1.5 % on each card payment. What share of a ¤4 coffee and of an ¤800 fridge goes in fees?',
      steps: [
        'Coffee: $0.25/4 + 0.015 = 0.0625 + 0.015 = 7.75\\,\\%$.',
        'Fridge: $0.25/800 + 0.015 = 0.0003 + 0.015 = 1.53\\,\\%$.'
      ],
      a: '7.75 % of the coffee, 1.53 % of the fridge.'
    },
    {
      title: 'Cash back against an annual fee',
      q: 'A card pays 1 % cash back and charges ¤95 a year. When does it pay for itself? What if you also carry a ¤1,000 balance at 22 %?',
      steps: [
        'Break-even: $A = K/b = 95/0.01 = ¤9{,}500$ of spending a year.',
        'At ¤12,000: $N = 12{,}000 \\times 0.01 - 95 = ¤25$ a year.',
        'A ¤1,000 balance at 22 % costs about ¤220 a year in interest, almost nine times the gain.'
      ],
      a: 'It needs ¤9,500 of spending a year; any interest paid wipes out the reward.'
    }
  ],
  quiz: [
    { q: 'A caller says he is from your bank and asks you to move your savings to a "safe account" at once. What should you do?', choices: ['Move the money quickly to protect it', 'Hang up and call your bank on a number you already know', 'Move half of it', 'Give him your card details instead'], a: 1,
      why: 'This is a classic authorised push payment scam. Genuine banks never ask you to move money to protect it.' },
    { q: 'Which payment is usually the hardest to get back?', choices: ['A credit-card purchase', 'A direct debit', 'An instant bank transfer you authorised', 'A debit-card purchase'], a: 2,
      why: 'Cards have chargebacks and direct debits have refund rules; a transfer you authorised yourself is normally final.' },
    { q: 'Customers who pay cash do not pay any share of card fees.', a: false,
      why: 'Shops set their prices to cover all their costs, card fees included, whatever each customer uses.' },
    { q: 'A card pays 1.5 % cash back and charges a ¤120 annual fee. At what yearly spending does it break even?', answer: 8000, unit: '$',
      why: '120 ÷ 0.015 = ¤8,000.' }
  ],
  applications: ['Choosing how to pay for large and small purchases.', 'Protecting yourself against payment scams.', 'Judging whether a rewards card is worth its fee.', 'Understanding why some shops prefer cash or set card minimums.']
},

{
  id: 'currency-exchange', parent: 'accounts', title: 'Currency exchange for individuals', level: 1,
  short: 'When you change money, most of the cost hides in the exchange rate rather than in any stated fee. Comparing the rate you get with the mid-market rate shows the real price, which ranges from almost nothing to more than 10 %.',
  keywords: ['currency exchange', 'exchange rate', 'mid-market rate', 'spread', 'mark-up', 'dynamic currency conversion', 'foreign transaction fee', 'remittance', 'sending money abroad', 'travel money', 'no commission', 'bureau de change', 'buy and sell rates'],
  prereq: ['exchange-rates', 'bank-fees', 'math:percentages'],
  related: ['payments', 'bank-accounts', 'bid-ask-liquidity', 'cfds-forex', 'trade-balance', 'scams-fraud'],
  body: `
Look at the board of an exchange office at an airport: two prices for every currency, one at which it buys and one at which it sells, and often a cheerful sign promising "no commission". The gap between the two prices is where the money is made.

### The mid-market rate and the mark-up
In the wholesale market where banks trade currencies with each other, the price at any moment is close to a single number: the **mid-market rate**, halfway between the prices at which dealers buy and sell. It is the rate quoted in financial news and by search engines. No private customer gets exactly that rate. A provider gives you a slightly (or very) worse one, the **mark-up**, and may add a fixed fee on top.

If $M$ is the mid-market rate and $R$ the rate you are given, both counted as units of the currency you receive for one unit of the currency you pay, the hidden cost is

$$k = 1 - \\frac{R}{M}$$

With a mid-market rate of 1.10 and an offer of 1.05, you lose 4.5 % of your money before any fee.

### From cheap to expensive
The cost varies with country, provider, currency and amount. As a rough guide to the pattern:
- some specialist money-transfer services and some cards: often well under 1 %;
- bank transfers abroad: a fixed fee plus a mark-up that is often a few per cent;
- card payments abroad: the card network's rate plus any foreign-transaction fee your bank adds;
- exchange kiosks at airports, stations and hotels: often much more, sometimes well over 10 %.

For migrants sending money home, costs matter enormously. The World Bank tracks the average cost of sending the equivalent of 200 US dollars; in the early 2020s it was around 6 %, against an international goal of 3 % by 2030.

### "Pay in your own currency?" Usually, say no
Abroad, a card terminal or cash machine may offer to charge you in your home currency "for your convenience". This is **dynamic currency conversion**, and its rate usually includes a mark-up of several per cent, worse than your card network's own rate. Choosing to pay in the **local currency** is usually cheaper. In the EU, providers must show the conversion mark-up against the European Central Bank's reference rate so you can compare.

### "No commission" is not free
A provider that charges no fee still earns its money through the rate. Compare the **amount you receive** for the amount you pay; that single number includes every fee and mark-up.

### Round trips lose twice
Changing money and changing it back loses the mark-up both times: at 3 % each way you lose $1 - 0.97^{2} = 5.9\\,\\%$. Changing leftover travel money back is often the worst deal of the trip; spending it, or keeping it for the next visit, is usually better.

### Small differences, many years
Sending ¤500 home every month with a 3 % mark-up and a ¤5 fee costs ¤20 a transfer (4 %), or ¤240 a year. With a 0.5 % mark-up and a ¤2 fee it costs ¤4.50 (0.9 %), ¤54 a year. Over 30 years that is ¤7,200 against ¤1,620, and the difference, invested at 5 %, would have grown to about ¤12,900. The simulation below lets you compare your own two options.

Beware of anyone promising to change money at rates far better than the market, and of "foreign-exchange trading" schemes that promise steady profits ([[cfds-forex]], [[scams-fraud]]).
`,
  ideas: [
    'The real cost of changing money is the gap between the rate you get and the mid-market rate, plus any fee.',
    'Compare the amount received, not the advertised fee: "no commission" providers charge through the rate.',
    'Abroad, paying in the local currency is usually cheaper than dynamic currency conversion.',
    'Round trips lose the mark-up twice; regular transfers turn small percentage differences into large sums.'
  ],
  pitfalls: [
    '"No commission" means no cost — The cost is built into the rate; only the amount you receive tells you the full price.',
    'Paying in my home currency abroad avoids exchange costs — The conversion still happens, usually at a worse rate chosen by the shop\'s provider.',
    'The rate on the news is what I will get — That is the mid-market rate; every retail provider adds a mark-up, from tiny to very large.'
  ],
  formulas: [
    {
      name: 'The cost hidden in an exchange rate',
      expr: 'k = 1 - R/M', tex: 'k = 1 - \\frac{R}{M}',
      vars: {
        k: { name: 'mark-up, as a share of the money changed', q: 'ratio', unit: '%', min: 0, max: 20 },
        R: { name: 'rate you are offered (units received per unit paid)', value: 1.05 },
        M: { name: 'mid-market rate (same direction)', value: 1.10 }
      },
      note: 'Both rates must be quoted the same way round: units of the currency you receive for one unit of the currency you pay.',
      practice: { unknowns: ['R'] },
      stories: {
        k: 'The mid-market rate is {M} and a kiosk offers {R}, "without commission". What share of your money does it keep?',
        R: 'The mid-market rate is {M}. A provider takes a mark-up of {k}. What rate does it offer?'
      }
    },
    {
      name: 'Total cost of a conversion',
      expr: 'C = A*k + F', tex: 'C = A\\,k + F',
      vars: {
        C: { name: 'total cost, in your currency', q: 'money', unit: '$' },
        A: { name: 'amount converted', q: 'money', unit: '$', value: 500 },
        k: { name: 'mark-up hidden in the rate', q: 'ratio', unit: '%', value: 3, min: 0, max: 20 },
        F: { name: 'fixed fee', q: 'money', unit: '$', value: 5 }
      },
      note: 'Find the mark-up $k$ with the formula above. The defaults, a 3 % mark-up and a ¤5 fee on ¤500, cost ¤20 in all: 4 % of the money sent. Solve for $k$ to uncover the mark-up from what a transfer really cost.',
      practice: { unknowns: ['C', 'k'] },
      stories: {
        C: 'You send {A} abroad with a mark-up of {k} hidden in the rate and a fee of {F}. What does the transfer cost you in all?',
        k: 'Sending {A} abroad cost you {C} in all, of which {F} was a stated fee. What mark-up was hidden in the rate?'
      }
    },
    {
      name: 'Changing money and back again',
      expr: 'L = 1 - (1 - s)^2', tex: 'L = 1 - (1 - s)^{2}',
      vars: {
        L: { name: 'share lost on the round trip', q: 'ratio', unit: '%' },
        s: { name: 'mark-up each way', q: 'ratio', unit: '%', value: 3, min: 0, max: 20 }
      },
      practice: { unknowns: ['L', 's'] },
      stories: {
        L: 'You change money at a {s} mark-up and later change the leftover back at the same mark-up. What share do you lose?',
        s: 'A round trip through a foreign currency cost you {L} of your money. What was the mark-up each way?'
      }
    }
  ],
  examples: [
    {
      title: 'What the kiosk really charges',
      q: 'The mid-market rate is 1.10 and an airport kiosk offers 0.98, "no commission". What does changing ¤500 really cost?',
      steps: [
        'At the mid-market rate you would receive $500 \\times 1.10 = 550$ units; the kiosk gives $500 \\times 0.98 = 490$.',
        '$k = 1 - 0.98/1.10 = 10.9\\,\\%$.',
        'In your own currency: $500 \\times 0.109 = ¤54.55$, charged without any visible fee.'
      ],
      a: 'About 10.9 %, or ¤54.55 on ¤500.'
    },
    {
      title: 'Home currency or local currency?',
      q: 'Abroad, a restaurant bill of about ¤200 can be paid in the local currency (your card adds 1.1 % in total) or converted by the terminal into your currency with a 5 % mark-up. Compare.',
      steps: [
        'Local currency: about $200 \\times 0.011 = ¤2.20$.',
        'Terminal conversion: about $200 \\times 0.05 = ¤10$.',
        'Choosing the local currency saves about ¤7.80 on one meal.'
      ],
      a: 'About ¤2 against ¤10: pay in the local currency.'
    }
  ],
  quiz: [
    { q: 'The mid-market rate is 1.20 and a provider offers 1.14 with "no commission". What is the real cost, in per cent?', answer: 5,
      why: '1 − 1.14/1.20 = 0.05, or 5 %.' },
    { q: 'Abroad, a card terminal asks whether to charge you in your home currency. Which is usually cheaper?', choices: ['Your home currency', 'The local currency', 'They always cost the same', 'Neither: only cash avoids costs'], a: 1,
      why: 'Converting at the terminal usually carries a mark-up of several per cent, worse than your card network\'s rate.' },
    { q: 'A "no commission" exchange is free.', a: false,
      why: 'The provider earns through a worse rate. Compare the amount you receive.' },
    { q: 'You change money and back again, losing 4 % each way. What share do you lose in total, in per cent?', answer: 7.84,
      why: '1 − 0.96² = 0.0784, or 7.84 %.' },
    { q: 'Comparing two ways to send ¤1,000 abroad, the single best number to compare is…', choices: ['the fee', 'the exchange rate alone', 'the amount the recipient actually receives', 'the speed'], a: 2,
      why: 'The amount received includes the rate, the mark-up and every fee at once.' }
  ],
  applications: ['Changing money for a trip.', 'Sending money to family abroad.', 'Paying by card abroad without surprises.', 'Being paid in, or buying in, a foreign currency.'],
  sim: { id: 'mb-fee-drag', params: { mode: 'fx' }, title: 'Sending money abroad: the long cost of a mark-up' }
}

);
