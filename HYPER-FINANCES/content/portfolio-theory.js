/* HYPER-FINANCES · content/portfolio-theory.js — Portfolio and Risk: building a portfolio.
 * Expected return, volatility, correlation, the efficient frontier, the Sharpe ratio, beta and
 * the CAPM, asset allocation, drawdowns and sequence-of-returns risk.
 * Round illustrative assumptions used throughout (not forecasts): shares 8 % expected with 18 %
 * volatility, bonds 4 % with 6 %, cash 2 %, correlation between shares and bonds 0.2.
 * Simulations: sims/portfolio-wealth.js (pw-*). */
Hyper.add(

/* ================================================================ expected return */
{
  id: 'expected-return', parent: 'portfolio-theory', title: 'Expected return', level: 1,
  short: 'The probability-weighted average of what an investment might return — the centre of the range of outcomes. It is not what you will get, and over many years your money grows at a lower, compound rate.',
  keywords: ['expected return', 'mean return', 'average return', 'arithmetic mean', 'geometric mean', 'compound return', 'volatility drag', 'variance drain', 'scenario analysis', 'equity premium', 'historical returns'],
  prereq: ['risk-and-return', 'compounding-returns', 'math:expected-value'],
  related: ['volatility', 'efficient-frontier', 'monte-carlo-planning', 'math:geometric-series'],
  body: `
Ask what an investment will return and the honest answer is a range of possibilities, not a number. The **expected return** is the centre of that range: the average of every outcome you think possible, each weighted by how likely it is. It is what you would earn *on average* if you could make the same bet many times over — not what you will earn next year, and, surprisingly, not even what you are most likely to earn over a lifetime.

### Weighing the outcomes
Suppose a share fund could have a boom year (+25 %) with probability one in four, an ordinary year (+8 %) half the time, and a slump (−15 %) one time in four. Its expected return is the [[math:expected-value|expected value]] of those outcomes:

$$\\mu = \\sum_i p_i\\,r_i = 0.25 \\times 25\\,\\% + 0.5 \\times 8\\,\\% + 0.25 \\times (-15\\,\\%) = 6.5\\,\\%$$

No single year returns 6.5 %; the number is a balance point. For a portfolio, the expected return is simply the weighted average of its parts: 60 % in shares expected to earn 8 % and 40 % in bonds expected to earn 4 % gives $0.6 \\times 8 + 0.4 \\times 4 = 6.4\\,\\%$.

### The average and the compound return
Here is the surprise at the heart of investing. Take a bet that gains 50 % or loses 40 % on the toss of a coin. The average outcome is +5 % a toss — an attractive expected return. Yet one gain and one loss leave $1.5 \\times 0.6 = 0.9$ of your money: a 10 % loss. After ten tosses with five of each, ¤10,000 has become ¤5,905. The *average* over all possible sequences is still ¤16,289, pulled up by a few very lucky runs — but the typical player loses.

Two different averages are at work. The **arithmetic mean** is the expected return of one period. The **geometric mean**, or compound return, is the steady rate that would turn the start into the end — the [[compounding-returns|CAGR]]. Volatility pushes them apart, by roughly half the variance:

$$G \\approx \\mu - \\frac{\\sigma^2}{2}$$

A portfolio averaging 8 % with a [[volatility]] of 20 % compounds at about 6 %. The coin bet, with $\\mu = 5\\,\\%$ and $\\sigma = 45\\,\\%$, compounds at about $5 - 10 = -5\\,\\%$ (exactly −5.1 %).

> [!key] Expected return is the average of one period. Your money grows at the compound rate, which is lower — and the gap grows with the square of the volatility.

### Where the numbers come from
Nobody knows the true expected return of a market. It is estimated from history, or from today's prices (dividend and bond yields, valuations). History is a blunt instrument: when yearly returns swing by 20 %, thirty years of data pin down the average only to about ±3.7 % — the standard error $\\sigma/\\sqrt{n}$ — and a century to about ±2 %. As rough anchors, over 1900–2020 world shares returned roughly 5 % a year above inflation, government bonds about 2 % and treasury bills under 1 %; the century was kind to some markets and ruinous to others.

### What it means for your plan
Plan with modest expected returns expressed in today's money, and remember that a plan built on the average return lands short about half the time. The expected return locates the centre of the cloud of outcomes; [[volatility]] says how wide it is. You need both before you can judge a mix, which is what the [[efficient-frontier|efficient frontier]] does.
`,
  ideas: [
    'The expected return is a probability-weighted average of possible outcomes, not a prediction for any one year.',
    'A portfolio\'s expected return is the weighted average of its parts\' expected returns.',
    'Money grows at the compound (geometric) rate, roughly the average minus half the variance.',
    'Two assets with the same average return but different volatilities will usually leave different amounts after many years.',
    'Expected returns are estimated, never known; decades of data still leave an uncertainty of a few per cent a year.'
  ],
  pitfalls: [
    'The expected return is what I should expect to receive — It is a balance point across possible outcomes. Any single year will almost certainly differ from it, and over many years the typical (median) result grows at the lower compound rate.',
    'Averaging yearly returns tells me how my money grew — A +50 % year and a −50 % year average 0 %, but leave you with 75 % of your money. Growth is measured by the compound return.',
    'A long history reveals the true average — With volatility near 20 %, even a century of data leaves about ±2 % a year of uncertainty, and the future need not resemble the past.'
  ],
  formulas: [
    {
      name: 'Expected return from scenarios',
      expr: 'mu = p1*r1 + p2*r2 + (1 - p1 - p2)*r3', tex: '\\mu = p_1 r_1 + p_2 r_2 + (1 - p_1 - p_2)\\,r_3',
      vars: {
        mu: { name: 'expected return', q: 'ratio', unit: '%', signed: true },
        p1: { name: 'probability of a boom', q: 'ratio', unit: '%', value: 25, min: 0, max: 100 },
        r1: { name: 'return in a boom', q: 'ratio', unit: '%', value: 25, signed: true, min: -100, max: 300 },
        p2: { name: 'probability of an ordinary year', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        r2: { name: 'return in an ordinary year', q: 'ratio', unit: '%', value: 8, signed: true, min: -100, max: 300 },
        r3: { name: 'return in a slump', q: 'ratio', unit: '%', value: -15, signed: true, min: -100, max: 300 }
      },
      note: 'The slump has whatever probability is left, $1 - p_1 - p_2$. Solve for $r_3$ to see how bad a slump the other numbers can absorb.',
      practice: { unknowns: ['mu', 'r3'] },
      stories: {
        mu: 'A fund can have a boom year of {r1} with probability {p1}, an ordinary year of {r2} with probability {p2}, or otherwise a slump of {r3}. What is its expected return?',
        r3: 'A fund returns {r1} in a boom (probability {p1}) and {r2} in an ordinary year (probability {p2}); otherwise it slumps. Its expected return is {mu}. What return does the slump imply?'
      }
    },
    {
      name: 'Compound growth from the average and the volatility',
      expr: 'G = mu - s^2/2', tex: 'G = \\mu - \\frac{\\sigma^2}{2}',
      vars: {
        G: { name: 'compound (geometric) yearly return', q: 'ratio', unit: '%', signed: true },
        mu: { name: 'average (arithmetic) yearly return', q: 'ratio', unit: '%', value: 8, signed: true },
        s: { name: 'volatility', q: 'ratio', unit: '%', value: 20, tex: '\\sigma' }
      },
      note: 'An approximation, good for yearly volatilities up to about 30 %. It is why reducing volatility without reducing the average raises long-run wealth.',
      practice: { unknowns: ['G', 's'] },
      stories: {
        G: 'A portfolio averages {mu} a year with a volatility of {s}. Roughly what yearly rate does it compound at?',
        s: 'A fund has averaged {mu} a year but compounded at only {G}. Roughly what volatility explains the gap?'
      }
    },
    {
      name: 'Uncertainty of an average return estimated from history',
      expr: 'SE = s/sqrt(n)', tex: '\\mathrm{SE} = \\frac{\\sigma}{\\sqrt{n}}',
      vars: {
        SE: { name: 'standard error of the average', q: 'ratio', unit: '%' },
        s: { name: 'volatility of yearly returns', q: 'ratio', unit: '%', value: 20, tex: '\\sigma' },
        n: { name: 'years of data', int: true, value: 30 }
      },
      note: 'About two standard errors either side of the measured average is a 95 % range for the true one — if the future behaves like the past.',
      practice: { unknowns: ['SE', 'n'] },
      stories: {
        SE: 'Yearly returns swing with a volatility of {s}. How precisely (one standard error) do {n} years of history pin down the average return?',
        n: 'Yearly returns have a volatility of {s}. How many years of data would pin the average down to a standard error of {SE}?'
      }
    }
  ],
  examples: [
    {
      title: 'The coin-toss investment',
      q: 'A bet gains 50 % or loses 40 % on the toss of a coin. Find its expected return per toss, its compound return, and what ¤10,000 becomes after ten tosses with five gains and five losses.',
      steps: [
        'Expected return: $0.5 \\times 50\\,\\% + 0.5 \\times (-40\\,\\%) = 5\\,\\%$ a toss.',
        'A gain and a loss multiply your money by $1.5 \\times 0.6 = 0.9$, so the compound return per toss is $\\sqrt{0.9} - 1 = -5.1\\,\\%$.',
        'Five of each: $10\\,000 \\times 0.9^5 = ¤5{,}905$.',
        'The average across all $2^{10}$ equally likely sequences is $10\\,000 \\times 1.05^{10} = ¤16{,}289$ — carried by a few runs with many gains.'
      ],
      a: 'Expected +5 % a toss, compound −5.1 % a toss; the typical result after ten tosses is ¤5,905.'
    },
    {
      title: 'Average against compound',
      q: 'A fund averages 8 % a year with a volatility of 18 %. What does ¤10,000 grow to in 30 years at the average, and roughly at the compound rate?',
      steps: [
        'At the average: $10\\,000 \\times 1.08^{30} = ¤100{,}627$.',
        { text: 'Compound rate:', tex: 'G \\approx 8\\,\\% - \\frac{(18\\,\\%)^2}{2} = 8\\,\\% - 1.62\\,\\% = 6.38\\,\\%' },
        'At the compound rate: $10\\,000 \\times 1.0638^{30} \\approx ¤63{,}944$ — close to the median of simulated markets with these numbers (about ¤66,700).',
        'The ¤100,627 is the *mean* outcome, pulled up by the lucky paths; a typical investor ends near ¤64,000–67,000.'
      ],
      a: 'About ¤100,600 at the average, but a typical result nearer ¤64,000 at the compound rate of 6.4 %.'
    }
  ],
  quiz: [
    { q: 'A fund returns +30 % one year and −30 % the next. Its average yearly return is 0 %. What has happened to ¤10,000?', choices: ['it is still ¤10,000', 'it has fallen to ¤9,100', 'it has risen to ¤10,900', 'it has fallen to ¤7,000'], a: 1,
      why: '$10\\,000 \\times 1.3 \\times 0.7 = ¤9{,}100$. Losses and gains of the same size do not cancel: the compound return is below the average.' },
    { q: 'A share has three possible outcomes next year: +20 % with probability 30 %, +6 % with probability 50 %, and −15 % with probability 20 %. What is its expected return, in %?', answer: 6, unit: '%',
      why: '$0.3 \\times 20 + 0.5 \\times 6 + 0.2 \\times (-15) = 6 + 3 - 3 = 6\\,\\%$.' },
    { q: 'If a portfolio\'s expected return is 7 % a year, the most likely outcome after 30 years is growth at 7 % a year.', a: false,
      why: 'The typical (median) outcome grows at the compound rate, about $\\mu - \\sigma^2/2$, which is below 7 % whenever returns vary.' },
    { q: 'Two funds both average 8 % a year. One has a volatility of 10 %, the other 25 %. Which probably leaves more after 20 years?', choices: ['the one with 10 % volatility', 'the one with 25 % volatility', 'they leave the same', 'there is no way to tell'], a: 0,
      why: 'Compound rates: about $8 - 0.5 = 7.5\\,\\%$ against $8 - 3.1 = 4.9\\,\\%$. Volatility costs compound growth.' },
    { q: 'Yearly returns have a volatility of 16 %. Roughly how precisely do 64 years of history pin down the average return — one standard error, in %?', answer: 2, unit: '%',
      why: '$\\sigma/\\sqrt{n} = 16\\,\\%/\\sqrt{64} = 2\\,\\%$: even 64 years leave a 95 % range about ±4 % wide around the measured average.' }
  ],
  applications: ['Setting the return assumption in a savings or retirement plan.', 'Seeing why an average return overstates how money grows.', 'Comparing mixes of shares, bonds and cash before choosing one.', 'Judging a fund\'s track record: how much of it could be luck.'],
  history: 'The gap between the average and the typical outcome was noticed early. Daniel Bernoulli argued in 1738 that people judge a gamble by the average of its usefulness to them rather than of its money. In 1956 John Kelly, an engineer at Bell Labs, showed that the betting fraction that maximises long-run growth maximises the expected logarithm of wealth — in other words, the geometric return.',
  sim: { id: 'pw-drawdown', params: { mu: 8, sd: 20 } }
},

/* ================================================================ volatility */
{
  id: 'volatility', parent: 'portfolio-theory', title: 'Volatility and standard deviation', level: 1,
  short: 'Volatility is the standard deviation of an investment\'s returns: how widely they wander around their average. It sets the range of likely years, grows with the square root of time, and quietly lowers compound growth.',
  keywords: ['volatility', 'standard deviation', 'risk', 'variance', 'annualised volatility', 'square root of time', 'normal distribution', 'fat tails', 'range of returns', 'volatility drag'],
  prereq: ['expected-return', 'math:standard-deviation', 'math:normal-distribution'],
  related: ['drawdowns', 'correlation', 'sharpe-ratio', 'risk-and-return', 'leveraged-etfs'],
  body: `
Volatility is how much an investment's return wanders around its average. In numbers it is the [[math:standard-deviation|standard deviation]] of the returns, usually quoted per year. A fund with an expected return of 7 % and a volatility of 16 % will, in a typical year, land somewhere between −9 % and +23 %. It is the most common single measure of investment risk — useful, and incomplete.

### Reading the number
If yearly returns followed a bell curve (a [[math:normal-distribution|normal distribution]]), about two years in three would fall within one volatility of the average, and nineteen in twenty within two:

| Range | Share of years | Fund with $\\mu$ = 7 %, $\\sigma$ = 16 % |
|---|---:|---|
| $\\mu \\pm \\sigma$ | about 68 % | −9 % to +23 % |
| $\\mu \\pm 2\\sigma$ | about 95 % | −25 % to +39 % |

The same fund loses money in about one year out of three. That is normal for shares, not a sign that something is broken. As rough historical magnitudes, broad share markets have swung by around 15–20 % a year, medium-term government bonds by around 5–8 %, and cash hardly at all in money terms; single companies commonly show 30–50 %.

### From months to years
Volatility is estimated from monthly or daily returns and scaled up. If returns in different periods are independent, their variances add, so the standard deviation grows with the square root of time:

$$\\sigma_{\\text{year}} = \\sigma_{\\text{month}}\\sqrt{12}$$

A monthly standard deviation of 4.5 % is about 15.6 % a year; a daily 1 % is about 15.9 % a year (with some 252 trading days).

### Time and volatility
Two truths about long horizons pull in opposite directions. The **average yearly return** over $T$ years becomes more predictable: its spread shrinks like $\\sigma/\\sqrt{T}$, so over 20 years the 16 % becomes about 3.6 %. But your **wealth** becomes less predictable in money terms, because uncertainty compounds: the gap between a lucky and an unlucky 30-year result is measured in multiples. Time changes the shape of risk; it does not remove it.

### Volatility costs growth
Losses and gains are not symmetric: −20 % followed by +20 % leaves you 4 % down. That is why the compound growth rate is about $\\mu - \\sigma^2/2$ ([[expected-return]]). The more a portfolio swings, the less it compounds for the same average — and reducing volatility without reducing the average, which [[correlation|low correlation]] allows, raises long-run wealth directly. The same arithmetic erodes [[leveraged-etfs|leveraged funds]].

### What volatility does not tell you
Standard deviation treats a surprise gain like a surprise loss, and the bell curve behind the ranges has thin tails: it makes crashes look far rarer than they are. On 19 October 1987 US shares fell about 20 % in a day, more than twenty times their typical daily move — an event a bell curve says should essentially never happen. Volatility also clusters: calm years are calm, and crises bring weeks of violent swings. [[drawdowns|Drawdowns]] — how far and for how long you fall — are a useful second measure.

> [!tip] To feel a volatility, subtract two of it from the expected return: that is a bad year you should expect roughly once in forty. For a 60/40 mix of shares and bonds with 6.4 % and 11.5 %, it is about −17 %. Decide before it happens whether you would hold on.
`,
  ideas: [
    'Volatility is the standard deviation of returns: about two years in three fall within one volatility of the average.',
    'Yearly volatility is the monthly one times the square root of 12, if months are independent.',
    'Over long periods the average return grows more predictable, but the spread of final wealth grows.',
    'Volatility lowers compound growth: the compound rate is about the average minus half the variance.',
    'Real returns have fatter tails than the bell curve: crashes are more common than volatility alone suggests.'
  ],
  pitfalls: [
    'Volatility is the same thing as risk — It measures variability. For a long-term saver the risks that matter are not reaching a goal, being forced to sell in a slump, and permanent loss; volatility is a proxy for them, not the whole story.',
    'A long horizon makes shares safe — The average return becomes more predictable, but the range of final wealth in money widens, and deep falls still happen. Time helps, it does not guarantee.',
    'A 5 % fall and a 5 % rise cancel out — They leave you 0.25 % down; bigger swings cost more: −20 % then +20 % leaves you 4 % down.'
  ],
  formulas: [
    {
      name: 'From a shorter period to a year',
      expr: 'sy = sp*sqrt(n)', tex: '\\sigma_{y} = \\sigma_{p}\\sqrt{n}',
      vars: {
        sy: { name: 'yearly volatility', q: 'ratio', unit: '%', tex: '\\sigma_{y}' },
        sp: { name: 'volatility per period (month, week, day)', q: 'ratio', unit: '%', value: 4.5, tex: '\\sigma_{p}' },
        n: { name: 'periods in a year', int: true, value: 12 }
      },
      note: '12 for months, 52 for weeks, about 252 for trading days. Assumes returns in different periods are independent.',
      practice: { unknowns: ['sy', 'sp'] },
      stories: {
        sy: 'Monthly returns of a fund have a standard deviation of {sp}. With {n} periods a year, what is its yearly volatility?',
        sp: 'A fund has a yearly volatility of {sy}. What standard deviation does that imply for each of the {n} periods of a year?'
      }
    },
    {
      name: 'The edge of a likely range',
      expr: 'L = mu - k*s', tex: 'L = \\mu - k\\,\\sigma',
      vars: {
        L: { name: 'low end of the range', q: 'ratio', unit: '%', signed: true },
        mu: { name: 'expected yearly return', q: 'ratio', unit: '%', value: 7, signed: true },
        k: { name: 'number of volatilities below the average', value: 2, min: 0, max: 6 },
        s: { name: 'volatility', q: 'ratio', unit: '%', value: 16, tex: '\\sigma' }
      },
      note: 'Under a bell curve about 16 % of years fall below $k = 1$ and about 2.5 % below $k = 2$. Real markets breach the lower edge more often than that.',
      practice: { unknowns: ['L', 's'] },
      stories: {
        L: 'A fund is expected to return {mu} a year with a volatility of {s}. What return lies {k} volatilities below the average?',
        s: 'A fund expected to return {mu} a year has a bad year, {k} volatilities below average, of {L}. What is its volatility?'
      }
    },
    {
      name: 'Spread of the average return over many years',
      expr: 'sT = s/sqrt(T)', tex: '\\sigma_{T} = \\frac{\\sigma}{\\sqrt{T}}',
      vars: {
        sT: { name: 'volatility of the average yearly return', q: 'ratio', unit: '%', tex: '\\sigma_{T}' },
        s: { name: 'yearly volatility', q: 'ratio', unit: '%', value: 16, tex: '\\sigma' },
        T: { name: 'number of years', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'The average becomes more predictable with time; the final amount of money does not.',
      practice: { unknowns: ['sT', 'T'] },
      stories: {
        sT: 'Yearly returns have a volatility of {s}. How much does the average yearly return over {T} typically vary?',
        T: 'Yearly returns have a volatility of {s}. Over how many years does the average yearly return have a spread of only {sT}?'
      }
    }
  ],
  examples: [
    {
      title: 'Annualising a volatility',
      q: 'A fund\'s monthly returns have a standard deviation of 4.5 %, and a share\'s daily returns one of 1 %. What are their yearly volatilities?',
      steps: [
        'Monthly: $4.5\\,\\% \\times \\sqrt{12} = 4.5 \\times 3.464 = 15.6\\,\\%$ a year.',
        'Daily, with about 252 trading days: $1\\,\\% \\times \\sqrt{252} = 1 \\times 15.87 = 15.9\\,\\%$ a year.',
        'They are about equally volatile, although one is measured over months and the other over days.'
      ],
      a: 'About 15.6 % and 15.9 % a year.'
    },
    {
      title: 'A bad year for a 60/40 mix',
      q: 'A portfolio of 60 % shares and 40 % bonds is expected to return 6.4 % a year with a volatility of 11.5 %. Worth ¤200,000, what might it lose in a one-in-forty bad year?',
      steps: [
        'Two volatilities below the average: $6.4 - 2 \\times 11.5 = -16.6\\,\\%$.',
        'In money: $200\\,000 \\times 0.166 \\approx ¤33{,}300$.',
        'Under a bell curve a year this bad or worse comes about once in forty; real markets have delivered worse (see [[drawdowns]]).'
      ],
      a: 'A fall of about 17 %, some ¤33,000.'
    }
  ],
  quiz: [
    { q: 'A share\'s daily returns have a standard deviation of 1.2 %. Roughly what is its yearly volatility, with 252 trading days, in %?', answer: 19.05, unit: '%',
      why: '$1.2 \\times \\sqrt{252} = 1.2 \\times 15.87 \\approx 19\\,\\%$.' },
    { q: 'Your fund falls 20 % one year and rises 20 % the next. Where are you?', choices: ['back where you started', '4 % below where you started', '4 % above where you started', '2 % below where you started'], a: 1,
      why: '$0.8 \\times 1.2 = 0.96$. The rise is measured on a smaller base.' },
    { q: 'Holding shares for 30 years instead of 3 narrows the range of possible final amounts of money.', a: false,
      why: 'The average yearly return becomes more predictable, but compounding spreads the final wealth wider in money terms.' },
    { q: 'A fund has an expected return of 6 % and a volatility of 12 %. Under a bell curve, roughly how often does it lose money in a year?', choices: ['about one year in three', 'about one year in six', 'about one year in twenty', 'almost never'], a: 0,
      why: 'A loss means falling more than half a volatility below the average (6/12 = 0.5); about 31 % of a normal distribution lies below −0.5 standard deviations.' },
    { q: 'Yearly volatility is 18 %. What is the volatility of the average yearly return over 36 years, in %?', answer: 3, unit: '%',
      why: '$18\\,\\%/\\sqrt{36} = 3\\,\\%$.' }
  ],
  applications: ['Estimating a realistic bad year before choosing how much to hold in shares.', 'Comparing funds measured over different periods (daily, monthly, yearly).', 'Understanding why volatile investments compound more slowly.', 'Reading fund documents, many of which rank risk by volatility.'],
  sim: 'pw-drawdown'
},

/* ================================================================ correlation */
{
  id: 'correlation', parent: 'portfolio-theory', title: 'Correlation', level: 2,
  short: 'Correlation, from −1 to +1, measures how closely two returns move together. Mixing assets that are not perfectly correlated gives a portfolio less volatile than the average of its parts — the source of every benefit of diversification.',
  keywords: ['correlation', 'correlation coefficient', 'covariance', 'diversification', 'rho', 'portfolio variance', 'two-asset portfolio', 'systematic risk', 'market risk', 'stock-bond correlation'],
  prereq: ['volatility', 'diversification', 'math:linear-regression'],
  related: ['efficient-frontier', 'capm-beta', 'asset-allocation', 'math:standard-deviation'],
  body: `
Two investments that zig and zag at the same moments give each other little protection; two that move independently cancel part of each other's swings. **Correlation** measures which kind of pair you have. It is a number between −1 and +1:

- $\\rho = +1$: the two move in perfect lockstep, up and down together in proportion.
- $\\rho = 0$: no linear relation — knowing one tells you nothing about the other.
- $\\rho = -1$: perfect opposites; the right mix of the two has no risk at all.

It is the standardised covariance, $\\operatorname{cov}(R_1, R_2) = \\rho\\,\\sigma_1\\sigma_2$, the same coefficient that measures how well a straight line fits a scatter of points in [[math:linear-regression|regression]]. Real pairs sit in between. Shares of two companies in the same country often show 0.2–0.6; the broad share markets of different rich countries often 0.6–0.9 in recent decades; shares against high-quality government bonds anything from about −0.5 to +0.5, depending on the era.

### Why it matters: the risk of a mix
With weights $w$ and $1-w$, the variance of a two-asset portfolio is

$$\\sigma_p^2 = w^2\\sigma_1^2 + (1-w)^2\\sigma_2^2 + 2w(1-w)\\,\\rho\\,\\sigma_1\\sigma_2$$

The expected return of the mix is just the weighted average, but the risk is **below** the weighted average whenever $\\rho < 1$. Two assets that each have 20 % volatility, held half and half:

| Correlation | Volatility of the 50/50 mix |
|---:|---:|
| +1 | 20.0 % |
| +0.5 | 17.3 % |
| 0 | 14.1 % |
| −0.5 | 10.0 % |
| −1 | 0 % |

The expected return is the same in every row; only the correlation changed. This is the one free lunch in finance: risk removed at no cost in expected return. For shares (18 %) and bonds (6 %) held 60/40, the weighted average of their volatilities is 13.2 %, but the mix has 11.5 % at a correlation of 0.2, and 10.3 % at −0.3.

### Many assets: the floor of market risk
Spread money equally over $N$ assets with the same volatility $\\sigma$ and the same correlation $\\rho$ between every pair, and

$$\\sigma_p = \\sigma\\sqrt{\\rho + \\frac{1-\\rho}{N}}$$

With typical single shares ($\\sigma = 30\\,\\%$, $\\rho = 0.3$): one share 30 %, five shares 19.9 %, twenty 17.4 %, fifty 16.8 % — and never below $\\sigma\\sqrt{\\rho} = 16.4\\,\\%$. Most of the benefit arrives with the first twenty or so holdings. What remains is the risk they all share, **market risk**, which no amount of spreading within one market removes; [[capm-beta|beta]] measures it. Only assets that respond differently — bonds, other economies, other asset classes — lower it further.

### Correlation is not a constant
Measured correlations drift. In the United States, shares and government bonds moved mostly together from the late 1960s to the late 1990s, mostly in opposite directions in the two decades after, and fell together sharply in 2022 when inflation and interest rates rose. Correlations between risky assets also tend to jump in crises, just when diversification is most wanted — in 2008 almost everything except high-quality government bonds and cash fell at once.

> [!warn] Correlation measures an average, linear relationship. Plan with a range of correlations rather than one number, and do not count on two risky assets to protect each other in a panic.
`,
  ideas: [
    'Correlation runs from −1 (perfect opposites) through 0 (unrelated) to +1 (lockstep).',
    'A mix\'s expected return is the weighted average of its parts, but its risk is lower whenever the correlation is below +1.',
    'With many holdings, company-specific risk fades and only the shared market risk, about $\\sigma\\sqrt{\\rho}$, remains.',
    'Correlations change over time and tend to rise in crises, just when protection is wanted.'
  ],
  pitfalls: [
    'Owning many funds means being diversified — Ten funds that all hold the same kind of shares are highly correlated; diversification comes from low correlation, not from the number of holdings.',
    'A low correlation means the two never fall together — Correlation is an average over time; assets with low correlation in calm years have often fallen together in panics.',
    'Correlation shows cause — Two returns can move together because both respond to a third force (interest rates, the economy), and the link can vanish when that force changes.'
  ],
  derivation: {
    title: 'The variance of a two-asset portfolio',
    intro: 'The portfolio return is $R_p = wR_1 + (1-w)R_2$ and its expected return is $\\mu_p = w\\mu_1 + (1-w)\\mu_2$.',
    steps: [
      { text: 'Subtract the expected returns. Write $d_1 = R_1 - \\mu_1$ and $d_2 = R_2 - \\mu_2$ for the surprises:', tex: 'R_p - \\mu_p = w\\,d_1 + (1-w)\\,d_2' },
      { text: 'The variance is the expected square of the surprise. Expand the square:', tex: '\\sigma_p^2 = E\\big[(w d_1 + (1-w) d_2)^2\\big] = w^2 E[d_1^2] + (1-w)^2 E[d_2^2] + 2w(1-w)\\,E[d_1 d_2]' },
      { text: 'By definition $E[d_1^2] = \\sigma_1^2$, $E[d_2^2] = \\sigma_2^2$, and $E[d_1 d_2]$ is the covariance, $\\rho\\,\\sigma_1\\sigma_2$:', tex: '\\sigma_p^2 = w^2\\sigma_1^2 + (1-w)^2\\sigma_2^2 + 2w(1-w)\\,\\rho\\,\\sigma_1\\sigma_2' },
      { text: 'With $\\rho = 1$ the right side is a perfect square, so the risk is exactly the weighted average:', tex: '\\sigma_p = w\\sigma_1 + (1-w)\\sigma_2' },
      { text: 'Any $\\rho < 1$ makes the cross term smaller, so the mix is less risky than the average. With $\\rho = -1$ the square becomes $(w\\sigma_1 - (1-w)\\sigma_2)^2$, which is zero at', tex: 'w = \\frac{\\sigma_2}{\\sigma_1 + \\sigma_2}' }
    ],
    outro: 'For $N$ equal assets the same expansion has $N$ variance terms and $N(N-1)$ covariance terms; as $N$ grows the variance terms fade and the average covariance, $\\rho\\sigma^2$, is all that is left.'
  },
  formulas: [
    {
      name: 'Volatility of a two-asset mix',
      expr: 'sp = sqrt(w^2*s1^2 + (1 - w)^2*s2^2 + 2*w*(1 - w)*rho*s1*s2)',
      tex: '\\sigma_p = \\sqrt{w^2\\sigma_1^2 + (1-w)^2\\sigma_2^2 + 2w(1-w)\\,\\rho\\,\\sigma_1\\sigma_2}',
      vars: {
        sp: { name: 'volatility of the mix', q: 'ratio', unit: '%', tex: '\\sigma_p' },
        w: { name: 'weight in asset 1', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        s1: { name: 'volatility of asset 1', q: 'ratio', unit: '%', value: 18, tex: '\\sigma_1' },
        s2: { name: 'volatility of asset 2', q: 'ratio', unit: '%', value: 6, tex: '\\sigma_2' },
        rho: { name: 'correlation', value: 0.2, min: -1, max: 1, signed: true }
      },
      note: 'The defaults are 60 % shares (18 %) and 40 % bonds (6 %) with a correlation of 0.2. Solve for $\\rho$ to see what correlation a measured portfolio volatility implies.',
      practice: { unknowns: ['sp', 'rho'] },
      stories: {
        sp: 'You hold {w} in shares with a volatility of {s1} and the rest in bonds with a volatility of {s2}; their correlation is {rho}. What is the volatility of the mix?',
        rho: 'A portfolio with {w} in an asset of volatility {s1} and the rest in one of volatility {s2} has a volatility of {sp}. What correlation does that imply?'
      }
    },
    {
      name: 'Equal weights in N similar assets',
      expr: 'sp = s*sqrt(rho + (1 - rho)/N)', tex: '\\sigma_p = \\sigma\\sqrt{\\rho + \\frac{1-\\rho}{N}}',
      vars: {
        sp: { name: 'volatility of the portfolio', q: 'ratio', unit: '%', tex: '\\sigma_p' },
        s: { name: 'volatility of each asset', q: 'ratio', unit: '%', value: 30, tex: '\\sigma' },
        rho: { name: 'correlation between each pair', value: 0.3, min: 0, max: 1 },
        N: { name: 'number of assets', int: true, value: 20, min: 1 }
      },
      note: 'As $N$ grows the volatility falls towards $\\sigma\\sqrt{\\rho}$, the market risk no spreading removes.',
      practice: { unknowns: ['sp', 'N'] },
      stories: {
        sp: 'You split your money equally among {N} shares, each with a volatility of {s} and a correlation of {rho} with each other. What is the volatility of the portfolio?',
        N: 'Shares each have a volatility of {s} and a correlation of {rho}. How many, held equally, bring the portfolio\'s volatility down to {sp}?'
      }
    }
  ],
  examples: [
    {
      title: 'Shares and bonds, 60/40',
      q: 'Shares have a volatility of 18 % and bonds 6 %. What is the volatility of a 60/40 mix at a correlation of 0.2, and at −0.3?',
      steps: [
        'The three terms at $\\rho = 0.2$: $0.6^2 \\times 0.18^2 = 0.011664$; $0.4^2 \\times 0.06^2 = 0.000576$; $2 \\times 0.6 \\times 0.4 \\times 0.2 \\times 0.18 \\times 0.06 = 0.001037$.',
        '$\\sigma_p = \\sqrt{0.013277} = 11.5\\,\\%$, against a weighted average of $0.6 \\times 18 + 0.4 \\times 6 = 13.2\\,\\%$.',
        'At $\\rho = -0.3$ the cross term becomes $-0.001555$, so $\\sigma_p = \\sqrt{0.010685} = 10.3\\,\\%$.'
      ],
      a: '11.5 % at a correlation of 0.2 and 10.3 % at −0.3, both below the 13.2 % average.'
    },
    {
      title: 'How many shares are enough?',
      q: 'Single shares each have a volatility of 30 % and a correlation of 0.3 with each other. How volatile is an equal-weight portfolio of 1, 5, 20 and very many of them?',
      steps: [
        '$N = 1$: $30 \\times \\sqrt{0.3 + 0.7} = 30\\,\\%$.',
        '$N = 5$: $30 \\times \\sqrt{0.3 + 0.14} = 30 \\times 0.663 = 19.9\\,\\%$.',
        '$N = 20$: $30 \\times \\sqrt{0.3 + 0.035} = 30 \\times 0.579 = 17.4\\,\\%$.',
        'Very many: $30 \\times \\sqrt{0.3} = 16.4\\,\\%$ — the market risk that remains.'
      ],
      a: '30 %, 19.9 %, 17.4 % and a floor of 16.4 %: most of the benefit comes with the first twenty.'
    }
  ],
  quiz: [
    { q: 'Two assets have the same volatility and a correlation of 0. Compared with either asset, how volatile is a 50/50 mix?', choices: ['just as volatile', 'about 71 % as volatile', 'half as volatile', 'not volatile at all'], a: 1,
      why: '$\\sqrt{0.25\\sigma^2 + 0.25\\sigma^2} = \\sigma/\\sqrt{2} \\approx 0.71\\sigma$.' },
    { q: 'Asset 1 has a volatility of 20 % and asset 2 of 5 %, with a correlation of exactly −1. What weight in asset 1 (in %) makes the mix riskless?', answer: 20, unit: '%',
      why: '$w = \\sigma_2/(\\sigma_1 + \\sigma_2) = 5/25 = 20\\,\\%$: then $0.2 \\times 20 = 0.8 \\times 5$ and the swings cancel exactly.' },
    { q: 'Adding an asset with a lower expected return than everything you own can never improve your portfolio.', a: false,
      why: 'If its correlation with the rest is low enough, a small amount can cut risk by more than it cuts return — giving a better return for the risk.' },
    { q: 'Why does a portfolio of 500 shares from one market still fall sharply in a crash?', choices: ['because of fund fees', 'because the shares share a common market factor: their correlations are positive', 'because 500 is too few to diversify', 'because correlations are always +1'], a: 1,
      why: 'Spreading removes company-specific risk; the risk every share shares — recessions, rates, panics — remains, and correlations rise in crises.' },
    { q: 'A 50/50 mix of an asset with 30 % volatility and one with 10 %, correlation 0. What is its volatility, in %?', answer: 15.81, unit: '%',
      why: '$\\sqrt{0.25 \\times 0.09 + 0.25 \\times 0.01} = \\sqrt{0.025} = 15.8\\,\\%$, below the 20 % weighted average.' }
  ],
  applications: ['Seeing why bonds are held alongside shares.', 'Deciding how many holdings a portfolio really needs.', 'Judging whether a new investment actually diversifies what you own.', 'Stress-testing a plan for crises, when correlations rise.'],
  sim: { id: 'pw-two-assets', params: { preset: 'twins' } }
},

/* ================================================================ efficient frontier */
{
  id: 'efficient-frontier', parent: 'portfolio-theory', title: 'The efficient frontier', level: 2,
  short: 'Among all the mixes of a set of assets, the efficient ones give the highest expected return for their level of risk. Together they form the efficient frontier; every other portfolio is beaten by one on it.',
  keywords: ['efficient frontier', 'modern portfolio theory', 'MPT', 'Markowitz', 'mean-variance', 'minimum variance portfolio', 'portfolio optimisation', 'dominated portfolio', 'estimation error'],
  prereq: ['correlation', 'expected-return', 'math:optimization'],
  related: ['sharpe-ratio', 'asset-allocation', 'diversification', 'rebalancing', 'math:lagrange-multipliers'],
  body: `
In 1952 Harry Markowitz, then a graduate student at the University of Chicago, published a short paper that changed how money is managed. His point: judge an investment not on its own but by what it does to the whole portfolio, and describe every portfolio by two numbers — its [[expected-return|expected return]] and its [[volatility]]. Plot every possible mix on a chart of risk (across) against expected return (up) and a telling shape appears.

### The shape of the possibilities
Take shares (expected 8 %, volatility 18 %) and bonds (4 %, 6 %) with a [[correlation]] of 0.2 — round illustrative numbers, not forecasts. Mixed in every proportion they trace a curve, not a straight line:

| Shares | Expected return | Volatility |
|---:|---:|---:|
| 0 % | 4.0 % | 6.0 % |
| 10 % | 4.4 % | 6.0 % |
| 20 % | 4.8 % | 6.6 % |
| 40 % | 5.6 % | 8.7 % |
| 60 % | 6.4 % | 11.5 % |
| 80 % | 7.2 % | 14.7 % |
| 100 % | 8.0 % | 18.0 % |

Look at the first rows. Moving from all bonds to 10 % shares *raises* the expected return and leaves the risk unchanged; the least risky mix of all holds about 5 % shares. An all-bond portfolio is therefore **inefficient**: another portfolio offers more return for no more risk. The part of the curve below the least risky point is wasted; the part above it is the frontier.

### The frontier
The **efficient frontier** is the upper edge of everything achievable: for each level of risk, the highest expected return (equivalently, for each target return, the lowest risk). With many assets, random portfolios fill a region shaped like a bullet on its side, and the frontier is its upper-left boundary. Finding it is an [[math:optimization|optimisation]]: for each target return $\\mu^*$, choose weights to

$$\\text{minimise } \\sigma_p^2 = \\sum_i\\sum_j w_i w_j\\,\\rho_{ij}\\,\\sigma_i\\sigma_j \\quad \\text{with} \\quad \\sum_i w_i\\mu_i = \\mu^*, \\;\\; \\sum_i w_i = 1$$

usually with no negative weights. For two assets the least risky mix has a closed form:

$$w_{\\mathrm{min}} = \\frac{\\sigma_2^2 - \\rho\\,\\sigma_1\\sigma_2}{\\sigma_1^2 + \\sigma_2^2 - 2\\rho\\,\\sigma_1\\sigma_2}$$

which gives 4.5 % shares here, with an expected 4.2 % at 5.9 % volatility.

> [!key] Diversification is the only reliable free lunch: combining assets that are not perfectly correlated lowers risk without lowering the average. The frontier shows exactly how much.

### What the frontier does not tell you
It does not say **which** efficient portfolio to hold; that depends on how much risk you can bear, the subject of [[asset-allocation]] and, once cash is allowed, of the [[sharpe-ratio|Sharpe ratio]].

And it is only as good as its inputs. Volatilities and correlations can be estimated tolerably well; expected returns cannot ([[expected-return]]). The optimiser treats every small difference in its inputs as real and piles into whatever looked best in the sample, so frontiers computed from past data look better than any future will, and "optimal" weights can swing wildly when one estimate moves by a point. Practitioners respond with limits on weights, with estimates shrunk towards common values, or by holding broad, simple mixes — which, several studies of estimation error suggest, often do about as well out of sample as optimised ones.

### What it means for you
Three practical lessons survive every criticism: judge an addition by its effect on the whole; do not hold a portfolio that another mix beats on both counts; and prefer diversification you can rely on to precision you cannot.
`,
  ideas: [
    'Every portfolio can be placed on a chart by its risk and its expected return.',
    'Mixing imperfectly correlated assets bends the line between them into a curve that bulges towards lower risk.',
    'The efficient frontier is the upper-left edge: the best expected return for each level of risk.',
    'Portfolios below the frontier are dominated — another mix gives more return for the same risk.',
    'Optimisers magnify errors in their inputs, especially in expected returns, so simple broad mixes often do as well in practice.'
  ],
  pitfalls: [
    'The safest portfolio is 100 % bonds — With imperfect correlation, a small share of equities can lower risk and raise return at the same time; all bonds is usually inefficient.',
    'The frontier from past data shows what I will get — It shows what would have been best in hindsight. Future returns and correlations differ, and the optimiser overfits the past.',
    'There is one best portfolio on the frontier — Every point on it is efficient; which to hold depends on how much risk you need, can and will take.'
  ],
  formulas: [
    {
      name: 'The least risky mix of two assets',
      expr: 'wmin = (s2^2 - rho*s1*s2)/(s1^2 + s2^2 - 2*rho*s1*s2)',
      tex: 'w_{\\mathrm{min}} = \\frac{\\sigma_2^2 - \\rho\\,\\sigma_1\\sigma_2}{\\sigma_1^2 + \\sigma_2^2 - 2\\rho\\,\\sigma_1\\sigma_2}',
      vars: {
        wmin: { name: 'weight of asset 1 in the least risky mix', q: 'ratio', unit: '%', signed: true, tex: 'w_{\\mathrm{min}}' },
        s1: { name: 'volatility of asset 1', q: 'ratio', unit: '%', value: 18, tex: '\\sigma_1' },
        s2: { name: 'volatility of asset 2', q: 'ratio', unit: '%', value: 6, tex: '\\sigma_2' },
        rho: { name: 'correlation', value: 0.2, min: -1, max: 0.9, signed: true }
      },
      note: 'A negative result means the least risky mix would sell asset 1 short; with no short selling the answer is then 0 %.',
      practice: { unknowns: ['wmin'] },
      stories: {
        wmin: 'Shares have a volatility of {s1}, bonds {s2}, and their correlation is {rho}. What share of shares gives the least risky mix?'
      }
    },
    {
      name: 'Expected return of a two-asset mix',
      expr: 'mu = w*mu1 + (1 - w)*mu2', tex: '\\mu = w\\,\\mu_1 + (1-w)\\,\\mu_2',
      vars: {
        mu: { name: 'expected return of the mix', q: 'ratio', unit: '%', signed: true },
        w: { name: 'weight in asset 1', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        mu1: { name: 'expected return of asset 1', q: 'ratio', unit: '%', value: 8, signed: true },
        mu2: { name: 'expected return of asset 2', q: 'ratio', unit: '%', value: 4, signed: true }
      },
      note: 'Returns average linearly; risks do not (see [[correlation]]).',
      practice: { unknowns: ['mu', 'w'] },
      stories: {
        mu: 'Shares are expected to return {mu1} and bonds {mu2}. What does a portfolio with {w} in shares expect?',
        w: 'Shares are expected to return {mu1} and bonds {mu2}. What share of shares gives an expected return of {mu}?'
      }
    }
  ],
  examples: [
    {
      title: 'The least risky mix',
      q: 'Shares: 8 %, 18 % volatility. Bonds: 4 %, 6 %. Correlation 0.2. Find the least risky mix, its expected return and its volatility.',
      steps: [
        'Numerator: $0.06^2 - 0.2 \\times 0.18 \\times 0.06 = 0.0036 - 0.00216 = 0.00144$.',
        'Denominator: $0.0324 + 0.0036 - 2 \\times 0.00216 = 0.03168$.',
        '$w_{\\mathrm{min}} = 0.00144/0.03168 = 4.5\\,\\%$ in shares.',
        'Expected return $0.045 \\times 8 + 0.955 \\times 4 = 4.18\\,\\%$; volatility (from the two-asset formula) $5.95\\,\\%$ — below the 6 % of bonds alone.'
      ],
      a: 'About 4.5 % shares: 4.2 % expected at 5.9 % volatility.'
    },
    {
      title: 'Beating all bonds',
      q: 'With the same assumptions, which mix has exactly the risk of bonds alone (6 %), and what does it expect?',
      steps: [
        'Set $\\sigma_p^2 = 0.0036$: $0.0324w^2 + 0.0036(1-w)^2 + 0.00432\\,w(1-w) = 0.0036$.',
        'This simplifies to $w\\,(0.03168\\,w - 0.00288) = 0$, so $w = 0$ or $w = 9.1\\,\\%$.',
        'At 9.1 % shares: expected $4 + 0.091 \\times 4 = 4.36\\,\\%$, at the same 6 % volatility.'
      ],
      a: '9.1 % shares gives 4.36 % instead of 4 % for the same risk: all bonds is inefficient.'
    }
  ],
  quiz: [
    { q: 'Portfolio A: 5 % expected, 10 % volatility. B: 6 %, 10 %. C: 7 %, 12 %. Which is inefficient compared with the others?', choices: ['A', 'B', 'C', 'none of them'], a: 0,
      why: 'B offers more return than A for the same risk, so A is dominated. C takes more risk for more return; it may well be efficient.' },
    { q: 'With shares and bonds that are not perfectly correlated, the least risky mix normally holds no shares at all.', a: false,
      why: 'Adding a little of the riskier asset lowers risk at first, because its swings partly offset the other\'s; with the page\'s numbers the least risky mix holds about 4.5 % shares.' },
    { q: 'Why do frontiers computed from past data look better than what investors later get?', choices: ['fees are left out', 'the optimiser favours whatever did best in the sample, and those estimates do not repeat', 'inflation is ignored', 'they do not: they are exact'], a: 1,
      why: 'Estimation error: the optimiser treats lucky past returns as real and overweights them.' },
    { q: 'Asset 1 has 20 % volatility, asset 2 has 10 %, and their correlation is 0. What weight in asset 1 (in %) gives the least risky mix?', answer: 20, unit: '%',
      why: '$w = \\sigma_2^2/(\\sigma_1^2 + \\sigma_2^2) = 0.01/0.05 = 20\\,\\%$ when $\\rho = 0$.' },
    { q: 'You add a new asset with the same expected return and volatility as your portfolio, and a correlation of 0.3 with it. What happens to the frontier?', choices: ['it moves up and to the left: better', 'it is unchanged', 'it moves down', 'it moves to the right: worse'], a: 0,
      why: 'Mixing in something imperfectly correlated lowers risk for the same return, so better portfolios become available.' }
  ],
  applications: ['Checking whether a portfolio is dominated by a simple alternative.', 'Understanding what robo-advisers and pension funds optimise.', 'Seeing why adding a little of a risky asset can make a cautious portfolio safer.', 'Being sceptical of "optimal" portfolios built from past returns.'],
  history: 'Markowitz published "Portfolio Selection" in the Journal of Finance in 1952 and shared the 1990 Nobel prize in economics with William Sharpe and Merton Miller. In 1958 James Tobin added a riskless asset and showed that everyone should then hold the same risky mix, varying only how much of it — the separation idea behind the capital allocation line.',
  sim: ['pw-two-assets', 'pw-frontier-cloud']
},

/* ================================================================ Sharpe ratio */
{
  id: 'sharpe-ratio', parent: 'portfolio-theory', title: 'Risk-adjusted return: the Sharpe ratio', level: 2,
  short: 'The Sharpe ratio divides the return earned above cash by the volatility taken to earn it. The line from cash through a portfolio has that slope, which is why the best risky mix is the one with the highest Sharpe ratio.',
  keywords: ['Sharpe ratio', 'risk-adjusted return', 'excess return', 'risk-free rate', 'capital allocation line', 'tangency portfolio', 'separation theorem', 'Sortino ratio', 'Treynor ratio', 'reward to variability'],
  prereq: ['efficient-frontier', 'volatility', 'risk-and-return'],
  related: ['capm-beta', 'leverage-basics', 'active-vs-passive', 'money-market', 'drawdowns'],
  body: `
A fund that returned 12 % is not necessarily better than one that returned 8 %: it matters how much risk each took. The **Sharpe ratio**, proposed by William Sharpe in 1966 as the "reward-to-variability" ratio, divides the reward for taking risk by the risk taken:

$$S = \\frac{\\mu - r_f}{\\sigma}$$

Here $\\mu$ is the expected (or average) return, $r_f$ the return on a riskless asset such as treasury bills or a [[money-market|money-market fund]], and $\\sigma$ the [[volatility]]. The numerator is the **excess return** — what the investment earned beyond what cash would have paid for nothing.

### Some numbers
With cash at 2 %, shares expected at 8 % with 18 % volatility have $S = 6/18 = 0.33$, and bonds at 4 % with 6 % have $S = 2/6 = 0.33$ as well. Broad share markets have historically delivered Sharpe ratios of roughly 0.3–0.5 over long periods (US large companies over 1926–2020, roughly 0.4). A strategy claiming 2 or 3 year after year deserves suspicion before admiration.

### The capital allocation line
Here is why the ratio matters so much. Put a fraction $k$ of your money into a risky portfolio and the rest into cash. Cash has no volatility, so both the excess return and the risk scale with $k$, and every such combination lies on a straight line from cash through the portfolio:

$$\\mu_c = r_f + S\\,\\sigma_c$$

Its slope *is* the Sharpe ratio. A steeper line gives more return for every unit of risk, at whatever risk you choose. So the best risky portfolio to combine with cash is the one with the **highest** Sharpe ratio — the point where a line from cash just touches the [[efficient-frontier|efficient frontier]], the **tangency portfolio**. You then set your risk by *how much* of it you hold, not by changing its mix — James Tobin's separation idea.

With the page's assumptions the tangency portfolio holds 25 % shares and 75 % bonds: 5.0 % expected, 7.0 % volatility, a Sharpe ratio of 0.43 — better than either asset alone at 0.33. At a volatility of 10 % the line offers 6.3 %, while the best shares-and-bonds mix at that risk offers 6.0 %. The catch: to go past the tangency point you must **borrow** — 43 % more than your own money for 10 % volatility — and individuals borrow at well above the cash rate, with [[leverage-basics]]'s dangers. The theory is a guide, not a recipe; most people stay on the frontier itself above the tangency point.

### Using it well
- **Compare like with like**: the same period, the same risk-free rate, the same frequency. A monthly Sharpe ratio times $\\sqrt{12}$ is a yearly one.
- **A track record proves little quickly.** The statistic that separates skill from luck grows like $S\\sqrt{T}$: a genuine Sharpe ratio of 0.4 needs about 25 years of data to stand two standard errors clear of zero, a 0.3 about 44 years.
- **Smooth is not the same as safe.** Strategies that sell insurance-like options, or assets valued only now and then (private funds, some property funds), show smooth returns and high Sharpe ratios that hide rare, large losses. Look at [[drawdowns]] too.
- **Other ratios** answer related questions: the Sortino ratio counts only downside volatility; the Treynor ratio divides by [[capm-beta|beta]] instead of volatility.

> [!key] Return alone says nothing about skill or quality. Ask what it earned above cash, and how much risk it took to do so.
`,
  ideas: [
    'The Sharpe ratio is the excess return over cash divided by volatility.',
    'Mixing a risky portfolio with cash moves you along a straight line whose slope is its Sharpe ratio.',
    'The best risky mix to combine with cash is the one with the highest Sharpe ratio — the tangency portfolio.',
    'Two assets with equal Sharpe ratios can be combined into a portfolio with a higher one, if they are not perfectly correlated.',
    'Short track records and smoothed prices make Sharpe ratios look better than they are.'
  ],
  pitfalls: [
    'The fund with the highest return is the best — Without adjusting for risk you cannot tell skill from simply taking more risk; compare excess return per unit of volatility.',
    'A high Sharpe ratio means low risk of large losses — Volatility misses rare crashes; option-selling and rarely-priced assets can show high ratios until a single bad event.',
    'Anyone can move up the capital allocation line — Beyond the tangency point it requires borrowing at the cash rate; real borrowing costs more and carries margin-call risk.'
  ],
  formulas: [
    {
      name: 'Sharpe ratio',
      expr: 'S = (mu - rf)/s', tex: 'S = \\frac{\\mu - r_f}{\\sigma}',
      vars: {
        S: { name: 'Sharpe ratio', signed: true },
        mu: { name: 'expected or average return', q: 'ratio', unit: '%', value: 8, signed: true },
        rf: { name: 'risk-free (cash) return', q: 'ratio', unit: '%', value: 2, signed: true, tex: 'r_f' },
        s: { name: 'volatility', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' }
      },
      note: 'Use yearly figures for all three; multiply a monthly ratio by $\\sqrt{12}$ to compare.',
      practice: { unknowns: ['S', 'mu'] },
      stories: {
        S: 'A fund is expected to return {mu} with a volatility of {s}, while cash pays {rf}. What is its Sharpe ratio?',
        mu: 'Cash pays {rf}. What return must a portfolio with a volatility of {s} earn to have a Sharpe ratio of {S}?'
      }
    },
    {
      name: 'The capital allocation line',
      expr: 'mc = rf + S*sc', tex: '\\mu_c = r_f + S\\,\\sigma_c',
      vars: {
        mc: { name: 'expected return of the combination', q: 'ratio', unit: '%', signed: true, tex: '\\mu_c' },
        rf: { name: 'risk-free (cash) return', q: 'ratio', unit: '%', value: 2, tex: 'r_f' },
        S: { name: 'Sharpe ratio of the risky portfolio', value: 0.43 },
        sc: { name: 'volatility of the combination', q: 'ratio', unit: '%', value: 10, tex: '\\sigma_c' }
      },
      note: 'Holding a fraction $k$ of the risky portfolio gives $\\sigma_c = k\\sigma$. Beyond $k = 1$ the line assumes you can borrow at the cash rate.',
      practice: { unknowns: ['mc', 'sc'] },
      stories: {
        mc: 'A risky portfolio has a Sharpe ratio of {S} and cash pays {rf}. Mixing the two to a volatility of {sc}, what return do you expect?',
        sc: 'A risky portfolio has a Sharpe ratio of {S} and cash pays {rf}. How much volatility must a mix of the two carry to expect {mc}?'
      }
    },
    {
      name: 'Years of data to tell skill from luck',
      expr: 'T = (z/S)^2', tex: 'T = \\left(\\frac{z}{S}\\right)^2',
      vars: {
        T: { name: 'years of returns needed', q: 'years', unit: 'yr' },
        z: { name: 'standard errors required (2 ≈ 95 % confidence)', value: 2, min: 0.5, max: 4 },
        S: { name: 'true yearly Sharpe ratio', value: 0.4, min: 0.01 }
      },
      note: 'The measured Sharpe ratio over $T$ years has a standard error of roughly $1/\\sqrt{T}$, so $S\\sqrt{T}$ counts standard errors.',
      practice: { unknowns: ['T', 'S'] },
      stories: {
        T: 'A manager has a genuine Sharpe ratio of {S}. How many years of returns are needed for it to stand {z} standard errors clear of zero?',
        S: 'You have {T} of a manager\'s returns. What true Sharpe ratio would stand {z} standard errors clear of zero over that period?'
      }
    }
  ],
  examples: [
    {
      title: 'Two funds',
      q: 'Fund A averaged 11 % with a volatility of 20 %; fund B 7 % with 8 %. Cash paid 2 %. Which had the better risk-adjusted return, and what would A have delivered at B\'s risk, diluted with cash?',
      steps: [
        '$S_A = (11 - 2)/20 = 0.45$; $S_B = (7 - 2)/8 = 0.625$.',
        'To bring A down to 8 % volatility, hold 40 % in A and 60 % in cash: expected $2 + 0.45 \\times 8 = 5.6\\,\\%$.',
        'At the same risk B delivered 7 %: B was the better use of risk, although A returned more.'
      ],
      a: 'B, with a Sharpe ratio of 0.63 against 0.45; A at B\'s risk would have earned only 5.6 %.'
    },
    {
      title: 'Choosing a point on the line',
      q: 'The tangency portfolio expects 5.0 % with 6.97 % volatility (Sharpe 0.43) and cash pays 2 %. A cautious investor wants a volatility of 5 %. How much goes into the portfolio, and what is expected?',
      steps: [
        'Fraction in the risky portfolio: $k = 5/6.97 = 72\\,\\%$; the other 28 % stays in cash.',
        'Expected return: $2 + 0.43 \\times 5 = 4.15\\,\\%$.'
      ],
      a: '72 % in the portfolio and 28 % in cash, expecting about 4.15 %.'
    }
  ],
  quiz: [
    { q: 'A portfolio expects 9 % with a volatility of 15 %; cash pays 3 %. What is its Sharpe ratio?', answer: 0.4,
      why: '$(9 - 3)/15 = 0.4$.' },
    { q: 'A strategy has a monthly Sharpe ratio of 0.2. What is it per year?', answer: 0.693,
      why: 'Excess return scales with time and volatility with its square root, so multiply by $\\sqrt{12} = 3.46$: about 0.69.' },
    { q: 'A fund with a higher return always has a higher Sharpe ratio.', a: false,
      why: 'If it reached that return by taking much more volatility, its excess return per unit of risk can be lower.' },
    { q: 'A property fund values its buildings once a quarter and reports very smooth returns. Its Sharpe ratio is most likely…', choices: ['overstated, because smoothing hides volatility', 'understated', 'accurate', 'exactly zero'], a: 0,
      why: 'Appraisal-based prices move slowly, so measured volatility is too low and the ratio too high.' },
    { q: 'On the capital allocation line, a cautious and a bold investor should…', choices: ['hold different mixes of risky assets', 'hold the same risky mix, in different amounts, with cash or borrowing', 'both hold only cash', 'both hold only shares'], a: 1,
      why: 'Separation: the best risky mix is the tangency portfolio for everyone; attitude to risk only sets how much of it to hold.' }
  ],
  applications: ['Comparing funds or strategies that take very different amounts of risk.', 'Understanding why balanced funds, not only equity funds, can be efficient choices.', 'Judging how long a track record must be before it means much.', 'Seeing the logic — and the limits — of borrowing to invest.'],
  history: 'William Sharpe introduced the "reward-to-variability ratio" in a 1966 study of mutual funds; it now carries his name. The line from cash through the best risky portfolio follows from James Tobin\'s 1958 separation theorem.',
  sim: { id: 'pw-frontier-cloud', params: { cal: true } }
},

/* ================================================================ beta and the CAPM */
{
  id: 'capm-beta', parent: 'portfolio-theory', title: 'Beta and the CAPM', level: 3,
  short: 'Beta measures how strongly an investment moves with the whole market — the slope of its returns plotted against the market\'s. The capital asset pricing model says only this market risk earns a reward, because the rest can be diversified away.',
  keywords: ['beta', 'CAPM', 'capital asset pricing model', 'systematic risk', 'market risk', 'specific risk', 'idiosyncratic risk', 'alpha', 'security market line', 'factor models', 'Fama-French', 'cost of capital'],
  prereq: ['sharpe-ratio', 'correlation', 'math:linear-regression'],
  related: ['efficient-frontier', 'dcf-valuation', 'market-efficiency', 'index-investing', 'active-vs-passive'],
  body: `
[[diversification|Diversification]] removes most of the risk that belongs to one company — a failed product, a fraud, a lost lawsuit — but not the risk all companies share: recessions, interest rates, panics. **Beta** measures how much of that shared, market-wide risk an investment carries.

### Beta as a slope
Plot a share's monthly returns against the market's, one dot a month, and draw the best straight line through the cloud ([[math:linear-regression|linear regression]]). Its slope is beta:

$$\\beta = \\frac{\\operatorname{cov}(R_i, R_m)}{\\sigma_m^2} = \\rho\\,\\frac{\\sigma_i}{\\sigma_m}$$

- $\\beta = 1$: on average the share moves one for one with the market.
- $\\beta = 1.5$: a 10 % market fall comes with an average 15 % fall.
- $\\beta = 0.5$: half as sensitive; utilities and food producers often sit below 1.
- $\\beta \\approx 0$: unrelated to the market, like cash.

A share with a volatility of 35 % and a correlation of 0.6 with a market of 18 % volatility has $\\beta = 0.6 \\times 35/18 = 1.17$. Its risk splits in two: **market risk** $\\beta\\sigma_m = 21\\,\\%$ and **specific risk** $\\sigma_i\\sqrt{1-\\rho^2} = 28\\,\\%$, whose squares add up to $35^2$. Only $\\rho^2 = 36\\,\\%$ of its variance comes from the market; the wide scatter of dots around the line is the part diversification removes.

### The CAPM
The capital asset pricing model — developed in the early 1960s by William Sharpe, and independently by John Lintner, Jan Mossin and Jack Treynor — follows the logic of [[sharpe-ratio|the capital allocation line]] to its end. If every investor holds the same best risky portfolio, that portfolio must be the whole market; and since specific risk can be diversified away for free, no one is paid for bearing it. Expected return then depends only on beta:

$$E[R_i] = r_f + \\beta_i\\,\\big(E[R_m] - r_f\\big)$$

With cash at 2 % and the market expected at 8 %, a share with $\\beta = 1.3$ should be expected to earn 9.8 %, one with $\\beta = 0.7$ 6.2 %. The line through such points is the **security market line**; a return above it is called **alpha**.

### How well does it work?
As a way of thinking, very well. It separates the risk you are paid for from the risk you are not; it gives companies a cost of capital for [[dcf-valuation|valuations]]; and beta explains most of the ups and downs of a diversified fund, which is why most "active" returns turn out to be market returns ([[active-vs-passive]]).

As a precise description of average returns, poorly. Tests from the early 1970s found the relation between beta and return far flatter than predicted: low-beta shares earned more, and high-beta shares less, than the model says. In 1992 Eugene Fama and Kenneth French found that among US shares from 1963 to 1990 beta explained almost none of the differences in average return, while company size and valuation did. Multi-factor models — market, size, value, momentum, profitability — grew from such findings.

Beta itself is only an estimate. With five years of monthly data a typical share's beta carries an uncertainty of about ±0.2, and it changes as the business changes. The simulation below lets you see how much a sample can mislead.

> [!tip] For your own portfolio, beta is a handy dial: a portfolio's beta is the weighted average of its holdings' betas. 70 % in a broad market fund ($\\beta = 1$) and 30 % in cash ($\\beta = 0$) gives $\\beta = 0.7$ — expect about a 7 % fall when the market falls 10 %.
`,
  ideas: [
    'Beta is the slope of an investment\'s returns plotted against the market\'s: its sensitivity to market moves.',
    'Total risk splits into market risk (beta times market volatility) and specific risk, which diversification removes.',
    'The CAPM says expected return rises in a straight line with beta: the risk-free rate plus beta times the market premium.',
    'Evidence shows the beta–return line is flatter than the CAPM predicts, and other factors matter.',
    'A portfolio\'s beta is the weighted average of its holdings\' betas.'
  ],
  pitfalls: [
    'A very volatile share must offer a high expected return — Under the CAPM only market risk is rewarded; a share whose volatility is mostly specific can have a low beta and a low expected return.',
    'Beta is a fixed property of a company — It is estimated from noisy data, with a wide margin of error, and changes with the business, its debt and the period measured.',
    'Positive alpha proves skill — Alpha relative to the CAPM often reflects exposure to other factors (small companies, cheap valuations) or luck over a short record.'
  ],
  formulas: [
    {
      name: 'CAPM expected return',
      expr: 'mu = rf + beta*(mum - rf)', tex: '\\mu_i = r_f + \\beta\\,(\\mu_m - r_f)',
      vars: {
        mu: { name: 'expected return of the investment', q: 'ratio', unit: '%', signed: true, tex: '\\mu_i' },
        rf: { name: 'risk-free (cash) return', q: 'ratio', unit: '%', value: 2, tex: 'r_f' },
        beta: { name: 'beta', value: 1.3, signed: true, min: -3, max: 5 },
        mum: { name: 'expected market return', q: 'ratio', unit: '%', value: 8, tex: '\\mu_m' }
      },
      note: 'The market premium $\\mu_m - r_f$ is an assumption; a few per cent a year is a common range.',
      practice: { unknowns: ['mu', 'beta'] },
      stories: {
        mu: 'Cash pays {rf} and the market is expected to return {mum}. What should a share with a beta of {beta} be expected to earn, according to the CAPM?',
        beta: 'Cash pays {rf}, the market is expected to return {mum}, and a share is expected to earn {mu}. What beta does the CAPM imply?'
      }
    },
    {
      name: 'Beta from correlation and volatilities',
      expr: 'beta = rho*si/sm', tex: '\\beta = \\rho\\,\\frac{\\sigma_i}{\\sigma_m}',
      vars: {
        beta: { name: 'beta', signed: true },
        rho: { name: 'correlation with the market', value: 0.6, min: -1, max: 1, signed: true },
        si: { name: 'volatility of the investment', q: 'ratio', unit: '%', value: 35, tex: '\\sigma_i' },
        sm: { name: 'volatility of the market', q: 'ratio', unit: '%', value: 18, tex: '\\sigma_m' }
      },
      practice: { unknowns: ['beta', 'rho'] },
      stories: {
        beta: 'A share has a volatility of {si} and a correlation of {rho} with a market whose volatility is {sm}. What is its beta?',
        rho: 'A share with a volatility of {si} has a beta of {beta} against a market with a volatility of {sm}. What is its correlation with the market?'
      }
    },
    {
      name: 'Specific (diversifiable) risk',
      expr: 'se = si*sqrt(1 - rho^2)', tex: '\\sigma_{\\varepsilon} = \\sigma_i\\sqrt{1 - \\rho^2}',
      vars: {
        se: { name: 'specific volatility', q: 'ratio', unit: '%', tex: '\\sigma_{\\varepsilon}' },
        si: { name: 'volatility of the investment', q: 'ratio', unit: '%', value: 35, tex: '\\sigma_i' },
        rho: { name: 'correlation with the market', value: 0.6, min: 0, max: 1 }
      },
      note: 'The market part is $\\beta\\sigma_m = \\rho\\,\\sigma_i$; the two parts add in squares to the total.',
      practice: { unknowns: ['se', 'rho'] },
      stories: {
        se: 'A share has a volatility of {si} and a correlation of {rho} with the market. How much of its volatility is specific to the company?',
        rho: 'A share with a volatility of {si} has specific volatility of {se}. What is its correlation with the market?'
      }
    }
  ],
  examples: [
    {
      title: 'The return the CAPM requires',
      q: 'Cash pays 2 % and the market is expected to return 8 %. What should shares with betas of 1.3 and 0.7 be expected to earn?',
      steps: [
        'The market premium is $8 - 2 = 6\\,\\%$.',
        '$\\beta = 1.3$: $2 + 1.3 \\times 6 = 9.8\\,\\%$.',
        '$\\beta = 0.7$: $2 + 0.7 \\times 6 = 6.2\\,\\%$.'
      ],
      a: '9.8 % and 6.2 %.'
    },
    {
      title: 'Splitting a share\'s risk',
      q: 'A share has a volatility of 35 % and a correlation of 0.6 with a market whose volatility is 18 %. Find its beta, its market risk and its specific risk.',
      steps: [
        '$\\beta = 0.6 \\times 35/18 = 1.17$.',
        'Market risk: $\\beta\\sigma_m = 1.17 \\times 18 = 21\\,\\%$.',
        'Specific risk: $35\\sqrt{1 - 0.36} = 35 \\times 0.8 = 28\\,\\%$.',
        'Check: $21^2 + 28^2 = 441 + 784 = 1225 = 35^2$.'
      ],
      a: 'Beta 1.17; 21 % market risk and 28 % specific risk.'
    }
  ],
  quiz: [
    { q: 'Cash pays 3 % and the market is expected to return 9 %. What does the CAPM give for a share with a beta of 1.5, in %?', answer: 12, unit: '%',
      why: '$3 + 1.5 \\times (9 - 3) = 12\\,\\%$.' },
    { q: 'A share has a volatility of 60 % but a beta of only 0.3. According to the CAPM its expected return is…', choices: ['high, because it is very volatile', 'low, near the risk-free rate, because most of its risk can be diversified away', 'negative', 'equal to the market\'s'], a: 1,
      why: 'Only market risk is rewarded; the specific part of its 60 % disappears in a diversified portfolio.' },
    { q: 'The beta of a portfolio is the weighted average of the betas of its holdings.', a: true,
      why: 'Covariance with the market is linear in the weights, so betas average just as expected returns do.' },
    { q: 'In a scatter of a share\'s monthly returns against the market\'s, what does the spread of the dots around the fitted line represent?', choices: ['market risk', 'specific (diversifiable) risk', 'alpha', 'the risk-free rate'], a: 1,
      why: 'The line captures what the market explains; the scatter around it is the company\'s own risk.' },
    { q: 'You hold 60 % in a broad market fund (beta 1) and 40 % in a fund with a beta of 0.5. What is the portfolio\'s beta?', answer: 0.8,
      why: '$0.6 \\times 1 + 0.4 \\times 0.5 = 0.8$.' }
  ],
  applications: ['Estimating how a portfolio will react to a market fall.', 'The cost of equity used by companies and analysts in valuations.', 'Separating a fund manager\'s skill from simple market exposure.', 'Understanding factor investing (size, value, momentum) as an extension of the CAPM.'],
  history: 'Sharpe published the CAPM in 1964; Lintner (1965) and Mossin (1966) reached it independently, and Treynor had circulated similar work earlier. Black, Jensen and Scholes (1972) and Fama and MacBeth (1973) tested it and found the beta–return line too flat; Fama and French\'s three-factor model followed in the early 1990s.',
  sim: 'pw-beta'
},

/* ================================================================ asset allocation */
{
  id: 'asset-allocation', parent: 'portfolio-theory', title: 'Asset allocation', level: 1,
  short: 'How you divide money among shares, bonds, cash and other assets. It sets most of a portfolio\'s risk and return, and the right mix depends on what you need, how long you can wait, and how you will behave in a bad year.',
  keywords: ['asset allocation', 'portfolio mix', '60/40', 'stocks and bonds', 'risk tolerance', 'risk capacity', 'glide path', 'target-date fund', 'lifecycle fund', 'human capital', 'age rule', 'balanced portfolio'],
  prereq: ['efficient-frontier', 'asset-classes', 'time-horizon'],
  related: ['rebalancing', 'drawdowns', 'volatility', 'index-investing', 'retirement-planning', 'money-anxiety'],
  body: `
How you divide your money among the main kinds of assets — shares, bonds, cash, perhaps property — is the most consequential investment decision you make, and often the only one you need to make carefully. Which particular funds you choose matters much less than whether you hold 30 % or 80 % in shares.

### The menu
With round illustrative assumptions — shares 8 % expected with 18 % volatility, bonds 4 % with 6 %, correlation 0.2 — the classic mixes look like this. The "bad year" is the expected return minus two volatilities: roughly a one-in-forty year under a bell curve, not the worst possible.

| Shares / bonds | Expected return | Volatility | A bad year | On ¤100,000 |
|---|---:|---:|---:|---:|
| 20 / 80 | 4.8 % | 6.6 % | −8 % | −¤8,300 |
| 40 / 60 | 5.6 % | 8.7 % | −12 % | −¤11,700 |
| 60 / 40 | 6.4 % | 11.5 % | −17 % | −¤16,600 |
| 80 / 20 | 7.2 % | 14.7 % | −22 % | −¤22,200 |
| 100 / 0 | 8.0 % | 18.0 % | −28 % | −¤28,000 |

Every row lies on the [[efficient-frontier|efficient frontier]]; none is "best". Each buys more expected growth with more frequent and deeper falls. History has been harsher than the bell curve: broad share markets fell by around half in both 2000–2002 and 2007–2009 ([[drawdowns]]).

### Three questions
Planners usually separate three things:
1. **Need** — what return does your goal actually require? If steady saving at a modest return reaches it, extra risk adds little.
2. **Ability** — how long until you need the money, how secure is your income, how big is your cushion? Money needed within a few years has no time to recover from a fall ([[time-horizon]]).
3. **Willingness** — how will you behave in a bad year? A plan you abandon at the bottom is worse than a milder plan you keep. One simple check divides the loss you could bear by the fall you should be ready for: if you could live with losing 20 % of your savings and shares can fall 50 %, about 40 % in shares ($0.2/0.5$) is consistent with that.

### Age, human capital and glide paths
Rules of thumb such as "hold your age in bonds", or 110 or 120 minus your age in shares, encode a real idea. A young worker's largest asset is their future earnings — often worth more than a million in today's money ([[wealth-strategies]]) — and for someone with a stable salary those earnings behave rather like a large bond, so their savings can carry more share risk. As the years of earning run out, savings must carry more of the load and risk is usually reduced. Target-date (lifecycle) funds automate this **glide path**. The rules are starting points only: a civil servant with a guaranteed pension and an entrepreneur whose income moves with the economy should not hold the same mix at the same age.

### Keeping the mix
Markets move the mix for you. After a strong run for shares a 60/40 portfolio can drift to 67/33 or beyond, carrying more risk than you chose. [[rebalancing|Rebalancing]] — selling some of what rose and buying what fell, at set dates or thresholds — restores the risk you decided on, and makes you sell high and buy low by rule rather than by nerve.

> [!note] An often-quoted 1986 study of 91 large US pension funds (Brinson, Hood and Beebower) found that the policy mix explained over 90 % of the ups and downs of each fund's quarterly returns over time. That is not the same as saying allocation decides 90 % of the *return*; later work (Ibbotson and Kaplan, 2000) showed the answer depends on the question asked. The practical lesson holds: get the mix right first.
`,
  ideas: [
    'The split between shares, bonds and cash sets most of a portfolio\'s risk and expected return.',
    'Every mix on the frontier is a trade-off; more expected growth always comes with deeper falls.',
    'Separate need, ability and willingness to take risk — and choose a mix you will keep in a bad year.',
    'Future earnings are an asset: a secure salary can justify more share risk while young.',
    'Markets drift the mix; rebalancing restores the risk you chose.'
  ],
  pitfalls: [
    'The highest expected return is the best allocation — Only if you need it and can hold it through a halving; a mix you sell in a panic delivers the worst of both.',
    '"Allocation explains 90 % of returns" — The famous study measured the variation of each fund\'s returns over time, not how much of the total return allocation decides or why funds differ.',
    'Age alone decides the mix — Income security, other assets, goals and temperament matter as much; two people of the same age can sensibly differ.'
  ],
  formulas: [
    {
      name: 'Expected return of a mix',
      expr: 'mu = w*mu1 + (1 - w)*mu2', tex: '\\mu = w\\,\\mu_1 + (1-w)\\,\\mu_2',
      vars: {
        mu: { name: 'expected return of the mix', q: 'ratio', unit: '%', signed: true },
        w: { name: 'share in shares', q: 'ratio', unit: '%', value: 60, min: 0, max: 100 },
        mu1: { name: 'expected return of shares', q: 'ratio', unit: '%', value: 8, signed: true },
        mu2: { name: 'expected return of bonds', q: 'ratio', unit: '%', value: 4, signed: true }
      },
      practice: { unknowns: ['mu', 'w'] },
      stories: {
        mu: 'Shares are expected to return {mu1} and bonds {mu2}. What does a portfolio with {w} in shares expect?',
        w: 'Shares are expected to return {mu1} and bonds {mu2}. You need {mu}. What share of shares does that take?'
      }
    },
    {
      name: 'Shares consistent with a loss you can bear',
      expr: 'w = L/D', tex: 'w = \\frac{L}{D}',
      vars: {
        w: { name: 'share in shares', q: 'ratio', unit: '%' },
        L: { name: 'fall in your savings you could live with', q: 'ratio', unit: '%', value: 20 },
        D: { name: 'fall in shares to be ready for', q: 'ratio', unit: '%', value: 50, min: 1, max: 100 }
      },
      note: 'Assumes the rest (bonds, cash) holds its value while shares fall — roughly true for high-quality bonds and cash, not guaranteed.',
      practice: { unknowns: ['w', 'L'] },
      stories: {
        w: 'You could live with your savings falling by {L}, and you want to be ready for shares to fall {D}. About what share of shares is consistent with that?',
        L: 'You hold {w} in shares. If shares fall {D} and the rest holds steady, how much do your savings fall?'
      }
    },
    {
      name: 'A one-in-forty bad year, in money',
      expr: 'X = V*(2*s - mu)', tex: 'X = V\\,(2\\sigma - \\mu)',
      vars: {
        X: { name: 'loss in a bad year', q: 'money', unit: '$' },
        V: { name: 'value of the portfolio', q: 'money', unit: '$', value: 100000 },
        s: { name: 'volatility of the mix', q: 'ratio', unit: '%', value: 11.52, tex: '\\sigma' },
        mu: { name: 'expected return of the mix', q: 'ratio', unit: '%', value: 6.4 }
      },
      note: 'Two volatilities below the expected return. Real crashes can be deeper than this bell-curve estimate.',
      practice: { unknowns: ['X', 'V'] },
      stories: {
        X: 'Your portfolio is worth {V}, expected to return {mu} with a volatility of {s}. How much could it lose in a one-in-forty bad year?',
        V: 'A mix expected to return {mu} with a volatility of {s}: what portfolio value would lose {X} in a one-in-forty bad year?'
      }
    }
  ],
  examples: [
    {
      title: 'Choosing by the bad year',
      q: 'You have ¤150,000 and could live with a ¤25,000 loss in a bad year. Which mix in the table fits?',
      steps: [
        'The bearable loss is $25\\,000/150\\,000 = 16.7\\,\\%$ of the portfolio.',
        'The table\'s bad years: −12 % for 40/60, −17 % for 60/40, −22 % for 80/20.',
        'About 60/40 matches: $150\\,000 \\times (2 \\times 11.52 - 6.4)\\,\\% = ¤24{,}968$.',
        'If history\'s larger falls worry you, 40/60 leaves a margin: its bad year costs about ¤17,600.'
      ],
      a: 'Roughly 60/40, or less if you want a margin for falls deeper than the bell curve suggests.'
    },
    {
      title: 'Drift and rebalancing',
      q: 'You start with ¤60,000 in shares and ¤40,000 in bonds. Shares then rise 50 % and bonds 10 %. What is the mix, and what restores 60/40?',
      steps: [
        'Shares: $60\\,000 \\times 1.5 = ¤90{,}000$; bonds: $40\\,000 \\times 1.1 = ¤44{,}000$; total ¤134,000.',
        'Share of shares: $90\\,000/134\\,000 = 67\\,\\%$.',
        'Target shares: $0.6 \\times 134\\,000 = ¤80{,}400$. Sell ¤9,600 of shares and buy ¤9,600 of bonds.'
      ],
      a: 'The mix has drifted to 67/33; moving ¤9,600 from shares to bonds restores 60/40.'
    }
  ],
  quiz: [
    { q: 'Shares are expected to return 8 % and bonds 4 %. What does a 70/30 mix expect, in %?', answer: 6.8, unit: '%',
      why: '$0.7 \\times 8 + 0.3 \\times 4 = 6.8\\,\\%$ — expected returns average linearly.' },
    { q: 'Which situation most clearly supports holding more in shares?', choices: ['needing the money in two years for a home deposit', 'a secure salary and thirty years until the money is needed', 'having sold everything in the last crash', 'having no emergency savings'], a: 1,
      why: 'A long horizon and secure income give both the time to recover and no need to sell in a slump.' },
    { q: 'The 1986 Brinson study showed that asset allocation determines 90 % of an investor\'s total return.', a: false,
      why: 'It showed the policy mix explained about 90 % of the variation of funds\' quarterly returns over time — a different question.' },
    { q: 'After a boom your 60/40 portfolio has become 72/28. Rebalancing means…', choices: ['buying more shares', 'selling some shares and buying bonds', 'selling all the shares', 'waiting while shares are rising'], a: 1,
      why: 'Rebalancing restores the chosen risk by trimming what has grown beyond its target.' },
    { q: 'You could live with a 15 % fall in your savings and want to be ready for shares to halve. About what share of shares is consistent with that, in %?', answer: 30, unit: '%',
      why: '$0.15/0.5 = 30\\,\\%$, if the rest holds its value.' }
  ],
  applications: ['Choosing the mix of a pension or savings plan.', 'Understanding what a target-date or balanced fund does for you.', 'Setting rebalancing rules in a calm moment.', 'Reviewing risk as a goal approaches.'],
  sim: { id: 'pw-two-assets', params: { w: 60 } }
},

/* ================================================================ drawdowns */
{
  id: 'drawdowns', parent: 'portfolio-theory', title: 'Drawdowns and recovery', level: 1,
  short: 'A drawdown is the fall from a previous peak. Because gains are measured on a smaller base, a 50 % fall needs a 100 % rise to recover — so avoiding the deepest losses matters more than catching every gain.',
  keywords: ['drawdown', 'maximum drawdown', 'recovery', 'underwater', 'peak to trough', 'bear market', 'crash', 'loss recovery', 'time to recover', '1929', '2008', 'Nikkei'],
  prereq: ['volatility', 'compounding-returns', 'bull-bear-markets'],
  related: ['sequence-risk', 'leverage-basics', 'loss-aversion', 'emergency-fund', 'asset-allocation', 'margin-calls'],
  body: `
Volatility is an abstraction; a **drawdown** is what investors actually live through. It is the fall from the highest value reached so far to the value now, as a share of that high:

$$d = 1 - \\frac{V}{V_{\\text{peak}}}$$

The **maximum drawdown** is the worst such fall over a period, and the **time under water** is how long it takes to climb back to the old peak. A fund that rose to ¤150,000 and then fell to ¤90,000 is in a 40 % drawdown — even if it is still above the ¤60,000 you put in.

### The arithmetic of recovery
Losses and gains are not measured on the same base. After a fall of $d$ you hold $1-d$ of the peak, and getting back needs a gain of

$$g = \\frac{d}{1-d}$$

| Fall | Gain needed to recover | Years at 7 % a year |
|---:|---:|---:|
| 10 % | 11 % | 1.6 |
| 20 % | 25 % | 3.3 |
| 30 % | 43 % | 5.3 |
| 50 % | 100 % | 10.2 |
| 80 % | 400 % | 23.8 |
| 90 % | 900 % | 34.0 |

Small falls are repaired almost symmetrically; big ones are not. This is why avoiding the very large losses — through [[diversification]], a sensible [[asset-allocation|mix]] and never being forced to sell — matters more than catching every gain, and why [[leverage-basics]], which can turn a 50 % fall into a total loss, is so dangerous.

### What history shows
Every broad share market has had deep drawdowns. Approximate falls in price, peak to trough:
- **US shares, 1929–1932**: roughly 85–90 %. The price index regained its 1929 peak only in 1954; with dividends reinvested and the falling prices of the 1930s counted, investors were whole sooner, but still after many years.
- **Japanese shares after the 1989 peak**: about 80 % at the low; the Nikkei 225 price index regained its 1989 level only in 2024, some 34 years later.
- **US shares, 2000–2002 and 2007–2009**: about 50 % and 57 %. The fall of early 2020 was about a third, in a month, and was recovered within half a year.
- **Bonds are not immune**: long-term government bonds in several countries lost a third or more of their value between 2020 and 2023 as interest rates rose.

Recovery times vary enormously, and dividends and fresh savings shorten them for a real investor. The lesson stands: shares should be money that can wait.

### Living through one
The real damage of a drawdown is usually behavioural. Selling after a fall turns a paper loss into a permanent one and misses the recovery, which often starts while the news is still bad. [[loss-aversion|Losses hurt about twice as much as gains please]], so the urge to act is strong. What helps: knowing in advance the size of fall your mix can produce and deciding, in a calm moment, what you will do; an [[emergency-fund]] so that nobody forces you to sell at the bottom; and remembering that while you are still saving, a fall means your new money buys more.

> [!tip] Before choosing a mix, take the deepest fall it has suffered and multiply it by your savings. If that loss in money would make you sell, the mix is too risky for you — whatever its expected return.
`,
  ideas: [
    'A drawdown is the fall from the previous peak; the maximum drawdown is the worst over a period.',
    'Recovering from a fall of d needs a gain of d/(1 − d): −50 % needs +100 %.',
    'Deep falls take many years to recover; small ones are repaired quickly.',
    'Every major share market has had drawdowns of 50 % or more; bonds can fall too.',
    'The worst damage is usually done by selling during the fall, not by the fall itself.'
  ],
  pitfalls: [
    'A 30 % fall followed by a 30 % rise gets me back to even — It leaves you at 91 %: the rise is measured on the smaller base.',
    'Markets always recover within a few years — Many recoveries were quick, but US shares after 1929 and Japanese shares after 1989 took decades in price terms.',
    'I have not lost anything until I sell — The value is lower either way; what selling does is remove the chance of taking part in the recovery.'
  ],
  formulas: [
    {
      name: 'Drawdown',
      expr: 'd = 1 - V/Vp', tex: 'd = 1 - \\frac{V}{V_{\\text{peak}}}',
      vars: {
        d: { name: 'drawdown', q: 'ratio', unit: '%' },
        V: { name: 'value now', q: 'money', unit: '$', value: 90000 },
        Vp: { name: 'highest value so far', q: 'money', unit: '$', value: 150000, tex: 'V_{\\text{peak}}' }
      },
      practice: { unknowns: ['d', 'V'] },
      stories: {
        d: 'Your portfolio peaked at {Vp} and is now worth {V}. What is the drawdown?',
        V: 'Your portfolio peaked at {Vp} and is in a drawdown of {d}. What is it worth now?'
      }
    },
    {
      name: 'Gain needed to recover a fall',
      expr: 'g = d/(1 - d)', tex: 'g = \\frac{d}{1-d}',
      vars: {
        g: { name: 'gain needed to recover', q: 'ratio', unit: '%' },
        d: { name: 'fall from the peak', q: 'ratio', unit: '%', value: 50, min: 0, max: 99.9 }
      },
      practice: { unknowns: ['g', 'd'] },
      stories: {
        g: 'A portfolio has fallen {d} from its peak. What gain does it need to get back?',
        d: 'A portfolio needs a gain of {g} to regain its peak. How far has it fallen?'
      }
    },
    {
      name: 'Years to recover at a steady return',
      expr: 'T = ln(1/(1 - d))/ln(1 + r)', tex: 'T = \\frac{\\ln\\frac{1}{1-d}}{\\ln(1+r)}',
      vars: {
        T: { name: 'years to regain the peak', q: 'years', unit: 'yr' },
        d: { name: 'fall from the peak', q: 'ratio', unit: '%', value: 50, min: 0, max: 99 },
        r: { name: 'yearly return during the recovery', q: 'ratio', unit: '%', value: 7, min: 0.1, max: 100 }
      },
      note: 'Without new savings or withdrawals. Real recoveries are rarely steady.',
      practice: { unknowns: ['T', 'r'] },
      stories: {
        T: 'After a fall of {d}, a portfolio earns {r} a year. How many years until it regains its peak?',
        r: 'A portfolio that fell {d} regained its peak in {T}. What steady yearly return does that correspond to?'
      }
    }
  ],
  examples: [
    {
      title: 'Down 35 %',
      q: 'Your portfolio has fallen 35 % from its peak. What gain gets you back, and how long would that take at 6 % a year?',
      steps: [
        'Gain needed: $0.35/0.65 = 53.8\\,\\%$.',
        { text: 'Years at 6 %:', tex: 'T = \\frac{\\ln(1/0.65)}{\\ln 1.06} = \\frac{0.431}{0.0583} = 7.4' },
        'New savings shorten this: money added near the bottom recovers first.'
      ],
      a: 'A gain of 54 %, about 7.4 years at 6 % a year.'
    },
    {
      title: 'The same fall with leverage',
      q: 'You invest with twice your own money (half borrowed), ignoring interest. The market falls 30 %. What happens to your own money, and what gain does it then need?',
      steps: [
        'Your assets fall 30 %, which is 60 % of your own money: $2 \\times 30\\,\\% = 60\\,\\%$.',
        'Gain needed on your remaining money: $0.6/0.4 = 150\\,\\%$.',
        'If you reduce the borrowing after the fall, even a full market recovery does not restore your money.'
      ],
      a: 'A 60 % loss, needing a 150 % gain — leverage turns a painful fall into a crippling one.'
    }
  ],
  quiz: [
    { q: 'A portfolio has fallen 60 %. What gain does it need to recover, in %?', answer: 150, unit: '%',
      why: '$0.6/0.4 = 1.5$: from 40 you need 60 more to reach 100.' },
    { q: 'A fund rises from ¤100 to ¤200, then falls to ¤150. What is its drawdown?', choices: ['25 %', '50 %', '33 %', 'none: it is still up 50 %'], a: 0,
      why: 'Drawdowns are measured from the peak: $1 - 150/200 = 25\\,\\%$.' },
    { q: 'A 30 % fall followed by a 30 % rise brings you back to where you started.', a: false,
      why: '$0.7 \\times 1.3 = 0.91$: you are still 9 % down.' },
    { q: 'Why are large losses especially damaging?', choices: ['because the gain needed to recover grows much faster than the loss', 'because taxes are higher after losses', 'because markets never recover from them', 'because they cannot be measured'], a: 0,
      why: 'The needed gain is $d/(1-d)$, which explodes as $d$ approaches 100 %.' },
    { q: 'After a 50 % fall, how many years does recovery take at a steady 5 % a year?', answer: 14.21, unit: 'yr',
      why: '$\\ln 2/\\ln 1.05 = 0.693/0.0488 = 14.2$ years.' }
  ],
  applications: ['Judging how much share risk you can really live with.', 'Understanding why leverage and concentration are dangerous.', 'Reading fund reports that quote the maximum drawdown.', 'Preparing a plan for what to do in the next crash.'],
  sim: 'pw-drawdown'
},

/* ================================================================ sequence risk */
{
  id: 'sequence-risk', parent: 'portfolio-theory', title: 'Sequence-of-returns risk', level: 2,
  short: 'When money flows in or out, the order of returns matters, not just their average. Losses early in retirement, when the pot is largest and withdrawals begin, can ruin a plan that the same returns in another order would have carried easily.',
  keywords: ['sequence of returns', 'sequence risk', 'order of returns', 'retirement red zone', 'withdrawal', 'decumulation', 'bond tent', 'guardrails', 'bucket strategy', 'safe withdrawal'],
  prereq: ['drawdowns', 'expected-return', 'annuities'],
  related: ['financial-independence', 'retirement-income', 'monte-carlo-planning', 'retirement-planning', 'dollar-cost-averaging'],
  body: `
Two retirees start with the same savings, spend the same amount and meet the same thirty years of market returns — only the order differs. One ends with more than twice what she started with; the other runs out of money in year 25. That is **sequence-of-returns risk**, and no average can show it.

### Order does not matter — until money moves
With no money going in or out, the order of returns is irrelevant: multiplication does not care about order, so $1.2 \\times 0.8 \\times 1.1 = 1.1 \\times 0.8 \\times 1.2$. Everything changes once you add or withdraw money, because each return then acts on a different amount.

Take ¤1,000,000, spend ¤50,000 at the start of each year, and meet three years of returns: −20 %, +10 %, +30 %.

| Order | After year 1 | After year 2 | After year 3 |
|---|---:|---:|---:|
| Bad year first | ¤760,000 | ¤781,000 | ¤950,300 |
| Good year first | ¤1,235,000 | ¤1,303,500 | ¤1,002,800 |

Same returns, same spending — ¤52,500 apart after three years. In the first order the loss struck a large pot and the recovery a small one; in the second, the reverse.

### Over a retirement
Stretch it to thirty years: ten years at 0 %, ten at 6 % and ten at 12 % — a compound return of 5.9 % a year, well above the 5 % being spent — with ¤50,000 taken each year from ¤1,000,000.
- **Bad decade first**: ¤500,000 is left after ten years, ¤197,000 after twenty, and the money runs out in year 25.
- **Good decade first**: ¤2.1 million after ten years and ¤2.6 million at the end.

The years just before and after retirement are when the pot is largest and withdrawals begin, so a crash then does the most lasting harm. After a 30 % fall in the first year, a ¤40,000 withdrawal from ¤1,000,000 is no longer 4 % of the pot but 6 %: the same spending eats a larger share of what is left, and less remains to recover. A saver faces the mirror image. Early bad years hurt little, because the pot is still small, and they let new savings buy cheaply; a crash just before the money is needed hurts most.

### What people do about it
None of these removes the risk; each trades something for less of it.
- **Spend flexibly.** Trimming withdrawals a little after bad years, and allowing raises after good ones — rules often called *guardrails* — greatly improves the odds of the money lasting.
- **Start lower.** A smaller first withdrawal leaves room for a bad start ([[financial-independence|the 4 % rule]] was set by the worst historical sequences).
- **Hold a buffer.** A year or two of spending in cash or short-term bonds avoids selling shares in a slump; some reduce share risk around the retirement date and raise it again later.
- **Secure a floor.** State pensions, [[pensions|defined-benefit pensions]] and [[retirement-income|annuities]] pay whatever markets do, so less of your spending depends on the sequence.

> [!key] Averages describe a market; sequences describe a life. When money is flowing out, the order of returns can matter as much as their average.

The [[monte-carlo-planning|Monte Carlo]] method exists largely to measure this risk: it runs a plan through thousands of different sequences.
`,
  ideas: [
    'Without deposits or withdrawals, the order of returns does not change the result.',
    'With withdrawals, early losses hurt most: they strike the largest pot and leave less to recover.',
    'For savers the risk is mirrored: losses near the end of the saving years hurt most.',
    'A fall raises the withdrawal rate on what is left, which is why the first years of retirement are the riskiest.',
    'Flexible spending, a cash buffer and a guaranteed income floor all reduce sequence risk.'
  ],
  pitfalls: [
    'If my average return beats my withdrawal rate, the money will last — A 5.9 % compound return did not save a 5 % withdrawal when the bad decade came first.',
    'A crash early in retirement is no worse than one later — Early, it hits the largest pot and every later withdrawal locks in the loss; late, the pot has already done most of its work.',
    'Sequence risk only matters to retirees — Anyone adding or withdrawing large amounts is exposed; savers are most exposed just before they need the money.'
  ],
  formulas: [
    {
      name: 'One year of withdrawing',
      expr: 'B1 = (B0 - W)*(1 + r)', tex: 'B_1 = (B_0 - W)(1 + r)',
      vars: {
        B1: { name: 'pot at the end of the year', q: 'money', unit: '$' },
        B0: { name: 'pot at the start of the year', q: 'money', unit: '$', value: 1000000 },
        W: { name: 'withdrawal at the start of the year', q: 'money', unit: '$', value: 50000 },
        r: { name: 'return that year', q: 'ratio', unit: '%', value: -20, signed: true, min: -99, max: 300 }
      },
      note: 'Chain this year by year with different returns to see the order matter.',
      practice: { unknowns: ['B1', 'r'] },
      stories: {
        B1: 'A retiree starts the year with {B0}, takes out {W}, and the rest earns {r}. What is left at the end of the year?',
        r: 'A retiree starts the year with {B0}, takes out {W}, and ends the year with {B1}. What was the return?'
      }
    },
    {
      name: 'Withdrawal rate after a fall',
      expr: 'w2 = w1/(1 - d)', tex: 'w_2 = \\frac{w_1}{1-d}',
      vars: {
        w2: { name: 'withdrawal rate after the fall', q: 'ratio', unit: '%' },
        w1: { name: 'withdrawal rate before', q: 'ratio', unit: '%', value: 4 },
        d: { name: 'fall in the pot', q: 'ratio', unit: '%', value: 30, min: 0, max: 99 }
      },
      note: 'The same spending in money is a larger share of a smaller pot.',
      practice: { unknowns: ['w2', 'd'] },
      stories: {
        w2: 'You withdraw {w1} of your pot each year. The pot falls {d}. If you keep spending the same amount, what share of the pot is it now?',
        d: 'Your withdrawals were {w1} of the pot and are now {w2} of it, for the same amount of money. How far did the pot fall?'
      }
    }
  ],
  examples: [
    {
      title: 'Three years, two orders',
      q: '¤1,000,000, ¤50,000 withdrawn at the start of each year, returns of −20 %, +10 % and +30 %. Compare the bad-first and good-first orders.',
      steps: [
        'Bad first: $(1\\,000\\,000 - 50\\,000) \\times 0.8 = ¤760{,}000$; $(760\\,000 - 50\\,000) \\times 1.1 = ¤781{,}000$; $(781\\,000 - 50\\,000) \\times 1.3 = ¤950{,}300$.',
        'Good first: $950\\,000 \\times 1.3 = ¤1{,}235{,}000$; $1\\,185\\,000 \\times 1.1 = ¤1{,}303{,}500$; $1\\,253\\,500 \\times 0.8 = ¤1{,}002{,}800$.',
        'Without withdrawals both orders give $0.8 \\times 1.1 \\times 1.3 = 1.144$, i.e. ¤1,144,000.'
      ],
      a: '¤950,300 against ¤1,002,800 — a gap of ¤52,500 from order alone.'
    },
    {
      title: 'A crash in year one',
      q: 'A retiree with ¤1,000,000 plans to spend ¤40,000 a year (4 %). The first year, after the withdrawal, the pot falls 30 %. What share of the pot does the next ¤40,000 represent?',
      steps: [
        'After year one: $(1\\,000\\,000 - 40\\,000) \\times 0.7 = ¤672{,}000$.',
        'Next withdrawal: $40\\,000/672\\,000 = 5.95\\,\\%$ of the pot.',
        'To stay at 4 % the spending would have to fall to about ¤26,900 — which is why flexible spending helps so much.'
      ],
      a: 'Nearly 6 % of the remaining pot, instead of 4 %.'
    }
  ],
  quiz: [
    { q: 'Without deposits or withdrawals, the order of yearly returns does not change the final value.', a: true,
      why: 'The final value is the start times the product of $(1 + r)$ over the years, and a product does not depend on order.' },
    { q: 'Someone saving steadily for 30 years is least harmed by a crash when it comes…', choices: ['early in the saving years', 'just before the money is needed', 'it makes no difference', 'only the average return matters'], a: 0,
      why: 'Early on the pot is small and later savings buy at low prices; just before the money is needed the pot is largest.' },
    { q: 'A pot of ¤500,000; ¤25,000 is taken out at the start of the year and the rest falls 10 %. What is left, in ¤?', answer: 427500, unit: '$',
      why: '$(500\\,000 - 25\\,000) \\times 0.9 = ¤427{,}500$.' },
    { q: 'You withdraw 4 % of your pot a year. If the pot halves and you keep spending the same amount, what is your withdrawal rate now, in %?', answer: 8, unit: '%',
      why: '$4\\,\\%/(1 - 0.5) = 8\\,\\%$.' },
    { q: 'Which of these does NOT reduce sequence risk?', choices: ['trimming spending a little after bad years', 'holding two years of spending in cash', 'covering basic costs with a pension or annuity', 'assuming a higher average return in the plan'], a: 3,
      why: 'Changing an assumption changes the spreadsheet, not the risk; the other three change what actually happens in a bad sequence.' }
  ],
  applications: ['Planning the years around retirement.', 'Deciding how much of a pot to keep in cash or bonds when withdrawals start.', 'Understanding why annuities and flexible spending rules exist.', 'Timing a large planned withdrawal, such as a house deposit, with care.'],
  sim: 'pw-sequence'
}

);
