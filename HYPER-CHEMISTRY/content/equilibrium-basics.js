/* HYPER-CHEMISTRY · content/equilibrium-basics.js — the equilibrium constant: dynamic
 * equilibrium, K and Q, Kp and Kc, ICE tables, Le Chatelier's principle and the
 * temperature dependence of K (simulations in sims/equilibrium.js). */
Hyper.add(

{
  id: 'dynamic-equilibrium', parent: 'equilibrium-basics', title: 'Dynamic equilibrium', level: 1,
  short: 'A reversible reaction in a closed vessel settles where the forward and reverse reactions run at the same rate. The composition stops changing, but the molecules never stop reacting.',
  keywords: ['dynamic equilibrium', 'reversible reaction', 'forward rate', 'reverse rate', 'closed system', 'steady state', 'N2O4', 'NO2', 'isotope exchange', 'equilibrium mixture'],
  prereq: ['chemical-equations', 'reaction-rate', 'rate-laws'],
  related: ['equilibrium-constant', 'le-chatelier', 'vapor-pressure', 'solubility-product', 'catalysis', 'math:exponential-growth-decay'],
  body: `
Seal some dinitrogen tetroxide, a colourless gas, in a glass tube at room temperature. Almost at once the tube turns pale brown: some of the molecules have split into nitrogen dioxide, which is brown.

$$\\ce{N2O4(g) <=> 2NO2(g)}$$

The colour deepens for a moment and then stops changing. Nothing seems to happen any more — yet at the molecular level a great deal is going on. $\\ce{N2O4}$ molecules keep splitting, and pairs of $\\ce{NO2}$ keep colliding and joining up again. The composition is steady because the two processes now run **at the same rate**: every second, as many molecules split as join. That is a **dynamic equilibrium**.

### Why the two rates meet
At the start there is only $\\ce{N2O4}$, so splitting is fast and joining cannot happen at all. As $\\ce{NO2}$ builds up, splitting slows down (less $\\ce{N2O4}$ is left) and joining speeds up (more $\\ce{NO2}$ to collide). The two [[reaction-rate|rates]] converge, and once they are equal the concentrations stop changing. In the simplest case, an isomerisation $\\ce{A <=> B}$ that is first order both ways,

$$k_f[\\ce{A}] = k_r[\\ce{B}] \\quad\\Rightarrow\\quad \\frac{[\\ce{B}]}{[\\ce{A}]} = \\frac{k_f}{k_r} = K$$

The **ratio** of the rate constants fixes the final composition; their **sum** fixes how quickly it is reached. The mixture creeps towards equilibrium [[math:exponential-growth-decay|exponentially]], with a time constant $\\tau = 1/(k_f + k_r)$.

### The marks of an equilibrium
- It needs a **closed system**: nothing enters or leaves. A flame, a river or a living cell holds steady only because matter flows through it — a steady state, which is a different thing.
- The **measurable properties** — colour, pressure, concentrations, pH — are constant.
- It can be reached **from either side**: pure $\\ce{N2O4}$, or pure $\\ce{NO2}$ with the same number of nitrogen atoms, end as the same mixture at the same temperature.
- The final mixture depends on the temperature, not on how fast you got there. A [[catalysis|catalyst]] speeds both directions by the same factor, so it shortens the wait and leaves the composition alone.

> [!key] Equilibrium does not mean equal amounts; it means equal **rates**. The mixture may be 99.99 % products or 0.01 % — the [[equilibrium-constant]] says which.

### Evidence that it never stops
Isotopes make the hidden traffic visible. Make one ammonia equilibrium mixture from nitrogen and ordinary hydrogen and an identical one with deuterium, $\\ce{D2}$, then mix them. The amounts of nitrogen, hydrogen and ammonia do not change, yet $\\ce{NH2D}$ and $\\ce{NHD2}$ soon appear: ammonia molecules are still being taken apart and rebuilt. In the same way, solid lead iodide shaken with its saturated solution containing radioactive iodide becomes radioactive itself — ions keep leaving the crystals while others settle on them.

### Physical equilibria
The same balance governs changes of state and dissolving. In a closed bottle half full of water, molecules evaporate and condense at equal rates, and the pressure of the vapour at that balance is the [[vapor-pressure|vapour pressure]]. A saturated salt solution over undissolved crystals is an equilibrium between dissolving and crystallising, the starting point of the [[solubility-product]].
`,
  ideas: [
    'A reversible reaction in a closed system settles where the forward and reverse rates are equal.',
    'At equilibrium the concentrations are constant, but molecules keep reacting in both directions.',
    'The same equilibrium mixture is reached from either side at a given temperature.',
    'For A ⇌ B, the ratio kf/kr fixes the composition and the sum kf + kr how fast it is reached.',
    'A catalyst speeds both directions equally: equilibrium comes sooner, with the same composition.'
  ],
  pitfalls: [
    'At equilibrium the reaction has stopped — Both reactions continue at equal rates; isotope-exchange experiments show molecules still changing partners.',
    'At equilibrium reactants and products are present in equal amounts — Only the rates are equal. The composition can lie anywhere from almost all reactants to almost all products.',
    'Anything that stays constant is at equilibrium — A flame or a cell is a steady state kept up by a flow of matter and energy; sealed off, it drifts to a true equilibrium.'
  ],
  formulas: [
    {
      name: 'Equilibrium constant from the two rate constants',
      expr: 'K = kf/kr', tex: 'K = \\frac{k_f}{k_r}',
      vars: {
        K: { name: 'equilibrium constant of A ⇌ B' },
        kf: { name: 'forward rate constant', q: 'rate', unit: '1/s', value: 0.30, tex: 'k_f' },
        kr: { name: 'reverse rate constant', q: 'rate', unit: '1/s', value: 0.10, tex: 'k_r' }
      },
      note: 'For a reaction that is first order in both directions, $\\ce{A <=> B}$. For any single-step reaction K is still the ratio of the two rate constants, taken in consistent units.',
      practice: { unknowns: ['K', 'kr'] },
      stories: {
        K: 'An isomerisation $\\ce{A <=> B}$ has a forward rate constant of {kf} and a reverse rate constant of {kr}. What is its equilibrium constant?',
        kr: 'An isomerisation $\\ce{A <=> B}$ has $K$ = {K} and a forward rate constant of {kf}. How fast is the reverse step?'
      }
    },
    {
      name: 'Approach to equilibrium, A ⇌ B from pure A',
      expr: 'B = A0*kf/(kf + kr)*(1 - exp(-(kf + kr)*t))',
      tex: '\\mathrm{[\\ce{B}]} = \\mathrm{[\\ce{A}]}_0\\,\\frac{k_f}{k_f + k_r}\\left(1 - e^{-(k_f + k_r)t}\\right)',
      vars: {
        B: { name: 'concentration of B at time t', q: 'concentration', unit: 'M', tex: '\\mathrm{[\\ce{B}]}' },
        A0: { name: 'starting concentration of A', q: 'concentration', unit: 'M', value: 1.0, tex: '\\mathrm{[\\ce{A}]}_0' },
        kf: { name: 'forward rate constant', q: 'rate', unit: '1/s', value: 0.30, tex: 'k_f' },
        kr: { name: 'reverse rate constant', q: 'rate', unit: '1/s', value: 0.10, tex: 'k_r' },
        t: { name: 'time since mixing', q: 'time', unit: 's', value: 5 }
      },
      note: 'As $t \\to \\infty$ the bracket tends to 1 and $[\\ce{B}]$ to its equilibrium value $[\\ce{A}]_0 k_f/(k_f + k_r)$. After one time constant it is 63 % of the way there, after five more than 99 %.',
      practice: { unknowns: ['B', 't', 'A0'] },
      stories: {
        B: 'Pure A at {A0} starts to isomerise, $\\ce{A <=> B}$, with forward and reverse rate constants {kf} and {kr}. What is the concentration of B after {t}?',
        t: 'Pure A at {A0} isomerises with rate constants {kf} (forward) and {kr} (reverse). When has the concentration of B reached {B}?'
      }
    },
    {
      name: 'Time constant of the approach',
      expr: 'tau = 1/(kf + kr)', tex: '\\tau = \\frac{1}{k_f + k_r}',
      vars: {
        tau: { name: 'time constant', q: 'time', unit: 's' },
        kf: { name: 'forward rate constant', q: 'rate', unit: '1/s', value: 0.30, tex: 'k_f' },
        kr: { name: 'reverse rate constant', q: 'rate', unit: '1/s', value: 0.10, tex: 'k_r' }
      },
      note: 'Both steps pull the mixture towards equilibrium, so it is the sum of the rate constants that sets the pace — even the reverse reaction helps equilibrium arrive sooner.',
      practice: { unknowns: ['tau', 'kf'] },
      stories: { tau: 'A reversible isomerisation has $k_f$ = {kf} and $k_r$ = {kr}. What is the time constant of its approach to equilibrium?' }
    }
  ],
  examples: [
    {
      title: 'An isomerisation settling down',
      q: 'Pure A at 1.00 mol/L isomerises, $\\ce{A <=> B}$, with $k_f = 0.30\\ \\mathrm{s^{-1}}$ and $k_r = 0.10\\ \\mathrm{s^{-1}}$. Find K, the equilibrium composition, the time constant, and how far the reaction has got after 5 s. How fast is each reaction running at equilibrium?',
      steps: [
        '$K = k_f/k_r = 0.30/0.10 = 3.0$.',
        'At equilibrium $[\\ce{B}] = 3[\\ce{A}]$ and $[\\ce{A}] + [\\ce{B}] = 1.00$, so $[\\ce{A}] = 0.25$ and $[\\ce{B}] = 0.75$ mol/L.',
        'Time constant: $\\tau = 1/(0.30 + 0.10) = 2.5$ s. After 5 s, two time constants: $[\\ce{B}] = 0.75\\,(1 - e^{-2}) = 0.649$ mol/L, 87 % of the way.',
        'At equilibrium the forward rate is $0.30 \\times 0.25 = 0.075$ mol/(L·s) and the reverse rate $0.10 \\times 0.75 = 0.075$ mol/(L·s) — equal, and far from zero.'
      ],
      a: 'K = 3.0; 0.25 M A and 0.75 M B; τ = 2.5 s; 0.649 M B after 5 s; both reactions still run at 0.075 mol/(L·s).'
    }
  ],
  quiz: [
    { q: 'A sealed tube of $\\ce{N2O4}$ and $\\ce{NO2}$ has had the same colour for an hour. The $\\ce{N2O4}$ molecules have stopped splitting.', a: false,
      why: 'They still split, but $\\ce{NO2}$ pairs join at exactly the same rate, so the amounts do not change. Equilibrium is a balance of two ongoing processes.' },
    { q: 'At equilibrium, the concentrations of the reactants and products are…', choices: ['equal to one another', 'constant', 'zero for the reactants', 'still changing, but slowly'], a: 1,
      why: 'They stop changing because the rates are equal. They are equal to one another only by coincidence; the value of K decides the proportions.' },
    { q: 'Flask 1 is filled with pure $\\ce{N2O4}$; flask 2, the same size and at the same temperature, with pure $\\ce{NO2}$ containing the same number of nitrogen atoms. After a while…', choices: ['flask 1 contains more NO₂', 'flask 2 contains more NO₂', 'both contain the same mixture', 'flask 2 contains no N₂O₄'], a: 2,
      why: 'The equilibrium state depends only on the temperature and the total amounts of each element, not on the direction from which it is approached.' },
    { q: '$\\ce{A <=> B}$ has $k_f = 0.20\\ \\mathrm{s^{-1}}$ and $k_r = 0.05\\ \\mathrm{s^{-1}}$. What fraction of the molecules are B at equilibrium?', answer: 0.8,
      why: '$K = 0.20/0.05 = 4$, so B : A = 4 : 1 and the fraction of B is $k_f/(k_f + k_r) = 0.20/0.25 = 0.80$.' },
    { q: 'Adding a catalyst to a reaction mixture that has not yet reached equilibrium…', choices: ['shifts the equilibrium towards the products', 'speeds up both directions equally, so the same equilibrium is reached sooner', 'increases K', 'speeds up only the forward reaction'], a: 1,
      why: 'A catalyst lowers the barrier for the forward and reverse steps alike, so both rate constants grow by the same factor: their ratio K is unchanged, their sum (the speed of approach) grows.' }
  ],
  applications: [
    'Isotope-tracer experiments that follow atoms through reacting systems and living organisms.',
    'Gas cylinders, aerosol cans and fizzy drinks, where a liquid and its vapour, or a gas and its solution, sit in equilibrium.',
    'Oxygen transport: haemoglobin binds and releases oxygen in a fast reversible equilibrium.',
    'Every calculation with K, from acid–base chemistry to geochemistry, rests on this balance of rates.'
  ],
  history: 'Claude Louis Berthollet, travelling with Napoleon\'s expedition to Egypt around 1800, saw sodium carbonate crusts forming on the shores of salt lakes from limestone and brine — the reverse of a reaction chemists ran the other way in the laboratory. He concluded that reactions can go both ways and that the amounts present matter, an idea made quantitative by Guldberg and Waage in 1864.',
  sim: 'eq-dynamic'
},

{
  id: 'equilibrium-constant', parent: 'equilibrium-basics', title: 'The equilibrium constant', level: 2,
  short: 'At equilibrium, the product concentrations over the reactant concentrations, each raised to its coefficient, always give the same number at a given temperature: the equilibrium constant K.',
  keywords: ['equilibrium constant', 'Kc', 'law of mass action', 'equilibrium expression', 'activity', 'heterogeneous equilibrium', 'magnitude of K', 'reversing an equation'],
  prereq: ['dynamic-equilibrium', 'chemical-equations', 'molarity', 'math:exponents'],
  related: ['reaction-quotient', 'kp-kc', 'ice-tables', 'gibbs-equilibrium', 'weak-acids', 'solubility-product', 'vant-hoff'],
  body: `
Run $\\ce{H2(g) + I2(g) <=> 2HI(g)}$ at 430 °C from any starting mixture you like. When the composition has stopped changing, measure the three concentrations and combine them like this:

$$K_c = \\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]}$$

Whatever you started with, the result is the same — about 54 (concentrations in mol/L):

| Start $\\ce{H2}$ | Start $\\ce{I2}$ | Start $\\ce{HI}$ | Eq. $\\ce{H2}$ | Eq. $\\ce{I2}$ | Eq. $\\ce{HI}$ | $K_c$ |
|---|---|---|---|---|---|---|
| 0.0100 | 0.0100 | 0 | 0.00214 | 0.00214 | 0.01572 | 54.0 |
| 0.0200 | 0.0100 | 0 | 0.01061 | 0.000615 | 0.01877 | 54.0 |
| 0 | 0 | 0.0300 | 0.00321 | 0.00321 | 0.02358 | 54.0 |
| 0.0050 | 0.0020 | 0.0100 | 0.00377 | 0.000765 | 0.01247 | 54.0 |

Simpler combinations are not constant: $[\\ce{HI}]/([\\ce{H2}][\\ce{I2}])$ wanders from about 2300 to 4300 over the same four rows. Only the powers taken from the balanced equation give a constant. That is the **law of mass action**.

### The general expression
For any reaction $a\\,\\mathrm{A} + b\\,\\mathrm{B} \\rightleftharpoons c\\,\\mathrm{C} + d\\,\\mathrm{D}$ at equilibrium,

$$K_c = \\frac{[\\mathrm{C}]^c\\,[\\mathrm{D}]^d}{[\\mathrm{A}]^a\\,[\\mathrm{B}]^b}$$

products on top, reactants below, each raised to its coefficient. Three rules keep it straight:

1. **Pure solids and liquids are left out.** Their "concentration" is fixed by their density, so it is folded into K. For limestone, $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, the constant is just $K_c = [\\ce{CO2}]$: at a given temperature the gas above the solids has one fixed concentration, however much limestone there is.
2. **The solvent is left out** in dilute solution. For acetic acid in water, $\\ce{CH3COOH(aq) + H2O(l) <=> CH3COO-(aq) + H3O+(aq)}$, the [[weak-acids|acid constant]] is $K_a = [\\ce{CH3COO-}][\\ce{H3O+}]/[\\ce{CH3COOH}]$.
3. **K belongs to the equation as written.** Reverse the equation and K becomes $1/K$; multiply every coefficient by $n$ and K becomes $K^n$; add two equations and their constants multiply.

### What its size tells you
- $K \\gg 1$ (say above $10^3$): at equilibrium almost everything is products. For $\\ce{H2 + Cl2 <=> 2HCl}$ at 25 °C, $K \\approx 10^{33}$ — the reaction goes to completion.
- $K \\ll 1$ (below $10^{-3}$): hardly anything reacts. For $\\ce{N2 + O2 <=> 2NO}$, $K \\approx 5\\times10^{-31}$ at 25 °C, so air does not turn into nitrogen oxides. At 2000 K in an engine cylinder, though, $K$ has risen to about $4\\times10^{-4}$ — enough to make the NOx that a catalytic converter must remove.
- In between, sizeable amounts of everything are present and the composition needs an [[ice-tables|ICE-table calculation]].

K says **where** a reaction ends up, never **how fast** it gets there; that is [[reaction-rate|kinetics]]. And K changes only with **temperature** ([[vant-hoff]]): concentrations, pressure and catalysts leave it alone.

### Units and activities
Strictly, K is built from **activities**: each concentration divided by the standard concentration $c^\\circ = 1$ mol/L, each gas pressure by $p^\\circ = 1$ bar. That makes K a pure number, and it is this K that thermodynamics links to the standard free energy, $\\Delta G^\\circ = -RT\\ln K$ ([[gibbs-equilibrium]]). In practice you put concentrations in mol/L into the expression and drop the units; some books attach units such as $\\mathrm{M^{-2}}$ instead. In concentrated solutions activities and concentrations part company, and careful work corrects for it.
`,
  ideas: [
    'At equilibrium, products over reactants, each raised to its coefficient, is a constant K at a given temperature.',
    'Pure solids, pure liquids and the solvent do not appear in K.',
    'K belongs to the equation as written: reversed gives 1/K, multiplied by n gives Kⁿ, added equations multiply their K.',
    'A large K means mostly products at equilibrium, a small K mostly reactants; K says nothing about speed.',
    'Only temperature changes K.'
  ],
  pitfalls: [
    'K changes when you add more reactant — The composition moves, but it moves so that the same K is satisfied again. Only a change of temperature changes K.',
    'A large K means a fast reaction — K is about the end point, not the rate. Hydrogen and oxygen have an enormous K for making water and can sit mixed for years without reacting.',
    'Solids count in K like everything else — Their activity is 1; the CO₂ pressure over heated limestone is the same whether there is a gram of it or a tonne.'
  ],
  formulas: [
    {
      name: 'Kc for hydrogen iodide',
      expr: 'Kc = HI^2/(H2*I2)', tex: 'K_c = \\frac{\\mathrm{[\\ce{HI}]}^2}{\\mathrm{[\\ce{H2}]}\\,\\mathrm{[\\ce{I2}]}}',
      vars: {
        Kc: { name: 'equilibrium constant', tex: 'K_c' },
        HI: { name: '[HI] at equilibrium (mol/L)', value: 0.01877, tex: '\\mathrm{[\\ce{HI}]}' },
        H2: { name: '[H₂] at equilibrium (mol/L)', value: 0.01061, tex: '\\mathrm{[\\ce{H2}]}' },
        I2: { name: '[I₂] at equilibrium (mol/L)', value: 0.000615, tex: '\\mathrm{[\\ce{I2}]}' }
      },
      note: 'For $\\ce{H2(g) + I2(g) <=> 2HI(g)}$; $K_c \\approx 54$ at 430 °C. Concentrations are entered as numbers in mol/L, which is what makes K a pure number.',
      practice: { unknowns: ['Kc', 'HI', 'I2'] },
      stories: {
        Kc: 'An equilibrium mixture of $\\ce{H2}$, $\\ce{I2}$ and $\\ce{HI}$ holds {H2} mol/L of hydrogen, {I2} mol/L of iodine and {HI} mol/L of hydrogen iodide. What is $K_c$?',
        HI: 'At the temperature where $K_c$ = {Kc}, an equilibrium mixture has {H2} mol/L of hydrogen and {I2} mol/L of iodine. What is the concentration of HI, in mol/L?'
      }
    },
    {
      name: 'Kc for ammonia synthesis',
      expr: 'Kc = NH3^2/(N2*H2^3)', tex: 'K_c = \\frac{\\mathrm{[\\ce{NH3}]}^2}{\\mathrm{[\\ce{N2}]}\\,\\mathrm{[\\ce{H2}]}^3}',
      vars: {
        Kc: { name: 'equilibrium constant', tex: 'K_c' },
        NH3: { name: '[NH₃] at equilibrium (mol/L)', value: 0.01684, tex: '\\mathrm{[\\ce{NH3}]}' },
        N2: { name: '[N₂] at equilibrium (mol/L)', value: 0.100, tex: '\\mathrm{[\\ce{N2}]}' },
        H2: { name: '[H₂] at equilibrium (mol/L)', value: 0.300, tex: '\\mathrm{[\\ce{H2}]}' }
      },
      note: 'For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$; $K_c \\approx 0.105$ at 472 °C. The cube on hydrogen is why the yield depends so strongly on how much hydrogen is present.',
      practice: { unknowns: ['NH3', 'Kc'] },
      stories: {
        NH3: 'At 472 °C, $K_c$ = {Kc} for $\\ce{N2 + 3H2 <=> 2NH3}$. An equilibrium mixture contains {N2} mol/L of nitrogen and {H2} mol/L of hydrogen. What is the concentration of ammonia, in mol/L?',
        Kc: 'An equilibrium mixture contains {N2} mol/L of nitrogen, {H2} mol/L of hydrogen and {NH3} mol/L of ammonia. What is $K_c$ for $\\ce{N2 + 3H2 <=> 2NH3}$?'
      }
    },
    {
      name: 'Rewriting the equation',
      expr: 'Knew = K^n', tex: 'K\' = K^{\\,n}',
      vars: {
        Knew: { name: 'constant for the rewritten equation', tex: 'K\'' },
        K: { name: 'constant for the original equation', value: 0.105 },
        n: { name: 'factor multiplying every coefficient (−1 reverses the equation)', value: -0.5, signed: true }
      },
      note: 'Multiplying the equation by $n$ raises K to the power $n$. $n = -1$ reverses it; $n = 1/2$ halves every coefficient. The default turns $\\ce{N2 + 3H2 <=> 2NH3}$ into $\\ce{NH3 <=> 1/2 N2 + 3/2 H2}$.',
      practice: { unknowns: ['Knew'] },
      stories: {
        Knew: 'A reaction has equilibrium constant {K}. What is the constant when every coefficient of its equation is multiplied by {n}?'
      }
    }
  ],
  derivation: {
    title: 'Where the expression comes from',
    intro: 'For a reaction that happens in a single step, the rate laws give K directly; thermodynamics then shows that the same expression holds whatever the mechanism.',
    steps: [
      { text: 'For a one-step reaction $\\ce{A + B <=> C + D}$ the forward rate is $k_f[\\ce{A}][\\ce{B}]$ and the reverse rate $k_r[\\ce{C}][\\ce{D}]$. At equilibrium they are equal:', tex: 'k_f[\\mathrm{A}][\\mathrm{B}] = k_r[\\mathrm{C}][\\mathrm{D}]' },
      { text: 'Collect the concentrations on one side and the rate constants on the other:', tex: '\\frac{[\\mathrm{C}][\\mathrm{D}]}{[\\mathrm{A}][\\mathrm{B}]} = \\frac{k_f}{k_r} = K' },
      { text: 'A reaction in several steps reaches equilibrium only when **every** step is balanced. For $\\ce{2NO + O2 -> 2NO2}$ through the intermediate $\\ce{N2O2}$, the two steps give', tex: 'K_1 = \\frac{[\\ce{N2O2}]}{[\\ce{NO}]^2}, \\qquad K_2 = \\frac{[\\ce{NO2}]^2}{[\\ce{N2O2}][\\ce{O2}]}' },
      { text: 'Multiplying them cancels the intermediate and leaves exactly the expression written from the overall equation:', tex: 'K_1 K_2 = \\frac{[\\ce{NO2}]^2}{[\\ce{NO}]^2[\\ce{O2}]} = K' }
    ],
    outro: 'This is why the equilibrium expression can be written straight from the balanced equation, while a rate law cannot: rate laws depend on the mechanism, K does not.'
  },
  examples: [
    {
      title: 'Ammonia at 472 °C',
      q: 'At 472 °C, $K_c = 0.105$ for $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$. An equilibrium mixture contains 0.100 mol/L of nitrogen and 0.300 mol/L of hydrogen. What is the concentration of ammonia?',
      steps: [
        'Write K and solve for the unknown: $[\\ce{NH3}]^2 = K_c[\\ce{N2}][\\ce{H2}]^3$.',
        '$[\\ce{NH3}]^2 = 0.105 \\times 0.100 \\times 0.300^3 = 0.105 \\times 0.100 \\times 0.0270 = 2.84\\times10^{-4}$.',
        '$[\\ce{NH3}] = 0.0168$ mol/L — only about 4 % of the gas, a hint of why ammonia plants recycle the unreacted nitrogen and hydrogen.'
      ],
      a: '[NH₃] = 0.0168 mol/L.'
    },
    {
      title: 'Turning the equation around',
      q: 'Using $K_c = 0.105$ for $\\ce{N2 + 3H2 <=> 2NH3}$ at 472 °C, find K for (a) $\\ce{2NH3 <=> N2 + 3H2}$ and (b) $\\ce{NH3 <=> 1/2 N2 + 3/2 H2}$.',
      steps: [
        '(a) The reversed equation has the reciprocal constant: $K = 1/0.105 = 9.52$.',
        '(b) This is the original multiplied by $-\\tfrac12$: $K = 0.105^{-1/2} = 1/\\sqrt{0.105} = 3.09$.',
        'Check (b) against (a): halving the reversed equation takes the square root, $\\sqrt{9.52} = 3.09$.'
      ],
      a: '(a) 9.52; (b) 3.09.'
    }
  ],
  quiz: [
    { q: 'What is the equilibrium constant for $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$?', choices: ['$K_c = [\\ce{CO2}]$', '$K_c = [\\ce{CaO}][\\ce{CO2}]/[\\ce{CaCO3}]$', '$K_c = 1/[\\ce{CO2}]$', '$K_c = [\\ce{CaCO3}]/[\\ce{CaO}]$'], a: 0,
      why: 'Pure solids have activity 1 and drop out, leaving only the gas. The CO₂ concentration over the solids is fixed at a given temperature.' },
    { q: '$K_c = 54$ for $\\ce{H2 + I2 <=> 2HI}$ at 430 °C. What is $K_c$ for $\\ce{2HI <=> H2 + I2}$ at the same temperature?', answer: 0.0185,
      why: 'Reversing the equation turns K into its reciprocal: 1/54 = 0.0185.' },
    { q: 'Doubling the starting concentration of hydrogen in an $\\ce{H2}$/$\\ce{I2}$ mixture changes the value of K.', a: false,
      why: 'K depends only on temperature. More hydrogen gives a different equilibrium mixture, but one whose concentrations give the same K.' },
    { q: 'For $\\ce{N2 + O2 <=> 2NO}$, $K \\approx 5\\times10^{-31}$ at 25 °C. What does this tell you?', choices: ['nitric oxide forms quickly in air', 'at equilibrium, air contains practically no NO', 'nitric oxide cannot exist at 25 °C', 'the reaction is fast in the reverse direction'], a: 1,
      why: 'A tiny K means the equilibrium lies far to the left. It says nothing about speed: NO made in an engine survives for a long time in air because its decomposition is slow.' },
    { q: 'For $\\ce{H2 + I2 <=> 2HI}$, $K_c = 54$. What is K for $\\ce{1/2 H2 + 1/2 I2 <=> HI}$?', answer: 7.35,
      why: 'Halving the coefficients takes the square root: $\\sqrt{54} = 7.35$.' }
  ],
  applications: [
    'Predicting how far industrial reactions go: ammonia, methanol, sulfur trioxide, hydrogen from steam reforming.',
    'Acid, base, solubility and complex-formation constants (Ka, Kb, Ksp, Kf) — all special cases of K.',
    'Geochemistry: which minerals are stable in contact with a given groundwater.',
    'Compact data: one K (or one ΔG°) replaces endless tables of equilibrium mixtures.'
  ],
  history: 'Cato Guldberg and Peter Waage, a mathematician and a chemist in Christiania (now Oslo), stated the law of mass action in 1864 after careful measurements on reversible reactions such as the formation of esters. Their work, published first in Norwegian, was little noticed until the 1870s, when van \'t Hoff arrived at the same law independently.',
  sim: { id: 'eq-ice', params: { rx: 0 } }
},

{
  id: 'reaction-quotient', parent: 'equilibrium-basics', title: 'The reaction quotient', level: 2,
  short: 'Q has the same form as K but uses the concentrations present right now. Comparing Q with K tells you which way a mixture will react: forward if Q < K, backward if Q > K.',
  keywords: ['reaction quotient', 'Q', 'Q versus K', 'direction of reaction', 'ion product', 'driving force', 'ΔG = RT ln(Q/K)'],
  prereq: ['equilibrium-constant', 'dynamic-equilibrium'],
  related: ['ice-tables', 'le-chatelier', 'gibbs-equilibrium', 'precipitation', 'nernst-equation', 'math:logarithms'],
  body: `
The equilibrium constant describes the end point. To know **which way** a mixture that is not yet at equilibrium will move, write the same expression with the concentrations you have *now*. That is the **reaction quotient** $Q$:

$$Q_c = \\frac{[\\ce{HI}]^2}{[\\ce{H2}][\\ce{I2}]} \\quad \\text{(at any moment)}$$

It becomes $K$ only when the mixture has reached equilibrium. Then compare:

| | What happens |
|---|---|
| $Q < K$ | too little product: the reaction runs **forward** and $Q$ rises towards $K$ |
| $Q > K$ | too much product: the reaction runs **backward** and $Q$ falls towards $K$ |
| $Q = K$ | at equilibrium: no net change |

The comparison works because $Q$ moves steadily in one direction as the reaction proceeds: each step forward makes the numerator bigger and the denominator smaller. $Q$ climbs from 0 (no products) to infinity (a reactant used up) and passes the value $K$ exactly once — which is why a reaction has one equilibrium position and cannot overshoot it.

### How hard the mixture is pushed
The ratio $Q/K$ measures how far from equilibrium the mixture is, and thermodynamics turns it into an energy, the free-energy change per mole of reaction under the present conditions ([[gibbs-equilibrium]]):

$$\\Delta G = RT\\ln\\frac{Q}{K}$$

It is negative when $Q < K$ (the forward reaction is spontaneous), zero at equilibrium and positive when $Q > K$ (the reverse runs). At 430 °C a hydrogen iodide mixture with $Q = 25$ against $K = 54$ has $\\Delta G = -4.5$ kJ/mol, a gentle push forward. Each factor of ten between Q and K is worth $RT\\ln 10 = 5.7$ kJ/mol at 25 °C.

### Where it is used
- **Precipitation.** For a salt, $Q$ is the ion product; comparing it with the [[solubility-product]] decides whether a solid forms ([[precipitation]]).
- **Batteries.** The [[nernst-equation|Nernst equation]] is $\\Delta G = RT\\ln(Q/K)$ written in volts. A cell's voltage falls as $Q$ climbs towards $K$, and it reaches zero — a flat battery — when $Q = K$.
- **Living cells** keep many reactions far from equilibrium on purpose. By removing products as fast as they form, a cell holds $Q$ well below $K$ and keeps the reaction running, even when $K$ itself is small.
- **Industry.** An ammonia plant condenses the ammonia out of the gas and recycles the rest, so the gas returning to the converter has $Q \\ll K$ and reacts again.

> [!tip] Q and K must be written for the same equation, in the same units and standard states. For gases use pressures in both ($Q_p$ against $K_p$) or concentrations in both.
`,
  ideas: [
    'Q is the equilibrium expression evaluated with the present concentrations.',
    'Q < K: the reaction runs forward; Q > K: it runs backward; Q = K: equilibrium.',
    'Q changes steadily as the reaction proceeds and passes K exactly once.',
    'ΔG = RT ln(Q/K) turns the gap between Q and K into a driving force.'
  ],
  pitfalls: [
    'Q and K are the same thing — K is the one value Q takes at equilibrium. Q changes as the reaction runs; K does not.',
    'Q = K means the reactions have stopped — At Q = K both directions still run, at equal rates.',
    'If Q < K the reaction will be fast — Q against K gives the direction only; a large gap can still take years to close without a catalyst.'
  ],
  formulas: [
    {
      name: 'Reaction quotient for hydrogen iodide',
      expr: 'Qc = HI^2/(H2*I2)', tex: 'Q_c = \\frac{\\mathrm{[\\ce{HI}]}^2}{\\mathrm{[\\ce{H2}]}\\,\\mathrm{[\\ce{I2}]}}',
      vars: {
        Qc: { name: 'reaction quotient', tex: 'Q_c' },
        HI: { name: '[HI] now (mol/L)', value: 0.500, tex: '\\mathrm{[\\ce{HI}]}' },
        H2: { name: '[H₂] now (mol/L)', value: 0.100, tex: '\\mathrm{[\\ce{H2}]}' },
        I2: { name: '[I₂] now (mol/L)', value: 0.100, tex: '\\mathrm{[\\ce{I2}]}' }
      },
      note: 'Compare the result with $K_c = 54$ at 430 °C: smaller means more HI will form, larger means some will decompose.',
      practice: { unknowns: ['Qc'] },
      stories: {
        Qc: 'A flask at 430 °C holds {H2} mol/L of hydrogen, {I2} mol/L of iodine and {HI} mol/L of hydrogen iodide. What is the reaction quotient? (Compare it with $K_c = 54$.)'
      }
    },
    {
      name: 'Driving force from Q and K',
      expr: 'dG = R*T*ln(Q/K)', tex: '\\Delta G = RT\\ln\\frac{Q}{K}',
      vars: {
        dG: { name: 'free-energy change of the reaction under present conditions', q: 'molarenergy', unit: 'kJ/mol', tex: '\\Delta G', signed: true },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 430 },
        Q: { name: 'reaction quotient', value: 25 },
        K: { name: 'equilibrium constant', value: 54 }
      },
      note: 'Negative: the forward reaction runs. Positive: the reverse runs. Zero: equilibrium. It is the same as $\\Delta G = \\Delta G^\\circ + RT\\ln Q$ with $\\Delta G^\\circ = -RT\\ln K$.',
      practice: { unknowns: ['dG', 'Q'] },
      stories: {
        dG: 'At {T} a mixture has reaction quotient {Q}, while the equilibrium constant is {K}. What is the free-energy change of the reaction, per mole, under these conditions?',
        Q: 'At {T}, where K = {K}, the free-energy change of a reaction under the present conditions is {dG}. What is the reaction quotient?'
      }
    }
  ],
  examples: [
    {
      title: 'Which way, and how far?',
      q: 'At 430 °C ($K_c = 54$) a 1.00 L flask holds 0.100 mol $\\ce{H2}$, 0.100 mol $\\ce{I2}$ and 0.500 mol $\\ce{HI}$. Which way does it react, and what is the equilibrium composition?',
      steps: [
        '$Q = 0.500^2/(0.100 \\times 0.100) = 25$. Since $Q < K$, the reaction runs **forward**: more HI forms.',
        'Driving force: $\\Delta G = RT\\ln(Q/K) = 8.314 \\times 703 \\times \\ln(25/54) = -4.5$ kJ/mol.',
        'ICE: $[\\ce{H2}] = [\\ce{I2}] = 0.100 - x$, $[\\ce{HI}] = 0.500 + 2x$. Both sides of $54 = (0.500 + 2x)^2/(0.100 - x)^2$ are squares: $7.348 = (0.500 + 2x)/(0.100 - x)$.',
        '$0.7348 - 7.348x = 0.500 + 2x$, so $x = 0.2348/9.348 = 0.0251$ mol/L.',
        'Equilibrium: $[\\ce{H2}] = [\\ce{I2}] = 0.0749$ and $[\\ce{HI}] = 0.550$ mol/L. Check: $0.550^2/0.0749^2 = 54$.'
      ],
      a: 'Forward; at equilibrium 0.0749 M H₂ and I₂, 0.550 M HI.'
    },
    {
      title: 'A lime kiln',
      q: 'Limestone decomposes, $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, and near 900 °C its $K_p$ reaches about 1 (pressure of CO₂ in bar). The kiln gas is 25 % carbon dioxide at a total pressure of 1 bar. Does the limestone decompose? What if the kiln were sealed and filled with CO₂ at 1.5 bar?',
      steps: [
        'Only the gas appears in Q: $Q_p = p_{\\ce{CO2}} = 0.25$ bar.',
        '$Q_p = 0.25 < K_p \\approx 1$: the reaction runs forward, and limestone keeps turning into lime.',
        'In the sealed kiln $Q_p = 1.5 > K_p$: the reverse runs, and lime takes carbon dioxide back.',
        'That is why kilns are swept by a stream of combustion gas and run above 900 °C: the CO₂ must be carried away to keep $Q$ below $K$.'
      ],
      a: 'Yes at 0.25 bar CO₂ (Q < K); no at 1.5 bar (Q > K: lime recarbonates).'
    }
  ],
  quiz: [
    { q: 'A reaction mixture has $Q < K$. What happens?', choices: ['it runs forward, making more products', 'it runs backward, making more reactants', 'nothing: it is at equilibrium', 'K decreases until it equals Q'], a: 0,
      why: 'Too little product compared with equilibrium: the forward reaction outruns the reverse until Q has risen to K. K itself does not move.' },
    { q: 'At 430 °C ($K_c = 54$) a flask contains 0.020 M $\\ce{H2}$, 0.020 M $\\ce{I2}$ and 0.200 M $\\ce{HI}$. What is Q?', answer: 100,
      why: '$Q = 0.200^2/(0.020 \\times 0.020) = 0.0400/0.000400 = 100$. Since Q > K, some HI will decompose.' },
    { q: 'When Q = K, the forward and reverse reactions have both stopped.', a: false,
      why: 'Q = K is dynamic equilibrium: both reactions continue at equal rates, so there is no net change.' },
    { q: 'As a reaction mixture approaches equilibrium, which of these changes?', choices: ['Q only', 'K only', 'both Q and K', 'neither'], a: 0,
      why: 'Q follows the concentrations as they change. K is fixed by the temperature.' },
    { q: 'You remove some of the product from a mixture at equilibrium. Immediately afterwards…', choices: ['Q > K, and the reaction runs backward', 'Q < K, and the reaction runs forward', 'Q = K, nothing happens', 'K falls to match Q'], a: 1,
      why: 'Less product makes the numerator smaller, so Q drops below K; the forward reaction then replaces part of what was removed.' }
  ],
  applications: [
    'Deciding whether a mixture of ions will precipitate (the ion product against Ksp).',
    'Cell voltages under real conditions: the Nernst equation.',
    'Recycle loops in chemical plants that keep Q below K.',
    'Metabolic pathways kept running by removing their products.'
  ],
  sim: { id: 'eq-ice', params: { rx: 0, mix: 1 } }
},

