/* HYPER-CHEMISTRY · content/chemical-thermodynamics.js — the chemist's view of
 * entropy and Gibbs free energy: standard molar entropies, ΔS of reaction,
 * ΔG = ΔH − TΔS, the temperature that tips a reaction, and ΔG° = −RT ln K.
 * The physics of entropy and the laws of thermodynamics live in Hyper Physics. */
Hyper.add(

{
  id: 'entropy', parent: 'chemical-thermodynamics', title: 'Entropy', level: 2,
  short: 'Entropy counts the ways the particles and energy of a system can be arranged. Gases, mixtures and disordered solids have many; reactions that make gas or dissolve crystals usually increase it.',
  keywords: ['entropy', 'S', 'ΔS', 'microstates', 'S = k ln W', 'Boltzmann', 'standard molar entropy', 'third law', 'entropy of reaction', 'entropy of vaporisation', 'Trouton\'s rule', 'disorder', 'spreading of energy', 'entropy of surroundings', 'second law'],
  prereq: ['physics:entropy', 'physics:second-law-thermodynamics', 'enthalpy', 'math:logarithms'],
  related: ['gibbs-energy', 'gibbs-temperature', 'physics:third-law', 'phase-diagrams', 'solubility', 'math:combinatorics'],
  body: `
Open a bottle of perfume in a corner and within minutes it can be smelled across the room; the reverse — every scent molecule gathering back into the bottle — never happens, although no law of motion forbids it. It is simply outnumbered. There are vastly more ways for the molecules to be spread through the room than to be crowded in the bottle, and a system left to itself drifts towards the arrangements that are most numerous. **Entropy** is the measure of that number.

### Counting arrangements
Boltzmann's definition links the entropy $S$ to $W$, the number of microscopic arrangements (microstates) consistent with what we see:

$$S = k_B \\ln W$$

Take $N$ molecules and double the volume available to them: each molecule now has twice as many places to be, so $W$ grows by $2^N$ and $S$ by $N k_B \\ln 2$. For a mole of gas that is $R \\ln 2 = 5.76$ J/(mol·K) — a tiny number in joules, because $k_B$ is tiny, hiding an unimaginably large factor ($2^{6\\times10^{23}}$) in $W$. Energy counts the same way: spreading a given amount of energy over more particles, or over more levels, multiplies the ways it can be shared. "Disorder" is a useful shorthand, but the precise idea is **how widely matter and energy are spread**.

### Standard molar entropies
Unlike enthalpy, entropy has a natural zero: by the [[physics:third-law|third law]], a perfect crystal at absolute zero has only one arrangement, $W = 1$, and $S = 0$. Measuring heat capacities from near 0 K upwards gives **absolute** entropies, tabulated as standard molar entropies $S^\\circ$ at 1 bar and 298 K. Every substance has a positive value — elements too.

| Substance | $S^\\circ$ J/(mol·K) | Substance | $S^\\circ$ J/(mol·K) |
|---|---|---|---|
| C (diamond) | 2.4 | $\\ce{H2O(l)}$ | 69.9 |
| C (graphite) | 5.7 | $\\ce{H2O(g)}$ | 188.8 |
| $\\ce{CaO(s)}$ | 39.8 | $\\ce{H2(g)}$ | 130.7 |
| $\\ce{CaCO3(s)}$ | 92.9 | $\\ce{O2(g)}$ | 205.2 |
| $\\ce{Br2(l)}$ | 152.2 | $\\ce{CO2(g)}$ | 213.8 |
| $\\ce{Br2(g)}$ | 245.5 | $\\ce{NH3(g)}$ | 192.8 |

The patterns: **gas ≫ liquid > solid**; heavier and more complex molecules have more (more ways to rotate and vibrate); stiff, strongly bonded solids such as diamond have very little.

### Entropy change of a reaction
The same bookkeeping as for enthalpy:

$$\\Delta S^\\circ = \\sum \\nu\\, S^\\circ(\\text{products}) - \\sum \\nu\\, S^\\circ(\\text{reactants})$$

For the Haber process, $\\ce{N2 + 3H2 -> 2NH3}$: $2(192.8) - 191.6 - 3(130.7) = -198.1$ J/(mol·K). Four moles of gas become two, and the entropy falls. That is the quick rule: **the sign of ΔS usually follows the change in moles of gas**; if the gas count does not change, look at dissolving (usually +) or at making a crystal (−).

### Phase changes and the surroundings
At a phase transition heat flows reversibly at constant temperature, so $\\Delta S = \\Delta H/T$. Boiling water: $40.7\\ \\mathrm{kJ/mol} / 373.15\\ \\mathrm{K} = 109$ J/(mol·K). Many liquids come close to 85–88 J/(mol·K) (**Trouton's rule**: benzene 87); water and ethanol are higher because hydrogen bonds make the liquid more ordered than usual.

The heat a reaction releases does not vanish: it raises the entropy of the surroundings by $-\\Delta H/T$. The [[physics:second-law-thermodynamics|second law]] demands only that the **total** entropy, system plus surroundings, rises. A process can lower its own entropy — water freezing, ammonia forming, a cell building proteins — provided it releases enough heat. That trade-off is exactly what [[gibbs-energy|Gibbs free energy]] measures.
`,
  ideas: [
    'Entropy measures the number of arrangements of particles and energy: S = k_B ln W.',
    'By the third law a perfect crystal at 0 K has S = 0, so absolute standard molar entropies can be tabulated; all are positive.',
    'Gases have far more entropy than liquids or solids; a reaction that makes gas usually has ΔS > 0.',
    'ΔS° = Σν S°(products) − Σν S°(reactants); at a phase change ΔS = ΔH/T.',
    'Heat released raises the entropy of the surroundings by −ΔH/T; only the total must increase.'
  ],
  pitfalls: [
    'Elements have zero entropy, as they have zero enthalpy of formation — Standard entropies are absolute, not formation values. O₂(g) has 205.2 J/(mol·K).',
    'A process that lowers the entropy of the system cannot be spontaneous — Freezing water does exactly that. The second law concerns system plus surroundings; the heat released can more than pay for it.',
    'ΔS in J/(mol·K) and ΔH in kJ/mol can be combined as they stand — Convert first: a factor of 1000 is the most common error in ΔG = ΔH − TΔS.'
  ],
  formulas: [
    {
      name: 'Boltzmann\'s entropy',
      expr: 'S = kB*ln(W)', tex: 'S = k_B \\ln W',
      vars: {
        S: { name: 'entropy', q: 'entropy', unit: 'J/K' },
        kB: { const: 'kB' },
        W: { name: 'number of microstates', value: 1e24, min: 1 }
      },
      note: 'Even $10^{24}$ arrangements give only $7.6\\times10^{-22}$ J/K; the entropies of real samples correspond to numbers of arrangements with around $10^{25}$ digits.',
      practice: { unknowns: ['S'] },
      stories: { S: 'A system can be arranged in {W} ways. What is its entropy?' }
    },
    {
      name: 'Standard entropy change of a reaction',
      expr: 'dS = c*Sc + d*Sd - a*Sa - b*Sb', tex: '\\Delta S^\\circ = c\\,S_C + d\\,S_D - a\\,S_A - b\\,S_B',
      vars: {
        dS: { name: 'standard entropy change', q: 'molarheat', unit: 'J/(mol·K)', signed: true, tex: '\\Delta S^\\circ' },
        a: { name: 'coefficient of reactant A', int: true, fixed: true, value: 1 },
        Sa: { name: 'S° of reactant A', q: 'molarheat', unit: 'J/(mol·K)', value: 186.3, tex: 'S_A' },
        b: { name: 'coefficient of reactant B', int: true, fixed: true, value: 2 },
        Sb: { name: 'S° of reactant B', q: 'molarheat', unit: 'J/(mol·K)', value: 205.2, tex: 'S_B' },
        c: { name: 'coefficient of product C', int: true, fixed: true, value: 1 },
        Sc: { name: 'S° of product C', q: 'molarheat', unit: 'J/(mol·K)', value: 213.8, tex: 'S_C' },
        d: { name: 'coefficient of product D', int: true, fixed: true, value: 2 },
        Sd: { name: 'S° of product D', q: 'molarheat', unit: 'J/(mol·K)', value: 69.9, tex: 'S_D' }
      },
      note: 'For $a\\,\\ce{A} + b\\,\\ce{B} -> c\\,\\ce{C} + d\\,\\ce{D}$. Defaults: methane burning to liquid water, $\\ce{CH4 + 2O2 -> CO2 + 2H2O(l)}$: three moles of gas become one, and ΔS° is strongly negative.',
      practice: { unknowns: ['dS', 'Sa'] },
      stories: {
        dS: 'For $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$, S° is {Sa} for methane, {Sb} for oxygen, {Sc} for carbon dioxide and {Sd} for liquid water. What is ΔS°?',
        Sa: 'Methane burns to liquid water with ΔS° = {dS}. With S° = {Sb} for O₂, {Sc} for CO₂ and {Sd} for H₂O(l), what is S° of methane?'
      }
    },
    {
      name: 'Entropy of a phase change',
      expr: 'dS = dH/T', tex: '\\Delta S = \\frac{\\Delta H}{T}',
      vars: {
        dS: { name: 'entropy change of the transition', q: 'molarheat', unit: 'J/(mol·K)', signed: true, tex: '\\Delta S' },
        dH: { name: 'enthalpy of the transition', q: 'molarenergy', unit: 'kJ/mol', value: 40.7, signed: true, tex: '\\Delta H' },
        T: { name: 'transition temperature', q: 'temperature', unit: 'K', value: 373.15 }
      },
      note: 'Exact at the equilibrium melting or boiling point, where the heat flows reversibly. Defaults: water boiling at 1 atm.',
      practice: { unknowns: ['dS', 'T'] },
      stories: {
        dS: 'A liquid boils at {T} with an enthalpy of vaporisation of {dH}. What is its entropy of vaporisation?',
        T: 'A liquid obeys Trouton\'s rule, ΔS = {dS}, and its enthalpy of vaporisation is {dH}. Estimate its boiling point.'
      }
    },
    {
      name: 'Expanding or diluting an ideal gas',
      expr: 'dS = n*R*ln(V2/V1)', tex: '\\Delta S = nR\\ln\\frac{V_2}{V_1}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 48.8 },
        V1: { name: 'initial volume', q: 'volume', unit: 'L', value: 24.4 }
      },
      note: 'At constant temperature. Doubling the volume gives $R\\ln 2 = 5.76$ J/K per mole — the counting argument $S = k_B\\ln W$ with $W \\to 2^N W$.',
      practice: { unknowns: ['dS', 'V2'] },
      stories: {
        dS: '{n} of gas at constant temperature spreads from {V1} into {V2}. By how much does its entropy change?',
        V2: '{n} of gas starts in {V1}. Its entropy rises by {dS} at constant temperature. What is its final volume?'
      }
    }
  ],
  derivation: {
    title: 'From counting to R ln 2',
    steps: [
      { text: 'Divide a container into cells. A molecule confined to the left half can be in any of $M$ cells; with the partition removed, in any of $2M$. For $N$ independent molecules the counts multiply:', tex: 'W_1 = M^N, \\qquad W_2 = (2M)^N = 2^N W_1' },
      { text: 'Boltzmann\'s formula turns the ratio into a difference of entropies:', tex: '\\Delta S = k_B\\ln W_2 - k_B\\ln W_1 = k_B \\ln 2^N = N k_B \\ln 2' },
      { text: 'For one mole, $N = N_A$ and $N_A k_B = R$:', tex: '\\Delta S = R\\ln 2 = 5.76\\ \\mathrm{J/(mol\\cdot K)}' },
      { text: 'The same argument with a volume ratio $V_2/V_1$ in place of 2 gives the thermodynamic result for an isothermal expansion:', tex: '\\Delta S = nR\\ln\\frac{V_2}{V_1}' }
    ]
  },
  examples: [
    {
      title: 'Why ice melts above 0 °C and not below',
      q: 'Melting ice has ΔH = +6.01 kJ/mol and ΔS = +22.0 J/(mol·K). Find the total entropy change for melting a mole of ice in surroundings at −10 °C and at +10 °C (treat ΔH and ΔS as constant).',
      steps: [
        'At −10 °C (263.15 K) the surroundings lose 6010 J of heat: $\\Delta S_\\text{surr} = -6010/263.15 = -22.84$ J/K.',
        'Total: $22.0 - 22.84 = -0.84$ J/K. Negative: the ice does not melt.',
        'At +10 °C (283.15 K): $\\Delta S_\\text{surr} = -6010/283.15 = -21.23$ J/K; total $22.0 - 21.23 = +0.77$ J/K. Positive: it melts.',
        'The same heat costs the surroundings more entropy when they are cold. The balance tips at $T = \\Delta H/\\Delta S = 273$ K.'
      ],
      a: '−0.84 J/K at −10 °C (no melting); +0.77 J/K at +10 °C (melting).'
    },
    {
      title: 'Predicting and checking a sign',
      q: 'Predict the sign of ΔS° for $\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$, then calculate it: S° = 92.9, 39.8 and 213.8 J/(mol·K).',
      steps: [
        'A solid gives a solid and a gas: a mole of gas appears, so ΔS° should be clearly positive.',
        '$\\Delta S^\\circ = 39.8 + 213.8 - 92.9 = +160.7$ J/(mol·K).',
        'The gas term dominates: one mole of CO₂ carries more entropy than both solids together.'
      ],
      a: '+160.7 J/(mol·K), positive as predicted.'
    }
  ],
  quiz: [
    { q: 'Which change has the largest positive entropy change?', choices: ['$\\ce{H2O(l) -> H2O(s)}$', '$\\ce{2SO2(g) + O2(g) -> 2SO3(g)}$', '$\\ce{NH4Cl(s) -> NH3(g) + HCl(g)}$', '$\\ce{Ag+(aq) + Cl-(aq) -> AgCl(s)}$'], a: 2,
      why: 'A solid becomes two moles of gas. Freezing, the SO₃ reaction (3 mol gas → 2) and precipitation all lower the entropy.' },
    { q: 'Standard molar entropies of elements in their standard states are zero.', a: false,
      why: 'That is true for enthalpies of formation, which are measured from the elements. Entropies are absolute, measured from 0 K: graphite has 5.7 J/(mol·K), oxygen 205.2.' },
    { q: 'Benzene boils at 80.1 °C with ΔH_vap = 30.7 kJ/mol. What is its entropy of vaporisation in J/(mol·K)?', answer: 86.9, unit: 'J/(mol·K)',
      why: '$\\Delta S = 30\\,700/353.25 = 86.9$ J/(mol·K), right on Trouton\'s rule.' },
    { q: 'Water freezes spontaneously at −5 °C although its entropy falls. How?', choices: ['the second law does not apply to water', 'the heat released raises the entropy of the colder surroundings by more than the water loses', 'entropy is not defined below 0 °C', 'freezing is not spontaneous; it needs a seed crystal'], a: 1,
      why: 'Freezing releases 6.01 kJ/mol into surroundings at 268 K, a gain of 22.4 J/(mol·K), more than the 22.0 the water loses. The total rises.' },
    { q: 'By how much does the entropy of 1 mol of ideal gas change when it expands at constant temperature to ten times its volume?', choices: ['+19.1 J/K', '+83.1 J/K', '+5.76 J/K', '−19.1 J/K'], a: 0,
      why: '$\\Delta S = R\\ln 10 = 8.314 \\times 2.303 = 19.1$ J/K. Each factor of 10 in volume adds 19.1 J/K per mole.' }
  ],
  sim: 'tk-microstates',
  applications: ['Predicting whether reactions become favourable when heated (limestone kilns, metal extraction).', 'Understanding why salts dissolve and gases mix even when the process absorbs heat.', 'Refrigeration and heat pumps, which move entropy from cold to hot at a cost in work.', 'Rubber elasticity and protein folding, both governed largely by entropy.'],
  history: 'Rudolf Clausius coined the word entropy in 1865, from the Greek for "transformation". Ludwig Boltzmann connected it to counting in the 1870s; the formula S = k log W is carved on his tombstone in Vienna.'
},

