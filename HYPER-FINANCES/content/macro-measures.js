/* HYPER-FINANCES · content/macro-measures.js — Measuring the economy: GDP, inflation and
 * the price index, unemployment, and the business cycle. Simulations in sims/macro.js. */
Hyper.add(

/* ================================================================ GDP */
{
  id: 'gdp', parent: 'macro-measures', title: 'GDP: the size of an economy', level: 1,
  short: 'Gross domestic product is the market value of all the final goods and services produced in a country in a year or a quarter. It can be counted as spending, as production or as income — three views of the same flow — and "growth" in the news means its change after removing inflation.',
  keywords: ['GDP', 'gross domestic product', 'national income', 'economic growth', 'C + I + G + NX', 'consumption', 'investment', 'government spending', 'net exports', 'value added', 'real GDP', 'nominal GDP', 'GDP deflator', 'GDP per capita', 'purchasing-power parity', 'PPP', 'GNI', 'national accounts'],
  prereq: ['what-is-money', 'real-vs-nominal', 'math:percentages'],
  related: ['inflation-cpi', 'business-cycle', 'recessions', 'trade-balance', 'fiscal-policy', 'compound-interest', 'math:exponential-growth-decay'],
  body: `
When the news says "the economy grew 2 % last year", the thing that grew is **gross domestic product**: the market value of all the *final* goods and services produced inside a country in a year. It adds up the haircut, the new flat, the laptop, the bus ride, the operation and the software, each at the price it sold for — one number for millions of people and billions of transactions.

### Counting each thing once
A farmer sells wheat to a miller for ¤100; the miller sells the flour to a baker for ¤250; the baker sells the bread for ¤600. Adding every sale gives ¤950, which counts the wheat three times. GDP counts only the **final** sale, ¤600 — or, equivalently, the **value added** at each stage: ¤100 by the farmer, ¤150 by the miller, ¤350 by the baker. The same ¤600 is also the **income** the chain paid out as wages, rent, interest and profit. Production, spending and income are three views of one flow, so statisticians measure all three and cross-check them.

### Who buys the output
The spending view splits GDP by buyer:

$$Y = C + I + G + (X - M)$$

- $C$, **consumption**: households' food, rent, clothes, holidays and services — the largest part, from about two-fifths of GDP in some fast-investing economies to two-thirds or more in others.
- $I$, **investment**: firms' machines, buildings and software, *new* homes, and changes in inventories. Buying shares is not investment in this sense: it only changes who owns something.
- $G$, **government purchases**: teachers, roads, defence. Pensions and benefits are *transfers*; they appear in $C$ when the recipients spend them.
- $X - M$, **net exports**. Imports are subtracted because they are already inside $C$, $I$ and $G$ but were produced abroad: an imported car raises $C$ and $M$ equally and leaves GDP unchanged.

With consumption ¤1,200 bn, investment ¤400 bn, government ¤350 bn, exports ¤500 bn and imports ¤450 bn, GDP is ¤2,000 bn: 60 % consumption, 20 % investment, 17.5 % government, 2.5 % net exports.

### Nominal and real
If GDP in current prices rises 7 % while prices rise 4 %, the economy did not produce 7 % more. **Nominal GDP** uses each year's prices; **real GDP** values every year's output at one base year's prices, so only quantities change. The ratio is the **GDP deflator**, a price index of everything produced:

$$Y_{real} = \\frac{100\\,Y_{nom}}{D}$$

Nominal ¤2,140 bn with a deflator of 104 is real ¤2,057.7 bn — growth of 2.88 % from ¤2,000 bn, a little less than the quick 7 − 4 = 3. The headline growth rate is always the real one.

### Per person, and over time
What says something about living standards is **GDP per person**: ¤2,000 bn shared by 40 million people is ¤50,000 each. If GDP grows 3 % and the population 1 %, output per person grows about 2 %. International comparisons convert at **purchasing-power parity**, because a haircut costs far less in some countries than in others.

Growth compounds [[compound-interest|like interest]]: at 2 % a year real GDP doubles in 35 years, at 3 % in 23.4. After 30 years, 3 % growth leaves an economy 34 % larger than 2 % growth would.

> [!key] GDP measures how much an economy produces — the best single yardstick of output, and a poor one of how well people live.

### What it leaves out
Unpaid work at home, leisure, the running-down of forests and fisheries, pollution, and how income is shared: GDP per person can rise while the typical household's income stands still, and rebuilding after a flood *adds* to GDP. **Gross national income** adjusts for income crossing borders; in Ireland, where multinational profits inflate GDP, statisticians publish a modified GNI because GDP overstates what residents earn.

### What it means for you
GDP growth is the tide under jobs, pay, tax revenue and company profits. When real GDP shrinks for a while, unemployment rises ([[recessions]]); steady growth usually brings hiring and pay rises. First estimates appear within weeks and are revised for years — one weak quarter in the headlines is a reason for attention, not alarm.
`,
  ideas: [
    'GDP is the market value of final goods and services produced in a country in a period — each thing counted once, as value added.',
    'Spending, production and income are three measurements of the same total: Y = C + I + G + X − M.',
    'Imports are subtracted only because they were already counted in C, I or G; they do not reduce GDP by themselves.',
    'Real GDP removes price changes with the deflator; the growth rate in the news is real growth.',
    'Living standards follow real GDP per person, and a one-point difference in growth compounds into a large gap over decades.'
  ],
  pitfalls: [
    'Imports lower GDP — An imported good bought here adds to consumption and to imports equally; GDP is unchanged. Imports only look negative in the formula because the other terms include them.',
    'Nominal growth is growth — If prices rose 4 % and nominal GDP 7 %, output grew about 2.9 %. Always ask whether a figure is real or nominal.',
    'A larger GDP means people are better off — Only per person and in real terms, and even then GDP ignores leisure, unpaid work, the environment and how income is shared.'
  ],
  formulas: [
    {
      name: 'GDP by expenditure',
      expr: 'Y = C + I + G + X - M', tex: 'Y = C + I + G + (X - M)',
      vars: {
        Y: { name: 'gross domestic product', q: 'money', unit: '$bn' },
        C: { name: 'household consumption', q: 'money', unit: '$bn', value: 1200 },
        I: { name: 'investment', q: 'money', unit: '$bn', value: 400 },
        G: { name: 'government purchases', q: 'money', unit: '$bn', value: 350 },
        X: { name: 'exports', q: 'money', unit: '$bn', value: 500 },
        M: { name: 'imports', q: 'money', unit: '$bn', value: 450 }
      },
      note: 'Transfers such as pensions are not in $G$ (they show up in $C$ when spent); second-hand goods and financial assets are not in $I$.',
      practice: { unknowns: ['Y', 'C', 'M'] },
      stories: {
        Y: 'Households spend {C}, firms invest {I}, the government buys {G}; exports are {X} and imports {M}. What is GDP?',
        C: 'GDP is {Y}. Investment is {I}, government purchases {G}, exports {X} and imports {M}. How much did households spend?',
        M: 'GDP is {Y}, with consumption {C}, investment {I}, government purchases {G} and exports {X}. How much was imported?'
      }
    },
    {
      name: 'Real GDP from nominal GDP and the deflator',
      expr: 'R = 100*N/D', tex: 'Y_{real} = \\frac{100\\,Y_{nom}}{D}',
      vars: {
        R: { name: 'real GDP (base-year prices)', q: 'money', unit: '$bn', tex: 'Y_{real}' },
        N: { name: 'nominal GDP (current prices)', q: 'money', unit: '$bn', value: 2140, tex: 'Y_{nom}' },
        D: { name: 'GDP deflator (base year = 100)', value: 104 }
      },
      note: 'The deflator is 100 in the base year; 104 means prices of everything produced are 4 % above the base year.',
      stories: {
        R: 'Nominal GDP is {N} and the deflator stands at {D}. What is real GDP in base-year prices?',
        D: 'Nominal GDP is {N}; in base-year prices the same output is worth {R}. What is the deflator?'
      }
    },
    {
      name: 'Real growth from nominal growth and inflation',
      expr: 'g = (1 + n)/(1 + d) - 1', tex: 'g = \\frac{1 + g_N}{1 + \\pi} - 1',
      vars: {
        g: { name: 'real growth', q: 'ratio', unit: '%', signed: true },
        n: { name: 'nominal GDP growth', q: 'ratio', unit: '%', value: 7, signed: true, min: -50, max: 200, tex: 'g_N' },
        d: { name: 'change in the deflator (inflation)', q: 'ratio', unit: '%', value: 4, signed: true, min: -50, max: 200, tex: '\\pi' }
      },
      note: 'For small rates $g \\approx g_N - \\pi$; the exact form matters when inflation is high.',
      stories: {
        g: 'Nominal GDP grew {n} and the deflator rose {d}. What was real growth?',
        d: 'Nominal GDP grew {n} while real GDP grew {g}. How much did prices rise?'
      }
    },
    {
      name: 'GDP after years of steady growth',
      expr: 'Y = Y0*(1 + g)^t', tex: 'Y = Y_0\\,(1 + g)^t',
      vars: {
        Y: { name: 'real GDP after t years', q: 'money', unit: '$bn' },
        Y0: { name: 'real GDP today', q: 'money', unit: '$bn', value: 2000 },
        g: { name: 'real growth per year', q: 'ratio', unit: '%', value: 2.5, min: -20, max: 30 },
        t: { name: 'years', q: 'years', unit: 'yr', value: 10 }
      },
      note: 'Solve for $t$ to see how long growth takes to double an economy: about 70 divided by the growth rate in per cent.',
      practice: { unknowns: ['Y', 't', 'g'] },
      stories: {
        Y: 'An economy of {Y0} grows {g} a year for {t}. How large is it at the end?',
        t: 'An economy of {Y0} grows {g} a year. How long until it reaches {Y}?',
        g: 'An economy grew from {Y0} to {Y} in {t}. What was its average yearly growth?'
      }
    }
  ],
  examples: [
    {
      title: 'Three ways to count the same bread',
      q: 'Wheat is sold for ¤100 to a miller, flour for ¤250 to a baker, bread for ¤600 to customers. The baker pays ¤200 in wages and the miller ¤80. Count the chain\'s contribution to GDP by production, by spending and by income.',
      steps: [
        'Production (value added): farmer ¤100, miller $250 - 100 = ¤150$, baker $600 - 250 = ¤350$; total ¤600.',
        'Spending: only the final sale to consumers counts: ¤600. Adding all sales (¤950) would count the wheat three times.',
        'Income: the baker\'s ¤350 of value added pays ¤200 of wages and leaves ¤150 of profit; the miller\'s ¤150 pays ¤80 of wages and ¤70 of profit; the farmer\'s ¤100 is the farmer\'s income. Total: $200 + 150 + 80 + 70 + 100 = ¤600$.'
      ],
      a: 'All three methods give ¤600.'
    },
    {
      title: 'Is the economy really growing?',
      q: 'Nominal GDP rose from ¤2,000 bn to ¤2,140 bn in a year, and the deflator from 100 to 104. The population grew from 40.0 to 40.4 million. Find real growth and the change in real GDP per person.',
      steps: [
        'Real GDP this year: $2{,}140 \\times 100/104 = ¤2{,}057.7$ bn. Real growth: $2{,}057.7/2{,}000 - 1 = 2.88\\%$ (not 7 %).',
        'Real GDP per person: last year $¤2{,}000$ bn $/ 40.0$ m $= ¤50{,}000$; this year $¤2{,}057.7$ bn $/ 40.4$ m $= ¤50{,}933$.',
        'Change per person: $50{,}933/50{,}000 - 1 = 1.87\\%$ — about real growth minus population growth.'
      ],
      a: 'Real growth 2.88 %; real GDP per person up 1.87 %.'
    }
  ],
  quiz: [
    { q: 'A family buys a new car, made abroad, directly from the foreign factory for ¤30,000. What happens to this country\'s GDP?', choices: ['it rises by ¤30,000', 'it falls by ¤30,000', 'it does not change', 'it depends on the exchange rate'], a: 2,
      why: 'Consumption rises by ¤30,000 and imports by ¤30,000, so GDP is unchanged: nothing was produced here. Bought through a local dealer, the dealer\'s margin and preparation would be domestic value added and would count.' },
    { q: 'Consumption ¤700 bn, investment ¤200 bn, government purchases ¤250 bn, exports ¤300 bn, imports ¤350 bn. What is GDP (in ¤ bn)?', answer: 1100, unit: '$bn',
      why: '$700 + 200 + 250 + 300 - 350 = 1{,}100$. Net exports are negative here (−¤50 bn), which is common and not in itself a problem.' },
    { q: 'Nominal GDP rose 5 % and the GDP deflator rose 5 %: the economy produced 5 % more.', a: false,
      why: 'All of the nominal increase was higher prices: real growth is $1.05/1.05 - 1 = 0$.' },
    { q: 'Which of these is counted in this year\'s GDP?', choices: ['a pension paid to a retiree', 'a house built in 1990 and sold this year', 'a house built this year', 'shares bought on the stock exchange'], a: 2,
      why: 'Only new production counts. Pensions are transfers (counted when spent), an old house was counted when it was built (the agent\'s fee is counted), and shares are claims on existing firms.' },
    { q: 'Real GDP grows 3 % in a year and the population 1 %. By roughly what percentage does real GDP per person grow?', answer: 1.98, unit: '%',
      why: '$1.03/1.01 - 1 = 1.98\\%$, close to the quick answer $3 - 1 = 2$.' }
  ],
  applications: ['Reading growth figures in the news: real or nominal, total or per person.', 'Judging whether a country\'s debt or deficit is large — both are measured against GDP.', 'Understanding why jobs and wages follow the economy\'s output.', 'Comparing living standards between countries with purchasing-power parity.'],
  history: 'Modern national accounts were built in the 1930s and 1940s — by Simon Kuznets in the United States and by Richard Stone and James Meade in Britain — first to measure the collapse of the Great Depression, then to plan wartime production. Kuznets himself cautioned that national income is not a measure of welfare. The United Nations system of national accounts now sets common rules, and GDP replaced GNP as the headline figure in most countries by the early 1990s.',
  sim: 'mac-gdp'
},

/* ================================================================ INFLATION AND THE CPI */
{
  id: 'inflation-cpi', parent: 'macro-measures', title: 'Inflation and the price index', level: 1,
  short: 'Inflation is the rate at which prices in general rise. It is measured by pricing the same basket of goods and services month after month: the consumer price index is the basket\'s cost relative to a base period, and inflation is the index\'s percentage change.',
  keywords: ['inflation', 'CPI', 'consumer price index', 'price index', 'basket', 'weights', 'cost of living', 'core inflation', 'headline inflation', 'deflation', 'disinflation', 'HICP', 'PCE', 'Laspeyres index', 'substitution bias', 'quality adjustment', 'indexation', 'inflation target'],
  prereq: ['inflation-purchasing-power', 'real-vs-nominal', 'math:percentages'],
  related: ['gdp', 'monetary-policy', 'central-banks', 'hyperinflation', 'index-linked-mortgages', 'inflation-linked-bonds', 'math:exponential-growth-decay'],
  body: `
Nobody buys "prices in general". You buy bread, rent, bus tickets and haircuts, and each changes by its own amount. To turn thousands of price changes into one number, statisticians price a fixed **basket** — the goods and services a typical household buys, in the quantities it buys them. If the basket cost ¤2,000 a month in the base period and the same things cost ¤2,067 today, the price level is 3.35 % higher. That is the **consumer price index**:

$$\\text{CPI} = 100 \\times \\frac{\\text{cost of the basket today}}{\\text{cost of the basket in the base period}}$$

and **inflation** is the index's percentage change, usually over twelve months: $\\pi = \\text{CPI}_{now}/\\text{CPI}_{year\\ ago} - 1$.

### A basket, worked through
| Item | Base-year spending | Price change | Same things today |
|---|---:|---:|---:|
| Food | ¤400 | +6 % | ¤424 |
| Housing | ¤1,000 | +4 % | ¤1,040 |
| Transport | ¤300 | −2 % | ¤294 |
| Everything else | ¤300 | +3 % | ¤309 |
| **Total** | **¤2,000** | | **¤2,067** |

The index is 103.35. Inflation is a **weighted average** of the price changes, each weighted by its share of spending: $0.2 \\times 6 + 0.5 \\times 4 + 0.15 \\times (-2) + 0.15 \\times 3 = 3.35\\%$. Housing is half this basket, so its 4 % counts for half. The weights come from large household-spending surveys and are updated every year or so.

### Your inflation is not the average
A retired homeowner who spends 40 % on food, 45 % on housing costs and little on transport faced 4.4 % in the same year; a commuter with a large fuel bill faced less. The official index describes an average household nobody quite is. Countries also treat housing differently: the US index includes an estimate of what owners would pay to rent their own homes, the euro area's harmonised index leaves owner-occupied housing out, and the UK publishes indices with and without it. Each answers a slightly different question.

### Headline, core, and what is hard to measure
**Core inflation** leaves out food and energy, whose prices swing with harvests and wars, to show the underlying trend. At the edges measurement is genuinely hard. When a phone doubles in power at the same price, part of that is counted as a price fall (**quality adjustment**). When beef gets dear and people switch to chicken, a fixed basket overstates the rise in the cost of living (**substitution bias**). A US commission estimated in 1996 that the index then overstated inflation by about one percentage point a year, and methods were changed.

Two words are often confused: **deflation** is falling prices; **disinflation** is inflation slowing — prices still rising, only more slowly.

### Small rates, long times
Inflation compounds like interest, working against cash. At 2 % a year prices double in 35 years. At 3 %, ¤10,000 kept in cash for ten years buys what ¤7,441 buys today. A monthly rate of 0.3 % sounds tiny; it is 3.66 % a year.

> [!note] Many central banks aim for about 2 % a year: low enough that money keeps its value across a working life, high enough to stay clear of deflation, when interest-rate cuts run into their limit at zero.

### Two eras
After the oil shocks of 1973 and 1979 inflation reached double digits across much of the world — above 20 % in the UK in 1975 and around 14 % in the US in 1980. From the mid-1990s to 2020 it stayed near 2 %, or below, in most rich countries — Japan spent years close to deflation. Then in 2021–22, with economies reopening after the pandemic and energy prices jumping after the invasion of Ukraine, it reached roughly 9 % in the US and above 10 % in the euro area and the UK, the highest in about four decades, before falling back in 2023–24.

### What it means for you
Inflation is the benchmark every sum of money has to beat: a savings rate below it loses purchasing power ([[real-vs-nominal|real against nominal]]), and a pay rise below it is a pay cut. It also moves the price of borrowing — central banks raise rates when inflation runs above target, which changes the payment on a [[variable-rate-mortgages|variable-rate mortgage]] and, where they exist, the balance of an [[index-linked-mortgages|inflation-linked]] one. That is why pensions, some wages, tax brackets and [[inflation-linked-bonds|inflation-linked bonds]] are tied to the CPI. The [inflation calculator](#/tools/money/inflation) shows what a sum will buy after any number of years.
`,
  ideas: [
    'A price index prices a fixed basket over time; inflation is the percentage change of the index.',
    'Inflation is a weighted average of price changes, each weighted by its share of household spending.',
    'Your personal inflation depends on your own basket and can differ a lot from the official figure.',
    'Core inflation leaves out volatile food and energy to show the underlying trend.',
    'Small yearly rates compound: at 2 % prices double in about 35 years.'
  ],
  pitfalls: [
    'Lower inflation means lower prices — Falling inflation (disinflation) means prices rise more slowly; only deflation lowers them. Prices rarely return to where they were.',
    'The official inflation rate is my cost of living — It is an average basket. A renter, a retiree or a long-distance commuter can face a rate a point or two away from it.',
    'A rise from 2 % to 3 % inflation is a 1 % rise — It is one percentage point, and a 50 % increase in the rate. Mixing the two is a common way numbers are made to sound bigger or smaller.'
  ],
  formulas: [
    {
      name: 'Price index from a basket',
      expr: 'I = 100*Cn/C0', tex: 'I = 100\\,\\frac{C_n}{C_0}',
      vars: {
        I: { name: 'price index (base period = 100)' },
        Cn: { name: 'cost of the basket now', q: 'money', unit: '$', value: 2067 },
        C0: { name: 'cost of the same basket in the base period', q: 'money', unit: '$', value: 2000 }
      },
      stories: {
        I: 'A basket that cost {C0} in the base year costs {Cn} now. What is the price index?',
        Cn: 'The price index is {I}. The basket cost {C0} in the base year. What does it cost now?'
      }
    },
    {
      name: 'Inflation from two index values',
      expr: 'p = I1/I0 - 1', tex: '\\pi = \\frac{I_1}{I_0} - 1',
      vars: {
        p: { name: 'inflation over the period', q: 'ratio', unit: '%', signed: true, tex: '\\pi' },
        I1: { name: 'index now', value: 123.1 },
        I0: { name: 'index a year ago', value: 118.4 }
      },
      note: 'Divide the indices; do not subtract them. A move from 118.4 to 123.1 is 4.7 index points but 3.97 %.',
      stories: {
        p: 'The consumer price index was {I0} a year ago and is {I1} today. What was inflation?',
        I1: 'The index was {I0} a year ago and inflation over the year was {p}. What is the index now?'
      }
    },
    {
      name: 'What a sum will buy after inflation',
      expr: 'V = A/(1 + p)^t', tex: 'V = \\frac{A}{(1 + \\pi)^t}',
      vars: {
        V: { name: 'value in today\'s money', q: 'money', unit: '$' },
        A: { name: 'amount of money', q: 'money', unit: '$', value: 10000 },
        p: { name: 'yearly inflation', q: 'ratio', unit: '%', value: 3, min: -20, max: 1000, tex: '\\pi' },
        t: { name: 'years', q: 'years', unit: 'yr', value: 10 }
      },
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'You keep {A} in cash for {t} while inflation runs at {p} a year. What will it buy, in today\'s money?',
        t: 'At {p} inflation, how long until {A} buys only what {V} buys today?'
      }
    },
    {
      name: 'From a monthly rate to a yearly rate',
      expr: 'a = (1 + m)^12 - 1', tex: '\\pi_{year} = (1 + \\pi_{month})^{12} - 1',
      vars: {
        a: { name: 'inflation over twelve months', q: 'ratio', unit: '%', signed: true, tex: '\\pi_{year}' },
        m: { name: 'inflation in one month', q: 'ratio', unit: '%', value: 0.3, signed: true, min: -50, max: 1000, tex: '\\pi_{month}' }
      },
      note: 'Monthly figures compound. If the same monthly rate continued for a year, this is the yearly rate it would add up to.',
      stories: { a: 'Prices rose {m} last month. If that pace held for a year, what would yearly inflation be?', m: 'Yearly inflation of {a} corresponds to what steady monthly rate?' }
    }
  ],
  examples: [
    {
      title: 'Inflation from a household basket',
      q: 'A basket has food ¤400, housing ¤1,000, transport ¤300 and other items ¤300 a month. Over a year food prices rise 6 %, housing 4 %, transport falls 2 % and other prices rise 3 %. Find the index and inflation, and inflation for a retiree whose spending is 40 % food, 45 % housing, 5 % transport and 10 % other.',
      steps: [
        'Cost of the same basket now: $424 + 1{,}040 + 294 + 309 = ¤2{,}067$. Index: $100 \\times 2{,}067/2{,}000 = 103.35$; inflation 3.35 %.',
        'The same as a weighted average: weights $0.2, 0.5, 0.15, 0.15$; $0.2(6) + 0.5(4) + 0.15(-2) + 0.15(3) = 3.35\\%$.',
        'The retiree: $0.4(6) + 0.45(4) + 0.05(-2) + 0.1(3) = 2.4 + 1.8 - 0.1 + 0.3 = 4.4\\%$.'
      ],
      a: 'Index 103.35, inflation 3.35 %; the retiree\'s own inflation is 4.4 %.'
    },
    {
      title: 'Reading a monthly release',
      q: 'The index rose from 118.4 to 123.1 over twelve months, and by 0.3 % in the latest month. What is the yearly inflation rate, and what would the latest month add up to over a year?',
      steps: [
        'Twelve-month inflation: $123.1/118.4 - 1 = 3.97\\%$ (the index rose 4.7 points, which is not the same thing).',
        'Latest month at a yearly pace: $1.003^{12} - 1 = 3.66\\%$.',
        'One month is noisy — a sale season or a fuel price jump moves it — so statisticians also publish three-month and seasonally adjusted figures.'
      ],
      a: '3.97 % over the year; the latest month runs at 3.66 % a year.'
    }
  ],
  quiz: [
    { q: 'Inflation falls from 6 % to 3 %. Prices are now…', choices: ['falling', 'rising, but more slowly', 'back to where they were', 'rising faster'], a: 1,
      why: 'Inflation is the speed of price rises. At 3 % prices still rise, just half as fast; only negative inflation (deflation) lowers them.' },
    { q: 'The consumer price index was 150 a year ago and is 156 today. What was inflation (in %)?', answer: 4, unit: '%',
      why: '$156/150 - 1 = 4\\%$. The index rose 6 points, but inflation is the percentage change.' },
    { q: 'Rent is 30 % of the index basket and rises 10 %; all other prices stay the same. What is inflation?', choices: ['10 %', '3 %', '30 %', '0.3 %'], a: 1,
      why: 'A weighted average: $0.3 \\times 10\\% + 0.7 \\times 0 = 3\\%$.' },
    { q: 'If official inflation is 3 %, your own cost of living rose 3 %.', a: false,
      why: 'The index uses average spending weights. Your own inflation depends on your basket — how much rent, fuel, food or health care you buy.' },
    { q: 'At 4 % inflation a year, what will ¤1,000 in cash buy after 10 years, in today\'s money?', answer: 675.56, unit: '$',
      why: '$1{,}000/1.04^{10} = ¤675.56$: a third of its purchasing power gone.' }
  ],
  applications: ['Checking whether a savings rate or a pay rise beats inflation.', 'Understanding inflation-linked pensions, wages, bonds and mortgages.', 'Reading the monthly inflation release: headline, core, monthly and yearly.', 'Working out your own inflation from your own spending.'],
  sim: 'mac-cpi'
},

