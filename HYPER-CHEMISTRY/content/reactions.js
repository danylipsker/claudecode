/* HYPER-CHEMISTRY · content/reactions.js — chemical equations and how to balance them,
 * the kinds of reaction, reacting masses, and theoretical and percentage yield.
 * (The limiting reagent, also in this topic, is the reference concept in reference.js.) */
Hyper.add(

{
  id: 'chemical-equations', parent: 'reactions', title: 'Chemical equations and balancing', level: 1,
  short: 'A chemical equation lists what reacts and what forms, with coefficients chosen so that every atom — and every charge — on the left appears again on the right.',
  keywords: ['chemical equation', 'balancing equations', 'coefficients', 'conservation of mass', 'state symbols', 'reactants', 'products', 'ionic equation', 'charge balance', 'linear algebra'],
  prereq: ['atomic-theory', 'mole-concept', 'math:systems-of-equations'],
  related: ['reaction-types', 'reaction-stoichiometry', 'balancing-redox', 'math:gaussian-elimination'],
  body: `
A chemical equation is a compact account of a reaction: the **reactants** on the left, the **products** on the right, and an arrow for "turn into". Methane burning in air is

$$\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$$

Atoms are neither made nor destroyed in a chemical reaction — they only change partners. So every atom on the left must reappear on the right: one carbon, four hydrogens and four oxygens on each side here. That is **conservation of mass** written atom by atom, and an equation that respects it is **balanced**.

### Reading an equation
- The **coefficients** (the 2s above) count particles: one molecule of methane with two of oxygen — or one mole with two moles. They are the recipe for [[reaction-stoichiometry]].
- The **subscripts** are part of each formula and are never changed: $\\ce{H2O}$ is water, $\\ce{H2O2}$ is hydrogen peroxide.
- **State symbols**: (s) solid, (l) liquid, (g) gas, (aq) dissolved in water.
- Arrows: $\\ce{->}$ for a reaction that goes to completion, $\\ce{<=>}$ for an [[dynamic-equilibrium|equilibrium]]; conditions go over the arrow: $\\ce{CaCO3 ->[\\Delta] CaO + CO2}$.

### Balancing by inspection
1. Write the correct formulas first; after that only coefficients may change.
2. Balance the element that appears in the fewest, most complicated formulas first.
3. Leave elements that appear on their own ($\\ce{O2}$, $\\ce{H2}$, a metal) until last — you can set their coefficient freely.
4. A fractional coefficient is fine while you work; multiply through at the end to clear it.
5. Check every element, and reduce to the smallest whole numbers.

For octane: 8 C gives $\\ce{8CO2}$, 18 H gives $\\ce{9H2O}$; the right now has $16 + 9 = 25$ O, so $\\tfrac{25}{2}\\ce{O2}$. Doubling everything gives $\\ce{2C8H18 + 25O2 -> 16CO2 + 18H2O}$.

### Charge balances too
For ions, the total charge must also match. $\\ce{Al + Cu^2+ -> Al^3+ + Cu}$ has its atoms balanced but a charge of +2 on the left and +3 on the right. Balanced, it is $\\ce{2Al + 3Cu^2+ -> 2Al^3+ + 3Cu}$: +6 on each side, because three copper ions take the six electrons that two aluminium atoms give up. Redox equations are balanced systematically with [[balancing-redox|half-equations]].

### Balancing is linear algebra
Each element gives one equation in the unknown coefficients, so balancing is solving a [[math:systems-of-equations|system of linear equations]] with whole-number answers — exactly what [[math:gaussian-elimination|Gaussian elimination]] does. The [equation balancer](#/tools/chemcalc) solves it exactly for any equation, ions and electrons included. When the system leaves more than one coefficient free, the "equation" is really two independent reactions added together, and chemistry, not arithmetic, must say in what ratio they happen.

> [!warn] A balanced equation says what *can* happen, not what *does*. $\\ce{2H2 + O2 -> 2H2O}$ is balanced, but a mixture of the two gases can sit for years until a spark sets it off.
`,
  ideas: [
    'Atoms are conserved in a reaction, so every element must be balanced; for ions the total charge must balance too.',
    'Only coefficients may change when balancing; subscripts define the substance.',
    'Coefficients count particles (or moles), not masses.',
    'Balance the most complicated formula first and lone elements last; clear fractions at the end.',
    'Balancing is solving a system of linear equations in the coefficients.'
  ],
  pitfalls: [
    'Changing a subscript to balance an equation — That changes the substance: turning $\\ce{H2O}$ into $\\ce{H2O2}$ "balances" the oxygen but makes hydrogen peroxide, not water.',
    'Both sides must have the same number of molecules — Only atoms (and charge) are conserved. $\\ce{2H2 + O2 -> 2H2O}$ turns three molecules into two.',
    'Balancing atoms but not charge in an ionic equation — $\\ce{Fe^3+ + Cu -> Fe^2+ + Cu^2+}$ has the same atoms on both sides but +3 against +4 charge; it needs $\\ce{2Fe^3+}$ and $\\ce{2Fe^2+}$.'
  ],
  derivation: {
    title: 'Balancing propane combustion as a linear system',
    intro: 'Call the unknown coefficients $a$, $b$, $c$ and $d$:',
    steps: [
      { text: 'The skeleton equation, with unknown coefficients:', tex: 'a\\,\\ce{C3H8} + b\\,\\ce{O2} \\to c\\,\\ce{CO2} + d\\,\\ce{H2O}' },
      { text: 'Each element must be conserved, which gives one equation per element:', tex: '\\begin{aligned} \\text{C:}&\\quad 3a = c \\\\ \\text{H:}&\\quad 8a = 2d \\\\ \\text{O:}&\\quad 2b = 2c + d \\end{aligned}' },
      { text: 'Three equations in four unknowns leave one free: an equation can always be scaled. Set $a = 1$:', tex: 'c = 3, \\qquad d = 4, \\qquad b = \\frac{2(3) + 4}{2} = 5' },
      { text: 'All whole numbers already, so this is the balanced equation:', tex: '\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}' }
    ],
    outro: 'If a coefficient came out as a fraction, you would multiply them all by the denominator. The equation balancer does this with exact fractions for any equation.'
  },
  formulas: [
    {
      name: 'Oxygen needed to burn a fuel completely',
      expr: 'nO2 = x + y/4 - z/2', tex: 'n_{\\ce{O2}} = x + \\frac{y}{4} - \\frac{z}{2}',
      vars: {
        nO2: { name: 'moles of O₂ per mole of fuel', tex: 'n_{\\ce{O2}}' },
        x: { name: 'carbon atoms in the fuel molecule', int: true, value: 2 },
        y: { name: 'hydrogen atoms in the fuel molecule', int: true, value: 6 },
        z: { name: 'oxygen atoms in the fuel molecule', int: true, value: 1 }
      },
      note: 'For a fuel $\\mathrm{C}_x\\mathrm{H}_y\\mathrm{O}_z$ burning to $\\ce{CO2}$ and $\\ce{H2O}$: each carbon needs one $\\ce{O2}$, every four hydrogens one more, and the oxygen already in the fuel reduces the demand. Defaults: ethanol, $\\ce{C2H6O}$, which needs 3 mol of $\\ce{O2}$.',
      practice: { unknowns: ['nO2'] },
      stories: {
        nO2: 'A fuel molecule contains {x} carbon atoms, {y} hydrogen atoms and {z} oxygen atoms. How many moles of oxygen does one mole of it need to burn completely to carbon dioxide and water?'
      }
    }
  ],
  examples: [
    {
      title: 'Burning propane',
      q: 'Balance the combustion of propane, $\\ce{C3H8}$, the fuel in camping gas and patio heaters.',
      steps: [
        'Skeleton: $\\ce{C3H8 + O2 -> CO2 + H2O}$.',
        'Carbon: 3 on the left, so $\\ce{3CO2}$. Hydrogen: 8 on the left, so $\\ce{4H2O}$.',
        'Oxygen on the right is now $3 \\times 2 + 4 = 10$ atoms, which needs $\\ce{5O2}$ — oxygen was left for last because it appears alone.',
        'Check: C 3 = 3, H 8 = 8, O 10 = 10.'
      ],
      a: '$\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}$'
    },
    {
      title: 'The blast furnace',
      q: 'In a blast furnace carbon monoxide reduces iron(III) oxide to iron. Balance $\\ce{Fe2O3 + CO -> Fe + CO2}$.',
      steps: [
        'Iron: two on the left, so $\\ce{2Fe}$ on the right.',
        'Each $\\ce{CO}$ takes one oxygen atom to become $\\ce{CO2}$. $\\ce{Fe2O3}$ has three oxygen atoms to give away, so it needs $\\ce{3CO}$, making $\\ce{3CO2}$.',
        'Check: Fe 2 = 2, C 3 = 3, O $3 + 3 = 6$ against $3 \\times 2 = 6$.'
      ],
      a: '$\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$'
    },
    {
      title: 'An ionic equation',
      q: 'A strip of aluminium in copper(II) sulfate solution becomes coated with copper. Write the balanced ionic equation.',
      steps: [
        'The sulfate ions are spectators: $\\ce{Al + Cu^2+ -> Al^3+ + Cu}$.',
        'Atoms balance but charge does not (+2 against +3). Each Al loses 3 electrons, each $\\ce{Cu^2+}$ gains 2; the least common multiple is 6.',
        'So two aluminium atoms and three copper ions: $\\ce{2Al + 3Cu^2+ -> 2Al^3+ + 3Cu}$, with +6 on each side.'
      ],
      a: '2Al + 3Cu²⁺ → 2Al³⁺ + 3Cu'
    }
  ],
  quiz: [
    { q: 'When you balance an equation, what may you change?', choices: ['the subscripts in the formulas', 'the coefficients in front of the formulas', 'both', 'the state symbols'], a: 1,
      why: 'Coefficients say how many particles take part. Subscripts are part of the identity of each substance: changing them changes the chemistry.' },
    { q: 'How many oxygen atoms are represented by $\\ce{3Ca(NO3)2}$?', answer: 18,
      why: 'Each formula unit has $2 \\times 3 = 6$ oxygen atoms (the 2 multiplies the whole bracket), and there are three formula units: 18.' },
    { q: 'Balance $\\ce{C4H10 + O2 -> CO2 + H2O}$ with the smallest whole numbers. What is the coefficient of $\\ce{O2}$?', answer: 13,
      why: '4 C → $\\ce{4CO2}$; 10 H → $\\ce{5H2O}$; oxygen on the right $8 + 5 = 13$ atoms, so $\\tfrac{13}{2}\\ce{O2}$. Doubling: $\\ce{2C4H10 + 13O2 -> 8CO2 + 10H2O}$.' },
    { q: 'A balanced equation must have the same number of molecules on each side.', a: false,
      why: 'Only atoms and charge are conserved. In $\\ce{N2 + 3H2 -> 2NH3}$ four molecules become two.' },
    { q: 'Is $\\ce{Fe^3+ + Cu -> Fe^2+ + Cu^2+}$ balanced?', choices: ['yes, atoms and charge both balance', 'no: the atoms do not balance', 'no: the charge does not balance', 'no: iron cannot be reduced by copper'], a: 2,
      why: 'One Fe and one Cu on each side, but the charge is +3 on the left and +4 on the right. Each Cu gives two electrons and each $\\ce{Fe^3+}$ takes one, so it is $\\ce{2Fe^3+ + Cu -> 2Fe^2+ + Cu^2+}$ — the reaction used to etch copper circuit boards with iron(III) chloride.' }
  ],
  applications: [
    'Every calculation of reacting amounts starts from a balanced equation.',
    'Combustion engineering: the oxygen and air a burner or engine needs.',
    'Etching printed circuit boards, electroplating and batteries, where ionic equations must balance charge.',
    'Environmental accounting: the $\\ce{CO2}$ released per kilogram of fuel or cement.'
  ],
  history: 'Antoine Lavoisier showed in the 1770s and 1780s, by weighing everything in sealed vessels, that mass is conserved in reactions, and wrote reactions as balance sheets. The coefficient-and-formula notation used today came with Berzelius\'s letter symbols for the elements in the 1810s.',
  sim: 'stoich-balance'
},

{
  id: 'reaction-types', parent: 'reactions', title: 'Types of chemical reaction', level: 1,
  short: 'Most reactions fall into a few families — combination, decomposition, displacement, exchange of partners, combustion — and, cutting across them, reactions that move electrons (redox) or protons (acid–base).',
  keywords: ['reaction types', 'synthesis', 'combination', 'decomposition', 'single displacement', 'double displacement', 'precipitation', 'neutralisation', 'combustion', 'net ionic equation', 'spectator ions', 'metathesis'],
  prereq: ['chemical-equations', 'ionic-bonding'],
  related: ['redox-reactions', 'acid-base-definitions', 'precipitation', 'solubility-product', 'enthalpy'],
  body: `
There are millions of reactions, but most of them follow a handful of patterns. Recognising the pattern lets you predict the products before you balance anything.

| type | pattern | example |
|---|---|---|
| combination (synthesis) | $\\ce{A + B -> AB}$ | $\\ce{2Mg + O2 -> 2MgO}$ |
| decomposition | $\\ce{AB -> A + B}$ | $\\ce{CaCO3 ->[\\Delta] CaO + CO2}$ |
| single displacement | $\\ce{A + BC -> AC + B}$ | $\\ce{Zn + CuSO4 -> ZnSO4 + Cu}$ |
| double displacement | $\\ce{AB + CD -> AD + CB}$ | $\\ce{AgNO3 + NaCl -> AgCl + NaNO3}$ |
| combustion | fuel + $\\ce{O2}$ → oxides | $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$ |

### Combination and decomposition
Elements or simple compounds joining into one product is **combination**: magnesium burning with a white glare, or nitrogen and hydrogen making ammonia. The reverse, one compound breaking up, is **decomposition**, usually driven by heat, light or electricity: limestone roasted to quicklime in a kiln, hydrogen peroxide giving off oxygen over a catalyst, water split by [[electrolysis]].

### Single displacement
A more reactive element pushes a less reactive one out of its compound. Zinc dropped into blue copper(II) sulfate solution turns the solution colourless and coats itself with copper; chlorine water turns potassium bromide solution orange by freeing bromine. Whether it happens is read from a reactivity series (for metals, from their [[electrode-potentials]]). The thermite reaction, $\\ce{2Al + Fe2O3 -> Al2O3 + 2Fe}$, is displacement so exothermic that the iron comes out molten — hot enough to weld railway rails.

### Double displacement: swapping partners
Two ionic compounds in solution exchange partners. It happens when the swap removes ions from solution:
- a **precipitate** forms — silver nitrate and sodium chloride give white silver chloride; lead(II) nitrate and potassium iodide a bright yellow cloud of lead(II) iodide ([[precipitation]]);
- water forms — **neutralisation**, $\\ce{HCl + NaOH -> NaCl + H2O}$;
- a gas escapes — an acid on a carbonate: $\\ce{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}$, the fizz of chalk in vinegar or of a descaler in a kettle.

### Net ionic equations
In solution most of the ions do nothing. Silver nitrate plus sodium chloride is really

$$\\ce{Ag+(aq) + Cl-(aq) -> AgCl(s)}$$

with $\\ce{Na+}$ and $\\ce{NO3-}$ as **spectator ions**, present before and after. Every strong acid with every strong base gives the same net reaction, $\\ce{H+ + OH- -> H2O}$ — which is why their heats of neutralisation are all about −57 kJ per mole of water.

### Two families that cut across the rest
The classification above is by the *shape* of the equation. A deeper one asks what moves:
- **Redox** reactions transfer electrons: combination with oxygen, displacement and combustion are all redox ([[redox-reactions]]).
- **Acid–base** reactions transfer protons: neutralisation, and the gas-forming reactions of carbonates ([[acid-base-definitions]]).
- Precipitation moves neither: ions simply leave the solution together.

> [!tip] Solubility rules of thumb: salts of sodium, potassium and ammonium, and all nitrates, dissolve. Most chlorides dissolve except those of silver and lead. Most sulfates dissolve except those of barium and lead (calcium sulfate only sparingly). Most carbonates, phosphates and hydroxides do not, except those of group 1 and ammonium.
`,
  ideas: [
    'Combination joins substances into one product; decomposition breaks one apart, usually with heat, light or electricity.',
    'In single displacement a more reactive element replaces a less reactive one in its compound.',
    'Double displacement in solution goes when it removes ions: a precipitate, water or a gas.',
    'Net ionic equations leave out the spectator ions and show what really changes.',
    'Redox (electron transfer) and acid–base (proton transfer) cut across the pattern-based types.'
  ],
  pitfalls: [
    'Every mixture of two salt solutions reacts — Only if a precipitate, water or a gas forms. Sodium nitrate and potassium chloride solutions just give a solution of all four ions.',
    'Spectator ions take part in the reaction — They are present in the same state before and after; leaving them out of the net ionic equation changes nothing.',
    'The types are exclusive — The same reaction can be combination and redox ($\\ce{2Mg + O2 -> 2MgO}$), or double displacement and acid–base (neutralisation).'
  ],
  examples: [
    {
      title: 'Predicting and writing a precipitation',
      q: 'Solutions of barium chloride and sodium sulfate are mixed. What happens? Write the full and net ionic equations.',
      steps: [
        'Swapping partners gives barium sulfate and sodium chloride. Sodium chloride is soluble; barium sulfate is not, so it precipitates as a white solid.',
        'Full equation: $\\ce{BaCl2(aq) + Na2SO4(aq) -> BaSO4(s) + 2NaCl(aq)}$.',
        'Sodium and chloride ions are spectators. Net ionic equation: $\\ce{Ba^2+(aq) + SO4^2-(aq) -> BaSO4(s)}$.',
        'This is the reaction behind the gravimetric analysis of sulfate, and behind the barium meal used for X-ray imaging: barium sulfate is so insoluble that the toxic barium ion stays locked up.'
      ],
      a: 'A white precipitate of barium sulfate: $\\ce{Ba^2+ + SO4^2- -> BaSO4(s)}$.'
    },
    {
      title: 'Classifying reactions',
      q: 'Classify: (a) $\\ce{Zn + 2HCl -> ZnCl2 + H2}$; (b) $\\ce{2KClO3 -> 2KCl + 3O2}$; (c) $\\ce{H2SO4 + 2KOH -> K2SO4 + 2H2O}$; (d) $\\ce{C3H8 + 5O2 -> 3CO2 + 4H2O}$.',
      steps: [
        '(a) Zinc displaces hydrogen from the acid: single displacement, and redox (zinc loses electrons, hydrogen ions gain them).',
        '(b) One compound gives two products: decomposition — the classic laboratory preparation of oxygen. The chlorate "oxygen candles" of aircraft masks and submarines work the same way.',
        '(c) Two compounds exchange partners and water forms: double displacement, and acid–base neutralisation. Not redox.',
        '(d) A fuel burns in oxygen: combustion, which is always redox.'
      ],
      a: '(a) single displacement, redox; (b) decomposition; (c) neutralisation; (d) combustion.'
    }
  ],
  quiz: [
    { q: 'Which pair of solutions gives a precipitate when mixed?', choices: ['$\\ce{NaNO3}$ and $\\ce{KCl}$', '$\\ce{AgNO3}$ and $\\ce{NaCl}$', '$\\ce{HCl}$ and $\\ce{NaCl}$', '$\\ce{KNO3}$ and $\\ce{Na2SO4}$'], a: 1,
      why: 'Silver chloride is insoluble, so $\\ce{Ag+}$ and $\\ce{Cl-}$ leave the solution together. In the other pairs every possible combination is soluble.' },
    { q: 'Every double displacement reaction is a redox reaction.', a: false,
      why: 'In precipitation and neutralisation the ions keep their charges; no electrons change hands. Redox needs a change in oxidation numbers.' },
    { q: 'What is the net ionic equation for the neutralisation of nitric acid by potassium hydroxide?', choices: ['$\\ce{HNO3 + KOH -> KNO3 + H2O}$', '$\\ce{H+ + OH- -> H2O}$', '$\\ce{K+ + NO3- -> KNO3}$', '$\\ce{H+ + KOH -> K+ + H2O}$'], a: 1,
      why: 'Both reactants are fully ionised in water; $\\ce{K+}$ and $\\ce{NO3-}$ are spectators. What changes is a hydrogen ion meeting a hydroxide ion.' },
    { q: 'An iron nail is placed in copper(II) sulfate solution. The nail turns pink-brown and the blue colour fades. What type of reaction is this?', choices: ['decomposition', 'single displacement', 'double displacement', 'combustion'], a: 1,
      why: 'Iron is more reactive than copper and displaces it: $\\ce{Fe + Cu^2+ -> Fe^2+ + Cu}$. The copper plates out on the nail and the blue copper ions are used up.' },
    { q: 'Why does a descaler (an acid) fizz on the limescale in a kettle?', choices: ['the acid boils', 'carbon dioxide forms from the carbonate', 'hydrogen forms from the metal of the kettle', 'oxygen is released from the water'], a: 1,
      why: 'Limescale is calcium carbonate: $\\ce{CaCO3 + 2H+ -> Ca^2+ + H2O + CO2}$. The gas escaping drives the reaction on.' }
  ],
  applications: [
    'Water treatment, where precipitation removes phosphate, heavy metals and hardness.',
    'Extractive metallurgy: displacement of copper by scrap iron, thermite welding of rails.',
    'Antacids and descalers, which rely on acid–carbonate reactions.',
    'Qualitative analysis: identifying ions by the precipitates and gases they give.'
  ]
},

{
  id: 'reaction-stoichiometry', parent: 'reactions', title: 'Reacting masses', level: 1,
  short: 'How much product a given amount of reactant can make, or how much reactant a given product needs: convert to moles, use the ratio of the coefficients, convert back.',
  keywords: ['stoichiometry', 'reacting masses', 'mole ratio', 'mass-to-mass', 'gas volumes', 'molar volume', 'air–fuel ratio', 'CO2 per litre', 'theoretical amount'],
  prereq: ['chemical-equations', 'molar-mass', 'mole-concept'],
  related: ['limiting-reagent', 'percent-yield', 'ideal-gas-law', 'titration-calculations', 'math:fractions-ratios'],
  body: `
A balanced equation is a recipe written in **particles**. It says that one $\\ce{CaCO3}$ gives one $\\ce{CaO}$ and one $\\ce{CO2}$, or that two $\\ce{H2}$ need one $\\ce{O2}$. A balance, however, measures **grams**. Stoichiometry is the three-step bridge between the two:

1. **Mass → moles** of the substance you know: $n_A = m_A / M_A$.
2. **Moles → moles** of the substance you want, using the coefficients: $n_B = n_A \\cdot b/a$.
3. **Moles → mass** (or gas volume, or solution volume): $m_B = n_B M_B$.

$$m_B = \\frac{m_A}{M_A} \\cdot \\frac{b}{a} \\cdot M_B$$

The middle step is the only place the equation enters, and it is always a ratio of **moles**, never of grams.

### Gases by volume
For gases the last step can give a volume. At the same temperature and pressure a mole of any ideal gas occupies the same volume: 24.47 L at 25 °C and 1 atm, 22.71 L at 0 °C and 1 bar ([[ideal-gas-law]]). So for gases the coefficients are also **ratios of volumes**: one litre of nitrogen and three of hydrogen give two litres of ammonia.

### Real numbers
- **Cement.** Limestone is roasted to lime: $\\ce{CaCO3 -> CaO + CO2}$. A tonne of limestone (100.09 g/mol) gives 0.560 t of lime and releases 0.440 t of $\\ce{CO2}$ — before any fuel is burnt. This is why cement making is responsible for several percent of the world's carbon dioxide.
- **Petrol.** Treated as octane, a litre of petrol (about 0.74 kg) burns to about 2.3 kg of $\\ce{CO2}$ — heavier than the fuel, because two of every three atoms in $\\ce{CO2}$ are oxygen taken from the air.
- **Iron.** $\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$: each tonne of iron needs 1.43 t of pure hematite and 0.75 t of carbon monoxide.
- **Engines.** Burning octane completely needs 12.5 mol of $\\ce{O2}$ per mole of fuel — about 15 kg of air per kilogram of fuel, the stoichiometric air–fuel ratio.

### When reactants are not in the recipe ratio
If you know the amounts of two reactants, first find which runs out: the [[limiting-reagent]] alone decides how much product forms. The amount calculated this way is the most you can get, the theoretical yield; what you actually collect is compared with it as the [[percent-yield]].

> [!tip] Lay the calculation out as a chain with units — g → mol → mol → g — and let the units cancel. An answer in "g²/mol" or a mass of product larger than every reactant put together is a sign something is upside down.
`,
  ideas: [
    'Equations are recipes in moles: convert masses to moles before using the coefficients.',
    'The chain is mass → moles → moles (× b/a) → mass (or volume).',
    'For gases at the same temperature and pressure, the coefficients are also volume ratios.',
    'The product can weigh more than the reactant you started from: the other reactants add their mass.',
    'When two reactants are given, find the limiting one first.'
  ],
  pitfalls: [
    'Using the coefficients as a mass ratio — $\\ce{2H2 + O2 -> 2H2O}$ does not mean 2 g of hydrogen and 1 g of oxygen: it is 4.03 g of hydrogen to 32.00 g of oxygen.',
    'Forgetting the coefficients altogether — In $\\ce{N2 + 3H2 -> 2NH3}$, a mole of nitrogen gives two moles of ammonia, not one.',
    'Using the molar volume of a gas for a liquid or solid — 24.5 L/mol is for gases only; a mole of liquid water is 18 mL.'
  ],
  formulas: [
    {
      name: 'Mass of one substance from the mass of another',
      expr: 'mB = mA/MA*b/a*MB', tex: 'm_B = \\frac{m_A}{M_A}\\,\\frac{b}{a}\\,M_B',
      vars: {
        mB: { name: 'mass of substance B', q: 'mass', unit: 'kg', tex: 'm_B' },
        mA: { name: 'mass of substance A', q: 'mass', unit: 'kg', value: 1000, tex: 'm_A' },
        MA: { name: 'molar mass of A', q: 'molarmass', unit: 'g/mol', value: 100.086, fixed: true, tex: 'M_A' },
        a: { name: 'coefficient of A', int: true, fixed: true, value: 1 },
        b: { name: 'coefficient of B', int: true, fixed: true, value: 1 },
        MB: { name: 'molar mass of B', q: 'molarmass', unit: 'g/mol', value: 44.009, fixed: true, tex: 'M_B' }
      },
      note: 'Defaults: the carbon dioxide released by roasting limestone, $\\ce{CaCO3 -> CaO + CO2}$. Change the molar masses and coefficients for any other reaction.',
      practice: { unknowns: ['mB', 'mA'] },
      stories: {
        mB: 'A lime kiln roasts {mA} of limestone, $\\ce{CaCO3}$ ($M$ = {MA}): $\\ce{CaCO3 -> CaO + CO2}$. What mass of carbon dioxide ($M$ = {MB}) does it release?',
        mA: 'How much limestone, $\\ce{CaCO3}$ ($M$ = {MA}), must be roasted to release {mB} of carbon dioxide ($M$ = {MB})?'
      }
    },
    {
      name: 'Volume of gas from a mass of reactant',
      expr: 'V = mA/MA*b/a*Vm', tex: 'V = \\frac{m_A}{M_A}\\,\\frac{b}{a}\\,V_m',
      vars: {
        V: { name: 'volume of gas produced', q: 'volume', unit: 'L' },
        mA: { name: 'mass of reactant A', q: 'mass', unit: 'g', value: 65.0, tex: 'm_A' },
        MA: { name: 'molar mass of A', q: 'molarmass', unit: 'g/mol', value: 65.01, fixed: true, tex: 'M_A' },
        a: { name: 'coefficient of A', int: true, fixed: true, value: 2 },
        b: { name: 'coefficient of the gas', int: true, fixed: true, value: 3 },
        Vm: { name: 'molar volume of a gas', q: 'molarvolume', unit: 'L/mol', value: 24.47, tex: 'V_m' }
      },
      note: 'Defaults: nitrogen from sodium azide, $\\ce{2NaN3 -> 2Na + 3N2}$, the reaction of early airbags. $V_m$ is 24.47 L/mol at 25 °C and 1 atm, 22.71 L/mol at 0 °C and 1 bar.',
      practice: { unknowns: ['V', 'mA'] },
      stories: {
        V: 'An airbag inflator holds {mA} of sodium azide ($M$ = {MA}), which decomposes as $\\ce{2NaN3 -> 2Na + 3N2}$. What volume of nitrogen forms, taking {Vm}?',
        mA: 'An airbag needs {V} of nitrogen (molar volume {Vm}). What mass of sodium azide ($M$ = {MA}) must decompose, given $\\ce{2NaN3 -> 2Na + 3N2}$?'
      }
    },
    {
      name: 'Stoichiometric air–fuel ratio',
      expr: 'AFR = nO2*MO2/(wO2*Mf)', tex: '\\text{AFR} = \\frac{n_{\\ce{O2}}\\,M_{\\ce{O2}}}{w_{\\ce{O2}}\\,M_f}',
      vars: {
        AFR: { name: 'mass of air per mass of fuel', tex: '\\text{AFR}' },
        nO2: { name: 'moles of O₂ per mole of fuel', value: 12.5, tex: 'n_{\\ce{O2}}' },
        MO2: { name: 'molar mass of oxygen', q: 'molarmass', unit: 'g/mol', value: 31.998, fixed: true, tex: 'M_{\\ce{O2}}' },
        wO2: { name: 'mass fraction of oxygen in air', q: 'ratio', unit: '%', value: 23.2, fixed: true, tex: 'w_{\\ce{O2}}' },
        Mf: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 114.23, tex: 'M_f' }
      },
      note: 'Defaults: octane, 12.5 mol $\\ce{O2}$ per mole ($\\ce{2C8H18 + 25O2 -> 16CO2 + 18H2O}$), giving about 15.1. Methane, 2 mol per 16.04 g/mol, needs 17.2 kg of air per kilogram.',
      practice: { unknowns: ['AFR', 'Mf'] },
      stories: {
        AFR: 'A fuel of molar mass {Mf} needs {nO2} moles of oxygen per mole to burn completely. What mass of air, {wO2} oxygen by mass, is needed per kilogram of fuel?',
        Mf: 'A fuel needs {nO2} moles of oxygen per mole and burns at a stoichiometric air–fuel ratio of {AFR} (air {wO2} oxygen by mass). What is its molar mass?'
      }
    }
  ],
  examples: [
    {
      title: 'Carbon dioxide from a litre of petrol',
      q: 'Taking petrol as octane, $\\ce{C8H18}$ (114.23 g/mol), with a density of 0.74 kg/L, what mass of carbon dioxide does one litre produce? $\\ce{2C8H18 + 25O2 -> 16CO2 + 18H2O}$.',
      steps: [
        'Mass of fuel: $0.74\\ \\mathrm{kg} = 740\\ \\mathrm{g}$; amount $n = 740/114.23 = 6.48\\ \\mathrm{mol}$.',
        'Mole ratio: 16 $\\ce{CO2}$ per 2 octane, i.e. 8 per mole. $n(\\ce{CO2}) = 8 \\times 6.48 = 51.8\\ \\mathrm{mol}$.',
        'Mass: $51.8 \\times 44.01 = 2280\\ \\mathrm{g}$.',
        'The fuel\'s 740 g of carbon and hydrogen took $12.5 \\times 6.48 = 81$ mol, about 2.6 kg, of oxygen from the air; together they left as 2.28 kg of carbon dioxide and 1.05 kg of water.'
      ],
      a: 'About 2.3 kg of $\\ce{CO2}$ per litre.'
    },
    {
      title: 'Iron from hematite',
      q: 'How much pure hematite and how much carbon monoxide are needed for one tonne of iron? $\\ce{Fe2O3 + 3CO -> 2Fe + 3CO2}$.',
      steps: [
        'Iron: $n = 1.000 \\times 10^6\\ \\mathrm{g} / 55.845 = 1.791 \\times 10^4\\ \\mathrm{mol}$.',
        'Hematite: half as many moles, $8.953 \\times 10^3$ mol, times 159.69 g/mol $= 1.43 \\times 10^6$ g $= 1.43$ t.',
        'Carbon monoxide: $3/2$ as many moles as iron, $2.686 \\times 10^4$ mol, times 28.01 g/mol $= 752$ kg.'
      ],
      a: '1.43 t of $\\ce{Fe2O3}$ and 0.75 t of $\\ce{CO}$ per tonne of iron.'
    },
    {
      title: 'Hydrogen from magnesium',
      q: '2.43 g of magnesium ribbon dissolves in excess hydrochloric acid: $\\ce{Mg + 2HCl -> MgCl2 + H2}$. What volume of hydrogen forms at 25 °C and 1 atm?',
      steps: [
        '$n(\\ce{Mg}) = 2.43/24.305 = 0.1000\\ \\mathrm{mol}$.',
        'One $\\ce{H2}$ per Mg: $n(\\ce{H2}) = 0.1000$ mol.',
        '$V = n V_m = 0.1000 \\times 24.47 = 2.45\\ \\mathrm{L}$.'
      ],
      a: '2.45 L of hydrogen.'
    }
  ],
  quiz: [
    { q: 'In $\\ce{2H2 + O2 -> 2H2O}$, 3.0 mol of oxygen reacts completely with hydrogen. How many moles of water form?', answer: 6, unit: 'mol',
      why: 'Two moles of water per mole of oxygen: $2 \\times 3.0 = 6.0$ mol.' },
    { q: 'What mass of carbon dioxide forms when 16.0 g of methane burns completely? ($\\ce{CH4 + 2O2 -> CO2 + 2H2O}$)', answer: 43.9, unit: 'g',
      why: '$16.0/16.04 = 0.997$ mol of methane gives the same amount of $\\ce{CO2}$: $0.997 \\times 44.01 = 43.9$ g.' },
    { q: 'Burning 1 kg of pure carbon produces about 3.7 kg of carbon dioxide. Where does the extra mass come from?', choices: ['it is a measuring error', 'from oxygen taken from the air', 'from the energy released', 'from the nitrogen in the air'], a: 1,
      why: 'Each $\\ce{CO2}$ carries two oxygen atoms (32 g/mol) for every carbon (12 g/mol): $44.01/12.01 = 3.66$ kg of $\\ce{CO2}$ per kg of carbon. Mass is conserved once the oxygen is counted.' },
    { q: 'The coefficients of a balanced equation give the ratio of the masses that react.', a: false,
      why: 'They give the ratio of particles, or moles. Masses also depend on the molar masses: in $\\ce{C + O2 -> CO2}$, 12 g of carbon uses 32 g of oxygen.' },
    { q: 'For $\\ce{N2(g) + 3H2(g) -> 2NH3(g)}$ at constant temperature and pressure, 30 L of hydrogen react completely. What volume of ammonia forms?', choices: ['10 L', '20 L', '30 L', '60 L'], a: 1,
      why: 'For gases under the same conditions, volumes are in the ratio of the coefficients: 3 volumes of hydrogen give 2 of ammonia, so 20 L.' }
  ],
  applications: [
    'Chemical plant design: feed rates of raw materials for a given output.',
    'Carbon accounting: $\\ce{CO2}$ per litre of fuel, per tonne of cement or steel.',
    'Engine and burner control, which holds the air–fuel ratio near stoichiometric.',
    'Sizing gas generators: airbags, emergency oxygen candles, rocket propellants.'
  ],
  history: 'The word stoichiometry was coined by Jeremias Benjamin Richter in the 1790s, from the Greek for "element" and "measure". He found that acids and bases neutralise one another in fixed proportions by mass — the first tables of what would later be called equivalent masses.',
  sim: { id: 'stoich-molemap', params: { rx: 1 } }
},

