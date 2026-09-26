/* HYPER-PHYSICS · content/thermodynamics.js — the laws of thermodynamics: equilibrium,
 * energy bookkeeping, the standard processes, the direction of time, engines,
 * refrigerators, entropy and absolute zero.
 *
 * Sign convention used throughout: Q is the heat added TO the system, W the work done
 * BY the system, so the first law reads ΔU = Q − W. */
Hyper.add(

{
  id: 'zeroth-law', parent: 'thermodynamics', title: 'Zeroth law and thermal equilibrium', level: 1,
  short: 'If two bodies are each in thermal equilibrium with a third, they are in equilibrium with each other — the fact that makes temperature, and thermometers, meaningful.',
  keywords: ['zeroth law', 'thermal equilibrium', 'thermal contact', 'thermometer', 'transitive', 'definition of temperature', 'diathermal wall', 'adiabatic wall', 'heat capacity of a thermometer'],
  prereq: ['temperature', 'heat-internal-energy'],
  related: ['first-law-thermodynamics', 'specific-heat', 'second-law-thermodynamics', 'entropy'],
  body: `
Put a hot brick against a cold one and wrap them in a blanket. Heat flows from the hot brick into the cold one, the first cools, the second warms, and after a while nothing changes any more: their properties stop drifting and no net heat flows between them. They have reached **thermal equilibrium**.

Walls that let heat through are called *diathermal*; walls that block it completely are *adiabatic* (a good vacuum flask comes close). Two bodies in thermal contact through a diathermal wall end up in equilibrium with each other.

### The law
> [!key] If body A is in thermal equilibrium with body C, and body B is in thermal equilibrium with body C, then A and B are in thermal equilibrium with each other.

It sounds too obvious to need saying — but plenty of relations are not like this. If A is a friend of C and B is a friend of C, A and B need not be friends. The zeroth law says that thermal equilibrium *is* transitive, and that is exactly what a thermometer relies on. The thermometer is body C: dip it in A and read it, dip it in B and read it; if the readings match, A and B will exchange no heat when brought together, though they never touched the same thermometer at the same time.

Mathematically, the law guarantees that there is a single quantity — **temperature** — that is equal for all bodies in mutual equilibrium and different for bodies that are not. The first and second laws had already been numbered when physicists noticed that this more basic assumption lay under both; it was called the "zeroth" law in the 1930s.

### What equilibrium does and does not mean
Bodies in equilibrium have the same *temperature*, not the same internal energy: a swimming pool and a glass of water taken from it are in equilibrium, though the pool holds hundreds of thousands of times more internal energy. Nor need they *feel* the same to the touch ([[conduction]] decides that).

### A thermometer changes what it measures
A thermometer reaches equilibrium by exchanging heat with the sample, so it shifts the sample's temperature a little. The shared final temperature is the heat-capacity-weighted average of the two ([[specific-heat|calorimetry]]). A good thermometer therefore has a heat capacity much smaller than the sample's: a fine thermocouple wire reads a drop of liquid well, a thick glass thermometer does not. It must also be given time — enough for the heat to flow and the reading to settle.

> [!note] At a deeper level, heat flows between two bodies until their total [[entropy]] is as large as possible. That happens when a single quantity, $\\partial S/\\partial U$, is equal for both — and that quantity is $1/T$. The second law thus gives temperature its precise meaning.
`,
  ideas: [
    'Thermal equilibrium: bodies in contact whose properties have stopped changing and between which no net heat flows.',
    'Zeroth law: two bodies each in equilibrium with a third are in equilibrium with each other.',
    'The law guarantees that temperature exists as a single quantity equal for bodies in equilibrium.',
    'A thermometer reads its own temperature after reaching equilibrium with the sample.',
    'A good thermometer has a small heat capacity compared with what it measures.'
  ],
  pitfalls: [
    'Bodies in equilibrium have equal amounts of thermal energy — They have equal temperatures. A bath and a cup of water at 40 °C are in equilibrium though the bath holds far more energy.',
    'A thermometer shows the temperature the sample had before it was inserted — It shows its own temperature once they have come to equilibrium; a large, cold thermometer can noticeably cool a small sample.'
  ],
  formulas: [
    {
      name: 'Reading of a thermometer that disturbs its sample',
      expr: 'T = (Cs*Ts + Ct*Tt)/(Cs + Ct)', tex: 'T = \\frac{C_s T_s + C_t T_t}{C_s + C_t}',
      vars: {
        T: { name: 'common temperature (the reading)', q: 'temperature', unit: '°C' },
        Cs: { name: 'heat capacity of the sample', q: 'heatcap', unit: 'J/K', value: 42, tex: 'C_s' },
        Ts: { name: 'sample temperature before measuring', q: 'temperature', unit: '°C', value: 60, tex: 'T_s' },
        Ct: { name: 'heat capacity of the thermometer', q: 'heatcap', unit: 'J/K', value: 10, tex: 'C_t' },
        Tt: { name: 'thermometer temperature before measuring', q: 'temperature', unit: '°C', value: 20, tex: 'T_t' }
      },
      note: 'No heat escapes to the surroundings during the measurement. The default sample is 10 g of water (42 J/K).',
      practice: { unknowns: ['T', 'Ts'] },
      stories: {
        T: 'A thermometer with heat capacity {Ct}, at {Tt}, is dipped into a sample with heat capacity {Cs} at {Ts}. What does it read once they are in equilibrium?',
        Ts: 'A thermometer ({Ct}, starting at {Tt}) settles at {T} in a sample of heat capacity {Cs}. What was the sample\'s temperature before it was measured?'
      }
    }
  ],
  examples: [
    {
      title: 'Measuring a small sample',
      q: 'A glass thermometer (heat capacity 10 J/K) at room temperature, 20 °C, is dipped into 10 g of water at 60 °C (heat capacity 42 J/K). What does it read? What would a thermocouple with 0.05 J/K read?',
      steps: [
        'Glass thermometer: $T = \\dfrac{42 \\times 60 + 10 \\times 20}{42 + 10} = \\dfrac{2720}{52} = 52.3$ °C — almost 8 degrees low.',
        'Thermocouple: $T = \\dfrac{42 \\times 60 + 0.05 \\times 20}{42.05} = 59.95$ °C.',
        'The smaller the thermometer\'s heat capacity, the less it disturbs what it measures.'
      ],
      a: '52.3 °C with the glass thermometer, 59.95 °C with the thermocouple'
    }
  ],
  quiz: [
    { q: 'A thermometer reads 25.0 °C in beaker A and 25.0 °C in beaker B. When A and B are put in thermal contact…', choices: ['heat flows from the larger to the smaller', 'no net heat flows between them', 'heat flows from B to A', 'it depends on what liquids they hold'], a: 1,
      why: 'Both are in equilibrium with the thermometer, so by the zeroth law they are in equilibrium with each other.' },
    { q: 'Which of these is NOT a condition of thermal equilibrium between two bodies in contact?', choices: ['Equal temperatures', 'No net heat flow', 'Equal internal energies', 'Properties no longer changing'], a: 2,
      why: 'Internal energy depends on size and material; a bath and a cup can be in equilibrium with very different energies.' },
    { q: 'To measure the temperature of a single drop of liquid accurately, the best thermometer has a small heat capacity.', a: true,
      why: 'The reading is a heat-capacity-weighted average of the two starting temperatures, so a thermometer with little heat capacity barely disturbs the drop.' },
    { q: 'Why must a clinical thermometer stay under the tongue for a while?', choices: ['To warm the mouth', 'Heat must flow until thermometer and body reach equilibrium', 'The mercury must expand by a fixed amount', 'To let the body cool down'], a: 1,
      why: 'A thermometer only ever reports its own temperature; that equals the body\'s only after enough heat has flowed for equilibrium.' }
  ],
  applications: ['Every thermometer and temperature sensor.', 'Calibration against fixed points such as the triple point of water.', 'Choosing sensor sizes so that the measurement barely disturbs the sample.']
},

{
  id: 'first-law-thermodynamics', parent: 'thermodynamics', title: 'First law of thermodynamics', level: 2,
  short: 'Energy is conserved, heat included: the change in a system\'s internal energy equals the heat put in minus the work the system does, ΔU = Q − W.',
  keywords: ['first law of thermodynamics', 'conservation of energy', 'internal energy', 'heat', 'work done by a gas', 'ΔU = Q − W', 'sign convention', 'state function', 'p dV work', 'perpetual motion', 'energy balance'],
  prereq: ['heat-internal-energy', 'work', 'ideal-gas-law'],
  related: ['thermodynamic-processes', 'conservation-of-energy', 'heat-engines', 'second-law-thermodynamics'],
  body: `
A system — a gas in a cylinder, a kettle of water, a car engine — can gain or lose energy in two ways: **heat**, which flows because of a temperature difference, and **work**, done by forces. The **first law of thermodynamics** is the law of [[conservation-of-energy|conservation of energy]] with heat included:

$$\\Delta U = Q - W$$

> [!key] Sign convention used on this site: $Q$ is the heat added **to** the system (negative if heat leaves); $W$ is the work done **by** the system on its surroundings (negative if work is done on it). Many chemistry books write $\\Delta U = Q + W$ with $W$ the work done *on* the system — the same physics with the opposite sign for $W$.

Heat in raises the internal energy; work done by the system lowers it, because the system spends energy pushing on its surroundings.

### The work done by a gas
A gas at pressure $p$ pushes on a piston of area $A$ with force $pA$. When the piston moves out by $dx$ the gas does work $dW = pA\\,dx = p\\,dV$. Over a whole change of volume,

$$W = \\int_{V_1}^{V_2} p\\,dV$$

— the **area under the path** on a $p$–$V$ diagram. An expanding gas does positive work; a gas being compressed has negative $W$. At constant pressure it is simply $W = p\\,(V_2 - V_1)$.

### State functions and path functions
Internal energy is a **state function**: it depends only on the present state of the system (for an ideal gas, only on its temperature: $\\Delta U = nC_V\\Delta T$). Heat and work are not: they depend on *how* the system got from one state to another. Take a gas from the same state A to the same state B by two different routes on the $p$–$V$ diagram: the areas under the paths differ, so $W$ differs, and $Q$ differs by exactly the same amount, leaving $Q - W$ the same. Try it in the simulation below.

### Special cases
- **Isolated system**: $Q = 0$ and $W = 0$, so $U$ is constant.
- **Cycle**: the system returns to its starting state, $\\Delta U = 0$, so the net work done equals the net heat absorbed. Every [[heat-engines|heat engine]] relies on this.
- **Adiabatic** process ($Q = 0$): all the work comes out of the internal energy, $W = -\\Delta U$. A gas that expands without heat input cools.
- **Free expansion** into a vacuum: no heat and no work (nothing to push against), so $\\Delta U = 0$ and an ideal gas keeps its temperature.

### Numbers
Boiling 1 kg of water at atmospheric pressure takes $Q = 2256$ kJ. The steam fills 1.67 m³, so it pushes back the atmosphere with $W = p\\Delta V = 101\\,325 \\times 1.67 \\approx 169$ kJ. The rest, $\\Delta U \\approx 2087$ kJ, goes into separating the molecules.

The first law rules out any machine that produces work from nothing — a "perpetual motion machine of the first kind". It does *not* rule out turning heat entirely into work, or heat flowing from cold to hot; for those limits you need the [[second-law-thermodynamics|second law]].
`,
  ideas: [
    'ΔU = Q − W, with Q the heat added to the system and W the work done by it.',
    'The work done by a gas is ∫p dV, the area under its path on a p–V diagram.',
    'U is a state function; Q and W depend on the path, but Q − W does not.',
    'Over a complete cycle ΔU = 0, so net work out equals net heat in.',
    'For an ideal gas, U depends only on temperature: ΔU = nC_VΔT.'
  ],
  pitfalls: [
    'Mixing sign conventions — Decide whether W is the work done by the gas (ΔU = Q − W, used here) or on it (ΔU = Q + W), and keep to it.',
    'Adding heat always raises the temperature — In an isothermal expansion heat flows in while the temperature stays fixed; in an adiabatic compression the temperature rises with no heat at all.',
    'A system contains heat and work — It contains internal energy. Heat and work exist only as transfers across its boundary.'
  ],
  formulas: [
    {
      name: 'First law',
      expr: 'dU = Q - W', tex: '\\Delta U = Q - W',
      vars: {
        dU: { name: 'change in internal energy', q: 'energy', unit: 'J', signed: true, tex: '\\Delta U' },
        Q: { name: 'heat added to the system', q: 'energy', unit: 'J', value: 500, signed: true },
        W: { name: 'work done by the system', q: 'energy', unit: 'J', value: 200, signed: true }
      },
      stories: {
        dU: 'A gas absorbs {Q} of heat and does {W} of work pushing a piston. By how much does its internal energy change?',
        Q: 'A gas does {W} of work while its internal energy changes by {dU}. How much heat was added?',
        W: 'A system gains {Q} of heat and its internal energy rises by {dU}. How much work did it do?'
      }
    },
    {
      name: 'Work done at constant pressure',
      expr: 'W = p*(V2 - V1)', tex: 'W = p\\,(V_2 - V_1)',
      vars: {
        W: { name: 'work done by the gas', q: 'energy', unit: 'J', signed: true },
        p: { name: 'pressure', q: 'pressure', unit: 'kPa', value: 200 },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 3 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 1 }
      },
      stories: { W: 'A gas at a constant {p} expands from {V1} to {V2}. How much work does it do?', V2: 'A gas at {p} starts at {V1} and does {W} of work. What is its final volume?' }
    },
    {
      name: 'Internal energy change of an ideal gas',
      expr: 'dU = n*Cv*dT', tex: '\\Delta U = n\\,C_V\\,\\Delta T',
      vars: {
        dU: { name: 'change in internal energy', q: 'energy', unit: 'J', signed: true, tex: '\\Delta U' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        Cv: { name: 'molar heat capacity at constant volume', q: 'molarheat', unit: 'J/(mol·K)', value: 20.79, tex: 'C_V' },
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', value: 50, signed: true, tex: '\\Delta T' }
      },
      note: 'Valid for any process of an ideal gas, because U depends only on T. $C_V = \\tfrac32 R$ for a monatomic gas, $\\tfrac52 R$ for a diatomic one.',
      stories: { dU: 'By how much does the internal energy of {n} of nitrogen (C_V = {Cv}) change when it warms by {dT}, whatever the process?' }
    }
  ],
  derivation: {
    title: 'Work done by an expanding gas',
    steps: [
      { text: 'The gas pushes on a piston of area $A$ with force $F = pA$. Moving the piston out by $dx$ does work', tex: 'dW = F\\,dx = pA\\,dx' },
      { text: 'The volume grows by $dV = A\\,dx$, so', tex: 'dW = p\\,dV' },
      { text: 'Add up the small steps of a slow (quasi-static) change, during which the gas always has a well-defined pressure:', tex: 'W = \\int_{V_1}^{V_2} p\\,dV' },
      { text: 'This is the area under the curve $p(V)$. Different paths between the same end states enclose different areas, so $W$ depends on the path; since $\\Delta U$ does not, $Q = \\Delta U + W$ depends on the path too.' }
    ]
  },
  examples: [
    {
      title: 'Heating a gas at constant pressure',
      q: 'One mole of nitrogen (diatomic, $C_V = \\tfrac52 R$) is heated at a constant pressure of 1 atm from 300 K to 400 K. Find $\\Delta U$, $W$ and $Q$.',
      steps: [
        '$\\Delta U = nC_V\\Delta T = 1 \\times 20.79 \\times 100 = 2079$ J.',
        'At constant pressure, $W = p\\Delta V = nR\\Delta T = 1 \\times 8.314 \\times 100 = 831$ J.',
        'First law: $Q = \\Delta U + W = 2079 + 831 = 2910$ J — which is $nC_p\\Delta T$ with $C_p = \\tfrac72 R$.',
        'Of the heat supplied, 29 % leaves again as work pushing back the surroundings.'
      ],
      a: 'ΔU = 2.08 kJ, W = 0.83 kJ, Q = 2.91 kJ'
    },
    {
      title: 'Where the energy of boiling goes',
      q: 'Boiling 1.00 kg of water at 100 °C and 1 atm takes 2256 kJ. The liquid occupies 0.00104 m³ and the steam 1.673 m³. How much of the energy goes into work and how much into internal energy?',
      steps: [
        '$W = p\\,\\Delta V = 101\\,325 \\times (1.673 - 0.00104) = 1.69\\times10^{5}$ J = 169 kJ.',
        '$\\Delta U = Q - W = 2256 - 169 = 2087$ kJ.',
        'About 7.5 % of the latent heat pays for pushing back the atmosphere; the rest separates the molecules.'
      ],
      a: 'W ≈ 169 kJ, ΔU ≈ 2087 kJ'
    }
  ],
  quiz: [
    { q: 'A gas is compressed by 300 J of work done on it, while it gives off 100 J of heat. Its internal energy changes by…', choices: ['+400 J', '+200 J', '−200 J', '−400 J'], a: 1,
      why: 'With our convention $W = -300$ J (work done by the gas) and $Q = -100$ J: $\\Delta U = -100 - (-300) = +200$ J.' },
    { q: 'Over one complete cycle of a heat engine, the net work done by the working gas equals…', choices: ['zero', 'the heat absorbed from the hot source only', 'the net heat absorbed', 'the change in internal energy'], a: 2,
      why: 'The gas returns to its starting state, so $\\Delta U = 0$ and $W_{net} = Q_{net}$.' },
    { q: 'The heat needed to take a gas from state A to state B is the same whatever path is followed.', a: false,
      why: 'Heat and work depend on the path; only their difference, $\\Delta U$, is fixed by the end states.' },
    { q: 'An ideal gas expands freely into a vacuum inside an insulated container. Its temperature…', choices: ['falls, because it expands', 'rises', 'stays the same', 'drops to absolute zero'], a: 2,
      why: 'No heat enters ($Q = 0$) and the gas pushes against nothing ($W = 0$), so $\\Delta U = 0$; for an ideal gas that means no temperature change.' },
    { q: 'On a p–V diagram, the work done by a gas during an expansion is…', choices: ['the slope of the path', 'the area under the path', 'the height of the final point', 'the length of the path'], a: 1,
      why: '$W = \\int p\\,dV$, the area between the path and the V axis.' }
  ],
  applications: ['Energy budgets of engines, turbines, compressors and refrigerators.', 'Why a bicycle pump warms and a spray can cools as it empties.', 'Chemical and biological energy accounting.'],
  history: 'Julius Robert Mayer (1842), James Joule (1843–1850) and Hermann von Helmholtz (1847) each arrived at the conservation of energy including heat. Rudolf Clausius wrote the first law in its modern form, with internal energy as a state function, in 1850.',
  sim: 'heat-pv-diagram'
},

{
  id: 'thermodynamic-processes', parent: 'thermodynamics', title: 'Thermodynamic processes', level: 2,
  short: 'The four textbook ways to change a gas — at constant temperature, pressure or volume, or with no heat exchanged — each with its own curve on the p–V diagram and its own split of energy into heat and work.',
  keywords: ['isothermal', 'adiabatic', 'isobaric', 'isochoric', 'isovolumetric', 'p-V diagram', 'p–V diagram', 'pV^γ', 'adiabatic index', 'quasi-static', 'reversible process', 'Mayer\'s relation', 'Cp', 'Cv', 'adiabatic lapse rate'],
  prereq: ['first-law-thermodynamics', 'ideal-gas-law', 'equipartition', 'math:definite-integral'],
  related: ['heat-engines', 'carnot-cycle', 'speed-of-sound', 'entropy'],
  body: `
Change the state of a gas slowly enough and it stays in equilibrium the whole time, with a definite pressure, volume and temperature at every moment. Such a **quasi-static** change traces a curve on the $p$–$V$ diagram. Four kinds of curve cover most of what engines and refrigerators do. For $n$ moles of ideal gas, with $W$ the work done *by* the gas ([[first-law-thermodynamics|first law]] $\\Delta U = Q - W$):

| Process | Held constant | Work by gas $W$ | Heat in $Q$ | $\\Delta U$ |
|---|---|---|---|---|
| Isochoric | volume | 0 | $nC_V\\Delta T$ | $nC_V\\Delta T$ |
| Isobaric | pressure | $p\\Delta V = nR\\Delta T$ | $nC_p\\Delta T$ | $nC_V\\Delta T$ |
| Isothermal | temperature | $nRT\\ln(V_2/V_1)$ | $= W$ | 0 |
| Adiabatic | no heat flows | $-\\Delta U$ | 0 | $nC_V\\Delta T$ |

### Isochoric and isobaric: two heat capacities
Heating at constant volume, all the heat goes into internal energy. Heating at constant pressure, the gas also expands and does work $nR\\Delta T$, so it needs more heat for the same temperature rise: $C_p = C_V + R$ (Mayer's relation). Their ratio $\\gamma = C_p/C_V$ is $5/3$ for a monatomic gas and $7/5$ for air ([[equipartition]]).

### Isothermal: heat in, work out
Keeping $T$ constant keeps $U$ constant, so every joule of work the gas does must be supplied as heat from its surroundings. The curve is Boyle's hyperbola, $pV = $ constant, and integrating $p\\,dV$ gives $W = nRT\\ln(V_2/V_1)$.

### Adiabatic: no heat, so the temperature must change
With no heat exchanged, a gas that does work pays for it out of its internal energy and cools; a gas that is compressed warms. For a reversible adiabatic change of an ideal gas (see the derivation)

$$pV^{\\gamma} = \\text{constant}, \\qquad TV^{\\gamma - 1} = \\text{constant}$$

Because $\\gamma > 1$, adiabats are steeper than isotherms on the $p$–$V$ diagram: compress a gas to half its volume isothermally and its pressure doubles; do it adiabatically and it rises by $2^{1.4} = 2.64$ for air, since the gas also heats up.

Real processes that are *fast* are nearly adiabatic, because heat has no time to flow:
- A bicycle pump gets hot. A diesel engine compresses air about 18-fold, heating it past 600 °C — hot enough to ignite the injected fuel without a spark.
- Air rising in the atmosphere expands as the pressure falls and cools by about 9.8 K per kilometre (the dry adiabatic lapse rate); when it reaches its dew point, clouds form.
- Sound waves compress and rarefy air too quickly for heat to flow between them, so the [[speed-of-sound|speed of sound]] involves $\\gamma$.

Slow processes in good thermal contact with the surroundings are nearly isothermal. Engines combine the four kinds into cycles ([[heat-engines]], [[carnot-cycle]]).
`,
  ideas: [
    'Quasi-static processes keep the gas in equilibrium, so they can be drawn as curves on a p–V diagram.',
    'Isochoric: W = 0. Isobaric: W = pΔV. Isothermal: ΔU = 0 and Q = W. Adiabatic: Q = 0 and W = −ΔU.',
    'C_p = C_V + R, because heating at constant pressure also does work.',
    'Reversible adiabatic: pV^γ = constant, steeper than the isotherm pV = constant.',
    'Fast processes are nearly adiabatic; slow ones in good thermal contact are nearly isothermal.'
  ],
  pitfalls: [
    'Adiabatic means constant temperature — Adiabatic means no heat exchanged. The temperature changes, because work is done.',
    'In an isothermal process no heat flows — The opposite: to keep T fixed while the gas does work, heat must flow in at exactly the rate work is done.',
    'pV^γ = constant holds for any process without heat — It holds for a slow, reversible adiabatic change of an ideal gas. A free expansion is adiabatic too, but does no work and leaves T unchanged.'
  ],
  formulas: [
    {
      name: 'Work in an isothermal process',
      expr: 'W = n*R*T*ln(V2/V1)', tex: 'W = nRT\\ln\\frac{V_2}{V_1}',
      vars: {
        W: { name: 'work done by the gas (= heat absorbed)', q: 'energy', unit: 'J', signed: true },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        T: { name: 'absolute temperature', q: 'temperature', unit: 'K', value: 300 },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 50 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 25 }
      },
      stories: {
        W: '{n} of ideal gas expands at a steady {T} from {V1} to {V2}. How much work does it do, and so how much heat does it absorb?',
        V2: 'At {T}, {n} of gas starting at {V1} absorbs {W} of heat while expanding isothermally. What is its final volume?'
      }
    },
    {
      name: 'Adiabatic change: pressure',
      expr: 'p2 = p1*(V1/V2)^gam', tex: 'p_2 = p_1\\left(\\frac{V_1}{V_2}\\right)^{\\gamma}',
      vars: {
        p2: { name: 'final pressure', q: 'pressure', unit: 'kPa' },
        p1: { name: 'starting pressure', q: 'pressure', unit: 'kPa', value: 101.325 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 1 },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 0.5 },
        gam: { name: 'heat capacity ratio γ', value: 1.4, tex: '\\gamma' }
      },
      stories: { p2: 'Air at {p1} is compressed quickly (adiabatically) from {V1} to {V2}. What is its new pressure (γ = {gam})?' }
    },
    {
      name: 'Adiabatic change: temperature',
      expr: 'T2 = T1*r^(gam - 1)', tex: 'T_2 = T_1\\, r^{\\gamma - 1}',
      vars: {
        T2: { name: 'final temperature', q: 'temperature', unit: '°C' },
        T1: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 27 },
        r: { name: 'compression ratio V₁/V₂', value: 18 },
        gam: { name: 'heat capacity ratio γ', value: 1.4, tex: '\\gamma' }
      },
      note: 'From $TV^{\\gamma-1}$ = constant. For an expansion, $r < 1$.',
      stories: {
        T2: 'A diesel engine compresses air at {T1} adiabatically by a ratio of {r}. How hot does it get (γ = {gam})?',
        r: 'What adiabatic compression ratio heats air from {T1} to {T2} (γ = {gam})?'
      }
    },
    {
      name: 'Work in an adiabatic process',
      expr: 'W = (p1*V1 - p2*V2)/(gam - 1)', tex: 'W = \\frac{p_1V_1 - p_2V_2}{\\gamma - 1}',
      vars: {
        W: { name: 'work done by the gas', q: 'energy', unit: 'J', signed: true },
        p1: { name: 'starting pressure', q: 'pressure', unit: 'kPa', value: 101.325 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 1 },
        p2: { name: 'final pressure', q: 'pressure', unit: 'kPa', value: 267.4 },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 0.5 },
        gam: { name: 'heat capacity ratio γ', value: 1.4, tex: '\\gamma' }
      },
      note: 'Equal to $-\\Delta U = nC_V(T_1 - T_2)$. Negative for a compression: work is done on the gas.',
      practice: { unknowns: ['W'] },
      stories: { W: 'A gas (γ = {gam}) goes adiabatically from {p1}, {V1} to {p2}, {V2}. How much work does it do?' }
    }
  ],
  derivation: {
    title: 'Why pV^γ stays constant in an adiabatic change',
    steps: [
      { text: 'No heat flows, so the first law gives $dU = -p\\,dV$. For an ideal gas $dU = nC_V\\,dT$:', tex: 'nC_V\\,dT = -p\\,dV' },
      { text: 'Differentiate $pV = nRT$ to express $dT$:', tex: 'n\\,dT = \\frac{p\\,dV + V\\,dp}{R}' },
      { text: 'Substitute and collect the terms, using $C_p = C_V + R$:', tex: 'C_V (p\\,dV + V\\,dp) = -R\\,p\\,dV \\;\\Rightarrow\\; C_V V\\,dp = -C_p\\, p\\,dV' },
      { text: 'Divide by $C_V pV$ and write $\\gamma = C_p/C_V$:', tex: '\\frac{dp}{p} = -\\gamma\\,\\frac{dV}{V}' },
      { text: 'Integrate:', tex: '\\ln p = -\\gamma \\ln V + \\text{const} \\;\\Rightarrow\\; pV^{\\gamma} = \\text{constant}' }
    ]
  },
  examples: [
    {
      title: 'Ignition without a spark',
      q: 'A diesel engine takes in air at 27 °C and 1.0 bar and compresses it adiabatically by a factor of 18. Estimate the final temperature and pressure ($\\gamma = 1.4$).',
      steps: [
        '$T_2 = T_1 r^{\\gamma - 1} = 300 \\times 18^{0.4} = 300 \\times 3.18 = 953$ K, about 680 °C.',
        '$p_2 = p_1 r^{\\gamma} = 1.0 \\times 18^{1.4} = 57$ bar.',
        'Diesel fuel ignites on its own at a few hundred degrees, so it burns as soon as it is sprayed in. (Real engines lose some heat to the cylinder walls and reach somewhat less.)'
      ],
      a: 'About 950 K (680 °C) and 57 bar'
    },
    {
      title: 'Isothermal versus adiabatic',
      q: 'Air at 1.00 atm and 300 K is compressed to half its volume, (a) slowly, staying at 300 K, (b) quickly, with no heat exchanged. Compare the final pressures and temperatures.',
      steps: [
        'Isothermal: $p_2 = 2 \\times 1.00 = 2.00$ atm, $T_2 = 300$ K.',
        'Adiabatic: $p_2 = 1.00 \\times 2^{1.4} = 2.64$ atm, and $T_2 = 300 \\times 2^{0.4} = 396$ K.',
        'The adiabatic compression needs more work, and the extra appears as internal energy — a temperature rise of almost 100 K.'
      ],
      a: '2.00 atm at 300 K versus 2.64 atm at 396 K'
    }
  ],
  quiz: [
    { q: 'Through the same point on a p–V diagram, which curve is steeper?', choices: ['The isotherm', 'The adiabat', 'They have the same slope', 'The isobar'], a: 1,
      why: 'For the adiabat $dp/dV = -\\gamma p/V$; for the isotherm $-p/V$. Since $\\gamma > 1$ the adiabat falls more steeply.' },
    { q: 'In a slow isothermal expansion of an ideal gas…', choices: ['Q = 0', 'W = 0', 'ΔU = 0 and Q = W', 'ΔU = Q'], a: 2,
      why: 'Constant temperature means constant internal energy, so the heat absorbed equals the work done.' },
    { q: 'A bicycle pump warms up when you pump quickly because the compression is nearly…', choices: ['isothermal', 'isobaric', 'adiabatic', 'isochoric'], a: 2,
      why: 'There is little time for heat to escape, so the work done on the air raises its internal energy.' },
    { q: 'In an isochoric process the gas does no work.', a: true,
      why: 'The volume does not change, so $\\int p\\,dV = 0$. All the heat goes into internal energy.' },
    { q: 'A parcel of dry air rises through the atmosphere. It…', choices: ['warms, because it is closer to the Sun', 'cools, because it expands and does work', 'keeps its temperature', 'warms, because it is compressed'], a: 1,
      why: 'The pressure falls with height, the parcel expands nearly adiabatically and pays for the work out of its internal energy: about 9.8 K per km.' }
  ],
  applications: ['Engine cycles: the compression and power strokes are nearly adiabatic.', 'Weather: rising air cools adiabatically and forms clouds.', 'The speed of sound, set by adiabatic compressions.', 'Compressors, turbines and gas storage.'],
  sim: 'heat-pv-diagram'
},

