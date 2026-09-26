/* HYPER-FINANCES · content/firms-competition.js — microeconomics II: firms and competition.
 * Costs and profit, break-even, market structures, externalities and public goods, game
 * theory, and comparative advantage. Worked cases: a bakery (fixed ¤2,000 a week, ¤0.50 a loaf,
 * marginal cost rising ¤1 per 1,000 loaves), a food truck, a ferry route P = 60 − 0.01Q,
 * a polluting chemical plant, two petrol stations, and Ana and Ben trading bread and shirts.
 * Simulations: sims/micro.js. */
Hyper.add(

/* ================================================================ costs and profit */
{
  id: 'costs-and-profit', parent: 'firms-competition', title: 'Costs, revenue and profit', level: 2,
  short: 'Fixed, variable, average and marginal cost; why a firm produces where marginal cost meets the price; when a loss-making firm should keep going; and the difference between accounting and economic profit.',
  keywords: ['fixed cost', 'variable cost', 'marginal cost', 'average cost', 'average total cost', 'average variable cost', 'marginal revenue', 'profit maximisation', 'shut-down point', 'economic profit', 'accounting profit', 'economies of scale', 'sunk cost'],
  prereq: ['marginal-thinking', 'opportunity-cost', 'math:optimization'],
  related: ['break-even', 'market-structures', 'supply-demand', 'financial-statements', 'earnings-eps'],
  body: `
A small bakery pays ¤2,000 a week whatever it bakes — rent, the lease on its ovens, insurance. Each loaf needs about ¤0.50 of flour, yeast and energy. And the busier it gets, the more each extra loaf costs: overtime, a second shift, ovens crowded past their best. How many loaves should it bake when bread sells for ¤3? The answer needs three kinds of cost and one rule.

### Fixed, variable and marginal
- **Fixed costs** do not change with output in the short run: rent, loan repayments, salaried staff, insurance.
- **Variable costs** rise with output: ingredients, energy, packaging, hourly wages.
- **Marginal cost** is the cost of one more unit — the slope of total cost.

A simple cost function has all three: $C(Q) = F + vQ + \\tfrac{m}{2000}\\,Q^2$, whose marginal cost starts at $v$ and rises by $m$ for every 1,000 extra units. For the bakery $F = ¤2{,}000$, $v = ¤0.50$ and $m = ¤1$:

| Loaves a week | Total cost | Average cost | Marginal cost | Profit at ¤3 |
|---:|---:|---:|---:|---:|
| 1,000 | ¤3,000 | ¤3.00 | ¤1.50 | ¤0 |
| 2,000 | ¤5,000 | ¤2.50 | ¤2.50 | ¤1,000 |
| 2,500 | ¤6,375 | ¤2.55 | ¤3.00 | ¤1,125 |
| 3,000 | ¤8,000 | ¤2.67 | ¤3.50 | ¤1,000 |
| 4,000 | ¤12,000 | ¤3.00 | ¤4.50 | ¤0 |

### The rule: marginal revenue equals marginal cost
The best output is where one more loaf adds as much to revenue as to cost ([[marginal-thinking]]). A bakery too small to move the market price gets that price for every loaf, so its **marginal revenue is the price** and the rule becomes **price = marginal cost**: $0.50 + Q/1000 = 3$, so 2,500 loaves and a profit of ¤1,125. At that output the average cost (¤2.55) is *not* at its lowest — that is at 2,000 loaves — yet profit is highest. Firms maximise profit, not low average cost.

Marginal cost crosses average cost at the lowest point of average cost, for the same reason a test mark above your average raises it: when the next loaf costs less than the average it pulls the average down, and when it costs more it pulls it up.

### Losses, and when to stop
If bread falls to ¤2.20, below the lowest average cost of ¤2.50, no output makes a profit. The best the bakery can do is bake where ¤2.20 = marginal cost — 1,700 loaves — and lose ¤555 a week. Closing would lose more: the ¤2,000 of fixed costs is owed either way. In the short run a firm keeps producing as long as the price covers its **average variable cost**, because each sale then contributes something towards the fixed costs; here that shut-down price is ¤0.50. In the long run, once the lease can be ended, a firm that cannot cover all its costs leaves.

### Accounting profit and economic profit
An accountant subtracts the bills. An economist also subtracts the [[opportunity-cost|opportunity cost]] of what the owner puts in: her time, which could earn a wage elsewhere, and her savings, which could earn a return. If the baker could earn ¤800 a week as an employee, the bakery's ¤1,125 of accounting profit is ¤325 of **economic profit** — the true reward for running a business rather than taking the job. Where anyone can open a bakery, economic profit attracts newcomers, the price falls, and in the long run it settles near the lowest average cost — ¤2.50 here — where economic profit is zero.

### Economies of scale
When average cost falls as a firm grows — fixed costs spread over more units, bulk buying, specialised machines — there are **economies of scale**. They explain why car makers, chip plants and airlines are huge, and why some markets end up with few firms ([[market-structures]]). Beyond some size, coordination becomes costly and average cost can rise again.

> [!tip] A freelancer or small business faces the same questions. Which costs are fixed and which grow with each job? What does one more order really cost? What would your time earn elsewhere? [[break-even|Break-even analysis]] turns the answers into a sales target.
`,
  ideas: [
    'Fixed costs do not change with output in the short run; variable costs do; marginal cost is the cost of one more unit.',
    'Profit is largest where marginal revenue equals marginal cost; for a price-taking firm, where the price equals marginal cost.',
    'Marginal cost cuts average cost at its lowest point.',
    'In the short run a firm keeps producing while the price covers average variable cost, even at a loss; in the long run it must cover all costs.',
    'Economic profit subtracts the opportunity cost of the owner\'s time and capital; competition pushes it towards zero.'
  ],
  pitfalls: [
    'A firm should produce where its average cost is lowest — It should produce where marginal cost equals marginal revenue. At the bakery that is 2,500 loaves, not the 2,000 with the lowest average cost.',
    'Any firm making a loss should close at once — Not in the short run if the price covers variable costs: closing still leaves the fixed costs to pay, a bigger loss.',
    'A profitable business is always worth running — Only if its profit beats what the owner\'s time and money would earn elsewhere: economic profit, not accounting profit.'
  ],
  derivation: {
    title: 'The best output for a price-taker',
    steps: [
      { text: 'Profit is revenue minus cost, with the cost function above:', tex: '\\pi(Q) = P\\,Q - F - v\\,Q - \\frac{m}{2000}\\,Q^2' },
      { text: 'At the maximum the slope is zero ([[math:optimization]]):', tex: "\\pi'(Q) = P - v - \\frac{m}{1000}\\,Q = 0" },
      { text: 'The last two terms are the marginal cost, so this says $P = MC$. Solving,', tex: 'Q^* = \\frac{1000\\,(P - v)}{m}' },
      { text: 'The second derivative, $-m/1000$, is negative: a maximum. Fixed costs $F$ vanish from the answer — they decide *whether* profit is positive, not *how much* to make.' }
    ]
  },
  formulas: [
    {
      name: 'Profit with rising marginal cost',
      expr: 'Pr = P*Q - F - v*Q - m*Q^2/2000', tex: '\\pi = P\\,Q - F - v\\,Q - \\frac{m}{2000}\\,Q^2',
      vars: {
        Pr: { name: 'profit a period', q: 'money', unit: '$', signed: true, tex: '\\pi' },
        P: { name: 'price per unit', q: 'money', unit: '$', value: 3 },
        Q: { name: 'units made and sold', value: 2000, min: 0 },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 2000 },
        v: { name: 'variable cost of the first units', q: 'money', unit: '$', value: 0.5 },
        m: { name: 'rise in marginal cost per 1,000 units', q: 'money', unit: '$', value: 1 }
      },
      note: 'Solve for $Q$ with a profit of zero to find the two break-even outputs (1,000 and 4,000 loaves for the bakery); any other profit below the maximum is also reached at two outputs.',
      practice: { unknowns: ['Pr'] },
      stories: { Pr: 'A bakery with fixed costs of {F} a week sells {Q} loaves at {P}. Ingredients cost {v} a loaf, and marginal cost rises by {m} for every 1,000 loaves. What is its weekly profit?' }
    },
    {
      name: 'Best output for a price-taker',
      expr: 'Q = 1000*(P - v)/m', tex: 'Q^* = \\frac{1000\\,(P - v)}{m}',
      vars: {
        Q: { name: 'profit-maximising output', tex: 'Q^*' },
        P: { name: 'market price', q: 'money', unit: '$', value: 3 },
        v: { name: 'marginal cost of the first units', q: 'money', unit: '$', value: 0.5 },
        m: { name: 'rise in marginal cost per 1,000 units', q: 'money', unit: '$', value: 1 }
      },
      note: 'Where the price equals marginal cost, $v + mQ/1000$. If the price is below average variable cost, making nothing is better.',
      practice: { unknowns: ['Q', 'P'] },
      stories: {
        Q: 'Marginal cost starts at {v} and rises by {m} per 1,000 units. The market price is {P}. How many units maximise profit?',
        P: 'Marginal cost starts at {v} and rises by {m} per 1,000 units. At what market price would a firm choose to make {Q} units?'
      }
    },
    {
      name: 'Average total cost',
      expr: 'ATC = F/Q + v + m*Q/2000', tex: '\\mathrm{ATC} = \\frac{F}{Q} + v + \\frac{m}{2000}\\,Q',
      vars: {
        ATC: { name: 'average total cost per unit', q: 'money', unit: '$', tex: '\\mathrm{ATC}' },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 2000 },
        Q: { name: 'units made', value: 2500, min: 1 },
        v: { name: 'variable cost of the first units', q: 'money', unit: '$', value: 0.5 },
        m: { name: 'rise in marginal cost per 1,000 units', q: 'money', unit: '$', value: 1 }
      },
      note: 'Fixed cost per unit falls as output grows; the rising-cost term grows. The lowest average cost is at $Q = \\sqrt{2000F/m}$ — 2,000 loaves, at ¤2.50.',
      practice: { unknowns: ['ATC'] },
      stories: { ATC: 'Fixed costs are {F}, the first units cost {v} each and marginal cost rises by {m} per 1,000 units. What is the average cost per unit at {Q} units?' }
    },
    {
      name: 'Economic profit',
      expr: 'EP = AP - OC', tex: '\\mathrm{EP} = \\mathrm{AP} - \\mathrm{OC}',
      vars: {
        EP: { name: 'economic profit', q: 'money', unit: '$', signed: true, tex: '\\mathrm{EP}' },
        AP: { name: 'accounting profit', q: 'money', unit: '$', value: 1125, signed: true, tex: '\\mathrm{AP}' },
        OC: { name: 'opportunity cost of the owner\'s time and capital', q: 'money', unit: '$', value: 800, tex: '\\mathrm{OC}' }
      },
      practice: { unknowns: ['EP'] },
      stories: { EP: 'A business shows an accounting profit of {AP}. The owner could earn {OC} elsewhere with the same time and money. What is its economic profit?' }
    }
  ],
  examples: [
    {
      title: 'The bakery\'s best week',
      q: 'Bread sells for ¤3. With $F = ¤2{,}000$, $v = ¤0.50$ and marginal cost rising ¤1 per 1,000 loaves, how many loaves should the bakery bake, and what does it earn?',
      steps: [
        'Marginal cost: $MC = 0.50 + Q/1000$. Set it equal to the price: $Q = 1000 \\times (3 - 0.50) = 2{,}500$ loaves.',
        'Revenue: $3 \\times 2\\,500 = ¤7{,}500$.',
        'Cost: $2\\,000 + 0.50 \\times 2\\,500 + 2\\,500^2/2\\,000 = 2\\,000 + 1\\,250 + 3\\,125 = ¤6{,}375$.',
        'Profit ¤1,125 a week; average cost ¤2.55 a loaf.'
      ],
      a: '2,500 loaves and ¤1,125 of profit a week.'
    },
    {
      title: 'Bread gets cheaper',
      q: 'The market price falls to ¤2.20. Should the bakery keep baking this week, and how much?',
      steps: [
        'Best output: $1000 \\times (2.20 - 0.50) = 1{,}700$ loaves.',
        'Revenue $2.20 \\times 1\\,700 = ¤3{,}740$; cost $2\\,000 + 850 + 1\\,445 = ¤4{,}295$; a loss of ¤555.',
        'Closing would lose the whole ¤2,000 of fixed costs. Baking 1,700 loaves cuts the loss by ¤1,445, because the price covers the average variable cost ($0.50 + 1\\,700/2\\,000 = ¤1.35$).'
      ],
      a: 'Keep baking 1,700 loaves and lose ¤555 — better than losing ¤2,000 by closing. Only in the long run, if prices stay low, should it leave.'
    }
  ],
  quiz: [
    { q: 'A firm that takes the market price as given maximises profit where…', choices: ['the price equals average total cost', 'the price equals marginal cost', 'average cost is lowest', 'revenue is largest'], a: 1,
      why: 'Below that output, one more unit adds more to revenue (the price) than to cost; above it, less. Where average cost is lowest is a different point.' },
    { q: 'A firm making a loss should always shut down straight away.', a: false,
      why: 'In the short run its fixed costs must be paid anyway. If the price covers average variable cost, producing reduces the loss.' },
    { q: 'Marginal cost is $MC = 0.50 + Q/1000$ and the market price is ¤4. How many units maximise profit?', answer: 3500,
      why: '$0.50 + Q/1000 = 4$ gives $Q = 3{,}500$.' },
    { q: 'The bakery\'s rent rises by ¤500 a week. How does its best output change in the short run?', choices: ['it falls', 'it rises', 'it does not change; only the profit falls', 'the bakery must close'], a: 2,
      why: 'Rent is a fixed cost: it does not change marginal cost, so the output where price equals marginal cost is the same. Profit falls by ¤500.' },
    { q: 'A shop\'s accounts show ¤60,000 profit a year. Its owner could earn ¤45,000 as an employee, and her ¤100,000 invested in the shop could earn 4 % elsewhere. What is its economic profit, in ¤?', answer: 11000, unit: '$',
      why: '¤60,000 − ¤45,000 − 4 % of ¤100,000 (¤4,000) = ¤11,000: the shop pays, but by far less than the accounts suggest.' }
  ],
  applications: [
    'Deciding how much to produce and whether to stay open through a slump.',
    'Reading company accounts: high fixed costs make profits swing with sales ([[financial-statements]]).',
    'Judging whether your own business pays better than a job once your time and savings are counted.',
    'Understanding why industries with big fixed costs end up with a few large firms.'
  ],
  sim: 'mic-costs'
},

