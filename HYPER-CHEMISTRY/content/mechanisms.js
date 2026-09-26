/* HYPER-CHEMISTRY · content/mechanisms.js — why reactions have the rates they do:
 * collisions and activation energy, the Arrhenius equation, elementary steps and
 * mechanisms, catalysts, and enzymes. */
Hyper.add(

{
  id: 'collision-theory', parent: 'mechanisms', title: 'Collision theory', level: 2,
  short: 'Molecules react only when they collide hard enough and the right way round. Only a tiny fraction of collisions carry the activation energy, and that fraction grows steeply with temperature.',
  keywords: ['collision theory', 'activation energy', 'Ea', 'collision frequency', 'Maxwell–Boltzmann distribution', 'energy distribution', 'fraction of molecules', 'orientation', 'steric factor', 'effective collision', 'temperature and rate', 'surface area'],
  prereq: ['reaction-rate', 'kinetic-molecular-theory', 'physics:maxwell-boltzmann'],
  related: ['arrhenius-equation', 'catalysis', 'rate-laws', 'reaction-mechanisms', 'physics:mean-free-path'],
  body: `
For two molecules to react they must meet. In a gas at room conditions each molecule collides with others about **7 billion times a second** — some $10^{35}$ collisions per cubic metre every second. If every collision between hydrogen and iodine molecules produced hydrogen iodide, the reaction would be over in nanoseconds. It takes hours. Almost all collisions are just bounces.

### Two conditions
1. **Enough energy.** The colliding pair must bring at least the **activation energy** $E_a$ in the motion along their line of centres. That energy goes into stretching and breaking bonds on the way to products; below it, the molecules simply rebound.
2. **The right orientation.** A hydroxide ion must strike the carbon of a bromoalkane from the side opposite the bromine, not the hydrogens on the other end. The fraction of usefully oriented collisions is the **steric factor** $P$, close to 1 for atoms and as small as $10^{-6}$ for large, fussy molecules.

### How many collisions have enough energy?
Molecular energies are spread out, following the [[physics:maxwell-boltzmann|Maxwell–Boltzmann distribution]]: most molecules have energies near $RT$ per mole (2.5 kJ/mol at room temperature), a few have much more. Typical activation energies are 50–150 kJ/mol, far out in the tail. The fraction of collisions energetic enough is

$$f = e^{-E_a/RT}$$

For $E_a = 50$ kJ/mol at 298 K, $f = 1.7\\times10^{-9}$: fewer than two collisions in a billion count. Put together,

$$\\text{rate} \\approx P \\times Z \\times e^{-E_a/RT}$$

where $Z$ is the collision frequency, proportional to the concentrations of both partners — which is where the [[rate-laws|rate law]] of a single-step reaction comes from.

### Why temperature matters so much
Heating from 25 °C to 35 °C makes the molecules move only 1.7 % faster (speed goes as $\\sqrt T$), so collisions become barely more frequent. But the tail of the distribution beyond $E_a$ grows dramatically: for $E_a = 50$ kJ/mol, $f$ rises from $1.7\\times10^{-9}$ to $3.3\\times10^{-9}$ — it nearly doubles. That is the origin of the rule of thumb that many reactions double in rate for a 10 °C rise, and of the [[arrhenius-equation|Arrhenius equation]]. The higher the barrier, the stronger the effect: at 100 kJ/mol the same 10 °C gives a factor of 3.7.

### The other factors, explained
- **Concentration and pressure:** more particles per litre, more collisions per second.
- **Surface area:** a solid reacts only at its surface; powdering it multiplies the collisions. Flour, sugar and coal dust can explode although a lump barely burns.
- **Catalysts:** open a route with a lower $E_a$, so a much larger slice of the distribution qualifies ([[catalysis|catalysis]]).
- **Light:** a photon can deliver the activation energy directly, as in photography or the reaction of hydrogen with chlorine.

> [!note] Collision theory works well for simple gas reactions and explains the trends everywhere. For reactions in solution and for complex molecules, **transition-state theory** refines it: the activation energy is the height of a pass on the energy landscape, and the rate depends on how many ways there are to cross it.
`,
  ideas: [
    'A reaction needs collisions with at least the activation energy Ea, in a suitable orientation.',
    'Only a fraction e^(−Ea/RT) of collisions is energetic enough — often less than one in a billion.',
    'Heating barely changes the collision frequency but greatly enlarges the high-energy tail of the Maxwell–Boltzmann distribution.',
    'Concentration, pressure and surface area raise the collision frequency; catalysts lower Ea.',
    'The steric factor accounts for collisions with the wrong orientation.'
  ],
  pitfalls: [
    'Heating speeds reactions mainly because molecules collide more often — A 10 °C rise increases the collision rate by under 2 %; the rate doubles because many more collisions exceed Ea.',
    'Every collision between reactants produces product — Only a tiny fraction does: those with enough energy and the right orientation.',
    'Activation energy is the energy released by the reaction — It is the barrier to be climbed first, unrelated to ΔH (an exothermic reaction can have a high barrier).'
  ],
  formulas: [
    {
      name: 'Fraction of collisions with enough energy',
      expr: 'f = exp(-Ea/(R*T))', tex: 'f = e^{-E_a/RT}',
      vars: {
        f: { name: 'fraction of collisions with energy ≥ Ea' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: 'E_a' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'Counts the energy along the line of centres of the two colliding molecules.',
      practice: { unknowns: ['f', 'Ea'] },
      stories: {
        f: 'A reaction has an activation energy of {Ea}. What fraction of collisions has enough energy at {T}?',
        Ea: 'At {T}, a fraction {f} of collisions has enough energy to react. What is the activation energy?'
      }
    },
    {
      name: 'How much the energetic fraction grows on heating',
      expr: 'F = exp(Ea/R*(1/T1 - 1/T2))', tex: 'F = \\exp\\left[\\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)\\right]',
      vars: {
        F: { name: 'factor by which the fraction grows, f₂/f₁' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' },
        T2: { name: 'higher temperature', q: 'temperature', unit: '°C', value: 35, tex: 'T_2' }
      },
      note: 'Compare the collision frequency, which grows only as $\\sqrt{T_2/T_1}$ (1.7 % for these defaults).',
      practice: { unknowns: ['F', 'Ea'] },
      stories: {
        F: 'A reaction has Ea = {Ea}. By what factor does the fraction of sufficiently energetic collisions grow between {T1} and {T2}?',
        Ea: 'Warming from {T1} to {T2} multiplies the fraction of energetic collisions by {F}. What is the activation energy?'
      }
    }
  ],
  examples: [
    {
      title: 'Most collisions fail',
      q: 'In a gas at 298 K a molecule collides about $7\\times10^{9}$ times per second. If a reaction has $E_a = 75$ kJ/mol and a steric factor of 0.1, how often does a given molecule react?',
      steps: [
        'Energy fraction: $f = \\exp(-75\\,000/(8.314\\times298.15)) = \\exp(-30.25) = 7.3\\times10^{-14}$.',
        'Successful collisions per second: $7\\times10^{9} \\times 0.1 \\times 7.3\\times10^{-14} = 5.1\\times10^{-5}$ s⁻¹.',
        'A given molecule waits on average $1/5.1\\times10^{-5} \\approx 2\\times10^{4}$ s — five to six hours — although it collides billions of times a second.'
      ],
      a: 'About 5 × 10⁻⁵ successful collisions per second: a lifetime of five to six hours.'
    }
  ],
  quiz: [
    { q: 'Raising the temperature by 10 °C near room temperature often doubles a reaction rate. The main reason is…', choices: ['molecules collide twice as often', 'a much larger fraction of collisions has energy above Ea', 'the activation energy halves', 'the orientation of collisions improves'], a: 1,
      why: 'Collision frequency rises only about 2 %. The high-energy tail of the Maxwell–Boltzmann distribution, beyond Ea, roughly doubles.' },
    { q: 'For Ea = 100 kJ/mol, what fraction of collisions at 298.15 K has enough energy? (answer as a number)', answer: 3.03e-18,
      why: '$e^{-100\\,000/(8.314\\times298.15)} = e^{-40.3} = 3.0\\times10^{-18}$. Reactions with barriers this high are imperceptibly slow at room temperature unless catalysed.' },
    { q: 'Why does powdered zinc react faster with acid than a single lump of the same mass?', choices: ['powder has a lower activation energy', 'more surface is exposed, so there are more collisions per second', 'powder is at a higher temperature', 'the reaction is more exothermic'], a: 1,
      why: 'Only surface atoms can be hit by acid particles. Grinding multiplies the surface area and hence the collision rate; Ea and ΔH are unchanged.' },
    { q: 'A reaction with a large negative ΔH must have a small activation energy.', a: false,
      why: 'ΔH compares reactants and products; Ea is the barrier between them. Methane burning is strongly exothermic yet needs a spark or flame to start.' }
  ],
  sim: 'tk-collisions',
  applications: ['Dust explosions in flour mills, sugar refineries and coal mines.', 'Cooling to slow reactions: refrigeration of food, storage of reagents and medicines.', 'Why catalysts and heat are used to start combustion in engines and burners.', 'Grinding and dispersing solids to speed up industrial reactions.'],
  history: 'Collision theory was developed around 1916–1918 by Max Trautz and William Lewis, independently, from the kinetic theory of gases; Henry Eyring, Meredith Evans and Michael Polanyi set out transition-state theory in 1935.'
},

{
  id: 'arrhenius-equation', parent: 'mechanisms', title: 'Activation energy and the Arrhenius equation', level: 2,
  short: 'Rate constants rise exponentially with temperature: k = A e^(−Ea/RT). A plot of ln k against 1/T is a straight line whose slope gives the activation energy.',
  keywords: ['Arrhenius equation', 'activation energy', 'pre-exponential factor', 'frequency factor', 'Arrhenius plot', 'ln k against 1/T', 'temperature dependence of rate', 'Q10', 'rule of thumb 10 °C', 'accelerated ageing', 'two-point form'],
  prereq: ['collision-theory', 'rate-laws', 'math:logarithms', 'math:exponential-functions'],
  related: ['catalysis', 'gibbs-temperature', 'vant-hoff', 'reaction-half-life', 'math:linear-regression'],
  body: `
Milk sours in a day on a warm kitchen table and keeps for a week in the fridge; a pressure cooker cooks beans in a third of the time; car batteries age faster in hot climates. All are the same law. In 1889 Svante Arrhenius found that rate constants follow

$$k = A\\,e^{-E_a/RT}$$

- $E_a$, the **activation energy**, is the height of the barrier ([[collision-theory|collision theory]]): typically 40–150 kJ/mol for reactions that happen at convenient speeds.
- $A$, the **pre-exponential factor**, has the units of $k$ and gathers the collision frequency and the orientation factor: of the order of $10^{10}$–$10^{11}$ M⁻¹s⁻¹ for many gas reactions, $10^{13}$ s⁻¹ and above for unimolecular ones.
- $e^{-E_a/RT}$ is the fraction of collisions with enough energy.

### The Arrhenius plot
Take natural logarithms:

$$\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac{1}{T}$$

Plotting $\\ln k$ against $1/T$ gives a straight line with **slope $-E_a/R$** and intercept $\\ln A$. Measure $k$ at several temperatures, plot, fit a line, multiply the slope by $-R$: that is how activation energies are measured. From just two temperatures,

$$\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)$$

### The 10-degree rule, and when it fails
A reaction that doubles in rate between 25 and 35 °C has $E_a = R\\ln 2/(1/298 - 1/308) = 53$ kJ/mol. Many biological and everyday reactions sit near this value, hence the rule of thumb. But a reaction with $E_a = 100$ kJ/mol speeds up 3.7-fold, and one with 20 kJ/mol only 30 %. Diffusion-controlled reactions, and enzymes below their optimum, have small activation energies.

| Reaction | $E_a$ (kJ/mol) |
|---|---|
| cyclopropane → propene | 272 |
| $\\ce{2HI -> H2 + I2}$ | about 184 |
| $\\ce{2N2O5 -> 4NO2 + O2}$ | about 103 |
| $\\ce{2H2O2 -> 2H2O + O2}$, uncatalysed | about 75 |
| radical recombination, diffusion in water | 0–20 |

Cyclopropane is the extreme case: $A = 1.6\\times10^{15}$ s⁻¹ and $E_a = 272$ kJ/mol give $k = 6.7\\times10^{-4}$ s⁻¹ at 500 °C (half-life 17 min), and a half-life of about $10^{25}$ years at room temperature — a strained ring, yet perfectly stable in the bottle.

### Engineers use it every day
**Accelerated ageing** tests run products hot to predict their life at room temperature: a polymer seal, an adhesive, a medicine, a lithium-ion cell. The Arrhenius factor converts days at 60 °C into years at 25 °C — valid only if the same reaction dominates at both temperatures. Electrolytic capacitor datasheets use the 10-degree rule directly: every 10 °C cooler roughly doubles the rated life, so a part rated for 2000 h at 105 °C lasts about 32 000 h at 65 °C.

> [!warn] Use kelvin, and the natural logarithm. A plot of $\\log_{10}k$ has slope $-E_a/(2.303R)$.
`,
  ideas: [
    'k = A e^(−Ea/RT): rate constants rise exponentially with temperature.',
    'ln k against 1/T is a straight line with slope −Ea/R and intercept ln A.',
    'Two rate constants at two temperatures are enough to estimate Ea.',
    'A 10 °C rise doubles the rate only if Ea ≈ 53 kJ/mol; higher barriers are more temperature-sensitive.',
    'Accelerated-ageing tests and shelf-life predictions rest on the Arrhenius equation.'
  ],
  pitfalls: [
    'Using °C in the Arrhenius equation — The temperature must be absolute (K). 1/25 °C means nothing.',
    'Every reaction doubles in rate per 10 °C — That holds only near Ea ≈ 50 kJ/mol. The factor can be 1.3 or 5 depending on the barrier.',
    'A catalyst changes the rate by changing A — A catalyst works mainly by lowering Ea (a different pathway); A can change too, but the exponential term dominates.'
  ],
  formulas: [
    {
      name: 'Arrhenius equation',
      expr: 'k = A*exp(-Ea/(R*T))', tex: 'k = A\\,e^{-E_a/RT}',
      vars: {
        k: { name: 'rate constant (first order)', q: 'rate', unit: '1/s' },
        A: { name: 'pre-exponential factor', q: 'rate', unit: '1/s', value: 1.6e15 },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 272, tex: 'E_a' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 773.15 }
      },
      note: 'Written for a first-order reaction (k and A in 1/s); for other orders A carries the units of k. Defaults: cyclopropane → propene at 500 °C.',
      practice: { unknowns: ['k', 'T', 'Ea'] },
      stories: {
        k: 'Cyclopropane isomerises with A = {A} and Ea = {Ea}. What is the rate constant at {T}?',
        T: 'For a reaction with A = {A} and Ea = {Ea}, at what temperature is k = {k}?',
        Ea: 'A first-order reaction has A = {A} and k = {k} at {T}. What is its activation energy?'
      }
    },
    {
      name: 'Two temperatures, two rate constants',
      expr: 'ln(k2/k1) = Ea/R*(1/T1 - 1/T2)', tex: '\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)',
      vars: {
        k2: { name: 'rate constant at T₂', q: 'rate', unit: '1/s', value: 2.0e-3, tex: 'k_2' },
        k1: { name: 'rate constant at T₁', q: 'rate', unit: '1/s', value: 1.0e-3, tex: 'k_1' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_a' },
        R: { const: 'R' },
        T1: { name: 'first temperature', q: 'temperature', unit: 'K', value: 298.15, tex: 'T_1' },
        T2: { name: 'second temperature', q: 'temperature', unit: 'K', value: 308.15, tex: 'T_2' }
      },
      solveFor: 'Ea',
      note: 'Only the ratio $k_2/k_1$ matters, so it works for any order (or with rates, or with reciprocal times of a clock reaction). Defaults: a rate that doubles between 25 and 35 °C.',
      practice: { unknowns: ['Ea', 'k2', 'T2'] },
      stories: {
        Ea: 'A rate constant is {k1} at {T1} and {k2} at {T2}. What is the activation energy?',
        k2: 'A reaction has Ea = {Ea} and k = {k1} at {T1}. What is k at {T2}?',
        T2: 'A reaction with Ea = {Ea} has k = {k1} at {T1}. At what temperature does k reach {k2}?'
      }
    },
    {
      name: 'Activation energy from the slope of an Arrhenius plot',
      expr: 'Ea = -R*m', tex: 'E_a = -R \\times \\text{slope}',
      vars: {
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', tex: 'E_a' },
        R: { const: 'R' },
        m: { name: 'slope of ln k against 1/T', q: 'dtemp', unit: 'K', value: -6360, signed: true, tex: '\\text{slope}' }
      },
      note: 'The slope of ln k against 1/T has the unit of temperature (K) and is negative.',
      practice: { unknowns: ['Ea', 'm'] },
      stories: {
        Ea: 'An Arrhenius plot of ln k against 1/T has a slope of {m}. What is the activation energy?',
        m: 'A reaction has Ea = {Ea}. What slope do you expect on a plot of ln k against 1/T?'
      }
    }
  ],
  derivation: {
    title: 'From the Arrhenius equation to its two-point form',
    steps: [
      { text: 'Take the natural logarithm of $k = A e^{-E_a/RT}$:', tex: '\\ln k = \\ln A - \\frac{E_a}{R}\\cdot\\frac{1}{T}' },
      { text: 'This is a straight line, $y = c + mx$, with $y = \\ln k$, $x = 1/T$ and slope', tex: 'm = -\\frac{E_a}{R}' },
      { text: 'Write it at two temperatures and subtract: $\\ln A$ cancels, so the pre-exponential factor need not be known:', tex: '\\ln k_2 - \\ln k_1 = -\\frac{E_a}{R}\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)' },
      { text: 'Rearranged:', tex: '\\ln\\frac{k_2}{k_1} = \\frac{E_a}{R}\\left(\\frac{1}{T_1} - \\frac{1}{T_2}\\right)' }
    ]
  },
  examples: [
    {
      title: 'An iodine clock in a water bath',
      q: 'An iodine clock turns blue after 60 s at 20 °C and after 30 s at 30 °C. Estimate the activation energy.',
      steps: [
        'The rate is proportional to 1/time, so $k_2/k_1 = 60/30 = 2.0$.',
        '$1/T_1 - 1/T_2 = 1/293.15 - 1/303.15 = 1.125\\times10^{-4}$ K⁻¹.',
        '$E_a = R\\ln 2/(1.125\\times10^{-4}) = 8.314 \\times 0.693/1.125\\times10^{-4} = 51\\,200$ J/mol.'
      ],
      a: 'About 51 kJ/mol.'
    },
    {
      title: 'Why the fridge works',
      q: 'The reactions that spoil milk have an overall activation energy of roughly 60 kJ/mol. How much longer does milk keep at 4 °C than at 20 °C?',
      steps: [
        '$\\ln(k_{20}/k_4) = \\dfrac{60\\,000}{8.314}\\left(\\dfrac{1}{277.15} - \\dfrac{1}{293.15}\\right) = 7217 \\times 1.969\\times10^{-4} = 1.42$.',
        '$k_{20}/k_4 = e^{1.42} = 4.1$.',
        'Spoilage is about four times slower in the fridge. A freezer at −18 °C slows it by another factor of about 9 — and stops bacterial growth altogether.'
      ],
      a: 'About four times longer.'
    }
  ],
  quiz: [
    { q: 'On an Arrhenius plot (ln k against 1/T), a reaction with a larger activation energy has…', choices: ['a steeper (more negative) slope', 'a shallower slope', 'a larger intercept only', 'a curved line'], a: 0,
      why: 'Slope = −Ea/R. A bigger barrier means k changes more with temperature: a steeper line.' },
    { q: 'A rate constant is 1.0 × 10⁻³ s⁻¹ at 300 K and 8.0 × 10⁻³ s⁻¹ at 330 K. What is Ea in kJ/mol?', answer: 57.0, unit: 'kJ/mol',
      why: '$E_a = R\\ln 8/(1/300 - 1/330) = 8.314 \\times 2.079/3.030\\times10^{-4} = 57\\,000$ J/mol.' },
    { q: 'Which reaction is most sensitive to temperature?', choices: ['Ea = 20 kJ/mol', 'Ea = 50 kJ/mol', 'Ea = 100 kJ/mol', 'all equally: the Arrhenius factor is the same'], a: 2,
      why: 'The exponent is −Ea/RT; the larger Ea, the faster it changes with T. Between 25 and 35 °C: ×1.3, ×1.9 and ×3.7.' },
    { q: 'At very high temperature, k approaches the pre-exponential factor A.', a: true,
      why: 'As T → ∞, e^(−Ea/RT) → 1, so k → A: every collision would have enough energy, and only frequency and orientation would limit the rate.' }
  ],
  sim: { id: 'tk-collisions', params: { log: 1 } },
  applications: ['Accelerated ageing tests for polymers, adhesives, batteries and electronics.', 'Shelf-life of foods and drugs; cold-chain logistics for vaccines.', 'Cooking: pressure cookers raise the boiling point to about 120 °C; at 3000 m water boils at about 90 °C and cooking slows.', 'Choosing reactor temperatures in industry.'],
  history: 'Svante Arrhenius proposed the equation in 1889, to explain how the rate of sucrose inversion depends on temperature, building on an expression of van \'t Hoff. He received the 1903 Nobel Prize in Chemistry, for his theory of electrolytic dissociation.'
},

{
  id: 'reaction-mechanisms', parent: 'mechanisms', title: 'Reaction mechanisms', level: 3,
  short: 'Most reactions happen as a sequence of simple elementary steps. The slowest step sets the rate, intermediates appear and vanish, and the mechanism must reproduce the measured rate law.',
  keywords: ['reaction mechanism', 'elementary step', 'molecularity', 'unimolecular', 'bimolecular', 'termolecular', 'rate-determining step', 'intermediate', 'transition state', 'activated complex', 'pre-equilibrium', 'steady-state approximation', 'chain reaction', 'radical'],
  prereq: ['rate-laws', 'arrhenius-equation', 'collision-theory'],
  related: ['catalysis', 'enzyme-kinetics', 'reaction-mechanisms-organic', 'nucleophilic-substitution', 'initial-rates'],
  body: `
A balanced equation is an accountant's summary: what goes in, what comes out. It rarely describes what molecules actually do. Three or four molecules almost never collide at the same instant, so a reaction such as $\\ce{2NO + 2H2 -> N2 + 2H2O}$ must happen in stages. The **mechanism** is that sequence of **elementary steps**, each a single molecular event.

### Elementary steps
The number of particles colliding in an elementary step is its **molecularity**:
- **unimolecular**: one molecule falls apart or rearranges, $\\ce{N2O4 -> 2NO2}$;
- **bimolecular**: two collide, $\\ce{NO2 + CO -> NO + CO2}$ — by far the most common;
- **termolecular**: three at once — rare, because simultaneous triple collisions are rare.

For an elementary step, and only for one, the rate law follows from its equation: a bimolecular step $\\ce{A + B -> products}$ has rate $k[\\ce{A}][\\ce{B}]$, because the collision frequency is proportional to both concentrations.

### Intermediates and the slow step
Steps pass species from one to the next. An **intermediate** is made in one step and used up in a later one; it is a real molecule (or radical, or ion) that can sometimes be detected or trapped. It is not the same as a **transition state**, the fleeting arrangement at the top of each energy barrier, which lives for one molecular vibration.

In a sequence, the slowest step — the **rate-determining step** — acts like the narrowest point in a production line: the overall rate cannot exceed it, and steps after it do not affect the rate. Consider nitrogen dioxide and carbon monoxide below 225 °C:

$$\\text{step 1 (slow):}\\quad \\ce{NO2 + NO2 -> NO3 + NO}$$
$$\\text{step 2 (fast):}\\quad \\ce{NO3 + CO -> NO2 + CO2}$$

The steps add up to $\\ce{NO2 + CO -> NO + CO2}$ (NO₃ is the intermediate), and the slow step predicts rate $= k[\\ce{NO2}]^2$ — exactly what is measured, with no CO in it.

### A fast equilibrium first
When a slow step comes second, the intermediate it needs is often held at equilibrium by a fast first step. For $\\ce{2NO + O2 -> 2NO2}$:

$$\\ce{2NO <=> N2O2} \\quad(\\text{fast, } K_1) \\qquad \\ce{N2O2 + O2 -> 2NO2} \\quad(\\text{slow, } k_2)$$

The rate is $k_2[\\ce{N2O2}][\\ce{O2}]$, and $[\\ce{N2O2}] = K_1[\\ce{NO}]^2$, so rate $= k_2K_1[\\ce{NO}]^2[\\ce{O2}]$: third order, as observed, without a three-body collision. Because the dimer equilibrium is exothermic, $K_1$ shrinks on heating faster than $k_2$ grows — and this reaction famously gets *slower* as it gets hotter.

### The steady-state approximation
When an intermediate is very reactive, it never accumulates: it is consumed as fast as it forms, so $d[\\ce{I}]/dt \\approx 0$. Setting its rate of change to zero gives an expression for its concentration and hence the overall rate law. The [[enzyme-kinetics|Michaelis–Menten equation]] is derived this way.

### Chain reactions
Some mechanisms regenerate their intermediate. Hydrogen and chlorine: light splits $\\ce{Cl2}$ into atoms (**initiation**); then $\\ce{Cl + H2 -> HCl + H}$ and $\\ce{H + Cl2 -> HCl + Cl}$ repeat (**propagation**), each cycle making two HCl and restoring a chlorine atom, until two radicals meet (**termination**). One photon can make a million molecules of HCl — explosively. Combustion, polymerisation and ozone destruction by chlorine atoms are chain reactions too.

> [!key] A mechanism must (1) add up to the overall equation and (2) predict the measured rate law. Many mechanisms can pass both tests, so experiments can rule a mechanism out but never prove it; detecting the intermediates is the strongest evidence.
`,
  ideas: [
    'A mechanism is a sequence of elementary steps that adds up to the overall equation.',
    'Only for an elementary step do the orders equal the coefficients (its molecularity).',
    'The slowest step determines the rate; reactants that enter after it do not appear in the rate law.',
    'Intermediates are formed and consumed; transition states are the tops of barriers and cannot be isolated.',
    'A proposed mechanism must reproduce the experimental rate law — agreement supports it but does not prove it.'
  ],
  pitfalls: [
    'The rate law can be written from the overall equation — Only from the rate-determining step (and any fast equilibria before it).',
    'An intermediate and a transition state are the same thing — An intermediate sits in an energy valley and has a measurable lifetime; a transition state is the energy maximum between steps.',
    'The fastest step controls the rate — The slowest step is the bottleneck. Making a fast step even faster changes nothing.'
  ],
  formulas: [
    {
      name: 'When the intermediate peaks (A → I → P)',
      expr: 'tmax = ln(k1/k2)/(k1 - k2)', tex: 't_\\text{max} = \\frac{\\ln(k_1/k_2)}{k_1 - k_2}',
      vars: {
        tmax: { name: 'time of the highest intermediate concentration', q: 'time', unit: 's', tex: 't_\\text{max}' },
        k1: { name: 'rate constant of the first step', q: 'rate', unit: '1/s', value: 0.01, tex: 'k_1' },
        k2: { name: 'rate constant of the second step', q: 'rate', unit: '1/s', value: 0.005, tex: 'k_2' }
      },
      note: 'Two consecutive first-order steps, $\\ce{A ->[k_1] I ->[k_2] P}$, with $k_1 \\ne k_2$. The time to harvest an intermediate product in industry.',
      practice: { unknowns: ['tmax'] },
      stories: { tmax: 'A reactant forms an intermediate with k₁ = {k1}, which goes on to the final product with k₂ = {k2}. When is the intermediate at its maximum?' }
    },
    {
      name: 'The highest intermediate concentration',
      expr: 'Imax = (k1/k2)^(k2/(k2 - k1))', tex: 'y_\\text{max} = \\left(\\frac{k_1}{k_2}\\right)^{k_2/(k_2 - k_1)}',
      vars: {
        Imax: { name: 'peak intermediate as a fraction of the starting reactant, [I]max/[A]₀', q: 'ratio', unit: '%', tex: 'y_\\text{max}' },
        k1: { name: 'rate constant of the first step', q: 'rate', unit: '1/s', value: 0.01, tex: 'k_1' },
        k2: { name: 'rate constant of the second step', q: 'rate', unit: '1/s', value: 0.005, tex: 'k_2' }
      },
      note: 'When the second step is much faster ($k_2 \\gg k_1$) the intermediate never builds up — the basis of the steady-state approximation.',
      practice: { unknowns: ['Imax'] },
      stories: { Imax: 'In A → I → P the steps have k₁ = {k1} and k₂ = {k2}. What is the largest fraction of A that is ever present as I?' }
    }
  ],
  examples: [
    {
      title: 'Testing two mechanisms',
      q: 'The reaction $\\ce{2NO2Cl -> 2NO2 + Cl2}$ has rate $= k[\\ce{NO2Cl}]$. Which mechanism fits? (a) one bimolecular step, $\\ce{2NO2Cl -> 2NO2 + Cl2}$; (b) $\\ce{NO2Cl -> NO2 + Cl}$ (slow), then $\\ce{NO2Cl + Cl -> NO2 + Cl2}$ (fast).',
      steps: [
        '(a) predicts rate $= k[\\ce{NO2Cl}]^2$: second order. It contradicts the data.',
        '(b) adds up correctly: $\\ce{2NO2Cl -> 2NO2 + Cl2}$, with Cl as an intermediate.',
        'Its slow step is unimolecular, predicting rate $= k_1[\\ce{NO2Cl}]$: first order, as measured.',
        'So (b) is consistent; (a) is ruled out. Detecting chlorine atoms (by their spectrum) would strengthen the case for (b).'
      ],
      a: 'Mechanism (b).'
    },
    {
      title: 'An intermediate worth harvesting',
      q: 'A → I → P with $k_1 = 0.010$ s⁻¹ and $k_2 = 0.0050$ s⁻¹. When should I be collected, and how much of A can be recovered as I at best?',
      steps: [
        '$t_\\text{max} = \\ln(0.010/0.0050)/(0.010 - 0.0050) = 0.693/0.0050 = 139$ s.',
        '$[\\ce{I}]_\\text{max}/[\\ce{A}]_0 = 2^{0.005/(0.005 - 0.010)} = 2^{-1} = 0.50$.',
        'Stop the reaction (cool it, or separate the product) after about 2.3 min to get half of A as I; wait longer and I turns into P.'
      ],
      a: 'At about 139 s, when I is 50 % of the starting A.'
    }
  ],
  quiz: [
    { q: 'A proposed mechanism has a slow first step $\\ce{A + B -> C}$ followed by a fast step $\\ce{C + B -> D}$. The predicted rate law is…', choices: ['rate = k[A][B]²', 'rate = k[A][B]', 'rate = k[C][B]', 'rate = k[A]'], a: 1,
      why: 'The slow first step is elementary and bimolecular: rate = k[A][B]. The second B enters after the bottleneck and does not appear.' },
    { q: 'In the mechanism of $\\ce{NO2 + CO -> NO + CO2}$ via $\\ce{NO3}$, NO₃ is…', choices: ['a catalyst', 'an intermediate', 'a transition state', 'a spectator'], a: 1,
      why: 'It is formed in step 1 and consumed in step 2, and it is a real molecule: an intermediate. A catalyst would be present at the start and regenerated at the end.' },
    { q: 'Termolecular elementary steps are rare because…', choices: ['three molecules cannot react', 'simultaneous collisions of three particles are very improbable', 'they are always endothermic', 'they violate conservation of mass'], a: 1,
      why: 'The chance of a third molecule arriving during the brief moment two are in contact is small. Apparent third-order reactions usually involve a fast pre-equilibrium followed by a bimolecular step.' },
    { q: 'If a mechanism reproduces the measured rate law, it is proven correct.', a: false,
      why: 'Other mechanisms may predict the same rate law. Kinetics can rule mechanisms out; proof needs more evidence, such as detecting the intermediates or isotope labelling.' }
  ],
  sim: { id: 'tk-profile', params: { mode: 2 } },
  applications: ['Designing catalysts: knowing which step is slow shows what to speed up.', 'Atmospheric chemistry: chain mechanisms of smog and ozone depletion.', 'Controlling polymerisation (initiators, chain transfer, termination).', 'Organic synthesis: SN1 and SN2 pathways decide the products and their stereochemistry.']
},

{
  id: 'catalysis', parent: 'mechanisms', title: 'Catalysis', level: 2,
  short: 'A catalyst speeds a reaction by offering a route with a lower activation energy, and is regenerated at the end. It speeds the forward and reverse reactions alike, so it changes how fast equilibrium is reached, not where it lies.',
  keywords: ['catalyst', 'catalysis', 'homogeneous catalysis', 'heterogeneous catalysis', 'activation energy', 'alternative pathway', 'adsorption', 'active site', 'catalytic converter', 'Haber process', 'contact process', 'catalyst poisoning', 'autocatalysis', 'selectivity', 'turnover'],
  prereq: ['arrhenius-equation', 'reaction-mechanisms', 'collision-theory'],
  related: ['enzyme-kinetics', 'equilibrium-constant', 'le-chatelier', 'gibbs-energy', 'limiting-reagent', 'batteries-fuel-cells'],
  body: `
A mixture of hydrogen and oxygen can sit unchanged for years; touch it with a little platinum powder and it reacts at once. The platinum is still there afterwards, unchanged. A **catalyst** takes part in the reaction but is regenerated by the end of it, and it makes the reaction faster by providing a **different mechanism with a lower activation energy**.

### Why a lower barrier helps so much
The rate depends on $e^{-E_a/RT}$, so lowering $E_a$ by $\\Delta E_a$ multiplies the rate (for the same $A$) by $e^{\\Delta E_a/RT}$. At 25 °C, every 5.7 kJ/mol off the barrier is a factor of 10. Iodide ions lower the barrier for hydrogen peroxide decomposition from about 75 to 56 kJ/mol, a speed-up of about 2000; the enzyme catalase brings it down so far that a single enzyme molecule destroys millions of peroxide molecules per second.

| $\\ce{2HI -> H2 + I2}$ | $E_a$ (kJ/mol) |
|---|---|
| no catalyst | about 184 |
| on gold | about 105 |
| on platinum | about 59 |

### What a catalyst does not do
It does not change ΔH, ΔG or the equilibrium constant: those depend only on the reactants and products. It lowers the barrier for the forward and the reverse reaction by the same amount, so both speed up by the same factor and $K = k_\\text{f}/k_\\text{r}$ is unchanged. A catalyst **brings a reaction to equilibrium sooner**; it cannot make a reaction go further than equilibrium allows, and it cannot make a non-spontaneous reaction go.

### Two kinds
**Homogeneous** catalysts are in the same phase as the reactants: acids catalysing ester hydrolysis, iron ions catalysing the reaction of peroxodisulfate with iodide (by cycling between $\\ce{Fe^2+}$ and $\\ce{Fe^3+}$), chlorine atoms in the stratosphere destroying ozone by $\\ce{Cl + O3 -> ClO + O2}$ then $\\ce{ClO + O -> Cl + O2}$ — one atom can destroy some 100 000 ozone molecules.

**Heterogeneous** catalysts are a different phase, usually a solid with gases or liquids flowing over it. Molecules **adsorb** on the surface, their bonds weaken, they react with neighbours, and the products **desorb**. Surface area is everything: catalysts are finely divided metals on porous supports with hundreds of square metres per gram.

### Industry runs on catalysts
- **Haber–Bosch ammonia**: iron promoted with potassium and aluminium oxides, 400–450 °C, 150–300 bar. About half the nitrogen in the proteins of humanity has passed through this catalyst.
- **Contact process** for sulfuric acid: $\\ce{2SO2 + O2 -> 2SO3}$ on vanadium(V) oxide.
- **Ostwald process** for nitric acid: ammonia burned on platinum–rhodium gauze for a thousandth of a second. Here the catalyst provides **selectivity** — without it ammonia burns to nitrogen, not nitric oxide.
- **Three-way catalytic converter**: platinum, palladium and rhodium on a ceramic honeycomb oxidise CO and unburnt hydrocarbons and reduce NOₓ to N₂ at the same time — only if the air–fuel mixture is kept at the [[limiting-reagent|stoichiometric ratio]]. It works only once hot (about 250–300 °C), which is why most of a car's emissions come in the first minute after a cold start.
- Cracking of crude oil on zeolites, hydrogenation of vegetable oils on nickel, polymerisation of ethene on Ziegler–Natta catalysts. Around 90 % of chemical manufacturing processes use a catalyst somewhere.

### Poisons and autocatalysis
Catalysts can be **poisoned** by substances that bind to the active sites and do not leave: lead from leaded petrol ruined catalytic converters, which is one reason leaded petrol was phased out; sulfur poisons nickel and iron catalysts; carbon monoxide poisons the platinum of fuel cells. In **autocatalysis** a product catalyses its own formation: in a permanganate titration of oxalate, the first drops decolorise slowly until the $\\ce{Mn^2+}$ they produce speeds things up.
`,
  ideas: [
    'A catalyst provides an alternative pathway with a lower activation energy and is regenerated at the end.',
    'Lowering Ea by 5.7 kJ/mol speeds a reaction tenfold at 25 °C.',
    'A catalyst speeds forward and reverse reactions equally: ΔH, ΔG and K are unchanged; equilibrium is only reached sooner.',
    'Homogeneous catalysts share the reactants\' phase; heterogeneous catalysts work at a surface by adsorption.',
    'Catalysts also give selectivity, and can be poisoned by substances that block their active sites.'
  ],
  pitfalls: [
    'A catalyst shifts the equilibrium towards products — It speeds both directions equally; the equilibrium composition is unchanged.',
    'A catalyst is not involved in the reaction — It takes part in the mechanism (it is used up in one step and regenerated in a later one); it is simply not consumed overall.',
    'A catalyst can make a non-spontaneous reaction happen — It cannot change ΔG. If the reaction is not favourable, no catalyst will drive it.'
  ],
  formulas: [
    {
      name: 'Speed-up from a lower activation energy',
      expr: 'F = exp(dEa/(R*T))', tex: 'F = e^{\\Delta E_a/RT}',
      vars: {
        F: { name: 'factor by which the rate increases, k(catalysed)/k(uncatalysed)' },
        dEa: { name: 'decrease in activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 19, tex: '\\Delta E_a' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'Assumes the pre-exponential factor is unchanged. Defaults: hydrogen peroxide decomposition catalysed by iodide ions (about 75 → 56 kJ/mol).',
      practice: { unknowns: ['F', 'dEa'] },
      stories: {
        F: 'A catalyst lowers the activation energy by {dEa}. By what factor does it speed the reaction at {T}?',
        dEa: 'A catalyst makes a reaction {F} times faster at {T}. By how much does it lower the activation energy?'
      }
    }
  ],
  examples: [
    {
      title: 'Platinum and hydrogen iodide',
      q: 'On platinum the activation energy of $\\ce{2HI -> H2 + I2}$ falls from about 184 to about 59 kJ/mol. Assuming the same pre-exponential factor, by what factor is the reaction faster at 600 K?',
      steps: [
        '$\\Delta E_a = 184 - 59 = 125$ kJ/mol.',
        '$e^{\\Delta E_a/RT} = \\exp(125\\,000/(8.314\\times600)) = \\exp(25.1) \\approx 8\\times10^{10}$.',
        'In practice the surface reaction has a much smaller pre-exponential factor (only molecules at the surface react), so the real gain is smaller — but still many orders of magnitude.'
      ],
      a: 'About 10¹¹ times faster in principle.'
    }
  ],
  quiz: [
    { q: 'Adding a catalyst to a reaction at equilibrium…', choices: ['shifts the equilibrium to the right', 'shifts it to the left', 'leaves the composition unchanged', 'increases K'], a: 2,
      why: 'Forward and reverse rates rise by the same factor, so the balance point stays where it was.' },
    { q: 'At 298.15 K, by roughly what factor does lowering Ea by 11.4 kJ/mol increase the rate (same A)?', answer: 99.4,
      why: '$e^{11\\,400/(8.314\\times298.15)} = e^{4.60} \\approx 99$: each 5.7 kJ/mol is a factor of ten.' },
    { q: 'Why must a car\'s catalytic converter be hot to work well?', choices: ['the catalyst melts when cold', 'the surface reactions still have activation energies, and their rates rise steeply with temperature', 'cold exhaust contains no pollutants', 'the equilibrium favours pollutants when cold'], a: 1,
      why: 'Catalysts lower barriers but do not remove them. Below the light-off temperature (about 250–300 °C) the surface reactions are too slow.' },
    { q: 'A catalyst changes the enthalpy change of the reaction it catalyses.', a: false,
      why: 'ΔH depends only on reactants and products. The catalyst changes the route (and the barrier), not the start or the end.' }
  ],
  sim: { id: 'tk-profile', params: { mode: 1 } },
  applications: ['Fertiliser (Haber–Bosch), sulfuric and nitric acid manufacture.', 'Catalytic converters and diesel particulate filters.', 'Oil refining (cracking, reforming) and plastics (polymerisation catalysts).', 'Fuel cells and electrolysers (platinum, iridium and nickel catalysts).'],
  history: 'Jöns Jacob Berzelius named catalysis in 1835. Wilhelm Ostwald defined a catalyst as something that changes the rate but not the equilibrium, and won the 1909 Nobel Prize for it; Fritz Haber and Carl Bosch made ammonia synthesis industrial between 1909 and 1913.'
},

{
  id: 'enzyme-kinetics', parent: 'mechanisms', title: 'Enzyme kinetics', level: 3,
  short: 'Enzymes are protein catalysts that bind their substrate before converting it. At low substrate the rate rises in proportion; at high substrate the enzyme is saturated and the rate levels off at Vmax — the Michaelis–Menten equation.',
  keywords: ['enzyme', 'enzyme kinetics', 'Michaelis–Menten', 'Vmax', 'Km', 'Michaelis constant', 'kcat', 'turnover number', 'catalytic efficiency', 'Lineweaver–Burk', 'double reciprocal plot', 'competitive inhibition', 'non-competitive inhibition', 'saturation', 'active site', 'substrate'],
  prereq: ['catalysis', 'rate-laws', 'reaction-mechanisms'],
  related: ['amino-acids-proteins', 'initial-rates', 'arrhenius-equation', 'reaction-half-life', 'math:linear-functions'],
  body: `
Nearly every reaction in a living cell is catalysed by an **enzyme**, a protein folded so that a small pocket, the **active site**, fits one substrate (or a few) and holds it in just the right position to react. Enzymes are astonishing catalysts: carbonic anhydrase converts about a million CO₂ molecules to hydrogencarbonate every second, and some enzymes speed their reaction by a factor of $10^{17}$ over the uncatalysed rate.

### Saturation
Because the enzyme must first bind its substrate, the reaction runs in two stages:

$$\\ce{E + S <=> ES -> E + P}$$

At low substrate concentration most enzyme molecules are idle, and doubling [S] doubles the rate (first order). At high concentration every active site is busy; adding more substrate is like adding more customers to a queue at a fully staffed counter — the rate levels off at a maximum, $V_\\text{max}$ (zero order). The **Michaelis–Menten equation** describes the whole curve:

$$v = \\frac{V_\\text{max}[\\ce{S}]}{K_M + [\\ce{S}]}$$

### Reading the constants
- $V_\\text{max} = k_\\text{cat}[\\ce{E}]_0$: the rate with every site occupied, proportional to the amount of enzyme. The **turnover number** $k_\\text{cat}$ is how many substrate molecules one site converts per second — from about 1 s⁻¹ for sluggish enzymes to $10^6$ s⁻¹ for carbonic anhydrase.
- $K_M$, the **Michaelis constant**, is the substrate concentration at which the rate is **half** of $V_\\text{max}$. A small $K_M$ means the enzyme works well at low substrate levels (loosely, it binds tightly).
- $k_\\text{cat}/K_M$ measures efficiency at low substrate. Its ceiling is set by how fast molecules can diffuse together in water, about $10^8$–$10^9$ M⁻¹s⁻¹; a handful of "perfect" enzymes, such as carbonic anhydrase and triosephosphate isomerase, reach it.

### Two enzymes, one sugar
Hexokinase, found in most tissues, phosphorylates glucose with $K_M \\approx 0.1$ mM — at a blood glucose of 5 mM it is saturated, working at 98 % of its maximum however much sugar is around. The liver's glucokinase has a much larger $K_M$, about 8 mM (treating its slightly sigmoidal kinetics as Michaelis–Menten): at 5 mM it runs at 38 % of $V_\\text{max}$, and after a meal (10 mM) at 56 %. The liver therefore takes up glucose in proportion to how much is in the blood, while the brain gets its share first.

### The straight-line plot
Taking reciprocals turns the curve into a line (the **Lineweaver–Burk** or double-reciprocal plot):

$$\\frac{1}{v} = \\frac{K_M}{V_\\text{max}}\\cdot\\frac{1}{[\\ce{S}]} + \\frac{1}{V_\\text{max}}$$

The intercept on the $1/v$ axis is $1/V_\\text{max}$; on the $1/[\\ce{S}]$ axis, $-1/K_M$. (Modern practice fits the curve directly, because the reciprocals exaggerate the errors of the slowest measurements.)

### Inhibitors
- A **competitive** inhibitor resembles the substrate and occupies the active site. It raises the apparent $K_M$ by the factor $1 + [\\ce{I}]/K_i$ but leaves $V_\\text{max}$ alone: enough substrate outcompetes it. Methanol poisoning is treated with ethanol or fomepizole, which compete for alcohol dehydrogenase and stop methanol being turned into toxic formaldehyde and formic acid.
- A **non-competitive** inhibitor binds elsewhere and disables part of the enzyme: $V_\\text{max}$ falls, $K_M$ does not change, and no amount of substrate restores the rate.

Statins (cholesterol), ACE inhibitors (blood pressure) and many antibiotics are enzyme inhibitors. Enzymes also have an optimum temperature and pH: rates rise with temperature as Arrhenius predicts until the protein unfolds (above about 40 °C for most human enzymes; the Taq polymerase used in PCR comes from a hot-spring bacterium and works at 72 °C).
`,
  ideas: [
    'Enzymes bind the substrate first (E + S ⇌ ES → E + P), so their rate saturates.',
    'Michaelis–Menten: v = Vmax[S]/(Km + [S]) — first order at low [S], zero order at high [S].',
    'Km is the substrate concentration giving half the maximum rate; Vmax = kcat[E]₀.',
    'kcat/Km measures efficiency and cannot exceed the diffusion limit of about 10⁸–10⁹ M⁻¹s⁻¹.',
    'Competitive inhibitors raise the apparent Km; non-competitive inhibitors lower Vmax.'
  ],
  pitfalls: [
    'Km is the substrate concentration at which the enzyme is saturated — At [S] = Km the enzyme runs at only half its maximum; near saturation needs [S] ≫ Km.',
    'Adding more substrate always speeds an enzyme reaction — Only below saturation; at [S] ≫ Km the rate is fixed by the amount of enzyme.',
    'A competitive inhibitor lowers Vmax — It raises the apparent Km; at very high substrate concentration the full Vmax is still reached.'
  ],
  formulas: [
    {
      name: 'Michaelis–Menten equation',
      expr: 'v = Vmax*S/(Km + S)', tex: 'v = \\frac{V_\\text{max}\\,\\text{[S]}}{K_M + \\text{[S]}}',
      vars: {
        v: { name: 'initial rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate (saturated enzyme)', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_\\text{max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 1.0, tex: '\\text{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 0.5, tex: 'K_M' }
      },
      practice: { unknowns: ['v', 'S', 'Km'] },
      stories: {
        v: 'An enzyme has Vmax = {Vmax} and Km = {Km}. What is the rate at a substrate concentration of {S}?',
        S: 'An enzyme with Vmax = {Vmax} and Km = {Km} should run at {v}. What substrate concentration is needed?',
        Km: 'An enzyme reaches {v} at [S] = {S}, and its Vmax is {Vmax}. What is Km?'
      }
    },
    {
      name: 'Maximum rate and turnover number',
      expr: 'Vmax = kcat*E0', tex: 'V_\\text{max} = k_\\text{cat}\\,\\text{[E]}_0',
      vars: {
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'mM/s', tex: 'V_\\text{max}' },
        kcat: { name: 'turnover number', q: 'rate', unit: '1/s', value: 1e6, tex: 'k_\\text{cat}' },
        E0: { name: 'total enzyme concentration', q: 'concentration', unit: 'nM', value: 1, tex: '\\text{[E]}_0' }
      },
      note: 'Defaults: carbonic anhydrase, about 10⁶ reactions per second per active site.',
      practice: { unknowns: ['Vmax', 'kcat'] },
      stories: {
        Vmax: 'Carbonic anhydrase has a turnover number of {kcat}. What is Vmax with {E0} of enzyme?',
        kcat: 'An enzyme at {E0} gives Vmax = {Vmax}. What is its turnover number?'
      }
    },
    {
      name: 'Competitive inhibition',
      expr: 'v = Vmax*S/(Km*(1 + I/Ki) + S)', tex: 'v = \\frac{V_\\text{max}\\,\\text{[S]}}{K_M\\left(1 + \\text{[I]}/K_i\\right) + \\text{[S]}}',
      vars: {
        v: { name: 'rate with the inhibitor', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_\\text{max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 1.0, tex: '\\text{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 0.5, tex: 'K_M' },
        I: { name: 'inhibitor concentration', q: 'concentration', unit: 'mM', value: 0.2, tex: '\\text{[I]}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'mM', value: 0.1, tex: 'K_i' }
      },
      note: 'The inhibitor multiplies the apparent Km by $1 + [\\ce{I}]/K_i$; here from 0.5 to 1.5 mM, cutting the rate from 6.7 to 4.0 µM/s.',
      practice: { unknowns: ['v', 'I'] },
      stories: {
        v: 'An enzyme (Vmax = {Vmax}, Km = {Km}) works on {S} of substrate in the presence of {I} of a competitive inhibitor with Ki = {Ki}. What is the rate?',
        I: 'How much competitive inhibitor (Ki = {Ki}) brings the rate of an enzyme (Vmax = {Vmax}, Km = {Km}) at {S} of substrate down to {v}?'
      }
    }
  ],
  derivation: {
    title: 'Derive the Michaelis–Menten equation',
    steps: [
      { text: 'Mechanism: $\\ce{E + S <=>[k_1][k_{-1}] ES ->[k_2] E + P}$. The rate of product formation is', tex: 'v = k_2\\,[\\ce{ES}]' },
      { text: 'Steady state: the complex forms and breaks down at the same rate, so its concentration stays constant:', tex: 'k_1[\\ce{E}][\\ce{S}] = (k_{-1} + k_2)[\\ce{ES}]' },
      { text: 'The enzyme is either free or bound: $[\\ce{E}] = [\\ce{E}]_0 - [\\ce{ES}]$. Substitute and define $K_M = (k_{-1} + k_2)/k_1$:', tex: '([\\ce{E}]_0 - [\\ce{ES}])[\\ce{S}] = K_M[\\ce{ES}]' },
      { text: 'Solve for the complex:', tex: '[\\ce{ES}] = \\frac{[\\ce{E}]_0[\\ce{S}]}{K_M + [\\ce{S}]}' },
      { text: 'Multiply by $k_2$ and call $k_2[\\ce{E}]_0 = V_\\text{max}$ (so $k_2 = k_\\text{cat}$):', tex: 'v = \\frac{V_\\text{max}[\\ce{S}]}{K_M + [\\ce{S}]}' },
      { text: 'Limits: for $[\\ce{S}] \\ll K_M$, $v \\approx (V_\\text{max}/K_M)[\\ce{S}]$ (first order); for $[\\ce{S}] \\gg K_M$, $v \\approx V_\\text{max}$ (zero order); and at $[\\ce{S}] = K_M$, $v = V_\\text{max}/2$.' }
    ]
  },
  examples: [
    {
      title: 'Constants from a double-reciprocal plot',
      q: 'Initial rates for an enzyme: [S] = 0.5, 1, 2, 5, 10 mM give v = 10.0, 16.7, 25.0, 35.7, 41.7 µM/s. Find $V_\\text{max}$ and $K_M$.',
      steps: [
        'Reciprocals: 1/[S] = 2.0, 1.0, 0.50, 0.20, 0.10 mM⁻¹; 1/v = 0.100, 0.060, 0.040, 0.028, 0.024 s/µM.',
        'They lie on a straight line: from the first and last points, slope = $(0.100 - 0.024)/(2.0 - 0.10) = 0.040$ s·mM/µM.',
        'Intercept: $0.024 - 0.040\\times0.10 = 0.020$ s/µM, so $V_\\text{max} = 1/0.020 = 50$ µM/s.',
        '$K_M = \\text{slope}\\times V_\\text{max} = 0.040 \\times 50 = 2.0$ mM. Check: at [S] = 2 mM, $v = 25$ µM/s = $V_\\text{max}/2$. ✓'
      ],
      a: 'Vmax = 50 µM/s, Km = 2.0 mM.'
    },
    {
      title: 'Is the enzyme saturated?',
      q: 'Hexokinase ($K_M \\approx 0.1$ mM) and glucokinase ($K_M \\approx 8$ mM) meet blood glucose at 5 mM. What fraction of $V_\\text{max}$ does each reach?',
      steps: [
        'Hexokinase: $v/V_\\text{max} = 5/(0.1 + 5) = 0.98$.',
        'Glucokinase: $5/(8 + 5) = 0.38$; at 10 mM after a meal, $10/18 = 0.56$.',
        'Hexokinase is saturated and insensitive to blood sugar; glucokinase responds to it, letting the liver store glucose when there is plenty.'
      ],
      a: '98 % for hexokinase; 38 % (rising to 56 % after a meal) for glucokinase.'
    }
  ],
  quiz: [
    { q: 'At a substrate concentration equal to Km, the rate is…', choices: ['Vmax', 'Vmax/2', 'Vmax/4', '2 Vmax'], a: 1,
      why: 'v = Vmax·Km/(Km + Km) = Vmax/2. That is the definition of Km in practice.' },
    { q: 'An enzyme has Km = 2.0 mM and Vmax = 50 µM/s. What is the rate (in µM/s) at [S] = 6.0 mM?', answer: 37.5, unit: 'µM/s',
      why: '$v = 50 \\times 6.0/(2.0 + 6.0) = 37.5$ µM/s.' },
    { q: 'A competitive inhibitor is added. Which is true?', choices: ['Vmax falls, Km unchanged', 'apparent Km rises, Vmax unchanged', 'both fall', 'neither changes'], a: 1,
      why: 'The inhibitor competes for the active site; enough substrate displaces it, so Vmax can still be reached, but more substrate is needed for half-speed.' },
    { q: 'At very high substrate concentrations an enzyme-catalysed reaction is zero order in substrate.', a: true,
      why: 'With every active site occupied, v ≈ Vmax regardless of [S]. This is why alcohol is cleared at a nearly constant rate.' },
    { q: 'Doubling the amount of enzyme (substrate in large excess) will…', choices: ['double Vmax and leave Km unchanged', 'halve Km', 'double both', 'change neither'], a: 0,
      why: 'Vmax = kcat[E]₀ is proportional to the enzyme concentration; Km is a property of the enzyme–substrate pair, independent of how much enzyme there is.' }
  ],
  sim: 'tk-michaelis',
  applications: ['Drug design: most drugs are enzyme inhibitors (statins, ACE inhibitors, antivirals).', 'Blood-glucose meters use glucose oxidase; biological washing powders use proteases and lipases that work in cool water.', 'Industrial biocatalysis: high-fructose syrup, lactose-free milk, penicillin derivatives.', 'Diagnosing disease from enzyme activities in the blood.'],
  history: 'Leonor Michaelis and Maud Menten published their analysis of the enzyme invertase in 1913; George Briggs and J. B. S. Haldane gave the steady-state derivation in 1925, and Hans Lineweaver and Dean Burk the double-reciprocal plot in 1934.'
}

);