{
  id: 'second-law-thermodynamics', parent: 'thermodynamics', title: 'Second law of thermodynamics', level: 2,
  short: 'Heat flows spontaneously only from hot to cold, and no engine can turn heat entirely into work: the law that gives time its direction.',
  keywords: ['second law of thermodynamics', 'Clausius statement', 'Kelvin-Planck statement', 'Kelvin statement', 'irreversibility', 'irreversible process', 'arrow of time', 'entropy increase', 'perpetual motion of the second kind', 'spontaneous process', 'Maxwell\'s demon'],
  prereq: ['first-law-thermodynamics', 'zeroth-law'],
  related: ['entropy', 'heat-engines', 'carnot-cycle', 'refrigerators-heat-pumps'],
  body: `
The first law allows many things that never happen. A cup of coffee could draw heat from the cooler room and boil; a ball resting on the floor could gather up heat from the floor and leap into the air; the air in a room could collect itself in one corner. None of these breaks conservation of energy. Something else forbids them: the **second law of thermodynamics**. It comes in several equivalent forms.

> [!key] **Clausius statement**: no process can have as its *only* result the transfer of heat from a colder body to a hotter one.
>
> **Kelvin–Planck statement**: no cyclic process can have as its *only* result the absorption of heat from a single reservoir and its complete conversion into work.

The word "only" matters. A refrigerator moves heat from cold to hot all the time — but only because work is done on it. A steam turbine turns heat into work — but only while dumping some heat into a colder condenser.

### Why the statements are the same law
Suppose you had an engine that broke Kelvin–Planck, turning heat from a hot reservoir entirely into work. Use that work to drive a refrigerator between a cold reservoir and the same hot one. The combination, taken together, does nothing but move heat from cold to hot, breaking Clausius. The argument works the other way round too: break either statement and you break both.

### Entropy never falls
Clausius found the quantity that captures the law, **entropy** $S$ ([[entropy]]). When heat $Q$ flows from a body at $T_h$ to one at $T_c$, the hot body loses entropy $Q/T_h$ and the cold one gains $Q/T_c$. Since $T_c < T_h$, the total rises:

$$\\Delta S = \\frac{Q}{T_c} - \\frac{Q}{T_h} > 0$$

The general statement: **the total entropy of an isolated system never decreases.** It stays constant only in idealised reversible processes; every real process — friction, heat flowing across a temperature difference, mixing, free expansion — creates entropy.

### Why: overwhelming odds
Boltzmann showed that the second law is statistical. A gas spread through a box can be arranged in vastly more ways than a gas gathered in one half. For each molecule the chance of being in the left half is ½, so for all $N$ at once it is $(\\tfrac12)^N$: about one in a million for 20 molecules, $8\\times10^{-31}$ for 100, and for the $10^{27}$ molecules of air in a room, effectively never. Nothing forbids the reverse of an irreversible process except the absurd improbability of it. Try it in the simulation: crowd the molecules into one half and let go.

### Consequences
- Every heat engine must reject heat to a cold reservoir, so its efficiency is below 100 % ([[heat-engines]]); the best possible is the Carnot limit ([[carnot-cycle]]).
- Refrigerators and heat pumps need work ([[refrigerators-heat-pumps]]).
- Ordered energy — mechanical work, electricity — degrades irreversibly into disordered internal energy. The energy is still there (first law), but it can do less.
- It gives time a direction. A film of a glass shattering looks wrong played backwards, although each molecular collision would look fine in reverse.

> [!note] Maxwell imagined a tiny "demon" sorting fast molecules from slow ones through a trapdoor, apparently making a hot and a cold side for free. The resolution, completed in the 20th century, is that gathering and erasing the information costs at least as much entropy as the sorting saves.
`,
  ideas: [
    'Heat does not flow by itself from cold to hot (Clausius).',
    'No cyclic device can turn heat from one reservoir entirely into work (Kelvin–Planck).',
    'The two statements are equivalent: breaking one would break the other.',
    'The total entropy of an isolated system never decreases; real processes increase it.',
    'The law is statistical: disordered states vastly outnumber ordered ones.'
  ],
  pitfalls: [
    'The second law forbids any decrease of entropy — Only the total for an isolated system cannot fall. A fridge interior, a growing crystal or a living cell lowers its own entropy by exporting more to its surroundings.',
    'Heat can never flow from cold to hot — It can, as in every refrigerator, but not on its own: work must be done.',
    'The second law says energy is used up — Energy is conserved (first law). What is lost is its ability to do work, as it spreads out at lower temperature.'
  ],
  formulas: [
    {
      name: 'Entropy created by heat flowing from hot to cold',
      expr: 'dS = Q/Tc - Q/Th', tex: '\\Delta S = \\frac{Q}{T_c} - \\frac{Q}{T_h}',
      vars: {
        dS: { name: 'total entropy change', q: 'entropy', unit: 'J/K', tex: '\\Delta S' },
        Q: { name: 'heat transferred', q: 'energy', unit: 'J', value: 1000 },
        Tc: { name: 'temperature of the colder body', q: 'temperature', unit: '°C', value: 20, tex: 'T_c' },
        Th: { name: 'temperature of the hotter body', q: 'temperature', unit: '°C', value: 100, tex: 'T_h' }
      },
      note: 'Both bodies are large enough that their temperatures do not change. Positive whenever $T_h > T_c$.',
      practice: { unknowns: ['dS', 'Q'] },
      stories: {
        dS: '{Q} of heat leaks from a hot reservoir at {Th} to a cold one at {Tc}. By how much does the total entropy rise?',
        Q: 'Heat flowing from {Th} to {Tc} has created {dS} of entropy. How much heat flowed?'
      }
    },
    {
      name: 'Chance that all N molecules are in one half',
      expr: 'P = 0.5^N', tex: 'P = \\left(\\tfrac12\\right)^N',
      vars: {
        P: { name: 'probability' },
        N: { name: 'number of molecules', q: 'count', int: true, value: 20 }
      },
      practice: { unknowns: ['P'] },
      stories: { P: 'A box holds {N} gas molecules moving at random. What is the probability of finding all of them in the left half at a given instant?' }
    }
  ],
  examples: [
    {
      title: 'Entropy from a leaky window',
      q: 'Heat leaks through a window at 100 W from a room at 20 °C to the outside at 0 °C. At what rate is entropy created?',
      steps: [
        'Each second, 100 J leave the room: the room loses $100/293.15 = 0.341$ J/K.',
        'The outside gains $100/273.15 = 0.366$ J/K.',
        'Net: $0.366 - 0.341 = 0.025$ J/K every second — positive, as the second law requires.'
      ],
      a: 'About 0.025 J/K per second'
    },
    {
      title: 'Could the air gather in one corner?',
      q: 'Estimate the probability that 100 molecules moving at random are all found in the left half of their box. What about the air in a room?',
      steps: [
        'For 100 molecules: $(\\tfrac12)^{100} = 7.9\\times10^{-31}$. Checking a million times a second, you would expect to wait about $4\\times10^{16}$ years — millions of times the age of the universe.',
        'A room holds about $10^{27}$ molecules: the probability is $2^{-10^{27}} \\approx 10^{-3\\times10^{26}}$. Written out at one digit per millimetre, the zeros after the decimal point would stretch some 30 million light-years.'
      ],
      a: 'Negligible for 100 molecules; unimaginably smaller for a room'
    }
  ],
  quiz: [
    { q: 'Which of these would violate the second law?', choices: ['A fridge cooling food using electricity', 'A ship powered only by extracting heat from the ocean, with nothing else changing', 'A heat pump warming a house from cold outdoor air', 'A car engine turning 30 % of its fuel energy into work'], a: 1,
      why: 'It would turn heat from a single reservoir entirely into work — forbidden by the Kelvin–Planck statement. The others all use work or a cold sink.' },
    { q: 'The second law says the entropy of any system can never decrease.', a: false,
      why: 'Only the total entropy of an isolated system. A system can lose entropy if its surroundings gain at least as much.' },
    { q: '1000 J of heat flows from a reservoir at 400 K to one at 300 K. The total entropy change is…', choices: ['−0.83 J/K', '0', '+0.83 J/K', '+5.83 J/K'], a: 2,
      why: '$1000/300 - 1000/400 = 3.33 - 2.50 = +0.83$ J/K.' },
    { q: 'A film of a glass shattering looks obviously wrong when run backwards because the reverse would…', choices: ['violate conservation of energy', 'violate conservation of momentum', 'require an overwhelmingly improbable decrease of entropy', 'break Newton\'s laws'], a: 2,
      why: 'Every collision could run backwards, and energy would be conserved. What rules it out is the fantastically small probability of all the fragments and molecules conspiring to reassemble.' }
  ],
  applications: ['Setting the maximum efficiency of power stations and engines.', 'Explaining why refrigeration and air conditioning need energy.', 'Chemistry: which reactions can happen spontaneously.', 'The arrow of time, and the long-term fate of the universe.'],
  history: 'Sadi Carnot\'s analysis of steam engines (1824) contained the germ of the law. Rudolf Clausius stated it in 1850 and William Thomson (Lord Kelvin) in 1851; Clausius introduced entropy in 1865, and Ludwig Boltzmann gave it its statistical meaning in the 1870s.',
  sim: { id: 'heat-gas-box', params: { gather: true }, title: 'A gas never gathers itself up again' }
},

