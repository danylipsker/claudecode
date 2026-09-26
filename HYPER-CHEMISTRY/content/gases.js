/* HYPER-CHEMISTRY · content/gases.js — the gas laws, the ideal gas law in the chemist's
 * units, partial pressures, the molecular picture, effusion and real gases.
 * The physicist's view lives in Hyper Physics (physics:ideal-gas-law,
 * physics:kinetic-theory-gases, physics:maxwell-boltzmann); these pages link across. */
Hyper.add(

{
  id: 'gas-laws', parent: 'gases', title: 'The gas laws', level: 1,
  short: 'Squeeze a gas and its pressure rises; warm it and it expands or pushes harder. Boyle\'s, Charles\'s, the pressure law and Avogadro\'s law describe how pressure, volume, temperature and amount move together.',
  keywords: ['Boyle\'s law', 'Charles\'s law', 'Gay-Lussac\'s law', 'pressure law', 'Amontons', 'Avogadro\'s law', 'combined gas law', 'absolute zero', 'gauge pressure', 'absolute pressure', 'kelvin', 'syringe', 'tyre pressure'],
  prereq: ['physics:pressure', 'physics:temperature', 'mole-concept'],
  related: ['ideal-gas-law', 'kinetic-molecular-theory', 'partial-pressures', 'physics:ideal-gas-law', 'math:fractions-ratios', 'math:linear-functions'],
  body: `
Seal the tip of a plastic syringe with your finger and push the plunger. The air inside fights back harder the further you push: halve its volume and its pressure doubles. Hold the same syringe in hot water and the plunger creeps outwards; put it in the freezer and it is drawn in. A gas has no volume of its own — it fills whatever it is given — so its **pressure** $P$, **volume** $V$, **temperature** $T$ and **amount** $n$ are tied together, and changing one moves the others.

Four simple laws, found one at a time between 1662 and 1811, each hold two of the four quantities fixed:

| Law | Held fixed | Relation | In words |
|---|---|---|---|
| Boyle | $n$, $T$ | $PV = \\text{const}$ | squeeze it and the pressure rises in proportion |
| Charles | $n$, $P$ | $V/T = \\text{const}$ | warm it and it expands in proportion to the kelvin temperature |
| Pressure law (Gay-Lussac, Amontons) | $n$, $V$ | $P/T = \\text{const}$ | warm it in a rigid container and the pressure rises |
| Avogadro | $P$, $T$ | $V/n = \\text{const}$ | twice the gas takes twice the room |

For a fixed amount of gas the first three combine into the **combined gas law**,

$$\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}$$

which covers any change of state; cancel whatever is held constant to get back the single laws. All four are special cases of the [[ideal-gas-law]], $PV = nRT$.

### Why temperature must be in kelvin
Plot the volume of a gas against its Celsius temperature at constant pressure and you get a straight line — but it does **not** pass through $0\\ ^{\\circ}\\mathrm{C}$. Extend the lines for any gas, any amount, any pressure and they all meet the axis at the same point, $-273.15\\ ^{\\circ}\\mathrm{C}$. That is **absolute zero**, and measuring from it gives the kelvin scale, on which $V \\propto T$ holds exactly. Warming a gas from 10 °C to 20 °C does not double its volume; it raises it by $293.15/283.15$, about 3.5 %.

> [!warn] Use **absolute** pressure. A tyre gauge reads the pressure *above* the atmosphere (gauge pressure). The gas laws need the total: add about 1.01 bar (14.7 psi) at sea level.

### Where you meet them
- **Diving.** Every 10 m of seawater adds about 1 atm. Air breathed at 20 m (3 atm) expands threefold on the way up, which is why divers must never hold their breath while ascending.
- **Tyres** lose pressure on cold mornings and gain it on a hot motorway — the pressure law, not a leak.
- **Hot-air balloons** and rising bread: warm gas at the same pressure takes more room, so it is less dense.
- **Weather balloons** swell to many times their launch volume as the pressure around them falls, until they burst at 30 km or so.
- **Aerosol cans** carry a warning not to heat them: the gas inside cannot expand, so its pressure climbs.

The molecular reasons — why fewer wall collisions per second mean lower pressure, why faster molecules push harder — are the subject of [[kinetic-molecular-theory]].
`,
  ideas: [
    'For a fixed amount of gas at constant temperature, pressure and volume are inversely proportional: PV stays constant (Boyle).',
    'At constant pressure, volume is proportional to the absolute temperature (Charles); at constant volume, so is pressure.',
    'Equal volumes of gases at the same temperature and pressure contain equal numbers of molecules (Avogadro).',
    'Temperatures in the gas laws must be in kelvin, and pressures must be absolute, not gauge.',
    'All four laws are special cases of one relation, the ideal gas law PV = nRT.'
  ],
  pitfalls: [
    'Doubling the temperature from 20 °C to 40 °C doubles the volume — Only kelvin temperatures are proportional. 293 K to 313 K is a rise of under 7 %.',
    'A tyre gauge reading can go straight into Boyle\'s law — The gauge shows pressure above the atmosphere. Add atmospheric pressure first, then subtract it again at the end.',
    'The gas laws depend on which gas it is — At ordinary pressures they do not: a litre of helium and a litre of carbon dioxide behave the same. Differences show up only at high pressure or near condensation (real gases).'
  ],
  formulas: [
    {
      name: 'Boyle\'s law (fixed amount and temperature)',
      expr: 'P1*V1 = P2*V2', tex: 'P_1 V_1 = P_2 V_2',
      vars: {
        P1: { name: 'initial pressure', q: 'pressure', unit: 'atm', value: 1.0, tex: 'P_1' },
        V1: { name: 'initial volume', q: 'volume', unit: 'L', value: 6.0, tex: 'V_1' },
        P2: { name: 'final pressure', q: 'pressure', unit: 'atm', value: 3.0, tex: 'P_2' },
        V2: { name: 'final volume', q: 'volume', unit: 'L', tex: 'V_2' }
      },
      solveFor: 'V2',
      note: 'The temperature must stay the same (slow compression, or time to cool back down). Any pressure unit works as long as both pressures use it.',
      stories: {
        V2: 'A breath-hold diver fills her lungs with {V1} of air at the surface, where the pressure is {P1}. What volume does that air occupy at a depth where the pressure is {P2}?',
        P2: 'A syringe holds {V1} of air at {P1}. With the tip sealed, you push the plunger until the air occupies {V2}. What is its pressure now?',
        V1: 'A gas at {P2} occupies {V2}. What volume did it occupy at {P1}, at the same temperature?'
      }
    },
    {
      name: 'Charles\'s law (fixed amount and pressure)',
      expr: 'V1/T1 = V2/T2', tex: '\\frac{V_1}{T_1} = \\frac{V_2}{T_2}',
      vars: {
        V1: { name: 'initial volume', q: 'volume', unit: 'L', value: 2.00, tex: 'V_1' },
        T1: { name: 'initial temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        V2: { name: 'final volume', q: 'volume', unit: 'L', tex: 'V_2' },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', value: 100, tex: 'T_2' }
      },
      solveFor: 'V2',
      note: 'The calculator converts °C to kelvin before dividing; by hand you must do it yourself.',
      stories: {
        V2: 'A balloon holds {V1} of air at {T1}. It is warmed to {T2} at constant pressure. What is its new volume?',
        T2: 'A balloon holds {V1} of air at {T1}. To what temperature must it be heated, at constant pressure, to swell to {V2}?'
      }
    },
    {
      name: 'Pressure law (fixed amount and volume)',
      expr: 'P1/T1 = P2/T2', tex: '\\frac{P_1}{T_1} = \\frac{P_2}{T_2}',
      vars: {
        P1: { name: 'initial absolute pressure', q: 'pressure', unit: 'bar', value: 3.21, tex: 'P_1' },
        T1: { name: 'initial temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        P2: { name: 'final absolute pressure', q: 'pressure', unit: 'bar', tex: 'P_2' },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', value: -10, tex: 'T_2' }
      },
      solveFor: 'P2',
      note: 'Pressures are absolute. The defaults are a car tyre pumped to 2.20 bar on the gauge (3.21 bar absolute) and then left out on a frosty night.',
      stories: {
        P2: 'A sealed container of gas is at {P1} (absolute) and {T1}. What is its pressure at {T2}?',
        T2: 'A rigid gas cylinder rated for {P2} is filled to {P1} at {T1}. At what temperature would it reach its rating?'
      }
    },
    {
      name: 'Combined gas law (fixed amount)',
      expr: 'P1*V1/T1 = P2*V2/T2', tex: '\\frac{P_1 V_1}{T_1} = \\frac{P_2 V_2}{T_2}',
      vars: {
        P1: { name: 'initial pressure', q: 'pressure', unit: 'atm', value: 1.00, tex: 'P_1' },
        V1: { name: 'initial volume', q: 'volume', unit: 'm³', value: 4.0, tex: 'V_1' },
        T1: { name: 'initial temperature', q: 'temperature', unit: '°C', value: 20, tex: 'T_1' },
        P2: { name: 'final pressure', q: 'pressure', unit: 'atm', value: 0.10, tex: 'P_2' },
        V2: { name: 'final volume', q: 'volume', unit: 'm³', tex: 'V_2' },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', value: -56.5, tex: 'T_2' }
      },
      solveFor: 'V2',
      note: 'The defaults follow a weather balloon from the ground to about 16 km, where the pressure is a tenth of an atmosphere and the air is at −56.5 °C.',
      stories: {
        V2: 'A weather balloon is filled with {V1} of helium at {P1} and {T1}. It rises to where the pressure is {P2} and the temperature {T2}. What is its volume there?',
        P2: 'A gas occupies {V1} at {P1} and {T1}. It is moved to a {V2} vessel at {T2}. What is its pressure?'
      }
    }
  ],
  examples: [
    {
      title: 'Holding your breath on the way up',
      q: 'A scuba diver at 20 m in seawater takes a full breath of 5.0 L from her regulator, which delivers air at the surrounding pressure. If she then rose to the surface holding her breath, what volume would that air try to occupy? (Seawater: 1025 kg/m³.)',
      steps: [
        'Pressure at 20 m: the atmosphere plus the water column, $P_1 = 101.3\\ \\mathrm{kPa} + \\rho g h = 101.3 + 1025 \\times 9.81 \\times 20 / 1000 = 302.4\\ \\mathrm{kPa} = 2.98\\ \\mathrm{atm}$.',
        'At the surface $P_2 = 1.00\\ \\mathrm{atm}$. The temperature is about the same, so Boyle\'s law applies.',
        { text: 'Solve for the new volume:', tex: 'V_2 = V_1\\,\\frac{P_1}{P_2} = 5.0\\ \\mathrm{L} \\times \\frac{2.98}{1.00} = 14.9\\ \\mathrm{L}' },
        'Lungs hold about 6 L. The air cannot fit, and the overpressure tears lung tissue — the reason for the first rule of diving: breathe out steadily while ascending.'
      ],
      a: 'About 15 L — three times her lung capacity. She must exhale on the way up.'
    },
    {
      title: 'A tyre on a frosty morning',
      q: 'A tyre is pumped to 2.20 bar on the gauge at 20 °C. Overnight it cools to −10 °C. What does the gauge read in the morning? (Atmospheric pressure 1.01 bar; the tyre\'s volume hardly changes.)',
      steps: [
        'Convert to absolute pressure: $P_1 = 2.20 + 1.01 = 3.21\\ \\mathrm{bar}$.',
        'Convert to kelvin: $T_1 = 293.15\\ \\mathrm{K}$, $T_2 = 263.15\\ \\mathrm{K}$.',
        { text: 'Pressure law:', tex: 'P_2 = P_1\\,\\frac{T_2}{T_1} = 3.21 \\times \\frac{263.15}{293.15} = 2.88\\ \\mathrm{bar}' },
        'Back to gauge pressure: $2.88 - 1.01 = 1.87\\ \\mathrm{bar}$. Working with gauge pressure directly would have given 1.97 bar — wrong by 0.1 bar.'
      ],
      a: 'About 1.87 bar: the absolute pressure fell by 10 %, the gauge reading by 15 %.'
    }
  ],
  quiz: [
    { q: 'A sealed balloon at 20 °C is warmed to 40 °C at constant pressure. Its volume…', choices: ['doubles', 'rises by about 7 %', 'rises by about 20 %', 'does not change'], a: 1,
      why: 'Volume is proportional to the kelvin temperature: 313.15/293.15 = 1.068. Doubling the Celsius number means nothing physically.' },
    { q: 'At constant temperature, halving the volume of a fixed amount of gas doubles its pressure.', a: true,
      why: 'Boyle\'s law: $PV$ is constant, so $P$ goes up by the same factor that $V$ goes down.' },
    { q: 'A gas occupies 3.0 L at 2.0 atm. At the same temperature, what volume does it occupy at 0.50 atm?', answer: 12, unit: 'L',
      why: '$V_2 = V_1 P_1/P_2 = 3.0 \\times 2.0/0.50 = 12\\ \\mathrm{L}$: a quarter of the pressure, four times the volume.' },
    { q: 'For a fixed amount of gas at constant pressure, which graph is a straight line through the origin?', choices: ['volume against Celsius temperature', 'volume against kelvin temperature', 'pressure against volume', 'volume against 1/temperature'], a: 1,
      why: 'Charles\'s law is a proportionality in kelvin. Against Celsius the line is straight but crosses the axis at −273.15 °C; P against V is a hyperbola.' },
    { q: 'A tyre gauge reads 2.0 bar. Which pressure belongs in the gas laws?', choices: ['2.0 bar', 'about 3.0 bar', 'about 1.0 bar', 'it does not matter, as long as the units match'], a: 1,
      why: 'The gauge measures the excess over the atmosphere. The gas laws need the absolute pressure, 2.0 + 1.0 = 3.0 bar. Ratios of gauge pressures give wrong answers.' }
  ],
  applications: ['Diving: gas volumes on ascent and descent, and the amount of air left in a cylinder.', 'Tyre, football and bicycle pressures through the seasons.', 'Syringes, pumps, pneumatic cylinders and gas springs.', 'Hot-air and weather balloons.'],
  history: 'Robert Boyle, working with Robert Hooke\'s air pump, published the pressure–volume relation in 1662. Guillaume Amontons noticed around 1702 that the pressure of trapped air rises steadily with temperature; Jacques Charles measured the volume–temperature relation in about 1787 but did not publish, and Joseph Louis Gay-Lussac published careful measurements in 1802. Amedeo Avogadro proposed in 1811 that equal volumes of gases hold equal numbers of molecules; the idea was ignored for half a century until Stanislao Cannizzaro championed it in 1860.',
  sim: 'state-piston'
},

{
  id: 'ideal-gas-law', parent: 'gases', title: 'The ideal gas law', level: 1,
  short: 'PV = nRT: pressure times volume is proportional to the amount of gas and its absolute temperature, whatever the gas. It turns litres of gas into moles and back.',
  keywords: ['ideal gas law', 'PV = nRT', 'gas constant', 'R', 'molar volume', 'STP', 'SATP', 'gas density', 'molar mass of a gas', 'Dumas method', 'gas stoichiometry', 'airbag', 'combining volumes'],
  prereq: ['gas-laws', 'mole-concept', 'molar-mass'],
  related: ['physics:ideal-gas-law', 'reaction-stoichiometry', 'limiting-reagent', 'partial-pressures', 'kinetic-molecular-theory', 'real-gases'],
  body: `
The gas laws each hold two quantities fixed. Put them together — $V \\propto 1/P$, $V \\propto T$, $V \\propto n$ — and one relation covers every case:

$$PV = nRT$$

$R$ is the **molar gas constant**, measured once and valid for every gas. That is the remarkable part: the identity of the gas does not appear. A mole of hydrogen and a mole of xenon, in the same flask at the same temperature, push on the walls equally hard, because pressure comes from the *number* of molecules hitting the walls and their average kinetic energy — and that energy depends only on temperature ([[kinetic-molecular-theory]]). A physicist writes the same law per molecule, $PV = Nk_BT$ ([[physics:ideal-gas-law|the physicist's view]]); since $R = N_A k_B$, the two are identical.

### The gas constant in the units you have
| $R$ | Use with |
|---|---|
| $8.314\\ \\mathrm{J/(mol\\cdot K)}$ | SI: Pa and m³, or kPa and L |
| $0.08206\\ \\mathrm{L\\cdot atm/(mol\\cdot K)}$ | atm and L |
| $0.08314\\ \\mathrm{L\\cdot bar/(mol\\cdot K)}$ | bar and L |
| $62.36\\ \\mathrm{L\\cdot mmHg/(mol\\cdot K)}$ | mmHg and L |

Pick the one that matches your pressure and volume units, or convert everything to SI (the calculators here do that for you). The temperature is always in kelvin.

### The molar volume
At a given temperature and pressure, one mole of *any* ideal gas takes the same volume, $V_m = RT/P$:

- 22.41 L at 0 °C and 1 atm (the traditional "STP");
- 22.71 L at 0 °C and 1 bar (IUPAC's standard conditions since 1982);
- 24.47 L at 25 °C and 1 atm; 24.79 L at 25 °C and 1 bar.

> [!warn] "STP" means different things in different books. Always check which temperature and pressure are meant; the difference between 22.4 and 22.7 L is over 1 %.

### Gas stoichiometry
Because equal volumes hold equal numbers of molecules, gases react in simple **volume** ratios — the same as their coefficients. Two litres of hydrogen burn with one litre of oxygen, $\\ce{2H2(g) + O2(g) -> 2H2O(g)}$. More generally, $n = PV/RT$ turns a measured gas volume into moles, and from there the usual [[reaction-stoichiometry]] takes over. A car airbag is the classic case: about 115 g of sodium azide decomposes in 30 ms, $\\ce{2NaN3 -> 2Na + 3N2}$, filling a 65 L bag with nitrogen.

### Density and molar mass
Divide both sides by $V$ and write $n/V = \\rho/M$:

$$\\rho = \\frac{PM}{RT}$$

At the same temperature and pressure a gas is denser in proportion to its molar mass. Air (average $M$ = 28.96 g/mol) is 1.20 g/L at 20 °C; carbon dioxide (44.01 g/mol) is 1.83 g/L and pools in cellars, wine vats and mine shafts, while helium at 0.17 g/L lifts balloons. Hot air rises for the same reason: at equal pressure, $\\rho \\propto 1/T$. Turned around, $M = \\rho RT/P$ gives the molar mass of an unknown gas or vapour from its density — the **Dumas method**, one of the first ways chemists found molecular formulas.

### When it fails
Real molecules take up room and attract one another. At room temperature and a few atmospheres the errors are below 1 % for air; at hundreds of atmospheres, or close to the boiling point, they grow large ([[real-gases]]).
`,
  ideas: [
    'PV = nRT links pressure, volume, amount and absolute temperature for any gas at modest pressures.',
    'R is the same for every gas: 8.314 J/(mol·K) = 0.08206 L·atm/(mol·K).',
    'One mole of any ideal gas occupies 22.4 L at 0 °C and 1 atm, 24.5 L at 25 °C and 1 atm.',
    'n = PV/RT converts measured gas volumes into moles for stoichiometry.',
    'Gas density is proportional to molar mass: ρ = PM/RT, so measuring a density gives a molar mass.'
  ],
  pitfalls: [
    'Mixing units — R = 0.08206 needs atm and litres; R = 8.314 needs pascals and cubic metres (or kPa and litres). Mixing atm with 8.314 is off by a factor of 101.3.',
    'Using Celsius — PV = nRT is a proportionality with absolute temperature. At 0 °C the formula would give zero volume.',
    'A heavier gas takes more room — At the same T and P, a mole of any gas has the same volume. Heavier molecules make the gas denser, not bigger.'
  ],
  derivation: {
    title: 'Build the ideal gas law from the single laws',
    steps: [
      { text: 'Boyle (fixed n, T), Charles (fixed n, P) and Avogadro (fixed P, T) say', tex: 'V \\propto \\frac{1}{P}, \\qquad V \\propto T, \\qquad V \\propto n' },
      { text: 'A quantity proportional to each factor separately is proportional to their product:', tex: 'V \\propto \\frac{nT}{P} \\quad\\Longrightarrow\\quad V = R\\,\\frac{nT}{P}' },
      { text: 'Rearranged, with the constant of proportionality measured once for all gases:', tex: 'PV = nRT, \\qquad R = 8.314\\ \\mathrm{J\\,mol^{-1}\\,K^{-1}}' },
      { text: 'Per molecule, with $N = nN_A$ and the Boltzmann constant $k_B = R/N_A$:', tex: 'PV = N k_B T' }
    ]
  },
  formulas: [
    {
      name: 'Ideal gas law',
      expr: 'P*V = n*R*T', tex: 'PV = nRT',
      vars: {
        P: { name: 'pressure', q: 'pressure', unit: 'bar', value: 200 },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 12 },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      solveFor: 'n',
      note: 'The defaults are a 12 L scuba cylinder filled to 200 bar: nearly 100 mol, or 2.9 kg of air. At 200 bar air is no longer quite ideal and the true amount differs by a few per cent (see real gases).',
      stories: {
        n: 'A scuba cylinder with an internal volume of {V} is filled with air to {P} at {T}. How many moles of air does it hold?',
        P: 'What pressure does {n} of nitrogen exert in a {V} steel cylinder at {T}?',
        V: 'What volume does {n} of gas occupy at {P} and {T}?',
        T: 'A {V} vessel holds {n} of gas at {P}. What is its temperature?'
      }
    },
    {
      name: 'Molar volume of an ideal gas',
      expr: 'Vm = R*T/P', tex: 'V_m = \\frac{RT}{P}',
      vars: {
        Vm: { name: 'molar volume', q: 'molarvolume', unit: 'L/mol', tex: 'V_m' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 0 },
        P: { name: 'pressure', q: 'pressure', unit: 'atm', value: 1 }
      },
      note: 'The same for every ideal gas. 0 °C and 1 atm gives 22.41 L/mol; try 25 °C, or 1 bar.',
      stories: {
        Vm: 'What volume does one mole of any ideal gas occupy at {T} and {P}?',
        T: 'At what temperature does a mole of gas at {P} occupy {Vm}?'
      }
    },
    {
      name: 'Density of a gas',
      expr: 'rho = P*M/(R*T)', tex: '\\rho = \\frac{PM}{RT}',
      vars: {
        rho: { name: 'density', q: 'density', unit: 'g/L', tex: '\\rho' },
        P: { name: 'pressure', q: 'pressure', unit: 'atm', value: 1 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 44.01 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'Solve for $M$ to find the molar mass of an unknown gas from its density (the Dumas method). The defaults are carbon dioxide.',
      stories: {
        rho: 'What is the density of carbon dioxide ($M$ = {M}) at {P} and {T}?',
        M: 'An unknown gas has a density of {rho} at {P} and {T}. What is its molar mass?',
        T: 'At what temperature does a gas of molar mass {M} have a density of {rho} at {P}?'
      }
    },
    {
      name: 'Mass of gas in a container',
      expr: 'P*V = m*R*T/M', tex: 'PV = \\frac{m}{M}\\,RT',
      vars: {
        P: { name: 'pressure', q: 'pressure', unit: 'bar', value: 150 },
        V: { name: 'volume', q: 'volume', unit: 'L', value: 50 },
        m: { name: 'mass of gas', q: 'mass', unit: 'kg' },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 4.0026 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      solveFor: 'm',
      note: 'The ideal gas law with $n = m/M$. The defaults are a 50 L helium cylinder at 150 bar: only about 1.2 kg of gas, enough for some 700 party balloons.',
      stories: {
        m: 'A {V} cylinder of helium ($M$ = {M}) is filled to {P} at {T}. What mass of helium does it contain?',
        P: 'A {V} cylinder contains {m} of a gas with molar mass {M} at {T}. What is the pressure inside?'
      }
    }
  ],
  examples: [
    {
      title: 'Filling an airbag',
      q: 'A driver\'s airbag must fill with 65 L of nitrogen at 1.00 atm and 25 °C. The gas comes from sodium azide: $\\ce{2NaN3(s) -> 2Na(s) + 3N2(g)}$. What mass of $\\ce{NaN3}$ (65.01 g/mol) is needed?',
      steps: [
        { text: 'Moles of nitrogen from the ideal gas law:', tex: 'n(\\ce{N2}) = \\frac{PV}{RT} = \\frac{1.00 \\times 65}{0.08206 \\times 298.15} = 2.66\\ \\mathrm{mol}' },
        'From the equation, 2 mol of azide give 3 mol of nitrogen: $n(\\ce{NaN3}) = \\tfrac{2}{3} \\times 2.66 = 1.77\\ \\mathrm{mol}$.',
        'Mass: $1.77 \\times 65.01 = 115\\ \\mathrm{g}$.',
        'Real inflators add potassium nitrate and silica to turn the dangerous sodium into harmless glass — and many modern ones use other propellants altogether.'
      ],
      a: 'About 115 g of sodium azide.'
    },
    {
      title: 'The molar mass of a vapour',
      q: 'A 250.0 mL flask is filled with the vapour of an unknown volatile liquid at 100.0 °C and 1.00 atm. After cooling, the condensed liquid weighs 0.474 g. Analysis shows the empirical formula $\\ce{C3H6O}$. What is the molecular formula?',
      steps: [
        { text: 'Molar mass from the ideal gas law with $n = m/M$:', tex: 'M = \\frac{mRT}{PV} = \\frac{0.474 \\times 0.08206 \\times 373.15}{1.00 \\times 0.2500} = 58.1\\ \\mathrm{g/mol}' },
        'The empirical formula $\\ce{C3H6O}$ has a mass of 58.08 g/mol, the same as the measured molar mass.',
        'So the molecular formula is $\\ce{C3H6O}$ itself — acetone, or one of its isomers such as propanal.'
      ],
      a: 'M ≈ 58.1 g/mol, so the molecular formula is $\\ce{C3H6O}$.'
    }
  ],
  quiz: [
    { q: 'One litre of hydrogen and one litre of carbon dioxide, both at 25 °C and 1 atm, contain…', choices: ['the same number of molecules', '22 times more $\\ce{H2}$ molecules', '22 times more $\\ce{CO2}$ molecules', 'the same mass of gas'], a: 0,
      why: 'Avogadro\'s law: at equal temperature and pressure, equal volumes hold equal numbers of molecules. The carbon dioxide is 22 times heavier, but not more numerous.' },
    { q: 'What volume does 1.00 mol of an ideal gas occupy at 25 °C and 1.00 atm?', answer: 24.47, unit: 'L',
      why: '$V = nRT/P = 1.00 \\times 0.08206 \\times 298.15/1.00 = 24.5\\ \\mathrm{L}$.' },
    { q: 'At the same temperature and pressure, carbon dioxide is denser than air.', a: true,
      why: '$\\rho = PM/RT$: 44.0 g/mol against an average of 29.0 g/mol for air, so carbon dioxide is about 1.5 times denser and collects in low places.' },
    { q: 'You measure pressure in atm and volume in litres. Which value of $R$ do you use?', choices: ['8.314', '0.08206', '62.36', '1.987'], a: 1,
      why: '$R = 0.08206\\ \\mathrm{L\\cdot atm/(mol\\cdot K)}$. 8.314 is for SI units (or kPa with litres), 62.36 for mmHg, and 1.987 is in cal/(mol·K), for energies.' },
    { q: 'A gas sample\'s absolute temperature and its volume are both doubled. What happens to its pressure?', choices: ['it doubles', 'it halves', 'it stays the same', 'it quadruples'], a: 2,
      why: '$P = nRT/V$: doubling $T$ doubles $P$, doubling $V$ halves it, and the two cancel.' }
  ],
  problems: [
    { q: 'How many moles of air are in a 50 m³ room at 20 °C and 1.00 atm?', answer: 2079, unit: 'mol', tol: 0.02,
      steps: ['$n = PV/RT = 101325 \\times 50/(8.314 \\times 293.15)$', '$n \\approx 2.08 \\times 10^3\\ \\mathrm{mol}$ — about 60 kg of air.'] }
  ],
  applications: ['Gas stoichiometry: airbags, rocket propellants, gas evolution in reactions.', 'Filling, weighing and pricing compressed gases.', 'Molar masses from vapour densities.', 'Why carbon dioxide collects in cellars and helium lifts balloons.'],
  sim: 'state-piston'
},

{
  id: 'partial-pressures', parent: 'gases', title: 'Partial pressures and Dalton\'s law', level: 2,
  short: 'In a mixture, each gas pushes on the walls as if it were there alone. The total pressure is the sum of these partial pressures, and each is the total times that gas\'s mole fraction.',
  keywords: ['Dalton\'s law', 'partial pressure', 'mole fraction', 'gas mixture', 'collecting gas over water', 'water vapour pressure', 'altitude', 'oxygen partial pressure', 'diving', 'nitrox', 'maximum operating depth', 'alveolar air'],
  prereq: ['ideal-gas-law', 'gas-laws'],
  related: ['vapor-pressure', 'henrys-law', 'kp-kc', 'concentration-units', 'raoults-law', 'physics:hydrostatic-pressure'],
  body: `
Air is a mixture: about 78 % nitrogen, 21 % oxygen, 0.9 % argon and a little carbon dioxide. Each kind of molecule flies about and hits the walls without caring what else is present — in an ideal gas the molecules do not interact. So each component contributes its own **partial pressure**, the pressure it would exert if it filled the container alone, and the total is their sum (**Dalton's law**, 1801):

$$P_\\text{total} = P_1 + P_2 + P_3 + \\cdots$$

Since each partial pressure obeys $P_i = n_i RT/V$, dividing by the total gives

$$P_i = x_i\\,P_\\text{total}, \\qquad x_i = \\frac{n_i}{n_\\text{total}}$$

where $x_i$ is the **mole fraction**. Partial pressure is a gas's share of the total in proportion to its share of the molecules — not of the mass. A heavy carbon dioxide molecule moves more slowly than a light nitrogen one but carries more momentum, and at the same temperature the two effects cancel exactly: each molecule contributes the same average push.

### Breathing at altitude and under water
What your lungs care about is the **partial pressure of oxygen**, not its percentage. At sea level $p_{\\ce{O2}} = 0.2095 \\times 760 = 159\\ \\mathrm{mmHg}$. On the summit of Everest the air is still 20.95 % oxygen, but the total pressure is only about 253 mmHg, so $p_{\\ce{O2}}$ is 53 mmHg — a third of normal, which is why most climbers carry bottled oxygen.

Divers meet the opposite problem. Every 10 m of seawater adds about 1 atm, so at 40 m air delivers $p_{\\ce{O2}} \\approx 1.04\\ \\mathrm{atm}$ and the nitrogen has become narcotic. Above about 1.4–1.6 atm oxygen itself becomes toxic, so every breathing mix has a **maximum operating depth**: for nitrox with 32 % oxygen, $1.4/0.32 = 4.4\\ \\mathrm{atm}$, about 34 m.

### Collecting a gas over water
A gas made in the lab — hydrogen from zinc and acid, oxygen from decomposing hydrogen peroxide — is often collected by bubbling it into an upturned, water-filled bottle. The gas in the bottle is then **saturated with water vapour**, whose partial pressure depends only on the temperature ([[vapor-pressure]]). With the water levels inside and outside equal, the total inside is atmospheric, so

$$P_\\text{gas} = P_\\text{atm} - P_{\\ce{H2O}}$$

| T (°C) | 15 | 20 | 22 | 25 | 30 | 37 |
|---|---|---|---|---|---|---|
| $P_{\\ce{H2O}}$ (mmHg) | 12.8 | 17.5 | 19.8 | 23.8 | 31.8 | 47.1 |

The same correction applies in your lungs: alveolar air is saturated with water vapour at 37 °C, 47 mmHg of the total, which leaves less room for oxygen.

> [!tip] Partial pressures are also how chemists write equilibrium constants for gas reactions ([[kp-kc]]) and how gas solubility is expressed ([[henrys-law]]).
`,
  ideas: [
    'Each gas in a mixture exerts the pressure it would exert alone; the total is the sum of these partial pressures.',
    'A partial pressure equals the mole fraction times the total pressure: P_i = x_i P.',
    'Every molecule contributes the same average push at a given temperature, however heavy it is.',
    'A gas collected over water is mixed with water vapour; subtract the vapour pressure of water.',
    'Physiology responds to the partial pressure of oxygen, which falls with altitude and rises with depth.'
  ],
  pitfalls: [
    'A heavier gas has a bigger partial pressure — Partial pressure goes with the number of molecules. Equal moles of helium and xenon in a flask have equal partial pressures.',
    'There is less oxygen in mountain air — The fraction is the same 21 %; there is less of everything, so the partial pressure of oxygen is lower.',
    'The pressure in a collection bottle is all from the collected gas — It includes water vapour, which must be subtracted before using PV = nRT.'
  ],
  formulas: [
    {
      name: 'Dalton\'s law of partial pressures',
      expr: 'P = P1 + P2 + P3', tex: 'P_\\text{total} = P_1 + P_2 + P_3',
      vars: {
        P: { name: 'total pressure', q: 'pressure', unit: 'atm', tex: 'P_\\text{total}' },
        P1: { name: 'partial pressure of gas 1', q: 'pressure', unit: 'atm', value: 0.781, tex: 'P_1' },
        P2: { name: 'partial pressure of gas 2', q: 'pressure', unit: 'atm', value: 0.209, tex: 'P_2' },
        P3: { name: 'partial pressure of gas 3', q: 'pressure', unit: 'atm', value: 0.0093, tex: 'P_3' }
      },
      note: 'The defaults are the nitrogen, oxygen and argon of dry air at sea level.',
      stories: {
        P: 'A gas cylinder holds nitrogen at {P1}, oxygen at {P2} and argon at {P3}. What is the total pressure?',
        P2: 'A mixture at a total of {P} contains nitrogen at {P1} and argon at {P3}; the rest is oxygen. What is the partial pressure of oxygen?'
      }
    },
    {
      name: 'Partial pressure from the mole fraction',
      expr: 'Pi = x*P', tex: 'P_i = x_i\\,P_\\text{total}',
      vars: {
        Pi: { name: 'partial pressure', q: 'pressure', unit: 'atm', tex: 'P_i' },
        x: { name: 'mole fraction of the gas', q: 'ratio', unit: '', value: 0.2095, min: 0, max: 1, tex: 'x_i' },
        P: { name: 'total pressure', q: 'pressure', unit: 'atm', value: 4.97, tex: 'P_\\text{total}' }
      },
      note: 'The defaults are the oxygen in air breathed at 40 m depth in seawater.',
      stories: {
        Pi: 'A diver breathes air (oxygen mole fraction {x}) at a depth where the total pressure is {P}. What is the partial pressure of oxygen in her lungs?',
        x: 'What mole fraction of oxygen gives a partial pressure of {Pi} at a total pressure of {P}?',
        P: 'At what total pressure does a gas with mole fraction {x} reach a partial pressure of {Pi}?'
      }
    },
    {
      name: 'Gas collected over water',
      expr: 'Pgas = Patm - Pw', tex: 'P_\\text{gas} = P_\\text{atm} - P_{\\ce{H2O}}',
      vars: {
        Pgas: { name: 'pressure of the dry gas', q: 'pressure', unit: 'mmHg', tex: 'P_\\text{gas}' },
        Patm: { name: 'atmospheric pressure', q: 'pressure', unit: 'mmHg', value: 752, tex: 'P_\\text{atm}' },
        Pw: { name: 'vapour pressure of water', q: 'pressure', unit: 'mmHg', value: 19.8, tex: 'P_{\\ce{H2O}}' }
      },
      note: 'Valid when the water levels inside and outside the collecting vessel are equal. The water vapour pressure depends only on temperature: 19.8 mmHg at 22 °C, 23.8 mmHg at 25 °C.',
      stories: {
        Pgas: 'Oxygen is collected over water on a day when the barometer reads {Patm}. The vapour pressure of water is {Pw}. What is the partial pressure of the oxygen?'
      }
    },
    {
      name: 'Maximum operating depth of a breathing gas',
      expr: 'd = (pO2/x - P0)/(rho*g)', tex: 'd = \\frac{p_{\\ce{O2}}/x_{\\ce{O2}} - p_0}{\\rho g}',
      vars: {
        d: { name: 'maximum depth', q: 'length', unit: 'm' },
        pO2: { name: 'highest safe oxygen partial pressure', q: 'pressure', unit: 'bar', value: 1.4, tex: 'p_{\\ce{O2}}' },
        x: { name: 'oxygen mole fraction of the mix', q: 'ratio', unit: '', value: 0.32, min: 0.05, max: 1, tex: 'x_{\\ce{O2}}' },
        P0: { const: 'atm' },
        rho: { name: 'density of seawater', q: 'density', unit: 'kg/m³', value: 1025, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'The total pressure at the limit is $p_{\\ce{O2}}/x_{\\ce{O2}}$; subtract the atmosphere and divide by $\\rho g$ to get the depth of water that supplies the rest. Divers\' rule of thumb: 10 m per bar.',
      stories: {
        d: 'A diver breathes nitrox with an oxygen fraction of {x}. If the oxygen partial pressure must stay below {pO2}, how deep may she go in seawater of density {rho}?',
        x: 'For a planned dive to {d} in seawater of density {rho}, what is the highest oxygen fraction that keeps the partial pressure below {pO2}?'
      }
    }
  ],
  examples: [
    {
      title: 'Hydrogen collected over water',
      q: 'Zinc reacts with hydrochloric acid, $\\ce{Zn + 2HCl -> ZnCl2 + H2}$, and the hydrogen is collected over water at 22 °C: 250 mL of gas at a barometric pressure of 752 mmHg. The vapour pressure of water at 22 °C is 19.8 mmHg. What mass of zinc reacted?',
      steps: [
        'Pressure of the dry hydrogen: $752 - 19.8 = 732.2\\ \\mathrm{mmHg} = 0.9634\\ \\mathrm{atm}$.',
        { text: 'Moles of hydrogen:', tex: 'n = \\frac{PV}{RT} = \\frac{0.9634 \\times 0.250}{0.08206 \\times 295.15} = 9.94 \\times 10^{-3}\\ \\mathrm{mol}' },
        'One zinc atom gives one hydrogen molecule, so $n(\\ce{Zn}) = 9.94 \\times 10^{-3}$ mol, and $m = 9.94 \\times 10^{-3} \\times 65.38 = 0.650\\ \\mathrm{g}$.',
        'Forgetting the water vapour would have overestimated the hydrogen by 2.7 %.'
      ],
      a: '0.650 g of zinc.'
    },
    {
      title: 'Oxygen on the summit of Everest',
      q: 'The pressure on the summit of Mount Everest is about 253 mmHg. Air there is still 20.95 % oxygen. Compare the oxygen partial pressure with sea level (760 mmHg), and estimate what reaches the lungs once the inhaled air is saturated with water vapour at 37 °C (47 mmHg).',
      steps: [
        'Sea level: $p_{\\ce{O2}} = 0.2095 \\times 760 = 159\\ \\mathrm{mmHg}$.',
        'Summit: $p_{\\ce{O2}} = 0.2095 \\times 253 = 53\\ \\mathrm{mmHg}$, a third of the sea-level value.',
        'In the airways, water vapour takes 47 mmHg of the total, leaving $253 - 47 = 206$ mmHg of dry gas: $p_{\\ce{O2}} = 0.2095 \\times 206 = 43\\ \\mathrm{mmHg}$ in the inhaled air, before the lungs have taken any of it.',
        'At sea level the same correction gives $0.2095 \\times 713 = 149$ mmHg. The water-vapour penalty is fixed at 47 mmHg, so it hurts proportionally far more at altitude.'
      ],
      a: '53 mmHg against 159 mmHg; only about 43 mmHg once humidified — enough to stay alive, barely, after weeks of acclimatisation.'
    }
  ],
  quiz: [
    { q: 'A rigid flask holds 1 mol of helium and 1 mol of xenon at 300 K. Which gas has the larger partial pressure?', choices: ['helium: its molecules move faster', 'xenon: its molecules are heavier', 'they are equal', 'it depends on the size of the flask'], a: 2,
      why: 'Partial pressure depends on the number of molecules, $P_i = n_iRT/V$. Faster helium atoms hit the walls more often but more softly; at the same temperature the effects cancel.' },
    { q: 'On a high mountain, the percentage of oxygen in the air is…', choices: ['much lower than 21 %', 'still about 21 %', 'higher than 21 %, because heavier nitrogen stays lower', 'zero above 8000 m'], a: 1,
      why: 'The lower atmosphere is well mixed, so the composition is the same. It is the total pressure, and with it the oxygen partial pressure, that falls.' },
    { q: 'Using the rule of 1 atm per 10 m of seawater, what is the oxygen partial pressure in air (20.95 % oxygen) breathed at 30 m?', answer: 0.838, unit: 'atm',
      why: 'Total pressure 1 + 3 = 4.0 atm; $p_{\\ce{O2}} = 0.2095 \\times 4.0 = 0.84$ atm — four times the surface value.' },
    { q: 'Adding helium to a rigid flask of oxygen at constant temperature changes the partial pressure of the oxygen.', a: false,
      why: 'The oxygen still has the same number of molecules in the same volume at the same temperature, so $P_{\\ce{O2}} = n_{\\ce{O2}}RT/V$ is unchanged. The total rises; the oxygen\'s mole fraction falls.' },
    { q: 'When a gas is collected over water, its pressure (with the levels equal) is…', choices: ['equal to atmospheric pressure', 'atmospheric pressure minus the vapour pressure of water', 'atmospheric pressure plus the vapour pressure of water', 'the vapour pressure of water'], a: 1,
      why: 'The total inside equals atmospheric pressure, and part of that total is water vapour. The collected gas contributes the rest.' }
  ],
  applications: ['Diving: oxygen toxicity, nitrogen narcosis and choosing breathing mixes.', 'Mountaineering, aviation and pressurised cabins.', 'Medical gases and blood-gas analysis.', 'Collecting gases in the laboratory.', 'Equilibrium constants in partial pressures (Kp).'],
  history: 'John Dalton stated the law of partial pressures in 1801, while thinking about how water vapour mixes with air. It led him towards his atomic theory.',
  sim: { id: 'state-piston', params: { mix: 1 } }
},

{
  id: 'kinetic-molecular-theory', parent: 'gases', title: 'Kinetic molecular theory', level: 2,
  short: 'A gas is a swarm of tiny molecules in constant, random motion. Pressure is their collisions with the walls; temperature measures their average kinetic energy. From that picture all the gas laws follow.',
  keywords: ['kinetic molecular theory', 'kinetic theory', 'postulates', 'root-mean-square speed', 'rms speed', 'mean speed', 'most probable speed', 'average kinetic energy', 'Maxwell–Boltzmann distribution', 'molecular speed', 'temperature', 'escape of hydrogen'],
  prereq: ['ideal-gas-law', 'physics:kinetic-energy', 'molar-mass'],
  related: ['physics:kinetic-theory-gases', 'physics:maxwell-boltzmann', 'physics:equipartition', 'physics:mean-free-path', 'effusion-diffusion', 'real-gases', 'collision-theory'],
  body: `
Why should every gas obey the same law, whatever its molecules are? Because a gas is mostly empty space. Kinetic molecular theory pictures it with a few assumptions:

1. A gas is made of molecules whose own volume is negligible compared with the space between them (in air at room conditions, well under 0.1 % of the volume).
2. They move in straight lines, in random directions, until they collide.
3. Collisions with each other and with the walls are elastic: no kinetic energy is lost overall.
4. Apart from collisions they neither attract nor repel one another.
5. The **average kinetic energy** of the molecules is proportional to the absolute temperature, and to nothing else.

### Pressure from collisions
Each molecule that bounces off a wall reverses its momentum and gives the wall a tiny push. Billions of billions of pushes per second add up to a steady pressure. Counting them (see the derivation) gives

$$PV = \\tfrac{1}{3}\\,N m\\,\\overline{v^2}$$

and comparing with $PV = nRT$ shows what temperature *is*: for one mole,

$$\\bar E_k = \\tfrac{1}{2} M\\,\\overline{v^2} = \\tfrac{3}{2}RT$$

At 25 °C that is 3.72 kJ/mol for **every** gas. The gas laws now read naturally: squeeze the gas (Boyle) and the same molecules hit a smaller wall area more often; heat it (pressure law) and they hit harder and more often; add molecules (Avogadro) and there are more hits.

### How fast?
The same energy shared among heavier molecules means slower ones. The **root-mean-square speed** is

$$v_\\text{rms} = \\sqrt{\\frac{3RT}{M}}$$

with $M$ in **kg/mol**. At 25 °C:

| Gas | $\\ce{H2}$ | $\\ce{He}$ | $\\ce{N2}$ | $\\ce{O2}$ | $\\ce{CO2}$ | $\\ce{UF6}$ |
|---|---|---|---|---|---|---|
| $v_\\text{rms}$ (m/s) | 1921 | 1363 | 515 | 482 | 411 | 145 |

Nitrogen molecules move faster than a rifle bullet — yet a smell takes seconds to cross a room, because each molecule collides with a neighbour every 0.1 ns or so and travels only about 70 nm between collisions ([[physics:mean-free-path]]).

### A spread of speeds
Not all molecules have the same speed. Collisions constantly redistribute energy, and the speeds settle into the **Maxwell–Boltzmann distribution** ([[physics:maxwell-boltzmann]]): few very slow molecules, a broad peak, and a long tail of fast ones. Three averages are quoted, in the fixed ratio $1 : 1.128 : 1.225$:

$$v_\\text{mp} = \\sqrt{\\frac{2RT}{M}}, \\qquad \\bar v = \\sqrt{\\frac{8RT}{\\pi M}}, \\qquad v_\\text{rms} = \\sqrt{\\frac{3RT}{M}}$$

Heating a gas shifts the peak to higher speeds and stretches the tail enormously. That tail is what matters for chemistry: only molecules with enough energy react when they collide, which is why reaction rates climb so steeply with temperature ([[collision-theory]]).

> [!fact] The tail also decides which gases a planet can keep. In Earth's upper atmosphere, at about 1000 K, hydrogen molecules have a most probable speed near 2.9 km/s against an escape velocity of 11.2 km/s — only about one in a million is fast enough, but over geological time that is plenty, and free hydrogen has leaked away. For oxygen the fraction is around $10^{-103}$.
`,
  ideas: [
    'A gas is tiny molecules in fast, random motion with lots of empty space between them.',
    'Pressure comes from molecules colliding with the walls.',
    'The average kinetic energy of the molecules is (3/2)RT per mole: it depends only on temperature, not on the gas.',
    'At the same temperature, lighter molecules move faster: v_rms = √(3RT/M).',
    'Molecular speeds follow the Maxwell–Boltzmann distribution, which spreads out and shifts to higher speeds as the gas warms.'
  ],
  pitfalls: [
    'All the molecules in a gas move at the same speed — They have a wide distribution; v_rms is only one kind of average.',
    'Heavier molecules at the same temperature have more kinetic energy — The average kinetic energy is the same; heavier molecules simply move more slowly.',
    'Doubling the temperature doubles the speed — Kinetic energy is proportional to absolute temperature, so speed goes as its square root: doubling T in kelvin raises v_rms by √2 ≈ 1.41.'
  ],
  derivation: {
    title: 'Pressure from molecules hitting a wall',
    steps: [
      { text: 'A molecule of mass $m$ with velocity component $v_x$ bounces off a wall of a cubic box of side $L$. Its momentum changes by', tex: '\\Delta p = 2 m v_x' },
      { text: 'It returns to the same wall after travelling $2L$ in the $x$ direction, so it hits it $v_x/2L$ times per second. The average force it exerts is', tex: 'F = 2 m v_x \\cdot \\frac{v_x}{2L} = \\frac{m v_x^2}{L}' },
      { text: 'For $N$ molecules, divide the total force by the wall area $L^2$ and use $V = L^3$:', tex: 'P = \\frac{N m\\,\\overline{v_x^2}}{V}' },
      { text: 'Motion is random, so $\\overline{v_x^2} = \\overline{v_y^2} = \\overline{v_z^2} = \\tfrac13\\overline{v^2}$:', tex: 'PV = \\tfrac{1}{3} N m\\,\\overline{v^2} = \\tfrac{2}{3} N\\,\\bar\\varepsilon_k' },
      { text: 'Compare with $PV = nRT$, using $Nm = nM$ for the total mass:', tex: '\\tfrac{1}{2} M\\,\\overline{v^2} = \\tfrac{3}{2} RT \\quad\\Longrightarrow\\quad v_\\text{rms} = \\sqrt{\\frac{3RT}{M}}' }
    ]
  },
  formulas: [
    {
      name: 'Root-mean-square speed',
      expr: 'vrms = sqrt(3*R*T/M)', tex: 'v_\\text{rms} = \\sqrt{\\frac{3RT}{M}}',
      vars: {
        vrms: { name: 'root-mean-square speed', q: 'speed', unit: 'm/s', tex: 'v_\\text{rms}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 28.014 }
      },
      note: '$M$ must be in kg/mol inside the formula (the calculator converts). The defaults are nitrogen at 25 °C.',
      stories: {
        vrms: 'What is the root-mean-square speed of nitrogen molecules ($M$ = {M}) at {T}?',
        T: 'At what temperature do molecules of molar mass {M} have a root-mean-square speed of {vrms}?',
        M: 'A gas at {T} has a root-mean-square speed of {vrms}. What is its molar mass?'
      }
    },
    {
      name: 'Average kinetic energy per mole',
      expr: 'Ek = 3/2*R*T', tex: '\\bar E_k = \\tfrac{3}{2} RT',
      vars: {
        Ek: { name: 'average translational kinetic energy per mole', q: 'molarenergy', unit: 'kJ/mol', tex: '\\bar E_k' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'The same for every gas at a given temperature. Divide by $N_A$ for the energy of one molecule: $\\tfrac32 k_BT = 6.2 \\times 10^{-21}$ J at 25 °C.',
      stories: {
        Ek: 'What is the average translational kinetic energy of one mole of gas molecules at {T}?',
        T: 'At what temperature is the average kinetic energy of a gas {Ek} per mole?'
      }
    },
    {
      name: 'Mean speed',
      expr: 'vavg = sqrt(8*R*T/(pi*M))', tex: '\\bar v = \\sqrt{\\frac{8RT}{\\pi M}}',
      vars: {
        vavg: { name: 'mean speed', q: 'speed', unit: 'm/s', tex: '\\bar v' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 4.0026 }
      },
      note: 'The ordinary average of the speeds, 8 % less than $v_\\text{rms}$. It sets collision and effusion rates. The defaults are helium.',
      stories: {
        vavg: 'What is the mean speed of helium atoms ($M$ = {M}) at {T}?',
        M: 'Molecules of an unknown gas at {T} have a mean speed of {vavg}. What is the molar mass?'
      }
    },
    {
      name: 'Most probable speed',
      expr: 'vmp = sqrt(2*R*T/M)', tex: 'v_\\text{mp} = \\sqrt{\\frac{2RT}{M}}',
      vars: {
        vmp: { name: 'most probable speed', q: 'speed', unit: 'm/s', tex: 'v_\\text{mp}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 1000 },
        M: { name: 'molar mass', q: 'molarmass', unit: 'g/mol', value: 2.016 }
      },
      note: 'The peak of the Maxwell–Boltzmann distribution. The defaults are hydrogen in the upper atmosphere.',
      stories: {
        vmp: 'Hydrogen molecules ($M$ = {M}) in the thermosphere are at about {T}. What is their most probable speed?',
        T: 'At what temperature would molecules of molar mass {M} have a most probable speed of {vmp}?'
      }
    }
  ],
  examples: [
    {
      title: 'Hydrogen against nitrogen',
      q: 'Find $v_\\text{rms}$ for hydrogen and for nitrogen at 25 °C, and the ratio of the two.',
      steps: [
        { text: 'Hydrogen, $M = 2.016 \\times 10^{-3}$ kg/mol:', tex: 'v_\\text{rms} = \\sqrt{\\frac{3 \\times 8.314 \\times 298.15}{2.016 \\times 10^{-3}}} = 1921\\ \\mathrm{m/s}' },
        { text: 'Nitrogen, $M = 28.01 \\times 10^{-3}$ kg/mol:', tex: 'v_\\text{rms} = \\sqrt{\\frac{3 \\times 8.314 \\times 298.15}{28.01 \\times 10^{-3}}} = 515\\ \\mathrm{m/s}' },
        'Ratio: $1921/515 = 3.73 = \\sqrt{28.01/2.016}$. Speeds scale as $1/\\sqrt{M}$ — the root of Graham\'s law of effusion.'
      ],
      a: 'Hydrogen 1921 m/s, nitrogen 515 m/s: hydrogen is 3.7 times faster.'
    },
    {
      title: 'Matching speeds',
      q: 'To what temperature would you have to heat oxygen so that its molecules have the same $v_\\text{rms}$ as hydrogen at 25 °C?',
      steps: [
        'Equal $v_\\text{rms}$ means equal $T/M$: $T_{\\ce{O2}}/M_{\\ce{O2}} = T_{\\ce{H2}}/M_{\\ce{H2}}$.',
        '$T_{\\ce{O2}} = 298.15 \\times 32.00/2.016 = 4730\\ \\mathrm{K}$.',
        'Hotter than the surface of many stars — the mass difference is a factor of 16, and speed goes only as its square root.'
      ],
      a: 'About 4730 K.'
    }
  ],
  quiz: [
    { q: 'Helium and argon are at the same temperature. Which statement is true?', choices: ['argon atoms have more kinetic energy on average', 'helium atoms have more kinetic energy on average', 'their average kinetic energies are equal, and helium atoms move faster', 'their speeds are equal'], a: 2,
      why: 'Average kinetic energy depends only on temperature. With equal $\\tfrac12 mv^2$, the lighter helium atoms must move faster — by $\\sqrt{39.95/4.003} = 3.2$ times.' },
    { q: 'The kelvin temperature of a gas is doubled. Its $v_\\text{rms}$ is multiplied by…', choices: ['2', '4', '$\\sqrt{2}$', '1/2'], a: 2,
      why: '$v_\\text{rms} \\propto \\sqrt{T}$: the kinetic energy doubles, the speed rises by $\\sqrt2 \\approx 1.41$.' },
    { q: 'What is $v_\\text{rms}$ for helium (4.003 g/mol) at 300 K?', answer: 1367, unit: 'm/s',
      why: '$v_\\text{rms} = \\sqrt{3 \\times 8.314 \\times 300/0.004003} = 1367$ m/s. Remember to use kg/mol.' },
    { q: 'In a sample of gas, every molecule moves at the root-mean-square speed.', a: false,
      why: 'Speeds are spread over the Maxwell–Boltzmann distribution, from almost zero to several times the average. $v_\\text{rms}$ is a particular average of them.' },
    { q: 'Gas molecules move at hundreds of metres per second, yet a smell takes many seconds to cross a room. Why?', choices: ['the molecules slow down in air', 'each molecule collides billions of times a second and follows a random zig-zag path', 'smell molecules are too heavy to move fast', 'the nose responds slowly'], a: 1,
      why: 'Between collisions a molecule travels only about 70 nm. Its path is a random walk, and the net distance grows only as the square root of time. Air currents do most of the carrying.' }
  ],
  applications: ['Why reaction rates rise steeply with temperature (the Maxwell–Boltzmann tail).', 'Which gases a planet or moon can keep in its atmosphere.', 'Isotope separation by effusion.', 'Vacuum technology, where molecular speeds and mean free paths set pumping rates.'],
  history: 'Daniel Bernoulli explained gas pressure by molecular impacts in 1738, but the idea was neglected for a century. Rudolf Clausius revived it in 1857, James Clerk Maxwell derived the speed distribution in 1860, and Ludwig Boltzmann generalised it in the 1870s.',
  sim: 'state-effusion'
},

{
  id: 'effusion-diffusion', parent: 'gases', title: 'Effusion and diffusion', level: 2,
  short: 'Gases escape through tiny holes (effusion) and spread into one another (diffusion). Lighter molecules do both faster: the rate goes as one over the square root of the molar mass (Graham\'s law).',
  keywords: ['effusion', 'diffusion', 'Graham\'s law', 'rate of effusion', 'molar mass from effusion', 'pinhole', 'helium balloon', 'ammonia and hydrogen chloride', 'uranium enrichment', 'UF6', 'gaseous diffusion', 'isotope separation'],
  prereq: ['kinetic-molecular-theory', 'molar-mass'],
  related: ['physics:mean-free-path', 'physics:maxwell-boltzmann', 'isotopes', 'fission-fusion', 'math:exponential-functions'],
  body: `
A party balloon filled with helium is sad and wrinkled by the next morning; an identical one filled with air still looks fine. Helium atoms slip through the tiny pores of the rubber far more often than nitrogen and oxygen molecules, because they are moving faster.

### Effusion: escaping through a pinhole
**Effusion** is the escape of gas through a hole so small that molecules go through one at a time, without colliding on the way — the hole must be smaller than the mean free path. The rate of escape is then simply the rate at which molecules happen to arrive at the hole, which is proportional to their number density and their mean speed. At the same temperature and pressure, the mean speed goes as $1/\\sqrt{M}$ ([[kinetic-molecular-theory]]), so

$$\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}$$

This is **Graham's law** (1846). Helium ($M$ = 4.00) effuses $\\sqrt{28.96/4.00} = 2.7$ times faster than air. Turned around, timing how long a fixed amount of an unknown gas takes to effuse, against a known one, gives its molar mass:

$$\\frac{t_2}{t_1} = \\sqrt{\\frac{M_2}{M_1}}$$

### Diffusion: spreading through another gas
**Diffusion** is the mixing of one gas into another by random motion. It is much slower than the molecular speeds suggest, because every molecule collides with its neighbours billions of times a second and follows a zig-zag path. In air at room conditions a molecule spreads only about $\\sqrt{2Dt}$, with a diffusion coefficient $D \\approx 0.2\\ \\mathrm{cm^2/s}$: 5 cm in a minute, 40 cm in an hour. The smell of coffee crosses a kitchen in seconds only because air currents carry it.

Light molecules still diffuse faster, and Graham's law holds roughly for diffusion too. The classic demonstration: cotton wool soaked in ammonia at one end of a glass tube, in hydrochloric acid at the other. The gases meet and form a white ring of ammonium chloride, $\\ce{NH3(g) + HCl(g) -> NH4Cl(s)}$, about 59 % of the way from the ammonia end — lighter ammonia ($M$ = 17.0) travels $\\sqrt{36.5/17.0} = 1.46$ times as far as the hydrogen chloride.

### Separating isotopes
Because the rate depends on mass, effusion can separate isotopes. Natural uranium is only 0.72 % uranium-235; reactors need 3–5 %. The only volatile uranium compound is uranium hexafluoride, $\\ce{UF6}$, a solid that sublimes at 56.5 °C. The molar masses of $\\ce{^{235}UF6}$ and $\\ce{^{238}UF6}$ are 349.03 and 352.04 g/mol, so each pass through a porous barrier enriches the lighter one by a factor of only

$$\\alpha = \\sqrt{\\frac{352.04}{349.03}} = 1.0043$$

Reaching 4 % takes about 410 ideal stages in series; real gaseous-diffusion plants such as Oak Ridge's K-25, built for the Manhattan Project, had thousands of stages in one of the largest buildings in the world, and used as much electricity as a city. Gas centrifuges, which separate by mass far more efficiently, replaced them from the 1970s on.
`,
  ideas: [
    'Effusion is escape through a pinhole, one molecule at a time; diffusion is mixing through another gas, slowed by collisions.',
    'At equal temperature and pressure, effusion rates are inversely proportional to the square roots of the molar masses (Graham\'s law).',
    'Times for equal amounts to effuse go the other way: t is proportional to √M.',
    'Timing effusion against a known gas gives the molar mass of an unknown one.',
    'Small mass differences give small separation factors, so isotope enrichment by effusion needs many stages.'
  ],
  pitfalls: [
    'A gas twice as heavy effuses half as fast — The rate goes as 1/√M: twice the mass gives 1/√2, about 71 % of the rate.',
    'Diffusion happens at the molecular speed — Collisions every tenth of a nanosecond turn the motion into a slow random walk; diffusion over a metre takes hours.',
    'Graham\'s law compares rates at any conditions — Both gases must be at the same temperature and pressure (or the rates must be corrected for them).'
  ],
  formulas: [
    {
      name: 'Graham\'s law: relative rates of effusion',
      expr: 'r1 = r2*sqrt(M2/M1)', tex: '\\frac{r_1}{r_2} = \\sqrt{\\frac{M_2}{M_1}}',
      vars: {
        r1: { name: 'effusion rate of gas 1', q: 'flowrate', unit: 'mL/s', tex: 'r_1' },
        r2: { name: 'effusion rate of gas 2', q: 'flowrate', unit: 'mL/s', value: 0.10, tex: 'r_2' },
        M1: { name: 'molar mass of gas 1', q: 'molarmass', unit: 'g/mol', value: 4.0026, tex: 'M_1' },
        M2: { name: 'molar mass of gas 2', q: 'molarmass', unit: 'g/mol', value: 28.96, tex: 'M_2' }
      },
      solveFor: 'r1',
      note: 'Both gases at the same temperature and pressure. Defaults: helium against air.',
      stories: {
        r1: 'Air ($M$ = {M2}) leaks out of a balloon through its pores at {r2}. At what rate would helium ($M$ = {M1}) leak out of the same balloon under the same conditions?',
        M1: 'A gas effuses through a pinhole at {r1}, while oxygen ($M$ = {M2}) effuses through the same pinhole at {r2}. What is the molar mass of the gas?'
      }
    },
    {
      name: 'Effusion times and molar mass',
      expr: 't2 = t1*sqrt(M2/M1)', tex: '\\frac{t_2}{t_1} = \\sqrt{\\frac{M_2}{M_1}}',
      vars: {
        t2: { name: 'time for the unknown gas', q: 'time', unit: 's', value: 74.4, tex: 't_2' },
        t1: { name: 'time for the reference gas', q: 'time', unit: 's', value: 50.0, tex: 't_1' },
        M2: { name: 'molar mass of the unknown gas', q: 'molarmass', unit: 'g/mol', tex: 'M_2' },
        M1: { name: 'molar mass of the reference gas', q: 'molarmass', unit: 'g/mol', value: 32.00, tex: 'M_1' }
      },
      solveFor: 'M2',
      note: 'The same volume of each gas, at the same temperature and pressure, effusing through the same hole. Heavier gases take longer.',
      stories: {
        M2: 'A volume of oxygen ($M$ = {M1}) takes {t1} to effuse through a pinhole. The same volume of a yellow-green gas takes {t2}. What is its molar mass?',
        t2: 'A volume of oxygen ($M$ = {M1}) takes {t1} to effuse. How long would the same volume of a gas of molar mass {M2} take?'
      }
    },
    {
      name: 'Isotope enrichment over ideal stages',
      expr: 'Rn = R0*alpha^N', tex: 'R_N = R_0\\,\\alpha^N',
      vars: {
        Rn: { name: 'isotope ratio after N stages (light : heavy)', tex: 'R_N' },
        R0: { name: 'starting isotope ratio (light : heavy)', value: 0.00716, tex: 'R_0' },
        alpha: { name: 'separation factor per stage', value: 1.0043, min: 1.00001, max: 2, tex: '\\alpha' },
        N: { name: 'number of stages', int: true, value: 411 }
      },
      solveFor: 'Rn',
      note: 'For ideal effusion $\\alpha = \\sqrt{M_\\text{heavy}/M_\\text{light}}$. The defaults are uranium hexafluoride: natural uranium (ratio 0.00716, i.e. 0.711 % uranium-235) enriched to reactor grade. A ratio $R$ is a fraction $R/(1 + R)$ of the light isotope.',
      stories: {
        Rn: 'Natural uranium has a $\\ce{^{235}U}$ : $\\ce{^{238}U}$ ratio of {R0}. After {N} ideal effusion stages, each with a separation factor of {alpha}, what is the ratio?'
      }
    }
  ],
  examples: [
    {
      title: 'Identifying a gas by its effusion time',
      q: 'A volume of oxygen takes 50.0 s to effuse through a pinhole. The same volume of an unknown yellow-green gas, at the same temperature and pressure, takes 74.4 s. What is its molar mass, and what might it be?',
      steps: [
        { text: 'Times scale as $\\sqrt{M}$, so', tex: 'M_2 = M_1 \\left(\\frac{t_2}{t_1}\\right)^2 = 32.00 \\times \\left(\\frac{74.4}{50.0}\\right)^2 = 70.9\\ \\mathrm{g/mol}' },
        'A yellow-green gas of molar mass 70.9 g/mol: chlorine, $\\ce{Cl2}$ (70.90 g/mol).'
      ],
      a: '70.9 g/mol — chlorine.'
    },
    {
      title: 'Where does the white ring form?',
      q: 'A 100 cm glass tube has cotton wool soaked in concentrated ammonia at one end and in concentrated hydrochloric acid at the other. Where does the ring of ammonium chloride appear, according to Graham\'s law?',
      steps: [
        'In the same time, the distances travelled are in the ratio of the rates: $d_{\\ce{NH3}}/d_{\\ce{HCl}} = \\sqrt{36.46/17.03} = 1.463$.',
        'The two distances add up to the length of the tube: $d_{\\ce{NH3}} + d_{\\ce{HCl}} = 100$ cm.',
        '$d_{\\ce{NH3}} = 100 \\times 1.463/2.463 = 59.4$ cm from the ammonia end.',
        'In practice the ring forms a little nearer the acid end still, because diffusion through air is not pure effusion — but the prediction is close.'
      ],
      a: 'About 59 cm from the ammonia end, 41 cm from the acid.'
    }
  ],
  quiz: [
    { q: 'Two identical balloons, one filled with helium and one with air, are left overnight. Which shrinks more?', choices: ['the air balloon', 'the helium balloon', 'both shrink equally', 'neither: rubber is gas-tight'], a: 1,
      why: 'Helium atoms move about 2.7 times faster than the molecules of air at the same temperature, so they find and pass the pores of the rubber more often.' },
    { q: 'How many times faster does helium (4.00 g/mol) effuse than methane (16.04 g/mol)?', answer: 2.0, unit: '',
      why: '$\\sqrt{16.04/4.00} = 2.00$. Four times the mass, half the rate.' },
    { q: 'Gas A is twice as heavy as gas B. Under the same conditions, A effuses at…', choices: ['half the rate of B', 'about 71 % of the rate of B', 'twice the rate of B', 'a quarter of the rate of B'], a: 1,
      why: 'Rate goes as $1/\\sqrt{M}$: $1/\\sqrt2 = 0.71$.' },
    { q: 'Why does separating uranium isotopes by effusion need hundreds of stages?', choices: ['uranium hexafluoride reacts with the barrier', 'the two isotopes\' molar masses differ by less than 1 %, so each stage enriches by only 0.43 %', 'effusion only works at very low temperatures', 'the lighter isotope is radioactive'], a: 1,
      why: 'The separation factor is $\\sqrt{352.04/349.03} = 1.0043$ per stage. Multiplying the ratio by six to reach reactor grade takes about 410 ideal stages.' }
  ],
  applications: ['Uranium enrichment by gaseous diffusion (historically) and the reason centrifuges replaced it.', 'Leak testing with helium, which finds the smallest holes fastest.', 'Choosing balloon gases and gas-tight materials.', 'Measuring molar masses and vapour pressures (the Knudsen cell).'],
  history: 'Thomas Graham measured the rates at which gases pass through porous plugs and pinholes and published his law in 1846, before the kinetic theory that explains it.',
  sim: 'state-effusion'
},

{
  id: 'real-gases', parent: 'gases', title: 'Real gases and the van der Waals equation', level: 3,
  short: 'Real molecules take up room and attract one another. At high pressure and low temperature this makes gases deviate from PV = nRT; the compressibility factor measures by how much, and the van der Waals equation explains why.',
  keywords: ['real gas', 'non-ideal gas', 'van der Waals equation', 'compressibility factor', 'Z', 'excluded volume', 'intermolecular attraction', 'critical point', 'critical temperature', 'liquefaction', 'isotherm', 'Boyle temperature'],
  prereq: ['ideal-gas-law', 'kinetic-molecular-theory', 'intermolecular-forces'],
  related: ['phase-diagrams', 'vapor-pressure', 'physics:ideal-gas-law', 'math:polynomials', 'math:newtons-method'],
  body: `
The ideal gas law assumes molecules with no size and no attraction. Both assumptions are good when the gas is thin and hot, and both fail when it is squeezed or cooled — which is exactly when a gas is about to become a liquid. A clean way to see the failure is the **compressibility factor**

$$Z = \\frac{PV_m}{RT}$$

which is exactly 1 for an ideal gas. $Z < 1$ means the gas takes *less* room than ideal (the molecules pull one another together); $Z > 1$ means it takes *more* (the molecules' own volume gets in the way).

### Two corrections
In 1873 Johannes van der Waals patched the ideal gas law with two constants for each gas:

$$\\left(P + \\frac{a n^2}{V^2}\\right)(V - nb) = nRT \\qquad\\text{or}\\qquad P = \\frac{RT}{V_m - b} - \\frac{a}{V_m^2}$$

- **$b$ — excluded volume.** Molecules cannot overlap, so the room they can move in is less than $V$ by $nb$. For nitrogen $b$ = 0.0386 L/mol, about four times the volume of the molecules themselves; it corresponds to a molecular radius of about 0.16 nm.
- **$a$ — attraction.** A molecule about to hit the wall is pulled back by its neighbours, so it hits more gently. The effect grows with the number of molecules hitting and the number pulling, hence $n^2/V^2$. Big, polarisable or polar molecules have large $a$.

| Gas | $\\ce{He}$ | $\\ce{H2}$ | $\\ce{N2}$ | $\\ce{O2}$ | $\\ce{CH4}$ | $\\ce{CO2}$ | $\\ce{NH3}$ | $\\ce{H2O}$ |
|---|---|---|---|---|---|---|---|---|
| $a$ (L²·bar/mol²) | 0.0346 | 0.247 | 1.37 | 1.38 | 2.30 | 3.66 | 4.23 | 5.53 |
| $b$ (L/mol) | 0.0237 | 0.0266 | 0.0386 | 0.0319 | 0.0431 | 0.0428 | 0.0372 | 0.0305 |

(1 L²·bar/mol² = 0.1 Pa·m⁶/mol². These values are fitted to each gas's critical point.)

### Reading a Z chart
At 0 °C and moderate pressures, methane and carbon dioxide dip well below $Z = 1$: attraction wins. At several hundred bar every gas rises above 1, because the molecules are crowded and their own volume dominates. Hydrogen and helium, with tiny attractions, sit above 1 at all pressures at room temperature. Raise the temperature and the dips shrink, since fast molecules are hardly held back by weak attractions; at the **Boyle temperature** the two effects cancel over a wide range of pressure.

### Condensation and the critical point
Below a gas's **critical temperature** the van der Waals isotherms develop a wiggle — a sign that the gas, compressed far enough, splits into liquid and vapour. Above it, no amount of pressure makes a liquid. The model predicts the critical point from $a$ and $b$ alone:

$$T_c = \\frac{8a}{27Rb}, \\qquad P_c = \\frac{a}{27b^2}, \\qquad V_{m,c} = 3b$$

Carbon dioxide's $T_c$ is 31 °C, so on a hot day, above 31 °C, the "liquid" in a carbon dioxide cylinder is really a supercritical fluid; nitrogen's is −147 °C, which is why air must be cooled far below room temperature before any pressure will liquefy it ([[phase-diagrams]]).

> [!tip] Engineering practice: natural gas stored at 200 bar has $Z \\approx 0.8$, so a tank holds about 25 % more gas than $PV = nRT$ predicts. Pipeline and cylinder calculations always include $Z$.
`,
  ideas: [
    'The compressibility factor Z = PV/(nRT) is 1 for an ideal gas; the deviation measures non-ideality.',
    'Attractions between molecules make Z less than 1; the molecules\' own volume makes it greater than 1.',
    'The van der Waals equation adds a (attraction) and b (excluded volume) to the ideal gas law.',
    'Gases are most ideal at high temperature and low pressure, least ideal near condensation.',
    'Above its critical temperature a gas cannot be liquefied by pressure alone.'
  ],
  pitfalls: [
    'Real gases always take up less room than ideal ones — Only while attractions dominate. At high enough pressure every gas has Z > 1.',
    'The constant b is the volume of the molecules — It is about four times the molecules\' own volume per mole, because of how pairs of spheres exclude each other.',
    'The van der Waals equation is exact for real gases — It captures the right behaviour qualitatively but can be off by tens of per cent near the critical point; engineers use more elaborate equations of state.'
  ],
  formulas: [
    {
      name: 'Compressibility factor',
      expr: 'Z = P*Vm/(R*T)', tex: 'Z = \\frac{PV_m}{RT}',
      vars: {
        Z: { name: 'compressibility factor' },
        P: { name: 'pressure', q: 'pressure', unit: 'bar', value: 100 },
        Vm: { name: 'molar volume (volume per mole)', q: 'molarvolume', unit: 'L/mol', value: 0.200, tex: 'V_m' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 }
      },
      note: 'Z = 1 for an ideal gas; Z < 1 means attractions win, Z > 1 means repulsions (molecular size) win.',
      stories: {
        Z: 'One mole of a gas at {T} occupies {Vm} at a pressure of {P}. What is its compressibility factor?',
        P: 'A gas with compressibility factor {Z} occupies {Vm} per mole at {T}. What is its pressure?'
      }
    },
    {
      name: 'Van der Waals equation (per mole)',
      expr: 'P = R*T/(Vm - b) - a/Vm^2', tex: 'P = \\frac{RT}{V_m - b} - \\frac{a}{V_m^2}',
      vars: {
        P: { name: 'pressure', q: 'pressure', unit: 'bar' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 300 },
        Vm: { name: 'molar volume', q: 'molarvolume', unit: 'L/mol', value: 0.500, tex: 'V_m' },
        b: { name: 'excluded volume per mole', q: 'molarvolume', unit: 'L/mol', value: 0.04285 },
        a: { name: 'attraction constant', unit: 'Pa·m⁶/mol²', value: 0.3657 }
      },
      note: 'The constant $a$ is in SI, Pa·m⁶/mol² (divide a table value in L²·bar/mol² by 10). The defaults are carbon dioxide; the ideal gas law would give 49.9 bar. Solving for $V_m$ is a cubic, found numerically.',
      stories: {
        P: 'One mole of carbon dioxide ($a$ = {a}, $b$ = {b}) is held in {Vm} at {T}. What pressure does the van der Waals equation predict?',
        T: 'At what temperature does carbon dioxide ($a$ = {a}, $b$ = {b}) exert {P} when each mole occupies {Vm}?'
      }
    },
    {
      name: 'Critical temperature from van der Waals constants',
      expr: 'Tc = 8*a/(27*R*b)', tex: 'T_c = \\frac{8a}{27Rb}',
      vars: {
        Tc: { name: 'critical temperature', q: 'temperature', unit: 'K', tex: 'T_c' },
        a: { name: 'attraction constant', unit: 'Pa·m⁶/mol²', value: 0.3657 },
        R: { const: 'R' },
        b: { name: 'excluded volume per mole', q: 'molarvolume', unit: 'L/mol', value: 0.04285 }
      },
      note: 'Strong attraction (large $a$) raises the critical temperature; a larger molecule (larger $b$) lowers it for the same attraction. Defaults: carbon dioxide.',
      stories: {
        Tc: 'A gas has van der Waals constants $a$ = {a} and $b$ = {b}. Above what temperature can it not be liquefied?'
      }
    }
  ],
  examples: [
    {
      title: 'Carbon dioxide squeezed into half a litre',
      q: 'One mole of carbon dioxide is held in 0.500 L at 300 K. Compare the pressure predicted by the ideal gas law with the van der Waals equation ($a$ = 3.66 L²·bar/mol², $b$ = 0.0428 L/mol).',
      steps: [
        { text: 'Ideal:', tex: 'P = \\frac{RT}{V_m} = \\frac{0.08314 \\times 300}{0.500} = 49.9\\ \\mathrm{bar}' },
        { text: 'Van der Waals:', tex: 'P = \\frac{0.08314 \\times 300}{0.500 - 0.0428} - \\frac{3.66}{0.500^2} = 54.6 - 14.6 = 39.9\\ \\mathrm{bar}' },
        'The excluded volume raises the pressure by about 9 %, the attractions lower it by 29 %: net, the real gas pushes 20 % less than an ideal one. $Z = 39.9/49.9 = 0.80$.'
      ],
      a: 'Ideal 49.9 bar; van der Waals 39.9 bar. A more accurate equation of state gives about 38 bar, so van der Waals gets most of the way.'
    },
    {
      title: 'A compressed natural gas tank',
      q: 'A 50 L tank of methane is filled to 200 bar at 20 °C. The van der Waals equation gives $Z = 0.81$ under these conditions. How much methane does the tank really hold, compared with the ideal-gas estimate?',
      steps: [
        { text: 'Ideal estimate:', tex: 'n = \\frac{PV}{RT} = \\frac{200 \\times 10^5 \\times 0.050}{8.314 \\times 293.15} = 410\\ \\mathrm{mol}' },
        { text: 'With $PV = ZnRT$:', tex: 'n = \\frac{PV}{ZRT} = \\frac{410}{0.81} = 504\\ \\mathrm{mol}' },
        'About 23 % more gas (8.1 kg instead of 6.6 kg) fits in, because attractions pull the molecules closer than an ideal gas would allow.'
      ],
      a: 'About 500 mol rather than 410 mol.'
    }
  ],
  quiz: [
    { q: 'A gas at moderate pressure has $Z = 0.85$. This means…', choices: ['attractions between molecules dominate', 'the molecules\' own volume dominates', 'the gas is ideal', 'the gas is above its critical temperature'], a: 0,
      why: 'Z < 1 means the gas occupies less volume than an ideal gas would at that T and P: its molecules are pulled together.' },
    { q: 'Which of these gases has the largest van der Waals constant $a$?', choices: ['$\\ce{He}$', '$\\ce{N2}$', '$\\ce{CO2}$', '$\\ce{H2O}$'], a: 3,
      why: 'Water molecules are strongly polar and hydrogen-bond: $a$ = 5.53 against 3.66 for carbon dioxide, 1.37 for nitrogen and 0.035 for helium.' },
    { q: 'Gases behave most nearly ideally at high temperature and low pressure.', a: true,
      why: 'Low pressure: the molecules are far apart, so their size and attractions hardly matter. High temperature: they move too fast for attractions to hold them back.' },
    { q: 'Why does $Z$ rise above 1 for every gas at very high pressure?', choices: ['the attractions reverse', 'the molecules\' own volume becomes a large part of the total', 'the molecules move faster', 'the gas becomes a liquid'], a: 1,
      why: 'At hundreds of bar the molecules fill a sizeable part of the container, so the free space is less than $V$ and the pressure is higher than ideal.' },
    { q: 'One mole of a gas occupies 0.200 L at 100 bar and 300 K. What is $Z$?', answer: 0.802, unit: '',
      why: '$Z = PV_m/RT = (100 \\times 10^5 \\times 0.200 \\times 10^{-3})/(8.314 \\times 300) = 0.802$.' }
  ],
  applications: ['Designing gas cylinders, pipelines and compressors (with Z or an equation of state).', 'Liquefying air, natural gas and carbon dioxide.', 'Supercritical carbon dioxide as a solvent.', 'Estimating molecular sizes from b.'],
  history: 'Johannes Diderik van der Waals proposed his equation in his 1873 doctoral thesis, one of the first theories to treat gas and liquid as a single fluid. He received the Nobel Prize in Physics in 1910; the weak attractions between molecules still carry his name.',
  sim: 'state-real-gas'
}

);
