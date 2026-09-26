/* HYPER-FINANCES · content/leverage.js — Leverage and margin: what borrowing to invest does to
 * your return, margin accounts and margin calls, leveraged ETFs and volatility drag, CFDs and forex.
 * Simulations: sims/leverage.js (lev-amplifier, lev-margin-account, lev-etf-drag, lev-fx-position).
 *
 * Note: the topic is called 'leverage', and ids must be unique, so the concept "Leverage" is
 * 'leverage-basics' (as planned in outline.js); [[leverage]] leads to the topic page. */
Hyper.add(

/* ================================================================ LEVERAGE */
{
  id: 'leverage-basics', parent: 'leverage', title: 'Leverage', level: 1,
  short: 'Investing with borrowed money as well as your own. Leverage multiplies the return on your money — gains and losses alike — and decides how far a price can fall before your stake is gone.',
  keywords: ['leverage', 'gearing', 'borrowing to invest', 'leverage ratio', 'return on equity', 'amplified losses', 'wipe-out', 'debt', 'equity', 'geared investment', 'two to one', 'risk of ruin'],
  prereq: ['risk-and-return', 'how-loans-work', 'math:percentages'],
  related: ['margin-trading', 'property-leverage', 'leveraged-etfs', 'cfds-forex', 'futures-forwards', 'drawdowns', 'financial-crises'],
  body: `
Two friends each have ¤10,000 to put into the same fund. Ana invests her ¤10,000. Ben borrows another ¤10,000 at 6 % a year and invests ¤20,000. A year later the fund is up 15 %. Ana has made ¤1,500 — 15 % on her money. Ben has made ¤3,000, pays ¤600 of interest and keeps ¤2,400: **24 %** on his own ¤10,000. Ben looks clever.

Run the year again with the fund *down* 15 %. Ana has lost ¤1,500. Ben has lost ¤3,000 on the fund, still owes the ¤600 of interest, and is down ¤3,600 — **36 %**. The loan did not care that the year went badly. That is leverage (British accountants call it *gearing*): borrowed money that multiplies the result on your own money, in both directions.

### Measuring it
Leverage is what you control divided by what you own, $L = A/E$: the value of the investment (the *assets*) over your own money in it (the *equity*). Ben is at $L = 2$, "two to one". A home bought with a 20 % deposit starts at 5 : 1; a currency trade at 30 : 1 means ¤1 of yours for every ¤30 of position.

If the investment returns $r_a$ and the loan costs $r_b$, the return on your money is

$$R = L\\,r_a - (L - 1)\\,r_b$$

Your money earns $L$ times the investment's return, minus the interest on the $L - 1$ parts that are borrowed. Two things follow. Leverage helps only when the investment beats the borrowing rate: below 6 % Ben does worse than Ana, and his own money merely breaks even at $\\tfrac{L-1}{L}\\,r_b = 3\\%$. And the swings are $L$ times larger: a fund whose yearly returns spread by about 15 % ([[volatility]]) becomes, at 2 : 1, an investment whose returns spread by about 30 %.

### The fall that wipes you out
Every leveraged position has a fall that erases your stake: at $L : 1$ it is $1/L$ of the investment's value (before interest).

| Your share of the investment | Leverage | Fall that wipes you out | Your gain on a 10 % rise |
|---|---:|---:|---:|
| 100 % | 1 : 1 | 100 % | 10 % |
| 50 % | 2 : 1 | 50 % | 20 % |
| 20 % (a typical home deposit) | 5 : 1 | 20 % | 50 % |
| 10 % | 10 : 1 | 10 % | 100 % |
| 3.3 % | 30 : 1 | 3.3 % | 300 % |
| 1 % | 100 : 1 | 1 % | 1,000 % |

A single share can fall 10 % in a day on bad news, and broad share markets fell by about a third in a few weeks in early 2020. At 30 : 1 an ordinary month's move in a currency can erase a deposit; at 100 : 1 a single day's can.

### Leverage moves against you
Leverage is not fixed. If Ben's fund falls 25 %, his ¤20,000 becomes ¤15,000 while he still owes ¤10,000: his equity is ¤5,000 and his leverage has risen to 3 : 1 — just when things are going badly. After a rise it falls. This is why lenders set limits and call for more money when prices drop ([[margin-calls]]), and why a fall that is temporary for Ana can be permanent for Ben: if he is forced to sell at the bottom, the recovery happens without him.

### Where leverage lives
Almost everyone meets it. A mortgage is leverage on a home ([[property-leverage]]); companies borrow to raise the return to shareholders; banks commonly hold assets of roughly ten to twenty times their equity, and some investment banks ran above 30 : 1 before the 2008 crisis ([[financial-crises]]). For investors the tools are [[margin-trading|margin accounts]], [[leveraged-etfs|leveraged funds]], [[cfds-forex|CFDs and forex]], [[futures-forwards|futures]] and [[options-basics|options]].

> [!key] Leverage does not change what the investment does; it changes how much of the result lands on you — and how little room you have before the lender steps in.

### What this means for you
Before any leveraged decision, ask three questions. What does the borrowing cost, and does the investment reliably beat it? What fall wipes me out, and how often has this investment fallen that far? Could I be forced to sell — and could I live with that? Leverage on a home you live in, with a fixed payment you can afford for decades, is a very different thing from 30 : 1 on a currency with money you cannot afford to lose. The simulation lets you feel the difference before it costs anything.
`,
  ideas: [
    'Leverage $L$ is the value you control divided by your own money in it.',
    'The return on your money is $L$ times the investment\'s return minus the interest on the borrowed part — in good years and bad.',
    'At $L : 1$ a fall of $1/L$ wipes out your stake: 50 % at 2 : 1, 3.3 % at 30 : 1.',
    'Leverage rises as prices fall, exactly when lenders ask for more money or sell you out.',
    'Borrowing to invest pays only when the investment beats the borrowing rate by enough to justify the larger swings.'
  ],
  pitfalls: [
    'More leverage means more return — It multiplies the gap between the investment\'s return and the borrowing rate, and it multiplies the swings; the chance of a forced sale or a total loss rises much faster than the average gain.',
    'A 20 % fall at 2 : 1 costs me 20 % — It costs 40 % of your own money, plus the interest, because the whole fall lands on your half.',
    'Leverage is only for speculators — A mortgage is leverage too. What makes it survivable is the terms: a fixed payment and no margin calls let a homeowner sit through a fall in price that would force a trader to sell.'
  ],
  formulas: [
    {
      name: 'Leverage ratio',
      expr: 'L = A/E', tex: 'L = \\frac{A}{E}',
      vars: {
        L: { name: 'leverage (times)', min: 1, max: 10 },
        A: { name: 'value of the investment you control', q: 'money', unit: '$', value: 20000 },
        E: { name: 'your own money in it (equity)', q: 'money', unit: '$', value: 10000 }
      },
      note: 'A leverage of 1 means no borrowing. A mortgage with a 20 % deposit starts at 5; the retail cap on major currency pairs in the EU, UK and Australia is 30.',
      stories: {
        L: 'You put {E} of your own money into an investment worth {A}, borrowing the rest. What is your leverage?',
        E: 'You want to hold {A} of an investment at a leverage of {L}. How much of your own money must you put in?',
        A: 'You have {E} and use a leverage of {L}. How large a position do you control?'
      }
    },
    {
      name: 'Return on your own money',
      expr: 'R = L*ra - (L - 1)*rb', tex: 'R = L\\,r_a - (L - 1)\\,r_b',
      vars: {
        R: { name: 'return on your own money', q: 'ratio', unit: '%', signed: true },
        L: { name: 'leverage', value: 2, min: 1, max: 10 },
        ra: { name: 'return of the investment', q: 'ratio', unit: '%', value: 15, signed: true, tex: 'r_a' },
        rb: { name: 'interest rate on the borrowed money', q: 'ratio', unit: '%', value: 6, tex: 'r_b' }
      },
      note: 'Over one period, with the loan fixed at the start. Try $r_a = -15\\%$: the loss on your money is $-36\\%$, not $-15\\%$. Set $R = 0$ and solve for $r_a$ to find where your own money breaks even, $\\tfrac{L-1}{L}\\,r_b$; you beat not borrowing only when $r_a > r_b$.',
      practice: { unknowns: ['R', 'ra', 'L'] },
      stories: {
        R: 'You invest at a leverage of {L}, borrowing at {rb} a year. The investment returns {ra} over the year. What is the return on your own money?',
        ra: 'At a leverage of {L}, borrowing at {rb}, what must the investment return for you to make {R} on your own money?',
        L: 'The investment returns {ra} and the loan costs {rb}. What leverage turns that into {R} on your own money?'
      }
    },
    {
      name: 'The fall that wipes you out',
      expr: 'd = 1/L', tex: 'd = \\frac{1}{L}',
      vars: {
        d: { name: 'price fall that erases your own money', q: 'ratio', unit: '%' },
        L: { name: 'leverage', value: 5, min: 1, max: 30 }
      },
      note: 'Before interest and costs, which make it smaller. Beyond this fall you owe more than you put in, unless the product has negative balance protection.',
      stories: {
        d: 'You hold a position at a leverage of {L}. How far can the price fall before your own money is gone?',
        L: 'Your stake would be gone after a fall of {d}. What leverage are you using?'
      }
    },
    {
      name: 'How much your money swings',
      expr: 'sE = L*sA', tex: '\\sigma_E = L\\,\\sigma_A',
      vars: {
        sE: { name: 'volatility of your own money', q: 'ratio', unit: '%', tex: '\\sigma_E' },
        L: { name: 'leverage', value: 2, min: 1, max: 10 },
        sA: { name: 'volatility of the investment', q: 'ratio', unit: '%', value: 15, tex: '\\sigma_A' }
      },
      note: 'The spread (standard deviation) of yearly returns scales with leverage; the risk of a very bad year grows even faster, because the wipe-out point comes closer.',
      stories: {
        sE: 'An investment\'s yearly returns have a volatility of {sA}. You hold it at a leverage of {L}. How volatile is the return on your own money?',
        L: 'You can stand a volatility of {sE} on your own money. The investment has {sA}. What is the most leverage you can use?'
      }
    }
  ],
  examples: [
    {
      title: 'A good year and a bad year at 2 : 1',
      q: 'You have ¤10,000, borrow ¤10,000 at 6 % and invest ¤20,000. Find the return on your own money if the investment returns +15 % and if it returns −15 % over the year.',
      steps: [
        'Leverage: $L = 20\\,000/10\\,000 = 2$. Interest for the year: $10\\,000 \\times 0.06 = ¤600$.',
        'Good year: the fund gains $20\\,000 \\times 0.15 = ¤3{,}000$; after interest you keep ¤2,400, which is $R = 2 \\times 15\\% - 1 \\times 6\\% = 24\\%$.',
        'Bad year: the fund loses ¤3,000 and you still pay ¤600, so you are down ¤3,600: $R = 2 \\times (-15\\%) - 6\\% = -36\\%$.',
        'Without the loan the results would have been +15 % and −15 %. The loan added 9 points in the good year and took away 21 in the bad one.'
      ],
      a: '+24 % in the good year, −36 % in the bad one (against ±15 % without borrowing).'
    },
    {
      title: 'Break-even and wipe-out at 4 : 1',
      q: 'You put in ¤5,000 and borrow ¤15,000 at 5 %. What investment return do you need to beat not borrowing, what do you make if it returns 8 %, and what fall over the year wipes you out, interest included?',
      steps: [
        '$L = 20\\,000/5\\,000 = 4$. You beat an unleveraged investor only when the investment returns more than the borrowing rate, 5 %; you break even on your own money at $\\tfrac{3}{4} \\times 5\\% = 3.75\\%$.',
        'At 8 %: $R = 4 \\times 8\\% - 3 \\times 5\\% = 32\\% - 15\\% = 17\\%$.',
        'Interest for the year: $15\\,000 \\times 0.05 = ¤750$. Your ¤5,000 is gone when the fund loses $5\\,000 - 750 = ¤4{,}250$, a fall of $4\\,250/20\\,000 = 21.25\\%$ — not the 25 % of $1/L$, because the interest is owed as well.'
      ],
      a: 'Break-even on your money at 3.75 %; 17 % at an 8 % return; wiped out by a 21.25 % fall within the year.'
    }
  ],
  quiz: [
    { q: 'You invest ¤5,000 of your own money and ¤15,000 borrowed. What is your leverage?', answer: 4,
      why: 'Leverage is the value controlled over your own money: 20,000 ÷ 5,000 = 4, "four to one".' },
    { q: 'At 4 : 1, borrowing at 5 %, the investment returns 8 % in a year. What is the return on your own money?', answer: 17, unit: '%',
      why: '$R = L\\,r_a - (L-1)\\,r_b = 4 \\times 8\\% - 3 \\times 5\\% = 17\\%$.' },
    { q: 'At 10 : 1, the price falls 7 %. Before interest, your own money…', choices: ['falls 7 %', 'falls 70 %', 'is wiped out', 'falls 17 %'], a: 1,
      why: 'The whole fall lands on your tenth of the position: 10 × 7 % = 70 %. A fall of 10 % would wipe you out.' },
    { q: 'If the investment returns less than the borrowing rate, borrowing to invest makes your return worse than not borrowing.', a: true,
      why: 'The difference from not borrowing is $(L-1)(r_a - r_b)$: negative whenever $r_a < r_b$, and larger the more you borrow.' },
    { q: 'You hold a position with a fixed loan. After the price falls, your leverage…', choices: ['falls', 'stays the same', 'rises', 'returns to 1'], a: 2,
      why: 'The loan is unchanged while your equity shrinks, so assets ÷ equity grows: ¤15,000 against ¤5,000 of equity is 3 : 1, up from 2 : 1.' }
  ],
  applications: [
    'Reading the risk of a mortgage, a margin loan or a trading app in one number: the fall that wipes you out.',
    'Judging whether an investment\'s expected return justifies the cost of borrowing for it.',
    'Understanding why highly indebted companies, banks and funds are fragile in downturns.'
  ],
  sim: 'lev-amplifier'
},

/* ================================================================ MARGIN */
{
  id: 'margin-trading', parent: 'leverage', title: 'Buying on margin', level: 2,
  short: 'A margin account lets a broker lend you part of the price of the shares you buy, holding them as security. The initial margin says how much you must put in; the maintenance margin says how little equity you may keep.',
  keywords: ['margin account', 'buying on margin', 'initial margin', 'maintenance margin', 'margin loan', 'margin interest', 'buying power', 'Regulation T', 'loan-to-value', 'LVR', 'pattern day trader', 'marginable securities', 'house requirement'],
  prereq: ['leverage-basics', 'stocks-shares', 'brokers'],
  related: ['margin-calls', 'short-selling', 'order-types', 'cfds-forex', 'high-cost-credit'],
  body: `
A margin account is a brokerage account with a credit line attached. You buy shares worth more than the cash you put in; the broker lends the difference, charges interest on it, and holds all the shares as security. As long as your own stake — the **equity** — stays large enough, nothing else happens. Two percentages govern the whole arrangement.

### Initial margin: how much you must put in
The **initial margin** $m_0$ is the share of a purchase you pay with your own money. In the US it has been 50 % for most listed shares since 1974 (the Federal Reserve's Regulation T), and brokers may ask for more. So ¤10,000 of cash gives ¤20,000 of **buying power**, $B = E/m_0$. In the UK, Australia and elsewhere lenders more often quote the reverse, a **loan-to-value ratio** set for each security — for example up to 70 % against a large, liquid share and nothing at all against a small speculative one.

### A worked account
You deposit ¤10,000 and buy 200 shares at ¤100: ¤20,000 of shares, ¤10,000 of your money, ¤10,000 borrowed at 8 % a year.

| | Start, ¤100 | Price ¤120 | Price ¤85 |
|---|---:|---:|---:|
| Value of the shares | ¤20,000 | ¤24,000 | ¤17,000 |
| Loan | ¤10,000 | ¤10,000 | ¤10,000 |
| Equity | ¤10,000 | ¤14,000 | ¤7,000 |
| Margin (equity ÷ value) | 50 % | 58.3 % | 41.2 % |
| After a year's interest (¤800) | — | +32 % | −38 % |

The share moved +20 % or −15 %; your money moved +32 % or −38 %. The margin in the fourth row is the number the broker watches:

$$m = \\frac{nP - D}{nP}$$

with $n$ shares at price $P$ and a loan $D$. It rises when the price rises and falls when it falls, because the loan does not move.

### Maintenance margin: how little you may keep
The **maintenance margin** $m_m$ is the lowest margin the broker tolerates. US rules (FINRA) set a floor of 25 % for shares held long; many brokers use 30–40 %, more for volatile shares, and they can raise it without notice — often just when markets turn rough. Drop below it and you get a **margin call**: add cash, or the broker sells ([[margin-calls]]). With 50 % initial and 25 % maintenance, our account is called when the price reaches ¤66.67, a fall of one third.

### The interest is certain; the gain is not
Interest is charged every day on the loan, whatever the shares do. At 8 % on ¤10,000 that is ¤800 a year, so the shares must rise 4 % a year just to pay for the borrowing. Margin rates differ widely between brokers and with the size of the loan; on small accounts they are often several percentage points above the central bank's rate — compare them as you would any [[high-cost-credit|consumer credit]].

### Other rules worth knowing
- **Not every share is marginable.** Brokers lend little or nothing against small, volatile or newly listed shares.
- **Day trading.** In the US, since 2001 the "pattern day trader" rule has required at least 25,000 US dollars of equity in a margin account used for four or more day trades within five business days; changes to it were under discussion in the mid-2020s, so check the current rule.
- **Short selling** always runs through a margin account, because you borrow the shares you sell ([[short-selling]]).

> [!tip] Before you switch on margin in an app, find three numbers in the terms: the interest rate for your loan size, the maintenance margin for what you plan to buy, and whether the broker may sell without calling you first. (It usually may.)

### What this means for you
A margin loan is the cheapest and most flexible leverage many investors can get, and borrowing a small fraction of a diversified portfolio can be managed calmly. But it is a loan secured on something whose price moves every second, from a lender who can change the terms and sell your holdings. The simulation shows how often an ordinary random path reaches the maintenance line at different levels of borrowing.
`,
  ideas: [
    'In a margin account the broker lends part of the purchase price and holds all the shares as security.',
    'The initial margin is the share you pay yourself; with 50 %, cash buys twice its value in shares.',
    'Margin = equity ÷ value of the shares; it falls as the price falls, because the loan stays the same.',
    'Below the maintenance margin the broker calls for money or sells, and it may raise the maintenance level at any time.',
    'Margin interest is owed every day; the shares must beat it before leverage adds anything.'
  ],
  pitfalls: [
    'Buying power is money I have — It is a loan offer. Using all of it puts you at the maximum leverage the broker allows, with the smallest cushion before a margin call.',
    'The broker will always warn me before selling — Margin agreements usually let the broker sell without notice, choosing what and when; a margin call is a courtesy, not a right.',
    'Margin interest is too small to matter — At 8 % on a 2 : 1 position it takes the first 4 % a year of the shares\' gains; if they return less than the rate, borrowing makes your result worse.'
  ],
  formulas: [
    {
      name: 'Margin in the account',
      expr: 'm = 1 - D/(n*P)', tex: 'm = \\frac{nP - D}{nP}',
      vars: {
        m: { name: 'margin (equity as a share of the value)', q: 'ratio', unit: '%' },
        n: { name: 'number of shares', int: true, value: 200 },
        P: { name: 'share price', q: 'money', unit: '$', value: 100 },
        D: { name: 'margin loan', q: 'money', unit: '$', value: 10000 }
      },
      note: 'Solve for $P$ to find the price at which the margin falls to a given level — with $m$ set to the maintenance margin, that is the margin-call price.',
      practice: { unknowns: ['m', 'P', 'D'] },
      stories: {
        m: 'You hold {n} shares at {P} each, with a margin loan of {D}. What is the margin in your account?',
        P: 'You hold {n} shares with a margin loan of {D}. At what share price does your margin fall to {m}?',
        D: 'You hold {n} shares at {P} and your margin is {m}. How large is your loan?'
      }
    },
    {
      name: 'Buying power',
      expr: 'B = E/m0', tex: 'B = \\frac{E}{m_0}',
      vars: {
        B: { name: 'value of shares you can buy', q: 'money', unit: '$' },
        E: { name: 'your own money', q: 'money', unit: '$', value: 10000 },
        m0: { name: 'initial margin', q: 'ratio', unit: '%', value: 50, tex: 'm_0' }
      },
      stories: {
        B: 'You have {E} in a margin account with an initial margin of {m0}. What is the most stock you can buy?',
        E: 'You want to buy {B} of shares with an initial margin of {m0}. How much cash do you need?'
      }
    },
    {
      name: 'Return on your money with a margin loan',
      expr: 'R = (P1/P0 - 1)/m0 - (1/m0 - 1)*rb*t',
      tex: 'R = \\frac{P_1/P_0 - 1}{m_0} - \\left(\\frac{1}{m_0} - 1\\right) r_b\\, t',
      vars: {
        R: { name: 'return on your own money', q: 'ratio', unit: '%', signed: true },
        P0: { name: 'purchase price', q: 'money', unit: '$', value: 100, tex: 'P_0' },
        P1: { name: 'price when you sell', q: 'money', unit: '$', value: 120, tex: 'P_1' },
        m0: { name: 'initial margin (your share)', q: 'ratio', unit: '%', value: 50, min: 1, max: 100, tex: 'm_0' },
        rb: { name: 'margin interest rate', q: 'ratio', unit: '%', value: 8, tex: 'r_b' },
        t: { name: 'time held', q: 'years', unit: 'yr', value: 1 }
      },
      note: 'The leverage is $1/m_0$ and the loan is $1/m_0 - 1$ times your money; dividends and trading costs are left out. With the defaults: +32 %, against +20 % without the loan.',
      practice: { unknowns: ['R', 'P1'] },
      stories: {
        R: 'You buy shares at {P0} with an initial margin of {m0}, borrowing the rest at {rb} a year. After {t} you sell at {P1}. What is the return on your own money?',
        P1: 'You buy at {P0} with an initial margin of {m0}, borrowing at {rb}. At what price must you sell after {t} to make {R} on your own money?'
      }
    }
  ],
  examples: [
    {
      title: 'The account in a good year and a bad one',
      q: 'You deposit ¤10,000 and buy 200 shares at ¤100 with a 50 % initial margin, borrowing at 8 %. What happens to your money if the price is ¤120 a year later? And if it is ¤85?',
      steps: [
        'Start: shares ¤20,000, loan ¤10,000, equity ¤10,000, margin 50 %. A year\'s interest: $10\\,000 \\times 0.08 = ¤800$.',
        'At ¤120: shares ¤24,000, equity $24\\,000 - 10\\,000 = ¤14{,}000$, margin $14\\,000/24\\,000 = 58.3\\%$. After interest you are up $4\\,000 - 800 = ¤3{,}200$, or 32 %.',
        'At ¤85: shares ¤17,000, equity ¤7,000, margin 41.2 %. After interest you are down $3\\,000 + 800 = ¤3{,}800$, or 38 %.',
        'A cash buyer with the same ¤10,000 would be up 20 % or down 15 %.'
      ],
      a: '+32 % at ¤120 and −38 % at ¤85, against +20 % and −15 % without the loan.'
    },
    {
      title: 'When the shares do not beat the loan',
      q: 'You buy ¤30,000 of shares with ¤15,000 of your own money, borrowing at 9 %. The shares rise 7 % in the year. Did the loan help?',
      steps: [
        'Interest: $15\\,000 \\times 0.09 = ¤1{,}350$ — the shares must rise $1\\,350/30\\,000 = 4.5\\%$ just to cover it.',
        'Gain on the shares: $30\\,000 \\times 0.07 = ¤2{,}100$; after interest ¤750, which is 5 % on your ¤15,000.',
        'Without the loan, ¤15,000 of shares would have made ¤1,050, or 7 %. With $r_a < r_b$ leverage lowered the return: $2 \\times 7\\% - 9\\% = 5\\%$.'
      ],
      a: 'No: 5 % on your money with the loan, 7 % without it — and more risk for the privilege.'
    }
  ],
  quiz: [
    { q: 'With an initial margin of 50 %, how much stock can ¤8,000 of cash buy?', answer: 16000, unit: '$',
      why: 'Buying power is equity ÷ initial margin: 8,000 ÷ 0.5 = ¤16,000; the broker lends the other ¤8,000.' },
    { q: 'You bought 200 shares at ¤100 with a ¤10,000 margin loan. The price falls to ¤80. What is your margin?', answer: 37.5, unit: '%',
      why: 'The shares are worth ¤16,000 and you owe ¤10,000, so your equity is ¤6,000: 6,000 ÷ 16,000 = 37.5 %.' },
    { q: 'On a purchase with 50 % initial margin, the price falls 20 %. Before interest, your equity falls by…', choices: ['20 %', '40 %', '50 %', '10 %'], a: 1,
      why: 'At 2 : 1 the fall is doubled on your money: ¤20,000 of shares losing 20 % is ¤4,000, which is 40 % of your ¤10,000.' },
    { q: 'Margin interest is charged only while the investment is losing money.', a: false,
      why: 'Interest accrues every day on the loan, whatever the shares do; it is the one part of the trade that is certain.' },
    { q: 'Which of these can a broker usually do under a margin agreement without asking you first?', choices: ['Raise the maintenance margin on a share and sell your holdings if you fall short', 'Change the price you paid for your shares', 'Stop charging interest while you are in profit', 'Make you buy more shares'], a: 0,
      why: 'Margin agreements typically let the broker change its requirements and liquidate positions at its discretion to protect the loan.' }
  ],
  applications: [
    'Reading a broker\'s margin terms before switching margin on in a trading app.',
    'Borrowing a modest amount against a diversified portfolio for a short-term need, knowing where a call would come.',
    'Short selling, which always runs through a margin account.'
  ],
  history: 'After the crash of 1929, in which heavily margined buyers were sold out en masse, the US Securities Exchange Act of 1934 gave the Federal Reserve the power to set margin requirements. The Federal Reserve raised the initial margin as high as 100 % just after the Second World War, and it has stayed at 50 % since 1974.',
  sim: 'lev-margin-account'
},

{
  id: 'margin-calls', parent: 'leverage', title: 'Margin calls and liquidation', level: 2,
  short: 'When a falling price pushes the equity in a margin account below the maintenance level, the broker demands more money or sells — often at the worst moment, turning a temporary fall into a permanent loss.',
  keywords: ['margin call', 'maintenance margin', 'liquidation', 'forced selling', 'forced sale', 'stop-out', 'negative equity', 'gap risk', 'deleveraging', 'margin call price', 'cascade', 'fire sale', 'house call'],
  prereq: ['margin-trading', 'volatility'],
  related: ['cfds-forex', 'futures-forwards', 'drawdowns', 'bubbles', 'financial-crises', 'loss-aversion', 'money-anxiety'],
  body: `
A margin call is the moment leverage stops being abstract. The price has fallen, the equity in your account has shrunk below the broker's maintenance margin, and you are asked — by e-mail, by a message in the app, sometimes not at all — to put in more money. If you cannot or do not, the broker sells your holdings until the account is safe again. Knowing exactly when that happens, and what it costs, is the best protection against it.

### When the call comes
Take the account from [[margin-trading]]: 200 shares bought at ¤100 with ¤10,000 of your own money and a ¤10,000 loan, and a maintenance margin of 25 %. The loan stays fixed while the price moves, so the margin falls to $m_m$ at

$$P_c = \\frac{D}{n\\,(1 - m_m)} = \\frac{(1 - m_0)\\,P_0}{1 - m_m}$$

Here $P_c = 10\\,000/(200 \\times 0.75) = ¤66.67$, a fall of one third. The fall that triggers the call depends only on the two margins, $(m_0 - m_m)/(1 - m_m)$. For shares bought at ¤100:

| Initial margin | Maintenance margin | Call at a price of | Fall that triggers it |
|---:|---:|---:|---:|
| 50 % | 25 % | ¤66.67 | 33.3 % |
| 50 % | 30 % | ¤71.43 | 28.6 % |
| 50 % | 40 % | ¤83.33 | 16.7 % |
| 70 % | 30 % | ¤42.86 | 57.1 % |
| 30 % | 25 % | ¤93.33 | 6.7 % |

The last row is the trap: when the maintenance level sits close to the initial one, an ordinary bad week triggers a call.

### Meeting the call
Say the price drops to ¤60. The shares are worth ¤12,000, the loan is ¤10,000, your equity is ¤2,000 — a margin of 16.7 %. To be back at 25 % the equity must be $0.25 \\times 12\\,000 = ¤3{,}000$: you are **¤1,000 short**. Two ways to close the gap:

- **Deposit ¤1,000.** It pays down the loan and the equity rises to ¤3,000.
- **Sell shares and repay the loan.** Selling adds no equity — it only shrinks the position — so you must sell the shortfall divided by the maintenance margin: $1\\,000/0.25 = ¤4{,}000$ of shares, a third of what you hold. Brokers often sell enough to reach a higher "house" level; to get back to 50 % here they would sell ¤8,000, two-thirds of the position.

### Selling at the bottom
Now suppose the broker sells everything at ¤60 and the share later recovers to ¤100. Someone who bought 100 shares with cash is back where they started. You have ¤2,000 left of your ¤10,000 — **80 % gone for good**, plus the interest. Both investors suffered the same fall on paper; only the leveraged one was made to turn it into a real loss. That is the central danger of margin: not the drop itself, but being forced to sell during it.

> [!warn] You can lose more than you put in. If the share opens at ¤45 after bad news overnight, the shares are worth ¤9,000 against a ¤10,000 loan: your ¤10,000 is gone and you owe the broker ¤1,000 more.

### When everyone gets the call at once
Forced sales push prices down, which triggers more calls, which force more sales. In the late 1920s many US investors bought shares with 10–20 % down, and the forced selling of October 1929 deepened the crash. The spiral recurs wherever leverage piles up: in 2021 a family investment office's heavily leveraged positions collapsed within days and the banks that had financed them lost roughly ten billion US dollars between them, and cryptocurrency exchanges have liquidated billions' worth of leveraged positions in a single day of falling prices ([[bubbles]], [[financial-crises]]).

### What this means for you
Work out your call price *before* you borrow, and compare the fall it implies with how far the investment has fallen in the past ([[drawdowns]]). Borrowing a quarter of a diversified portfolio's value, with a 30 % maintenance margin, leaves room for a fall of about 64 % before a call; borrowing the maximum on one volatile share leaves almost none. Keep cash aside that you are willing to deposit and decide in advance what you will do if the call comes. The investor who never panics over a margin call is usually the one who borrowed little enough never to get one.
`,
  ideas: [
    'The call comes at $P_c = (1 - m_0)P_0/(1 - m_m)$: with 50 % down and 25 % maintenance, after a fall of one third.',
    'To meet a call you deposit the shortfall, or sell the shortfall divided by the maintenance margin — four times as much at 25 %.',
    'A forced sale turns a temporary fall into a permanent loss; a later recovery helps only those still holding.',
    'A price gap can take the equity below zero: with a margin loan you can lose more than you deposited.',
    'Margin calls feed on each other in a falling market, which is why leverage turns corrections into crashes.'
  ],
  pitfalls: [
    'A margin call means I must sell — You may deposit cash instead; but if you do neither quickly, the broker sells, choosing what and at what price.',
    'If the price comes back, I will be fine — Only if you are still holding. After a forced sale the recovery happens without you.',
    'Selling ¤1,000 of shares fixes a ¤1,000 shortfall — Selling only shrinks the position; you must sell the shortfall divided by the maintenance margin, ¤4,000 at 25 %.'
  ],
  formulas: [
    {
      name: 'Margin-call price',
      expr: 'Pc = (1 - m0)*P0/(1 - mm)', tex: 'P_c = \\frac{(1 - m_0)\\,P_0}{1 - m_m}',
      vars: {
        Pc: { name: 'price at which the margin call comes', q: 'money', unit: '$', tex: 'P_c' },
        m0: { name: 'initial margin (your share of the purchase)', q: 'ratio', unit: '%', value: 50, tex: 'm_0' },
        P0: { name: 'purchase price', q: 'money', unit: '$', value: 100, tex: 'P_0' },
        mm: { name: 'maintenance margin', q: 'ratio', unit: '%', value: 25, tex: 'm_m' }
      },
      note: 'For a position bought with one loan and held without further deposits; interest added to the loan raises the call price a little. The first form, $D/(n(1 - m_m))$, works for any account: loan over shares.',
      practice: { unknowns: ['Pc', 'm0', 'mm'] },
      stories: {
        Pc: 'You buy a share at {P0} with an initial margin of {m0}. The broker\'s maintenance margin is {mm}. At what price does the margin call come?',
        m0: 'Your broker\'s maintenance margin is {mm}. You buy at {P0} and want the margin call to come no sooner than a price of {Pc}. What share of the purchase must you pay yourself?',
        mm: 'You bought at {P0} with {m0} of your own money, and the call came when the price reached {Pc}. What maintenance margin did the broker use?'
      }
    },
    {
      name: 'The fall that triggers a call',
      expr: 'd = (m0 - mm)/(1 - mm)', tex: 'd = \\frac{m_0 - m_m}{1 - m_m}',
      vars: {
        d: { name: 'price fall that brings a margin call', q: 'ratio', unit: '%' },
        m0: { name: 'initial margin', q: 'ratio', unit: '%', value: 50, tex: 'm_0' },
        mm: { name: 'maintenance margin', q: 'ratio', unit: '%', value: 25, tex: 'm_m' }
      },
      note: 'Compare it with the investment\'s past falls. With $m_0 = 75\\%$ (borrowing a quarter) and $m_m = 30\\%$ the cushion is 64 %.',
      practice: { unknowns: ['d', 'm0'] },
      stories: {
        d: 'You buy with an initial margin of {m0}; the maintenance margin is {mm}. How far can the price fall before a margin call?',
        m0: 'With a maintenance margin of {mm}, you want to survive a fall of {d} without a call. What initial margin must you use?'
      }
    },
    {
      name: 'Cash needed to meet a call',
      expr: 'S = D - (1 - mm)*n*P', tex: 'S = D - (1 - m_m)\\,nP',
      vars: {
        S: { name: 'cash to deposit (the shortfall)', q: 'money', unit: '$' },
        D: { name: 'margin loan', q: 'money', unit: '$', value: 10000 },
        mm: { name: 'maintenance margin', q: 'ratio', unit: '%', value: 25, tex: 'm_m' },
        n: { name: 'number of shares', int: true, value: 200 },
        P: { name: 'share price now', q: 'money', unit: '$', value: 60 }
      },
      note: 'The required equity $m_m\\,nP$ minus the equity you have, $nP - D$. A negative answer means there is no call.',
      practice: { unknowns: ['S', 'P'] },
      stories: {
        S: 'You hold {n} shares, now at {P}, with a margin loan of {D}. The maintenance margin is {mm}. How much cash must you deposit to meet the call?',
        P: 'You hold {n} shares with a loan of {D} and a maintenance margin of {mm}. At what price would you have to deposit {S}?'
      }
    },
    {
      name: 'Shares to sell instead',
      expr: 'X = S/mm', tex: 'X = \\frac{S}{m_m}',
      vars: {
        X: { name: 'value of shares to sell to repay the loan', q: 'money', unit: '$' },
        S: { name: 'shortfall', q: 'money', unit: '$', value: 1000 },
        mm: { name: 'maintenance margin', q: 'ratio', unit: '%', value: 25, tex: 'm_m' }
      },
      note: 'Selling $X$ of shares cuts the loan by $X$ and the required equity by $m_m X$ — the equity itself does not change.',
      stories: {
        X: 'Your account is {S} short of a maintenance margin of {mm}. You add no cash. How much stock must be sold?'
      }
    }
  ],
  examples: [
    {
      title: 'The call, and what it takes',
      q: '200 shares bought at ¤100 with ¤10,000 of your own money and a ¤10,000 loan; maintenance margin 25 %. Where is the call? The price falls to ¤60: how much must you deposit, or sell?',
      steps: [
        { text: 'The call price:', tex: 'P_c = \\frac{D}{n(1 - m_m)} = \\frac{10\\,000}{200 \\times 0.75} = ¤66.67' },
        'At ¤60: shares ¤12,000, equity $12\\,000 - 10\\,000 = ¤2{,}000$, margin 16.7 %.',
        'Required equity $0.25 \\times 12\\,000 = ¤3{,}000$, so the shortfall is $S = ¤1{,}000$.',
        'Selling instead: $X = 1\\,000/0.25 = ¤4{,}000$ of shares (about 67 of your 200). Check: shares ¤8,000, loan ¤6,000, equity ¤2,000 — exactly 25 %.'
      ],
      a: 'Call at ¤66.67; at ¤60 deposit ¤1,000, or sell ¤4,000 of shares.'
    },
    {
      title: 'Sold out, then the recovery',
      q: 'Continue: the share falls to ¤60, then recovers to ¤100. Compare (a) the broker selling everything at ¤60, (b) selling just enough (¤4,000) and (c) a cash buyer of 100 shares. Ignore interest.',
      steps: [
        '(a) Selling 200 shares at ¤60 brings ¤12,000; after repaying ¤10,000 you keep ¤2,000. The recovery does nothing for you: −80 %.',
        '(b) After selling ¤4,000 you hold $200 - 66.67 = 133.33$ shares and owe ¤6,000. At ¤100: $13\\,333 - 6\\,000 = ¤7{,}333$, still −26.7 %.',
        '(c) The cash buyer\'s 100 shares are worth ¤10,000 again: 0 %.'
      ],
      a: '−80 %, −26.7 % and 0 %: the same price path, three very different results.'
    },
    {
      title: 'Borrow less, get called less',
      q: 'With a maintenance margin of 30 %, compare the cushion before a call when you borrow half the value of a portfolio and when you borrow a quarter.',
      steps: [
        'Borrowing half: $m_0 = 50\\%$, $d = (0.50 - 0.30)/(1 - 0.30) = 28.6\\%$.',
        'Borrowing a quarter: $m_0 = 75\\%$, $d = (0.75 - 0.30)/0.70 = 64.3\\%$.',
        'Broad share markets fall 30 % or so in an ordinary bear market; falls beyond 60 % are rare, though US shares lost more than 80 % between 1929 and 1932.'
      ],
      a: 'A 28.6 % fall against a 64.3 % fall before a call.'
    }
  ],
  quiz: [
    { q: 'You buy shares at ¤50 with a 50 % initial margin. The maintenance margin is 30 %. At what price does a margin call come?', answer: 35.71, unit: '$',
      why: '$P_c = (1 - 0.5) \\times 50/(1 - 0.3) = 25/0.7 = ¤35.71$, a fall of 28.6 %.' },
    { q: 'Your account is ¤1,000 short of a 25 % maintenance margin and you add no cash. How much stock must be sold?', choices: ['¤1,000', '¤2,500', '¤4,000', '¤250'], a: 2,
      why: 'Selling shares only shrinks the position: each ¤1 sold cuts the required equity by ¤0.25, so the shortfall must be divided by 0.25.' },
    { q: 'With a margin account you can never lose more than the money you deposited.', a: false,
      why: 'If the price gaps below the loan divided by the number of shares, the equity is negative and you owe the broker the difference.' },
    { q: 'Why can margin calls make a market fall worse?', choices: ['Forced sales push prices lower, triggering further calls', 'Brokers must buy shares to meet calls', 'Margin calls raise interest rates', 'They cannot: calls are always met with cash'], a: 0,
      why: 'Each forced sale adds selling pressure; lower prices put more accounts below their maintenance margin, and the spiral feeds itself.' },
    { q: 'Initial margin 50 %, maintenance margin 25 %: by what percentage must the price fall to trigger a call?', answer: 33.33, unit: '%',
      why: '$(m_0 - m_m)/(1 - m_m) = 0.25/0.75 = 33.3\\%$.' }
  ],
  applications: [
    'Choosing a level of borrowing whose call price lies below the investment\'s worst historical falls.',
    'Deciding in a calm moment what you will do when a call comes: deposit, sell, or both.',
    'Understanding the forced selling behind crashes from 1929 to cryptocurrency liquidations.'
  ],
  sim: { id: 'lev-margin-account', params: { m0: 40, sigma: 45 } }
},

/* ================================================================ LEVERAGED ETFS */
{
  id: 'leveraged-etfs', parent: 'leverage', title: 'Leveraged ETFs and volatility drag', level: 2,
  short: 'Funds that deliver two or three times — or minus one times — an index\'s return every day. Over longer periods they do not deliver that multiple: the daily reset makes them gain in steady trends and bleed in choppy markets.',
  keywords: ['leveraged ETF', 'inverse ETF', '2x', '3x', 'daily reset', 'volatility drag', 'volatility decay', 'beta slippage', 'path dependence', 'leveraged ETP', 'daily leverage', 'compounding'],
  prereq: ['leverage-basics', 'mutual-funds-etfs', 'volatility', 'compounding-returns'],
  related: ['index-investing', 'investment-fees', 'drawdowns', 'short-selling', 'math:exponential-functions', 'math:logarithms'],
  body: `
A leveraged exchange-traded fund promises something that sounds simple: twice, or three times, the index's return. An inverse fund promises the opposite, minus once or minus twice. The fine print says **daily**. Each evening the fund adjusts its borrowing or its derivatives so that its exposure is again exactly two or three times its value. That reset makes the fund behave very differently from "the index times two" over any period longer than a day.

### Two days that explain everything
An index at 100 rises 10 % to 110, then falls 9.09 % back to 100. It has gone nowhere. A 2× fund rises 20 % to 120, then falls 18.18 % to **98.18**. A 3× fund goes to 130, then to **94.55**. The −1× inverse fund falls 10 % and then rises 9.09 %: it too ends at 98.18. All of them lost money on an index that went nowhere.

The cause is the arithmetic of percentages: after a loss you need a larger gain to get back ([[drawdowns]]), and leverage enlarges both the loss and the gain needed. A choppy market repeats this again and again. Twenty days alternating +5 % and −5 %: the index loses 2.5 %, a 2× fund loses 9.6 %, a 3× fund loses **20.3 %**. In a steady trend the effect runs the other way: ten days of +1 % lift the index 10.5 % and a 2× fund 21.9 % — more than twice, because the fund compounds its daily 2 %.

### Volatility drag
Over longer periods the two effects combine into a useful approximation. For a fund with daily leverage $L$ on an index that moves from $S_0$ to $S_1$ with volatility $\\sigma$ over $T$ years, before fees and financing,

$$V_1 \\approx V_0 \\left(\\frac{S_1}{S_0}\\right)^{L} e^{-(L^2 - L)\\,\\sigma^2 T/2}$$

The first factor rewards a trend, magnified; the second, the **volatility drag**, grows with the *square* of the leverage. If the index ends a year flat:

| Leverage | 20 % volatility | 40 % volatility |
|---:|---:|---:|
| 2× | −3.9 % | −14.8 % |
| 3× | −11.3 % | −38.1 % |
| −1× | −3.9 % | −14.8 % |
| −2× | −11.3 % | −38.1 % |

And if the index rises 10 % in a year of 20 % volatility, the 3× fund's expected result is about +18 %, not +30 %. On top of this come the costs: management fees of around 1 % a year — well above an ordinary index fund — and the cost of financing the extra exposure.

### When they bite
These funds are built for traders holding them for a day or a few, and their documents say so. Regulators have warned repeatedly (in the US, FINRA in 2009) after buy-and-hold investors found that a fund promising "2× the index" had lost money in a year the index gained. Volatility is the enemy: in the sharp falls of early 2020 some leveraged funds lost most of their value within weeks, and in February 2018 a few products that bet on calm markets lost most of their value in a single day; at least one was shut down. A 3× fund is wiped out by a 33 % fall in one day.

> [!key] A leveraged ETF multiplies each day's return, not the year's. Over a year its result depends on the path the index took, not only on where it ended.

### What this means for you
If a 3× fund tempts you because the index "always goes up in the long run", look at the drag: at ordinary volatility it costs roughly a tenth of your money a year before fees, and a bad month can take most of it. Holding one for years is a bet on a strong, smooth trend. The simulation runs the same fund through many random markets with identical average returns so you can see how often the drag wins.
`,
  ideas: [
    'A leveraged ETF resets every day to $L$ times its value, so it delivers $L$ times each day\'s return — not the month\'s or the year\'s.',
    'In a choppy market both leveraged and inverse funds lose money even if the index ends where it began.',
    'In a smooth trend a leveraged fund can beat $L$ times the index\'s return, because it compounds.',
    'Volatility drag grows with $L^2 - L$: for a flat year at 20 % volatility, about −4 % at 2× and −11 % at 3×.',
    'Fees, financing and the risk of a single catastrophic day come on top of the drag.'
  ],
  pitfalls: [
    '"2× the index" means twice the index\'s return over my holding period — Only over one day. Over longer periods the result depends on the path; in a volatile sideways market a 2× fund and an inverse fund can both lose.',
    'An inverse fund is a safe way to profit from a fall — It suffers the same drag, pays fees, and loses when the market rises; held for months, it can lose even if the market eventually falls.',
    'The drag is a charge I can see in the fund\'s costs — It appears nowhere in the fees. It is the arithmetic of daily compounding and shows only in the results.'
  ],
  formulas: [
    {
      name: 'Two days of a daily-leveraged fund',
      expr: 'V = V0*(1 + L*r1)*(1 + L*r2)', tex: 'V = V_0\\,(1 + L\\,r_1)(1 + L\\,r_2)',
      vars: {
        V: { name: 'value after two days', q: 'money', unit: '$' },
        V0: { name: 'amount invested', q: 'money', unit: '$', value: 10000, tex: 'V_0' },
        L: { name: 'daily leverage (negative for inverse funds)', value: 2, signed: true, fixed: true },
        r1: { name: 'index return on day 1', q: 'ratio', unit: '%', value: 10, signed: true, tex: 'r_1' },
        r2: { name: 'index return on day 2', q: 'ratio', unit: '%', value: -9.0909, signed: true, tex: 'r_2' }
      },
      note: 'The defaults take the index from 100 to 110 and back to 100; the 2× fund ends at ¤9,818.18. Try $L = 3$ and $L = -1$. Extend the product one factor per day for longer paths.',
      practice: { unknowns: ['V'] },
      stories: {
        V: 'You put {V0} into a fund with a daily leverage of {L}. The index moves {r1} on the first day and {r2} on the second. What is your fund worth?'
      }
    },
    {
      name: 'Volatility drag over a longer period',
      expr: 'V = V0*(S1/S0)^L*exp(-(L^2 - L)*sigma^2*T/2)',
      tex: 'V = V_0 \\left(\\frac{S_1}{S_0}\\right)^{L} e^{-(L^2 - L)\\,\\sigma^2 T/2}',
      vars: {
        V: { name: 'value of the fund at the end', q: 'money', unit: '$' },
        V0: { name: 'amount invested', q: 'money', unit: '$', value: 10000, tex: 'V_0' },
        S0: { name: 'index level at the start', value: 100, tex: 'S_0' },
        S1: { name: 'index level at the end', value: 110, tex: 'S_1' },
        L: { name: 'daily leverage', value: 3, signed: true, fixed: true },
        sigma: { name: 'volatility of the index (yearly)', q: 'ratio', unit: '%', value: 20, tex: '\\sigma' },
        T: { name: 'time held', q: 'years', unit: 'yr', value: 1 }
      },
      note: 'A continuous-time approximation, before fees and financing, assuming steady volatility. With the defaults the index gains 10 % and the 3× fund about 18 %; set $S_1 = S_0$ to see the drag alone.',
      practice: { unknowns: ['V', 'sigma'] },
      stories: {
        V: 'You hold {V0} in a fund with daily leverage {L} for {T}. The index goes from {S0} to {S1} with a volatility of {sigma}. Roughly what is the fund worth, before fees?',
        sigma: 'A fund with daily leverage {L} turned {V0} into {V} over {T} while its index went from {S0} to {S1}. What volatility does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'Up 10 %, then back',
      q: 'An index goes from 100 to 110 and back to 100. What happens to ¤10,000 in a 2× fund, a 3× fund and a −1× fund?',
      steps: [
        'Day 2 return of the index: $100/110 - 1 = -9.09\\%$.',
        '2×: $10\\,000 \\times 1.20 \\times (1 - 0.1818) = ¤9{,}818$ (−1.8 %).',
        '3×: $10\\,000 \\times 1.30 \\times (1 - 0.2727) = ¤9{,}455$ (−5.5 %).',
        '−1×: $10\\,000 \\times 0.90 \\times 1.0909 = ¤9{,}818$ (−1.8 %).'
      ],
      a: '¤9,818, ¤9,455 and ¤9,818 — every fund lost while the index went nowhere.'
    },
    {
      title: 'A good year for the index',
      q: 'The index rises 10 % over a year with 20 % volatility. What does ¤10,000 in a 3× daily fund become, before fees? Compare with ¤30,000 of index bought with ¤20,000 borrowed and simply held (ignore interest).',
      steps: [
        'Trend factor: $1.1^3 = 1.331$. Drag: $e^{-(9 - 3) \\times 0.04/2} = e^{-0.12} = 0.887$.',
        'Fund: $10\\,000 \\times 1.331 \\times 0.887 = ¤11{,}805$, about +18 %.',
        'Held leverage: ¤30,000 grows to ¤33,000; after repaying ¤20,000 you have ¤13,000, +30 %.',
        'The daily reset cost about ¤1,195 in this year — and it would have helped in a smooth year with low volatility.'
      ],
      a: 'About ¤11,805 (+18 %) against ¤13,000 (+30 %) for leverage bought once and held.'
    }
  ],
  quiz: [
    { q: 'An index rises 10 % one day and falls 10 % the next. Over the two days a 2× daily fund…', choices: ['ends flat', 'loses 2 %', 'loses 4 %', 'gains 2 %'], a: 2,
      why: 'The index ends at 1.1 × 0.9 = 0.99 (−1 %); the fund at 1.2 × 0.8 = 0.96, a 4 % loss — four times the index\'s loss, not two.' },
    { q: 'Over a year, a 2× leveraged ETF returns about twice the index\'s yearly return.', a: false,
      why: 'Only each day\'s return is doubled. Over a year the result depends on the path: less than twice in volatile markets, more in smooth trends.' },
    { q: 'By the drag formula, how much does a 3× fund lose over a year in which the index ends flat with 30 % volatility?', answer: 23.66, unit: '%',
      why: '$1 - e^{-(9 - 3) \\times 0.09/2} = 1 - e^{-0.27} = 23.7\\%$ — before fees.' },
    { q: 'In which market is a 3× fund most likely to beat three times the index\'s return?', choices: ['a steady, smooth rise', 'a choppy sideways market', 'a crash followed by a recovery', 'any market, if held long enough'], a: 0,
      why: 'Low volatility and a persistent trend let daily compounding work for the fund; choppiness and reversals work against it.' },
    { q: 'Why does the drag grow so quickly with leverage?', choices: ['It is proportional to $L^2 - L$: a 3× fund suffers three times the drag of a 2× fund', 'Because the fees triple', 'It grows in proportion to $L$', 'It does not: the drag is the same for every fund'], a: 0,
      why: '$L^2 - L$ is 2 at 2× and 6 at 3×: one more unit of leverage triples the drag.' }
  ],
  applications: [
    'Reading the daily-reset warning in a leveraged fund\'s documents and knowing what it means for a long hold.',
    'Understanding why an inverse fund bought as a "hedge" lost money in a falling but volatile market.',
    'Any daily-rebalanced strategy: the same arithmetic governs constant-leverage portfolios.'
  ],
  sim: 'lev-etf-drag'
},

/* ================================================================ CFDS AND FOREX */
{
  id: 'cfds-forex', parent: 'leverage', title: 'CFDs, forex and retail leverage', level: 2,
  short: 'Contracts for difference and spot forex let retail traders take large positions with a small deposit. Pips, lots and margin decide how fast money moves; regulators cap retail leverage because most such accounts lose money.',
  keywords: ['CFD', 'contract for difference', 'forex', 'FX', 'currency trading', 'pip', 'pip value', 'lot', 'standard lot', 'mini lot', 'micro lot', 'spread', 'leverage cap', 'ESMA', 'margin close-out', 'stop-out', 'negative balance protection', 'overnight financing', 'retail trading', 'trading app'],
  prereq: ['leverage-basics', 'margin-calls', 'exchange-rates'],
  related: ['currency-exchange', 'futures-forwards', 'scams-fraud', 'cognitive-biases', 'loss-aversion', 'bid-ask-liquidity', 'money-anxiety'],
  body: `
Trading apps advertise it everywhere: trade currencies, gold, indices and shares "with leverage" from a deposit of a few hundred. Two products sit behind most of these offers. In **spot forex** you exchange one currency for another without ever taking delivery. A **contract for difference (CFD)** is an agreement with the provider to settle in cash the change in the price of something — a share, an index, gold, oil — between opening and closing; you never own the thing itself. Both are traded on margin, and the other side of your trade is usually the provider.

### Pips and lots
A currency pair such as EUR/USD is quoted as the units of the second currency (the *quote*) that buy one unit of the first (the *base*), say 1.1000. The customary smallest step, a **pip**, is 0.0001 for most pairs and 0.01 for pairs quoted in yen. Positions come in **lots**: 100,000 units of the base currency for a standard lot, 10,000 for a mini lot and 1,000 for a micro lot. One pip on $u$ units is worth $v = u\\,p$ in the quote currency — on a standard lot $100\\,000 \\times 0.0001 = 10$, or ¤10 per pip if your account is kept in the quote currency (and $10 \\div 1.1 = 9.09$ units if it is kept in the base currency). A 1 % move at 1.1000 is 110 pips: ¤1,100 on a standard lot.

### Margin and the stop-out
At 30 : 1 the provider asks for one-thirtieth of the position's value as margin. Deposit ¤1,000 and open a ¤30,000 position (27,273 units of the base currency at 1.1000): every 1 % the rate moves is ¤300 — **30 % of your deposit**. Providers close positions automatically before an account goes negative. Under the European and UK rules this **margin close-out** comes when your equity falls to half the required margin — here a loss of ¤500, a move against you of only **1.67 %** (183 pips):

$$x = \\frac{E - c\\,N/L}{N}$$

with equity $E$, close-out level $c$, position $N$ and leverage $L$. A major currency pair with a typical volatility of 8 % a year moves that far against a position at some point within a given week about one week in eight. Holding overnight also costs **financing**, usually a benchmark rate plus a few per cent a year on the *whole position*: on a ¤20,000 index CFD held with ¤1,000 of margin, 7 % a year is ¤3.84 a night, ¤1,400 a year — 140 % of the margin.

### The rules for retail traders
After studies found that most retail clients lost money, several regulators capped the leverage a provider may offer them (approximate, as introduced):

| Where, from | Major currency pairs | Other pairs, gold, major indices | Other commodities, minor indices | Single shares | Crypto-assets |
|---|---:|---:|---:|---:|---:|
| European Union, 2018 | 30 : 1 | 20 : 1 | 10 : 1 | 5 : 1 | 2 : 1 |
| United Kingdom, 2019 | 30 : 1 | 20 : 1 | 10 : 1 | 5 : 1 | 2 : 1 |
| Australia, 2021 | 30 : 1 | 20 : 1 | 10 : 1 | 5 : 1 | 2 : 1 |

The same packages added the 50 % close-out, **negative balance protection** (a retail client cannot lose more than the account holds) and limits on bonuses. In the US, CFDs may not be offered to retail clients at all, and retail forex has been limited to 50 : 1 on major pairs and 20 : 1 on others since 2010; Japan has capped retail currency leverage at 25 : 1 since 2011. Professional clients, and providers outside these jurisdictions, may offer 100 : 1, 500 : 1 or more.

### The warning on every page
In the EU and UK a provider must display a standard warning stating what share of **its own retail accounts lost money** on CFDs over the past twelve months. The published figures have typically been well above half, often in the region of two-thirds to four-fifths, and the European regulator's 2018 review of national studies found roughly three-quarters or more of retail accounts losing. It is not bad luck spread evenly: spreads and financing are paid on every trade, and leverage turns ordinary noise into stop-outs.

> [!warn] Offers of 500 : 1, bonuses for depositing, "guaranteed" signals or a regulator you have never heard of are the marks of a scam. Look the firm up on the regulator's own register before sending money ([[scams-fraud]]).

### What this means for you
Currencies and indices are not bad things to hold — businesses hedge currencies every day ([[hedging]]). What the numbers show is that high leverage turns trading into a contest against costs and noise that most people lose. If you try it, use money you can afford to lose entirely, keep your *effective* leverage low (¤3,000 of position on a ¤1,000 account is 3 : 1, and its stop-out is 32 % away, not 1.7 %), know the stop-out before you open, and read the percentage in the warning as what it is: the provider telling you how most of its customers fared.
`,
  ideas: [
    'A pip is 0.0001 on most pairs (0.01 on yen pairs); on a standard lot of 100,000 units it is worth 10 units of the quote currency.',
    'At 30 : 1 every 1 % move is 30 % of the margin, and the 50 % close-out comes after a 1.67 % move against you.',
    'Overnight financing is charged on the whole position, so holding a leveraged CFD for months is expensive.',
    'The EU, UK and Australia cap retail leverage (30 : 1 on major currency pairs down to 2 : 1 on crypto) and require negative balance protection.',
    'Providers must disclose the share of their retail accounts that lose money — typically most of them.'
  ],
  pitfalls: [
    'My deposit is the most I can lose — Only where negative balance protection applies (retail clients in the EU, UK and Australia, for example). Elsewhere a price gap can leave you owing the provider more.',
    'I will watch the screen and close before the stop-out — Prices gap overnight and at weekends, and at 30 : 1 the close-out sits less than 2 % away; it happens automatically, at whatever price is available.',
    'Most traders lose because they lack a good strategy — Costs and leverage are enough on their own: spreads and financing make the average trade a loser, and high leverage turns random noise into stop-outs.'
  ],
  formulas: [
    {
      name: 'Value of one pip',
      expr: 'v = u*p', tex: 'v = u\\,p',
      vars: {
        v: { name: 'value of one pip (in the quote currency)', q: 'money', unit: '$' },
        u: { name: 'position size (units of the base currency)', int: true, value: 100000 },
        p: { name: 'pip size', value: 0.0001, fixed: true }
      },
      note: 'A standard lot is 100,000 units, a mini lot 10,000, a micro lot 1,000. For a yen pair use $p = 0.01$. If your account is in the base currency, divide by the exchange rate.',
      practice: { unknowns: ['v', 'u'] },
      stories: {
        v: 'You trade {u} units of a currency pair whose pip is {p}. What is one pip worth, in the quote currency?',
        u: 'You want each pip to be worth {v}, on a pair whose pip is {p}. How many units should you trade?'
      }
    },
    {
      name: 'Margin required',
      expr: 'M = N/L', tex: 'M = \\frac{N}{L}',
      vars: {
        M: { name: 'margin required', q: 'money', unit: '$' },
        N: { name: 'value of the position', q: 'money', unit: '$', value: 30000 },
        L: { name: 'leverage offered', value: 30 }
      },
      stories: {
        M: 'You open a position worth {N} at a leverage of {L}. How much margin does the provider set aside?',
        N: 'You have {M} of margin available at a leverage of {L}. What is the largest position you can open?'
      }
    },
    {
      name: 'Move against you that triggers the close-out',
      expr: 'x = (E - c*N/L)/N', tex: 'x = \\frac{E - c\\,N/L}{N}',
      vars: {
        x: { name: 'adverse price move to the close-out', q: 'ratio', unit: '%' },
        E: { name: 'equity in the account', q: 'money', unit: '$', value: 1000 },
        c: { name: 'close-out level (share of required margin)', q: 'ratio', unit: '%', value: 50, fixed: true },
        N: { name: 'value of the position', q: 'money', unit: '$', value: 30000 },
        L: { name: 'leverage (required margin = N/L)', value: 30 }
      },
      note: 'With the whole deposit used as margin ($E = N/L$) this is $(1 - c)/L$: 1.67 % at 30 : 1, 0.1 % at 500 : 1. A smaller position on the same deposit moves the close-out much further away.',
      practice: { unknowns: ['x', 'N'] },
      stories: {
        x: 'Your account holds {E}. You open a position worth {N} at a leverage of {L}; positions are closed when equity falls to {c} of the required margin. How far can the price move against you?',
        N: 'Your account holds {E}, leverage is {L} and the close-out comes at {c} of the required margin. How large a position can survive a {x} move against you?'
      }
    },
    {
      name: 'Overnight financing',
      expr: 'F = N*f*d/365', tex: 'F = N\\,f\\,\\frac{d}{365}',
      vars: {
        F: { name: 'financing paid', q: 'money', unit: '$' },
        N: { name: 'value of the position', q: 'money', unit: '$', value: 20000 },
        f: { name: 'yearly financing rate', q: 'ratio', unit: '%', value: 7 },
        d: { name: 'nights held', int: true, value: 30 }
      },
      note: 'Charged on the whole position, not on your margin. Some providers use a 360-day year.',
      practice: { unknowns: ['F'] },
      stories: {
        F: 'You hold a CFD position worth {N} for {d} nights; the financing rate is {f} a year. What do you pay?',
        d: 'Financing at {f} a year on a position worth {N} has cost you {F}. How many nights have you held it?'
      }
    }
  ],
  examples: [
    {
      title: 'What one pip and one per cent are worth',
      q: 'You buy one mini lot (10,000 units) of a pair at 1.1000, with an account in the quote currency, at 30 : 1. What are a pip, a 1 % move and the margin worth?',
      steps: [
        'Pip value: $10\\,000 \\times 0.0001 = ¤1$.',
        'Position value: $10\\,000 \\times 1.1 = ¤11{,}000$; margin at 30 : 1: $11\\,000/30 = ¤366.67$.',
        'A 1 % move is $0.011$, or 110 pips: ¤110 — 30 % of the margin.'
      ],
      a: '¤1 a pip, ¤110 for a 1 % move, ¤366.67 of margin.'
    },
    {
      title: 'How far is the close-out?',
      q: 'You deposit ¤1,000. Compare the adverse move that triggers a 50 % close-out for a ¤30,000 position and for a ¤3,000 position, both at a leverage limit of 30 : 1.',
      steps: [
        '¤30,000: required margin ¤1,000; close-out when equity reaches ¤500, after a loss of ¤500: $x = 500/30\\,000 = 1.67\\%$, about 183 pips at 1.1000.',
        '¤3,000: required margin ¤100; close-out at ¤50 of equity, after a loss of ¤950: $x = 950/3\\,000 = 31.7\\%$.',
        'The leverage *offered* is the same; the leverage *used* is 30 : 1 in the first case and 3 : 1 in the second.'
      ],
      a: 'A 1.67 % move against 31.7 % — the position size, not the product, decides the risk.'
    }
  ],
  quiz: [
    { q: 'On a pair quoted to four decimals, what is one pip worth on a standard lot, in units of the quote currency?', answer: 10,
      why: '100,000 units × 0.0001 = 10 units of the quote currency per pip.' },
    { q: 'You use the full 30 : 1. What percentage of your margin does a 1 % adverse move cost?', answer: 30, unit: '%',
      why: 'The position is 30 times the margin, so a 1 % move on it is 30 % of the margin.' },
    { q: 'Under the EU and UK rules for retail clients, a position is closed out when…', choices: ['equity falls to 50 % of the required margin', 'the price moves 50 %', 'the account reaches exactly zero', 'the client asks'], a: 0,
      why: 'The 50 % margin close-out rule, together with negative balance protection, stops most accounts before they go negative.' },
    { q: 'With a CFD on a share you own the share and can vote at its meetings.', a: false,
      why: 'A CFD is a cash-settled contract with the provider. You own no share and have no vote; dividends are at most mirrored as cash adjustments.' },
    { q: 'An index CFD worth ¤20,000 is financed at 7 % a year. What does holding it for 30 nights cost?', answer: 115.07, unit: '$',
      why: '$20\\,000 \\times 0.07 \\times 30/365 = ¤115.07$ — charged on the whole position, however small your margin.' }
  ],
  applications: [
    'Reading a trading app\'s leverage, margin and close-out terms before the first trade.',
    'Sizing a currency position so that ordinary moves cannot trigger a close-out.',
    'Recognising the warning signs of unregulated offshore brokers.'
  ],
  history: 'The European Securities and Markets Authority imposed its CFD restrictions on 1 August 2018 as a temporary measure, after national studies found that most retail clients lost money; national regulators then made them permanent. The UK followed with permanent rules in 2019 and Australia with a product intervention order in 2021.',
  sim: 'lev-fx-position'
}

);