/* ================================================================ UNEMPLOYMENT */
{
  id: 'unemployment', parent: 'macro-measures', title: 'Unemployment', level: 1,
  short: 'The unemployed are people without a job who are available and actively looking for one. The unemployment rate is their share of the labour force — those working or looking — and it rises in a downturn mostly because the unemployed take longer to find work.',
  keywords: ['unemployment', 'unemployment rate', 'jobless', 'labour force', 'labor force', 'participation rate', 'employment rate', 'discouraged workers', 'frictional unemployment', 'structural unemployment', 'cyclical unemployment', 'natural rate', 'NAIRU', 'job-finding rate', 'separation rate', 'hysteresis', 'ILO'],
  prereq: ['gdp', 'math:percentages', 'math:fractions-ratios'],
  related: ['business-cycle', 'recessions', 'emergency-fund', 'monetary-policy', 'fiscal-policy', 'life-disability-insurance'],
  body: `
Losing a job is one of the most feared events in economic life, and the unemployment rate is the number that tracks how often it happens. It is defined more carefully than the word suggests.

### Who counts
Statistical offices follow the International Labour Organization's definitions and survey households every month or quarter. Everyone of working age falls into one of three groups:
- **employed**: did at least an hour of paid work in the survey week, or has a job and was temporarily away;
- **unemployed**: has no job, is available to start, and has actively looked for work in the past few weeks;
- **outside the labour force**: everyone else — students, retirees, people caring for family, and people who would like work but have stopped looking.

The **labour force** is the employed plus the unemployed:

$$u = \\frac{U}{E + U}, \\qquad \\text{participation} = \\frac{E + U}{\\text{working-age population}}$$

With 50 million people of working age, 30.4 million employed and 1.6 million unemployed, the labour force is 32 million, the unemployment rate 5 % and participation 64 %.

### The discouraged-worker trap
Now 400,000 of the unemployed give up searching. Nobody found a job, yet the rate falls to 3.8 %, because they left the labour force. That is why economists also watch the **employment rate** — employed ÷ working-age population, here 60.8 % — and broader measures that count discouraged workers and people stuck in part-time jobs.

### A bath with the tap and the drain open
The number of unemployed is a stock fed by flows. Each month a fraction $s$ of workers lose or leave their jobs (the **separation rate**) and a fraction $f$ of the unemployed find one (the **job-finding rate**). The level settles where inflow equals outflow, $s\\,(1-u) = f\\,u$:

$$u^* = \\frac{s}{s + f}$$

If 1.5 % of workers separate each month and 25 % of the unemployed find work, $u^* = 5.7\\%$ and the average spell lasts $1/f = 4$ months. In a recession separations rise and hiring freezes: at $s = 2\\%$ and $f = 18\\%$ the rate heads for 10 %, and spells stretch to 5.6 months. The flows are large and fast — the gap to the new level halves in about two months — so the rate itself mostly tracks the job-finding rate, the drain that slows in bad times.

### Three kinds
- **Frictional**: the normal time between jobs while people search for a good match. Some of it is healthy.
- **Structural**: skills or places that no longer match the jobs on offer — a mining region after the pits close, a trade replaced by software.
- **Cyclical**: the extra unemployment of a [[business-cycle|downturn]], when demand for goods, and so for workers, falls.

The rate with no cyclical part is the **natural rate** (or NAIRU, the rate below which inflation tends to rise). It is estimated, not observed, and it differs between countries with their labour laws, benefits and demography. Far below it, employers bid up wages; far above it for long, skills and confidence erode and long spells make the next job harder to get (economists call this *hysteresis*).

### History
In the Great Depression US unemployment reached about 25 % in 1933. In the euro crisis Spain and Greece passed 25 % in 2012–13, with more than half of young people in the labour force out of work. In the spring of 2020 US unemployment jumped from 3.5 % to about 15 % within two months as the pandemic closed businesses — and then fell back far faster than after any earlier recession, because most of the laid-off workers were recalled to the same employers.

### What it means for you
Unemployment risk is uneven: it rises most for the young, the less experienced and people in cyclical industries such as construction and manufacturing. A typical spell lasts months rather than weeks, and longer in a recession — which is what an [[emergency-fund]] is sized for. A few months of costs set aside turns a lost job from a crisis into a hard but manageable stretch.
`,
  ideas: [
    'The unemployed have no job, are available, and are actively looking; people not looking are outside the labour force.',
    'The unemployment rate is U ÷ (E + U): it can fall because people stop looking, not only because they find work.',
    'Unemployment is a stock fed by flows; it settles at s ÷ (s + f), set by separations and job finding.',
    'In downturns the job-finding rate falls and spells lengthen — that drives much of the rise in unemployment.',
    'Frictional, structural and cyclical unemployment have different causes and different remedies.'
  ],
  pitfalls: [
    'Everyone without a job is unemployed — Only those available and actively looking. Students, retirees and discouraged workers are outside the labour force.',
    'A falling unemployment rate always means more jobs — It can fall because people give up looking. Check the employment rate as well.',
    'Unemployment rises in recessions mainly because of mass lay-offs — Lay-offs do rise, but in most downturns the larger effect is that the unemployed take much longer to find work.'
  ],
  formulas: [
    {
      name: 'Unemployment rate',
      expr: 'u = U/(E + U)', tex: 'u = \\frac{U}{E + U}',
      vars: {
        u: { name: 'unemployment rate', q: 'ratio', unit: '%' },
        U: { name: 'unemployed (millions)', value: 1.6 },
        E: { name: 'employed (millions)', value: 30.4 }
      },
      stories: {
        u: 'A survey finds {E} million people employed and {U} million unemployed. What is the unemployment rate?',
        U: 'With {E} million employed, the unemployment rate is {u}. How many millions are unemployed?'
      }
    },
    {
      name: 'Participation rate',
      expr: 'r = (E + U)/N', tex: 'p = \\frac{E + U}{N}',
      vars: {
        r: { name: 'participation rate', q: 'ratio', unit: '%', tex: 'p' },
        E: { name: 'employed (millions)', value: 30.4 },
        U: { name: 'unemployed (millions)', value: 1.6 },
        N: { name: 'working-age population (millions)', value: 50 }
      },
      stories: { r: 'Of {N} million people of working age, {E} million are employed and {U} million unemployed. What is the participation rate?' }
    },
    {
      name: 'Steady-state unemployment from the flows',
      expr: 'u = s/(s + f)', tex: 'u^* = \\frac{s}{s + f}',
      vars: {
        u: { name: 'steady-state unemployment rate', q: 'ratio', unit: '%', tex: 'u^*' },
        s: { name: 'separation rate (share of workers losing or leaving jobs each month)', q: 'ratio', unit: '%', value: 1.5, max: 100 },
        f: { name: 'job-finding rate (share of the unemployed finding work each month)', q: 'ratio', unit: '%', value: 25, max: 100 }
      },
      note: 'Where inflow $s(1-u)$ equals outflow $fu$. The average spell of unemployment lasts about $1/f$ months.',
      stories: {
        u: 'Each month {s} of workers lose their jobs and {f} of the unemployed find one. Where does unemployment settle?',
        f: 'Separations run at {s} a month and unemployment has settled at {u}. What share of the unemployed find work each month?'
      }
    }
  ],
  examples: [
    {
      title: 'Reading a labour-force survey',
      q: 'Working-age population 50 million; employed 30.4 million; unemployed 1.6 million. Find the unemployment, participation and employment rates. Then 0.4 million of the unemployed stop looking. Recompute.',
      steps: [
        'Labour force $30.4 + 1.6 = 32$ m. Unemployment $1.6/32 = 5\\%$; participation $32/50 = 64\\%$; employment rate $30.4/50 = 60.8\\%$.',
        'After 0.4 m give up: unemployed 1.2 m, labour force 31.6 m. Unemployment $1.2/31.6 = 3.8\\%$; participation 63.2 %.',
        'The employment rate is still 60.8 %: nobody found a job. The fall in the headline rate is an illusion of who counts as looking.'
      ],
      a: '5 %, 64 %, 60.8 %; afterwards 3.8 %, 63.2 % and still 60.8 %.'
    },
    {
      title: 'The bath: where unemployment settles',
      q: 'In normal times 1.5 % of workers separate each month and 25 % of the unemployed find work. In a recession the rates become 2 % and 18 %. Find both steady states and the typical spell, and how fast the rate adjusts.',
      steps: [
        'Normal: $u^* = 0.015/(0.015 + 0.25) = 5.66\\%$; average spell $1/0.25 = 4$ months.',
        'Recession: $u^* = 0.02/(0.02 + 0.18) = 10\\%$; spell $1/0.18 = 5.6$ months.',
        'Each month the gap between the actual and the steady-state rate shrinks by the factor $1 - s - f = 0.735$, so it halves in $\\ln 0.5/\\ln 0.735 = 2.25$ months.'
      ],
      a: '5.7 % normally and 10 % in the recession; spells of 4 and 5.6 months; the rate adjusts within a few months.'
    }
  ],
  quiz: [
    { q: 'A full-time student who is not looking for work is…', choices: ['unemployed', 'employed', 'outside the labour force', 'a discouraged worker'], a: 2,
      why: 'To be unemployed you must be available and actively looking. The student is outside the labour force and does not enter the rate at all.' },
    { q: 'A country has 19 million employed and 1 million unemployed. What is the unemployment rate (in %)?', answer: 5, unit: '%',
      why: '$1/(19 + 1) = 5\\%$ — divide by the labour force, not by the employed.' },
    { q: 'The unemployment rate can fall even though no unemployed person has found a job.', a: true,
      why: 'If unemployed people stop looking they leave the labour force; the numerator falls faster than the denominator.' },
    { q: 'Each month 1 % of workers lose their jobs and 30 % of the unemployed find one. Where does unemployment settle (in %)?', answer: 3.23, unit: '%',
      why: '$u^* = 0.01/(0.01 + 0.30) = 3.23\\%$.' },
    { q: 'In a typical recession, the biggest reason unemployment stays high is that…', choices: ['more people enter the labour force', 'the unemployed take longer to find jobs', 'wages rise', 'people retire early'], a: 1,
      why: 'Separations rise, but the job-finding rate falls sharply as firms stop hiring; spells lengthen and the stock of unemployed builds up.' }
  ],
  applications: ['Reading monthly labour-market reports, including the employment and participation rates.', 'Sizing an emergency fund to the length of a typical unemployment spell.', 'Understanding why central banks watch unemployment when they set interest rates.', 'Judging job security in cyclical and non-cyclical industries.'],
  sim: { id: 'mac-cycle', params: { focus: 'jobs' } }
},