{
  id: 'kp-kc', parent: 'equilibrium-basics', title: 'Kp and Kc', level: 2,
  short: 'For gases the equilibrium constant can be written with partial pressures (Kp) or concentrations (Kc). They are linked by the ideal gas law: Kp = Kc(RT)^Δn.',
  keywords: ['Kp', 'Kc', 'partial pressure', 'Δn', 'change in moles of gas', 'Kx', 'mole fraction', 'standard pressure', 'bar', 'fugacity', 'decomposition pressure'],
  prereq: ['equilibrium-constant', 'ideal-gas-law', 'partial-pressures'],
  related: ['le-chatelier', 'gibbs-equilibrium', 'vant-hoff', 'physics:ideal-gas-law'],
  body: `
For reactions between gases it is often more natural to measure **pressures** than concentrations. Writing the equilibrium expression with [[partial-pressures|partial pressures]] gives $K_p$. For ammonia synthesis,

$$K_p = \\frac{p_{\\ce{NH3}}^2}{p_{\\ce{N2}}\\,p_{\\ce{H2}}^3}$$

with each pressure in bar — strictly, divided by the standard pressure $p^\\circ = 1$ bar, so that $K_p$ is a pure number.

### Converting between them
Each gas in a mixture obeys the [[ideal-gas-law|ideal gas law]] on its own: $p_i V = n_i RT$, so $p_i = c_i RT$ with $c_i = n_i/V$. Put that into $K_p$: every pressure brings a factor $RT$, and the factors from products and reactants partly cancel, leaving

$$K_p = K_c\\,(RT)^{\\Delta n}$$

where $\\Delta n$ is the number of moles of **gas** on the right of the equation minus the number on the left. With concentrations in mol/L and pressures in bar, use $R = 0.08314$ L·bar/(mol·K); with atmospheres, 0.08206 L·atm/(mol·K).

- $\\Delta n = 0$ — $\\ce{H2 + I2 <=> 2HI}$, $\\ce{N2 + O2 <=> 2NO}$: $K_p = K_c$.
- $\\Delta n = +1$ — $\\ce{N2O4 <=> 2NO2}$: $K_p = K_c RT$. At 25 °C, $RT = 24.8$, so $K_c = 6.1\\times10^{-3}$ becomes $K_p = 0.15$.
- $\\Delta n = -2$ — ammonia: $K_p = K_c/(RT)^2$. At 472 °C, $K_c = 0.105$ gives $K_p = 2.7\\times10^{-5}$.

Only gases count in $\\Delta n$: for $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, $\\Delta n = +1$ and $K_p$ is simply the pressure of carbon dioxide over the solids — its **decomposition pressure**, which reaches 1 bar near 900 °C.

### Mole fractions and the total pressure
A gas mixture can also be described by mole fractions $x_i = p_i/P$, where $P$ is the total pressure. Then

$$K_p = K_x \\left(\\frac{P}{p^\\circ}\\right)^{\\Delta n}$$

$K_p$ is fixed at a given temperature, so whenever $\\Delta n \\neq 0$ the mole-fraction ratio $K_x$ must change with the total pressure. For ammonia ($\\Delta n = -2$), going from 1 to 200 bar multiplies $K_x$ by forty thousand. That is the arithmetic behind running the Haber process at high pressure, and the quantitative form of [[le-chatelier|Le Chatelier's principle]] for compression.

### Which K is in the tables?
The K that comes from thermodynamic data through $\\Delta G^\\circ = -RT\\ln K$ ([[gibbs-equilibrium]]) uses pressures in bar for gases and concentrations in mol/L for solutes. Older tables used 1 atm as the standard pressure; the difference, a factor $1.01325^{\\Delta n}$, matters only in precise work. At high pressure, real gases stray from the ideal gas law and pressures must be replaced by **fugacities** — in an ammonia converter at 200 bar that correction is tens of percent.
`,
  ideas: [
    'Kp uses partial pressures (in bar), Kc concentrations (in mol/L).',
    'Kp = Kc(RT)^Δn, with Δn = moles of gaseous products − moles of gaseous reactants.',
    'When Δn = 0, Kp = Kc and pressure does not change the composition.',
    'Only gases count in Δn; for a solid giving off a gas, Kp is the decomposition pressure.',
    'At fixed temperature Kp is constant, so the mole-fraction ratio Kx changes with total pressure when Δn ≠ 0.'
  ],
  pitfalls: [
    'Using R = 8.314 in Kp = Kc(RT)^Δn — With concentrations in mol/L and pressures in bar, R must be 0.08314 L·bar/(mol·K); 8.314 J/(mol·K) gives an answer 100^Δn times too large.',
    'Counting solids and liquids in Δn — Only gas molecules count. CaCO₃(s) → CaO(s) + CO₂(g) has Δn = +1.',
    'Kp changes with total pressure — Kp changes only with temperature. It is the mole fractions (Kx) that respond to pressure.'
  ],
  formulas: [
    {
      name: 'Kp from Kc',
      expr: 'Kp = Kc*(R*T*c0/p0)^dn', tex: 'K_p = K_c\\left(\\frac{c^\\circ R T}{p^\\circ}\\right)^{\\Delta n}',
      vars: {
        Kp: { name: 'equilibrium constant in pressures (bar)', tex: 'K_p' },
        Kc: { name: 'equilibrium constant in concentrations (mol/L)', value: 6.1e-3, tex: 'K_c' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        c0: { name: 'standard concentration', q: 'concentration', unit: 'M', value: 1, fixed: true, tex: 'c^\\circ' },
        p0: { name: 'standard pressure', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p^\\circ' },
        dn: { name: 'moles of gaseous products − moles of gaseous reactants', value: 1, int: true, signed: true, fixed: true, tex: '\\Delta n' }
      },
      note: 'The standard concentration (1 mol/L) and pressure (1 bar) make the bracket a pure number: $c^\\circ R T/p^\\circ = 0.08314\\,T$ with $T$ in kelvin, the familiar $RT$ in L·bar/(mol·K). Set $p^\\circ$ to 1 atm for constants in atmospheres. Defaults: $\\ce{N2O4 <=> 2NO2}$ at 25 °C.',
      practice: { unknowns: ['Kp', 'Kc'] },
      stories: {
        Kp: 'For $\\ce{N2O4(g) <=> 2NO2(g)}$ at {T}, $K_c$ = {Kc} (mol/L). What is $K_p$ (bar)?',
        Kc: 'For a gas reaction with $\\Delta n$ = {dn} at {T}, $K_p$ = {Kp} (bar). What is $K_c$ (mol/L)?'
      }
    },
    {
      name: 'Mole fractions and total pressure',
      expr: 'Kp = Kx*(P/p0)^dn', tex: 'K_p = K_x\\left(\\frac{P}{p^\\circ}\\right)^{\\Delta n}',
      vars: {
        Kp: { name: 'equilibrium constant in pressures (bar)', value: 0.15, tex: 'K_p' },
        Kx: { name: 'equilibrium ratio in mole fractions', value: 0.075, tex: 'K_x' },
        P: { name: 'total pressure', q: 'pressure', unit: 'bar', value: 2 },
        p0: { name: 'standard pressure', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p^\\circ' },
        dn: { name: 'moles of gaseous products − moles of gaseous reactants', value: 1, int: true, signed: true, fixed: true, tex: '\\Delta n' }
      },
      solveFor: 'Kx',
      note: 'Defaults: $\\ce{N2O4 <=> 2NO2}$ at 25 °C, compressed to 2 bar: $K_x$ halves, so the mixture holds a smaller fraction of $\\ce{NO2}$.',
      practice: { unknowns: ['Kx', 'P'] },
      stories: {
        Kx: 'For $\\ce{N2O4 <=> 2NO2}$, $K_p$ = {Kp} at 25 °C. What is the mole-fraction ratio $K_x = x_{\\ce{NO2}}^2/x_{\\ce{N2O4}}$ at a total pressure of {P}?'
      }
    },
    {
      name: 'Partial pressure from concentration',
      expr: 'p = c*R*T', tex: 'p = cRT',
      vars: {
        p: { name: 'partial pressure', q: 'pressure', unit: 'bar' },
        c: { name: 'concentration of the gas', q: 'concentration', unit: 'M', value: 0.0100 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'The ideal gas law per component, $p_i = (n_i/V)RT$. Every factor of $RT$ in $K_p = K_c(RT)^{\\Delta n}$ comes from this.',
      practice: { unknowns: ['p', 'c'] },
      stories: {
        p: 'A gas is present at {c} in a mixture at {T}. What is its partial pressure?',
        c: 'Nitrogen dioxide has a partial pressure of {p} in a flask at {T}. What is its concentration?'
      }
    }
  ],
  derivation: {
    title: 'Kp = Kc(RT)^Δn',
    steps: [
      { text: 'Take a general gas reaction $a\\,\\mathrm{A} + b\\,\\mathrm{B} \\rightleftharpoons c\\,\\mathrm{C} + d\\,\\mathrm{D}$ and write $K_p$:', tex: 'K_p = \\frac{p_C^{\\,c}\\,p_D^{\\,d}}{p_A^{\\,a}\\,p_B^{\\,b}}' },
      { text: 'For each ideal gas, $p_i = [i]\\,RT$. Substitute:', tex: 'K_p = \\frac{[C]^c (RT)^c\\,[D]^d (RT)^d}{[A]^a (RT)^a\\,[B]^b (RT)^b}' },
      { text: 'The concentrations make $K_c$; the factors of $RT$ collect into one power:', tex: 'K_p = K_c\\,(RT)^{(c + d) - (a + b)} = K_c\\,(RT)^{\\Delta n}' }
    ],
    outro: 'Coefficients of solids and liquids never enter, because they are not in either expression.'
  },
  examples: [
    {
      title: 'Nitrogen dioxide at room temperature',
      q: 'For $\\ce{N2O4(g) <=> 2NO2(g)}$, $K_p = 0.15$ at 25 °C (pressures in bar). What is $K_c$?',
      steps: [
        '$\\Delta n = 2 - 1 = +1$, so $K_c = K_p/(RT)$.',
        '$RT = 0.08314 \\times 298.15 = 24.79$ L·bar/mol.',
        '$K_c = 0.15/24.79 = 6.1\\times10^{-3}$.'
      ],
      a: 'K_c ≈ 6.1 × 10⁻³.'
    },
    {
      title: 'Ammonia at 472 °C',
      q: 'For $\\ce{N2 + 3H2 <=> 2NH3}$, $K_c = 0.105$ at 472 °C. What is $K_p$ in bar?',
      steps: [
        '$\\Delta n = 2 - 4 = -2$, so $K_p = K_c\\,(RT)^{-2}$.',
        '$T = 745.15$ K; $RT = 0.08314 \\times 745.15 = 61.95$.',
        '$K_p = 0.105/61.95^2 = 0.105/3838 = 2.74\\times10^{-5}$.'
      ],
      a: 'K_p ≈ 2.7 × 10⁻⁵ (bar⁻²).'
    }
  ],
  quiz: [
    { q: 'For $\\ce{H2(g) + I2(g) <=> 2HI(g)}$, how are $K_p$ and $K_c$ related?', choices: ['$K_p = K_c$', '$K_p = K_c RT$', '$K_p = K_c/(RT)^2$', 'they cannot be compared'], a: 0,
      why: 'Two moles of gas on each side, so $\\Delta n = 0$ and $(RT)^0 = 1$.' },
    { q: 'For $\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$ at 700 K, $K_p$ (bar) compared with $K_c$ (mol/L) is…', choices: ['larger, by a factor of about 58', 'smaller, by a factor of about 58', 'the same', 'smaller, by a factor of about 3400'], a: 1,
      why: '$\\Delta n = 2 - 3 = -1$, so $K_p = K_c/(RT)$ with $RT = 0.08314 \\times 700 = 58$.' },
    { q: '$\\ce{N2O4 <=> 2NO2}$ has $K_p = 0.15$ (bar) at 25 °C. What is $K_c$?', answer: 0.00605,
      why: '$K_c = K_p/(RT) = 0.15/(0.08314 \\times 298.15) = 6.05\\times10^{-3}$.' },
    { q: 'What is $\\Delta n$ for $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$?', answer: 1,
      why: 'Only gases count: one mole of CO₂ on the right, none on the left.' },
    { q: 'Adding argon to a fixed-volume vessel containing an equilibrium gas mixture changes the partial pressures of the reacting gases.', a: false,
      why: 'Each partial pressure is $n_iRT/V$; with n, T and V unchanged it stays the same. Only the total pressure rises, and the equilibrium does not shift.' }
  ],
  applications: [
    'Designing gas-phase reactors: ammonia, methanol, sulfur trioxide, steam reforming.',
    'Decomposition pressures: limestone in lime kilns, carbonates and hydrates in drying and calcining.',
    'Atmospheric and combustion chemistry, where compositions come from gas sensors as pressures or mole fractions.'
  ],
  sim: 'eq-lechatelier'
},

{
  id: 'ice-tables', parent: 'equilibrium-basics', title: 'Equilibrium calculations with ICE tables', level: 2,
  short: 'To find an equilibrium composition, tabulate the Initial amounts, the Change (one unknown x times the coefficients) and the Equilibrium amounts, put them into K and solve for x — keeping the root that makes physical sense.',
  keywords: ['ICE table', 'RICE table', 'equilibrium calculation', 'extent of reaction', 'quadratic', 'small-x approximation', '5 % rule', 'physical root', 'successive approximation'],
  prereq: ['equilibrium-constant', 'reaction-quotient', 'math:quadratic-equations'],
  related: ['weak-acids', 'buffers', 'solubility-product', 'limiting-reagent', 'math:newtons-method', 'le-chatelier'],
  body: `
Given K and a starting mixture, what is the composition at equilibrium? The bookkeeping that answers it is the **ICE table**: Initial, Change, Equilibrium.

### The method
1. Write the balanced equation and the expression for K.
2. **Initial**: the concentrations (or pressures) you start with. If both reactants and products are present, work out $Q$ and compare it with $K$ to see which way the reaction will go ([[reaction-quotient]]).
3. **Change**: let the reaction advance by $x$. Each species changes by its coefficient times $x$ — minus for what is used, plus for what is made. That is the whole point: the changes are not independent, the equation ties them together.
4. **Equilibrium**: Initial + Change, in terms of $x$.
5. Put the equilibrium row into K, solve for $x$, and check.

For 0.0100 mol/L each of hydrogen and iodine at 430 °C ($K_c = 54$):

| | $[\\ce{H2}]$ | $[\\ce{I2}]$ | $[\\ce{HI}]$ |
|---|---|---|---|
| I | 0.0100 | 0.0100 | 0 |
| C | $-x$ | $-x$ | $+2x$ |
| E | $0.0100 - x$ | $0.0100 - x$ | $2x$ |

$$54 = \\frac{(2x)^2}{(0.0100 - x)^2}$$

Both sides are perfect squares, so take the square root: $7.35 = 2x/(0.0100 - x)$, which gives $x = 0.00786$. At equilibrium $[\\ce{HI}] = 0.0157$ and $[\\ce{H2}] = [\\ce{I2}] = 0.0021$ mol/L; putting them back into the expression gives 54 again — the check.

### Choosing the root
Usually the equation is a [[math:quadratic-equations|quadratic]] with two roots, and only one makes sense. The allowed range of $x$ is set by the stoichiometry: no concentration may become negative. With 0.0100 M hydrogen and 0.0080 M iodine the same K gives $-50x^2 + 0.972x - 0.00432 = 0$, with roots 0.00688 and 0.0126. The second would leave a negative amount of iodine, so the answer is $x = 0.00688$. A negative $x$ is perfectly fine when the reaction runs backwards; it just has to keep every concentration at zero or above.

### The small-x shortcut
When K is small and the starting concentration large, little reacts, and $c - x \\approx c$. For a [[weak-acids|weak acid]] $\\ce{HA <=> H+ + A-}$ at concentration $c$,

$$K_a = \\frac{x^2}{c - x} \\approx \\frac{x^2}{c} \\quad\\Rightarrow\\quad x \\approx \\sqrt{K_a c}$$

For 0.10 M acetic acid ($K_a = 1.8\\times10^{-5}$) the shortcut gives $1.34\\times10^{-3}$ M and the exact root $1.33\\times10^{-3}$ M — well under 1 % apart. The usual test is that $x$ must come out below 5 % of $c$, which happens when $c/K$ is above about 400. For 0.050 M dinitrogen tetroxide ($K_c = 6.1\\times10^{-3}$, $c/K \\approx 8$) the shortcut gives 9 % too much $\\ce{NO2}$; solve the quadratic instead.

### Bigger problems
Reactions like ammonia synthesis give equations of the third or fourth degree. Solve them numerically — by trial, by [[math:newtons-method|Newton's method]], or with the calculators here — and keep the root inside the allowed range. When K is very large, first let the reaction go to completion (the [[limiting-reagent]] decides how far), then let a small $x$ run backwards from there: the shortcut works again.
`,
  ideas: [
    'Initial + Change = Equilibrium, with every change a coefficient times one unknown x.',
    'Compare Q with K first to know the sign of x.',
    'Of the roots of the equation, keep the one that leaves every concentration non-negative.',
    'If x < 5 % of the starting concentration (c/K above about 400), c − x ≈ c and x ≈ √(Kc).',
    'Always check by putting the answer back into K.'
  ],
  pitfalls: [
    'Using the starting concentrations in K — K holds only for the equilibrium row. The initial row gives Q.',
    'Changing every species by x — The changes follow the coefficients: in H₂ + I₂ ⇌ 2HI, hydrogen iodide changes by 2x.',
    'Trusting the small-x shortcut blindly — Check the 5 % rule afterwards; for weak acids that are fairly strong or very dilute it fails, and the quadratic is needed.'
  ],
  formulas: [
    {
      name: 'One species splitting into two, HA ⇌ H⁺ + A⁻',
      expr: 'K = x^2/(c - x)', tex: 'K = \\frac{x^2}{c - x}',
      vars: {
        K: { name: 'equilibrium constant (e.g. Kₐ)', value: 1.8e-5 },
        x: { name: 'amount that splits, x (mol/L)', value: 1.3e-3 },
        c: { name: 'starting concentration c (mol/L)', value: 0.10 }
      },
      solveFor: 'x',
      note: 'The exact ICE result for $\\ce{HA <=> H+ + A-}$ starting from pure HA: $x$ is $[\\ce{H+}] = [\\ce{A-}]$ at equilibrium. Defaults: 0.10 M acetic acid, $K_a = 1.8\\times10^{-5}$. $x$ appears twice, so it is found numerically; only the positive root is physical.',
      practice: { unknowns: ['x', 'K'] },
      stories: {
        x: 'A weak acid with $K_a$ = {K} is dissolved at {c} mol/L. What is $[\\ce{H+}]$ at equilibrium, in mol/L?',
        K: 'A {c} mol/L solution of a weak acid has $[\\ce{H+}]$ = {x} mol/L at equilibrium. What is its $K_a$?'
      }
    },
    {
      name: 'The small-x approximation',
      expr: 'x = sqrt(K*c)', tex: 'x \\approx \\sqrt{Kc}',
      vars: {
        x: { name: 'amount that splits, x (mol/L)' },
        K: { name: 'equilibrium constant', value: 1.8e-5 },
        c: { name: 'starting concentration c (mol/L)', value: 0.10 }
      },
      note: 'Valid when $x$ comes out below about 5 % of $c$ (that is, $c/K > 400$). Compare with the exact calculator above.',
      practice: { unknowns: ['x', 'K'] },
      stories: {
        x: 'Estimate $[\\ce{H+}]$ in a {c} mol/L solution of a weak acid with $K_a$ = {K}, using the small-x approximation.'
      }
    },
    {
      name: 'H₂ + I₂ ⇌ 2HI from equal starting amounts',
      expr: 'sqrt(Kc) = 2*x/(c0 - x)', tex: '\\sqrt{K_c} = \\frac{2x}{c_0 - x}',
      vars: {
        Kc: { name: 'equilibrium constant', value: 54, tex: 'K_c' },
        x: { name: 'amount of H₂ (and of I₂) that reacts, x (mol/L)', value: 0.008 },
        c0: { name: 'starting concentration of H₂ and of I₂ (mol/L)', value: 0.0100, tex: 'c_0' }
      },
      solveFor: 'x',
      note: 'With equal starting amounts and no HI, $K_c = (2x)^2/(c_0 - x)^2$ is a perfect square; taking the square root leaves a linear equation. At equilibrium $[\\ce{HI}] = 2x$ and $[\\ce{H2}] = [\\ce{I2}] = c_0 - x$. $K_c = 54$ at 430 °C.',
      practice: { unknowns: ['x'] },
      stories: {
        x: 'Hydrogen and iodine, {c0} mol/L of each, are heated to the temperature where $K_c$ = {Kc}. How much of each reacts, in mol/L?',
        Kc: 'Hydrogen and iodine start at {c0} mol/L each; at equilibrium {x} mol/L of each has reacted. What is $K_c$?'
      }
    }
  ],
  derivation: {
    title: 'The exact weak-acid root',
    steps: [
      { text: 'Clear the fraction in $K = x^2/(c - x)$:', tex: 'x^2 + Kx - Kc = 0' },
      { text: 'Solve the quadratic:', tex: 'x = \\frac{-K \\pm \\sqrt{K^2 + 4Kc}}{2}' },
      { text: 'The product of the two roots is $-Kc < 0$, so one is negative and one positive. A negative $x$ would mean negative $[\\ce{H+}]$: keep the plus sign.', tex: 'x = \\frac{-K + \\sqrt{K^2 + 4Kc}}{2}' },
      { text: 'When $K \\ll c$, $K^2$ is negligible beside $4Kc$ and $-K$ beside the square root, and the exact root tends to the shortcut:', tex: 'x \\to \\frac{\\sqrt{4Kc}}{2} = \\sqrt{Kc}' }
    ]
  },
  examples: [
    {
      title: 'Dinitrogen tetroxide, where the shortcut fails',
      q: '0.0500 mol/L of $\\ce{N2O4}$ is sealed in a flask at 25 °C, where $K_c = 6.1\\times10^{-3}$ for $\\ce{N2O4 <=> 2NO2}$. Find the equilibrium concentrations.',
      steps: [
        'ICE: $[\\ce{N2O4}] = 0.0500 - x$, $[\\ce{NO2}] = 2x$, so $6.1\\times10^{-3} = (2x)^2/(0.0500 - x)$.',
        'Rearranged: $4x^2 + 6.1\\times10^{-3}x - 3.05\\times10^{-4} = 0$.',
        { text: 'Quadratic formula, positive root:', tex: 'x = \\frac{-0.0061 + \\sqrt{0.0061^2 + 16 \\times 3.05\\times10^{-4}}}{8} = 0.00800' },
        '$[\\ce{NO2}] = 0.0160$ mol/L, $[\\ce{N2O4}] = 0.0420$ mol/L: 16 % of the tetroxide has split.',
        'The shortcut $x \\approx \\sqrt{Kc/4} = 0.00873$ would be 9 % too high — $x$ is 16 % of $c$, far beyond the 5 % rule.'
      ],
      a: '[NO₂] = 0.0160 M, [N₂O₄] = 0.0420 M.'
    },
    {
      title: 'Running backwards from pure product',
      q: 'Pure hydrogen iodide at 0.0300 mol/L is heated to 430 °C ($K_c = 54$). What is the equilibrium mixture?',
      steps: [
        'Q is infinite (no $\\ce{H2}$ or $\\ce{I2}$), so the reaction runs backwards. Let $2y$ of HI decompose: $[\\ce{HI}] = 0.0300 - 2y$, $[\\ce{H2}] = [\\ce{I2}] = y$.',
        'Square root of $54 = (0.0300 - 2y)^2/y^2$: $7.348 = (0.0300 - 2y)/y$, so $y = 0.0300/9.348 = 0.00321$.',
        'Equilibrium: $[\\ce{H2}] = [\\ce{I2}] = 0.00321$ and $[\\ce{HI}] = 0.0236$ mol/L — 21 % of the HI has decomposed.'
      ],
      a: '0.00321 M H₂ and I₂, 0.0236 M HI.'
    }
  ],
  quiz: [
    { q: 'Solving an ICE table gives two roots, $x = 0.0069$ and $x = 0.0126$, for a mixture that started with 0.0100 M $\\ce{H2}$ and 0.0080 M $\\ce{I2}$. Which is the answer?', choices: ['0.0069, because 0.0126 would make [I₂] negative', '0.0126, the larger root', 'either: both satisfy the equation', 'their average'], a: 0,
      why: 'Both solve the algebra, but only 0.0069 keeps every concentration non-negative: 0.0080 − 0.0126 < 0.' },
    { q: 'What is $[\\ce{H+}]$ in 0.10 M acetic acid ($K_a = 1.8\\times10^{-5}$), in mol/L?', answer: 1.33e-3,
      why: 'Exact root of $x^2/(0.10 - x) = 1.8\\times10^{-5}$: $x = 1.33\\times10^{-3}$ M (the shortcut $\\sqrt{Kc}$ gives $1.34\\times10^{-3}$, within 1 %).' },
    { q: 'In which case is the small-x approximation safe?', choices: ['K = 1.8 × 10⁻⁵, c = 0.10 M', 'K = 6.1 × 10⁻³, c = 0.050 M', 'K = 0.10, c = 0.10 M', 'K = 54, c = 0.010 M'], a: 0,
      why: 'Only the first has c/K above 400 (5600), so x is under 5 % of c. The others would all be badly wrong.' },
    { q: 'In the Change row of an ICE table for $\\ce{N2 + 3H2 <=> 2NH3}$, the entries are…', choices: ['−x, −x, +x', '−x, −3x, +2x', '−x, −3x, +x', '−3x, −x, +2x'], a: 1,
      why: 'The changes follow the coefficients: for every x of nitrogen used, 3x of hydrogen is used and 2x of ammonia made.' },
    { q: 'Hydrogen and iodine start at 0.0200 M each at 430 °C ($K_c = 54$). What is $[\\ce{HI}]$ at equilibrium, in mol/L?', answer: 0.0314,
      why: '$\\sqrt{54} = 7.348 = 2x/(0.0200 - x)$ gives $x = 0.01572$, so $[\\ce{HI}] = 2x = 0.0314$ M.' }
  ],
  applications: [
    'The pH of weak acids and bases and the composition of buffers.',
    'Equilibrium conversion in industrial gas reactors, used to size recycle loops.',
    'Solubility and complex-ion calculations in analytical chemistry and water treatment.',
    'Speciation models in geochemistry and environmental chemistry, which solve hundreds of coupled ICE problems at once.'
  ],
  sim: 'eq-ice'
},

{
  id: 'le-chatelier', parent: 'equilibrium-basics', title: 'Le Chatelier\'s principle', level: 1,
  short: 'Disturb an equilibrium — add or remove a substance, compress it, heat it — and it shifts in the direction that partly undoes the disturbance.',
  keywords: ['Le Chatelier', 'shift', 'disturbance', 'concentration change', 'pressure change', 'inert gas', 'temperature change', 'NO2 syringe', 'cobalt chloride', 'Haber process', 'compromise conditions'],
  prereq: ['dynamic-equilibrium', 'reaction-quotient', 'equilibrium-constant'],
  related: ['kp-kc', 'vant-hoff', 'common-ion-effect', 'buffers', 'catalysis', 'henrys-law'],
  body: `
Disturb a system at equilibrium and it responds by shifting in the direction that **partly undoes** the disturbance. That is Le Chatelier's principle, the quickest way to predict what an equilibrium will do — although in every case the reason is the comparison of $Q$ with $K$ ([[reaction-quotient]]).

### Changing a concentration
Add a reactant and $Q$ drops below $K$ (its denominator grew): the reaction runs forward, using up some of what you added. Removing a product does the same. The shift never cancels the change completely. Take an equilibrium mixture at 430 °C with 0.0021 mol/L each of $\\ce{H2}$ and $\\ce{I2}$ and 0.0157 mol/L of $\\ce{HI}$, and add 0.0100 mol/L of hydrogen. The reaction uses 0.0015 mol/L of the extra hydrogen and settles with $[\\ce{H2}] = 0.0106$ — far more than before, but less than just after the addition. K is unchanged; the composition has moved.

### Changing the pressure
Squeezing a gas mixture by a factor $f$ multiplies every partial pressure by $f$, so $Q_p$ becomes $K_p f^{\\Delta n}$ ([[kp-kc]]). If the reaction reduces the number of gas molecules ($\\Delta n < 0$), $Q$ falls below $K$ and the reaction runs forward, towards fewer molecules and a lower pressure. For $\\ce{N2O4 <=> 2NO2}$ at 25 °C, going from 1 to 2 bar cuts the fraction of the tetroxide that is split from 19 % to 14 %.

Two cases catch people out:
- If $\\Delta n = 0$, as in $\\ce{H2 + I2 <=> 2HI}$, pressure has **no effect** on the composition.
- Adding an **inert gas** at constant volume raises the total pressure but not the partial pressures of the reacting gases, so nothing shifts. Adding it at constant **pressure** lets the mixture expand — a dilution — and the equilibrium moves towards the side with more molecules.

### Changing the temperature
Temperature is different: it changes $K$ itself. Treat heat as a product of an exothermic reaction and as a reactant of an endothermic one; heating then shifts an exothermic equilibrium backwards and an endothermic one forwards. Ammonia synthesis releases 92 kJ per mole of nitrogen, so its K falls as the temperature rises. Splitting dinitrogen tetroxide absorbs 57 kJ/mol, so warm $\\ce{NO2}$ gas is dark brown and ice-cold gas is almost colourless. The numbers come from the [[vant-hoff|van 't Hoff equation]].

A **catalyst** does not shift an equilibrium at all: it speeds the forward and reverse reactions equally.

### In practice
- The **Haber process** runs at high pressure (fewer gas molecules on the ammonia side), removes ammonia by condensing it, and chooses a moderate temperature as a compromise between yield and rate.
- A bottle of fizzy drink keeps carbon dioxide dissolved under pressure ([[henrys-law]]). Open it, the pressure drops, and the gas comes out of solution.
- At altitude the lower oxygen pressure means haemoglobin leaves the lungs less fully loaded; over a few weeks the body answers by making more red blood cells.
- Two classroom colours: pink $\\ce{[Co(H2O)6]^2+}$ turning blue $\\ce{[CoCl4]^2-}$ when chloride is added or the solution is heated, and blood-red $\\ce{[Fe(SCN)]^2+}$ deepening when more $\\ce{Fe^3+}$ or $\\ce{SCN-}$ is added.

> [!warn] Le Chatelier's principle predicts the direction of a shift, not its size, and it is a summary rather than an explanation. When in doubt, compute $Q$ and compare it with $K$.
`,
  ideas: [
    'An equilibrium shifts to partly undo a disturbance, never to cancel it fully.',
    'Adding a substance shifts the reaction to use it up; removing one shifts it to replace it.',
    'Compression favours the side with fewer gas molecules; if Δn = 0 pressure has no effect.',
    'An inert gas at constant volume changes nothing; at constant pressure it acts as a dilution.',
    'Only temperature changes K: heating favours the endothermic direction. Catalysts shift nothing.'
  ],
  pitfalls: [
    'Raising the total pressure always shifts an equilibrium — Only if the partial pressures of the reacting gases change and Δn ≠ 0. Pumping in argon at fixed volume changes nothing.',
    'Adding a reactant changes K — It changes Q. The system moves until Q equals the same K again.',
    'The shift restores the original concentrations — It only partly undoes the change. After adding hydrogen, [H₂] ends up higher than before the addition.'
  ],
  formulas: [
    {
      name: 'Compression and the reaction quotient',
      expr: 'Q = K*f^dn', tex: 'Q = K\\,f^{\\,\\Delta n}',
      vars: {
        Q: { name: 'reaction quotient just after compressing' },
        K: { name: 'equilibrium constant (Kc, or Kp)', value: 6.1e-3 },
        f: { name: 'factor by which every concentration (or partial pressure) is multiplied', value: 2 },
        dn: { name: 'moles of gaseous products − moles of gaseous reactants', value: 1, int: true, signed: true, tex: '\\Delta n' }
      },
      note: 'Halving the volume makes $f = 2$. If $\\Delta n > 0$ the result is $Q > K$ and the reaction runs backwards; if $\\Delta n < 0$, $Q < K$ and it runs forward. Defaults: $\\ce{N2O4 <=> 2NO2}$ at 25 °C.',
      practice: { unknowns: ['Q'] },
      stories: {
        Q: 'An equilibrium mixture with K = {K} and $\\Delta n$ = {dn} is compressed so that every concentration is multiplied by {f}. What is Q immediately afterwards?'
      }
    },
    {
      name: 'Fraction of N₂O₄ dissociated at total pressure P',
      expr: 'Kp = 4*alpha^2/(1 - alpha^2)*P/p0', tex: 'K_p = \\frac{4\\alpha^2}{1 - \\alpha^2}\\,\\frac{P}{p^\\circ}',
      vars: {
        Kp: { name: 'equilibrium constant (bar)', value: 0.15, tex: 'K_p' },
        alpha: { name: 'fraction of the N₂O₄ that has split', min: 0, max: 1, value: 0.19 },
        P: { name: 'total pressure', q: 'pressure', unit: 'bar', value: 1 },
        p0: { name: 'standard pressure', q: 'pressure', unit: 'bar', value: 1, fixed: true, tex: 'p^\\circ' }
      },
      solveFor: 'alpha',
      note: 'For $\\ce{N2O4 <=> 2NO2}$ ($K_p = 0.15$ at 25 °C). Raise $P$ and $\\alpha$ falls: compression favours the side with fewer molecules.',
      practice: { unknowns: ['alpha', 'P'] },
      stories: {
        alpha: 'Dinitrogen tetroxide ($K_p$ = {Kp} at 25 °C) is held at a total pressure of {P}. What fraction of it is split into $\\ce{NO2}$?',
        P: 'At 25 °C ($K_p$ = {Kp}), at what total pressure is a fraction {alpha} of the $\\ce{N2O4}$ dissociated?'
      }
    }
  ],
  derivation: {
    title: 'How far N₂O₄ splits at a given pressure',
    steps: [
      'Start with $n$ mol of $\\ce{N2O4}$ and let a fraction $\\alpha$ split: $n(1 - \\alpha)$ mol $\\ce{N2O4}$ and $2n\\alpha$ mol $\\ce{NO2}$, $n(1 + \\alpha)$ mol in all.',
      { text: 'Partial pressures are mole fractions times the total pressure $P$:', tex: 'p_{\\ce{NO2}} = \\frac{2\\alpha}{1 + \\alpha}P, \\qquad p_{\\ce{N2O4}} = \\frac{1 - \\alpha}{1 + \\alpha}P' },
      { text: 'Put them into $K_p = p_{\\ce{NO2}}^2/(p_{\\ce{N2O4}}\\,p^\\circ)$; one factor $(1 + \\alpha)$ cancels:', tex: 'K_p = \\frac{4\\alpha^2}{(1 - \\alpha)(1 + \\alpha)}\\,\\frac{P}{p^\\circ} = \\frac{4\\alpha^2}{1 - \\alpha^2}\\,\\frac{P}{p^\\circ}' },
      { text: 'Solved for $\\alpha$ it shows the pressure dependence at a glance:', tex: '\\alpha = \\sqrt{\\frac{K_p}{K_p + 4P/p^\\circ}}' }
    ]
  },
  examples: [
    {
      title: 'Adding hydrogen to an equilibrium',
      q: 'An equilibrium mixture at 430 °C ($K_c = 54$) has $[\\ce{H2}] = [\\ce{I2}] = 0.00214$ and $[\\ce{HI}] = 0.01572$ mol/L. Hydrogen is added to raise $[\\ce{H2}]$ by 0.0100 mol/L. Find the new equilibrium.',
      steps: [
        'Just after the addition: $Q = 0.01572^2/(0.01214 \\times 0.00214) = 9.5 < 54$, so the reaction runs forward.',
        'ICE from there: $[\\ce{H2}] = 0.01214 - x$, $[\\ce{I2}] = 0.00214 - x$, $[\\ce{HI}] = 0.01572 + 2x$.',
        'Solving $54 = (0.01572 + 2x)^2/[(0.01214 - x)(0.00214 - x)]$ for the root below 0.00214 gives $x = 0.00152$.',
        'New equilibrium: $[\\ce{H2}] = 0.0106$, $[\\ce{I2}] = 0.00061$, $[\\ce{HI}] = 0.0188$ mol/L.',
        'Only 15 % of the added hydrogen reacted; the iodine, not the hydrogen, was pulled down hardest. The result is the same as starting from 0.0200 M $\\ce{H2}$ and 0.0100 M $\\ce{I2}$: equilibrium does not remember the route.'
      ],
      a: '[H₂] = 0.0106 M, [I₂] = 0.00061 M, [HI] = 0.0188 M.'
    },
    {
      title: 'Squeezing a syringe of NO₂',
      q: 'A syringe of $\\ce{N2O4}$/$\\ce{NO2}$ at 25 °C ($K_p = 0.15$) is at 1.00 bar. It is compressed until the total pressure, after the gas has settled, is 2.00 bar. How do the fraction dissociated and the partial pressure of the brown $\\ce{NO2}$ change?',
      steps: [
        'At 1 bar: $\\alpha = \\sqrt{0.15/(0.15 + 4)} = 0.190$, so $p_{\\ce{NO2}} = 2\\alpha P/(1 + \\alpha) = 0.319$ bar.',
        'At 2 bar: $\\alpha = \\sqrt{0.15/(0.15 + 8)} = 0.136$, so $p_{\\ce{NO2}} = 2 \\times 0.136 \\times 2.00/1.136 = 0.478$ bar.',
        'The squeeze first darkens the gas (every concentration rises), then the colour fades back part of the way as $\\ce{NO2}$ pairs up. It ends 1.5 times darker, not twice.'
      ],
      a: 'α falls from 19 % to 14 %; p(NO₂) rises from 0.32 to 0.48 bar, not to 0.64.'
    }
  ],
  quiz: [
    { q: 'Argon is pumped into a rigid vessel holding $\\ce{N2O4}$ and $\\ce{NO2}$ at equilibrium. The equilibrium…', choices: ['shifts towards NO₂', 'shifts towards N₂O₄', 'does not shift', 'shifts one way, then back'], a: 2,
      why: 'At constant volume the partial pressures of the reacting gases do not change, so Q is still equal to K.' },
    { q: 'The volume of an equilibrium mixture of $\\ce{2SO2(g) + O2(g) <=> 2SO3(g)}$ is halved. The amount of $\\ce{SO3}$…', choices: ['increases', 'decreases', 'stays the same', 'first decreases, then returns'], a: 0,
      why: 'Three gas molecules on the left, two on the right: compression favours the right, so more SO₃ forms.' },
    { q: 'An exothermic equilibrium is heated. What happens?', choices: ['K increases and the mixture shifts to products', 'K decreases and the mixture shifts to reactants', 'K is unchanged but the mixture shifts to reactants', 'nothing, until a catalyst is added'], a: 1,
      why: 'Heat acts like a product of an exothermic reaction. Temperature is the one disturbance that changes K; for ΔH < 0, K falls as T rises.' },
    { q: 'A catalyst added to an equilibrium mixture increases the amount of product.', a: false,
      why: 'A catalyst speeds forward and reverse reactions by the same factor. The mixture is already at equilibrium, so nothing changes.' },
    { q: 'At 25 °C ($K_p = 0.15$), what fraction of $\\ce{N2O4}$ is dissociated at a total pressure of 4.0 bar?', answer: 0.0964,
      why: '$\\alpha = \\sqrt{0.15/(0.15 + 16)} = 0.096$: about 10 %, against 19 % at 1 bar.' }
  ],
  applications: [
    'Choosing pressure, temperature and recycle in the Haber–Bosch and contact processes.',
    'Carbonated drinks, diving and decompression: gas solubility responding to pressure.',
    'Oxygen transport: haemoglobin loading in the lungs and unloading in working muscle.',
    'Ocean acidification: extra dissolved carbon dioxide shifting the carbonate equilibria that shell-building animals depend on.'
  ],
  history: 'Henri Le Chatelier, a French chemist and mining engineer, stated the principle in 1884; Ferdinand Braun reached a similar statement independently a few years later. Le Chatelier also tried to make ammonia from its elements under pressure in 1901, but an explosion ended the work — a discovery he later said he had let slip to Haber.',
  sim: 'eq-lechatelier'
},

{
  id: 'vant-hoff', parent: 'equilibrium-basics', title: 'Temperature and K: the van \'t Hoff equation', level: 3,
  short: 'An equilibrium constant changes with temperature according to the enthalpy of reaction: ln K falls on a straight line against 1/T with slope −ΔH°/R. Exothermic reactions lose K on heating, endothermic ones gain it.',
  keywords: ['van \'t Hoff equation', 'temperature dependence of K', 'ln K against 1/T', 'enthalpy of reaction', 'exothermic', 'endothermic', 'Haber process', 'yield against rate', 'compromise temperature'],
  prereq: ['equilibrium-constant', 'gibbs-equilibrium', 'enthalpy', 'math:logarithms'],
  related: ['le-chatelier', 'arrhenius-equation', 'clausius-clapeyron', 'gibbs-temperature', 'kp-kc', 'math:linear-regression'],
  body: `
Of everything that disturbs an equilibrium, only temperature changes the equilibrium constant itself. How strongly depends on the enthalpy of reaction.

### From free energy to temperature
Two thermodynamic relations meet here. The standard free energy fixes K, $\\Delta G^\\circ = -RT\\ln K$ ([[gibbs-equilibrium]]), and it is made of an enthalpy part and an entropy part, $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$ ([[gibbs-energy]]). Put them together:

$$\\ln K = -\\frac{\\Delta H^\\circ}{R}\\cdot\\frac{1}{T} + \\frac{\\Delta S^\\circ}{R}$$

Plot $\\ln K$ against $1/T$ and you get a straight line of slope $-\\Delta H^\\circ/R$ — the **van 't Hoff plot**. Between two temperatures,

$$\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)$$

- **Exothermic** ($\\Delta H^\\circ < 0$): K falls as the temperature rises.
- **Endothermic** ($\\Delta H^\\circ > 0$): K rises as the temperature rises.
- The larger $|\\Delta H^\\circ|$, the steeper the change.

This is [[le-chatelier|Le Chatelier's principle]] for heating, made quantitative. Splitting dinitrogen tetroxide ($\\Delta H^\\circ = +57$ kJ/mol) has $K_p = 0.15$ at 25 °C and about 15 at 100 °C: the gas goes from mostly colourless to mostly brown. Because K sits inside a [[math:logarithms|logarithm]], a modest $\\Delta H^\\circ$ and a modest temperature change multiply K a hundredfold.

### Family resemblances
The [[clausius-clapeyron|Clausius–Clapeyron equation]] for vapour pressure is this same equation applied to the equilibrium between a liquid and its vapour, with the enthalpy of vaporisation as $\\Delta H^\\circ$. The [[arrhenius-equation|Arrhenius equation]] has the same shape with an activation energy in its place — and for a one-step reaction, where $K = k_f/k_r$, the difference between the forward and reverse activation energies is $\\Delta H^\\circ$.

### Yield against rate: the Haber process
For $\\ce{N2(g) + 3H2(g) <=> 2NH3(g)}$, $\\Delta H^\\circ$ is −92 kJ/mol at 25 °C (about −105 kJ/mol near 450 °C). At room temperature $K_p$ is about $6\\times10^5$ and ammonia would win — but the triple bond of nitrogen makes the reaction immeasurably slow. Heating speeds it up and, because it is exothermic, shrinks K: from $4\\times10^{-3}$ at 300 °C to $1.5\\times10^{-5}$ at 500 °C (pressures in bar). At equilibrium under 200 bar the gas holds about 35 % ammonia at 400 °C, 25 % at 450 °C and 17 % at 500 °C. Plants settle near 400–450 °C with an iron catalyst — fast enough, with a yield still worth having — and make up the difference by condensing out the ammonia and recycling the rest. The same compromise sets the temperature of sulfur dioxide oxidation in sulfuric acid plants and of methanol synthesis.

### Measuring ΔH° without a calorimeter
Measure K at several temperatures, plot $\\ln K$ against $1/T$ and fit a line ([[math:linear-regression|least squares]]): the slope gives $\\Delta H^\\circ$ and the intercept $\\Delta S^\\circ$. Biochemists measure the enthalpies of protein folding and ligand binding this way. The straight line assumes $\\Delta H^\\circ$ is constant, which holds well over a hundred degrees or so; over wider ranges it drifts, because reactants and products have different heat capacities — that is why the ammonia value moves from −92 to −105 kJ/mol between 25 °C and 450 °C.
`,
  ideas: [
    'ln K = −ΔH°/(RT) + ΔS°/R: a plot of ln K against 1/T is a straight line of slope −ΔH°/R.',
    'Exothermic reactions have smaller K at higher temperature; endothermic ones larger.',
    'Two values of K at two temperatures give ΔH°; the line\'s intercept gives ΔS°.',
    'For exothermic syntheses such as ammonia, the operating temperature is a compromise between equilibrium yield and rate.',
    'The equation assumes ΔH° constant; over wide ranges heat capacities make it drift.'
  ],
  pitfalls: [
    'Raising the temperature always increases K, because reactions go faster — Rates always rise with temperature; K rises only for endothermic reactions. For exothermic ones it falls.',
    'A catalyst lets you get a high yield at high temperature — A catalyst changes neither K nor its temperature dependence; it only lets equilibrium be approached at a lower temperature, where K is larger.',
    'Using °C in 1/T — The temperatures must be absolute (kelvin); 1/(25 °C) is meaningless.'
  ],
  formulas: [
    {
      name: 'K at two temperatures',
      expr: 'ln(K2/K1) = -dH/R*(1/T2 - 1/T1)', tex: '\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)',
      vars: {
        K2: { name: 'equilibrium constant at T₂', tex: 'K_2' },
        K1: { name: 'equilibrium constant at T₁', value: 0.15, tex: 'K_1' },
        dH: { name: 'standard enthalpy of reaction', q: 'molarenergy', unit: 'kJ/mol', value: 57.2, signed: true, tex: '\\Delta H^\\circ' },
        R: { const: 'R' },
        T2: { name: 'second temperature', q: 'temperature', unit: 'K', value: 373.15, tex: 'T_2' },
        T1: { name: 'first temperature', q: 'temperature', unit: 'K', value: 298.15, tex: 'T_1' }
      },
      note: 'Assumes $\\Delta H^\\circ$ is constant between the two temperatures. Defaults: $\\ce{N2O4 <=> 2NO2}$ from 25 °C to 100 °C.',
      practice: { unknowns: ['K2', 'dH', 'T2'] },
      stories: {
        K2: 'A reaction with $\\Delta H^\\circ$ = {dH} has K = {K1} at {T1}. What is K at {T2}?',
        dH: 'An equilibrium constant is {K1} at {T1} and {K2} at {T2}. What is the standard enthalpy of reaction?',
        T2: 'A reaction with $\\Delta H^\\circ$ = {dH} has K = {K1} at {T1}. At what temperature does K reach {K2}?'
      }
    },
    {
      name: 'K from ΔH° and ΔS°',
      expr: 'ln(K) = -dH/(R*T) + dS/R', tex: '\\ln K = -\\frac{\\Delta H^\\circ}{RT} + \\frac{\\Delta S^\\circ}{R}',
      vars: {
        K: { name: 'equilibrium constant' },
        dH: { name: 'standard enthalpy of reaction', q: 'molarenergy', unit: 'kJ/mol', value: 169, signed: true, tex: '\\Delta H^\\circ' },
        dS: { name: 'standard entropy of reaction', q: 'molarheat', unit: 'J/(mol·K)', value: 144, signed: true, tex: '\\Delta S^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 1073.15 }
      },
      note: 'Defaults: limestone, $\\ce{CaCO3(s) <=> CaO(s) + CO2(g)}$, with values that fit its measured decomposition pressure at kiln temperatures; K is the pressure of CO₂ in bar. Set $K = 1$ and solve for $T$ to find where the CO₂ pressure reaches 1 bar ($T = \\Delta H^\\circ/\\Delta S^\\circ$).',
      practice: { unknowns: ['K', 'T'] },
      stories: {
        K: 'A reaction has $\\Delta H^\\circ$ = {dH} and $\\Delta S^\\circ$ = {dS}. What is its equilibrium constant at {T}?',
        T: 'A reaction has $\\Delta H^\\circ$ = {dH} and $\\Delta S^\\circ$ = {dS}. At what temperature is K = {K}?'
      }
    }
  ],
  derivation: {
    title: 'The van \'t Hoff equation from free energy',
    steps: [
      { text: 'Equate the two expressions for the standard free energy of reaction:', tex: '-RT\\ln K = \\Delta H^\\circ - T\\Delta S^\\circ' },
      { text: 'Divide by $-RT$:', tex: '\\ln K = -\\frac{\\Delta H^\\circ}{R}\\,\\frac{1}{T} + \\frac{\\Delta S^\\circ}{R}' },
      { text: 'With $\\Delta H^\\circ$ and $\\Delta S^\\circ$ constant this is a straight line in $1/T$. Its slope is', tex: '\\frac{d\\ln K}{d(1/T)} = -\\frac{\\Delta H^\\circ}{R}' },
      { text: 'Write it at $T_1$ and $T_2$ and subtract; the entropy term cancels:', tex: '\\ln\\frac{K_2}{K_1} = -\\frac{\\Delta H^\\circ}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)' }
    ],
    outro: 'The differential form, $d\\ln K/dT = \\Delta H^\\circ/RT^2$, holds even when $\\Delta H^\\circ$ varies; integrating it with a temperature-dependent $\\Delta H^\\circ$ is how precise tables are built.'
  },
  examples: [
    {
      title: 'Nitrogen dioxide in boiling water',
      q: '$\\ce{N2O4 <=> 2NO2}$ has $K_p = 0.15$ at 25 °C and $\\Delta H^\\circ = +57.2$ kJ/mol. Estimate $K_p$ at 100 °C.',
      steps: [
        '$1/T_2 - 1/T_1 = 1/373.15 - 1/298.15 = -6.74\\times10^{-4}\\ \\mathrm{K^{-1}}$.',
        '$\\ln(K_2/K_1) = -(57\\,200/8.314) \\times (-6.74\\times10^{-4}) = +4.64$.',
        '$K_2 = 0.15\\,e^{4.64} = 0.15 \\times 103 = 15.5$.',
        'At 1 bar that means about 89 % of the tetroxide is split (from $\\alpha = \\sqrt{K/(K + 4)}$), against 19 % at room temperature.'
      ],
      a: 'K_p ≈ 15 at 100 °C, a hundred times larger.'
    },
    {
      title: 'ΔH° of ammonia synthesis from two measurements',
      q: 'For $\\ce{N2 + 3H2 <=> 2NH3}$, $K_p = 1.64\\times10^{-4}$ at 400 °C and $1.45\\times10^{-5}$ at 500 °C. What is $\\Delta H^\\circ$ in this range?',
      steps: [
        '$T_1 = 673.15$ K, $T_2 = 773.15$ K; $1/T_2 - 1/T_1 = -1.921\\times10^{-4}\\ \\mathrm{K^{-1}}$.',
        '$\\ln(K_2/K_1) = \\ln(0.0884) = -2.426$.',
        '$\\Delta H^\\circ = -R\\,\\ln(K_2/K_1)/(1/T_2 - 1/T_1) = -8.314 \\times (-2.426)/(-1.921\\times10^{-4}) = -1.05\\times10^{5}$ J/mol.',
        'About −105 kJ/mol: more exothermic than the −92 kJ/mol listed for 25 °C, because the heat capacities of the gases differ.'
      ],
      a: 'ΔH° ≈ −105 kJ/mol.'
    },
    {
      title: 'When does limestone give up its CO₂?',
      q: 'From 25 °C data, $\\Delta H^\\circ = 178.3$ kJ/mol and $\\Delta S^\\circ = 160.6$ J/(mol·K) for $\\ce{CaCO3 <=> CaO + CO2}$. At what temperature does the CO₂ pressure reach 1 bar? The measured value is near 900 °C.',
      steps: [
        '$K_p = p_{\\ce{CO2}}/p^\\circ = 1$ means $\\ln K = 0$, so $\\Delta H^\\circ = T\\Delta S^\\circ$.',
        '$T = 178\\,300/160.6 = 1110$ K, or 837 °C.',
        'The 60-degree gap to the measured 900 °C comes from treating $\\Delta H^\\circ$ and $\\Delta S^\\circ$ as constant over 800 degrees. Values fitted at kiln temperatures (about 169 kJ/mol and 144 J/(mol·K)) put it at 900 °C.'
      ],
      a: 'About 840 °C from room-temperature data; about 900 °C in reality.'
    }
  ],
  quiz: [
    { q: 'For an exothermic reaction, a plot of ln K against 1/T is a straight line with…', choices: ['a positive slope', 'a negative slope', 'zero slope', 'a slope equal to ΔS°/R'], a: 0,
      why: 'The slope is −ΔH°/R, and ΔH° < 0 makes it positive: K rises as 1/T rises, i.e. as the temperature falls.' },
    { q: '$\\ce{N2O4 <=> 2NO2}$ has $K_p = 0.15$ at 25 °C and $\\Delta H^\\circ = +57.2$ kJ/mol. Estimate $K_p$ at 50 °C.', answer: 0.894,
      why: '$\\ln(K_2/0.15) = -(57\\,200/8.314)(1/323.15 - 1/298.15) = 1.785$, so $K_2 = 0.15 \\times 5.96 = 0.89$.' },
    { q: 'Why does the Haber process run at about 450 °C rather than at 200 °C, where K is much larger?', choices: ['K is larger at 450 °C', 'at 200 °C the reaction is far too slow, even on the catalyst', 'ammonia decomposes below 400 °C', 'the catalyst melts at 200 °C'], a: 1,
      why: 'Lower temperatures give a better equilibrium yield, but equilibrium would take far too long to approach. 400–450 °C is the compromise between yield and rate.' },
    { q: 'A catalyst changes how K varies with temperature.', a: false,
      why: 'K is fixed by ΔG° = ΔH° − TΔS°, which a catalyst does not touch. It only changes how quickly equilibrium is reached.' },
    { q: 'An equilibrium constant rises from 2.0 at 300 K to 8.0 at 350 K. What is ΔH°, in kJ/mol?', answer: 24.2, unit: 'kJ/mol',
      why: '$\\Delta H^\\circ = -R\\ln 4/(1/350 - 1/300) = -8.314 \\times 1.386/(-4.76\\times10^{-4}) = 24.2$ kJ/mol: endothermic, since K rose on heating.' }
  ],
  applications: [
    'Choosing operating temperatures for ammonia, sulfuric acid and methanol plants.',
    'Measuring enthalpies of reaction, binding and protein folding from equilibrium data.',
    'Lime and cement kilns: the temperature at which limestone releases its CO₂.',
    'Engine NOx: why the hot flame makes nitric oxide that cooler exhaust cannot destroy.'
  ],
  history: 'Jacobus Henricus van \'t Hoff set out the temperature dependence of equilibrium constants in his Études de dynamique chimique (1884), which also treated reaction rates and chemical affinity. In 1901 he received the first Nobel Prize in Chemistry.',
  sim: 'eq-vanthoff'
}

);
