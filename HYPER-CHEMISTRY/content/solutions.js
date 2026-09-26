/* HYPER-CHEMISTRY · content/solutions.js — dissolving and solubility, concentration units,
 * gas solubility (Henry's law), vapour pressure of solutions (Raoult's law), and the
 * colligative properties: boiling-point elevation, freezing-point depression and osmosis. */
Hyper.add(

{
  id: 'solubility', parent: 'solutions', title: 'Solubility and the dissolving process', level: 1,
  short: 'A solute dissolves when its particles are pulled apart and surrounded by solvent molecules. "Like dissolves like"; the heat taken in or given out, the entropy gained and the temperature decide how much will dissolve.',
  keywords: ['solubility', 'dissolving', 'solution', 'solute', 'solvent', 'like dissolves like', 'miscible', 'immiscible', 'saturated', 'unsaturated', 'supersaturated', 'enthalpy of solution', 'hydration', 'solubility curve', 'recrystallisation', 'cold pack', 'hand warmer'],
  prereq: ['intermolecular-forces', 'molarity', 'ionic-bonding'],
  related: ['solubility-product', 'henrys-law', 'concentration-units', 'lattice-energy', 'enthalpy', 'entropy', 'precipitation'],
  body: `
Stir a spoonful of salt into water and it vanishes; stir it into cooking oil and it sits at the bottom. Iodine does the opposite: it barely colours water but dissolves in hexane to a deep violet. The rule of thumb is **like dissolves like**: polar and ionic substances dissolve in polar solvents such as water, non-polar ones in non-polar solvents such as hexane or petrol.

### What happens when something dissolves
Dissolving is three steps, each with its own energy:

1. pull the solute particles apart — costs energy (for a salt, the [[lattice-energy]]);
2. push solvent molecules apart to make room — costs energy;
3. let solute and solvent attract each other — releases energy. Ions in water are surrounded by a shell of water molecules pointing the right end at them (**hydration**), and that releases a lot.

The balance is the **enthalpy of solution**, $\\Delta H_\\text{soln}$. It can have either sign:

| Solute | $\\ce{CaCl2}$ | $\\ce{NaOH}$ | $\\ce{NaCl}$ | $\\ce{NH4NO3}$ | $\\ce{KNO3}$ |
|---|---|---|---|---|---|
| $\\Delta H_\\text{soln}$ (kJ/mol) | −81.3 | −44.5 | +3.9 | +25.7 | +34.9 |

Calcium chloride warms the water noticeably; ammonium nitrate chills it — that is how instant cold packs work. Yet ammonium nitrate dissolves eagerly although it takes in heat: dissolving scatters ordered ions through the liquid and increases the **entropy**, and at room temperature that wins ([[entropy]]). Oil and water fail for the opposite reason — water molecules would have to arrange themselves around each oil molecule, and they lose more by that ordering than they gain.

### How much dissolves
A solution holding as much solute as it can at that temperature is **saturated**; any extra stays undissolved, in dynamic equilibrium with the solution ([[solubility-product]] for sparingly soluble salts). Solubility is quoted in grams per 100 g of water, or in mol/L. Most solids dissolve better when hot — potassium nitrate goes from 31.6 g per 100 g of water at 20 °C to 110 g at 60 °C and 246 g at 100 °C — while sodium chloride barely changes (36.0 g at 20 °C, 39.2 g at 100 °C). Gases always dissolve **less** when hot ([[henrys-law]]).

Cool a hot saturated solution carefully, without dust or scratches, and it can stay **supersaturated**, holding more than it should. A reusable hand warmer is a supersaturated sodium acetate solution: click the metal disc, crystals spread through the pack and the heat of crystallisation warms it to about 54 °C.

### Using it
- **Recrystallisation** purifies a solid: dissolve it in the minimum of hot solvent, filter, cool; the product crystallises and most impurities, present in small amounts, stay in solution.
- **Liquid–liquid extraction** moves a compound from water into an immiscible organic solvent where it is more soluble.
- **Scale** in kettles and boilers forms partly because calcium carbonate is less soluble in hot water and partly because heating drives out the dissolved carbon dioxide that keeps it in solution.
`,
  ideas: [
    'Like dissolves like: polar and ionic solutes in polar solvents, non-polar solutes in non-polar solvents.',
    'Dissolving breaks solute–solute and solvent–solvent attractions and forms solute–solvent ones; the net heat can be released or absorbed.',
    'A positive enthalpy of solution does not stop dissolving: the gain in entropy can drive it.',
    'A saturated solution is in dynamic equilibrium with undissolved solute; its concentration is the solubility.',
    'Most solids are more soluble when hot; gases are less soluble when hot.'
  ],
  pitfalls: [
    'A substance that absorbs heat when it dissolves cannot dissolve on its own — Ammonium nitrate does, spontaneously, because the entropy increase outweighs the heat taken in.',
    'Dissolving is the same as melting — The solid is broken up by the solvent at a temperature far below its melting point; salt dissolves at 20 °C but melts at 801 °C.',
    'Stirring or grinding increases solubility — They make a solid dissolve faster, not more. Only temperature (and, for gases, pressure) changes how much can dissolve.'
  ],
  formulas: [
    {
      name: 'Crystals recovered on cooling a saturated solution',
      expr: 'm = (S1 - S2)*mw/100', tex: 'm = \\frac{(S_1 - S_2)\\,m_w}{100}',
      vars: {
        m: { name: 'mass of crystals that form', q: 'mass', unit: 'g' },
        S1: { name: 'solubility at the high temperature (g per 100 g of water)', value: 110, tex: 'S_1' },
        S2: { name: 'solubility at the low temperature (g per 100 g of water)', value: 31.6, tex: 'S_2' },
        mw: { name: 'mass of water', q: 'mass', unit: 'g', value: 100, tex: 'm_w' }
      },
      note: 'Assumes the solution was saturated when hot and no water evaporates. Defaults: potassium nitrate cooled from 60 °C to 20 °C.',
      stories: {
        m: 'A solution of potassium nitrate in {mw} of water is saturated at 60 °C (solubility {S1} g per 100 g of water) and cooled to 20 °C (solubility {S2} g per 100 g). What mass of crystals forms?',
        mw: 'You want {m} of potassium nitrate crystals by cooling a saturated solution from 60 °C ({S1} g per 100 g of water) to 20 °C ({S2} g per 100 g). How much water should you use?'
      }
    },
    {
      name: 'Temperature change when a solid dissolves',
      expr: 'dT = -n*dH/(m*c)', tex: '\\Delta T = -\\frac{n\\,\\Delta H_\\text{soln}}{m\\,c_w}',
      vars: {
        dT: { name: 'temperature change', q: 'dtemp', unit: 'K', signed: true, tex: '\\Delta T' },
        n: { name: 'amount dissolved', q: 'amount', unit: 'mol', value: 0.375 },
        dH: { name: 'enthalpy of solution', q: 'molarenergy', unit: 'kJ/mol', value: 25.7, signed: true, tex: '\\Delta H_\\text{soln}' },
        m: { name: 'mass of the solution', q: 'mass', unit: 'g', value: 130 },
        c: { const: 'cW' }
      },
      note: 'Treats the solution as having the specific heat of water and ignores heat exchanged with the surroundings. Defaults: a cold pack, 30 g of ammonium nitrate (0.375 mol) in 100 g of water.',
      stories: {
        dT: 'A cold pack dissolves {n} of ammonium nitrate ($\\Delta H_\\text{soln}$ = {dH}) to make {m} of solution. By how much does the temperature change?',
        n: 'How many moles of a salt with $\\Delta H_\\text{soln}$ = {dH} must dissolve in {m} of solution to change its temperature by {dT}?'
      }
    }
  ],
  examples: [
    {
      title: 'Purifying potassium nitrate',
      q: 'A crude sample of potassium nitrate is dissolved in 100 g of water at 60 °C to make a saturated solution, filtered hot and cooled to 20 °C. Solubilities: 110 g per 100 g of water at 60 °C, 31.6 g at 20 °C. What mass of crystals forms, and what fraction of the dissolved nitrate is recovered?',
      steps: [
        'At 60 °C the water holds 110 g; at 20 °C it can hold only 31.6 g.',
        'The difference crystallises: $110 - 31.6 = 78.4\\ \\mathrm{g}$.',
        'Recovery: $78.4/110 = 71\\ \\%$. The rest stays in the mother liquor — the price of purity. Impurities present at a few per cent stay below their own solubility and remain dissolved.'
      ],
      a: '78.4 g of crystals, 71 % of the potassium nitrate.'
    },
    {
      title: 'How cold does a cold pack get?',
      q: 'A cold pack contains 30.0 g of ammonium nitrate ($\\ce{NH4NO3}$, 80.04 g/mol) and a pouch of 100 g of water at 20 °C. $\\Delta H_\\text{soln}$ = +25.7 kJ/mol. Estimate the final temperature, taking the specific heat of the solution as 4.19 J/(g·K).',
      steps: [
        'Amount: $n = 30.0/80.04 = 0.375\\ \\mathrm{mol}$.',
        'Heat absorbed: $q = 0.375 \\times 25\\,700 = 9630\\ \\mathrm{J}$.',
        { text: 'That heat comes out of 130 g of solution:', tex: '\\Delta T = -\\frac{9630}{130 \\times 4.19} = -17.7\\ \\mathrm{K}' },
        'Final temperature about 2 °C — cold enough for a sprained ankle, and no refrigerator needed.'
      ],
      a: 'It drops by about 18 K, to roughly 2 °C.'
    }
  ],
  quiz: [
    { q: 'Which pair is most likely to mix in all proportions?', choices: ['water and hexane', 'water and ethanol', 'water and olive oil', 'hexane and table salt'], a: 1,
      why: 'Ethanol has an OH group and hydrogen-bonds with water, so the two are miscible. Hexane and oil are non-polar; salt needs a polar solvent.' },
    { q: 'Ammonium nitrate dissolves in water although the process absorbs heat. What drives it?', choices: ['the heat of the surroundings forces it', 'the increase in entropy as the ions spread through the solution', 'the lattice energy is negative', 'ammonium nitrate reacts with water'], a: 1,
      why: 'A spontaneous process needs a negative free-energy change, $\\Delta G = \\Delta H - T\\Delta S$. Here $\\Delta H > 0$ but $T\\Delta S$ is larger.' },
    { q: 'Stirring and grinding a solid increase its solubility.', a: false,
      why: 'They speed up dissolving by exposing more surface and carrying solution away, but the amount that can dissolve at equilibrium is unchanged.' },
    { q: 'A solution contains more dissolved solute than the solubility at its temperature, and nothing has crystallised. It is…', choices: ['unsaturated', 'saturated', 'supersaturated', 'a colloid'], a: 2,
      why: 'Supersaturated solutions are metastable: a seed crystal or a scratch sets off crystallisation, as in a click-to-start hand warmer.' },
    { q: 'Potassium nitrate: 31.6 g per 100 g of water at 20 °C and 110 g at 60 °C. How many grams crystallise when 250 g of water saturated at 60 °C is cooled to 20 °C?', answer: 196, unit: 'g',
      why: '$(110 - 31.6) \\times 250/100 = 196$ g.' }
  ],
  applications: ['Purifying solids by recrystallisation.', 'Cold packs and self-heating packs.', 'Extraction of flavours, drugs and dyes with the right solvent.', 'Scale in kettles, boilers and heat exchangers.', 'Choosing solvents for paints, cleaning and degreasing.']
},

{
  id: 'concentration-units', parent: 'solutions', title: 'Concentration units: molality, mole fraction, ppm', level: 1,
  short: 'Besides molarity, chemists measure concentration per kilogram of solvent (molality), as a share of all the particles (mole fraction), or as a share of the mass (per cent, ppm, ppb). Each suits a different job.',
  keywords: ['molality', 'mole fraction', 'mass fraction', 'mass percent', 'weight percent', 'ppm', 'ppb', 'parts per million', 'molarity', 'osmolarity', 'converting concentration units', 'density of solution'],
  prereq: ['molarity', 'molar-mass'],
  related: ['colligative-properties', 'raoults-law', 'partial-pressures', 'dilution', 'math:percentages', 'math:scientific-notation'],
  body: `
"How strong is it?" has several honest answers. A bottle of concentrated hydrochloric acid says 37 %; a lab calculation wants 12.1 mol/L; a physical chemist predicting its freezing point wants mol per kilogram of water; and a water-quality report lists its chloride in mg/L. They describe the same solution, and converting between them only needs the molar masses and the density.

### The units
| Unit | Definition | Changes with temperature? | Typical use |
|---|---|---|---|
| Molarity $c$ | mol of solute per litre of **solution** | yes (the volume expands) | titrations, reactions in solution |
| Molality $b$ | mol of solute per kg of **solvent** | no | colligative properties, precise physical chemistry |
| Mole fraction $x$ | mol of one component per mol of everything | no | vapour pressures, gas mixtures |
| Mass fraction $w$ | mass of solute per mass of solution (%, ppm, ppb) | no | commercial reagents, alloys, environmental limits |

[[molarity|Molarity]] is convenient because volumes are easy to measure, but a litre of solution expands when warmed, so molarity drifts with temperature. **Molality** divides by the mass of solvent instead, which does not change; that is why the freezing- and boiling-point laws are written with it ([[colligative-properties]]). For dilute aqueous solutions a litre of solution contains close to 1 kg of water, and molarity and molality are almost equal; for concentrated solutions they are very different.

**Mole fraction** counts particles: $x_A = n_A/(n_A + n_B + \\cdots)$, and the fractions of all components add up to 1. It is the natural variable for anything that depends on the share of molecules — partial pressures ([[partial-pressures]]) and the vapour pressure of solutions ([[raoults-law]]).

**Parts per million** is a mass fraction of $10^{-6}$: 1 mg per kg. For dilute water solutions 1 kg is 1 L, so 1 ppm ≈ 1 mg/L and 1 ppb ≈ 1 µg/L. Drinking-water limits are of this size: 10 µg/L for lead and arsenic, 50 mg/L for nitrate in Europe. For gases, ppm usually means parts per million **by volume** (that is, by moles): the atmosphere now holds about 420 ppm of carbon dioxide.

### Converting
Pick a convenient amount of solution and follow it through:

- **Mass fraction → molarity:** one litre weighs $1000\\rho$ grams, of which a fraction $w$ is solute: $c = w\\rho/M$.
- **Molarity → molality:** one litre holds $c$ mol of solute weighing $cM$; the rest of its mass, $\\rho - cM$ per litre, is solvent: $b = c/(\\rho - cM)$.
- **Mole fraction** needs the moles of every component: convert each mass with its molar mass.

> [!tip] Commercial concentrated reagents, as mass per cent and density: hydrochloric acid 37 %, 1.19 g/mL (12.1 M); sulfuric acid 98 %, 1.84 g/mL (18.4 M); nitric acid 70 %, 1.41 g/mL (15.7 M); ammonia solution 28 %, 0.90 g/mL (14.8 M).
`,
  ideas: [
    'Molarity is per litre of solution and drifts with temperature; molality is per kilogram of solvent and does not.',
    'Mole fraction is the share of all particles; the fractions of all components sum to 1.',
    'Mass per cent, ppm and ppb are mass fractions; in dilute water 1 ppm ≈ 1 mg/L.',
    'Converting between units needs the molar masses and, whenever volume is involved, the density of the solution.',
    'In dilute aqueous solutions molarity and molality are nearly equal; in concentrated ones they differ greatly.'
  ],
  pitfalls: [
    'Molality is moles per kilogram of solution — It is per kilogram of solvent. For 98 % sulfuric acid that makes a factor of 50 of difference.',
    'Molarity uses the volume of solvent added — It uses the final volume of solution. Dissolving a solid in 1.00 L of water does not give 1.00 L of solution.',
    '1 ppm always means 1 mg/L — Only for dilute water solutions, whose density is 1 kg/L. For gases, ppm is usually by volume, not by mass.'
  ],
  formulas: [
    {
      name: 'Molality',
      expr: 'b = n/ms', tex: 'b = \\frac{n_\\text{solute}}{m_\\text{solvent}}',
      vars: {
        b: { name: 'molality', q: 'molality', unit: 'mol/kg' },
        n: { name: 'amount of solute', q: 'amount', unit: 'mol', value: 0.500, tex: 'n_\\text{solute}' },
        ms: { name: 'mass of solvent', q: 'mass', unit: 'kg', value: 0.250, tex: 'm_\\text{solvent}' }
      },
      stories: {
        b: 'A solution is made by dissolving {n} of glucose in {ms} of water. What is its molality?',
        n: 'How many moles of sodium chloride must be dissolved in {ms} of water for a molality of {b}?'
      }
    },
    {
      name: 'Mole fraction (two components)',
      expr: 'x = nA/(nA + nB)', tex: 'x_A = \\frac{n_A}{n_A + n_B}',
      vars: {
        x: { name: 'mole fraction of A', q: 'ratio', unit: '', tex: 'x_A' },
        nA: { name: 'amount of A', q: 'amount', unit: 'mol', value: 0.500, tex: 'n_A' },
        nB: { name: 'amount of B', q: 'amount', unit: 'mol', value: 5.551, tex: 'n_B' }
      },
      note: 'With more components, add them all to the denominator. Defaults: 0.500 mol of solute in 100 g (5.551 mol) of water.',
      stories: {
        x: 'A solution contains {nA} of sucrose and {nB} of water. What is the mole fraction of sucrose?',
        nA: 'What amount of solute gives a mole fraction of {x} in {nB} of water?'
      }
    },
    {
      name: 'Mass fraction (per cent, ppm)',
      expr: 'w = msolute/msoln', tex: 'w = \\frac{m_\\text{solute}}{m_\\text{solution}}',
      vars: {
        w: { name: 'mass fraction', q: 'ratio', unit: 'ppm' },
        msolute: { name: 'mass of solute', q: 'mass', unit: 'mg', value: 25, tex: 'm_\\text{solute}' },
        msoln: { name: 'mass of solution', q: 'mass', unit: 'kg', value: 0.500, tex: 'm_\\text{solution}' }
      },
      note: 'Switch the unit of $w$ between %, ‰ and ppm. In dilute water solutions 1 ppm ≈ 1 mg/L.',
      stories: {
        w: 'A {msoln} sample of river water contains {msolute} of nitrate. What is the nitrate content in ppm?',
        msolute: 'Seawater holds {w} of dissolved salts. What mass of salts is in {msoln} of it?'
      }
    },
    {
      name: 'Molarity from mass fraction and density',
      expr: 'c = w*rho/M', tex: 'c = \\frac{w\\,\\rho}{M}',
      vars: {
        c: { name: 'molarity', q: 'concentration', unit: 'M' },
        w: { name: 'mass fraction of solute', q: 'ratio', unit: '%', value: 37, min: 0, max: 100 },
        rho: { name: 'density of the solution', q: 'density', unit: 'g/mL', value: 1.19, tex: '\\rho' },
        M: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol', value: 36.46 }
      },
      note: 'Defaults: concentrated hydrochloric acid, 37 % by mass.',
      stories: {
        c: 'Concentrated hydrochloric acid is {w} hydrogen chloride ($M$ = {M}) by mass, with a density of {rho}. What is its molarity?',
        w: 'A solution of density {rho} is {c} in a solute of molar mass {M}. What is its mass percentage?'
      }
    },
    {
      name: 'Molality from molarity',
      expr: 'b = c/(rho - c*M)', tex: 'b = \\frac{c}{\\rho - cM}',
      vars: {
        b: { name: 'molality', q: 'molality', unit: 'mol/kg' },
        c: { name: 'molarity', q: 'concentration', unit: 'M', value: 1.00 },
        rho: { name: 'density of the solution', q: 'density', unit: 'g/mL', value: 1.037, tex: '\\rho' },
        M: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol', value: 58.44 }
      },
      note: '$\\rho - cM$ is the mass of solvent in each unit volume. Defaults: 1.00 M sodium chloride.',
      stories: {
        b: 'A {c} solution of sodium chloride ($M$ = {M}) has a density of {rho}. What is its molality?'
      }
    }
  ],
  examples: [
    {
      title: 'Concentrated sulfuric acid in four units',
      q: 'Concentrated sulfuric acid is 98.0 % $\\ce{H2SO4}$ by mass, density 1.84 g/mL. Express its concentration as molarity, molality and mole fraction.',
      steps: [
        'Take 1 L of acid: mass $1840\\ \\mathrm{g}$, of which $0.980 \\times 1840 = 1803\\ \\mathrm{g}$ is $\\ce{H2SO4}$ = $1803/98.08 = 18.4\\ \\mathrm{mol}$. **Molarity 18.4 M.**',
        'Take 1000 g instead: 980 g of acid (9.99 mol) and only 20 g of water. **Molality** $= 9.99/0.020 = 500\\ \\mathrm{mol/kg}$ — nothing like the molarity.',
        'Water: $20/18.015 = 1.11\\ \\mathrm{mol}$. **Mole fraction** of acid $= 9.99/(9.99 + 1.11) = 0.90$.'
      ],
      a: '18.4 M; 500 mol/kg; x = 0.90.'
    },
    {
      title: 'Lead in tap water',
      q: 'A 250 mL sample of tap water from an old house contains 3.0 µg of lead. Is it within the 10 µg/L limit? Express it in ppb.',
      steps: [
        'Concentration: $3.0\\ \\mathrm{µg}/0.250\\ \\mathrm{L} = 12\\ \\mathrm{µg/L}$.',
        'For dilute water 1 L weighs 1 kg, so 12 µg/L = 12 µg/kg = $12 \\times 10^{-9}$ = **12 ppb**.',
        'Above the limit: the pipes should be replaced, and meanwhile the tap run before drinking.'
      ],
      a: '12 µg/L = 12 ppb, above the 10 µg/L limit.'
    }
  ],
  quiz: [
    { q: 'Which concentration unit changes when a solution is warmed?', choices: ['molality', 'mole fraction', 'molarity', 'mass per cent'], a: 2,
      why: 'Molarity is per litre of solution, and the solution expands when warmed. The others are ratios of masses or amounts, which do not change.' },
    { q: 'For a dilute solution in water, 1 ppm is approximately…', choices: ['1 g/L', '1 mg/L', '1 µg/L', '1 mol/L'], a: 1,
      why: '1 ppm is 1 mg per kg, and a litre of dilute solution weighs about 1 kg.' },
    { q: 'The mole fractions of all the components of a solution add up to 1.', a: true,
      why: 'Each is its share of the total number of moles, so together they make the whole.' },
    { q: 'Concentrated nitric acid is 70.0 % $\\ce{HNO3}$ (63.01 g/mol) by mass, density 1.41 g/mL. What is its molarity?', answer: 15.7, unit: 'M',
      why: '$c = w\\rho/M = 0.700 \\times 1410/63.01 = 15.7$ mol/L.' },
    { q: 'For which solution are molarity and molality nearly equal?', choices: ['0.010 M sugar in water', '18 M sulfuric acid', '5 M sodium hydroxide', 'a 50 % sugar syrup'], a: 0,
      why: 'In a dilute aqueous solution a litre contains almost exactly 1 kg of water. In concentrated solutions much of the mass is solute.' }
  ],
  applications: ['Preparing solutions from commercial concentrated reagents.', 'Drinking-water and environmental limits (mg/L, µg/L, ppm, ppb).', 'Blood tests: glucose in mmol/L, osmolality in mOsm/kg.', 'Colligative calculations, which need molality.', 'Gas mixtures and air quality in ppm by volume.']
},

{
  id: 'henrys-law', parent: 'solutions', title: 'Gas solubility and Henry\'s law', level: 2,
  short: 'The amount of a gas that dissolves in a liquid is proportional to its partial pressure above the liquid, and falls as the liquid warms. It is why soda fizzes, fish suffocate in warm water and divers get the bends.',
  keywords: ['Henry\'s law', 'gas solubility', 'Henry\'s law constant', 'partial pressure', 'carbonated drinks', 'dissolved oxygen', 'decompression sickness', 'the bends', 'thermal pollution', 'ocean carbon dioxide'],
  prereq: ['partial-pressures', 'solubility'],
  related: ['raoults-law', 'le-chatelier', 'equilibrium-constant', 'concentration-units', 'physics:pressure'],
  body: `
Open a bottle of soda and it fizzes. Before opening, the gas above the drink was nearly pure carbon dioxide at two or three atmospheres, and the drink held a correspondingly large amount of dissolved gas. Take the cap off and the carbon dioxide above the liquid is replaced by air, which contains only 0.04 %. The dissolved gas is suddenly far more than the new pressure can hold, and it comes out as bubbles.

### Henry's law
At a given temperature, the concentration of a dissolved gas is proportional to its **partial pressure** above the liquid:

$$c = k_H\\,P_\\text{gas}$$

The picture is a dynamic equilibrium, like [[vapor-pressure|vapour pressure]] in reverse: gas molecules enter the liquid at a rate proportional to how often they hit the surface (its partial pressure) and leave at a rate proportional to how many are dissolved. Double the pressure and twice as many must be dissolved before the rates balance. Each gas in a mixture obeys the law separately, using its own partial pressure.

| Gas (25 °C, in water) | $\\ce{He}$ | $\\ce{N2}$ | $\\ce{O2}$ | $\\ce{CH4}$ | $\\ce{CO2}$ |
|---|---|---|---|---|---|
| $k_H$ (mol/(L·atm)) | $3.8 \\times 10^{-4}$ | $6.5 \\times 10^{-4}$ | $1.3 \\times 10^{-3}$ | $1.4 \\times 10^{-3}$ | $3.4 \\times 10^{-2}$ |

Carbon dioxide is 25 times more soluble than oxygen because it also reacts a little with water to form carbonic acid. Gases that react strongly, such as ammonia and hydrogen chloride, are hugely soluble and do not follow Henry's law at all.

> [!warn] Henry's law constants are published in several forms — as solubility ($c/P$, as here) or as volatility ($P/c$, the inverse), and in atm, bar, Pa or mole-fraction units. Check which one a table uses before you multiply.

### Warm water holds less gas
Dissolving a gas releases heat, so by [[le-chatelier|Le Chatelier's principle]] warming drives the gas out. Water saturated with air holds about 14.6 mg/L of oxygen at 0 °C, 8.3 mg/L at 25 °C and 7.5 mg/L at 30 °C. Trout need more than about 6 mg/L, which is why warm effluent from power stations ("thermal pollution") and hot, still summer ponds can suffocate fish. The first bubbles in a pan of heating water are the dissolved air leaving, long before boiling.

### Diving and the bends
At 30 m a diver breathes air at 4 atm, so four times as much nitrogen dissolves in the blood and tissues. Ascend slowly and it leaves through the lungs; ascend too fast and it comes out of solution as bubbles in the joints and blood vessels — **decompression sickness**, the bends — exactly like opening a soda bottle. Deep divers replace some nitrogen with helium, which is less soluble and leaves the tissues faster.

### The oceans
Henry's law also governs the exchange of carbon dioxide between air and sea. As the atmosphere's carbon dioxide has risen from 280 to 420 ppm, the oceans have absorbed about a quarter of the carbon dioxide emitted by humanity, becoming measurably more acidic.
`,
  ideas: [
    'The concentration of a dissolved gas is proportional to its partial pressure above the liquid: c = k_H P.',
    'Each gas in a mixture dissolves according to its own partial pressure.',
    'Gases are less soluble in warm water, because dissolving a gas releases heat.',
    'Lowering the pressure over a gas-saturated liquid makes the excess gas come out as bubbles.',
    'Gases that react with water ($\\ce{CO2}$ a little, $\\ce{NH3}$ and $\\ce{HCl}$ a lot) are more soluble than Henry\'s law alone suggests.'
  ],
  pitfalls: [
    'Henry\'s law uses the total pressure — It uses the partial pressure of that gas. Oxygen in air at 1 atm dissolves according to 0.21 atm.',
    'Warming a liquid makes gases dissolve better, like solids — Gas solubility falls with temperature: warm soda goes flat faster and warm rivers hold less oxygen.',
    'All Henry\'s law constants mean the same thing — Some tables give c/P, others P/c, in different units. Multiplying by the wrong form is off by orders of magnitude.'
  ],
  formulas: [
    {
      name: 'Henry\'s law',
      expr: 'c = kH*P', tex: 'c = k_H\\,P_\\text{gas}',
      vars: {
        c: { name: 'concentration of dissolved gas', q: 'concentration', unit: 'mM' },
        kH: { name: 'Henry\'s law constant (solubility form)', q: 'henry', unit: 'M/atm', value: 1.3e-3, tex: 'k_H' },
        P: { name: 'partial pressure of the gas', q: 'pressure', unit: 'atm', value: 0.2095, tex: 'P_\\text{gas}' }
      },
      note: 'Defaults: oxygen from air dissolving in water at 25 °C. Multiply by the molar mass for mg/L: 0.27 mM of oxygen is 8.7 mg/L.',
      stories: {
        c: 'Water at 25 °C is in contact with air, in which the partial pressure of oxygen is {P}. Taking $k_H$ = {kH}, what is the concentration of dissolved oxygen?',
        P: 'What partial pressure of a gas with $k_H$ = {kH} is needed to dissolve {c} in water?'
      }
    },
    {
      name: 'Henry\'s law constant at another temperature',
      expr: 'kH2 = kH1*exp(C*(1/T2 - 1/T1))', tex: 'k_{H,2} = k_{H,1}\\,\\exp\\!\\left[C\\left(\\frac{1}{T_2} - \\frac{1}{T_1}\\right)\\right]',
      vars: {
        kH2: { name: 'constant at T₂', q: 'henry', unit: 'M/atm', tex: 'k_{H,2}' },
        kH1: { name: 'constant at T₁', q: 'henry', unit: 'M/atm', value: 1.3e-3, tex: 'k_{H,1}' },
        C: { name: 'temperature coefficient, −ΔH_soln/R', q: 'dtemp', unit: 'K', value: 1700 },
        T2: { name: 'new temperature', q: 'temperature', unit: '°C', value: 0, tex: 'T_2' },
        T1: { name: 'reference temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' }
      },
      solveFor: 'kH2',
      note: 'A van \'t Hoff form. $C$ is about 1700 K for oxygen, 1300 K for nitrogen and 2400 K for carbon dioxide in water. Positive $C$: less soluble when warm.',
      stories: {
        kH2: 'Oxygen has $k_H$ = {kH1} in water at {T1} and a temperature coefficient of {C}. What is $k_H$ at {T2}?'
      }
    },
    {
      name: 'Gas released when the pressure drops',
      expr: 'n = kH*(P1 - P2)*V', tex: 'n = k_H\\,(P_1 - P_2)\\,V',
      vars: {
        n: { name: 'amount of gas released', q: 'amount', unit: 'mol' },
        kH: { name: 'Henry\'s law constant', q: 'henry', unit: 'M/atm', value: 0.034, tex: 'k_H' },
        P1: { name: 'partial pressure before', q: 'pressure', unit: 'atm', value: 3.0, tex: 'P_1' },
        P2: { name: 'partial pressure after', q: 'pressure', unit: 'atm', value: 0.00042, tex: 'P_2' },
        V: { name: 'volume of liquid', q: 'volume', unit: 'L', value: 0.500 }
      },
      note: 'Assumes the liquid comes fully to equilibrium with the new pressure (a soda left open long enough to go flat). Defaults: a 500 mL bottle of soda opened to air.',
      stories: {
        n: 'A {V} bottle of soda was in equilibrium with carbon dioxide at {P1} ($k_H$ = {kH}). Opened and left to go flat under air ({P2} of carbon dioxide), how many moles of gas escape?',
        P1: 'Going flat, a {V} drink releases {n} of carbon dioxide ($k_H$ = {kH}) to air containing {P2} of it. At what pressure was it carbonated?'
      }
    }
  ],
  examples: [
    {
      title: 'Opening a bottle of soda',
      q: 'A 500 mL bottle of soda is in equilibrium with carbon dioxide at 3.0 atm at 25 °C ($k_H$ = 0.034 mol/(L·atm)). How much carbon dioxide does it release on going completely flat, and what volume of gas is that at 25 °C and 1 atm?',
      steps: [
        'Before: $c = 0.034 \\times 3.0 = 0.102\\ \\mathrm{mol/L}$ (4.5 g/L).',
        'After, in air ($P_{\\ce{CO2}} = 0.00042$ atm): $c = 1.4 \\times 10^{-5}\\ \\mathrm{mol/L}$ — practically nothing.',
        'Released: $0.102 \\times 0.500 = 0.051\\ \\mathrm{mol}$, or 2.2 g.',
        'Volume: $0.051 \\times 24.5\\ \\mathrm{L/mol} = 1.25\\ \\mathrm{L}$ of gas — two and a half times the volume of the drink.'
      ],
      a: 'About 0.051 mol, 1.25 L of carbon dioxide.'
    },
    {
      title: 'Oxygen for fish in a warm river',
      q: 'Oxygen has $k_H$ = $1.3 \\times 10^{-3}$ mol/(L·atm) at 25 °C, with a temperature coefficient of 1700 K. Compare the oxygen that air-saturated water can hold at 0 °C and at 30 °C ($P_{\\ce{O2}}$ = 0.21 atm).',
      steps: [
        { text: 'At 0 °C:', tex: 'k_H = 1.3 \\times 10^{-3}\\,e^{1700(1/273.15 - 1/298.15)} = 2.19 \\times 10^{-3}\\ \\mathrm{M/atm}' },
        'Dissolved oxygen: $2.19 \\times 10^{-3} \\times 0.21 \\times 32\\,000\\ \\mathrm{mg/mol} = 14.7\\ \\mathrm{mg/L}$.',
        'At 30 °C: $k_H = 1.3 \\times 10^{-3}\\,e^{1700(1/303.15 - 1/298.15)} = 1.18 \\times 10^{-3}$, giving 7.9 mg/L.',
        'Warm water holds about half as much oxygen — just when fish, whose metabolism speeds up with temperature, need more of it. (Measured: 14.6 and 7.6 mg/L; the small difference is the water vapour in the air, which lowers the oxygen partial pressure.)'
      ],
      a: 'About 14.7 mg/L at 0 °C against 7.9 mg/L at 30 °C.'
    }
  ],
  quiz: [
    { q: 'Why does a warm soda go flat faster than a cold one?', choices: ['warm water holds less dissolved gas', 'carbon dioxide reacts faster with sugar when warm', 'the pressure in the bottle is lower when warm', 'warm liquids are more viscous'], a: 0,
      why: 'Gas solubility falls as temperature rises. The warm drink is more oversaturated once opened, so the gas escapes faster.' },
    { q: 'The partial pressure of oxygen above water is doubled at constant temperature. The dissolved oxygen concentration at equilibrium…', choices: ['stays the same', 'doubles', 'halves', 'increases fourfold'], a: 1,
      why: 'Henry\'s law: concentration is proportional to partial pressure.' },
    { q: 'Using $k_H$ = $6.5 \\times 10^{-4}$ mol/(L·atm), what is the concentration of dissolved nitrogen (in mmol/L) in water breathed at 30 m depth, where the nitrogen partial pressure is 3.1 atm?', answer: 2.0, unit: 'mM',
      why: '$c = 6.5 \\times 10^{-4} \\times 3.1 = 2.0 \\times 10^{-3}$ M = 2.0 mM, four times the value at the surface.' },
    { q: 'Ammonia is far more soluble in water than Henry\'s law with a typical constant would predict, because it reacts with water.', a: true,
      why: 'Ammonia forms hydrogen bonds and partly reacts, $\\ce{NH3 + H2O <=> NH4+ + OH-}$, so the dissolved amount is much larger and not proportional to pressure.' },
    { q: 'A diver surfaces too quickly after a deep dive. What causes decompression sickness?', choices: ['oxygen poisoning', 'nitrogen dissolved at high pressure forming bubbles as the pressure falls', 'carbon dioxide building up in the blood', 'water entering the lungs'], a: 1,
      why: 'At depth, extra nitrogen dissolves in proportion to its partial pressure. On rapid ascent it comes out of solution as bubbles in tissues and blood — the soda-bottle effect.' }
  ],
  applications: ['Carbonated drinks and sparkling wine.', 'Dive tables and decompression stops; helium mixtures for deep diving.', 'Dissolved oxygen in rivers, lakes and fish farms.', 'Degassing water and boiler feed.', 'Anaesthetic gases and blood gases.', 'Uptake of carbon dioxide by the oceans.'],
  history: 'William Henry published his law in 1803, from measurements of how much of various gases water absorbs at different pressures. His friend John Dalton showed soon after that each gas in a mixture dissolves according to its own partial pressure.'
},

{
  id: 'raoults-law', parent: 'solutions', title: 'Raoult\'s law and vapour pressure lowering', level: 2,
  short: 'In a solution, each volatile component\'s vapour pressure is its pure vapour pressure times its mole fraction. A dissolved solid lowers the solvent\'s vapour pressure; in a mixture of two liquids the vapour is richer in the more volatile one — the basis of distillation.',
  keywords: ['Raoult\'s law', 'vapour pressure lowering', 'ideal solution', 'mole fraction', 'volatile', 'non-volatile solute', 'distillation', 'fractional distillation', 'boiling-point diagram', 'azeotrope', 'positive deviation', 'negative deviation', 'theoretical plate'],
  prereq: ['vapor-pressure', 'concentration-units', 'partial-pressures'],
  related: ['colligative-properties', 'henrys-law', 'intermolecular-forces', 'phase-diagrams', 'chromatography'],
  body: `
Dissolve sugar in water and the water's vapour pressure falls a little. The picture: at the surface, some of the places water molecules could escape from are now taken by sugar molecules, which do not evaporate. Fewer water molecules at the surface means fewer leave per second, and the balance with condensation is reached at a lower pressure. (The deeper reason is entropy: the solution is more disordered than pure water, so water is less inclined to leave it.)

### Raoult's law
For an **ideal solution**, the partial vapour pressure of each component is its mole fraction times the vapour pressure of the pure liquid:

$$P_A = x_A\\,P_A^*$$

With a non-volatile solute B, only the solvent evaporates, and the vapour pressure falls by

$$\\Delta P = P_A^* - P_A = x_B\\,P_A^*$$

— proportional to the mole fraction of solute, whatever the solute is. This is the root of all the [[colligative-properties]]: a lower vapour pressure means the solution must be heated more to boil and cooled more to freeze.

### Two volatile liquids
When both components evaporate, each follows Raoult's law and the total is the sum ([[partial-pressures|Dalton's law]]):

$$P = x_A P_A^* + x_B P_B^*$$

The vapour's composition follows from the partial pressures, $y_A = x_A P_A^*/P$, and it is always **richer in the more volatile component**. Benzene and toluene at 25 °C have $P^*$ = 95.2 and 28.4 mmHg; an equimolar liquid gives a vapour that is 77 % benzene. Condense that vapour and evaporate it again and the next vapour is 92 % benzene. That is **distillation**, and a fractionating column does it over and over on its trays or packing: each ideal cycle is a **theoretical plate**. Oil refineries separate crude oil into gases, petrol, kerosene, diesel and fuel oil in towers tens of metres tall.

Solutions come close to ideal when the two kinds of molecule attract each other about as strongly as they attract their own kind: benzene–toluene, hexane–heptane.

### Deviations and azeotropes
- **Positive deviation**: A–B attractions are weaker than A–A and B–B, molecules escape more easily and the vapour pressure is higher than Raoult predicts. Ethanol–water is the famous case; it has a vapour-pressure maximum at 95.6 % ethanol by mass, which boils at 78.2 °C, below either pure liquid. That mixture, an **azeotrope**, distils unchanged, which is why distillation cannot make ethanol purer than 95.6 %.
- **Negative deviation**: A–B attractions are stronger (hydrogen bonds between acetone and chloroform, or $\\ce{HCl}$ ionising in water), the vapour pressure is lower and there is a maximum-boiling azeotrope: 20.2 % hydrochloric acid boils unchanged at 108.6 °C.

For a solute present in small amounts in a volatile solvent, the *solvent* follows Raoult's law while the dilute *solute* follows [[henrys-law|Henry's law]] — two views of the same equilibrium.
`,
  ideas: [
    'Raoult\'s law: each component\'s partial vapour pressure is its mole fraction times its pure vapour pressure.',
    'A non-volatile solute lowers the solvent\'s vapour pressure in proportion to the solute\'s mole fraction.',
    'Over a mixture of two volatile liquids, the vapour is richer in the more volatile component; repeating evaporation and condensation is distillation.',
    'Ideal behaviour needs similar A–A, B–B and A–B attractions; otherwise the solution deviates positively or negatively.',
    'Azeotropes boil without changing composition and cannot be separated by simple distillation.'
  ],
  pitfalls: [
    'The vapour has the same composition as the liquid — It is enriched in the more volatile component; that is why distillation works at all.',
    'The lowering depends on what the solute is — For an ideal solution it depends only on the mole fraction of solute particles, not on their identity (though ions count separately).',
    'Distillation can always purify a liquid completely — Not if an azeotrope forms: ethanol and water stop at 95.6 % ethanol.'
  ],
  formulas: [
    {
      name: 'Raoult\'s law for one component',
      expr: 'PA = xA*PA0', tex: 'P_A = x_A\\,P_A^*',
      vars: {
        PA: { name: 'partial vapour pressure of A over the solution', q: 'pressure', unit: 'mmHg', tex: 'P_A' },
        xA: { name: 'mole fraction of A in the liquid', q: 'ratio', unit: '', value: 0.9794, min: 0, max: 1, tex: 'x_A' },
        PA0: { name: 'vapour pressure of pure A', q: 'pressure', unit: 'mmHg', value: 23.76, tex: 'P_A^*' }
      },
      note: 'Defaults: water in a solution of 100 g of sucrose in 250 g of water, at 25 °C.',
      stories: {
        PA: 'A sugar solution at 25 °C has a water mole fraction of {xA}. Pure water\'s vapour pressure is {PA0}. What is the vapour pressure of the solution?',
        xA: 'A solution has a vapour pressure of {PA}; the pure solvent\'s is {PA0}. What is the mole fraction of solvent?'
      }
    },
    {
      name: 'Vapour-pressure lowering by a non-volatile solute',
      expr: 'dP = xB*PA0', tex: '\\Delta P = x_B\\,P_A^*',
      vars: {
        dP: { name: 'lowering of the vapour pressure', q: 'pressure', unit: 'mmHg', tex: '\\Delta P' },
        xB: { name: 'mole fraction of solute', q: 'ratio', unit: '', value: 0.0206, min: 0, max: 1, tex: 'x_B' },
        PA0: { name: 'vapour pressure of the pure solvent', q: 'pressure', unit: 'mmHg', value: 23.76, tex: 'P_A^*' }
      },
      note: 'For an electrolyte, count every ion as a particle when working out $x_B$.',
      stories: {
        dP: 'By how much does a non-volatile solute at mole fraction {xB} lower the vapour pressure of water ({PA0} when pure)?',
        xB: 'A solute lowers water\'s vapour pressure from {PA0} by {dP}. What is its mole fraction?'
      }
    },
    {
      name: 'Total vapour pressure of an ideal mixture of two liquids',
      expr: 'P = xA*PA0 + (1 - xA)*PB0', tex: 'P = x_A P_A^* + (1 - x_A)\\,P_B^*',
      vars: {
        P: { name: 'total vapour pressure', q: 'pressure', unit: 'mmHg' },
        xA: { name: 'mole fraction of A in the liquid', q: 'ratio', unit: '', value: 0.50, min: 0, max: 1, tex: 'x_A' },
        PA0: { name: 'vapour pressure of pure A', q: 'pressure', unit: 'mmHg', value: 95.2, tex: 'P_A^*' },
        PB0: { name: 'vapour pressure of pure B', q: 'pressure', unit: 'mmHg', value: 28.4, tex: 'P_B^*' }
      },
      note: 'A straight line between the two pure vapour pressures. Defaults: benzene (A) and toluene (B) at 25 °C.',
      stories: {
        P: 'A liquid mixture of benzene (mole fraction {xA}, $P^*$ = {PA0}) and toluene ($P^*$ = {PB0}) is at 25 °C. What is its total vapour pressure?',
        xA: 'An ideal mixture of benzene ($P^*$ = {PA0}) and toluene ($P^*$ = {PB0}) has a vapour pressure of {P}. What is the mole fraction of benzene?'
      }
    },
    {
      name: 'Composition of the vapour over an ideal mixture',
      expr: 'yA = xA*PA0/(xA*PA0 + (1 - xA)*PB0)', tex: 'y_A = \\frac{x_A P_A^*}{x_A P_A^* + (1 - x_A)\\,P_B^*}',
      vars: {
        yA: { name: 'mole fraction of A in the vapour', q: 'ratio', unit: '', tex: 'y_A' },
        xA: { name: 'mole fraction of A in the liquid', q: 'ratio', unit: '', value: 0.50, min: 0, max: 1, tex: 'x_A' },
        PA0: { name: 'vapour pressure of pure A', q: 'pressure', unit: 'mmHg', value: 95.2, tex: 'P_A^*' },
        PB0: { name: 'vapour pressure of pure B', q: 'pressure', unit: 'mmHg', value: 28.4, tex: 'P_B^*' }
      },
      note: 'The vapour is richer in the more volatile component. Feed $y_A$ back in as the next $x_A$ to follow a distillation, one theoretical plate at a time.',
      stories: {
        yA: 'Over a liquid that is {xA} benzene ($P^*$ = {PA0}) and the rest toluene ($P^*$ = {PB0}), what is the mole fraction of benzene in the vapour?',
        xA: 'What liquid composition gives a vapour that is {yA} benzene ($P^*$ = {PA0}, toluene $P^*$ = {PB0})?'
      }
    }
  ],
  examples: [
    {
      title: 'Syrup and its vapour pressure',
      q: '100 g of sucrose ($\\ce{C12H22O11}$, 342.3 g/mol) is dissolved in 250 g of water at 25 °C, where pure water\'s vapour pressure is 23.76 mmHg. What is the vapour pressure of the solution?',
      steps: [
        'Moles: sucrose $100/342.3 = 0.292$ mol; water $250/18.015 = 13.88$ mol.',
        'Mole fraction of water: $x = 13.88/(13.88 + 0.292) = 0.9794$.',
        'Raoult: $P = 0.9794 \\times 23.76 = 23.27\\ \\mathrm{mmHg}$, a lowering of 0.49 mmHg (2.1 %).'
      ],
      a: '23.27 mmHg.'
    },
    {
      title: 'Two steps of distillation',
      q: 'An equimolar liquid mixture of benzene ($P^*$ = 95.2 mmHg) and toluene ($P^*$ = 28.4 mmHg) is at 25 °C. Find the composition of its vapour; then condense that vapour and find the vapour over the condensate.',
      steps: [
        'Partial pressures: benzene $0.50 \\times 95.2 = 47.6$, toluene $0.50 \\times 28.4 = 14.2$; total 61.8 mmHg.',
        'Vapour: $y_{\\text{benzene}} = 47.6/61.8 = 0.770$.',
        'Condense it: the new liquid has $x = 0.770$. Partial pressures $0.770 \\times 95.2 = 73.3$ and $0.230 \\times 28.4 = 6.5$; so $y = 73.3/79.8 = 0.918$.',
        'Two ideal steps took benzene from 50 % to 92 %. A fractionating column with enough plates reaches whatever purity is needed.'
      ],
      a: 'First vapour 77 % benzene, second 92 %.'
    }
  ],
  quiz: [
    { q: 'Over an ideal mixture of a volatile liquid A and a less volatile liquid B, the vapour is…', choices: ['richer in A than the liquid', 'richer in B than the liquid', 'the same composition as the liquid', 'pure A'], a: 0,
      why: 'A contributes a larger share of the vapour pressure than of the liquid, because its $P^*$ is higher: $y_A = x_A P_A^*/P > x_A$ when $P_A^* > P$.' },
    { q: 'A non-volatile solute is added to water until its mole fraction is 0.050. By what percentage does the vapour pressure fall?', answer: 5.0, unit: '%',
      why: '$\\Delta P/P^* = x_B = 0.050$, a 5.0 % lowering, whatever the solute.' },
    { q: 'An ethanol–water mixture shows positive deviation from Raoult\'s law. This means…', choices: ['ethanol–water attractions are weaker than the average of ethanol–ethanol and water–water', 'ethanol–water attractions are stronger', 'the mixture is ideal', 'ethanol does not evaporate'], a: 0,
      why: 'Weaker unlike attractions let molecules escape more easily, raising the vapour pressure above the Raoult line.' },
    { q: 'Simple distillation of a dilute ethanol–water mixture can eventually give pure ethanol.', a: false,
      why: 'Ethanol and water form an azeotrope at 95.6 % ethanol by mass, which boils without changing composition. Going further needs a drying agent or another separation.' },
    { q: 'Benzene ($P^*$ = 95.2 mmHg) and toluene ($P^*$ = 28.4 mmHg) form an ideal solution with $x_\\text{benzene} = 0.25$. What is the total vapour pressure?', answer: 45.1, unit: 'mmHg',
      why: '$P = 0.25 \\times 95.2 + 0.75 \\times 28.4 = 23.8 + 21.3 = 45.1$ mmHg.' }
  ],
  applications: ['Fractional distillation of crude oil, liquid air and spirits.', 'Designing distillation columns (number of theoretical plates).', 'Understanding why salt water evaporates more slowly than fresh.', 'Azeotropic drying of solvents and breaking azeotropes.'],
  history: 'François-Marie Raoult measured the lowering of vapour pressures and freezing points by many solutes in the 1880s and found that they depended only on the proportion of solute particles — evidence, at the time, that molecules could be counted by physical measurements.',
  sim: 'state-raoult'
},

{
  id: 'colligative-properties', parent: 'solutions', title: 'Boiling-point elevation and freezing-point depression', level: 2,
  short: 'A dissolved solute makes a solvent boil at a higher temperature and freeze at a lower one, by amounts that depend only on how many solute particles there are — not on what they are.',
  keywords: ['colligative properties', 'boiling-point elevation', 'freezing-point depression', 'ebullioscopic constant', 'cryoscopic constant', 'Kb', 'Kf', 'van \'t Hoff factor', 'antifreeze', 'road salt', 'cryoscopy', 'molar mass determination', 'eutectic'],
  prereq: ['raoults-law', 'concentration-units', 'phase-diagrams'],
  related: ['osmotic-pressure', 'vapor-pressure', 'molar-mass', 'strong-acids-bases', 'ionic-bonding'],
  body: `
Salted roads stay clear of ice at −5 °C; the coolant in a car neither freezes in winter nor boils in summer; the sea freezes at −1.9 °C instead of 0 °C. In each case a dissolved substance shifts the solvent's freezing and boiling points, and the shift depends on the **number** of dissolved particles, not on their identity. Properties like that are called **colligative** ("bound together", as in a collection).

### Why
A non-volatile solute lowers the solvent's vapour pressure ([[raoults-law]]). On a [[phase-diagrams|phase diagram]] the whole liquid–vapour curve moves down. The solution therefore has to be heated further before its vapour pressure reaches the outside pressure — the boiling point rises. At the cold end, the solute stays in the liquid when the solvent freezes out as pure solid, so the liquid's curve meets the unchanged solid's curve at a lower temperature — the freezing point falls. Both effects come from the solute making the liquid more disordered and so more stable relative to the pure vapour and the pure solid.

### The laws
For dilute solutions both shifts are proportional to the **molality** of solute particles:

$$\\Delta T_b = i\\,K_b\\,b \\qquad\\qquad \\Delta T_f = i\\,K_f\\,b$$

$K_b$ and $K_f$ (the ebullioscopic and cryoscopic constants) belong to the solvent, not the solute:

| Solvent | Freezes at | $K_f$ (K·kg/mol) | Boils at | $K_b$ (K·kg/mol) |
|---|---|---|---|---|
| water | 0.0 °C | 1.86 | 100.0 °C | 0.512 |
| acetic acid | 16.6 °C | 3.90 | 118 °C | 3.07 |
| benzene | 5.5 °C | 5.12 | 80.1 °C | 2.53 |
| cyclohexane | 6.5 °C | 20.0 | 80.7 °C | 2.9 |
| camphor | 179 °C | about 40 | — | — |

They follow from the solvent's own properties, $K_f = RT_f^2 M/\\Delta H_\\text{fus}$ (see the formula below) — which is why solvents with a small enthalpy of fusion, like camphor, give big, easily measured depressions.

### The van 't Hoff factor
An electrolyte breaks into ions, and each ion counts. The **van 't Hoff factor** $i$ is the number of particles per formula unit: 1 for sugar or ethylene glycol, ideally 2 for $\\ce{NaCl}$ and 3 for $\\ce{CaCl2}$. Real values are a little lower because oppositely charged ions pair up: about 1.9 for sodium chloride and 1.3 for magnesium sulfate at 0.05 mol/kg.

### Real-world numbers
- **Road salt**: sodium chloride works down to about −9 °C in practice (its lowest possible freezing point, the eutectic, is −21 °C at 23 % salt); calcium chloride, with three ions and a much lower eutectic near −50 °C, works in harder frost.
- **Antifreeze**: a 50 : 50 mix of ethylene glycol and water freezes near −35 °C and boils near 107 °C at 1 atm — higher still under the radiator cap's pressure.
- **Salting pasta water** raises its boiling point by less than 0.2 K; it is for taste only.
- **Cryoscopy**: dissolving a weighed sample in a solvent such as benzene or camphor and measuring $\\Delta T_f$ gives its molar mass — one of the classic ways molecular formulas were established.
`,
  ideas: [
    'A non-volatile solute lowers the vapour pressure, so the solution boils higher and freezes lower than the pure solvent.',
    'The shifts depend on the number of dissolved particles, not their identity: ΔT = i·K·b.',
    'K_b and K_f are properties of the solvent; K_f is larger than K_b for water (1.86 against 0.512).',
    'Electrolytes count every ion: the van \'t Hoff factor i is about 2 for $\\ce{NaCl}$ and 3 for $\\ce{CaCl2}$, a little less in practice.',
    'Measuring a freezing-point depression gives a molar mass.'
  ],
  pitfalls: [
    'The formulas use molarity — They use molality, moles per kilogram of solvent, which does not depend on temperature or the solution\'s volume.',
    'One mole of $\\ce{NaCl}$ has the same effect as one mole of sugar — Sodium chloride gives about twice as many particles, so it lowers the freezing point about twice as much.',
    'Salt makes pasta water boil noticeably hotter — A spoonful in a litre raises the boiling point by under 0.2 K.'
  ],
  formulas: [
    {
      name: 'Freezing-point depression',
      expr: 'dTf = i*Kf*b', tex: '\\Delta T_f = i\\,K_f\\,b',
      vars: {
        dTf: { name: 'lowering of the freezing point', q: 'dtemp', unit: 'K', tex: '\\Delta T_f' },
        i: { name: 'van \'t Hoff factor (particles per formula unit)', value: 1 },
        Kf: { name: 'cryoscopic constant of the solvent', q: 'colligative', unit: 'K·kg/mol', value: 1.86, tex: 'K_f' },
        b: { name: 'molality of the solute', q: 'molality', unit: 'mol/kg', value: 1.00 }
      },
      note: 'Dilute solutions; above about 1 mol/kg the real depression departs from the straight line. Water: $K_f$ = 1.86.',
      stories: {
        dTf: 'A solution of {b} of a non-electrolyte in water ($K_f$ = {Kf}) has $i$ = {i}. By how much is its freezing point lowered?',
        b: 'What molality of a solute with $i$ = {i} lowers the freezing point of water ($K_f$ = {Kf}) by {dTf}?'
      }
    },
    {
      name: 'Boiling-point elevation',
      expr: 'dTb = i*Kb*b', tex: '\\Delta T_b = i\\,K_b\\,b',
      vars: {
        dTb: { name: 'rise of the boiling point', q: 'dtemp', unit: 'K', tex: '\\Delta T_b' },
        i: { name: 'van \'t Hoff factor', value: 2 },
        Kb: { name: 'ebullioscopic constant of the solvent', q: 'colligative', unit: 'K·kg/mol', value: 0.512, tex: 'K_b' },
        b: { name: 'molality of the solute', q: 'molality', unit: 'mol/kg', value: 0.171 }
      },
      note: 'Only for non-volatile solutes. Defaults: 10 g of salt in a litre of pasta water.',
      stories: {
        dTb: 'Pasta water contains {b} of sodium chloride ($i$ = {i}); $K_b$ for water is {Kb}. By how much does its boiling point rise?',
        b: 'What molality of a solute with $i$ = {i} raises water\'s boiling point ($K_b$ = {Kb}) by {dTb}?'
      }
    },
    {
      name: 'Molar mass from a freezing-point depression',
      expr: 'M = i*Kf*ms/(dTf*msolv)', tex: 'M = \\frac{i\\,K_f\\,m_\\text{solute}}{\\Delta T_f\\,m_\\text{solvent}}',
      vars: {
        M: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol' },
        i: { name: 'van \'t Hoff factor', value: 1 },
        Kf: { name: 'cryoscopic constant of the solvent', q: 'colligative', unit: 'K·kg/mol', value: 5.12, tex: 'K_f' },
        ms: { name: 'mass of solute', q: 'mass', unit: 'g', value: 0.640, tex: 'm_\\text{solute}' },
        dTf: { name: 'measured freezing-point depression', q: 'dtemp', unit: 'K', value: 1.02, tex: '\\Delta T_f' },
        msolv: { name: 'mass of solvent', q: 'mass', unit: 'g', value: 25.0, tex: 'm_\\text{solvent}' }
      },
      note: 'Cryoscopy. Defaults: an unknown hydrocarbon in benzene.',
      stories: {
        M: '{ms} of an unknown solid dissolved in {msolv} of benzene ($K_f$ = {Kf}) lowers its freezing point by {dTf}. What is the molar mass of the solid?'
      }
    },
    {
      name: 'The cryoscopic constant from the solvent\'s properties',
      expr: 'Kf = R*Tf^2*M/dH', tex: 'K_f = \\frac{R\\,T_f^2\\,M}{\\Delta H_\\text{fus}}',
      vars: {
        Kf: { name: 'cryoscopic constant', q: 'colligative', unit: 'K·kg/mol', tex: 'K_f' },
        R: { const: 'R' },
        Tf: { name: 'freezing point of the solvent', q: 'temperature', unit: 'K', value: 273.15, tex: 'T_f' },
        M: { name: 'molar mass of the solvent', q: 'molarmass', unit: 'g/mol', value: 18.015 },
        dH: { name: 'enthalpy of fusion of the solvent', q: 'molarenergy', unit: 'kJ/mol', value: 6.01, tex: '\\Delta H_\\text{fus}' }
      },
      note: 'Replace $T_f$ by the boiling point and $\\Delta H_\\text{fus}$ by $\\Delta H_\\text{vap}$ for $K_b$ (water: 0.513). Defaults: water.',
      stories: {
        Kf: 'A solvent freezes at {Tf}, has a molar mass of {M} and an enthalpy of fusion of {dH}. What is its cryoscopic constant?'
      }
    }
  ],
  derivation: {
    title: 'Why ΔT is proportional to molality',
    steps: [
      { text: 'Raoult: the solute lowers the solvent\'s vapour pressure by a fraction equal to its mole fraction; for a dilute solution $\\ln x_A = \\ln(1 - x_B) \\approx -x_B$:', tex: '\\ln\\frac{P}{P^*} \\approx -x_B' },
      { text: 'Near the boiling point the pure liquid\'s curve obeys Clausius–Clapeyron, so a small change $\\Delta T_b$ changes $\\ln P^*$ by', tex: '\\Delta\\ln P^* = \\frac{\\Delta H_\\text{vap}}{RT_b^2}\\,\\Delta T_b' },
      { text: 'The solution boils when its vapour pressure is back up to the outside pressure, so the two changes cancel:', tex: '\\Delta T_b = \\frac{RT_b^2}{\\Delta H_\\text{vap}}\\,x_B' },
      { text: 'For a dilute solution $x_B \\approx n_B/n_A = b\\,M_A$ (with $M_A$ in kg/mol):', tex: '\\Delta T_b = \\underbrace{\\frac{RT_b^2 M_A}{\\Delta H_\\text{vap}}}_{K_b}\\,b' },
      { text: 'The same argument with the solid\'s sublimation curve and $\\Delta H_\\text{fus}$ gives $K_f = RT_f^2 M_A/\\Delta H_\\text{fus}$ — for water 1.86 K·kg/mol, larger than $K_b$ because $\\Delta H_\\text{fus}$ is small.' }
    ]
  },
  examples: [
    {
      title: 'Antifreeze',
      q: 'A coolant is 50 % ethylene glycol ($\\ce{C2H6O2}$, 62.07 g/mol) by mass in water. Estimate its freezing and boiling points with the dilute-solution laws.',
      steps: [
        'Per kilogram of coolant: 500 g of glycol ($500/62.07 = 8.06$ mol) in 0.500 kg of water, so $b = 16.1\\ \\mathrm{mol/kg}$.',
        '$\\Delta T_f = 1 \\times 1.86 \\times 16.1 = 30\\ \\mathrm{K}$: freezing near −30 °C.',
        '$\\Delta T_b = 1 \\times 0.512 \\times 16.1 = 8.2\\ \\mathrm{K}$: boiling near 108 °C at 1 atm.',
        'Measured: about −34 °C and 107 °C. At such high concentrations the laws are only a guide — they were derived for dilute solutions — but they get the size right.'
      ],
      a: 'Roughly −30 °C and 108 °C (measured about −34 °C and 107 °C).'
    },
    {
      title: 'Identifying a hydrocarbon by cryoscopy',
      q: '0.640 g of an unknown white hydrocarbon is dissolved in 25.0 g of benzene, and the freezing point falls from 5.50 °C to 4.48 °C. $K_f$(benzene) = 5.12 K·kg/mol. What is its molar mass, and what might it be?',
      steps: [
        '$\\Delta T_f = 5.50 - 4.48 = 1.02\\ \\mathrm{K}$, so $b = 1.02/5.12 = 0.199\\ \\mathrm{mol/kg}$.',
        'Moles of solute: $0.199 \\times 0.0250 = 4.98 \\times 10^{-3}$ mol.',
        '$M = 0.640/4.98 \\times 10^{-3} = 128.5\\ \\mathrm{g/mol}$.',
        'A white hydrocarbon of molar mass 128: naphthalene, $\\ce{C10H8}$ (128.17 g/mol) — mothballs.'
      ],
      a: 'About 128 g/mol — naphthalene.'
    }
  ],
  quiz: [
    { q: 'Which lowers the freezing point of 1 kg of water most?', choices: ['1 mol of glucose', '1 mol of sucrose', '1 mol of sodium chloride', '1 mol of calcium chloride'], a: 3,
      why: 'Colligative effects count particles. Calcium chloride gives up to 3 ions per formula unit, sodium chloride 2, the sugars 1.' },
    { q: 'What is the freezing point of a solution of 0.500 mol of sucrose in 1.00 kg of water ($K_f$ = 1.86 K·kg/mol), in °C?', answer: -0.93, unit: '°C',
      why: '$\\Delta T_f = 1.86 \\times 0.500 = 0.93$ K, so it freezes at −0.93 °C.' },
    { q: 'Why are colligative laws written with molality rather than molarity?', choices: ['molality is easier to measure', 'molality does not change with temperature, and counts solute per amount of solvent', 'molarity cannot be used for solids', 'it makes no difference'], a: 1,
      why: 'Freezing and boiling happen at different temperatures, where a solution\'s volume (and so its molarity) differs. Molality is fixed by the masses.' },
    { q: 'Adding a spoonful of salt to a pan of pasta water makes it boil several degrees hotter.', a: false,
      why: '10 g in a litre is 0.17 mol/kg; with $i \\approx 2$ and $K_b$ = 0.512, $\\Delta T_b \\approx 0.18$ K.' },
    { q: 'Seawater freezes at about −1.9 °C. Why does the ice that forms taste fresh?', choices: ['the salt evaporates', 'the solvent freezes out as nearly pure ice, leaving the salt in the liquid', 'salt is destroyed by freezing', 'ice dissolves the salt later'], a: 1,
      why: 'The solid that forms is the pure solvent; that is exactly why the solution\'s freezing point is lowered. Sea ice gradually drains its trapped brine and becomes nearly fresh.' }
  ],
  applications: ['De-icing roads and runways with salts.', 'Engine coolant and antifreeze.', 'Making ice cream with an ice–salt bath.', 'Measuring molar masses by cryoscopy and ebullioscopy.', 'Osmometers that measure blood and urine osmolality by the freezing-point depression.'],
  history: 'François-Marie Raoult established the freezing-point law in 1882–1886, and Jacobus van \'t Hoff explained it thermodynamically. The anomalously large effects of salts, which van \'t Hoff accounted for with his factor i, were a key clue for Svante Arrhenius\'s theory that salts split into ions in water (1887).',
  sim: { id: 'state-phase', params: { zoom: 1, solute: 2 } }
},

{
  id: 'osmotic-pressure', parent: 'solutions', title: 'Osmotic pressure', level: 2,
  short: 'Water flows through a membrane that stops solute particles, from the dilute side to the concentrated side. The pressure needed to stop that flow, the osmotic pressure, is Π = icRT — the ideal gas law for dissolved particles.',
  keywords: ['osmosis', 'osmotic pressure', 'semipermeable membrane', 'van \'t Hoff equation for osmotic pressure', 'reverse osmosis', 'desalination', 'isotonic', 'hypertonic', 'hypotonic', 'osmolarity', 'red blood cells', 'turgor', 'molar mass of polymers', 'osmometry'],
  prereq: ['colligative-properties', 'molarity', 'ideal-gas-law'],
  related: ['physics:hydrostatic-pressure', 'physics:pressure', 'raoults-law', 'amino-acids-proteins', 'polymers', 'solubility'],
  body: `
Put a slice of cucumber in brine and it goes limp; drop a raisin in water and it swells. Both are **osmosis**: water crossing a membrane that lets water through but holds back dissolved particles — a **semipermeable membrane** such as a cell wall, a sheet of cellophane or the polyamide film of a desalination plant.

### Why water moves
The dissolved particles lower the water's tendency to escape, just as they lower its vapour pressure ([[raoults-law]]). Pure water on one side of the membrane therefore crosses into the solution faster than solution water crosses back. The net flow can be stopped by pushing on the solution side. The pressure needed is the **osmotic pressure** $\\Pi$; in a U-tube the solution side simply rises until the extra hydrostatic pressure of its column, $\\rho g h$ ([[physics:hydrostatic-pressure]]), does the pushing.

For dilute solutions van 't Hoff found a strikingly familiar law:

$$\\Pi = i\\,c\\,R\\,T$$

— the ideal gas law, $P = (n/V)RT$, with the dissolved particles playing the part of the gas molecules. $c$ is the molarity and $i$ the van 't Hoff factor ([[colligative-properties]]).

### Osmotic pressures are large
A 0.10 M sugar solution at 25 °C has $\\Pi$ = 2.45 atm — enough to hold up a column of water 25 m high. That makes osmosis far more sensitive than the other colligative properties: a protein of molar mass 50 000 g/mol at 1 g per 100 mL gives an osmotic pressure of 3.7 mmHg (a 5 cm water column), while its freezing-point depression would be 0.0004 K. **Osmometry** is therefore the method for molar masses of polymers and proteins.

### In living things
Cells are bags of solution with semipermeable membranes. Blood plasma is about 290 mOsm/L of dissolved particles, which gives $\\Pi$ ≈ 7.4 atm at 37 °C.
- An **isotonic** drip (0.9 % sodium chloride, 0.154 M, about 290 mOsm/L) matches it, so red cells keep their shape.
- In pure water (**hypotonic**) cells swell and burst; in strong brine (**hypertonic**) they shrivel. That is why seawater cannot quench thirst, and why salt and sugar preserve food: bacteria lose their water.
- Plants hold themselves up by **turgor**: water drawn into their cells by osmosis presses outwards on the cell walls.

### Reverse osmosis
Push on the solution side with more than $\\Pi$ and water flows the other way, out of the solution through the membrane: **reverse osmosis**. Seawater (about 1.1 osmol/L of ions) has an osmotic pressure of about 27 atm, so desalination plants run at 55–80 bar. The minimum work to squeeze a cubic metre of fresh water out of the sea is $\\Pi V$, about 0.75 kWh; the best plants use around 3 kWh per cubic metre, a large part of the cost of fresh water in dry countries.
`,
  ideas: [
    'Osmosis is the net flow of solvent through a semipermeable membrane from the dilute side to the concentrated side.',
    'The osmotic pressure is the pressure that must be applied to the solution to stop the flow.',
    'For dilute solutions Π = icRT, the ideal gas law for dissolved particles.',
    'Osmotic pressures are large, which makes osmometry the most sensitive colligative method, ideal for big molecules.',
    'Applying more than Π to the solution reverses the flow: reverse osmosis produces fresh water from seawater.'
  ],
  pitfalls: [
    'Solute moves through the membrane to even out the concentrations — The membrane stops the solute; only the solvent moves, from dilute to concentrated.',
    'Osmotic pressure is a pressure the solution exerts on the membrane all the time — It is the pressure needed to stop osmosis; a solution in a beaker has no extra pressure.',
    'Π = cRT works with c in any units — With $R$ = 0.08206 L·atm/(mol·K), c must be in mol/L and Π comes out in atm; in SI, c in mol/m³ gives Π in pascals.'
  ],
  formulas: [
    {
      name: 'Osmotic pressure (van \'t Hoff)',
      expr: 'Posm = i*c*R*T', tex: '\\Pi = i\\,c\\,R\\,T',
      vars: {
        Posm: { name: 'osmotic pressure', q: 'pressure', unit: 'atm', tex: '\\Pi' },
        i: { name: 'van \'t Hoff factor', value: 1 },
        c: { name: 'molar concentration of the solute', q: 'concentration', unit: 'M', value: 0.100 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'Dilute solutions. Defaults: 0.100 M sucrose at 25 °C.',
      stories: {
        Posm: 'What is the osmotic pressure of a {c} solution of a solute with $i$ = {i} at {T}?',
        c: 'What molar concentration of particles ($i$ = {i}) gives an osmotic pressure of {Posm} at {T}?',
        i: 'A {c} solution of a salt has an osmotic pressure of {Posm} at {T}. What is its effective van \'t Hoff factor?'
      }
    },
    {
      name: 'Height of the column that balances osmosis',
      expr: 'h = Posm/(rho*g)', tex: 'h = \\frac{\\Pi}{\\rho\\,g}',
      vars: {
        h: { name: 'height difference of the columns', q: 'length', unit: 'm' },
        Posm: { name: 'osmotic pressure', q: 'pressure', unit: 'atm', value: 2.45, tex: '\\Pi' },
        rho: { name: 'density of the solution', q: 'density', unit: 'kg/m³', value: 1000, tex: '\\rho' },
        g: { const: 'g' }
      },
      note: 'The hydrostatic pressure of the extra column equals the osmotic pressure at equilibrium (ignoring the dilution as water flows in).',
      stories: {
        h: 'A solution with an osmotic pressure of {Posm} and density {rho} is separated from pure water by a membrane in a U-tube. How much higher does the solution side stand at equilibrium?',
        Posm: 'In an osmometer the solution rises {h} above the pure water. Its density is {rho}. What is its osmotic pressure?'
      }
    },
    {
      name: 'Molar mass by osmometry',
      expr: 'M = m*R*T/(Posm*V)', tex: 'M = \\frac{m\\,R\\,T}{\\Pi\\,V}',
      vars: {
        M: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol' },
        m: { name: 'mass of solute', q: 'mass', unit: 'g', value: 1.00 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        Posm: { name: 'measured osmotic pressure', q: 'pressure', unit: 'mmHg', value: 3.72, tex: '\\Pi' },
        V: { name: 'volume of solution', q: 'volume', unit: 'mL', value: 100 }
      },
      note: 'For a non-electrolyte ($i$ = 1), such as a protein near its isoelectric point or a neutral polymer. Defaults give about 50 000 g/mol.',
      stories: {
        M: '{m} of a protein dissolved to make {V} of solution has an osmotic pressure of {Posm} at {T}. What is the molar mass of the protein?',
        Posm: 'What osmotic pressure does {m} of a protein of molar mass {M} produce in {V} of solution at {T}?'
      }
    },
    {
      name: 'Minimum energy for desalination',
      expr: 'E = Posm*V', tex: 'E_\\text{min} = \\Pi\\,V',
      vars: {
        E: { name: 'minimum work', q: 'energy', unit: 'kWh', tex: 'E_\\text{min}' },
        Posm: { name: 'osmotic pressure of the feed', q: 'pressure', unit: 'atm', value: 27, tex: '\\Pi' },
        V: { name: 'volume of fresh water produced', q: 'volume', unit: 'm³', value: 1 }
      },
      note: 'The work of pushing water through the membrane against $\\Pi$, in the limit of recovering only a little of the feed. Real plants recover about half and need about four times this.',
      stories: {
        E: 'Seawater has an osmotic pressure of {Posm}. What is the minimum work to produce {V} of fresh water from it by reverse osmosis?'
      }
    }
  ],
  examples: [
    {
      title: 'How much pressure does desalination need?',
      q: 'Seawater contains about 1.1 mol of dissolved ions per litre. Estimate its osmotic pressure at 25 °C, and the minimum energy to make 1 m³ of fresh water from it.',
      steps: [
        'The ions already count every particle, so $ic$ = 1.1 mol/L.',
        { text: 'Osmotic pressure:', tex: '\\Pi = 1.1 \\times 0.08206 \\times 298 = 26.9\\ \\mathrm{atm} = 2.7\\ \\mathrm{MPa}' },
        'A reverse-osmosis plant must push harder than this — in practice 55–80 bar, because the brine grows more concentrated as water is removed.',
        'Minimum work: $\\Pi V = 2.7 \\times 10^6\\ \\mathrm{Pa} \\times 1\\ \\mathrm{m^3} = 2.7\\ \\mathrm{MJ} = 0.75\\ \\mathrm{kWh}$.'
      ],
      a: 'About 27 atm; at least 0.75 kWh per cubic metre (real plants use about 3 kWh).'
    },
    {
      title: 'Weighing a protein with osmosis',
      q: 'A solution of 1.00 g of a protein in water, made up to 100 mL, has an osmotic pressure of 3.72 mmHg at 25 °C. What is the protein\'s molar mass? How large would the freezing-point depression be?',
      steps: [
        'Convert: $\\Pi = 3.72 \\times 133.3 = 496\\ \\mathrm{Pa}$; $V = 1.00 \\times 10^{-4}\\ \\mathrm{m^3}$.',
        { text: 'Moles of protein:', tex: 'n = \\frac{\\Pi V}{RT} = \\frac{496 \\times 1.00 \\times 10^{-4}}{8.314 \\times 298.15} = 2.00 \\times 10^{-5}\\ \\mathrm{mol}' },
        '$M = 1.00/2.00 \\times 10^{-5} = 5.0 \\times 10^{4}\\ \\mathrm{g/mol}$.',
        'Freezing-point depression: $1.86 \\times 2.0 \\times 10^{-4}\\ \\mathrm{mol/kg} = 3.7 \\times 10^{-4}$ K — far too small to measure, while 3.72 mmHg is a 5 cm column of water.'
      ],
      a: 'About 50 000 g/mol; the freezing point would move by only 0.0004 K.'
    }
  ],
  quiz: [
    { q: 'A semipermeable membrane separates pure water (left) from a sugar solution (right). Which way does the net flow go?', choices: ['water flows left to right', 'water flows right to left', 'sugar flows right to left', 'nothing moves'], a: 0,
      why: 'Solvent moves from the dilute side to the concentrated side, diluting the solution. The membrane stops the sugar.' },
    { q: '0.10 M glucose and 0.10 M sodium chloride are compared at the same temperature. The sodium chloride solution\'s osmotic pressure is…', choices: ['about the same', 'about twice as large', 'about half', 'zero, because ions cannot cross membranes'], a: 1,
      why: 'Sodium chloride gives two ions per formula unit, $i \\approx 1.9$, so about twice as many particles.' },
    { q: 'What is the osmotic pressure (in atm) of a 0.200 M glucose solution at 37 °C?', answer: 5.09, unit: 'atm',
      why: '$\\Pi = 0.200 \\times 0.08206 \\times 310.15 = 5.09$ atm.' },
    { q: 'Red blood cells placed in pure water swell and may burst.', a: true,
      why: 'Pure water is hypotonic to the cell contents, so water flows in by osmosis until the membrane gives way (haemolysis).' },
    { q: 'Why is osmotic pressure the method of choice for the molar mass of a protein?', choices: ['proteins do not freeze', 'for the same tiny molar concentration, the osmotic pressure is easy to measure while the freezing-point change is not', 'proteins react with other solvents', 'osmotic pressure does not depend on temperature'], a: 1,
      why: 'At 1 g per 100 mL a 50 000 g/mol protein gives 3.7 mmHg of osmotic pressure but only 0.0004 K of freezing-point depression.' }
  ],
  applications: ['Desalination by reverse osmosis, and water purifiers at home.', 'Intravenous fluids and dialysis.', 'Preserving food with salt and sugar.', 'Molar masses of polymers and proteins.', 'Plant turgor and water uptake by roots.'],
  history: 'Wilhelm Pfeffer measured osmotic pressures with copper ferrocyanide membranes in porous pots in 1877, and Jacobus van \'t Hoff saw in 1886 that his data obeyed the gas law — work that earned van \'t Hoff the first Nobel Prize in Chemistry, in 1901.',
  sim: 'state-osmosis'
}

);
