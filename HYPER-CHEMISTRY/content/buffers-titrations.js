/* HYPER-CHEMISTRY · content/buffers-titrations.js — buffers, the Henderson–Hasselbalch
 * equation, titration curves and indicators. Simulations in sims/acids-bases.js. */
Hyper.add(

{
  id: 'buffers', parent: 'buffers-titrations', title: 'Buffers', level: 2,
  short: 'A buffer is a weak acid and its conjugate base together, in comparable amounts. Added acid or alkali is swapped for the weak partner, so the pH hardly moves — until one partner runs out.',
  keywords: ['buffer', 'buffer solution', 'buffer capacity', 'buffer range', 'conjugate pair', 'acetate buffer', 'phosphate buffer', 'Tris', 'HEPES', 'bicarbonate', 'blood pH', 'acidosis', 'alkalosis', 'ocean buffering'],
  prereq: ['weak-acids', 'weak-bases', 'le-chatelier'],
  related: ['henderson-hasselbalch', 'titration-curves', 'polyprotic-acids', 'common-ion-effect', 'enzyme-kinetics', 'salt-hydrolysis'],
  body: `
A **buffer** holds its pH nearly steady when acid or alkali is added. One drop of 1 M hydrochloric acid in 100 mL of pure water takes the pH from 7 to 3.3; the same drop in 100 mL of blood does nothing measurable. The trick is always the same: a [[weak-acids|weak acid]] and its conjugate base, both present in comparable amounts.

### How it works
Take acetic acid mixed with sodium acetate. The solution holds a large reserve of both $\\ce{CH3COOH}$ and $\\ce{CH3COO-}$:

- added acid is taken up by the base: $\\ce{H3O+ + CH3COO- -> CH3COOH + H2O}$;
- added alkali is taken up by the acid: $\\ce{OH- + CH3COOH -> CH3COO- + H2O}$.

Either way a strong acid or base is swapped for a weak one, and the pH depends only on the **ratio** of the two partners ([[henderson-hasselbalch]]):

$$\\mathrm{pH} = \\mathrm{p}K_a + \\log\\frac{[\\ce{A-}]}{[\\ce{HA}]}$$

A ratio changes slowly. 1.0 mmol of HCl added to 100 mL of buffer holding 10 mmol of each partner turns 10 : 10 into 9 : 11, and the pH moves from 4.76 to 4.67. The same acid in 100 mL of water gives pH 2.0. It is the [[common-ion-effect|common-ion effect]] and [[le-chatelier|Le Chatelier's principle]] at work: the large stock of $\\ce{A-}$ pushes the acid's ionisation back, so hydronium stays scarce.

### Capacity and range
A buffer is not a bottomless well. Its **capacity** $\\beta$ — the strong base per litre needed to raise the pH by one unit — is, leaving out water's own ions,

$$\\beta = \\ln 10\\; C\\,\\frac{K_a [\\ce{H3O+}]}{(K_a + [\\ce{H3O+}])^2}$$

where $C$ is the total concentration of the pair. It peaks at pH = $\\mathrm{p}K_a$, where it equals $0.576\\,C$, and falls to a third of that one unit away. Two rules follow:

- **Choose a pair whose $\\mathrm{p}K_a$ is within one unit of the pH you need.** Outside $\\mathrm{p}K_a \\pm 1$ one partner is scarce, and the buffer fails on that side.
- **The ratio sets the pH; the concentration sets the capacity.** Doubling both partners leaves the pH unchanged but doubles the acid or alkali the buffer can absorb. Diluting a buffer barely changes its pH — until it is so dilute that water's own ions compete.

Once one partner is used up the buffer is exhausted, and the pH swings as if it were not there: the steep part of a [[titration-curves|titration curve]].

| Buffer pair | $\\mathrm{p}K_a$ (25 °C) | Useful range | Used in |
|---|---|---|---|
| acetic acid / acetate | 4.76 | 3.8 – 5.8 | food, dyeing, laboratories |
| $\\ce{CO2}$ / $\\ce{HCO3-}$ | 6.35 (6.1 in blood) | open system | blood, oceans |
| $\\ce{H2PO4-}$ / $\\ce{HPO4^2-}$ | 7.20 | 6.2 – 8.2 | cells, cell culture, drinks |
| Tris-H⁺ / Tris | 8.07 | 7.1 – 9.1 | biochemistry (falls 0.03 per °C) |
| $\\ce{NH4+}$ / $\\ce{NH3}$ | 9.25 | 8.3 – 10.3 | metal analysis, cleaners |
| $\\ce{HCO3-}$ / $\\ce{CO3^2-}$ | 10.33 | 9.3 – 11.3 | laundry, alkaline baths |

### The buffer in your blood
Blood must stay between pH 7.35 and 7.45; outside roughly 6.8–7.8 life is in danger. Its main buffer is dissolved carbon dioxide with hydrogencarbonate, apparent $\\mathrm{p}K_a$ 6.1 at body temperature. With 24 mmol/L of $\\ce{HCO3-}$ and 1.2 mmol/L of dissolved $\\ce{CO2}$ (from 40 mmHg of $\\ce{CO2}$ in the lungs) the ratio is 20 : 1 and the pH 7.40. On paper that is a poor buffer, far from its $\\mathrm{p}K_a$ — but it is an **open** system: the lungs adjust $\\ce{CO2}$ within minutes and the kidneys adjust $\\ce{HCO3-}$ over days. Breathe too little and $\\ce{CO2}$ builds up (respiratory acidosis); breathe too fast and the pH rises (respiratory alkalosis) — the tingling fingers of panic breathing. Inside cells, phosphate and the histidine groups of proteins do the buffering.

### Buffers at work
- **Oceans**: the carbonate system buffers sea water near pH 8.1; the extra $\\ce{CO2}$ we emit is slowly using up that capacity.
- **Laboratories**: pH meters are calibrated with standard buffers, and enzymes are studied in phosphate, Tris or HEPES because they lose activity outside a narrow pH window ([[enzyme-kinetics]]).
- **Industry**: electroplating baths, textile dyeing, fermentation, shampoos, eye drops and many medicines are buffered; soil scientists speak of a soil's buffer capacity when working out how much lime it needs.
`,
  ideas: [
    'A buffer contains a weak acid and its conjugate base in comparable amounts.',
    'Added H₃O⁺ is converted to the weak acid, added OH⁻ to the weak base, so the pH changes only through the ratio.',
    'The pH is set by pKa and the ratio [A⁻]/[HA]; the capacity by the total concentration.',
    'Capacity is greatest at pH = pKa; a buffer works within about pKa ± 1.',
    'Once one partner is used up, the buffer is exhausted and the pH swings freely.'
  ],
  pitfalls: [
    'A buffer keeps the pH constant whatever you add — Only within its capacity. In 100 mL of 0.1 M acetate buffer (5 mmol of each partner) the first 4 mmol of acid lower the pH by about one unit; the fifth sends it from 3.8 to 2.9.',
    'Buffers are neutral solutions — A buffer can sit at any pH; it is set by the pKa of the pair and their ratio. An acetate buffer is at pH 4–6, an ammonia buffer at 8–10.',
    'A more concentrated buffer has a different pH — Concentration sets the capacity, not the pH: at the same ratio, 0.01 M and 1 M acetate buffers both sit near pH 4.76.'
  ],
  formulas: [
    {
      name: 'pH of a buffer after adding strong acid',
      expr: 'pH = pKa + log((nA - n)/(nHA + n))', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{n_{\\ce{A-}} - n}{n_{\\ce{HA}} + n}',
      vars: {
        pH: { name: 'pH after the addition', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the weak acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        nA: { name: 'conjugate base in the buffer', q: 'amount', unit: 'mmol', value: 10, tex: 'n_{\\ce{A-}}' },
        nHA: { name: 'weak acid in the buffer', q: 'amount', unit: 'mmol', value: 10, tex: 'n_{\\ce{HA}}' },
        n: { name: 'strong acid added', q: 'amount', unit: 'mmol', value: 1.0 }
      },
      note: 'Each mole of H₃O⁺ turns a mole of A⁻ into HA. Only the ratio of amounts counts, so the volume drops out. For added strong base, swap the signs of n. Valid while n is well below the base present.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A buffer contains {nHA} of a weak acid ($\\mathrm{p}K_a$ = {pKa}) and {nA} of its sodium salt. What is its pH after {n} of hydrochloric acid is added?',
        n: 'A buffer holds {nHA} of a weak acid ($\\mathrm{p}K_a$ = {pKa}) and {nA} of its conjugate base. How much strong acid brings it to pH {pH}?'
      }
    },
    {
      name: 'Buffer capacity',
      expr: 'beta = ln(10)*C*Ka*H/(Ka + H)^2', tex: '\\beta = \\ln 10\\; C\\,\\frac{K_a\\,\\mathrm{[\\ce{H3O+}]}}{\\left(K_a + \\mathrm{[\\ce{H3O+}]}\\right)^2}',
      vars: {
        beta: { name: 'buffer capacity: strong base per litre per pH unit', q: 'concentration', unit: 'M', tex: '\\beta' },
        C: { name: 'total concentration of the buffer pair', q: 'concentration', unit: 'M', value: 0.10 },
        Ka: { name: 'acid constant', value: 1.75e-5, tex: 'K_a' },
        H: { name: '[H₃O⁺] (mol/L)', value: 1.75e-5, tex: '\\mathrm{[\\ce{H3O+}]}' }
      },
      note: 'Water\'s own contribution, ln 10 · ([H₃O⁺] + [OH⁻]), is left out: it only matters below pH 3 or above pH 11. Defaults: 0.10 M acetate buffer at pH = pKa, the maximum, 0.576 C.',
      practice: { unknowns: ['beta', 'C'] },
      stories: {
        beta: 'A buffer pair totals {C}, and its weak acid has $K_a$ = {Ka}. What is the buffer capacity when the hydronium-ion concentration is {H} mol/L?',
        C: 'What total concentration of an acid with $K_a$ = {Ka} gives a buffer capacity of {beta} at $[\\ce{H3O+}]$ = {H} mol/L?'
      }
    }
  ],
  examples: [
    {
      title: 'Water against a buffer',
      q: '1.0 mL of 1.0 M HCl is added (a) to 100 mL of pure water, (b) to 100 mL of a buffer that is 0.10 M in acetic acid and 0.10 M in sodium acetate. Find the pH in each case.',
      steps: [
        '(a) 1.0 mmol of H₃O⁺ in 101 mL: $[\\ce{H3O+}] = 9.9\\times10^{-3}$ mol/L, pH 2.00 — down five units from 7.',
        '(b) The buffer holds 10 mmol of each partner. The acid converts 1.0 mmol of acetate into acetic acid: 9.0 mmol $\\ce{CH3COO-}$, 11.0 mmol $\\ce{CH3COOH}$.',
        { text: 'Only the ratio matters:', tex: '\\mathrm{pH} = 4.76 + \\log\\frac{9.0}{11.0} = 4.76 - 0.09 = 4.67' },
        'The exact charge-balance calculation agrees: 4.67.'
      ],
      a: 'Water: pH 7.00 → 2.00. Buffer: 4.76 → 4.67.'
    },
    {
      title: 'Making up a buffer',
      q: 'How much anhydrous sodium acetate (82.03 g/mol) must be dissolved in 500 mL of 0.10 M acetic acid to make a buffer of pH 5.00?',
      steps: [
        'Required ratio: $[\\ce{A-}]/[\\ce{HA}] = 10^{\\,5.00 - 4.76} = 10^{0.24} = 1.74$.',
        'Acetic acid present: $0.500 \\times 0.10 = 0.050$ mol, so acetate needed: $1.74 \\times 0.050 = 0.0869$ mol.',
        'Mass: $0.0869 \\times 82.03 = 7.13$ g. In practice you would check with a pH meter and trim with a little acid or alkali.'
      ],
      a: 'About 7.1 g of sodium acetate.'
    }
  ],
  quiz: [
    { q: 'Which mixture is a buffer?', choices: ['$\\ce{HCl}$ and $\\ce{NaCl}$', '$\\ce{CH3COOH}$ and $\\ce{CH3COONa}$', '$\\ce{NaOH}$ and $\\ce{NaCl}$', '$\\ce{HNO3}$ and $\\ce{KNO3}$'], a: 1,
      why: 'A buffer needs a weak acid and its conjugate base. Chloride and nitrate are conjugates of strong acids and cannot take up protons.' },
    { q: 'A buffer is diluted tenfold with pure water. What happens?', choices: ['the pH barely changes, but the capacity falls tenfold', 'the pH rises by one unit', 'the pH falls by one unit', 'nothing at all changes'], a: 0,
      why: 'Both partners are diluted equally, so their ratio — and the pH — stays the same. But there is now a tenth as much of each per litre to absorb acid or alkali.' },
    { q: 'What is the maximum capacity, in mol/L per pH unit, of a buffer whose partners total 0.10 mol/L?', answer: 0.0576,
      why: 'At pH = pKa, Ka = [H₃O⁺] and β = ln 10 · C/4 = 2.303 × 0.10/4 = 0.0576 mol/L per pH unit.' },
    { q: 'An acetate buffer (pKa 4.76) is a good choice to hold a cell culture at pH 7.4.', a: false,
      why: 'At pH 7.4 the ratio of acetate to acetic acid would be about 440 : 1 — hardly any acid is left to absorb alkali. Use a pair with pKa near 7.4, such as phosphate (7.20) or HEPES (about 7.5).' },
    { q: '100 mL of buffer contains 5.0 mmol of acetic acid and 5.0 mmol of acetate. You add 6.0 mmol of HCl. The pH ends up near…', choices: ['4.7: the buffer copes', '3.8', '2.0: the buffer is exhausted', '7.0'], a: 2,
      why: 'Only 5.0 mmol of acetate is available. The last 1.0 mmol of acid stays as H₃O⁺ in 106 mL, about 0.01 mol/L: pH ≈ 2.0.' }
  ],
  applications: [
    'Blood and body fluids: the carbonate, phosphate and protein buffers keep pH within 7.35–7.45.',
    'Cell culture and enzyme work in phosphate, Tris and HEPES buffers.',
    'Calibration buffers (pH 4.01, 7.00, 10.01) for pH meters.',
    'Buffered medicines, eye drops, shampoos and electroplating baths.'
  ],
  sim: 'ab-buffer'
},

{
  id: 'henderson-hasselbalch', parent: 'buffers-titrations', title: 'The Henderson–Hasselbalch equation', level: 2,
  short: 'pH = pKa + log([A⁻]/[HA]): the acid constant rewritten in logarithms. It gives the pH of a buffer from the ratio of its partners, and tells you how much of any weak acid is ionised at a given pH.',
  keywords: ['Henderson–Hasselbalch', 'Henderson-Hasselbalch', 'buffer equation', 'pKa', 'ratio', 'fraction ionised', 'half-equivalence', 'ion trapping', 'drug absorption', 'blood gas', 'bicarbonate', 'pCO2'],
  prereq: ['weak-acids', 'buffers', 'math:logarithms'],
  related: ['titration-curves', 'indicators', 'polyprotic-acids', 'amino-acids-proteins', 'math:logarithmic-scales'],
  body: `
The pH of a buffer, of a half-neutralised acid and of a drug in the bloodstream all follow from one rearrangement of the acid constant. Start from the [[weak-acids|definition of $K_a$]] and solve for hydronium:

$$[\\ce{H3O+}] = K_a\\,\\frac{[\\ce{HA}]}{[\\ce{A-}]}$$

Take minus the [[math:logarithms|logarithm]] of both sides:

$$\\mathrm{pH} = \\mathrm{p}K_a + \\log\\frac{[\\ce{A-}]}{[\\ce{HA}]}$$

This is the **Henderson–Hasselbalch equation**: the pH is the $\\mathrm{p}K_a$ plus a correction that depends only on the **ratio** of base to acid.

### Reading it
| $\\mathrm{pH} - \\mathrm{p}K_a$ | $[\\ce{A-}] : [\\ce{HA}]$ | fraction as $\\ce{A-}$ |
|---|---|---|
| −2 | 1 : 100 | 1 % |
| −1 | 1 : 10 | 9 % |
| 0 | 1 : 1 | 50 % |
| +1 | 10 : 1 | 91 % |
| +2 | 100 : 1 | 99 % |

- At **pH = $\\mathrm{p}K_a$** the acid is exactly half ionised. That is how $\\mathrm{p}K_a$ values are measured: neutralise half of the acid and read the pH ([[titration-curves]]).
- Each pH unit multiplies the ratio by ten, so a compound is essentially all acid two units below its $\\mathrm{p}K_a$ and all base two units above.
- Only the ratio enters, so amounts (mol) work as well as concentrations — both partners share the same volume.

### When it works, and when it fails
The rearrangement is exact, but in practice we put in the concentrations we **made up**, not those at equilibrium. That is fine when both partners are far more concentrated than $[\\ce{H3O+}]$ and $[\\ce{OH-}]$, so that ionisation hardly shifts them. It goes wrong:

- for **dilute** buffers: $10^{-4}$ M acetic acid with $10^{-4}$ M acetate is predicted at pH 4.76 but really sits at 4.87;
- for **fairly strong weak acids** ($\\mathrm{p}K_a$ below about 3) or very weak ones (above about 11), where the acid or the base reacts appreciably with water;
- for **extreme ratios**, beyond about 10 : 1 either way, where the scarce partner is changed noticeably by ionisation.

In salty solutions — sea water, blood, concentrated buffers — ions shield one another and the effective $\\mathrm{p}K_a$ shifts by 0.1 to 0.3. That is why carbonate's is 6.1 in blood plasma and phosphate's nearer 6.8 inside cells, rather than the textbook 6.35 and 7.20.

### Drugs, membranes and ion trapping
Cell membranes let neutral molecules through far more easily than ions. A weak-acid drug is neutral below its $\\mathrm{p}K_a$ and ionised above it. Aspirin ($\\mathrm{p}K_a$ ≈ 3.5) is 99 % un-ionised in the stomach at pH 1.5 and is absorbed there; in blood at pH 7.4 it is 99.99 % ionised and stays in the plasma. Weak bases behave the opposite way. The same arithmetic explains why urine is made alkaline to speed the excretion of an aspirin overdose, and why local anaesthetics — weak bases — work poorly in inflamed, acidic tissue.

### The clinical form
Doctors write it for blood with the dissolved carbon dioxide expressed through its partial pressure:

$$\\mathrm{pH} = 6.1 + \\log\\frac{[\\ce{HCO3-}]}{0.0301\\,p_{\\ce{CO2}}}$$

with $[\\ce{HCO3-}]$ in mmol/L and $p_{\\ce{CO2}}$ in mmHg (the factor is 0.226 with the pressure in kPa). Normal values, 24 mmol/L and 40 mmHg, give pH 7.40. A blood-gas analyser reports all three numbers, and from them a doctor reads whether a disturbance comes from the lungs ($p_{\\ce{CO2}}$) or from the kidneys and metabolism ($\\ce{HCO3-}$).
`,
  ideas: [
    'pH = pKa + log([A⁻]/[HA]) is the Ka expression in logarithmic form.',
    'At pH = pKa the two forms are equal; each pH unit changes their ratio tenfold.',
    'Only the ratio matters, so amounts can replace concentrations.',
    'It uses the made-up concentrations, so it fails for dilute buffers, extreme ratios and acids with pKa below about 3.',
    'It predicts how much of a drug, amino acid or indicator is ionised at any pH.'
  ],
  pitfalls: [
    'The ratio is acid over base — It is base over acid, [A⁻]/[HA]. With more base than acid the pH must be above pKa, so the log must be positive.',
    'It gives the pH of a weak acid on its own — With no A⁻ added the log of zero is meaningless. For the acid alone use Ka = x²/(C − x).',
    'pKa is the pH of the buffer — Only when the two partners are equal. A 3 : 1 base-to-acid mixture sits 0.48 units above pKa.'
  ],
  derivation: {
    title: 'From Ka to the Henderson–Hasselbalch equation',
    steps: [
      { text: 'Start from the acid constant of $\\ce{HA + H2O <=> H3O+ + A-}$:', tex: 'K_a = \\frac{[\\ce{H3O+}][\\ce{A-}]}{[\\ce{HA}]}' },
      { text: 'Solve for the hydronium-ion concentration:', tex: '[\\ce{H3O+}] = K_a\\,\\frac{[\\ce{HA}]}{[\\ce{A-}]}' },
      { text: 'Take the logarithm of both sides and change sign; the log of a product is the sum of the logs:', tex: '-\\log[\\ce{H3O+}] = -\\log K_a - \\log\\frac{[\\ce{HA}]}{[\\ce{A-}]}' },
      { text: 'Recognise pH and $\\mathrm{p}K_a$, and turn the fraction over to change the sign of its logarithm:', tex: '\\mathrm{pH} = \\mathrm{p}K_a + \\log\\frac{[\\ce{A-}]}{[\\ce{HA}]}' }
    ]
  },
  formulas: [
    {
      name: 'The Henderson–Hasselbalch equation',
      expr: 'pH = pKa + log(B/A)', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{\\mathrm{[\\ce{A-}]}}{\\mathrm{[\\ce{HA}]}}',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the weak acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        B: { name: 'conjugate base [A⁻]', q: 'concentration', unit: 'M', value: 0.15, tex: '\\mathrm{[\\ce{A-}]}' },
        A: { name: 'weak acid [HA]', q: 'concentration', unit: 'M', value: 0.20, tex: '\\mathrm{[\\ce{HA}]}' }
      },
      note: 'Only the ratio enters, so any concentration unit works as long as both are in the same one. Defaults: 0.20 M acetic acid with 0.15 M sodium acetate.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A buffer is {A} in a weak acid with $\\mathrm{p}K_a$ = {pKa} and {B} in its conjugate base. What is its pH?',
        B: 'What concentration of conjugate base must be added to {A} of a weak acid ($\\mathrm{p}K_a$ = {pKa}) to make a buffer of pH {pH}?'
      }
    },
    {
      name: 'Fraction of a weak acid that is ionised',
      expr: 'f = 1/(1 + 10^(pKa - pH))', tex: 'f = \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_a - \\mathrm{pH}}}',
      vars: {
        f: { name: 'fraction present as A⁻', q: 'ratio', unit: '%' },
        pKa: { name: 'pKa of the acid', value: 3.5, tex: '{\\mathrm{p}K}_a' },
        pH: { name: 'pH of the surroundings', value: 1.5, tex: '\\mathrm{pH}' }
      },
      note: 'For a weak base, the fraction still carrying its proton (BH⁺) is 1 − f with the pKa of BH⁺. Defaults: aspirin in the stomach.',
      practice: { unknowns: ['f', 'pH'] },
      stories: {
        f: 'A drug is a weak acid with $\\mathrm{p}K_a$ = {pKa}. What percentage of it is ionised at pH {pH}?',
        pH: 'At what pH is an acid with $\\mathrm{p}K_a$ = {pKa} {f} ionised?'
      }
    },
    {
      name: 'Blood pH from hydrogencarbonate and CO₂',
      expr: 'pH = pKa + log(HCO3/(s*pCO2))', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{\\mathrm{[\\ce{HCO3-}]}}{s\\,p_{\\ce{CO2}}}',
      vars: {
        pH: { name: 'blood pH', tex: '\\mathrm{pH}', min: 6.8, max: 7.8 },
        pKa: { name: 'apparent pKa of CO₂ in plasma at 37 °C', value: 6.1, fixed: true, tex: '{\\mathrm{p}K}_a' },
        HCO3: { name: 'plasma hydrogencarbonate', q: 'concentration', unit: 'mM', value: 24, tex: '\\mathrm{[\\ce{HCO3-}]}' },
        s: { name: 'solubility of CO₂ in plasma (0.0301 mmol/L per mmHg)', unit: 'mol/(m³·Pa)', value: 2.2577e-4, fixed: true, tex: 's' },
        pCO2: { name: 'partial pressure of CO₂', q: 'pressure', unit: 'mmHg', value: 40, tex: 'p_{\\ce{CO2}}' }
      },
      note: 'The clinical form. Enter the CO₂ pressure in mmHg or kPa (normal 35–45 mmHg, 4.7–6.0 kPa); normal hydrogencarbonate is 22–26 mmol/L. The pH is bounded to 6.8–7.8, the range compatible with life.',
      practice: { unknowns: ['pH', 'pCO2', 'HCO3'] },
      stories: {
        pH: 'A blood-gas analysis shows hydrogencarbonate {HCO3} and $p_{\\ce{CO2}}$ = {pCO2}. What is the blood pH?',
        pCO2: 'A patient has hydrogencarbonate {HCO3} and blood pH {pH}. What is the partial pressure of CO₂?',
        HCO3: 'A patient has $p_{\\ce{CO2}}$ = {pCO2} and blood pH {pH}. What is the hydrogencarbonate concentration?'
      }
    }
  ],
  examples: [
    {
      title: 'An acetate buffer',
      q: 'What is the pH of a solution that is 0.20 M in acetic acid and 0.15 M in sodium acetate?',
      steps: [
        'Both partners are far more concentrated than the hydronium ion will be, so the made-up concentrations can be used.',
        { text: 'Henderson–Hasselbalch:', tex: '\\mathrm{pH} = 4.76 + \\log\\frac{0.15}{0.20} = 4.76 - 0.125 = 4.64' }
      ],
      a: 'pH 4.64 — a little below pKa, since there is more acid than base.'
    },
    {
      title: 'Blood gases',
      q: 'Normal blood has $[\\ce{HCO3-}] = 24$ mmol/L and $p_{\\ce{CO2}} = 40$ mmHg. What is its pH, and what does it become if poor breathing raises $p_{\\ce{CO2}}$ to 60 mmHg before the kidneys respond?',
      steps: [
        'Dissolved CO₂: $0.0301 \\times 40 = 1.20$ mmol/L. Ratio $24/1.20 = 20$.',
        'pH = 6.1 + log 20 = 6.1 + 1.30 = 7.40.',
        'At 60 mmHg: dissolved CO₂ = 1.81 mmol/L, ratio 13.3, pH = 6.1 + 1.12 = 7.22.'
      ],
      a: 'pH 7.40 normally; 7.22 with the CO₂ retained — a respiratory acidosis.'
    },
    {
      title: 'Aspirin in the stomach and in the blood',
      q: 'Aspirin has $\\mathrm{p}K_a$ ≈ 3.5. What fraction is un-ionised in the stomach (pH 1.5) and in blood (pH 7.4)?',
      steps: [
        'Stomach: $[\\ce{A-}]/[\\ce{HA}] = 10^{\\,1.5 - 3.5} = 0.01$, so 1 % is ionised and 99 % neutral — free to cross the stomach lining.',
        'Blood: $10^{\\,7.4 - 3.5} = 10^{3.9} \\approx 7900$, so only 1 part in 7900 (0.013 %) is neutral.'
      ],
      a: '99 % un-ionised in the stomach, 0.013 % in blood: absorbed in one, trapped in the other.'
    }
  ],
  quiz: [
    { q: 'In a buffer at pH = $\\mathrm{p}K_a$…', choices: ['[HA] = [A⁻]', 'all the acid is ionised', '[H₃O⁺] = [OH⁻]', 'the capacity is zero'], a: 0,
      why: 'With pH = pKa the log term is zero, so the ratio is 1: equal amounts of acid and conjugate base. This is also where the capacity is largest.' },
    { q: 'A phosphate buffer ($\\mathrm{p}K_{a2}$ = 7.20) is to be made at pH 7.40. What ratio $[\\ce{HPO4^2-}]/[\\ce{H2PO4-}]$ is needed?', answer: 1.58,
      why: 'log(ratio) = 7.40 − 7.20 = 0.20, so the ratio is 10^0.20 = 1.58.' },
    { q: 'The Henderson–Hasselbalch equation can use amounts in moles instead of concentrations.', a: true,
      why: 'Both partners are in the same volume, which cancels in the ratio. That is why buffer problems can be worked in millimoles.' },
    { q: 'A weak-acid drug with $\\mathrm{p}K_a$ 4.5 crosses membranes as its neutral form. Where is it mainly neutral?', choices: ['in the stomach, pH about 2', 'in blood, pH 7.4', 'in the small intestine, pH 7–8', 'equally everywhere'], a: 0,
      why: 'Two and a half units below its pKa, only about 0.3 % is ionised. At pH 7.4 almost all of it is the anion.' },
    { q: 'At a pH one unit below $\\mathrm{p}K_a$, what fraction of a weak acid is ionised?', choices: ['about 9 %', 'about 1 %', '10 %', '50 %'], a: 0,
      why: 'The ratio [A⁻]/[HA] is 1 : 10, so the ionised fraction is 1/11 ≈ 9 %.' }
  ],
  applications: [
    'Making up laboratory buffers to a target pH.',
    'Interpreting blood gases: pH, pCO₂ and hydrogencarbonate in intensive care.',
    'Pharmacology: predicting where drugs are absorbed, trapped and excreted.',
    'Protein chemistry: the charge of amino-acid side chains at a given pH.'
  ],
  history: 'Lawrence J. Henderson, working on the acid–base balance of blood, wrote the relation for the hydrogen-ion concentration in 1908. Karl Albert Hasselbalch recast it in Sørensen\'s new logarithmic pH notation in 1916 — the form used ever since.',
  sim: { id: 'ab-species', params: { acid: 'acetic', pH: 4.76 } }
},