{
  id: 'heat-engines', parent: 'thermodynamics', title: 'Heat engines', level: 2,
  short: 'A device that runs in a cycle, taking heat from a hot source, turning part of it into work and dumping the rest into a cold sink; its efficiency is the fraction turned into work.',
  keywords: ['heat engine', 'thermal efficiency', 'efficiency', 'hot reservoir', 'cold reservoir', 'Otto cycle', 'Diesel cycle', 'Rankine cycle', 'steam engine', 'petrol engine', 'power station', 'compression ratio', 'combined cycle'],
  prereq: ['first-law-thermodynamics', 'second-law-thermodynamics', 'thermodynamic-processes'],
  related: ['carnot-cycle', 'refrigerators-heat-pumps', 'efficiency', 'entropy'],
  body: `
A **heat engine** turns heat into work, over and over, by taking a working substance — steam, air, a burning fuel–air mixture — round a **cycle**. Every heat engine, from a steam locomotive to a jet turbine, shares the same energy flow:

1. It takes in heat $Q_h$ from a **hot source** (burning fuel, a nuclear reactor, concentrated sunlight).
2. It delivers work $W$.
3. It rejects heat $Q_c$ to a **cold sink** (the atmosphere, a river, cooling towers).

After each cycle the working substance is back where it started, so $\\Delta U = 0$ and, by the [[first-law-thermodynamics|first law]], $W = Q_h - Q_c$. The **thermal efficiency** is the fraction of the heat turned into work:

$$\\eta = \\frac{W}{Q_h} = 1 - \\frac{Q_c}{Q_h}$$

The [[second-law-thermodynamics|second law]] (Kelvin–Planck) says $Q_c$ can never be zero: some heat must always be thrown away. How much at the very least depends only on the two temperatures — that is the [[carnot-cycle|Carnot limit]], $1 - T_c/T_h$.

| Engine | Typical efficiency |
|---|---|
| Steam locomotive | 6–10 % |
| Car petrol engine | 25–35 % |
| Truck diesel engine | 40–45 % |
| Coal-fired power station | 33–45 % |
| Large ship diesel | about 50 % |
| Combined-cycle gas power station | about 60 % |

A power station producing 1 GW of electricity at 38 % efficiency rejects about 1.6 GW of heat — the plumes over its cooling towers are the second law made visible. Combined-cycle stations use the hot exhaust of a gas turbine to raise steam for a second turbine, and combined heat-and-power plants sell the rejected heat to warm buildings.

### The Otto cycle
The petrol engine is modelled by the **Otto cycle**, four strokes idealised as four processes ([[thermodynamic-processes]]):
1. **Compression**: the piston squeezes the air–fuel mixture adiabatically by the compression ratio $r = V_{max}/V_{min}$.
2. **Ignition**: the spark fires and the mixture burns so fast that heat is added at almost constant volume.
3. **Power stroke**: the hot gas expands adiabatically, pushing the piston.
4. **Exhaust**: the hot gas is replaced by a fresh cold charge — modelled as heat rejected at constant volume.

For an ideal gas the efficiency depends only on the compression ratio:

$$\\eta_{Otto} = 1 - \\frac{1}{r^{\\gamma - 1}}$$

With $r = 10$ and $\\gamma = 1.4$ it is 60 %. Real engines reach about half of that: friction, heat lost through the cylinder walls, incomplete combustion, and hot gases with a smaller $\\gamma$ all take their toll. Petrol engines cannot raise $r$ much beyond 10–13 because the mixture would ignite on its own ("knock"); diesel engines compress air alone, reach ratios of 15–22, and are more efficient.
`,
  ideas: [
    'A heat engine runs in a cycle: heat Q_h in from a hot source, work W out, heat Q_c out to a cold sink.',
    'W = Q_h − Q_c, because ΔU = 0 over a cycle.',
    'Efficiency η = W/Q_h = 1 − Q_c/Q_h is always below 100 %.',
    'The Otto cycle models the petrol engine: η = 1 − r^(1−γ), rising with compression ratio.',
    'No engine can beat the Carnot limit 1 − T_c/T_h between its two temperatures.'
  ],
  pitfalls: [
    'With perfect engineering an engine could reach 100 % efficiency — The second law requires heat to be rejected to a cold sink; even a frictionless engine is capped by the Carnot limit.',
    'Efficiency compares the work with the heat thrown away — It is the work divided by the heat taken in from the hot source.',
    'The cooling towers of a power station are waste that better design could eliminate — Rejecting heat is essential to any heat engine; it can be reduced, or put to use, but never avoided.'
  ],
  formulas: [
    {
      name: 'Thermal efficiency',
      expr: 'eta = W/Qh', tex: '\\eta = \\frac{W}{Q_h}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        W: { name: 'work done per cycle (or per second)', q: 'energy', unit: 'kJ', value: 30 },
        Qh: { name: 'heat taken in from the hot source', q: 'energy', unit: 'kJ', value: 100, tex: 'Q_h' }
      },
      stories: {
        eta: 'An engine takes in {Qh} of heat and delivers {W} of work. What is its efficiency?',
        Qh: 'An engine of efficiency {eta} delivers {W} of work. How much heat must it take in?'
      }
    },
    {
      name: 'Energy balance over a cycle',
      expr: 'Qh = W + Qc', tex: 'Q_h = W + Q_c',
      vars: {
        Qh: { name: 'heat taken in', q: 'energy', unit: 'kJ', tex: 'Q_h' },
        W: { name: 'work done', q: 'energy', unit: 'kJ', value: 30 },
        Qc: { name: 'heat rejected', q: 'energy', unit: 'kJ', value: 70, tex: 'Q_c' }
      },
      stories: { Qc: 'A power station takes in {Qh} of heat per second and delivers {W} of electricity. How much heat does it reject?' }
    },
    {
      name: 'Efficiency of the ideal Otto cycle',
      expr: 'eta = 1 - r^(1 - gam)', tex: '\\eta = 1 - r^{1-\\gamma}',
      vars: {
        eta: { name: 'efficiency', q: 'ratio', unit: '%', tex: '\\eta' },
        r: { name: 'compression ratio', value: 10 },
        gam: { name: 'heat capacity ratio γ', value: 1.4, tex: '\\gamma' }
      },
      stories: {
        eta: 'What is the ideal efficiency of a petrol engine with compression ratio {r} (γ = {gam})?',
        r: 'What compression ratio gives an ideal Otto efficiency of {eta} (γ = {gam})?'
      }
    }
  ],
  examples: [
    {
      title: 'A car engine\'s energy budget',
      q: 'A car engine burns fuel releasing 60 kW of heat and delivers 18 kW to the crankshaft. What is its efficiency, and where does the rest go?',
      steps: [
        '$\\eta = W/Q_h = 18/60 = 0.30$, or 30 %.',
        'Rejected heat: $Q_c = 60 - 18 = 42$ kW, roughly half through the exhaust and half through the radiator.',
        'In winter some of that rejected heat warms the passengers.'
      ],
      a: '30 %; 42 kW is rejected as heat'
    },
    {
      title: 'Why higher compression helps',
      q: 'Compare the ideal Otto efficiencies for compression ratios 8 and 12 ($\\gamma = 1.4$).',
      steps: [
        '$r = 8$: $\\eta = 1 - 8^{-0.4} = 1 - 0.435 = 56.5$ %.',
        '$r = 12$: $\\eta = 1 - 12^{-0.4} = 1 - 0.370 = 63.0$ %.',
        'Going from 8 to 12 cuts the heat rejected per unit of work by about a third — but needs knock-resistant fuel.'
      ],
      a: '56.5 % and 63.0 %'
    }
  ],
  quiz: [
    { q: 'An engine takes in 1000 J of heat per cycle and rejects 700 J. Its work output and efficiency are…', choices: ['700 J, 70 %', '300 J, 30 %', '1700 J, 170 %', '300 J, 43 %'], a: 1,
      why: '$W = Q_h - Q_c = 300$ J, and $\\eta = 300/1000 = 30$ %.' },
    { q: 'An inventor claims an engine that takes heat from a furnace and turns all of it into work, rejecting nothing. This is impossible because it would break…', choices: ['the first law', 'the second law', 'the zeroth law', 'conservation of momentum'], a: 1,
      why: 'Energy would be conserved, so the first law is satisfied; but the Kelvin–Planck statement of the second law forbids $Q_c = 0$.' },
    { q: 'Raising the compression ratio of an ideal Otto engine…', choices: ['lowers its efficiency', 'raises its efficiency', 'has no effect', 'makes it a refrigerator'], a: 1,
      why: '$\\eta = 1 - r^{1-\\gamma}$ increases with $r$.' },
    { q: 'A 30 % efficient engine delivers 30 kW. How much heat does it reject?', choices: ['9 kW', '21 kW', '70 kW', '100 kW'], a: 2,
      why: 'It needs $Q_h = 30/0.30 = 100$ kW, of which $100 - 30 = 70$ kW is rejected.' },
    { q: 'The steam leaving a power station\'s turbine could be sent straight back to the boiler without condensing it, avoiding the loss of heat in the condenser.', a: false,
      why: 'Without rejecting heat to a colder sink the cycle cannot produce net work: compressing the uncondensed steam back to boiler pressure would take at least as much work as the turbine delivered. Condensing it first means only a little liquid has to be pumped.' }
  ],
  applications: ['Car, truck and ship engines.', 'Steam and gas turbines in power stations.', 'Jet engines and rockets.', 'Stirling engines and solar thermal power.'],
  history: 'Thomas Newcomen\'s atmospheric engine (1712) and James Watt\'s separate condenser (1769) drove the Industrial Revolution long before anyone understood their limits. Nikolaus Otto built the first practical four-stroke engine in 1876; Rudolf Diesel\'s compression-ignition engine followed in the 1890s.',
  sim: { id: 'heat-engine-cycle', params: { cycle: 'otto' } }
},

