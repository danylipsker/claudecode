/* HYPER-FINANCES · content/money-policy.js — Money, rates and governments: central banks,
 * monetary policy, quantitative easing, fiscal policy, exchange rates and the balance of
 * payments. Simulations in sims/macro.js. */
Hyper.add(

/* ================================================================ CENTRAL BANKS */
{
  id: 'central-banks', parent: 'money-policy', title: 'Central banks', level: 1,
  short: 'A central bank issues a country\'s money, keeps the accounts through which commercial banks pay one another, sets the short-term interest rate from which other rates are priced, and lends to banks in a panic. Most have a mandate centred on low inflation and are independent of day-to-day politics.',
  keywords: ['central bank', 'Federal Reserve', 'Fed', 'European Central Bank', 'ECB', 'Bank of England', 'Bank of Israel', 'policy rate', 'bank reserves', 'lender of last resort', 'mandate', 'central bank independence', 'inflation target', 'seigniorage', 'banknotes', 'monetary authority'],
  prereq: ['what-is-money', 'how-banks-work', 'inflation-cpi'],
  related: ['monetary-policy', 'quantitative-easing', 'money-creation', 'bank-runs', 'deposit-insurance', 'exchange-rates', 'hyperinflation'],
  body: `
Every country's money traces back to one institution. The **central bank** issues the notes in your wallet, holds the accounts that commercial banks use to pay one another, and sets the interest rate from which the price of almost every loan and deposit is built. It does not take deposits from the public or lend to households: its customers are the banks and the government, and its business is the value of money itself.

### What it does
- **Issues currency.** Notes and coins are claims on the central bank that pay no interest.
- **Runs the banks' bank.** Commercial banks hold **reserves** at the central bank and settle payments among themselves across its books every day. Your transfer to someone at another bank ends as a movement of reserves between the two banks' accounts.
- **Sets the policy rate.** By choosing what it pays on reserves and charges on loans to banks, it anchors overnight interest rates. Banks price deposits and variable-rate loans from there, and long-term rates respond more loosely ([[monetary-policy]]).
- **Lends in a panic.** As **lender of last resort** it lends to sound banks facing a run, against good collateral, so that a rush for cash does not topple the system ([[bank-runs]]). Walter Bagehot's rule of 1873 still guides it: lend freely, to solvent banks, against good collateral, at a penalty rate.
- Often **supervises banks**, watches the stability of the whole system and manages the country's foreign-currency reserves.

### Its balance sheet
| Assets | Liabilities |
|---|---|
| Government bonds | Banknotes in circulation |
| Loans to banks | Banks' reserves |
| Foreign-currency reserves and gold | The government's account |
| | Capital |

When a central bank buys a bond it pays by crediting a bank's reserve account — money created with a keystroke, which is why it is bound by rules. (Most money people use is created by ordinary banks when they lend: [[money-creation]].)

Because notes pay no interest while the bonds behind them do, issuing currency earns an income called **seigniorage**: with ¤100 bn of notes in circulation and yields of 4 %, about ¤4 bn a year, normally handed to the treasury. Holders of cash pay for it in forgone interest and in inflation: at 3 % a year, ¤5,000 kept in cash loses ¤145.63 of purchasing power in one year.

### Mandates and independence
Most central banks now have an explicit goal. The European Central Bank's primary mandate is price stability, defined as 2 % inflation over the medium term; the US Federal Reserve has a dual mandate of maximum employment and stable prices; the Bank of Israel aims for inflation of 1–3 % while supporting growth, employment and financial stability. New Zealand pioneered the formal **inflation target** around 1990, and dozens of countries followed.

In most democracies they are also **independent**: the elected government sets the goal, and the central bank chooses the interest rate without political instruction. The case for it: a government facing an election is tempted to engineer a quick boom whose inflation arrives later, and people who expect that build it into wages and prices; a bank with a public target and no election to win can promise low inflation credibly. The case against: unelected officials make decisions with large effects on jobs, house prices and who owns what, and critics want more accountability.

### A short history
Sweden's Riksbank (1668) and the Bank of England (1694, founded to lend to the government for war) are the oldest. The US Federal Reserve was created in 1913 after the banking panic of 1907, the Bank of Israel in 1954, and the European Central Bank in 1998, running policy for the euro from 1999. Independence with an inflation goal spread mostly after the inflation of the 1970s and 1980s: Israel's 1985 stabilisation included a law ending the central bank's financing of government deficits, and the Bank of England gained operational independence in 1997.

### What it means for you
Central-bank decisions reach you within weeks through [[variable-rate-mortgages|variable-rate loans]], savings rates and credit cards, and within months through house prices, the exchange rate and the job market. An inflation target is also a promise about your savings: at 2 % a year money loses half its value in 35 years — slowly enough to plan around, which is the point.
`,
  ideas: [
    'The central bank issues currency, holds banks\' reserves, and settles payments between banks.',
    'It sets the short-term policy rate; other interest rates are priced from it, some closely and some loosely.',
    'As lender of last resort it lends to sound banks in a panic against good collateral.',
    'Most central banks have an inflation goal and are independent, so their low-inflation promise is credible.',
    'Issuing non-interest-bearing currency earns seigniorage; cash holders pay through forgone interest and inflation.'
  ],
  pitfalls: [
    'The central bank sets my mortgage rate — It sets the overnight rate. Variable rates follow it closely; fixed rates follow long-term bond yields, which also reflect expected inflation and risk.',
    'Central banks lend to people and companies — They deal with banks and the government. Households and firms borrow from commercial banks and markets.',
    'Independence means no accountability — The goal is set by law or by the government, decisions are published and explained, and governors answer to parliament; what is delegated is the choice of the rate.'
  ],
  formulas: [
    {
      name: 'Seigniorage: the income from issuing currency',
      expr: 'S = i*Cu', tex: 'S = i\\,C_u',
      vars: {
        S: { name: 'yearly income from issuing notes', q: 'money', unit: '$bn' },
        i: { name: 'interest rate on the central bank\'s assets', q: 'ratio', unit: '%', value: 4 },
        Cu: { name: 'banknotes and coins in circulation', q: 'money', unit: '$bn', value: 100, tex: 'C_u' }
      },
      note: 'Notes are an interest-free loan from the public to the central bank; the income is roughly the interest earned on the assets that back them.',
      stories: { S: 'A country has {Cu} of notes in circulation and the central bank earns {i} on its bonds. How much seigniorage does it earn in a year?' }
    },
    {
      name: 'Purchasing power lost on cash',
      expr: 'L = A*(1 - 1/(1 + p)^t)', tex: 'L = A\\left(1 - \\frac{1}{(1 + \\pi)^t}\\right)',
      vars: {
        L: { name: 'purchasing power lost, in today\'s money', q: 'money', unit: '$' },
        A: { name: 'cash held', q: 'money', unit: '$', value: 5000 },
        p: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 1000, tex: '\\pi' },
        t: { name: 'years held', q: 'years', unit: 'yr', value: 1 }
      },
      practice: { unknowns: ['L', 't'] },
      stories: {
        L: 'You keep {A} in cash for {t} while inflation is {p} a year. How much purchasing power do you lose?',
        t: 'At {p} inflation, how long until {A} of cash has lost {L} of purchasing power?'
      }
    }
  ],
  examples: [
    {
      title: 'A payment between two banks',
      q: 'You transfer ¤1,000 from your account at Bank A to a friend at Bank B. What happens on the central bank\'s books, and does the amount of money change?',
      steps: [
        'Bank A lowers your deposit by ¤1,000; Bank B raises your friend\'s by ¤1,000.',
        'To settle, the central bank moves ¤1,000 of reserves from Bank A\'s account to Bank B\'s.',
        'Deposits in total and reserves in total are unchanged: money moved, none was created. Only the central bank can change the total of reserves, by lending to banks or buying assets.'
      ],
      a: 'Reserves move from A to B at the central bank; total money is unchanged.'
    },
    {
      title: 'What cash costs its holder',
      q: 'You keep ¤5,000 in cash at home while inflation runs at 3 % a year. How much purchasing power is lost after one year and after ten?',
      steps: [
        'After one year: $5{,}000 \\times (1 - 1/1.03) = ¤145.63$.',
        'After ten years: $5{,}000 \\times (1 - 1/1.03^{10}) = ¤1{,}279.53$ — about a quarter.',
        'A deposit paying at least the inflation rate would have kept the purchasing power; that gap is part of what seigniorage and the inflation tax take.'
      ],
      a: '¤145.63 after a year, ¤1,279.53 after ten.'
    }
  ],
  quiz: [
    { q: 'In most countries, who can hold an account at the central bank?', choices: ['any household', 'commercial banks and the government', 'only foreign governments', 'any large company'], a: 1,
      why: 'The central bank is the banks\' bank and the government\'s bank. Households and firms bank with commercial banks, whose reserves sit at the central bank.' },
    { q: 'The central bank directly sets the rate on 30-year fixed-rate mortgages.', a: false,
      why: 'It sets the overnight rate. Long fixed rates follow long-term bond yields, which reflect expected future policy rates, inflation and risk premiums.' },
    { q: 'Banknotes in circulation total ¤200 bn and the central bank earns 3 % on its bonds. What is its yearly seigniorage, in ¤ bn?', answer: 6, unit: '$bn',
      why: '$0.03 \\times 200 = ¤6$ bn a year, earned because the notes themselves pay no interest.' },
    { q: 'Why do many countries make the central bank independent of the government?', choices: ['so it can finance government spending more easily', 'so its promise of low inflation is credible, free of the pull of the election cycle', 'so it can lend directly to households', 'so it can set tax rates'], a: 1,
      why: 'A government has a standing temptation to stimulate before elections; people anticipate the resulting inflation. Delegating the rate to an independent bank with a clear target makes the promise believable.' },
    { q: 'Which describes the lender of last resort, in Bagehot\'s classic rule?', choices: ['lend to any bank at any price', 'lend freely to solvent banks against good collateral at a penalty rate', 'never lend, so that banks stay careful', 'lend only to the government'], a: 1,
      why: 'Lending freely stops a panic; good collateral protects the central bank; a penalty rate keeps banks from relying on it in normal times.' }
  ],
  applications: ['Understanding who sets which interest rate, and why.', 'Reading central-bank announcements and their effect on loans and savings.', 'Seeing why cash is safe from default but not from inflation.', 'Following the debate over central-bank independence.'],
  sim: { id: 'mac-taylor', params: { focus: 'bank' } }
},