/* ================================================================ THE BUSINESS CYCLE */
{
  id: 'business-cycle', parent: 'macro-measures', title: 'The business cycle', level: 2,
  short: 'Economies do not grow in a straight line: output swings above and below its long-run trend in expansions and contractions of irregular length. The output gap measures how far the economy is from its potential, and unemployment and inflation move with it.',
  keywords: ['business cycle', 'economic cycle', 'boom and bust', 'expansion', 'contraction', 'recession', 'peak', 'trough', 'recovery', 'output gap', 'potential output', 'Okun\'s law', 'leading indicators', 'soft landing', 'overheating', 'NBER', 'real business cycle', 'Minsky'],
  prereq: ['gdp', 'unemployment', 'inflation-cpi'],
  related: ['recessions', 'monetary-policy', 'fiscal-policy', 'bubbles', 'yield-curve', 'bull-bear-markets', 'financial-crises'],
  body: `
Real GDP in most countries has grown by a few per cent a year over the long run — but never smoothly. It runs ahead of the trend for a few years, stalls, falls back and recovers. These swings are the **business cycle**, and they are why jobs are easy to find one year and scarce two years later, why profits and share prices lurch, and why central banks move interest rates.

### The phases
- **Expansion**: output, jobs and incomes grow; unemployment falls; firms invest and credit grows.
- **Peak**: the economy runs hot — factories near capacity, vacancies hard to fill, wages and prices rising faster.
- **Contraction**: output and employment fall; firms cut investment and run down stocks. A deep, broad and lasting one is a [[recessions|recession]].
- **Trough** and **recovery**: growth resumes, though regaining the old path can take years.

"Cycle" misleads a little: the swings are not regular like a pendulum's. In the US, where a committee of the National Bureau of Economic Research dates them, expansions between 1945 and 2020 lasted about five years on average and contractions about ten months. The longest expansion ran nearly eleven years, from June 2009 to February 2020; the shortest recession lasted two months, in the spring of 2020. A common shorthand calls two consecutive quarters of falling real GDP a recession; the official committees in the US and the euro area weigh jobs, incomes and sales as well.

### The output gap
Behind the swings is **potential output** $Y^*$: what the economy could produce with its workers, machines and know-how fully but sustainably employed. It grows slowly and smoothly with the workforce and productivity. The **output gap** measures where actual output stands against it:

$$\\text{gap} = \\frac{Y}{Y^*} - 1$$

Output of ¤1,940 bn against a potential of ¤2,000 bn is a gap of −3 %: ¤60 bn of goods and services that could have been produced this year and were not, with idle workers and machines behind them. A positive gap means demand pushing beyond capacity — **overheating** — and inflation tends to rise.

Unemployment moves with the gap. Arthur Okun noticed in the 1960s that in the US each point of output below potential came with roughly half a point of extra unemployment (the ratio differs between countries and decades):

$$u \\approx u^* - k \\cdot \\text{gap}, \\qquad k \\approx 0.5$$

With a natural rate of 5 % and a gap of −3 %, unemployment is about 6.5 %. It also **lags**: firms wait to trust a recovery before hiring, so unemployment often peaks after output has begun to grow.

### Why economies cycle — the schools
Economists agree on the pattern and argue about the causes:
- **Keynesians** stress swings in demand — confidence, investment and credit — amplified because wages and prices adjust slowly, and see a role for policy in filling the gap.
- **Monetarists**, led by Milton Friedman, blamed unstable money: many downturns followed a monetary squeeze, the Great Depression above all.
- **Real business cycle** theory (Kydland and Prescott, 1982) models the swings as efficient responses to changes in productivity, which leaves policy little to do.
- The **Austrian** school and Hyman Minsky, in different ways, trace busts to credit booms that fund investments that cannot pay off — calm years encourage the risk-taking that ends them.

Central-bank models today blend these: shocks to demand, supply and finance, spread through slowly adjusting prices and through credit. Turning points remain hard to forecast, so indicators that move early — new orders, building permits, hours worked, business surveys, an [[yield-curve|inverted yield curve]] — are watched closely.

### What it means for you
The cycle is the reason to plan for bad years in good ones. Job losses, pay freezes and falling share prices tend to arrive together. An [[emergency-fund]], a mortgage payment you could still carry at a higher rate or a lower income, and investments you would not be forced to sell in a slump are defences against the part of the cycle no one can forecast. Share markets often turn before the economy does — falling before a recession is announced and rising while the news is still bad ([[bull-bear-markets]]).
`,
  ideas: [
    'Output swings around a smoothly growing potential in expansions and contractions of irregular length.',
    'The output gap, Y ÷ Y* − 1, measures slack (negative) or overheating (positive).',
    'Okun\'s law: each point of output below potential brings roughly half a point of extra unemployment in the US.',
    'Unemployment lags output; share prices and some surveys tend to lead it.',
    'The schools disagree on the causes — demand, money, productivity, credit — but agree the pattern is real and hard to time.'
  ],
  pitfalls: [
    'Business cycles are regular, so the next recession can be dated — Their length varies from months to more than a decade; forecasters have a poor record at calling turning points.',
    'A growing economy cannot have rising unemployment — If output grows more slowly than potential, the gap widens and unemployment tends to rise.',
    'The recession ends when unemployment peaks — Unemployment usually peaks after output has started to recover.'
  ],
  formulas: [
    {
      name: 'Output gap',
      expr: 'x = Y/Ys - 1', tex: '\\text{gap} = \\frac{Y}{Y^*} - 1',
      vars: {
        x: { name: 'output gap', q: 'ratio', unit: '%', signed: true, tex: '\\text{gap}' },
        Y: { name: 'actual real GDP', q: 'money', unit: '$bn', value: 1940 },
        Ys: { name: 'potential real GDP', q: 'money', unit: '$bn', value: 2000, tex: 'Y^*' }
      },
      stories: {
        x: 'Real output is {Y} while potential output is estimated at {Ys}. What is the output gap?',
        Ys: 'Output is {Y} and the output gap is {x}. What is potential output?'
      }
    },
    {
      name: 'Okun\'s law (level form)',
      expr: 'u = un - k*x', tex: 'u = u^* - k\\cdot\\text{gap}',
      vars: {
        u: { name: 'unemployment rate', q: 'ratio', unit: '%' },
        un: { name: 'natural rate of unemployment', q: 'ratio', unit: '%', value: 5, tex: 'u^*' },
        k: { name: 'Okun coefficient', value: 0.5 },
        x: { name: 'output gap', q: 'ratio', unit: '%', value: -3, signed: true, min: -30, max: 30, tex: '\\text{gap}' }
      },
      note: 'A rule of thumb fitted to data, not a law of nature; $k$ is around 0.5 for the US and differs elsewhere.',
      stories: {
        u: 'The natural rate is {un}, the output gap {x}, and the Okun coefficient {k}. What unemployment rate does Okun\'s law suggest?',
        x: 'Unemployment is {u} against a natural rate of {un}; the Okun coefficient is {k}. What output gap does that suggest?'
      }
    },
    {
      name: 'Okun\'s law (growth form)',
      expr: 'du = -k*(g - gs)', tex: '\\Delta u = -k\\,(g - g^*)',
      vars: {
        du: { name: 'change in unemployment over the year', q: 'ratio', unit: '%', signed: true, tex: '\\Delta u' },
        k: { name: 'Okun coefficient', value: 0.5 },
        g: { name: 'real GDP growth', q: 'ratio', unit: '%', value: 0.5, signed: true, min: -30, max: 30 },
        gs: { name: 'growth of potential output', q: 'ratio', unit: '%', value: 2, signed: true, min: -10, max: 15, tex: 'g^*' }
      },
      note: 'Growing more slowly than potential raises unemployment even while GDP grows.',
      stories: { du: 'Potential output grows {gs} a year but the economy grows only {g}. With an Okun coefficient of {k}, how much does unemployment change?' }
    }
  ],
  examples: [
    {
      title: 'The gap and the jobs',
      q: 'Potential output is ¤2,000 bn and actual output ¤1,940 bn. The natural rate of unemployment is 5 % and the Okun coefficient 0.5. Estimate unemployment and the output lost this year.',
      steps: [
        'Gap: $1{,}940/2{,}000 - 1 = -3\\%$.',
        'Okun: $u \\approx 5\\% - 0.5 \\times (-3\\%) = 6.5\\%$.',
        'Output lost: $0.03 \\times ¤2{,}000$ bn $= ¤60$ bn of goods and services not produced this year.'
      ],
      a: 'A −3 % gap: unemployment about 6.5 %, and ¤60 bn of lost output.'
    },
    {
      title: 'Growing, and still losing jobs',
      q: 'Potential grows 2 % a year. The economy grows 0.5 % this year. What happens to unemployment, by the growth form of Okun\'s law with $k = 0.5$?',
      steps: [
        'Growth falls short of potential by $0.5 - 2 = -1.5$ points.',
        '$\\Delta u = -0.5 \\times (-1.5) = +0.75$ points.',
        'GDP rose, yet unemployment climbs about three-quarters of a point: the workforce and productivity grew faster than demand.'
      ],
      a: 'Unemployment rises by about 0.75 percentage points.'
    }
  ],
  quiz: [
    { q: 'The economy grows 1 % a year while potential output grows 2 %. What happens to the output gap?', choices: ['it becomes more negative', 'it becomes more positive', 'it stays the same because output is growing', 'it disappears'], a: 0,
      why: 'Actual output falls further behind potential every year it grows more slowly than potential.' },
    { q: 'Output is ¤980 bn against a potential of ¤1,000 bn, the natural rate is 4 % and the Okun coefficient 0.5. What unemployment rate (in %) does Okun\'s law suggest?', answer: 5, unit: '%',
      why: 'The gap is −2 %, so $u \\approx 4\\% + 0.5 \\times 2\\% = 5\\%$.' },
    { q: 'Unemployment usually peaks at the same moment output hits its lowest point.', a: false,
      why: 'Unemployment lags: firms wait to trust the recovery before hiring, so the jobless rate often peaks months after the trough in output.' },
    { q: 'Which of these tends to move before the economy turns?', choices: ['the unemployment rate', 'new orders and building permits', 'last year\'s GDP', 'the average length of unemployment spells'], a: 1,
      why: 'Orders and permits are decisions about future production, so they lead. Unemployment and spell length lag; last year\'s GDP is history.' },
    { q: 'Which school sees business cycles mainly as efficient responses to changes in productivity?', choices: ['Keynesian', 'monetarist', 'real business cycle', 'Austrian'], a: 2,
      why: 'Real business cycle models treat the swings as the economy\'s best response to technology shocks. Keynesians stress demand, monetarists money, Austrians credit-fuelled malinvestment.' }
  ],
  applications: ['Reading the news about "slowdowns", "soft landings" and "overheating".', 'Planning a household budget and emergency fund for the bad part of the cycle.', 'Understanding why central banks raise rates in booms and cut them in slumps.', 'Seeing why share prices often recover before the economy does.'],
  sim: 'mac-cycle'
}

);
