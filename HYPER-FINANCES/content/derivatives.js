/* HYPER-FINANCES · content/derivatives.js — Derivatives: futures and forwards, options (calls and
 * puts, strategies, pricing) and hedging. Simulations: sims/leverage.js (lev-futures-mtm,
 * lev-payoff-builder, lev-option-value, lev-hedge-puts). Option prices quoted in the text come from
 * Hyper.finance.blackScholes with the stated inputs. */
Hyper.add(

/* ================================================================ FUTURES AND FORWARDS */
{
  id: 'futures-forwards', parent: 'derivatives', title: 'Futures and forwards', level: 2,
  short: 'Agreements to buy or sell something later at a price fixed today. Forwards are private contracts; futures are standardised, exchange-traded and settled every day through margin accounts — a hedging tool and a highly leveraged position at once.',
  keywords: ['futures', 'forward contract', 'forward price', 'cost of carry', 'mark to market', 'marking to market', 'variation margin', 'initial margin', 'clearing house', 'contango', 'backwardation', 'contract multiplier', 'currency forward', 'interest rate parity', 'commodity futures', 'index futures', 'cash settlement', 'rolling futures'],
  prereq: ['present-value', 'leverage-basics', 'margin-calls'],
  related: ['hedging', 'options-basics', 'exchange-rates', 'cfds-forex', 'math:number-e', 'math:exponential-functions'],
  body: `
In early spring a wheat farmer does not know what her harvest will fetch in September, and a bakery does not know what its flour will cost. They can remove the uncertainty for both by agreeing today: 1,000 tonnes in September at ¤250 a tonne. If the market price in September is ¤200, the bakery pays ¤50 a tonne more than it would have and the farmer is glad; at ¤300 the farmer gives up ¤50 a tonne and the bakery is glad. Neither paid anything to make the agreement. That is a **forward contract**: a price fixed now for a trade later.

### Forwards and futures
A forward is a private agreement, written to suit both sides and settled once, at the end. Its weakness is trust: if prices move a lot, the losing side may fail to pay. A **future** solves this by standardising the contract — quantity, quality, date — and trading it on an exchange, where a **clearing house** stands between every buyer and seller. To keep that safe, every future is **marked to market** each day: the day's gain or loss is paid in cash between the accounts, and each side keeps a **margin** deposit. Most futures are closed before expiry, and many — on share indices and interest rates — are settled in cash, with nothing ever delivered. At expiry the buyer (*long*) of a contract at $F_0$ gains $S_T - F_0$ per unit and the seller (*short*) the opposite: every gain is someone else's loss.

### What the forward price should be
Why should the September price differ from today's? Because there is another way to own the thing in September: buy it now and keep it. That costs the interest on the money for the time, plus storage and insurance for goods, minus any income the asset pays or any benefit of having it in hand. If the forward price were higher, traders would buy now and sell forward for a riskless profit; if lower, the reverse. For a financial asset with a yield $q$ and interest $r$, both continuously compounded ([[math:number-e|the number e]]),

$$F_0 = S_0\\,e^{(r - q)T}$$

A share index at 5,000 points, interest 4 %, dividends 1.5 %, six months to go: $F_0 = 5\\,000\\,e^{0.025 \\times 0.5} = 5\\,062.89$. For a currency the "yield" is the other currency's interest rate: a pair at 1.1000 with 4 % on the quote currency and 2 % on the base has a one-year forward of $1.1 \\times 1.04/1.02 = 1.1216$. A forward price is not a forecast; it is today's price carried forward at the cost of carry. Futures above the spot price are said to be in *contango*, below it in *backwardation*.

### Marking to market: leverage, settled daily
Suppose a share-index future pays ¤50 per index point. At 5,000 points one contract controls ¤250,000 of index — for an initial margin of, say, ¤15,000, or 6 %: **leverage of about 17 : 1**. The maintenance level is ¤12,000.

| Day | Settlement | Change | Gain or loss | Account | Note |
|---|---:|---:|---:|---:|---|
| 0 | 5,000 | | | ¤15,000 | opened |
| 1 | 4,960 | −40 | −¤2,000 | ¤13,000 | |
| 2 | 4,900 | −60 | −¤3,000 | ¤10,000 | call: pay in ¤5,000 |
| 3 | 5,020 | +120 | +¤6,000 | ¤21,000 | ¤6,000 can be taken out |

A 2 % fall took a third of the initial margin and had to be paid in cash within a day — although by day 3 the position was ¤1,000 in profit. Futures margin calls usually restore the account to the *initial* margin, not just to the maintenance level, and they arrive whatever the long-term merits of the position.

> [!warn] A future has no premium and no price to pay up front, which makes it feel free. It is not: the whole value of the contract moves against you, and daily cash calls can sink a position that would have been right in the end.

### What this means for you
Futures quietly shape many prices you see: the bread you buy, the fuel in an airline ticket, the exchange rate a company locks in for next year's imports ([[hedging]]). As a tool for an individual they are powerful and unforgiving: one contract is often worth more than a year's pay, the margin is a small fraction of that, and losses are settled every day. Before trading one, know the contract's value, its multiplier and the move that would take your whole margin.
`,
  ideas: [
    'A forward fixes a price today for a trade later; a future is a standardised forward traded on an exchange and cleared.',
    'Futures are marked to market daily: gains and losses are paid in cash every day, through margin accounts.',
    'The fair forward price is the spot price carried at the cost of carry: $F_0 = S_0 e^{(r - q)T}$ — not a forecast.',
    'With initial margins of a few per cent, a futures position is leveraged 10 to 30 times.',
    'Every futures gain is matched by someone else\'s loss; hedgers use them to remove risk, speculators to take it.'
  ],
  pitfalls: [
    'The futures price is the market\'s forecast of the future price — It is mostly today\'s price carried forward at the cost of carry; expectations enter only through today\'s price.',
    'If my view is right in the end, the daily losses do not matter — They must be paid in cash every day; run out of cash and the position is closed, however right it would have been.',
    'A futures contract always ends with goods being delivered — Most are closed before expiry and many are settled in cash; but a physically settled contract held into its delivery period really does oblige you to deliver or take delivery.'
  ],
  formulas: [
    {
      name: 'Forward price (cost of carry)',
      expr: 'F = S*exp((r - q)*T)', tex: 'F_0 = S_0\\,e^{(r - q)T}',
      vars: {
        F: { name: 'forward price', q: 'money', unit: '$', tex: 'F_0' },
        S: { name: 'price of the asset today', q: 'money', unit: '$', value: 100, tex: 'S_0' },
        r: { name: 'interest rate (continuous)', q: 'ratio', unit: '%', value: 4 },
        q: { name: 'yield of the asset (negative for storage costs)', q: 'ratio', unit: '%', value: 1.5, signed: true },
        T: { name: 'time to delivery', q: 'years', unit: 'yr', value: 0.5 }
      },
      note: 'For shares and indices $q$ is the dividend yield; for a currency it is the interest rate of the base currency; for a stored commodity, a negative $q$ stands for storage costs.',
      practice: { unknowns: ['F'] },
      stories: {
        F: 'An asset trades at {S} and yields {q} a year; money costs {r} a year. What is the fair forward price for delivery in {T}?',
        q: 'An asset trades at {S}, the forward price for {T} ahead is {F} and interest is {r}. What yield does that imply?'
      }
    },
    {
      name: 'Currency forward (interest rate parity)',
      expr: 'F = S*((1 + rq)/(1 + rb))^T', tex: 'F = S \\left(\\frac{1 + r_q}{1 + r_b}\\right)^{T}',
      vars: {
        F: { name: 'forward exchange rate (quote units per base unit)' },
        S: { name: 'spot exchange rate', value: 1.1 },
        rq: { name: 'interest rate of the quote currency', q: 'ratio', unit: '%', value: 4, tex: 'r_q' },
        rb: { name: 'interest rate of the base currency', q: 'ratio', unit: '%', value: 2, tex: 'r_b' },
        T: { name: 'time to delivery', q: 'years', unit: 'yr', value: 1 }
      },
      note: 'The currency with the higher interest rate trades at a discount forward: otherwise one could borrow in one currency, deposit in the other and lock in the exchange rate for a riskless profit.',
      practice: { unknowns: ['F'] },
      stories: {
        F: 'A currency pair trades at {S}. Interest is {rq} on the quote currency and {rb} on the base currency. What is the forward rate for {T} ahead?'
      }
    },
    {
      name: 'Gain or loss on futures',
      expr: 'G = (F1 - F0)*m*n', tex: 'G = (F_1 - F_0)\\,m\\,n',
      vars: {
        G: { name: 'gain (negative for a loss) on a long position', q: 'money', unit: '$', signed: true },
        F1: { name: 'futures price now (points)', value: 4900, tex: 'F_1' },
        F0: { name: 'futures price when opened (points)', value: 5000, tex: 'F_0' },
        m: { name: 'value of one point', q: 'money', unit: '$', value: 50, fixed: true },
        n: { name: 'number of contracts', int: true, value: 1 }
      },
      note: 'For a short position the sign is reversed. The same gain or loss is settled day by day through the margin account.',
      practice: { unknowns: ['G', 'F1'] },
      stories: {
        G: 'You buy {n} index futures at {F0} points; each point is worth {m}. The price is now {F1}. What is your gain or loss?',
        F1: 'You are long {n} futures bought at {F0} points, worth {m} a point. At what price will your result be {G}?'
      }
    },
    {
      name: 'Leverage of a futures position',
      expr: 'L = F0*m/M', tex: 'L = \\frac{F_0\\,m}{M}',
      vars: {
        L: { name: 'leverage (contract value ÷ initial margin)' },
        F0: { name: 'futures price (points)', value: 5000, tex: 'F_0' },
        m: { name: 'value of one point', q: 'money', unit: '$', value: 50, fixed: true },
        M: { name: 'initial margin per contract', q: 'money', unit: '$', value: 15000 }
      },
      note: 'The move that wipes out the initial margin is $1/L$ of the contract value: 6 % here, reached by a 300-point fall.',
      practice: { unknowns: ['L', 'M'] },
      stories: {
        L: 'An index future at {F0} points is worth {m} a point; the initial margin is {M}. What leverage does one contract give?',
        M: 'An index future at {F0} points, {m} a point, gives a leverage of {L}. What is the initial margin?'
      }
    }
  ],
  examples: [
    {
      title: 'The fair price of a six-month index future',
      q: 'An index stands at 5,000 points, interest is 4 % and the dividend yield 1.5 %, both continuous. What should a six-month future cost? What could a trader do if it traded at 5,100?',
      steps: [
        '$F_0 = 5\\,000\\,e^{(0.04 - 0.015) \\times 0.5} = 5\\,000 \\times e^{0.0125} = 5\\,000 \\times 1.012578 = 5\\,062.89$.',
        'At 5,100 the future is 37.11 points too dear. Borrow, buy the shares of the index, sell the future: at expiry deliver (or settle) at 5,100, having paid 5,062.89 in carrying costs — 37.11 points of profit whatever the index does.',
        'Such trades are why futures prices stay close to their cost-of-carry value.'
      ],
      a: 'About 5,062.89 points; at 5,100 a riskless 37 points per contract (before costs).'
    },
    {
      title: 'Three days of marking to market',
      q: 'You buy one index future at 5,000 (¤50 a point) with ¤15,000 of initial margin; maintenance ¤12,000. It settles at 4,960, 4,900 and 5,020. Follow the account.',
      steps: [
        'Day 1: $-40 \\times 50 = -¤2{,}000$; account ¤13,000, above maintenance.',
        'Day 2: $-60 \\times 50 = -¤3{,}000$; account ¤10,000, below ¤12,000: a margin call to restore ¤15,000, so you pay in ¤5,000.',
        'Day 3: $+120 \\times 50 = +¤6{,}000$; account ¤21,000.',
        'Overall: $(5\\,020 - 5\\,000) \\times 50 = +¤1{,}000$. You paid in ¤20,000 in total and hold ¤21,000.'
      ],
      a: 'A ¤1,000 gain — but only after finding ¤5,000 of cash in the middle.'
    },
    {
      title: 'An importer locks in an exchange rate',
      q: 'A company keeps its accounts in the quote currency and must pay 1,000,000 units of the base currency in a year. Spot is 1.1000, interest 4 % on the quote currency and 2 % on the base. What does a forward lock in, and what happens if spot ends at 1.20 or at 1.00?',
      steps: [
        'Forward rate: $1.1 \\times 1.04/1.02 = 1.12157$; cost locked in: ¤1,121,569.',
        'Spot 1.20: unhedged the payment would cost ¤1,200,000 — the forward saved ¤78,431.',
        'Spot 1.00: unhedged it would cost ¤1,000,000 — the forward cost ¤121,569 more. The company still knew its cost a year ahead, which was the point.'
      ],
      a: 'A known cost of ¤1,121,569, better or worse than the market by chance, never by surprise.'
    }
  ],
  quiz: [
    { q: 'An asset at ¤100, interest 4 %, yield 1 % (continuous), one year to delivery. What is the fair forward price?', answer: 103.05, unit: '$',
      why: '$F_0 = 100\\,e^{0.03} = ¤103.05$: the price carried forward at 3 % net cost of carry.' },
    { q: 'A futures price above today\'s spot price means…', choices: ['the market expects the price to rise', 'carrying the asset costs more (interest, storage) than it earns', 'the future is overpriced and should be sold', 'the exchange has made an error'], a: 1,
      why: 'Contango reflects the cost of carry. If it went beyond that, arbitrage (buy now, sell forward) would pull it back.' },
    { q: 'You are long 2 index futures at 5,000, ¤50 a point. The index settles at 4,950. What is today\'s change in your account? (A loss is negative.)', answer: -5000, unit: '$',
      why: '$(4\\,950 - 5\\,000) \\times 50 \\times 2 = -¤5{,}000$, paid in cash today.' },
    { q: 'A futures position costs nothing until expiry, because there is no premium.', a: false,
      why: 'You must post margin, and every day\'s loss is paid in cash as it happens; a run of losses can force you to find large sums or close the position.' },
    { q: 'A futures margin call usually requires you to bring the account back to…', choices: ['the initial margin', 'the maintenance margin', 'zero', 'the full value of the contract'], a: 0,
      why: 'Exchanges and brokers typically require the account to be restored to the initial margin once it falls below maintenance.' }
  ],
  applications: [
    'Farmers, millers and food companies fixing crop prices months ahead.',
    'Airlines and transport companies hedging fuel; importers and exporters locking in exchange rates.',
    'Fund managers adjusting their exposure to a whole market in one trade.',
    'Understanding why a currency with high interest rates trades at a discount in the forward market.'
  ],
  history: 'Rice traded for future delivery at the Dojima exchange in Osaka in the eighteenth century is often cited as the first organised futures market. The Chicago Board of Trade, founded in 1848, standardised grain contracts; futures on currencies and interest rates followed in the 1970s.',
  sim: 'lev-futures-mtm'
},

/* ================================================================ OPTIONS */
{
  id: 'options-basics', parent: 'derivatives', title: 'Options: calls and puts', level: 2,
  short: 'An option is the right, but not the obligation, to buy (a call) or sell (a put) at a fixed price until or at a set date. The buyer pays a premium and can lose no more; the seller collects it and carries the risk.',
  keywords: ['option', 'call option', 'put option', 'strike price', 'exercise price', 'expiry', 'expiration', 'premium', 'in the money', 'out of the money', 'at the money', 'intrinsic value', 'time value', 'American option', 'European option', 'writer', 'holder', 'contract size', 'exercise', 'assignment', 'naked call'],
  prereq: ['stocks-shares', 'leverage-basics', 'risk-and-return'],
  related: ['option-strategies', 'option-pricing', 'hedging', 'insurance-basics', 'short-selling'],
  body: `
You find a house you like but need two months to arrange the money. The owner agrees, for a non-refundable ¤2,000, to hold it for you at ¤300,000 until then. If prices fall or a better house appears, you walk away, and the ¤2,000 was the price of keeping the choice open. If prices rise, you still buy at ¤300,000. You have bought an **option**: a right without an obligation, for a fee.

### Calls and puts
Financial options work the same way, mostly on shares and indices:

- A **call** gives the right to *buy* the underlying at the **strike price** $K$, until (American style) or at (European style) the **expiry** date.
- A **put** gives the right to *sell* at the strike.

The buyer (*holder*) pays the **premium** up front. The seller (*writer*) receives it and must deliver — or take — the shares if the holder exercises. On many exchanges one contract covers 100 shares, so a premium quoted at ¤1.39 costs ¤139 a contract.

### What it pays at expiry
At expiry the decision is simple: exercise only if it pays. With the share at $S_T$,

$$\\text{call: } \\max(S_T - K,\\,0) \\qquad\\qquad \\text{put: } \\max(K - S_T,\\,0)$$

and the profit is that payoff minus the premium. A call is **in the money** when the share is above the strike, **out of the money** below it and **at the money** near it (the reverse for puts). Before expiry an option's price has two parts: the **intrinsic value** it would pay if exercised now, and the **time value** — what the chance of a better outcome before expiry is worth ([[option-pricing]]).

### A call as leverage
A share trades at ¤50. A three-month call with strike ¤55 costs ¤1.39 (the Black–Scholes value at 30 % volatility and 4 % interest). It breaks even at $55 + 1.39 = ¤56.39$.

| Share at expiry | Share bought at ¤50 | Call (strike ¤55, cost ¤1.39) |
|---:|---:|---:|
| ¤40 | −20 % | −100 % |
| ¤50 | 0 % | −100 % |
| ¤55 | +10 % | −100 % |
| ¤57 | +14 % | +44 % |
| ¤60 | +20 % | +260 % |

The call turns a 20 % rise into 260 % and anything up to ¤55 into a total loss. A small rise is a loss for the call buyer: the share must rise *enough*, and *soon*.

### A put as insurance
You own 100 shares at ¤50 and fear a fall. A three-month put with strike ¤45 costs ¤0.90 a share, ¤90 in all. However far the share falls, you can sell at ¤45: the most you can lose is ¤5 of price plus ¤0.90 of premium, ¤590 on the 100 shares. If nothing bad happens, the ¤90 is gone — like a home insurance premium in a year without a fire ([[hedging]], [[insurance-basics]]).

### The other side
Every option bought was sold by someone. The writer of a call keeps the premium if the share stays below the strike; if it soars, the writer must deliver shares worth far more than the strike, and an uncovered (**naked**) call has no limit to its loss. The writer of a put may have to buy at ¤45 a share worth ¤10. Selling options collects small, frequent gains and occasionally suffers a very large loss — a pattern that looks like steady income until the day it does not.

> [!key] Buying an option risks the premium to gain the payoff; selling one earns the premium and takes on the payoff's risk. Always know which side you are on.

### What this means for you
Options are neither lottery tickets nor free income. Bought, they cap your loss at the premium, but they expire worthless unless the share moves far enough, fast enough. Sold, they pay you to carry a risk you must be able to afford. Many brokers ask you to apply for an options approval level before trading them — a good moment to check that you understand both columns of the table above.
`,
  ideas: [
    'A call is the right to buy at the strike, a put the right to sell; the buyer pays a premium, the seller takes the obligation.',
    'At expiry a call pays $\\max(S_T - K, 0)$ and a put $\\max(K - S_T, 0)$; the profit is the payoff minus the premium.',
    'Before expiry an option is worth its intrinsic value plus time value.',
    'A bought call is leverage: large percentage gains on big moves, a total loss on small ones.',
    'A bought put is insurance with a deductible; a written option earns the premium and carries the risk.'
  ],
  pitfalls: [
    'If the share rises, my call makes money — Only if it ends above the strike plus the premium; a small or late rise loses the whole premium.',
    'Selling options is free income — The premium pays for a risk: occasional large losses, unlimited for an uncovered call.',
    'An option that is out of the money is worthless before expiry — It still has time value, the chance of ending in the money; that value melts away as expiry approaches.'
  ],
  formulas: [
    {
      name: 'Profit on a bought call at expiry',
      expr: 'G = max(S - K, 0) - c', tex: 'G = \\max(S_T - K,\\,0) - c',
      vars: {
        G: { name: 'profit per share (negative for a loss)', q: 'money', unit: '$', signed: true },
        S: { name: 'share price at expiry', q: 'money', unit: '$', value: 60, tex: 'S_T' },
        K: { name: 'strike price', q: 'money', unit: '$', value: 55 },
        c: { name: 'premium paid', q: 'money', unit: '$', value: 1.39 }
      },
      note: 'Multiply by the contract size (often 100 shares). The loss never exceeds the premium; the break-even is $K + c$.',
      practice: { unknowns: ['G', 'S'] },
      stories: {
        G: 'You bought a call with strike {K} for {c}. At expiry the share is at {S}. What is your profit per share?',
        S: 'You bought a call with strike {K} for {c}. At what share price at expiry is your profit {G} per share?'
      }
    },
    {
      name: 'Profit on a bought put at expiry',
      expr: 'G = max(K - S, 0) - p', tex: 'G = \\max(K - S_T,\\,0) - p',
      vars: {
        G: { name: 'profit per share (negative for a loss)', q: 'money', unit: '$', signed: true },
        K: { name: 'strike price', q: 'money', unit: '$', value: 45 },
        S: { name: 'share price at expiry', q: 'money', unit: '$', value: 38, tex: 'S_T' },
        p: { name: 'premium paid', q: 'money', unit: '$', value: 0.9 }
      },
      note: 'The break-even is $K - p$. For someone who also owns the share, the put sets a floor under its value.',
      practice: { unknowns: ['G', 'S'] },
      stories: {
        G: 'You bought a put with strike {K} for {p}. At expiry the share is at {S}. What is your profit per share?',
        S: 'You bought a put with strike {K} for {p}. At what share price at expiry is your profit {G} per share?'
      }
    },
    {
      name: 'Break-even of a bought call',
      expr: 'B = K + c', tex: 'B = K + c',
      vars: {
        B: { name: 'share price at expiry needed to break even', q: 'money', unit: '$' },
        K: { name: 'strike price', q: 'money', unit: '$', value: 55 },
        c: { name: 'premium paid', q: 'money', unit: '$', value: 1.39 }
      },
      note: 'For a bought put the break-even is $K - p$.',
      stories: { B: 'A call with strike {K} costs {c}. Where must the share be at expiry for the buyer to break even?' }
    }
  ],
  examples: [
    {
      title: 'Buying a call',
      q: 'A share trades at ¤50. You buy one contract (100 shares) of a three-month call with strike ¤55 at ¤1.39. What do you make if the share ends at ¤60, at ¤57 and at ¤52?',
      steps: [
        'Cost: $100 \\times 1.39 = ¤139$. Break-even: $55 + 1.39 = ¤56.39$.',
        'At ¤60: payoff $100 \\times (60 - 55) = ¤500$; profit $500 - 139 = ¤361$, or +260 %.',
        'At ¤57: payoff ¤200; profit ¤61, or +44 %.',
        'At ¤52: the call expires worthless; you lose the ¤139 even though the share rose 4 %.'
      ],
      a: '+¤361, +¤61 and −¤139.'
    },
    {
      title: 'Writing a put',
      q: 'You sell a three-month put with strike ¤45 for ¤0.90 on a share at ¤50. What happens at expiry if the share is at ¤48, and if it is at ¤38?',
      steps: [
        'At ¤48 the put is not exercised: you keep ¤0.90 a share.',
        'At ¤38 the holder sells you the share at ¤45: you pay ¤45 for something worth ¤38, a loss of ¤7, partly offset by the premium — a net loss of ¤6.10 a share.',
        'Your worst case, if the share became worthless: $45 - 0.90 = ¤44.10$ a share.'
      ],
      a: '+¤0.90 a share at ¤48; −¤6.10 a share at ¤38.'
    }
  ],
  quiz: [
    { q: 'You hold a call with strike ¤55. At expiry the share is at ¤52. You…', choices: ['exercise and make ¤3', 'let it expire and lose the premium', 'must buy the share at ¤55', 'get the premium back'], a: 1,
      why: 'Buying at ¤55 a share worth ¤52 makes no sense; the right lapses and the premium is spent.' },
    { q: 'A put with strike ¤45 cost ¤0.90. The share ends at ¤38. What is the profit per share?', answer: 6.10, unit: '$',
      why: 'Payoff $45 - 38 = ¤7$, minus the ¤0.90 premium: ¤6.10.' },
    { q: 'The buyer of a call can lose more than the premium.', a: false,
      why: 'The buyer has a right, not an obligation: in the worst case the option is simply not exercised.' },
    { q: 'Who faces an unlimited potential loss?', choices: ['the writer of an uncovered call', 'the buyer of a call', 'the buyer of a put', 'the writer of a put'], a: 0,
      why: 'A share price has no upper limit, and the writer of an uncovered call must deliver at the strike whatever the share costs.' },
    { q: 'A call with strike ¤100 was bought for ¤4. What share price at expiry is the break-even?', answer: 104, unit: '$',
      why: 'Strike plus premium: the payoff must repay the ¤4 before any profit is made.' }
  ],
  applications: [
    'Insuring a share holding against a fall with a put.',
    'Employee stock options: calls granted by an employer, usually with a vesting period.',
    'Reading option terms in a trading app: strike, expiry, premium and contract size.'
  ],
  sim: { id: 'lev-payoff-builder', params: { preset: 'call' } }
},

{
  id: 'option-strategies', parent: 'derivatives', title: 'Option strategies and payoffs', level: 2,
  short: 'Calls, puts and shares combine into payoffs of almost any shape: covered calls for income, protective puts and collars for insurance, spreads for cheaper bets, straddles for big moves. Each trades cost against upside and risk.',
  keywords: ['option strategy', 'payoff diagram', 'covered call', 'protective put', 'collar', 'straddle', 'strangle', 'bull call spread', 'bear put spread', 'vertical spread', 'short strangle', 'break-even', 'maximum profit', 'maximum loss', 'net debit', 'net credit'],
  prereq: ['options-basics', 'risk-and-return'],
  related: ['option-pricing', 'hedging', 'short-selling', 'volatility'],
  body: `
A **payoff diagram** draws what a position is worth at expiry against the share price then. A share is a straight line at 45°. A bought call is flat (the premium lost) and then rises; a bought put falls until the strike and then stays flat. Because payoffs add, these building blocks combine into almost any shape — and every shape has a price. The examples below use a share at ¤50 and three-month options priced with the Black–Scholes model at 30 % volatility and 4 % interest ([[option-pricing]]):

| Strike | Call | Put |
|---:|---:|---:|
| ¤45 | ¤6.34 | ¤0.90 |
| ¤50 | ¤3.23 | ¤2.73 |
| ¤55 | ¤1.39 | ¤5.84 |

### Income from shares you own: the covered call
Own the share and sell the ¤55 call for ¤1.39. Below ¤55 you keep the premium; above ¤55 your shares are called away at ¤55. The most you can make is $55 - 50 + 1.39 = ¤6.39$ (12.8 %); break-even is $50 - 1.39 = ¤48.61$; and below that you carry almost the whole fall. You have sold the upside above ¤55 for ¤1.39 of income.

### Insurance: the protective put and the collar
Own the share and buy the ¤45 put for ¤0.90: the worst case is a loss of $50 - 45 + 0.90 = ¤5.90$, the upside stays open, and the insurance costs ¤0.90 every three months. A **collar** pays for the insurance by giving up upside: buy the ¤45 put and sell the ¤55 call, for a net *credit* of ¤0.49. Whatever happens, the result lies between a loss of ¤4.51 and a gain of ¤5.49 a share.

### Cheaper bets: spreads
Expecting a moderate rise, buy the ¤50 call for ¤3.23 and sell the ¤55 call for ¤1.39: a **bull call spread** for a net cost (debit) $d$ of ¤1.84. You can make at most the gap between the strikes less the cost, and lose at most the cost:

$$G_{\\max} = (K_2 - K_1) - d, \\qquad \\text{worst loss} = d$$

Here ¤3.16 against ¤1.84, with break-even at ¤51.84. A **bear put spread** is the mirror image for a moderate fall.

### Betting on movement: straddles and strangles
Buy both the ¤50 call and the ¤50 put for $3.23 + 2.73 = ¤5.96$. This **long straddle** makes money if the share ends below ¤44.04 or above ¤55.96 — a move of 11.9 % either way within three months. It is a bet on volatility rather than direction, often placed before results or a big announcement. Its mirror image, the **short strangle** — sell the ¤45 put and the ¤55 call for ¤2.29 — earns the premium if the share stays between ¤42.71 and ¤57.29, loses heavily below and without limit above.

> [!tip] For any combination, read three numbers off the diagram before trading: the most you can lose, the most you can make, and the break-even prices. If the most you can lose is "unlimited", you are selling insurance.

### Nothing is free
Every strategy moves risk around; none removes it for nothing. The covered call's income is paid for with lost upside, the protective put's safety with a premium, the spread's cheapness with a cap, the short strangle's steady income with rare large losses. Option prices already reflect the market's view of volatility, so a strategy earns more than it risks, on average, only if you know something the prices do not.

### What this means for you
Payoff diagrams make options readable: once you can draw one, no strategy's name should intimidate you. The simulation builds them for you — choose a strategy, then look at its worst case before its best.
`,
  ideas: [
    'Payoffs add: shares, calls and puts, bought or sold, combine into almost any shape of payoff at expiry.',
    'A covered call sells upside for income; a protective put buys a floor; a collar trades one for the other.',
    'Spreads cap both the gain and the loss and cost less than a single option.',
    'Straddles and strangles are bets on how far the share moves, not on its direction.',
    'Every strategy has a worst case, a best case and break-even prices — read them before trading.'
  ],
  pitfalls: [
    'A covered call is low-risk income — It keeps almost all of the share\'s downside and caps the upside; the premium cushions a fall only by its own size.',
    'A spread is safe because its two sides cancel — It limits both gain and loss, but the whole cost can still be lost; limited risk is not small risk.',
    'Selling a strangle is a high-probability win — It usually wins a little and occasionally loses a great deal; the probability of a profit says nothing about the size of the loss.'
  ],
  formulas: [
    {
      name: 'Bull call spread: the most it can make',
      expr: 'Gm = (K2 - K1) - d', tex: 'G_{\\max} = (K_2 - K_1) - d',
      vars: {
        Gm: { name: 'maximum profit per share', q: 'money', unit: '$', tex: 'G_{\\max}' },
        K2: { name: 'strike of the call sold', q: 'money', unit: '$', value: 55, tex: 'K_2' },
        K1: { name: 'strike of the call bought', q: 'money', unit: '$', value: 50, tex: 'K_1' },
        d: { name: 'net cost of the spread', q: 'money', unit: '$', value: 1.84 }
      },
      note: 'The maximum loss is the net cost $d$; the break-even is $K_1 + d$.',
      practice: { unknowns: ['Gm'] },
      stories: {
        Gm: 'You buy a call with strike {K1} and sell one with strike {K2}, for a net cost of {d}. What is the most you can make per share?',
        d: 'A spread between strikes {K1} and {K2} can make at most {Gm} per share. What did it cost?'
      }
    },
    {
      name: 'Straddle: the move needed to profit',
      expr: 'x = (c + p)/K', tex: 'x = \\frac{c + p}{K}',
      vars: {
        x: { name: 'move needed, either way, as a share of the strike', q: 'ratio', unit: '%' },
        c: { name: 'call premium', q: 'money', unit: '$', value: 3.23 },
        p: { name: 'put premium', q: 'money', unit: '$', value: 2.73 },
        K: { name: 'strike of both options', q: 'money', unit: '$', value: 50 }
      },
      note: 'The break-evens are $K \\pm (c + p)$: here ¤44.04 and ¤55.96.',
      stories: {
        x: 'A call and a put with strike {K} cost {c} and {p}. How far must the share move, either way, for a long straddle to profit at expiry?'
      }
    },
    {
      name: 'Covered call: the most it can make',
      expr: 'Gm = K - S0 + c', tex: 'G_{\\max} = K - S_0 + c',
      vars: {
        Gm: { name: 'maximum profit per share', q: 'money', unit: '$', signed: true, tex: 'G_{\\max}' },
        K: { name: 'strike of the call sold', q: 'money', unit: '$', value: 55 },
        S0: { name: 'price paid for the share', q: 'money', unit: '$', value: 50, tex: 'S_0' },
        c: { name: 'premium received', q: 'money', unit: '$', value: 1.39 }
      },
      note: 'Reached at any price above the strike. The break-even is $S_0 - c$, and below it the loss is almost that of the share.',
      stories: {
        Gm: 'You own a share bought at {S0} and sell a call with strike {K} for {c}. What is the most you can make per share?'
      }
    },
    {
      name: 'Protective put: the most you can lose',
      expr: 'Lm = S0 - K + p', tex: 'L_{\\max} = S_0 - K + p',
      vars: {
        Lm: { name: 'maximum loss per share', q: 'money', unit: '$', tex: 'L_{\\max}' },
        S0: { name: 'price paid for the share', q: 'money', unit: '$', value: 50, tex: 'S_0' },
        K: { name: 'strike of the put bought', q: 'money', unit: '$', value: 45 },
        p: { name: 'premium paid', q: 'money', unit: '$', value: 0.9 }
      },
      note: 'The "deductible" $S_0 - K$ plus the premium. A higher strike lowers the deductible and raises the premium.',
      stories: {
        Lm: 'You own a share bought at {S0} and buy a put with strike {K} for {p}. What is the most you can lose per share until expiry?'
      }
    }
  ],
  examples: [
    {
      title: 'A bull call spread at three prices',
      q: 'Buy the ¤50 call at ¤3.23 and sell the ¤55 call at ¤1.39. What is the result per share if the share ends at ¤45, ¤52 and ¤60?',
      steps: [
        'Net cost: $3.23 - 1.39 = ¤1.84$.',
        'At ¤45: both calls expire worthless: −¤1.84 (the worst case).',
        'At ¤52: the bought call pays ¤2, the sold call nothing: $2 - 1.84 = +¤0.16$.',
        'At ¤60: the bought call pays ¤10, the sold call costs ¤5: $5 - 1.84 = +¤3.16$ (the best case, from ¤55 upwards).'
      ],
      a: '−¤1.84, +¤0.16 and +¤3.16 per share.'
    },
    {
      title: 'A collar on 100 shares',
      q: 'You own 100 shares at ¤50, buy the ¤45 put for ¤0.90 and sell the ¤55 call for ¤1.39. What is the result if the share ends at ¤40, ¤50 and ¤60?',
      steps: [
        'Net premium: $1.39 - 0.90 = ¤0.49$ received per share.',
        'At ¤40: shares −¤10, put +¤5, call 0: $-10 + 5 + 0.49 = -¤4.51$ a share, −¤451 in all.',
        'At ¤50: only the premium: +¤0.49 a share, +¤49.',
        'At ¤60: shares +¤10, call −¤5: $10 - 5 + 0.49 = +¤5.49$ a share, +¤549.'
      ],
      a: 'Between −¤451 and +¤549, whatever the share does.'
    }
  ],
  quiz: [
    { q: 'Which strategy has an unlimited maximum loss?', choices: ['short strangle', 'bull call spread', 'protective put', 'long straddle'], a: 0,
      why: 'A short strangle includes a sold, uncovered call: if the share soars, the loss keeps growing. The other three have a loss capped at what they cost.' },
    { q: 'Bull call spread: buy the ¤100 call for ¤6 and sell the ¤110 call for ¤2. What is the maximum profit per share?', answer: 6, unit: '$',
      why: 'Net cost ¤4; the most the spread can pay is the ¤10 gap between the strikes: $10 - 4 = ¤6$.' },
    { q: 'A straddle at a strike of ¤80 costs ¤7 in total. What is the upper break-even at expiry?', answer: 87, unit: '$',
      why: 'The call must pay back both premiums: $80 + 7 = ¤87$ (and the lower break-even is ¤73).' },
    { q: 'Selling a covered call greatly reduces the risk of owning the share.', a: false,
      why: 'It reduces the loss only by the premium received, while capping the gain; most of the downside remains.' },
    { q: 'You own shares and want protection against a fall without paying a premium up front. Which fits?', choices: ['a zero-cost collar', 'a long straddle', 'a bull call spread', 'selling a put'], a: 0,
      why: 'A collar finances the put with the premium from a sold call, at the price of capping the upside.' }
  ],
  applications: [
    'Protecting a concentrated share holding (for example employer shares) with a collar.',
    'Generating income from a long-held portfolio with covered calls, knowing the upside given up.',
    'Positioning for a large move around an announcement with a straddle.'
  ],
  sim: 'lev-payoff-builder'
},

{
  id: 'option-pricing', parent: 'derivatives', title: 'What an option is worth', level: 3,
  short: 'An option\'s price is its intrinsic value plus time value, set by the share price, the strike, time, interest and above all volatility. Put–call parity ties calls to puts, and the Black–Scholes formula prices both.',
  keywords: ['option pricing', 'Black-Scholes', 'Black–Scholes–Merton', 'put-call parity', 'implied volatility', 'time value', 'intrinsic value', 'time decay', 'theta', 'delta', 'vega', 'gamma', 'greeks', 'binomial model', 'risk-neutral', 'replication', 'volatility skew', 'volatility smile'],
  prereq: ['options-basics', 'volatility', 'present-value', 'math:normal-distribution'],
  related: ['option-strategies', 'hedging', 'market-efficiency', 'math:expected-value', 'math:logarithms', 'math:number-e'],
  body: `
A three-month call with strike ¤50 on a share at ¤50 would pay nothing if exercised today, yet it trades for about ¤3.23. That price is the value of possibility: over three months the share may rise well above ¤50, and the call's owner gains from every step above the strike while losing nothing below it. Option pricing is the art of putting a number on possibility.

### What moves the price
| When this rises… | Call | Put | Why |
|---|:---:|:---:|---|
| Share price $S$ | up | down | more (less) intrinsic value |
| Strike $K$ | down | up | the right to buy (sell) at a higher price is worth less (more) |
| Time to expiry $T$ | up | up, usually | more time for a large move |
| Volatility $\\sigma$ | up | up | larger moves help the holder; losses stop at the premium |
| Interest rate $r$ | up | down | paying the strike later is worth more |

Volatility is the one that surprises people. An option holder gains from larger swings in *either* direction, because the loss is capped at the premium while the gain is not. At the money, our three-month call is worth ¤2.24 at 20 % volatility, ¤3.23 at 30 % and ¤4.22 at 40 %.

### Pricing by copying
The central idea is that an option can be copied with shares and borrowing. Suppose a share at ¤50 will be worth either ¤60 or ¤40 in a year, and interest is 4 %. A call with strike ¤50 will pay ¤10 or nothing. Hold half a share and sell one call: at ¤60 you have $30 - 10 = ¤20$; at ¤40 you have $20 - 0 = ¤20$. The combination is riskless, so today it is worth $20/1.04 = ¤19.23$. Half a share costs ¤25, so the call must be worth $25 - 19.23 = ¤5.77$. The probability that the share rises never entered the calculation: whatever investors believe, the price is set by the cost of copying the payoff. Equivalently it is the expected payoff, discounted, under the *risk-neutral* probability — here 0.6 for the rise, the probability at which the share itself would earn just the 4 % ([[math:expected-value|expected value]]).

### Put–call parity
A call plus cash equal to the discounted strike pays at expiry exactly what a put plus a share pays: $\\max(S_T, K)$ in both cases. So for European options with the same strike and expiry,

$$C - P = S - K e^{-rT}$$

For our ¤50 options: $50 - 50\\,e^{-0.01} = ¤0.50$, and indeed ¤3.23 − ¤2.73 = ¤0.50. If quoted prices break parity, traders buy the cheap side and sell the dear one until it holds.

### Black–Scholes
Let the up-and-down steps become continuous, with the share's log-returns normally distributed at a constant volatility ([[math:normal-distribution|normal distribution]]), and the copying argument gives the Black–Scholes formula for a European call:

$$C = S\\,N(d_1) - K e^{-rT} N(d_2), \\qquad d_{1,2} = \\frac{\\ln(S/K) + (r \\pm \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}}$$

where $N$ is the standard normal distribution function; the put follows from parity. $N(d_1)$ is the call's **delta**, the number of shares that copies it: 0.56 for our at-the-money call, which therefore moves about 56 cents for each ¤1 move in the share. At the money a handy rule of thumb is $C \\approx 0.4\\,\\sigma S\\sqrt{T}$: $0.4 \\times 0.3 \\times 50 \\times 0.5 = ¤3.00$, close to the ¤2.99 the full formula gives at zero interest.

### Time decay
Time value melts as expiry approaches, and fastest at the end, roughly with the square root of the time left. Our at-the-money call is worth ¤4.70 with six months to go, ¤3.23 with three, ¤1.81 with one, ¤0.85 with one week and nothing at expiry if the share is still at ¤50. The rate of loss is called **theta**: with three months left, about ¤0.13 a week. Buyers pay it; sellers collect it.

### Implied volatility
Every input can be observed except volatility, so traders turn the formula round and solve for the volatility that a market price implies. **Implied volatility** is how options are really quoted: the market's price of uncertainty. It differs between strikes: on share indices, puts well below the current level have traded at higher implied volatility ever since the crash of 1987 (the *skew*) — a sign that normal returns understate crashes and that people pay extra for protection against them.

> [!note] The model assumes constant volatility, no sudden jumps and frictionless trading. None holds exactly; the formula is a shared language and a starting point, not the truth.

### What this means for you
You need not compute Black–Scholes to use options sensibly, but its lessons matter: you pay for volatility and for time; a bought option is a wasting asset; and a cheap-looking option is usually cheap because the move it needs is unlikely. Solve the calculator below for $\\sigma$ to see what volatility a quoted price assumes.
`,
  ideas: [
    'Before expiry an option is worth its intrinsic value plus time value, the value of the chance of a better outcome.',
    'Higher volatility raises the value of both calls and puts, because the holder\'s loss is capped.',
    'An option can be copied with shares and borrowing, so its price does not depend on the probability investors give to a rise.',
    'Put–call parity: $C - P = S - K e^{-rT}$ for European options with the same strike and expiry.',
    'Black–Scholes prices European options from five inputs; implied volatility is the one the market sets.'
  ],
  pitfalls: [
    'An option\'s price is the market\'s bet on the direction of the share — The copying argument never uses the probability of a rise; pricing depends on volatility, time and interest.',
    'A cheap option is a bargain — It is cheap because it is unlikely to pay: far from the money or close to expiry. Implied volatility, not the price in money, says whether an option is dear.',
    'Black–Scholes gives the true value — It assumes constant volatility and normal returns; real markets jump, which the market prices through the skew in implied volatility.'
  ],
  formulas: [
    {
      name: 'Black–Scholes value of a European call',
      expr: 'C = S*(1 + erf(((ln(S/K) + (r + sigma^2/2)*T)/(sigma*sqrt(T)))/sqrt(2)))/2 - K*exp(-r*T)*(1 + erf(((ln(S/K) + (r - sigma^2/2)*T)/(sigma*sqrt(T)))/sqrt(2)))/2',
      tex: 'C = S\\,N(d_1) - K e^{-rT} N(d_2),\\quad d_{1,2} = \\frac{\\ln(S/K) + (r \\pm \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}}',
      vars: {
        C: { name: 'value of the call', q: 'money', unit: '$' },
        S: { name: 'share price', q: 'money', unit: '$', value: 50 },
        K: { name: 'strike price', q: 'money', unit: '$', value: 50 },
        r: { name: 'interest rate (continuous)', q: 'ratio', unit: '%', value: 4 },
        sigma: { name: 'volatility (yearly)', q: 'ratio', unit: '%', value: 30, tex: '\\sigma' },
        T: { name: 'time to expiry', q: 'years', unit: 'yr', value: 0.25 }
      },
      note: '$N(x) = \\tfrac{1}{2}\\left(1 + \\operatorname{erf}(x/\\sqrt{2})\\right)$ is the standard normal distribution function. Solve for $\\sigma$ to get the **implied volatility** of a quoted price. No dividends; European exercise.',
      practice: { unknowns: ['C'] },
      stories: {
        C: 'A share trades at {S}. Interest is {r} and volatility {sigma}. What is a European call with strike {K} and {T} to expiry worth?',
        sigma: 'A European call with strike {K} and {T} to expiry trades at {C} on a share at {S}; interest is {r}. What volatility does the price imply?'
      }
    },
    {
      name: 'Black–Scholes value of a European put',
      expr: 'P = K*exp(-r*T)*(1 - erf(((ln(S/K) + (r - sigma^2/2)*T)/(sigma*sqrt(T)))/sqrt(2)))/2 - S*(1 - erf(((ln(S/K) + (r + sigma^2/2)*T)/(sigma*sqrt(T)))/sqrt(2)))/2',
      tex: 'P = K e^{-rT} N(-d_2) - S\\,N(-d_1),\\quad d_{1,2} = \\frac{\\ln(S/K) + (r \\pm \\sigma^2/2)\\,T}{\\sigma\\sqrt{T}}',
      vars: {
        P: { name: 'value of the put', q: 'money', unit: '$' },
        K: { name: 'strike price', q: 'money', unit: '$', value: 45 },
        r: { name: 'interest rate (continuous)', q: 'ratio', unit: '%', value: 4 },
        T: { name: 'time to expiry', q: 'years', unit: 'yr', value: 0.25 },
        S: { name: 'share price', q: 'money', unit: '$', value: 50 },
        sigma: { name: 'volatility (yearly)', q: 'ratio', unit: '%', value: 30, tex: '\\sigma' }
      },
      note: 'The defaults give the ¤0.90 put used on the options pages. Raise the volatility to 40 % to see how insurance becomes dearer when markets are nervous.',
      practice: { unknowns: ['P'] },
      stories: {
        P: 'A share trades at {S}. Interest is {r} and volatility {sigma}. What is a European put with strike {K} and {T} to expiry worth?',
        sigma: 'A European put with strike {K} and {T} to expiry trades at {P} on a share at {S}; interest is {r}. What volatility does the price imply?'
      }
    },
    {
      name: 'Put–call parity',
      expr: 'C = P + S - K*exp(-r*T)', tex: 'C - P = S - K e^{-rT}',
      vars: {
        C: { name: 'call price', q: 'money', unit: '$' },
        P: { name: 'put price', q: 'money', unit: '$', value: 2.73 },
        S: { name: 'share price', q: 'money', unit: '$', value: 50 },
        K: { name: 'strike of both options', q: 'money', unit: '$', value: 50 },
        r: { name: 'interest rate (continuous)', q: 'ratio', unit: '%', value: 4 },
        T: { name: 'time to expiry', q: 'years', unit: 'yr', value: 0.25 }
      },
      note: 'For European options on a share without dividends. It holds whatever model is used, because both sides pay the same at expiry.',
      practice: { unknowns: ['C', 'P'] },
      stories: {
        C: 'A European put with strike {K} and {T} to expiry costs {P}; the share is at {S} and interest is {r}. What should the matching call cost?',
        P: 'A European call with strike {K} and {T} to expiry costs {C}; the share is at {S} and interest is {r}. What should the matching put cost?'
      }
    },
    {
      name: 'At-the-money rule of thumb',
      expr: 'C = 0.4*sigma*S*sqrt(T)', tex: 'C \\approx 0.4\\,\\sigma S \\sqrt{T}',
      vars: {
        C: { name: 'approximate value of an at-the-money call or put', q: 'money', unit: '$' },
        sigma: { name: 'volatility (yearly)', q: 'ratio', unit: '%', value: 30, tex: '\\sigma' },
        S: { name: 'share price (= strike)', q: 'money', unit: '$', value: 50 },
        T: { name: 'time to expiry', q: 'years', unit: 'yr', value: 0.25 }
      },
      note: '0.4 is close to $1/\\sqrt{2\\pi}$. Good when interest is small and the option is near the money; it shows that value grows with $\\sqrt{T}$, so decay is fastest at the end.',
      stories: {
        C: 'Roughly what is an at-the-money option worth on a share at {S} with volatility {sigma} and {T} to expiry?',
        sigma: 'An at-the-money option on a share at {S} with {T} to expiry costs {C}. Roughly what volatility does that imply?'
      }
    }
  ],
  examples: [
    {
      title: 'Copying a call with shares and a loan',
      q: 'A share at ¤50 will be worth ¤60 or ¤40 in a year; interest is 4 %. Price a one-year call with strike ¤50.',
      steps: [
        'The call pays ¤10 or ¤0. Shares needed to copy it: $\\Delta = (10 - 0)/(60 - 40) = 0.5$.',
        'Half a share minus one call is worth ¤20 in both states: riskless, so worth $20/1.04 = ¤19.23$ today.',
        'Call $= 0.5 \\times 50 - 19.23 = ¤5.77$.',
        'Check with risk-neutral probability $q = (1.04 \\times 50 - 40)/(60 - 40) = 0.6$: $0.6 \\times 10/1.04 = ¤5.77$.'
      ],
      a: '¤5.77 — with no need to know how likely the rise really is.'
    },
    {
      title: 'Black–Scholes by hand',
      q: 'Price a three-month call with strike ¤50 on a share at ¤50, at 30 % volatility and 4 % interest.',
      steps: [
        '$\\sigma\\sqrt{T} = 0.3 \\times 0.5 = 0.15$; $\\ln(S/K) = 0$.',
        '$d_1 = (0 + (0.04 + 0.045) \\times 0.25)/0.15 = 0.1417$; $d_2 = d_1 - 0.15 = -0.0083$.',
        '$N(d_1) = 0.5563$, $N(d_2) = 0.4967$; $K e^{-rT} = 50\\,e^{-0.01} = 49.50$.',
        '$C = 50 \\times 0.5563 - 49.50 \\times 0.4967 = 27.82 - 24.59 = ¤3.23$. By parity the put is $3.23 - 0.50 = ¤2.73$.'
      ],
      a: 'Call ¤3.23, put ¤2.73; the call\'s delta is 0.56.'
    }
  ],
  quiz: [
    { q: 'Which change raises the value of both a call and a put?', choices: ['higher volatility', 'a higher share price', 'a higher strike', 'a higher interest rate'], a: 0,
      why: 'Both holders gain from large moves and lose at most the premium. The share price, strike and interest rate push calls and puts in opposite directions.' },
    { q: 'Put–call parity: share ¤100, strike ¤100, interest 5 %, one year; the European call costs ¤10.45. What should the put cost?', answer: 5.57, unit: '$',
      why: '$P = C - S + K e^{-rT} = 10.45 - 100 + 95.12 = ¤5.57$.' },
    { q: 'In the copying argument, a higher probability that the share will rise makes the call more valuable.', a: false,
      why: 'The call is priced by what it costs to copy it with shares and a loan; the real-world probability never enters.' },
    { q: 'Rule of thumb: roughly what is an at-the-money option worth on a ¤200 share with 25 % volatility and one year to expiry?', answer: 20, unit: '$',
      why: '$0.4 \\times 0.25 \\times 200 \\times \\sqrt{1} = ¤20$.' },
    { q: 'An at-the-money option loses its time value…', choices: ['fastest in the last weeks before expiry', 'at a constant rate', 'fastest just after it is bought', 'only if the share falls'], a: 0,
      why: 'Time value goes roughly with $\\sqrt{T}$, whose slope is steepest as $T$ approaches zero.' }
  ],
  applications: [
    'Reading an option quote as an implied volatility, and comparing it with how much the share has actually moved.',
    'Valuing employee stock options and warrants.',
    'Understanding why insurance against market falls becomes expensive when markets are nervous.'
  ],
  history: 'Louis Bachelier described prices as random walks and priced options with them in his thesis of 1900. Fischer Black, Myron Scholes and Robert Merton published the modern formula in 1973, the year the Chicago Board Options Exchange opened; Scholes and Merton received the Nobel memorial prize in economics in 1997, Black having died in 1995.',
  sim: 'lev-option-value'
},

/* ================================================================ HEDGING */
{
  id: 'hedging', parent: 'derivatives', title: 'Hedging', level: 2,
  short: 'Taking a position that gains when something you already own or owe loses. Hedges with forwards, futures and options give up some upside, or cost a premium, to make the bad outcomes bearable.',
  keywords: ['hedging', 'hedge', 'hedge ratio', 'minimum variance hedge', 'basis risk', 'protective put', 'portfolio insurance', 'currency hedge', 'fuel hedging', 'beta hedge', 'index futures hedge', 'cross hedge', 'over-hedging', 'insurance'],
  prereq: ['futures-forwards', 'options-basics', 'correlation', 'insurance-basics'],
  related: ['option-strategies', 'diversification', 'capm-beta', 'exchange-rates', 'drawdowns', 'fixed-rate-mortgages', 'money-anxiety'],
  body: `
An airline sells tickets months ahead at fixed prices but buys fuel at whatever it costs on the day. An exporter prices its goods in a foreign currency but pays its workers at home. A retired couple needs their savings to be there next year. Each carries a risk it did not choose and would gladly reduce. **Hedging** means taking a second position that gains when the first one loses, so the two together move less. Most people already hedge: a fixed-rate mortgage hedges a budget against rising rates ([[fixed-rate-mortgages]]), and home insurance hedges wealth against a fire ([[insurance-basics]]).

### Locking a price: forwards and futures
The simplest hedge fixes a future price. A company that must pay 1,000,000 units of a foreign currency in a year can buy them forward today ([[futures-forwards]]): whatever the exchange rate does, its cost is known. The price of certainty is giving up the good outcomes — if the foreign currency weakens, the hedged company pays more than it would have. That is not a mistake; it is the hedge working.

A share portfolio is hedged with index futures using its **beta**, how strongly it moves with the index ([[capm-beta]]). To neutralise a portfolio worth $V$ with beta $\\beta$, using futures at price $F$ with a multiplier $m$, sell

$$N = \\frac{\\beta\\,V}{F\\,m}$$

contracts. A ¤500,000 portfolio with beta 1.2, against index futures at 5,000 points and ¤50 a point (¤250,000 a contract), needs 2.4 contracts — 2 or 3 in practice, because contracts come whole. When the hedge is not exactly the thing you own — heating-oil futures for jet fuel, an index for your own shares — it is imperfect (**basis risk**), and the best ratio depends on how closely the two move together ([[correlation]]):

$$h = \\rho\\,\\frac{\\sigma_S}{\\sigma_F}$$

With a correlation of 0.9, and daily price changes of 3 % for jet fuel and 3.5 % for the futures, the lowest-risk hedge covers 77 % of the exposure.

### Insuring with options
Options hedge one side only. A protective put leaves the upside open and puts a floor under the downside, for a premium. Protecting ¤100,000 of a share-index fund for a year with puts 10 % below today's level costs about ¤1,981 at 18 % volatility (Black–Scholes, 4 % interest). If the market falls 35 %, the unhedged portfolio loses ¤35,000; the hedged one loses at most ¤10,000 plus the premium, ¤11,981 — ¤23,019 of loss avoided. In a normal year the ¤1,981 is simply spent.

| Protection | Strike | Premium | Worst-case loss, premium included |
|---|---:|---:|---:|
| at today's level | 100 % | ¤5,243 | ¤5,243 |
| 5 % below | 95 % | ¤3,357 | ¤8,357 |
| 10 % below | 90 % | ¤1,981 | ¤11,981 |
| 20 % below | 80 % | ¤503 | ¤20,503 |

Cheaper insurance carries a bigger deductible, exactly as with a car. And the price rises with fear: at 25 % volatility the 10 % protection costs ¤4,024. Studies of index options have generally found that protection bought year after year costs more on average than it pays back — the sellers are paid for carrying crash risk, which is how all insurance works.

### When hedges hurt
A hedge loses money in exactly the scenarios you were not worried about, and those losses can arrive in cash before the gains on what you hedged. In 1993 a German industrial group lost more than a billion US dollars when a large, rolling futures hedge of long-term oil supply contracts produced margin calls it could not fund ([[margin-calls]]). Airlines that had locked in fuel prices paid far above the market when oil collapsed. And a "hedge" larger than the exposure is no longer a hedge but a bet in the other direction.

> [!key] Judge a hedge by the risk it removed, not by whether it made money. If the hedge lost, the thing it protected usually gained.

### What this means for you
For most people the most effective hedges are unglamorous: an emergency fund, insurance against disasters you could not absorb, a fixed rate on a large loan, savings in the currency you will spend, and simply holding less of a risky asset when you cannot afford its falls. Options and futures can protect a concentrated holding or a portfolio you cannot sell, at a known price. Whatever the tool, decide what you are protecting against, what that protection is worth to you and what you give up for it — then the premium is a choice you made, not a surprise.
`,
  ideas: [
    'A hedge is a second position that gains when the first loses, so that together they move less.',
    'Forwards and futures lock in a price and give up the good outcomes; options insure one side for a premium.',
    'Futures to neutralise a share portfolio: $N = \\beta V/(F m)$; with an imperfect match, the best hedge ratio is $\\rho\\,\\sigma_S/\\sigma_F$.',
    'Protective puts cost more the closer the floor and the more nervous the market; the deductible is the gap to the strike.',
    'A hedge that loses money has usually done its job; one larger than the exposure is a bet.'
  ],
  pitfalls: [
    'A hedge that lost money was a bad hedge — It is meant to lose when the thing it protects gains; judge it by the risk it removed.',
    'Hedging makes a position riskless — Basis risk, whole-contract rounding and the cash demands of margin calls remain, and cheap protection comes with a large deductible.',
    'More hedging is always safer — Beyond the size of the exposure, the extra hedge is a speculative position in the opposite direction.'
  ],
  formulas: [
    {
      name: 'Index futures to hedge a share portfolio',
      expr: 'N = beta*V/(F*m)', tex: 'N = \\frac{\\beta\\,V}{F\\,m}',
      vars: {
        N: { name: 'contracts to sell (round to whole contracts)' },
        beta: { name: 'beta of the portfolio', value: 1.2, tex: '\\beta' },
        V: { name: 'value of the portfolio', q: 'money', unit: '$', value: 500000 },
        F: { name: 'futures price (index points)', value: 5000 },
        m: { name: 'value of one index point', q: 'money', unit: '$', value: 50, fixed: true }
      },
      note: 'Selling $N$ contracts makes the portfolio behave, for a while, like cash earning roughly the interest rate. To reduce rather than remove the exposure, use a fraction of $N$.',
      practice: { unknowns: ['N'] },
      stories: {
        N: 'A portfolio worth {V} has a beta of {beta}. Index futures stand at {F} points, worth {m} a point. How many contracts hedge it?',
        V: 'Selling {N} index futures at {F} points ({m} a point) fully hedges a portfolio with beta {beta}. How large is the portfolio?'
      }
    },
    {
      name: 'Minimum-variance hedge ratio',
      expr: 'h = rho*sS/sF', tex: 'h = \\rho\\,\\frac{\\sigma_S}{\\sigma_F}',
      vars: {
        h: { name: 'hedge ratio (futures per unit of exposure)', q: 'ratio', unit: '%' },
        rho: { name: 'correlation between the exposure and the futures', value: 0.9, min: 0, max: 1, tex: '\\rho' },
        sS: { name: 'volatility of the exposure', q: 'ratio', unit: '%', value: 3, tex: '\\sigma_S' },
        sF: { name: 'volatility of the futures', q: 'ratio', unit: '%', value: 3.5, tex: '\\sigma_F' }
      },
      note: 'Measure both volatilities over the same period (daily, weekly…). With a correlation of 1 and equal volatilities, $h = 100\\%$.',
      stories: {
        h: 'Your exposure has a volatility of {sS}, the futures {sF}, and their correlation is {rho}. What hedge ratio gives the lowest risk?'
      }
    },
    {
      name: 'Worst case with a protective put',
      expr: 'W = V*(1 - k) + P', tex: 'W = V\\,(1 - k) + P',
      vars: {
        W: { name: 'largest possible loss, premium included', q: 'money', unit: '$' },
        V: { name: 'value of the portfolio today', q: 'money', unit: '$', value: 100000 },
        k: { name: 'strike as a share of today\'s value', q: 'ratio', unit: '%', value: 90 },
        P: { name: 'premium paid', q: 'money', unit: '$', value: 1981 }
      },
      note: 'For a portfolio that tracks the index the puts are written on, until they expire. The deductible $V(1 - k)$ shrinks as the premium grows.',
      practice: { unknowns: ['W'] },
      stories: {
        W: 'You protect a portfolio worth {V} with puts struck at {k} of its value, for a premium of {P}. What is the most you can lose until they expire?'
      }
    }
  ],
  examples: [
    {
      title: 'Hedging a portfolio with index futures',
      q: 'A ¤500,000 portfolio with beta 1.2; index futures at 5,000 points, ¤50 a point. How many contracts hedge it, and what happens if the index falls 10 %?',
      steps: [
        '$N = 1.2 \\times 500\\,000/(5\\,000 \\times 50) = 2.4$ contracts.',
        'A 10 % fall in the index takes about $1.2 \\times 10\\% = 12\\%$ off the portfolio: ¤60,000.',
        'The index falls 500 points; each short contract gains $500 \\times 50 = ¤25{,}000$, and 2.4 of them ¤60,000.',
        'With whole contracts: 2 cover ¤50,000 of the fall, 3 would gain ¤75,000 — a slight bet on a fall.'
      ],
      a: '2.4 contracts; the futures gain offsets the ¤60,000 loss.'
    },
    {
      title: 'The price of a floor',
      q: '¤100,000 in an index fund; one-year puts 10 % below today\'s level cost 1.98 % of the value (18 % volatility, 4 % interest). Compare hedged and unhedged results for a 35 % fall and a 10 % rise.',
      steps: [
        'Premium: $100\\,000 \\times 0.0198 = ¤1{,}981$ (rounded from the Black–Scholes value).',
        'Fall of 35 %: unhedged −¤35,000. Hedged: the puts pay $90\\,000 - 65\\,000 = ¤25{,}000$, so the loss is $35\\,000 - 25\\,000 + 1\\,981 = ¤11{,}981$.',
        'Rise of 10 %: unhedged +¤10,000; hedged $10\\,000 - 1\\,981 = +¤8{,}019$.'
      ],
      a: 'The puts turn a ¤35,000 loss into ¤11,981, and cost ¤1,981 of a good year\'s gain.'
    }
  ],
  quiz: [
    { q: 'A ¤1,000,000 portfolio with beta 0.8 is hedged with index futures at 4,000 points, ¤50 a point. How many contracts should be sold?', answer: 4,
      why: '$N = 0.8 \\times 1\\,000\\,000/(4\\,000 \\times 50) = 800\\,000/200\\,000 = 4$.' },
    { q: 'Your hedge lost money this year. Most likely…', choices: ['the position it protected gained', 'the hedge was a mistake', 'you hedged too little', 'the exchange was closed'], a: 0,
      why: 'A hedge is built to move against the exposure; its loss is the mirror of the exposure\'s gain.' },
    { q: 'A protective put removes the risk of loss at no cost.', a: false,
      why: 'It costs a premium, and it still leaves the deductible between today\'s value and the strike.' },
    { q: 'Correlation 0.8, volatility of your exposure 2 %, of the futures 4 %. What is the minimum-variance hedge ratio?', answer: 40, unit: '%',
      why: '$h = 0.8 \\times 2/4 = 0.4$: hedge 40 % of the exposure.' },
    { q: 'Which of these is an everyday hedge?', choices: ['a fixed-rate mortgage', 'a leveraged ETF', 'a lottery ticket', 'buying more of the shares you already own'], a: 0,
      why: 'A fixed rate protects your budget against rising interest rates — at the cost of not benefiting if they fall.' }
  ],
  applications: [
    'Companies fixing exchange rates and commodity prices for their budgets.',
    'Protecting a concentrated holding, such as employer shares, before a sale is possible.',
    'Reducing a portfolio\'s exposure quickly with futures instead of selling many holdings.',
    'Everyday choices: fixed rates, insurance and saving in the currency you will spend.'
  ],
  sim: 'lev-hedge-puts'
}

);
