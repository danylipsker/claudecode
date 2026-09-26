/* HYPER-FINANCES · content/wealth-building.js — Wealth and Retirement: building and using wealth.
 * How wealth is built, financial independence and the 4 % rule, retirement planning, pensions
 * and tax-advantaged accounts, retirement income, taxes and investing, passing wealth on, and
 * planning under uncertainty with Monte Carlo. Country rules are described as common patterns
 * with brief named examples; no current rates are stated as facts.
 * Simulations: sims/portfolio-wealth.js (pw-*) and ref-compound from sims/reference.js. */
Hyper.add(

/* ================================================================ how wealth is built */
{
  id: 'wealth-strategies', parent: 'wealth-building', title: 'How wealth is built', level: 1,
  short: 'Most wealth built from an ordinary income comes from three levers — the share of income you save, the return it earns, and the years it compounds — protected from the few mistakes that destroy it, and fed by an income that grows.',
  keywords: ['building wealth', 'wealth strategies', 'saving rate', 'compound growth', 'time in the market', 'human capital', 'fees', 'avoiding debt', 'getting rich slowly', 'net worth', 'financial security'],
  prereq: ['saving-rate', 'compound-interest', 'why-invest'],
  related: ['financial-independence', 'investment-fees', 'taxes-investing', 'lifestyle-inflation', 'asset-allocation', 'financial-habits'],
  body: `
Behind most fortunes built from an ordinary income stand three quantities: how much of what you earn you invest, the return it earns, and how many years it compounds. Strip away the noise and wealth is roughly a [[annuities|savings annuity]]:

$$W = c\\,\\frac{(1 + r)^T - 1}{r}$$

for a saving $c$ each year at a return $r$ for $T$ years. Every strategy that works improves one of those three, protects them from the things that destroy wealth, or raises the income they come from. None of it needs luck or genius; it needs time and a few habits.

### Time: the lever that asks the least
Invest ¤500 a month at 6 % a year:

| Years | Paid in | Value at the end |
|---:|---:|---:|
| 10 | ¤60,000 | ¤81,940 |
| 20 | ¤120,000 | ¤231,020 |
| 30 | ¤180,000 | ¤502,258 |
| 40 | ¤240,000 | ¤995,745 |

The last ten years add almost as much as the first thirty together, because by then the growth on the pot dwarfs the payments. Starting ten years earlier roughly doubles the result. Nothing else is as cheap — which also means that someone starting late is not doomed, only that each year now counts for more.

### The saving rate: the lever you control
Returns are set by markets; the share of income you save is set by you. It works twice: every point saved adds to the pot *and* lowers the spending the pot must one day replace. Going from saving 10 % to 20 % of take-home pay cuts the working years needed to become independent from about 51 to about 37, under the assumptions of [[financial-independence]]. Raising the rate gradually — putting part of every pay rise into savings, resisting [[lifestyle-inflation]], and automating it so that it happens before you see the money ([[financial-habits]]) — is how most people get there without feeling poorer.

### The return: earn it, don't chase it
Over decades a diversified mix of productive assets — shares in businesses, bonds, property — has beaten inflation where cash has not ([[why-invest]]). The parts of the return you can actually control are the **mix** you hold ([[asset-allocation]]), **costs** and **taxes**. A 1 % yearly fee on the ¤500-a-month plan turns ¤995,745 after 40 years into ¤762,015: almost a quarter of the result, for a number that sounds tiny ([[investment-fees]], [[taxes-investing]]).

### Your biggest asset is you
For most young people, future earnings are worth far more than their savings. ¤40,000 a year for 40 years, rising 1 % a year above inflation and discounted at 3 %, is worth about ¤1.09 million today. Skills, qualifications, health and a career that grows are investments with returns no market offers — and insuring that income ([[life-disability-insurance]]) protects the largest asset you have.

### Avoid the wealth destroyers
Compounding works against you just as faithfully. Credit-card debt at 20 % costs ¤1,000 a year on every ¤5,000 owed ([[high-cost-credit]]). The other destroyers are few and familiar: a fortune concentrated in one share (often the employer's), [[leverage-basics]] you cannot survive, schemes promising returns too good to be true ([[scams-fraud]]), and selling everything in a panic. Most lasting wealth is built less by brilliant moves than by avoiding a handful of irreversible mistakes.

### Paths people take
Salaried saving into low-cost diversified funds; building a business (a higher expected reward with a much wider spread of outcomes); property bought with a mortgage (leverage that magnifies both results, see [[property-leverage]]); a high-earning career. They combine, and each has its own risks. What they share is patience: the money is made in decades, not months.

> [!key] Most wealth built from an income comes from saving a meaningful share, investing it broadly and cheaply, giving it time, and avoiding the few mistakes that cannot be undone. The rest is detail.
`,
  ideas: [
    'Wealth from an income is mostly the saving rate, the return and the years, multiplied together by compounding.',
    'Time is the cheapest lever: the last decade of a long plan adds about as much as all the ones before.',
    'The saving rate works twice: it builds the pot and lowers the spending the pot must replace.',
    'Costs and taxes compound like returns; small percentages become large fractions of the result.',
    'Future earnings are most people\'s largest asset; protecting and growing them is part of building wealth.'
  ],
  pitfalls: [
    'Wealth comes from finding the best investment — For most people it comes from saving steadily, investing broadly and cheaply, and staying invested for decades.',
    'A 1 % fee is too small to matter — Over 40 years it takes roughly a quarter to a third of the result, because the fee compounds.',
    'It is too late to start — Every year still compounds; a later start needs a higher saving rate or a later finish, not despair.'
  ],
  formulas: [
    {
      name: 'Future value of regular monthly saving',
      expr: 'W = c*((1 + r/12)^(12*T) - 1)/(r/12)', tex: 'W = c\\,\\frac{(1 + r/12)^{12T} - 1}{r/12}',
      vars: {
        W: { name: 'value at the end', q: 'money', unit: '$' },
        c: { name: 'saved each month', q: 'money', unit: '$', value: 500 },
        r: { name: 'yearly return', q: 'ratio', unit: '%', value: 6, min: 0.01, max: 30 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 40 }
      },
      note: 'Savings at the end of each month, compounded monthly. Use a return above inflation to get the answer in today\'s money. Try your own plan in [the savings calculator](#/tools/money/save).',
      practice: { unknowns: ['W', 'c', 'T'] },
      stories: {
        W: 'You invest {c} every month at {r} a year for {T}. What is it worth at the end?',
        c: 'You want {W} in {T}, investing at {r} a year. How much must you invest each month?',
        T: 'You invest {c} a month at {r} a year. How long until it is worth {W}?'
      }
    },
    {
      name: 'Share of a lump sum kept after a yearly fee',
      expr: 'K = ((1 + r - f)/(1 + r))^T', tex: 'K = \\left(\\frac{1 + r - f}{1 + r}\\right)^{T}',
      vars: {
        K: { name: 'share of the fee-free result you keep', q: 'ratio', unit: '%' },
        r: { name: 'yearly return before the fee', q: 'ratio', unit: '%', value: 6 },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 1, min: 0, max: 10 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 40 }
      },
      note: 'For a single sum. With regular saving the loss is somewhat smaller, because later payments pay the fee for fewer years.',
      practice: { unknowns: ['K', 'f'] },
      stories: {
        K: 'A fund charges {f} a year on an investment returning {r} before fees. After {T}, what share of the fee-free result do you keep?',
        f: 'After {T} at {r} a year before fees, you keep {K} of the fee-free result. What yearly fee is that?'
      }
    },
    {
      name: 'Value today of future earnings (human capital)',
      expr: 'H = Y*(1 - ((1 + g)/(1 + d))^T)/(d - g)', tex: 'H = Y\\,\\frac{1 - \\left(\\frac{1+g}{1+d}\\right)^{T}}{d - g}',
      vars: {
        H: { name: 'value today of future earnings', q: 'money', unit: '$' },
        Y: { name: 'earnings in the first year', q: 'money', unit: '$', value: 40000 },
        g: { name: 'yearly growth of earnings above inflation', q: 'ratio', unit: '%', value: 1, signed: true, min: -5, max: 10 },
        d: { name: 'discount rate above inflation', q: 'ratio', unit: '%', value: 3, min: 0.1, max: 20 },
        T: { name: 'working years left', q: 'years', unit: 'yr', value: 40 }
      },
      note: 'The present value of a growing annuity. A riskier income deserves a higher discount rate.',
      practice: { unknowns: ['H'] },
      stories: {
        H: 'You earn {Y} a year, expect it to grow {g} a year above inflation for {T}, and discount at {d}. What are your future earnings worth today?'
      }
    }
  ],
  examples: [
    {
      title: 'Ten years earlier',
      q: 'Compare ¤500 a month at 6 % a year for 30 years and for 40 years.',
      steps: [
        'Monthly rate $0.06/12 = 0.005$. For 30 years ($n = 360$): $(1.005^{360} - 1)/0.005 = 1004.5$, so $W = ¤502{,}258$.',
        'For 40 years ($n = 480$): $(1.005^{480} - 1)/0.005 = 1991.5$, so $W = ¤995{,}745$.',
        'The extra ten years cost ¤60,000 of payments and add ¤493,487.'
      ],
      a: '¤502,258 against ¤995,745: ten more years almost double the result.'
    },
    {
      title: 'Raising the saving rate',
      q: 'Take-home pay is ¤4,000 a month. Compare saving 10 % and 20 % for 25 years at 6 %, and the spending each leaves.',
      steps: [
        'Saving ¤400 a month: $400 \\times (1.005^{300} - 1)/0.005 = ¤277{,}198$.',
        'Saving ¤800 a month: twice as much, ¤554,395.',
        'Spending falls from ¤3,600 to ¤3,200 a month. At a 4 % withdrawal rate the pot that replaces that spending falls from ¤1,080,000 to ¤960,000 — the saving rate works on both ends.'
      ],
      a: '¤277,198 against ¤554,395, while the target shrinks by ¤120,000.'
    }
  ],
  quiz: [
    { q: 'Which lever of wealth is entirely under your own control?', choices: ['the market return', 'the inflation rate', 'the share of income you save', 'interest rates'], a: 2,
      why: 'Returns and rates are set by markets and central banks; how much you save is your decision.' },
    { q: 'You invest ¤300 a month at 6 % a year for 30 years. What is it worth at the end, in ¤?', answer: 301354.5, unit: '$',
      why: '$300 \\times (1.005^{360} - 1)/0.005 = 300 \\times 1004.5 = ¤301{,}355$.' },
    { q: 'A 1 % yearly fee costs you about 1 % of your final wealth after 40 years.', a: false,
      why: 'It compounds: on a lump sum at 6 % it takes about 32 % of the result, $1 - (1.05/1.06)^{40}$.' },
    { q: 'Which of these is most likely to destroy wealth permanently?', choices: ['a 20 % fall in a diversified fund that you keep', 'selling everything after a 30 % fall and staying out for years', 'a year of low returns', 'paying off a mortgage early'], a: 1,
      why: 'Selling at the bottom turns a temporary fall into a permanent loss and misses the recovery.' },
    { q: 'An investment returns 7 % a year before a 2 % yearly fee. After 30 years, what share of the fee-free result do you keep, in %?', answer: 56.78, unit: '%',
      why: '$(1.05/1.07)^{30} = 0.568$: the fee takes 43 % of the result.' }
  ],
  applications: ['Deciding where the next unit of effort goes: earning more, saving more, or cutting costs.', 'Seeing the value of starting a savings habit early.', 'Checking what a fund\'s fee really costs over a lifetime.', 'Weighing a qualification or career move as an investment.'],
  sim: ['pw-fi-curve', 'ref-compound']
},