{
  id: 'percent-yield', parent: 'reactions', title: 'Theoretical and percentage yield', level: 1,
  short: 'The theoretical yield is the most product the limiting reagent allows; what you actually collect is always less, and the ratio is the percentage yield. Atom economy asks how much of the reactants could ever end up in the product.',
  keywords: ['theoretical yield', 'actual yield', 'percentage yield', 'percent yield', 'atom economy', 'green chemistry', 'multi-step synthesis', 'overall yield', 'E-factor'],
  prereq: ['reaction-stoichiometry', 'limiting-reagent', 'math:percentages'],
  related: ['dynamic-equilibrium', 'le-chatelier', 'gravimetric-analysis', 'chromatography'],
  body: `
Stoichiometry tells you how much product the [[limiting-reagent]] **could** make: the **theoretical yield**. What you weigh at the end of the day, the **actual yield**, is less, and the comparison is

$$\\text{percentage yield} = \\frac{\\text{actual yield}}{\\text{theoretical yield}} \\times 100\\,\\%$$

Both yields must be for the same substance, in the same units — grams or moles.

### Where the product goes
- **Incomplete reaction.** Many reactions reach [[dynamic-equilibrium|equilibrium]] before the limiting reagent is used up, or are simply stopped too early.
- **Side reactions** turn some reactant into other products.
- **Handling losses**: product left on filter paper, in the flask, dissolved in the washing liquid, lost in recrystallisation — often the largest loss in a teaching laboratory.
- **Impure reagents**: a bottle of 95 % material holds 5 % less reactant than its label mass suggests.

A yield **above 100 %** does not mean you created matter: the product is still wet with solvent or contains impurities. Dry it to constant mass, check its melting point or a [[chromatography|chromatogram]], and the excess disappears.

### Many steps multiply
A medicine may take ten or more steps to make. The overall yield is the **product** of the step yields: ten steps at 80 % each give $0.8^{10} = 10.7\\,\\%$; at 90 % each, 34.9 %. That is why process chemists fight for every percent, and why a short route with fewer steps can beat a longer one with better individual yields.

### Atom economy
Percentage yield measures how well you carried out a reaction. **Atom economy** measures how good the reaction is in the first place: the fraction of the reactants' mass that ends up in the wanted product, if everything goes perfectly,

$$\\text{atom economy} = \\frac{M(\\text{desired product}) \\times \\text{its coefficient}}{\\sum M(\\text{reactants}) \\times \\text{coefficients}} \\times 100\\,\\%$$

- Addition reactions such as $\\ce{C2H4 + H2O -> C2H5OH}$ or $\\ce{N2 + 3H2 -> 2NH3}$ reach 100 %.
- Making ethanol by fermentation, $\\ce{C6H12O6 -> 2C2H5OH + 2CO2}$, has an atom economy of 51 %: almost half of the sugar leaves as carbon dioxide however well the brewer works.
- Aspirin from salicylic acid and ethanoic anhydride is 75 %: the other quarter is ethanoic acid.

A reaction can have a perfect atom economy and a poor yield — the Haber process converts only about 15 % of its gas per pass through the reactor, and gets a high overall yield only by recycling the rest — or a high yield and a poor atom economy. Green chemistry wants both, and measures waste per kilogram of product (the E-factor), which for pharmaceuticals often exceeds 25 kg of waste per kilogram of drug.
`,
  ideas: [
    'Theoretical yield: the most product the limiting reagent can give, from the balanced equation.',
    'Percentage yield = actual / theoretical × 100 %, in the same units for the same substance.',
    'Yields fall short through incomplete reaction, side reactions, handling losses and impure reagents.',
    'Over a multi-step synthesis the step yields multiply.',
    'Atom economy is a property of the equation: the share of the reactants\' mass that can end up in the product.'
  ],
  pitfalls: [
    'A yield above 100 % is a triumph — It means the product is wet or impure. Dry it to constant mass.',
    'Working out the theoretical yield from the reactant in excess — Only the limiting reagent sets it; using the other reactant gives a yield that is too large.',
    'High yield means little waste — A reaction with a low atom economy wastes mass as by-products even at 100 % yield.'
  ],
  formulas: [
    {
      name: 'Percentage yield',
      expr: 'Y = ma/mt', tex: 'Y = \\frac{m_\\text{actual}}{m_\\text{theor}}',
      vars: {
        Y: { name: 'percentage yield', q: 'ratio', unit: '%' },
        ma: { name: 'actual yield (mass collected)', q: 'mass', unit: 'g', value: 2.10, tex: 'm_\\text{actual}' },
        mt: { name: 'theoretical yield', q: 'mass', unit: 'g', value: 2.609, tex: 'm_\\text{theor}' }
      },
      note: 'Defaults: a student preparation of aspirin. Moles work as well as grams, as long as both yields are in the same units.',
      stories: {
        Y: 'A preparation should give {mt} of product in theory; {ma} of dry product is collected. What is the percentage yield?',
        ma: 'A reaction has a theoretical yield of {mt} and typically runs at {Y}. What mass of product should you expect?',
        mt: 'A student collects {ma} of product, a {Y} yield. What was the theoretical yield?'
      }
    },
    {
      name: 'Overall yield of a multi-step synthesis',
      expr: 'Yt = Y^k', tex: 'Y_\\text{overall} = Y^k',
      vars: {
        Yt: { name: 'overall yield', q: 'ratio', unit: '%', tex: 'Y_\\text{overall}' },
        Y: { name: 'yield of each step', q: 'ratio', unit: '%', value: 80, min: 1, max: 100 },
        k: { name: 'number of steps', int: true, value: 10, min: 1 }
      },
      note: 'Assumes every step has the same yield; with different yields, multiply them one by one.',
      practice: { unknowns: ['Yt', 'Y'] },
      stories: {
        Yt: 'A drug is made in {k} steps, each with a yield of {Y}. What is the overall yield?',
        Y: 'A {k}-step synthesis must reach an overall yield of {Yt}. What yield does each step need, if all are equal?'
      }
    },
    {
      name: 'Atom economy',
      expr: 'AE = Mp/Mr', tex: '\\text{AE} = \\frac{M_\\text{product}}{M_\\text{reactants}}',
      vars: {
        AE: { name: 'atom economy', q: 'ratio', unit: '%', tex: '\\text{AE}' },
        Mp: { name: 'molar mass of the desired product × its coefficient', q: 'molarmass', unit: 'g/mol', value: 180.16, tex: 'M_\\text{product}' },
        Mr: { name: 'total molar mass of the reactants × coefficients', q: 'molarmass', unit: 'g/mol', value: 240.21, tex: 'M_\\text{reactants}' }
      },
      note: 'Defaults: aspirin from salicylic acid (138.12) and ethanoic anhydride (102.09). The rest of the mass leaves as ethanoic acid.',
      stories: {
        AE: 'The reactants in a balanced equation weigh {Mr} per mole of reaction, and the desired product {Mp}. What is the atom economy?',
        Mp: 'A reaction with reactants of total molar mass {Mr} has an atom economy of {AE}. What mass of desired product forms per mole of reaction?'
      }
    }
  ],
  examples: [
    {
      title: 'Aspirin in the teaching laboratory',
      q: '2.00 g of salicylic acid, $\\ce{C7H6O3}$ (138.12 g/mol), reacts with excess ethanoic anhydride, $\\ce{C4H6O3}$: $\\ce{C7H6O3 + C4H6O3 -> C9H8O4 + CH3COOH}$. The student collects 2.10 g of dry aspirin, $\\ce{C9H8O4}$ (180.16 g/mol). Find the percentage yield and the atom economy.',
      steps: [
        'Salicylic acid is limiting: $n = 2.00/138.12 = 0.014\\,48\\ \\mathrm{mol}$.',
        'One aspirin per salicylic acid, so the theoretical yield is $0.014\\,48 \\times 180.16 = 2.609\\ \\mathrm{g}$.',
        'Percentage yield: $2.10/2.609 = 80.5\\,\\%$.',
        'Atom economy: $180.16/(138.12 + 102.09) = 180.16/240.21 = 75.0\\,\\%$. Even a perfect preparation turns a quarter of the reactants\' mass into ethanoic acid.'
      ],
      a: 'Yield 80.5 %; atom economy 75.0 %.'
    },
    {
      title: 'A long synthesis',
      q: 'An eight-step synthesis has step yields of 90, 85, 75, 95, 80, 70, 92 and 88 %. What fraction of the starting material ends up as product, in moles?',
      steps: [
        'Multiply the yields as fractions: $0.90 \\times 0.85 \\times 0.75 \\times 0.95 \\times 0.80 \\times 0.70 \\times 0.92 \\times 0.88$.',
        'The product is $0.247$: an overall yield of 24.7 %.',
        'Improving the worst step from 70 % to 90 % would raise it to $0.247 \\times 0.90/0.70 = 31.8\\,\\%$ — the weakest link matters most.'
      ],
      a: 'About 25 % overall.'
    }
  ],
  quiz: [
    { q: 'A student reports a percentage yield of 112 %. What is the most likely reason?', choices: ['the reaction made extra product from nothing', 'the product was still wet or contained impurities', 'the theoretical yield was calculated from the limiting reagent', 'some product was spilled'], a: 1,
      why: 'Mass cannot be created. Solvent or impurities in the product add mass that is not product. Spilling would lower the yield, not raise it.' },
    { q: 'The theoretical yield of a reaction is 12.5 g and 9.8 g of product is collected. What is the percentage yield?', answer: 78.4, unit: '%',
      why: '$9.8/12.5 = 0.784$, or 78.4 %.' },
    { q: 'Which of these lowers the atom economy of a process but not its percentage yield?', choices: ['spilling some of the product', 'a by-product that the balanced equation itself produces', 'a reaction that stops at equilibrium', 'a side reaction that makes an impurity'], a: 1,
      why: 'Atom economy is calculated from the balanced equation, so only a by-product built into that equation lowers it. The other three reduce the yield.' },
    { q: 'A reaction with 100 % atom economy always gives a 100 % yield.', a: false,
      why: 'Atom economy assumes a perfect reaction. The Haber process has 100 % atom economy but converts only about 15 % of the gas per pass, because it reaches equilibrium.' },
    { q: 'A synthesis has five steps, each with a 90 % yield. What is the overall yield?', choices: ['90 %', 'about 59 %', '45 %', '50 %'], a: 1,
      why: 'Yields multiply: $0.9^5 = 0.590$. Adding or averaging them would be wrong.' }
  ],
  applications: [
    'Pharmaceutical process development, where yields and the number of steps set the cost of a drug.',
    'Green chemistry: choosing routes with high atom economy and little waste.',
    'Industrial ammonia, methanol and sulfuric acid plants that recycle unreacted gases to push the overall yield up.',
    'Quality control: a yield that suddenly drops flags a fault in the process.'
  ]
}

);