{
  id: 'titration-curves', parent: 'buffers-titrations', title: 'Titration curves', level: 2,
  short: 'A titration curve plots pH against the volume of titrant added. Its shape — the starting pH, the flat buffer region, the jump at equivalence — reveals the kind of acid or base, its pKa, and which indicator will show the end point.',
  keywords: ['titration curve', 'equivalence point', 'end point', 'half-equivalence point', 'burette', 'titrant', 'analyte', 'strong acid strong base', 'weak acid strong base', 'weak base strong acid', 'polyprotic titration', 'alkalinity', 'potentiometric titration', 'conductometric titration', 'first derivative'],
  prereq: ['titration-calculations', 'henderson-hasselbalch', 'salt-hydrolysis'],
  related: ['indicators', 'polyprotic-acids', 'strong-acids-bases', 'buffers', 'limiting-reagent', 'math:derivative', 'math:higher-derivatives'],
  body: `
In a titration a solution of known concentration — the **titrant**, in a burette — is added to a measured volume of sample until the reaction between them is exactly complete: the **equivalence point**. [[titration-calculations|Titration calculations]] turn the volume used into a concentration. The **titration curve**, pH against volume added, shows what happens on the way and tells you how to see the end.

### Strong acid with strong base
25.0 mL of 0.100 M HCl titrated with 0.100 M NaOH:

- At the start, pH 1.00.
- As base goes in the acid is used up, yet the pH rises only slowly — 1.95 at 20 mL, 3.0 at 24.5 mL. A logarithm hides a lot of change.
- Around 25.00 mL it leaps: one drop (0.05 mL) short of equivalence the pH is 4.0, one drop past it 10.0. At equivalence the flask holds only NaCl and water: pH 7.00.
- After that, excess hydroxide sets the pH, which levels off towards 12.5.

The jump is so steep that any indicator changing between pH 4 and 10 marks the end point within a drop. Dilute both solutions tenfold and the same two drops only span pH 5 to 9; at $10^{-4}$ M there is hardly any jump left.

### Weak acid with strong base
25.0 mL of 0.100 M acetic acid with 0.100 M NaOH looks different:

1. **Start**: pH 2.88, from the [[weak-acids|weak acid]] alone.
2. **Buffer region**: the base turns $\\ce{CH3COOH}$ into $\\ce{CH3COO-}$ and the mixture is a [[buffers|buffer]], so the curve is flat. Half-way, at 12.5 mL, there is as much acetate as acid and **pH = $\\mathrm{p}K_a$ = 4.76** ([[henderson-hasselbalch]]) — the standard way to measure a $\\mathrm{p}K_a$.
3. **Equivalence** at 25.0 mL: the flask holds 0.050 M sodium acetate, a [[salt-hydrolysis|basic salt]], so the pH is **8.73**, not 7.
4. **Excess base**: the same curve as for the strong acid.

The jump is shorter (about 7.5 to 10 across the same two drops) and lies on the alkaline side: phenolphthalein (8.2–10.0) is the right [[indicators|indicator]], while methyl red would change in the buffer region, long before equivalence. The weaker the acid, the smaller the jump; at 0.1 M, acids with $\\mathrm{p}K_a$ much above 7 no longer give a usable colour change.

### Weak base with strong acid
Ammonia titrated with hydrochloric acid is the mirror image. It starts at pH 11.1, is buffered around $\\mathrm{p}K_a(\\ce{NH4+}) = 9.25$ half-way, and reaches equivalence at pH 5.3, where the flask holds ammonium chloride. Methyl red (4.4–6.2) fits; phenolphthalein would fade far too early.

### Polyprotic acids and bases
A [[polyprotic-acids|polyprotic acid]] gives one jump per proton, provided successive $\\mathrm{p}K_a$ values differ by about three units or more. Phosphoric acid (2.15, 7.20, 12.35) shows jumps at the first equivalence point (pH ≈ 4.7) and the second (≈ 9.7), but none at the third: $\\ce{HPO4^2-}$ is too weak an acid to stand out against water. Sodium carbonate titrated with acid gives two end points, near pH 8.3 ($\\ce{CO3^2- -> HCO3-}$, phenolphthalein) and near 4 ($\\ce{HCO3- -> CO2}$, methyl orange). Water chemists use exactly these two end points to report the **alkalinity** of drinking and boiler water.

### Finding the end point
The **equivalence point** belongs to the chemistry; the **end point** is what you observe — an indicator's colour change, or the steepest point of a curve recorded with a pH meter. Automatic titrators find the volume where the slope $d\\mathrm{pH}/dV$ ([[math:derivative|derivative]]) is largest, which is where the [[math:higher-derivatives|second derivative]] passes through zero. A third way follows the electrical conductivity: hydronium and hydroxide conduct far better than other ions, so in a strong acid–strong base titration the conductance falls to a sharp minimum at equivalence — handy for coloured or cloudy samples.

Titrations with pH detection measure the acidity of wine and fruit juice, the acid number of engine oil and biodiesel, the strength of vinegar and cleaning products, and — in the Kjeldahl method — the protein content of food, through the ammonia it releases.
`,
  ideas: [
    'A titration curve plots pH against titrant volume; the equivalence point sits in the middle of the steep jump.',
    'Strong acid with strong base: equivalence at pH 7 and a large jump.',
    'Weak acid with strong base: a buffer region, pH = pKa half-way, and equivalence above pH 7.',
    'Weak base with strong acid: equivalence below pH 7.',
    'Choose an indicator whose colour change lies inside the jump.'
  ],
  pitfalls: [
    'The equivalence point is always at pH 7 — Only for strong acid with strong base. The salt formed from a weak acid is basic (8.7 for acetic acid), from a weak base acidic (5.3 for ammonia).',
    'The end point is the equivalence point — The end point is what the indicator or meter shows; a well-chosen indicator makes the difference a fraction of a drop, a badly chosen one several millilitres.',
    'Half-way to equivalence, half the pH change has happened — Half-way, pH = pKa: the pH has barely moved from its start because the buffer is at its strongest.'
  ],
  formulas: [
    {
      name: 'Volume of titrant to reach equivalence',
      expr: 'Veq = n*Ca*Va/Cb', tex: 'V_{eq} = \\frac{n\\,C_a V_a}{C_b}',
      vars: {
        Veq: { name: 'titrant volume at equivalence', q: 'volume', unit: 'mL', tex: 'V_{eq}' },
        n: { name: 'protons titrated per molecule of sample', int: true, value: 1 },
        Ca: { name: 'sample concentration', q: 'concentration', unit: 'M', value: 0.100, tex: 'C_a' },
        Va: { name: 'sample volume', q: 'volume', unit: 'mL', value: 25.0, tex: 'V_a' },
        Cb: { name: 'titrant concentration', q: 'concentration', unit: 'M', value: 0.100, tex: 'C_b' }
      },
      note: 'For a base titrated with acid swap the roles. n = 2 for the second end point of H₂SO₄ or Na₂CO₃.',
      practice: { unknowns: ['Veq', 'Ca'] },
      stories: {
        Veq: '{Va} of a {Ca} acid is titrated with {Cb} sodium hydroxide, which removes {n} proton(s) from each acid molecule. At what volume is the equivalence point?',
        Ca: '{Va} of an acid solution needs {Veq} of {Cb} NaOH to reach equivalence ({n} proton titrated per molecule). What is the acid\'s concentration?'
      }
    },
    {
      name: 'pH in the buffer region (weak acid with strong base)',
      expr: 'pH = pKa + log(V/(Veq - V))', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log\\frac{V}{V_{eq} - V}',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        V: { name: 'titrant added', q: 'volume', unit: 'mL', value: 10.0 },
        Veq: { name: 'volume at equivalence', q: 'volume', unit: 'mL', value: 25.0, tex: 'V_{eq}' }
      },
      note: 'Henderson–Hasselbalch with the titrant as the measure of A⁻ made. Good between about 10 % and 90 % of the way to equivalence.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A weak acid with $\\mathrm{p}K_a$ = {pKa} is titrated with sodium hydroxide, and the equivalence point is at {Veq}. What is the pH after {V} of titrant?',
        V: 'A weak acid with $\\mathrm{p}K_a$ = {pKa} reaches equivalence at {Veq}. At what volume of titrant is the pH {pH}?'
      }
    },
    {
      name: 'pH at the equivalence point (weak acid with strong base)',
      expr: 'pH = (pKw + pKa + log(Cs))/2', tex: '\\mathrm{pH}_{eq} = \\tfrac12\\left({\\mathrm{p}K}_w + {\\mathrm{p}K}_a + \\log C_s\\right)',
      vars: {
        pH: { name: 'pH at equivalence', tex: '\\mathrm{pH}_{eq}' },
        pKw: { name: 'pKw (14.00 at 25 °C)', value: 14.00, fixed: true, tex: '{\\mathrm{p}K}_w' },
        pKa: { name: 'pKa of the acid', value: 4.76, tex: '{\\mathrm{p}K}_a' },
        Cs: { name: 'salt concentration at equivalence (mol/L)', value: 0.050, tex: 'C_s' }
      },
      note: 'At equivalence the flask holds the salt NaA at $C_s = C_aV_a/(V_a + V_{eq})$; its anion is a weak base. Defaults: 0.100 M acetic acid with 0.100 M NaOH.',
      practice: { unknowns: ['pH'] },
      stories: {
        pH: 'A weak acid with $\\mathrm{p}K_a$ = {pKa} is titrated with sodium hydroxide. At the equivalence point the flask holds {Cs} mol/L of its sodium salt. What is the pH at 25 °C ($\\mathrm{p}K_w$ = {pKw})?'
      }
    }
  ],
  examples: [
    {
      title: 'Four points on an acetic acid curve',
      q: '25.0 mL of 0.100 M acetic acid is titrated with 0.100 M NaOH. Find the pH at 0, 12.5, 25.0 and 30.0 mL.',
      steps: [
        '0 mL: weak acid alone, $[\\ce{H3O+}] = \\sqrt{1.75\\times10^{-5}\\times0.100} = 1.32\\times10^{-3}$ mol/L, pH 2.88.',
        '12.5 mL: half the acid has become acetate, so pH = pKa = 4.76.',
        '25.0 mL: 2.50 mmol of acetate in 50.0 mL, $C_s = 0.050$ mol/L. pH = ½(14.00 + 4.76 + log 0.050) = 8.73.',
        '30.0 mL: 0.50 mmol of excess OH⁻ in 55.0 mL, 9.09 × 10⁻³ mol/L, pOH 2.04, pH 11.96.'
      ],
      a: 'pH 2.88, 4.76, 8.73 and 11.96.'
    },
    {
      title: 'Choosing an indicator',
      q: '25.0 mL of 0.100 M ammonia is titrated with 0.100 M HCl. Where is the equivalence point, and which indicator should be used: methyl red (4.4–6.2) or phenolphthalein (8.2–10.0)?',
      steps: [
        'Equivalence at 25.0 mL; the flask then holds 2.50 mmol of $\\ce{NH4+}$ in 50.0 mL: 0.050 mol/L.',
        '$\\ce{NH4+}$ is a weak acid ($\\mathrm{p}K_a$ 9.25): pH = ½(9.25 − log 0.050) = 5.28.',
        'Methyl red changes across 4.4–6.2, right inside the jump. Phenolphthalein would start fading at pH 10 (about 4 mL) and be colourless at 8.2 (about 23 mL): a slow fade over nearly 20 mL that ends two millilitres early.'
      ],
      a: 'Equivalence at pH 5.28: use methyl red.'
    },
    {
      title: 'Measuring a pKa',
      q: '25.0 mL of an unknown monoprotic acid is titrated with 0.100 M NaOH. Equivalence is reached at 25.0 mL, and the pH at 12.5 mL is 3.86. What is the acid?',
      steps: [
        'Half-way to equivalence, [HA] = [A⁻], so pH = pKa: $\\mathrm{p}K_a$ = 3.86.',
        'The acid concentration is $0.100 \\times 25.0/25.0 = 0.100$ M, high enough for the half-way rule to hold (an exact calculation gives 3.864).',
        'A table of $\\mathrm{p}K_a$ values points to lactic acid (3.86).'
      ],
      a: 'pKa 3.86 — most likely lactic acid.'
    }
  ],
  quiz: [
    { q: 'At the equivalence point of acetic acid titrated with sodium hydroxide, the pH is…', choices: ['below 7', 'exactly 7', 'above 7', 'equal to the pKa'], a: 2,
      why: 'The flask holds sodium acetate, and acetate is a weak base: about pH 8.7 for 0.1 M solutions. pH = pKa is found half-way, not at equivalence.' },
    { q: 'Benzoic acid ($\\mathrm{p}K_a$ 4.20) is titrated with NaOH. What is the pH half-way to the equivalence point?', answer: 4.20,
      why: 'Half-way, equal amounts of benzoic acid and benzoate are present, so pH = pKa = 4.20.' },
    { q: 'Which indicator suits ammonia titrated with hydrochloric acid?', choices: ['methyl red (4.4–6.2)', 'phenolphthalein (8.2–10.0)', 'thymolphthalein (9.3–10.5)', 'none can work'], a: 0,
      why: 'Equivalence is near pH 5.3 because ammonium chloride is acidic. Methyl red changes within the jump; the other two change in the buffer region, long before equivalence.' },
    { q: 'The end point and the equivalence point are the same thing.', a: false,
      why: 'The equivalence point is where the amounts match exactly; the end point is where you see the change. Good technique makes them agree to within a drop.' },
    { q: 'How many clear jumps does the curve for phosphoric acid titrated with NaOH show?', choices: ['one', 'two', 'three', 'none'], a: 1,
      why: 'The first two protons (pKa 2.15 and 7.20) give jumps near pH 4.7 and 9.7. The third (pKa 12.35) is too weak to stand out from water\'s own buffering at high pH.' }
  ],
  applications: [
    'Quality control: acidity of wine, juice, milk and vinegar; alkalinity of water.',
    'Oil and fuel testing: the acid number of lubricants and biodiesel.',
    'The Kjeldahl method for nitrogen and protein in food and fertiliser.',
    'Measuring pKa values of new drugs and dyes from the half-equivalence point.'
  ],
  history: 'François Descroizilles built one of the first burettes in the 1790s to test bleach solutions. Joseph Louis Gay-Lussac refined volumetric analysis and named the burette and the pipette in the 1820s, and Karl Friedrich Mohr\'s burette with a clamp at the tip (1850s) made titration the everyday tool it still is.',
  sim: 'ab-titration'
},

