/* HYPER-FINANCES · content/crises.js — Booms and busts: bubbles, financial crises,
 * recessions and recoveries, and hyperinflation. Simulations in sims/macro.js. */
Hyper.add(

/* ================================================================ BUBBLES */
{
  id: 'bubbles', parent: 'crises', title: 'Bubbles', level: 2,
  short: 'A bubble is a run-up in the price of an asset far beyond what its income can justify, kept going mainly by the expectation that the price will keep rising. Bubbles are easy to see afterwards and hard to identify at the time; the ones financed with borrowed money do the most damage when they burst.',
  keywords: ['bubble', 'asset bubble', 'speculative bubble', 'mania', 'tulip mania', 'South Sea Bubble', 'dot-com bubble', 'housing bubble', 'Japanese bubble', 'greater fool', 'momentum', 'herd behaviour', 'euphoria', 'Minsky', 'fundamental value', 'crash', 'fear of missing out', 'FOMO'],
  prereq: ['dividend-discount-model', 'market-efficiency', 'cognitive-biases'],
  related: ['financial-crises', 'business-cycle', 'drawdowns', 'leverage-basics', 'margin-calls', 'property-leverage', 'pe-ratio', 'loss-aversion', 'math:geometric-series'],
  body: `
In the winter of 1636–37 a rare tulip bulb in the Dutch Republic reportedly sold for the price of a fine house; within weeks the buyers vanished and prices collapsed. The story has been embellished over the centuries — historians now think the mania was narrower than legend says — but the pattern it names keeps recurring: a price climbs far beyond anything the asset's income can justify, because people buy expecting to sell to someone else at a higher price.

### What makes a bubble
Every asset has a **fundamental value**: the present value of the income it will produce — rents, dividends, interest ([[dividend-discount-model]]). For a share expected to pay a dividend of ¤4 next year, growing steadily, with investors requiring 7 % a year,

$$V = \\frac{D}{k - g}$$

gives ¤133 if dividends grow 4 % a year. Here is the first reason bubbles are hard to spot: if investors come to believe growth will be 5 %, the value is ¤200; at 6 %, ¤400. Small changes in beliefs about a distant future justify huge changes in price, so almost any price can be defended by a confident enough story — "a new era", "this time is different", "they are not making any more land".

A **bubble** is a price that runs far ahead of any reasonable version of that value and is held up mainly by its own momentum. Its engine is feedback: rising prices attract buyers, whose buying lifts prices further. Every market mixes two kinds of trader:
- **value buyers** compare the price with fundamental value, buying when it is cheap and selling when it is dear — they pull the price back;
- **momentum buyers** follow recent price changes — they push it further the way it is already going.

When momentum buyers dominate, and especially when they buy with **borrowed money**, a rise feeds on itself until new buyers run out. Then the same feedback runs in reverse, and forced sellers facing [[margin-calls]] or loan repayments sell into a falling market. The simulation shows how the mix of the two kinds of trader, and credit, turns a calm market into booms and busts.

### A recurring cast
Hyman Minsky and the historian Charles Kindleberger described a common sequence: a **displacement** (a new technology, a financial innovation, cheap credit), a **boom**, **euphoria** in which lending standards slip and newcomers pile in, **distress** as insiders sell, and **panic**.
- **The South Sea Bubble (Britain, 1720)**: the company's shares rose about eightfold in six months on promises of trade and a scheme to take over government debt, and collapsed before the year was out.
- **Japan (late 1980s)**: share and land prices soared on cheap credit; the Nikkei index peaked at the end of 1989, fell about 80 % by 2003, and regained its 1989 peak only in 2024.
- **The dot-com bubble (late 1990s)**: internet shares traded at prices implying decades of flawless growth; the Nasdaq index fell 78 % from March 2000 to October 2002 and took fifteen years to regain its peak.
- **US housing (2000s)**: prices rose on loose lending and the belief that house prices never fall nationwide; they fell roughly a quarter to a third from 2006 to 2012, setting off the [[financial-crises|crisis of 2008]].

### Can bubbles be seen in advance?
Economists disagree, instructively. Eugene Fama argued that prices reflect available information and that bubbles called in advance rarely lead reliably to crashes; Robert Shiller showed that valuations such as the price-to-earnings ratio swing far more than later dividends justify, and that high valuations have been followed by low long-run returns. They shared the Nobel prize in 2013, and both points can hold: valuation says something about the next decade and little about the next year. Studies of many countries find that the dangerous booms are the credit-fuelled ones: the dot-com bust brought a mild recession, the housing bust a global crisis, because banks and households had borrowed against the houses.

### What it means for you
A 78 % fall needs a 355 % rise to recover — at 10 % a year, almost sixteen years. When an asset is soaring and everyone around you is buying, the useful questions are the dull ones: what income does it produce, what would I have to believe for this price to make sense, and what happens to me if it halves — especially if I have borrowed to buy. The fear of missing out ([[cognitive-biases]]) is strongest exactly when the risk is highest.
`,
  ideas: [
    'Fundamental value is the present value of an asset\'s future income; a bubble is a price far above any reasonable version of it.',
    'Because value depends on growth far into the future, small shifts in belief justify large price changes — so bubbles are hard to prove in real time.',
    'Momentum buyers amplify moves; value buyers pull prices back; the mix decides whether booms feed on themselves.',
    'Credit turns a bubble into a crisis: borrowed money magnifies the rise and forces selling in the fall.',
    'After a fall of L, a gain of L ÷ (1 − L) is needed to recover: 50 % needs 100 %, 80 % needs 400 %.'
  ],
  pitfalls: [
    'A high price proves a bubble — Prices can be high because rates are low or growth prospects are genuinely good; the test is what one must believe about future income to justify the price.',
    'If the price has risen for years it will keep rising — Momentum persists for a while and then reverses; past gains say nothing about who will buy next.',
    'A 50 % fall followed by a 50 % rise gets you back — It leaves you 25 % down: ¤100 becomes ¤50, then ¤75.'
  ],
  formulas: [
    {
      name: 'Fundamental value of a growing stream (Gordon)',
      expr: 'V = D/(k - g)', tex: 'V = \\frac{D}{k - g}',
      vars: {
        V: { name: 'fundamental value per share', q: 'money', unit: '$' },
        D: { name: 'dividend expected next year', q: 'money', unit: '$', value: 4 },
        k: { name: 'required yearly return', q: 'ratio', unit: '%', value: 7, min: 0.01, max: 50 },
        g: { name: 'expected yearly growth of the dividend, for ever', q: 'ratio', unit: '%', value: 4, signed: true, min: -20, max: 30 }
      },
      note: 'Only meaningful for $g < k$. The closer $g$ gets to $k$, the more the value explodes — the arithmetic behind "new era" prices.',
      practice: { unknowns: ['V', 'g'] },
      stories: {
        V: 'A share will pay {D} next year, dividends grow {g} a year, and investors require {k}. What is it worth?',
        g: 'A share paying {D} next year trades at {V}; investors require {k}. What growth rate is the price assuming, for ever?'
      }
    },
    {
      name: 'Gain needed to recover from a loss',
      expr: 'G = 1/(1 - L) - 1', tex: 'G = \\frac{1}{1 - L} - 1',
      vars: {
        G: { name: 'rise needed to get back', q: 'ratio', unit: '%' },
        L: { name: 'fall from the peak', q: 'ratio', unit: '%', value: 78, min: 0, max: 99.9 }
      },
      stories: {
        G: 'An index falls {L} from its peak. By how much must it then rise to get back to the peak?',
        L: 'An investment needs to rise {G} to regain its peak. How far had it fallen?'
      }
    }
  ],
  examples: [
    {
      title: 'How beliefs move a price',
      q: 'A share will pay a dividend of ¤4 next year and investors require 7 % a year. Value it with dividends growing 4 %, 5 % and 6 % a year for ever.',
      steps: [
        '$g = 4\\%$: $V = 4/(0.07 - 0.04) = ¤133.33$.',
        '$g = 5\\%$: $V = 4/0.02 = ¤200$ — 50 % more for one extra point of growth.',
        '$g = 6\\%$: $V = 4/0.01 = ¤400$.',
        'Nothing about next year\'s dividend changed; only the belief about growth for ever. That is why the fundamental value of a young, fast-growing company is so uncertain, and why optimism can carry a price so far.'
      ],
      a: '¤133, ¤200 and ¤400.'
    },
    {
      title: 'The arithmetic of a crash',
      q: 'An index falls 78 % from its peak, as the Nasdaq did in 2000–02. What rise is needed to get back, and how long does it take at 10 % a year?',
      steps: [
        'Gain needed: $1/(1 - 0.78) - 1 = 3.545$, a rise of 354.5 %.',
        'Time at 10 % a year: $\\ln 4.545/\\ln 1.1 = 15.9$ years.',
        'The Nasdaq in fact took about fifteen years to regain its March 2000 peak.'
      ],
      a: 'A 355 % rise, about sixteen years at 10 % a year.'
    }
  ],
  quiz: [
    { q: 'An asset falls 50 %. What rise, in %, brings it back to where it started?', answer: 100, unit: '%',
      why: 'From 50 back to 100 is a doubling: $1/(1 - 0.5) - 1 = 100\\%$.' },
    { q: 'Which kind of bubble has historically done the most damage when it burst?', choices: ['one in collectibles bought with savings', 'one financed with borrowed money by banks and households', 'one in a single company\'s shares', 'one in a currency'], a: 1,
      why: 'Debt spreads the loss: borrowers default, lenders\' capital shrinks, credit dries up for everyone. The housing bust of 2006–12 did far more damage than the unleveraged dot-com bust.' },
    { q: 'A very high price is proof of a bubble.', a: false,
      why: 'Low interest rates or genuinely strong growth can justify high prices. A bubble is a price beyond any reasonable estimate of value, kept up mostly by expected price rises.' },
    { q: 'A share will pay ¤2 next year; dividends grow 6 % a year for ever; investors require 8 %. What is its value, in ¤?', answer: 100, unit: '$',
      why: '$V = 2/(0.08 - 0.06) = ¤100$.' },
    { q: 'A momentum buyer buys because…', choices: ['the price is below fundamental value', 'the price has been rising', 'dividends are high', 'the company has little debt'], a: 1,
      why: 'Momentum traders follow recent price changes. They amplify moves in both directions; value traders, who compare price with value, pull prices back.' }
  ],
  applications: ['Asking what an asset\'s price assumes about the future before buying it.', 'Recognising the signs of a credit-fuelled boom: fast lending growth, slipping standards, "this time is different".', 'Understanding why falls take so long to recover from.', 'Keeping borrowed money away from assets that can halve.'],
  sim: 'mac-bubble'
},

/* ================================================================ FINANCIAL CRISES */
{
  id: 'financial-crises', parent: 'crises', title: 'Financial crises', level: 3,
  short: 'A financial crisis is a sudden breakdown in the system that moves money between savers and borrowers: bank runs, fire sales, frozen credit markets, currency collapses or government defaults. Leverage and short-term funding turn losses into panics; lenders of last resort, deposit insurance and capital rules are the defences.',
  keywords: ['financial crisis', 'banking crisis', 'global financial crisis', '2008 crisis', 'Lehman Brothers', 'subprime', 'euro crisis', 'sovereign debt crisis', 'currency crisis', 'contagion', 'fire sale', 'deleveraging', 'bank capital', 'bailout', 'bail-in', 'lender of last resort', 'Basel III', 'systemic risk', 'moral hazard'],
  prereq: ['how-banks-work', 'leverage-basics', 'bank-runs', 'bubbles'],
  related: ['central-banks', 'deposit-insurance', 'quantitative-easing', 'fiscal-policy', 'recessions', 'exchange-rates', 'credit-risk', 'margin-calls'],
  body: `
Most of the time the financial system is invisible: salaries arrive, cards work, mortgages are granted, companies roll over their loans. A **financial crisis** is when that plumbing seizes — depositors rush to withdraw, lenders refuse even sound borrowers, asset prices collapse because everyone sells at once, and the damage spreads from finance to jobs and incomes. Crises come in a few kinds, often together: **banking crises**, **currency crises** ([[exchange-rates]]) and **sovereign debt crises** ([[fiscal-policy]]).

### Two ingredients: leverage and short funding
A bank funds long-term loans with short-term deposits and borrowing, and holds only a thin layer of its own capital. With assets of ¤100 bn and equity of ¤5 bn it is leveraged 20 times, and a 5 % fall in the value of its assets wipes out its equity. Before 2008 some investment banks ran at about 30 to 1, where 3.3 % was enough. [[leverage-basics|Leverage]] multiplies every change: at 20 to 1, a 2 % fall in asset values is a 40 % fall in equity.

Short-term funding adds the second danger: lenders who can leave overnight leave at the first doubt. That is the classic [[bank-runs|bank run]], today as often through wholesale funding and money markets as through queues at the door.

### How a loss becomes a panic
Take that bank with ¤100 bn of assets and ¤5 bn of equity, and let its assets fall 2 %. It now has ¤98 bn of assets and ¤3 bn of equity — leverage 32.7. To get back to 20 it must shrink to ¤60 bn of assets: sell ¤38 bn. If many banks hold similar assets and sell at once, prices fall further, cutting every holder's equity again and forcing more sales. This **fire-sale spiral**, runs on short-term funding, and uncertainty about who holds the losses turn a moderate loss into a system-wide crisis. Lenders hoard cash, credit to healthy firms dries up, and the economy falls into [[recessions|recession]].

### 2008
US house prices began falling in 2006. Mortgages to weak borrowers had been packaged into securities held around the world, often with borrowed money, and nobody knew where the losses lay. In 2007 Britain saw its first bank run in well over a century. In September 2008 Lehman Brothers failed; within days a giant insurer needed rescue, a money-market fund could no longer repay its investors in full, and interbank lending froze. Iceland's three big banks, together many times the country's GDP, collapsed. Governments guaranteed deposits and debts and put capital into banks; central banks lent without limit and cut rates to zero. Output in the advanced economies fell about 3–4 % in 2009, and the recovery took years.

### The euro crisis
In 2010–12 sovereign and banking crises fed on each other. Greece revealed a far larger deficit than reported, lost access to markets and received the first of three rescue programmes in 2010; Ireland, whose government had guaranteed its banks' debts, and Portugal followed, and Spain received help for its banks. In 2012 Greece's private creditors accepted a restructuring that cut the face value of their bonds by more than half. Italian and Spanish yields soared until July 2012, when the ECB's president pledged to do "whatever it takes" to preserve the euro and backed it with a bond-buying programme; spreads fell without the programme ever being used. In Cyprus in 2013, large uninsured deposits at the two biggest banks took heavy losses — a **bail-in**.

### The defences, and their price
- **Lender of last resort**: central banks lend to solvent banks against collateral in a panic ([[central-banks]]).
- **Deposit insurance** removes ordinary depositors' reason to run ([[deposit-insurance]]).
- **Capital and liquidity rules**: after 2008 the Basel III standards raised the equity banks must hold and required liquid assets to cover a month of stressed outflows.
- **Resolution regimes**: rules for winding down a failing bank with losses borne by shareholders and bondholders rather than taxpayers.

Each has a cost that fuels debate: rescues can reward risk-taking (**moral hazard**), and tighter rules can make credit dearer. Carmen Reinhart and Kenneth Rogoff, surveying eight centuries of crises, found the same warnings again and again: fast credit growth, soaring asset prices, heavy foreign borrowing — and the conviction that this time is different.

### What it means for you
Crises are rare in any one country, but not in a lifetime. Deposit insurance protects balances up to a limit per bank, which is worth knowing precisely; borrowing that must be refinanced in a panic is the most exposed kind; and forced sellers sell at the bottom. The leverage that multiplies a bank's losses multiplies a household's too ([[margin-calls]]).
`,
  ideas: [
    'Crises combine leverage (a thin layer of equity) with short-term funding that can run.',
    'At leverage L, an asset fall of 1/L wipes out equity; smaller falls force asset sales to restore leverage.',
    'Fire sales, runs and uncertainty about who holds losses spread a loss through the whole system.',
    'Banking, currency and sovereign crises often come together, as in 2008 and the euro crisis.',
    'Lenders of last resort, deposit insurance, capital rules and resolution regimes are the defences; each carries a cost in moral hazard or dearer credit.'
  ],
  pitfalls: [
    'Crises are caused by one bad bank or one villain — The damage comes from the system: many firms with similar assets, too little equity and runnable funding.',
    'A solvent bank cannot fail — A sound bank can fail if it cannot meet withdrawals; that is why lenders of last resort exist.',
    'Bank rescues give money to bankers for free — Rescues usually take equity stakes or charge fees and wipe out shareholders; many were repaid, some at a loss. The moral-hazard concern is real but different: expecting rescue encourages risk.'
  ],
  formulas: [
    {
      name: 'Leverage',
      expr: 'L = A/E', tex: 'L = \\frac{A}{E}',
      vars: {
        L: { name: 'leverage (assets per unit of equity)' },
        A: { name: 'total assets', q: 'money', unit: '$bn', value: 100 },
        E: { name: 'equity (own capital)', q: 'money', unit: '$bn', value: 5 }
      },
      note: 'A fall in asset values of $1/L$ — here 5 % — wipes the equity out.',
      stories: { L: 'A bank has {A} of assets and {E} of equity. What is its leverage?', E: 'A bank with {A} of assets is leveraged {L} times. How much equity does it have?' }
    },
    {
      name: 'Equity change from a change in asset values',
      expr: 'dE = L*dA', tex: '\\Delta E = L\\,\\Delta A',
      vars: {
        dE: { name: 'change in equity, in per cent', q: 'ratio', unit: '%', signed: true, tex: '\\Delta E' },
        L: { name: 'leverage', value: 20 },
        dA: { name: 'change in asset values, in per cent', q: 'ratio', unit: '%', value: -2, signed: true, min: -100, max: 100, tex: '\\Delta A' }
      },
      note: 'Over a short period, ignoring funding costs. Losses beyond −100 % mean the firm owes more than it owns.',
      stories: { dE: 'A bank leveraged {L} times sees its assets change by {dA}. By how much does its equity change?' }
    },
    {
      name: 'Assets to sell to restore leverage after a fall',
      expr: 'S = A*(1 - x) - L*(E - A*x)', tex: 'S = A(1 - x) - L\\,(E - A\\,x)',
      vars: {
        S: { name: 'assets to sell', q: 'money', unit: '$bn' },
        A: { name: 'assets before the fall', q: 'money', unit: '$bn', value: 100 },
        x: { name: 'fall in asset values', q: 'ratio', unit: '%', value: 2, max: 100 },
        L: { name: 'target leverage', value: 20 },
        E: { name: 'equity before the fall', q: 'money', unit: '$bn', value: 5 }
      },
      note: 'After the fall the bank holds $A(1-x)$ with equity $E - Ax$; to return to leverage $L$ its assets must shrink to $L(E - Ax)$.',
      practice: { unknowns: ['S', 'x'] },
      stories: {
        S: 'A bank with {A} of assets and {E} of equity targets leverage of {L}. Its assets lose {x}. How much must it sell to get back to its target?',
        x: 'A bank with {A} of assets and {E} of equity targets leverage of {L}. After a fall in asset values it must sell {S}. How large was the fall?'
      }
    }
  ],
  examples: [
    {
      title: 'A thin layer of equity',
      q: 'A bank has ¤100 bn of assets and ¤5 bn of equity. What is its leverage? What does a 2 % fall in asset values do to its equity, and what fall wipes it out?',
      steps: [
        'Leverage: $100/5 = 20$.',
        'A 2 % fall removes ¤2 bn of assets, all of it from equity: ¤5 bn becomes ¤3 bn, a 40 % loss ($20 \\times 2\\%$).',
        'Wipe-out: a fall of $5/100 = 5\\%$. At 30 to 1 it would be 3.3 %.'
      ],
      a: 'Leverage 20; equity −40 %; 5 % wipes it out.'
    },
    {
      title: 'The fire-sale spiral',
      q: 'The same bank wants to stay at leverage 20. After the 2 % fall, how much must it sell? If its sales, and other banks\' sales, push the value of its remaining assets down a further 1 %, where does it stand?',
      steps: [
        'After the fall: assets ¤98 bn, equity ¤3 bn, leverage 32.7.',
        'To return to 20 it needs assets of $20 \\times 3 = ¤60$ bn: sell $98 - 60 = ¤38$ bn.',
        'A further 1 % fall on ¤60 bn: assets ¤59.4 bn, equity ¤2.4 bn, leverage 24.75 — above target again, so more selling follows.',
        'Each round of selling depresses prices for every holder: this is how a small loss becomes a crisis unless someone — often the central bank — steps in as buyer or lender.'
      ],
      a: 'It must sell ¤38 bn, and a further 1 % fall pushes leverage back to 24.75.'
    }
  ],
  quiz: [
    { q: 'A bank has ¤200 bn of assets and ¤10 bn of equity. What fall in asset values, in %, wipes out its equity?', answer: 5, unit: '%',
      why: '$10/200 = 5\\%$ — one over the leverage of 20.' },
    { q: 'Why do fire sales spread a crisis?', choices: ['they raise interest rates on deposits', 'one bank\'s selling lowers prices, and so the equity, of every bank holding similar assets', 'they are illegal', 'they increase bank profits'], a: 1,
      why: 'Assets are marked to their market price; forced selling pushes prices down for everyone, triggering more forced selling.' },
    { q: 'Deposit insurance aims to remove the reason for ordinary depositors to run.', a: true,
      why: 'If deposits up to a limit are guaranteed, small depositors lose nothing by waiting, so a rumour need not become a run.' },
    { q: 'A fund is leveraged 25 times. Its assets fall 1 %. By how much, in %, does its equity change?', answer: -25, unit: '%',
      why: '$25 \\times (-1\\%) = -25\\%$.' },
    { q: 'What is a bail-in?', choices: ['a government buying a failing bank', 'imposing a failing bank\'s losses on its shareholders, bondholders and large uninsured depositors', 'a central-bank loan', 'a merger of two banks'], a: 1,
      why: 'Instead of taxpayers rescuing the bank (a bail-out), those who invested in or lent large sums to it absorb the losses, as in Cyprus in 2013.' }
  ],
  applications: ['Understanding why banks are required to hold capital and liquid assets.', 'Knowing how deposit insurance protects savings, and its limits.', 'Recognising the build-up of leverage and short-term funding before crises.', 'Reading the history of 2008 and the euro crisis with the mechanism in view.'],
  sim: { id: 'mac-bubble', params: { focus: 'credit' } }
},

/* ================================================================ RECESSIONS AND RECOVERIES */
{
  id: 'recessions', parent: 'crises', title: 'Recessions and recoveries', level: 2,
  short: 'A recession is a broad, lasting fall in economic activity: output, jobs, incomes and sales shrink together. Most are short and followed by recovery; those caused by financial crises tend to be deeper and slower. Policy can soften them, and households can prepare for them.',
  keywords: ['recession', 'depression', 'Great Depression', 'Great Recession', 'stagflation', 'oil shock', 'pandemic recession', 'recovery', 'V-shaped recovery', 'U-shaped', 'L-shaped', 'double dip', 'scarring', 'balance-sheet recession', 'automatic stabilisers', 'stimulus', 'downturn', 'slump'],
  prereq: ['business-cycle', 'unemployment', 'gdp'],
  related: ['financial-crises', 'monetary-policy', 'fiscal-policy', 'emergency-fund', 'bull-bear-markets', 'drawdowns', 'money-anxiety', 'math:logarithms'],
  body: `
A recession is the downswing of the [[business-cycle|business cycle]] seen from the ground: orders dry up, hours are cut, hiring stops, some firms close, and people who lose their jobs spend less, which spreads the slump further. Official dating committees look for a **significant decline in activity spread across the economy and lasting more than a few months**; the popular shorthand is two quarters in a row of falling real GDP. A **depression** is an exceptionally deep and long recession, with no precise threshold.

### What causes them
- **Demand shocks**: a collapse in confidence, investment or credit, or policy tightened too hard.
- **Supply shocks**: a sudden rise in the cost of producing. The oil shocks of 1973 and 1979 roughly quadrupled and then doubled the price of oil, bringing the painful combination of recession and high inflation called **stagflation**.
- **Financial crises**: when banks are damaged and households and firms are over-indebted, everyone pays down debt at once ([[financial-crises]]). These recessions tend to be deeper and recoveries slower; the economist Richard Koo called them *balance-sheet recessions*.
- **Exceptional events**: war, or the pandemic of 2020, when output fell by design as economies closed.

### Four recessions
| Episode | What happened | Rough scale |
|---|---|---|
| Great Depression, 1929–33 (US) | stock crash, thousands of bank failures, money supply down about a third, falling prices | real GDP down about a quarter; unemployment about 25 % |
| Stagflation, 1973–75 and 1980–82 (US) | oil shocks, then very high interest rates to break inflation | unemployment 9 % in 1975 and near 11 % in 1982 |
| Great Recession, 2008–09 | banking crisis after the housing bust | US real GDP down about 4 %, unemployment 10 %; slow recovery |
| Pandemic, 2020 | lockdowns closed whole sectors | output down roughly 8 % (US) and 20 % (UK) in one quarter; fast rebound |

The 1930s shaped everything after. Milton Friedman and Anna Schwartz blamed the depth of the Depression on the Federal Reserve letting the money supply and the banks collapse; John Maynard Keynes argued that when private spending collapses, government must spend. Countries that left the gold standard earlier, freeing their monetary policy, generally recovered sooner. In 2008 and 2020 central banks and governments acted fast and on a vast scale — with results still debated, including the inflation that followed 2020.

### The shape of recovery
Recoveries are described by letters: **V** (a sharp fall and fast rebound, like 2020), **U** (a long bottom), **W** (a relapse, as in 1980–82) and **L** (output never regains its old path). The arithmetic is unforgiving. A 4 % fall followed by 2 % growth a year takes about two years to regain the old *level*. But the economy would have grown in the meantime: getting back to the old *trend* from 8 % below it takes 8.5 years at 3 % growth against a 2 % trend. When the gap never closes — common after financial crises — the lost output is permanent, and long unemployment erodes skills and investment (**scarring**).

### Policy
Automatic stabilisers — falling taxes, rising benefits — act first. Central banks cut rates and, if needed, buy assets ([[quantitative-easing]]); governments may add stimulus ([[fiscal-policy]]). The debate is about dose and timing: too little risks long unemployment, too much or too long risks inflation and debt. Supply-shock recessions are the hardest, because supporting jobs with cheaper money can entrench inflation.

### What it means for you
Recessions frighten because they are unpredictable, but their pattern is well known. Most last months rather than years — the typical post-war US recession about ten. Job losses concentrate in cyclical industries and among newer employees. Share prices usually fall before a recession is declared and often start recovering while the news is still bad, so selling after the fall locks the loss in ([[bull-bear-markets]], [[drawdowns]]). An [[emergency-fund]], fixed payments you can carry, and a plan written in calm times turn a recession from a crisis into a hard year.
`,
  ideas: [
    'A recession is a broad, lasting decline in output, jobs, incomes and sales — not just one weak number.',
    'Demand shocks, supply shocks, financial crises and exceptional events cause recessions; financial-crisis recessions are deeper and slower.',
    'Stagflation, from supply shocks, combines falling output with high inflation and is the hardest for policy.',
    'Regaining the old level is quicker than regaining the old trend; unclosed gaps are permanent losses.',
    'Most recessions last months, markets tend to turn before the economy, and preparation beats prediction.'
  ],
  pitfalls: [
    'Two negative quarters is the official definition everywhere — It is a shorthand; dating committees in the US and the euro area weigh jobs, income and sales, and can call a recession without it or not call one despite it.',
    'When output is back to its old peak, the damage is repaired — The economy would have grown meanwhile; the gap to the old trend, and the income lost in the years below it, may never be recovered.',
    'Recessions always bring falling prices — Demand-driven ones usually lower inflation, but supply shocks bring stagflation: falling output with rising prices.'
  ],
  formulas: [
    {
      name: 'Years to regain the pre-recession level',
      expr: 't = ln(1/(1 - L))/ln(1 + g)', tex: 't = \\frac{\\ln\\frac{1}{1 - L}}{\\ln(1 + g)}',
      vars: {
        t: { name: 'years to regain the old peak', q: 'years', unit: 'yr' },
        L: { name: 'fall in output from the peak', q: 'ratio', unit: '%', value: 4, min: 0, max: 99 },
        g: { name: 'growth during the recovery', q: 'ratio', unit: '%', value: 2, min: 0.01, max: 50 }
      },
      stories: {
        t: 'Output fell {L} in a recession. If it then grows {g} a year, how long until it is back at its old peak?',
        g: 'Output fell {L}. What yearly growth brings it back to the old peak in {t}?'
      }
    },
    {
      name: 'Years to return to the old trend',
      expr: 't = ln(1/(1 - G))/ln((1 + g)/(1 + gt))', tex: 't = \\frac{\\ln\\frac{1}{1 - G}}{\\ln\\frac{1 + g}{1 + g_t}}',
      vars: {
        t: { name: 'years to close the gap to the old trend', q: 'years', unit: 'yr' },
        G: { name: 'shortfall below the old trend', q: 'ratio', unit: '%', value: 8, min: 0, max: 99 },
        g: { name: 'growth during the recovery', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 50 },
        gt: { name: 'trend growth', q: 'ratio', unit: '%', value: 2, min: 0, max: 20, tex: 'g_t' }
      },
      note: 'Only possible if recovery growth exceeds the trend; if it merely matches it, the gap is permanent.',
      stories: {
        t: 'After a slump output is {G} below its old trend. The trend is {gt} a year and the economy now grows {g}. How long until it is back on trend?',
        g: 'Output is {G} below trend, and trend growth is {gt}. What growth closes the gap in {t}?'
      }
    }
  ],
  examples: [
    {
      title: 'Back to the old level',
      q: 'Output falls 4 % in a recession and then grows 2 % a year. How long until it is back at its old peak? And after a 10 % fall?',
      steps: [
        '$t = \\ln(1/0.96)/\\ln 1.02 = 0.0408/0.0198 = 2.06$ years.',
        'After a 10 % fall: $\\ln(1/0.90)/\\ln 1.02 = 5.3$ years.',
        'Deeper falls take disproportionately longer at the same growth rate — one reason policymakers try hard to limit the depth.'
      ],
      a: 'About 2.1 years after a 4 % fall; 5.3 years after a 10 % fall.'
    },
    {
      title: 'Back to the old trend',
      q: 'After a financial crisis, output is 8 % below where its 2 % trend would have taken it. How long to return to the trend if the economy grows 3 % a year? And at 4 %?',
      steps: [
        'Each year the gap closes by the factor $1.03/1.02$: $t = \\ln(1/0.92)/\\ln(1.03/1.02) = 8.5$ years.',
        'At 4 %: $\\ln(1/0.92)/\\ln(1.04/1.02) = 4.3$ years.',
        'Recoveries after financial crises are often slow, near trend growth — which is why their losses so often become permanent.'
      ],
      a: '8.5 years at 3 % growth; 4.3 years at 4 %.'
    }
  ],
  quiz: [
    { q: 'What is stagflation?', choices: ['fast growth with low inflation', 'stagnant or falling output combined with high inflation', 'falling prices in a boom', 'a stock-market crash'], a: 1,
      why: 'Supply shocks such as the oil shocks of the 1970s raise costs, cutting output and raising prices at the same time.' },
    { q: 'Output fell 10 % in a recession. At 2 % growth a year, about how many years does it take to regain its old peak?', answer: 5.32, unit: 'yr',
      why: '$\\ln(1/0.9)/\\ln 1.02 = 5.32$ years.' },
    { q: 'Recessions that follow financial crises tend to be deeper and to have slower recoveries.', a: true,
      why: 'Damaged banks lend less, and indebted households and firms cut spending to repair their balance sheets, for years.' },
    { q: 'Share prices, relative to a recession, usually…', choices: ['start falling only after unemployment peaks', 'fall before the recession is declared and often recover before it ends', 'move independently of the economy', 'rise during recessions'], a: 1,
      why: 'Markets price expected future profits, so they tend to lead the economy in both directions.' },
    { q: 'Why is a supply-shock recession especially hard for a central bank?', choices: ['rates cannot be cut', 'cutting rates to support jobs can push already-high inflation further up', 'supply shocks never end', 'governments cannot spend'], a: 1,
      why: 'Output falls while prices rise; easing helps one problem and worsens the other.' }
  ],
  applications: ['Preparing a household for a recession: emergency fund, carrying fixed costs, not being a forced seller.', 'Reading recession news with the historical scale in mind.', 'Understanding why policy responds as it does in different kinds of recession.', 'Seeing why recoveries after financial crises take so long.'],
  sim: { id: 'mac-cycle', params: { focus: 'recession' } }
},

/* ================================================================ HYPERINFLATION */
{
  id: 'hyperinflation', parent: 'crises', title: 'Hyperinflation', level: 2,
  short: 'Hyperinflation is inflation out of control — by the classic definition, prices rising more than 50 % a month. It almost always begins with a government covering large deficits by creating money, and accelerates as people rush to spend a currency they no longer trust. It ends with a credible fiscal and monetary reform.',
  keywords: ['hyperinflation', 'Weimar', 'Germany 1923', 'Hungary 1946', 'Zimbabwe', 'Venezuela', 'money printing', 'quantity theory of money', 'velocity of money', 'MV = PY', 'seigniorage', 'inflation tax', 'Cagan', 'currency collapse', 'dollarisation', 'stabilisation', 'Israel 1985', 'high inflation', 'Rentenmark'],
  prereq: ['inflation-cpi', 'central-banks', 'fiscal-policy', 'math:exponential-growth-decay'],
  related: ['what-is-money', 'exchange-rates', 'index-linked-mortgages', 'inflation-linked-bonds', 'real-vs-nominal', 'math:logarithmic-scales'],
  body: `
In the autumn of 1923 German workers were paid daily, sometimes twice a day, and hurried to the shops before the money lost more of its value. A US dollar that had bought 4.2 marks in 1914 bought 4.2 trillion in November 1923 — a trillion-fold fall. **Hyperinflation** is rare, and it is the extreme that shows most clearly what money is: a shared belief that it will still buy something tomorrow. When that belief breaks, money stops working.

### A definition and a scale
Phillip Cagan defined hyperinflation in 1956 as prices rising more than **50 % a month**. That sounds modest until it compounds: $1.5^{12} - 1$ is about 12,875 % a year, and prices double every 52 days. The worst episodes went far beyond it:

| Episode | Peak month | Monthly inflation | Prices doubled every |
|---|---|---:|---:|
| Germany | October 1923 | about 29,500 % | 3.7 days |
| Hungary | July 1946 | about $4.2 \\times 10^{16}$ % | 15 hours |
| Zimbabwe | November 2008 | about $8 \\times 10^{10}$ % | 25 hours |

(The peak-month figures are reconstructions and approximate — especially Zimbabwe's, where official statistics stopped.)

### How it starts: printing to pay the bills
The **quantity equation** links money $M$, its **velocity** $V$ (how many times a year each unit is spent), the price level $P$ and real output $Y$:

$$M\\,V = P\\,Y$$

It is an identity — spending equals the value of what is bought — but it frames the story. A government that cannot tax or borrow enough, after a war, a collapse in output or the loss of its credit, covers the gap by having the central bank create money. More money chasing the same or fewer goods raises prices. The revenue raised this way is the **inflation tax**: it falls on everyone holding the currency, whose money loses value.

### How it runs away: the flight from money
Then velocity joins in. When prices rise fast, holding money is costly, so people spend wages at once, buy goods to store, and switch to foreign currency. Velocity rises and real money balances shrink, so each new injection raises prices *more*. With money growing 40 % a month, velocity rising 10 % a month and output falling 2 % a month, prices rise $1.4 \\times 1.1/0.98 - 1 = 57\\%$ a month. As real balances shrink, the inflation tax collects less at any given rate, so a government that must keep covering its deficit prints ever faster — the spiral in the simulation. Output collapses as trade falls back on barter and foreign currency. Savings in the currency — deposits, pensions, bonds — are wiped out, while debtors see their debts vanish.

### How it ends
Hyperinflations stop abruptly when three things happen together: the budget deficit is closed or honestly financed, the central bank is barred from financing the government, and a new or anchored currency earns trust. Germany did it in November 1923 with the Rentenmark, worth a trillion old marks, and an end to money-financed spending. Zimbabwe abandoned its own currency in 2009, after issuing a 100-trillion-dollar note, and transactions moved to the US dollar and the South African rand.

Israel's stabilisation of July 1985 is studied worldwide as very high inflation — about 450 % in 1984, short of Cagan's threshold but heading towards it — stopped without a collapse. The plan combined a deep cut in the budget deficit, a devaluation followed by a fixed exchange rate against the dollar, a temporary freeze of prices and wages agreed with the trade unions and employers, and a law forbidding the Bank of Israel to finance the deficit. Inflation fell to about 20 % in 1986 and kept falling in the years after. Earlier attempts relying on price controls alone had failed; what worked was fixing the budget and the money together.

### What it means for you
In high inflation the rules of personal finance change: cash and fixed-income savings in the currency melt; wages, rents and loans get linked to an index or a foreign currency (Israel's mortgages were linked to the CPI for this reason, and many still are — [[index-linked-mortgages]]); real assets and foreign currency hold value. For most readers the lesson is quieter: whether inflation is 2 % or 20 %, or 20 % or 2,000 %, is decided mostly by budgets and central-bank independence — which is why those institutions are guarded so closely.
`,
  ideas: [
    'Hyperinflation means prices rising more than 50 % a month — about 12,875 % a year.',
    'It begins when a government finances large deficits by creating money: the inflation tax.',
    'It accelerates as velocity rises: people flee the currency, real balances shrink, and each injection raises prices more.',
    'It ends abruptly with a credible package: close the deficit, bar central-bank financing, anchor or replace the currency.',
    'Savers in the currency lose, debtors gain, and contracts move to indices and foreign currency.'
  ],
  pitfalls: [
    'Hyperinflation is caused by greedy shopkeepers — Prices rise because money is created far faster than output and trust in it collapses; price controls alone have failed repeatedly.',
    'Printing money always leads to hyperinflation — The danger is persistent financing of large deficits with a central bank that cannot refuse; money created in other circumstances, as in QE in the 2010s, did not.',
    'In hyperinflation people hold more cash because prices are high — They hold as little as possible and spend it at once; velocity soars, which speeds the inflation.'
  ],
  formulas: [
    {
      name: 'The quantity equation',
      expr: 'M*V = P*Y', tex: 'M\\,V = P\\,Y',
      vars: {
        M: { name: 'money in circulation', q: 'money', unit: '$bn', value: 100 },
        V: { name: 'velocity (times each unit is spent per year)', value: 5 },
        P: { name: 'price level (base = 1)' },
        Y: { name: 'real output per year, in base-year prices', q: 'money', unit: '$bn', value: 500 }
      },
      solveFor: 'P',
      note: 'An identity: spending equals the value of what is bought. It becomes a theory of prices when velocity and output are stable — which they are not in a hyperinflation.',
      practice: { unknowns: ['P', 'V'] },
      stories: {
        P: 'Money in circulation is {M}, each unit is spent {V} times a year, and real output is {Y}. What is the price level?',
        V: 'Money in circulation is {M}, real output {Y} and the price level {P}. How many times a year is each unit spent?'
      }
    },
    {
      name: 'Inflation from money, velocity and output growth',
      expr: 'p = (1 + mg)*(1 + v)/(1 + y) - 1', tex: '\\pi = \\frac{(1 + \\mu)(1 + v)}{1 + y} - 1',
      vars: {
        p: { name: 'inflation over the period', q: 'ratio', unit: '%', signed: true, tex: '\\pi' },
        mg: { name: 'growth of the money supply', q: 'ratio', unit: '%', value: 40, signed: true, min: -90, max: 1e6, tex: '\\mu' },
        v: { name: 'growth of velocity', q: 'ratio', unit: '%', value: 10, signed: true, min: -90, max: 1e4 },
        y: { name: 'growth of real output', q: 'ratio', unit: '%', value: -2, signed: true, min: -90, max: 100 }
      },
      note: 'The quantity equation in growth rates. For small rates $\\pi \\approx \\mu + v - y$.',
      practice: { unknowns: ['p', 'mg'] },
      stories: {
        p: 'This month the money supply grows {mg}, velocity rises {v} and real output changes by {y}. What is inflation this month?',
        mg: 'Inflation is {p} a month, velocity rises {v} and output changes by {y}. How fast is money growing?'
      }
    },
    {
      name: 'How fast prices double',
      expr: 'T = ln(2)/(12*ln(1 + m))', tex: 'T_2 = \\frac{\\ln 2}{12\\,\\ln(1 + m)}',
      vars: {
        T: { name: 'time for prices to double', q: 'years', unit: 'day', tex: 'T_2' },
        m: { name: 'inflation per month', q: 'ratio', unit: '%', value: 29500, min: 0.01, max: 1e18 }
      },
      note: 'With $m$ a monthly rate the formula gives years; the default shows it in days. Germany\'s 29,500 % in October 1923 doubled prices every 3.7 days.',
      stories: {
        T: 'Prices rise {m} a month. How long does it take them to double?',
        m: 'Prices double every {T}. What is the monthly inflation rate?'
      }
    }
  ],
  examples: [
    {
      title: 'Cagan\'s threshold, compounded',
      q: 'Prices rise 50 % a month — the threshold of hyperinflation. What is that per year, and how often do prices double?',
      steps: [
        'Per year: $1.5^{12} = 129.7$, so prices rise about 12,875 %.',
        'Doubling time: $\\ln 2/\\ln 1.5 = 1.71$ months, about 52 days.',
        'At Germany\'s peak of about 29,500 % a month the multiplier was 296 a month: $\\ln 2/\\ln 296 = 0.122$ months, or 3.7 days.'
      ],
      a: 'About 12,875 % a year; prices double every 52 days (every 3.7 days at Germany\'s peak).'
    },
    {
      title: 'The spiral in numbers',
      q: 'Money in circulation is ¤100 bn, velocity 5 and real output ¤500 bn, so the price level is 1. The government doubles the money supply; people, expecting inflation, spend faster (velocity 7.5); and output falls 10 %. What happens to prices? Then: money growing 40 % a month, velocity rising 10 % a month, output falling 2 % a month — monthly inflation?',
      steps: [
        'Before: $P = MV/Y = 100 \\times 5/500 = 1$.',
        'After: $P = 200 \\times 7.5/450 = 3.33$ — prices more than triple although money only doubled.',
        'Monthly: $\\pi = 1.4 \\times 1.1/0.98 - 1 = 57\\%$ a month, past Cagan\'s threshold.'
      ],
      a: 'Prices rise 3.3-fold; 57 % a month in the second case.'
    }
  ],
  quiz: [
    { q: 'Prices rise 50 % a month for a year. By what factor are they higher at the end?', answer: 129.75,
      why: '$1.5^{12} = 129.75$ — about 12,875 % inflation over the year.' },
    { q: 'What usually starts a hyperinflation?', choices: ['a stock-market crash', 'a government covering large deficits by having the central bank create money', 'a sudden rise in wages', 'high interest rates'], a: 1,
      why: 'Nearly every episode — Germany 1923, Hungary 1946, Zimbabwe 2008 — began with deficits financed by the central bank after war, collapse or lost credit.' },
    { q: 'During a hyperinflation people hold more cash, because each note buys less.', a: false,
      why: 'They hold as little as possible and spend it immediately; velocity soars and real money balances collapse.' },
    { q: 'Which combination ended Israel\'s high inflation in 1985?', choices: ['price controls alone', 'a deficit cut, a fixed exchange rate, an agreed wage-price freeze and a ban on central-bank financing of the deficit', 'printing a new currency with more zeros', 'raising import tariffs'], a: 1,
      why: 'Earlier price freezes without fiscal change had failed; the 1985 plan fixed the budget, the money and expectations together.' },
    { q: 'The money supply grows 20 % in a year while velocity and real output are unchanged. What is inflation, in %?', answer: 20, unit: '%',
      why: '$\\pi = 1.2 \\times 1/1 - 1 = 20\\%$: with $V$ and $Y$ fixed, prices grow with money.' }
  ],
  applications: ['Understanding why central banks are barred from financing governments.', 'Seeing why high-inflation countries link wages, rents and mortgages to an index or a foreign currency.', 'Reading about currencies in trouble: deficits, money growth and the flight from money.', 'Appreciating what a stable currency is worth to savers.'],
  sim: 'mac-hyper'
}

);
