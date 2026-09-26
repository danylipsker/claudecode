/* HYPER-FINANCES · content/investing-basics.js — Investing Fundamentals: the basics.
 * Why invest, risk and return, asset classes, diversification, the time horizon,
 * investing regularly, and compound returns. Simulations: sims/investing.js. */
Hyper.add(

/* ================================================================ why invest */
{
  id: 'why-invest', parent: 'investing-basics', title: 'Why invest', level: 1,
  short: 'Money left in cash keeps its number but slowly loses what it can buy. Invested in businesses, loans and property, it can grow faster than prices — in exchange for accepting ups and downs along the way. Time is the most powerful ingredient.',
  keywords: ['why invest', 'investing', 'saving and investing', 'inflation', 'real return', 'purchasing power', 'buying power', 'compounding', 'start early', 'beginner', 'wealth', 'growth'],
  prereq: ['compound-interest', 'inflation-purchasing-power', 'real-vs-nominal'],
  related: ['risk-and-return', 'asset-classes', 'time-horizon', 'emergency-fund', 'saving-rate', 'wealth-strategies', 'money-anxiety', 'opportunity-cost'],
  body: `
Put ¤10,000 in a drawer and in twenty years the notes will still say ¤10,000. But if prices rise by 3 % a year — an ordinary rate of [[inflation-purchasing-power|inflation]] — they will buy only what ¤5,537 buys today. Money that sits still does not stay still: it shrinks, quietly, in what it can do for you.

### Saving keeps money; investing puts it to work
A savings account protects the *number*. Investing buys a share in things that produce more money: companies that earn profits ([[stocks-shares|shares]]), governments and firms that pay interest ([[bond-basics|bonds]]), buildings that earn rent ([[reits|property]]). The return is not magic and not a casino's winnings: it is your slice of real economic output — profits, interest and rent — paid to whoever provides the capital, waits, and bears the ups and downs.

What counts is the **real return**, the growth beyond inflation (see [[real-vs-nominal]]):

$$1 + r_{\\text{real}} = \\frac{1 + r}{1 + i}$$

A deposit paying 1 % while prices rise 3 % has a real return of −1.94 % a year: the balance grows, its buying power falls. An investment earning 7 % with the same inflation has a real return of 3.88 %.

### What the difference adds up to
¤10,000 left for 30 years, measured in today's money:

| Real return a year | After 30 years | Roughly like |
|---|---:|---|
| 0 % | ¤10,000 | cash that only just keeps up with prices |
| 2 % | ¤18,114 | high-quality bonds over the long run |
| 5 % | ¤43,219 | a diversified share portfolio over the long run |

For scale: over 1900–2020, shares worldwide returned roughly 5 % a year above inflation, government bonds roughly 2 % and short-term deposits under 1 % (approximate figures from long-run studies of many countries; US shares did better, at about 6.5 %). Those averages span a century of wars, crashes and inflations. They describe the past, not a promise for the next decade.

> [!key] Investing is how savings first keep pace with prices and then outgrow them. The price is accepting that values will fall, sometimes sharply, along the way.

### Time is the one ingredient you cannot buy later
Because returns [[compound-interest|compound]], money invested early does most of the work. Ann saves ¤200 a month from 25 to 35 and then stops for good; Ben saves ¤200 a month from 35 to 65. Both earn 7 % a year. Ann pays in ¤24,000 and retires with ¤280,968. Ben pays in ¤72,000 — three times as much — and retires with ¤243,994. Ann's head start of ten years is worth more than Ben's extra twenty years of saving. The simulation below lets you move their starting ages and the return.

### Before you invest
Investing is for money that can wait for years. In most countries a common order of priorities is: a cash [[emergency-fund|cushion]] for surprises; then clearing expensive debt — repaying a credit card that charges 20 % is a certain 20 % return, which no investment reliably offers; then investing for long-term goals, often first through tax-advantaged [[pensions|retirement accounts]] where they exist. You do not need much money to begin: many funds accept small monthly amounts, and the [savings calculator](#/tools/money/save) shows what a monthly sum grows to.

> [!tip] Fear of losing money is natural, and useful: it keeps you away from schemes that promise high returns with no risk, which is how most people actually lose their savings. The cure for the rest of the fear is understanding. The next pages explain the few rules that turn investing from a gamble into a process: [[risk-and-return|risk and return]], [[diversification]], the [[time-horizon|time horizon]] and [[investment-fees|costs]].
`,
  ideas: [
    'Cash keeps its number but loses buying power to inflation; investing aims for a positive real return.',
    'Investment returns are a share of real economic output — profits, interest and rent — paid for providing capital and bearing risk.',
    'The real return, $(1 + r)/(1 + i) - 1$, is the one that matters.',
    'Time multiplies everything: money invested early does most of the work.',
    'Invest money that can wait for years; a cash cushion and clearing expensive debt usually come first.'
  ],
  pitfalls: [
    'Money in the bank is risk-free — Its number is safe (up to the deposit-insurance limit), but its buying power is not: at 1 % interest and 3 % inflation it loses about 2 % of its value every year.',
    'Investing is only for the rich or for experts — A broad fund can be bought with a small monthly amount, and the rules that matter most (diversify, keep costs low, give it time) need no special knowledge.',
    'I will start when I earn more — Every year of delay removes a year of compounding from the end, the most valuable one; small amounts started early often beat larger amounts started late.'
  ],
  formulas: [
    {
      name: 'Real return',
      expr: 'rr = (1 + r)/(1 + i) - 1', tex: 'r_{\\text{real}} = \\frac{1 + r}{1 + i} - 1',
      vars: {
        rr: { name: 'real return a year', q: 'ratio', unit: '%', signed: true, tex: 'r_{\\text{real}}' },
        r: { name: 'return a year before inflation', q: 'ratio', unit: '%', value: 5, signed: true, min: -90, max: 100 },
        i: { name: 'inflation a year', q: 'ratio', unit: '%', value: 3, signed: true, min: -20, max: 100 }
      },
      note: 'The quick estimate $r - i$ is close when both are small. Solve for $r$ to see what return keeps your savings growing faster than prices.',
      practice: { unknowns: ['rr', 'r'] },
      stories: {
        rr: 'Your savings earn {r} a year while prices rise {i} a year. What is your real return?',
        r: 'You want your money to grow {rr} a year faster than prices, and inflation is {i}. What return do you need before inflation?'
      }
    },
    {
      name: 'What cash will buy later',
      expr: 'V = P/(1 + i)^t', tex: 'V = \\frac{P}{(1 + i)^{t}}',
      vars: {
        V: { name: 'what it buys, in today\'s money', q: 'money', unit: '$' },
        P: { name: 'amount kept in cash', q: 'money', unit: '$', value: 10000 },
        i: { name: 'inflation a year', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 100 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'Cash earning no interest. With interest, use the real return in place of $-i$: $V = P\\,(1 + r_{\\text{real}})^t$.',
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'You keep {P} in cash for {t} while prices rise {i} a year. What will it buy, in today\'s money?',
        t: 'Prices rise {i} a year. After how long does {P} in cash buy only what {V} buys today?'
      }
    },
    {
      name: 'Growth of an investment',
      expr: 'A = P*(1 + r)^t', tex: 'A = P\\,(1 + r)^{t}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return', q: 'ratio', unit: '%', value: 5, min: -90, max: 100 },
        t: { name: 'years invested', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'With a real return for $r$, the answer is in today\'s money. Real returns vary from year to year; $r$ here is the compound (average) rate — see [[compounding-returns]].',
      practice: { unknowns: ['A', 'r', 't'] },
      stories: {
        A: 'You invest {P} and it earns {r} a year for {t}. What is it worth at the end?',
        r: '{P} grew to {A} in {t}. What yearly return, compounded, does that mean?',
        t: 'How long does {P} take to grow to {A} at {r} a year?'
      }
    }
  ],
  examples: [
    {
      title: 'The drawer, the deposit and the fund',
      q: 'You have ¤10,000 for 20 years and prices rise 3 % a year. Compare its buying power, in today\'s money, if it stays in a drawer, in a deposit paying 1 %, or in an investment that averages 6 % a year.',
      steps: [
        'Prices grow by $1.03^{20} = 1.8061$ over the 20 years.',
        'Drawer: $10\\,000 / 1.8061 = ¤5{,}537$ of today\'s buying power.',
        'Deposit: $10\\,000 \\times 1.01^{20} = ¤12{,}202$, worth $12\\,202 / 1.8061 = ¤6{,}756$ today.',
        'Investment: $10\\,000 \\times 1.06^{20} = ¤32{,}071$, worth $32\\,071 / 1.8061 = ¤17{,}757$ today — if the 6 % average is achieved, which is not guaranteed.'
      ],
      a: 'About ¤5,537, ¤6,756 and ¤17,757 of today\'s buying power: only the investment grows in real terms.'
    },
    {
      title: 'Ann and Ben',
      q: 'Ann invests ¤200 a month from 25 to 35, then stops. Ben invests ¤200 a month from 35 to 65. Both earn 7 % a year (monthly rate 7 %/12). Who has more at 65?',
      steps: [
        'Monthly rate $i = 0.07/12 = 0.005833$.',
        'Ann at 35, after 120 payments: $200 \\times \\frac{1.005833^{120} - 1}{0.005833} = 200 \\times \\frac{2.00966 - 1}{0.005833} = ¤34{,}617$.',
        'That sum grows for 30 more years: $34\\,617 \\times 1.005833^{360} = 34\\,617 \\times 8.1165 = ¤280{,}968$.',
        'Ben, after 360 payments: $200 \\times \\frac{8.1165 - 1}{0.005833} = ¤243{,}994$.',
        'Ann paid in ¤24,000; Ben paid in ¤72,000.'
      ],
      a: 'Ann, with ¤280,968 against ¤243,994 — from a third of the money paid in.'
    }
  ],
  quiz: [
    { q: 'Your savings account pays 2 % a year and prices rise 3 % a year. Over the year, what happens to what your savings can buy?', choices: ['It grows by 2 %', 'It stays the same', 'It shrinks by about 1 %', 'It shrinks by 3 %'], a: 2,
      why: 'The real return is $1.02/1.03 - 1 \\approx -0.97\\,$%: the balance grows, but prices grow faster.' },
    { q: 'At a real return of 5 % a year, what does ¤10,000 grow to in 30 years, in today\'s money?', answer: 43219, unit: '$',
      why: '$10\\,000 \\times 1.05^{30} = ¤43{,}219$. At 0 % it would still be ¤10,000; at 2 % it would be ¤18,114.' },
    { q: 'A nominal return of 6 % with inflation of 2 %: what is the real return, in per cent?', answer: 3.92, unit: '%',
      why: '$1.06/1.02 - 1 = 0.0392$, a little less than the quick estimate $6 - 2 = 4$.' },
    { q: 'Money you will need for a house deposit in 18 months is well suited to a share fund.', a: false,
      why: 'Over 18 months shares can easily be down 20–30 %. Money needed soon belongs where its value cannot fall much; investing in shares suits money that can wait for years.' },
    { q: 'Why can repaying a credit card that charges 20 % be compared with an investment?', choices: ['It improves your credit score, which is a kind of return', 'Each ¤ repaid saves 20 % a year of interest — a certain return no investment reliably matches', 'Card interest is tax-deductible everywhere', 'It cannot be compared with investing'], a: 1,
      why: 'Money that stops a 20 % charge "earns" 20 % with certainty. Few investments come close even on average, and none with certainty.' }
  ],
  applications: [
    'Deciding what to do with savings beyond an emergency cushion.',
    'Understanding why pension schemes invest contributions rather than holding cash.',
    'Comparing a deposit, a bond fund and a share fund in real terms.',
    'Recognising promises of high returns with no risk as a warning sign.'
  ],
  sim: 'inv-early-late'
},

/* ================================================================ risk and return */
{
  id: 'risk-and-return', parent: 'investing-basics', title: 'Risk and return', level: 1,
  short: 'Higher expected returns come only with more risk: bigger and more frequent swings, and a real chance of loss over short periods. Risk is measured by volatility, and understanding it is the best protection against panic.',
  keywords: ['risk', 'return', 'risk premium', 'equity premium', 'volatility', 'standard deviation', 'risk-free rate', 'expected return', 'risk tolerance', 'risk capacity', 'loss', 'fat tails', 'risk-return trade-off'],
  prereq: ['why-invest', 'math:expected-value', 'math:standard-deviation'],
  related: ['volatility', 'expected-return', 'asset-classes', 'diversification', 'time-horizon', 'sharpe-ratio', 'drawdowns', 'loss-aversion', 'asset-allocation'],
  body: `
Imagine two offers. The first pays 3 % every year, guaranteed. The second pays 7 % a year *on average* — but some years it gains 30 %, some years it loses 25 %, and you cannot know which year is coming. If the second offered only 3 % on average, nobody would take it. So wherever investors are free to choose, riskier assets must be priced low enough to offer a higher expected return. That extra is the **risk premium**, and it is the reason investing pays at all:

$$\\mathbb{E}[R] = r_f + \\text{risk premium}$$

Here $r_f$ is the return on a safe asset — a short-term government bill or an insured deposit — and $\\mathbb{E}[R]$ is the [[math:expected-value|expected]] return. The premium is a reward expected *on average over long periods*. It is not paid every year, and not even every decade.

### What "risk" means
The word covers several different things, and it helps to name them:
- **Volatility** — how widely yearly returns swing around their average, measured by the [[math:standard-deviation|standard deviation]] (see [[volatility]]).
- **Drawdown** — how far a value falls from its peak before it recovers (see [[drawdowns]]).
- **Permanent loss** — money that never comes back: a company that fails, a fraud, or selling at the bottom.
- **Inflation risk** — "safe" money losing its buying power.
- **Shortfall** — not having the money when you need it.

Volatility is the one that can be measured, and a rule of thumb uses the [[math:normal-distribution|normal distribution]]: about two years in three land within one standard deviation of the average, and about 19 in 20 within two. For a share portfolio averaging 7 % with a volatility of 18 %, two years in three fall between −11 % and +25 %, and about one year in 40 is worse than −29 %. Real markets have *fatter tails* than the normal curve: falls of 40 % or more came in 1929–32, 1973–74, 2000–02 and 2008–09.

### What history shows
Approximate long-run figures for the US over 1926–2020, before inflation (which averaged about 3 % a year):

| Asset | Compound return a year | Volatility |
|---|---:|---:|
| Treasury bills (cash) | about 3.3 % | about 3 % |
| Long-term government bonds | about 5.5 % | about 10 % |
| Large-company shares | about 10 % | about 20 % |
| Small-company shares | about 12 % | about 31 % |

The pattern — more volatility, more return — appears in most countries' histories, though the size of the premium varied a great deal between countries and periods. US large-company shares lost money in roughly one calendar year in four; the worst year was about −43 % (1931), the best about +54 % (1933).

> [!key] There is no higher expected return without the swings. The useful question is not "how do I avoid risk?" but "how much of it can I hold through a bad year without selling?"

### Capacity and tolerance
Your **risk capacity** is how much loss your finances can absorb; it depends on when you need the money, how steady your income is and how big your cushion is. Your **risk tolerance** is how much your nerves can take. The damage usually happens when a portfolio is riskier than its owner can bear: a 35 % fall frightens them into selling, and a temporary loss becomes a permanent one ([[loss-aversion]] makes this very human). A mix you can hold through the worst year — the [[asset-allocation]] — is worth more than the last point of expected return.

> [!warn] Anyone offering high returns with little or no risk is describing something markets do not supply. It is the classic signature of [[scams-fraud|fraud]].
`,
  ideas: [
    'Riskier assets must offer a higher expected return or no one would hold them; the extra is the risk premium.',
    'Volatility, the standard deviation of yearly returns, is the usual measure of risk: about two years in three land within one standard deviation of the average.',
    'The premium is expected, not guaranteed: it is paid on average over long periods, not every year.',
    'Real markets have fatter tails than the normal curve; crashes of 40 % or more have happened several times.',
    'The most damaging risk is being frightened or forced into selling at the bottom.'
  ],
  pitfalls: [
    'Risk means the chance of losing everything — For a broad, diversified fund, risk mostly means temporary falls of 20–50 %; permanent losses come mainly from concentration, borrowing, fraud or selling at the bottom.',
    'Higher risk always brings a higher return — Only market-wide risk, which cannot be diversified away, is rewarded on average, and only over long periods; a concentrated bet carries extra risk with no extra expected return.',
    'Low volatility means safe — Cash barely moves in price, yet in years of high inflation it can lose a large part of its buying power; some products look smooth only because they are rarely valued.'
  ],
  formulas: [
    {
      name: 'Expected return: the safe rate plus a premium',
      expr: 'mu = rf + rp', tex: '\\mu = r_f + r_p',
      vars: {
        mu: { name: 'expected return a year', q: 'ratio', unit: '%', tex: '\\mu' },
        rf: { name: 'safe (risk-free) rate', q: 'ratio', unit: '%', value: 3 },
        rp: { name: 'risk premium', q: 'ratio', unit: '%', value: 4 }
      },
      note: 'The premium is what investors expect, on average, for bearing the risk. It is not observed in advance and is not paid every year.',
      practice: { unknowns: ['mu', 'rp'] },
      stories: {
        mu: 'Safe government bills pay {rf} a year and investors expect a premium of {rp} for holding shares. What return do they expect from shares?',
        rp: 'Shares are expected to return {mu} a year while safe bills pay {rf}. What is the risk premium?'
      }
    },
    {
      name: 'A bad year: the average minus z standard deviations',
      expr: 'L = mu - z*s', tex: 'R_{\\text{low}} = \\mu - z\\,\\sigma',
      vars: {
        L: { name: 'return in a bad year', q: 'ratio', unit: '%', signed: true, tex: 'R_{\\text{low}}' },
        mu: { name: 'average yearly return', q: 'ratio', unit: '%', value: 7, tex: '\\mu' },
        z: { name: 'standard deviations below the average', value: 2, min: 0, max: 5 },
        s: { name: 'volatility (standard deviation of yearly returns)', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' }
      },
      note: 'In a normal model about one year in six is worse than $z = 1$ and one year in 40 worse than $z = 2$. Real markets have fatter tails, so the worst real years are worse than this suggests.',
      practice: { unknowns: ['L', 's'] },
      stories: {
        L: 'A fund averages {mu} a year with a volatility of {s}. What return is {z} standard deviations below the average?',
        s: 'A fund averages {mu} a year, and a year {z} standard deviations below average would return {L}. What is its volatility?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a volatility figure',
      q: 'A share fund averages 7 % a year with a volatility of 18 %. What range of years should you expect?',
      steps: [
        'One standard deviation either side: $7 - 18 = -11\\,$% and $7 + 18 = 25\\,$%. About two years in three fall in this range.',
        'Two standard deviations: $7 - 36 = -29\\,$% and $7 + 36 = 43\\,$%. About 19 years in 20 fall inside.',
        'So roughly one year in six is worse than −11 %, and one year in 40 worse than −29 % — more often in real markets, whose tails are fatter.',
        'Over 30 years, expect several losing years and quite possibly one fall of a quarter or more.'
      ],
      a: 'Mostly between −11 % and +25 %; a year worse than −29 % about once in 40 years in a normal model — and more often in reality.'
    },
    {
      title: 'What the premium is worth',
      q: 'You invest ¤10,000 for 20 years. A safe asset pays 3 % a year; a share fund is expected to average 7 % compounded. Compare the outcomes.',
      steps: [
        'Safe: $10\\,000 \\times 1.03^{20} = ¤18{,}061$, known in advance.',
        'Shares, if the expected 7 % is achieved: $10\\,000 \\times 1.07^{20} = ¤38{,}697$.',
        'The difference, ¤20,636, is the reward for accepting that the actual result may land well above or below ¤38,697.'
      ],
      a: '¤18,061 for certain against an expected ¤38,697 that is not certain.'
    }
  ],
  quiz: [
    { q: 'Why have shares been expected to return more than government bonds?', choices: ['Companies are always more profitable than governments', 'Investors demand extra reward for bearing larger swings and the chance of loss', 'Brokers set share returns higher', 'Share returns are guaranteed over 20 years'], a: 1,
      why: 'If shares offered no more than safe bonds, nobody would accept their risk; their prices settle low enough to offer a premium on average.' },
    { q: 'A fund averages 8 % a year with a volatility of 20 %. In a normal model, roughly how often is a year worse than −12 %?', choices: ['about one year in two', 'about one year in six', 'about one year in forty', 'never'], a: 1,
      why: '−12 % is one standard deviation below the average ($8 - 20$). About 16 % of a normal distribution lies further below: roughly one year in six.' },
    { q: 'If you hold a riskier investment long enough, a higher return is guaranteed.', a: false,
      why: 'The premium is expected, not promised. There were long stretches — US shares over 2000–2009, Japanese shares after 1989 — when shares did worse than safe assets.' },
    { q: 'An investment averages 6 % a year with a volatility of 15 %. What return, in per cent, is two standard deviations below the average?', answer: -24, unit: '%',
      why: '$6 - 2 \\times 15 = -24$. In a normal model about one year in 40 is worse; real markets produce such years more often.' },
    { q: 'Someone offers 15 % a year, guaranteed, with no risk. What does the risk–return trade-off suggest?', choices: ['A rare bargain: take as much as you can', 'Either the risk is hidden or the offer is a fraud', 'It is normal for private investments', 'It is safe if a friend recommends it'], a: 1,
      why: 'Safe assets pay close to the risk-free rate. A high return with no risk would be snapped up by every bank in the world; when it is offered to you, the risk is hidden or the promise is false.' }
  ],
  applications: [
    'Reading the risk indicator and the past-return chart in a fund\'s key information document.',
    'Choosing between a deposit, a bond fund and a share fund for a given goal.',
    'Setting a mix of investments you can hold through a bad year.',
    'Spotting offers whose promised return is too good for their claimed risk.'
  ],
  sim: 'inv-risk-return'
},

/* ================================================================ asset classes */
{
  id: 'asset-classes', parent: 'investing-basics', title: 'Asset classes', level: 1,
  short: 'The main families of investments — cash, bonds, shares, property and a few others — each with its own source of return, its own risks and its own place in a portfolio.',
  keywords: ['asset class', 'asset classes', 'cash', 'bonds', 'fixed income', 'shares', 'stocks', 'equities', 'property', 'real estate', 'commodities', 'gold', 'crypto', 'alternatives', 'income', 'dividend yield'],
  prereq: ['why-invest', 'risk-and-return'],
  related: ['stocks-shares', 'bond-basics', 'money-market', 'reits', 'inflation-linked-bonds', 'diversification', 'asset-allocation', 'term-deposits', 'credit-risk'],
  body: `
Every investment, however it is packaged, is one of a few basic deals. You can **lend** your money — for a short time (cash) or a long one (bonds). You can **own** something that produces income — a slice of businesses (shares) or buildings and land (property). Or you can buy something that produces nothing and hope someone will pay more for it later (gold, commodities, collectibles, crypto-assets). These families are the **asset classes**. Knowing which deal you are making tells you where the return comes from and what can go wrong.

### Where the return comes from
Every return is **income** plus a **change in value**. Over long periods,

$$R \\approx y + g$$

For shares, $y$ is the dividend yield and $g$ the growth of companies' earnings and dividends; over a few years, changes in how much investors will pay for each ¤ of profit can swamp both. For a bond held to maturity, the return is close to its yield when bought. For property it is the rent after costs, plus the change in value. An asset with no income — gold, a painting, a crypto token — can only return what the next buyer will pay. That is why its long-run return is so hard to estimate, and why its price can swing on mood alone.

### The families side by side

| Asset class | What you own | Return from | Main risks | Rough long-run real return |
|---|---|---|---|---|
| Cash: deposits, [[money-market|money-market funds]], treasury bills | a short loan to a bank or state | interest | inflation; a bank failing beyond [[deposit-insurance|insurance]] | about 0–1 % a year |
| Government [[bond-basics|bonds]] | a long loan to a state | coupons | rising rates and inflation cut prices; weak states can default | about 1–2 % a year |
| Corporate bonds | a loan to a company | higher coupons | the company may not pay ([[credit-risk]]) | a little above government bonds |
| [[stocks-shares|Shares]] (equities) | part of many companies | dividends and growth | deep falls; single companies can fail | about 4–6 % a year |
| Property | buildings and land, directly or through [[reits|funds]] | rent and growth | hard to sell, often borrowed against, local slumps | between bonds and shares, varying widely |
| Gold and commodities | a physical good | price changes only | decades-long droughts, sharp swings | close to zero over very long periods |
| Crypto-assets | a digital token | price changes only | extreme swings, fraud, regulation | history too short to judge; falls of 75 % or more have happened several times |

The last column gives approximate ranges from long histories of many countries, roughly 1900–2020. Individual countries and decades differed widely, and none of it is a forecast.

### How each class meets inflation
Cash keeps up only if interest rates keep up. Ordinary bonds suffer most from *unexpected* inflation, because their payments are fixed — which is why [[inflation-linked-bonds]] exist. Shares and property own real things and have stayed ahead of inflation over long periods, but not reliably over a few years: in the high inflation of the 1970s, shares in many countries lost value after inflation for a decade.

> [!key] Most long-term portfolios combine a **growth engine** (shares) with a **stabiliser** (high-quality bonds and cash). The proportions — the [[asset-allocation]] — shape your results far more than the choice of any particular fund.

> [!warn] New "asset classes" appear regularly, usually with a story and a high fee: private deals, structured products, exotic tokens. Ask three questions of any of them: where does the return come from, how easily can I sell, and what does it cost?
`,
  ideas: [
    'Each asset class is a basic deal: lend (cash, bonds), own something productive (shares, property), or hold something that pays nothing.',
    'Return is income plus a change in value; assets without income depend entirely on the next buyer.',
    'Over long histories shares earned the most, bonds less and cash least — with risk in the same order.',
    'Each class meets inflation differently, so a mix covers more possible futures than any single class.'
  ],
  pitfalls: [
    'Property is safe because land always goes up — House and land prices have fallen by a quarter or more in several countries, and by half in some (the US and Ireland after 2007, Japan after 1990); a buyer who borrowed heavily can lose all of their stake.',
    'Bonds cannot lose money — Their prices fall when interest rates rise; in 2022 many long-term government bond funds lost a fifth or more of their value as rates jumped.',
    'Gold is a sure protection against inflation — It has roughly held its value over very long periods, but it also lost more than half its real value for two decades after 1980.'
  ],
  formulas: [
    {
      name: 'Return as income plus growth',
      expr: 'R = y + g', tex: 'R \\approx y + g',
      vars: {
        R: { name: 'long-run total return a year', q: 'ratio', unit: '%', signed: true },
        y: { name: 'income yield (dividends, coupons or rent)', q: 'ratio', unit: '%', value: 2.5 },
        g: { name: 'growth of the income or value a year', q: 'ratio', unit: '%', value: 4.5, signed: true }
      },
      note: 'A long-run approximation. Over a few years, changes in what investors will pay for each ¤ of income can dominate the result.',
      practice: { unknowns: ['R', 'g'] },
      stories: {
        R: 'A share fund has a dividend yield of {y}, and dividends are expected to grow {g} a year. Roughly what total return does that suggest?',
        g: 'A property fund yields {y} in rent after costs. What growth a year would give a total return of {R}?'
      }
    },
    {
      name: 'Yearly income from an investment',
      expr: 'I = V*y',
      vars: {
        I: { name: 'income a year', q: 'money', unit: '$' },
        V: { name: 'value invested', q: 'money', unit: '$', value: 100000 },
        y: { name: 'income yield', q: 'ratio', unit: '%', value: 3.5 }
      },
      practice: { unknowns: ['I', 'V'] },
      stories: {
        I: 'You hold {V} in a fund that yields {y}. How much income does it pay in a year?',
        V: 'You would like {I} a year of income from investments yielding {y}. How much would you need?'
      }
    }
  ],
  examples: [
    {
      title: 'What a share fund might return',
      q: 'A broad share fund has a dividend yield of 2 %, and company earnings and dividends are expected to grow about 5 % a year. Estimate its long-run return before and after 2.5 % inflation.',
      steps: [
        'Income plus growth: $R \\approx 2 + 5 = 7\\,$% a year before inflation.',
        'After inflation: $1.07/1.025 - 1 = 4.39\\,$% a year.',
        'This is an expectation for the long run. In any one year the price can move by far more than 7 %, up or down.'
      ],
      a: 'About 7 % a year before inflation, about 4.4 % after.'
    },
    {
      title: 'A bond when interest rates rise',
      q: 'You buy a 10-year government bond for ¤100 with a 4 % coupon. A year later, new 9-year bonds yield 5 %. What is your bond worth, and what happens if you keep it?',
      steps: [
        'Buyers can now get 5 %, so your 4 % bond must sell for less. Discounting its remaining 9 coupons of ¤4 and the ¤100 at 5 % gives a price of ¤92.89 (see [[bond-pricing]]).',
        'Over the year you received the ¤4 coupon, so your total return is $(92.89 + 4 - 100)/100 = -3.1\\,$%.',
        'If you hold to maturity, you still receive every coupon and the ¤100 as promised; the loss disappears as the bond approaches maturity — though the money has earned 4 % while new bonds pay 5 %.'
      ],
      a: 'About ¤92.89, a loss of 3.1 % for the year including the coupon; held to maturity it still pays 4 % a year.'
    }
  ],
  quiz: [
    { q: 'Which asset class has the smallest price swings but the greatest exposure to inflation over long periods?', choices: ['cash', 'shares', 'property', 'gold'], a: 0,
      why: 'Cash hardly moves in price, but its interest has often lagged inflation, so its buying power erodes.' },
    { q: 'Which of these produces no income of its own?', choices: ['a government bond', 'a share in a profitable company', 'gold', 'a rented flat'], a: 2,
      why: 'Gold pays no coupon, dividend or rent; its return depends entirely on what the next buyer will pay.' },
    { q: 'A share fund has a dividend yield of 3 %, and dividends are expected to grow 4 % a year. Roughly what long-run total return, in per cent, does that suggest?', answer: 7, unit: '%',
      why: 'Income plus growth: $3 + 4 = 7$ % a year, as a long-run approximation.' },
    { q: 'A government bond can lose value before it matures.', a: true,
      why: 'When market interest rates rise, existing bonds with lower coupons are worth less. The loss is recovered only by holding to maturity, if the issuer pays.' },
    { q: 'Over roughly 1900–2020, which asset class had the highest real return in most countries?', choices: ['cash', 'government bonds', 'shares', 'gold'], a: 2,
      why: 'Shares, at very roughly 4–6 % a year above inflation — with the largest swings. Bonds and cash earned less.' }
  ],
  applications: [
    'Reading what a fund actually holds before buying it.',
    'Understanding why a balanced fund mixes shares and bonds.',
    'Asking the right questions about unfamiliar or exotic investments.',
    'Thinking about which assets protect against inflation, and over what time scale.'
  ],
  sim: { id: 'inv-risk-return', params: { real: true } }
},

/* ================================================================ diversification */
{
  id: 'diversification', parent: 'investing-basics', title: 'Diversification', level: 2,
  short: 'Spreading money across many investments that do not all move together lowers risk without lowering the expected return — the one free lunch in finance. It removes the risk of any single company, but not the risk of the market as a whole.',
  keywords: ['diversification', 'diversify', 'correlation', 'portfolio', 'concentration', 'specific risk', 'idiosyncratic risk', 'unsystematic risk', 'systematic risk', 'market risk', 'eggs in one basket', 'home bias', 'free lunch'],
  prereq: ['risk-and-return', 'asset-classes', 'correlation', 'math:standard-deviation'],
  related: ['index-investing', 'mutual-funds-etfs', 'asset-allocation', 'efficient-frontier', 'capm-beta', 'volatility', 'compounding-returns'],
  body: `
Picture a street seller in a town where half the days are sunny and half are rainy. Sell only ice cream and your income swings wildly; sell only umbrellas and it swings the other way. Sell both and the income is steady — without earning less on average. That is **diversification**: combining things that do not move in lockstep, so that their ups and downs partly cancel. It is often called the only free lunch in finance, because it lowers risk without lowering the expected return.

### Two kinds of risk
A company's share price moves for two kinds of reason. Some news concerns the company alone: a failed product, a lawsuit, a brilliant invention, a fraud. Some concerns everyone: a recession, a jump in interest rates, a panic. The first kind — **specific** risk — is different for every company and largely cancels across many holdings. The second — **market** risk — hits them all together and cannot be diversified away. With $N$ shares of similar volatility $\\sigma$, held in equal amounts, and an average [[correlation]] $\\rho$ between them,

$$\\sigma_p = \\sigma\\sqrt{\\rho + \\frac{1 - \\rho}{N}}$$

As $N$ grows, the second term fades and the risk falls towards the floor $\\sigma\\sqrt{\\rho}$. With a single-share volatility of 35 % and a correlation of 0.25:

| Shares held | 1 | 2 | 5 | 10 | 30 | 100 | very many |
|---|---:|---:|---:|---:|---:|---:|---:|
| Volatility | 35 % | 27.7 % | 22.1 % | 20.0 % | 18.4 % | 17.8 % | 17.5 % |

Ten shares already remove most of the removable risk, and beyond thirty the gains are small. Because markets pay a premium only for the risk that cannot be diversified away (see [[capm-beta]]), specific risk is risk carried for nothing.

### The lottery inside a single share
Diversification protects returns as well as nerves. Share returns are lopsided: a few companies become enormous winners while many drift or fail. A well-known study of all US shares over 1926–2016 found that more than half of them returned less over their lifetimes than one-month treasury bills, and that about 4 % of companies accounted for all of the market's gain over bills. A small portfolio will probably miss most of the few big winners. In the simulation below, nine of twelve investors who each hold a single share end *below* the market as a whole.

### Beyond one market
Diversify across **asset classes** too. A 60/40 mix of shares (volatility 18 %) and bonds (6 %) with a correlation of 0.1 has a volatility of about 11.3 %, against 13.2 % if the two moved in perfect step. Diversify across **countries**: an investor who held only Japanese shares from the start of 1990 waited more than three decades for prices to regain their old peak. Diversify across **time**, by [[dollar-cost-averaging|investing regularly]]. And remember the asset that is hardest to diversify — your job. Holding a lot of your employer's shares ties your savings to the same fate as your income.

> [!warn] In a crash, correlations between shares rise towards one, so diversifying within the stock market helps least exactly when it is wanted most. Cash and high-quality government bonds have usually done more to cushion those falls.

> [!tip] Owning five funds that all hold the same large companies is not diversification. A single broad [[index-investing|index fund]] may hold thousands of companies across dozens of countries.
`,
  ideas: [
    'Combining assets that do not move together lowers risk without lowering the expected return.',
    'Specific risk cancels across many holdings; market risk remains, and it is the risk that is rewarded.',
    'Most of the benefit comes from the first 10–30 holdings; a broad fund gives it in one purchase.',
    'Diversify across companies, asset classes, countries and time — and remember that your job is an asset too.',
    'Correlations rise in crises, so high-quality bonds and cash cushion falls better than more shares.'
  ],
  pitfalls: [
    'More holdings always means more diversification — Only if they behave differently; twenty funds holding the same large companies add cost, not safety.',
    'A diversified portfolio is protected against crashes — Diversification removes the risk of single companies, not of the whole market; broad world share funds still fell by about half in 2008–09.',
    'A few carefully chosen shares are enough if you know the companies well — Knowing a company does not remove its specific risk, and lopsided returns mean a small portfolio is likely to miss the few big winners.'
  ],
  formulas: [
    {
      name: 'Volatility of N similar shares',
      expr: 'sp = s*sqrt(rho + (1 - rho)/N)', tex: '\\sigma_p = \\sigma\\sqrt{\\rho + \\frac{1 - \\rho}{N}}',
      vars: {
        sp: { name: 'volatility of the portfolio', q: 'ratio', unit: '%', tex: '\\sigma_p' },
        s: { name: 'volatility of one share', q: 'ratio', unit: '%', value: 35, tex: '\\sigma' },
        rho: { name: 'average correlation between the shares', value: 0.25, min: 0, max: 1 },
        N: { name: 'number of shares, held in equal amounts', int: true, value: 10 }
      },
      note: 'With very many shares the volatility approaches $\\sigma\\sqrt{\\rho}$, the market risk that cannot be diversified away. Solve for $N$ to see how many shares bring the risk down to a chosen level.',
      practice: { unknowns: ['sp', 'N'] },
      stories: {
        sp: 'Shares have a volatility of {s} each and an average correlation of {rho}. What is the volatility of a portfolio of {N} of them in equal amounts?',
        N: 'Shares have a volatility of {s} each and an average correlation of {rho}. How many, in equal amounts, bring the portfolio\'s volatility down to {sp}?'
      }
    },
    {
      name: 'Volatility of a two-asset mix',
      expr: 'sp = sqrt(w^2*s1^2 + (1 - w)^2*s2^2 + 2*w*(1 - w)*rho*s1*s2)',
      tex: '\\sigma_p = \\sqrt{w^2\\sigma_1^2 + (1 - w)^2\\sigma_2^2 + 2w(1 - w)\\,\\rho\\,\\sigma_1\\sigma_2}',
      vars: {
        sp: { name: 'volatility of the mix', q: 'ratio', unit: '%', tex: '\\sigma_p' },
        w: { name: 'share in the first asset', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        s1: { name: 'volatility of the first asset (e.g. shares)', q: 'ratio', unit: '%', value: 18, tex: '\\sigma_1' },
        s2: { name: 'volatility of the second asset (e.g. bonds)', q: 'ratio', unit: '%', value: 6, tex: '\\sigma_2' },
        rho: { name: 'correlation between them', value: 0.1, min: -1, max: 1, signed: true }
      },
      note: 'The lower the correlation, the lower the mix\'s volatility; with $\\rho = 1$ it is just the weighted average of the two. See [[efficient-frontier]].',
      practice: { unknowns: ['sp'] },
      stories: { sp: 'You hold {w} in shares with a volatility of {s1} and the rest in bonds with a volatility of {s2}; their correlation is {rho}. What is the volatility of the mix?' }
    }
  ],
  examples: [
    {
      title: 'From one share to thirty',
      q: 'Shares have a volatility of 35 % each and an average correlation of 0.25. How risky are portfolios of 1, 10 and 30 shares, and where is the floor?',
      steps: [
        'One share: 35 %.',
        'Ten shares: $35 \\times \\sqrt{0.25 + 0.75/10} = 35 \\times \\sqrt{0.325} = 20.0\\,$%.',
        'Thirty shares: $35 \\times \\sqrt{0.25 + 0.75/30} = 35 \\times \\sqrt{0.275} = 18.4\\,$%.',
        'The floor: $35 \\times \\sqrt{0.25} = 17.5\\,$%. Of the 17.5 points that can be removed, ten shares remove 15 — about 86 %.'
      ],
      a: '35 %, 20.0 % and 18.4 %, approaching a floor of 17.5 %.'
    },
    {
      title: 'Shares with bonds',
      q: 'A portfolio holds 60 % shares (expected return 7 %, volatility 18 %) and 40 % bonds (3 %, 6 %), with a correlation of 0.1. Find its expected return and volatility.',
      steps: [
        'Expected return, a weighted average: $0.6 \\times 7 + 0.4 \\times 3 = 5.4\\,$%.',
        'Variance: $0.6^2 \\times 0.18^2 + 0.4^2 \\times 0.06^2 + 2 \\times 0.6 \\times 0.4 \\times 0.1 \\times 0.18 \\times 0.06 = 0.011664 + 0.000576 + 0.000518 = 0.012758$.',
        'Volatility: $\\sqrt{0.012758} = 11.3\\,$%, below the weighted average of the volatilities, $0.6 \\times 18 + 0.4 \\times 6 = 13.2\\,$%.'
      ],
      a: 'About 5.4 % expected, with a volatility of 11.3 % — lower than either asset\'s weighted share of risk would suggest.'
    }
  ],
  quiz: [
    { q: 'Which risk can diversification not remove?', choices: ['a single company going bankrupt', 'a fire at one firm\'s factory', 'a fall of the whole market in a recession', 'a fraud at one company'], a: 2,
      why: 'Market-wide shocks hit all companies together. Everything else on the list is specific to one company and cancels across many holdings.' },
    { q: 'Shares have a volatility of 30 % each and an average correlation of 0.36. What volatility, in per cent, does a portfolio of very many of them approach?', answer: 18, unit: '%',
      why: 'The floor is $\\sigma\\sqrt{\\rho} = 30 \\times \\sqrt{0.36} = 30 \\times 0.6 = 18$ %.' },
    { q: 'Diversification lowers risk only by also lowering the expected return.', a: false,
      why: 'The expected return of a mix is the weighted average of its parts, while its risk is lower than the weighted average whenever the parts do not move in perfect step.' },
    { q: 'You hold five funds, each tracking the largest companies of the same country. How diversified are you?', choices: ['five times as diversified as with one fund', 'about as diversified as with one of them', 'fully diversified worldwide', 'not diversified at all'], a: 1,
      why: 'The funds hold nearly the same companies, so they move almost identically; you pay five sets of costs for the diversification of one.' },
    { q: 'In a market crash, correlations between shares tend to…', choices: ['fall towards zero', 'rise towards one', 'turn negative', 'stay the same'], a: 1,
      why: 'In a panic nearly everything is sold together, which is why diversifying within shares helps least in a crash.' }
  ],
  applications: [
    'Judging whether a portfolio of several funds is really diversified or just repeats itself.',
    'Seeing the risk in holding a large amount of one company\'s shares, including an employer\'s.',
    'Understanding why broad index funds hold hundreds or thousands of companies.',
    'Combining shares with bonds and cash to reduce the depth of falls.'
  ],
  sim: 'inv-diversify'
},

/* ================================================================ time horizon and liquidity */
{
  id: 'time-horizon', parent: 'investing-basics', title: 'Time horizon and liquidity', level: 2,
  short: 'When you will need the money decides how much risk it can carry. Over long periods good and bad years average out and the range of yearly returns narrows; money needed soon, or at short notice, belongs where its value cannot fall much.',
  keywords: ['time horizon', 'investment horizon', 'holding period', 'long term', 'short term', 'liquidity', 'when you need the money', 'buckets', 'glide path', 'target-date fund', 'annualized return', 'range of outcomes'],
  prereq: ['risk-and-return', 'asset-classes', 'math:standard-deviation', 'math:central-limit-theorem'],
  related: ['compounding-returns', 'sequence-risk', 'drawdowns', 'emergency-fund', 'financial-goals', 'asset-allocation', 'term-deposits', 'retirement-planning', 'bid-ask-liquidity'],
  body: `
A single year in the stock market is close to a toss of a biased coin: roughly three years in four have gone up, but any one of them can bring a fall of 20, 30 or 40 %. Stretch the view to twenty years and the picture changes. Good and bad years average out, and the range of *yearly* returns an investor ends up with becomes much narrower. That is why the most important question about any sum of money is not "what will earn the most?" but "**when will I need it?**"

### Why time narrows the range
If yearly returns vary with a standard deviation $\\sigma$, their average over $T$ years varies by only about

$$\\sigma_T = \\frac{\\sigma}{\\sqrt{T}}$$

— the same arithmetic that makes the average of many dice rolls more predictable than a single roll (the [[math:central-limit-theorem|central limit theorem]]). With $\\sigma$ = 18 %, the spread of the annualized return is 18 % over one year, 9 % over four, 6 % over nine and 3 % over thirty-six.

In the simulation below, 2,000 investors hold a market that averages 7 % a year with a volatility of 18 %:

| Years held | Middle 90 % of annualized returns | Chance of ending below the start |
|---|---|---:|
| 1 | −22.9 % to +36.2 % | 36 % |
| 5 | −7.7 % to +19.5 % | 25 % |
| 10 | −4.0 % to +14.7 % | 17 % |
| 20 | −1.1 % to +12.3 % | 8 % |
| 40 | +0.6 % to +10.2 % | 3 % |

History tells a similar story. For US large-company shares since 1926, calendar years ranged from about −43 % to +54 %, while every 20-year period ended ahead before inflation, the worst at roughly 3 % a year. But time lowers risk; it does not remove it. The ten years 1929–1938 and 1999–2008 both lost money in the US, and Japanese share prices took more than three decades to regain their 1989 peak.

> [!note] Two things narrow with time and one widens. The range of *yearly* returns narrows, and so does the chance of a loss. The range of *final amounts* in money widens, because small differences in the yearly rate compound into large differences in wealth.

### Liquidity: how quickly money becomes cash
**Liquidity** is how fast, and how cheaply, an investment turns into money you can spend. A bank deposit is instant. A listed fund takes a few days, at whatever the price is that day. A property takes months and several per cent in costs to sell. Some pensions, [[term-deposits|fixed-term deposits]] and private funds lock money up for years or charge to leave early. Money that might be needed at short notice — the [[emergency-fund]] — needs to be liquid *and* stable.

### Matching money to its date
A common way to organise this is with **buckets**:
- money for the next year or two: cash and deposits;
- money for three to seven years ahead: high-quality bonds or a cautious mix;
- money for ten years and more: mostly shares, able to ride out several bad years.

Many retirement and target-date funds follow a **glide path**, moving gradually from shares towards bonds and cash as the date approaches, so that a crash just before the money is needed cannot do too much damage (see [[sequence-risk]]).

> [!key] Your real horizon is how long you will stay invested *without selling in a panic*. A thirty-year plan abandoned after the first 30 % fall had a horizon of one bad year.
`,
  ideas: [
    'When you will need the money decides how much risk it can carry.',
    'The spread of the average yearly return shrinks like $1/\\sqrt{T}$, but the range of final amounts still widens.',
    'Longer horizons make a loss less likely — never impossible.',
    'Liquidity is how quickly and cheaply an investment becomes cash; emergency money needs liquidity and stability.',
    'Buckets and glide paths match each pot of money to the date it is needed.'
  ],
  pitfalls: [
    'In the long run shares always win — Usually, over long periods, but not always: long stretches of poor returns happened in the US, in Japan and in many other markets. Long horizons lower risk rather than remove it.',
    'A long horizon means the money can go into anything — The horizon must be real: money that might be needed early, or an owner who might sell in a panic, shortens it.',
    'Liquid means safe — A share fund can be sold within days, at whatever the price is that day; liquidity is about access, stability is about value.'
  ],
  formulas: [
    {
      name: 'Spread of the annualized return over T years',
      expr: 'sT = s/sqrt(T)', tex: '\\sigma_T = \\frac{\\sigma}{\\sqrt{T}}',
      vars: {
        sT: { name: 'spread of the annualized return', q: 'ratio', unit: '%', tex: '\\sigma_T' },
        s: { name: 'volatility of yearly returns', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' },
        T: { name: 'years held', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'Treats years as independent, a simplification: real markets have streaks and long flat periods, so real ranges are not quite so tidy.',
      practice: { unknowns: ['sT', 'T'] },
      stories: {
        sT: 'Yearly returns have a volatility of {s}. What is the spread of the average yearly return over {T}?',
        T: 'Yearly returns have a volatility of {s}. For how long must you hold for the spread of the annualized return to fall to {sT}?'
      }
    },
    {
      name: 'How long until a loss becomes unlikely',
      expr: 'T = (z*s/m)^2', tex: 'T = \\left(\\frac{z\\,\\sigma}{m}\\right)^2',
      vars: {
        T: { name: 'years held', q: 'years', unit: 'yr' },
        z: { name: 'safety margin, in standard deviations', value: 1, min: 0, max: 4 },
        s: { name: 'volatility of yearly returns', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' },
        m: { name: 'typical compound yearly return', q: 'ratio', unit: '%', value: 5.5 }
      },
      note: 'Solves $m = z\\,\\sigma/\\sqrt{T}$: after $T$ years, losing money needs a result $z$ standard deviations below typical. With $z = 1$ about one investor in six still loses; with $z = 2$ about one in forty. Compare with the simulation.',
      practice: { unknowns: ['T', 'z'] },
      stories: {
        T: 'A market compounds at a typical {m} a year with a volatility of {s}. After how many years does a loss need a result {z} standard deviations below typical?',
        z: 'A market compounds at a typical {m} a year with a volatility of {s}. After {T}, how many standard deviations below typical must a result be to lose money?'
      }
    }
  ],
  examples: [
    {
      title: 'How the range narrows',
      q: 'Yearly returns have a volatility of 18 %. Find the spread of the annualized return over 1, 4, 9 and 36 years.',
      steps: [
        '$\\sigma_T = 18/\\sqrt{T}$.',
        '$T = 1$: 18 %. $T = 4$: $18/2 = 9$ %. $T = 9$: $18/3 = 6$ %. $T = 36$: $18/6 = 3$ %.',
        'Quadrupling the horizon halves the spread of the yearly rate — yet the spread of the final amount keeps growing.'
      ],
      a: '18 %, 9 %, 6 % and 3 %.'
    },
    {
      title: 'A house deposit in three years',
      q: 'You need ¤30,000 for a house deposit in three years. Compare keeping it in a deposit at 3 % with putting it in a share fund.',
      steps: [
        'Deposit: $30\\,000 \\times 1.03^{3} = ¤32{,}782$, known in advance.',
        'Share fund: more on average, but in the simulated market (7 % average, 18 % volatility) about 30 % of three-year periods end below the start.',
        'A fall of 30 %, which has happened several times, would leave ¤21,000 on the day the money is needed — a ¤9,000 hole with no time left to recover.'
      ],
      a: 'The deposit gives ¤32,782 with certainty; the fund might give more, but carries a real chance of a painful shortfall at the worst moment.'
    }
  ],
  quiz: [
    { q: 'As the holding period gets longer, the range of annualized (yearly) returns…', choices: ['widens', 'narrows', 'stays the same', 'disappears completely'], a: 1,
      why: 'Good and bad years average out: the spread of the average yearly return falls roughly like $\\sigma/\\sqrt{T}$.' },
    { q: 'As the holding period gets longer, the range of possible final amounts, in money…', choices: ['narrows', 'widens', 'stays the same', 'shrinks to zero'], a: 1,
      why: 'Small differences in the yearly rate compound: 4 % against 8 % a year is a modest gap after one year and a huge one after forty.' },
    { q: 'Yearly returns have a volatility of 20 %. What is the spread of the average yearly return over 25 years, in per cent?', answer: 4, unit: '%',
      why: '$\\sigma_T = 20/\\sqrt{25} = 20/5 = 4$ %.' },
    { q: 'Shares held for 20 years cannot lose money.', a: false,
      why: 'Unlikely in most histories, but not impossible: Japanese shares bought at the 1989 peak were still well below it twenty years later.' },
    { q: 'Which of these is the least liquid?', choices: ['a savings account', 'a listed index fund', 'a rented flat', 'a money-market fund'], a: 2,
      why: 'Selling a property takes months and costs several per cent; the others can be turned into cash within days.' }
  ],
  applications: [
    'Deciding where to keep money for a goal a few years away, such as a home deposit.',
    'Understanding target-date and lifecycle funds, which change their mix as the date approaches.',
    'Sorting savings into buckets by the date each will be needed.',
    'Checking how easily, and at what cost, an investment can be sold before committing to it.'
  ],
  sim: 'inv-horizon'
},

/* ================================================================ investing regularly */
{
  id: 'dollar-cost-averaging', parent: 'investing-basics', title: 'Investing regularly (cost averaging)', level: 1,
  short: 'Investing a fixed amount at regular intervals buys more units when prices are low and fewer when they are high. It builds the habit and softens regret — though with a lump sum already in hand, investing it at once has usually come out ahead.',
  keywords: ['dollar-cost averaging', 'pound-cost averaging', 'cost averaging', 'regular investing', 'monthly investing', 'lump sum', 'timing the market', 'automatic investing', 'average cost', 'harmonic mean', 'standing order'],
  prereq: ['why-invest', 'risk-and-return', 'math:descriptive-statistics'],
  related: ['time-horizon', 'financial-habits', 'loss-aversion', 'present-bias', 'index-investing', 'compounding-returns', 'market-efficiency'],
  body: `
Most people do not invest a fortune on one day. They invest a slice of each salary — every month, often automatically. Doing this with a fixed amount has a name: **cost averaging** (dollar-cost averaging in the US, pound-cost averaging in the UK). It has a pleasant arithmetic property and real psychological value, and it is surrounded by one persistent myth.

### The arithmetic: more units when prices are low
A fixed amount buys more units when the price is low and fewer when it is high. Invest ¤300 a month in a fund whose price goes ¤10, ¤6, ¤10: you buy 30, then 50, then 30 units — 110 units for ¤900, an average cost of **¤8.18** a unit, while the average price was **¤8.67**. Your average cost is the *harmonic mean* of the prices, which is never above their ordinary [[math:descriptive-statistics|average]]:

$$\\bar{c} = \\frac{n}{\\frac{1}{p_1} + \\frac{1}{p_2} + \\dots + \\frac{1}{p_n}} \\le \\frac{p_1 + p_2 + \\dots + p_n}{n}$$

It does not guarantee a profit — if the price ends at ¤5, the 110 units are worth ¤550 — but it means that falling prices are not only bad news for a regular investor: they are also a sale.

### Investing from income
When money arrives every month, investing it every month is not really a strategy — it is simply investing as soon as you can. The alternative is to wait for a "better moment", and waiting has a poor record: nobody reliably knows when falls will come, the waiting money earns little, and some of the market's best days have come right after its worst, when waiting investors were most frightened. An automatic transfer on payday removes the decision altogether (see [[financial-habits]]).

### A lump sum: all at once, or spread?
An inheritance, a bonus or the sale of a house raises a real choice. Because markets have risen more often than they have fallen, money invested sooner has usually earned more: studies of US, UK and Australian markets over many decades found that investing a lump sum at once beat spreading it over twelve months roughly two times in three, for a balanced portfolio. In the simulation below (7 % average return, 16 % volatility, 2 % on the waiting cash, spread over 12 months), investing at once came out ahead in 59 % of 1,000 simulated markets, by an average of 2.5 % of the amount.

So why spread? Because of **regret**. If a 30 % fall in the month after investing everything would make you sell in despair, spreading the purchase over a few months — on a fixed schedule decided in advance — is a reasonable price for staying invested. It narrows the range of outcomes; it does not raise the average.

> [!key] Cost averaging manages *behaviour*; it is not a way to beat the market. Investing regularly from income is simply investing early. Spreading a lump sum trades a little expected return for less regret.

> [!tip] People who spread a lump sum successfully usually write the schedule down before they start (for example, equal parts on the first of each month for six months) and automate it, so that the news of the day cannot change the plan.
`,
  ideas: [
    'A fixed amount buys more units when prices are low, so the average cost is below the average price.',
    'Investing regularly from income is simply investing as early as the money arrives.',
    'With a lump sum, investing at once has usually come out ahead, because markets rise more often than they fall.',
    'Spreading a lump sum trades some expected return for less regret; decide and automate the schedule in advance.'
  ],
  pitfalls: [
    'Cost averaging beats investing a lump sum — On average it does not: money waiting in cash misses the market\'s usual rise. Its value is emotional — less regret — not extra return.',
    'I should wait for a dip before starting — Dips cannot be timed; waiting often means buying later at higher prices, while the waiting money earns little.',
    'A falling price means my plan is failing — For a regular investor, lower prices mean each month\'s money buys more units; what matters is the price when you eventually sell, perhaps decades later.'
  ],
  formulas: [
    {
      name: 'Average cost of a fixed amount at two prices',
      expr: 'c = 2/(1/p1 + 1/p2)', tex: '\\bar{c} = \\frac{2}{\\frac{1}{p_1} + \\frac{1}{p_2}}',
      vars: {
        c: { name: 'average cost per unit', q: 'money', unit: '$', tex: '\\bar{c}' },
        p1: { name: 'price at the first purchase', q: 'money', unit: '$', value: 10, tex: 'p_1' },
        p2: { name: 'price at the second purchase', q: 'money', unit: '$', value: 6, tex: 'p_2' }
      },
      note: 'The harmonic mean of the two prices: always at or below their ordinary average, $(p_1 + p_2)/2$.',
      practice: { unknowns: ['c'] },
      stories: { c: 'You invest the same amount twice, once at a price of {p1} and once at {p2}. What is your average cost per unit?' }
    },
    {
      name: 'Units bought',
      expr: 'n = A/p',
      vars: {
        n: { name: 'units bought' },
        A: { name: 'amount invested', q: 'money', unit: '$', value: 300 },
        p: { name: 'price per unit', q: 'money', unit: '$', value: 12 }
      },
      practice: { unknowns: ['n', 'p'] },
      stories: {
        n: 'You invest {A} at a price of {p} per unit. How many units do you buy?',
        p: 'Your {A} bought {n} units. What was the price per unit?'
      }
    },
    {
      name: 'What a monthly plan grows to',
      expr: 'V = c*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'V = c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        V: { name: 'value at the end', q: 'money', unit: '$' },
        c: { name: 'invested every month', q: 'money', unit: '$', value: 300 },
        r: { name: 'yearly return', q: 'ratio', unit: '%', value: 6, min: 0.01, max: 50 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'Payments at the end of each month, a steady return and no fees. For fees, inflation and a rising contribution, use the [savings calculator](#/tools/money/save).',
      practice: { unknowns: ['V', 'c', 'T'] },
      stories: {
        V: 'You invest {c} every month for {T} at {r} a year. What is it worth at the end?',
        c: 'You want {V} in {T}, earning {r} a year. How much must you invest every month?',
        T: 'Investing {c} a month at {r} a year, how long until you reach {V}?'
      }
    }
  ],
  examples: [
    {
      title: 'Three months of buying',
      q: 'You invest ¤300 a month. The fund\'s price is ¤10 in the first month, ¤6 in the second and ¤10 in the third. Find your average cost and compare it with the average price.',
      steps: [
        'Units: $300/10 = 30$, $300/6 = 50$, $300/10 = 30$; 110 units in all.',
        'Average cost: $900/110 = ¤8.18$ a unit.',
        'Average price: $(10 + 6 + 10)/3 = ¤8.67$.',
        'At the end the 110 units are worth $110 \\times 10 = ¤1{,}100$: a gain of ¤200, although the price only returned to where it started.'
      ],
      a: 'An average cost of ¤8.18 against an average price of ¤8.67; the dip turned into a gain of ¤200.'
    },
    {
      title: 'An inheritance of ¤12,000',
      q: 'You inherit ¤12,000 and plan to invest it in a share fund. Compare investing it at once with investing ¤1,000 a month for a year, using the simulation\'s market (7 % average, 16 % volatility, 2 % on waiting cash).',
      steps: [
        'Investing at once came out ahead in 59 % of the 1,000 simulated markets; on average, spreading ended ¤304 behind (2.5 % of the amount).',
        'In the markets that fell, spreading won — by as much as about 21 % of the amount; in markets that rose strongly, it lost by as much as about 38 %.',
        'The choice is between a better average (at once) and a narrower range with less regret (spread).'
      ],
      a: 'At once is better on average; spreading costs a little on average and protects against the regret of a crash straight after investing.'
    }
  ],
  quiz: [
    { q: 'Investing the same amount every month buys … units when prices are low.', choices: ['fewer', 'more', 'the same number of', 'no'], a: 1,
      why: 'Units bought = amount ÷ price: the lower the price, the more units the same amount buys.' },
    { q: 'You invest ¤100 at a price of ¤20 and another ¤100 at ¤5. What is your average cost per unit?', answer: 8, unit: '$',
      why: 'You buy $5 + 20 = 25$ units for ¤200: ¤8 each, below the average price of ¤12.50.' },
    { q: 'Cost averaging guarantees that you will not lose money.', a: false,
      why: 'It lowers the average cost below the average price, but if the price ends below your average cost, you still lose.' },
    { q: 'Why has investing a lump sum at once usually beaten spreading it out?', choices: ['Brokers charge less for large orders', 'Markets have risen more often than they fell, so money invested sooner spent more time earning', 'Spreading is taxed more heavily', 'Prices always fall after a large purchase'], a: 1,
      why: 'The money waiting to be invested earns only the cash rate, while the market has usually earned more.' },
    { q: 'What is the main reason some people spread a lump sum anyway?', choices: ['It has a higher expected return', 'It reduces regret and makes staying invested easier', 'It is required by law', 'It avoids all losses'], a: 1,
      why: 'Its value is behavioural: a crash straight after investing everything is painful, and pain leads to selling at the bottom.' }
  ],
  applications: [
    'Setting up an automatic monthly investment on payday.',
    'Deciding what to do with an inheritance, a bonus or the proceeds of a sale.',
    'Staying calm about falling prices while still buying regularly.',
    'Understanding why pension contributions are invested month by month.'
  ],
  sim: 'inv-regular'
},

/* ================================================================ compound returns and the CAGR */
{
  id: 'compounding-returns', parent: 'investing-basics', title: 'Compound returns and the CAGR', level: 2,
  short: 'Investment returns compound: each year\'s gain or loss applies to everything before it. The compound annual growth rate (CAGR) is the one steady rate that gives the same result — and when returns vary, it is always below their simple average.',
  keywords: ['CAGR', 'compound annual growth rate', 'annualized return', 'annualised return', 'geometric mean', 'arithmetic mean', 'average return', 'volatility drag', 'variance drain', 'recovery from losses', 'time-weighted return'],
  prereq: ['compound-interest', 'risk-and-return', 'math:exponential-growth-decay', 'math:logarithms'],
  related: ['rule-of-72', 'irr', 'drawdowns', 'volatility', 'leveraged-etfs', 'time-horizon', 'investment-fees', 'sequence-risk'],
  body: `
A fund gains 50 % one year and loses 50 % the next. Its average return is zero — $(+50 - 50)/2$ — so you might expect to be back where you started. You are not. ¤10,000 becomes ¤15,000 and then ¤7,500: a quarter is gone. Returns multiply; they do not add. The honest way to summarise a run of returns is the one steady rate that would have produced the same result: the **compound annual growth rate**, or CAGR.

### The CAGR
If a value grows from $P$ to $V$ in $t$ years,

$$g = \\left(\\frac{V}{P}\\right)^{1/t} - 1$$

¤10,000 that became ¤25,000 in 12 years grew by 7.93 % a year, compounded. For the fund above, $g = \\sqrt{1.5 \\times 0.5} - 1 = -13.4$ % a year. The CAGR is the [[math:exponential-growth-decay|exponential growth rate]] of the investment: the geometric mean of the yearly growth factors, less one. Solving for $t$ needs a [[math:logarithms|logarithm]], $t = \\ln(V/P)/\\ln(1 + g)$.

### Average or compound?
Take five years of returns: +20 %, −10 %, +15 %, −5 %, +12 %. Their simple (arithmetic) average is 6.4 %. But ¤10,000 goes to ¤12,000, ¤10,800, ¤12,420, ¤11,799 and finally ¤13,215 — a CAGR of 5.73 %. Whenever returns vary, the compound rate is below the arithmetic average, and the gap grows with the size of the swings. A good approximation is

$$g \\approx \\mu - \\frac{\\sigma^2}{2}$$

where $\\mu$ is the average yearly return and $\\sigma$ its volatility. With $\\mu$ = 7 %, a volatility of 10 % costs half a point (6.5 %), 18 % costs 1.6 points (5.4 %) and 30 % costs 4.5 points (2.5 %). This **volatility drag** is why lowering volatility through [[diversification]] raises long-run growth even when the average stays the same — and why [[leveraged-etfs|leveraged funds]] decay. In the simulation below, the median investor's compound rate sits below the dashed average of single years by just this amount.

### Losses need larger gains
A fall of $L$ needs a gain of $L/(1 - L)$ to recover:

| Fall | 10 % | 20 % | 30 % | 40 % | 50 % |
|---|---:|---:|---:|---:|---:|
| Gain needed | 11.1 % | 25 % | 42.9 % | 66.7 % | 100 % |

At 7 % a year, recovering from a halving takes 10.2 years (the [[rule-of-72|rule of 72]] says 10.3). This asymmetry is the arithmetic behind [[drawdowns]], and behind the special damage of losses early in retirement ([[sequence-risk]]).

### Reading return figures
Fund documents and advertisements report returns in different ways. Check whether a figure is an **average** or a **compound** (annualized) return, whether it is before or after fees and inflation, and which years it covers — a period that starts at a market low flatters any fund. A fund's CAGR is also not *your* return if you added or withdrew money along the way; for that you need the money-weighted return, the [[irr]]. Try your own numbers in [the returns calculator](#/tools/money/returns).

> [!key] Two figures of "7 %" can hide very different results. The number that tells you what happened to money is the compound annual growth rate.
`,
  ideas: [
    'Returns multiply, so the honest summary of a run of returns is the compound annual growth rate.',
    'The CAGR, $(V/P)^{1/t} - 1$, is the geometric-mean growth rate, less one.',
    'When returns vary, the CAGR is below the arithmetic average: $g \\approx \\mu - \\sigma^2/2$.',
    'A loss of $L$ needs a gain of $L/(1 - L)$ to recover: −50 % needs +100 %.',
    'Check whether a return figure is average or compound, before or after fees and inflation, and over which years.'
  ],
  pitfalls: [
    'The average return tells me what happened to my money — Only the compound rate does: +50 % then −50 % averages zero and loses a quarter.',
    'A 20 % loss is undone by a 20 % gain — $0.8 \\times 1.2 = 0.96$: you are still 4 % down. A 20 % fall needs a 25 % gain.',
    'A fund\'s published return is my return — Only if you invested at the start and never added or withdrew; with regular contributions, your own money-weighted return (IRR) can differ a lot.'
  ],
  formulas: [
    {
      name: 'Compound annual growth rate (CAGR)',
      expr: 'g = (V/P)^(1/t) - 1', tex: 'g = \\left(\\frac{V}{P}\\right)^{1/t} - 1',
      vars: {
        g: { name: 'compound annual growth rate', q: 'ratio', unit: '%', signed: true },
        V: { name: 'value at the end', q: 'money', unit: '$', value: 25000 },
        P: { name: 'value at the start', q: 'money', unit: '$', value: 10000 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 12 }
      },
      note: 'For a single sum with no money added or taken out. With contributions or withdrawals use the [[irr]] — or [the returns calculator](#/tools/money/returns).',
      practice: { unknowns: ['g', 'V', 't'] },
      stories: {
        g: 'An investment of {P} was worth {V} after {t}. What was its compound annual growth rate?',
        V: 'An investment of {P} grows at a compound {g} a year for {t}. What is it worth at the end?',
        t: 'How long does {P} take to become {V} at a compound {g} a year?'
      }
    },
    {
      name: 'Two years as one rate',
      expr: 'g = sqrt((1 + a)*(1 + b)) - 1', tex: 'g = \\sqrt{(1 + a)(1 + b)} - 1',
      vars: {
        g: { name: 'compound rate over the two years', q: 'ratio', unit: '%', signed: true },
        a: { name: 'return in the first year', q: 'ratio', unit: '%', value: 50, signed: true, min: -99, max: 1000 },
        b: { name: 'return in the second year', q: 'ratio', unit: '%', value: -50, signed: true, min: -99, max: 1000 }
      },
      note: 'The geometric mean of the growth factors $1 + a$ and $1 + b$, less one. Compare it with the arithmetic average $(a + b)/2$.',
      practice: { unknowns: ['g', 'b'] },
      stories: {
        g: 'A fund returns {a} one year and {b} the next. What steady yearly rate would have given the same result?',
        b: 'A fund returned {a} last year. What return this year would make its two-year compound rate {g}?'
      }
    },
    {
      name: 'Volatility drag',
      expr: 'g = mu - s^2/2', tex: 'g \\approx \\mu - \\frac{\\sigma^2}{2}',
      vars: {
        g: { name: 'typical compound growth rate', q: 'ratio', unit: '%', signed: true },
        mu: { name: 'average (arithmetic) yearly return', q: 'ratio', unit: '%', value: 7, tex: '\\mu' },
        s: { name: 'volatility of yearly returns', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' }
      },
      note: 'An approximation that is good for ordinary volatilities. It gives the median outcome\'s growth rate: half of investors do better, half worse.',
      practice: { unknowns: ['g', 's'] },
      stories: {
        g: 'Yearly returns average {mu} with a volatility of {s}. Roughly what compound growth rate does a typical investor get?',
        s: 'Yearly returns average {mu}, yet a typical investor compounds at only {g}. Roughly what volatility does that imply?'
      }
    },
    {
      name: 'Gain needed to recover a loss',
      expr: 'x = L/(1 - L)', tex: 'x = \\frac{L}{1 - L}',
      vars: {
        x: { name: 'gain needed to get back to the start', q: 'ratio', unit: '%' },
        L: { name: 'fall from the start', q: 'ratio', unit: '%', value: 30, min: 0, max: 99.9 }
      },
      practice: { unknowns: ['x', 'L'] },
      stories: {
        x: 'Your investment falls by {L}. What gain does it need to get back to where it started?',
        L: 'After a fall, your investment needs a gain of {x} to recover. How large was the fall?'
      }
    }
  ],
  examples: [
    {
      title: 'Up 50 %, down 50 %',
      q: '¤10,000 is invested in a fund that returns +50 % and then −50 %. What is it worth, and what are the arithmetic average and the CAGR?',
      steps: [
        'After year one: $10\\,000 \\times 1.5 = ¤15{,}000$. After year two: $15\\,000 \\times 0.5 = ¤7{,}500$.',
        'Arithmetic average: $(50 - 50)/2 = 0$ %.',
        'CAGR: $\\sqrt{7\\,500/10\\,000} - 1 = \\sqrt{0.75} - 1 = -13.4$ % a year.'
      ],
      a: '¤7,500: an average return of 0 % but a compound rate of −13.4 % a year.'
    },
    {
      title: 'Average against compound',
      q: 'A fund returns +20 %, −10 %, +15 %, −5 % and +12 % over five years. Compare the arithmetic average with the CAGR for ¤10,000 invested.',
      steps: [
        'Arithmetic average: $(20 - 10 + 15 - 5 + 12)/5 = 6.4$ %.',
        'Growth: $1.20 \\times 0.90 \\times 1.15 \\times 0.95 \\times 1.12 = 1.32149$, so ¤10,000 becomes ¤13,215.',
        'CAGR: $1.32149^{1/5} - 1 = 5.73$ %.',
        'At a steady 6.4 % the money would have become ¤13,636 — the difference is the volatility drag.'
      ],
      a: 'An average of 6.4 % but a compound rate of 5.73 %; ¤10,000 became ¤13,215.'
    },
    {
      title: 'How long to recover from a halving',
      q: 'A portfolio halves in a crash. How long does it take to recover at 7 % a year?',
      steps: [
        'A fall of 50 % needs a gain of $0.5/(1 - 0.5) = 100$ %: the value must double.',
        'Doubling at 7 %: $t = \\ln 2/\\ln 1.07 = 0.6931/0.06766 = 10.24$ years.',
        'The rule of 72 gives $72/7 = 10.3$ years — close enough to plan with.'
      ],
      a: 'About 10.2 years.'
    }
  ],
  quiz: [
    { q: '¤20,000 grew to ¤40,000 in 10 years. What was the compound annual growth rate, in per cent?', answer: 7.18, unit: '%',
      why: '$(40\\,000/20\\,000)^{1/10} - 1 = 2^{0.1} - 1 = 7.18$ %.' },
    { q: 'A fund\'s yearly returns averaged 9 %. Its compound annual growth rate over the same years was…', choices: ['higher than 9 %', 'exactly 9 %', '9 % or lower — lower whenever returns varied', 'impossible to compare'], a: 2,
      why: 'The geometric mean is never above the arithmetic mean; they are equal only if every year returned the same.' },
    { q: 'After a fall of 40 %, what gain, in per cent, is needed to get back to the start?', answer: 66.7, unit: '%',
      why: '$0.4/(1 - 0.4) = 0.667$: what is left must grow by two-thirds.' },
    { q: 'Two funds with the same average yearly return always end with the same amount.', a: false,
      why: 'The more volatile one compounds more slowly, roughly by $\\sigma^2/2$ a year, so it usually ends with less.' },
    { q: 'Why does lowering volatility raise long-run growth, for the same average return?', choices: ['because fees fall', 'because the volatility drag, about $\\sigma^2/2$, gets smaller', 'because taxes fall', 'it does not'], a: 1,
      why: 'The compound rate is roughly the average minus half the variance; less variance means less is lost to the up-and-down arithmetic.' }
  ],
  applications: [
    'Comparing funds\' performance figures on the same, compound basis.',
    'Seeing through advertisements that quote average returns.',
    'Estimating how long a portfolio needs to recover from a fall.',
    'Understanding why leveraged and very volatile products lose ground over time.'
  ],
  sim: [{ id: 'inv-horizon', params: { T: 30 } }, 'ref-compound']
}

);