{
  id: 'carnot-cycle', parent: 'thermodynamics', title: 'The Carnot cycle', level: 3,
  short: 'An ideal, reversible engine made of two isothermal and two adiabatic steps; its efficiency 1 − T_c/T_h is the most any engine working between two temperatures can achieve.',
  keywords: ['Carnot cycle', 'Carnot efficiency', 'Carnot engine', 'Carnot limit', 'reversible engine', 'Carnot\'s theorem', 'maximum efficiency', 'isotherm', 'adiabat', 'Sadi Carnot', 'thermodynamic temperature', 'Curzon-Ahlborn'],
  prereq: ['heat-engines', 'thermodynamic-processes', 'second-law-thermodynamics'],
  related: ['entropy', 'refrigerators-heat-pumps', 'third-law', 'temperature'],
  body: `
In 1824 the young French engineer Sadi Carnot asked how much work could possibly be extracted from heat. His answer is an idealised engine that wastes nothing avoidable: it exchanges heat only with its two reservoirs, and only when it is at the same temperature as the reservoir, so heat never flows across a temperature difference. Every step can be run backwards: it is **reversible**.

### The four steps
With an ideal gas as the working substance, see the simulation:
1. **Isothermal expansion** at $T_h$, in contact with the hot reservoir, absorbing heat $Q_h$.
2. **Adiabatic expansion**, insulated, cooling from $T_h$ to $T_c$.
3. **Isothermal compression** at $T_c$, in contact with the cold reservoir, rejecting heat $Q_c$.
4. **Adiabatic compression**, insulated, warming back to $T_h$.

The enclosed area on the $p$–$V$ diagram is the net work per cycle. The derivation below shows that for this cycle

$$\\frac{Q_c}{Q_h} = \\frac{T_c}{T_h}, \\qquad \\eta_{C} = 1 - \\frac{T_c}{T_h}$$

with absolute temperatures.

### Carnot's theorem
No engine working between two reservoirs can be more efficient than a reversible one, and all reversible engines between the same two temperatures have the same efficiency, whatever their working substance. The proof uses the [[second-law-thermodynamics|second law]]: a better engine could drive a reversed Carnot engine as a refrigerator, and the pair would pump heat from cold to hot with no work input. Because the ratio $Q_c/Q_h$ does not depend on the substance, Kelvin used it to *define* the absolute temperature scale — the thermodynamic temperature.

### What the limit means
| Situation | $T_h$ | $T_c$ | Carnot limit |
|---|---|---|---|
| Steam power station | 838 K (565 °C) | 303 K (30 °C) | 64 % |
| Geothermal plant | 423 K (150 °C) | 293 K | 31 % |
| Ocean thermal energy | 298 K (25 °C) | 278 K (5 °C) | 6.7 % |
| Between boiling and freezing water | 373 K | 273 K | 27 % |

To do better, raise $T_h$ (materials permitting) or lower $T_c$. Lowering $T_c$ by a given number of kelvin gains more than raising $T_h$ by the same amount.

A Carnot engine is not a practical design. Its isothermal steps need heat to flow across a vanishingly small temperature difference, which means infinitely slowly: a perfect Carnot engine delivers no power at all. An engine tuned for *maximum power* does worse; under simple assumptions its efficiency is $1 - \\sqrt{T_c/T_h}$ (the Curzon–Ahlborn result), about 40 % for the power station above — remarkably close to what real stations achieve.

Run the cycle backwards and it becomes an ideal refrigerator or heat pump ([[refrigerators-heat-pumps]]).
`,
  ideas: [
    'The Carnot cycle: isothermal expansion, adiabatic expansion, isothermal compression, adiabatic compression.',
    'Heat is exchanged only at T_h and T_c, never across a temperature difference, so every step is reversible.',
    'For a reversible cycle Q_c/Q_h = T_c/T_h and η = 1 − T_c/T_h (absolute temperatures).',
    'No engine between the same two reservoirs can be more efficient (Carnot\'s theorem).',
    'A reversible engine runs infinitely slowly; real engines trade efficiency for power.'
  ],
  pitfalls: [
    'Using °C in 1 − T_c/T_h — Only absolute temperatures work: between 100 °C and 0 °C the limit is 26.8 %, not 100 %.',
    'The Carnot engine is the best engine to build — It is the ideal limit. Being reversible it runs infinitely slowly and delivers no power.',
    'A hot enough source gives 100 % efficiency — Only if T_c were 0 K, which cannot be reached (third law).'
  ],
  formulas: [
    {
      name: 'Carnot efficiency',
      expr: 'eta = 1 - Tc/Th', tex: '\\eta_C = 1 - \\frac{T_c}{T_h}',
      vars: {
        eta: { name: 'maximum efficiency', q: 'ratio', unit: '%', tex: '\\eta_C' },
        Tc: { name: 'cold reservoir temperature', q: 'temperature', unit: '°C', value: 30, tex: 'T_c' },
        Th: { name: 'hot reservoir temperature', q: 'temperature', unit: '°C', value: 565, tex: 'T_h' }
      },
      stories: {
        eta: 'What is the highest possible efficiency of an engine working between {Th} and {Tc}?',
        Th: 'An engine rejecting heat at {Tc} is to reach a Carnot efficiency of {eta}. How hot must its source be?',
        Tc: 'An engine takes heat at {Th}. How cold must its sink be for a Carnot efficiency of {eta}?'
      }
    },
    {
      name: 'Heats of a reversible engine',
      expr: 'Qc/Qh = Tc/Th', tex: '\\frac{Q_c}{Q_h} = \\frac{T_c}{T_h}', solveFor: 'Qc',
      vars: {
        Qc: { name: 'heat rejected', q: 'energy', unit: 'J', tex: 'Q_c' },
        Qh: { name: 'heat absorbed', q: 'energy', unit: 'J', value: 1200, tex: 'Q_h' },
        Tc: { name: 'cold reservoir temperature', q: 'temperature', unit: 'K', value: 300, tex: 'T_c' },
        Th: { name: 'hot reservoir temperature', q: 'temperature', unit: 'K', value: 600, tex: 'T_h' }
      },
      stories: { Qc: 'A reversible engine absorbs {Qh} per cycle at {Th} and rejects heat at {Tc}. How much does it reject?' }
    },
    {
      name: 'Efficiency at maximum power (Curzon–Ahlborn)',
      expr: 'eta = 1 - sqrt(Tc/Th)', tex: '\\eta_{CA} = 1 - \\sqrt{\\frac{T_c}{T_h}}',
      vars: {
        eta: { name: 'efficiency at maximum power', q: 'ratio', unit: '%', tex: '\\eta_{CA}' },
        Tc: { name: 'cold reservoir temperature', q: 'temperature', unit: '°C', value: 30, tex: 'T_c' },
        Th: { name: 'hot reservoir temperature', q: 'temperature', unit: '°C', value: 565, tex: 'T_h' }
      },
      note: 'For an engine whose losses are the finite rates of heat flow into and out of an otherwise reversible cycle.',
      practice: { unknowns: ['eta'] }
    }
  ],
  derivation: {
    title: 'Derive the Carnot efficiency for an ideal gas',
    steps: [
      { text: 'On the isotherms $\\Delta U = 0$, so the heat equals the work, $nRT\\ln(V_{final}/V_{initial})$. Label the corners 1–4 in the order of the cycle:', tex: 'Q_h = nRT_h \\ln\\frac{V_2}{V_1}, \\qquad Q_c = nRT_c \\ln\\frac{V_3}{V_4}' },
      { text: 'The adiabats obey $TV^{\\gamma-1}$ = constant:', tex: 'T_h V_2^{\\gamma - 1} = T_c V_3^{\\gamma - 1}, \\qquad T_h V_1^{\\gamma - 1} = T_c V_4^{\\gamma - 1}' },
      { text: 'Divide one by the other:', tex: '\\frac{V_2}{V_1} = \\frac{V_3}{V_4}' },
      { text: 'So the logarithms cancel in the ratio of the heats:', tex: '\\frac{Q_c}{Q_h} = \\frac{T_c}{T_h} \\;\\Rightarrow\\; \\eta = 1 - \\frac{Q_c}{Q_h} = 1 - \\frac{T_c}{T_h}' }
    ]
  },
  examples: [
    {
      title: 'The limit for a power station',
      q: 'A steam power station raises steam at 565 °C and condenses it at 30 °C. What is its Carnot limit, and what efficiency at maximum power does the Curzon–Ahlborn formula suggest?',
      steps: [
        'Absolute temperatures: $T_h = 838$ K, $T_c = 303$ K.',
        'Carnot: $\\eta_C = 1 - 303/838 = 0.638$, or 63.8 %.',
        'Maximum power: $\\eta_{CA} = 1 - \\sqrt{303/838} = 1 - 0.601 = 0.399$, about 40 %.',
        'Real plants of this kind achieve about 38–42 %.'
      ],
      a: 'Carnot 64 %; at maximum power about 40 %'
    },
    {
      title: 'Power from the ocean',
      q: 'Ocean thermal energy conversion uses warm surface water at 25 °C and cold deep water at 5 °C. What is the best possible efficiency?',
      steps: [
        '$\\eta_C = 1 - \\dfrac{278.15}{298.15} = 0.067$.',
        'At most 6.7 %; real plants manage about 3 %, so enormous flows of water are needed for modest power.'
      ],
      a: 'At most 6.7 %'
    }
  ],
  quiz: [
    { q: 'An engine works between 600 K and 300 K. Which improves its Carnot limit more?', choices: ['Raising T_h by 10 K', 'Lowering T_c by 10 K', 'Both the same', 'Neither changes it'], a: 1,
      why: 'Lowering $T_c$ to 290 K gives $1 - 290/600 = 51.7$ %; raising $T_h$ to 610 K gives $1 - 300/610 = 50.8$ %.' },
    { q: 'A Carnot engine runs between 500 K and 300 K. Its efficiency is…', choices: ['20 %', '40 %', '60 %', '67 %'], a: 1,
      why: '$1 - 300/500 = 0.40$.' },
    { q: 'The efficiency of a Carnot engine depends on the working gas.', a: false,
      why: 'Carnot\'s theorem: every reversible engine between the same two temperatures has the same efficiency, $1 - T_c/T_h$.' },
    { q: 'A Carnot engine between 600 K and 300 K absorbs 1200 J per cycle. The work per cycle is…', choices: ['300 J', '600 J', '900 J', '1200 J'], a: 1,
      why: '$\\eta = 0.5$, so $W = 0.5 \\times 1200 = 600$ J, and 600 J is rejected.' },
    { q: 'Car makers do not build Carnot engines mainly because…', choices: ['they would violate the first law', 'reversible heat transfer needs infinitely slow operation, giving almost no power', 'petrol cannot be used in them', 'they would be less efficient'], a: 1,
      why: 'Heat flows only when there is a temperature difference; with none, it flows infinitely slowly. Real engines accept irreversibility to deliver power.' }
  ],
  applications: ['Benchmarking every real engine against its Carnot limit.', 'The choice of high steam temperatures in power stations.', 'The thermodynamic definition of absolute temperature.', 'Assessing low-temperature energy sources such as geothermal and ocean thermal power.'],
  history: 'Sadi Carnot published "Reflections on the Motive Power of Fire" in 1824 at the age of 28, reasoning with the caloric theory. Émile Clapeyron gave the cycle its p–V diagram in 1834, and Kelvin and Clausius recast Carnot\'s results in the new thermodynamics around 1850.',
  sim: 'heat-engine-cycle'
},

