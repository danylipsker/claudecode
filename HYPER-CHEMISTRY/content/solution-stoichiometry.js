/* HYPER-CHEMISTRY · content/solution-stoichiometry.js — reacting amounts measured by
 * volume: molarity, dilution, and the calculations of a titration. */
Hyper.add(

{
  id: 'molarity', parent: 'solution-stoichiometry', title: 'Concentration and molarity', level: 1,
  short: 'Molarity is the amount of solute per litre of solution, c = n/V. It lets you measure out a number of particles with a pipette instead of a balance.',
  keywords: ['concentration', 'molarity', 'mol/L', 'M', 'mM', 'standard solution', 'volumetric flask', 'mass concentration', 'g/L', 'ion concentration', 'saline'],
  prereq: ['mole-concept', 'molar-mass', 'solubility'],
  related: ['dilution', 'titration-calculations', 'concentration-units', 'beer-lambert', 'reaction-stoichiometry'],
  body: `
Most reactions in laboratories, factories and cells happen in solution. There the useful question is not "how many grams?" but "how many moles are in this volume?". The **molar concentration**, or **molarity**, answers it:

$$c = \\frac{n}{V}$$

with $n$ the amount of solute in moles and $V$ the volume of the **solution** (not of the solvent) in litres. The unit is mol/L, written M: a 0.100 M solution holds 0.100 mol in every litre, 2.50 mmol in every 25.0 mL. Turned around, $n = cV$ is how a volume from a pipette or burette becomes an amount — the whole basis of [[titration-calculations|titration]].

### Making a standard solution
To make 250.0 mL of 0.100 M copper(II) sulfate from the blue pentahydrate (249.68 g/mol) you need $0.100 \\times 0.2500 \\times 249.68 = 6.242$ g.
1. Weigh the solid accurately and dissolve it in less water than you need, in a beaker.
2. Pour it into a 250 mL **volumetric flask** through a funnel, rinsing beaker, rod and funnel into the flask so that nothing is lost.
3. Add water until the bottom of the meniscus sits on the mark, viewed at eye level.
4. Stopper and invert the flask a dozen times: a solution made up to the mark is not mixed until you do.

### Ions
A salt counts its ions separately. $0.10\\ \\mathrm{M}\\ \\ce{CaCl2}$ is 0.10 M in $\\ce{Ca^2+}$ but **0.20 M** in $\\ce{Cl-}$, and 0.30 M in dissolved particles altogether — which is what matters for [[colligative-properties|freezing points]] and [[osmotic-pressure]].

### Everyday concentrations
| solution | concentration |
|---|---|
| saline drip, 0.9 % $\\ce{NaCl}$ (9.0 g/L) | 0.154 M |
| sodium in blood plasma | about 0.14 M (140 mM) |
| glucose in blood, fasting | about 5 mM (0.9 g/L) |
| sodium in seawater | about 0.47 M |
| "concentrated" hydrochloric acid, 37 % | 12 M |
| concentrated sulfuric acid, 98 % | 18.4 M |

The concentrated acids are sold by mass percentage, and converted with their density $\\rho$: $c = w\\rho/M$. For 37 % hydrochloric acid, $0.37 \\times 1180\\ \\mathrm{g/L} / 36.46\\ \\mathrm{g/mol} = 12.0$ M.

### Other ways to say "how much"
Mass concentration in g/L or mg/L is common in water analysis and medicine; for dilute water solutions 1 mg/L is 1 ppm. Molarity changes slightly with temperature, because the solution expands; when that matters (colligative properties, precise physical chemistry) chemists use molality, moles per kilogram of solvent ([[concentration-units]]).

> [!tip] Keep volumes in litres when you use $n = cV$ with M — or use millimoles and millilitres together: 0.100 M × 25.00 mL = 2.500 mmol.
`,
  ideas: [
    'Molarity c = n/V: moles of solute per litre of solution.',
    'n = cV turns a measured volume into an amount — the basis of all solution stoichiometry.',
    'Standard solutions are made up to the mark in a volumetric flask and then mixed by inversion.',
    'Each ion counts: 0.10 M $\\ce{CaCl2}$ is 0.20 M in chloride.',
    'Mass percentage and density convert to molarity: c = wρ/M.'
  ],
  pitfalls: [
    'A 1 M solution is 1 mol dissolved in 1 L of water — It is 1 mol made up to 1 L of solution. Adding a mole of solid to a litre of water gives more than a litre and a lower concentration.',
    'Mixing millilitres with mol/L — 0.100 M × 25.0 mL is 2.50 mmol, not 2.50 mol. Convert to litres, or work in mmol and mL throughout.',
    'The concentration of a salt equals that of each of its ions — Only for 1 : 1 salts. $\\ce{Na2SO4}$ at 0.050 M is 0.10 M in sodium.'
  ],
  formulas: [
    {
      name: 'Molar concentration',
      expr: 'c = n/V', tex: 'c = \\frac{n}{V}',
      vars: {
        c: { name: 'concentration', q: 'concentration', unit: 'M' },
        n: { name: 'amount of solute', q: 'amount', unit: 'mol', value: 0.0250 },
        V: { name: 'volume of solution', q: 'volume', unit: 'mL', value: 250 }
      },
      stories: {
        c: '{n} of a solute is dissolved and made up to {V}. What is the concentration?',
        n: 'What amount of acid is in {V} of a {c} solution?',
        V: 'What volume of a {c} solution contains {n} of solute?'
      }
    },
    {
      name: 'Mass of solute for a standard solution',
      expr: 'm = c*V*M', tex: 'm = c\\,V\\,M',
      vars: {
        m: { name: 'mass to weigh out', q: 'mass', unit: 'g' },
        c: { name: 'concentration wanted', q: 'concentration', unit: 'M', value: 0.100 },
        V: { name: 'volume of the flask', q: 'volume', unit: 'mL', value: 250 },
        M: { name: 'molar mass of the solid', q: 'molarmass', unit: 'g/mol', value: 249.68 }
      },
      note: 'Defaults: copper(II) sulfate pentahydrate. Use the molar mass of what is actually in the bottle, water of crystallisation included.',
      practice: { unknowns: ['m', 'c', 'V'] },
      stories: {
        m: 'What mass of a solid of molar mass {M} is needed to make {V} of a {c} solution?',
        c: '{m} of a solid of molar mass {M} is dissolved and made up to {V}. What is the concentration?',
        V: 'You have {m} of a solid of molar mass {M}. What volume of {c} solution can you make from it?'
      }
    },
    {
      name: 'Molarity from mass percentage and density',
      expr: 'c = w*rho/M', tex: 'c = \\frac{w\\,\\rho}{M}',
      vars: {
        c: { name: 'concentration', q: 'concentration', unit: 'M' },
        w: { name: 'mass fraction of solute', q: 'ratio', unit: '%', value: 37 },
        rho: { name: 'density of the solution', q: 'density', unit: 'g/mL', value: 1.18 },
        M: { name: 'molar mass of the solute', q: 'molarmass', unit: 'g/mol', value: 36.46 }
      },
      note: 'Defaults: concentrated hydrochloric acid. The same formula gives 18.4 M for 98 % sulfuric acid (1.84 g/mL) and 14.8 M for 28 % ammonia (0.90 g/mL).',
      practice: { unknowns: ['c', 'w'] },
      stories: {
        c: 'A bottle of acid is {w} by mass, with a density of {rho}; the acid has a molar mass of {M}. What is its molarity?',
        w: 'A solution of a solute of molar mass {M} is {c} and has a density of {rho}. What is the mass percentage of solute?'
      }
    }
  ],
  examples: [
    {
      title: 'A saline drip',
      q: 'Physiological saline is 0.90 % sodium chloride by mass per volume (0.90 g per 100 mL). What is its molarity, and how much salt is in a 500 mL bag?',
      steps: [
        'Per litre: 9.0 g of $\\ce{NaCl}$, $n = 9.0/58.44 = 0.154$ mol, so $c = 0.154$ M.',
        'A 500 mL bag holds 4.5 g of salt, 0.077 mol.',
        'Counting both ions, that is 0.308 M of dissolved particles — close to the particle concentration of blood plasma, which is why the drip does not make red cells swell or shrink.'
      ],
      a: '0.154 M; 4.5 g of salt per 500 mL bag.'
    },
    {
      title: 'Sodium hydroxide for the titration bench',
      q: 'How would you make 500 mL of approximately 0.1 M sodium hydroxide, and why is it only approximate?',
      steps: [
        'Mass needed: $m = 0.100 \\times 0.500 \\times 40.00 = 2.00$ g of $\\ce{NaOH}$.',
        'Sodium hydroxide pellets absorb water and carbon dioxide from the air while you weigh them, so the mass on the balance is not all $\\ce{NaOH}$.',
        'The solution is therefore made up roughly and then **standardised**: titrated against a weighed primary standard such as potassium hydrogen phthalate to find its exact concentration.'
      ],
      a: 'Dissolve about 2.0 g and make up to 500 mL; find the exact concentration by titration.'
    }
  ],
  quiz: [
    { q: 'What is the concentration of chloride ions in a 0.10 M solution of calcium chloride, $\\ce{CaCl2}$?', choices: ['0.050 M', '0.10 M', '0.20 M', '0.30 M'], a: 2,
      why: 'Each formula unit gives two chloride ions: $2 \\times 0.10 = 0.20$ M. 0.30 M is the total of all ions.' },
    { q: 'What mass of sodium hydroxide (40.00 g/mol) is needed to make 500 mL of a 0.100 M solution?', answer: 2.00, unit: 'g',
      why: '$n = cV = 0.100 \\times 0.500 = 0.0500$ mol; $m = 0.0500 \\times 40.00 = 2.00$ g.' },
    { q: 'A 1.0 M solution is made by dissolving 1.0 mol of solute in 1.0 L of water.', a: false,
      why: 'Molarity uses the volume of the solution. The solute is dissolved in less water and then made up to 1.0 L in a volumetric flask.' },
    { q: 'Which of these solutions contains the most dissolved particles per litre?', choices: ['0.10 M glucose', '0.10 M sodium chloride', '0.10 M calcium chloride', '0.10 M sucrose'], a: 2,
      why: 'Glucose and sucrose stay as molecules (0.10 M), sodium chloride gives two ions (0.20 M) and calcium chloride three (0.30 M).' },
    { q: 'What is the molarity of 25.0 mL of solution containing 0.500 g of $\\ce{NaOH}$?', answer: 0.500, unit: 'M',
      why: '$n = 0.500/40.00 = 0.0125$ mol; $c = 0.0125/0.0250 = 0.500$ M.' }
  ],
  applications: [
    'Intravenous fluids and drug infusions, prepared to exact concentrations.',
    'Clinical chemistry: blood glucose, sodium and potassium reported in mmol/L.',
    'Standard solutions for titration and for calibrating instruments.',
    'Electroplating, fertiliser and photographic baths kept within concentration limits.'
  ],
  sim: { id: 'stoich-molemap', params: { rx: 4, given: 4 } }
},

{
  id: 'dilution', parent: 'solution-stoichiometry', title: 'Dilution', level: 1,
  short: 'Adding solvent spreads the same amount of solute through a larger volume, so the concentration falls in proportion: c₁V₁ = c₂V₂.',
  keywords: ['dilution', 'c1V1 = c2V2', 'dilution factor', 'serial dilution', 'stock solution', 'aliquot', 'mixing solutions', 'add acid to water'],
  prereq: ['molarity', 'math:fractions-ratios'],
  related: ['beer-lambert', 'titration-calculations', 'concentration-units', 'math:exponential-functions'],
  body: `
Pour water into a glass of orange squash and the drink gets paler but contains exactly as much syrup as before. Dilution changes the volume, not the amount of solute:

$$n = c_1 V_1 = c_2 V_2$$

so the concentration falls in the same proportion as the volume grows. The **dilution factor** is $V_2/V_1 = c_1/c_2$: taking 10.0 mL to 100.0 mL is a tenfold dilution. Any volume unit works on both sides, as long as it is the same one.

### Doing it accurately
1. Take an **aliquot** of the stock with a pipette (for accurate work a bulb pipette, calibrated to deliver one volume).
2. Run it into a volumetric flask and make up to the mark.
3. Stopper and invert to mix.

To make 500 mL of 1.0 M sulfuric acid from the 18.4 M concentrate you need $V_1 = 1.0 \\times 500/18.4 = 27.2$ mL. And here the order matters: **always add acid to water**, slowly, with stirring. Diluting sulfuric acid releases a great deal of heat; water poured onto the dense acid floats on top, boils where they meet and spatters acid.

### Serial dilution
To go from 1 M to 1 µM in one step you would need a millionfold dilution — a microlitre in a litre. Instead, dilute tenfold six times in a row; each step is easy and accurate:

$$c_k = \\frac{c_0}{\\text{DF}^{\\,k}}$$

Serial dilutions make the **calibration standards** of spectroscopy ([[beer-lambert]]), the dilution series that let microbiologists count bacteria on a plate, and the doubling dilutions of an antibody test. Errors compound, though: a 1 % pipetting error per step becomes about 6 % after six steps.

### Diluting to measure
Instruments have a working range. A sample whose absorbance is off the top of the calibration line is diluted by a known factor, measured, and the result multiplied back up — the everyday use of dilution in an analytical laboratory. The simulation below does exactly that with an unknown that is too concentrated to measure directly.

### Mixing two solutions
Mixing two solutions of the same solute adds their amounts and their volumes:

$$c = \\frac{c_1 V_1 + c_2 V_2}{V_1 + V_2}$$

Volumes are only approximately additive: 50 mL of ethanol and 50 mL of water make about 96 mL, because the molecules pack more tightly together. For dilute water solutions the error is negligible.

> [!fact] Twelve successive hundredfold dilutions (the "12C" of homeopathy) dilute by $10^{24}$. A mole contains only $6 \\times 10^{23}$ molecules, so from even a whole mole of the starting substance, the odds are against a single molecule remaining.
`,
  ideas: [
    'Dilution keeps the amount of solute: c₁V₁ = c₂V₂.',
    'The dilution factor V₂/V₁ equals c₁/c₂; any volume unit works if both sides use it.',
    'Serial dilution reaches very low concentrations accurately in easy steps: c = c₀/DFᵏ.',
    'Samples too concentrated for an instrument are diluted by a known factor, measured and multiplied back.',
    'Always add concentrated acid to water, never water to acid.'
  ],
  pitfalls: [
    'V₂ is the volume of water added — V₂ is the final total volume. Diluting 10 mL to 100 mL adds 90 mL of water.',
    'Adding water to concentrated acid — The heat released boils the water where the two meet and spatters acid. Add the acid slowly to the water.',
    'Forgetting to multiply back — A result measured on a diluted sample must be multiplied by the dilution factor to give the concentration of the original.'
  ],
  formulas: [
    {
      name: 'Dilution',
      expr: 'c1*V1 = c2*V2', tex: 'c_1 V_1 = c_2 V_2',
      vars: {
        c1: { name: 'concentration of the stock', q: 'concentration', unit: 'M', value: 18.4 },
        V1: { name: 'volume of stock taken', q: 'volume', unit: 'mL' },
        c2: { name: 'concentration after dilution', q: 'concentration', unit: 'M', value: 1.0 },
        V2: { name: 'final volume', q: 'volume', unit: 'mL', value: 500 }
      },
      solveFor: 'V1',
      note: 'Defaults: 1.0 M sulfuric acid from the 18.4 M concentrate.',
      stories: {
        V1: 'What volume of {c1} stock is needed to make {V2} of a {c2} solution?',
        c2: '{V1} of a {c1} solution is diluted to {V2}. What is the new concentration?',
        V2: 'To what final volume must {V1} of a {c1} solution be diluted to make it {c2}?',
        c1: '{V1} of a stock solution, diluted to {V2}, gives a {c2} solution. What was the stock concentration?'
      }
    },
    {
      name: 'Serial dilution',
      expr: 'ck = c0/DF^k', tex: 'c_k = \\frac{c_0}{\\text{DF}^{\\,k}}',
      vars: {
        ck: { name: 'concentration after k steps', q: 'concentration', unit: 'µM', tex: 'c_k' },
        c0: { name: 'starting concentration', q: 'concentration', unit: 'M', value: 1.0, tex: 'c_0' },
        DF: { name: 'dilution factor of each step', value: 10, tex: '\\text{DF}' },
        k: { name: 'number of steps', int: true, value: 6, min: 1 }
      },
      note: 'Each step dilutes by the same factor, e.g. 1.0 mL made up to 10.0 mL (DF = 10) or 1 mL plus 1 mL (DF = 2).',
      practice: { unknowns: ['ck', 'c0'] },
      stories: {
        ck: 'A {c0} stock is diluted {k} times in a row, by a factor of {DF} each time. What is the final concentration?',
        c0: 'After {k} successive dilutions by a factor of {DF}, a standard is {ck}. What was the stock concentration?'
      }
    },
    {
      name: 'Mixing two solutions of the same solute',
      expr: 'c = (c1*V1 + c2*V2)/(V1 + V2)', tex: 'c = \\frac{c_1 V_1 + c_2 V_2}{V_1 + V_2}',
      vars: {
        c: { name: 'concentration of the mixture', q: 'concentration', unit: 'M' },
        c1: { name: 'concentration of solution 1', q: 'concentration', unit: 'M', value: 0.50 },
        V1: { name: 'volume of solution 1', q: 'volume', unit: 'mL', value: 100 },
        c2: { name: 'concentration of solution 2', q: 'concentration', unit: 'M', value: 0.10 },
        V2: { name: 'volume of solution 2', q: 'volume', unit: 'mL', value: 300 }
      },
      note: 'Assumes the volumes add, which is very nearly true for dilute solutions in water. With $c_2 = 0$ it is an ordinary dilution.',
      practice: { unknowns: ['c', 'V2'] },
      stories: {
        c: '{V1} of a {c1} salt solution is mixed with {V2} of a {c2} solution of the same salt. What is the concentration of the mixture?',
        V2: 'How much {c2} solution must be added to {V1} of a {c1} solution to bring it to {c}?'
      }
    }
  ],
  examples: [
    {
      title: 'Diluting concentrated acid',
      q: 'How do you make 250 mL of 1.50 M hydrochloric acid from the 12.0 M concentrate?',
      steps: [
        '$V_1 = c_2 V_2 / c_1 = 1.50 \\times 250 / 12.0 = 31.3$ mL.',
        'Put about 150 mL of water in a 250 mL volumetric flask, add the 31.3 mL of acid (in a fume cupboard: the concentrate fumes), swirl, let it cool to room temperature, then make up to the mark and invert to mix.',
        'Cooling before making up matters: warm solution occupies more volume, so a flask filled to the mark while warm ends up slightly too concentrated.'
      ],
      a: '31.3 mL of concentrate, made up to 250 mL.'
    },
    {
      title: 'Calibration standards by serial dilution',
      q: 'A 0.0100 M iron(II) stock is diluted 1 : 10 three times in succession (1.00 mL made up to 10.00 mL each time). What are the concentrations, and what error is expected if each dilution step is good to 0.6 %?',
      steps: [
        'Each step divides by 10: $1.00 \\times 10^{-3}$, $1.00 \\times 10^{-4}$ and $1.00 \\times 10^{-5}$ M (10 µM).',
        'Independent errors add in quadrature: $\\sqrt{3} \\times 0.6\\,\\% \\approx 1.0\\,\\%$ for the last standard — see [[measurement-uncertainty]].',
        'A single 1 : 1000 dilution with a 10 µL pipette would be quicker, but small pipettes are much less accurate than 1 mL ones.'
      ],
      a: '1.00 mM, 100 µM and 10.0 µM, the last good to about 1 %.'
    }
  ],
  quiz: [
    { q: 'What volume of 12.0 M hydrochloric acid is needed to make 500 mL of 0.600 M acid?', answer: 25.0, unit: 'mL',
      why: '$V_1 = c_2 V_2/c_1 = 0.600 \\times 500/12.0 = 25.0$ mL, made up to 500 mL with water.' },
    { q: '10 mL of a solution is diluted to 100 mL. What happens to the amount of solute?', choices: ['it falls to a tenth', 'it stays the same', 'it rises tenfold', 'it depends on the solvent'], a: 1,
      why: 'Only water is added; every solute particle is still there. The concentration falls to a tenth because the same amount now fills ten times the volume.' },
    { q: 'When diluting concentrated sulfuric acid, you should pour water into the acid.', a: false,
      why: 'Always add acid to water. The heat of dilution is large; water floating on the acid boils where they meet and throws out drops of acid.' },
    { q: 'A 0.50 M solution is diluted 1 : 10 three times in a row. What is the final concentration?', choices: ['0.050 M', '0.017 M', '5.0 × 10⁻⁴ M', '1.5 × 10⁻³ M'], a: 2,
      why: 'The factors multiply: $0.50/10^3 = 5.0 \\times 10^{-4}$ M.' },
    { q: 'You mix 100 mL of 0.50 M sodium chloride with 300 mL of 0.10 M sodium chloride. What is the concentration of the mixture?', answer: 0.20, unit: 'M',
      why: 'Amounts add: $0.050 + 0.030 = 0.080$ mol in 400 mL, so $0.080/0.400 = 0.20$ M.' }
  ],
  applications: [
    'Making working solutions from concentrated stocks in every laboratory and hospital pharmacy.',
    'Calibration standards for spectrophotometry, chromatography and atomic absorption.',
    'Counting bacteria and viruses by serial dilution and plating.',
    'Concentrates in industry and at home: cleaning products, cordials, fertiliser feeds, photographic developers.'
  ],
  sim: { id: 'lab-beer-lambert', params: { sample: 1 } }
},

{
  id: 'titration-calculations', parent: 'solution-stoichiometry', title: 'Titration calculations', level: 2,
  short: 'A titration finds an unknown concentration by measuring the volume of a standard solution that reacts with it exactly; the balanced equation turns that volume into the amount of analyte.',
  keywords: ['titration', 'burette', 'pipette', 'titre', 'end point', 'equivalence point', 'primary standard', 'standardisation', 'back titration', 'concordant titres', 'redox titration', 'permanganate'],
  prereq: ['molarity', 'reaction-stoichiometry', 'limiting-reagent'],
  related: ['titration-curves', 'indicators', 'balancing-redox', 'measurement-uncertainty', 'dilution'],
  body: `
In a **titration** a solution of accurately known concentration, the **titrant**, is run from a burette into a measured volume of the unknown, the **analyte**, until the two have reacted exactly. At that moment — the **equivalence point** — the amounts are in the ratio of the balanced equation, and the unknown follows from volumes alone. It is fast, cheap, and routinely accurate to a few parts per thousand.

### The calculation
For $a\\,\\text{A} + b\\,\\text{B} \\to$ products, with B the titrant, at equivalence

$$\\frac{n_A}{a} = \\frac{n_B}{b} \\quad\\Rightarrow\\quad c_A = \\frac{c_B V_B}{V_A}\\cdot\\frac{a}{b}$$

It is always the same chain: titre × concentration gives the amount of titrant; the equation's ratio gives the amount of analyte; divide by the aliquot volume; then scale back up for any dilution made before titrating.

### End point and equivalence point
The **equivalence point** is the chemistry: exactly enough titrant has been added. The **end point** is what you see: the indicator changes colour. A good titration chooses an indicator whose colour change falls at the equivalence point — phenolphthalein for a weak acid with a strong base, methyl orange for a weak base with a strong acid ([[indicators]], [[titration-curves]]).

### Standards
The titrant's concentration must itself be known. A **primary standard** is a solid pure and stable enough to be weighed out directly: potassium hydrogen phthalate ($\\ce{KHC8H4O4}$, 204.22 g/mol) for bases, anhydrous sodium carbonate for acids. Sodium hydroxide is not one — its pellets take up water and carbon dioxide from the air — so its solution is **standardised** by titrating a weighed amount of the phthalate.

### Good practice
- Rinse the burette with titrant and the pipette with analyte, so that leftover water does not dilute them. The conical flask can be wet: water there adds no analyte.
- Read the bottom of the meniscus at eye level; a burette is read to the nearest 0.05 mL.
- Do a quick rough titration, then careful ones adding dropwise near the end, until two or three titres agree within 0.10 mL (**concordant**). Average only those.

### Not only acids and bases
- **Redox**: purple permanganate is decolourised by iron(II) until the first excess drop leaves the flask pink — it is its own indicator: $\\ce{MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O}$.
- **Iodometry**: iodine titrated with thiosulfate, with starch turning blue-black at the end — used for chlorine in bleach and dissolved oxygen in water.
- **Precipitation**: chloride with silver nitrate.
- **Complexometric**: calcium and magnesium with EDTA — the standard test for water hardness.

### Back titration
When the analyte is an insoluble solid or reacts slowly, add a known **excess** of reagent, let it react completely, and titrate what is left. The analyte used the difference. Chalk, limestone and antacid tablets are analysed this way.
`,
  ideas: [
    'At the equivalence point the amounts of analyte and titrant are in the ratio of the balanced equation.',
    'n = cV for the titrant, × the mole ratio, ÷ the aliquot volume, × any dilution factor.',
    'The end point (indicator change) should coincide with the equivalence point.',
    'Titrants are standardised against primary standards weighed out directly.',
    'Back titration measures what is left of a known excess.'
  ],
  pitfalls: [
    'Ignoring the mole ratio — Sulfuric acid needs two moles of sodium hydroxide per mole. Using 1 : 1 doubles the answer.',
    'The end point is the equivalence point — The end point is where the indicator changes; a badly chosen indicator changes well before or after equivalence.',
    'Rinsing the conical flask with the analyte — That adds extra analyte. Rinse it with water; rinse the burette and pipette with their own solutions.'
  ],
  formulas: [
    {
      name: 'Concentration from a titre',
      expr: 'cA = cB*VB*a/(b*VA)', tex: 'c_A = \\frac{c_B\\,V_B}{V_A}\\cdot\\frac{a}{b}',
      vars: {
        cA: { name: 'concentration of the analyte', q: 'concentration', unit: 'M', tex: 'c_A' },
        cB: { name: 'concentration of the titrant', q: 'concentration', unit: 'M', value: 0.1000, tex: 'c_B' },
        VB: { name: 'titre (volume of titrant used)', q: 'volume', unit: 'mL', value: 21.35, tex: 'V_B' },
        VA: { name: 'volume of analyte (aliquot)', q: 'volume', unit: 'mL', value: 25.00, tex: 'V_A' },
        a: { name: 'coefficient of the analyte', int: true, fixed: true, value: 1 },
        b: { name: 'coefficient of the titrant', int: true, fixed: true, value: 2 }
      },
      note: 'Defaults: sulfuric acid titrated with sodium hydroxide, $\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$.',
      practice: { unknowns: ['cA', 'VB'] },
      stories: {
        cA: 'A {VA} aliquot of sulfuric acid needs {VB} of {cB} sodium hydroxide to neutralise it ($\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$). What is the concentration of the acid?',
        VB: 'What volume of {cB} sodium hydroxide will neutralise {VA} of {cA} sulfuric acid ($\\ce{H2SO4 + 2NaOH -> Na2SO4 + 2H2O}$)?'
      }
    },
    {
      name: 'Standardising a titrant with a primary standard',
      expr: 'c = m/(M*V)', tex: 'c = \\frac{m}{M\\,V}',
      vars: {
        c: { name: 'concentration of the titrant', q: 'concentration', unit: 'M' },
        m: { name: 'mass of primary standard weighed', q: 'mass', unit: 'g', value: 0.5105 },
        M: { name: 'molar mass of the standard', q: 'molarmass', unit: 'g/mol', value: 204.22, fixed: true },
        V: { name: 'titre', q: 'volume', unit: 'mL', value: 25.00 }
      },
      note: 'For a standard that reacts 1 : 1 with the titrant, such as potassium hydrogen phthalate with sodium hydroxide (the defaults).',
      practice: { unknowns: ['c', 'm'] },
      stories: {
        c: '{m} of potassium hydrogen phthalate ($M$ = {M}) needs {V} of sodium hydroxide solution to neutralise it. What is the exact concentration of the sodium hydroxide?',
        m: 'What mass of potassium hydrogen phthalate ($M$ = {M}) should you weigh so that about {c} sodium hydroxide gives a titre of {V}?'
      }
    },
    {
      name: 'Back titration of a carbonate',
      expr: 'mX = (cA*VA - cB*VB)/k*MX', tex: 'm_X = \\frac{c_A V_A - c_B V_B}{k}\\,M_X',
      vars: {
        mX: { name: 'mass of carbonate in the sample', q: 'mass', unit: 'mg', tex: 'm_X' },
        cA: { name: 'concentration of the acid added', q: 'concentration', unit: 'M', value: 0.500, tex: 'c_A' },
        VA: { name: 'volume of acid added', q: 'volume', unit: 'mL', value: 50.00, tex: 'V_A' },
        cB: { name: 'concentration of the base used to titrate the excess', q: 'concentration', unit: 'M', value: 0.500, tex: 'c_B' },
        VB: { name: 'titre of base', q: 'volume', unit: 'mL', value: 20.02, tex: 'V_B' },
        k: { name: 'moles of acid per mole of carbonate', int: true, fixed: true, value: 2 },
        MX: { name: 'molar mass of the carbonate', q: 'molarmass', unit: 'g/mol', value: 100.086, fixed: true, tex: 'M_X' }
      },
      note: 'Hydrochloric acid in known excess dissolves calcium carbonate, $\\ce{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}$; the acid left over is titrated with sodium hydroxide (1 : 1). The difference reacted with the carbonate.',
      practice: { unknowns: ['mX', 'VB'] },
      stories: {
        mX: 'An antacid tablet is dissolved in {VA} of {cA} hydrochloric acid. The excess acid needs {VB} of {cB} sodium hydroxide. What mass of calcium carbonate ($M$ = {MX}) did the tablet contain?',
        VB: 'A tablet containing {mX} of calcium carbonate ($M$ = {MX}) is dissolved in {VA} of {cA} hydrochloric acid. What titre of {cB} sodium hydroxide will the excess acid need?'
      }
    }
  ],
  examples: [
    {
      title: 'How strong is vinegar?',
      q: '10.00 mL of vinegar is diluted to 100.0 mL. A 25.00 mL aliquot of the diluted solution needs 20.85 mL of 0.1000 M sodium hydroxide (phenolphthalein). What is the concentration of ethanoic acid in the vinegar, in mol/L and g/L?',
      steps: [
        '$\\ce{CH3COOH + NaOH -> CH3COONa + H2O}$ is 1 : 1.',
        'Titrant: $n = 0.1000 \\times 0.020\\,85 = 2.085 \\times 10^{-3}$ mol, so the aliquot contained $2.085$ mmol of acid.',
        'Diluted solution: $c = 2.085\\ \\mathrm{mmol}/25.00\\ \\mathrm{mL} = 0.083\\,40$ M.',
        'Undo the tenfold dilution: vinegar is $0.8340$ M. In mass: $0.8340 \\times 60.05 = 50.1$ g/L — the "5 % acidity" printed on the bottle.'
      ],
      a: '0.834 M ethanoic acid, 50.1 g/L.'
    },
    {
      title: 'Iron in a supplement tablet',
      q: 'An iron tablet is dissolved in dilute sulfuric acid and titrated with 0.0200 M potassium permanganate; the first permanent pink appears after 11.20 mL. What mass of iron does the tablet contain?',
      steps: [
        '$\\ce{MnO4- + 5Fe^2+ + 8H+ -> Mn^2+ + 5Fe^3+ + 4H2O}$: each permanganate oxidises five iron(II) ions.',
        '$n(\\ce{MnO4-}) = 0.0200 \\times 0.011\\,20 = 2.24 \\times 10^{-4}$ mol, so $n(\\ce{Fe^2+}) = 5 \\times 2.24 \\times 10^{-4} = 1.12 \\times 10^{-3}$ mol.',
        'Mass: $1.12 \\times 10^{-3} \\times 55.845 = 0.0625$ g $= 62.5$ mg of iron — close to the 65 mg in a standard ferrous sulfate tablet.'
      ],
      a: 'About 62.5 mg of iron.'
    },
    {
      title: 'An antacid by back titration',
      q: 'A calcium carbonate antacid tablet is dissolved in 50.00 mL of 0.500 M hydrochloric acid. The excess acid needs 20.02 mL of 0.500 M sodium hydroxide. How much calcium carbonate is in the tablet?',
      steps: [
        'Acid added: $0.500 \\times 50.00 = 25.00$ mmol. Acid left over: $0.500 \\times 20.02 = 10.01$ mmol.',
        'Acid used by the carbonate: $25.00 - 10.01 = 14.99$ mmol.',
        '$\\ce{CaCO3 + 2HCl -> CaCl2 + H2O + CO2}$: $n(\\ce{CaCO3}) = 14.99/2 = 7.495$ mmol, $m = 7.495 \\times 100.09 = 750$ mg.'
      ],
      a: '750 mg of calcium carbonate.'
    }
  ],
  quiz: [
    { q: '25.00 mL of hydrochloric acid is neutralised by 18.50 mL of 0.1000 M sodium hydroxide. What is the concentration of the acid?', answer: 0.0740, unit: 'M',
      why: '1 : 1 reaction: $c = 0.1000 \\times 18.50/25.00 = 0.0740$ M.' },
    { q: 'What volume of 0.100 M sodium hydroxide neutralises 25.0 mL of 0.0500 M sulfuric acid?', choices: ['12.5 mL', '25.0 mL', '50.0 mL', '6.25 mL'], a: 1,
      why: 'The acid holds $1.25$ mmol of $\\ce{H2SO4}$, which needs $2 \\times 1.25 = 2.50$ mmol of $\\ce{NaOH}$: $2.50/0.100 = 25.0$ mL. Forgetting the 2 gives 12.5 mL.' },
    { q: 'A student rinses the conical flask with distilled water before pipetting in the analyte, and does not dry it. What effect does this have on the titre?', choices: ['it increases the titre', 'it decreases the titre', 'no effect', 'it makes the end point impossible to see'], a: 2,
      why: 'The amount of analyte is fixed by the pipette. Extra water dilutes it but does not change the number of moles, and the titre depends only on moles.' },
    { q: 'The end point and the equivalence point of a titration are, by definition, the same thing.', a: false,
      why: 'The equivalence point is where the amounts match the equation; the end point is where the indicator changes. A well-chosen indicator makes them agree within a drop.' },
    { q: 'Why is sodium hydroxide not used as a primary standard?', choices: ['it is too expensive', 'it absorbs water and carbon dioxide from the air, so its mass is unreliable', 'it does not dissolve completely', 'it reacts too slowly with acids'], a: 1,
      why: 'Solid sodium hydroxide is hygroscopic and reacts with atmospheric $\\ce{CO2}$ to form carbonate, so a weighed mass does not correspond to a known amount. Its solutions are standardised by titration instead.' }
  ],
  applications: [
    'Quality control of foods and drinks: acidity of vinegar, wine and fruit juice; vitamin C content.',
    'Water testing: hardness by EDTA, chloride by silver nitrate, dissolved oxygen by iodometry.',
    'Pharmaceutical assays of active ingredients and of antacids.',
    'Biodiesel production, where the free acid in used cooking oil is titrated to decide how much catalyst to add.'
  ],
  history: 'Titration grew up in the French bleach and soda industries around 1800. Joseph Louis Gay-Lussac refined the burette in the 1820s, and Karl Friedrich Mohr\'s 1855 textbook — together with his burette with a pinch-clamp tap — made titrimetric analysis a standard laboratory method.',
  sim: 'stoich-titration'
}

);
