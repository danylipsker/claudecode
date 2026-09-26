/* HYPER-FINANCES · content/money-basics.js — what money is: its jobs, inflation and what
 * money buys, real against nominal values, and the cost of the road not taken. */
Hyper.add(

{
  id: 'what-is-money', parent: 'money-basics', title: 'What money is', level: 1,
  short: 'Money is whatever a society trusts enough to use for three jobs: paying for things, measuring prices, and carrying value from today into tomorrow. Today most of it is not coins or notes but numbers in bank accounts.',
  keywords: ['money', 'medium of exchange', 'unit of account', 'store of value', 'barter', 'double coincidence of wants', 'fiat money', 'gold standard', 'commodity money', 'currency', 'cash', 'bank deposits', 'legal tender'],
  prereq: ['math:fractions-ratios'],
  related: ['inflation-purchasing-power', 'money-creation', 'central-banks', 'payments', 'hyperinflation', 'money-anxiety'],
  body: `
Picture a village with no money. The baker wants shoes, but the shoemaker wants fish, not bread, and the fisher wants a knife. Every trade needs two people who each hold exactly what the other wants, at the same moment. Economists call this the **double coincidence of wants**, and it makes trading slow, awkward and small. Money removes it: the baker sells bread to anyone for money, and spends that money with anyone who sells shoes.

### The three jobs of money
- **Medium of exchange** — people accept it in payment because they know others will accept it from them.
- **Unit of account** — prices, wages, debts and profits are all written in it, so very different things can be compared on one scale.
- **Store of value** — it keeps purchasing power from today until the day you spend it. It does this job imperfectly: [[inflation-purchasing-power|inflation]] slowly wears it away.

Loans add a fourth use, a *standard of deferred payment*: a debt written in money says exactly what must be repaid, years later.

### Why a common yardstick matters so much
With barter, every pair of goods needs its own exchange ratio (loaves per shoe, fish per knife). With $N$ goods that is

$$B = \\frac{N(N-1)}{2}$$

ratios. A market with 100 goods would need 4,950 of them; with money it needs just 100 prices. That saving — in memory, in comparison, in negotiation — is a large part of why every trading society has invented money.

> [!history] Money has taken many forms: grain, cattle, shells and silver weighed out by the shekel; stamped coins in Lydia (in today's Turkey) around 600 BCE; paper notes in China in the 11th century; banknotes that could be exchanged for gold under the gold standard of the 19th and early 20th centuries. Since 1971, when the United States stopped exchanging dollars for gold with other governments, the world's major currencies have been **fiat money**: valuable because they are trusted and accepted, not because they can be turned into metal.

The tidy story of "first barter, then coins" is closer to a thought experiment than to history — anthropologists find that small communities mostly ran on credit, favours and remembered debts. But the thought experiment explains well what money is *for*.

### What money is today
Most money is not cash. In the UK in the mid-2010s, notes and coins were only about 3 % of the money that people and firms held; the rest were **bank deposits** — entries in a bank's books, created largely when banks lend (see [[money-creation]]). A card payment or a transfer simply moves those entries from one account to another ([[payments]]). Notes and coins are issued by the state or its [[central-banks|central bank]], which also steers interest rates to keep the currency's value fairly stable.

Money works as long as people trust it. When that trust collapses, as in the great [[hyperinflation|hyperinflations]], people spend it the moment they receive it, then start quoting prices in another currency, and finally refuse it altogether — money loses its jobs in the reverse order of how much they depend on trust in the future.

### Money as stored time
For most people money is, first of all, hours of life exchanged for pay. Reading a price as hours of work — the price divided by what you take home per hour — is one of the calmest ways to think about spending: a ¤1,200 phone at ¤15 an hour after tax is 80 hours, two working weeks. That is not a reason to buy it or not; it simply puts the number in terms you feel.

> [!key] Money is a tool built on trust: a way of paying, a yardstick for value and an imperfect container for purchasing power. Understanding the tool is the first step to not being afraid of it.
`,
  ideas: [
    'Money does three jobs: medium of exchange, unit of account and store of value.',
    'It removes the double coincidence of wants that makes barter so awkward.',
    'With N goods, barter needs N(N−1)/2 exchange ratios; money needs only N prices.',
    'Modern money is fiat money, and most of it is bank deposits rather than cash.',
    'Money keeps its value only as long as people trust that others will accept it.'
  ],
  pitfalls: [
    'Money and wealth are the same thing — Money is one way of holding wealth. Wealth also includes homes, businesses, skills and investments; money is the yardstick used to measure them.',
    'Money has value because it can be exchanged for gold — Not since the gold standard ended. Today\'s currencies are fiat money: their value rests on trust, on their use for taxes and debts, and on central banks keeping inflation in check.',
    'Only the central bank creates money — Central banks issue cash and reserves, but most of the money people use is bank deposits, created when commercial banks make loans.'
  ],
  formulas: [
    {
      name: 'Exchange ratios needed under barter',
      expr: 'B = N*(N - 1)/2', tex: 'B = \\frac{N(N-1)}{2}',
      vars: {
        B: { name: 'exchange ratios to agree on', int: true },
        N: { name: 'number of different goods', int: true, value: 100, min: 2, max: 100000 }
      },
      note: 'Every pair of goods needs its own ratio. With money, the same market needs only $N$ prices.',
      practice: { unknowns: ['B', 'N'] },
      stories: {
        B: 'A market trades {N} different goods by barter. How many exchange ratios must traders keep track of?',
        N: 'A barter market needs {B} exchange ratios. How many different goods does it trade?'
      }
    },
    {
      name: 'A price in hours of work',
      expr: 'h = C/w', tex: 'h = \\frac{C}{w}',
      vars: {
        h: { name: 'hours of work it costs' },
        C: { name: 'price of the thing', q: 'money', unit: '$', value: 1200 },
        w: { name: 'take-home pay per hour of work', q: 'money', unit: '$', value: 15 }
      },
      note: 'Use pay after tax and work costs, so that the hours are the ones really exchanged.',
      stories: {
        h: 'A new phone costs {C}. You take home {w} for each hour you work. How many hours of work is the phone?',
        C: 'You take home {w} an hour and are willing to give {h} of work for a holiday. What can the holiday cost?'
      }
    }
  ],
  examples: [
    {
      title: 'The arithmetic of barter',
      q: 'A small market trades 20 goods. How many exchange ratios does barter need, and how many prices does money need?',
      steps: [
        'Barter needs a ratio for every pair of goods: $B = 20 \\times 19 / 2 = 190$.',
        'With money each good has one price: 20 prices.',
        'Add one new good and barter needs 20 more ratios; money needs one more price.'
      ],
      a: '190 exchange ratios against 20 prices.'
    },
    {
      title: 'A purchase in hours',
      q: 'You take home ¤15 for each hour you work. How many hours is a ¤1,200 phone, and how many 40-hour weeks is that?',
      steps: [
        '$h = C/w = 1{,}200 / 15 = 80$ hours.',
        'At 40 hours a week: $80 / 40 = 2$ working weeks.'
      ],
      a: '80 hours — two full working weeks.'
    }
  ],
  quiz: [
    { q: 'In a hyperinflation, which job does money lose first?', choices: ['medium of exchange', 'unit of account', 'store of value', 'all three at the same moment'], a: 2,
      why: 'When prices rise fast, holding money means losing purchasing power, so people spend it at once: it fails as a store of value first. Later prices are quoted in another currency (unit of account), and only at the end do people refuse it in payment.' },
    { q: 'A barter market trades 50 different goods. How many exchange ratios does it need?', answer: 1225,
      why: 'Every pair of goods needs a ratio: 50 × 49 / 2 = 1,225. With money, 50 prices would do.' },
    { q: 'A banknote today has value because the central bank will exchange it for gold on demand.', a: false,
      why: 'Major currencies have been fiat money since the gold standard ended (finally in 1971). A note is valuable because people and the state accept it, and because the central bank works to keep its purchasing power stable.' },
    { q: 'In a modern economy, most of the money people hold is…', choices: ['notes and coins', 'bank deposits', 'gold held by the central bank', 'government bonds'], a: 1,
      why: 'Deposits — entries in banks\' books — are by far the largest part. In the UK in the mid-2010s cash was only about 3 % of the money held by households and firms.' },
    { q: 'You take home ¤18 an hour. How many hours of work does a ¤900 appliance cost?', answer: 50,
      why: 'Price divided by take-home pay per hour: 900 / 18 = 50 hours.' }
  ],
  applications: ['Reading prices, salaries and debts on one scale.', 'Understanding why cash, deposits and card payments are all "money".', 'Seeing why trust, central banks and stable prices matter to everyone.', 'Translating prices into hours of work before a large purchase.'],
  history: 'The phrase "double coincidence of wants" was made popular by the economist William Stanley Jevons in 1875, in a book explaining money to a general audience.'
},

{
  id: 'inflation-purchasing-power', parent: 'money-basics', title: 'Inflation and purchasing power', level: 1,
  short: 'Inflation is a general, lasting rise in prices. It works like compound interest in reverse on money you hold: at 3 % a year, a banknote kept for 30 years buys only about 41 % of what it bought when you put it away.',
  keywords: ['inflation', 'purchasing power', 'price level', 'cost of living', 'CPI', 'consumer price index', 'deflation', 'disinflation', 'hyperinflation', 'inflation target', 'erosion of money'],
  prereq: ['what-is-money', 'math:percentages', 'math:exponential-growth-decay'],
  related: ['real-vs-nominal', 'inflation-cpi', 'monetary-policy', 'hyperinflation', 'inflation-linked-bonds', 'rule-of-72'],
  body: `
Ask anyone over sixty what a loaf of bread or a cinema ticket cost when they were young and you will hear a number that sounds absurdly small. Their memory is right: prices really were lower. **Inflation** is the general, lasting rise in the prices of the things people buy, and its mirror image is the fall in what a given amount of money can buy — its **purchasing power**.

Put a ¤100 note in a drawer. If prices rise 3 % a year, after 30 years the same shopping costs ¤242.73, and the note buys only what ¤41.20 buys today. Nobody took anything from the drawer; the note simply measures less than it used to.

### Compounding in reverse
Inflation compounds like interest, so prices grow exponentially and purchasing power decays exponentially. With an inflation rate $\\pi$ a year (the Greek letter π is the usual symbol for inflation — nothing to do with circles),

$$P_t = P_0\\,(1+\\pi)^t, \\qquad V = \\frac{A}{(1+\\pi)^t}$$

where $V$ is what an amount $A$ held for $t$ years is worth in today's money.

| Inflation | after 10 years | 20 years | 30 years | 40 years | Half gone after |
|---|---:|---:|---:|---:|---:|
| 2 % | ¤82.03 | ¤67.30 | ¤55.21 | ¤45.29 | 35.0 years |
| 3 % | ¤74.41 | ¤55.37 | ¤41.20 | ¤30.66 | 23.4 years |
| 5 % | ¤61.39 | ¤37.69 | ¤23.14 | ¤14.20 | 14.2 years |
| 10 % | ¤38.55 | ¤14.86 | ¤5.73 | ¤2.21 | 7.3 years |

*What ¤100 held as cash buys, in today's money.* The last column is the [[rule-of-72]] at work.

### Measuring it
Statistical offices price a fixed **basket** of goods and services every month — food, rent, energy, transport, clothing, haircuts — and publish the change as a consumer price index ([[inflation-cpi]]). It is an average: your own inflation depends on what *you* buy. A renter, a driver and a retiree who spends mostly on health care each live with a different rate.

### How much is normal?
Many central banks aim for about 2 % a year (the US, the euro area, the UK, Japan), others for a band such as 1–3 % (Israel) or 2–3 % (Australia), and raise interest rates when inflation runs above the target ([[monetary-policy]]). History shows the range: in the US consumer prices rose about 13.5 % in 1980, in the UK roughly 24 % in 1975, and in 2022 inflation peaked at roughly 9–11 % a year in the US, the UK and the euro area. Beyond that lies [[hyperinflation]]: Germany in 1923, Hungary in 1946 — where prices at the peak doubled about every 15 hours — and Zimbabwe in 2007–2008.

> [!key] A price rise and a loss of purchasing power are not the same percentage. When prices rise 25 %, money loses 20 % of its purchasing power ($1 - 1/1.25$); when prices double, it loses half.

### Who wins and who loses
Unexpected inflation moves wealth from lenders to borrowers: a fixed-rate debt is repaid in money that buys less. It hurts people holding cash or on fixed incomes, and it helps those whose pay, rents or investments rise with prices. That is why long-term plans are best made in "today's money" ([[real-vs-nominal]]), and why [[inflation-linked-bonds]] and some pensions are adjusted to the price index.

> [!tip] Inflation is slow and steady enough to plan for. You cannot stop it, but you can see it coming: check any long-term goal by asking what it will cost in the year you need it, and whether your savings are growing faster than prices. Try your own numbers in [the inflation calculator](#/tools/money/inflation).
`,
  ideas: [
    'Inflation is a general, lasting rise in prices; purchasing power is what money can buy.',
    'Prices compound upwards and purchasing power decays: V = A / (1 + π)^t.',
    'At 3 % a year money loses half its purchasing power in about 23 years; at 2 %, in 35.',
    'A price rise of g reduces purchasing power by 1 − 1/(1 + g), which is smaller than g.',
    'Unexpected inflation helps borrowers with fixed rates and hurts savers holding cash.'
  ],
  pitfalls: [
    'When inflation falls, prices fall — Lower inflation means prices rise more slowly. Prices fall only with deflation, which is rare and usually a sign of a weak economy.',
    'If prices rise 50 %, my money has lost 50 % of its value — It has lost a third: ¤100 now buys what ¤66.67 bought before. Only a doubling of prices halves purchasing power.',
    'The official inflation rate is my inflation — The index is an average basket. Your own rate depends on what you spend on, and can be well above or below it.'
  ],
  formulas: [
    {
      name: 'Purchasing power of money kept for t years',
      expr: 'V = A/(1 + infl)^t', tex: 'V = \\frac{A}{(1+\\pi)^{t}}',
      vars: {
        V: { name: 'what it buys, in today\'s money', q: 'money', unit: '$' },
        A: { name: 'amount of money kept', q: 'money', unit: '$', value: 100 },
        infl: { name: 'inflation per year', q: 'ratio', unit: '%', value: 3, min: -20, max: 500, signed: true, tex: '\\pi' },
        t: { name: 'years kept', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'For cash that earns nothing. Solve for $\\pi$ to find the inflation that halves money in a given time, or for $t$ to see how long it takes.',
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'You keep {A} in cash for {t} while prices rise {infl} a year. What will it buy, in today\'s money?',
        t: 'Prices rise {infl} a year. After how long will {A} of cash buy only what {V} buys today?'
      }
    },
    {
      name: 'A price after years of inflation',
      expr: 'F = P*(1 + infl)^t', tex: 'F = P\\,(1+\\pi)^{t}',
      vars: {
        F: { name: 'price in t years', q: 'money', unit: '$' },
        P: { name: 'price today', q: 'money', unit: '$', value: 1000 },
        infl: { name: 'inflation per year', q: 'ratio', unit: '%', value: 4, min: -20, max: 500, signed: true, tex: '\\pi' },
        t: { name: 'years from now', q: 'years', unit: 'yr', value: 15 }
      },
      practice: { unknowns: ['F', 'infl'] },
      stories: {
        F: 'A rent of {P} a month rises with inflation of {infl} a year. What will it be in {t}?',
        infl: 'A monthly rent of {P} has become {F} over {t}. At what average yearly rate did it rise?'
      }
    },
    {
      name: 'Purchasing power lost when prices rise',
      expr: 'L = 1 - 1/(1 + g)', tex: 'L = 1 - \\frac{1}{1+g}',
      vars: {
        L: { name: 'share of purchasing power lost', q: 'ratio', unit: '%' },
        g: { name: 'total rise in prices', q: 'ratio', unit: '%', value: 25, min: 0, max: 100000 }
      },
      note: 'The loss is always smaller than the price rise: 25 % higher prices cost money 20 % of its purchasing power, 100 % higher prices cost it half.',
      stories: {
        L: 'Over a few years prices rise by {g} in total. What share of its purchasing power has money lost?',
        g: 'Money has lost {L} of its purchasing power. By how much have prices risen?'
      }
    }
  ],
  examples: [
    {
      title: 'A banknote in a drawer',
      q: 'You put away a ¤100 note for 30 years. Inflation averages 3 % a year. What will the note buy, in today\'s money, and what will today\'s ¤100 of shopping cost then?',
      steps: [
        'Growth factor of prices: $1.03^{30} = 2.4273$.',
        'The same shopping will cost $100 \\times 2.4273 = ¤242.73$.',
        'The note buys $100 / 2.4273 = ¤41.20$ of today\'s shopping: it has lost 59 % of its purchasing power.'
      ],
      a: 'It buys about ¤41.20 of today\'s goods; the same shopping will cost ¤242.73.'
    },
    {
      title: 'Planning for a rising rent',
      q: 'Your rent is ¤1,000 a month. If it rises with 4 % inflation a year, what will it be in 15 years?',
      steps: [
        '$1.04^{15} = 1.8009$.',
        '$F = 1{,}000 \\times 1.8009 = ¤1{,}800.94$ a month.',
        'In today\'s money it is still ¤1,000 — if your income rises with prices too, the rent takes the same share of it.'
      ],
      a: 'About ¤1,800.94 a month in 15 years.'
    },
    {
      title: 'Price rise against lost value',
      q: 'Prices rise by 25 % over three years. By what share has money\'s purchasing power fallen?',
      steps: [
        '¤100 bought one basket; now a basket costs ¤125.',
        '¤100 buys $100/125 = 0.8$ of a basket.',
        'Loss: $1 - 1/1.25 = 20\\,\\%$ — less than the 25 % price rise.'
      ],
      a: 'Purchasing power fell by 20 %.'
    }
  ],
  quiz: [
    { q: 'Over some years prices double. How much of its purchasing power has money lost?', choices: ['100 %', '50 %', '200 %', '25 %'], a: 1,
      why: 'If a basket costs twice as much, the same money buys half a basket: purchasing power falls by 1 − 1/2 = 50 %. It cannot fall by more than 100 %.' },
    { q: 'Inflation is 5 % a year. What will ¤1,000 of cash buy in 10 years, in today\'s money?', answer: 613.91, unit: '$',
      why: '1,000 / 1.05¹⁰ = 1,000 / 1.6289 = ¤613.91.' },
    { q: 'At 2 % inflation, money loses about half its purchasing power in 35 years.', a: true,
      why: '1.02³⁵ = 2.0, so after 35 years prices have doubled and money buys half as much. Even a "low" rate matters over a working life.' },
    { q: 'The inflation rate falls from 8 % to 3 %. What happens to prices?', choices: ['They fall by 5 %', 'They keep rising, but more slowly', 'They stay where they are', 'They fall back to where they were'], a: 1,
      why: 'Lower inflation (disinflation) is still inflation: prices keep rising, at 3 % instead of 8 %. Only deflation — a negative rate — makes prices fall.' },
    { q: 'Your pay rises 3 % in a year when prices rise 5 %. By about how much did your purchasing power change?', choices: ['+3 %', '−2 %', '−1.9 %', '+8 %'], a: 2,
      why: '1.03 / 1.05 = 0.981, a fall of 1.9 %. Subtracting the rates (3 − 5 = −2) is a close approximation; the exact figure divides.' }
  ],
  applications: ['Judging whether savings are keeping up with prices.', 'Planning a goal years ahead in the money of the year you will need it.', 'Understanding pay rises, pensions and rents that are linked to a price index.', 'Reading the news about central banks and inflation targets.'],
  sim: 'mi-inflation'
},

{
  id: 'real-vs-nominal', parent: 'money-basics', title: 'Real and nominal values', level: 2,
  short: 'Nominal amounts are the numbers on the statement; real amounts are what those numbers buy. A savings rate below inflation is a loss in real terms, however the balance looks, and long-range plans are clearest in today\'s money.',
  keywords: ['real', 'nominal', 'real interest rate', 'real return', 'Fisher equation', 'money illusion', 'today\'s money', 'constant prices', 'deflate', 'price index', 'after-tax return'],
  prereq: ['inflation-purchasing-power', 'compound-interest', 'math:percentages'],
  related: ['inflation-cpi', 'inflation-linked-bonds', 'index-linked-mortgages', 'present-value', 'why-invest', 'monetary-policy'],
  body: `
A savings account pays 4 % in a year when prices rise 6 %. The balance grows from ¤10,000 to ¤10,400 and the statement looks fine. But the shopping that cost ¤10,000 now costs ¤10,600, so the ¤10,400 buys what ¤9,811.32 bought a year ago. In **nominal** terms — the numbers — you gained 4 %. In **real** terms — what the numbers buy — you lost 1.9 %.

### The Fisher equation
Growth in money divided by growth in prices gives growth in purchasing power. With a nominal rate $i$ and inflation $\\pi$, the real rate $r$ satisfies

$$1 + r = \\frac{1+i}{1+\\pi} \\qquad\\Longrightarrow\\qquad r = \\frac{1+i}{1+\\pi} - 1 \\approx i - \\pi$$

The shortcut "nominal minus inflation" is good when both are small: 7 % and 3 % give 3.88 % exactly, against 4 % by subtraction. At high rates it misleads: 50 % interest with 40 % inflation is a real 7.14 %, not 10 %. The relation is named after the economist Irving Fisher, who described it in the early 20th century.

### Real values of past and future amounts
To compare amounts from different years, convert them to the money of one year with a price index:

$$A_1 = A_0\\,\\frac{I_1}{I_0}$$

If the index stood at 80 when a salary was ¤1,000 a month and stands at 120 today, that salary was worth ¤1,500 in today's money. Economists call this *deflating* a series, and figures given "at constant prices" have been treated this way.

For the future, divide by the growth of prices instead. ¤10,000 invested for 30 years at 7 % becomes ¤76,122.55 — a number that sounds wonderful but is written in the money of 30 years from now. At 3 % inflation it is ¤31,361.48 in today's money, exactly what compounding at the real rate of 3.88 % gives.

> [!key] Work in one kind of money all the way through: nominal amounts with nominal rates, or today's money with real rates. Mixing them is the most common mistake in long-term planning.

### Money illusion
People feel richer when numbers rise, even when prices have risen as much or more — economists call this **money illusion**. A house bought for ¤200,000 and sold 25 years later for ¤400,000 "doubled". But at 3 % inflation prices rose by a factor of 2.094, so as a store of value the house *lost* 4.5 % in real terms (it also provided a home, which is another matter — see [[rent-vs-buy]]). A salary that doubles over 20 years of 3 % inflation buys only 11 % more.

### Taxes bite the nominal gain
Tax is usually charged on nominal interest, so it takes a much larger share of the real return. Earn 6 % with 4 % inflation and pay 25 % tax on the interest: after tax you keep 4.5 %, and your real return is 0.48 % — the tax took three-quarters of the real gain, not a quarter.

### Negative real rates
For long stretches — much of the 1970s, and again roughly 2010–2021 in many advanced economies — interest on bank deposits was below inflation, so savers lost purchasing power while their balances grew. That is not a reason for alarm, but it is a reason to judge savings, pay and investments by what they buy. [[inflation-linked-bonds|Inflation-linked bonds]] and [[index-linked-mortgages|inflation-linked mortgages]] are written directly in real terms: their payments rise with the index.

The simulation below opens on the example at the top of this page — a deposit earning 4 % while prices rise 6 %: the statement grows every year, while the green line, the same money in today's purchasing power, slowly falls.
`,
  ideas: [
    'Nominal values are the numbers; real values are what the numbers buy.',
    'Real rate: 1 + r = (1 + i)/(1 + π), which is close to i − π when rates are small.',
    'Convert past amounts to today\'s money with a price index: A₁ = A₀ · I₁ / I₀.',
    'Plan in one kind of money: nominal amounts with nominal rates, or today\'s money with real rates.',
    'Tax on nominal interest takes a much larger share of the real return.'
  ],
  pitfalls: [
    'My balance grew, so I am better off — Only if it grew faster than prices. A 4 % rate with 6 % inflation leaves you 1.9 % poorer in what the money buys.',
    'Real rate = nominal − inflation, exactly — It is an approximation. The exact real rate divides: (1 + i)/(1 + π) − 1, and the difference matters when rates are high.',
    'A house that doubled in price was a great investment — Over 25 years of 3 % inflation, a doubling is a small real loss. Compare prices in today\'s money, and count costs and the value of living there.'
  ],
  formulas: [
    {
      name: 'Real rate of return (Fisher)',
      expr: 'r = (1 + i)/(1 + infl) - 1', tex: 'r = \\frac{1+i}{1+\\pi} - 1',
      vars: {
        r: { name: 'real rate (growth of purchasing power)', q: 'ratio', unit: '%', signed: true },
        i: { name: 'nominal rate (what the statement shows)', q: 'ratio', unit: '%', value: 4, min: -90, max: 1000, signed: true },
        infl: { name: 'inflation', q: 'ratio', unit: '%', value: 6, min: -50, max: 1000, signed: true, tex: '\\pi' }
      },
      note: 'Solve for $i$ to find the nominal rate you need for a target real return.',
      practice: { unknowns: ['r', 'i'] },
      stories: {
        r: 'A deposit pays {i} a year while inflation is {infl}. What is the real return?',
        i: 'You want a real return of {r} a year and expect inflation of {infl}. What nominal rate do you need?'
      }
    },
    {
      name: 'An old amount in today\'s money',
      expr: 'A1 = A0*I1/I0', tex: 'A_1 = A_0\\,\\frac{I_1}{I_0}',
      vars: {
        A1: { name: 'the amount in today\'s money', q: 'money', unit: '$' },
        A0: { name: 'the amount back then', q: 'money', unit: '$', value: 1000 },
        I1: { name: 'price index today', value: 120 },
        I0: { name: 'price index back then', value: 80 }
      },
      note: 'Any price index works, as long as both levels come from the same series.',
      practice: { unknowns: ['A1', 'A0'] },
      stories: {
        A1: 'A salary was {A0} a month when the price index stood at {I0}. The index is now {I1}. What is that salary in today\'s money?',
        A0: 'The price index has gone from {I0} to {I1}. What amount back then bought what {A1} buys today?'
      }
    },
    {
      name: 'Real return after tax on the interest',
      expr: 'r = (1 + i*(1 - x))/(1 + infl) - 1', tex: 'r = \\frac{1 + i\\,(1-x)}{1+\\pi} - 1',
      vars: {
        r: { name: 'real return after tax', q: 'ratio', unit: '%', signed: true },
        i: { name: 'nominal interest rate', q: 'ratio', unit: '%', value: 6, min: 0, max: 1000 },
        x: { name: 'tax rate on interest', q: 'ratio', unit: '%', value: 25, min: 0, max: 99 },
        infl: { name: 'inflation', q: 'ratio', unit: '%', value: 4, min: -50, max: 1000, signed: true, tex: '\\pi' }
      },
      note: 'Assumes the tax is charged on the whole nominal interest each year, as it is in most countries for deposits outside tax-advantaged accounts.',
      practice: { unknowns: ['r'] },
      stories: { r: 'Interest of {i} is taxed at {x}, and inflation is {infl}. What is the real return after tax?' }
    }
  ],
  examples: [
    {
      title: 'A savings account below inflation',
      q: 'A deposit of ¤10,000 earns 4 % in a year when inflation is 6 %. What is it worth in last year\'s money, and what is the real return?',
      steps: [
        'Nominal balance: $10{,}000 \\times 1.04 = ¤10{,}400$.',
        'In last year\'s money: $10{,}400 / 1.06 = ¤9{,}811.32$.',
        'Real return: $1.04/1.06 - 1 = -1.89\\,\\%$ (subtraction would say −2 %).'
      ],
      a: 'Worth ¤9,811.32 in last year\'s money: a real loss of 1.89 %.'
    },
    {
      title: 'Thirty years in today\'s money',
      q: '¤10,000 grows at 7 % a year for 30 years while inflation is 3 %. What is the result in nominal terms and in today\'s money?',
      steps: [
        'Nominal: $10{,}000 \\times 1.07^{30} = ¤76{,}122.55$.',
        'Prices grow by $1.03^{30} = 2.4273$, so in today\'s money: $76{,}122.55 / 2.4273 = ¤31{,}361.48$.',
        'The same by the real rate: $r = 1.07/1.03 - 1 = 3.883\\,\\%$ and $10{,}000 \\times 1.03883^{30} = ¤31{,}361.48$.'
      ],
      a: '¤76,122.55 in future money — ¤31,361.48 in today\'s money.'
    },
    {
      title: 'What tax does to a real return',
      q: 'Interest is 6 %, inflation 4 %, and interest is taxed at 25 %. Compare the real return before and after tax.',
      steps: [
        'Before tax: $1.06/1.04 - 1 = 1.92\\,\\%$.',
        'After tax the nominal return is $6\\,\\% \\times 0.75 = 4.5\\,\\%$, so the real return is $1.045/1.04 - 1 = 0.48\\,\\%$.',
        'The tax took 25 % of the nominal interest but three-quarters of the real gain.'
      ],
      a: 'A real 1.92 % before tax becomes 0.48 % after it.'
    }
  ],
  quiz: [
    { q: 'A deposit pays 3 % and inflation is 5 %. What is the real return, in per cent? (Answer with a sign.)', answer: -1.905, unit: '%',
      why: '1.03 / 1.05 − 1 = −0.01905, a real loss of about 1.9 % a year.' },
    { q: 'Your salary doubles over 20 years while prices rise 3 % a year. You can buy twice as much as before.', a: false,
      why: 'Prices grew by 1.03²⁰ = 1.806, so the doubled salary buys 2 / 1.806 = 1.107 times as much: about 11 % more, not 100 %.' },
    { q: 'Interest is 50 % a year and inflation 40 %. The real rate is…', choices: ['10 %', 'about 7.1 %', '90 %', '1.25 %'], a: 1,
      why: '1.50 / 1.40 − 1 = 0.0714. The subtraction shortcut (10 %) works only when rates are small.' },
    { q: 'A retirement plan assumes a 7 % return and shows the result in today\'s money. Which is consistent?', choices: ['Use 7 % and do not adjust anything', 'Use the real return, about 3.9 % if inflation is 3 %', 'Use 7 % plus 3 % inflation, 10 %', 'Divide the final balance by 7 %'], a: 1,
      why: 'Amounts in today\'s money go with real rates. Compounding at 7 % gives future money; dividing by the growth of prices afterwards gives the same answer as compounding at the real rate.' },
    { q: 'A price index went from 80 to 120. A salary back then of ¤2,000 a month is worth how much in today\'s money?', answer: 3000, unit: '$',
      why: '2,000 × 120 / 80 = ¤3,000.' }
  ],
  applications: ['Judging savings, pay rises and investments by what they buy.', 'Making long-range plans in today\'s money with real returns.', 'Comparing prices, salaries and house values across decades.', 'Understanding inflation-linked bonds, pensions and mortgages.'],
  history: 'Irving Fisher set out the link between nominal interest, real interest and expected inflation in the early 20th century, notably in "The Theory of Interest" (1930).',
  sim: { id: 'mi-inflation', params: { earn: 4, pi: 6 } }
},

{
  id: 'opportunity-cost', parent: 'money-basics', title: 'Opportunity cost', level: 1,
  short: 'The true cost of a choice is the best alternative you give up. For money, that alternative is usually what the same money could have earned — which is why every financial decision quietly compares itself with a rate of return.',
  keywords: ['opportunity cost', 'trade-off', 'alternative', 'forgone', 'sunk cost', 'cost of capital', 'implicit cost', 'explicit cost', 'choice', 'hurdle rate'],
  prereq: ['what-is-money', 'compound-interest'],
  related: ['time-value-of-money', 'present-value', 'npv', 'marginal-thinking', 'comparative-advantage', 'present-bias', 'debt-payoff'],
  body: `
Every choice closes a door. Spend a Saturday painting the house yourself and the cost is not only the paint; it is the Saturday — the rest, the family time, or the paid work you could have done. Economists call the best alternative you give up the **opportunity cost** of a choice. It never appears on a receipt, which is exactly why it is so easy to overlook.

### The price of money is what it could have done
For money, the alternative is usually to keep it and let it earn. A ¤4 coffee on each of 250 working days is ¤1,000 a year. Saved instead, as about ¤83 a month at 5 % a year, it would grow to ¤69,354.89 after 30 years — of which ¤30,000 is the coffee money and the rest is interest. That does not mean the coffee is a mistake. The pleasure, the break, the chat with a colleague may be worth far more to you. Opportunity cost is not a verdict; it is simply the honest price tag, so the choice is made with open eyes.

$$F = c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}$$

is what a monthly amount $c$ would have become in $T$ years at a yearly return $r$ — the same formula as a savings plan (see [[annuities]]). Try it with any habit you are curious about, in [the savings calculator](#/tools/money/save).

### Idle money
Money that sits in an account paying nothing has an opportunity cost too. ¤10,000 kept at 0.5 % when an equally safe deposit pays 3.5 % gives up ¤300 a year — and more once inflation is counted ([[real-vs-nominal]]). A cushion for emergencies needs to be instantly available, and that availability is worth paying for ([[emergency-fund]]); the point is to know the price.

### Explicit and implicit costs
Studying full-time for three years costs the fees (an **explicit** cost) and the salary you do not earn meanwhile (an **implicit** one). With fees of ¤30,000 and earnings of ¤25,000 a year given up, the economic cost is ¤105,000 — which the higher lifetime earnings of a degree may well repay, but the comparison should include both.

### Sunk costs are not opportunity costs
Money already spent and impossible to recover is **sunk**. It should not steer the next decision, even though it pulls at us: finishing a bad film because the ticket was paid, or holding a losing investment "until it gets back to what I paid". The only question that matters is which of the choices still open is best from here.

### The rate that every decision is measured against
In finance, the opportunity cost of money is the return you could earn elsewhere *at similar risk*. It is the discount rate used for [[present-value|present values]] and the hurdle for [[npv|net present value]]. It also frames everyday choices:

- **Paying off debt** at 7 % earns a certain 7 % on the money used, since the interest simply stops ([[debt-payoff]]). An investment has to beat that with its risk counted.
- **Paying cash or in instalments**: the cash spent could have earned something while the instalments ran.
- **Time**: an hour spent saving ¤5 is cheap if the hour was idle, expensive if it was your only rest.

> [!key] The cost of anything is what you give up to get it. Ask "compared with what?" before every decision about money — the answer is usually a rate of return, a use of time, or both.
`,
  ideas: [
    'The opportunity cost of a choice is the best alternative given up.',
    'For money, the alternative is usually the return the same money could have earned.',
    'Costs include implicit ones, such as income given up, not only money paid out.',
    'Sunk costs are gone whatever you do; they should not steer the next decision.',
    'In finance the opportunity cost of money is the discount rate for decisions of similar risk.'
  ],
  pitfalls: [
    'Opportunity cost means I should never spend — It is a price tag, not a verdict. Spending on what you value is the point of money; the idea is to see what each choice costs.',
    'I have already paid so much that I must continue — Money already spent is sunk. Compare only the options still open, from where you stand now.',
    'Money in a current account costs nothing — It gives up the interest a safe alternative would pay, and it loses purchasing power to inflation. Sometimes that price is worth paying for instant access.'
  ],
  formulas: [
    {
      name: 'What a regular expense would have become',
      expr: 'F = c*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'F = c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        F: { name: 'value it would have grown to', q: 'money', unit: '$' },
        c: { name: 'amount spent each month', q: 'money', unit: '$', value: 100 },
        r: { name: 'yearly return given up', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Monthly amounts invested at the end of each month and compounded monthly. It ignores inflation: at a real return, $F$ is in today\'s money.',
      practice: { unknowns: ['F', 'c'] },
      stories: {
        F: 'A habit costs {c} a month. Invested instead at {r} a year for {T}, what would it have grown to?',
        c: 'You would like {F} in {T}. At {r} a year, how much a month would that take?'
      }
    },
    {
      name: 'Interest given up by idle money, per year',
      expr: 'L = B*(r1 - r0)', tex: 'L = B\\,(r_1 - r_0)',
      vars: {
        L: { name: 'interest given up each year', q: 'money', unit: '$' },
        B: { name: 'balance', q: 'money', unit: '$', value: 10000 },
        r1: { name: 'rate of the safe alternative', q: 'ratio', unit: '%', value: 3.5, min: 0, max: 100 },
        r0: { name: 'rate it earns now', q: 'ratio', unit: '%', value: 0.5, min: 0, max: 100 }
      },
      note: 'Compare alternatives of the same risk and availability: a deposit that locks money for years is not the same as instant access.',
      stories: { L: 'You keep {B} in an account paying {r0}. An equally safe deposit pays {r1}. How much interest do you give up in a year?' }
    }
  ],
  examples: [
    {
      title: 'The price of a daily coffee',
      q: 'A ¤4 coffee on 250 working days a year is ¤1,000 a year, about ¤83.33 a month. What would that have grown to over 30 years at 5 % a year?',
      steps: [
        'Monthly rate $i = 0.05/12$, $n = 360$ months, $(1+i)^{360} = 4.4677$.',
        '$F = 83.33 \\times (4.4677 - 1)/0.0041667 = ¤69{,}354.89$.',
        'Paid in: $360 \\times 83.33 = ¤30{,}000$; the other ¤39,354.89 would have been growth.'
      ],
      a: 'About ¤69,355 — a real price tag, whether or not the coffee is worth it to you.'
    },
    {
      title: 'The economic cost of study',
      q: 'Three years of full-time study cost ¤10,000 a year in fees, and you give up a job paying ¤25,000 a year. What is the economic cost?',
      steps: [
        'Explicit cost: $3 \\times 10{,}000 = ¤30{,}000$.',
        'Implicit cost (earnings given up): $3 \\times 25{,}000 = ¤75{,}000$.',
        'Economic cost: ¤105,000, to be weighed against the extra earnings and the other benefits over a career.'
      ],
      a: '¤105,000, of which most is income given up.'
    }
  ],
  quiz: [
    { q: 'You paid ¤80 for a non-refundable concert ticket. On the night you feel ill and would rather stay home. What should the ¤80 count for in your decision?', choices: ['Everything: you must not waste it', 'Nothing: it is spent whichever you choose', 'Half of it', 'More, the more you paid'], a: 1,
      why: 'The ¤80 is a sunk cost — gone whether you go or not. The decision is only about which evening you would prefer now. (If you could resell the ticket, the resale price would be a real opportunity cost of going.)' },
    { q: 'You keep ¤10,000 for a year in an account paying 0.5 % when an equally safe deposit pays 3.5 %. What is the opportunity cost in interest?', answer: 300, unit: '$',
      why: '10,000 × (3.5 % − 0.5 %) = ¤300 a year.' },
    { q: 'The opportunity cost of a choice is…', choices: ['the money paid for it', 'the sum of all the alternatives', 'the best alternative given up', 'the cost of changing your mind'], a: 2,
      why: 'You can only take one alternative instead, so the cost is the value of the best one you gave up.' },
    { q: 'Using spare savings to repay a loan charging 6 % a year earns, in effect, a certain 6 % a year on that money.', a: true,
      why: 'Every amount repaid stops costing 6 % interest. It is a guaranteed saving — though it also gives up the flexibility of having the cash, which has its own value.' }
  ],
  applications: ['Seeing the real price of habits, subscriptions and large purchases.', 'Deciding what to do with idle money or spare savings.', 'Weighing study, a career change or a business against the income given up.', 'Choosing the discount rate for present values and NPV.'],
  sim: 'ref-compound'
}

);
