/* HYPER-CHEMISTRY · content/moles.js — the mole: counting particles by weighing them,
 * molar mass, percentage composition, and formulas worked out from analysis. */
Hyper.add(

{
  id: 'mole-concept', parent: 'moles', title: 'The mole and the Avogadro constant', level: 1,
  short: 'Atoms are far too small to count one by one, so chemists count them in moles: packs of exactly 6.022 × 10²³ particles, a number chosen so that a mole weighs the formula mass in grams.',
  keywords: ['mole', 'mol', 'Avogadro constant', 'Avogadro number', 'amount of substance', 'counting particles', '6.022e23', 'entities', 'atomic mass unit'],
  prereq: ['atomic-theory', 'isotopes', 'math:scientific-notation'],
  related: ['molar-mass', 'reaction-stoichiometry', 'ideal-gas-law', 'physics:kinetic-theory-gases'],
  body: `
A grain of table salt holds about $10^{18}$ ions. Nobody can count them, but a balance can: if you know how much one particle weighs, the mass of a sample tells you how many particles it contains. A bank counts coins the same way, weighing a bag instead of tipping it out, and a hardware shop sells screws by the kilogram.

Chemists do this with a fixed, very large pack size. One **mole** (symbol mol) is

$$N_A = 6.022\\,140\\,76 \\times 10^{23}\\ \\text{particles per mole}$$

the **Avogadro constant**. A mole is a count, exactly like a dozen: a dozen eggs and a dozen elephants are both twelve things, and a mole of hydrogen molecules and a mole of haemoglobin molecules are both $6.022 \\times 10^{23}$ things. The **amount of substance** $n$, in moles, is simply

$$n = \\frac{N}{N_A}$$

### Why that number
The value was chosen so that grams and atomic masses line up. One atom of relative atomic mass $A_r$ has mass $A_r$ atomic mass units, $1\\ \\mathrm{u} = 1.6605 \\times 10^{-27}\\ \\mathrm{kg}$. A mole of such atoms has mass $N_A \\cdot A_r\\,\\mathrm{u}$, and $N_A \\times 1\\ \\mathrm{u}$ is one gram (to better than one part in a billion). So a mole of carbon-12 is 12 g, a mole of water 18.02 g, a mole of gold 196.97 g: the [[molar-mass|molar mass]] is the formula mass read in grams.

### Always name the particle
"A mole of oxygen" is ambiguous. A mole of oxygen **atoms** is 16.00 g; a mole of oxygen **molecules**, $\\ce{O2}$, is 32.00 g and contains two moles of atoms. In the same way one mole of $\\ce{Ca(NO3)2}$ contains one mole of calcium ions, two moles of nitrate ions and six moles of oxygen atoms. Stoichiometry is keeping these counts straight.

### How big is a mole?
- 18 g of water, a mole, is 18 mL: a little more than a tablespoon. A 250 mL glass holds 13.9 mol, about $8.4 \\times 10^{24}$ molecules.
- A mole of sand grains of one cubic millimetre each would bury every continent on Earth about 4 m deep.
- A one-carat diamond (0.200 g) contains $1.0 \\times 10^{22}$ carbon atoms.

The mole makes these numbers manageable: chemists work with 0.1 mol or 2.5 mol, not with 24-digit counts.

> [!key] Everything in stoichiometry is about counts of particles. Grams, litres of gas and molarities are only different ways of measuring the count — and the mole is the unit in which the count is written.

### The definition
Until 2019 the mole was defined as the number of atoms in exactly 12 g of carbon-12, which made $N_A$ a measured quantity. Since the 2019 revision of the SI, $N_A$ is fixed at exactly $6.02214076 \\times 10^{23}\\ \\mathrm{mol^{-1}}$ and the mole is simply that many entities. The change was far too small to affect any practical measurement.
`,
  ideas: [
    'A mole is a count: exactly 6.022 140 76 × 10²³ particles, whatever they are.',
    'The number is chosen so that a mole of particles weighs its formula mass in grams.',
    'n = N/N_A turns a count of particles into an amount in moles, and back.',
    'Always say which particle you mean: a mole of $\\ce{O2}$ molecules contains two moles of O atoms.',
    'Chemical amounts in the lab are typically 0.001 to 10 mol: handy numbers for astronomically many particles.'
  ],
  pitfalls: [
    'A mole of oxygen weighs 16 g — Only a mole of oxygen atoms. Oxygen gas is $\\ce{O2}$: a mole of molecules weighs 32.00 g. Always name the particle.',
    'A mole of large molecules contains fewer molecules — A mole is a count. A mole of haemoglobin contains exactly as many molecules as a mole of hydrogen; it is just about 32 000 times heavier.',
    'The Avogadro constant is a pure number — It is $6.022 \\times 10^{23}$ per mole (mol⁻¹). Keeping the unit makes $N = nN_A$ come out as a plain count, and shows at once when a conversion is upside down.'
  ],
  derivation: {
    title: 'Why a mole weighs the formula mass in grams',
    steps: [
      { text: 'One particle of relative mass $A_r$ has a mass of $A_r$ atomic mass units:', tex: 'm_1 = A_r\\,\\mathrm{u}, \\qquad 1\\,\\mathrm{u} = 1.660\\,539 \\times 10^{-27}\\,\\mathrm{kg}' },
      { text: 'A mole contains $N_A$ such particles, so its mass is', tex: 'M = N_A\\,m_1 = A_r\\,(N_A\\,\\mathrm{u})' },
      { text: 'The product of the two constants is one gram per mole, to within a few parts in $10^{10}$:', tex: 'N_A\\,\\mathrm{u} = 6.022\\,140\\,76 \\times 10^{23}\\,\\mathrm{mol^{-1}} \\times 1.660\\,539 \\times 10^{-27}\\,\\mathrm{kg} = 0.999\\,999\\,999\\,7\\,\\mathrm{g/mol}' },
      { text: 'So the molar mass in grams per mole is numerically the relative mass:', tex: 'M = A_r\\ \\mathrm{g/mol}' }
    ]
  },
  formulas: [
    {
      name: 'Number of particles from the amount',
      expr: 'N = n*NA', tex: 'N = n\\,N_A',
      vars: {
        N: { name: 'number of particles', q: 'count' },
        n: { name: 'amount of substance', q: 'amount', unit: 'mol', value: 0.5 },
        NA: { const: 'NA' }
      },
      note: 'Works for any particle — atoms, molecules, ions, electrons — as long as you say which.',
      stories: {
        N: 'How many water molecules are there in {n} of water?',
        n: 'A crystal contains {N} atoms of iron. What amount of iron is that?'
      }
    },
    {
      name: 'Atoms of one element in a mass of compound',
      expr: 'Nat = m/M*k*NA', tex: 'N_\\text{atoms} = \\frac{m}{M}\\,k\\,N_A',
      vars: {
        Nat: { name: 'number of atoms of the element', q: 'count', tex: 'N_\\text{atoms}' },
        m: { name: 'mass of the compound', q: 'mass', unit: 'g', value: 4.2 },
        M: { name: 'molar mass of the compound', q: 'molarmass', unit: 'g/mol', value: 342.297, fixed: true },
        k: { name: 'atoms of the element in one formula unit', int: true, fixed: true, value: 12 },
        NA: { const: 'NA' }
      },
      note: 'The defaults are carbon in a teaspoon of sugar: sucrose, $\\ce{C12H22O11}$, has 12 carbon atoms per molecule.',
      practice: { unknowns: ['Nat', 'm'] },
      stories: {
        Nat: 'A teaspoon holds {m} of sucrose, $\\ce{C12H22O11}$ ($M$ = {M}). How many carbon atoms does it contain?',
        m: 'What mass of sucrose, $\\ce{C12H22O11}$ ($M$ = {M}), contains {Nat} carbon atoms?'
      }
    },
    {
      name: 'Mass of a single particle',
      expr: 'm1 = M/NA', tex: 'm_1 = \\frac{M}{N_A}',
      vars: {
        m1: { name: 'mass of one particle', q: 'mass', unit: 'g', tex: 'm_1' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 18.015 },
        NA: { const: 'NA' }
      },
      note: 'One water molecule weighs about $3 \\times 10^{-23}$ g — which is why nobody weighs molecules one at a time.',
      stories: {
        m1: 'What is the mass of one molecule of a substance whose molar mass is {M}?',
        M: 'One molecule of a gas has a mass of {m1}. What is the molar mass of the gas?'
      }
    }
  ],
  examples: [
    {
      title: 'A teaspoon of sugar',
      q: 'A teaspoon holds 4.2 g of sucrose, $\\ce{C12H22O11}$ (342.30 g/mol). How many molecules, and how many atoms, is that?',
      steps: [
        'Amount: $n = 4.2 / 342.30 = 0.012\\,27\\ \\mathrm{mol}$.',
        'Molecules: $N = n N_A = 0.012\\,27 \\times 6.022 \\times 10^{23} = 7.39 \\times 10^{21}$.',
        'Each molecule has $12 + 22 + 11 = 45$ atoms, so the spoonful holds $45 \\times 7.39 \\times 10^{21} = 3.3 \\times 10^{23}$ atoms — more than half a mole of atoms.',
        'Of these, $12 \\times 7.39 \\times 10^{21} = 8.9 \\times 10^{22}$ are carbon atoms.'
      ],
      a: '7.4 × 10²¹ molecules, containing 3.3 × 10²³ atoms.'
    },
    {
      title: 'A gram of hydrogen or a gram of helium?',
      q: 'Which contains more atoms: 1.00 g of hydrogen gas ($\\ce{H2}$) or 1.00 g of helium?',
      steps: [
        'Hydrogen: $n(\\ce{H2}) = 1.00/2.016 = 0.496\\ \\mathrm{mol}$ of molecules, each with two atoms: $0.992\\ \\mathrm{mol}$ of atoms, $5.97 \\times 10^{23}$ atoms.',
        'Helium is monatomic: $n = 1.00/4.003 = 0.250\\ \\mathrm{mol}$ of atoms, $1.50 \\times 10^{23}$ atoms.',
        'A helium atom is about four times as heavy as a hydrogen atom, so a gram of it contains a quarter as many.'
      ],
      a: 'Hydrogen: about four times as many atoms (5.97 × 10²³ against 1.50 × 10²³).'
    }
  ],
  quiz: [
    { q: 'Which statement about 1 mol of $\\ce{O2}$ and 1 mol of $\\ce{O3}$ is true?', choices: ['They contain the same number of oxygen atoms', 'They contain the same number of molecules', 'They have the same mass', 'The ozone contains fewer molecules because they are heavier'], a: 1,
      why: 'A mole is a count of the named particle, here molecules: both samples contain $6.022 \\times 10^{23}$ molecules. The ozone has 3 mol of atoms against 2, and weighs 48.00 g against 32.00 g.' },
    { q: 'How many moles of molecules are there in $1.00 \\times 10^{24}$ molecules?', answer: 1.66, unit: 'mol',
      why: '$n = N/N_A = 1.00 \\times 10^{24} / 6.022 \\times 10^{23} = 1.66$ mol.' },
    { q: 'A mole of lead contains more atoms than a mole of aluminium, because lead atoms are heavier.', a: false,
      why: 'Both contain exactly $N_A$ atoms. The mole of lead is heavier (207.2 g against 26.98 g) because each atom is heavier, not because there are more of them.' },
    { q: 'How many moles of hydrogen atoms are there in 0.50 mol of methane, $\\ce{CH4}$?', choices: ['0.50 mol', '1.0 mol', '2.0 mol', '4.0 mol'], a: 2,
      why: 'Each molecule has four hydrogen atoms, so the amount of H atoms is $4 \\times 0.50 = 2.0$ mol.' },
    { q: 'Roughly how many water molecules are there in one drop of water (0.05 mL)?', choices: ['about $10^{12}$', 'about $10^{18}$', 'about $10^{21}$', 'about $10^{26}$'], a: 2,
      why: '0.05 mL of water is 0.05 g, or $0.05/18 = 2.8 \\times 10^{-3}$ mol; times $6.0 \\times 10^{23}$ gives $1.7 \\times 10^{21}$ molecules.' }
  ],
  applications: [
    'Every recipe of chemistry — reagents weighed out on a balance so that the right numbers of particles meet.',
    'Drug doses and blood tests, quoted in millimoles or micromoles per litre so that they compare numbers of molecules.',
    'The gas laws: equal volumes of gases at the same temperature and pressure contain equal amounts in moles.',
    'Semiconductor doping, where parts per billion of an impurity still means around $10^{13}$ atoms per cubic centimetre.'
  ],
  history: 'Amedeo Avogadro proposed in 1811 that equal volumes of gases hold equal numbers of molecules. The constant was named after him by Jean Perrin, who measured it around 1909 from the Brownian motion of tiny particles. The mole became an SI base unit in 1971 and was redefined in 2019 by fixing the value of $N_A$ exactly.',
  sim: 'stoich-weigh'
},

{
  id: 'molar-mass', parent: 'moles', title: 'Molar mass', level: 1,
  short: 'The mass of one mole of a substance, in grams per mole: the sum of the atomic masses in its formula. Dividing a mass on the balance by it gives the amount in moles.',
  keywords: ['molar mass', 'molecular weight', 'formula mass', 'relative molecular mass', 'relative formula mass', 'g/mol', 'n = m/M', 'hydrate', 'gas density', 'Dumas method'],
  prereq: ['mole-concept', 'isotopes', 'periodic-table'],
  related: ['percent-composition', 'ideal-gas-law', 'mass-spectrometry', 'reaction-stoichiometry'],
  body: `
The **molar mass** $M$ of a substance is the mass of one mole of it, in grams per mole. It is the link between the balance and the count of particles:

$$n = \\frac{m}{M}$$

— probably the most used equation in chemistry. A 10.0 g sample of water ($M = 18.015\\ \\mathrm{g/mol}$) is 0.555 mol; 10.0 g of table salt (58.44 g/mol) is only 0.171 mol, because each formula unit of salt is heavier.

### Adding it up
Read the relative atomic masses from [the periodic table](#/tools/periodic) and add them as many times as each element appears in the formula:

$$M(\\ce{H2SO4}) = 2(1.008) + 32.06 + 4(15.999) = 98.07\\ \\mathrm{g/mol}$$

Brackets multiply everything inside: $\\ce{Ca3(PO4)2}$ has 3 Ca, 2 P and 8 O, so $M = 310.17\\ \\mathrm{g/mol}$. The [molar mass calculator](#/tools/chemcalc) does this for any formula, including hydrates and ions.

### Why the numbers are not whole
Chlorine is 35.45, not 35 or 36, because natural chlorine is a mixture of two [[isotopes]]: about 76 % chlorine-35 and 24 % chlorine-37. Atomic masses in the table are **averages over the natural isotope mix** ([[mass-spectrometry]] measures that mix). Even a single isotope is not quite a whole number — only carbon-12 is exactly 12 u, by definition — because protons and neutrons each weigh slightly more than 1 u and the [[physics:binding-energy|binding energy]] of the nucleus takes a little mass away.

### Hydrates, ions and giant molecules
- **Hydrates** carry water in the crystal: $\\ce{CuSO4.5H2O}$ is 249.68 g/mol against 159.60 g/mol for the anhydrous salt. Read the label on the bottle before you weigh.
- **Ions**: the mass of the gained or lost electrons (0.000 55 g/mol each) is negligible, so $M(\\ce{SO4^2-}) = 96.06$ g/mol.
- **Polymers and proteins** have molar masses in kilograms per mole — haemoglobin about 64.5 kg/mol — and for polymers it is an average over chains of different lengths.

### Molar mass of a gas from its density
For an ideal gas $pV = nRT = (m/M)RT$, so

$$M = \\frac{\\rho R T}{p}$$

Weigh a known volume of an unknown gas and you have its molar mass (the Dumas method). At 0 °C and 1 atm a mole of any ideal gas fills 22.4 L, so the density in g/L times 22.4 is the molar mass: nitrogen 1.25 g/L → 28.0 g/mol; carbon dioxide 1.96 g/L → 44.0 g/mol. See [[ideal-gas-law]].

> [!tip] Keep four significant figures in molar masses and round only at the end. Rounding hydrogen to 1 and oxygen to 16 is fine for estimates but gives errors of up to 1 % in careful work.
`,
  ideas: [
    'Molar mass M is the mass of one mole, in g/mol: the formula mass read in grams.',
    'n = m/M converts a mass on the balance into an amount in moles.',
    'Add the atomic masses as many times as each atom appears; brackets multiply everything inside.',
    'Atomic masses are weighted averages of the natural isotopes, which is why they are not whole numbers.',
    'For a gas, M = ρRT/p: its density gives its molar mass.'
  ],
  pitfalls: [
    'Using the atomic mass for a diatomic gas — $\\ce{H2}$, $\\ce{N2}$, $\\ce{O2}$, $\\ce{F2}$, $\\ce{Cl2}$, $\\ce{Br2}$ and $\\ce{I2}$ are molecules. A mole of chlorine gas is 70.90 g, not 35.45 g.',
    'Forgetting the water in a hydrate — $\\ce{CuSO4.5H2O}$ is 249.68 g/mol. Weighing out 159.60 g of the blue crystals gives only 0.639 mol of copper sulfate.',
    'Confusing molar mass with mass — Molar mass is a property of the substance (grams per mole); the mass is how much of it you happen to have.'
  ],
  formulas: [
    {
      name: 'Amount from mass',
      expr: 'n = m/M', tex: 'n = \\frac{m}{M}',
      vars: {
        n: { name: 'amount of substance', q: 'amount', unit: 'mol' },
        m: { name: 'mass', q: 'mass', unit: 'g', value: 5.00 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 58.44 }
      },
      note: 'The defaults are table salt, $\\ce{NaCl}$.',
      stories: {
        n: 'How many moles are there in {m} of sodium chloride ($M$ = {M})?',
        m: 'A recipe needs {n} of sodium chloride ($M$ = {M}). What mass do you weigh out?',
        M: '{m} of an unknown white solid turns out to be {n}. What is its molar mass?'
      }
    },
    {
      name: 'Molar mass of a two-element compound',
      expr: 'M = a*MA + b*MB', tex: 'M = a\\,M_A + b\\,M_B',
      vars: {
        M: { name: 'molar mass of the compound', q: 'molarmass', unit: 'g/mol' },
        a: { name: 'atoms of A per formula unit', int: true, value: 2 },
        MA: { name: 'atomic mass of A', q: 'molarmass', unit: 'g/mol', value: 26.982, tex: 'M_A' },
        b: { name: 'atoms of B per formula unit', int: true, value: 3 },
        MB: { name: 'atomic mass of B', q: 'molarmass', unit: 'g/mol', value: 15.999, tex: 'M_B' }
      },
      note: 'Defaults: alumina, $\\ce{Al2O3}$. For longer formulas keep adding terms — or use the [molar mass calculator](#/tools/chemcalc).',
      practice: { unknowns: ['M', 'b'] },
      stories: {
        M: 'A compound has {a} atoms of an element of atomic mass {MA} and {b} atoms of one of atomic mass {MB} in each formula unit. What is its molar mass?',
        b: 'An oxide of molar mass {M} contains {a} atoms of a metal of atomic mass {MA} per formula unit, the rest being an element of atomic mass {MB}. How many atoms of that element are there per formula unit?'
      }
    },
    {
      name: 'Molar mass of a gas from its density',
      expr: 'M = rho*R*T/p', tex: 'M = \\frac{\\rho R T}{p}',
      vars: {
        M: { name: 'molar mass of the gas', q: 'molarmass', unit: 'g/mol' },
        rho: { name: 'gas density', q: 'density', unit: 'g/L', value: 1.80 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 100 }
      },
      note: 'Follows from the ideal gas law; good to a percent or so for most gases near room conditions. The default density points to carbon dioxide or propane (both 44 g/mol).',
      practice: { unknowns: ['M', 'rho'] },
      stories: {
        M: 'A flask of an unknown gas has a density of {rho} at {T} and {p}. What is the molar mass of the gas?',
        rho: 'What is the density of a gas of molar mass {M} at {T} and {p}?'
      }
    }
  ],
  examples: [
    {
      title: 'An aspirin tablet',
      q: 'A tablet contains 300 mg of aspirin, $\\ce{C9H8O4}$. How many moles and how many molecules is that?',
      steps: [
        'Molar mass: $9(12.011) + 8(1.008) + 4(15.999) = 108.099 + 8.064 + 63.996 = 180.16\\ \\mathrm{g/mol}$.',
        'Amount: $n = 0.300\\ \\mathrm{g} / 180.16\\ \\mathrm{g/mol} = 1.665 \\times 10^{-3}\\ \\mathrm{mol}$ (1.67 mmol).',
        'Molecules: $1.665 \\times 10^{-3} \\times 6.022 \\times 10^{23} = 1.00 \\times 10^{21}$.'
      ],
      a: '1.67 mmol, or 1.00 × 10²¹ molecules.'
    },
    {
      title: 'Weighing a hydrate',
      q: 'A solution needs 0.0500 mol of copper(II) sulfate. The bottle contains the blue pentahydrate, $\\ce{CuSO4.5H2O}$. What mass should you weigh?',
      steps: [
        'Molar mass of the hydrate: $63.546 + 32.06 + 4(15.999) + 5(18.015) = 249.68\\ \\mathrm{g/mol}$.',
        'Mass: $m = nM = 0.0500 \\times 249.68 = 12.48\\ \\mathrm{g}$.',
        'Using the anhydrous molar mass (159.60 g/mol) would give 7.98 g — only 64 % of the copper sulfate you meant to add.'
      ],
      a: '12.48 g of the pentahydrate.'
    },
    {
      title: 'Identifying a gas by weighing it',
      q: 'A gas has a density of 1.80 g/L at 25 °C and 100 kPa. What is its molar mass, and what might it be?',
      steps: [
        'In SI units: $\\rho = 1.80\\ \\mathrm{kg/m^3}$, $T = 298.15\\ \\mathrm{K}$, $p = 1.00 \\times 10^5\\ \\mathrm{Pa}$.',
        { text: 'Then', tex: 'M = \\frac{\\rho R T}{p} = \\frac{1.80 \\times 8.314 \\times 298.15}{1.00 \\times 10^5} = 0.0446\\ \\mathrm{kg/mol} = 44.6\\ \\mathrm{g/mol}' },
        'Candidates near 44 g/mol: carbon dioxide (44.01), propane (44.10), dinitrogen oxide (44.01). Density alone cannot separate them — whether the gas burns can.'
      ],
      a: 'About 44.6 g/mol: carbon dioxide, propane or dinitrogen oxide.'
    }
  ],
  quiz: [
    { q: 'What is the molar mass of calcium hydroxide, $\\ce{Ca(OH)2}$?', answer: 74.09, unit: 'g/mol',
      why: '$40.078 + 2(15.999 + 1.008) = 40.078 + 34.014 = 74.09$ g/mol. The 2 after the bracket doubles both O and H.' },
    { q: 'You weigh 10.0 g of each of these. Which sample contains the largest amount in moles?', choices: ['$\\ce{H2O}$', '$\\ce{CO2}$', '$\\ce{NaCl}$', '$\\ce{CaCO3}$'], a: 0,
      why: 'For equal masses, $n = m/M$ is largest for the smallest molar mass: water, 18.02 g/mol, gives 0.555 mol, against 0.227, 0.171 and 0.100 mol.' },
    { q: 'The molar mass of chlorine gas is 35.45 g/mol.', a: false,
      why: 'Chlorine gas is made of $\\ce{Cl2}$ molecules, so its molar mass is $2 \\times 35.45 = 70.90$ g/mol. 35.45 g/mol is for chlorine atoms.' },
    { q: 'Why is the relative atomic mass of copper 63.55 and not a whole number?', choices: ['copper atoms contain a fraction of a proton', 'it is a weighted average of copper-63 and copper-65', 'it is rounded from a measurement error', 'the electrons add 0.55'], a: 1,
      why: 'Natural copper is about 69 % copper-63 and 31 % copper-65; the average of their masses, weighted by abundance, is 63.55.' },
    { q: 'An unknown gas has a density of 1.25 g/L at 0 °C and 1 atm. Which of these could it be?', choices: ['$\\ce{O2}$', '$\\ce{N2}$', '$\\ce{CO2}$', '$\\ce{CH4}$'], a: 1,
      why: 'At 0 °C and 1 atm a mole occupies 22.4 L, so $M = 1.25 \\times 22.4 = 28.0$ g/mol: nitrogen (carbon monoxide and ethene have the same molar mass).' }
  ],
  applications: [
    'Weighing reagents for every synthesis and every standard solution.',
    'Pharmacy: converting a dose in milligrams into millimoles, and comparing salts and hydrates of the same drug.',
    'Identifying unknown gases and volatile liquids from their vapour density.',
    'Polymer science, where the average molar mass decides how strong or viscous a plastic is.'
  ],
  sim: 'stoich-molemap'
},

{
  id: 'percent-composition', parent: 'moles', title: 'Percentage composition', level: 1,
  short: 'What fraction of a compound\'s mass each element provides: the atoms of the element times its atomic mass, divided by the molar mass.',
  keywords: ['percentage composition', 'percent composition', 'mass percent', 'mass fraction', 'elemental analysis', 'ore grade', 'fertiliser', 'law of definite proportions', 'water of crystallisation'],
  prereq: ['molar-mass', 'math:percentages'],
  related: ['empirical-formula', 'gravimetric-analysis', 'mass-spectrometry'],
  body: `
A formula gives the ratio of **atoms**. Percentage composition turns it into the ratio of **masses**, which is what a balance, a mining engineer or a farmer cares about. For an element E appearing $k$ times in a formula of molar mass $M$,

$$w(\\text{E}) = \\frac{k\\,A(\\text{E})}{M} \\times 100\\,\\%$$

In water, $\\ce{H2O}$, hydrogen is two atoms out of three but only $2(1.008)/18.015 = 11.19\\,\\%$ of the mass; oxygen is the other 88.81 %. A kilogram of water contains 112 g of hydrogen.

The percentages of a pure compound are fixed, whatever its source or size — Proust's **law of definite proportions**. Water from a glacier and water from a fuel cell are both 11.19 % hydrogen. That constancy is what makes chemical analysis possible.

### What it is used for
- **Ore grade.** Pure hematite, $\\ce{Fe2O3}$, is 69.9 % iron; magnetite, $\\ce{Fe3O4}$, 72.4 %; siderite, $\\ce{FeCO3}$, only 48.2 %. Pyrite, $\\ce{FeS2}$, is 46.6 % iron but is not used as an iron ore: the sulfur would make brittle steel and acid rain.
- **Fertilisers** are sold on their nutrient content. Nitrogen is 46.6 % of urea, $\\ce{CO(NH2)2}$, 35.0 % of ammonium nitrate and 21.2 % of ammonium sulfate — so a lorry-load of urea carries more than twice the nitrogen of the same mass of ammonium sulfate. (By old convention, labels quote phosphorus and potassium as if they were $\\ce{P2O5}$ and $\\ce{K2O}$.)
- **Water of crystallisation.** Blue $\\ce{CuSO4.5H2O}$ is 36.1 % water, Epsom salt $\\ce{MgSO4.7H2O}$ 51.2 %: more than half of what you buy is water.

### The mass of an element in a sample
Multiply the sample mass by the mass fraction:

$$m_\\text{E} = m \\cdot \\frac{k\\,A(\\text{E})}{M}$$

A tonne of ore that is 82 % hematite contains $0.82 \\times 0.699 = 0.574$ t of iron.

### And backwards
Measure the percentages — by [[gravimetric-analysis]], combustion or a modern elemental analyser — and you can work back to the ratio of atoms: the [[empirical-formula]]. The [molar mass calculator](#/tools/chemcalc) lists the percentage composition of any formula you type.

> [!warn] Compounds with the same empirical formula have identical percentages: methanal ($\\ce{CH2O}$), ethanoic acid ($\\ce{C2H4O2}$) and glucose ($\\ce{C6H12O6}$) are all 40.0 % carbon. Percentages give ratios, never the size of the molecule.
`,
  ideas: [
    'Mass percentage of an element = (atoms of it × its atomic mass) / molar mass × 100 %.',
    'Atom counts and mass fractions are different: light atoms can be many in number yet small in mass.',
    'A pure compound always has the same percentages (the law of definite proportions).',
    'Multiplying a sample mass by the mass fraction gives the mass of the element in it.',
    'Compounds with the same empirical formula share the same percentages.'
  ],
  pitfalls: [
    'Using atom counts as mass percentages — In $\\ce{CH4}$ four of the five atoms are hydrogen, but hydrogen is only 25.1 % of the mass.',
    'Forgetting the subscript — $\\ce{Fe2O3}$ has two iron atoms. Counting one gives 35 % iron instead of 69.9 %.',
    'Expecting the percentages to identify a compound — They fix only the ratio of atoms; $\\ce{CH2O}$ and $\\ce{C6H12O6}$ have the same percentages but are very different substances.'
  ],
  formulas: [
    {
      name: 'Mass percentage of an element',
      expr: 'w = k*A/M', tex: 'w = \\frac{k\\,A}{M}',
      vars: {
        w: { name: 'mass fraction of the element', q: 'ratio', unit: '%' },
        k: { name: 'atoms of the element per formula unit', int: true, value: 2 },
        A: { name: 'atomic mass of the element', q: 'molarmass', unit: 'g/mol', value: 55.845 },
        M: { name: 'molar mass of the compound', q: 'molarmass', unit: 'g/mol', value: 159.687 }
      },
      note: 'Defaults: iron in hematite, $\\ce{Fe2O3}$. The percentages of all elements in a compound add up to 100 %.',
      practice: { unknowns: ['w', 'M'] },
      stories: {
        w: 'A compound of molar mass {M} contains {k} atoms of an element of atomic mass {A} per formula unit. What percentage of its mass is that element?',
        M: 'An element of atomic mass {A} makes up {w} of a compound, with {k} of its atoms per formula unit. What is the molar mass of the compound?'
      }
    },
    {
      name: 'Mass of an element in a sample',
      expr: 'mE = m*k*A/M', tex: 'm_E = m\\,\\frac{k\\,A}{M}',
      vars: {
        mE: { name: 'mass of the element', q: 'mass', unit: 'kg', tex: 'm_E' },
        m: { name: 'mass of the compound', q: 'mass', unit: 'kg', value: 1000 },
        k: { name: 'atoms of the element per formula unit', int: true, fixed: true, value: 2 },
        A: { name: 'atomic mass of the element', q: 'molarmass', unit: 'g/mol', value: 55.845, fixed: true },
        M: { name: 'molar mass of the compound', q: 'molarmass', unit: 'g/mol', value: 159.687, fixed: true }
      },
      note: 'Defaults: the iron in a tonne of pure hematite, $\\ce{Fe2O3}$.',
      practice: { unknowns: ['mE', 'm'] },
      stories: {
        mE: 'How much iron ({A}) can be extracted from {m} of pure hematite, $\\ce{Fe2O3}$ ($M$ = {M})?',
        m: 'A steelworks needs {mE} of iron. What mass of pure hematite, $\\ce{Fe2O3}$ ($M$ = {M}), contains that much?'
      }
    }
  ],
  examples: [
    {
      title: 'Nitrogen fertilisers',
      q: 'A field needs 100 kg of nitrogen. How much urea, $\\ce{CO(NH2)2}$, ammonium nitrate, $\\ce{NH4NO3}$, or ammonium sulfate, $\\ce{(NH4)2SO4}$, would supply it?',
      steps: [
        'Molar masses: urea 60.06, ammonium nitrate 80.04, ammonium sulfate 132.13 g/mol. Each has two nitrogen atoms per formula unit.',
        'Nitrogen fractions: $2(14.007)/60.06 = 46.6\\,\\%$; $2(14.007)/80.04 = 35.0\\,\\%$; $2(14.007)/132.13 = 21.2\\,\\%$.',
        'Mass needed $= 100\\ \\mathrm{kg} / w$: urea 214 kg, ammonium nitrate 286 kg, ammonium sulfate 472 kg.',
        'Urea carries the most nitrogen per tonne shipped, which is why it is the most traded fertiliser; ammonium sulfate also supplies sulfur, which some soils lack.'
      ],
      a: 'Urea 214 kg, ammonium nitrate 286 kg, ammonium sulfate 472 kg.'
    },
    {
      title: 'Iron in an ore',
      q: 'An ore is 82 % hematite by mass, the rest being rock with no iron. How much iron does a tonne of it contain?',
      steps: [
        'Iron in hematite: $w = 2(55.845)/159.687 = 0.6994$.',
        'Iron in the ore: $1.00\\ \\mathrm{t} \\times 0.82 \\times 0.6994 = 0.574\\ \\mathrm{t}$.'
      ],
      a: 'About 0.57 t (574 kg) of iron per tonne of ore.'
    }
  ],
  quiz: [
    { q: 'What is the mass percentage of carbon in carbon dioxide, $\\ce{CO2}$?', answer: 27.29, unit: '%',
      why: '$12.011 / 44.009 = 0.2729$, so 27.29 %. This is the factor used in combustion analysis to get carbon from the mass of $\\ce{CO2}$.' },
    { q: 'The element with the most atoms in a formula always has the largest mass percentage.', a: false,
      why: 'Mass depends on atomic mass too. Water has two hydrogen atoms to one oxygen, yet oxygen is 88.8 % of its mass.' },
    { q: 'If each were pure, which iron ore would give the most iron per tonne?', choices: ['hematite, $\\ce{Fe2O3}$', 'magnetite, $\\ce{Fe3O4}$', 'siderite, $\\ce{FeCO3}$', 'pyrite, $\\ce{FeS2}$'], a: 1,
      why: 'Magnetite has 3 Fe per 4 O: 72.4 % iron, against 69.9 % for hematite, 48.2 % for siderite and 46.6 % for pyrite.' },
    { q: 'The mass percentages of a pure compound depend on…', choices: ['the size of the sample', 'its formula only', 'the temperature', 'how it was made'], a: 1,
      why: 'By the law of definite proportions a pure compound always has the same composition; the percentages follow from the formula and the atomic masses alone.' },
    { q: 'Glucose ($\\ce{C6H12O6}$) and methanal ($\\ce{CH2O}$) have…', choices: ['the same percentage composition', 'the same molar mass', 'the same number of atoms per molecule', 'nothing in common'], a: 0,
      why: 'Glucose is six $\\ce{CH2O}$ units, so both are 40.0 % C, 6.7 % H and 53.3 % O — while their molar masses are 180.16 and 30.03 g/mol.' }
  ],
  applications: [
    'Grading ores and pricing metal concentrates by their metal content.',
    'Labelling fertilisers, animal feed and food supplements by nutrient content.',
    'Checking the purity of a newly made compound by elemental analysis.',
    'Planning the water of crystallisation lost when drying or calcining a product.'
  ],
  history: 'Joseph Proust showed around 1797 that compounds such as copper carbonate have the same composition however they are prepared, against Claude Berthollet, who held that composition could vary. Proust\'s law of definite proportions became one of the pillars of Dalton\'s atomic theory.',
  sim: { id: 'stoich-empirical', params: { mode: 1 } }
},

{
  id: 'empirical-formula', parent: 'moles', title: 'Empirical and molecular formulas', level: 2,
  short: 'The empirical formula is the simplest whole-number ratio of atoms, worked out from mass percentages or combustion analysis; the molar mass then says how many of those units make one molecule.',
  keywords: ['empirical formula', 'molecular formula', 'simplest ratio', 'combustion analysis', 'elemental analysis', 'CHN analysis', 'whole-number ratio', 'formula from percentages'],
  prereq: ['percent-composition', 'molar-mass', 'math:fractions-ratios'],
  related: ['mass-spectrometry', 'reaction-stoichiometry', 'colligative-properties', 'gravimetric-analysis'],
  body: `
Chemists meeting a new substance ask first what it is made of and in what proportions. Analysis gives **masses**; a formula is a ratio of **atoms**. The step between them is always the same: divide each mass by its atomic mass, then find the simplest whole-number ratio.

The **empirical formula** is that simplest ratio. The **molecular formula** gives the actual numbers of atoms in one molecule, and is a whole-number multiple of it:

| substance | molecular formula | empirical formula |
|---|---|---|
| hydrogen peroxide | $\\ce{H2O2}$ | $\\ce{HO}$ |
| benzene | $\\ce{C6H6}$ | $\\ce{CH}$ |
| glucose | $\\ce{C6H12O6}$ | $\\ce{CH2O}$ |
| water | $\\ce{H2O}$ | $\\ce{H2O}$ |

Ionic compounds and network solids such as $\\ce{NaCl}$ or $\\ce{SiO2}$ have no molecules, so their formulas are empirical by nature.

### From mass percentages
1. Take 100 g of the compound: the percentages become grams.
2. Divide each mass by the element's atomic mass to get amounts.
3. Divide every amount by the smallest.
4. If the numbers are not close to whole, multiply them all: a ratio ending in .5 needs ×2, in .33 or .67 ×3, in .25 or .75 ×4.

Vitamin C is 40.92 % C, 4.58 % H and 54.50 % O:

| | C | H | O |
|---|---|---|---|
| in 100 g | 40.92 g | 4.58 g | 54.50 g |
| ÷ atomic mass | 3.407 mol | 4.544 mol | 3.406 mol |
| ÷ smallest | 1.000 | 1.334 | 1.000 |
| × 3 | 3 | 4 | 3 |

The empirical formula is $\\ce{C3H4O3}$ (88.06 g/mol).

### Combustion analysis
For organic compounds the masses come from burning. A weighed sample is burnt in pure oxygen; the water is trapped in a tube of drying agent and the carbon dioxide in a tube of sodium hydroxide, and both tubes are weighed. All the carbon ends up in $\\ce{CO2}$ and all the hydrogen in $\\ce{H2O}$:

$$m_{\\ce{C}} = m_{\\ce{CO2}} \\cdot \\frac{12.011}{44.009}, \\qquad m_{\\ce{H}} = m_{\\ce{H2O}} \\cdot \\frac{2(1.008)}{18.015}$$

Oxygen is found **by difference**: sample mass minus carbon minus hydrogen. Modern CHN analysers burn a few milligrams and measure the gases automatically; journals expect a new compound's measured percentages to agree with its formula to within about 0.4 percentage points.

### From empirical to molecular
The empirical formula of vitamin C could belong to $\\ce{C3H4O3}$, $\\ce{C6H8O6}$, $\\ce{C9H12O9}$... A molar mass decides: from a [[mass-spectrometry|mass spectrum]], a gas density, or a [[colligative-properties|freezing-point depression]]. Vitamin C has $M = 176.1$ g/mol $= 2 \\times 88.06$, so it is $\\ce{C6H8O6}$.

> [!warn] Experimental ratios are never exact. Round 1.98 to 2 or 3.03 to 3, but never round 1.33 to 1 or 2.5 to 3: those are genuine ratios (4 : 3 and 5 : 2) telling you to multiply.
`,
  ideas: [
    'The empirical formula is the simplest whole-number ratio of atoms; the molecular formula is a whole multiple of it.',
    'Masses → divide by atomic masses → divide by the smallest → multiply to whole numbers.',
    'Combustion analysis gets carbon from the $\\ce{CO2}$ formed, hydrogen from the $\\ce{H2O}$, and oxygen by difference.',
    'A separately measured molar mass turns the empirical formula into the molecular one: multiplier = M / M(empirical).'
  ],
  pitfalls: [
    'Rounding 1.5 or 1.33 to the nearest whole number — These are real ratios (3 : 2, 4 : 3). Multiply everything until all the numbers are within about 0.1 of whole ones.',
    'Dividing by the molar mass of the diatomic gas — You are counting atoms: divide the oxygen mass by 16.00, not by 32.00.',
    'Assuming the empirical formula is the molecular formula — Without a molar mass you cannot tell $\\ce{CH}$ from $\\ce{C2H2}$ or $\\ce{C6H6}$.'
  ],
  formulas: [
    {
      name: 'Carbon from the carbon dioxide formed',
      expr: 'mC = mCO2*AC/MCO2', tex: 'm_{\\ce{C}} = m_{\\ce{CO2}}\\,\\frac{A_{\\ce{C}}}{M_{\\ce{CO2}}}',
      vars: {
        mC: { name: 'mass of carbon in the sample', q: 'mass', unit: 'mg', tex: 'm_{\\ce{C}}' },
        mCO2: { name: 'mass of carbon dioxide collected', q: 'mass', unit: 'mg', value: 29.31, tex: 'm_{\\ce{CO2}}' },
        AC: { name: 'atomic mass of carbon', q: 'molarmass', unit: 'g/mol', value: 12.011, fixed: true, tex: 'A_{\\ce{C}}' },
        MCO2: { name: 'molar mass of carbon dioxide', q: 'molarmass', unit: 'g/mol', value: 44.009, fixed: true, tex: 'M_{\\ce{CO2}}' }
      },
      note: 'Every carbon atom of the sample ends up in a $\\ce{CO2}$ molecule, which is 27.29 % carbon by mass.',
      practice: { unknowns: ['mC', 'mCO2'] },
      stories: {
        mC: 'Burning a sample gives {mCO2} of carbon dioxide. What mass of carbon did the sample contain?',
        mCO2: 'A sample contains {mC} of carbon. What mass of carbon dioxide will its complete combustion produce?'
      }
    },
    {
      name: 'Hydrogen from the water formed',
      expr: 'mH = mH2O*2*AH/MH2O', tex: 'm_{\\ce{H}} = m_{\\ce{H2O}}\\,\\frac{2A_{\\ce{H}}}{M_{\\ce{H2O}}}',
      vars: {
        mH: { name: 'mass of hydrogen in the sample', q: 'mass', unit: 'mg', tex: 'm_{\\ce{H}}' },
        mH2O: { name: 'mass of water collected', q: 'mass', unit: 'mg', value: 12.00, tex: 'm_{\\ce{H2O}}' },
        AH: { name: 'atomic mass of hydrogen', q: 'molarmass', unit: 'g/mol', value: 1.008, fixed: true, tex: 'A_{\\ce{H}}' },
        MH2O: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: 'Water is 11.19 % hydrogen by mass. The drying tube must not also absorb $\\ce{CO2}$, and it comes first in the train.',
      practice: { unknowns: ['mH', 'mH2O'] },
      stories: {
        mH: 'Burning a sample gives {mH2O} of water. What mass of hydrogen did the sample contain?',
        mH2O: 'A sample contains {mH} of hydrogen. What mass of water forms when it burns completely?'
      }
    },
    {
      name: 'From empirical to molecular formula',
      expr: 'k = M/Me', tex: 'k = \\frac{M}{M_\\text{emp}}',
      vars: {
        k: { name: 'multiplier (a whole number)' },
        M: { name: 'measured molar mass', q: 'molarmass', unit: 'g/mol', value: 176.12 },
        Me: { name: 'molar mass of the empirical formula', q: 'molarmass', unit: 'g/mol', value: 88.06, tex: 'M_\\text{emp}' }
      },
      note: 'Defaults: vitamin C, empirical formula $\\ce{C3H4O3}$. The result must come out close to a whole number; if it does not, recheck the empirical formula.',
      practice: { unknowns: ['k', 'M'] },
      stories: {
        k: 'A compound has an empirical formula of molar mass {Me}; its mass spectrum shows a molar mass of {M}. By what whole number must the empirical formula be multiplied?',
        M: 'A molecule contains {k} empirical-formula units of molar mass {Me}. What is its molar mass?'
      }
    }
  ],
  examples: [
    {
      title: 'A sugar by combustion analysis',
      q: '20.00 mg of a compound containing only C, H and O burns to give 29.31 mg of $\\ce{CO2}$ and 12.00 mg of $\\ce{H2O}$. Its mass spectrum shows $M = 180$ g/mol. Find the empirical and molecular formulas.',
      steps: [
        'Carbon: $29.31 \\times 12.011/44.009 = 8.000$ mg. Hydrogen: $12.00 \\times 2.016/18.015 = 1.343$ mg.',
        'Oxygen by difference: $20.00 - 8.000 - 1.343 = 10.657$ mg.',
        'Amounts: C $8.000/12.011 = 0.6661$ mmol; H $1.343/1.008 = 1.332$ mmol; O $10.657/15.999 = 0.6661$ mmol.',
        'Divide by the smallest: C 1.000, H 2.000, O 1.000. The empirical formula is $\\ce{CH2O}$, 30.03 g/mol.',
        'Multiplier: $180/30.03 = 5.99 \\approx 6$, so the molecular formula is $\\ce{C6H12O6}$ — a hexose sugar such as glucose.'
      ],
      a: 'Empirical formula $\\ce{CH2O}$; molecular formula $\\ce{C6H12O6}$.'
    },
    {
      title: 'An iron oxide reduced by hydrogen',
      q: '2.000 g of a black iron oxide is heated in hydrogen until only iron is left, weighing 1.447 g. What is the formula of the oxide?',
      steps: [
        'Oxygen lost: $2.000 - 1.447 = 0.553$ g.',
        'Amounts: Fe $1.447/55.845 = 0.025\\,91$ mol; O $0.553/15.999 = 0.034\\,56$ mol.',
        'Ratio O : Fe $= 0.034\\,56/0.025\\,91 = 1.334$ — a third over a whole number, so multiply by 3: Fe : O = 3 : 4.'
      ],
      a: '$\\ce{Fe3O4}$, magnetite.'
    }
  ],
  quiz: [
    { q: 'Which pair of compounds has the same empirical formula?', choices: ['$\\ce{C2H2}$ and $\\ce{C6H6}$', '$\\ce{H2O}$ and $\\ce{H2O2}$', '$\\ce{CO}$ and $\\ce{CO2}$', '$\\ce{C2H4}$ and $\\ce{C2H6}$'], a: 0,
      why: 'Ethyne and benzene both reduce to $\\ce{CH}$. The other pairs differ in their ratio of atoms, not just in the size of the molecule.' },
    { q: 'After dividing by the smallest amount you get C 1.00 and H 2.49. What is the empirical formula?', choices: ['$\\ce{CH2}$', '$\\ce{C2H5}$', '$\\ce{C4H10}$', '$\\ce{CH3}$'], a: 1,
      why: '2.49 is 2.5 within experimental error, a genuine half: multiply both by 2 to get $\\ce{C2H5}$ (the empirical formula of butane, $\\ce{C4H10}$).' },
    { q: 'A compound\'s empirical and molecular formulas can be the same.', a: true,
      why: 'When the molecular formula cannot be simplified, they coincide: water, carbon dioxide, methane, ethanol ($\\ce{C2H6O}$).' },
    { q: 'A hydrocarbon has the empirical formula $\\ce{CH2}$ and a molar mass of 84.16 g/mol. How many carbon atoms does one molecule contain?', answer: 6,
      why: '$\\ce{CH2}$ is 14.03 g/mol and $84.16/14.03 = 6.00$, so the molecule is $\\ce{C6H12}$ (hexene or cyclohexane).' },
    { q: 'In combustion analysis of a compound of C, H and O, how is the oxygen content found?', choices: ['from the oxygen gas used up', 'from the mass of water alone', 'by difference: sample mass minus the carbon and hydrogen', 'it cannot be found'], a: 2,
      why: 'The sample burns in excess oxygen, so the oxygen in the products comes partly from the gas. The sample\'s own oxygen is whatever mass is not carbon or hydrogen.' }
  ],
  applications: [
    'Characterising every newly made compound: CHN analysis is a standard proof of purity.',
    'Identifying minerals and corrosion products from their composition.',
    'Working out the formulas of hydrates by heating off the water.',
    'Checking fuels and biomass for their carbon and hydrogen content, which fixes their energy and their $\\ce{CO2}$ per kilogram.'
  ],
  history: 'Justus von Liebig made combustion analysis routine in 1831 with his "Kaliapparat", a set of glass bulbs of potash solution that caught the carbon dioxide so that it could be weighed. With it, the formulas of hundreds of organic compounds were settled within a few decades.',
  sim: 'stoich-empirical'
}

);
