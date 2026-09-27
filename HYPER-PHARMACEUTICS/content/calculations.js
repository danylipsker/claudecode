/* HYPER-PHARMACEUTICS · content/calculations.js — Pharmaceutical calculations (calc-topic):
 * units, percent and ratio strength, dilution, alligation, mmol and mEq, isotonicity, doses by weight and
 * surface area, infusion rates and compounding. Every drug and patient here is hypothetical: real
 * preparation and dosing follow the product information, local protocols and an independent check. */
Hyper.add(

{
  id: 'units-pharmacy', parent: 'calc-topic', title: 'Units, weights and measures', level: 1,
  short: 'Pharmacy works in metric units — kilograms down to nanograms, litres down to microlitres, each step a factor of 1000 — plus a few special ones such as international units and drops. Most calculation errors are unit errors, so every number carries its unit and every conversion is written out.',
  keywords: ['metric system', 'milligram', 'microgram', 'mcg', 'nanogram', 'millilitre', 'unit conversion', 'dimensional analysis', 'international unit', 'IU', 'units', 'density', 'drops', 'teaspoon', 'grain', 'pound', 'leading zero', 'trailing zero', 'error-prone abbreviations'],
  prereq: ['math:scientific-notation', 'math:fractions-ratios', 'what-is-a-drug'],
  related: ['percent-strength', 'dose-calculations', 'infusion-rates', 'meq-mmol', 'medication-errors'],
  body: `
A tablet of 0.25 mg and a tablet of 250 micrograms contain exactly the same amount of drug. A tablet of 250 mg contains a thousand times more. Most of the arithmetic of pharmacy is this simple — and most of its dangerous mistakes are slips of exactly this kind. So the first skill is fluency with units, and the first habit is never to write a number without one.

### One system, steps of a thousand
Medicines are measured in the metric system. The steps that matter go by factors of 1000:

| Unit | Symbol | In grams | A typical use |
|---|---|---|---|
| kilogram | kg | 1000 g | body weight, bulk ingredients |
| gram | g | 1 g | powders, ointment bases, the salt in an infusion bag |
| milligram | mg | 0.001 g | most tablets and injections (a 500 mg tablet) |
| microgram | µg (often written mcg) | 0.000 001 g | potent drugs: hormones, some inhalers and injections |
| nanogram | ng | 10⁻⁹ g | drug levels in blood (ng/mL) |

Volumes follow the same pattern: 1 L = 1000 mL, 1 mL = 1000 µL, and 1 mL is exactly 1 cm³. Plasma levels are quoted in mg/L, µg/mL or ng/mL — note that 1 mg/L and 1 µg/mL are the *same* concentration.

The safest way to convert is **dimensional analysis**: multiply by a conversion factor written as a fraction equal to one, and let the units cancel,

$$0.125\\,\\text{mg} \\times \\frac{1000\\,\\text{µg}}{1\\,\\text{mg}} = 125\\,\\text{µg}$$

If the units do not cancel, the factor is upside down — the method checks itself.

### Units that are not masses
Some medicines are measured by their **biological activity** against an international reference standard: insulin, heparin, some vitamins, enzymes and toxins, in *international units* (IU) or simply *units*. The link to mass differs for every substance — 1 µg of vitamin D₃ (cholecalciferol) is 40 IU, while one unit of human insulin is about 35 µg — so there is no general IU-to-mg conversion. Insulin is most often 100 units/mL, but stronger concentrations exist, which is why a syringe or pen must match the product. Electrolytes are counted in millimoles or milliequivalents ([[meq-mmol]]).

### Mass and volume: density
Liquids are easiest to measure by volume, but a formula may state grams. The bridge is the density, $m = \\rho V$: water 1.00 g/mL, ethanol 0.79, glycerol 1.26, a thick syrup about 1.3. So 50 g of glycerol is 39.7 mL, not 50 mL.

### Household and old units
A medicine spoon holds 5 mL, but household teaspoons hold roughly 2.5–7 mL; liquid medicines therefore come with an oral syringe or a marked cup. "Drops" mean something only with a calibrated dropper or a giving set of known drop factor ([[infusion-rates]]). The old apothecaries' grain (64.8 mg) survives on a few labels, and body weight is still recorded in pounds in some countries: 1 lb = 0.4536 kg, so a child of 44 lb weighs 20 kg — and a weight in pounds taken for kilograms makes every weight-based dose 2.2 times too large.

### Writing numbers safely
> [!warn] Write numbers so they cannot be misread: always a **leading zero** (0.5 mg, never .5 mg), never a **trailing zero** (5 mg, never 5.0 mg, which can be read as 50 mg), "units" in full (a handwritten U looks like 0 or 4), and "microgram" or "mcg" rather than a handwritten µg, which can be read as mg. These rules come from error reports collected by bodies such as the Institute for Safe Medication Practices and from The Joint Commission's "Do Not Use" list (2004). All numbers on these pages are illustrations; real doses come from the product information and local protocols, with an independent double check.

Keep full precision through a calculation and round only the answer, to what can actually be measured: a 1 mL oral syringe reads to 0.01 mL, a 10 mL syringe to about 0.2 mL. The simulation below shows what each classic slip does to a dose; [[dose-calculations]] puts the units to work.
`,
  ideas: [
    'Metric units in pharmacy step by factors of 1000: kg, g, mg, µg, ng and L, mL, µL.',
    'Convert by multiplying by a factor equal to one (1000 µg / 1 mg): if the units do not cancel, the factor is upside down.',
    'International units measure biological activity; their mass is different for every substance.',
    'Density links mass and volume: m = ρV; only water has 1 g per mL.',
    'Leading zero always, trailing zero never, "units" and "microgram" in full.'
  ],
  pitfalls: [
    'Moving the decimal point is enough — Only if it moves three places per step and in the right direction; writing the factor as a fraction (1000 µg per 1 mg) makes the units cancel and shows at once whether to multiply or divide.',
    'An international unit is a fixed amount of drug — It is a unit of biological activity defined for each substance separately: 1 IU of vitamin D is 0.025 µg, one unit of insulin about 35 µg.',
    'A trailing zero shows precision, so "5.0 mg" is the careful way to write it — If the point is lost on a crease, a fax or a screen, 5.0 becomes 50: a ten-fold overdose. Write 5 mg; the trailing zero belongs in laboratory data, never in a dose.'
  ],
  formulas: [
    {
      name: 'Mass from volume and density',
      expr: 'm = rho*V', tex: 'm = \\rho\\,V',
      vars: {
        m: { name: 'mass', q: false, unit: 'g' },
        rho: { name: 'density', q: false, unit: 'g/mL', value: 1.26, tex: '\\rho' },
        V: { name: 'volume', q: false, unit: 'mL', value: 50 }
      },
      note: 'Densities near room temperature: water 1.00, ethanol 0.79, liquid paraffin about 0.86, glycerol 1.26, syrup about 1.3 g/mL.',
      stories: {
        m: 'How many grams are in {V} of glycerol, whose density is {rho}?',
        V: 'A formula calls for {m} of glycerol (density {rho}). What volume do you measure?',
        rho: 'A liquid weighs {m} for {V}. What is its density?'
      }
    },
    {
      name: 'Volume of a product measured in units',
      expr: 'V = U/c', tex: 'V = \\dfrac{U}{c}',
      vars: {
        V: { name: 'volume to draw up', q: false, unit: 'mL' },
        U: { name: 'dose', q: false, unit: 'units', value: 12 },
        c: { name: 'strength', q: false, unit: 'units/mL', value: 100 }
      },
      note: 'For insulin, heparin and other medicines dosed in units. Write "units" in full: a handwritten U can be read as a zero.',
      stories: {
        V: 'A hypothetical product contains {c}. What volume holds {U}?',
        U: 'How many units are in {V} of a product labelled {c}?'
      }
    },
    {
      name: 'Vitamin D₃: micrograms and international units',
      expr: 'A = 40*m', tex: 'A_{\\text{IU}} = 40\\,m_{\\text{µg}}',
      vars: {
        A: { name: 'activity', q: false, unit: 'IU', tex: 'A_{\\text{IU}}' },
        m: { name: 'mass of cholecalciferol', q: false, unit: 'µg', value: 25, tex: 'm_{\\text{µg}}' }
      },
      note: 'The factor 40 IU per µg belongs to vitamin D₃ alone; every substance measured in units has its own.',
      stories: { A: 'A capsule contains {m} of vitamin D₃. How many international units is that?', m: 'A label states {A} of vitamin D₃. How many micrograms is that?' }
    },
    {
      name: 'Body weight: pounds to kilograms',
      expr: 'W = 0.4536*P', tex: 'W = 0.4536\\,P',
      vars: {
        W: { name: 'weight', q: false, unit: 'kg' },
        P: { name: 'weight in pounds', q: false, unit: 'lb', value: 44 }
      },
      note: 'Weight-based doses need kilograms; a weight in pounds used as kilograms gives a 2.2-fold overdose.',
      stories: { W: 'A child is weighed at {P}. What is the weight in kilograms?', P: 'An adult weighs {W}. What is that in pounds?' }
    }
  ],
  examples: [
    {
      title: 'Milligrams to micrograms',
      q: 'A hypothetical prescription asks for 0.125 mg of a drug; the tablets are labelled 62.5 micrograms. How many tablets make one dose?',
      steps: [
        'Convert the dose to the unit on the label: $0.125\\,\\text{mg} \\times 1000\\,\\text{µg/mg} = 125\\,\\text{µg}$.',
        'Divide by the strength: $125/62.5 = 2$ tablets.',
        'Sense check: a dose that works out as 0.002 tablets or 2000 tablets means a factor of 1000 went the wrong way.'
      ],
      a: 'Two tablets of 62.5 µg.'
    },
    {
      title: 'Glycerol by volume',
      q: 'A mixture needs 50 g of glycerol (density 1.26 g/mL), and the only measure to hand is a measuring cylinder. What volume do you measure?',
      steps: [
        '$V = m/\\rho = 50/1.26 = 39.7$ mL.',
        'Measuring 50 mL instead would add 63 g — 26 % too much.'
      ],
      a: 'About 39.7 mL.'
    },
    {
      title: 'A weight in pounds',
      q: 'A child\'s weight is recorded as 44 lb. A hypothetical medicine is dosed at 10 mg/kg. What is the dose, and what happens if 44 is read as kilograms?',
      steps: [
        '$W = 0.4536 \\times 44 = 19.96 \\approx 20$ kg.',
        'Dose $= 10 \\times 20 = 200$ mg.',
        'Read as 44 kg, the dose would be 440 mg — 2.2 times too much. Weigh in kilograms and record the unit.'
      ],
      a: '200 mg; reading pounds as kilograms would give 440 mg.'
    }
  ],
  quiz: [
    { q: 'How many micrograms are in 0.05 mg?', answer: 50, unit: 'µg', why: '0.05 mg × 1000 µg/mg = 50 µg.' },
    { q: 'Which is the safe way to write half a milligram?', choices: ['.5 mg', '0.5 mg', '0.50 mg', '½ mg'], a: 1, why: 'A leading zero keeps the decimal point from being missed (.5 read as 5), and no trailing zero (0.50 can be misread as 50 if the point is missed).' },
    { q: 'A prescription reads "5.0 mg". What error does the trailing zero invite?', choices: ['none: it shows the precision', 'it may be read as 50 mg — a ten-fold overdose', 'it may be read as 0.5 mg', 'it may be read as five doses'], a: 1, why: 'If the decimal point is lost — a crease, a fax, a faint pen — 5.0 becomes 50. Write 5 mg.' },
    { q: 'One international unit is the same mass for every medicine measured in IU.', a: false, why: 'IU measure biological activity against a reference for each substance: 1 IU of vitamin D is 0.025 µg, one unit of insulin about 35 µg.' },
    { q: 'What is the mass of 100 mL of glycerol (density 1.26 g/mL)?', answer: 126, unit: 'g', why: 'm = ρV = 1.26 × 100 = 126 g.' }
  ],
  problems: [
    { q: 'An oral solution contains 250 micrograms in 5 mL. What volume contains 0.1 mg?', answer: 2, unit: 'mL', tol: 0.02, steps: ['0.1 mg = 100 µg.', 'The solution holds 50 µg per mL, so 100/50 = 2 mL.'] },
    { q: 'A hypothetical product contains 100 units/mL. What volume gives 18 units?', answer: 0.18, unit: 'mL', tol: 0.02, steps: ['$V = 18/100 = 0.18$ mL — measured with a syringe graduated in units or in 0.01 mL.'] }
  ],
  applications: ['Reading labels and prescriptions that mix mg, µg and units.', 'Converting laboratory levels between mg/L, µg/mL and ng/mL.', 'Measuring liquids by volume for formulas written in grams.', 'Checking weights recorded in pounds before any weight-based dose.'],
  history: 'The metric system was born in revolutionary France in the 1790s and slowly displaced the apothecaries\' grains, scruples, drams and minims in prescriptions over the following century and a half. The safety rules for writing numbers are much younger: they grew from medication-error reporting programmes, and The Joint Commission in the United States published its "Do Not Use" list of abbreviations in 2004.',
  sim: 'calc-tenfold'
},

{
  id: 'percent-strength', parent: 'calc-topic', title: 'Percent and ratio strength', level: 1,
  short: 'Strength as a percentage: % w/v is grams in 100 mL, % w/w grams in 100 g, % v/v millilitres in 100 mL. Ratio strength "1 in 1000" means 1 g in 1000 mL. The bridge between them: mg/mL = 10 × % w/v.',
  keywords: ['% w/v', '% w/w', '% v/v', 'percentage strength', 'ratio strength', '1 in 1000', '1 in 10 000', 'mg/mL', 'ppm', 'parts per million', 'mg%', 'strength conversion', 'density'],
  prereq: ['units-pharmacy', 'math:percentages', 'chemistry:concentration-units'],
  related: ['dilution-concentration', 'alligation', 'meq-mmol', 'isotonic-calculations', 'ointments-creams', 'oral-solutions'],
  body: `
One label says 0.9 %, another 1 in 1000, a third 20 mg/mL, a fourth 1000 ppm. They are four ways of saying how much drug sits in how much product, and a pharmacist moves between them without thinking — but carefully, because a slip is often a factor of ten.

### Three kinds of percent
A percentage strength is always "parts per hundred", but parts of what?

| Expression | Means | Used for | Example |
|---|---|---|---|
| % w/v | grams of solute in 100 mL of product | solutions, injections, eye drops | sodium chloride 0.9 % w/v: 0.9 g in 100 mL |
| % w/w | grams in 100 g of product | creams, ointments, powders | a 1 % w/w cream: 1 g of drug in 100 g |
| % v/v | millilitres in 100 mL of product | mixtures of liquids | ethanol 70 % v/v |

By convention, a percentage of a solid in a liquid means w/v, of a liquid in a liquid v/v, and of a solid in a solid w/w, unless the label says otherwise.

The bridge to mass concentration is worth knowing by heart: **1 % w/v = 1 g per 100 mL = 10 mg/mL**. Glucose 5 % is 50 mg/mL (50 g in a litre bag); a 2 % local anaesthetic is 20 mg/mL, so 5 mL of it contains 100 mg.

### Ratio strength
Very weak preparations were traditionally written as a ratio: **1 in 1000** means 1 g in 1000 mL (for a solid in a liquid) — which is 0.1 % w/v, or 1 mg/mL. So

$$\\%\\,\\text{w/v} = \\frac{100}{R} \\qquad\\qquad C\\,(\\text{mg/mL}) = \\frac{1000}{R}$$

| Ratio strength | % w/v | mg/mL | µg/mL |
|---|---|---|---|
| 1 in 100 | 1 % | 10 | 10 000 |
| 1 in 1000 | 0.1 % | 1 | 1000 |
| 1 in 10 000 | 0.01 % | 0.1 | 100 |
| 1 in 200 000 | 0.0005 % | 0.005 | 5 |

The trap is plain from the table: a bigger number is a *weaker* product, and 1 in 1000 and 1 in 10 000 differ by one zero and a factor of ten. The classic confusion is between the two strengths of adrenaline (epinephrine) injection. For that reason many labels now state mg/mL instead — in the United States, the pharmacopoeial labelling standard dropped ratio strengths from single-ingredient injections in 2016 — though ratios survive, for example for the adrenaline added to some local anaesthetics.

### Parts per million and mg%
For very dilute solutions, **ppm** (parts per million): 1 ppm is 1 mg per kg, and in dilute watery solutions 1 mg per litre. Fluoridated drinking water holds about 0.7–1 ppm fluoride; a disinfectant solution of 1000 ppm available chlorine is 0.1 %. The old laboratory unit **mg%** means mg per 100 mL, the same as mg/dL.

### The basis matters: w/w against w/v
Where the density is not 1, w/w and w/v give different numbers for the same product: % w/v = % w/w × density (g/mL). A syrup of 66.7 % w/w sucrose with a density of 1.31 g/mL contains 87 g of sucrose per 100 mL. Always check which basis a formula uses before diluting or mixing ([[alligation]]).

> [!key] 1 % w/v = 10 mg/mL. "1 in R" = 100/R % = 1000/R mg/mL. The larger R, the weaker the product.

> [!warn] The strengths here are for learning. Real preparations and doses follow the product information and local protocols, with an independent double check. Try your own numbers in [the strength and dilution calculator](#/tools/pharmcalc/dilution).
`,
  ideas: [
    '% w/v is g per 100 mL, % w/w g per 100 g, % v/v mL per 100 mL.',
    '1 % w/v = 10 mg/mL — the most useful single conversion in pharmacy.',
    'Ratio strength 1 in R is 100/R % or 1000/R mg/mL: a larger R is a weaker product.',
    'ppm is mg per litre in dilute watery solutions; mg% is mg per 100 mL.',
    '% w/v = % w/w × density: the two agree only when the density is 1 g/mL.'
  ],
  pitfalls: [
    'mg/mL = 100 × % w/v — The factor is 10: 1 % is 1 g in 100 mL, 1000 mg in 100 mL, 10 mg/mL. The factor 100 gives a ten-fold error.',
    'A bigger ratio number is a stronger product — The opposite: 1 in 10 000 is a tenth the strength of 1 in 1000.',
    'A cream labelled 2 % w/w contains 2 g per 100 mL — It contains 2 g per 100 g; semisolids are weighed, and their density is rarely exactly 1.'
  ],
  formulas: [
    {
      name: 'Percent w/v to mg/mL',
      expr: 'C = 10*P', tex: 'C = 10\\,P',
      vars: {
        C: { name: 'concentration', q: false, unit: 'mg/mL' },
        P: { name: 'percentage strength', q: false, unit: '% w/v', value: 0.9 }
      },
      note: '1 % w/v is 1 g in 100 mL, which is 10 mg in each mL.',
      stories: { C: 'A solution is {P}. How many mg does each mL contain?', P: 'An injection contains {C}. What is its percentage strength?' }
    },
    {
      name: 'Ratio strength to mg/mL',
      expr: 'C = 1000/R', tex: 'C = \\dfrac{1000}{R}',
      vars: {
        C: { name: 'concentration', q: false, unit: 'mg/mL' },
        R: { name: 'ratio strength, 1 in R (g in mL)', q: false, unit: '', value: 1000 }
      },
      note: '"1 in R" for a solid in a liquid is 1 g in R mL. As a percentage it is 100/R % w/v.',
      stories: { C: 'An injection is labelled 1 in {R}. What is its concentration in mg/mL?', R: 'A solution contains {C}. Express it as a ratio strength, 1 in how many?' }
    },
    {
      name: 'Amount of drug in a preparation',
      expr: 'w = P*Q/100', tex: 'w = \\dfrac{P\\,Q}{100}',
      vars: {
        w: { name: 'drug needed', q: false, unit: 'g' },
        P: { name: 'percentage strength', q: false, unit: '%', value: 2.5 },
        Q: { name: 'quantity of product (g for w/w, mL for w/v)', q: false, unit: 'g or mL', value: 60 }
      },
      note: 'The same arithmetic for w/w (Q in grams), w/v (Q in mL, w in grams) and v/v (Q and w both in mL).',
      stories: {
        w: 'How much drug is needed for {Q} of a {P} preparation?',
        Q: 'You have {w} of drug. How much {P} product can it make?',
        P: '{w} of drug is made into {Q} of product. What is the percentage strength?'
      }
    },
    {
      name: 'From % w/w to % w/v',
      expr: 'Pv = Pw*rho', tex: 'P_{w/v} = P_{w/w}\\,\\rho',
      vars: {
        Pv: { name: 'strength weight in volume', q: false, unit: '% w/v', tex: 'P_{w/v}' },
        Pw: { name: 'strength weight in weight', q: false, unit: '% w/w', value: 66.7, tex: 'P_{w/w}' },
        rho: { name: 'density of the product', q: false, unit: 'g/mL', value: 1.31, tex: '\\rho' }
      },
      note: '100 g of product occupies 100/ρ mL, so the grams per 100 mL are P_w/w × ρ.',
      stories: { Pv: 'A syrup contains {Pw} of sucrose and has a density of {rho}. What is its strength in % w/v?', rho: 'A solution is {Pw} and {Pv}. What is its density?' }
    }
  ],
  examples: [
    {
      title: 'How much drug in a local anaesthetic',
      q: 'How many milligrams of drug are in 5 mL of a 2 % w/v solution?',
      steps: [
        '2 % w/v = 2 g per 100 mL = 20 mg/mL.',
        '$20 \\times 5 = 100$ mg.'
      ],
      a: '100 mg.'
    },
    {
      title: 'Ratio strengths side by side',
      q: 'A hypothetical dose of 0.5 mg is to be drawn from an injection labelled 1 in 10 000. What volume is needed, and what volume would contain the same dose of the 1 in 1000 strength?',
      steps: [
        '1 in 10 000 = $1000/10\\,000 = 0.1$ mg/mL, so 0.5 mg is in $0.5/0.1 = 5$ mL.',
        '1 in 1000 = 1 mg/mL, so the same dose is in 0.5 mL.',
        'Draw up 5 mL of the wrong strength and the dose is ten times too big; the volume that "looks right" gives no warning.'
      ],
      a: '5 mL of the 1 in 10 000; 0.5 mL of the 1 in 1000.'
    },
    {
      title: 'A syrup in two bases',
      q: 'A syrup contains 66.7 % w/w sucrose and has a density of 1.31 g/mL. How much sucrose is there in a 100 mL bottle?',
      steps: [
        '% w/v = % w/w × density = $66.7 \\times 1.31 = 87.4$ % w/v.',
        'So 100 mL holds 87.4 g of sucrose — not 66.7 g.'
      ],
      a: 'About 87 g.'
    }
  ],
  quiz: [
    { q: 'A solution is 0.9 % w/v sodium chloride. How many mg of NaCl are in 1 mL?', answer: 9, unit: 'mg', why: '0.9 g per 100 mL = 900 mg per 100 mL = 9 mg per mL.' },
    { q: 'An injection labelled "1 in 1000" contains…', choices: ['1 mg/mL', '0.1 mg/mL', '10 mg/mL', '1 µg/mL'], a: 0, why: '1 g in 1000 mL = 1000 mg in 1000 mL = 1 mg/mL. 0.1 mg/mL is 1 in 10 000.' },
    { q: '% w/w and % w/v are the same number for any preparation.', a: false, why: '% w/v = % w/w × density; they agree only when the density is 1 g/mL.' },
    { q: 'How many grams of glucose are in a 500 mL bag of 5 % w/v glucose?', answer: 25, unit: 'g', why: '5 g per 100 mL × 5 = 25 g.' },
    { q: 'Which is stronger: 1 in 2500 or 0.05 %?', choices: ['1 in 2500', '0.05 %', 'they are equal', 'they cannot be compared'], a: 1, why: '1 in 2500 = 100/2500 = 0.04 %, which is weaker than 0.05 %.' }
  ],
  problems: [
    { q: 'How many grams of drug are needed for 60 g of a 2.5 % w/w ointment?', answer: 1.5, unit: 'g', tol: 0.02, steps: ['$w = 2.5 \\times 60/100 = 1.5$ g of drug in 58.5 g of base.'] },
    { q: 'Express a strength of 1 in 400 (w/v) in mg/mL.', answer: 2.5, unit: 'mg/mL', tol: 0.02, steps: ['$1000/400 = 2.5$ mg/mL, which is also $100/400 = 0.25$ % w/v.'] }
  ],
  applications: ['Reading the strength of infusion fluids (0.9 % sodium chloride, 5 % glucose) in mg/mL and mmol/L.', 'Weighing the drug for creams and ointments in % w/w.', 'Diluting disinfectants specified in ppm of available chlorine.', 'Converting older ratio strengths to mg/mL on labels and in protocols.'],
  history: 'Ratio strengths date from a time when very dilute preparations were made by dissolving a gram of drug in a measured bulk of liquid. They have been blamed for many ten-fold errors, and from 2016 the US labelling standard required single-ingredient injections to state their strength in mg/mL; other countries have moved the same way.',
  sim: 'calc-cylinder'
},

{
  id: 'dilution-concentration', parent: 'calc-topic', title: 'Dilution and concentration', level: 1,
  short: 'Diluting keeps the amount of drug and spreads it through more volume, so C₁V₁ = C₂V₂. "Dilute 1 in 10" means one part of stock in ten parts in all. Very large dilutions are made in steps — serial dilution — and mixing two strengths gives their volume-weighted mean.',
  keywords: ['C1V1 = C2V2', 'dilution factor', '1 in 10', 'stock solution', 'diluent', 'serial dilution', 'make up to volume', 'concentrating', 'mixing solutions', 'volumetric flask', 'pipette', 'measuring cylinder', 'measuring error'],
  prereq: ['percent-strength', 'chemistry:dilution', 'math:fractions-ratios'],
  related: ['alligation', 'infusion-rates', 'compounding', 'analytical-methods', 'injectable-formulation', 'biology:lab-math'],
  body: `
A dilution adds solvent and nothing else. The drug that was in the small volume of stock is still all there, spread through a bigger volume — so the amount before equals the amount after. Everything on this page follows from that one sentence.

### The amount stays the same
Amount = concentration × volume, so

$$C_1 V_1 = C_2 V_2$$

with any units, as long as each side uses the same ones (mg/mL and mL, % and mL, mmol/L and L). To make 250 mL of a 2 mg/mL solution from a 50 mg/mL stock: $V_1 = C_2V_2/C_1 = 2 \\times 250/50 = 10$ mL of stock, **made up to** 250 mL with diluent — about 240 mL of it. The same equation, run the other way, says what strength you get when a vial is added to a bag: 10 mL of 50 mg/mL into a 250 mL bag gives $500/260 = 1.92$ mg/mL, because the vial adds its own volume.

### Dilution factor and "1 in x"
The **dilution factor** is $C_1/C_2 = V_2/V_1$. "Dilute 1 in 10" means one volume of stock in ten volumes in total — one of stock plus nine of diluent, $\\text{DF} =(V_1 + V_d)/V_1$. Adding ten volumes of diluent gives 1 in 11, a 9 % error. Laboratory writing sometimes uses "1:10" for either meaning, so pharmacy says "in".

### Measure well
A calculation is only as good as the measurement that follows it:
- Use the **smallest measure that holds the volume**. A 100 mL measuring cylinder read to half a graduation (±0.5 mL) is fine for 80 mL (±0.6 %) but hopeless for 2 mL (±25 %); measure that with a 2 or 5 mL syringe.
- **Make up to the mark** in a measuring cylinder or volumetric flask rather than adding a calculated volume of diluent. Volumes of mixed liquids are not always additive — 50 mL of ethanol and 50 mL of water make about 97 mL — and dissolved solids take up room.
- Mix thoroughly: a layered solution has the right amount and the wrong concentration in every part.

### Serial dilution
For big factors, dilute in steps: after $n$ steps of factor $f$, $C_n = C_0/f^{\\,n}$. Getting from 10 mg/mL to 1 µg/mL is a factor of 10 000: in one step that means 0.01 mL of stock in 100 mL, a volume nobody can measure well; in four steps of 1 in 10 each is a comfortable 1 mL + 9 mL. The price is that errors compound: four steps each within ±1 % end within about ±2 % if the errors are random (they add roughly as the square root of the sum of squares) and ±4 % in the worst case. Serial dilutions make analytical standards ([[analytical-methods]]), allergen test solutions and microbial counts ([[biology:lab-math]]).

### Mixing and concentrating
Mixing two strengths gives the volume-weighted mean, $C = (C_aV_a + C_bV_b)/(V_a + V_b)$: 100 mL of 10 mg/mL and 300 mL of 2 mg/mL give 4 mg/mL. The reverse question — how much of each for a strength in between — is [[alligation]]. Concentrating is the same algebra: evaporating half the solvent doubles the strength, and adding pure drug is alligation with a 100 % component.

> [!warn] Dilutions of real medicines — injections for infusion especially — follow the product information and local protocols, use the diluent they specify, and are checked independently before use. The numbers here are illustrations. Try your own in [the dilution calculator](#/tools/pharmcalc/dilution), which also does serial dilutions.
`,
  ideas: [
    'Diluting conserves the amount of drug: C₁V₁ = C₂V₂ in any consistent units.',
    '"1 in 10" is one part of stock in ten parts in total: 1 of stock + 9 of diluent.',
    'Measure with the smallest device that holds the volume, and make up to the mark.',
    'Serial dilution: n steps of factor f divide the concentration by fⁿ; the errors of the steps add up.',
    'Mixing two solutions gives the volume-weighted mean of their strengths.'
  ],
  pitfalls: [
    '"1 in 10" means adding ten volumes of diluent — It means one volume in ten in all: one of stock and nine of diluent. Ten volumes of diluent give 1 in 11.',
    'Volumes always add up — Ethanol and water shrink on mixing, and dissolved solids occupy volume; make up to the mark in a measuring vessel instead of adding a calculated volume.',
    'A serial dilution is less accurate than a single step — For big factors it is usually more accurate, because every step measures a sensible volume; the step errors do compound, so use few, well-measured steps.'
  ],
  formulas: [
    {
      name: 'Dilution: the amount is conserved',
      expr: 'C1*V1 = C2*V2', tex: 'C_1 V_1 = C_2 V_2', solveFor: 'V1',
      vars: {
        C1: { name: 'stock concentration', q: false, unit: 'mg/mL', value: 50, tex: 'C_1' },
        V1: { name: 'volume of stock', q: false, unit: 'mL', tex: 'V_1' },
        C2: { name: 'concentration wanted', q: false, unit: 'mg/mL', value: 2, tex: 'C_2' },
        V2: { name: 'final volume', q: false, unit: 'mL', value: 250, tex: 'V_2' }
      },
      note: 'Any units work if both sides match (%, mg/mL, mmol/L). Measure V₁ and make up to V₂.',
      practice: { unknowns: ['V1', 'C2', 'V2'] },
      stories: {
        V1: 'How much of a {C1} stock do you need to make {V2} of a {C2} solution?',
        C2: '{V1} of a {C1} stock is made up to {V2}. What is the new concentration?',
        V2: 'To what volume must {V1} of a {C1} solution be made up to give {C2}?'
      }
    },
    {
      name: 'Dilution factor from the volumes',
      expr: 'DF = (V1 + Vd)/V1', tex: '\\text{DF} = \\dfrac{V_1 + V_d}{V_1}',
      vars: {
        DF: { name: 'dilution factor ("1 in DF")', q: false, unit: '', tex: '\\text{DF}' },
        V1: { name: 'volume of stock', q: false, unit: 'mL', value: 1, tex: 'V_1' },
        Vd: { name: 'volume of diluent added', q: false, unit: 'mL', value: 9, tex: 'V_d' }
      },
      note: 'Assumes the volumes add; for accurate work make up to the final volume instead.',
      stories: { DF: '{V1} of stock is mixed with {Vd} of diluent. It is a 1 in how many dilution?', Vd: 'How much diluent turns {V1} of stock into a 1 in {DF} dilution?' }
    },
    {
      name: 'Serial dilution',
      expr: 'Cn = C0/f^n', tex: 'C_n = \\dfrac{C_0}{f^{\\,n}}',
      vars: {
        Cn: { name: 'concentration after n steps', q: false, unit: 'mg/mL', tex: 'C_n' },
        C0: { name: 'starting concentration', q: false, unit: 'mg/mL', value: 10, tex: 'C_0' },
        f: { name: 'dilution factor per step', q: false, unit: '', value: 10 },
        n: { name: 'number of steps', q: false, unit: '', value: 4, int: true }
      },
      note: 'Four steps of 1 in 10 give 1 in 10 000. Random errors of the steps add roughly as the square root of the sum of their squares.',
      practice: { unknowns: ['Cn', 'n'] },
      stories: { Cn: 'A {C0} solution is diluted {n} times, 1 in {f} each time. What is the final concentration?', n: 'How many 1 in {f} steps take a {C0} solution down to {Cn}?' }
    },
    {
      name: 'Mixing two solutions',
      expr: 'C = (Ca*Va + Cb*Vb)/(Va + Vb)', tex: 'C = \\dfrac{C_a V_a + C_b V_b}{V_a + V_b}',
      vars: {
        C: { name: 'strength of the mixture', q: false, unit: 'mg/mL' },
        Ca: { name: 'first strength', q: false, unit: 'mg/mL', value: 10, tex: 'C_a' },
        Va: { name: 'first volume', q: false, unit: 'mL', value: 100, tex: 'V_a' },
        Cb: { name: 'second strength', q: false, unit: 'mg/mL', value: 2, tex: 'C_b' },
        Vb: { name: 'second volume', q: false, unit: 'mL', value: 300, tex: 'V_b' }
      },
      note: 'A volume-weighted mean, assuming the volumes add. Solving for a volume is alligation.',
      practice: { unknowns: ['C', 'Va'] },
      stories: { C: '{Va} of a {Ca} solution is mixed with {Vb} of a {Cb} solution. What is the strength of the mixture?', Va: 'How much {Ca} solution must be added to {Vb} of {Cb} to give {C}?' }
    }
  ],
  examples: [
    {
      title: 'Making up a dilution',
      q: 'Make 250 mL of a 2 mg/mL solution of a hypothetical drug from a 50 mg/mL stock. What do you measure, and with what?',
      steps: [
        '$V_1 = C_2V_2/C_1 = 2 \\times 250/50 = 10$ mL of stock.',
        'Measure 10 mL with a 10 mL syringe or a 10 mL cylinder — not with the 250 mL cylinder, where half a graduation is a 10 % error.',
        'Transfer it and make up to 250 mL with the specified diluent; mix well.',
        'Check: $10 \\times 50 = 500$ mg in 250 mL = 2 mg/mL.'
      ],
      a: '10 mL of stock made up to 250 mL (about 240 mL of diluent).'
    },
    {
      title: 'A concentrate diluted for use',
      q: 'A hypothetical antiseptic concentrate is 5 % w/v. How much concentrate makes 1 litre of a 0.05 % solution, and what is the dilution?',
      steps: [
        '$V_1 = 0.05 \\times 1000/5 = 10$ mL.',
        'Dilution factor $5/0.05 = 100$: a 1 in 100 dilution — 10 mL made up to 1000 mL.'
      ],
      a: '10 mL of concentrate made up to 1 L: 1 in 100.'
    },
    {
      title: 'A serial dilution for a standard',
      q: 'An assay needs a 1 µg/mL standard, starting from a 10 mg/mL stock. Plan it.',
      steps: [
        '10 mg/mL = 10 000 µg/mL, so the overall factor is 10 000.',
        'In one step: 0.01 mL of stock in 100 mL — too small to measure accurately.',
        'Four steps of 1 in 10: 1 mL of each solution made up to 10 mL with diluent, giving 1000, 100, 10 and finally 1 µg/mL.',
        'If each step is within ±1 %, the final standard is within about $\\sqrt{4} \\times 1 = 2$ %.'
      ],
      a: 'Four 1 in 10 steps (1 mL made up to 10 mL each time).'
    }
  ],
  quiz: [
    { q: 'How many mL of a 20 mg/mL stock make 100 mL of a 0.5 mg/mL solution?', answer: 2.5, unit: 'mL', why: 'V₁ = 0.5 × 100/20 = 2.5 mL, made up to 100 mL.' },
    { q: '"Dilute 1 in 5" means…', choices: ['1 volume of stock + 5 volumes of diluent', '1 volume of stock + 4 volumes of diluent', '5 volumes of stock + 1 volume of diluent', '1 volume of stock in 50 volumes'], a: 1, why: 'One part in five parts in total: 1 of stock and 4 of diluent. Adding 5 volumes gives 1 in 6.' },
    { q: 'Three serial 1 in 10 dilutions of a 5 mg/mL solution give what concentration, in mg/mL?', answer: 0.005, unit: 'mg/mL', why: '5/10³ = 0.005 mg/mL = 5 µg/mL.' },
    { q: 'Mixing 100 mL of a 10 % solution with 100 mL of a 2 % solution gives a 12 % solution.', a: false, why: 'Strengths do not add: the mixture is the weighted mean, (10 × 100 + 2 × 100)/200 = 6 %.' },
    { q: 'Why make up to the mark rather than add a calculated volume of diluent?', choices: ['it is faster', 'volumes are not always additive, and dissolved solids take up room', 'diluents evaporate', 'it avoids the need to mix'], a: 1, why: 'Mixtures such as ethanol and water shrink, and solutes occupy volume; making up to a mark gives the true final volume.' }
  ],
  problems: [
    { q: '15 mL of a 40 mg/mL solution is diluted to 6 mg/mL. What is the final volume?', answer: 100, unit: 'mL', tol: 0.02, steps: ['$V_2 = C_1V_1/C_2 = 40 \\times 15/6 = 100$ mL.'] },
    { q: 'A 10 mL vial of 50 mg/mL is added to a 250 mL bag of diluent. What is the concentration in the bag (mg/mL)?', answer: 1.923, unit: 'mg/mL', tol: 0.02, steps: ['Drug: $10 \\times 50 = 500$ mg.', 'Volume: $250 + 10 = 260$ mL (the vial adds its volume).', '$500/260 = 1.92$ mg/mL — 4 % below the 2 mg/mL that "500 mg in 250 mL" suggests.'] }
  ],
  applications: ['Diluting injections into bags and syringes for infusion.', 'Making calibration standards for HPLC and other assays.', 'Preparing working solutions of disinfectants and antiseptics.', 'Serial dilutions in microbiology counts and allergy testing.'],
  sim: ['calc-cylinder', 'calc-serial']
},

{
  id: 'alligation', parent: 'calc-topic', title: 'Alligation', level: 2,
  short: 'Alligation finds how much of a stronger and a weaker preparation to mix for a strength in between: the parts are the differences across a diagonal grid. It is a weighted mean run backwards — the same lever rule that balances a see-saw.',
  keywords: ['alligation alternate', 'alligation medial', 'parts', 'mixing strengths', 'weighted mean', 'lever rule', 'diluent', 'base', 'fortifying', 'ointment strength', 'grid method', 'pure drug'],
  prereq: ['dilution-concentration', 'percent-strength', 'math:linear-equations'],
  related: ['compounding', 'ointments-creams', 'surfactants', 'math:systems-of-equations', 'meq-mmol'],
  body: `
You have a 2.5 % ointment and a 0.5 % ointment of the same drug, and you need 100 g of 1 %. How much of each? You could set up two equations — total mass and total drug — and solve them. **Alligation** is a quick, reliable shortcut for exactly that, used by pharmacists for centuries.

### The grid
Write the higher strength top left, the lower bottom left and the strength wanted in the middle. Subtract along the diagonals, always the smaller from the larger:

| Strengths | Wanted | Parts |
|---|---|---|
| 2.5 % (high) | | 1 − 0.5 = **0.5** |
| | **1 %** | |
| 0.5 % (low) | | 2.5 − 1 = **1.5** |

The parts are read straight across: 0.5 part of the 2.5 % and 1.5 parts of the 0.5 %, a ratio of 1 : 3. For 100 g: 25 g of the 2.5 % and 75 g of the 0.5 %. **Check** by the forward calculation (alligation medial): $(25 \\times 2.5 + 75 \\times 0.5)/100 = 1.00$ %.

### Why it works: a balance
Drug is conserved: $m_H H + m_L L = (m_H + m_L)\\,W$. Rearranged,

$$m_H\\,(H - W) = m_L\\,(W - L) \\qquad\\Rightarrow\\qquad \\frac{m_H}{m_L} = \\frac{W - L}{H - W}$$

This is the law of the lever. Put the strengths on a beam as positions and the amounts as weights: the beam balances with its fulcrum at the wanted strength. The nearer the wanted strength lies to one component, the more of that component you need — and the diagonal subtraction in the grid is simply the two lever arms, swapped over.

### Special cases
- **A diluent or base** has strength 0. To make 60 g of 3 % from a 10 % ointment and plain base: parts 3 and 7, so 18 g of the 10 % and 42 g of base.
- **Pure drug** has strength 100 %. To raise 100 g of a 1 % cream to 2 %, the parts are 1 of drug and 98 of cream, so add $100/98 = 1.02$ g of drug — not 1 g, because the drug added also adds weight.
- **More than two components:** pair each stronger with a weaker one and add the parts. There are many right answers; pick a convenient one and check it.

### Use the right basis
Alligation mixes whatever the percentages are measured in. For % w/w, the parts are weights; for % w/v and % v/v, volumes — and then only if the volumes add. Ethanol and water shrink when mixed, so accurate alcohol dilutions use official tables by weight. Anything that mixes as a weighted mean can be alligated: the HLB of a blend of emulsifiers ([[surfactants]]), the strength of glucose solutions for a nutrition bag, the density of a blend.

> [!warn] The preparations here are hypothetical. Real compounding follows a verified formula, the product information and local procedures, with an independent check of the calculation and the weighings. Try your own numbers in [the alligation calculator](#/tools/pharmcalc/alligation).
`,
  ideas: [
    'Alligation: parts of the stronger = wanted − weaker; parts of the weaker = stronger − wanted.',
    'It is the lever rule: m_H (H − W) = m_L (W − L); the fulcrum sits at the wanted strength.',
    'A base or diluent counts as 0 %; pure drug as 100 %.',
    'Always check with the forward calculation (alligation medial), a weighted mean.',
    'The parts share the basis of the percentages: weights for w/w, volumes for w/v and v/v.'
  ],
  pitfalls: [
    'The parts go straight across — The subtraction runs along the diagonals: the stronger preparation gets (wanted − weaker) parts. Reading them straight across swaps the proportions and misses the strength on the wrong side.',
    'Adding pure drug is a simple percentage of the batch — The drug adds weight too; the amount is m(C₂ − C₁)/(100 − C₂), a little more than m(C₂ − C₁)/100.',
    'Alligation works in any units — Only when the amounts and the strengths share a basis: weights for % w/w, volumes for % w/v or v/v, and only if the volumes add.'
  ],
  formulas: [
    {
      name: 'Amount of the stronger preparation',
      expr: 'mH = T*(W - L)/(H - L)', tex: 'm_H = T\\,\\dfrac{W - L}{H - L}',
      vars: {
        mH: { name: 'amount of the stronger', q: false, unit: 'g', tex: 'm_H' },
        T: { name: 'total amount wanted', q: false, unit: 'g', value: 100 },
        W: { name: 'strength wanted', q: false, unit: '%', value: 1 },
        L: { name: 'weaker strength', q: false, unit: '%', value: 0.5 },
        H: { name: 'stronger strength', q: false, unit: '%', value: 2.5 }
      },
      note: 'The rest, T − m_H, is the weaker preparation. W must lie between L and H.',
      practice: { unknowns: ['mH', 'W'] },
      stories: {
        mH: 'How much of a {H} preparation, mixed with a {L} one, makes {T} of {W}?',
        W: '{mH} of a {H} preparation is mixed with the {L} one to a total of {T}. What is the strength?'
      }
    },
    {
      name: 'Alligation medial: the strength of a mixture',
      expr: 'C = (C1*m1 + C2*m2)/(m1 + m2)', tex: 'C = \\dfrac{C_1 m_1 + C_2 m_2}{m_1 + m_2}',
      vars: {
        C: { name: 'strength of the mixture', q: false, unit: '%' },
        C1: { name: 'first strength', q: false, unit: '%', value: 2.5, tex: 'C_1' },
        m1: { name: 'first amount', q: false, unit: 'g', value: 25, tex: 'm_1' },
        C2: { name: 'second strength', q: false, unit: '%', value: 0.5, tex: 'C_2' },
        m2: { name: 'second amount', q: false, unit: 'g', value: 75, tex: 'm_2' }
      },
      note: 'The forward calculation that checks every alligation.',
      practice: { unknowns: ['C', 'm1'] },
      stories: { C: '{m1} of a {C1} ointment is mixed with {m2} of a {C2} ointment. What is the strength of the mixture?', m1: 'How much {C1} ointment added to {m2} of {C2} gives {C}?' }
    },
    {
      name: 'Fortifying with pure drug',
      expr: 'x = m*(C2 - C1)/(100 - C2)', tex: 'x = m\\,\\dfrac{C_2 - C_1}{100 - C_2}',
      vars: {
        x: { name: 'pure drug to add', q: false, unit: 'g' },
        m: { name: 'amount of the preparation', q: false, unit: 'g', value: 100 },
        C1: { name: 'present strength', q: false, unit: '% w/w', value: 1, tex: 'C_1' },
        C2: { name: 'strength wanted', q: false, unit: '% w/w', value: 2, tex: 'C_2' }
      },
      note: 'Alligation with pure drug at 100 %: parts of drug C₂ − C₁, parts of preparation 100 − C₂.',
      stories: { x: 'How much pure drug raises {m} of a {C1} cream to {C2}?', C2: 'Adding {x} of pure drug to {m} of a {C1} cream gives what strength?' }
    },
    {
      name: 'Ratio of the parts',
      expr: 'r = (W - L)/(H - W)', tex: 'r = \\dfrac{W - L}{H - W}',
      vars: {
        r: { name: 'parts of stronger per part of weaker', q: false, unit: '' },
        W: { name: 'strength wanted', q: false, unit: '%', value: 1 },
        L: { name: 'weaker strength', q: false, unit: '%', value: 0.5 },
        H: { name: 'stronger strength', q: false, unit: '%', value: 2.5 }
      },
      note: 'The lever rule: the amounts are inversely proportional to their distances from the wanted strength.',
      practice: { unknowns: ['r', 'W'] },
      stories: { r: 'In what ratio must {H} and {L} preparations be mixed to give {W}?' }
    }
  ],
  examples: [
    {
      title: 'Two ointments',
      q: 'Make 100 g of a 1 % w/w ointment of a hypothetical drug from 2.5 % and 0.5 % ointments.',
      steps: [
        'Parts of 2.5 %: $1 - 0.5 = 0.5$; parts of 0.5 %: $2.5 - 1 = 1.5$; total 2 parts.',
        '2.5 %: $100 \\times 0.5/2 = 25$ g; 0.5 %: $100 \\times 1.5/2 = 75$ g.',
        'Check: $(25 \\times 2.5 + 75 \\times 0.5)/100 = 1.00$ %.'
      ],
      a: '25 g of the 2.5 % and 75 g of the 0.5 %.'
    },
    {
      title: 'Diluting with a base',
      q: 'Make 60 g of a 3 % w/w ointment from a 10 % ointment and plain base.',
      steps: [
        'Parts of 10 %: $3 - 0 = 3$; parts of base: $10 - 3 = 7$; total 10.',
        '10 %: $60 \\times 3/10 = 18$ g; base: 42 g.',
        'Check: $18 \\times 10/60 = 3$ %.'
      ],
      a: '18 g of the 10 % ointment and 42 g of base.'
    },
    {
      title: 'Fortifying a cream',
      q: 'How much pure drug raises 100 g of a 1 % w/w cream to 2 %?',
      steps: [
        'Pure drug is 100 %: parts of drug $2 - 1 = 1$; parts of cream $100 - 2 = 98$.',
        'Drug: $100 \\times 1/98 = 1.02$ g.',
        'Check: $(1 + 1.02)/(100 + 1.02) = 2.00$ %. Adding just 1 g would give $2/101 = 1.98$ %.'
      ],
      a: '1.02 g of drug.'
    }
  ],
  quiz: [
    { q: 'Mixing 5 % and 1 % preparations to make 2 %, the proportions are…', choices: ['1 part of 5 % to 3 parts of 1 %', '3 parts of 5 % to 1 part of 1 %', '1 part to 1 part', '2 parts to 3 parts'], a: 0, why: 'Diagonals: 5 % gets 2 − 1 = 1 part, 1 % gets 5 − 2 = 3 parts. The wanted strength lies close to 1 %, so most of the mix is 1 %.' },
    { q: 'How many grams of a 20 % w/w ointment, mixed with base, make 50 g of 4 %?', answer: 10, unit: 'g', why: 'Parts: 20 % gets 4, base gets 16; 50 × 4/20 = 10 g of the 20 %, 40 g of base.' },
    { q: 'To raise 200 g of a 1 % cream to 3 %, you add 4 g of pure drug.', a: false, why: 'The added drug adds weight: 200 × 2/97 = 4.12 g. 4 g would give 6/204 = 2.94 %.' },
    { q: 'Why is alligation of 96 % v/v ethanol with water by volume only approximate?', choices: ['ethanol evaporates while mixing', 'the volumes are not additive: the mixture shrinks', 'percentages v/v cannot be averaged', 'water has a higher density'], a: 1, why: 'Ethanol and water pack together, so the mixed volume is less than the sum; official ethanol dilution tables work by weight.' },
    { q: 'The strength of a mixture always lies nearer to the component used in the larger amount.', a: true, why: 'It is a weighted mean: the lever balances nearer the heavier weight.' }
  ],
  problems: [
    { q: 'Mix 70 % and 30 % w/w preparations to make 400 g of 45 %. How much of the 70 %?', answer: 150, unit: 'g', tol: 0.02, steps: ['Parts: 70 % gets 45 − 30 = 15; 30 % gets 70 − 45 = 25; total 40.', '$400 \\times 15/40 = 150$ g of the 70 % and 250 g of the 30 %.'] },
    { q: 'How much pure drug must be added to 250 g of a 0.5 % w/w ointment to make it 1 %?', answer: 1.263, unit: 'g', tol: 0.02, steps: ['$x = 250 \\times (1 - 0.5)/(100 - 1) = 125/99 = 1.26$ g.'] }
  ],
  applications: ['Making intermediate strengths of creams and ointments from stock strengths.', 'Diluting stock ethanol and other liquids (by weight where volumes do not add).', 'Blending surfactants to a required HLB.', 'Mixing glucose solutions of different strengths for nutrition.'],
  history: 'Alligation — from the Latin *alligare*, to bind together, after the lines that link the numbers — was a standard chapter of medieval and Renaissance arithmetic books, used for mixing wines, grain and metals of different prices or purities. Apothecaries adopted it for strengths, and it is still taught because it is quick and easy to check.',
  sim: 'calc-alligation'
},

{
  id: 'meq-mmol', parent: 'calc-topic', title: 'Milliequivalents and millimoles', level: 2,
  short: 'Electrolytes are counted by particles, not grams. Millimoles = mg ÷ molar mass; milliequivalents = millimoles × charge; milliosmoles count every dissolved particle. One gram of potassium chloride is 13.4 mmol of K⁺, and 0.9 % sodium chloride carries 154 mmol/L of Na⁺.',
  keywords: ['millimole', 'mmol', 'milliequivalent', 'mEq', 'valence', 'charge', 'milliosmole', 'mOsm', 'molar mass', 'hydrate', 'water of crystallisation', 'potassium chloride', 'sodium chloride', 'calcium chloride', 'calcium gluconate', 'magnesium sulfate', 'sodium bicarbonate 8.4 %', 'electrolyte replacement'],
  prereq: ['units-pharmacy', 'chemistry:molar-mass', 'chemistry:molarity', 'medicine:electrolytes'],
  related: ['isotonic-calculations', 'osmolarity-tonicity', 'percent-strength', 'infusion-rates', 'medicine:body-fluids', 'renal-adjustment'],
  body: `
A gram of sodium chloride and a gram of potassium chloride look the same on a balance, but they do not contain the same number of ions: potassium is heavier than sodium, so a gram of KCl holds fewer particles. Nerves, muscles and kidneys respond to the number of ions and to their charge, so electrolytes are prescribed and measured in **millimoles** and **milliequivalents**, not milligrams.

### Millimoles
A millimole is a thousandth of a mole; the molar mass in g/mol is also mg per mmol, so

$$n\\,(\\text{mmol}) = \\frac{m\\,(\\text{mg})}{M\\,(\\text{g/mol})}$$

Potassium chloride, $M = 74.55$ g/mol: 1 g = 1000/74.55 = **13.4 mmol**, which releases 13.4 mmol of K⁺ and 13.4 mmol of Cl⁻. Use the molar mass of the exact salt on the label, **including any water of crystallisation**: calcium chloride dihydrate (147.0 g/mol) contains less calcium per gram than anhydrous calcium chloride (111.0 g/mol).

### Milliequivalents: counting charge
$$\\text{mEq} = \\text{mmol} \\times z$$
where $z$ is the charge of the ion. For Na⁺, K⁺, Cl⁻ and HCO₃⁻, mEq and mmol are the same number; for Ca²⁺ and Mg²⁺ the mEq are twice the mmol. Phosphate is the exception: its charge depends on the pH (H₂PO₄⁻ and HPO₄²⁻ coexist at body pH), so it is prescribed in mmol, never in mEq.

| Salt | M (g/mol) | 1 g gives |
|---|---|---|
| Sodium chloride, NaCl | 58.44 | 17.1 mmol Na⁺ (17.1 mEq) |
| Potassium chloride, KCl | 74.55 | 13.4 mmol K⁺ (13.4 mEq) |
| Sodium bicarbonate, NaHCO₃ | 84.01 | 11.9 mmol Na⁺ and HCO₃⁻ |
| Calcium chloride dihydrate | 147.0 | 6.8 mmol Ca²⁺ (13.6 mEq) |
| Calcium gluconate (monohydrate) | 448.4 | 2.2 mmol Ca²⁺ (4.5 mEq) |
| Magnesium sulfate heptahydrate | 246.5 | 4.1 mmol Mg²⁺ (8.1 mEq) |

> [!fact] Ten millilitres of a 10 % calcium chloride injection contains about three times as much calcium as ten millilitres of 10 % calcium gluconate — 6.8 against 2.2 mmol. The percentages match; the salts do not.

### From a percentage to mmol per litre
A % w/v solution holds $10P$ grams per litre, so $c = 10\\,000\\,P/M$ mmol/L. Sodium chloride 0.9 %: $10\\,000 \\times 0.9/58.44 = 154$ mmol/L of Na⁺ and of Cl⁻ — somewhat more than plasma (Na⁺ roughly 135–145 mmol/L, Cl⁻ roughly 98–107, depending on the laboratory). Sodium bicarbonate 8.4 % gives $84\\,000/84.01 = 1000$ mmol/L — exactly **1 mmol per mL**, which is why that strength was chosen.

### Milliosmoles: counting particles
Osmotic effects depend on the number of dissolved particles: mOsm = mmol × the particles each formula unit releases (NaCl 2, CaCl₂ 3, glucose 1). Ideal 0.9 % NaCl is 308 mOsm/L; measured, it is about 286 mOsm/kg, because ions in solution attract each other and act as slightly fewer particles (an osmotic coefficient of about 0.93). Plasma is about 285–295 mOsm/kg. How that sets comfort and safety is the subject of [[osmolarity-tonicity]] and [[isotonic-calculations]].

> [!warn] Concentrated potassium chloride injection is a **high-alert medicine**: potassium given undiluted or too fast can stop the heart. After fatal mix-ups, many health systems — the UK, from a 2002 national alert — removed concentrated potassium ampoules from general wards in favour of ready-diluted bags. All numbers here are illustrations; electrolyte replacement follows local protocols, product information and an independent double check. Explore your own numbers in [the mmol, mEq and mOsm calculator](#/tools/pharmcalc/electrolytes).
`,
  ideas: [
    'mmol = mg ÷ molar mass (g/mol); use the molar mass of the exact salt, hydrate water included.',
    'mEq = mmol × charge: equal for Na⁺, K⁺, Cl⁻; double for Ca²⁺ and Mg²⁺.',
    'mOsm = mmol × particles per formula unit (ideal); real solutions of salts act as about 0.93 of that.',
    'A % w/v solution holds 10 000 P/M mmol/L: 0.9 % NaCl is 154 mmol/L, 8.4 % bicarbonate 1 mmol/mL.',
    'Equal percentages of different salts can hold very different amounts of the same ion.'
  ],
  pitfalls: [
    'mEq and mmol are the same thing — Only for ions of charge 1. For Ca²⁺ and Mg²⁺ one mmol is two mEq, and for phosphate mEq are ambiguous, so it is prescribed in mmol.',
    'A gram of any calcium salt gives the same calcium — Calcium gluconate is mostly gluconate: a gram gives 2.2 mmol of Ca²⁺ against 6.8 mmol from calcium chloride dihydrate.',
    'Sodium chloride 0.9 % is exactly 308 mOsm/kg — That is the ideal count; the measured osmolality is about 286 mOsm/kg because the ions interact.'
  ],
  formulas: [
    {
      name: 'Millimoles from mass',
      expr: 'n = m/M', tex: 'n = \\dfrac{m}{M}',
      vars: {
        n: { name: 'amount', q: false, unit: 'mmol' },
        m: { name: 'mass of the salt', q: false, unit: 'mg', value: 1000 },
        M: { name: 'molar mass of the salt', q: false, unit: 'g/mol', value: 74.55 }
      },
      note: 'mg divided by g/mol gives mmol. Use the molar mass of the salt exactly as on the label (with its water of crystallisation).',
      stories: {
        n: 'How many millimoles are in {m} of potassium chloride ({M})?',
        m: 'How many mg of a salt of molar mass {M} contain {n}?'
      }
    },
    {
      name: 'Milliequivalents',
      expr: 'mEq = m*z/M', tex: '\\text{mEq} = \\dfrac{m\\,z}{M}',
      vars: {
        mEq: { name: 'milliequivalents of the ion', q: false, unit: 'mEq', tex: '\\text{mEq}' },
        m: { name: 'mass of the salt', q: false, unit: 'mg', value: 1000 },
        z: { name: 'charge of the ion (per formula unit)', q: false, unit: '', value: 2, int: true },
        M: { name: 'molar mass of the salt', q: false, unit: 'g/mol', value: 147.01 }
      },
      note: 'For a salt that releases one ion of charge z per formula unit; the default is calcium chloride dihydrate.',
      practice: { unknowns: ['mEq', 'm'] },
      stories: { mEq: 'How many mEq of the cation are in {m} of a salt of molar mass {M}, with charge {z}?', m: 'What mass of a salt (M = {M}, charge {z}) provides {mEq}?' }
    },
    {
      name: 'Percentage strength to mmol per litre',
      expr: 'c = 10000*P/M', tex: 'c = \\dfrac{10\\,000\\,P}{M}',
      vars: {
        c: { name: 'concentration', q: false, unit: 'mmol/L' },
        P: { name: 'strength', q: false, unit: '% w/v', value: 0.9 },
        M: { name: 'molar mass', q: false, unit: 'g/mol', value: 58.44 }
      },
      note: 'P % w/v is 10P g/L; dividing by M gives mol/L, and × 1000 gives mmol/L.',
      stories: { c: 'What is the molar concentration of a {P} solution of a salt with molar mass {M}?', P: 'What % w/v strength of a salt ({M}) gives {c}?' }
    },
    {
      name: 'Ideal osmolarity of a solution',
      expr: 'Osm = 10000*P*np/M', tex: '\\text{Osm} = \\dfrac{10\\,000\\,P\\,n_p}{M}',
      vars: {
        Osm: { name: 'ideal osmolarity', q: false, unit: 'mOsm/L', tex: '\\text{Osm}' },
        P: { name: 'strength', q: false, unit: '% w/v', value: 0.9 },
        np: { name: 'particles per formula unit', q: false, unit: '', value: 2, int: true, tex: 'n_p' },
        M: { name: 'molar mass', q: false, unit: 'g/mol', value: 58.44 }
      },
      note: 'Ideal: salts behave as slightly fewer particles (osmotic coefficient about 0.93 for NaCl), so measured values are a little lower.',
      practice: { unknowns: ['Osm', 'P'] },
      stories: { Osm: 'What is the ideal osmolarity of a {P} solution of a solute with molar mass {M} that releases {np} particles?', P: 'What strength of a solute ({M}, {np} particles) is {Osm}?' }
    }
  ],
  examples: [
    {
      title: 'Potassium in a bag',
      q: 'A hypothetical 500 mL bag contains 1.5 g of potassium chloride. How many mmol of K⁺ does it contain, and at what concentration?',
      steps: [
        '$n = 1500/74.55 = 20.1$ mmol of K⁺ (and of Cl⁻).',
        'Concentration: $20.1/0.5 = 40.2$ mmol/L.'
      ],
      a: 'About 20 mmol of K⁺, 40 mmol/L.'
    },
    {
      title: 'Two calcium injections',
      q: 'Compare the calcium in 10 mL of 10 % calcium chloride dihydrate with 10 mL of 10 % calcium gluconate (monohydrate, 448.4 g/mol).',
      steps: [
        'Each contains 1 g of salt (10 % w/v × 10 mL).',
        'Chloride: $1000/147.0 = 6.8$ mmol Ca²⁺ = 13.6 mEq.',
        'Gluconate: $1000/448.4 = 2.23$ mmol Ca²⁺ = 4.46 mEq.',
        'The chloride delivers about 3 times as much calcium — a reason protocols name the salt, not just the percentage.'
      ],
      a: '6.8 mmol against 2.2 mmol of calcium.'
    },
    {
      title: 'Normal saline in three units',
      q: 'Express 0.9 % w/v sodium chloride in mmol/L of Na⁺, in mEq/L and as an ideal osmolarity.',
      steps: [
        '$c = 10\\,000 \\times 0.9/58.44 = 154$ mmol/L of Na⁺ (and of Cl⁻).',
        'Na⁺ has charge 1: 154 mEq/L.',
        'Two particles per NaCl: $2 \\times 154 = 308$ mOsm/L (ideal); measured about 286 mOsm/kg.'
      ],
      a: '154 mmol/L = 154 mEq/L of Na⁺; about 308 mOsm/L ideal.'
    }
  ],
  quiz: [
    { q: 'How many mmol of K⁺ are in 1 g of potassium chloride (74.55 g/mol)?', answer: 13.4, unit: 'mmol', why: '1000 mg ÷ 74.55 g/mol = 13.4 mmol.' },
    { q: 'For magnesium (Mg²⁺), 5 mmol equals…', choices: ['2.5 mEq', '5 mEq', '10 mEq', '20 mEq'], a: 2, why: 'mEq = mmol × charge = 5 × 2 = 10 mEq.' },
    { q: 'Equal masses of calcium chloride dihydrate and calcium gluconate provide the same amount of calcium.', a: false, why: 'Molar masses 147 and 448 g/mol: per gram the chloride gives about three times the calcium.' },
    { q: 'What is the ideal osmolarity of 0.9 % w/v sodium chloride?', answer: 308, unit: 'mOsm/L', why: '154 mmol/L × 2 particles = 308 mOsm/L (measured about 286 mOsm/kg).' },
    { q: 'Why is phosphate prescribed in mmol rather than mEq?', choices: ['its charge depends on the pH, so mEq are ambiguous', 'phosphate carries no charge', 'phosphate has no molar mass', 'mEq are only used for anions'], a: 0, why: 'At body pH phosphate is a mixture of H₂PO₄⁻ and HPO₄²⁻, so its average charge is not a fixed number.' }
  ],
  problems: [
    { q: 'How many mmol of sodium are in a 50 mL syringe of 8.4 % w/v sodium bicarbonate (84.01 g/mol)?', answer: 50, unit: 'mmol', tol: 0.02, steps: ['8.4 % = 84 g/L = 1000 mmol/L = 1 mmol/mL.', '$50 \\times 1 = 50$ mmol.'] },
    { q: 'What mass of magnesium sulfate heptahydrate (246.47 g/mol) provides 20 mmol of Mg²⁺, in grams?', answer: 4.93, unit: 'g', tol: 0.02, steps: ['$20 \\times 246.47 = 4929$ mg ≈ 4.93 g (40 mEq).'] }
  ],
  applications: ['Reading infusion fluids and electrolyte additives in mmol/L.', 'Comparing salts of the same ion (calcium chloride and gluconate; potassium chloride and phosphate).', 'Estimating the osmolarity of parenteral nutrition and injections.', 'Converting laboratory results between mEq/L and mmol/L.'],
  history: 'Equivalent weights — how much of one substance reacts with a fixed amount of another — go back to Jeremias Richter\'s stoichiometry in the 1790s. In medicine the milliequivalent became standard in the 1940s, when James Gamble\'s bar charts of the ions in plasma, in mEq/L, showed that the charges always balance. Laboratories using SI units have since moved to mmol/L, which for most ions is the same number.',
  sim: 'calc-ions'
},

{
  id: 'isotonic-calculations', parent: 'calc-topic', title: 'Making solutions isotonic', level: 2,
  short: 'Eye drops and injections are adjusted to the tonicity of body fluids — the same as 0.9 % sodium chloride, freezing at −0.52 °C. The sodium chloride equivalent method counts each ingredient as its weight × E grams of NaCl and adds salt up to 0.009 g per mL.',
  keywords: ['isotonic', 'tonicity', 'sodium chloride equivalent', 'E value', 'freezing-point depression', '0.52 °C', 'White–Vincent method', 'Liso', 'hypotonic', 'hypertonic', 'haemolysis', 'eye drops', 'iso-osmotic', 'boric acid', 'tonicity adjustment'],
  prereq: ['osmolarity-tonicity', 'meq-mmol', 'chemistry:colligative-properties'],
  related: ['ophthalmic', 'injectable-formulation', 'nasal-otic', 'percent-strength', 'chemistry:osmotic-pressure', 'biology:diffusion-osmosis'],
  body: `
Put a red blood cell in pure water and it swells until it bursts; put it in strong salt water and it shrivels. Tears and nasal lining react the same way, only as stinging and irritation. So solutions that meet cells — eye drops, nasal sprays, injections, especially large volumes — are made **isotonic**: with the same effective concentration of dissolved particles as body fluids. That is the concentration of 0.9 % w/v sodium chloride, about 290 mOsm/kg, which freezes at **−0.52 °C** (as do blood and tears).

### The sodium chloride equivalent, E
The **sodium chloride equivalent** $E$ of a substance is the mass of NaCl that has the same osmotic effect as 1 g of the substance. An isotonic solution holds 0.9 g of NaCl-equivalent per 100 mL — 0.009 g per mL — so the salt to add is

$$W_{NaCl} = 0.009\\,V - \\sum w\\,E$$

Typical textbook values: boric acid 0.50, potassium chloride 0.76, glycerol 0.34, glucose (monohydrate) 0.16; many drug salts of molar mass 250–450 have E of 0.1–0.25. Example: 30 mL of eye drops containing 2 % of a hypothetical drug with E = 0.20. The drug is $0.6 \\times 0.20 = 0.12$ g of NaCl-equivalent; the full solution needs $0.009 \\times 30 = 0.27$ g; so add **0.15 g** of NaCl. If chloride is unwanted (it precipitates silver salts, for instance), use another adjuster by dividing by its E: boric acid $0.15/0.50 = 0.30$ g.

### The freezing-point method
Freezing-point depression is a colligative property: it counts particles ([[chemistry:colligative-properties]]). A 1 % solution of NaCl freezes at −0.576 °C. If the unadjusted solution already depresses the freezing point by $a$ °C, the NaCl to add, in g per 100 mL, is

$$w = \\frac{0.52 - a}{0.576}$$

A drug solution that freezes at −0.12 °C needs $(0.52 - 0.12)/0.576 = 0.69$ g of NaCl per 100 mL. (The two methods agree: a 1 % solution of a substance with equivalent E depresses the freezing point by about 0.576 E °C.)

### The White–Vincent method
Instead of adding salt, dissolve the drug in just enough water to make it isotonic, then make up to volume with an isotonic vehicle (0.9 % NaCl or an isotonic buffer). Since 1 g of NaCl makes $1/0.009 = 111.1$ mL isotonic, $V = w\\,E \\times 111.1$ mL. For the eye drops above: $0.6 \\times 0.20 \\times 111.1 = 13.3$ mL of water, made up to 30 mL with the vehicle.

### Where E comes from
Approximately, $E = 17\\,L_{iso}/M$, where $L_{iso}$ is a molar freezing-point factor that depends on how many ions the substance gives: about 1.9 for non-electrolytes, 2.0 for weak electrolytes, 3.4 for salts of two single-charge ions (NaCl, most drug hydrochlorides), 4.3 for salts such as Na₂SO₄ and 4.8 for CaCl₂. For NaCl itself, $17 \\times 3.4/58.44 = 0.99$ — as it should be.

### Iso-osmotic is not always isotonic
Tonicity counts only the particles that *cannot* cross the cell membrane. Boric acid at 1.9 % is iso-osmotic with tears but haemolyses red cells, because it diffuses into them; the same goes for urea and, partly, glycerol. Such solutes add osmolality without adding tonicity.

### How close is close enough?
The eye tolerates roughly 0.6–2 % NaCl-equivalent with little discomfort. Small subcutaneous or intramuscular volumes may be somewhat hypertonic (they can sting); large intravenous volumes must be near isotonic. Hypotonic infusion haemolyses red cells — haemolysis starts below roughly 0.45 % NaCl-equivalent — so water for injections is never infused on its own. Strongly hypertonic nutrition solutions (above roughly 800–900 mOsm/L) go into a central vein, where fast blood flow dilutes them.

> [!warn] The E values and preparations here are textbook illustrations. Real eye drops and injections are made to a verified formula and the pharmacopoeia, under the right conditions, and checked independently. Try your own numbers in [the isotonicity calculator](#/tools/pharmcalc/isotonic).
`,
  ideas: [
    'Isotonic = the effective particle concentration of 0.9 % NaCl: about 290 mOsm/kg, freezing at −0.52 °C.',
    'E is the grams of NaCl equivalent to 1 g of a substance; add NaCl = 0.009 V − Σ w·E.',
    'Freezing-point method: NaCl (g per 100 mL) = (0.52 − a)/0.576.',
    'White–Vincent: dissolve the drug in w·E × 111.1 mL of water, then make up with an isotonic vehicle.',
    'Iso-osmotic is not isotonic when a solute (boric acid, urea) crosses cell membranes.'
  ],
  pitfalls: [
    'Each ingredient should be at 0.9 % — Tonicity is the sum over all dissolved particles: every ingredient contributes w·E, and the total should come to 0.9 % NaCl-equivalent.',
    'An iso-osmotic solution is isotonic — Solutes that cross membranes (boric acid, urea, ethanol) raise osmolality without holding water outside cells; red cells swell and may burst.',
    'E is a fixed constant of a substance — It drifts with concentration because ions interact more in stronger solutions; the tabulated values suit the usual 0.5–3 % strengths.'
  ],
  formulas: [
    {
      name: 'Sodium chloride to add (NaCl-equivalent method)',
      expr: 'W = 0.009*V - w*E', tex: 'W = 0.009\\,V - w\\,E',
      vars: {
        W: { name: 'NaCl to add (negative: already hypertonic)', q: false, unit: 'g', signed: true },
        V: { name: 'final volume', q: false, unit: 'mL', value: 30 },
        w: { name: 'drug in the preparation', q: false, unit: 'g', value: 0.6 },
        E: { name: 'NaCl equivalent of the drug', q: false, unit: '', value: 0.2 }
      },
      note: 'With several ingredients subtract each w·E. 0.009 g/mL is 0.9 % w/v.',
      practice: { unknowns: ['W', 'E'] },
      stories: {
        W: 'How much sodium chloride makes {V} of eye drops containing {w} of a drug (E = {E}) isotonic?',
        E: 'A preparation of {V} with {w} of drug needs {W} of NaCl to be isotonic. What is the drug\'s E value?'
      }
    },
    {
      name: 'Freezing-point method',
      expr: 'w = (0.52 - a)/b', tex: 'w = \\dfrac{0.52 - a}{b}',
      vars: {
        w: { name: 'NaCl to add', q: false, unit: 'g per 100 mL' },
        a: { name: 'freezing-point depression of the unadjusted solution', q: false, unit: '°C', value: 0.12 },
        b: { name: 'depression by 1 % NaCl', q: false, unit: '°C', value: 0.576, fixed: true }
      },
      note: 'Blood and tears freeze at −0.52 °C. If a is above 0.52 °C the solution is already hypertonic.',
      stories: { w: 'A drug solution freezes at −{a}. How much NaCl per 100 mL makes it isotonic?', a: 'A solution needed {w} of NaCl to become isotonic. By how much did it depress the freezing point before?' }
    },
    {
      name: 'White–Vincent: the isotonic volume',
      expr: 'V = w*E*111.1', tex: 'V = w\\,E \\times 111.1',
      vars: {
        V: { name: 'water that makes the drug isotonic', q: false, unit: 'mL' },
        w: { name: 'mass of drug', q: false, unit: 'g', value: 0.6 },
        E: { name: 'NaCl equivalent', q: false, unit: '', value: 0.2 }
      },
      note: '111.1 mL = 1/0.009: the volume that 1 g of NaCl makes isotonic. Make up to the final volume with an isotonic vehicle.',
      stories: { V: 'In how much water must {w} of a drug (E = {E}) be dissolved to be isotonic?', w: 'How much drug (E = {E}) makes {V} of water isotonic?' }
    },
    {
      name: 'NaCl equivalent from the molar mass',
      expr: 'E = 17*Liso/M', tex: 'E = \\dfrac{17\\,L_{iso}}{M}',
      vars: {
        E: { name: 'NaCl equivalent', q: false, unit: '' },
        Liso: { name: 'L_iso (1.9 non-electrolyte, 3.4 uni-univalent salt)', q: false, unit: '', value: 3.4, tex: 'L_{iso}' },
        M: { name: 'molar mass', q: false, unit: 'g/mol', value: 350 }
      },
      note: 'An estimate when no measured E is available.',
      stories: { E: 'Estimate the NaCl equivalent of a drug hydrochloride of molar mass {M} (L_iso = {Liso}).', M: 'A salt with L_iso = {Liso} has E = {E}. What is its molar mass?' }
    }
  ],
  examples: [
    {
      title: 'Eye drops by the NaCl-equivalent method',
      q: '30 mL of eye drops contain 2 % w/v of a hypothetical drug with E = 0.20. How much sodium chloride makes them isotonic?',
      steps: [
        'Drug: $0.02 \\times 30 = 0.6$ g, equivalent to $0.6 \\times 0.20 = 0.12$ g of NaCl.',
        'The whole volume needs $0.009 \\times 30 = 0.27$ g of NaCl-equivalent.',
        'Add $0.27 - 0.12 = 0.15$ g of NaCl.'
      ],
      a: '0.15 g of sodium chloride.'
    },
    {
      title: 'The same drops by White–Vincent',
      q: 'Make the same drops isotonic by the White–Vincent method.',
      steps: [
        '$V = 0.6 \\times 0.20 \\times 111.1 = 13.3$ mL of water dissolves the drug to an isotonic solution.',
        'Make up to 30 mL with an isotonic vehicle — 16.7 mL of 0.9 % NaCl or an isotonic buffer.',
        'Check: the vehicle adds $16.7 \\times 0.009 = 0.15$ g of NaCl — the same as the first method.'
      ],
      a: 'Dissolve the drug in 13.3 mL of water and make up to 30 mL with isotonic vehicle.'
    },
    {
      title: 'The freezing-point method',
      q: 'An unadjusted drug solution freezes at −0.12 °C. How much NaCl is needed for 100 mL, and for 250 mL?',
      steps: [
        '$w = (0.52 - 0.12)/0.576 = 0.69$ g per 100 mL.',
        'For 250 mL: $0.69 \\times 2.5 = 1.74$ g.'
      ],
      a: '0.69 g per 100 mL; 1.74 g for 250 mL.'
    }
  ],
  quiz: [
    { q: 'How many grams of NaCl make 50 mL of water isotonic?', answer: 0.45, unit: 'g', why: '0.009 g/mL × 50 mL = 0.45 g (0.9 % w/v).' },
    { q: 'A drug has E = 0.25. How many grams of NaCl-equivalent does 0.4 g of it provide?', answer: 0.1, unit: 'g', why: '0.4 × 0.25 = 0.1 g.' },
    { q: 'An iso-osmotic solution is always isotonic with red blood cells.', a: false, why: 'Solutes that cross the membrane (boric acid, urea) count in osmolality but not in tonicity; red cells swell in them.' },
    { q: 'What is the freezing point of an isotonic solution?', choices: ['0 °C', '−0.52 °C', '−1.86 °C', '−0.9 °C'], a: 1, why: 'Blood and tears freeze at −0.52 °C, the same as 0.9 % NaCl. −1.86 °C is the depression for 1 mol of particles per kg of water.' },
    { q: 'A solution contains 2.4 % NaCl-equivalent. It is…', choices: ['hypotonic', 'isotonic', 'hypertonic', 'impossible to tell'], a: 2, why: 'Anything above 0.9 % NaCl-equivalent is hypertonic; 2.4 % is beyond what the eye tolerates comfortably.' }
  ],
  problems: [
    { q: 'How much NaCl makes 15 mL of a 1 % w/v solution of a drug with E = 0.18 isotonic?', answer: 0.108, unit: 'g', tol: 0.02, steps: ['Drug: 0.15 g × 0.18 = 0.027 g NaCl-equivalent.', 'Needed: $0.009 \\times 15 = 0.135$ g.', 'Add $0.135 - 0.027 = 0.108$ g.'] },
    { q: 'The eye drops of the first example need 0.15 g of NaCl. How much boric acid (E = 0.50) would do the same job?', answer: 0.3, unit: 'g', tol: 0.02, steps: ['$0.15/0.50 = 0.30$ g of boric acid.'] }
  ],
  applications: ['Adjusting eye drops, nasal sprays and ear drops for comfort.', 'Formulating injections and infusions near isotonic to avoid pain and haemolysis.', 'Choosing a tonicity adjuster other than NaCl when chloride is incompatible.', 'Checking the osmolarity of nutrition solutions before choosing a peripheral or central vein.'],
  history: 'Tonicity calculations grew out of the colligative laws of the late nineteenth century — Raoult on freezing points, van \'t Hoff on osmotic pressure. The sodium chloride equivalent method was introduced for pharmacy in the 1930s and the White–Vincent method in the 1940s, both designed so that a pharmacist could adjust a prescription with a table and a balance.',
  sim: 'calc-isotonic'
},

{
  id: 'dose-calculations', parent: 'calc-topic', title: 'Dose calculations by weight and surface area', level: 2,
  short: 'Most adult doses are fixed, but children, many cancer medicines and some others are dosed by body weight (mg/kg) or body-surface area (mg/m²). The dose becomes a volume through the concentration, and every step is checked: units, per dose or per day, the maximum, and whether the answer is reasonable.',
  keywords: ['mg/kg', 'mg/m²', 'body-surface area', 'BSA', 'Mosteller', 'paediatric dose', 'weight-based dosing', 'maximum dose', 'per dose', 'per day', 'divided doses', 'volume to give', 'tablets', 'Clark\'s rule', 'Young\'s rule', 'ideal body weight', 'allometric scaling', 'dose banding', 'ten-fold error', 'double check'],
  prereq: ['units-pharmacy', 'dilution-concentration', 'medicine:dose-response'],
  related: ['paediatric-geriatric', 'infusion-rates', 'renal-adjustment', 'loading-dose', 'therapeutic-index', 'medication-errors', 'oncology-drugs', 'medicine:child-growth'],
  body: `
Adults come in a fairly narrow range of sizes, and most medicines have a wide enough margin between the dose that works and the dose that harms that one adult dose suits nearly everyone. Children do not: from a 3.5 kg newborn to a 70 kg teenager is a twenty-fold range. So paediatric doses are scaled — usually by body weight — and so are medicines with a narrow margin at any age, such as many cancer medicines, which are scaled by body-surface area. Other adjustments (for kidney function, or by measured blood levels) are on [[renal-adjustment]] and [[tdm]].

### By weight: mg/kg
$$D = d \\times W$$
A hypothetical oral antibiotic at 15 mg/kg per dose for a child of 18 kg: $D = 15 \\times 18 = 270$ mg. Weight-based doses nearly always carry a **maximum** — commonly the usual adult dose — because the mg/kg rule overshoots in heavy children and adults: at 90 kg the same rule would give 1350 mg.

**Per dose or per day?** "30 mg/kg/day in three divided doses" means 10 mg/kg at each dose — 180 mg per dose for the 18 kg child. Read as 30 mg/kg *per dose*, the child gets three times too much. The unit "/day" is the most important part of the order.

Which weight? A recent, measured weight in kilograms. For some drugs in people with obesity, doses are based on ideal or adjusted body weight instead (the Devine formula estimates ideal weight as 50 kg for men, 45.5 kg for women, plus 2.3 kg per inch above 5 feet); the product information says which.

### By body-surface area: mg/m²
Many cancer medicines, and some others, are dosed per square metre of body surface. The most used estimate is **Mosteller's formula** (1987):

$$\\text{BSA} = \\sqrt{\\frac{h\\,(\\text{cm}) \\times W\\,(\\text{kg})}{3600}}$$

A patient of 170 cm and 65 kg has a BSA of 1.75 m², so a hypothetical 100 mg/m² gives 175 mg. Why surface area? Blood flow, kidney filtration and metabolic rate — and so the clearance of many drugs — grow with size more slowly than weight does, roughly as $W^{0.75}$, much like surface area. So compared with a weight-based dose, a surface-area dose gives small children **more per kilogram**:

| Age (typical) | Weight | Height | BSA | Weight as % of adult | BSA as % of adult |
|---|---|---|---|---|---|
| Newborn | 3.5 kg | 50 cm | 0.22 m² | 5 % | 12 % |
| 1 year | 10 kg | 75 cm | 0.46 m² | 14 % | 25 % |
| 5 years | 18 kg | 109 cm | 0.74 m² | 26 % | 40 % |
| 10 years | 32 kg | 139 cm | 1.11 m² | 46 % | 60 % |
| Adult | 70 kg | 175 cm | 1.84 m² | 100 % | 100 % |

Neither rule is the whole truth. Newborns have immature kidneys and liver enzymes and may need *less* per kg than either rule suggests; that is why paediatric doses come from paediatric studies and formularies, not from scaling an adult dose ([[paediatric-geriatric]]). The old shortcuts — Clark's rule (weight in pounds ÷ 150 × adult dose) and Young's rule (age ÷ (age + 12) × adult dose) — are history, not practice.

### From dose to volume or tablets
$$V = \\frac{D}{C}$$
270 mg from a 250 mg/5 mL suspension (50 mg/mL) is 5.4 mL, measured with an oral syringe. Tablets: dose ÷ strength, using only whole or scored tablets unless a liquid is available. Some services round cytotoxic doses to standard "dose bands" within a few per cent, which makes preparation safer. Doses given continuously become pump rates: see [[infusion-rates]], and [the infusion calculator](#/tools/pharmcalc/infusion), which turns µg/kg/min into mL/h.

### The checks
1. **Units and basis**: mg or µg; per dose or per day; mg/kg or mg/m².
2. **Maximum**: never above the stated maximum without a documented reason.
3. **Reasonableness**: would anyone really give 54 mL of an oral liquid to a small child, or 20 vials? A ten-fold error usually looks strange if you stop to look.
4. **An independent double check** by a second qualified person, from the original order, not from your working.

> [!warn] All drugs, doses and patients on this page are hypothetical. Real doses come from the product information, paediatric and adult formularies and local protocols, and are checked independently before they are given. Ten-fold errors — a slipped decimal point, mg for µg, a trailing zero — happen most with children, whose doses are small numbers; the ten-fold visualiser below shows each classic slip.
`,
  ideas: [
    'Weight-based dose: D = d × W, capped at a maximum (often the adult dose).',
    '"mg/kg/day in divided doses" must be divided by the number of doses; confusing it with per dose multiplies the dose.',
    'Mosteller: BSA = √(height cm × weight kg / 3600); surface-area dosing gives small children more per kg than weight dosing.',
    'The volume to give is the dose divided by the concentration: V = D/C.',
    'Check units, basis, maximum and reasonableness, then have a second person check independently.'
  ],
  pitfalls: [
    'mg/kg per day and mg/kg per dose are interchangeable — Confusing them multiplies or divides the dose by the number of doses a day: a three- or four-fold error.',
    'Once the number is right, the unit is a detail — 250 micrograms and 250 mg share a number and differ a thousand-fold, and a handwritten µ is easily read as m. Write "micrograms" in full and check the unit as carefully as the number.',
    'Scaling an adult dose by weight is safe for any child — Newborns may clear drugs far more slowly than their weight suggests, and small children often faster; paediatric doses come from paediatric evidence and formularies.'
  ],
  formulas: [
    {
      name: 'Dose by body weight',
      expr: 'D = d*W', tex: 'D = d \\times W',
      vars: {
        D: { name: 'dose', q: false, unit: 'mg' },
        d: { name: 'dose per kilogram', q: false, unit: 'mg/kg', value: 15 },
        W: { name: 'body weight', q: false, unit: 'kg', value: 18 }
      },
      note: 'Compare the result with the stated maximum. Hypothetical numbers.',
      stories: {
        D: 'A child weighing {W} is prescribed a hypothetical medicine at {d}. What is the dose?',
        d: 'A {W} child receives {D}. What dose per kg is that?',
        W: 'At {d}, a dose of {D} corresponds to what body weight?'
      }
    },
    {
      name: 'Body-surface area (Mosteller)',
      expr: 'BSA = sqrt(h*W/3600)', tex: '\\text{BSA} = \\sqrt{\\dfrac{h\\,W}{3600}}',
      vars: {
        BSA: { name: 'body-surface area', q: false, unit: 'm²', tex: '\\text{BSA}' },
        h: { name: 'height', q: false, unit: 'cm', value: 170 },
        W: { name: 'weight', q: false, unit: 'kg', value: 65 }
      },
      note: 'An empirical formula in these units only (height in cm, weight in kg). Other formulas (DuBois, Haycock) give similar values.',
      stories: { BSA: 'What is the body-surface area of a patient {h} tall weighing {W}?', W: 'A patient {h} tall has a BSA of {BSA}. What does the patient weigh?' }
    },
    {
      name: 'Dose by surface area',
      expr: 'D = dA*BSA', tex: 'D = d_A \\times \\text{BSA}',
      vars: {
        D: { name: 'dose', q: false, unit: 'mg' },
        dA: { name: 'dose per square metre', q: false, unit: 'mg/m²', value: 100, tex: 'd_A' },
        BSA: { name: 'body-surface area', q: false, unit: 'm²', value: 1.75, tex: '\\text{BSA}' }
      },
      note: 'Many services cap the BSA or round the dose to standard bands; follow the protocol.',
      stories: { D: 'A patient with a BSA of {BSA} is prescribed a hypothetical {dA}. What is the dose?', dA: 'A dose of {D} was given to a patient of {BSA}. What was the dose per m²?' }
    },
    {
      name: 'Volume to give',
      expr: 'V = D/C', tex: 'V = \\dfrac{D}{C}',
      vars: {
        V: { name: 'volume', q: false, unit: 'mL' },
        D: { name: 'dose', q: false, unit: 'mg', value: 270 },
        C: { name: 'concentration of the product', q: false, unit: 'mg/mL', value: 50 }
      },
      note: 'For a strength like "250 mg/5 mL", divide first: 50 mg/mL.',
      stories: { V: 'What volume of a {C} liquid contains {D}?', C: '{D} is contained in {V}. What is the concentration?' }
    },
    {
      name: 'Daily dose divided into doses',
      expr: 'Dd = dday*W/n', tex: 'D_d = \\dfrac{d_{day}\\,W}{n}',
      vars: {
        Dd: { name: 'each dose', q: false, unit: 'mg', tex: 'D_d' },
        dday: { name: 'daily dose per kilogram', q: false, unit: 'mg/kg/day', value: 30, tex: 'd_{day}' },
        W: { name: 'body weight', q: false, unit: 'kg', value: 18 },
        n: { name: 'doses a day', q: false, unit: '', value: 3, int: true }
      },
      note: 'Reading mg/kg/day as mg/kg per dose multiplies the dose by n.',
      practice: { unknowns: ['Dd', 'dday'] },
      stories: { Dd: 'A {W} child is prescribed {dday} of a hypothetical drug in {n} divided doses. How much is each dose?', dday: 'A {W} child receives {Dd}, {n} times a day. What is the daily dose per kg?' }
    }
  ],
  examples: [
    {
      title: 'A weight-based oral dose',
      q: 'A child of 18 kg is prescribed a hypothetical medicine at 15 mg/kg per dose (maximum 1 g per dose). The suspension is 250 mg in 5 mL. What volume is given?',
      steps: [
        'Dose: $15 \\times 18 = 270$ mg — below the 1 g maximum.',
        'Concentration: $250/5 = 50$ mg/mL.',
        'Volume: $270/50 = 5.4$ mL, measured with an oral syringe.',
        'Reasonable? A few mL for a young child: yes. 54 mL or 0.54 mL would each signal a ten-fold slip.'
      ],
      a: '270 mg = 5.4 mL.'
    },
    {
      title: 'A surface-area dose',
      q: 'A patient 170 cm tall weighing 65 kg is prescribed a hypothetical medicine at 100 mg/m². The vial contains 20 mg/mL. Find the BSA, the dose and the volume.',
      steps: [
        '$\\text{BSA} = \\sqrt{170 \\times 65/3600} = \\sqrt{3.069} = 1.75$ m².',
        'Dose: $100 \\times 1.75 = 175$ mg.',
        'Volume: $175/20 = 8.75$ mL.'
      ],
      a: 'BSA 1.75 m², 175 mg, 8.75 mL.'
    },
    {
      title: 'Per day, not per dose',
      q: 'The order reads "30 mg/kg/day in 3 divided doses" for an 18 kg child. What is each dose, and what would the mistake of reading it as per dose give?',
      steps: [
        'Daily: $30 \\times 18 = 540$ mg; each of three doses: $540/3 = 180$ mg.',
        'Read as 30 mg/kg per dose: 540 mg at each dose — three times the intended amount, 1620 mg a day.'
      ],
      a: '180 mg per dose; the misreading gives 540 mg per dose.'
    }
  ],
  quiz: [
    { q: 'A 12 kg child is prescribed a hypothetical 20 mg/kg per dose. What is the dose in mg?', answer: 240, unit: 'mg', why: '20 × 12 = 240 mg.' },
    { q: 'An order for 250 micrograms of a hypothetical drug is prepared as 250 mg. How large is the error?', choices: ['2.5-fold', '10-fold', '100-fold', '1000-fold'], a: 3, why: '1 mg = 1000 µg, so 250 mg is 250 000 µg — a thousand times the dose. Writing "micrograms" in full prevents the misreading.' },
    { q: 'Why do small children often need more drug per kilogram than adults?', choices: ['they absorb less of every drug', 'their clearance grows with size more like surface area (about W^0.75) than like weight', 'their blood volume is larger than adults\'', 'they are more tolerant of side effects'], a: 1, why: 'Organ blood flow, filtration and metabolism scale roughly with W^0.75, so per kilogram a small child clears many drugs faster — though newborns, with immature organs, are the exception.' },
    { q: '"30 mg/kg/day in 3 divided doses" means 30 mg/kg at each dose.', a: false, why: 'It is 30 mg/kg over the whole day: 10 mg/kg per dose.' },
    { q: 'A calculated dose for a child comes out above the stated adult maximum. What should happen?', choices: ['give it: the weight justifies it', 'cap it at the maximum and double-check the calculation and the order with the prescriber', 'halve it', 'split it into two injections'], a: 1, why: 'A dose above the maximum is either a calculation error or needs an explicit, documented decision; stop and check.' }
  ],
  problems: [
    { q: 'A 25 kg child is prescribed a hypothetical 7.5 mg/kg; the liquid contains 125 mg in 5 mL. What volume is given?', answer: 7.5, unit: 'mL', tol: 0.02, steps: ['Dose: $7.5 \\times 25 = 187.5$ mg.', 'Concentration: 25 mg/mL.', '$187.5/25 = 7.5$ mL.'] },
    { q: 'A patient with a BSA of 1.9 m² is prescribed a hypothetical 75 mg/m². What is the dose?', answer: 142.5, unit: 'mg', tol: 0.02, steps: ['$75 \\times 1.9 = 142.5$ mg.'] }
  ],
  applications: ['Paediatric prescribing and dispensing, where nearly every dose is weight-based.', 'Cancer chemotherapy dosed per m², often with dose banding.', 'Checking prescriptions for per-day versus per-dose errors.', 'Choosing the weight to use in obesity (actual, ideal or adjusted).'],
  history: 'Young\'s rule for children\'s doses, age/(age + 12), is credited to the physician and physicist Thomas Young (1813); Clark\'s rule scaled by weight. Eugene and Delafield DuBois measured body surface with paper moulds and published their formula in 1916; Mosteller\'s simpler square-root version appeared in 1987 and is now the most used.',
  sim: ['calc-paeds', 'calc-tenfold']
},

{
  id: 'infusion-rates', parent: 'calc-topic', title: 'Infusion rates', level: 2,
  short: 'An infusion rate is a volume per time — mL/h on a pump, drops per minute on a gravity set. For drugs dosed as a rate (µg/kg/min, mg/h) the pump rate is the dose rate divided by the concentration in the bag. Most infusion errors are slips between per minute and per hour, or between mg and µg.',
  keywords: ['infusion rate', 'mL/h', 'drops per minute', 'drop factor', 'giving set', 'macrodrip', 'microdrip', 'µg/kg/min', 'pump rate', 'syringe driver', 'gravity infusion', 'roller clamp', 'infusion time', 'smart pump', 'drug library', 'rule of six', 'standard concentrations'],
  prereq: ['dose-calculations', 'dilution-concentration', 'parenteral-routes'],
  related: ['iv-infusion', 'meq-mmol', 'injectable-formulation', 'loading-dose', 'medication-errors', 'medicine:body-fluids'],
  body: `
An intravenous infusion delivers a drug or a fluid at a steady rate, which is exactly what makes it powerful: the dose keeps arriving until someone changes the rate. The arithmetic is short, but it mixes volumes, times and masses in several units at once — so it is where the classic errors live.

### Volume over time
$$R = \\frac{V}{t}$$
1000 mL over 8 hours runs at 125 mL/h. Infusion pumps are programmed in mL/h; syringe drivers too, or sometimes in mm/h of plunger travel on older devices, which is another reason to use one standard.

### Drops per minute
Without a pump, a gravity **giving set** turns the flow into countable drops. The drip chamber is built to make drops of a known size, the **drop factor**:

$$n\\,(\\text{drops/min}) = \\frac{V\\,(\\text{mL}) \\times f\\,(\\text{drops/mL})}{t\\,(\\text{min})}$$

| Set | Drops per mL | 1000 mL in 8 h | 1000 mL in 12 h | 100 mL in 30 min |
|---|---|---|---|---|
| Standard solution set (UK, Europe) | 20 | 42 drops/min | 28 drops/min | 67 drops/min |
| Blood set | 15 | 31 drops/min | 21 drops/min | 50 drops/min |
| Microdrip (burette) set | 60 | 125 drops/min | 83 drops/min | 200 drops/min |

Sets sold in some countries make 10, 15 or 20 drops/mL; the number is printed on the pack. With a 60 drops/mL microdrip set, drops per minute equal mL per hour. To set a gravity drip, count the drops for 15 seconds and multiply by four: 42 drops/min is about 10–11 drops in 15 s. Gravity rates drift as the bag empties, the patient moves, or the roller clamp creeps, so they are checked often — and potent drugs go through a pump.

### Dose-rate infusions
Many drugs are ordered as a dose rate — mg/h, µg/min or µg/kg/min. Convert the dose rate to mass per hour, then divide by the concentration:

$$R\\,(\\text{mL/h}) = \\frac{d\\,(\\text{µg/kg/min}) \\times W\\,(\\text{kg}) \\times 60}{1000 \\times C\\,(\\text{mg/mL})}$$

A hypothetical drug at 5 µg/kg/min for an 80 kg patient, from a bag of 400 mg in 250 mL (1.6 mg/mL): $5 \\times 80 \\times 60 = 24\\,000$ µg/h = 24 mg/h, and $24/1.6 = 15$ mL/h. **Check backwards**: 15 mL/h × 1.6 mg/mL = 24 mg/h = 400 µg/min = 5 µg/kg/min at 80 kg. The bag lasts $250/15 = 16.7$ h.

### Minutes, hours and thousands
The factors are 60 and 1000, and each slip is huge:
- forget the × 60 and the pump runs **60 times too slowly**; apply it twice and **60 times too fast**;
- mix mg and µg and the error is **1000-fold**;
- program mL/h with a number meant as mL/min (or the reverse): 60-fold again.

### Standard concentrations and smart pumps
Children's infusions were once made with the "rule of six" — 6 × weight (kg) mg of drug in 100 mL, so that 1 mL/h delivers 1 µg/kg/min. It saves arithmetic at the bedside but gives a different concentration for every child. Patient-safety bodies now recommend **standard concentrations** instead, and **smart pumps** with a drug library that warns or stops when a programmed rate lies outside set limits. None of this replaces an independent check of the drug, the concentration, the rate and the line.

> [!warn] The drugs and rates here are hypothetical. Real infusions are prepared and run from the product information and local protocols, programmed with pump safety limits and checked independently by a second qualified person. Try your own numbers in [the infusion calculator](#/tools/pharmcalc/infusion); how the blood level builds up during an infusion is on [[iv-infusion]].
`,
  ideas: [
    'Pump rate = volume ÷ time; pumps work in mL/h.',
    'Drops/min = mL × drop factor ÷ minutes; with a 60 drops/mL set drops/min = mL/h.',
    'Dose-rate infusions: mL/h = (dose rate as mass per hour) ÷ concentration; check by working backwards.',
    'The 60 between minutes and hours and the 1000 between mg and µg cause 60- and 1000-fold errors.',
    'Standard concentrations, smart pumps and an independent check make infusions safer.'
  ],
  pitfalls: [
    'Drops per minute equal mL per hour — Only with a 60 drops/mL microdrip set; with a standard 20 drops/mL set the drops per minute are a third of the mL/h.',
    'A gravity drip keeps its rate once set — It drifts with the height of the bag, the patient\'s position and a creeping clamp; it must be recounted, and potent drugs need a pump.',
    'mL/h = dose rate ÷ concentration, whatever the units — Only when both use the same mass and time units: turn µg/min into mg/h (× 60 ÷ 1000) first, or the answer is out by 60, 1000 or both.'
  ],
  formulas: [
    {
      name: 'Pump rate',
      expr: 'R = V/t', tex: 'R = \\dfrac{V}{t}',
      vars: {
        R: { name: 'rate', q: false, unit: 'mL/h' },
        V: { name: 'volume', q: false, unit: 'mL', value: 1000 },
        t: { name: 'duration', q: false, unit: 'h', value: 8 }
      },
      stories: {
        R: '{V} is to run over {t}. What pump rate is needed?',
        t: 'A bag of {V} runs at {R}. How long does it last?'
      }
    },
    {
      name: 'Drip rate of a gravity set',
      expr: 'n = V*f/t', tex: 'n = \\dfrac{V\\,f}{t}',
      vars: {
        n: { name: 'drip rate', q: false, unit: 'drops/min' },
        V: { name: 'volume', q: false, unit: 'mL', value: 1000 },
        f: { name: 'drop factor of the set', q: false, unit: 'drops/mL', value: 20 },
        t: { name: 'duration', q: false, unit: 'min', value: 480 }
      },
      note: 'Time in minutes. Count drops for 15 s and multiply by 4.',
      practice: { unknowns: ['n', 't'] },
      stories: {
        n: '{V} is to run over {t} through a {f} set. How many drops per minute?',
        t: 'A {f} set drips at {n}. How long will {V} take?'
      }
    },
    {
      name: 'Pump rate for a weight-based dose rate',
      expr: 'R = d*W*60/(1000*C)', tex: 'R = \\dfrac{d \\times W \\times 60}{1000\\,C}',
      vars: {
        R: { name: 'pump rate', q: false, unit: 'mL/h' },
        d: { name: 'dose rate', q: false, unit: 'µg/kg/min', value: 5 },
        W: { name: 'body weight', q: false, unit: 'kg', value: 80 },
        C: { name: 'concentration in the bag', q: false, unit: 'mg/mL', value: 1.6 }
      },
      note: '× 60 turns minutes into hours; ÷ 1000 turns µg into mg. Hypothetical drug and numbers.',
      practice: { unknowns: ['R', 'd'] },
      stories: {
        R: 'A hypothetical drug is to run at {d} for a patient of {W}; the bag holds {C}. What is the pump rate?',
        d: 'A pump runs at {R} with {C} for a patient of {W}. What dose rate is the patient receiving?'
      }
    },
    {
      name: 'Drug delivered per hour',
      expr: 'Dh = R*C', tex: 'D_h = R \\times C',
      vars: {
        Dh: { name: 'drug per hour', q: false, unit: 'mg/h', tex: 'D_h' },
        R: { name: 'pump rate', q: false, unit: 'mL/h', value: 15 },
        C: { name: 'concentration', q: false, unit: 'mg/mL', value: 1.6 }
      },
      note: 'The backward check of every infusion calculation.',
      stories: { Dh: 'A pump runs at {R} with a solution of {C}. How much drug is given per hour?', R: 'What pump rate gives {Dh} from a solution of {C}?' }
    }
  ],
  examples: [
    {
      title: 'A litre over eight hours',
      q: '1000 mL of an infusion fluid is to run over 8 h through a 20 drops/mL set. Find the rate in mL/h and in drops/min, and the count to expect in 15 s.',
      steps: [
        '$R = 1000/8 = 125$ mL/h.',
        '$n = 1000 \\times 20/480 = 41.7$ drops/min.',
        'In 15 s: $41.7/4 = 10.4$ — about 10 to 11 drops.'
      ],
      a: '125 mL/h, about 42 drops/min (10–11 drops in 15 s).'
    },
    {
      title: 'A weight-based infusion',
      q: 'A hypothetical drug is prescribed at 5 µg/kg/min for an 80 kg patient. The bag contains 400 mg in 250 mL. What is the pump rate, and how long will the bag last?',
      steps: [
        'Concentration: $400/250 = 1.6$ mg/mL.',
        'Dose per hour: $5 \\times 80 \\times 60 = 24\\,000$ µg/h = 24 mg/h.',
        'Rate: $24/1.6 = 15$ mL/h.',
        'Check backwards: $15 \\times 1.6 = 24$ mg/h = 400 µg/min = 5 µg/kg/min. The bag lasts $250/15 = 16.7$ h.'
      ],
      a: '15 mL/h; the bag lasts about 16.7 h.'
    },
    {
      title: 'Where the 60 goes',
      q: 'In the last example, what rate would be set by forgetting the × 60 — and what by applying it twice?',
      steps: [
        'Without the × 60 the calculation is done as if the order were per hour: $5 \\times 80/1600 = 0.25$ mL/h — sixty times too slow.',
        'Correct: 15 mL/h.',
        'Applying the × 60 twice (for example, converting a rate that was already per hour): $15 \\times 60 = 900$ mL/h — sixty times too fast.',
        'A backward check in the units of the order (µg/kg/min) catches both.'
      ],
      a: '0.25 mL/h (too slow) or 900 mL/h (too fast) instead of 15 mL/h.'
    }
  ],
  quiz: [
    { q: '500 mL is to run over 4 hours. What is the pump rate in mL/h?', answer: 125, unit: 'mL/h', why: '500/4 = 125 mL/h.' },
    { q: '100 mL over 30 minutes through a 20 drops/mL set: how many drops per minute?', answer: 66.7, unit: 'drops/min', why: '100 × 20/30 = 66.7 drops/min.' },
    { q: 'With a 60 drops/mL microdrip set, the drops per minute equal the mL per hour.', a: true, why: 'n = R (mL/h) × 60 drops/mL ÷ 60 min/h = R.' },
    { q: 'A pump runs at 12 mL/h with a 2 mg/mL solution. How many mg are given per hour?', answer: 24, unit: 'mg', why: '12 mL/h × 2 mg/mL = 24 mg/h.' },
    { q: 'Which slip produces a 60-fold error?', choices: ['mg written for µg', 'a rate per minute used as a rate per hour', 'a trailing zero', 'a daily dose given as a single dose, three times a day'], a: 1, why: 'There are 60 minutes in an hour. mg for µg is 1000-fold, a trailing zero ten-fold, per day as per dose the number of doses a day.' }
  ],
  problems: [
    { q: 'A hypothetical drug at 3 µg/kg/min for a 60 kg patient, from a syringe of 200 mg in 50 mL. What is the pump rate?', answer: 2.7, unit: 'mL/h', tol: 0.02, steps: ['Concentration: 4 mg/mL.', 'Dose per hour: $3 \\times 60 \\times 60 = 10\\,800$ µg/h = 10.8 mg/h.', 'Rate: $10.8/4 = 2.7$ mL/h.'] },
    { q: 'A 20 drops/mL set drips at 42 drops/min. How many hours will 1000 mL take?', answer: 7.94, unit: 'h', tol: 0.02, steps: ['42/20 = 2.1 mL/min.', '1000/2.1 = 476 min = 7.94 h.'] }
  ],
  applications: ['Setting maintenance fluids and short antibiotic infusions.', 'Programming continuous infusions of potent drugs in critical care and anaesthesia.', 'Checking syringe-driver rates for subcutaneous infusions in palliative care.', 'Building smart-pump drug libraries with standard concentrations and dose limits.'],
  history: 'For most of the twentieth century intravenous fluids ran by gravity, set by counting drops against a watch. Volumetric pumps spread from the 1970s and 1980s, and "smart" pumps carrying drug libraries with dose-error limits appeared around the turn of the century, after studies showed how often infusion programming went wrong.',
  sim: 'calc-drip'
},

{
  id: 'compounding', parent: 'calc-topic', title: 'Compounding and scaling formulas', level: 2,
  short: 'Compounding prepares a medicine for one patient when no licensed product fits. Its arithmetic: scaling a master formula to the quantity needed, formulas in parts and "to 100", allowances for losses, displacement values for suppositories and powder volume when a vial is reconstituted.',
  keywords: ['compounding', 'extemporaneous preparation', 'master formula', 'scaling', 'enlarging and reducing formulas', 'parts', 'q.s.', 'overage', 'displacement value', 'dosage replacement factor', 'suppositories', 'reconstitution', 'powder volume', 'displacement volume', 'liquid from tablets', 'beyond-use date'],
  prereq: ['percent-strength', 'alligation', 'dilution-concentration'],
  related: ['suppositories', 'ointments-creams', 'suspensions', 'oral-solutions', 'gmp', 'printing-medicines', 'paediatric-geriatric'],
  body: `
Licensed medicines come first: they are made at scale, tested batch by batch and backed by stability data. But sometimes nothing licensed fits — a child who needs a liquid of a drug that exists only as tablets, a patient allergic to an excipient, a strength that is not made. Then a pharmacist **compounds** (prepares extemporaneously) a medicine for that one patient, from a verified **master formula**, with documented weighings, a second check and a beyond-use date. The standards are set nationally — in the United States by USP chapters <795> (non-sterile) and <797> (sterile), revised versions of which took effect in 2023 — and the arithmetic below is the everyday part of it.

### Scaling a formula
A formula is written for a convenient quantity — often 100 g or 100 mL. To make a different amount, multiply every ingredient by the same **factor**:

$$q = f \\times \\frac{T}{F}$$

A hypothetical cream: drug 1 g, emulsifying wax 9 g, white soft paraffin 15 g, liquid paraffin 6 g, preservative 1 g, purified water **to** 100 g. For 30 g the factor is 30/100 = 0.3: drug 0.3 g, wax 2.7 g, soft paraffin 4.5 g, liquid paraffin 1.8 g, preservative 0.3 g, water to 30 g. "To 30 g" (or *q.s.*, *quantum sufficit*) means the last ingredient makes up the total — it is weighed or measured to the final quantity, not calculated.

**Formulas in parts**: "drug 1 part, base 19 parts" is 20 parts in all. For 60 g, one part is 3 g: 3 g of drug and 57 g of base. Parts formulas are ratios, so they scale to any quantity.

### Allowing for losses
Some material always stays behind — on the tile, in the mortar, in the mould. Formulas therefore make a small excess (an **overage**): for suppositories, typically a couple more than needed; for a small tube of cream, a few grams more. The excess is part of the plan, not a correction afterwards.

### Displacement values: suppositories
A suppository mould is calibrated with the base alone: each cavity holds, say, 2.0 g of hard fat. A drug takes up space that base would otherwise fill, and it is usually denser. Its **displacement value** $DV$ (the British definition) is the number of grams of drug that displace 1 g of base. So a drug load of $m$ g per suppository displaces $m/DV$ g of base, and for $N$ suppositories

$$B = N\\left(E - \\frac{m}{DV}\\right)$$

Twelve 2 g suppositories each containing 250 mg of a drug with $DV = 1.5$: $B = 12 \\times (2 - 0.25/1.5) = 22.0$ g of base and 3.0 g of drug. Making 14 to allow for losses: 25.7 g of base and 3.5 g of drug. (Some texts use the inverse, a *dosage replacement factor* — grams of base replaced by 1 g of drug. Check which one a table gives.)

### Powder volume: reconstituting a vial
A dry powder dissolves into volume. If a vial holds 1 g of drug whose powder volume is 0.5 mL, adding 4.5 mL of water gives 5.0 mL of 200 mg/mL. Add 5 mL instead and you get 5.5 mL of 182 mg/mL: every "1 mL = 200 mg" dose is 9 % short. The product information states the volume to add and the concentration it gives.

$$C = \\frac{D}{V_d + V_p}$$

### A liquid from tablets
When a liquid is made from tablets, $C = n\\,s/V$: ten 50 mg tablets in 100 mL give 5 mg/mL. The strength is the easy part. The drug must be evenly suspended (a suspending agent; "shake well"), stable in water, and given a beyond-use date **from stability data**, not from guesswork ([[suspensions]], [[shelf-life]]).

> [!warn] The formulas here are hypothetical teaching examples. Compounding follows a verified master formula, the relevant pharmacopoeial and national standards, and local procedures, with every weighing and calculation checked independently. Do not prepare medicines at home.
`,
  ideas: [
    'Scale a formula by one factor for every ingredient: quantity wanted ÷ formula quantity.',
    '"To 100 g" or q.s.: the last ingredient makes up the total and is not calculated.',
    'Parts formulas are ratios: divide the quantity by the total number of parts.',
    'Suppositories: base = N × (mould capacity − drug per suppository ÷ displacement value).',
    'Reconstitution: the powder adds volume, so the concentration is dose ÷ (diluent + powder volume).'
  ],
  pitfalls: [
    'Scaling changes only the drug — Every ingredient scales by the same factor, and "to 100 g" becomes "to the new total".',
    'The drug simply replaces its own weight of base — It replaces its weight divided by the displacement value; a dense drug (DV above 1) displaces less than its own weight of base.',
    'Adding the labelled volume of diluent to a powder gives that volume of solution — The powder occupies volume too; the product information gives the diluent to add for a stated final concentration.'
  ],
  formulas: [
    {
      name: 'Scaling a formula',
      expr: 'q = f*T/F', tex: 'q = f \\times \\dfrac{T}{F}',
      vars: {
        q: { name: 'quantity of the ingredient needed', q: false, unit: 'g' },
        f: { name: 'quantity in the formula', q: false, unit: 'g', value: 9 },
        T: { name: 'total quantity to make', q: false, unit: 'g', value: 30 },
        F: { name: 'total quantity of the formula', q: false, unit: 'g', value: 100 }
      },
      note: 'The same factor T/F for every ingredient; the "to" ingredient makes up the rest.',
      practice: { unknowns: ['q', 'T'] },
      stories: {
        q: 'A formula for {F} contains {f} of emulsifying wax. How much wax is needed to make {T}?',
        T: 'You have {q} of an ingredient that the {F} formula uses at {f}. How much product can you make?'
      }
    },
    {
      name: 'Suppository base with a displacement value',
      expr: 'B = N*(E - m/DV)', tex: 'B = N\\left(E - \\dfrac{m}{\\text{DV}}\\right)',
      vars: {
        B: { name: 'base needed', q: false, unit: 'g' },
        N: { name: 'number of suppositories', q: false, unit: '', value: 12, int: true },
        E: { name: 'mould capacity with base alone', q: false, unit: 'g', value: 2 },
        m: { name: 'drug in each suppository', q: false, unit: 'g', value: 0.25 },
        DV: { name: 'displacement value (g of drug displacing 1 g of base)', q: false, unit: '', value: 1.5, tex: '\\text{DV}' }
      },
      note: 'British definition of the displacement value. Make one or two extra to allow for losses.',
      practice: { unknowns: ['B', 'DV'] },
      stories: {
        B: 'How much base is needed for {N} suppositories, from a mould holding {E} of base, each containing {m} of a drug with displacement value {DV}?',
        DV: '{N} suppositories of {m} drug each needed {B} of base in a {E} mould. What is the drug\'s displacement value?'
      }
    },
    {
      name: 'Concentration after reconstitution',
      expr: 'C = D/(Vd + Vp)', tex: 'C = \\dfrac{D}{V_d + V_p}',
      vars: {
        C: { name: 'concentration', q: false, unit: 'mg/mL' },
        D: { name: 'drug in the vial', q: false, unit: 'mg', value: 1000 },
        Vd: { name: 'diluent added', q: false, unit: 'mL', value: 4.5, tex: 'V_d' },
        Vp: { name: 'powder (displacement) volume', q: false, unit: 'mL', value: 0.5, tex: 'V_p' }
      },
      note: 'Hypothetical vial. The product information states the diluent volume for each concentration.',
      stories: {
        C: 'A vial of {D} powder, whose displacement volume is {Vp}, is reconstituted with {Vd}. What is the concentration?',
        Vd: 'How much diluent must be added to a vial of {D} (powder volume {Vp}) to give {C}?'
      }
    },
    {
      name: 'A liquid from tablets',
      expr: 'C = n*s/V', tex: 'C = \\dfrac{n\\,s}{V}',
      vars: {
        C: { name: 'concentration', q: false, unit: 'mg/mL' },
        n: { name: 'number of tablets', q: false, unit: '', value: 10, int: true },
        s: { name: 'strength of each tablet', q: false, unit: 'mg', value: 50 },
        V: { name: 'final volume', q: false, unit: 'mL', value: 100 }
      },
      note: 'The arithmetic only: uniformity, stability and the beyond-use date need data.',
      stories: { C: '{n} tablets of {s} are made into {V} of suspension. What is its concentration?', n: 'How many {s} tablets make {V} of a {C} suspension?' }
    }
  ],
  examples: [
    {
      title: 'Reducing a cream formula',
      q: 'A hypothetical master formula for 100 g of cream: drug 1 g, emulsifying wax 9 g, white soft paraffin 15 g, liquid paraffin 6 g, preservative 1 g, purified water to 100 g. What goes into 30 g?',
      steps: [
        'Factor $30/100 = 0.3$.',
        'Drug 0.3 g, wax 2.7 g, soft paraffin 4.5 g, liquid paraffin 1.8 g, preservative 0.3 g.',
        'These add up to 9.6 g; purified water to 30 g (about 20.4 g).',
        'Check the strength: 0.3 g in 30 g = 1 % w/w, as in the master formula.'
      ],
      a: '0.3 / 2.7 / 4.5 / 1.8 / 0.3 g, water to 30 g.'
    },
    {
      title: 'Suppositories with a displacement value',
      q: 'Twelve suppositories are needed, each with 250 mg of a hypothetical drug (displacement value 1.5), in a mould holding 2.0 g of base per cavity. Allowing two extra for losses, how much drug and base are weighed?',
      steps: [
        'Make 14.',
        'Drug: $14 \\times 0.25 = 3.5$ g.',
        'Base displaced by each dose: $0.25/1.5 = 0.167$ g.',
        'Base: $14 \\times (2.0 - 0.167) = 25.7$ g.'
      ],
      a: '3.5 g of drug and 25.7 g of base.'
    },
    {
      title: 'Powder volume in a vial',
      q: 'A hypothetical vial holds 1 g of drug with a powder volume of 0.5 mL. What volume of diluent gives 200 mg/mL, and what concentration results if 5 mL is added by mistake?',
      steps: [
        'Final volume for 200 mg/mL: $1000/200 = 5.0$ mL, so add $5.0 - 0.5 = 4.5$ mL.',
        'Adding 5 mL gives 5.5 mL: $1000/5.5 = 182$ mg/mL.',
        'A dose drawn as "1 mL = 200 mg" would contain 182 mg — 9 % short.'
      ],
      a: 'Add 4.5 mL; with 5 mL the concentration is 182 mg/mL.'
    }
  ],
  quiz: [
    { q: 'A formula for 500 mL is to be made as 150 mL. What is the scaling factor?', answer: 0.3, why: '150/500 = 0.3; every ingredient is multiplied by 0.3.' },
    { q: 'A formula reads "drug 1 part, base 24 parts". How many grams of drug are in 50 g?', answer: 2, unit: 'g', why: '25 parts in all; one part is 50/25 = 2 g.' },
    { q: 'A displacement value of 2 (British definition) means…', choices: ['2 g of drug displaces 1 g of base', '1 g of drug displaces 2 g of base', 'the drug is twice as dense as water', 'two suppositories are made per gram of drug'], a: 0, why: 'DV is the grams of drug that take the place of 1 g of base; with DV = 2, 1 g of drug displaces only 0.5 g of base.' },
    { q: 'Adding 5 mL of diluent to a vial of powder always gives 5 mL of solution.', a: false, why: 'The dissolved powder adds its own displacement volume, so the solution is larger and weaker than a naive calculation suggests.' },
    { q: 'Why are one or two extra suppositories usually made?', choices: ['material is lost in the container and the mould', 'the drug degrades during melting', 'pharmacopoeias require a spare', 'the patient may need a higher dose'], a: 0, why: 'Some of the melt always stays behind, so a small, planned excess makes sure every suppository is full.' }
  ],
  problems: [
    { q: 'How much base is needed for 20 suppositories in a 2 g mould, each with 300 mg of a drug of displacement value 1.5?', answer: 36, unit: 'g', tol: 0.02, steps: ['Base displaced per suppository: $0.3/1.5 = 0.2$ g.', '$20 \\times (2 - 0.2) = 36$ g.'] },
    { q: 'A formula "drug 2 g, emulsifying wax 10 g, base to 100 g" is scaled to 250 g. How much wax?', answer: 25, unit: 'g', tol: 0.02, steps: ['Factor 2.5; wax $10 \\times 2.5 = 25$ g (drug 5 g, base to 250 g).'] }
  ],
  applications: ['Paediatric liquids made from tablets when no licensed liquid exists.', 'Creams and ointments of non-standard strength or without a particular excipient.', 'Suppositories for patients who cannot swallow.', 'Reconstituting antibiotic and other powders for injection and oral use.'],
  history: 'Until the twentieth century nearly every medicine was compounded by an apothecary from a formula; the first United States Pharmacopeia (1820) was essentially a book of such formulas. Industrial manufacture took over most of that work, but compounding persists for patients no licensed product fits, now under written standards, documented checks and beyond-use dates based on stability data.'
}

);
