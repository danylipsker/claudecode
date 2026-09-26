/* HYPER-FINANCES · content/real-estate.js — the Property topic: renting against buying, rental
 * yields and the cap rate, leverage in property, and REITs and property funds.
 * Every number in the text was computed with Hyper.finance (or the models in sims/mortgages.js).
 * Simulations: mg-rent-buy and mg-leverage in sims/mortgages.js. */
Hyper.add(

/* ================================================================ rent or buy */
{
  id: 'rent-vs-buy', parent: 'real-estate', title: 'Rent or buy?', level: 2,
  short: 'Renting and buying are two ways of paying for a home. Compare what each costs that you never get back — rent on one side; interest, upkeep, taxes, buying and selling costs and the lost return on your deposit on the other — and how long you will stay.',
  keywords: ['rent or buy', 'renting vs buying', 'unrecoverable costs', 'price-to-rent ratio', 'opportunity cost', 'home ownership', 'break-even horizon', 'housing decision', 'tenant', 'homeowner'],
  prereq: ['mortgage-basics', 'opportunity-cost', 'mortgage-costs'],
  related: ['rental-yield', 'property-leverage', 'net-worth', 'down-payment-ltv', 'time-horizon', 'taxes-investing', 'loss-aversion'],
  body: `
"Renting is throwing money away" is one of the most repeated sentences about money, and one of the least accurate. A homeowner also pays money that never comes back: interest, maintenance, property taxes, insurance, the costs of buying and selling, and the return the deposit could have earned elsewhere. The honest comparison sets the owner's **unrecoverable costs** against the renter's rent.

### What owning costs that you do not get back
In a year, roughly:

$$U = V c + L r + (V - L)\\,k - g V$$

- $V c$ — running costs (maintenance, property tax, insurance) as a share $c$ of the value $V$;
- $L r$ — interest on the loan $L$ (the capital part of the payment is saving, not a cost);
- $(V - L)\\,k$ — the return $k$ your equity would have earned invested elsewhere, its [[opportunity-cost|opportunity cost]];
- $g V$ — minus the rise in the home's value, at growth rate $g$.

Take a ¤400,000 home with ¤80,000 down, a 5 % mortgage, running costs of 1.5 % a year and savings that could earn 6 %. Before any price rise: ¤6,000 + ¤16,000 + ¤4,800 = ¤26,800 a year, ¤2,233 a month. The same flat rents for ¤1,600 a month, ¤19,200 a year — so renting looks cheaper by ¤7,600. But if prices rise 3 % a year, the ¤12,000 gain brings the owner's net cost down to **¤14,800**, below the rent. Owning then wins by about ¤4,400 a year — after it has recovered the costs of buying (4 %) and selling (5 %), ¤36,000 together. On this rough count that takes about eight years; the full simulation below, which compounds everything, puts it at about ten.

A quick first test is the **price-to-rent ratio**, the price divided by a year's rent: here $400{,}000/19{,}200 = 20.8$. The higher it is, the more buying depends on prices continuing to rise.

### Two households, thirty years
The simulation follows two households with the same money. The buyer pays the deposit and costs, then every month the mortgage and running costs. The renter invests the deposit and costs instead, pays the rent, and each month invests whatever the buyer spends beyond the rent (when rent is the dearer, the buyer invests the difference). Net worth is the home's value less selling costs and debt, plus any investments.

With the numbers above — rents and prices both rising 3 % a year — the renter is ahead by ¤20,778 after five years, they are level after ten, and after thirty the buyer is ahead by ¤186,563. Change one assumption and the answer moves a long way:
- prices rising 1 % a year: the renter stays ahead for all thirty years, by ¤77,384 at the end;
- prices rising 4 %: the buyer is ahead from the fifth year on;
- a 6 % mortgage instead of 5 %: after thirty years the renter is still ahead, by ¤9,053.

> [!key] Rent against buy is decided mostly by four numbers: how long you stay, the price-to-rent ratio, the mortgage rate against what your savings would earn, and how fast prices rise — the one nobody knows.

### What the numbers leave out
- **Discipline.** The model's renter invests every spare coin; many people do not, and a repayment mortgage is a savings plan that runs by itself. In practice this favours buying.
- **Flexibility.** A renter can move for a job at little cost; an owner pays the selling costs, and may be stuck in a falling market.
- **Security and control.** Tenancy rules vary widely: long, regulated leases in Germany or Switzerland — where around half of households or more rent — are a different world from short leases elsewhere.
- **Taxes.** Many countries tax investment returns but not the gain on your own home; some tax the value of living in it or give relief on mortgage interest. Check your own.
- **Concentration.** A home ties most of a family's wealth to one building in one town, bought with [[property-leverage|leverage]].

Neither choice is a moral one, and neither is a failure. Many financially secure people rent for decades; many buy early and are glad they did. Run the comparison for your city and your horizon, and decide knowing what each path really costs.

> [!tip] The [savings calculator](#/tools/money/save) shows what a deposit invested for the same years could grow to.
`,
  ideas: [
    'Owners also have unrecoverable costs: interest, upkeep, taxes, insurance, transaction costs and the lost return on their equity.',
    'Only the capital part of a mortgage payment is saving; the rest is a cost like rent.',
    'Buying and selling costs make short stays expensive: the horizon often decides the answer.',
    'The price-to-rent ratio is a first test; high ratios make buying depend on rising prices.',
    'Price growth, the mortgage rate and the return on savings can swing the comparison either way.'
  ],
  pitfalls: [
    'Rent is money thrown away; a mortgage payment is saving — Interest, upkeep and taxes are thrown away just as surely; only the capital repaid is saving.',
    'Homes always rise in value, so buying always wins — Over long stretches prices have fallen or stagnated in many places; with 1 % growth the renter in the example stays ahead for thirty years.',
    'Buying is right as soon as you can afford the deposit — With a short horizon, buying and selling costs alone can outweigh years of rent savings.'
  ],
  formulas: [
    {
      name: 'Yearly cost of owning that you do not get back',
      expr: 'U = V*c + L*r + (V - L)*k - g*V', tex: 'U = V c + L r + (V - L)\\,k - g V',
      vars: {
        U: { name: 'unrecoverable cost of owning per year', q: 'money', unit: '$', signed: true },
        V: { name: 'value of the home', q: 'money', unit: '$', value: 400000 },
        c: { name: 'running costs, share of the value per year', q: 'ratio', unit: '%', value: 1.5, min: 0, max: 10 },
        L: { name: 'mortgage balance', q: 'money', unit: '$', value: 320000 },
        r: { name: 'mortgage rate', q: 'ratio', unit: '%', value: 5, min: 0, max: 30 },
        k: { name: 'return your equity could earn elsewhere', q: 'ratio', unit: '%', value: 6, min: 0, max: 30 },
        g: { name: 'yearly rise in the home\'s value', q: 'ratio', unit: '%', value: 3, min: -20, max: 30, signed: true }
      },
      note: 'Compare $U$ with a year\'s rent for the same home. A first-year estimate: it leaves out buying and selling costs, which a short stay must also recover.',
      practice: { unknowns: ['U', 'g'] },
      stories: {
        U: 'A home worth {V} is bought with a loan of {L} at {r}. Running costs are {c} a year, your equity could earn {k} elsewhere and prices rise {g} a year. What does owning cost per year that you do not get back?',
        g: 'Owning a home worth {V} (loan {L} at {r}, running costs {c}, alternative return {k}) should cost no more than {U} a year net. How fast must prices rise?'
      }
    },
    {
      name: 'Price-to-rent ratio',
      expr: 'PR = V/(12*R)', tex: '\\mathrm{PR} = \\frac{V}{12\\,R}',
      vars: {
        PR: { name: 'price-to-rent ratio', tex: '\\mathrm{PR}' },
        V: { name: 'price of the home', q: 'money', unit: '$', value: 400000 },
        R: { name: 'monthly rent for the same home', q: 'money', unit: '$', value: 1600 }
      },
      note: 'Years of rent the price would buy. Its inverse is the gross rental yield.',
      practice: { unknowns: ['PR', 'R'] },
      stories: {
        PR: 'A flat sells for {V} and rents for {R} a month. What is its price-to-rent ratio?',
        R: 'Homes in a town sell at a price-to-rent ratio of {PR}. What monthly rent would a home worth {V} fetch?'
      }
    }
  ],
  examples: [
    {
      title: 'A year of owning against a year of renting',
      q: 'A ¤400,000 home, ¤320,000 borrowed at 5 %, running costs 1.5 %, savings that could earn 6 %, prices rising 3 %. The same home rents for ¤1,600 a month. Compare the yearly costs.',
      steps: [
        'Running costs $0.015 \\times 400\\,000 = ¤6{,}000$; interest $0.05 \\times 320\\,000 = ¤16{,}000$; lost return $0.06 \\times 80\\,000 = ¤4{,}800$.',
        'Before growth: ¤26,800 a year. Price rise: $0.03 \\times 400\\,000 = ¤12{,}000$. Net: $U = ¤14{,}800$.',
        'Rent: $12 \\times 1\\,600 = ¤19{,}200$. Owning is cheaper by ¤4,400 a year.',
        'Buying (4 %) and selling (5 %) cost ¤36,000; at ¤4,400 a year they take about $36\\,000/4\\,400 = 8.2$ years to recover.'
      ],
      a: 'Owning costs about ¤14,800 a year against ¤19,200 of rent, but needs roughly eight years to recover the transaction costs.'
    },
    {
      title: 'Thirty years in the simulation',
      q: 'Run the two households of the simulation with its default numbers (20 % deposit, 5 % over 30 years, rents and prices +3 % a year, savings earning 6 %). Who is ahead after 5, 10 and 30 years?',
      steps: [
        'First month: the buyer spends ¤1,717.83 on the mortgage and ¤500 on running costs, ¤2,217.83; the renter pays ¤1,600 and invests the other ¤617.83.',
        'After 5 years: buyer ¤146,672, renter ¤167,451 — renter ahead by ¤20,778.',
        'After 10 years: buyer ¤250,394, renter ¤250,265 — level.',
        'After 30 years: buyer ¤1,016,770, renter ¤830,207 — buyer ahead by ¤186,563.'
      ],
      a: 'The renter leads for about ten years; after that the buyer pulls ahead, as long as prices keep rising 3 % a year.'
    }
  ],
  quiz: [
    { q: 'Rent is money thrown away, while a mortgage payment is all saving.', a: false,
      why: 'Only the capital repaid is saving. Interest, maintenance, taxes, insurance and transaction costs are as unrecoverable as rent — early in a mortgage, most of the payment is interest.' },
    { q: 'Which situation most favours renting?', choices: ['you expect to move within three years', 'rents are high relative to prices', 'you plan to stay twenty years', 'mortgage rates are far below what savings earn'], a: 0,
      why: 'Buying and selling costs of several per cent of the price need years to recover. The other three all favour buying.' },
    { q: 'A flat costs ¤360,000 and rents for ¤1,200 a month. What is its price-to-rent ratio?', answer: 25,
      why: '$360\\,000 / (12 \\times 1\\,200) = 25$: the price equals 25 years of rent, a gross yield of 4 %.' },
    { q: 'A ¤400,000 home, a ¤320,000 loan at 5 %, running costs of 1.5 %, savings that could earn 6 %, prices rising 3 % a year. Roughly what does owning cost per year that you do not get back?', answer: 14800, unit: '$',
      why: '$6\\,000 + 16\\,000 + 4\\,800 - 12\\,000 = ¤14{,}800$.' },
    { q: 'In the simulation\'s example, prices rise 1 % a year instead of 3 %. What happens?', choices: ['buying wins sooner', 'renting stays ahead for all thirty years', 'nothing changes', 'both end exactly level'], a: 1,
      why: 'The owner\'s return depends heavily on price growth; at 1 % the renter is still ¤77,384 ahead after thirty years.' }
  ],
  applications: ['Deciding whether to buy now or keep renting and saving.', 'Estimating how long you must stay for buying to pay.', 'Comparing cities by their price-to-rent ratios.', 'Answering the "rent is dead money" argument with numbers.'],
  sim: 'mg-rent-buy'
},

/* ================================================================ rental yield */
{
  id: 'rental-yield', parent: 'real-estate', title: 'Rental yield and cap rate', level: 2,
  short: 'Gross rental yield is a year\'s rent as a share of the price; net yield and the cap rate subtract vacancies and running costs. They say what a property earns before financing — and whether borrowing to buy it will add to your return or eat it.',
  keywords: ['rental yield', 'gross yield', 'net yield', 'cap rate', 'capitalisation rate', 'net operating income', 'NOI', 'buy-to-let', 'vacancy', 'income approach', 'valuation', 'cash-on-cash'],
  prereq: ['mortgage-basics', 'mortgage-costs', 'math:percentages'],
  related: ['property-leverage', 'rent-vs-buy', 'reits', 'bond-pricing', 'dividends', 'pe-ratio'],
  body: `
A flat bought for ¤250,000 rents for ¤1,100 a month. Is it a good investment? The first number investors reach for is the yield.

### Gross yield
$$y_g = \\frac{12\\,R}{V} = \\frac{13{,}200}{250{,}000} = 5.28\\,\\%$$

Easy to compute and easy to flatter: it ignores everything that happens between the tenant's payment and your bank account.

### Net yield and the cap rate
Take the costs out. Suppose the flat stands empty one month a year (¤1,100 lost), an agent takes 10 % of the rent collected (¤1,210), and maintenance, insurance and building charges come to ¤2,700. What remains is the **net operating income** (NOI):

¤13,200 − ¤1,100 − ¤1,210 − ¤2,700 = **¤8,190** a year.

As a share of the value this is the **capitalisation rate**, or cap rate: 8,190 / 250,000 = **3.28 %**. Count the costs of buying (say ¤12,500) in the price and the yield on what you actually spent is 3.12 %. Taxes on the rent come on top and depend on the country.

The cap rate is what the building earns for its owner before any borrowing, as a share of its price — the property counterpart of a share's earnings yield or a bond's yield. It lets you compare a flat with a warehouse, or with a government bond.

### Valuing a property from its income
Turn the cap rate around and you have the way commercial property is valued:

$$V = \\frac{N}{k}$$

A building earning ¤60,000 a year is worth ¤1,000,000 at a 6 % cap rate. If investors start demanding 7 % — because interest rates have risen, say — the same building is worth ¤857,143, 14.3 % less, though not one tenant has left. That is why property values fall when interest rates rise, exactly as [[bond-pricing|bond prices]] do.

> [!key] Yield and price move in opposite directions. A high yield can mean a bargain — or a building, a town or a tenant that the market considers risky.

### Yield against the mortgage rate
Now finance the flat with a 75 % loan at 5 %, interest-only: the ¤187,500 borrowed costs ¤9,375 a year in interest — more than the ¤8,190 the flat earns. The investor pays ¤1,185 a year out of pocket and depends entirely on the price rising. This is **negative leverage**: borrowing at a higher rate than the property yields. Borrowing adds to the return on your own money only when the property's return after all costs beats the rate on the loan ([[property-leverage]]). In the simulation below prices start flat and transaction costs are switched off: move the net yield above and below the mortgage rate and watch the lines for different loan-to-values swap places.

### Reading a yield honestly
- Ask whether a quoted yield is gross or net, and on the price or on the total cost.
- Use realistic empty months and repairs, not the best year.
- Compare with safer investments: if a deposit account or a government bond yields about as much as the flat's net yield, the flat must be expected to rise in value to justify its risk, its effort and its [[bid-ask-liquidity|illiquidity]].
- Rent is not guaranteed: tenants leave, rents fall in bad years, and rules on evictions and rent increases differ from country to country.
`,
  ideas: [
    'Gross yield is a year\'s rent divided by the price; it ignores all costs.',
    'Net operating income subtracts empty months, management, maintenance, insurance and charges; divided by the value it is the cap rate.',
    'Value equals income divided by the cap rate, so rising yields mean falling values.',
    'Borrowing raises the return on your money only if the property\'s return after costs beats the loan\'s rate.',
    'A high yield is often the market\'s way of pricing a risk.'
  ],
  pitfalls: [
    'The advertised yield is what I will earn — Advertised yields are usually gross; a 5.28 % gross yield became 3.28 % net in the example, before tax.',
    'A higher yield is always the better investment — It may reflect a weaker area, an older building or riskier tenants, and a lower expected rise in value.',
    'Rising interest rates do not affect property I own outright — Your cost does not change, but the value does: buyers compare cap rates with bond yields.'
  ],
  formulas: [
    {
      name: 'Gross rental yield',
      expr: 'y = 12*R/V', tex: 'y_g = \\frac{12\\,R}{V}',
      vars: {
        y: { name: 'gross yield', q: 'ratio', unit: '%', tex: 'y_g' },
        R: { name: 'monthly rent', q: 'money', unit: '$', value: 1100 },
        V: { name: 'price of the property', q: 'money', unit: '$', value: 250000 }
      },
      practice: { unknowns: ['y', 'R', 'V'] },
      stories: {
        y: 'A flat costs {V} and rents for {R} a month. What is its gross yield?',
        R: 'A flat costs {V}. What monthly rent would give a gross yield of {y}?',
        V: 'A flat rents for {R} a month and similar flats sell at a gross yield of {y}. What is it worth?'
      }
    },
    {
      name: 'Net yield on the value (cap rate)',
      expr: 'k = (12*R*(1 - v) - C)/V', tex: 'k = \\frac{12\\,R\\,(1 - v) - C}{V}',
      vars: {
        k: { name: 'cap rate', q: 'ratio', unit: '%', signed: true },
        R: { name: 'monthly rent', q: 'money', unit: '$', value: 1100 },
        v: { name: 'share of the year empty', q: 'ratio', unit: '%', value: 8.33, min: 0, max: 100 },
        C: { name: 'yearly costs (management, repairs, insurance, charges)', q: 'money', unit: '$', value: 3910 },
        V: { name: 'value of the property', q: 'money', unit: '$', value: 250000 }
      },
      note: 'The numerator is the net operating income. The defaults are the flat in the text: one month empty in twelve, ¤3,910 of costs.',
      practice: { unknowns: ['k', 'R'] },
      stories: {
        k: 'A flat worth {V} rents for {R} a month, stands empty {v} of the time and costs {C} a year to run. What is its cap rate?',
        R: 'A flat worth {V} is empty {v} of the time and costs {C} a year. What monthly rent gives a cap rate of {k}?'
      }
    },
    {
      name: 'Value from income (the income approach)',
      expr: 'V = N/k', tex: 'V = \\frac{N}{k}',
      vars: {
        V: { name: 'value of the property', q: 'money', unit: '$' },
        N: { name: 'net operating income per year', q: 'money', unit: '$', value: 60000 },
        k: { name: 'cap rate investors demand', q: 'ratio', unit: '%', value: 6, min: 0.1, max: 30 }
      },
      practice: { unknowns: ['V', 'k'] },
      stories: {
        V: 'A building earns {N} a year after costs. Investors demand a cap rate of {k}. What is it worth?',
        k: 'A building earning {N} a year sells for {V}. What cap rate did the buyer accept?'
      }
    }
  ],
  examples: [
    {
      title: 'From gross to net',
      q: 'A ¤250,000 flat rents for ¤1,100 a month. It is empty one month a year, an agent takes 10 % of the rent collected, and other costs are ¤2,700 a year. Find the gross yield and the cap rate.',
      steps: [
        'Gross: $12 \\times 1\\,100 / 250\\,000 = 5.28\\,\\%$.',
        'Rent collected: $13\\,200 - 1\\,100 = ¤12{,}100$; agent: ¤1,210.',
        'NOI: $12\\,100 - 1\\,210 - 2\\,700 = ¤8{,}190$.',
        'Cap rate: $8\\,190 / 250\\,000 = 3.28\\,\\%$; on the price plus ¤12,500 of buying costs, 3.12 %.'
      ],
      a: 'Gross 5.28 %, cap rate 3.28 % — the costs take nearly two-fifths of the gross yield.'
    },
    {
      title: 'When cap rates rise',
      q: 'An office building earns ¤60,000 a year after costs and is valued at a 6 % cap rate. Market cap rates rise to 7 %. What happens to its value?',
      steps: [
        'At 6 %: $V = 60\\,000/0.06 = ¤1{,}000{,}000$.',
        'At 7 %: $V = 60\\,000/0.07 = ¤857{,}143$.',
        'Change: $857\\,143/1\\,000\\,000 - 1 = -14.3\\,\\%$ with the income unchanged.'
      ],
      a: 'The value falls 14.3 %, to ¤857,143.'
    }
  ],
  quiz: [
    { q: 'A flat costs ¤200,000 and rents for ¤900 a month. What is its gross yield, in per cent?', answer: 5.4,
      why: '$12 \\times 900 / 200\\,000 = 0.054$: 5.4 %.' },
    { q: 'Cap rates in a city rise from 5 % to 6 % while rents stay the same. Property values…', choices: ['rise about 20 %', 'fall about 17 %', 'do not change', 'fall about 1 %'], a: 1,
      why: '$V = N/k$: dividing by 6 instead of 5 multiplies the value by 5/6, a fall of 16.7 %.' },
    { q: 'A property with a higher gross yield is always the better investment.', a: false,
      why: 'High yields often price a risk — a weak area, heavy repairs, unreliable tenants — or low expected growth, and gross yields hide costs.' },
    { q: 'A flat\'s net yield is 3.3 % and the mortgage costs 5 %. Prices stay flat. Borrowing more of the price…', choices: ['raises the return on your own money', 'lowers the return on your own money', 'has no effect', 'removes the risk'], a: 1,
      why: 'Each borrowed unit costs 5 % and earns 3.3 %: the difference comes out of your return. That is negative leverage.' },
    { q: 'A building earns ¤48,000 a year after costs; investors demand a 6 % cap rate. What is it worth?', answer: 800000, unit: '$',
      why: '$V = 48\\,000/0.06 = ¤800{,}000$.' }
  ],
  applications: ['Comparing buy-to-let flats honestly, net of costs.', 'Understanding why property prices fall when interest rates rise.', 'Checking whether a mortgage will add to or eat an investment\'s return.', 'Reading the yield figures of property funds and REITs.'],
  sim: { id: 'mg-leverage', params: { growth: 0, costs: false } }
},

/* ================================================================ leverage in property */
{
  id: 'property-leverage', parent: 'real-estate', title: 'Leverage in property', level: 2,
  short: 'Buying property with a mortgage is investing with borrowed money: with a 20 % deposit, every change in the price lands five times over on your own stake. Leverage raises the return only while the property earns more than the loan costs — and a modest fall can wipe out the deposit.',
  keywords: ['property leverage', 'gearing', 'return on equity', 'buy-to-let', 'negative equity', 'loan-to-value', 'leverage ratio', 'housing crash', 'positive leverage', 'negative leverage'],
  prereq: ['leverage-basics', 'down-payment-ltv', 'rental-yield'],
  related: ['rent-vs-buy', 'margin-calls', 'bubbles', 'financial-crises', 'variable-rate-mortgages', 'reits', 'emergency-fund'],
  body: `
A home bought with a mortgage is the largest leveraged investment most people ever make — usually without thinking of it that way. With a 20 % deposit you control a property five times the size of your own money, and every change in its price lands, multiplied by five, on your deposit.

### The arithmetic
Leverage is the value of the asset divided by your equity:

$$\\lambda = \\frac{V}{E} = \\frac{1}{1 - \\text{LTV}}$$

At 50 % LTV it is 2; at 80 %, 5; at 90 %, 10. Buy a ¤400,000 home with ¤80,000 down and let prices rise 10 %: the home gains ¤40,000 and your equity grows by half. Let them fall 10 % and you have lost half your deposit; a 20 % fall erases it.

Borrowing is not free, so over a year the return on your equity is roughly

$$R_E = \\lambda R_p - (\\lambda - 1)\\,r_b$$

where $R_p$ is the property's return — net rent plus the change in price — and $r_b$ the rate on the loan. At leverage 5 with a 5 % mortgage, a property return of 6 % gives your money 10 %; a property return of 3 % gives it −5 %. **Leverage helps only while the property earns more than the loan costs**, and it magnifies the gap in both directions. The same rule governs [[leverage-basics]] everywhere.

### A five-year story
Two investors buy identical ¤400,000 flats with a net rental yield of 3 %, paying 4 % in buying costs and 3 % in selling costs five years later. One pays cash; the other borrows 75 %, interest-only, at 5 %.
- **Prices rise 3 % a year.** The cash buyer earns 4.54 % a year on ¤416,000 — a gain of ¤97,508. The borrower puts in ¤116,000, tops up ¤11,290 of interest that the rent does not cover over the five years, and ends with a gain of ¤22,508: 3.47 % a year. Leverage *lowered* the return, because after costs the flat earned less than the 5 % the loan cost.
- **Prices fall 3 % a year.** The cash buyer loses ¤26,305, −1.38 % a year. The borrower loses ¤101,305 of the ¤116,000 put in: −28.3 % a year.
- **Prices rise 5 % a year.** The cash buyer makes 6.5 % a year, the borrower 9.7 %.

The good case is good, the bad case is devastating, and the middle case quietly disappointed the borrower. That asymmetry is the nature of leverage.

> [!warn] With 75 % borrowed and 3 % selling costs, a price fall of 22.7 % leaves nothing after the loan is repaid; at 90 %, a fall of 7.2 % does it. Property prices have fallen that much and more: by roughly half in Ireland between 2007 and 2013, by more than half in Hong Kong between 1997 and 2003, and year after year in Japan's cities after 1991.

### Why a mortgage is survivable leverage — and when it is not
Unlike a margin account, a mortgage has no [[margin-calls|margin call]]: the lender does not force a sale because the price fell, as long as you pay. That is what makes a 90 % loan on a home far less dangerous than 90 % leverage on shares — time is on your side if you can wait. The danger comes when you *must* sell at the wrong moment: a lost job, a rate reset you cannot afford, a buy-to-let whose rent no longer covers the interest, a lender that will not refinance.

The protections are unglamorous: a cash reserve, a payment you could still carry at a higher rate, a fixed rate on part of the loan ([[mortgage-mix]]), realistic rent and repair assumptions, and not borrowing against one property to buy the next at the top of a boom. Used this way, the leverage of a mortgage is how ordinary families come to own homes; used carelessly, it is how booms turn into [[financial-crises|crises]].

> [!tip] In the simulation below each line is a loan-to-value. Find the price change at which borrowing stops helping, and the one at which the 90 % line falls off the chart.
`,
  ideas: [
    'Leverage is value divided by equity, 1/(1 − LTV): 5 at 80 % LTV, 10 at 90 %.',
    'Price changes are multiplied by the leverage on your deposit, in both directions.',
    'The return on equity is leverage times the property\'s return minus (leverage − 1) times the loan rate.',
    'Leverage raises the return only if the property\'s return after costs beats the borrowing rate.',
    'Mortgages have no margin calls, so the danger is being forced to sell at a bad time.'
  ],
  pitfalls: [
    'Borrowing more always multiplies my profit — Only when the property\'s return after costs beats the loan\'s rate; otherwise it multiplies a loss or shrinks a gain.',
    'Property does not fall like shares, so leverage is safe — Housing markets have fallen by half in some countries, and at high LTVs much smaller falls wipe out the deposit.',
    'A falling price means the bank will make me sell — Not while you keep paying; the real risk is having to sell or refinance at the wrong moment.'
  ],
  formulas: [
    {
      name: 'Leverage from the loan-to-value',
      expr: 'lambda = 1/(1 - LTV)', tex: '\\lambda = \\frac{1}{1 - \\mathrm{LTV}}',
      vars: {
        lambda: { name: 'leverage (value ÷ equity)', tex: '\\lambda' },
        LTV: { name: 'loan-to-value', q: 'ratio', unit: '%', value: 80, min: 0, max: 99.9, tex: '\\mathrm{LTV}' }
      },
      practice: { unknowns: ['lambda', 'LTV'] },
      stories: {
        lambda: 'You buy a home with a loan of {LTV} of its value. How many times your own money do you control?',
        LTV: 'An investor wants leverage of {lambda}. What loan-to-value does that need?'
      }
    },
    {
      name: 'Return on your equity',
      expr: 'RE = lambda*Rp - (lambda - 1)*rb', tex: 'R_E = \\lambda R_p - (\\lambda - 1)\\,r_b',
      vars: {
        RE: { name: 'return on your own money', q: 'ratio', unit: '%', signed: true, tex: 'R_E' },
        lambda: { name: 'leverage (value ÷ equity)', value: 5, min: 1, max: 50, tex: '\\lambda' },
        Rp: { name: 'property return (net rent + price change)', q: 'ratio', unit: '%', value: 6, signed: true, min: -100, max: 100, tex: 'R_p' },
        rb: { name: 'rate on the loan', q: 'ratio', unit: '%', value: 5, min: 0, max: 30, tex: 'r_b' }
      },
      note: 'One year, before transaction costs and tax. With $\\lambda = 1$ (no loan) it gives back $R_p$.',
      practice: { unknowns: ['RE', 'Rp'] },
      stories: {
        RE: 'A property returns {Rp} in a year; you hold it with leverage {lambda} and a loan at {rb}. What return does your own money make?',
        Rp: 'With leverage {lambda} and a loan at {rb}, what property return would give your own money {RE}?'
      }
    }
  ],
  examples: [
    {
      title: 'Ten per cent up, ten per cent down',
      q: 'A ¤400,000 home with an ¤80,000 deposit. Prices rise 10 % — or fall 10 %, or 20 %. What happens to the equity (ignoring costs and interest)?',
      steps: [
        'Leverage: $\\lambda = 400\\,000/80\\,000 = 5$.',
        '+10 %: the home gains ¤40,000; equity ¤120,000, +50 %.',
        '−10 %: the home loses ¤40,000; equity ¤40,000, −50 %.',
        '−20 %: the home loses ¤80,000; equity zero.'
      ],
      a: 'Each 1 % move in the price is a 5 % move in your equity.'
    },
    {
      title: 'Five years with and without a loan',
      q: '¤400,000 flat, net rent 3 % of the value a year, buying costs 4 %, selling costs 3 %, prices +3 % a year. Compare paying cash with borrowing 75 % interest-only at 5 %.',
      steps: [
        'Cash: put in ¤416,000; receive rents of ¤12,000 rising 3 % a year, and ¤449,798 from the sale. Return 4.54 % a year; gain ¤97,508.',
        'Loan: put in ¤116,000; each year the rent falls short of the ¤15,000 interest (¤11,290 over five years); at the end the sale leaves ¤149,798 after repaying ¤300,000.',
        'Return on the ¤116,000: 3.47 % a year; gain ¤22,508.',
        'After costs the flat earned 4.54 %, less than the 5 % loan: negative leverage.'
      ],
      a: 'Cash: 4.54 % a year; 75 % loan: 3.47 % a year. Borrowing lowered the return.'
    }
  ],
  quiz: [
    { q: 'What is the leverage of a home bought with a 75 % loan-to-value?', answer: 4,
      why: '$1/(1 - 0.75) = 4$: the home is four times your equity.' },
    { q: 'Leverage 5, a property return of 7 % in a year, a mortgage at 5 %. What return does your own money make, in per cent?', answer: 15,
      why: '$5 \\times 7 - 4 \\times 5 = 35 - 20 = 15\\,\\%$.' },
    { q: 'Like a margin loan, a mortgage can be called in when the property\'s price falls.', a: false,
      why: 'As long as you pay, the lender cannot demand repayment because of a fall in value. The risk is being forced to sell or refinance for other reasons.' },
    { q: 'With a 90 % loan and selling costs of 3 %, about how large a fall in price wipes out your deposit?', choices: ['about 7 %', 'about 10 %', 'about 23 %', 'about 50 %'], a: 0,
      why: 'After selling costs you keep 97 % of the price; that equals the 90 % loan when the price has fallen by $1 - 0.90/0.97 = 7.2\\,\\%$.' },
    { q: 'Borrowing raises the expected return on your own money only if…', choices: ['prices rise at all', 'the property\'s return after costs beats the loan\'s rate', 'the loan is at a fixed rate', 'rents rise every year'], a: 1,
      why: 'Each borrowed unit earns the property\'s return and costs the loan rate; only a positive gap adds to your return.' }
  ],
  applications: ['Seeing a home purchase as a leveraged investment.', 'Judging whether a buy-to-let loan helps or hurts the return.', 'Choosing a deposit that leaves a margin for a price fall.', 'Understanding how housing booms and busts spread.'],
  sim: 'mg-leverage'
},

/* ================================================================ REITs */
{
  id: 'reits', parent: 'real-estate', title: 'REITs and property funds', level: 1,
  short: 'A REIT or property fund lets you own a slice of many buildings — offices, warehouses, flats, shopping centres — for the price of a share, with the rents paid out as dividends. Easy to buy and diversified, but priced daily by the market and often borrowing heavily.',
  keywords: ['REIT', 'real estate investment trust', 'property fund', 'listed property', 'net asset value', 'NAV', 'discount to NAV', 'dividend yield', 'open-ended fund', 'suspension', 'gearing'],
  prereq: ['rental-yield', 'stocks-shares', 'mutual-funds-etfs'],
  related: ['dividends', 'asset-classes', 'diversification', 'property-leverage', 'bank-runs', 'index-investing', 'bid-ask-liquidity'],
  body: `
Owning a building directly takes a large sum, a mortgage, tenants and repairs. A **real estate investment trust** (REIT) or property fund offers another way in: buy a share and you own a slice of a portfolio of buildings — offices, warehouses, shopping centres, flats, hotels, data centres, hospitals — managed by professionals, with the rent passed on to you as dividends.

### How a REIT works
A REIT is a company or trust that owns (or finances) income-producing property and is listed on a stock exchange. In return for paying out most of its income, it usually pays little or no corporate tax. In the US, where REITs were created in 1960, it must distribute at least 90 % of its taxable income; dozens of countries have copied the idea since, among them the UK, Japan, Singapore, Australia, France and Israel.

Two numbers describe a REIT's price:
- its **dividend yield**, $y = D/P$: a share at ¤20 paying ¤1.10 a year yields 5.5 %;
- its **premium or discount to net asset value** (NAV), $d = P/N - 1$: if the buildings less the debts are valued at ¤25 a share, a price of ¤20 is a 20 % discount — each ¤1 buys ¤1.25 of property, at the valuers' figures.

A discount can be a bargain or a warning: markets often mark REIT shares down long before valuers mark the buildings down.

### Listed means liquid — and volatile
Because they trade all day, REIT prices move with the stock market, not with the smooth, infrequent valuations of buildings. In the 2007–2009 crisis US listed REITs lost roughly two-thirds of their value from peak to trough, far more than appraised property values showed at the time. Part of the reason is **leverage**: REITs borrow too. A REIT whose debts equal 40 % of its property sees its NAV fall 16.7 % when the buildings lose 10 %, and rise 16.7 % when they gain 10 % — the same multiplier as [[property-leverage|leverage in a home]].

$$\\Delta E = \\frac{\\Delta V}{1 - g}$$

where $g$ is the share of the property financed by debt.

### Open-ended property funds: the liquidity trap
Some unlisted funds promise daily redemptions while owning buildings that take months to sell. When many investors want out at once, the fund must **suspend** dealings — as several UK property funds did after the 2016 referendum and again in March 2020, and some German funds did after 2008, a few of which were then wound up. It is the logic of a [[bank-runs|bank run]] in another form. Listed REITs avoid it: a seller sells to another investor on the exchange, at whatever price the market sets that day.

> [!key] A REIT turns an illiquid building into a liquid share. The liquidity is real, and so is the price swing that comes with it.

### REITs or a home of your own?
They do different jobs. Your home gives you somewhere to live and a leveraged stake in one property; REITs give you income and a diversified, easily sold slice of many properties, with no tenants to manage. Property is one of the main [[asset-classes|asset classes]], and broad [[index-investing|index funds]] usually include listed property already. Before buying a REIT or property fund, ask:
- What does it own, where, and who are the tenants?
- How much does it borrow, and when does the debt fall due?
- Does it trade at a premium or a discount to NAV, and why?
- What does it cost to hold, and how are its dividends taxed where you live?
- If it is an unlisted fund, how quickly can it really pay you out?
`,
  ideas: [
    'A REIT is a listed company or trust owning income-producing property, paying most of its income as dividends.',
    'Dividend yield and the premium or discount to NAV describe its price.',
    'Listed property is liquid but moves with the stock market, often more than building valuations.',
    'REITs borrow, so their NAV moves by the property change divided by one minus the debt share.',
    'Open-ended property funds can suspend redemptions when too many investors want out.'
  ],
  pitfalls: [
    'A REIT is as steady as the buildings it owns — Its share price is set daily by the market and amplified by borrowing; in 2007–2009 US REITs lost about two-thirds of their value.',
    'A property fund with daily dealing can always pay me out — Buildings take months to sell; several funds have suspended redemptions in stressed markets.',
    'A discount to NAV is free money — It may mean the market expects valuations to fall, or doubts the managers.'
  ],
  formulas: [
    {
      name: 'Dividend yield of a REIT',
      expr: 'y = D/P', tex: 'y = \\frac{D}{P}',
      vars: {
        y: { name: 'dividend yield', q: 'ratio', unit: '%' },
        D: { name: 'dividends per share per year', q: 'money', unit: '$', value: 1.1 },
        P: { name: 'share price', q: 'money', unit: '$', value: 20 }
      },
      practice: { unknowns: ['y', 'P'] },
      stories: {
        y: 'A REIT share costs {P} and pays {D} a year in dividends. What is its yield?',
        P: 'A REIT pays {D} a year per share. At what price would it yield {y}?'
      }
    },
    {
      name: 'Premium or discount to net asset value',
      expr: 'd = P/N - 1', tex: 'd = \\frac{P}{N} - 1',
      vars: {
        d: { name: 'premium (+) or discount (−)', q: 'ratio', unit: '%', signed: true },
        P: { name: 'share price', q: 'money', unit: '$', value: 20 },
        N: { name: 'net asset value per share', q: 'money', unit: '$', value: 25 }
      },
      practice: { unknowns: ['d', 'N'] },
      stories: {
        d: 'A REIT trades at {P} a share; its buildings less its debts are valued at {N} a share. What is its premium or discount?',
        N: 'A REIT trades at {P}, a premium or discount of {d} to its NAV. What is the NAV per share?'
      }
    },
    {
      name: 'NAV change of a geared property company',
      expr: 'dE = dV/(1 - g)', tex: '\\Delta E = \\frac{\\Delta V}{1 - g}',
      vars: {
        dE: { name: 'change in net asset value', q: 'ratio', unit: '%', signed: true, tex: '\\Delta E' },
        dV: { name: 'change in property values', q: 'ratio', unit: '%', value: -10, signed: true, min: -100, max: 100, tex: '\\Delta V' },
        g: { name: 'debt as a share of the property', q: 'ratio', unit: '%', value: 40, min: 0, max: 95 }
      },
      practice: { unknowns: ['dE', 'dV'] },
      stories: {
        dE: 'A REIT finances {g} of its property with debt. Its buildings change in value by {dV}. By how much does its NAV change?',
        dV: 'A REIT with debt of {g} of its property reports a NAV change of {dE}. How much did its buildings change in value?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a REIT\'s price',
      q: 'A REIT trades at ¤20 a share, pays ¤1.10 a year, and reports a NAV of ¤25 a share. Find its yield and its discount.',
      steps: [
        'Yield: $1.10/20 = 5.5\\,\\%$.',
        'Discount: $20/25 - 1 = -20\\,\\%$.',
        'At the valuers\' figures each ¤1 invested buys $25/20 = ¤1.25$ of property net of debt.'
      ],
      a: 'A 5.5 % yield at a 20 % discount to NAV.'
    },
    {
      title: 'Gearing in a downturn',
      q: 'A REIT owns ¤100 of property per share, financed by ¤40 of debt and ¤60 of equity. Property values fall 10 %. What happens to its NAV?',
      steps: [
        'Property: ¤90. Debt: still ¤40. Equity: $90 - 40 = ¤50$.',
        'Change: $50/60 - 1 = -16.7\\,\\%$, or $-10\\,\\% / (1 - 0.4)$.'
      ],
      a: 'The NAV falls 16.7 % for a 10 % fall in the buildings.'
    }
  ],
  quiz: [
    { q: 'A REIT share costs ¤40 and pays ¤2 a year. What is its dividend yield, in per cent?', answer: 5,
      why: '$2/40 = 0.05$: 5 %.' },
    { q: 'Why did listed REITs fall far more than building valuations in 2007–2009?', choices: ['REITs own worse buildings', 'they are priced daily by the market and carry debt, while valuations are infrequent and smoothed', 'their dividends were cut to zero', 'they were not allowed to sell buildings'], a: 1,
      why: 'Market prices react at once and debt amplifies the move; appraisals lag behind and move gently.' },
    { q: 'An open-ended property fund can always pay investors out on the day they ask.', a: false,
      why: 'Its buildings take months to sell. When many investors leave at once such funds suspend dealing, as several did in the UK in 2016 and 2020.' },
    { q: 'A REIT finances 40 % of its property with debt. Property values rise 10 %. Its NAV rises by about…', choices: ['10 %', '14 %', '16.7 %', '25 %'], a: 2,
      why: '$10\\,\\%/(1 - 0.4) = 16.7\\,\\%$: gearing works upwards too.' },
    { q: 'A REIT trades at a 20 % discount to its NAV. This means…', choices: ['its share price is 20 % below the latest value of its property less its debts', 'its buildings are worth 20 % less than last year', 'it is financed with 20 % debt', 'its dividend has been cut by 20 %'], a: 0,
      why: 'The discount compares the market price with the reported net asset value per share; it may signal a bargain or an expected fall in valuations.' }
  ],
  applications: ['Adding property to a portfolio without buying a building.', 'Reading yields and NAV discounts before buying a REIT.', 'Checking the liquidity terms of an unlisted property fund.', 'Understanding why listed property moves with the stock market.'],
  history: 'The US Congress created REITs in 1960 so that ordinary investors could own large commercial property the way they owned shares. Australia\'s listed property trusts, the Netherlands and others followed; the idea spread widely after 2000, with Japan in 2001, the UK and Germany in 2007 and many more since.'
}

);