/* ================================================================ MONETARY POLICY */
{
  id: 'monetary-policy', parent: 'money-policy', title: 'Interest rates and monetary policy', level: 2,
  short: 'Central banks steer inflation mainly by moving the short-term interest rate. A higher rate makes borrowing dearer and saving more rewarding, lowers asset prices and tends to strengthen the currency; spending cools and, after a year or two, so does inflation. The Taylor rule describes how the rate tends to respond to inflation and slack.',
  keywords: ['monetary policy', 'interest rates', 'policy rate', 'rate rise', 'rate hike', 'rate cut', 'Taylor rule', 'Taylor principle', 'neutral rate', 'r-star', 'real interest rate', 'transmission', 'forward guidance', 'tightening', 'easing', 'Volcker', 'zero lower bound', 'negative interest rates'],
  prereq: ['central-banks', 'inflation-cpi', 'real-vs-nominal', 'business-cycle'],
  related: ['variable-rate-mortgages', 'fixed-rate-mortgages', 'bond-pricing', 'yield-curve', 'quantitative-easing', 'exchange-rates', 'present-value'],
  body: `
When inflation runs too high the central bank raises its policy rate; when the economy slumps and inflation is low, it cuts. This one lever — the price of overnight money between banks — is the main tool most countries use to keep inflation near target and output near its potential.

### How a rate change travels
A rise in the policy rate spreads through several channels:
1. **Borrowing and saving.** Banks raise the rates on variable loans, credit lines and deposits. On a ¤250,000 [[variable-rate-mortgages|variable-rate mortgage]] over 25 years, a rate going from 3 % to 5 % lifts the payment from ¤1,185.53 to ¤1,461.48 a month — ¤275.95, or 23 %, more. Borrowers cut back; savers are paid to wait.
2. **Asset prices.** An asset is worth its future income discounted at an interest rate ([[present-value]]), so higher rates lower the value of bonds, shares and property. A 10-year bond paying 3 % a year is worth 100 when yields are 3 % and 84.56 when they are 5 %.
3. **The exchange rate.** Higher rates attract foreign savings and tend to strengthen the currency, cheapening imports ([[exchange-rates]]).
4. **Expectations.** If people believe the central bank will do what it takes, they set wages and prices expecting inflation near target — which helps make it so.

Together these cool demand, and with less demand firms raise prices less. The full effect is commonly estimated to take one to two years, so central banks act on forecasts, steering a large ship with a slow rudder.

### Real rates and the neutral rate
What shapes decisions is the **real** rate, the nominal rate net of inflation: $1 + r = (1 + i)/(1 + \\pi)$. A 5 % policy rate with 3 % inflation is a real 1.94 %. In 1980 US rates near 20 % against inflation of about 13 % made a real rate of about 6 %; in 2021, rates near zero against inflation of 5–7 % made deeply negative real rates.

The **neutral rate** $r^*$ is the real rate that neither pushes nor restrains the economy. It cannot be observed, only estimated, and estimates for rich countries fell from around 2 % in the 1990s to well under 1 % in the 2010s — one reason rates stayed so low for so long, and a live debate since.

### A benchmark: the Taylor rule
John Taylor showed in 1993 that US policy had been well described by a simple rule:

$$i = r^* + \\pi + a(\\pi - \\pi^*) + b\\,\\text{gap}$$

with $a = b = 0.5$. With a neutral real rate of 1 %, inflation of 4 % against a 2 % target and output 1 % above potential, it suggests $1 + 4 + 1 + 0.5 = 6.5\\%$. Its key feature is the **Taylor principle**: the nominal rate moves by *more* than inflation, $1 + a$ times, so the real rate rises when inflation does. A central bank that lets the real rate fall as inflation climbs adds fuel to it. No one follows the rule mechanically; it is a yardstick for asking why policy is looser or tighter.

### History
In 1979–82 the Federal Reserve under Paul Volcker raised rates to around 20 % to break double-digit inflation; inflation fell to about 3–4 % by 1983, at the cost of two recessions and unemployment near 11 %. After 2008 rates in most rich countries fell to zero — and in the euro area, Switzerland, Sweden, Denmark and Japan, below it — and central banks turned to [[quantitative-easing]]. In 2022–23, facing the highest inflation in four decades, most raised rates by four to five percentage points within about eighteen months, one of the fastest tightenings on record.

### What it means for you
A rate change reaches people in opposite directions and at different speeds. Variable-rate borrowers feel it within a month or two; people with [[fixed-rate-mortgages|fixed-rate mortgages]] only when they refinance; savers gain on deposits; holders of long bonds see prices fall as yields rise. The simulation follows the chain from the rule to a payment, a bond and a house; [the loan calculator](#/tools/money/loan) shows how exposed your own loan is to a rate two points higher.
`,
  ideas: [
    'The policy rate works through borrowing costs, asset prices, the exchange rate and expectations.',
    'The full effect on inflation takes roughly one to two years, so policy is set on forecasts.',
    'Real rates matter: the nominal rate net of inflation, compared with an unobservable neutral rate.',
    'The Taylor rule links the rate to inflation and the output gap; the rate should move more than one-for-one with inflation.',
    'Rate changes help some people and hurt others: variable-rate borrowers, savers and bondholders feel them differently.'
  ],
  pitfalls: [
    'Raising rates lowers inflation right away — The effect builds over one to two years; in the meantime higher rates can even lift some measured prices, such as mortgage costs.',
    'A 5 % rate is high — Only compared with inflation. With 6 % inflation a 5 % rate is a negative real rate: loose, not tight.',
    'Rate rises only affect borrowers — They also lower bond and property prices, strengthen the currency, raise deposit rates, and cool hiring.'
  ],
  formulas: [
    {
      name: 'The Taylor rule',
      expr: 'i = rn + p + a*(p - pt) + b*x', tex: 'i = r^* + \\pi + a(\\pi - \\pi^*) + b\\,\\text{gap}',
      vars: {
        i: { name: 'suggested policy rate', q: 'ratio', unit: '%', signed: true },
        rn: { name: 'neutral real interest rate', q: 'ratio', unit: '%', value: 1, signed: true, min: -5, max: 10, tex: 'r^*' },
        p: { name: 'inflation', q: 'ratio', unit: '%', value: 4, signed: true, min: -20, max: 100, tex: '\\pi' },
        a: { name: 'response to inflation above target', value: 0.5 },
        pt: { name: 'inflation target', q: 'ratio', unit: '%', value: 2, tex: '\\pi^*' },
        b: { name: 'response to the output gap', value: 0.5 },
        x: { name: 'output gap', q: 'ratio', unit: '%', value: 1, signed: true, min: -30, max: 30, tex: '\\text{gap}' }
      },
      note: 'Taylor\'s 1993 version used $r^* = 2\\%$, $\\pi^* = 2\\%$, $a = b = 0.5$. A negative result means the rule wants a rate below zero — the situation that led to quantitative easing.',
      practice: { unknowns: ['i', 'p'] },
      stories: {
        i: 'Inflation is {p} against a target of {pt}, the output gap is {x}, and the neutral real rate is {rn}. With weights {a} and {b}, what rate does the Taylor rule suggest?',
        p: 'The central bank has set {i}. With a neutral real rate of {rn}, target {pt}, output gap {x} and weights {a} and {b}, what inflation rate would justify it under the Taylor rule?'
      }
    },
    {
      name: 'Real interest rate',
      expr: 'r = (1 + i)/(1 + p) - 1', tex: 'r = \\frac{1 + i}{1 + \\pi} - 1',
      vars: {
        r: { name: 'real interest rate', q: 'ratio', unit: '%', signed: true },
        i: { name: 'nominal interest rate', q: 'ratio', unit: '%', value: 5, signed: true, min: -10, max: 1000 },
        p: { name: 'inflation', q: 'ratio', unit: '%', value: 3, signed: true, min: -50, max: 1000, tex: '\\pi' }
      },
      note: 'For small rates $r \\approx i - \\pi$. Using expected inflation gives the real rate that guides decisions.',
      stories: {
        r: 'The policy rate is {i} and inflation is {p}. What is the real policy rate?',
        i: 'The central bank wants a real rate of {r} while inflation is {p}. What nominal rate does it need?'
      }
    },
    {
      name: 'Value of a growing stream of rent (discounting)',
      expr: 'V = R*(1 + g)/(k - g)', tex: 'V = \\frac{R\\,(1 + g)}{k - g}',
      vars: {
        V: { name: 'value of the property', q: 'money', unit: '$' },
        R: { name: 'net rent this year', q: 'money', unit: '$', value: 12000 },
        g: { name: 'yearly growth of the rent', q: 'ratio', unit: '%', value: 2, signed: true, min: -10, max: 20 },
        k: { name: 'required return (interest rate plus a risk premium)', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 }
      },
      note: 'A simplified model of why higher interest rates lower asset prices: raise $k$ by one point and the value falls far more than one per cent when $k - g$ is small. Real house prices adjust more slowly and depend on supply and credit too.',
      practice: { unknowns: ['V', 'k'] },
      stories: {
        V: 'A flat earns {R} a year in net rent, expected to grow {g} a year. Investors require {k}. What is it worth?',
        k: 'A flat earning {R} a year, with rent growing {g} a year, sells for {V}. What return does the price imply?'
      }
    }
  ],
  examples: [
    {
      title: 'The rule at work, in a boom and in a slump',
      q: 'Use the Taylor rule with $r^* = 1\\%$, $\\pi^* = 2\\%$, $a = b = 0.5$: (a) inflation 4 %, output 1 % above potential; (b) inflation 1 %, output 4 % below potential.',
      steps: [
        '(a) $i = 1 + 4 + 0.5(4 - 2) + 0.5(1) = 1 + 4 + 1 + 0.5 = 6.5\\%$.',
        '(b) $i = 1 + 1 + 0.5(1 - 2) + 0.5(-4) = 2 - 0.5 - 2 = -0.5\\%$.',
        'In (b) the rule wants a negative rate. Rates can go only a little below zero, because people can hold cash instead; that is when central banks turn to other tools such as quantitative easing.'
      ],
      a: '6.5 % in the boom; −0.5 % in the slump — below what rate cuts alone can reach.'
    },
    {
      title: 'A two-point rise reaches three households',
      q: 'The rates relevant to three households rise by two percentage points. (1) A ¤250,000 variable-rate mortgage over 25 years goes from 3 % to 5 %. (2) A 10-year bond with a 3 % coupon sees its yield go from 3 % to 5 %. (3) A flat earning ¤12,000 net rent, growing 2 % a year, is valued at a required return that goes from 5 % to 6 %.',
      steps: [
        'Mortgage: $M = P\\,i/(1 - (1+i)^{-300})$ gives ¤1,185.53 at 3 % and ¤1,461.48 at 5 % — ¤275.95 more a month.',
        'Bond: discounting its ten coupons of 3 and the 100 repaid at 5 % gives a price of 84.56, down 15.4 %.',
        'Flat: $V = 12{,}000 \\times 1.02/(0.05 - 0.02) = ¤408{,}000$ before, $12{,}240/0.04 = ¤306{,}000$ after — 25 % lower in this simple model.'
      ],
      a: 'Payment +¤275.95 a month; bond −15.4 %; model value of the flat −25 %.'
    }
  ],
  quiz: [
    { q: 'Taylor rule with $r^* = 2\\%$, target 2 %, $a = b = 0.5$: inflation is 3 % and the output gap is zero. What rate (in %) does it suggest?', answer: 5.5, unit: '%',
      why: '$2 + 3 + 0.5(3 - 2) + 0.5(0) = 5.5\\%$.' },
    { q: 'Inflation rises from 2 % to 4 % and nothing else changes. By how much does the Taylor rule (a = 0.5) raise the rate?', choices: ['1 point', '2 points', '3 points', '4 points'], a: 2,
      why: 'The rate moves $1 + a = 1.5$ times the change in inflation: $1.5 \\times 2 = 3$ points, so the real rate rises by 1 point — the Taylor principle.' },
    { q: 'When the central bank raises rates, the market price of existing fixed-rate bonds rises.', a: false,
      why: 'Their fixed coupons are now worth less against new, higher-yielding bonds, so their prices fall until their yields match.' },
    { q: 'The policy rate is 5 % and inflation 3 %. What is the real rate, in %?', answer: 1.94, unit: '%',
      why: '$1.05/1.03 - 1 = 1.94\\%$, a little under the quick $5 - 3 = 2$.' },
    { q: 'Who usually feels a rate rise first?', choices: ['a household with a 30-year fixed-rate mortgage', 'a household with a variable-rate mortgage', 'a retiree with an inflation-linked pension', 'a tenant with a five-year lease'], a: 1,
      why: 'Variable-rate loans reset within weeks or months. Fixed-rate borrowers are protected until they refinance.' }
  ],
  applications: ['Estimating how a rate change will move a variable-rate mortgage payment.', 'Understanding why bond and property prices fall when rates rise.', 'Reading central-bank decisions against a Taylor-rule benchmark.', 'Choosing between fixed and variable rates with the risks in view.'],
  history: 'Inflation targeting with an independent central bank became the standard framework in the 1990s. Taylor\'s 1993 paper did not propose a rule to follow blindly; it showed that a simple formula tracked what the Federal Reserve had done since 1987, and gave outsiders a way to judge policy.',
  sim: 'mac-taylor'
},

