/* HYPER-CHEMISTRY · content/analysis.js — methods of analysis: measurement and its
 * uncertainty, gravimetry, the Beer–Lambert law, IR, NMR and mass spectrometry, and
 * chromatography. */
Hyper.add(

{
  id: 'measurement-uncertainty', parent: 'analysis', title: 'Measurement, uncertainty and significant figures', level: 1,
  short: 'Every measured number is an estimate. Reporting it properly means saying how far to trust it: significant figures, the difference between accuracy and precision, and how uncertainties combine in a calculation.',
  keywords: ['uncertainty', 'error', 'significant figures', 'accuracy', 'precision', 'random error', 'systematic error', 'percentage uncertainty', 'propagation of errors', 'standard deviation', 'standard error', 'glassware tolerance'],
  prereq: ['math:scientific-notation', 'math:standard-deviation'],
  related: ['titration-calculations', 'gravimetric-analysis', 'beer-lambert', 'math:error-propagation', 'math:normal-distribution'],
  body: `
A burette reading of 23.45 mL does not mean exactly 23.45 mL; it means "somewhere near 23.45, give or take a few hundredths". A result without an idea of its uncertainty cannot be compared with anything — not with a legal limit, a specification or another laboratory's value. Analytical chemistry is largely the art of knowing how good a number is.

### Accuracy and precision
Think of darts. **Precision** is how tightly the darts cluster; **accuracy** is how close they land to the bull's-eye.
- **Random errors** scatter results both ways: the last digit of a reading, the size of the final drop, electrical noise. They show up as poor precision, and averaging repeats reduces them.
- **Systematic errors** push every result the same way: a pipette that delivers 24.95 mL instead of 25.00, reading the top of the meniscus, a primary standard that has absorbed water, an indicator that changes too early. The results can be beautifully precise and still wrong, and averaging does not help. They are found by analysing a certified reference material or by using a second, independent method.

### Significant figures
The digits you write should carry the precision and no more.
- Non-zero digits count, and so do zeros between them; leading zeros do not: 0.003 40 has three significant figures. Trailing zeros after a decimal point do count: 25.00 mL has four.
- **Multiplying or dividing**: keep as many significant figures as the least precise factor. $12.45\\ \\mathrm{g} / 4.6\\ \\mathrm{mL} = 2.7\\ \\mathrm{g/mL}$, not 2.706 521.
- **Adding or subtracting**: keep as many decimal places as the least precise term. $25.00\\ \\mathrm{mL} + 0.3\\ \\mathrm{mL} = 25.3\\ \\mathrm{mL}$.
- Exact numbers — coefficients in equations, the 2 in $\\ce{H2}$, defined constants such as $N_A$ — never limit the result. Carry an extra digit through a calculation and round only at the end.

### Glassware and balances
| instrument | typical uncertainty |
|---|---|
| analytical balance | ±0.0001 g per reading |
| 50 mL burette | ±0.05 mL per reading |
| 25 mL bulb pipette (class A) | ±0.03 mL |
| 250 mL volumetric flask (class A) | ±0.12 mL |
| 100 mL measuring cylinder | ±0.5 mL |
| beaker graduations | ±5 % — for rough work only |

### How uncertainties combine
For independent errors:
- In a **sum or difference**, absolute uncertainties add in quadrature: $u = \\sqrt{u_1^2 + u_2^2}$. A titre is the difference of two burette readings, so ±0.05 mL at each end gives ±0.07 mL.
- In a **product or quotient**, relative (percentage) uncertainties add in quadrature: $r = \\sqrt{r_1^2 + r_2^2 + \\dots}$.
- Simply adding them instead gives a cautious worst case, which is what many school syllabuses ask for.

The largest term dominates: improve that one first. This is why titrations are designed for titres of 20–25 mL rather than 5 mL — the same ±0.07 mL is a quarter of the percentage. The general rules are in [[math:error-propagation|propagation of uncertainty]].

### Repeats
The mean of $N$ repeats scatters less than a single result: its **standard error** is $s/\\sqrt N$, with $s$ the [[math:standard-deviation|standard deviation]]. Four titres of 23.45, 23.40, 23.50 and 23.45 mL have a mean of 23.45 mL, $s = 0.041$ mL and a standard error of 0.020 mL. Beyond a handful of repeats the gain is slow: halving the error takes four times as many measurements.
`,
  ideas: [
    'Accuracy is closeness to the true value; precision is closeness of repeats to one another.',
    'Random errors scatter and average out; systematic errors shift every result and do not.',
    'Significant figures carry the precision: × and ÷ keep the fewest significant figures, + and − the fewest decimal places.',
    'Absolute uncertainties combine for sums and differences, relative ones for products and quotients — in quadrature for independent errors.',
    'The mean of N repeats has a standard error s/√N.'
  ],
  pitfalls: [
    'More digits make a better answer — Digits beyond the precision of the data are noise. Copying eight figures from a calculator claims an accuracy nobody measured.',
    'Precise means accurate — Tightly clustered results can all be wrong by the same amount if there is a systematic error.',
    'Repeating a measurement removes all errors — Averaging reduces random error only. A miscalibrated pipette gives the same wrong volume every time.'
  ],
  formulas: [
    {
      name: 'Percentage uncertainty',
      expr: 'p = u/x', tex: 'p = \\frac{u}{x}',
      vars: {
        p: { name: 'percentage (relative) uncertainty', q: 'ratio', unit: '%' },
        u: { name: 'absolute uncertainty', q: 'volume', unit: 'mL', value: 0.10 },
        x: { name: 'measured value', q: 'volume', unit: 'mL', value: 23.45 }
      },
      note: 'Defaults: a titre with a worst-case ±0.10 mL from two burette readings. The same formula works for any quantity, as long as $u$ and $x$ share a unit.',
      stories: {
        p: 'A titre of {x} is uncertain by ±{u}. What is its percentage uncertainty?',
        x: 'Each titre is uncertain by ±{u}. How large must the titre be for the percentage uncertainty to be {p}?'
      }
    },
    {
      name: 'Uncertainty of a difference (or a sum)',
      expr: 'u = sqrt(u1^2 + u2^2)', tex: 'u = \\sqrt{u_1^2 + u_2^2}',
      vars: {
        u: { name: 'uncertainty of the difference', q: 'volume', unit: 'mL' },
        u1: { name: 'uncertainty of the first reading', q: 'volume', unit: 'mL', value: 0.05 },
        u2: { name: 'uncertainty of the second reading', q: 'volume', unit: 'mL', value: 0.05 }
      },
      note: 'For independent errors. A titre (final minus initial reading) or a mass by difference (two weighings) combine this way.',
      stories: {
        u: 'A burette is read to ±{u1} at the start and ±{u2} at the end. What is the uncertainty of the titre?',
        u2: 'A mass by difference must be good to ±{u}. The first weighing is good to ±{u1}. How good must the second be?'
      }
    },
    {
      name: 'Relative uncertainty of a product or quotient',
      expr: 'r = sqrt(r1^2 + r2^2 + r3^2)', tex: 'r = \\sqrt{r_1^2 + r_2^2 + r_3^2}',
      vars: {
        r: { name: 'relative uncertainty of the result', q: 'ratio', unit: '%' },
        r1: { name: 'relative uncertainty of the first factor', q: 'ratio', unit: '%', value: 0.04 },
        r2: { name: 'relative uncertainty of the second factor', q: 'ratio', unit: '%', value: 0.06 },
        r3: { name: 'relative uncertainty of the third factor', q: 'ratio', unit: '%', value: 0.30 }
      },
      note: 'For a result such as $c = m/(MV)$ with independent errors in each factor. The largest term dominates: here the titre.',
      practice: { unknowns: ['r', 'r3'] },
      stories: {
        r: 'A concentration is calculated from a mass (±{r1}), a flask volume (±{r2}) and a titre (±{r3}). What is its relative uncertainty?',
        r3: 'A result must be good to ±{r}. Two of its three factors are uncertain by {r1} and {r2}. What is the largest uncertainty the third may have?'
      }
    },
    {
      name: 'Standard error of a mean',
      expr: 'se = s/sqrt(N)', tex: 's_{\\bar x} = \\frac{s}{\\sqrt{N}}',
      vars: {
        se: { name: 'standard error of the mean', q: 'volume', unit: 'mL', tex: 's_{\\bar x}' },
        s: { name: 'standard deviation of single results', q: 'volume', unit: 'mL', value: 0.041 },
        N: { name: 'number of repeats', int: true, value: 4, min: 1 }
      },
      note: 'Random errors only. Halving the standard error needs four times as many repeats.',
      practice: { unknowns: ['se', 'N'] },
      stories: {
        se: 'Titres scatter with a standard deviation of {s}. What is the standard error of the mean of {N} titres?',
        N: 'Single titres scatter by {s}. How many must be averaged for a standard error of {se}?'
      }
    }
  ],
  examples: [
    {
      title: 'How good is a standardised sodium hydroxide?',
      q: '0.5105 g of potassium hydrogen phthalate (weighed by difference, ±0.0001 g per weighing) needs a titre of 25.00 mL (±0.05 mL per burette reading) of sodium hydroxide. The concentration works out at 0.1000 M. What is its uncertainty?',
      steps: [
        'Mass by difference: $u = \\sqrt{0.0001^2 + 0.0001^2} = 0.000\\,14$ g, relative $0.000\\,14/0.5105 = 0.028\\,\\%$.',
        'Titre: $u = \\sqrt{0.05^2 + 0.05^2} = 0.071$ mL, relative $0.071/25.00 = 0.28\\,\\%$.',
        'Combined for the quotient: $r = \\sqrt{0.028^2 + 0.28^2} = 0.28\\,\\%$ — the burette completely dominates; the balance hardly matters.',
        '$0.28\\,\\%$ of 0.1000 M is 0.0003 M.'
      ],
      a: '0.1000 ± 0.0003 M.'
    },
    {
      title: 'Significant figures in a density',
      q: 'An aluminium block of mass 12.45 g displaces 4.6 mL of water in a measuring cylinder. Report its density.',
      steps: [
        '$\\rho = 12.45/4.6 = 2.7065...$ on the calculator.',
        'The volume has only two significant figures, so the density does too: $\\rho = 2.7\\ \\mathrm{g/mL}$.',
        'The table value for aluminium, 2.70 g/mL, agrees within the precision of the measurement — a more precise volume would be needed to tell aluminium from a light alloy.'
      ],
      a: '2.7 g/mL'
    }
  ],
  quiz: [
    { q: 'How many significant figures are there in 0.003 040 g?', answer: 4,
      why: 'Leading zeros only place the decimal point. The digits 3, 0, 4 and the final 0 (after the decimal point) are significant: four.' },
    { q: 'Five results cluster tightly, but all are 2 % above the certified value of a reference material. The method is…', choices: ['accurate and precise', 'precise but not accurate', 'accurate but not precise', 'neither accurate nor precise'], a: 1,
      why: 'The small scatter means good precision; the consistent offset is a systematic error, so the method is not accurate.' },
    { q: 'Averaging many repeated measurements removes systematic error.', a: false,
      why: 'A systematic error shifts every result the same way, so it survives averaging. Only random errors average out.' },
    { q: 'Why is a titre of about 25 mL better than one of about 12.5 mL with the same burette?', choices: ['the indicator works better', 'the same absolute uncertainty is a smaller percentage', 'the reaction goes to completion', 'fewer drops are needed'], a: 1,
      why: 'Each reading is ±0.05 mL whatever the titre. On 25 mL that is half the percentage uncertainty it is on 12.5 mL.' },
    { q: 'Calculate $3.45 \\times 2.1$ to the correct number of significant figures.', choices: ['7.245', '7.25', '7.2', '7'], a: 2,
      why: '2.1 has two significant figures, so the product has two: 7.2.' }
  ],
  applications: [
    'Deciding whether a drinking-water sample really exceeds a legal limit.',
    'Pharmaceutical release testing, where a batch must lie within a specification with stated confidence.',
    'Accreditation of laboratories, which must quote an uncertainty with every result.',
    'Engineering tolerances and metrology: the same rules apply to lengths, masses and voltages.'
  ]
},

{
  id: 'gravimetric-analysis', parent: 'analysis', title: 'Gravimetric analysis', level: 2,
  short: 'Measuring an element or ion by turning it into a pure compound of known formula — usually an insoluble precipitate — and weighing it.',
  keywords: ['gravimetric analysis', 'gravimetry', 'precipitate', 'gravimetric factor', 'constant mass', 'digestion', 'co-precipitation', 'barium sulfate', 'silver chloride', 'water of crystallisation', 'thermogravimetric analysis', 'TGA'],
  prereq: ['percent-composition', 'precipitation', 'reaction-stoichiometry'],
  related: ['solubility-product', 'common-ion-effect', 'measurement-uncertainty', 'empirical-formula'],
  body: `
The balance is the most accurate instrument in the chemistry laboratory: an ordinary analytical balance reads 0.1 mg in 100 g, one part in a million. Gravimetric analysis puts that accuracy to work. The analyte is converted completely into a compound of exactly known formula, separated, dried and weighed; its mass then follows from stoichiometry. It is slow, but it needs no calibration — which is why atomic masses themselves were measured this way.

### The steps
1. **Weigh and dissolve** the sample.
2. **Precipitate** the analyte with an excess of reagent: sulfate with barium chloride, chloride with silver nitrate, nickel with dimethylglyoxime, calcium with ammonium oxalate. The excess drives precipitation towards completion through the [[common-ion-effect]].
3. **Digest**: keep the precipitate warm in its own solution for an hour or so. Small crystals dissolve and larger ones grow, trapping fewer impurities and filtering more easily.
4. **Filter and wash**, through a sintered-glass crucible or ashless filter paper.
5. **Dry or ignite** to a form of fixed composition, cool in a desiccator, weigh, and repeat heating until two weighings agree within a few tenths of a milligram — **constant mass**.

### The calculation
The mass of analyte per gram of precipitate is the **gravimetric factor**:

$$\\text{GF} = \\frac{k\\,M(\\text{analyte})}{M(\\text{precipitate})}$$

with $k$ the number of analyte units in one formula of precipitate. Chloride weighed as silver chloride: $35.45/143.32 = 0.2473$. Nickel weighed as its dimethylglyoxime complex, $\\ce{Ni(C4H7N2O2)2}$: $58.69/288.92 = 0.2031$ — five times the mass of the nickel itself, which makes small amounts easy to weigh. The mass fraction in the sample is $w = m_\\text{precipitate} \\times \\text{GF} / m_\\text{sample}$.

### What makes a good precipitate
- **Very low solubility** (a small [[solubility-product]]), so that almost nothing is left behind.
- **Purity**: ions adsorbed on the surface or trapped inside (co-precipitation) add false mass. Digestion, washing and, if needed, dissolving and precipitating again reduce them.
- **A known, stable composition after drying.** Some precipitates are ignited to a better weighing form: iron(III) hydroxide to $\\ce{Fe2O3}$, calcium oxalate to $\\ce{CaO}$.
- **Crystals large enough to filter.** Colloidal precipitates such as silver chloride are washed with dilute nitric acid rather than pure water, which would disperse them through the filter.

### Weighing what leaves
Heating can also drive something **off**: water of crystallisation from a hydrate, moisture from a food sample, carbon dioxide from a carbonate. Combustion analysis traps and weighs the $\\ce{CO2}$ and $\\ce{H2O}$ formed ([[empirical-formula]]). **Thermogravimetric analysis** (TGA) weighs a sample continuously while heating it: calcium oxalate monohydrate loses its water below about 200 °C (falling to 87.7 % of its mass), carbon monoxide near 500 °C (to $\\ce{CaCO3}$, 68.5 %) and carbon dioxide near 800 °C (to $\\ce{CaO}$, 38.4 %) — three clean steps. TGA measures the filler in plastics, the solvent in drug crystals and the ash in coal.
`,
  ideas: [
    'Convert the analyte completely into a pure compound of known formula, and weigh it.',
    'Gravimetric factor = k × M(analyte) / M(precipitate): grams of analyte per gram of precipitate.',
    'A good precipitate is very insoluble, pure, filterable and of fixed composition when dry.',
    'Heat and weigh repeatedly until the mass is constant.',
    'Volatilisation methods weigh what is driven off: water, carbon dioxide, or the steps of a TGA curve.'
  ],
  pitfalls: [
    'Weighing a warm crucible — Convection currents lift it and it takes up moisture as it cools, so the reading drifts. Cool it in a desiccator first.',
    'Forgetting how many analyte units the precipitate contains — $\\ce{Fe2O3}$ holds two iron atoms: the factor is $2 \\times 55.85/159.69$, not $55.85/159.69$.',
    'Stopping before constant mass — A precipitate still holding water weighs too much and gives a result that is too high.'
  ],
  formulas: [
    {
      name: 'Mass percentage from a weighed precipitate',
      expr: 'w = mP*k*MA/(MP*ms)', tex: 'w = \\frac{m_P\\,k\\,M_A}{M_P\\,m_s}',
      vars: {
        w: { name: 'mass fraction of the analyte in the sample', q: 'ratio', unit: '%' },
        mP: { name: 'mass of precipitate', q: 'mass', unit: 'g', value: 0.8390, tex: 'm_P' },
        k: { name: 'analyte units per formula of precipitate', int: true, fixed: true, value: 1 },
        MA: { name: 'molar mass of the analyte', q: 'molarmass', unit: 'g/mol', value: 96.06, fixed: true, tex: 'M_A' },
        MP: { name: 'molar mass of the precipitate', q: 'molarmass', unit: 'g/mol', value: 233.39, fixed: true, tex: 'M_P' },
        ms: { name: 'mass of sample', q: 'mass', unit: 'g', value: 0.5000, tex: 'm_s' }
      },
      note: 'Defaults: sulfate ($\\ce{SO4^2-}$, 96.06 g/mol) weighed as barium sulfate (233.39 g/mol). The factor $k M_A/M_P$ is the gravimetric factor.',
      practice: { unknowns: ['w', 'mP'] },
      stories: {
        w: 'A {ms} sample of fertiliser gives {mP} of barium sulfate ($M$ = {MP}). What is the percentage of sulfate ($M$ = {MA}) in the fertiliser?',
        mP: 'A {ms} sample is {w} sulfate ($M$ = {MA}). What mass of barium sulfate ($M$ = {MP}) should precipitate?'
      }
    },
    {
      name: 'Water of crystallisation',
      expr: 'x = (mh - ma)*MA/(ma*MW)', tex: 'x = \\frac{(m_h - m_a)\\,M_a}{m_a\\,M_{\\ce{H2O}}}',
      vars: {
        x: { name: 'molecules of water per formula unit' },
        mh: { name: 'mass of hydrate before heating', q: 'mass', unit: 'g', value: 2.465, tex: 'm_h' },
        ma: { name: 'mass of anhydrous salt after heating', q: 'mass', unit: 'g', value: 1.204, tex: 'm_a' },
        MA: { name: 'molar mass of the anhydrous salt', q: 'molarmass', unit: 'g/mol', value: 120.36, fixed: true, tex: 'M_a' },
        MW: { name: 'molar mass of water', q: 'molarmass', unit: 'g/mol', value: 18.015, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: 'Moles of water lost divided by moles of anhydrous salt left. Defaults: Epsom salt, $\\ce{MgSO4.xH2O}$. Round to the nearest whole number only if the result is close to one.',
      practice: { unknowns: ['x', 'ma'] },
      stories: {
        x: '{mh} of hydrated magnesium sulfate is heated to constant mass, leaving {ma} of the anhydrous salt ($M$ = {MA}). How many molecules of water are there per formula unit?',
        ma: 'A hydrate $\\ce{MgSO4.xH2O}$ with x = {x} weighs {mh}. What mass of anhydrous salt ($M$ = {MA}) remains after heating?'
      }
    }
  ],
  examples: [
    {
      title: 'Sulfate in a fertiliser',
      q: 'A 0.5000 g sample of ammonium sulfate fertiliser is dissolved and treated with excess barium chloride. The dried barium sulfate weighs 0.8390 g. What is the percentage of sulfate, and of ammonium sulfate, in the fertiliser?',
      steps: [
        '$\\ce{Ba^2+ + SO4^2- -> BaSO4}$: $n(\\ce{BaSO4}) = 0.8390/233.39 = 3.595 \\times 10^{-3}$ mol.',
        'Sulfate: $3.595 \\times 10^{-3} \\times 96.06 = 0.3453$ g, so $0.3453/0.5000 = 69.1\\,\\%$.',
        'If all the sulfate is ammonium sulfate (132.13 g/mol): $3.595 \\times 10^{-3} \\times 132.13 = 0.4750$ g, or 95.0 % of the sample.'
      ],
      a: '69.1 % sulfate, corresponding to 95.0 % ammonium sulfate.'
    },
    {
      title: 'How much water in Epsom salt?',
      q: '2.465 g of hydrated magnesium sulfate, $\\ce{MgSO4.xH2O}$, is heated to constant mass, leaving 1.204 g of anhydrous $\\ce{MgSO4}$ (120.36 g/mol). Find x.',
      steps: [
        'Water lost: $2.465 - 1.204 = 1.261$ g, or $1.261/18.015 = 0.070\\,00$ mol.',
        'Anhydrous salt: $1.204/120.36 = 0.010\\,00$ mol.',
        'Ratio: $0.070\\,00/0.010\\,00 = 7.00$, so the formula is $\\ce{MgSO4.7H2O}$.'
      ],
      a: 'x = 7: $\\ce{MgSO4.7H2O}$.'
    },
    {
      title: 'Nickel in a steel',
      q: 'A 1.000 g steel sample is dissolved and the nickel precipitated with dimethylglyoxime. The red complex, $\\ce{Ni(C4H7N2O2)2}$ (288.92 g/mol), weighs 0.2340 g. What is the nickel content?',
      steps: [
        'Gravimetric factor: $58.69/288.92 = 0.2031$.',
        'Nickel: $0.2340 \\times 0.2031 = 0.047\\,54$ g, i.e. 4.75 % of the steel.'
      ],
      a: '4.75 % nickel.'
    }
  ],
  quiz: [
    { q: 'Why is a precipitate digested — kept warm in its own solution — before it is filtered?', choices: ['to dissolve it completely', 'so that small crystals dissolve and larger, purer ones grow', 'to drive off water of crystallisation', 'to speed up the reaction with the reagent'], a: 1,
      why: 'Small crystals are more soluble than large ones, so during digestion they dissolve and redeposit on the larger crystals. The result filters more easily and traps fewer impurities.' },
    { q: 'A chloride sample gives 0.4302 g of silver chloride (143.32 g/mol). What mass of chloride did it contain?', answer: 0.1064, unit: 'g',
      why: '$0.4302 \\times 35.45/143.32 = 0.1064$ g.' },
    { q: 'A precipitate that was not dried completely gives a result that is too high.', a: true,
      why: 'The water adds mass that is counted as precipitate, so the calculated amount of analyte is too large.' },
    { q: 'Why is barium chloride added in excess when sulfate is precipitated?', choices: ['to make the precipitate colourless', 'so that, by the common-ion effect, practically no sulfate stays in solution', 'to neutralise the solution', 'to make the crystals smaller'], a: 1,
      why: 'Extra $\\ce{Ba^2+}$ pushes $\\ce{Ba^2+ + SO4^2- <=> BaSO4(s)}$ to the right, lowering the sulfate left dissolved to a negligible level.' },
    { q: 'In a TGA run, 10.00 mg of calcium oxalate monohydrate (146.11 g/mol) is heated to 900 °C. What mass of calcium oxide (56.08 g/mol) remains?', answer: 3.84, unit: 'mg',
      why: 'One CaO per formula unit: $10.00 \\times 56.08/146.11 = 3.84$ mg.' }
  ],
  applications: [
    'Reference methods for sulfate, chloride and nickel, used to check faster instrumental methods.',
    'Moisture and ash content of foods, animal feed, coal and cement.',
    'Thermogravimetric analysis of polymers, pharmaceuticals and minerals.',
    'The historic measurement of atomic masses, and of the composition of alloys and ores.'
  ],
  history: 'Theodore William Richards at Harvard spent three decades refining gravimetric methods, weighing silver chloride and similar compounds with extraordinary care; his atomic masses for dozens of elements earned him the 1914 Nobel Prize in Chemistry.'
},

{
  id: 'beer-lambert', parent: 'analysis', title: 'Absorbance and the Beer–Lambert law', level: 2,
  short: 'A solution absorbs light in proportion to how much absorbing substance the light passes: absorbance A = εlc. Measure the absorbance and you have the concentration.',
  keywords: ['Beer–Lambert law', 'Beer\'s law', 'absorbance', 'transmittance', 'molar absorptivity', 'extinction coefficient', 'spectrophotometer', 'colorimeter', 'calibration curve', 'cuvette', 'path length', 'UV-visible spectroscopy'],
  prereq: ['molarity', 'math:logarithms', 'physics:light-intensity'],
  related: ['dilution', 'crystal-field-theory', 'physics:em-spectrum', 'math:exponential-functions', 'measurement-uncertainty'],
  body: `
Hold up a glass of weak tea and a glass of strong tea: the strong one lets less light through. So does a taller glass of the same tea. Light is absorbed by molecules it meets, so the more absorbing molecules lie across its path — higher concentration, longer path — the less gets through.

The key is that each thin slice of solution absorbs the same **fraction** of the light reaching it. If the first millimetre removes 20 %, the second removes 20 % of what is left, and so on: the transmitted intensity falls **exponentially** with depth, and its logarithm falls in a straight line. Chemists therefore define

$$T = \\frac{I}{I_0}, \\qquad A = \\log_{10}\\frac{I_0}{I} = -\\log_{10} T$$

the **transmittance** $T$ and the **absorbance** $A$, and find the **Beer–Lambert law**:

$$A = \\varepsilon\\, l\\, c$$

with $l$ the path length (usually 1.00 cm, the width of a standard cuvette), $c$ the concentration, and $\\varepsilon$ the **molar absorptivity**, a property of the substance at that wavelength.

| absorbance | 0 | 0.3 | 1 | 2 | 3 |
|---|---|---|---|---|---|
| light transmitted | 100 % | 50 % | 10 % | 1 % | 0.1 % |

### Molar absorptivity
$\\varepsilon$ ranges from about 10 L/(mol·cm) for pale ions such as hydrated copper(II) to about $10^5$ for strong dyes. Useful values: NADH, 6220 L/(mol·cm) at 340 nm — the workhorse of enzyme assays; the red iron(II)–phenanthroline complex, 11 100 at 510 nm; crystal violet, about 87 000 at 590 nm. A solution absorbs the colour **complementary** to the one you see: permanganate absorbs green light near 525 nm and looks purple ([[physics:em-spectrum]], [[crystal-field-theory]]).

### Measuring it
A spectrophotometer passes light from a lamp through a monochromator (a grating that picks one wavelength), through the cuvette, onto a detector. First a **blank** — the solvent and reagents without the analyte — sets 100 % transmittance, cancelling the absorption of the cuvette and solvent. Measure at the wavelength of **maximum absorbance**: the sensitivity is highest there and the peak is flat, so a slightly misset wavelength hardly matters.

### The calibration curve
In practice $\\varepsilon$ is rarely taken on trust. A set of standards, made by [[dilution]] of a stock, is measured and $A$ plotted against $c$: a straight line through the origin. The unknown's absorbance is read off the line. Keep absorbances roughly between 0.1 and 1: below that, you are measuring small differences between large signals; above it, so few photons reach the detector that stray light and noise take over, and the line bends towards the concentration axis. A sample off the top is **diluted** by a known factor and measured again.

### When the law fails
Stray light, a spectral bandwidth wider than the absorption peak, concentrations above about 0.01 M (molecules too close together) and chemistry that changes with concentration — dimerisation, or an indicator whose acid and base forms absorb differently — all bend the calibration line.

### Where it is used
Blood tests coupled to NADH at 340 nm; DNA measured by its absorbance at 260 nm (an absorbance of 1.0 is about 50 µg/mL of double-stranded DNA, and a 260/280 ratio near 1.8 means little protein contamination); nitrate, phosphate and iron in water; the **pulse oximeter**, which compares red and infrared absorption through a fingertip to find how much haemoglobin carries oxygen.
`,
  ideas: [
    'Each layer of solution absorbs the same fraction of the light reaching it, so intensity falls exponentially.',
    'Absorbance A = −log₁₀T is proportional to path length and concentration: A = εlc.',
    'ε depends on the substance and the wavelength; measure at the absorption maximum.',
    'A blank sets zero absorbance; a calibration line of standards gives the concentration of the unknown.',
    'Work between A ≈ 0.1 and 1; dilute samples that absorb more.'
  ],
  pitfalls: [
    'Absorbance is the percentage of light absorbed — It is a logarithm. An absorbance of 2 means 99 % absorbed, not 200 %.',
    'Transmittance is proportional to concentration — Absorbance is. Doubling the concentration squares the transmittance: 50 % becomes 25 %.',
    'Extrapolating the calibration line — Beyond the highest standard the line may bend; dilute the sample into the calibrated range instead.'
  ],
  derivation: {
    title: 'From "each slice absorbs the same fraction" to A = εlc',
    steps: [
      { text: 'A thin slice $dx$ removes a fraction of the light proportional to its thickness and to the concentration of absorbers:', tex: '\\frac{dI}{I} = -\\kappa\\, c\\, dx' },
      { text: 'Integrate across the cuvette, from $I_0$ at the front to $I$ at depth $l$:', tex: '\\ln\\frac{I}{I_0} = -\\kappa\\, c\\, l \\quad\\Rightarrow\\quad I = I_0\\, e^{-\\kappa c l}' },
      { text: 'Switch to base-10 logarithms, as spectroscopists do, and absorb the factor $\\ln 10$ into the constant:', tex: 'A = \\log_{10}\\frac{I_0}{I} = \\frac{\\kappa}{\\ln 10}\\, c\\, l = \\varepsilon\\, l\\, c' }
    ],
    outro: 'The assumption that each absorber acts independently is what breaks down at high concentrations.'
  },
  formulas: [
    {
      name: 'The Beer–Lambert law',
      expr: 'A = eps*l*c', tex: 'A = \\varepsilon\\, l\\, c',
      vars: {
        A: { name: 'absorbance' },
        eps: { name: 'molar absorptivity', q: 'molarabs', unit: 'L/(mol·cm)', value: 6220, tex: '\\varepsilon' },
        l: { name: 'path length', q: 'length', unit: 'cm', value: 1.00 },
        c: { name: 'concentration', q: 'concentration', unit: 'µM', value: 66.7 }
      },
      solveFor: 'A',
      note: 'Defaults: NADH at 340 nm in a 1 cm cuvette. Valid for dilute solutions and monochromatic light, in practice for absorbances up to about 1.',
      practice: { unknowns: ['A', 'c', 'eps'] },
      stories: {
        A: 'A solution of NADH ({eps} at 340 nm) is {c}. What absorbance does it give in a {l} cuvette?',
        c: 'A sample of a compound with {eps} gives an absorbance of {A} in a {l} cuvette. What is its concentration?',
        eps: 'A {c} solution gives an absorbance of {A} in a {l} cuvette. What is the molar absorptivity?'
      }
    },
    {
      name: 'Absorbance and transmittance',
      expr: 'A = -log(T)', tex: 'A = -\\log_{10} T',
      vars: {
        A: { name: 'absorbance' },
        T: { name: 'transmittance, I/I₀', q: 'ratio', unit: '%', value: 25 }
      },
      note: 'Every absorbance unit cuts the light by a factor of ten.',
      stories: {
        A: 'A solution transmits {T} of the light at its absorption maximum. What is its absorbance?',
        T: 'A sample has an absorbance of {A}. What percentage of the light gets through?'
      }
    },
    {
      name: 'Absorbance of a mixture of two absorbers',
      expr: 'A = l*(e1*c1 + e2*c2)', tex: 'A = l\\,(\\varepsilon_1 c_1 + \\varepsilon_2 c_2)',
      vars: {
        A: { name: 'total absorbance' },
        l: { name: 'path length', q: 'length', unit: 'cm', value: 1.00 },
        e1: { name: 'molar absorptivity of species 1', q: 'molarabs', unit: 'L/(mol·cm)', value: 11100, tex: '\\varepsilon_1' },
        c1: { name: 'concentration of species 1', q: 'concentration', unit: 'µM', value: 20 },
        e2: { name: 'molar absorptivity of species 2', q: 'molarabs', unit: 'L/(mol·cm)', value: 2400, tex: '\\varepsilon_2' },
        c2: { name: 'concentration of species 2', q: 'concentration', unit: 'µM', value: 50 }
      },
      note: 'Absorbances of independent absorbers add. Measuring at two wavelengths gives two such equations, which can be solved for both concentrations.',
      practice: { unknowns: ['A', 'c2'] },
      stories: {
        A: 'A {l} cuvette holds {c1} of a dye with {e1} and {c2} of another with {e2} at the measuring wavelength. What is the total absorbance?',
        c2: 'A mixture gives an absorbance of {A} in a {l} cuvette. It contains {c1} of a species with {e1}; the other absorber has {e2}. What is the concentration of the other absorber?'
      }
    }
  ],
  examples: [
    {
      title: 'An enzyme assay',
      q: 'In a clinical assay the NADH formed gives an absorbance of 0.415 at 340 nm in a 1.00 cm cuvette, after subtracting the blank. With $\\varepsilon = 6220$ L/(mol·cm), what is the NADH concentration?',
      steps: [
        '$c = A/(\\varepsilon l) = 0.415/(6220 \\times 1.00) = 6.67 \\times 10^{-5}$ mol/L.',
        'That is 66.7 µM — a concentration that would be hard to measure any other way in a few seconds.'
      ],
      a: '66.7 µM'
    },
    {
      title: 'Transmittance does not scale',
      q: 'A solution transmits 25 % of the light. What is its absorbance, and what fraction would a solution of twice the concentration transmit?',
      steps: [
        '$A = -\\log_{10} 0.25 = 0.602$.',
        'Doubling the concentration doubles the absorbance: $A = 1.204$.',
        '$T = 10^{-1.204} = 0.0625$: 6.25 %, not 12.5 %. Transmittance multiplies, absorbance adds.'
      ],
      a: 'A = 0.602; the doubled solution transmits 6.25 %.'
    },
    {
      title: 'Iron in well water',
      q: 'Iron in a water sample is converted to the red phenanthroline complex ($\\varepsilon = 11\\,100$ L/(mol·cm) at 510 nm), and the solution gives an absorbance of 0.388 in a 1.00 cm cell. What is the iron content in mg/L?',
      steps: [
        '$c = 0.388/(11\\,100 \\times 1.00) = 3.50 \\times 10^{-5}$ mol/L.',
        'In mass: $3.50 \\times 10^{-5} \\times 55.845 = 1.95 \\times 10^{-3}$ g/L $= 1.95$ mg/L.',
        'Water with that much iron tastes metallic and stains washing; drinking-water standards aim for below about 0.2 mg/L.'
      ],
      a: '1.95 mg/L of iron.'
    }
  ],
  quiz: [
    { q: 'A solution transmits 10 % of the incident light. What is its absorbance?', answer: 1.0,
      why: '$A = -\\log_{10}(0.10) = 1.0$. Each absorbance unit is a factor of ten.' },
    { q: 'You move a solution from a 1 cm cuvette to a 2 cm cuvette. What happens?', choices: ['absorbance doubles, transmittance halves', 'absorbance doubles, transmittance is squared', 'absorbance and transmittance both double', 'nothing: path length does not matter'], a: 1,
      why: 'Absorbance is proportional to path length. Transmittance $10^{-A}$ is then squared: 0.5 becomes 0.25.' },
    { q: 'Absorbance is proportional to the percentage of light absorbed.', a: false,
      why: 'Absorbance is logarithmic: 90 % absorbed is A = 1, 99 % is A = 2. It is absorbance, not the percentage, that is proportional to concentration.' },
    { q: 'Why is an absorbance measured at the wavelength of maximum absorption?', choices: ['the lamp is brightest there', 'sensitivity is highest and a small wavelength error hardly changes the reading', 'the law only holds at the maximum', 'the blank absorbs least there'], a: 1,
      why: 'At the peak, ε is largest (most signal per unit concentration) and the curve is flat, so the reading is insensitive to small errors in the wavelength setting.' },
    { q: 'An unknown gives A = 2.3, above your highest standard (A = 1.0). What is the best course?', choices: ['extrapolate the calibration line', 'dilute the sample by a known factor, measure, and multiply back', 'report the result as "greater than the highest standard" only', 'use a longer cuvette'], a: 1,
      why: 'At high absorbance the response bends and becomes noisy. Diluting (say fivefold) brings it into the calibrated range; multiply the result by the dilution factor.' }
  ],
  applications: [
    'Clinical chemistry analysers running thousands of enzyme and colour assays a day.',
    'Measuring DNA, RNA and protein concentrations in biology laboratories.',
    'Water and environmental testing: nitrate, phosphate, iron, chlorine.',
    'Pulse oximeters, which apply the same law to blood in a fingertip at two wavelengths.'
  ],
  history: 'Pierre Bouguer (1729) and Johann Heinrich Lambert (1760) found that light falls off exponentially through an absorbing medium; August Beer showed in 1852 that the absorption of a solution depends on its concentration in the same way.',
  sim: 'lab-beer-lambert'
},

{
  id: 'ir-spectroscopy', parent: 'analysis', title: 'Infrared spectroscopy', level: 2,
  short: 'Chemical bonds vibrate like springs, each at its own frequency in the infrared. The frequencies a molecule absorbs reveal which bonds — and so which functional groups — it contains.',
  keywords: ['infrared spectroscopy', 'IR spectrum', 'wavenumber', 'cm⁻¹', 'bond vibration', 'stretching', 'bending', 'functional group', 'fingerprint region', 'carbonyl', 'O–H stretch', 'reduced mass', 'greenhouse gas', 'IR active'],
  prereq: ['functional-groups', 'bond-order-length', 'physics:simple-harmonic-motion'],
  related: ['nmr-spectroscopy', 'mass-spectrometry', 'molecular-polarity', 'physics:em-spectrum', 'physics:thermal-radiation'],
  body: `
Picture a chemical bond as a spring joining two balls. Pull the balls apart and let go, and they oscillate at a frequency set by the stiffness of the spring and the masses of the balls — exactly like a [[physics:mass-spring-system|mass on a spring]]:

$$\\nu = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{\\mu}}, \\qquad \\mu = \\frac{m_1 m_2}{m_1 + m_2}$$

For real bonds $k$ is a few hundred to about two thousand newtons per metre and the masses are those of atoms, so the frequencies come out at $10^{13}$–$10^{14}$ Hz: the **infrared**. Shine infrared light through a sample, and at the frequencies where bonds vibrate the light is absorbed. The spectrum is a series of dips in transmitted light.

Spectroscopists quote the **wavenumber** $\\tilde\\nu = 1/\\lambda$, in cm⁻¹: the number of waves per centimetre, proportional to frequency and to photon energy. The useful range runs from 4000 cm⁻¹ (λ = 2.5 µm) to 400 cm⁻¹ (25 µm).

### What sets the position of a band
- **Light atoms vibrate fast.** Every bond to hydrogen — C–H, O–H, N–H — absorbs above about 2700 cm⁻¹. Replace H by deuterium and the band drops by a factor of about 1.36.
- **Stiff bonds vibrate fast.** Triple bonds (C≡N, C≡C) near 2100–2260, double bonds (C=O near 1700, C=C near 1650), single bonds (C–O, C–C) below 1300.
- **Bending is easier than stretching**, so bends lie at lower wavenumbers.

| bond | wavenumber / cm⁻¹ | what it looks like |
|---|---|---|
| O–H in alcohols | 3200–3550 | strong and broad (hydrogen bonding) |
| O–H in carboxylic acids | 2500–3300 | very broad, over the C–H bands |
| N–H | 3300–3500 | medium; two peaks for $\\ce{NH2}$ |
| C–H | 2850–3100 | strong; alkyl below 3000, alkene and aromatic above |
| C≡N | 2210–2260 | medium, sharp |
| C=O | 1680–1750 | strong, sharp — the easiest band to spot |
| C=C | 1620–1680 | medium to weak |
| C–O | 1000–1300 | strong |

Below about 1500 cm⁻¹ lies the **fingerprint region**: a crowd of bending and skeletal vibrations unique to each compound. It is hard to interpret band by band but ideal for matching a spectrum against a library.

### Not every vibration shows
A vibration absorbs infrared only if it **changes the dipole moment** of the molecule ([[molecular-polarity]]). $\\ce{N2}$ and $\\ce{O2}$ have no dipole to change and are transparent. In $\\ce{CO2}$ the symmetric stretch is invisible, but the asymmetric stretch (2349 cm⁻¹) and the bend (667 cm⁻¹) absorb strongly. That is the physics of the greenhouse effect: the 99 % of the air that is nitrogen and oxygen lets the Earth's infrared escape, while water vapour, carbon dioxide and methane absorb it ([[physics:thermal-radiation]]).

### Reading a spectrum
Look above 1500 cm⁻¹ first. A strong sharp band near 1700 means a carbonyl. With a very broad band from 2500 to 3300 as well, a carboxylic acid; with a strong C–O near 1200 and no O–H, an ester. A broad band near 3300 without a carbonyl: an alcohol. When propan-2-ol is oxidised to propanone, the O–H band disappears and a C=O band appears — a quick way to follow the reaction.

Infrared is everywhere outside the laboratory too: breath analysers measure ethanol by its C–H absorption near 3.4 µm; cheap $\\ce{CO2}$ sensors in offices and greenhouses look for the 4.26 µm band; recycling plants sort plastics by their near-infrared spectra on the conveyor.
`,
  ideas: [
    'Bonds vibrate like springs: ν = (1/2π)√(k/μ); stiffer bonds and lighter atoms vibrate faster.',
    'Wavenumber ν̃ = 1/λ in cm⁻¹ is proportional to frequency; IR spectra run from 4000 to 400 cm⁻¹.',
    'Bonds to hydrogen absorb above about 2700 cm⁻¹, triple bonds near 2200, C=O near 1700, single bonds below 1300.',
    'Only vibrations that change the dipole moment absorb: $\\ce{N2}$ and $\\ce{O2}$ are IR-inactive, $\\ce{CO2}$ and $\\ce{H2O}$ are not.',
    'The fingerprint region below 1500 cm⁻¹ identifies a compound by matching.'
  ],
  pitfalls: [
    'A higher wavenumber means a longer wavelength — The opposite: ν̃ = 1/λ, so 3000 cm⁻¹ (3.3 µm) is a shorter wavelength than 1000 cm⁻¹ (10 µm).',
    'Every bond gives a band — Vibrations that do not change the dipole moment (the N≡N stretch, the symmetric stretch of $\\ce{CO2}$) are invisible in the infrared.',
    'An IR spectrum gives the whole structure — It shows which functional groups are present; how they are connected usually needs NMR and mass spectrometry as well.'
  ],
  derivation: {
    title: 'The vibration wavenumber of a bond',
    steps: [
      { text: 'Two atoms joined by a bond of stiffness $k$ vibrate like a single mass $\\mu$ on a spring, with the reduced mass', tex: '\\mu = \\frac{m_1 m_2}{m_1 + m_2}' },
      { text: 'A mass on a spring oscillates at angular frequency $\\omega = \\sqrt{k/\\mu}$, so the frequency is', tex: '\\nu = \\frac{\\omega}{2\\pi} = \\frac{1}{2\\pi}\\sqrt{\\frac{k}{\\mu}}' },
      { text: 'Divide by the speed of light to get the wavenumber $\\tilde\\nu = \\nu/c = 1/\\lambda$:', tex: '\\tilde\\nu = \\frac{1}{2\\pi c}\\sqrt{\\frac{k}{\\mu}}' },
      { text: 'For $\\ce{C=O}$ ($\\mu = 6.86$ u $= 1.139 \\times 10^{-26}$ kg) with $k \\approx 1190$ N/m this gives 171 500 m⁻¹, or 1715 cm⁻¹ — just where ketones absorb.' }
    ]
  },
  formulas: [
    {
      name: 'Wavenumber from wavelength',
      expr: 'nu = 1/lam', tex: '\\tilde\\nu = \\frac{1}{\\lambda}',
      vars: {
        nu: { name: 'wavenumber', q: 'wavenumber', unit: '1/cm', tex: '\\tilde\\nu' },
        lam: { name: 'wavelength', q: 'length', unit: 'µm', value: 5.83, tex: '\\lambda' }
      },
      note: '10 000 divided by the wavelength in micrometres gives the wavenumber in cm⁻¹.',
      stories: {
        nu: 'An infrared band lies at a wavelength of {lam}. What is its wavenumber?',
        lam: 'A carbonyl band appears at {nu}. What is its wavelength?'
      }
    },
    {
      name: 'Reduced mass of two bonded atoms',
      expr: 'mu = m1*m2/(m1 + m2)', tex: '\\mu = \\frac{m_1 m_2}{m_1 + m_2}',
      vars: {
        mu: { name: 'reduced mass', q: 'mass', unit: 'u', tex: '\\mu' },
        m1: { name: 'mass of atom 1', q: 'mass', unit: 'u', value: 12.011 },
        m2: { name: 'mass of atom 2', q: 'mass', unit: 'u', value: 15.999 }
      },
      note: 'Always smaller than the lighter atom: a bond to hydrogen has μ close to 1 u whatever the other atom.',
      practice: { unknowns: ['mu'] },
      stories: {
        mu: 'What is the reduced mass of a bond between atoms of mass {m1} and {m2}?'
      }
    },
    {
      name: 'Vibration wavenumber of a bond',
      expr: 'nu = sqrt(k/mu)/(2*pi*c)', tex: '\\tilde\\nu = \\frac{1}{2\\pi c}\\sqrt{\\frac{k}{\\mu}}',
      vars: {
        nu: { name: 'wavenumber of the vibration', q: 'wavenumber', unit: '1/cm', tex: '\\tilde\\nu' },
        k: { name: 'force constant of the bond', q: 'stiffness', unit: 'N/m', value: 1190 },
        mu: { name: 'reduced mass', q: 'mass', unit: 'u', value: 6.86, tex: '\\mu' },
        c: { const: 'c' }
      },
      note: 'The harmonic model. Defaults: the C=O of a ketone. Real bonds are slightly anharmonic, so force constants fitted this way are approximate.',
      practice: { unknowns: ['nu', 'k'] },
      stories: {
        nu: 'A bond has a force constant of {k} and a reduced mass of {mu}. At what wavenumber does it absorb?',
        k: 'A bond with reduced mass {mu} absorbs at {nu}. What is its force constant?'
      }
    }
  ],
  examples: [
    {
      title: 'Single against double bond',
      q: 'The C=O stretch of propanone is at 1715 cm⁻¹; a C–O single bond in an alcohol absorbs near 1100 cm⁻¹. Compare their force constants.',
      steps: [
        'Both bonds join C and O, so the reduced mass is the same (6.86 u) and $k \\propto \\tilde\\nu^2$.',
        '$k(\\ce{C-O})/k(\\ce{C=O}) = (1100/1715)^2 = 0.41$.',
        'With $k(\\ce{C=O}) \\approx 1190$ N/m, the single bond has about 490 N/m: a double bond is roughly twice as stiff as a single one, consistent with its bond order.'
      ],
      a: 'The double bond is about 2.4 times stiffer (≈1190 against ≈490 N/m).'
    },
    {
      title: 'Swapping hydrogen for deuterium',
      q: 'A C–H stretch absorbs at 3000 cm⁻¹. Where does the C–D stretch appear, assuming the same force constant?',
      steps: [
        'Reduced masses: $\\mu(\\ce{C-H}) = 12.011 \\times 1.008/13.019 = 0.930$ u; $\\mu(\\ce{C-D}) = 12.011 \\times 2.014/14.025 = 1.725$ u.',
        '$\\tilde\\nu \\propto 1/\\sqrt{\\mu}$, so $\\tilde\\nu(\\ce{C-D}) = 3000/\\sqrt{1.725/0.930} = 3000/1.362 = 2200$ cm⁻¹.',
        'The band moves into an otherwise empty region of the spectrum, which is how chemists label and track a particular hydrogen atom.'
      ],
      a: 'About 2200 cm⁻¹.'
    },
    {
      title: 'Acid or ester?',
      q: 'A compound $\\ce{C2H4O2}$ shows a very broad band from 2500 to 3300 cm⁻¹ and a strong band at 1710 cm⁻¹. Is it ethanoic acid or methyl methanoate?',
      steps: [
        'Both isomers have a C=O, which explains the 1710 band.',
        'The very broad band spanning 2500–3300 is the hydrogen-bonded O–H of a carboxylic acid; an ester has no O–H at all.'
      ],
      a: 'Ethanoic acid, $\\ce{CH3COOH}$.'
    }
  ],
  quiz: [
    { q: 'Which of these gases does not absorb infrared radiation?', choices: ['$\\ce{CO2}$', '$\\ce{H2O}$', '$\\ce{N2}$', '$\\ce{CH4}$'], a: 2,
      why: 'Stretching the symmetric $\\ce{N2}$ molecule never gives it a dipole moment, so it cannot absorb IR. That is why the main gases of the air are not greenhouse gases.' },
    { q: 'What is the wavenumber of infrared light of wavelength 4.00 µm?', answer: 2500, unit: '1/cm',
      why: '$\\tilde\\nu = 1/\\lambda = 1/(4.00 \\times 10^{-4}\\ \\mathrm{cm}) = 2500$ cm⁻¹.' },
    { q: 'A C–D bond absorbs at a higher wavenumber than a C–H bond.', a: false,
      why: 'Deuterium is heavier, so the reduced mass is larger and the vibration slower: about 2200 cm⁻¹ against 3000.' },
    { q: 'Propan-2-ol is oxidised to propanone. How does the IR spectrum change?', choices: ['a C=O band appears near 1715 cm⁻¹ and the broad O–H band disappears', 'an O–H band appears near 3300 cm⁻¹', 'the C–H bands disappear', 'a C≡C band appears near 2200 cm⁻¹'], a: 0,
      why: 'The alcohol group becomes a ketone: the hydrogen-bonded O–H stretch goes, and the strong carbonyl stretch arrives.' },
    { q: 'A spectrum shows a broad, strong band at 3350 cm⁻¹, strong C–H bands just below 3000 and nothing between 1650 and 1800 cm⁻¹. Which compound fits?', choices: ['ethanol', 'propanone', 'ethyl ethanoate', 'ethanoic acid'], a: 0,
      why: 'A broad O–H band without any carbonyl means an alcohol. The other three all have a strong C=O band near 1700–1750.' }
  ],
  applications: [
    'Identifying unknown compounds and checking the purity of products against library spectra.',
    'Evidential breath-alcohol analysers and non-dispersive $\\ce{CO2}$ sensors.',
    'Sorting plastics for recycling, and quality control of polymers, drugs and foods.',
    'Climate science: the infrared absorption of greenhouse gases.'
  ],
  history: 'William Herschel discovered infrared radiation in 1800 with a prism and a thermometer. William Coblentz recorded the infrared spectra of well over a hundred compounds by 1905 and noticed that the same groups absorb at the same places; commercial double-beam spectrometers made IR routine after the Second World War.',
  sim: 'lab-ir'
},

{
  id: 'nmr-spectroscopy', parent: 'analysis', title: 'NMR spectroscopy', level: 3,
  short: 'In a strong magnetic field, hydrogen and carbon-13 nuclei absorb radio waves at frequencies that depend slightly on their chemical surroundings — revealing how many kinds of atom a molecule has, how many of each, and which are neighbours.',
  keywords: ['NMR', 'nuclear magnetic resonance', 'chemical shift', 'ppm', 'TMS', 'integration', 'spin–spin splitting', 'n+1 rule', 'coupling constant', 'carbon-13 NMR', 'Larmor frequency', 'MRI', 'equivalent protons'],
  prereq: ['functional-groups', 'electronegativity', 'physics:magnetic-field'],
  related: ['ir-spectroscopy', 'mass-spectrometry', 'structural-isomers', 'physics:electron-spin', 'math:binomial-theorem'],
  body: `
Many atomic nuclei spin, and a spinning charge is a tiny magnet. The proton — the nucleus of $\\ce{^1H}$ — is the most important; carbon-13, fluorine-19 and phosphorus-31 behave the same way. Put such nuclei in a strong magnetic field $B$ and they settle into two energy states, aligned with or against the field. Radio waves of just the right frequency flip them from one to the other:

$$\\nu_0 = \\frac{\\gamma}{2\\pi} B$$

For protons $\\gamma/2\\pi = 42.58$ MHz per tesla. A "400 MHz" spectrometer is a superconducting magnet of 9.4 T, cooled by liquid helium.

### Chemical shift
If that were all, every proton would absorb at the same frequency and NMR would be useless to chemists. But the electrons around each nucleus circulate in the field and **shield** it slightly, by a few parts per million. Protons in different chemical surroundings therefore resonate at slightly different frequencies. The shift is measured from a reference, tetramethylsilane (TMS, $\\ce{Si(CH3)4}$: twelve identical, strongly shielded protons), and divided by the spectrometer frequency so that it does not depend on the magnet:

$$\\delta = \\frac{\\nu - \\nu_\\text{TMS}}{\\nu_0} \\times 10^6\\ \\text{ppm}$$

Electronegative neighbours pull electron density away, deshield the proton and move it to higher $\\delta$ ([[electronegativity]]).

| proton | δ / ppm |
|---|---|
| alkyl, $\\ce{R-CH3}$, $\\ce{R-CH2-R}$ | 0.9–1.5 |
| next to a carbonyl, $\\ce{CH3-CO-R}$ | 2.0–2.6 |
| on carbon bonded to oxygen, $\\ce{R-O-CH2-R}$ | 3.3–4.3 |
| alkene, $\\ce{C=C-H}$ | 4.5–6.5 |
| aromatic ring | 6.5–8.5 |
| aldehyde, $\\ce{-CHO}$ | 9–10 |
| carboxylic acid, $\\ce{-COOH}$ | 10–12 |
| $\\ce{O-H}$ and $\\ce{N-H}$ | 1–5, variable |

### Three clues in every signal
1. **Position** ($\\delta$): what kind of environment.
2. **Area** (the integration): how many protons, as a ratio.
3. **Splitting**: a proton with $n$ equivalent protons on the neighbouring carbons appears as $n + 1$ lines, with intensities from Pascal's triangle ([[math:binomial-theorem]]) — a doublet 1 : 1, triplet 1 : 2 : 1, quartet 1 : 3 : 3 : 1. The spacing, the **coupling constant** $J$, is about 7 Hz for $\\ce{H-C-C-H}$ and does not depend on the field.

Ethanol shows all three: $\\ce{CH3}$ at 1.2 ppm (3H, a triplet, split by the $\\ce{CH2}$), $\\ce{CH2}$ at 3.7 ppm (2H, a quartet, split by the $\\ce{CH3}$ and moved downfield by the oxygen), and $\\ce{OH}$ as a singlet (1H) whose position depends on concentration. The OH proton exchanges between molecules so fast that it does not split its neighbours; shaking the sample with $\\ce{D2O}$ makes its signal vanish.

### Why bigger magnets
Shifts in hertz grow with the field; couplings in hertz do not. On a 60 MHz instrument a 7 Hz coupling spans 0.12 ppm and multiplets pile into one another; at 600 MHz it spans 0.012 ppm and they separate cleanly. Signal strength grows with the field too.

### Carbon-13
Only 1.1 % of carbon is $\\ce{^13C}$, so its signals are weak, and they are usually recorded with the proton couplings removed: **one line per kind of carbon**, over 0–220 ppm (C=O 160–220, aromatic and alkene 100–150, C–O 50–90, alkyl 0–50). Counting lines counts carbon environments: propanone gives two, benzene one.

### MRI
Magnetic resonance imaging is proton NMR of the water and fat in the body, at 1.5 or 3 T (64 or 128 MHz). Field gradients encode where each signal comes from, and differences in how fast the spins relax after the pulse give the contrast between tissues.
`,
  ideas: [
    'Nuclei with spin absorb radio waves in a magnetic field at ν₀ = (γ/2π)B: 42.58 MHz per tesla for protons.',
    'Electron shielding shifts each proton slightly; the chemical shift δ in ppm is independent of the magnet.',
    'Electronegative neighbours deshield protons and move them to higher δ.',
    'Each signal gives position (environment), area (number of H) and splitting (n neighbours → n + 1 lines).',
    'Carbon-13 NMR gives one line per kind of carbon over 0–220 ppm.'
  ],
  pitfalls: [
    'The chemical shift in ppm changes with the spectrometer — δ is defined relative to ν₀ precisely so that it does not. The shift in hertz does change.',
    'The n + 1 rule counts the protons on the same carbon — It counts the equivalent protons on neighbouring carbons; protons on the same carbon, if equivalent, do not split one another.',
    'The number of signals equals the number of hydrogen atoms — It equals the number of distinct environments. All six protons of propanone give a single signal.'
  ],
  formulas: [
    {
      name: 'Chemical shift',
      expr: 'delta = dnu/nu0', tex: '\\delta = \\frac{\\Delta\\nu}{\\nu_0}',
      vars: {
        delta: { name: 'chemical shift', q: 'ratio', unit: 'ppm', tex: '\\delta' },
        dnu: { name: 'frequency offset from TMS, ν − ν(TMS)', q: 'frequency', unit: 'Hz', value: 1470, tex: '\\Delta\\nu' },
        nu0: { name: 'spectrometer frequency', q: 'frequency', unit: 'MHz', value: 400, tex: '\\nu_0' }
      },
      note: '$\\Delta\\nu = \\nu - \\nu_\\text{TMS}$. The ratio is tiny, which is why it is quoted in parts per million. Couplings convert the same way: 7 Hz is 0.0175 ppm at 400 MHz.',
      practice: { unknowns: ['delta', 'dnu'] },
      stories: {
        delta: 'On a {nu0} spectrometer a signal appears {dnu} away from TMS. What is its chemical shift?',
        dnu: 'A proton has a chemical shift of {delta}. How far from TMS, in hertz, does it appear on a {nu0} spectrometer?'
      }
    },
    {
      name: 'Resonance frequency of protons in a field',
      expr: 'nu0 = gb*B', tex: '\\nu_0 = \\bar\\gamma\\, B',
      vars: {
        nu0: { name: 'resonance (Larmor) frequency', q: 'frequency', unit: 'MHz', tex: '\\nu_0' },
        gb: { name: 'γ/2π for the proton (42.58 MHz/T)', unit: 'Hz/T', value: 42.577e6, fixed: true, tex: '\\bar\\gamma' },
        B: { name: 'magnetic field', q: 'bfield', unit: 'T', value: 9.4 }
      },
      note: '$\\bar\\gamma = \\gamma/2\\pi$ is the gyromagnetic ratio divided by $2\\pi$. For carbon-13 it is about a quarter as large (10.71 MHz/T), so a 400 MHz instrument observes carbon at about 100 MHz.',
      practice: { unknowns: ['nu0', 'B'] },
      stories: {
        nu0: 'At what frequency do protons resonate in a {B} magnet?',
        B: 'What magnetic field does a {nu0} proton NMR spectrometer need?'
      }
    }
  ],
  examples: [
    {
      title: 'Shifts in hertz and in ppm',
      q: 'On a 400 MHz spectrometer a quartet is centred 1470 Hz from TMS, with lines 7.0 Hz apart. Give its chemical shift, and describe the same signal on a 600 MHz instrument.',
      steps: [
        '$\\delta = 1470/(400 \\times 10^6) \\times 10^6 = 3.675$ ppm — typical of a $\\ce{CH2}$ bonded to oxygen.',
        'At 600 MHz the shift in ppm is unchanged, so the signal sits $3.675 \\times 600 = 2205$ Hz from TMS.',
        'The coupling stays 7.0 Hz, which is now only 0.0117 ppm instead of 0.0175 ppm: the multiplet takes up less of the spectrum and overlaps less with others.'
      ],
      a: 'δ = 3.675 ppm; 2205 Hz from TMS at 600 MHz, with the same 7.0 Hz coupling.'
    },
    {
      title: 'Predicting a spectrum: ethyl ethanoate',
      q: 'Predict the proton NMR spectrum of ethyl ethanoate, $\\ce{CH3COOCH2CH3}$.',
      steps: [
        'Three environments: the $\\ce{CH3}$ on the carbonyl, the $\\ce{OCH2}$, and the $\\ce{CH3}$ of the ethyl group.',
        '$\\ce{CH3CO}$: next to C=O, about 2.0 ppm; no protons on the neighbouring carbon, so a **singlet**, 3H.',
        '$\\ce{OCH2}$: on carbon bonded to oxygen, about 4.1 ppm; three neighbours, so a **quartet**, 2H.',
        '$\\ce{CH2CH3}$: alkyl, about 1.3 ppm; two neighbours, so a **triplet**, 3H.'
      ],
      a: 'Singlet 2.0 ppm (3H), quartet 4.1 ppm (2H), triplet 1.3 ppm (3H): areas 3 : 2 : 3.'
    }
  ],
  quiz: [
    { q: 'How many signals does the proton NMR spectrum of propanone, $\\ce{CH3COCH3}$, show?', answer: 1,
      why: 'The two methyl groups are equivalent by symmetry, so all six protons share one environment: a single singlet near 2.2 ppm.' },
    { q: 'A $\\ce{CH2}$ group is next to a $\\ce{CH3}$ group and nothing else with protons. How does its signal appear?', choices: ['a singlet', 'a doublet', 'a triplet', 'a quartet'], a: 3,
      why: 'Three equivalent neighbouring protons split it into 3 + 1 = 4 lines, in the ratio 1 : 3 : 3 : 1.' },
    { q: 'Doubling the magnetic field doubles the chemical shift of a proton in ppm.', a: false,
      why: 'The shift in hertz doubles, but so does $\\nu_0$, and δ is their ratio. That is the point of quoting shifts in ppm.' },
    { q: 'Why is tetramethylsilane used as the reference?', choices: ['it has the most deshielded protons known', 'its twelve equivalent, strongly shielded protons give one sharp signal clear of almost everything else, and it is inert and volatile', 'it contains carbon-13', 'it dissolves in water'], a: 1,
      why: 'Silicon is less electronegative than carbon, so the TMS protons are more shielded than those of nearly all organic compounds, giving a single reference line at one end of the spectrum. It is unreactive and easily evaporated afterwards.' },
    { q: 'A compound $\\ce{C4H8O2}$ shows a singlet at 2.0 ppm (3H), a quartet at 4.1 ppm (2H) and a triplet at 1.3 ppm (3H). Which is it?', choices: ['butanoic acid', 'ethyl ethanoate', 'methyl propanoate', 'propyl methanoate'], a: 1,
      why: 'The ethyl group (quartet plus triplet) sits on oxygen, since its $\\ce{CH2}$ is at 4.1 ppm; the isolated $\\ce{CH3}$ at 2.0 ppm sits on a carbonyl. That is $\\ce{CH3COOCH2CH3}$. Methyl propanoate would have its ethyl $\\ce{CH2}$ near 2.3 and a $\\ce{OCH3}$ singlet near 3.7.' }
  ],
  applications: [
    'Determining the structures of new molecules in every synthetic chemistry laboratory.',
    'Checking the identity and purity of drugs, and detecting fraud in foods such as honey and wine.',
    'Solving the three-dimensional structures of proteins in solution.',
    'Magnetic resonance imaging in medicine.'
  ],
  history: 'Felix Bloch and Edward Purcell independently observed nuclear magnetic resonance in bulk matter in 1946 and shared the 1952 Nobel Prize in Physics. The chemical shift, found around 1950, was first seen as a nuisance before chemists realised what it offered. Richard Ernst\'s pulsed Fourier-transform methods (Nobel Prize in Chemistry 1991) and MRI (Lauterbur and Mansfield, Nobel Prize in Medicine 2003) followed.'
},

{
  id: 'mass-spectrometry', parent: 'analysis', title: 'Mass spectrometry', level: 2,
  short: 'A mass spectrometer turns molecules into ions, sorts them by mass-to-charge ratio and counts them. The pattern gives the molar mass, the isotopes present and clues to the structure from the fragments.',
  keywords: ['mass spectrometry', 'mass spectrum', 'm/z', 'molecular ion', 'base peak', 'fragmentation', 'isotope pattern', 'M+2', 'M+1', 'time of flight', 'electron impact', 'electrospray', 'high resolution', 'relative atomic mass'],
  prereq: ['isotopes', 'molar-mass', 'physics:charged-particle-motion'],
  related: ['ir-spectroscopy', 'nmr-spectroscopy', 'chromatography', 'empirical-formula', 'math:binomial-theorem'],
  body: `
A mass spectrometer weighs individual molecules. It cannot grab a neutral molecule, so it first gives it a charge, then uses electric and magnetic fields — which push on charges — to sort the ions by the ratio of their mass to their charge, $m/z$. The result is a **mass spectrum**: bars at each $m/z$, their heights showing how many ions arrived.

### Inside the instrument
1. **Ionisation.** In *electron impact* (EI), a beam of 70 eV electrons knocks an electron out of each molecule, $\\ce{M + e- -> M^+ + 2e-}$, leaving so much energy that many ions break apart. *Electrospray* (ESI) is gentle: a charged mist of solution dries until protonated molecules, often carrying several charges, fly off — which is how intact proteins are weighed.
2. **Acceleration.** Every ion of charge $ze$ falls through the same voltage $U$ and gains the same kinetic energy: $\\tfrac12 mv^2 = zeU$. Heavier ions end up slower.
3. **Separation.** In a *time-of-flight* analyser they race down a field-free tube of length $L$ and arrive after $t = L\\sqrt{m/(2zeU)}$. In a *magnetic sector* they curve with radius $r = mv/(zeB)$, heavier ions more gently ([[physics:charged-particle-motion]]). Quadrupoles and ion traps sort them by stability in oscillating fields.
4. **Detection.** Each arriving ion triggers an avalanche of electrons in a multiplier.

### Reading a spectrum
- The **molecular ion**, $\\ce{M^+}$, is the ion of the intact molecule: its $m/z$ gives the molar mass (built from the most abundant isotope of each element).
- The tallest peak, the **base peak**, is set to 100 %; it is often a fragment.
- **Fragments** come from breaking the weakest bonds into the most stable cations. Propanone ($M$ = 58) has its base peak at 43, $\\ce{CH3CO+}$; ethanol (46) at 31, $\\ce{CH2OH+}$; methylbenzene (92) at 91.

### Isotope patterns
Elements with two common isotopes stamp their signature on every ion that contains them:
- **Chlorine**, 76 % $\\ce{^35Cl}$ and 24 % $\\ce{^37Cl}$: peaks two units apart in about **3 : 1**. Two chlorines give M, M+2 and M+4 in about **9 : 6 : 1**.
- **Bromine**, almost 50 : 50 $\\ce{^79Br}$ and $\\ce{^81Br}$: M and M+2 of equal height; two bromines **1 : 2 : 1**.
- **Carbon**: each carbon has a 1.1 % chance of being $\\ce{^13C}$, so a molecule with $n$ carbons has an M+1 peak about $1.1n$ % of M — a quick carbon count.

The patterns follow from multiplying out $(a + b)^n$ ([[math:binomial-theorem]]); the simulation below builds them. The same abundances give the relative atomic mass of the element, $A_r = \\sum f_i m_i$, which is how the values in [the periodic table](#/tools/periodic) are measured ([[isotopes]]).

### Exact masses
Only carbon-12 has a whole-number mass. $\\ce{CO}$ (27.9949), $\\ce{N2}$ (28.0061) and $\\ce{C2H4}$ (28.0313) all have a nominal mass of 28, but a high-resolution instrument measuring to 0.0001 tells them apart — and gives the molecular formula of an unknown directly, completing what [[empirical-formula|elemental analysis]] started.

### Where it is used
Coupled to [[chromatography]] as GC–MS and LC–MS, it is the standard of proof in drug testing and anti-doping. It screens newborn blood spots for dozens of inherited disorders, identifies proteins by the masses of their fragments, dates carbon by counting $\\ce{^14C}$ atoms directly, and reveals where a food or a drug came from through its isotope ratios.
`,
  ideas: [
    'Molecules are ionised, accelerated, separated by mass-to-charge ratio and counted.',
    'The molecular ion gives the molar mass; fragments come from breaking weak bonds into stable cations.',
    'Chlorine gives M : M+2 ≈ 3 : 1, bromine ≈ 1 : 1; n carbons give an M+1 peak ≈ 1.1n % of M.',
    'Isotopic abundances give relative atomic masses: A_r = Σ fᵢmᵢ.',
    'High-resolution masses distinguish molecules of the same nominal mass and give molecular formulas.'
  ],
  pitfalls: [
    'The tallest peak is the molecular ion — The tallest is the base peak, often a fragment. The molecular ion is the highest-mass peak of the main cluster, and can be tiny.',
    'The molecular ion has the average molar mass — It is made of particular isotopes. $\\ce{CH3Cl}$ (average 50.49 g/mol) shows peaks at 50 and 52, none at 50.5.',
    'The instrument measures mass — It measures mass divided by charge. A protein carrying 20 charges appears at one twentieth of its mass.'
  ],
  formulas: [
    {
      name: 'Relative atomic mass from two isotopes',
      expr: 'Ar = f*m1 + (1 - f)*m2', tex: 'A_r = f\\,m_1 + (1 - f)\\,m_2',
      vars: {
        Ar: { name: 'average atomic mass', q: 'mass', unit: 'u', tex: 'A_r' },
        f: { name: 'abundance of isotope 1', q: 'ratio', unit: '%', value: 75.76, min: 0, max: 100 },
        m1: { name: 'mass of isotope 1', q: 'mass', unit: 'u', value: 34.969 },
        m2: { name: 'mass of isotope 2', q: 'mass', unit: 'u', value: 36.966 }
      },
      note: 'Defaults: chlorine-35 and chlorine-37, giving 35.45. For more isotopes, keep adding abundance × mass.',
      practice: { unknowns: ['Ar', 'f'] },
      stories: {
        Ar: 'An element has two isotopes, of mass {m1} (abundance {f}) and {m2}. What is its relative atomic mass?',
        f: 'An element with isotopes of mass {m1} and {m2} has a relative atomic mass of {Ar}. What is the abundance of the lighter isotope?'
      }
    },
    {
      name: 'Flight time in a time-of-flight analyser',
      expr: 't = L*sqrt(m/(2*z*qe*U))', tex: 't = L\\sqrt{\\frac{m}{2 z e U}}',
      vars: {
        t: { name: 'flight time', q: 'time', unit: 'µs' },
        L: { name: 'length of the flight tube', q: 'length', unit: 'm', value: 1.00 },
        m: { name: 'mass of the ion', q: 'mass', unit: 'u', value: 500 },
        z: { name: 'charge number of the ion', int: true, value: 1, min: 1 },
        qe: { const: 'qe' },
        U: { name: 'accelerating voltage', q: 'voltage', unit: 'kV', value: 20 }
      },
      note: 'Flight time grows as the square root of m/z, so four times the mass takes twice as long.',
      practice: { unknowns: ['t', 'm'] },
      stories: {
        t: 'An ion of mass {m} and charge number {z} is accelerated through {U} into a {L} flight tube. How long does it take to reach the detector?',
        m: 'An ion with charge number {z}, accelerated through {U}, takes {t} to cross a {L} tube. What is its mass?'
      }
    },
    {
      name: 'Carbon count from the M+1 peak',
      expr: 'r = nC*R13', tex: 'r = n_{\\ce{C}}\\, R_{13}',
      vars: {
        r: { name: 'height of the M+1 peak relative to M', q: 'ratio', unit: '%' },
        nC: { name: 'number of carbon atoms', int: true, value: 6, tex: 'n_{\\ce{C}}' },
        R13: { name: 'ratio of carbon-13 to carbon-12 in nature', q: 'ratio', unit: '%', value: 1.08, fixed: true, tex: 'R_{13}' }
      },
      note: 'An approximation: it ignores the small contributions of deuterium, nitrogen-15 and oxygen-17, and holds best below about 30 carbons.',
      practice: { unknowns: ['nC', 'r'] },
      stories: {
        nC: 'A molecular ion has an M+1 peak {r} as high as M. About how many carbon atoms does the molecule contain?',
        r: 'How tall is the M+1 peak, relative to M, for a molecule with {nC} carbon atoms?'
      }
    }
  ],
  examples: [
    {
      title: 'The atomic mass of chlorine',
      q: 'Natural chlorine is 75.76 % $\\ce{^35Cl}$ (34.969 u) and 24.24 % $\\ce{^37Cl}$ (36.966 u). What is its relative atomic mass?',
      steps: [
        '$A_r = 0.7576 \\times 34.969 + 0.2424 \\times 36.966$.',
        '$= 26.492 + 8.961 = 35.453$.'
      ],
      a: '35.45'
    },
    {
      title: 'The molecular-ion cluster of dichloromethane',
      q: 'Predict the relative heights of the peaks at m/z 84, 86 and 88 for $\\ce{CH2Cl2}$ (ignoring carbon-13).',
      steps: [
        'Each chlorine is $\\ce{^35Cl}$ with probability $a = 0.758$, $\\ce{^37Cl}$ with $b = 0.242$.',
        'Two chlorines: $(a + b)^2 = a^2 + 2ab + b^2 = 0.574 + 0.367 + 0.059$.',
        'm/z 84 ($\\ce{^35Cl2}$), 86 (one of each) and 88 ($\\ce{^37Cl2}$) in the ratio $100 : 64 : 10$ — close to 9 : 6 : 1.'
      ],
      a: '100 : 64 : 10 at m/z 84, 86 and 88.'
    },
    {
      title: 'A time-of-flight measurement',
      q: 'Singly charged ions of mass 500 u are accelerated through 20.0 kV into a 1.00 m flight tube. How long do they take? How long would ions of 2000 u take?',
      steps: [
        '$m = 500 \\times 1.6605 \\times 10^{-27} = 8.30 \\times 10^{-25}$ kg; $zeU = 1.602 \\times 10^{-19} \\times 2.00 \\times 10^4 = 3.20 \\times 10^{-15}$ J.',
        '$t = 1.00 \\times \\sqrt{8.30 \\times 10^{-25}/(2 \\times 3.20 \\times 10^{-15})} = 1.14 \\times 10^{-5}$ s $= 11.4$ µs.',
        'Four times the mass: twice the time, 22.8 µs. Ions a single mass unit apart arrive nanoseconds apart, which fast electronics resolve easily.'
      ],
      a: '11.4 µs; 22.8 µs for 2000 u.'
    }
  ],
  quiz: [
    { q: 'A molecular ion shows two peaks, two mass units apart, of almost equal height. Which element does the molecule most likely contain?', choices: ['chlorine', 'bromine', 'sulfur', 'nitrogen'], a: 1,
      why: 'Bromine is about 50.7 % $\\ce{^79Br}$ and 49.3 % $\\ce{^81Br}$, giving M and M+2 of nearly equal height. Chlorine gives 3 : 1.' },
    { q: 'Magnesium is 78.99 % $\\ce{^24Mg}$ (23.985 u), 10.00 % $\\ce{^25Mg}$ (24.986 u) and 11.01 % $\\ce{^26Mg}$ (25.983 u). What is its relative atomic mass?', answer: 24.31,
      why: '$0.7899 \\times 23.985 + 0.1000 \\times 24.986 + 0.1101 \\times 25.983 = 24.31$.' },
    { q: 'How can a high-resolution mass spectrometer tell $\\ce{CO}$ from $\\ce{N2}$, both of nominal mass 28?', choices: ['by their charges', 'their exact masses differ (27.9949 against 28.0061)', 'by their colours', 'it cannot'], a: 1,
      why: 'Atomic masses are not whole numbers (except carbon-12), so different formulas of the same nominal mass have slightly different exact masses.' },
    { q: 'In a time-of-flight analyser, heavier ions with the same charge arrive first.', a: false,
      why: 'All ions get the same kinetic energy, $zeU$, so heavier ones move more slowly and arrive later: $t \\propto \\sqrt{m/z}$.' },
    { q: 'The M+1 peak of a hydrocarbon is 6.5 % of the height of the molecular ion. About how many carbon atoms does it have?', answer: 6,
      why: 'Each carbon contributes about 1.1 %: $6.5/1.1 \\approx 6$. With M = 86 that fits hexane, $\\ce{C6H14}$.' }
  ],
  applications: [
    'Drug testing, anti-doping and forensic toxicology (GC–MS, LC–MS).',
    'Proteomics: identifying thousands of proteins in a cell extract.',
    'Newborn screening for inherited metabolic disorders from a dried blood spot.',
    'Radiocarbon dating by accelerator mass spectrometry, and isotope-ratio tracing of foods and climate records.'
  ],
  history: 'J. J. Thomson separated neon ions of masses 20 and 22 in 1913, the first evidence of isotopes in a stable element. His assistant Francis Aston built the mass spectrograph in 1919, found isotopes in dozens of elements and received the 1922 Nobel Prize in Chemistry. Electrospray, which opened the method to proteins, earned John Fenn a share of the 2002 prize.',
  sim: 'lab-mass-spec'
},

{
  id: 'chromatography', parent: 'analysis', title: 'Chromatography', level: 1,
  short: 'Separating a mixture by letting it be carried by a moving phase over a stationary one: components that cling more to the stationary phase travel more slowly, and so come apart.',
  keywords: ['chromatography', 'Rf value', 'retention factor', 'thin-layer chromatography', 'TLC', 'paper chromatography', 'column chromatography', 'gas chromatography', 'GC', 'HPLC', 'stationary phase', 'mobile phase', 'eluent', 'retention time', 'resolution', 'theoretical plates'],
  prereq: ['intermolecular-forces', 'molecular-polarity', 'solubility'],
  related: ['mass-spectrometry', 'percent-yield', 'measurement-uncertainty', 'equilibrium-constant'],
  body: `
Imagine a crowd walking down a street of shops. Everyone walks at the same speed, but some people stop at every window while others hardly glance at them. After a few hundred metres the window-shoppers have fallen far behind. Chromatography separates molecules the same way.

A **mobile phase** — a solvent, or a gas — flows over a **stationary phase**: paper, a thin layer of silica, or the packing of a column. Each molecule of the mixture continually passes back and forth between the two. It moves only while it is in the mobile phase, so the more it clings to the stationary phase, the slower it goes. The balance between the phases is an [[equilibrium-constant|equilibrium]] — the partition coefficient — and small differences in it, repeated thousands of times along the way, become large differences in position.

### Paper and thin-layer chromatography
Spot the mixture on a pencil line near the bottom of the plate, stand the plate in a little solvent below the line, cover, and let the solvent climb by capillary action. Stop when the front nears the top, and mark it. Each component has travelled a fixed fraction of the solvent's distance:

$$R_f = \\frac{\\text{distance moved by the spot}}{\\text{distance moved by the solvent front}}$$

between 0 (stuck at the start) and 1 (running with the front). On polar silica, **polar compounds cling and move little; non-polar ones run near the front**. A more polar solvent competes better for the silica and moves everything further. Colourless spots are shown with a UV lamp on a fluorescent plate, with iodine vapour, or with ninhydrin, which turns amino acids purple.

TLC is the organic chemist's everyday check: is the starting material used up, has a new product appeared, is the product one spot (pure) or several? Running an unknown beside a known sample on the same plate identifies it far more reliably than comparing $R_f$ values from different days.

### Columns, GC and HPLC
In a column the mixture is washed through a tube of packing and the components leave one after another, each at its own **retention time** $t_R$. A detector at the outlet draws the **chromatogram**: a peak for each component, whose area tells how much there is. Even a molecule that does not stick at all takes a time $t_M$ to get through, so the true measure of retention is the **retention factor** $k = (t_R - t_M)/t_M$, the ratio of the time spent in the stationary phase to the time spent moving. For a plate, $R_f = 1/(1 + k)$.
- **Gas chromatography (GC)**: an inert gas carries vaporised samples through a thin capillary coated inside with a liquid film, often 30 m long, in an oven. Blood alcohol, petrol composition, flavours and pesticide residues are measured this way.
- **High-performance liquid chromatography (HPLC)**: solvent is pumped at high pressure through columns of particles a few micrometres across. It is the standard method for the purity of medicines and for vitamins, dyes and toxins in food.

### Resolution
Bands spread as they travel — molecules take different paths and diffuse. Two peaks are cleanly separated when their distance is large compared with their widths:

$$R_s = \\frac{2\\,(t_2 - t_1)}{w_1 + w_2}$$

$R_s \\ge 1.5$ means baseline separation. Spreading is measured by the number of **theoretical plates**, $N = 16\\,(t_R/w)^2$; resolution grows with $\\sqrt N$, so doubling a column's length improves it by about 40 %. Changing the stationary phase or the solvent, which changes *which* compound sticks more, is often more powerful.

> [!tip] Coupled to a mass spectrometer, a chromatograph separates the mixture and the [[mass-spectrometry|mass spectrum]] of each peak identifies it — GC–MS and LC–MS are the workhorses of forensic and environmental laboratories.
`,
  ideas: [
    'Components partition between a moving and a stationary phase; the more they cling to the stationary phase, the slower they travel.',
    'On a plate, Rf = spot distance / solvent-front distance, between 0 and 1.',
    'On polar silica, polar compounds move least; a more polar eluent moves everything further.',
    'In a column, retention time and the retention factor k = (t_R − t_M)/t_M identify a component; peak area measures its amount.',
    'Resolution Rs = 2(t₂ − t₁)/(w₁ + w₂) ≥ 1.5 means baseline separation.'
  ],
  pitfalls: [
    'An Rf value identifies a compound on its own — It depends on the plate, the solvent, the temperature and how the plate was run. Run a known sample beside the unknown on the same plate.',
    'Drawing the baseline in ink, or below the solvent level — Ink contains dyes that run themselves; spots below the solvent surface dissolve into the reservoir instead of climbing the plate.',
    'A single spot or peak proves purity — Two compounds can run together under one set of conditions. Try a second solvent or a different column before calling a product pure.'
  ],
  formulas: [
    {
      name: 'Rf value',
      expr: 'Rf = d/ds', tex: 'R_f = \\frac{d}{d_s}',
      vars: {
        Rf: { name: 'retardation factor', tex: 'R_f' },
        d: { name: 'distance moved by the spot', q: 'length', unit: 'cm', value: 3.6 },
        ds: { name: 'distance moved by the solvent front', q: 'length', unit: 'cm', value: 8.0, tex: 'd_s' }
      },
      note: 'Both distances are measured from the baseline, to the centre of the spot.',
      stories: {
        Rf: 'On a TLC plate the solvent front has moved {ds} and a spot {d}. What is the Rf value of the spot?',
        d: 'A compound has an Rf of {Rf}. How far from the baseline will its spot be when the solvent has moved {ds}?'
      }
    },
    {
      name: 'Retention factor in a column',
      expr: 'k = (tR - tM)/tM', tex: 'k = \\frac{t_R - t_M}{t_M}',
      vars: {
        k: { name: 'retention factor' },
        tR: { name: 'retention time of the component', q: 'time', unit: 'min', value: 6.00, tex: 't_R' },
        tM: { name: 'dead time (an unretained compound)', q: 'time', unit: 'min', value: 1.20, tex: 't_M' }
      },
      note: '$k$ is the ratio of time spent in the stationary phase to time spent moving. Values between about 1 and 10 are ideal: fast enough, yet separated from the solvent peak.',
      stories: {
        k: 'In an HPLC run an unretained marker leaves at {tM} and a drug at {tR}. What is the retention factor of the drug?',
        tR: 'A column has a dead time of {tM}. When will a compound with retention factor {k} appear?'
      }
    },
    {
      name: 'Resolution of two peaks',
      expr: 'Rs = 2*(t2 - t1)/(w1 + w2)', tex: 'R_s = \\frac{2\\,(t_2 - t_1)}{w_1 + w_2}',
      vars: {
        Rs: { name: 'resolution', tex: 'R_s' },
        t2: { name: 'retention time of the later peak', q: 'time', unit: 'min', value: 6.60 },
        t1: { name: 'retention time of the earlier peak', q: 'time', unit: 'min', value: 6.00 },
        w1: { name: 'base width of the earlier peak', q: 'time', unit: 'min', value: 0.40 },
        w2: { name: 'base width of the later peak', q: 'time', unit: 'min', value: 0.44 }
      },
      note: 'Widths are measured at the baseline, between tangents to the sides of each peak. $R_s = 1.5$ leaves about 0.1 % overlap.',
      practice: { unknowns: ['Rs', 't2'] },
      stories: {
        Rs: 'Two GC peaks appear at {t1} and {t2}, with base widths of {w1} and {w2}. What is the resolution?',
        t2: 'A peak at {t1} has a base width of {w1}; the next peak will be {w2} wide. Where must it appear for a resolution of {Rs}?'
      }
    },
    {
      name: 'Number of theoretical plates',
      expr: 'N = 16*(tR/w)^2', tex: 'N = 16 \\left(\\frac{t_R}{w}\\right)^2',
      vars: {
        N: { name: 'number of theoretical plates' },
        tR: { name: 'retention time', q: 'time', unit: 'min', value: 6.00, tex: 't_R' },
        w: { name: 'base width of the peak', q: 'time', unit: 'min', value: 0.40 }
      },
      note: 'A measure of how little a column spreads its bands; modern capillary GC columns reach $10^5$ plates or more.',
      practice: { unknowns: ['N', 'w'] },
      stories: {
        N: 'A peak at {tR} has a base width of {w}. How many theoretical plates does the column have?',
        w: 'A column has {N} theoretical plates. How wide will a peak at {tR} be?'
      }
    }
  ],
  examples: [
    {
      title: 'Food colourings on a plate',
      q: 'A sweet\'s coating is spotted beside two permitted dyes. After development the solvent front is 8.0 cm from the baseline. The coating gives spots at 3.6 cm and 5.2 cm; the dyes run to 3.6 cm and 6.1 cm. What can you conclude?',
      steps: [
        'Rf values: coating 0.45 and 0.65; dyes 0.45 and 0.76.',
        'The first spot of the coating matches the first dye on the same plate.',
        'The second (Rf 0.65) matches neither: the coating contains a colouring that is not one of the two standards, to be identified with further standards or by LC–MS.'
      ],
      a: 'One component matches the first dye; the other is something else.'
    },
    {
      title: 'Are two GC peaks separated?',
      q: 'On a GC column with a dead time of 1.20 min, two compounds elute at 6.00 and 6.60 min with base widths of 0.40 and 0.44 min. Find their retention factors and the resolution. What would doubling the column length do?',
      steps: [
        '$k_1 = (6.00 - 1.20)/1.20 = 4.0$; $k_2 = (6.60 - 1.20)/1.20 = 4.5$.',
        '$R_s = 2(0.60)/(0.84) = 1.43$ — just short of baseline separation.',
        'Resolution grows as $\\sqrt{N}$ and $N$ is proportional to length: doubling the column gives $1.43 \\times \\sqrt 2 = 2.0$, at the cost of twice the analysis time.'
      ],
      a: 'k = 4.0 and 4.5; Rs = 1.43, rising to about 2.0 with a column twice as long.'
    }
  ],
  quiz: [
    { q: 'A mixture is run on a silica TLC plate with hexane as the solvent. Which component travels furthest?', choices: ['the most polar one', 'the least polar one', 'the one with the largest molar mass', 'they all travel equally'], a: 1,
      why: 'Silica is very polar and holds polar molecules back. Non-polar hexane carries the least polar component, which hardly sticks, furthest.' },
    { q: 'A spot travels 2.4 cm while the solvent front travels 6.0 cm. What is its Rf value?', answer: 0.40,
      why: '$R_f = 2.4/6.0 = 0.40$.' },
    { q: 'An Rf value can be greater than 1.', a: false,
      why: 'No component can travel further than the solvent carrying it, so $R_f$ lies between 0 and 1.' },
    { q: 'Why is the starting line drawn in pencil and placed above the solvent level?', choices: ['pencil is easier to see under UV', 'graphite does not dissolve and run, and spots above the solvent climb the plate instead of dissolving into the tank', 'ink would react with the silica', 'it makes the solvent rise faster'], a: 1,
      why: 'Ink contains dyes that would separate too. A spot below the surface would simply wash off into the solvent.' },
    { q: 'Two GC peaks overlap badly ($R_s$ = 0.8). Which change is most likely to help?', choices: ['injecting more sample', 'using a longer column or a stationary phase that holds the two compounds differently', 'using a faster carrier gas flow', 'raising the detector temperature'], a: 1,
      why: 'Resolution grows with the square root of column length, and a different stationary phase can change the selectivity. More sample broadens the peaks; faster flow usually worsens the separation.' }
  ],
  applications: [
    'Purity testing of medicines by HPLC, required for every batch released.',
    'Blood-alcohol and drug testing by GC and GC–MS.',
    'Checking food for pesticide residues, colourings and contaminants.',
    'Following reactions and purifying products by TLC and column chromatography in synthesis.'
  ],
  history: 'The Russian-Italian botanist Mikhail Tsvet separated leaf pigments on a column of powdered chalk in the early 1900s and named the method "colour writing". Archer Martin and Richard Synge developed partition chromatography in the 1940s (Nobel Prize in Chemistry 1952), and Martin and Anthony James introduced gas chromatography in 1952.',
  sim: 'lab-chromatography'
}

);
