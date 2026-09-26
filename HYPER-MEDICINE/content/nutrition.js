/* HYPER-MEDICINE · content/nutrition.js — topic "nutrition": macronutrients, vitamins and
 * minerals, energy balance and body weight, and obesity. Simulations in sims/digestive.js. */
Hyper.add(

{
  id: 'macronutrients', parent: 'nutrition', title: 'Carbohydrates, fats and proteins', level: 1,
  short: 'The three nutrients we eat by the gram — carbohydrates and fats mainly as fuel, proteins mainly as building material — how much energy each carries, how food labels count it, and what current guidelines say about quality and proportions.',
  keywords: ['macronutrients', 'carbohydrates', 'sugar', 'starch', 'free sugars', 'fibre', 'fiber', 'fat', 'saturated fat', 'unsaturated fat', 'trans fat', 'omega-3', 'protein', 'essential amino acids', 'calories', 'kilocalories', 'kilojoules', 'Atwater factors', 'food label', 'glycaemic index', 'ultra-processed food'],
  prereq: ['metabolism-energy', 'chemistry:carbohydrates', 'chemistry:lipids', 'chemistry:amino-acids-proteins'],
  related: ['digestion-absorption', 'energy-balance', 'healthy-diet', 'vitamins-minerals', 'cholesterol-lipids', 'type2-diabetes', 'glucose-regulation'],
  body: `
Turn over a packet of breakfast cereal and the label says that 100 g holds 60 g of carbohydrate, 9 g of fibre, 10 g of protein and 6 g of fat — and 352 kcal (1 484 kJ). The energy figure is not measured by burning the cereal: it is calculated from the grams, using a few round numbers worked out by the American chemist Wilbur Atwater in the 1890s. Those numbers, and the nutrients behind them, are the start of understanding any diet.

### Fuels and building blocks
| Nutrient | Energy per gram | Main roles | Main sources |
|---|---|---|---|
| Carbohydrate | 4 kcal (17 kJ) | fuel, especially for the brain; stored as glycogen | grains, potatoes, fruit, legumes, sugar |
| Fibre | about 2 kcal (8 kJ), via gut bacteria | gut health, fullness, slower sugar absorption | whole grains, legumes, vegetables, fruit, nuts |
| Fat | 9 kcal (37 kJ) | energy store, cell membranes, hormones, carries vitamins A, D, E, K | oils, butter, nuts, meat, dairy |
| Protein | 4 kcal (17 kJ) | building and repair, enzymes, antibodies | fish, meat, eggs, dairy, legumes, grains |
| Alcohol | 7 kcal (29 kJ) | none needed | drinks |

$$E \\approx 4\\,m_\\text{carb} + 2\\,m_\\text{fibre} + 9\\,m_\\text{fat} + 4\\,m_\\text{protein} \\quad (\\text{kcal, grams})$$

One kilocalorie — the "Calorie" of food labels — is 4.184 kJ. Labels use rounded factors for each, so their kJ and kcal figures do not convert exactly.

**Carbohydrates** are sugars (glucose, fructose, sucrose, lactose), starches (long chains of glucose) and fibre (chains our enzymes cannot cut; see [[chemistry:carbohydrates]]). How fast a food raises blood glucose — its glycaemic index — depends on the food's structure as much as its sugar: whole grains, beans and intact fruit release glucose slowly; white bread, potatoes and sugary drinks quickly. WHO advises keeping **free sugars** (added sugars plus those in honey, syrups and juices) below 10 % of energy, and ideally below 5 % (2015), and eating at least 25 g of **fibre** a day from whole foods (2023); in many countries adults eat well under that.

**Fats** are mostly triglycerides ([[chemistry:lipids]]). *Saturated* fats (butter, fatty meat, cheese, coconut and palm oil) raise LDL cholesterol; *unsaturated* fats (olive and rapeseed oil, nuts, seeds, oily fish) do not, and two of them — the omega-3 and omega-6 families — are essential, because the body cannot make them. Industrial *trans* fats, from partly hydrogenated oils, are the most harmful: WHO has campaigned to eliminate them and many countries now ban them. WHO's 2023 guidance: total fat no more than about 30 % of energy, saturated fat below 10 %, trans fat below 1 %. Replacing saturated fat with unsaturated fat lowers LDL cholesterol and heart disease risk; replacing it with refined starch and sugar does not help. See [[cholesterol-lipids]].

**Proteins** are chains of twenty amino acids ([[chemistry:amino-acids-proteins]]), nine of them essential. The body cannot store surplus protein: it is burnt for energy or turned into glucose or fat. The reference intake for healthy adults is about 0.8 g per kg of body weight a day (WHO/FAO/UNU, 2007); some expert groups suggest a little more for older adults, to help keep muscle. Most people in high-income countries eat more than the reference. Plant proteins are complete when varied — beans with grains, for example.

### How much of each?
Many different diets are healthy — traditional Mediterranean, Japanese, vegetarian and others — so guidelines give wide ranges. The US National Academies (2005) suggest 45–65 % of energy from carbohydrate, 20–35 % from fat and 10–35 % from protein. Trials comparing low-carbohydrate and low-fat diets find similar average weight loss when both are followed, so the quality of the food matters more than the split: whole grains over refined, unsaturated fats over saturated and trans, plenty of vegetables, fruit, legumes and nuts — see [[healthy-diet]].

**Ultra-processed foods** — industrial products made mostly from refined ingredients and additives — are linked in large observational studies with obesity, type 2 diabetes and heart disease. In one tightly controlled 2019 study, people offered an ultra-processed diet ate about 500 kcal a day more than on a minimally processed one matched for nutrients. Which features matter most (energy density, softness, speed of eating, taste) is still being researched.

### When the balance is wrong
Too little food is still a leading cause of death in children: UNICEF, WHO and the World Bank estimated that in 2022 about 45 million children under five were wasted (dangerously thin) and 148 million stunted (short for their age) — while 37 million were overweight. Too much energy over years leads to weight gain ([[energy-balance]]); too much saturated and trans fat raises LDL cholesterol; sugary drinks feed tooth decay and weight gain; little fibre and many refined carbohydrates raise the risk of [[type2-diabetes|type 2 diabetes]].

> [!note] The numbers on this page describe populations, not rules for any one person. If counting calories, weighing food or worrying about eating is causing you distress, talk to a doctor — see [[eating-disorders]].
`,
  ideas: [
    'Energy per gram: carbohydrate and protein about 4 kcal, fat 9 kcal, alcohol 7 kcal, fibre about 2 kcal (1 kcal = 4.184 kJ).',
    'Carbohydrates and fats are mainly fuels; proteins are mainly building material, with nine essential amino acids.',
    'Quality matters more than the exact split: whole grains, unsaturated fats, legumes, vegetables and fruit; little free sugar, saturated or trans fat.',
    'WHO: free sugars below 10 % of energy (ideally 5 %), saturated fat below 10 %, trans fat below 1 %, at least 25 g of fibre a day.',
    'Adults need about 0.8 g of protein per kg of body weight a day; most in high-income countries eat more.'
  ],
  pitfalls: [
    'Carbohydrates are fattening, so low-carbohydrate diets always work better — In trials, low-carbohydrate and low-fat diets give similar average weight loss; the total energy and the quality of the food matter more.',
    'All fat is bad for the heart — Unsaturated fats from olive oil, nuts, seeds and fish are part of heart-healthy diets; it is saturated and especially trans fats that raise LDL cholesterol.',
    'More protein always means more muscle — Beyond the body\'s needs, extra protein is burnt for energy; muscle is built by training with adequate, not excessive, protein.'
  ],
  formulas: [
    {
      name: 'Energy from the macronutrients (Atwater factors)',
      expr: 'E = 4*carb + 2*fib + 9*fat + 4*prot', tex: 'E = 4\\,m_\\text{carb} + 2\\,m_\\text{fib} + 9\\,m_\\text{fat} + 4\\,m_\\text{prot}',
      vars: {
        E: { name: 'energy (kcal)' },
        carb: { name: 'carbohydrate, not counting fibre (g)', value: 60, tex: 'm_\\text{carb}' },
        fib: { name: 'fibre (g)', value: 9, tex: 'm_\\text{fib}' },
        fat: { name: 'fat (g)', value: 6, tex: 'm_\\text{fat}' },
        prot: { name: 'protein (g)', value: 10, tex: 'm_\\text{prot}' }
      },
      note: 'Grams in, kilocalories out (multiply by 4.184 for kJ). Label rules differ: EU labels count fibre at 2 kcal/g; US labels include fibre in total carbohydrate. Add 7 kcal per gram of alcohol.',
      practice: { unknowns: ['E', 'fat'] },
      stories: { E: 'A portion contains {carb} of carbohydrate, {fib} of fibre, {fat} of fat and {prot} of protein. How many kilocalories is it?', fat: 'A snack bar has {E}, with {carb} of carbohydrate, {fib} of fibre and {prot} of protein. How many grams of fat does it contain?' }
    },
    {
      name: 'The share of energy from fat',
      expr: 's = 9*fat/E', tex: 's_\\text{fat} = \\frac{9\\,m_\\text{fat}}{E}',
      vars: {
        s: { name: 'share of energy from fat', q: 'ratio', unit: '%', tex: 's_\\text{fat}', min: 0, max: 100 },
        fat: { name: 'fat (g)', value: 20, tex: 'm_\\text{fat}' },
        E: { name: 'total energy (kcal)', value: 600 }
      },
      note: 'The same pattern works for any nutrient: 4 × grams ÷ energy for carbohydrate or protein. Guidelines are usually written as shares of energy.',
      stories: { s: 'A meal provides {E} and contains {fat} of fat. What share of its energy comes from fat?', fat: 'To keep fat at {s} of a {E} day, how many grams of fat is that?' }
    },
    {
      name: 'Reference protein intake',
      expr: 'P = k*W', tex: 'P = k\\, W',
      vars: {
        P: { name: 'protein per day (g)' },
        k: { name: 'reference intake (g per kg of body weight per day)', value: 0.8 },
        W: { name: 'body weight (kg)', value: 70 }
      },
      note: 'A population reference for healthy adults (WHO/FAO/UNU 2007: about 0.8 g/kg). Needs differ in pregnancy, illness, kidney disease and old age; that is a question for a doctor or dietitian.',
      stories: { P: 'Using a reference intake of {k}, how much protein a day covers the needs of a healthy adult weighing {W}?' }
    }
  ],
  examples: [
    {
      title: 'Reading a cereal label',
      q: '100 g of cereal contain 60 g of carbohydrate, 9 g of fibre, 10 g of protein and 6 g of fat. Find the energy in kcal and kJ, and the share of energy from each nutrient.',
      steps: [
        'Carbohydrate $4 \\times 60 = 240$; fibre $2 \\times 9 = 18$; protein $4 \\times 10 = 40$; fat $9 \\times 6 = 54$. Total 352 kcal.',
        'In kJ with the label factors: $17 \\times 60 + 8 \\times 9 + 17 \\times 10 + 37 \\times 6 = 1\\,484$ kJ (converting 352 kcal directly gives 1 473 kJ — the rounding of the factors).',
        'Shares: carbohydrate $240/352 = 68$ %, fat $54/352 = 15$ %, protein $40/352 = 11$ %, fibre 5 %.',
        'A high-carbohydrate, low-fat food. Whether it is a good choice depends on how much of the carbohydrate is free sugar and how much fibre comes with it.'
      ],
      a: '352 kcal (about 1 480 kJ): 68 % from carbohydrate, 15 % from fat, 11 % from protein.'
    },
    {
      title: 'A fat swap',
      q: 'Someone eats about 2 000 kcal a day with 30 g of saturated fat. What share of energy is saturated fat? What if 10 g of it were replaced by unsaturated fat (say, cooking with rapeseed or olive oil instead of butter)?',
      steps: [
        '$30 \\times 9 = 270$ kcal; $270/2000 = 13.5$ % — above WHO\'s advice of less than 10 %.',
        'After the swap: $20 \\times 9 = 180$ kcal, $180/2000 = 9$ %. Total energy is unchanged; only the type of fat has changed.',
        'Swapping saturated for unsaturated fat lowers LDL cholesterol — a well-established way to reduce heart disease risk.'
      ],
      a: '13.5 % before, 9 % after the swap.'
    },
    {
      title: 'How much protein is that?',
      q: 'A healthy adult weighs 70 kg. What is the reference protein intake, and roughly what foods supply it?',
      steps: [
        '$0.8 \\times 70 = 56$ g a day.',
        'Approximate protein contents: an egg about 6 g; 100 g of cooked lentils about 9 g; a 250 mL glass of milk about 8 g; 100 g of cooked chicken about 30 g; two slices of wholegrain bread about 8 g.',
        'An egg, a glass of milk, a portion of lentils, some chicken and bread already give about 60 g — which is why most people in high-income countries meet their protein needs without trying.'
      ],
      a: 'About 56 g a day, easily met by a mixed diet.'
    }
  ],
  quiz: [
    { q: 'Which gives the most energy per gram?', choices: ['carbohydrate', 'protein', 'fat', 'alcohol'], a: 2,
      why: 'Fat carries about 9 kcal per gram, alcohol 7, carbohydrate and protein about 4. That is why oils and fatty foods are so energy-dense.' },
    { q: 'A snack has 10 g of fat, 20 g of carbohydrate and 5 g of protein. How many kilocalories does it provide?', answer: 190, unit: 'kcal',
      why: '$9 \\times 10 + 4 \\times 20 + 4 \\times 5 = 90 + 80 + 20 = 190$ kcal.' },
    { q: 'Low-carbohydrate diets always produce more weight loss than low-fat diets.', a: false,
      why: 'Head-to-head trials find similar average weight loss at one year. The diet a person can keep to, and the quality of the food, matter more than the split.' },
    { q: 'Which change to a diet lowers LDL cholesterol most reliably?', choices: ['replacing saturated fat with unsaturated fat', 'replacing saturated fat with white bread and sugar', 'cutting out all fat', 'eating more protein'], a: 0,
      why: 'Swapping saturated for unsaturated fat lowers LDL cholesterol and heart disease risk. Replacing it with refined carbohydrate gives little benefit, and some fat is essential.' },
    { q: 'Why is fibre counted at about 2 kcal per gram rather than 4?', choices: ['it is not a carbohydrate', 'human enzymes cannot digest it; gut bacteria ferment it and we absorb only part of its energy', 'it is burnt off by chewing', 'labels round it down to encourage people to eat it'], a: 1,
      why: 'Fibre passes the small intestine undigested; colon bacteria turn part of it into short-chain fatty acids that we absorb, giving roughly half the energy of digestible carbohydrate.' }
  ],
  applications: ['Reading nutrition labels in kcal and kJ.', 'Planning meals for sport, pregnancy, older age or illness with a dietitian.', 'Public-health rules on trans fats, sugar taxes and front-of-pack labels.', 'Managing type 2 diabetes and high cholesterol through diet.'],
  history: 'Wilbur Atwater measured the heat released by foods and the energy lost in urine and stools in the 1890s, arriving at the 4–9–4 factors still used on labels. The word "calorie" for food energy spread from his work.',
  sim: 'gi-plate'
},

{
  id: 'vitamins-minerals', parent: 'nutrition', title: 'Vitamins and minerals', level: 1,
  short: 'The micronutrients: thirteen vitamins and a set of mineral elements the body needs in milligrams or micrograms — what they do, who runs short, why more is not always better, and who really benefits from supplements.',
  keywords: ['vitamins', 'minerals', 'micronutrients', 'vitamin A', 'vitamin D', 'vitamin K', 'vitamin C', 'folate', 'folic acid', 'vitamin B12', 'iron', 'iodine', 'calcium', 'zinc', 'salt', 'sodium', 'potassium', 'anaemia', 'scurvy', 'rickets', 'supplements', 'fortification'],
  prereq: ['macronutrients', 'digestion-absorption'],
  related: ['anemia', 'bone-calcium', 'thyroid', 'pregnancy', 'healthy-diet', 'electrolytes', 'hypertension', 'poisoning-overdose', 'chemistry:molar-mass'],
  body: `
Amira, a 24-year-old student, has felt tired for months. She gets breathless on the stairs, and her periods are heavy. She eats mostly vegetarian food and drinks a lot of tea. A blood test shows anaemia with a very low ferritin, the body's iron store: iron deficiency, the commonest nutritional shortage in the world. Her story holds most of the themes of this page — a nutrient needed in milligrams, losses that raise the need, absorption that depends on the rest of the meal, and a problem that is common, easily missed and very treatable.

### What they are
**Vitamins** are organic molecules the body needs in small amounts and cannot make, or not enough of; many work as helpers for enzymes. There are thirteen. Four are **fat-soluble** (A, D, E, K): they are absorbed with fat and stored in the liver and fatty tissue, so shortages develop slowly and large excesses can build up. The rest — vitamin C and eight B vitamins — are **water-soluble**: stores are small (except for vitamin B12, which the liver keeps for years) and surplus leaves in the urine. **Minerals** are elements: calcium, phosphorus, magnesium, sodium, potassium and chloride are needed in grams or hundreds of milligrams; iron, zinc, iodine, selenium, copper and others in milligrams or micrograms.

| Nutrient | Main jobs | Good sources | Signs of shortage |
|---|---|---|---|
| Vitamin A | vision in dim light, immunity, skin | liver, dairy, eggs; orange and dark-green vegetables | night blindness, dry eyes, infections |
| Vitamin D | calcium absorption, bones | sunlight on the skin; oily fish, eggs, fortified foods | rickets in children, soft bones in adults |
| Vitamin K | clotting factors | green leafy vegetables; gut bacteria | bleeding (newborns receive it at birth) |
| Vitamin C | collagen, iron absorption | fruit, vegetables | scurvy: bleeding gums, poor healing |
| Folate | DNA synthesis, cell division | leafy greens, legumes, fortified flour | anaemia; spinal defects in the developing baby |
| Vitamin B12 | nerves, red blood cells | animal foods, fortified foods | anaemia, numbness, memory problems |
| Iron | haemoglobin, enzymes | meat, fish; legumes, greens, fortified cereals | anaemia, tiredness |
| Iodine | thyroid hormones | iodised salt, fish, dairy | goitre, underactive thyroid; impaired brain development before birth |
| Calcium | bones, teeth, nerves, muscles | dairy, fortified plant drinks, tofu, greens | weaker bones over years |

### Who runs short
Worldwide, WHO estimates that nearly a third of women aged 15–49 and about 40 % of young children were anaemic in 2019, with iron deficiency the main cause. Iodine deficiency is the world's leading preventable cause of impaired brain development; adding iodine to salt has cut it dramatically. In richer countries shortages cluster in particular groups: iron in people with heavy periods, in pregnancy and in young children; vitamin B12 in vegans who take no fortified foods and in older people who absorb it poorly (low stomach acid, some medicines such as metformin and acid suppressants); vitamin D in people who get little sun, have dark skin at high latitudes, or cover their skin. Laboratories report vitamin D as 25-hydroxyvitamin D: below about 25–30 nmol/L (10–12 ng/mL) is generally called deficient and 50 nmol/L (20 ng/mL) enough for most people (US Institute of Medicine, 2011), though the thresholds are debated and ranges vary between laboratories.

### Absorption and losses
Iron shows why "how much you eat" is only half the story. The body loses about 1 mg of iron a day; menstruation adds on average about another half to one milligram, much more when periods are heavy, and pregnancy a great deal more. Only a fraction of dietary iron is absorbed — roughly 15–35 % of the haem iron in meat and fish, a few per cent to about 20 % of the iron in plants, more with vitamin C in the same meal, less with tea, coffee or calcium. So the intake needed is the loss divided by the fraction absorbed, which is why reference intakes for women of reproductive age are more than twice those for men (18 mg against 8 mg a day in the US).

### More is not always better
**Salt** is the micronutrient most people eat too much of: WHO recommends less than 5 g of salt (2 g of sodium) a day, while the world average is around 11 g (WHO, 2023), mostly from bread, processed foods and restaurant meals rather than the salt cellar. Labels may give sodium: salt = sodium × 2.5. Cutting salt lowers blood pressure ([[hypertension]]), and potassium from fruit and vegetables helps too. High doses of vitamin A in pregnancy can harm the baby, too much vitamin D raises blood calcium, and iron tablets are a classic cause of serious poisoning in small children.

> [!warn] If a child swallows iron tablets or adult vitamins containing iron, get help at once even if the child seems well (a poison centre can also advise) — call your local emergency number.

### Supplements: who benefits
For well-nourished adults, trials have not shown that multivitamins prevent heart disease or cancer, and beta-carotene supplements raised lung cancer risk in people who smoke (US Preventive Services Task Force, 2022). Specific groups do benefit: folic acid from before conception into early pregnancy prevents many spinal defects (health services advise it, and many countries fortify flour); vitamin D for people who get little sun, including many people in winter at high latitudes; vitamin B12 for vegans; iron when a deficiency is found — and then the cause must be found too. Newborns receive vitamin K. Which, if any, suit you is a question for a doctor, pharmacist or dietitian, who will also check for interactions.
`,
  ideas: [
    'Vitamins are organic molecules needed in small amounts; A, D, E and K are fat-soluble and stored, C and the B vitamins water-soluble with small stores (except B12).',
    'Iron, iodine, vitamin A and folate shortages remain major global problems; fortification and supplementation programmes prevent much of the harm.',
    'The intake you need is the loss divided by the fraction absorbed — so absorption and losses matter as much as diet.',
    'Salt is the micronutrient most people overeat: WHO advises under 5 g a day (salt ≈ 2.5 × sodium).',
    'Supplements help specific groups (folic acid in pregnancy, B12 for vegans, vitamin D with little sun, iron when deficient); for most well-fed adults they do not prevent disease.'
  ],
  pitfalls: [
    'Vitamins are natural, so large doses are harmless — Fat-soluble vitamins accumulate: excess vitamin A can harm a developing baby, too much vitamin D raises calcium, and iron overdoses can kill small children.',
    'Tiredness means you need a multivitamin — Tiredness has many causes; if it is iron deficiency, the cause of the deficiency (often blood loss) must be found, not just treated.',
    'The salt you add at the table is where most of your salt comes from — In most diets, three-quarters or more comes from bread, processed foods and meals eaten out.'
  ],
  formulas: [
    {
      name: 'Salt from sodium',
      expr: 'salt = Na*MNaCl/MNa', tex: 'm_\\text{salt} = m_\\text{Na}\\,\\frac{M_\\text{NaCl}}{M_\\text{Na}}',
      vars: {
        salt: { name: 'salt (sodium chloride)', q: 'mass', unit: 'g', tex: 'm_\\text{salt}' },
        Na: { name: 'sodium', q: 'mass', unit: 'g', value: 2, tex: 'm_\\text{Na}' },
        MNaCl: { name: 'molar mass of sodium chloride', q: 'molarmass', unit: 'g/mol', value: 58.44, fixed: true, tex: 'M_\\text{NaCl}' },
        MNa: { name: 'molar mass of sodium', q: 'molarmass', unit: 'g/mol', value: 22.99, fixed: true, tex: 'M_\\text{Na}' }
      },
      note: 'Sodium is 39 % of the mass of salt, so salt ≈ 2.54 × sodium. WHO: less than 2 g of sodium, 5 g of salt, a day for adults.',
      stories: { salt: 'A ready meal\'s label lists {Na} of sodium. How much salt is that?', Na: 'WHO advises adults to eat less than {salt} of salt a day. How much sodium is that?' }
    },
    {
      name: 'Iron needed in the diet',
      expr: 'I = L/f', tex: 'I = \\frac{L}{f}',
      vars: {
        I: { name: 'iron needed in the diet per day', q: 'mass', unit: 'mg' },
        L: { name: 'iron lost per day', q: 'mass', unit: 'mg', value: 1.1 },
        f: { name: 'share of dietary iron absorbed', q: 'ratio', unit: '%', value: 18, min: 1, max: 50 }
      },
      note: 'About 18 % of the iron in a mixed diet with meat is absorbed; perhaps 10 % from a vegetarian diet. Losses: about 1 mg a day, more with menstruation, much more in pregnancy or with any bleeding.',
      stories: { I: 'Someone loses {L} of iron a day and absorbs {f} of the iron they eat. How much iron must the diet supply each day?', f: 'A diet supplies {I} of iron a day and just covers losses of {L}. What share of the iron is being absorbed?' }
    }
  ],
  examples: [
    {
      title: 'Salt on the label',
      q: 'A ready meal lists 1.2 g of sodium. How much salt is that, and what fraction of WHO\'s daily limit of 5 g?',
      steps: [
        'Salt $= 1.2 \\times 58.44/22.99 = 1.2 \\times 2.54 = 3.05$ g.',
        '$3.05/5 = 0.61$: about 60 % of the day\'s limit in one meal.',
        'Bread, cheese, processed meats, sauces and soups add up fast, which is why most people eat about twice the advised amount without using a salt cellar.'
      ],
      a: 'About 3 g of salt, some 60 % of the daily limit.'
    },
    {
      title: 'Why some people need more than twice as much iron',
      q: 'A man loses about 1.1 mg of iron a day; a woman with heavy periods may lose 3.2 mg. With 18 % of dietary iron absorbed, how much must each eat? What if a vegetarian diet absorbs only 10 %?',
      steps: [
        'Man: $1.1/0.18 = 6.1$ mg a day.',
        'Woman with heavy periods: $3.2/0.18 = 17.8$ mg a day — close to the US reference intake of 18 mg for women of reproductive age, which is set to cover people with heavy losses.',
        'At 10 % absorption: $3.2/0.10 = 32$ mg a day, hard to reach from food alone — which is why iron deficiency is common with heavy periods and plant-based diets, and why vitamin C with meals (and tea between rather than with meals) helps.'
      ],
      a: 'About 6 mg for the man, about 18 mg for the woman, and about 32 mg if only 10 % is absorbed.'
    },
    {
      title: 'Case: Amira\'s tiredness',
      q: 'Amira, 24, is tired and breathless, with heavy periods and a mostly vegetarian diet. Her haemoglobin and ferritin are low. What is likely, and what happens next?',
      steps: [
        'Low haemoglobin with low ferritin points to iron-deficiency anaemia (reference ranges vary between laboratories; WHO uses a ferritin below 15 µg/L (15 ng/mL) in adults as a sign of depleted iron stores).',
        'The cause matters as much as the treatment: heavy periods are the likely source here and can themselves be treated. In men and in women after menopause, iron deficiency calls for a search for bleeding from the gut.',
        'Her doctor would discuss replacing iron (usually tablets, sometimes an infusion) and checking that the levels recover, plus diet: iron-rich legumes and greens, vitamin C with meals, tea between meals.',
        'Most people feel much better within weeks as haemoglobin rises; the stores take months to refill.'
      ],
      a: 'Iron-deficiency anaemia from heavy periods and low absorption; treat both the deficiency and its cause.'
    }
  ],
  quiz: [
    { q: 'Which of these vitamins is fat-soluble?', choices: ['vitamin C', 'vitamin B12', 'vitamin D', 'folate'], a: 2,
      why: 'Vitamins A, D, E and K are fat-soluble: absorbed with fat and stored in the body. Vitamin C and the B vitamins (including folate and B12) are water-soluble.' },
    { q: 'Because vitamins are natural, taking large doses is always harmless.', a: false,
      why: 'Excess vitamin A can harm a developing baby and the liver, excess vitamin D raises blood calcium, and iron overdoses are dangerous for children. The dose makes the poison.' },
    { q: 'A label lists 2.4 g of sodium. How many grams of salt is that?', answer: 6.1, unit: 'g',
      why: 'Salt ≈ 2.54 × sodium: $2.4 \\times 2.54 = 6.1$ g — more than WHO\'s whole-day limit of 5 g.' },
    { q: 'Who is most at risk of vitamin B12 deficiency?', choices: ['a vegan who eats no fortified foods and takes no supplement', 'someone who eats meat every day', 'someone who drinks a lot of milk', 'someone who drinks orange juice every day'], a: 0,
      why: 'B12 is found naturally only in animal foods. Vegans need fortified foods or a supplement; older people and people on some medicines can also absorb it poorly.' },
    { q: 'Which would increase the iron absorbed from a lentil meal?', choices: ['a cup of tea with it', 'peppers or a glass of orange juice with it', 'a calcium tablet with it', 'coffee straight after it'], a: 1,
      why: 'Vitamin C keeps plant (non-haem) iron in an absorbable form. Tea, coffee and calcium reduce iron absorption when taken with the meal.' }
  ],
  applications: ['Salt iodisation and flour fortification with iron and folic acid, among the most cost-effective public-health measures.', 'Vitamin A supplementation for young children where deficiency is common.', 'Screening for anaemia in pregnancy.', 'Reading sodium on labels and choosing lower-salt foods.'],
  history: 'In 1747 the naval surgeon James Lind gave pairs of sailors with scurvy different remedies; the two given oranges and lemons recovered fastest — one of the first controlled trials. The substance responsible, vitamin C, was identified in 1932.'
},

{
  id: 'energy-balance', parent: 'nutrition', title: 'Energy balance and body weight', level: 2,
  short: 'Weight changes when energy in and energy out differ — but energy out changes as weight changes. Why the old rule of 7 700 kcal per kilogram (3 500 kcal per pound) overestimates long-term change, and what a body that adapts actually does.',
  keywords: ['energy balance', 'calories in calories out', 'basal metabolic rate', 'BMR', 'resting energy expenditure', 'total daily energy expenditure', 'physical activity level', 'Mifflin–St Jeor', '3500 calorie rule', '7700 kcal per kg', 'metabolic adaptation', 'adaptive thermogenesis', 'weight regain', 'appetite', 'set point'],
  prereq: ['macronutrients', 'metabolism-energy', 'physics:first-law-thermodynamics', 'math:exponential-models'],
  related: ['obesity', 'physical-activity', 'healthy-diet', 'hormone-feedback', 'eating-disorders', 'thermoregulation', 'math:differential-equations-intro'],
  body: `
Daniel gives up his daily can of sugary soft drink — about 140 kcal — and changes nothing else. A rule repeated in magazines and even textbooks says that a kilogram of body fat holds 7 700 kcal (3 500 kcal per pound), so he should lose $140 \\times 365 / 7700 = 6.6$ kg a year, and 66 kg in a decade. That is plainly impossible. What actually happens is that he loses weight quickly at first, then more slowly, and levels off about 6 kg lighter after two or three years. The difference between the two answers is the most useful idea in the science of body weight: **the body's energy use changes as its weight changes**.

### The balance
Energy is conserved ([[physics:first-law-thermodynamics|the first law of thermodynamics]]): the energy eaten either is spent or is stored, mostly as fat and glycogen. Energy out has three parts:

- **Resting metabolism** — the heart, brain, liver, kidneys and muscles ticking over — about 60–70 % of the total for most people.
- **The thermic effect of food** — the cost of digesting and storing a meal — about 10 %.
- **Physical activity** — exercise and everyday movement such as walking, standing and fidgeting — the most variable part, from about 15 % to well over 30 %.

Resting energy use can be estimated from weight, height, age and sex with the Mifflin–St Jeor equation, and total use by multiplying by a physical activity level (about 1.2 for very inactive people to 1.9 or more for very active ones). [The medical calculators](#/tools/clinical/body) do both. These are population averages with an error of about ±10 % for an individual; the gold standard in research, doubly labelled water, shows how much people really differ.

### Where the 7 700 comes from, and why it misleads
Fat tissue is roughly 87 % pure fat at about 9 kcal per gram, giving about 7 700 kcal per kg. The **static rule** assumes the gap between intake and expenditure stays fixed forever:

$$\\Delta W = \\frac{\\Delta I \\cdot t}{\\rho}, \\qquad \\rho \\approx 7\\,700\\ \\text{kcal/kg}$$

But as weight falls, expenditure falls too: a smaller body needs less energy at rest, moving it costs less, and metabolism often drops a little further than the loss of tissue alone explains (*adaptive thermogenesis*; how much is debated). Research models (Hall and colleagues, 2011) put the total at roughly 22 kcal a day for each kilogram of weight change in adults. The gap therefore shrinks as weight changes, and weight settles where it has closed:

$$\\Delta W(t) = \\frac{\\Delta I}{\\varepsilon}\\left(1 - e^{-\\varepsilon t/\\rho}\\right), \\qquad \\Delta W_\\infty = \\frac{\\Delta I}{\\varepsilon}$$

With $\\varepsilon \\approx 22$ kcal/day per kg, the time constant $\\rho/\\varepsilon$ is about a year: about half the eventual change comes within eight months and nearly all within three years (a one-compartment simplification; for people with more body fat it is slower still). A permanent change of 100 kcal a day moves weight by about 4.5 kg in the end, not 4.7 kg every year. Early losses on a new diet are faster than either model because glycogen is used up and the water stored with it is lost.

### Appetite pushes back
Expenditure is not the only thing that adapts. After weight loss, hunger hormones rise and satiety signals fall; one 2016 study estimated that appetite increases by about 100 kcal a day for every kilogram lost. That is why weight regain after a diet is the rule rather than the exception: it is biology defending a familiar weight, not a failure of character. It is also why medicines that act on appetite ([[obesity]]) produce larger losses than diets alone, and why weight usually returns when they are stopped.

### Activity and weight
Exercise uses energy, yet on its own it usually produces modest weight loss — a few kilograms — partly because appetite and other activity compensate, and possibly because total energy use is partly constrained (studies of very active hunter-gatherers found daily energy use similar to that of city dwellers of the same size; this idea is still debated). But activity has large benefits for the heart, blood sugar, mood and bones whatever happens to weight, and it helps people keep lost weight off — see [[physical-activity]].

### Beyond willpower
Genes explain a large share of the differences in weight between people (twin studies suggest 40–70 %), and sleep, stress, medicines, money, working hours and the food around us all shape energy balance. Understanding the arithmetic is useful; judging people by it is not.

> [!note] If counting calories, weighing yourself or thinking about food causes distress, or eating feels out of control, talk to a doctor — see [[eating-disorders]].
`,
  ideas: [
    'Change in stored energy = energy in − energy out; out is resting metabolism (60–70 %), digesting food (~10 %) and activity (the most variable).',
    'The 7 700 kcal/kg (3 500 kcal/lb) rule assumes the energy gap stays fixed, so it predicts steady loss forever.',
    'As weight changes, energy use changes by roughly 22 kcal/day per kg, so weight levels off at a new plateau: ΔW∞ ≈ ΔI/ε.',
    'The time constant is about a year: half the change within about eight months, nearly all within three years.',
    'Appetite also pushes back after weight loss, which explains why regain is common — biology, not a lack of willpower.'
  ],
  pitfalls: [
    'Cutting 500 kcal a day loses half a kilo a week, week after week — The loss slows as the body adapts; over years the total is far smaller than the static rule predicts.',
    'People who regain weight simply lacked willpower — Falling energy use and rising appetite actively push weight back; regain is the typical biological response.',
    'Exercise is the main way to lose weight — Activity alone usually gives modest losses, but it improves health at any weight and helps keep lost weight off.'
  ],
  formulas: [
    {
      name: 'Resting energy use (Mifflin–St Jeor)',
      expr: 'BMR = 10*W + 6.25*H - 5*A + s', tex: '\\text{BMR} = 10\\,W + 6.25\\,H - 5\\,A + s',
      vars: {
        BMR: { name: 'resting energy use (kcal/day)', tex: '\\text{BMR}' },
        W: { name: 'body weight (kg)', value: 70 },
        H: { name: 'height (cm)', value: 165 },
        A: { name: 'age (years)', value: 40 },
        s: { name: 'sex constant (+5 for men, −161 for women)', value: -161, signed: true, fixed: true }
      },
      note: 'An empirical fit from 1990: within about 10 % for most adults, less accurate at the extremes of body size. The body calculator (Tools → Medical calculators) computes it.',
      practice: { unknowns: ['BMR', 'W'] },
      stories: { BMR: 'Estimate the resting energy use of a {A}-year-old woman weighing {W} and {H} tall (sex constant {s}).', W: 'A woman aged {A}, {H} tall (sex constant {s}), has an estimated resting energy use of {BMR}. What does she weigh?' }
    },
    {
      name: 'Daily energy use',
      expr: 'TDEE = BMR*PAL', tex: '\\text{TDEE} = \\text{BMR} \\times \\text{PAL}',
      vars: {
        TDEE: { name: 'total daily energy use (kcal/day)', tex: '\\text{TDEE}' },
        BMR: { name: 'resting energy use (kcal/day)', value: 1370, tex: '\\text{BMR}' },
        PAL: { name: 'physical activity level', value: 1.55, min: 1.1, max: 2.5, tex: '\\text{PAL}' }
      },
      note: 'PAL about 1.2 for very inactive people, 1.4–1.7 for most, 1.9 or more for very active people or heavy physical work.',
      stories: { TDEE: 'Someone\'s resting energy use is {BMR} and their physical activity level {PAL}. What is their total daily energy use?' }
    },
    {
      name: 'The static rule (7 700 kcal per kg)',
      expr: 'dW = dI*t/rho', tex: '\\Delta W = \\frac{\\Delta I \\cdot t}{\\rho}',
      vars: {
        dW: { name: 'weight change (kg)', signed: true, tex: '\\Delta W' },
        dI: { name: 'change in daily intake (kcal/day)', value: 100, signed: true, tex: '\\Delta I' },
        t: { name: 'time (days)', value: 365 },
        rho: { name: 'energy per kg of body weight (kcal/kg)', value: 7700, fixed: true, tex: '\\rho' }
      },
      note: 'Assumes energy use never changes — reasonable over a few weeks, badly wrong over years.',
      practice: { unknowns: ['dW', 't'] },
      stories: { dW: 'By the static rule, what weight change follows from eating {dI} more for {t}?' }
    },
    {
      name: 'The adapting body',
      expr: 'dW = dI/eps*(1 - exp(-t*eps/rho))', tex: '\\Delta W = \\frac{\\Delta I}{\\varepsilon}\\left(1 - e^{-\\varepsilon t/\\rho}\\right)',
      vars: {
        dW: { name: 'weight change (kg)', signed: true, tex: '\\Delta W' },
        dI: { name: 'change in daily intake (kcal/day)', value: 100, signed: true, tex: '\\Delta I' },
        eps: { name: 'change in energy use per kg of weight change (kcal/day per kg)', value: 22, tex: '\\varepsilon' },
        t: { name: 'time (days)', value: 365 },
        rho: { name: 'energy per kg of body weight (kcal/kg)', value: 7700, fixed: true, tex: '\\rho' }
      },
      note: 'A one-compartment simplification of research models (Hall and colleagues, 2011). ε ≈ 22 kcal/day per kg; the plateau is ΔI/ε and the time constant ρ/ε, about a year.',
      practice: { unknowns: ['dW', 'dI'] },
      stories: { dW: 'Someone permanently changes their intake by {dI}. With ε = {eps}, what is their weight change after {t}?', dI: 'What permanent change in daily intake would change weight by {dW} after {t}, with ε = {eps}?' }
    }
  ],
  examples: [
    {
      title: 'The can of soft drink',
      q: 'Daniel stops a daily 140 kcal soft drink. Compare the static rule with the adapting-body model after 1, 3 and 10 years.',
      steps: [
        'Static rule: $140 \\times 365 / 7700 = 6.6$ kg a year — 66 kg after ten years.',
        'Adapting body: plateau $140/22 = 6.4$ kg; time constant $7700/22 = 350$ days.',
        'After 1 year: $6.4 \\times (1 - e^{-365/350}) = 6.4 \\times 0.65 = 4.1$ kg. After 3 years: $6.4 \\times 0.96 = 6.1$ kg. After 10 years: still about 6.4 kg.',
        'A real, lasting benefit — and a realistic one. A small permanent change is worth far more than a large temporary one.'
      ],
      a: 'The static rule claims 66 kg in ten years; the adapting body loses about 4 kg in the first year and levels off near 6 kg.'
    },
    {
      title: 'Six months of dieting, then old habits',
      q: 'Someone eats 800 kcal a day less for six months (182 days), then returns to their previous intake. What does each model predict?',
      steps: [
        'Static rule: $800 \\times 182 / 7700 = 18.9$ kg lost, and kept off.',
        'Adapting body: $800/22 \\times (1 - e^{-182/350}) = 36.4 \\times 0.41 = 14.7$ kg lost at six months.',
        'Back at the old intake, expenditure is now below intake, so weight climbs back with the same time constant: 5.2 kg below the start after another year, 1.8 kg after two.',
        'Rising appetite usually makes regain faster still. This is why lasting changes, and support to keep them, matter more than the size of the first loss.'
      ],
      a: 'About 15 kg lost at six months, most of it regained within two years once the old intake returns.'
    },
    {
      title: 'Estimating energy needs',
      q: 'Estimate the resting and total daily energy use of a 40-year-old woman, 165 cm tall, weighing 70 kg, who is moderately active (PAL 1.55).',
      steps: [
        'Resting: $10 \\times 70 + 6.25 \\times 165 - 5 \\times 40 - 161 = 1\\,370$ kcal/day.',
        'Total: $1\\,370 \\times 1.55 = 2\\,124$ kcal/day.',
        'For an individual the true value could easily be 10 % either way — about ±200 kcal — so such estimates are a starting point, not a prescription.'
      ],
      a: 'About 1 370 kcal/day at rest and about 2 100 kcal/day in total.'
    }
  ],
  quiz: [
    { q: 'You permanently eat 100 kcal a day less. According to the adapting-body model, what happens over ten years?', choices: ['about 47 kg is lost, steadily', 'about 4–5 kg is lost, most of it in the first two to three years', 'nothing, because the body adapts completely', 'about 20 kg is lost in the first year'], a: 1,
      why: 'Energy use falls by about 22 kcal/day per kg lost, so the gap closes at about 100/22 ≈ 4.5 kg, reached mostly within three years. The static rule\'s 47 kg ignores this adaptation.' },
    { q: 'Regaining weight after a diet shows a lack of willpower.', a: false,
      why: 'After weight loss, energy use falls and appetite rises — biological responses that push weight back. Regain is the common outcome, not a moral failure.' },
    { q: 'Someone\'s resting energy use is 1 500 kcal/day and their physical activity level is 1.6. What is their total daily energy use?', answer: 2400, unit: 'kcal/day',
      why: '$1\\,500 \\times 1.6 = 2\\,400$ kcal/day.' },
    { q: 'For most people, which part of daily energy use is largest?', choices: ['exercise', 'resting metabolism', 'digesting food', 'keeping warm by shivering'], a: 1,
      why: 'Resting metabolism — the organs and muscles ticking over — is about 60–70 % of the total for most people. Digesting food is about 10 %; activity varies most.' },
    { q: 'Why does weight loss slow down even when someone sticks to the same diet?', choices: ['the diet stops working because the body is starving', 'energy use falls as weight falls, so the gap between intake and expenditure shrinks', 'water retention hides fat loss for ever', 'muscle weighs more than fat'], a: 1,
      why: 'A lighter body uses less energy at rest and in movement, and metabolism may adapt a little more. The energy gap shrinks, so loss slows towards a plateau.' }
  ],
  applications: ['Setting realistic expectations for weight change with a dietitian or doctor.', 'Understanding why small permanent changes beat large temporary ones.', 'Research models used in obesity trials and public-health policy (e.g. the effect of sugar taxes).', 'Estimating energy needs in hospital, sport and pregnancy.'],
  sim: 'gi-energy-balance'
},

{
  id: 'obesity', parent: 'nutrition', title: 'Obesity', level: 2,
  short: 'A chronic, relapsing condition of excess body fat that raises the risk of diabetes, heart disease, fatty liver disease and more; how it is measured, why it is so common, and how lifestyle support, medicines and surgery treat it.',
  keywords: ['obesity', 'overweight', 'body mass index', 'BMI', 'waist circumference', 'waist-to-height ratio', 'clinical obesity', 'weight stigma', 'GLP-1 receptor agonist', 'semaglutide', 'tirzepatide', 'liraglutide', 'bariatric surgery', 'metabolic surgery', 'gastric bypass', 'sleeve gastrectomy', 'weight loss', 'weight regain', 'leptin'],
  prereq: ['energy-balance', 'hormone-feedback', 'glucose-regulation'],
  related: ['type2-diabetes', 'metabolic-syndrome', 'liver-disease', 'hypertension', 'sleep-apnea', 'physical-activity', 'healthy-diet', 'eating-disorders', 'cancer-prevention', 'atherosclerosis', 'macronutrients'],
  body: `
Sam is 45. His weight has crept up by about a kilogram a year since his twenties; he has lost ten kilograms twice on diets and regained it both times. He snores, his knees ache, and a routine check finds raised blood pressure, blood sugar in the prediabetes range and a fatty liver. His doctor measures his waist as well as his weight, asks about sleep, mood, medicines and what he has tried, and talks through options — without blame. That conversation is what modern obesity care is meant to look like.

### What obesity is
WHO defines obesity as abnormal or excessive fat accumulation that presents a risk to health. For adults it is usually screened for with the **body mass index**, weight divided by height squared:

| BMI (kg/m²), adults | WHO category |
|---|---|
| below 18.5 | underweight |
| 18.5–24.9 | healthy range |
| 25–29.9 | overweight |
| 30–34.9, 35–39.9, 40 and above | obesity, classes I, II and III |

BMI is a quick screen, not a diagnosis: it cannot tell muscle from fat or show where the fat is, and health risks begin at lower BMI in many Asian populations, for whom lower action points (such as 23 and 27.5) are used. Children are assessed on growth charts for their age and sex. Fat inside the abdomen matters most, so **waist size** adds a lot: a waist more than half your height signals raised risk (UK NICE guidance, 2022). A 2025 international commission proposed confirming excess fat with such measures rather than BMI alone, and separating *clinical obesity* — excess fat already causing illness or limiting daily life — from *preclinical obesity*, where risk is raised but organs still work normally.

In 2022, WHO estimated, 890 million adults (16 %) were living with obesity and 2.5 billion (43 %) with overweight, obesity included; adult obesity worldwide has more than doubled since 1990, and some 160 million children and adolescents also live with it.

### A chronic disease, not a character flaw
WHO, the World Obesity Federation and many medical associations describe obesity as a chronic, relapsing disease. Body weight is regulated: the brain reads signals from fat (leptin) and from the gut (ghrelin, GLP-1 and others) and defends a familiar range, so after weight loss hunger rises and energy use falls ([[energy-balance]]). Genes account for much of the difference between people (twin studies suggest 40–70 %), and a few people have single-gene forms. The rise over recent decades, though, is environmental: cheap, energy-dense, heavily marketed foods; drinks full of sugar; sedentary work and transport; short sleep; stress; and some medicines. **Weight stigma** is common, including in healthcare; it does not motivate weight loss, and it harms health by keeping people away from care.

### Why it matters
Excess body fat — especially inside the abdomen — raises the risk of [[type2-diabetes|type 2 diabetes]] (most strongly), [[hypertension|high blood pressure]], heart disease and stroke, fatty [[liver-disease|liver disease]], [[sleep-apnea|sleep apnoea]], osteoarthritis of the knees and hips, gallstones, fertility problems and depression, and it is linked with at least 13 kinds of cancer. Not everyone with a high BMI has these problems, which is why assessment looks at health, not just size. Modest weight loss helps a lot: losing 5–10 % improves blood sugar, blood pressure, blood fats and liver fat, and in people with prediabetes a lifestyle programme with about 7 % weight loss cut new cases of diabetes by 58 % over three years (the US Diabetes Prevention Program, 2002).

### Treatments
Treatment aims at health, not a number on the scales, and is a long-term plan agreed between a person and their care team.

- **Lifestyle and behavioural support** — changes in eating that can be kept up (no single diet is best), more activity, better sleep and structured support. Intensive programmes average 5–10 % weight loss at a year, with partial regain later; they help even when little weight is lost.
- **Medicines**, added to lifestyle support, usually for adults with a BMI of 30 or more, or 27 or more with a weight-related condition (criteria vary by country). **GLP-1 receptor agonists** (liraglutide, semaglutide) mimic a gut hormone that slows stomach emptying and reduces appetite in the brain: in a 2021 trial, semaglutide lowered weight by about 15 % on average over 68 weeks, against about 2 % with placebo. A **dual GIP and GLP-1 receptor agonist** (tirzepatide) gave about 20 % at its highest dose over 72 weeks (2022). In people with heart disease and overweight or obesity, semaglutide cut heart attacks, strokes and cardiovascular deaths by about 20 % (2023). Common side effects are nausea, vomiting, diarrhoea or constipation, usually early; gallbladder problems and, rarely, pancreatitis occur; some muscle is lost with the fat. When the medicine stops, most of the weight usually returns — in one trial about two-thirds within a year — because it treats a chronic condition, as blood-pressure medicines do. Cost and supply limit access in many countries, and products bought outside regulated pharmacies may be counterfeit.
- **Metabolic and bariatric surgery** (sleeve gastrectomy, gastric bypass) is the most effective treatment for severe obesity: about 25–30 % weight loss sustained for many years, frequent remission of type 2 diabetes and longer life in long-term studies. International guidelines (2022) suggest considering it from a BMI of 35, or 30 with metabolic disease (lower in Asian populations). It needs lifelong follow-up for vitamins and minerals.

> [!warn] Severe abdominal pain that does not go away — often spreading to the back, with or without vomiting — while taking a GLP-1 receptor agonist can be pancreatitis or gallbladder disease: seek urgent medical care, and if the pain is severe or you feel very unwell, call your local emergency number.

> [!note] Weight, food and body image can be painful subjects. If eating feels out of control or dieting is harming your health, see [[eating-disorders]] and talk to a doctor.
`,
  ideas: [
    'Obesity is excess body fat that harms or threatens health; BMI (weight ÷ height²) screens for it, and waist size adds information about risk.',
    'Body weight is biologically defended, and genes, environment, sleep, stress and medicines all contribute — obesity is a chronic disease, not a character flaw.',
    'Losing 5–10 % of body weight brings real improvements in blood sugar, blood pressure and liver fat.',
    'Treatments: lifestyle support (5–10 % average loss), GLP-1-based medicines (about 15–20 % in trials), and surgery (about 25–30 %).',
    'Weight usually returns when treatment stops, as with other chronic conditions; weight stigma harms health.'
  ],
  pitfalls: [
    'Obesity is simply a lack of willpower — Appetite, energy use and fat storage are regulated by genes and hormones and shaped by the food environment; blame worsens health and deters care.',
    'A normal BMI means healthy and a high BMI means ill — BMI ignores muscle and fat distribution; waist size, fitness, blood tests and blood pressure give a fuller picture.',
    'If a weight-loss medicine works, you can stop it once the weight is off — In trials most of the weight returned after stopping; like blood-pressure medicines, these treat a chronic condition while they are taken.'
  ],
  formulas: [
    {
      name: 'Body mass index',
      expr: 'BMI = W/h^2', tex: '\\text{BMI} = \\frac{W}{h^2}',
      vars: {
        BMI: { name: 'body mass index', q: 'arealdensity', unit: 'kg/m²', tex: '\\text{BMI}' },
        W: { name: 'body weight', q: 'mass', unit: 'kg', value: 95 },
        h: { name: 'height', q: 'length', unit: 'm', value: 1.75 }
      },
      note: 'WHO adult categories: 18.5–24.9 healthy range, 25–29.9 overweight, 30 and above obesity; lower action points for many Asian populations. Not for children, and not a verdict on any one person.',
      stories: { BMI: 'An adult weighs {W} and is {h} tall. What is their BMI?', W: 'At a height of {h}, what weight gives a BMI of {BMI}?' }
    },
    {
      name: 'Waist-to-height ratio',
      expr: 'R = w/h', tex: 'R = \\frac{w}{h}',
      vars: {
        R: { name: 'waist-to-height ratio' },
        w: { name: 'waist circumference', q: 'length', unit: 'cm', value: 94 },
        h: { name: 'height', q: 'length', unit: 'cm', value: 175 }
      },
      note: 'Measure the waist midway between the lowest rib and the top of the hip bone, after breathing out. 0.5 or more: raised health risk; 0.6 or more: high (NICE 2022).',
      stories: { R: 'Someone {h} tall has a waist of {w}. What is their waist-to-height ratio?', w: 'For someone {h} tall, what waist gives a ratio of {R}?' }
    },
    {
      name: 'Percentage weight change',
      expr: 'p = (W0 - W1)/W0', tex: 'p = \\frac{W_0 - W_1}{W_0}',
      vars: {
        p: { name: 'share of body weight lost', q: 'ratio', unit: '%', signed: true },
        W0: { name: 'starting weight', q: 'mass', unit: 'kg', value: 120, tex: 'W_0' },
        W1: { name: 'weight now', q: 'mass', unit: 'kg', value: 108, tex: 'W_1' }
      },
      note: 'Treatments are compared in percentages because the same kilograms mean more for a smaller person. 5–10 % already improves health.',
      stories: { p: 'Someone goes from {W0} to {W1}. What percentage of their weight have they lost?', W1: 'Starting at {W0}, what weight corresponds to a loss of {p}?' }
    }
  ],
  examples: [
    {
      title: 'Same BMI, different risk',
      q: 'Two men are both 1.80 m tall and weigh 97 kg. One is a rugby player with a 86 cm waist; the other has a desk job and a 110 cm waist. Compare their BMI and waist-to-height ratios.',
      steps: [
        'BMI for both: $97/1.80^2 = 29.9$ kg/m² — "overweight" by the WHO categories.',
        'Rugby player: $86/180 = 0.48$, below 0.5. Desk worker: $110/180 = 0.61$, in the high-risk band.',
        'The first man\'s weight is largely muscle; the second carries fat inside the abdomen, the kind linked with diabetes and heart disease. BMI alone could not tell them apart.'
      ],
      a: 'Identical BMI (29.9), but waist-to-height ratios of 0.48 and 0.61 — very different risks.'
    },
    {
      title: 'What the averages mean',
      q: 'Sam weighs 120 kg. Using average results from trials, how much might he lose with an intensive lifestyle programme (5–10 %), a GLP-1 receptor agonist (about 15 %), a dual GIP/GLP-1 agonist (about 20 %) or surgery (25–30 %)?',
      steps: [
        'Lifestyle: $0.05$–$0.10 \\times 120 = 6$–$12$ kg.',
        'GLP-1 receptor agonist: $0.15 \\times 120 = 18$ kg; dual agonist: $0.20 \\times 120 = 24$ kg.',
        'Surgery: $0.25$–$0.30 \\times 120 = 30$–$36$ kg.',
        'These are averages: some people lose much more, some little. Even the smallest figure — 6 kg — would improve his blood pressure, blood sugar and liver fat. Which option suits him is a decision for Sam and his care team, weighing benefits, side effects, cost and his preferences.'
      ],
      a: 'Roughly 6–12, 18, 24 and 30–36 kg respectively — all averages with wide individual variation.'
    }
  ],
  quiz: [
    { q: 'An adult weighs 100 kg and is 1.80 m tall. What is their BMI?', answer: 30.9, unit: 'kg/m²',
      why: '$100/1.80^2 = 100/3.24 = 30.9$ kg/m², in the WHO obesity class I range — a prompt to look at waist, blood pressure and blood tests, not a verdict by itself.' },
    { q: 'Obesity is simply the result of a lack of willpower.', a: false,
      why: 'Body weight is regulated by the brain and hormones, strongly influenced by genes, and shaped by the food environment, sleep, stress and medicines. Major health bodies describe obesity as a chronic disease.' },
    { q: 'Which measurement adds most information about health risk to BMI?', choices: ['shoe size', 'waist circumference or waist-to-height ratio', 'weight measured twice', 'the time of day of weighing'], a: 1,
      why: 'Fat inside the abdomen carries the most risk. A waist more than half one\'s height signals raised risk even at the same BMI.' },
    { q: 'In trials, what happened to most people\'s weight after they stopped a GLP-1 receptor agonist?', choices: ['it stayed off permanently', 'much of it returned within a year', 'it kept falling', 'it rose far above the starting weight in everyone'], a: 1,
      why: 'Once the appetite-lowering effect ends, the body\'s defence of its weight takes over again; in one trial about two-thirds of the lost weight returned within a year.' },
    { q: 'Which treatment gives the largest long-term weight loss for severe obesity, on average?', choices: ['a very low-calorie diet for a month', 'an exercise programme alone', 'metabolic and bariatric surgery', 'a multivitamin'], a: 2,
      why: 'Surgery averages about 25–30 % weight loss sustained over many years, with frequent remission of type 2 diabetes. Medicines come next; lifestyle support alone averages 5–10 %.' }
  ],
  applications: ['Screening for obesity-related conditions in primary care.', 'Choosing between lifestyle support, medicines and surgery with a specialist team.', 'Public-health measures: sugar taxes, food labelling, marketing limits, active transport.', 'Reducing weight stigma in healthcare.'],
  sim: { id: 'gi-energy-balance', params: { scenario: 'medicine' } }
}

);
