/* HYPER-FINANCES · content/protection.js — Personal Finance › Insurance and protection:
 * pooling risk, life and disability cover, home, car and liability insurance, and fraud. */
Hyper.add(

/* ================================================================ insurance basics */
{
  id: 'insurance-basics', parent: 'protection', title: 'Insurance: pooling risk', level: 2,
  short: 'Many people each pay a small, certain premium so that the few who suffer a large loss are paid from the pool. On average insurance costs more than it pays — and it is still worth buying against the losses you could not survive.',
  keywords: ['insurance', 'premium', 'deductible', 'excess', 'pooling', 'law of large numbers', 'expected loss', 'risk pooling', 'self-insurance', 'adverse selection', 'moral hazard', 'extended warranty'],
  prereq: ['math:expected-value', 'math:probability-basics', 'emergency-fund'],
  related: ['life-disability-insurance', 'property-insurance', 'diversification', 'hedging', 'loss-aversion', 'money-anxiety'],
  body: `
Every year a few homes burn, a few cars are wrecked, a few people fall seriously ill. Nobody knows who; everybody knows roughly how many. Insurance turns that knowledge into a product: many people each pay a small, certain amount, and the few who suffer a large loss are paid from the pool.

### How pooling works
Imagine 1,000 households, each with a 1 % chance a year of a ¤200,000 loss. For any one household the year ends with either nothing or catastrophe. For the pool, the [[math:expected-value|expected]] number of losses is 10, costing ¤2,000,000 — ¤2,000 per household. The actual count varies from year to year, but less and less in proportion as the pool grows: with 1,000 members its standard deviation is about 3 claims (31 % of the average); with 100,000 members about 31 claims (3.1 %). The relative uncertainty falls with the square root of the pool's size,

$$u = \\sqrt{\\frac{1 - p}{n\\,p}}$$

— the law of large numbers at work ([[math:binomial-distribution|binomial distribution]]). One household cannot pool its own risk; an insurer can.

### The price of certainty
A premium must cover the expected claims plus the insurer's costs, capital and profit: the *loading*. With a 30 % loading, the ¤2,000 expected loss becomes a ¤2,600 premium, and about 77 % of premiums return as claims. So on average **insurance loses money for the buyer**. Why buy it?

Because a unit of money is not worth the same in every situation. Losing ¤200,000 out of ¤250,000 would change a family's life; paying ¤2,600 would not. Economists often model this by valuing money through its logarithm, so each extra unit matters a little less the more you have. On that model a household with ¤250,000 would rationally pay up to about ¤3,991 a year to remove a 1 % risk of losing ¤200,000 — twice the expected loss. A household with ¤1,000,000 would pay only up to about ¤2,229, because the same loss hurts it less. And to insure a ¤500 loss with a 10 % chance, the first household would pay at most ¤50.05 — hardly above the ¤50 expected loss, leaving no room for any loading.

> [!key] Insure what would ruin you; carry yourself what would only annoy you. That one rule explains most good insurance decisions.

### Choosing the deductible
The **deductible** (the *excess* in some countries) is the part of each claim you pay yourself. A higher one lowers the premium, because the insurer stops paying for the many small claims. Say a ¤250 deductible costs ¤1,000 a year and a ¤1,000 deductible ¤850: you save ¤150 a year and risk an extra ¤750 whenever you claim. The higher deductible wins on average unless you claim more often than once in five years (150 ÷ 750 = 20 % a year) — and with an [[emergency-fund|emergency fund]] the extra ¤750 is an inconvenience, not a disaster.

### Why insurers ask so many questions
**Adverse selection**: people who know they are high risks are keener to buy, so insurers ask questions and price by risk. **Moral hazard**: insured people may take less care, so policies carry deductibles, exclusions and conditions. Answer every question truthfully; a wrong answer can void the cover exactly when you need it.

### Where insurance is poor value
- **Small, affordable losses**: extended warranties, phone insurance, cancellation cover for a cheap trip. If a ¤300 repair has a 5 % chance within the warranty period, the expected cost is ¤15; a ¤120 warranty charges eight times that.
- **Duplicate cover**: cards, employers and home policies often already include some protection.
- **Insurance mixed with investment** at high fees: compare with pure cover plus separate saving.

### A checklist for any policy
1. What exactly is covered, and what is **excluded**?
2. What are the **limits**, per claim and in total?
3. What is the **deductible**?
4. Does it pay **replacement cost** or a depreciated value ([[property-insurance]])?
5. How are claims made and paid, and what evidence is needed?
6. Is the insurer licensed and supervised where you live?
`,
  ideas: [
    'Insurance pools many independent risks, so the total becomes predictable even though each member\'s outcome is not.',
    'Premiums cover expected claims plus a loading, so on average the buyer pays more than they get back.',
    'It is still rational to insure losses that would ruin you, because money matters more when you have little of it.',
    'Small losses you can absorb are usually cheaper to carry yourself; a higher deductible does exactly that.',
    'Deductibles and exclusions exist because of adverse selection and moral hazard; honest answers keep cover valid.'
  ],
  pitfalls: [
    'Insurance is a waste because I rarely claim — The claims you hope never to make are the point; the premium buys protection against ruin, not a return.',
    'Insure everything, just in case — Covering small, affordable losses (extended warranties, gadget cover) costs several times their expected value; an emergency fund does it cheaper.',
    'A lower deductible is always safer — It costs more every year; if you have a cushion, a higher deductible usually saves money over time.'
  ],
  formulas: [
    {
      name: 'Expected loss',
      expr: 'E = p*L', tex: 'E = p\\,L',
      vars: {
        E: { name: 'expected loss a year', q: 'money', unit: '$' },
        p: { name: 'chance of the loss in a year', q: 'ratio', unit: '%', value: 1, min: 0.1, max: 20 },
        L: { name: 'size of the loss', q: 'money', unit: '$', value: 200000 }
      },
      practice: { unknowns: ['E', 'p'] },
      stories: {
        E: 'A home has a {p} chance a year of a loss of {L}. What is the expected loss a year?',
        p: 'A risk of losing {L} has an expected cost of {E} a year. What is its yearly probability?'
      }
    },
    {
      name: 'Premium with a loading and a deductible',
      expr: 'Pr = (1 + k)*p*(L - D)', tex: 'P_r = (1 + k)\\,p\\,(L - D)',
      vars: {
        Pr: { name: 'yearly premium', q: 'money', unit: '$', tex: 'P_r' },
        k: { name: 'loading for costs and profit', q: 'ratio', unit: '%', value: 30, min: 10, max: 80 },
        p: { name: 'chance of a claim in a year', q: 'ratio', unit: '%', value: 1, min: 0.1, max: 10 },
        L: { name: 'size of the loss', q: 'money', unit: '$', value: 200000 },
        D: { name: 'deductible (paid by you)', q: 'money', unit: '$', value: 1000 }
      },
      note: 'A simple model with at most one claim a year. The insurer pays $L - D$; the loading covers its costs, capital and profit.',
      practice: { unknowns: ['Pr', 'k'] },
      stories: {
        Pr: 'A loss of {L} has a {p} chance a year. The insurer adds {k} for costs and profit and you carry a deductible of {D}. What is the premium?',
        k: 'A policy costs {Pr} a year against a {p} chance of a loss of {L}, with a deductible of {D}. What loading does the premium include?'
      }
    },
    {
      name: 'Deductible break-even',
      expr: 'f = dP/(D2 - D1)', tex: 'f = \\frac{\\Delta P}{D_2 - D_1}',
      vars: {
        f: { name: 'claims a year at which both choices cost the same', q: 'ratio', unit: '%' },
        dP: { name: 'extra premium for the lower deductible', q: 'money', unit: '$', value: 150, tex: '\\Delta P' },
        D2: { name: 'higher deductible', q: 'money', unit: '$', value: 1000 },
        D1: { name: 'lower deductible', q: 'money', unit: '$', value: 250 }
      },
      note: 'If you expect to claim less often than $f$ a year, the higher deductible is cheaper on average — provided you can pay it comfortably when a claim comes.',
      practice: { unknowns: ['f', 'dP'] },
      stories: {
        f: 'Lowering your deductible from {D2} to {D1} costs {dP} a year more. How often would you need to claim for it to pay off?',
        dP: 'You expect to claim about {f} a year. Lowering your deductible from {D2} to {D1} is worth at most what extra premium a year?'
      }
    },
    {
      name: 'How predictable a pool is',
      expr: 'u = sqrt((1 - p)/(n*p))', tex: 'u = \\sqrt{\\frac{1 - p}{n\\,p}}',
      vars: {
        u: { name: 'spread of the claim count, relative to its average', q: 'ratio', unit: '%' },
        p: { name: 'chance of a claim for one member', q: 'ratio', unit: '%', value: 1, min: 0.1, max: 10 },
        n: { name: 'members in the pool', int: true, value: 1000 }
      },
      note: 'The standard deviation of the number of claims divided by its mean, for independent risks. A hundred times more members, ten times less relative uncertainty. Risks that strike many members at once (a flood, an epidemic) do not shrink this way.',
      practice: { unknowns: ['u', 'n'] },
      stories: {
        u: 'A pool of {n} members each has a {p} chance of a claim this year. How large is the typical swing in the number of claims, relative to the average?',
        n: 'Each member has a {p} chance of a claim. How many members does the pool need for the claim count to vary by only {u} of its average?'
      }
    }
  ],
  examples: [
    {
      title: 'A pool of a thousand homes',
      q: '1,000 households each face a 1 % chance a year of a ¤200,000 loss. What is the expected cost, how much does the number of claims vary, and what premium does a 30 % loading imply?',
      steps: [
        'Expected claims: $1\\,000 \\times 0.01 = 10$, costing $10 \\times 200\\,000 = ¤2{,}000{,}000$, or ¤2,000 per household.',
        'Standard deviation of the count: $\\sqrt{1\\,000 \\times 0.01 \\times 0.99} = 3.1$ claims, 31 % of the average — a bad year could bring 16 claims.',
        'Premium: $1.30 \\times 2\\,000 = ¤2{,}600$; claims return $1/1.3 = 77\\,\\%$ of premiums on average.'
      ],
      a: '¤2,000 expected per household, about 10 ± 3 claims a year, a premium near ¤2,600.'
    },
    {
      title: 'Which deductible?',
      q: 'A ¤250 deductible costs ¤1,000 a year; a ¤1,000 deductible costs ¤850. You expect to claim about once every eight years. Which is cheaper on average?',
      steps: [
        'Break-even claim frequency: $150/(1\\,000 - 250) = 0.20$ a year, one claim in five years.',
        'Once in eight years is 0.125 a year, below break-even.',
        'Expected yearly cost: low deductible $1\\,000 + 0.125 \\times 250 = ¤1{,}031$; high deductible $850 + 0.125 \\times 1\\,000 = ¤975$.'
      ],
      a: 'The ¤1,000 deductible, by about ¤56 a year on average — if you can pay ¤1,000 comfortably when it happens.'
    },
    {
      title: 'What peace of mind is worth',
      q: 'A household with ¤250,000 faces a 1 % chance of losing ¤200,000. If it values money by its logarithm, what is the most it should pay to insure fully?',
      steps: [
        'Expected value of $\\ln W$ uninsured: $0.99 \\ln 250\\,000 + 0.01 \\ln 50\\,000$.',
        'The certain wealth with the same value is $e^{0.99 \\ln 250\\,000 + 0.01 \\ln 50\\,000} = ¤246{,}009$.',
        'So it would pay up to $250\\,000 - 246\\,009 = ¤3{,}991$ a year — about twice the ¤2,000 expected loss. A 30 % loading (¤2,600) is well worth it.'
      ],
      a: 'Up to about ¤3,991 a year.'
    }
  ],
  quiz: [
    { q: 'A car has a 2 % chance a year of a ¤15,000 loss. What is the expected loss a year?', answer: 300, unit: '$',
      why: '0.02 × 15,000 = ¤300. A premium must be above this to cover the insurer\'s costs.' },
    { q: 'If insurance loses money on average, why can it still be a sound choice?', choices: ['Because insurers always pay more than they receive', 'Because a rare, huge loss hurts far more than the same amount in small, certain premiums', 'Because premiums are tax-free everywhere', 'Because you will certainly claim eventually'], a: 1,
      why: 'The value of money depends on how much you have: a loss that would ruin you is worth paying more than its expected value to avoid.' },
    { q: 'With enough members, an insurer\'s total claims become exactly predictable.', a: false,
      why: 'The relative spread shrinks with the square root of the pool but never reaches zero — and risks that strike many at once, like floods or epidemics, do not average out at all.' },
    { q: 'Lowering a deductible by ¤600 costs ¤120 a year more. Above what claim frequency does the lower deductible pay off?', answer: 20, unit: '%',
      why: '120 ÷ 600 = 0.20: more than one claim every five years.' },
    { q: 'Which risk is the best candidate to carry yourself rather than insure?', choices: ['Your home burning down', 'A cracked phone screen', 'Injuring someone in a road accident', 'Being unable to work for years'], a: 1,
      why: 'A phone screen is a small, affordable loss — insuring it costs several times its expected value. The others could be ruinous.' }
  ],
  applications: ['Deciding which policies you really need.', 'Choosing a deductible that fits your emergency fund.', 'Saying no to extended warranties with confidence.', 'Reading a policy for exclusions and limits before signing.'],
  history: 'Merchants in Mediterranean ports were insuring ships and cargoes by the fourteenth century. Fire insurance spread after the Great Fire of London in 1666, and life insurance priced from mortality tables grew in the eighteenth century, when mathematicians showed how predictable large numbers of uncertain lives could be.',
  sim: 'pf-insurance'
},

/* ================================================================ life and disability */
{
  id: 'life-disability-insurance', parent: 'protection', title: 'Life and disability insurance', level: 2,
  short: 'Your ability to earn is usually your largest asset. Life insurance protects the people who depend on it if you die; disability insurance protects you and them if illness or injury stops you working.',
  keywords: ['life insurance', 'term life', 'whole life', 'disability insurance', 'income protection', 'human capital', 'critical illness', 'waiting period', 'beneficiary', 'mortgage life insurance'],
  prereq: ['insurance-basics', 'present-value', 'emergency-fund'],
  related: ['estate-planning', 'retirement-planning', 'annuities', 'pensions', 'net-worth', 'financial-goals'],
  body: `
For most working people the largest asset is not a house or a pension. It is the ability to earn over the coming decades, sometimes called **human capital**. A 30-year-old earning ¤45,000 a year after tax for 35 more years has, discounted at 3 % a year, about ¤966,925 of future earnings in [[present-value|present value]] — an asset no [[net-worth|balance sheet]] records. Life and disability insurance protect it: life insurance for the people who depend on it if you die, disability insurance for you and them if you cannot work.

### Who needs life insurance
Life insurance pays a sum when the insured person dies. It matters when someone depends on your income or your unpaid work: a partner, children, a relative you support, someone who shares a mortgage with you. A single person with no dependants usually needs little or none. A parent of young children may need a lot — including cover for a parent who stays at home, whose care work would cost money to replace.

### How much
Add up what the money would have to do:
- clear the debts, for example a ¤240,000 mortgage;
- replace income for as long as it is needed: ¤30,000 a year for 20 years is worth about ¤446,324 today at 3 %;
- fund particular goals, such as ¤40,000 for education;
- subtract what exists already: savings, survivors' pensions, cover through an employer — say ¤60,000.

The total here is about ¤666,324. A popular rule of thumb, "ten times income", would give ¤450,000 on a ¤45,000 income: a starting point, not a substitute for the sum.

### Term or permanent?
- **Term insurance** covers a fixed period — until the children are grown, or the mortgage is repaid — and pays only if you die within it. It is pure insurance, and usually the cheapest way to buy a large sum.
- **Permanent** policies (whole-of-life and similar) last for life and build a cash value, mixing insurance with saving. For the same cover they cost far more and often carry high fees. They can fit particular needs, such as [[estate-planning|estate planning]], but compare them honestly with term cover plus separate investing.
- **Decreasing term** follows a repayment mortgage down. Some lenders require it; it can often be bought from any insurer, not only the lender's partner.

### Disability and income protection
For people of working age, a long spell unable to work through illness or injury is considerably more likely than dying before retirement — and financially it can be harder, because the costs of living go on. **Disability** or **income-protection** insurance replaces part of your income, often around half to two thirds, while you cannot work. What to look at:
- **Definition of disability**: unable to do *your own* occupation, or *any* job you could reasonably do? Own-occupation cover pays in more cases and costs more.
- **Waiting period**: benefits start after, say, one, three or six months. A longer wait lowers the premium; your [[emergency-fund|emergency fund]] bridges the gap.
- **Benefit period**: two years, five years, or up to retirement age. The long ones protect against the truly ruinous case.
- **What you already have**: sick pay, public disability benefits and group cover through employers differ hugely between countries. Find out before buying more.

With a gross income of ¤4,000 a month, a 60 % benefit pays ¤2,400. If essentials cost ¤2,600, there is still a ¤200 gap each month, plus the waiting period, for the household budget and the fund to carry.

**Critical-illness** policies pay a lump sum on diagnosis of listed conditions. They can help with the costs of a serious illness, but read the list and its definitions closely.

### Questions to ask
1. Who would struggle, and for how long, if my income stopped?
2. What do the state, my employer and my existing policies already provide?
3. Until when do I need cover?
4. Is the premium fixed, or does it rise with age?
5. Have I answered every health question truthfully? Non-disclosure can void a claim.
6. Are the beneficiaries named, and up to date after marriage, divorce or a birth?
`,
  ideas: [
    'Future earnings — human capital — are most working people\'s largest asset.',
    'Life insurance matters when others depend on your income or unpaid work; without dependants it is rarely needed.',
    'The amount of cover is the sum of debts, income to replace and goals, minus existing resources.',
    'Term insurance is pure, time-limited cover and usually far cheaper than permanent policies for the same sum.',
    'Disability cover protects against the more likely risk of years without earnings; its definitions, waiting and benefit periods decide its value.'
  ],
  pitfalls: [
    'Young, single people need large life policies — Without dependants there is usually no one to protect; disability cover is often the more important question.',
    'Permanent life insurance beats term because it always pays out — The certainty is paid for in much higher premiums and fees; compare with term cover plus separate saving.',
    'The state or my employer will look after me if I cannot work — Sometimes, partly, for a while. Find out exactly what you would receive before relying on it.'
  ],
  formulas: [
    {
      name: 'Human capital: the present value of future earnings',
      expr: 'H = Y*(1 - (1 + r)^(-T))/r', tex: 'H = Y\\,\\frac{1 - (1 + r)^{-T}}{r}',
      vars: {
        H: { name: 'present value of future earnings', q: 'money', unit: '$' },
        Y: { name: 'yearly earnings after tax', q: 'money', unit: '$', value: 45000 },
        r: { name: 'real discount rate', q: 'ratio', unit: '%', value: 3, min: 0.5, max: 6 },
        T: { name: 'working years left', q: 'years', unit: 'yr', value: 35 }
      },
      note: 'Earnings held level in today\'s money; a rising career makes the value larger.',
      practice: { unknowns: ['H', 'Y'] },
      stories: {
        H: 'You earn {Y} a year after tax and expect to work {T} more. Discounting at {r}, what are your future earnings worth today?',
        Y: 'Your future earnings over {T} are worth {H} today, discounting at {r}. What yearly income does that mean?'
      }
    },
    {
      name: 'Life cover from needs',
      expr: 'C = D + Y*(1 - (1 + r)^(-T))/r + G - A', tex: 'C = D + Y\\,\\frac{1 - (1 + r)^{-T}}{r} + G - A',
      vars: {
        C: { name: 'life cover needed', q: 'money', unit: '$' },
        D: { name: 'debts to clear', q: 'money', unit: '$', value: 240000 },
        Y: { name: 'income to replace each year', q: 'money', unit: '$', value: 30000 },
        r: { name: 'return on the payout, after inflation', q: 'ratio', unit: '%', value: 3, min: 0.5, max: 6 },
        T: { name: 'years of income to replace', q: 'years', unit: 'yr', value: 20 },
        G: { name: 'other goals to fund', q: 'money', unit: '$', value: 40000 },
        A: { name: 'resources already in place', q: 'money', unit: '$', value: 60000 }
      },
      practice: { unknowns: ['C', 'Y'] },
      stories: {
        C: 'If you died, your family would need to clear {D} of debts, receive {Y} a year for {T}, and fund {G} of goals; {A} is already in place. Earning {r} on the payout, how much life cover is needed?',
        Y: 'A policy of {C} would clear {D} of debts and fund {G} of goals, with {A} already in place. At {r}, what yearly income could it replace for {T}?'
      }
    },
    {
      name: 'The monthly gap when disabled',
      expr: 'g = E - b*I', tex: 'g = E - b\\,I',
      vars: {
        g: { name: 'monthly shortfall', q: 'money', unit: '$', signed: true },
        E: { name: 'essential spending a month', q: 'money', unit: '$', value: 2600 },
        b: { name: 'benefit, as a share of income', q: 'ratio', unit: '%', value: 60, min: 40, max: 80 },
        I: { name: 'gross monthly income', q: 'money', unit: '$', value: 4000 }
      },
      note: 'A negative result means the benefit covers the essentials. Add the waiting period, when nothing is paid.',
      practice: { unknowns: ['g', 'b'] },
      stories: {
        g: 'You earn {I} a month and your income-protection policy pays {b} of it. Your essentials cost {E} a month. What is the monthly gap?',
        b: 'Your essentials cost {E} a month on an income of {I}. What benefit share would leave a gap of {g}?'
      }
    }
  ],
  examples: [
    {
      title: 'The value of a career',
      q: 'A 30-year-old earns ¤45,000 a year after tax and expects to work 35 more years. What are those earnings worth today, at a 3 % real discount rate?',
      steps: [
        '$(1.03)^{-35} = 0.3554$.',
        '$H = 45\\,000 \\times (1 - 0.3554)/0.03 = ¤966{,}925$.',
        'Almost a million in present value — more than most people\'s home and pension combined at that age, and entirely unprotected unless insured.'
      ],
      a: 'About ¤966,925.'
    },
    {
      title: 'Sizing life cover',
      q: 'A parent wants the family to be able to clear a ¤240,000 mortgage, receive ¤30,000 a year for 20 years and have ¤40,000 for education. Savings and employer cover already amount to ¤60,000. With the payout earning 3 % after inflation, how much cover is needed?',
      steps: [
        'Income for 20 years: $30\\,000 \\times (1 - 1.03^{-20})/0.03 = ¤446{,}324$.',
        'Total: $240\\,000 + 446\\,324 + 40\\,000 - 60\\,000 = ¤666{,}324$.',
        'Term cover lasting until the youngest child is independent matches the need, which shrinks as the mortgage is repaid and the years of income to replace fall.'
      ],
      a: 'About ¤666,324 of cover.'
    }
  ],
  quiz: [
    { q: 'Who most needs life insurance?', choices: ['A single person with no dependants', 'A parent of young children whose income pays the mortgage', 'A retiree with a pension that continues to a surviving partner and no debts', 'A student'], a: 1,
      why: 'Life insurance protects people who depend on you. The parent\'s death would leave a mortgage and years of lost income.' },
    { q: 'Ignoring interest: debts ¤100,000, plus ¤20,000 a year of income for 10 years, minus ¤50,000 of savings. How much cover?', answer: 250000, unit: '$',
      why: '100,000 + 10 × 20,000 − 50,000 = ¤250,000. With interest on the payout, a little less would do.' },
    { q: 'Permanent life insurance is always better value than term insurance, because it pays out eventually.', a: false,
      why: 'The certain payout is paid for in much higher premiums and fees. Many people are better served by term cover for the years of need plus separate saving.' },
    { q: 'You choose an income-protection policy with a six-month waiting period to lower the premium. What covers the first six months?', choices: ['The insurer, backdated', 'Your emergency fund, sick pay and any public benefits', 'Your credit card', 'Nothing is needed'], a: 1,
      why: 'Nothing is paid during the waiting period. A longer wait is cheaper only if you can carry those months yourself.' },
    { q: 'Which definition of disability pays out in more situations?', choices: ['Unable to do any occupation', 'Unable to do your own occupation', 'Both are identical', 'Neither: disability policies pay only on death'], a: 1,
      why: 'Own-occupation cover pays if you cannot do your own job, even if you could do another; any-occupation cover pays only if you can do no reasonable job at all.' }
  ],
  applications: ['Deciding whether you need life insurance at all, and how much.', 'Checking what your employer and the state would pay if you could not work.', 'Choosing a waiting period that fits your emergency fund.', 'Keeping beneficiaries up to date.']
},

/* ================================================================ property insurance */
{
  id: 'property-insurance', parent: 'protection', title: 'Home, car and liability insurance', level: 1,
  short: 'Insurance for the things you own and the harm you might cause: buildings and contents, cars, and personal liability. What matters is the right sum insured, what is excluded, and how claims are valued.',
  keywords: ['home insurance', 'buildings insurance', 'contents insurance', 'renters insurance', 'car insurance', 'third-party liability', 'comprehensive', 'liability insurance', 'umbrella policy', 'underinsurance', 'average clause', 'no-claims discount', 'replacement cost', 'flood insurance'],
  prereq: ['insurance-basics', 'net-worth'],
  related: ['mortgage-costs', 'car-finance', 'emergency-fund', 'mortgage-basics', 'scams-fraud'],
  body: `
A house fire, a burst pipe, a car crash, a guest who slips on your stairs: rare, sudden and expensive — exactly the kind of risk that [[insurance-basics|insurance]] is built for.

### Home insurance: two different things
- **Buildings** insurance covers the structure: walls, roof, fitted kitchen, pipes. The sum insured should be the cost to **rebuild**, which can differ a lot from the market price — a fire does not destroy the land, and building costs rise and fall on their own. Mortgage lenders almost always require it ([[mortgage-costs]]).
- **Contents** insurance covers what you own inside: furniture, clothes, electronics. It is the one renters need.

Many policies bundle both, plus **liability** for damage or injury you cause to others.

### The trap of underinsurance
If the sum insured is below the true value, many policies pay only the same fraction of every claim — the **average** (or **coinsurance**) clause. A home that would cost ¤300,000 to rebuild but is insured for ¤225,000 — 75 % — receives 75 % of a ¤40,000 claim: ¤30,000. In the US, many home policies set a minimum, often 80 % of the replacement cost, below which claims are reduced. Review the sum after renovations, and after years of rising building costs.

### New for old, or what it was worth
**Replacement-cost** (new-for-old) cover pays what it costs to replace an item today. **Actual cash value** pays its depreciated worth: a television bought four years ago for ¤1,200, losing 20 % of its value a year, is valued at ¤491.52 — not enough for a new one. Replacement cover costs more and pays far more.

### Car insurance
Almost everywhere, insurance against the injury and damage you cause others — **third-party liability** — is compulsory. On top of it you can add cover for fire and theft, and **comprehensive** cover that also pays for damage to your own car. For an old car worth little, comprehensive cover can cost more over a few years than the car is worth; for a new car on finance the lender usually requires it ([[car-finance]]).

Many insurers reward years without claims with a **no-claims discount**. Before claiming for a small repair, compare the claim with what you would lose: if a ¤600 claim removed a 30 % discount on an ¤800 premium for three years, it would cost about ¤720 in higher premiums — more than the repair.

### Liability: a small premium for the largest risk
The rarest claims are the most dangerous: a cyclist you hit, a visitor injured in your home, water from your flat ruining the one below. Such claims can exceed everything you own. Personal liability cover — often included in home or renters' policies, and sometimes sold as an extra "umbrella" layer — is usually inexpensive for the size of the risk it removes.

### Natural disasters
Floods, earthquakes and storms are often excluded or limited in standard policies, and sometimes covered by separate or government-backed schemes; several countries run national flood or catastrophe pools. Check what applies where you live, especially near rivers, coasts and fault lines.

### Keeping your cover useful
- Photograph or film your home and belongings once a year; keep receipts for valuable items.
- Tell the insurer about changes: renovations, a home business, a lodger, a new driver.
- Compare at renewal. In some markets loyal customers were long charged more than new ones, and some regulators have banned the practice.
- Read the exclusions before you need them.
- After a loss: make things safe, document everything, report quickly, keep damaged items until the insurer has seen them, and ask for decisions in writing.

> [!tip] Beware of anyone who contacts you after a disaster offering to "handle your claim" for a large share of the payout, or asking for payment up front to start repairs. Check them as you would any stranger ([[scams-fraud]]).
`,
  ideas: [
    'Buildings cover should match the cost to rebuild, not the market price; contents cover protects belongings, for owners and renters alike.',
    'Underinsuring can reduce every claim in proportion (the average or coinsurance clause).',
    'Replacement-cost cover pays for new items; actual cash value pays their depreciated worth.',
    'Third-party liability is compulsory for cars almost everywhere; personal liability cover protects against the rare, ruinous claim.',
    'Small claims can cost more in lost no-claims discount than they pay.'
  ],
  pitfalls: [
    'Insure the house for its market price — Rebuild cost is what matters; the land is not destroyed, and building costs can be higher or lower than the price suggests.',
    'Contents insurance is only for homeowners — Renters own belongings too, and often need the liability cover that comes with it.',
    'Always claim for any damage, since you have paid premiums — A small claim may cost more in lost discounts over the next years than it pays now.'
  ],
  formulas: [
    {
      name: 'Claim paid under an average clause',
      expr: 'C = L*S/V', tex: 'C = L\\,\\frac{S}{V}',
      vars: {
        C: { name: 'claim paid', q: 'money', unit: '$' },
        L: { name: 'size of the loss', q: 'money', unit: '$', value: 40000 },
        S: { name: 'sum insured', q: 'money', unit: '$', value: 225000 },
        V: { name: 'full rebuild or replacement value', q: 'money', unit: '$', value: 300000 }
      },
      note: 'Applies when $S < V$; fully insured, the claim is paid in full up to the policy limits (less any deductible).',
      practice: { unknowns: ['C', 'S'] },
      stories: {
        C: 'Your home would cost {V} to rebuild but is insured for {S}. A fire causes {L} of damage. How much does the insurer pay?',
        S: 'A loss of {L} was paid at only {C} because the home, worth {V} to rebuild, was underinsured. What was the sum insured?'
      }
    },
    {
      name: 'Actual cash value of an item',
      expr: 'A = R*(1 - d)^t', tex: 'A = R\\,(1 - d)^{t}',
      vars: {
        A: { name: 'depreciated value', q: 'money', unit: '$' },
        R: { name: 'price when new', q: 'money', unit: '$', value: 1200 },
        d: { name: 'loss of value a year', q: 'ratio', unit: '%', value: 20, min: 5, max: 40 },
        t: { name: 'age', q: 'years', unit: 'yr', value: 4 }
      },
      practice: { unknowns: ['A', 'd'] },
      stories: {
        A: 'A television cost {R} and loses {d} of its value each year. Under an actual-cash-value policy, what is it worth after {t}?',
        d: 'A sofa bought for {R} is valued at {A} after {t}. What share of its value did it lose each year?'
      }
    },
    {
      name: 'Cost of losing a no-claims discount',
      expr: 'K = P*f*n', tex: 'K = P\\,f\\,n',
      vars: {
        K: { name: 'extra premiums paid', q: 'money', unit: '$' },
        P: { name: 'full premium a year (before the discount)', q: 'money', unit: '$', value: 800 },
        f: { name: 'discount lost', q: 'ratio', unit: '%', value: 30, min: 10, max: 60 },
        n: { name: 'years the discount stays lost', int: true, value: 3 }
      },
      note: 'A rough guide: real discounts are usually rebuilt step by step. Compare the result with the claim before claiming for small damage.',
      practice: { unknowns: ['K'] },
      stories: {
        K: 'Your premium is {P} before a no-claims discount of {f}. A claim would remove the discount for {n} years. What would that cost?'
      }
    }
  ],
  examples: [
    {
      title: 'Underinsured',
      q: 'A home that would cost ¤300,000 to rebuild is insured for ¤225,000. A kitchen fire does ¤40,000 of damage. What does an average clause pay?',
      steps: [
        'Share insured: $225\\,000/300\\,000 = 75\\,\\%$.',
        'Paid: $0.75 \\times 40\\,000 = ¤30{,}000$; the owner carries ¤10,000 (plus any deductible).',
        'Raising the sum insured to ¤300,000 would have cost a somewhat higher premium — and paid the whole ¤40,000.'
      ],
      a: '¤30,000 of the ¤40,000.'
    },
    {
      title: 'To claim or not',
      q: 'A car scrape costs ¤600 to repair. Your premium is ¤800 before a 30 % no-claims discount, which a claim would remove for about three years. Should you claim?',
      steps: [
        'Lost discount: $800 \\times 0.30 = ¤240$ a year.',
        'Over three years: $3 \\times 240 = ¤720$.',
        'The claim would pay ¤600 (less any deductible) and cost about ¤720: paying the repair yourself, from the emergency fund, is cheaper.'
      ],
      a: 'Pay it yourself: the claim would cost about ¤720 in premiums to recover ¤600.'
    }
  ],
  quiz: [
    { q: 'A home worth ¤250,000 to rebuild is insured for ¤200,000 (80 %). A storm causes ¤10,000 of damage. Under an average clause, what is paid?', answer: 8000, unit: '$',
      why: 'The claim is scaled by 200,000 ÷ 250,000 = 0.8: 0.8 × 10,000 = ¤8,000.' },
    { q: 'The sum insured on buildings cover should be…', choices: ['the price you paid for the home', 'the current market price', 'the cost to rebuild it', 'the mortgage balance'], a: 2,
      why: 'The insurer pays to repair or rebuild; the land survives a fire. Market price and mortgage balance measure different things.' },
    { q: 'Renters do not need contents insurance, because the landlord insures the building.', a: false,
      why: 'The landlord\'s policy covers the structure, not the tenant\'s belongings or the tenant\'s liability to others.' },
    { q: 'Which cover protects against the rarest but largest financial risk for most households?', choices: ['Phone insurance', 'Personal liability cover', 'Extended warranty on a washing machine', 'Travel cancellation for a weekend trip'], a: 1,
      why: 'A serious injury you cause someone can lead to claims larger than everything you own; liability cover is usually cheap for that protection.' },
    { q: 'A laptop bought three years ago for ¤1,000 loses 25 % of its value a year. What is its actual cash value?', answer: 421.88, unit: '$',
      why: '1,000 × 0.75³ = ¤421.88. A replacement-cost policy would instead pay for a comparable new laptop.' }
  ],
  applications: ['Setting the right sum insured on a home.', 'Deciding whether an old car needs comprehensive cover.', 'Deciding whether to claim for small damage.', 'Checking flood and liability cover before you need them.'],
  sim: { id: 'pf-insurance', params: { preset: 'home' } }
},

/* ================================================================ scams and fraud */
{
  id: 'scams-fraud', parent: 'protection', title: 'Scams and financial fraud', level: 1,
  short: 'Fraud works on feelings, not on ignorance: urgency, fear, trust and the hope of easy gains. Knowing the patterns — and above all the signature of investment fraud, high returns with no risk — is the best protection.',
  keywords: ['scam', 'fraud', 'Ponzi scheme', 'pyramid scheme', 'phishing', 'impersonation', 'safe account', 'romance scam', 'investment scam', 'crypto scam', 'identity theft', 'advance-fee fraud', 'recovery scam', 'guaranteed returns'],
  prereq: ['risk-and-return', 'compound-interest'],
  related: ['cognitive-biases', 'bank-accounts', 'payments', 'credit-scores', 'bubbles', 'high-cost-credit', 'money-anxiety'],
  body: `
Fraud is not a test of intelligence. Scammers are professionals who study how people decide under pressure, and they catch doctors, engineers and bank managers as easily as anyone else. What protects people is not being clever but knowing the patterns — and having a rule, decided in advance, for what to do when one appears.

### The signature of investment fraud
Genuine investments trade **risk for return**: higher expected returns come with bigger swings and a real chance of loss ([[risk-and-return]]). Fraud offers the impossible combination: **high returns, no risk, and steady payments every month**.

Look at what such promises imply. 10 % a month compounds to about 214 % a year. ¤1,000 would become ¤304,482 in five years and a million in about six. If anyone could really do that, they would not need your money.

### How a Ponzi scheme works — and why it must collapse
A **Ponzi scheme** pays "returns" to earlier investors out of the money of newer ones. Nothing is really invested, or too little to matter. Early investors, paid on time, become its most convincing salespeople. But the promised balances [[compound-interest|compound]], and new money cannot grow for ever: the scheme needs ever larger inflows just to meet withdrawals. When new money slows — a market fall, a rumour, a wave of withdrawals — the cash runs out, and statements showing handsome balances turn out to be fiction. The simulation shows the arithmetic.

**Pyramid schemes**, and recruitment-driven "opportunities" that make money mainly from new members, follow the same [[math:exponential-growth-decay|exponential]] logic. If each member must recruit six, the thirteenth level would need more than 13 billion people — more than live on Earth. Most participants must lose.

### The common scams
- **Impersonation**: a call, text or email "from your bank", the tax office, the police or a delivery firm. It asks you to confirm details, install an app, read out a code, or move money to a "safe account". No genuine bank ever asks you to move money to protect it.
- **Investment and crypto scams**: slick platforms showing growing balances that you cannot withdraw; "guaranteed" trading robots; fake celebrity endorsements.
- **Romance and friendship scams**: an online relationship that, after weeks of trust, develops an emergency or an investment tip.
- **Advance-fee fraud**: a prize, an inheritance, a loan or a job that needs a fee first.
- **Payment redirection**: a builder, supplier or lawyer "changes bank details" by email just before a large payment.
- **Identity theft**: your details used to open accounts or take loans in your name; watch your [[credit-scores|credit report]].
- **Recovery scams**: after a loss, someone offers — for a fee — to get your money back. They target people who have already been defrauded.

### Warning signs
- Pressure to act **now**: a deadline, a secret, "don't tell your bank".
- Returns that are **high and guaranteed**, or suspiciously smooth.
- Payment by **transfer, crypto, gift cards or cash** — methods that are hard to reverse.
- A request to **move money to keep it safe**, or to share a code sent to your phone.
- **Unsolicited contact**, and a firm you cannot find on your financial regulator's official register.
- A request to **keep it from family** or to mislead your bank about the payment's purpose.

> [!warn] Stop. Hang up. Check independently: call your bank on the number printed on your card, look the firm up on the regulator's official register, talk to someone you trust. A genuine offer will still be there tomorrow; a scam needs you to act today.

### If it has happened
1. Contact your bank at once, on a number you know is genuine. Fast action sometimes stops or recovers a payment.
2. Change passwords, turn on two-step verification, and tell the provider of any account involved.
3. Report it to the police and to your country's fraud reporting service or financial regulator.
4. Where available, place a fraud alert or a freeze on your credit file.
5. Expect recovery scams, and never pay to get money back.
6. Be kind to yourself. Shame keeps victims silent, and silence protects the fraudster. Telling others protects them too.
`,
  ideas: [
    'Fraud exploits emotions — urgency, fear, trust, hope — not a lack of intelligence.',
    'High returns with no risk and smooth payments is the signature of investment fraud.',
    'A Ponzi scheme pays old investors with new money and must collapse when inflows slow; pyramids need impossibly many recruits.',
    'Genuine banks never ask you to move money to a "safe account" or to share a security code.',
    'Stop, hang up and check independently; if it has happened, call your bank at once and report it.'
  ],
  pitfalls: [
    'Only naive people fall for scams — Professionals target everyone, using pressure and trust; the protection is a rule, not intelligence.',
    'It has paid me on time for two years, so it is genuine — Ponzi schemes pay early investors faithfully; that is how they recruit. Payments prove nothing about the source.',
    'A firm with a professional website and a registered company name is licensed — Anyone can build a website or register a company; check the financial regulator\'s official register.'
  ],
  formulas: [
    {
      name: 'A monthly promise, expressed per year',
      expr: 'ra = (1 + m)^12 - 1', tex: 'r_{\\text{year}} = (1 + m)^{12} - 1',
      vars: {
        ra: { name: 'equivalent yearly return', q: 'ratio', unit: '%', tex: 'r_{\\text{year}}' },
        m: { name: 'promised return a month', q: 'ratio', unit: '%', value: 10, min: 0.5, max: 15 }
      },
      note: 'Compare the answer with what diversified investments have returned over long periods: a few per cent a year after inflation, with ups and downs.',
      stories: {
        ra: 'An "investment club" promises {m} a month, every month. What yearly return does that imply?',
        m: 'A scheme claims {ra} a year, paid out monthly. What monthly return is that?'
      }
    },
    {
      name: 'What a promised return would grow to',
      expr: 'A = P*(1 + m)^(12*T)', tex: 'A = P\\,(1 + m)^{12T}',
      vars: {
        A: { name: 'promised value at the end', q: 'money', unit: '$' },
        P: { name: 'amount invested', q: 'money', unit: '$', value: 1000 },
        m: { name: 'promised return a month', q: 'ratio', unit: '%', value: 10, min: 0.5, max: 15 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 5 }
      },
      practice: { unknowns: ['A', 'T'] },
      stories: {
        A: 'A platform promises {m} a month. If it were true, what would {P} become after {T}?',
        T: 'A platform promises {m} a month. How long would it take {P} to become {A}?'
      }
    },
    {
      name: 'Recruits needed at one level of a pyramid',
      expr: 'N = k^L', tex: 'N = k^{L}',
      vars: {
        N: { name: 'people needed at that level', int: true },
        k: { name: 'recruits each member must bring in', int: true, value: 6 },
        L: { name: 'level of the pyramid', int: true, value: 13 }
      },
      note: 'Starting from one person at the top. Compare with the world\'s population of about eight billion.',
      practice: { unknowns: ['N', 'L'] },
      stories: {
        N: 'In a recruitment scheme each member must sign up {k} new members. How many people are needed at level {L}?',
        L: 'Each member must recruit {k}. At which level would the scheme need {N} people?'
      }
    }
  ],
  examples: [
    {
      title: 'What "10 % a month" really claims',
      q: 'A platform promises 10 % a month. What yearly return is that, and what would ¤1,000 become in five years?',
      steps: [
        'Per year: $1.1^{12} - 1 = 2.138$, or about 214 %.',
        'Five years is 60 months: $1\\,000 \\times 1.1^{60} = ¤304{,}482$.',
        'To reach a million: $\\ln 1\\,000/\\ln 1.1 = 72.5$ months — about six years. Nothing legitimate does this; the promise itself is the proof.'
      ],
      a: 'About 214 % a year; ¤304,482 after five years — an impossibility, and so a warning.'
    },
    {
      title: 'The arithmetic of a pyramid',
      q: 'Each member must recruit six others. How many people are needed at the twelfth and thirteenth levels?',
      steps: [
        'Level 12: $6^{12} = 2\\,176\\,782\\,336$ — over two billion.',
        'Level 13: $6^{13} = 13\\,060\\,694\\,016$ — more than the population of the Earth.',
        'Long before that, recruitment stalls; everyone who joined in the last levels — most members — loses.'
      ],
      a: 'About 2.2 billion and 13.1 billion: the scheme must fail, and most members lose.'
    }
  ],
  quiz: [
    { q: 'A scheme promises 2 % a month, guaranteed. What yearly return does that imply?', answer: 26.82, unit: '%',
      why: '1.02^12 − 1 = 0.2682. A guaranteed 27 % a year with no risk is far beyond what any honest investment can promise.' },
    { q: 'Which is the strongest single warning sign of investment fraud?', choices: ['A company with a website', 'High returns described as guaranteed and risk-free', 'Fees stated in the documents', 'Returns that go up and down'], a: 1,
      why: 'Real investments that aim high carry risk. Guaranteed high returns, especially smooth ones, are the signature of fraud.' },
    { q: 'A scheme that has paid you on time for two years is proven to be genuine.', a: false,
      why: 'Ponzi schemes pay early investors reliably, from newer investors\' money; that is how they grow. Payments prove nothing about where the money comes from.' },
    { q: '"Your bank" calls: your account is under attack and you must move your savings to a safe account now. What do you do?', choices: ['Move the money quickly', 'Read them the code they sent to confirm', 'Hang up and call the bank on the number printed on your card', 'Move half, to be safe'], a: 2,
      why: 'No genuine bank asks you to move money to protect it. Ending the call and using a number you know is genuine breaks the scam.' },
    { q: 'After losing money in a crypto scam, you are contacted by a firm that can recover it for an up-front fee. This is most likely…', choices: ['a law firm doing its job', 'a recovery scam targeting you again', 'the regulator', 'your bank\'s fraud team'], a: 1,
      why: 'Recovery scams deliberately target known victims. Genuine help from banks, police and regulators does not require fees paid up front.' }
  ],
  applications: ['Recognising an impersonation call or message in seconds.', 'Checking an investment firm before sending money.', 'Protecting older relatives who are frequent targets.', 'Acting fast, and calmly, if something has happened.'],
  history: 'The scheme is named after Charles Ponzi, who in Boston in 1920 promised investors 50 % in 45 days, supposedly from trading international postal reply coupons, and paid early investors with later investors\' money until it collapsed within the year. The pattern is older than him and keeps returning; the largest known case collapsed in 2008, after decades of reporting implausibly steady returns.',
  sim: 'pf-ponzi'
}

);
