/* HYPER-CHEMISTRY · content/thermochemistry.js — enthalpy changes: what they are,
 * how calorimeters measure them, and how Hess's law, formation enthalpies and bond
 * enthalpies let you add them up on paper. */
Hyper.add(

{
  id: 'enthalpy', parent: 'thermochemistry', title: 'Enthalpy and heats of reaction', level: 1,
  short: 'Reactions give out or take in heat. The enthalpy change ΔH is that heat measured at constant pressure: negative for exothermic reactions, positive for endothermic ones.',
  keywords: ['enthalpy', 'heat of reaction', 'exothermic', 'endothermic', 'ΔH', 'delta H', 'system', 'surroundings', 'state function', 'thermochemical equation', 'standard conditions', 'heat of combustion', 'calorific value', 'higher heating value', 'lower heating value', 'internal energy'],
  prereq: ['chemical-equations', 'mole-concept', 'physics:heat-internal-energy', 'physics:first-law-thermodynamics'],
  related: ['calorimetry', 'hess-law', 'enthalpy-of-formation', 'bond-enthalpies', 'gibbs-energy', 'physics:latent-heat'],
  body: `
Burn natural gas under a pan and the water heats up; dissolve a spoonful of ammonium nitrate in water and the beaker turns cold in your hand. Every reaction moves energy between the chemicals — the **system** — and everything else, the **surroundings**. Chemical energy is stored in the arrangement of bonds and in the forces between particles; rearrange the atoms and some of it is released as heat, or extra heat has to be drawn in.

- An **exothermic** reaction gives heat to the surroundings: combustion, neutralisation, the rusting iron in a hand warmer.
- An **endothermic** reaction takes heat from them: melting ice, the cold pack, photosynthesis, the thermal decomposition of limestone.

### Why "enthalpy" and not just "heat"
Heat depends on the path, so chemists need a property of the system itself. Most reactions run open to the atmosphere, at constant pressure, and a reaction that makes gas has to push the air back to make room — that work, $p\\,\\Delta V$, is energy that does not appear as heat. **Enthalpy**, $H = U + pV$, is defined to take care of this: at constant pressure the heat exchanged is exactly the change in enthalpy,

$$q_p = \\Delta H = H_\\text{products} - H_\\text{reactants}$$

By this convention **ΔH is negative for an exothermic reaction** (the products hold less enthalpy; the difference left as heat) and **positive for an endothermic one**. For reactions with gases the difference from the internal energy change of the [[physics:first-law-thermodynamics|first law]] is $\\Delta H = \\Delta U + \\Delta n_\\text{gas} RT$ — only a few kJ/mol, because $RT$ is only 2.48 kJ/mol at room temperature.

### Thermochemical equations
An enthalpy change belongs to an equation as written:

$$\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)} \\qquad \\Delta H^\\circ = -890.3\\ \\mathrm{kJ/mol}$$

"Per mole" means per mole of the reaction as written — here per mole of methane. Double the equation and ΔH doubles; reverse it and the sign flips. States matter: making water as vapour instead of liquid releases 44 kJ less per mole of water, the heat that would come back if the vapour condensed. The **standard** enthalpy change, $\\Delta H^\\circ$, is for pure substances at 1 bar, usually quoted at 298.15 K.

Because $H$ is a **state function** — it depends only on the state, not on how it was reached — enthalpy changes can be added up like the heights of steps on a staircase. That is the whole basis of [[hess-law|Hess's law]], [[enthalpy-of-formation|formation enthalpies]] and [[bond-enthalpies|bond enthalpies]].

### Numbers worth knowing
| Change | ΔH (kJ/mol) |
|---|---|
| methane burning (liquid water formed) | −890 |
| glucose burning, or respired in the body | −2803 |
| strong acid + strong base (dilute) | about −57 |
| ammonium nitrate dissolving (cold pack) | +25.7 |
| water evaporating at 25 °C | +44.0 |
| limestone to quicklime, $\\ce{CaCO3 -> CaO + CO2}$ | +178 |

Per kilogram, hydrogen releases 142 MJ, methane 55.5 MJ, petrol about 48 MJ and sugar only 16 MJ — which is why aircraft fly on hydrocarbons and not on carbohydrates.

> [!tip] Heating values of fuels come in two kinds. The **higher** value counts the heat returned when the water vapour in the flue gas condenses; the **lower** value leaves it as vapour. For natural gas they differ by about 11 %, the gain a condensing boiler recovers by cooling its exhaust below the dew point.
`,
  ideas: [
    'At constant pressure the heat a reaction exchanges with its surroundings equals its enthalpy change ΔH.',
    'ΔH < 0 is exothermic (heat released), ΔH > 0 is endothermic (heat absorbed).',
    'ΔH belongs to the equation as written: it scales with the amounts and changes sign when the equation is reversed.',
    'The states of reactants and products matter: liquid water and water vapour differ by 44 kJ/mol.',
    'Enthalpy is a state function, so enthalpy changes can be added along any route.'
  ],
  pitfalls: [
    'An exothermic reaction has a positive ΔH because heat comes out — The sign is from the system\'s point of view: it loses enthalpy, so ΔH is negative.',
    'ΔH tells you how fast a reaction goes — It says nothing about speed. Methane and oxygen can sit mixed for years until a spark supplies the activation energy.',
    'Exothermic reactions are spontaneous and endothermic ones are not — Ice melts and cold packs work although both are endothermic; entropy decides too (see Gibbs free energy).'
  ],
  formulas: [
    {
      name: 'Heat from an amount that reacts',
      expr: 'q = n*dH', tex: 'q = n\\,\\Delta H',
      vars: {
        q: { name: 'heat taken in by the system (negative: released)', q: 'energy', unit: 'kJ', signed: true },
        n: { name: 'amount that reacts (moles of the reaction as written)', q: 'amount', unit: 'mol', value: 2.5 },
        dH: { name: 'enthalpy change of the reaction', q: 'molarenergy', unit: 'kJ/mol', value: -890.3, signed: true, tex: '\\Delta H' }
      },
      note: 'The defaults: 2.5 mol (40 g) of methane burned, $\\Delta H = -890.3$ kJ/mol. A negative $q$ is heat given to the surroundings.',
      practice: { unknowns: ['q', 'n'] },
      stories: {
        q: 'A gas burner consumes {n} of methane ($\\Delta H$ = {dH}). How much heat does the system exchange?',
        n: 'A process needs {q} of heat from burning methane ($\\Delta H$ = {dH}). What amount of methane must burn?'
      }
    },
    {
      name: 'Enthalpy and internal energy for reactions with gases',
      expr: 'dH = dU + dn*R*T', tex: '\\Delta H = \\Delta U + \\Delta n_\\text{gas} R T',
      vars: {
        dH: { name: 'enthalpy change (constant pressure)', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H' },
        dU: { name: 'internal energy change (constant volume)', q: 'molarenergy', unit: 'kJ/mol', value: -885.3, signed: true, tex: '\\Delta U' },
        dn: { name: 'change in moles of gas', int: true, signed: true, fixed: true, value: -2, tex: '\\Delta n_\\text{gas}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: 'K', value: 298.15 }
      },
      note: 'Only gases count in $\\Delta n_\\text{gas}$. The defaults are methane burning to liquid water: 3 mol of gas become 1, so $\\Delta n_\\text{gas} = -2$, and a bomb calorimeter measures $\\Delta U = -885.3$ kJ/mol.',
      practice: { unknowns: ['dH', 'dU'] },
      stories: {
        dH: 'A bomb calorimeter gives {dU} for $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$ at {T}. What is ΔH?',
        dU: 'The enthalpy of combustion of methane is {dH} at {T}. What internal energy change would a sealed bomb measure?'
      }
    },
    {
      name: 'Energy per kilogram of fuel',
      expr: 'E = -dH/M', tex: 'E = -\\frac{\\Delta H_\\text{c}}{M}',
      vars: {
        E: { name: 'heat released per unit mass', q: 'specificenergy', unit: 'MJ/kg' },
        dH: { name: 'enthalpy of combustion', q: 'molarenergy', unit: 'kJ/mol', value: -890.3, signed: true, tex: '\\Delta H_\\text{c}' },
        M: { name: 'molar mass of the fuel', q: 'molarmass', unit: 'g/mol', value: 16.04 }
      },
      note: 'MJ/kg is the same number as kJ/g. Defaults: methane.',
      practice: { unknowns: ['E', 'dH'] },
      stories: {
        E: 'Octane has $\\Delta H_\\text{c}$ = {dH} and a molar mass of {M}. How much heat does a kilogram of it release?',
        dH: 'A fuel with molar mass {M} releases {E}. What is its molar enthalpy of combustion?'
      }
    }
  ],
  examples: [
    {
      title: 'Boiling a kettle on gas',
      q: 'How much methane must burn to heat 1.50 kg of water from 20 °C to 100 °C, if all the heat reaches the water? Take $c = 4.18$ J/(g·K) and $\\Delta H_\\text{c} = -890.3$ kJ/mol.',
      steps: [
        'Heat the water needs: $q = mc\\Delta T = 1500 \\times 4.18 \\times 80 = 501.6\\ \\mathrm{kJ}$.',
        'Each mole of methane releases 890.3 kJ: $n = 501.6/890.3 = 0.563\\ \\mathrm{mol}$.',
        'Mass: $0.563 \\times 16.04 = 9.04\\ \\mathrm{g}$ — about 13 litres of gas at room conditions.',
        'A real hob passes perhaps half its heat to the pan, so it burns nearer 18 g.'
      ],
      a: 'About 9.0 g of methane in principle; roughly twice that on a real hob.'
    },
    {
      title: 'Why a condensing boiler gains 11 %',
      q: 'With water leaving as vapour, $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(g)}$ has $\\Delta H^\\circ = -802.3$ kJ/mol. Compare it with the −890.3 kJ/mol for liquid water.',
      steps: [
        'The two equations differ only in the state of the two moles of water.',
        'Condensing water releases 44.0 kJ/mol: $2 \\times 44.0 = 88.0\\ \\mathrm{kJ}$, the whole difference.',
        'A normal boiler sends that vapour up the flue. A condensing boiler cools the exhaust until the water condenses and keeps the 88 kJ: $88/802 \\approx 11\\ \\%$ more heat from the same gas.'
      ],
      a: 'The 88 kJ/mol of condensation heat, about 11 % of the lower heating value.'
    }
  ],
  quiz: [
    { q: 'You dissolve a salt in water and the beaker becomes cold. What is the sign of ΔH for dissolving the salt?', choices: ['positive: the process is endothermic', 'negative: the process is exothermic', 'zero: no reaction took place', 'it cannot be told from temperature'], a: 0,
      why: 'The solution cooled because the dissolving drew heat from the water, which is part of the surroundings. The system gained enthalpy, so ΔH > 0.' },
    { q: 'For $\\ce{2H2(g) + O2(g) -> 2H2O(l)}$, $\\Delta H = -571.6$ kJ/mol. What is ΔH for $\\ce{H2O(l) -> H2(g) + 1/2 O2(g)}$?', choices: ['−571.6 kJ/mol', '+571.6 kJ/mol', '−285.8 kJ/mol', '+285.8 kJ/mol'], a: 3,
      why: 'Reversing flips the sign, and halving the amounts halves the value: +285.8 kJ per mole of water split — the minimum energy an electrolyser must supply.' },
    { q: 'Which releases more heat: forming a mole of liquid water from hydrogen and oxygen, or forming a mole of water vapour?', choices: ['liquid water', 'water vapour', 'the same', 'it depends on the pressure only'], a: 0,
      why: 'Liquid water is lower in enthalpy than vapour by 44 kJ/mol, so reaching it releases 44 kJ more.' },
    { q: 'How much heat (in kJ) is released when 5.00 g of hydrogen burns to liquid water? ($\\Delta H = -285.8$ kJ per mole of $\\ce{H2}$, $M = 2.016$ g/mol)', answer: 708.8, unit: 'kJ',
      why: '$n = 5.00/2.016 = 2.480$ mol, and $2.480 \\times 285.8 = 709$ kJ.' },
    { q: 'For a reaction in which the number of moles of gas does not change, ΔH and ΔU are practically equal.', a: true,
      why: 'With $\\Delta n_\\text{gas} = 0$ no expansion work is done against the atmosphere, so the constant-pressure heat equals the constant-volume heat (liquids and solids change volume far too little to matter).' }
  ],
  sim: { id: 'tk-hess', params: { rx: 0, route: 0 } },
  applications: ['Rating fuels and choosing them for engines, boilers and rockets.', 'Food energy labels, from the heat of burning fats, proteins and carbohydrates.', 'Instant cold packs and self-heating cans.', 'Heat management in chemical reactors, where an exothermic reaction can run away if heat is not removed.'],
  history: 'Lavoisier and Laplace measured heats of reaction around 1782 by weighing the ice a reaction melted. The word enthalpy (from the Greek for "to warm in") is usually credited to Heike Kamerlingh Onnes, around 1909.'
},

{
  id: 'calorimetry', parent: 'thermochemistry', title: 'Calorimetry', level: 1,
  short: 'Measuring heats of reaction by letting a reaction warm or cool a known mass of water, then working back from the temperature change.',
  keywords: ['calorimeter', 'calorimetry', 'coffee-cup calorimeter', 'bomb calorimeter', 'q = mcΔT', 'heat capacity', 'calorimeter constant', 'specific heat', 'enthalpy of neutralisation', 'enthalpy of solution', 'extrapolation', 'heat loss', 'food energy'],
  prereq: ['enthalpy', 'physics:specific-heat', 'mole-concept'],
  related: ['hess-law', 'molarity', 'physics:newtons-law-of-cooling'],
  body: `
You cannot see the heat a reaction releases, but you can see what it does to water. Let the reaction happen *inside* a known mass of water, insulated from the room, and the water's temperature rise measures the heat:

$$q = m\\,c\\,\\Delta T$$

with $c = 4.18$ J/(g·K) for water and for dilute aqueous solutions. The water is the surroundings, so the reaction's heat has the opposite sign: whatever the water gains, the reaction lost. Dividing by the amount that reacted gives the molar enthalpy change,

$$\\Delta H = -\\frac{q_\\text{water}}{n} = -\\frac{m\\,c\\,\\Delta T}{n}$$

A **rise** in temperature means a negative ΔH (exothermic); a **fall** means a positive ΔH.

### The coffee-cup calorimeter
Two nested polystyrene cups with a lid and a thermometer make a surprisingly good instrument for reactions in solution: neutralisation, dissolving, displacement of copper by zinc. Being open to the air it works at constant pressure, so it measures **ΔH** directly. Usual simplifications: the solution has the density and specific heat of water, and the cup itself absorbs little heat. Mixing 50 mL of 1.0 M hydrochloric acid with 50 mL of 1.0 M sodium hydroxide raises the temperature by about 6.8 °C, which gives close to −57 kJ per mole of water formed.

### The bomb calorimeter
For combustion, the sample burns in pure oxygen at about 30 atm inside a sealed steel "bomb" immersed in water. The volume is fixed, so the heat measured is **ΔU**, not ΔH (convert with $\\Delta H = \\Delta U + \\Delta n_\\text{gas}RT$). The bomb, water and stirrer are treated as one body of heat capacity $C_\\text{cal}$, found by burning a standard — benzoic acid, whose energy of combustion is known to better than 0.01 % (26.43 kJ/g). Then $q = C_\\text{cal}\\Delta T$. This is how the energy values on food labels began: about 17 kJ/g for carbohydrate and protein and 37 kJ/g for fat.

### Getting a good number
- **Heat leaks.** An exothermic reaction warms the room a little while it runs, so the peak temperature is too low. Record temperature every 30 s before and after mixing, draw the cooling line back to the moment of mixing, and read the jump there. The calorimeter simulation on this page does exactly this.
- **The cup absorbs heat too.** Mix known masses of hot and cold water: the heat missing from the balance went into the cup, giving its heat capacity (typically 10–30 J/K for a polystyrene cup, several kJ/K for a bomb).
- **Incomplete reaction.** Use the limiting reagent for $n$, and make sure it really reacts completely.
- **Resolution.** A thermometer read to ±0.1 °C on a 5 °C rise is already a 2 % uncertainty; digital probes to 0.01 °C help.

> [!warn] The sign trips everyone up. The water warmed, so $q_\\text{water}$ is positive and the reaction's ΔH is negative. Write the minus sign in before substituting numbers.
`,
  ideas: [
    'A calorimeter measures heat through the temperature change of a known mass of water: q = mcΔT.',
    'The heat gained by the water is the heat lost by the reaction: ΔH = −q/n.',
    'A coffee-cup calorimeter runs at constant pressure and measures ΔH; a sealed bomb measures ΔU.',
    'The calorimeter\'s own heat capacity and heat lost to the room must be accounted for.',
    'Extrapolating the cooling curve back to the moment of mixing corrects for heat loss.'
  ],
  pitfalls: [
    'The temperature went up, so ΔH is positive — A rise means the reaction released heat into the water: ΔH is negative.',
    'm in q = mcΔT is the mass of the reactant — It is the mass of everything that warms: the whole solution (and, with C_cal, the vessel).',
    'Doubling the volumes of both solutions doubles the temperature rise — It doubles the heat, but also the mass to warm; ΔT stays the same. Only a higher concentration raises ΔT.'
  ],
  formulas: [
    {
      name: 'Heat absorbed by the water',
      expr: 'q = m*c*dT', tex: 'q = m\\,c\\,\\Delta T',
      vars: {
        q: { name: 'heat absorbed by the water', q: 'energy', unit: 'J', signed: true },
        m: { name: 'mass of water or solution', q: 'mass', unit: 'g', value: 100 },
        c: { name: 'specific heat capacity', q: 'specificheat', unit: 'J/(g·K)', value: 4.18 },
        dT: { name: 'temperature change', q: 'dtemp', unit: '°C', value: 6.8, signed: true, tex: '\\Delta T' }
      },
      practice: { unknowns: ['q', 'dT', 'm'] },
      stories: {
        q: 'The {m} of solution in a coffee-cup calorimeter warms by {dT}. How much heat did it absorb? (c = {c})',
        dT: 'A reaction releases {q} into {m} of water (c = {c}). By how much does the temperature change?',
        m: 'Absorbing {q} raises the temperature of some water (c = {c}) by {dT}. What mass of water is there?'
      }
    },
    {
      name: 'Molar enthalpy change from a coffee-cup calorimeter',
      expr: 'dH = -m*c*dT/n', tex: '\\Delta H = -\\frac{m\\,c\\,\\Delta T}{n}',
      vars: {
        dH: { name: 'enthalpy change per mole', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H' },
        m: { name: 'mass of the solution', q: 'mass', unit: 'g', value: 100 },
        c: { name: 'specific heat capacity of the solution', q: 'specificheat', unit: 'J/(g·K)', value: 4.18 },
        dT: { name: 'temperature change', q: 'dtemp', unit: '°C', value: 6.8, signed: true, tex: '\\Delta T' },
        n: { name: 'amount of the limiting reactant', q: 'amount', unit: 'mol', value: 0.05 }
      },
      note: 'Defaults: 50 mL of 1.0 M HCl with 50 mL of 1.0 M NaOH, 0.050 mol of water formed. The cup\'s own heat capacity is ignored.',
      practice: { unknowns: ['dH', 'dT'] },
      stories: {
        dH: 'Mixing solutions containing {n} of acid and of base, {m} in total, raises the temperature by {dT} (c = {c}). What is the enthalpy of neutralisation?',
        dT: 'The enthalpy of neutralisation is {dH}. What temperature change do you expect when {n} of water forms in {m} of solution (c = {c})?'
      }
    },
    {
      name: 'Bomb calorimeter',
      expr: 'dU = -C*dT/n', tex: '\\Delta U = -\\frac{C_\\text{cal}\\,\\Delta T}{n}',
      vars: {
        dU: { name: 'internal energy change per mole', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta U' },
        C: { name: 'heat capacity of the calorimeter', q: 'heatcap', unit: 'kJ/K', value: 10.0, tex: 'C_\\text{cal}' },
        dT: { name: 'temperature rise', q: 'dtemp', unit: 'K', value: 0.778, signed: true, tex: '\\Delta T' },
        n: { name: 'amount of sample burned', q: 'amount', unit: 'mmol', value: 2.775 }
      },
      note: 'Defaults: 0.500 g of glucose (2.775 mmol) burned in a bomb with $C_\\text{cal}$ = 10.0 kJ/K.',
      practice: { unknowns: ['dU', 'C'] },
      stories: {
        dU: 'Burning {n} of glucose in a bomb calorimeter ({C}) raises its temperature by {dT}. What is ΔU of combustion?',
        C: 'Burning {n} of benzoic acid ($\\Delta U$ = {dU}) warms a bomb calorimeter by {dT}. What is its heat capacity?'
      }
    }
  ],
  examples: [
    {
      title: 'Neutralisation, with the cup included',
      q: '50.0 mL of 1.00 M HCl and 50.0 mL of 1.00 M NaOH, both at 21.2 °C, are mixed in a polystyrene cup whose heat capacity is 17 J/K. Extrapolating the cooling curve gives 27.8 °C at the moment of mixing. Find ΔH of neutralisation.',
      steps: [
        'Temperature rise: $\\Delta T = 27.8 - 21.2 = 6.6\\ \\mathrm{K}$.',
        'Heat absorbed: solution $100 \\times 4.18 \\times 6.6 = 2759$ J, plus the cup $17 \\times 6.6 = 112$ J; total 2871 J.',
        'Water formed: $n = 0.0500 \\times 1.00 = 0.0500$ mol (the reactants are in the exact ratio).',
        '$\\Delta H = -2871/0.0500 = -57\\,400\\ \\mathrm{J/mol} = -57.4\\ \\mathrm{kJ/mol}$.',
        'Ignoring the cup would have given −55.2 kJ/mol: the correction is about 4 %.'
      ],
      a: 'ΔH ≈ −57 kJ per mole of water formed.'
    },
    {
      title: 'Calibrating and using a bomb',
      q: 'Burning 1.000 g of benzoic acid (26.43 kJ/g released) warms a bomb calorimeter by 2.64 K. Then 0.800 g of sucrose ($\\ce{C12H22O11}$, 342.30 g/mol) warms it by 1.25 K. Find $C_\\text{cal}$ and ΔU of combustion of sucrose.',
      steps: [
        '$C_\\text{cal} = 26.43\\ \\mathrm{kJ}/2.64\\ \\mathrm{K} = 10.01\\ \\mathrm{kJ/K}$.',
        'Heat from the sucrose: $10.01 \\times 1.25 = 12.51\\ \\mathrm{kJ}$.',
        'Amount: $0.800/342.30 = 2.337 \\times 10^{-3}$ mol, so $\\Delta U = -12.51/0.002337 = -5354\\ \\mathrm{kJ/mol}$.',
        'Sucrose burns as $\\ce{C12H22O11 + 12O2 -> 12CO2 + 11H2O(l)}$: 12 mol of gas in, 12 out, so ΔH ≈ ΔU. The accepted value is −5644 kJ/mol; the shortfall suggests unburnt sample or a misread thermometer — worth repeating.'
      ],
      a: 'C_cal ≈ 10.0 kJ/K; ΔU ≈ −5.35 MJ/mol (accepted −5.64 MJ/mol).'
    }
  ],
  quiz: [
    { q: 'In a coffee-cup calorimeter the temperature falls from 22.0 °C to 18.5 °C as a salt dissolves. Which is true?', choices: ['ΔH of solution is positive', 'ΔH of solution is negative', 'the water released heat to the salt, so ΔH is negative', 'no heat was exchanged'], a: 0,
      why: 'The water lost heat to the dissolving salt: $q_\\text{water} < 0$, so ΔH = −q/n is positive. Dissolving is endothermic.' },
    { q: 'Heat escapes from a coffee-cup calorimeter during an exothermic reaction and no correction is made. The measured ΔH will be…', choices: ['too negative', 'not negative enough (too small in size)', 'correct, because heat loss affects both readings', 'positive'], a: 1,
      why: 'The peak temperature is lower than it should be, so the heat, and hence the size of ΔH, is underestimated. Extrapolating the cooling curve fixes this.' },
    { q: 'You repeat a neutralisation with 100 mL of each solution instead of 50 mL, same concentrations. The temperature rise…', choices: ['doubles', 'halves', 'stays the same', 'quadruples'], a: 2,
      why: 'Twice the reactants release twice the heat, but there is twice the solution to warm. ΔT is unchanged.' },
    { q: '2.00 g of NaOH (40.00 g/mol) dissolves in 100.0 g of water and the temperature rises by 5.1 °C. Taking the mass of solution as 102 g and c = 4.18 J/(g·K), what is ΔH of solution in kJ/mol?', answer: -43.5, unit: 'kJ/mol',
      why: '$q = 102 \\times 4.18 \\times 5.1 = 2174$ J; $n = 0.0500$ mol; ΔH = −2174/0.0500 = −43.5 kJ/mol (the accepted value is −44.5 kJ/mol).' },
    { q: 'A bomb calorimeter measures the enthalpy of combustion directly.', a: false,
      why: 'The bomb is sealed at constant volume, so it measures ΔU. ΔH follows by adding $\\Delta n_\\text{gas}RT$.' }
  ],
  sim: 'tk-calorimeter',
  applications: ['Food energy values and nutrition labels.', 'Rating coal, biomass and waste fuels (gross and net calorific value).', 'Differential scanning calorimetry of polymers, drugs and metals: melting, curing and glass transitions.', 'Safety testing of reactions before scale-up in the chemical industry.'],
  history: 'The first calorimeter, Lavoisier and Laplace\'s ice calorimeter of 1782, measured heat by the water melted from a jacket of ice. Marcellin Berthelot introduced the steel combustion bomb in 1881.'
},

{
  id: 'hess-law', parent: 'thermochemistry', title: 'Hess\'s law', level: 2,
  short: 'The enthalpy change of a reaction is the same whatever route it takes, so reaction enthalpies can be added and subtracted like the steps of a staircase — even for reactions that cannot be measured.',
  keywords: ['Hess\'s law', 'Hess law', 'constant heat summation', 'energy cycle', 'enthalpy cycle', 'state function', 'route independence', 'combining equations', 'Born–Haber cycle', 'enthalpy of combustion'],
  prereq: ['enthalpy', 'calorimetry', 'chemical-equations'],
  related: ['enthalpy-of-formation', 'bond-enthalpies', 'lattice-energy', 'math:linear-equations'],
  body: `
Climb from the ground floor to the third floor by the stairs or by the lift: your change in height is the same. Enthalpy behaves like height. It is a **state function** — a property of the substances present, not of their history — so the enthalpy change from a given set of reactants to a given set of products does not depend on the route:

$$\\Delta H_\\text{direct} = \\Delta H_1 + \\Delta H_2 + \\Delta H_3 + \\dots$$

That is **Hess's law**. If it were false you could go one way round a cycle and come back the other and have heat left over — a machine that makes energy from nothing, forbidden by the [[physics:first-law-thermodynamics|first law]].

### What it is good for
Many reactions cannot be measured directly. Carbon burned in a limited supply of oxygen gives a mixture of $\\ce{CO}$ and $\\ce{CO2}$, never pure CO; graphite and hydrogen do not simply combine to form methane in a calorimeter. But combustion enthalpies are easy to measure, and Hess's law turns them into the answer.

### The rules for combining equations
Treat thermochemical equations like algebraic equations:
1. **Reverse** an equation and change the sign of its ΔH.
2. **Multiply** an equation by a number and multiply its ΔH by the same number.
3. **Add** equations and add their ΔH values. Species appearing on both sides cancel.

Arrange the given equations so that, when added, everything cancels except the target equation.

### Example: carbon monoxide
The target is $\\ce{C(s) + 1/2 O2(g) -> CO(g)}$. Known:

$$\\ce{C(s) + O2(g) -> CO2(g)} \\qquad \\Delta H_1 = -393.5\\ \\mathrm{kJ/mol}$$
$$\\ce{CO(g) + 1/2 O2(g) -> CO2(g)} \\qquad \\Delta H_2 = -283.0\\ \\mathrm{kJ/mol}$$

Keep the first, reverse the second, add: $\\ce{CO2}$ and half a mole of $\\ce{O2}$ cancel, leaving the target with $\\Delta H = -393.5 + 283.0 = -110.5$ kJ/mol. Burning carbon all the way to $\\ce{CO2}$ releases 393.5 kJ; stopping at CO releases only 110.5 of it — which is why a smouldering, oxygen-starved stove wastes fuel as well as making a poisonous gas.

### Energy cycles
The same idea drawn as a triangle or a square is an **energy cycle**: reactants in one corner, products in another, and a detour through a common set of substances (the elements, the combustion products, or the gaseous atoms). Following the arrows, a step taken against its arrow counts with the opposite sign. The detour through the elements gives the [[enthalpy-of-formation|formation-enthalpy]] formula; the detour through gaseous atoms gives [[bond-enthalpies|bond-enthalpy]] estimates; the detour through gaseous ions is the [[lattice-energy|Born–Haber cycle]] for ionic solids.

> [!tip] A quick check: the route you build must convert *exactly* the target reactants into *exactly* the target products, with every other species cancelling. Count each species on both sides before adding the ΔH values.
`,
  ideas: [
    'Enthalpy is a state function, so ΔH depends only on the start and end, not on the route.',
    'Reverse an equation: change the sign of ΔH. Multiply it: multiply ΔH.',
    'Adding equations adds their ΔH values; this gives enthalpies of reactions that cannot be measured directly.',
    'An energy cycle is Hess\'s law as a picture: two routes between the same start and end have the same total ΔH.'
  ],
  pitfalls: [
    'When an equation is multiplied, only the reactant\'s ΔH changes — ΔH belongs to the whole equation; multiply it by the same factor.',
    'Species that appear on both sides must still be counted — They cancel only if the amounts on both sides match; check every species, including O₂ and H₂O.',
    'Hess\'s law only works for reactions that actually happen in one step — It works for any route, real or imaginary, because enthalpy is a state function.'
  ],
  formulas: [
    {
      name: 'Combining three reactions',
      expr: 'dH = a*dH1 + b*dH2 + c*dH3', tex: '\\Delta H = a\\,\\Delta H_1 + b\\,\\Delta H_2 + c\\,\\Delta H_3',
      vars: {
        dH: { name: 'enthalpy change of the target reaction', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H' },
        a: { name: 'multiplier of reaction 1 (negative: reversed)', value: 1, signed: true, fixed: true },
        dH1: { name: 'ΔH of reaction 1', q: 'molarenergy', unit: 'kJ/mol', value: -393.5, signed: true, tex: '\\Delta H_1' },
        b: { name: 'multiplier of reaction 2', value: 2, signed: true, fixed: true },
        dH2: { name: 'ΔH of reaction 2', q: 'molarenergy', unit: 'kJ/mol', value: -285.8, signed: true, tex: '\\Delta H_2' },
        c: { name: 'multiplier of reaction 3', value: -1, signed: true, fixed: true },
        dH3: { name: 'ΔH of reaction 3', q: 'molarenergy', unit: 'kJ/mol', value: -890.3, signed: true, tex: '\\Delta H_3' }
      },
      note: 'Defaults: the formation of methane, $\\ce{C + 2H2 -> CH4}$, from the combustion of carbon (1), hydrogen (2, used twice) and methane (3, reversed): −74.8 kJ/mol.',
      practice: { unknowns: ['dH', 'dH3'] },
      stories: {
        dH: 'Carbon burns with ΔH = {dH1}, hydrogen with {dH2} per mole and methane with {dH3}. What is the enthalpy of formation of methane, $\\ce{C + 2H2 -> CH4}$?',
        dH3: 'The enthalpy of formation of methane is {dH}; carbon burns with {dH1} and hydrogen with {dH2}. What is the enthalpy of combustion of methane?'
      }
    }
  ],
  derivation: {
    title: 'Why the route cannot matter',
    steps: [
      { text: 'Suppose a reaction A → B could be done directly with enthalpy change $\\Delta H_\\text{d}$, and by a two-step route A → C → B with a different total:', tex: '\\Delta H_1 + \\Delta H_2 \\neq \\Delta H_\\text{d}' },
      { text: 'Run the two-step route forwards and the direct route backwards. You are back at A, with a net heat of', tex: 'q_\\text{net} = \\Delta H_1 + \\Delta H_2 - \\Delta H_\\text{d} \\neq 0' },
      { text: 'Repeating the cycle would produce (or swallow) heat forever with nothing changed — impossible by conservation of energy. Hence', tex: '\\Delta H_\\text{d} = \\Delta H_1 + \\Delta H_2' }
    ]
  },
  examples: [
    {
      title: 'Methane from its elements',
      q: 'Use the enthalpies of combustion of graphite (−393.5), hydrogen (−285.8, liquid water) and methane (−890.3 kJ/mol) to find ΔH for $\\ce{C(s) + 2H2(g) -> CH4(g)}$.',
      steps: [
        'Keep: $\\ce{C + O2 -> CO2}$, $\\Delta H = -393.5$.',
        'Double: $\\ce{2H2 + O2 -> 2H2O}$, $\\Delta H = 2(-285.8) = -571.6$.',
        'Reverse: $\\ce{CO2 + 2H2O -> CH4 + 2O2}$, $\\Delta H = +890.3$.',
        'Add. $\\ce{CO2}$, $\\ce{2H2O}$ and $\\ce{2O2}$ cancel, leaving $\\ce{C + 2H2 -> CH4}$.',
        '$\\Delta H = -393.5 - 571.6 + 890.3 = -74.8\\ \\mathrm{kJ/mol}$.'
      ],
      a: 'ΔH = −74.8 kJ/mol, the standard enthalpy of formation of methane.'
    },
    {
      title: 'A hydrate you cannot measure directly',
      q: 'Anhydrous copper(II) sulfate dissolves with ΔH = −66.5 kJ/mol; the blue pentahydrate $\\ce{CuSO4.5H2O}$ dissolves with ΔH = +11.7 kJ/mol (both to the same dilute solution). Find ΔH for $\\ce{CuSO4(s) + 5H2O(l) -> CuSO4.5H2O(s)}$.',
      steps: [
        'Both solids end in the same solution, so the cycle is: anhydrous salt → solution directly, or anhydrous salt → hydrate → solution.',
        '$\\Delta H_\\text{hydration} + (+11.7) = -66.5$.',
        '$\\Delta H_\\text{hydration} = -66.5 - 11.7 = -78.2\\ \\mathrm{kJ/mol}$.',
        'Measuring it directly fails because water added to the powder never reacts neatly to the pure hydrate; the cycle avoids the problem.'
      ],
      a: 'About −78 kJ/mol: adding water to white anhydrous copper sulfate is strongly exothermic.'
    }
  ],
  quiz: [
    { q: 'Given $\\ce{A -> B}$, ΔH = +40 kJ/mol, and $\\ce{B -> C}$, ΔH = −90 kJ/mol, what is ΔH for $\\ce{C -> A}$?', choices: ['−50 kJ/mol', '+50 kJ/mol', '+130 kJ/mol', '−130 kJ/mol'], a: 1,
      why: 'A → C is +40 − 90 = −50 kJ/mol; the reverse, C → A, is +50 kJ/mol.' },
    { q: 'Graphite burns with ΔH = −393.5 kJ/mol and diamond with −395.4 kJ/mol. What is ΔH for diamond → graphite?', answer: -1.9, unit: 'kJ/mol',
      why: 'Diamond → CO₂ (−395.4), then CO₂ → graphite (+393.5): total −1.9 kJ/mol. Diamond is slightly higher in enthalpy than graphite.' },
    { q: 'An equation is multiplied by 3 to make it fit a Hess cycle. What happens to its ΔH?', choices: ['it is unchanged, because ΔH is per mole', 'it is multiplied by 3', 'it is divided by 3', 'it changes sign'], a: 1,
      why: 'ΔH is per mole of reaction *as written*. Three times the equation is three times the reaction, so three times the heat.' },
    { q: 'Hess\'s law is a consequence of…', choices: ['the conservation of mass', 'the conservation of energy', 'the second law of thermodynamics', 'the law of definite proportions'], a: 1,
      why: 'If two routes gave different ΔH, running round the cycle would create energy. Enthalpy being a state function is energy conservation at constant pressure.' }
  ],
  sim: 'tk-hess',
  applications: ['Enthalpies of reactions that are too slow, too fast or too messy to measure.', 'Lattice energies of ionic solids by the Born–Haber cycle.', 'Enthalpies of formation of fuels from their combustion data.', 'Energy balances of chemical plants, where the same bookkeeping is done on flows of material.'],
  history: 'Germain Henri Hess, a Swiss-born chemist working in St Petersburg, published the law of constant heat summation in 1840 — before the first law of thermodynamics had been stated.'
},

{
  id: 'enthalpy-of-formation', parent: 'thermochemistry', title: 'Standard enthalpies of formation', level: 2,
  short: 'The enthalpy change when one mole of a compound forms from its elements in their standard states. One table of these numbers gives the enthalpy change of any reaction: products minus reactants.',
  keywords: ['standard enthalpy of formation', 'heat of formation', 'ΔHf', 'standard state', 'elements zero', 'products minus reactants', 'thermodynamic tables', 'reference state', 'endothermic compound'],
  prereq: ['hess-law', 'enthalpy', 'chemical-equations'],
  related: ['bond-enthalpies', 'gibbs-energy', 'entropy', 'limiting-reagent'],
  body: `
Heights are measured from sea level, not from the centre of the Earth: nobody knows the "absolute" height of anything, only differences. Enthalpy is the same — there is no absolute zero of enthalpy — so chemists pick a reference level: **the elements in their standard states**, the most stable form at 1 bar and the stated temperature (graphite, not diamond; $\\ce{O2(g)}$, not ozone; liquid mercury; solid iodine).

The **standard enthalpy of formation**, $\\Delta H_\\text{f}^\\circ$, of a compound is the enthalpy change when **one mole** of it forms from those elements:

$$\\ce{C(s, graphite) + 2H2(g) -> CH4(g)} \\qquad \\Delta H_\\text{f}^\\circ = -74.8\\ \\mathrm{kJ/mol}$$

By definition $\\Delta H_\\text{f}^\\circ = 0$ for every element in its standard state. A negative value means the compound lies below its elements, a positive one that it lies above.

### Products minus reactants
Take any reaction and imagine it done in two stages: first break every reactant down into its elements (the reverse of formation), then build the products up from the same elements. By [[hess-law|Hess's law]]

$$\\Delta H_\\text{r}^\\circ = \\sum \\nu\\,\\Delta H_\\text{f}^\\circ(\\text{products}) - \\sum \\nu\\,\\Delta H_\\text{f}^\\circ(\\text{reactants})$$

with $\\nu$ the coefficients of the balanced equation. For propane burning,

$$\\ce{C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)}$$

$\\Delta H^\\circ = 3(-393.5) + 4(-285.8) - (-103.8) - 5(0) = -2219.9$ kJ/mol. A table of a few hundred formation enthalpies thus gives the heat of hundreds of thousands of reactions.

### A few values at 298 K (kJ/mol)
| Substance | $\\Delta H_\\text{f}^\\circ$ | Substance | $\\Delta H_\\text{f}^\\circ$ |
|---|---|---|---|
| $\\ce{H2O(l)}$ | −285.8 | $\\ce{CO2(g)}$ | −393.5 |
| $\\ce{H2O(g)}$ | −241.8 | $\\ce{CO(g)}$ | −110.5 |
| $\\ce{CH4(g)}$ | −74.8 | $\\ce{C3H8(g)}$ | −103.8 |
| $\\ce{C2H5OH(l)}$ | −277.7 | $\\ce{NH3(g)}$ | −46.1 |
| $\\ce{C2H2(g)}$ | +226.7 | $\\ce{NO(g)}$ | +90.3 |
| $\\ce{Fe2O3(s)}$ | −824.2 | $\\ce{Al2O3(s)}$ | −1675.7 |
| $\\ce{CaCO3(s)}$ | −1206.9 | $\\ce{CaO(s)}$ | −635.1 |

### Reading the table
- Very negative values — oxides such as alumina, carbonates, water — mark very stable compounds. The **thermite** reaction, $\\ce{2Al + Fe2O3 -> Al2O3 + 2Fe}$, releases $-1675.7 - (-824.2) = -851.5$ kJ/mol because aluminium holds oxygen far more tightly than iron does: enough to melt the iron, which is how rails are welded on site.
- Positive values mark compounds that store energy relative to their elements. Acetylene (+226.7) burns in the hottest common flame and can decompose explosively; nitric oxide (+90.3) forms in quantity only in the heat of engines, furnaces and lightning.
- The state matters: water appears twice, 44 kJ/mol apart.

> [!warn] Elements count as zero only in their standard state. $\\ce{O2(g)}$ is zero, but $\\ce{O3(g)}$ is +142.7 kJ/mol and diamond is +1.9 kJ/mol.
`,
  ideas: [
    'ΔHf° is the enthalpy change for forming one mole of a compound from its elements in their standard states.',
    'Elements in their standard states have ΔHf° = 0 by definition: they are the reference level.',
    'ΔH° of any reaction = Σν ΔHf°(products) − Σν ΔHf°(reactants), a consequence of Hess\'s law.',
    'Very negative ΔHf° marks stable compounds; positive ΔHf° marks compounds that store energy relative to their elements.'
  ],
  pitfalls: [
    'Reactants minus products — It is products minus reactants. Getting it backwards flips the sign of every answer.',
    'Forgetting the coefficients — Each ΔHf° is per mole; multiply by the number of moles in the balanced equation.',
    'O₂ has ΔHf° = 0, so it can be left out; so can O₃ and H₂O — Only elements in their standard states are zero. Ozone and every compound have their own values.'
  ],
  formulas: [
    {
      name: 'Reaction enthalpy from formation enthalpies',
      expr: 'dH = c*Hc + d*Hd - a*Ha - b*Hb', tex: '\\Delta H^\\circ = c\\,H_C + d\\,H_D - a\\,H_A - b\\,H_B',
      vars: {
        dH: { name: 'standard enthalpy change of the reaction', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H^\\circ' },
        a: { name: 'coefficient of reactant A', int: true, fixed: true, value: 1 },
        Ha: { name: 'ΔHf° of reactant A', q: 'molarenergy', unit: 'kJ/mol', value: -74.8, signed: true, tex: 'H_A' },
        b: { name: 'coefficient of reactant B', int: true, fixed: true, value: 2 },
        Hb: { name: 'ΔHf° of reactant B', q: 'molarenergy', unit: 'kJ/mol', value: 0, signed: true, tex: 'H_B' },
        c: { name: 'coefficient of product C', int: true, fixed: true, value: 1 },
        Hc: { name: 'ΔHf° of product C', q: 'molarenergy', unit: 'kJ/mol', value: -393.5, signed: true, tex: 'H_C' },
        d: { name: 'coefficient of product D', int: true, fixed: true, value: 2 },
        Hd: { name: 'ΔHf° of product D', q: 'molarenergy', unit: 'kJ/mol', value: -285.8, signed: true, tex: 'H_D' }
      },
      note: 'For $a\\,\\ce{A} + b\\,\\ce{B} -> c\\,\\ce{C} + d\\,\\ce{D}$, with $H$ the standard enthalpies of formation. Defaults: methane burning, $\\ce{CH4 + 2O2 -> CO2 + 2H2O(l)}$. Set a coefficient to 0 for a reaction with fewer species.',
      practice: { unknowns: ['dH', 'Ha'] },
      stories: {
        dH: 'For $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$, the formation enthalpies are {Ha} for methane, {Hc} for carbon dioxide and {Hd} for liquid water. What is the enthalpy of combustion?',
        Ha: 'Methane burns with {dH}: $\\ce{CH4(g) + 2O2(g) -> CO2(g) + 2H2O(l)}$. With {Hc} for carbon dioxide and {Hd} for water, what is the enthalpy of formation of methane?'
      }
    }
  ],
  examples: [
    {
      title: 'Ethanol as a fuel',
      q: 'Find the enthalpy of combustion of ethanol, $\\ce{C2H5OH(l) + 3O2(g) -> 2CO2(g) + 3H2O(l)}$, and the heat per gram. $\\Delta H_\\text{f}^\\circ$: ethanol −277.7, $\\ce{CO2}$ −393.5, $\\ce{H2O(l)}$ −285.8 kJ/mol.',
      steps: [
        'Products: $2(-393.5) + 3(-285.8) = -787.0 - 857.4 = -1644.4$ kJ.',
        'Reactants: $-277.7 + 3(0) = -277.7$ kJ.',
        '$\\Delta H^\\circ = -1644.4 - (-277.7) = -1366.7\\ \\mathrm{kJ/mol}$.',
        'Per gram: $1366.7/46.07 = 29.7$ kJ/g, against about 48 kJ/g for petrol. Ethanol is already partly oxidised — the oxygen it carries has already "spent" some of its energy — so a car running on E85 uses roughly a third more fuel by volume.'
      ],
      a: '−1367 kJ/mol, about 29.7 kJ per gram.'
    },
    {
      title: 'Burning limestone',
      q: 'How much heat must a kiln supply per tonne of quicklime made by $\\ce{CaCO3(s) -> CaO(s) + CO2(g)}$? $\\Delta H_\\text{f}^\\circ$: $\\ce{CaCO3}$ −1206.9, $\\ce{CaO}$ −635.1, $\\ce{CO2}$ −393.5 kJ/mol; $M(\\ce{CaO}) = 56.08$ g/mol.',
      steps: [
        '$\\Delta H^\\circ = (-635.1) + (-393.5) - (-1206.9) = +178.3\\ \\mathrm{kJ/mol}$: endothermic.',
        'One tonne of CaO is $10^6/56.08 = 17\\,830$ mol.',
        'Heat: $17\\,830 \\times 178.3 = 3.18 \\times 10^6\\ \\mathrm{kJ} = 3.2\\ \\mathrm{GJ}$ per tonne, before any losses. Efficient kilns use about 4 GJ/t, much of it from burning fuel that adds its own CO₂ to the CO₂ released by the limestone.'
      ],
      a: 'About 3.2 GJ per tonne of quicklime, in theory.'
    }
  ],
  quiz: [
    { q: 'Which of these has a standard enthalpy of formation of exactly zero?', choices: ['$\\ce{O3(g)}$', '$\\ce{H2O(l)}$', '$\\ce{Br2(l)}$', '$\\ce{C(s, diamond)}$'], a: 2,
      why: 'Bromine is a liquid at 298 K and 1 bar, so $\\ce{Br2(l)}$ is its standard state. Ozone and diamond are not the most stable forms of their elements; water is a compound.' },
    { q: 'Using ΔHf° values of −393.5 ($\\ce{CO2}$), −285.8 ($\\ce{H2O(l)}$) and −103.8 kJ/mol ($\\ce{C3H8}$), what is ΔH° of $\\ce{C3H8(g) + 5O2(g) -> 3CO2(g) + 4H2O(l)}$ in kJ/mol?', answer: -2219.9, unit: 'kJ/mol',
      why: '$3(-393.5) + 4(-285.8) - (-103.8) = -1180.5 - 1143.2 + 103.8 = -2219.9$ kJ/mol.' },
    { q: 'Acetylene has ΔHf° = +226.7 kJ/mol. This means…', choices: ['acetylene cannot be made', 'acetylene is higher in enthalpy than the carbon and hydrogen it is made from', 'acetylene does not burn', 'acetylene is more stable than graphite and hydrogen'], a: 1,
      why: 'A positive formation enthalpy means energy was stored in forming it. Acetylene is made indirectly (from calcium carbide or by cracking) and is valuable precisely because it releases so much heat.' },
    { q: 'The enthalpy of formation of a compound is also its enthalpy of combustion.', a: false,
      why: 'Formation builds the compound from its elements; combustion burns it with oxygen. For CO₂ and H₂O they happen to be the same reactions as burning C and H₂, but that is a coincidence of those two compounds.' }
  ],
  sim: { id: 'tk-hess', params: { rx: 1, route: 0 } },
  applications: ['Heat balances for furnaces, kilns and chemical reactors.', 'Comparing fuels and explosives from tables, without burning them.', 'Estimating the heat released by a runaway reaction for process safety.', 'Thermite welding of rails and incendiary devices.'],
  history: 'Systematic tables of formation data were built up by Julius Thomsen and Marcellin Berthelot in the nineteenth century; today\'s critically evaluated values come from collections such as the NBS/NIST and CODATA tables.'
},

{
  id: 'bond-enthalpies', parent: 'thermochemistry', title: 'Bond enthalpies', level: 2,
  short: 'Breaking a bond always costs energy and making one always releases it. Adding up the bonds broken and the bonds formed gives a quick estimate of a reaction\'s enthalpy change — and explains where the heat of a reaction comes from.',
  keywords: ['bond enthalpy', 'bond energy', 'bond dissociation enthalpy', 'mean bond enthalpy', 'average bond enthalpy', 'bonds broken', 'bonds formed', 'bond strength', 'gaseous atoms', 'photodissociation'],
  prereq: ['enthalpy', 'covalent-bonds', 'hess-law'],
  related: ['bond-order-length', 'enthalpy-of-formation', 'atomic-spectra', 'collision-theory', 'physics:photon'],
  body: `
Where does the heat of a burning flame come from? Not from breaking bonds — **breaking a bond always takes energy**, because the atoms were attracted to each other and must be pulled apart. The heat comes from **making** new bonds that are stronger than the old ones. A reaction is exothermic when the bonds formed are, in total, stronger than the bonds broken.

The **bond enthalpy** is the enthalpy needed to break one mole of a bond in the gas phase, making gaseous atoms or fragments:

$$\\ce{H2(g) -> 2H(g)} \\qquad \\Delta H = +436\\ \\mathrm{kJ/mol}$$

For a diatomic molecule this is exact. For bonds such as C–H, which occur in thousands of molecules and differ a little in each, tables give a **mean bond enthalpy**, averaged over many compounds.

### Estimating ΔH
Imagine the reaction done by an energy cycle through gaseous atoms: break every bond in the reactants, then form every bond in the products,

$$\\Delta H \\approx \\sum(\\text{bonds broken}) - \\sum(\\text{bonds formed})$$

For methane burning, $\\ce{CH4 + 2O2 -> CO2 + 2H2O}$, all as gases:
- broken: 4 C–H + 2 O=O $= 4(413) + 2(498) = 2648$ kJ
- formed: 2 C=O + 4 O–H $= 2(799) + 4(463) = 3450$ kJ
- $\\Delta H \\approx 2648 - 3450 = -802$ kJ/mol, matching the measured −802.3 kJ/mol for water vapour.

### Mean bond enthalpies (kJ/mol)
| Bond | kJ/mol | Bond | kJ/mol | Bond | kJ/mol |
|---|---|---|---|---|---|
| H–H | 436 | C–C | 348 | N≡N | 945 |
| C–H | 413 | C=C | 614 | N–H | 391 |
| O–H | 463 | C≡C | 839 | Cl–Cl | 243 |
| O=O | 498 | C–O | 358 | H–Cl | 432 |
| C=O (in CO₂) | 799 | F–F | 158 | H–F | 567 |

### What the numbers explain
- **Nitrogen is inert and explosives release it.** N≡N at 945 kJ/mol is one of the strongest bonds known. Breaking it is hard (the Haber process needs a catalyst and 400 °C); forming it is what makes nitroglycerine and TNT so violent.
- **Fluorine is ferociously reactive.** F–F is weak (158) while the bonds fluorine forms to hydrogen and carbon are among the strongest.
- **Multiple bonds are stronger but not proportionally so.** C=C (614) is less than twice C–C (348), which is why alkenes add across the double bond so readily ([[bond-order-length|bond order and strength]]).
- **Light can break bonds.** A photon of wavelength $\\lambda$ carries $N_A hc/\\lambda$ per mole; for Cl–Cl that matches 243 kJ/mol at 492 nm, so blue and violet light split chlorine molecules and start the explosive chain reaction of hydrogen with chlorine.

### Limits of the method
Mean values are averages, and the method assumes gases. For $\\ce{H2 + Cl2 -> 2HCl}$ it gives −185 kJ/mol against the true −184.6, but for hydrogenating ethene it gives −124 against the true −137 kJ/mol, and for reactions of liquids or solids the enthalpies of vaporisation must be added. When [[enthalpy-of-formation|formation enthalpies]] are available they are always better; bond enthalpies are for estimates, and for understanding.
`,
  ideas: [
    'Breaking a bond always absorbs energy; forming a bond always releases it.',
    'ΔH ≈ Σ(bonds broken) − Σ(bonds formed): exothermic when the new bonds are stronger in total.',
    'Mean bond enthalpies are averages over many molecules and apply to the gas phase, so estimates are good to about ±10 %.',
    'Very strong bonds (N≡N, C=O) explain inert gases and energetic products; weak ones (F–F, O–O) explain reactive substances.'
  ],
  pitfalls: [
    'Breaking bonds releases energy — Never. A bond is a state of lower energy; pulling the atoms apart always costs energy. Energy is released when bonds form.',
    'Formed minus broken — It is broken minus formed. Formed minus broken gives the right size with the wrong sign.',
    'Bond-enthalpy estimates are exact — They use averages and assume every species is a gas, so they can be off by 10 kJ/mol or more; formation enthalpies are better when available.'
  ],
  formulas: [
    {
      name: 'Estimate from bond enthalpies',
      expr: 'dH = Bb - Bf', tex: '\\Delta H \\approx \\Sigma_\\text{broken} - \\Sigma_\\text{formed}',
      vars: {
        dH: { name: 'estimated enthalpy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta H' },
        Bb: { name: 'total enthalpy of the bonds broken', q: 'molarenergy', unit: 'kJ/mol', value: 2648, tex: '\\Sigma_\\text{broken}' },
        Bf: { name: 'total enthalpy of the bonds formed', q: 'molarenergy', unit: 'kJ/mol', value: 3450, tex: '\\Sigma_\\text{formed}' }
      },
      note: 'Defaults: methane burning to carbon dioxide and water vapour (4 C–H + 2 O=O broken, 2 C=O + 4 O–H formed).',
      practice: { unknowns: ['dH'] },
      stories: { dH: 'In a gas-phase reaction, bonds worth {Bb} are broken and bonds worth {Bf} are formed. Estimate ΔH.' }
    },
    {
      name: 'Longest wavelength that can break a bond',
      expr: 'lambda = NA*h*c/D', tex: '\\lambda = \\frac{N_A h c}{D}',
      vars: {
        lambda: { name: 'wavelength of light', q: 'length', unit: 'nm' },
        NA: { const: 'NA' },
        h: { const: 'h' },
        c: { const: 'c' },
        D: { name: 'bond enthalpy', q: 'molarenergy', unit: 'kJ/mol', value: 243 }
      },
      note: 'One photon per bond. Light of longer wavelength has too little energy per photon, however bright it is. Default: Cl–Cl.',
      practice: { unknowns: ['lambda', 'D'] },
      stories: {
        lambda: 'The O=O bond enthalpy is {D}. What is the longest wavelength that can split an oxygen molecule?',
        D: 'A bond is just broken by light of wavelength {lambda}. What is its bond enthalpy?'
      }
    }
  ],
  examples: [
    {
      title: 'Hydrogen and chlorine',
      q: 'Estimate ΔH for $\\ce{H2(g) + Cl2(g) -> 2HCl(g)}$ using H–H 436, Cl–Cl 243 and H–Cl 432 kJ/mol.',
      steps: [
        'Broken: one H–H and one Cl–Cl, $436 + 243 = 679$ kJ.',
        'Formed: two H–Cl, $2 \\times 432 = 864$ kJ.',
        '$\\Delta H \\approx 679 - 864 = -185\\ \\mathrm{kJ/mol}$ (measured: $2 \\times (-92.3) = -184.6$ kJ/mol).',
        'For diatomic molecules the bond enthalpies are exact, not averages, so the agreement is excellent.'
      ],
      a: 'About −185 kJ/mol.'
    },
    {
      title: 'When the estimate misses',
      q: 'Estimate ΔH for hydrogenating ethene, $\\ce{C2H4(g) + H2(g) -> C2H6(g)}$, and compare with the value from formation enthalpies (ethene +52.3, ethane −84.7 kJ/mol).',
      steps: [
        'The four C–H bonds of ethene survive; count only what changes. Broken: C=C and H–H, $614 + 436 = 1050$ kJ.',
        'Formed: C–C and two new C–H, $348 + 2(413) = 1174$ kJ.',
        'Estimate: $1050 - 1174 = -124$ kJ/mol.',
        'From formation enthalpies: $-84.7 - 52.3 = -137.0$ kJ/mol. The 10 % gap comes from using mean values: the C–H bonds in ethane are not exactly the "average" C–H.'
      ],
      a: 'Estimate −124 kJ/mol; true −137 kJ/mol.'
    }
  ],
  quiz: [
    { q: 'In an exothermic reaction…', choices: ['more energy is released forming bonds than is absorbed breaking bonds', 'breaking bonds releases the energy', 'no bonds are broken', 'the products have weaker bonds than the reactants'], a: 0,
      why: 'Bond breaking always costs energy. The reaction is exothermic overall because the new bonds, taken together, are stronger.' },
    { q: 'Using N≡N 945, H–H 436 and N–H 391 kJ/mol, estimate ΔH for $\\ce{N2 + 3H2 -> 2NH3}$ in kJ/mol.', answer: -93, unit: 'kJ/mol',
      why: 'Broken $945 + 3(436) = 2253$; formed $6(391) = 2346$; ΔH ≈ 2253 − 2346 = −93 kJ/mol (from formation enthalpies: −92.2).' },
    { q: 'Why does a bond-enthalpy estimate for burning liquid ethanol need a correction?', choices: ['bond enthalpies are for gases, so evaporating the ethanol (and condensing the water) must be added', 'ethanol has no C–H bonds', 'bond enthalpies only work for diatomic molecules', 'no correction is needed'], a: 0,
      why: 'Bond enthalpies describe breaking bonds in gaseous molecules. Liquids first have to be vaporised, which costs extra energy the bond table does not include.' },
    { q: 'Which of these bonds should be broken by the lowest-energy (longest-wavelength) light?', choices: ['F–F (158 kJ/mol)', 'O=O (498 kJ/mol)', 'N≡N (945 kJ/mol)', 'H–H (436 kJ/mol)'], a: 0,
      why: 'The weaker the bond, the less energy each photon needs: F–F can be split by light out to about 760 nm, N≡N only by far ultraviolet.' }
  ],
  sim: { id: 'tk-hess', params: { rx: 0, route: 1 } },
  applications: ['Understanding why fuels release energy and why CO₂ and water are "spent" products.', 'Explosives and propellants, which form N₂ and other strongly bonded molecules.', 'Photochemistry: which wavelengths of sunlight break which bonds (ozone formation, photodegradation of plastics).', 'Quick estimates in reaction design when no data tables exist.']
}

);
