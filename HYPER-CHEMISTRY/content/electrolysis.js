/* HYPER-CHEMISTRY · content/electrolysis.js — driving reactions with a current:
 * electrolysis, Faraday's laws, and electroplating and industrial electrolysis. */
Hyper.add(

{
  id: 'electrolysis', parent: 'electrolysis-topic', title: 'Electrolysis', level: 2,
  short: 'Using a power supply to drive a redox reaction that would not go on its own: reduction at the negative cathode, oxidation at the positive anode. It makes aluminium, chlorine and hydrogen, refines copper and charges every rechargeable battery.',
  keywords: ['electrolysis', 'electrolytic cell', 'decomposition voltage', 'overpotential', 'molten salt', 'aqueous electrolysis', 'preferential discharge', 'inert electrode', 'active electrode', 'chlor-alkali', 'Hall–Héroult', 'aluminium smelting', 'water electrolysis', 'green hydrogen', 'Downs cell'],
  prereq: ['galvanic-cells', 'electrode-potentials', 'cell-potential-gibbs'],
  related: ['faradays-laws', 'electroplating', 'batteries-fuel-cells', 'physics:electric-power', 'electronics:power-supplies'],
  body: `
A galvanic cell lets a spontaneous reaction push electrons round a circuit. Connect a power supply the other way and you can do the opposite: push electrons into one electrode, pull them out of the other, and drive a reaction **uphill**, against its free energy. That is **electrolysis**, and the vessel is an **electrolytic cell**.

The naming rule does not change: the **cathode** is where reduction happens and the **anode** where oxidation happens. But now the supply sets the signs. The cathode is connected to the **negative** terminal, which pushes electrons into it; the anode to the **positive** terminal. Cations drift towards the cathode, anions towards the anode.

### Molten salts
The simplest case is a molten salt between inert electrodes. Molten sodium chloride (above 801 °C) contains only $\\ce{Na+}$ and $\\ce{Cl-}$:

$$\\text{cathode: } \\ce{Na+ + e- -> Na} \\qquad \\text{anode: } \\ce{2Cl- -> Cl2 + 2e-}$$

This is how sodium is made industrially, in the Downs cell, with calcium chloride added to lower the melting point. The most reactive metals — lithium, sodium, magnesium, aluminium — are won this way because no chemical reducing agent is both strong enough and cheap enough.

### Aqueous solutions: who wins?
In water there is always a competitor, because water itself can be reduced to hydrogen or oxidised to oxygen:

$$\\ce{2H2O + 2e- -> H2 + 2OH-} \\qquad \\ce{2H2O -> O2 + 4H+ + 4e-}$$

At the **cathode** the species easiest to reduce goes first. Copper and silver ions are deposited as metal; so is zinc, helped by how slowly hydrogen forms on zinc. Sodium, potassium, magnesium and aluminium ions are never reduced from water — hydrogen comes off instead. At the **anode** the species easiest to oxidise goes: a copper anode itself dissolves; at an inert anode (platinum, graphite) sulfate and nitrate are left alone and water gives oxygen, while a concentrated chloride solution gives chlorine.

That last result looks wrong at first sight: water ($E^\\circ$ = 1.23 V) should be oxidised before chloride (1.36 V). It is not, because oxygen evolution has a large **overpotential**: its electrode reaction is slow and needs several tenths of a volt extra to run at a useful rate, while chlorine evolution is fast. Kinetics, not thermodynamics, decides — and the chlor-alkali industry depends on it.

### The voltage you need
The thermodynamic minimum is set by the free energy of the reaction you are forcing, $E_{\\min} = \\Delta G/(nF)$ ([[cell-potential-gibbs]]). Splitting water, $\\ce{2H2O -> 2H2 + O2}$, needs at least 1.23 V. A real cell needs more:

$$V = E_{\\min} + \\eta_{\\text{anode}} + |\\eta_{\\text{cathode}}| + IR$$

— the overpotentials at the two electrodes plus the ohmic drop through the electrolyte, separator and connections. Industrial water electrolysers run at about 1.8–2.0 V per cell, so making a kilogram of hydrogen takes around 50 kWh of electricity, while the free energy it stores is 33 kWh. At the other extreme, electrolysing copper sulfate between **copper** electrodes needs almost no voltage at all — copper dissolves at one electrode and plates out at the other — and that is copper refining, at a few tenths of a volt per cell. The [[physics:electric-power|power]] is simply $VI$, and for a smelter it is counted in hundreds of megawatts.

### Industrial electrolysis
- **Aluminium** (the Hall–Héroult process): alumina dissolved in molten cryolite at about 960 °C, carbon anodes that burn away to $\\ce{CO2}$, 4–4.5 V per cell and 13–15 kWh per kilogram of metal. Smelters are built beside hydroelectric plants for good reason.
- **Chlorine and sodium hydroxide** (chlor-alkali): brine electrolysed in membrane cells at about 3 V, $\\ce{2NaCl + 2H2O -> 2NaOH + Cl2 + H2}$. It supplies the chlorine for PVC and water treatment and the caustic soda for paper and alumina.
- **Hydrogen** from water, in alkaline or PEM electrolysers — "green" hydrogen when the electricity is renewable.
- **Refining and winning metals**: copper, zinc and nickel, and the [[electroplating]] of countless manufactured parts.
- **Charging** any rechargeable battery ([[batteries-fuel-cells]]).
`,
  ideas: [
    'Electrolysis uses electrical energy to drive a non-spontaneous redox reaction.',
    'Reduction still happens at the cathode and oxidation at the anode, but in electrolysis the cathode is negative and the anode positive.',
    'In water, the metal ion or the water is reduced — whichever is easier — and the anion, the anode metal or the water is oxidised.',
    'The minimum voltage is ΔG/nF; overpotentials and the IR drop add to it in a real cell.',
    'Overpotential can reverse the thermodynamic order: concentrated brine gives chlorine, not oxygen.'
  ],
  pitfalls: [
    'The cathode is always negative, in every cell — In electrolysis it is; in a galvanic cell the cathode is the positive terminal. The anode and cathode are defined by oxidation and reduction, not by sign.',
    'Electrolysing sodium chloride solution gives sodium metal — In water, sodium ions are never reduced: the cathode gives hydrogen. Sodium metal needs molten salt.',
    '1.23 V is enough to split water in practice — It is the thermodynamic minimum at zero current. Overpotentials and resistance push a working electrolyser to 1.8–2 V.'
  ],
  formulas: [
    {
      name: 'Minimum (thermodynamic) voltage',
      expr: 'Emin = dG/(n*F)', tex: 'E_{\\min} = \\frac{\\Delta G}{nF}',
      vars: {
        Emin: { name: 'minimum cell voltage', q: 'voltage', unit: 'V', tex: 'E_{\\min}' },
        dG: { name: 'Gibbs energy of the reaction being forced (positive)', q: 'molarenergy', unit: 'kJ/mol', value: 237.1, tex: '\\Delta G' },
        n: { name: 'moles of electrons per mole of reaction', value: 2, int: true },
        F: { const: 'F' }
      },
      note: 'Defaults: splitting one mole of liquid water, $\\ce{H2O -> H2 + 1/2 O2}$, at 25 °C: 1.23 V.',
      practice: { unknowns: ['Emin', 'dG'] },
      stories: {
        Emin: 'A reaction with $\\Delta G$ = {dG} per mole transfers {n} electrons per mole. What is the smallest voltage that can drive it by electrolysis?'
      }
    },
    {
      name: 'Cell voltage in practice',
      expr: 'V = Emin + eta + I*R', tex: 'V = E_{\\min} + \\eta + IR',
      vars: {
        V: { name: 'voltage the supply must provide', q: 'voltage', unit: 'V' },
        Emin: { name: 'thermodynamic minimum', q: 'voltage', unit: 'V', value: 1.23, tex: 'E_{\\min}' },
        eta: { name: 'sum of the electrode overpotentials', q: 'voltage', unit: 'V', value: 0.5 },
        I: { name: 'current', q: 'current', unit: 'A', value: 0.5 },
        R: { name: 'resistance of electrolyte, separator and leads', q: 'resistance', unit: 'Ω', value: 0.4 }
      },
      note: 'Defaults: a small water electrolyser. The overpotential itself grows with current (roughly with its logarithm), so this is a snapshot at one current, not a model of the whole curve.',
      stories: {
        V: 'Water ({Emin} minimum) is electrolysed at {I} through a cell of resistance {R}, with {eta} of overpotential. What voltage must the supply give?',
        R: 'A cell needs {V} at {I}; its minimum voltage is {Emin} and the overpotentials total {eta}. What is its internal resistance?'
      }
    },
    {
      name: 'Electrical energy per kilogram of product',
      expr: 'w = z*F*V/(M*eff)', tex: 'w = \\frac{zFV}{M\\,\\eta_I}',
      vars: {
        w: { name: 'electrical energy per unit mass of product', q: 'specificenergy', unit: 'kWh/kg' },
        z: { name: 'electrons per atom or molecule produced', value: 3, int: true },
        F: { const: 'F' },
        V: { name: 'cell voltage', q: 'voltage', unit: 'V', value: 4.2 },
        M: { name: 'molar mass of the product', q: 'molarmass', unit: 'g/mol', value: 26.98 },
        eff: { name: 'current efficiency', value: 0.95, min: 0.01, max: 1, tex: '\\eta_I' }
      },
      note: 'Defaults: a Hall–Héroult aluminium cell, about 13 kWh/kg. For hydrogen use $z = 2$, $M$ = 2.016 g/mol and a cell voltage near 1.9 V.',
      practice: { unknowns: ['w', 'V'] },
      stories: {
        w: 'A smelter makes a metal ($M$ = {M}, {z} electrons per atom) at {V} per cell with a current efficiency of {eff}. How much electrical energy does each kilogram take?',
        V: 'A plant making a product with $M$ = {M} and {z} electrons per particle uses {w} at a current efficiency of {eff}. At what cell voltage does it run?'
      }
    }
  ],
  examples: [
    {
      title: 'Three ways to electrolyse sodium chloride',
      q: 'What forms at each electrode when sodium chloride is electrolysed (a) molten, (b) as concentrated brine, (c) as a very dilute solution, all with inert electrodes?',
      steps: [
        '(a) Molten: only $\\ce{Na+}$ and $\\ce{Cl-}$ are present. Sodium metal at the cathode, chlorine at the anode.',
        '(b) Brine: at the cathode water is reduced, $\\ce{2H2O + 2e- -> H2 + 2OH-}$ — sodium ions are far harder to reduce. At the anode chloride is oxidised to chlorine, thanks to the high overpotential for oxygen. Sodium hydroxide is left in solution.',
        '(c) Very dilute: hydrogen at the cathode again; at the anode there is now so little chloride that water is oxidised and mostly oxygen forms.'
      ],
      a: '(a) Na and Cl₂; (b) H₂, Cl₂ and NaOH solution; (c) H₂ and mainly O₂.'
    },
    {
      title: 'The electricity in a kilogram of hydrogen',
      q: 'An electrolyser runs at 1.90 V per cell with 100 % current efficiency. How much electrical energy does it use per kilogram of hydrogen, and how does that compare with the energy in the hydrogen?',
      steps: [
        'Moles of $\\ce{H2}$: $1000/2.016 = 496$ mol, each needing 2 electrons: $Q = 2 \\times 496 \\times 96\\,485 = 9.57 \\times 10^{7}$ C.',
        'Energy: $QV = 9.57 \\times 10^{7} \\times 1.90 = 1.82 \\times 10^{8}$ J $= 50.5$ kWh.',
        'At the thermodynamic minimum of 1.23 V it would be 32.7 kWh (the free energy); at the thermoneutral 1.48 V, 39.4 kWh (the heat of combustion).',
        'So about $39.4/50.5 = 78$ % of the electricity ends up as the hydrogen\'s heat of combustion; the rest heats the electrolyser.'
      ],
      a: 'About 50 kWh per kilogram, of which 78 % is stored in the hydrogen (counted by its heat of combustion).'
    }
  ],
  quiz: [
    { q: 'In an electrolytic cell, the anode is…', choices: ['positive, and oxidation happens there', 'negative, and oxidation happens there', 'positive, and reduction happens there', 'negative, and reduction happens there'], a: 0,
      why: 'Oxidation always happens at the anode. In electrolysis the supply pulls electrons out of it, so it is connected to the positive terminal.' },
    { q: 'Aqueous potassium sulfate is electrolysed between platinum electrodes. What forms?', choices: ['hydrogen at the cathode, oxygen at the anode', 'potassium at the cathode, sulfur dioxide at the anode', 'potassium at the cathode, oxygen at the anode', 'hydrogen at the cathode, sulfur at the anode'], a: 0,
      why: 'Potassium ions are far harder to reduce than water, and sulfate is far harder to oxidise than water. So water is split: hydrogen at the cathode, oxygen at the anode; the salt only carries the current.' },
    { q: 'Sodium metal can be made by electrolysing aqueous sodium chloride with a platinum cathode.', a: false,
      why: 'At −2.71 V, sodium ions are much harder to reduce than water (−0.83 V at pH 14). Any sodium formed would react with water at once. Sodium needs molten salt.' },
    { q: 'Splitting water needs $\\Delta G$ = +237.1 kJ per mole of $\\ce{H2O}$, with 2 electrons per molecule. What is the minimum voltage, in volts?', answer: 1.23, unit: 'V',
      why: '$E_{\\min} = \\Delta G/nF = 237\\,100/(2 \\times 96\\,485) = 1.23$ V.' },
    { q: 'Why does concentrated brine give chlorine rather than oxygen at the anode, although $E^\\circ(\\ce{O2/H2O})$ = 1.23 V is below $E^\\circ(\\ce{Cl2/Cl-})$ = 1.36 V?', choices: ['oxygen evolution has a much larger overpotential', 'chloride is always easier to oxidise than water', 'oxygen reacts with the chloride to form chlorine', 'the anode is made of chlorine'], a: 0,
      why: 'Thermodynamics slightly favours oxygen, but its electrode reaction is sluggish and needs a large extra voltage, while chlorine forms easily. At the working voltage chlorine wins — a kinetic, not a thermodynamic, preference.' }
  ],
  applications: [
    'Aluminium, magnesium, sodium and lithium production from molten salts.',
    'Chlorine and caustic soda from brine (chlor-alkali), and hydrogen from water.',
    'Refining copper to 99.99 % and winning zinc and copper from leach solutions.',
    'Charging rechargeable batteries, and electroplating.'
  ],
  history: 'Humphry Davy isolated potassium and sodium in 1807 by electrolysing their molten hydroxides with a large voltaic pile. In 1886 Charles Martin Hall in the United States and Paul Héroult in France independently invented the electrolysis of alumina in molten cryolite, which turned aluminium from a precious metal into a cheap one.',
  sim: 'ec-electrolysis'
},

{
  id: 'faradays-laws', parent: 'electrolysis-topic', title: 'Faraday\'s laws of electrolysis', level: 2,
  short: 'The amount of substance produced at an electrode is proportional to the charge passed: n = Q/(zF), with Q = It. One faraday, 96 485 C, is the charge of one mole of electrons.',
  keywords: ['Faraday\'s laws', 'Faraday constant', 'coulomb', 'charge', 'mole of electrons', 'mass deposited', 'gas volume', 'current efficiency', 'coulometer', 'electrochemical equivalent', 'Q = It', 'm = ItM/zF'],
  prereq: ['electrolysis', 'mole-concept', 'physics:electric-current'],
  related: ['electroplating', 'batteries-fuel-cells', 'corrosion', 'ideal-gas-law', 'molar-mass', 'electronics:charge-and-current'],
  body: `
Every atom of copper deposited on a cathode took exactly two electrons; every molecule of hydrogen took two; every atom of silver, one. So counting electrons counts atoms. The link between the electrician's quantity, charge, and the chemist's, the [[mole-concept|mole]], is the **Faraday constant** — the charge on one mole of electrons:

$$F = N_A e = 6.022 \\times 10^{23}\\ \\mathrm{mol^{-1}} \\times 1.602 \\times 10^{-19}\\ \\mathrm{C} = 96\\,485\\ \\mathrm{C/mol}$$

A steady current $I$ flowing for a time $t$ carries a charge $Q = It$ ([[physics:electric-current]]). That is $Q/F$ moles of electrons. If each particle of product needs $z$ electrons, the amount and mass formed are

$$n = \\frac{It}{zF} \\qquad m = \\frac{ItM}{zF}$$

### The two laws
Michael Faraday found these relations by experiment in 1833–34, sixty years before the electron was discovered:

1. The mass of substance formed at an electrode is **proportional to the charge** passed through the cell.
2. For the same charge, the masses of different substances are proportional to their **molar mass divided by the number of electrons** per particle, $M/z$ — once called the equivalent weight.

Pass one faraday through three cells in series holding silver nitrate, copper sulfate and molten alumina, and you get one mole of silver (107.9 g), half a mole of copper (31.8 g) and a third of a mole of aluminium (8.99 g).

### A feeling for the numbers
A faraday is a lot of charge: 96 485 C is 26.8 ampere-hours — the charge of a small car battery — to deposit one mole of silver. The other way round, 1 A flowing for 1 h deposits 1.19 g of copper, or makes 0.0187 mol of hydrogen: 456 mL at 25 °C and 1 atm, with 228 mL of oxygen at the anode. An aluminium smelting cell running at 300 000 A makes about 2.3 tonnes of metal a day.

### Gases
For a gas, turn moles into volume with the [[ideal-gas-law]], $V = nRT/p$. Electrolysing water gives two volumes of hydrogen for each volume of oxygen, because each $\\ce{H2}$ needs two electrons and each $\\ce{O2}$ four:

$$\\text{cathode: } \\ce{4H+ + 4e- -> 2H2} \\qquad \\text{anode: } \\ce{2H2O -> O2 + 4H+ + 4e-}$$

### Current efficiency
Faraday's law is exact for the charge that goes into the reaction of interest, but in practice some current drives side reactions: hydrogen evolution during nickel or chromium plating, dissolved aluminium being re-oxidised in a smelter. The **current efficiency** is the fraction of the charge that produced the wanted product — about 95 % in a good aluminium cell, 95 % or more in copper refining, only 10–25 % in hard chromium plating. It is found by weighing the product and comparing with $It/zF$.

### Counting charge with chemistry
Before accurate ammeters, charge was measured with a **coulometer**: a silver or copper cell placed in series with the circuit and weighed before and after. In 1908 the "international ampere" was even defined as the current that deposits 1.118 mg of silver per second. And since $F = N_A e$, careful electrolysis combined with the charge of the electron gave one of the best early values of the [[mole-concept|Avogadro constant]].

> [!tip] Set out every electrolysis calculation as a chain: current and time → charge ($It$) → moles of electrons ($÷F$) → moles of product ($÷z$) → mass ($×M$) or gas volume ($×RT/p$).
`,
  ideas: [
    'One faraday, F = 96 485 C/mol, is the charge of one mole of electrons (26.8 A·h).',
    'Charge passed is Q = It; moles of product are Q/(zF), with z electrons per particle.',
    'The same charge gives masses proportional to M/z for different products.',
    'Gas volumes follow from the moles with the ideal gas law: water gives two volumes of H₂ per volume of O₂.',
    'Current efficiency is the fraction of the charge that makes the wanted product.'
  ],
  pitfalls: [
    'Forgetting z — Copper needs two electrons per atom, aluminium three. Using Q/F alone doubles or triples the answer.',
    'Using minutes or hours in Q = It without converting — With I in amperes, t must be in seconds to get coulombs (or use A·h and 26.8 A·h per mole of electrons).',
    'The mass deposited depends on the voltage — For a given charge it does not. Voltage decides whether the reaction goes and how much energy it costs, not how much product forms.'
  ],
  formulas: [
    {
      name: 'Faraday\'s law: mass deposited',
      expr: 'm = I*t*M/(z*F)', tex: 'm = \\frac{I t M}{z F}',
      vars: {
        m: { name: 'mass of product', q: 'mass', unit: 'g' },
        I: { name: 'current', q: 'current', unit: 'A', value: 2 },
        t: { name: 'time', q: 'time', unit: 'min', value: 30 },
        M: { name: 'molar mass of the product', q: 'molarmass', unit: 'g/mol', value: 63.546 },
        z: { name: 'electrons per atom or molecule', value: 2, int: true },
        F: { const: 'F' }
      },
      note: 'Defaults: copper from copper sulfate, 2 A for half an hour. Multiply by the current efficiency when it is below 100 %.',
      practice: { unknowns: ['m', 't', 'I'] },
      stories: {
        m: 'A current of {I} flows for {t} through a solution of a metal whose ions each take {z} electrons ($M$ = {M}). What mass of metal is deposited?',
        t: 'How long must {I} flow to deposit {m} of a metal ($M$ = {M}, {z} electrons per atom)?',
        I: 'What current deposits {m} of a metal ($M$ = {M}, {z} electrons per atom) in {t}?'
      }
    },
    {
      name: 'Amount of product from the charge',
      expr: 'n = Q/(z*F)', tex: 'n = \\frac{Q}{zF}',
      vars: {
        n: { name: 'amount of product', q: 'amount', unit: 'mol' },
        Q: { name: 'charge passed', q: 'charge', unit: 'C', value: 3600 },
        z: { name: 'electrons per particle of product', value: 2, int: true },
        F: { const: 'F' }
      },
      note: 'Defaults: 1 A for one hour making hydrogen ($z = 2$): 0.0187 mol.',
      practice: { unknowns: ['n', 'Q'] },
      stories: {
        n: 'A charge of {Q} passes through a cell whose cathode product needs {z} electrons per particle. How many moles form?',
        Q: 'What charge is needed to make {n} of a product that needs {z} electrons per particle?'
      }
    },
    {
      name: 'Volume of gas evolved',
      expr: 'V = I*t*R*T/(z*F*p)', tex: 'V = \\frac{I t}{z F}\\,\\frac{RT}{p}',
      vars: {
        V: { name: 'volume of gas', q: 'volume', unit: 'mL' },
        I: { name: 'current', q: 'current', unit: 'A', value: 1 },
        t: { name: 'time', q: 'time', unit: 'h', value: 1 },
        z: { name: 'electrons per gas molecule (H₂: 2, O₂: 4, Cl₂: 2)', value: 2, int: true },
        F: { const: 'F' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 101.325 }
      },
      note: 'Defaults: hydrogen from 1 A for one hour at 25 °C and 1 atm, 456 mL. Oxygen ($z = 4$) gives half that volume.',
      practice: { unknowns: ['V', 't'] },
      stories: {
        V: 'Water is electrolysed with {I} for {t}. What volume of gas with {z} electrons per molecule is collected at {T} and {p}?',
        t: 'How long must {I} flow to collect {V} of a gas needing {z} electrons per molecule, at {T} and {p}?'
      }
    }
  ],
  derivation: {
    title: 'From current to mass',
    steps: [
      { text: 'A steady current $I$ for a time $t$ carries a charge', tex: 'Q = It' },
      { text: 'Each mole of electrons carries $F = N_A e$, so the moles of electrons are', tex: 'n_e = \\frac{Q}{F} = \\frac{It}{F}' },
      { text: 'Each particle of product takes $z$ electrons:', tex: 'n = \\frac{n_e}{z} = \\frac{It}{zF}' },
      { text: 'Multiply by the molar mass:', tex: 'm = nM = \\frac{ItM}{zF}' }
    ]
  },
  examples: [
    {
      title: 'Copper from a bench power supply',
      q: 'A current of 2.00 A passes through copper sulfate solution for 30.0 minutes. What mass of copper is deposited on the cathode?',
      steps: [
        'Charge: $Q = 2.00 \\times 30.0 \\times 60 = 3600$ C.',
        'Moles of electrons: $3600/96\\,485 = 0.03731$ mol; copper needs 2 per atom: $0.01866$ mol of $\\ce{Cu}$.',
        'Mass: $0.01866 \\times 63.55 = 1.19$ g.'
      ],
      a: '1.19 g of copper.'
    },
    {
      title: 'Collecting the gases from water',
      q: 'Dilute sulfuric acid is electrolysed at 0.500 A for 20.0 minutes. What volumes of hydrogen and oxygen are collected at 25 °C and 1 atm?',
      steps: [
        'Charge: $0.500 \\times 1200 = 600$ C, or $600/96\\,485 = 6.22 \\times 10^{-3}$ mol of electrons.',
        'Hydrogen, 2 electrons per molecule: $3.11 \\times 10^{-3}$ mol. Oxygen, 4 per molecule: $1.55 \\times 10^{-3}$ mol.',
        'At 25 °C and 1 atm a mole of gas occupies $RT/p = 24.47$ L, so hydrogen: $3.11 \\times 10^{-3} \\times 24.47 = 0.0761$ L; oxygen: $0.0380$ L.'
      ],
      a: '76 mL of hydrogen and 38 mL of oxygen.'
    },
    {
      title: 'A day in an aluminium smelter',
      q: 'An aluminium cell runs at 300 kA with 95 % current efficiency. How much aluminium does it make per day?',
      steps: [
        'Charge per day: $300\\,000 \\times 86\\,400 = 2.59 \\times 10^{10}$ C.',
        'Aluminium needs 3 electrons: $n = 0.95 \\times 2.59 \\times 10^{10}/(3 \\times 96\\,485) = 8.51 \\times 10^{4}$ mol.',
        'Mass: $8.51 \\times 10^{4} \\times 26.98 = 2.30 \\times 10^{6}$ g.'
      ],
      a: 'About 2.3 tonnes a day from one cell.'
    }
  ],
  quiz: [
    { q: 'What mass of silver (107.87 g/mol) is deposited by 0.500 A in 1.00 h, in grams?', answer: 2.01, unit: 'g',
      why: '$Q = 0.500 \\times 3600 = 1800$ C; $n = 1800/96\\,485 = 0.01866$ mol (one electron per silver atom); $m = 0.01866 \\times 107.87 = 2.01$ g.' },
    { q: 'The same current flows through silver nitrate and copper sulfate cells in series. The mass of silver deposited, compared with the mass of copper, is about…', choices: ['3.4 times as large', 'the same', '1.7 times as large', 'half as large'], a: 0,
      why: 'Masses go as $M/z$: silver $107.87/1$, copper $63.55/2 = 31.77$. The ratio is 3.40.' },
    { q: 'Doubling the current while halving the time deposits the same mass.', a: true,
      why: 'The mass depends only on the charge $Q = It$, which is unchanged.' },
    { q: 'In the electrolysis of water, why is the volume of hydrogen twice the volume of oxygen?', choices: ['each O₂ molecule needs 4 electrons and each H₂ only 2', 'hydrogen molecules are lighter', 'hydrogen expands more when it is warmed', 'the cathode has twice the area of the anode'], a: 0,
      why: 'The same charge passes through both electrodes. Four electrons make two $\\ce{H2}$ at the cathode and one $\\ce{O2}$ at the anode, and equal moles of gas occupy equal volumes.' },
    { q: 'How long, in hours, must 5.0 A flow to deposit 10.0 g of nickel (58.69 g/mol) from a solution of $\\ce{Ni^2+}$?', answer: 1.83, unit: 'h',
      why: '$t = mzF/(MI) = 10.0 \\times 2 \\times 96\\,485/(58.69 \\times 5.0) = 6576$ s $= 1.83$ h.' }
  ],
  applications: [
    'Setting plating times and currents, and estimating metal consumption in plating shops.',
    'Sizing electrolysers and smelters: tonnes per day from the current.',
    'The life of sacrificial anodes, and battery capacity from the mass of active material.',
    'Coulometric titrations, in which a measured charge generates the titrant with great accuracy.'
  ],
  history: 'Michael Faraday published his laws of electrolysis in 1833–34 and, with the help of William Whewell, gave us the words electrode, anode, cathode, electrolyte and ion.',
  sim: { id: 'ec-electrolysis', params: { mode: 'cu' } }
},

{
  id: 'electroplating', parent: 'electrolysis-topic', title: 'Electroplating and industrial electrolysis', level: 2,
  short: 'Coating a part with metal by making it the cathode in a solution of that metal\'s ions. Current density and time set the thickness through Faraday\'s law; the bath, the current distribution and the cleaning set the quality.',
  keywords: ['electroplating', 'electrodeposition', 'current density', 'A/dm²', 'plating thickness', 'nickel plating', 'chrome plating', 'hard chrome', 'zinc plating', 'gold plating', 'copper plating', 'throwing power', 'hydrogen embrittlement', 'electrorefining', 'electrowinning', 'anodising', 'electroforming'],
  prereq: ['faradays-laws', 'electrolysis', 'physics:density'],
  related: ['corrosion', 'complex-ion-equilibria', 'electrode-potentials', 'metallic-bonding'],
  body: `
To nickel-plate a steel bracket, hang it as the **cathode** in a bath of nickel sulfate and nickel chloride, hang nickel bars as the **anode**, and pass a current. Nickel ions are reduced on the bracket while the bars dissolve and replace them:

$$\\text{cathode (the part): } \\ce{Ni^2+ + 2e- -> Ni} \\qquad \\text{anode: } \\ce{Ni -> Ni^2+ + 2e-}$$

The bath stays the same and nickel is carried from the bars to the part. With an **insoluble anode** — lead alloy for chromium, platinised titanium for gold — the anode gives off oxygen instead, and the metal must be topped up as salts.

### How thick?
[[faradays-laws|Faraday's law]] gives the mass; dividing by density and area gives the thickness. Platers work with the **current density** $j$, the current per unit area of the part, usually quoted in A/dm² (1 A/dm² = 100 A/m²), because that is what the surface actually experiences:

$$\\delta = \\frac{j\\,t\\,\\eta\\,M}{zF\\rho}$$

where $\\eta$ is the current efficiency and $\\rho$ the metal's [[physics:density|density]]. For nickel ($M$ = 58.69 g/mol, $z = 2$, $\\rho$ = 8.91 g/cm³), 1 A/dm² at 100 % efficiency deposits 12.3 µm per hour. A nickel bath typically runs at 2–5 A/dm², so a 25 µm layer takes roughly half an hour to an hour.

| Coating | What it is for | Typical thickness |
|---|---|---|
| Zinc on steel | sacrificial [[corrosion]] protection, usually with a passivate finish | 5–25 µm |
| Nickel | corrosion and wear resistance; base for chromium | 5–40 µm |
| Decorative chromium | hard, bright, tarnish-free top layer over nickel | 0.2–0.5 µm |
| Hard chromium | wear resistance on shafts, hydraulic rams, moulds | 20–500 µm |
| Copper | conductivity on printed circuit boards; levelling underlayer | 5–50 µm |
| Gold over nickel | low, stable contact resistance on connectors | 0.1–2 µm |
| Silver | conductivity on busbars and switch contacts | 2–25 µm |

### Current efficiency and hydrogen
Water can be reduced at the cathode too, and charge that makes hydrogen deposits no metal. Acid copper and silver baths run close to 100 %, nickel around 95 %, but the hexavalent baths used for hard chromium only 10–25 %: most of their current makes hydrogen, which is why chromium plating is slow and power-hungry. The hydrogen has a second, dangerous effect: hydrogen atoms diffuse into high-strength steel and can make it crack under load hours or days later. High-strength fasteners and springs are therefore **baked**, typically at around 200 °C for several hours, soon after plating.

### Even thickness: current distribution
Current takes the easiest path. Edges, corners and points facing the anode receive more of it and plate thicker (the "dog-bone" profile); recesses, blind holes and the insides of tubes receive less. A bath that evens this out has good **throwing power**; platers also use shields, auxiliary anodes and "thieves" — sacrificial cathodes near sharp edges. Additives such as brighteners and levellers control the grain size and give a bright deposit straight from the tank. Many gold, silver and zinc baths use **complex ions** ($\\ce{[Au(CN)2]-}$, $\\ce{[Zn(OH)4]^2-}$) that release their metal slowly and give fine, adherent deposits ([[complex-ion-equilibria]]).

### Preparation is most of the job
A deposit only sticks to a clean, oxide-free surface: degreasing, alkaline electrocleaning, an acid dip to remove oxide, and rinses between every step. Most plating failures — blisters, peeling, patchy coverage — start in the cleaning line, not in the plating tank.

### Relatives of plating
- **Electrorefining.** Impure copper anodes dissolve and pure copper (99.99 %) plates onto starter sheets. Less active impurities such as silver, gold and platinum metals fall to the bottom as anode slime, which is worth recovering.
- **Electrowinning.** Metal is plated from a leach solution onto cathodes with insoluble anodes; most zinc and much of the world's copper is produced this way.
- **Anodising** is the reverse of plating: the aluminium part is the **anode**, and the current grows a thick, porous oxide layer that can be dyed and sealed.
- **Electroforming** plates a thick layer onto a mould and then removes the mould — precision moulds, fine meshes and the stampers for pressing discs are made this way.
`,
  ideas: [
    'The part to be plated is the cathode; metal ions from the bath are reduced on it.',
    'Thickness = j t η M / (z F ρ): proportional to current density, time and efficiency.',
    'Current efficiency below 100 % means some charge makes hydrogen, which can also embrittle high-strength steel.',
    'Current concentrates on edges and points, so thickness is uneven unless the bath and the jigging even it out.',
    'Refining, winning, anodising and electroforming use the same electrode reactions for other ends.'
  ],
  pitfalls: [
    'The part is the anode because it gains the metal — It gains metal by reduction, so it is the cathode (connected to the negative terminal). An anodised part is the anode because it is oxidised.',
    'Plating thickness is the same everywhere on the part — Current density, and so thickness, is higher at edges and lower in recesses; the nominal figure is an average.',
    'A higher current always gives a faster, better coating — Above a limit the deposit becomes rough, burnt or powdery and efficiency falls; each bath has a working range of current density.'
  ],
  formulas: [
    {
      name: 'Plating thickness from current density',
      expr: 'd = j*t*eff*M/(z*F*rho)', tex: '\\delta = \\frac{j\\,t\\,\\eta\\,M}{zF\\rho}',
      vars: {
        d: { name: 'thickness deposited', q: 'length', unit: 'µm', tex: '\\delta' },
        j: { name: 'current density (1 A/dm² = 100 A/m²)', q: 'currentdensity', unit: 'A/m²', value: 200 },
        t: { name: 'plating time', q: 'time', unit: 'min', value: 30 },
        eff: { name: 'current efficiency', value: 0.95, min: 0.01, max: 1, tex: '\\eta' },
        M: { name: 'molar mass of the metal', q: 'molarmass', unit: 'g/mol', value: 58.693 },
        z: { name: 'electrons per atom deposited', value: 2, int: true },
        F: { const: 'F' },
        rho: { name: 'density of the metal', q: 'density', unit: 'g/cm³', value: 8.908 }
      },
      note: 'Defaults: a Watts nickel bath at 2 A/dm² for 30 minutes, about 12 µm. Copper: 63.55 g/mol, 8.96 g/cm³, $z = 2$. Zinc: 65.38, 7.14, 2. Silver: 107.87, 10.49, 1. Gold from cyanide: 196.97, 19.32, 1.',
      practice: { unknowns: ['d', 't', 'j'] },
      stories: {
        d: 'A part is plated at {j} for {t} with a current efficiency of {eff}. The metal has $M$ = {M}, {z} electrons per atom and density {rho}. How thick is the coating?',
        t: 'How long does it take to plate {d} of a metal ($M$ = {M}, {z} electrons per atom, density {rho}) at {j} with an efficiency of {eff}?',
        j: 'A coating of {d} is needed in {t}. What current density is required for a metal with $M$ = {M}, {z} electrons per atom, density {rho} and an efficiency of {eff}?'
      }
    },
    {
      name: 'Current for a part',
      expr: 'I = j*Ap', tex: 'I = jA',
      vars: {
        I: { name: 'current the rectifier must supply', q: 'current', unit: 'A' },
        j: { name: 'current density', q: 'currentdensity', unit: 'A/m²', value: 300 },
        Ap: { name: 'surface area being plated', q: 'area', unit: 'cm²', value: 6000, tex: 'A' }
      },
      note: 'Defaults: 3 A/dm² on 60 dm² of parts: 180 A. Count every surface the bath can reach, including the jig contacts.',
      stories: {
        I: 'A rack of parts with a total area of {Ap} is plated at {j}. What current must the rectifier deliver?',
        Ap: 'A rectifier delivers {I} at a current density of {j}. How much surface area can be plated at once?'
      }
    }
  ],
  examples: [
    {
      title: 'Nickel-plating a batch of brackets',
      q: 'A rack of steel brackets has a total area of 60 dm². They are to receive 25 µm of nickel at 3.0 A/dm² with 95 % current efficiency. Find the current, the time and the mass of nickel used.',
      steps: [
        'Current: $I = 3.0 \\times 60 = 180$ A.',
        { text: 'Deposition rate, with $j$ = 300 A/m² and one hour:', tex: '\\delta = \\frac{300 \\times 3600 \\times 0.95 \\times 0.05869}{2 \\times 96\\,485 \\times 8908}\\ \\mathrm{m} = 35.0\\ \\mathrm{\\mu m\\ per\\ hour}' },
        'Time for 25 µm: $25/35.0 = 0.714$ h, about 43 minutes.',
        'Nickel deposited: area × thickness × density $= 0.60\\ \\mathrm{m^2} \\times 25 \\times 10^{-6}\\ \\mathrm{m} \\times 8908\\ \\mathrm{kg/m^3} = 0.134$ kg.'
      ],
      a: '180 A for about 43 minutes, depositing 134 g of nickel.'
    },
    {
      title: 'Gold on a connector',
      q: 'Connector contacts need 0.76 µm of gold (a common specification) from a gold(I) cyanide bath at 0.50 A/dm² and 90 % efficiency. How long does it take, and how much gold is on each square centimetre?',
      steps: [
        { text: 'Rate, with $z = 1$, $M$ = 196.97 g/mol, $\\rho$ = 19.32 g/cm³ and $j$ = 50 A/m²:', tex: '\\frac{\\delta}{t} = \\frac{50 \\times 0.90 \\times 0.19697}{96\\,485 \\times 19\\,320}\\ \\mathrm{m/s} = 4.75\\ \\mathrm{nm/s} = 0.285\\ \\mathrm{\\mu m/min}' },
        'Time: $0.76/0.285 = 2.7$ minutes.',
        'Gold per cm²: $0.76 \\times 10^{-4}\\ \\mathrm{cm} \\times 19.32\\ \\mathrm{g/cm^3} = 1.47\\ \\mathrm{mg}$. Plating only the contact area, not the whole part, is where the savings are.'
      ],
      a: 'About 2.7 minutes; 1.5 mg of gold per square centimetre.'
    }
  ],
  quiz: [
    { q: 'In electroplating, the part to be coated is…', choices: ['the cathode, connected to the negative terminal', 'the anode, connected to the positive terminal', 'either, depending on the metal', 'not connected: the metal is deposited chemically'], a: 0,
      why: 'Metal ions gain electrons (reduction) on the part, so it is the cathode, and in electrolysis the cathode is the negative electrode.' },
    { q: 'Copper (63.55 g/mol, $z = 2$, 8.96 g/cm³) is plated at 2.0 A/dm² with 100 % efficiency. How thick is the layer after 1.00 h, in µm?', answer: 26.5, unit: 'µm',
      why: '$\\delta = 200 \\times 3600 \\times 0.06355/(2 \\times 96\\,485 \\times 8960) = 2.65 \\times 10^{-5}$ m = 26.5 µm.' },
    { q: 'Hard chromium plating is slow mainly because most of the current makes hydrogen instead of chromium.', a: true,
      why: 'Hexavalent chromium baths have current efficiencies of only 10–25 %, and each chromium atom needs six electrons. Most of the charge evolves hydrogen.' },
    { q: 'Why do the edges and corners of a plated part end up with a thicker coating than its recesses?', choices: ['the current density is higher there', 'metal ions are pulled to sharp points by gravity', 'the bath is warmer at edges', 'edges are cleaner than recesses'], a: 0,
      why: 'The electric field, and with it the current, concentrates at edges and points that stand out towards the anode. Recesses are shielded and receive less current.' },
    { q: 'In anodising, the aluminium part is…', choices: ['the anode, where an oxide layer grows on it', 'the cathode, where aluminium is deposited on it', 'a spectator; the oxide comes from the bath', 'the salt bridge between two tanks'], a: 0,
      why: 'Anodising oxidises the aluminium surface itself to a thick aluminium oxide film, so the part is the anode — the reverse of plating.' }
  ],
  applications: [
    'Zinc-plated fasteners, nickel–chromium on taps and trim, hard chromium on hydraulic rams and shafts.',
    'Copper plating of printed circuit boards and the through-holes that connect their layers.',
    'Gold and silver on connectors, switch contacts and jewellery.',
    'Copper electrorefining, zinc electrowinning, anodised aluminium and electroformed precision parts.'
  ],
  sim: 'ec-plating'
}

);