/* ================================================================ break-even */
{
  id: 'break-even', parent: 'firms-competition', title: 'Break-even analysis', level: 1,
  short: 'How many units a business must sell to cover its fixed costs: the fixed costs divided by what each sale contributes. The same arithmetic tells you when a pass, a membership or an efficient appliance pays for itself.',
  keywords: ['break-even', 'break-even point', 'contribution margin', 'fixed costs', 'variable costs', 'target profit', 'margin of safety', 'operating leverage', 'payback', 'cost-volume-profit', 'small business'],
  prereq: ['costs-and-profit', 'math:linear-equations'],
  related: ['marginal-thinking', 'elasticity', 'npv', 'leverage-basics', 'household-budget', 'financial-statements'],
  body: `
Before opening a food truck, a café or an online shop, one question matters above all: **how much must I sell just to cover my costs?** Below that point every month loses money; above it every sale adds to profit. The answer is the **break-even point**, and it takes one division.

### Contribution margin
Each sale brings in the price $P$ and uses up the variable cost $v$ of that unit — ingredients, packaging, the card-payment fee. What is left, $P - v$, is the **contribution margin**: the sale's contribution first towards the fixed costs and then to profit. A food truck sells meals at ¤9 with ¤3.60 of variable cost: every meal contributes ¤5.40, or 60 % of the price.

### The break-even point
The fixed costs $F$ — the van lease, pitch fees, insurance, the owner's minimum pay — must be covered by those contributions:

$$Q_{BE} = \\frac{F}{P - v}$$

With fixed costs of ¤6,000 a month the truck needs $6000/5.40 = 1{,}111.1$ meals — in practice 1,112 a month, about 37 a day. In money that is ¤10,000 of sales: the fixed costs divided by the contribution ratio, $6000/0.6$. A profit target is simply added to the fixed costs: ¤3,000 a month needs $(6000 + 3000)/5.40 = 1{,}667$ meals.

| Change | Contribution per meal | Break-even |
|---|---:|---:|
| as planned (¤9 price, ¤3.60 cost) | ¤5.40 | 1,112 meals |
| price up to ¤10 | ¤6.40 | 938 meals |
| price down to ¤8 | ¤4.40 | 1,364 meals |
| ingredients up to ¤4.50 | ¤4.50 | 1,334 meals |

An 11 % price cut raises the meals needed by 23 %: discounts are expensive when margins are thin. Whether a higher price is wise depends on how many customers it loses — the [[elasticity]] of demand.

### Margin of safety and operating leverage
If the truck actually sells 1,500 meals a month it is 26 % above break-even — its **margin of safety**: sales could fall by a quarter before it loses money. Its profit is $1500 \\times 5.40 - 6000 = ¤2{,}100$. Because the fixed costs do not move, profit moves faster than sales: 10 % more meals add ¤810, a 39 % rise in profit. That ratio, about 3.9, is the **degree of operating leverage**. High fixed costs make a business more fragile in bad months and more profitable in good ones — the same double edge as borrowing to invest ([[leverage-basics]]).

### Break-even in everyday life
- A monthly travel pass costs ¤60 and a single fare ¤2.50: the pass pays for itself at 24 trips.
- A gym charges ¤35 a month or ¤7 a visit: at five visits the two cost the same, and from the sixth the membership is cheaper.
- An efficient appliance costs ¤300 more and saves ¤60 a year: it pays back in five years — somewhat longer if you count what the ¤300 could have earned meanwhile ([[npv]]).

> [!warn] Break-even analysis assumes a constant price and variable cost, and that everything made is sold. Fixed costs rise in steps (a second truck, a bigger kitchen), and when marginal cost rises with output there are two break-even points, not one ([[costs-and-profit]]). Treat it as a first test of a plan, not a forecast.

A business plan that needs sales far above what similar businesses achieve is a warning sign; one that breaks even at a modest, well-evidenced volume has room to survive a slow start. Knowing your break-even point turns a vague fear — "will this work?" — into a number you can check against reality.
`,
  ideas: [
    'Each sale contributes its price minus its variable cost towards the fixed costs.',
    'Break-even units = fixed costs ÷ contribution per unit; add a target profit to the fixed costs to find the sales it needs.',
    'Thin margins make price cuts expensive: a small discount can require many more sales.',
    'High fixed costs mean high operating leverage: profits swing more than sales, in both directions.',
    'Passes, memberships and energy-saving purchases have break-even points too.'
  ],
  pitfalls: [
    'Beyond break-even, each sale adds its whole price to profit — Only its contribution margin; the variable cost of that unit is still spent.',
    'A lower price always brings enough extra customers — The break-even volume rises fast when margins shrink; it depends on how elastic demand really is.',
    'Break-even means the owner is doing fine — At break-even the business covers its costs; whether that includes a fair wage for the owner depends on what was counted in the fixed costs.'
  ],
  formulas: [
    {
      name: 'Break-even quantity',
      expr: 'Q = F/(P - v)', tex: 'Q_{BE} = \\frac{F}{P - v}',
      vars: {
        Q: { name: 'units to sell to break even', tex: 'Q_{BE}' },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 6000 },
        P: { name: 'price per unit', q: 'money', unit: '$', value: 9 },
        v: { name: 'variable cost per unit', q: 'money', unit: '$', value: 3.6 }
      },
      note: 'Round up: a fraction of a meal is not sold. The defaults are the food truck, whose break-even is 1,112 meals a month.',
      practice: { unknowns: ['Q', 'P', 'F'] },
      stories: {
        Q: 'A food truck has fixed costs of {F} a month, sells meals at {P} and spends {v} on each. How many meals must it sell to break even?',
        P: 'A business has fixed costs of {F} a month and a variable cost of {v} a unit. What price lets it break even at {Q} units?',
        F: 'Units sell for {P} and cost {v} each to make. The business breaks even at {Q} units a month. What are its fixed costs?'
      }
    },
    {
      name: 'Units needed for a target profit',
      expr: 'Q = (F + T)/(P - v)', tex: 'Q_T = \\frac{F + T}{P - v}',
      vars: {
        Q: { name: 'units needed', tex: 'Q_T' },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 6000 },
        T: { name: 'target profit a period', q: 'money', unit: '$', value: 3000 },
        P: { name: 'price per unit', q: 'money', unit: '$', value: 9 },
        v: { name: 'variable cost per unit', q: 'money', unit: '$', value: 3.6 }
      },
      practice: { unknowns: ['Q', 'T'] },
      stories: {
        Q: 'Fixed costs are {F} a month, the price {P} and the variable cost {v} a unit. How many units bring a profit of {T}?',
        T: 'Fixed costs are {F} a month, the price {P} and the variable cost {v} a unit. What profit do {Q} units a month bring?'
      }
    },
    {
      name: 'Break-even sales revenue',
      expr: 'R = F/(1 - v/P)', tex: 'R_{BE} = \\frac{F}{1 - v/P}',
      vars: {
        R: { name: 'sales revenue to break even', q: 'money', unit: '$', tex: 'R_{BE}' },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 6000 },
        v: { name: 'variable cost per unit', q: 'money', unit: '$', value: 3.6 },
        P: { name: 'price per unit', q: 'money', unit: '$', value: 9 }
      },
      note: '$1 - v/P$ is the contribution ratio — the share of each sale left after variable costs. Useful for shops selling many products with similar margins.',
      practice: { unknowns: ['R'] },
      stories: { R: 'A product sells for {P} and has a variable cost of {v}; fixed costs are {F} a month. What sales revenue does the business need to break even?' }
    },
    {
      name: 'Degree of operating leverage',
      expr: 'DOL = Q*(P - v)/(Q*(P - v) - F)', tex: '\\mathrm{DOL} = \\frac{Q\\,(P - v)}{Q\\,(P - v) - F}',
      vars: {
        DOL: { name: 'degree of operating leverage (% change in profit per 1 % change in sales)', tex: '\\mathrm{DOL}', signed: true },
        Q: { name: 'units sold', value: 1500 },
        P: { name: 'price per unit', q: 'money', unit: '$', value: 9 },
        v: { name: 'variable cost per unit', q: 'money', unit: '$', value: 3.6 },
        F: { name: 'fixed costs a period', q: 'money', unit: '$', value: 6000 }
      },
      note: 'Total contribution divided by profit. It becomes very large just above break-even, where a small change in sales swings profit a lot.',
      practice: { unknowns: ['DOL'] },
      stories: { DOL: 'A business sells {Q} units at {P}, with a variable cost of {v} a unit and fixed costs of {F}. By how many per cent does its profit change for each 1 % change in sales?' }
    },
    {
      name: 'Payback time of a purchase',
      expr: 'n = C/s', tex: 'n = \\frac{C}{s}',
      vars: {
        n: { name: 'time to pay back', q: 'years', unit: 'yr' },
        C: { name: 'extra cost up front', q: 'money', unit: '$', value: 300 },
        s: { name: 'saving each year', q: 'money', unit: '$', value: 60 }
      },
      note: 'Simple payback ignores interest: money spent now could have earned a return, so the true break-even is later. Compare with [[npv|net present value]].',
      practice: { unknowns: ['n', 's'] },
      stories: {
        n: 'An efficient washing machine costs {C} more than a basic one and saves {s} a year on energy and water. How long until it pays for itself?',
        s: 'A purchase costing {C} extra should pay for itself in {n}. How much must it save each year?'
      }
    }
  ],
  examples: [
    {
      title: 'The food truck',
      q: 'Fixed costs are ¤6,000 a month, a meal sells for ¤9 and costs ¤3.60 to make. Find the break-even point in meals and in sales, the meals needed for ¤3,000 of profit, and the margin of safety at 1,500 meals.',
      steps: [
        'Contribution per meal: $9 - 3.60 = ¤5.40$ (60 % of the price).',
        'Break-even: $6\\,000/5.40 = 1\\,111.1$, so 1,112 meals, or $6\\,000/0.6 = ¤10{,}000$ of sales.',
        'For ¤3,000 of profit: $(6\\,000 + 3\\,000)/5.40 = 1\\,666.7$, so 1,667 meals.',
        'At 1,500 meals: profit $1\\,500 \\times 5.40 - 6\\,000 = ¤2{,}100$; margin of safety $(1\\,500 - 1\\,111)/1\\,500 = 26\\,$ per cent.'
      ],
      a: '1,112 meals (¤10,000 of sales); 1,667 meals for ¤3,000 profit; at 1,500 meals sales can fall 26 % before a loss.'
    },
    {
      title: 'Pass or pay as you go?',
      q: 'A monthly travel pass costs ¤60; a single journey costs ¤2.50. You travel to work and back on 21 working days a month and make about 4 other trips. Which is cheaper?',
      steps: [
        'Break-even: $60/2.50 = 24$ journeys a month.',
        'Your journeys: $21 \\times 2 + 4 = 46$ — almost twice the break-even.',
        'Paying per journey would cost $46 \\times 2.50 = ¤115$; the pass saves ¤55 a month.'
      ],
      a: 'The pass, by about ¤55 a month; it would stop paying only below 24 journeys.'
    }
  ],
  quiz: [
    { q: 'Fixed costs are ¤4,000 a month, the price ¤25 and the variable cost ¤15 a unit. How many units must be sold to break even?', answer: 400,
      why: 'Contribution per unit is ¤10, so 4,000/10 = 400 units.' },
    { q: 'Which change lowers the break-even point (other things equal)?', choices: ['a rise in rent', 'a rise in the variable cost per unit', 'a rise in the price, if sales hold up', 'a fall in the price'], a: 2,
      why: 'A higher price raises the contribution per unit, so fewer units cover the fixed costs. The other three raise the break-even point.' },
    { q: 'Once past break-even, every extra sale adds its full price to profit.', a: false,
      why: 'Each extra sale adds only its contribution margin — the price minus that unit\'s variable cost.' },
    { q: 'A gym costs ¤35 a month or ¤7 a visit. At how many visits a month do the two cost the same?', answer: 5,
      why: '35/7 = 5 visits. Below that, paying per visit is cheaper; above, the membership.' },
    { q: 'A business with high fixed costs and low variable costs…', choices: ['has steady profits whatever its sales', 'sees profits swing strongly with sales', 'has a low break-even point', 'has no break-even point'], a: 1,
      why: 'Its operating leverage is high: most of each extra sale is profit, and most of each lost sale is lost profit.' }
  ],
  applications: [
    'Testing a business plan: is the break-even volume realistic for this location and market?',
    'Setting prices and judging discounts when margins are thin.',
    'Personal choices: travel passes, memberships, subscriptions, solar panels and efficient appliances.',
    'Reading why airlines, hotels and factories — high fixed costs — swing from large losses to large profits.'
  ],
  sim: { id: 'mic-costs', params: { view: 'total', F: 6000, v: 3.6, m: 0, P: 9, unit: 'meals', one: 'meal', per: 'month', qmax: 3000 }, title: 'A break-even chart: the food truck' }
},

