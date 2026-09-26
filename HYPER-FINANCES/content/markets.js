/* HYPER-FINANCES · content/markets.js — microeconomics I: markets and prices.
 * Supply and demand, equilibrium, elasticity, surplus, price controls and marginal thinking.
 * One worked market runs through the pages: a town's weekly strawberry market with
 * demand Qd = 1200 − 50P and supply Qs = −300 + 100P (kilograms, ¤ per kilogram),
 * which settles at ¤10 and 700 kg. Simulations: sims/micro.js. */
Hyper.add(

/* ================================================================ supply and demand */
{
  id: 'supply-demand', parent: 'markets', title: 'Supply and demand', level: 1,
  short: 'Buyers want less of a thing as its price rises; sellers offer more. The price that balances the two is set by neither side alone — and anything that shifts what buyers want or what sellers can offer moves it.',
  keywords: ['supply', 'demand', 'law of demand', 'demand curve', 'supply curve', 'price', 'quantity demanded', 'quantity supplied', 'shift', 'substitutes', 'complements', 'market'],
  prereq: ['opportunity-cost', 'what-is-money', 'math:linear-functions'],
  related: ['market-equilibrium', 'elasticity', 'inflation-cpi', 'exchange-rates', 'bid-ask-liquidity'],
  body: `
In June a punnet of strawberries at the Saturday market costs little; in January the same fruit, flown in from the other side of the world, can cost several times as much. Nobody decreed it. The price comes out of millions of separate choices — how much people want strawberries, and what it takes growers to bring them — and **supply and demand** is the model that shows how.

### Demand: the buyers
At a lower price people buy more. Some switch from other fruit (the *substitution* effect), the same budget stretches further (the *income* effect), and people who found strawberries too dear now join in. This is the **law of demand**: the quantity demanded falls as the price rises, everything else held equal. The simplest version is a straight line,

$$Q_d = a - b\\,P$$

For a town's weekly strawberry market take $Q_d = 1200 - 50P$, in kilograms with $P$ in ¤ per kilogram: at ¤10 buyers want 700 kg, at ¤12 only 600 kg, and at ¤24 nobody buys at all.

### Supply: the sellers
At a higher price growers bring more: it becomes worth picking the far rows, paying for overtime, trucking fruit from further away. Each grower has a price below which the trouble is not worth it, so the quantity supplied rises with the price:

$$Q_s = c + d\\,P$$

Here $Q_s = -300 + 100P$: nothing is offered below ¤3, 700 kg at ¤10, 900 kg at ¤12.

| Price per kg | Buyers want | Growers bring |
|---:|---:|---:|
| ¤4 | 1,000 kg | 100 kg |
| ¤8 | 800 kg | 500 kg |
| ¤10 | 700 kg | 700 kg |
| ¤12 | 600 kg | 900 kg |
| ¤16 | 400 kg | 1,300 kg |

Only at ¤10 do the two plans agree. That is the [[market-equilibrium|equilibrium]], and the next page explains why the price is pulled towards it.

### Moving along a curve, or moving the curve
A change in the good's **own price** moves buyers and sellers *along* their curves. Everything else *shifts* the curves:

- **Demand** shifts with incomes, tastes and news (a report that strawberries are good for you), the prices of **substitutes** (raspberries) and **complements** (cream), expectations of future prices, and the number of buyers.
- **Supply** shifts with the cost of inputs (wages, fuel, fertiliser), technology, the weather, the number of growers, and taxes or subsidies.

If a health report makes buyers want 150 kg more at every price, the market settles at ¤11 and 800 kg. A rainy season that cuts supply by 150 kg at every price also gives ¤11 — but only 650 kg. The price alone cannot tell you which curve moved; the price and the quantity together can.

> [!key] "Demand rose" means the whole curve moved. "The quantity demanded rose" means the price fell and buyers moved along the same curve.

### A sideways picture
Quantity depends on price, so you might expect price on the horizontal axis. Economists put it on the vertical axis out of a habit set by Alfred Marshall's diagrams in 1890. Once you know the chart is "sideways", it reads easily: move up for a higher price, right for more kilograms.

### What it means for you
As a buyer it explains why hotel rooms cost more in festival week and flights in school holidays: demand jumps and supply cannot. As a worker or seller, your price depends on how many others offer the same thing and how much buyers want it — scarce skills in demand earn more. As a voter it gives a first question to ask about any policy: does it change demand, supply, or only the price tag? A subsidy to buyers of something whose supply cannot grow quickly, such as housing in a crowded city, can end up largely in a higher price.
`,
  ideas: [
    'Demand slopes down: at a higher price buyers want less. Supply slopes up: at a higher price sellers offer more.',
    'The market price settles where the quantity buyers want equals the quantity sellers bring.',
    'A change in the good\'s own price is a movement along a curve; incomes, tastes, input costs, technology and the weather shift the curves.',
    'Price and quantity together tell you which curve moved: both up for more demand, price up and quantity down for less supply.'
  ],
  pitfalls: [
    'A higher price lowers demand, which lowers the price, which raises demand… — A price change moves buyers along one demand curve; it does not shift the curve. Only things other than the price shift demand.',
    'Prices are simply set by greedy sellers — Every seller would like a higher price; what stops them is buyers walking away and rivals undercutting. Where competition is weak, sellers do have more power — see [[market-structures]].',
    'A rising price proves demand increased — A fall in supply raises the price too. The quantity tells them apart: it rises with a demand increase and falls with a supply cut.'
  ],
  formulas: [
    {
      name: 'A straight-line demand curve',
      expr: 'Qd = a - b*P', tex: 'Q_d = a - b\\,P',
      vars: {
        Qd: { name: 'quantity demanded (units a period)', tex: 'Q_d' },
        a: { name: 'quantity buyers would take at a price of zero', value: 1200 },
        b: { name: 'units fewer bought for each ¤1 of price', value: 50 },
        P: { name: 'price', q: 'money', unit: '$', value: 10 }
      },
      note: 'The defaults are the strawberry market (kilograms a week). Solve for $P$ to find the price at which buyers want a given quantity — the inverse demand curve.',
      practice: { unknowns: ['Qd', 'P'] },
      stories: {
        Qd: 'Buyers would take {a} kg of strawberries a week if they were free, and {b} kg less for every ¤1 of price. How many kilograms do they want at {P} per kg?',
        P: 'Weekly demand is {a} kg at a price of zero, falling by {b} kg for each ¤1. At what price do buyers want exactly {Qd} kg?'
      }
    },
    {
      name: 'A straight-line supply curve',
      expr: 'Qs = c + d*P', tex: 'Q_s = c + d\\,P',
      vars: {
        Qs: { name: 'quantity supplied (units a period)', tex: 'Q_s' },
        c: { name: 'intercept (negative: nothing is offered until the price covers costs)', value: -300, signed: true, min: -1000, max: -20 },
        d: { name: 'extra units offered for each ¤1 of price', value: 100 },
        P: { name: 'price', q: 'money', unit: '$', value: 10 }
      },
      note: 'The lowest price at which anything is offered is $-c/d$ — ¤3 for the strawberry growers.',
      practice: { unknowns: ['Qs', 'P'] },
      stories: {
        Qs: 'Growers\' supply is Qs = c + d·P with c = {c} and d = {d} kg per ¤1. How many kilograms do they bring at {P}?',
        P: 'With supply Qs = c + d·P, c = {c} and d = {d} kg per ¤1, what price brings {Qs} kg to market?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading the two curves',
      q: 'With demand $Q_d = 1200 - 50P$ and supply $Q_s = -300 + 100P$, what happens at a price of ¤8, and at ¤12?',
      steps: [
        'At ¤8: $Q_d = 1200 - 400 = 800$ kg and $Q_s = -300 + 800 = 500$ kg. Buyers want 300 kg more than growers bring: a **shortage**.',
        'At ¤12: $Q_d = 1200 - 600 = 600$ kg and $Q_s = -300 + 1200 = 900$ kg. Growers bring 300 kg more than buyers take: a **surplus**.',
        'The shortage tends to push the price up and the surplus to push it down; only at ¤10 are both 700 kg.'
      ],
      a: 'A shortage of 300 kg at ¤8, a surplus of 300 kg at ¤12.'
    },
    {
      title: 'A health report',
      q: 'News that strawberries are unusually healthy makes buyers want 150 kg more at every price. Find the new price and quantity.',
      steps: [
        'New demand: $Q_d = 1350 - 50P$. Supply is unchanged.',
        'Set them equal: $1350 - 50P = -300 + 100P$, so $150P = 1650$ and $P = ¤11$.',
        'Quantity: $1350 - 550 = 800$ kg. Both price and quantity rose — the signature of a demand increase.'
      ],
      a: '¤11 a kilogram and 800 kg a week (from ¤10 and 700 kg).'
    }
  ],
  quiz: [
    { q: 'A frost destroys part of the orange harvest. What happens in the market for orange juice?', choices: ['demand falls: price and quantity fall', 'supply falls: price rises, quantity falls', 'supply rises: price falls, quantity rises', 'nothing until shops change their prices'], a: 1,
      why: 'The frost raises the cost of producing juice, shifting supply to the left. Moving up along the demand curve, the price rises and less is bought.' },
    { q: '"Strawberries got dearer, so people buy fewer" describes a fall in demand.', a: false,
      why: 'It describes a movement along the demand curve caused by the price. A fall in demand would mean buyers want less at every price — because of tastes, income or news.' },
    { q: 'Demand is $Q_d = 1200 - 50P$. How many kilograms do buyers want at ¤14?', answer: 500, unit: 'kg',
      why: '$1200 - 50 \\times 14 = 1200 - 700 = 500$ kg.' },
    { q: 'Printers become much cheaper. What happens to the demand for ink cartridges?', choices: ['it falls: ink and printers are substitutes', 'it rises: ink and printers are complements', 'it is unchanged: only the price of ink matters', 'the supply of ink falls'], a: 1,
      why: 'Printers and ink are used together. Cheaper printers mean more printers in use, so the demand curve for ink shifts right.' },
    { q: 'Supply is $Q_s = -300 + 100P$. Below what price (in ¤) do growers offer nothing?', answer: 3, unit: '$',
      why: 'Supply is zero when $100P = 300$, at ¤3 a kilogram: below that no grower covers the cost of picking and selling.' }
  ],
  applications: [
    'Why seasonal food, holiday flights and festival-week hotels cost more at the peak.',
    'Reading the news: telling a demand shock (a boom, a fashion) from a supply shock (a drought, a war, a factory fire).',
    'Setting a price for your own work or products: what buyers will pay depends on what else they can buy.'
  ],
  history: 'That prices balance what buyers want against what sellers bring is an old idea, found in Adam Smith\'s *Wealth of Nations* (1776) and earlier. Antoine Augustin Cournot wrote demand as a mathematical function in 1838, and Alfred Marshall\'s *Principles of Economics* (1890) made the two crossing curves the standard picture — with price, unusually, on the vertical axis.',
  sim: 'mic-supply-demand'
},

/* ================================================================ equilibrium */
{
  id: 'market-equilibrium', parent: 'markets', title: 'Market equilibrium', level: 1,
  short: 'The price at which the quantity buyers want equals the quantity sellers offer. Shortages push the price up towards it and surpluses push it down; when demand or supply shifts, the equilibrium moves.',
  keywords: ['equilibrium', 'market clearing', 'shortage', 'surplus', 'excess demand', 'excess supply', 'comparative statics', 'price adjustment', 'shift'],
  prereq: ['supply-demand', 'math:systems-of-equations'],
  related: ['elasticity', 'consumer-producer-surplus', 'price-controls', 'bid-ask-liquidity', 'bubbles'],
  body: `
At ¤12 a kilogram, growers bring 900 kg of strawberries to the market and buyers take only 600. By noon 300 kg are left and softening; sellers mark them down. At ¤8 the opposite happens: 800 kg are wanted and 500 arrive, the stalls are empty by nine, and next week some sellers quietly charge more. Only at ¤10 do the plans of buyers and growers match — 700 kg wanted, 700 kg brought — and nobody has a reason to change the price. That is the **market equilibrium**.

### Finding it
Set the quantity demanded equal to the quantity supplied and solve. Two straight lines cross at one point:

$$a - bP = c + dP \\quad\\Rightarrow\\quad P^* = \\frac{a - c}{b + d}, \\qquad Q^* = \\frac{a\\,d + b\\,c}{b + d}$$

With $a = 1200$, $b = 50$, $c = -300$ and $d = 100$: $P^* = 1500/150 = ¤10$ and $Q^* = 1200 - 500 = 700$ kg.

### Shortages and surpluses push the price
Below equilibrium there is **excess demand**, a shortage: queues, empty shelves, sellers discovering they can charge more. Above it there is **excess supply**, a surplus: unsold stock and discounts. Both gaps push the price towards $P^*$. How fast depends on the market. A share price on an exchange adjusts in fractions of a second; a rent perhaps once a year; wages sometimes only over years — which is why labour and housing markets can stay out of balance for a long time.

### When the curves shift
| What happens | Price | Quantity |
|---|---|---|
| Demand rises | up | up |
| Demand falls | down | down |
| Supply rises | down | up |
| Supply falls | up | down |

When both shift at once, one of the two results is ambiguous. A good harvest (supply up 150 kg at every price) in the same week as a health report (demand up 150 kg) leaves the price at ¤10 but raises the quantity to 850 kg. The health report with a bad harvest instead gives ¤12 and 750 kg.

How far the price moves depends on how responsive both sides are. A shift of demand by $\\Delta a$ kilograms at every price moves the price by

$$\\Delta P = \\frac{\\Delta a}{b + d}$$

When supply can hardly respond (small $d$), a rise in demand shows up almost entirely as a higher price — housing in a city where little can be built, tickets for a sold-out final, a rare collectable. When supply is flexible, the same rise mostly increases the quantity. This is [[elasticity]] at work.

> [!note] An equilibrium is a state in which plans are consistent — not a verdict that the outcome is fair. A market can be in equilibrium at a price many people cannot afford; and rules, market power and costs that fall on outsiders ([[externalities]]) can hold it away from the balance described here.

### Markets that compute the price
Most shops post a price and adjust it by trial and error. Some markets compute the equilibrium directly. A stock exchange's opening auction gathers buy and sell orders and picks the one price at which the most shares change hands — literally the crossing of a demand and a supply schedule (see [[bid-ask-liquidity]]). Wholesale electricity markets and many government bond auctions set prices in a similar way.

### What it means for you
A persistent queue, a waiting list or a pile of discounted stock is a sign that a price is not at its equilibrium — and a hint about which way it will move. And when you read that a price "must" fall or rise, ask which curve is supposed to shift, and how responsive the other side is.
`,
  ideas: [
    'At the equilibrium price the quantity demanded equals the quantity supplied, so nobody has a reason to change the price.',
    'A shortage (price too low) pushes the price up; a surplus (price too high) pushes it down.',
    'A demand shift moves price and quantity the same way; a supply shift moves them in opposite directions.',
    'The less responsive the other side of the market, the more a shift shows up in the price rather than the quantity.'
  ],
  pitfalls: [
    'In equilibrium everyone who wants the good gets it — Everyone willing to pay the equilibrium price gets it. Those who value it less, or cannot afford it, do not.',
    'If demand and supply both rise, the price must rise — The quantity certainly rises, but the price can go either way, depending on which shift is larger.',
    'Markets are always in equilibrium — Many prices adjust slowly (wages, rents, posted prices), and rules can hold them away from it. Equilibrium is where a market is heading, not always where it is.'
  ],
  derivation: {
    title: 'Solve for the equilibrium',
    steps: [
      { text: 'Demand and supply are straight lines in the price:', tex: 'Q_d = a - bP, \\qquad Q_s = c + dP' },
      { text: 'In equilibrium the two quantities are equal:', tex: 'a - bP = c + dP' },
      { text: 'Collect the price terms on one side:', tex: 'a - c = (b + d)\\,P \\quad\\Rightarrow\\quad P^* = \\frac{a - c}{b + d}' },
      { text: 'Put the price back into either curve:', tex: 'Q^* = a - b\\,\\frac{a - c}{b + d} = \\frac{a\\,d + b\\,c}{b + d}' },
      { text: 'A shift of demand by $\\Delta a$ changes the price by $\\Delta a/(b + d)$: the combined responsiveness of both sides divides the shock.' }
    ]
  },
  formulas: [
    {
      name: 'Equilibrium price',
      expr: 'P = (a - c)/(b + d)', tex: 'P^* = \\frac{a - c}{b + d}',
      vars: {
        P: { name: 'equilibrium price', q: 'money', unit: '$', tex: 'P^*' },
        a: { name: 'demand intercept (quantity wanted at a price of zero)', value: 1200 },
        b: { name: 'units fewer demanded per ¤1 of price', value: 50 },
        c: { name: 'supply intercept (usually negative)', value: -300, signed: true, min: -1000, max: -20 },
        d: { name: 'units more supplied per ¤1 of price', value: 100 }
      },
      note: 'For $Q_d = a - bP$ and $Q_s = c + dP$. The defaults are the strawberry market, which settles at ¤10.',
      practice: { unknowns: ['P', 'a'] },
      stories: {
        P: 'Demand is Qd = {a} − {b}·P and supply Qs = {c} + {d}·P. Where does the price settle?',
        a: 'Supply is Qs = {c} + {d}·P and demand falls by {b} units per ¤1. How large must the demand intercept be for the market to clear at {P}?'
      }
    },
    {
      name: 'Equilibrium quantity',
      expr: 'Q = (a*d + b*c)/(b + d)', tex: 'Q^* = \\frac{a\\,d + b\\,c}{b + d}',
      vars: {
        Q: { name: 'quantity traded in equilibrium', tex: 'Q^*' },
        a: { name: 'demand intercept', value: 1200 },
        b: { name: 'units fewer demanded per ¤1', value: 50 },
        c: { name: 'supply intercept', value: -300, signed: true, min: -1000, max: -20 },
        d: { name: 'units more supplied per ¤1', value: 100 }
      },
      practice: { unknowns: ['Q'] },
      stories: { Q: 'Demand is Qd = {a} − {b}·P and supply Qs = {c} + {d}·P. How many units are traded in equilibrium?' }
    },
    {
      name: 'Shortage (or surplus) at a given price',
      expr: 'X = (a - b*P) - (c + d*P)', tex: 'X = (a - bP) - (c + dP)',
      vars: {
        X: { name: 'excess demand (positive: shortage; negative: surplus)', signed: true },
        a: { name: 'demand intercept', value: 1200 },
        b: { name: 'units fewer demanded per ¤1', value: 50 },
        c: { name: 'supply intercept', value: -300, signed: true, min: -1000, max: -20 },
        d: { name: 'units more supplied per ¤1', value: 100 },
        P: { name: 'price', q: 'money', unit: '$', value: 8 }
      },
      note: 'Solving $X = 0$ for $P$ gives the equilibrium price again.',
      practice: { unknowns: ['X', 'P'] },
      stories: {
        X: 'With demand {a} − {b}·P and supply {c} + {d}·P, how large is the shortage (negative: surplus) at {P}?',
        P: 'With demand {a} − {b}·P and supply {c} + {d}·P, at what price is the shortage exactly {X} units?'
      }
    }
  ],
  examples: [
    {
      title: 'Where does the market settle?',
      q: 'The weekly demand for bicycle repairs in a town is $Q_d = 900 - 20P$ and the supply $Q_s = -300 + 40P$ (repairs, $P$ in ¤). Find the equilibrium, and the gap at ¤15.',
      steps: [
        'Set $900 - 20P = -300 + 40P$: $60P = 1200$, so $P^* = ¤20$.',
        '$Q^* = 900 - 20 \\times 20 = 500$ repairs a week.',
        'At ¤15: $Q_d = 600$ and $Q_s = 300$ — a shortage of 300 repairs. Customers wait for days, and repairers can raise their prices.'
      ],
      a: '¤20 a repair and 500 repairs a week; at ¤15 there is a shortage of 300.'
    },
    {
      title: 'Two shocks at once',
      q: 'In the strawberry market ($b = 50$, $d = 100$), demand rises by 150 kg at every price. What happens if, in the same week, supply rises by 150 kg? And if it falls by 150 kg?',
      steps: [
        'Demand alone: $\\Delta P = 150/150 = ¤1$, giving ¤11 and 800 kg.',
        'With supply also up: $a = 1350$, $c = -150$, so $P^* = 1500/150 = ¤10$ and $Q^* = 1350 - 500 = 850$ kg. The price effects cancel; the quantity effects add.',
        'With supply down instead: $c = -450$, so $P^* = 1800/150 = ¤12$ and $Q^* = 1350 - 600 = 750$ kg. Now the price effects add and the quantity effects partly cancel.'
      ],
      a: 'Both up: ¤10 and 850 kg. Demand up, supply down: ¤12 and 750 kg.'
    }
  ],
  quiz: [
    { q: 'At a price above the equilibrium…', choices: ['there is a shortage and the price tends to rise', 'there is a surplus and the price tends to fall', 'buyers want more than sellers offer', 'nothing happens: any price can last'], a: 1,
      why: 'Above equilibrium sellers offer more than buyers want. Unsold stock builds up and sellers cut prices.' },
    { q: 'Demand and supply both increase. Which of these is certain?', choices: ['the price rises', 'the price falls', 'the quantity traded rises', 'nothing is certain'], a: 2,
      why: 'Both shifts raise the quantity. Their effects on the price pull in opposite directions, so the price depends on which shift is larger.' },
    { q: 'Demand is $Q_d = 900 - 30P$ and supply $Q_s = 60P$. What is the equilibrium price, in ¤?', answer: 10, unit: '$',
      why: '$900 - 30P = 60P$ gives $90P = 900$, so $P = ¤10$ (and 600 units are traded).' },
    { q: 'In the strawberry market ($b = 50$ kg and $d = 100$ kg per ¤1), demand rises by 300 kg at every price. By how many ¤ does the price rise?', answer: 2, unit: '$',
      why: '$\\Delta P = \\Delta a/(b + d) = 300/150 = ¤2$: from ¤10 to ¤12, with 900 kg traded.' },
    { q: 'At the equilibrium price, everyone who would like the good gets it.', a: false,
      why: 'Everyone willing to pay the equilibrium price gets it. People who value the good less than the price — or cannot afford it — go without.' }
  ],
  applications: [
    'Reading queues and waiting lists (a price below equilibrium) and piles of discounted stock (a price above it).',
    'Predicting the effect of news on a price: a frost, a new factory, a tax, a fashion, a pandemic.',
    'Opening auctions on stock exchanges, wholesale electricity markets and bond auctions compute the equilibrium price directly.'
  ],
  sim: { id: 'mic-supply-demand', params: { manual: true } }
},

/* ================================================================ elasticity */
{
  id: 'elasticity', parent: 'markets', title: 'Elasticity', level: 2,
  short: 'How strongly the quantity bought (or sold) responds to a change in price or income, in percentages. It decides whether a price rise raises or lowers revenue, and who really pays a tax.',
  keywords: ['elasticity', 'price elasticity of demand', 'elastic', 'inelastic', 'unit elastic', 'midpoint method', 'arc elasticity', 'income elasticity', 'cross-price elasticity', 'elasticity of supply', 'total revenue', 'tax incidence', 'who pays a tax'],
  prereq: ['supply-demand', 'market-equilibrium', 'math:percentages', 'math:derivative'],
  related: ['consumer-producer-surplus', 'price-controls', 'market-structures', 'inflation-cpi'],
  body: `
If the price of salt doubled tomorrow, you would grumble and keep buying salt: there is no real substitute and it costs next to nothing a year. If one brand of cola raised its price by a fifth, many shoppers would reach for the brand beside it. **Elasticity** measures that difference: how strongly the quantity bought responds to the price.

### The definition
The **price elasticity of demand** is the percentage change in quantity divided by the percentage change in price:

$$E = \\frac{\\Delta Q / Q}{\\Delta P / P}$$

Because it compares percentages it has no units — the same in kilograms or tonnes, euros or yen. It is negative for almost every good; people often quote only its size, so "an elasticity of 0.5" usually means −0.5.

A café raises its espresso from ¤2.00 to ¤2.50 and daily sales fall from 400 to 360 cups. With the **midpoint method** — each change divided by the average of the start and end values, so the answer is the same in either direction — quantity fell 10.5 %, the price rose 22.2 %, and

$$E = \\frac{-40/380}{0.50/2.25} = \\frac{-0.105}{0.222} \\approx -0.47$$

| Size of the elasticity | Demand is called | A 10 % price rise… | Revenue after a price rise |
|---|---|---|---|
| 0 | perfectly inelastic | changes nothing bought | up 10 % |
| between 0 and 1 | inelastic | cuts sales by less than 10 % | rises |
| exactly 1 | unit elastic | cuts sales by about 10 % | about unchanged |
| above 1 | elastic | cuts sales by more than 10 % | falls |

### Elasticity and revenue
Revenue is price times quantity. When demand is inelastic the higher price wins and revenue rises — the café's takings went from ¤800 to ¤900 a day. When demand is elastic the lost sales win and a price rise loses money. That is why a firm with loyal customers can raise prices and a shop with a rival across the road cannot.

### Along a straight line, elasticity changes
A straight demand curve has a constant slope but not a constant elasticity. For $Q = a - bP$ the elasticity at a point is

$$E = -\\frac{b\\,P}{Q}$$

In the strawberry market, $Q = 1200 - 50P$: at ¤4 it is −0.2, at ¤10 −0.71, at ¤12 exactly −1, at ¤18 −3. The upper half of any straight demand line is elastic and the lower half inelastic, and revenue peaks at the midpoint: ¤12 × 600 kg = ¤7,200 a week.

### What makes demand elastic
- **Substitutes**: the more and the closer, the more elastic. One brand is very elastic; food as a whole is very inelastic.
- **Necessity**: medicines, heating and staple foods are inelastic; holidays and restaurant meals less so.
- **Share of the budget**: price changes on big items get noticed.
- **Time**: after a fuel price rise people first drive a little less; over years they choose thriftier cars and homes nearer work. Studies of fuel typically find short-run elasticities of roughly −0.05 to −0.3, and long-run values two to three times larger.

The **income elasticity** is positive for most goods, above 1 for luxuries, and negative for *inferior* goods that people buy less of as they grow richer. The **cross-price elasticity** is positive between substitutes and negative between complements. The **elasticity of supply** is low for housing and fresh produce in the short run and higher once there is time to build or plant.

### Who really pays a tax
A tax drives a wedge between what buyers pay and what sellers keep. Who carries it does not depend on who hands the money to the government: the **less elastic side carries more**. The buyers' share of a small tax is

$$s = \\frac{E_s}{E_s - E_d}$$

In the strawberry market at equilibrium $E_d = -0.71$ and $E_s = 1.43$, so buyers carry two-thirds. Taxes on tobacco and fuel fall largely on consumers because their demand is inelastic, and many studies find that workers bear much of a payroll tax through lower wages, whichever side legally pays it.

> [!tip] When you cannot easily switch, wait or do without, you are the inelastic side of a market and you carry most of any cost increase. Contracts, subscriptions and loyalty schemes are often designed to make customers less elastic; having alternatives is worth money.
`,
  ideas: [
    'Elasticity is the percentage change in quantity divided by the percentage change in price; it has no units.',
    'When demand is inelastic (size below 1), a price rise raises revenue; when it is elastic, a price rise lowers it.',
    'Along a straight demand line elasticity runs from 0 at the quantity axis to minus infinity at the price axis; revenue peaks where it is −1.',
    'Demand is more elastic with close substitutes, for luxuries, for big budget items and over longer periods.',
    'The less elastic side of a market carries more of a tax, whoever legally pays it.'
  ],
  pitfalls: [
    'Elasticity is the slope of the demand curve — The slope is in units per ¤; elasticity compares percentages. A straight line has one slope but every elasticity from 0 to minus infinity.',
    'A price rise always raises revenue — Only when demand is inelastic. Where it is elastic, lost sales outweigh the higher price.',
    'The side that pays a tax to the government bears it — Prices adjust. Buyers and sellers share the burden according to their elasticities, whoever writes the cheque.'
  ],
  formulas: [
    {
      name: 'Price elasticity of demand (midpoint method)',
      expr: 'E = ((Q2 - Q1)/((Q1 + Q2)/2))/((P2 - P1)/((P1 + P2)/2))',
      tex: 'E = \\frac{(Q_2 - Q_1)\\,/\\,\\tfrac{1}{2}(Q_1 + Q_2)}{(P_2 - P_1)\\,/\\,\\tfrac{1}{2}(P_1 + P_2)}',
      vars: {
        E: { name: 'price elasticity of demand', signed: true },
        Q1: { name: 'quantity before', value: 400, tex: 'Q_1' },
        Q2: { name: 'quantity after', value: 360, tex: 'Q_2' },
        P1: { name: 'price before', q: 'money', unit: '$', value: 2, tex: 'P_1' },
        P2: { name: 'price after', q: 'money', unit: '$', value: 2.5, tex: 'P_2' }
      },
      note: 'The defaults are the café: an espresso from ¤2.00 to ¤2.50, sales from 400 to 360 cups a day. Solve for $Q_2$ to predict sales after a price change from a known elasticity. With supply data (both changes in the same direction) the same formula gives the elasticity of supply.',
      practice: { unknowns: ['E'] },
      stories: {
        E: 'A price changes from {P1} to {P2} and the quantity sold goes from {Q1} to {Q2}. What is the midpoint price elasticity?',
        Q2: 'Demand for a product has an elasticity of {E}. If its price goes from {P1} to {P2}, and {Q1} are sold now, how many will be sold afterwards?'
      }
    },
    {
      name: 'Elasticity at a point on a straight demand line',
      expr: 'E = -b*P/Q', tex: 'E = -\\frac{b\\,P}{Q}',
      vars: {
        E: { name: 'point elasticity of demand', signed: true },
        b: { name: 'units fewer bought per ¤1 of price', value: 50 },
        P: { name: 'price', q: 'money', unit: '$', value: 10 },
        Q: { name: 'quantity bought at that price', value: 700 }
      },
      note: 'For $Q = a - bP$. Demand is unit elastic ($E = -1$) at the midpoint of the line, $P = a/(2b)$, where revenue is largest.',
      practice: { unknowns: ['E', 'P'] },
      stories: {
        E: 'On a straight demand line, buyers take {b} units fewer for each ¤1 of price. At {P} they buy {Q}. What is the elasticity there?',
        P: 'Buyers take {b} units fewer per ¤1 of price. At what price does demand have an elasticity of {E}, if {Q} are bought there?'
      }
    },
    {
      name: 'Revenue on a straight demand line',
      expr: 'R = P*(a - b*P)', tex: 'R = P\\,(a - b\\,P)',
      vars: {
        R: { name: 'revenue a period', q: 'money', unit: '$' },
        P: { name: 'price', q: 'money', unit: '$', value: 10, min: 0 },
        a: { name: 'quantity wanted at a price of zero', value: 1200 },
        b: { name: 'units fewer bought per ¤1', value: 50 }
      },
      note: 'Solving for $P$ usually gives two prices with the same revenue — one on the inelastic, one on the elastic part of the line (¤10 and ¤14 both give ¤7,000 here). The top of the hill is at $P = a/(2b)$.',
      practice: { unknowns: ['R'] },
      stories: { R: 'Weekly demand is {a} − {b}·P. What revenue does a seller take at {P}?' }
    },
    {
      name: 'Share of a tax paid by buyers',
      expr: 's = Es/(Es - Ed)', tex: 's = \\frac{E_s}{E_s - E_d}',
      vars: {
        s: { name: 'share of the tax carried by buyers', q: 'ratio', unit: '%' },
        Es: { name: 'price elasticity of supply', value: 1.43, tex: 'E_s' },
        Ed: { name: 'price elasticity of demand (negative)', value: -0.71, signed: true, min: -3, max: -0.02, tex: 'E_d' }
      },
      note: 'For a small tax, with elasticities measured at the starting equilibrium. Sellers carry the rest, $1 - s$. Perfectly inelastic demand ($E_d = 0$) puts the whole tax on buyers.',
      practice: { unknowns: ['s'] },
      stories: { s: 'Supply has an elasticity of {Es} and demand {Ed}. What share of a new tax ends up paid by buyers?' }
    }
  ],
  examples: [
    {
      title: 'The café\'s price rise',
      q: 'An espresso goes from ¤2.00 to ¤2.50 and sales fall from 400 to 360 cups a day. Find the elasticity and what happened to revenue.',
      steps: [
        'Quantity change on the average: $-40/380 = -0.105$ (−10.5 %).',
        'Price change on the average: $0.50/2.25 = 0.222$ (+22.2 %).',
        '$E = -0.105/0.222 = -0.47$: inelastic.',
        'Revenue: $2.00 \\times 400 = ¤800$ before, $2.50 \\times 360 = ¤900$ after. As an inelastic elasticity predicts, the price rise raised revenue.'
      ],
      a: 'E ≈ −0.47; revenue rose from ¤800 to ¤900 a day.'
    },
    {
      title: 'Where on the line?',
      q: 'On the strawberry demand line $Q = 1200 - 50P$, find the elasticity and the revenue at ¤10, ¤12 and ¤18.',
      steps: [
        'At ¤10: $Q = 700$, $E = -50 \\times 10/700 = -0.71$, revenue ¤7,000.',
        'At ¤12: $Q = 600$, $E = -50 \\times 12/600 = -1$, revenue ¤7,200 — the largest possible.',
        'At ¤18: $Q = 300$, $E = -50 \\times 18/300 = -3$, revenue ¤5,400. Here a price cut would raise revenue.'
      ],
      a: '−0.71 and ¤7,000; −1 and ¤7,200; −3 and ¤5,400.'
    },
    {
      title: 'Who pays a ¤3 tax?',
      q: 'The strawberry market is at ¤10 and 700 kg. A tax of ¤3 per kilogram is collected from growers. How is it shared?',
      steps: [
        'Elasticities at equilibrium: $E_d = -50 \\times 10/700 = -0.71$, $E_s = 100 \\times 10/700 = 1.43$.',
        'Buyers\' share: $s = 1.43/(1.43 + 0.71) = 0.667$.',
        'Buyers pay about $0.667 \\times 3 = ¤2$ more (¤12); growers keep ¤1 less (¤9). For straight lines the split is exact: 600 kg are then traded.'
      ],
      a: 'Buyers carry ¤2 of the ¤3, growers ¤1 — although the growers hand over the tax.'
    }
  ],
  quiz: [
    { q: 'A bus company raises fares by 10 % and passenger numbers fall by 3 %. What happens to its fare revenue?', choices: ['it rises', 'it falls', 'it stays the same', 'it cannot be told without the cost of fuel'], a: 0,
      why: 'The elasticity is about −0.3: inelastic. Revenue changes by roughly +10 % − 3 % ≈ +7 % (exactly 1.10 × 0.97 = 1.067).' },
    { q: 'On a straight-line demand curve the elasticity is the same at every point.', a: false,
      why: 'The slope is constant, but $E = -bP/Q$ changes: small where the price is low and the quantity large, very large near the top of the line.' },
    { q: 'A price rises from ¤20 to ¤22 and the quantity sold falls from 100 to 80. What is the midpoint elasticity (a negative number)?', answer: -2.33,
      why: 'Quantity: $-20/90 = -0.222$. Price: $2/21 = 0.0952$. $E = -0.222/0.0952 = -2.33$: elastic, so revenue fell (from ¤2,000 to ¤1,760).' },
    { q: 'Which is likely to have the most elastic demand?', choices: ['salt', 'one particular brand of breakfast cereal', 'insulin for a diabetic', 'petrol in the week after a price rise'], a: 1,
      why: 'A single brand has many close substitutes on the same shelf. Salt is cheap and has no substitute, insulin is a necessity, and petrol use hardly changes within a week.' },
    { q: 'A bumper harvest makes the price of wheat fall so much that farmers\' total income falls. What does that tell you about the demand for wheat?', choices: ['it is elastic', 'it is inelastic', 'it is unit elastic', 'it slopes upwards'], a: 1,
      why: 'Revenue fell when the quantity rose and the price fell, so the price fell by a larger percentage than the quantity rose: inelastic demand. This "farm paradox" is one reason many countries support farm incomes.' }
  ],
  applications: [
    'Pricing: a price rise raises revenue only where demand is inelastic; discounts pay off only where it is elastic.',
    'Tax design: taxes on inelastic goods raise money with little change in behaviour — which is also why they weigh on people who cannot cut back.',
    'The farm paradox: a bumper harvest can lower farmers\' income because the demand for food is inelastic.',
    'Forecasting: how a fare rise changes passenger numbers, a toll changes traffic, or a tax changes smoking.'
  ],
  sim: ['mic-elasticity', { id: 'mic-policy', params: { mode: 'tax' }, title: 'Who pays a tax: buyers and sellers share it' }]
},

/* ================================================================ surplus */
{
  id: 'consumer-producer-surplus', parent: 'markets', title: 'Consumer and producer surplus', level: 2,
  short: 'The gain buyers get from paying less than they would have been willing to, and sellers from receiving more than they needed. Their sum measures what a market is worth — and what a tax or a rule destroys.',
  keywords: ['consumer surplus', 'producer surplus', 'total surplus', 'willingness to pay', 'deadweight loss', 'excess burden', 'efficiency', 'welfare', 'invisible hand', 'cost-benefit analysis'],
  prereq: ['market-equilibrium', 'marginal-thinking', 'math:area'],
  related: ['price-controls', 'elasticity', 'externalities', 'market-structures', 'gdp'],
  body: `
You were ready to pay ¤150 for a concert ticket and got one for ¤90. The ¤60 difference appears in nobody's accounts, but it is a real gain: you would have given up more and did not have to. Economists call it **consumer surplus**. The seller's version — the price received minus the least they would have accepted — is **producer surplus**. Together they measure what a market is worth to the people in it.

### Willingness to pay
Line the buyers up from the keenest to the least keen. Five fans would pay at most ¤100, ¤80, ¤60, ¤50 and ¤30 for a ticket. At a price of ¤50 the first four buy (the fourth is exactly indifferent), with surpluses of ¤50, ¤30, ¤10 and ¤0: a consumer surplus of ¤90. The fifth fan stays home, and that is as it should be — the ticket is worth less to him than its price.

With thousands of buyers the steps smooth into the demand curve: **a demand curve is a list of willingness to pay**, and consumer surplus is the area between it and the price. In the same way the supply curve lists the lowest price at which each unit would be offered — its cost at the margin — and producer surplus is the area between the price and the supply curve.

### The areas in numbers
For straight lines the areas are triangles. In the strawberry market the keenest buyer would pay ¤24 for the first kilogram and the first kilogram could be grown for ¤3. At the equilibrium of ¤10 and 700 kg,

$$CS = \\tfrac{1}{2}(24 - 10) \\times 700 = ¤4{,}900, \\qquad PS = \\tfrac{1}{2}(10 - 3) \\times 700 = ¤2{,}450$$

— ¤7,350 a week of value created simply by trading strawberries.

### Why the equilibrium maximises the total
Every kilogram to the left of 700 is worth more to some buyer than it costs some grower to produce: trading it creates value. Every kilogram beyond 700 would cost more to grow than anyone would pay for it. The competitive equilibrium trades exactly the units worth trading — the precise content of Adam Smith's "invisible hand". Its conditions matter: informed buyers and sellers, no market power ([[market-structures]]), and no harm to people outside the trade ([[externalities]]). And it says nothing about how the gains are shared or whether incomes are fair.

### The deadweight loss of a tax
A tax of ¤3 per kilogram raises the price buyers pay to ¤12 and lowers what growers keep to ¤9, and 600 kg are traded instead of 700. Consumer surplus falls to ¤3,600, producer surplus to ¤1,800, and the government collects ¤1,800. The three add to ¤7,200 — ¤150 less than before. That ¤150, the value of the 100 kg no longer traded, is the **deadweight loss**: a loss to buyers and sellers that is nobody's gain. For straight-line curves

$$\\mathrm{DWL} = \\frac{t^2}{2}\\,\\frac{b\\,d}{b + d}$$

It grows with the **square** of the tax. A ¤6 tax loses ¤600 a week, four times as much, while raising ¤3,000 — not twice ¤1,800. So a broad tax at a low rate usually costs less per unit of revenue than a narrow tax at a high rate, and taxes on goods whose demand or supply is inelastic (small $b$ or $d$) cause the least loss. These are central ideas in tax design — weighed, in practice, against fairness.

> [!key] Revenue raised is a transfer from taxpayers to the public purse and can pay for things people value. The deadweight loss is different: it is value that simply disappears because trades stop happening.

### Where surplus thinking is used
Cost–benefit studies value a new bridge or rail line by the surplus it creates for travellers, not by its ticket income. Free digital services — maps, search, messaging — add almost nothing to [[gdp]], yet surveys asking people what they would need to be paid to give them up find large values: much of their worth is consumer surplus. And firms that charge different customers different prices — airlines, software, cinemas with student tickets — are turning consumer surplus into producer surplus.
`,
  ideas: [
    'Consumer surplus is what buyers would have paid minus what they paid; producer surplus is what sellers received minus the least they would have accepted.',
    'A demand curve is a ranked list of willingness to pay; a supply curve a ranked list of costs at the margin.',
    'Without externalities or market power, the competitive equilibrium makes total surplus as large as possible.',
    'A tax, or any rule that stops trades worth making, creates a deadweight loss that grows with the square of the distortion.'
  ],
  pitfalls: [
    'Producer surplus is the same as profit — Producer surplus leaves out fixed costs; profit subtracts them. The two differ by the fixed costs.',
    'The deadweight loss is the tax collected — Tax revenue is transferred, not lost. The deadweight loss is the extra value destroyed because fewer trades happen.',
    'Maximum total surplus means the best outcome for everyone — It means no trade worth making is missed. It says nothing about who gets the gains or whether the distribution is fair.'
  ],
  formulas: [
    {
      name: 'Consumer surplus (straight-line demand)',
      expr: 'CS = (Pmax - P)*Q/2', tex: '\\mathrm{CS} = \\tfrac{1}{2}\\,(P_{\\text{max}} - P)\\,Q',
      vars: {
        CS: { name: 'consumer surplus', q: 'money', unit: '$', tex: '\\mathrm{CS}' },
        Pmax: { name: 'highest price anyone would pay (where demand meets the price axis)', q: 'money', unit: '$', value: 24, tex: 'P_{\\text{max}}' },
        P: { name: 'market price', q: 'money', unit: '$', value: 10 },
        Q: { name: 'quantity bought', value: 700 }
      },
      practice: { unknowns: ['CS', 'Q'] },
      stories: {
        CS: 'Nobody would pay more than {Pmax} per unit, the price is {P}, and {Q} units are bought along a straight demand line. What is the consumer surplus?',
        Q: 'The consumer surplus is {CS} when the price is {P} and nobody would pay more than {Pmax}. How many units are bought?'
      }
    },
    {
      name: 'Producer surplus (straight-line supply)',
      expr: 'PS = (P - Pmin)*Q/2', tex: '\\mathrm{PS} = \\tfrac{1}{2}\\,(P - P_{\\text{min}})\\,Q',
      vars: {
        PS: { name: 'producer surplus', q: 'money', unit: '$', tex: '\\mathrm{PS}' },
        P: { name: 'market price', q: 'money', unit: '$', value: 10 },
        Pmin: { name: 'lowest price at which anything is offered', q: 'money', unit: '$', value: 3, tex: 'P_{\\text{min}}' },
        Q: { name: 'quantity sold', value: 700 }
      },
      practice: { unknowns: ['PS'] },
      stories: { PS: 'Sellers offer nothing below {Pmin}; at the market price of {P} they sell {Q} units along a straight supply line. What is the producer surplus?' }
    },
    {
      name: 'Deadweight loss of a tax per unit',
      expr: 'DWL = t^2*b*d/(2*(b + d))', tex: '\\mathrm{DWL} = \\frac{t^2}{2}\\,\\frac{b\\,d}{b + d}',
      vars: {
        DWL: { name: 'deadweight loss a period', q: 'money', unit: '$', tex: '\\mathrm{DWL}' },
        t: { name: 'tax per unit', q: 'money', unit: '$', value: 3 },
        b: { name: 'units fewer demanded per ¤1 of price', value: 50 },
        d: { name: 'units more supplied per ¤1 of price', value: 100 }
      },
      note: 'For straight-line demand and supply. Doubling the tax quadruples the loss; flatter (more responsive) curves make it larger.',
      practice: { unknowns: ['DWL', 't'] },
      stories: {
        DWL: 'Buyers take {b} units fewer and sellers offer {d} more per ¤1 of price. What deadweight loss does a tax of {t} per unit cause?',
        t: 'With {b} units fewer demanded and {d} more supplied per ¤1, what tax per unit causes a deadweight loss of {DWL}?'
      }
    },
    {
      name: 'Quantity traded after a tax',
      expr: 'Qt = Q0 - t*b*d/(b + d)', tex: 'Q_t = Q_0 - t\\,\\frac{b\\,d}{b + d}',
      vars: {
        Qt: { name: 'quantity traded with the tax', tex: 'Q_t' },
        Q0: { name: 'quantity traded without the tax', value: 700, tex: 'Q_0' },
        t: { name: 'tax per unit', q: 'money', unit: '$', value: 3 },
        b: { name: 'units fewer demanded per ¤1', value: 50 },
        d: { name: 'units more supplied per ¤1', value: 100 }
      },
      note: 'The revenue raised is $t\\,Q_t$ — ¤1,800 for the ¤3 strawberry tax.',
      practice: { unknowns: ['Qt'] },
      stories: { Qt: 'A market trades {Q0} units. Buyers take {b} fewer and sellers offer {d} more per ¤1. How many units are traded after a tax of {t} per unit?' }
    }
  ],
  examples: [
    {
      title: 'Five fans and a ticket',
      q: 'Five fans would pay at most ¤100, ¤80, ¤60, ¤50 and ¤30 for a ticket. Find the consumer surplus at a price of ¤50 and at ¤60.',
      steps: [
        'At ¤50, four fans buy. Surpluses: $50 + 30 + 10 + 0 = ¤90$.',
        'At ¤60, three buy: $40 + 20 + 0 = ¤60$.',
        'The ¤10 rise costs the three remaining buyers ¤30 in total, and the fan who valued the ticket at ¤50 drops out — his surplus was already zero, so nothing more is lost there.'
      ],
      a: '¤90 at a price of ¤50; ¤60 at ¤60.'
    },
    {
      title: 'What a ¤3 tax does to the strawberry market',
      q: 'Before the tax the market clears at ¤10 and 700 kg, with $CS = ¤4{,}900$ and $PS = ¤2{,}450$. A tax of ¤3 per kg brings buyers\' price to ¤12 and growers\' to ¤9. Account for every euro, dollar or shekel of surplus.',
      steps: [
        'Quantity: $1200 - 50 \\times 12 = 600$ kg.',
        'Consumer surplus: $\\tfrac{1}{2}(24 - 12) \\times 600 = ¤3{,}600$. Producer surplus: $\\tfrac{1}{2}(9 - 3) \\times 600 = ¤1{,}800$.',
        'Tax revenue: $3 \\times 600 = ¤1{,}800$.',
        'Total: $3{,}600 + 1{,}800 + 1{,}800 = ¤7{,}200$, against ¤7,350 before. The missing ¤150 is the deadweight loss: $\\tfrac{1}{2} \\times 3 \\times 100$.'
      ],
      a: 'Buyers lose ¤1,300, growers ¤650, the government gains ¤1,800, and ¤150 simply vanishes.'
    }
  ],
  quiz: [
    { q: 'You would have paid ¤70 for a jacket and buy it for ¤45. What is your consumer surplus, in ¤?', answer: 25, unit: '$',
      why: 'Willingness to pay minus the price: ¤70 − ¤45 = ¤25.' },
    { q: 'For the last unit bought at the equilibrium price, the buyer\'s surplus is…', choices: ['the largest of all', 'about zero', 'equal to the price', 'negative'], a: 1,
      why: 'The marginal buyer values the good at just about the price — that is why buyers who value it less do not buy.' },
    { q: 'A per-unit tax is doubled. Roughly what happens to its deadweight loss (with straight-line curves)?', choices: ['it stays the same', 'it doubles', 'it quadruples', 'it halves'], a: 2,
      why: 'Both the lost quantity and the wedge double, so the triangle\'s area — the loss — grows four times.' },
    { q: 'Demand is $Q = 1200 - 50P$ and the price is ¤10 (700 units). What is the consumer surplus, in ¤?', answer: 4900, unit: '$',
      why: 'Nobody pays more than ¤24 (where $Q = 0$), so $CS = \\tfrac{1}{2}(24 - 10) \\times 700 = ¤4{,}900$.' },
    { q: 'The deadweight loss of a tax is the money the government collects.', a: false,
      why: 'The revenue is a transfer that can be spent on public services. The deadweight loss is value lost because trades that were worth making no longer happen.' }
  ],
  applications: [
    'Cost–benefit analysis of roads, railways, parks and regulations: the benefit is the surplus created, not the fees collected.',
    'Tax design: broad bases and low rates, and taxing things whose demand or supply is inelastic, keep deadweight losses small.',
    'Valuing free goods (search, maps, open-source software) that barely show up in GDP.',
    'Understanding price discrimination — student fares, early-bird tickets — as a way of capturing consumer surplus.'
  ],
  history: 'Jules Dupuit, a French engineer, used the idea in 1844 to judge whether bridges and canals were worth building; Alfred Marshall named consumer surplus and drew it as an area under the demand curve in 1890. The triangle measuring a tax\'s deadweight loss is often called the Harberger triangle after Arnold Harberger, who used it in the 1950s and 1960s to estimate the costs of taxes and monopoly.',
  sim: [{ id: 'mic-supply-demand', title: 'Surplus on the supply-and-demand chart' }, { id: 'mic-policy', params: { mode: 'tax' } }]
},

/* ================================================================ price controls */
{
  id: 'price-controls', parent: 'markets', title: 'Price ceilings and floors', level: 2,
  short: 'Laws that cap a price (rent control, fuel caps) or set a minimum (minimum wages, farm price supports). A binding ceiling causes shortages and a binding floor surpluses; who gains, who loses and by how much is what the evidence debates.',
  keywords: ['price ceiling', 'price floor', 'price control', 'rent control', 'rent stabilisation', 'minimum wage', 'shortage', 'surplus', 'black market', 'rationing', 'deadweight loss', 'price gouging', 'usury cap', 'monopsony'],
  prereq: ['market-equilibrium', 'consumer-producer-surplus', 'elasticity'],
  related: ['supply-demand', 'market-structures', 'high-cost-credit', 'rent-vs-buy', 'unemployment', 'hyperinflation'],
  body: `
When prices jump — fuel after a refinery fire, rents in a booming city, bread in a crisis — the call to cap them is natural and usually kindly meant. Economics does not say a price control is always wrong. It says clearly what happens to the market, so that the costs can be weighed against the aims.

### Price ceilings: a legal maximum
A ceiling **below** the equilibrium price binds. In the strawberry market (equilibrium ¤10 and 700 kg), a cap of ¤8 a kilogram means buyers want 800 kg but growers bring only 500: a **shortage** of 300 kg. Something other than price must now decide who gets the fruit — queues, first come first served, friends of the seller, ration coupons, or a black market where kilograms change hands for up to ¤14, which is what the last buyer would pay for the 500th kilogram. Sellers who cannot raise the price may cut the quality instead.

The buyers who are served pay ¤2 less a kilogram: ¤1,000 a week moves from growers to them. Consumer surplus rises from ¤4,900 to ¤5,500 and producer surplus falls from ¤2,450 to ¤1,250, so the total falls by ¤600 — the value of the 200 kg no longer grown. That ¤600 is a *minimum*: it assumes the scarce fruit reaches the buyers who value it most. Random rationing, time lost in queues and lower quality make the real loss larger.

### Price floors: a legal minimum
A floor **above** equilibrium creates a **surplus**. At ¤12 growers offer 900 kg and buyers take 600. Unless someone buys the excess, 300 kg go unsold — and if they were grown anyway, the resources that went into them are wasted. Europe's farm price guarantees of the 1970s and 1980s, which bought whatever did not sell, produced the famous "butter mountains" and "wine lakes" before the policy moved to direct payments to farmers.

### Rent control
Rent control is the most studied ceiling; its effects are fairly well established, the verdict on it is not. Tenants who hold a controlled lease gain lower rents and, above all, security in their homes. Over time, landlords convert flats to owner-occupied homes, redevelop, spend less on upkeep or leave the rental market. A careful study of San Francisco's 1994 extension of rent control to smaller buildings found that covered tenants were much more likely to stay in their homes, while landlords of those buildings cut the rental housing they offered by about 15 %, which pushed up rents elsewhere in the city. Surveys of economists show wide agreement that strict caps shrink the quantity and quality of rental housing. Supporters stress the stability and bargaining power tenants gain, and many cities now use milder *rent stabilisation* — limits on yearly increases for sitting tenants, with new buildings exempt — which does less damage to supply. The real disagreement is over whether security for today's tenants is worth fewer homes for tomorrow's, and whether housing allowances or more building would reach the same goals at lower cost.

### Minimum wages
A minimum wage is a floor in the labour market. The simplest model predicts fewer jobs; the evidence is more mixed. A landmark 1994 study of fast-food restaurants in New Jersey and neighbouring Pennsylvania found no fall in employment after New Jersey raised its minimum; many later studies of moderate minimum wages find clear gains in pay with small or no measurable job losses, and the national minimum wages introduced in the United Kingdom (1999) and Germany (2015) were followed by little overall loss of jobs in most studies. Other research finds lost hours or jobs among teenagers and the least skilled, especially after large increases. A reason effects can be small is that many employers have some power to set wages (*monopsony*, see [[market-structures]]); then a well-judged floor can raise pay without cutting jobs. Most economists agree that the level matters — a minimum at a modest fraction of the typical wage behaves differently from one close to it — and disagree about where the danger zone begins.

> [!note] Other tools aim at the same goals: cash transfers, housing allowances, wage subsidies and in-work tax credits, or simply building more homes. They avoid shortages and surpluses but cost public money, so they carry trade-offs of their own.
`,
  ideas: [
    'A ceiling below the equilibrium price causes a shortage; a floor above it causes a surplus. A control on the other side of equilibrium does nothing.',
    'With a binding control fewer units are traded, and the value of the lost trades is a deadweight loss.',
    'Controls move surplus between groups: a ceiling from sellers to the buyers who are served, a floor from buyers to the sellers who sell.',
    'Shortages are rationed by something other than price — queues, connections, black markets, lower quality — which adds to the cost.',
    'On rent control and minimum wages the direction of the effects is well studied; their size, and whether the gains justify them, is debated.'
  ],
  pitfalls: [
    'A price ceiling makes a good cheaper for everyone — It is cheaper for those who get it. Others face a shortage, a queue or a black-market price above the old one.',
    'Economists all agree that any minimum wage destroys jobs — Studies of moderate minimum wages often find small or no job losses, and monopsony explains why; the effects of large increases are more contested.',
    'The deadweight-loss triangle is the whole cost of a ceiling — It assumes the scarce goods reach the buyers who value them most. Queueing, misallocation and falling quality add to it.'
  ],
  formulas: [
    {
      name: 'Shortage under a price ceiling',
      expr: 'X = (a - b*Pc) - (c + d*Pc)', tex: 'X = (a - b\\,P_c) - (c + d\\,P_c)',
      vars: {
        X: { name: 'shortage (negative: the ceiling does not bind)', signed: true },
        a: { name: 'demand intercept', value: 1200 },
        b: { name: 'units fewer demanded per ¤1', value: 50 },
        c: { name: 'supply intercept', value: -300, signed: true, min: -1000, max: -20 },
        d: { name: 'units more supplied per ¤1', value: 100 },
        Pc: { name: 'the legal maximum price', q: 'money', unit: '$', value: 8, tex: 'P_c' }
      },
      note: 'For a floor the same expression, made negative, is the surplus. The defaults are the strawberry market with a cap of ¤8.',
      practice: { unknowns: ['X', 'Pc'] },
      stories: {
        X: 'Demand is {a} − {b}·P and supply {c} + {d}·P. The government caps the price at {Pc}. How large is the shortage?',
        Pc: 'Demand is {a} − {b}·P and supply {c} + {d}·P. At what ceiling would the shortage be {X} units?'
      }
    },
    {
      name: 'Deadweight loss when the quantity is held below equilibrium',
      expr: 'DWL = dQ^2*(1/b + 1/d)/2', tex: '\\mathrm{DWL} = \\tfrac{1}{2}\\,\\Delta Q^2 \\left(\\frac{1}{b} + \\frac{1}{d}\\right)',
      vars: {
        DWL: { name: 'value of the lost trades a period', q: 'money', unit: '$', tex: '\\mathrm{DWL}' },
        dQ: { name: 'units no longer traded (equilibrium minus actual)', value: 200, tex: '\\Delta Q' },
        b: { name: 'units fewer demanded per ¤1', value: 50 },
        d: { name: 'units more supplied per ¤1', value: 100 }
      },
      note: 'For straight-line curves, whatever holds the quantity down — a ceiling, a floor, a quota or a tax. $1/b + 1/d$ is how fast the gap between buyers\' value and sellers\' cost opens up as the quantity falls. The ¤8 strawberry cap cuts trade by 200 kg: ¤600 a week.',
      practice: { unknowns: ['DWL', 'dQ'] },
      stories: {
        DWL: 'A price cap means {dQ} fewer units are traded. Demand falls by {b} and supply rises by {d} units per ¤1. What is the deadweight loss?',
        dQ: 'Demand falls by {b} and supply rises by {d} units per ¤1. A price control causes a deadweight loss of {DWL}. How many units are no longer traded?'
      }
    },
    {
      name: 'Surplus moved to the buyers who are served',
      expr: 'G = (P0 - Pc)*Q1', tex: 'G = (P_0 - P_c)\\,Q_1',
      vars: {
        G: { name: 'gain to buyers who still get the good', q: 'money', unit: '$' },
        P0: { name: 'equilibrium price', q: 'money', unit: '$', value: 10, tex: 'P_0' },
        Pc: { name: 'ceiling price', q: 'money', unit: '$', value: 8, tex: 'P_c' },
        Q1: { name: 'quantity still sold', value: 500, tex: 'Q_1' }
      },
      note: 'Growers lose this amount plus their share of the deadweight loss.',
      practice: { unknowns: ['G'] },
      stories: { G: 'A cap lowers the price from {P0} to {Pc}, and {Q1} units are still sold. How much do the buyers who are served save?' }
    }
  ],
  examples: [
    {
      title: 'A milder ceiling',
      q: 'In the strawberry market ($Q_d = 1200 - 50P$, $Q_s = -300 + 100P$), the price is capped at ¤9. Find the shortage, the black-market price and the deadweight loss.',
      steps: [
        'At ¤9: $Q_d = 750$ kg and $Q_s = 600$ kg — a shortage of 150 kg.',
        'For the 600th kilogram buyers would pay $(1200 - 600)/50 = ¤12$: the highest black-market price.',
        'Equilibrium is 700 kg, so 100 kg are no longer traded: $\\mathrm{DWL} = \\tfrac{1}{2} \\times 100^2 \\times (1/50 + 1/100) = \\tfrac{1}{2} \\times 10\\,000 \\times 0.03 = ¤150$ a week.',
        'Buyers who are served save $1 \\times 600 = ¤600$; consumer surplus rises from ¤4,900 to ¤5,400 even though ¤150 of value is lost.'
      ],
      a: 'Shortage 150 kg, black-market price up to ¤12, deadweight loss at least ¤150 a week.'
    },
    {
      title: 'A floor, and the cost of producing what nobody buys',
      q: 'A minimum price of ¤12 is set for strawberries. What is the surplus, and what would it cost to grow the unsold fruit?',
      steps: [
        'At ¤12: $Q_d = 600$ kg, $Q_s = 900$ kg — 300 kg too many.',
        'Only 600 kg are sold. The lost trades: $\\tfrac{1}{2} \\times 100^2 \\times 0.03 = ¤150$.',
        'If growers pick all 900 kg, the extra 300 kg cost the area under the supply curve from 600 to 900 kg — the average of ¤9 and ¤12, times 300 — that is ¤3,150 of wasted effort a week.'
      ],
      a: 'A surplus of 300 kg; at least ¤150 of lost value, and up to ¤3,150 more if the surplus is grown and wasted.'
    }
  ],
  quiz: [
    { q: 'A price ceiling set above the equilibrium price…', choices: ['causes a shortage', 'causes a surplus', 'has no effect', 'raises the price to the ceiling'], a: 2,
      why: 'The market price is already below the cap, so the cap never binds. Ceilings bite only when set below equilibrium.' },
    { q: 'With $Q_d = 1200 - 50P$ and $Q_s = -300 + 100P$, a ceiling of ¤9 creates a shortage of how many units?', answer: 150,
      why: '$Q_d = 1200 - 450 = 750$ and $Q_s = -300 + 900 = 600$; the shortage is 150.' },
    { q: 'Which statement best describes the evidence on minimum wages?', choices: ['Every minimum wage causes large job losses', 'Moderate minimum wages often show small or no job losses, while the effects of large increases are more contested', 'Minimum wages always increase employment', 'Minimum wages have no effect on pay'], a: 1,
      why: 'Many studies of moderate increases find pay rises with little job loss; others find losses for some groups, especially with large increases. Monopsony power helps explain small effects.' },
    { q: 'Under a binding price ceiling, buyers as a group are always worse off.', a: false,
      why: 'Buyers who are served save money, and that can outweigh what the others lose: with the ¤8 strawberry cap, consumer surplus rises from ¤4,900 to ¤5,500. Sellers lose more than buyers gain.' },
    { q: 'Why can the true cost of a price ceiling exceed the deadweight-loss triangle?', choices: ['because the government spends the tax revenue', 'because scarce goods may go to buyers who value them less, and people waste time queueing', 'because sellers earn higher profits', 'because demand becomes more elastic'], a: 1,
      why: 'The triangle assumes the goods reach the buyers who value them most. Rationing by queue, luck or connections misallocates them, and the time spent queueing is lost too.' }
  ],
  applications: [
    'Judging proposals for rent caps, fuel or food price caps in a crisis, and anti-gouging laws.',
    'Minimum wages and their design: level relative to typical wages, youth rates, regional differences.',
    'Interest-rate caps on loans ([[high-cost-credit]]): cheaper credit for those still served, less credit for the riskiest borrowers.',
    'Recognising the signs of a hidden ceiling: queues, waiting lists, "key money" and side payments.'
  ],
  sim: { id: 'mic-policy', params: { mode: 'ceiling' } }
},

/* ================================================================ marginal thinking */
{
  id: 'marginal-thinking', parent: 'markets', title: 'Thinking at the margin', level: 1,
  short: 'Good decisions compare the extra benefit of one more step with its extra cost — not totals, not averages, and not money already spent. The idea behind pricing, tax brackets and most everyday trade-offs.',
  keywords: ['marginal', 'marginal cost', 'marginal benefit', 'marginal utility', 'diminishing returns', 'sunk cost', 'sunk-cost fallacy', 'marginal tax rate', 'average tax rate', 'tax brackets', 'water and diamonds', 'incremental'],
  prereq: ['opportunity-cost', 'math:derivative'],
  related: ['costs-and-profit', 'consumer-producer-surplus', 'break-even', 'mental-accounting', 'loss-aversion', 'taxes-investing'],
  body: `
Should you buy the large popcorn for ¤1 more than the medium? Stay an extra hour for overtime? Study one more hour tonight or sleep? Most real choices are not "all or nothing" but "a little more or a little less", and the sound way to decide is to compare the **extra** benefit with the **extra** cost. Economists call them the *marginal* benefit and the *marginal* cost, and thinking at the margin may be the most useful habit economics teaches.

### The rule
Keep going while one more unit adds more benefit than cost; stop where the two are equal. The first slice of pizza means a lot to a hungry person, the fourth much less (**diminishing marginal benefit**). The first hour of overtime is easy, the fifth exhausting (**rising marginal cost**). The best amount is where the falling benefit meets the rising cost — in mathematical terms, where the [[math:derivative|derivatives]] of total benefit and total cost are equal.

A café that already pays rent, equipment and insurance asks whether to stay open one more hour on Sunday evening. The hour brings ¤90 of sales and costs ¤60 in wages and ¤10 in electricity and ingredients: +¤20, so it opens. The rent is irrelevant to this choice — it is paid either way.

### Sunk costs: what is gone is gone
A **sunk cost** has been paid and cannot be recovered, so it should not steer a decision about the future. You bought a non-refundable ¤80 concert ticket; tonight it is pouring and you feel ill. The ¤80 is spent whether you go or not; the only question is whether the evening at the concert is worth more to you than the evening at home. Going "so the money is not wasted" is the **sunk-cost fallacy**. Firms and governments fall for it too, pouring money into failing projects because so much has already gone in.

### Average and marginal are different
The cost of flying one more passenger on a flight that leaves anyway is tiny — a little fuel and a meal — which is why airlines sell last-minute seats cheaply, although the *average* cost per passenger is far higher.

The most personal case is income tax. Many countries tax income in brackets; say 10 % on the first ¤20,000, 20 % on the next ¤30,000 and 30 % on anything above ¤50,000. On ¤50,000 the tax is ¤2,000 + ¤6,000 = ¤8,000, an **average rate** of 16 %. A ¤1,000 raise is taxed at the **marginal rate** of 30 %: you keep ¤700, and your average rate edges up to only 16.3 %. Moving into a higher bracket never reduces take-home pay, because the higher rate applies only to income above the threshold.

> [!warn] Brackets alone never make a raise cost you money, but losing means-tested benefits or tax credits can. Where support is withdrawn as income rises, the combined *effective* marginal rate can be very high, and at a sharp cut-off a small raise can leave a household worse off. Knowing where these thresholds lie is part of reading your own finances.

### Water and diamonds
Water is essential and cheap; diamonds are inessential and dear. Adam Smith found this a puzzle. Marginal thinking solves it: prices reflect the value of **one more** unit. Water is so plentiful that the next litre is worth little, even though water as a whole is priceless; diamonds are scarce, so the next one is valued highly.

### With your own money
- A detour to cheaper petrol: saving ¤0.05 a litre on 50 litres is ¤2.50; a 10 km detour at 7 litres per 100 km and ¤1.80 a litre burns ¤1.26. The net ¤1.24 is for perhaps a quarter of an hour of your time.
- "Buy two, get the third half price": the question is whether you want a third item at half price, not whether the deal is good on average.
- Repaying a loan early or investing: compare what the *next* ¤1,000 earns in each place.
`,
  ideas: [
    'Decide by comparing the extra benefit of one more unit with its extra cost; stop where they are equal.',
    'Marginal benefits usually fall and marginal costs usually rise as you do more.',
    'Sunk costs are the same whatever you choose, so they should not affect the choice.',
    'Averages mislead: the marginal tax rate, the marginal cost of a seat and the marginal value of water are what decisions turn on.'
  ],
  pitfalls: [
    'A raise that moves me into a higher tax bracket lowers my take-home pay — Only the income above the threshold is taxed at the higher rate. (Losing means-tested benefits is a separate issue and can bite.)',
    'I have paid for it, so I must use it — The money is gone either way. Use it only if using it is worth more than the alternative now.',
    'If the average cost is ¤5, selling an extra unit for ¤4 loses money — What matters is the marginal cost of that unit. If it costs ¤1 to make, selling it for ¤4 adds ¤3 to profit.'
  ],
  derivation: {
    title: 'Why the best quantity equals marginal benefit and marginal cost',
    steps: [
      { text: 'Let $B(q)$ be the total benefit and $C(q)$ the total cost of doing $q$ units. The net benefit is', tex: 'N(q) = B(q) - C(q)' },
      { text: 'At the best $q$ the net benefit stops rising, so its [[math:derivative|derivative]] is zero:', tex: "N'(q) = B'(q) - C'(q) = 0" },
      { text: 'The derivatives are the marginal benefit and the marginal cost, so', tex: "MB(q) = B'(q) = C'(q) = MC(q)" },
      { text: 'It is a maximum when $MB$ falls through $MC$: before that point one more unit adds net benefit, after it one more unit subtracts it. See [[math:optimization]].' }
    ]
  },
  formulas: [
    {
      name: 'Marginal cost',
      expr: 'MC = (C2 - C1)/(Q2 - Q1)', tex: '\\mathrm{MC} = \\frac{C_2 - C_1}{Q_2 - Q_1}',
      vars: {
        MC: { name: 'marginal cost per extra unit', q: 'money', unit: '$' },
        C1: { name: 'total cost before', q: 'money', unit: '$', value: 5000, tex: 'C_1' },
        C2: { name: 'total cost after', q: 'money', unit: '$', value: 5255, tex: 'C_2' },
        Q1: { name: 'units before', value: 2000, tex: 'Q_1' },
        Q2: { name: 'units after', value: 2100, tex: 'Q_2' }
      },
      note: 'A bakery whose weekly cost rises from ¤5,000 to ¤5,255 when it bakes 100 more loaves: each extra loaf costs ¤2.55. If loaves sell for ¤3, baking them adds profit.',
      practice: { unknowns: ['MC', 'C2'] },
      stories: {
        MC: 'Making {Q1} units costs {C1} a week and making {Q2} costs {C2}. What does each extra unit cost?',
        C2: 'A firm makes {Q1} units for {C1}. If each extra unit costs {MC}, what will {Q2} units cost?'
      }
    },
    {
      name: 'What a raise leaves you',
      expr: 'K = R*(1 - m)', tex: 'K = R\\,(1 - m)',
      vars: {
        K: { name: 'extra take-home pay', q: 'money', unit: '$' },
        R: { name: 'raise before tax', q: 'money', unit: '$', value: 1000 },
        m: { name: 'marginal tax rate (including any benefits withdrawn)', q: 'ratio', unit: '%', value: 30, min: 0, max: 100 }
      },
      practice: { unknowns: ['K', 'm'] },
      stories: {
        K: 'You get a raise of {R}, taxed at your marginal rate of {m}. How much more do you take home?',
        m: 'A raise of {R} leaves you only {K} better off. What is your effective marginal rate?'
      }
    },
    {
      name: 'Average tax rate',
      expr: 'A = T/I', tex: 'A = \\frac{T}{I}',
      vars: {
        A: { name: 'average tax rate', q: 'ratio', unit: '%' },
        T: { name: 'total tax paid', q: 'money', unit: '$', value: 8000 },
        I: { name: 'income', q: 'money', unit: '$', value: 50000 }
      },
      note: 'With rising brackets the average rate is always below the top marginal rate you pay.',
      practice: { unknowns: ['A'] },
      stories: { A: 'On an income of {I} you pay {T} of income tax. What is your average tax rate?' }
    },
    {
      name: 'Is the detour to cheaper fuel worth it?',
      expr: 'G = s*V - k*f*p/100', tex: 'G = s\\,V - \\frac{k\\,f\\,p}{100}',
      vars: {
        G: { name: 'net saving (before counting your time)', q: 'money', unit: '$', signed: true },
        s: { name: 'price difference per litre', q: 'money', unit: '$', value: 0.05 },
        V: { name: 'litres bought', value: 50 },
        k: { name: 'extra distance driven, km', value: 10 },
        f: { name: 'fuel use, litres per 100 km', value: 7 },
        p: { name: 'price of fuel per litre', q: 'money', unit: '$', value: 1.8 }
      },
      note: 'Divide the net saving by the extra time to see what the detour pays you per hour.',
      practice: { unknowns: ['G', 'k'] },
      stories: {
        G: 'A station {k} km off your route sells fuel {s} a litre cheaper. You need {V} litres, your car uses {f} litres per 100 km and fuel costs {p} a litre. What do you save?',
        k: 'Fuel is {s} a litre cheaper elsewhere and you need {V} litres. Your car uses {f} litres per 100 km at {p} a litre. How long a detour, in km, would leave a net saving of {G}?'
      }
    }
  ],
  examples: [
    {
      title: 'A raise and the tax brackets',
      q: 'Income tax is 10 % on the first ¤20,000, 20 % on the next ¤30,000 and 30 % above ¤50,000. You earn ¤50,000 and are offered a ¤1,000 raise. What happens to your tax and your take-home pay?',
      steps: [
        'Tax on ¤50,000: $0.10 \\times 20\\,000 + 0.20 \\times 30\\,000 = 2\\,000 + 6\\,000 = ¤8{,}000$; average rate 16 %.',
        'The extra ¤1,000 is all above ¤50,000, taxed at 30 %: ¤300 more tax.',
        'Take-home pay rises by ¤700. The average rate becomes $8\\,300/51\\,000 = 0.163$, or 16.3 %.'
      ],
      a: 'You keep ¤700 of the raise; your average rate rises only from 16 % to 16.3 %.'
    },
    {
      title: 'One more batch',
      q: 'A bakery sells loaves for ¤3. Its weekly cost is ¤5,000 for 2,000 loaves, ¤5,255 for 2,100, ¤6,375 for 2,500 and ¤6,680 for 2,600. Is an extra batch of 100 loaves worth baking at 2,000? At 2,500?',
      steps: [
        'From 2,000 to 2,100: marginal cost $255/100 = ¤2.55$ a loaf, below the ¤3 price. The batch adds $100 \\times (3 - 2.55) = ¤45$ to profit.',
        'From 2,500 to 2,600: marginal cost $(6\\,680 - 6\\,375)/100 = ¤3.05$ a loaf, above the price. That batch would lose ¤5.',
        'Marginal cost rises with output (overtime, a crowded kitchen), so the best output is where it reaches the price — about 2,500 loaves. Note that the *average* cost at 2,500 is only ¤2.55: comparing the price with the average would have suggested baking more.'
      ],
      a: 'Bake the batch at 2,000 loaves (it adds ¤45), not the one at 2,500 (it loses ¤5).'
    }
  ],
  quiz: [
    { q: 'You paid ¤80 for a non-refundable ticket. On the night you would rather stay home. What should the ¤80 count for in your decision?', choices: ['a lot: otherwise it is wasted', 'nothing: it is spent either way', 'half: split the difference', 'it depends on how rich you are'], a: 1,
      why: 'It is a sunk cost — the same whether you go or not. Compare only the value of the evening out with the value of the evening in.' },
    { q: 'Making 100 units costs ¤1,000 and making 101 costs ¤1,007. What is the marginal cost of the 101st unit, in ¤?', answer: 7, unit: '$',
      why: 'The extra cost of the extra unit: ¤1,007 − ¤1,000 = ¤7, even though the average cost is about ¤10.' },
    { q: 'Your marginal tax rate is 30 %. How much of a ¤2,000 raise do you keep, in ¤?', answer: 1400, unit: '$',
      why: '¤2,000 × (1 − 0.30) = ¤1,400 — the higher rate applies only to the extra income.' },
    { q: 'If a firm\'s average cost is ¤5, selling one more unit for ¤4 must lose money.', a: false,
      why: 'What matters is the cost of that one unit. If producing it adds only ¤1 to costs, selling it for ¤4 adds ¤3 to profit.' },
    { q: 'Why is water cheap and diamonds expensive?', choices: ['because water is less useful', 'because price reflects the value of one more unit, and water is plentiful', 'because diamonds cost more to transport', 'because water is always provided by governments'], a: 1,
      why: 'Water as a whole is invaluable, but so much is available that the next litre is worth little. Diamonds are scarce, so the next one is valued highly.' }
  ],
  applications: [
    'Deciding on overtime, extra study, one more item or one more trip by comparing extra benefit with extra cost.',
    'Understanding tax brackets and effective marginal rates before asking for — or turning down — a raise.',
    'Dropping failing projects and unused subscriptions without being held back by what they already cost.',
    'Pricing by firms: last-minute seats, off-peak prices and discounts that cover marginal cost.'
  ]
}

);
