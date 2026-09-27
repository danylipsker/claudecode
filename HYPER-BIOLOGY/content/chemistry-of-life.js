/* HYPER-BIOLOGY · content/chemistry-of-life.js
 * Branch "The Chemistry of Life": the molecules of life (water, pH and buffers, carbohydrates, lipids,
 * amino acids, protein structure, nucleic acids) and enzymes and energy (how enzymes work, inhibition,
 * regulation, ATP and free energy). Enzyme kinetics itself is in content/reference.js.
 * Simulations: sims/chemistry-of-life.js (ids chem-…). */
Hyper.add(

/* ================================================================ WATER */
{
  id: 'water-in-life', parent: 'biomolecules', title: 'Water and life', level: 1,
  short: 'Water is small, bent and polar, so its molecules cling together by hydrogen bonds. That one fact explains why bodies and oceans resist temperature change, why sweat cools, why sap can rise, why ice floats, and why oily molecules clump together to build membranes and fold proteins.',
  keywords: ['water', 'hydrogen bond', 'polarity', 'specific heat', 'heat of vaporisation', 'cohesion', 'adhesion', 'surface tension', 'capillarity', 'ice', 'density anomaly', 'solvent', 'hydration shell', 'hydrophobic effect', 'hydrophilic'],
  prereq: ['chemistry:hydrogen-bonding', 'chemistry:bond-polarity', 'physics:specific-heat'],
  related: ['ph-in-biology', 'lipids', 'protein-structure', 'transpiration', 'diffusion-osmosis', 'thermoregulation-animals', 'physics:latent-heat', 'physics:surface-tension', 'chemistry:intermolecular-forces', 'medicine:body-fluids'],
  body: `
Life began in water, and every cell is still mostly water: about 70 % of a cell's mass and some 60 % of an adult human — around 42 litres in a 70 kg person. Water is not just the background in which biochemistry happens. Its unusual properties hold temperatures steady, carry heat away as sweat, pull sap to the tops of trees, let ice float as an insulating lid on lakes and — above all — push oily molecules together, which is what folds proteins and builds membranes.

### A small, bent, polar molecule
In $\\ce{H2O}$ the oxygen pulls the shared electrons towards itself, and the molecule is bent at 104.5°. The oxygen end carries a partial negative charge and the two hydrogens partial positive ones. The hydrogen of one molecule is attracted to a lone pair on the oxygen of a neighbour: a **hydrogen bond** of about 20 kJ/mol — twenty times weaker than the covalent O–H bond (about 460 kJ/mol), but far stronger than the attraction between non-polar molecules. Each molecule can donate two hydrogen bonds and accept two, so water is a three-dimensional network. In the liquid the network never stands still: a given hydrogen bond lasts only a few picoseconds ($10^{-12}$ s).

### Properties that matter for life
| Property | Water | What it does for living things |
|---|---|---|
| Boiling point | 100 °C (heavier $\\ce{H2S}$: −60 °C) | liquid over the whole range of temperatures life uses |
| Specific heat | 4.18 J/(g·K) | bodies, lakes and oceans change temperature slowly |
| Heat of vaporisation | 2.41 kJ/g at 37 °C | sweating, panting and transpiration cool very effectively |
| Surface tension | 72 mN/m at 25 °C | cohesion: water columns in xylem, insects walking on ponds |
| Density of ice | 0.917 g/cm³ (liquid: 1.000 at 4 °C) | ice floats; lakes freeze from the top down |
| Dielectric constant | about 80 | dissolves salts and polar molecules |

### Heat: why a body is a good thermostat
Warming water means loosening hydrogen bonds as well as speeding molecules up, so it takes 4.18 J to warm one gram by one degree — five times more than rock and nine times more than iron. A 70 kg person producing 100 W with no way to lose it would warm by only about 1.5 °C in an hour. Evaporation is more powerful still: every gram of sweat that evaporates takes 2.4 kJ with it (see [[thermoregulation-animals]]). The same numbers make coastal climates mild and let the oceans absorb most of the heat of global warming.

### Cohesion, adhesion and the rise of sap
Hydrogen bonds hold water molecules to each other (**cohesion**) and to polar surfaces such as cellulose (**adhesion**). Together they give capillary rise — but in a vessel 40 µm wide only about 0.7 m. Trees over 100 m tall lift water another way: evaporation from the leaves pulls on unbroken columns of water, and cohesion lets those columns sustain tensions of several megapascals without snapping (see [[transpiration]]).

### Ice floats
In ice every molecule is locked into four hydrogen bonds pointing to the corners of a tetrahedron. That open lattice takes about 9 % more room than the liquid, in which the network has partly collapsed. Liquid water is densest at 4 °C, so in winter the coldest water rises, freezes at the surface, and the ice insulates the water below: lakes rarely freeze solid and fish survive the winter underneath.

### The solvent — and the hydrophobic effect
Water wraps ions and polar molecules in **hydration shells**, and its high dielectric constant weakens the attraction between opposite charges about eighty-fold, so salts, sugars and amino acids dissolve. Non-polar molecules cannot hydrogen-bond; the water next to them must arrange itself into ordered cages, which costs entropy. When non-polar molecules cluster, that water is released and the entropy of the whole system rises. This **hydrophobic effect** is not an attraction between oily molecules but a push from the water around them, and it drives the folding of proteins ([[protein-structure]]) and the self-assembly of membranes ([[lipids]]).

> [!key] One molecular fact — a small, bent molecule with two hydrogens to donate and two lone pairs to accept — explains water's high boiling point and heat capacity, its cohesion, the floating of ice, its power as a solvent and the hydrophobic effect.
`,
  ideas: [
    'Water is polar and bent; each molecule can make up to four hydrogen bonds, forming a network that rearranges every few picoseconds.',
    'A high specific heat (4.18 J/(g·K)) and heat of vaporisation (2.4 kJ/g) make water a thermal buffer and sweat an effective coolant.',
    'Cohesion and adhesion give surface tension and capillarity; cohesion lets xylem sap be pulled up under tension.',
    'Ice is an open hydrogen-bonded lattice, 9 % less dense than liquid water, so it floats and insulates the water below.',
    'Water dissolves polar and charged molecules and pushes non-polar ones together: the hydrophobic effect builds membranes and folds proteins.'
  ],
  pitfalls: [
    'Hydrogen bonds are the bonds to hydrogen inside the water molecule — Those O–H bonds are covalent and some twenty times stronger. A hydrogen bond is the attraction between a hydrogen of one molecule and a lone pair on another.',
    'Ice is colder, so it must be denser than water — Most solids are denser than their liquids, but ice is held open by its tetrahedral hydrogen bonds; melting partly collapses the lattice, so the liquid is about 9 % denser.',
    'Oil and water separate because oil molecules attract each other strongly — The main driving force is the entropy of the water: clustering frees ordered water molecules from the oil surfaces.'
  ],
  formulas: [
    {
      name: 'Heat needed to warm water',
      expr: 'Q = m*c*dT', tex: 'Q = m\\,c\\,\\Delta T',
      vars: {
        Q: { name: 'heat absorbed', q: 'energy', unit: 'kJ' },
        m: { name: 'mass of water', q: 'mass', unit: 'kg', value: 1 },
        c: { name: 'specific heat', q: 'specificheat', unit: 'kJ/(kg·K)', value: 4.18 },
        dT: { name: 'temperature rise', q: 'dtemp', unit: '°C', value: 10, tex: '\\Delta T' }
      },
      note: 'Water 4.18 kJ/(kg·K); the human body about 3.5; rock about 0.8; iron 0.45.',
      practice: { unknowns: ['Q', 'dT', 'm'] },
      stories: {
        Q: 'How much heat does it take to warm {m} of water by {dT}? (specific heat {c})',
        dT: 'A body with a specific heat of {c} and a mass of {m} absorbs {Q} and cannot lose it. How much does it warm?'
      }
    },
    {
      name: 'Sweat needed to shed heat',
      expr: 'm = P*t/L', tex: 'm = \\dfrac{P\\,t}{L}',
      vars: {
        m: { name: 'mass of sweat evaporated', q: 'mass', unit: 'kg' },
        P: { name: 'heat to be removed (power)', q: 'power', unit: 'W', value: 800 },
        t: { name: 'time', q: 'time', unit: 'h', value: 1 },
        L: { name: 'heat of vaporisation of water', q: 'latent', unit: 'kJ/kg', value: 2410 }
      },
      note: 'Only sweat that evaporates cools; sweat that drips off takes almost no heat with it. L is 2410 kJ/kg at 37 °C and 2257 kJ/kg at 100 °C.',
      stories: {
        m: 'A runner must lose {P} of extra heat for {t}. How much sweat has to evaporate?',
        P: 'A cyclist evaporates {m} of sweat in {t}. How much heating power does that remove?'
      }
    },
    {
      name: 'Capillary rise (Jurin\'s law)',
      expr: 'h = 2*gam*cos(theta)/(rho*g*r)', tex: 'h = \\dfrac{2\\gamma\\cos\\theta}{\\rho_w\\,g\\,r}',
      vars: {
        h: { name: 'height of rise', q: 'length', unit: 'm' },
        gam: { name: 'surface tension', q: 'surfacetension', unit: 'mN/m', value: 72.8, tex: '\\gamma' },
        theta: { name: 'contact angle', q: 'angle', unit: '°', value: 20, min: 0, max: 89, tex: '\\theta' },
        rho: { const: 'rhoW' },
        g: { const: 'g' },
        r: { name: 'radius of the tube', q: 'length', unit: 'µm', value: 20 }
      },
      note: 'Surface tension of water: 72.8 mN/m at 20 °C. A wettable wall (small contact angle) lifts water highest.',
      practice: { unknowns: ['h', 'r'] },
      stories: {
        h: 'A xylem vessel has a radius of {r}; the contact angle is {theta}. How high can capillarity alone lift the water?',
        r: 'What tube radius would lift water by {h} by capillarity alone (contact angle {theta})?'
      }
    }
  ],
  examples: [
    {
      title: 'Sweating off a run',
      q: 'A runner produces 800 W more heat than at rest. How much sweat must evaporate during a one-hour run to carry that heat away? (Heat of vaporisation at skin temperature 2.41 kJ/g.)',
      steps: [
        'Heat to remove: $Q = 800\\ \\mathrm{W} \\times 3600\\ \\mathrm{s} = 2.88\\ \\mathrm{MJ}$.',
        'Mass evaporated: $m = Q/L = 2.88\\times10^{6}/2.41\\times10^{6}\\ \\mathrm{J/kg} = 1.19$ kg.',
        'In practice some sweat drips off without evaporating, so a runner loses more water than this — on a hot day well over a litre an hour.'
      ],
      a: 'About 1.2 kg (1.2 L) of sweat must evaporate.'
    },
    {
      title: 'A body made of water',
      q: 'A resting 70 kg person produces about 100 W of heat. If none of it could escape, how much would the body warm in one hour (specific heat of the body 3.5 kJ/(kg·K))? What if the body had the specific heat of iron, 0.45 kJ/(kg·K)?',
      steps: [
        'Heat in an hour: $100 \\times 3600 = 360$ kJ.',
        '$\\Delta T = Q/(mc) = 360/(70 \\times 3.5) = 1.5$ °C.',
        'With iron\'s specific heat: $360/(70 \\times 0.45) = 11$ °C — enough to kill within the hour.'
      ],
      a: 'About 1.5 °C; with iron\'s specific heat it would be 11 °C.'
    },
    {
      title: 'How far can capillarity lift sap?',
      q: 'A xylem vessel has a radius of 20 µm. How high will water rise in it by capillarity, with a surface tension of 0.0728 N/m and a contact angle of 20°?',
      steps: [
        { text: 'Jurin\'s law:', tex: 'h = \\frac{2\\gamma\\cos\\theta}{\\rho g r} = \\frac{2 \\times 0.0728 \\times 0.940}{1000 \\times 9.81 \\times 20\\times10^{-6}}' },
        '$h = 0.137/0.196 = 0.70$ m.',
        'A 100 m redwood cannot rely on capillarity: its leaves pull the water up under tension, and cohesion keeps the columns from breaking.'
      ],
      a: 'About 0.7 m — far short of the height of a tree.'
    }
  ],
  quiz: [
    { q: 'Why does ice float on liquid water?', choices: ['Ice contains trapped air bubbles', 'Hydrogen bonds hold the molecules of ice in an open lattice that takes more room than the liquid', 'Cold water is always less dense than warm water', 'Molecules of ice are lighter than molecules of liquid water'], a: 1, why: 'The tetrahedral hydrogen-bonded lattice of ice is open; in the liquid it partly collapses and the molecules pack about 9 % more closely. The molecules themselves are identical, and below 4 °C colder water is actually less dense, not more.' },
    { q: 'Which property of water makes the evaporation of sweat such an effective way to cool down?', choices: ['Its high specific heat', 'Its high heat of vaporisation', 'Its surface tension', 'Its density'], a: 1, why: 'Each gram that evaporates removes about 2.4 kJ, because hydrogen bonds must be broken for a molecule to escape into the air. Specific heat is about warming, not evaporating.' },
    { q: 'Oil and water separate mainly because oil molecules attract one another much more strongly than they attract water.', a: false, why: 'The attraction between non-polar molecules is weak. The main force is the hydrophobic effect: water forms ordered cages around oil, and clustering the oil frees that water and raises the entropy.' },
    { q: 'How much heat, in kJ, warms 2.0 kg of water by 5.0 °C?', answer: 41.8, unit: 'kJ', why: '$Q = mc\\Delta T = 2.0 \\times 4.18 \\times 5.0 = 41.8$ kJ.' },
    { q: 'A single hydrogen bond in liquid water lasts about…', choices: ['a few picoseconds', 'a few milliseconds', 'a few seconds', 'as long as the water stays liquid'], a: 0, why: 'The network is constantly breaking and re-forming, on a timescale of about $10^{-12}$ s. Averaged over time each molecule is still bonded to three or four neighbours.' }
  ],
  problems: [
    { q: 'A leaf transpires 2.0 g of water in an hour at 25 °C (heat of vaporisation 2.44 kJ/g). What cooling power does that give, in watts?', answer: 1.36, unit: 'W', tol: 0.02, steps: ['Heat removed: $2.0 \\times 2440 = 4880$ J.', 'Power: $4880/3600 = 1.36$ W.'] },
    { q: 'What tube radius would lift water 10 m by capillarity alone, with surface tension 0.0728 N/m and a contact angle of 0°?', answer: 1.48, unit: 'µm', tol: 0.02, steps: ['$r = 2\\gamma/(\\rho g h) = 2 \\times 0.0728/(1000 \\times 9.81 \\times 10)$.', '$r = 1.48\\times10^{-6}$ m = 1.48 µm — narrower than most xylem conduits, which is one reason capillarity cannot explain tall trees.'] }
  ],
  applications: ['Sweating, panting and transpiration: evaporative cooling in animals and plants.', 'Climate: the heat capacity of the oceans moderates coastal temperatures and absorbs most of the extra heat of global warming.', 'Antifreeze proteins in polar fish and insects bind to ice crystals and stop them growing.', 'Cryopreservation of cells and embryos, where ice crystals must be prevented from forming.'],
  history: 'Wendell Latimer and Worth Rodebush proposed the hydrogen bond in 1920, and Linus Pauling made it central to chemistry in the 1930s. In 1933 J. D. Bernal and R. H. Fowler described liquid water as a disordered tetrahedral network. Twenty years earlier, in 1913, the physiologist Lawrence Henderson had argued in *The Fitness of the Environment* that water\'s odd properties are exactly what life needs.',
  sim: 'chem-water'
},

/* ================================================================ pH */
{
  id: 'ph-in-biology', parent: 'biomolecules', title: 'pH and buffers in living things', level: 2,
  short: 'The charges on proteins, enzymes and membranes depend on pH, so living things hold it steady with buffers. Blood stays between pH 7.35 and 7.45 thanks to the bicarbonate buffer, whose carbon dioxide the lungs can breathe away.',
  keywords: ['pH', 'buffer', 'Henderson–Hasselbalch', 'pKa', 'bicarbonate', 'carbonic acid', 'carbon dioxide', 'carbonic anhydrase', 'phosphate buffer', 'histidine', 'acidosis', 'alkalosis', 'blood pH', 'buffer capacity', 'lysosome'],
  prereq: ['chemistry:ph-scale', 'chemistry:buffers', 'water-in-life'],
  related: ['chemistry:henderson-hasselbalch', 'chemistry:weak-acids', 'medicine:acid-base-balance', 'medicine:gas-exchange', 'amino-acids', 'enzymes', 'oxidative-phosphorylation'],
  body: `
Nearly every biological molecule has groups that can gain or lose a proton — carboxyl and amino groups, the side chains of histidine and cysteine, phosphates. Whether they are charged decides how a protein folds, whether an active site works, and whether a drug crosses a membrane. So living things control the concentration of hydrogen ions tightly, and they do it with **buffers**.

### The pH scale in the body
pH is minus the base-10 logarithm of the hydrogen-ion concentration in mol/L. Each unit is a factor of ten. Blood at pH 7.40 holds 40 nmol/L of $\\ce{H+}$ — three and a half million times less than its sodium (140 mmol/L) — and a fall to pH 7.10 doubles it (see [[chemistry:ph-scale]]).

| Where | Typical pH |
|---|---|
| Stomach contents | 1.5–3.5 |
| Lysosomes (the cell's digestive compartments) | 4.5–5 |
| Thylakoid space of a chloroplast in the light | about 5 |
| Skin surface | about 5 |
| Cytosol | 7.2 |
| Arterial blood | 7.35–7.45 |
| Mitochondrial matrix | about 7.8 |
| Pancreatic juice | about 8 |

These differences are not accidents. Lysosomal enzymes work best in acid, so one that leaks into the cytosol is nearly inactive. And the pH difference across the inner membranes of mitochondria and chloroplasts is stored energy, which ATP synthase turns into ATP (see [[oxidative-phosphorylation]]).

### How a buffer works
A buffer is a weak acid HA together with its conjugate base $\\ce{A-}$. Added acid is mopped up by $\\ce{A-}$, added base by HA, so their ratio — and with it the pH — changes only a little:

$$\\mathrm{pH} = {\\mathrm{p}K}_a + \\log_{10}\\frac{[\\ce{A-}]}{[\\ce{HA}]}$$

A buffer works best within about one unit of its $\\mathrm{p}K_a$, where both forms are plentiful; its capacity is greatest exactly at the $\\mathrm{p}K_a$. Inside cells the main buffers are phosphate ($\\ce{H2PO4-}$/$\\ce{HPO4^2-}$, $\\mathrm{p}K_a$ about 6.8) and proteins — especially histidine side chains, $\\mathrm{p}K_a$ about 6.

### The bicarbonate buffer of blood
Carbon dioxide from respiring cells combines with water, a reaction sped up some ten million times by the enzyme carbonic anhydrase in red blood cells:

$$\\ce{CO2 + H2O <=> H2CO3 <=> H+ + HCO3-}$$

With an apparent $\\mathrm{p}K_a$ of 6.1 at 37 °C this looks like a poor buffer for pH 7.4. Normal blood holds 24 mmol/L of bicarbonate and only 1.2 mmol/L of dissolved $\\ce{CO2}$ (0.03 mmol/L for each mmHg of $P_{\\ce{CO2}}$, which is 40 mmHg), a ratio of 20 to 1:

$$\\mathrm{pH} = 6.1 + \\log_{10}\\frac{[\\ce{HCO3-}]}{0.03\\,P_{\\ce{CO2}}}$$

Its strength is that the system is **open**. Acid added to blood turns bicarbonate into $\\ce{CO2}$, and the lungs breathe it away instead of letting it accumulate; breathing faster lowers the $\\ce{CO2}$ further. Over days the kidneys excrete acid and make new bicarbonate. The lungs remove some 15 000 mmol of acid as $\\ce{CO2}$ every day, the kidneys 50–100 mmol of non-volatile acids. Haemoglobin, plasma proteins and phosphate add non-bicarbonate buffering on top.

> [!fact] Added to plain water, 10 mmol/L of strong acid drops the pH to 2. Added to blood whose $\\ce{CO2}$ is kept constant by the lungs, it lowers the pH only from 7.40 to about 7.17 — and less still once the non-bicarbonate buffers and faster breathing join in.

A blood pH outside roughly 6.8–7.8 is quickly fatal, because enzymes, ion channels and the heart all depend on the charges of their groups (see [[medicine:acid-base-balance]]). Reference ranges vary a little between laboratories: bicarbonate about 22–26 mmol/L, arterial $P_{\\ce{CO2}}$ 35–45 mmHg (4.7–6.0 kPa).

> [!warn] Diabetic ketoacidosis is an emergency in which acids made from fat overwhelm the blood's buffers. In a person with diabetes, warning signs are deep, rapid breathing, a fruity smell on the breath, vomiting, abdominal pain, great thirst, drowsiness or confusion — call your local emergency number.
`,
  ideas: [
    'pH is logarithmic: a fall of 0.3 doubles the hydrogen-ion concentration; blood at pH 7.4 holds only 40 nmol/L of H⁺.',
    'A buffer is a weak acid and its conjugate base; it works best within one pH unit of its pKa (Henderson–Hasselbalch).',
    'Different compartments keep different pH values: stomach 1.5–3.5, lysosomes 4.5–5, cytosol 7.2, blood 7.35–7.45, mitochondrial matrix about 7.8.',
    'Blood relies on bicarbonate (pKa 6.1): it works because the lungs remove CO₂ and the kidneys regulate bicarbonate — an open system.',
    'Inside cells, phosphate and proteins (histidine) do most of the buffering.'
  ],
  pitfalls: [
    'A buffer keeps the pH exactly constant — It only reduces the change. Its capacity is finite; once most of the base form is used up the pH falls quickly.',
    'The bicarbonate system suits blood because its pKa is close to 7.4 — Its pKa is 6.1, more than a unit away. It works because the lungs keep the CO₂ low and the kidneys adjust the bicarbonate.',
    'A pH of 7.1 is only slightly more acidic than 7.4 — pH is logarithmic: 7.1 means twice the hydrogen-ion concentration, a serious acidosis.'
  ],
  formulas: [
    {
      name: 'pH from the hydrogen-ion concentration',
      expr: 'pH = -log(H*1e-9)', tex: '\\mathrm{pH} = -\\log_{10}\\mathrm{[\\ce{H+}]}',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        H: { name: 'hydrogen-ion concentration (nmol/L)', value: 40, tex: '\\mathrm{[\\ce{H+}]}' }
      },
      note: 'Enter [H⁺] in nmol/L (1 nmol/L = 10⁻⁹ mol/L); the logarithm is taken of the concentration in mol/L.',
      stories: { pH: 'A blood sample has a hydrogen-ion concentration of {H} nmol/L. What is its pH?', H: 'What is the hydrogen-ion concentration, in nmol/L, of blood at pH {pH}?' }
    },
    {
      name: 'The Henderson–Hasselbalch equation',
      expr: 'pH = pKa + log(A/HA)', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log_{10}\\dfrac{\\mathrm{[\\ce{A-}]}}{\\mathrm{[\\ce{HA}]}}',
      vars: {
        pH: { name: 'pH', tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the weak acid', value: 6.8, tex: '{\\mathrm{p}K}_a' },
        A: { name: 'conjugate base (e.g. HPO₄²⁻)', q: 'concentration', unit: 'mM', value: 10, tex: '\\mathrm{[\\ce{A-}]}' },
        HA: { name: 'weak acid (e.g. H₂PO₄⁻)', q: 'concentration', unit: 'mM', value: 4, tex: '\\mathrm{[\\ce{HA}]}' }
      },
      note: 'Only the ratio of the two concentrations matters. Phosphate inside cells: pKa about 6.8.',
      practice: { unknowns: ['pH', 'A'] },
      stories: { pH: 'A phosphate buffer (pKa {pKa}) holds {A} of the base form and {HA} of the acid form. What is its pH?', A: 'What concentration of base must be added to {HA} of acid (pKa {pKa}) to buffer at pH {pH}?' }
    },
    {
      name: 'Blood pH from bicarbonate and carbon dioxide',
      expr: 'pH = pK + log(HCO3/(s*PCO2))', tex: '\\mathrm{pH} = {\\mathrm{p}K}_a + \\log_{10}\\dfrac{\\mathrm{[\\ce{HCO3-}]}}{s\\,P_{\\ce{CO2}}}',
      vars: {
        pH: { name: 'blood pH', tex: '\\mathrm{pH}' },
        pK: { name: 'apparent pKa of CO₂/HCO₃⁻ at 37 °C', value: 6.1, fixed: true, tex: '{\\mathrm{p}K}_a' },
        HCO3: { name: 'bicarbonate', q: false, unit: 'mmol/L', value: 24, tex: '\\mathrm{[\\ce{HCO3-}]}' },
        s: { name: 'solubility of CO₂ (mmol/L per mmHg)', value: 0.03, fixed: true },
        PCO2: { name: 'arterial partial pressure of CO₂', q: false, unit: 'mmHg', value: 40, tex: 'P_{\\ce{CO2}}' }
      },
      note: 'An empirical form, with PCO₂ in mmHg (in kPa use s = 0.23 mmol/L per kPa). Reference ranges vary by laboratory: bicarbonate about 22–26 mmol/L, PCO₂ 35–45 mmHg.',
      practice: { unknowns: ['pH', 'HCO3', 'PCO2'] },
      stories: {
        pH: 'A blood gas shows bicarbonate {HCO3} and PCO₂ {PCO2}. What is the pH?',
        PCO2: 'Bicarbonate is {HCO3}. What PCO₂ would give a pH of {pH}?',
        HCO3: 'The PCO₂ is {PCO2} and the pH {pH}. What is the bicarbonate?'
      }
    },
    {
      name: 'Buffer capacity',
      expr: 'beta = 2.303*C*10^(pH - pKa)/(1 + 10^(pH - pKa))^2', tex: '\\beta = 2.303\\,C\\,\\dfrac{10^{\\mathrm{pH} - {\\mathrm{p}K}_a}}{\\left(1 + 10^{\\mathrm{pH} - {\\mathrm{p}K}_a}\\right)^2}',
      vars: {
        beta: { name: 'buffer capacity (acid or base per pH unit)', q: 'concentration', unit: 'mM', tex: '\\beta' },
        C: { name: 'total buffer concentration', q: 'concentration', unit: 'mM', value: 10 },
        pH: { name: 'pH', value: 7.2, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa', value: 6.8, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'Strong acid or base (mmol per litre) needed to shift the pH by one unit, for small shifts. The maximum, 0.576 C, is at pH = pKa; one unit away it has fallen to a third of that.',
      practice: { unknowns: ['beta', 'C'] },
      stories: { beta: 'A cell holds {C} of phosphate (pKa {pKa}) at pH {pH}. What is the buffer capacity of the phosphate?', C: 'What total buffer concentration (pKa {pKa}) gives a capacity of {beta} per pH unit at pH {pH}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a blood gas',
      q: 'Normal blood has 24 mmol/L bicarbonate and a PCO₂ of 40 mmHg. In a metabolic acidosis the bicarbonate falls to 12 mmol/L. Find the pH before any compensation, and after faster breathing lowers the PCO₂ to 26 mmHg.',
      steps: [
        'Normal: $\\mathrm{pH} = 6.1 + \\log(24/(0.03 \\times 40)) = 6.1 + \\log 20 = 7.40$.',
        'Bicarbonate halved, PCO₂ unchanged: $6.1 + \\log(12/1.2) = 6.1 + 1.00 = 7.10$.',
        'With PCO₂ 26 mmHg: $6.1 + \\log(12/0.78) = 6.1 + 1.19 = 7.29$. Breathing restores most of the ratio; the kidneys must do the rest.'
      ],
      a: 'pH 7.40 normally, 7.10 in the acidosis, 7.29 with respiratory compensation.'
    },
    {
      title: 'Why an open buffer is better',
      q: 'Add 10 mmol/L of strong acid to (a) plain water, (b) blood in a sealed syringe (no CO₂ can escape) and (c) blood in a body whose lungs hold the PCO₂ at 40 mmHg. Ignore buffers other than bicarbonate.',
      steps: [
        '(a) Water: $[\\ce{H+}] = 0.010$ M, so pH = 2.0.',
        '(b) Sealed: bicarbonate 24 → 14 mmol/L and $\\ce{CO2}$ 1.2 → 11.2 mmol/L: $\\mathrm{pH} = 6.1 + \\log(14/11.2) = 6.20$.',
        '(c) Open: $\\ce{CO2}$ stays at 1.2 mmol/L: $\\mathrm{pH} = 6.1 + \\log(14/1.2) = 7.17$.'
      ],
      a: 'pH 2.0 in water, 6.20 in a closed system, 7.17 when the lungs remove the CO₂.'
    },
    {
      title: 'How many free protons in a bacterium?',
      q: 'An *E. coli* cell has a volume of about 1 µm³ (10⁻¹⁵ L) and a cytosolic pH of 7.2. How many free hydrogen ions does it contain at any moment?',
      steps: [
        '$[\\ce{H+}] = 10^{-7.2} = 6.3\\times10^{-8}$ mol/L.',
        'Amount: $6.3\\times10^{-8} \\times 10^{-15} = 6.3\\times10^{-23}$ mol.',
        'Number: $6.3\\times10^{-23} \\times 6.02\\times10^{23} \\approx 38$.'
      ],
      a: 'About 40 free protons — yet millions pass through its buffers every second.'
    }
  ],
  quiz: [
    { q: 'Blood pH falls from 7.4 to 7.1. The hydrogen-ion concentration…', choices: ['rises by about 4 %', 'doubles', 'rises tenfold', 'halves'], a: 1, why: 'A change of 0.3 pH units is a factor of $10^{0.3} = 2$ in [H⁺]: from 40 to 80 nmol/L.' },
    { q: 'Which of these would buffer best at pH 7.4 in a sealed test tube?', choices: ['acetate, pKa 4.8', 'phosphate, pKa 6.8', 'ammonium, pKa 9.3', 'hydrochloric acid with sodium chloride'], a: 1, why: 'A buffer works within about one unit of its pKa; phosphate is closest. Hydrochloric acid is strong and does not buffer at all.' },
    { q: 'A blood gas shows bicarbonate 18 mmol/L and PCO₂ 30 mmHg. What is the pH?', answer: 7.4, why: '$6.1 + \\log(18/(0.03 \\times 30)) = 6.1 + \\log 20 = 7.40$ — the ratio, not the individual values, sets the pH.' },
    { q: 'The bicarbonate system is a good blood buffer mainly because its pKa is close to the pH of blood.', a: false, why: 'Its pKa (6.1) is more than a unit below 7.4. It works because the system is open: the lungs breathe away the CO₂ that acid produces, and the kidneys adjust the bicarbonate.' },
    { q: 'Why do enzymes that leak out of lysosomes do little damage to the cell?', choices: ['They are destroyed at once by proteases', 'They work best near pH 5 and are almost inactive at the cytosol\'s pH of 7.2', 'The cytosol contains no substrates for them', 'They are too large to move'], a: 1, why: 'Lysosomal hydrolases have acid pH optima; the charges on their catalytic groups are wrong at pH 7.2.' }
  ],
  problems: [
    { q: 'A buffer contains 0.10 M acetate and 0.050 M acetic acid (pKa 4.76). What is its pH?', answer: 5.06, tol: 0.01, steps: ['$\\mathrm{pH} = 4.76 + \\log(0.10/0.050) = 4.76 + 0.30 = 5.06$.'] },
    { q: 'During hard exercise lactic acid lowers a runner\'s bicarbonate to 16 mmol/L while heavy breathing lowers the PCO₂ to 32 mmHg. What is the blood pH?', answer: 7.32, tol: 0.005, steps: ['$0.03 \\times 32 = 0.96$ mmol/L of dissolved CO₂.', '$\\mathrm{pH} = 6.1 + \\log(16/0.96) = 6.1 + 1.22 = 7.32$.'] }
  ],
  applications: ['Blood gas analysis in emergency and intensive care, to tell metabolic from respiratory disturbances.', 'Cell culture: media buffered with bicarbonate are kept in incubators with 5 % CO₂.', 'Ocean acidification: the surface ocean has fallen from about pH 8.2 to 8.1 since pre-industrial times, making it harder for corals and shellfish to build carbonate.', 'Drugs that reduce stomach acid, and drugs whose absorption depends on whether they are charged at a given pH.'],
  history: 'Søren Sørensen introduced the pH scale in 1909 at the Carlsberg Laboratory in Copenhagen, where he needed to control acidity in studies of enzymes and brewing. Lawrence Henderson wrote the buffer equation in 1908, and Karl Hasselbalch put it in logarithmic form in 1916, applying it to the carbonic acid of blood.',
  sim: 'chem-blood-buffer'
},

/* ================================================================ CARBOHYDRATES */
{
  id: 'carbohydrates', parent: 'biomolecules', title: 'Carbohydrates', level: 1,
  short: 'Sugars and the chains built from them: glucose and its relatives, joined by glycosidic bonds into disaccharides and into polysaccharides — starch and glycogen to store energy, cellulose and chitin to build walls and skeletons.',
  keywords: ['carbohydrate', 'sugar', 'monosaccharide', 'glucose', 'fructose', 'galactose', 'ribose', 'disaccharide', 'sucrose', 'lactose', 'maltose', 'glycosidic bond', 'condensation', 'hydrolysis', 'polysaccharide', 'starch', 'amylose', 'amylopectin', 'glycogen', 'cellulose', 'chitin', 'alpha and beta glucose'],
  prereq: ['chemistry:carbohydrates', 'chemistry:functional-groups', 'water-in-life'],
  related: ['lipids', 'nucleic-acids', 'glycolysis', 'photosynthesis', 'diffusion-osmosis', 'chemistry:polymers', 'chemistry:stereoisomers', 'medicine:macronutrients', 'medicine:glucose-regulation'],
  body: `
Carbohydrates — sugars and the chains made from them — are the fuel most cells burn first, the energy stores of plants and animals, and the building material of plant cell walls, insect skeletons and fungi. Most have the formula $(\\ce{CH2O})_n$, a "hydrate of carbon", which gave them their name.

### Monosaccharides
A monosaccharide is a chain of three to seven carbons carrying hydroxyl groups and one carbonyl group — an aldehyde (aldoses, such as glucose) or a ketone (ketoses, such as fructose). Glucose, galactose and fructose share the formula $\\ce{C6H12O6}$ (180.16 g/mol) and differ only in how their atoms are arranged. The five-carbon sugars ribose and deoxyribose form the backbones of RNA and DNA ([[nucleic-acids]]).

In water, five- and six-carbon sugars close into rings: the carbonyl carbon reacts with a hydroxyl group of the same molecule. The ring can close two ways, leaving the new hydroxyl group on carbon 1 below the ring (**α**) or above it (**β**). That small difference decides whether a chain of glucose becomes food or wood.

### Glycosidic bonds
Two sugars join in a **condensation** reaction: a hydroxyl from each combines, a molecule of water leaves, and an oxygen bridge — a **glycosidic bond** — remains. Digestion reverses it by **hydrolysis**. So each glucose added to a chain adds $180.16 - 18.02 = 162.14$ g/mol.

| Disaccharide | Made of | Bond | Found in |
|---|---|---|---|
| Maltose | glucose + glucose | α-1,4 | germinating grain, digested starch |
| Sucrose | glucose + fructose | α-1,β-2 | table sugar; the sap of plants |
| Lactose | galactose + glucose | β-1,4 | milk |

### Polysaccharides
| | Starch | Glycogen | Cellulose |
|---|---|---|---|
| Bonds | α-1,4; α-1,6 branches in amylopectin | α-1,4 and α-1,6 | β-1,4 |
| Branch points | amylopectin: every 24–30 glucoses | every 8–12 glucoses | none |
| Shape | amylose coils into a helix, 6 glucoses per turn | a compact sphere with many chain ends | straight chains bundled side by side |
| Job | energy store of plants | energy store of animals and fungi | plant cell walls |

**Starch** is about a quarter unbranched amylose and three quarters branched amylopectin. **Glycogen** is branched even more densely around a small protein core, so it has hundreds of chain ends where enzymes can add or remove glucose at once — the liver can release glucose within seconds of a hormone signal ([[medicine:glucose-regulation]]). An adult stores about 100 g of glycogen in the liver and 400 g in the muscles. In **cellulose** every other glucose is flipped by the β bond, so the chains lie straight and hydrogen-bond to their neighbours into microfibrils that are, weight for weight, stronger than steel wire. Cellulose is the most abundant organic compound on Earth. **Chitin**, in the walls of fungi and the skeletons of insects and crustaceans, is a β-1,4 chain of a nitrogen-containing glucose.

### Why store sugar as a polymer?
Osmosis. The glycogen of a liver cell, dissolved as separate glucose molecules, would be about 0.4 mol/L — more than the concentration of everything else in the cell put together — and water would rush in and burst it. Linked into a few large molecules, the same glucose exerts almost no osmotic pressure, because osmotic pressure counts particles, not their size (see [[diffusion-osmosis]]).

### Why we cannot eat grass
Our digestive enzymes cut α bonds but not β bonds. Cows, termites and rabbits rely on gut microbes that make cellulases; for us cellulose is dietary fibre. Most adults in the world also stop making lactase after weaning, so lactose passes to gut bacteria instead. **Lactase persistence** evolved independently in several dairying peoples within the last 10 000 years — a clear case of recent human evolution.

> [!key] One bond decides the job: α-linked glucose chains coil and branch into stores that enzymes can open quickly; β-linked chains lie straight and bundle into fibres that almost no animal enzyme can break.
`,
  ideas: [
    'Monosaccharides such as glucose (C₆H₁₂O₆) are the units; in water they close into α or β rings.',
    'Glycosidic bonds form by condensation (releasing water) and are broken by hydrolysis; each glucose in a chain adds 162.14 g/mol.',
    'Starch and glycogen (α bonds, branched) store energy; cellulose and chitin (β bonds, straight) build structures.',
    'Storing glucose as a polymer avoids an enormous osmotic pressure.',
    'Animals cannot digest β bonds without help from microbes; lactose digestion in adults is a recent evolutionary change in some populations.'
  ],
  pitfalls: [
    'Starch and cellulose are different substances made of different sugars — Both are chains of glucose. Only the bond differs: α in starch, β in cellulose.',
    'All carbohydrates are sweet — Only small sugars taste sweet. Starch, glycogen and cellulose are tasteless, and cellulose is not even digestible by us.',
    'Joining sugars uses up water — Condensation releases one water molecule per bond; it is hydrolysis, the breaking of the bond, that uses water.'
  ],
  formulas: [
    {
      name: 'Molar mass of a glucose polymer',
      expr: 'M = n*Mu + Mw', tex: 'M = n\\,M_u + M_{\\ce{H2O}}',
      vars: {
        M: { name: 'molar mass of the chain', q: 'molarmass', unit: 'g/mol' },
        n: { name: 'number of sugar units', int: true, value: 30000 },
        Mu: { name: 'mass of one sugar unit in the chain (glucose 162.14; N-acetylglucosamine of chitin 203.19)', q: 'molarmass', unit: 'g/mol', value: 162.14, tex: 'M_u' },
        Mw: { name: 'water at the chain ends', q: 'molarmass', unit: 'g/mol', value: 18.02, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: 'Each condensation removes one water, so a chain of n units has the mass of n dehydrated units plus one water.',
      practice: { unknowns: ['M', 'n'] },
      stories: { M: 'A glycogen molecule contains {n} glucose units. What is its molar mass?', n: 'An amylose chain has a molar mass of {M}. How many glucose units does it contain?' }
    },
    {
      name: 'Osmotic pressure of dissolved particles',
      expr: 'Pi = C*R*T', tex: '\\Pi = C\\,R\\,T',
      vars: {
        Pi: { name: 'osmotic pressure', q: 'pressure', unit: 'MPa', tex: '\\Pi' },
        C: { name: 'concentration of dissolved particles', q: 'concentration', unit: 'mM', value: 400 },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'van \'t Hoff\'s law for dilute solutions. It counts particles, so a polymer of 30 000 glucoses counts as one.',
      stories: { Pi: 'If a liver cell\'s glycogen were dissolved as free glucose it would be {C}. What osmotic pressure would that add at {T}?', C: 'What concentration of dissolved particles gives an osmotic pressure of {Pi} at {T}?' }
    },
    {
      name: 'Energy stored as carbohydrate',
      expr: 'E = m*u', tex: 'E = m\\,u',
      vars: {
        E: { name: 'energy released when it is oxidised', q: 'energy', unit: 'kcal' },
        m: { name: 'mass of carbohydrate', q: 'mass', unit: 'g', value: 100 },
        u: { name: 'energy per unit mass (carbohydrate about 17 MJ/kg = 17 kJ/g)', q: 'specificenergy', unit: 'MJ/kg', value: 17 }
      },
      note: 'Carbohydrate and protein about 17 kJ/g (4 kcal/g); fat 37 kJ/g (9 kcal/g).',
      stories: { E: 'The liver stores {m} of glycogen. How much energy is that?', m: 'How much carbohydrate supplies {E}?' }
    }
  ],
  examples: [
    {
      title: 'Why not keep glucose loose?',
      q: 'A liver cell holds glycogen equivalent to 0.4 mol/L of glucose. What osmotic pressure would that glucose exert at 37 °C if it were free, and what if it were packed into glycogen molecules of 30 000 glucoses each?',
      steps: [
        'Free: $\\Pi = CRT = 400\\ \\mathrm{mol/m^3} \\times 8.314 \\times 310 = 1.03\\times10^{6}$ Pa — about 1 MPa, or 10 atmospheres, on top of the cell\'s normal 0.75 MPa.',
        'As glycogen: $400/30\\,000 = 0.013\\ \\mathrm{mol/m^3}$ of particles, so $\\Pi = 0.013 \\times 8.314 \\times 310 \\approx 34$ Pa — negligible.'
      ],
      a: 'About 1 MPa as free glucose, which would burst the cell; about 34 Pa as glycogen.'
    },
    {
      title: 'How long does liver glycogen last?',
      q: 'The liver holds about 100 g of glycogen (17 kJ/g). The brain uses about 120 g of glucose a day. If the liver had to supply only the brain, how long would its glycogen last?',
      steps: [
        'Energy: $100 \\times 17 = 1700$ kJ, about 410 kcal.',
        'Glucose released: about 100 g (a little more, since each unit gains a water on hydrolysis).',
        'Time: $100/120 \\times 24\\ \\mathrm{h} = 20$ h. An overnight fast uses a large part of it, which is why the liver then turns to making new glucose.'
      ],
      a: 'About 20 hours.'
    }
  ],
  quiz: [
    { q: 'Starch and cellulose are both made of glucose. What makes them so different?', choices: ['Cellulose contains a different sugar', 'Their glycosidic bonds: α in starch, β in cellulose', 'Cellulose chains are much shorter', 'Starch contains nitrogen'], a: 1, why: 'The β bond flips every other glucose, so cellulose chains are straight and bundle into fibres; α-linked starch coils into helices that enzymes open easily.' },
    { q: 'When two glucose molecules join to form maltose…', choices: ['a molecule of water is released (condensation)', 'a molecule of water is used up (hydrolysis)', 'carbon dioxide is released', 'nothing else changes'], a: 0, why: 'A hydroxyl from each sugar combines; water leaves and an oxygen bridge remains. Breaking the bond (hydrolysis) uses water.' },
    { q: 'What is the molar mass, in g/mol, of a chain of 10 glucose units?', answer: 1639.4, unit: 'g/mol', why: '$10 \\times 162.14 + 18.02 = 1639.4$ g/mol.' },
    { q: 'Glycogen is more highly branched than amylopectin.', a: true, why: 'Glycogen branches every 8–12 glucoses, amylopectin every 24–30. More branches mean more chain ends, so glucose can be added or released faster.' },
    { q: 'Why do animals store glucose as glycogen rather than as free glucose?', choices: ['Glycogen holds more energy per glucose unit', 'A few large molecules exert far less osmotic pressure than the same glucose dissolved separately', 'Free glucose is poisonous to cells', 'Glycogen weighs less than the glucose it contains'], a: 1, why: 'Osmotic pressure depends on the number of dissolved particles. 0.4 mol/L of free glucose would add about 1 MPa and burst the cell.' }
  ],
  problems: [
    { q: 'Sucrose is made from glucose and fructose (both 180.16 g/mol). What is its molar mass?', answer: 342.3, unit: 'g/mol', tol: 0.005, steps: ['One condensation removes one water: $180.16 + 180.16 - 18.02 = 342.30$ g/mol.'] },
    { q: 'An amylose chain has a molar mass of 810 000 g/mol. About how many glucose units does it contain?', answer: 4996, tol: 0.01, steps: ['$n = (810\\,000 - 18.02)/162.14 = 4996$.'] }
  ],
  applications: ['Diet and health: starch, sugars and fibre, and how fast carbohydrates raise blood glucose.', 'Paper, cotton and wood are mostly cellulose; turning it into biofuel needs cellulase enzymes.', 'The ABO blood groups are short sugar chains on red blood cells.', 'Lactose intolerance and the evolution of lactase persistence.'],
  history: 'Anselme Payen isolated and named cellulose in 1838, and Claude Bernard discovered glycogen in the liver in the 1850s. Emil Fischer worked out the arrangement of the atoms of glucose and its relatives in the 1890s (Nobel Prize 1902), and Norman Haworth showed that sugars exist as rings (Nobel Prize 1937).'
},

/* ================================================================ LIPIDS */
{
  id: 'lipids', parent: 'biomolecules', title: 'Lipids', level: 1,
  short: 'The oily molecules of life: fats and oils that store energy, phospholipids that assemble themselves into membranes, steroids such as cholesterol and its hormones, and waxes. They are grouped together because they do not dissolve in water.',
  keywords: ['lipid', 'fat', 'oil', 'fatty acid', 'saturated', 'unsaturated', 'cis', 'trans fat', 'omega-3', 'triglyceride', 'ester bond', 'phospholipid', 'amphipathic', 'bilayer', 'micelle', 'cholesterol', 'steroid', 'steroid hormones', 'wax', 'membrane fluidity'],
  prereq: ['chemistry:lipids', 'water-in-life', 'chemistry:functional-groups'],
  related: ['carbohydrates', 'membrane-structure', 'diffusion-osmosis', 'animal-hormones', 'medicine:cholesterol-lipids', 'medicine:macronutrients', 'chemistry:intermolecular-forces'],
  body: `
Lipids are the molecules of life that do not dissolve in water. They are a mixed family held together by being mostly hydrocarbon: fats and oils that store energy, phospholipids that make every membrane, steroids such as cholesterol and the hormones made from it, and waxes that waterproof leaves and feathers. Unlike carbohydrates, proteins and nucleic acids, lipids are not long polymers; they hold together as assemblies because water pushes their oily parts together ([[water-in-life]]).

### Fatty acids
A fatty acid is a hydrocarbon tail, usually 14 to 22 carbons long, ending in a carboxylic acid head. In a **saturated** fatty acid every carbon–carbon bond is single and the tail is straight; such tails pack tightly and melt high. A **cis** double bond puts a kink of about 30° into the tail, the tails pack loosely, and the fat melts low — which is why beef fat is solid and olive oil liquid at room temperature.

| Fatty acid | Carbons : double bonds | Melting point |
|---|---|---|
| Palmitic | 16 : 0 | 63 °C |
| Stearic | 18 : 0 | 70 °C |
| Elaidic | 18 : 1 trans | 45 °C |
| Oleic | 18 : 1 cis | 13 °C |
| Linoleic (omega-6) | 18 : 2 cis | −5 °C |
| α-Linolenic (omega-3) | 18 : 3 cis | −11 °C |

Humans cannot make linoleic or α-linolenic acid, so both are essential in the diet. **Trans** fats, made mostly by the partial industrial hydrogenation of oils, have straight tails like saturated fats; they raise LDL cholesterol, and many countries now restrict them (see [[medicine:cholesterol-lipids]]).

### Triglycerides: the densest energy store
Three fatty acids joined by ester bonds to glycerol make a **triglyceride**. Its carbons are highly reduced, so fat yields about 37 kJ/g — more than twice carbohydrate or protein (17 kJ/g) — and it is stored dry, whereas each gram of glycogen holds about three grams of water. A lean adult carries some 10–15 kg of fat, 370–550 MJ of energy, against less than half a kilogram of glycogen. Seeds, migrating birds and hibernating mammals store fat for the same reason; whales and seals also use their blubber as insulation.

### Phospholipids and the bilayer
Replace one fatty acid of a triglyceride with a phosphate carrying a small polar group (choline, ethanolamine, serine) and you have a **phospholipid**: a polar head with two oily tails, an **amphipathic** molecule. In water, cone-shaped molecules with a single tail (soaps, detergents) gather into spherical **micelles**, while cylinder-shaped phospholipids line up in a **bilayer**: two sheets, tails inwards, heads facing the water on both sides. The bilayer assembles and seals itself without any energy input. It is about 5 nm thick, with an oily core about 3 nm across that ions and sugars cannot cross without help (see [[membrane-structure]]). Each lipid takes up about 0.65 nm² of the surface and wanders sideways, swapping places with its neighbours millions of times a second — but flips from one sheet to the other only rarely.

Cells tune the fluidity of their membranes. Bacteria and fish growing in the cold make more unsaturated tails, which keep the membrane fluid (**homeoviscous adaptation**).

### Steroids and waxes
Steroids are built on four fused rings. **Cholesterol** ($\\ce{C27H46O}$) makes up a third or more of the lipid molecules of animal plasma membranes, where its flat rings stiffen the fluid bilayer. It is also the raw material of bile acids, vitamin D and the steroid hormones — cortisol, aldosterone, testosterone, oestradiol and progesterone — small, oily molecules that cross membranes and act on receptors inside cells ([[animal-hormones]]). **Waxes**, long fatty acids joined to long alcohols, waterproof the cuticles of leaves and insects.

> [!key] Lipids are defined by what they do not do — dissolve in water. That makes fat a compact, water-free fuel, and lets phospholipids assemble, with no instructions at all, into the membranes that enclose every cell.
`,
  ideas: [
    'Lipids are grouped by insolubility in water, not by a common structure: fats, phospholipids, steroids, waxes.',
    'Saturated tails are straight and pack tightly (solid fats); cis double bonds kink them (liquid oils).',
    'Triglycerides store about 37 kJ/g without water — about eight times more energy per gram of store than glycogen with its water.',
    'Amphipathic phospholipids assemble spontaneously into bilayers about 5 nm thick, driven by the hydrophobic effect.',
    'Cholesterol regulates membrane fluidity and is the precursor of steroid hormones, bile acids and vitamin D.'
  ],
  pitfalls: [
    'Lipids are polymers of fatty acids, as proteins are of amino acids — A triglyceride has just three fatty acids on glycerol; lipids form large structures by assembling, not by long covalent chains.',
    'Phospholipids need energy or enzymes to form a membrane — The bilayer forms by itself in water, because it hides the tails from the water; this is the hydrophobic effect.',
    'Cholesterol is only harmful — It is an essential part of animal membranes and the precursor of vital hormones; what matters for health is how it is carried in the blood.'
  ],
  formulas: [
    {
      name: 'How long an energy store lasts',
      expr: 't = m*u/P', tex: 't = \\dfrac{m\\,u}{P}',
      vars: {
        t: { name: 'time the store lasts', q: 'time', unit: 'day' },
        m: { name: 'mass of the store', q: 'mass', unit: 'kg', value: 15 },
        u: { name: 'energy per unit mass (fat 37 MJ/kg; glycogen 17 MJ/kg dry)', q: 'specificenergy', unit: 'MJ/kg', value: 37 },
        P: { name: 'rate of energy use', q: 'power', unit: 'kcal/day', value: 2000 }
      },
      note: 'A pure energy account: a starving body also breaks down protein and lowers its energy use, and starvation is dangerous long before the fat is gone.',
      practice: { unknowns: ['t', 'm'] },
      stories: {
        t: 'An animal carries {m} of fat worth {u} and spends energy at {P}. How long could the fat alone supply it?',
        m: 'A hibernating animal spends energy at {P} for {t}. How much fat (at {u}) must it have stored?'
      }
    },
    {
      name: 'Number of lipid molecules in a bilayer',
      expr: 'N = 2*A/a', tex: 'N = \\dfrac{2A}{a}',
      vars: {
        N: { name: 'number of lipid molecules', q: 'count' },
        A: { name: 'area of the membrane', q: 'area', unit: 'µm²', value: 140 },
        a: { name: 'area per lipid molecule', q: 'area', unit: 'nm²', value: 0.65 }
      },
      note: 'Two sheets, hence the 2. A red blood cell has about 140 µm² of surface; a lipid occupies about 0.6–0.7 nm².',
      stories: { N: 'A red blood cell has {A} of membrane and each lipid covers {a}. How many lipid molecules are in its bilayer?', a: 'A membrane of {A} contains {N} lipid molecules. What area does each one occupy?' }
    }
  ],
  examples: [
    {
      title: 'Fat against glycogen',
      q: 'How much mass would it take to store 400 MJ as fat (37 kJ/g), and how much as glycogen (17 kJ/g) with its three grams of water per gram?',
      steps: [
        'Fat: $400\\,000/37 = 10\\,800$ g, about 11 kg.',
        'Glycogen: $400\\,000/17 = 23\\,500$ g of glycogen, plus $3 \\times 23.5 = 70.6$ kg of water — about 94 kg in all.',
        'Fat is more than eight times lighter for the same energy — decisive for anything that has to carry its fuel, from a migrating bird to a walking person.'
      ],
      a: 'About 11 kg of fat, against about 94 kg of hydrated glycogen.'
    },
    {
      title: 'Counting the lipids of a red blood cell',
      q: 'A red blood cell has a surface of 140 µm², and a phospholipid occupies about 0.65 nm². How many lipid molecules make up its membrane?',
      steps: [
        'One sheet: $140\\times10^{-12}\\ \\mathrm{m^2} / 0.65\\times10^{-18}\\ \\mathrm{m^2} = 2.15\\times10^{8}$.',
        'Two sheets: $4.3\\times10^{8}$ molecules. In 1925 Gorter and Grendel spread the lipids of red blood cells on water and found they covered about twice the cells\' surface — the first evidence for a bilayer.'
      ],
      a: 'About 4 × 10⁸ lipid molecules.'
    }
  ],
  quiz: [
    { q: 'Why is olive oil liquid at room temperature while butter is solid?', choices: ['Olive oil molecules are much shorter', 'Its fatty acids have more cis double bonds, whose kinks stop the tails packing tightly', 'Olive oil contains water', 'Butter contains more glycerol'], a: 1, why: 'Kinked tails pack loosely, so the attractions between them are weaker and the fat melts at a lower temperature. Chain lengths are similar.' },
    { q: 'Phospholipids in water form a bilayer by themselves because…', choices: ['enzymes arrange them', 'a bilayer hides the oily tails from the water while the polar heads face it', 'the heads join by covalent bonds', 'ATP holds them together'], a: 1, why: 'Self-assembly is driven by the hydrophobic effect; no energy input or enzyme is needed.' },
    { q: 'How much energy, in MJ, is stored in 10 kg of body fat (37 kJ/g)?', answer: 370, unit: 'MJ', why: '$10\\,000\\ \\mathrm{g} \\times 37\\ \\mathrm{kJ/g} = 370\\,000$ kJ = 370 MJ.' },
    { q: 'Which of these forms micelles rather than bilayers in water?', choices: ['a phospholipid with two tails', 'a soap molecule with one tail', 'cholesterol', 'a triglyceride'], a: 1, why: 'One tail and a large head make a cone; cones pack into spheres. Two-tailed phospholipids are cylinders and pack into sheets. Triglycerides have no polar head and form oil droplets.' },
    { q: 'Plant membranes contain as much cholesterol as animal membranes.', a: false, why: 'Cholesterol is characteristic of animals; plants use related sterols (phytosterols) and bacteria mostly none, although some make similar molecules called hopanoids.' }
  ],
  problems: [
    { q: 'A cell has 1000 µm² of plasma membrane. How many phospholipid molecules does it contain, at 0.65 nm² per lipid?', answer: 3.08e9, tol: 0.02, steps: ['$N = 2A/a = 2 \\times 1000\\times10^{-12}/0.65\\times10^{-18} = 3.08\\times10^{9}$.'] },
    { q: 'A hibernating animal spends 20 kJ a day for 120 days. How many grams of fat (37 kJ/g) does it burn?', answer: 64.9, unit: 'g', tol: 0.02, steps: ['Energy: $20 \\times 120 = 2400$ kJ.', 'Fat: $2400/37 = 64.9$ g.'] }
  ],
  applications: ['Soaps and detergents: single-tailed amphipathic molecules that carry grease away in micelles.', 'Liposomes and lipid nanoparticles deliver drugs and mRNA vaccines into cells.', 'Biodiesel is made from plant oils; margarine was made by hydrogenating them.', 'Blood lipid tests and the lipoproteins that carry cholesterol and fat in the blood.'],
  history: 'Michel Eugène Chevreul worked out in the 1810s that fats are made of fatty acids and glycerol, and named cholesterol. In 1925 Evert Gorter and François Grendel proposed that membranes are lipid bilayers, and in 1972 Jonathan Singer and Garth Nicolson described the fluid mosaic model of a bilayer studded with proteins.'
},

/* ================================================================ AMINO ACIDS */
{
  id: 'amino-acids', parent: 'biomolecules', title: 'Amino acids and peptide bonds', level: 2,
  short: 'Every protein is a chain of the same twenty amino acids, each with an amino group, a carboxyl group and one of twenty side chains. Peptide bonds join them head to tail into a chain whose rigid, flat links shape how proteins fold.',
  keywords: ['amino acid', 'side chain', 'R group', 'zwitterion', 'isoelectric point', 'pI', 'pKa', 'chirality', 'L-amino acid', 'essential amino acids', 'peptide bond', 'polypeptide', 'N-terminus', 'C-terminus', 'residue', 'dalton', 'histidine', 'cysteine', 'disulfide'],
  prereq: ['chemistry:amino-acids-proteins', 'ph-in-biology', 'chemistry:functional-groups'],
  related: ['protein-structure', 'translation', 'genetic-code', 'enzymes', 'chemistry:stereoisomers', 'chemistry:weak-acids', 'medicine:macronutrients'],
  body: `
Proteins do almost everything in a cell — catalyse, carry, contract, signal, defend — and every one of them is a chain built from the same twenty amino acids. The chemistry of those twenty units, and of the bond that links them, explains much of what proteins can do.

### The common plan
Each amino acid has a central carbon, the **α-carbon**, carrying four different things: an amino group, a carboxyl group, a hydrogen and a **side chain** (the R group). Only the side chain differs. Because the four groups differ, the α-carbon is chiral, and proteins use only the **L** form (glycine, whose side chain is a hydrogen, is not chiral). D-amino acids do occur in nature — in the cell walls of bacteria, for instance — but never in proteins made by ribosomes.

At the pH of a cell an amino acid is a **zwitterion**: its carboxyl group has lost a proton ($\\ce{-COO-}$, $\\mathrm{p}K_a$ about 2) and its amino group has gained one ($\\ce{-NH3+}$, $\\mathrm{p}K_a$ about 9.5). The pH at which the average net charge is zero is the **isoelectric point**, pI — for glycine 5.97, halfway between its two $\\mathrm{p}K_a$ values.

### Twenty side chains
| Group | Amino acids | Character |
|---|---|---|
| Non-polar | Gly, Ala, Val, Leu, Ile, Met, Phe, Trp, Pro | oily; buried inside proteins and membranes |
| Polar, uncharged | Ser, Thr, Asn, Gln, Tyr, Cys | form hydrogen bonds; protein surfaces and active sites |
| Acidic (negative at pH 7) | Asp ($\\mathrm{p}K_a$ 3.9), Glu (4.1) | ionic bonds, metal binding, catalysis |
| Basic (positive at pH 7) | Lys (10.5), Arg (12.5), His (6.0) | ionic bonds, binding DNA; histidine is only partly charged |

Some have special jobs. Glycine is tiny and flexible; proline's ring locks the chain into a bend; cysteines pair their thiol groups into **disulfide bridges** that staple folded proteins together; and histidine, with a $\\mathrm{p}K_a$ near 6, can take up and hand over protons at cellular pH, which makes it a favourite of active sites. Nine amino acids — His, Ile, Leu, Lys, Met, Phe, Thr, Trp and Val — are **essential** for humans: we cannot make them, so they must come from food ([[medicine:macronutrients]]).

### The peptide bond
The carboxyl group of one amino acid condenses with the amino group of the next, releasing water and forming an amide: the **peptide bond**. Chains are written from the free amino end (**N-terminus**) to the free carboxyl end (**C-terminus**), the direction in which ribosomes build them ([[translation]]). What remains of each amino acid in the chain is called a **residue**.

The peptide bond is not an ordinary single bond. The nitrogen's lone pair is shared with the carbonyl, which gives the C–N bond about 40 % double-bond character: it is shorter (0.133 nm, against 0.147 nm for a single C–N bond), it cannot rotate, and the six atoms around it lie in one plane, almost always in the **trans** arrangement. A protein chain is therefore a string of rigid flat plates hinged at the α-carbons. That restriction is what makes regular folds such as the α-helix possible ([[protein-structure]]).

Hydrolysing a peptide bond releases energy, yet in neutral water at room temperature it takes years; protein-cutting enzymes (proteases) do it in milliseconds.

### How heavy is a protein?
Without the water released at each bond, the average residue weighs about 110 g/mol (110 daltons), so a protein of 300 residues is about 33 kDa. Proteins range from peptide hormones of a few residues to titin, the molecular spring of muscle, with about 34 000 residues and a mass near 3.8 MDa.

> [!tip] Build a peptide in the simulation below: choose amino acids and watch its mass, its charge at any pH and its isoelectric point change.
`,
  ideas: [
    'All twenty amino acids share an α-carbon with an amino group, a carboxyl group and a hydrogen; only the side chain differs.',
    'At cellular pH amino acids are zwitterions; the side chains of Asp and Glu are negative, Lys and Arg positive, and His is partly charged.',
    'Peptide bonds form by condensation, N-terminus to C-terminus; the bond is planar and rigid because of its partial double-bond character.',
    'An average residue weighs about 110 Da, so mass ≈ 110 × number of residues.',
    'Nine amino acids are essential for humans and must come from the diet.'
  ],
  pitfalls: [
    'The peptide bond rotates freely like any single bond — Its partial double-bond character makes it flat and rigid; rotation happens only at the bonds to the α-carbons.',
    'An amino acid in water is a neutral molecule with −COOH and −NH₂ groups — Near neutral pH it is a zwitterion, −COO⁻ and −NH₃⁺, with no net charge but two charges.',
    'Essential amino acids are the ones proteins need most — All twenty are needed; "essential" means only that our bodies cannot make them.'
  ],
  formulas: [
    {
      name: 'Mass of a protein from its length',
      expr: 'M = n*Mr + Mw', tex: 'M \\approx n\\,M_r + M_{\\ce{H2O}}',
      vars: {
        M: { name: 'molar mass of the protein', q: 'molarmass', unit: 'g/mol' },
        n: { name: 'number of residues', int: true, value: 300 },
        Mr: { name: 'average mass of a residue', q: 'molarmass', unit: 'g/mol', value: 110, tex: 'M_r' },
        Mw: { name: 'water at the chain ends', q: 'molarmass', unit: 'g/mol', value: 18.02, fixed: true, tex: 'M_{\\ce{H2O}}' }
      },
      note: '1 g/mol corresponds to 1 dalton (Da) per molecule; a protein of 33 000 g/mol is "33 kDa". For an exact mass add up the residues (the simulation does).',
      practice: { unknowns: ['M', 'n'] },
      stories: { M: 'A protein has {n} residues. Roughly what is its molar mass?', n: 'A protein runs on a gel as {M}. About how many residues does it have?' }
    },
    {
      name: 'Isoelectric point of a simple amino acid',
      expr: 'pI = (pK1 + pK2)/2', tex: '\\mathrm{pI} = \\dfrac{{\\mathrm{p}K}_1 + {\\mathrm{p}K}_2}{2}',
      vars: {
        pI: { name: 'isoelectric point', tex: '\\mathrm{pI}' },
        pK1: { name: 'pKa of the group that ionises just below the neutral form', value: 2.34, tex: '{\\mathrm{p}K}_1' },
        pK2: { name: 'pKa of the group that ionises just above the neutral form', value: 9.6, tex: '{\\mathrm{p}K}_2' }
      },
      note: 'For amino acids with an ionisable side chain, average the two pKa values on either side of the neutral form (Asp: 1.88 and 3.65; Lys: 8.95 and 10.53).',
      stories: { pI: 'Glycine has pKa values of {pK1} and {pK2}. What is its isoelectric point?' }
    },
    {
      name: 'Fraction of a group that carries its proton',
      expr: 'f = 1/(1 + 10^(pH - pKa))', tex: 'f_{\\ce{H}} = \\dfrac{1}{1 + 10^{\\,\\mathrm{pH} - {\\mathrm{p}K}_a}}',
      vars: {
        f: { name: 'fraction protonated', q: 'ratio', unit: '%', tex: 'f_{\\ce{H}}' },
        pH: { name: 'pH', value: 7.4, tex: '\\mathrm{pH}' },
        pKa: { name: 'pKa of the group', value: 6, tex: '{\\mathrm{p}K}_a' }
      },
      note: 'From Henderson–Hasselbalch. A protonated amine or histidine is positive; a protonated carboxyl group is neutral. At pH = pKa the fraction is 50 %.',
      practice: { unknowns: ['f', 'pH'] },
      stories: { f: 'A histidine side chain has a pKa of {pKa}. What fraction carries a proton (and a positive charge) at pH {pH}?', pH: 'At what pH is a group with pKa {pKa} {f} protonated?' }
    }
  ],
  examples: [
    {
      title: 'The mass of an opioid peptide',
      q: 'Met-enkephalin, one of the brain\'s own opioid peptides, has the sequence Tyr-Gly-Gly-Phe-Met (YGGFM). Find its molar mass from the residue masses Tyr 163.18, Gly 57.05, Phe 147.18, Met 131.19 g/mol, and compare with the 110-per-residue rule.',
      steps: [
        'Residues: $163.18 + 2 \\times 57.05 + 147.18 + 131.19 = 555.65$ g/mol.',
        'Add one water for the free ends: $555.65 + 18.02 = 573.67$ g/mol.',
        'Rule of thumb: $5 \\times 110 + 18 = 568$ g/mol — within 1 %, because this peptide happens to have average-sized residues.'
      ],
      a: '573.7 g/mol (573.7 Da).'
    },
    {
      title: 'The charge of lysine',
      q: 'Lysine has pKa values 2.18 (carboxyl), 8.95 (α-amino) and 10.53 (side-chain amino). What is its net charge at pH 7.0, and what is its isoelectric point?',
      steps: [
        'Carboxyl: at pH 7, almost fully deprotonated: charge −1.',
        'α-amino: protonated fraction $1/(1 + 10^{7 - 8.95}) = 0.989$; side chain: $1/(1 + 10^{7 - 10.53}) = 0.9997$.',
        'Net: $-1 + 0.989 + 0.9997 \\approx +0.99$.',
        'The neutral form lies between the two amino groups, so $\\mathrm{pI} = (8.95 + 10.53)/2 = 9.74$.'
      ],
      a: 'About +1 at pH 7; pI = 9.74.'
    },
    {
      title: 'Histidine as a switch',
      q: 'A histidine side chain has pKa 6.0. What fraction is protonated (positive) in the cytosol (pH 7.2) and in a lysosome (pH 5.0)?',
      steps: [
        'Cytosol: $1/(1 + 10^{1.2}) = 0.059$ — about 6 %.',
        'Lysosome: $1/(1 + 10^{-1.0}) = 0.91$ — about 91 %.',
        'A modest change of pH flips histidine from mostly neutral to mostly charged, which is why proteins use it to sense pH and to shuttle protons in active sites.'
      ],
      a: 'About 6 % in the cytosol, 91 % in the lysosome.'
    }
  ],
  quiz: [
    { q: 'At pH 7, a free amino acid such as alanine is mostly…', choices: ['uncharged, with −COOH and −NH₂ groups', 'a zwitterion, with −COO⁻ and −NH₃⁺', 'positively charged', 'negatively charged'], a: 1, why: 'pH 7 is well above the carboxyl pKa (about 2) and well below the amino pKa (about 9.5), so both groups are charged and the net charge is zero.' },
    { q: 'Why can the chain not rotate about the peptide bond?', choices: ['It is a full double bond', 'The nitrogen lone pair is shared with the carbonyl, giving it partial double-bond character', 'Side chains block the rotation', 'Hydrogen bonds hold it in place'], a: 1, why: 'Resonance gives the C–N bond about 40 % double-bond character, so it is short, flat and rigid; the chain rotates at the α-carbons instead.' },
    { q: 'Using 110 Da per residue, what is the approximate mass, in kDa, of a protein of 450 residues?', answer: 49.5, why: '$450 \\times 110 + 18 \\approx 49\\,500$ Da = 49.5 kDa.' },
    { q: 'All twenty amino acids used in proteins are chiral.', a: false, why: 'Glycine\'s side chain is a hydrogen, so its α-carbon carries two identical groups and is not chiral. The other nineteen are used in the L form.' },
    { q: 'Which amino acid is best suited to take up and release protons at cellular pH?', choices: ['lysine (pKa 10.5)', 'histidine (pKa 6.0)', 'leucine (no ionisable side chain)', 'glutamate (pKa 4.1)'], a: 1, why: 'A group is a good proton shuttle near its pKa, where both forms are present. Histidine\'s pKa is closest to 7.' }
  ],
  problems: [
    { q: 'Aspartic acid has pKa values 1.88 (α-carboxyl), 3.65 (side chain) and 9.60 (amino). What is its isoelectric point?', answer: 2.77, tol: 0.01, hint: 'Find the form with zero net charge and average the pKa values on either side of it.', steps: ['The neutral form has the α-carboxyl deprotonated, the side chain protonated and the amino group protonated.', 'It lies between pKa 1.88 and 3.65: $\\mathrm{pI} = (1.88 + 3.65)/2 = 2.77$.'] },
    { q: 'A cysteine thiol has pKa 8.3. What percentage is deprotonated (as the reactive thiolate) at pH 7.4?', answer: 11.2, unit: '%', tol: 0.02, steps: ['Protonated fraction: $1/(1 + 10^{7.4 - 8.3}) = 1/(1 + 0.126) = 0.888$.', 'Deprotonated: $1 - 0.888 = 0.112$, about 11 %.'] }
  ],
  applications: ['Nutrition: essential amino acids and why plant proteins are combined in traditional diets.', 'Separating proteins by charge (isoelectric focusing) and by size (gel electrophoresis).', 'Peptide medicines such as insulin and the hormone analogues used in diabetes.', 'Newborn screening for phenylketonuria: children with PKU follow a diet low in phenylalanine.'],
  history: 'The first amino acid, asparagine, was isolated from asparagus juice in 1806; the last of the twenty, threonine, was identified by William Rose in 1935. Emil Fischer and Franz Hofmeister independently proposed in 1902 that proteins are chains joined by amide (peptide) bonds, and Frederick Sanger read the first complete protein sequence, insulin, between 1951 and 1955.',
  sim: 'chem-peptide'
},

/* ================================================================ PROTEIN STRUCTURE */
{
  id: 'protein-structure', parent: 'biomolecules', title: 'Protein structure and folding', level: 2,
  short: 'A protein chain folds into one precise shape — helices and sheets packed around an oily core — and its function depends on that shape. The sequence holds the information for the fold, but the folded state is only slightly more stable than the unfolded one, so heat, acid or urea can denature it.',
  keywords: ['protein structure', 'primary structure', 'secondary structure', 'alpha helix', 'beta sheet', 'tertiary structure', 'quaternary structure', 'disulfide bridge', 'hydrophobic core', 'protein folding', 'Anfinsen', 'Levinthal paradox', 'folding funnel', 'energy landscape', 'denaturation', 'chaperone', 'melting temperature', 'amyloid', 'prion', 'AlphaFold'],
  prereq: ['amino-acids', 'water-in-life', 'chemistry:intermolecular-forces'],
  related: ['enzymes', 'enzyme-regulation', 'translation', 'mutations', 'bioenergetics', 'chemistry:gibbs-energy', 'medicine:oxygen-transport'],
  body: `
A newly made protein is a floppy chain of amino acids. Within microseconds to seconds most proteins fold into one precise three-dimensional shape, and that shape is what lets them bind, catalyse, move and signal. Biochemists describe it at four levels.

### Four levels of structure
| Level | What it is | Held together by |
|---|---|---|
| Primary | the sequence of amino acids, N to C | peptide bonds |
| Secondary | local regular patterns: α-helices and β-sheets | hydrogen bonds between backbone C=O and N–H groups |
| Tertiary | the fold of the whole chain | hydrophobic core, hydrogen bonds, ionic bonds, disulfide bridges |
| Quaternary | several chains fitted together | the same forces, between chains |

**The α-helix** is a right-handed coil in which the C=O of each residue hydrogen-bonds to the N–H four residues further on. It has 3.6 residues per turn and rises 0.15 nm per residue (0.54 nm per turn), with the side chains pointing outwards. A helix of 20 residues is 3 nm long — the thickness of the oily core of a membrane, which is why so many membrane proteins cross it with helices of about that length.

**The β-sheet** is made of extended strands, about 0.33–0.35 nm per residue, lying side by side — parallel or antiparallel — with hydrogen bonds between neighbouring strands. Silk is almost pure β-sheet.

The **tertiary** fold buries the non-polar side chains in a core away from water, while polar and charged side chains stay on the surface; the hydrophobic effect is the main driving force of folding. Cysteines far apart in the sequence may be joined by disulfide bridges, common in proteins that work outside cells. **Quaternary** structure fits separate chains together: haemoglobin is two α chains of 141 residues and two β chains of 146 — 574 residues, 64.5 kDa ([[medicine:oxygen-transport]]).

### The sequence contains the fold
In 1961 Christian Anfinsen unfolded the enzyme ribonuclease with urea and a reducing agent that broke its four disulfide bridges. When he removed them slowly, the protein refolded and regained all its activity: its eight cysteines found the one correct pairing out of 105 possible. The amino-acid sequence alone carries the information for the fold.

### Levinthal's paradox and the folding funnel
A chain cannot find its fold by trying every shape. With only three positions per residue, a chain of 100 residues has $3^{100} \\approx 5\\times10^{47}$ conformations; trying $10^{13}$ a second would take about $10^{27}$ years. Yet real proteins fold in microseconds to seconds (Cyrus Levinthal's paradox, 1969). The answer is that the energy landscape is a **funnel**: almost every step that forms native contacts lowers the energy, so the chain slides downhill through fewer and fewer shapes. Rough patches in the funnel are traps where a chain can stick in a misfolded state.

### A small margin of stability
The folded state is only slightly more stable than the unfolded one — typically 20–60 kJ/mol, the energy of a handful of hydrogen bonds — because large gains of bonding energy are nearly cancelled by the loss of the chain's entropy. So proteins are easily **denatured**, unfolding and losing their function, by heat, extreme pH, detergents or urea, which disrupt the weak bonds but leave the peptide bonds intact. Most human proteins unfold between about 45 and 70 °C; the white of a boiled egg is denatured protein tangled into a solid mesh that will not refold. Cells help their proteins fold with **chaperones** such as GroEL, a barrel in which a single chain can fold undisturbed.

### When folding goes wrong
A single change in sequence can matter. In sickle-cell disease, valine replaces glutamate at position 6 of the β chain of haemoglobin; the oily valine makes haemoglobin molecules stick together into long fibres when they release oxygen. Other proteins misfold into **amyloid** — stacks of β-sheet fibres — in Alzheimer's and Parkinson's disease, and prions are misfolded proteins that convert normal copies of themselves.

> [!key] Sequence → fold → function. The fold is written in the sequence, reached by sliding down a funnel-shaped energy landscape, and held by many weak bonds that together give only a small margin of stability.

In 2020 the AI system AlphaFold predicted protein folds from sequences with close to experimental accuracy; Demis Hassabis and John Jumper shared the 2024 Nobel Prize in Chemistry for it with the protein designer David Baker.
`,
  ideas: [
    'Primary (sequence), secondary (helices and sheets), tertiary (the whole fold) and quaternary (several chains) structure.',
    'α-helix: 3.6 residues per turn, 0.15 nm per residue, backbone hydrogen bonds from residue i to i + 4.',
    'The hydrophobic effect drives folding; hydrogen bonds, ionic bonds and disulfide bridges hold the details.',
    'The sequence determines the fold (Anfinsen); a funnel-shaped energy landscape explains why folding is fast (Levinthal).',
    'Folded proteins are only 20–60 kJ/mol more stable than unfolded ones, so heat, pH and denaturants unfold them.'
  ],
  pitfalls: [
    'Denaturing a protein breaks it into amino acids — Denaturation unfolds the chain by breaking weak bonds; the peptide bonds and the sequence stay intact.',
    'A protein searches through all its shapes until it finds the right one — That would take longer than the age of the universe; folding follows a funnel in which most steps go downhill.',
    'The folded state is held by very strong forces — Individual interactions are weak and the net stability is small, about the energy of a few hydrogen bonds, which is why proteins are so easily denatured.'
  ],
  formulas: [
    {
      name: 'Length of an α-helix',
      expr: 'L = n*d', tex: 'L = n\\,d',
      vars: {
        L: { name: 'length of the helix', q: 'length', unit: 'nm' },
        n: { name: 'number of residues', int: true, value: 20 },
        d: { name: 'rise per residue', q: 'length', unit: 'nm', value: 0.15, fixed: true }
      },
      note: 'α-helix: 0.15 nm per residue. An extended β-strand: about 0.33–0.35 nm per residue.',
      stories: { L: 'How long is an α-helix of {n} residues?', n: 'How many residues must an α-helix have to span {L}, the oily core of a membrane?' }
    },
    {
      name: 'Two-state folding: fraction folded',
      expr: 'f = 1/(1 + exp(-dG/(R*T)))', tex: 'f_N = \\dfrac{1}{1 + e^{-\\Delta G_u/RT}}',
      vars: {
        f: { name: 'fraction of molecules folded', q: 'ratio', unit: '%', tex: 'f_N' },
        dG: { name: 'stability, ΔG of unfolding', q: 'molarenergy', unit: 'kJ/mol', value: 20, signed: true, tex: '\\Delta G_u' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'For a protein that is either folded or unfolded, with nothing in between. A positive ΔG_u means the folded form is favoured.',
      practice: { unknowns: ['f', 'dG'] },
      stories: { f: 'A protein is {dG} more stable folded than unfolded. What fraction is folded at {T}?', dG: 'At {T}, {f} of a protein\'s molecules are folded. What is its stability?' }
    },
    {
      name: 'Stability near the melting temperature',
      expr: 'dG = dH*(1 - T/Tm)', tex: '\\Delta G_u = \\Delta H_m\\left(1 - \\dfrac{T}{T_m}\\right)',
      vars: {
        dG: { name: 'stability, ΔG of unfolding', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G_u' },
        dH: { name: 'enthalpy of unfolding at Tm', q: 'molarenergy', unit: 'kJ/mol', value: 400, tex: '\\Delta H_m' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        Tm: { name: 'melting temperature (half unfolded)', q: 'temperature', unit: '°C', value: 60, tex: 'T_m' }
      },
      note: 'Valid near Tm (it ignores the change in heat capacity on unfolding). A large ΔH makes the transition sharp: most of it happens within about ten degrees.',
      practice: { unknowns: ['dG', 'Tm'] },
      stories: { dG: 'A protein melts at {Tm} with an unfolding enthalpy of {dH}. How stable is it at {T}?', Tm: 'A protein with an unfolding enthalpy of {dH} has a stability of {dG} at {T}. What is its melting temperature?' }
    },
    {
      name: 'Levinthal\'s estimate of a random search',
      expr: 't = z^n/k', tex: 't = \\dfrac{z^{\\,n}}{k}',
      vars: {
        t: { name: 'time to try every conformation', q: 'time', unit: 'yr' },
        z: { name: 'conformations per residue', value: 3 },
        n: { name: 'number of residues', int: true, value: 100 },
        k: { name: 'conformations tried per second', q: 'rate', unit: '1/s', value: 1e13 }
      },
      note: 'A thought experiment showing that folding cannot be a random search; real proteins fold in microseconds to seconds.',
      practice: { unknowns: ['t'] },
      stories: { t: 'A chain of {n} residues has {z} possible conformations per residue and tries {k}. How long would a random search of every shape take?' }
    }
  ],
  examples: [
    {
      title: 'How many molecules are unfolded?',
      q: 'A protein is 20 kJ/mol more stable folded than unfolded at 37 °C. What fraction of its molecules is unfolded at any moment?',
      steps: [
        '$RT = 8.314 \\times 310.15 = 2579$ J/mol.',
        'Equilibrium constant for unfolding: $K_u = e^{-20\\,000/2579} = e^{-7.76} = 4.3\\times10^{-4}$.',
        'Fraction unfolded: $K_u/(1 + K_u) = 0.043\\ \\%$ — about one molecule in 2300.'
      ],
      a: 'About 0.04 % — one molecule in roughly 2300 is unfolded at any moment.'
    },
    {
      title: 'Melting a protein',
      q: 'A protein has ΔH = 400 kJ/mol at its melting temperature of 60 °C. Find its stability and the fraction folded at 37, 55, 60 and 65 °C.',
      steps: [
        '37 °C: $\\Delta G_u = 400(1 - 310.15/333.15) = 27.6$ kJ/mol: essentially all folded.',
        '55 °C: $\\Delta G_u = 400(1 - 328.15/333.15) = 6.0$ kJ/mol; $K = e^{6000/(8.314 \\times 328.15)} = 9.0$, so 90 % folded.',
        '60 °C: $\\Delta G_u = 0$: 50 %. At 65 °C: $\\Delta G_u = -6.0$ kJ/mol: about 11 % folded.',
        'The protein goes from 90 % to 11 % folded over just ten degrees: unfolding is cooperative.'
      ],
      a: '27.6 kJ/mol at 37 °C; 90 %, 50 % and 11 % folded at 55, 60 and 65 °C.'
    },
    {
      title: 'Levinthal\'s arithmetic',
      q: 'A 100-residue chain has three conformations per residue and tries 10¹³ shapes a second. How long would a random search take?',
      steps: [
        '$3^{100} = 5.2\\times10^{47}$ conformations.',
        '$5.2\\times10^{47}/10^{13} = 5.2\\times10^{34}$ s $= 1.6\\times10^{27}$ years.',
        'The universe is $1.4\\times10^{10}$ years old: a random search is impossible, so folding must be guided.'
      ],
      a: 'About 10²⁷ years — so folding cannot be a random search.'
    }
  ],
  quiz: [
    { q: 'Which bonds hold an α-helix in shape?', choices: ['peptide bonds between neighbouring residues', 'hydrogen bonds from the C=O of each residue to the N–H four residues along', 'disulfide bridges', 'ionic bonds between side chains'], a: 1, why: 'Secondary structure is held by hydrogen bonds between backbone groups; side chains point outwards and play no part in the basic pattern.' },
    { q: 'Anfinsen\'s ribonuclease experiment showed that…', choices: ['proteins need chaperones to fold', 'the amino-acid sequence contains all the information for the fold', 'disulfide bridges form in random pairs', 'folding needs ATP'], a: 1, why: 'The denatured enzyme refolded by itself in a test tube, with no cell, no chaperone and no energy source, and found the one correct set of disulfide pairs out of 105.' },
    { q: 'How long, in nm, is an α-helix of 30 residues?', answer: 4.5, unit: 'nm', why: '$30 \\times 0.15 = 4.5$ nm.' },
    { q: 'Denaturing a protein by heat breaks its peptide bonds.', a: false, why: 'Denaturation disrupts the weak bonds that hold the fold. The chain and its sequence stay intact, which is why some proteins can refold when conditions return to normal.' },
    { q: 'The main driving force of protein folding in water is…', choices: ['the hydrophobic effect burying non-polar side chains', 'the formation of new peptide bonds', 'disulfide bridges', 'the hydrolysis of ATP'], a: 0, why: 'Hiding non-polar side chains from water releases ordered water molecules and raises the entropy; hydrogen bonds and disulfides fix the details but do not drive the collapse.' }
  ],
  problems: [
    { q: 'A membrane protein crosses a 3.0 nm oily core with an α-helix. How many residues does that helix need?', answer: 20, tol: 0.01, steps: ['$n = L/d = 3.0/0.15 = 20$ residues.'] },
    { q: 'A protein is 15 kJ/mol more stable folded than unfolded at 25 °C. What percentage of its molecules is unfolded at any moment?', answer: 0.235, unit: '%', tol: 0.03, steps: ['$K_u = e^{-15\\,000/(8.314 \\times 298.15)} = e^{-6.05} = 2.36\\times10^{-3}$.', 'Fraction unfolded: $K_u/(1 + K_u) = 0.235\\ \\%$.'] }
  ],
  applications: ['Predicting and designing protein structures (AlphaFold, protein design) for medicines and enzymes.', 'Protein medicines such as insulin and antibodies must be kept cool to stay folded.', 'Cooking: the setting of egg white and the firming of meat are denaturation.', 'Understanding misfolding diseases — amyloid in Alzheimer\'s and Parkinson\'s disease, prion diseases, sickle-cell disease.'],
  history: 'Linus Pauling, Robert Corey and Herman Branson predicted the α-helix and the β-sheet in 1951 from the geometry of the peptide bond. John Kendrew solved the first protein structure, myoglobin, in 1958, and Max Perutz that of haemoglobin soon after (Nobel Prize 1962). Christian Anfinsen\'s refolding experiments earned him a share of the 1972 Nobel Prize in Chemistry.',
  sim: 'chem-folding'
},

/* ================================================================ NUCLEIC ACIDS */
{
  id: 'nucleic-acids', parent: 'biomolecules', title: 'Nucleic acids', level: 1,
  short: 'DNA and RNA are chains of nucleotides — a sugar, a phosphate and a base. DNA\'s two antiparallel strands pair A with T and G with C in a double helix, so each strand is a template for the other; single-stranded RNA copies genes, carries amino acids and even catalyses reactions.',
  keywords: ['nucleic acid', 'DNA', 'RNA', 'nucleotide', 'nucleoside', 'purine', 'pyrimidine', 'adenine', 'guanine', 'cytosine', 'thymine', 'uracil', 'phosphodiester bond', 'double helix', 'base pairing', 'antiparallel', 'Chargaff\'s rules', 'major groove', 'mRNA', 'tRNA', 'rRNA', 'ribozyme', 'RNA world', 'melting temperature'],
  prereq: ['chemistry:nucleic-acids', 'carbohydrates', 'chemistry:hydrogen-bonding'],
  related: ['dna-structure', 'dna-replication', 'transcription', 'translation', 'genetic-code', 'atp-energy', 'pcr', 'gel-electrophoresis', 'medicine:dna-genes'],
  body: `
Nucleic acids store and read the instructions of every cell. **DNA** holds the genome and, kept cold and dry, can survive for hundreds of thousands of years; **RNA** copies out individual genes, carries amino acids, builds the ribosome and even catalyses reactions. Both are chains of **nucleotides**.

### Nucleotides
A nucleotide has three parts: a five-carbon sugar (deoxyribose in DNA, ribose in RNA), a phosphate group on carbon 5′ of the sugar, and a nitrogen-containing base on carbon 1′. The bases come in two shapes:

| Family | Bases | Rings |
|---|---|---|
| Purines | adenine (A), guanine (G) | two fused rings |
| Pyrimidines | cytosine (C), thymine (T, DNA only), uracil (U, RNA only) | one ring |

Nucleotides are more than letters. ATP is the cell's energy currency ([[atp-energy]]), GTP powers protein synthesis, cyclic AMP carries signals inside cells ([[cell-signalling]]), and the coenzymes NAD⁺, FAD and coenzyme A are nucleotides at heart.

### The sugar–phosphate backbone
Nucleotides join by **phosphodiester bonds**: the phosphate on the 5′ carbon of one sugar links to the 3′ hydroxyl group of the next. So a chain has a direction, from its 5′ end to its 3′ end, and sequences are always written 5′→3′. Every phosphate carries a negative charge at cellular pH: DNA is a long polyanion, which is why it runs towards the positive electrode in [[gel-electrophoresis]] and wraps around positively charged histone proteins.

### The double helix
In 1953 James Watson and Francis Crick, using X-ray photographs by Rosalind Franklin and Maurice Wilkins and the base ratios of Erwin Chargaff, proposed the structure:

- two strands wound round each other in a right-handed helix, running in opposite directions (**antiparallel**);
- the backbones on the outside, the flat bases stacked in the middle like the steps of a spiral staircase;
- A always paired with T by two hydrogen bonds, G with C by three — **complementary base pairing**. Each pair joins a purine to a pyrimidine, so every step has the same width.

| B-DNA | |
|---|---|
| Diameter | 2.0 nm |
| Rise per base pair | 0.34 nm |
| Base pairs per turn | about 10.5 (3.6 nm per turn) |
| Grooves | major 2.2 nm wide, minor 1.2 nm |
| Molar mass | about 618 g/mol per base pair |

Pairing explains **Chargaff's rules**: in double-stranded DNA the amount of A equals that of T and G equals C, although the GC content differs between species — about 41 % in humans, 51 % in *E. coli*. It also explains copying: each strand is the template for a new partner ([[dna-replication]]). The hydrogen bonds keep the bases in register, but most of the helix's stability comes from the stacking of the flat bases on each other. G–C pairs make DNA harder to separate: GC-rich DNA melts into single strands at a higher temperature, the principle behind [[pcr]].

The scale is extraordinary. One copy of the human genome has 3.1 billion base pairs, a diploid cell 6.2 billion — about 2 m of DNA packed into a nucleus some 6 µm across. The 4.6 million base pairs of an *E. coli* chromosome are 1.6 mm long, in a cell only 2 µm long.

### RNA: the working copy
RNA differs in three ways: ribose carries a 2′-OH group, which makes RNA more reactive and shorter-lived; uracil takes the place of thymine; and RNA is usually single-stranded, folding back on itself into hairpins and intricate shapes.

- **mRNA** carries the message of a gene to the ribosome ([[transcription]], [[translation]]).
- **tRNA**, about 76 nucleotides folded into an L shape, carries an amino acid at one end and reads a codon with the other.
- **rRNA** forms the core of the ribosome — and it is the RNA, not the proteins, that joins amino acids together.

RNA molecules that catalyse reactions, **ribozymes**, suggest that early life may have used RNA both to store information and to do chemistry: the **RNA world** hypothesis.

> [!key] Structure explains function: the backbone gives direction and charge, complementary pairing makes each strand a template for the other, and RNA's extra hydroxyl group and single strand make it a flexible, disposable working copy.
`,
  ideas: [
    'A nucleotide is a sugar, a phosphate and a base; phosphodiester bonds link them 5′→3′.',
    'DNA: two antiparallel strands in a right-handed helix, A paired with T (two hydrogen bonds) and G with C (three).',
    'B-DNA rises 0.34 nm per base pair with about 10.5 base pairs per turn; the human diploid genome is about 2 m long.',
    'Chargaff\'s rules (A = T, G = C) follow from base pairing; GC-rich DNA melts at higher temperature.',
    'RNA has ribose and uracil and is usually single-stranded; mRNA, tRNA and rRNA read genes into proteins, and some RNAs are enzymes.'
  ],
  pitfalls: [
    'The hydrogen bonds between the bases are what mainly hold DNA together — They set the pairing, but base stacking contributes more of the stability.',
    'Chargaff\'s rules mean all four bases are equally common — They say A = T and G = C; the proportion of G + C differs widely between species.',
    'The two strands of DNA run in the same direction — They are antiparallel: one runs 5′→3′, its partner 3′→5′, which is why replication must work differently on the two strands.'
  ],
  formulas: [
    {
      name: 'Length of B-DNA',
      expr: 'L = N*b', tex: 'L = N\\,b',
      vars: {
        L: { name: 'length of the double helix', q: 'length', unit: 'm' },
        N: { name: 'number of base pairs', int: true, value: 6.2e9 },
        b: { name: 'rise per base pair', q: 'length', unit: 'nm', value: 0.34, fixed: true }
      },
      note: 'B-DNA, the usual form in cells: 0.34 nm per base pair.',
      stories: { L: 'A diploid human cell has {N} base pairs of DNA. How long would they stretch end to end?', N: 'A stretch of DNA is {L} long. How many base pairs does it contain?' }
    },
    {
      name: 'Chargaff: base composition from the GC content',
      expr: 'xA = (1 - xGC)/2', tex: 'x_A = x_T = \\dfrac{1 - x_{GC}}{2}',
      vars: {
        xA: { name: 'fraction of A (equal to T)', q: 'ratio', unit: '%', tex: 'x_A' },
        xGC: { name: 'GC content', q: 'ratio', unit: '%', value: 41, tex: 'x_{GC}' }
      },
      note: 'Double-stranded DNA only. G and C are each half of the GC content.',
      stories: { xA: 'Human DNA has a GC content of {xGC}. What percentage of its bases are adenine?', xGC: 'A bacterial genome is {xA} adenine. What is its GC content?' }
    },
    {
      name: 'Melting temperature of a short DNA (Wallace rule)',
      expr: 'Tm = 2*nAT + 4*nGC', tex: 'T_m = 2\\,n_{AT} + 4\\,n_{GC}',
      vars: {
        Tm: { name: 'melting temperature', q: false, unit: '°C', tex: 'T_m' },
        nAT: { name: 'number of A and T bases', int: true, value: 7, tex: 'n_{AT}' },
        nGC: { name: 'number of G and C bases', int: true, value: 5, tex: 'n_{GC}' }
      },
      note: 'An empirical rule of thumb for short oligonucleotides (under about 14 bases) in a standard salt solution: each G–C pair adds twice as much as an A–T pair.',
      stories: { Tm: 'A 12-base primer has {nAT} A or T and {nGC} G or C. Estimate its melting temperature.' }
    }
  ],
  examples: [
    {
      title: 'Two metres in a nucleus',
      q: 'A diploid human cell has 6.2 × 10⁹ base pairs. How long is its DNA, and how many times must it be compacted to fit a nucleus 6 µm across?',
      steps: [
        '$L = 6.2\\times10^{9} \\times 0.34\\ \\mathrm{nm} = 2.1\\times10^{9}\\ \\mathrm{nm} = 2.1$ m.',
        'Compaction: $2.1\\ \\mathrm{m}/6\\ \\mathrm{µm} \\approx 3.5\\times10^{5}$ — achieved by wrapping DNA around histones and folding the resulting fibre in loops.'
      ],
      a: 'About 2.1 m, compacted some 350 000-fold.'
    },
    {
      title: 'Chargaff\'s rules at work',
      q: 'Human DNA is 41 % G + C. What are the percentages of the four bases?',
      steps: [
        'G = C = 41/2 = 20.5 %.',
        'A + T = 59 %, so A = T = 29.5 %.',
        'Single-stranded viral genomes such as that of phage φX174 do not obey these rules — there is no partner strand.'
      ],
      a: 'A = T = 29.5 %, G = C = 20.5 %.'
    },
    {
      title: 'How much DNA is in a cell?',
      q: 'Using 618 g/mol per base pair, what is the mass of the DNA in a diploid human cell (6.2 × 10⁹ base pairs)?',
      steps: [
        'Molar mass of the whole genome: $6.2\\times10^{9} \\times 618 = 3.83\\times10^{12}$ g/mol.',
        'Mass of one copy: $3.83\\times10^{12}/6.02\\times10^{23} = 6.4\\times10^{-12}$ g.'
      ],
      a: 'About 6.4 pg (picograms).'
    }
  ],
  quiz: [
    { q: 'Which base pairs are found in DNA?', choices: ['A–G and C–T', 'A–T and G–C', 'A–C and G–T', 'A–U and G–C'], a: 1, why: 'Each pair joins a purine to a pyrimidine with matching hydrogen-bond donors and acceptors: A–T (two bonds) and G–C (three). A–U pairs occur in RNA.' },
    { q: 'The two strands of a DNA double helix run in the same 5′→3′ direction.', a: false, why: 'They are antiparallel: where one strand runs 5′→3′, its partner runs 3′→5′.' },
    { q: 'A sample of double-stranded DNA is 22 % guanine. What percentage is adenine?', answer: 28, unit: '%', why: 'G = C = 22 %, so G + C = 44 % and A + T = 56 %; A = T = 28 %.' },
    { q: 'Why is RNA much less stable than DNA in solution?', choices: ['Uracil is weaker than thymine', 'The 2′-OH group of ribose can attack the neighbouring phosphodiester bond', 'RNA has fewer phosphate groups', 'RNA is always double-stranded'], a: 1, why: 'The extra hydroxyl can cut the backbone from within, especially in alkali — useful for a short-lived message, bad for a permanent archive.' },
    { q: 'Why does DNA move towards the positive electrode in gel electrophoresis?', choices: ['Its bases are positively charged', 'Each phosphate in its backbone carries a negative charge', 'Hydrogen bonds carry charge', 'It is pulled by the buffer flow'], a: 1, why: 'One negative charge per nucleotide gives DNA a nearly constant charge per length, so in a gel it separates by size.' }
  ],
  problems: [
    { q: 'How many base pairs are there in 1.0 µm of B-DNA?', answer: 2941, tol: 0.01, steps: ['$N = L/b = 1000\\ \\mathrm{nm}/0.34\\ \\mathrm{nm} = 2941$ base pairs.'] },
    { q: 'Estimate the melting temperature, in °C, of the primer 5′-ACGTTGCAAGCT-3′ with the Wallace rule.', answer: 36, tol: 0.01, steps: ['Count: A 3, T 3, G 3, C 3, so $n_{AT} = 6$ and $n_{GC} = 6$.', '$T_m = 2 \\times 6 + 4 \\times 6 = 36$ °C.'] }
  ],
  applications: ['DNA profiling in forensics and paternity testing.', 'mRNA vaccines and RNA-based medicines.', 'Designing PCR primers and hybridisation probes with the right melting temperature.', 'Storing digital data in synthetic DNA — a research field, since a gram of DNA can hold hundreds of petabytes.'],
  history: 'Friedrich Miescher isolated "nuclein" from the nuclei of white blood cells in 1869. In 1944 Oswald Avery, Colin MacLeod and Maclyn McCarty showed that DNA carries hereditary information in bacteria. Watson and Crick\'s 1953 model relied on Rosalind Franklin\'s X-ray images; Watson, Crick and Wilkins shared the 1962 Nobel Prize, after Franklin\'s death in 1958. Thomas Cech and Sidney Altman\'s discovery of catalytic RNA won the 1989 Nobel Prize in Chemistry.'
},

/* ================================================================ HOW ENZYMES WORK */
{
  id: 'enzymes', parent: 'enzymes-topic', title: 'How enzymes work', level: 1,
  short: 'Enzymes are biological catalysts, mostly proteins, that speed up reactions millions of times or more by binding the transition state and lowering the activation energy — without changing the equilibrium. Each works best at a particular temperature and pH.',
  keywords: ['enzyme', 'catalyst', 'activation energy', 'transition state', 'active site', 'substrate', 'lock and key', 'induced fit', 'cofactor', 'coenzyme', 'vitamin', 'temperature optimum', 'Q10', 'pH optimum', 'denaturation', 'thermophile', 'enzyme unit', 'katal', 'ribozyme'],
  prereq: ['protein-structure', 'chemistry:catalysis', 'chemistry:arrhenius-equation'],
  related: ['enzyme-kinetics', 'enzyme-inhibition', 'enzyme-regulation', 'atp-energy', 'bioenergetics', 'ph-in-biology', 'pcr', 'chemistry:collision-theory', 'medicine:vitamins-minerals'],
  body: `
Most reactions of life would be hopelessly slow on their own. The phosphate bonds of DNA and the peptide bonds of proteins survive in neutral water for years; in a cell, enzymes make and break them in milliseconds. An **enzyme** is a catalyst — almost always a protein, sometimes an RNA — that speeds up one particular reaction, is not used up, and does not change where the reaction ends up.

### Lowering the barrier
To react, molecules must pass through a **transition state**, an arrangement of higher free energy than either the reactants or the products. The height of that barrier, the free energy of activation $\\Delta G^{\\ddagger}$, sets the rate. An enzyme binds the transition state more tightly than it binds the substrate, which lowers the barrier. Because the rate depends exponentially on the barrier, every 5.9 kJ/mol taken off it at 37 °C multiplies the rate by ten:

$$\\frac{k_{\\text{cat}}}{k_{\\text{uncat}}} = e^{\\,\\Delta\\Delta G^{\\ddagger}/RT}$$

| Reaction | Uncatalysed half-life | Rate enhancement |
|---|---|---|
| $\\ce{CO2 + H2O -> H2CO3}$ (carbonic anhydrase) | about 20 s | about 10⁷ |
| Hydrolysis of a peptide bond (proteases) | years to centuries | about 10⁹–10¹² |
| Decarboxylation of orotidine monophosphate (OMP decarboxylase) | 78 million years | about 10¹⁷ |

An enzyme does **not** change the free-energy difference $\\Delta G$ between reactants and products, and so it cannot shift the equilibrium: it speeds the forward and the reverse reactions by the same factor. It cannot make an unfavourable reaction go — for that, cells couple it to ATP ([[atp-energy]], [[bioenergetics]]).

### How enzymes do it
The **active site** is a pocket or cleft lined by a few side chains — often fewer than ten residues out of hundreds. Emil Fischer's **lock and key** (1894) explained specificity: only a substrate of the right shape fits. Daniel Koshland's **induced fit** (1958) refined it: binding changes the enzyme's shape, closing the site around the substrate and bringing the catalytic groups into place. Hexokinase closes its two lobes around glucose like a jaw, shutting out water so that the phosphate of ATP goes to the sugar instead of being wasted by hydrolysis.

Inside the active site several tricks act together:
- **proximity and orientation** — the reactants are held together at the right angle;
- **transition-state stabilisation** — charges and hydrogen bonds that fit the transition state better than the substrate;
- **acid–base catalysis** — side chains such as histidine hand protons on and off;
- **covalent catalysis** — the substrate is briefly bonded to the enzyme, as to the serine of chymotrypsin;
- **metal ions** — the zinc of carbonic anhydrase turns a water molecule into a reactive hydroxide.

Many enzymes need a partner: a metal ion or an organic **coenzyme**, often made from a vitamin — NAD⁺ from niacin, FAD from riboflavin, coenzyme A from pantothenic acid, thiamine pyrophosphate from vitamin B₁. Because coenzymes are recycled, those vitamins are needed only in milligrams a day ([[medicine:vitamins-minerals]]).

### Temperature
Warming speeds enzyme-catalysed reactions like any other: while the enzyme stays folded, the rate typically doubles or triples for every 10 °C — a **Q₁₀** of 2 to 3. But an enzyme is a folded protein held by weak bonds ([[protein-structure]]). Above a certain temperature it unfolds faster than the rate gains, and activity collapses. The result is a curve with an **optimum**, near 37–45 °C for most human enzymes. The optimum is not a fixed property: the longer the enzyme is kept warm during a measurement, the more of it is lost and the lower the apparent optimum. Enzymes of heat-loving microbes are built to stay folded: Taq polymerase, from a hot-spring bacterium, works best near 75 °C and survives the 95 °C steps of [[pcr]].

### pH
Catalytic groups must carry the right charge — an acid catalyst protonated, a nucleophile deprotonated — so activity against pH is bell-shaped, and each enzyme's optimum suits the place it works:

| Enzyme | Works in | pH optimum |
|---|---|---|
| Pepsin | stomach | about 2 |
| Salivary amylase | mouth | about 6.8 |
| Trypsin | small intestine | about 8 |
| Alkaline phosphatase | bone, gut | about 10 |

### Naming and measuring
Enzymes are sorted into seven classes by the reaction they catalyse — oxidoreductases, transferases, hydrolases, lyases, isomerases, ligases and translocases — and most names end in *-ase*. Their activity is counted in **units**: one unit (U) converts one micromole of substrate per minute; the SI unit, the katal, is one mole per second (1 U = 16.7 nkat). How the rate depends on the amount of substrate — saturation, $K_m$ and $V_{\\max}$ — is the subject of [[enzyme-kinetics]].

> [!key] An enzyme lowers the pass, not the valley floors: it speeds a reaction by binding its transition state, but leaves the energy difference between reactants and products — and the equilibrium — unchanged.
`,
  ideas: [
    'Enzymes lower the activation energy by binding the transition state; 5.9 kJ/mol less barrier means ten times faster at 37 °C.',
    'Rate enhancements range from about a million to 10¹⁷; enzymes do not change ΔG or the equilibrium.',
    'Specificity comes from the shape and chemistry of the active site; induced fit closes it around the substrate.',
    'Activity rises with temperature (Q₁₀ of 2–3) until the enzyme denatures, giving an optimum; activity against pH is bell-shaped.',
    'Many enzymes need metal ions or coenzymes, often made from vitamins.'
  ],
  pitfalls: [
    'Enzymes make reactions more favourable — They change the rate, not ΔG: the equilibrium is the same with or without the enzyme.',
    'Above the optimum temperature the molecules move too fast to bind — Activity falls because the enzyme unfolds and loses its active site; often irreversibly.',
    'The optimum temperature is a fixed property of an enzyme — It depends on how long the enzyme is exposed: longer assays lose more enzyme to denaturation and show a lower optimum.'
  ],
  formulas: [
    {
      name: 'Rate enhancement from lowering the barrier',
      expr: 'r = exp((Gu - Gc)/(R*T))', tex: 'r = \\dfrac{k_{\\text{cat}}}{k_{\\text{uncat}}} = e^{\\,(\\Delta G^{\\ddagger}_{u} - \\Delta G^{\\ddagger}_{c})/RT}',
      vars: {
        r: { name: 'rate enhancement (catalysed ÷ uncatalysed)' },
        Gu: { name: 'activation free energy without the enzyme', q: 'molarenergy', unit: 'kJ/mol', value: 100, tex: '\\Delta G^{\\ddagger}_{u}' },
        Gc: { name: 'activation free energy with the enzyme', q: 'molarenergy', unit: 'kJ/mol', value: 60, tex: '\\Delta G^{\\ddagger}_{c}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 }
      },
      note: 'From transition-state theory: a rate is proportional to e^(−ΔG‡/RT). At 37 °C, each 5.94 kJ/mol taken off the barrier (RT ln 10) is a factor of ten.',
      practice: { unknowns: ['r', 'Gc'] },
      stories: { r: 'Without an enzyme a reaction must climb a barrier of {Gu}; the enzyme lowers it to {Gc}. By what factor is the reaction faster at {T}?', Gc: 'An enzyme speeds a reaction {r}-fold at {T}; the uncatalysed barrier is {Gu}. How high is the barrier with the enzyme?' }
    },
    {
      name: 'The Q₁₀ rule',
      expr: 'v2 = v1*Q10^((T2 - T1)/10)', tex: 'v_2 = v_1\\,Q_{10}^{\\,(T_2 - T_1)/10}',
      vars: {
        v2: { name: 'rate at the second temperature', q: 'reactionrate', unit: 'µM/s', tex: 'v_2' },
        v1: { name: 'rate at the first temperature', q: 'reactionrate', unit: 'µM/s', value: 5, tex: 'v_1' },
        Q10: { name: 'Q₁₀ (factor per 10 °C)', value: 2, tex: 'Q_{10}' },
        T2: { name: 'second temperature', q: 'temperature', unit: '°C', value: 37, tex: 'T_2' },
        T1: { name: 'first temperature', q: 'temperature', unit: '°C', value: 25, tex: 'T_1' }
      },
      note: 'Valid only while the enzyme stays folded. Temperatures in °C or K: only their difference counts.',
      practice: { unknowns: ['v2', 'Q10', 'T2'] },
      stories: {
        v2: 'An enzyme reaction runs at {v1} at {T1}, with a Q₁₀ of {Q10}. How fast does it run at {T2}?',
        Q10: 'A reaction speeds up from {v1} at {T1} to {v2} at {T2}. What is its Q₁₀?',
        T2: 'A reaction runs at {v1} at {T1} and has a Q₁₀ of {Q10}. At what temperature does it reach {v2}?'
      }
    },
    {
      name: 'Q₁₀ from the activation energy',
      expr: 'Q10 = exp(10*Ea/(R*T*(T + 10)))', tex: 'Q_{10} = \\exp\\dfrac{10\\,E_a}{R\\,T\\,(T + 10)}',
      vars: {
        Q10: { name: 'Q₁₀ between T and T + 10 K', tex: 'Q_{10}' },
        Ea: { name: 'activation energy', q: 'molarenergy', unit: 'kJ/mol', value: 50, tex: 'E_a' },
        R: { const: 'R' },
        T: { name: 'lower temperature', q: 'temperature', unit: '°C', value: 25 }
      },
      note: 'From the Arrhenius equation, with T in kelvin (the calculator converts). Typical enzyme reactions have Ea of 30–80 kJ/mol, so Q₁₀ of about 1.5–3.',
      practice: { unknowns: ['Q10', 'Ea'] },
      stories: { Q10: 'An enzyme reaction has an activation energy of {Ea}. What is its Q₁₀ just above {T}?', Ea: 'A reaction has a Q₁₀ of {Q10} just above {T}. What is its activation energy?' }
    },
    {
      name: 'Enzyme activity',
      expr: 'A = n/t', tex: 'A = \\dfrac{n}{t}',
      vars: {
        A: { name: 'enzyme activity', q: 'enzymeactivity', unit: 'U' },
        n: { name: 'amount of substrate converted', q: 'amount', unit: 'µmol', value: 30 },
        t: { name: 'time', q: 'time', unit: 'min', value: 10 }
      },
      note: '1 U = 1 µmol/min = 16.7 nkat. Measured at the start of the reaction, with substrate in excess.',
      stories: { A: 'An enzyme preparation converts {n} of substrate in {t}. What is its activity?', t: 'How long does an enzyme of activity {A} take to convert {n} of substrate?' }
    }
  ],
  examples: [
    {
      title: 'How much must the barrier fall?',
      q: 'OMP decarboxylase speeds its reaction about 10¹⁷-fold at 25 °C. By how much does it lower the activation free energy? What lowering gives a millionfold speed-up at 37 °C?',
      steps: [
        '$RT$ at 25 °C: $8.314 \\times 298.15 = 2479$ J/mol; $\\ln 10^{17} = 39.1$.',
        '$\\Delta\\Delta G^{\\ddagger} = RT \\ln(\\text{ratio}) = 2479 \\times 39.1 = 97$ kJ/mol.',
        'A millionfold at 37 °C: $8.314 \\times 310.15 \\times \\ln 10^{6} = 2579 \\times 13.8 = 35.6$ kJ/mol — six steps of 5.94 kJ/mol.'
      ],
      a: 'About 97 kJ/mol for OMP decarboxylase; about 36 kJ/mol for a millionfold.'
    },
    {
      title: 'A lizard warming in the sun',
      q: 'A lizard\'s muscle enzyme has an activation energy of 50 kJ/mol. What is its Q₁₀ between 25 and 35 °C, and how much faster does it work at 35 °C than at 15 °C?',
      steps: [
        { text: 'Between 25 and 35 °C:', tex: 'Q_{10} = \\exp\\frac{10 \\times 50\\,000}{8.314 \\times 298.15 \\times 308.15} = e^{0.655} = 1.92' },
        'Between 15 and 25 °C the Q₁₀ is a little higher: $\\exp(500\\,000/(8.314 \\times 288.15 \\times 298.15)) = e^{0.700} = 2.01$.',
        'From 15 to 35 °C: $2.01 \\times 1.92 = 3.9$ times faster — which is why an ectotherm basks before it hunts.'
      ],
      a: 'Q₁₀ ≈ 1.9; about four times faster at 35 °C than at 15 °C.'
    }
  ],
  quiz: [
    { q: 'An enzyme speeds up a reaction by…', choices: ['making ΔG of the reaction more negative', 'lowering the activation energy, by binding the transition state tightly', 'heating the active site', 'shifting the equilibrium towards the products'], a: 1, why: 'Catalysis is about the barrier, not the end points: ΔG and the equilibrium are unchanged; both directions are speeded equally.' },
    { q: 'An enzyme changes the equilibrium constant of the reaction it catalyses.', a: false, why: 'K depends only on ΔG°, which the enzyme does not alter. It just gets the reaction to equilibrium faster.' },
    { q: 'At 37 °C an enzyme lowers the barrier by 11.9 kJ/mol. By roughly what factor is the reaction faster?', answer: 100, why: '$e^{11\\,900/2579} = e^{4.61} \\approx 100$: two steps of 5.94 kJ/mol, each a factor of ten.' },
    { q: 'Why does enzyme activity fall sharply above the optimum temperature?', choices: ['The molecules move too fast to bind', 'The enzyme unfolds and loses the shape of its active site', 'The substrate evaporates', 'The equilibrium shifts backwards'], a: 1, why: 'The folded state is only marginally stable; above its melting range the protein unfolds, often irreversibly, faster than the Arrhenius gain in rate.' },
    { q: 'Pepsin digests protein in the stomach. Its pH optimum is about…', choices: ['2', '5', '7.4', '10'], a: 0, why: 'Enzymes are tuned to where they work: pepsin to stomach acid (pH 1.5–3.5), trypsin to the slightly alkaline small intestine.' }
  ],
  problems: [
    { q: 'An enzyme reaction runs at 4.0 µM/s at 20 °C and has a Q₁₀ of 2.2. How fast does it run at 37 °C, assuming the enzyme stays folded?', answer: 15.3, unit: 'µM/s', tol: 0.02, steps: ['$v_2 = 4.0 \\times 2.2^{(37 - 20)/10} = 4.0 \\times 2.2^{1.7}$.', '$2.2^{1.7} = e^{1.7 \\times 0.788} = 3.82$, so $v_2 = 15.3$ µM/s.'] },
    { q: 'An enzyme sample converts 45 µmol of substrate in 3.0 minutes. What is its activity in units (U)?', answer: 15, unit: 'U', tol: 0.01, steps: ['$A = 45\\ \\mathrm{µmol}/3.0\\ \\mathrm{min} = 15$ µmol/min = 15 U (250 nkat).'] }
  ],
  applications: ['Biological washing powders contain proteases, lipases and amylases engineered to work in cool water.', 'Food processing: chymosin (rennet) for cheese, amylases for syrups, lactase for lactose-free milk.', 'Heat-stable polymerases make PCR possible.', 'Enzymes released into the blood by damaged tissue are measured in diagnosis (for example liver enzymes and creatine kinase).'],
  history: 'Wilhelm Kühne coined the word "enzyme" (Greek for "in yeast") in 1877, and Eduard Buchner showed in 1897 that a cell-free extract of yeast could ferment sugar (Nobel Prize 1907). James Sumner crystallised urease in 1926, proving that enzymes are proteins (Nobel Prize 1946). In the 1980s Thomas Cech and Sidney Altman found that some RNAs are enzymes too.',
  sim: 'chem-optimum'
},

/* ================================================================ ENZYME INHIBITION */
{
  id: 'enzyme-inhibition', parent: 'enzymes-topic', title: 'Enzyme inhibition', level: 2,
  short: 'Inhibitors slow enzymes. Competitive ones fill the active site and raise the apparent Km; non-competitive ones bind elsewhere and lower Vmax; uncompetitive ones bind only the enzyme–substrate complex; irreversible ones destroy the enzyme. Many medicines and poisons work this way.',
  keywords: ['enzyme inhibition', 'inhibitor', 'competitive', 'non-competitive', 'uncompetitive', 'mixed inhibition', 'irreversible inhibitor', 'suicide inhibitor', 'Ki', 'inhibition constant', 'IC50', 'Cheng–Prusoff', 'Lineweaver–Burk', 'double reciprocal plot', 'transition-state analogue', 'statin', 'aspirin', 'penicillin', 'drug target'],
  prereq: ['enzyme-kinetics', 'enzymes', 'chemistry:equilibrium-constant'],
  related: ['enzyme-regulation', 'antibiotic-resistance', 'medicine:how-drugs-work', 'medicine:antibiotics', 'medicine:dose-response', 'medicine:poisoning-overdose'],
  body: `
An **inhibitor** is a molecule that slows an enzyme. Cells use inhibitors to control their own metabolism, many poisons act by blocking vital enzymes, and a large share of all medicines are enzyme inhibitors — statins, ACE inhibitors, aspirin, penicillin, most antivirals. How an inhibitor binds decides how it changes the kinetics, and that can be read from a few rate measurements ([[enzyme-kinetics]]).

### Reversible inhibitors
A reversible inhibitor binds by weak bonds and comes off again. Its strength is its **inhibition constant** $K_i$ — the dissociation constant of the enzyme–inhibitor complex, so the smaller, the tighter. Where it binds sets the pattern.

**Competitive.** The inhibitor resembles the substrate and sits in the active site, so substrate and inhibitor cannot both be bound. At high substrate the substrate wins: $V_{\\max}$ is unchanged, but it takes more substrate to reach half of it. The apparent $K_m$ is multiplied by $\\alpha = 1 + [\\mathrm{I}]/K_i$:

$$v = \\frac{V_{\\max}[\\mathrm{S}]}{\\alpha K_m + [\\mathrm{S}]}$$

**Uncompetitive.** The inhibitor binds only to the enzyme–substrate complex and locks the substrate in. Both $V_{\\max}$ and $K_m$ are divided by the same factor $\\alpha_u = 1 + [\\mathrm{I}]/K_{iu}$. It is rare with one substrate; lithium's inhibition of inositol monophosphatase is the classic case.

**Non-competitive (pure).** The inhibitor binds somewhere else, equally well to the free enzyme and to the complex, and switches the enzyme off whether substrate is bound or not. In effect it removes working enzyme: $V_{\\max}$ is divided by $\\alpha$ and $K_m$ is unchanged. **Mixed** inhibition, far more common, is the general case in which the two affinities differ.

### Telling them apart
The Lineweaver–Burk plot of $1/v$ against $1/[\\mathrm{S}]$ turns each hyperbola into a straight line of slope $K_m/V_{\\max}$ and intercept $1/V_{\\max}$. Measured at a few inhibitor concentrations, the family of lines gives the type away:

| Type | Binds | Apparent $K_m$ | Apparent $V_{\\max}$ | Lineweaver–Burk lines |
|---|---|---|---|---|
| Competitive | E only | × α | unchanged | meet on the $1/v$ axis |
| Uncompetitive | ES only | ÷ α_u | ÷ α_u | parallel |
| Non-competitive | E and ES equally | unchanged | ÷ α | meet on the $1/[\\mathrm{S}]$ axis |
| Mixed | E and ES unequally | changed | lowered | meet away from both axes |

### Irreversible inhibitors
Some inhibitors bond covalently to the enzyme and destroy it for good; only newly made enzyme restores activity. Aspirin transfers an acetyl group to a serine in the active site of cyclo-oxygenase. Platelets have no nucleus and cannot make new enzyme, so a single dose affects them for the rest of their lives — about ten days. Penicillin acylates the serine of the bacterial enzymes that cross-link the cell wall, and organophosphate insecticides irreversibly block acetylcholinesterase. **Suicide inhibitors** are processed like a substrate until they become a reactive group inside the active site: clavulanic acid, given with amoxicillin, disables the β-lactamases with which resistant bacteria destroy penicillins ([[antibiotic-resistance]]).

### Drugs as inhibitors
A good drug binds its target far more tightly than the natural substrate does. Statins inhibit HMG-CoA reductase, the key enzyme of cholesterol synthesis, with $K_i$ of a few nanomolar, whereas the enzyme's $K_m$ for its substrate is a few micromolar. **Transition-state analogues** bind best of all, because enzymes bind the transition state most tightly ([[enzymes]]); many HIV protease inhibitors were designed this way. Sulfonamide antibiotics mimic p-aminobenzoic acid, which bacteria need to make folate.

For a competitive inhibitor, the concentration that halves the rate — the **IC₅₀** — depends on the substrate present (the Cheng–Prusoff relation):

$$\\mathrm{IC}_{50} = K_i\\left(1 + \\frac{[\\mathrm{S}]}{K_m}\\right)$$

so the same drug seems weaker where substrate is plentiful. Competition is also used against poisons: in methanol poisoning, fomepizole (formerly ethanol) occupies alcohol dehydrogenase, so that methanol is excreted instead of being turned into toxic formic acid.

> [!warn] Methanol, antifreeze (ethylene glycol) and organophosphate pesticides are poisons whose damage runs through enzymes. If someone may have swallowed or been exposed to one, call your local emergency number or poison centre at once, even if they seem well.

> [!key] Where an inhibitor binds decides what it does: in the active site it raises $K_m$ and can be outcompeted by substrate; elsewhere it lowers $V_{\\max}$ and cannot. Irreversible inhibitors remove enzyme altogether.
`,
  ideas: [
    'Competitive inhibitors bind the active site: apparent Km × (1 + [I]/Ki), Vmax unchanged; high substrate overcomes them.',
    'Non-competitive inhibitors bind elsewhere: Vmax ÷ (1 + [I]/Ki), Km unchanged; uncompetitive ones bind only ES and lower both.',
    'Lineweaver–Burk lines meet on the 1/v axis (competitive), on the 1/[S] axis (non-competitive) or are parallel (uncompetitive).',
    'Irreversible and suicide inhibitors bond covalently; only new enzyme restores activity.',
    'Many drugs are inhibitors; their IC₅₀ depends on the substrate concentration (Cheng–Prusoff).'
  ],
  pitfalls: [
    'Any inhibitor can be overcome by adding more substrate — Only a competitive one. Non-competitive and irreversible inhibitors lower Vmax, which no amount of substrate restores.',
    'The IC₅₀ of a drug is the same as its Ki — For a competitive inhibitor IC₅₀ = Ki(1 + [S]/Km), larger than Ki whenever substrate is present; IC₅₀ values measured under different conditions cannot be compared directly.',
    'A non-competitive inhibitor changes the enzyme\'s affinity for substrate — Pure non-competitive inhibition leaves Km unchanged; it reduces the number of working enzyme molecules.'
  ],
  formulas: [
    {
      name: 'Rate with a competitive inhibitor',
      expr: 'v = Vmax*S/(Km*(1 + I/Ki) + S)', tex: 'v = \\dfrac{V_{\\max}\\,\\mathrm{[S]}}{K_m\\left(1 + \\mathrm{[I]}/K_i\\right) + \\mathrm{[S]}}',
      vars: {
        v: { name: 'initial rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_{\\max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 2, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 1, tex: 'K_m' },
        I: { name: 'inhibitor concentration', q: 'concentration', unit: 'µM', value: 5, tex: '\\mathrm{[I]}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'µM', value: 2, tex: 'K_i' }
      },
      note: 'The apparent Km is Km(1 + [I]/Ki); Vmax is unchanged.',
      practice: { unknowns: ['v', 'I', 'Ki'] },
      stories: {
        v: 'An enzyme (Vmax {Vmax}, Km {Km}) works on {S} of substrate in the presence of {I} of a competitive inhibitor with Ki = {Ki}. How fast does it work?',
        I: 'How much competitive inhibitor (Ki = {Ki}) brings an enzyme with Vmax {Vmax} and Km {Km} down to {v} at {S} of substrate?',
        Ki: 'With {I} of a competitive inhibitor, an enzyme (Vmax {Vmax}, Km {Km}) runs at {v} on {S} of substrate. What is the Ki?'
      }
    },
    {
      name: 'Rate with a non-competitive inhibitor',
      expr: 'v = Vmax*S/((Km + S)*(1 + I/Ki))', tex: 'v = \\dfrac{V_{\\max}\\,\\mathrm{[S]}}{\\left(K_m + \\mathrm{[S]}\\right)\\left(1 + \\mathrm{[I]}/K_i\\right)}',
      vars: {
        v: { name: 'initial rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_{\\max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 2, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 1, tex: 'K_m' },
        I: { name: 'inhibitor concentration', q: 'concentration', unit: 'µM', value: 5, tex: '\\mathrm{[I]}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'µM', value: 2, tex: 'K_i' }
      },
      note: 'Pure non-competitive inhibition: the inhibitor binds E and ES equally. The apparent Vmax is Vmax/(1 + [I]/Ki); Km is unchanged.',
      practice: { unknowns: ['v', 'I'] },
      stories: { v: 'A non-competitive inhibitor (Ki {Ki}) is present at {I}. How fast does an enzyme with Vmax {Vmax} and Km {Km} work on {S} of substrate?', I: 'What concentration of a non-competitive inhibitor (Ki {Ki}) slows an enzyme (Vmax {Vmax}, Km {Km}) to {v} at {S} of substrate?' }
    },
    {
      name: 'Rate with an uncompetitive inhibitor',
      expr: 'v = Vmax*S/(Km + S*(1 + I/Kiu))', tex: 'v = \\dfrac{V_{\\max}\\,\\mathrm{[S]}}{K_m + \\mathrm{[S]}\\left(1 + \\mathrm{[I]}/K_{iu}\\right)}',
      vars: {
        v: { name: 'initial rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_{\\max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 2, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'mM', value: 1, tex: 'K_m' },
        I: { name: 'inhibitor concentration', q: 'concentration', unit: 'µM', value: 5, tex: '\\mathrm{[I]}' },
        Kiu: { name: 'inhibition constant for the ES complex', q: 'concentration', unit: 'µM', value: 2, tex: 'K_{iu}' }
      },
      note: 'The inhibitor binds only ES. Km and Vmax are both divided by 1 + [I]/K_iu, so their ratio — the slope of a Lineweaver–Burk line — is unchanged.',
      practice: { unknowns: ['v', 'I'] },
      stories: { v: 'An uncompetitive inhibitor (K_iu = {Kiu}) is present at {I}. How fast does an enzyme with Vmax {Vmax} and Km {Km} work on {S} of substrate?' }
    },
    {
      name: 'IC₅₀ of a competitive inhibitor (Cheng–Prusoff)',
      expr: 'IC50 = Ki*(1 + S/Km)', tex: '\\mathrm{IC}_{50} = K_i\\left(1 + \\dfrac{\\mathrm{[S]}}{K_m}\\right)',
      vars: {
        IC50: { name: 'inhibitor concentration that halves the rate', q: 'concentration', unit: 'nM', tex: '\\mathrm{IC}_{50}' },
        Ki: { name: 'inhibition constant', q: 'concentration', unit: 'nM', value: 2, tex: 'K_i' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'µM', value: 20, tex: '\\mathrm{[S]}' },
        Km: { name: 'Michaelis constant', q: 'concentration', unit: 'µM', value: 4, tex: 'K_m' }
      },
      note: 'Assumes the inhibitor is in excess over the enzyme (no depletion by binding).',
      practice: { unknowns: ['IC50', 'Ki'] },
      stories: { IC50: 'A drug inhibits its enzyme competitively with Ki = {Ki}. The substrate is at {S} and the Km is {Km}. What concentration of drug halves the rate?', Ki: 'A competitive inhibitor has an IC₅₀ of {IC50} measured with {S} of substrate (Km {Km}). What is its Ki?' }
    }
  ],
  examples: [
    {
      title: 'Identifying an inhibitor',
      q: 'An enzyme has Km = 1.0 mM and Vmax = 10 µM/s. With 6 µM of an inhibitor, a fit of the rates gives an apparent Km of 4.0 mM and a Vmax of 10 µM/s. What kind of inhibitor is it, and what is its Ki?',
      steps: [
        'Vmax is unchanged and Km has risen: a competitive inhibitor.',
        '$\\alpha = K_{m,\\text{app}}/K_m = 4.0$, so $1 + [\\mathrm{I}]/K_i = 4$ and $[\\mathrm{I}]/K_i = 3$.',
        '$K_i = 6/3 = 2$ µM.'
      ],
      a: 'Competitive, with Ki = 2 µM.'
    },
    {
      title: 'Why substrate rescues only one kind',
      q: 'An enzyme works at [S] = 10 Km. An inhibitor is added at twice its Ki (α = 3). What fraction of the uninhibited rate remains if it is competitive, and if it is non-competitive?',
      steps: [
        'Uninhibited: $v/V_{\\max} = 10/(1 + 10) = 0.909$.',
        'Competitive: $10/(3 + 10) = 0.769$ — 85 % of the uninhibited rate.',
        'Non-competitive: $0.909/3 = 0.303$ — 33 % of it.',
        'At high substrate a competitive inhibitor loses its grip; a non-competitive one does not.'
      ],
      a: 'About 85 % remains with a competitive inhibitor, 33 % with a non-competitive one.'
    },
    {
      title: 'A statin at work',
      q: 'A statin inhibits HMG-CoA reductase competitively with Ki = 2 nM. In the liver cell HMG-CoA is about 20 µM and the enzyme\'s Km is 4 µM. What concentration of drug halves the enzyme\'s rate?',
      steps: [
        '$\\mathrm{IC}_{50} = K_i(1 + [\\mathrm{S}]/K_m) = 2 \\times (1 + 20/4) = 12$ nM.',
        'The drug is six times less potent in the cell than its Ki suggests — but at nanomolar levels it still wins against micromolar substrate.'
      ],
      a: 'About 12 nM.'
    }
  ],
  quiz: [
    { q: 'A competitive inhibitor…', choices: ['lowers Vmax but leaves Km unchanged', 'raises the apparent Km but leaves Vmax unchanged', 'divides both Km and Vmax by the same factor', 'destroys the enzyme permanently'], a: 1, why: 'It competes for the active site, so at very high substrate the enzyme still reaches Vmax — but needs more substrate to get there.' },
    { q: 'On a Lineweaver–Burk plot, the lines for different concentrations of an uncompetitive inhibitor are…', choices: ['parallel', 'meeting on the 1/v axis', 'meeting on the 1/[S] axis', 'all the same line'], a: 0, why: 'Km and Vmax are divided by the same factor, so the slope Km/Vmax is unchanged while the intercept 1/Vmax rises.' },
    { q: 'A competitive inhibitor with Ki = 2 µM is present at 8 µM. By what factor is the apparent Km multiplied?', answer: 5, why: '$\\alpha = 1 + 8/2 = 5$.' },
    { q: 'Adding much more substrate overcomes a non-competitive inhibitor.', a: false, why: 'A non-competitive inhibitor switches off enzyme whether substrate is bound or not, lowering Vmax; extra substrate cannot restore it.' },
    { q: 'Why does a single dose of aspirin affect platelets for about ten days?', choices: ['Aspirin stays in the blood for ten days', 'It inhibits cyclo-oxygenase irreversibly, and platelets, having no nucleus, cannot make new enzyme', 'Platelets store aspirin', 'Aspirin blocks the bone marrow'], a: 1, why: 'Irreversible inhibition lasts as long as the enzyme molecule; platelets cannot replace it, so the effect lasts until new platelets are made.' }
  ],
  problems: [
    { q: 'An enzyme has Km = 0.5 mM and Vmax = 20 µM/s. With 1 mM substrate and a competitive inhibitor at a concentration equal to its Ki, what is the rate?', answer: 10, unit: 'µM/s', tol: 0.01, steps: ['$\\alpha = 1 + 1 = 2$.', '$v = 20 \\times 1/(2 \\times 0.5 + 1) = 10$ µM/s (without inhibitor: 13.3 µM/s).'] },
    { q: 'A competitive inhibitor has an IC₅₀ of 30 nM measured with the substrate at twice its Km. What is its Ki?', answer: 10, unit: 'nM', tol: 0.01, steps: ['$K_i = \\mathrm{IC}_{50}/(1 + [\\mathrm{S}]/K_m) = 30/3 = 10$ nM.'] }
  ],
  applications: [
    'Compare competitive, uncompetitive and mixed inhibition in [the enzyme calculator](#/tools/cell/enzyme).','Medicines: statins (cholesterol), ACE inhibitors (blood pressure), HIV protease inhibitors, kinase inhibitors in cancer, aspirin.', 'Antibiotics that block bacterial enzymes (penicillins, sulfonamides) — and β-lactamase inhibitors that protect them.', 'Pesticides and herbicides: glyphosate blocks a plant enzyme of amino-acid synthesis that animals do not have.', 'Treating poisoning by competition for an enzyme (methanol and fomepizole).'],
  history: 'Hans Lineweaver and Dean Burk published their double-reciprocal plot in 1934. In the 1970s Akira Endo found the first statin in a fungus, and Miguel Ondetti and David Cushman designed captopril, the first ACE inhibitor, starting from peptides in the venom of a Brazilian pit viper. Yung-Chi Cheng and William Prusoff related IC₅₀ to Ki in 1973.',
  sim: 'chem-inhibition'
},

/* ================================================================ ENZYME REGULATION */
{
  id: 'enzyme-regulation', parent: 'enzymes-topic', title: 'Allosteric regulation and feedback', level: 3,
  short: 'Cells tune their enzymes to demand. Allosteric enzymes change shape when effectors bind away from the active site and often respond to substrate with a sharp, sigmoid curve (the Hill equation); end products switch off the first step of their own pathway; phosphorylation and cutting switch enzymes on and off.',
  keywords: ['allosteric', 'allostery', 'effector', 'cooperativity', 'sigmoid', 'Hill equation', 'Hill coefficient', 'T state', 'R state', 'MWC model', 'feedback inhibition', 'end-product inhibition', 'phosphofructokinase', 'aspartate transcarbamoylase', 'phosphorylation', 'kinase', 'phosphatase', 'zymogen', 'ultrasensitivity'],
  prereq: ['enzyme-kinetics', 'enzyme-inhibition', 'protein-structure'],
  related: ['glycolysis', 'metabolism-overview', 'cell-signalling', 'lac-operon', 'animal-homeostasis', 'medicine:oxygen-transport', 'medicine:hormone-feedback'],
  body: `
A cell's metabolism is thousands of enzymes working at once, and it must follow changing demand: a muscle at rest and a sprinting muscle use ATP at rates a hundred times apart. Cells adjust the **activity** of enzymes they already have within milliseconds to minutes, and the **amount** of enzyme over minutes to hours.

| Mechanism | How fast | Example |
|---|---|---|
| Supply of substrate ([[enzyme-kinetics]]) | instant | liver glucokinase follows blood glucose |
| Allosteric effectors | milliseconds | ATP and AMP acting on phosphofructokinase |
| Covalent modification (phosphorylation) | seconds to minutes | glycogen phosphorylase switched on by adrenaline |
| Cutting an inactive precursor | seconds; irreversible | trypsinogen → trypsin; blood clotting |
| Making or destroying enzyme | minutes to hours | the [[lac-operon]]; hormones changing gene expression |

### Allosteric enzymes
An **allosteric** enzyme ("other shape") has, besides its active site, a regulatory site where an **effector** binds and changes the enzyme's shape and activity. Most are built of several subunits that switch together between a low-activity **T** (tense) state and a high-activity **R** (relaxed) state — the model of Jacques Monod, Jeffries Wyman and Jean-Pierre Changeux (1965). Substrate binding to one subunit tips the others towards R, so the enzyme becomes more active as substrate accumulates: the rate rises along a **sigmoid** curve instead of a hyperbola. Activators push towards R, inhibitors towards T.

The **Hill equation** describes a sigmoid response:

$$v = \\frac{V_{\\max}[\\mathrm{S}]^{n}}{K_{0.5}^{\\,n} + [\\mathrm{S}]^{n}}$$

$K_{0.5}$ is the substrate concentration for half the maximum rate and $n$, the **Hill coefficient**, measures the cooperativity: $n = 1$ gives back the Michaelis–Menten hyperbola, and haemoglobin, the model of cooperative binding, has $n \\approx 2.8$ ([[medicine:oxygen-transport]]). The Hill coefficient is at most the number of binding sites, and usually well below it.

### A switch rather than a dial
Cooperativity makes a response sharp. To go from 10 % to 90 % of the maximum, an ordinary enzyme needs 81 times more substrate; a cooperative one needs only $81^{1/n}$ times — about 4.8 for $n = 2.8$, and 3 for $n = 4$. Haemoglobin exploits it: 97 % saturated in the lungs (100 mmHg of oxygen), it gives up about a quarter of its oxygen in resting tissue (40 mmHg) and two thirds in working muscle (20 mmHg). A hyperbolic protein with the same half-saturation pressure would load only 79 % in the lungs and deliver barely half as much to the muscle.

### Feedback inhibition
In a pathway $A \\to B \\to C \\to D$, the end product D often inhibits the first enzyme committed to making it. When D accumulates, the pathway slows; when D is used, it speeds up again. Supply follows demand, and intermediates do not pile up. Edwin Umbarger found the first example in 1956: isoleucine inhibits threonine deaminase, the first of five steps from threonine to isoleucine in *E. coli*. In 1962 John Gerhart and Arthur Pardee showed that aspartate transcarbamoylase, the first enzyme of pyrimidine synthesis, is inhibited by the end product CTP and activated by ATP — a sign that purines, the partners of pyrimidines in DNA, are plentiful. Branched pathways use several end products, each inhibiting the first step of its own branch.

In energy metabolism the key example is **phosphofructokinase-1**, the pacemaker of [[glycolysis]]: ATP and citrate, signals of plenty, inhibit it; AMP and fructose 2,6-bisphosphate, signals of need, activate it.

### Switching with phosphate
A **kinase** attaches a phosphate to a serine, threonine or tyrosine, and a **phosphatase** removes it; the new negative charges reshape the protein. The human genome codes for about 500 protein kinases, and a large share of all proteins are phosphorylated at some time. Edmond Fischer and Edwin Krebs discovered the principle in glycogen phosphorylase, which adrenaline switches on through a cascade of kinases. Each activated enzyme activates many copies of the next, so a cascade is an amplifier ([[cell-signalling]]).

### Cutting to switch on
Digestive proteases are made as inactive **zymogens**, so that they cannot digest the cells that make them. Trypsinogen is activated in the gut when enteropeptidase cuts six amino acids from its end, and trypsin then activates the other zymogens. Blood clotting is a cascade of such cuts that turns a small signal into a clot within minutes.

> [!key] Enzymes are regulated by what binds them (substrates and allosteric effectors, in milliseconds), by what is attached to them (phosphate, in seconds), by being cut (zymogens) and by how many are made (hours). Cooperativity turns a dial into a switch; feedback makes supply follow demand.
`,
  ideas: [
    'Allosteric effectors bind away from the active site and shift the enzyme between a less active T state and a more active R state.',
    'Cooperative enzymes respond to substrate along a sigmoid curve (Hill equation, coefficient n > 1).',
    'Going from 10 % to 90 % of maximum takes an 81-fold rise in substrate for n = 1 but only 81^(1/n) for n > 1: a switch-like response.',
    'In feedback inhibition the end product inhibits the first committed step, so supply follows demand.',
    'Phosphorylation, zymogen cleavage and changes in the amount of enzyme regulate over seconds to hours.'
  ],
  pitfalls: [
    'Allosteric inhibitors are competitive inhibitors — They bind at a separate regulatory site and act by changing the enzyme\'s shape, not by blocking the active site.',
    'The Hill coefficient counts the binding sites — It measures cooperativity and is at most the number of sites: haemoglobin has four sites but n ≈ 2.8.',
    'Feedback inhibition acts on the last enzyme of a pathway — It usually acts on the first committed step, so that no intermediates are made and wasted.'
  ],
  formulas: [
    {
      name: 'The Hill equation',
      expr: 'v = Vmax*S^n/(K^n + S^n)', tex: 'v = \\dfrac{V_{\\max}\\,\\mathrm{[S]}^{n}}{K_{0.5}^{\\,n} + \\mathrm{[S]}^{n}}',
      vars: {
        v: { name: 'rate', q: 'reactionrate', unit: 'µM/s' },
        Vmax: { name: 'maximum rate', q: 'reactionrate', unit: 'µM/s', value: 10, tex: 'V_{\\max}' },
        S: { name: 'substrate concentration', q: 'concentration', unit: 'mM', value: 1.5, tex: '\\mathrm{[S]}' },
        K: { name: 'substrate concentration for half the maximum rate', q: 'concentration', unit: 'mM', value: 1, tex: 'K_{0.5}' },
        n: { name: 'Hill coefficient', value: 2.8, min: 0.2, max: 12 }
      },
      note: 'Empirical, but it fits most cooperative enzymes and binding proteins; n = 1 is Michaelis–Menten.',
      practice: { unknowns: ['v', 'S'] },
      stories: { v: 'An allosteric enzyme (Vmax {Vmax}, K₀.₅ {K}, Hill coefficient {n}) is given {S} of substrate. How fast does it work?', S: 'What substrate concentration makes an allosteric enzyme (Vmax {Vmax}, K₀.₅ {K}, n = {n}) run at {v}?' }
    },
    {
      name: 'How sharp is the switch?',
      expr: 'R = 81^(1/n)', tex: 'R = \\dfrac{\\mathrm{[S]}_{90}}{\\mathrm{[S]}_{10}} = 81^{1/n}',
      vars: {
        R: { name: 'rise in substrate needed to go from 10 % to 90 % of the maximum' },
        n: { name: 'Hill coefficient', value: 2.8, min: 0.2, max: 12 }
      },
      note: 'From the Hill equation: [S]₉₀ = 9^(1/n) K₀.₅ and [S]₁₀ = 9^(−1/n) K₀.₅.',
      stories: { R: 'By what factor must the substrate rise to take an enzyme with Hill coefficient {n} from 10 % to 90 % of its maximum rate?', n: 'An enzyme goes from 10 % to 90 % of its maximum when the substrate rises {R}-fold. What is its Hill coefficient?' }
    },
    {
      name: 'Oxygen saturation of haemoglobin',
      expr: 'Y = P^n/(P50^n + P^n)', tex: 'Y = \\dfrac{P_{\\ce{O2}}^{\\,n}}{P_{50}^{\\,n} + P_{\\ce{O2}}^{\\,n}}',
      vars: {
        Y: { name: 'fraction of haem sites carrying oxygen', q: 'ratio', unit: '%' },
        P: { name: 'partial pressure of oxygen', q: 'pressure', unit: 'mmHg', value: 40, tex: 'P_{\\ce{O2}}' },
        P50: { name: 'pressure for half saturation', q: 'pressure', unit: 'mmHg', value: 26.8, tex: 'P_{50}' },
        n: { name: 'Hill coefficient', value: 2.7, min: 0.2, max: 4 }
      },
      note: 'A good fit between about 20 and 100 mmHg (adult haemoglobin, pH 7.4, 37 °C: P₅₀ ≈ 26.8 mmHg, n ≈ 2.7). Myoglobin: P₅₀ ≈ 2.8 mmHg, n = 1.',
      practice: { unknowns: ['Y', 'P'] },
      stories: { Y: 'Blood leaves a tissue with an oxygen pressure of {P}. How saturated is its haemoglobin (P₅₀ {P50}, n = {n})?', P: 'At what oxygen pressure is haemoglobin (P₅₀ {P50}, n = {n}) {Y} saturated?' }
    }
  ],
  examples: [
    {
      title: 'From dial to switch',
      q: 'By what factor must the substrate rise to take an enzyme from 10 % to 90 % of its maximum rate if its Hill coefficient is 1, 2.8 or 4?',
      steps: [
        '$n = 1$: $81^{1} = 81$.',
        '$n = 2.8$: $81^{1/2.8} = e^{4.394/2.8} = e^{1.57} = 4.8$.',
        '$n = 4$: $81^{1/4} = 3$.'
      ],
      a: '81-fold, 4.8-fold and 3-fold.'
    },
    {
      title: 'Why haemoglobin is cooperative',
      q: 'Compare haemoglobin (P₅₀ = 26.8 mmHg, n = 2.7) with a hyperbolic carrier of the same P₅₀ (n = 1). How much of its oxygen does each deliver between the lungs (100 mmHg) and working muscle (20 mmHg)?',
      steps: [
        'Haemoglobin: $Y(100) = 35.0/36.0 = 97.2\\ \\%$; $Y(20) = 0.454/1.454 = 31.2\\ \\%$. Delivered: 66 % of its capacity.',
        'Hyperbolic carrier: $Y(100) = 100/126.8 = 78.9\\ \\%$; $Y(20) = 20/46.8 = 42.7\\ \\%$. Delivered: 36 %.',
        'Cooperativity lets the same protein load almost fully in the lungs and unload deeply in the tissues.'
      ],
      a: 'Haemoglobin delivers about 66 % of its capacity, the hyperbolic carrier only about 36 %.'
    }
  ],
  quiz: [
    { q: 'For an allosteric enzyme with cooperative subunits, a plot of rate against substrate concentration is usually…', choices: ['a hyperbola', 'sigmoid (S-shaped)', 'a straight line', 'bell-shaped'], a: 1, why: 'Binding at one subunit makes the others more active, so the rate rises slowly at first, then steeply, then levels off.' },
    { q: 'In feedback inhibition, the end product of a pathway usually inhibits…', choices: ['the last enzyme of the pathway', 'the first committed enzyme', 'every enzyme equally', 'the enzyme that consumes it'], a: 1, why: 'Stopping the first committed step shuts the whole pathway without letting intermediates build up.' },
    { q: 'An enzyme has a Hill coefficient of 4. By what factor must [S] rise to take it from 10 % to 90 % of its maximum rate?', answer: 3, why: '$81^{1/4} = 3$.' },
    { q: 'A Hill coefficient of 1 means the enzyme shows ordinary Michaelis–Menten kinetics.', a: true, why: 'With n = 1 the Hill equation is exactly the Michaelis–Menten equation, with K₀.₅ = Km.' },
    { q: 'Why are digestive proteases made as inactive zymogens?', choices: ['To save energy', 'So that they do not digest the cells that make them before they reach the gut', 'Because active enzymes cannot be secreted', 'So that the liver can check them'], a: 1, why: 'They are activated only in the gut, by cutting; premature activation damages the pancreas.' }
  ],
  problems: [
    { q: 'What is the oxygen saturation of haemoglobin (P₅₀ = 26.8 mmHg, n = 2.7) at 60 mmHg?', answer: 89.8, unit: '%', tol: 0.01, steps: ['$(60/26.8)^{2.7} = 2.239^{2.7} = e^{2.7 \\times 0.806} = 8.81$.', '$Y = 8.81/9.81 = 0.898$, about 90 %.'] },
    { q: 'An allosteric enzyme has Vmax = 50 µM/s, K₀.₅ = 2 mM and n = 2. How fast does it work at 1 mM substrate?', answer: 10, unit: 'µM/s', tol: 0.01, steps: ['$v = 50 \\times 1^2/(2^2 + 1^2) = 50/5 = 10$ µM/s — a hyperbolic enzyme with Km = 2 mM would give 16.7 µM/s.'] }
  ],
  applications: ['Kinase inhibitors in cancer treatment, such as imatinib in chronic myeloid leukaemia.', 'Industrial microbes engineered to lack feedback inhibition overproduce amino acids such as lysine and glutamate.', 'Haemoglobin\'s cooperativity and its shifts with pH, CO₂ and altitude.', 'Anticoagulant medicines act on the enzymes of the clotting cascade.'],
  history: 'Archibald Hill wrote his equation in 1910 to describe oxygen binding by haemoglobin. Umbarger (1956) and Gerhart and Pardee (1962) discovered feedback inhibition; Monod, Changeux and François Jacob introduced the word "allosteric" in 1963, and the MWC model followed in 1965, with Daniel Koshland\'s sequential model in 1966. Edmond Fischer and Edwin Krebs found regulation by phosphorylation in the 1950s (Nobel Prize 1992).',
  sim: 'chem-feedback'
},

/* ================================================================ ATP */
{
  id: 'atp-energy', parent: 'enzymes-topic', title: 'ATP and energy coupling', level: 2,
  short: 'ATP is the energy currency of every cell. Its hydrolysis to ADP and phosphate releases 30.5 kJ/mol under standard conditions and about 50 kJ/mol in a living cell, and enzymes couple that release to uphill reactions, pumps and movement through shared phosphorylated intermediates.',
  keywords: ['ATP', 'adenosine triphosphate', 'ADP', 'AMP', 'phosphate', 'hydrolysis', 'energy currency', 'energy coupling', 'coupled reactions', 'phosphorylated intermediate', 'phosphocreatine', 'phosphoryl transfer potential', 'sodium–potassium pump', 'ATP turnover', 'glutamine synthetase', 'high-energy phosphate'],
  prereq: ['enzymes', 'chemistry:gibbs-energy', 'nucleic-acids'],
  related: ['bioenergetics', 'glycolysis', 'oxidative-phosphorylation', 'active-transport', 'muscles-movement', 'photosynthesis', 'medicine:metabolism-energy'],
  body: `
Every cell runs on the same small molecule. **Adenosine triphosphate** — adenine, the sugar ribose and a chain of three phosphate groups — carries energy from the processes that release it (the breakdown of food, the capture of light) to those that need it: building molecules, pumping ions, contracting muscle, copying DNA. It is a currency rather than a savings account, spent and re-earned within seconds.

### Where the energy comes from
Splitting off the last phosphate by hydrolysis is strongly downhill:

$$\\ce{ATP + H2O -> ADP + P_i}\\qquad \\Delta G\'^{\\circ} = -30.5\\ \\mathrm{kJ/mol}\\ (-7.3\\ \\mathrm{kcal/mol})$$

There is no special energy locked "in the bond" — breaking any bond costs energy. The free energy comes from the difference between the two sides: the four negative charges crowded on ATP repel one another, while the products are separated, better stabilised by resonance and better hydrated. Removing two phosphates at once, $\\ce{ATP -> AMP + PP_i}$, releases 45.6 kJ/mol, and the pyrophosphate is then hydrolysed as well; cells use this route for reactions that must never run backwards, such as adding nucleotides to DNA.

### In a cell it is worth more
The standard value assumes 1 mol/L of everything. A living cell keeps ATP high and ADP and phosphate low — far from equilibrium — so each hydrolysis releases much more:

$$\\Delta G = \\Delta G\'^{\\circ} + RT\\ln\\frac{[\\mathrm{ADP}][\\mathrm{P_i}]}{[\\mathrm{ATP}]}$$

In a red blood cell, with 2.25 mM ATP, 0.25 mM ADP and 1.65 mM phosphate, ΔG is about −52 kJ/mol; in muscle and liver cells it is −50 to −65 kJ/mol. The higher the cell holds the ratio of ATP to ADP, the more work each ATP can do — the ratio is like the voltage of a battery ([[bioenergetics]]).

### Coupling: paying for uphill reactions
A reaction with a positive ΔG cannot go on its own. But free energies add, so an uphill reaction can be driven by joining it to ATP hydrolysis — not by running the two side by side, but through a **shared intermediate**. Glutamine synthetase first transfers a phosphate from ATP to glutamate, making a reactive glutamyl phosphate, which ammonia then attacks:

| Step | ΔG′° (kJ/mol) |
|---|---|
| glutamate + NH₄⁺ → glutamine + H₂O (on its own) | +14.2 |
| ATP + H₂O → ADP + Pᵢ | −30.5 |
| glutamate + NH₄⁺ + ATP → glutamine + ADP + Pᵢ (coupled) | −16.3 |

The same trick puts phosphate on glucose (+13.8 kJ/mol alone, −16.7 kJ/mol with ATP, catalysed by hexokinase), loads amino acids onto tRNAs, and drives pumps such as the **sodium–potassium pump**, which moves 3 Na⁺ out and 2 K⁺ in for each ATP. Pushing those ions against their gradients and the membrane voltage costs about 44 kJ/mol — more than the 30.5 kJ/mol of standard ATP hydrolysis, but less than the 50–60 kJ/mol that ATP delivers in a real cell. The pump uses about a fifth of a resting person's energy, and far more in the brain ([[active-transport]]).

Coupling runs the other way too. Molecules with a higher phosphate-transfer potential than ATP can make it from ADP: phosphoenolpyruvate (−61.9 kJ/mol) and 1,3-bisphosphoglycerate (−49.4 kJ/mol) in [[glycolysis]], and **phosphocreatine** (−43.0 kJ/mol), the muscle's reserve for the first seconds of a sprint. Most ATP, though, is made by ATP synthase, driven by a flow of protons ([[oxidative-phosphorylation]]).

| Phosphate compound | ΔG′° of hydrolysis (kJ/mol) |
|---|---|
| Phosphoenolpyruvate | −61.9 |
| 1,3-Bisphosphoglycerate | −49.4 |
| Phosphocreatine | −43.0 |
| ATP → ADP + Pᵢ | −30.5 |
| Glucose 1-phosphate | −20.9 |
| Glucose 6-phosphate | −13.8 |
| Glycerol 3-phosphate | −9.2 |

### A rapid cycle
The body holds only about 0.1–0.2 mol of ATP, some 50–100 g, yet it turns over something like its own weight of ATP every day: each molecule is recharged from ADP many hundreds of times. Muscle holds enough ATP for about two seconds of all-out effort and phosphocreatine for several seconds more; after that ATP must be made as fast as it is used, by glycolysis and respiration.

> [!key] ATP is spent within seconds and remade from ADP. Coupling through shared intermediates lets its hydrolysis — worth about 50 kJ/mol in a living cell — pay for uphill reactions, pumps and movement.
`,
  ideas: [
    'ATP hydrolysis to ADP + Pᵢ releases 30.5 kJ/mol under standard conditions and about 50–65 kJ/mol in cells, where ATP is kept high and ADP low.',
    'The energy comes from the products being more stable than ATP (less charge repulsion, more resonance and hydration), not from a special bond.',
    'Free energies add: an uphill reaction is driven by ATP through a shared phosphorylated intermediate.',
    'Compounds above ATP in phosphate-transfer potential (PEP, 1,3-BPG, phosphocreatine) can make ATP; those below can be made by it.',
    'The body recycles roughly its own weight of ATP a day from a pool of only 50–100 g.'
  ],
  pitfalls: [
    'Energy is released when the "high-energy bond" of ATP breaks — Breaking a bond always costs energy. The free energy is released because the products, taken together, are much more stable than ATP and water.',
    'ATP drives a reaction simply by being hydrolysed nearby — The two reactions must be chemically linked, usually by transferring a phosphate to a reactant; hydrolysis on its own just makes heat.',
    'ATP is how the body stores energy — Stores are fat and glycogen; ATP is a short-lived carrier that is turned over within seconds to minutes.'
  ],
  formulas: [
    {
      name: 'Free energy of ATP hydrolysis in a cell',
      expr: 'dG = dG0 + R*T*ln(ADP*Pi/(ATP*1000))', tex: '\\Delta G = \\Delta G\'^{\\circ} + RT\\ln\\dfrac{\\mathrm{[ADP]}\\,\\mathrm{[P_i]}}{\\mathrm{[ATP]}}',
      vars: {
        dG: { name: 'actual free energy of hydrolysis', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dG0: { name: 'standard free energy (pH 7)', q: 'molarenergy', unit: 'kJ/mol', value: -30.5, signed: true, tex: '\\Delta G\'^{\\circ}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        ADP: { name: 'ADP', q: false, unit: 'mM', value: 0.25, tex: '\\mathrm{[ADP]}' },
        Pi: { name: 'inorganic phosphate', q: false, unit: 'mM', value: 1.65, tex: '\\mathrm{[P_i]}' },
        ATP: { name: 'ATP', q: false, unit: 'mM', value: 2.25, tex: '\\mathrm{[ATP]}' }
      },
      note: 'Concentrations in mM; the formula divides by 1000 so that the logarithm is taken of concentrations in mol/L, the standard state. Default values: a human red blood cell.',
      practice: { unknowns: ['dG', 'ADP'] },
      stories: {
        dG: 'A cell holds {ATP} ATP, {ADP} ADP and {Pi} phosphate at {T}. How much free energy does hydrolysing one mole of ATP release?',
        ADP: 'With {ATP} ATP and {Pi} phosphate at {T}, what ADP concentration makes ATP hydrolysis worth {dG}?'
      }
    },
    {
      name: 'Coupling a reaction to ATP',
      expr: 'dG = dG1 + n*dGatp', tex: '\\Delta G_{\\text{total}} = \\Delta G_1 + n\\,\\Delta G_{\\ce{ATP}}',
      vars: {
        dG: { name: 'free energy of the coupled reaction', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G_{\\text{total}}' },
        dG1: { name: 'free energy of the uphill reaction alone', q: 'molarenergy', unit: 'kJ/mol', value: 14.2, signed: true, tex: '\\Delta G_1' },
        n: { name: 'number of ATP hydrolysed', int: true, value: 1 },
        dGatp: { name: 'free energy of hydrolysing one ATP', q: 'molarenergy', unit: 'kJ/mol', value: -30.5, signed: true, tex: '\\Delta G_{\\ce{ATP}}' }
      },
      note: 'Free energies add when the reactions share an intermediate. Use standard values for ΔG′° or cellular values for the actual ΔG.',
      practice: { unknowns: ['dG', 'n'] },
      stories: { dG: 'A reaction with ΔG = {dG1} is coupled to the hydrolysis of {n} ATP, each worth {dGatp}. What is the overall ΔG?', n: 'A process costs {dG1}. How many ATP, each worth {dGatp}, give an overall ΔG of {dG}?' }
    },
    {
      name: 'Daily ATP turnover',
      expr: 'm = E*Y*M/Eg', tex: 'm_{\\ce{ATP}} = \\dfrac{E\\,Y\\,M}{E_g}',
      vars: {
        m: { name: 'mass of ATP made (and used)', q: 'mass', unit: 'kg', tex: 'm_{\\ce{ATP}}' },
        E: { name: 'food energy used', q: 'energy', unit: 'kcal', value: 2000 },
        Y: { name: 'ATP made per glucose', value: 30 },
        M: { name: 'molar mass of ATP', q: 'molarmass', unit: 'g/mol', value: 507.18 },
        Eg: { name: 'energy released per mole of glucose', q: 'molarenergy', unit: 'kJ/mol', value: 2805, tex: 'E_g' }
      },
      note: 'Treats all food as if it were glucose (fat and protein give similar ATP per unit of energy). 2805 kJ/mol is the heat of combustion of glucose, the basis of food energy values.',
      practice: { unknowns: ['m', 'E'] },
      stories: { m: 'A person uses {E} a day. If each mole of glucose ({Eg}) yields {Y} ATP, how many kilograms of ATP are made and used in a day?', E: 'A marathon runner turns over {m} of ATP in a day. How much food energy is that ({Y} ATP per glucose of {Eg})?' }
    }
  ],
  examples: [
    {
      title: 'ATP in a red blood cell',
      q: 'A red blood cell holds 2.25 mM ATP, 0.25 mM ADP and 1.65 mM phosphate at 37 °C. What is ΔG for ATP hydrolysis?',
      steps: [
        'Mass-action ratio in mol/L: $Q = (0.25\\times10^{-3})(1.65\\times10^{-3})/(2.25\\times10^{-3}) = 1.83\\times10^{-4}$.',
        '$RT\\ln Q = 8.314 \\times 310.15 \\times \\ln(1.83\\times10^{-4}) = 2579 \\times (-8.60) = -22.2$ kJ/mol.',
        '$\\Delta G = -30.5 - 22.2 = -52.7$ kJ/mol.'
      ],
      a: 'About −52.7 kJ/mol — 70 % more than the standard value.'
    },
    {
      title: 'Can one ATP run the sodium pump?',
      q: 'Moving one Na⁺ out of a nerve cell (12 mM inside, 145 mM outside, membrane potential −70 mV) costs about 13.2 kJ/mol, and moving one K⁺ in (4 mM outside, 140 mM inside) about 2.4 kJ/mol. The pump moves 3 Na⁺ and 2 K⁺ per ATP. Is one ATP enough?',
      steps: [
        'Cost per cycle: $3 \\times 13.2 + 2 \\times 2.4 = 44.4$ kJ/mol.',
        'Under standard conditions ATP gives only 30.5 kJ/mol: not enough.',
        'In the cell ATP gives about 50–60 kJ/mol: enough, with some to spare. The cell\'s high ATP/ADP ratio is what makes the pump work.'
      ],
      a: 'Yes in a living cell (about −50 kJ/mol available against 44 kJ/mol needed), but not at standard conditions.'
    },
    {
      title: 'Your own weight in ATP',
      q: 'A person uses 2000 kcal a day. If each mole of glucose (2805 kJ) yields 30 ATP, how much ATP is made and used in a day?',
      steps: [
        'Energy: $2000 \\times 4.184 = 8368$ kJ, equivalent to $8368/2805 = 2.98$ mol of glucose.',
        'ATP: $2.98 \\times 30 = 89.5$ mol.',
        'Mass: $89.5 \\times 507$ g/mol $= 45$ kg.'
      ],
      a: 'About 45 kg of ATP a day — recycled from a pool of well under 100 g.'
    }
  ],
  quiz: [
    { q: 'Where does the free energy released by ATP hydrolysis come from?', choices: ['A special high-energy bond that gives out energy when it breaks', 'ADP and phosphate are more stable than ATP: less charge repulsion, more resonance and better hydration', 'The heat of the cell', 'The adenine base'], a: 1, why: 'Breaking any bond takes energy; the release comes from the difference in stability between products and reactants.' },
    { q: 'In a living cell, ATP hydrolysis releases less free energy than the standard −30.5 kJ/mol.', a: false, why: 'Cells keep ATP high and ADP and phosphate low, so RT ln Q is strongly negative and ΔG is about −50 to −65 kJ/mol.' },
    { q: 'A reaction with ΔG′° = +20 kJ/mol is coupled to the hydrolysis of one ATP (−30.5 kJ/mol). What is the overall ΔG′°, in kJ/mol?', answer: -10.5, unit: 'kJ/mol', why: 'Free energies add: $20 - 30.5 = -10.5$ kJ/mol, so the coupled reaction can go forward.' },
    { q: 'An uphill reaction is coupled to ATP hydrolysis by…', choices: ['running both reactions in the same cell at the same time', 'a shared intermediate, usually a phosphorylated form of one reactant', 'warming the enzyme with the heat of hydrolysis', 'ATP binding to the product'], a: 1, why: 'The enzyme transfers a phosphate from ATP to a reactant, making a reactive intermediate; without that chemical link the energy of hydrolysis is lost as heat.' },
    { q: 'Which of these can make ATP from ADP by transferring its phosphate?', choices: ['glucose 6-phosphate (−13.8 kJ/mol)', 'phosphocreatine (−43.0 kJ/mol)', 'glycerol 3-phosphate (−9.2 kJ/mol)', 'AMP'], a: 1, why: 'Only a compound with a more negative ΔG′° of hydrolysis than ATP (−30.5) can give its phosphate to ADP with ΔG′° < 0.' }
  ],
  problems: [
    { q: 'A muscle cell holds 5.0 mM ATP, 0.50 mM ADP and 5.0 mM phosphate at 37 °C. What is ΔG for ATP hydrolysis, in kJ/mol?', answer: -50.1, unit: 'kJ/mol', tol: 0.01, steps: ['$Q = (0.5\\times10^{-3})(5\\times10^{-3})/(5\\times10^{-3}) = 5\\times10^{-4}$.', '$RT\\ln Q = 2579 \\times (-7.60) = -19.6$ kJ/mol.', '$\\Delta G = -30.5 - 19.6 = -50.1$ kJ/mol.'] },
    { q: 'A process costs +130 kJ/mol. At least how many ATP, each worth −50 kJ/mol in the cell, must be coupled to it?', answer: 3, tol: 0.01, steps: ['$130/50 = 2.6$, so two are not enough: three ATP give $130 - 150 = -20$ kJ/mol overall.'] }
  ],
  applications: ['Rigor mortis: without ATP, myosin cannot let go of actin and muscles lock.', 'ATP tests with firefly luciferase detect living cells on surfaces (hygiene swabs) and in cell cultures.', 'The energy cost of the brain, most of it spent on ion pumps.', 'Understanding how poisons such as cyanide, which stop ATP production, act so quickly.'],
  history: 'Karl Lohmann discovered ATP in muscle extracts in 1929, as did Cyrus Fiske and Yellapragada Subbarow. In 1941 Fritz Lipmann proposed that ATP is the general carrier of energy in cells (Nobel Prize 1953). Alexander Todd synthesised it in 1948, and Jens Skou discovered the sodium–potassium pump in 1957 (Nobel Prize 1997).',
  sim: 'chem-atp'
},

/* ================================================================ BIOENERGETICS */
{
  id: 'bioenergetics', parent: 'enzymes-topic', title: 'Free energy in living things', level: 3,
  short: 'Living things obey thermodynamics: they are open systems that stay far from equilibrium by consuming free energy. ΔG = ΔG′° + RT ln Q decides which way each reaction runs in a cell, and free energy is carried as phosphate groups, electrons and ion gradients.',
  keywords: ['bioenergetics', 'Gibbs free energy', 'ΔG', 'standard free energy', 'ΔG′°', 'equilibrium constant', 'mass-action ratio', 'reaction quotient', 'open system', 'second law', 'entropy', 'redox potential', 'ΔG = −nFΔE', 'proton-motive force', 'membrane potential', 'chemiosmosis', 'near-equilibrium reactions', 'efficiency'],
  prereq: ['atp-energy', 'chemistry:gibbs-equilibrium', 'chemistry:reaction-quotient'],
  related: ['oxidative-phosphorylation', 'glycolysis', 'photosynthesis', 'active-transport', 'enzyme-regulation', 'energy-flow', 'chemistry:electrode-potentials', 'chemistry:nernst-equation', 'physics:second-law-thermodynamics', 'medicine:membrane-potential'],
  body: `
Living things seem to defy the second law of thermodynamics: they build ordered structures from disordered raw materials and stay far from equilibrium for decades. They do not defy it. A cell is an **open system** that takes in energy-rich, low-entropy food or light and gives out heat and simple molecules; the entropy it exports to its surroundings more than pays for the order it builds inside ([[physics:second-law-thermodynamics]]). A resting person gives off some 80–100 W of heat doing exactly that. Gibbs free energy is the book-keeping that tells which reactions can go.

### Gibbs free energy
At constant temperature and pressure a process can go on its own only if the Gibbs energy falls:

$$\\Delta G = \\Delta H - T\\Delta S < 0$$

The products either hold their atoms more tightly (negative $\\Delta H$: heat released) or are more disordered (positive $\\Delta S$), or both. $\\Delta G$ is also the most useful work a reaction can deliver. It says nothing about how fast — that is the business of enzymes ([[enzymes]]).

### Standard and actual
Biochemists quote **standard** values $\\Delta G\'^{\\circ}$: 1 mol/L of every reactant and product, 25 °C, and — the meaning of the prime — pH 7 rather than 1 mol/L of $\\ce{H+}$, with water not counted. The standard value fixes the equilibrium constant,

$$\\Delta G\'^{\\circ} = -RT\\ln K'_{eq}$$

so at 25 °C every 5.7 kJ/mol is a factor of ten in $K'_{eq}$. But cells are never at standard conditions. What decides the direction is the **actual** $\\Delta G$, set by the concentrations present:

$$\\Delta G = \\Delta G\'^{\\circ} + RT\\ln Q$$

where $Q$ is the mass-action ratio, products over reactants. A reaction that is uphill under standard conditions runs forward in a cell if its products are removed fast enough. The aldolase step of [[glycolysis]] has $\\Delta G\'^{\\circ} = +23.8$ kJ/mol, yet in a red blood cell its products are so scarce that $\\Delta G$ is close to zero and the reaction flows forward.

### Near equilibrium and far from it
Most steps of a pathway run close to equilibrium, with $\\Delta G$ near zero, and can go either way with supply and demand. A few are held far from equilibrium, with $\\Delta G$ of −15 to −35 kJ/mol — in glycolysis the steps of hexokinase, phosphofructokinase and pyruvate kinase. Those nearly irreversible steps set the direction of flow, and they are the ones the cell regulates ([[enzyme-regulation]]). A pathway and its reverse, such as glycolysis and the synthesis of glucose, must use different enzymes at exactly those steps.

### Three currencies of free energy
| Currency | Free energy | Example |
|---|---|---|
| Phosphate groups | $\\Delta G = \\Delta G\'^{\\circ} + RT\\ln Q$ | ATP hydrolysis, about −50 kJ/mol in cells ([[atp-energy]]) |
| Electrons (redox) | $\\Delta G = -nF\\Delta E$ | NADH → O₂: $\\Delta E\'^{\\circ} = 1.14$ V, $\\Delta G\'^{\\circ} = -220$ kJ/mol |
| Ion gradients | $\\Delta G = RT\\ln(c_2/c_1) + zF\\Delta\\psi$ | each proton re-entering a mitochondrion: about −20 kJ/mol |

**Electrons.** Electrons flow from carriers of low reduction potential to those of high: from NADH ($E\'^{\\circ} = -0.32$ V) to oxygen (+0.82 V). Two electrons falling through that 1.14 V release about 220 kJ/mol — far too much for one ATP, so the respiratory chain releases it in several steps ([[oxidative-phosphorylation]], [[chemistry:electrode-potentials]]).

**Gradients.** Moving an ion across a membrane gains or costs free energy for two reasons: the difference in concentration and, for a charged ion, the voltage. Mitochondria keep about 150–180 mV across their inner membrane (inside negative) and a pH difference of about 0.5–0.8, so each proton flowing back in releases about 20 kJ/mol; ATP synthase uses roughly three for each ATP it makes. The same arithmetic describes nerve signals, where sodium rushes in down both its concentration and voltage gradients ([[medicine:membrane-potential]]).

### How efficient is life?
Oxidising a mole of glucose releases about 2870 kJ of free energy. Respiration captures it as some 30–32 ATP: about a third, counting ATP at its standard −30.5 kJ/mol, and more than half at the value it has in a working cell. The rest becomes heat, which is how birds and mammals keep warm. Muscle converts food energy into mechanical work at about 20–25 % efficiency overall — about as well as a car engine.

> [!key] ΔG, not ΔG′°, decides the direction: concentrations matter. Cells hold a few reactions far from equilibrium to set the direction of metabolism, and carry free energy in three interchangeable forms — phosphate groups, electrons and ion gradients.
`,
  ideas: [
    'Cells are open systems: they build order inside by exporting entropy (heat and simple molecules) to their surroundings.',
    'ΔG′° = −RT ln K′eq; at 25 °C each 5.7 kJ/mol is a factor of ten in the equilibrium constant.',
    'The actual ΔG = ΔG′° + RT ln Q decides the direction; products kept scarce let "uphill" reactions run forward.',
    'A few far-from-equilibrium steps set the direction of a pathway and are the regulated ones.',
    'Free energy is carried as phosphate groups (ATP), electrons (ΔG = −nFΔE) and ion gradients (ΔG = RT ln(c₂/c₁) + zFΔψ).'
  ],
  pitfalls: [
    'Living things break the second law by creating order — The order inside is paid for by a larger increase of entropy outside; the total always rises.',
    'A reaction with positive ΔG′° cannot happen in a cell — ΔG′° refers to 1 mol/L of everything; with products kept scarce, RT ln Q can make the actual ΔG negative.',
    'A large negative ΔG means a fast reaction — ΔG says whether a reaction can go, not how fast; many downhill reactions are extremely slow without an enzyme.'
  ],
  formulas: [
    {
      name: 'Gibbs free energy from enthalpy and entropy',
      expr: 'dG = dH - T*dS', tex: '\\Delta G = \\Delta H - T\\,\\Delta S',
      vars: {
        dG: { name: 'free-energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dH: { name: 'enthalpy change', q: 'molarenergy', unit: 'kJ/mol', value: -2805, signed: true, tex: '\\Delta H' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        dS: { name: 'entropy change', q: 'molarheat', unit: 'J/(mol·K)', value: 259, signed: true, tex: '\\Delta S' }
      },
      note: 'Default values: the complete oxidation of glucose, C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O(l).',
      practice: { unknowns: ['dG', 'dS'] },
      stories: { dG: 'A reaction has ΔH = {dH} and ΔS = {dS}. What is ΔG at {T}?', dS: 'A reaction has ΔH = {dH} and ΔG = {dG} at {T}. What is its entropy change?' }
    },
    {
      name: 'Standard free energy and the equilibrium constant',
      expr: 'dG0 = -R*T*ln(K)', tex: '\\Delta G\'^{\\circ} = -RT\\ln K\'_{eq}',
      vars: {
        dG0: { name: 'standard free-energy change (pH 7)', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G\'^{\\circ}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 25 },
        K: { name: 'equilibrium constant (concentrations in mol/L)', value: 1000, tex: 'K\'_{eq}' }
      },
      note: 'At 25 °C, RT ln 10 = 5.71 kJ/mol: each 5.7 kJ/mol is a factor of ten in K.',
      stories: { dG0: 'A reaction has an equilibrium constant of {K} at {T}. What is its standard free-energy change?', K: 'A reaction has ΔG′° = {dG0} at {T}. What is its equilibrium constant?' }
    },
    {
      name: 'Free energy at the concentrations in a cell',
      expr: 'dG = dG0 + R*T*ln(Q)', tex: '\\Delta G = \\Delta G\'^{\\circ} + RT\\ln Q',
      vars: {
        dG: { name: 'actual free-energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        dG0: { name: 'standard free-energy change (pH 7)', q: 'molarenergy', unit: 'kJ/mol', value: 23.8, signed: true, tex: '\\Delta G\'^{\\circ}' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        Q: { name: 'mass-action ratio, products ÷ reactants (mol/L)', value: 6e-5 }
      },
      note: 'At equilibrium ΔG = 0 and Q = K. Default values: the aldolase step of glycolysis in a red blood cell.',
      practice: { unknowns: ['dG', 'Q'] },
      stories: { dG: 'A reaction with ΔG′° = {dG0} runs in a cell where the mass-action ratio is {Q}. What is ΔG at {T}?', Q: 'A reaction has ΔG′° = {dG0}. Below what mass-action ratio does ΔG fall to {dG} at {T}?' }
    },
    {
      name: 'Free energy of electron transfer',
      expr: 'dG = -n*F*dE', tex: '\\Delta G = -nF\\,\\Delta E',
      vars: {
        dG: { name: 'free-energy change', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        n: { name: 'electrons transferred', int: true, value: 2 },
        F: { const: 'F' },
        dE: { name: 'difference in reduction potential (acceptor − donor)', q: 'voltage', unit: 'V', value: 1.14, signed: true, tex: '\\Delta E' }
      },
      note: 'NADH/NAD⁺ −0.32 V, ubiquinone +0.045 V, cytochrome c +0.25 V, O₂/H₂O +0.82 V (standard, pH 7).',
      stories: { dG: '{n} electrons pass from NADH to oxygen, a drop of {dE}. How much free energy is released?', dE: 'A redox step moving {n} electrons releases {dG}. What is the potential difference?' }
    },
    {
      name: 'Free energy of moving an ion across a membrane',
      expr: 'dG = R*T*ln(c2/c1) + z*F*dpsi', tex: '\\Delta G = RT\\ln\\dfrac{c_2}{c_1} + zF\\,\\Delta\\psi',
      vars: {
        dG: { name: 'free-energy change per mole moved', q: 'molarenergy', unit: 'kJ/mol', signed: true, tex: '\\Delta G' },
        R: { const: 'R' },
        T: { name: 'temperature', q: 'temperature', unit: '°C', value: 37 },
        c2: { name: 'concentration on the side it moves to', q: 'concentration', unit: 'mM', value: 12, tex: 'c_2' },
        c1: { name: 'concentration on the side it comes from', q: 'concentration', unit: 'mM', value: 145, tex: 'c_1' },
        z: { name: 'charge of the ion', int: true, signed: true, value: 1 },
        F: { const: 'F' },
        dpsi: { name: 'potential of the destination minus the origin', q: 'voltage', unit: 'mV', value: -70, signed: true, tex: '\\Delta\\psi' }
      },
      note: 'Default values: Na⁺ entering a nerve cell (145 mM outside, 12 mM inside, inside −70 mV). A negative ΔG means the ion flows that way by itself — and can drive other transport.',
      practice: { unknowns: ['dG', 'c2'] },
      stories: { dG: 'An ion of charge {z} moves from {c1} to {c2} across a membrane, into a compartment {dpsi} relative to where it started. What is ΔG at {T}?', c2: 'An uncharged molecule (or one that moves with no voltage change) leaves a compartment at {c1}. At what concentration on the other side is ΔG = {dG}?' }
    }
  ],
  examples: [
    {
      title: 'From K to ΔG′°',
      q: 'At 25 °C a reaction has K′eq = 1000. What is ΔG′°? What if K′eq = 0.001?',
      steps: [
        '$RT = 8.314 \\times 298.15 = 2479$ J/mol.',
        '$\\Delta G\'^{\\circ} = -2479 \\times \\ln 1000 = -2479 \\times 6.91 = -17.1$ kJ/mol.',
        'For $K = 0.001$: $+17.1$ kJ/mol — three factors of ten, three steps of 5.7 kJ/mol either way.'
      ],
      a: '−17.1 kJ/mol for K = 1000; +17.1 kJ/mol for K = 0.001.'
    },
    {
      title: 'An uphill step that runs forward',
      q: 'Aldolase splits fructose 1,6-bisphosphate with ΔG′° = +23.8 kJ/mol. In a red blood cell the mass-action ratio is about 6 × 10⁻⁵. What is ΔG at 37 °C?',
      steps: [
        '$RT = 8.314 \\times 310.15 = 2579$ J/mol.',
        '$RT\\ln Q = 2579 \\times \\ln(6\\times10^{-5}) = 2579 \\times (-9.72) = -25.1$ kJ/mol.',
        '$\\Delta G = 23.8 - 25.1 = -1.3$ kJ/mol: slightly downhill, close to equilibrium.',
        'One molecule splits into two, so low concentrations favour the products; and the next enzymes keep removing them.'
      ],
      a: 'About −1.3 kJ/mol: the reaction runs forward, close to equilibrium.'
    },
    {
      title: 'Sodium entering a neuron',
      q: 'Na⁺ is 145 mM outside a neuron and 12 mM inside; the inside is at −70 mV. What is ΔG for a sodium ion entering, at 37 °C?',
      steps: [
        'Concentration term: $2579 \\times \\ln(12/145) = 2579 \\times (-2.49) = -6.43$ kJ/mol.',
        'Voltage term: $zF\\Delta\\psi = 1 \\times 96\\,485 \\times (-0.070) = -6.75$ kJ/mol.',
        'Total: $\\Delta G = -13.2$ kJ/mol — both terms push sodium in. Cells use this to drive glucose and amino acids into cells against their own gradients.'
      ],
      a: 'About −13.2 kJ/mol.'
    }
  ],
  quiz: [
    { q: 'A reaction has ΔG′° = +10 kJ/mol. In a cell it can still run forward if…', choices: ['its enzyme is fast enough', 'the products are kept scarce, so that RT ln Q is below −10 kJ/mol', 'the cell is warmed to 100 °C', 'never — a positive ΔG′° forbids it'], a: 1, why: 'The direction is set by the actual ΔG = ΔG′° + RT ln Q; removing products makes Q small and ΔG negative. Enzymes change the speed, not the direction.' },
    { q: 'A negative ΔG means a reaction will happen quickly.', a: false, why: 'ΔG tells whether a reaction can go, not how fast. Glucose and oxygen hardly react at room temperature despite ΔG = −2870 kJ/mol; enzymes supply the speed.' },
    { q: 'What is K′eq for a reaction with ΔG′° = −11.4 kJ/mol at 25 °C?', answer: 100, why: '$K = e^{11\\,400/2479} = e^{4.60} \\approx 100$ — two steps of 5.7 kJ/mol.' },
    { q: 'Which steps of a metabolic pathway are usually the regulated ones?', choices: ['the near-equilibrium steps', 'the steps held far from equilibrium, with large negative ΔG', 'the fastest steps', 'the steps that use water'], a: 1, why: 'Near-equilibrium steps simply follow their substrates and products; the far-from-equilibrium steps control the flow, so that is where regulation acts.' },
    { q: 'Living things build ordered structures. How is that consistent with the second law of thermodynamics?', choices: ['The second law does not apply to living things', 'They export more entropy — heat and simple molecules — to their surroundings than they gain in order', 'Enzymes reverse entropy', 'ATP contains negative entropy'], a: 1, why: 'The second law concerns the total entropy of the system and its surroundings; an open system may become more ordered as long as the total rises.' }
  ],
  problems: [
    { q: 'Two electrons pass from NADH (E′° = −0.32 V) to ubiquinone (E′° = +0.045 V). What is ΔG′°, in kJ/mol?', answer: -70.4, unit: 'kJ/mol', tol: 0.01, steps: ['$\\Delta E = 0.045 - (-0.32) = 0.365$ V.', '$\\Delta G = -2 \\times 96\\,485 \\times 0.365 = -70.4$ kJ/mol.'] },
    { q: 'Glucose moves from blood (5.0 mM) into a cell where it is 0.10 mM, with no charge involved, at 37 °C. What is ΔG, in kJ/mol?', answer: -10.1, unit: 'kJ/mol', tol: 0.02, steps: ['$\\Delta G = RT\\ln(c_2/c_1) = 2579 \\times \\ln(0.10/5.0) = 2579 \\times (-3.91) = -10.1$ kJ/mol.'] }
  ],
  applications: ['Brown fat makes heat by letting protons leak back into its mitochondria without making ATP.', 'Metabolic engineering: why pathways need irreversible steps, and where to intervene to change a flux.', 'Nerve and muscle signals run on the free energy stored in ion gradients.', 'Energy balance of whole organisms and ecosystems, from food labels to food webs.'],
  history: 'Josiah Willard Gibbs defined free energy in 1873–1878. In *What Is Life?* (1944) Erwin Schrödinger argued that organisms stay ordered by feeding on "negative entropy". Peter Mitchell proposed in 1961 that cells store energy as proton gradients — the chemiosmotic theory, long resisted and rewarded with the 1978 Nobel Prize in Chemistry.',
  sim: 'chem-atp'
}

);