/* ================================================================ market structures */
{
  id: 'market-structures', parent: 'firms-competition', title: 'Competition, monopoly and oligopoly', level: 2,
  short: 'How the number of sellers, the kind of product and the ease of entry decide a firm\'s power over price — from perfect competition to monopoly, with oligopolies, cartels, regulation and monopsony in between.',
  keywords: ['perfect competition', 'monopoly', 'oligopoly', 'monopolistic competition', 'market power', 'marginal revenue', 'markup', 'Lerner index', 'Cournot', 'Bertrand', 'cartel', 'OPEC', 'natural monopoly', 'antitrust', 'competition law', 'HHI', 'monopsony'],
  prereq: ['costs-and-profit', 'elasticity', 'consumer-producer-surplus'],
  related: ['game-theory', 'price-controls', 'externalities', 'stocks-shares', 'pe-ratio'],
  body: `
A wheat farmer cannot choose her price: thousands of others sell the same grain, and if she asks more she sells nothing. The only ferry to an island faces no such limit — it can raise the fare and keep most passengers. Most markets lie between. How many sellers there are, how alike their products are and how easily newcomers can enter decide how much power firms have over price — and so what you pay.

| Structure | Sellers | Product | Power over price | Examples |
|---|---|---|---|---|
| Perfect competition | very many | identical | none | wheat, foreign currency |
| Monopolistic competition | many | differentiated | a little | restaurants, hairdressers, clothing |
| Oligopoly | a few | similar or differentiated | considerable, watching rivals | airlines, mobile networks, cement |
| Monopoly | one | no close substitute | large | a local water network, a patented drug |

### How a monopolist prices
A firm facing the whole demand curve must cut its price to sell one more unit — and, unless it can charge customers different prices, it cuts it on every unit. So its **marginal revenue** is below the price. It maximises profit where marginal revenue equals marginal cost, and charges what buyers will pay for that quantity.

Take a ferry route with demand $P = 60 - 0.01Q$ (fare in ¤, $Q$ trips a week) and a cost of ¤10 per trip. Marginal revenue is $60 - 0.02Q$; setting it equal to 10 gives 2,500 trips at a fare of ¤35 and a profit of ¤62,500 a week. Under competition the fare would fall to the ¤10 cost and 5,000 trips would be made. Passengers' surplus shrinks from ¤125,000 to ¤31,250 a week; the owner takes ¤62,500 of it, and ¤31,250 simply disappears — the **deadweight loss** of the trips worth making that are no longer made.

At its best price a monopolist's markup obeys

$$\\frac{P - MC}{P} = \\frac{1}{|E|}$$

where $E$ is the elasticity of demand there. On the ferry $|E| = 1.4$ and the markup is ¤25 on ¤35, or 71 % of the fare. The more substitutes buyers have, the smaller the markup; and a monopolist never prices where demand is inelastic, since a higher price would then raise revenue and cut costs.

### Oligopoly: a few firms watching each other
With a few firms, each one's best move depends on the others' — the subject of [[game-theory]]. In the Cournot model each firm chooses its output taking the rivals' as given. With $N$ identical ferry firms the fare becomes

$$P = \\frac{A + N\\,c}{N + 1}$$

— ¤35 with one firm, ¤26.67 with two, ¤20 with four, ¤12.50 with nineteen. It falls towards cost as rivals arrive, fastest at first. If instead firms selling identical products undercut each other's prices (the Bertrand model), two can be enough to drive the price down to cost — one reason firms work so hard to make their products different.

### Cartels, and why they crack
Firms earn more by agreeing to act as one monopolist — a **cartel**, illegal in most countries. Two ferry firms sharing the monopoly output earn ¤31,250 each. But if one secretly runs 1,875 trips while the other keeps to 1,250, the fare falls to ¤28.75 and the cheat earns ¤35,156 — so cartels are fragile. OPEC, founded in 1960 by oil-exporting states, is the best-known producers' group: an embargo and output cuts in 1973–74 helped quadruple the oil price, but members have often exceeded their quotas and supply from outside the group has limited its power. Economists debate how far it acts as a true cartel rather than following its largest member, Saudi Arabia; since 2016 it has coordinated with other exporters, including Russia, as "OPEC+".

### Natural monopoly, competition law and monopsony
Where fixed costs are huge and extra customers cheap — pipes, power grids, rail track — one network is cheaper than two, so such **natural monopolies** are usually regulated or publicly owned. Elsewhere, competition authorities ban price-fixing and review mergers, often measuring concentration with the **HHI**, the sum of squared market shares: 40, 30, 20 and 10 % give 3,000, usually called highly concentrated. Power can also sit with the buyer — a big employer in a small town — which is **monopsony**, one reason moderate [[price-controls|minimum wages]] need not cost jobs.

> [!tip] Switching costs, loyalty traps and bundles are tools of market power; being willing to compare and switch is the counterweight. For an investor, a firm's lasting power over price is much of what its shares are worth.
`,
  ideas: [
    'The fewer the rivals and the more distinctive the product, the more power a firm has over its price.',
    'A monopolist sets marginal revenue equal to marginal cost: it sells less, at a higher price, than a competitive market would, and some surplus is destroyed.',
    'The markup over marginal cost is larger when demand is less elastic: (P − MC)/P = 1/|E|.',
    'As rivals are added, prices fall towards cost; cartels try to prevent this but tempt their own members to cheat.',
    'Natural monopolies are regulated; cartels and harmful mergers are policed by competition law.'
  ],
  pitfalls: [
    'A monopolist can charge any price it likes — It can choose the price, but buyers still decide how much to buy; a higher price means fewer sales. It picks the price that maximises profit, not the highest possible one.',
    'Large firms are always monopolies — Size is not power over price. A large firm in a market with strong rivals and easy entry may have little.',
    'More firms always means lower prices — Usually, but a price war between two firms can already drive prices to cost, while many firms with differentiated products may keep healthy markups.'
  ],
  formulas: [
    {
      name: 'Monopoly output (straight-line demand, constant cost)',
      expr: 'Qm = (A - c)/(2*B)', tex: 'Q_m = \\frac{A - c}{2B}',
      vars: {
        Qm: { name: 'monopoly output', tex: 'Q_m' },
        A: { name: 'highest price anyone would pay (demand P = A − B·Q)', q: 'money', unit: '$', value: 60 },
        c: { name: 'marginal cost per unit', q: 'money', unit: '$', value: 10 },
        B: { name: 'fall in price per extra unit sold', q: 'money', unit: '$', value: 0.01 }
      },
      note: 'Half the competitive output $(A - c)/B$. The defaults are the ferry route: 2,500 trips a week.',
      practice: { unknowns: ['Qm'] },
      stories: { Qm: 'A monopolist faces demand P = {A} − {B}·Q and a marginal cost of {c}. How much does it sell?' }
    },
    {
      name: 'Monopoly price',
      expr: 'Pm = (A + c)/2', tex: 'P_m = \\frac{A + c}{2}',
      vars: {
        Pm: { name: 'monopoly price', q: 'money', unit: '$', tex: 'P_m' },
        A: { name: 'highest price anyone would pay', q: 'money', unit: '$', value: 60 },
        c: { name: 'marginal cost per unit', q: 'money', unit: '$', value: 10 }
      },
      note: 'Only half of any rise in marginal cost is passed on to the price.',
      practice: { unknowns: ['Pm', 'c'] },
      stories: {
        Pm: 'Demand is a straight line starting at {A}, and the monopolist\'s marginal cost is {c}. What price does it charge?',
        c: 'A monopolist on a straight demand line starting at {A} charges {Pm}. What is its marginal cost?'
      }
    },
    {
      name: 'Price with N competing firms (Cournot)',
      expr: 'P = (A + N*c)/(N + 1)', tex: 'P = \\frac{A + N\\,c}{N + 1}',
      vars: {
        P: { name: 'market price', q: 'money', unit: '$' },
        A: { name: 'highest price anyone would pay', q: 'money', unit: '$', value: 60 },
        N: { name: 'number of identical firms', value: 2, int: true, min: 1, max: 12 },
        c: { name: 'marginal cost per unit', q: 'money', unit: '$', value: 10 }
      },
      note: '$N = 1$ is monopoly; as $N$ grows the price approaches the cost $c$.',
      practice: { unknowns: ['P'] },
      stories: { P: '{N} identical firms compete on quantity in a market whose demand line starts at {A}. Each has a marginal cost of {c}. What is the market price?' }
    },
    {
      name: 'Monopoly price from the markup rule',
      expr: 'P = c*E/(E + 1)', tex: 'P = \\frac{c\\,E}{E + 1}',
      vars: {
        P: { name: 'profit-maximising price', q: 'money', unit: '$' },
        c: { name: 'marginal cost', q: 'money', unit: '$', value: 10 },
        E: { name: 'price elasticity of demand at that price (below −1)', value: -1.4, signed: true, max: -1.0001 }
      },
      note: 'The same as $(P - MC)/P = 1/|E|$. With $E = -2$ the price is twice marginal cost; as demand becomes very elastic the price approaches cost.',
      practice: { unknowns: ['P', 'E'] },
      stories: {
        P: 'A firm with market power has a marginal cost of {c}, and demand at its price has an elasticity of {E}. What price maximises its profit?',
        E: 'A firm with a marginal cost of {c} charges {P}, which maximises its profit. What is the elasticity of demand at that price?'
      }
    },
    {
      name: 'Deadweight loss of a monopoly',
      expr: 'DWL = (A - c)^2/(8*B)', tex: '\\mathrm{DWL} = \\frac{(A - c)^2}{8B}',
      vars: {
        DWL: { name: 'deadweight loss a period', q: 'money', unit: '$', tex: '\\mathrm{DWL}' },
        A: { name: 'highest price anyone would pay', q: 'money', unit: '$', value: 60 },
        c: { name: 'marginal cost', q: 'money', unit: '$', value: 10 },
        B: { name: 'fall in price per extra unit sold', q: 'money', unit: '$', value: 0.01 }
      },
      note: 'For straight-line demand and constant marginal cost it is exactly half the monopolist\'s profit.',
      practice: { unknowns: ['DWL'] },
      stories: { DWL: 'Demand is P = {A} − {B}·Q and marginal cost is {c}. How much surplus does a monopoly destroy each period?' }
    }
  ],
  examples: [
    {
      title: 'The ferry monopolist',
      q: 'Demand for trips is $P = 60 - 0.01Q$ and each trip costs ¤10. Find the monopoly fare, the profit, the passengers\' surplus and the deadweight loss, and compare with competition.',
      steps: [
        'Marginal revenue: $MR = 60 - 0.02Q$. Set $MR = 10$: $Q = 2\\,500$ trips; fare $60 - 25 = ¤35$.',
        'Profit: $(35 - 10) \\times 2\\,500 = ¤62{,}500$ a week.',
        'Passengers\' surplus: $\\tfrac{1}{2}(60 - 35) \\times 2\\,500 = ¤31{,}250$.',
        'Competition: fare ¤10, 5,000 trips, surplus $\\tfrac{1}{2} \\times 50 \\times 5\\,000 = ¤125{,}000$.',
        'Deadweight loss: $\\tfrac{1}{2}(35 - 10)(5\\,000 - 2\\,500) = ¤31{,}250$.'
      ],
      a: 'Fare ¤35, 2,500 trips, profit ¤62,500; passengers keep ¤31,250 of ¤125,000, and ¤31,250 is lost.'
    },
    {
      title: 'Two ferries, and the temptation to cheat',
      q: 'A second firm starts sailing the route. Find the Cournot fare, then compare a cartel and a cartel in which one member cheats.',
      steps: [
        'Cournot with $N = 2$: $P = (60 + 2 \\times 10)/3 = ¤26.67$; total trips $2/3 \\times 5\\,000 = 3\\,333$; each firm earns $16.67 \\times 1\\,667 = ¤27{,}778$.',
        'Cartel: they run 2,500 trips together at ¤35, 1,250 each, and earn ¤31,250 each.',
        'Cheating: if the other keeps to 1,250, the best reply is $q = (60 - 10 - 0.01 \\times 1\\,250)/0.02 = 1\\,875$ trips. The fare falls to ¤28.75.',
        'The cheat earns $18.75 \\times 1\\,875 = ¤35{,}156$; the loyal member only $18.75 \\times 1\\,250 = ¤23{,}438$.'
      ],
      a: 'Competing: ¤26.67. Colluding: ¤35 and ¤31,250 each — but cheating pays ¤35,156, which is why cartels crack.'
    }
  ],
  quiz: [
    { q: 'A monopolist\'s marginal revenue is below its price because…', choices: ['its costs are higher', 'to sell one more unit it must cut the price on all its units', 'governments tax monopolies', 'its demand is inelastic'], a: 1,
      why: 'The extra unit brings in its price, but every other unit now sells for a little less. Marginal revenue is the net of the two.' },
    { q: 'Demand is $P = 100 - 0.5Q$ and marginal cost is a constant ¤20. What price does a monopolist charge, in ¤?', answer: 60, unit: '$',
      why: '$MR = 100 - Q = 20$ gives $Q = 80$ and $P = 100 - 40 = ¤60$ — the same as $(A + c)/2$.' },
    { q: 'A monopolist can raise its price as far as it likes without losing sales.', a: false,
      why: 'Buyers still follow the demand curve: each price rise loses some customers. The monopolist chooses the price where the trade-off maximises profit.' },
    { q: 'Why are cartels hard to keep together?', choices: ['each member gains by secretly producing more than its quota', 'demand always rises', 'costs are always falling', 'cartels must publish their prices'], a: 0,
      why: 'At the cartel price, extra output is very profitable for whoever sells it — as long as the others hold back. Everyone faces the same temptation.' },
    { q: 'Three firms have market shares of 50 %, 30 % and 20 %. What is the HHI?', answer: 3800,
      why: '$50^2 + 30^2 + 20^2 = 2\\,500 + 900 + 400 = 3\\,800$ — a highly concentrated market.' }
  ],
  applications: [
    'Understanding why fares, drug prices or broadband bills are higher where there is little competition.',
    'Competition law: cartel fines, merger reviews and the regulation of utilities.',
    'Business strategy: differentiation, brand loyalty and barriers to entry as sources of pricing power.',
    'Investing: a lasting competitive advantage supports profits — and share prices — for years.'
  ],
  history: 'Antoine Augustin Cournot analysed monopoly and competition between a few producers in 1838; Joseph Bertrand criticised his model in 1883, starting the debate over whether firms compete on quantities or prices. The United States\' Sherman Act of 1890 was an early law against monopolisation and price-fixing; today most countries have a competition authority.',
  sim: 'mic-oligopoly'
},

