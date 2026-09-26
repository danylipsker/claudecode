/* HYPER-FINANCES · content/bonds.js — Bonds and Fixed Income › Bonds.
 * What a bond is, prices and yields, yield to maturity, duration, credit risk, the yield
 * curve, inflation-linked bonds and the money market. Every amount was computed with
 * Hyper.finance (bond, bondYield, irr); simulations are in sims/loans-bonds.js. */
Hyper.add(

/* ================================================================ WHAT A BOND IS */
{
  id: 'bond-basics', parent: 'bonds', title: 'What a bond is', level: 1,
  short: 'A bond is a loan you make to a government or a company, cut into pieces that can be bought and sold: it pays a fixed coupon and returns its face value at maturity.',
  keywords: ['bond', 'fixed income', 'face value', 'par', 'coupon', 'maturity', 'issuer', 'government bond', 'treasury', 'gilt', 'corporate bond', 'municipal bond', 'zero-coupon bond', 'accrued interest', 'bond fund'],
  prereq: ['how-loans-work', 'present-value', 'compound-interest'],
  related: ['bond-pricing', 'yield-to-maturity', 'credit-risk', 'money-market', 'asset-classes', 'balloon-interest-only', 'mutual-funds-etfs'],
  body: `
When you put money in a bank, the bank borrows from you. When you buy a bond, you lend directly — to a government, a city or a company — and the loan comes as a certificate you can sell to someone else before it ends. A ¤1,000 bond with a 4 % coupon and ten years to maturity promises ¤40 every year for ten years and the ¤1,000 back at the end: ¤1,400 in all. It is an [[balloon-interest-only|interest-only loan]], seen from the lender's side.

### The words
| Word | Meaning | Example |
|---|---|---|
| **Issuer** | the borrower | a government, a company |
| **Face value** (par) | the amount repaid at maturity | ¤1,000 |
| **Coupon rate** | the yearly interest, as a share of face value, fixed at issue | 4 % |
| **Coupon** | the payment itself | ¤40 a year (or ¤20 twice a year) |
| **Maturity** | the date the face value is repaid | in 10 years |
| **Price** | what the bond costs today, often quoted per 100 of face | 92.28 = ¤922.78 |
| **Yield** | the return the price implies ([[yield-to-maturity]]) | 5 % |

The coupon and the face value never change; the **price** does, every trading day, because the market's interest rates change. That single fact, explained in [[bond-pricing]], is the key to everything about bonds.

### Who borrows
- **Governments** issue most bonds: treasuries, gilts, Bunds and their equivalents. In their own currency they are usually the safest borrowers in the country.
- **Local governments and agencies** — in the US, municipal bonds, whose interest is often free of federal income tax.
- **Companies** — corporate bonds, split into *investment grade* and *high yield* by their [[credit-risk|credit ratings]].
- **International institutions** such as development banks.

### Zero-coupon bonds
Some bonds pay no coupons at all: you buy them below face value and receive the face value at maturity. The price is simply the [[present-value|present value]] of that one payment. At a 4 % yield, ¤1,000 in ten years costs $1\\,000/1.04^{10} = ¤675.56$ today. Treasury bills are zero-coupon bonds of a year or less ([[money-market]]).

### Why people hold bonds
- **Predictable income**: the coupons are fixed in advance.
- **Return of capital**: if the issuer does not default, you get the face value back at maturity, whatever prices did in between.
- **Balance**: high-quality government bonds have often risen when shares fell sharply — often, not always: in 2022, when rates rose fast, both fell together ([[diversification]]).

### Buying them
New government bonds are sold at auctions; some countries also sell savings bonds directly to the public. Existing bonds trade through brokers and banks. Buy between coupon dates and you also pay the seller the interest earned so far — **accrued interest** — which comes back to you with the next coupon. Most individuals hold bonds through **bond funds**: easy and diversified, but a fund never matures, so its price moves with rates for ever, by an amount its [[duration]] tells you.

> [!note] A bond is not a bank deposit. It is not covered by [[deposit-insurance|deposit insurance]], its price moves, and a company that fails may repay only part of it. Those are the costs of its higher expected return.
`,
  ideas: [
    'A bond is a tradable loan: fixed coupons along the way and the face value at maturity.',
    'The coupon and the face value never change; the price moves every day with market interest rates.',
    'A zero-coupon bond pays only its face value, so its price is simply the present value of that one payment.',
    'Held to maturity, a bond from an issuer that does not default returns exactly what it promised, whatever its price did in between.',
    'Bond funds never mature: their prices keep moving with rates.'
  ],
  pitfalls: [
    'A bond is as safe as a savings account — It is not insured by deposit insurance, its price moves, and a company can default. Government bonds in their own currency are the closest thing, and even their prices move.',
    'The coupon rate is my return — Only if you bought at face value and hold to maturity; at any other price the return is the yield, not the coupon.',
    'A bond fund works like one bond held to maturity — A fund keeps buying new bonds and never matures; its value moves with rates for as long as you hold it.'
  ],
  formulas: [
    {
      name: 'Yearly coupon income',
      expr: 'C = F*c',
      vars: {
        C: { name: 'coupons received per year', q: 'money', unit: '$' },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate', q: 'ratio', unit: '%', value: 4 }
      },
      stories: { C: 'A bond with a face value of {F} has a coupon rate of {c}. How much does it pay each year?' }
    },
    {
      name: 'Current yield',
      expr: 'Y = F*c/P', tex: 'Y = \\frac{F\\,c}{P}',
      vars: {
        Y: { name: 'current yield', q: 'ratio', unit: '%' },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate', q: 'ratio', unit: '%', value: 4 },
        P: { name: 'price paid', q: 'money', unit: '$', value: 922.78 }
      },
      note: 'The coupon income as a share of the price. It ignores the gain or loss when the bond is repaid at face value — the yield to maturity includes it.',
      practice: { unknowns: ['Y', 'P'] },
      stories: {
        Y: 'You buy a bond with a face value of {F} and a coupon rate of {c} for {P}. What is its current yield?',
        P: 'A bond with a face value of {F} and a coupon of {c} has a current yield of {Y}. What is its price?'
      }
    },
    {
      name: 'Price of a zero-coupon bond',
      expr: 'P = F/(1 + y)^T', tex: 'P = \\frac{F}{(1 + y)^{T}}',
      vars: {
        P: { name: 'price today', q: 'money', unit: '$' },
        F: { name: 'face value repaid at maturity', q: 'money', unit: '$', value: 1000 },
        y: { name: 'yield (yearly)', q: 'ratio', unit: '%', value: 4, min: 0.01, max: 50 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 10 }
      },
      practice: { unknowns: ['P', 'y', 'T'] },
      stories: {
        P: 'A zero-coupon bond will pay {F} in {T}. At a yield of {y}, what does it cost today?',
        y: 'A zero-coupon bond costs {P} today and pays {F} in {T}. What yearly yield does it give?',
        T: 'A zero-coupon bond costs {P} and pays {F} at maturity; its yield is {y}. How far away is maturity?'
      }
    }
  ],
  examples: [
    {
      title: 'What a ¤1,000 bond pays',
      q: 'A ten-year bond with a face value of ¤1,000 and a 4 % coupon, paid once a year. What will it pay you if you buy it at issue and hold it to the end?',
      steps: [
        'Coupon: $1\\,000 \\times 0.04 = ¤40$ at the end of each year, ten times: ¤400.',
        'At maturity, the face value: ¤1,000, together with the last coupon.',
        'In all ¤1,400 for ¤1,000 lent — 4 % a year, as promised, if the issuer pays.'
      ],
      a: '¤40 a year for ten years and ¤1,000 at the end: ¤1,400 in all.'
    },
    {
      title: 'Pricing a zero-coupon bond',
      q: 'A zero-coupon bond pays ¤1,000 in ten years. What is it worth at a 4 % yield, and at 5 %?',
      steps: [
        { text: 'At 4 %:', tex: 'P = \\frac{1\\,000}{1.04^{10}} = ¤675.56' },
        { text: 'At 5 %:', tex: 'P = \\frac{1\\,000}{1.05^{10}} = ¤613.91' },
        'One point more of yield lowers the price by 9.1 %: a zero-coupon bond is very sensitive to rates.'
      ],
      a: '¤675.56 at 4 %, ¤613.91 at 5 %.'
    }
  ],
  quiz: [
    { q: 'A bond has a face value of ¤1,000 and a 5 % coupon. How much does it pay in coupons each year?', answer: 50, unit: '$',
      why: 'The coupon rate applies to the face value, not to the price: 1,000 × 0.05 = ¤50 a year, whatever the bond now costs.' },
    { q: 'A bond is quoted at 97. That means…', choices: ['it yields 97 %', 'it costs 97 % of its face value', 'it has 97 months to maturity', 'it has a 97 % chance of being repaid'], a: 1,
      why: 'Bond prices are usually quoted per 100 of face value: 97 means ¤970 for a ¤1,000 bond.' },
    { q: 'If you hold a bond to maturity and the issuer does not default, the price swings in between do not change what you receive.', a: true,
      why: 'The coupons and the face value are fixed; price swings matter only if you sell before maturity (or for the value of your holding on paper).' },
    { q: 'A zero-coupon bond pays…', choices: ['a coupon but no face value', 'only its face value, at maturity', 'a variable coupon', 'nothing, it is a gift'], a: 1,
      why: 'It is bought at a discount and pays one amount — the face value — at maturity. The discount is the interest.' },
    { q: 'Which of these is normally NOT covered by deposit insurance?', choices: ['a current account', 'a savings account', 'a corporate bond', 'a term deposit at an insured bank'], a: 2,
      why: 'Deposit insurance protects bank deposits up to a limit; bonds, even bought through a bank, are investments whose value can fall.' }
  ],
  applications: ['Reading a bond\'s terms: issuer, face value, coupon, maturity.', 'Understanding what a bond fund in a pension or savings plan holds.', 'Comparing a government bond with a fixed-term bank deposit.'],
  sim: { id: 'lb-price-yield', params: { c: 4, T: 10, y: 4 } }
},

/* ================================================================ PRICES AND RATES */
{
  id: 'bond-pricing', parent: 'bonds', title: 'Bond prices and interest rates', level: 2,
  short: 'A bond\'s price is the present value of its coupons and face value at the market\'s yield. When yields rise, prices fall — long bonds most of all — and as maturity approaches every price is pulled back to face value.',
  keywords: ['bond price', 'bond valuation', 'discounting', 'interest rate risk', 'premium', 'discount', 'par', 'pull to par', 'prices fall when rates rise', 'convexity', 'clean price'],
  prereq: ['bond-basics', 'present-value', 'annuities', 'math:geometric-series'],
  related: ['yield-to-maturity', 'duration', 'yield-curve', 'monetary-policy', 'npv'],
  body: `
You own the ¤1,000, 4 % ten-year bond. The next day the government issues new ten-year bonds paying 5 %. Nobody will now pay ¤1,000 for your ¤40 a year when ¤1,000 buys ¤50 elsewhere. Your bond's coupon cannot change, so its **price** must: it falls until a buyer earns 5 % on it too. That is the whole mechanism — the price is the adjusting part of a bond.

### The price is the value of the promises
Each payment is worth its [[present-value|present value]] at the market's yield $y$, and the price is their sum:

$$P = \\sum_{k=1}^{n} \\frac{C}{(1+y)^k} + \\frac{F}{(1+y)^n} = C\\,\\frac{1 - (1+y)^{-n}}{y} + \\frac{F}{(1+y)^n}$$

At 5 % our bond's ten coupons are worth ¤308.87 today and its face value ¤613.91, so it costs **¤922.78**. At 4 % — its own coupon rate — the price is exactly ¤1,000.

| Market yield | 3 % | 4 % | 5 % | 6 % |
|---|---:|---:|---:|---:|
| Price of the 4 %, 10-year bond | ¤1,085.30 | ¤1,000.00 | ¤922.78 | ¤852.80 |

A bond whose coupon is above the market yield trades at a **premium** (above face value), one whose coupon is below at a **discount**, and one whose coupon equals the yield at **par**. A discount says nothing bad about the issuer; it only says the coupon was set when rates were lower.

### Longer bonds swing more
The further away a payment, the more a change in the yield changes its present value. When yields rise from 4 % to 5 %, 4 % bonds lose:

| Maturity | 1 year | 2 years | 5 years | 10 years | 30 years |
|---|---:|---:|---:|---:|---:|
| Price change | −0.95 % | −1.86 % | −4.33 % | −7.72 % | −15.37 % |

A 30-year zero-coupon bond loses 24.96 % for the same one-point rise. This is **interest-rate risk**, measured by [[duration]]. Notice also that the curve bends: a fall from 4 % to 3 % *raises* the 10-year bond by 8.53 %, more than the 7.72 % it loses on a rise. That bend is called convexity.

### The pull to par
As maturity approaches, fewer payments remain to be discounted, so the price drifts towards face value whatever happens. If yields stay at 5 %, our bond is worth ¤922.78 now, ¤928.92 a year later, ¤956.71 with five years left and ¤990.48 with one. A 6 % bond, bought at a premium of ¤1,077.22, drifts down the same way to ¤1,009.52. The drift is part of the return: the discount bond's holder earns 5 % a year, of which 4 points come as coupons and the rest as the price climbing back to par.

### What it means for you
A rise in rates is a loss on paper today and higher income tomorrow: every coupon can be reinvested at the new rate. If you hold a bond to maturity you receive exactly the promised amounts; the price in between matters only if you sell. When rates rose quickly in 2022, broad high-quality bond indices in several countries fell by more than 10 % — a shock for people who thought bonds could not fall — and the same bonds then offered much higher yields to anyone buying or reinvesting.

> [!key] Price and yield are two ways of saying the same thing, and they always move in opposite directions.
`,
  ideas: [
    'A bond\'s price is the sum of its coupons and face value, each discounted at the market yield.',
    'Yields up, prices down: the coupon is fixed, so the price adjusts until new buyers earn the market yield.',
    'Coupon above yield: premium; coupon below yield: discount; equal: par.',
    'The longer the maturity, the larger the price change for a given change in yield.',
    'As maturity approaches, the price is pulled towards face value.'
  ],
  pitfalls: [
    'A bond trading below face value must be in trouble — Usually it just pays a coupon below today\'s rates; the discount makes its yield match the market.',
    'Bonds cannot lose money — Their prices fall when yields rise, and long bonds can fall a lot: a 30-year bond loses about 15 % when yields rise one point from 4 %.',
    'A price fall is a permanent loss — For a bond held to maturity from an issuer that pays, the price returns to face value; the fall is the market marking the old coupon down against new, higher ones.'
  ],
  derivation: {
    title: 'The bond price as a sum of discounted payments',
    steps: [
      { text: 'A bond with face value $F$ pays a coupon $C = cF$ at the end of each of $n$ years and $F$ at the end. At a yield $y$ each payment is worth its present value:', tex: 'P = \\frac{C}{1+y} + \\frac{C}{(1+y)^2} + \\dots + \\frac{C}{(1+y)^n} + \\frac{F}{(1+y)^n}' },
      { text: 'The coupons form a geometric series with first term $C/(1+y)$ and ratio $1/(1+y)$:', tex: '\\sum_{k=1}^{n} \\frac{C}{(1+y)^k} = C\\,\\frac{1 - (1+y)^{-n}}{y}' },
      { text: 'So the price is an annuity plus a single discounted payment:', tex: 'P = C\\,\\frac{1 - (1+y)^{-n}}{y} + F\\,(1+y)^{-n}' },
      { text: 'When $y = c$, substituting $C = yF$ gives $P = F(1 - (1+y)^{-n}) + F(1+y)^{-n} = F$: a bond whose coupon equals the yield is priced at par.', tex: 'y = c \\;\\Rightarrow\\; P = F' },
      { text: 'Every term has $y$ in its denominator, so a higher yield lowers every term — and the far terms, with the largest powers, the most. Hence long bonds are the most sensitive.' }
    ]
  },
  formulas: [
    {
      name: 'Price of a bond (yearly coupons)',
      expr: 'P = F*c*(1 - (1 + y)^(-T))/y + F*(1 + y)^(-T)',
      tex: 'P = F\\,c\\,\\frac{1 - (1 + y)^{-T}}{y} + F\\,(1 + y)^{-T}',
      vars: {
        P: { name: 'price', q: 'money', unit: '$' },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate', q: 'ratio', unit: '%', value: 4 },
        y: { name: 'market yield', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'Solve for $y$ to find the yield of a bond from its price. On a coupon date, before accrued interest.',
      practice: { unknowns: ['P', 'y'] },
      stories: {
        P: 'A bond with a face value of {F} pays a coupon of {c} once a year for {T}. Similar bonds yield {y}. What is its price?',
        y: 'A {T} bond with a face value of {F} and a {c} coupon costs {P}. What yield does the market demand?'
      }
    },
    {
      name: 'Price of a bond (coupons twice a year)',
      expr: 'P = F*c/2*(1 - (1 + y/2)^(-2*T))/(y/2) + F*(1 + y/2)^(-2*T)',
      tex: 'P = \\frac{F\\,c}{2}\\,\\frac{1 - (1 + y/2)^{-2T}}{y/2} + F\\,(1 + y/2)^{-2T}',
      vars: {
        P: { name: 'price', q: 'money', unit: '$' },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate (yearly)', q: 'ratio', unit: '%', value: 4 },
        y: { name: 'market yield (yearly, compounded twice a year)', q: 'ratio', unit: '%', value: 5, min: 0.01, max: 50 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'The convention for US Treasuries and many corporate bonds: half the coupon every six months, and the yield quoted as twice the half-yearly rate.',
      practice: { unknowns: ['P'] },
      stories: { P: 'A {T} bond with a face value of {F} pays a {c} coupon in two halves each year. At a yield of {y}, what is it worth?' }
    }
  ],
  examples: [
    {
      title: 'Pricing a 4 % bond at 5 %',
      q: 'A ¤1,000 bond pays a 4 % coupon once a year and matures in ten years. Similar bonds now yield 5 %. What is it worth?',
      steps: [
        '$1.05^{-10} = 0.61391$.',
        'Coupons: $40 \\times (1 - 0.61391)/0.05 = 40 \\times 7.7217 = ¤308.87$.',
        'Face value: $1\\,000 \\times 0.61391 = ¤613.91$.',
        'Price: $308.87 + 613.91 = ¤922.78$ — a discount of ¤77.22, which a buyer earns back as the price rises to ¤1,000 by maturity.'
      ],
      a: '¤922.78.'
    },
    {
      title: 'Short and long bonds when rates rise',
      q: 'You hold ¤10,000 of 2-year bonds and ¤10,000 of 30-year bonds, both paying 4 % and priced at par. Yields rise by one point. What happens?',
      steps: [
        'The 2-year bond now prices at ¤981.41 per ¤1,000: −1.86 %, so ¤10,000 becomes ¤9,814.10.',
        'The 30-year bond prices at ¤846.28 per ¤1,000: −15.37 %, so ¤10,000 becomes ¤8,462.80.',
        'Both will still repay ¤10,000 at maturity; the 2-year holder gets there, and can reinvest at 5 %, much sooner.'
      ],
      a: 'The 2-year holding falls by about ¤186, the 30-year holding by about ¤1,537.'
    }
  ],
  quiz: [
    { q: 'Market yields rise. What happens to the prices of existing fixed-coupon bonds?', choices: ['they rise', 'they fall', 'they stay the same until maturity', 'only corporate bonds change'], a: 1,
      why: 'Their coupons are fixed, so their prices must fall until a new buyer earns the higher market yield.' },
    { q: 'A one-year zero-coupon bond will pay ¤1,000. The yield is 5 %. What is its price?', answer: 952.38, unit: '$',
      why: '1,000 / 1.05 = ¤952.38.' },
    { q: 'Yields rise by one point. Which of these loses the most?', choices: ['a 2-year bond with a 4 % coupon', 'a 10-year bond with a 4 % coupon', 'a 30-year bond with a 4 % coupon', 'a 30-year zero-coupon bond'], a: 3,
      why: 'The zero pays everything at the far end, so its whole value is discounted over 30 years: it loses about 25 %, against about 15 % for the 30-year coupon bond.' },
    { q: 'A bond\'s coupon is 6 % and similar bonds yield 5 %. It trades…', choices: ['below face value', 'at face value', 'above face value', 'at zero'], a: 2,
      why: 'Its coupons are more generous than the market\'s, so buyers pay a premium; the premium shrinks to nothing by maturity.' },
    { q: 'A bond trading below its face value must be close to default.', a: false,
      why: 'A discount usually just means the coupon is below today\'s yields. Default risk shows up as a yield far above that of safe bonds of the same maturity.' }
  ],
  applications: ['Understanding why bond funds fall when central banks raise rates.', 'Valuing a bond from its coupons, maturity and the market yield.', 'Seeing why long-term bonds are riskier than short-term ones.'],
  sim: 'lb-price-yield'
},

/* ================================================================ YIELD TO MATURITY */
{
  id: 'yield-to-maturity', parent: 'bonds', title: 'Yield to maturity', level: 2,
  short: 'The yield to maturity is the one rate that makes a bond\'s promised payments worth exactly its price — its internal rate of return if held to the end and paid in full. It is the number to compare, and it rests on assumptions worth knowing.',
  keywords: ['yield to maturity', 'YTM', 'redemption yield', 'current yield', 'coupon rate', 'internal rate of return', 'reinvestment risk', 'yield to call', 'yield to worst', 'realized return', 'holding period return'],
  prereq: ['bond-pricing', 'irr'],
  related: ['bond-basics', 'duration', 'yield-curve', 'credit-risk', 'term-deposits'],
  body: `
Three numbers are all called "yield", and they answer different questions. Take a five-year bond with a 3 % coupon and a ¤1,000 face value that you can buy for ¤950.

- The **coupon rate**, 3 %, is fixed at issue: ¤30 a year.
- The **current yield** is the coupon over the price: $30/950 = 3.16\\,\\%$. It counts the income but not the ¤50 you gain when the bond is repaid at ¤1,000.
- The **yield to maturity** counts everything: the rate $y$ at which the five coupons and the face value are worth exactly ¤950.

$$950 = \\frac{30}{1+y} + \\frac{30}{(1+y)^2} + \\dots + \\frac{1\\,030}{(1+y)^5} \\quad\\Rightarrow\\quad y = 4.13\\,\\%$$

It is the bond's [[irr|internal rate of return]]. There is no formula for $y$; it is found by trial (at 4 % the right side is ¤955.48, too much; at 4.5 %, ¤934.15, too little) or by the calculator. A handy approximation spreads the discount over the years and divides by the average of price and face value:

$$y \\approx \\frac{C + (F - P)/n}{(F + P)/2} = \\frac{30 + 10}{975} = 4.10\\,\\%$$

### Premium bonds: the current yield flatters
An eight-year bond with a 5 % coupon costs ¤1,070. Its current yield is 4.67 %, but the ¤70 premium will be gone at maturity, so the yield to maturity is only 3.96 %. When a bond trades above par, its current yield overstates the return; below par, it understates it.

### What the YTM assumes
The YTM is the return you will earn **if** three things hold:
1. **You hold to maturity.** Sell earlier and your return depends on the price then. Buy our bond at ¤950; if after two years yields have risen to 6 %, it sells for ¤919.81 and your return is 1.58 % a year, not 4.13 %.
2. **Every payment is made.** A high YTM on a risky bond is a promise, not an expectation ([[credit-risk]]).
3. **Coupons are reinvested at the YTM.** If they can only earn 1 %, the ¤950 grows to a little less and the realized return is 3.95 %. The longer the bond and the higher the coupon, the more this matters — a risk called reinvestment risk.

Some bonds can be repaid early by the issuer — they are *callable*, and issuers call them when rates fall. For them, the **yield to call** or the lower of the two, the *yield to worst*, is the honest figure.

### The language of the market
Bond traders speak in yields rather than prices, because yields compare bonds of any coupon and maturity. "The ten-year yield rose to 4.5 %" means ten-year bond prices fell. A YTM is also what to set against a fixed-term deposit of the same length ([[term-deposits]]) — remembering the differences: the bond can be sold before maturity at whatever the market pays, and it has no deposit insurance.

> [!key] The YTM is a bond's promised yearly return if you hold it to maturity and all goes as promised. Compare bonds by it — and ask what would change it.
`,
  ideas: [
    'The yield to maturity is the rate at which the present value of all the promised payments equals the price.',
    'The current yield counts only the coupon; the YTM also counts the gain or loss as the price returns to face value.',
    'Above par, the current yield overstates the return; below par, it understates it.',
    'The YTM assumes you hold to maturity, every payment is made, and coupons are reinvested at the same rate.',
    'Rising yields and falling prices are the same news.'
  ],
  pitfalls: [
    'The yield to maturity is the return I will get, whatever happens — Only if you hold to maturity, the issuer pays in full, and the coupons are reinvested at the same rate.',
    'The higher the yield, the better the bond — A higher yield is the market\'s price for more risk: longer maturity, weaker issuer, lower liquidity or a call feature.',
    'The current yield is the bond\'s return — It ignores the gain or loss as the price returns to face value: 4.67 % against a true 3.96 % for the premium bond in the example.'
  ],
  formulas: [
    {
      name: 'Yield to maturity from the price',
      expr: 'P = F*c*(1 - (1 + y)^(-T))/y + F*(1 + y)^(-T)',
      tex: 'P = F\\,c\\,\\frac{1 - (1 + y)^{-T}}{y} + F\\,(1 + y)^{-T}',
      vars: {
        y: { name: 'yield to maturity', q: 'ratio', unit: '%', min: 0.01, max: 60 },
        P: { name: 'price paid', q: 'money', unit: '$', value: 950 },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate (paid yearly)', q: 'ratio', unit: '%', value: 3 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 5 }
      },
      solveFor: 'y',
      note: 'Found numerically: it is the internal rate of return of the bond held to maturity.',
      practice: { unknowns: ['y'] },
      stories: { y: 'You can buy a {T} bond with a face value of {F} and a {c} yearly coupon for {P}. What is its yield to maturity?' }
    },
    {
      name: 'Yield to maturity, the quick estimate',
      expr: 'Y = (F*c + (F - P)/T)/((F + P)/2)', tex: 'Y \\approx \\frac{F\\,c + (F - P)/T}{(F + P)/2}',
      vars: {
        Y: { name: 'approximate yield to maturity', q: 'ratio', unit: '%', signed: true },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate', q: 'ratio', unit: '%', value: 3 },
        P: { name: 'price', q: 'money', unit: '$', value: 950 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 5 }
      },
      note: 'Yearly income plus the discount spread evenly over the years, divided by the average amount invested. Within a few hundredths of a point for bonds near par.',
      practice: { unknowns: ['Y'] },
      stories: { Y: 'A {T} bond with a {c} coupon and a face value of {F} costs {P}. Estimate its yield to maturity.' }
    },
    {
      name: 'Realized return when coupons earn a different rate',
      expr: 'R = ((F*c*((1 + q)^T - 1)/q + F)/P)^(1/T) - 1',
      tex: 'R = \\left(\\frac{F\\,c\\,\\frac{(1+q)^T - 1}{q} + F}{P}\\right)^{1/T} - 1',
      vars: {
        R: { name: 'realized yearly return', q: 'ratio', unit: '%', signed: true },
        F: { name: 'face value', q: 'money', unit: '$', value: 1000 },
        c: { name: 'coupon rate', q: 'ratio', unit: '%', value: 3 },
        q: { name: 'rate the coupons are reinvested at', q: 'ratio', unit: '%', value: 1, min: 0.01, max: 50 },
        T: { name: 'years to maturity', q: 'years', unit: 'yr', value: 5 },
        P: { name: 'price paid', q: 'money', unit: '$', value: 950 }
      },
      note: 'Hold to maturity, reinvest each coupon at $q$ until then. With $q$ equal to the yield to maturity, $R$ is the YTM; here, at 1 %, it is 3.95 % instead of 4.13 %.',
      practice: { unknowns: ['R'] },
      stories: { R: 'You buy a {T} bond with a {c} coupon (face {F}) for {P} and can reinvest the coupons only at {q}. What yearly return do you realize if you hold it to maturity?' }
    }
  ],
  examples: [
    {
      title: 'A discount bond',
      q: 'A five-year bond with a 3 % yearly coupon and a ¤1,000 face value costs ¤950. Find its current yield and its yield to maturity.',
      steps: [
        'Current yield: $30/950 = 3.16\\,\\%$.',
        'Try 4 %: the payments are worth ¤955.48, more than ¤950, so the yield is higher. Try 4.5 %: ¤934.15, too low.',
        'Narrowing down: at 4.13 % the payments are worth ¤950.',
        'Quick estimate: $(30 + 50/5)/((1\\,000 + 950)/2) = 40/975 = 4.10\\,\\%$.'
      ],
      a: 'Current yield 3.16 %; yield to maturity 4.13 %.'
    },
    {
      title: 'When you sell before maturity',
      q: 'You bought that bond for ¤950. Two years later, with three years left, similar bonds yield 6 %. What do you get if you sell, and what was your return?',
      steps: [
        'Price with three years left at 6 %: $30 \\times (1 - 1.06^{-3})/0.06 + 1\\,000 \\times 1.06^{-3} = ¤919.81$.',
        'You received ¤30, ¤30, then ¤919.81 on selling.',
        'The rate at which these are worth ¤950 is 1.58 % a year — far below the 4.13 % you bought.',
        'Holding on instead, you would still earn the promised 4.13 % over the whole five years.'
      ],
      a: 'You sell for ¤919.81 and earn 1.58 % a year.'
    }
  ],
  quiz: [
    { q: 'Using the quick estimate, what is the yield to maturity of a 10-year bond with a 5 % coupon and a ¤1,000 face value, bought for ¤900? (in per cent)', answer: 6.32, unit: '%',
      why: '(50 + 100/10) / ((1,000 + 900)/2) = 60 / 950 = 6.32 %. The exact yield is 6.38 %.' },
    { q: 'When a bond trades above par, its yield to maturity is…', choices: ['higher than its current yield', 'lower than its current yield', 'equal to its coupon rate', 'negative'], a: 1,
      why: 'The premium is lost by maturity, which the YTM counts and the current yield does not.' },
    { q: 'The yield to maturity is the return you will earn whatever happens to interest rates.', a: false,
      why: 'It assumes you hold to maturity, the issuer pays, and coupons are reinvested at the same rate. Selling early or reinvesting at other rates changes the result.' },
    { q: 'The news says "the 10-year yield fell sharply". What happened to 10-year bond prices?', choices: ['they fell', 'they rose', 'nothing', 'it depends on the coupon'], a: 1,
      why: 'Yield and price move in opposite directions: a lower yield means buyers are paying more for the same fixed payments.' }
  ],
  applications: ['Comparing bonds with different coupons and maturities on one scale.', 'Comparing a bond with a fixed-term deposit of the same length.', 'Understanding the yields quoted in financial news.'],
  sim: { id: 'lb-price-yield', params: { c: 3, T: 5, y: 4.13 } }
},

/* ================================================================ DURATION */
{
  id: 'duration', parent: 'bonds', title: 'Duration and interest-rate risk', level: 3,
  short: 'Duration measures how sensitive a bond\'s price is to interest rates: with a modified duration of 8, a one-point rise in yields costs about 8 %. It is also the average time you wait for your money, and the horizon over which rate moves cancel out.',
  keywords: ['duration', 'Macaulay duration', 'modified duration', 'convexity', 'interest rate risk', 'price sensitivity', 'DV01', 'immunization', 'bond fund risk', 'rate shock'],
  prereq: ['bond-pricing', 'yield-to-maturity', 'math:derivative'],
  related: ['yield-curve', 'inflation-linked-bonds', 'money-market', 'asset-allocation', 'math:linear-approximation', 'math:taylor-series'],
  body: `
"If rates rise by one point, how much will my bonds fall?" is the question every bond holder should be able to answer, and **duration** answers it in one number. The 4 %, ten-year bond priced at par has a modified duration of 8.11: a one-point rise in yields lowers its price by about 8.11 %. (The exact fall is 7.72 %; we will see why the estimate is a little pessimistic.)

### Two meanings, one number
**Macaulay duration** is the average time you wait for your money, each payment weighted by its share of the price:

$$D = \\frac{1}{P}\\sum_{k} t_k\\,\\frac{CF_k}{(1+y)^{t_k}}$$

For the ten-year 4 % bond at 4 % it is 8.44 years: less than ten, because the coupons arrive earlier. A zero-coupon bond has only one payment, so its duration equals its maturity. Higher coupons shorten duration (a 10-year bond paying 8 % has 7.64 years at a 4 % yield; one paying 2 % has 9.07).

**Modified duration** is the sensitivity of the price to the yield, and it is simply the Macaulay duration divided by $(1 + y)$:

$$D^{*} = \\frac{D}{1+y}, \\qquad \\frac{\\Delta P}{P} \\approx -D^{*}\\,\\Delta y$$

$8.44/1.04 = 8.11$. The derivation below shows why the two are linked: the price's slope is the Macaulay duration in disguise.

| Bond (4 % coupon, at 4 %) | Modified duration | Estimate for +1 point | Actual |
|---|---:|---:|---:|
| 1 year | 0.96 | −0.96 % | −0.95 % |
| 5 years | 4.45 | −4.45 % | −4.33 % |
| 10 years | 8.11 | −8.11 % | −7.72 % |
| 30 years | 17.29 | −17.29 % | −15.37 % |

### Convexity: the curve bends in your favour
Duration draws a straight tangent to a curved price–yield line, so it misses a little — more for big moves and long bonds. Adding the **convexity** term corrects most of it:

$$\\frac{\\Delta P}{P} \\approx -D^{*}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2$$

For the ten-year bond $C = 80.75$, so a one-point rise gives $-8.11 + 0.40 = -7.71\\,\\%$, almost the exact −7.72 %. Because the square is always positive, falls are a little smaller and rises a little larger than duration alone says.

### Using it
- **In money**: ¤20,000 in a bond fund with a duration of 6.5 loses about $6.5 \\times 1.5\\,\\% \\times 20\\,000 = ¤1{,}950$ if yields rise by 1.5 points. Funds publish their duration: it is the most useful single risk number they give.
- **As a horizon**: the higher yield after a rise is not lost on you. If yields jump from 4 % to 5 % the day after you buy the ten-year bond, the coupons reinvested at 5 % make up for the lower price after about 8.4 years — its Macaulay duration. Hold for about the duration and small rate moves roughly cancel; that is how pension funds match bonds to future payments ("immunization").
- **For your plans**: money needed in two years is exposed to little price risk in a two-year bond or a short-duration fund, and to a great deal in a long-duration one ([[time-horizon]]).

> [!key] Duration is the bond's lever on interest rates: multiply it by the change in yield to get the change in price.
`,
  ideas: [
    'Macaulay duration is the present-value-weighted average time until the payments arrive; a zero-coupon bond\'s duration is its maturity.',
    'Modified duration, $D/(1+y)$, gives the percentage price change for a one-point change in yield, with the opposite sign.',
    'Longer maturities and lower coupons mean longer duration and more interest-rate risk.',
    'Convexity makes duration slightly overstate losses and understate gains; the error grows with the size of the move.',
    'Holding a bond for about its Macaulay duration roughly cancels the effect of a small rate change.'
  ],
  pitfalls: [
    'Two bonds with the same maturity have the same interest-rate risk — Coupons matter: a 10-year bond paying 8 % has a duration of 7.64 years, one paying 2 % has 9.07.',
    'Duration gives the exact price change — It is a straight-line estimate of a curve: close for small moves, too pessimistic for large rises (−17.29 % estimated against −15.37 % actual for a 30-year bond).',
    'A rise in rates only hurts bond holders — It lowers prices now and raises the income on everything reinvested; after about one duration the two effects roughly balance.'
  ],
  derivation: {
    title: 'Duration as the slope of the price',
    steps: [
      { text: 'Write the price as a sum over payments $CF_k$ at times $t_k$ (years), discounted at the yield $y$:', tex: 'P(y) = \\sum_k CF_k\\,(1+y)^{-t_k}' },
      { text: 'Differentiate with respect to $y$ — each term brings down its exponent:', tex: '\\frac{dP}{dy} = -\\sum_k t_k\\,CF_k\\,(1+y)^{-t_k - 1} = -\\frac{1}{1+y}\\sum_k t_k\\,CF_k\\,(1+y)^{-t_k}' },
      { text: 'The sum is the price times the Macaulay duration $D$ — the weighted average of the times:', tex: '\\frac{dP}{dy} = -\\frac{D}{1+y}\\,P = -D^{*}\\,P' },
      { text: 'So for a small change $\\Delta y$ the relative change in price is, to first order,', tex: '\\frac{\\Delta P}{P} \\approx -D^{*}\\,\\Delta y' },
      { text: 'The next term of the Taylor expansion uses the second derivative; divided by $P$ it is the convexity $C$, always positive for ordinary bonds:', tex: '\\frac{\\Delta P}{P} \\approx -D^{*}\\,\\Delta y + \\frac{1}{2}\\,C\\,(\\Delta y)^2, \\qquad C = \\frac{1}{P}\\frac{d^2P}{dy^2}' }
    ]
  },
  formulas: [
    {
      name: 'Price change from a change in yield',
      expr: 'R = -D*d + C*d^2/2', tex: 'R = -D^{*}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2',
      vars: {
        R: { name: 'relative change in price', q: 'ratio', unit: '%', signed: true },
        D: { name: 'modified duration (years)', value: 8.1109, tex: 'D^{*}' },
        d: { name: 'change in yield', q: 'ratio', unit: '%', value: 1, signed: true, tex: '\\Delta y' },
        C: { name: 'convexity', value: 80.75 }
      },
      note: 'Defaults: the 4 %, ten-year bond at par. Set $C = 0$ for the duration estimate alone (−8.11 %); with convexity it is −7.71 %, against −7.72 % exactly.',
      practice: { unknowns: ['R'] },
      stories: { R: 'A bond has a modified duration of {D} and a convexity of {C}. Yields change by {d}. By how much does its price change?' }
    },
    {
      name: 'Modified duration from Macaulay duration',
      expr: 'M = D/(1 + y/f)', tex: 'M = \\frac{D}{1 + y/f}',
      vars: {
        M: { name: 'modified duration (years)' },
        D: { name: 'Macaulay duration (years)', value: 8.4353 },
        y: { name: 'yield to maturity', q: 'ratio', unit: '%', value: 4 },
        f: { name: 'coupon payments per year', int: true, value: 1, min: 1 }
      },
      stories: { M: 'A bond paying coupons {f} time(s) a year has a Macaulay duration of {D} years at a yield of {y}. What is its modified duration?' }
    },
    {
      name: 'Money lost or gained on a holding',
      expr: 'Q = -D*V*d', tex: '\\Delta V = -D^{*}\\,V\\,\\Delta y',
      vars: {
        Q: { name: 'change in value', q: 'money', unit: '$', signed: true, tex: '\\Delta V' },
        D: { name: 'modified duration of the bond or fund (years)', value: 6.5, tex: 'D^{*}' },
        V: { name: 'value of the holding', q: 'money', unit: '$', value: 20000 },
        d: { name: 'change in yield', q: 'ratio', unit: '%', value: 1.5, signed: true, tex: '\\Delta y' }
      },
      note: 'The first-order estimate, before convexity. Bond funds publish their duration; this turns it into money.',
      practice: { unknowns: ['Q'] },
      stories: { Q: 'You hold {V} in a bond fund with a duration of {D}. Yields change by {d}. Roughly how much does your holding change?' }
    }
  ],
  examples: [
    {
      title: 'Estimate, then check',
      q: 'The 4 %, ten-year bond is priced at par (¤1,000). Its modified duration is 8.11 and its convexity 80.75. Estimate its price if yields rise to 5 % and if they fall to 3 %.',
      steps: [
        'Duration alone: $\\mp 8.11\\,\\%$, so ¤918.89 or ¤1,081.11.',
        'Convexity adds $\\tfrac{1}{2} \\times 80.75 \\times 0.01^2 = +0.40\\,\\%$ in both directions: −7.71 % and +8.51 %.',
        'Estimates: ¤922.93 and ¤1,085.15. Exact prices: ¤922.78 and ¤1,085.30.',
        'The loss (−7.72 %) is smaller than the gain (+8.53 %) for the same one-point move: convexity.'
      ],
      a: 'About ¤922.9 at 5 % and ¤1,085.2 at 3 %, within a few tenths of a unit of the exact prices.'
    },
    {
      title: 'A bond fund and a rate rise',
      q: 'You have ¤20,000 in a bond fund with a duration of 6.5 and a yield of 3.5 %. Yields rise by 1.5 points to 5 %. Estimate the loss — and how the higher yield changes the picture.',
      steps: [
        'Estimated loss: $6.5 \\times 0.015 \\times 20\\,000 = ¤1{,}950$, about 9.75 %.',
        'The fund\'s bonds now yield about 5 % instead of 3.5 %: 1.5 points more a year on the money reinvested.',
        'After roughly the fund\'s duration — about six and a half years — the extra income has made up the loss, if yields stay there.'
      ],
      a: 'About ¤1,950 lost at once; recovered by higher income over roughly the fund\'s duration.'
    }
  ],
  quiz: [
    { q: 'A bond has a modified duration of 5. Yields rise by half a point. Roughly how much does its price change, in per cent?', answer: -2.5, unit: '%',
      why: '−5 × 0.5 % = −2.5 %; convexity makes the true fall slightly smaller.' },
    { q: 'What is the Macaulay duration of a 7-year zero-coupon bond?', answer: 7, unit: 'yr',
      why: 'A zero has a single payment, at year 7, so the weighted average time is exactly 7 years.' },
    { q: 'Two bonds with the same maturity always have the same duration.', a: false,
      why: 'A higher coupon brings more of the value forward in time, shortening duration: 7.64 years for an 8 % coupon against 9.07 for a 2 % coupon, both over 10 years at 4 %.' },
    { q: 'Because of convexity, when yields fall by one point, a bond\'s price rises by…', choices: ['exactly the duration estimate', 'more than the duration estimate', 'less than the duration estimate', 'nothing'], a: 1,
      why: 'The price–yield curve bends upwards; the tangent line of duration lies below it on both sides, so gains are larger and losses smaller than it says.' },
    { q: 'You will need your money in about three years. To keep price swings small relative to that goal, which holding fits best?', choices: ['a 30-year bond', 'bonds or a fund with a duration of about 3 years', 'a fund with a duration of 15 years', 'duration does not matter'], a: 1,
      why: 'With a duration close to your horizon, a rise in rates lowers the price but raises the reinvestment income by roughly as much by the time you need the money.' }
  ],
  applications: ['Reading the duration of a bond fund and turning it into a possible loss in money.', 'Matching the duration of savings to the date the money is needed.', 'Understanding why long bonds and long-dated pension liabilities are so sensitive to rates.'],
  history: 'The Canadian-born economist Frederick Macaulay introduced duration in 1938, in a study of US interest rates and bond yields, as a better measure of a bond\'s "length" than its maturity. Its use as a measure of price risk, and the idea of immunizing a portfolio against rate changes, spread in the 1950s–70s.',
  sim: { id: 'lb-price-yield', params: { c: 4, T: 10, y: 4, dy: 1 } }
},

/* ================================================================ CREDIT RISK */
{
  id: 'credit-risk', parent: 'bonds', title: 'Credit risk and ratings', level: 2,
  short: 'A bond\'s yield is a promise; credit risk is the chance the promise is broken. The extra yield over a safe bond — the credit spread — pays for expected defaults, for the fear of them in bad times, and for being hard to sell.',
  keywords: ['credit risk', 'default', 'credit rating', 'investment grade', 'high yield', 'junk bond', 'credit spread', 'recovery rate', 'loss given default', 'expected loss', 'downgrade', 'sovereign default', 'seniority'],
  prereq: ['bond-basics', 'yield-to-maturity', 'math:expected-value'],
  related: ['bond-pricing', 'diversification', 'risk-and-return', 'recessions', 'financial-crises', 'credit-scores'],
  body: `
A government bond yields 4 % and a company's bond of the same maturity yields 7 %. The extra 3 points is the **credit spread**, and it is not a free lunch: it is the price of the chance that the company will not pay. Understanding what that chance costs turns a tempting number into an honest one.

### Expected loss
Suppose each year there is a 2 % chance that the company defaults, and that holders of a defaulted bond recover 40 % of the face value, after a long process. The expected loss is

$$\\text{expected loss} = p \\times (1 - R) = 0.02 \\times 0.6 = 1.2\\,\\%\\text{ a year}$$

So the 7 % promise is worth about $7 - 1.2 = 5.8\\,\\%$ on average (5.66 % counting that a defaulted bond also misses that year's coupon), still more than the government's 4 %. A spread of about 1.3 points would only just cover the expected loss; everything above is a reward for bearing the risk. Over five years, a 2 % yearly chance means 9.61 % of such borrowers are expected to default: hold one bond and you either lose most of it or not; hold a hundred and about ten fail.

### Why spreads are wider than expected losses
- **Defaults come together.** They cluster in recessions, exactly when jobs and shares are also suffering, so investors demand extra for bearing them ([[recessions]]).
- **Liquidity.** Corporate bonds trade less often than government bonds, and are harder to sell quickly in a panic.
- **Uncertainty.** Nobody knows the true default chance in advance.

In calm years the spreads on strong companies' bonds are often around 1–2 points; for the weakest borrowers several points more. In a crisis they jump — at the worst of 2008, spreads on US high-yield bonds rose above 15 points — and the prices of risky bonds fall accordingly.

### Ratings
Rating agencies grade borrowers with letters. On the most common scale: AAA, AA, A and BBB are **investment grade**; BB, B, CCC and below are **speculative grade**, better known as high yield or junk; D means default. (Another widely used scale writes Aaa, Aa, A, Baa, Ba, B, Caa.) Over long periods, the share of issuers that defaulted within five years has been a fraction of a percent for the top grades, around a percent or two for BBB, several percent for BB, more than ten percent for B, and roughly half for CCC and below.

Ratings are opinions, not guarantees. They change — a downgrade from BBB to BB, a "fallen angel", often forces some funds to sell and knocks the price down — and they can be badly wrong: many mortgage securities rated AAA before 2008 suffered heavy losses ([[financial-crises]]).

### Governments too
A government that borrows in its own currency can always create money to pay, so outright default is rare — though inflation can do the damage instead. Governments that borrow in a foreign currency, or in one they cannot print, can and do default: in 2012 private holders of Greek government bonds accepted losses of more than half of the face value.

### Where you stand in line
When a company fails, **secured** creditors are paid first from the assets pledged to them, then **senior** unsecured bonds, then **subordinated** ones, and shareholders last. Seniority changes the recovery, and so the expected loss.

> [!key] A high yield is a high *promise*. The expected return is roughly the yield minus the expected loss — and the actual one, for a single bond, is often much better or much worse. Spreading risk over many issuers is what makes it bearable ([[diversification]]).
`,
  ideas: [
    'The credit spread is the extra yield over a safe bond of the same maturity: it pays for the chance of default.',
    'Expected loss per year ≈ default probability × (1 − recovery rate).',
    'Expected return ≈ promised yield − expected loss; the rest of the spread rewards risk that bites in bad times.',
    'Investment grade runs from AAA to BBB; below that is high yield, where defaults are far more common.',
    'For one bond the outcome is all or much less; spreading over many issuers turns default into an average.'
  ],
  pitfalls: [
    'A 9 % yield means a 9 % return — It is a promise; after expected defaults the average return is lower, and a single bond can lose most of its value.',
    'A AAA rating means the bond cannot lose money — Ratings are opinions that can change or be wrong, and even the safest bond\'s price moves with interest rates.',
    'Government bonds are free of credit risk everywhere — Governments that borrow in a currency they cannot print, or in a foreign one, have defaulted.'
  ],
  formulas: [
    {
      name: 'Expected loss from default',
      expr: 'L = p*(1 - R)', tex: 'L = p\\,(1 - R)',
      vars: {
        L: { name: 'expected loss per year', q: 'ratio', unit: '%' },
        p: { name: 'chance of default in a year', q: 'ratio', unit: '%', value: 2, min: 0, max: 100 },
        R: { name: 'recovery rate', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 }
      },
      practice: { unknowns: ['L', 'p'] },
      stories: {
        L: 'A borrower has a {p} chance of default each year, and holders would recover {R} of the face value. What is the expected loss per year?',
        p: 'A bond\'s expected loss is {L} a year and the expected recovery is {R}. What yearly chance of default does that imply?'
      }
    },
    {
      name: 'Expected return of a risky bond (approximate)',
      expr: 'E = g + s - p*(1 - R)', tex: 'E \\approx g + s - p\\,(1 - R)',
      vars: {
        E: { name: 'expected yearly return', q: 'ratio', unit: '%', signed: true },
        g: { name: 'safe government yield', q: 'ratio', unit: '%', value: 4 },
        s: { name: 'credit spread', q: 'ratio', unit: '%', value: 3 },
        p: { name: 'chance of default in a year', q: 'ratio', unit: '%', value: 2, min: 0, max: 100 },
        R: { name: 'recovery rate', q: 'ratio', unit: '%', value: 40, min: 0, max: 100 }
      },
      note: 'The promised yield minus the expected loss — before any reward for risk is counted, and ignoring that a defaulted bond also misses its coupon (which lowers the example from 5.8 % to 5.66 %).',
      practice: { unknowns: ['E', 's'] },
      stories: {
        E: 'A company bond yields {s} more than a government bond at {g}. The yearly default chance is {p} with a recovery of {R}. About what return should you expect?',
        s: 'The government yield is {g}; a borrower has a {p} yearly chance of default and a recovery of {R}. What spread gives an expected return of {E}?'
      }
    },
    {
      name: 'Chance of surviving several years',
      expr: 'S = (1 - p)^T', tex: 'S = (1 - p)^{T}',
      vars: {
        S: { name: 'chance of no default', q: 'ratio', unit: '%' },
        p: { name: 'chance of default in a year', q: 'ratio', unit: '%', value: 2, min: 0, max: 99 },
        T: { name: 'years', q: 'years', unit: 'yr', value: 5 }
      },
      note: 'For a constant yearly chance. Out of 100 such borrowers, about $100(1 - S)$ default within $T$ years.',
      stories: { S: 'A borrower has a {p} chance of default each year. What is the chance it survives {T} without default?' }
    }
  ],
  examples: [
    {
      title: 'Is a 3-point spread enough?',
      q: 'A company bond yields 7 %, a government bond 4 %. The company has a 2 % chance of default each year; recovery would be 40 %. What return should you expect, and what spread would only just cover the expected loss?',
      steps: [
        'Expected loss: $0.02 \\times (1 - 0.4) = 1.2\\,\\%$ a year.',
        'Expected return ≈ $7 - 1.2 = 5.8\\,\\%$; counting the missed coupon in a default year, $0.98 \\times 1.07 + 0.02 \\times 0.4 - 1 = 5.66\\,\\%$.',
        { text: 'Break-even spread $s$: the risky bond must return on average what the safe one does,', tex: '0.98\\,(1.04 + s) + 0.02 \\times 0.4 = 1.04 \\;\\Rightarrow\\; s = 1.31\\,\\%' },
        'The remaining 1.7 points of the 3-point spread are the reward for bearing a risk that tends to strike in bad times.'
      ],
      a: 'About 5.7–5.8 % expected; 1.31 points of spread would only just cover the expected loss.'
    },
    {
      title: 'A hundred bonds for five years',
      q: 'You spread ¤10,000 over 100 bonds of similar borrowers, each with a 2 % chance of default a year. How many defaults should you expect over five years?',
      steps: [
        'Chance a borrower survives five years: $0.98^5 = 90.39\\,\\%$.',
        'Expected defaults: $100 \\times (1 - 0.9039) = 9.6$ — about ten.',
        'With 40 % recovered, those ten cost about 6 % of the portfolio — spread over five years, and paid for by the extra coupons of the ninety that survive.',
        'With one bond instead of a hundred, the same average hides a 9.6 % chance of losing 60 % of your money.'
      ],
      a: 'About ten defaults; diversification turns them into a predictable cost.'
    }
  ],
  quiz: [
    { q: 'A borrower has a 3 % yearly chance of default and holders would recover 50 %. What is the expected loss per year, in per cent?', answer: 1.5, unit: '%',
      why: '0.03 × (1 − 0.5) = 1.5 % a year.' },
    { q: 'Which is the lowest rating still counted as investment grade?', choices: ['AA', 'A', 'BBB−', 'BB+'], a: 2,
      why: 'Investment grade runs from AAA down to BBB− (Baa3 on the other common scale); BB+ and below are speculative grade.' },
    { q: 'A bond with a 9 % yield will, on average, return 9 %.', a: false,
      why: 'The yield is what is promised. Subtract the expected loss from defaults to get the average return, and expect individual bonds to differ widely.' },
    { q: 'Why do credit spreads widen sharply in recessions?', choices: ['governments forbid corporate bonds', 'defaults rise and investors demand more to hold risk when they are losing elsewhere', 'coupons are cut by law', 'ratings stop being published'], a: 1,
      why: 'More borrowers fail in recessions, and investors, hit on all sides, want a larger reward for holding what might fail — so risky bond prices fall.' },
    { q: 'With a 2 % chance of default each year, what share of borrowers survive five years without default, in per cent?', answer: 90.39, unit: '%',
      why: '0.98⁵ = 0.9039, so about 90.4 % survive and 9.6 % default.' }
  ],
  applications: ['Judging whether a high-yield bond or fund pays enough for its risk.', 'Understanding why corporate bond funds fall in recessions.', 'Reading credit ratings for what they are: informed opinions about default.'],
  sim: 'lb-credit'
},

/* ================================================================ THE YIELD CURVE */
{
  id: 'yield-curve', parent: 'bonds', title: 'The yield curve', level: 2,
  short: 'Yields on government bonds of every maturity, drawn as one line. Normally it slopes upwards; flat or inverted, it tells you the market expects rates to fall — and it sets the price of fixed and variable mortgages alike.',
  keywords: ['yield curve', 'term structure', 'inverted yield curve', 'normal yield curve', 'flat curve', 'term premium', 'forward rate', 'expectations', 'term spread', 'recession signal', '2s10s'],
  prereq: ['yield-to-maturity', 'bond-pricing', 'monetary-policy'],
  related: ['duration', 'money-market', 'fixed-rate-mortgages', 'variable-rate-mortgages', 'recessions', 'quantitative-easing', 'central-banks'],
  body: `
Line up a government's bonds by maturity — three months, two years, ten years, thirty years — and draw their yields: that line is the **yield curve**. It is one of the most watched pictures in finance, because it summarises what the market charges for lending over each length of time, and what it expects rates to do.

### Four shapes
- **Normal (upward)**: longer loans pay more — say 3 % for three months and 5 % for thirty years.
- **Flat**: every maturity pays about the same; often a turning point.
- **Inverted**: short-term yields are above long-term ones.
- **Humped**: the middle maturities pay most.

### What shapes it
**The short end follows the central bank.** Three-month and one-year yields stay close to the policy rate that the central bank sets ([[monetary-policy]]).

**Longer yields are expectations plus a premium.** Lending for two years at a fixed rate should earn about what lending for one year and then again for another would earn, so a two-year yield embeds the market's view of next year's one-year rate. With a one-year yield of 3 % and a two-year yield of 3.5 %, the rate implied for the second year — the **forward rate** — is

$$f = \\frac{(1.035)^2}{1.03} - 1 = 4.00\\,\\%$$

On top of expectations sits a **term premium**: lenders want extra for tying money up for long, with its greater [[duration|price risk]] and inflation uncertainty. That premium is why the curve usually slopes upwards even when no change in rates is expected. Long yields also move with growth and inflation expectations, and with the supply and demand of government bonds — central banks buying long bonds ([[quantitative-easing]]) push long yields down.

### Inversion
When the curve inverts, the market is saying it expects short rates to fall — usually because the central bank has raised them to fight inflation and a slowdown is expected to follow. With a one-year yield of 5 % and a two-year yield of 4.5 %, the implied rate for the second year is again about 4.00 %: a cut of a point is being priced in. In the US, the ten-year yield has fallen below short-term yields before every recession since the late 1960s, typically six months to two years ahead. It has also given false alarms and variable lags: a signal of expectations, not a law of nature ([[recessions]]).

### What it means for you
- **Mortgages.** Variable-rate loans follow the short end; fixed-rate mortgages are priced from longer yields ([[fixed-rate-mortgages]], [[variable-rate-mortgages]]). When the curve is inverted, a long fixed rate can be *cheaper* than a variable one — the market expects the variable rate to fall.
- **Savings.** On an inverted curve, short deposits and [[money-market|treasury bills]] can pay more than long bonds; locking in a longer rate gives up some yield today in exchange for keeping it if rates fall.
- **Bond funds.** Long-duration funds gain most when long yields fall, and lose most when they rise.

None of these tells you what to do. The curve is the market's best collective guess, and it is often wrong; what it gives you is the current price of each choice.

> [!key] The short end is set by the central bank; the long end by expectations of future short rates plus a premium for waiting. The slope tells you which way the market thinks rates will go.
`,
  ideas: [
    'The yield curve plots yields against maturity for bonds of one issuer, usually the government.',
    'The short end follows the central bank\'s policy rate; long yields reflect expected future short rates plus a term premium.',
    'Forward rates, implied by the curve, are the market\'s break-even for future short rates.',
    'An inverted curve means the market expects rates to fall; in the US it has preceded recessions, with false alarms and varying lags.',
    'Fixed-rate mortgages are priced from the long end, variable ones from the short end.'
  ],
  pitfalls: [
    'An inverted yield curve means a recession is certain — It is a signal of expectations with a good but imperfect record, and the lag has varied from months to about two years.',
    'Long bonds always pay more, so they are always the better deal — On an inverted curve they pay less, and even on a normal one the extra yield is payment for more price risk.',
    'Forward rates are forecasts that will come true — They are break-even rates that include a term premium; actual future rates often differ widely.'
  ],
  formulas: [
    {
      name: 'One-year forward rate from one- and two-year yields',
      expr: 'f = (1 + b)^2/(1 + a) - 1', tex: 'f = \\frac{(1 + b)^2}{1 + a} - 1',
      vars: {
        f: { name: 'implied one-year rate, one year from now', q: 'ratio', unit: '%', signed: true },
        a: { name: 'one-year yield', q: 'ratio', unit: '%', value: 3 },
        b: { name: 'two-year yield', q: 'ratio', unit: '%', value: 3.5 }
      },
      practice: { unknowns: ['f', 'b'] },
      stories: {
        f: 'One-year bonds yield {a} and two-year bonds {b}. What one-year rate, a year from now, does the curve imply?',
        b: 'One-year bonds yield {a}, and the market implies {f} for the following year. What is the two-year yield?'
      }
    },
    {
      name: 'Forward rate between two maturities',
      expr: 'f = ((1 + b)^U/(1 + a)^S)^(1/(U - S)) - 1',
      tex: 'f = \\left(\\frac{(1 + b)^{U}}{(1 + a)^{S}}\\right)^{1/(U - S)} - 1',
      vars: {
        f: { name: 'implied yearly rate between the two dates', q: 'ratio', unit: '%', signed: true },
        a: { name: 'yield to the earlier date', q: 'ratio', unit: '%', value: 4 },
        S: { name: 'earlier maturity', q: 'years', unit: 'yr', value: 2 },
        b: { name: 'yield to the later date', q: 'ratio', unit: '%', value: 4.5 },
        U: { name: 'later maturity', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'Lending to year $U$ must earn the same as lending to year $S$ and then at $f$ until $U$. The defaults give 4.63 % a year for years 2 to 10.',
      practice: { unknowns: ['f'] },
      stories: { f: 'The {S} yield is {a} and the {U} yield is {b}. What yearly rate does the curve imply between those dates?' }
    }
  ],
  examples: [
    {
      title: 'What an upward curve expects',
      q: 'One-year government bonds yield 3 %, two-year bonds 3.5 %. What one-year rate does the market imply for next year?',
      steps: [
        'Two years at 3.5 % grow ¤1 to $1.035^2 = 1.071225$.',
        'One year at 3 % gives 1.03; the second year must then turn 1.03 into 1.071225.',
        '$1.071225/1.03 = 1.04002$: a forward rate of 4.00 %.',
        'Part of it is a term premium, so the market\'s pure forecast is somewhat below 4 %.'
      ],
      a: 'About 4.00 % — a rise of about a point, before the term premium is allowed for.'
    },
    {
      title: 'What an inverted curve expects',
      q: 'One-year bonds yield 5 %, two-year bonds 4.5 %. What is implied for next year?',
      steps: [
        '$1.045^2 = 1.092025$; divided by 1.05 gives 1.04002.',
        'The forward rate is 4.00 %: a fall of about a point from today\'s 5 %.',
        'This is how an inverted curve prices in cuts — usually expected because the economy is expected to slow.'
      ],
      a: 'About 4.00 %: the market expects short rates to fall by roughly a point.'
    }
  ],
  quiz: [
    { q: 'An inverted yield curve means that…', choices: ['long-term yields are above short-term yields', 'short-term yields are above long-term yields', 'all yields are negative', 'the central bank has stopped setting rates'], a: 1,
      why: 'Inverted means the usual upward slope has turned downward: short maturities pay more than long ones.' },
    { q: 'The one-year yield is 2 % and the two-year yield 3 %. What one-year rate does the curve imply for next year, in per cent?', answer: 4.01, unit: '%',
      why: '1.03² / 1.02 − 1 = 4.01 %.' },
    { q: 'An inverted yield curve means a recession will certainly follow.', a: false,
      why: 'Inversions have preceded US recessions since the late 1960s, but with varying lags and some false alarms: they reflect expectations, not certainty.' },
    { q: 'Which part of the curve does the central bank influence most directly?', choices: ['the 30-year yield', 'the short end, up to about a year', 'the 10-year yield', 'none of it'], a: 1,
      why: 'Short-term yields track the policy rate closely; long yields depend on expectations, inflation and a term premium.' }
  ],
  applications: ['Reading financial news about "curve inversion".', 'Understanding why fixed and variable mortgage rates move differently.', 'Seeing what the market expects the central bank to do.'],
  history: 'The link between an inverted curve and later recessions was set out by the economist Campbell Harvey in the mid-1980s, and it has been studied — and debated — ever since.',
  sim: 'lb-yield-curve'
},

/* ================================================================ INFLATION-LINKED BONDS */
{
  id: 'inflation-linked-bonds', parent: 'bonds', title: 'Inflation-linked bonds', level: 2,
  short: 'Bonds whose face value, and so their coupons, rise with a price index: they promise a real return instead of a money one. The gap between ordinary and linked yields is the market\'s break-even inflation.',
  keywords: ['inflation-linked bond', 'index-linked bond', 'TIPS', 'linkers', 'index-linked gilts', 'real yield', 'break-even inflation', 'CPI-linked', 'indexation', 'deflation floor', 'real return'],
  prereq: ['bond-pricing', 'real-vs-nominal', 'inflation-purchasing-power'],
  related: ['index-linked-mortgages', 'duration', 'yield-curve', 'inflation-cpi', 'retirement-income'],
  body: `
An ordinary bond promises money: ¤1,000 in ten years. If prices rise 3 % a year in the meantime, that ¤1,000 will buy only what ¤744.09 buys today. An **inflation-linked bond** promises purchasing power instead: its face value is multiplied by the rise in a consumer price index, and the coupon is paid on the raised amount. What it guarantees — if the issuer pays — is a **real** return.

### How the indexation works
Take a ten-year linked bond with a ¤1,000 face value and a 1 % real coupon. If the index rises 3 % a year, the face value after ten years is $1\\,000 \\times 1.03^{10} = ¤1{,}343.92$, and the last coupon is 1 % of that, ¤13.44. In between, every coupon grows the same way.

Many governments issue them: US Treasury Inflation-Protected Securities (TIPS), UK index-linked gilts, French and Italian bonds linked to national or euro-area prices, and others in Canada, Australia, Japan and much of Latin America. In Israel CPI-linked government bonds are a large part of the market — the mirror image of the CPI-linked mortgages many Israelis carry ([[index-linked-mortgages]]). The details differ: which index, the lag before it applies (a few months in most countries), and whether the face value is protected against deflation — US TIPS repay at least the original face value at maturity.

### Break-even inflation
Compare a nominal ten-year bond yielding 4.2 % with a linked one yielding a real 1.8 %. Which is better depends on inflation. They pay the same if inflation averages the **break-even** rate:

$$\\pi^{*} = \\frac{1 + n}{1 + r} - 1 = \\frac{1.042}{1.018} - 1 = 2.36\\,\\%$$

(The quick subtraction $4.2 - 1.8 = 2.4$ is close.) With ¤10,000 left to grow for ten years:

| Average inflation | Nominal bond | Linked bond |
|---|---:|---:|
| 1 % | ¤15,089.58 | ¤13,203.57 |
| 2.36 % | ¤15,089.58 | about ¤15,090 |
| 4 % | ¤15,089.58 | ¤17,693.39 |

The break-even is the market's inflation forecast plus a small insurance premium, and central banks watch it closely. Buying the linked bond is not a bet that inflation will be high; it is a way of not having to bet at all.

### What they do not protect against
- **Changes in real yields.** Linked bonds have [[duration]] like any other: when real yields rose sharply in 2022, long linked bonds fell heavily in price, even while inflation was high. Only holders to maturity got the promised real return.
- **Your own inflation.** The index is an average basket; your costs may rise faster or slower.
- **Taxes.** In some countries the indexation is taxed each year as income though it is paid only at maturity — in the US, TIPS holders owe tax on it yearly.
- **Negative real yields.** Real yields can be below zero, as they were in several countries around 2020–2021: then the bond guarantees a small, certain loss of purchasing power — which may still be better than a larger, uncertain one.

> [!key] Ordinary bonds fix the money; linked bonds fix the purchasing power. The break-even inflation rate tells you which one the market thinks is cheaper.
`,
  ideas: [
    'An inflation-linked bond raises its face value with a price index, and pays its coupon on the raised amount.',
    'It promises a real return; an ordinary bond promises a money return.',
    'Break-even inflation, $(1+n)/(1+r) - 1$, is the average inflation at which both pay the same.',
    'Linked bonds still move in price when real yields change; only holders to maturity get the promised real return.',
    'Details — the index, the lag, deflation protection, tax — differ from country to country.'
  ],
  pitfalls: [
    'An inflation-linked bond cannot lose value — Its price falls when real yields rise; long linked bonds fell sharply in 2022 while inflation was high.',
    'Buy linked bonds when you expect high inflation — They beat nominal bonds only if inflation exceeds the break-even already priced in.',
    'The indexation matches my cost of living — It follows an average basket; your own prices may rise faster or slower.'
  ],
  formulas: [
    {
      name: 'Break-even inflation',
      expr: 'p = (1 + n)/(1 + r) - 1', tex: '\\pi^{*} = \\frac{1 + n}{1 + r} - 1',
      vars: {
        p: { name: 'break-even inflation', q: 'ratio', unit: '%', signed: true, tex: '\\pi^{*}' },
        n: { name: 'nominal bond yield', q: 'ratio', unit: '%', value: 4.2 },
        r: { name: 'real yield of the linked bond', q: 'ratio', unit: '%', value: 1.8, signed: true }
      },
      practice: { unknowns: ['p', 'r'] },
      stories: {
        p: 'A nominal bond yields {n} and an inflation-linked bond of the same maturity a real {r}. What average inflation makes them pay the same?',
        r: 'Nominal bonds yield {n} and the market\'s break-even inflation is {p}. What real yield do linked bonds offer?'
      }
    },
    {
      name: 'Indexed face value',
      expr: 'F = F0*(1 + i)^T', tex: 'F = F_0\\,(1 + i)^{T}',
      vars: {
        F: { name: 'face value after indexation', q: 'money', unit: '$' },
        F0: { name: 'original face value', q: 'money', unit: '$', value: 1000 },
        i: { name: 'average inflation', q: 'ratio', unit: '%', value: 3, signed: true },
        T: { name: 'years', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'The coupon is the real coupon rate times this amount. In practice the face value is multiplied by the ratio of the index today to the index at issue.',
      stories: { F: 'A linked bond of {F0} is indexed to prices that rise {i} a year. What is its face value after {T}?' }
    },
    {
      name: 'What a fixed payment will buy',
      expr: 'R = N/(1 + i)^T', tex: 'R = \\frac{N}{(1 + i)^{T}}',
      vars: {
        R: { name: 'value in today\'s money', q: 'money', unit: '$' },
        N: { name: 'fixed payment in the future', q: 'money', unit: '$', value: 1000 },
        i: { name: 'average inflation', q: 'ratio', unit: '%', value: 3 },
        T: { name: 'years until it is paid', q: 'years', unit: 'yr', value: 10 }
      },
      stories: { R: 'An ordinary bond will repay {N} in {T}. If prices rise {i} a year, what is that worth in today\'s money?' }
    }
  ],
  examples: [
    {
      title: 'Which bond wins?',
      q: 'A ten-year nominal bond yields 4.2 %, a ten-year linked bond 1.8 % real. Find the break-even inflation, and the result on ¤10,000 if inflation averages 1 % or 4 %.',
      steps: [
        'Break-even: $1.042/1.018 - 1 = 2.36\\,\\%$.',
        'Nominal, whatever inflation does: $10\\,000 \\times 1.042^{10} = ¤15{,}089.58$.',
        'Linked at 1 % inflation: $10\\,000 \\times (1.018 \\times 1.01)^{10} = ¤13{,}203.57$ — the nominal bond wins.',
        'Linked at 4 %: $10\\,000 \\times (1.018 \\times 1.04)^{10} = ¤17{,}693.39$ — the linked bond wins.'
      ],
      a: 'Break-even 2.36 %; below it the nominal bond pays more, above it the linked one.'
    },
    {
      title: 'The growing coupon',
      q: 'A ¤1,000 linked bond pays a real coupon of 1 %. Prices rise 3 % a year for ten years. What is the last coupon and the amount repaid?',
      steps: [
        'Indexed face value after ten years: $1\\,000 \\times 1.03^{10} = ¤1{,}343.92$.',
        'Last coupon: $1\\,\\% \\times 1\\,343.92 = ¤13.44$ (the first was about ¤10.30).',
        'Repaid at maturity: ¤1,343.92 — the original ¤1,000 in today\'s purchasing power.'
      ],
      a: 'A last coupon of ¤13.44 and ¤1,343.92 repaid.'
    }
  ],
  quiz: [
    { q: 'Nominal bonds yield 5 % and linked bonds 2 % real. What is the break-even inflation, in per cent?', answer: 2.94, unit: '%',
      why: '1.05 / 1.02 − 1 = 2.94 % (roughly 5 − 2 = 3).' },
    { q: 'An inflation-linked bond cannot fall in price.', a: false,
      why: 'Its price moves with real yields. When real yields rise, the price falls — sharply for long maturities.' },
    { q: 'Inflation turns out higher than the break-even rate. Which bond did better?', choices: ['the nominal bond', 'the inflation-linked bond', 'they did the same', 'neither pays anything'], a: 1,
      why: 'The linked bond\'s payments rose with prices; the nominal bond\'s fixed payments were worth less than the market expected.' },
    { q: 'The price index rises from 100 to 112 over the life of a linked bond with a ¤1,000 face value. How much is repaid at maturity?', answer: 1120, unit: '$',
      why: 'The face value is multiplied by the index ratio: 1,000 × 112/100 = ¤1,120.' }
  ],
  applications: ['Protecting the purchasing power of savings meant for spending years ahead.', 'Reading the market\'s inflation expectations from break-even rates.', 'Understanding the investor side of CPI-linked mortgages.'],
  history: 'Governments turned to indexed borrowing mostly after bouts of high inflation: the UK began issuing index-linked gilts in 1981, and the US first sold its inflation-protected Treasury securities in 1997.',
  sim: { id: 'lb-price-yield', params: { c: 1, T: 10, y: 1.8 } }
},

/* ================================================================ MONEY MARKET */
{
  id: 'money-market', parent: 'bonds', title: 'Money-market funds and treasury bills', level: 1,
  short: 'The market for loans of a year or less: treasury bills, commercial paper, bank certificates and money-market funds that hold them. Low risk and quick to reach, their yields follow the central bank — and after inflation they may earn little or nothing.',
  keywords: ['money market', 'money-market fund', 'treasury bill', 'T-bill', 'commercial paper', 'certificate of deposit', 'repo', 'cash', 'discount yield', 'breaking the buck', 'short-term rates', 'cash management'],
  prereq: ['bond-basics', 'simple-interest', 'real-vs-nominal'],
  related: ['yield-curve', 'term-deposits', 'deposit-insurance', 'emergency-fund', 'monetary-policy', 'bank-accounts'],
  body: `
Not all borrowing is for years. Governments, banks and large companies constantly borrow for days, weeks or months to smooth their cash, and the market where they do it is the **money market**. For savers it is the home of "cash": money that should stay safe and within reach.

### The instruments
- **Treasury bills**: government borrowing for up to a year, sold below face value and repaid in full — zero-coupon bonds ([[bond-basics]]).
- **Commercial paper**: short-term, unsecured borrowing by large companies.
- **Certificates of deposit** and **term deposits**: banks borrowing for a fixed period ([[term-deposits]]).
- **Repurchase agreements (repo)**: short loans secured by bonds, the plumbing between banks and funds.

### Pricing a bill
A 26-week (182-day) bill with a face value of ¤10,000, at a 4 % yearly yield with simple interest, costs

$$P = \\frac{F}{1 + y\\,d/365} = \\frac{10\\,000}{1 + 0.04 \\times 182/365} = ¤9{,}804.45$$

The ¤195.55 you gain at maturity is your interest. Conventions differ by country. US bills are quoted on a *discount* basis, as a share of face value on a 360-day year: a 4 % discount means a price of $10\\,000 \\times (1 - 0.04 \\times 182/360) = ¤9{,}797.78$, which is a true yield of 4.14 %. When you compare a bill with a deposit, convert both to the same kind of yield.

### Money-market funds
A money-market fund pools savers' money into bills, commercial paper, repos and deposits, and lets you add or withdraw almost any day. Its yield follows the central bank's rate with a short lag, so it rises quickly when rates go up — and falls just as quickly when they are cut. Things to know:
- **Fees matter** because returns are small: a 0.2 % fee on a 4 % yield takes a twentieth of the income — ¤1,900 a year on ¤50,000 instead of ¤2,000.
- **They are not deposits.** Usually no deposit insurance applies. Most aim to keep a stable value, and nearly always do; but in 2008 a large US money fund fell below its stable value of 1 per share, savers rushed to withdraw, and governments had to step in. Funds holding only government bills are the most conservative kind; rules on what funds may hold differ by country.
- **Real returns can be thin.** At 4 % with inflation at 3 %, the real return is 0.97 % ([[real-vs-nominal]]). Over long horizons cash has often barely kept pace with prices, and in years of very low rates it fell behind.

### What cash is for
Money needed within a year or two, an [[emergency-fund|emergency fund]], a deposit being saved for a home, or money waiting to be invested: for these the money market's stability and access matter more than its return. Its main risk is not losing money but losing income: when rates fall, the yield falls within weeks, while a longer bond would have locked the old rate in ([[yield-curve]]).

> [!key] Money-market instruments are short, simple loans. They protect the amount and keep it within reach; they do not protect it against inflation over the long run.
`,
  ideas: [
    'The money market is borrowing and lending for a year or less: bills, commercial paper, certificates of deposit, repo.',
    'A treasury bill is sold below face value; the difference is the interest.',
    'Money-market fund yields follow the central bank\'s rate up and down within weeks.',
    'Money-market funds are not bank deposits and usually carry no deposit insurance, though they aim to keep a stable value.',
    'Cash protects the amount, not its purchasing power: its real return is often close to zero.'
  ],
  pitfalls: [
    'A money-market fund is the same as an insured bank deposit — It is an investment fund; usually no deposit insurance applies, and in rare crises a fund has fallen below its stable value.',
    'Cash is risk-free — Its value in money is stable, but inflation can erode it, and its income falls quickly when rates are cut.',
    'A discount rate and a yield are the same number — On a discount basis (US bills) a 4 % discount is a 4.14 % true yield for 26 weeks; compare like with like.'
  ],
  formulas: [
    {
      name: 'Price of a bill from its yield',
      expr: 'P = F/(1 + y*d/365)', tex: 'P = \\frac{F}{1 + y\\,d/365}',
      vars: {
        P: { name: 'price', q: 'money', unit: '$' },
        F: { name: 'face value', q: 'money', unit: '$', value: 10000 },
        y: { name: 'yearly yield (simple)', q: 'ratio', unit: '%', value: 4, min: 0.01, max: 100 },
        d: { name: 'days to maturity', int: true, value: 182, min: 1 }
      },
      practice: { unknowns: ['P', 'y'] },
      stories: {
        P: 'A bill with a face value of {F} matures in {d} days. At a yield of {y}, what is its price?',
        y: 'A bill with a face value of {F} maturing in {d} days costs {P}. What is its yearly yield?'
      }
    },
    {
      name: 'Price from a US-style discount rate',
      expr: 'P = F*(1 - D*d/360)', tex: 'P = F\\left(1 - D\\,\\frac{d}{360}\\right)',
      vars: {
        P: { name: 'price', q: 'money', unit: '$' },
        F: { name: 'face value', q: 'money', unit: '$', value: 10000 },
        D: { name: 'discount rate', q: 'ratio', unit: '%', value: 4, min: 0, max: 100 },
        d: { name: 'days to maturity', int: true, value: 182, min: 1 }
      },
      note: 'The discount rate is a share of the face value over a 360-day year — lower than the true yield on the money you actually pay.',
      stories: { P: 'A {d}-day bill with a face value of {F} is quoted at a discount of {D}. What does it cost?' }
    },
    {
      name: 'Real return on cash',
      expr: 'R = (1 + y - f)/(1 + i) - 1', tex: 'R = \\frac{1 + y - f}{1 + i} - 1',
      vars: {
        R: { name: 'real yearly return', q: 'ratio', unit: '%', signed: true },
        y: { name: 'fund or deposit yield', q: 'ratio', unit: '%', value: 4 },
        f: { name: 'yearly fee', q: 'ratio', unit: '%', value: 0.2 },
        i: { name: 'inflation', q: 'ratio', unit: '%', value: 3, signed: true }
      },
      note: 'What the money can buy after a year compared with now, after fees and before tax.',
      practice: { unknowns: ['R'] },
      stories: { R: 'A money-market fund yields {y} and charges {f} a year; inflation is {i}. What is the real return?' }
    }
  ],
  examples: [
    {
      title: 'A 26-week bill',
      q: 'A treasury bill with a face value of ¤10,000 matures in 182 days. The market yield is 4 % a year (simple). What does it cost, and what is the interest?',
      steps: [
        { text: 'Price:', tex: 'P = \\frac{10\\,000}{1 + 0.04 \\times 182/365} = \\frac{10\\,000}{1.019945} = ¤9{,}804.45' },
        'Interest: $10\\,000 - 9\\,804.45 = ¤195.55$, received as the bill is repaid in full.',
        'Check: $195.55/9\\,804.45 \\times 365/182 = 4.00\\,\\%$.'
      ],
      a: '¤9,804.45; ¤195.55 of interest after 182 days.'
    },
    {
      title: 'Fees and inflation on a cash fund',
      q: '¤50,000 in a money-market fund yielding 4 % with a 0.2 % yearly fee, while inflation is 3 %. What do you earn, and what is the real return?',
      steps: [
        'Net yield $4 - 0.2 = 3.8\\,\\%$: ¤1,900 in a year, instead of ¤2,000 without the fee.',
        'Real return: $1.038/1.03 - 1 = 0.78\\,\\%$.',
        'The amount is safe; its purchasing power grows by less than 1 % a year.'
      ],
      a: '¤1,900 of income; a real return of about 0.78 %.'
    }
  ],
  quiz: [
    { q: 'A 91-day bill with a face value of ¤10,000 costs ¤9,900. What is its simple yearly yield, in per cent?', answer: 4.05, unit: '%',
      why: '100 / 9,900 × 365 / 91 = 4.05 %.' },
    { q: 'A money-market fund is the same as an insured bank deposit.', a: false,
      why: 'It is an investment fund; deposit insurance usually does not apply, even though such funds are designed to keep a stable value.' },
    { q: 'The central bank cuts its policy rate by one point. What happens to money-market fund yields?', choices: ['nothing for years', 'they fall within weeks', 'they rise', 'they fall only at the end of the year'], a: 1,
      why: 'The fund\'s holdings mature within weeks or months and are replaced at the new, lower rates.' },
    { q: 'How does a treasury bill pay its interest?', choices: ['monthly coupons', 'it is sold below face value and repaid in full', 'a lump sum on top of the face value', 'through dividends'], a: 1,
      why: 'A bill is a zero-coupon bond: the difference between the price paid and the face value repaid is the interest.' }
  ],
  applications: ['Choosing where to keep an emergency fund or money needed soon.', 'Comparing a treasury bill with a bank deposit on the same basis.', 'Understanding why cash yields rise and fall with the central bank\'s rate.'],
  sim: { id: 'lb-yield-curve', params: { preset: 'inverted' } }
}

);