{
  id: 'gibbs-energy', parent: 'chemical-thermodynamics', title: 'Gibbs free energy and spontaneity', level: 2,
  short: 'ΔG = ΔH − TΔS combines the heat of a reaction with its entropy change into one number: a reaction at constant temperature and pressure can go by itself only if ΔG is negative, and −ΔG is the most useful work it can deliver.',
  keywords: ['Gibbs free energy', 'free energy', 'ΔG', 'spontaneous', 'spontaneity', 'ΔG = ΔH − TΔS', 'standard free energy of formation', 'maximum work', 'exergonic', 'endergonic', 'coupled reactions', 'ATP', 'fuel cell efficiency'],
  prereq: ['entropy', 'enthalpy-of-formation', 'physics:second-law-thermodynamics'],
  related: ['gibbs-temperature', 'gibbs-equilibrium', 'cell-potential-gibbs', 'batteries-fuel-cells', 'reaction-rate'],
  body: `
For a century chemists hoped that heat alone decided which way reactions run — that everything slides downhill in enthalpy. It is nearly true, which made it hard to abandon: most spontaneous reactions *are* exothermic. But ice melts in a warm room, salt and ammonium nitrate dissolve with cooling, water evaporates from a dish. The missing piece is entropy.

### From the second law to one number
A process at constant temperature and pressure goes by itself if it raises the total entropy of the universe. Split that into the system and its surroundings. The heat the system releases, $-\\Delta H$, raises the entropy of the surroundings by $-\\Delta H/T$:

$$\\Delta S_\\text{total} = \\Delta S - \\frac{\\Delta H}{T}$$

Multiply by $-T$ and define the **Gibbs free energy change**:

$$\\Delta G = \\Delta H - T\\,\\Delta S = -T\\,\\Delta S_\\text{total}$$

Now everything is about the system alone:
- $\\Delta G < 0$: the process is **spontaneous** (exergonic) — it can happen without outside help.
- $\\Delta G > 0$: it cannot go by itself; the **reverse** is spontaneous (endergonic).
- $\\Delta G = 0$: the system is at **equilibrium** — ice and water at 0 °C.

The two terms are a tug of war: a negative ΔH (releasing heat) and a positive ΔS (spreading out) both push ΔG down, and temperature sets how much the entropy term weighs ([[gibbs-temperature|temperature and spontaneity]]).

### Worked through: the Haber process
$\\ce{N2 + 3H2 -> 2NH3}$ has $\\Delta H^\\circ = -92.2$ kJ/mol and $\\Delta S^\\circ = -198.1$ J/(mol·K). At 298 K:

$$\\Delta G^\\circ = -92.2 - 298.15 \\times (-0.1981) = -33.1\\ \\mathrm{kJ/mol}$$

The heat released wins over the loss of entropy: at room temperature ammonia *should* form. It does not, in practice, because the reaction is immeasurably slow — spontaneity says nothing about speed.

### Free energies of formation
Like enthalpies, standard free energies of formation $\\Delta G_\\text{f}^\\circ$ are tabulated (zero for elements in their standard states), and $\\Delta G^\\circ = \\sum\\nu\\,\\Delta G_\\text{f}^\\circ(\\text{products}) - \\sum\\nu\\,\\Delta G_\\text{f}^\\circ(\\text{reactants})$. For water $\\Delta G_\\text{f}^\\circ = -237.1$ kJ/mol, for $\\ce{CO2}$ −394.4, for diamond +2.9: diamond is unstable with respect to graphite, and stays diamond only because the conversion has an enormous activation barrier.

### Why "free": the useful work
$-\\Delta G$ is the **maximum work other than expansion** a reaction can deliver — in practice, electrical work. A hydrogen fuel cell running $\\ce{H2 + 1/2 O2 -> H2O(l)}$ can deliver at most 237.1 kJ/mol although the reaction releases 285.8 kJ/mol of heat: at least $T\\Delta S$ must leave as heat, capping the efficiency at 83 %. Written per electron, $\\Delta G = -nFE$, which gives the fuel cell's 1.23 V ([[cell-potential-gibbs|cell potential and free energy]]).

### Coupling
A reaction with ΔG > 0 can still be driven by linking it to one with a larger negative ΔG. Cells make glutamine (ΔG°′ ≈ +14 kJ/mol) by coupling it to the hydrolysis of ATP (−30.5 kJ/mol), which leaves about −16 kJ/mol overall. Smelters reduce metal oxides by coupling the reduction to the burning of carbon.

> [!warn] Units: ΔS is usually in J/(mol·K) and ΔH in kJ/mol. Divide ΔS by 1000 before multiplying by T.
`,
  ideas: [
    'At constant T and p, a process is spontaneous only if ΔG = ΔH − TΔS is negative.',
    'ΔG = −TΔS_total: a negative ΔG is the second law written for the system alone.',
    'ΔG = 0 means equilibrium; ΔG > 0 means the reverse process is spontaneous.',
    '−ΔG is the maximum non-expansion (e.g. electrical) work a reaction can deliver.',
    'Spontaneous does not mean fast: kinetics decides the speed.'
  ],
  pitfalls: [
    'Spontaneous means it happens quickly — Diamond → graphite and petrol + air are spontaneous and can last for ages. ΔG says whether, not how fast.',
    'A positive ΔG means the reaction does not happen at all — It means it cannot proceed on its own to completion; it can still reach an equilibrium with a little product, or be driven by coupling, electricity or light.',
    'ΔG° decides spontaneity under any conditions — ΔG° is for standard concentrations and pressures; the actual ΔG depends on the mixture (see free energy and equilibrium).'
  ],
  formulas: [
    {
      name: 'Gibbs free energy change',
      expr: 'dG = dH - T*dS', tex: '\\Delta G = \\Delta H - T\\,\\Delta S',
      vars: {
        dG: { name: 'free energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dH: { name: 'enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: -92.2, signed: true, tex: '\\Delta H' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        dS: { name: 'entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: -198.1, signed: true, tex: '\\Delta S' }
      },
      note: 'Defaults: the Haber synthesis of ammonia, $\\ce{N2 + 3H2 -> 2NH3}$, at 25 °C. The calculator converts J and kJ for you.',
      practice: { unknowns: ['dG', 'dH', 'dS'] },
      stories: {
        dG: 'For $\\ce{N2(g) + 3H2(g) -> 2NH3(g)}$, ΔH° = {dH} and ΔS° = {dS}. What is ΔG° at {T}?',
        dH: 'A reaction has ΔG = {dG} and ΔS = {dS} at {T}. What is ΔH?',
        dS: 'A reaction has ΔH = {dH} and ΔG = {dG} at {T}. What is ΔS?'
      }
    },
    {
      name: 'Entropy change of the universe',
      expr: 'dSu = dS - dH/T', tex: '\\Delta S_\\text{total} = \\Delta S - \\frac{\\Delta H}{T}',
      vars: {
        dSu: { name: 'total entropy change (system + surroundings)', q: 'molarheat', unit: 'J/(mol·K)', signed: true, tex: '\\Delta S_\\text{total}' },
        dS: { name: 'entropy change of the system', q: 'molarheat', unit: 'J/(mol·K)', value: 108.7, signed: true, tex: '\\Delta S' },
        dH: { name: 'enthalpy change of the system', q: 'molarenergy', unit: 'kJ/mol', value: 25.7, signed: true, tex: '\\Delta H' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'Defaults: ammonium nitrate dissolving in a cold pack — endothermic, yet the total entropy rises by about 22 J/(mol·K).',
      practice: { unknowns: ['dSu', 'T'] },
      stories: {
        dSu: 'Ammonium nitrate dissolves with ΔH = {dH} and ΔS = {dS} at {T}. What is the total entropy change?',
        T: 'A process has ΔH = {dH} and ΔS = {dS}. At what temperature is the total entropy change {dSu}?'
      }
    },
    {
      name: 'Free energy as electrical work',
      expr: 'dG = -n*F*E', tex: '\\Delta G = -nFE',
      vars: {
        dG: { name: 'free energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        n: { name: 'electrons transferred per reaction', int: true, value: 2, min: 1 },
        F: { const: 'F' },
        E: { name: 'cell voltage (EMF)', q: 'voltage', unit: 'V', value: 1.229, signed: true }
      },
      note: 'Defaults: a hydrogen–oxygen fuel cell making liquid water, $\\ce{H2 + 1/2 O2 -> H2O}$, two electrons per molecule of water.',
      practice: { unknowns: ['dG', 'E'] },
      stories: {
        dG: 'A cell transfers {n} electrons per reaction and has an EMF of {E}. What is ΔG?',
        E: 'For $\\ce{H2 + 1/2 O2 -> H2O(l)}$, ΔG° = {dG} with {n} electrons per molecule. What is the ideal fuel-cell voltage?'
      }
    }
  ],
  examples: [
    {
      title: 'The cold pack',
      q: 'Ammonium nitrate dissolves with ΔH° = +25.7 kJ/mol and ΔS° = +108.7 J/(mol·K). Is dissolving spontaneous at 25 °C?',
      steps: [
        '$\\Delta G^\\circ = 25.7 - 298.15 \\times 0.1087 = 25.7 - 32.4 = -6.7$ kJ/mol.',
        'Negative: it dissolves by itself, absorbing heat from the water and chilling the pack.',
        'The crystal breaking up into freely moving hydrated ions gains enough entropy to pay for the heat it borrows.'
      ],
      a: 'Yes: ΔG° ≈ −6.7 kJ/mol. Entropy drives it.'
    },
    {
      title: 'Burning methane: heat versus work',
      q: 'For $\\ce{CH4 + 2O2 -> CO2 + 2H2O(l)}$, ΔH° = −890.3 kJ/mol and ΔS° = −243.1 J/(mol·K). Find ΔG° at 298 K and the largest fraction of the heat a perfect fuel cell could turn into electricity.',
      steps: [
        '$\\Delta G^\\circ = -890.3 - 298.15\\times(-0.2431) = -890.3 + 72.5 = -817.8$ kJ/mol (the same as from formation free energies).',
        'Maximum electrical work: 817.8 kJ/mol. Ratio: $817.8/890.3 = 0.92$.',
        'The entropy of the system falls, so at least $T|\\Delta S| = 72.5$ kJ/mol must leave as heat to make the total entropy rise.',
        'A power station burning the same gas is limited by the Carnot factor of its heat engines instead; the best combined-cycle plants reach about 60 %.'
      ],
      a: 'ΔG° = −817.8 kJ/mol; at most 92 % of the reaction enthalpy can become work.'
    }
  ],
  quiz: [
    { q: 'A reaction has ΔH = −50 kJ/mol and ΔS = +100 J/(mol·K). It is spontaneous…', choices: ['at all temperatures', 'only at low temperatures', 'only at high temperatures', 'at no temperature'], a: 0,
      why: 'Both terms push ΔG negative: ΔH is negative and −TΔS is negative for any T > 0.' },
    { q: 'For $\\ce{2H2O2(l) -> 2H2O(l) + O2(g)}$, ΔH° = −196.0 kJ/mol and ΔS° = +125.8 J/(mol·K). What is ΔG° at 298.15 K in kJ/mol?', answer: -233.5, unit: 'kJ/mol',
      why: '$-196.0 - 298.15 \\times 0.1258 = -196.0 - 37.5 = -233.5$ kJ/mol. Hydrogen peroxide is thermodynamically unstable; it keeps only because the decomposition is slow without a catalyst.' },
    { q: 'Diamond has ΔG_f° = +2.9 kJ/mol. Why do diamonds last?', choices: ['ΔG is positive for diamond → graphite', 'the conversion to graphite has a huge activation energy, so it is immeasurably slow', 'diamonds are kept at high pressure', 'entropy favours diamond'], a: 1,
      why: 'Diamond → graphite has ΔG° = −2.9 kJ/mol, so it is spontaneous. But rearranging a covalent network needs enormous activation energy: thermodynamics allows it, kinetics forbids it.' },
    { q: 'A negative ΔG means the total entropy of system plus surroundings increases.', a: true,
      why: 'ΔG = −TΔS_total, so ΔG < 0 exactly when ΔS_total > 0 (at constant temperature and pressure).' },
    { q: 'Why can a fuel cell never turn all of ΔH of the hydrogen–oxygen reaction into electricity?', choices: ['because of resistance in the wires', 'because ΔS of the reaction is negative, so TΔS must leave as heat', 'because the Carnot limit applies', 'because hydrogen is a gas'], a: 1,
      why: 'The maximum electrical work is −ΔG = −ΔH + TΔS. With ΔS < 0, some heat must be released to the surroundings: the limit is 83 %. The Carnot limit applies to heat engines, not to fuel cells.' }
  ],
  sim: 'tk-gibbs',
  applications: ['Deciding which reactions are worth trying before any experiment.', 'Fuel cells and batteries: the maximum voltage and efficiency.', 'Metabolism: ATP-coupled reactions that build proteins and DNA.', 'Metallurgy: which reducing agent can extract a given metal from its ore.'],
  history: 'Josiah Willard Gibbs, at Yale, set out free energy and chemical equilibrium in a long paper published in 1875–78 in an obscure Connecticut journal. It took Europe a decade to notice; Wilhelm Ostwald translated it into German in 1892. Until then many chemists followed the Thomsen–Berthelot principle that only exothermic reactions are spontaneous.'
},

{
  id: 'gibbs-temperature', parent: 'chemical-thermodynamics', title: 'How temperature decides spontaneity', level: 2,
  short: 'When ΔH and ΔS have the same sign, temperature decides: the reaction switches from spontaneous to non-spontaneous at T = ΔH/ΔS. This explains melting and boiling points, limestone kilns and the compromise temperature of the Haber process.',
  keywords: ['temperature dependence', 'crossover temperature', 'T = ΔH/ΔS', 'four cases', 'enthalpy-driven', 'entropy-driven', 'Ellingham diagram', 'boiling point estimate', 'thermal decomposition', 'Haber process temperature'],
  prereq: ['gibbs-energy', 'entropy'],
  related: ['gibbs-equilibrium', 'vant-hoff', 'phase-diagrams', 'le-chatelier', 'arrhenius-equation'],
  body: `
In $\\Delta G = \\Delta H - T\\Delta S$ the temperature multiplies only the entropy term. At low temperature ΔG is dominated by ΔH; as $T$ rises the entropy term weighs more and more, and eventually takes over. Plot ΔG against $T$ and you get (to a good approximation) a straight line: intercept ΔH at $T = 0$, slope $-\\Delta S$.

### The four cases
| ΔH | ΔS | ΔG | Spontaneous… | Example |
|---|---|---|---|---|
| − | + | always − | at every temperature | $\\ce{2H2O2 -> 2H2O + O2}$, burning fuels |
| + | − | always + | never (the reverse always is) | $\\ce{3O2 -> 2O3}$ |
| − | − | − when cold | **below** $T = \\Delta H/\\Delta S$ | freezing, condensing, the Haber synthesis |
| + | + | − when hot | **above** $T = \\Delta H/\\Delta S$ | melting, boiling, $\\ce{CaCO3 -> CaO + CO2}$ |

In the last two rows the reaction changes direction at the **crossover temperature**, where ΔG = 0:

$$T^* = \\frac{\\Delta H}{\\Delta S}$$

For a phase change that is the melting or boiling point. Bromine, $\\ce{Br2(l) -> Br2(g)}$, has ΔH° = +30.9 kJ/mol and ΔS° = +93.3 J/(mol·K): $T^* = 331$ K = 58 °C, and bromine boils at 58.8 °C. For a reaction it is roughly where the equilibrium constant passes through 1 ([[gibbs-equilibrium|free energy and K]]) — the temperature at which products and reactants are about equally favoured under standard conditions.

### Limestone to lime
$\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$: ΔH° = +178.3 kJ/mol, ΔS° = +160.7 J/(mol·K), so $T^* = 1110$ K ≈ 840 °C. Below that, limestone is stable (fortunately for chalk cliffs); above it, the pressure of CO₂ over the stone exceeds 1 bar and the stone decomposes. Lime kilns run at 900–1000 °C, and cement kilns hotter still.

### Ammonia: a compromise
The Haber synthesis has ΔH° = −92.2 kJ/mol and ΔS° = −198.1 J/(mol·K): favourable when cold, with $T^* = 465$ K (192 °C) at standard pressure. But at low temperature it is far too slow even on an iron catalyst. Industry runs at 400–450 °C, accepting a less favourable equilibrium to get a useful rate, and pushes the equilibrium back with pressures of 150–300 bar and by removing ammonia as it forms. Thermodynamics and kinetics pulling in opposite directions are a recurring theme of industrial chemistry.

### Metals from ores
Plotting ΔG° of oxide formation against temperature (an **Ellingham diagram**) shows why carbon reduces iron ore in a blast furnace: making CO from carbon, $\\ce{2C + O2 -> 2CO}$, *gains* gas and entropy, so its line falls with temperature while most metal-oxide lines rise. Above the crossing, carbon grabs the oxygen. For alumina the crossing lies around 2000 °C, far too hot to be practical — so aluminium is made by electrolysis instead.

> [!note] ΔH and ΔS themselves change a little with temperature, so crossover temperatures from 298 K data are estimates, usually good to a few per cent.
`,
  ideas: [
    'ΔG = ΔH − TΔS is (nearly) a straight line in T with slope −ΔS.',
    'If ΔH and ΔS have opposite signs, temperature cannot change the verdict.',
    'If they have the same sign, the reaction switches at T* = ΔH/ΔS: entropy wins above it (ΔS > 0) or enthalpy wins below it (ΔS < 0).',
    'For a phase change T* is the melting or boiling point.',
    'Industrial conditions often trade a less favourable equilibrium for a faster rate.'
  ],
  pitfalls: [
    'Heating always makes a reaction more favourable — Only if ΔS > 0. For the Haber synthesis (ΔS < 0) heating makes the equilibrium worse, even though it speeds up the rate.',
    'Above T* the reaction happens instantly — T* only marks where ΔG° changes sign; the rate is a separate question.',
    'Forgetting to convert ΔS to kJ — T* = 178.3 kJ/mol ÷ 160.7 J/(mol·K) needs 178 300 J/mol, giving 1110 K, not 1.1 K.'
  ],
  formulas: [
    {
      name: 'Crossover temperature',
      expr: 'T = dH/dS', tex: 'T^* = \\frac{\\Delta H}{\\Delta S}',
      vars: {
        T: { name: 'temperature at which ΔG = 0', q: 'temperature', unit: 'K', tex: 'T^*' },
        dH: { name: 'enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: 178.3, signed: true, tex: '\\Delta H' },
        dS: { name: 'entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: 160.7, signed: true, tex: '\\Delta S' }
      },
      note: 'Meaningful only when ΔH and ΔS have the same sign. Defaults: limestone decomposing to quicklime.',
      practice: { unknowns: ['T', 'dS'] },
      stories: {
        T: 'Limestone decomposes, $\\ce{CaCO3 -> CaO + CO2}$, with ΔH° = {dH} and ΔS° = {dS}. Above what temperature is the decomposition spontaneous under standard conditions?',
        dS: 'A liquid with an enthalpy of vaporisation of {dH} boils at {T}. What is its entropy of vaporisation?'
      }
    },
    {
      name: 'Free energy at another temperature',
      expr: 'dG = dH - T*dS', tex: '\\Delta G(T) \\approx \\Delta H^\\circ - T\\,\\Delta S^\\circ',
      vars: {
        dG: { name: 'free energy change at T', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dH: { name: 'enthalpy change (298 K value)', q: 'molarenergy', unit: 'kJ/mol', value: 178.3, signed: true, tex: '\\Delta H^\\circ' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 926.85 },
        dS: { name: 'entropy change (298 K value)', q: 'molarheat', unit: 'J/(mol·K)', value: 160.7, signed: true, tex: '\\Delta S^\\circ' }
      },
      note: 'Assumes ΔH° and ΔS° do not change much with temperature. Defaults: limestone at 1200 K (927 °C), where ΔG° ≈ −14.5 kJ/mol.',
      practice: { unknowns: ['dG', 'T'] },
      stories: {
        dG: 'Limestone has ΔH° = {dH} and ΔS° = {dS} for decomposing to lime. Estimate ΔG° in a kiln at {T}.',
        T: 'A reaction has ΔH° = {dH} and ΔS° = {dS}. At what temperature is ΔG° = {dG}?'
      }
    }
  ],
  examples: [
    {
      title: 'Estimating a boiling point from tables',
      q: 'At 298 K, water vapour has ΔH_f° = −241.8 and liquid water −285.8 kJ/mol; S° = 188.8 and 69.9 J/(mol·K). Estimate the normal boiling point of water.',
      steps: [
        'For $\\ce{H2O(l) -> H2O(g)}$: ΔH° = −241.8 − (−285.8) = +44.0 kJ/mol.',
        'ΔS° = 188.8 − 69.9 = +118.9 J/(mol·K).',
        '$T^* = 44\\,000/118.9 = 370$ K = 97 °C.',
        'The real value is 100 °C: the 298 K data are used 75 K away from where they were measured (ΔH_vap falls to 40.7 kJ/mol at the boiling point, and ΔS_vap to 109 J/(mol·K)).'
      ],
      a: 'About 370 K (97 °C), within 1 % of the true 373 K.'
    },
    {
      title: 'The Haber process at working temperature',
      q: 'Using ΔH° = −92.2 kJ/mol and ΔS° = −198.1 J/(mol·K), find ΔG° for the ammonia synthesis at 700 K.',
      steps: [
        '$\\Delta G^\\circ = -92.2 - 700 \\times (-0.1981) = -92.2 + 138.7 = +46.5$ kJ/mol.',
        'Positive: at standard pressures (1 bar each) the equilibrium lies on the side of nitrogen and hydrogen.',
        'That is why the plant works at 150–300 bar: the pressure pushes the equilibrium towards the fewer moles of gas, and unreacted gas is recycled after the ammonia is condensed out.'
      ],
      a: 'ΔG° ≈ +46 kJ/mol at 700 K; high pressure and recycling make the process work.'
    }
  ],
  quiz: [
    { q: 'A reaction has ΔH = +120 kJ/mol and ΔS = +150 J/(mol·K). Above what temperature (in K) is it spontaneous under standard conditions?', answer: 800, unit: 'K',
      why: '$T^* = 120\\,000/150 = 800$ K. Above it the entropy term −TΔS outweighs ΔH.' },
    { q: 'For $\\ce{3O2(g) -> 2O3(g)}$, ΔH° = +285 kJ/mol and ΔS° = −138 J/(mol·K). At what temperature is ozone formation spontaneous?', choices: ['below about 2070 K', 'above about 2070 K', 'at no temperature', 'at all temperatures'], a: 2,
      why: 'ΔH > 0 and ΔS < 0: both terms make ΔG positive at every temperature. Ozone forms only when energy is supplied from outside — ultraviolet light in the stratosphere, or electrical discharge in an ozone generator.' },
    { q: 'Raising the temperature of the Haber process from 200 °C to 450 °C…', choices: ['makes the equilibrium yield better and the rate faster', 'makes the equilibrium yield worse but the rate faster', 'makes both worse', 'changes neither'], a: 1,
      why: 'ΔS < 0, so −TΔS grows more positive with T: the equilibrium shifts back. The rate rises steeply with temperature (Arrhenius), and that is the trade the industry makes.' },
    { q: 'On a plot of ΔG against T, the slope of the line is ΔH.', a: false,
      why: 'ΔG = ΔH − TΔS: the slope is −ΔS and the intercept at T = 0 is ΔH.' }
  ],
  sim: { id: 'tk-gibbs', params: { rx: 1 } },
  applications: ['Lime and cement kilns: the temperature at which carbonates decompose.', 'Blast furnaces and Ellingham diagrams: which metals carbon can extract.', 'Choosing reactor temperatures in the Haber, Contact and steam-reforming processes.', 'Estimating boiling and sublimation points from thermodynamic tables.']
},

{
  id: 'gibbs-equilibrium', parent: 'chemical-thermodynamics', title: 'Free energy and the equilibrium constant', level: 3,
  short: 'ΔG° fixes the equilibrium constant: ΔG° = −RT ln K. Every 5.7 kJ/mol of ΔG° at room temperature is a factor of ten in K, and ΔG = ΔG° + RT ln Q tells a mixture which way to move.',
  keywords: ['ΔG° = −RT ln K', 'equilibrium constant', 'reaction quotient', 'ΔG = ΔG° + RT ln Q', 'standard state', 'activity', 'thermodynamic equilibrium constant', 'van \'t Hoff', 'free energy and K', 'biochemical standard state'],
  prereq: ['gibbs-energy', 'equilibrium-constant', 'reaction-quotient', 'math:logarithms'],
  related: ['vant-hoff', 'gibbs-temperature', 'cell-potential-gibbs', 'nernst-equation', 'le-chatelier', 'vapor-pressure'],
  body: `
ΔG° answers a question about an idealised experiment: pure reactants, each at its standard state (1 bar for gases, 1 mol/L for solutes), turning completely into pure products at their standard states. Real reactions do not go to completion. They stop at an equilibrium mixture — and ΔG° tells you exactly where.

### ΔG depends on the mixture
As a reaction proceeds, the free energy change for a little more of it depends on the current composition, summed up in the [[reaction-quotient|reaction quotient]] $Q$:

$$\\Delta G = \\Delta G^\\circ + RT\\ln Q$$

With reactants only, $Q \\to 0$ and $\\ln Q \\to -\\infty$: the reaction always starts forward. As products accumulate $Q$ grows, ΔG rises, and the reaction stops when $\\Delta G = 0$. There $Q$ has become the [[equilibrium-constant|equilibrium constant]] $K$:

$$0 = \\Delta G^\\circ + RT\\ln K \\qquad\\Rightarrow\\qquad \\Delta G^\\circ = -RT\\ln K, \\quad K = e^{-\\Delta G^\\circ/RT}$$

The free energy curve of the mixture has its minimum at equilibrium; ΔG is its slope, and a reaction always rolls downhill towards the bottom from either side. That is why a mixture with $Q < K$ moves forward and one with $Q > K$ moves back.

### Reading the exponential
At 298 K, $RT\\ln 10 = 5.71$ kJ/mol. So:

| ΔG° (kJ/mol) | K at 298 K | In practice |
|---|---|---|
| −57 | $10^{10}$ | complete |
| −11.4 | 100 | mostly products |
| 0 | 1 | comparable amounts |
| +11.4 | 0.01 | mostly reactants |
| +57 | $10^{-10}$ | no detectable reaction |

A few tens of kJ/mol either way separate "nothing happens" from "goes to completion". This is why ΔG° near zero matters so much in biochemistry, where many steps sit within ±10 kJ/mol and are pulled along by what happens next.

### What goes into K and Q
Every concentration or pressure is divided by its standard value, so $K$ and $Q$ are pure numbers: $[\\ce{A}]/(1\\ \\mathrm{M})$, $p/(1\\ \\mathrm{bar})$. Pure solids and liquids have activity 1 and drop out. For evaporation, $\\ce{H2O(l) <=> H2O(g)}$, $K$ is just the vapour pressure in bar: from ΔG° = +8.55 kJ/mol at 298 K, $K = 0.032$ — the measured 3.2 kPa ([[vapor-pressure|vapour pressure]]).

### Temperature
Substituting $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$ gives

$$\\ln K = -\\frac{\\Delta H^\\circ}{R}\\cdot\\frac{1}{T} + \\frac{\\Delta S^\\circ}{R}$$

a straight line in $1/T$ — the [[vant-hoff|van 't Hoff equation]]. For an exothermic reaction the slope is positive and $K$ falls on heating: the Haber constant drops from $6\\times10^{5}$ at 25 °C to about $3\\times10^{-4}$ at 427 °C. That is [[le-chatelier|Le Chatelier's principle]] made quantitative.

> [!key] Inside a logarithm, concentrations must be pure numbers — in mol/L divided by 1 mol/L. The calculators below take them that way.
`,
  ideas: [
    'ΔG = ΔG° + RT ln Q: the actual driving force depends on the mixture.',
    'At equilibrium ΔG = 0 and Q = K, so ΔG° = −RT ln K.',
    'At 298 K each 5.7 kJ/mol of ΔG° changes K by a factor of 10.',
    'Negative ΔG° means K > 1 (products favoured); positive means K < 1 — but never exactly zero reaction.',
    'Combined with ΔG° = ΔH° − TΔS°, it gives the temperature dependence of K (van \'t Hoff).'
  ],
  pitfalls: [
    'ΔG° > 0 means no products form — It means K < 1: at equilibrium there is some product, perhaps very little. With ΔG° = +5 kJ/mol, K = 0.13 — plenty to measure.',
    'At equilibrium ΔG° = 0 — At equilibrium ΔG = 0. ΔG° is a fixed number for the reaction at that temperature; it is zero only if K = 1.',
    'Putting concentrations with units into ln Q — The logarithm needs pure numbers: divide by 1 mol/L or 1 bar (and never use mol/m³ by accident).'
  ],
  formulas: [
    {
      name: 'Standard free energy and K',
      expr: 'dG0 = -R*T*ln(K)', tex: '\\Delta G^\\circ = -RT\\ln K',
      vars: {
        dG0: { name: 'standard free energy change', q: 'molarenergy', unit: 'kJ/mol', value: -33.1, signed: true, tex: '\\Delta G^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 },
        K: { name: 'equilibrium constant (dimensionless)' }
      },
      solveFor: 'K',
      note: 'Defaults: the Haber synthesis at 25 °C, K ≈ 6 × 10⁵ (pressures in bar).',
      practice: { unknowns: ['K', 'dG0'] },
      stories: {
        K: 'A reaction has ΔG° = {dG0} at {T}. What is its equilibrium constant?',
        dG0: 'A reaction has an equilibrium constant of {K} at {T}. What is ΔG°?'
      }
    },
    {
      name: 'Free energy change in a real mixture',
      expr: 'dG = dG0 + R*T*ln(Q)', tex: '\\Delta G = \\Delta G^\\circ + RT\\ln Q',
      vars: {
        dG: { name: 'free energy change under these conditions', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dG0: { name: 'standard free energy change', q: 'molarenergy', unit: 'kJ/mol', value: -30.5, signed: true, tex: '\\Delta G^\\circ' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 310.15 },
        Q: { name: 'reaction quotient (dimensionless)', value: 3e-4 }
      },
      note: 'Defaults: ATP hydrolysis in a cell at 37 °C, ΔG°′ = −30.5 kJ/mol, with [ATP] = 3 mM, [ADP] = 0.3 mM and phosphate 3 mM, so $Q = 3\\times10^{-4}$: the real ΔG is about −51 kJ/mol.',
      practice: { unknowns: ['dG', 'Q'] },
      stories: {
        dG: 'ATP hydrolysis has ΔG°′ = {dG0}. In a muscle cell at {T} the reaction quotient is {Q}. What is the actual ΔG?',
        Q: 'A reaction with ΔG° = {dG0} at {T} has ΔG = {dG}. What is the reaction quotient?'
      }
    },
    {
      name: 'K from enthalpy and entropy',
      expr: 'K = exp(-(dH - T*dS)/(R*T))', tex: 'K = \\exp\\left(-\\frac{\\Delta H^\\circ - T\\Delta S^\\circ}{RT}\\right)',
      vars: {
        K: { name: 'equilibrium constant (dimensionless)' },
        dH: { name: 'standard enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: -92.2, signed: true, tex: '\\Delta H^\\circ' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 700 },
        dS: { name: 'standard entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: -198.1, signed: true, tex: '\\Delta S^\\circ' },
        R: { const: 'R' }
      },
      note: 'Treats ΔH° and ΔS° as independent of temperature. Defaults: the Haber synthesis at 700 K (427 °C).',
      practice: { unknowns: ['K', 'T'] },
      stories: {
        K: 'The ammonia synthesis has ΔH° = {dH} and ΔS° = {dS}. Estimate K at {T}.',
        T: 'A reaction has ΔH° = {dH} and ΔS° = {dS}. At what temperature is K = {K}?'
      }
    }
  ],
  derivation: {
    title: 'From the free energy of a mixture to K and van \'t Hoff',
    steps: [
      { text: 'The free energy of a mole of an ideal gas (or ideal solute) depends on its pressure (or concentration) through the entropy of dilution:', tex: 'G = G^\\circ + RT\\ln a, \\qquad a = \\frac{p}{p^\\circ}\\ \\text{or}\\ \\frac{[\\ce{A}]}{c^\\circ}' },
      { text: 'For $a\\,\\ce{A} + b\\,\\ce{B} -> c\\,\\ce{C} + d\\,\\ce{D}$ take products minus reactants; the logarithms collect into the reaction quotient:', tex: '\\Delta G = \\Delta G^\\circ + RT\\ln\\frac{a_C^{\\,c}\\,a_D^{\\,d}}{a_A^{\\,a}\\,a_B^{\\,b}} = \\Delta G^\\circ + RT\\ln Q' },
      { text: 'At equilibrium the reaction has no further tendency to go either way, $\\Delta G = 0$, and $Q = K$:', tex: '\\Delta G^\\circ = -RT\\ln K' },
      { text: 'A factor of ten in $K$ corresponds to', tex: 'RT\\ln 10 = 8.314 \\times 298.15 \\times 2.303 = 5.71\\ \\mathrm{kJ/mol}' },
      { text: 'Insert $\\Delta G^\\circ = \\Delta H^\\circ - T\\Delta S^\\circ$ and divide by $-RT$:', tex: '\\ln K = -\\frac{\\Delta H^\\circ}{RT} + \\frac{\\Delta S^\\circ}{R}' }
    ]
  },
  examples: [
    {
      title: 'Brown gas in a sealed tube',
      q: 'For $\\ce{N2O4(g) <=> 2NO2(g)}$, ΔH° = +57.2 kJ/mol and ΔS° = +175.9 J/(mol·K). Find ΔG° and K at 25 °C.',
      steps: [
        '$\\Delta G^\\circ = 57.2 - 298.15 \\times 0.1759 = 57.2 - 52.4 = +4.8$ kJ/mol.',
        '$K = \\exp(-4760/(8.314 \\times 298.15)) = \\exp(-1.92) = 0.15$ (pressures in bar).',
        'Positive ΔG° but K is far from negligible: a sealed tube of N₂O₄ at room temperature is visibly brown with NO₂.',
        'ΔH° > 0, so K grows on heating: the tube darkens in hot water and pales in ice.'
      ],
      a: 'ΔG° ≈ +4.8 kJ/mol, K ≈ 0.15.'
    },
    {
      title: 'Which way will it go?',
      q: 'At 298 K the ammonia synthesis has K = 6.3 × 10⁵. A mixture has $p(\\ce{NH3}) = 1.0$ bar, $p(\\ce{N2}) = 0.10$ bar and $p(\\ce{H2}) = 0.010$ bar. Which way does it move?',
      steps: [
        '$Q = \\dfrac{(1.0)^2}{(0.10)(0.010)^3} = 1.0 \\times 10^{7}$.',
        '$Q > K$, so $\\Delta G = RT\\ln(Q/K) = 8.314 \\times 298.15 \\times \\ln(15.9)/1000 = +6.9$ kJ/mol.',
        'Positive: this mixture has too much ammonia for equilibrium and decomposes a little, back towards nitrogen and hydrogen.'
      ],
      a: 'Q > K: the mixture moves backwards (ΔG ≈ +6.9 kJ/mol).'
    }
  ],
  quiz: [
    { q: 'At 298 K a reaction has ΔG° = −11.4 kJ/mol. Its K is about…', choices: ['0.01', '1', '100', '10¹¹'], a: 2,
      why: 'Every −5.71 kJ/mol is a factor of 10 at 298 K. −11.4 kJ/mol is two factors: K ≈ 100.' },
    { q: 'What is K at 298.15 K for a reaction with ΔG° = +10.0 kJ/mol?', answer: 0.0177,
      why: '$K = \\exp(-10\\,000/(8.314 \\times 298.15)) = \\exp(-4.034) = 0.0177$.' },
    { q: 'A reaction mixture has Q = K. Which is true?', choices: ['ΔG° = 0', 'ΔG = 0', 'both ΔG and ΔG° are zero', 'the reaction has stopped at the molecular level'], a: 1,
      why: 'Q = K means equilibrium, where ΔG = ΔG° + RT ln K = 0. ΔG° keeps its fixed value. Molecules still react in both directions at equal rates.' },
    { q: 'For an exothermic reaction, K decreases as the temperature rises.', a: true,
      why: 'ln K = −ΔH°/(RT) + ΔS°/R. With ΔH° < 0 the first term is positive and shrinks as T rises, so K falls. Le Chatelier says the same: heating favours the endothermic direction.' },
    { q: 'Why can concentrations in mol/L be used directly in Q and K?', choices: ['because the logarithm ignores units', 'because each is really divided by the standard concentration of 1 mol/L', 'because equilibrium constants always have units of M', 'they cannot; SI units of mol/m³ must be used'], a: 1,
      why: 'K and Q are built from activities, concentrations divided by 1 mol/L (or pressures by 1 bar). The numbers are the same as the concentrations in mol/L but carry no units — which is also why K must use the standard state it was defined with.' }
  ],
  sim: { id: 'tk-gibbs', params: { rx: 4 } },
  applications: ['Predicting equilibrium yields in industrial reactors from thermodynamic tables.', 'Biochemistry: which metabolic steps are near equilibrium and which are driven.', 'Vapour pressures and solubilities from free energies of formation.', 'Linking cell voltages to equilibrium constants in electrochemistry.']
}

);