/* ================================================================ externalities */
{
  id: 'externalities', parent: 'firms-competition', title: 'Externalities and public goods', level: 2,
  short: 'Costs and benefits that fall on people outside a trade — pollution, congestion, vaccination, research. Markets ignore them, producing too much harm and too little good; corrective taxes, permits, rules and public provision are the remedies, each with its debates.',
  keywords: ['externality', 'external cost', 'external benefit', 'pollution', 'Pigouvian tax', 'carbon tax', 'carbon price', 'cap and trade', 'emissions trading', 'Coase theorem', 'public good', 'free rider', 'tragedy of the commons', 'social cost'],
  prereq: ['consumer-producer-surplus', 'marginal-thinking', 'market-equilibrium'],
  related: ['game-theory', 'price-controls', 'fiscal-policy', 'insurance-basics'],
  body: `
When a factory upwind burns coal, you breathe some of its smoke. It pays for its coal, its workers and its machines, but not for your cough or the soot on your washing. A side effect on people outside a trade is an **externality**. Nobody in the market pays for it, so the market takes no account of it — and ends up making too much of what harms others and too little of what benefits them.

### Private cost and social cost
A producer's price covers its **private** costs. Adding the harm done to others, the **marginal external cost**, gives the cost to society: $MSC = MPC + MEC$.

Picture a chemical whose production pollutes a river. What buyers would pay is $P = 120 - 2Q$, producers' private cost is $20 + 2Q$ ($Q$ in thousand tonnes a year, prices in ¤ per tonne), and each tonne does ¤30 of damage downstream. The market settles where demand meets private cost: 25 thousand tonnes at ¤70. Society is best off where demand meets *social* cost: $120 - 2Q = 50 + 2Q$, or 17.5 thousand tonnes at ¤85. The last 7,500 tonnes are worth less to buyers than they cost everyone together; the net loss is $\\tfrac{1}{2} \\times 30 \\times 7\\,500 = ¤112{,}500$ a year.

### Remedies
- **A corrective (Pigouvian) tax** equal to the external cost at the best output — ¤30 a tonne — makes producers feel the whole cost. The market then settles at 17.5 thousand tonnes by itself, and the tax raises ¤525,000 a year that can compensate victims, cut other taxes or be returned to households.
- **Cap-and-trade** fixes the quantity instead: the government issues permits for a total amount of pollution and lets firms trade them, so emissions are cut wherever cutting is cheapest. The European Union's Emissions Trading System, running since 2005, is the largest example.
- **Regulation** — limits, required technologies, bans — is simple to explain and enforce, but ignores that cutting pollution costs some firms far more than others.
- **Bargaining**: Ronald Coase showed that with clear property rights and cheap negotiation, the people affected can agree a solution themselves, as neighbours can over noise. With millions of polluters and victims, that is impossible.

> [!key] A corrective tax is not meant to punish or to stop an activity altogether. It makes the price tell the truth about the full cost, and then buyers and producers decide how much is still worth doing.

### Carbon pricing: evidence and debate
Carbon dioxide from fossil fuels is the largest externality of all: the damage from climate change falls on everyone, far into the future. A litre of petrol releases about 2.3 kg of CO₂ when burnt, so a carbon price of ¤50 a tonne adds about ¤0.12 a litre; a kilowatt-hour from coal (about 1 kg) about ¤0.05, from gas (about 0.4 kg) ¤0.02 — a nudge towards cleaner choices everywhere at once.

Sweden has taxed carbon since 1991 and British Columbia since 2008; most studies of British Columbia find emissions a few per cent to about 15 % lower than they would otherwise have been, with little effect on the economy as a whole. The debates are real. Carbon prices take a bigger share of poorer households' budgets unless the revenue is returned to them. Industries fear rivals in countries without a price, which is why the EU is adding a carbon charge on some imports. France's "yellow vest" protests in 2018, sparked partly by a planned fuel-tax rise, showed how contested the costs can be. And estimates of the right price range from tens to several hundred per tonne, depending on how damage is modelled and how much weight the future gets. Most economists favour pricing carbon; many also support clean-technology subsidies and standards, and they disagree about the level and the design.

### Positive externalities and public goods
A vaccination protects the people around you; research spills over to other firms. Here markets produce too little, and subsidies, patents or public provision help. **Public goods** are the extreme: *non-rival* (my use does not reduce yours) and *non-excludable* (nobody can be kept out) — street lighting, flood defences, basic research. Everyone is tempted to **free-ride**, so they are usually paid for by taxes. Resources that are rival but open to all — fish stocks, groundwater, pasture — tend to be overused: the **tragedy of the commons**. Elinor Ostrom, the first woman awarded the Nobel prize in economics (2009), showed that communities often manage such commons well with rules of their own.
`,
  ideas: [
    'An externality is a cost or benefit that falls on people outside the trade, so the market price ignores it.',
    'With an external cost the market produces too much; with an external benefit, too little.',
    'A tax equal to the marginal external cost at the best output (a Pigouvian tax) lets the market find the efficient quantity.',
    'Cap-and-trade fixes the quantity and lets a permit price emerge; a tax fixes the price and lets the quantity adjust.',
    'Public goods are non-rival and non-excludable, so free riders leave them underprovided unless they are paid for collectively.'
  ],
  pitfalls: [
    'A pollution tax simply makes the economy poorer — When set near the external cost it raises total welfare: the output it discourages cost society more than it was worth. The revenue can be returned or used to cut other taxes.',
    'The efficient amount of pollution is zero — It is where the benefit of the last tonne of output equals its full cost, harm included. Cutting to zero may cost more than the damage avoided.',
    'Carbon pricing is settled science and economics — The case for pricing is widely accepted among economists, but the right level, the use of the revenue and the effect on poorer households are genuinely debated.'
  ],
  formulas: [
    {
      name: 'Marginal social cost',
      expr: 'MSC = MPC + MEC', tex: '\\mathrm{MSC} = \\mathrm{MPC} + \\mathrm{MEC}',
      vars: {
        MSC: { name: 'marginal social cost (per unit)', q: 'money', unit: '$', tex: '\\mathrm{MSC}' },
        MPC: { name: 'marginal private cost (what the producer pays)', q: 'money', unit: '$', value: 70, tex: '\\mathrm{MPC}' },
        MEC: { name: 'marginal external cost (harm to others)', q: 'money', unit: '$', value: 30, tex: '\\mathrm{MEC}' }
      },
      practice: { unknowns: ['MSC', 'MEC'] },
      stories: {
        MSC: 'Producing one more tonne costs the firm {MPC} and does {MEC} of damage to people downstream. What does it cost society?',
        MEC: 'A tonne costs its producer {MPC} but society {MSC}. How much harm does it do to others?'
      }
    },
    {
      name: 'Overproduction when an external cost is ignored',
      expr: 'dQ = E/(mD + mS)', tex: '\\Delta Q = \\frac{E}{m_D + m_S}',
      vars: {
        dQ: { name: 'units made beyond the efficient amount', tex: '\\Delta Q' },
        E: { name: 'external cost per unit', q: 'money', unit: '$', value: 30 },
        mD: { name: 'fall in buyers\' value per extra unit (slope of demand)', q: 'money', unit: '$', value: 2, tex: 'm_D' },
        mS: { name: 'rise in private cost per extra unit (slope of supply)', q: 'money', unit: '$', value: 2, tex: 'm_S' }
      },
      note: 'For straight-line curves and a constant external cost. In the river example the units are thousand tonnes: 7.5 thousand tonnes too many.',
      practice: { unknowns: ['dQ'] },
      stories: { dQ: 'Each unit does {E} of harm. Buyers\' value falls by {mD} and private cost rises by {mS} per extra unit. How many units too many does the market make?' }
    },
    {
      name: 'Deadweight loss of an ignored external cost',
      expr: 'DWL = E^2/(2*(mD + mS))', tex: '\\mathrm{DWL} = \\frac{E^2}{2\\,(m_D + m_S)}',
      vars: {
        DWL: { name: 'net loss to society a period', q: 'money', unit: '$', tex: '\\mathrm{DWL}' },
        E: { name: 'external cost per unit', q: 'money', unit: '$', value: 30 },
        mD: { name: 'slope of demand (¤ per unit)', q: 'money', unit: '$', value: 2, tex: 'm_D' },
        mS: { name: 'slope of supply (¤ per unit)', q: 'money', unit: '$', value: 2, tex: 'm_S' }
      },
      note: 'The triangle between social cost and demand. With the river example\'s quantities in thousand tonnes, 112.5 means ¤112,500 a year. A Pigouvian tax of $E$ removes it.',
      practice: { unknowns: ['DWL'] },
      stories: { DWL: 'Each unit does {E} of harm that the market ignores. Demand falls by {mD} and supply rises by {mS} per unit. How much value is lost?' }
    },
    {
      name: 'What a carbon price adds to the price of fuel',
      expr: 'dp = t*f/1000', tex: '\\Delta p = \\frac{t\\,f}{1000}',
      vars: {
        dp: { name: 'extra cost per litre', q: 'money', unit: '$', tex: '\\Delta p' },
        t: { name: 'carbon price per tonne of CO₂', q: 'money', unit: '$', value: 50 },
        f: { name: 'kilograms of CO₂ per litre burnt (petrol ≈ 2.3, diesel ≈ 2.7)', value: 2.31 }
      },
      note: 'Works for any fuel or energy with $f$ per unit: about 1 kg per kWh of coal-fired electricity, 0.4 kg for gas.',
      practice: { unknowns: ['dp', 't'] },
      stories: {
        dp: 'A carbon price of {t} per tonne applies to a fuel that emits {f} kg of CO₂ per litre. How much does it add to each litre?',
        t: 'A fuel emits {f} kg of CO₂ per litre. What carbon price per tonne adds {dp} to each litre?'
      }
    }
  ],
  examples: [
    {
      title: 'The polluted river',
      q: 'Demand is $P = 120 - 2Q$, private cost $20 + 2Q$ ($Q$ in thousand tonnes, ¤ per tonne), and each tonne does ¤30 of damage. Compare the market with the best outcome, and show what a ¤30 tax does.',
      steps: [
        'Market: $120 - 2Q = 20 + 2Q$, so $Q = 25$ thousand tonnes at ¤70. Damage: $30 \\times 25\\,000 = ¤750{,}000$ a year.',
        'Best: $120 - 2Q = 50 + 2Q$, so $Q = 17.5$ thousand tonnes at ¤85.',
        'Loss from the extra 7,500 tonnes: $\\tfrac{1}{2} \\times 30 \\times 7\\,500 = ¤112{,}500$ a year.',
        'With a ¤30 tax, producers face $50 + 2Q$ and choose 17.5 thousand tonnes. Damage falls to ¤525,000 and the tax raises ¤525,000.'
      ],
      a: 'The market makes 25 thousand tonnes, society\'s best is 17.5; a ¤30 tax gets there and removes the ¤112,500 loss.'
    },
    {
      title: 'A carbon price at the pump',
      q: 'A household buys 1,200 litres of petrol a year. What does a carbon price of ¤50 a tonne add, and how would it change if the revenue were returned equally as a dividend?',
      steps: [
        'Per litre: $50 \\times 2.31/1000 = ¤0.116$.',
        'Per year: $1\\,200 \\times 0.116 = ¤139$.',
        'If the revenue is returned as an equal payment to every household, a household that uses less fuel than average gets back more than it pays, and one that uses more gets back less — but both still gain by cutting fuel use, because each litre saved saves ¤0.116.'
      ],
      a: 'About ¤0.12 a litre, or ¤139 a year; returning the revenue keeps the incentive while offsetting the average cost.'
    }
  ],
  quiz: [
    { q: 'Left alone, a market for a good whose production pollutes produces…', choices: ['too little', 'too much', 'exactly the right amount', 'nothing at all'], a: 1,
      why: 'Producers ignore the harm to others, so they supply units whose full cost exceeds what buyers value them at.' },
    { q: 'Demand is $P = 100 - Q$, private cost $20 + Q$, and each unit does ¤20 of harm to others. What is the efficient quantity?', answer: 30,
      why: 'Social cost is $40 + Q$. Setting $100 - Q = 40 + Q$ gives $Q = 30$ (the market alone would make 40).' },
    { q: 'A tax equal to the external cost reduces total welfare because it shrinks the market.', a: false,
      why: 'It removes only units whose full cost exceeded their value, so total welfare rises; the revenue is a transfer, not a loss.' },
    { q: 'Why is street lighting rarely sold privately?', choices: ['lamps are too expensive', 'nobody can be excluded, so people free-ride', 'one person\'s use leaves less for others', 'it causes pollution'], a: 1,
      why: 'It is non-excludable (and non-rival): each person can enjoy it without paying, so few would pay voluntarily. Taxes solve the free-rider problem.' },
    { q: 'A carbon price of ¤80 a tonne applies to diesel, which releases about 2.68 kg of CO₂ per litre. How much does it add per litre, in ¤?', answer: 0.2144, unit: '$',
      why: '$80 \\times 2.68/1000 = ¤0.214$ a litre.' }
  ],
  applications: [
    'Carbon taxes and emissions trading, congestion charges, plastic-bag levies and landfill taxes.',
    'Subsidies for vaccination, research and education, where the benefits spread beyond the buyer.',
    'Public goods and the case for collective funding: defence, flood barriers, street lighting, basic science.',
    'Managing commons: fishing quotas, water rights and community rules.'
  ],
  history: 'Arthur Cecil Pigou proposed taxing activities that harm others in *The Economics of Welfare* (1920). Ronald Coase answered in 1960 that bargaining can solve such problems when rights are clear and transactions cheap. Elinor Ostrom\'s studies of fisheries, forests and irrigation won the 2009 Nobel prize in economics.',
  sim: 'mic-externality'
},

