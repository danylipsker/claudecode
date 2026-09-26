/* HYPER-FINANCES · content/stock-exchange.js — The Stock Market: the exchange and its language.
 * Shares, exchanges and IPOs, the vocabulary, bid and ask, orders, indices, bull and bear
 * markets, short selling and brokers. Simulations in sims/stocks.js. */
Hyper.add(

/* ================================================================ shares */
{
  id: 'stocks-shares', parent: 'stock-exchange', title: 'Shares: owning a company', level: 1,
  short: 'A share is an equal slice of a company: a claim on what is left of its profits after everyone else is paid, usually a vote, and something you can sell. Its return is the dividends you receive plus the change in its price.',
  keywords: ['share', 'stock', 'equity', 'shareholder', 'ordinary shares', 'common stock', 'preference shares', 'preferred stock', 'limited liability', 'dilution', 'total return', 'ownership', 'residual claim'],
  prereq: ['why-invest', 'risk-and-return', 'asset-classes'],
  related: ['stock-exchanges', 'dividends', 'earnings-eps', 'diversification', 'stock-terminology', 'bond-basics'],
  body: `
Maya has run a bakery for ten years. It makes a profit, and she wants a second shop, which will cost ¤200,000 she does not have. She could borrow it — or she could sell part of the business. She divides the company into 100,000 equal parts, called **shares**, all of them hers, and then sells 40,000 *new* shares at ¤5 each to friends and regular customers. The bakery receives ¤200,000. Maya still owns 100,000 of the 140,000 shares, or 71.4 %; a customer who bought 1,000 shares owns 0.71 % of a company that, at ¤5 a share, is now valued at ¤700,000.

That is all a share is: an equal slice of a company. A listed company is cut into millions or billions of slices and its shares trade on a [[stock-exchanges|stock exchange]], but the idea is exactly the bakery's. "Shares", "stocks" and "equity" all mean the same thing here.

### What a share gives you
- **A claim on the profits — after everyone else.** The company pays its staff, suppliers, lenders and taxes first; what remains belongs to the shareholders. It is either paid out as [[dividends]] or kept and reinvested to grow the business. Shareholders are *residual* owners: last in line when things go badly, first to benefit when they go well.
- **A vote.** Ordinary shares usually carry one vote each at the annual general meeting: electing the board, approving the auditors, deciding on large mergers. Some companies issue several classes, with the founders' shares carrying more votes.
- **Limited liability.** If the company fails, you lose what you paid for your shares and nothing more; its creditors cannot come after your home. This one legal idea is what lets millions of strangers own a business together.
- **Something you can sell.** For a listed company, you can sell your slice to another investor on any trading day, at whatever price the market offers that day.

> [!key] A share is ownership, not a loan. Nobody promises to pay it back and nobody promises a return: you receive your part of whatever the business earns, in good years and bad.

### Where the return comes from
There are two sources: the dividends paid while you hold the share, and the change in its price.

$$R = \\frac{P_1 - P_0 + D}{P_0}$$

Buy at ¤40, receive ¤1.20 of dividends during the year, and find the price at ¤43 at the end: $R = (43 - 40 + 1.20)/40 = 0.105$, a 10.5 % return — 7.5 % from the price and 3 % from the dividend. Over long periods the price follows the company's profits: a business that comes to earn twice as much tends, sooner or later, to be worth roughly twice as much (see [[earnings-eps]] and [[pe-ratio]]). Day to day, it follows the mood of the market.

### Ordinary and preference shares
**Preference** (preferred) shares pay a fixed dividend before ordinary shareholders receive anything and rank ahead of them if the company is wound up, but they usually carry no vote and do not share in the growth. They sit somewhere between a [[bond-basics|bond]] and an ordinary share. When people talk about "the stock market", they mean ordinary shares.

### Dilution
Your percentage falls whenever the company creates new shares — to raise money, to pay employees in shares, or to buy another company. Hold 1,000 of 1,000,000 shares and you own 0.1 %; after 250,000 new shares are issued you own 0.08 %. Dilution is not always bad — a smaller slice of a much bigger cake can be worth more — but a company that issues many new shares every year is quietly shrinking every existing owner's slice.

### The honest part: risk
A single company can fail, and its shares can become worthless; over a few decades many famous names disappear. Shares as a whole, on the other hand, have rewarded patient owners: over 1926–2020, US large company shares returned roughly 10 % a year before inflation, and over the twentieth century shares in most developed markets beat inflation by several per cent a year. But that path included falls of a third, a half and worse ([[bull-bear-markets]]). The usual answers are to own many companies rather than a few ([[diversification]]) and to hold shares only with money that will not be needed for years ([[time-horizon]]).

> [!tip] If owning a share feels like gambling, look at what you own: a slice of a business that sells things people buy. The price will swing; the question that matters over decades is whether the business keeps earning.
`,
  ideas: [
    'A share is an equal slice of a company: part ownership, not a loan.',
    'Shareholders are paid last, after staff, suppliers, lenders and taxes — and keep everything that is left.',
    'Limited liability: the most you can lose is what you paid for the shares.',
    'Total return = price change + dividends, divided by what you paid.',
    'New shares dilute existing owners; a single company can fail, which is why investors spread their money.'
  ],
  pitfalls: [
    'A share is just a ticker that goes up and down — It is part-ownership of a real business; over the long run its value follows what that business earns.',
    'A ¤2 share is cheaper, and more likely to rise, than a ¤500 share — The price of one share says nothing by itself: what matters is the price relative to the company\'s profits and assets, and the number of shares it is divided into.',
    'Dividends are a bonus on top of the price — The share price falls by about the dividend when it is paid; the return that counts is the total of both.'
  ],
  formulas: [
    {
      name: 'Your share of the company',
      expr: 's = n/N', tex: 's = \\frac{n}{N}',
      vars: {
        s: { name: 'your fraction of the company', q: 'ratio', unit: '%' },
        n: { name: 'shares you own', int: true, value: 1000 },
        N: { name: 'shares outstanding', int: true, value: 140000 }
      },
      note: 'Your part of every profit, every dividend and every vote.',
      practice: { unknowns: ['s', 'n'] },
      stories: {
        s: 'You own {n} of the {N} shares of a company. What fraction of it do you own?',
        n: 'A company has {N} shares. How many must you own to hold {s} of it?'
      }
    },
    {
      name: 'Total return of a share',
      expr: 'R = (P1 - P0 + D)/P0', tex: 'R = \\frac{P_1 - P_0 + D}{P_0}',
      vars: {
        R: { name: 'total return for the period', q: 'ratio', unit: '%', signed: true },
        P1: { name: 'price at the end', q: 'money', unit: '$', value: 43 },
        P0: { name: 'price paid', q: 'money', unit: '$', value: 40 },
        D: { name: 'dividends received per share', q: 'money', unit: '$', value: 1.2 }
      },
      note: 'Price change plus dividends, as a fraction of what you paid. Solve for $P_1$ to see what price a target return needs.',
      practice: { unknowns: ['R', 'P1'] },
      stories: {
        R: 'You buy a share at {P0}. Over the year it pays {D} in dividends and ends at {P1}. What is your total return?',
        P1: 'You bought at {P0} and received {D} in dividends. At what price would your total return be {R}?'
      }
    },
    {
      name: 'Your share after new shares are issued',
      expr: 's = n/(N + M)', tex: 's = \\frac{n}{N + M}',
      vars: {
        s: { name: 'your fraction afterwards', q: 'ratio', unit: '%' },
        n: { name: 'shares you own', int: true, value: 1000 },
        N: { name: 'shares outstanding before', int: true, value: 1000000 },
        M: { name: 'new shares issued', int: true, value: 250000 }
      },
      note: 'Dilution: the same number of shares is a smaller slice of the company.',
      practice: { unknowns: ['s', 'M'] },
      stories: {
        s: 'You own {n} of {N} shares. The company issues {M} new shares and you buy none. What fraction do you own now?',
        M: 'You own {n} of {N} shares. After a share issue you own {s}. How many new shares were issued?'
      }
    }
  ],
  examples: [
    {
      title: 'Maya sells part of her bakery',
      q: 'The bakery is divided into 100,000 shares, all Maya\'s. She sells 40,000 new shares at ¤5. How much does the bakery raise, what fraction does Maya keep, and what is the company worth at that price?',
      steps: [
        'Money raised: $40\\,000 \\times ¤5 = ¤200{,}000$. It goes to the company, because these are new shares.',
        'Shares afterwards: $100\\,000 + 40\\,000 = 140\\,000$. Maya\'s fraction: $100\\,000/140\\,000 = 0.714$, or 71.4 %.',
        'Value of the whole company at ¤5 a share: $140\\,000 \\times ¤5 = ¤700{,}000$ — the ¤500,000 the business was worth before, plus the ¤200,000 of new cash.'
      ],
      a: '¤200,000 raised; Maya keeps 71.4 %; the company is valued at ¤700,000.'
    },
    {
      title: 'A year\'s total return',
      q: 'You buy a share at ¤40. It pays ¤1.20 of dividends during the year and ends the year at ¤43. What is your total return, and how much of it came from the dividend?',
      steps: [
        'Price gain: $43 - 40 = ¤3$, which is $3/40 = 7.5$ % of what you paid.',
        'Dividend: $1.20/40 = 3$ %.',
        { text: 'Total:', tex: 'R = \\frac{43 - 40 + 1.20}{40} = 0.105' }
      ],
      a: '10.5 % in total: 7.5 % from the price and 3 % from the dividend.'
    }
  ],
  quiz: [
    { q: 'A company goes bankrupt and its assets are sold. Who is paid last?', choices: ['its lenders and bondholders', 'its employees\' unpaid wages', 'its ordinary shareholders', 'the tax authority'], a: 2,
      why: 'Ordinary shareholders are residual owners: they receive only what is left after every creditor has been paid — in a bankruptcy, usually nothing. In return, they keep all the upside when the business does well.' },
    { q: 'If a company you own shares in collapses with large debts, its creditors can ask you to help pay them.', a: false,
      why: 'Limited liability: a shareholder can lose what was paid for the shares, but is not responsible for the company\'s debts.' },
    { q: 'You buy a share at ¤25. It pays a ¤0.50 dividend and ends the year at ¤24. What is your total return, in per cent?', answer: -2, unit: '%',
      why: 'Price change −¤1 plus dividend ¤0.50 is −¤0.50; divided by ¤25 that is −2 %. The dividend softened the loss but did not cancel it.' },
    { q: 'You own 2 % of a company with 10 million shares. It issues 2.5 million new shares and you buy none. What fraction do you own now, in per cent?', answer: 1.6, unit: '%',
      why: 'You hold 200,000 shares; afterwards there are 12.5 million, so your share is 200,000/12,500,000 = 1.6 %.' },
    { q: 'Over the long run, what mostly drives the price of a company\'s shares?', choices: ['how many people talk about it', 'the profits the company earns and what investors expect them to become', 'the price at which the shares were first sold', 'which exchange it is listed on'], a: 1,
      why: 'Day to day, prices follow news and mood; over decades they follow what the business earns, because a share is a claim on those earnings.' }
  ],
  applications: ['Buying shares directly, or understanding what an equity fund actually owns.', 'Reading an employee share plan or share options from your employer.', 'Understanding a start-up\'s offer of equity and how later funding rounds dilute it.', 'Voting at a company\'s annual meeting.'],
  sim: 'stk-pe'
},

/* ================================================================ exchanges and IPOs */
{
  id: 'stock-exchanges', parent: 'stock-exchange', title: 'Stock exchanges and IPOs', level: 1,
  short: 'A stock exchange is a regulated marketplace where buyers and sellers of listed shares are matched. Companies raise money when they first sell shares to the public (an IPO); after that, investors trade the shares among themselves.',
  keywords: ['stock exchange', 'IPO', 'initial public offering', 'listing', 'primary market', 'secondary market', 'underwriter', 'book building', 'settlement', 'T+1', 'clearing', 'auction', 'lock-up', 'direct listing', 'trading hours'],
  prereq: ['stocks-shares', 'supply-demand'],
  related: ['bid-ask-liquidity', 'order-types', 'brokers', 'stock-terminology', 'market-indices'],
  body: `
When you buy a share through an app, the order travels in a fraction of a second to an exchange, where a computer finds someone willing to sell at that price and the two orders are matched. You never meet the seller, you never check whether they really own the shares, and you do not worry that they will run off with your money. That trust — among millions of strangers — is what a stock exchange sells.

### Two markets
- In the **primary market** a company sells *new* shares and receives the money: its first sale to the public (an **IPO**, initial public offering) or a later share issue.
- In the **secondary market** investors trade existing shares with each other. The company receives nothing from these trades — but an easy, liquid secondary market is exactly what makes investors willing to buy in the primary one.

Almost everything you see on a trading screen is the secondary market.

### How trading works today
Nearly all trading is electronic. For each share the exchange keeps an **order book**: the buy orders (bids) and sell orders (asks) that are waiting, best prices first. A matching engine pairs them by price, then by time of arrival ([[bid-ask-liquidity]] and [[order-types]] explain the book and the orders). Many exchanges open and close the day with an **auction**: orders are collected for a few minutes and one price is set that matches as many shares as possible, which avoids wild jumps when trading starts and gives a reliable closing price. Hours differ: the main New York exchanges typically trade from 9:30 to 16:00 local time and London from 8:00 to 16:30, while Tokyo pauses for a lunch break. The same share may also trade on alternative venues and in private "dark" pools, so the market for one share is really a network, held together by rules on best execution.

### Settlement: when the shares are really yours
The trade is agreed in milliseconds, but the shares and the cash change hands a little later: **settlement**. In the US it takes one business day (T+1) since 2024; much of Europe was still on two days (T+2) in the mid-2020s, with a move to T+1 planned. In between, a **clearing house** (central counterparty) stands between buyer and seller, so the trade completes even if one side's broker fails, and a central depository records who owns what.

### Listing: what a company gains and gives
To list, a company must meet the exchange's rules — a minimum size, enough shareholders, audited accounts — and then keep disclosing: annual and interim reports, and any news that could move the price, promptly and to everyone at once. Trading on information the public does not have (insider dealing) is a crime in most countries. Listing brings access to capital, a daily price, shares to reward employees and to buy other companies. It costs fees, scrutiny and constant pressure for the next quarter's numbers.

### The IPO
In an IPO, investment banks usually act as **underwriters**: they prepare the prospectus, sound out large investors (book building), recommend the price and allocate the shares. Suppose Larkspur Robotics, owned by its founders and early backers through 80 million shares, sells 20 million new shares at ¤18:

| | |
|---|---:|
| Raised before costs | ¤360 million |
| Underwriting fees, 6 % | ¤21.6 million |
| Received by the company | ¤338.4 million |
| Shares afterwards | 100 million |
| Market value at the offer price | ¤1.8 billion |
| Old owners' stake | 80 % |

If the shares close their first day at ¤23 — a 27.8 % "pop" — the new buyers are delighted, but the company sold 20 million shares ¤5 too cheaply: ¤100 million was "left on the table". Insiders usually agree to a **lock-up**, typically 90 to 180 days without selling; when it ends, extra supply can weigh on the price. Some companies list without raising money (a *direct listing*) or merge into an already listed shell company.

> [!warn] The sellers in an IPO choose the moment and know the company far better than the buyers. Research in many countries has found that newly listed companies, on average, did worse than comparable shares over the following few years. Excitement is not a valuation.
`,
  ideas: [
    'The primary market raises money for companies; the secondary market is investors trading with each other.',
    'An exchange matches orders by price, then time; many open and close with an auction.',
    'Settlement comes after the trade: T+1 in the US, T+2 in much of Europe in the mid-2020s.',
    'Listed companies must disclose price-sensitive news to everyone at once; insider dealing is a crime.',
    'A big first-day jump in an IPO means the company sold its shares cheaply.'
  ],
  pitfalls: [
    'When I buy a share, my money goes to the company — Only in an IPO or a new share issue. Almost every trade is between two investors, and the company receives nothing.',
    'An IPO is a chance to get in early at a bargain — The sellers pick the time and the price, hot issues are allocated mostly to large clients, and newly listed shares have on average lagged the market in the following years.',
    'The exchange vouches for the companies it lists — It enforces rules on disclosure and fair trading; it does not guarantee that any company is a good business or its shares a fair price.'
  ],
  formulas: [
    {
      name: 'Money a company receives in a share sale',
      expr: 'R = n*P*(1 - f)', tex: 'R = n\\,P\\,(1 - f)',
      vars: {
        R: { name: 'money received by the company', q: 'money', unit: '$M' },
        n: { name: 'new shares sold', int: true, value: 20000000 },
        P: { name: 'offer price per share', q: 'money', unit: '$', value: 18 },
        f: { name: 'fees (underwriting and costs)', q: 'ratio', unit: '%', value: 6, min: 0, max: 20 }
      },
      note: 'Only new shares raise money for the company; shares sold by existing owners pay those owners instead.',
      practice: { unknowns: ['R', 'n', 'P'] },
      stories: {
        R: 'A company sells {n} new shares at {P}, and fees take {f}. How much does it receive?',
        P: 'A company needs to receive {R} from selling {n} new shares, and fees take {f}. What must the offer price be?',
        n: 'A company wants {R} after fees of {f}, selling shares at {P}. How many new shares must it sell?'
      }
    },
    {
      name: 'First-day return of an IPO',
      expr: 'u = (P1 - P0)/P0', tex: 'u = \\frac{P_1 - P_0}{P_0}',
      vars: {
        u: { name: 'first-day return ("pop")', q: 'ratio', unit: '%', signed: true },
        P1: { name: 'closing price on the first day', q: 'money', unit: '$', value: 23 },
        P0: { name: 'offer price', q: 'money', unit: '$', value: 18 }
      },
      stories: { u: 'Shares offered at {P0} close their first day of trading at {P1}. What was the first-day return?' }
    },
    {
      name: 'Money left on the table',
      expr: 'L = n*(P1 - P0)', tex: 'L = n\\,(P_1 - P_0)',
      vars: {
        L: { name: 'money left on the table', q: 'money', unit: '$M', signed: true },
        n: { name: 'shares sold in the IPO', int: true, value: 20000000 },
        P1: { name: 'closing price on the first day', q: 'money', unit: '$', value: 23 },
        P0: { name: 'offer price', q: 'money', unit: '$', value: 18 }
      },
      note: 'What the sellers would have received had they sold at the first day\'s closing price instead of the offer price.',
      practice: { unknowns: ['L'] },
      stories: { L: 'A company sells {n} shares at {P0}; they close the first day at {P1}. How much money was left on the table?' }
    }
  ],
  examples: [
    {
      title: 'Larkspur goes public',
      q: 'Larkspur Robotics has 80 million shares and sells 20 million new ones at ¤18, paying 6 % in fees. The shares close the first day at ¤23. Find the money the company receives, its market value at the offer and at the close, and the money left on the table.',
      steps: [
        'Raised: $20\\,000\\,000 \\times ¤18 = ¤360$ million; fees $0.06 \\times 360 = ¤21.6$ million; received ¤338.4 million.',
        'Shares afterwards: 100 million. Market value at ¤18: ¤1.8 billion; at ¤23: ¤2.3 billion.',
        'First-day return: $(23 - 18)/18 = 0.278$, or 27.8 %.',
        'Left on the table: $20\\,000\\,000 \\times (23 - 18) = ¤100$ million — money the company would have raised at the price the market was willing to pay.'
      ],
      a: '¤338.4 million received; ¤1.8 billion at the offer, ¤2.3 billion at the close; ¤100 million left on the table.'
    }
  ],
  quiz: [
    { q: 'You buy 100 shares of a listed company from another investor on the exchange. The company receives…', choices: ['the full price you paid', 'nothing', 'the broker\'s commission', 'this year\'s dividend on those shares'], a: 1,
      why: 'This is a secondary-market trade: the money goes to the investor who sold. The company raised its money when the shares were first issued.' },
    { q: 'A 30 % jump on the first day of trading shows that the IPO was a great success for the company selling the shares.', a: false,
      why: 'It shows that buyers valued the shares well above the offer price: the company sold them too cheaply and raised less than it could have.' },
    { q: 'A company sells 10 million new shares at ¤12 and pays 5 % in fees. How much does it receive, in millions?', answer: 114, unit: '$M',
      why: '10,000,000 × ¤12 = ¤120 million, minus 5 % (¤6 million) leaves ¤114 million.' },
    { q: 'What does settlement at T+1 mean?', choices: ['the trade can be cancelled for one day', 'the shares and the cash change hands one business day after the trade', 'you must hold the shares for at least a day', 'the price is fixed the next day'], a: 1,
      why: 'The price is agreed when the orders match; the transfer of ownership and money is completed one business day later.' },
    { q: 'Why do many exchanges open and close with an auction?', choices: ['so that the exchange can choose the price', 'to gather many orders and set one price that matches as many shares as possible, avoiding jumps at the open and giving a reliable close', 'to keep small investors out', 'because the computers are switched off overnight'], a: 1,
      why: 'Overnight news piles up orders. Collecting them and crossing them at a single price is fairer and steadier than letting the first few orders set wild prices.' }
  ],
  applications: ['Knowing that a sale settles a day or two later, before you plan to use the cash.', 'Reading news of an IPO: what is raised, who is selling, the lock-up.', 'Understanding an employer\'s listing and what it means for employee shares.', 'Recognising that "the market" for a share is many venues bound by the same rules.'],
  history: 'The Dutch East India Company, founded in 1602, sold shares that anyone could buy and that were traded in Amsterdam — often called the first modern stock market. In London, share dealers met in coffee houses in the 1690s, and in New York 24 brokers signed the Buttonwood Agreement in 1792, the seed of the New York Stock Exchange. Trading floors with shouting brokers gave way to computers from the 1970s to the 2000s.',
  sim: 'stk-order-book'
},

/* ================================================================ glossary */
{
  id: 'stock-terminology', parent: 'stock-exchange', title: 'Stock market terminology', level: 1,
  short: 'The words of the stock market, each explained in plain language with a small example: market capitalisation, float, volume, bid and ask, the 52-week range, blue chips, dividends and the ex-dividend date, splits, buybacks, rights issues, market makers, circuit breakers, volatility, beta and more.',
  keywords: ['glossary', 'terminology', 'jargon', 'market capitalisation', 'market cap', 'volume', 'float', 'free float', 'ticker', 'blue chip', 'penny stock', 'ex-dividend', 'stock split', 'reverse split', 'buyback', 'rights issue', 'market maker', 'circuit breaker', 'pre-market', 'after-hours', 'volatility', 'beta', '52-week range', 'short interest', 'days to cover', 'OHLC', 'candlestick', 'round lot', 'tick size'],
  prereq: ['stocks-shares', 'stock-exchanges'],
  related: ['bid-ask-liquidity', 'order-types', 'market-indices', 'dividends', 'pe-ratio', 'short-selling', 'volatility', 'capm-beta'],
  body: `
Market jargon exists mostly to save time between professionals, and it has an unfortunate side effect: it makes everyone else feel shut out. Every one of these words stands for a simple idea. The tables below explain the essential ones with a small number each; the linked pages go deeper. Company names and figures are illustrative.

### The company and its shares
| Term | In plain words | A number to make it concrete |
|---|---|---|
| **Share, stock, equity** | An equal slice of ownership of a company ([[stocks-shares]]). | One share of a company with 500 million shares is one five-hundred-millionth of it. |
| **Ticker** | The short code a listed share trades under. | A company called Harbour Lights might trade as HBL. |
| **Shares outstanding** | All the shares held by investors (not those the company has bought back and holds itself). | 500 million. |
| **Market capitalisation** | The market's price tag for the whole company: price × shares outstanding. | 500 million × ¤40 = ¤20 billion. |
| **Free float** | The shares that can actually be traded, leaving out blocks held by founders, governments or other long-term owners. Index weights often use it. | 350 of 500 million shares = a 70 % float. |
| **Large, mid, small cap** | Size classes by market capitalisation; the boundaries differ by country and index provider. | A large cap is among the biggest companies of its market; a small cap may be worth a few hundred million. |
| **Blue chip** | A large, long-established company with a record of steady profits (and often dividends). | Worth tens of billions, profitable for decades — still not risk-free. |
| **Penny stock** | A share trading at a very low price, usually of a small, thinly traded company; in the US the regulatory line is five dollars a share. | Bid ¤0.19, ask ¤0.21: the spread alone is 10 % of the price. |
| **Book value** | Assets minus liabilities in the accounts ([[financial-statements]]); per share, it is compared with the price. | ¤6 billion ÷ 500 million shares = ¤12; at ¤40 the price-to-book ratio is 3.3. |
| **EPS, P/E** | Profit per share, and the price as a multiple of it ([[earnings-eps]], [[pe-ratio]]). | ¤1.25 billion ÷ 500 million shares = ¤2.50; at ¤40, P/E = 16. |

### Prices and trading
| Term | In plain words | A number to make it concrete |
|---|---|---|
| **Bid, ask, spread** | The best price a buyer will pay now, the best price a seller will accept, and the gap between them ([[bid-ask-liquidity]]). | Bid ¤39.98, ask ¤40.02: spread ¤0.04, 0.1 % of the price. |
| **Last price** | The price of the most recent trade — not necessarily what you can trade at next. | Last ¤40.00 while the bid is ¤39.98. |
| **Open, high, low, close** | The first, highest, lowest and last prices of a day; a **candlestick** draws all four. | Open ¤39.50, high ¤40.60, low ¤39.20, close ¤40.00: a rising candle. |
| **Volume** | How many shares changed hands. Every share bought was sold by someone. | 3.2 million today against a 2-million average: 1.6 × normal, worth ¤128 million. |
| **52-week range** | The lowest and highest prices of the past year. | ¤31.20 – ¤48.90; at ¤44 the share is 72 % of the way up, 10 % below its high. |
| **Tick size** | The smallest price step allowed. | One cent for most US shares; in Europe it depends on the price and how actively the share trades. |
| **Lot** | The usual trading unit. | Traditionally 100 shares in the US; Japanese shares trade in units of 100. Many brokers now sell fractions. |
| **Market, limit, stop orders** | Trade now at the going price; trade only at your price or better; trade once a trigger price is touched ([[order-types]]). | A buy limit at ¤39.90 waits until someone will sell that low. |
| **Market maker** | A firm that continuously quotes both a bid and an ask, earning the spread and taking the risk of holding shares. | Quotes ¤24.98 / ¤25.02 for 1,000 shares: buying and selling 1,000 earns ¤40 before costs. |
| **Pre-market, after-hours** | Trading outside the main session, with fewer participants and wider spreads. | In the US, typically from 4:00 to 9:30 and from 16:00 to 20:00 New York time. |
| **Settlement (T+1)** | When shares and cash actually change hands ([[stock-exchanges]]). | Sold on Monday, cash settled on Tuesday. |
| **Circuit breaker, trading halt** | An automatic pause when prices fall too fast, to let people think. | US: a 7 % or 13 % fall in the broad index halts all trading for 15 minutes, 20 % closes it for the day — from 4,000, that is 3,720, 3,480 and 3,200. |
| **Price limits** | A maximum daily move for a single share. | ±10 % a day for most main-board shares in mainland China. |
| **Index, ETF** | A number that tracks a basket of shares; a fund that trades like a share ([[market-indices]], [[mutual-funds-etfs]]). | An index up 1 % means its basket, weighted its way, rose 1 %. |

### Company events (corporate actions)
| Term | In plain words | A number to make it concrete |
|---|---|---|
| **Dividend** | Cash paid to shareholders out of profits ([[dividends]]). | ¤2 a year on a ¤50 share: a 4 % dividend yield. |
| **Ex-dividend date** | The first day a buyer no longer receives the dividend just declared; the price typically drops by about the dividend. | ¤50 share, ¤0.50 dividend: it opens near ¤49.50. |
| **Record and payment dates** | Who is on the register on the record date gets paid on the payment date. | Record date Wednesday, cash some days or weeks later. |
| **Stock split** | More, smaller slices; nothing of value changes. | 2-for-1: 100 shares at ¤300 become 200 at ¤150, still ¤30,000. |
| **Reverse split** | Fewer, bigger slices, often to lift a very low price. | 1-for-10: 1,000 shares at ¤0.50 become 100 at ¤5. |
| **Buyback** | The company buys its own shares, so each remaining share owns more. | Profit ¤200 million, shares cut from 100 to 95 million: EPS rises from ¤2.00 to ¤2.11 (+5.3 %). |
| **Rights issue** | New shares offered to existing owners at a discount, in proportion to what they hold. | 1 new for every 4 held at ¤8 when the price is ¤10: afterwards about (4 × 10 + 8)/5 = ¤9.60. |
| **Takeover premium** | What a bidder pays above the market price to win control. | A bid of ¤13 for a share trading at ¤10: a 30 % premium. |
| **IPO, delisting** | A company's first sale of shares to the public; its removal from the exchange. | See [[stock-exchanges]]. |

### Risk and mood
| Term | In plain words | A number to make it concrete |
|---|---|---|
| **Volatility** | How much the price typically swings, as a yearly standard deviation of returns ([[volatility]]). | 20 % a year is about 1.26 % on a typical day. |
| **Beta** | How strongly a share has tended to move with the whole market ([[capm-beta]]). | Beta 1.3: when the market fell 10 %, the share tended to fall about 13 %. |
| **Bull, bear, correction** | A rising market; a fall of 20 % or more from a peak; a fall of 10 % or more ([[bull-bear-markets]]). | From 100 to 90 is a correction, to 80 a bear market. |
| **Long, short** | Owning a share; having sold borrowed shares to buy back later ([[short-selling]]). | Short 100 at ¤50, buy back at ¤40: +¤1,000 before costs. |
| **Short interest, days to cover** | Shares currently sold short; that number divided by average daily volume. | 28 million short, 3.5 million traded a day: 8 days to cover; 8 % of the float. |
| **Margin** | Buying with money borrowed from the broker ([[margin-trading]]). | ¤10,000 of shares bought with ¤5,000 of your own. |
| **Earnings season, consensus, guidance** | The weeks when companies report; the average of analysts' forecasts; the company's own forecast. | Consensus EPS ¤1.90, reported ¤1.95: a 2.6 % "beat". |

> [!tip] When a word on a financial page puzzles you, ask two questions: *is this about the company, or about trading its shares?* and *does it change what the business earns, or only how it is sliced?* A split, for example, only slices; a buyback slices with the company's cash.
`,
  ideas: [
    'Market capitalisation — price times shares — is the size of a company; the price of one share is not.',
    'Volume measures activity, not direction: every share bought is a share sold.',
    'Splits and reverse splits change the number of slices, not the value of the company.',
    'Buybacks and rights issues do change the slices: one with the company\'s cash, one with new money from shareholders.',
    'Volatility and beta describe how much, and how much with the market, a price tends to move.'
  ],
  pitfalls: [
    'A high share price means a big company — Size is market capitalisation. A ¤500 share of a company with 10 million shares (¤5 billion) is a smaller company than a ¤20 share with a billion shares (¤20 billion).',
    'A stock split makes shareholders richer — It cuts the same cake into more slices; the value of what you hold is unchanged.',
    'Heavy volume means the price is about to rise — Every trade has a buyer and a seller; volume says how many shares changed hands, not which side was right.'
  ],
  formulas: [
    {
      name: 'Market capitalisation',
      expr: 'MC = P*N', tex: '\\mathrm{MC} = P\\,N',
      vars: {
        MC: { name: 'market capitalisation', q: 'money', unit: '$bn' },
        P: { name: 'share price', q: 'money', unit: '$', value: 40 },
        N: { name: 'shares outstanding', int: true, value: 500000000 }
      },
      note: 'The market\'s valuation of the shares. Add the company\'s net debt to get enterprise value, the price of the whole business.',
      practice: { unknowns: ['MC', 'P'] },
      stories: {
        MC: 'A company has {N} shares, trading at {P}. What is its market capitalisation?',
        P: 'A company with {N} shares is valued by the market at {MC}. What is the price of one share?'
      }
    },
    {
      name: 'Where the price sits in its 52-week range',
      expr: 'x = (P - L)/(H - L)', tex: 'x = \\frac{P - L}{H - L}',
      vars: {
        x: { name: 'position in the range (0 = at the low, 100 % = at the high)', q: 'ratio', unit: '%' },
        P: { name: 'price now', q: 'money', unit: '$', value: 44 },
        L: { name: '52-week low', q: 'money', unit: '$', value: 31.2 },
        H: { name: '52-week high', q: 'money', unit: '$', value: 48.9 }
      },
      note: 'A description of the past year, not a forecast: a share near its high can go higher, and one near its low can go lower.',
      practice: { unknowns: ['x', 'P'] },
      stories: {
        x: 'Over the past year a share traded between {L} and {H}. It is now at {P}. How far up its 52-week range is it?',
        P: 'A share\'s 52-week range is {L} to {H}. At what price is it {x} of the way up the range?'
      }
    },
    {
      name: 'Days to cover',
      expr: 'd = S/V', tex: 'd = \\frac{S}{V}',
      vars: {
        d: { name: 'days to cover (trading days)' },
        S: { name: 'shares sold short', int: true, value: 28000000 },
        V: { name: 'average daily volume (shares)', int: true, value: 3500000 }
      },
      note: 'How many days of normal trading it would take for every short seller to buy back. A high number is one ingredient of a short squeeze.',
      practice: { unknowns: ['d'] },
      stories: { d: '{S} shares of a company have been sold short, and on average {V} shares trade each day. How many days to cover?' }
    },
    {
      name: 'A typical day\'s move from the yearly volatility',
      expr: 'sd = sa/sqrt(n)', tex: 's_d = \\frac{s_a}{\\sqrt{n}}',
      vars: {
        sd: { name: 'typical daily move (one standard deviation)', q: 'ratio', unit: '%' },
        sa: { name: 'yearly volatility', q: 'ratio', unit: '%', value: 20 },
        n: { name: 'trading days in a year', int: true, value: 252, fixed: true }
      },
      note: 'Random swings add up like a random walk, so they grow with the square root of time. About two days in three stay within one daily standard deviation.',
      practice: { unknowns: ['sd', 'sa'] },
      stories: {
        sd: 'A share has a yearly volatility of {sa}. With {n} trading days a year, how big is a typical daily move?',
        sa: 'A share typically moves {sd} a day. With {n} trading days a year, what is its yearly volatility?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a quote line',
      q: 'A quote page shows: Harbour Lights (HBL) ¤44.00, up ¤0.35 from yesterday\'s close of ¤43.65; volume 3.2 million (average 2.0 million); 52-week range ¤31.20 – ¤48.90; 500 million shares; EPS ¤2.50; dividend ¤1.32 a year. Translate it.',
      steps: [
        'Change: $0.35/43.65 = 0.008$, so the share is up 0.8 % today.',
        'Volume is $3.2/2.0 = 1.6$ times its average: busier than usual — which says nothing about tomorrow\'s direction.',
        'Market capitalisation: $500\\,000\\,000 \\times ¤44 = ¤22$ billion.',
        'P/E: $44/2.50 = 17.6$; dividend yield $1.32/44 = 3.0$ %.',
        'Range: $(44 - 31.20)/(48.90 - 31.20) = 0.72$ — 72 % of the way from the low to the high, and $44/48.90 - 1 = -10$ % below the high.'
      ],
      a: 'A ¤22 billion company, up 0.8 % on busy trading, priced at 17.6 times earnings with a 3 % yield, 10 % below its high of the year.'
    }
  ],
  quiz: [
    { q: 'A company does a 3-for-1 split. You held 100 shares at ¤90. Afterwards you hold…', choices: ['100 shares at ¤30', '300 shares at ¤30', '300 shares at ¤90', '33 shares at ¤270'], a: 1,
      why: 'Each share becomes three, and the price is divided by three: 300 × ¤30 = ¤9,000, exactly what 100 × ¤90 was.' },
    { q: 'A company has 250 million shares trading at ¤18. What is its market capitalisation, in billions?', answer: 4.5, unit: '$bn',
      why: '250,000,000 × ¤18 = ¤4.5 billion.' },
    { q: 'A share priced at ¤2 is cheaper, in the sense that matters to an investor, than a share priced at ¤200.', a: false,
      why: 'What matters is what you get for the price: the profits, assets and growth behind each share. A ¤200 share at 12 times earnings can be far cheaper than a ¤2 share at 80 times earnings — or at no earnings at all.' },
    { q: 'You buy a share on its ex-dividend date. Do you receive the dividend that was just declared?', choices: ['yes, always', 'no — it goes to whoever owned the share before that date', 'only if you still hold it on the payment date', 'you receive half of it'], a: 1,
      why: 'From the ex-dividend date the share trades without the right to that dividend, which is why its price typically drops by about the dividend that morning.' },
    { q: '28 million shares of a company are sold short, and 4 million shares trade on an average day. How many days to cover?', answer: 7,
      why: '28 million ÷ 4 million a day = 7 trading days of normal volume for all the shorts to buy back.' }
  ],
  applications: ['Reading a quote page, a company announcement or the market news without the jargon getting in the way.', 'Recognising which events change a company\'s value (profits, buybacks, new shares) and which only change the slicing (splits).', 'Understanding why trading can halt on a very bad day.', 'Comparing companies by market capitalisation rather than by share price.'],
  sim: 'stk-chart'
},

/* ================================================================ bid, ask, spread */
{
  id: 'bid-ask-liquidity', parent: 'stock-exchange', title: 'Bid, ask, spread and liquidity', level: 2,
  short: 'At any moment a share has two prices: the bid, the most a buyer will pay, and the ask, the least a seller will accept. The gap — the spread — is a cost on every round trip, and how much can trade near those prices is the share\'s liquidity.',
  keywords: ['bid', 'ask', 'offer', 'spread', 'bid-ask spread', 'liquidity', 'order book', 'depth', 'market impact', 'slippage', 'market maker', 'mid price', 'illiquid', 'basis points'],
  prereq: ['stock-exchanges', 'stock-terminology'],
  related: ['order-types', 'brokers', 'investment-fees', 'short-selling', 'financial-crises'],
  body: `
At an airport currency booth the board shows two prices: the booth *buys* foreign notes from you at 0.85 and *sells* them to you at 0.95. Change money and change it straight back, and you have lost about 11 % without anything happening in the world. Shares work the same way, only with much smaller gaps.

### Two prices, not one
- The **bid** is the highest price someone is currently willing to pay. It is what you get if you sell *now*.
- The **ask** (or offer) is the lowest price someone is currently willing to accept. It is what you pay if you buy *now*.
- The **spread** is the difference, and the **mid price** is halfway between.

For a large, heavily traded share the quote might be bid ¤49.99, ask ¤50.01: a spread of ¤0.02, or 0.04 % of the price. Buying and immediately selling ¤10,000 of it (200 shares) costs ¤4. For a small company quoted at bid ¤4.80, ask ¤5.00 the spread is ¤0.20, or 4.1 % of the ¤4.90 mid — and the same ¤10,000 round trip costs ¤400. The spread never appears on your statement as a fee; it is hidden in the prices you traded at.

$$s = \\frac{A - B}{(A + B)/2}$$

### The order book and its depth
The quote shows only the best bid and ask. Behind them the exchange's **order book** lists more orders at worse prices, and the quantities at each level are the book's **depth**. Suppose the sell side reads:

| Ask price | Shares offered | Cumulative |
|---:|---:|---:|
| ¤50.01 | 500 | 500 |
| ¤50.02 | 800 | 1,300 |
| ¤50.04 | 1,200 | 2,500 |
| ¤50.06 | 2,000 | 4,500 |

A market order to buy 3,000 shares takes all 500 at ¤50.01, all 800 at ¤50.02, all 1,200 at ¤50.04 and 500 of the 2,000 at ¤50.06: ¤150,099 in all, an average of ¤50.033. The order "walked the book": it paid ¤69 more than 3,000 shares at the best ask would have cost, and ¤99 more than the mid price. That extra is **market impact**, and for large investors it matters more than any commission. Afterwards the best ask is ¤50.06 — the order moved the price.

### What liquidity means
A share is **liquid** when you can trade a meaningful amount quickly, near the current price, and the book refills soon after. Spread, depth, volume and that resilience are all aspects of it. Liquidity comes from people willing to take the other side — including **market makers**, firms that quote both sides all day, earn the spread and carry the risk that the price moves against the shares they hold.

> [!warn] Liquidity is least available exactly when it is most wanted. In a panic, market makers widen their quotes or step back, and spreads that were a few hundredths of a per cent can become several per cent. It happened across markets in October 1987, in late 2008 and in March 2020.

### Why a small spread still matters
One round trip costs about the relative spread. Trading often multiplies it: 50 round trips a year in shares with a 0.2 % spread cost about 10 % of the money traded, every year, before any commission — a hurdle few strategies clear. For someone who buys a diversified fund and holds it for years, the spread is a small one-off cost; for a frequent trader it can be the largest cost of all.

> [!tip] You do not have to accept the far side of the spread: a [[order-types|limit order]] lets you name your price and wait — at the risk of not trading at all. Try both in the simulation below.
`,
  ideas: [
    'You buy at the ask and sell at the bid; the difference, the spread, is a cost on every round trip.',
    'The order book shows depth: how many shares wait at each price beyond the best one.',
    'A large market order walks the book and pays more than the quoted ask — that is market impact.',
    'Liquidity is the ability to trade size quickly near the current price; it shrinks in a panic.',
    'Frequent trading multiplies the spread cost.'
  ],
  pitfalls: [
    'The price on the screen is the price I will get — The last price is only the latest trade. You buy at the ask, sell at the bid, and a large order may go deeper into the book.',
    '"Commission-free" means trading is free — The spread is paid on every trade even though it never appears as a fee, and a broker may be paid for sending your orders to a particular market maker.',
    'A share that trades heavily today will be easy to sell in a crisis — Liquidity can disappear exactly when everyone wants out at once.'
  ],
  formulas: [
    {
      name: 'Relative spread',
      expr: 's = (A - B)/((A + B)/2)', tex: 's = \\frac{A - B}{(A + B)/2}',
      vars: {
        s: { name: 'spread as a fraction of the mid price', q: 'ratio', unit: '%' },
        A: { name: 'ask (best price to buy)', q: 'money', unit: '$', value: 5 },
        B: { name: 'bid (best price to sell)', q: 'money', unit: '$', value: 4.8 }
      },
      note: 'Roughly the cost of buying and selling straight back. Large, busy shares: a few hundredths of a per cent; small ones: whole per cents.',
      practice: { unknowns: ['s', 'A'] },
      stories: {
        s: 'A share is quoted at a bid of {B} and an ask of {A}. What is the spread as a fraction of the mid price?',
        A: 'A share\'s bid is {B} and its relative spread is {s}. What is the ask?'
      }
    },
    {
      name: 'Cost of the spread on a round trip',
      expr: 'C = n*(A - B)', tex: 'C = n\\,(A - B)',
      vars: {
        C: { name: 'cost of buying and selling back', q: 'money', unit: '$' },
        n: { name: 'shares traded', int: true, value: 2000 },
        A: { name: 'ask', q: 'money', unit: '$', value: 5 },
        B: { name: 'bid', q: 'money', unit: '$', value: 4.8 }
      },
      note: 'Assuming the quote does not move and the order is small enough to trade at the best prices.',
      practice: { unknowns: ['C'] },
      stories: { C: 'You buy {n} shares at the ask of {A} and sell them straight back at the bid of {B}. What did the round trip cost?' }
    },
    {
      name: 'Yearly spread cost of frequent trading',
      expr: 'D = k*s', tex: 'D = k\\,s',
      vars: {
        D: { name: 'spread cost per year, as a share of the money traded', q: 'ratio', unit: '%' },
        k: { name: 'round trips a year', int: true, value: 50 },
        s: { name: 'relative spread', q: 'ratio', unit: '%', value: 0.2 }
      },
      note: 'A simple approximation: each round trip costs about one spread. Commissions and market impact come on top.',
      practice: { unknowns: ['D', 'k'] },
      stories: {
        D: 'A trader buys and sells {k} times a year in shares whose spread is {s}. About how much of the money traded does the spread cost each year?',
        k: 'With a spread of {s}, how many round trips a year would cost {D} of the money traded?'
      }
    }
  ],
  examples: [
    {
      title: 'The same ¤10,000 in two shares',
      q: 'You buy ¤10,000 of a large share quoted ¤49.99 / ¤50.01 and, separately, ¤10,000 of a small share quoted ¤4.80 / ¤5.00. If you sold both straight back, what would each round trip cost?',
      steps: [
        'Large share: ¤10,000 buys 200 shares at ¤50.01 (about ¤10,002). Selling at ¤49.99 loses $200 \\times 0.02 = ¤4$, or 0.04 %.',
        'Small share: ¤10,000 buys 2,000 shares at ¤5.00. Selling at ¤4.80 loses $2\\,000 \\times 0.20 = ¤400$, or 4 %.',
        'The small share must rise 4 % just for you to break even — before any commission.'
      ],
      a: '¤4 against ¤400: the spread of a thinly traded share can cost a hundred times more.'
    },
    {
      title: 'A market order walks the book',
      q: 'The asks are 500 shares at ¤50.01, 800 at ¤50.02, 1,200 at ¤50.04 and 2,000 at ¤50.06, with the mid price at ¤50.00. You send a market order to buy 3,000 shares. What do you pay?',
      steps: [
        '500 × ¤50.01 = ¤25,005; 800 × ¤50.02 = ¤40,016; 1,200 × ¤50.04 = ¤60,048. That is 2,500 shares.',
        'The last 500 come from the ¤50.06 level: ¤25,030.',
        'Total ¤150,099, average $150\\,099/3\\,000 = ¤50.033$.',
        'Compared with 3,000 at the best ask (¤150,030) the order paid ¤69 more; compared with the mid price, ¤99 more.'
      ],
      a: 'An average of ¤50.033 a share: ¤99 of market impact and spread on a ¤150,000 purchase.'
    }
  ],
  quiz: [
    { q: 'A share is quoted at a bid of ¤19.95 and an ask of ¤20.05. What is the spread as a percentage of the mid price?', answer: 0.5, unit: '%',
      why: 'The spread is ¤0.10 and the mid price ¤20.00; 0.10/20 = 0.5 %.' },
    { q: 'You send a market order to sell 100 shares. At what price will you usually trade?', choices: ['the ask', 'the bid', 'the mid price', 'the last traded price'], a: 1,
      why: 'A seller who wants to trade immediately must accept the best price a buyer is offering: the bid.' },
    { q: 'If a share\'s spread is ¤0.02, a market order of any size will cost at most ¤0.02 a share more than the bid.', a: false,
      why: 'Only the shares available at the best ask trade there. A larger order walks up the book to worse prices.' },
    { q: 'In a market panic, what usually happens to spreads?', choices: ['they narrow, because more people are trading', 'they widen, because market makers face more risk and fewer investors want to take the other side', 'they are frozen by the exchange', 'they disappear'], a: 1,
      why: 'Quoting a tight price is risky when prices jump; market makers protect themselves by widening their quotes or stepping back.' },
    { q: 'You buy 500 shares at the ask of ¤20.05 and sell them straight back at the bid of ¤19.95. What did the round trip cost?', answer: 50, unit: '$',
      why: '500 × (20.05 − 19.95) = 500 × ¤0.10 = ¤50, before any commission.' }
  ],
  applications: ['Choosing between a market and a limit order, especially in thinly traded shares or funds.', 'Counting the true cost of frequent trading.', 'Understanding why large investors split big orders into many small ones.', 'Recognising that an ETF or fund also has a spread.'],
  sim: 'stk-order-book'
},

/* ================================================================ orders */
{
  id: 'order-types', parent: 'stock-exchange', title: 'Order types', level: 1,
  short: 'A market order trades now at whatever price is available; a limit order trades only at your price or better; a stop order waits for a trigger price and then becomes a market order. Each fixes one thing and leaves another to chance.',
  keywords: ['market order', 'limit order', 'stop order', 'stop-loss', 'stop-limit', 'trailing stop', 'good till cancelled', 'GTC', 'day order', 'immediate or cancel', 'fill or kill', 'gap', 'slippage', 'time in force', 'partial fill'],
  prereq: ['bid-ask-liquidity', 'stock-exchanges'],
  related: ['brokers', 'stock-terminology', 'margin-calls', 'loss-aversion'],
  body: `
Telling a broker "buy me 300 shares" leaves one important question open: at what price? Order types are the ways of answering it. Each one lets you fix one thing — that you trade, or the price you trade at, or the moment you act — and leaves something else to chance.

| Order | What you fix | What you risk |
|---|---|---|
| **Market** | that it trades, now | the price, especially in thin markets or at the open |
| **Limit** | the worst price you accept | not trading at all |
| **Stop (stop-loss)** | a trigger price | the price you actually get once it triggers |
| **Stop-limit** | a trigger and a worst price | not selling at all in a fast fall |
| **Trailing stop** | a distance below the highest price | the same as a stop |

### Market orders
A market order buys at the best ask (or sells at the best bid) and walks further into the book if it is large ([[bid-ask-liquidity]]). In a busy share with a tight spread that is fine. In a thinly traded share, in the first minutes after the open, or pre-market, it can fill well away from the price you last saw.

### Limit orders
A buy limit at ¤49.90 when the ask is ¤50.01 does not trade: it joins the book as a bid and waits until a seller accepts ¤49.90 or less. It may fill in a minute, partly, or never — if the price rises, you are left out. Orders at the same price queue in time order, so arriving early matters. If it does fill on 300 shares, it saved $300 \\times 0.11 = ¤33$ against buying at the ask. A limit order *above* the ask (a "marketable" limit) trades at once but never above your limit — a useful guard against a typo or a sudden jump.

### Stop orders and the gap
A **stop-loss** sits outside the book until the price touches the trigger, then becomes a market order. Suppose you bought 200 shares at ¤48 and placed a stop at ¤45: the loss you planned for is $200 \\times (48 - 45) = ¤600$. Overnight the company warns on profits, and the share opens at ¤38. The stop triggers — and fills at about ¤38. The loss is ¤2,000, not ¤600: the price **gapped** through the stop, and ¤1,400 of it is gap slippage. A **stop-limit** (trigger ¤45, limit ¤44.50) would not have sold at ¤38 at all; you would still own the shares. Neither is better in general: one gives certainty of selling, the other certainty of the price.

A **trailing stop** follows the price up. With a 10 % trail, a share bought at ¤50 that climbs to ¤64 has its stop raised to ¤57.60; if it then falls and the stop fills near there, 200 shares still gain about ¤1,520. It never moves down.

### Time in force
Orders also say how long they live: a **day** order expires at the close; **good-till-cancelled** stays open until filled or cancelled (brokers often cancel them after a set period, such as a few months); **immediate-or-cancel** takes what is available now and cancels the rest; **fill-or-kill** trades everything at once or nothing. Some orders target the opening or closing auction.

> [!tip] Before sending any order, read it back: side (buy or sell), quantity, type, price and duration. An extra zero in the quantity is the most expensive typing mistake there is, and a limit price is a cheap insurance against it.
`,
  ideas: [
    'A market order fixes that you trade; a limit order fixes the price; you cannot fix both.',
    'A limit order waits in the book, queued behind earlier orders at the same price, and may never fill.',
    'A stop order becomes a market order once triggered; after a gap it can fill far below the stop.',
    'A stop-limit protects the price but may not sell at all.',
    'Time-in-force instructions decide how long an order lives.'
  ],
  pitfalls: [
    'A stop-loss guarantees my maximum loss — Once triggered it is a market order; after an overnight gap or in a fast market it can fill far below the stop price.',
    'Limit orders are always better — They protect the price but may never fill; a limit chasing a rising price can leave you out entirely.',
    'An order left "good till cancelled" will wait for ever — Brokers commonly cancel such orders after a set period, and corporate events such as splits may cancel or adjust them.'
  ],
  formulas: [
    {
      name: 'Planned loss at a stop',
      expr: 'L = n*(P0 - S)', tex: 'L = n\\,(P_0 - S)',
      vars: {
        L: { name: 'loss if the stop fills at its price', q: 'money', unit: '$' },
        n: { name: 'shares held', int: true, value: 200 },
        P0: { name: 'price paid', q: 'money', unit: '$', value: 48 },
        S: { name: 'stop price', q: 'money', unit: '$', value: 45 }
      },
      note: 'The loss you plan for. The loss you get can be larger if the price gaps through the stop.',
      practice: { unknowns: ['L', 'S'] },
      stories: {
        L: 'You bought {n} shares at {P0} and set a stop-loss at {S}. If it fills at the stop price, how much do you lose?',
        S: 'You hold {n} shares bought at {P0} and want to risk no more than {L}. Where would you place the stop?'
      }
    },
    {
      name: 'Level of a trailing stop',
      expr: 'S = M*(1 - p)', tex: 'S = M\\,(1 - p)',
      vars: {
        S: { name: 'trailing stop price', q: 'money', unit: '$' },
        M: { name: 'highest price since you bought', q: 'money', unit: '$', value: 64 },
        p: { name: 'trail distance', q: 'ratio', unit: '%', value: 10, min: 0, max: 99 }
      },
      stories: { S: 'A share peaked at {M} after you bought it. Your trailing stop is {p} below the highest price. Where is the stop now?' }
    },
    {
      name: 'Extra loss when the price gaps through a stop',
      expr: 'G = n*(S - Pf)', tex: 'G = n\\,(S - P_f)',
      vars: {
        G: { name: 'gap slippage (loss beyond the plan)', q: 'money', unit: '$' },
        n: { name: 'shares sold', int: true, value: 200 },
        S: { name: 'stop price', q: 'money', unit: '$', value: 45 },
        Pf: { name: 'price actually received', q: 'money', unit: '$', value: 38 }
      },
      practice: { unknowns: ['G', 'Pf'] },
      stories: {
        G: 'Your stop at {S} on {n} shares triggers at the open, and the shares sell at {Pf}. How much more did you lose than planned?',
        Pf: 'Your stop at {S} on {n} shares cost you {G} more than planned. At what price did the shares sell?'
      }
    }
  ],
  examples: [
    {
      title: 'A stop-loss meets a gap',
      q: 'You bought 200 shares at ¤48 and placed a stop-loss at ¤45. After a profit warning overnight, the share opens at ¤38. What happens, and what does it cost compared with your plan?',
      steps: [
        'Planned loss: $200 \\times (48 - 45) = ¤600$.',
        'The opening price ¤38 is below the stop, so the stop triggers and becomes a market order, which fills near ¤38.',
        'Actual loss: $200 \\times (48 - 38) = ¤2{,}000$; gap slippage $200 \\times (45 - 38) = ¤1{,}400$.',
        'With a stop-limit at ¤45 / ¤44.50 the order would not have filled: no loss realised, but you would still hold a share now at ¤38.'
      ],
      a: 'The stop sells at about ¤38: a ¤2,000 loss instead of the ¤600 planned.'
    },
    {
      title: 'A trailing stop follows the price',
      q: 'You buy 200 shares at ¤50 with a 10 % trailing stop. The share climbs to ¤64 and then falls back. Where does the stop sit, and what is the result if it fills at that price?',
      steps: [
        'The stop trails the highest price: $64 \\times (1 - 0.10) = ¤57.60$.',
        'Gain if it fills there: $200 \\times (57.60 - 50) = ¤1{,}520$.',
        'Had the share risen straight to ¤64 and kept going, the stop would simply have kept rising behind it.'
      ],
      a: 'The stop is at ¤57.60, locking in about ¤1,520 if it fills there — a gap could still make it less.'
    }
  ],
  quiz: [
    { q: 'You must be certain to buy today, whatever the price. Which order do you use?', choices: ['a limit order below the bid', 'a market order', 'a stop order above the price', 'a fill-or-kill limit at yesterday\'s close'], a: 1,
      why: 'Only a market order guarantees execution (in a normal market); every limit or stop leaves the chance of not trading.' },
    { q: 'The ask is ¤50.01 and you place a buy limit order at ¤49.90. What happens?', choices: ['it trades at once at ¤50.01', 'it waits in the book until someone will sell at ¤49.90 or less, and may never trade', 'it trades at once at ¤49.90', 'the exchange rejects it'], a: 1,
      why: 'A limit below the ask becomes a bid in the book; it trades only if sellers come down to it.' },
    { q: 'A stop-loss order at ¤45 guarantees that you will not sell below ¤45.', a: false,
      why: 'Once triggered it is a market order. If the price jumps from above ¤45 to ¤38, it sells at about ¤38.' },
    { q: 'Your trailing stop is 15 % below the highest price since you bought. The share peaked at ¤80. At what price does the stop trigger?', answer: 68, unit: '$',
      why: '¤80 × (1 − 0.15) = ¤68.' },
    { q: 'Why can a market order sent before the market opens be risky?', choices: ['it is always rejected', 'it is executed at the open, which can be far from yesterday\'s close after overnight news', 'it pays a double commission', 'it cannot be cancelled'], a: 1,
      why: 'Overnight news moves the opening price; a market order accepts whatever it turns out to be.' }
  ],
  applications: ['Buying a thinly traded share or fund without paying a surprise price.', 'Deciding in advance, calmly, at what price you would sell.', 'Understanding why a stop did not protect as expected after bad news.', 'Guarding against typing mistakes with a limit price.'],
  sim: { id: 'stk-order-book', params: { type: 'limit' } }
},

/* ================================================================ indices */
{
  id: 'market-indices', parent: 'stock-exchange', title: 'Market indices', level: 2,
  short: 'An index turns the prices of a basket of shares into one number that tracks the market. How the basket is weighted — by share price, by company size or equally — changes what the number says; only its percentage changes mean anything.',
  keywords: ['index', 'stock index', 'price-weighted', 'capitalisation-weighted', 'market-cap weighted', 'float-adjusted', 'equal-weighted', 'divisor', 'benchmark', 'total return index', 'price index', 'rebalancing', 'reconstitution', 'concentration'],
  prereq: ['stocks-shares', 'stock-terminology', 'math:percentages'],
  related: ['index-investing', 'mutual-funds-etfs', 'active-vs-passive', 'bull-bear-markets', 'diversification'],
  body: `
"The market fell 2 % today" is a sentence about an index: one number standing for hundreds of companies. Indices serve as a thermometer for the market, as a benchmark to judge a fund manager, and as the recipe that [[index-investing|index funds]] copy. But the number depends entirely on how the basket is weighted, and two indices of the same shares can disagree.

### Three ways to weight a basket
Take three companies:

| Company | Price | Shares | Market capitalisation |
|---|---:|---:|---:|
| A | ¤100 | 10 million | ¤1.0 billion |
| B | ¤20 | 200 million | ¤4.0 billion |
| C | ¤50 | 40 million | ¤2.0 billion |

- **Price-weighted:** add up the prices and divide by a *divisor*: $(100 + 20 + 50)/3 = 56.67$. The share with the highest *price* counts most, whatever the size of the company. The oldest famous indices work this way — the Dow Jones Industrial Average (since 1896) and Japan's Nikkei 225.
- **Capitalisation-weighted:** each company counts in proportion to its market value, usually its free-float value. This is how most indices are built — the S&P 500, the FTSE 100, the MSCI families — and it mirrors what the market as a whole owns.
- **Equal-weighted:** every company counts the same, which gives small companies more say and needs regular rebalancing.

Now let each company rise 10 % in turn, the others unchanged:

| 10 % rise in | Price-weighted index | Cap-weighted index |
|---|---:|---:|
| A (small company, high price) | +5.88 % | +1.43 % |
| B (big company, low price) | +1.18 % | +5.71 % |
| C | +2.94 % | +2.86 % |

The same event moves the two indices by amounts that differ by a factor of four. The cap-weighted answer says what happened to the money invested in the market; the price-weighted one reflects an accident of how many shares each company happens to have issued.

### The divisor and stock splits
If A splits 2-for-1, its price halves to ¤50 though nothing about the company changes. A price-weighted index would drop from 56.67 to $120/3 = 40$ — a false fall of 29 % — so the divisor is changed instead: $d = 3 \\times 120/170 = 2.1176$, which keeps the index at 56.67. But A's influence has halved: from now on a 10 % rise in A lifts the index 4.17 %, not 5.88 %. After decades of splits and replacements, the Dow's divisor is far below 1. A cap-weighted index is untouched by splits: market value does not change.

### Price or total return?
Most headline indices are **price indices**: they ignore dividends. A **total-return** index assumes dividends are reinvested (Germany's DAX is published that way). The gap compounds: 6 % a year in price and 8 % with dividends turns 1 into 5.74 against 10.06 over 30 years. Comparing a fund's total return with a price index flatters the fund.

### What an index is not
An index is a set of rules, reviewed by a committee or a formula: companies that shrink are dropped and growing ones added (reconstitution), and weights are refreshed (rebalancing). Its long history therefore follows the winners of each era. In a cap-weighted index a few giants can dominate — in the mid-2020s the ten largest US companies made up roughly a third of the main US large-company index — so "the market rose" can hide most shares falling. And the level itself means nothing: an index at 40,000 is not "higher" than one at 7,000; they started from different bases. Only percentage changes compare.

> [!note] Index levels in this app are illustrative. Real ones change every second; what matters for understanding is how they are built.
`,
  ideas: [
    'An index is one number summarising a basket of shares; its weighting decides what it measures.',
    'Price-weighted: the highest-priced share counts most. Cap-weighted: the most valuable company counts most.',
    'A price-weighted index changes its divisor at every split so that the index does not jump.',
    'Price indices leave out dividends; total-return indices reinvest them, and the gap compounds.',
    'Only percentage changes of an index mean anything; the level depends on an arbitrary base.'
  ],
  pitfalls: [
    'An index at 40,000 is higher than one at 7,000 — Levels depend on the base value and divisor; only percentage changes can be compared.',
    'The index shows what the typical share did — A cap-weighted index shows what the money in the market did; a few giants can carry it while most shares fall.',
    'An index return is what investors earned — A price index leaves out dividends, and any fund that tracks an index has costs and small tracking differences.'
  ],
  formulas: [
    {
      name: 'A price-weighted index of three shares',
      expr: 'I = (PA + PB + PC)/d', tex: 'I = \\frac{P_A + P_B + P_C}{d}',
      vars: {
        I: { name: 'index level (points)' },
        PA: { name: 'price of A', q: 'money', unit: '$', value: 100, tex: 'P_A' },
        PB: { name: 'price of B', q: 'money', unit: '$', value: 20, tex: 'P_B' },
        PC: { name: 'price of C', q: 'money', unit: '$', value: 50, tex: 'P_C' },
        d: { name: 'divisor', value: 3 }
      },
      note: 'The divisor starts as the number of shares and is adjusted at every split or change of members, so that such events do not move the index.',
      practice: { unknowns: ['I', 'PA'] },
      stories: {
        I: 'A price-weighted index holds three shares priced {PA}, {PB} and {PC}, with a divisor of {d}. What is its level?',
        PA: 'A price-weighted index with divisor {d} stands at {I}. Two members are at {PB} and {PC}. What is the price of the third?'
      }
    },
    {
      name: 'A capitalisation-weighted index',
      expr: 'I = I0*M/M0', tex: 'I = I_0\\,\\frac{M}{M_0}',
      vars: {
        I: { name: 'index level now (points)' },
        I0: { name: 'base value (points)', value: 1000 },
        M: { name: 'total market value of the members now', q: 'money', unit: '$bn', value: 7.7 },
        M0: { name: 'total market value on the base date', q: 'money', unit: '$bn', value: 7 }
      },
      note: 'In practice the base value is carried forward through a divisor, so that new shares, buybacks and changes of members do not move the index.',
      practice: { unknowns: ['I', 'M'] },
      stories: {
        I: 'An index was set to {I0} when its members were worth {M0}. They are now worth {M}. What is the index level?',
        M: 'An index started at {I0} when its members were worth {M0}; it now stands at {I}. What are the members worth?'
      }
    },
    {
      name: 'Weight of a company in a cap-weighted index',
      expr: 'w = Mi/M', tex: 'w = \\frac{M_i}{M}',
      vars: {
        w: { name: 'weight in the index', q: 'ratio', unit: '%' },
        Mi: { name: 'the company\'s market value', q: 'money', unit: '$bn', value: 4 },
        M: { name: 'total market value of all members', q: 'money', unit: '$bn', value: 7 }
      },
      note: 'A 10 % move in the company moves the index by its weight times 10 %.',
      stories: { w: 'A company worth {Mi} is part of an index whose members are worth {M} in total. What is its weight?' }
    },
    {
      name: 'New divisor after a split',
      expr: 'd2 = d1*S2/S1', tex: 'd_2 = d_1\\,\\frac{S_2}{S_1}',
      vars: {
        d2: { name: 'divisor after the split' },
        d1: { name: 'divisor before', value: 3 },
        S2: { name: 'sum of prices just after the split', q: 'money', unit: '$', value: 120 },
        S1: { name: 'sum of prices just before', q: 'money', unit: '$', value: 170 }
      },
      note: 'Chosen so that the index is the same just before and just after the split.',
      practice: { unknowns: ['d2'] },
      stories: { d2: 'The prices in a price-weighted index add up to {S1}, with a divisor of {d1}. After a split they add up to {S2}. What must the new divisor be?' }
    }
  ],
  examples: [
    {
      title: 'One event, two indices',
      q: 'Companies A (¤100, 10 million shares), B (¤20, 200 million) and C (¤50, 40 million) form both a price-weighted and a cap-weighted index. A rises 10 %. How much does each index rise?',
      steps: [
        'Price-weighted: the sum of prices goes from 170 to 180, so the index rises $10/170 = 5.88$ %.',
        'Cap-weighted: the market values are ¤1bn, ¤4bn and ¤2bn, ¤7bn in total. A gains ¤0.1bn, so the index rises $0.1/7 = 1.43$ %.',
        'A is the smallest company but has the highest price: it dominates the first index and hardly matters to the second.'
      ],
      a: '+5.88 % price-weighted, +1.43 % cap-weighted.'
    },
    {
      title: 'Adjusting the divisor for a split',
      q: 'In the same price-weighted index (divisor 3), A splits 2-for-1. What new divisor keeps the index unchanged, and how much does A now move it?',
      steps: [
        'Before: $170/3 = 56.67$. After the split the prices add up to $50 + 20 + 50 = 120$.',
        'New divisor: $3 \\times 120/170 = 2.1176$, so that $120/2.1176 = 56.67$.',
        'Without the change the index would have shown 40, a false fall of 29 %.',
        'A 10 % rise in A now adds ¤5 to a sum of 120: $5/120 = 4.17$ % instead of 5.88 %.'
      ],
      a: 'The divisor becomes 2.1176; A\'s influence falls by half.'
    }
  ],
  quiz: [
    { q: 'In a price-weighted index, which company moves the index most?', choices: ['the one with the largest market capitalisation', 'the one with the highest share price', 'the one with the most shares', 'they all count equally'], a: 1,
      why: 'Only prices enter the sum, so a 10 % move in a ¤400 share moves the index twenty times more than a 10 % move in a ¤20 share.' },
    { q: 'A cap-weighted index holds two companies worth ¤60 billion and ¤40 billion. The smaller one rises 10 %, the other is unchanged. By how much does the index rise, in per cent?', answer: 4, unit: '%',
      why: 'The smaller company is 40 % of the index; 40 % × 10 % = 4 %.' },
    { q: 'When a company in a price-weighted index splits 2-for-1, the index would fall unless its divisor were changed.', a: true,
      why: 'The company\'s price halves, which would pull the sum of prices down. Lowering the divisor keeps the index level unchanged.' },
    { q: 'Over 30 years, which ends higher: a price index or the total-return version of the same index?', choices: ['the price index', 'the total-return index, because it adds reinvested dividends', 'they are always equal', 'it depends only on inflation'], a: 1,
      why: 'Dividends reinvested every year compound; with a 2 % yield the total-return index ends nearly twice as high after 30 years.' }
  ],
  applications: ['Reading the market news: which index, weighted how.', 'Judging a fund against the right benchmark, with dividends included.', 'Understanding what an index fund actually holds, and how concentrated it is.', 'Seeing why different indices of the same market disagree on a given day.'],
  history: 'Charles Dow published his first average in 1884 and the Dow Jones Industrial Average in 1896, with twelve companies, by simply averaging their prices — easy to compute by hand. Capitalisation-weighted indices, harder to calculate, became standard with computers; the first index funds, launched in the 1970s, followed them.',
  sim: 'stk-index'
},

/* ================================================================ bull and bear */
{
  id: 'bull-bear-markets', parent: 'stock-exchange', title: 'Bull and bear markets', level: 1,
  short: 'A bull market is a long rise in prices; a bear market is a fall of 20 % or more from a peak. Both are normal parts of owning shares. Knowing how deep falls have been, how long recoveries took and why losses need larger gains to repair makes them less frightening.',
  keywords: ['bull market', 'bear market', 'correction', 'crash', 'drawdown', 'recovery', 'peak', 'trough', 'market cycle', 'Black Monday', '1929', 'dot-com', 'financial crisis', 'COVID crash', 'Nikkei'],
  prereq: ['stocks-shares', 'market-indices', 'risk-and-return'],
  related: ['drawdowns', 'loss-aversion', 'money-anxiety', 'bubbles', 'financial-crises', 'recessions', 'time-horizon', 'dollar-cost-averaging'],
  body: `
Imagine opening your pension statement and seeing that the shares in it are worth a third less than a few weeks earlier. That happened to hundreds of millions of people in March 2020. It feels like a disaster — and it is also something that happens, in one form or another, every decade or so to everyone who owns shares. Knowing the pattern is the best protection against the worst reaction.

### The words
- A **correction** is a fall of 10 % or more from a recent peak.
- A **bear market** is a fall of 20 % or more from a peak. A **bull market** is a long rise, often counted from a low as a gain of 20 % or more.
- Neither is declared by anybody: they are conventions used by commentators, and they can be identified only afterwards. (The names are said to come from how the animals attack — a bull thrusts its horns upward, a bear swipes down.)

### What history shows
| Episode | Fall, peak to trough (approximate) | Time to regain the old peak (prices only) |
|---|---:|---|
| 1929–1932, US (Dow) | about 89 % | about 25 years (1954) |
| 19 October 1987, US (Dow) | 22.6 % in one day | about two years |
| 2000–2002, US technology (Nasdaq) | about 78 % | about 15 years (2015) |
| from 1989, Japan (Nikkei 225) | about 80 % at its lows | more than 34 years (early 2024) |
| 2007–2009, US (S&P 500) | about 57 % | about five and a half years (2013) |
| February–March 2020, US (S&P 500) | about 34 % in about a month | about five months |

Three lessons stand out. Falls happen, and some are very deep. Recoveries have usually come — often faster than the gloom at the bottom suggested — but not always quickly: a whole national market bought at a very high valuation (Japan in 1989) or a fashionable sector (technology in 2000) can take decades. And counting dividends, which the table does not, shortens every recovery: an investor who reinvested dividends through the 1930s, in a time of falling prices, was made whole much sooner than the price chart suggests.

### Why losses hurt more than gains help
A fall of $L$ needs a gain of $g = L/(1 - L)$ to get back:

| Fall | Gain needed to recover |
|---:|---:|
| 10 % | 11.1 % |
| 20 % | 25 % |
| 33 % | 50 % |
| 50 % | 100 % |
| 57 % | 133 % |
| 78 % | 355 % |

After a 50 % fall, growth of 7 % a year takes about 10.2 years to double the money back. (A 50 % loss followed by a 50 % gain leaves you at 75 %.) This asymmetry is why deep falls matter so much more than their size suggests, and why [[leverage-basics]] — which deepens them — is so dangerous.

### Living through one
Most people who lose money in a bear market lose it by selling near the bottom, when fear is greatest, and waiting until after the recovery to buy back. The best days often come within weeks of the worst ones, so stepping out even briefly can miss them. What helps is decided before the fall: shares only for money not needed for years ([[time-horizon]]), a cash cushion ([[emergency-fund]]), a mix of assets you can live with ([[asset-allocation]]) and, for someone still saving, the comfort that regular investing buys more shares when prices are low ([[dollar-cost-averaging]]). Bull markets have historically lasted much longer than bear markets — typically several years against about a year or so — which is why shares have, over long periods, paid more than cash.

> [!key] A bear market is not a sign that something is wrong with you or your plan. It is the price of the higher long-run returns shares have offered — paid in discomfort rather than money, as long as you do not have to sell.

> [!note] The simulation shows long *simulated* histories: pure random numbers with a steady average return. Even without any crisis being programmed in, bear markets appear every few years — they are what randomness looks like in a volatile asset.
`,
  ideas: [
    'A correction is a fall of 10 %, a bear market 20 % or more from a peak — conventions, recognised only afterwards.',
    'Deep falls have happened in every generation: 1929, 1987, 2000, 2008, 2020.',
    'A fall of L needs a gain of L/(1 − L) to recover: 50 % down needs 100 % up.',
    'Most recoveries came within a few years, but some took decades; dividends shorten them.',
    'The damage in a bear market is done mostly by selling at the bottom.'
  ],
  pitfalls: [
    'I will sell before the fall and buy back at the bottom — Peaks and troughs are visible only afterwards, and the best days often come right after the worst ones.',
    'A 50 % loss followed by a 50 % gain gets me back to where I started — It leaves you at 75 %; after a 50 % fall you need a 100 % gain.',
    'Bear markets are rare catastrophes — They have come roughly every several years; they are a normal part of owning shares.'
  ],
  formulas: [
    {
      name: 'Drawdown: the fall from the peak',
      expr: 'D = 1 - P/Pk', tex: 'D = 1 - \\frac{P}{P_{\\mathrm{peak}}}',
      vars: {
        D: { name: 'drawdown', q: 'ratio', unit: '%' },
        P: { name: 'value now', q: 'money', unit: '$', value: 150 },
        Pk: { name: 'highest value before', q: 'money', unit: '$', value: 200, tex: 'P_{\\mathrm{peak}}' }
      },
      note: '10 % or more is a correction, 20 % or more a bear market (for an index).',
      practice: { unknowns: ['D', 'P'] },
      stories: {
        D: 'A portfolio worth {Pk} at its peak is now worth {P}. What is the drawdown?',
        P: 'A portfolio peaked at {Pk} and is now {D} below its peak. What is it worth?'
      }
    },
    {
      name: 'Gain needed to recover a loss',
      expr: 'g = L/(1 - L)', tex: 'g = \\frac{L}{1 - L}',
      vars: {
        g: { name: 'gain needed to get back', q: 'ratio', unit: '%' },
        L: { name: 'loss suffered', q: 'ratio', unit: '%', value: 50, min: 0, max: 99.9 }
      },
      stories: {
        g: 'An investment falls by {L}. What percentage gain does it need to get back to where it started?',
        L: 'An investment needed a gain of {g} to recover. How big was the fall?'
      }
    },
    {
      name: 'Years to recover at a steady return',
      expr: 't = ln(1/(1 - L))/ln(1 + r)', tex: 't = \\frac{\\ln\\frac{1}{1 - L}}{\\ln(1 + r)}',
      vars: {
        t: { name: 'years to regain the peak', q: 'years', unit: 'yr' },
        L: { name: 'fall from the peak', q: 'ratio', unit: '%', value: 50, min: 0, max: 99.9 },
        r: { name: 'yearly return during the recovery', q: 'ratio', unit: '%', value: 7, min: 0.01, max: 100 }
      },
      note: 'Prices only, with no new money added. Dividends reinvested and continued saving make the real recovery of a saver faster.',
      practice: { unknowns: ['t', 'r'] },
      stories: {
        t: 'After a fall of {L}, the market grows at {r} a year. How long until it regains its old peak?',
        r: 'After a fall of {L}, a market took {t} to regain its peak. What yearly return did it earn during the recovery?'
      }
    }
  ],
  examples: [
    {
      title: 'Why a 50 % fall needs a 100 % gain',
      q: 'A portfolio of ¤100,000 falls 50 %. What gain brings it back, and how long does that take at 7 % a year?',
      steps: [
        'After the fall it is worth ¤50,000. To return to ¤100,000 it must double: a 100 % gain. In general $g = 0.5/(1 - 0.5) = 1$.',
        'At 7 % a year, doubling takes $\\ln 2/\\ln 1.07 = 10.2$ years.',
        'A 50 % rise from ¤50,000 would only reach ¤75,000.'
      ],
      a: 'A 100 % gain, about 10.2 years at 7 % a year.'
    },
    {
      title: 'The 2007–2009 fall, in these terms',
      q: 'The US large-company index fell about 57 % from October 2007 to March 2009. What gain was needed to recover, and how long would it take at 7 % a year?',
      steps: [
        '$g = 0.57/0.43 = 1.33$: a 133 % gain.',
        'At 7 % a year: $t = \\ln(1/0.43)/\\ln 1.07 = 12.5$ years.',
        'In fact prices regained the old peak in about five and a half years, because the recovery years returned far more than 7 % — a pattern seen after several deep falls, though not after all of them.'
      ],
      a: 'A 133 % gain: 12.5 years at 7 %, but about 5.5 years in reality.'
    }
  ],
  quiz: [
    { q: 'A share falls 40 %. What percentage gain does it need to get back to where it started?', answer: 66.67, unit: '%',
      why: '0.40/(1 − 0.40) = 0.667: from 60 back to 100 is a rise of 40/60, two-thirds.' },
    { q: 'A bear market is officially declared by the stock exchange when prices fall 20 %.', a: false,
      why: 'Nobody declares it. "20 % from a peak" is a convention used by commentators, and it can only be applied after the fact.' },
    { q: 'An index at 5,000 falls to 3,900. How large is the drawdown, in per cent?', answer: 22, unit: '%',
      why: '1 − 3,900/5,000 = 0.22: a 22 % fall, a bear market by the usual convention.' },
    { q: 'What lesson does Japan\'s market after 1989 teach?', choices: ['a broad market always recovers within five years', 'even a whole national market can take decades to regain a peak reached at a very high valuation — one reason to spread investments across countries and over time', 'bear markets happen only in small countries', 'an index can never fall more than 50 %'], a: 1,
      why: 'The Nikkei 225 fell about 80 % from its end-1989 peak and did not regain it for more than 34 years.' },
    { q: 'In 2020 the US large-company index fell about a third in about a month. What happened next?', choices: ['it took ten years to recover', 'it regained its previous peak within about five months', 'it never recovered', 'it kept falling for three years'], a: 1,
      why: 'The 2020 fall was the fastest on record into a bear market, and the recovery to a new high by August 2020 was among the fastest too — a reminder that bottoms are visible only in hindsight.' }
  ],
  applications: ['Deciding how much in shares you could live with through a 50 % fall.', 'Reading market news in a crash with a sense of history.', 'Understanding why selling in a panic often locks in the loss.', 'Seeing why leverage and deep losses are so dangerous together.'],
  sim: 'stk-bull-bear'
},

/* ================================================================ short selling */
{
  id: 'short-selling', parent: 'stock-exchange', title: 'Short selling', level: 2,
  short: 'Short selling means borrowing shares, selling them, and buying them back later to return them — a bet that the price will fall. The most it can gain is what the shares were sold for; the loss has no limit, and borrowing costs money while the position is open.',
  keywords: ['short selling', 'shorting', 'short position', 'borrow fee', 'stock lending', 'short squeeze', 'margin call', 'unlimited loss', 'cover', 'hard to borrow', 'naked short', 'short interest', 'recall'],
  prereq: ['stock-terminology', 'bid-ask-liquidity', 'leverage-basics'],
  related: ['margin-trading', 'margin-calls', 'options-basics', 'hedging', 'bubbles', 'market-efficiency'],
  body: `
A neighbour lends you a rare book worth ¤50 for six months. You are sure a reprint is coming that will make it worth ¤40, so you sell the book today for ¤50. When the reprint arrives you buy another copy for ¤40, return it, and keep the ¤10 — less whatever you paid the neighbour for the loan. If instead the book becomes a collector's item worth ¤150, you must still return a copy, and it costs you ¤100 more than you sold it for. That is short selling.

### The mechanics
1. Your broker **borrows** the shares for you, from another client or an institution that lends shares out.
2. You **sell** them at today's price and receive the cash (which stays in your account as collateral).
3. Later you **buy back** ("cover") the same number of shares and return them.

Meanwhile you pay a **borrowing fee** (a yearly rate on the value borrowed: a fraction of a per cent for most large shares, tens of per cent for scarce "hard-to-borrow" ones), and you must pay the lender any **dividends** the company pays, since the lender would have received them. The lender can also recall the shares at short notice.

$$\\text{P/L} = n\\,(P_0 - P_1 - P_0\\,f\\,t - D)$$

### The lopsided payoff
Short 100 shares at ¤50 for six months, with a 2 % yearly fee (¤50) and a ¤0.60 dividend paid out (¤60):

| Buy back at | Before costs | Costs | Result |
|---:|---:|---:|---:|
| ¤0 | +¤5,000 | ¤110 | +¤4,890 |
| ¤40 | +¤1,000 | ¤110 | +¤890 |
| ¤50 | ¤0 | ¤110 | −¤110 |
| ¤80 | −¤3,000 | ¤110 | −¤3,110 |
| ¤150 | −¤10,000 | ¤110 | −¤10,110 |

The gain can never exceed ¤5,000, the price the shares were sold for. The loss has no ceiling: a share can double, triple or rise tenfold. A buyer of shares faces the mirror image — at most 100 % loss, unlimited gain. Break-even is not ¤50 but ¤48.90: the price has to fall just to cover the costs.

### Margin and the forced exit
Because the loss is open-ended, brokers demand collateral. In the US, for example, a short sale typically requires the sale proceeds plus 50 % more, and a **maintenance margin** of about 30 %: if the account's equity falls below 30 % of the shares' current value, the broker issues a margin call. With those numbers a short at ¤50 is called when the price reaches $50 \\times 1.5/1.3 = ¤57.69$ — a rise of only 15 %. If you cannot add money, the broker buys the shares back for you, at the worst time ([[margin-calls]]).

### Squeezes
When many short sellers are forced to buy at once, their buying pushes the price up further, which forces more of them to buy: a **short squeeze**. In October 2008, a squeeze in Volkswagen shares briefly made it the most valuable company in the world; in January 2021 GameStop's shares rose more than tenfold within a few weeks as small investors piled into a heavily shorted share. Being right about a company *eventually* does not help a short seller who is forced out first.

### Why shorting exists
Short sellers make prices more accurate by expressing pessimism that would otherwise be silent; some have uncovered accounting frauds before auditors did; and short positions let funds hedge the market risk of the shares they own ([[hedging]]). Regulators have at times banned short selling in a crisis — in 2008, and in several European countries in March 2020 — and studies of the 2008 bans found that they widened spreads and did little to stop prices falling. Most rules forbid selling shares that have not been borrowed or located ("naked" shorting).

> [!warn] For a private investor, a short sale is one of the few positions where one bad week can cost more than everything put in. Buying a [[options-basics|put option]] also profits from a fall, but its loss is limited to what the option cost.
`,
  ideas: [
    'Shorting is borrowing shares, selling them now and buying them back later to return them.',
    'The gain is capped at the sale price; the loss has no limit.',
    'Shorts pay a borrowing fee and any dividends, so the price must fall just to break even.',
    'Margin calls and recalls can force a short seller out before being proved right.',
    'Short squeezes happen when forced buying feeds on itself.'
  ],
  pitfalls: [
    'Shorting is just buying in reverse — The payoff is not symmetric: the gain is capped at 100 %, the loss is unlimited, and you pay to borrow and pay the dividends.',
    'If I am right about the company, the short will pay — You can be right eventually and still be forced out first by a margin call, a recall of the shares or a squeeze.',
    'Short sellers cause crashes — They can add to selling in a panic, but studies of short-selling bans found that the bans reduced liquidity and did little to stop falls.'
  ],
  formulas: [
    {
      name: 'Profit or loss on a short sale',
      expr: 'PL = n*(P0 - P1 - P0*f*t - D)', tex: '\\mathrm{PL} = n\\,(P_0 - P_1 - P_0\\,f\\,t - D)',
      vars: {
        PL: { name: 'profit (+) or loss (−)', q: 'money', unit: '$', signed: true },
        n: { name: 'shares sold short', int: true, value: 100 },
        P0: { name: 'price sold at', q: 'money', unit: '$', value: 50 },
        P1: { name: 'price bought back at', q: 'money', unit: '$', value: 40 },
        f: { name: 'borrowing fee per year', q: 'ratio', unit: '%', value: 2 },
        t: { name: 'time the short is open', q: 'years', unit: 'mo', value: 6 },
        D: { name: 'dividends per share paid to the lender', q: 'money', unit: '$', value: 0.6 }
      },
      note: 'Solve for $P_1$ with a profit of zero to find the break-even price. Try a buy-back price of three times the sale price to see the unlimited loss.',
      practice: { unknowns: ['PL', 'P1'] },
      stories: {
        PL: 'You short {n} shares at {P0} and buy them back at {P1} after {t}. The borrowing fee is {f} a year and the company pays {D} a share in dividends meanwhile. What is your profit or loss?',
        P1: 'You short {n} shares at {P0} for {t}, paying {f} a year to borrow them and {D} a share in dividends. At what buy-back price would the result be {PL}?'
      }
    },
    {
      name: 'Price that triggers a margin call on a short',
      expr: 'Pc = P0*(1 + m0)/(1 + mm)', tex: 'P_c = P_0\\,\\frac{1 + m_0}{1 + m_m}',
      vars: {
        Pc: { name: 'price at which the margin call comes', q: 'money', unit: '$' },
        P0: { name: 'price sold at', q: 'money', unit: '$', value: 50 },
        m0: { name: 'initial margin (extra collateral)', q: 'ratio', unit: '%', value: 50 },
        mm: { name: 'maintenance margin', q: 'ratio', unit: '%', value: 30 }
      },
      note: 'The account holds the sale proceeds plus the initial margin; the call comes when that cash, minus the value of the shares owed, falls below the maintenance share of their value.',
      practice: { unknowns: ['Pc'] },
      stories: { Pc: 'You short a share at {P0}, posting initial margin of {m0}. The maintenance margin is {mm}. At what price does the margin call come?' }
    },
    {
      name: 'Break-even price of a short',
      expr: 'Pb = P0*(1 - f*t) - D', tex: 'P_b = P_0\\,(1 - f\\,t) - D',
      vars: {
        Pb: { name: 'buy-back price for zero profit', q: 'money', unit: '$' },
        P0: { name: 'price sold at', q: 'money', unit: '$', value: 50 },
        f: { name: 'borrowing fee per year', q: 'ratio', unit: '%', value: 2 },
        t: { name: 'time the short is open', q: 'years', unit: 'mo', value: 6 },
        D: { name: 'dividends per share paid to the lender', q: 'money', unit: '$', value: 0.6 }
      },
      stories: { Pb: 'You short a share at {P0} for {t}, with a borrowing fee of {f} a year and {D} of dividends to pay. How low must the price go for you to break even?' }
    }
  ],
  examples: [
    {
      title: 'A short that works, and one that does not',
      q: 'You short 100 shares at ¤50 for six months, paying 2 % a year to borrow and a ¤0.60 dividend. Find the result if you buy back at ¤40, and at ¤80.',
      steps: [
        'Costs: fee $5\\,000 \\times 0.02 \\times 0.5 = ¤50$; dividend $100 \\times 0.60 = ¤60$; together ¤110.',
        'At ¤40: $100 \\times (50 - 40) - 110 = ¤890$ profit.',
        'At ¤80: $100 \\times (50 - 80) - 110 = -¤3{,}110$.',
        'The price moved ¤10 in your favour in one case and ¤30 against you in the other; the loss can keep growing as long as the price does.'
      ],
      a: '+¤890 at ¤40; −¤3,110 at ¤80.'
    },
    {
      title: 'When the margin call comes',
      q: 'You short 100 shares at ¤50, with 50 % initial margin and a 30 % maintenance margin. At what price does the broker call?',
      steps: [
        'The account holds ¤5,000 of proceeds plus ¤2,500 of margin: ¤7,500.',
        'At price $P$ you owe shares worth $100P$, so the equity is $7\\,500 - 100P$.',
        'The call comes when $7\\,500 - 100P = 0.30 \\times 100P$, so $P = 7\\,500/130 = ¤57.69$.'
      ],
      a: 'At about ¤57.69 — a rise of only 15 %.'
    }
  ],
  quiz: [
    { q: 'What is the most a short seller can gain on a share sold short at ¤50, before costs?', choices: ['¤50 a share, if the price falls to zero', 'there is no limit', '¤25 a share', 'the dividend'], a: 0,
      why: 'The price cannot fall below zero, so the most the short can gain is the ¤50 it was sold for.' },
    { q: 'The loss on a short sale is limited to the money received from selling the shares.', a: false,
      why: 'There is no limit: the shares must be bought back at whatever the price has become, and a price can rise many times over.' },
    { q: 'You short 200 shares at ¤30. The price rises to ¤36 and you buy them back. Ignoring costs, what is your result?', answer: -1200, unit: '$',
      why: '200 × (30 − 36) = −¤1,200.' },
    { q: 'A short squeeze happens when…', choices: ['short sellers rush to buy back at the same time, pushing the price up further', 'the exchange bans short selling', 'a company buys back its own shares', 'the borrowing fee falls to zero'], a: 0,
      why: 'Rising prices trigger margin calls and fear; forced buying lifts the price, which forces more buying.' },
    { q: 'You short at ¤40 with 50 % initial margin and a 25 % maintenance margin. At what price does the margin call come?', answer: 48, unit: '$',
      why: '¤40 × 1.5/1.25 = ¤48.' }
  ],
  applications: ['Understanding news about short sellers, short interest and squeezes.', 'Seeing how hedge funds reduce the market risk of the shares they own.', 'Recognising the risk in products that let you "go short" easily.', 'Comparing a short sale with a put option as ways of profiting from a fall.'],
  sim: 'stk-short'
},

/* ================================================================ brokers */
{
  id: 'brokers', parent: 'stock-exchange', title: 'Brokers, custody and trading costs', level: 1,
  short: 'A broker sends your orders to the market and holds your shares for you. What it costs is more than the commission — spreads, currency conversion, custody fees and taxes add up — and how it holds your assets decides how safe they are if the broker fails.',
  keywords: ['broker', 'brokerage', 'online broker', 'execution-only', 'commission', 'custody', 'custodian', 'nominee account', 'payment for order flow', 'commission-free', 'platform fee', 'currency conversion', 'stamp duty', 'investor compensation', 'SIPC', 'FSCS', 'fractional shares'],
  prereq: ['stock-exchanges', 'bid-ask-liquidity', 'investment-fees'],
  related: ['order-types', 'scams-fraud', 'cfds-forex', 'taxes-investing', 'pensions', 'deposit-insurance', 'index-investing'],
  body: `
You cannot walk into a stock exchange and buy a share: only member firms can trade there. A **broker** is your door. It takes your order, sends it to a market, confirms the trade, keeps the record of what you own and passes on dividends and votes. Choosing one is less about finding the lowest headline fee than about knowing what you will pay in total and how your assets are held.

### Kinds of broker
- **Execution-only (online)** brokers carry out your instructions and give no advice; most people who invest by themselves use one.
- **Full-service** brokers and private banks add research and advice, for considerably higher fees.
- **Banks** often run their own brokerage services, convenient but not always cheap.
- **Automated platforms** ("robo-advisers") invest regular amounts in a ready-made mix of funds for a yearly fee.

### What trading really costs
| Cost | Usual form | Example |
|---|---|---|
| Commission | a flat fee per trade, or a percentage with a minimum | ¤5 on a ¤200 purchase = 2.5 % |
| Spread | the gap between ask and bid ([[bid-ask-liquidity]]) | about 0.1 % on a busy share, several % on a thin one |
| Currency conversion | a margin on the exchange rate for foreign shares | 0.5 % on ¤5,000 = ¤25, each way |
| Custody or platform fee | a percentage a year, or a flat fee | 0.25 % a year on ¤50,000 = ¤125 |
| Transaction taxes | set by some governments | the UK charges 0.5 % stamp duty on most purchases of UK shares |
| Fund costs | inside the price of any fund you buy | see [[investment-fees]] |

A flat fee hurts small, frequent purchases most: ¤5 on each monthly ¤200 purchase is 2.5 % of everything invested — ¤60 a year on ¤2,400. A fee of 0.1 % with a ¤1 minimum would cost ¤1 a time, 0.5 %. Yearly fees work more quietly and compound: on ¤10,000 growing at 6 % a year for 30 years, a 1 % yearly fee turns ¤57,435 into ¤43,219 — it takes 24.7 % of the final pot. At 0.2 % it takes 5.5 %; at 2 %, 43.5 %.

### "Commission-free" trading
Some brokers charge no commission at all. They earn in other ways: interest on clients' uninvested cash, lending clients' shares to short sellers, currency conversion, subscriptions — and, in some countries, **payment for order flow**, in which a market maker pays the broker to receive its clients' orders. In the US this is legal and must be disclosed; the European Union has decided to phase it out. The point is not that such brokers are bad, but that nothing is free: compare the total cost for the way you actually invest.

### Custody: whose shares are they?
Most brokers hold clients' shares in a **nominee** (or "street name") account: the register shows the broker's nominee company, and the broker's own records show which shares belong to you. The rules in most countries require client assets to be kept **segregated** from the broker's own money, so that if the broker fails, its creditors cannot take them. Investor-compensation schemes — such as SIPC in the US or the FSCS in the UK — step in, up to a limit, if client cash or securities go missing when a firm fails. They do not cover losses from falling prices.

> [!warn] Check that a firm is authorised by looking it up yourself on your financial regulator's official register — reached independently, not through a link the firm sends. Fake "brokers" with slick apps and guaranteed returns are among the most common investment frauds ([[scams-fraud]]). And know what you are buying: an account that trades CFDs holds no shares at all ([[cfds-forex]]).

### Before you open an account
Ask: which markets and products does it offer; what will *your* pattern of investing cost per year, all in; who holds the assets and under which protection scheme; how does it handle dividends, foreign tax and corporate actions; and does it offer the tax-advantaged accounts your country provides ([[taxes-investing]], [[pensions]])?
`,
  ideas: [
    'A broker routes your orders and holds your shares; you cannot trade on an exchange directly.',
    'The total cost includes commission, spread, currency conversion, custody fees and any transaction taxes.',
    'Flat fees weigh most on small purchases; yearly fees compound over decades.',
    '"Commission-free" brokers earn in other ways, such as payment for order flow and interest on cash.',
    'Segregated client assets and compensation schemes protect against a broker\'s failure, not against falling prices.'
  ],
  pitfalls: [
    'The cheapest broker is the one with the lowest commission — Total cost includes spreads, currency margins, custody fees and execution quality; compare for the way you actually invest.',
    'My shares are safe because the app is large and popular — Check that the firm is authorised, that client assets are segregated and which compensation scheme covers them; and that you own real shares, not contracts on them.',
    'A 1 % yearly fee is small — Over 30 years at 6 % it takes about a quarter of the final value.'
  ],
  formulas: [
    {
      name: 'Cost of one trade as a share of its value',
      expr: 'c = F/V + a', tex: 'c = \\frac{F}{V} + a',
      vars: {
        c: { name: 'cost as a share of the trade', q: 'ratio', unit: '%' },
        F: { name: 'flat fee per trade', q: 'money', unit: '$', value: 5 },
        V: { name: 'value of the trade', q: 'money', unit: '$', value: 1000 },
        a: { name: 'percentage fee (commission, currency, tax)', q: 'ratio', unit: '%', value: 0.05 }
      },
      note: 'Add half the relative spread to count the market\'s own cost as well.',
      practice: { unknowns: ['c', 'V'] },
      stories: {
        c: 'A broker charges {F} per trade plus {a} of the amount. What does a purchase of {V} cost, as a share of the amount?',
        V: 'A broker charges {F} per trade plus {a}. How large must a trade be for the total cost to be {c}?'
      }
    },
    {
      name: 'Share of the final value taken by a yearly fee',
      expr: 'L = 1 - ((1 + r - f)/(1 + r))^t', tex: 'L = 1 - \\left(\\frac{1 + r - f}{1 + r}\\right)^{t}',
      vars: {
        L: { name: 'share of the final value lost to the fee', q: 'ratio', unit: '%' },
        r: { name: 'yearly return before the fee', q: 'ratio', unit: '%', value: 6 },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 1, min: 0, max: 20 },
        t: { name: 'years invested', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'A simple model: the fee is subtracted from each year\'s return. Solve for $f$ to see what fee costs a given share of your future wealth.',
      practice: { unknowns: ['L', 'f'] },
      stories: {
        L: 'Your investments earn {r} a year before costs, and you pay a yearly fee of {f}. What share of the value after {t} does the fee take?',
        f: 'Over {t} at {r} a year, a yearly fee took {L} of the final value. How large was the fee?'
      }
    },
    {
      name: 'Value after yearly fees',
      expr: 'A = P*(1 + r - f)^t', tex: 'A = P\\,(1 + r - f)^{t}',
      vars: {
        A: { name: 'value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return before the fee', q: 'ratio', unit: '%', value: 6 },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 1, min: 0, max: 20 },
        t: { name: 'years invested', q: 'years', unit: 'yr', value: 30 }
      },
      practice: { unknowns: ['A'] },
      stories: { A: 'You invest {P} for {t}. It earns {r} a year before a yearly fee of {f}. What is it worth at the end?' }
    }
  ],
  examples: [
    {
      title: 'Small monthly purchases',
      q: 'You invest ¤200 a month in shares. Broker X charges ¤5 per trade; broker Y charges 0.1 % with a ¤1 minimum. Compare the cost of each purchase and of a year.',
      steps: [
        'X: $5/200 = 2.5$ % of each purchase; ¤60 a year on ¤2,400 invested.',
        'Y: 0.1 % of ¤200 is ¤0.20, below the minimum, so ¤1 a trade: 0.5 %; ¤12 a year.',
        'For larger, rarer trades the comparison can reverse: on ¤10,000, X costs ¤5 (0.05 %) and Y ¤10 (0.1 %).'
      ],
      a: '2.5 % against 0.5 % a purchase — the structure of a fee matters as much as its size.'
    },
    {
      title: 'What 1 % a year costs over 30 years',
      q: '¤10,000 grows at 6 % a year for 30 years. What is it worth with no fee, and with a yearly fee of 1 %?',
      steps: [
        'No fee: $10\\,000 \\times 1.06^{30} = ¤57{,}435$.',
        'With the fee: $10\\,000 \\times 1.05^{30} = ¤43{,}219$.',
        'The fee took ¤14,215, or $1 - (1.05/1.06)^{30} = 24.7$ % of what you would have had.'
      ],
      a: '¤57,435 against ¤43,219: a 1 % fee takes about a quarter.'
    }
  ],
  quiz: [
    { q: 'Your broker fails. What do investor-compensation schemes generally cover?', choices: ['losses from falling share prices', 'client cash and securities that are missing when the firm fails, up to a limit', 'any loss of more than 10 %', 'nothing at all'], a: 1,
      why: 'They protect against the firm losing or misusing clients\' assets, up to a limit — not against market losses, which are the investor\'s own risk.' },
    { q: 'A flat ¤10 commission on a ¤500 purchase is what percentage of the purchase?', answer: 2, unit: '%',
      why: '10/500 = 2 %. The same ¤10 on ¤10,000 would be 0.1 %.' },
    { q: 'A "commission-free" trading app earns nothing from your trades.', a: false,
      why: 'Such brokers are paid in other ways: the spread, payment for order flow where it is allowed, interest on cash, share lending, currency conversion or subscriptions.' },
    { q: 'Your investments earn 6 % a year before a yearly fee of 1 %. Roughly what share of the value after 30 years goes to the fee?', choices: ['about 1 %', 'about 6 %', 'about a quarter', 'about half'], a: 2,
      why: '1 − (1.05/1.06)^30 = 24.7 %: small yearly fees compound into a large share of the final value.' },
    { q: 'An unknown firm offers you a trading account with guaranteed monthly returns. What is the first check?', choices: ['read the testimonials on its website', 'look the firm up yourself on the financial regulator\'s official register, reached independently rather than through its links', 'send a small test deposit', 'ask the salesperson for a licence number'], a: 1,
      why: 'Fraudsters supply fake testimonials, licence numbers and clone websites. Only the regulator\'s own register, found by yourself, tells you whether the firm is authorised — and "guaranteed returns" are a warning sign on their own.' }
  ],
  applications: ['Comparing brokers on the total yearly cost of your own pattern of investing.', 'Checking how your shares are held and what protects them.', 'Deciding whether to invest monthly or in larger, rarer amounts given a fee structure.', 'Spotting fake brokers before sending money.'],
  history: 'Fixed commissions were the rule on the New York Stock Exchange until 1 May 1975, when they were abolished; discount brokers followed. Online trading spread in the late 1990s, and commission-free trading became common in the US in the late 2010s.'
}

);
