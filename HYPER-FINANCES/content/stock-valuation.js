/* HYPER-FINANCES · content/stock-valuation.js — The Stock Market: what a share is worth.
 * Financial statements, earnings and EPS, P/E and other multiples, dividends, the dividend
 * discount model, discounted cash flows, and efficient markets. Simulations in sims/stocks.js. */
Hyper.add(

/* ================================================================ financial statements */
{
  id: 'financial-statements', parent: 'stock-valuation', title: 'Reading financial statements', level: 2,
  short: 'Three reports describe a company: the income statement (what it earned over a period), the balance sheet (what it owns and owes on one day) and the cash-flow statement (where the cash actually came from and went). Read together, they show whether profits are real.',
  keywords: ['financial statements', 'income statement', 'profit and loss', 'balance sheet', 'cash flow statement', 'revenue', 'gross margin', 'operating margin', 'net income', 'net profit', 'assets', 'liabilities', 'equity', 'ROE', 'free cash flow', 'annual report', 'depreciation', 'working capital', 'IFRS', 'GAAP'],
  prereq: ['stocks-shares', 'costs-and-profit', 'math:percentages'],
  related: ['earnings-eps', 'pe-ratio', 'dcf-valuation', 'net-worth', 'dividends', 'credit-risk'],
  body: `
You already read a household version of these reports. Your payslip and your spending tell you whether you earned more than you spent this month — an income statement. Listing what you own and what you owe gives your [[net-worth|net worth]] — a balance sheet. And your bank statement shows the actual money in and out, which is not quite the same as either — a cash-flow statement. Companies publish all three, audited, at least once a year. Here they are for Brewline, an imaginary chain of coffee shops with 25 million shares (figures in ¤ millions).

### The income statement: a year's result
| | ¤ million | share of revenue |
|---|---:|---:|
| Revenue (sales) | 500 | 100 % |
| Cost of the goods sold | −200 | |
| **Gross profit** | 300 | 60 % |
| Staff, rent, marketing and other costs | −185 | |
| Depreciation (the shops and machines wearing out) | −40 | |
| **Operating profit** | 75 | 15 % |
| Interest on borrowings | −10 | |
| Profit before tax | 65 | |
| Tax at 25 % | −16.25 | |
| **Net profit** | 48.75 | 9.75 % |

Each line answers a question. The **gross margin** (60 %) says how much each cup earns above its ingredients; the **operating margin** (15 %) how much is left after running the business; the **net profit** (also called net income or earnings) is what belongs to shareholders: ¤48.75 million, or ¤1.95 for each of the 25 million shares ([[earnings-eps]]). Operating profit covers the interest bill 7.5 times.

### The balance sheet: one day's snapshot
| Assets | ¤ million | Liabilities and equity | ¤ million |
|---|---:|---|---:|
| Cash | 60 | Payables and other liabilities | 150 |
| Stock and money owed by customers | 90 | Borrowings | 200 |
| Shops and equipment | 450 | Shareholders' equity | 250 |
| **Total** | 600 | **Total** | 600 |

It always balances, because equity is defined as what is left: $A = L + E$. Equity of ¤250 million is ¤10 of **book value** per share. Two ratios come straight from it: net profit on equity, the **return on equity**, $48.75/250 = 19.5$ %; and debt against equity, $200/250 = 0.8$. Borrowings minus cash, ¤140 million, is the **net debt**.

### The cash-flow statement: where the money went
Profit is an accounting measure: depreciation is a cost that uses no cash this year, and a sale on credit counts as revenue before the customer pays. The cash-flow statement undoes this:

| | ¤ million |
|---|---:|
| Net profit | 48.75 |
| + depreciation (a cost, but no cash left the company) | +40 |
| − more cash tied up in stock and unpaid bills | −8 |
| **Cash from operations** | 80.75 |
| − spending on new shops and equipment | −50 |
| **Free cash flow** | 30.75 |
| − dividends paid, − loan repayments | −25 |
| Change in cash | +5.75 |

**Free cash flow** — cash from operations minus investment — is the money the business could hand to its owners without shrinking. It is what a [[dcf-valuation|discounted cash-flow valuation]] values.

> [!warn] Warning signs worth a closer look: profits rising year after year while cash from operations falls; money owed by customers growing much faster than sales; large and recurring "one-off" costs; a widening gap between the company's own "adjusted" profit and the audited figure; a change of auditor or a delayed report. None proves wrongdoing — each is a reason to read the notes.

### Where to find them
Listed companies publish annual reports (in the US the 10-K) and interim reports — quarterly in the US, at least half-yearly in the UK and the European Union. Most of the world uses the IFRS accounting standards; the US uses its own GAAP. The notes at the back, which explain the numbers, are often more revealing than the glossy front.
`,
  ideas: [
    'The income statement shows a period\'s revenue, costs and profit; margins show what each unit of sales leaves behind.',
    'The balance sheet shows what a company owns and owes on one day; assets = liabilities + equity.',
    'The cash-flow statement shows real cash; profit and cash differ because of depreciation, credit and investment.',
    'Free cash flow — operating cash minus investment — is what the owners could take out.',
    'Profits that never turn into cash are a warning sign.'
  ],
  pitfalls: [
    'A profitable company always has more cash at the end of the year — Profit can be tied up in unpaid customer bills and stock, or spent on investment; companies have gone bust while reporting profits.',
    'Revenue is the company\'s income — It is sales before any cost; what belongs to shareholders is the net profit at the bottom.',
    'Book value is what the company is worth — It is an accounting figure based largely on historical costs; brands, know-how and future growth are mostly missing from it.'
  ],
  formulas: [
    {
      name: 'The balance sheet identity',
      expr: 'A = L + E', tex: 'A = L + E',
      vars: {
        A: { name: 'total assets', q: 'money', unit: '$M' },
        L: { name: 'total liabilities', q: 'money', unit: '$M', value: 350 },
        E: { name: 'shareholders\' equity', q: 'money', unit: '$M', value: 250, signed: true }
      },
      note: 'Equity is whatever the assets are worth beyond the debts, which is why the sheet always balances. It can be negative.',
      practice: { unknowns: ['A', 'E'] },
      stories: {
        A: 'A company has liabilities of {L} and shareholders\' equity of {E}. What are its total assets?',
        E: 'A company has assets of {A} and liabilities of {L}. What is its shareholders\' equity?'
      }
    },
    {
      name: 'Net profit margin',
      expr: 'm = NI/Rev', tex: 'm = \\frac{\\mathrm{NI}}{\\mathrm{Rev}}',
      vars: {
        m: { name: 'net profit margin', q: 'ratio', unit: '%', signed: true },
        NI: { name: 'net profit (net income)', q: 'money', unit: '$M', value: 48.75, signed: true },
        Rev: { name: 'revenue (sales)', q: 'money', unit: '$M', value: 500 }
      },
      note: 'The same division with gross or operating profit gives the gross and operating margins.',
      practice: { unknowns: ['m', 'NI'] },
      stories: {
        m: 'A company sold {Rev} and made a net profit of {NI}. What is its net margin?',
        NI: 'A company with revenue of {Rev} has a net margin of {m}. What is its net profit?'
      }
    },
    {
      name: 'Return on equity',
      expr: 'ROE = NI/E', tex: '\\mathrm{ROE} = \\frac{\\mathrm{NI}}{E}',
      vars: {
        ROE: { name: 'return on equity', q: 'ratio', unit: '%', signed: true },
        NI: { name: 'net profit', q: 'money', unit: '$M', value: 48.75, signed: true },
        E: { name: 'shareholders\' equity', q: 'money', unit: '$M', value: 250 }
      },
      note: 'Profit earned on the owners\' money. Debt can raise it — and the risk with it.',
      stories: { ROE: 'A company made a net profit of {NI} on shareholders\' equity of {E}. What is its return on equity?' }
    },
    {
      name: 'Free cash flow',
      expr: 'FCF = OCF - CapEx', tex: '\\mathrm{FCF} = \\mathrm{OCF} - \\mathrm{CapEx}',
      vars: {
        FCF: { name: 'free cash flow', q: 'money', unit: '$M', signed: true },
        OCF: { name: 'cash from operations', q: 'money', unit: '$M', value: 80.75, signed: true },
        CapEx: { name: 'capital expenditure (investment)', q: 'money', unit: '$M', value: 50 }
      },
      stories: { FCF: 'A company generated {OCF} of cash from its operations and spent {CapEx} on new equipment. What is its free cash flow?' }
    }
  ],
  examples: [
    {
      title: 'Reading Brewline\'s year',
      q: 'Brewline had revenue of ¤500 million, gross profit of ¤300 million, operating profit of ¤75 million and net profit of ¤48.75 million, with equity of ¤250 million. Find the margins and the return on equity.',
      steps: [
        'Gross margin: $300/500 = 60$ %. Operating margin: $75/500 = 15$ %. Net margin: $48.75/500 = 9.75$ %.',
        'Return on equity: $48.75/250 = 19.5$ %.',
        'Read together: a business that keeps 60 % of each sale after ingredients, 15 % after all running costs, and earns almost 20 % a year on its owners\' money.'
      ],
      a: 'Margins of 60 %, 15 % and 9.75 %; return on equity 19.5 %.'
    },
    {
      title: 'Profit is not cash',
      q: 'Brewline\'s net profit was ¤48.75 million, depreciation ¤40 million, extra working capital ¤8 million and investment ¤50 million. What was its free cash flow?',
      steps: [
        'Cash from operations: $48.75 + 40 - 8 = ¤80.75$ million — depreciation is added back because no cash left for it this year.',
        'Free cash flow: $80.75 - 50 = ¤30.75$ million.',
        'Paying ¤20 million of dividends and repaying ¤5 million of loans leaves cash up by ¤5.75 million.'
      ],
      a: '¤30.75 million of free cash flow, from ¤48.75 million of profit.'
    }
  ],
  quiz: [
    { q: 'Which statement shows what a company owns and owes on a single date?', choices: ['the income statement', 'the balance sheet', 'the cash-flow statement', 'the dividend notice'], a: 1,
      why: 'The balance sheet is a snapshot of assets, liabilities and equity at the end of the period; the other two describe flows over the period.' },
    { q: 'A company that reports a profit always ends the year with more cash than it started with.', a: false,
      why: 'Profit can be tied up in unpaid customer bills and stock, or spent on investment, dividends and loan repayments.' },
    { q: 'A company has revenue of ¤800 million and a net profit of ¤60 million. What is its net margin, in per cent?', answer: 7.5, unit: '%',
      why: '60/800 = 0.075, or 7.5 %.' },
    { q: 'Cash from operations was ¤120 million and capital expenditure ¤45 million. What was the free cash flow, in millions?', answer: 75, unit: '$M',
      why: '120 − 45 = ¤75 million.' },
    { q: 'For three years a company\'s profits rose while its cash from operations fell and the money owed by its customers doubled. What does this suggest?', choices: ['the company is becoming more efficient', 'profits may be booked before the cash is collected — worth a much closer look', 'nothing: cash and profit are unrelated', 'the company is paying too much tax'], a: 1,
      why: 'When sales are recorded but customers do not pay, profit and cash drift apart. It can be innocent (a big new customer on long terms) or a sign of aggressive accounting.' }
  ],
  applications: ['Checking whether a company you invest in turns its profits into cash.', 'Comparing two businesses by their margins and returns on equity.', 'Understanding the numbers behind a valuation or a news headline about "record profits".', 'Reading the accounts of an employer or a business you might buy into.']
},

/* ================================================================ earnings and EPS */
{
  id: 'earnings-eps', parent: 'stock-valuation', title: 'Earnings and EPS', level: 2,
  short: 'Earnings per share (EPS) divides a company\'s net profit among its shares. It is the number the market watches most closely each quarter — how it grows, how it compares with forecasts, and how buybacks and new shares change it.',
  keywords: ['earnings', 'EPS', 'earnings per share', 'diluted EPS', 'basic EPS', 'net income', 'earnings season', 'consensus', 'earnings surprise', 'guidance', 'adjusted earnings', 'buyback', 'retention', 'sustainable growth', 'payout'],
  prereq: ['financial-statements', 'stocks-shares'],
  related: ['pe-ratio', 'dividends', 'dividend-discount-model', 'stock-terminology', 'market-efficiency'],
  body: `
If Brewline's net profit of ¤48.75 million were shared equally among its 25 million shares, each would receive ¤1.95. That is its **earnings per share**. Nobody is actually paid ¤1.95 — part may come as a dividend, the rest stays in the company — but it is each share's slice of the year's result, and it is the single number most closely watched by the market.

$$\\mathrm{EPS} = \\frac{\\text{net profit} - \\text{preference dividends}}{\\text{number of ordinary shares}}$$

Preference dividends come off first because they belong to preference shareholders: had Brewline paid ¤3.75 million to them, EPS would be $(48.75 - 3.75)/25 = ¤1.80$. The share count is the average over the period.

### Basic and diluted
Companies also report **diluted EPS**, which counts the shares that *could* be created — employee options, convertible bonds — as if they already existed. With 1.5 million such potential shares Brewline's diluted EPS would be $48.75/26.5 = ¤1.84$. A wide gap between basic and diluted EPS means existing owners' slices may shrink.

### The quarterly ritual
Most large listed companies report every quarter or half-year. Before each report, analysts publish forecasts, and their average is the **consensus**. A result above it is a "beat" (¤1.95 against ¤1.90 is 2.6 % above), below it a "miss". Prices often react more to the surprise, and to the company's **guidance** for the coming year, than to the result itself: a company can report EPS 10 % higher than last year and see its shares fall, because investors had expected 15 %. That is not irrational — the price already contained the expected good news ([[market-efficiency]]).

### Where EPS growth comes from
EPS can grow for three reasons, and they are not equally good:
- **Profit growth** — more customers, higher margins. The durable kind.
- **Fewer shares** — a buyback. If profit is flat and 3 % of the shares are bought back, EPS rises 3.1 %; with profit up 4 % as well, EPS rises 7.2 %. Buybacks are a legitimate way to return cash, but EPS growth that comes only from them is not the business growing.
- **Accounting** — a lower tax rate, a one-off gain, a change of method. Look for it in the notes.

A useful rule ties growth to what the company keeps. If it earns a return on equity of 15 % and retains 60 % of its profit (paying out 40 %), the reinvested money can make earnings grow by about $0.15 \\times 0.60 = 9$ % a year — the **sustainable growth rate**. Paying out more means growing more slowly, unless the company borrows or issues shares.

### Adjusted earnings
Besides the audited figure, many companies report "adjusted", "underlying" or "core" earnings that leave out items they consider unusual — restructuring, write-downs, share-based pay. Some adjustments are sensible; but costs that recur every year are costs. When adjusted EPS is consistently far above the audited EPS, trust the audited one more.

> [!tip] Over the long run a share's price has tended to follow its earnings per share: ten years of 8 % growth multiplies EPS by 2.16. The price paid for those earnings is the subject of the next page, [[pe-ratio]].
`,
  ideas: [
    'EPS is net profit, minus preference dividends, divided by the number of ordinary shares.',
    'Diluted EPS counts options and convertibles as if they were shares; the gap shows possible dilution.',
    'Prices react to results compared with expectations, and to guidance, more than to the result alone.',
    'EPS grows from higher profits, from fewer shares (buybacks), or from accounting — only the first is the business growing.',
    'Sustainable growth ≈ return on equity × the share of profit retained.'
  ],
  pitfalls: [
    'Rising EPS always means a growing business — Buybacks alone raise EPS with flat profits, and one-off gains or tax changes can lift it for a single year.',
    'Good results mean the price will rise — Prices react to results relative to what was expected; a strong result below the consensus can send the shares down.',
    'Adjusted earnings are the real earnings — They are the company\'s own selection; costs that recur every year are real costs.'
  ],
  formulas: [
    {
      name: 'Earnings per share',
      expr: 'EPS = (NI - Dp)/N', tex: '\\mathrm{EPS} = \\frac{\\mathrm{NI} - D_p}{N}',
      vars: {
        EPS: { name: 'earnings per share', q: 'money', unit: '$', signed: true },
        NI: { name: 'net profit', q: 'money', unit: '$M', value: 48.75, signed: true },
        Dp: { name: 'dividends on preference shares', q: 'money', unit: '$M', value: 3.75 },
        N: { name: 'ordinary shares (average over the period)', int: true, value: 25000000 }
      },
      note: 'With no preference shares, set $D_p$ to zero.',
      practice: { unknowns: ['EPS', 'NI'] },
      stories: {
        EPS: 'A company made a net profit of {NI}, paid {Dp} to preference shareholders and has {N} ordinary shares. What is its EPS?',
        NI: 'A company with {N} ordinary shares and {Dp} of preference dividends reports EPS of {EPS}. What was its net profit?'
      }
    },
    {
      name: 'Diluted EPS',
      expr: 'EPSd = (NI - Dp)/(N + Nd)', tex: '\\mathrm{EPS}_{d} = \\frac{\\mathrm{NI} - D_p}{N + N_d}',
      vars: {
        EPSd: { name: 'diluted earnings per share', q: 'money', unit: '$', signed: true, tex: '\\mathrm{EPS}_{d}' },
        NI: { name: 'net profit', q: 'money', unit: '$M', value: 48.75, signed: true },
        Dp: { name: 'dividends on preference shares', q: 'money', unit: '$M', value: 0 },
        N: { name: 'ordinary shares', int: true, value: 25000000 },
        Nd: { name: 'potential new shares (options, convertibles)', int: true, value: 1500000 }
      },
      note: 'A simplified version: accounting rules also adjust the profit for convertible bonds\' interest and count only options that would be exercised.',
      practice: { unknowns: ['EPSd'] },
      stories: { EPSd: 'A company earns {NI} with {N} shares, and {Nd} more shares could be created from options and convertibles. Preference dividends are {Dp}. What is its diluted EPS?' }
    },
    {
      name: 'EPS growth with a buyback',
      expr: 'gE = (1 + gN)/(1 - x) - 1', tex: 'g_E = \\frac{1 + g_N}{1 - x} - 1',
      vars: {
        gE: { name: 'growth of EPS', q: 'ratio', unit: '%', signed: true, tex: 'g_E' },
        gN: { name: 'growth of net profit', q: 'ratio', unit: '%', value: 4, signed: true, tex: 'g_N' },
        x: { name: 'fraction of shares bought back', q: 'ratio', unit: '%', value: 3, min: 0, max: 90 }
      },
      note: 'Set the profit growth to zero to see what a buyback alone does to EPS.',
      practice: { unknowns: ['gE', 'x'] },
      stories: {
        gE: 'A company\'s net profit grows {gN} this year, and it buys back {x} of its shares. By how much does EPS grow?',
        x: 'Net profit grows {gN}, yet EPS grows {gE}. What fraction of its shares did the company buy back?'
      }
    },
    {
      name: 'Sustainable growth rate',
      expr: 'g = ROE*b', tex: 'g = \\mathrm{ROE}\\cdot b',
      vars: {
        g: { name: 'sustainable growth of earnings', q: 'ratio', unit: '%' },
        ROE: { name: 'return on equity', q: 'ratio', unit: '%', value: 15 },
        b: { name: 'share of profit retained (1 − payout)', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 }
      },
      note: 'How fast earnings can grow from reinvested profit alone, if the return on equity holds.',
      stories: {
        g: 'A company earns {ROE} on its equity and keeps {b} of its profit. How fast can its earnings grow without new money?',
        b: 'A company earns {ROE} on equity and wants its earnings to grow {g} a year. What share of profit must it retain?'
      }
    }
  ],
  examples: [
    {
      title: 'Brewline\'s EPS, three ways',
      q: 'Brewline made ¤48.75 million with 25 million shares. Find its basic EPS; its EPS if ¤3.75 million had gone to preference shareholders; and its diluted EPS with 1.5 million potential shares (no preference shares).',
      steps: [
        'Basic: $48.75/25 = ¤1.95$.',
        'With preference dividends: $(48.75 - 3.75)/25 = ¤1.80$.',
        'Diluted: $48.75/26.5 = ¤1.84$ — about 6 % less than basic.'
      ],
      a: '¤1.95 basic, ¤1.80 after preference dividends, ¤1.84 diluted.'
    },
    {
      title: 'Growth from a buyback',
      q: 'A company\'s profit rises 4 % and it buys back 3 % of its shares. How much does EPS rise, and how much of that is the buyback?',
      steps: [
        { text: 'EPS changes by the profit ratio divided by the share-count ratio:', tex: 'g_E = \\frac{1.04}{0.97} - 1 = 0.0722' },
        'With flat profit, the buyback alone gives $1/0.97 - 1 = 3.1$ %.',
        'So of the 7.2 % EPS growth, about 4 points come from the business and about 3 from buying back shares.'
      ],
      a: 'EPS rises 7.2 %, of which roughly 3 points are the buyback.'
    }
  ],
  quiz: [
    { q: 'A company earns ¤120 million, has no preference shares and 40 million ordinary shares. What is its EPS?', answer: 3, unit: '$',
      why: '¤120 million ÷ 40 million shares = ¤3 a share.' },
    { q: 'Net profit is unchanged, but the company bought back 5 % of its shares. Its EPS…', choices: ['falls by about 5 %', 'is unchanged', 'rises by about 5.3 %', 'doubles'], a: 2,
      why: 'The same profit is divided among 95 % of the shares: 1/0.95 − 1 = 5.3 %.' },
    { q: 'For a profitable company, diluted EPS is never higher than basic EPS.', a: true,
      why: 'Diluted EPS adds potential shares (and accounting rules leave out any that would raise it), so for a profitable company it can only be equal or lower.' },
    { q: 'A company earns 20 % on its equity and pays out 75 % of its profit as dividends. What is its sustainable growth rate, in per cent?', answer: 5, unit: '%',
      why: 'It retains 25 %: 0.20 × 0.25 = 0.05, or 5 % a year.' },
    { q: 'A company reports EPS 10 % above last year, yet its shares fall 8 % that day. What is the most likely reason?', choices: ['the market misread the numbers', 'investors had expected more, or the company lowered its forecast for next year', 'EPS does not matter to share prices', 'the exchange made an error'], a: 1,
      why: 'The price already contained the expected result. What moves it is the difference from expectations, and what the company says about the future.' }
  ],
  applications: ['Reading a company\'s results announcement and the reaction to it.', 'Seeing through EPS growth that comes only from buybacks or one-offs.', 'Estimating how fast a company can grow from what it reinvests.', 'Understanding employee share plans that dilute EPS.'],
  sim: 'stk-pe'
},

/* ================================================================ P/E */
{
  id: 'pe-ratio', parent: 'stock-valuation', title: 'The P/E ratio and other multiples', level: 2,
  short: 'The price-to-earnings ratio says how many years of current profits you pay for a share. It depends on growth, risk and interest rates — and changes in it can outweigh years of earnings growth. Other multiples compare the price with book value, sales or cash profit.',
  keywords: ['P/E', 'price earnings ratio', 'PE ratio', 'earnings yield', 'forward P/E', 'trailing P/E', 'multiple', 'valuation', 'PEG', 'price to book', 'P/B', 'price to sales', 'EV/EBITDA', 'CAPE', 'Shiller P/E', 'value trap', 'multiple expansion'],
  prereq: ['earnings-eps', 'present-value', 'risk-and-return'],
  related: ['dividend-discount-model', 'dcf-valuation', 'bubbles', 'market-efficiency', 'financial-statements', 'stock-terminology'],
  body: `
When a small shop is sold, people often speak of the price as "so many years of profit": a café that earns ¤40,000 a year and sells for ¤200,000 goes for five years' profit. The **price-to-earnings ratio** says the same thing about a share.

$$\\mathrm{P/E} = \\frac{\\text{price per share}}{\\text{earnings per share}} = \\frac{\\text{market capitalisation}}{\\text{net profit}}$$

Brewline earns ¤1.95 a share; at a price of ¤39 its P/E is 20. Turned upside down, $1.95/39 = 5$ % is its **earnings yield**: each ¤100 invested buys ¤5 of this year's profit. A **trailing** P/E uses the last twelve months' earnings; a **forward** P/E uses forecasts — with next year's EPS expected at ¤2.10, Brewline's forward P/E is 18.6.

### Why some companies deserve higher multiples
A P/E is not good or bad in itself. Three things decide what is reasonable:
- **Growth.** Earnings that will double are worth more than earnings that will stay flat.
- **Risk.** Steadier earnings are worth more; the more uncertain the future, the higher the return investors demand.
- **Interest rates.** When safe bonds pay more, investors demand more from shares too, and multiples fall.

The [[dividend-discount-model|dividend discount model]] puts these together. A company that pays out a fraction $p$ of its earnings, whose dividends grow at $g$, and whose investors demand a return $r$, is worth a forward P/E of

$$\\mathrm{P/E} = \\frac{p}{r - g}$$

With half the profit paid out, $r = 8$ % and $g = 4$ %, that is 12.5. Raise the growth to 6 % and it doubles to 25; raise the required return to 9 % and it falls to 10. Small changes in beliefs about the distant future move multiples a lot — which is why P/E ratios swing with the market's mood.

### The price you pay matters
A share's price is EPS × P/E, so its return comes from earnings growth *and* the change in the multiple. Suppose EPS grows 6 % a year for ten years (×1.79):

| P/E at purchase | P/E ten years later | Price multiplied by | Yearly price return |
|---:|---:|---:|---:|
| 25 | 15 | 1.07 | 0.7 % |
| 20 | 20 | 1.79 | 6.0 % |
| 15 | 25 | 2.98 | 11.6 % |

Same company, same profits: the investor who bought at 25 times earnings earned almost nothing in ten years, the one who bought at 15 did very well. Across a whole market this is what happened after 1999, when the US market's cyclically adjusted P/E (CAPE, which averages ten years of inflation-adjusted earnings) stood above 40, against a long-run average in the mid-to-high teens.

### When a low P/E misleads
- **Value traps:** a P/E of 6 can mean the market expects profits to fall — and it may be right.
- **Cyclical companies** — steelmakers, miners, carmakers — look cheapest at the top of their cycle, when profits are at a peak (¤60 against ¤10 of EPS is a P/E of 6), and most expensive at the bottom (¤30 against ¤1 is 30).
- **Losses** make the P/E meaningless, and one-off gains distort it.

### Other multiples
| Multiple | Compares the price with | Brewline | Useful when |
|---|---|---:|---|
| Price-to-book (P/B) | equity per share | 3.9 | banks, insurers, asset-heavy firms |
| Price-to-sales (P/S) | revenue | 1.95 | young companies with little profit |
| EV/EBITDA | profit before interest, tax and depreciation, against the value of debt and equity together | 9.7 | comparing firms with different debt |
| PEG | the P/E divided by the growth rate in per cent | 20 / 10 % growth = 2.0 | comparing growth companies |

(Brewline: market value ¤975 million, net debt ¤140 million, EBITDA ¤115 million.) No multiple is a verdict; each is a question — *what must I believe about the future for this price to make sense?*
`,
  ideas: [
    'P/E = price ÷ EPS: how many years of current earnings the price represents; its inverse is the earnings yield.',
    'Higher growth, lower risk and lower interest rates justify higher multiples: P/E = payout ÷ (r − g).',
    'Return = earnings growth plus the change in the multiple; paying a high multiple can erase a decade of growth.',
    'A low P/E can be a trap, especially for cyclical companies at the top of their cycle.',
    'Other multiples (P/B, P/S, EV/EBITDA, PEG) suit other kinds of company; none is a verdict.'
  ],
  pitfalls: [
    'A low P/E means a share is cheap — It may mean the market expects earnings to fall; for cyclical firms the P/E is lowest when profits are at their peak.',
    'A high P/E means a share is overpriced — Fast, durable growth can justify it; the question is whether the growth the price assumes is realistic.',
    'Good companies are always good investments — The price paid decides the return: a great company bought at a very high multiple can return little for years.'
  ],
  formulas: [
    {
      name: 'Price-to-earnings ratio',
      expr: 'PE = P/EPS', tex: '\\mathrm{P/E} = \\frac{P}{\\mathrm{EPS}}',
      vars: {
        PE: { name: 'price-to-earnings ratio', tex: '\\mathrm{P/E}' },
        P: { name: 'share price', q: 'money', unit: '$', value: 39 },
        EPS: { name: 'earnings per share', q: 'money', unit: '$', value: 1.95 }
      },
      note: 'Solve for $P$ to see the price implied by a multiple you think fair; $1/\\mathrm{P/E}$ is the earnings yield.',
      practice: { unknowns: ['PE', 'P'] },
      stories: {
        PE: 'A share trades at {P} and earned {EPS} per share last year. What is its P/E?',
        P: 'A company earns {EPS} a share. What price corresponds to a P/E of {PE}?'
      }
    },
    {
      name: 'Justified P/E from growth and required return',
      expr: 'PE = p/(r - g)', tex: '\\mathrm{P/E} = \\frac{p}{r - g}',
      vars: {
        PE: { name: 'forward P/E the model supports', tex: '\\mathrm{P/E}' },
        p: { name: 'payout ratio (share of profit paid out)', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        r: { name: 'return investors require', q: 'ratio', unit: '%', value: 8 },
        g: { name: 'long-run growth of dividends', q: 'ratio', unit: '%', value: 4, signed: true }
      },
      note: 'From the constant-growth dividend model, valid only for $g < r$. Solve for $g$ to find the growth a market multiple implies.',
      practice: { unknowns: ['PE', 'g'] },
      stories: {
        PE: 'A company pays out {p} of its earnings; its dividends will grow {g} a year and investors require {r}. What forward P/E does this justify?',
        g: 'A company pays out {p} of its earnings and trades at a forward P/E of {PE}. If investors require {r}, what growth does the price imply?'
      }
    },
    {
      name: 'PEG ratio',
      expr: 'PEG = PE/(100*g)', tex: '\\mathrm{PEG} = \\frac{\\mathrm{P/E}}{100\\,g}',
      vars: {
        PEG: { name: 'P/E per point of growth' },
        PE: { name: 'price-to-earnings ratio', value: 20, tex: '\\mathrm{P/E}' },
        g: { name: 'expected yearly growth of earnings', q: 'ratio', unit: '%', value: 10 }
      },
      note: 'A rough rule of thumb, not a law: it ignores risk, how long the growth lasts, and interest rates.',
      stories: { PEG: 'A share trades at a P/E of {PE}, with earnings expected to grow {g} a year. What is its PEG ratio?' }
    },
    {
      name: 'Price after earnings growth and a change of multiple',
      expr: 'P1 = P0*(1 + g)^t*M1/M0', tex: 'P_1 = P_0\\,(1 + g)^{t}\\,\\frac{\\mathrm{PE}_1}{\\mathrm{PE}_0}',
      vars: {
        P1: { name: 'price at the end', q: 'money', unit: '$' },
        P0: { name: 'price at the start', q: 'money', unit: '$', value: 39 },
        g: { name: 'yearly growth of EPS', q: 'ratio', unit: '%', value: 6, signed: true },
        t: { name: 'years', q: 'years', unit: 'yr', value: 10 },
        M1: { name: 'P/E at the end', value: 15, tex: '\\mathrm{PE}_1' },
        M0: { name: 'P/E at the start', value: 25, tex: '\\mathrm{PE}_0' }
      },
      note: 'The price follows EPS times P/E. Set both multiples equal to see earnings growth alone.',
      practice: { unknowns: ['P1', 'M1'] },
      stories: {
        P1: 'A share at {P0} trades at {M0} times earnings. Its EPS grows {g} a year for {t}, and by then its P/E is {M1}. What is the price?',
        M1: 'A share bought at {P0} and a P/E of {M0} is worth {P1} after {t} of {g} EPS growth. What is its P/E now?'
      }
    }
  ],
  examples: [
    {
      title: 'Brewline at ¤39',
      q: 'Brewline earned ¤1.95 a share last year and analysts expect ¤2.10 next year. At ¤39, what are its trailing and forward P/E and its earnings yield?',
      steps: [
        'Trailing P/E: $39/1.95 = 20$.',
        'Forward P/E: $39/2.10 = 18.6$.',
        'Earnings yield: $1.95/39 = 5$ % — compare it with what safe bonds pay to judge what the extra risk is being paid.'
      ],
      a: 'P/E 20 trailing, 18.6 forward; earnings yield 5 %.'
    },
    {
      title: 'Same earnings, different results',
      q: 'EPS grows 6 % a year for ten years. What is the yearly price return if the P/E falls from 25 to 15 — and if it rises from 15 to 25?',
      steps: [
        'Earnings multiply by $1.06^{10} = 1.791$.',
        'P/E 25 → 15: price multiplies by $1.791 \\times 15/25 = 1.074$, which is $1.074^{1/10} - 1 = 0.7$ % a year.',
        'P/E 15 → 25: price multiplies by $1.791 \\times 25/15 = 2.985$, or 11.6 % a year.'
      ],
      a: '0.7 % a year against 11.6 % a year — the multiple paid made all the difference.'
    }
  ],
  quiz: [
    { q: 'A share trades at ¤30 and its EPS is ¤1.50. What is its P/E?', answer: 20,
      why: '30 ÷ 1.50 = 20: the price equals twenty years of current earnings.' },
    { q: 'Two companies both trade at a P/E of 8. A has stable profits; B is a steelmaker at the top of its cycle, with record profits. Which is more likely to be genuinely cheap?', choices: ['A', 'B', 'both equally', 'the P/E alone decides it'], a: 0,
      why: 'B\'s P/E is low because its earnings are at a peak that will probably not last; on normal earnings it could be expensive.' },
    { q: 'A company pays out 40 % of its profit, investors require 9 % and dividends grow 5 % a year. What forward P/E does the dividend model justify?', answer: 10,
      why: '0.40/(0.09 − 0.05) = 0.40/0.04 = 10.' },
    { q: 'A high P/E always means that a share is overpriced.', a: false,
      why: 'A high multiple can be justified by fast, durable growth or very low risk. The question is whether the growth it assumes is realistic.' },
    { q: 'EPS grows 6 % a year for ten years, but the P/E falls from 25 to 15. Roughly what yearly price return results?', choices: ['about 6 %', 'about 0.7 %', 'about −4 %', 'about 11.6 %'], a: 1,
      why: '1.06¹⁰ × 15/25 = 1.074 over ten years: about 0.7 % a year. The shrinking multiple ate nearly all the growth.' }
  ],
  applications: ['Asking what growth a share price assumes, before buying.', 'Comparing companies in the same industry on a like-for-like basis.', 'Recognising market-wide over- and under-valuation over long periods.', 'Seeing why rising interest rates tend to lower share prices.'],
  history: 'Benjamin Graham and David Dodd popularised the use of earnings multiples, and of averaging earnings over several years, in their 1934 book Security Analysis. John Campbell and Robert Shiller formalised the ten-year cyclically adjusted P/E in 1988.',
  sim: 'stk-pe'
},

/* ================================================================ dividends */
{
  id: 'dividends', parent: 'stock-valuation', title: 'Dividends and dividend yield', level: 1,
  short: 'A dividend is cash a company pays its shareholders out of profits. The dividend yield compares it with the share price, the payout ratio with earnings. Dividends are not free money — the price drops when they are paid — but reinvested, they have been a large part of long-run returns.',
  keywords: ['dividend', 'dividend yield', 'payout ratio', 'ex-dividend date', 'record date', 'payment date', 'dividend reinvestment', 'DRIP', 'yield trap', 'dividend growth', 'yield on cost', 'withholding tax', 'buyback', 'income investing', 'dividend cut'],
  prereq: ['stocks-shares', 'earnings-eps', 'compound-interest'],
  related: ['dividend-discount-model', 'stock-terminology', 'taxes-investing', 'retirement-income', 'market-indices', 'compounding-returns'],
  body: `
Owning a share of a mature, profitable company is a little like owning part of a rented flat: besides whatever the flat is worth, it pays you something regularly. That payment is the **dividend** — part of the company's profit, paid in cash to each share. A company that earns ¤4 a share and pays ¤2.40 keeps ¤1.60 to reinvest.

### The numbers that describe a dividend
For a share at ¤60 paying ¤2.40 a year, with EPS of ¤4:
- **Dividend yield:** $2.40/60 = 4$ % — the cash return at today's price.
- **Payout ratio:** $2.40/4 = 60$ % of earnings. A payout well above 100 % means the company pays more than it earns, from savings or borrowing — rarely sustainable.
- **Your income:** 500 shares receive ¤1,200 a year.

US companies usually pay quarterly; many in Europe, the UK and Japan pay twice a year or once. Some pay nothing: young, fast-growing firms typically reinvest everything.

### The dates, and why dividends are not free money
The board **declares** a dividend; whoever is on the register on the **record date** is paid on the **payment date**. Because settlement takes time, what matters for a buyer is the **ex-dividend date**: buy on or after it and the dividend goes to the seller. On that morning the price typically drops by about the dividend — a ¤60 share paying ¤0.60 opens near ¤59.40 — because ¤0.60 of cash has left the company. Your wealth is the same, part in shares and part in cash. That is the core of the Miller–Modigliani insight: in a world without taxes and costs, how a company pays out its profit does not change what owners are worth. It is **total return** — price change plus dividends — that counts.

### Reinvesting
Dividends reinvested buy more shares, which pay more dividends: compounding. Take ¤10,000 in shares whose price grows 5 % a year and which yield 3 % a year, for 30 years:

| | After 30 years |
|---|---:|
| Price growth only | ¤43,219 |
| Dividends taken as cash (added up) | ¤19,932 |
| Total if the dividends are spent | ¤63,151 |
| Total if the dividends are reinvested (8 % a year) | ¤100,627 |

Reinvesting turns ¤63,151 into ¤100,627. Over long periods, reinvested dividends have been a large share of what shareholders earned — one reason to compare funds with a total-return index ([[market-indices]]).

### Yield traps
A high yield can be a warning rather than a bargain. A company paying ¤2.40 when its share was ¤50 yielded 4.8 %. If the price falls to ¤20 because business is collapsing, the same ¤2.40 shows as a 12 % yield — for as long as it lasts. If the dividend is then cut to ¤0.80, the yield on the new price is 4 %, and the shareholder has lost 60 % of the capital as well. The yield on a screen is based on the last dividend, not the next one.

### Dividend growth
Companies that raise their dividends steadily can give a rising income. Buy at ¤40 with a ¤1.60 dividend (4 %); if the dividend grows 6 % a year, after 15 years it is ¤3.83 — 9.6 % a year on the price you paid. That "yield on cost" is pleasant, but the decision to keep holding should rest on today's price, not the old one.

### Buybacks and taxes
Buying back shares is the other way to return cash; in the US, listed companies together have in many years spent more on buybacks than on dividends. Taxes often decide which is better for a given investor: many countries tax dividends and capital gains differently, and foreign dividends usually suffer a **withholding tax** at source — 15 % under many tax treaties, which would take ¤180 of ¤1,200 — that may or may not be reclaimable ([[taxes-investing]]).
`,
  ideas: [
    'Dividend yield = dividend ÷ price; payout ratio = dividend ÷ earnings.',
    'Buy before the ex-dividend date to receive the dividend; the price then drops by about the dividend.',
    'Total return — price change plus dividends — is what counts; dividends are not extra on top.',
    'Reinvested dividends compound and have been a large part of long-run returns.',
    'A very high yield often signals a falling price and a dividend at risk of being cut.'
  ],
  pitfalls: [
    'Dividends are free money on top of the share\'s return — The price drops by about the dividend when the share goes ex-dividend; your wealth is unchanged until the business earns more.',
    'The highest yield is the best income — A high yield often reflects a collapsing price and a coming cut; check the payout ratio and the cash flow.',
    'A company that pays no dividend returns nothing to its owners — It may reinvest at high returns, buy back shares, or pay dividends later; value comes from the cash the business eventually produces.'
  ],
  formulas: [
    {
      name: 'Dividend yield',
      expr: 'y = D/P', tex: 'y = \\frac{D}{P}',
      vars: {
        y: { name: 'dividend yield', q: 'ratio', unit: '%' },
        D: { name: 'dividends per share over a year', q: 'money', unit: '$', value: 2.4 },
        P: { name: 'share price', q: 'money', unit: '$', value: 60 }
      },
      practice: { unknowns: ['y', 'P'] },
      stories: {
        y: 'A share costs {P} and pays {D} a year in dividends. What is its dividend yield?',
        P: 'A share pays {D} a year and yields {y}. What is its price?'
      }
    },
    {
      name: 'Payout ratio',
      expr: 'p = D/EPS', tex: 'p = \\frac{D}{\\mathrm{EPS}}',
      vars: {
        p: { name: 'payout ratio', q: 'ratio', unit: '%' },
        D: { name: 'dividends per share', q: 'money', unit: '$', value: 2.4 },
        EPS: { name: 'earnings per share', q: 'money', unit: '$', value: 4 }
      },
      note: 'The rest of the profit, $1 - p$, is retained to grow the business.',
      stories: { p: 'A company earns {EPS} a share and pays {D} in dividends. What is its payout ratio?' }
    },
    {
      name: 'Yield on the original price after dividend growth',
      expr: 'yoc = D*(1 + g)^t/P0', tex: 'y_{c} = \\frac{D\\,(1 + g)^{t}}{P_0}',
      vars: {
        yoc: { name: 'yield on the price you paid', q: 'ratio', unit: '%', tex: 'y_{c}' },
        D: { name: 'dividend when you bought', q: 'money', unit: '$', value: 1.6 },
        g: { name: 'yearly growth of the dividend', q: 'ratio', unit: '%', value: 6, signed: true },
        t: { name: 'years held', q: 'years', unit: 'yr', value: 15 },
        P0: { name: 'price you paid', q: 'money', unit: '$', value: 40 }
      },
      practice: { unknowns: ['yoc', 'g'] },
      stories: {
        yoc: 'You bought a share at {P0} paying {D} a year. The dividend grows {g} a year. After {t}, what is it as a yield on your purchase price?',
        g: 'You bought at {P0} when the dividend was {D}. After {t} it is {yoc} of your purchase price. How fast did it grow each year?'
      }
    },
    {
      name: 'Dividend income from a holding',
      expr: 'I = n*D', tex: 'I = n\\,D',
      vars: {
        I: { name: 'dividend income per year (before tax)', q: 'money', unit: '$' },
        n: { name: 'shares held', int: true, value: 500 },
        D: { name: 'dividend per share per year', q: 'money', unit: '$', value: 2.4 }
      },
      practice: { unknowns: ['I', 'n'] },
      stories: {
        I: 'You hold {n} shares paying {D} a year each. What is your yearly dividend income?',
        n: 'A share pays {D} a year. How many shares give an income of {I} a year?'
      }
    }
  ],
  examples: [
    {
      title: 'Yield, payout and income',
      q: 'A share costs ¤60, pays ¤2.40 a year and earns ¤4 a share. You own 500 shares. Find the yield, the payout ratio and your income, and what happens on the ex-dividend date of a ¤0.60 quarterly payment.',
      steps: [
        'Yield: $2.40/60 = 4$ %. Payout: $2.40/4 = 60$ %, so 40 % of profit is reinvested.',
        'Income: $500 \\times 2.40 = ¤1{,}200$ a year, before any tax.',
        'On the ex-dividend date the share typically opens about ¤0.60 lower, near ¤59.40; the ¤0.60 per share arrives as cash on the payment date.'
      ],
      a: '4 % yield, 60 % payout, ¤1,200 a year; the price drops by about the dividend each time.'
    },
    {
      title: 'Reinvest or spend?',
      q: '¤10,000 is invested in shares whose price grows 5 % a year and which yield 3 % a year. Compare the result after 30 years if the dividends are spent, and if they are reinvested.',
      steps: [
        'Price growth alone: $10\\,000 \\times 1.05^{30} = ¤43{,}219$.',
        'Dividends spent: each year 3 % of the value, adding up to $300 \\times (1.05^{30} - 1)/0.05 = ¤19{,}932$. Total ¤63,151.',
        'Dividends reinvested: the whole grows 8 % a year, $10\\,000 \\times 1.08^{30} = ¤100{,}627$.'
      ],
      a: '¤63,151 against ¤100,627: reinvesting adds ¤37,476.'
    }
  ],
  quiz: [
    { q: 'A share costs ¤30 and pays ¤1.50 a year in dividends. What is its yield, in per cent?', answer: 5, unit: '%',
      why: '1.50/30 = 0.05, or 5 %.' },
    { q: 'A company pays out 120 % of its earnings as dividends. What does this suggest?', choices: ['the dividend is very safe', 'the dividend is being paid partly from savings or borrowing, and may be cut unless profits rise', 'the share must be cheap', 'nothing in particular'], a: 1,
      why: 'Paying more than it earns drains the company\'s cash or adds debt; it can last a while, not for ever.' },
    { q: 'Buying a share just before it goes ex-dividend and selling right after is a way to collect free money.', a: false,
      why: 'The price typically drops by about the dividend on the ex-date, and the dividend may be taxed while the loss on the price may not offset it — plus trading costs.' },
    { q: 'A share\'s price halved while its dividend stayed the same, so the yield doubled to 12 %. What is the most likely warning?', choices: ['the dividend may soon be cut', 'the company is doing better than ever', 'the yield does not depend on the price', 'the dividend is about to double again'], a: 0,
      why: 'A collapsing price usually reflects trouble in the business; the yield on screen uses the last dividend, which may not be paid again.' },
    { q: 'You bought a share at ¤40 when it paid ¤1.60. The dividend grows 6 % a year. After 15 years, what is it as a yield on your purchase price, in per cent?', answer: 9.59, unit: '%',
      why: '¤1.60 × 1.06¹⁵ = ¤3.83, and 3.83/40 = 9.6 %.' }
  ],
  applications: ['Planning an income from investments in retirement.', 'Choosing between funds that pay out dividends and those that reinvest them.', 'Spotting a yield trap before buying for income.', 'Understanding the tax on dividends from shares abroad.']
},

/* ================================================================ dividend discount model */
{
  id: 'dividend-discount-model', parent: 'stock-valuation', title: 'The dividend discount model', level: 3,
  short: 'A share is worth the present value of all the dividends it will ever pay. If they grow at a steady rate g and investors require a return r, that sum is D₁/(r − g) — the Gordon growth model, simple and extraordinarily sensitive to its inputs.',
  keywords: ['dividend discount model', 'DDM', 'Gordon growth model', 'Gordon model', 'constant growth', 'growing perpetuity', 'required return', 'cost of equity', 'two-stage model', 'intrinsic value', 'implied return', 'valuation'],
  prereq: ['dividends', 'present-value', 'perpetuities', 'math:geometric-series'],
  related: ['dcf-valuation', 'pe-ratio', 'capm-beta', 'expected-return', 'npv', 'market-efficiency'],
  body: `
Why is a share worth anything at all? You cannot eat it or live in it; it is worth what it will pay you. If you hold it for ever, that is its dividends. If you sell it in five years, the buyer pays you for the dividends *after* year five — so either way, the value today is the [[present-value|present value]] of every dividend the company will ever pay:

$$P_0 = \\frac{D_1}{1 + r} + \\frac{D_2}{(1 + r)^2} + \\frac{D_3}{(1 + r)^3} + \\cdots$$

Here $r$ is the return investors require for the risk — the *cost of equity*, often estimated with the [[capm-beta|CAPM]].

### The Gordon growth model
If the dividend grows at a constant rate $g$ for ever — next year $D_1$, then $D_1(1 + g)$, and so on — the sum is a [[math:geometric-series|geometric series]] with ratio $(1 + g)/(1 + r)$. As long as $g < r$ it converges to a remarkably short formula, the value of a growing [[perpetuities|perpetuity]]:

$$P_0 = \\frac{D_1}{r - g}$$

A company expected to pay ¤3 next year, growing 4 % a year, with investors requiring 8 %, is worth $3/(0.08 - 0.04) = ¤75$.

### Extraordinarily sensitive
The denominator is a small difference of two uncertain numbers, and dividing by it amplifies every doubt. With $D_1 = ¤3$ and $r = 8$ %:

| Growth $g$ | Value |
|---:|---:|
| 3 % | ¤60 |
| 4 % | ¤75 |
| 5 % | ¤100 |
| 6 % | ¤150 |
| 7 % | ¤300 |

One point more growth, from 4 % to 5 %, adds a third to the value; from 6 % to 7 % it doubles it. At $g = r$ the formula explodes, and for $g > r$ it means nothing: no company can grow faster than the required return for ever. The discount rate matters just as much: at $r = 9$ % and $g = 4$ % the value falls to ¤60, at 7 % it rises to ¤100. This is why share prices react so strongly to interest rates, and why the model is best used not to find *the* price but to ask what a given price assumes.

### Reading the model backwards
Rearranged, it gives the return a price implies:

$$r = \\frac{D_1}{P_0} + g$$

— the dividend yield plus the growth rate. A share at ¤60 paying ¤3 next year, with dividends growing 4 %, offers about $5 + 4 = 9$ % a year *if* that growth materialises. This is one of the most useful rough estimates in finance, for single companies and for whole markets.

### Where the value comes from
Most of the value lies far in the future. With $g = 4$ % and $r = 8$ %, the dividends after year 10 make up 69 % of the value, after year 30 still 32 %, and after year 50 15 % — the share of the value beyond year $N$ is $\\left(\\frac{1 + g}{1 + r}\\right)^{N}$. A share is a long-lived asset, and its price is a bet on the distant future.

### Two stages
Young companies grow fast and then slow down. A **two-stage model** values a few years of high growth dividend by dividend, then applies Gordon from the year growth settles. A company paying ¤2 today, growing 10 % for five years and then 4 % for ever, at $r = 9$ %, is worth ¤53.82 — against ¤41.60 if it grew 4 % from the start — and 81 % of that value is still in the terminal part after year five. The same logic, applied to the company's free cash flows instead of dividends, is a [[dcf-valuation|discounted cash-flow valuation]].

> [!key] The model's lesson is humility: small changes in beliefs about growth and risk decades ahead make large changes in value today. Markets swing because those beliefs swing.
`,
  ideas: [
    'A share is worth the present value of all its future dividends — even if you sell, the buyer pays for the rest.',
    'With constant growth g below the required return r, the value is D₁/(r − g).',
    'The model is very sensitive: small changes in g or r move the value a lot, and it breaks down as g approaches r.',
    'Turned around, expected return ≈ dividend yield + growth.',
    'Most of a share\'s value comes from dividends many years away.'
  ],
  pitfalls: [
    'The model gives a precise value — It gives a value for precise assumptions; the assumptions are uncertain, and the answer moves a lot with them.',
    'A company can grow faster than the discount rate for ever — Then the formula gives nonsense; high growth must eventually slow, which is what the two-stage model is for.',
    'Companies that pay no dividend are worth nothing in this model — Their value lies in the cash they will return later, by dividends, buybacks or a sale; for them, discount the free cash flow instead.'
  ],
  derivation: {
    title: 'Sum the growing dividends',
    steps: [
      { text: 'Write the value as the present value of dividends growing at $g$:', tex: 'P_0 = \\sum_{t=1}^{\\infty} \\frac{D_1 (1 + g)^{t-1}}{(1 + r)^{t}} = \\frac{D_1}{1 + r} \\sum_{k=0}^{\\infty} q^{k}, \\quad q = \\frac{1 + g}{1 + r}' },
      { text: 'For $g < r$ the ratio $q$ is below 1 and the geometric series converges:', tex: '\\sum_{k=0}^{\\infty} q^{k} = \\frac{1}{1 - q} = \\frac{1 + r}{r - g}' },
      { text: 'Multiply out:', tex: 'P_0 = \\frac{D_1}{1 + r} \\cdot \\frac{1 + r}{r - g} = \\frac{D_1}{r - g}' },
      { text: 'The part of the value that comes after year $N$ is the same series starting at $q^{N}$, so it is a fraction $q^{N}$ of the whole.' }
    ]
  },
  formulas: [
    {
      name: 'Gordon growth model',
      expr: 'P0 = D1/(r - g)', tex: 'P_0 = \\frac{D_1}{r - g}',
      vars: {
        P0: { name: 'value of the share today', q: 'money', unit: '$' },
        D1: { name: 'dividend expected next year', q: 'money', unit: '$', value: 3 },
        r: { name: 'required return', q: 'ratio', unit: '%', value: 8 },
        g: { name: 'growth of the dividend, for ever', q: 'ratio', unit: '%', value: 4, signed: true }
      },
      note: 'Valid only for $g < r$. Solve for $r$ to find the return a market price implies, or for $g$ to find the growth it assumes.',
      practice: { unknowns: ['P0', 'r', 'g'] },
      stories: {
        P0: 'A company will pay {D1} a share next year, and its dividend will grow {g} a year. Investors require {r}. What is the share worth?',
        r: 'A share trades at {P0}, will pay {D1} next year, and its dividend grows {g} a year. What return does the price imply?',
        g: 'A share trades at {P0} and will pay {D1} next year. If investors require {r}, what dividend growth does the price assume?'
      }
    },
    {
      name: 'Gordon model from today\'s dividend',
      expr: 'P0 = D0*(1 + g)/(r - g)', tex: 'P_0 = \\frac{D_0\\,(1 + g)}{r - g}',
      vars: {
        P0: { name: 'value of the share today', q: 'money', unit: '$' },
        D0: { name: 'dividend just paid (last year)', q: 'money', unit: '$', value: 2 },
        r: { name: 'required return', q: 'ratio', unit: '%', value: 9 },
        g: { name: 'growth of the dividend, for ever', q: 'ratio', unit: '%', value: 5, signed: true, min: -50, max: 8.99 }
      },
      note: 'The same model when the known figure is the dividend already paid: next year\'s is $D_0(1 + g)$.',
      practice: { unknowns: ['P0', 'D0'] },
      stories: {
        P0: 'A company has just paid a dividend of {D0}; dividends grow {g} a year and investors require {r}. What is the share worth?',
        D0: 'A share worth {P0} has dividends growing {g} a year, and investors require {r}. What dividend did it just pay?'
      }
    },
    {
      name: 'Two-stage dividend model',
      expr: 'P0 = D0*(1 + g1)/(r - g1)*(1 - ((1 + g1)/(1 + r))^n) + D0*(1 + g1)^n*(1 + g2)/((r - g2)*(1 + r)^n)',
      tex: 'P_0 = \\frac{D_0 (1 + g_1)}{r - g_1}\\left(1 - \\left(\\frac{1 + g_1}{1 + r}\\right)^{n}\\right) + \\frac{D_0 (1 + g_1)^{n} (1 + g_2)}{(r - g_2)(1 + r)^{n}}',
      vars: {
        P0: { name: 'value of the share today', q: 'money', unit: '$' },
        D0: { name: 'dividend just paid', q: 'money', unit: '$', value: 2 },
        g1: { name: 'growth during the fast stage', q: 'ratio', unit: '%', value: 10, signed: true },
        n: { name: 'years of fast growth', int: true, value: 5 },
        g2: { name: 'growth for ever after', q: 'ratio', unit: '%', value: 4, signed: true, min: -50, max: 8.99 },
        r: { name: 'required return', q: 'ratio', unit: '%', value: 9, min: 4.01, max: 50 }
      },
      note: 'The first term is the present value of the fast-growing dividends, the second the Gordon value at year $n$, discounted back. The long-run growth must stay below $r$.',
      practice: { unknowns: ['P0'] },
      stories: { P0: 'A company has just paid {D0}. Its dividend will grow {g1} a year for {n} years and {g2} a year after that. Investors require {r}. What is the share worth?' }
    },
    {
      name: 'Share of the value beyond year N',
      expr: 's = ((1 + g)/(1 + r))^N', tex: 's = \\left(\\frac{1 + g}{1 + r}\\right)^{N}',
      vars: {
        s: { name: 'share of the value from dividends after year N', q: 'ratio', unit: '%' },
        g: { name: 'growth of the dividend', q: 'ratio', unit: '%', value: 4, signed: true },
        r: { name: 'required return', q: 'ratio', unit: '%', value: 8 },
        N: { name: 'years', int: true, value: 10 }
      },
      note: 'For the Gordon model. It shows how much of a share\'s value is a bet on the distant future.',
      practice: { unknowns: ['s'] },
      stories: { s: 'Dividends grow {g} a year and investors require {r}. What share of the value comes from dividends paid after year {N}?' }
    }
  ],
  examples: [
    {
      title: 'A steady dividend payer',
      q: 'A company will pay ¤3 next year; dividends grow 4 % a year and investors require 8 %. What is it worth? What if growth were 5 %, or the required return 9 %?',
      steps: [
        '$P_0 = 3/(0.08 - 0.04) = ¤75$.',
        'Growth 5 %: $3/(0.08 - 0.05) = ¤100$ — a third more for one extra point of growth.',
        'Required return 9 %: $3/(0.09 - 0.04) = ¤60$ — a fifth less.'
      ],
      a: '¤75; ¤100 with 5 % growth; ¤60 at a 9 % required return.'
    },
    {
      title: 'What return does a price imply?',
      q: 'A share trades at ¤60 and is expected to pay ¤3 next year, with dividends growing 4 % a year. What yearly return does the price offer if that growth happens?',
      steps: [
        'Dividend yield: $3/60 = 5$ %.',
        { text: 'Add the growth:', tex: 'r = \\frac{D_1}{P_0} + g = 0.05 + 0.04 = 0.09' },
        'About 9 % a year — from which the buyer must decide whether that is enough for the risk.'
      ],
      a: 'About 9 % a year.'
    },
    {
      title: 'Two stages of growth',
      q: 'A company has just paid ¤2. Dividends grow 10 % a year for five years, then 4 % for ever; investors require 9 %. What is it worth, and how much of that is the value after year five?',
      steps: [
        'Dividends in years 1–5: ¤2.20, ¤2.42, ¤2.66, ¤2.93, ¤3.22; their present value at 9 % is ¤10.28.',
        'Year 6 dividend: $3.221 \\times 1.04 = ¤3.35$. Value at year 5: $3.35/(0.09 - 0.04) = ¤67.00$; today $67.00/1.09^{5} = ¤43.54$.',
        'Total: $10.28 + 43.54 = ¤53.82$, of which 81 % is the value after year five.',
        'With 4 % growth from the start it would be $2 \\times 1.04/0.05 = ¤41.60$.'
      ],
      a: '¤53.82, with 81 % of it beyond year five.'
    }
  ],
  quiz: [
    { q: 'A company will pay ¤2 next year; dividends grow 6 % a year and investors require 10 %. What is the share worth?', answer: 50, unit: '$',
      why: '2/(0.10 − 0.06) = 2/0.04 = ¤50.' },
    { q: 'In the Gordon model, what happens to the value as the growth rate approaches the required return?', choices: ['it approaches the dividend', 'it grows without limit — a sign that the assumption cannot hold for ever', 'it falls to zero', 'nothing, g and r are unrelated'], a: 1,
      why: 'r − g shrinks towards zero, so D₁/(r − g) explodes. No company can grow faster than the discount rate for ever.' },
    { q: 'A share trades at ¤50, will pay ¤2 next year, and its dividends grow 5 % a year. What return does the price imply, in per cent?', answer: 9, unit: '%',
      why: 'Dividend yield 2/50 = 4 %, plus growth 5 % = 9 %.' },
    { q: 'A company that pays no dividends today is worth nothing according to the dividend discount model.', a: false,
      why: 'The model values all future dividends, including ones that start years from now or a final payment when the company is sold. For such firms, valuing free cash flow is usually more practical.' },
    { q: 'Interest rates rise and investors now require 9 % instead of 8 %. With D₁ = ¤3 and g = 4 %, the model value falls from ¤75 to…', choices: ['¤72', '¤67.50', '¤60', '¤37.50'], a: 2,
      why: '3/(0.09 − 0.04) = ¤60: one point on the required return cut the value by a fifth.' }
  ],
  applications: ['Asking what growth a share price, or a whole market, assumes.', 'Estimating the long-run return of a market as dividend yield plus growth.', 'Understanding why share prices fall when interest rates rise.', 'Valuing stable dividend payers such as utilities.'],
  history: 'John Burr Williams set out the idea that a share is worth the present value of its dividends in The Theory of Investment Value (1938). Myron Gordon, with Eli Shapiro, published the constant-growth formula in 1956.',
  sim: 'stk-gordon'
},

/* ================================================================ DCF */
{
  id: 'dcf-valuation', parent: 'stock-valuation', title: 'Discounted cash-flow valuation', level: 3,
  short: 'A discounted cash-flow (DCF) valuation estimates a business\'s free cash flows for some years, adds a terminal value for everything after, and discounts it all at the cost of capital. Subtract the debt and divide by the shares to get a value per share — usually dominated by the terminal value.',
  keywords: ['DCF', 'discounted cash flow', 'free cash flow', 'terminal value', 'WACC', 'cost of capital', 'enterprise value', 'equity value', 'intrinsic value', 'sensitivity analysis', 'reverse DCF', 'exit multiple', 'net debt', 'valuation'],
  prereq: ['npv', 'financial-statements', 'dividend-discount-model'],
  related: ['pe-ratio', 'capm-beta', 'irr', 'market-efficiency', 'present-value', 'credit-risk'],
  body: `
Imagine you are offered a café that will produce ¤30,000 of spare cash a year after paying everyone, growing a little each year. What would you pay for it? Not the sum of all future cash — money later is worth less than money now, and it is uncertain. You would discount each year's cash back to today at the return you need for the risk, and add them up. That is a **discounted cash-flow valuation**, the approach behind almost every serious estimate of what a business is worth — the same [[npv|net present value]] logic used to judge any investment.

### The recipe
1. **Forecast free cash flow** — cash from operations minus investment ([[financial-statements]]) — for an explicit period, typically five to ten years.
2. **Estimate a terminal value** for all the years after, usually with the Gordon formula on the last year's cash flow: $TV = CF_N (1 + g)/(w - g)$, with a modest long-run growth $g$, no higher than the economy's.
3. **Discount everything** at the weighted average cost of capital, **WACC** ($w$) — the blended return demanded by shareholders and lenders.
4. The total is the **enterprise value** — the value of the whole business. Subtract **net debt** to get the equity value, and divide by the number of shares.

### A worked valuation
A company's free cash flow will be ¤100 million next year and grow 8 % a year for five years; after that 2.5 % for ever. Its WACC is 9 %, net debt ¤300 million, and it has 50 million shares.

| Year | Free cash flow (¤M) | Discount factor at 9 % | Present value (¤M) |
|---:|---:|---:|---:|
| 1 | 100.00 | 0.9174 | 91.74 |
| 2 | 108.00 | 0.8417 | 90.90 |
| 3 | 116.64 | 0.7722 | 90.07 |
| 4 | 125.97 | 0.7084 | 89.24 |
| 5 | 136.05 | 0.6499 | 88.42 |
| Terminal value at year 5 | 2,145.39 | 0.6499 | 1,394.35 |
| **Enterprise value** | | | **1,844.73** |

Less ¤300 million of net debt leaves ¤1,544.73 million of equity: **¤30.89 a share**.

### Where the value really is
Five years of carefully forecast cash are worth ¤450 million; the terminal value, one line resting on two assumptions, is worth ¤1,394 million — **76 %** of the total. That is typical. It is why a DCF must always be shown with a sensitivity table:

| WACC, then growth after year 5 → | 2 % | 2.5 % | 3 % |
|---|---:|---:|---:|
| 8 % | ¤34.74 | ¤37.77 | ¤41.41 |
| 9 % | ¤28.78 | ¤30.89 | ¤33.37 |
| 10 % | ¤24.31 | ¤25.86 | ¤27.63 |

Reasonable inputs give anything from ¤24 to ¤41 a share. A DCF does not produce a price; it produces a range and, more importantly, a list of what you must believe.

### The discount rate
WACC weights each source of money by its share of the firm's value. With 70 % equity costing 10 % and 30 % debt at 5 % before a 25 % tax (interest is usually tax-deductible):

$$w = 0.7 \\times 10\\,\\% + 0.3 \\times 5\\,\\% \\times (1 - 0.25) = 8.1\\,\\%$$

The cost of equity is usually estimated from the risk of the shares ([[capm-beta]]); it cannot be observed directly, which is another reason for humility.

### Reverse DCF
Instead of forecasting and computing a value, start from today's price and ask what growth it implies. If a price makes sense only with 15 % growth for ten years, the question becomes whether that is believable — often a clearer way to think than defending one number.

> [!warn] A DCF is only as good as its inputs. Optimistic growth, a low discount rate and a generous terminal value can justify almost any price — as many analysts learned around 2000. Treat a DCF as a disciplined way of asking questions, never as a guarantee.
`,
  ideas: [
    'A business is worth the present value of the free cash flows it will produce.',
    'Forecast a few years explicitly, add a terminal value for the rest, discount at the WACC.',
    'Enterprise value minus net debt is equity value; divided by the shares, value per share.',
    'The terminal value is usually most of the value, so the result is very sensitive to long-run growth and the discount rate.',
    'Run it backwards (a reverse DCF) to see what growth a market price assumes.'
  ],
  pitfalls: [
    'A DCF gives the true value of a company — It gives the value implied by a set of assumptions; reasonable changes can move it by a third or more.',
    'The explicit forecast years are what matter most — Usually the terminal value is most of the total; the long-run growth and discount rate deserve the most thought.',
    'Enterprise value is what the shares are worth — Debt holders have a claim first; subtract net debt before dividing by the shares.'
  ],
  formulas: [
    {
      name: 'Present value of one year\'s cash flow',
      expr: 'PV = CF/(1 + w)^t', tex: '\\mathrm{PV} = \\frac{\\mathrm{CF}}{(1 + w)^{t}}',
      vars: {
        PV: { name: 'present value', q: 'money', unit: '$M' },
        CF: { name: 'free cash flow in that year', q: 'money', unit: '$M', value: 136.05 },
        w: { name: 'discount rate (WACC)', q: 'ratio', unit: '%', value: 9 },
        t: { name: 'years from now', q: 'years', unit: 'yr', value: 5 }
      },
      practice: { unknowns: ['PV', 'CF'] },
      stories: {
        PV: 'A business is expected to produce {CF} of free cash flow in {t}. At a discount rate of {w}, what is that worth today?',
        CF: 'At a discount rate of {w}, a cash flow {t} from now is worth {PV} today. How large is it?'
      }
    },
    {
      name: 'Terminal value (constant growth)',
      expr: 'TV = CF*(1 + g)/(w - g)', tex: '\\mathrm{TV} = \\frac{\\mathrm{CF}\\,(1 + g)}{w - g}',
      vars: {
        TV: { name: 'terminal value at the end of the forecast', q: 'money', unit: '$M' },
        CF: { name: 'free cash flow in the last forecast year', q: 'money', unit: '$M', value: 136.05 },
        g: { name: 'growth for ever after', q: 'ratio', unit: '%', value: 2.5, signed: true, min: -20, max: 8.99 },
        w: { name: 'discount rate (WACC)', q: 'ratio', unit: '%', value: 9 }
      },
      note: 'Valid only for $g < w$; long-run growth is usually set no higher than the long-run growth of the economy.',
      practice: { unknowns: ['TV', 'CF'] },
      stories: {
        TV: 'In the last year of a forecast, free cash flow is {CF}. It will then grow {g} a year for ever, and the WACC is {w}. What is the terminal value?',
        CF: 'A terminal value of {TV} was computed with growth of {g} and a WACC of {w}. What was the last year\'s free cash flow?'
      }
    },
    {
      name: 'Weighted average cost of capital',
      expr: 'w = E/(E + D)*re + D/(E + D)*rd*(1 - tc)', tex: 'w = \\frac{E}{E + D}\\,r_e + \\frac{D}{E + D}\\,r_d\\,(1 - t_c)',
      vars: {
        w: { name: 'WACC', q: 'ratio', unit: '%' },
        E: { name: 'market value of the equity', q: 'money', unit: '$M', value: 700 },
        D: { name: 'value of the debt', q: 'money', unit: '$M', value: 300 },
        re: { name: 'cost of equity', q: 'ratio', unit: '%', value: 10 },
        rd: { name: 'cost of debt (before tax)', q: 'ratio', unit: '%', value: 5 },
        tc: { name: 'tax rate', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 }
      },
      note: 'Debt is cheaper than equity, and its interest is usually tax-deductible — but more debt also raises the risk, and so the cost, of both.',
      practice: { unknowns: ['w', 're'] },
      stories: {
        w: 'A company has equity worth {E} costing {re} and debt of {D} costing {rd} before tax, with a tax rate of {tc}. What is its WACC?',
        re: 'A company with equity of {E}, debt of {D} at {rd} and a tax rate of {tc} has a WACC of {w}. What is its cost of equity?'
      }
    },
    {
      name: 'Value per share from enterprise value',
      expr: 'v = (EV - ND)/N', tex: 'v = \\frac{\\mathrm{EV} - \\mathrm{ND}}{N}',
      vars: {
        v: { name: 'value per share', q: 'money', unit: '$', signed: true },
        EV: { name: 'enterprise value', q: 'money', unit: '$M', value: 1844.73 },
        ND: { name: 'net debt (debt minus cash)', q: 'money', unit: '$M', value: 300, signed: true },
        N: { name: 'number of shares', int: true, value: 50000000 }
      },
      practice: { unknowns: ['v', 'EV'] },
      stories: {
        v: 'A DCF gives an enterprise value of {EV}. The company has net debt of {ND} and {N} shares. What is the value per share?',
        EV: 'A company has net debt of {ND} and {N} shares. What enterprise value corresponds to {v} a share?'
      }
    }
  ],
  examples: [
    {
      title: 'A five-year DCF',
      q: 'Free cash flow will be ¤100 million next year, growing 8 % a year to year 5, then 2.5 % for ever. WACC 9 %, net debt ¤300 million, 50 million shares. Value a share, and find the terminal value\'s share of the total.',
      steps: [
        'Cash flows: 100, 108, 116.64, 125.97, 136.05 (¤M). Discounted at 9 % they are worth ¤450.38 million.',
        { text: 'Terminal value at year 5:', tex: '\\mathrm{TV} = \\frac{136.05 \\times 1.025}{0.09 - 0.025} = ¤2{,}145.39\\ \\text{million}' },
        'Discounted five years: $2\\,145.39/1.09^{5} = ¤1{,}394.35$ million.',
        'Enterprise value $450.38 + 1\\,394.35 = ¤1{,}844.73$ million; equity $1\\,844.73 - 300 = ¤1{,}544.73$ million; per share $1\\,544.73/50 = ¤30.89$.',
        'Terminal value share: $1\\,394.35/1\\,844.73 = 76$ %.'
      ],
      a: '¤30.89 a share, 76 % of it from the terminal value.'
    },
    {
      title: 'The cost of capital',
      q: 'A company is financed 70 % by equity costing 10 % and 30 % by debt costing 5 % before tax; the tax rate is 25 %. What is its WACC?',
      steps: [
        'After-tax cost of debt: $5 \\times (1 - 0.25) = 3.75$ %.',
        'Weighted: $0.7 \\times 10 + 0.3 \\times 3.75 = 7 + 1.125 = 8.125$ %.'
      ],
      a: 'A WACC of about 8.1 %.'
    }
  ],
  quiz: [
    { q: 'The last forecast year\'s free cash flow is ¤50 million; after that it grows 2 % a year for ever, and the WACC is 8 %. What is the terminal value, in millions?', answer: 850, unit: '$M',
      why: '50 × 1.02/(0.08 − 0.02) = 51/0.06 = ¤850 million.' },
    { q: 'In a typical DCF of a healthy company, which part makes up most of the value?', choices: ['the first year\'s cash flow', 'the explicit forecast years together', 'the terminal value', 'the net debt'], a: 2,
      why: 'Most of a going concern\'s cash lies beyond any five- or ten-year forecast; in the worked example the terminal value is 76 % of the total.' },
    { q: 'A DCF gives an enterprise value of ¤2,000 million. Net debt is ¤500 million and there are 100 million shares. What is the value per share?', answer: 15, unit: '$',
      why: '(2,000 − 500)/100 = ¤15 a share.' },
    { q: 'A DCF value is more reliable than the market price because it is calculated rather than guessed.', a: false,
      why: 'Its inputs — growth, margins, the discount rate — are estimates; modest changes move the result by a third or more. It is a structured way to ask what must be true.' },
    { q: 'In the worked example, raising the WACC from 9 % to 10 % (growth unchanged at 2.5 %) changes the value per share from ¤30.89 to about…', choices: ['¤30.58', '¤25.86', '¤15.45', '¤41.41'], a: 1,
      why: 'Every cash flow is discounted more and the terminal value shrinks: one point on the discount rate takes 16 % off the value.' }
  ],
  applications: ['Understanding how analysts arrive at a "target price", and how fragile it is.', 'Valuing a private business, or a stake in one, before buying.', 'Asking what growth a share price assumes (reverse DCF).', 'Judging any investment that produces cash over many years.'],
  sim: 'stk-dcf'
},

/* ================================================================ market efficiency */
{
  id: 'market-efficiency', parent: 'stock-valuation', title: 'Efficient markets and technical analysis', level: 2,
  short: 'In a busy market, news is reflected in prices within minutes, so price changes are hard to predict and beating the market after costs is rare. Charts of pure chance are full of trends and patterns — which is why chart signals deserve suspicion.',
  keywords: ['efficient market hypothesis', 'EMH', 'random walk', 'technical analysis', 'chart patterns', 'moving average', 'support and resistance', 'momentum', 'anomalies', 'data mining', 'backtest', 'overfitting', 'active management', 'survivorship bias', 'luck and skill'],
  prereq: ['stocks-shares', 'pe-ratio', 'math:probability-basics'],
  related: ['active-vs-passive', 'index-investing', 'bubbles', 'cognitive-biases', 'bull-bear-markets', 'volatility', 'investment-fees'],
  body: `
Suppose a trader notices that a share always rises on Mondays. She buys every Friday; so do the people she tells; soon everyone is buying on Friday, the price rises on Friday instead, and the Monday pattern is gone. In a market full of people hunting for an edge, any reliable, easy pattern tends to destroy itself by being used. That is the core of the **efficient market hypothesis**: prices already reflect the available information, so their next move depends on news that nobody can yet know.

### Three strengths of the idea
- **Weak form:** past prices contain no exploitable pattern — charts cannot beat the market.
- **Semi-strong form:** all public information (results, news, forecasts) is in the price within minutes — careful reading of public reports cannot beat it either.
- **Strong form:** even private information is reflected. Nobody believes this one fully; insider dealing is illegal precisely because it would pay.

### What the evidence says
Prices do react to news within seconds to minutes. Price changes from day to day are close to unpredictable — close to a **random walk**, the idea Louis Bachelier proposed for the Paris market in 1900. And the most practical test is clear: studies comparing actively managed funds with their benchmarks, published regularly for the US, Europe and other markets, find that over 10 to 15 years a large majority — often around eight or nine in ten — fall behind after costs. Those that beat the market in one period rarely keep doing so.

But markets are not perfect. Some patterns have persisted in many countries — **momentum** (shares that rose over the past year tending to keep rising for a few months) and a premium for cheap and small companies over long periods — though they come and go and may be rewards for risk. **Bubbles** ([[bubbles]]) show that prices can drift far from any sensible value for years. And there is a neat paradox: if markets were perfectly efficient, nobody would bother to research companies, and then they would stop being efficient. The best summary is that markets are *efficient enough* that beating them reliably, after costs, is very hard.

### Why charts fool us
Technical analysis reads price charts for trends, "support" and "resistance" levels, moving-average crossovers and named patterns. The trouble is that pure chance draws all of them. Flip a coin to move a price up or down each day and you get trends, double tops, and levels the price seems to bounce off — our eyes are built to find patterns, and a random walk supplies endless ones. The simulation below draws charts from nothing but random numbers; try spotting the "signals".

The deeper trap is **data mining**. Test 20 useless trading rules, each at the usual 5 % level of statistical significance, and the chance that at least one looks like a winner is $1 - 0.95^{20} = 64$ %. Test 100 and it is 99.4 %. A strategy found by searching past data, then shown off with a beautiful backtest, has often only found the noise. The same logic explains star managers: among 1,000 managers with no skill at all, each with an even chance of beating the market in a year, about 31 will beat it five years in a row — and they will have compelling stories.

$$p = 1 - (1 - \\alpha)^{m}$$

### What it means for you
- Be sceptical of anyone selling predictions, signals or systems — if they worked, selling them would be the worst way to use them.
- Costs are certain, extra returns are not: a low-cost, diversified [[index-investing|index fund]] captures the market's return, which most active investors fail to beat ([[active-vs-passive]]).
- Prices can still be wrong — in bubbles especially — but knowing *that* is far easier than knowing *when*.

> [!note] This page explains the evidence; it does not say that nobody can ever beat the market, or that any particular fund will or will not. It says the odds are long, and that luck and skill look alike over short periods.
`,
  ideas: [
    'In an efficient market, prices reflect available information quickly, so their next move is close to unpredictable.',
    'Most actively managed funds lag their benchmark after costs over long periods.',
    'Random walks draw trends and chart patterns by chance; seeing them proves nothing.',
    'Testing many rules on past data guarantees some false "discoveries".',
    'Markets are efficient enough that beating them reliably is hard, though bubbles and persistent patterns show they are not perfect.'
  ],
  pitfalls: [
    'A chart pattern that appeared before a rise will predict the next rise — Random price paths produce the same patterns by chance; without a test on new data, a pattern is only a story.',
    'A manager who beat the market five years in a row must be skilled — Among many managers, some will do so by luck alone; a long record is suggestive, not proof.',
    'Efficient markets mean prices are always right — They mean prices are hard to predict; bubbles show prices can be far from value for years.'
  ],
  formulas: [
    {
      name: 'Chance of at least one false discovery',
      expr: 'p = 1 - (1 - a)^m', tex: 'p = 1 - (1 - \\alpha)^{m}',
      vars: {
        p: { name: 'chance at least one useless rule looks significant', q: 'ratio', unit: '%' },
        a: { name: 'significance level of each test', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50, tex: '\\alpha' },
        m: { name: 'rules tested', int: true, value: 20 }
      },
      note: 'For independent tests of rules with no real power. Solve for $m$ to see how few tests keep the risk small.',
      practice: { unknowns: ['p', 'm'] },
      stories: {
        p: 'You test {m} trading rules that in truth have no power, each at a significance level of {a}. What is the chance that at least one looks like a winner?',
        m: 'Each test uses a significance level of {a}. How many useless rules can you test before the chance of a false winner reaches {p}?'
      }
    },
    {
      name: 'Expected number of lucky streaks',
      expr: 'E = N*q^k', tex: 'E = N\\,q^{k}',
      vars: {
        E: { name: 'expected number with a perfect streak' },
        N: { name: 'managers (or traders)', int: true, value: 1000 },
        q: { name: 'chance of beating the market in one year by luck', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        k: { name: 'years in a row', int: true, value: 5 }
      },
      note: 'With no skill at all. Real track records must be compared with this number, not with zero.',
      practice: { unknowns: ['E'] },
      stories: { E: 'Among {N} fund managers with no skill, each has a {q} chance of beating the market in a year. How many would you expect to beat it {k} years in a row?' }
    },
    {
      name: 'Spread of a random walk over time',
      expr: 's = sigma*sqrt(t)', tex: 's = \\sigma\\sqrt{t}',
      vars: {
        s: { name: 'typical range of outcomes (one standard deviation)', q: 'ratio', unit: '%' },
        sigma: { name: 'yearly volatility', q: 'ratio', unit: '%', value: 20 },
        t: { name: 'time', q: 'years', unit: 'yr', value: 4 }
      },
      note: 'Random steps add up: the spread grows with the square root of time, which is why a random chart wanders into long "trends".',
      practice: { unknowns: ['s', 't'] },
      stories: {
        s: 'A share has a yearly volatility of {sigma}. If its moves are a random walk, how wide is the typical range of outcomes after {t}?',
        t: 'With a yearly volatility of {sigma}, after how long does the typical range of a random walk reach {s}?'
      }
    }
  ],
  examples: [
    {
      title: 'Twenty indicators, one "discovery"',
      q: 'An analyst tests 20 chart indicators on ten years of prices, calling one "significant" if it passes a test at the 5 % level. Suppose none has any real power. How likely is it that at least one looks significant anyway?',
      steps: [
        'Each useless rule passes by chance with probability 0.05, and fails with 0.95.',
        'All 20 fail with probability $0.95^{20} = 0.358$.',
        'So at least one "works": $1 - 0.358 = 0.642$, about 64 %.',
        'The honest check is to test the chosen rule on data it has never seen — and to count every rule that was tried.'
      ],
      a: 'About 64 %: finding one winner among twenty is the expected result of pure chance.'
    },
    {
      title: 'A thousand coin-flippers',
      q: '1,000 managers have no skill; each beats the market in a given year with probability 50 %. How many beat it five years in a row? Ten years?',
      steps: [
        'Five years: $1\\,000 \\times 0.5^{5} = 31.25$ — about 31 managers with perfect five-year records.',
        'Ten years: $1\\,000 \\times 0.5^{10} = 0.98$ — about one.',
        'With thousands of funds in the world, impressive streaks are guaranteed, whether or not anyone is skilled.'
      ],
      a: 'About 31 for five years and about 1 for ten, by luck alone.'
    }
  ],
  quiz: [
    { q: 'You test 10 trading rules that in truth have no power, each at a 5 % significance level. What is the chance that at least one looks significant, in per cent?', answer: 40.13, unit: '%',
      why: '1 − 0.95¹⁰ = 0.401: two chances in five of a false discovery from only ten tries.' },
    { q: 'A company announces surprisingly good profits at 8:00, before trading starts. When does its share price mostly adjust?', choices: ['over the following weeks, as investors read the report', 'within seconds to minutes of trading', 'at the next quarterly report', 'never, prices ignore news'], a: 1,
      why: 'Professional traders and algorithms act on public news almost at once; by the time most people read it, it is in the price.' },
    { q: 'A clear head-and-shoulders pattern in a price chart proves that the price is predictable.', a: false,
      why: 'Random walks produce such shapes by chance. Only a rule tested on new data, after costs, could show predictability.' },
    { q: 'Over 15 years, what share of actively managed US large-company funds has typically lagged its benchmark after costs?', choices: ['about a quarter', 'about half', 'a large majority, around eight or nine in ten', 'none'], a: 2,
      why: 'Studies comparing funds with their benchmarks find this regularly: costs are certain, and extra returns before costs are rare and fleeting.' },
    { q: '1,000 managers with no skill each have a 50 % chance of beating the market in a year. How many would you expect to beat it five years in a row?', answer: 31.25,
      why: '1,000 × 0.5⁵ = 31.25. Streaks that look like skill appear by chance when many people try.' }
  ],
  applications: ['Judging claims about trading systems, signals and star managers.', 'Choosing between low-cost index funds and active funds with the evidence in mind.', 'Recognising data-mined backtests and overfitted strategies.', 'Understanding why news is "priced in" before most people hear it.'],
  history: 'Louis Bachelier modelled prices on the Paris exchange as a random walk in his thesis of 1900. Paul Samuelson argued in 1965 that well-anticipated prices should fluctuate randomly, and Eugene Fama set out the efficient market hypothesis in 1970. In 2013 Fama shared the Nobel prize in economics with Robert Shiller, who had shown how far prices can stray from fundamentals, and Lars Peter Hansen.',
  sim: { id: 'stk-chart', params: { overlay: 'ma' } }
}

);