/* ================================================================ game theory */
{
  id: 'game-theory', parent: 'firms-competition', title: 'Game theory and strategy', level: 2,
  short: 'Decisions whose outcome depends on what others decide: dominant strategies, Nash equilibrium, the prisoner\'s dilemma, how repetition sustains cooperation, credible threats and what people really do.',
  keywords: ['game theory', 'strategy', 'payoff matrix', 'dominant strategy', 'Nash equilibrium', 'prisoner\'s dilemma', 'coordination game', 'repeated game', 'tit for tat', 'grim trigger', 'backward induction', 'credible threat', 'mixed strategy', 'ultimatum game', 'negotiation'],
  prereq: ['market-structures', 'math:expected-value', 'math:geometric-series'],
  related: ['externalities', 'costs-and-profit', 'cognitive-biases', 'loss-aversion'],
  body: `
Two petrol stations face each other across a junction. If both keep prices high, both do well. If one cuts, it steals the other's customers — so each is tempted to cut, and if both do, both earn less than before. Neither can decide what is best alone, because the best choice depends on the other's. **Game theory** studies such strategic situations: markets with few firms, negotiations, auctions, climate treaties and much of daily life.

### Players, strategies, payoffs
A game lists the **players**, the **strategies** open to each, and the **payoffs** for every combination. The stations' monthly profits, in thousands of ¤ (yours first):

| | Rival keeps prices high | Rival cuts |
|---|---|---|
| **You keep prices high** | 3, 3 | 0, 5 |
| **You cut** | 5, 0 | 1, 1 |

Whatever the rival does, cutting pays you more (5 > 3, and 1 > 0): cutting is a **dominant strategy**. Both cut and both earn 1 instead of 3. This is the **prisoner's dilemma**: choices that are sensible one by one add up to an outcome both dislike. It explains price wars, advertising arms races, overfishing, doping in sport and why climate agreements are hard.

### Nash equilibrium
A **Nash equilibrium** is a set of choices in which nobody can do better by changing only their own. "Both cut" is one. John Nash proved in 1950 that every finite game has at least one, if players may randomise. Many games have several: which side of the road to drive on is a **coordination game** with two equilibria, and law or history picks one. Technology standards work the same way.

### The shadow of the future
Stations that meet every month are not playing once. Suppose each keeps prices high as long as the other does, and cuts for ever after any cut (a *grim trigger*). With a probability $\\delta$ that the game goes on another round, cooperating is worth $R/(1 - \\delta)$ and cheating once $T + \\delta P/(1 - \\delta)$, where $T$, $R$ and $P$ are the temptation, reward and punishment payoffs (5, 3 and 1). Cooperation holds when

$$\\delta \\ge \\frac{T - R}{T - P}$$

— here a probability of 0.5 or more. That is why tacit collusion appears where the same few firms meet again and again, and why competition authorities watch such markets.

In 1980 the political scientist Robert Axelrod ran computer tournaments of the repeated prisoner's dilemma with strategies sent in by experts. The winner was one of the simplest: **tit for tat**, submitted by the psychologist Anatol Rapoport — cooperate first, then copy the other player's last move. It is *nice* (never defects first), *retaliates* at once, *forgives* as soon as the other cooperates, and is *clear*. Where mistakes happen, more forgiving strategies do better, because one slip can start an endless feud between two strict retaliators.

### Moves in sequence and credible threats
When players move in turn, look ahead and reason back (**backward induction**). An established firm may threaten a price war if a newcomer enters; but if, once the newcomer is in, fighting would hurt the incumbent more than sharing, the threat is not **credible** and a sensible entrant ignores it. Commitments that tie your own hands — a contract, a public pledge, a large investment — can make threats and promises believable.

### Mixing, and real people
A penalty taker who always shoots left is easy to stop; kicker and goalkeeper both do best by randomising, and studies of professional penalty kicks find choices close to the mixed-strategy equilibrium. In laboratories people are both fairer and more spiteful than pure self-interest predicts. In the *ultimatum game* one player proposes how to split a sum and the other accepts or rejects (then both get nothing); proposers typically offer 40–50 %, and offers below about 20–30 % are often rejected.

> [!tip] In any negotiation — a salary, a car, a lease — your strongest card is a good alternative if the talks fail. Knowing yours, and estimating the other side's, changes what you can ask for; and most negotiations are repeated games in which reputation counts.
`,
  ideas: [
    'In a strategic situation your best choice depends on what others choose, and theirs on yours.',
    'A dominant strategy is best whatever the others do; a Nash equilibrium is a set of choices nobody wants to change alone.',
    'In the prisoner\'s dilemma, individually rational choices leave everyone worse off.',
    'Repetition makes cooperation possible when the future matters enough: δ ≥ (T − R)/(T − P).',
    'Threats and promises count only if carrying them out would be in the player\'s interest when the time comes.'
  ],
  pitfalls: [
    'A Nash equilibrium is the best outcome for the players — In the prisoner\'s dilemma the equilibrium (both cut) is worse for both than cooperating. Equilibrium means stability, not optimality.',
    'Game theory assumes people are selfish calculating machines — The payoffs can include fairness, reputation and care for others; experiments show people value these, and the theory can include them.',
    'Tit for tat always wins — It won Axelrod\'s tournaments, but with noise or a different mix of opponents, more forgiving strategies such as generous tit for tat or win-stay, lose-shift often do better.'
  ],
  derivation: {
    title: 'When does cooperation pay in a repeated game?',
    steps: [
      { text: 'Each round the game continues with probability $\\delta$. Cooperating for ever earns $R$ each round, a [[math:geometric-series|geometric series]]:', tex: 'V_C = R + \\delta R + \\delta^2 R + \\dots = \\frac{R}{1 - \\delta}' },
      { text: 'Cheating earns the temptation $T$ once, then the punishment $P$ in every later round:', tex: 'V_D = T + \\delta P + \\delta^2 P + \\dots = T + \\frac{\\delta P}{1 - \\delta}' },
      { text: 'Cooperation is worth keeping when $V_C \\ge V_D$. Multiply by $1 - \\delta$:', tex: 'R \\ge T(1 - \\delta) + \\delta P' },
      { text: 'Rearrange:', tex: '\\delta \\ge \\frac{T - R}{T - P}' },
      { text: 'The bigger the temptation $T - R$ compared with the pain of punishment $T - P$, the more the future must weigh for cooperation to last.' }
    ]
  },
  formulas: [
    {
      name: 'Patience needed for cooperation (grim trigger)',
      expr: 'd = (T - R)/(T - P)', tex: '\\delta^* = \\frac{T - R}{T - P}',
      vars: {
        d: { name: 'minimum probability that the game continues', tex: '\\delta^*' },
        T: { name: 'temptation: payoff for cheating a cooperator', value: 5, min: 4, max: 9 },
        R: { name: 'reward: payoff when both cooperate', value: 3, min: 2, max: 4 },
        P: { name: 'punishment: payoff when both defect', value: 1, min: 0, max: 2 }
      },
      note: 'Payoffs per round, with $T > R > P$. The probability can also be read as a discount factor: how much next round\'s payoff is worth today.',
      practice: { unknowns: ['d'] },
      stories: { d: 'Cheating a cooperating rival pays {T}, mutual cooperation {R} and mutual defection {P} each round. How likely must another round be for cooperation to last under a grim trigger?' }
    },
    {
      name: 'Value of cooperating for ever',
      expr: 'V = R/(1 - d)', tex: 'V_C = \\frac{R}{1 - \\delta}',
      vars: {
        V: { name: 'total expected payoff from cooperating', tex: 'V_C' },
        R: { name: 'payoff each round when both cooperate', value: 3 },
        d: { name: 'probability of another round', value: 0.9, min: 0, max: 0.999, tex: '\\delta' }
      },
      note: 'The game lasts $1/(1 - \\delta)$ rounds on average — ten rounds when $\\delta = 0.9$.',
      practice: { unknowns: ['V'] },
      stories: { V: 'Cooperation pays {R} a round and the game continues each round with probability {d}. What is cooperating worth in total?' }
    },
    {
      name: 'Value of cheating once, then being punished',
      expr: 'V = T + d*P/(1 - d)', tex: 'V_D = T + \\frac{\\delta\\,P}{1 - \\delta}',
      vars: {
        V: { name: 'total expected payoff from cheating', tex: 'V_D' },
        T: { name: 'payoff for cheating a cooperator', value: 5, min: 4, max: 9 },
        P: { name: 'payoff each round when both defect', value: 1, min: 0, max: 2 },
        d: { name: 'probability of another round', value: 0.9, min: 0, max: 0.999, tex: '\\delta' }
      },
      practice: { unknowns: ['V'] },
      stories: { V: 'Cheating pays {T} once, after which both defect for {P} a round. With a probability {d} of each further round, what is cheating worth in total?' }
    }
  ],
  examples: [
    {
      title: 'Should the stations keep prices high?',
      q: 'Payoffs per month are $T = 5$, $R = 3$, $P = 1$ (thousand ¤). The stations expect to keep competing: each month there is a 90 % chance of another. Is keeping prices high stable under a grim trigger?',
      steps: [
        'Cooperating: $V_C = 3/(1 - 0.9) = 30$ thousand ¤.',
        'Cheating once: $V_D = 5 + 0.9 \\times 1/(1 - 0.9) = 5 + 9 = 14$ thousand ¤.',
        'Since 30 > 14, neither station wants to cut; the threshold is $\\delta^* = (5 - 3)/(5 - 1) = 0.5$.',
        'If one station plans to close in two months ($\\delta$ low), the temptation wins and a price war is likely.'
      ],
      a: 'Yes: cooperation is worth 30 against 14 for cheating; it holds as long as the chance of meeting again exceeds 50 %.'
    },
    {
      title: 'An empty threat',
      q: 'An incumbent tells a potential entrant: "Enter and I will start a price war." If the entrant stays out, the incumbent earns 6 and the entrant 0. If it enters, the incumbent can fight (incumbent 1, entrant −1) or share the market (incumbent 3, entrant 2). What happens?',
      steps: [
        'Reason backwards from the last move. After entry, the incumbent compares fighting (1) with sharing (3): it shares.',
        'The entrant, looking ahead, compares staying out (0) with entering and being accommodated (2): it enters.',
        'The threat is not credible. To make it credible the incumbent would need to change its own payoffs first — for instance by building so much capacity that fighting becomes its best reply.'
      ],
      a: 'The entrant enters and the incumbent shares the market: 3 for the incumbent, 2 for the entrant.'
    }
  ],
  quiz: [
    { q: 'In the one-off petrol-station game (3/3 both high, 5/0 if one cuts, 1/1 both cut), what does each station do?', choices: ['keep prices high', 'cut prices', 'flip a coin', 'wait for the other'], a: 1,
      why: 'Cutting is a dominant strategy: it pays more whatever the rival does. Both cut and earn 1 each.' },
    { q: 'A Nash equilibrium is always the best outcome for the players.', a: false,
      why: 'It is only stable: nobody gains by changing alone. In the prisoner\'s dilemma both would prefer the non-equilibrium outcome of cooperating.' },
    { q: 'With $T = 5$, $R = 4$ and $P = 1$, what is the smallest continuation probability δ at which cooperation lasts under a grim trigger?', answer: 0.25,
      why: '$(5 - 4)/(5 - 1) = 0.25$. A small temptation needs little patience.' },
    { q: 'What does tit for tat do?', choices: ['defects first to test the opponent', 'cooperates first, then copies the opponent\'s last move', 'always cooperates', 'defects at random'], a: 1,
      why: 'It is nice, retaliates at once, forgives at once and is easy to recognise — the qualities Axelrod found in successful strategies.' },
    { q: 'Which is a coordination game rather than a prisoner\'s dilemma?', choices: ['two firms deciding whether to cut prices', 'drivers choosing which side of the road to drive on', 'two countries deciding whether to overfish', 'two athletes deciding whether to dope'], a: 1,
      why: 'Drivers want to match each other; either convention is an equilibrium. In the other three, each player is tempted to defect whatever the other does.' }
  ],
  applications: [
    'Pricing and capacity decisions in markets with a few firms; spotting tacit collusion.',
    'Negotiation: salaries, contracts, buying a car or a home — alternatives, commitments and reputation.',
    'Auction design (radio spectrum, electricity, online advertising) and bidding.',
    'International agreements on climate, trade and arms, where each country is tempted to free-ride.'
  ],
  history: 'John von Neumann and Oskar Morgenstern founded the field with *Theory of Games and Economic Behavior* (1944). John Nash defined his equilibrium in 1950; the prisoner\'s dilemma was studied at the RAND Corporation the same year and named by Albert Tucker. Robert Axelrod\'s tournaments and his book *The Evolution of Cooperation* (1984) made tit for tat famous.',
  sim: 'mic-prisoners'
},

