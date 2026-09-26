/* HYPER-MEDICINE · content/diabetes.js — the topic "Glucose and diabetes": insulin and
 * glucose regulation, type 1 and type 2 diabetes, hypoglycaemia and the metabolic
 * syndrome. Simulations in sims/endocrine.js. */
Hyper.add(

/* ================================================================ glucose regulation */
{
  id: 'glucose-regulation', parent: 'diabetes', title: 'Insulin and glucose regulation', level: 1,
  short: 'Blood holds only about a teaspoon of glucose, yet the brain burns through that every hour or so. Insulin and glucagon from the pancreas, with the liver as a store, keep the level between about 4 and 8 mmol/L (70–140 mg/dL) through meals, fasting and exercise.',
  keywords: ['glucose', 'blood sugar', 'insulin', 'glucagon', 'pancreas', 'islets', 'beta cell', 'glycogen', 'liver', 'incretin', 'GLP-1', 'mmol/L', 'mg/dL', 'OGTT', 'post-meal walk'],
  prereq: ['metabolism-energy', 'hormone-feedback', 'macronutrients', 'chemistry:carbohydrates'],
  related: ['type1-diabetes', 'type2-diabetes', 'hypoglycemia', 'digestion-absorption', 'liver-function', 'physical-activity', 'adrenal-stress', 'chemistry:molarity'],
  body: `
Breakfast is two slices of toast and a glass of orange juice — about 50 g of carbohydrate, most of it ending up as glucose in the blood within an hour or two. If nothing removed it, that much glucose spread through the body's fluids would raise the level from about 5 to over 20 mmol/L (from 90 to over 360 mg/dL). In a healthy person it barely reaches 7 or 8 mmol/L (126–144 mg/dL) and is back near 5 within two hours. The difference is the work of **insulin**.

### A teaspoon in the bloodstream
At a normal fasting level of about 5 mmol/L (90 mg/dL), the 5 litres of blood hold only about 4.5 g of glucose — a level teaspoon. The brain alone uses about 120 g a day, around 5 g an hour, and cannot store any. So the supply must be topped up continuously: from the gut after meals, and from the liver between them. Glucose is measured in mmol/L in most of the world and in mg/dL in the US and some other countries; multiply mmol/L by 18 to get mg/dL.

| Situation (people without diabetes) | mmol/L | mg/dL |
|---|---|---|
| Fasting, after a night without food | about 3.9–5.5 | 70–99 |
| 2 hours after a 75 g glucose drink | below 7.8 | below 140 |
| Low: the hypoglycaemia alert level | below 3.9 | below 70 |

When healthy volunteers wore continuous glucose monitors in a 2019 study, they spent about 96 % of the day between 3.9 and 7.8 mmol/L (70–140 mg/dL).

### Two hormones pulling in opposite directions
The **islets of Langerhans**, clusters of cells making up only 1–2 % of the pancreas, contain beta cells that make insulin and alpha cells that make glucagon.
- **Insulin — the fed-state hormone.** It opens the door for glucose into muscle and fat (by moving GLUT4 transporters to the cell surface), tells the liver to stop releasing glucose and to store it as glycogen, promotes fat storage, and blocks the breakdown of fat into ketones.
- **Glucagon — the fasting hormone.** It makes the liver break down its glycogen (about 100 g, enough for roughly a day) and build new glucose from amino acids, lactate and glycerol. When insulin is low for long, fat is broken down and the liver turns fatty acids into **ketones**, a fuel the brain can use after a few days of fasting.

Adrenaline, cortisol and growth hormone also raise glucose — the body's defence against [[hypoglycemia|a low level]].

### How a beta cell tastes sugar
Glucose enters the beta cell and is burnt, raising its ATP. ATP closes potassium channels in the membrane; the cell depolarises, calcium floods in, and granules of insulin are released — a burst within minutes, then a sustained second phase. Sulfonylurea medicines close the same channel directly, which is why they can push glucose too low. The gut adds a boost: after a meal it releases the **incretin** hormones GLP-1 and GIP, which amplify insulin release, so glucose swallowed triggers far more insulin than the same rise given into a vein. Incretins account for roughly half to two-thirds of the insulin response to a meal, and GLP-1 medicines are built on them.

### Exercise and the time of day
Working muscle takes up glucose *without needing insulin*, which is why a 10–20 minute walk after eating lowers the post-meal peak — useful when insulin works poorly. After a fast the body relies on the liver, which releases about 2 mg of glucose per kilogram of body weight each minute. In the early morning, cortisol and growth hormone raise glucose a little (the dawn phenomenon).

### When the system fails
Diabetes is what happens when insulin is missing — [[type1-diabetes|type 1]] — or when the body resists it and the beta cells cannot keep up — [[type2-diabetes|type 2]]. Pregnancy hormones cause insulin resistance too, and some women develop gestational diabetes (see [[pregnancy]]).
`,
  ideas: [
    'The blood holds only about 4–5 g of glucose, so the gut and the liver must supply it continuously.',
    'Insulin moves glucose into muscle and fat, makes the liver store it, and stops fat breaking down into ketones.',
    'Glucagon makes the liver release glucose from glycogen and build new glucose between meals.',
    'Beta cells release insulin in proportion to glucose, boosted by incretin hormones from the gut.',
    'Contracting muscle takes up glucose without insulin, so activity after a meal lowers the peak.'
  ],
  pitfalls: [
    'Blood sugar comes only from food — Between meals and overnight almost all of it comes from the liver, which is why fasting glucose rises when the liver stops listening to insulin.',
    'Insulin is only about sugar — It also governs fat and protein. Without insulin, fat breakdown runs out of control and ketones build up: diabetic ketoacidosis.',
    'A glucose of 7 mmol/L (126 mg/dL) after lunch means diabetes — Levels up to about 7.8 mmol/L (140 mg/dL) two hours after food are normal. Diabetes is diagnosed with standardised fasting, glucose-drink or HbA1c tests.'
  ],
  formulas: [
    {
      name: 'How much glucose is in the blood',
      expr: 'm = G*V*M', tex: 'm = G\\, V\\, M',
      vars: {
        m: { name: 'mass of glucose dissolved', q: 'mass', unit: 'g' },
        G: { name: 'blood glucose concentration', q: 'glucose', unit: 'mmol/L', value: 5 },
        V: { name: 'volume of blood (or of body fluid)', q: 'volume', unit: 'L', value: 5 },
        M: { name: 'molar mass of glucose', q: 'molarmass', unit: 'g/mol', value: 180.16, fixed: true }
      },
      note: 'Amount = concentration × volume, and mass = amount × molar mass (see [[chemistry:molarity|molarity]]). Glucose also spreads through the fluid between cells, about 15 L in an adult, so the whole pool is closer to 13–15 g.',
      practice: { unknowns: ['m', 'G'] },
      stories: {
        m: 'An adult has {V} of blood with a glucose level of {G}. How many grams of glucose does it hold?',
        G: 'If {m} of glucose were dissolved in {V} of fluid, what would the concentration be?'
      }
    },
    {
      name: 'How long the blood\'s glucose would last',
      expr: 'T = m/r', tex: 'T = \\frac{m}{r}',
      vars: {
        T: { name: 'time until it would run out (hours)' },
        m: { name: 'glucose in the blood (g)', value: 4.5 },
        r: { name: 'rate at which the body uses glucose (g/h)', value: 8.4 }
      },
      note: 'At rest the body uses roughly 2 mg per kilogram per minute — about 8 g an hour for a 70 kg adult — and the brain alone about 5 g an hour. The result shows why the liver can never stop supplying glucose.',
      stories: {
        T: 'The blood of a resting adult holds {m} of glucose, and the body uses about {r}. If the liver stopped releasing glucose and nothing was eaten, how long would it last?'
      }
    }
  ],
  examples: [
    {
      title: 'A teaspoon of sugar',
      q: 'An adult has 5 L of blood at a glucose level of 5.0 mmol/L (90 mg/dL). How much glucose is that?',
      steps: [
        'Amount: $5.0\\ \\text{mmol/L} \\times 5\\ \\text{L} = 25$ mmol.',
        'Mass: $25\\ \\text{mmol} \\times 180.16\\ \\text{mg/mmol} = 4500$ mg $= 4.5$ g.',
        'About one level teaspoon of sugar — in all the blood of an adult.'
      ],
      a: 'About 4.5 g.'
    },
    {
      title: 'Why the liver never rests',
      q: 'A 70 kg adult at rest uses glucose at about 2 mg per kilogram per minute. How long would the 4.5 g in the blood last without the liver?',
      steps: [
        'Use: $2 \\times 70 = 140$ mg per minute, or $140 \\times 60 = 8400$ mg $= 8.4$ g per hour.',
        'Time: $4.5 / 8.4 = 0.54$ h, about 32 minutes.',
        'Glucose from the fluid between cells would stretch this a little, but the point stands: without the liver\'s steady output, a fasting person would run low within an hour or two.'
      ],
      a: 'About half an hour.'
    },
    {
      title: 'If nothing took it away',
      q: 'A drink containing 50 g of glucose is fully absorbed into about 15 L of body fluid. How much would the glucose level rise if no glucose were used or stored?',
      steps: [
        'Amount: $50\\ \\text{g} / 180.16\\ \\text{g/mol} = 0.278$ mol $= 278$ mmol.',
        'Rise: $278 / 15 = 18.5$ mmol/L, or $18.5 \\times 18 = 333$ mg/dL.',
        'In reality the rise in a healthy person is only 2–4 mmol/L (35–70 mg/dL): insulin sends the glucose into muscle, fat and the liver, and the liver stops adding its own.'
      ],
      a: 'About 18.5 mmol/L (333 mg/dL) — insulin prevents all but a small part of it.'
    }
  ],
  quiz: [
    { q: 'Which of these does insulin NOT do?', choices: ['Make the liver release glucose', 'Help muscle take up glucose', 'Make the liver store glucose as glycogen', 'Stop fat being broken down into ketones'], a: 0,
      why: 'Releasing glucose from the liver is glucagon\'s job; insulin switches it off.' },
    { q: 'Why does a walk after a meal lower the glucose peak, even in someone whose insulin works poorly?', choices: ['Working muscle takes up glucose without needing insulin', 'Walking makes the pancreas release glucagon', 'Walking stops the gut absorbing food', 'Sweat removes glucose from the body'], a: 0,
      why: 'Muscle contraction moves glucose transporters to the cell surface by a route that does not depend on insulin.' },
    { q: 'The brain needs insulin to take up glucose.', a: false,
      why: 'Brain cells take up glucose through transporters that do not depend on insulin — which is why the brain suffers first when glucose falls.' },
    { q: 'A glucose level of 7.8 mmol/L is how many mg/dL?', answer: 140, unit: 'mg/dL',
      why: '7.8 × 18.0 = 140 mg/dL — the upper limit of normal two hours after a glucose drink.' },
    { q: 'Glucose swallowed triggers more insulin than the same rise in glucose given into a vein. Why?', choices: ['The gut releases incretin hormones that boost insulin release', 'Swallowed glucose is sweeter', 'The vein destroys some of the insulin', 'The stomach makes insulin'], a: 0,
      why: 'GLP-1 and GIP from the gut amplify glucose-stimulated insulin release — the incretin effect.' }
  ],
  applications: ['Glucose meters and continuous glucose monitors.', 'The oral glucose tolerance test.', 'Timing activity after meals.', 'Medicines built on incretin hormones (GLP-1 receptor agonists).'],
  history: 'Paul Langerhans described the islets as a medical student in 1869. In 1889 Oskar Minkowski and Joseph von Mering showed that removing a dog\'s pancreas causes diabetes. Rosalyn Yalow and Solomon Berson\'s radioimmunoassay, developed in the late 1950s, first allowed insulin itself to be measured in blood.',
  sim: 'endo-meal'
},

/* ================================================================ type 1 diabetes */
{
  id: 'type1-diabetes', parent: 'diabetes', title: 'Type 1 diabetes', level: 2,
  short: 'An autoimmune disease in which the immune system destroys the insulin-making beta cells. It can start at any age, comes on over weeks with thirst, passing urine, tiredness and weight loss, and without insulin leads to diabetic ketoacidosis. With insulin, monitoring and support, people live full lives.',
  keywords: ['type 1 diabetes', 'autoimmune', 'beta cells', 'insulin', 'diabetic ketoacidosis', 'DKA', 'ketones', 'continuous glucose monitor', 'CGM', 'insulin pump', 'closed loop', 'time in range', 'autoantibodies', 'teplizumab', 'LADA'],
  prereq: ['glucose-regulation', 'autoimmunity'],
  related: ['hypoglycemia', 'type2-diabetes', 'acid-base-balance', 'control-of-breathing', 'chronic-kidney-disease', 'child-growth', 'lab-tests'],
  body: `
Over three weeks, nine-year-old Tomás had been drinking water constantly, getting up at night to pass urine, falling asleep after school and losing weight although he was always hungry. His mother took him to the doctor, who checked a drop of blood: glucose 24 mmol/L (432 mg/dL), ketones 3.4 mmol/L. He was in hospital that afternoon and started insulin the same day. He had **type 1 diabetes**, and nothing he or his parents did caused it.

### An autoimmune disease
In type 1 diabetes the immune system's T cells destroy the beta cells of the pancreas. Genes (especially HLA immune genes) raise the risk; what triggers the attack is not known, and viruses are among the suspects. The process starts years before symptoms, and it can be seen in blood tests as **autoantibodies** against beta-cell proteins. Doctors now describe three stages: two or more autoantibodies with normal glucose (stage 1), then abnormal glucose without symptoms (stage 2), then symptomatic diabetes (stage 3). Screening relatives in research programmes finds people early, and in 2022 the US approved **teplizumab**, an antibody that in its main trial delayed stage 3 by about two years in people at stage 2.

A 2022 modelling study estimated about 8.4 million people with type 1 diabetes worldwide in 2021. It is not only a childhood disease: a large share of cases — by several estimates a third or more — begin in adulthood, where they are often first mistaken for type 2.

### The warning symptoms
When most beta cells are gone, glucose rises above the level the kidneys can hold back (about 10 mmol/L, 180 mg/dL). Glucose spills into the urine and drags water with it: a lot of urine, bed-wetting in a child who was dry, great thirst, tiredness and weight loss — sometimes remembered as the four Ts: **toilet, thirsty, tired, thinner**. Blurred vision and thrush are common too. A simple finger-prick glucose test gives the answer in seconds, and it should be done the same day.

### Diabetic ketoacidosis (DKA)
Without insulin, the body behaves as if it were starving in the middle of plenty: the liver pours out glucose, fat is broken down uncontrollably, and the liver turns the fatty acids into **ketones**, which are acids. The blood turns acidic, and high glucose dehydrates the body through the urine. The breathing becomes deep and fast as the body blows off carbon dioxide to limit the acidity. A 2024 international consensus defines DKA as glucose of at least 11.1 mmol/L (200 mg/dL) or known diabetes, blood ketones of 3.0 mmol/L or more, and acidosis (pH below 7.3 or bicarbonate below 18 mmol/L). The **anion gap** (below) shows the extra acid. DKA can also happen with near-normal glucose, for example in people taking SGLT2 inhibitors, in pregnancy, or when not eating.

> [!warn] **Diabetic ketoacidosis** is an emergency. Vomiting, abdominal pain, deep or fast breathing, a fruity (pear-drop) smell on the breath, drowsiness or confusion in someone with diabetes — or in someone with thirst, passing a lot of urine and weight loss who has not been diagnosed — call your local emergency number. People with type 1 diabetes are taught to check ketones when glucose is high or they are ill, and never to stop their background insulin during illness, even when not eating: follow the sick-day plan from the diabetes team.

### Living with type 1 diabetes
Insulin is needed for life, given by pen injections or by a pump: a **background (basal)** insulin covers the liver's glucose output day and night, and **mealtime** insulin covers food. People learn to match insulin to carbohydrate, activity and illness in structured education courses — the amounts are individual and set with the diabetes team. **Continuous glucose monitors** read glucose every few minutes; an international consensus (2019) suggests aiming for more than 70 % of the day "in range", 3.9–10.0 mmol/L (70–180 mg/dL), with less than 4 % below 3.9 (70) and less than 1 % below 3.0 mmol/L (54 mg/dL). **Automated insulin delivery** (hybrid closed loop) links a pump and a monitor through an algorithm that adjusts insulin every few minutes. Islet transplantation helps a few people with severe problems, and stem-cell-derived islets are in early trials.

Good glucose control protects the body: the DCCT trial (1993) showed that intensive treatment cut the risk of eye, kidney and nerve damage by roughly half or more. With modern care, people with type 1 diabetes play sport at every level, have children, and work in almost any career.
`,
  ideas: [
    'Type 1 diabetes is autoimmune destruction of beta cells; it is not caused by diet or lifestyle.',
    'It can start at any age, often with thirst, passing a lot of urine, tiredness and weight loss over weeks.',
    'Without insulin, fat breaks down into ketones and diabetic ketoacidosis follows — an emergency.',
    'Treatment is lifelong insulin, increasingly with continuous monitors and automated delivery.',
    'Time in range (3.9–10 mmol/L, 70–180 mg/dL) above 70 % of the day is a common target.'
  ],
  pitfalls: [
    'Type 1 diabetes is caused by eating too much sugar — It is an autoimmune disease. Nothing the person or their family did caused it.',
    'Type 1 diabetes only begins in childhood — It can start at any age; adult-onset cases are common and are often mistaken for type 2 at first.',
    'Ketones only matter when glucose is very high — DKA can occur with near-normal glucose, especially with SGLT2 inhibitors, in pregnancy or when not eating; ketones are checked whenever a person with type 1 feels unwell.'
  ],
  formulas: [
    {
      name: 'The anion gap',
      expr: 'AG = Na - (Cl + HCO3)', tex: '\\text{AG} = \\mathrm{Na^+} - \\left(\\mathrm{Cl^-} + \\mathrm{HCO_3^-}\\right)',
      vars: {
        AG: { name: 'anion gap', q: 'concentration', unit: 'mmol/L', tex: '\\text{AG}' },
        Na: { name: 'sodium', q: 'concentration', unit: 'mmol/L', value: 134, tex: '\\mathrm{Na^+}' },
        Cl: { name: 'chloride', q: 'concentration', unit: 'mmol/L', value: 98, tex: '\\mathrm{Cl^-}' },
        HCO3: { name: 'bicarbonate', q: 'concentration', unit: 'mmol/L', value: 9, tex: '\\mathrm{HCO_3^-}' }
      },
      note: 'Blood is electrically neutral, so the "gap" stands for unmeasured anions such as albumin and phosphate. Ketones and lactate widen it. A normal gap is often about 4–12 mmol/L (mEq/L) without potassium, depending on the laboratory\'s analysers; a low albumin lowers it.',
      practice: { unknowns: ['AG', 'HCO3'] },
      stories: {
        AG: 'A young man with vomiting and deep breathing has sodium {Na}, chloride {Cl} and bicarbonate {HCO3}. What is his anion gap?',
        HCO3: 'With sodium {Na}, chloride {Cl} and an anion gap of {AG}, what is the bicarbonate?'
      }
    },
    {
      name: 'Time in range per day',
      expr: 'tin = f*Tday', tex: 't_{\\text{in}} = f \\times T_{\\text{day}}',
      vars: {
        tin: { name: 'time per day in the target range', q: 'time', unit: 'h', tex: 't_{\\text{in}}' },
        f: { name: 'percentage of readings in range', q: 'ratio', unit: '%', value: 70 },
        Tday: { name: 'length of a day', q: 'time', unit: 'h', value: 24, fixed: true, tex: 'T_{\\text{day}}' }
      },
      note: 'Continuous-monitor reports give percentages; turning them into hours and minutes makes them easier to picture. The same arithmetic gives time below range: 4 % of a day is about an hour, 1 % about 15 minutes.',
      practice: { unknowns: ['tin', 'f'] },
      stories: {
        tin: 'A continuous glucose monitor report shows {f} of readings in the target range. How many hours a day is that?',
        f: 'Glucose was in range for {tin} of the day. What percentage of the day is that?'
      }
    }
  ],
  examples: [
    {
      title: 'Tomás in the emergency department',
      q: 'Tomás\'s blood shows glucose 24 mmol/L (432 mg/dL), ketones 3.4 mmol/L, sodium 134, chloride 98 and bicarbonate 9 mmol/L. Does he have DKA?',
      steps: [
        'Glucose ≥ 11.1 mmol/L (200 mg/dL): yes, 24 mmol/L.',
        'Ketones ≥ 3.0 mmol/L: yes, 3.4 mmol/L.',
        'Acidosis: bicarbonate 9 mmol/L is below 18. Anion gap: $134 - (98 + 9) = 27$ mmol/L, well above normal — the extra acid is the ketones.',
        'All three criteria are met: diabetic ketoacidosis, treated in hospital with fluids, insulin into a vein and careful replacement of potassium.'
      ],
      a: 'Yes — DKA, with an anion gap of 27 mmol/L.'
    },
    {
      title: 'Reading a monitor report',
      q: 'A teenager\'s two-week continuous glucose monitor report shows 64 % in range and 3 % below 3.9 mmol/L (70 mg/dL). What do these mean in hours and minutes a day?',
      steps: [
        'In range: $0.64 \\times 24 = 15.4$ hours a day.',
        'Below range: $0.03 \\times 24 \\times 60 = 43$ minutes a day.',
        'Time below range meets the consensus target (under 4 %, about an hour); time in range is a little under the 70 % target. The report\'s daily pattern shows where the highs happen, which is what the diabetes team and the family work on.'
      ],
      a: 'About 15.4 hours in range and 43 minutes below range each day.'
    }
  ],
  quiz: [
    { q: 'What causes type 1 diabetes?', choices: ['The immune system destroys the insulin-making beta cells', 'Eating too much sugar in childhood', 'Insulin resistance caused by excess weight', 'A virus that infects the liver'], a: 0,
      why: 'It is autoimmune: T cells attack the beta cells, and autoantibodies can be found years before symptoms.' },
    { q: 'Type 1 diabetes only begins in childhood.', a: false,
      why: 'It can begin at any age, and a large share of cases start in adulthood.' },
    { q: 'Why is breathing deep and fast in diabetic ketoacidosis?', choices: ['The body is blowing off carbon dioxide to reduce the acidity of the blood', 'The lungs are infected', 'High glucose irritates the airways', 'The person is anxious'], a: 0,
      why: 'Ketone acids lower the pH. Breathing out more CO₂ removes carbonic acid and partly compensates.' },
    { q: 'Why must background insulin not be stopped during an illness, even if the person is not eating?', choices: ['The liver keeps releasing glucose and, without insulin, ketones build up', 'Insulin is needed to digest medicines', 'Stopping it makes glucose fall dangerously', 'Insulin prevents infections'], a: 0,
      why: 'Illness raises stress hormones, which push glucose and ketone production up. Background insulin is needed to hold the liver back; sick-day plans explain how to manage it.' },
    { q: 'A meter shows 21 mmol/L. What is that in mg/dL?', answer: 378, unit: 'mg/dL',
      why: '21 × 18.0 = 378 mg/dL.' }
  ],
  applications: ['Continuous glucose monitors, insulin pumps and automated insulin delivery.', 'Screening relatives for autoantibodies in research programmes.', 'School and workplace diabetes plans.', 'Islet transplantation and stem-cell research.'],
  history: 'In January 1922, 14-year-old Leonard Thompson, dying of diabetes in Toronto, became the first person treated with the insulin extracted by Frederick Banting, Charles Best, James Collip and John Macleod. The DCCT trial (1983–1993) proved that tighter control prevents much of the damage to eyes, kidneys and nerves.',
  sim: [{ id: 'endo-meal', params: { profile: 'none' } }, 'endo-a1c']
},

/* ================================================================ type 2 diabetes */
{
  id: 'type2-diabetes', parent: 'diabetes', title: 'Type 2 diabetes', level: 2,
  short: 'The common form of diabetes: the body resists insulin and the beta cells gradually fail to keep up. It develops silently over years, is diagnosed by fasting glucose, a glucose drink or HbA1c, and is treated with lifestyle change and medicines that also protect the heart and kidneys.',
  keywords: ['type 2 diabetes', 'insulin resistance', 'HbA1c', 'glycated haemoglobin', 'prediabetes', 'fasting glucose', 'OGTT', 'metformin', 'SGLT2 inhibitor', 'GLP-1 receptor agonist', 'remission', 'estimated average glucose', 'complications', 'retinopathy', 'neuropathy'],
  prereq: ['glucose-regulation', 'obesity', 'lab-tests'],
  related: ['metabolic-syndrome', 'hypertension', 'chronic-kidney-disease', 'atherosclerosis', 'healthy-diet', 'physical-activity', 'pregnancy', 'risk-communication', 'vision'],
  body: `
Rajesh is 52, drives a taxi and feels fine. At a routine check his HbA1c comes back at 7.2 % (55 mmol/mol); a repeat a few weeks later reads 7.0 % (53 mmol/mol). He has **type 2 diabetes** — like about nine in ten people with diabetes — and, like many of them, he found out by chance.

### A worldwide condition
The International Diabetes Federation's 2025 Atlas estimated about 589 million adults aged 20–79 living with diabetes in 2024, roughly one in nine, and more than four in ten of them undiagnosed. Numbers are rising fastest in low- and middle-income countries.

### What goes wrong
Two faults combine. **Insulin resistance**: liver, muscle and fat respond less to insulin, in part because fat stored in the liver and muscle interferes with insulin signalling. And **failing beta cells**: for years they compensate by making more insulin, keeping glucose normal; when they can no longer keep up, glucose climbs — first as "prediabetes", then as diabetes. Risk rises with excess weight (especially around the waist), inactivity, age, family history, a past pregnancy with gestational diabetes, polycystic ovary syndrome, short sleep and some medicines. People of South Asian, East Asian, African, Middle Eastern and Hispanic descent and many Indigenous peoples develop it at lower body weights and younger ages. Not everyone with type 2 diabetes is overweight.

### How it is diagnosed
The thresholds below are those of the American Diabetes Association (Standards of Care, 2025) and the WHO; without clear symptoms, a second abnormal result confirms the diagnosis.

| Test | Normal | Prediabetes (ADA) | Diabetes |
|---|---|---|---|
| Fasting plasma glucose | below 5.6 mmol/L (100 mg/dL) | 5.6–6.9 mmol/L (100–125 mg/dL) | 7.0 mmol/L (126 mg/dL) or more |
| 2 hours after a 75 g glucose drink (OGTT) | below 7.8 (140) | 7.8–11.0 (140–199) | 11.1 (200) or more |
| HbA1c | below 5.7 % (39 mmol/mol) | 5.7–6.4 % (39–47) | 6.5 % (48 mmol/mol) or more |
| Random glucose with classic symptoms | — | — | 11.1 (200) or more |

The WHO starts impaired fasting glucose at 6.1 mmol/L (110 mg/dL), and the UK uses an HbA1c of 6.0–6.4 % (42–47 mmol/mol) to mark high risk.

**HbA1c** is the percentage of haemoglobin with glucose attached. Red cells live about four months and glucose sticks to them in proportion to its level, so HbA1c reflects the average of the past two to three months, weighted towards the most recent weeks. The ADAG study (2008) related it to the **estimated average glucose** (below). HbA1c is misleading with anaemia, recent bleeding or transfusion, some haemoglobin variants, pregnancy and advanced kidney disease; glucose tests are used instead.

### What it does over the years
High glucose damages small blood vessels — in the eyes (retinopathy), kidneys (nephropathy) and nerves (neuropathy, especially in the feet) — and speeds [[atherosclerosis]], raising the risk of heart attack, stroke and poor circulation in the legs. Yearly eye screening, kidney tests (eGFR and urine albumin), foot checks, and control of blood pressure and cholesterol prevent much of this. In the UKPDS study (2000), each 1 percentage point lower HbA1c went with about 37 % fewer small-vessel complications and 14 % fewer heart attacks.

### Treatment
Lifestyle comes first: more activity, a better diet, sleep and not smoking. Substantial weight loss can put type 2 diabetes into **remission** — defined in 2021 as an HbA1c below 6.5 % (48 mmol/mol) at least three months after stopping glucose-lowering medicines. In the DiRECT trial (2017–18), 46 % of participants on an intensive weight-management programme were in remission after a year, and 86 % of those who lost 15 kg or more.

Medicines are chosen with a clinician according to heart and kidney health, weight, the risk of hypoglycaemia and cost:
- **metformin** reduces the liver's glucose output; long the first choice in many guidelines; stomach upset is common and vitamin B12 can fall over years;
- **SGLT2 inhibitors** make the kidneys pass glucose into the urine, and protect the heart and kidneys; genital thrush is common and ketoacidosis is a rare risk;
- **GLP-1 receptor agonists**, and the dual GIP/GLP-1 agonist tirzepatide, boost insulin when glucose is high, slow the stomach and reduce appetite, with weight loss and, for some, heart protection; nausea is common;
- DPP-4 inhibitors, sulfonylureas (effective and cheap, but they can cause hypoglycaemia), pioglitazone, and **insulin**, which many people need as the beta cells decline — a sign of the disease, not a personal failure.

> [!warn] Very high glucose over days — often in an older person with an infection — can cause the **hyperosmolar hyperglycaemic state**: extreme thirst, passing a lot of urine, then drowsiness and confusion. It is an emergency — call your local emergency number.
`,
  ideas: [
    'Type 2 diabetes combines insulin resistance with beta cells that can no longer compensate.',
    'Diabetes: fasting glucose ≥ 7.0 mmol/L (126 mg/dL), 2-hour OGTT ≥ 11.1 mmol/L (200 mg/dL) or HbA1c ≥ 6.5 % (48 mmol/mol), confirmed.',
    'HbA1c reflects the average glucose of the past two to three months.',
    'Over years, high glucose damages eyes, kidneys, nerves and large arteries; screening and risk-factor control prevent much of it.',
    'Weight loss can bring remission; medicines are chosen partly for their heart and kidney benefits.'
  ],
  pitfalls: [
    'Type 2 is "mild" diabetes — It causes the same eye, kidney, nerve and heart damage as type 1 if uncontrolled, and is a leading cause of blindness, kidney failure and amputation worldwide.',
    'Only overweight people get type 2 diabetes — Genes, age, ethnicity and fat stored in the liver matter; many people develop it at a "normal" weight.',
    'Needing insulin means the person has failed — Beta-cell function declines over time in most people with type 2 diabetes; insulin is a treatment of the disease\'s course, not a punishment.'
  ],
  formulas: [
    {
      name: 'Estimated average glucose from HbA1c',
      expr: 'eAG = (28.7*A1c - 46.7)/18.016', tex: '\\text{eAG} = \\frac{28.7\\,\\text{A1c} - 46.7}{18.016}',
      vars: {
        eAG: { name: 'estimated average glucose', q: 'glucose', unit: 'mmol/L', tex: '\\text{eAG}' },
        A1c: { name: 'HbA1c (%)', value: 7, min: 4, max: 16, tex: '\\text{A1c}' }
      },
      note: 'The ADAG study (Nathan and colleagues, 2008): in mg/dL, eAG = 28.7 × A1c − 46.7; dividing by 18.016 gives mmol/L, eAG ≈ 1.59 × A1c − 2.59. It describes averages over many people; an individual\'s true average can differ by 1–2 mmol/L (15–35 mg/dL).',
      practice: { unknowns: ['eAG', 'A1c'] },
      stories: {
        eAG: 'A person\'s HbA1c is {A1c} %. What average glucose does it correspond to?',
        A1c: 'A person\'s continuous monitor shows an average glucose of {eAG}. Roughly what HbA1c would you expect, in per cent?'
      }
    },
    {
      name: 'HbA1c in per cent and in mmol/mol',
      expr: 'IFCC = 10.929*(A1c - 2.15)', tex: '\\text{IFCC} = 10.929\\,(\\text{A1c} - 2.15)',
      vars: {
        IFCC: { name: 'HbA1c (mmol/mol, IFCC units)', tex: '\\text{IFCC}' },
        A1c: { name: 'HbA1c (%, NGSP/DCCT units)', value: 6.5, min: 4, max: 16, tex: '\\text{A1c}' }
      },
      note: 'The international master equation. The UK, Europe and Australia report mmol/mol; the US reports per cent. Key values: 5.7 % = 39, 6.5 % = 48, 7 % = 53, 8 % = 64 mmol/mol.',
      practice: { unknowns: ['IFCC', 'A1c'] },
      stories: {
        IFCC: 'An HbA1c is reported as {A1c} %. What is it in mmol/mol?',
        A1c: 'An HbA1c is reported as {IFCC} mmol/mol. What is it in per cent?'
      }
    }
  ],
  examples: [
    {
      title: 'Rajesh\'s results',
      q: 'Rajesh\'s HbA1c is 7.2 %, and 7.0 % on repeat. Convert the first to mmol/mol and to estimated average glucose.',
      steps: [
        'IFCC units: $10.929 \\times (7.2 - 2.15) = 55$ mmol/mol.',
        'Estimated average glucose: $28.7 \\times 7.2 - 46.7 = 160$ mg/dL, or $160/18.0 = 8.9$ mmol/L.',
        'Both results are at or above 6.5 % (48 mmol/mol), so the diagnosis is confirmed without symptoms.'
      ],
      a: '55 mmol/mol; average glucose about 8.9 mmol/L (160 mg/dL); type 2 diabetes confirmed.'
    },
    {
      title: 'Prediabetes by three definitions',
      q: 'Joanna\'s fasting glucose is 6.4 mmol/L (115 mg/dL) and her HbA1c is 6.1 % (43 mmol/mol). Where does she stand?',
      steps: [
        'ADA: fasting 5.6–6.9 mmol/L (100–125 mg/dL) and HbA1c 5.7–6.4 % (39–47 mmol/mol) — prediabetes on both.',
        'WHO: fasting 6.1–6.9 mmol/L (110–125 mg/dL) — impaired fasting glucose.',
        'UK: HbA1c 6.0–6.4 % (42–47 mmol/mol) — "high risk of diabetes".',
        'Every scheme agrees that she does not have diabetes yet but is at high risk — the moment when a lifestyle programme works best (see [[metabolic-syndrome]]).'
      ],
      a: 'Prediabetes (impaired fasting glucose, high risk) — not diabetes.'
    }
  ],
  quiz: [
    { q: 'Which result, confirmed on a repeat test, diagnoses diabetes?', choices: ['HbA1c 6.7 % (50 mmol/mol)', 'Fasting glucose 6.5 mmol/L (117 mg/dL)', '2-hour glucose-drink result 9.0 mmol/L (162 mg/dL)', 'Glucose 8 mmol/L (144 mg/dL) an hour after lunch'], a: 0,
      why: 'HbA1c ≥ 6.5 % (48 mmol/mol) is diagnostic. The fasting value and the 2-hour value are in the prediabetes ranges, and a value of 8 an hour after lunch can be normal.' },
    { q: 'HbA1c mainly reflects the average glucose over about…', choices: ['the past 2–3 months', 'the past 24 hours', 'the past week', 'the whole of life'], a: 0,
      why: 'Red cells live about four months, and the recent weeks count most, so HbA1c summarises roughly the past 2–3 months.' },
    { q: 'Needing insulin in type 2 diabetes shows that the person failed to follow their diet.', a: false,
      why: 'Beta-cell function usually declines over the years; many people eventually need insulin whatever their efforts.' },
    { q: 'How do SGLT2 inhibitors lower glucose?', choices: ['They make the kidneys pass glucose into the urine', 'They make the pancreas release more insulin whatever the glucose', 'They stop the gut absorbing carbohydrate', 'They block glucagon in the brain'], a: 0,
      why: 'They block the transporter that reclaims glucose from the kidney filtrate, so glucose leaves in the urine — an effect that also protects the heart and kidneys.' },
    { q: 'An HbA1c of 8.0 % is how many mmol/mol?', answer: 64, unit: 'mmol/mol',
      why: '10.929 × (8.0 − 2.15) = 63.9 ≈ 64 mmol/mol.' }
  ],
  applications: ['Screening adults for diabetes (the ADA recommends testing everyone from age 35, earlier with risk factors).', 'Diabetic eye-screening programmes.', 'Weight-management programmes aimed at remission.', 'Choosing medicines that protect the heart and kidneys.'],
  history: 'Metformin comes from a compound in goat\'s rue (French lilac), a plant used in folk medicine for diabetes symptoms; it was introduced in the late 1950s. The UK Prospective Diabetes Study (1977–1997) showed that better control of glucose and blood pressure prevents complications of type 2 diabetes.',
  sim: ['endo-a1c', { id: 'endo-meal', params: { profile: 't2' } }]
},

/* ================================================================ hypoglycaemia */
{
  id: 'hypoglycemia', parent: 'diabetes', title: 'Hypoglycaemia', level: 2,
  short: 'Blood glucose too low for the brain — below 3.9 mmol/L (70 mg/dL) is the alert level. The body defends itself with glucagon and adrenaline, causing shakiness and sweating; without treatment, confusion and unconsciousness follow. It is mostly a side effect of insulin and sulfonylureas, and is quickly treated with fast-acting sugar.',
  keywords: ['hypoglycaemia', 'hypoglycemia', 'low blood sugar', 'hypo', 'counter-regulation', 'glucagon', 'impaired awareness', '15-15 rule', 'sulfonylurea', 'insulin', 'alcohol', 'nocturnal hypoglycaemia', 'mg/dL', 'mmol/L'],
  prereq: ['glucose-regulation', 'adrenal-stress'],
  related: ['type1-diabetes', 'type2-diabetes', 'alcohol', 'first-aid-basics', 'epilepsy', 'recognising-emergencies', 'physical-activity'],
  body: `
It is mid-afternoon and David, who has type 2 diabetes and takes a sulfonylurea tablet, has worked through lunch. He feels shaky and sweaty, his heart is racing, and he snaps at a colleague over nothing. She has seen this before: she hands him a glass of orange juice and waits with him. Fifteen minutes later his meter reads 4.8 mmol/L (86 mg/dL), and he feels embarrassed but fine. He had a **hypo**.

### How low is low?
The brain runs almost entirely on glucose and cannot store it, so it is the first organ to suffer when the level falls. The International Hypoglycaemia Study Group (2017), followed by the American Diabetes Association, grades hypoglycaemia in people with diabetes:

| Level | Glucose | Meaning |
|---|---|---|
| Level 1 | below 3.9 mmol/L (70 mg/dL), down to 3.0 (54) | alert value: treat it |
| Level 2 | below 3.0 mmol/L (54 mg/dL) | clinically important, whatever the symptoms |
| Level 3 | any value | severe: confusion or unconsciousness needing another person's help |

UK services teach "4 is the floor": treat any reading below 4.0 mmol/L (72 mg/dL). In people without diabetes true hypoglycaemia is rare; it is confirmed only when symptoms, a low glucose measured at that moment and relief once glucose rises all come together.

### The body's defences, in order
Studies in healthy adults show a ladder of responses as glucose falls (the thresholds are approximate and shift with diabetes and recent hypos):

| Glucose falls to about | What happens |
|---|---|
| 4.4–4.6 mmol/L (80–83 mg/dL) | insulin release is switched off |
| 3.6–3.9 mmol/L (65–70 mg/dL) | glucagon and adrenaline are released, then cortisol and growth hormone |
| 2.8–3.1 mmol/L (50–55 mg/dL) | warning symptoms from adrenaline and nerves: shaking, sweating, pounding heart, hunger, anxiety, tingling lips |
| below about 2.8 mmol/L (50 mg/dL) | the brain runs short of fuel: poor concentration, confusion, blurred vision, slurred speech, odd behaviour, then drowsiness, seizures and unconsciousness |

Diabetes breaks this ladder. Injected insulin cannot be switched off; in type 1 diabetes the glucagon response is lost within a few years; and repeated hypos lower the threshold for warning symptoms until confusion comes first — **impaired awareness of hypoglycaemia**, affecting roughly a quarter of adults with long-standing type 1 diabetes. Carefully avoiding hypos for a few weeks can restore some awareness. At night, hypos may show only as nightmares, sweat-soaked sheets or a morning headache.

### Who is at risk, and why
Almost all hypoglycaemia in diabetes comes from **insulin** and **sulfonylureas** (and the similar meglitinides). Metformin, SGLT2 inhibitors, GLP-1 receptor agonists and DPP-4 inhibitors rarely cause it on their own. The usual triggers are a delayed or missed meal, less carbohydrate than planned, extra activity (the risk lasts for hours afterwards, including overnight) and **alcohol**, which stops the liver releasing glucose, so a hypo can strike during the night or the next morning. Kidney disease, older age and weight loss raise the risk. Outside diabetes, causes include some weight-loss surgery, rare insulin-making tumours, adrenal insufficiency and severe illness.

### What to do
For someone who is awake and can swallow safely, the widely taught **"15–15" approach** (ADA) is: take about 15 g of fast-acting carbohydrate — glucose tablets or gel, or a small glass of fruit juice or a non-diet soft drink — wait 15 minutes, check again, and repeat if still below 3.9 mmol/L (70 mg/dL); once recovered, eat a snack or meal if the next meal is not due soon. UK guidance uses 15–20 g. Chocolate and other fatty foods work more slowly. Each person's plan, agreed with their diabetes team, comes first.

> [!warn] If someone with diabetes is very drowsy, confused and cannot swallow safely, is having a seizure, or is unconscious: do not put food or drink in their mouth; if they are breathing, place them in the recovery position; call your local emergency number. Family and friends can be trained to give glucagon (as an injection or a nasal powder) if the person carries it. A hypo can look like drunkenness — medical ID helps others to recognise it.

People who drive are commonly taught to check their glucose before driving and not to drive below 5 mmol/L (90 mg/dL) — "five to drive" in the UK — and to stop safely at the first sign of a hypo.
`,
  ideas: [
    'Below 3.9 mmol/L (70 mg/dL) is the alert level; below 3.0 mmol/L (54 mg/dL) is clinically important; needing help is severe.',
    'As glucose falls the body switches off insulin, then releases glucagon and adrenaline; symptoms follow, then confusion.',
    'In diabetes the defences fail: injected insulin keeps acting, and repeated hypos blunt the warning symptoms.',
    'Insulin and sulfonylureas cause almost all hypos; missed meals, exercise and alcohol are the usual triggers.',
    'Treat with about 15 g of fast-acting sugar and recheck after 15 minutes; never give food by mouth to someone who cannot swallow.'
  ],
  pitfalls: [
    'Chocolate is the best treatment for a hypo — Its fat slows absorption. Glucose tablets, juice or a sugary drink work faster; a longer-lasting snack comes afterwards.',
    'Hypoglycaemia only happens in type 1 diabetes — People with type 2 diabetes taking insulin or sulfonylureas have hypos too, and older people are especially vulnerable.',
    'No symptoms means the glucose is fine — With impaired awareness the warning symptoms may be missing; the meter or monitor reading is what counts.'
  ],
  formulas: [
    {
      name: 'Glucose in mg/dL and mmol/L',
      expr: 'Gd = Gm*M/10', tex: 'G_{\\text{mg/dL}} = G_{\\text{mmol/L}} \\times \\frac{M}{10}',
      vars: {
        Gd: { name: 'glucose (mg/dL)', tex: 'G_{\\text{mg/dL}}' },
        Gm: { name: 'glucose (mmol/L)', value: 3.9, tex: 'G_{\\text{mmol/L}}' },
        M: { name: 'molar mass of glucose (g/mol = mg/mmol)', value: 180.16, fixed: true }
      },
      note: 'Why the factor is 18: one mmol of glucose weighs 180.16 mg, and a litre is 10 decilitres, so 1 mmol/L = 18.0 mg/dL. Key values: 3.0 = 54, 3.9 = 70, 7.8 = 140, 10.0 = 180, 11.1 = 200.',
      practice: { unknowns: ['Gd', 'Gm'] },
      stories: {
        Gd: 'A European leaflet says to treat glucose below {Gm}. What is that in mg/dL?',
        Gm: 'A meter set to American units reads {Gd}. What is that in mmol/L?'
      }
    }
  ],
  examples: [
    {
      title: 'A meter in the other units',
      q: 'A visitor\'s borrowed meter reads 54 mg/dL. Her own diabetes plan is written in mmol/L. What does the reading mean?',
      steps: [
        '$54 / 18.0 = 3.0$ mmol/L.',
        'That is the boundary of level 2 hypoglycaemia (below 3.0 mmol/L, 54 mg/dL) — well below the alert level of 3.9 (70).',
        'She should treat it at once with fast-acting sugar and recheck after 15 minutes.'
      ],
      a: '3.0 mmol/L — a significant hypo to treat straight away.'
    },
    {
      title: 'The 15–15 approach in practice',
      q: 'David\'s meter reads 3.3 mmol/L (59 mg/dL). He takes 15 g of fast-acting sugar; 15 minutes later it reads 4.6 mmol/L (83 mg/dL). His next meal is two hours away. What next?',
      steps: [
        '3.3 mmol/L is below 3.9: level 1 hypoglycaemia, so treatment was right.',
        'After 15 minutes 4.6 mmol/L is above 3.9, so a second dose of sugar is not needed.',
        'The fast sugar will be used up quickly and his sulfonylurea is still acting, so a snack with slower carbohydrate (a sandwich, a piece of fruit with some bread) prevents a second fall.',
        'Because hypos on a sulfonylurea can recur for hours, and this happened after a missed meal, it is worth discussing his treatment with his doctor.'
      ],
      a: 'Recovered — follow with a slower snack, and review his treatment.'
    }
  ],
  quiz: [
    { q: 'A person with diabetes has a glucose of 3.4 mmol/L (61 mg/dL) and feels nothing. What is it?', choices: ['Level 1 hypoglycaemia — it should be treated', 'Normal, because there are no symptoms', 'Level 2 hypoglycaemia', 'Only a problem if it causes symptoms'], a: 0,
      why: 'Below 3.9 mmol/L (70 mg/dL) is level 1 whatever the symptoms. Missing symptoms may even mean impaired awareness.' },
    { q: 'Why is alcohol risky for someone on insulin?', choices: ['It stops the liver releasing glucose, sometimes hours later', 'It contains too much sugar', 'It destroys insulin in the blood', 'It makes the kidneys lose glucose'], a: 0,
      why: 'Alcohol blocks the liver\'s production of new glucose, so the usual defence fails — often overnight or the next morning.' },
    { q: 'If a person with diabetes is unconscious, you should try to pour juice into their mouth.', a: false,
      why: 'They could choke or inhale it. Put them in the recovery position if they are breathing, call the emergency number, and give glucagon if trained and available.' },
    { q: 'What is impaired awareness of hypoglycaemia?', choices: ['Warning symptoms come only at lower glucose levels, sometimes after confusion has begun', 'Not knowing what a hypo is', 'A meter that reads too high', 'Hypos that happen only at night'], a: 0,
      why: 'Repeated hypos lower the threshold for the adrenaline response, so the early warning signs are lost.' },
    { q: 'Which medicine, taken alone, is most likely to cause hypoglycaemia?', choices: ['A sulfonylurea', 'Metformin', 'An SGLT2 inhibitor', 'A GLP-1 receptor agonist'], a: 0,
      why: 'Sulfonylureas make beta cells release insulin whatever the glucose level. The others lower glucose only when it is high, so they rarely cause hypos on their own.' }
  ],
  applications: ['Alarms on continuous glucose monitors.', 'Glucagon kits and training for families and schools.', 'Driving and workplace rules for people who use insulin.', 'Choosing diabetes medicines with a low risk of hypoglycaemia for older people.'],
  sim: 'endo-hypo'
},

/* ================================================================ metabolic syndrome */
{
  id: 'metabolic-syndrome', parent: 'diabetes', title: 'Metabolic syndrome', level: 2,
  short: 'A cluster of five measurements — a large waist, high triglycerides, low HDL cholesterol, raised blood pressure and raised fasting glucose. Any three together signal insulin resistance and roughly double the risk of heart disease and multiply the risk of type 2 diabetes about fivefold.',
  keywords: ['metabolic syndrome', 'insulin resistance', 'waist circumference', 'waist-to-height ratio', 'triglycerides', 'HDL', 'visceral fat', 'fatty liver', 'MASLD', 'HOMA-IR', 'prediabetes', 'Diabetes Prevention Program'],
  prereq: ['glucose-regulation', 'obesity', 'cholesterol-lipids', 'hypertension'],
  related: ['type2-diabetes', 'liver-disease', 'atherosclerosis', 'physical-activity', 'healthy-diet', 'risk-communication', 'sleep-apnea', 'energy-balance', 'reproductive-hormones'],
  body: `
At 45, Mark's annual health check lists five numbers, each only a little off: a waist of 104 cm, blood pressure 136/86 mmHg, triglycerides 2.0 mmol/L (177 mg/dL), HDL cholesterol 0.95 mmol/L (37 mg/dL) and fasting glucose 6.1 mmol/L (110 mg/dL). None of them alone would alarm most doctors. Together they have a name — the **metabolic syndrome** — and a common cause.

### Five measurements, one pattern
A joint statement of international heart, diabetes and obesity organisations in 2009 harmonised the definition: any **three of five**.

| Criterion | Threshold |
|---|---|
| Waist | population-specific: e.g. 94 cm or more in men and 80 cm or more in women of European origin (IDF); 102 and 88 cm in the US; 90 and 80 cm in South and East Asian people |
| Triglycerides | 1.7 mmol/L (150 mg/dL) or more, or on treatment |
| HDL cholesterol | below 1.0 mmol/L (40 mg/dL) in men, below 1.3 mmol/L (50 mg/dL) in women, or on treatment |
| Blood pressure | 130 systolic or 85 diastolic mmHg or more, or on treatment |
| Fasting glucose | 5.6 mmol/L (100 mg/dL) or more, or on treatment |

Laboratory reference ranges vary; these are decision thresholds, not "normal ranges". By most definitions it affects roughly one adult in four to one in three in many countries — about 35 % of US adults in 2011–2016.

### The common root: fat in the wrong places
Fat stored inside the abdomen, around the organs, and fat inside the liver itself (**metabolic dysfunction-associated steatotic liver disease**, the 2023 name for what was called non-alcoholic fatty liver disease — see [[liver-disease]]) are closely tied to **insulin resistance**. An insulin-resistant liver keeps making glucose and packs fat into triglyceride-rich particles, which raises triglycerides and lowers HDL. The pancreas compensates with extra insulin, which makes the kidneys hold on to salt and stirs the sympathetic nervous system, pushing blood pressure up. Low-grade inflammation completes the picture. Sleep apnoea and polycystic ovary syndrome often travel with it.

Insulin resistance can be estimated from fasting insulin and glucose (**HOMA-IR**, below), a research tool rather than a routine test. For the waist, the UK's NICE (2022) suggests a simpler check: keep your waist to less than half your height.

### Why it matters — and the debate
The syndrome roughly doubles the risk of cardiovascular disease over the next five to ten years and raises the risk of type 2 diabetes about fivefold. Some experts argue that the label adds little beyond measuring and treating each risk factor, and that overall heart risk is better estimated with calculators that also include age, smoking and LDL cholesterol. Its real value is as a flag: one abnormal number is a reason to check the other four.

### What helps
Every component improves with the same changes. A **5–10 % weight loss** lowers triglycerides, blood pressure and glucose and raises HDL; about 150 minutes a week of moderate activity plus strength exercise helps even without weight loss; so do a Mediterranean-style diet with fewer refined carbohydrates and sugary drinks, less alcohol, enough sleep and not smoking. In the **Diabetes Prevention Program** (2002), people with prediabetes who aimed for 7 % weight loss and 150 minutes of activity a week cut their progression to diabetes by 58 % compared with placebo; metformin cut it by 31 %. Medicines treat individual components when needed — blood pressure, cholesterol, glucose — and some weight-loss medicines improve several at once.
`,
  ideas: [
    'Metabolic syndrome is any three of: large waist, high triglycerides, low HDL, raised blood pressure, raised fasting glucose.',
    'Its common root is insulin resistance linked to fat inside the abdomen and the liver.',
    'It roughly doubles cardiovascular risk and multiplies type 2 diabetes risk about fivefold.',
    'Waist size, and waist-to-height ratio, say more about harmful fat than weight alone.',
    'Modest weight loss and regular activity improve every component; lifestyle programmes cut progression to diabetes by more than half.'
  ],
  pitfalls: [
    'Metabolic syndrome is a disease with its own special treatment — It is a cluster of risk factors; each one is measured and, where needed, treated, and lifestyle change improves them all.',
    'Only large weight loss helps — A 5–10 % loss already improves triglycerides, HDL, blood pressure and glucose.',
    'A normal BMI rules it out — Fat around the organs can be high at a normal weight, especially in some ethnic groups; waist and blood tests tell more.'
  ],
  formulas: [
    {
      name: 'Waist-to-height ratio',
      expr: 'R = w/h', tex: '\\text{WHtR} = \\frac{w}{h}',
      vars: {
        R: { name: 'waist-to-height ratio', tex: '\\text{WHtR}' },
        w: { name: 'waist circumference', q: 'length', unit: 'cm', value: 96 },
        h: { name: 'height', q: 'length', unit: 'cm', value: 175 }
      },
      note: 'NICE (UK, 2022): below 0.5 is healthy, 0.5–0.59 means increased risk, 0.6 or more high risk, for adults of any sex or ethnicity (with a BMI below 35). Measure the waist halfway between the lowest rib and the top of the hip bone.',
      practice: { unknowns: ['R', 'w'] },
      stories: {
        R: 'A man is {h} tall with a waist of {w}. What is his waist-to-height ratio?',
        w: 'A woman is {h} tall. Which waist measurement gives a waist-to-height ratio of {R}?'
      }
    },
    {
      name: 'HOMA-IR: insulin resistance from a fasting blood test',
      expr: 'HOMA = I*G/22.5', tex: '\\text{HOMA-IR} = \\frac{I \\times G}{22.5}',
      vars: {
        HOMA: { name: 'HOMA-IR', tex: '\\text{HOMA-IR}' },
        I: { name: 'fasting insulin (mU/L, the same as µU/mL)', value: 12 },
        G: { name: 'fasting glucose', q: 'glucose', unit: 'mmol/L', value: 5.8 }
      },
      note: 'The homeostasis model assessment (Matthews and colleagues, 1985); with glucose in mg/dL the divisor is 405. About 1 in lean, healthy adults; cut-offs for "insulin resistance" (often 2–3) depend on the population and the insulin assay, so it is used in research rather than for diagnosis.',
      practice: { unknowns: ['HOMA', 'I'] },
      stories: {
        HOMA: 'A fasting blood test shows insulin {I} and glucose {G}. What is the HOMA-IR?',
        I: 'Which fasting insulin gives a HOMA-IR of {HOMA} with a fasting glucose of {G}?'
      }
    },
    {
      name: 'Number needed to treat',
      expr: 'NNT = 1/(Rc - Rt)', tex: '\\text{NNT} = \\frac{1}{R_c - R_t}',
      vars: {
        NNT: { name: 'number needed to treat', tex: '\\text{NNT}' },
        Rc: { name: 'risk without the programme (control group)', q: 'ratio', unit: '%', value: 28.9, min: 0, max: 100, tex: 'R_c' },
        Rt: { name: 'risk with the programme', q: 'ratio', unit: '%', value: 14.4, min: 0, max: 100, tex: 'R_t' }
      },
      note: 'How many people must follow a programme for one of them to benefit over the trial\'s time span (see [[risk-communication|relative and absolute risk]]). The defaults are the Diabetes Prevention Program\'s three-year diabetes rates with placebo and with the lifestyle programme.',
      practice: { unknowns: ['NNT', 'Rt'] },
      stories: {
        NNT: 'Over three years, {Rc} of people with prediabetes in a control group developed diabetes, against {Rt} in a lifestyle programme. How many people must join the programme to prevent one case?',
        Rt: 'Without a programme, {Rc} of people develop diabetes over three years. If the programme\'s number needed to treat is {NNT}, what is the risk with it?'
      }
    }
  ],
  examples: [
    {
      title: 'Counting Mark\'s criteria',
      q: 'Mark (178 cm, of European origin) has a waist of 104 cm, blood pressure 136/86 mmHg, triglycerides 2.0 mmol/L (177 mg/dL), HDL 0.95 mmol/L (37 mg/dL) and fasting glucose 6.1 mmol/L (110 mg/dL). Does he meet the definition? What is his waist-to-height ratio?',
      steps: [
        'Waist 104 cm: above 94 cm (IDF, European men) and above 102 cm (US) ✓.',
        'Triglycerides 2.0 ≥ 1.7 mmol/L ✓; HDL 0.95 < 1.0 mmol/L ✓; blood pressure 136/86 ≥ 130/85 ✓; glucose 6.1 ≥ 5.6 mmol/L ✓.',
        'Five of five criteria: metabolic syndrome.',
        'Waist-to-height ratio: $104/178 = 0.58$ — increased risk, near the 0.6 "high" line.'
      ],
      a: 'All five criteria are met; the waist-to-height ratio is 0.58.'
    },
    {
      title: 'What "58 % fewer cases" means',
      q: 'In the Diabetes Prevention Program, the three-year risk of diabetes was 28.9 % with placebo and 14.4 % with the lifestyle programme. Find the absolute risk reduction and the number needed to treat.',
      steps: [
        'Absolute risk reduction: $28.9\\,\\% - 14.4\\,\\% = 14.5$ percentage points.',
        'Number needed to treat: $1/0.145 = 6.9$ — about seven people for three years to prevent one case of diabetes.',
        'The headline "58 %" is a relative reduction, calculated from the rates over the whole trial; the three-year figures give about 50 %. Both are relative; the 14.5 points and the NNT of 7 describe the benefit to an individual more directly.'
      ],
      a: 'An absolute reduction of 14.5 points; about 7 people need to take part for three years to prevent one case.'
    }
  ],
  quiz: [
    { q: 'How many of the five criteria are needed to meet the harmonised definition of metabolic syndrome?', choices: ['Any three', 'All five', 'Any two', 'The waist plus any one other'], a: 0,
      why: 'Since the 2009 harmonised statement, any three of the five qualify; an earlier IDF version made a large waist obligatory.' },
    { q: 'Which blood-fat pattern is typical of metabolic syndrome?', choices: ['High triglycerides and low HDL cholesterol', 'Low triglycerides and high HDL cholesterol', 'Very high LDL cholesterol alone', 'Normal fats, with only glucose raised'], a: 0,
      why: 'An insulin-resistant liver exports triglyceride-rich particles, which raises triglycerides and lowers HDL.' },
    { q: 'A person with a normal BMI cannot have metabolic syndrome.', a: false,
      why: 'Fat around the organs and in the liver can be high at a normal weight, particularly in some ethnic groups.' },
    { q: 'What is the waist-to-height ratio of a person 170 cm tall with a waist of 90 cm?', answer: 0.53,
      why: '90/170 = 0.53 — above 0.5, so increased risk by the NICE (2022) guide.' },
    { q: 'Which approach has the strongest evidence for preventing type 2 diabetes in people with prediabetes?', choices: ['A lifestyle programme with modest weight loss and regular activity', 'Vitamin supplements', 'A detox diet', 'Checking glucose more often'], a: 0,
      why: 'Large trials such as the Diabetes Prevention Program showed that modest weight loss and 150 minutes of activity a week cut progression by about half or more.' }
  ],
  applications: ['Health checks that measure waist, blood pressure, lipids and glucose together.', 'National diabetes prevention programmes.', 'Finding and managing fatty liver disease.', 'Explaining risk to patients in absolute terms.'],
  sim: { id: 'endo-meal', params: { profile: 'resistant' } }
}

);
