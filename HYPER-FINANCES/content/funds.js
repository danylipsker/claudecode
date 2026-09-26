/* HYPER-FINANCES · content/funds.js — Investing Fundamentals: funds and costs.
 * Mutual funds and ETFs, index investing, fees, active against passive, rebalancing.
 * Simulations: sims/investing.js. */
Hyper.add(

/* ================================================================ mutual funds and ETFs */
{
  id: 'mutual-funds-etfs', parent: 'funds', title: 'Mutual funds and ETFs', level: 1,
  short: 'A fund pools many people\'s money into one portfolio that none of them could build alone. Mutual funds are bought from the fund at the day\'s net asset value; ETFs trade on a stock exchange like shares. Both make diversification affordable — at a cost worth checking.',
  keywords: ['mutual fund', 'ETF', 'exchange-traded fund', 'unit trust', 'OEIC', 'UCITS', 'investment trust', 'closed-end fund', 'NAV', 'net asset value', 'custodian', 'expense ratio', 'ongoing charge', 'accumulating', 'distributing', 'target-date fund', 'balanced fund'],
  prereq: ['diversification', 'stocks-shares', 'bond-basics'],
  related: ['index-investing', 'investment-fees', 'active-vs-passive', 'brokers', 'bid-ask-liquidity', 'money-market', 'reits', 'taxes-investing', 'leveraged-etfs'],
  body: `
A thousand savers with ¤5,000 each cannot each buy shares in five hundred companies — the dealing costs alone would eat their savings. Together, with ¤5 million, they can. A **fund** is exactly that pool: many people's money, invested as one portfolio by a professional manager, with each saver owning a slice of the whole. For most people, funds are how [[diversification]] becomes affordable.

### How you own a fund
You own **units** (or fund shares), and each is worth the fund's **net asset value** (NAV) per unit:

$$\\text{NAV} = \\frac{\\text{assets} - \\text{liabilities}}{\\text{units in issue}}$$

A fund holding ¤500 million of investments, owing ¤2 million in fees and other liabilities, with 20 million units in issue, has a NAV of ¤24.90 a unit. If its investments rise 1 %, so — almost exactly — does the NAV.

In regulated markets the fund's assets are held by an independent **custodian**, separate from the management company's own money. If the manager goes out of business, the investments still belong to the fund's investors. That is a different protection from a bank's [[deposit-insurance]]: nobody guarantees the *value* of a fund, which rises and falls with what it holds.

### Two ways to buy and sell
**Open-ended funds** — called mutual funds in the US, unit trusts or OEICs in the UK, and UCITS funds across the European Union — deal directly with investors, usually once a day. You place an order and it is filled at the NAV calculated after the market closes ("forward pricing"). The fund creates new units when money comes in and cancels them when it goes out.

**Exchange-traded funds** (ETFs) are funds whose units trade on a stock exchange like shares, all day, at market prices, through a [[brokers|broker]]. The price stays close to the NAV because large dealers can create or redeem units whenever the two drift apart, pocketing the difference. You pay the fund's yearly charge and also, when you trade, the broker's commission and the [[bid-ask-liquidity|bid–ask spread]].

A third kind, **closed-end funds** (investment trusts in the UK), have a fixed number of shares that trade on an exchange; their price can sit at a premium or a discount to the value of the assets inside.

### What is inside
Funds come in every flavour: share funds (a country, a region, the whole world, a sector), bond funds, **balanced** or multi-asset funds that mix the two, [[money-market]] funds, property funds ([[reits]]), and **target-date** funds that move from shares to bonds as a chosen year approaches. They are either **index funds**, which copy a market index ([[index-investing]]), or **active** funds, whose managers choose investments to try to beat one ([[active-vs-passive]]). Income can be paid out (*distributing*) or reinvested (*accumulating*) — a choice that is taxed differently from country to country ([[taxes-investing]]).

### What it costs
Every fund charges a yearly fee — the **ongoing charge** or **expense ratio** — taken from its assets a little each day, so you never see a bill. On ¤50,000, a fund charging 0.2 % a year costs ¤100; one charging 1.5 % costs ¤750 — every year, whatever the markets do. Add any entry or exit charges, platform fees and trading costs. Together they are one of the few things about a fund you can know in advance ([[investment-fees]]).

> [!tip] Before buying any fund, find five things in its key information document: what it holds (and which index, if any), its total yearly cost, its size and age, where it is domiciled and regulated, and how easily you can sell.

> [!warn] Some exchange-traded products are built for traders, not savers: leveraged and inverse funds reset every day and drift away from their target over longer periods ([[leveraged-etfs]]). A familiar wrapper does not make the contents simple.
`,
  ideas: [
    'A fund pools many savers\' money into one diversified portfolio; each owns units worth the net asset value.',
    'NAV per unit = (assets − liabilities) ÷ units in issue.',
    'Open-ended funds deal once a day at the NAV; ETFs trade all day on an exchange at a price kept close to the NAV.',
    'A custodian keeps the fund\'s assets separate from the manager\'s, but no one guarantees their value.',
    'The yearly charge is taken from the fund continuously; it is one of the few things known in advance.'
  ],
  pitfalls: [
    'A fund with a low unit price is cheaper — The unit price says nothing about value or cost: a unit at ¤10 and one at ¤1,000 behave the same if they hold the same investments; what matters is what the fund holds and what it charges.',
    'An ETF is always a cheap, broad index fund — Many ETFs are active, narrow, leveraged or expensive; read what it holds and what it costs.',
    'Funds are guaranteed like bank deposits — A fund\'s assets are protected from the manager\'s failure, but their value moves with markets and no one guarantees it.'
  ],
  formulas: [
    {
      name: 'Net asset value per unit',
      expr: 'N = (A - L)/S', tex: '\\text{NAV} = \\frac{A - L}{S}',
      vars: {
        N: { name: 'net asset value per unit', q: 'money', unit: '$', tex: '\\text{NAV}' },
        A: { name: 'value of the fund\'s assets', q: 'money', unit: '$M', value: 500 },
        L: { name: 'the fund\'s liabilities (fees owed, other debts)', q: 'money', unit: '$M', value: 2 },
        S: { name: 'units in issue', int: true, value: 20000000 }
      },
      practice: { unknowns: ['N', 'S'] },
      stories: {
        N: 'A fund holds investments worth {A} and owes {L}, with {S} units in issue. What is its net asset value per unit?',
        S: 'A fund holds {A} of investments, owes {L} and has a NAV of {N} a unit. How many units are in issue?'
      }
    },
    {
      name: 'Yearly cost of a fund',
      expr: 'C = V*f',
      vars: {
        C: { name: 'cost a year', q: 'money', unit: '$' },
        V: { name: 'amount held in the fund', q: 'money', unit: '$', value: 50000 },
        f: { name: 'ongoing charge (expense ratio)', q: 'ratio', unit: '%', value: 0.2 }
      },
      note: 'Taken from the fund\'s value a little each day, so the returns you see are already after it. Over many years the cost compounds: see [[investment-fees]].',
      practice: { unknowns: ['C'] },
      stories: { C: 'You hold {V} in a fund with an ongoing charge of {f}. How much does it cost you this year?' }
    },
    {
      name: 'Cost of buying and later selling an ETF',
      expr: 'C = V*s + 2*k', tex: 'C = V s + 2k',
      vars: {
        C: { name: 'trading cost of the round trip', q: 'money', unit: '$' },
        V: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        s: { name: 'bid–ask spread, as a share of the price', q: 'ratio', unit: '%', value: 0.1 },
        k: { name: 'broker\'s commission per trade', q: 'money', unit: '$', value: 5 }
      },
      note: 'Buying at the ask and selling at the bid costs the spread once over the round trip; each trade adds a commission. Separate from the fund\'s yearly charge.',
      practice: { unknowns: ['C'] },
      stories: { C: 'You buy {V} of an ETF whose spread is {s} and later sell it; each trade costs {k} in commission. What does the round trip cost?' }
    }
  ],
  examples: [
    {
      title: 'Working out a NAV',
      q: 'A fund holds ¤500 million of investments and owes ¤2 million; 20 million units are in issue. What is the NAV, and how many units does ¤5,000 buy?',
      steps: [
        'Net assets: $500 - 2 = ¤498$ million.',
        'NAV: $498\\,000\\,000 / 20\\,000\\,000 = ¤24.90$ a unit.',
        'Units for ¤5,000: $5\\,000 / 24.90 = 200.80$ units (funds usually issue fractions of units).'
      ],
      a: '¤24.90 a unit; ¤5,000 buys about 200.8 units.'
    },
    {
      title: 'What owning a fund costs',
      q: 'You hold ¤50,000 in a fund. Compare a yearly charge of 0.2 % with 1.5 %, and find the cost of buying and selling ¤10,000 of an ETF with a 0.1 % spread and ¤5 commission per trade.',
      steps: [
        'At 0.2 %: $50\\,000 \\times 0.002 = ¤100$ a year.',
        'At 1.5 %: $50\\,000 \\times 0.015 = ¤750$ a year — ¤650 more, every year, whatever the market does.',
        'ETF round trip: $10\\,000 \\times 0.001 + 2 \\times 5 = ¤20$, once.'
      ],
      a: '¤100 against ¤750 a year; the ETF\'s trading costs are ¤20 for the round trip.'
    }
  ],
  quiz: [
    { q: 'You order units of an ordinary (open-ended) mutual fund at 11:00. At what price is your order usually filled?', choices: ['the price at 11:00', 'the NAV calculated after the market closes that day', 'the previous day\'s NAV', 'whatever price you name'], a: 1,
      why: 'Open-ended funds usually use forward pricing: orders are filled at the next NAV to be calculated, so no one can trade on stale prices.' },
    { q: 'Why does an ETF\'s market price stay close to the value of its holdings?', choices: ['The exchange fixes it', 'Large dealers can create or redeem units whenever the price drifts from the NAV, and profit from closing the gap', 'The fund manager buys its own units every day', 'It does not; ETFs usually trade far from their NAV'], a: 1,
      why: 'If the price rises above the NAV, dealers create new units and sell them; if it falls below, they buy units and redeem them. That arbitrage keeps the gap small for most liquid ETFs.' },
    { q: 'A fund holds ¤120 million of assets, has no liabilities and 8 million units in issue. What is its NAV per unit?', answer: 15, unit: '$',
      why: '$120\\,000\\,000 / 8\\,000\\,000 = ¤15$.' },
    { q: 'Money in a share fund is protected by deposit insurance, like a bank account.', a: false,
      why: 'Deposit insurance covers bank deposits. A fund\'s value moves with its investments and is not guaranteed, although its assets are kept separate from the manager\'s.' },
    { q: 'If the company that manages your fund goes out of business, what happens to the fund\'s investments?', choices: ['They are lost with the company', 'They are held by a separate custodian and still belong to the fund\'s investors', 'They are paid out to the company\'s creditors first', 'The government buys them'], a: 1,
      why: 'In regulated funds the assets are held by a custodian, apart from the manager\'s own money, precisely so that they survive the manager\'s failure.' }
  ],
  applications: [
    'Reading a fund\'s key information document before investing.',
    'Choosing between an open-ended fund and an ETF that track the same index.',
    'Understanding what a pension or savings plan actually holds.',
    'Working out what a fund costs each year in money, not just in per cent.'
  ],
  history: 'Pooled investment trusts appeared in the Netherlands and Britain in the eighteenth and nineteenth centuries; the modern open-ended mutual fund dates from 1920s Boston. The first exchange-traded fund was launched in Canada in 1990, and the idea spread worldwide from the US market in the following decades.',
  sim: 'inv-fees'
},

/* ================================================================ index investing */
{
  id: 'index-investing', parent: 'funds', title: 'Index funds and passive investing', level: 1,
  short: 'An index fund simply holds all the companies in a market index, in proportion to their size, instead of trying to pick winners. It delivers the market\'s return minus a small cost — which, after costs, has beaten most professional stock pickers over the long run.',
  keywords: ['index fund', 'passive investing', 'tracker fund', 'index tracking', 'market capitalisation', 'cap-weighted', 'total market', 'world index', 'tracking difference', 'tracking error', 'buy and hold', 'home bias', 'concentration'],
  prereq: ['mutual-funds-etfs', 'market-indices', 'diversification'],
  related: ['active-vs-passive', 'investment-fees', 'market-efficiency', 'rebalancing', 'asset-allocation', 'capm-beta', 'dollar-cost-averaging'],
  body: `
In the mid-1970s a new kind of fund was offered to ordinary savers, and it was mocked as "settling for average". Instead of employing clever people to pick the best shares, it simply bought *all* the shares in a market index and held them. Half a century later, index funds held about half of the money in US share funds, and a fast-growing share elsewhere. The reason is arithmetic, not fashion.

### How an index fund works
A [[market-indices|market index]] is a list of companies with a weight for each. In most indices the weight is the company's **market capitalisation** — its total value on the stock market — divided by the value of all the companies in the index:

$$w_i = \\frac{M_i}{\\sum_j M_j}$$

An index fund holds each company in proportion to its weight. The clever part is what happens when prices move. If one company's shares double, its weight in the index rises — but so does the value of the shares the fund already holds, by exactly the right amount. The fund does not need to trade. That is why index funds can be run cheaply and trade little, which in many countries also means fewer taxable gains.

### Why "average" beats most
Think of every ¤ invested in a market. Index funds hold the market, so before costs they earn the market's return. Everyone else — the active investors — together hold the rest of the market, which is the market too; so *as a group* they must also earn the market's return before costs. But active management costs more: research, trading, higher fees. After costs, therefore, the average actively managed ¤ must trail the average index-fund ¤. The economist William Sharpe set out this arithmetic in 1991. It holds in every market and every year; what it cannot say is which particular manager will win ([[active-vs-passive]]).

What an index fund gives you, then, is the market's return minus a small cost. A broad fund charging 0.08 % a year, tracking an index that returns 7 %, should return close to 6.92 %. The gap between fund and index — the **tracking difference** — is the true cost of owning it, and worth checking over several years.

### Choosing what to track
- **Breadth.** A total-market or world index holds thousands of companies in dozens of countries; a large-company index of one country holds a few hundred; a sector or theme index may hold a few dozen.
- **Concentration.** Weighting by size means the largest companies dominate. In the mid-2020s the ten biggest companies made up more than a third of the main US large-company index, and US shares were roughly 60–70 % of the leading world indices.
- **Home bias.** Many investors hold mostly their own country's shares. A small country's market may be dominated by a handful of banks, miners or technology firms — far from diversified.
- **Bonds** can be indexed too, with the same logic.

> [!key] An index fund does not search for the needles in the haystack; it buys the haystack. It gives up the hope of beating the market in exchange for never trailing it by more than its small cost.

> [!warn] An index fund falls with its market: broad world share funds lost about half their value in 2008–09. Indexing removes the risk of choosing badly among companies, not the risk of the market itself — that is managed with the mix of [[asset-allocation|shares, bonds and cash]].
`,
  ideas: [
    'An index fund holds every company in an index in proportion to its market value, so it needs to trade very little.',
    'Before costs, index investors and active investors as groups both earn the market return; after costs, the average active ¤ must trail.',
    'An index fund delivers the market\'s return minus a small cost; the tracking difference measures that cost.',
    'Index choice matters: breadth, concentration in the largest companies, and home bias.',
    'Indexing removes the risk of picking badly, not the risk of the market.'
  ],
  pitfalls: [
    'Index investing means settling for mediocre returns — Before costs it earns exactly the market return, and after costs it has beaten most active funds over long periods; "average" is the average before costs, which most managers fail to reach after them.',
    'All index funds are broad and cheap — Some track a narrow theme, a single sector or a handful of companies, and some charge high fees; the word "index" guarantees neither diversification nor low cost.',
    'If everyone indexed, prices would stop making sense — Only a modest amount of active trading is needed to keep prices informed, and as indexing grows, mispricings become more profitable to correct, which draws active money back.'
  ],
  formulas: [
    {
      name: 'Weight of a company in a market-value index',
      expr: 'w = M/T', tex: 'w = \\frac{M}{T}',
      vars: {
        w: { name: 'weight in the index', q: 'ratio', unit: '%' },
        M: { name: 'the company\'s market value', q: 'money', unit: '$bn', value: 300 },
        T: { name: 'total market value of the index', q: 'money', unit: '$bn', value: 5000 }
      },
      practice: { unknowns: ['w', 'M'] },
      stories: {
        w: 'A company is worth {M} on the stock market, and all the companies in its index together are worth {T}. What is its weight in the index?',
        M: 'An index is worth {T} in total, and one company makes up {w} of it. What is that company worth?'
      }
    },
    {
      name: 'Market capitalisation',
      expr: 'M = n*p',
      vars: {
        M: { name: 'market value of the company', q: 'money', unit: '$bn' },
        n: { name: 'shares in issue', value: 2000000000 },
        p: { name: 'share price', q: 'money', unit: '$', value: 150 }
      },
      practice: { unknowns: ['M', 'p'] },
      stories: {
        M: 'A company has {n} shares in issue, trading at {p} each. What is its market capitalisation?',
        p: 'A company with {n} shares in issue is worth {M} on the stock market. What is its share price?'
      }
    },
    {
      name: 'What an index fund returns',
      expr: 'Rf = Ri - c', tex: 'R_f = R_i - c',
      vars: {
        Rf: { name: 'return of the fund', q: 'ratio', unit: '%', signed: true },
        Ri: { name: 'return of the index', q: 'ratio', unit: '%', value: 7, signed: true },
        c: { name: 'total yearly cost of the fund (tracking difference)', q: 'ratio', unit: '%', value: 0.08 }
      },
      note: 'Holds in bad years too: if the index loses 20 %, the fund loses a little more than 20 %.',
      practice: { unknowns: ['Rf', 'c'] },
      stories: {
        Rf: 'An index returns {Ri} in a year, and a fund tracking it has total costs of {c}. What does the fund return?',
        c: 'An index returned {Ri} and a fund tracking it returned {Rf}. What was the fund\'s tracking difference?'
      }
    }
  ],
  examples: [
    {
      title: 'A three-company index',
      q: 'An index holds three companies worth ¤600bn, ¤300bn and ¤100bn. Find their weights. Then the first company\'s shares rise 10 % while the others stay flat: what are the new weights, and what must an index fund do?',
      steps: [
        'Total ¤1,000bn, so the weights are 60 %, 30 % and 10 %.',
        'After the rise the first company is worth ¤660bn and the total ¤1,060bn: weights $660/1060 = 62.3\\,$%, $300/1060 = 28.3\\,$% and $100/1060 = 9.4\\,$%.',
        'The fund\'s holding in the first company rose by 10 % too, so its weights already match: it needs to do nothing.'
      ],
      a: '60/30/10, drifting to 62.3/28.3/9.4 — and the index fund moves with it without trading.'
    },
    {
      title: 'What the fund actually delivers',
      q: 'An index returns 7.00 % in a year. A fund tracking it charges 0.08 % and has 0.02 % of other costs. What does it return, and what does that cost on ¤50,000?',
      steps: [
        'Total cost: $0.08 + 0.02 = 0.10\\,$%.',
        'Fund return: $7.00 - 0.10 = 6.90\\,$%.',
        'In money: $50\\,000 \\times 0.001 = ¤50$ for the year.'
      ],
      a: 'About 6.90 %, a cost of ¤50 on ¤50,000.'
    }
  ],
  quiz: [
    { q: 'One company in an index doubles in price. What must a fund tracking the index do?', choices: ['Buy more of that company', 'Sell half of its holding', 'Nothing: its holding has grown in step with the company\'s weight', 'Sell all the other companies'], a: 2,
      why: 'In a market-value index, prices set the weights, and the fund\'s holdings change value in exactly the same proportions.' },
    { q: 'A company is worth ¤50bn in a market whose companies are worth ¤2,000bn in total. What is its weight in the index, in per cent?', answer: 2.5, unit: '%',
      why: '$50/2000 = 0.025$, that is 2.5 %.' },
    { q: 'An index fund protects you from market crashes.', a: false,
      why: 'It holds the market, so it falls with the market. It protects you only from the extra risk of picking the wrong companies.' },
    { q: 'Before costs, what return does the average actively managed ¤ earn?', choices: ['more than the market, because professionals are skilled', 'the market\'s return', 'less than the market, because of bad luck', 'it cannot be known'], a: 1,
      why: 'Active investors together hold whatever index investors do not, which is also the market; before costs their average must equal the market return.' },
    { q: 'Which of these is a genuine risk of a fund weighted by market value?', choices: ['It trades too often', 'It can become concentrated in a few very large companies', 'It never holds large companies', 'It pays no dividends'], a: 1,
      why: 'Weighting by size means the largest companies dominate; when a handful grow very large, the fund\'s fortunes depend heavily on them.' }
  ],
  applications: [
    'Building a diversified portfolio with one or two broad funds.',
    'Checking a fund\'s tracking difference and yearly cost before buying.',
    'Seeing how concentrated a "diversified" index really is.',
    'Understanding the default investments of many pension schemes.'
  ],
  history: 'Institutional index funds began in the early 1970s, and the first index fund for ordinary savers was launched in the US in 1976. William Sharpe\'s short note "The Arithmetic of Active Management" (1991) gave the argument for them its simplest form.',
  sim: 'inv-managers'
},

/* ================================================================ fees */
{
  id: 'investment-fees', parent: 'funds', title: 'Fees: the silent drain', level: 1,
  short: 'Fees are charged every year on everything you hold, whether the investments gain or lose, so they compound against you as surely as returns compound for you. One or two per cent a year sounds small; over thirty years it can take a quarter to almost half of the final pot.',
  keywords: ['fees', 'costs', 'expense ratio', 'TER', 'ongoing charge', 'OCF', 'management fee', 'entry charge', 'load', 'platform fee', 'advice fee', 'performance fee', 'trading costs', 'spread', 'cost drag', 'total cost'],
  prereq: ['compounding-returns', 'mutual-funds-etfs', 'math:exponential-growth-decay'],
  related: ['index-investing', 'active-vs-passive', 'brokers', 'bank-fees', 'taxes-investing', 'bid-ask-liquidity', 'financial-independence', 'pensions'],
  body: `
"One per cent a year" sounds like almost nothing. But it is not charged on your *gains*; it is charged on *everything* you hold, every year, whether the market rises or falls. Measured against what you actually expect to earn, it is large: a 1 % fee takes a seventh (14 %) of a 7 % return, and more than a fifth (22 %) of a 4.5 % return after inflation. And because each fee removes money that would itself have grown, the cost compounds — exactly like a return, in reverse.

### The arithmetic of a yearly fee
Invest $P$ for $t$ years at a return $r$ before costs, with a yearly fee $f$ charged on the balance:

$$A = P\\,\\big[(1 + r)(1 - f)\\big]^{t}$$

Compared with paying no fee, the pot is smaller by the factor $(1 - f)^t$, so the share of the final pot lost to fees is

$$L = 1 - (1 - f)^{t}$$

— whatever the return. Over 30 years:

| Yearly fee | 0.1 % | 0.5 % | 1 % | 1.5 % | 2 % |
|---|---:|---:|---:|---:|---:|
| Share of the final pot lost | 3.0 % | 14.0 % | 26.0 % | 36.5 % | 45.5 % |

Over 40 years, a 2 % fee takes more than half (55.4 %).

### A savings plan, three funds
Start with ¤10,000 and add ¤300 a month for 30 years, earning 7 % a year before costs; ¤118,000 is paid in. With a yearly fee of 0.1 % the pot ends at ¤437,576. With 1 % it ends at ¤361,139 — ¤76,437 less. With 2 % it ends at ¤293,662 — ¤143,914, a third, less. The simulation below shows the wedge opening year by year; the [savings calculator](#/tools/money/save) does the same for your own numbers.

### Where fees hide
- **Ongoing charge** (expense ratio, TER or OCF): the fund's yearly fee, deducted from its value every day. Broad index funds can cost well under 0.2 % a year; many active funds charge between 0.5 % and 2 %.
- **Entry and exit charges** ("loads"): a percentage taken when you buy or sell, sometimes 3–5 %.
- **Platform, custody or account fees**, charged by the service that holds your investments, as a percentage or a flat sum.
- **Advice fees**, often a percentage of your assets each year (around 1 % is common in some countries), or a fixed fee.
- **Performance fees**, a share of any return above a target.
- **Trading costs inside the fund** — commissions and spreads when the manager buys and sells — often *not* included in the headline figure.
- Your own [[brokers|commissions]], [[bid-ask-liquidity|spreads]] and currency conversions — and [[taxes-investing|taxes]], the other silent drain.

Some products stack several layers: a fund inside an insurance or pension wrapper inside an advised account can reach 2–3 % a year in total.

> [!key] Returns are uncertain; costs are certain. The fee is one of the very few numbers about an investment known in advance, and low cost has been one of the most dependable predictors of better results for investors.

> [!tip] Turn every fee into money: balance × fee. A 1.5 % charge on ¤80,000 is ¤1,200 a year, every year. Then ask whether what it buys — advice, convenience, a manager's skill — is worth that to you. In the European Union a fund's key information document must show its costs; in the US the prospectus has a fee table.
`,
  ideas: [
    'A fee is charged on the whole balance every year, gains or losses, so it compounds against you.',
    'The share of the final pot lost to a yearly fee is $1 - (1 - f)^t$, whatever the return.',
    'Over 30 years, 1 % a year takes about a quarter of the final pot and 2 % almost half.',
    'Costs hide in many layers: ongoing charges, entry fees, platforms, advice, trading and taxes.',
    'Returns are uncertain and costs are certain; low cost has been one of the best predictors of good results.'
  ],
  pitfalls: [
    'One per cent is too small to matter — It is charged on the whole balance every year; over 30 years it takes about a quarter of the final pot.',
    'I pay nothing: the fund never sends a bill — The ongoing charge is taken from the fund\'s value every day; the returns you see are already after it.',
    'Higher fees buy better management — On average they do not: after costs, more expensive funds have tended to do worse, and the fee is certain while the skill is not.'
  ],
  formulas: [
    {
      name: 'Growth with a yearly fee',
      expr: 'A = P*((1 + r)*(1 - f))^t', tex: 'A = P\\,\\big[(1 + r)(1 - f)\\big]^{t}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'return before costs', q: 'ratio', unit: '%', value: 7, min: -90, max: 100 },
        f: { name: 'yearly fee on the balance', q: 'ratio', unit: '%', value: 1, min: 0, max: 50 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'A fee taken once a year from the balance after growth. Set $f$ to zero to see the pot without fees; solve for $f$ to find the fee hidden in a result.',
      practice: { unknowns: ['A', 'f'] },
      stories: {
        A: 'You invest {P} for {t} at {r} a year before costs, in a fund charging {f} a year. What is it worth at the end?',
        f: '{P} invested for {t} at {r} a year before costs ended at {A}. What yearly fee does that imply?'
      }
    },
    {
      name: 'Share of the final pot lost to fees',
      expr: 'L = 1 - (1 - f)^t', tex: 'L = 1 - (1 - f)^{t}',
      vars: {
        L: { name: 'share of the final pot lost', q: 'ratio', unit: '%' },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 1, min: 0, max: 50 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Compared with the same investment with no fee, for a single sum; it does not depend on the return.',
      practice: { unknowns: ['L', 'f', 't'] },
      stories: {
        L: 'A fund charges {f} a year. What share of your final pot does the fee take over {t}?',
        f: 'You are willing to lose at most {L} of your final pot to fees over {t}. What is the highest yearly fee that allows?',
        t: 'A fee of {f} a year: after how long has it taken {L} of the pot?'
      }
    },
    {
      name: 'The fee as a share of the return',
      expr: 'x = f/r', tex: 'x = \\frac{f}{r}',
      vars: {
        x: { name: 'share of the return taken by the fee', q: 'ratio', unit: '%' },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 1 },
        r: { name: 'expected return before costs', q: 'ratio', unit: '%', value: 7 }
      },
      note: 'Use the real return (after inflation) for $r$ to see what the fee takes from your growth in buying power.',
      practice: { unknowns: ['x'] },
      stories: { x: 'A fund is expected to return {r} a year before costs and charges {f}. What share of the return does the fee take?' }
    }
  ],
  examples: [
    {
      title: 'One per cent over thirty years',
      q: '¤10,000 is invested for 30 years at 7 % a year before costs. Compare no fee with a yearly fee of 1 %.',
      steps: [
        'No fee: $10\\,000 \\times 1.07^{30} = ¤76{,}123$.',
        'With 1 %: $10\\,000 \\times (1.07 \\times 0.99)^{30} = ¤56{,}308$.',
        'Share lost: $1 - 0.99^{30} = 26.0\\,$%, which is $(76\\,123 - 56\\,308)/76\\,123$.',
        'The fee took ¤19,815 — nearly twice the amount originally invested.'
      ],
      a: '¤56,308 against ¤76,123: the 1 % fee takes 26 % of the final pot.'
    },
    {
      title: 'An entry charge',
      q: 'A fund takes a 5 % entry charge on ¤10,000. What does that cost after 20 years at 7 %, and what ongoing fee would cost the same?',
      steps: [
        '¤500 is taken at once, so ¤9,500 is invested.',
        'That ¤500 would have grown to $500 \\times 1.07^{20} = ¤1{,}935$: the true cost after 20 years.',
        'The pot is 5 % smaller for ever. An ongoing fee takes $1 - (1 - f)^{20}$; setting this to 5 % gives $f = 1 - 0.95^{1/20} = 0.26\\,$% a year.'
      ],
      a: 'About ¤1,935 after 20 years — the same as an ongoing fee of about 0.26 % a year for 20 years.'
    }
  ],
  quiz: [
    { q: 'A fund is expected to return 6 % a year before costs and charges 1.5 % a year. What share of the return does the fee take, in per cent?', answer: 25, unit: '%',
      why: '$1.5/6 = 0.25$: a quarter of the expected return, every year.' },
    { q: 'A fund charges 2 % a year. What share of the final pot does the fee take over 20 years, in per cent?', answer: 33.2, unit: '%',
      why: '$1 - 0.98^{20} = 1 - 0.668 = 0.332$: a third of the pot, whatever the return.' },
    { q: 'Funds with higher fees usually deliver higher returns to make up for them.', a: false,
      why: 'Studies of fund performance have found the opposite on average: higher-cost funds tend to trail lower-cost ones after fees.' },
    { q: 'When do you pay a fund\'s ongoing charge?', choices: ['once a year, by invoice', 'only when you sell', 'continuously, taken from the fund\'s value', 'only in years with a gain'], a: 2,
      why: 'The charge is accrued daily and deducted from the fund\'s assets, so the published returns are already after it — and it is paid in losing years too.' },
    { q: 'Over 30 years, which costs more: an entry charge of 1 % paid once, or an ongoing charge of 1 % a year?', choices: ['the entry charge', 'the ongoing charge', 'they cost the same', 'it depends only on the return'], a: 1,
      why: 'A one-off 1 % takes 1 % of the pot; 1 % a year takes $1 - 0.99^{30} = 26$ % of it.' }
  ],
  applications: [
    'Comparing funds, pension plans and advice services by their total yearly cost.',
    'Turning percentage fees into money before signing up.',
    'Understanding why low-cost index funds became so popular.',
    'Checking what a pension or insurance-linked savings product charges in layers.'
  ],
  sim: 'inv-fees'
},

/* ================================================================ active or passive */
{
  id: 'active-vs-passive', parent: 'funds', title: 'Active or passive?', level: 2,
  short: 'Active managers try to beat the market by choosing investments; passive funds simply hold it. Before costs, active investors as a group must earn the market\'s return; after their higher costs most fall behind — and the few who win are hard to identify in advance.',
  keywords: ['active management', 'passive investing', 'stock picking', 'fund manager', 'alpha', 'outperformance', 'benchmark', 'survivorship bias', 'persistence', 'luck and skill', 'closet indexing', 'arithmetic of active management'],
  prereq: ['index-investing', 'investment-fees', 'market-efficiency'],
  related: ['capm-beta', 'sharpe-ratio', 'cognitive-biases', 'mutual-funds-etfs', 'expected-return', 'math:binomial-distribution'],
  body: `
Should you pay someone to choose investments, hoping to beat the market, or simply own the market through an index fund? It is one of the most studied questions in finance, and the evidence is unusually clear — though it leaves a little room for judgement.

### The arithmetic
Before costs, active investors as a group hold the market and earn its return, $R_m$ (see [[index-investing]]). After their higher costs $c$, the average active result is

$$R_{\\text{active}} = R_m - c$$

For every active ¤ that beats the market before costs, another trails it by the same amount. Active management is a contest in which the winners' gains are exactly the losers' shortfalls — *before* the fees that all of them pay.

### The evidence
Studies comparing funds with their benchmark indices over long periods — such as the scorecards that index providers have published twice a year since the early 2000s — find a consistent picture. Over 15–20 years, roughly 85–90 % of US large-company share funds trailed their index after fees; in Europe, Japan, Australia and most emerging markets the proportions have been similar or higher. Some less-followed corners of the market have looked better for a while, but not reliably from one period to the next. Two further findings sharpen the picture:
- **Survivorship bias.** Funds that do badly are often closed or merged into others and disappear from the records. Over fifteen to twenty years around half of all funds vanish, so lists of today's funds look better than their investors' experience.
- **Persistence.** Top performers rarely stay on top. Of the funds in the best quarter over one five-year period, the share still in the best quarter over the next five has typically been no better than chance.

Individuals who pick shares themselves face the same arithmetic with less information: studies of tens of thousands of brokerage accounts found that those who traded most trailed the market by several percentage points a year.

### Luck looks like skill
Imagine 1,000 managers with no skill at all, each with an even chance of beating the index in any year. After five years, by luck alone, about $1\\,000 \\times 0.5^5 = 31$ of them will have beaten it every single year — and their records will look brilliant. With costs, the chance per year falls below a half: at 40 %, about 10 still manage the streak. In the simulation below, 400 skill-less managers with costs 0.9 % a year higher than the index fund's begin with 40 % of them ahead after one year; after 15 years 20 % are ahead, and after 30 years 13 %.

### Is active ever worth it?
Active investors keep prices informed — a market in which no one analysed companies would be easy to beat — so some active management will always exist, and a few managers are genuinely skilled. The difficulty is identifying them *in advance*, and their fees often absorb much of their skill. Some people choose active funds for reasons other than return: values-based choices, a particular strategy, or simply the interest of it. Made knowing the odds, that is a legitimate choice; many people who make it keep such choices to a limited part of their money.

> [!key] Choosing active management is a bet that you can pick, in advance, a manager whose skill exceeds their extra costs. The evidence says most such bets lose — not because managers are foolish, but because the arithmetic of costs is against them.
`,
  ideas: [
    'Before costs, active investors as a group earn the market return; after costs, the average active result is $R_m - c$.',
    'Over 15–20 years, most active funds in most markets have trailed their index after fees.',
    'Survivorship bias flatters the record, and top performers have rarely stayed on top.',
    'Among many managers, impressive streaks arise by luck alone: $M p^N$ expected.',
    'The challenge is not whether skill exists but whether it can be identified in advance and exceeds its cost.'
  ],
  pitfalls: [
    'A top-ranked fund proves its manager is skilled — Among thousands of funds many strong records arise by luck, and top rankings have rarely persisted.',
    'Passive investors are free-riders who accept worse results — Before costs they earn the market return by definition, and after costs they have usually beaten the average active investor.',
    'Active managers protect you in falling markets — On average they have not: in the major falls of the past decades most active funds still trailed their indices.'
  ],
  formulas: [
    {
      name: 'The arithmetic of active management',
      expr: 'Ra = Rm - c', tex: 'R_{\\text{active}} = R_m - c',
      vars: {
        Ra: { name: 'average return of active investors after costs', q: 'ratio', unit: '%', signed: true, tex: 'R_{\\text{active}}' },
        Rm: { name: 'market return', q: 'ratio', unit: '%', value: 7, signed: true },
        c: { name: 'average costs of active management', q: 'ratio', unit: '%', value: 1 }
      },
      note: 'An average over all active money, weighted by size. Individual managers scatter around it — some above, most below.',
      practice: { unknowns: ['Ra'] },
      stories: { Ra: 'The market returns {Rm} in a year, and active funds cost {c} a year on average. What does the average actively managed ¤ earn?' }
    },
    {
      name: 'Lucky streaks among many managers',
      expr: 'K = M*p^N', tex: 'K = M\\,p^{N}',
      vars: {
        K: { name: 'expected number with a perfect streak' },
        M: { name: 'number of managers', int: true, value: 1000 },
        p: { name: 'chance of beating the index in one year', q: 'ratio', unit: '%', value: 50, min: 0.1, max: 100 },
        N: { name: 'years in a row', int: true, value: 5 }
      },
      note: 'Assumes each year is independent and no manager has skill. Real records should be judged against this baseline (see [[math:binomial-distribution|the binomial distribution]]).',
      practice: { unknowns: ['K', 'N'] },
      stories: {
        K: '{M} managers with no skill each have a {p} chance of beating the index in any year. How many would you expect to beat it {N} years in a row?',
        N: '{M} managers with no skill each have a {p} chance of beating the index in any year. For how many years in a row would about {K} of them beat it by luck?'
      }
    },
    {
      name: 'Share of the index result kept by an active fund with no skill',
      expr: 'G = ((1 + Rm - ca)/(1 + Rm - ci))^t', tex: 'G = \\left(\\frac{1 + R_m - c_a}{1 + R_m - c_i}\\right)^{t}',
      vars: {
        G: { name: 'final value as a share of the index fund\'s', q: 'ratio', unit: '%' },
        Rm: { name: 'market return a year', q: 'ratio', unit: '%', value: 7, signed: true, min: -50, max: 100 },
        ca: { name: 'yearly costs of the active fund', q: 'ratio', unit: '%', value: 1 },
        ci: { name: 'yearly costs of the index fund', q: 'ratio', unit: '%', value: 0.1 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'For an active fund whose choices, before costs, only match the market. To come out even it must beat the market by the cost gap every year.',
      practice: { unknowns: ['G'] },
      stories: { G: 'The market returns {Rm} a year. An active fund costs {ca} a year, an index fund {ci}. If the active manager merely matches the market before costs, what share of the index fund\'s result does the active fund end with after {t}?' }
    }
  ],
  examples: [
    {
      title: 'Lucky streaks',
      q: '1,000 managers with no skill each have an even chance of beating their index in any year. How many will beat it five years running? What if costs cut the yearly chance to 40 %?',
      steps: [
        'At 50 %: $1\\,000 \\times 0.5^5 = 1\\,000/32 = 31.25$ — about 31 managers with a perfect five-year record, by luck alone.',
        'At 40 %: $1\\,000 \\times 0.4^5 = 1\\,000 \\times 0.01024 = 10.2$ — about 10.',
        'A handful of perfect records is exactly what chance predicts. Evidence of skill would be many more than that — which is not what the studies find.'
      ],
      a: 'About 31 at an even chance, about 10 at 40 %.'
    },
    {
      title: 'The cost gap over twenty years',
      q: '¤100,000 is invested for 20 years. The market returns 7 % a year. An index fund costs 0.1 %; an active fund costs 1 % and, before costs, merely matches the market. Compare the results.',
      steps: [
        'Index fund: $100\\,000 \\times 1.069^{20} = ¤379{,}799$.',
        'Active fund: $100\\,000 \\times 1.06^{20} = ¤320{,}714$.',
        'The active fund keeps $(1.06/1.069)^{20} = 84.4\\,$% of the index fund\'s result: ¤59,085 less.',
        'To break even, the manager must beat the market by 0.9 % a year, every year, before costs.'
      ],
      a: '¤379,799 against ¤320,714; the active fund needs 0.9 % a year of genuine skill just to tie.'
    }
  ],
  quiz: [
    { q: 'Before costs, the average actively managed ¤ earns…', choices: ['more than the market', 'the market\'s return', 'less than the market', 'the risk-free rate'], a: 1,
      why: 'Active investors together hold the part of the market that index funds do not, which in total is the market; their average before costs must equal it.' },
    { q: '2,000 managers with no skill each have a 50 % chance of beating the index in a year. How many would you expect to beat it four years in a row?', answer: 125,
      why: '$2\\,000 \\times 0.5^4 = 2\\,000/16 = 125$.' },
    { q: 'A fund that beat its index in each of the past five years will probably beat it over the next five.', a: false,
      why: 'Studies of persistence find that past winners are no more likely than chance to stay winners; the next five years are close to a fresh draw — with the costs still attached.' },
    { q: 'Because poorly performing funds are closed or merged, the average record of the funds that exist today looks…', choices: ['worse than it really was', 'better than it really was', 'exactly as it was', 'random'], a: 1,
      why: 'That is survivorship bias: the failures have dropped out of the sample, so what remains flatters active management.' },
    { q: 'Which change would most improve an active fund\'s chance of beating its index after costs?', choices: ['trading more often', 'lower costs', 'a larger marketing budget', 'a longer name'], a: 1,
      why: 'Costs are the one certain drag; every point saved is a point the manager no longer needs to find through skill.' }
  ],
  applications: [
    'Weighing an active fund\'s higher fee against the odds that it will earn it back.',
    'Reading a fund\'s past performance with survivorship bias and luck in mind.',
    'Understanding why many pension schemes default to index funds.',
    'Deciding, with open eyes, whether to keep a small part of a portfolio for active choices.'
  ],
  sim: 'inv-managers'
},

/* ================================================================ rebalancing */
{
  id: 'rebalancing', parent: 'funds', title: 'Rebalancing', level: 2,
  short: 'As markets move, a portfolio drifts away from the mix you chose — usually towards more shares and more risk. Rebalancing means selling a little of what has grown and buying what has lagged, on a schedule or when the drift passes a limit, to keep the risk you intended.',
  keywords: ['rebalancing', 'rebalance', 'drift', 'target allocation', 'asset mix', 'threshold', 'tolerance band', 'calendar rebalancing', 'sell high buy low', 'contrarian', 'portfolio weights', 'glide path'],
  prereq: ['asset-allocation', 'diversification', 'risk-and-return'],
  related: ['index-investing', 'taxes-investing', 'volatility', 'drawdowns', 'loss-aversion', 'dollar-cost-averaging', 'cognitive-biases', 'time-horizon'],
  body: `
You decide to hold 60 % shares and 40 % bonds, a mix whose ups and downs you can live with. A year later shares have risen 25 % and bonds 2 %, and without doing anything your portfolio is now 64.8 % shares. After a few more good years it may be 75 % shares — a riskier portfolio than the one you chose, arriving just when a fall would hurt most. **Rebalancing** is the discipline of bringing the mix back: selling some of what has grown and buying what has lagged.

### How a portfolio drifts
If the first asset, with weight $w$, returns $a$ and the second returns $b$, the first asset's new weight is

$$w_1 = \\frac{w(1 + a)}{w(1 + a) + (1 - w)(1 + b)}$$

Because shares usually grow faster than bonds, an untouched portfolio usually drifts towards more shares. In the simulation below, a 60/40 portfolio left alone for 30 years ended with at least 75 % in shares in about half of 1,000 simulated markets. After a crash the drift runs the other way: if shares fall 30 % while bonds gain 5 %, the 60/40 portfolio becomes 50/50.

### Bringing it back
The trade is the difference between the current and the target weight, times the portfolio's value. On ¤115,800 at 64.8 % shares, going back to 60 % means selling ¤5,520 of shares and buying bonds with it. Common methods:
- **Calendar**: once a year, on a fixed date.
- **Bands**: only when a weight strays more than, say, 5 percentage points from its target. This trades less and keeps nearly the same control.
- **With cash flows**: send new savings (or take withdrawals) from whatever is off target — rebalancing without selling, which saves costs and, in taxable accounts, taxes ([[taxes-investing]]).

Balanced, multi-asset and target-date funds rebalance automatically inside the fund.

### What it does, and what it does not do
Rebalancing's job is **risk control**: keeping the portfolio's volatility and its worst falls near the level you chose. In the simulation, yearly rebalancing held a 60/40 portfolio's volatility at about 11.2 % a year, against 12.4 % for the portfolio left to drift. Its effect on the return is small and can go either way. When shares race ahead for decades, the drifting portfolio ends with more; in choppy markets, rebalancing's habit of selling high and buying low can add a little. Across the simulated markets, the never-rebalanced portfolio ended with more in 42 % of them.

### The hard part is emotional
Rebalancing is contrarian. It asks you to buy shares after they have crashed, when the news is grim and every instinct says wait — and to sell some after a boom, when everything feels safe. A rule written down in calm times ("each January, back to 60/40"), or a fund that does it for you, gets past both the [[loss-aversion|fear]] and the pull of the [[cognitive-biases|herd]].

> [!key] Rebalancing keeps the portfolio you chose from quietly turning into one you did not choose. It is maintenance of risk, not a recipe for extra return.
`,
  ideas: [
    'Markets move the weights: an untouched portfolio usually drifts towards more shares and more risk.',
    'The new weight is $w(1 + a)/[w(1 + a) + (1 - w)(1 + b)]$.',
    'Rebalance on a calendar, when a band is crossed, or by directing new money to what is off target.',
    'The purpose is to keep risk near the level chosen; the effect on return is small and goes either way.',
    'Rebalancing means buying after falls — a rule set in advance makes that possible.'
  ],
  pitfalls: [
    'Rebalancing sells your winners, which is a mistake — It trims them back to the weight you chose; letting winners run means accepting more risk than you planned.',
    'The more often you rebalance, the better — Frequent rebalancing adds trading costs and, in taxable accounts, taxes, for little extra control; once a year or a band of several points is typical.',
    'Rebalancing guarantees higher returns — Its return effect is small and goes either way; its purpose is to keep the risk where you chose it.'
  ],
  formulas: [
    {
      name: 'Weight after a year of drift',
      expr: 'w1 = w*(1 + a)/(w*(1 + a) + (1 - w)*(1 + b))', tex: 'w_1 = \\frac{w(1 + a)}{w(1 + a) + (1 - w)(1 + b)}',
      vars: {
        w1: { name: 'new weight of the first asset', q: 'ratio', unit: '%', tex: 'w_1' },
        w: { name: 'starting weight of the first asset', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        a: { name: 'return of the first asset (e.g. shares)', q: 'ratio', unit: '%', value: 25, signed: true, min: -99, max: 1000 },
        b: { name: 'return of the second asset (e.g. bonds)', q: 'ratio', unit: '%', value: 2, signed: true, min: -99, max: 1000 }
      },
      practice: { unknowns: ['w1', 'a'] },
      stories: {
        w1: 'A portfolio starts with {w} in shares and the rest in bonds. Shares return {a} and bonds {b}. What share of the portfolio is now in shares?',
        a: 'A portfolio starts with {w} in shares; bonds return {b}, and afterwards shares make up {w1}. What did shares return?'
      }
    },
    {
      name: 'The rebalancing trade',
      expr: 'x = (w1 - w)*V', tex: 'x = (w_1 - w)\\,V',
      vars: {
        x: { name: 'amount of the first asset to sell (negative: to buy)', q: 'money', unit: '$', signed: true },
        w1: { name: 'current weight of the first asset', q: 'ratio', unit: '%', value: 70, tex: 'w_1' },
        w: { name: 'target weight', q: 'ratio', unit: '%', value: 60 },
        V: { name: 'value of the whole portfolio', q: 'money', unit: '$', value: 100000 }
      },
      note: 'Sell $x$ of the first asset and buy the same amount of the second (or the reverse when $x$ is negative). Directing new savings to the underweight asset does the same without selling.',
      practice: { unknowns: ['x'] },
      stories: { x: 'A portfolio worth {V} has {w1} in shares against a target of {w}. How much should be moved out of shares to rebalance?' }
    }
  ],
  examples: [
    {
      title: 'After a good year for shares',
      q: '¤100,000 is held 60 % in shares and 40 % in bonds. Shares return 25 % and bonds 2 %. What is the new mix, and what trade restores 60/40?',
      steps: [
        'Shares: $60\\,000 \\times 1.25 = ¤75{,}000$. Bonds: $40\\,000 \\times 1.02 = ¤40{,}800$. Total ¤115,800.',
        'Share of shares: $75\\,000/115\\,800 = 64.8\\,$%.',
        'Target in shares: $0.6 \\times 115\\,800 = ¤69{,}480$, so sell $75\\,000 - 69\\,480 = ¤5{,}520$ of shares and buy bonds with it.'
      ],
      a: 'The mix drifts to 64.8/35.2; selling ¤5,520 of shares restores 60/40.'
    },
    {
      title: 'After a crash',
      q: 'The same ¤100,000 at 60/40, but this time shares fall 30 % while bonds gain 5 %. What is the new mix, and what does rebalancing ask you to do?',
      steps: [
        'Shares: $60\\,000 \\times 0.7 = ¤42{,}000$. Bonds: $40\\,000 \\times 1.05 = ¤42{,}000$. Total ¤84,000: now 50/50.',
        'Target in shares: $0.6 \\times 84\\,000 = ¤50{,}400$, so buy ¤8,400 of shares, paid for by selling bonds.',
        'It means buying shares right after a 30 % fall — exactly when it feels hardest, and when a rule decided in advance helps most.'
      ],
      a: 'The mix becomes 50/50; rebalancing means moving ¤8,400 from bonds into shares.'
    }
  ],
  quiz: [
    { q: 'Left alone for many years, a portfolio of shares and bonds usually drifts towards…', choices: ['more bonds', 'more shares', 'exactly its starting mix', 'all cash'], a: 1,
      why: 'Shares have usually grown faster than bonds, so their share of an untouched portfolio tends to rise — and with it the portfolio\'s risk.' },
    { q: 'A portfolio is 50 % shares and 50 % bonds. Shares rise 40 % and bonds are flat. What share of the portfolio is now in shares, in per cent?', answer: 58.3, unit: '%',
      why: '$0.5 \\times 1.4 / (0.5 \\times 1.4 + 0.5) = 0.7/1.2 = 58.3$ %.' },
    { q: 'Rebalancing is mainly a way to increase returns.', a: false,
      why: 'Its main job is to keep risk at the chosen level. Its effect on returns is small and can be positive or negative.' },
    { q: 'After a stock-market crash, rebalancing a shares-and-bonds portfolio asks you to…', choices: ['sell shares', 'buy shares, selling some bonds', 'do nothing until prices recover', 'move everything to cash'], a: 1,
      why: 'The crash shrank the shares\' weight below target; restoring it means buying shares while they are cheap — the contrarian heart of rebalancing.' },
    { q: 'Which way of rebalancing avoids selling anything?', choices: ['calendar rebalancing', 'band rebalancing', 'directing new contributions to the underweight asset', 'none of them'], a: 2,
      why: 'Adding new money only to what is below target moves the mix back without sales, saving trading costs and, in taxable accounts, taxes.' }
  ],
  applications: [
    'Keeping a long-term portfolio at the risk level you chose.',
    'Writing a simple rule — a date or a band — for when to rebalance.',
    'Using new savings or withdrawals to rebalance without selling.',
    'Understanding what balanced and target-date funds do automatically.'
  ],
  sim: 'inv-rebalance'
}

);