/* ================================================================ financial independence */
{
  id: 'financial-independence', parent: 'wealth-building', title: 'Financial independence and the 4 % rule', level: 2,
  short: 'Financial independence is a pot large enough that a steady withdrawal can pay your costs for as long as needed. The 4 % rule — about 25 times yearly spending — comes from US history, with real limits; the time to get there depends mostly on the saving rate.',
  keywords: ['financial independence', 'FIRE', 'early retirement', '4 % rule', 'four percent rule', 'safe withdrawal rate', 'Bengen', 'Trinity study', '25 times spending', 'independence number', 'saving rate'],
  prereq: ['wealth-strategies', 'perpetuities', 'saving-rate'],
  related: ['sequence-risk', 'monte-carlo-planning', 'retirement-planning', 'retirement-income', 'real-vs-nominal'],
  body: `
Financial independence is the point at which your investments can pay for your life, so that working becomes a choice rather than a necessity. It does not require riches. It requires a pot large enough, relative to what you spend, that a steady withdrawal can go on for as long as you need it.

### The independence number
If a pot can safely give up a fraction $w$ of its starting value each year — raised with inflation afterwards — then covering yearly spending $S$ needs

$$N = \\frac{S}{w}$$

At the famous 4 %, that is 25 times your yearly spending: ¤40,000 a year needs ¤1,000,000; at a more cautious 3.5 %, ¤1,142,857; at 3 %, ¤1,333,333. Notice what drives it: **spending**, not income. Every ¤1,000 of permanent yearly spending you do without lowers the number by ¤25,000 at 4 %.

### Where the 4 % comes from
In 1994 the financial planner William Bengen asked a precise question of US market history since 1926: what is the highest first-year withdrawal, raised every year with inflation, that would have lasted at least 30 years for a retiree starting in *any* year? With half in large-company shares and half in intermediate-term government bonds, the answer was about 4 %. The worst cases were retirements beginning in the mid-to-late 1960s, when a stagnant share market met high inflation. In most starting years far more would have been safe, and the pot often ended larger than it began.

In 1998 three professors at Trinity University in Texas — Philip Cooley, Carl Hubbard and Daniel Walz — published tables of success rates for many rates, mixes and horizons, using US shares and high-grade corporate bonds from 1926 to 1995. An inflation-adjusted 4 % from a half-shares, half-bonds portfolio lasted 30 years in about 95 % of the historical periods they tested.

### What the rule is — and is not
It is a historical finding about one country's markets, not a law of nature.
- **One fortunate market.** The US had one of the best share markets of the 20th century. Studies that repeat the exercise with other countries' history (Wade Pfau's in 2010, for example) find lower safe rates in many of them.
- **Thirty years.** Someone stopping work at 40 may need 50 years or more; for long horizons, rates of 3–3.5 % are commonly discussed.
- **No costs, no taxes, rigid spending.** A fund fee of 1 % a year comes almost straight off the sustainable rate. Real people also adjust, and willingness to trim spending after bad years raises what is safe.
- **Starting conditions matter.** Retirements that began when shares were expensive or bond yields very low have tended to support less.

In a simple model — a balanced portfolio expected to earn 5 % a year above inflation with 12 % volatility — a 4 % withdrawal lasts 30 years in about 88 % of 1 000 simulated markets, and 3.5 % in about 93 % ([[monte-carlo-planning]]). The failures come from bad early sequences ([[sequence-risk]]).

### The time it takes: the saving rate decides
Suppose you save a fraction $s$ of take-home pay, live on the rest, invest at a real return $r$ and aim for 25 times your spending. Because a higher saving rate both builds the pot faster *and* lowers the spending it must cover, the years needed depend almost only on the saving rate:

| Saving rate | Years to independence (5 % real return, 4 % rule) |
|---:|---:|
| 10 % | 51 |
| 20 % | 37 |
| 30 % | 28 |
| 40 % | 22 |
| 50 % | 17 |
| 60 % | 12 |
| 70 % | 9 |

Income cancels out: a high earner who spends everything is no closer than anyone else. [The independence calculator](#/tools/money/retire) runs your own numbers, with a Monte Carlo of the retirement.

> [!note] Independence need not be all or nothing. Investments that cover half your costs already buy freedom — to change career, work part time, look after someone, or take a risk.
`,
  ideas: [
    'The independence number is yearly spending divided by the withdrawal rate: 25 times spending at 4 %.',
    'Spending, not income, sets the target; every permanent saving in spending lowers it 25-fold.',
    'The 4 % rule is the worst-case result of US history for 30 years with a balanced portfolio, not a guarantee.',
    'Longer horizons, costs, and less fortunate markets point to lower rates; flexible spending points to higher ones.',
    'The years to independence depend mainly on the saving rate, because it both builds the pot and shrinks the target.'
  ],
  pitfalls: [
    'The 4 % rule guarantees 30 years — It describes what would have worked in past US markets; other countries, higher costs or a longer horizon have supported less.',
    'A high income makes you independent sooner — Only the share you save matters; spending rises with income unless you decide otherwise.',
    'At 4 % the pot will be spent to zero after 25 years — In most historical and simulated paths it lasts far longer, often growing; 4 % is set by the worst cases.'
  ],
  derivation: {
    title: 'Why the target is spending divided by the withdrawal rate',
    intro: 'Work in today\'s money, so that returns are returns above inflation and spending is constant.',
    steps: [
      { text: 'A pot $P$ earning a steady real return $r$ grows by $rP$ a year. Spend exactly that and it never shrinks — a perpetuity. So a pot that covers spending $S$ forever needs', tex: 'P = \\frac{S}{r}' },
      { text: 'To spend a pot to zero over exactly $n$ years at a steady $r$, the withdrawal is an annuity payment, a larger fraction of the pot:', tex: 'w = \\frac{r}{1 - (1+r)^{-n}}' },
      { text: 'At $r = 2\\,\\%$ and $n = 30$ that gives 4.46 %; even at $r = 0$ it is $1/30 = 3.33\\,\\%$. So 4 % sits between "spend some capital over 30 years if returns are poor" and "live on returns alone if they are good".', tex: '3.33\\,\\% \\le w \\le 4.46\\,\\% \\quad (0 \\le r \\le 2\\,\\%,\\; n = 30)' },
      { text: 'Markets do not deliver $r$ every year, so the rate is chosen with a margin for bad sequences. Whatever safe rate $w$ is chosen, the pot that supports spending $S$ follows by division:', tex: 'N = \\frac{S}{w} \\qquad (w = 4\\,\\% \\;\\Rightarrow\\; N = 25\\,S)' },
      { text: 'Saving a fraction $s$ of pay $Y$ at return $r$, the pot after $T$ years is $sY\\frac{(1+r)^T - 1}{r}$; setting it equal to $(1-s)Y/w$ and solving:', tex: 'T = \\frac{\\ln\\!\\left(1 + \\dfrac{r(1-s)}{s\\,w}\\right)}{\\ln(1+r)}' }
    ],
    outro: 'The pay $Y$ cancels in the last step, which is why income does not appear in the saving-rate table.'
  },
  formulas: [
    {
      name: 'The independence number',
      expr: 'N = S/w', tex: 'N = \\frac{S}{w}',
      vars: {
        N: { name: 'pot needed', q: 'money', unit: '$' },
        S: { name: 'yearly spending to cover', q: 'money', unit: '$', value: 40000 },
        w: { name: 'withdrawal rate', q: 'ratio', unit: '%', value: 4, min: 1, max: 10 }
      },
      note: 'In today\'s money; the withdrawal is raised with inflation after the first year.',
      practice: { unknowns: ['N', 'S'] },
      stories: {
        N: 'You spend {S} a year. At a withdrawal rate of {w}, how large a pot makes you financially independent?',
        S: 'You have {N} invested. At a withdrawal rate of {w}, how much yearly spending can it support?'
      }
    },
    {
      name: 'Years to independence from the saving rate',
      expr: 'T = ln(1 + r*(1 - s)/(s*w))/ln(1 + r)', tex: 'T = \\frac{\\ln\\!\\left(1 + \\frac{r(1-s)}{s\\,w}\\right)}{\\ln(1+r)}',
      vars: {
        T: { name: 'years of saving', q: 'years', unit: 'yr' },
        r: { name: 'return above inflation', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 20 },
        s: { name: 'saving rate (share of take-home pay)', q: 'ratio', unit: '%', value: 20, min: 1, max: 99 },
        w: { name: 'withdrawal rate', q: 'ratio', unit: '%', value: 4, min: 1, max: 10 }
      },
      note: 'Starting from nothing, saving at the end of each year, living on the rest. A head start shortens it — see the simulation.',
      practice: { unknowns: ['T', 's'] },
      stories: {
        T: 'You save {s} of your take-home pay, invest it at {r} above inflation, and aim for a withdrawal rate of {w}. How many years until you are independent?',
        s: 'You want to be independent in {T}, investing at {r} above inflation with a withdrawal rate of {w}. What share of your pay must you save?'
      }
    },
    {
      name: 'A withdrawal that spends a pot to zero in T years',
      expr: 'w = r/(1 - (1 + r)^(-T))', tex: 'w = \\frac{r}{1 - (1+r)^{-T}}',
      vars: {
        w: { name: 'yearly withdrawal as a share of the starting pot', q: 'ratio', unit: '%' },
        r: { name: 'steady return above inflation', q: 'ratio', unit: '%', value: 2, min: 0.01, max: 20 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'With a steady return and withdrawals at the end of each year. Real returns vary, which is why safe rates are set lower.',
      practice: { unknowns: ['w', 'T'] },
      stories: {
        w: 'A pot earns a steady {r} above inflation. What yearly withdrawal, as a share of the starting pot, spends it to zero in exactly {T}?',
        T: 'A pot earns a steady {r} above inflation and you withdraw {w} of the starting amount each year. How long does it last?'
      }
    }
  ],
  examples: [
    {
      title: 'The number and the time',
      q: 'Take-home pay is ¤60,000 a year and spending ¤45,000, so ¤15,000 (25 %) is saved. At a 4 % withdrawal rate and a 5 % real return, what is the independence number and how long does it take?',
      steps: [
        'Number: $45\\,000/0.04 = ¤1{,}125{,}000$.',
        { text: 'Years, saving ¤15,000 a year at 5 %:', tex: 'T = \\frac{\\ln(1 + 0.05 \\times 1\\,125\\,000/15\\,000)}{\\ln 1.05} = \\frac{\\ln 4.75}{0.0488} = 31.9' },
        'The saving-rate formula gives the same: $s = 25\\,\\%$ → 31.9 years.'
      ],
      a: '¤1,125,000, reached in about 32 years.'
    },
    {
      title: 'Spending ¤5,000 less',
      q: 'The same household cuts spending to ¤40,000 and saves ¤20,000 a year. How do the number and the time change?',
      steps: [
        'Number: $40\\,000/0.04 = ¤1{,}000{,}000$ — ¤125,000 less.',
        'Years: $\\ln(1 + 0.05 \\times 1\\,000\\,000/20\\,000)/\\ln 1.05 = \\ln 3.5/0.0488 = 25.7$.',
        'Six years sooner, from a change of ¤5,000 a year.'
      ],
      a: '¤1,000,000 in about 26 years instead of ¤1,125,000 in 32.'
    }
  ],
  quiz: [
    { q: 'You spend ¤30,000 a year. At a 4 % withdrawal rate, what is your independence number, in ¤?', answer: 750000, unit: '$',
      why: '$30\\,000/0.04 = ¤750{,}000$, or 25 times spending.' },
    { q: 'Two people each save 30 % of their take-home pay; one earns twice as much as the other. With the same return, who reaches independence first?', choices: ['the higher earner, in half the time', 'they take the same time', 'the lower earner', 'it cannot be said'], a: 1,
      why: 'Both the pot and the target scale with income, so only the saving rate matters.' },
    { q: 'The 4 % rule guarantees that a pot will last 30 years.', a: false,
      why: 'It is the rate that survived the worst US periods since 1926 with a balanced portfolio. Other markets, costs, a longer horizon or a worse future could fail it.' },
    { q: 'Bengen\'s 4 % was…', choices: ['the average withdrawal that worked in US history', 'the highest rate that lasted at least 30 years for every US starting year he tested — the worst case', 'a forecast of future returns', 'a legal limit on withdrawals'], a: 1,
      why: 'He looked for the rate that survived every historical start, so it is set by the worst sequences (the late 1960s).' },
    { q: 'At a 3.5 % withdrawal rate, the independence number is how many times yearly spending?', answer: 28.57,
      why: '$1/0.035 = 28.6$.' }
  ],
  applications: ['Setting a target for savings in today\'s money.', 'Seeing how much a cut in regular spending brings independence closer.', 'Judging early-retirement plans and their withdrawal rates.', 'Planning partial independence: part-time work or a career change.'],
  history: 'William Bengen, "Determining Withdrawal Rates Using Historical Data", Journal of Financial Planning, 1994. Cooley, Hubbard and Walz, "Retirement Savings: Choosing a Withdrawal Rate That Is Sustainable", AAII Journal, 1998 — the "Trinity study". The financial-independence movement of the 2010s popularised the saving-rate view.',
  sim: ['pw-fi-curve', 'pw-four-percent']
},

/* ================================================================ retirement planning */
{
  id: 'retirement-planning', parent: 'wealth-building', title: 'Retirement planning', level: 1,
  short: 'A retirement plan answers four questions: the income you will need, what pensions will pay, the pot that must cover the gap, and the saving that builds it in time — revised as life and markets change, and planned for a long life.',
  keywords: ['retirement planning', 'retirement savings', 'replacement rate', 'how much to save', 'pension gap', 'longevity', 'life expectancy', 'retirement age', 'inflation', 'retirement goal'],
  prereq: ['financial-independence', 'inflation-purchasing-power', 'annuities'],
  related: ['pensions', 'retirement-income', 'monte-carlo-planning', 'sequence-risk', 'financial-goals', 'asset-allocation'],
  body: `
Retirement is the longest financial project most people undertake: some forty years of saving to pay for perhaps twenty-five or thirty of living. It feels vast and vague, which is exactly why it frightens people. Broken into four questions, answered roughly and revised often, it becomes manageable.

### 1. The income you will need
Planners often start from a **replacement rate** of 70–80 % of the income before retirement, on the grounds that some costs stop (saving itself, commuting, perhaps a mortgage) while others grow (health care, and time to fill). Better is a budget: what does a year of the life you want cost, in today's money? Working in today's money throughout keeps the numbers intuitive — use returns above inflation — but never forget what inflation does: at 3 % a year prices double in about 23 years, and ¤40,000 of spending today costs about ¤83,750 in 25 years.

### 2. What pensions will pay
State or public pensions, and any [[pensions|workplace pension]] that promises an income, form a floor that does not depend on markets. Find out what you are likely to receive and from what age, and subtract it from the need.

### 3. The pot for the gap
The remaining gap is what savings must provide, and the [[financial-independence|withdrawal-rate logic]] turns it into a pot:

$$P = \\frac{N - E}{w}$$

Needing ¤42,000 a year (70 % of ¤60,000), with ¤18,000 from pensions, leaves ¤24,000; at a 4 % withdrawal rate that is a pot of ¤600,000 in today's money.

### 4. The saving that gets you there
Reaching a goal $G$ in $T$ years at a real return $r$ takes a monthly saving of

$$c = G\\,\\frac{r/12}{(1 + r/12)^{12T} - 1}$$

For ¤500,000 at 4 % a year above inflation:

| Years to go | Monthly saving | Total paid in |
|---:|---:|---:|
| 40 | ¤423 | ¤203,000 |
| 30 | ¤720 | ¤259,000 |
| 20 | ¤1,363 | ¤327,000 |
| 10 | ¤3,396 | ¤407,000 |

Starting at 25 rather than 45 means saving less than a third as much each month — and paying less in total, because returns do more of the work. If you are starting late, the table is not a verdict but a menu: save more, work a little longer, plan to spend a little less, or combine the three.

### Plan for a long life
Averages mislead here. In most high-income countries a 65-year-old can expect around twenty more years on average, but a sizeable minority live past 90, and for a couple the chance that at least one does is higher still. Running out of money at 88 is far worse than leaving some unspent, which is why plans often run to 95 or beyond, and why part of retirement income is often secured for life ([[retirement-income]]).

### Keep the plan alive
A plan is a set of assumptions — return, inflation, retirement age, spending — and every one will be wrong in some direction. Review it every year or two and after big life changes, and look at the [[monte-carlo-planning|range of outcomes]] rather than one projection. When it falls short, the levers are the same four: save more, work a little longer (which adds saving years *and* removes years to fund), spend a little less, or accept a bit more investment risk — the last being the least reliable. As retirement nears, [[sequence-risk]] becomes the main danger and the [[asset-allocation|mix]] usually becomes more cautious.

> [!tip] Try your own numbers in [the savings calculator](#/tools/money/save) and [the independence calculator](#/tools/money/retire). A rough plan written down today beats a perfect plan never made.
`,
  ideas: [
    'Start from the income you will need in today\'s money, then subtract what pensions will pay.',
    'The gap divided by a withdrawal rate gives the pot; the pot and the years left give the monthly saving.',
    'Starting early cuts the monthly saving needed dramatically, because returns do more of the work.',
    'Plan for a long life: outliving your money is worse than leaving some behind.',
    'A plan is a set of assumptions to review regularly, not a single forecast.'
  ],
  pitfalls: [
    'I can plan with average life expectancy — Half of people live longer than the average; plans usually run to 95 or beyond.',
    'Working longer only adds a few more years of saving — It also adds growth, often raises pensions, and removes years that must be funded: several effects at once.',
    'Inflation can be ignored over a retirement — At 3 % a year prices double in about 23 years; plan in today\'s money with returns above inflation.'
  ],
  formulas: [
    {
      name: 'Monthly saving to reach a goal',
      expr: 'c = G*(r/12)/((1 + r/12)^(12*T) - 1)', tex: 'c = G\\,\\frac{r/12}{(1 + r/12)^{12T} - 1}',
      vars: {
        c: { name: 'monthly saving', q: 'money', unit: '$' },
        G: { name: 'goal', q: 'money', unit: '$', value: 500000 },
        r: { name: 'return above inflation', q: 'ratio', unit: '%', value: 4, min: 0.01, max: 20 },
        T: { name: 'years to go', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Starting from nothing; with savings already invested, subtract what they will grow to from the goal first.',
      practice: { unknowns: ['c', 'T'] },
      stories: {
        c: 'You want {G} in today\'s money in {T}, investing at {r} above inflation. How much must you save each month?',
        T: 'You can save {c} a month at {r} above inflation. How long until you reach {G}?'
      }
    },
    {
      name: 'The pot needed for an income gap',
      expr: 'P = (N - E)/w', tex: 'P = \\frac{N - E}{w}',
      vars: {
        P: { name: 'pot needed', q: 'money', unit: '$' },
        N: { name: 'yearly income needed', q: 'money', unit: '$', value: 42000 },
        E: { name: 'yearly pensions expected', q: 'money', unit: '$', value: 18000 },
        w: { name: 'withdrawal rate', q: 'ratio', unit: '%', value: 4, min: 1, max: 10 }
      },
      practice: { unknowns: ['P', 'E'] },
      stories: {
        P: 'You will need {N} a year in retirement and expect {E} from pensions. At a withdrawal rate of {w}, how large a pot covers the rest?',
        E: 'You will need {N} a year and have a pot of {P}, drawn at {w}. How much must pensions provide?'
      }
    },
    {
      name: 'What today\'s spending will cost later',
      expr: 'S = S0*(1 + i)^T', tex: 'S = S_0\\,(1 + i)^{T}',
      vars: {
        S: { name: 'cost in the future', q: 'money', unit: '$' },
        S0: { name: 'cost today', q: 'money', unit: '$', value: 40000 },
        i: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 3, min: -5, max: 50 },
        T: { name: 'years from now', q: 'years', unit: 'yr', value: 25 }
      },
      practice: { unknowns: ['S', 'T'] },
      stories: {
        S: 'Your spending is {S0} a year today. With inflation of {i}, what will the same life cost in {T}?',
        T: 'With inflation at {i}, how long until today\'s {S0} of spending costs {S}?'
      }
    }
  ],
  examples: [
    {
      title: 'From a salary to a monthly saving',
      q: 'You earn ¤60,000 and aim for 70 % of it in retirement. Pensions should pay ¤18,000 a year. At a 4 % withdrawal rate and 4 % real return, what must you save each month with 25, 30 or 35 years to go?',
      steps: [
        'Need: $0.7 \\times 60\\,000 = ¤42{,}000$; gap: $42\\,000 - 18\\,000 = ¤24{,}000$.',
        'Pot: $24\\,000/0.04 = ¤600{,}000$ in today\'s money.',
        '30 years: $600\\,000 \\times 0.003333/(1.003333^{360} - 1) = ¤864$ a month.',
        '25 years: ¤1,167 a month; 35 years: ¤657 a month.'
      ],
      a: '¤657, ¤864 or ¤1,167 a month for 35, 30 or 25 years.'
    },
    {
      title: 'What inflation does',
      q: 'Your spending is ¤40,000 a year. What will the same life cost in 25 years at 3 % inflation?',
      steps: [
        '$40\\,000 \\times 1.03^{25} = 40\\,000 \\times 2.094 = ¤83{,}751$.',
        'Prices double in about $\\ln 2/\\ln 1.03 = 23.4$ years at 3 %.',
        'Planning in today\'s money with returns above inflation handles this automatically.'
      ],
      a: 'About ¤83,750 a year.'
    }
  ],
  quiz: [
    { q: 'You need ¤20,000 a year beyond your pensions. At a 4 % withdrawal rate, how large a pot is that, in ¤?', answer: 500000, unit: '$',
      why: '$20\\,000/0.04 = ¤500{,}000$.' },
    { q: 'Why do plans often run to age 95 even though average life expectancy is lower?', choices: ['because running out of money is far worse than leaving some, and many people outlive the average', 'because annuities require it', 'to reduce taxes', 'because returns are higher late in life'], a: 0,
      why: 'An average means half live longer; the cost of outliving your money is much larger than the cost of a surplus.' },
    { q: 'Working two years longer helps only by adding two years of saving.', a: false,
      why: 'It also gives the pot two more years to grow, removes two years of withdrawals, and often raises pensions.' },
    { q: 'At 4 % above inflation, doubling the time to save from 20 to 40 years changes the monthly saving needed for a goal roughly how?', choices: ['it halves it', 'it cuts it to about a third', 'it does not change it', 'it cuts it to a tenth'], a: 1,
      why: 'For ¤500,000: ¤1,363 a month over 20 years against ¤423 over 40 — about 31 %.' },
    { q: 'At 3 % inflation, how many years until prices double?', answer: 23.45, unit: 'yr',
      why: '$\\ln 2/\\ln 1.03 = 23.4$ years (the rule of 72 gives 24).' }
  ],
  applications: ['Turning a vague worry about retirement into a monthly number.', 'Checking whether current pension contributions are on track.', 'Choosing between retiring later, saving more and spending less.', 'Reviewing a plan after a change of job, family or market.'],
  sim: 'ref-compound'
},

/* ================================================================ pensions */
{
  id: 'pensions', parent: 'wealth-building', title: 'Pensions and retirement accounts', level: 1,
  short: 'Retirement systems are built from public pensions, workplace pensions and personal savings. Defined-benefit schemes promise an income; defined-contribution schemes build a pot whose risks are yours. Employer contributions and tax relief make them the cheapest money most people ever get.',
  keywords: ['pension', 'defined benefit', 'defined contribution', 'employer match', '401(k)', 'IRA', 'Roth', 'ISA', 'workplace pension', 'auto-enrolment', 'superannuation', 'study fund', 'keren hishtalmut', 'pension fund', 'tax relief', 'state pension'],
  prereq: ['retirement-planning', 'annuities', 'mutual-funds-etfs'],
  related: ['taxes-investing', 'retirement-income', 'investment-fees', 'asset-allocation', 'estate-planning'],
  body: `
Almost every country has built its retirement system from the same few pieces, arranged differently. Knowing the pieces lets you read any system — and see what you are entitled to, what you must do yourself, and where the free money is.

### Three pillars
- **Public (state) pensions**, usually paid from the taxes and contributions of today's workers (*pay as you go*). They provide a floor; their size, starting age and indexation differ widely by country and are changed by governments over time.
- **Workplace (occupational) pensions**, arranged through an employer, often compulsory or automatic.
- **Personal savings** in pensions or other accounts, often with tax advantages.

### Defined benefit or defined contribution
A **defined-benefit (DB)** pension promises an income by formula, typically a fraction of salary for each year of service. With an accrual of 1/60 a year, 30 years on a final salary of ¤50,000 gives ¤25,000 a year for life, often raised with inflation. The employer — or the state — carries the investment and longevity risk: if markets disappoint or pensioners live longer, the sponsor must pay more.

A **defined-contribution (DC)** pension promises nothing in advance. You and your employer pay in, the money is invested, and what you retire with is the pot. The risks — returns, costs, longevity, and turning the pot into income — are yours. Over the last few decades private-sector DB schemes have been closing in many countries and DC has become the norm, which makes fees, the default fund's mix and your own contribution rate matter much more.

### Free money: employer contributions and matching
Many employers contribute, and many **match** your own contribution up to a limit — for example 50 % of what you pay, up to 6 % of salary. On a salary of ¤50,000 that is ¤3,000 a year from you and ¤1,500 from the employer. Over 35 years at 5 % a year above inflation the employer's part alone grows to about ¤135,000. A match is an immediate return of 50 % (or 100 %) before any market return, with no risk attached; contributing less than the amount that collects all of it leaves a return on the table that no investment can promise.

### Tax relief: on the way in or on the way out
Governments encourage retirement saving by exempting some of three stages from tax: the money going **in**, the **growth**, and the money coming **out**.
- **Relief on the way in**: contributions from untaxed income, untaxed growth, withdrawals taxed as income — the usual design of workplace and personal pensions.
- **Relief on the way out**: contributions from taxed income, with growth and withdrawals tax-free.

If your tax rate is the same at both ends the two give exactly the same result ([[taxes-investing]]). Relief on the way in wins if your tax rate in retirement will be lower; relief on the way out wins if it will be higher. Both beat an ordinary taxed account by a wide margin over decades.

### Some named examples
Details change often, so treat these as a map, not rules:
- **United States**: Social Security; employer 401(k) plans, often with a match; individual retirement accounts (IRAs). Both come in a traditional version (relief on the way in) and a *Roth* version (relief on the way out).
- **United Kingdom**: the State Pension; workplace pensions with automatic enrolment (introduced from 2012), employer contributions and tax relief; personal pensions; and ISAs — tax-free savings accounts that are not pensions but are often used alongside them.
- **Israel**: mandatory pension saving for employees in pension funds, with employee and employer contributions and tax advantages; and *study funds* (keren hishtalmut), medium-term savings with employer contributions whose gains can become tax-free after six years, within limits.
- **Australia**: *superannuation*, funded by compulsory employer contributions and generally preserved until a minimum age.

### What to check in your own
What does the employer pay, and what must you pay to receive all of it? What is the default investment mix, and what does it cost? Can you take the pot with you when you change jobs? When and how can it be drawn — as a lump sum, an income, or an [[retirement-income|annuity]]? Who receives it if you die ([[estate-planning]])? Fees deserve special attention: a difference of 1 % a year on ¤375 a month over 35 years is worth about ¤73,500 at 5 % ([[investment-fees]]).
`,
  ideas: [
    'Retirement systems combine public pensions, workplace pensions and personal savings.',
    'Defined-benefit pensions promise an income and leave the risk with the sponsor; defined-contribution pensions build a pot whose risks are yours.',
    'An employer match is an immediate, risk-free return on your contribution; collecting all of it comes first.',
    'Tax relief can come on the way in or on the way out; at equal tax rates the two give the same result.',
    'In a defined-contribution world, fees, the default fund and your contribution rate decide most of the outcome.'
  ],
  pitfalls: [
    'The state pension will be enough — In most countries it is designed as a floor, well below most people\'s working income, and its rules change over time.',
    'Contributing below the employer\'s match limit saves money now — It gives up an immediate 50–100 % return on the missing contributions.',
    'Pensions are all the same — DB and DC differ in who carries the risk, and DC plans differ widely in costs and default investments.'
  ],
  formulas: [
    {
      name: 'Defined-benefit pension',
      expr: 'P = a*n*S', tex: 'P = a\\,n\\,S',
      vars: {
        P: { name: 'yearly pension', q: 'money', unit: '$' },
        a: { name: 'accrual rate per year of service', q: 'ratio', unit: '%', value: 100 / 60, min: 0.1, max: 5 },
        n: { name: 'years of service', int: true, value: 30 },
        S: { name: 'pensionable (final or average) salary', q: 'money', unit: '$', value: 50000 }
      },
      note: 'An accrual of 1/60 is 1.667 % a year; 1/80 is 1.25 %. Real schemes add caps, early-retirement reductions and indexation rules.',
      practice: { unknowns: ['P', 'n'] },
      stories: {
        P: 'A pension scheme pays {a} of salary for each year of service. After {n} years on a salary of {S}, what is the yearly pension?',
        n: 'A scheme accrues {a} a year on a salary of {S}. How many years of service give a pension of {P}?'
      }
    },
    {
      name: 'Contributions with an employer match, at retirement',
      expr: 'A = c*(1 + m)*((1 + r)^T - 1)/r', tex: 'A = c\\,(1 + m)\\,\\frac{(1 + r)^{T} - 1}{r}',
      vars: {
        A: { name: 'pot at retirement', q: 'money', unit: '$' },
        c: { name: 'your contribution each year', q: 'money', unit: '$', value: 3000 },
        m: { name: 'employer match (share of your contribution)', q: 'ratio', unit: '%', value: 50, min: 0, max: 300 },
        r: { name: 'yearly return above inflation', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 20 },
        T: { name: 'years to retirement', q: 'years', unit: 'yr', value: 35 }
      },
      note: 'Contributions at the end of each year, in today\'s money. Set $m = 0$ to see what you would have without the match.',
      practice: { unknowns: ['A', 'c'] },
      stories: {
        A: 'You pay {c} a year into a pension and your employer adds {m} of it. At {r} a year for {T}, what is the pot at retirement?',
        c: 'Your employer matches {m} of your contributions. At {r} for {T}, how much must you pay in each year for a pot of {A}?'
      }
    }
  ],
  examples: [
    {
      title: 'What a match is worth',
      q: 'You earn ¤50,000 and pay 6 % (¤3,000) into a pension; the employer matches 50 % (¤1,500). What does it grow to in 35 years at 5 % above inflation, and how much of that is the employer\'s?',
      steps: [
        'Annuity factor: $(1.05^{35} - 1)/0.05 = 90.32$.',
        'Your part: $3\\,000 \\times 90.32 = ¤270{,}961$; the employer\'s: $1\\,500 \\times 90.32 = ¤135{,}480$.',
        'Together ¤406,441 in today\'s money — half as much again as you would have alone.'
      ],
      a: '¤406,441, of which ¤135,480 comes from the match.'
    },
    {
      title: 'Relief in or relief out',
      q: '¤10,000 of salary goes into retirement saving. The tax rate is 30 % now; the money earns 5 % a year for 30 years. Compare relief on the way in, relief on the way out, and an ordinary account taxed at 25 % on the return each year.',
      steps: [
        'Growth factor: $1.05^{30} = 4.3219$.',
        'Relief in: $10\\,000 \\times 4.3219 = ¤43{,}219$, taxed at 30 % on the way out: ¤30,254.',
        'Relief out: $7\\,000$ after tax, growing tax-free: $7\\,000 \\times 4.3219 = ¤30{,}254$ — identical.',
        'If the retirement tax rate were 20 %, relief in would give ¤34,576.',
        'Ordinary account: $7\\,000 \\times (1 + 0.05 \\times 0.75)^{30} = ¤21{,}122$.'
      ],
      a: '¤30,254 either way at equal rates, against ¤21,122 in an ordinary taxed account.'
    }
  ],
  quiz: [
    { q: 'In a defined-contribution pension, who bears the investment risk?', choices: ['the employer', 'the member', 'the state', 'the fund manager'], a: 1,
      why: 'The pot is whatever the contributions and returns make it; nothing is promised in advance.' },
    { q: 'A scheme pays 1/80 of final salary per year of service. After 40 years on ¤60,000, what is the yearly pension, in ¤?', answer: 30000, unit: '$',
      why: '$40/80 \\times 60\\,000 = ¤30{,}000$.' },
    { q: 'With the same tax rate now and in retirement, relief on the way in and relief on the way out give the same final amount.', a: true,
      why: '$(1-t)(1+r)^T = (1+r)^T(1-t)$: the order of multiplication does not matter.' },
    { q: 'Your employer matches 100 % of contributions up to 5 % of salary. You pay 3 %. What are you giving up?', choices: ['nothing', '2 % of salary a year from the employer', '5 % of salary a year', '3 % of salary a year'], a: 1,
      why: 'The employer would add 2 % more if you paid 2 % more — an immediate 100 % return you are not collecting.' },
    { q: 'Relief on the way in beats relief on the way out when…', choices: ['your tax rate in retirement will be lower than now', 'your tax rate in retirement will be higher', 'returns are high', 'never'], a: 0,
      why: 'You escape the higher rate on the way in and pay the lower one on the way out.' }
  ],
  applications: ['Reading your pension statement and scheme rules.', 'Deciding how much to contribute to collect a full employer match.', 'Choosing between pre-tax and after-tax retirement accounts.', 'Comparing pension providers on fees and default funds.'],
  sim: 'pw-tax-drag'
},

/* ================================================================ retirement income */
{
  id: 'retirement-income', parent: 'wealth-building', title: 'Retirement income: annuities and drawdown', level: 2,
  short: 'A pot can buy a lifetime income from an insurer (an annuity) or stay invested while you draw on it. The annuity removes the risk of a long life; drawdown keeps control, flexibility and an inheritance. Many plans combine a secure floor with flexible spending.',
  keywords: ['annuity', 'life annuity', 'drawdown', 'decumulation', 'retirement income', 'mortality credits', 'longevity risk', 'guaranteed income', 'income floor', 'withdrawal', 'bucket strategy', 'guardrails'],
  prereq: ['financial-independence', 'annuities', 'sequence-risk'],
  related: ['pensions', 'retirement-planning', 'monte-carlo-planning', 'insurance-basics', 'inflation-linked-bonds', 'estate-planning'],
  body: `
Saving builds a pot; retirement turns it into a paycheck. There are two basic ways to do it, and most sensible plans combine them.

### Buying an income: the life annuity
Hand an insurer a lump sum and it pays you an income for as long as you live — level, rising by a fixed rate, or linked to inflation, depending on what you buy (the rising kinds start lower). The payout rate depends on your age, health, the interest rates of the day and the options chosen, so here are round numbers only: at a payout rate of 6 %, ¤500,000 buys ¤30,000 a year for life.

How can an insurer pay 6 % when safe bonds pay less? Through **mortality credits**: the money of those who die early pays those who live long. An annuity is insurance against a long life — exactly the risk a lone retiree cannot diversify. The price: the capital is gone (nothing is left to heirs unless a guarantee period is bought), the decision is usually irreversible, a level annuity loses purchasing power (after 20 years of 2.5 % inflation ¤30,000 buys what ¤18,300 buys today), and you depend on the insurer, which many countries back with a guarantee scheme up to a limit.

### Drawing down
Keep the pot invested and withdraw from it. You keep control, flexibility and whatever is left for heirs; you also keep the **investment risk** ([[sequence-risk]]) and the **longevity risk**. At a steady return $r$, a pot $B$ paying $W$ at the end of each year lasts

$$n = -\\frac{\\ln\\!\\left(1 - rB/W\\right)}{\\ln(1+r)}$$

years — forever if $rB \\ge W$. Taking the annuity's ¤30,000 from ¤500,000 earning 3 % a year above inflation lasts about 23 years, to 88 for someone starting at 65. Taking ¤25,510 a year spends the pot to zero in exactly 30 years; the [[financial-independence|4 %]] ¤20,000 lasts more than 45.

### Comparing them
| | Life annuity | Drawdown |
|---|---|---|
| Income | Guaranteed for life | Depends on returns and spending |
| Living to 100 | Still paid | May run out |
| Dying at 70 | Nothing left (without guarantees) | The rest goes to heirs |
| Flexibility | None once bought | Full |
| Inflation | Protected only if bought linked | Can be spent in today's money |

Neither is better in general. An annuity turns "how long will I live?" from a financial risk into the insurer's problem; drawdown keeps the upside and the options, and the worry.

### Combining: a floor and upside
A common pattern is to cover essential spending with secure lifetime income — state pension, any [[pensions|defined-benefit pension]], perhaps an annuity bought with part of the pot — and to draw the rest flexibly from investments. Where the rules raise a state pension for waiting, delaying it works like buying an inflation-linked annuity at a good price. Other tools: a cash buffer of a year or two of spending, so shares are never sold in a slump; and *guardrails* that trim spending after bad years and allow raises after good ones.

> [!tip] Ask two questions of any retirement plan: which of my spending is guaranteed however long I live, and what happens to my income if markets fall 30 % in my first year? The simulation below sets an annuity against drawdown; choose the age at death and see who wins.
`,
  ideas: [
    'A life annuity turns a lump sum into an income for life, paid for by pooling longevity risk.',
    'Mortality credits let an annuity pay more than a safe withdrawal from the same pot.',
    'Drawdown keeps control, flexibility and a bequest, but leaves investment and longevity risk with you.',
    'A level income loses purchasing power; inflation protection costs a lower starting income.',
    'Many plans cover essentials with guaranteed income and draw the rest flexibly.'
  ],
  pitfalls: [
    'An annuity is a bad deal if I die early — It is insurance: like fire insurance on a house that never burns, its value is the protection against the expensive outcome — a very long life.',
    'Drawing down the same income as an annuity is just as safe — The annuity pays for life; the pot can run out, and a bad sequence can empty it years early.',
    'A level annuity income will keep my standard of living — At 2.5 % inflation it buys about 40 % less after 20 years.'
  ],
  formulas: [
    {
      name: 'How long a pot lasts',
      expr: 'n = -ln(1 - r*B/W)/ln(1 + r)', tex: 'n = -\\frac{\\ln\\left(1 - \\frac{rB}{W}\\right)}{\\ln(1 + r)}',
      vars: {
        n: { name: 'years the money lasts', q: 'years', unit: 'yr' },
        r: { name: 'steady return above inflation', q: 'ratio', unit: '%', value: 3, min: 0.01, max: 20 },
        B: { name: 'pot at the start', q: 'money', unit: '$', value: 500000 },
        W: { name: 'yearly withdrawal (today\'s money)', q: 'money', unit: '$', value: 30000 }
      },
      note: 'Withdrawals at the end of each year. If $rB \\ge W$ the pot never runs out. Solve for $W$ to find the income that lasts a chosen number of years.',
      practice: { unknowns: ['n', 'W'] },
      stories: {
        n: 'A pot of {B} earns a steady {r} above inflation, and you withdraw {W} a year. How long does it last?',
        W: 'A pot of {B} earns a steady {r} above inflation. What yearly withdrawal spends it to zero in {n}?'
      }
    },
    {
      name: 'Annuity income',
      expr: 'I = B*a', tex: 'I = B\\,a',
      vars: {
        I: { name: 'yearly income for life', q: 'money', unit: '$' },
        B: { name: 'amount paid to the insurer', q: 'money', unit: '$', value: 500000 },
        a: { name: 'payout rate', q: 'ratio', unit: '%', value: 6, min: 0.5, max: 20 }
      },
      note: 'Payout rates vary with age, health, interest rates and options; the default is illustrative only.',
      practice: { unknowns: ['I', 'B'] },
      stories: {
        I: 'An insurer offers a payout rate of {a}. What yearly income does {B} buy?',
        B: 'At a payout rate of {a}, how much must you pay for an income of {I} a year?'
      }
    },
    {
      name: 'What a level income is worth later',
      expr: 'V = I/(1 + i)^t', tex: 'V = \\frac{I}{(1 + i)^{t}}',
      vars: {
        V: { name: 'value in today\'s money', q: 'money', unit: '$' },
        I: { name: 'level yearly income', q: 'money', unit: '$', value: 30000 },
        i: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 2.5, min: -5, max: 50 },
        t: { name: 'years from now', q: 'years', unit: 'yr', value: 20 }
      },
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'A level annuity pays {I} a year. With inflation of {i}, what is that income worth in today\'s money after {t}?',
        t: 'A level income of {I} a year falls to {V} in today\'s money at {i} inflation. After how many years?'
      }
    }
  ],
  examples: [
    {
      title: 'The same income two ways',
      q: 'A 65-year-old with ¤500,000 can buy an annuity paying 6 % (¤30,000 a year for life) or draw ¤30,000 a year from the pot invested at 3 % above inflation. When does the drawdown run out?',
      steps: [
        '$rB/W = 0.03 \\times 500\\,000/30\\,000 = 0.5$.',
        '$n = -\\ln(0.5)/\\ln 1.03 = 0.693/0.0296 = 23.4$ years — to about 88.',
        'The drawdown income is in today\'s money; a level annuity\'s is not. Drawing ¤25,510 instead would last exactly 30 years, to 95.'
      ],
      a: 'At about 88; the annuity keeps paying for life.'
    },
    {
      title: 'A level income and inflation',
      q: 'A level annuity pays ¤30,000 a year. At 2.5 % inflation, what is it worth in today\'s money after 10 and after 20 years?',
      steps: [
        'After 10 years: $30\\,000/1.025^{10} = ¤23{,}436$.',
        'After 20 years: $30\\,000/1.025^{20} = ¤18{,}308$ — about 39 % less.'
      ],
      a: '¤23,436 after 10 years and ¤18,308 after 20.'
    }
  ],
  quiz: [
    { q: 'Mortality credits are…', choices: ['the transfer from annuity buyers who die early to those who live long', 'a tax credit for retirees', 'a fee charged by insurers', 'a bonus for good health'], a: 0,
      why: 'Pooling lets the insurer pay everyone more than a safe withdrawal would, because not everyone lives long.' },
    { q: 'A pot of ¤400,000 earns nothing above inflation and pays ¤25,000 a year. How many years does it last?', answer: 16, unit: 'yr',
      why: 'With no growth it is simple division: $400\\,000/25\\,000 = 16$ years.' },
    { q: 'A level annuity keeps its purchasing power over a retirement.', a: false,
      why: 'Its money amount is fixed, so inflation erodes it; inflation-linked annuities exist but start lower.' },
    { q: 'Who is most exposed to longevity risk?', choices: ['a retiree drawing down savings with no annuity or DB pension', 'someone whose income is a life annuity', 'a member of a DB pension scheme', 'someone whose state pension covers all costs'], a: 0,
      why: 'Only drawdown can run out; the others are paid for life.' },
    { q: 'A level annuity pays ¤30,000 a year. At 2.5 % inflation, what is it worth in today\'s money after 10 years, in ¤?', answer: 23436, unit: '$',
      why: '$30\\,000/1.025^{10} = ¤23{,}436$.' }
  ],
  applications: ['Deciding how much, if any, of a pot to turn into guaranteed income.', 'Setting a sustainable withdrawal from invested savings.', 'Judging when to start a state pension where delaying raises it.', 'Explaining to a family what will be left for them.'],
  sim: ['pw-annuity-drawdown', 'pw-sequence']
},

/* ================================================================ taxes */
{
  id: 'taxes-investing', parent: 'wealth-building', title: 'Taxes and investing', level: 2,
  short: 'Taxes can be the largest cost of investing. How much is taxed, when it is taxed and what is taxed all compound over time: paying tax every year costs far more than paying the same rate once at the end, and tax-advantaged accounts can be worth a third or more of the result.',
  keywords: ['tax drag', 'capital gains tax', 'tax deferral', 'dividend tax', 'tax-advantaged account', 'tax wrapper', 'asset location', 'tax-loss harvesting', 'turnover', 'after-tax return', 'inflation tax'],
  prereq: ['compounding-returns', 'real-vs-nominal', 'investment-fees'],
  related: ['pensions', 'wealth-strategies', 'dividends', 'index-investing', 'estate-planning'],
  body: `
Taxes are, after inflation, the largest cost most investors face — larger than fees for many. The rules differ everywhere and change often, but the mechanics are universal: **how much** is taxed, **when** it is taxed, and **what** is taxed. Time turns small differences in each into large ones.

### Tax drag
Invest ¤10,000 at 7 % a year for 30 years. Untaxed it grows to ¤76,123. With a 25 % tax on the return:

| How the return is taxed | After 30 years | Share of the untaxed result |
|---|---:|---:|
| Not at all (a tax-free account) | ¤76,123 | 100 % |
| Once, on the gain, at the end | ¤59,592 | 78 % |
| Every year, as it is earned | ¤46,416 | 61 % |

The same 25 % rate removes 25 % of the gain if paid once at the end, but 45 % of it if paid every year: each year's tax also removes all the future growth on that tax. The yearly-taxed pot compounds at $7 \\times 0.75 = 5.25\\,\\%$ instead of 7 %, and the gap widens every decade — 85 % of the untaxed result after 10 years, 72 % after 20, 52 % after 40.

### Deferral is worth real money
Interest is usually taxed each year as it is paid; capital gains usually only when an asset is sold (*realised*); dividends somewhere between. So *when* a tax falls matters:
- **Turnover** realises gains and brings the tax forward; a fund that trades a lot can cost more in tax than in fees.
- **Holding** a broad fund for decades defers the gain — in effect an interest-free loan from the government, whose returns you keep.
- **Losses** can often be set against gains (*tax-loss harvesting*), within each country's rules against selling and immediately buying back.

### Tax on nominal returns
Tax is charged on nominal returns, but only the real part makes you richer. With 7 % returns, 3 % inflation and a 25 % tax, the after-tax real return is

$$R = \\frac{r(1-t) - i}{1 + i} = \\frac{7 \\times 0.75 - 3}{1.03} = 2.18\\,\\%$$

against 3.88 % before tax: the tax takes 44 % of the real return, not 25 %. The higher inflation is, the heavier the real burden.

### Tax-advantaged accounts
Most countries offer accounts in which investments grow untaxed: [[pensions]] and savings accounts of many names. Two designs dominate: **relief on the way in** (contribute from untaxed income, pay income tax on withdrawals) and **relief on the way out** (contribute from taxed income, withdraw tax-free). With a tax rate $t$ equal at both ends they are identical, because multiplication does not care about order:

$$(1-t)\\,(1+r)^T = (1+r)^T\\,(1-t)$$

¤10,000 of salary, 30 % tax, 5 % for 30 years: ¤30,254 either way, against ¤21,122 in an ordinary account taxed yearly at 25 %. Choosing between the two designs is a bet on your future tax rate relative to today's. The common trade-offs of all such accounts are limits on how much goes in, rules on when money can come out, and sometimes restricted investment choices.

### Asset location
If some of your money is in tax-advantaged accounts and some is not, *where* each asset sits matters. Assets taxed heavily every year — interest-paying bonds, high-dividend funds — gain most from shelter; broad share funds, whose gains can be deferred for decades, lose least outside. The same overall mix, less tax.

> [!note] This page explains mechanics, not the rules of any country, which change often. Check your country's current rules, or ask a qualified adviser, before acting.
`,
  ideas: [
    'Tax drag compounds: a tax paid every year removes the future growth on the tax as well.',
    'Paying the same rate once at the end costs far less than paying it every year.',
    'Tax on nominal returns takes a larger share of the real return, more so when inflation is high.',
    'Relief on the way in and relief on the way out are equal at equal tax rates; the choice is a bet on future tax rates.',
    'Holding heavily taxed assets inside tax-advantaged accounts lowers the tax on the same overall mix.'
  ],
  pitfalls: [
    'A 25 % tax takes 25 % of my gains — Only if paid once at the end; paid every year for 30 years at 7 %, it takes about 45 % of the gain.',
    'Relief on the way in is always better because the tax is postponed — At equal tax rates the two designs are identical; the difference comes only from a change in your rate.',
    'Trading often costs only the brokerage fees — Each sale can realise a gain and bring tax forward, a cost that compounds.'
  ],
  formulas: [
    {
      name: 'Growth when the return is taxed every year',
      expr: 'A = P*(1 + r*(1 - t))^T', tex: 'A = P\\,\\left(1 + r(1 - t)\\right)^{T}',
      vars: {
        A: { name: 'value after tax', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return before tax', q: 'ratio', unit: '%', value: 7 },
        t: { name: 'tax rate on the return', q: 'ratio', unit: '%', value: 25, min: 0, max: 99 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      practice: { unknowns: ['A', 't'] },
      stories: {
        A: 'You invest {P} at {r} a year, and the return is taxed at {t} every year. What do you have after {T}?',
        t: '{P} invested at {r} a year for {T} grows to {A} when the return is taxed every year. What is the tax rate?'
      }
    },
    {
      name: 'Growth when the gain is taxed once at the end',
      expr: 'A = P*((1 + r)^T - t*((1 + r)^T - 1))', tex: 'A = P\\,\\left[(1 + r)^{T} - t\\left((1 + r)^{T} - 1\\right)\\right]',
      vars: {
        A: { name: 'value after tax', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return before tax', q: 'ratio', unit: '%', value: 7 },
        t: { name: 'tax rate on the gain', q: 'ratio', unit: '%', value: 25, min: 0, max: 99 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      practice: { unknowns: ['A'] },
      stories: {
        A: 'You invest {P} at {r} a year for {T}, and the whole gain is taxed at {t} when you sell. What do you keep?'
      }
    },
    {
      name: 'Real return after tax',
      expr: 'R = (r*(1 - t) - i)/(1 + i)', tex: 'R = \\frac{r(1 - t) - i}{1 + i}',
      vars: {
        R: { name: 'real return after tax', q: 'ratio', unit: '%', signed: true },
        r: { name: 'nominal return before tax', q: 'ratio', unit: '%', value: 7 },
        t: { name: 'tax rate on the return', q: 'ratio', unit: '%', value: 25, min: 0, max: 99 },
        i: { name: 'inflation', q: 'ratio', unit: '%', value: 3, min: -10, max: 50 }
      },
      practice: { unknowns: ['R', 'i'] },
      stories: {
        R: 'An investment returns {r} a year, taxed at {t}, while inflation is {i}. What is the real return after tax?',
        i: 'An investment returns {r}, taxed at {t}, and its real return after tax is {R}. What inflation rate is that?'
      }
    },
    {
      name: 'A tax-advantaged account with the same rate in and out',
      expr: 'A = P*(1 - t)*(1 + r)^T', tex: 'A = P\\,(1 - t)\\,(1 + r)^{T}',
      vars: {
        A: { name: 'value after tax', q: 'money', unit: '$' },
        P: { name: 'earnings before income tax', q: 'money', unit: '$', value: 10000 },
        t: { name: 'income tax rate (now and later)', q: 'ratio', unit: '%', value: 30, min: 0, max: 99 },
        r: { name: 'yearly return', q: 'ratio', unit: '%', value: 5 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'Whether the tax is taken on the way in or on the way out, the result is the same product.',
      practice: { unknowns: ['A'] },
      stories: {
        A: '{P} of earnings goes into a tax-advantaged account; income tax is {t}, the return {r} a year for {T}. What do you have after tax?'
      }
    }
  ],
  examples: [
    {
      title: 'Three ways to tax the same return',
      q: '¤10,000 at 7 % for 30 years with a 25 % tax on the return. Compare no tax, tax once at the end, and tax every year.',
      steps: [
        'Untaxed: $10\\,000 \\times 1.07^{30} = ¤76{,}123$, a gain of ¤66,123.',
        'Taxed at the end: $76\\,123 - 0.25 \\times 66\\,123 = ¤59{,}592$ — 25 % of the gain.',
        'Taxed yearly: $10\\,000 \\times 1.0525^{30} = ¤46{,}416$, a gain of ¤36,416 — 45 % of the untaxed gain is lost.'
      ],
      a: '¤76,123, ¤59,592 and ¤46,416.'
    },
    {
      title: 'The real burden',
      q: 'Returns are 7 %, inflation 3 %, tax 25 % on the return. What is the real return before and after tax, and what share of it does the tax take?',
      steps: [
        'Before tax: $(7 - 3)/1.03 = 3.88\\,\\%$.',
        'After tax: $(7 \\times 0.75 - 3)/1.03 = 2.25/1.03 = 2.18\\,\\%$.',
        'The tax takes $1 - 2.18/3.88 = 44\\,\\%$ of the real return.'
      ],
      a: '3.88 % before and 2.18 % after tax: 44 % of the real return.'
    }
  ],
  quiz: [
    { q: '¤10,000 earns 6 % a year for 20 years, with the return taxed at 20 % every year. What is it worth, in ¤?', answer: 25540, unit: '$',
      why: '$10\\,000 \\times (1 + 0.06 \\times 0.8)^{20} = 10\\,000 \\times 1.048^{20} = ¤25{,}540$.' },
    { q: 'Two funds earn 7 % before tax. A trades constantly, realising gains every year; B holds for decades. If gains are taxed when realised, which leaves more?', choices: ['A', 'B', 'they are equal', 'it depends only on fees'], a: 1,
      why: 'B defers the tax and keeps compounding on it; A pays each year and loses the growth on the tax.' },
    { q: 'Relief on the way in always beats relief on the way out.', a: false,
      why: 'At equal tax rates they are identical; relief on the way in wins only if your tax rate later is lower.' },
    { q: 'A bond returns 5 %, taxed at 30 %, with inflation at 2 %. What is the real return after tax, in %?', answer: 1.4706, unit: '%',
      why: '$(5 \\times 0.7 - 2)/1.02 = 1.5/1.02 = 1.47\\,\\%$.' },
    { q: 'If interest is taxed every year outside tax-advantaged accounts, which holding gains most from being inside one?', choices: ['a bond fund paying interest', 'a broad share fund held for decades', 'the cash in a current account', 'a single share you never sell'], a: 0,
      why: 'Its whole return would otherwise be taxed every year; the share fund\'s gains can be deferred anyway.' }
  ],
  applications: ['Choosing which account to fill first.', 'Deciding where to hold bonds and where to hold shares.', 'Understanding why low-turnover index funds are tax-efficient.', 'Estimating returns after tax and inflation for a plan.'],
  sim: 'pw-tax-drag'
},

/* ================================================================ estate planning */
{
  id: 'estate-planning', parent: 'wealth-building', title: 'Passing wealth on', level: 1,
  short: 'Estate planning makes sure the people you care about are provided for and know what to do: a will, up-to-date beneficiary nominations, powers of attorney, perhaps a trust, awareness of taxes at death, and gifts made while you are alive.',
  keywords: ['estate planning', 'will', 'inheritance', 'executor', 'beneficiary', 'power of attorney', 'trust', 'inheritance tax', 'estate tax', 'probate', 'gifts', 'intestacy', 'forced heirship', 'guardian'],
  prereq: ['net-worth', 'life-disability-insurance', 'pensions'],
  related: ['taxes-investing', 'retirement-income', 'insurance-basics', 'financial-goals', 'money-anxiety'],
  body: `
Wealth outlives its owner, and what happens to it then — and to you, if you become unable to decide — can be arranged calmly now or left to law and chance. Most estate planning is not about tax or the very rich. It is about making sure the people you care about are provided for, know what to do, and do not have to fight about it. Many people put it off because it means thinking about death; doing it usually brings relief rather than gloom.

### The basic documents
- **A will** says who receives what, and who (an *executor*) will carry it out. Without one, the law of your country or state decides by fixed rules (*intestacy*), which may not match your wishes — unmarried partners and stepchildren are often left out entirely. Some countries also reserve part of an estate for children or a spouse whatever the will says (*forced heirship*, common in civil-law countries).
- **Guardians** for young children can be named, in many countries in the will.
- **Beneficiary nominations** on pensions, life insurance and some accounts often pass *outside* the will, straight to the named person. They are easy to forget, and to leave out of date after a divorce or a death.
- **Lasting powers of attorney** (the name varies) let someone you trust manage your money, or make health decisions, if you lose capacity. Without one, family members may need a court's permission to pay your bills.

### Trusts
A trust separates ownership from benefit: trustees hold and manage assets for beneficiaries, under rules you set. Trusts are used to provide for children until a chosen age, for a relative who cannot manage money, to keep assets out of a slow probate process, or for tax reasons. They cost money to set up and run, and their treatment varies greatly between countries.

### Taxes at death
Countries differ widely. Some tax the estate above a threshold before it is shared out (the United States taxes large estates this way); some tax what each heir receives, often at rates that depend on the relationship (common in continental Europe); some have had no inheritance tax for decades — Australia and Israel among them — though gains may still be taxed in other ways. A simple model of an estate tax is a rate on the part above an exemption:

$$T = t\\,(E - X)$$

A 40 % tax on an estate of ¤1,000,000 with a ¤500,000 exemption takes ¤200,000 — 20 % of the whole.

### Giving while living
Money given early has longer to compound. ¤10,000 given at birth and invested at 5 % a year above inflation is worth about ¤24,000 at 18 and ¤238,000 at 65, in today's money; ¤2,000 a year for a child's first 18 years grows to about ¤56,000. Many countries allow some gifts free of tax, within limits and time rules. Giving also lets you see the money used — but it cannot be taken back, and your own [[retirement-planning|retirement]] comes first: an adult child can borrow for education, but nobody lends for a retirement.

### A practical checklist
- A current will, and beneficiary nominations that agree with it.
- A list of accounts, policies, pensions, debts and digital accounts, and where to find them (not the passwords themselves in the will).
- Powers of attorney for money and for health.
- Enough [[life-disability-insurance|life insurance]] for anyone who depends on your income.
- A conversation, so that nobody is surprised.

> [!note] Inheritance law and taxes are among the most country-specific areas of finance. This page describes common patterns; a local lawyer or notary is worth the fee for anything beyond the simplest estate.
`,
  ideas: [
    'Without a will, fixed legal rules decide who inherits, which may not match your wishes.',
    'Pension and insurance nominations often pass outside the will and must be kept up to date.',
    'Powers of attorney protect you and your family if you lose the capacity to decide.',
    'Inheritance taxes range from none to substantial, depending on the country and the relationship.',
    'Gifts made early compound for longer, but should not endanger your own security.'
  ],
  pitfalls: [
    'My will covers everything I own — Pensions, life insurance and some jointly held assets often pass by nomination or by law, outside the will.',
    'Estate planning is only for the rich — Anyone with children, a partner, a pension or a home benefits from a will, nominations and powers of attorney.',
    'My family will know what I wanted — Without documents, they may not be allowed to act on it, and the law may decide differently.'
  ],
  formulas: [
    {
      name: 'An estate tax above an exemption',
      expr: 'T = t*(E - X)', tex: 'T = t\\,(E - X)',
      vars: {
        T: { name: 'tax due', q: 'money', unit: '$' },
        t: { name: 'tax rate above the exemption', q: 'ratio', unit: '%', value: 40, min: 0, max: 99 },
        E: { name: 'value of the estate', q: 'money', unit: '$', value: 1000000 },
        X: { name: 'exempt amount', q: 'money', unit: '$', value: 500000 }
      },
      note: 'A simple model; real systems add reliefs, bands, spouse exemptions and rules for gifts made before death.',
      practice: { unknowns: ['T', 'E'] },
      stories: {
        T: 'An estate worth {E} is taxed at {t} on everything above {X}. How much tax is due?',
        E: 'A tax of {t} applies above {X}, and {T} is due. How large is the estate?'
      }
    },
    {
      name: 'A gift that compounds',
      expr: 'A = G*(1 + r)^n', tex: 'A = G\\,(1 + r)^{n}',
      vars: {
        A: { name: 'value later', q: 'money', unit: '$' },
        G: { name: 'gift', q: 'money', unit: '$', value: 10000 },
        r: { name: 'yearly return above inflation', q: 'ratio', unit: '%', value: 5 },
        n: { name: 'years invested', q: 'years', unit: 'yr', value: 18 }
      },
      practice: { unknowns: ['A', 'G'] },
      stories: {
        A: 'You give {G} to a newborn, invested at {r} above inflation. What is it worth in today\'s money after {n}?',
        G: 'How much must be given at birth, invested at {r} above inflation, to be worth {A} after {n}?'
      }
    }
  ],
  examples: [
    {
      title: 'How much the tax takes',
      q: 'An estate of ¤1,000,000 is taxed at 40 % above an exemption of ¤500,000. What is the tax, and what share of the estate is it?',
      steps: [
        'Taxable part: $1\\,000\\,000 - 500\\,000 = ¤500{,}000$.',
        'Tax: $0.4 \\times 500\\,000 = ¤200{,}000$.',
        'Share of the whole estate: $200\\,000/1\\,000\\,000 = 20\\,\\%$ — the headline 40 % applies only above the exemption.'
      ],
      a: '¤200,000, or 20 % of the estate.'
    },
    {
      title: 'A gift at birth',
      q: 'Grandparents give ¤10,000 at a child\'s birth, invested at 5 % a year above inflation. What is it worth at 18 and at 65? What if they gave ¤2,000 a year for 18 years instead?',
      steps: [
        'At 18: $10\\,000 \\times 1.05^{18} = ¤24{,}066$.',
        'At 65: $10\\,000 \\times 1.05^{65} = ¤238{,}399$.',
        '¤2,000 a year for 18 years: $2\\,000 \\times (1.05^{18} - 1)/0.05 = ¤56{,}265$ at 18.'
      ],
      a: '¤24,066 at 18 and ¤238,399 at 65; the yearly gifts reach ¤56,265 at 18.'
    }
  ],
  quiz: [
    { q: 'Your pension nomination still names a former spouse; your will leaves everything to your children. Who usually receives the pension?', choices: ['the children, because the will is more recent', 'the former spouse, because nominations often pass outside the will', 'the state', 'it is split equally'], a: 1,
      why: 'Many pensions and policies pay the nominated person directly, whatever the will says; keep nominations up to date.' },
    { q: 'Without a will, your estate goes to whoever you told informally.', a: false,
      why: 'Fixed legal rules (intestacy) decide; informal wishes usually carry no legal weight.' },
    { q: 'An estate of ¤800,000 is taxed at 40 % above ¤300,000. What is the tax, in ¤?', answer: 200000, unit: '$',
      why: '$0.4 \\times (800\\,000 - 300\\,000) = ¤200{,}000$.' },
    { q: 'What does a lasting power of attorney do?', choices: ['lets a person you choose act for you if you lose capacity', 'distributes your estate after death', 'reduces inheritance tax', 'creates a trust'], a: 0,
      why: 'It operates during your life; the will operates after death.' },
    { q: '¤5,000 is given at birth and invested at 5 % a year above inflation. What is it worth at 18, in today\'s money, in ¤?', answer: 12033, unit: '$',
      why: '$5\\,000 \\times 1.05^{18} = ¤12{,}033$.' }
  ],
  applications: ['Writing or updating a will after marriage, children or divorce.', 'Checking pension and insurance nominations.', 'Arranging powers of attorney for ageing parents or yourself.', 'Planning gifts to children or grandchildren.']
},

/* ================================================================ Monte Carlo */
{
  id: 'monte-carlo-planning', parent: 'wealth-building', title: 'Planning under uncertainty: Monte Carlo', level: 2,
  short: 'A Monte Carlo simulation runs a financial plan through thousands of random market futures instead of one average, and reports how often it succeeds and how wide the range of outcomes is — useful, as long as its assumptions are understood.',
  keywords: ['Monte Carlo', 'simulation', 'probability of success', 'retirement simulation', 'fan chart', 'percentiles', 'random returns', 'stochastic', 'bootstrapping', 'historical backtest', 'uncertainty'],
  prereq: ['financial-independence', 'volatility', 'sequence-risk', 'math:normal-distribution'],
  related: ['retirement-planning', 'retirement-income', 'expected-return', 'math:central-limit-theorem', 'math:probability-basics'],
  body: `
A plan built on one number for the future return is a plan for a world that will not happen. Markets deliver a sequence of good and bad years, and as [[sequence-risk]] shows, the order matters as much as the average. **Monte Carlo simulation** — named after the casino — faces this directly: instead of one future it generates thousands of possible ones and asks in how many the plan works.

### How it works
1. Choose a model of yearly returns: say normally distributed, in today's money, with an average of 5 % and a volatility of 12 % — a balanced mix, in round illustrative numbers.
2. Draw thirty random yearly returns and run the plan through them: the pot, minus the spending, grown by each year's return.
3. Record the path; repeat 1 000 or 10 000 times.
4. Summarise: the share of paths that never run out (the *probability of success*), and the spread of outcomes year by year as percentiles — the "fan".

### What it shows
Starting with ¤1,000,000 and spending a fixed amount each year, this model gives:

| Yearly withdrawal | Paths lasting 30 years |
|---:|---:|
| 3 % (¤30,000) | about 97–98 % |
| 3.5 % | about 93 % |
| 4 % | about 88 % |
| 4.5 % | about 79 % |
| 5 % | about 70 % |
| 6 % | about 47 % |

Two things stand out. First, a 4 % withdrawal that would last forever at a steady 5 % return fails in about one path in eight once returns vary — every failure caused by a bad sequence. Second, [[volatility]] itself costs success: with the same 4.5 % average, a 4 % withdrawal survives in nearly every path at 5 % volatility but in only about 70 % at 16 %.

The fan also corrects a common illusion. ¤100,000 left for 30 years in a portfolio averaging 7 % with 18 % volatility grows to ¤761,000 if it earns exactly 7 % every year. The median of 20 000 simulated paths is only about ¤493,000, one path in ten ends below ¤139,000, and one in ten above ¤1.65 million. A single projection at the average return shows the mean, which lucky paths pull up, not the typical outcome — roughly $P(1 + \\mu - \\sigma^2/2)^T$ ([[expected-return]]).

### Reading the answer wisely
- **A probability, not a prophecy.** "88 %" means that in this model 12 % of futures fall short. It depends entirely on the assumed average and volatility: at a 4 % withdrawal, one point less of average return moves the answer by about ten points.
- **Models are tamer than markets.** The normal distribution has thin tails; real returns crash more often, and years are not truly independent (inflation and valuations persist). Many planners cross-check with historical sequences (*backtests*) or by resampling actual past years (*bootstrapping*).
- **Failure is usually late and gradual.** A failed path typically runs short in its third decade, after years of warning. Real people trim spending, work part time or downsize; the model's retiree spends blindly. Plans with rules for adjusting spending show much higher success.
- **Aiming for 100 % is expensive.** Each extra point of certainty near the top costs years of work or a lower standard of living. Many planners aim for a high but not perfect probability, together with a plan for what to change if things go badly.
- **Enough runs.** With $N$ runs the estimated success rate itself has a standard error of $\\sqrt{p(1-p)/N}$: about ±1 point with 1 000 runs at 90 %, ±3 points with 100.

> [!tip] [The independence calculator](#/tools/money/retire) runs your own retirement through 1 000 random markets. The simulation below shows the fan, and how success changes with the withdrawal rate, the volatility and the length of retirement.
`,
  ideas: [
    'Monte Carlo runs a plan through thousands of random futures and reports how often it succeeds.',
    'A plan that works at the average return can fail in many paths because of bad sequences.',
    'Higher volatility lowers the probability of success even with the same average return.',
    'A single projection at the average return shows the mean outcome, above the typical (median) one.',
    'The answer is only as good as the assumed returns; real people also adapt, which models often ignore.'
  ],
  pitfalls: [
    'A 90 % success rate means a 10 % chance of destitution — Failures usually come late and slowly, and a retiree who trims spending in bad years avoids most of them.',
    'More simulations make the answer more accurate about the future — They only reduce the noise of the simulation; errors in the assumed returns remain.',
    'A plan must reach 100 % success — Near-certainty in a model costs years of extra work; flexibility and a floor of guaranteed income protect more cheaply.'
  ],
  formulas: [
    {
      name: 'Standard error of a simulated success rate',
      expr: 'SE = sqrt(p*(1 - p)/N)', tex: '\\mathrm{SE} = \\sqrt{\\frac{p\\,(1 - p)}{N}}',
      vars: {
        SE: { name: 'standard error of the success rate', q: 'ratio', unit: '%' },
        p: { name: 'success rate found', q: 'ratio', unit: '%', value: 90, min: 50, max: 100 },
        N: { name: 'number of simulated paths', int: true, value: 1000 }
      },
      note: 'Simulation noise only; it says nothing about whether the assumed returns are right.',
      practice: { unknowns: ['SE', 'N'] },
      stories: {
        SE: 'A Monte Carlo plan with {N} paths reports a success rate of {p}. How uncertain is that figure (one standard error)?',
        N: 'A plan succeeds in about {p} of paths. How many paths are needed for a standard error of {SE}?'
      }
    },
    {
      name: 'Typical (median) outcome with volatility',
      expr: 'M = P*(1 + mu - s^2/2)^T', tex: 'M = P\\left(1 + \\mu - \\frac{\\sigma^2}{2}\\right)^{T}',
      vars: {
        M: { name: 'median value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 100000 },
        mu: { name: 'average yearly return', q: 'ratio', unit: '%', value: 7 },
        s: { name: 'volatility', q: 'ratio', unit: '%', value: 18, tex: '\\sigma' },
        T: { name: 'years', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'An approximation: growth at the compound rate. Monte Carlo with these defaults gives a median of about ¤493,000.',
      practice: { unknowns: ['M'] },
      stories: {
        M: 'You invest {P} in a portfolio averaging {mu} a year with a volatility of {s}. Roughly what is the typical (median) value after {T}?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a fan',
      q: '¤100,000 is invested for 30 years in a portfolio averaging 7 % a year with 18 % volatility. Compare the steady projection with the simulated outcomes.',
      steps: [
        'Steady 7 %: $100\\,000 \\times 1.07^{30} = ¤761{,}226$.',
        'Compound rate: $7 - 18^2/200 = 5.38\\,\\%$, so the typical outcome is about $100\\,000 \\times 1.0538^{30} = ¤481{,}666$.',
        '20 000 simulated paths: median about ¤493,000; 10th percentile about ¤139,000; 90th about ¤1.65 million.'
      ],
      a: 'The typical result is about two-thirds of the steady projection, with a wide range around it.'
    },
    {
      title: 'How many runs?',
      q: 'A simulation of 1 000 paths reports 90 % success. How precise is that, and how many paths would give ±0.3 points?',
      steps: [
        '$\\sqrt{0.9 \\times 0.1/1000} = 0.0095$: about ±1 point.',
        'For 0.3 points: $N = 0.09/0.003^2 = 10\\,000$ paths.',
        'Either way, a change of one point in the assumed return matters far more.'
      ],
      a: 'About ±1 point with 1 000 paths; 10 000 paths for ±0.3.'
    }
  ],
  quiz: [
    { q: 'A Monte Carlo plan shows 85 % success. What does that mean?', choices: ['in 85 % of the simulated futures the money never ran out', 'you will have 85 % of the money you need', 'the plan runs out at age 85', 'returns will be 85 % of the expected return'], a: 0,
      why: 'It is the share of simulated paths — under the model\'s assumptions — in which the plan held.' },
    { q: 'Raising volatility while keeping the average return fixed lowers the success rate of a withdrawal plan.', a: true,
      why: 'More volatility means more bad sequences and a lower compound return.' },
    { q: 'A simulation of 400 paths finds 80 % success. What is the standard error of that estimate, in %?', answer: 2, unit: '%',
      why: '$\\sqrt{0.8 \\times 0.2/400} = \\sqrt{0.0004} = 2\\,\\%$.' },
    { q: 'Why is a projection at the average return (for example 7 % every year) misleading?', choices: ['it shows the mean path, above the typical outcome, and hides the spread and sequence risk', 'it is too pessimistic', 'it ignores fees only', 'it is not misleading'], a: 0,
      why: 'Lucky paths pull the mean up; the median grows at the lower compound rate, and the range is wide.' },
    { q: 'According to the page, which change most improves a plan\'s real-world chances?', choices: ['being willing to trim spending after bad years', 'running 100 000 simulations instead of 1 000', 'assuming a higher average return', 'drawing a longer chart'], a: 0,
      why: 'Flexibility changes what happens in bad sequences; the others only change the calculation.' }
  ],
  applications: ['Stress-testing a retirement plan before relying on it.', 'Comparing withdrawal rates, asset mixes and retirement ages.', 'Understanding the percentiles in a pension provider\'s projection.', 'Deciding how much guaranteed income to buy.'],
  history: 'Monte Carlo methods were developed in the 1940s by Stanislaw Ulam and John von Neumann for problems in physics, and named after the casino. Financial planners adopted them widely in the late 1990s and 2000s as computing became cheap.',
  sim: { id: 'pw-four-percent', params: { wr: 4 } }
}

);