/* ================================================================ comparative advantage */
{
  id: 'comparative-advantage', parent: 'firms-competition', title: 'Trade and comparative advantage', level: 2,
  short: 'Everyone — person or country — gains by specialising in what they give up least to make and trading for the rest, even when someone else is better at everything. Trade raises total income, but not everyone\'s.',
  keywords: ['comparative advantage', 'absolute advantage', 'opportunity cost', 'specialisation', 'gains from trade', 'terms of trade', 'production possibility frontier', 'Ricardo', 'free trade', 'tariff', 'protectionism', 'globalisation', 'China shock'],
  prereq: ['opportunity-cost', 'supply-demand', 'math:linear-functions'],
  related: ['trade-balance', 'exchange-rates', 'market-structures', 'gdp'],
  body: `
A top lawyer may type faster than her assistant. Should she do her own typing? No: every hour she types is an hour of legal work not done, worth far more than the typing. For the assistant, an hour of typing gives up much less. Both are better off if each does what they give up least to do. That is **comparative advantage**, the deepest reason people, firms and countries trade.

### Absolute and comparative advantage
Ana and Ben each work one day. Ana can bake 30 loaves or sew 10 shirts, or any mix in between; Ben can bake 20 loaves or sew 4 shirts. Ana is better at both — she has the **absolute advantage** in each. Now compare [[opportunity-cost|opportunity costs]]:

| | Loaves a day | Shirts a day | A shirt costs | A loaf costs |
|---|---:|---:|---:|---:|
| Ana | 30 | 10 | 3 loaves | 1/3 shirt |
| Ben | 20 | 4 | 5 loaves | 1/4 shirt |

A shirt costs Ana 3 loaves and Ben 5, so Ana has the **comparative advantage** in shirts; a loaf costs Ben a quarter of a shirt against Ana's third, so Ben has it in bread. Because comparative advantage is about *relative* costs, everyone has one — even someone worse at everything.

### The gains from trade
Alone, spending half the day on each, Ana makes 15 loaves and 5 shirts and Ben 10 loaves and 2 shirts: 25 loaves and 7 shirts between them. Now Ben bakes all day (20 loaves) and Ana spends 70 % of her day sewing (7 shirts) and 30 % baking (9 loaves): 29 loaves and the same 7 shirts. Four loaves appear from nowhere — from each doing what costs them least.

To share them, they trade at a price between their two opportunity costs, say 4 loaves a shirt. Ana sells Ben 2 shirts for 8 loaves; she ends with 17 loaves and 5 shirts, he with 12 loaves and 2 shirts. Each has 2 loaves more than they could have made alone, with the same shirts. Any price between 3 and 5 loaves a shirt helps both; outside that range one of them does better alone.

> [!key] Trade does not need either side to be the best at anything. It needs only that their opportunity costs differ — and they almost always do.

### Countries
David Ricardo made the argument in 1817 with England, Portugal, cloth and wine: Portugal needed less labour for both, yet both gained when Portugal made wine and England cloth. Modern trade adds economies of scale, differences in land, capital and skills, and firms specialising in narrow steps of global supply chains; the core logic stands — trade lets a country consume beyond what it could produce alone.

### Who wins and who loses
Trade raises total income, but not everyone's. When a country starts importing what it once made, the workers and towns that made it can lose heavily and for a long time. US regions most exposed to Chinese imports after 2000 saw manufacturing jobs and wages fall for more than a decade, while consumers everywhere gained from cheaper goods. Economists broadly agree that the total gains exceed the losses; they disagree about how deep and lasting the losses are and about the right response — compensation and retraining, slower opening, or protection. Other arguments for limiting trade concern security (depending on a rival for vital supplies), fragile supply chains, and giving young industries time to grow.

A **tariff** is a tax on imports. Studies of the tariffs the United States imposed in 2018–2019 found that foreign exporters' prices barely fell, so the tariffs were paid almost entirely by American firms and consumers — a reminder from the [[elasticity]] page that who legally pays a tax says little about who bears it.

### What it means for you
The same logic applies to your own time. Paying someone to fix the boiler or do your accounts can cost less than the hours you would spend, once you count what those hours are worth — and the time is then free for what you do at the lowest opportunity cost. In a household, even the partner who is "better at everything" gains by sharing tasks according to comparative advantage.
`,
  ideas: [
    'Absolute advantage is being able to make more; comparative advantage is giving up less of something else to make it.',
    'Everyone has a comparative advantage in something, even if they are worse at everything.',
    'Specialising by comparative advantage and trading raises total output; trade at a price between the two opportunity costs lets both sides gain.',
    'Trade raises total income but creates losers as well as winners; how to help them is a central policy debate.',
    'Tariffs are taxes on imports, largely paid by buyers in the importing country.'
  ],
  pitfalls: [
    'A country that is better at everything has nothing to gain from trade — It gains by specialising where its advantage is greatest and importing the rest, just as the lawyer gains by not typing.',
    'In trade, one side\'s gain is the other\'s loss — Voluntary trade at a price between the two opportunity costs leaves both better off; the gains come from specialisation, not from the other side.',
    'Free trade makes everyone better off — It raises total income, but particular workers, firms and regions can lose badly; the gains are spread thinly and the losses concentrated.'
  ],
  formulas: [
    {
      name: 'Opportunity cost of a good',
      expr: 'OC = L/S', tex: '\\mathrm{OC} = \\frac{L}{S}',
      vars: {
        OC: { name: 'loaves given up per shirt made', tex: '\\mathrm{OC}' },
        L: { name: 'loaves you could make in a day', value: 30, int: true },
        S: { name: 'shirts you could make in a day', value: 10, int: true }
      },
      note: 'For a straight-line frontier. The person with the lower opportunity cost of shirts has the comparative advantage in shirts; the other has it in bread.',
      practice: { unknowns: ['OC'] },
      stories: { OC: 'In a day you can make {L} loaves or {S} shirts. How many loaves does one shirt cost you?' }
    },
    {
      name: 'Production possibility frontier (straight line)',
      expr: 'L = Lmax*(1 - S/Smax)', tex: 'L = L_{\\text{max}}\\left(1 - \\frac{S}{S_{\\text{max}}}\\right)',
      vars: {
        L: { name: 'loaves you can still make' },
        Lmax: { name: 'loaves if you only bake', value: 30, int: true, tex: 'L_{\\text{max}}' },
        S: { name: 'shirts you make', value: 7 },
        Smax: { name: 'shirts if you only sew', value: 10, int: true, tex: 'S_{\\text{max}}' }
      },
      practice: { unknowns: ['L', 'S'] },
      stories: {
        L: 'You can make {Lmax} loaves or {Smax} shirts a day. If you make {S} shirts, how many loaves can you still bake?',
        S: 'You can make {Lmax} loaves or {Smax} shirts a day. How many shirts can you sew if you also bake {L} loaves?'
      }
    },
    {
      name: 'Gain from trading instead of making it yourself',
      expr: 'G = (p - OC)*X', tex: 'G = (p - \\mathrm{OC})\\,X',
      vars: {
        G: { name: 'loaves gained (for the seller of shirts)', signed: true },
        p: { name: 'price of a shirt, in loaves', value: 4 },
        OC: { name: 'seller\'s opportunity cost of a shirt, in loaves', value: 3, tex: '\\mathrm{OC}' },
        X: { name: 'shirts sold', value: 2, int: true, min: 1, max: 10 }
      },
      note: 'For the buyer the gain is $(\\mathrm{OC}_{\\text{buyer}} - p)\\,X$. Both gain when $p$ lies between the two opportunity costs.',
      practice: { unknowns: ['G'] },
      stories: { G: 'A shirt costs Ana {OC} loaves to make. She sells {X} shirts to Ben at {p} loaves each. How many loaves does she gain compared with baking them herself?' }
    }
  ],
  examples: [
    {
      title: 'Ana and Ben specialise',
      q: 'Ana can make 30 loaves or 10 shirts a day, Ben 20 loaves or 4 shirts. Show that specialising and trading 2 shirts for 8 loaves leaves both better off than working alone with half the day on each good.',
      steps: [
        'Alone: Ana 15 loaves + 5 shirts, Ben 10 loaves + 2 shirts.',
        'Opportunity cost of a shirt: Ana 3 loaves, Ben 5. Ana should sew, Ben bake.',
        'Ben bakes 20 loaves. Ana sews for 70 % of the day (7 shirts) and bakes for 30 % (9 loaves).',
        'Trade 2 shirts for 8 loaves (4 loaves a shirt, between 3 and 5). Ana: $9 + 8 = 17$ loaves and $7 - 2 = 5$ shirts. Ben: $20 - 8 = 12$ loaves and 2 shirts.'
      ],
      a: 'Each ends with 2 more loaves and the same number of shirts as working alone.'
    },
    {
      title: 'Ricardo\'s cloth and wine',
      q: 'In Ricardo\'s example, a unit of cloth takes 100 workers a year in England and 90 in Portugal; a unit of wine takes 120 in England and 80 in Portugal. Who should make what?',
      steps: [
        'Portugal needs fewer workers for both goods: absolute advantage in both.',
        'Opportunity cost of wine, in cloth: England $120/100 = 1.2$, Portugal $80/90 = 0.89$. Portugal\'s is lower.',
        'Opportunity cost of cloth, in wine: England $100/120 = 0.83$, Portugal $90/80 = 1.125$. England\'s is lower.',
        'So Portugal makes wine and England cloth, and they trade at a price between the two ratios.'
      ],
      a: 'Portugal specialises in wine, England in cloth — although Portugal is better at both.'
    }
  ],
  quiz: [
    { q: 'Ana can make 30 loaves or 10 shirts a day; Ben 20 loaves or 4 shirts. Who should sew the shirts?', choices: ['Ana', 'Ben', 'both equally', 'neither: shirts should be imported'], a: 0,
      why: 'A shirt costs Ana 3 loaves and Ben 5. Ana has the lower opportunity cost, the comparative advantage in shirts.' },
    { q: 'A country that is less productive at everything cannot gain from trade.', a: false,
      why: 'Its opportunity costs still differ from its partners\'; specialising where they are lowest and trading makes it better off, just as Ben gains from trading with Ana.' },
    { q: 'Kim can write 6 reports or design 3 posters in a day. How many reports does one poster cost her?', answer: 2,
      why: '6/3 = 2 reports per poster: that is her opportunity cost of a poster.' },
    { q: 'A shirt costs Ana 3 loaves and Ben 5. At which prices does trading shirts for bread help both?', choices: ['below 3 loaves a shirt', 'between 3 and 5 loaves a shirt', 'above 5 loaves a shirt', 'only at exactly 4'], a: 1,
      why: 'Ana gains if she gets more than her cost of 3 loaves; Ben gains if he pays less than his cost of 5.' },
    { q: 'Studies of the tariffs the United States imposed in 2018–2019 found they were paid mostly by…', choices: ['foreign exporters, through lower prices', 'American importers and consumers', 'nobody, since prices did not change', 'foreign governments'], a: 1,
      why: 'Import prices before tariff barely fell, so the tax was passed almost fully to buyers in the United States.' }
  ],
  applications: [
    'Careers and businesses: focusing on what you do at the lowest opportunity cost, and outsourcing the rest.',
    'Households dividing tasks, and teams dividing work.',
    'Trade policy: tariffs, trade agreements, and help for workers and regions hurt by imports.',
    'Reading the news on supply chains, reshoring and trade wars with the costs and gains in view.'
  ],
  history: 'Adam Smith argued for specialisation and trade in 1776 using absolute advantage. Robert Torrens and David Ricardo (in *On the Principles of Political Economy and Taxation*, 1817) showed that comparative advantage is enough. Paul Samuelson later held it up as a rare idea in the social sciences that is at once true and surprising.',
  sim: 'mic-trade'
}

);