{
  id: 'refrigerators-heat-pumps', parent: 'thermodynamics', title: 'Refrigerators and heat pumps', level: 2,
  short: 'Heat engines run backwards: work moves heat from a cold place to a warm one, to cool a fridge or to warm a house several times more cheaply than an electric heater.',
  keywords: ['refrigerator', 'heat pump', 'coefficient of performance', 'COP', 'air conditioner', 'vapour-compression cycle', 'refrigerant', 'Carnot COP', 'reversed heat engine', 'freezer', 'ground-source heat pump'],
  prereq: ['heat-engines', 'carnot-cycle', 'latent-heat'],
  related: ['second-law-thermodynamics', 'entropy', 'thermodynamic-processes'],
  body: `
Heat never flows on its own from a cold body to a hotter one ([[second-law-thermodynamics|second law]]). A refrigerator makes it do so by spending work. Run a heat engine backwards and you get exactly this: work $W$ goes in, heat $Q_c$ is drawn from the cold side, and heat $Q_h$ is delivered to the warm side. Energy is conserved, so

$$Q_h = Q_c + W$$

The same machine is a **refrigerator** or an **air conditioner** if what you want is the cooling $Q_c$, and a **heat pump** if what you want is the heating $Q_h$.

### Coefficient of performance
Their performance is measured by what you get per unit of work, the **coefficient of performance** (COP, written $K$ here):

$$K_R = \\frac{Q_c}{W} \\ \\text{(refrigerator)}, \\qquad K_{HP} = \\frac{Q_h}{W} = K_R + 1 \\ \\text{(heat pump)}$$

These are typically 2 to 5 — larger than 1. That breaks no law: a heat pump does not *create* heat, it *moves* it, and moving heat takes less energy than the heat moved.

### The Carnot limits
A reversed [[carnot-cycle|Carnot cycle]] is the best possible, with $Q_c/Q_h = T_c/T_h$:

$$K_R \\le \\frac{T_c}{T_h - T_c}, \\qquad K_{HP} \\le \\frac{T_h}{T_h - T_c}$$

The smaller the temperature lift, the better. A heat pump warming radiators at 45 °C from outdoor air at 0 °C has a Carnot limit of $318/45 = 7.1$; underfloor heating at 35 °C raises it to 8.8. Real heat pumps achieve roughly half of the limit, a COP of 3 to 4: each kilowatt-hour of electricity delivers 3 to 4 kWh of heat, where an electric heater delivers exactly 1. On the coldest days the lift grows and the COP falls, but a well-designed unit stays well above 1.

### How a fridge works
Almost all refrigerators and heat pumps use the **vapour-compression cycle**, driven by [[latent-heat|latent heat]]:
1. In the cold **evaporator** coils inside the fridge, a refrigerant at low pressure boils at around −20 °C, absorbing heat from the food compartment.
2. A **compressor** raises the vapour's pressure — and so its temperature, to perhaps 40 °C.
3. In the **condenser** coils at the back, the hot vapour gives up its heat to the kitchen and condenses to a liquid.
4. An **expansion valve** drops the pressure; the liquid partly flashes to vapour, cools, and returns to the evaporator.

A heat pump for a house is the same machine with the evaporator outdoors (or in pipes buried in the ground) and the condenser feeding the radiators; many air-conditioners can switch between the two roles.

> [!tip] Leaving a fridge door open in a closed kitchen makes the kitchen *warmer*: the heat pumped out of the fridge comes straight back, and the compressor's work $W$ is added on top.
`,
  ideas: [
    'Refrigerators and heat pumps use work W to move heat Q_c from cold to hot, delivering Q_h = Q_c + W.',
    'COP of a refrigerator K_R = Q_c/W; of a heat pump K_HP = Q_h/W = K_R + 1.',
    'COPs above 1 are normal: heat is moved, not created.',
    'Carnot limits: T_c/(T_h − T_c) and T_h/(T_h − T_c); the smaller the temperature lift, the better.',
    'The vapour-compression cycle moves heat by evaporating and condensing a refrigerant.'
  ],
  pitfalls: [
    'A COP above 1 is impossible, like an efficiency above 100 % — A heat pump moves heat rather than making it; the extra energy comes from the cold outdoors.',
    'An open fridge door can cool a kitchen — The heat removed goes straight back into the room, plus the compressor\'s work, so the kitchen warms.',
    'Heat pumps stop working below freezing — Air at −10 °C still holds plenty of internal energy relative to absolute zero; the COP falls with the larger lift but stays above 1.'
  ],
  formulas: [
    {
      name: 'COP of a refrigerator',
      expr: 'Kr = Qc/W', tex: 'K_R = \\frac{Q_c}{W}',
      vars: {
        Kr: { name: 'coefficient of performance (cooling)', tex: 'K_R' },
        Qc: { name: 'heat removed from the cold side', q: 'energy', unit: 'kJ', value: 300, tex: 'Q_c' },
        W: { name: 'work put in', q: 'energy', unit: 'kJ', value: 100 }
      },
      stories: {
        Kr: 'A freezer removes {Qc} of heat from its contents using {W} of electrical work. What is its COP?',
        W: 'A fridge with a COP of {Kr} must remove {Qc} of heat. How much electrical energy does it use?'
      }
    },
    {
      name: 'Carnot limit for a refrigerator',
      expr: 'Kr = Tc/(Th - Tc)', tex: 'K_R = \\frac{T_c}{T_h - T_c}',
      vars: {
        Kr: { name: 'best possible COP (cooling)', tex: 'K_R' },
        Tc: { name: 'cold-side temperature', q: 'temperature', unit: '°C', value: -18, tex: 'T_c' },
        Th: { name: 'hot-side temperature', q: 'temperature', unit: '°C', value: 35, tex: 'T_h' }
      },
      practice: { unknowns: ['Kr'] },
      stories: { Kr: 'A freezer holds its contents at {Tc} and rejects heat from coils at {Th}. What is the highest COP it could have?' }
    },
    {
      name: 'Carnot limit for a heat pump',
      expr: 'Khp = Th/(Th - Tc)', tex: 'K_{HP} = \\frac{T_h}{T_h - T_c}',
      vars: {
        Khp: { name: 'best possible COP (heating)', tex: 'K_{HP}' },
        Th: { name: 'temperature of the heat delivered', q: 'temperature', unit: '°C', value: 45, tex: 'T_h' },
        Tc: { name: 'temperature of the heat source outdoors', q: 'temperature', unit: '°C', value: 0, tex: 'T_c' }
      },
      practice: { unknowns: ['Khp'] },
      stories: { Khp: 'A heat pump takes heat from outdoor air at {Tc} and feeds radiators at {Th}. What is its Carnot limit?' }
    },
    {
      name: 'Heat delivered by a heat pump',
      expr: 'Ph = Khp*Pe', tex: 'P_h = K_{HP}\\, P_e',
      vars: {
        Ph: { name: 'heating power delivered', q: 'power', unit: 'kW', tex: 'P_h' },
        Khp: { name: 'coefficient of performance (heating)', value: 3.2, tex: 'K_{HP}' },
        Pe: { name: 'electrical power drawn', q: 'power', unit: 'kW', value: 2.5, tex: 'P_e' }
      },
      stories: {
        Ph: 'A heat pump with a COP of {Khp} draws {Pe} of electricity. How much heat does it deliver?',
        Pe: 'A house needs {Ph} of heat. How much electrical power does a heat pump with COP {Khp} draw?'
      }
    }
  ],
  examples: [
    {
      title: 'Heat pump or electric heater?',
      q: 'A house needs 10 000 kWh of heat over a winter. How much electricity would an electric heater use, and how much a heat pump with a seasonal COP of 3.2?',
      steps: [
        'Electric heater: every kWh of electricity gives 1 kWh of heat, so 10 000 kWh.',
        'Heat pump: $W = Q_h / K_{HP} = 10\\,000/3.2 = 3125$ kWh.',
        'The other 6875 kWh are drawn from the outdoor air.'
      ],
      a: '10 000 kWh versus about 3100 kWh'
    },
    {
      title: 'Making ice',
      q: 'A freezer with a COP of 2.5 turns 1.0 kg of water already at 0 °C into ice. How much electrical energy does it use, and how much heat goes into the kitchen?',
      steps: [
        'Heat to remove: $Q_c = mL_f = 1.0 \\times 334 = 334$ kJ.',
        'Work: $W = Q_c/K_R = 334/2.5 = 134$ kJ.',
        'Heat into the kitchen: $Q_h = Q_c + W = 334 + 134 = 468$ kJ.'
      ],
      a: '134 kJ of electricity; 468 kJ of heat to the kitchen'
    }
  ],
  quiz: [
    { q: 'A fridge stands in a closed, insulated kitchen with its door open, running continuously. The kitchen…', choices: ['cools down', 'warms up', 'stays at the same temperature', 'cools, then warms'], a: 1,
      why: 'The heat moved out of the fridge returns to the kitchen, and the compressor\'s electrical energy is added as well.' },
    { q: 'A heat pump has a COP of 3. This means…', choices: ['it violates energy conservation', 'it delivers 3 J of heat for each joule of work, the other 2 J coming from outside', 'it is 300 % efficient at making energy', 'it needs 3 J of work per joule of heat'], a: 1,
      why: '$Q_h = Q_c + W$: with $W = 1$ J and $Q_h = 3$ J, 2 J are drawn from the cold outdoors.' },
    { q: 'A heat pump\'s COP falls when…', choices: ['the outdoor temperature rises', 'the radiators are run cooler', 'the outdoor air gets colder or the radiators hotter', 'the house is better insulated'], a: 2,
      why: 'The Carnot limit $T_h/(T_h - T_c)$ falls as the temperature lift $T_h - T_c$ grows.' },
    { q: 'A COP greater than 1 for a heat pump violates conservation of energy.', a: false,
      why: 'No energy is created: the heat delivered is the work plus the heat drawn from the cold source.' },
    { q: 'What is the Carnot COP of a heat pump working between 0 °C outside and 40 °C inside?', choices: ['1.0', '6.8', '7.8', '40'], a: 2,
      why: '$T_h/(T_h - T_c) = 313.15/40 = 7.8$.' }
  ],
  applications: ['Domestic refrigerators, freezers and air conditioners.', 'Air-source and ground-source heat pumps for home heating.', 'Cold stores, supermarket cabinets and refrigerated transport.', 'Liquefying gases such as nitrogen and natural gas.'],
  history: 'Jacob Perkins patented a vapour-compression refrigerator in 1834, and Kelvin described the heat pump ("heat multiplier") in 1852. Domestic electric fridges spread in the 1920s–30s; heat pumps for homes became common from the late 20th century.',
  sim: { id: 'heat-engine-cycle', params: { reverse: true }, title: 'A Carnot refrigerator and heat pump' }
},

