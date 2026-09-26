/* HYPER-FINANCES · content/mortgages.js — the Mortgages topic: how a mortgage works, the deposit
 * and loan-to-value, fixed, variable and inflation-linked rates, mixing tracks, affordability and
 * the costs beyond the rate. Every number in the text was computed with Hyper.finance.
 * Simulations: sims/mortgages.js (mg-*) and ref-amortization from sims/reference.js. */
Hyper.add(

/* ================================================================ how a mortgage works */
{
  id: 'mortgage-basics', parent: 'mortgages', title: 'How a mortgage works', level: 1,
  short: 'A mortgage is a long loan to buy a home, secured on the home itself: if the payments stop, the lender can sell it to recover the debt. That security is why the rate is lower than on other loans — and why the stakes are higher.',
  keywords: ['mortgage', 'home loan', 'housing loan', 'secured loan', 'collateral', 'lien', 'charge', 'foreclosure', 'repossession', 'equity', 'term', 'recourse', 'first-time buyer'],
  prereq: ['how-loans-work', 'amortization', 'compound-interest'],
  related: ['down-payment-ltv', 'fixed-rate-mortgages', 'variable-rate-mortgages', 'mortgage-affordability', 'mortgage-costs', 'rent-vs-buy', 'early-repayment', 'refinancing', 'money-anxiety'],
  body: `
Maya and Daniel have found a flat for ¤400,000. They have saved ¤80,000, so they need to borrow ¤320,000 — far more than anyone would lend two people on a promise alone. A mortgage makes it possible by tying the loan to the flat itself.

### What the lender holds
A mortgage is a loan **secured** on a property. The lender registers a charge (a lien) on the home: you own it, live in it and may sell it, but the debt is repaid from the sale before you keep anything. If the payments stop for long enough, the lender can take the home and sell it — *repossession* in British English, *foreclosure* in American. That security is why a mortgage is usually the cheapest credit a household is ever offered, and why it deserves more care than any other loan.

> [!key] The rate is low because the lender's risk is low. Your risk is the mirror image: the home is what you stand to lose.

### The five dials of every mortgage
- **The amount**: the price minus your [[down-payment-ltv|deposit]].
- **The rate**: [[fixed-rate-mortgages|fixed]] for the whole term or for a few years, [[variable-rate-mortgages|variable]] with a benchmark, or [[index-linked-mortgages|linked to inflation]] — and in some countries [[mortgage-mix|split into tracks]] of different kinds.
- **The term**: usually 20 to 30 years, sometimes 35 or more.
- **The repayment method**: [[amortization|level payments]] almost everywhere, [[equal-principal|equal capital]] in some countries, [[balloon-interest-only|interest-only]] for some investors.
- **The costs**: fees, valuations, insurance and taxes, which change the true price of the deal ([[mortgage-costs]]).

### Maya and Daniel's numbers
At 5 % over 30 years the payment is ¤1,717.83 a month. In the first month ¤1,333.33 of it is interest and only ¤384.50 repays the loan. Over the whole term they would pay ¤618,419: the ¤320,000 borrowed and ¤298,419 of interest.

After five years they will still owe ¤293,852 — they will have repaid ¤26,148. If the flat has risen 2 % a year meanwhile, it is worth ¤441,632 and their **equity**, the part of the home that is really theirs, is ¤147,780. Most of it came from the deposit and the rise in price, not from repayments.

The term and the rate move the payment in different ways:

| ¤320,000 at 5 % | Payment | Total interest |
|---|---:|---:|
| 20 years | ¤2,111.86 | ¤186,846 |
| 25 years | ¤1,870.69 | ¤241,206 |
| 30 years | ¤1,717.83 | ¤298,419 |
| 35 years | ¤1,615.00 | ¤358,300 |

Over 30 years the same loan costs ¤1,349.13 a month at 3 %, ¤1,717.83 at 5 % and ¤2,128.97 at 7 %. Two points on the rate move the payment by about a quarter — which is why the kind of rate matters so much.

### If you cannot pay
A missed payment is not the end. Lenders usually prefer to agree a plan — a payment holiday, a longer term, interest-only for a while — because repossession is slow and costly for them too. Talk to them early: the options narrow as arrears grow. If a home is sold for less than the debt, in most countries (the UK, Canada, Israel and most of Europe among them) the borrower still owes the shortfall; only some loans in some US states are *non-recourse*, limited to the home itself.

> [!tip] Try your own numbers in [the loan calculator](#/tools/money/loan): the full schedule, extra payments, a rate change, index-linking and fees.

### Questions to ask any lender
What is the rate, and for how long is it fixed? What is the [[apr|APR]] with every fee included? Can I repay early, and at what cost? What happens at the end of the fixed period? Which insurance do you require? How is the payment recalculated if the rate or the index changes? Knowing these six answers puts you on equal terms with the person across the desk.
`,
  ideas: [
    'A mortgage is a loan secured on the home: the lender can sell the property if the payments stop.',
    'The security makes the rate low; the stakes for the borrower are correspondingly high.',
    'Five dials define every mortgage: amount, rate type, term, repayment method and costs.',
    'Equity is the home\'s value minus the balance; in the early years it grows mostly from the deposit and price changes, not from repayments.',
    'Two points on the rate change a long loan\'s payment by roughly a quarter.'
  ],
  pitfalls: [
    'When house prices fall, my payment falls too — The payment depends on the balance, the rate and the term. A fall in value reduces your equity, not your payment.',
    'If the bank repossesses and sells, the debt is settled — In most countries you still owe any shortfall after the sale, plus the costs.',
    'The longest term is always the best because the payment is lowest — It also has the highest total cost; the term should balance a safe payment against the interest paid.'
  ],
  formulas: [
    {
      name: 'Monthly mortgage payment',
      expr: 'M = P*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'M = P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 320000 },
        r: { name: 'yearly interest rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 30 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'A level (annuity) payment. Solve for $P$ to see what a payment can borrow, or for $T$ to see how long it takes.',
      practice: { unknowns: ['M', 'P', 'T'] },
      stories: {
        M: 'You buy a flat with a mortgage of {P} at {r} a year over {T}. What is the monthly payment?',
        P: 'You can pay {M} a month for {T} at {r} a year. How large a mortgage does that repay?',
        T: 'A mortgage of {P} at {r} is repaid at {M} a month. How long will it take?'
      }
    },
    {
      name: 'Your equity in the home',
      expr: 'E = V - B', tex: 'E = V - B',
      vars: {
        E: { name: 'your equity', q: 'money', unit: '$', signed: true },
        V: { name: 'value of the home today', q: 'money', unit: '$', value: 441632 },
        B: { name: 'balance still owed', q: 'money', unit: '$', value: 293852 }
      },
      note: 'Negative equity means the home is worth less than the debt. Selling costs come out of it too.',
      practice: { unknowns: ['E', 'B'] },
      stories: {
        E: 'Your home is valued at {V} and you still owe {B}. How much equity do you have?',
        B: 'Your home is worth {V} and your equity is {E}. How much do you still owe?'
      }
    }
  ],
  examples: [
    {
      title: 'Maya and Daniel\'s payment',
      q: 'They borrow ¤320,000 at 5 % over 30 years. Find the monthly payment and how the first one splits.',
      steps: [
        'Monthly rate $i = 0.05/12 = 0.0041667$; number of payments $n = 360$.',
        { text: 'The level payment:', tex: 'M = 320\\,000 \\times \\frac{0.0041667}{1 - 1.0041667^{-360}} = ¤1{,}717.83' },
        'First month\'s interest: $320\\,000 \\times 0.0041667 = ¤1{,}333.33$; capital repaid: $1{,}717.83 - 1{,}333.33 = ¤384.50$.',
        'Total paid over 30 years: $360 \\times 1{,}717.83 = ¤618{,}419$, of which ¤298,419 is interest.'
      ],
      a: '¤1,717.83 a month; the first payment is ¤1,333.33 interest and ¤384.50 capital.'
    },
    {
      title: 'Equity after five years',
      q: 'Five years later the flat has risen 2 % a year. What do they owe, what is the flat worth, and what is their equity?',
      steps: [
        'Balance after 60 payments: $B = 320\\,000 \\times 1.0041667^{60} - 1{,}717.83 \\times (1.0041667^{60} - 1)/0.0041667 = ¤293{,}852$.',
        'Capital repaid in five years: $320\\,000 - 293\\,852 = ¤26{,}148$.',
        'Value: $400\\,000 \\times 1.02^5 = ¤441{,}632$.',
        'Equity: $441\\,632 - 293\\,852 = ¤147{,}780$ — the ¤80,000 deposit, ¤41,632 of price rise and ¤26,148 of repayments.'
      ],
      a: 'They owe ¤293,852 on a flat worth ¤441,632: equity of ¤147,780.'
    }
  ],
  quiz: [
    { q: 'House prices in your area fall 15 %. What happens to your monthly mortgage payment?', choices: ['it falls by 15 %', 'it rises, because the loan is now riskier', 'nothing: it depends on the loan, not on the home\'s value', 'the bank asks you to repay the difference at once'], a: 2,
      why: 'The payment is set by the balance, the rate and the term. The fall reduces your equity. As long as you pay, a lender does not call in a mortgage because the value fell — unlike a margin loan on shares.' },
    { q: 'What is the monthly payment on ¤300,000 at 6 % over 30 years?', answer: 1798.65, unit: '$',
      why: '$i = 0.005$, $n = 360$: $M = 300\\,000 \\times 0.005/(1 - 1.005^{-360}) = ¤1{,}798.65$.' },
    { q: 'If a repossessed home sells for less than the debt, the borrower owes nothing more.', a: false,
      why: 'In most countries the shortfall remains a debt of the borrower. Only some loans in some US states are non-recourse, limited to the property.' },
    { q: 'On ¤320,000 over 25 years at 5 % (¤1,870.69 a month), which lowers the payment more: cutting the rate to 4 %, or stretching the term to 30 years?', choices: ['cutting the rate to 4 %', 'stretching the term to 30 years', 'both lower it by the same amount', 'neither changes the payment'], a: 0,
      why: 'At 4 % over 25 years the payment is ¤1,689.08 (¤181.61 less); over 30 years at 5 % it is ¤1,717.83 (¤152.86 less). The rate cut also lowers the total interest to ¤186,723, while the longer term raises it to ¤298,419.' },
    { q: 'Why is a mortgage usually cheaper than an unsecured personal loan of the same size?', choices: ['banks prefer homeowners as customers', 'the home secures the loan, so the lender expects to lose little if you default', 'governments subsidise every mortgage', 'a longer term always means a lower rate'], a: 1,
      why: 'The lender can recover its money from the sale of the home, so it demands a smaller risk premium. The low rate is the price of pledging your home.' }
  ],
  applications: ['Reading a mortgage offer and knowing what each figure means.', 'Choosing a term that balances a safe payment against the total interest.', 'Knowing your equity before you sell, refinance or borrow more.', 'Talking to a lender early if payments become hard.'],
  history: 'The word comes from Old French for a "dead pledge": the pledge dies when the debt is repaid, or the property is lost when it is not. Before the 1930s most American home loans ran for five to ten years, interest-only, with the whole balance due at the end; when the Depression made renewals impossible, foreclosures followed, and the long, fully amortizing loan that replaced them became the model for much of the world.',
  sim: 'ref-amortization'
},

/* ================================================================ deposit and LTV */
{
  id: 'down-payment-ltv', parent: 'mortgages', title: 'Down payment and loan-to-value', level: 1,
  short: 'The deposit is the part of the price you pay yourself; loan-to-value (LTV) is the loan as a share of the property\'s value. It sets the rate you are offered and whether you need mortgage insurance — and how far prices can fall before you owe more than the home is worth.',
  keywords: ['deposit', 'down payment', 'loan-to-value', 'LTV', 'LVR', 'negative equity', 'underwater', 'equity', 'mortgage insurance', 'LTV cap', 'macroprudential'],
  prereq: ['mortgage-basics', 'math:percentages'],
  related: ['mortgage-costs', 'property-leverage', 'mortgage-affordability', 'emergency-fund', 'bubbles', 'refinancing'],
  body: `
Two friends buy identical flats for ¤300,000. Ana puts down ¤30,000 and borrows ¤270,000; Ben puts down ¤75,000 and borrows ¤225,000. Their **loan-to-value** ratios are 90 % and 75 %. That one number decides a lot: the rate each is offered, whether Ana must pay for mortgage insurance, and what happens to each if prices fall.

$$\\text{LTV} = \\frac{\\text{loan}}{\\text{value of the property}}$$

The **deposit** (down payment) is the rest of the price: $D = V\\,(1 - \\text{LTV})$.

### Why lenders care
The deposit is the lender's cushion. If a borrower defaults and the home must be sold, the sale has to cover the debt, the arrears and the costs of selling. At 60 % LTV prices can fall by a third and the lender is still repaid; at 95 % a small dip leaves a loss. So lenders price in steps — rates typically fall as the LTV moves down through bands such as 95, 90, 85, 80, 75 and 60 % — and above 80 % many require mortgage insurance, paid by the borrower to protect the lender ([[mortgage-costs]]).

Regulators set limits too, as a brake on credit booms. Some examples at the time of writing — rules change, so check the current ones where you live:
- **Israel**: at most 75 % for a first home, 70 % for someone replacing their home, 50 % for an additional property.
- **Ireland**: 90 % for first-time buyers and 80 % for later purchases, with a small share of exceptions allowed to each bank.
- **Canada**: a minimum deposit of 5 %, more on the part of the price above a threshold; below a 20 % deposit the loan must be insured.
- **United States**: some loan programmes accept 3 to 3.5 % down, but below 20 % mortgage insurance is usually required.
- **United Kingdom**: loans of up to 95 % exist, and the rate falls noticeably at lower LTVs.

### Negative equity
Your equity is what the home is worth minus what you owe. When prices fall, the whole fall comes out of your equity: the lender's balance does not move. After three years of payments on ¤270,000 at 5 % over 30 years, Ana owes ¤257,428 — her ¤30,000 deposit plus ¤12,572 of capital repaid is a cushion of 14.2 % of the price. A 15 % fall, to ¤255,000, leaves her ¤2,428 underwater: **negative equity**, an LTV of 101 %.

That is not a bill. As long as she keeps paying and does not need to sell, nothing happens, and prices have time to recover. It bites when you *must* sell — a job in another city, a separation — or when a fixed rate ends and a new lender will not refinance at that LTV, leaving you on a worse rate. Falls of this size are not exotic: Irish home prices fell by roughly half between 2007 and 2013, and US prices by about a quarter nationally between 2006 and 2012, far more in some cities.

> [!warn] In the first years of a long loan the deposit is almost your whole cushion: repayments add only a few per cent. A bigger deposit buys resilience, not just a better rate.

### How big a deposit?
There is a real trade-off. Saving for longer brings a lower LTV, a better rate, perhaps no insurance and a thicker cushion — but also more years of rent, and prices may move meanwhile. Putting every spare coin into the deposit can leave no [[emergency-fund|emergency fund]], and a homeowner with no cash is fragile in a different way. Ask a lender where its bands lie: sometimes a few thousand more of deposit crosses a threshold and saves more than it costs.

> [!tip] Your LTV falls as you repay capital and as prices rise. When a fixed period ends you may qualify for a better band — ask for a new valuation.

### Questions to ask
At which LTV bands does the rate change, and by how much? Is mortgage insurance required, and when does it end? Will the lender refinance me later if prices dip? How much cash will I have left after the deposit and the [[mortgage-costs|buying costs]]?
`,
  ideas: [
    'LTV is the loan divided by the value; the deposit is the value times one minus the LTV.',
    'The deposit is the lender\'s cushion, so a lower LTV earns a lower rate and may avoid mortgage insurance.',
    'Many countries cap the LTV by law, often lower for investors than for first homes.',
    'A fall in prices comes entirely out of your equity; negative equity only bites if you must sell or refinance.',
    'Early in a long loan the deposit, not the repayments, is what protects you.'
  ],
  pitfalls: [
    'Negative equity means I must pay the bank the difference now — No: as long as you keep paying, the loan continues unchanged. It matters when you sell or need to refinance.',
    'Mortgage insurance protects me if I cannot pay — It protects the lender. You pay the premium; the lender is compensated if you default.',
    'The biggest possible deposit is always best — Not if it empties your savings: a homeowner without an emergency fund can be forced into debt by the first boiler failure or job loss.'
  ],
  formulas: [
    {
      name: 'Loan-to-value',
      expr: 'LTV = L/V', tex: '\\mathrm{LTV} = \\frac{L}{V}',
      vars: {
        LTV: { name: 'loan-to-value', q: 'ratio', unit: '%', tex: '\\mathrm{LTV}' },
        L: { name: 'amount borrowed', q: 'money', unit: '$', value: 270000 },
        V: { name: 'value of the property', q: 'money', unit: '$', value: 300000 }
      },
      practice: { unknowns: ['LTV', 'L'] },
      stories: {
        LTV: 'You borrow {L} to buy a home valued at {V}. What is the loan-to-value?',
        L: 'A lender offers up to {LTV} of the value on a home worth {V}. What is the largest loan?'
      }
    },
    {
      name: 'Deposit for a target LTV',
      expr: 'D = V*(1 - LTV)', tex: 'D = V\\,(1 - \\mathrm{LTV})',
      vars: {
        D: { name: 'deposit needed', q: 'money', unit: '$' },
        V: { name: 'price of the home', q: 'money', unit: '$', value: 350000 },
        LTV: { name: 'target loan-to-value', q: 'ratio', unit: '%', value: 80, min: 0, max: 100, tex: '\\mathrm{LTV}' }
      },
      practice: { unknowns: ['D', 'V'] },
      stories: {
        D: 'The best rate needs a loan-to-value of {LTV} or less. How much deposit do you need for a home at {V}?',
        V: 'You have saved {D} and the lender lends up to {LTV}. What is the most expensive home you can buy (before costs)?'
      }
    },
    {
      name: 'Price fall that wipes out your equity',
      expr: 'd = 1 - B/V', tex: 'd = 1 - \\frac{B}{V}',
      vars: {
        d: { name: 'fall in value to reach zero equity', q: 'ratio', unit: '%', signed: true },
        B: { name: 'balance still owed', q: 'money', unit: '$', value: 257428 },
        V: { name: 'value of the home', q: 'money', unit: '$', value: 300000 }
      },
      note: 'A negative result means you are already in negative equity. Selling costs would make the safe margin smaller still.',
      practice: { unknowns: ['d'] },
      stories: { d: 'You owe {B} on a home worth {V}. By how much can prices fall before you are in negative equity?' }
    }
  ],
  examples: [
    {
      title: 'Crossing an LTV band',
      q: 'A ¤350,000 home. You have ¤52,500 for the deposit. What is your LTV, and how much more would bring it to 80 %?',
      steps: [
        'Deposit share: $52\\,500 / 350\\,000 = 15\\,\\%$, so the loan is ¤297,500 and $\\text{LTV} = 85\\,\\%$.',
        'For 80 %: $D = 350\\,000 \\times (1 - 0.80) = ¤70{,}000$.',
        'The gap: $70\\,000 - 52\\,500 = ¤17{,}500$. Compare it with what the better band saves over the fixed period, and with the savings you would have left.'
      ],
      a: 'LTV 85 %; ¤17,500 more would reach 80 %.'
    },
    {
      title: 'Ana and a 15 % fall',
      q: 'Ana borrowed ¤270,000 on a ¤300,000 flat at 5 % over 30 years. Three years later prices are down 15 %. Where does she stand?',
      steps: [
        'Payment: $M = ¤1{,}449.42$. Balance after 36 payments: $B = ¤257{,}428$ (she has repaid ¤12,572).',
        'Value now: $300\\,000 \\times 0.85 = ¤255{,}000$.',
        'Equity: $255\\,000 - 257\\,428 = -¤2{,}428$; LTV $= 257\\,428/255\\,000 = 101\\,\\%$.',
        'Before the fall her cushion was $1 - 257\\,428/300\\,000 = 14.2\\,\\%$ — the fall was just larger than that.'
      ],
      a: 'She is ¤2,428 in negative equity (LTV 101 %), which matters only if she must sell or refinance.'
    }
  ],
  quiz: [
    { q: 'You borrow ¤240,000 to buy a ¤320,000 home. What is the loan-to-value, in per cent?', answer: 75,
      why: '$240\\,000/320\\,000 = 0.75$, an LTV of 75 %; the deposit is the other 25 %.' },
    { q: 'You buy with a 5 % deposit and prices fall 10 % the next month. Your equity is now about…', choices: ['+5 % of the price', 'zero', '−5 % of the price: negative equity', '−10 % of the price'], a: 2,
      why: 'The loan is 95 % of the old price; the home is worth 90 %. Equity = 90 % − 95 % = −5 %. The whole fall came out of your 5 %.' },
    { q: 'Being in negative equity means the lender can demand that you repay the difference at once.', a: false,
      why: 'A mortgage is not a margin loan: as long as you pay, the contract continues. Negative equity matters when you sell or want to refinance.' },
    { q: 'In the first years of a 30-year loan, what protects you most against a fall in prices?', choices: ['the capital repaid each month', 'the deposit', 'a low interest rate', 'mortgage insurance'], a: 1,
      why: 'Three years of payments on Ana\'s loan repaid ¤12,572 — 4 % of the price — against a 10 % deposit. Mortgage insurance protects the lender, not you.' },
    { q: 'A ¤350,000 home; the best rate needs an LTV of at most 80 %. What deposit is needed?', answer: 70000, unit: '$',
      why: '$D = 350\\,000 \\times (1 - 0.80) = ¤70{,}000$.' }
  ],
  applications: ['Deciding how long to save before buying.', 'Knowing the price fall your equity can absorb.', 'Timing a refinance to reach a better LTV band.', 'Understanding why investors face lower LTV caps.'],
  sim: 'mg-ltv'
},

/* ================================================================ fixed rates */
{
  id: 'fixed-rate-mortgages', parent: 'mortgages', title: 'Fixed-rate mortgages', level: 1,
  short: 'A fixed rate keeps the interest rate — and so the payment — unchanged for a set period: the whole term in the US 30-year loan, two to ten years in the UK and much of Europe before it resets. You pay for certainty, often in the rate and in the charges for leaving early.',
  keywords: ['fixed rate', 'fixed-rate mortgage', '30-year fixed', 'two-year fix', 'five-year fix', 'remortgage', 'reset', 'standard variable rate', 'early repayment charge', 'refinance', 'rate lock', 'payment shock'],
  prereq: ['mortgage-basics', 'amortization'],
  related: ['variable-rate-mortgages', 'mortgage-mix', 'refinancing', 'early-repayment', 'yield-curve', 'index-linked-mortgages'],
  body: `
A fixed rate is a promise: whatever happens to interest rates, your rate — and so your payment — stays the same for an agreed period. For many first-time buyers that certainty is worth more than anything else: the budget made on the first day still holds years later. On ¤250,000 over 30 years at 6 % the payment is ¤1,498.88 whether market rates later go to 8 % (a new borrower would pay ¤1,834.41) or to 4 % (¤1,193.54).

### How long is "fixed"?
Countries differ more on this than on anything else about mortgages:
- **United States**: the 30-year fixed-rate loan is the standard — fixed for the whole term and usually repayable at any time without a penalty, so borrowers refinance when rates fall. It is unusual worldwide and rests on government-sponsored agencies that buy loans and package them for investors.
- **Germany, France, Belgium, the Netherlands**: fixes of 10, 15, 20 years or the whole term are common. In Germany a borrower may by law give notice on a fixed rate ten years after receiving the money, whatever the contract says.
- **United Kingdom**: fixes of two or five years (sometimes ten), after which the loan moves to the lender's standard variable rate unless you *remortgage* to a new deal. Leaving during the fix costs an early repayment charge.
- **Canada**: a five-year fixed term inside a 25-year amortization is typical; at the end of each term the loan is renewed at the rates of the day.
- **Israel**: fixed tracks come both unlinked and [[index-linked-mortgages|linked to the price index]], and at the time of writing at least a third of every mortgage must be at a rate fixed for the whole term.
- **Denmark**: long fixed-rate loans are funded by matching bonds; if rates rise, the borrower can repay by buying back the bonds at their lower market price.

Keep two lengths apart: the **term** (how long you take to repay) and the **fixed period** (how long the rate is guaranteed). For rate risk, a 25-year loan with a two-year fix is closer to a variable loan than to a 25-year fix.

### The reset: when the fix ends
Take ¤200,000 over 25 years, fixed at 2 % for five years: ¤847.71 a month. After five years ¤167,570 is still owed. If rates are then 5 %, the new payment over the remaining 20 years is ¤1,105.89 — ¤258.18 more, a jump of 30 %. At 6 % it would be ¤1,200.52. Millions of households in the UK, Canada and elsewhere lived through exactly this after the rate rises of 2022–2023. The fix delayed the shock; it did not cancel it.

> [!key] A fixed rate moves the risk of rising rates from you to the lender for the fixed period — and only for that period.

### The price of certainty
A lender who promises you a rate for five or thirty years has to fund that promise, typically by borrowing at a fixed rate itself or with interest-rate swaps. That is why fixed rates follow longer-term market rates rather than the central bank's rate, why they are often (not always) a little higher than variable ones — the [[yield-curve]] usually slopes upward — and why leaving early costs money: if rates have fallen, the lender is left holding expensive funding. Early repayment charges on fixed loans are therefore common, and in some countries, Israel among them, they are calculated from how far market rates have fallen since you borrowed.

When rates fall, a fixed-rate borrower can **refinance** if the contract allows. A ¤300,000 loan over 30 years at 7 % costs ¤1,995.91 a month; after three years ¤290,181 is owed. A new loan at 6 % for the remaining 27 years costs ¤1,810.69 — ¤185.22 a month less. If switching costs ¤6,000, it pays for itself in about 32 months. [[refinancing]] covers the full reasoning.

> [!tip] The simulation below runs a fixed and a variable loan through the same rate scenario. Try a five-year fix in the "sharp spike" scenario and watch the payment at the reset.

### Questions to ask
- For how long is the rate fixed, and what happens at the end?
- What does it cost to repay early — part or all — during the fix?
- Can I overpay each year without a charge? (Many UK lenders allow around 10 % of the balance a year.)
- If I sell, can I carry the fixed rate to the next home ("porting")?
- Is the fixed rate linked to an index, or not?
`,
  ideas: [
    'A fixed rate keeps the payment unchanged for the fixed period, whatever market rates do.',
    'The fixed period and the term are different: a short fix on a long loan leaves you exposed at every reset.',
    'At the reset the payment is recalculated for the balance, the new rate and the years left — the delayed payment shock.',
    'Certainty has a price: often a higher rate, and early repayment charges that compensate the lender.',
    'When rates fall, refinancing pays if the monthly saving recovers the costs within the time you will keep the loan.'
  ],
  pitfalls: [
    'A fixed rate means the loan never changes — Only for the fixed period. A UK two-year fix on a 25-year loan leaves 23 years of rate risk.',
    'A fixed rate always costs more than a variable one — It depends on what rates do. Borrowers who fixed before the 2022–2023 rises paid far less than variable borrowers for years.',
    'I can always leave a fixed rate if rates fall — Often only with an early repayment charge that can take most of the saving; check the contract.'
  ],
  formulas: [
    {
      name: 'Payment after the fixed period ends',
      expr: 'M = B*(r/12)/(1 - (1 + r/12)^(-12*T))', tex: 'M = B\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}}',
      vars: {
        M: { name: 'new monthly payment', q: 'money', unit: '$' },
        B: { name: 'balance owed when the fix ends', q: 'money', unit: '$', value: 167570 },
        r: { name: 'new yearly rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 30 },
        T: { name: 'years left on the loan', q: 'years', unit: 'yr', value: 20 }
      },
      note: 'The defaults: ¤200,000 over 25 years fixed at 2 % for five years, reset to 5 %.',
      practice: { unknowns: ['M', 'r'] },
      stories: {
        M: 'Your fixed rate ends with {B} owed and {T} to go. The new rate is {r}. What is the new monthly payment?',
        r: 'Your fix ends with {B} owed over {T}. Your budget allows {M} a month. What is the highest rate you can take?'
      }
    },
    {
      name: 'Time to recover the cost of refinancing',
      expr: 't = C/(12*S)', tex: 't = \\frac{C}{12\\,S}',
      vars: {
        t: { name: 'time to recover the costs', q: 'years', unit: 'yr' },
        C: { name: 'costs of switching (fees, charges)', q: 'money', unit: '$', value: 6000 },
        S: { name: 'monthly saving', q: 'money', unit: '$', value: 185.22 }
      },
      note: 'A first test, ignoring interest on the costs. If you expect to sell or move before $t$, refinancing does not pay.',
      practice: { unknowns: ['t', 'S'] },
      stories: {
        t: 'Refinancing costs {C} and saves {S} a month. How long until it pays for itself?',
        S: 'Refinancing costs {C}, and you will keep the loan for {t}. What monthly saving makes it break even?'
      }
    }
  ],
  examples: [
    {
      title: 'The end of a five-year fix',
      q: '¤200,000 over 25 years, fixed at 2 % for five years. At the reset the rate is 5 %. What happens to the payment?',
      steps: [
        'Fixed payment: $M_1 = 200\\,000 \\times \\frac{0.02/12}{1 - (1 + 0.02/12)^{-300}} = ¤847.71$.',
        'Balance after 60 payments: ¤167,570.',
        { text: 'New payment over the remaining 240 months:', tex: 'M_2 = 167\\,570 \\times \\frac{0.05/12}{1 - (1 + 0.05/12)^{-240}} = ¤1{,}105.89' },
        'Rise: $1{,}105.89 - 847.71 = ¤258.18$, or 30 %.'
      ],
      a: 'The payment jumps from ¤847.71 to ¤1,105.89 a month (+30 %).'
    },
    {
      title: 'Does refinancing pay?',
      q: 'A ¤300,000 30-year loan at 7 % is three years old. A new 27-year loan at 6 % would cost ¤6,000 to arrange. How long until the switch pays for itself?',
      steps: [
        'Current payment: ¤1,995.91. Balance after 36 payments: ¤290,181.',
        'New payment: $290\\,181 \\times \\frac{0.005}{1 - 1.005^{-324}} = ¤1{,}810.69$.',
        'Saving: $1{,}995.91 - 1{,}810.69 = ¤185.22$ a month.',
        'Payback: $6\\,000 / 185.22 = 32.4$ months, about 2.7 years.'
      ],
      a: 'About 32 months; worth it if you expect to keep the loan clearly longer than that.'
    }
  ],
  quiz: [
    { q: 'You have a 30-year fixed rate. Two years in, market rates rise by 2 points. Your payment…', choices: ['rises by about a quarter', 'rises at the next yearly review', 'does not change', 'rises only if inflation rises too'], a: 2,
      why: 'That is the whole point of the fix: the lender carries the rate risk for the fixed period, which here is the whole term.' },
    { q: 'A UK two-year fixed rate ends and you do nothing. The loan usually…', choices: ['must be repaid in full', 'moves to the lender\'s standard variable rate', 'stays at the same fixed rate', 'becomes interest-only'], a: 1,
      why: 'It reverts to the lender\'s standard variable rate, usually well above the deals on offer — which is why most borrowers remortgage at the end of a fix.' },
    { q: 'Refinancing would cost ¤4,800 and save ¤200 a month. How many months until it pays for itself?', answer: 24,
      why: '$4\\,800 / 200 = 24$ months. If you might move within two years, it does not pay.' },
    { q: 'A fixed rate always costs more over the life of the loan than a variable one.', a: false,
      why: 'It depends on the path of rates. When rates rose sharply in 2022–2023, borrowers who had fixed earlier paid much less than those on variable rates.' },
    { q: 'Why do lenders charge a fee when a fixed-rate loan is repaid early?', choices: ['to punish borrowers who change banks', 'because the lender funded your fixed rate at a fixed cost; if rates have fallen and you leave, it loses the difference', 'because early repayment is illegal in most countries', 'to cover the valuation of the home'], a: 1,
      why: 'The lender matched your fixed rate with fixed-rate funding or a swap. If you repay when rates are lower, it must re-lend the money at the lower rate while still paying for the old funding.' }
  ],
  applications: ['Choosing the length of a fix to match how long you are sure of your plans.', 'Budgeting for the reset at the end of a fixed period.', 'Deciding whether refinancing pays after rates fall.', 'Reading the early-repayment terms before signing.'],
  sim: { id: 'mg-rate-paths', params: { fix: 5, scenario: 'spike' } }
},

/* ================================================================ variable rates */
{
  id: 'variable-rate-mortgages', parent: 'mortgages', title: 'Variable and adjustable-rate mortgages', level: 2,
  short: 'On a variable-rate mortgage the rate moves with a benchmark — the central bank\'s rate, prime, Euribor, SOFR or the lender\'s own standard rate — plus a fixed margin, and the payment is recalculated. It usually starts cheaper than a fixed rate, and passes the risk of rising rates to you.',
  keywords: ['variable rate', 'adjustable-rate mortgage', 'ARM', 'tracker', 'Euribor', 'prime', 'SOFR', 'margin', 'benchmark', 'rate cap', 'standard variable rate', 'payment shock', 'floating rate'],
  prereq: ['mortgage-basics', 'fixed-rate-mortgages', 'monetary-policy'],
  related: ['mortgage-mix', 'central-banks', 'mortgage-affordability', 'yield-curve', 'early-repayment', 'index-linked-mortgages'],
  body: `
On a variable-rate mortgage the rate is built from two parts:

$$r = \\text{benchmark} + \\text{margin}$$

The **margin** is written into your contract and reflects your risk and the lender's costs. The **benchmark** moves with the market, and each time it resets, the payment is recalculated for the balance and the time left.

### Which benchmark?
- **The central bank's rate**, directly — UK *tracker* mortgages — or through a published prime rate: in Israel the *prime* is the Bank of Israel's rate plus 1.5 points, so prime-linked tracks move the day the central bank moves.
- **An interbank rate**: in Spain, Portugal, Italy and Finland many loans follow the 12-month Euribor plus a margin, reset once or twice a year.
- **The lender's own rate**: the UK *standard variable rate* and many Australian variable rates are set by the lender, which usually follows the central bank but does not have to.
- **US adjustable-rate mortgages (ARMs)**: fixed for an initial period — the "5" in a 5/1 or 5/6 ARM — then reset every year or six months to an index plus a margin, within **caps**, commonly 2 points at the first reset, 1 point at each later one and 5 points over the life of the loan (a "2/1/5" structure).

### How big is the risk?
Take ¤200,000 over 25 years at Euribor 3 % plus a 1-point margin: 4 %, or ¤1,055.67 a month. If Euribor rises to 5 %, the rate becomes 6 % and the payment ¤1,288.60 — 22 % more. If it falls to 1.5 %, the payment drops to ¤897.23. A quick rule for the immediate effect: each point on ¤200,000 adds ¤166.67 a month of interest.

This is not a theoretical risk. Between early 2022 and late 2023 the central banks of the US, the euro area and the UK raised their rates by roughly four to five percentage points, and the 12-month Euribor went from below zero to around 4 %. Households on variable rates felt it within months; those on fixes felt it when their fixes ended.

For a US-style ARM: ¤350,000 over 30 years starting at 5.5 % costs ¤1,987.26. At the first reset, after five years, ¤323,612 is owed; if the index has risen, the 2-point cap allows 7.5 % and the payment becomes ¤2,391.46 (+20 %). At the lifetime ceiling of 10.5 % it would be ¤3,055.49 — 54 % above the start. Caps limit the worst case; they do not make it small.

> [!warn] A variable rate always looks good on the day it is chosen: it is compared with today's fixed rates. The real question is what you could pay if it rose by two or three points.

### Why choose variable at all?
- It usually starts cheaper, because lenders charge for fixing (the [[yield-curve]] normally slopes upward). Over long periods variable borrowers have often paid less on average — but not always, and an average is no comfort in the bad years.
- It can usually be repaid early without a fee, which suits anyone expecting a bonus, an inheritance or a sale.
- When rates fall, you benefit at once.

It suits borrowers with slack in their budget, a short horizon or a small loan relative to income; it is risky for anyone who has borrowed to the limit. Many mortgages combine both kinds: see [[mortgage-mix]]. Lenders' [[mortgage-affordability|stress tests]] exist precisely because of this risk.

> [!tip] In the simulation, choose a scenario and move the size of the rate move: the payment path of the variable loan shows the shock, the fixed loan shows what certainty would have cost or saved.

### Questions to ask
Which benchmark, and how often is it reset? What is the margin, and can it change? Are there caps, or a floor below which the rate cannot fall? How much notice comes before a new payment? What would my payment be if the benchmark were 2 or 3 points higher — and could I pay it?
`,
  ideas: [
    'A variable rate is a benchmark plus a fixed margin; the payment is recalculated at each reset.',
    'Benchmarks differ by country: the central bank\'s rate or prime, Euribor, SOFR, or the lender\'s own standard rate.',
    'Each point on the rate adds about one-twelfth of a per cent of the balance to the monthly interest at once.',
    'Variable rates usually start lower and are cheap to repay early, but the borrower carries the rate risk.',
    'Caps on adjustable loans limit the worst case without making it small.'
  ],
  pitfalls: [
    'Rates are low now, so the payment will stay affordable — Rates in the US, the euro area and the UK rose four to five points in under two years in 2022–2023. Test your budget at higher rates.',
    'The margin is the rate — The margin is only the lender\'s part; the benchmark on top of it can move a long way.',
    'A capped ARM cannot hurt me — A 2/1/5 cap on a 5.5 % start still allows 10.5 %, which on ¤350,000 would raise the payment by more than half.'
  ],
  formulas: [
    {
      name: 'Payment on a benchmark-linked loan',
      expr: 'M = P*((b + m)/12)/(1 - (1 + (b + m)/12)^(-12*T))',
      tex: 'M = P\\,\\frac{(b + m)/12}{1 - \\left(1 + (b + m)/12\\right)^{-12T}}',
      vars: {
        M: { name: 'monthly payment', q: 'money', unit: '$' },
        P: { name: 'balance owed', q: 'money', unit: '$', value: 200000 },
        b: { name: 'benchmark rate', q: 'ratio', unit: '%', value: 3, min: -1, max: 20, signed: true },
        m: { name: 'lender\'s margin', q: 'ratio', unit: '%', value: 1, min: 0, max: 10 },
        T: { name: 'years left', q: 'years', unit: 'yr', value: 25 }
      },
      note: 'Solve for $b$ to find the benchmark at which the payment reaches the most you can pay.',
      practice: { unknowns: ['M', 'b'] },
      stories: {
        M: 'Your loan of {P} over {T} follows a benchmark of {b} plus a margin of {m}. What is the monthly payment?',
        b: 'You owe {P} over {T} at a benchmark plus {m}. Your budget allows {M} a month. At what benchmark rate does the payment reach your limit?'
      }
    },
    {
      name: 'Extra monthly interest from a rate rise',
      expr: 'dI = B*dr/12', tex: '\\Delta I = B\\,\\frac{\\Delta r}{12}',
      vars: {
        dI: { name: 'extra interest per month', q: 'money', unit: '$', tex: '\\Delta I', signed: true },
        B: { name: 'balance owed', q: 'money', unit: '$', value: 200000 },
        dr: { name: 'change in the rate', q: 'ratio', unit: '%', value: 1, tex: '\\Delta r', signed: true, min: -10, max: 10 }
      },
      note: 'The immediate change in the month\'s interest. The recalculated payment changes by less, because at a higher rate the new level payment repays capital more slowly.',
      practice: { unknowns: ['dI'] },
      stories: { dI: 'You owe {B} on a variable rate. The benchmark moves by {dr}. How much does the month\'s interest change?' }
    }
  ],
  examples: [
    {
      title: 'Euribor rises two points',
      q: '¤200,000 over 25 years at 12-month Euribor + 1 point. Euribor is 3 %, then rises to 5 %. What happens to the payment?',
      steps: [
        'Rate $3 + 1 = 4\\,\\%$: $M = 200\\,000 \\times \\frac{0.04/12}{1 - (1 + 0.04/12)^{-300}} = ¤1{,}055.67$.',
        'Rate $5 + 1 = 6\\,\\%$: $M = ¤1{,}288.60$.',
        'Rise: ¤232.93 a month, 22 %. The first month\'s interest rises by $2 \\times 166.67 = ¤333.33$, but the payment by less: the recalculated level payment repays capital more slowly at the higher rate, so less of it goes to capital.'
      ],
      a: 'From ¤1,055.67 to ¤1,288.60 a month (+22 %).'
    },
    {
      title: 'An adjustable-rate loan at its first reset',
      q: 'A 30-year ARM of ¤350,000 at 5.5 % for five years, with 2/1/5 caps. What are the payment at the start, after the first reset if the index has risen a lot, and at the lifetime cap?',
      steps: [
        'Start: $M = 350\\,000 \\times \\frac{0.055/12}{1 - (1 + 0.055/12)^{-360}} = ¤1{,}987.26$.',
        'Balance after 60 payments: ¤323,612.',
        'First reset, capped at $5.5 + 2 = 7.5\\,\\%$ for the 300 months left: ¤2,391.46 (+20 %).',
        'Lifetime cap $5.5 + 5 = 10.5\\,\\%$ from the sixth year: ¤3,055.49 (+54 %).'
      ],
      a: '¤1,987.26 at first; ¤2,391.46 after a capped first reset; up to ¤3,055.49 at the lifetime cap.'
    }
  ],
  quiz: [
    { q: 'Your rate is 12-month Euribor plus a margin of 0.9 points. Euribor is 3.2 %. What is your rate, in per cent?', answer: 4.1,
      why: 'Rate = benchmark + margin = 3.2 + 0.9 = 4.1 %.' },
    { q: 'On a ¤300,000 balance, how much extra interest per month does a 1-point rise add at first?', answer: 250, unit: '$',
      why: '$300\\,000 \\times 0.01/12 = ¤250$ a month.' },
    { q: 'A US ARM starts at 5.5 % with 2/1/5 caps. What is the highest rate it can ever charge?', choices: ['7.5 %', '8.5 %', '10.5 %', 'there is no limit'], a: 2,
      why: 'The lifetime cap is 5 points above the start: 10.5 %. The 2 and 1 limit each individual reset.' },
    { q: 'When the central bank cuts its rate, the payment on a prime-linked (Israel) or tracker (UK) mortgage falls soon after.', a: true,
      why: 'These benchmarks are tied directly to the central bank\'s rate, so cuts — like rises — pass through at the next reset, often within weeks.' },
    { q: 'Who is most exposed to a variable rate?', choices: ['a borrower with a small loan and a large income', 'a borrower whose payment is already close to the most they can afford', 'a borrower who plans to repay in two years', 'a borrower with a large cash reserve'], a: 1,
      why: 'Risk is the rate rise you cannot absorb. Slack in the budget, a short horizon or savings all soften a rise; a stretched budget does not.' }
  ],
  applications: ['Reading a variable-rate offer: benchmark, margin, reset dates, caps.', 'Testing your budget at rates 2–3 points higher before you borrow.', 'Keeping part of a mortgage variable to repay it early without fees.', 'Following the central bank\'s decisions and knowing what they mean for your payment.'],
  sim: 'mg-rate-paths'
},

/* ================================================================ inflation-linked */
{
  id: 'index-linked-mortgages', parent: 'mortgages', title: 'Inflation-linked mortgages', level: 2,
  short: 'On an inflation-linked (CPI-indexed) mortgage the balance is raised every month by inflation and a lower real rate is charged on top. Payments start lower and rise with prices, and the debt can grow for years while you pay. Common in Israel and Chile — cheaper or dearer than an unlinked loan depending on inflation.',
  keywords: ['inflation-linked mortgage', 'index-linked', 'CPI-linked', 'indexed loan', 'real interest rate', 'indexation', 'Unidad de Fomento', 'UF', 'madad', 'break-even inflation', 'linked track'],
  prereq: ['mortgage-basics', 'inflation-purchasing-power', 'real-vs-nominal'],
  related: ['fixed-rate-mortgages', 'mortgage-mix', 'inflation-linked-bonds', 'inflation-cpi', 'hyperinflation', 'math:exponential-growth-decay'],
  body: `
In a few countries — Israel and Chile above all, Iceland too — many mortgages are **linked to the consumer price index**. The rate on offer looks low because it is a *real* rate: on top of it, every month the balance you owe is raised by that month's inflation, and the payment is recalculated from the new balance.

In Chile the loan is written in *Unidades de Fomento* (UF), a unit of account whose value in pesos follows the index day by day; in Israel the balance is revalued each month with the published price index. Either way the idea is the same: you borrow a fixed amount of **purchasing power** and repay it with interest.

### The mechanics
Each month:
1. the balance is multiplied by one month of inflation;
2. interest is charged on the raised balance at the real rate;
3. the payment is recalculated as a level payment of the new balance over the months left.

The result is simple to state: measured in today's money the payment never changes. In money of the day it grows with prices. After $t$ years

$$M_t = M_0\\,(1+\\pi)^t$$

where $M_0$ is the level payment at the real rate and $\\pi$ the yearly inflation.

### A comparison
Noa borrows ¤300,000 over 25 years and is offered two tracks: **unlinked fixed at 5 %**, or **CPI-linked fixed at 3 %** real. Suppose inflation runs at 2.5 % a year.

| | Unlinked, 5 % | Linked, 3 % real |
|---|---:|---:|
| First payment | ¤1,753.77 | ¤1,425.56 |
| Payment in year 10 | ¤1,753.77 | ¤1,821.09 |
| Last payment | ¤1,753.77 | ¤2,637.48 |
| Owed after 10 years | ¤221,773 | ¤263,704 |
| Total paid, money of the day | ¤526,131 | ¤590,995 |

The linked loan starts ¤328.21 a month cheaper, which is why it tempts. Its payment overtakes the unlinked one in the ninth year, and after ten years Noa owes ¤41,931 more on it. Of everything she pays, ¤131,304 is indexation: the rise of the balance with prices.

> [!warn] On a linked loan you can pay faithfully for years and owe more than you borrowed. With 4 % inflation, Noa's balance would climb for six years, to ¤312,548, and fall back below ¤300,000 only after eleven.

### Cheaper or dearer?
Sums of money from different years cannot be compared directly, and the linked loan's larger total is partly just inflation. The fair comparison is the rate: the linked loan costs its real rate *plus* inflation. With monthly payments the two loans cost the same when inflation is

$$\\pi_b = \\left(\\frac{1 + r_n/12}{1 + r_r/12}\\right)^{12} - 1$$

For 5 % against 3 % that is **2.01 %** a year (the simpler rule $1.05/1.03 - 1$ gives 1.94 %). At 2.5 % inflation the linked loan costs the equivalent of 5.48 % — dearer; at 1 % it costs 4.00 % — cheaper. Choosing between them is a view on inflation: the linked loan wins if inflation turns out *below* the break-even, the unlinked one if it turns out above.

### Who carries which risk
With an unlinked fixed rate the **lender** carries the inflation risk: if prices soar, your fixed payment shrinks in real terms. With a linked loan **you** carry it, and your safety depends on your income keeping pace with prices. For a household whose pay is regularly adjusted, the linked payment stays a roughly constant share of income; for anyone whose income lags prices — a fixed pension, a frozen salary — it becomes a squeeze. When inflation ran at hundreds of per cent a year in Israel in the early 1980s, linked debts swelled alarmingly in money terms, though not in real ones.

> [!tip] The [loan calculator](#/tools/money/loan) has an index-linking option: try inflation rates above and below the break-even and compare the schedules.

### Questions to ask
Which index is used, and with what delay? Is the real rate fixed for the whole term, or does it reset (Israel also has linked tracks that reset every five years)? What does early repayment cost? What would my payment be in year 10 if inflation were 2 % — and if it were 5 %?
`,
  ideas: [
    'A linked loan charges a real rate and raises the balance with the price index every month.',
    'In today\'s money the payment is constant; in money of the day it grows with inflation.',
    'The balance can rise for years even while you pay, especially on long terms and at high inflation.',
    'The break-even inflation makes the linked and unlinked loans equally costly; below it the linked loan is cheaper.',
    'Linking moves inflation risk from the lender to the borrower, whose protection is an income that keeps pace with prices.'
  ],
  pitfalls: [
    'The linked loan has the lower rate, so it is cheaper — Its rate is real; add inflation before comparing. At 2.5 % inflation, 3 % real costs as much as 5.48 % unlinked.',
    'If I keep paying, the balance must fall — Not on a linked loan: indexation can add more each month than the capital you repay.',
    'The larger total repaid proves the linked loan is dearer — Totals mix money of different years; compare the rate, or the payments in today\'s money.'
  ],
  formulas: [
    {
      name: 'Payment of a linked loan after t years',
      expr: 'Mt = M0*(1 + infl)^t', tex: 'M_t = M_0\\,(1 + \\pi)^{t}',
      vars: {
        Mt: { name: 'payment in year t, money of the day', q: 'money', unit: '$', tex: 'M_t' },
        M0: { name: 'level payment at the real rate', q: 'money', unit: '$', value: 1422.63, tex: 'M_0' },
        infl: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 2.5, min: -5, max: 50, signed: true, tex: '\\pi' },
        t: { name: 'years from the start', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'For monthly indexation this is exact: the payment is the real-rate payment carried forward with prices. The default is ¤300,000 at 3 % real over 25 years.',
      practice: { unknowns: ['Mt', 'infl'] },
      stories: {
        Mt: 'A linked loan\'s payment is {M0} in today\'s money. With inflation of {infl} a year, what is it after {t}?',
        infl: 'A linked payment of {M0} has become {Mt} after {t}. What yearly inflation does that imply?'
      }
    },
    {
      name: 'Break-even inflation between linked and unlinked',
      expr: 'pb = ((1 + rn/12)/(1 + rr/12))^12 - 1', tex: '\\pi_b = \\left(\\frac{1 + r_n/12}{1 + r_r/12}\\right)^{12} - 1',
      vars: {
        pb: { name: 'break-even yearly inflation', q: 'ratio', unit: '%', tex: '\\pi_b', signed: true },
        rn: { name: 'unlinked (nominal) rate', q: 'ratio', unit: '%', value: 5, tex: 'r_n', min: 0, max: 30 },
        rr: { name: 'linked (real) rate', q: 'ratio', unit: '%', value: 3, tex: 'r_r', min: -5, max: 30, signed: true }
      },
      note: 'If inflation averages more than $\\pi_b$, the unlinked loan was cheaper; if less, the linked one.',
      practice: { unknowns: ['pb', 'rr'] },
      stories: {
        pb: 'An unlinked fixed rate of {rn} or a linked rate of {rr} real. Above what inflation is the unlinked loan the cheaper one?',
        rr: 'The unlinked rate is {rn} and you expect inflation of {pb}. What real rate on a linked loan would cost the same?'
      }
    },
    {
      name: 'A linked loan\'s cost as a money rate',
      expr: 'ra = 12*((1 + rr/12)*(1 + infl)^(1/12) - 1)', tex: 'r_a = 12\\left[\\left(1 + \\frac{r_r}{12}\\right)(1 + \\pi)^{1/12} - 1\\right]',
      vars: {
        ra: { name: 'equivalent unlinked rate', q: 'ratio', unit: '%', tex: 'r_a', signed: true },
        rr: { name: 'real rate of the linked loan', q: 'ratio', unit: '%', value: 3, tex: 'r_r', min: -5, max: 30, signed: true },
        infl: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 2.5, min: -5, max: 50, signed: true, tex: '\\pi' }
      },
      note: 'Compare $r_a$ with the unlinked rate you are offered.',
      practice: { unknowns: ['ra'] },
      stories: { ra: 'A linked mortgage charges {rr} real. If inflation averages {infl}, what unlinked rate would cost the same?' }
    }
  ],
  examples: [
    {
      title: 'Noa\'s two offers',
      q: '¤300,000 over 25 years: unlinked at 5 %, or linked at 3 % real. Inflation is 2.5 % a year. Compare the first payment and the payment in year 10.',
      steps: [
        'Unlinked: $M = 300\\,000 \\times \\frac{0.05/12}{1 - (1 + 0.05/12)^{-300}} = ¤1{,}753.77$, for all 300 months.',
        'Linked, level payment at the real rate: $M_0 = ¤1{,}422.63$. The first month\'s indexation raises it to ¤1,425.56.',
        'Year 10: $M_{10} = 1{,}422.63 \\times 1.025^{10} = ¤1{,}821.09$ — now above the unlinked payment, which it overtook in the ninth year.',
        'Balance after 10 years: ¤263,704 linked, ¤221,773 unlinked.'
      ],
      a: 'The linked loan starts ¤328.21 lower, but by year 10 it costs ¤1,821.09 a month against ¤1,753.77, with ¤41,931 more still owed.'
    },
    {
      title: 'The break-even',
      q: 'At what inflation do the two offers cost the same? Which is cheaper at 1 % and at 2.5 %?',
      steps: [
        { text: 'Break-even with monthly payments:', tex: '\\pi_b = \\left(\\frac{1 + 0.05/12}{1 + 0.03/12}\\right)^{12} - 1 = 2.01\\,\\%' },
        'At 2.5 % the linked loan costs $12\\,[(1.0025)(1.025)^{1/12} - 1] = 5.48\\,\\%$ as a money rate — more than 5 %.',
        'At 1 % it costs 4.00 % — less than 5 %.'
      ],
      a: 'Break-even 2.01 %; the linked loan is dearer at 2.5 % inflation and cheaper at 1 %.'
    }
  ],
  quiz: [
    { q: 'On a linked loan of ¤300,000 at 3 % real over 25 years, with 4 % inflation, the balance after five years of payments is higher than the amount borrowed.', a: true,
      why: 'It is ¤312,091: each month the indexation added more than the capital repaid. It falls back below ¤300,000 only after eleven years.' },
    { q: 'An unlinked fixed rate of 6 % or a linked rate of 3.5 % real. The break-even inflation is…', choices: ['about 1 %', 'about 2.5 %', 'about 3.5 %', 'about 9.5 %'], a: 1,
      why: '$(1.06/1.035) - 1 = 2.42\\,\\%$ with the simple rule, 2.52 % with monthly payments: about 2.5 %. Adding the rates (9.5 %) is the classic mistake.' },
    { q: 'Inflation turns out well above the break-even for years. Which loan was cheaper?', choices: ['the linked loan', 'the unlinked fixed-rate loan', 'they cost the same', 'it depends only on the term'], a: 1,
      why: 'The unlinked payment is fixed in money, so high inflation erodes it; the linked loan grows with prices. The lender of the unlinked loan bore the inflation.' },
    { q: 'Measured in today\'s money, the payment of a linked level-payment loan…', choices: ['falls every year', 'stays the same', 'rises with inflation', 'rises faster than inflation'], a: 1,
      why: 'It is the level payment at the real rate, carried forward with prices: constant in real terms, rising in money of the day.' },
    { q: 'A linked loan\'s payment is ¤1,000 today. Inflation is 3 % a year. What is the payment after 10 years, in money of the day?', answer: 1343.92, unit: '$',
      why: '$M_{10} = 1\\,000 \\times 1.03^{10} = ¤1{,}343.92$.' }
  ],
  applications: ['Comparing linked and unlinked tracks on the same terms.', 'Estimating the payment of a linked loan in ten or twenty years.', 'Judging whether your income is likely to keep pace with the index.', 'Understanding why a statement shows a balance above the amount borrowed.'],
  history: 'Indexed loans spread where inflation was high and persistent. Chile created the Unidad de Fomento in 1967 so that long loans could be written in constant purchasing power; in Israel, where inflation reached several hundred per cent a year in the early 1980s, linkage to the price index became the normal way to lend for decades.',
  sim: 'mg-cpi-linked'
},

/* ================================================================ mixing tracks */
{
  id: 'mortgage-mix', parent: 'mortgages', title: 'Mixing mortgage tracks', level: 3,
  short: 'A mortgage can be split into tracks — fixed, variable, inflation-linked — each with its own rate and risk. The mix trades expected cost against the worst payment you might face; spreading the risks, not finding the single cheapest rate, is the point.',
  keywords: ['mortgage mix', 'mortgage tracks', 'split loan', 'prime track', 'fixed track', 'linked track', 'stress test', 'risk and cost', 'weighted rate', 'diversification', 'mortgage structure'],
  prereq: ['fixed-rate-mortgages', 'variable-rate-mortgages', 'index-linked-mortgages', 'diversification'],
  related: ['mortgage-affordability', 'efficient-frontier', 'risk-and-return', 'early-repayment', 'math:expected-value'],
  body: `
Most people choose one mortgage. In some countries you are expected to choose several at once. An Israeli mortgage is normally built from **tracks** — a slice at a fixed unlinked rate, a slice linked to prime, a slice at a CPI-linked fixed rate, perhaps one that resets every five years — and at the time of writing at least a third must be fixed for the whole term. Australians and New Zealanders often *split* a loan into a fixed part and a variable part, or into fixes of different lengths. Wherever you live, the reasoning behind a mix is worth knowing, because it is the reasoning behind every mortgage decision.

### Each track has a cost and a risk
| Track | Cost | What can go wrong |
|---|---|---|
| Fixed, unlinked | known in advance; often the highest rate | falling rates leave you overpaying, and leaving may cost a fee |
| Variable (prime, Euribor…) | usually the lowest today | rates rise and the payment jumps |
| Fixed, CPI-linked | the lowest starting payment | inflation above expectations raises the balance and the payment for years |

No track wins on every count: the cheaper-looking ones are cheaper precisely because you carry a risk. A mix lets you choose *how much* of each risk to carry.

### A worked mix
Take ¤600,000 over 25 years in thirds of ¤200,000: fixed unlinked at 5 % (¤1,169.18 a month), variable at 4 % (¤1,055.67) and CPI-linked at 2.5 % real with 2.5 % expected inflation (¤899.08 to start). Together, ¤3,123.94 a month. All at the fixed rate it would be ¤3,507.54; all variable, ¤3,167.02.

Now the stress tests that regulators and careful borrowers use:
- **Rates up 2 points**: the variable third rises to ¤1,288.60, ¤232.93 more a month. An all-variable loan would jump to ¤3,865.80.
- **Inflation 3 points above expectations**: after five years the linked third's payment would be ¤1,172.65 in money of the day, against ¤1,015.14 had inflation behaved.

The expected cost of the mix is close to the weighted average of the tracks' rates, counting the linked track at its real rate plus expected inflation (4.98 % here): about **4.66 %** a year (the exact yield of the combined payments is 4.68 %), between the variable's 4 % and the fixed 5 %.

### The trade-off, as a picture
Plot every possible mix by its expected cost and by its worst payment in a stress test, and a pattern appears: the cheapest mixes carry the largest worst case, and the safest cost the most. The sensible mixes lie along an edge — a **frontier**, like the [[efficient-frontier]] of investment portfolios — and any mix inside it is beaten on both counts by another. Where on the frontier to stand is a personal question: how large a rise in the payment could you absorb? The simulation below draws the frontier for your numbers.

Two effects make mixing worth more than a simple average:
- **The shocks come at different times.** A rate rise hits the variable track at once; excess inflation builds up in the linked track over years. So a mix's worst month is milder than the average of its tracks' worst months — in the simulation's example, ¤3,352 in today's money for equal thirds, against ¤3,500 to ¤3,858 for any single track.
- **Flexibility.** Variable tracks can usually be repaid without a fee and fixed ones often cannot, so a variable slice lets you pay debt down when a windfall arrives.

> [!key] Treat the mix as a risk budget: decide first how large a rise in the payment you could absorb, then choose the cheapest mix that stays within it.

### Questions to ask
- What is each track's rate, index, reset date and early-repayment charge?
- What is the total payment today — and after rates +2 points and inflation +3 points?
- Can the tracks be refinanced separately later?
- Can the tracks have different terms? A shorter term on the variable track retires that risk sooner.
`,
  ideas: [
    'Each track trades cost against a particular risk: rates for variable, inflation for linked, lost flexibility for fixed.',
    'A mix\'s expected cost is close to the weighted average of its tracks\' rates, with linked tracks counted at real rate plus expected inflation.',
    'Stress tests — rates +2 points, inflation +3 points — show the payment you may have to carry.',
    'The good mixes form a frontier: lower cost only with a larger worst case.',
    'Because shocks hit tracks at different times, a mix\'s worst month is milder than its tracks\' average worst.'
  ],
  pitfalls: [
    'The best mix is the one with the lowest rate today — The lowest rate usually carries the most risk; the right mix is the cheapest one whose worst case you could carry.',
    'Mixing guarantees a lower cost — It limits the damage of any one scenario; in hindsight a single track will always have been cheapest.',
    'Linked and unlinked rates can be averaged directly — A linked rate is real: add expected inflation before comparing or averaging.'
  ],
  formulas: [
    {
      name: 'Expected rate of a three-track mix',
      expr: 'r = wf*rf + wv*rv + (1 - wf - wv)*rl', tex: '\\bar r = w_f r_f + w_v r_v + (1 - w_f - w_v)\\,r_l',
      vars: {
        r: { name: 'expected rate of the mix', q: 'ratio', unit: '%', tex: '\\bar r' },
        wf: { name: 'share on the fixed track', q: 'ratio', unit: '%', value: 40, min: 0, max: 100, tex: 'w_f' },
        rf: { name: 'fixed rate', q: 'ratio', unit: '%', value: 5, tex: 'r_f' },
        wv: { name: 'share on the variable track', q: 'ratio', unit: '%', value: 30, min: 0, max: 100, tex: 'w_v' },
        rv: { name: 'variable rate today', q: 'ratio', unit: '%', value: 4, tex: 'r_v' },
        rl: { name: 'linked track: real rate plus expected inflation', q: 'ratio', unit: '%', value: 4.98, tex: 'r_l' }
      },
      note: 'The rest of the loan is on the linked track. An approximation: the exact yield of the combined payments differs by a few hundredths of a point.',
      practice: { unknowns: ['r', 'wf'] },
      stories: {
        r: 'A mortgage is {wf} fixed at {rf}, {wv} variable at {rv}, and the rest linked, costing about {rl} with expected inflation. What is its expected rate?',
        wf: 'With {wv} variable at {rv}, the rest split between fixed at {rf} and linked at about {rl}, what share on the fixed track gives an expected rate of {r}?'
      }
    },
    {
      name: 'A track\'s payment in a rate stress test',
      expr: 'Ms = w*P*((r + s)/12)/(1 - (1 + (r + s)/12)^(-12*T))',
      tex: 'M_s = w\\,P\\,\\frac{(r + s)/12}{1 - \\left(1 + (r + s)/12\\right)^{-12T}}',
      vars: {
        Ms: { name: 'stressed monthly payment of the track', q: 'money', unit: '$', tex: 'M_s' },
        w: { name: 'share of the loan on this track', q: 'ratio', unit: '%', value: 50, min: 0, max: 100 },
        P: { name: 'whole mortgage', q: 'money', unit: '$', value: 600000 },
        r: { name: 'rate today', q: 'ratio', unit: '%', value: 4, min: 0, max: 30 },
        s: { name: 'stress: rise in the rate', q: 'ratio', unit: '%', value: 2, min: 0, max: 10 },
        T: { name: 'years left', q: 'years', unit: 'yr', value: 25 }
      },
      note: 'The rise is applied from the start — the harshest timing. With the defaults the track costs ¤1,583.51 at 4 % and ¤1,932.90 under the stress.',
      practice: { unknowns: ['Ms', 's'] },
      stories: {
        Ms: 'You put {w} of a {P} mortgage on a variable track at {r} over {T}. What is that track\'s payment if rates rise by {s}?',
        s: 'The variable track ({w} of {P}, {T}, now at {r}) must never cost more than {Ms} a month. What rise in rates could you absorb?'
      }
    }
  ],
  examples: [
    {
      title: 'Equal thirds under stress',
      q: '¤600,000 over 25 years: ¤200,000 fixed at 5 %, ¤200,000 variable at 4 %, ¤200,000 linked at 2.5 % real (inflation expected at 2.5 %). Find the payment, and the effect of rates +2 points and inflation +3 points.',
      steps: [
        'Payments: fixed ¤1,169.18, variable ¤1,055.67, linked ¤899.08 (first month). Total ¤3,123.94.',
        'Rates +2 points: the variable track becomes ¤1,288.60, +¤232.93; the fixed and linked tracks do not move.',
        'Inflation 5.5 % instead of 2.5 %: the linked track\'s payment after five years is ¤1,172.65 instead of ¤1,015.14.',
        'Compare: all-variable would rise from ¤3,167.02 to ¤3,865.80 with rates +2 points; all-fixed stays at ¤3,507.54 but starts ¤383.60 higher than the mix.'
      ],
      a: 'The mix costs ¤3,123.94 a month and rises by ¤232.93 in the rate test — a third of the shock an all-variable loan would take.'
    },
    {
      title: 'The expected rate of the mix',
      q: 'What is the expected rate of the equal-thirds mix?',
      steps: [
        'Linked track as a money rate at 2.5 % inflation: $12\\,[(1 + 0.025/12)(1.025)^{1/12} - 1] = 4.98\\,\\%$.',
        { text: 'Weighted average:', tex: '\\bar r = \\tfrac13(5 + 4 + 4.98) = 4.66\\,\\%' },
        'The exact yield of the combined payment stream is 4.68 %: the average is a good guide.'
      ],
      a: 'About 4.66 % a year.'
    }
  ],
  quiz: [
    { q: 'Why not put the whole mortgage on the track with the lowest rate today?', choices: ['because banks do not allow it anywhere', 'because the lowest rate usually carries the most risk: it is low because you bear the rate or the inflation risk', 'because the lowest rate always rises', 'because low rates have higher fees'], a: 1,
      why: 'Variable and linked tracks are cheaper at the start because the risk has moved to you. The question is how much of that risk you can carry.' },
    { q: 'A ¤200,000 variable track at 4 % over 25 years costs ¤1,055.67 a month. Rates rise 2 points. By how much does its payment rise?', answer: 232.93, unit: '$',
      why: 'At 6 % the payment is ¤1,288.60; the rise is ¤232.93.' },
    { q: 'Mixing tracks guarantees a lower total cost than choosing any single track.', a: false,
      why: 'Afterwards one single track will always turn out to have been cheapest. The mix limits how bad any one scenario can be; it does not beat the best one.' },
    { q: 'A mix\'s worst month in a stress test is usually milder than the average of its tracks\' worst months because…', choices: ['banks give discounts on mixed loans', 'the shocks hit the tracks at different times', 'the fixed track falls when rates rise', 'the linked track is protected from inflation'], a: 1,
      why: 'A rate rise hits the variable track at once, while excess inflation builds up in the linked track over years, so the peaks do not coincide.' },
    { q: 'You expect a large bonus in two years and want to repay part of the loan then. Which track is usually the easiest to repay early without a fee?', choices: ['a variable (prime or benchmark-linked) track', 'a fixed unlinked track', 'a fixed CPI-linked track', 'all of them equally'], a: 0,
      why: 'Fixed tracks often carry early-repayment charges that compensate the lender for its fixed funding; variable tracks usually do not.' }
  ],
  applications: ['Structuring a mortgage in tracks (standard in Israel; split loans in Australia and New Zealand).', 'Running the same stress tests a regulator would.', 'Keeping a variable slice for planned early repayments.', 'Deciding which track to refinance when rates change.'],
  sim: 'mg-mix'
},

/* ================================================================ affordability */
{
  id: 'mortgage-affordability', parent: 'mortgages', title: 'How much mortgage can you afford?', level: 1,
  short: 'Lenders cap the payment at a share of income (payment-to-income), all debts at a share (debt-to-income) or the loan at a multiple of income, and test whether you could still pay at a higher rate. Your own limit should come from your budget, not from the most a lender will lend.',
  keywords: ['affordability', 'payment-to-income', 'PTI', 'debt-to-income', 'DTI', 'loan-to-income', 'LTI', 'stress test', 'serviceability buffer', 'qualifying rate', 'borrowing power', 'how much can I borrow'],
  prereq: ['mortgage-basics', 'debt-to-income', 'household-budget'],
  related: ['down-payment-ltv', 'variable-rate-mortgages', 'emergency-fund', 'mortgage-costs', 'money-anxiety', 'present-value'],
  body: `
"How much can I afford?" hides two different questions: how much a lender *will* lend, and how much you *should* borrow. The first has rules; the second is yours alone.

### How lenders decide
Lenders everywhere use some combination of four tests. The limits vary by country and lender and change over time; these are examples at the time of writing:
1. **Payment-to-income (PTI)**: the mortgage payment may not exceed a share of income. In Israel the cap is half of the household's net income, and banks treat anything above 40 % as riskier.
2. **Debt-to-income (DTI)**: all debt payments together — mortgage, car, student loans, cards — as a share of income. The traditional US guideline is 28 % of gross income for housing and 36 % for all debts; lenders commonly accept up to about 43 %, sometimes more.
3. **Loan-to-income (LTI)**: the loan as a multiple of yearly income. UK lenders typically go up to about 4 to 4.5 times income; in Ireland the limit is 4 times for first-time buyers.
4. **A stress test**: could you still pay at a higher rate? Canada qualifies borrowers at the contract rate plus 2 points (or a floor rate, if higher); Australian banks add a buffer of 3 points; UK lenders test affordability at rates well above the initial deal.

Watch the base: US ratios use gross income, before tax; Israeli and many European ones use net income. The same percentage means very different things.

### A worked case
A household earns ¤6,000 a month and pays ¤400 on a car loan. Suppose the limits are 35 % for the mortgage payment and 45 % for all debts. The PTI cap allows ¤2,100; the DTI cap allows ¤2,700 − ¤400 = ¤2,300. The tighter one binds: **¤2,100 a month**.

At 5 % over 30 years that payment carries a loan of ¤391,191. But the lender stresses the rate at 7 %, where the same payment carries only ¤315,646: the stress test removes 19 % of the borrowing power (at 8 %, 27 %). Borrow ¤315,646 at the actual 5 % and the payment is ¤1,694.46, 28 % of income — the gap is the cushion that would protect them if rates rose.

$$P_{\\max} = M\\,\\frac{1 - \\left(1 + (r+s)/12\\right)^{-12T}}{(r+s)/12}$$

> [!key] Each point on the rate cuts borrowing power by roughly a tenth: ¤1,500 a month over 30 years carries ¤314,192 at 4 % but ¤250,187 at 6 %.

### What you should borrow
A lender's maximum is set to keep defaults acceptable across thousands of borrowers; it is not a plan for a comfortable life. Build your own number from your [[household-budget|budget]]:
- **All the costs of owning**: property taxes, insurance, service charges and maintenance — a common rule of thumb is about 1 % of the home's value a year, more for older houses ([[mortgage-costs]]).
- **Your cushion**: an [[emergency-fund|emergency fund]] of several months of expenses left *after* the purchase.
- **Your plans**: children, a career change, a period on one income. A payment that works on two salaries may not work on one.
- **Your own stress test**: if the rate rose by 2 or 3 points, or your income fell by a fifth, could you still pay?

Borrowing several times your yearly income frightens many people, and the fear is useful when it leads to these questions. The number that lets you sleep is usually somewhat below the maximum — and knowing exactly why it is lower is what turns fear into a decision.

### Improving the numbers
Paying off a small loan often raises borrowing power more than a pay rise: under a 45 % DTI limit, removing a ¤300 car payment frees ¤300 of mortgage payment, while ¤500 more income frees only ¤225. A longer term passes a lender's test more easily but costs more in total. A larger deposit reduces the loan you need, and the [[down-payment-ltv|LTV]] risks with it. Correcting errors in your [[credit-scores|credit report]] can improve the rate you are offered.

> [!tip] The simulation below shows the whole calculation: the binding limit, the stress-tested rate and the largest loan. Try removing the other debts, and try a 3-point buffer.
`,
  ideas: [
    'Lenders limit the payment (PTI), all debts (DTI) or the loan (LTI) relative to income.',
    'A stress test qualifies you at a higher rate than you will pay, which cuts the largest loan.',
    'The binding limit is the tightest of the tests; other debts reduce what the DTI test leaves for the mortgage.',
    'Each point on the rate cuts borrowing power by roughly a tenth on a 30-year loan.',
    'A safe loan comes from your own budget, including owning costs, a cash cushion and your own stress test.'
  ],
  pitfalls: [
    'The bank approved it, so I can afford it — The maximum is designed for the average borrower\'s default risk, not for your plans, your other costs or your peace of mind.',
    'Ratios are comparable between countries — US limits use gross income, many others net income: 43 % of gross can be more than 50 % of net.',
    'A longer term makes a loan more affordable — It lowers the payment but raises the total cost and keeps you in debt longer.'
  ],
  formulas: [
    {
      name: 'Largest loan under a stress test',
      expr: 'P = M*(1 - (1 + (r + s)/12)^(-12*T))/((r + s)/12)',
      tex: 'P = M\\,\\frac{1 - \\left(1 + (r+s)/12\\right)^{-12T}}{(r+s)/12}',
      vars: {
        P: { name: 'largest loan', q: 'money', unit: '$' },
        M: { name: 'largest monthly payment allowed', q: 'money', unit: '$', value: 2100 },
        r: { name: 'rate offered', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 30 },
        s: { name: 'stress buffer added to the rate', q: 'ratio', unit: '%', value: 2, min: 0, max: 10 },
        T: { name: 'term', q: 'years', unit: 'yr', value: 30 }
      },
      note: 'With $s = 0$ it is the plain present value of the payments.',
      practice: { unknowns: ['P', 'M'] },
      stories: {
        P: 'Your payment may be at most {M}. The lender tests at the offered rate of {r} plus {s}, over {T}. What is the largest loan?',
        M: 'You want to borrow {P} over {T}. The lender tests at {r} plus {s}. What monthly payment must your income allow?'
      }
    },
    {
      name: 'Mortgage payment left by a debt-to-income limit',
      expr: 'M = k*Y - D', tex: 'M = k\\,Y - D',
      vars: {
        M: { name: 'largest mortgage payment', q: 'money', unit: '$' },
        k: { name: 'debt-to-income limit', q: 'ratio', unit: '%', value: 45, min: 0, max: 100 },
        Y: { name: 'monthly income', q: 'money', unit: '$', value: 6000 },
        D: { name: 'other debt payments a month', q: 'money', unit: '$', value: 400 }
      },
      practice: { unknowns: ['M', 'Y'] },
      stories: {
        M: 'Your income is {Y} a month and you pay {D} on other debts. The lender allows all debts up to {k} of income. What mortgage payment is left?',
        Y: 'You want a mortgage payment of {M} and pay {D} on other debts. With a limit of {k} on all debts, what monthly income do you need?'
      }
    }
  ],
  examples: [
    {
      title: 'The binding limit and the stress test',
      q: 'Income ¤6,000 a month, a ¤400 car payment, limits of 35 % (mortgage) and 45 % (all debts). The offered rate is 5 % over 30 years, stress-tested at 7 %. What is the largest loan?',
      steps: [
        'PTI: $0.35 \\times 6\\,000 = ¤2{,}100$. DTI: $0.45 \\times 6\\,000 - 400 = ¤2{,}300$. The lower one binds: ¤2,100.',
        'Without the stress: $P = 2\\,100 \\times \\frac{1 - (1 + 0.05/12)^{-360}}{0.05/12} = ¤391{,}191$.',
        'At the stress rate of 7 %: $P = ¤315{,}646$, 19 % less.',
        'At the actual 5 %, ¤315,646 costs ¤1,694.46 a month: 28 % of income.'
      ],
      a: 'About ¤315,646; the stress test keeps the real payment near 28 % of income.'
    }
  ],
  quiz: [
    { q: 'Income ¤5,000 a month, a debt-to-income limit of 40 %, and a ¤300 car payment. What is the largest mortgage payment allowed?', answer: 1700, unit: '$',
      why: '$0.40 \\times 5\\,000 - 300 = ¤1{,}700$.' },
    { q: 'Under a 40 % debt-to-income limit, which raises the mortgage payment you can get more: ¤500 more income a month, or paying off a ¤300-a-month car loan?', choices: ['the ¤500 raise', 'paying off the car loan', 'both the same', 'neither'], a: 1,
      why: 'A raise of ¤500 adds only 40 % of it, ¤200, to the limit; clearing the car loan frees the whole ¤300.' },
    { q: 'The largest loan a bank approves is a safe amount to borrow.', a: false,
      why: 'The limit is set for acceptable default rates across many borrowers. Your own budget, cushion and plans decide what is safe for you.' },
    { q: 'What does a lender\'s stress test check?', choices: ['whether the home\'s value could fall', 'whether you could still pay if the rate were higher', 'your credit score', 'the lender\'s own capital'], a: 1,
      why: 'It qualifies you at the offered rate plus a buffer (2 to 3 points in several countries), so a rise would not immediately break your budget.' },
    { q: 'A ¤1,500 monthly payment over 30 years supports a loan of ¤314,192 at 4 %. At 6 % it supports about…', choices: ['¤314,000', '¤280,000', '¤250,000', '¤210,000'], a: 2,
      why: 'At 6 % the same payment carries ¤250,187, about 20 % less: roughly a tenth per point.' }
  ],
  applications: ['Estimating your borrowing power before house-hunting.', 'Choosing a loan below the maximum with a margin for rate rises.', 'Deciding whether to clear small debts before applying.', 'Comparing rules between countries when moving abroad.'],
  sim: 'mg-afford'
},

/* ================================================================ costs */
{
  id: 'mortgage-costs', parent: 'mortgages', title: 'Closing costs, fees and mortgage insurance', level: 1,
  short: 'Buying a home costs more than its price: transfer taxes, legal and valuation fees, the lender\'s charges, insurance and moving. Mortgage fees also raise the true rate of the loan (the APR) — most of all if you refinance or sell early.',
  keywords: ['closing costs', 'transfer tax', 'stamp duty', 'notary fees', 'arrangement fee', 'origination fee', 'points', 'mortgage insurance', 'PMI', 'LMI', 'APR', 'valuation', 'buildings insurance', 'fees'],
  prereq: ['mortgage-basics', 'apr', 'down-payment-ltv'],
  related: ['loan-comparison', 'refinancing', 'property-insurance', 'life-disability-insurance', 'rent-vs-buy', 'mortgage-affordability'],
  body: `
The price on the listing is not what a home costs. Between the offer and the keys come taxes, professional fees, the lender's charges and insurance — nearly all of them paid in cash, on top of the deposit. First-time buyers are regularly caught out by them.

### The costs of buying
Which items apply, and how large they are, depends on the country:
- **Transfer tax or stamp duty** — often the largest. Germany charges 3.5 % to 6.5 % of the price depending on the state; in France the notary's costs on an older home, mostly taxes, come to about 7–8 %; the UK's stamp duty is tiered, with relief for first-time buyers; in Israel a buyer's only home is untaxed up to a threshold, while additional homes pay far higher rates. In the US transfer taxes are usually small, but closing costs as a whole typically run to 2–5 % of the price. (Examples at the time of writing.)
- **Legal and registration**: a lawyer, notary or conveyancer; land registry fees; title insurance in the US.
- **Survey and valuation**: the lender's valuation, and — wise for older buildings — your own survey.
- **The lender's fees**: arrangement or origination fees, and sometimes "points" paid to buy a lower rate (in the US one point is 1 % of the loan).
- **Moving, repairs and furniture** — never on the lender's list, always on yours.

For a ¤300,000 home with a 10 % deposit and costs of 4 % of the price, the cash needed on the day is ¤30,000 + ¤12,000 = **¤42,000**: 40 % more than the deposit alone.

### Mortgage insurance: protection for the lender
Where the deposit is small, many countries require **mortgage default insurance**. The name misleads: it protects the *lender* if you default, and you pay the premium. Examples at the time of writing:
- **US**: private mortgage insurance (PMI) on most loans with less than 20 % down. You can ask to cancel it once the balance reaches 80 % of the original value, and it must end automatically at 78 %. At an illustrative 0.6 % a year on a ¤270,000 loan it costs ¤135 a month.
- **Canada**: compulsory below a 20 % deposit, as a one-off premium of a few per cent of the loan, usually added to it.
- **Australia**: lenders' mortgage insurance above 80 % loan-to-value, usually a one-off premium.

Other insurance protects *you* or the building: buildings insurance (almost always required by the lender) and life cover so that the mortgage is repaid if a borrower dies — required by banks in some countries, Israel among them. See [[property-insurance]] and [[life-disability-insurance]].

### Fees and the true rate
A fee paid to get a loan is interest by another name, and the [[apr|APR]] folds it in. On ¤250,000 at 5 % over 25 years, a ¤2,000 fee raises the APR to 5.08 % if you keep the loan to the end — but to 5.43 % if you repay it after two years, and 5.83 % after one. A fee is paid once, so the sooner you leave, the more it weighs. Where people move or refinance every few years, this matters a great deal.

Compare **offer A**, 4.6 % with a ¤3,000 fee, and **offer B**, 4.9 % with no fee, on ¤250,000 over 25 years. A's payment is ¤1,403.81 and B's ¤1,446.95: ¤43.14 a month less for A. But A is cheaper overall only if you keep it longer than 57 months — four years and nine months — when its APR falls below B's 4.90 %. Plan to move or refinance within three years, and B wins. The simulation below draws the crossover.

> [!warn] A fee "added to the loan" is not free: it is borrowed, with interest, for the whole term. ¤3,000 added to a 25-year loan at 4.6 % costs ¤16.85 a month — ¤5,054 in all.

### The costs of owning
After the purchase come property taxes, buildings insurance, service charges in a block of flats and maintenance — often estimated at about 1 % of the value a year. They belong in the [[mortgage-affordability|affordability]] sums and in the [[rent-vs-buy]] comparison.

> [!tip] Put two offers side by side in [the comparison calculator](#/tools/money/compare), fees included, with the year you expect to leave: it computes the APR of each.

### Questions to ask
What will I pay in cash on completion, item by item? Which fees can be added to the loan, and what does that cost? Is mortgage insurance required, what does it cost and when can it end? What is the APR over the years I actually expect to keep the loan?
`,
  ideas: [
    'The cash needed to buy is the deposit plus taxes, fees and moving costs — often well above the deposit alone.',
    'Mortgage default insurance protects the lender, though the borrower pays for it.',
    'A fee is interest paid in advance; the APR includes it.',
    'The shorter you keep a loan, the more a fixed fee raises its true rate.',
    'A lower rate with a fee beats a higher rate without one only beyond a break-even horizon.'
  ],
  pitfalls: [
    'I only need the deposit — Transfer taxes, legal fees, valuations and moving often add several per cent of the price, in cash.',
    'Mortgage insurance will pay my mortgage if I lose my job — Default insurance protects the lender; income or payment-protection cover is a different product.',
    'The lowest rate is the cheapest deal — Not if it carries a fee and you leave before the break-even horizon; compare the APR over the time you expect to keep the loan.'
  ],
  formulas: [
    {
      name: 'Cash needed to complete a purchase',
      expr: 'C = V*(d + c) + F', tex: 'C = V\\,(d + c) + F',
      vars: {
        C: { name: 'cash needed', q: 'money', unit: '$' },
        V: { name: 'price of the home', q: 'money', unit: '$', value: 300000 },
        d: { name: 'deposit, share of the price', q: 'ratio', unit: '%', value: 10, min: 0, max: 100 },
        c: { name: 'taxes and fees, share of the price', q: 'ratio', unit: '%', value: 3.5, min: 0, max: 30 },
        F: { name: 'fixed fees (valuation, arrangement, moving)', q: 'money', unit: '$', value: 1500 }
      },
      practice: { unknowns: ['C', 'V'] },
      stories: {
        C: 'You buy a home for {V} with a deposit of {d}. Taxes and fees come to {c} of the price, plus {F} of fixed costs. How much cash do you need?',
        V: 'You have {C} in cash. You need a deposit of {d}, taxes and fees of {c} of the price and {F} of fixed costs. What is the highest price you can pay?'
      }
    },
    {
      name: 'APR of a loan with an up-front fee',
      expr: 'P*(r/12)/(1 - (1 + r/12)^(-12*T)) = (P - F)*(a/12)/(1 - (1 + a/12)^(-12*T))',
      tex: 'P\\,\\frac{r/12}{1 - (1 + r/12)^{-12T}} = (P - F)\\,\\frac{a/12}{1 - (1 + a/12)^{-12T}}',
      vars: {
        a: { name: 'APR (fee included)', q: 'ratio', unit: '%', min: 0.01, max: 50 },
        P: { name: 'amount borrowed', q: 'money', unit: '$', value: 250000 },
        r: { name: 'contract rate', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'term, kept to the end', q: 'years', unit: 'yr', value: 25 },
        F: { name: 'up-front fee', q: 'money', unit: '$', value: 2000 }
      },
      solveFor: 'a',
      note: 'The APR is the rate at which the payments repay only what you actually received, $P - F$. This form assumes the loan runs its full term; repaid early, the fee weighs more.',
      practice: { unknowns: ['a', 'F'] },
      stories: {
        a: 'A loan of {P} at {r} over {T} has a fee of {F}. What is its APR?',
        F: 'A loan of {P} at {r} over {T} is advertised with an APR of {a}. How large is the fee?'
      }
    },
    {
      name: 'Monthly cost of mortgage insurance',
      expr: 'm = p*L/12', tex: 'm = \\frac{p\\,L}{12}',
      vars: {
        m: { name: 'monthly premium', q: 'money', unit: '$' },
        p: { name: 'yearly premium rate', q: 'ratio', unit: '%', value: 0.6, min: 0, max: 5 },
        L: { name: 'loan', q: 'money', unit: '$', value: 270000 }
      },
      note: 'Premium rates depend on the country, the insurer, the LTV and the credit score; 0.6 % is only an illustration.',
      practice: { unknowns: ['m'] },
      stories: { m: 'Mortgage insurance costs {p} of the loan a year. What does it add to the monthly payment on a loan of {L}?' }
    }
  ],
  examples: [
    {
      title: 'The cash for a first home',
      q: 'A ¤300,000 home, a 10 % deposit, taxes and fees of 3.5 % of the price and ¤1,500 of fixed costs. How much cash is needed?',
      steps: [
        'Deposit: $0.10 \\times 300\\,000 = ¤30{,}000$.',
        'Taxes and fees: $0.035 \\times 300\\,000 = ¤10{,}500$.',
        'Total: $30\\,000 + 10\\,500 + 1\\,500 = ¤42{,}000$.'
      ],
      a: '¤42,000 — 40 % more than the deposit alone.'
    },
    {
      title: 'Fee or no fee?',
      q: 'Offer A: 4.6 % with a ¤3,000 fee. Offer B: 4.9 % with no fee. ¤250,000 over 25 years. Which is cheaper if you keep the loan three years? Ten?',
      steps: [
        'Payments: A ¤1,403.81, B ¤1,446.95.',
        'APR if repaid after 3 years: A 5.05 %, B 4.90 % — B is cheaper.',
        'APR if repaid after 10 years: A 4.77 %, B 4.90 % — A is cheaper.',
        'The APRs cross at 57 months: below that horizon choose B, above it A.'
      ],
      a: 'B for three years, A for ten; the break-even is 57 months.'
    }
  ],
  quiz: [
    { q: 'A ¤250,000 home, a 10 % deposit, and buying costs of 4 % of the price. How much cash is needed?', answer: 35000, unit: '$',
      why: '$25\\,000 + 10\\,000 = ¤35{,}000$.' },
    { q: 'Private mortgage insurance (PMI) pays your mortgage if you lose your job.', a: false,
      why: 'PMI and similar default insurance protect the lender against loss if you default. You pay the premium; the benefit goes to the lender.' },
    { q: 'A ¤2,000 arrangement fee raises the APR the most when the loan is…', choices: ['kept for 25 years', 'repaid after 2 years', 'twice as large', 'at a higher rate'], a: 1,
      why: 'On ¤250,000 at 5 % the APR is 5.08 % over 25 years but 5.43 % over 2: the fee is spread over fewer months.' },
    { q: 'Offer A: 4.6 % with a ¤3,000 fee. Offer B: 4.9 % with no fee (¤250,000 over 25 years). You expect to move in three years. Which is cheaper?', choices: ['A', 'B', 'they cost the same', 'impossible to say'], a: 1,
      why: 'A overtakes B only after 57 months. Over three years A\'s APR is 5.05 % against B\'s 4.90 %.' },
    { q: 'Adding a ¤3,000 fee to a 25-year loan at 4.6 %, instead of paying it in cash, costs about…', choices: ['nothing extra', '¤3,000', '¤5,050 in total', '¤12,000'], a: 2,
      why: 'Borrowed for 300 months it costs ¤16.85 a month, ¤5,054 in total.' }
  ],
  applications: ['Budgeting the cash needed on completion.', 'Choosing between a fee-heavy and a fee-free offer.', 'Knowing when mortgage insurance can be cancelled.', 'Reading the APR over the years you expect to keep the loan.'],
  sim: 'mg-fee-rate'
}

);
