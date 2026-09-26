/* HYPER-CHEMISTRY · content/rates.js — how fast reactions go: measuring rate,
 * rate laws and reaction orders, the method of initial rates, the integrated rate
 * laws and half-lives. */
Hyper.add(

{
  id: 'reaction-rate', parent: 'rates', title: 'Reaction rate', level: 1,
  short: 'How fast reactants are used up or products appear: the change in concentration per unit time, divided by the coefficient in the equation so that every species gives the same number.',
  keywords: ['reaction rate', 'rate of reaction', 'average rate', 'instantaneous rate', 'initial rate', 'tangent', 'M/s', 'mol/(L·s)', 'rate of disappearance', 'rate of appearance', 'kinetics', 'measuring rates', 'factors affecting rate'],
  prereq: ['chemical-equations', 'molarity', 'math:derivative'],
  related: ['rate-laws', 'collision-theory', 'catalysis', 'beer-lambert', 'physics:speed-velocity'],
  body: `
Some reactions are over in a flash — a precipitate appears the instant two solutions meet, an explosion finishes in microseconds — while others take hours (an egg boiling), years (iron rusting) or geological ages (diamond turning to graphite). **Kinetics** is the study of how fast, and why. [[gibbs-energy|Thermodynamics]] says whether a reaction can go; kinetics says how long you will wait.

### Defining the rate
Rate is a change per unit time, like speed. For a reaction in solution the natural measure is concentration: how fast $[\\ce{A}]$ falls or $[\\ce{P}]$ rises, in mol/L per second (M/s). But different species change at different speeds. In

$$\\ce{2N2O5(g) -> 4NO2(g) + O2(g)}$$

nitrogen dioxide appears four times as fast as oxygen, and twice as fast as N₂O₅ disappears. To get one number for the reaction, divide by the coefficients (and put a minus sign on reactants, which decrease):

$$r = -\\frac{1}{2}\\frac{d[\\ce{N2O5}]}{dt} = \\frac{1}{4}\\frac{d[\\ce{NO2}]}{dt} = \\frac{d[\\ce{O2}]}{dt}$$

### Average and instantaneous rate
Over a finite interval, $\\Delta[\\ce{A}]/\\Delta t$ gives an **average rate** — the slope of the chord on a graph of concentration against time. Most reactions slow down as reactants are used up, so the average depends on the interval. The **instantaneous rate** is the slope of the tangent at one moment, the [[math:derivative|derivative]] $d[\\ce{A}]/dt$. The tangent at $t = 0$ gives the **initial rate**, the quantity used to find [[rate-laws|rate laws]], because at the start nothing has been used up and no products are in the way.

### How rates are measured
Any property that changes with the amount of one species will do, as long as it can be followed faster than the reaction runs:
- **colour**, with a spectrophotometer ([[beer-lambert|absorbance]]): bromine fading, permanganate decolorising, a dye bleaching;
- **gas given off**, collected in a syringe or measured by the loss of mass on a balance (marble chips in acid);
- **pressure**, for gas reactions at constant volume;
- **electrical conductivity**, when ions appear or disappear;
- **pH**, or **quenching** samples at set times and titrating them;
- for very fast reactions, stopped-flow mixing (milliseconds) and laser flash photolysis (down to femtoseconds).

### What changes the rate
Concentration (or pressure), temperature, the surface area of solids, catalysts, light for photochemical reactions, and the solvent. Why each of these works is the subject of [[collision-theory|collision theory]]: particles must meet, and meet hard enough.

> [!tip] A rate is always positive. The minus sign in front of a reactant's $d[\\ce{A}]/dt$ is there precisely because that derivative is negative.
`,
  ideas: [
    'Rate is the change in concentration per unit time, usually in M/s.',
    'Dividing by the stoichiometric coefficient gives one rate for the whole reaction, whichever species is measured.',
    'The instantaneous rate is the slope of the tangent to the concentration–time curve; the initial rate is the tangent at t = 0.',
    'Rates usually fall as a reaction proceeds, because the reactants are being used up.',
    'Any measurable property that tracks one species — colour, gas volume, pressure, conductivity — can follow a rate.'
  ],
  pitfalls: [
    'All species change concentration at the same rate — Only after dividing by the coefficients. In 2N₂O₅ → 4NO₂ + O₂, NO₂ appears twice as fast as N₂O₅ disappears.',
    'A negative rate means the reaction runs backwards — Rates of reaction are defined to be positive; the sign of d[A]/dt only says whether A is being used or made.',
    'The average rate over the whole reaction is the rate at any moment — The rate changes continuously; the average hides the fast start and the slow finish.'
  ],
  formulas: [
    {
      name: 'Average rate of reaction from a reactant',
      expr: 'r = -(A2 - A1)/(a*dt)', tex: 'r = -\\frac{1}{a}\\,\\frac{\\text{[A]}_2 - \\text{[A]}_1}{\\Delta t}',
      vars: {
        r: { name: 'rate of reaction', q: 'reactionrate', unit: 'M/s' },
        A2: { name: 'reactant concentration at the end of the interval', q: 'concentration', unit: 'M', value: 0.0169, tex: '\\text{[A]}_2' },
        A1: { name: 'reactant concentration at the start of the interval', q: 'concentration', unit: 'M', value: 0.02, tex: '\\text{[A]}_1' },
        a: { name: 'coefficient of the reactant', int: true, fixed: true, value: 2 },
        dt: { name: 'time interval', q: 'time', unit: 's', value: 100, tex: '\\Delta t' }
      },
      note: 'Defaults: $[\\ce{N2O5}]$ falls from 0.0200 M to 0.0169 M in 100 s in $\\ce{2N2O5 -> 4NO2 + O2}$. For a product, drop the minus sign.',
      practice: { unknowns: ['r', 'A2'] },
      stories: {
        r: 'In $\\ce{2N2O5 -> 4NO2 + O2}$ the concentration of N₂O₅ falls from {A1} to {A2} in {dt}. What is the average rate of reaction?',
        A2: 'The reaction $\\ce{2N2O5 -> 4NO2 + O2}$ starts with [N₂O₅] = {A1} and runs at an average {r} for {dt}. What is [N₂O₅] at the end?'
      }
    },
    {
      name: 'Rates of two species in the same reaction',
      expr: 'rB = rA*b/a', tex: 'r_B = r_A\\,\\frac{b}{a}',
      vars: {
        rB: { name: 'rate of change of species B', q: 'reactionrate', unit: 'M/s', tex: 'r_B' },
        rA: { name: 'rate of change of species A', q: 'reactionrate', unit: 'M/s', value: 3.1e-5, tex: 'r_A' },
        a: { name: 'coefficient of A', int: true, fixed: true, value: 2 },
        b: { name: 'coefficient of B', int: true, fixed: true, value: 4 }
      },
      note: 'Sizes only (both taken as positive). Defaults: N₂O₅ used at 3.1 × 10⁻⁵ M/s gives NO₂ at twice that.',
      practice: { unknowns: ['rB', 'rA'] },
      stories: {
        rB: 'In $\\ce{2N2O5 -> 4NO2 + O2}$, N₂O₅ disappears at {rA}. How fast does NO₂ appear?',
        rA: 'In $\\ce{2N2O5 -> 4NO2 + O2}$, NO₂ appears at {rB}. How fast is N₂O₅ used up?'
      }
    }
  ],
  examples: [
    {
      title: 'Marble chips in acid',
      q: 'Marble chips react with excess hydrochloric acid, $\\ce{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}$, and the gas is collected in a syringe at 20 °C: 0 mL at 0 s, 42 mL at 30 s, 70 at 60 s, 100 at 120 s, 114 at 180 s, 118 at 240 s, 120 at 300 s. Find the average rate of CO₂ production over the first 30 s and between 120 and 180 s.',
      steps: [
        'First 30 s: $42\\ \\mathrm{mL}/30\\ \\mathrm{s} = 1.4$ mL/s. At 24.0 L/mol that is $1.4/24\\,000 = 5.8\\times10^{-5}$ mol/s.',
        '120–180 s: $(114 - 100)/60 = 0.23$ mL/s, six times slower.',
        'The rate falls because the acid concentration and the chips\' surface both shrink as they are consumed; the curve flattens when the acid (or the marble) runs out at 120 mL.'
      ],
      a: '1.4 mL/s at first, 0.23 mL/s later: the reaction slows as the reactants are used up.'
    },
    {
      title: 'Ammonia and its reactants',
      q: 'In the Haber synthesis $\\ce{N2 + 3H2 -> 2NH3}$, ammonia forms at $4.0 \\times 10^{-4}$ M/s. How fast are nitrogen and hydrogen consumed, and what is the rate of reaction?',
      steps: [
        'Rate of reaction $r = \\tfrac12 \\times 4.0\\times10^{-4} = 2.0\\times10^{-4}$ M/s.',
        'Nitrogen: $-d[\\ce{N2}]/dt = 1 \\times r = 2.0\\times10^{-4}$ M/s.',
        'Hydrogen: $-d[\\ce{H2}]/dt = 3 \\times r = 6.0\\times10^{-4}$ M/s.'
      ],
      a: 'N₂ at 2.0 × 10⁻⁴ M/s, H₂ at 6.0 × 10⁻⁴ M/s; r = 2.0 × 10⁻⁴ M/s.'
    }
  ],
  quiz: [
    { q: 'In $\\ce{2NO + O2 -> 2NO2}$, oxygen is consumed at 0.010 M/s. How fast does NO₂ form?', choices: ['0.005 M/s', '0.010 M/s', '0.020 M/s', '0.040 M/s'], a: 2,
      why: 'Two NO₂ form for every O₂ used, so NO₂ appears twice as fast as O₂ disappears.' },
    { q: 'On a graph of [A] against time, the instantaneous rate at a moment is given by…', choices: ['the value of [A] at that moment', 'the slope of the tangent there (with a minus sign for a reactant)', 'the area under the curve up to that moment', 'the slope of the line from the start to that point'], a: 1,
      why: 'The instantaneous rate is the derivative d[A]/dt, the slope of the tangent. The line from the start gives an average rate.' },
    { q: 'For most reactions, the rate is highest at the start.', a: true,
      why: 'The reactant concentrations are highest at the start. Exceptions exist — autocatalytic reactions speed up as their catalytic product builds up, and exothermic reactions can speed up as they heat themselves.' },
    { q: 'A solution\'s bromine concentration falls from 0.0120 M to 0.0101 M in 50 s. What is the average rate of disappearance of bromine, in M/s?', answer: 3.8e-5, unit: 'M/s',
      why: '$(0.0120 - 0.0101)/50 = 0.0019/50 = 3.8\\times10^{-5}$ M/s.' }
  ],
  sim: { id: 'tk-orders', params: { order: 1 } },
  applications: ['Designing chemical reactors: residence time and throughput depend on rate.', 'Shelf-life of foods and medicines.', 'Atmospheric chemistry: how long pollutants survive.', 'Setting and curing times of adhesives, concrete and resins.'],
  history: 'Ludwig Wilhelmy made the first quantitative rate measurement in 1850, following the inversion of sucrose in acid with a polarimeter; Augustus Harcourt and William Esson studied the rates of permanganate and peroxide reactions systematically in the 1860s.'
},

{
  id: 'rate-laws', parent: 'rates', title: 'Rate laws and reaction order', level: 2,
  short: 'A rate law says how the rate depends on concentrations: rate = k[A]^m[B]^n. The orders m and n must be measured — they are not the coefficients of the equation — and the rate constant k carries all the rest, including the effect of temperature.',
  keywords: ['rate law', 'rate equation', 'rate constant', 'reaction order', 'order with respect to', 'overall order', 'zero order', 'first order', 'second order', 'third order', 'units of k', 'pseudo-first-order'],
  prereq: ['reaction-rate', 'molarity', 'math:exponents'],
  related: ['initial-rates', 'integrated-rate-laws', 'reaction-mechanisms', 'arrhenius-equation', 'enzyme-kinetics'],
  body: `
More reactant usually means faster reaction, but *how much* faster varies from one reaction to another. The **rate law** (or rate equation) captures it:

$$\\text{rate} = k\\,[\\ce{A}]^m\\,[\\ce{B}]^n$$

The exponents $m$ and $n$ are the **orders** with respect to A and B; their sum is the **overall order**. The **rate constant** $k$ does not depend on concentration, but it does depend strongly on temperature ([[arrhenius-equation|Arrhenius]]) and on any catalyst.

### What an order means
| Order in A | Double [A] and the rate… | Triple [A] and the rate… |
|---|---|---|
| 0 | stays the same | stays the same |
| 1 | doubles | triples |
| 2 | quadruples | ×9 |
| 3 | ×8 | ×27 |

**Zero order** looks strange but is common when something else is the bottleneck: a catalyst surface whose sites are all occupied, an enzyme saturated with substrate. The liver removes alcohol at a nearly constant rate, about 0.1–0.2 g of ethanol per litre of blood per hour, however much has been drunk, because its alcohol dehydrogenase is saturated.

### Orders come from experiment, not the equation
This is the single most important point about rate laws. The balanced equation tells you what reacts overall; it does not tell you how the reaction happens. Some measured rate laws:

| Reaction | Rate law |
|---|---|
| $\\ce{2N2O5 -> 4NO2 + O2}$ | $k[\\ce{N2O5}]$ |
| $\\ce{NO2 + CO -> NO + CO2}$ (below 225 °C) | $k[\\ce{NO2}]^2$ |
| $\\ce{2NO + O2 -> 2NO2}$ | $k[\\ce{NO}]^2[\\ce{O2}]$ |
| $\\ce{CH3CHO -> CH4 + CO}$ | $k[\\ce{CH3CHO}]^{3/2}$ |
| $\\ce{(CH3)3CBr + OH- -> (CH3)3COH + Br-}$ | $k[\\ce{(CH3)3CBr}]$ |

The coefficient 2 on N₂O₅ does not make it second order; the CO in the second reaction does not appear at all; fractional orders exist. The orders reflect the [[reaction-mechanisms|mechanism]] — the actual sequence of molecular steps — and especially its slowest step. They are found by experiments such as the [[initial-rates|method of initial rates]] or by fitting [[integrated-rate-laws|integrated rate laws]].

### Units of k
Rate is always M/s, so $k$ takes whatever units make the equation balance: $\\mathrm{M^{1-n}\\,s^{-1}}$ for overall order $n$.
- zero order: M/s; first order: 1/s; second order: 1/(M·s); third order: 1/(M²·s).

The units of a quoted $k$ therefore tell you the overall order.

### Real consequences
Nitric oxide from a car exhaust is oxidised to brown, toxic NO₂ by $\\ce{2NO + O2 -> 2NO2}$, second order in NO with $k \\approx 7\\times10^{3}$ M⁻²s⁻¹. Inside the hot, concentrated exhaust the conversion takes minutes; at 1 ppm in open air it takes days, because halving [NO] quarters the rate. In the city, other faster routes (ozone, radicals) take over.

> [!tip] **Pseudo-first-order.** If B is in large excess, [B] hardly changes, so $k[\\ce{B}]^n$ acts as a constant $k'$ and the reaction behaves as first order in A. This is how complicated rate laws are taken apart one reactant at a time.
`,
  ideas: [
    'Rate = k[A]^m[B]^n: the orders m, n describe how strongly each concentration matters.',
    'Orders are found by experiment; they are generally not the coefficients of the balanced equation.',
    'Doubling a concentration multiplies the rate by 2^m: ×1, ×2, ×4 for orders 0, 1, 2.',
    'The units of k depend on the overall order: M^(1−n) s⁻¹.',
    'k is independent of concentration but depends strongly on temperature and on catalysts.'
  ],
  pitfalls: [
    'The orders are the coefficients in the balanced equation — Only for a single elementary step. 2N₂O₅ → 4NO₂ + O₂ is first order in N₂O₅.',
    'A reactant that does not appear in the rate law does not react — It reacts, but after the slow step: CO in NO₂ + CO is consumed at the same rate as NO₂ without affecting how fast.',
    'k changes as the reaction proceeds — Concentrations change; k stays constant at constant temperature. That is why it is called the rate constant.'
  ],
  formulas: [
    {
      name: 'First-order rate law',
      expr: 'r = k*A', tex: 'r = k\\,\\text{[A]}',
      vars: {
        r: { name: 'rate', q: 'reactionrate', unit: 'M/s' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/s', value: 6.7e-4 },
        A: { name: 'concentration of A', q: 'concentration', unit: 'M', value: 0.05, tex: '\\text{[A]}' }
      },
      note: 'Defaults: cyclopropane isomerising to propene at 500 °C.',
      practice: { unknowns: ['r', 'k'] },
      stories: {
        r: 'Cyclopropane isomerises to propene with k = {k}. What is the rate when its concentration is {A}?',
        k: 'A first-order reaction runs at {r} when [A] = {A}. What is the rate constant?'
      }
    },
    {
      name: 'Second-order rate law',
      expr: 'r = k*A*B', tex: 'r = k\\,\\text{[A]}\\,\\text{[B]}',
      vars: {
        r: { name: 'rate', q: 'reactionrate', unit: 'M/s' },
        k: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·s)', value: 0.11 },
        A: { name: 'concentration of A', q: 'concentration', unit: 'M', value: 0.02, tex: '\\text{[A]}' },
        B: { name: 'concentration of B', q: 'concentration', unit: 'M', value: 0.03, tex: '\\text{[B]}' }
      },
      note: 'Defaults: ethyl ethanoate hydrolysed by hydroxide ions at 25 °C, first order in each.',
      practice: { unknowns: ['r', 'k', 'B'] },
      stories: {
        r: 'Ethyl ethanoate ({A}) reacts with hydroxide ({B}) with k = {k}. What is the initial rate?',
        k: 'With [ester] = {A} and [OH⁻] = {B} the rate is {r}. What is the rate constant?',
        B: 'An ester at {A} reacts with hydroxide (k = {k}). What hydroxide concentration gives a rate of {r}?'
      }
    },
    {
      name: 'Changing one concentration',
      expr: 'r2 = r1*(c2/c1)^m', tex: 'r_2 = r_1\\left(\\frac{c_2}{c_1}\\right)^m',
      vars: {
        r2: { name: 'new rate', q: 'reactionrate', unit: 'M/s', tex: 'r_2' },
        r1: { name: 'original rate', q: 'reactionrate', unit: 'M/s', value: 2.0e-4, tex: 'r_1' },
        c2: { name: 'new concentration of the reactant', q: 'concentration', unit: 'M', value: 0.3, tex: 'c_2' },
        c1: { name: 'original concentration of the reactant', q: 'concentration', unit: 'M', value: 0.1, tex: 'c_1' },
        m: { name: 'order with respect to that reactant', value: 2, signed: true }
      },
      note: 'All other concentrations and the temperature kept the same. Tripling a second-order reactant makes the reaction nine times faster.',
      practice: { unknowns: ['r2', 'm'] },
      stories: {
        r2: 'A reaction is of order {m} in A and runs at {r1} when [A] = {c1}. How fast does it run at [A] = {c2}?',
        m: 'Raising [A] from {c1} to {c2} changes the rate from {r1} to {r2}. What is the order in A?'
      }
    }
  ],
  examples: [
    {
      title: 'Using a rate law',
      q: 'For $\\ce{2NO + O2 -> 2NO2}$, rate = $k[\\ce{NO}]^2[\\ce{O2}]$. What happens to the rate if [NO] is doubled and [O₂] halved? And if both are tripled?',
      steps: [
        'Doubling [NO] multiplies the rate by $2^2 = 4$; halving [O₂] by $\\tfrac12$. Net: ×2.',
        'Tripling both: $3^2 \\times 3 = 27$ times faster — the overall order is 3.',
        'Compressing a gas mixture to a third of its volume triples every concentration at once, so this reaction speeds up 27-fold: a steep dependence on pressure.'
      ],
      a: '×2 in the first case, ×27 in the second.'
    },
    {
      title: 'The units of k',
      q: 'At a certain temperature the rate of $\\ce{2NO + O2 -> 2NO2}$ is 0.028 M/s when [NO] = 0.020 M and [O₂] = 0.010 M. Find k with its units.',
      steps: [
        '$k = \\dfrac{\\text{rate}}{[\\ce{NO}]^2[\\ce{O2}]} = \\dfrac{0.028}{(0.020)^2(0.010)}$.',
        '$= \\dfrac{0.028}{4.0\\times10^{-6}} = 7.0\\times10^{3}$.',
        'Units: $\\dfrac{\\mathrm{M/s}}{\\mathrm{M^3}} = \\mathrm{M^{-2}\\,s^{-1}}$, as expected for third order overall.'
      ],
      a: 'k = 7.0 × 10³ M⁻² s⁻¹.'
    }
  ],
  quiz: [
    { q: 'A reaction is second order in A. [A] is halved. The rate…', choices: ['halves', 'falls to a quarter', 'doubles', 'is unchanged'], a: 1,
      why: 'Rate ∝ [A]²: $(\\tfrac12)^2 = \\tfrac14$.' },
    { q: 'The rate law for $\\ce{2N2O5 -> 4NO2 + O2}$ must be rate = k[N₂O₅]² because of the coefficient 2.', a: false,
      why: 'Orders are measured, not read from the equation. This reaction is first order in N₂O₅.' },
    { q: 'A rate constant has units of M⁻¹ s⁻¹. What is the overall order?', choices: ['0', '1', '2', '3'], a: 2,
      why: 'For overall order n the units are M^(1−n) s⁻¹; M⁻¹ s⁻¹ means 1 − n = −1, n = 2.' },
    { q: 'Tripling [B] makes a reaction 9 times faster. What is the order in B?', answer: 2,
      why: '$3^m = 9$, so $m = 2$.' },
    { q: 'For $\\ce{NO2 + CO -> NO + CO2}$ below 225 °C, rate = k[NO₂]². Doubling [CO] alone would…', choices: ['double the rate', 'quadruple the rate', 'leave the rate unchanged', 'halve the rate'], a: 2,
      why: 'CO does not appear in the rate law (zero order): it reacts only after the slow step, so adding more does not speed anything up.' }
  ],
  sim: 'tk-initial-rates',
  applications: ['Sizing reactors and predicting conversion in the chemical industry.', 'Air pollution models: how quickly NO turns to NO₂ at different concentrations.', 'Pharmacokinetics: first-order elimination of most drugs, zero-order elimination of alcohol.', 'Identifying reaction mechanisms from measured orders.'],
  history: 'Cato Guldberg and Peter Waage proposed in the 1860s that reaction rates depend on "active masses"; Jacobus van \'t Hoff\'s Études de dynamique chimique (1884) introduced the classification of reactions by order.'
},

{
  id: 'initial-rates', parent: 'rates', title: 'The method of initial rates', level: 2,
  short: 'Find the orders of a rate law by running a reaction several times, changing one starting concentration at a time, and comparing the rates at the very start.',
  keywords: ['method of initial rates', 'initial rate', 'rate law determination', 'order from data', 'isolation method', 'flooding', 'pseudo-first-order', 'clock reaction', 'iodine clock', 'log–log plot'],
  prereq: ['rate-laws', 'reaction-rate', 'math:logarithms'],
  related: ['integrated-rate-laws', 'reaction-mechanisms', 'math:linear-regression'],
  body: `
To find a rate law you need to know how the rate responds to each concentration separately. The cleanest way is to measure the rate **at the very start** of several runs. At $t = 0$ you know every concentration exactly (you made the mixture), no product has built up to interfere or react back, and the reactants have not yet been depleted.

### The procedure
1. Make up a series of mixtures in which **only one** starting concentration changes between two runs, with the temperature held constant.
2. Measure each initial rate: the slope of the concentration–time curve at $t = 0$, or the time for a small, fixed amount of change.
3. Compare pairs of runs. If doubling $[\\ce{A}]_0$ with everything else fixed multiplies the rate by 4, the order in A is 2. In general

$$m = \\frac{\\log(r_2/r_1)}{\\log(c_2/c_1)}$$

4. With the orders known, calculate $k$ from each run and average.

### A worked data set
For $\\ce{2NO + 2H2 -> N2 + 2H2O}$ at a high temperature, a series of runs might give:

| Run | $[\\ce{NO}]_0$ (M) | $[\\ce{H2}]_0$ (M) | initial rate (M/s) |
|---|---|---|---|
| 1 | 0.0050 | 0.0020 | $1.25\\times10^{-5}$ |
| 2 | 0.0100 | 0.0020 | $5.00\\times10^{-5}$ |
| 3 | 0.0100 | 0.0040 | $1.00\\times10^{-4}$ |

Runs 1 → 2: [NO] doubles, the rate quadruples: second order in NO. Runs 2 → 3: [H₂] doubles, the rate doubles: first order in H₂. So rate = $k[\\ce{NO}]^2[\\ce{H2}]$, and from run 1, $k = 1.25\\times10^{-5}/(0.0050^2 \\times 0.0020) = 250\\ \\mathrm{M^{-2}\\,s^{-1}}$. Note that the equation has 2H₂ but the reaction is first order in hydrogen.

### When the ratios are not neat
Real data are noisy, and the order may not be a whole number. Plot $\\log(\\text{rate})$ against $\\log[\\ce{A}]_0$ for several runs: $\\log r = \\log(k[\\ce{B}]^n) + m\\log[\\ce{A}]$ is a straight line whose **slope is the order** — a [[math:linear-regression|least-squares fit]] averages the noise away.

### Clock reactions
Measuring the start of a curve precisely is hard. A **clock reaction** does it for you: a small, fixed amount of a scavenger is added, which removes a product until it runs out, and then a sudden colour appears. In the classic iodine clock, thiosulfate turns iodine back into iodide until it is used up; then iodine meets starch and the solution turns blue-black. The time $t$ to the colour is the time to make a fixed amount of product, so the initial rate is proportional to $1/t$.

### The isolation method
For a reaction with several reactants, flood it with all but one: with B and C at a hundred times the concentration of A, they barely change, and the reaction looks first order (or whatever order it is) in A alone. Repeating for each reactant in turn builds up the full rate law.

> [!warn] Change only one concentration between the runs you compare, and keep the temperature constant to a fraction of a degree: a 1 °C drift changes a typical rate constant by 5–10 %.
`,
  ideas: [
    'At the start of a reaction every concentration is known and products do not yet interfere.',
    'Change one starting concentration at a time: the rate ratio reveals that reactant\'s order.',
    'm = log(r₂/r₁)/log(c₂/c₁); a log–log plot of rate against concentration has slope m.',
    'Clock reactions measure the time for a fixed small change, so rate ∝ 1/time.',
    'Flooding with all reactants but one (isolation) gives pseudo-first-order behaviour that reveals one order at a time.'
  ],
  pitfalls: [
    'Comparing two runs in which two concentrations changed — The effects mix; you cannot tell which reactant caused the change. Choose pairs that differ in one concentration only.',
    'Using the average rate over the whole run as the initial rate — By the end the concentrations have changed; only the slope at t = 0 corresponds to the starting concentrations.',
    'Assuming the order must be 0, 1 or 2 — Fractional and even negative orders occur; round only when the data clearly justify it.'
  ],
  formulas: [
    {
      name: 'Order from two runs',
      expr: 'm = log(r2/r1)/log(c2/c1)', tex: 'm = \\frac{\\log(r_2/r_1)}{\\log(c_2/c_1)}',
      vars: {
        m: { name: 'order with respect to the reactant', signed: true },
        r1: { name: 'initial rate, run 1', q: 'reactionrate', unit: 'M/s', value: 1.25e-5, tex: 'r_1' },
        r2: { name: 'initial rate, run 2', q: 'reactionrate', unit: 'M/s', value: 5.0e-5, tex: 'r_2' },
        c1: { name: 'concentration, run 1', q: 'concentration', unit: 'M', value: 0.005, tex: 'c_1' },
        c2: { name: 'concentration, run 2', q: 'concentration', unit: 'M', value: 0.01, tex: 'c_2' }
      },
      note: 'Every other concentration, and the temperature, must be the same in both runs. Defaults: runs 1 and 2 of the NO + H₂ table.',
      practice: { unknowns: ['m', 'r2'] },
      stories: {
        m: 'Raising [A]₀ from {c1} to {c2} changes the initial rate from {r1} to {r2}. What is the order in A?',
        r2: 'A reaction is of order {m} in A, and its initial rate is {r1} at [A]₀ = {c1}. What is the initial rate at {c2}?'
      }
    },
    {
      name: 'Rate constant from one run',
      expr: 'k = r/(A^m*B^n)', tex: 'k = \\frac{r}{\\text{[A]}^m\\,\\text{[B]}^n}',
      vars: {
        k: { name: 'rate constant (in units of M and s)' },
        r: { name: 'initial rate (M/s)', value: 1.25e-5 },
        A: { name: '[A]₀ (mol/L)', value: 0.005, tex: '\\text{[A]}' },
        m: { name: 'order in A', value: 2 },
        B: { name: '[B]₀ (mol/L)', value: 0.002, tex: '\\text{[B]}' },
        n: { name: 'order in B', value: 1 }
      },
      note: 'Entered as plain numbers in M and M/s, because the units of k depend on the orders: $\\mathrm{M^{1-m-n}\\,s^{-1}}$. Defaults: run 1 of the NO + H₂ table, giving 250 M⁻² s⁻¹.',
      practice: { unknowns: ['k', 'r'] },
      stories: {
        k: 'Rate = k[A]^{m}[B]^{n} (orders {m} and {n}); a run with [A]₀ = {A} M and [B]₀ = {B} M has an initial rate of {r} M/s. What is k?',
        r: 'Rate = k[A]^m[B]^n with k = {k}, orders {m} and {n}. What is the initial rate (M/s) with [A]₀ = {A} M and [B]₀ = {B} M?'
      }
    },
    {
      name: 'Initial rate from a clock reaction',
      expr: 'r = dc/t', tex: 'r = \\frac{\\Delta c}{t}',
      vars: {
        r: { name: 'initial rate', q: 'reactionrate', unit: 'M/s' },
        dc: { name: 'fixed change in concentration marked by the colour', q: 'concentration', unit: 'mM', value: 0.1, tex: '\\Delta c' },
        t: { name: 'time until the colour appears', q: 'time', unit: 's', value: 42 }
      },
      note: 'The scavenger (e.g. thiosulfate) fixes Δc; as long as it is a small fraction of the reactants, the average rate over that time is close to the initial rate.',
      practice: { unknowns: ['r', 't'] },
      stories: {
        r: 'In an iodine clock the blue colour appears after {t}, when {dc} of iodine has formed. What is the initial rate?',
        t: 'An iodine clock forms iodine at {r}. The thiosulfate added removes the first {dc}. When does the solution turn blue?'
      }
    }
  ],
  examples: [
    {
      title: 'Three runs, three unknowns',
      q: 'For $\\ce{A + B -> P}$: run 1 ([A] = 0.10 M, [B] = 0.10 M) gives $2.0\\times10^{-4}$ M/s; run 2 ([A] = 0.20, [B] = 0.10) gives $2.8\\times10^{-4}$ M/s; run 3 ([A] = 0.10, [B] = 0.30) gives $1.8\\times10^{-3}$ M/s. Find the rate law and k.',
      steps: [
        'Order in A (runs 1, 2): $m = \\log(1.4)/\\log(2) = 0.146/0.301 = 0.49 \\approx \\tfrac12$.',
        'Order in B (runs 1, 3): $n = \\log(9)/\\log(3) = 2$.',
        'Rate = $k[\\ce{A}]^{1/2}[\\ce{B}]^2$. From run 1: $k = 2.0\\times10^{-4}/(0.10^{0.5}\\times0.10^2) = 6.3\\times10^{-2}\\ \\mathrm{M^{-3/2}\\,s^{-1}}$.',
        'A half order often means the mechanism begins by splitting a molecule into two fragments in a fast equilibrium.'
      ],
      a: 'Rate = k[A]^½[B]², k ≈ 0.063 M^(−3/2) s⁻¹.'
    }
  ],
  quiz: [
    { q: 'Why are initial rates used rather than rates later in the reaction?', choices: ['initial rates are always faster to measure', 'at t = 0 the concentrations are known exactly and no products interfere', 'k changes during the reaction', 'the rate law applies only at t = 0'], a: 1,
      why: 'Later, the concentrations have changed (and must be measured), products may react back or catalyse, and the reactants may be depleted unevenly.' },
    { q: 'Doubling [A]₀ with [B]₀ fixed leaves the initial rate unchanged. The order in A is…', choices: ['0', '1', '2', 'cannot be told'], a: 0,
      why: '$2^m = 1$ gives $m = 0$: A is involved after the slow step, or something else (a saturated catalyst) limits the rate.' },
    { q: 'In a clock reaction the colour appears after 40 s. With twice the concentration of a first-order reactant, when would you expect it?', answer: 20, unit: 's',
      why: 'First order: twice the concentration, twice the rate. The fixed amount of product is made in half the time, 20 s.' },
    { q: 'On a plot of log(initial rate) against log[A]₀ (all else fixed), the slope equals the order in A.', a: true,
      why: 'log r = log k′ + m log[A]₀, a straight line of slope m.' }
  ],
  sim: 'tk-initial-rates',
  applications: ['Establishing rate laws in research and teaching labs.', 'Enzyme assays, where initial rates at different substrate concentrations give Michaelis–Menten parameters.', 'Testing proposed mechanisms: each mechanism predicts a rate law.', 'Quality control of catalysts by measuring their initial activity.']
},

{
  id: 'integrated-rate-laws', parent: 'rates', title: 'Integrated rate laws', level: 3,
  short: 'Integrating a rate law gives concentration as a function of time: a straight line for zero order, an exponential decay for first order, a hyperbola for second order. Plotting [A], ln[A] or 1/[A] against time shows which one fits.',
  keywords: ['integrated rate law', 'concentration against time', 'zero order', 'first order', 'second order', 'exponential decay', 'ln[A] against t', '1/[A] against t', 'straight-line plot', 'pseudo-first-order', 'first-order kinetics', 'elimination kinetics'],
  prereq: ['rate-laws', 'math:differential-equations-intro', 'math:exponential-growth-decay', 'math:logarithms'],
  related: ['reaction-half-life', 'radioactive-half-life', 'initial-rates', 'math:separable-equations', 'physics:radioactive-decay'],
  body: `
A rate law tells you the *slope* of the concentration curve at each moment. To predict the concentration itself — how much is left after ten minutes, how long until 99 % has reacted — you add up those slopes over time: you integrate. For a reaction $\\ce{A -> products}$ with $-d[\\ce{A}]/dt = k[\\ce{A}]^n$, the three common orders give three different shapes.

### Zero order: a straight line
The rate never changes, so the concentration falls by the same amount every second:

$$[\\ce{A}] = [\\ce{A}]_0 - kt$$

until it hits zero (and the zero-order law breaks down, since something must run out). Plot $[\\ce{A}]$ against $t$: a straight line of slope $-k$.

### First order: exponential decay
The rate is proportional to what is left, so the same *fraction* disappears in each equal time interval:

$$[\\ce{A}] = [\\ce{A}]_0\\,e^{-kt} \\qquad\\Longleftrightarrow\\qquad \\ln[\\ce{A}] = \\ln[\\ce{A}]_0 - kt$$

This is the law of [[physics:radioactive-decay|radioactive decay]], of most drug elimination and of many decompositions. Plot $\\ln[\\ce{A}]$ against $t$: a straight line of slope $-k$. The concentration never quite reaches zero.

### Second order: a slow tail
The rate falls with the *square* of what is left, so the reaction slows down more and more as it goes:

$$\\frac{1}{[\\ce{A}]} = \\frac{1}{[\\ce{A}]_0} + kt$$

Plot $1/[\\ce{A}]$ against $t$: a straight line of slope $+k$. The same law holds for $\\ce{A + B}$ when the two start at equal concentrations.

| Order | Integrated law | Straight-line plot | Slope | Half-life |
|---|---|---|---|---|
| 0 | $[\\ce{A}] = [\\ce{A}]_0 - kt$ | $[\\ce{A}]$ vs $t$ | $-k$ | $[\\ce{A}]_0/2k$ |
| 1 | $\\ln[\\ce{A}] = \\ln[\\ce{A}]_0 - kt$ | $\\ln[\\ce{A}]$ vs $t$ | $-k$ | $\\ln 2/k$ |
| 2 | $1/[\\ce{A}] = 1/[\\ce{A}]_0 + kt$ | $1/[\\ce{A}]$ vs $t$ | $+k$ | $1/(k[\\ce{A}]_0)$ |

### Finding the order from one run
A single experiment that follows [A] over time is often easier than several initial-rate runs. Make all three plots from the same data; **the one that is straight reveals the order**, and its slope gives $k$. The curves can look alike over the first 20 % of reaction, so follow it for at least two or three half-lives before deciding.

### A note on k
Here $k$ belongs to the reactant: $-d[\\ce{A}]/dt = k[\\ce{A}]^n$. If the rate of reaction is defined with the coefficient, $r = -\\frac{1}{a}d[\\ce{A}]/dt$, the constant for A is $a$ times larger. Tables of rate constants say which convention they use; mixing them up is a factor-of-two error in reactions such as $\\ce{2NO2 -> 2NO + O2}$.

> [!note] Pharmacologists live by the first-order law: most drugs are cleared at a rate proportional to their concentration, so each dose decays exponentially, and repeated doses build up to a steady level after about four to five half-lives.
`,
  ideas: [
    'Integrating −d[A]/dt = k[A]^n gives [A] as a function of time.',
    'Zero order: [A] falls linearly. First order: ln[A] falls linearly (exponential decay). Second order: 1/[A] rises linearly.',
    'Plotting [A], ln[A] and 1/[A] against t from one run identifies the order: the straight one wins.',
    'The slope of the straight-line plot gives k (with a sign).',
    'First-order reactions lose the same fraction in equal times; second-order ones slow down ever more.'
  ],
  pitfalls: [
    'A curved plot of [A] against t proves the reaction is first order — Second-order curves are curved too. Only the ln[A] plot being straight shows first order.',
    'Using log₁₀ instead of ln in the first-order law — ln[A] = ln[A]₀ − kt uses natural logarithms. With log₁₀ the slope is −k/2.303.',
    'Deciding the order from the first 10 % of the reaction — Over a short stretch every curve looks straight; follow at least two half-lives.'
  ],
  formulas: [
    {
      name: 'Zero order',
      expr: 'A = A0 - k*t', tex: '\\text{[A]} = \\text{[A]}_0 - kt',
      vars: {
        A: { name: 'concentration at time t', q: 'concentration', unit: 'mM', tex: '\\text{[A]}' },
        A0: { name: 'initial concentration', q: 'concentration', unit: 'mM', value: 1.0, tex: '\\text{[A]}_0' },
        k: { name: 'zero-order rate constant', q: 'reactionrate', unit: 'µM/s', value: 2.0 },
        t: { name: 'time', q: 'time', unit: 'min', value: 5 }
      },
      note: 'Valid only while $[\\ce{A}] > 0$. Defaults: a pollutant removed at a constant 2.0 µM/s on a saturated catalyst surface.',
      practice: { unknowns: ['A', 't'] },
      stories: {
        A: 'A saturated catalyst removes a pollutant at a constant {k}. Starting at {A0}, what is left after {t}?',
        t: 'A zero-order reaction ({k}) starts at {A0}. When does the concentration reach {A}?'
      }
    },
    {
      name: 'First order',
      expr: 'A = A0*exp(-k*t)', tex: '\\text{[A]} = \\text{[A]}_0\\,e^{-kt}',
      vars: {
        A: { name: 'concentration at time t', q: 'concentration', unit: 'M', tex: '\\text{[A]}' },
        A0: { name: 'initial concentration', q: 'concentration', unit: 'M', value: 0.05, tex: '\\text{[A]}_0' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/s', value: 6.7e-4 },
        t: { name: 'time', q: 'time', unit: 's', value: 1000 }
      },
      note: 'Defaults: cyclopropane isomerising to propene at 500 °C.',
      practice: { unknowns: ['A', 't', 'k'] },
      stories: {
        A: 'Cyclopropane ({A0}) isomerises with k = {k}. What concentration remains after {t}?',
        t: 'A first-order reaction has k = {k}. How long does it take for [A] to fall from {A0} to {A}?',
        k: 'In a first-order reaction [A] falls from {A0} to {A} in {t}. What is k?'
      }
    },
    {
      name: 'Second order',
      expr: '1/A = 1/A0 + k*t', tex: '\\frac{1}{\\text{[A]}} = \\frac{1}{\\text{[A]}_0} + kt',
      vars: {
        A: { name: 'concentration at time t', q: 'concentration', unit: 'M', tex: '\\text{[A]}' },
        A0: { name: 'initial concentration', q: 'concentration', unit: 'M', value: 0.02, tex: '\\text{[A]}_0' },
        k: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·s)', value: 0.11 },
        t: { name: 'time', q: 'time', unit: 's', value: 600 }
      },
      note: 'Also valid for $\\ce{A + B}$ with equal starting concentrations. Defaults: ethyl ethanoate and sodium hydroxide, both 0.020 M, at 25 °C.',
      practice: { unknowns: ['A', 't'] },
      stories: {
        A: 'Ethyl ethanoate and hydroxide, both at {A0}, react with k = {k}. What is the ester concentration after {t}?',
        t: 'A second-order reaction (k = {k}) starts at {A0}. How long until [A] = {A}?'
      }
    }
  ],
  derivation: {
    title: 'Integrate the three rate laws',
    steps: [
      { text: 'Zero order: the rate is constant. Integrate both sides from 0 to $t$:', tex: '-\\frac{d[\\ce{A}]}{dt} = k \\;\\Rightarrow\\; [\\ce{A}] - [\\ce{A}]_0 = -kt' },
      { text: 'First order: separate the variables ([[math:separable-equations|separable equation]]) and integrate:', tex: '-\\frac{d[\\ce{A}]}{dt} = k[\\ce{A}] \\;\\Rightarrow\\; \\int_{[\\ce{A}]_0}^{[\\ce{A}]}\\frac{d[\\ce{A}]}{[\\ce{A}]} = -k\\int_0^t dt' },
      { text: 'The integral of $1/x$ is $\\ln x$:', tex: '\\ln\\frac{[\\ce{A}]}{[\\ce{A}]_0} = -kt \\;\\Rightarrow\\; [\\ce{A}] = [\\ce{A}]_0\\,e^{-kt}' },
      { text: 'Second order: separate again; the integral of $1/x^2$ is $-1/x$:', tex: '\\int_{[\\ce{A}]_0}^{[\\ce{A}]}\\frac{d[\\ce{A}]}{[\\ce{A}]^2} = -kt \\;\\Rightarrow\\; \\frac{1}{[\\ce{A}]} - \\frac{1}{[\\ce{A}]_0} = kt' }
    ]
  },
  examples: [
    {
      title: 'Which plot is straight?',
      q: 'Hydrogen peroxide decomposing on a catalyst gives: t = 0, 300, 600, 900, 1200 s; $[\\ce{H2O2}]$ = 0.100, 0.0741, 0.0549, 0.0407, 0.0301 M. Find the order and k.',
      steps: [
        '[A] against t: the drops are 0.0259, 0.0192, 0.0142, 0.0106 per 300 s — shrinking, so not zero order.',
        'ln[A]: −2.303, −2.603, −2.903, −3.203, −3.503 — falling by exactly 0.300 every 300 s. Straight: **first order**.',
        '1/[A]: 10.0, 13.5, 18.2, 24.6, 33.2 — the steps grow, so not second order.',
        'Slope of ln[A]: $-0.300/300\\ \\mathrm{s} = -1.00\\times10^{-3}\\ \\mathrm{s^{-1}}$, so $k = 1.00\\times10^{-3}\\ \\mathrm{s^{-1}}$.'
      ],
      a: 'First order, k = 1.0 × 10⁻³ s⁻¹.'
    },
    {
      title: 'The long tail of a second-order reaction',
      q: 'Ethyl ethanoate and NaOH, both 0.020 M, react with k = 0.11 M⁻¹s⁻¹. How long until half has reacted, and until 90 % has?',
      steps: [
        'Half: $1/0.010 - 1/0.020 = 50 = 0.11\\,t$, so $t = 455$ s (7.6 min).',
        '90 %: $[\\ce{A}] = 0.002$ M; $1/0.002 - 1/0.020 = 450 = 0.11\\,t$, so $t = 4090$ s (68 min).',
        'The second half-life alone takes twice the first, and the last few per cent take longest of all. A first-order reaction would reach 90 % in only 3.3 half-lives.'
      ],
      a: '7.6 min to half, 68 min to 90 %.'
    }
  ],
  quiz: [
    { q: 'For which order is a plot of 1/[A] against t a straight line?', choices: ['zero', 'first', 'second', 'third'], a: 2,
      why: 'Second order: 1/[A] = 1/[A]₀ + kt, a straight line of slope +k.' },
    { q: 'A first-order reaction has k = 0.020 s⁻¹ and [A]₀ = 0.50 M. What is [A] after 60 s, in M?', answer: 0.151, unit: 'M',
      why: '$0.50\\,e^{-0.020\\times60} = 0.50\\,e^{-1.2} = 0.50 \\times 0.301 = 0.151$ M.' },
    { q: 'For a first-order reaction, what is the slope of a graph of ln[A] against time?', choices: ['k', '−k', '1/k', '−k/2.303'], a: 1,
      why: 'ln[A] = ln[A]₀ − kt. (With log₁₀ the slope would be −k/2.303.)' },
    { q: 'A zero-order reaction goes to completion in a finite time; a first-order one never quite does.', a: true,
      why: 'Zero order: [A] reaches 0 at t = [A]₀/k. First order: [A]₀e^(−kt) approaches zero only as t → ∞ (in practice, 10 half-lives leave 0.1 %).' }
  ],
  sim: 'tk-orders',
  applications: ['Drug dosing: concentration–time curves and dosing intervals.', 'Shelf-life prediction for medicines and foods.', 'Radiometric dating (first-order decay).', 'Measuring rate constants from a single run with a spectrophotometer or pressure gauge.']
},

{
  id: 'reaction-half-life', parent: 'rates', title: 'The half-life of a reaction', level: 2,
  short: 'The time for half of a reactant to be used up. For first-order reactions it is a constant, ln 2/k, however much you start with; for zero and second order it depends on the starting concentration.',
  keywords: ['half-life', 't½', 't1/2', 'first-order half-life', 'ln 2/k', 'second-order half-life', 'zero-order half-life', 'drug half-life', 'shelf-life', 't90', 'number of half-lives', 'elimination'],
  prereq: ['integrated-rate-laws', 'math:exponential-growth-decay'],
  related: ['radioactive-half-life', 'rate-laws', 'physics:half-life', 'enzyme-kinetics'],
  body: `
A single number that says how fast a reaction is: the **half-life** $t_{1/2}$, the time for the concentration of a reactant to fall to half its starting value. It is easier to picture than a rate constant — "half gone in 17 minutes" — and for the most common kinetics it has a remarkable property.

### First order: a constant half-life
Put $[\\ce{A}] = [\\ce{A}]_0/2$ into $\\ln([\\ce{A}]/[\\ce{A}]_0) = -kt$:

$$t_{1/2} = \\frac{\\ln 2}{k} = \\frac{0.693}{k}$$

The starting concentration has dropped out. Whether you begin with a mole or a millimole, half is gone after one half-life, three quarters after two, seven eighths after three:

$$\\frac{[\\ce{A}]}{[\\ce{A}]_0} = \\left(\\tfrac12\\right)^{t/t_{1/2}}$$

After 10 half-lives, 0.1 % is left. The same law governs [[radioactive-half-life|radioactive nuclei]], where half-lives range from microseconds to billions of years.

Cyclopropane at 500 °C ($k = 6.7\\times10^{-4}$ s⁻¹) has $t_{1/2} = 17$ min. Caffeine in a healthy adult has a half-life of about 5 hours: of the 100 mg in an afternoon coffee at 3 pm, about 25 mg is still circulating at 1 am. Because the half-life does not depend on the dose, doctors can set dosing intervals from it: a drug taken once every half-life builds up to a steady level about twice a single dose, reached after four or five half-lives.

### Zero and second order: it depends on how much
| Order | $t_{1/2}$ | Successive half-lives |
|---|---|---|
| 0 | $[\\ce{A}]_0/(2k)$ | each one **half** as long as the last |
| 1 | $\\ln 2/k$ | all equal |
| 2 | $1/(k[\\ce{A}]_0)$ | each one **twice** as long as the last |

For a zero-order process the amount lost per unit time is fixed, so a smaller amount goes more quickly. For a second-order one the reaction slows as the partners become scarce: the second half-life takes twice as long as the first, the third four times. **Watching whether successive half-lives stay equal, shrink or grow is a quick test of the order.**

### Shelf-life
Pharmacists care less about half-lives than about the time to lose 10 % of the active ingredient, $t_{90}$. For a first-order decomposition,

$$t_{90} = \\frac{\\ln(10/9)}{k} = \\frac{0.105}{k} \\approx 0.15\\,t_{1/2}$$

A medicine with a two-year $t_{90}$ at 25 °C has a half-life of about 13 years — but the 10 % loss (and any toxic products) is what sets the date on the pack. Storing it cold lowers $k$ and stretches every one of these times ([[arrhenius-equation|Arrhenius]]).
`,
  ideas: [
    'The half-life is the time for a reactant\'s concentration to fall to half its starting value.',
    'For first order, t½ = ln 2/k and is independent of the starting concentration.',
    'After n half-lives a fraction (1/2)ⁿ remains: 10 half-lives leave about 0.1 %.',
    'Zero-order half-lives get shorter as the reaction proceeds; second-order ones get longer.',
    'Constant, shrinking or growing successive half-lives reveal the order.'
  ],
  pitfalls: [
    'After two half-lives the reaction is complete — After two half-lives a quarter remains; each half-life halves what is left.',
    'Every reaction has a fixed half-life — Only first-order reactions do. Second-order half-lives grow as the concentration falls.',
    'A larger dose of a drug takes proportionally longer to clear — For first-order elimination, one half-life removes half of whatever is there; doubling the dose adds only one half-life to the time to fall below a threshold.'
  ],
  formulas: [
    {
      name: 'First-order half-life',
      expr: 't = ln(2)/k', tex: 't_{1/2} = \\frac{\\ln 2}{k}',
      vars: {
        t: { name: 'half-life', q: 'time', unit: 'min', tex: 't_{1/2}' },
        k: { name: 'first-order rate constant', q: 'rate', unit: '1/s', value: 6.7e-4 }
      },
      note: 'Defaults: cyclopropane → propene at 500 °C.',
      practice: { unknowns: ['t', 'k'] },
      stories: {
        t: 'A first-order decomposition has k = {k}. What is its half-life?',
        k: 'A drug is eliminated with a half-life of {t}, by first-order kinetics. What is the elimination rate constant?'
      }
    },
    {
      name: 'Fraction remaining after a time',
      expr: 'f = 0.5^(t/th)', tex: 'f = \\left(\\tfrac12\\right)^{t/t_{1/2}}',
      vars: {
        f: { name: 'fraction remaining, [A]/[A]₀', q: 'ratio', unit: '%' },
        t: { name: 'time elapsed', q: 'time', unit: 'h', value: 10 },
        th: { name: 'half-life', q: 'time', unit: 'h', value: 5, tex: 't_{1/2}' }
      },
      note: 'First-order kinetics only. Defaults: caffeine, half-life about 5 h, ten hours after a coffee.',
      practice: { unknowns: ['f', 't', 'th'] },
      stories: {
        f: 'Caffeine has a half-life of {th} in the body. What fraction of a dose is left after {t}?',
        t: 'A drug has a half-life of {th}. How long until only {f} of a dose remains?',
        th: 'After {t}, {f} of a drug remains in the blood. What is its half-life?'
      }
    },
    {
      name: 'Zero-order half-life',
      expr: 't = A0/(2*k)', tex: 't_{1/2} = \\frac{\\text{[A]}_0}{2k}',
      vars: {
        t: { name: 'half-life', q: 'time', unit: 's', tex: 't_{1/2}' },
        A0: { name: 'initial concentration', q: 'concentration', unit: 'mM', value: 1.0, tex: '\\text{[A]}_0' },
        k: { name: 'zero-order rate constant', q: 'reactionrate', unit: 'µM/s', value: 2.0 }
      },
      practice: { unknowns: ['t'] },
      stories: { t: 'A zero-order reaction with k = {k} starts at {A0}. What is its first half-life?' }
    },
    {
      name: 'Second-order half-life',
      expr: 't = 1/(k*A0)', tex: 't_{1/2} = \\frac{1}{k\\,\\text{[A]}_0}',
      vars: {
        t: { name: 'half-life', q: 'time', unit: 's', tex: 't_{1/2}' },
        k: { name: 'second-order rate constant', q: 'rateconst2', unit: '1/(M·s)', value: 0.11 },
        A0: { name: 'initial concentration', q: 'concentration', unit: 'M', value: 0.02, tex: '\\text{[A]}_0' }
      },
      note: 'Defaults: ethyl ethanoate with an equal concentration of hydroxide at 25 °C.',
      practice: { unknowns: ['t', 'k'] },
      stories: {
        t: 'A second-order reaction has k = {k} and starts at {A0}. What is its first half-life?',
        k: 'A second-order reaction starting at {A0} has a first half-life of {t}. What is k?'
      }
    }
  ],
  derivation: {
    title: 'The half-life of a first-order reaction',
    steps: [
      { text: 'Start from the integrated first-order law:', tex: '\\ln\\frac{[\\ce{A}]}{[\\ce{A}]_0} = -kt' },
      { text: 'At the half-life, $[\\ce{A}] = \\tfrac12[\\ce{A}]_0$, so the ratio is one half whatever $[\\ce{A}]_0$ was:', tex: '\\ln\\tfrac12 = -k\\,t_{1/2}' },
      { text: 'Since $\\ln\\tfrac12 = -\\ln 2$:', tex: 't_{1/2} = \\frac{\\ln 2}{k} \\approx \\frac{0.693}{k}' },
      { text: 'Writing $k = \\ln 2/t_{1/2}$ back into $[\\ce{A}] = [\\ce{A}]_0 e^{-kt}$ gives the half-life form:', tex: '[\\ce{A}] = [\\ce{A}]_0\\,e^{-t\\ln 2/t_{1/2}} = [\\ce{A}]_0\\left(\\tfrac12\\right)^{t/t_{1/2}}' }
    ]
  },
  examples: [
    {
      title: 'An afternoon coffee',
      q: 'A cup of coffee at 3 pm contains 100 mg of caffeine; its half-life in the body is 5.0 h. How much is left at 11 pm, and when is it down to 10 mg?',
      steps: [
        '8 h is $8/5 = 1.6$ half-lives: $100 \\times 0.5^{1.6} = 100 \\times 0.330 = 33$ mg.',
        '10 mg is a fraction 0.10: $t = t_{1/2}\\,\\log_2(1/0.10) = 5.0 \\times 3.32 = 16.6$ h — about 7:30 the next morning.',
        'Pregnancy and some medicines can double the half-life; smoking shortens it.'
      ],
      a: 'About 33 mg at 11 pm; 10 mg only after about 16.6 h.'
    },
    {
      title: 'Diagnosing the order from half-lives',
      q: 'A reactant falls from 0.80 M to 0.40 M in 10 min, then to 0.20 M after a further 20 min. What is the order, and what is k?',
      steps: [
        'The second half-life (20 min) is twice the first (10 min): second order.',
        '$t_{1/2} = 1/(k[\\ce{A}]_0)$: $k = 1/(10\\ \\mathrm{min} \\times 0.80\\ \\mathrm{M}) = 0.125\\ \\mathrm{M^{-1}\\,min^{-1}}$.',
        'Check with the second half-life, starting at 0.40 M: $1/(0.125 \\times 0.40) = 20$ min. ✓'
      ],
      a: 'Second order, k = 0.125 M⁻¹ min⁻¹ (2.1 × 10⁻³ M⁻¹ s⁻¹).'
    }
  ],
  quiz: [
    { q: 'A first-order reaction has a half-life of 20 min. What fraction of the reactant is left after 1 hour?', choices: ['1/3', '1/4', '1/8', '1/16'], a: 2,
      why: '60 min is three half-lives: $(1/2)^3 = 1/8$.' },
    { q: 'A first-order reaction has a half-life of 35 s. What is its rate constant in s⁻¹?', answer: 0.0198, unit: '1/s',
      why: '$k = \\ln 2/t_{1/2} = 0.693/35 = 0.0198$ s⁻¹.' },
    { q: 'You double the starting concentration of a first-order reactant. The half-life…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2,
      why: 't½ = ln 2/k contains no concentration. Twice as much reacts twice as fast at first, and half of it is still gone after the same time.' },
    { q: 'For a second-order reaction, the second half-life is shorter than the first.', a: false,
      why: 't½ = 1/(k[A]₀): as the concentration halves the half-life doubles. It is zero-order reactions whose half-lives shrink.' }
  ],
  sim: { id: 'tk-orders', params: { order: 2 } },
  applications: ['Dosing intervals for medicines.', 'Expiry dates of drugs, vaccines and foods (t₉₀).', 'Radiotherapy and nuclear medicine with short-lived isotopes.', 'How long a pollutant or pesticide persists in the environment.']
}

);