{
  id: 'entropy', parent: 'thermodynamics', title: 'Entropy', level: 3,
  short: 'A measure of how many microscopic arrangements are consistent with what we see — and of how much heat has been spread at what temperature; the total never decreases.',
  keywords: ['entropy', 'dS = dQ/T', 'Clausius entropy', 'Boltzmann entropy', 'S = k ln W', 'microstates', 'macrostate', 'disorder', 'reversible', 'irreversible', 'free expansion', 'entropy of mixing', 'state function'],
  prereq: ['second-law-thermodynamics', 'thermodynamic-processes', 'math:logarithms'],
  related: ['third-law', 'carnot-cycle', 'maxwell-boltzmann', 'latent-heat', 'math:combinatorics'],
  body: `
The [[second-law-thermodynamics|second law]] needs a quantity that only ever grows. Entropy is that quantity, and it has two definitions that turn out to agree — one from heat engines, one from counting.

### Clausius: heat divided by temperature
When a small amount of heat $\\delta Q$ is added *reversibly* to a system at absolute temperature $T$, its entropy rises by

$$dS = \\frac{\\delta Q_{rev}}{T}$$

in J/K. The same heat means more entropy when delivered at a low temperature than at a high one. Entropy is a **state function**: the change between two states is the same whatever happens in between, so for an irreversible process you compute $\\Delta S$ along any *reversible* path joining the same end states.

- Melting 1 kg of ice at 273 K: $\\Delta S = mL_f/T = 334\\,000/273.15 = 1220$ J/K.
- Heating 1 kg of water from 20 °C to 80 °C: $\\Delta S = \\int mc\\,dT/T = mc\\ln(T_2/T_1) = 780$ J/K.
- An ideal gas doubling its volume at constant temperature: $\\Delta S = nR\\ln 2 = 5.76$ J/K per mole.

### Boltzmann: counting arrangements
A **macrostate** — what we measure: pressure, volume, temperature — can be realised by an enormous number $\\Omega$ of **microstates**, the exact positions and velocities of every molecule. Boltzmann proposed

$$S = k_B \\ln \\Omega$$

For a gas that doubles its volume, each molecule has twice as many places to be, so $\\Omega$ grows by $2^N$ and $\\Delta S = k_B \\ln 2^N = Nk_B\\ln 2 = nR\\ln 2$ — exactly Clausius's result. The logarithm makes entropy additive: two systems together have $\\Omega_1\\Omega_2$ microstates and entropy $S_1 + S_2$.

The second law now reads: an isolated system drifts into the macrostates with the most microstates, simply because there are overwhelmingly more of them. **Entropy increases because it is overwhelmingly probable.**

### Entropy in action
- **Free expansion.** A gas rushing into a vacuum absorbs no heat, yet its entropy rises by $nR\\ln(V_2/V_1)$. That is not a contradiction: $\\delta Q/T$ applies only to reversible paths.
- **Heat flow.** Heat moving from hot to cold raises total entropy, $Q/T_c - Q/T_h > 0$. Heat flow stops, at equilibrium, when entropy is at its maximum — which defines temperature: $1/T = \\partial S/\\partial U$.
- **Engines.** In one cycle an engine takes entropy $Q_h/T_h$ from the hot reservoir and must pass at least as much to the cold one: $Q_c/T_c \\ge Q_h/T_h$, which is the [[carnot-cycle|Carnot limit]].
- **Life and order.** A growing plant or a freezing lake lowers its own entropy, but exports more to its surroundings as heat. The total still rises.

### Is entropy disorder?
"Disorder" is a useful slogan but can mislead. Entropy counts microstates, or equivalently measures how widely energy is spread among the available ways of holding it. Oil separating from water, or crystals forming in a cooling solution, look more orderly but still raise the total entropy once the heat released to the surroundings is counted.
`,
  ideas: [
    'Clausius: dS = δQ_rev/T; entropy is a state function measured in J/K.',
    'Boltzmann: S = k_B ln Ω, where Ω counts the microstates of a macrostate.',
    'The two definitions agree; for free expansion both give ΔS = nR ln(V₂/V₁).',
    'For an irreversible process, compute ΔS along a reversible path between the same end states.',
    'The total entropy of an isolated system increases in every real process and is constant only in reversible ones.'
  ],
  pitfalls: [
    'ΔS = Q/T for any process — Only along a reversible path. In a free expansion Q = 0 but the entropy rises.',
    'Entropy simply means disorder — It counts microscopic arrangements (how widely energy is spread). Some processes that look more ordered, like oil separating from water, still raise the total entropy.',
    'Using °C in Q/T — Entropy needs absolute temperature: 334 kJ at 0 °C is 1220 J/K, not infinite.'
  ],
  formulas: [
    {
      name: 'Entropy change at constant temperature',
      expr: 'dS = Q/T', tex: '\\Delta S = \\frac{Q}{T}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        Q: { name: 'heat added reversibly', q: 'energy', unit: 'kJ', value: 334, signed: true },
        T: { name: 'absolute temperature', q: 'temperature', unit: '°C', value: 0 }
      },
      note: 'For phase changes, or for a reservoir so large that its temperature does not change.',
      stories: {
        dS: 'By how much does the entropy of 1 kg of ice rise when it melts at {T}, absorbing {Q}?',
        Q: 'A large lake at {T} gains {dS} of entropy. How much heat did it absorb?'
      }
    },
    {
      name: 'Entropy change on heating',
      expr: 'dS = m*c*ln(T2/T1)', tex: '\\Delta S = m c \\ln\\frac{T_2}{T_1}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        m: { name: 'mass', q: 'mass', unit: 'kg', value: 1 },
        c: { name: 'specific heat', q: 'specificheat', unit: 'J/(kg·K)', value: 4186 },
        T2: { name: 'final temperature', q: 'temperature', unit: '°C', value: 80 },
        T1: { name: 'starting temperature', q: 'temperature', unit: '°C', value: 20 }
      },
      note: 'From integrating $mc\\,dT/T$; assumes c is constant and no phase change.',
      stories: { dS: 'What is the entropy change of {m} of water (c = {c}) heated from {T1} to {T2}?' }
    },
    {
      name: 'Isothermal volume change of an ideal gas',
      expr: 'dS = n*R*ln(V2/V1)', tex: '\\Delta S = nR\\ln\\frac{V_2}{V_1}',
      vars: {
        dS: { name: 'entropy change', q: 'entropy', unit: 'J/K', signed: true, tex: '\\Delta S' },
        n: { name: 'amount of gas', q: 'amount', unit: 'mol', value: 1 },
        R: { const: 'R' },
        V2: { name: 'final volume', q: 'volume', unit: 'L', value: 2 },
        V1: { name: 'starting volume', q: 'volume', unit: 'L', value: 1 }
      },
      note: 'Holds for any process between the two states at the same temperature, including a sudden free expansion.',
      stories: { dS: '{n} of gas expands freely from {V1} into an evacuated box, ending with {V2}. By how much does its entropy rise?' }
    },
    {
      name: 'Boltzmann\'s entropy',
      expr: 'S = kB*ln(Om)', tex: 'S = k_B \\ln \\Omega',
      vars: {
        S: { name: 'entropy', q: 'entropy', unit: 'J/K' },
        kB: { const: 'kB' },
        Om: { name: 'number of microstates', value: 1e25, tex: '\\Omega' }
      },
      practice: { unknowns: ['S'] },
      stories: { S: 'A system can be arranged in {Om} equally likely microscopic ways. What is its entropy?' }
    }
  ],
  derivation: {
    title: 'Two routes to the entropy of a free expansion',
    steps: [
      { text: 'An ideal gas doubles its volume by rushing into a vacuum. No heat flows and no work is done, so $T$ is unchanged. Clausius: replace it by a reversible isothermal expansion between the same states, in which $Q = W = nRT\\ln 2$:', tex: '\\Delta S = \\frac{Q_{rev}}{T} = nR\\ln 2' },
      { text: 'Boltzmann: each of the $N$ molecules now has twice the volume to be in, so the number of microstates is multiplied by $2^N$:', tex: '\\Delta S = k_B\\ln\\frac{\\Omega_2}{\\Omega_1} = k_B \\ln 2^N = N k_B \\ln 2' },
      { text: 'Since $Nk_B = nR$, the two agree:', tex: 'N k_B \\ln 2 = nR\\ln 2 \\approx 5.76\\ \\mathrm{J/K}\\ \\text{per mole}' }
    ]
  },
  examples: [
    {
      title: 'Ice melting in a warm room',
      q: 'A 1.0 kg block of ice at 0 °C melts in a room at 20 °C, absorbing 334 kJ. Find the entropy changes of the ice, the room and the universe.',
      steps: [
        'Ice (melting at 273.15 K): $\\Delta S = +334\\,000/273.15 = +1223$ J/K.',
        'Room (losing heat at 293.15 K, large enough to stay at 20 °C): $\\Delta S = -334\\,000/293.15 = -1139$ J/K.',
        'Total: $+1223 - 1139 = +84$ J/K. Positive, as it must be for an irreversible process.'
      ],
      a: '+1223 J/K, −1139 J/K, +84 J/K in total'
    },
    {
      title: 'Mixing hot and cold water',
      q: '1.0 kg of water at 80 °C is mixed with 1.0 kg at 20 °C in an insulated jug, ending at 50 °C. What is the total entropy change?',
      steps: [
        'Hot water: $\\Delta S = mc\\ln(T_f/T_1) = 4186 \\ln(323.15/353.15) = -371.6$ J/K.',
        'Cold water: $\\Delta S = 4186 \\ln(323.15/293.15) = +407.9$ J/K.',
        'Total: $+36.2$ J/K. The cold water gains more entropy than the hot loses, because it receives the heat at a lower temperature.'
      ],
      a: 'About +36 J/K'
    }
  ],
  quiz: [
    { q: 'Which has the higher entropy?', choices: ['1 kg of ice at 0 °C', '1 kg of liquid water at 0 °C', '1 kg of liquid water at 20 °C', 'They are all equal'], a: 2,
      why: 'Melting adds 1220 J/K; warming the water further adds more. The warm liquid has the most microstates available.' },
    { q: 'Over one full cycle of any engine, the entropy change of the working substance is…', choices: ['positive', 'negative', 'zero', 'impossible to say'], a: 2,
      why: 'Entropy is a state function and the substance returns to its starting state. The entropy produced by irreversibility ends up in the surroundings.' },
    { q: 'One mole of ideal gas expands freely into a vacuum, doubling its volume. Its entropy change is…', choices: ['zero, because Q = 0', '+5.76 J/K', '−5.76 J/K', 'infinite'], a: 1,
      why: '$\\Delta S = nR\\ln 2 = 5.76$ J/K. $Q/T$ applies only along reversible paths, and free expansion is irreversible.' },
    { q: 'A system\'s entropy can decrease, provided its surroundings\' entropy increases by at least as much.', a: true,
      why: 'The second law restricts the total. Refrigerators and living things lower their own entropy this way.' },
    { q: 'If the number of microstates Ω doubles, the entropy…', choices: ['doubles', 'increases by $k_B \\ln 2$', 'increases by $2k_B$', 'is squared'], a: 1,
      why: '$S = k_B\\ln\\Omega$, so $\\Delta S = k_B\\ln 2$. Entropy grows only logarithmically with Ω.' }
  ],
  applications: ['Setting the limits of engines, refrigerators and chemical processes.', 'Predicting which chemical reactions and phase changes happen spontaneously.', 'Information theory, where the same mathematics measures information.', 'Cosmology and the arrow of time.'],
  history: 'Rudolf Clausius coined the word "entropy" in 1865, from the Greek for "transformation". Ludwig Boltzmann connected it to the counting of molecular arrangements in 1877; the formula S = k log W is carved on his tombstone in Vienna.',
  sim: { id: 'heat-gas-box', params: { gather: true }, title: 'Free expansion: entropy rising' }
},