/* ================================================================ QUANTITATIVE EASING */
{
  id: 'quantitative-easing', parent: 'money-policy', title: 'Quantitative easing', level: 3,
  short: 'When short-term rates are already near zero, a central bank can still ease by creating reserves to buy large amounts of government bonds and other securities. That lowers long-term interest rates and lifts asset prices; running it in reverse is quantitative tightening. Its effects and side effects are still debated.',
  keywords: ['quantitative easing', 'QE', 'asset purchases', 'large-scale asset purchases', 'quantitative tightening', 'QT', 'central bank balance sheet', 'reserves', 'money printing', 'term premium', 'zero lower bound', 'portfolio rebalancing', 'central bank losses', 'unconventional monetary policy'],
  prereq: ['monetary-policy', 'central-banks', 'bond-pricing', 'money-creation'],
  related: ['yield-curve', 'duration', 'inflation-cpi', 'fiscal-policy', 'financial-crises', 'bubbles'],
  body: `
By late 2008 the major central banks had cut their policy rates almost to zero, and their economies were still sinking. Rates can go only a little below zero — people can always hold cash at 0 % — so they reached for a second lever: buying long-term bonds in enormous quantities, paid for with newly created central-bank money. This is **quantitative easing**.

### The mechanics
The central bank buys ¤50 bn of government bonds from pension funds. It pays by crediting ¤50 bn to the reserve accounts of the funds' banks, which credit the funds' deposits:

| | Assets | Liabilities |
|---|---|---|
| Central bank | + ¤50 bn bonds | + ¤50 bn bank reserves |
| Commercial banks | + ¤50 bn reserves | + ¤50 bn deposits of the funds |
| Pension funds | − ¤50 bn bonds, + ¤50 bn deposits | |

No notes are printed and nobody is handed money: investors swap bonds for deposits. But the central bank's balance sheet grows, new reserves and deposits exist, and the market holds fewer long bonds.

### How it is meant to work
- **Lower long-term yields.** With fewer bonds to go round, investors pay more for those left, and a bond's yield falls as its price rises. The extra yield normally demanded for tying money up for years — the **term premium** — shrinks. For a 10-year bond with a 2 % coupon (modified [[duration]] about 9), a half-point fall in yield lifts the price about 4.5 %: exactly, from 100 to 104.61.
- **Portfolio rebalancing.** Sellers holding new deposits buy other assets — company bonds, shares, property — lifting their prices and cheapening credit for firms and households.
- **Signalling.** Committing to buy for years shows the central bank intends to keep rates low for long, which lowers expected future rates too.

Long-term yields price fixed-rate mortgages and company borrowing, so this is how QE reaches the economy when the short rate can fall no further.

### History
Japan ran the first modern programme in 2001–06. From 2008 the Federal Reserve and the Bank of England, and from 2015 on a large scale the ECB, bought government bonds, mortgage securities and other assets in several rounds; the pandemic of 2020 brought the largest purchases yet, in many more countries, Israel among them. The Federal Reserve's balance sheet grew from about 6 % of US GDP in 2007 to about 35 % in 2022; the Eurosystem's peaked near two-thirds of euro-area GDP, and the Bank of Japan's came to exceed Japan's GDP. From 2022 most began **quantitative tightening** — letting bonds mature without replacing them, or selling them.

### What is debated
Studies generally find that the first rounds, in the panic of 2008–09, lowered long-term yields meaningfully and calmed markets; estimates for later rounds are smaller and vary widely. The runaway inflation some predicted did not come in the 2010s — much of the new money sat idle as bank reserves. Others note that the huge purchases of 2020–21 coincided with the inflation of 2021–22, alongside large fiscal support and supply shocks; how much each contributed is contested. Other concerns:
- **Inequality**: higher asset prices help those who own assets most, though lower unemployment helps workers.
- **Blurred lines with the budget**: buying government debt on a large scale can look like financing the government; central banks insist their purchases serve their inflation goal only.
- **Losses when rates rise**: the central bank earns the fixed yields on its bonds but pays the current policy rate on reserves. Holding ¤500 bn of bonds yielding 1.5 %, financed by reserves paid 4 %, costs ¤12.5 bn a year. Several central banks reported losses in 2022–24 for this reason. They create money, so they cannot run out of it, but the losses reduce what they hand to the treasury.

### What it means for you
QE is one reason mortgage rates and bond yields were so low in the 2010s and early 2020s, and why bond prices fell so hard in 2022 when it went into reverse: a 30-year bond with a 1 % coupon loses more than half its price if its yield goes from 1 % to 4 %. Knowing that long rates depend on central-bank buying as well as on inflation helps explain the [[yield-curve]] and your fixed-rate mortgage offers.
`,
  ideas: [
    'QE is buying long-term assets with newly created reserves when the policy rate is already near zero.',
    'It works mainly by lowering long-term yields and term premiums, pushing investors into other assets, and signalling low rates for long.',
    'Investors swap bonds for deposits; nobody is handed money, but the central bank\'s balance sheet and bank reserves grow.',
    'When rates rise, a central bank paying the policy rate on reserves can lose money on bonds bought at low yields.',
    'Its effect on inflation, inequality and the line between monetary and fiscal policy remains debated.'
  ],
  pitfalls: [
    'QE is printing money and handing it out — The central bank buys assets and pays with reserves; the seller swaps a bond for a deposit. Handing money to people is fiscal policy.',
    'QE must cause high inflation — It did not in the 2010s, when much of the new money sat as reserves; the 2021–22 inflation had several causes whose weights are debated.',
    'A central bank that loses money is bankrupt — It creates the money it pays, so it cannot run out; losses reduce what it transfers to the treasury and may need explaining, not rescuing.'
  ],
  formulas: [
    {
      name: 'Bond price change from a change in yield (duration)',
      expr: 'dP = -D*dy', tex: '\\Delta P \\approx -D\\,\\Delta y',
      vars: {
        dP: { name: 'change in the bond price, in per cent of the price', q: 'ratio', unit: '%', signed: true, tex: '\\Delta P' },
        D: { name: 'modified duration', q: 'years', unit: 'yr', value: 9 },
        dy: { name: 'change in the yield', q: 'ratio', unit: '%', value: -0.5, signed: true, min: -20, max: 20, tex: '\\Delta y' }
      },
      note: 'A first-order approximation, good for small moves. Long bonds have large durations, so they gain most when QE pushes yields down and lose most when yields rise.',
      stories: {
        dP: 'A bond has a modified duration of {D}. Its yield changes by {dy}. By roughly how much does its price change?',
        dy: 'A bond with modified duration {D} rose {dP} in price. By roughly how much did its yield change?'
      }
    },
    {
      name: 'Price of a zero-coupon bond',
      expr: 'P = F/(1 + y)^n', tex: 'P = \\frac{F}{(1 + y)^n}',
      vars: {
        P: { name: 'price today', q: 'money', unit: '$' },
        F: { name: 'amount repaid at maturity', q: 'money', unit: '$', value: 100 },
        y: { name: 'yield', q: 'ratio', unit: '%', value: 3, min: -5, max: 50 },
        n: { name: 'years to maturity', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'The simplest bond: one payment at the end. Lower yields mean higher prices, and the effect grows with the years to maturity.',
      practice: { unknowns: ['P', 'y'] },
      stories: {
        P: 'A bond repays {F} in {n} and pays nothing before. At a yield of {y}, what is it worth today?',
        y: 'A bond that repays {F} in {n} sells today for {P}. What yield does it offer?'
      }
    },
    {
      name: 'Central bank\'s net interest on its bond holdings',
      expr: 'N = yb*B - ir*R', tex: 'N = y_b\\,B - i_r\\,R',
      vars: {
        N: { name: 'net interest income per year', q: 'money', unit: '$bn', signed: true },
        yb: { name: 'average yield on bonds held', q: 'ratio', unit: '%', value: 1.5, tex: 'y_b' },
        B: { name: 'bonds held', q: 'money', unit: '$bn', value: 500 },
        ir: { name: 'rate paid on bank reserves', q: 'ratio', unit: '%', value: 4, tex: 'i_r' },
        R: { name: 'reserves created to buy them', q: 'money', unit: '$bn', value: 500 }
      },
      note: 'Bonds bought at low yields, financed by reserves that pay the current policy rate: profitable while rates are low, costly after they rise.',
      practice: { unknowns: ['N', 'ir'] },
      stories: {
        N: 'A central bank holds {B} of bonds yielding {yb}, financed by {R} of reserves on which it pays {ir}. What is its net interest income?',
        ir: 'A central bank holds {B} of bonds yielding {yb}, financed by {R} of reserves. Its net interest income is {N}. What rate does it pay on reserves?'
      }
    }
  ],
  examples: [
    {
      title: 'What QE does to a bond price',
      q: 'A 10-year government bond pays a 2 % coupon and yields 2 %, so it trades at 100; its modified duration is 8.98. QE pushes its yield down to 1.5 %. Estimate the new price with duration, then check it exactly.',
      steps: [
        'Duration estimate: $\\Delta P/P \\approx -8.98 \\times (-0.005) = +4.49\\%$, so about 104.49.',
        'Exactly, discounting ten coupons of 2 and the 100 repaid at 1.5 %: 104.61.',
        'The small difference is convexity: prices rise a little more than duration predicts when yields fall.'
      ],
      a: 'About 104.5 by duration; 104.61 exactly.'
    },
    {
      title: 'When the central bank loses money',
      q: 'A central bank bought ¤500 bn of bonds yielding 1.5 % on average, creating ¤500 bn of reserves. What is its net interest income when it pays 0.1 % on reserves, and after it raises the rate to 4 %?',
      steps: [
        'At 0.1 %: $0.015 \\times 500 - 0.001 \\times 500 = 7.5 - 0.5 = ¤7$ bn a year of profit.',
        'At 4 %: $7.5 - 0.04 \\times 500 = 7.5 - 20 = -¤12.5$ bn a year.',
        'The loss is the mirror image of the low yields it locked in; it lasts until the bonds mature or rates fall.'
      ],
      a: '+¤7 bn a year at 0.1 %; −¤12.5 bn a year at 4 %.'
    }
  ],
  quiz: [
    { q: 'In QE the central bank pays for the bonds it buys by…', choices: ['printing notes and handing them to the public', 'creating reserves in banks\' accounts at the central bank', 'raising taxes', 'borrowing from commercial banks'], a: 1,
      why: 'It credits the reserve account of the seller\'s bank, which credits the seller\'s deposit. No notes are needed.' },
    { q: 'QE gives households new money for free.', a: false,
      why: 'Sellers exchange bonds for deposits of equal value. Only fiscal policy — transfers or tax cuts — hands money to households.' },
    { q: 'A bond has a modified duration of 8. QE lowers its yield by 0.25 percentage point. By roughly how much does its price rise (in %)?', answer: 2, unit: '%',
      why: '$\\Delta P/P \\approx -8 \\times (-0.0025) = +2\\%$.' },
    { q: 'A central bank holds ¤300 bn of bonds yielding 2 %, financed by ¤300 bn of reserves on which it pays 4 %. What is its net interest income, in ¤ bn a year?', answer: -6, unit: '$bn',
      why: '$0.02 \\times 300 - 0.04 \\times 300 = 6 - 12 = -¤6$ bn: a loss.' },
    { q: 'Why did central banks turn to QE in 2008–09?', choices: ['short-term rates were already close to zero', 'inflation was too high', 'governments had stopped borrowing', 'banks had too many loans'], a: 0,
      why: 'With the usual lever near its limit, buying long-term assets was a way to push down the longer rates that still had room to fall.' }
  ],
  applications: ['Understanding why long-term rates and mortgage rates were so low in the 2010s.', 'Seeing why long bonds fell so sharply when QE went into reverse.', 'Reading central-bank balance-sheet news and reports of central-bank losses.', 'Weighing the arguments over QE, inflation and inequality.'],
  sim: { id: 'mac-taylor', params: { focus: 'qe' } }
},

/* ================================================================ FISCAL POLICY */
{
  id: 'fiscal-policy', parent: 'money-policy', title: 'Fiscal policy, deficits and debt', level: 2,
  short: 'Fiscal policy is what the government taxes, spends and borrows. A deficit adds to public debt; whether the debt burden then rises or falls depends on the primary balance and on the gap between the interest rate on the debt and the growth rate of the economy.',
  keywords: ['fiscal policy', 'government budget', 'budget deficit', 'surplus', 'public debt', 'national debt', 'debt-to-GDP ratio', 'primary balance', 'austerity', 'stimulus', 'fiscal multiplier', 'automatic stabilisers', 'r minus g', 'crowding out', 'Ricardian equivalence', 'sovereign debt', 'government bonds'],
  prereq: ['gdp', 'compound-interest', 'business-cycle'],
  related: ['monetary-policy', 'quantitative-easing', 'credit-risk', 'bond-basics', 'financial-crises', 'recessions', 'hyperinflation', 'trade-balance', 'math:sequences'],
  body: `
A government's budget is like a household's in one way: spend more than you take in and you must borrow, and the debt grows. It differs in others. A state does not retire, it can tax, its income grows with the whole economy, and if it borrows in a currency its own central bank issues it cannot simply run out of money — though it can end in inflation or a painful choice. That mix is why public debt is both less frightening and more dangerous than it looks.

### The budget in three parts
**Revenue** (taxes and other income, roughly a third to a half of GDP in rich countries), **primary spending** (everything except interest: pensions, health, schools, defence, benefits) and **interest** on the debt. The **primary balance** is revenue minus primary spending; the **overall balance** also subtracts interest. With revenue at 40 % of GDP, primary spending at 41 % and interest at 2.5 %, the primary deficit is 1 % of GDP and the overall deficit 3.5 %. Each year's overall deficit is added to the **debt**.

### Debt dynamics: the r − g snowball
Debt is judged against GDP, the base that pays the taxes. Let $d$ be debt as a share of GDP, $r$ the average interest rate on the debt, $g$ nominal GDP growth and $s$ the primary surplus (negative for a primary deficit). Next year

$$d_{t+1} = d_t\\,\\frac{1 + r}{1 + g} - s$$

If interest exceeds growth, debt snowballs on its own: at 100 % of GDP with $r = 5\\%$ and $g = 3\\%$, a balanced primary budget still lifts debt to 101.9 % next year and 121 % in ten. The primary surplus needed just to hold the ratio steady is

$$s^* = d\\,\\frac{r - g}{1 + g}$$

— 1.94 % of GDP in that case. If growth exceeds interest the arithmetic runs the other way: at $r = 2\\%$ and $g = 4\\%$, a balanced primary budget brings 100 % down to 82 % in ten years, and even a primary deficit of 1 % a year brings it down to 92 %. Through much of 2010–21 rich countries borrowed at rates below their growth, which is part of why high debts were tolerated; when rates rose in 2022–23 the arithmetic tightened.

### Stimulus, austerity and the multiplier
In a slump, tax revenue falls and benefit spending rises by themselves — **automatic stabilisers** that cushion incomes without any decision. Governments may add discretionary **stimulus**. How much output each ¤1 of extra spending creates, the **fiscal multiplier**, is at the heart of a long debate: estimates run from below 0.5 to above 1.5. They are larger when there are idle workers and machines and the central bank is not raising rates; smaller when the economy is at capacity, imports carry much of the spending abroad, or borrowing lifts interest rates and **crowds out** private investment. **Ricardian equivalence** adds that people expecting higher taxes later may save a tax cut rather than spend it.

The euro crisis sharpened the argument. Advocates of fast consolidation held that countries losing access to markets had no choice and that credible plans restore confidence; critics held that cutting deficits in a deep recession shrank GDP so much that debt ratios rose anyway, and a 2013 IMF study found that forecasters had underestimated the multipliers. Both sides agree that fiscal room built in good years is what makes support possible in bad ones.

### When debt becomes a crisis
A government borrowing in a foreign currency, or in one it cannot issue (such as a euro-area member), can face a **sovereign debt crisis**: lenders who doubt repayment demand higher yields, which worsens $r - g$ and can make the fear self-fulfilling ([[financial-crises]]). Borrowing in one's own currency removes the risk of running out of money but not the risk of inflation if the central bank is pushed to finance deficits ([[hyperinflation]]). Japan's gross public debt has exceeded 200 % of GDP for over a decade with low yields — owed mostly to domestic savers, in its own currency, with a central bank buying bonds. Britain's debt was roughly 250 % of GDP after the Second World War and the US's about 106 % in 1946; both fell steeply over the following three decades through growth, some inflation and low interest rates.

### What it means for you
Fiscal policy is your tax bill, your pension rules and the public services you use. Large deficits today mean higher taxes, lower spending, inflation — or growth that outruns the interest — later, and the mix is a political choice. Government bond yields also set the floor under the rates on your mortgage and your savings.
`,
  ideas: [
    'The primary balance excludes interest; the overall balance includes it, and the overall deficit adds to the debt.',
    'Debt is measured against GDP; its ratio evolves as d(1 + r)/(1 + g) minus the primary surplus.',
    'When interest exceeds growth, debt snowballs unless the primary budget is in surplus; when growth exceeds interest, it shrinks.',
    'Automatic stabilisers cushion recessions without decisions; the size of the fiscal multiplier is debated and depends on circumstances.',
    'Debt in a currency a government cannot issue carries default risk; debt in its own currency carries inflation risk instead.'
  ],
  pitfalls: [
    'A deficit means debt must rise as a share of GDP — If nominal growth exceeds the interest rate, the ratio can fall even with a small primary deficit.',
    'Government debt works exactly like household debt — A state does not retire, can tax, and (in its own currency) cannot run out of money; but it can face inflation or a loss of market confidence.',
    'Cutting spending always reduces the debt ratio — In a deep slump with a large multiplier, cuts can shrink GDP enough to raise the ratio for a while.'
  ],
  formulas: [
    {
      name: 'Debt-to-GDP ratio next year',
      expr: 'd1 = d0*(1 + r)/(1 + g) - s', tex: 'd_{t+1} = d_t\\,\\frac{1 + r}{1 + g} - s',
      vars: {
        d1: { name: 'debt next year, share of GDP', q: 'ratio', unit: '%', tex: 'd_{t+1}' },
        d0: { name: 'debt this year, share of GDP', q: 'ratio', unit: '%', value: 100, tex: 'd_t' },
        r: { name: 'average interest rate on the debt', q: 'ratio', unit: '%', value: 5, signed: true, min: -10, max: 50 },
        g: { name: 'nominal GDP growth', q: 'ratio', unit: '%', value: 3, signed: true, min: -30, max: 100 },
        s: { name: 'primary surplus, share of GDP (negative for a deficit)', q: 'ratio', unit: '%', value: 0, signed: true, min: -30, max: 30 }
      },
      note: 'Nominal growth is real growth plus inflation. With $r > g$ the debt ratio rises by itself unless $s$ is positive.',
      practice: { unknowns: ['d1', 's'] },
      stories: {
        d1: 'Public debt is {d0} of GDP, the average interest rate on it is {r}, nominal GDP grows {g}, and the primary surplus is {s} of GDP. What is the debt ratio next year?',
        s: 'Debt is {d0} of GDP, interest {r}, nominal growth {g}. What primary surplus brings the ratio to {d1} next year?'
      }
    },
    {
      name: 'Primary surplus that holds the debt ratio steady',
      expr: 's = d*(r - g)/(1 + g)', tex: 's^* = d\\,\\frac{r - g}{1 + g}',
      vars: {
        s: { name: 'primary surplus needed, share of GDP', q: 'ratio', unit: '%', signed: true, tex: 's^*' },
        d: { name: 'debt, share of GDP', q: 'ratio', unit: '%', value: 100 },
        r: { name: 'average interest rate on the debt', q: 'ratio', unit: '%', value: 5, signed: true, min: -10, max: 50 },
        g: { name: 'nominal GDP growth', q: 'ratio', unit: '%', value: 3, signed: true, min: -30, max: 100 }
      },
      note: 'Negative when growth exceeds the interest rate: the ratio then holds steady even with a primary deficit.',
      stories: {
        s: 'Debt is {d} of GDP, the interest rate on it {r} and nominal growth {g}. What primary surplus keeps the ratio from rising?',
        r: 'With debt at {d} of GDP and nominal growth of {g}, a primary surplus of {s} holds the ratio steady. What interest rate does that imply?'
      }
    },
    {
      name: 'The fiscal multiplier',
      expr: 'dY = k*dG', tex: '\\Delta Y = k\\,\\Delta G',
      vars: {
        dY: { name: 'change in GDP', q: 'money', unit: '$bn', tex: '\\Delta Y' },
        k: { name: 'multiplier', value: 0.8 },
        dG: { name: 'extra government spending', q: 'money', unit: '$bn', value: 10, tex: '\\Delta G' }
      },
      note: 'Estimates range from below 0.5 to above 1.5, depending on slack, the central bank\'s response, openness to imports and confidence.',
      stories: { dY: 'The government spends an extra {dG}. If the multiplier is {k}, by how much does GDP change?' }
    }
  ],
  examples: [
    {
      title: 'The snowball',
      q: 'Debt is 100 % of GDP, the average interest rate 5 % and nominal growth 3 %. The primary budget is balanced. Where is the ratio in one year and in ten, and what primary surplus would hold it steady?',
      steps: [
        'One year: $100 \\times 1.05/1.03 = 101.94\\%$.',
        'Ten years: $100 \\times (1.05/1.03)^{10} = 121.2\\%$.',
        'Steady ratio: $s^* = 100 \\times (0.05 - 0.03)/1.03 = 1.94\\%$ of GDP every year.'
      ],
      a: '101.9 % after a year, 121.2 % after ten; a primary surplus of 1.94 % of GDP would hold it at 100 %.'
    },
    {
      title: 'When growth outruns interest',
      q: 'Same debt of 100 % of GDP, but the interest rate is 2 % and nominal growth 4 %. Where is the ratio after ten years with a balanced primary budget, and with a primary deficit of 1 % of GDP a year?',
      steps: [
        'Balanced: each year multiply by $1.02/1.04$; after ten years $100 \\times (1.02/1.04)^{10} = 82.4\\%$.',
        'With $s = -1\\%$: $d_{t+1} = d_t \\times 1.02/1.04 + 1$ each year; after ten years 91.5 %.',
        'The debt still falls as a share of GDP, although the government borrows every year — the economy grows faster than the interest adds.'
      ],
      a: '82.4 % with a balanced primary budget; 91.5 % with a 1 % primary deficit.'
    }
  ],
  quiz: [
    { q: 'Debt is 80 % of GDP, the interest rate on it 4 % and nominal growth 4 %. With a balanced primary budget, what is the debt ratio next year (in %)?', answer: 80, unit: '%',
      why: '$80 \\times 1.04/1.04 = 80\\%$: when interest equals growth, a balanced primary budget holds the ratio exactly.' },
    { q: 'Which lets the debt ratio fall with a balanced primary budget?', choices: ['an interest rate above the growth rate', 'an interest rate below the growth rate', 'a larger debt', 'a stronger currency'], a: 1,
      why: 'Debt grows with interest, GDP with nominal growth; if GDP grows faster the ratio falls.' },
    { q: 'Debt is 120 % of GDP, the interest rate 3 % and nominal growth 2 %. What primary surplus (in % of GDP) holds the ratio steady?', answer: 1.18, unit: '%',
      why: '$120 \\times (0.03 - 0.02)/1.02 = 1.18\\%$ of GDP a year.' },
    { q: 'A government that borrows only in its own currency can never have a debt problem.', a: false,
      why: 'It cannot be forced to default for lack of money, but financing deficits with the central bank can end in high inflation, and markets can still demand higher yields.' },
    { q: 'What are automatic stabilisers?', choices: ['emergency laws passed in a recession', 'taxes that fall and benefits that rise by themselves when the economy weakens', 'the central bank cutting rates', 'fixed exchange rates'], a: 1,
      why: 'Progressive taxes and unemployment benefits respond to income without any new decision, cushioning household incomes in downturns.' }
  ],
  applications: ['Reading budget news: primary and overall deficits, and debt as a share of GDP.', 'Understanding why rising interest rates worry governments with large debts.', 'Weighing the arguments over stimulus and austerity.', 'Seeing how government bond yields feed into mortgage and savings rates.'],
  sim: 'mac-debt'
},

/* ================================================================ EXCHANGE RATES */
{
  id: 'exchange-rates', parent: 'money-policy', title: 'Exchange rates', level: 2,
  short: 'An exchange rate is the price of one currency in another. It moves with interest rates, inflation, trade and fear. A weaker currency makes imports dearer and exports cheaper, and changes the cost of anything priced or borrowed abroad.',
  keywords: ['exchange rate', 'currency', 'foreign exchange', 'forex', 'appreciation', 'depreciation', 'devaluation', 'floating exchange rate', 'currency peg', 'currency board', 'purchasing-power parity', 'interest parity', 'forward rate', 'real exchange rate', 'impossible trinity', 'trilemma', 'pass-through', 'safe haven'],
  prereq: ['what-is-money', 'inflation-cpi', 'monetary-policy'],
  related: ['trade-balance', 'currency-exchange', 'cfds-forex', 'hedging', 'futures-forwards', 'financial-crises', 'central-banks'],
  body: `
A holiday abroad, an imported phone, a salary from a foreign employer, savings or a mortgage in another currency: each depends on an **exchange rate**, the number of units of one currency that buy one unit of another. Written as $S$ home-currency units per foreign unit, a rise in $S$ means the home currency has **depreciated** — each foreign unit costs more.

### What a move does
Suppose the rate goes from 3.50 to 4.00 home units per foreign unit. The foreign currency is 14.3 % dearer; equivalently, the home currency has lost 12.5 % of its value measured in the foreign one (the two differ only because they use different bases).
- **Importers and shoppers**: a machine priced at 10,000 foreign units rose from ¤35,000 to ¤40,000. How much reaches shop prices — the **pass-through** — depends on competition and contracts. If imports are 30 % of the consumer basket and half the rise is passed on, the price index rises about 2.1 %.
- **Exporters**: a firm selling abroad at 50 foreign units a unit, with costs of ¤150 a unit at home, earned ¤25 a unit before and ¤50 after. Its margin doubled overnight, which is why exporters welcome a weak currency and importers dread it.
- **Anyone who owes foreign currency**: a payment of 500 foreign units a month rose from ¤1,750 to ¤2,000, and the debt itself grew 14.3 % in home money, while the borrower's salary did not.

### What moves exchange rates
- **Interest rates.** Higher rates at home than abroad attract savings and tend to strengthen the currency — one channel of [[monetary-policy]].
- **Inflation.** A currency that loses value faster at home tends, over time, to lose value abroad too. **Purchasing-power parity** says rates drift towards making the same basket cost the same everywhere; it holds poorly from year to year and roughly over decades. The **real exchange rate** $q = S P^*/P$ combines the nominal rate with relative prices, and it is what decides competitiveness.
- **Trade and capital flows, commodity prices — and fear.** In a crisis money runs to currencies seen as safe havens (historically the US dollar, the Swiss franc and the yen) and away from others.

Forecasting exchange rates is notoriously hard, and the market's forward rate is not a forecast. It follows from **covered interest parity**: with a spot rate of 3.60, a one-year interest rate of 4 % at home and 1 % abroad, the one-year forward rate is $3.60 \\times 1.04/1.01 = 3.7069$ — the rate at which borrowing in one currency and depositing in the other earns no free profit.

### Regimes and the trilemma
Countries choose among a **free float** (the market sets the rate, as largely for the dollar, euro, pound, yen and shekel), a **managed float**, a **peg** to another currency, a **currency board**, or no currency of their own (euro-area members; several countries use the US dollar). The **impossible trinity** says a country can have at most two of three: a fixed exchange rate, free movement of capital, and an independent monetary policy. A peg with open capital markets means giving up interest rates as a tool; if markets doubt the peg, defending it can take punishing rates and drain the reserves.

### History
The Bretton Woods system (1944–71) fixed currencies to the dollar, and the dollar to gold, until the US ended convertibility in 1971; the major currencies floated from 1973. In September 1992 Britain was forced out of the European exchange-rate mechanism. In 1997 Thailand's peg broke and the crisis spread across Asia; Argentina's one-for-one currency board with the dollar collapsed in 2002. In January 2015 the Swiss National Bank dropped the cap it had held on the franc, which soared: for a while a euro bought nearly 30 % fewer francs, and the franc ended the day about 15 % stronger. Households in Poland, Hungary and Croatia with mortgages in francs, whose payments had already risen sharply since 2008, saw them jump again.

### What it means for you
If you earn in one currency, borrowing or committing large sums in another adds a risk that no interest saving may cover. A weak home currency raises the price of imported goods and foreign holidays and helps jobs in exporting industries; a strong one does the reverse. Investments abroad carry currency risk on top of their own ([[currency-exchange]], [[hedging]]).
`,
  ideas: [
    'An exchange rate is a price: a rise in home units per foreign unit is a depreciation of the home currency.',
    'A depreciation raises import prices (partly passed on to consumers), widens exporters\' margins, and raises the home-currency cost of foreign debts.',
    'Interest-rate differences, inflation, flows and risk appetite drive exchange rates; purchasing-power parity holds only over long periods.',
    'The forward rate follows from interest rates (covered interest parity); it is not a forecast.',
    'The impossible trinity: a fixed rate, free capital movement and independent monetary policy — at most two.'
  ],
  pitfalls: [
    'A 14.3 % rise in the foreign currency is a 14.3 % fall in mine — Measured the other way it is a 12.5 % fall; percentage changes depend on the base.',
    'A foreign-currency loan with a lower rate is cheaper — Only if the exchange rate holds; a move of a few per cent a year can wipe out the saving, and the whole balance moves with it.',
    'A strong currency is a sign of a strong economy, and a weak one of failure — Each helps some and hurts others: a strong currency helps importers and travellers, a weak one exporters and those who earn in foreign currency.'
  ],
  formulas: [
    {
      name: 'Home price of something priced abroad',
      expr: 'Ph = S*Pf', tex: 'P_h = S\\,P_f',
      vars: {
        Ph: { name: 'price in home currency', q: 'money', unit: '$', tex: 'P_h' },
        S: { name: 'exchange rate (home units per foreign unit)', value: 4 },
        Pf: { name: 'price in foreign-currency units', value: 10000, tex: 'P_f' }
      },
      stories: {
        Ph: 'A machine costs {Pf} foreign-currency units and the exchange rate is {S} home units per foreign unit. What does it cost at home?',
        S: 'An item priced at {Pf} foreign units costs {Ph} at home. What exchange rate is being used?'
      }
    },
    {
      name: 'Forward rate from covered interest parity',
      expr: 'Fw = S*(1 + ih)/(1 + ifo)', tex: 'F = S\\,\\frac{1 + i_h}{1 + i_f}',
      vars: {
        Fw: { name: 'one-year forward rate', tex: 'F' },
        S: { name: 'spot rate (home units per foreign unit)', value: 3.6 },
        ih: { name: 'one-year interest rate at home', q: 'ratio', unit: '%', value: 4, min: -5, max: 100, tex: 'i_h' },
        ifo: { name: 'one-year interest rate abroad', q: 'ratio', unit: '%', value: 1, min: -5, max: 100, tex: 'i_f' }
      },
      note: 'The currency with the higher interest rate trades at a forward discount; otherwise borrowing in one currency and lending in the other would earn a riskless profit.',
      stories: {
        Fw: 'The spot rate is {S}, one-year rates are {ih} at home and {ifo} abroad. What is the one-year forward rate?',
        ih: 'The spot rate is {S} and the one-year forward rate {Fw}; the foreign one-year rate is {ifo}. What home interest rate does that imply?'
      }
    },
    {
      name: 'Real exchange rate',
      expr: 'q = S*Pw/P', tex: 'q = S\\,\\frac{P^*}{P}',
      vars: {
        q: { name: 'real exchange rate' },
        S: { name: 'nominal exchange rate (home units per foreign unit)', value: 3.6 },
        Pw: { name: 'foreign price level (index)', value: 110, tex: 'P^*' },
        P: { name: 'home price level (index)', value: 120 }
      },
      note: 'If home prices rise faster than foreign prices while the nominal rate stays put, $q$ falls: the home country becomes more expensive and less competitive.',
      stories: { q: 'The exchange rate is {S}, the foreign price index {Pw} and the home index {P}. What is the real exchange rate?' }
    },
    {
      name: 'A depreciation\'s effect on the price index',
      expr: 'dP = w*b*ds', tex: '\\Delta P = w\\,\\beta\\,\\Delta s',
      vars: {
        dP: { name: 'rise in the consumer price index', q: 'ratio', unit: '%', signed: true, tex: '\\Delta P' },
        w: { name: 'share of imports in the consumer basket', q: 'ratio', unit: '%', value: 30, max: 100 },
        b: { name: 'pass-through to import prices', q: 'ratio', unit: '%', value: 50, max: 100, tex: '\\beta' },
        ds: { name: 'rise in the price of foreign currency', q: 'ratio', unit: '%', value: 14.29, signed: true, min: -90, max: 500, tex: '\\Delta s' }
      },
      note: 'A rough first-round estimate; second-round effects on wages and domestic prices come later.',
      stories: { dP: 'The foreign currency becomes {ds} dearer. Imports are {w} of the basket and {b} of the change reaches shop prices. How much does the price index rise?' }
    }
  ],
  examples: [
    {
      title: 'One move, four people',
      q: 'The rate goes from 3.50 to 4.00 home units per foreign unit. Work out the effect on: a machine priced at 10,000 foreign units; the price index if imports are 30 % of it and pass-through is 50 %; an exporter selling at 50 foreign units with costs of ¤150 a unit; and a loan payment of 500 foreign units a month.',
      steps: [
        'Change: $4.00/3.50 - 1 = 14.3\\%$ dearer foreign currency (the home currency lost $1 - 3.5/4 = 12.5\\%$).',
        'Machine: $10{,}000 \\times 3.50 = ¤35{,}000$ becomes $10{,}000 \\times 4.00 = ¤40{,}000$.',
        'Price index: $0.30 \\times 0.50 \\times 14.3\\% = 2.1\\%$.',
        'Exporter: $50 \\times 3.50 - 150 = ¤25$ becomes $50 \\times 4.00 - 150 = ¤50$ a unit.',
        'Loan payment: $500 \\times 3.50 = ¤1{,}750$ becomes $500 \\times 4.00 = ¤2{,}000$ a month.'
      ],
      a: 'Machine +¤5,000; prices +2.1 %; exporter\'s margin doubles to ¤50; loan payment +¤250 a month.'
    },
    {
      title: 'A forward rate that is not a forecast',
      q: 'The spot rate is 3.60 home units per foreign unit. One-year interest rates are 4 % at home and 1 % abroad. What one-year forward rate must the market quote?',
      steps: [
        'Route 1: deposit ¤3.60 at home for a year: ¤3.744.',
        'Route 2: convert to 1 foreign unit, deposit abroad: 1.01 foreign units, sold forward at $F$: $1.01F$ home units.',
        'No free profit: $1.01F = 3.744$, so $F = 3.7069$. The forward premium reflects the interest gap, not a view on where the rate will go.'
      ],
      a: 'F = 3.7069.'
    }
  ],
  quiz: [
    { q: 'The rate moves from 3.50 to 4.00 home units per foreign unit. The home currency has…', choices: ['appreciated', 'depreciated: each foreign unit now costs 14.3 % more', 'appreciated by 12.5 %', 'kept its value'], a: 1,
      why: 'More home units are needed for each foreign unit: the home currency is weaker. The foreign currency is 14.3 % dearer; the home currency lost 12.5 % in foreign terms.' },
    { q: 'A jacket costs 80 foreign-currency units and the rate is 3.75 home units per foreign unit. What does it cost at home, in ¤?', answer: 300, unit: '$',
      why: '$80 \\times 3.75 = ¤300$.' },
    { q: 'The forward exchange rate is the market\'s forecast of the future spot rate.', a: false,
      why: 'It is set by the interest-rate gap between the two currencies (covered interest parity); forward rates are poor predictors of future spot rates.' },
    { q: 'A country pegs its currency and allows capital to move freely. What must it give up?', choices: ['exports', 'an independent interest-rate policy', 'its central bank', 'inflation statistics'], a: 1,
      why: 'The impossible trinity: with a peg and open capital markets, interest rates must follow the anchor currency\'s, or money will flow in or out until the peg breaks.' },
    { q: 'Who gains most from a sudden weakening of the home currency?', choices: ['a family with a mortgage in foreign currency', 'an exporter with costs at home and sales abroad', 'an importer of machinery', 'a family travelling abroad'], a: 1,
      why: 'The exporter\'s foreign revenue is worth more in home money while its costs are unchanged. The others pay more in home currency.' }
  ],
  applications: ['Weighing a foreign-currency loan or mortgage against its currency risk.', 'Understanding why imported prices rise after a depreciation.', 'Reading news about pegs, interventions and currency crises.', 'Seeing why forward rates differ from spot rates.'],
  sim: 'mac-fx'
},

/* ================================================================ TRADE AND THE BALANCE OF PAYMENTS */
{
  id: 'trade-balance', parent: 'money-policy', title: 'Trade and the balance of payments', level: 2,
  short: 'The balance of payments records everything a country sells to, buys from, earns from and borrows from the rest of the world. A current-account deficit means the country spends more than it earns abroad and finances the difference with foreign capital; it equals the gap between national investment and national saving.',
  keywords: ['balance of payments', 'current account', 'trade balance', 'trade deficit', 'trade surplus', 'exports', 'imports', 'financial account', 'capital flows', 'saving and investment', 'twin deficits', 'J-curve', 'Marshall-Lerner condition', 'tariffs', 'protectionism', 'net international investment position', 'remittances'],
  prereq: ['gdp', 'exchange-rates', 'comparative-advantage'],
  related: ['fiscal-policy', 'financial-crises', 'supply-demand', 'currency-exchange', 'elasticity'],
  body: `
A country, like a household, can spend more than it earns only by borrowing or selling assets. The **balance of payments** is the ledger that shows how: every sale abroad and every purchase, every dividend and remittance, every loan and investment that crosses the border.

### The accounts
- The **current account**: exports minus imports of goods and services (the **trade balance**), plus income earned abroad minus income paid abroad (interest, dividends, wages), plus transfers such as workers' remittances and aid.
- The **financial account**: residents' purchases of foreign assets and foreigners' purchases of domestic ones — shares, bonds, factories, bank deposits, central-bank reserves.

Every payment has a counterpart, so the two mirror each other (apart from a small capital account and statistical errors). A current-account deficit of ¤50 bn is financed by a net ¤50 bn inflow of capital: foreigners buying the country's bonds, shares or property, or lending to its banks.

### Saving and investment
From the national accounts ([[gdp]]) comes the identity that explains trade balances better than stories about "unfair" trade:

$$CA = S - I = (S_p - I) + (T - G)$$

The current account equals national saving minus domestic investment. A country that invests more than it saves must bring in the difference as foreign capital, and with it goods. If households and firms save 24 % of GDP, investment is 22 % and the government runs a deficit of 5 %, the current account is $24 - 22 - 5 = -3\\%$ of GDP. A government deficit that comes with a current-account deficit is called a **twin deficit**.

So a deficit is not good or bad in itself. A young, fast-growing economy borrowing to build factories that will pay for themselves is using foreign saving well; a country borrowing abroad to fund consumption or a property bubble is storing up trouble. Large, lasting imbalances either way draw scrutiny: before 2008 the US ran deficits near 6 % of GDP while China's surplus approached 10 %, and Germany's surplus stayed around 7–8 % of GDP in the late 2010s.

### Exchange rates and the J-curve
A weaker currency makes exports cheaper abroad and imports dearer at home, and in time tends to shrink a trade deficit ([[exchange-rates]]). Not at once: contracts are fixed and habits slow, so for months the same volumes of imports simply cost more and the balance worsens. Only as volumes adjust does it improve — a dip and rise shaped like a J. It improves at all only if exports and imports respond enough to prices (the **Marshall–Lerner condition**: the two price elasticities together exceed one). The simulation traces the J.

### Tariffs and the argument over trade
Trade lets countries specialise in what they do relatively best ([[comparative-advantage]]). Most economists hold that the gains are large overall but unevenly shared: factories close in some towns while prices fall for everyone. A **tariff** is a tax on imports, paid in the first instance by the importer; studies of the US tariffs of 2018–19 found that most of the cost fell on domestic buyers. Because the overall balance is set by saving and investment, tariffs tend to change *what* is traded more than the balance itself, and they invite retaliation. Supporters argue for them on other grounds — protecting strategic industries and supply chains, national security, answering foreign subsidies — and those arguments turn on politics and security as much as on economics.

### What it means for you
Trade decides the price of much of what you buy and the security of many jobs. A persistent current-account deficit financed by short-term foreign borrowing is one of the classic warning signs before currency and banking crises ([[financial-crises]]); a surplus country's savers, in turn, own growing assets abroad and carry currency risk on them.
`,
  ideas: [
    'The current account (trade, income, transfers) and the financial account mirror each other: a deficit is financed by capital inflows.',
    'The current account equals national saving minus investment: CA = (Sp − I) + (T − G).',
    'A deficit is borrowing from abroad — useful if it funds productive investment, risky if it funds consumption or a bubble.',
    'After a depreciation the trade balance often worsens before it improves: the J-curve.',
    'Tariffs are taxes paid mostly by domestic buyers; they change what is traded more than the overall balance.'
  ],
  pitfalls: [
    'A trade deficit means the country is losing — It means it spends more than it earns abroad and imports capital; whether that is a problem depends on what the money finances.',
    'Tariffs make the foreign exporter pay — Importers pay the tax, and studies find most of the cost is passed to domestic buyers.',
    'A weaker currency improves the trade balance straight away — Volumes adjust slowly; at first imports just cost more, so the balance often worsens first.'
  ],
  formulas: [
    {
      name: 'Current account from saving and investment',
      expr: 'CA = Sp - I + B', tex: '\\mathrm{CA} = (S_p - I) + B',
      vars: {
        CA: { name: 'current-account balance, share of GDP', q: 'ratio', unit: '%', signed: true, tex: '\\mathrm{CA}' },
        Sp: { name: 'private saving, share of GDP', q: 'ratio', unit: '%', value: 24, tex: 'S_p' },
        I: { name: 'investment, share of GDP', q: 'ratio', unit: '%', value: 22 },
        B: { name: 'government budget balance T − G, share of GDP', q: 'ratio', unit: '%', value: -5, signed: true, min: -40, max: 40 }
      },
      note: 'An accounting identity: it always holds, but it does not say which term causes which.',
      stories: {
        CA: 'Private saving is {Sp} of GDP, investment {I}, and the government budget balance is {B}. What is the current-account balance?',
        B: 'Private saving is {Sp} of GDP, investment {I}, and the current account is {CA}. What is the government budget balance?'
      }
    },
    {
      name: 'Trade balance',
      expr: 'NX = X - M', tex: '\\mathrm{NX} = X - M',
      vars: {
        NX: { name: 'trade balance', q: 'money', unit: '$bn', signed: true, tex: '\\mathrm{NX}' },
        X: { name: 'exports of goods and services', q: 'money', unit: '$bn', value: 500 },
        M: { name: 'imports of goods and services', q: 'money', unit: '$bn', value: 450 }
      },
      stories: { NX: 'A country exports {X} and imports {M} of goods and services. What is its trade balance?' }
    }
  ],
  examples: [
    {
      title: 'Where a deficit comes from',
      q: 'Private saving is 24 % of GDP, investment 22 %, and the government deficit 5 % of GDP. Find the current account. If the government halves its deficit and nothing else changes, what happens?',
      steps: [
        '$CA = (24 - 22) + (-5) = -3\\%$ of GDP: the country borrows 3 % of GDP a year from abroad.',
        'With a deficit of 2.5 %: $CA = 2 - 2.5 = -0.5\\%$.',
        'In practice other terms move too — private saving may fall as incomes adjust — so the effect is usually smaller; but the identity shows why budget and external deficits are linked.'
      ],
      a: '−3 % of GDP, improving to about −0.5 % if nothing else changes.'
    },
    {
      title: 'Tracing a J-curve',
      q: 'Exports and imports are both ¤100 bn a year. The currency weakens 20 %. Exports are priced in home currency, imports in foreign currency. Over time export volumes grow by the factor $1.2^{0.8}$ and import volumes shrink by $1.2^{-0.6}$. Find the trade balance just after the move and once volumes have adjusted.',
      steps: [
        'Just after: exports still ¤100 bn; the same imports now cost $100 \\times 1.2 = ¤120$ bn. Balance: $-¤20$ bn.',
        'Later: exports $100 \\times 1.2^{0.8} = ¤115.7$ bn; imports $120 \\times 1.2^{-0.6} = ¤107.6$ bn. Balance: $+¤8.1$ bn.',
        'The elasticities here add to 1.4, more than 1, so the Marshall–Lerner condition holds and the balance ends up better than before.'
      ],
      a: 'From balance to −¤20 bn at first, then +¤8.1 bn: a J.'
    }
  ],
  quiz: [
    { q: 'A current-account deficit means the country…', choices: ['is losing money for ever', 'spends more than it earns abroad and covers it by borrowing or selling assets', 'must have unfair trade partners', 'must have a government deficit'], a: 1,
      why: 'It is the external counterpart of investing more than it saves. Whether it is a problem depends on what it finances and how.' },
    { q: 'National saving is 18 % of GDP and investment 21 %. What is the current-account balance, in % of GDP?', answer: -3, unit: '%',
      why: '$CA = S - I = 18 - 21 = -3\\%$ of GDP.' },
    { q: 'Right after a depreciation, the trade balance often gets worse before it gets better.', a: true,
      why: 'Import volumes are fixed in the short run, so they simply cost more; export and import volumes respond to the new prices only over months — the J-curve.' },
    { q: 'A tariff on imported steel is paid, in the first instance, by…', choices: ['the foreign steelmaker', 'the domestic importer', 'the foreign government', 'nobody'], a: 1,
      why: 'The importer pays it at the border; how much is then passed on to customers or absorbed by foreign sellers is an empirical question, and recent studies find buyers bore most of it.' },
    { q: 'The government cuts its deficit and private saving and investment do not change. The current account…', choices: ['improves', 'worsens', 'stays the same'], a: 0,
      why: 'In $CA = (S_p - I) + (T - G)$, a larger $T - G$ raises the current account one for one.' }
  ],
  applications: ['Reading trade and current-account news without the "winning and losing" framing.', 'Understanding why budget and external deficits often move together.', 'Seeing why a depreciation takes time to help exporters\' sales and the trade balance.', 'Following debates over tariffs and trade policy.'],
  sim: { id: 'mac-fx', params: { focus: 'trade' } }
}

);