{
  id: 'indicators', parent: 'buffers-titrations', title: 'Acid–base indicators', level: 2,
  short: 'An indicator is a weak acid whose acid and base forms have different colours. Its colour changes over about two pH units around its pK, which decides where on the scale — and in which titration — it is useful.',
  keywords: ['indicator', 'acid–base indicator', 'pH indicator', 'litmus', 'phenolphthalein', 'methyl orange', 'methyl red', 'bromothymol blue', 'universal indicator', 'pH paper', 'transition range', 'colour change', 'red cabbage', 'anthocyanin', 'end point'],
  prereq: ['weak-acids', 'henderson-hasselbalch', 'ph-scale'],
  related: ['titration-curves', 'beer-lambert', 'physics:color-vision', 'crystal-field-theory'],
  body: `
An acid–base indicator is itself a weak acid — one whose acid form and conjugate base have different colours:

$$\\ce{HIn <=> H+ + In-} \\qquad K_\\text{In} = \\frac{[\\ce{H+}][\\ce{In-}]}{[\\ce{HIn}]}$$

Methyl orange is red as $\\ce{HIn}$ and yellow as $\\ce{In-}$; phenolphthalein is colourless as $\\ce{HIn}$ and pink as $\\ce{In-}$. Gaining or losing the proton rearranges the molecule's alternating single and double bonds, which shifts the wavelength of light it absorbs — enough to change the colour we see ([[physics:color-vision|colour vision]]).

### Where the colour changes
By the [[henderson-hasselbalch]] equation, the ratio of the two forms depends only on the pH:

$$\\frac{[\\ce{In-}]}{[\\ce{HIn}]} = 10^{\\,\\mathrm{pH} - \\mathrm{p}K_\\text{In}}$$

At pH = $\\mathrm{p}K_\\text{In}$ the two forms are equal and you see a blend. The eye sees the pure acid colour once there is about ten times more $\\ce{HIn}$, and the base colour once there is about ten times more $\\ce{In-}$ — so the visible change spans roughly **$\\mathrm{p}K_\\text{In}$ ± 1**, two pH units. The exact range depends on the colours: an intense colour appearing from a colourless form is noticed early, which is why phenolphthalein shows a faint pink at 8.2 with only a few per cent of it in the pink form.

| Indicator | Acid colour | Range | Base colour |
|---|---|---|---|
| thymol blue (first change) | red | 1.2 – 2.8 | yellow |
| methyl orange | red | 3.1 – 4.4 | yellow-orange |
| bromocresol green | yellow | 3.8 – 5.4 | blue |
| methyl red | red | 4.4 – 6.2 | yellow |
| litmus | red | 4.5 – 8.3 | blue |
| bromothymol blue | yellow | 6.0 – 7.6 | blue |
| phenol red | yellow | 6.8 – 8.4 | red |
| thymol blue (second change) | yellow | 8.0 – 9.6 | blue |
| phenolphthalein | colourless | 8.2 – 10.0 | pink |
| thymolphthalein | colourless | 9.3 – 10.5 | blue |
| alizarin yellow R | yellow | 10.1 – 12.0 | red |

**Universal indicator** is a blend of several dyes chosen so that something is changing at every pH, giving the familiar red–orange–yellow–green–blue–violet sequence; pH paper is filter paper soaked in such a blend.

### Choosing an indicator for a titration
The indicator's range must fall inside the **steep part** of the [[titration-curves|titration curve]], so that a single drop carries it through its whole change:

- strong acid with strong base: the jump spans about pH 4 to 10, so methyl red, bromothymol blue or phenolphthalein all work;
- weak acid with strong base: equivalence is alkaline (about 8.7) — phenolphthalein;
- weak base with strong acid: equivalence is acidic (about 5.3) — methyl red;
- weak acid with weak base: no sharp jump at all, so no indicator works well; use a pH meter.

Use only a few drops. The indicator is an acid too and uses up a little titrant — negligible for a few drops of a dilute dye, not for a spoonful.

### Indicators in the kitchen and the garden
Red-cabbage juice holds anthocyanins that are red in acid, purple near neutral, blue-green in mild alkali and yellow in strong alkali — a kitchen universal indicator. Tea lightens when lemon is added for the same kind of reason, and turmeric turns red-brown with soap or baking soda. Hydrangeas are a subtler case: in acid soil aluminium dissolves and forms blue complexes with the flowers' pigment; in alkaline soil the flowers stay pink.

> [!fact] Indicators are also precision instruments. Ocean pH is measured to about ±0.001 by adding a purified dye (m-cresol purple) to sea water and measuring the ratio of its two forms with a spectrophotometer at two wavelengths ([[beer-lambert]]) — more reproducible than any glass electrode.
`,
  ideas: [
    'An indicator is a weak acid HIn whose acid and base forms differ in colour.',
    'The ratio [In⁻]/[HIn] = 10^(pH − pKIn): the colour depends only on the pH.',
    'The eye sees a change over roughly pKIn ± 1.',
    'For a titration, pick an indicator whose range lies inside the steep jump.',
    'Universal indicator is a mixture of dyes that changes colour across the whole scale.'
  ],
  pitfalls: [
    'An indicator changes colour at pH 7 — Each one changes around its own pKIn: methyl orange near 3.5–4, phenolphthalein near 9. Few change at 7.',
    'Phenolphthalein turning pink means the solution is strongly basic — It turns pink from about pH 8.2, which is only mildly alkaline; a colourless solution may still be at pH 8.',
    'More indicator gives a sharper end point — The indicator is itself an acid and consumes titrant; a few drops is best.'
  ],
  formulas: [
    {
      name: 'Ratio of the two coloured forms',
      expr: 'r = 10^(pH - pKIn)', tex: 'r = \\frac{[\\ce{In-}]}{[\\ce{HIn}]} = 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_\\text{In}}',
      vars: {
        r: { name: 'ratio of base form to acid form, [In⁻]/[HIn]', tex: 'r' },
        pH: { name: 'pH', value: 7.6, tex: '\\mathrm{pH}', min: 0, max: 14 },
        pKIn: { name: 'pK of the indicator', value: 7.1, tex: '{\\mathrm{p}K}_\\text{In}', min: 1, max: 13 }
      },
      note: 'Defaults: bromothymol blue (yellow HIn, blue In⁻). The eye sees the acid colour below r ≈ 0.1 and the base colour above r ≈ 10.',
      practice: { unknowns: ['r', 'pH'] },
      stories: {
        r: 'An indicator has $\\mathrm{p}K_\\text{In}$ = {pKIn}. What is the ratio of its base form to its acid form at pH {pH}?',
        pH: 'At what pH does an indicator with $\\mathrm{p}K_\\text{In}$ = {pKIn} have {r} times as much base form as acid form?'
      }
    },
    {
      name: 'Fraction of the indicator in its base colour',
      expr: 'f = 1/(1 + 10^(pKIn - pH))', tex: 'f = \\frac{1}{1 + 10^{\\,{\\mathrm{p}K}_\\text{In} - \\mathrm{pH}}}',
      vars: {
        f: { name: 'fraction present as In⁻', q: 'ratio', unit: '%' },
        pKIn: { name: 'pK of the indicator', value: 9.4, tex: '{\\mathrm{p}K}_\\text{In}', min: 1, max: 13 },
        pH: { name: 'pH', value: 8.7, tex: '\\mathrm{pH}', min: 0, max: 14 }
      },
      note: 'Defaults: phenolphthalein at pH 8.7, where about a sixth of it is in the pink form.',
      practice: { unknowns: ['f', 'pH'] },
      stories: {
        f: 'An indicator has $\\mathrm{p}K_\\text{In}$ = {pKIn}. What percentage of it is in its base form at pH {pH}?',
        pH: 'At what pH is {f} of an indicator with $\\mathrm{p}K_\\text{In}$ = {pKIn} in its base form?'
      }
    }
  ],
  examples: [
    {
      title: 'Bromothymol blue at two pH values',
      q: 'Bromothymol blue ($\\mathrm{p}K_\\text{In}$ = 7.1) is yellow as HIn and blue as In⁻. What colour is it at pH 6.5 and at pH 7.6?',
      steps: [
        'pH 6.5: $[\\ce{In-}]/[\\ce{HIn}] = 10^{-0.6} = 0.25$, so 20 % is blue and 80 % yellow: a yellow-green.',
        'pH 7.6: the ratio is $10^{0.5} = 3.2$, so 76 % is blue: blue with a green tinge.',
        'Full yellow needs pH below about 6.0, full blue above about 7.6 — the listed range.'
      ],
      a: 'Yellow-green at 6.5, blue-green to blue at 7.6.'
    },
    {
      title: 'Why methyl red fails for acetic acid',
      q: 'In the titration of 25.0 mL of 0.100 M acetic acid with 0.100 M NaOH, over what volume would methyl red (4.4–6.2) change colour?',
      steps: [
        { text: 'In the buffer region:', tex: '\\mathrm{pH} = 4.76 + \\log\\frac{V}{25.0 - V}' },
        'pH 4.4 is reached when $V/(25.0 - V) = 10^{-0.36} = 0.44$, at $V = 7.6$ mL.',
        'pH 6.2 is reached when $V/(25.0 - V) = 10^{1.44} = 27.5$, at $V = 24.1$ mL.',
        'The colour drifts slowly from red to yellow over 16 mL and is fully yellow 0.9 mL before equivalence — no sharp end point at all.'
      ],
      a: 'Between about 7.6 and 24.1 mL: a slow drift that ends early. Phenolphthalein changes within a drop at 25.0 mL.'
    }
  ],
  quiz: [
    { q: 'An indicator has $\\mathrm{p}K_\\text{In}$ = 5.0. Below roughly what pH do you see its pure acid colour?', choices: ['4', '5', '7', '2'], a: 0,
      why: 'The acid colour dominates once [HIn] is about ten times [In⁻], i.e. one unit below pKIn: pH 4.' },
    { q: 'What is $[\\ce{In-}]/[\\ce{HIn}]$ for bromothymol blue ($\\mathrm{p}K_\\text{In}$ 7.1) at pH 8.1?', answer: 10,
      why: 'Ratio = 10^(8.1 − 7.1) = 10: the solution looks blue.' },
    { q: 'Phenolphthalein can tell a solution at pH 3 from one at pH 6.', a: false,
      why: 'It is colourless everywhere below about 8.2, so both look the same. Choose an indicator whose range lies between 3 and 6, such as bromocresol green or methyl red.' },
    { q: 'Which indicator is best for a weak acid titrated with a strong base?', choices: ['phenolphthalein', 'methyl orange', 'methyl red', 'any of them'], a: 0,
      why: 'Equivalence is alkaline, about pH 8.7, and the jump runs from about 7.5 to 10. Phenolphthalein (8.2–10.0) sits inside it; the others change in the buffer region.' },
    { q: 'Why add only two or three drops of indicator?', choices: ['the indicator is a weak acid and consumes some titrant', 'more drops make the colour change at a higher pH', 'indicators are expensive', 'more indicator makes the solution a buffer'], a: 0,
      why: 'Every indicator molecule reacts with the titrant as it changes form. A few drops of a dilute dye use a negligible amount; a lot would shift the end point.' }
  ],
  applications: [
    'End-point detection in titrations for quality control.',
    'pH paper and test strips for pools, aquariums, soil and urine.',
    'Spectrophotometric ocean-pH measurement with m-cresol purple.',
    'Phenolphthalein spray on fresh concrete: pink where the concrete is still alkaline, colourless where carbonation has advanced.'
  ],
  history: 'Robert Boyle described in 1664 how syrup of violets turns red with acids and green with alkalis, and litmus, from lichens, had been used long before. The first synthetic indicators came with the dye industry: Adolf von Baeyer made phenolphthalein in 1871, and methyl orange followed within a decade.',
  sim: 'ab-indicators'
}

);