{
  id: 'third-law', parent: 'thermodynamics', title: 'Third law and absolute zero', level: 2,
  short: 'As the temperature approaches absolute zero, the entropy of a perfect crystal approaches zero — and absolute zero itself can never be reached in a finite number of steps.',
  keywords: ['third law of thermodynamics', 'absolute zero', 'Nernst heat theorem', 'unattainability', 'zero-point energy', 'residual entropy', 'laser cooling', 'dilution refrigerator', 'Bose-Einstein condensate', 'low-temperature physics', '0 K'],
  prereq: ['entropy', 'temperature'],
  related: ['carnot-cycle', 'equipartition', 'heat-capacity-solids', 'superconductivity', 'quantum-harmonic-oscillator'],
  body: `
Absolute zero, 0 K or −273.15 °C, sits at the bottom of every temperature scale. The **third law of thermodynamics** says what happens as it is approached.

> [!key] As the temperature approaches absolute zero, the entropy of a system approaches a constant minimum — zero for a perfect crystal.

Walther Nernst reached the idea in 1906 from measurements of chemical reactions at low temperatures (his "heat theorem"); Max Planck added that the constant is zero for a perfect crystal. In Boltzmann's language ([[entropy]]), at 0 K a perfect crystal settles into its single lowest-energy arrangement: $\\Omega = 1$ and $S = k_B\\ln 1 = 0$.

### Consequences
- **Heat capacities vanish.** Entropy is built up from $dS = C\\,dT/T$; for $S$ to stay finite as $T \\to 0$, the heat capacity $C$ must fall to zero. It does: as $T^3$ in insulating crystals, in proportion to $T$ in metals. This is the same quantum freezing out that defeats classical [[equipartition]] ([[heat-capacity-solids]]).
- **Absolute zero cannot be reached.** Each cooling step — say, magnetising a sample while it touches a cold bath, then isolating it and demagnetising it — lowers the temperature by a smaller amount as $T$ falls, because the entropy curves at different settings converge on the same zero. No finite sequence of steps gets there. The same idea appears in the [[carnot-cycle|Carnot]] refrigerator: to pump heat $Q_c$ out of something at $T_c$ into a room at $T_h$ takes at least $W = Q_c(T_h - T_c)/T_c$, which grows without limit as $T_c \\to 0$.
- **Expansion coefficients vanish** too: near 0 K materials stop changing size with temperature.

### Zero-point motion
Absolute zero is not a state of perfect stillness. Quantum mechanics leaves every system with a **zero-point energy** ([[quantum-harmonic-oscillator]]): atoms in a crystal still vibrate at 0 K. The zero-point motion of helium atoms is so large that helium stays liquid at atmospheric pressure all the way down to absolute zero; it freezes only under about 25 atmospheres.

### How close can we get?
| | Temperature |
|---|---|
| Cosmic microwave background | 2.7 K |
| Boomerang Nebula (coldest known natural place) | about 1 K |
| Liquid helium-4, pumped | about 1 K |
| Dilution refrigerator (routine in quantum-computing labs) | a few mK |
| Laser-cooled atoms, Bose–Einstein condensates | 100 nK and below |
| Record for expanding atom clouds | below 1 nK |

Low temperatures reveal quantum behaviour on a large scale: [[superconductivity]], superfluid helium that flows without friction, and Bose–Einstein condensates, in which millions of atoms share one quantum state.

### Imperfect crystals
Glasses and some crystals are "frozen" into one of many possible disordered arrangements and keep a **residual entropy** at 0 K. Ordinary ice is the classic case: its hydrogen atoms can sit in many equivalent patterns, leaving about $R\\ln\\tfrac32 = 3.4$ J/(mol·K), a value Linus Pauling explained in 1935.
`,
  ideas: [
    'As T → 0 the entropy of a perfect crystal tends to zero: one microstate, S = k ln 1 = 0.',
    'Heat capacities and expansion coefficients vanish as T → 0.',
    'Absolute zero cannot be reached in a finite number of steps.',
    'The work needed to extract heat at T_c grows as (T_h − T_c)/T_c, without limit as T_c → 0.',
    'Zero-point motion remains at 0 K; glasses and ice keep a residual entropy.'
  ],
  pitfalls: [
    'At absolute zero all motion stops — Quantum mechanics leaves a zero-point motion; helium even stays liquid.',
    'A good enough refrigerator could reach 0 K — The third law forbids reaching it in a finite number of steps; experiments get arbitrarily close.',
    'Every substance has zero entropy at 0 K — Only perfect crystals; glasses and ordinary ice keep a residual entropy.'
  ],
  formulas: [
    {
      name: 'Minimum work to extract heat at a low temperature',
      expr: 'W = Qc*(Th - Tc)/Tc', tex: 'W = Q_c\\,\\frac{T_h - T_c}{T_c}',
      vars: {
        W: { name: 'minimum work', q: 'energy', unit: 'J' },
        Qc: { name: 'heat extracted from the cold object', q: 'energy', unit: 'J', value: 1, tex: 'Q_c' },
        Th: { name: 'temperature where the heat is rejected', q: 'temperature', unit: 'K', value: 300, tex: 'T_h' },
        Tc: { name: 'temperature of the cold object', q: 'temperature', unit: 'K', value: 1, tex: 'T_c' }
      },
      note: 'The reversed Carnot cycle: the best any refrigerator can do.',
      practice: { unknowns: ['W', 'Tc'] },
      stories: {
        W: 'At the very least, how much work does it take to remove {Qc} of heat from a sample at {Tc} and dump it into a room at {Th}?',
        Tc: 'A refrigerator dumping heat at {Th} can spend at most {W} to remove {Qc}. What is the lowest temperature it can pump from?'
      }
    }
  ],
  examples: [
    {
      title: 'The rising price of cold',
      q: 'How much work must an ideal refrigerator spend, at the least, to extract 1 J of heat at 1 K, and at 1 mK, rejecting it at 300 K?',
      steps: [
        'At 1 K: $W = 1 \\times (300 - 1)/1 = 299$ J.',
        'At 1 mK: $W = 1 \\times (300 - 0.001)/0.001 \\approx 300\\,000$ J.',
        'Each factor of ten closer to absolute zero multiplies the cost by ten; reaching 0 K would need infinite work.'
      ],
      a: '299 J at 1 K, about 300 kJ at 1 mK'
    },
    {
      title: 'Residual entropy of ice',
      q: 'Pauling estimated that each water molecule in ice keeps about 3/2 possible hydrogen arrangements even at 0 K. What residual molar entropy does that give?',
      steps: [
        'For one mole, $\\Omega = (3/2)^{N_A}$.',
        '$S = k_B\\ln\\Omega = N_A k_B \\ln\\tfrac32 = R\\ln 1.5 = 8.314 \\times 0.405 = 3.37$ J/(mol·K).',
        'Measurements agree closely — ice does not obey the "perfect crystal" form of the third law.'
      ],
      a: 'About 3.4 J/(mol·K)'
    }
  ],
  quiz: [
    { q: 'According to the third law, the entropy of a perfect crystal at absolute zero is…', choices: ['infinite', 'zero', 'equal to R', 'negative'], a: 1,
      why: 'It has a single ground-state arrangement, $\\Omega = 1$, so $S = k_B\\ln 1 = 0$.' },
    { q: 'Absolute zero cannot be reached because…', choices: ['no material is cold enough to use as a sink', 'each cooling step achieves less, and extracting heat costs ever more work as T → 0', 'atoms would stop and fall apart', 'the second law forbids temperatures below 1 K'], a: 1,
      why: 'The minimum work $Q_c(T_h - T_c)/T_c$ diverges, and the entropy curves converge, so no finite process reaches 0 K.' },
    { q: 'At absolute zero, the atoms of a crystal are completely at rest.', a: false,
      why: 'Quantum zero-point motion remains; it is why helium stays liquid down to 0 K at atmospheric pressure.' },
    { q: 'As the temperature of a solid approaches absolute zero, its heat capacity…', choices: ['approaches 3R per mole', 'grows without limit', 'approaches zero', 'stays constant'], a: 2,
      why: 'For the entropy $\\int C\\,dT/T$ to stay finite, $C$ must vanish as $T \\to 0$ — in practice as $T^3$ for insulators.' }
  ],
  applications: ['Dilution refrigerators for superconducting quantum computers.', 'Laser cooling and atomic clocks.', 'Superconducting magnets in MRI scanners, cooled by liquid helium.', 'Calculating absolute entropies for chemistry from heat-capacity measurements.'],
  history: 'Walther Nernst proposed his heat theorem in 1906 and received the 1920 Nobel Prize in Chemistry for it. Heike Kamerlingh Onnes liquefied helium in 1908 and discovered superconductivity in 1911; the first Bose–Einstein condensates were made in 1995.'
}

);
