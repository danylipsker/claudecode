/* HYPER-MEDICINE · content/blood.js — topic "blood": what blood is made of, anaemia,
 * blood groups and transfusion, and clotting. Simulations in sims/blood-immunity.js. */
Hyper.add(

{
  id: 'blood-composition', parent: 'blood', title: 'What blood is made of', level: 1,
  short: 'Blood is a living tissue that flows: red cells that carry oxygen, white cells that fight infection and platelets that plug leaks, all carried in a salty, protein-rich liquid called plasma. The full blood count measures each part.',
  keywords: ['blood', 'plasma', 'serum', 'red blood cells', 'erythrocytes', 'white blood cells', 'leukocytes', 'platelets', 'haematocrit', 'hematocrit', 'full blood count', 'complete blood count', 'CBC', 'FBC', 'MCV', 'bone marrow', 'erythropoietin', 'buffy coat', 'blood volume'],
  prereq: ['cell-structure', 'body-fluids', 'blood-vessels'],
  related: ['anemia', 'blood-groups', 'hemostasis', 'innate-immunity', 'oxygen-transport', 'lab-tests', 'physics:viscosity', 'physics:centripetal-force'],
  body: `
Fill a narrow tube with blood, spin it in a centrifuge for a few minutes, and the single red liquid comes apart into layers. On top sits a clear, straw-coloured fluid — the **plasma**, a little over half of the volume. At the bottom is a dark red column of packed **red cells**. Between them, easy to miss, lies a thin whitish film called the **buffy coat**: all the white cells and platelets, usually less than 1 % of the whole. The height of the red column as a fraction of the total is the **haematocrit**, around 40–50 % in men and 36–46 % in women. It is one of the oldest blood tests and is still printed on every blood count.

### How much, and what is in it
An adult has roughly 70 mL of blood for every kilogram of body weight (a little less in women) — about 5 litres, or 7 % of the body's mass.

| Part | Typical adult amount | What it does |
|---|---|---|
| Plasma | about 55 % of the volume; 92 % water, about 7 g of protein per 100 mL | carries salts, sugar, fats, hormones, waste and heat; albumin holds water inside the vessels; antibodies and clotting factors travel in it |
| Red cells (erythrocytes) | 4–6 million per microlitre (4–6 × 10¹²/L) | carry oxygen on haemoglobin and help carry carbon dioxide |
| White cells (leukocytes) | 4 000–11 000 per microlitre (4–11 × 10⁹/L) | defend against infection — see [[innate-immunity]] and [[adaptive-immunity]] |
| Platelets (thrombocytes) | 150 000–400 000 per microlitre (150–400 × 10⁹/L) | seal leaks and start [[hemostasis|clotting]] |

These are rounded ranges: every laboratory sets its own, and they differ with sex, age, pregnancy, altitude and ancestry. There are about 700 red cells for every white cell and some 20 for every platelet.

A **red cell** is a flexible disc about 7.5 µm across, dimpled on both sides and without a nucleus, so that it is little more than a bag of haemoglobin — some 280 million molecules each (see [[oxygen-transport]]). It bends to squeeze through capillaries narrower than itself and lives about 120 days, after which the spleen and liver recycle it: the iron is kept, and the rest of the haem becomes bilirubin, the yellow pigment of bruises and jaundice (see [[liver-function]]). An adult carries about 25 trillion red cells — roughly five out of every six cells in the body — and to replace them the marrow makes about **2.4 million every second**.

### Where blood cells come from
All blood cells descend from stem cells in the red bone marrow — in adults mostly in the pelvis, spine, ribs, breastbone and skull. Hormones steer the output. When oxygen delivery falls, the kidneys release **erythropoietin**, which speeds red-cell production; that is why kidney disease causes anaemia, why people living at altitude have a higher haematocrit, and why the hormone has been misused in endurance sport. Other signals raise platelet or neutrophil production — one of them is given as a medicine to hasten recovery after chemotherapy.

**Plasma and serum** differ by one step: serum is what is left when blood has clotted, so it is plasma without the clotting factors. Many chemistry tests are run on serum.

### The full blood count
The commonest blood test of all, also called the complete blood count, is done by machines that count and size tens of thousands of cells in seconds. It reports haemoglobin, haematocrit, the red-cell count and their average size (the **mean cell volume**, MCV), the white count with its breakdown into types, and the platelet count. The MCV is simply the packed red-cell volume shared out among the cells:

$$\\text{MCV} = \\frac{\\text{haematocrit}}{\\text{red cells per litre}} \\approx \\frac{0.45}{5 \\times 10^{12}\\,\\text{L}^{-1}} = 90\\ \\text{fL}$$

Small cells (below about 80 fL) point towards iron deficiency or thalassaemia trait, large ones (above about 100 fL) towards a lack of vitamin B12 or folate, alcohol or some medicines — a first clue in [[anemia]].

### When the numbers are off
Too little haemoglobin is anaemia; too many red cells (polycythaemia) thicken the blood (see [[physics:viscosity|viscosity]]) and come from living at altitude, smoking, lung disease or, rarely, a marrow disorder. A high white count usually means infection, inflammation, stress or steroid medicines, occasionally leukaemia; a low one follows chemotherapy and some viral infections, and is a normal finding in many healthy people of African or Middle Eastern ancestry. Platelets fall in immune conditions, marrow disease and with some medicines.

> [!note] A reference range holds the middle 95 % of healthy people, so one healthy person in twenty falls outside it on any single test. Order twenty tests and the chance that at least one is flagged is about 64 % — which is why a doctor looks at the pattern and the trend, not one starred number.

> [!warn] Unexplained bruising, tiny red-purple spots on the skin, bleeding gums, repeated infections or drenching night sweats with weight loss need a prompt medical review. Bleeding that will not stop, vomiting blood, black tarry stools, or a fever while having chemotherapy are emergencies — call your local emergency number.
`,
  ideas: [
    'Blood is about 55 % plasma and 45 % cells, almost all of them red cells; white cells and platelets make a thin buffy coat.',
    'Red cells are nucleus-free bags of haemoglobin that live about 120 days; the marrow replaces them at some 2.4 million a second.',
    'Erythropoietin from the kidneys sets red-cell production to match oxygen delivery.',
    'The full blood count reports haemoglobin, haematocrit, cell size (MCV), white cells and platelets; MCV = haematocrit ÷ red-cell count.',
    'Reference ranges hold 95 % of healthy people, so a single value just outside one is common and often harmless.'
  ],
  pitfalls: [
    'Blood in the veins is blue — It is always red: dark red in veins, bright red in arteries. Veins look blue because of how skin absorbs and scatters light.',
    'Plasma is just water — It carries about 7 g of protein per 100 mL (albumin, antibodies, clotting factors) as well as salts, nutrients, hormones and waste.',
    'A result outside the reference range means disease — One healthy person in twenty is outside any given range; the pattern, the trend and the person matter more.'
  ],
  formulas: [
    {
      name: 'Haematocrit from a spun tube',
      expr: 'Hct = hr/ht', tex: '\\text{Hct} = \\frac{h_\\text{red}}{h_\\text{total}}',
      vars: {
        Hct: { name: 'haematocrit', q: 'ratio', unit: '%', tex: '\\text{Hct}' },
        hr: { name: 'height of the packed red cells', q: 'length', unit: 'mm', value: 22.5, tex: 'h_\\text{red}' },
        ht: { name: 'height of the whole blood column', q: 'length', unit: 'mm', value: 50, tex: 'h_\\text{total}' }
      },
      note: 'The thin buffy coat is not counted. Analysers now calculate the haematocrit from the cell count and size instead of spinning a tube.',
      stories: { Hct: 'After spinning, the red cells fill {hr} of a {ht} blood column. What is the haematocrit?' }
    },
    {
      name: 'Mean cell volume',
      expr: 'MCV = 1000*Hct/RBC', tex: '\\text{MCV} = \\frac{1000\\,\\text{Hct}}{\\text{RBC}}',
      vars: {
        MCV: { name: 'mean cell volume (fL)', tex: '\\text{MCV}' },
        Hct: { name: 'haematocrit', q: 'ratio', unit: '%', value: 45, tex: '\\text{Hct}' },
        RBC: { name: 'red-cell count (×10¹²/L)', value: 5, tex: '\\text{RBC}' }
      },
      note: 'With the haematocrit as a fraction and the count in 10¹² per litre, the factor 1000 gives femtolitres (10⁻¹⁵ L). Adult range roughly 80–100 fL; it varies by laboratory.',
      practice: { unknowns: ['MCV', 'RBC'] },
      stories: { MCV: 'A blood count shows a haematocrit of {Hct} and {RBC} million million red cells per litre. What is the mean cell volume?' }
    },
    {
      name: 'Blood volume',
      expr: 'BV = k*m/1000', tex: 'V_\\text{blood} = \\frac{k\\, m}{1000}',
      vars: {
        BV: { name: 'blood volume (L)', tex: 'V_\\text{blood}' },
        k: { name: 'blood per kilogram of body weight', q: 'volperkg', unit: 'mL/kg', value: 70, tex: 'k' },
        m: { name: 'body weight', q: 'mass', unit: 'kg', value: 70, tex: 'm' }
      },
      note: 'A rough estimate: about 70 mL/kg in men, 65 mL/kg in women, 75–80 mL/kg in children and about 85 mL/kg in newborns; less per kilogram in people with obesity, because fat holds little blood.',
      stories: { BV: 'Estimate the blood volume of a person weighing {m}, taking {k}.' }
    },
    {
      name: 'The marrow\'s production line',
      expr: 'P = BV*RBC*1e6/T', tex: 'P = \\frac{V_\\text{blood}\\,\\text{RBC}\\times 10^{6}}{T}',
      vars: {
        P: { name: 'red cells made (millions per second)', tex: 'P' },
        BV: { name: 'blood volume (L)', value: 5, tex: 'V_\\text{blood}' },
        RBC: { name: 'red-cell count (×10¹²/L)', value: 5, tex: '\\text{RBC}' },
        T: { name: 'red-cell lifespan', q: 'time', unit: 'day', value: 120, tex: 'T' }
      },
      note: 'In a steady state, production equals destruction: the whole red-cell mass is replaced once per lifespan. The marrow can raise its output several-fold when iron, B12 and folate are available.',
      stories: { P: 'An adult has {BV} of blood with {RBC} million million red cells per litre, and red cells live {T}. How many million red cells must the marrow make each second?', T: 'If the marrow makes {P} million red cells a second to keep {BV} of blood at {RBC} million million per litre, how long do the red cells live?' }
    }
  ],
  examples: [
    {
      title: 'Small cells',
      q: 'A blood count shows a haematocrit of 33 % and a red-cell count of 4.6 × 10¹²/L. Are the red cells small, normal or large?',
      steps: [
        'Mean cell volume: $\\text{MCV} = 1000 \\times 0.33 / 4.6 = 71.7$ fL.',
        'The adult range is roughly 80–100 fL, so the cells are small (microcytic).',
        'The count of cells is near normal but each carries too little: the pattern of iron deficiency or of thalassaemia trait. The next tests a doctor would think of are ferritin (the iron store) and, depending on the result and ancestry, haemoglobin studies.'
      ],
      a: 'About 72 fL: small red cells, a pattern that points towards iron deficiency or thalassaemia trait.'
    },
    {
      title: 'Replacing a blood donation',
      q: 'A donor gives 470 mL of blood with 5 × 10¹² red cells per litre. If her marrow raises its output by half above the normal 2.4 million a second, how long does it take to make the missing red cells?',
      steps: [
        'Red cells given: $0.47 \\times 5 \\times 10^{12} = 2.35 \\times 10^{12}$.',
        'Extra production: half of 2.4 million a second, $1.2 \\times 10^{6}$ per second.',
        'Time: $2.35 \\times 10^{12} / 1.2 \\times 10^{6} = 1.96 \\times 10^{6}$ s, about 23 days.',
        'In practice haemoglobin takes several weeks to recover and the iron stores longer — which is why donation intervals are set at about 8 to 16 weeks, depending on the country and the donor\'s sex.'
      ],
      a: 'About three weeks of extra production, if iron is not the limit.'
    }
  ],
  quiz: [
    { q: 'After spinning a tube of blood, what is in the thin whitish layer between the plasma and the red cells?', choices: ['white cells and platelets', 'clotting factors', 'fat from the last meal', 'dead red cells'], a: 0,
      why: 'The buffy coat holds the white cells and platelets: they are lighter than red cells and far fewer, so they form a film usually less than 1 % of the column.' },
    { q: 'A blood count shows a haematocrit of 45 % and 5.0 × 10¹² red cells per litre. What is the mean cell volume, in femtolitres?', answer: 90,
      why: '1000 × 0.45 / 5.0 = 90 fL: normal-sized red cells.' },
    { q: 'A healthy person has twenty blood tests. One value is just outside its reference range. This proves something is wrong.', a: false,
      why: 'Each range is set to include 95 % of healthy people, so with twenty tests the chance of at least one flag is about 64 % even in perfect health. Doctors look at the size of the deviation, the pattern and the trend.' },
    { q: 'Why does long-standing kidney disease usually cause anaemia?', choices: ['the kidneys make too little erythropoietin', 'red cells are lost in the urine', 'the kidneys destroy red cells', 'the kidneys store iron'], a: 0,
      why: 'Erythropoietin, the hormone that drives red-cell production, is made in the kidneys. Damaged kidneys make too little, so the marrow slows down.' },
    { q: 'Serum is…', choices: ['plasma without the clotting factors', 'plasma without the red cells', 'blood without the plasma', 'the same thing as plasma'], a: 0,
      why: 'Plasma is the liquid of unclotted blood. Serum is what remains after the blood has clotted, so the clotting factors (fibrinogen above all) have been used up.' }
  ],
  applications: ['The full blood count, the most commonly ordered blood test in the world.', 'Blood donation, separated into red cells, plasma and platelets for different patients.', 'Plasma-derived medicines such as albumin, immunoglobulin and clotting factors.', 'Altitude training — and the detection of erythropoietin misuse in sport.'],
  history: 'Red cells were first seen through the simple microscopes of the seventeenth century. The haematocrit tube came in the early twentieth century, and in the 1950s Wallace Coulter\'s counter, which sized cells by the blip each one makes as it passes through a tiny electrified hole, began the automated blood count.',
  sim: 'bi-centrifuge'
},

{
  id: 'anemia', parent: 'blood', title: 'Anaemia', level: 2,
  short: 'Too little haemoglobin in the blood, so each litre carries less oxygen. It causes tiredness and breathlessness, makes the heart work harder, and is a sign with a cause to find — most often, worldwide, a lack of iron.',
  keywords: ['anaemia', 'anemia', 'haemoglobin', 'hemoglobin', 'iron deficiency', 'ferritin', 'vitamin B12', 'folate', 'pernicious anaemia', 'sickle cell', 'thalassaemia', 'haemolysis', 'MCV', 'microcytic', 'macrocytic', 'oxygen content', 'oxygen delivery', 'transfusion', 'tired', 'fatigue', 'pale'],
  prereq: ['blood-composition', 'oxygen-transport', 'cardiac-output'],
  related: ['blood-groups', 'chronic-kidney-disease', 'vitamins-minerals', 'celiac-disease', 'malaria', 'pregnancy', 'heart-failure', 'lab-tests'],
  body: `
Maya is 24, runs twice a week and has had heavy periods since her teens. Over one winter she becomes breathless on the stairs to her flat, is cold all the time and falls asleep at her desk. A blood test shows a haemoglobin of 9.5 g/dL (95 g/L), small, pale red cells and a very low ferritin: iron-deficiency anaemia, from losing a little more iron each month than her diet replaces. With the bleeding assessed and her iron replaced, her haemoglobin climbs back over the next couple of months.

### What anaemia is
Anaemia means the blood holds too little haemoglobin. The World Health Organization's cut-offs (2024) are:

| Group | Anaemia if haemoglobin is below |
|---|---|
| Men (15–65 years) | 13.0 g/dL (130 g/L) |
| Women who are not pregnant (15–65 years) | 12.0 g/dL (120 g/L) |
| Pregnancy, first and third trimesters | 11.0 g/dL (110 g/L) |
| Pregnancy, second trimester | 10.5 g/dL (105 g/L) |
| Children from 6 months to 5 years | 10.5–11.0 g/dL, depending on age |

Values are adjusted upwards for people living at altitude and for smokers, and each laboratory has its own reference range. By Global Burden of Disease estimates, about one person in four worldwide — some 1.9 billion in 2021 — has anaemia, most of them women and young children in low- and middle-income countries.

### Why it makes you tired
Almost all the oxygen in blood rides on haemoglobin. The **oxygen content** of arterial blood is

$$C_{a\\mathrm{O_2}} = 1.34 \\times \\text{Hb} \\times S_{a\\mathrm{O_2}} + 0.003 \\times P_{a\\mathrm{O_2}}$$

in millilitres of oxygen per 100 mL of blood: each gram of haemoglobin carries up to 1.34 mL, and the dissolved part is tiny. With 15 g/dL and 98 % saturation that is about 20 mL/dL; halve the haemoglobin and the content halves too — yet the **saturation stays at 98 %**, because every haemoglobin molecule that is there is still full. A pulse oximeter cannot see anaemia.

The tissues receive the **oxygen delivery**, $D_{\\mathrm{O_2}} = 10 \\times \\text{CO} \\times C_{a\\mathrm{O_2}}$: about 1000 mL a minute at rest, of which the body uses a quarter. When the content falls the body compensates. The tissues pull more oxygen off each red cell (helped by a rightward shift of the dissociation curve, see [[oxygen-transport]]), the heart pumps more — a faster pulse, palpitations, sometimes a flow murmur — and the kidneys release erythropoietin. Anaemia that develops over months is tolerated remarkably well; people sometimes walk into clinic with a haemoglobin of 6 g/dL. The same fall from sudden bleeding is far more dangerous, because the blood volume drops as well (see [[bleeding-shock]]). The heart pays for the compensation: in a person with narrowed coronary arteries, anaemia can bring on angina, and it can tip [[heart-failure]] over the edge.

The symptoms follow: tiredness, breathlessness on exertion, pale skin and inner eyelids, headaches, a racing heart, cold hands. Iron deficiency can add brittle nails, restless legs and cravings for ice; a lack of vitamin B12 can damage nerves, causing numbness, unsteadiness and memory problems.

### Three ways to become anaemic
1. **Losing blood** — obviously, after injury or childbirth, or hidden: heavy periods, bleeding from the stomach or bowel (ulcers, anti-inflammatory medicines, polyps, cancer), hookworm.
2. **Making too few red cells** — not enough iron (diet, pregnancy, growth, poor absorption as in [[celiac-disease]]), vitamin B12 or folate ([[vitamins-minerals]]; pernicious anaemia is an autoimmune loss of B12 absorption), too little erythropoietin in [[chronic-kidney-disease]], iron locked away by long-standing inflammation, or a failing marrow (leukaemia, aplastic anaemia).
3. **Destroying red cells** (haemolysis) — inherited: sickle cell disease, the thalassaemias, G6PD deficiency; or acquired: [[malaria]], autoimmune haemolysis, some medicines. Sickle cell and thalassaemia traits are common where malaria was common, because carriers are partly protected.

The red-cell size narrows the search: small cells (MCV below about 80 fL) suggest iron deficiency or thalassaemia; normal-sized cells, blood loss, kidney disease or inflammation; large cells (above about 100 fL), B12 or folate deficiency, alcohol, liver or thyroid disease. Ferritin measures the iron store (low means empty, but inflammation raises it), and the reticulocyte count shows whether the marrow is responding. Iron deficiency in a man or in a woman after the menopause is a reason to look for hidden bleeding in the gut, including bowel cancer.

### Treatment
Treatment is of the cause, plus replacing what is missing: iron by mouth or into a vein, vitamin B12 by injection or tablets, erythropoietin-like medicines in kidney disease, and transfusion when anaemia is severe or causing serious symptoms (see [[blood-groups]]). Iron supplements are not harmless: they upset the stomach, they are among the most dangerous overdoses in small children, and taking them without a diagnosis can hide the bleeding that caused the problem. The dose, the form and the length of treatment are for a doctor or pharmacist to decide.

> [!warn] Vomiting blood or material like coffee grounds, black tarry stools, heavy bleeding that will not slow, fainting, chest pain, or breathlessness at rest — call your local emergency number.
`,
  ideas: [
    'Anaemia is too little haemoglobin: below 13 g/dL in men and 12 g/dL in non-pregnant women (WHO, 2024).',
    'Oxygen content ≈ 1.34 × Hb × saturation: halve the haemoglobin and the content halves, while the saturation stays normal.',
    'The body compensates by extracting more oxygen and pumping more blood, so slow anaemia is tolerated far better than sudden blood loss.',
    'Three mechanisms — blood loss, too little production, too much destruction — and the cell size (MCV) points to the cause.',
    'Anaemia is a sign, not a diagnosis: the cause must be found, especially iron deficiency in men and older women.'
  ],
  pitfalls: [
    'My oxygen saturation is 98 %, so my blood carries plenty of oxygen — Saturation is the fraction of haemoglobin that is loaded, not the amount of haemoglobin. With half the haemoglobin, a 98 % reading carries half the oxygen.',
    'Anyone who is tired should take iron — Tiredness has many causes, iron does not help people who are not short of it, and self-treatment can mask bleeding that needs to be found.',
    'Anaemia is a disease in itself — It is a sign. Treating the number without finding the cause (a bleeding ulcer, coeliac disease, kidney disease) misses the real problem.'
  ],
  formulas: [
    {
      name: 'Oxygen content of arterial blood',
      expr: 'CaO2 = 1.34*Hb*S + 0.003*PaO2', tex: 'C_{a\\mathrm{O_2}} = 1.34\\,\\text{Hb}\\,S_{a\\mathrm{O_2}} + 0.003\\,P_{a\\mathrm{O_2}}',
      vars: {
        CaO2: { name: 'oxygen content (mL O₂ per dL of blood)', tex: 'C_{a\\mathrm{O_2}}' },
        Hb: { name: 'haemoglobin', q: 'hemoglobin', unit: 'g/dL', value: 15, tex: '\\text{Hb}' },
        S: { name: 'oxygen saturation', q: 'ratio', unit: '%', value: 98, min: 0, max: 100, tex: 'S_{a\\mathrm{O_2}}' },
        PaO2: { name: 'arterial oxygen pressure (mmHg)', value: 95, tex: 'P_{a\\mathrm{O_2}}' }
      },
      note: '1.34 mL is the oxygen one gram of haemoglobin can bind (values from 1.34 to 1.39 are quoted); 0.003 mL per dL per mmHg is the oxygen dissolved in plasma. The pressure is in mmHg, as blood-gas machines report it.',
      practice: { unknowns: ['CaO2', 'Hb'] },
      stories: { CaO2: 'A person has a haemoglobin of {Hb}, a saturation of {S} and an arterial oxygen pressure of {PaO2} mmHg. How much oxygen does 100 mL of arterial blood carry?', Hb: 'Arterial blood carries {CaO2} mL of oxygen per dL at a saturation of {S} and {PaO2} mmHg. What is the haemoglobin?' }
    },
    {
      name: 'Oxygen delivery',
      expr: 'DO2 = 10*CO*CaO2', tex: 'D_{\\mathrm{O_2}} = 10\\,\\text{CO}\\,C_{a\\mathrm{O_2}}',
      vars: {
        DO2: { name: 'oxygen delivery (mL O₂ per minute)', tex: 'D_{\\mathrm{O_2}}' },
        CO: { name: 'cardiac output (L/min)', value: 5, tex: '\\text{CO}' },
        CaO2: { name: 'oxygen content (mL O₂ per dL)', value: 20, tex: 'C_{a\\mathrm{O_2}}' }
      },
      note: 'The factor 10 turns litres into decilitres. At rest the body uses about 250 mL of oxygen a minute, a quarter of what is delivered; the rest returns in the veins as a reserve.',
      stories: { CO: 'To keep delivering {DO2} mL of oxygen a minute with blood that carries only {CaO2} mL per dL, what cardiac output does the heart need?', DO2: 'The heart pumps {CO} L/min of blood carrying {CaO2} mL of oxygen per dL. How much oxygen reaches the tissues each minute?' }
    }
  ],
  examples: [
    {
      title: 'What Maya\'s heart has to do',
      q: 'Before her anaemia Maya\'s haemoglobin was 13.5 g/dL; now it is 9.5 g/dL, with a normal saturation of 98 % and PaO₂ 95 mmHg. How much oxygen has each decilitre of her blood lost, and what cardiac output would keep her resting oxygen delivery unchanged if it had been 5 L/min?',
      steps: [
        'Before: $1.34 \\times 13.5 \\times 0.98 + 0.003 \\times 95 = 18.0$ mL/dL.',
        'Now: $1.34 \\times 9.5 \\times 0.98 + 0.003 \\times 95 = 12.8$ mL/dL — 29 % less.',
        'Same delivery needs $\\text{CO} = 5 \\times 18.0 / 12.8 = 7.1$ L/min, 40 % more blood each minute.',
        'In reality her tissues also extract more of the oxygen, so her resting heart rate rises less than that; but on the stairs, when demand quadruples, her heart reaches its limit sooner — the breathlessness she noticed.'
      ],
      a: 'Content falls from 18.0 to 12.8 mL/dL (29 %); unchanged delivery would need about 7.1 L/min instead of 5.'
    },
    {
      title: 'A normal oximeter reading',
      q: 'A man with a haemoglobin of 7 g/dL has a finger oximeter reading of 98 %. His brother, with a haemoglobin of 14 g/dL, reads the same. Compare their arterial oxygen content (PaO₂ 95 mmHg for both).',
      steps: [
        'Brother: $1.34 \\times 14 \\times 0.98 + 0.285 = 18.7$ mL/dL.',
        'Patient: $1.34 \\times 7 \\times 0.98 + 0.285 = 9.5$ mL/dL.',
        'Both read 98 % because the oximeter measures the fraction of haemoglobin carrying oxygen, not how much haemoglobin there is.'
      ],
      a: '9.5 against 18.7 mL/dL: the same saturation, half the oxygen.'
    },
    {
      title: 'Using the cell size',
      q: 'Three adults each have a haemoglobin of 10 g/dL. Their mean cell volumes are 68, 88 and 112 fL. Which causes would a doctor think of first for each?',
      steps: [
        '68 fL (small cells): iron deficiency — then look for why (periods, the gut, diet, coeliac disease) — or thalassaemia trait.',
        '88 fL (normal size): recent blood loss, kidney disease, long-standing inflammation, or a mixture of causes.',
        '112 fL (large cells): vitamin B12 or folate deficiency, alcohol, liver or thyroid disease, some medicines, or a marrow disorder.',
        'The size only sorts the possibilities; tests such as ferritin, B12, folate, kidney function and a blood film decide.'
      ],
      a: 'Small: iron or thalassaemia; normal: bleeding, kidneys, inflammation; large: B12 or folate, alcohol, liver, thyroid, marrow.'
    }
  ],
  quiz: [
    { q: 'A person with a haemoglobin of 8 g/dL and healthy lungs puts on a pulse oximeter. It most likely reads…', choices: ['about 97–99 %', 'about 50 %', 'about 80 %', 'nothing: it cannot find a pulse'], a: 0,
      why: 'Each haemoglobin molecule present is still fully loaded in the lungs, so the saturation is normal. What is missing is the amount of haemoglobin, which the oximeter does not measure.' },
    { q: 'What is the arterial oxygen content (mL per dL) with a haemoglobin of 10 g/dL, a saturation of 98 % and a PaO₂ of 95 mmHg?', answer: 13.4,
      why: '1.34 × 10 × 0.98 + 0.003 × 95 = 13.13 + 0.29 = 13.4 mL/dL — about two-thirds of the normal 20.' },
    { q: 'A 62-year-old man is found to have iron-deficiency anaemia. He eats a varied diet. What is the most important next step?', choices: ['look for hidden blood loss from the gut', 'start iron and repeat the test in a year', 'check his vitamin B12', 'advise him to eat more red meat'], a: 0,
      why: 'In men and in women after the menopause, iron deficiency without an obvious cause means blood loss until proven otherwise — often from the stomach or bowel, sometimes from a cancer that is curable if found early.' },
    { q: 'A slow fall in haemoglobin over months is usually better tolerated than a sudden fall of the same size from bleeding.', a: true,
      why: 'Over months the body adapts: plasma volume is kept up, the heart output rises and tissues extract more oxygen. Sudden bleeding also removes volume, so blood pressure and delivery fall together.' },
    { q: 'Why are sickle cell and thalassaemia traits common in parts of Africa, the Mediterranean and Asia?', choices: ['carriers are partly protected against severe malaria', 'they are caused by a poor diet', 'they spread from person to person', 'they are caused by the heat'], a: 0,
      why: 'Where malaria killed many children, carriers of these gene variants survived more often and passed them on — natural selection, which is why the traits map onto the old malaria belt.' }
  ],
  applications: ['Screening for anaemia in pregnancy and in young children, a global health priority.', 'Deciding when a patient needs a blood transfusion, and when iron or other treatment is enough.', 'Finding bowel cancer and coeliac disease early through the investigation of iron deficiency.', 'Understanding why a pulse oximeter can reassure falsely.'],
  sim: 'bi-oxygen-delivery'
},

{
  id: 'blood-groups', parent: 'blood', title: 'Blood groups and transfusion', level: 2,
  short: 'Red cells carry inherited surface markers — the A and B sugars and the RhD protein — and plasma carries antibodies against the markers a person lacks. Matching them makes transfusion safe, and the RhD system matters in pregnancy.',
  keywords: ['blood group', 'blood type', 'ABO', 'RhD', 'rhesus', 'O negative', 'universal donor', 'universal recipient', 'transfusion', 'cross-match', 'agglutination', 'haemolytic transfusion reaction', 'anti-D', 'haemolytic disease of the newborn', 'blood donation', 'Kell', 'Bombay'],
  prereq: ['blood-composition', 'antibodies', 'dna-genes'],
  related: ['anemia', 'pregnancy', 'bleeding-shock', 'dialysis-transplant', 'adaptive-immunity', 'chemistry:carbohydrates', 'math:probability-basics'],
  body: `
A motorcyclist reaches the emergency department bleeding heavily. There is no time to test his blood, so the team starts with units of group O red cells kept ready for exactly this, while a sample races to the laboratory. Within minutes the lab knows his group; within the hour it has matched blood of his own type against his plasma. Every step of that routine — which blood can go into whom, and the checks at the bedside — follows from a few rules about markers on red cells and antibodies in plasma.

### Markers and antibodies
The **ABO** markers are short sugar chains on the surface of red cells (see [[chemistry:carbohydrates|carbohydrates]]). One gene decides which enzyme you inherit: the A version adds one sugar, the B version another, and the O version makes a broken enzyme that adds neither. From infancy, everyone makes antibodies — mostly IgM (see [[antibodies]]) — against the A or B sugar they do *not* have, probably because gut bacteria carry look-alike sugars.

| Group | Markers on red cells | Antibodies in plasma | Can receive red cells from | Can receive plasma from |
|---|---|---|---|---|
| O | neither | anti-A and anti-B | O | O, A, B, AB |
| A | A | anti-B | A, O | A, AB |
| B | B | anti-A | B, O | B, AB |
| AB | A and B | neither | AB, A, B, O | AB |

The **RhD** marker is a protein: you are RhD-positive if you have it. RhD-negative people do not make anti-D naturally, only after meeting RhD-positive cells through a transfusion or a pregnancy — but once made, anti-D lasts.

For red cells the rule is: *the donor's markers must not meet the recipient's antibodies.* Group O RhD-negative red cells carry none of the three markers, so they are the **universal red-cell donor**; AB RhD-positive people have no anti-A, anti-B or anti-D and can receive any group. For plasma it flips, because now the antibodies are in the donated part: AB plasma, with no antibodies, can be given to anyone.

Group frequencies vary around the world: O is the commonest overall, B is more frequent in much of Asia than in Europe, and about 15 % of people of European ancestry are RhD-negative compared with fewer than 1 % in most of East Asia.

### When blood is mismatched
Give group A cells to a group O patient and the anti-A antibodies coat them, link them into clumps (**agglutination**) and switch on complement, which bursts them inside the vessels. Within minutes there can be fever, chills, back or chest pain, dark urine, a falling blood pressure and kidney failure; even a small volume can kill. Such reactions are now rare and nearly always come from a mix-up — blood taken from the wrong patient, or a unit hung on the wrong one — which is why samples are labelled at the bedside, a second sample is often required, and identity is checked against the unit before it goes in. Before routine transfusion the laboratory also screens the patient's plasma for antibodies against rarer groups and **cross-matches** the chosen units.

Other risks are more common but usually milder: fever, itching or hives, and circulatory overload in frail patients given too much too fast. Infections are very rare where every donation is tested for HIV, hepatitis B and C and syphilis. Beyond ABO and RhD there are more than 40 blood-group systems (Kell, Duffy, Kidd and others). People who need many transfusions, such as those with sickle cell disease or thalassaemia, can make antibodies against these too and then need blood matched more closely — often most easily found among donors of similar ancestry, one reason blood services seek donors from every community.

### RhD and pregnancy
If an RhD-negative mother carries an RhD-positive baby, a few of the baby's cells can cross into her blood, especially at birth, after a miscarriage, bleeding or an abdominal injury. She may then make anti-D, an IgG that crosses the placenta, and in a *later* RhD-positive pregnancy it can destroy that baby's red cells: haemolytic disease of the fetus and newborn, with anaemia, jaundice and, when severe, heart failure in the womb. Since the late 1960s this has been largely prevented by giving the mother **anti-D immunoglobulin**, ready-made antibody that clears the baby's cells before her own immune system notices them. Routine schedules and the use of a blood test that reads the baby's RhD type from the mother's blood vary by country (see [[pregnancy]]).

### Giving blood
A donation is about 470 mL, a little under a tenth of an adult's blood, and is split into components: red cells (kept refrigerated for about five to six weeks), plasma (frozen for months or longer) and platelets (only about a week at room temperature). Because platelets and some groups run short quickly, blood services depend on regular donors.

> [!warn] During or soon after a transfusion, fever, chills, a rash, breathlessness, chest or back pain, or dark urine must be reported to the staff at once. After leaving hospital, severe breathlessness, swelling of the face or throat, or collapse — call your local emergency number.
`,
  ideas: [
    'A and B are sugar markers and RhD a protein marker on red cells; plasma carries antibodies against the ABO markers a person lacks.',
    'Red cells: the donor\'s markers must not meet the recipient\'s antibodies — O RhD-negative is the universal red-cell donor.',
    'Plasma follows the opposite rule: AB plasma, free of anti-A and anti-B, can go to anyone.',
    'Anti-D is made only after exposure; anti-D immunoglobulin in pregnancy prevents haemolytic disease of the newborn.',
    'Serious reactions are rare and nearly always due to identification errors, hence the bedside checks.'
  ],
  pitfalls: [
    'People with group O have no antibodies — It is the other way round: group O plasma has both anti-A and anti-B. Group O red cells have no A or B markers, which is what makes them safe to give.',
    'The universal donor rule applies to every blood product — It applies to red cells. For plasma the universal donor is AB.',
    'An RhD-negative person reacts at once to their first RhD-positive transfusion — Usually not: anti-D is not present until the immune system has met RhD. The danger is the anti-D made afterwards, for later transfusions and pregnancies.'
  ],
  formulas: [
    {
      name: 'Chance that an RhD-negative mother\'s baby is RhD-positive',
      expr: 'Ppos = 1 - sqrt(fneg)', tex: 'P_+ = 1 - \\sqrt{f_-}',
      vars: {
        Ppos: { name: 'chance the baby is RhD-positive', q: 'ratio', unit: '%', tex: 'P_+' },
        fneg: { name: 'share of RhD-negative people among possible fathers', q: 'ratio', unit: '%', value: 15, min: 0, max: 100, tex: 'f_-' }
      },
      note: 'Hardy–Weinberg genetics: RhD-negative people carry two copies of the gene variant without RhD, so its frequency is the square root of the RhD-negative share, and a father passes it on with that probability. It assumes a partner chosen at random from a population in genetic equilibrium; a known father\'s type changes the answer.',
      stories: { Ppos: 'In a population where {fneg} of people are RhD-negative, what is the chance that an RhD-negative woman\'s baby (with a father from the same population) is RhD-positive?' }
    },
    {
      name: 'Rise in haemoglobin after a red-cell unit',
      expr: 'dHb = mHb/(10*BV)', tex: '\\Delta\\text{Hb} = \\frac{m_\\text{Hb}}{10\\, V_\\text{blood}}',
      vars: {
        dHb: { name: 'expected rise in haemoglobin', q: 'hemoglobin', unit: 'g/dL', tex: '\\Delta\\text{Hb}' },
        mHb: { name: 'haemoglobin in the unit (g)', value: 55, tex: 'm_\\text{Hb}' },
        BV: { name: 'recipient\'s blood volume (L)', value: 4.9, tex: 'V_\\text{blood}' }
      },
      note: 'The haemoglobin in a unit spread through the recipient\'s blood (the factor 10 turns litres into decilitres). Units hold roughly 40–70 g of haemoglobin. It is why one unit raises an average adult\'s haemoglobin by about 1 g/dL, and why children receive volumes calculated from their weight.',
      stories: { dHb: 'A red-cell unit holds {mHb} g of haemoglobin and the patient has {BV} L of blood. By how much should her haemoglobin rise?' }
    }
  ],
  examples: [
    {
      title: 'Choosing blood',
      q: 'A 30-year-old woman who is group A, RhD-negative, needs both red cells and plasma after a bleed. Which groups can she receive?',
      steps: [
        'Her plasma has anti-B, so red cells must carry no B: groups A or O.',
        'She is RhD-negative and could become pregnant: her red cells should be RhD-negative, to avoid her making anti-D.',
        'Red cells: A RhD-negative or O RhD-negative.',
        'Plasma must not contain anti-A: group A or AB plasma (RhD does not matter for plasma).'
      ],
      a: 'Red cells A− or O−; plasma A or AB.'
    },
    {
      title: 'An RhD-negative mother',
      q: 'In a population where 15 % of people are RhD-negative, what is the chance that an RhD-negative woman\'s baby is RhD-positive, if the father comes from the same population?',
      steps: [
        'Frequency of the variant without RhD: $q = \\sqrt{0.15} = 0.387$.',
        'The baby gets that variant from the mother for certain; it is RhD-negative only if the father passes it too, with probability 0.387.',
        '$P_+ = 1 - 0.387 = 0.613$ — about 61 %.',
        'Where only 0.5 % of people are RhD-negative the same calculation gives about 93 %.'
      ],
      a: 'About 61 %; this is why every pregnancy of an RhD-negative woman is managed as possibly RhD-positive unless the baby is shown to be negative.'
    },
    {
      title: 'One unit, two patients',
      q: 'A unit holds 55 g of haemoglobin. Estimate the rise it gives a 70 kg adult (blood volume 4.9 L) and a 40 kg teenager (2.8 L).',
      steps: [
        'Adult: $55 / (10 \\times 4.9) = 1.1$ g/dL.',
        'Teenager: $55 / (10 \\times 2.8) = 2.0$ g/dL.',
        'The same unit does twice as much in the smaller body, which is why paediatric transfusions are prescribed in millilitres per kilogram.'
      ],
      a: 'About 1.1 g/dL for the adult and 2.0 g/dL for the teenager.'
    }
  ],
  quiz: [
    { q: 'A group B, RhD-positive patient needs red cells. Which units are safe on ABO and RhD grounds?', choices: ['B+, B−, O+ and O−', 'B+ only', 'B+, AB+ and O+', 'any group, because he is RhD-positive'], a: 0,
      why: 'His plasma has anti-A, so no A markers: B or O. Being RhD-positive, he has no anti-D and can take positive or negative cells.' },
    { q: 'Why is AB plasma the universal plasma?', choices: ['it contains neither anti-A nor anti-B', 'it contains both A and B markers', 'AB is the rarest group', 'it has no clotting factors'], a: 0,
      why: 'In a plasma transfusion the antibodies are what is given. AB people make neither anti-A nor anti-B, so their plasma attacks no one\'s red cells.' },
    { q: 'People who are group O have no antibodies against A or B.', a: false,
      why: 'Group O plasma contains both anti-A and anti-B. It is group O red cells that have no A or B markers.' },
    { q: 'An RhD-negative man receives RhD-positive blood for the first time in an emergency. What is the main concern?', choices: ['he may make anti-D, which matters for any later RhD-positive transfusion', 'an immediate severe reaction', 'his blood group will change to RhD-positive', 'nothing, because RhD matters only in women'], a: 0,
      why: 'Anti-D is not present at first, so there is usually no immediate reaction. The risk is sensitisation: future RhD-positive blood could then be destroyed. In girls and women who may become pregnant this is avoided wherever possible.' },
    { q: 'The commonest cause of a serious ABO-incompatible transfusion is…', choices: ['a patient or sample identification error', 'a rare blood group missed by the lab', 'an infection in the donated blood', 'storing the blood too long'], a: 0,
      why: 'The ABO rules are simple; failures come from mix-ups — the wrong tube, the wrong patient, the wrong unit. That is why identity checks are repeated at every step.' }
  ],
  applications: ['Emergency transfusion with group O red cells before the patient\'s group is known.', 'Antenatal blood tests and anti-D immunoglobulin for RhD-negative mothers.', 'Matching blood for people with sickle cell disease and thalassaemia who need regular transfusion.', 'Organ and stem-cell transplantation, where ABO also matters.'],
  history: 'Karl Landsteiner described the A, B and O groups in 1901 (AB followed in 1902) and later helped discover the Rh system in 1940; blood banking grew from the first stored-blood depots of the 1930s and the Second World War.',
  sim: 'bi-blood-match'
},

{
  id: 'hemostasis', parent: 'blood', title: 'Clotting and bleeding', level: 2,
  short: 'How a leak in a blood vessel is sealed in minutes — the vessel narrows, platelets form a plug and a mesh of fibrin locks it in place — how the process is kept in check, what happens when it fails either way, and how anticoagulant and antiplatelet medicines interrupt it.',
  keywords: ['clotting', 'coagulation', 'haemostasis', 'hemostasis', 'platelets', 'fibrin', 'thrombin', 'von Willebrand', 'haemophilia', 'hemophilia', 'thrombosis', 'deep vein thrombosis', 'DVT', 'anticoagulant', 'antiplatelet', 'aspirin', 'warfarin', 'heparin', 'INR', 'prothrombin time', 'D-dimer', 'vitamin K', 'tranexamic acid'],
  prereq: ['blood-composition', 'blood-vessels', 'chemistry:enzyme-kinetics'],
  related: ['bleeding-shock', 'pulmonary-embolism', 'heart-attack', 'stroke', 'arrhythmias', 'atherosclerosis', 'how-drugs-work', 'side-effects-interactions'],
  body: `
You nick a finger slicing vegetables. The cut bleeds freely, slows within a minute or two and has stopped by about five minutes; by evening there is a dark scab. Ahmed, who takes an anticoagulant because of atrial fibrillation, finds the same small cut oozes for longer — the price of the protection the medicine gives him against stroke. Stopping a leak quickly without clotting the whole circulation is one of the body's finest balancing acts.

### Three steps
1. **The vessel narrows.** Injured muscle in the vessel wall contracts within seconds, cutting the flow.
2. **Platelets plug the hole.** The cut exposes collagen beneath the lining. A large sticky protein, von Willebrand factor, grabs the collagen and catches passing platelets. The platelets change shape, spread, and release signals — ADP and thromboxane A₂ — that call and activate more platelets, which link to each other through bridges of fibrinogen. Within minutes a soft platelet plug fills the gap.
3. **Fibrin locks it in.** Damaged tissue exposes *tissue factor*, which starts the **coagulation cascade**: a chain of enzymes, each activating many molecules of the next, so a tiny trigger is amplified into a burst of **thrombin** (see [[chemistry:enzyme-kinetics|enzyme kinetics]]). Thrombin cuts soluble fibrinogen into fibrin strands that knit through and around the plug, and it switches on more platelets and more of its own production. Several clotting factors (II, VII, IX and X) need vitamin K to be made, and the whole cascade needs calcium — which is why blood collected in tubes containing citrate or EDTA stays liquid.

### Brakes and clean-up
The healthy lining of every vessel releases substances that keep platelets calm, and the blood carries its own brakes — antithrombin, proteins C and S — so that a clot stays where the injury is. Once healing is under way, **plasmin** digests the fibrin (fibrinolysis), leaving fragments called D-dimers that can be measured in the blood.

### Too little clotting
- **Von Willebrand disease** is the commonest inherited bleeding disorder: up to 1 % of people have low levels, though far fewer have symptoms — nosebleeds, easy bruising, heavy periods, bleeding after dental work.
- **Haemophilia** A (lack of factor VIII) and B (factor IX) are carried on the X chromosome, so they mainly affect males, roughly 1 in 5 000 and 1 in 25 000 male births. The platelet plug forms, but without enough thrombin it is not reinforced: bleeding restarts, and bleeds into joints and muscles cause pain and, over years, damage. Replacement factors, a newer antibody that stands in for factor VIII, and gene therapies have transformed the outlook.
- **Too few platelets**, from immune destruction, marrow disease or chemotherapy, shows as pinpoint red spots and bruises.
- **Liver disease** (the liver makes most clotting factors) and **lack of vitamin K** — which is why newborns are offered vitamin K at birth (see [[birth-newborn]]).

### Too much clotting: thrombosis
Three conditions favour an unwanted clot: slow flow, a damaged vessel wall and blood that clots more readily. In the **veins** — after surgery, immobility, long journeys, cancer, pregnancy, oestrogen-containing medicines, or with inherited tendencies such as factor V Leiden, carried by about 5 % of people of European ancestry — clots of fibrin and trapped red cells form in the leg (deep vein thrombosis) and can break off to the lungs ([[pulmonary-embolism]]). In the **arteries**, platelet-rich clots form on ruptured fatty plaques and cause [[heart-attack|heart attacks]] and [[stroke|strokes]] (see [[atherosclerosis]]).

### Medicines that change clotting
| Kind | Examples (generic names) | What they block | Used for |
|---|---|---|---|
| Antiplatelets | aspirin; clopidogrel, ticagrelor | thromboxane made by platelets; the ADP receptor | heart attack, stents, some strokes |
| Heparins | heparin, enoxaparin | boost antithrombin | preventing and treating clots, in hospital |
| Vitamin K antagonist | warfarin | the making of factors II, VII, IX, X | atrial fibrillation, clots, mechanical valves |
| Direct oral anticoagulants | apixaban, rivaroxaban, edoxaban; dabigatran | factor Xa; thrombin | atrial fibrillation, vein clots |
| Clot-dissolvers | alteplase, tenecteplase | activate plasmin | selected strokes, heart attacks, massive lung clots |
| Antifibrinolytic | tranexamic acid | stops plasmin breaking fibrin | major bleeding, heavy periods |

Aspirin's effect lasts the life of the platelet, about 7–10 days, because platelets cannot make new enzyme. Warfarin is monitored with the **INR**, a standardised prothrombin time; many medicines and foods rich in vitamin K change it. Stopping or starting any of these medicines — for instance before surgery or after a stent — is a decision to make with the prescriber, because both bleeding and clotting can kill.

> [!warn] One swollen, painful leg needs a medical assessment the same day. Sudden breathlessness, chest pain that is worse on breathing in, coughing up blood, or collapse; bleeding that does not stop with firm pressure; or, in someone on an anticoagulant, a head injury, vomiting blood or black stools — call your local emergency number.
`,
  ideas: [
    'Haemostasis happens in three steps: the vessel narrows, platelets form a plug, and fibrin reinforces it.',
    'The coagulation cascade amplifies a small trigger into a burst of thrombin, which turns fibrinogen into fibrin.',
    'Brakes (antithrombin, proteins C and S) keep clots local, and plasmin removes them when the job is done.',
    'Bleeding disorders come from missing factors (haemophilia, von Willebrand disease) or too few platelets; thrombosis from slow flow, damaged walls and sticky blood.',
    'Antiplatelets act on the plug, anticoagulants on the cascade — mainly arterial and venous clots respectively.'
  ],
  pitfalls: [
    'Anticoagulants "thin" the blood — They do not make it runnier; they slow the making of fibrin. The viscosity of blood is unchanged.',
    'A clot in a leg vein and a clot in a heart artery are the same thing — Venous clots are mostly fibrin and red cells and are treated with anticoagulants; arterial clots are platelet-rich and prevented mainly with antiplatelets.',
    'In haemophilia even a small cut bleeds non-stop from the start — The platelet plug forms normally, so small cuts often stop at first; the problem is that the plug is not reinforced by fibrin, so bleeding restarts and deep bleeds into joints and muscles continue.'
  ],
  formulas: [
    {
      name: 'International normalised ratio (INR)',
      expr: 'INR = (PT/PTn)^ISI', tex: '\\text{INR} = \\left(\\frac{\\text{PT}}{\\text{PT}_\\text{n}}\\right)^{\\text{ISI}}',
      vars: {
        INR: { name: 'international normalised ratio', tex: '\\text{INR}' },
        PT: { name: 'the patient\'s prothrombin time', q: 'time', unit: 's', value: 30, tex: '\\text{PT}' },
        PTn: { name: 'mean normal prothrombin time for the laboratory', q: 'time', unit: 's', value: 12, tex: '\\text{PT}_\\text{n}' },
        ISI: { name: 'international sensitivity index of the reagent', value: 1.0, min: 0.5, max: 3, tex: '\\text{ISI}' }
      },
      note: 'The prothrombin time is how long plasma takes to clot after tissue factor and calcium are added. Reagents differ in sensitivity; raising the ratio to the ISI makes results comparable between laboratories. About 1 in healthy people; warfarin is usually aimed at 2–3 (higher for some mechanical valves).',
      practice: { unknowns: ['INR', 'PT'] },
      stories: { INR: 'A person on warfarin has a prothrombin time of {PT}; the laboratory\'s normal is {PTn} and its reagent has an ISI of {ISI}. What is the INR?', PT: 'What prothrombin time gives an INR of {INR} when the normal is {PTn} and the ISI is {ISI}?' }
    }
  ],
  examples: [
    {
      title: 'Reading an INR',
      q: 'A man taking warfarin has a prothrombin time of 30 s. The laboratory\'s mean normal is 12 s and its reagent has an ISI of 1.3. What is his INR, and what would it be with a reagent of ISI 1.0?',
      steps: [
        'Ratio: $30/12 = 2.5$.',
        'With ISI 1.3: $\\text{INR} = 2.5^{1.3} = 3.3$.',
        'With ISI 1.0: $\\text{INR} = 2.5$.',
        'The same clotting time means different things with different reagents — the reason the INR was introduced. A reading of 3.3 is above the usual 2–3 range; the prescriber decides whether any change is needed.'
      ],
      a: 'INR 3.3 with the ISI 1.3 reagent (2.5 if the ISI were 1.0).'
    },
    {
      title: 'A toddler\'s swollen knee',
      q: 'A boy of 14 months, just learning to walk, has a hot, swollen knee after a minor tumble, and large bruises from small knocks. His platelet count and prothrombin time are normal; the activated partial thromboplastin time (aPTT) is long. What is going on?',
      steps: [
        'Normal platelets: the plug-forming step is fine.',
        'Normal prothrombin time but long aPTT: the problem lies in the part of the cascade that uses factors VIII, IX, XI and XII.',
        'Bleeding into a joint after minor trauma in a boy is the classic pattern of haemophilia; factor VIII and IX levels would be measured.',
        'The family history may show affected male relatives on the mother\'s side, since the gene is on the X chromosome — though about a third of cases arise from a new mutation.'
      ],
      a: 'The pattern of haemophilia (A or B); factor levels confirm which.'
    },
    {
      title: 'Why aspirin lasts a week',
      q: 'Aspirin blocks a platelet enzyme permanently, and platelets live about 10 days. If about a tenth of the platelets are replaced each day, what fraction is fresh 5 days after the last dose?',
      steps: [
        'Fresh platelets after 5 days: $5 \\times 0.10 = 0.5$ — about half.',
        'After 7–10 days nearly all are new, which is why the effect wears off over a week or so.',
        'Whether to stop it before an operation is decided with the surgeon and the prescriber: after a heart stent, stopping antiplatelets early can cause the stent to clot.'
      ],
      a: 'About half the platelets are fresh after 5 days; nearly all after 10.'
    }
  ],
  quiz: [
    { q: 'Aspirin reduces clotting mainly by acting on…', choices: ['platelets, blocking thromboxane', 'fibrinogen', 'vitamin K', 'red cells'], a: 0,
      why: 'Aspirin permanently blocks the platelet enzyme that makes thromboxane A₂, a signal that recruits more platelets. Because platelets cannot make new enzyme, the effect lasts their lifetime.' },
    { q: 'A prothrombin time of 24 s, a normal of 12 s and an ISI of 1.0. What is the INR?', answer: 2,
      why: '(24/12)¹·⁰ = 2.0, within the range usually aimed for with warfarin.' },
    { q: 'A clot in a leg vein and a clot in a coronary artery are made the same way and prevented with the same medicines.', a: false,
      why: 'Venous clots form in slow flow and are mostly fibrin with trapped red cells, so anticoagulants prevent them. Arterial clots form on ruptured plaques in fast flow and are platelet-rich, so antiplatelets are the mainstay.' },
    { q: 'Why is vitamin K offered to newborn babies?', choices: ['newborns have little vitamin K, so they cannot make enough of several clotting factors', 'it prevents jaundice', 'it strengthens the platelets', 'it prevents blood-group problems'], a: 0,
      why: 'Little vitamin K crosses the placenta and the newborn gut has not yet been colonised by bacteria that make it, so a few babies bleed seriously — sometimes into the brain. A dose at birth prevents this.' },
    { q: 'In someone taking an anticoagulant, a bump on the head with no symptoms can safely be ignored.', a: false,
      why: 'Anticoagulants raise the risk of bleeding inside the skull, which may cause symptoms only hours later. Guidance is to seek urgent medical assessment after any significant head injury.' }
  ],
  applications: ['Preventing stroke in atrial fibrillation with anticoagulants.', 'Preventing clots after surgery and during long hospital stays.', 'Treating haemophilia with factor replacement and gene therapy.', 'Tranexamic acid in major trauma and bleeding after childbirth.'],
  sim: 'bi-clotting'
}

);
